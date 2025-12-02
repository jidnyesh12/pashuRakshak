import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { MapPin, Camera, AlertTriangle, Heart, X, Upload, AlertCircle } from 'lucide-react';
import Layout from '../components/common/Layout';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { reportsAPI } from '../utils/api';
import { getCurrentLocation } from '../utils/location';
import { uploadMultipleToCloudinary } from '../utils/cloudinary';
import toast from 'react-hot-toast';
import type { ReportRequest } from '../types';

const ReportAnimal: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [locationData, setLocationData] = useState<{ latitude: number; longitude: number; address?: string } | null>(null);
  
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<ReportRequest>();

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
      navigate('/track-report', { state: { trackingId: report.trackingId } });
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
      toast.success('Location detected successfully!');
    } catch (error: any) {
      console.error('Location error:', error);
      
      // Show detailed error message
      const errorMessage = error.message || 'Unable to get your location';
      
      // Use a more user-friendly toast for location errors
      toast.error(
        <div className="text-sm">
          <div className="font-medium mb-1">Location Detection Failed</div>
          <div className="text-xs opacity-90">
            {errorMessage.includes('\n') ? 
              errorMessage.split('\n')[0] : 
              errorMessage
            }
          </div>
          <div className="text-xs opacity-75 mt-1">
            Please use "Enter Location Manually" below
          </div>
        </div>,
        { duration: 6000 }
      );
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

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Report an Animal in Need</h1>
            <p className="text-lg text-gray-600">
              Help us save lives by reporting injured or distressed animals
            </p>
          </div>

          {/* Emergency Alert */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
              <p className="text-red-800">
                <strong>Emergency?</strong> For life-threatening situations, call our 24/7 helpline: 
                <a href="tel:+919876543210" className="font-bold ml-1 underline">+91-9876543210</a>
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-md p-6 space-y-6">
            {/* Animal Information */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Animal Information</h2>
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
                Injury Description *
              </label>
              <textarea
                rows={3}
                placeholder="Describe the animal's injuries in detail..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                {...register('injuryDescription', { required: 'Injury description is required' })}
              />
              {errors.injuryDescription && (
                <p className="text-red-500 text-sm mt-1">{errors.injuryDescription.message}</p>
              )}
            </div>

            {/* Additional Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional Notes
              </label>
              <textarea
                rows={3}
                placeholder="Any additional observations or details..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                {...register('additionalNotes')}
              />
            </div>

            {/* Location */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Location Details</h2>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    type="button"
                    onClick={handleGetLocation}
                    disabled={gettingLocation}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center disabled:opacity-50"
                  >
                    {gettingLocation ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <MapPin className="h-5 w-5 mr-2" />
                    )}
                    {gettingLocation ? 'Getting Location...' : 'Get Current Location'}
                  </button>
                  
                  {!locationData && (
                    <button
                      type="button"
                      onClick={() => {
                        const address = prompt(
                          'Please enter your current address or location:\n\n' +
                          'Examples:\n' +
                          '• Street address: "123 Main St, City Name"\n' +
                          '• Landmark: "Near City Hospital"\n' +
                          '• Area: "Downtown area, City Name"\n' +
                          '• Coordinates: "28.6139, 77.2090"'
                        );
                        
                        if (address && address.trim()) {
                          const trimmedAddress = address.trim();
                          
                          // Check if user entered coordinates
                          const coordMatch = trimmedAddress.match(/^(-?\d+\.?\d*),\s*(-?\d+\.?\d*)$/);
                          
                          if (coordMatch) {
                            // User entered coordinates
                            const lat = parseFloat(coordMatch[1]);
                            const lng = parseFloat(coordMatch[2]);
                            
                            if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
                              setLocationData({
                                latitude: lat,
                                longitude: lng,
                                address: `Coordinates: ${lat.toFixed(6)}, ${lng.toFixed(6)}`
                              });
                              setValue('latitude', lat);
                              setValue('longitude', lng);
                              toast.success('Location set from coordinates');
                            } else {
                              toast.error('Invalid coordinates. Please check and try again.');
                            }
                          } else {
                            // User entered address - use default coordinates for India
                            // You can enhance this by integrating with a geocoding service
                            setLocationData({
                              latitude: 28.6139, // Default to Delhi coordinates
                              longitude: 77.2090,
                              address: trimmedAddress
                            });
                            setValue('latitude', 28.6139);
                            setValue('longitude', 77.2090);
                            toast.success('Location set manually');
                          }
                        }
                      }}
                      className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors inline-flex items-center"
                    >
                      <MapPin className="h-5 w-5 mr-2" />
                      Enter Location Manually
                    </button>
                  )}
                </div>
                
                {locationData && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center text-green-800 mb-2">
                      <MapPin className="h-5 w-5 mr-2" />
                      <span className="font-medium">Location set successfully</span>
                    </div>
                    {locationData.address && (
                      <p className="text-sm text-green-700 mb-2">{locationData.address}</p>
                    )}
                    <p className="text-xs text-green-600">
                      Coordinates: {locationData.latitude.toFixed(6)}, {locationData.longitude.toFixed(6)}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setLocationData(null);
                        setValue('latitude', 0);
                        setValue('longitude', 0);
                      }}
                      className="text-xs text-green-600 underline mt-2"
                    >
                      Change location
                    </button>
                  </div>
                )}
                
                {!locationData && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center text-yellow-800">
                      <AlertCircle className="h-5 w-5 mr-2" />
                      <span className="text-sm font-medium">Location is required to submit the report</span>
                    </div>
                    <p className="text-sm text-yellow-700 mt-1">
                      Use "Get Current Location" for automatic detection, or "Enter Location Manually" if automatic detection fails.
                    </p>
                    <div className="mt-3 text-xs text-yellow-600">
                      <p><strong>If location detection fails:</strong></p>
                      <ul className="list-disc list-inside mt-1 space-y-1">
                        <li><strong>Browser:</strong> Allow location access when prompted</li>
                        <li><strong>Device:</strong> Enable GPS/location services</li>
                        <li><strong>Network:</strong> Check internet connection</li>
                        <li><strong>Alternative:</strong> Use "Enter Location Manually" button</li>
                      </ul>
                      <div className="mt-2 p-2 bg-yellow-100 rounded text-yellow-800">
                        <p className="font-medium">Common solutions:</p>
                        <p>• Refresh the page and try again</p>
                        <p>• Check browser location permissions</p>
                        <p>• Try a different browser</p>
                        <p>• Use manual entry with your address</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Photo Upload */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Photos (Optional)</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload photos of the animal (Max 5 images, 5MB each)
                  </label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Camera className="w-10 h-10 mb-4 text-gray-500" />
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
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
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
                rows={4}
                placeholder="Describe the animal's condition, behavior, and any other relevant details..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                {...register('description')}
              />
            </div>

            {/* Reporter Information */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Your Information</h2>
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
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading || uploadingImages || !locationData}
                className="bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center"
              >
                {loading || uploadingImages ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <Heart className="h-5 w-5" />
                )}
                <span className="ml-2">
                  {uploadingImages ? 'Uploading Images...' : loading ? 'Submitting...' : 'Submit Report'}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default ReportAnimal;