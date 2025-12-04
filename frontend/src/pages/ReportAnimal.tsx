import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowRight, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '../components/layout/DashboardLayout';
import ImageUpload from '../components/common/ImageUpload';
import LocationPicker from '../components/common/LocationPicker';
import { reportsAPI } from '../utils/api';
import type { ReportRequest } from '../types';

const ReportAnimal: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string>('');
  const [location, setLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<ReportRequest>();

  const onSubmit = async (data: ReportRequest) => {
    if (!location) {
      toast.error('Please select a location');
      return;
    }

    if (!uploadedImage) {
      toast.error('Please upload an image of the animal');
      return;
    }

    setIsSubmitting(true);
    try {
      // Prepare description with location
      let finalDescription = data.description || '';
      if (location.address) {
        finalDescription += `\n\nLocation: ${location.address}`;
      } else {
        finalDescription += `\n\nLocation: ${location.lat}, ${location.lng}`;
      }

      const reportData: ReportRequest = {
        ...data,
        latitude: location.lat,
        longitude: location.lng,
        address: location.address,
        imageUrls: [uploadedImage],
        reporterName: 'Anonymous',
        reporterPhone: '0000000000',
        description: finalDescription,
        injuryDescription: finalDescription, // Required by backend
      };

      await reportsAPI.createReport(reportData);
      toast.success('Report submitted successfully!');
      navigate('/track-report');
    } catch (error) {
      console.error('Report submission failed:', error);
      toast.error('Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Report an Injured Animal</h1>
          <p className="text-gray-600 mt-1">
            Please provide accurate details to help our rescue team reach quickly.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
          
          {/* Section 1: Basic Info */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
              1. Animal Details
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Animal Type
                </label>
                <select
                  {...register('animalType', { required: 'Animal type is required' })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none"
                >
                  <option value="">Select Type</option>
                  <option value="DOG">Dog</option>
                  <option value="CAT">Cat</option>
                  <option value="COW">Cow</option>
                  <option value="BIRD">Bird</option>
                  <option value="OTHER">Other</option>
                </select>
                {errors.animalType && (
                  <p className="text-red-500 text-sm mt-1">{errors.animalType.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Condition
                </label>
                <select
                  {...register('condition', { required: 'Condition is required' })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none"
                >
                  <option value="">Select Condition</option>
                  <option value="INJURED">Injured</option>
                  <option value="BLEEDING">Bleeding</option>
                  <option value="UNCONSCIOUS">Unconscious</option>
                  <option value="SICK">Sick</option>
                  <option value="ABANDONED">Abandoned</option>
                </select>
                {errors.condition && (
                  <p className="text-red-500 text-sm mt-1">{errors.condition.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                {...register('description', { required: 'Description is required' })}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none resize-none"
                placeholder="Describe the situation, visible injuries, or specific landmarks..."
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
              )}
            </div>
          </div>

          {/* Section 2: Media */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
              2. Photo Evidence
            </h2>
            <ImageUpload
              onUpload={setUploadedImage}
              onRemove={() => setUploadedImage('')}
              currentImage={uploadedImage}
              label="Upload Photo (Required)"
            />
          </div>

          {/* Section 3: Location */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
              3. Location
            </h2>
            <div className="bg-blue-50 p-4 rounded-lg flex items-start mb-4">
              <AlertTriangle className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-700">
                Please ensure the pin is exactly where the animal is located. You can drag the marker to adjust.
              </p>
            </div>
            <LocationPicker
              onLocationSelect={(lat, lng, address) => setLocation({ lat, lng, address })}
            />
          </div>

          {/* Submit */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
            >
              {isSubmitting ? (
                'Submitting Report...'
              ) : (
                <>
                  Submit Report
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </DashboardLayout>
  );
};

export default ReportAnimal;