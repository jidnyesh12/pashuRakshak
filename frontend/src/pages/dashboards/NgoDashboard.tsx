import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  Users,
  Activity,
  ArrowRight,
  FileText,
  TrendingUp,
  Search,
  Phone,
  UserCheck,
  ChevronDown
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import { reportsAPI, ngoAPI } from '../../utils/api';
import { getStatusColor, getStatusText } from '../../utils/auth';
import toast from 'react-hot-toast';
import type { AnimalReport, UserResponse, NGO } from '../../types';

const NgoDashboard: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [availableReports, setAvailableReports] = useState<AnimalReport[]>([]);
  const [myReports, setMyReports] = useState<AnimalReport[]>([]);
  const [workers, setWorkers] = useState<UserResponse[]>([]);
  const [ngoDetails, setNgoDetails] = useState<NGO | null>(null);
  const [stats, setStats] = useState({
    totalAssigned: 0,
    completed: 0,
    inProgress: 0,
    available: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [available, assigned, ngoWorkers, ngo] = await Promise.all([
        reportsAPI.getAvailableReports(),
        user?.ngoId ? reportsAPI.getReportsByNgo(user.ngoId) : Promise.resolve([]),
        user?.ngoId ? ngoAPI.getWorkers(user.ngoId) : Promise.resolve([]),
        user?.ngoId ? ngoAPI.getNgoById(user.ngoId) : Promise.resolve(null)
      ]);

      setAvailableReports(available);
      setMyReports(assigned);
      setWorkers(ngoWorkers);
      setNgoDetails(ngo);

      setStats({
        totalAssigned: assigned.length,
        completed: assigned.filter(r => r.status === 'CASE_RESOLVED').length,
        inProgress: assigned.filter(r => !['CASE_RESOLVED', 'SUBMITTED'].includes(r.status)).length,
        available: available.length
      });
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptReport = async (trackingId: string) => {
    if (!user?.ngoId || !ngoDetails?.name) {
      toast.error('NGO information not available');
      return;
    }

    try {
      // Use the actual NGO organization name, not user's personal name
      await reportsAPI.acceptReport(trackingId, user.ngoId, ngoDetails.name);
      toast.success('Report accepted successfully');
      loadDashboardData();
    } catch (error) {
      toast.error('Failed to accept report');
    }
  };

  const handleUpdateStatus = async (trackingId: string, status: string) => {
    try {
      await reportsAPI.updateReportStatus(trackingId, status);
      toast.success('Status updated successfully');
      loadDashboardData();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleAssignWorker = async (trackingId: string, workerId: string) => {
    try {
      const worker = workers.find(w => w.id === parseInt(workerId));
      if (!worker) return;

      await reportsAPI.assignReport(trackingId, worker.id, worker.fullName);
      toast.success(`Assigned to ${worker.fullName}`);
      loadDashboardData();
    } catch (error) {
      toast.error('Failed to assign worker');
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-[60vh]">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  const statCards = [
    {
      label: 'Total Assigned',
      value: stats.totalAssigned,
      subtext: 'Cases Handled',
      icon: Users,
      gradient: 'from-blue-500 to-blue-600',
      shadow: 'shadow-blue-200',
    },
    {
      label: 'Completed',
      value: stats.completed,
      subtext: 'Successful Rescues',
      icon: CheckCircle,
      gradient: 'from-green-500 to-green-600',
      shadow: 'shadow-green-200',
    },
    {
      label: 'In Progress',
      value: stats.inProgress,
      subtext: 'Active Operations',
      icon: Clock,
      gradient: 'from-orange-500 to-orange-600',
      shadow: 'shadow-orange-200',
    },
    {
      label: 'Available',
      value: stats.available,
      subtext: 'Need Attention',
      icon: AlertTriangle,
      gradient: 'from-red-500 to-red-600',
      shadow: 'shadow-red-200',
    },
  ];

  return (
    <DashboardLayout>
      {/* Hero Section with Glassmorphism */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-600 p-8 mb-10 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-white opacity-10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-64 w-64 rounded-full bg-emerald-400 opacity-10 blur-3xl"></div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome, {user?.fullName?.split(' ')[0]}! 🏢
            </h1>
            <p className="text-emerald-100 max-w-lg text-lg">
              Ready to save lives? There are {stats.available} animals waiting for help nearby.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
            <Activity className="h-5 w-5 text-emerald-300" />
            <span className="font-medium">Status: Active & Ready</span>
          </div>
        </div>
      </div>

      {/* Modern Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statCards.map((stat, index) => (
          <div key={index} className="relative group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 overflow-hidden">
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110`}></div>

            <div className="relative z-10">
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${stat.gradient} text-white shadow-lg ${stat.shadow} mb-4`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
                <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
                <p className="text-xs text-gray-400 mt-1 font-medium">{stat.subtext}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-8">

          {/* My Assigned Reports */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
                My Active Cases
              </h2>
              <span className="text-sm font-medium text-gray-500">{myReports.length} Active</span>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {myReports.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-50 mb-6">
                    <FileText className="h-10 w-10 text-gray-300" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">No active cases</h3>
                  <p className="text-gray-500">
                    You don't have any assigned cases. Check the available reports below.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {myReports.map((report) => (
                    <div key={report.id} className="p-6 hover:bg-gray-50 transition-colors group">
                      <div className="flex flex-col sm:flex-row gap-5">
                        {/* Image Thumbnail */}
                        <div className="relative h-32 w-full sm:w-32 rounded-xl overflow-hidden flex-shrink-0 shadow-sm group-hover:shadow-md transition-all">
                          {report.imageUrls?.[0] ? (
                            <img
                              src={report.imageUrls[0]}
                              alt={report.animalType}
                              className="h-full w-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="h-full w-full bg-gray-100 flex items-center justify-center text-gray-400">
                              <FileText className="h-8 w-8" />
                            </div>
                          )}
                          <div className="absolute top-2 right-2">
                            <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-white shadow-sm ${getStatusColor(report.status)}`}>
                              {getStatusText(report.status)}
                            </span>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 py-1">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-bold text-gray-900 text-lg capitalize mb-1">
                                {report.animalType.toLowerCase()}
                              </h3>
                              <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                                <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600">#{report.trackingId}</span>
                                <span>•</span>
                                <span className="flex items-center">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {new Date(report.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPin className="h-4 w-4 mr-2 text-emerald-500 flex-shrink-0" />
                              <span className="truncate">{report.location}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Phone className="h-4 w-4 mr-2 text-blue-500 flex-shrink-0" />
                              <span>{report.reporterName} ({report.reporterPhone})</span>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          {report.status !== 'CASE_RESOLVED' && (
                            <>
                              {!report.assignedWorkerId ? (
                                <div className="flex flex-wrap gap-2 mt-3">
                                  {report.status === 'SUBMITTED' && (
                                    <button
                                      onClick={() => handleUpdateStatus(report.trackingId, 'SEARCHING_FOR_HELP')}
                                      className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                                    >
                                      Start Search
                                    </button>
                                  )}
                                  {report.status === 'SEARCHING_FOR_HELP' && (
                                    <button
                                      onClick={() => handleUpdateStatus(report.trackingId, 'HELP_ON_THE_WAY')}
                                      className="px-4 py-2 bg-yellow-600 text-white text-sm font-medium rounded-lg hover:bg-yellow-700 transition-colors shadow-sm"
                                    >
                                      Help on Way
                                    </button>
                                  )}
                                  {report.status === 'HELP_ON_THE_WAY' && (
                                    <button
                                      onClick={() => handleUpdateStatus(report.trackingId, 'TEAM_DISPATCHED')}
                                      className="px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition-colors shadow-sm"
                                    >
                                      Team Dispatched
                                    </button>
                                  )}
                                  {report.status === 'TEAM_DISPATCHED' && (
                                    <button
                                      onClick={() => handleUpdateStatus(report.trackingId, 'ANIMAL_RESCUED')}
                                      className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors shadow-sm"
                                    >
                                      Animal Rescued
                                    </button>
                                  )}
                                  {report.status === 'ANIMAL_RESCUED' && (
                                    <button
                                      onClick={() => handleUpdateStatus(report.trackingId, 'CASE_RESOLVED')}
                                      className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                                    >
                                      Mark Resolved
                                    </button>
                                  )}
                                </div>
                              ) : (
                                <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-100 flex items-center gap-2">
                                  <Users className="h-4 w-4 text-purple-600" />
                                  <span className="text-sm text-gray-600 font-medium">
                                    Managed by <span className="text-purple-700 font-bold">{report.assignedWorkerName}</span>
                                  </span>
                                </div>
                              )}
                            </>
                          )}

                          {/* Worker Assignment UI */}
                          {report.status !== 'CASE_RESOLVED' && (
                            <div className="mt-4 pt-4 border-t border-gray-100">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <UserCheck className="h-4 w-4 text-purple-500" />
                                  <span className="text-sm font-semibold text-gray-700">
                                    Assigned To:
                                  </span>
                                  {report.assignedWorkerName ? (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                                      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                                      {report.assignedWorkerName}
                                    </span>
                                  ) : (
                                    <span className="text-sm text-gray-400 italic">Not assigned yet</span>
                                  )}
                                </div>
                              </div>

                              {workers.length > 0 ? (
                                <div className="relative">
                                  <select
                                    className="w-full appearance-none bg-white border-2 border-gray-200 rounded-xl px-4 py-3 pr-10 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all cursor-pointer hover:border-purple-300"
                                    onChange={(e) => {
                                      if (e.target.value) handleAssignWorker(report.trackingId, e.target.value);
                                    }}
                                    value=""
                                  >
                                    <option value="" disabled>
                                      {report.assignedWorkerId ? 'Reassign to another worker...' : 'Select a worker to assign...'}
                                    </option>
                                    {workers.filter(w => w.enabled).map(worker => (
                                      <option key={worker.id} value={worker.id}>
                                        {worker.fullName} {worker.id === report.assignedWorkerId ? '(Current)' : ''}
                                      </option>
                                    ))}
                                  </select>
                                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                                </div>
                              ) : (
                                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-700">
                                  <span className="font-medium">No workers available.</span> Add workers in Manage NGO to assign cases.
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Available Reports */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              New Alerts
            </h2>
            <span className="text-sm font-medium text-gray-500">{availableReports.length} Available</span>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {availableReports.length === 0 ? (
              <div className="p-12 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-50 mb-6">
                  <CheckCircle className="h-10 w-10 text-green-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">All clear!</h3>
                <p className="text-gray-500">
                  There are no pending reports in your area.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                {availableReports.map((report) => (
                  <div key={report.id} className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition-all bg-gray-50/50">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs font-bold rounded-md ${report.urgencyLevel === 'HIGH' ? 'bg-red-100 text-red-700' :
                          report.urgencyLevel === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                          {report.urgencyLevel}
                        </span>
                        <span className="text-xs text-gray-500">#{report.trackingId}</span>
                      </div>
                      <span className="text-xs text-gray-400 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {new Date(report.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="font-bold text-gray-900 mb-1 capitalize">{report.animalType}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{report.description}</p>

                    <div className="flex items-center text-xs text-gray-500 mb-4">
                      <MapPin className="h-3.5 w-3.5 mr-1 text-red-500" />
                      <span className="truncate">{report.location}</span>
                    </div>

                    <button
                      onClick={() => handleAcceptReport(report.trackingId)}
                      className="w-full py-2.5 bg-white border border-emerald-600 text-emerald-600 font-medium rounded-lg hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2 group"
                    >
                      <span>Accept Case</span>
                      <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Sidebar Widgets */}
      <div className="space-y-6 mt-8">
        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center p-3 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors group text-left">
              <div className="p-2 bg-white rounded-lg mr-3 shadow-sm group-hover:scale-110 transition-transform">
                <Search className="h-5 w-5" />
              </div>
              <span className="font-medium">Find Nearby Cases</span>
            </button>
            <button className="w-full flex items-center p-3 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors group text-left">
              <div className="p-2 bg-white rounded-lg mr-3 shadow-sm group-hover:scale-110 transition-transform">
                <TrendingUp className="h-5 w-5" />
              </div>
              <span className="font-medium">View Analytics</span>
            </button>

          </div>
        </div>

        {/* Impact Card */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-emerald-500 rounded-full opacity-20 blur-xl"></div>
          <h3 className="font-bold text-lg mb-2 relative z-10">NGO Impact</h3>
          <p className="text-gray-300 text-sm mb-4 relative z-10">
            Your organization has saved {stats.completed} lives so far. Keep up the amazing work!
          </p>
          <div className="flex items-center gap-2 text-xs font-medium text-emerald-300 relative z-10">
            <CheckCircle className="h-4 w-4" />
            <span>Verified Partner</span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NgoDashboard;