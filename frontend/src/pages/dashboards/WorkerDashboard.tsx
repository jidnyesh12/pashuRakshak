import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { reportsAPI } from '../../utils/api';
import type { AnimalReport } from '../../types';
import DashboardLayout from '../../components/layout/DashboardLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { MapPin, Clock, AlertTriangle, Navigation, Locate, CheckCircle2, Circle, ArrowRight, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { socketService } from '../../utils/socket';

// Fix for default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const workerIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});

const animalIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});

// Fallback images for animals
const animalImages: Record<string, string> = {
    'dog': 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&q=80',
    'cat': 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&q=80',
    'bird': 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=400&q=80',
    'cow': 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=400&q=80',
    'default': 'https://images.unsplash.com/photo-1474511320723-9a56873571b7?w=400&q=80'
};

const WorkerDashboard: React.FC = () => {
    const { user } = useAuth();
    const [tasks, setTasks] = useState<AnimalReport[]>([]);
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);
    const [workerLocation, setWorkerLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [locationLoading, setLocationLoading] = useState(false);
    const [isTracking, setIsTracking] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

    useEffect(() => {
        socketService.connect();
        const timer = setTimeout(() => setMounted(true), 100);
        return () => { socketService.disconnect(); clearTimeout(timer); };
    }, []);

    useEffect(() => {
        let watchId: number;
        if (navigator.geolocation && user?.id) {
            setIsTracking(true);
            watchId = navigator.geolocation.watchPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setWorkerLocation({ lat: latitude, lng: longitude });
                    tasks.filter(t => t.status !== 'CASE_RESOLVED').forEach(task => {
                        socketService.send('/app/location.update', {
                            trackingId: task.trackingId, workerId: user.id, latitude, longitude
                        });
                    });
                },
                () => setIsTracking(false),
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );
        }
        return () => { if (watchId) navigator.geolocation.clearWatch(watchId); };
    }, [tasks, user]);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                if (user?.id) {
                    const data = await reportsAPI.getWorkerTasks(user.id);
                    setTasks(data);
                }
            } catch { toast.error('Failed to load tasks'); }
            finally { setLoading(false); }
        };
        fetchTasks();
    }, [user]);

    const getAnimalImage = (task: AnimalReport): string => {
        if (task.imageUrls?.[0]) return task.imageUrls[0];
        return animalImages[task.animalType?.toLowerCase()] || animalImages.default;
    };

    const getWorkerLocation = () => {
        setLocationLoading(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => { setWorkerLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }); toast.success('Location updated'); setLocationLoading(false); },
            () => { toast.error('Unable to get location'); setLocationLoading(false); }
        );
    };

    const openGoogleMaps = (lat: number, lng: number) => {
        const url = workerLocation
            ? `https://www.google.com/maps/dir/?api=1&origin=${workerLocation.lat},${workerLocation.lng}&destination=${lat},${lng}&travelmode=driving`
            : `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
        window.open(url, '_blank');
    };

    const handleStatusUpdate = async (trackingId: string, newStatus: string) => {
        if (newStatus === 'CASE_RESOLVED' && !window.confirm('Mark as resolved?')) return;
        setUpdatingStatus(trackingId);
        try {
            await reportsAPI.updateReportStatus(trackingId, newStatus);
            toast.success('Status updated');
            if (user?.id) setTasks(await reportsAPI.getWorkerTasks(user.id));
        } catch { toast.error('Update failed'); }
        finally { setUpdatingStatus(null); }
    };

    const getTimeSince = (date: string): string => {
        const hours = Math.floor((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60));
        if (hours < 1) return 'Just now';
        if (hours < 24) return `${hours}h ago`;
        return `${Math.floor(hours / 24)}d ago`;
    };

    const activeTasks = tasks.filter(t => t.status !== 'CASE_RESOLVED');
    const resolvedTasks = tasks.filter(t => t.status === 'CASE_RESOLVED');
    const urgentTasks = activeTasks.filter(t => (Date.now() - new Date(t.createdAt).getTime()) / (1000 * 60 * 60) > 2 || t.status === 'SUBMITTED');

    if (loading) {
        return <DashboardLayout><div className="flex justify-center items-center h-[60vh]"><LoadingSpinner size="lg" /></div></DashboardLayout>;
    }

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto font-['Inter',system-ui,sans-serif]">
                
                {/* Operational Overview Strip */}
                <section className={`mb-8 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
                    <div className="flex items-center justify-between py-5 px-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-10">
                            <div className="text-center">
                                <p className="text-3xl font-bold text-slate-900">{tasks.length}</p>
                                <p className="text-sm text-slate-400">Total</p>
                            </div>
                            <div className="w-px h-10 bg-slate-100" />
                            <div className="text-center">
                                <p className="text-3xl font-bold text-emerald-600">{activeTasks.length}</p>
                                <p className="text-sm text-slate-400">Active</p>
                            </div>
                            <div className="w-px h-10 bg-slate-100" />
                            <div className="text-center">
                                <p className="text-3xl font-bold text-slate-400">{resolvedTasks.length}</p>
                                <p className="text-sm text-slate-400">Resolved</p>
                            </div>
                        </div>
                        {isTracking && (
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-full text-sm text-emerald-600">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                                </span>
                                <span className="font-medium">Live</span>
                            </div>
                        )}
                    </div>
                </section>

                {/* Action Required */}
                {urgentTasks.length > 0 && (
                    <section className={`mb-8 transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-100">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="animate-pulse"><AlertTriangle className="w-5 h-5 text-amber-600" /></div>
                                <h2 className="text-sm font-bold text-amber-800 uppercase tracking-wider">Action Required</h2>
                            </div>
                            <div className="space-y-2">
                                {urgentTasks.slice(0, 2).map(task => (
                                    <div key={task.id} className="flex items-center justify-between p-3 bg-white rounded-xl border border-amber-100">
                                        <div className="flex items-center gap-3">
                                            <img src={getAnimalImage(task)} alt="" className="w-12 h-12 rounded-lg object-cover" />
                                            <div>
                                                <p className="font-semibold text-slate-900 capitalize">{task.animalType?.toLowerCase()} <span className="text-amber-600 text-sm">#{task.trackingId}</span></p>
                                                <p className="text-sm text-slate-500 flex items-center gap-2">
                                                    <MapPin className="w-3 h-3" />{task.address?.split(',')[0]}
                                                    <Clock className="w-3 h-3 ml-2" />{getTimeSince(task.createdAt)}
                                                </p>
                                            </div>
                                        </div>
                                        <button onClick={() => document.getElementById(`task-${task.id}`)?.scrollIntoView({ behavior: 'smooth' })} className="text-sm font-semibold text-amber-700 hover:text-amber-900 flex items-center gap-1">
                                            View <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Current Assignments */}
                <section className={`mb-10 transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <h2 className="text-lg font-bold text-slate-900 mb-6">Current Assignments</h2>

                    {activeTasks.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
                            <CheckCircle2 className="w-12 h-12 text-emerald-200 mx-auto mb-4" />
                            <p className="text-slate-500">No active assignments</p>
                            <p className="text-sm text-slate-400 mt-1">You're all caught up!</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {activeTasks.map(task => (
                                <div key={task.id} id={`task-${task.id}`} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden scroll-mt-24 hover:shadow-md transition-shadow">
                                    <div className="flex flex-col lg:flex-row">
                                        {/* Image Section */}
                                        <div className="lg:w-72 h-56 lg:h-auto relative flex-shrink-0">
                                            <img src={getAnimalImage(task)} alt={task.animalType} className="w-full h-full object-cover" />
                                            <div className="absolute top-4 left-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                    task.status === 'HELP_ON_THE_WAY' ? 'bg-blue-500 text-white' :
                                                    task.status === 'ANIMAL_RESCUED' ? 'bg-purple-500 text-white' :
                                                    'bg-amber-500 text-white'
                                                }`}>
                                                    {task.status?.replace(/_/g, ' ')}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Content Section */}
                                        <div className="flex-1 p-6">
                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <h3 className="text-xl font-bold text-slate-900 capitalize">{task.animalType?.toLowerCase()}</h3>
                                                        <span className="text-sm font-mono text-slate-400">#{task.trackingId}</span>
                                                    </div>
                                                    <p className="text-slate-500 flex items-center gap-1.5">
                                                        <MapPin className="w-4 h-4 text-emerald-500" />
                                                        {task.address}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm text-slate-400">Assigned {getTimeSince(task.createdAt)}</p>
                                                </div>
                                            </div>

                                            {task.condition && (
                                                <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-amber-50 rounded-lg text-amber-700 text-sm font-medium">
                                                    <AlertTriangle className="w-4 h-4" />
                                                    {task.condition}
                                                </div>
                                            )}

                                            {/* Map Preview */}
                                            {task.latitude && task.longitude && (
                                                <div className="h-64 rounded-xl overflow-hidden border border-slate-100 mb-4">
                                                    <MapContainer center={[task.latitude, task.longitude]} zoom={14} style={{ height: '100%', width: '100%' }} zoomControl={false}>
                                                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                                        <Marker position={[task.latitude, task.longitude]} icon={animalIcon}><Popup>{task.address}</Popup></Marker>
                                                        {workerLocation && (
                                                            <>
                                                                <Marker position={[workerLocation.lat, workerLocation.lng]} icon={workerIcon}><Popup>You</Popup></Marker>
                                                                <Polyline positions={[[workerLocation.lat, workerLocation.lng], [task.latitude, task.longitude]]} pathOptions={{ color: '#10b981', dashArray: '8, 8', opacity: 0.7 }} />
                                                            </>
                                                        )}
                                                    </MapContainer>
                                                </div>
                                            )}

                                            {/* Actions Row */}
                                            <div className="flex flex-wrap items-center gap-3">
                                                {task.latitude && task.longitude && (
                                                    <button onClick={() => openGoogleMaps(task.latitude, task.longitude)} className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors">
                                                        <Navigation className="w-4 h-4" /> Navigate
                                                    </button>
                                                )}
                                                <button onClick={getWorkerLocation} disabled={locationLoading} className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors">
                                                    <Locate className="w-4 h-4" /> {locationLoading ? 'Locating...' : 'My Location'}
                                                </button>

                                                <div className="flex-1" />

                                                {/* Status Buttons */}
                                                <div className="flex items-center gap-2">
                                                    <button onClick={() => handleStatusUpdate(task.trackingId, 'HELP_ON_THE_WAY')} disabled={updatingStatus === task.trackingId}
                                                        className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${task.status === 'HELP_ON_THE_WAY' ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-300'}`}>
                                                        On the way
                                                    </button>
                                                    <button onClick={() => handleStatusUpdate(task.trackingId, 'ANIMAL_RESCUED')} disabled={updatingStatus === task.trackingId}
                                                        className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${task.status === 'ANIMAL_RESCUED' ? 'bg-purple-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-purple-300'}`}>
                                                        Rescued
                                                    </button>
                                                    <button onClick={() => handleStatusUpdate(task.trackingId, 'CASE_RESOLVED')} disabled={updatingStatus === task.trackingId}
                                                        className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${task.status === 'CASE_RESOLVED' ? 'bg-emerald-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-emerald-300'}`}>
                                                        Resolved
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Task History Section */}
                {resolvedTasks.length > 0 && (
                    <section className={`transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-px flex-1 bg-slate-100" />
                            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Completed Tasks</h2>
                            <div className="h-px flex-1 bg-slate-100" />
                        </div>

                        <div className="space-y-4">
                            {resolvedTasks.slice(0, 5).map(task => (
                                <div key={task.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                                    <img src={getAnimalImage(task)} alt="" className="w-14 h-14 rounded-lg object-cover grayscale opacity-70" />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-slate-700 capitalize">{task.animalType?.toLowerCase()}</span>
                                            <span className="text-sm text-slate-400">#{task.trackingId}</span>
                                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                        </div>
                                        <p className="text-sm text-slate-400 truncate">{task.address}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-slate-400 flex items-center gap-1">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {new Date(task.updatedAt || task.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {resolvedTasks.length > 5 && (
                            <p className="text-center text-sm text-slate-400 mt-4">
                                + {resolvedTasks.length - 5} more completed tasks
                            </p>
                        )}
                    </section>
                )}
            </div>
        </DashboardLayout>
    );
};

export default WorkerDashboard;
