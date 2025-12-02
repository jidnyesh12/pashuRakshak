const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export interface UploadResponse {
  url: string;
  message: string;
}

export interface MultipleUploadResponse {
  urls: string[];
  uploaded: number;
  total: number;
  errors?: string[];
}

export const uploadToCloudinary = async (file: File): Promise<string> => {
  // Validate file size (5MB)
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('File size exceeds 5MB limit');
  }

  // Validate file type
  if (!file.type.startsWith('image/')) {
    throw new Error('Invalid file type. Only images are allowed');
  }

  const formData = new FormData();
  formData.append('file', file);

  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/upload/image`, {
      method: 'POST',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to upload image');
    }

    const data: UploadResponse = await response.json();
    return data.url;
  } catch (error: any) {
    console.error('Image upload error:', error);
    throw new Error(error.message || 'Failed to upload image');
  }
};

export const uploadMultipleToCloudinary = async (files: File[]): Promise<string[]> => {
  if (files.length === 0) {
    return [];
  }

  if (files.length > 5) {
    throw new Error('Maximum 5 files allowed');
  }

  // Validate all files first
  for (const file of files) {
    if (file.size > 5 * 1024 * 1024) {
      throw new Error(`File ${file.name} exceeds 5MB limit`);
    }
    if (!file.type.startsWith('image/')) {
      throw new Error(`File ${file.name} is not an image`);
    }
  }

  const formData = new FormData();
  files.forEach(file => {
    formData.append('files', file);
  });

  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/upload/images`, {
      method: 'POST',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to upload images');
    }

    const data: MultipleUploadResponse = await response.json();
    
    if (data.errors && data.errors.length > 0) {
      console.warn('Some files failed to upload:', data.errors);
    }
    
    return data.urls;
  } catch (error: any) {
    console.error('Multiple image upload error:', error);
    throw new Error(error.message || 'Failed to upload images');
  }
};

// Check if upload service is available
export const validateUploadService = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/upload/image`, {
      method: 'OPTIONS',
    });
    return response.ok;
  } catch (error) {
    return false;
  }
};

// Delete image from Cloudinary
export const deleteFromCloudinary = async (imageUrl: string): Promise<void> => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/upload/image?url=${encodeURIComponent(imageUrl)}`, {
      method: 'DELETE',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete image');
    }
  } catch (error: any) {
    console.error('Image delete error:', error);
    throw new Error(error.message || 'Failed to delete image');
  }
};