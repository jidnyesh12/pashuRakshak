import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Activity,
  FileText,
  ChevronRight,
  Plus,
  Heart,
  Sparkles
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import { reportsAPI } from '../../utils/api';
import type { AnimalReport } from '../../types';
import toast from 'react-hot-toast';

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState<AnimalReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    fetchReports();
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const fetchReports = async () => {
    try {
      const data = await reportsAPI.getAllReports();
      setReports(data);
    } catch (error) {
      console.error('Failed to fetch reports:', error);
      toast.error('Failed to load your reports');
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate stats
  const activeReports = reports.filter(r => !['CASE_RESOLVED', 'SUBMITTED'].includes(r.status));
  const pendingReports = reports.filter(r => r.status === 'SUBMITTED');
  const resolvedReports = reports.filter(r => r.status === 'CASE_RESOLVED');

  // Get most critical case
  const criticalCase = [...activeReports, ...pendingReports].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )[0];

  // Urgency level
  const getUrgencyLevel = (status: string): { label: string; color: string; bg: string } => {
    switch (status) {
      case 'SUBMITTED':
        return { label: 'Awaiting Response', color: 'text-amber-700', bg: 'bg-amber-50' };
      case 'SEARCHING_FOR_HELP':
        return { label: 'Searching for Help', color: 'text-orange-700', bg: 'bg-orange-50' };
      case 'HELP_ON_THE_WAY':
      case 'TEAM_DISPATCHED':
        return { label: 'Help En Route', color: 'text-emerald-700', bg: 'bg-emerald-50' };
      case 'ANIMAL_RESCUED':
        return { label: 'Animal Rescued', color: 'text-green-700', bg: 'bg-green-50' };
      default:
        return { label: 'In Progress', color: 'text-blue-700', bg: 'bg-blue-50' };
    }
  };

  // Fallback image for cases without photos
  const getAnimalImage = (report: AnimalReport): string => {
    if (report.imageUrls?.[0]) return report.imageUrls[0];
    const animalImages: Record<string, string> = {
      'dog': 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&q=80',
      'cat': 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&q=80',
      'bird': 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=400&q=80',
      'cow': 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=400&q=80',
    };
    return animalImages[report.animalType.toLowerCase()] || 'https://images.unsplash.com/photo-1474511320723-9a56873571b7?w=400&q=80';
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
      {/* Subtle sage green background */}
      <div className="fixed inset-0 pointer-events-none bg-gradient-to-b from-white via-white to-[#f0f7f4] z-0" />
      
      <div className="relative z-10 min-h-[calc(100vh-8rem)] font-['Inter',system-ui,sans-serif]">
        {/* Header */}
        <div 
          className={`mb-10 transition-all duration-700 ease-out ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
          }`}
        >
          <p className="text-slate-500 text-sm font-medium tracking-wide uppercase">
            Dashboard Overview
          </p>
          <h1 className="text-3xl font-bold text-[#1a5f4a] mt-2">
            Welcome back, {user?.fullName?.split(' ')[0]}
          </h1>
        </div>

        {/* Three Column Layout */}
        <div className="grid grid-cols-12 gap-8 lg:gap-10">
          
          {/* Left: Status Column */}
          <div 
            className={`col-span-12 lg:col-span-3 transition-all duration-700 delay-100 ease-out ${
              mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
            }`}
          >
            <div className="lg:sticky lg:top-24">
              <h2 className="text-xs font-bold text-[#1a5f4a] uppercase tracking-widest mb-6">
                Status
              </h2>
              
              <div className="space-y-4">
                {/* Active Card */}
                <div className="p-5 rounded-xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center">
                        <Activity className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">Active</p>
                        <p className="text-xs text-slate-500">In progress</p>
                      </div>
                    </div>
                    <span className="text-4xl font-bold text-emerald-600">
                      {activeReports.length}
                    </span>
                  </div>
                </div>

                {/* Pending Card */}
                <div className="p-5 rounded-xl bg-white border border-slate-200 hover:border-amber-300 hover:shadow-md transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center">
                        <AlertCircle className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">Pending</p>
                        <p className="text-xs text-slate-500">Awaiting review</p>
                      </div>
                    </div>
                    <span className="text-4xl font-bold text-amber-600">
                      {pendingReports.length}
                    </span>
                  </div>
                </div>

                {/* Resolved Card */}
                <div className="p-5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-400 flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">Resolved</p>
                        <p className="text-xs text-slate-500">Completed</p>
                      </div>
                    </div>
                    <span className="text-4xl font-bold text-slate-500">
                      {resolvedReports.length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Impact Summary */}
              <div className="mt-6 p-5 rounded-xl bg-[#e8f5f0] border border-[#c8e6dc]">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-[#1a5f4a]" />
                  <p className="text-sm font-bold text-[#1a5f4a]">Your Impact</p>
                </div>
                <p className="text-3xl font-bold text-[#1a5f4a]">{reports.length}</p>
                <p className="text-sm text-[#3d7a5f] mt-1">Total reports submitted</p>
              </div>
            </div>
          </div>

          {/* Center: Focus Panel */}
          <div 
            className={`col-span-12 lg:col-span-6 transition-all duration-700 delay-200 ease-out ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <h2 className="text-xs font-bold text-[#1a5f4a] uppercase tracking-widest mb-6">
              Priority Focus
            </h2>

            {criticalCase ? (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                {/* Status Badge */}
                <div className="px-6 pt-6 pb-4">
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${getUrgencyLevel(criticalCase.status).bg} ${getUrgencyLevel(criticalCase.status).color}`}>
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
                      </span>
                      {getUrgencyLevel(criticalCase.status).label}
                    </span>
                    <span className="text-sm text-slate-500 font-mono">
                      #{criticalCase.trackingId}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="px-6 pb-6">
                  <div className="flex flex-col sm:flex-row gap-5">
                    {/* Animal Image */}
                    <div className="w-full sm:w-36 h-36 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100">
                      <img 
                        src={getAnimalImage(criticalCase)}
                        alt={criticalCase.animalType}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-slate-900 capitalize mb-2">
                        {criticalCase.animalType.toLowerCase()} Rescue
                      </h3>
                      
                      <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-2">
                        {criticalCase.injuryDescription || criticalCase.description || 'Case reported and awaiting assessment by rescue team.'}
                      </p>

                      {/* Meta */}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                        {criticalCase.address && (
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4 text-[#3d7a5f]" />
                            <span className="truncate max-w-[180px]">{criticalCase.address}</span>
                          </span>
                        )}
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-[#3d7a5f]" />
                          {new Date(criticalCase.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100">
                  <Link
                    to="/track-report"
                    className="group inline-flex items-center gap-2 text-[#1a5f4a] hover:text-[#0d3d2e] font-semibold transition-colors"
                  >
                    View case details
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ) : (
              /* Empty State */
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#e8f5f0] mb-4">
                  <Heart className="w-8 h-8 text-[#1a5f4a]" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">All Clear</h3>
                <p className="text-slate-500 max-w-sm mx-auto">
                  No active cases. Your reports have been handled successfully.
                </p>
              </div>
            )}

            {/* Activity link */}
            {reports.length > 0 && (
              <div className="mt-5 flex items-center justify-between">
                <span className="text-sm text-slate-500">
                  {reports.length} report{reports.length !== 1 ? 's' : ''} total
                </span>
                <Link 
                  to="/track-report"
                  className="text-sm text-[#1a5f4a] hover:text-[#0d3d2e] font-medium flex items-center gap-1 transition-colors"
                >
                  View history
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>

          {/* Right: Actions Column */}
          <div 
            className={`col-span-12 lg:col-span-3 transition-all duration-700 delay-300 ease-out ${
              mounted ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            }`}
          >
            <h2 className="text-xs font-bold text-[#1a5f4a] uppercase tracking-widest mb-6">
              Quick Actions
            </h2>

            <div className="space-y-4">
              {/* Primary CTA */}
              <Link
                to="/report-animal"
                className="group block w-full p-5 rounded-xl bg-[#1a5f4a] text-white hover:bg-[#0d3d2e] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-lg bg-white/20 flex items-center justify-center">
                    <Plus className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold">Report Animal</p>
                    <p className="text-white/70 text-sm">Submit new case</p>
                  </div>
                </div>
              </Link>

              {/* Secondary CTA */}
              <Link
                to="/track-report"
                className="group block w-full p-5 rounded-xl bg-white border border-slate-200 hover:border-[#1a5f4a] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-lg bg-slate-100 group-hover:bg-[#e8f5f0] flex items-center justify-center transition-colors">
                    <FileText className="w-5 h-5 text-slate-500 group-hover:text-[#1a5f4a] transition-colors" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Track Status</p>
                    <p className="text-slate-500 text-sm">Monitor cases</p>
                  </div>
                </div>
              </Link>
            </div>

            {/* Info tip */}
            <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">
                Did you know?
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                Partner NGOs respond to reports within 30 minutes on average.
              </p>
            </div>

            {/* Rescued count */}
            {resolvedReports.length > 0 && (
              <div className="mt-4 p-5 rounded-xl bg-[#1a5f4a] text-white">
                <p className="text-white/70 text-sm">Animals Helped</p>
                <p className="text-3xl font-bold mt-1">{resolvedReports.length}</p>
                <p className="text-white/50 text-sm mt-0.5">through your reports</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserDashboard;
