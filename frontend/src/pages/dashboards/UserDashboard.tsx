import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Activity,
  FileText,
  Plus,
  Heart,
  LayoutDashboard,
  History,
  User,
  LogOut,
  Sparkles
} from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import { reportsAPI } from '../../utils/api';
import type { AnimalReport } from '../../types';
import toast from 'react-hot-toast';

const UserDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
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

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  // Stats
  const activeReports = reports.filter(r => !['CASE_RESOLVED', 'SUBMITTED'].includes(r.status));
  const pendingReports = reports.filter(r => r.status === 'SUBMITTED');
  const resolvedReports = reports.filter(r => r.status === 'CASE_RESOLVED');

  const criticalCase = [...activeReports, ...pendingReports].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )[0];

  const getUrgencyLevel = (status: string) => {
    switch (status) {
      case 'SUBMITTED': return { label: 'Awaiting Response', color: 'text-amber-400', bg: 'bg-amber-500/10' };
      case 'SEARCHING_FOR_HELP': return { label: 'Searching for Help', color: 'text-orange-400', bg: 'bg-orange-500/10' };
      case 'HELP_ON_THE_WAY':
      case 'TEAM_DISPATCHED': return { label: 'Help En Route', color: 'text-emerald-400', bg: 'bg-emerald-500/10' };
      case 'ANIMAL_RESCUED': return { label: 'Animal Rescued', color: 'text-green-400', bg: 'bg-green-500/10' };
      default: return { label: 'In Progress', color: 'text-blue-400', bg: 'bg-blue-500/10' };
    }
  };

  const getAnimalImage = (report: AnimalReport): string => {
    if (report.imageUrls?.[0]) return report.imageUrls[0];
    const images: Record<string, string> = {
      'dog': 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&q=80',
      'cat': 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&q=80',
      'bird': 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=400&q=80',
      'cow': 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=400&q=80',
    };
    return images[report.animalType.toLowerCase()] || 'https://images.unsplash.com/photo-1474511320723-9a56873571b7?w=400&q=80';
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Navigation items
  const navItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/user/dashboard' },
    { icon: Plus, label: 'Report', path: '/report-animal' },
    { icon: History, label: 'History', path: '/track-report' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex font-['Inter',system-ui,sans-serif]">
      
      {/* Dark Sidebar - Hidden on mobile */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#1a1c1e] text-white fixed h-full">
        
        {/* Logo */}
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg">PashuRakshak</h1>
              <p className="text-xs text-slate-400">Rescue Command</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-3">
            Navigation
          </p>
          <div className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                  ${isActive 
                    ? 'bg-white/10 text-white' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }
                `}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Command Center - Status Counters */}
        <div className="p-4 border-t border-white/5">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-3">
            Command Center
          </p>
          <div className="space-y-2">
            {/* Active */}
            <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-sm text-emerald-400">Active</span>
              </div>
              <span className="text-lg font-bold text-emerald-400">{activeReports.length}</span>
            </div>
            
            {/* Pending */}
            <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="text-sm text-amber-400">Pending</span>
              </div>
              <span className="text-lg font-bold text-amber-400">{pendingReports.length}</span>
            </div>
            
            {/* Resolved */}
            <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-slate-500/10 border border-slate-500/20">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-400">Resolved</span>
              </div>
              <span className="text-lg font-bold text-slate-400">{resolvedReports.length}</span>
            </div>
          </div>
        </div>

        {/* User & Logout */}
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center justify-between px-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-slate-700 flex items-center justify-center text-sm font-bold">
                {user?.fullName?.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-medium truncate max-w-[100px]">{user?.fullName?.split(' ')[0]}</p>
                <p className="text-xs text-slate-500">Guardian</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 bg-[#f8fafc] min-h-screen">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 py-8">
          
          {/* Header */}
          <div className={`mb-10 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
            <p className="text-slate-400 text-sm font-medium">{getGreeting()}</p>
            <h1 className="text-2xl font-bold text-slate-800 mt-1">
              Welcome back, {user?.fullName?.split(' ')[0]}
            </h1>
          </div>

          {/* Quick Actions - Top Right Tiles */}
          <div className={`grid grid-cols-2 gap-4 mb-8 transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <Link
              to="/report-animal"
              className="flex items-center gap-4 p-5 bg-[#166534] text-white rounded-xl hover:bg-[#14532d] transition-colors shadow-lg shadow-emerald-900/10"
            >
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <Plus className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold">Report Animal</p>
                <p className="text-white/70 text-sm">Submit new case</p>
              </div>
            </Link>
            <Link
              to="/track-report"
              className="flex items-center gap-4 p-5 bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition-colors shadow-sm"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                <FileText className="w-6 h-6 text-slate-600" />
              </div>
              <div>
                <p className="font-bold text-slate-800">Track Cases</p>
                <p className="text-slate-500 text-sm">View history</p>
              </div>
            </Link>
          </div>

          {/* Priority Focus Card - Hero Element */}
          <div className={`mb-8 transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Priority Focus</p>
            
            {criticalCase ? (
              <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  {/* Image - Left */}
                  <div className="md:w-64 h-48 md:h-auto flex-shrink-0">
                    <img 
                      src={getAnimalImage(criticalCase)}
                      alt={criticalCase.animalType}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Content - Right */}
                  <div className="flex-1 p-6">
                    {/* Status Badge */}
                    <div className="flex items-center gap-3 mb-4">
                      <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${getUrgencyLevel(criticalCase.status).bg} ${getUrgencyLevel(criticalCase.status).color}`}>
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-current" />
                        </span>
                        {getUrgencyLevel(criticalCase.status).label}
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="text-xl font-bold text-slate-800 capitalize mb-4">
                      {criticalCase.animalType.toLowerCase()} Rescue
                    </h2>

                    {/* Metadata - Stacked */}
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <span className="font-mono text-slate-400">Case ID:</span>
                        <span className="font-medium text-slate-700">#{criticalCase.trackingId}</span>
                      </div>
                      {criticalCase.address && (
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <MapPin className="w-4 h-4 text-[#166534]" />
                          <span className="truncate">{criticalCase.address}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Clock className="w-4 h-4 text-[#166534]" />
                        {new Date(criticalCase.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>

                    {/* CTA */}
                    <Link
                      to="/track-report"
                      className="inline-flex items-center gap-2 text-[#166534] hover:text-[#14532d] font-semibold transition-colors"
                    >
                      View Details
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-[#f0fdf4] flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-[#166534]" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">All Clear</h3>
                <p className="text-slate-500">No active cases. Your reports have been handled successfully.</p>
              </div>
            )}
          </div>

          {/* Mobile Status Cards - Show only on mobile */}
          <div className="lg:hidden grid grid-cols-3 gap-3 mb-8">
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-center">
              <p className="text-2xl font-bold text-emerald-600">{activeReports.length}</p>
              <p className="text-xs text-emerald-600/70">Active</p>
            </div>
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 text-center">
              <p className="text-2xl font-bold text-amber-600">{pendingReports.length}</p>
              <p className="text-xs text-amber-600/70">Pending</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-center">
              <p className="text-2xl font-bold text-slate-600">{resolvedReports.length}</p>
              <p className="text-xs text-slate-500">Resolved</p>
            </div>
          </div>

          {/* Impact Summary Card */}
          <div className={`transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="bg-gradient-to-br from-[#f0fdf4] to-emerald-50 rounded-xl p-6 border border-emerald-100">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-[#166534]" />
                    <p className="text-sm font-semibold text-[#166534]">Your Impact</p>
                  </div>
                  <p className="text-3xl font-bold text-[#166534]">{reports.length}</p>
                  <p className="text-sm text-emerald-600/70">Total reports submitted</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-emerald-600/50 mb-1">Did you know?</p>
                  <p className="text-sm text-emerald-700 max-w-[200px]">
                    Partner NGOs respond to reports within 30 minutes on average.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex flex-col items-center gap-1 p-2 rounded-lg transition-colors
                ${isActive ? 'text-[#166534]' : 'text-slate-400'}
              `}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default UserDashboard;
