import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Search, MapPin, Clock, Heart } from 'lucide-react';
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
  const { register, handleSubmit, formState: { errors } } = useForm<TrackForm>();

  const onSubmit = async (data: TrackForm) => {
    setLoading(true);
    try {
      const reportData = await reportsAPI.trackReport(data.trackingId);
      setReport(reportData);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Report not found');
      setReport(null);
    } finally {
      setLoading(false);
    }
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
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Report Details</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(report.status)}`}>
                  {getStatusText(report.status)}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Report Information</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Tracking ID:</span> {report.trackingId}</p>
                    <p><span className="font-medium">Animal Type:</span> {report.animalType}</p>
                    <p><span className="font-medium">Condition:</span> {report.condition}</p>
                    <p><span className="font-medium">Urgency:</span> {report.urgencyLevel}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Location & Contact</h3>
                  <div className="space-y-2">
                    <p className="flex items-start">
                      <MapPin className="h-4 w-4 mt-1 mr-2 text-gray-500" />
                      {report.location}
                    </p>
                    <p><span className="font-medium">Reporter:</span> {report.reporterName}</p>
                    <p><span className="font-medium">Phone:</span> {report.reporterPhone}</p>
                  </div>
                </div>
              </div>

              {report.description && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-gray-700">{report.description}</p>
                </div>
              )}

              {report.assignedNgo && (
                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2 text-green-800">Assigned NGO</h3>
                  <p className="text-green-700">{report.assignedNgo}</p>
                </div>
              )}

              <div className="mt-6 flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-1" />
                Reported on {new Date(report.createdAt).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
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