import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Calendar, Shield, Save } from 'lucide-react';
import Layout from '../components/common/Layout';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../utils/api';
import toast from 'react-hot-toast';
import type { User as UserType, UpdateUserRequest, ChangePasswordRequest } from '../types';

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState<UserType | null>(null);
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
            <p className="text-gray-600">Manage your account information and preferences</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Info Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-center">
                  <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="h-10 w-10 text-primary-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{profileData?.fullName}</h3>
                  <p className="text-gray-600">@{profileData?.username}</p>
                  
                  <div className="mt-4 space-y-2">
                    {profileData?.roles?.map((role) => (
                      <span
                        key={role}
                        className="inline-block px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full"
                      >
                        {role}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      Joined {new Date(profileData?.createdAt || '').toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                      Edit
                    </button>
                  )}
                </div>
                
                <div className="p-6">
                  {isEditing ? (
                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={profileForm.fullName}
                          onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          value={profileForm.email}
                          onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone
                        </label>
                        <input
                          type="tel"
                          value={profileForm.phone}
                          onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>

                      <div className="flex space-x-3">
                        <button
                          type="submit"
                          disabled={loading}
                          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center"
                        >
                          {loading ? <LoadingSpinner size="sm" /> : <Save className="h-4 w-4" />}
                          <span className="ml-2">Save Changes</span>
                        </button>
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
                          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <User className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-600">Full Name</p>
                          <p className="font-medium">{profileData?.fullName}</p>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <Mail className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-600">Email</p>
                          <p className="font-medium">{profileData?.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <Phone className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-600">Phone</p>
                          <p className="font-medium">{profileData?.phone || 'Not provided'}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Security Settings */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">Security Settings</h2>
                  {!showPasswordForm && (
                    <button
                      onClick={() => setShowPasswordForm(true)}
                      className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                      Change Password
                    </button>
                  )}
                </div>
                
                <div className="p-6">
                  {showPasswordForm ? (
                    <form onSubmit={handleChangePassword} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Current Password
                        </label>
                        <input
                          type="password"
                          value={passwordForm.currentPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          New Password
                        </label>
                        <input
                          type="password"
                          value={passwordForm.newPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          value={passwordForm.confirmPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          required
                        />
                      </div>

                      <div className="flex space-x-3">
                        <button
                          type="submit"
                          disabled={loading}
                          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center"
                        >
                          {loading ? <LoadingSpinner size="sm" /> : <Shield className="h-4 w-4" />}
                          <span className="ml-2">Update Password</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowPasswordForm(false);
                            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                          }}
                          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex items-center">
                      <Shield className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-600">Password</p>
                        <p className="font-medium">••••••••</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;