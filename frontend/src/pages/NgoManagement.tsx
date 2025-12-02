import React, { useState, useEffect } from 'react';
import { Building2, Plus, Edit, Trash2, MapPin, Mail, Phone, Eye } from 'lucide-react';
import Layout from '../components/common/Layout';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { ngoAPI } from '../utils/api';
import toast from 'react-hot-toast';
import type { NGO, NgoRequest } from '../types';

const NgoManagement: React.FC = () => {
  const [ngos, setNgos] = useState<NGO[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingNgo, setEditingNgo] = useState<NGO | null>(null);
  const [formData, setFormData] = useState<NgoRequest>({
    name: '',
    email: '',
    phone: '',
    address: '',
    latitude: 0,
    longitude: 0,
    description: ''
  });

  useEffect(() => {
    loadNgos();
  }, []);

  const loadNgos = async () => {
    try {
      const data = await ngoAPI.getAllNgos();
      setNgos(data);
    } catch (error) {
      toast.error('Failed to load NGOs');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editingNgo) {
        await ngoAPI.updateNgo(editingNgo.id, formData);
        toast.success('NGO updated successfully');
      } else {
        await ngoAPI.createNgo(formData);
        toast.success('NGO created successfully');
      }
      setShowModal(false);
      setEditingNgo(null);
      resetForm();
      loadNgos();
    } catch (error) {
      toast.error(editingNgo ? 'Failed to update NGO' : 'Failed to create NGO');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (ngo: NGO) => {
    setEditingNgo(ngo);
    setFormData({
      name: ngo.name,
      email: ngo.email,
      phone: ngo.phone,
      address: ngo.address,
      latitude: ngo.latitude,
      longitude: ngo.longitude,
      description: ngo.description
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to deactivate this NGO?')) {
      try {
        await ngoAPI.deactivateNgo(id);
        toast.success('NGO deactivated successfully');
        loadNgos();
      } catch (error) {
        toast.error('Failed to deactivate NGO');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      latitude: 0,
      longitude: 0,
      description: ''
    });
  };

  const openCreateModal = () => {
    setEditingNgo(null);
    resetForm();
    setShowModal(true);
  };

  if (loading && ngos.length === 0) {
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
              <h1 className="text-3xl font-bold text-gray-900">NGO Management</h1>
              <p className="text-gray-600">Manage partner NGOs and their information</p>
            </div>
            <button
              onClick={openCreateModal}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add NGO
            </button>
          </div>

          {/* NGO Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ngos.map((ngo) => (
              <div key={ngo.id} className="bg-white rounded-lg shadow-md border border-gray-200">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                      <Building2 className="h-8 w-8 text-primary-600 mr-3" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{ngo.name}</h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          ngo.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {ngo.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(ngo)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(ngo.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      {ngo.email}
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2" />
                      {ngo.phone}
                    </div>
                    <div className="flex items-start">
                      <MapPin className="h-4 w-4 mr-2 mt-0.5" />
                      <span className="line-clamp-2">{ngo.address}</span>
                    </div>
                  </div>

                  {ngo.description && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-600 line-clamp-3">{ngo.description}</p>
                    </div>
                  )}

                  <div className="mt-4 text-xs text-gray-500">
                    Created: {new Date(ngo.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {ngos.length === 0 && (
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No NGOs found</p>
              <p className="text-gray-400 text-sm mt-2">Add your first NGO partner to get started</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {editingNgo ? 'Edit NGO' : 'Add New NGO'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="form-label">NGO Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>

                <div>
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>

                <div>
                  <label className="form-label">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>

                <div>
                  <label className="form-label">Address</label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="form-input"
                    rows={3}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      value={formData.latitude}
                      onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) || 0 })}
                      className="form-input"
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      value={formData.longitude}
                      onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) || 0 })}
                      className="form-input"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="form-input"
                    rows={3}
                    placeholder="Brief description of the NGO's mission and services"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? <LoadingSpinner size="sm" /> : (editingNgo ? 'Update NGO' : 'Create NGO')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default NgoManagement;