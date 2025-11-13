import React, { useState } from 'react';
import { X, MapPin, AlertTriangle, Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { reportsAPI } from '../../utils/api';
import LoadingSpinner from './LoadingSpinner';
import toast from 'react-hot-toast';
import type { ReportRequest } from '../../types';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (trackingId: string) => void;
}

const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm<ReportRequest>();

  const urgencyLevel = watch('urgencyLevel');

  const onSubmit = async (data: ReportRequest) => {
    setLoading(true);
    try {
      const report = await reportsAPI.createReport(data);
      toast.success(`Report submitted successfully! Tracking ID: ${report.trackingId}`);
      reset();
      onClose();
      if (onSuccess) {
        onSuccess(report.trackingId);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to submit report');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          toast.success('Location detected successfully');
          // You could use reverse geocoding here to get address
        },
        (error) => {
          toast.error('Unable to get your location');
        }
      );
    } else {
      toast.error('Geolocation is not supported by this browser');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Report an Animal in Need</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Animal Information */}
          <div>
            <h3 className="text-lg font-medium mb-4">Animal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Animal Type *
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  {...register('animalType', { required: 'Animal type is required' })}
                >
                  <option value="">Select animal type</option>
                  <option value="DOG">Dog</option>
                  <option value="CAT">Cat</option>
                  <option value="COW">Cow</option>
                  <option value="BUFFALO">Buffalo</option>
                  <option value="HORSE">Horse</option>
                  <option value="BIRD">Bird</option>
                  <option value="OTHER">Other</option>
                </select>
                {errors.animalType && (
                  <p className="text-red-500 text-sm mt-1">{errors.animalType.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Condition *
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  {...register('condition', { required: 'Condition is required' })}
                >
                  <option value="">Select condition</option>
                  <option value="INJURED">Injured</option>
                  <option value="SICK">Sick</option>
                  <option value="TRAPPED">Trapped</option>
                  <option value="ABANDONED">Abandoned</option>
                  <option value="AGGRESSIVE">Aggressive/Dangerous</option>
                  <option value="OTHER">Other</option>
                </select>
                {errors.condition && (
                  <p className="text-red-500 text-sm mt-1">{errors.condition.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Urgency Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Urgency Level *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {['LOW', 'MEDIUM', 'HIGH'].map((level) => (
                <label key={level} className="relative">
                  <input
                    type="radio"
                    value={level}
                    className="sr-only"
                    {...register('urgencyLevel', { required: 'Urgency level is required' })}
                  />
                  <div className={`p-3 border-2 rounded-lg cursor-pointer text-center transition-colors ${
                    urgencyLevel === level
                      ? level === 'HIGH' 
                        ? 'border-red-500 bg-red-50 text-red-700'
                        : level === 'MEDIUM'
                        ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                        : 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}>
                    <div className="font-medium">{level}</div>
                    <div className="text-sm">
                      {level === 'HIGH' && 'Life threatening'}
                      {level === 'MEDIUM' && 'Needs attention'}
                      {level === 'LOW' && 'Stable condition'}
                    </div>
                  </div>
                </label>
              ))}
            </div>
            {errors.urgencyLevel && (
              <p className="text-red-500 text-sm mt-1">{errors.urgencyLevel.message}</p>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location Address *
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter detailed address or landmark"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                {...register('location', { required: 'Location is required' })}
              />
              <button
                type="button"
                onClick={getCurrentLocation}
                className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <MapPin className="h-5 w-5" />
              </button>
            </div>
            {errors.location && (
              <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Describe the animal's condition, behavior, and any other relevant details..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              {...register('description')}
            />
          </div>

          {/* Reporter Information */}
          <div>
            <h3 className="text-lg font-medium mb-4">Your Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  {...register('reporterName', { required: 'Name is required' })}
                />
                {errors.reporterName && (
                  <p className="text-red-500 text-sm mt-1">{errors.reporterName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  placeholder="Enter your phone number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  {...register('reporterPhone', { 
                    required: 'Phone number is required',
                    pattern: {
                      value: /^[6-9]\d{9}$/,
                      message: 'Enter a valid 10-digit phone number'
                    }
                  })}
                />
                {errors.reporterPhone && (
                  <p className="text-red-500 text-sm mt-1">{errors.reporterPhone.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center"
            >
              {loading ? <LoadingSpinner size="sm" /> : <Save className="h-4 w-4" />}
              <span className="ml-2">Submit Report</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportModal;