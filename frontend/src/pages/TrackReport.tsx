import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { Search, Filter, MapPin, Calendar, FileText, Building2, ChevronDown, ChevronRight, Clock, User, CheckCircle2 } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { reportsAPI, ngoAPI, adminAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import type { AnimalReport, UserResponse } from '../types';
import { getStatusText } from '../utils/auth';
import toast from 'react-hot-toast';
import L from 'leaflet';

// Fix for default marker icon
import icon from 'leaflet/dist/images/marker-icon.png';
// import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

import { socketService } from '../utils/socket';

// Status color mapping
const getStatusDotColor = (status: string): string => {
  switch (status) {
    case 'SUBMITTED':
      return 'bg-blue-500';
    case 'SEARCHING_FOR_HELP':
      return 'bg-amber-500';
    case 'HELP_ON_THE_WAY':
    case 'TEAM_DISPATCHED':
      return 'bg-orange-500';
    case 'ANIMAL_RESCUED':
      return 'bg-emerald-500';
    case 'CASE_RESOLVED':
      return 'bg-slate-400';
    default:
      return 'bg-slate-300';
  }
};

// Timeline stages
const timelineStages = [
  { status: 'SUBMITTED', label: 'Reported' },
  { status: 'SEARCHING_FOR_HELP', label: 'Verified' },
  { status: 'HELP_ON_THE_WAY', label: 'Help Dispatched' },
  { status: 'TEAM_DISPATCHED', label: 'Team En Route' },
  { status: 'ANIMAL_RESCUED', label: 'Animal Rescued' },
  { status: 'CASE_RESOLVED', label: 'Case Closed' },
];

const getStageIndex = (status: string): number => {
  const index = timelineStages.findIndex(s => s.status === status);
  return index >= 0 ? index : 0;
};

const TrackReport: React.FC = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState<AnimalReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  // State for worker assignment
  const [workers, setWorkers] = useState<UserResponse[]>([]);
  const [selectedReport, setSelectedReport] = useState<AnimalReport | null>(null);
  const [selectedWorkerId, setSelectedWorkerId] = useState<number | null>(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const [workerLocations] = useState<Record<string, { lat: number; lng: number }>>({});

  // Check user role
  const isNGO = user?.roles?.includes('NGO');
  const isWorker = user?.roles?.includes('NGO_WORKER');
  const isAdmin = user?.roles?.includes('ADMIN');

  useEffect(() => {
    fetchReports();
  }, [user]);

  const fetchReports = async () => {
    try {
      setIsLoading(true);
      let data: AnimalReport[];

      if (isWorker && user?.id) {
        data = await reportsAPI.getWorkerTasks(user.id);
      } else if (isNGO && user?.ngoId) {
        data = await reportsAPI.getReportsByNgo(user.ngoId);
      } else if (isAdmin) {
        data = await adminAPI.getAllReports();
      } else {
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

  // Load workers for NGO
  const loadWorkers = async () => {
    if (!user?.ngoId) return;
    try {
      const workersList = await ngoAPI.getWorkers(user.ngoId);
      setWorkers(workersList.filter(w => w.enabled));
    } catch (error) {
      console.error('Failed to load workers:', error);
    }
  };

  const openAssignModal = (report: AnimalReport) => {
    setSelectedReport(report);
    setSelectedWorkerId(null);
    setIsAssignModalOpen(true);
    loadWorkers();
  };

  const closeAssignModal = () => {
    setSelectedReport(null);
    setSelectedWorkerId(null);
    setIsAssignModalOpen(false);
  };

  const handleAssignWorker = async () => {
    if (!selectedReport || !selectedWorkerId) {
      toast.error('Please select a worker');
      return;
    }

    const selectedWorker = workers.find(w => w.id === selectedWorkerId);
    if (!selectedWorker) {
      toast.error('Worker not found');
      return;
    }

    setIsAssigning(true);
    try {
      await reportsAPI.assignReport(selectedReport.trackingId, selectedWorkerId, selectedWorker.fullName);
      toast.success(`Case assigned to ${selectedWorker.fullName}`);
      closeAssignModal();
      fetchReports();
    } catch (error) {
      console.error('Failed to assign worker:', error);
      toast.error('Failed to assign worker to case');
    } finally {
      setIsAssigning(false);
    }
  };

  // Toggle row expansion
  const toggleRow = (reportId: number) => {
    setExpandedRow(expandedRow === reportId ? null : reportId);
  };

  // Get page title based on role
  const getPageTitle = () => {
    if (isNGO) return 'Case Register';
    if (isAdmin) return 'All Cases';
    return 'My Cases';
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
      <div className="font-['Inter',system-ui,sans-serif]">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{getPageTitle()}</h1>
              <p className="text-sm text-slate-500 mt-1">
                {filteredReports.length} case{filteredReports.length !== 1 ? 's' : ''} on record
              </p>
            </div>

            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${viewMode === 'list'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                  }`}
              >
                Register
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${viewMode === 'map'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                  }`}
              >
                Map
              </button>
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search cases..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-0 outline-none transition-colors text-sm"
            />
          </div>
          <div className="relative min-w-[180px]">
            <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-0 outline-none transition-colors appearance-none bg-white text-sm"
            >
              <option value="ALL">All Status</option>
              <option value="SUBMITTED">Reported</option>
              <option value="SEARCHING_FOR_HELP">Verified</option>
              <option value="HELP_ON_THE_WAY">Dispatched</option>
              <option value="CASE_RESOLVED">Resolved</option>
            </select>
          </div>
        </div>

        {viewMode === 'list' ? (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            {/* Ledger Header */}
            <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-4 bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <div className="col-span-1">Status</div>
              <div className="col-span-4">Case ID & Animal</div>
              <div className="col-span-4">Location</div>
              <div className="col-span-3">Date</div>
            </div>

            {/* Case Rows */}
            {filteredReports.length === 0 ? (
              <div className="text-center py-16">
                <FileText className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900">No cases found</h3>
                <p className="text-slate-500 mt-1">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredReports.map((report) => {
                  const isExpanded = expandedRow === report.id;
                  const stageIndex = getStageIndex(report.status);

                  return (
                    <div key={report.id}>
                      {/* Main Row */}
                      <button
                        onClick={() => toggleRow(report.id)}
                        className="w-full grid grid-cols-12 gap-4 px-6 py-5 items-center text-left hover:bg-slate-50 transition-colors"
                      >
                        {/* Status Dot */}
                        <div className="col-span-1 flex items-center">
                          <div className="relative">
                            <div className={`w-3 h-3 rounded-full ${getStatusDotColor(report.status)}`} />
                            {report.status !== 'CASE_RESOLVED' && (
                              <div className={`absolute inset-0 w-3 h-3 rounded-full ${getStatusDotColor(report.status)} animate-ping opacity-50`} />
                            )}
                          </div>
                        </div>

                        {/* Case ID & Animal */}
                        <div className="col-span-4 flex items-center gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-sm font-semibold text-slate-900">
                                {report.trackingId}
                              </span>
                              <span className="text-slate-400">·</span>
                              <span className="text-sm text-slate-600 capitalize">
                                {report.animalType.toLowerCase()}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 mt-0.5 truncate max-w-[250px]">
                              {report.condition || getStatusText(report.status)}
                            </p>
                          </div>
                        </div>

                        {/* Location */}
                        <div className="col-span-4 flex items-center gap-2 text-sm text-slate-500">
                          <MapPin className="w-4 h-4 text-slate-300 flex-shrink-0" />
                          <span className="truncate">
                            {report.address || 'Location not specified'}
                          </span>
                        </div>

                        {/* Date */}
                        <div className="col-span-2 text-sm text-slate-500">
                          {new Date(report.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </div>

                        {/* Expand Icon */}
                        <div className="col-span-1 flex justify-end">
                          {isExpanded ? (
                            <ChevronDown className="w-5 h-5 text-slate-400" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                      </button>

                      {/* Expanded Content */}
                      <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                          }`}
                      >
                        <div className="px-6 pb-6 pt-2 bg-slate-50/50 border-t border-slate-100">
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                            {/* Timeline */}
                            <div className="lg:col-span-2">
                              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
                                Case Timeline
                              </h4>
                              <div className="relative">
                                {/* Timeline track */}
                                <div className="absolute left-[7px] top-0 bottom-0 w-0.5 bg-slate-200" />
                                <div
                                  className="absolute left-[7px] top-0 w-0.5 bg-emerald-500 transition-all duration-500"
                                  style={{ height: `${((stageIndex + 1) / timelineStages.length) * 100}%` }}
                                />

                                <div className="space-y-4">
                                  {timelineStages.slice(0, stageIndex + 1).map((stage, index) => (
                                    <div key={stage.status} className="flex items-start gap-4 relative">
                                      <div className={`w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center ${index <= stageIndex
                                          ? 'bg-emerald-500'
                                          : 'bg-slate-200'
                                        }`}>
                                        {index <= stageIndex && (
                                          <CheckCircle2 className="w-3 h-3 text-white" />
                                        )}
                                      </div>
                                      <div>
                                        <p className={`text-sm font-medium ${index <= stageIndex ? 'text-slate-900' : 'text-slate-400'
                                          }`}>
                                          {stage.label}
                                        </p>
                                        {index === stageIndex && report.updatedAt && (
                                          <p className="text-xs text-slate-400 mt-0.5">
                                            {new Date(report.updatedAt).toLocaleString()}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Details Panel */}
                            <div className="space-y-4">
                              {/* Current State */}
                              <div className="p-4 bg-white rounded-xl border border-slate-200">
                                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                                  Current State
                                </h4>
                                <div className="flex items-center gap-2">
                                  <div className={`w-2 h-2 rounded-full ${getStatusDotColor(report.status)}`} />
                                  <span className="text-sm font-medium text-slate-700">
                                    {getStatusText(report.status)}
                                  </span>
                                </div>
                              </div>

                              {/* Assigned NGO / Worker */}
                              <div className="p-4 bg-white rounded-xl border border-slate-200">
                                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                                  Assignment
                                </h4>
                                {report.assignedNgo ? (
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm">
                                      <Building2 className="w-4 h-4 text-emerald-500" />
                                      <span className="text-slate-700">{report.assignedNgo}</span>
                                    </div>
                                    {report.assignedWorkerName && (
                                      <div className="flex items-center gap-2 text-sm">
                                        <User className="w-4 h-4 text-slate-400" />
                                        <span className="text-slate-600">{report.assignedWorkerName}</span>
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <p className="text-sm text-slate-500">Awaiting assignment</p>
                                )}
                              </div>

                              {/* Description */}
                              {(report.description || report.injuryDescription) && (
                                <div className="p-4 bg-white rounded-xl border border-slate-200">
                                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                                    Description
                                  </h4>
                                  <p className="text-sm text-slate-600 leading-relaxed">
                                    {report.injuryDescription || report.description}
                                  </p>
                                </div>
                              )}

                              {/* NGO Actions */}
                              {isNGO && report.status !== 'CASE_RESOLVED' && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openAssignModal(report);
                                  }}
                                  className="w-full py-3 px-4 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors"
                                >
                                  {report.assignedWorkerName ? 'Reassign Worker' : 'Assign Worker'}
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Image Preview */}
                          {report.imageUrls?.[0] && (
                            <div className="mt-6 pt-6 border-t border-slate-200">
                              <img
                                src={report.imageUrls[0]}
                                alt={report.animalType}
                                className="w-32 h-24 rounded-lg object-cover"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* Map View */
          <div className="h-[600px] rounded-2xl overflow-hidden border border-slate-200">
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
                      <div className="p-2">
                        <p className="font-bold text-slate-900">{report.trackingId}</p>
                        <p className="text-sm text-slate-600 capitalize">{report.animalType.toLowerCase()}</p>
                        <p className="text-xs text-slate-500 mt-1">{getStatusText(report.status)}</p>
                      </div>
                    </Popup>
                  </Marker>
                )
              ))}
            </MapContainer>
          </div>
        )}
      </div>

      {/* Assign Worker Modal */}
      {isAssignModalOpen && selectedReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              Assign Worker to Case #{selectedReport.trackingId}
            </h3>

            <div className="space-y-3 max-h-64 overflow-y-auto">
              {workers.length === 0 ? (
                <p className="text-slate-500 text-sm">No workers available</p>
              ) : (
                workers.map((worker) => (
                  <button
                    key={worker.id}
                    onClick={() => setSelectedWorkerId(worker.id)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${selectedWorkerId === worker.id
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-slate-200 hover:border-slate-300'
                      }`}
                  >
                    <p className="font-medium text-slate-900">{worker.fullName}</p>
                    <p className="text-sm text-slate-500">{worker.email}</p>
                  </button>
                ))
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={closeAssignModal}
                className="flex-1 py-3 border border-slate-200 rounded-xl text-slate-600 font-medium hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignWorker}
                disabled={!selectedWorkerId || isAssigning}
                className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50"
              >
                {isAssigning ? 'Assigning...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default TrackReport;