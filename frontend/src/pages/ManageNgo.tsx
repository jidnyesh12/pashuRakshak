import React, { useState, useEffect } from 'react';
import { Building2, ArrowLeft, Users, Mail, Phone, Calendar, User, ToggleLeft, ToggleRight } from 'lucide-react';
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
    if (user?.ngoId) {
      loadWorkers();
    }
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
      console.log(user);
      toast.error('NGO ID not found');
      return;
    }

    setSubmitting(true);

    try {
      await ngoAPI.addWorker(user.ngoId, {
        ...workerForm,
        age: parseInt(workerForm.age) || 0
      });
      toast.success('Worker added successfully! Login details sent to email.');
      setWorkerForm({ username: '', name: '', email: '', phone: '', age: '', gender: '' });
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
      toast.success('Worker status updated');
      loadWorkers();
    } catch (error: any) {
      toast.error(error.response?.data || 'Failed to update worker status');
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-purple-100 rounded-xl text-purple-600">
            <Building2 className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manage NGO</h1>
            <p className="text-gray-500">Update settings and manage your team</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">

            {/* Add Worker Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Add New Worker</h2>
                  <p className="text-sm text-gray-500">Create account for your staff member</p>
                </div>
                <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                  <Users className="w-5 h-5" />
                </div>
              </div>

              <div className="p-6">
                <form onSubmit={handleAddWorker} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Username</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          required
                          value={workerForm.username}
                          onChange={(e) => setWorkerForm({ ...workerForm, username: e.target.value })}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                          placeholder="johndoe"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          required
                          value={workerForm.name}
                          onChange={(e) => setWorkerForm({ ...workerForm, name: e.target.value })}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                          placeholder="John Doe"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          required
                          value={workerForm.email}
                          onChange={(e) => setWorkerForm({ ...workerForm, email: e.target.value })}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="tel"
                          required
                          value={workerForm.phone}
                          onChange={(e) => setWorkerForm({ ...workerForm, phone: e.target.value })}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                          placeholder="+91 98765 43210"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Age</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Calendar className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="number"
                            required
                            min="18"
                            max="100"
                            value={workerForm.age}
                            onChange={(e) => setWorkerForm({ ...workerForm, age: e.target.value })}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                            placeholder="25"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Gender</label>
                        <select
                          required
                          value={workerForm.gender}
                          onChange={(e) => setWorkerForm({ ...workerForm, gender: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all appearance-none bg-white"
                        >
                          <option value="">Select</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-6 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-medium disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-purple-200"
                    >
                      {submitting ? <LoadingSpinner size="sm" variant="white" /> : (
                        <>
                          <Users className="w-5 h-5" />
                          <span>Add Worker to Team</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Workers List Section */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Team Members</h2>
                    <p className="text-sm text-gray-500">Manage your existing staff</p>
                  </div>
                  <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                    <Users className="w-5 h-5" />
                  </div>
                </div>

                <div className="divide-y divide-gray-100">
                  {workers.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      No workers added yet. Add your first team member above!
                    </div>
                  ) : (
                    workers.map((worker) => (
                      <div key={worker.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">
                            {worker.fullName.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{worker.fullName}</h3>
                            <div className="flex items-center gap-3 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                {worker.email}
                              </span>
                              {worker.phone && (
                                <span className="flex items-center gap-1">
                                  <Phone className="w-3 h-3" />
                                  {worker.phone}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleWorkerStatus(worker.id)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              worker.enabled
                                ? 'bg-green-100 text-green-600 hover:bg-green-200'
                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                            }`}
                            title={worker.enabled ? 'Deactivate Worker' : 'Activate Worker'}
                          >
                            {worker.enabled ? (
                              <ToggleRight className="w-5 h-5" />
                            ) : (
                              <ToggleLeft className="w-5 h-5" />
                            )}
                          </button>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              worker.enabled
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }`}>
                            {worker.enabled ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Other Settings (Placeholder) */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center opacity-60">
              <h3 className="font-bold text-gray-900 mb-2">More Features Coming Soon</h3>
              <p className="text-gray-500 text-sm">
                Document management and advanced analytics are under development.
              </p>
            </div>

          </div>

          {/* Sidebar Area */}
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
              <h3 className="font-bold text-blue-900 mb-3">Tips for Admins</h3>
              <ul className="space-y-3 text-sm text-blue-800">
                <li className="flex items-start gap-2">
                  <span className="mt-1">•</span>
                  <span>Workers will receive their login credentials via email immediately after creation.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1">•</span>
                  <span>Ensure phone numbers are valid for future SMS notifications.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1">•</span>
                  <span>You can deactivate worker accounts from the team list (coming soon).</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManageNgo;
