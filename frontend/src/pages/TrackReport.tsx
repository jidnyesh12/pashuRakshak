import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom';
import { Search, MapPin, Clock, Heart, Phone, User, Calendar, Camera } from 'lucide-react';
import Layout from '../components/common/Layout';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { reportsAPI } from '../utils/api';
import { getStatusColor, getStatusText } from '../utils/auth';
import toast from 'react-hot-toast';
import type { AnimalReport } from '../types';

interface TrackForm {
  trackingId: string;
}

const TrackReport: React.FC = () => {
  const [report, setReport] = useState<AnimalReport | null>(null);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<TrackForm>();

  useEffect(() => {
    // Check if tracking ID was passed from navigation state
    const state = location.state as { trackingId?: string };
    if (state?.trackingId) {
      setValue('trackingId', state.trackingId);
      handleTrackReport(state.trackingId);
    }
  }, [location.state, setValue]);

  const handleTrackReport = async (trackingId: string) => {
    setLoading(true);
    try {
      const reportData = await reportsAPI.trackReport(trackingId);
      setReport(reportData);
      toast.success('Report found successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Report not found');
      setReport(null);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: TrackForm) => {
    await handleTrackReport(data.trackingId);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Track Your Report</h1>
            <p className="text-lg text-gray-600">
              Enter your tracking ID to check the status of your animal report
            </p>
          </div>

          {/* Search Form */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <form onSubmit={handleSubmit(onSubmit)} className="flex gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Enter tracking ID (e.g., AR-2024-001)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  {...register('trackingId', { 
                    required: 'Tracking ID is required',
                    pattern: {
                      value: /^AR-\d{4}-\d{3}$/,
                      message: 'Invalid tracking ID format'
                    }
                  })}
                />
                {errors.trackingId && (
                  <p className="text-red-500 text-sm mt-1">{errors.trackingId.message}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center"
              >
                {loading ? <LoadingSpinner size="sm" /> : <Search className="h-5 w-5" />}
                <span className="ml-2">Track</span>
              </button>
            </form>
          </div>

          {/* Report Details */}
          {report && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white">Report Details</h2>
                    <p className="text-primary-100">Tracking ID: {report.trackingId}</p>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-medium bg-white ${getStatusColor(report.status)}`}>
                    {getStatusText(report.status)}
                  </span>
                </div>
              </div>

              <div className="p-6">
                {/* Animal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-3 text-gray-900">Animal Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Heart className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="text-sm text-gray-600">Type:</span>
                        <span className="ml-2 font-medium">{report.animalType}</span>
                      </div>
                      <div className="flex items-center">
                        <Heart className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="text-sm text-gray-600">Condition:</span>
                        <span className="ml-2 font-medium">{report.condition}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-3 text-gray-900">Reporter Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="text-sm text-gray-600">Name:</span>
                        <span className="ml-2 font-medium">{report.reporterName}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="text-sm text-gray-600">Phone:</span>
                        <span className="ml-2 font-medium">{report.reporterPhone}</span>
                      </div>
                      {report.reporterEmail && (
                        <div className="flex items-center">
                          <span className="text-sm text-gray-600">Email:</span>
                          <span className="ml-2 font-medium">{report.reporterEmail}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 text-gray-900">Location</h3>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 mt-0.5 mr-3 text-blue-600" />
                      <div>
                        <p className="font-medium text-blue-900">{report.address || 'Location coordinates provided'}</p>
                        <p className="text-sm text-blue-700 mt-1">
                          Coordinates: {report.latitude?.toFixed(6)}, {report.longitude?.toFixed(6)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Descriptions */}
                {(report.injuryDescription || report.additionalNotes) && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3 text-gray-900">Details</h3>
                    <div className="space-y-4">
                      {report.injuryDescription && (
                        <div>
                          <h4 className="font-medium text-gray-700 mb-1">Injury Description</h4>
                          <p className="text-gray-600 bg-gray-50 rounded-lg p-3">{report.injuryDescription}</p>
                        </div>
                      )}
                      {report.additionalNotes && (
                        <div>
                          <h4 className="font-medium text-gray-700 mb-1">Additional Notes</h4>
                          <p className="text-gray-600 bg-gray-50 rounded-lg p-3">{report.additionalNotes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Images */}
                {report.imageUrls && report.imageUrls.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3 text-gray-900 flex items-center">
                      <Camera className="h-5 w-5 mr-2" />
                      Photos ({report.imageUrls.length})
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {report.imageUrls.map((url, index) => (
                        <div key={index} className="relative">
                          <img
                            src={url}
                            alt={`Report image ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-75 transition-opacity"
                            onClick={() => window.open(url, '_blank')}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Assigned NGO */}
                {report.assignedNgoName && (
                  <div className="mb-6">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h3 className="text-lg font-semibold mb-2 text-green-800 flex items-center">
                        <Heart className="h-5 w-5 mr-2" />
                        Assigned NGO
                      </h3>
                      <p className="text-green-700 font-medium">{report.assignedNgoName}</p>
                      <p className="text-sm text-green-600 mt-1">
                        This report has been assigned to a rescue organization and is being handled.
                      </p>
                    </div>
                  </div>
                )}

                {/* Timeline */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Reported: {new Date(report.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</span>
                    </div>
                    {report.updatedAt !== report.createdAt && (
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>Last updated: {new Date(report.updatedAt).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Help Section */}
          <div className="mt-8 bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2 text-blue-800">Need Help?</h3>
            <p className="text-blue-700 mb-4">
              If you can't find your report or need immediate assistance, contact our emergency helpline.
            </p>
            <a
              href="tel:+919876543210"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
            >
              <Heart className="h-4 w-4 mr-2" />
              Call Emergency: +91-9876543210
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TrackReport;