import React, { useState, useEffect } from 'react';
import { Mail, Phone, Calendar, Shield, CheckCircle2, Lock, Edit3, X, Check } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { userAPI, ngoAPI } from '../utils/api';
import toast from 'react-hot-toast';
import type { User as UserType, NGO } from '../types';

const Profile: React.FC = () => {
  const { updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState<UserType | null>(null);
  const [ngoDetails, setNgoDetails] = useState<NGO | null>(null);
  const [mounted, setMounted] = useState(false);
  
  // Inline editing states
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  
  // Password form
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    loadProfile();
    setTimeout(() => setMounted(true), 100);
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await userAPI.getProfile();
      setProfileData(data);

      // Fetch NGO details if user is an NGO
      if (data.roles.includes('NGO') || data.roles.includes('NGO_WORKER')) {
        try {
          let ngoData;
          if (data.ngoId) {
            ngoData = await ngoAPI.getNgoById(data.ngoId);
          } else {
            ngoData = await ngoAPI.getNgoByEmail(data.email);
          }
          setNgoDetails(ngoData);
        } catch (error) {
          console.error('Failed to fetch NGO details', error);
        }
      }
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (field: string, currentValue: string) => {
    setEditingField(field);
    setEditValue(currentValue || '');
  };

  const cancelEditing = () => {
    setEditingField(null);
    setEditValue('');
  };

  const saveField = async (field: string) => {
    if (!editValue.trim()) {
      toast.error('Value cannot be empty');
      return;
    }

    try {
      setLoading(true);
      const updateData = {
        fullName: profileData?.fullName || '',
        email: profileData?.email || '',
        phone: profileData?.phone || '',
        [field]: editValue
      };
      
      const updatedUser = await userAPI.updateProfile(updateData);
      setProfileData(updatedUser);
      updateUser(updatedUser);
      setEditingField(null);
      setEditValue('');
      toast.success('Updated successfully');
    } catch (error) {
      toast.error('Failed to update');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      await userAPI.changePassword(passwordForm);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordForm(false);
      toast.success('Password changed successfully');
    } catch (error) {
      toast.error('Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const getMemberSince = () => {
    if (!profileData?.createdAt) return 'Recently';
    const date = new Date(profileData.createdAt);
    const now = new Date();
    const months = (now.getFullYear() - date.getFullYear()) * 12 + (now.getMonth() - date.getMonth());
    if (months < 1) return 'This month';
    if (months < 12) return `${months} month${months > 1 ? 's' : ''} ago`;
    const years = Math.floor(months / 12);
    return `${years} year${years > 1 ? 's' : ''} ago`;
  };

  const getRoleLabel = () => {
    const role = profileData?.roles?.[0];
    switch (role) {
      case 'ADMIN': return 'Administrator';
      case 'NGO': return 'NGO Representative';
      case 'NGO_WORKER': return 'Field Worker';
      default: return 'Guardian';
    }
  };

  if (loading && !profileData) {
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
      <div className="max-w-3xl mx-auto font-['Inter',system-ui,sans-serif]">
        
        {/* Banner Header */}
        <div 
          className={`relative overflow-hidden rounded-2xl mb-12 transition-all duration-700 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
          }`}
        >
          {/* Gradient Banner */}
          <div className="h-32 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 relative rounded-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 to-transparent rounded-2xl" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-32 -mt-32" />
          </div>
          
          {/* Profile Card - Overlaps Banner */}
          <div className="relative -mt-12 mx-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-5">
                {/* Avatar */}
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-3xl font-bold text-white shadow-lg flex-shrink-0">
                  {profileData?.fullName?.charAt(0) || 'U'}
                </div>
                
                <div className="flex-1 min-w-0">
                  {/* Name */}
                  <h1 className="text-xl font-bold text-slate-900 truncate">
                    {profileData?.fullName}
                  </h1>
                  
                  {/* Role */}
                  <p className="text-slate-500 text-sm mt-0.5">
                    {getRoleLabel()}
                  </p>
                  
                  {/* Trust Badges */}
                  <div className="flex items-center gap-3 mt-3 flex-wrap">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Verified email</span>
                    </div>
                    <div className="w-1 h-1 rounded-full bg-slate-300" />
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Member since {getMemberSince()}</span>
                    </div>
                    {ngoDetails?.verificationStatus === 'APPROVED' && (
                      <>
                        <div className="w-1 h-1 rounded-full bg-slate-300" />
                        <div className="flex items-center gap-1.5 text-xs text-emerald-600">
                          <Shield className="w-3.5 h-3.5" />
                          <span>Verified NGO</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div 
          className={`space-y-12 transition-all duration-700 delay-200 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          
          {/* NGO Information - Only for NGO users */}
          {ngoDetails && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <Shield className="w-5 h-5 text-emerald-600" />
                <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Organization</h2>
              </div>
              
              <div className="space-y-5">
                <div className="flex items-center justify-between py-4 border-b border-slate-100">
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Organization Name</p>
                    <p className="text-slate-900 font-medium">{ngoDetails.name}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between py-4 border-b border-slate-100">
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">NGO ID</p>
                    <code className="text-slate-900 font-mono text-sm">{ngoDetails.uniqueId || 'Generating...'}</code>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    ngoDetails.isActive 
                      ? 'bg-emerald-50 text-emerald-700' 
                      : 'bg-red-50 text-red-700'
                  }`}>
                    {ngoDetails.isActive ? 'Active' : 'Inactive'}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Personal Information */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px flex-1 bg-slate-100" />
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Personal Information</h2>
              <div className="h-px flex-1 bg-slate-100" />
            </div>
            
            <div className="space-y-1">
              {/* Full Name - Inline Editable */}
              <div className="group flex items-center justify-between py-5 border-b border-slate-100 hover:bg-slate-50/50 -mx-4 px-4 rounded-lg transition-colors">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-emerald-600">{profileData?.fullName?.charAt(0) || 'U'}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Full Name</p>
                    {editingField === 'fullName' ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="flex-1 px-3 py-2 border-b-2 border-emerald-500 bg-transparent text-slate-900 font-medium focus:outline-none"
                          autoFocus
                        />
                        <button
                          onClick={() => saveField('fullName')}
                          disabled={loading}
                          className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        >
                          <Check className="w-5 h-5" />
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <p className="text-slate-900 font-medium">{profileData?.fullName}</p>
                    )}
                  </div>
                </div>
                {editingField !== 'fullName' && (
                  <button
                    onClick={() => startEditing('fullName', profileData?.fullName || '')}
                    className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Email */}
              <div className="flex items-center justify-between py-5 border-b border-slate-100 -mx-4 px-4">
                <div className="flex items-center gap-4">
                  <Mail className="w-5 h-5 text-slate-300 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Email Address</p>
                    <p className="text-slate-900 font-medium">{profileData?.email}</p>
                  </div>
                </div>
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              </div>

              {/* Phone - Inline Editable */}
              <div className="group flex items-center justify-between py-5 border-b border-slate-100 hover:bg-slate-50/50 -mx-4 px-4 rounded-lg transition-colors">
                <div className="flex items-center gap-4 flex-1">
                  <Phone className="w-5 h-5 text-slate-300 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Phone Number</p>
                    {editingField === 'phone' ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="tel"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="flex-1 px-3 py-2 border-b-2 border-emerald-500 bg-transparent text-slate-900 focus:outline-none"
                          autoFocus
                          placeholder="Enter phone number"
                        />
                        <button
                          onClick={() => saveField('phone')}
                          disabled={loading}
                          className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        >
                          <Check className="w-5 h-5" />
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <p className={profileData?.phone ? 'text-slate-900' : 'text-slate-400 italic'}>
                        {profileData?.phone || 'Not provided'}
                      </p>
                    )}
                  </div>
                </div>
                {editingField !== 'phone' && (
                  <button
                    onClick={() => startEditing('phone', profileData?.phone || '')}
                    className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Member Since */}
              <div className="flex items-center justify-between py-5 -mx-4 px-4">
                <div className="flex items-center gap-4">
                  <Calendar className="w-5 h-5 text-slate-300 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Joined</p>
                    <p className="text-slate-900 font-medium">
                      {new Date(profileData?.createdAt || '').toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Security - Minimal and Calm */}
          <section className="pb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px flex-1 bg-slate-100" />
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Security</h2>
              <div className="h-px flex-1 bg-slate-100" />
            </div>
            
            {showPasswordForm ? (
              <form onSubmit={handleChangePassword} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-slate-400 uppercase tracking-wider mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-slate-400 focus:ring-0 outline-none transition-colors text-slate-900"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-400 uppercase tracking-wider mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-slate-400 focus:ring-0 outline-none transition-colors text-slate-900"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 uppercase tracking-wider mb-2">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-slate-400 focus:ring-0 outline-none transition-colors text-slate-900"
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {loading && <LoadingSpinner size="sm" variant="white" />}
                    Update Password
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordForm(false);
                      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                    }}
                    className="px-6 py-3 text-slate-600 hover:bg-slate-100 rounded-xl font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex items-center justify-between py-5 -mx-4 px-4 hover:bg-slate-50/50 rounded-lg transition-colors group">
                <div className="flex items-center gap-4">
                  <Lock className="w-5 h-5 text-slate-300" />
                  <div>
                    <p className="text-slate-900 font-medium">Password</p>
                    <p className="text-sm text-slate-400">Last changed recently</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPasswordForm(true)}
                  className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg font-medium transition-colors"
                >
                  Change
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;