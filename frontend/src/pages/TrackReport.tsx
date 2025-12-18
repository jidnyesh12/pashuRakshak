import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { Search, Filter, MapPin, Calendar, FileText, Building2 } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { reportsAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import type { AnimalReport } from '../types';
import { getStatusColor, getStatusText } from '../utils/auth';
import toast from 'react-hot-toast';
import L from 'leaflet';

// Fix for default marker icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// ... (imports)
import { socketService } from '../utils/socket';

// ... (inside component)
const TrackReport: React.FC = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState<AnimalReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // State for real-time worker locations: mapping trackingId -> {lat, lng}
  const [workerLocations, setWorkerLocations] = useState<Record<string, { lat: number; lng: number }>>({});

  useEffect(() => {
    socketService.connect();
    return () => socketService.disconnect();
  }, []);

  // Subscribe to updates for active reports
  useEffect(() => {
    // We only need to subscribe for reports that are active and have a worker assigned (technically anyone can subscribe)
    const activeReports = reports.filter(r => !['CASE_RESOLVED', 'SUBMITTED'].includes(r.status));

    const subscriptions = activeReports.map(report => {
      const topic = `/topic/case/${report.trackingId}`;
      return socketService.subscribe(topic, (data) => {
        // Update state with new worker location
        setWorkerLocations(prev => ({
          ...prev,
          [data.trackingId]: { lat: data.latitude, lng: data.longitude }
        }));

        // Optional: You could also update the report object itself if you want to persist the last known location in the list view
      });
    });

    return () => {
      subscriptions.forEach(sub => sub.unsubscribe());
    };
  }, [reports]);

  // ... (rest of the file)

  // Check user role
  const isNGO = user?.roles?.includes('NGO');
  const isAdmin = user?.roles?.includes('ADMIN');

  useEffect(() => {
    fetchReports();
  }, [user]);

  const fetchReports = async () => {
    try {
      setIsLoading(true);
      let data: AnimalReport[];

      if (isNGO && user?.ngoId) {
        // For NGO users, fetch reports assigned to their NGO
        data = await reportsAPI.getReportsByNgo(user.ngoId);
      } else if (isAdmin) {
        // For admin, get all reports (this uses a different endpoint that returns all)
        data = await reportsAPI.getAllReports();
      } else {
        // For regular users, get their own reports
        data = await reportsAPI.getAllReports();
      }

      setReports(data);
    } catch (error) {
      console.error('Failed to fetch reports:', error);
      toast.error('Failed to load reports');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.animalType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.trackingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (report.injuryDescription && report.injuryDescription.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (report.description && report.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesFilter = filterStatus === 'ALL' || report.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  // Get page title based on role
  const getPageTitle = () => {
    if (isNGO) return 'Track My Cases';
    if (isAdmin) return 'All Reports';
    return 'My Reports';
  };

  const getPageDescription = () => {
    if (isNGO) return 'Monitor cases assigned to your NGO';
    if (isAdmin) return 'View all animal rescue reports in the system';
    return 'Track the status of your submitted rescue requests';
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-[60vh]">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">{getPageTitle()}</h1>
            {isNGO && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                <Building2 className="h-4 w-4" />
                NGO Cases
              </span>
            )}
          </div>
          <p className="text-gray-600 mt-1">{getPageDescription()}</p>
        </div>

        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${viewMode === 'list'
              ? 'bg-white text-purple-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            List View
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${viewMode === 'map'
              ? 'bg-white text-purple-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            Map View
          </button>
        </div>
      </div>

      {/* Stats Summary for NGO */}
      {isNGO && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <p className="text-sm text-gray-500">Total Cases</p>
            <p className="text-2xl font-bold text-gray-900">{reports.length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <p className="text-sm text-gray-500">In Progress</p>
            <p className="text-2xl font-bold text-amber-600">
              {reports.filter(r => !['CASE_RESOLVED', 'SUBMITTED'].includes(r.status)).length}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <p className="text-sm text-gray-500">Resolved</p>
            <p className="text-2xl font-bold text-green-600">
              {reports.filter(r => r.status === 'CASE_RESOLVED').length}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <p className="text-sm text-gray-500">Workers Assigned</p>
            <p className="text-2xl font-bold text-purple-600">
              {reports.filter(r => r.assignedWorkerId).length}
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by ID, animal type, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all"
          />
        </div>
        <div className="relative min-w-[200px]">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all appearance-none bg-white"
          >
            <option value="ALL">All Statuses</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="SEARCHING_FOR_HELP">Searching for Help</option>
            <option value="HELP_ON_THE_WAY">Help on the Way</option>
            <option value="TEAM_DISPATCHED">Team Dispatched</option>
            <option value="ANIMAL_RESCUED">Rescued</option>
            <option value="CASE_RESOLVED">Resolved</option>
          </select>
        </div>
      </div>

      {viewMode === 'list' ? (
        <div className="space-y-4">
          {filteredReports.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4">
                <FileText className="h-8 w-8 text-gray-300" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                {isNGO ? 'No cases assigned yet' : 'No reports found'}
              </h3>
              <p className="text-gray-500 mt-1">
                {isNGO
                  ? 'Accept cases from the dashboard to see them here'
                  : 'Try adjusting your search or filters'}
              </p>
            </div>
          ) : (
            filteredReports.map((report) => (
              <div
                key={report.id}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Image */}
                  <div className="w-full md:w-48 h-48 md:h-32 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                    {report.imageUrls?.[0] ? (
                      <img
                        src={report.imageUrls[0]}
                        alt={report.animalType}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <FileText className="h-8 w-8" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex flex-wrap justify-between items-start gap-4 mb-2">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-lg font-bold text-gray-900 capitalize">
                            {report.animalType.toLowerCase()}
                          </h3>
                          <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                            #{report.trackingId}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm line-clamp-2">
                          {report.injuryDescription || report.description || 'No description provided'}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(report.status)}`}>
                        {getStatusText(report.status)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="truncate" title={report.address || 'Location not specified'}>
                          {report.address || 'Location not specified'}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        {new Date(report.createdAt).toLocaleDateString()} at {new Date(report.createdAt).toLocaleTimeString()}
                      </div>
                    </div>

                    {/* Show worker assignment for NGO */}
                    {isNGO && (
                      <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap items-center gap-4 text-sm">
                        {report.assignedWorkerName ? (
                          <div className="flex items-center">
                            <span className="text-gray-500 mr-2">Assigned Worker:</span>
                            <span className="font-medium text-purple-600">{report.assignedWorkerName}</span>
                          </div>
                        ) : (
                          <span className="text-amber-600 font-medium">⚠️ No worker assigned</span>
                        )}
                        <div className="flex items-center">
                          <span className="text-gray-500 mr-2">Reporter:</span>
                          <span className="font-medium text-gray-700">{report.reporterName}</span>
                        </div>
                      </div>
                    )}

                    {/* Show NGO name for regular users */}
                    {!isNGO && report.assignedNgoName && (
                      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center text-sm">
                        <span className="text-gray-500 mr-2">Assigned NGO:</span>
                        <span className="font-medium text-purple-600">{report.assignedNgoName}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="h-[600px] bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative z-0">
          <MapContainer
            center={[20.5937, 78.9629]}
            zoom={5}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {filteredReports.map((report) => (
              report.latitude && report.longitude && (
                <Marker
                  key={report.id}
                  position={[report.latitude, report.longitude]}
                >
                  <Popup>
                    <div className="p-2 min-w-[200px]">
                      <h3 className="font-bold text-gray-900 capitalize mb-1">{report.animalType.toLowerCase()}</h3>
                      <p className="text-sm text-gray-600 mb-2">{(report.injuryDescription || report.description)?.substring(0, 50)}...</p>
                      <span className={`text-xs px-2 py-1 rounded border ${getStatusColor(report.status)}`}>
                        {getStatusText(report.status)}
                      </span>
                      {isNGO && report.assignedWorkerName && (
                        <p className="text-xs text-purple-600 mt-2">Worker: {report.assignedWorkerName}</p>
                      )}
                    </div>
                  </Popup>
                </Marker>
              )
            ))}

            {/* Render Live Worker Locations */}
            {reports.map(report => {
              const liveLoc = workerLocations[report.trackingId];
              if (liveLoc) {
                return (
                  <React.Fragment key={`worker-${report.trackingId}`}>
                    {/* Worker Marker */}
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
                          <p className="font-bold text-blue-700 text-xs mb-0">Live Worker Location</p>
                          <p className="text-xs text-gray-500">Approaching Case #{report.trackingId}</p>
                        </div>
                      </Popup>
                    </Marker>

                    {/* Dotted Line connecting Worker to Animal */}
                    {report.latitude && report.longitude && (
                      <Polyline
                        positions={[
                          [liveLoc.lat, liveLoc.lng],
                          [report.latitude, report.longitude]
                        ]}
                        pathOptions={{ color: 'blue', dashArray: '10, 10', opacity: 0.6 }}
                      />
                    )}
                  </React.Fragment>
                );
              }
              return null;
            })}
          </MapContainer>
        </div>
      )}
    </DashboardLayout>
  );
};

export default TrackReport;