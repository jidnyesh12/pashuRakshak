import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Plus,
  MapPin,
  Clock,
  ArrowRight,
  Activity,
  Heart
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import { reportsAPI } from '../../utils/api';
import type { AnimalReport } from '../../types';
import { getStatusText } from '../../utils/auth';
import toast from 'react-hot-toast';

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState<AnimalReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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
      console.error('Failed to fetch reports:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
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

  const statCards = [
    {
      label: 'Total Impact',
      value: stats.totalReports,
      subtext: 'Animals Reported',
      icon: Activity,
      gradient: 'from-blue-500 to-blue-600',
      shadow: 'shadow-blue-200',
    },
    {
      label: 'Active Cases',
      value: stats.activeReports,
      subtext: 'Currently Tracking',
      icon: TrendingUp,
      gradient: 'from-orange-500 to-orange-600',
      shadow: 'shadow-orange-200',
    },
    {
      label: 'Lives Saved',
      value: stats.resolvedReports,
      subtext: 'Successful Rescues',
      icon: Heart,
      gradient: 'from-green-500 to-green-600',
      shadow: 'shadow-green-200',
    },
    {
      label: 'Pending',
      value: stats.pendingReports,
      subtext: 'Awaiting Action',
      icon: AlertTriangle,
      gradient: 'from-red-500 to-red-600',
      shadow: 'shadow-red-200',
    },
  ];

  return (
    <DashboardLayout>
      {/* Hero Section with Glassmorphism */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600 to-indigo-600 p-8 mb-10 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-white opacity-10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-64 w-64 rounded-full bg-purple-400 opacity-10 blur-3xl"></div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Hello, {user?.fullName?.split(' ')[0]}! 👋
            </h1>
            <p className="text-purple-100 max-w-lg text-lg">
              Thank you for being a guardian for the voiceless. Your reports make a real difference in saving lives.
            </p>
          </div>
          <Link
            to="/report-animal"
            className="group flex items-center gap-2 px-6 py-3 bg-white text-purple-600 rounded-xl font-bold hover:bg-purple-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Plus className="h-5 w-5 transition-transform group-hover:rotate-90" />
            Report New Case
          </Link>
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

      {reports.some(r => !['CASE_RESOLVED'].includes(r.status)) && (
        <div className="mb-10 animate-pulse">
          <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-xl shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-2 -mr-2 w-16 h-16 bg-red-500 rounded-full opacity-10 blur-xl"></div>
            <div className="flex items-start gap-4 z-10 relative">
              <div className="p-3 bg-red-100 rounded-full text-red-600 flex-shrink-0">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-red-800 mb-1">Help Needed!</h3>
                <p className="text-red-700 mb-3">
                  Review the latest report carefully. Your swift action can save a life!
                </p>

                {(() => {
                  const latestReport = reports.filter(r => !['CASE_RESOLVED'].includes(r.status)).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
                  if (!latestReport) return null;

                  return (
                    <div className="bg-white p-4 rounded-lg border border-red-100 shadow-sm flex flex-col md:flex-row gap-4">
                      <img
                        src={latestReport.imageUrls?.[0] || 'https://images.unsplash.com/photo-1555685812-4b943f1cb0eb?wx=500&q=80'}
                        alt="Latest Case"
                        className="w-full md:w-32 h-32 object-cover rounded-md"
                      />
                      <div>
                        <div className='flex items-center gap-2 mb-1'>
                          <span className="font-bold text-gray-900 uppercase">{latestReport.animalType}</span>
                          <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold">#{latestReport.trackingId}</span>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-2">{latestReport.description}</p>
                        <div className='flex items-center gap-4 text-xs text-gray-500'>
                          <span className='flex items-center gap-1'><MapPin className="h-3 w-3" /> {latestReport.address}</span>
                          <span className='flex items-center gap-1'><Clock className="h-3 w-3" /> {new Date(latestReport.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="mt-3">
                          <Link to="/track-report" className="text-sm font-bold text-red-600 hover:text-red-800 flex items-center gap-1">
                            View Details <ArrowRight className="h-4 w-4" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Activity className="h-5 w-5 text-purple-600" />
              Recent Reports
            </h2>
            <Link to="/track-report" className="text-sm font-medium text-purple-600 hover:text-purple-700 flex items-center gap-1 hover:gap-2 transition-all">
              View All History <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {reports.length === 0 ? (
              <div className="p-12 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-purple-50 mb-6">
                  <FileText className="h-10 w-10 text-purple-200" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">No reports yet</h3>
                <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                  You haven't submitted any reports yet. Be the first to help an animal in need!
                </p>
                <Link
                  to="/report-animal"
                  className="inline-flex items-center px-6 py-2.5 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
                >
                  Make a Report
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {reports.slice(0, 5).map((report) => (
                  <div key={report.id} className="p-6 hover:bg-gray-50 transition-colors group">
                    <div className="flex gap-5">
                      {/* Image Thumbnail */}
                      <div className="relative h-24 w-24 rounded-xl overflow-hidden flex-shrink-0 shadow-sm group-hover:shadow-md transition-all">
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
                          <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-white shadow-sm ${report.status === 'CASE_RESOLVED' ? 'bg-green-500' :
                              report.status === 'SUBMITTED' ? 'bg-blue-500' : 'bg-orange-500'
                            }`}>
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
                                {new Date(report.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                              </span>
                            </div>
                          </div>
                        </div>

                        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                          {report.description || 'No description provided'}
                        </p>

                        <div className="flex items-center text-xs text-gray-500 font-medium">
                          <MapPin className="h-3.5 w-3.5 mr-1.5 text-purple-500" />
                          <span className="truncate max-w-[200px] sm:max-w-xs">
                            {report.address || 'Location not specified'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link to="/report-animal" className="flex items-center p-3 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors group">
                <div className="p-2 bg-white rounded-lg mr-3 shadow-sm group-hover:scale-110 transition-transform">
                  <Plus className="h-5 w-5" />
                </div>
                <span className="font-medium">Report Animal</span>
              </Link>
              <Link to="/emergency" className="flex items-center p-3 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 transition-colors group">
                <div className="p-2 bg-white rounded-lg mr-3 shadow-sm group-hover:scale-110 transition-transform">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <span className="font-medium">Emergency Help</span>
              </Link>
              <Link to="/track-report" className="flex items-center p-3 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors group">
                <div className="p-2 bg-white rounded-lg mr-3 shadow-sm group-hover:scale-110 transition-transform">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <span className="font-medium">Track Status</span>
              </Link>
            </div>
          </div>

          {/* Impact Card */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-purple-500 rounded-full opacity-20 blur-xl"></div>
            <h3 className="font-bold text-lg mb-2 relative z-10">Did You Know?</h3>
            <p className="text-gray-300 text-sm mb-4 relative z-10">
              Your reports help us identify high-risk areas and deploy resources more effectively. Every report counts!
            </p>
            <div className="flex items-center gap-2 text-xs font-medium text-purple-300 relative z-10">
              <CheckCircle className="h-4 w-4" />
              <span>Verified Impact</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserDashboard;
