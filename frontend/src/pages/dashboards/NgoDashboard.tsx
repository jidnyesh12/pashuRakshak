
import React, { useState, useEffect } from 'react';
import {
  CheckCircle,
  AlertTriangle,
  Activity,
  Search,
  Zap,
  Layers
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import { reportsAPI, ngoAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import type { AnimalReport, NGO } from '../../types';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, Polyline } from 'react-leaflet';
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

// Custom Pins
const solvedIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const alertIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Fallback logic for missing coordinates
const getRandomOffset = () => (Math.random() - 0.5) * 0.02;

const NgoDashboard: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [availableReports, setAvailableReports] = useState<AnimalReport[]>([]);
  const [resolvedReports, setResolvedReports] = useState<AnimalReport[]>([]);
  const [inProgressReports, setInProgressReports] = useState<AnimalReport[]>([]);
  const [workerLocations, setWorkerLocations] = useState<Record<string, { lat: number; lng: number }>>({});
  const [stats, setStats] = useState({
    totalAssigned: 0,
    completed: 0,
    inProgress: 0,
    available: 0
  });
  const [ngoInfo, setNgoInfo] = useState<NGO | null>(null);
  const [acceptingReportId, setAcceptingReportId] = useState<number | null>(null);

  // Default center (Mumbai/Pune area or dynamic based on data)
  const defaultCenter: [number, number] = [19.0760, 72.8777];

  useEffect(() => {
    socketService.connect();
    return () => socketService.disconnect();
  }, []);

  // Subscribe to real-time updates for in-progress reports
  useEffect(() => {
    const subscriptions = inProgressReports.map(report => {
      const topic = `/topic/case/${report.trackingId}`;
      return socketService.subscribe(topic, (data) => {
        setWorkerLocations(prev => ({
          ...prev,
          [data.trackingId]: { lat: data.latitude, lng: data.longitude }
        }));
      });
    });

    return () => {
      subscriptions.forEach(sub => sub.unsubscribe());
    };
  }, [inProgressReports]);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      // Fetch NGO info if not already loaded
      let currentNgoInfo = ngoInfo;
      if (!currentNgoInfo && user?.ngoId) {
        try {
          currentNgoInfo = await ngoAPI.getNgoById(user.ngoId);
          setNgoInfo(currentNgoInfo);
        } catch (error) {
          console.error('Failed to load NGO info:', error);
        }
      }

      const [available, assigned] = await Promise.all([
        reportsAPI.getAvailableReports(),
        user?.ngoId ? reportsAPI.getReportsByNgo(user.ngoId) : Promise.resolve([]),
      ]);

      setAvailableReports(available);

      // Filter resolved cases
      const resolved = assigned
        .filter(r => r.status === 'CASE_RESOLVED')
        .map(r => ({
          ...r,
          latitude: r.latitude || (defaultCenter[0] + getRandomOffset()), // Mock coords if missing
          longitude: r.longitude || (defaultCenter[1] + getRandomOffset())
        }));

      setResolvedReports(resolved);

      // Filter in-progress cases
      const inProgress = assigned
        .filter(r => !['CASE_RESOLVED', 'SUBMITTED', 'REJECTED'].includes(r.status))
        .map(r => ({
          ...r,
          latitude: r.latitude || (defaultCenter[0] + getRandomOffset()),
          longitude: r.longitude || (defaultCenter[1] + getRandomOffset())
        }));

      setInProgressReports(inProgress);

      setStats({
        totalAssigned: assigned.length,
        completed: resolved.length,
        inProgress: inProgress.length,
        available: available.length
      });
    } catch (error) {
      console.error(error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Handle accepting a case
  const handleAcceptCase = async (report: AnimalReport) => {
    if (!user?.ngoId || !ngoInfo) {
      toast.error('NGO information not found');
      return;
    }

    setAcceptingReportId(report.id);
    try {
      await reportsAPI.acceptReport(report.trackingId, user.ngoId, ngoInfo.name);
      toast.success(`Case #${report.trackingId} accepted! Go to Track My Cases to assign a worker.`);
      // Refresh dashboard data
      loadDashboardData();
    } catch (error) {
      console.error('Failed to accept case:', error);
      toast.error('Failed to accept case');
    } finally {
      setAcceptingReportId(null);
    }
  };

  if (loading) {
    return (
      <DashboardLayout fullScreen>
        <div className="flex justify-center items-center h-full">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout fullScreen>
      <div className="relative w-full h-full">
        {/* Map Layer */}
        <MapContainer
          center={defaultCenter}
          zoom={12}
          zoomControl={false}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />
          <ZoomControl position="bottomright" />

          {/* Solved Cases Pins */}
          {resolvedReports.map((report) => (
            <Marker
              key={`solved-${report.id}`}
              position={[report.latitude!, report.longitude!]}
              icon={solvedIcon}
            >
              <Popup className="custom-popup">
                <div className="p-2 min-w-[200px]">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="font-bold text-green-700">Case Solved!</span>
                  </div>
                  <img src={report.imageUrls?.[0]} alt="" className="w-full h-24 object-cover rounded-lg mb-2" />
                  <p className="font-bold text-gray-800 capitalize">{report.animalType} Rescue</p>
                  <p className="text-xs text-gray-500 mt-1">{report.location}</p>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* In-Progress Cases (Worker Target) */}
          {inProgressReports.map((report) => (
            <Marker
              key={`progress-${report.id}`}
              position={[report.latitude!, report.longitude!]}
              icon={new L.Icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
              })}
            >
              <Popup>
                <div className="p-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Activity className="h-4 w-4 text-orange-600" />
                    <span className="font-bold text-orange-700">In Progress</span>
                  </div>
                  <p className="font-medium">{report.animalType}</p>
                  <p className="text-xs text-gray-500">Worker: {report.assignedWorkerName || 'Assigned'}</p>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Live Worker Locations */}
          {inProgressReports.map(report => {
            const liveLoc = workerLocations[report.trackingId];
            if (liveLoc) {
              return (
                <React.Fragment key={`worker-${report.trackingId}`}>
                  <Marker
                    position={[liveLoc.lat, liveLoc.lng]}
                    icon={new L.Icon({
                      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
                      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
                      iconSize: [25, 41],
                      iconAnchor: [12, 41],
                      popupAnchor: [1, -34],
                      shadowSize: [41, 41]
                    })}
                  >
                    <Popup>
                      <div className="p-1">
                        <p className="font-bold text-blue-700 text-xs mb-0">Live Worker</p>
                        <p className="text-xs text-gray-500">Active</p>
                      </div>
                    </Popup>
                  </Marker>
                  <Polyline
                    positions={[
                      [liveLoc.lat, liveLoc.lng],
                      [report.latitude!, report.longitude!]
                    ]}
                    pathOptions={{ color: 'blue', dashArray: '10, 10', opacity: 0.6 }}
                  />
                </React.Fragment>
              );
            }
            return null;
          })}

          {/* Available Reports Pins */}
          {availableReports.slice(0, 5).map((report) => (
            <Marker
              key={`available-${report.id}`}
              position={[
                report.latitude || (defaultCenter[0] + 0.05),
                report.longitude || (defaultCenter[1] + 0.05)
              ]}
              icon={alertIcon}
            >
              <Popup>
                <div className="p-2">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <span className="font-bold text-red-700">Help Needed</span>
                  </div>
                  <p className="font-medium">{report.animalType}</p>
                  <p className="text-xs text-gray-500">{report.condition}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Floating UI Overlay - Top Stats Bar */}
        <div className="absolute top-4 left-4 right-4 md:left-8 md:right-8 z-[1000] flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pointer-events-none">
          {/* Welcome & Context */}
          <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/20 pointer-events-auto">
            <h1 className="text-xl font-bold text-[#004432] flex items-center gap-2">
              NGO Dashboard <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">Live Map</span>
            </h1>
            <p className="text-sm text-gray-600">Overview of operations and impact</p>
          </div>

          {/* Stats Pills */}
          <div className="flex gap-3 pointer-events-auto overflow-x-auto max-w-full pb-2 md:pb-0">
            <div className="bg-white/90 backdrop-blur-md px-4 py-3 rounded-xl shadow-md border border-green-100 flex items-center gap-3 min-w-[140px]">
              <div className="p-2 bg-green-100 rounded-lg text-[#004432]">
                <CheckCircle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase">Solved</p>
                <p className="text-xl font-bold text-[#004432]">{stats.completed}</p>
              </div>
            </div>
            <div className="bg-white/90 backdrop-blur-md px-4 py-3 rounded-xl shadow-md border border-yellow-100 flex items-center gap-3 min-w-[140px]">
              <div className="p-2 bg-yellow-100 rounded-lg text-yellow-700">
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase">Active</p>
                <p className="text-xl font-bold text-gray-800">{stats.inProgress}</p>
              </div>
            </div>
            <div className="bg-white/90 backdrop-blur-md px-4 py-3 rounded-xl shadow-md border border-red-100 flex items-center gap-3 min-w-[140px]">
              <div className="p-2 bg-red-100 rounded-lg text-red-600">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase">Alerts</p>
                <p className="text-xl font-bold text-red-600 animate-pulse">{stats.available}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Sidebar - Left (Alerts) */}
        {availableReports.length > 0 && (
          <div className="absolute top-24 left-4 md:left-8 w-80 max-h-[calc(100vh-140px)] overflow-y-auto z-[1000] space-y-3 pointer-events-none hidden lg:block">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden pointer-events-auto border border-red-100">
              <div className="p-4 border-b border-gray-100 bg-red-50/50 flex justify-between items-center">
                <h3 className="font-bold text-red-800 flex items-center gap-2">
                  <Zap className="h-4 w-4 fill-red-600 text-red-600" />
                  Live Alerts
                </h3>
                <span className="text-xs font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded-full">{availableReports.length}</span>
              </div>
              <div className="divide-y divide-gray-50 max-h-[400px] overflow-y-auto">
                {availableReports.map(report => (
                  <div key={report.id} className="p-4 hover:bg-red-50/30 transition-colors group cursor-pointer">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-gray-800 capitalize">{report.animalType}</span>
                      <span className="text-[10px] font-bold bg-white border border-gray-200 px-1.5 py-0.5 rounded text-gray-500">#{report.trackingId}</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-2 line-clamp-1">{report.address}</p>
                    <button
                      onClick={() => handleAcceptCase(report)}
                      disabled={acceptingReportId === report.id}
                      className="w-full py-1.5 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 transition-colors opacity-90 hover:opacity-100 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
                    >
                      {acceptingReportId === report.id ? (
                        <>
                          <LoadingSpinner size="sm" variant="white" />
                          Accepting...
                        </>
                      ) : (
                        'Accept Case'
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Floating Action Buttons - Bottom Right */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 md:translate-x-0 md:left-auto md:right-8 z-[1000] flex gap-3 pointer-events-auto">
          <button className="bg-white text-[#004432] px-6 py-3 rounded-full shadow-lg font-bold hover:bg-[#004432] hover:text-white transition-all flex items-center gap-2 border border-[#004432]/10">
            <Layers className="h-5 w-5" />
            Map Layers
          </button>
          <button className="bg-[#004432] text-white px-6 py-3 rounded-full shadow-lg font-bold hover:bg-[#13735f] transition-all flex items-center gap-2">
            <Search className="h-5 w-5" />
            Find Reports
          </button>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default NgoDashboard;