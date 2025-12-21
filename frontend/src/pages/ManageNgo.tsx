import React, { useState, useEffect } from 'react';
import { Users, Mail, Phone, User, ToggleLeft, ToggleRight, CheckCircle2, ArrowLeft, Shield, Clock, Bell, FileCheck, Lightbulb } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { ngoAPI } from '../utils/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/common/LoadingSpinner';
import type { UserResponse } from '../types';

const ManageNgo: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [workerForm, setWorkerForm] = useState({
    username: '',
    name: '',
    email: '',
    phone: '',
    age: '',
    gender: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [workers, setWorkers] = useState<UserResponse[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    if (user?.ngoId) loadWorkers();
    return () => clearTimeout(timer);
  }, [user?.ngoId]);

  const loadWorkers = async () => {
    if (!user?.ngoId) return;
    try {
      const data = await ngoAPI.getWorkers(user.ngoId);
      setWorkers(data);
    } catch (error) {
      console.error('Failed to load workers');
    }
  };

  const handleAddWorker = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.ngoId) {
      toast.error('NGO ID not found');
      return;
    }

    setSubmitting(true);

    try {
      await ngoAPI.addWorker(user.ngoId, {
        ...workerForm,
        age: parseInt(workerForm.age) || 0
      });
      setWorkerForm({ username: '', name: '', email: '', phone: '', age: '', gender: '' });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 4000);
      loadWorkers();
    } catch (error: any) {
      toast.error(error.response?.data || 'Failed to add worker');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleWorkerStatus = async (workerId: number) => {
    if (!user?.ngoId) return;
    try {
      await ngoAPI.toggleWorkerStatus(user.ngoId, workerId);
      toast.success('Status updated');
      loadWorkers();
    } catch (error: any) {
      toast.error(error.response?.data || 'Failed to update status');
    }
  };

  // Tips/Instructions data
  const onboardingTips = [
    {
      icon: Shield,
      title: 'Secure Access',
      description: 'Login credentials are auto-generated and sent via email. Workers can change their password after first login.'
    },
    {
      icon: Bell,
      title: 'Instant Notifications',
      description: 'Workers receive real-time alerts for new case assignments and status updates.'
    },
    {
      icon: Clock,
      title: 'Field Ready',
      description: 'New workers can start accepting cases immediately after email verification.'
    },
    {
      icon: FileCheck,
      title: 'Track Performance',
      description: 'Monitor response times and case completion rates from the dashboard.'
    }
  ];

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto font-['Inter',system-ui,sans-serif]">
        
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className={`flex items-center gap-2 text-slate-400 hover:text-slate-600 mb-8 transition-all duration-500 ${
            mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back</span>
        </button>

        {/* Header */}
        <div 
          className={`mb-10 transition-all duration-700 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
          }`}
        >
          <h1 className="text-3xl font-bold text-slate-900">Team Onboarding</h1>
          <p className="text-slate-500 mt-2">Add trusted field members to your rescue operations</p>
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Left: Form */}
          <div className="lg:col-span-2">
            
            {/* Success Message */}
            {showSuccess && (
              <div className="mb-8 p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-3 animate-fade-in">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <div>
                  <p className="text-emerald-800 font-medium">Team member added successfully</p>
                  <p className="text-emerald-600 text-sm">Login credentials have been sent to their email.</p>
                </div>
              </div>
            )}

            {/* Form Card */}
            <div 
              className={`bg-white rounded-2xl border border-slate-100 shadow-sm p-8 transition-all duration-700 delay-100 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <form onSubmit={handleAddWorker}>
                
                {/* Section: Identity */}
                <div className="mb-8">
                  <h3 className="text-sm font-semibold text-slate-900 mb-1">Basic Information</h3>
                  <p className="text-xs text-slate-400 mb-4">Worker's identity details for account creation</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">Username</label>
                      <input
                        type="text"
                        required
                        value={workerForm.username}
                        onChange={(e) => setWorkerForm({ ...workerForm, username: e.target.value })}
                        className="w-full px-4 py-3 border border-slate-200 bg-slate-50/50 rounded-xl focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all"
                        placeholder="johndoe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">Full Name</label>
                      <input
                        type="text"
                        required
                        value={workerForm.name}
                        onChange={(e) => setWorkerForm({ ...workerForm, name: e.target.value })}
                        className="w-full px-4 py-3 border border-slate-200 bg-slate-50/50 rounded-xl focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                </div>

                {/* Section: Contact */}
                <div className="mb-8">
                  <h3 className="text-sm font-semibold text-slate-900 mb-1">Contact Details</h3>
                  <p className="text-xs text-slate-400 mb-4">How we'll reach them for assignments and updates</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                        <input
                          type="email"
                          required
                          value={workerForm.email}
                          onChange={(e) => setWorkerForm({ ...workerForm, email: e.target.value })}
                          className="w-full pl-11 pr-4 py-3 border border-slate-200 bg-slate-50/50 rounded-xl focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                        <input
                          type="tel"
                          required
                          value={workerForm.phone}
                          onChange={(e) => setWorkerForm({ ...workerForm, phone: e.target.value })}
                          className="w-full pl-11 pr-4 py-3 border border-slate-200 bg-slate-50/50 rounded-xl focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all"
                          placeholder="+91 98765 43210"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section: Additional */}
                <div className="mb-8">
                  <h3 className="text-sm font-semibold text-slate-900 mb-1">Additional Details</h3>
                  <p className="text-xs text-slate-400 mb-4">Optional information for better record keeping</p>
                  
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">Age</label>
                      <input
                        type="number"
                        required
                        min="18"
                        max="100"
                        value={workerForm.age}
                        onChange={(e) => setWorkerForm({ ...workerForm, age: e.target.value })}
                        className="w-full px-4 py-3 border border-slate-200 bg-slate-50/50 rounded-xl focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all"
                        placeholder="25"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">Gender</label>
                      <select
                        required
                        value={workerForm.gender}
                        onChange={(e) => setWorkerForm({ ...workerForm, gender: e.target.value })}
                        className="w-full px-4 py-3 border border-slate-200 bg-slate-50/50 rounded-xl focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all appearance-none cursor-pointer"
                      >
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setWorkerForm({ username: '', name: '', email: '', phone: '', age: '', gender: '' })}
                    className="text-sm text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    Clear form
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-emerald-600/20"
                  >
                    {submitting ? (
                      <LoadingSpinner size="sm" variant="white" />
                    ) : (
                      <>
                        <Users className="w-4 h-4" />
                        <span>Add to NGO Team</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right: Tips & Instructions */}
          <div 
            className={`lg:col-span-1 transition-all duration-700 delay-200 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            {/* Tips Header */}
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                <Lightbulb className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Quick Tips</h3>
                <p className="text-xs text-slate-400">For NGO representatives</p>
              </div>
            </div>

            {/* Tips List */}
            <div className="space-y-4">
              {onboardingTips.map((tip, index) => (
                <div 
                  key={index}
                  className="p-4 bg-white rounded-xl border border-slate-100 hover:border-emerald-100 hover:shadow-sm transition-all"
                  style={{ animationDelay: `${(index + 3) * 100}ms` }}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                      <tip.icon className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-800 text-sm mb-1">{tip.title}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">{tip.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Important Note */}
            <div className="mt-6 p-4 bg-amber-50 border border-amber-100 rounded-xl">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <Bell className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-medium text-amber-800 text-sm mb-1">Important</h4>
                  <p className="text-xs text-amber-700 leading-relaxed">
                    Ensure phone numbers are valid for emergency SMS alerts. Workers will receive a password reset link if they forget credentials.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Team Members Section */}
        <section 
          className={`mt-12 transition-all duration-700 delay-300 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Current Team</h2>
              <p className="text-sm text-slate-500">{workers.length} active field worker{workers.length !== 1 ? 's' : ''}</p>
            </div>
          </div>

          {workers.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <User className="w-10 h-10 text-slate-200 mx-auto mb-3" />
              <p className="text-slate-400 font-medium">No team members yet</p>
              <p className="text-sm text-slate-300 mt-1">Add your first field worker using the form above</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {workers.map((worker) => (
                <div 
                  key={worker.id} 
                  className="bg-white rounded-xl border border-slate-100 p-4 hover:border-slate-200 hover:shadow-sm transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 font-semibold">
                        {worker.fullName.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-medium text-slate-900">{worker.fullName}</h3>
                        <p className="text-xs text-slate-400">Field Worker</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggleWorkerStatus(worker.id)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        worker.enabled
                          ? 'text-emerald-600 hover:bg-emerald-50'
                          : 'text-slate-400 hover:bg-slate-100'
                      }`}
                      title={worker.enabled ? 'Deactivate' : 'Activate'}
                    >
                      {worker.enabled ? (
                        <ToggleRight className="w-5 h-5" />
                      ) : (
                        <ToggleLeft className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  
                  <div className="space-y-1.5 text-sm">
                    <p className="flex items-center gap-2 text-slate-500">
                      <Mail className="w-3.5 h-3.5 text-slate-300" />
                      {worker.email}
                    </p>
                    {worker.phone && (
                      <p className="flex items-center gap-2 text-slate-500">
                        <Phone className="w-3.5 h-3.5 text-slate-300" />
                        {worker.phone}
                      </p>
                    )}
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-slate-50">
                    <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${
                      worker.enabled
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-slate-100 text-slate-500'
                    }`}>
                      {worker.enabled ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
};

export default ManageNgo;
