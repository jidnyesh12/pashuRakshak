import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Heart, FileText, AlertTriangle, CheckCircle, TrendingUp, Plus } from 'lucide-react';
import Layout from '../../components/common/Layout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ReportModal from '../../components/common/ReportModal';
import { useAuth } from '../../context/AuthContext';
import { reportsAPI } from '../../utils/api';
import type { AnimalReport } from '../../types';
import { getStatusColor, getStatusText } from '../../utils/auth';
import toast from 'react-hot-toast';

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState<AnimalReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showReportModal, setShowReportModal] = useState(false);
  const [stats, setStats] = useState({
    totalReports: 0,
    activeReports: 0,
    resolvedReports: 0,
    pendingReports: 0,
  });

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const data = await reportsAPI.getAllReports();
      setReports(data);

      // Calculate stats
      setStats({
        totalReports: data.length,
        activeReports: data.filter((r) => !['CASE_RESOLVED'].includes(r.status)).length,
        resolvedReports: data.filter((r) => r.status === 'CASE_RESOLVED').length,
        pendingReports: data.filter((r) => r.status === 'SUBMITTED').length,
      });
    } catch (error) {
      toast.error('Failed to fetch reports');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
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
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">User Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.fullName}</p>
            </div>
            <button
              onClick={() => setShowReportModal(true)}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Report Animal
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Reports</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalReports}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Reports</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeReports}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Resolved</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.resolvedReports}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <AlertTriangle className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pendingReports}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Reports */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">All Animal Reports</h2>
              <p className="text-sm text-gray-600">Community reports from across the platform</p>
            </div>
            <div className="p-6">
              {reports.length === 0 ? (
                <div className="text-center py-8">
                  <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No reports found</p>
                  <p className="text-gray-400 text-sm mt-2">Community reports will appear here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reports.map((report) => (
                    <div
                      key={report.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {report.animalType} - {report.trackingId}
                          </h3>
                          <p className="text-gray-600 text-sm">{report.injuryDescription}</p>
                        </div>
                        <span className={`status-badge ${getStatusColor(report.status)}`}>
                          {getStatusText(report.status)}
                        </span>
                      </div>

                      <div className="flex items-center text-sm text-gray-500 space-x-4">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {report.address || 'Location not specified'}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {new Date(report.createdAt).toLocaleDateString()}
                        </div>
                      </div>

                      {report.assignedNgoName && (
                        <div className="mt-2 text-sm text-green-600">
                          Assigned to: {report.assignedNgoName}
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

      {/* Report Modal */}
      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        onSuccess={(trackingId) => {
          fetchReports(); // Refresh reports after successful submission
        }}
      />
    </Layout>
  );
};

export default UserDashboard;
