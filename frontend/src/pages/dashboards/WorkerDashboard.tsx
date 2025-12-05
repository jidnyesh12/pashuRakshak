import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { reportsAPI } from '../../utils/api';
import type { AnimalReport } from '../../types';
import DashboardLayout from '../../components/layout/DashboardLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { MapPin, Calendar, AlertTriangle, CheckCircle, Navigation, Locate } from 'lucide-react';
import toast from 'react-hot-toast';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons
const workerIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const animalIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const WorkerDashboard: React.FC = () => {
    const { user } = useAuth();
    const [tasks, setTasks] = useState<AnimalReport[]>([]);
    const [loading, setLoading] = useState(true);
    const [workerLocation, setWorkerLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [locationLoading, setLocationLoading] = useState(false);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                if (user?.id) {
                    const data = await reportsAPI.getWorkerTasks(user.id);
                    setTasks(data);
                }
            } catch (error) {
                console.error('Failed to load tasks', error);
                toast.error('Failed to load assigned tasks');
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
        fetchTasks();
    }, [user]);

    const getWorkerLocation = () => {
        setLocationLoading(true);
        if (!navigator.geolocation) {
            toast.error('Geolocation is not supported by your browser');
            setLocationLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setWorkerLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
                toast.success('Location updated');
                setLocationLoading(false);
            },
            (error) => {
                console.error(error);
                toast.error('Unable to retrieve your location');
                setLocationLoading(false);
            }
        );
    };

    const openGoogleMaps = (targetLat: number, targetLng: number) => {
        if (!workerLocation) {
            // If we don't have worker location, just open map to target
            window.open(`https://www.google.com/maps/search/?api=1&query=${targetLat},${targetLng}`, '_blank');
        } else {
            // If we have both, provide directions
            window.open(`https://www.google.com/maps/dir/?api=1&origin=${workerLocation.lat},${workerLocation.lng}&destination=${targetLat},${targetLng}&travelmode=driving`, '_blank');
        }
    };

    const handleStatusUpdate = async (trackingId: string, newStatus: string) => {
        if (newStatus === 'CASE_RESOLVED') {
            const confirmed = window.confirm('Are you sure you want to mark this case as resolved? This will move it to your history.');
            if (!confirmed) return;
        }

        try {
            await reportsAPI.updateReportStatus(trackingId, newStatus);
            toast.success('Status updated successfully');
            // Refresh tasks
            if (user?.id) {
                const data = await reportsAPI.getWorkerTasks(user.id);
                setTasks(data);
            }
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    if (loading) {
        return (
            <DashboardLayout title="Worker Dashboard" role="NGO_WORKER">
                <LoadingSpinner />
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout title="My Assigned Tasks" role="NGO_WORKER">
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                        <h3 className="text-blue-800 font-bold text-lg mb-1">Total Assigned</h3>
                        <p className="text-3xl font-extrabold text-blue-900">{tasks.length}</p>
                    </div>
                    <div className="bg-yellow-50 p-6 rounded-2xl border border-yellow-100">
                        <h3 className="text-yellow-800 font-bold text-lg mb-1">Pending</h3>
                        <p className="text-3xl font-extrabold text-yellow-900">
                            {tasks.filter(t => t.status !== 'CASE_RESOLVED').length}
                        </p>
                    </div>
                    <div className="bg-green-50 p-6 rounded-2xl border border-green-100">
                        <h3 className="text-green-800 font-bold text-lg mb-1">Completed</h3>
                        <p className="text-3xl font-extrabold text-green-900">
                            {tasks.filter(t => t.status === 'CASE_RESOLVED').length}
                        </p>
                    </div>
                </div>

                <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Current Assignments</h2>

                {tasks.filter(t => t.status !== 'CASE_RESOLVED').length === 0 ? (
                    <div className="bg-white rounded-2xl p-8 text-center border border-gray-100 shadow-sm">
                        <p className="text-gray-500">No active tasks assigned.</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {tasks.filter(t => t.status !== 'CASE_RESOLVED').map((task) => (
                            <div key={task.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="w-full md:w-1/3">
                                        <img
                                            src={task.imageUrls[0]}
                                            alt={task.animalType}
                                            className="w-full h-48 object-cover rounded-xl"
                                        />
                                    </div>
                                    <div className="flex-1 space-y-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-700">
                                                        {task.animalType}
                                                    </span>
                                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${task.status === 'CASE_RESOLVED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                                        }`}>
                                                        {task.status.replace(/_/g, ' ')}
                                                    </span>
                                                </div>
                                                <h3 className="text-lg font-bold text-gray-900">Case #{task.trackingId}</h3>
                                            </div>
                                            <div className="text-sm text-gray-500 flex items-center gap-1">
                                                <Calendar className="h-4 w-4" />
                                                {new Date(task.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                                            <div className="flex items-start gap-2">
                                                <MapPin className="h-4 w-4 mt-1 text-gray-400" />
                                                <span>{task.address}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <AlertTriangle className="h-4 w-4 text-red-400" />
                                                <span className="font-medium text-red-600">{task.condition}</span>
                                            </div>
                                        </div>

                                        {/* Map Section - Only show if coordinates exist and not resolved */}
                                        {task.latitude && task.longitude && (
                                            <div className="mt-4 rounded-xl overflow-hidden border border-gray-200 shadow-sm relative z-0">
                                                <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex justify-between items-center">
                                                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Live Location Tracking</span>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={getWorkerLocation}
                                                            className="text-xs flex items-center gap-1 bg-white border border-gray-300 px-2 py-1 rounded hover:bg-gray-50 transition-colors"
                                                            disabled={locationLoading}
                                                        >
                                                            <Locate className="h-3 w-3" />
                                                            {locationLoading ? 'Locating...' : 'My Location'}
                                                        </button>
                                                        <button
                                                            onClick={() => openGoogleMaps(task.latitude, task.longitude)}
                                                            className="text-xs flex items-center gap-1 bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition-colors"
                                                        >
                                                            <Navigation className="h-3 w-3" />
                                                            Navigate
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="h-64 w-full">
                                                    <MapContainer
                                                        center={[task.latitude, task.longitude]}
                                                        zoom={13}
                                                        style={{ height: '100%', width: '100%' }}
                                                    >
                                                        <TileLayer
                                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                        />
                                                        {/* Target (Animal) Marker */}
                                                        <Marker position={[task.latitude, task.longitude]} icon={animalIcon}>
                                                            <Popup>
                                                                <b>{task.animalType}</b><br />
                                                                {task.condition}<br />
                                                                {task.address}
                                                            </Popup>
                                                        </Marker>

                                                        {/* Worker Marker */}
                                                        {workerLocation && (
                                                            <>
                                                                <Marker position={[workerLocation.lat, workerLocation.lng]} icon={workerIcon}>
                                                                    <Popup>You are here</Popup>
                                                                </Marker>
                                                                {/* Line connecting them */}
                                                                <Polyline
                                                                    positions={[
                                                                        [workerLocation.lat, workerLocation.lng],
                                                                        [task.latitude, task.longitude]
                                                                    ]}
                                                                    pathOptions={{ color: 'blue', dashArray: '10, 10', opacity: 0.6 }}
                                                                />
                                                            </>
                                                        )}
                                                    </MapContainer>
                                                </div>
                                            </div>
                                        )}

                                        <div className="bg-gray-50 p-4 rounded-xl">
                                            <p className="text-sm text-gray-600 mb-2 font-medium">Update Status:</p>
                                            <div className="flex flex-wrap gap-2">
                                                <button
                                                    onClick={() => handleStatusUpdate(task.trackingId, 'HELP_ON_THE_WAY')}
                                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${task.status === 'HELP_ON_THE_WAY'
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    On The Way
                                                </button>
                                                <button
                                                    onClick={() => handleStatusUpdate(task.trackingId, 'ANIMAL_RESCUED')}
                                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${task.status === 'ANIMAL_RESCUED'
                                                        ? 'bg-purple-600 text-white'
                                                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    Rescued
                                                </button>
                                                <button
                                                    onClick={() => handleStatusUpdate(task.trackingId, 'CASE_RESOLVED')}
                                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${task.status === 'CASE_RESOLVED'
                                                        ? 'bg-green-600 text-white'
                                                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                                                        }`}
                                                >
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

                {/* Task History Section */}
                {tasks.filter(t => t.status === 'CASE_RESOLVED').length > 0 && (
                    <>
                        <h2 className="text-xl font-bold text-gray-900 mt-12 mb-4">Task History</h2>
                        <div className="grid gap-6 opacity-75">
                            {tasks.filter(t => t.status === 'CASE_RESOLVED').map((task) => (
                                <div key={task.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                    <div className="flex flex-col md:flex-row gap-6">
                                        <div className="w-full md:w-1/4">
                                            <img
                                                src={task.imageUrls[0]}
                                                alt={task.animalType}
                                                className="w-full h-32 object-cover rounded-xl grayscale"
                                            />
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700">
                                                            RESOLVED
                                                        </span>
                                                    </div>
                                                    <h3 className="text-lg font-bold text-gray-900">Case #{task.trackingId}</h3>
                                                </div>
                                                <div className="text-sm text-gray-500 flex items-center gap-1">
                                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                                    Resolved on {new Date(task.updatedAt || task.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>

                                            <div className="text-sm text-gray-600">
                                                <div className="flex items-start gap-2 mb-1">
                                                    <MapPin className="h-4 w-4 mt-1 text-gray-400" />
                                                    <span>{task.address}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <AlertTriangle className="h-4 w-4 text-gray-400" />
                                                    <span className="text-gray-600">{task.condition}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </DashboardLayout>
    );
};

export default WorkerDashboard;
