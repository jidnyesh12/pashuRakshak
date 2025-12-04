import React, { useState, useEffect } from 'react';
import { MapPin, Clock, CheckCircle, AlertTriangle, Users } from 'lucide-react';
import Layout from '../../components/common/Layout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import { reportsAPI } from '../../utils/api';
import { getStatusColor, getStatusText } from '../../utils/auth';
import toast from 'react-hot-toast';
import type { AnimalReport } from '../../types';

const NgoDashboard: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [availableReports, setAvailableReports] = useState<AnimalReport[]>([]);
  const [myReports, setMyReports] = useState<AnimalReport[]>([]);
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
      const [available, assigned] = await Promise.all([
        reportsAPI.getAvailableReports(),
        user?.id ? reportsAPI.getReportsByNgo(user.id) : Promise.resolve([])
      ]);

      setAvailableReports(available);
      setMyReports(assigned);

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
    if (!user?.id || !user?.fullName) {
      toast.error('User information not available');
      return;
    }

    try {
      await reportsAPI.acceptReport(trackingId, user.id, user.fullName);
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

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">NGO Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user?.fullName}</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Assigned</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalAssigned}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.inProgress}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <AlertTriangle className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Available</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.available}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Available Reports */}
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Available Reports</h2>
              <p className="text-sm text-gray-600">Reports waiting for NGO assignment</p>
            </div>
            <div className="p-6">
              {availableReports.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No available reports at the moment</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {availableReports.map((report) => (
                    <div key={report.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold text-gray-900">{report.trackingId}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          report.urgencyLevel === 'HIGH' ? 'bg-red-100 text-red-800' :
                          report.urgencyLevel === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {report.urgencyLevel}
                        </span>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <p className="text-sm"><span className="font-medium">Animal:</span> {report.animalType}</p>
                        <p className="text-sm"><span className="font-medium">Condition:</span> {report.condition}</p>
                        <p className="text-sm flex items-start">
                          <MapPin className="h-4 w-4 mt-0.5 mr-1 text-gray-500" />
                          {report.location}
                        </p>
                        <p className="text-sm flex items-center">
                          <Clock className="h-4 w-4 mr-1 text-gray-500" />
                          {new Date(report.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      {report.description && (
                        <p className="text-sm text-gray-600 mb-4">{report.description}</p>
                      )}

                      <button
                        onClick={() => handleAcceptReport(report.trackingId)}
                        className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors"
                      >
                        Accept Report
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* My Reports */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">My Assigned Reports</h2>
              <p className="text-sm text-gray-600">Reports assigned to your NGO</p>
            </div>
            <div className="p-6">
              {myReports.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No assigned reports yet</p>
              ) : (
                <div className="space-y-4">
                  {myReports.map((report) => (
                    <div key={report.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">{report.trackingId}</h3>
                          <p className="text-sm text-gray-600">{report.animalType} - {report.condition}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(report.status)}`}>
                          {getStatusText(report.status)}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm flex items-start">
                            <MapPin className="h-4 w-4 mt-0.5 mr-1 text-gray-500" />
                            {report.location}
                          </p>
                          <p className="text-sm mt-1">
                            <span className="font-medium">Reporter:</span> {report.reporterName} ({report.reporterPhone})
                          </p>
                        </div>
                        <div>
                          <p className="text-sm">
                            <span className="font-medium">Urgency:</span> {report.urgencyLevel}
                          </p>
                          <p className="text-sm mt-1 flex items-center">
                            <Clock className="h-4 w-4 mr-1 text-gray-500" />
                            {new Date(report.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {report.description && (
                        <p className="text-sm text-gray-600 mb-4">{report.description}</p>
                      )}

                      {report.status !== 'CASE_RESOLVED' && (
                        <div className="flex flex-wrap gap-2">
                          {report.status === 'SUBMITTED' && (
                            <button
                              onClick={() => handleUpdateStatus(report.trackingId, 'SEARCHING_FOR_HELP')}
                              className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                            >
                              Start Search
                            </button>
                          )}
                          {report.status === 'SEARCHING_FOR_HELP' && (
                            <button
                              onClick={() => handleUpdateStatus(report.trackingId, 'HELP_ON_THE_WAY')}
                              className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700"
                            >
                              Help on Way
                            </button>
                          )}
                          {report.status === 'HELP_ON_THE_WAY' && (
                            <button
                              onClick={() => handleUpdateStatus(report.trackingId, 'TEAM_DISPATCHED')}
                              className="bg-orange-600 text-white px-3 py-1 rounded text-sm hover:bg-orange-700"
                            >
                              Team Dispatched
                            </button>
                          )}
                          {report.status === 'TEAM_DISPATCHED' && (
                            <button
                              onClick={() => handleUpdateStatus(report.trackingId, 'ANIMAL_RESCUED')}
                              className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700"
                            >
                              Animal Rescued
                            </button>
                          )}
                          {report.status === 'ANIMAL_RESCUED' && (
                            <button
                              onClick={() => handleUpdateStatus(report.trackingId, 'CASE_RESOLVED')}
                              className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                            >
                              Mark Resolved
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NgoDashboard;