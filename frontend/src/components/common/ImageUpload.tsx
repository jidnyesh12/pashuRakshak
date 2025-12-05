import React, { useState } from 'react';
import { Upload, X, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

interface ImageUploadProps {
  onUpload: (url: string) => void;
  onRemove: () => void;
  currentImage?: string;
  label?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  onUpload, 
  onRemove, 
  currentImage,
  label = "Upload Image"
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | undefined>(currentImage);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error('Image size should be less than 5MB');
      return;
    }

    // Preview
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setIsUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
      const response = await axios.post(
        `${API_BASE_URL}/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      const url = response.data.url;
      onUpload(url);
      toast.success('Image uploaded successfully');
    } catch (error: any) {
      console.error('Upload error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to upload image. Please try again.';
      toast.error(errorMessage);
      setPreview(undefined);
      onRemove();
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(undefined);
    onRemove();
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      {preview ? (
        <div className="relative rounded-lg overflow-hidden border border-gray-200 aspect-video bg-gray-50">
          <img 
            src={preview} 
            alt="Preview" 
            className="w-full h-full object-contain"
          />
          <button
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-sm"
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
          {isUploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <Loader className="h-8 w-8 text-white animate-spin" />
            </div>
          )}
        </div>
      ) : (
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-purple-500 transition-colors cursor-pointer relative bg-gray-50 hover:bg-purple-50">
          <div className="space-y-1 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="flex text-sm text-gray-600">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer rounded-md font-medium text-purple-600 hover:text-purple-500 focus-within:outline-none"
              >
                <span>Upload a file</span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
