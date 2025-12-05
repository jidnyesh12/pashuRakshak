import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Calendar, Shield, Save, Lock } from 'lucide-react';
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
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const [profileForm, setProfileForm] = useState({
    fullName: '',
    email: '',
    phone: ''
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await userAPI.getProfile();
      setProfileData(data);
      setProfileForm({
        fullName: data.fullName,
        email: data.email,
        phone: data.phone || ''
      });

      // Fetch NGO details if user is an NGO
      if (data.roles.includes('NGO') || data.roles.includes('NGO_WORKER')) {
        try {
          let ngoData;
          if (data.ngoId) {
            ngoData = await ngoAPI.getNgoById(data.ngoId);
          } else {
            // Fallback to email if ngoId is missing (legacy support)
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

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const updatedUser = await userAPI.updateProfile(profileForm);
      setProfileData(updatedUser);
      updateUser(updatedUser);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
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
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600 to-indigo-600 p-8 mb-10 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-white opacity-10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-64 w-64 rounded-full bg-purple-400 opacity-10 blur-3xl"></div>

        <div className="relative z-10 flex items-center gap-6">
          <div className="h-24 w-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl font-bold border-4 border-white/30 shadow-inner">
            {profileData?.fullName?.charAt(0) || 'U'}
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-1">{profileData?.fullName}</h1>
            <p className="text-purple-100 flex items-center gap-2">
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                {profileData?.roles?.[0] || 'User'}
              </span>
              <span className="text-sm opacity-80">
                Member since {new Date(profileData?.createdAt || '').getFullYear()}
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Profile Summary */}
        <div className="lg:col-span-1 space-y-6">

          {/* NGO Details Card - Only for NGO users */}
          {ngoDetails && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-100 bg-purple-50/30">
              <h3 className="font-bold text-lg text-purple-900 mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5 text-purple-600" />
                NGO Organization
              </h3>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-purple-100">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Organization Name</p>
                  <p className="font-bold text-gray-900 text-lg">{ngoDetails.name}</p>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm border border-purple-100">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">NGO ID</p>
                  <div className="flex items-center gap-2">
                    <code className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm font-mono font-bold">
                      {ngoDetails.uniqueId || 'Generating...'}
                    </code>
                    {ngoDetails.verificationStatus === 'APPROVED' && (
                      <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium">
                        Verified
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600 px-1">
                  <span className={`w-2 h-2 rounded-full ${ngoDetails.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  Status: <span className="font-medium">{ngoDetails.isActive ? 'Active' : 'Inactive'}</span>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4">Contact Details</h3>
            <div className="space-y-4">
              <div className="flex items-center p-3 bg-gray-50 rounded-xl">
                <div className="p-2 bg-white rounded-lg mr-3 shadow-sm">
                  <Mail className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email Address</p>
                  <p className="text-sm font-medium text-gray-900 break-all">{profileData?.email}</p>
                </div>
              </div>
              <div className="flex items-center p-3 bg-gray-50 rounded-xl">
                <div className="p-2 bg-white rounded-lg mr-3 shadow-sm">
                  <Phone className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Phone Number</p>
                  <p className="text-sm font-medium text-gray-900">{profileData?.phone || 'Not provided'}</p>
                </div>
              </div>
              <div className="flex items-center p-3 bg-gray-50 rounded-xl">
                <div className="p-2 bg-white rounded-lg mr-3 shadow-sm">
                  <Calendar className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Joined On</p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(profileData?.createdAt || '').toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Edit Profile */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <User className="h-5 w-5 text-purple-600" />
                Personal Information
              </h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-sm font-medium text-purple-600 hover:text-purple-700 hover:bg-purple-50 px-3 py-1.5 rounded-lg transition-colors"
                >
                  Edit Details
                </button>
              )}
            </div>

            <div className="p-6">
              {isEditing ? (
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        value={profileForm.fullName}
                        onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setProfileForm({
                          fullName: profileData?.fullName || '',
                          email: profileData?.email || '',
                          phone: profileData?.phone || ''
                        });
                      }}
                      className="px-4 py-2 text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-medium flex items-center shadow-sm shadow-purple-200"
                    >
                      {loading ? <LoadingSpinner size="sm" /> : <Save className="h-4 w-4 mr-2" />}
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Full Name</p>
                    <p className="text-gray-900 font-medium">{profileData?.fullName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Phone Number</p>
                    <p className="text-gray-900 font-medium">{profileData?.phone || 'Not provided'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Email Address</p>
                    <p className="text-gray-900 font-medium">{profileData?.email}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Shield className="h-5 w-5 text-purple-600" />
                Security Settings
              </h2>
              {!showPasswordForm && (
                <button
                  onClick={() => setShowPasswordForm(true)}
                  className="text-sm font-medium text-purple-600 hover:text-purple-700 hover:bg-purple-50 px-3 py-1.5 rounded-lg transition-colors"
                >
                  Change Password
                </button>
              )}
            </div>

            <div className="p-6">
              {showPasswordForm ? (
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="password"
                          value={passwordForm.currentPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input
                            type="password"
                            value={passwordForm.newPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input
                            type="password"
                            value={passwordForm.confirmPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowPasswordForm(false);
                        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                      }}
                      className="px-4 py-2 text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-medium flex items-center shadow-sm shadow-purple-200"
                    >
                      {loading ? <LoadingSpinner size="sm" /> : <Shield className="h-4 w-4 mr-2" />}
                      Update Password
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Password</p>
                      <p className="text-xs text-gray-500">Last changed recently</p>
                    </div>
                  </div>
                  <div className="text-gray-400 font-mono text-sm">••••••••</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;