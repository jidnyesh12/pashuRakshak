import React, { useState } from 'react';
import { X, MapPin, Save, Camera, Upload, Trash2, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { reportsAPI } from '../../utils/api';
import { getCurrentLocation } from '../../utils/location';
import { uploadMultipleToCloudinary } from '../../utils/cloudinary';
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
  const [uploadingImages, setUploadingImages] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [locationData, setLocationData] = useState<{ latitude: number; longitude: number; address?: string } | null>(null);
  
  const { register, handleSubmit, formState: { errors }, watch, reset, setValue } = useForm<ReportRequest>();

  const onSubmit = async (data: ReportRequest) => {
    if (!locationData) {
      toast.error('Please get your location first');
      return;
    }

    setLoading(true);
    try {
      // Upload images if any
      let uploadedImageUrls: string[] = [];
      if (selectedImages.length > 0) {
        setUploadingImages(true);
        try {
          uploadedImageUrls = await uploadMultipleToCloudinary(selectedImages);
          toast.success(`${uploadedImageUrls.length} image(s) uploaded successfully`);
        } catch (error: any) {
          toast.error(error.message || 'Failed to upload images');
          setUploadingImages(false);
          return;
        }
        setUploadingImages(false);
      }

      const reportData: ReportRequest = {
        ...data,
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        imageUrls: uploadedImageUrls
      };

      const report = await reportsAPI.createReport(reportData);
      toast.success(`Report submitted successfully! Tracking ID: ${report.trackingId}`);
      
      // Reset form and state
      reset();
      setSelectedImages([]);
      setImageUrls([]);
      setLocationData(null);
      
      onClose();
      if (onSuccess) {
        onSuccess(report.trackingId);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to submit report');
    } finally {
      setLoading(false);
      setUploadingImages(false);
    }
  };

  const handleGetLocation = async () => {
    setGettingLocation(true);
    try {
      const location = await getCurrentLocation();
      setLocationData(location);
      setValue('latitude', location.latitude);
      setValue('longitude', location.longitude);
      toast.success('Location detected successfully');
    } catch (error: any) {
      toast.error(error.message || 'Unable to get your location');
    } finally {
      setGettingLocation(false);
    }
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    // Validate file types and sizes
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error(`${file.name} is too large. Maximum size is 5MB`);
        return false;
      }
      return true;
    });

    if (selectedImages.length + validFiles.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    setSelectedImages(prev => [...prev, ...validFiles]);

    // Create preview URLs
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageUrls(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImageUrls(prev => prev.filter((_, i) => i !== index));
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

          {/* Injury Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Injury Description
            </label>
            <textarea
              rows={3}
              placeholder="Describe the animal's injuries..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              {...register('injuryDescription')}
            />
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Notes
            </label>
            <textarea
              rows={3}
              placeholder="Any additional details or observations..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              {...register('additionalNotes')}
            />
          </div>

          {/* Location Section */}
          <div>
            <h3 className="text-lg font-medium mb-4">Location Information</h3>
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={handleGetLocation}
                  disabled={gettingLocation}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center justify-center w-max disabled:opacity-50"
                >
                  {gettingLocation ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <MapPin className="h-5 w-5 mr-2" />
                  )}
                  {gettingLocation ? 'Getting Location...' : 'Get Current Location'}
                </button>
                
                {locationData && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center text-green-800">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span className="text-sm font-medium">Location detected</span>
                    </div>
                    {locationData.address && (
                      <p className="text-sm text-green-700 mt-1">{locationData.address}</p>
                    )}
                    <p className="text-xs text-green-600 mt-1">
                      Coordinates: {locationData.latitude.toFixed(6)}, {locationData.longitude.toFixed(6)}
                    </p>
                  </div>
                )}
                
                {!locationData && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div className="flex items-center text-yellow-800">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      <span className="text-sm">Location is required to submit the report</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Photo Upload Section */}
          <div>
            <h3 className="text-lg font-medium mb-4">Photos (Optional)</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload photos of the animal (Max 5 images, 5MB each)
                </label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Camera className="w-8 h-8 mb-4 text-gray-500" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG, JPEG (MAX. 5MB each)</p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      multiple
                      accept="image/*"
                      onChange={handleImageSelect}
                      disabled={selectedImages.length >= 5}
                    />
                  </label>
                </div>
              </div>

              {/* Image Previews */}
              {imageUrls.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {imageUrls.map((url, index) => (
                    <div key={index} className="relative">
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
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
              disabled={loading || uploadingImages || !locationData}
              className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center"
            >
              {loading || uploadingImages ? (
                <LoadingSpinner size="sm" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              <span className="ml-2">
                {uploadingImages ? 'Uploading Images...' : loading ? 'Submitting...' : 'Submit Report'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportModal;