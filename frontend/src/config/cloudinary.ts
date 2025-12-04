// Cloudinary Configuration
// These values will be loaded from environment variables or use defaults

export const CLOUDINARY_CONFIG = {
  // Cloud name from environment variable or placeholder
  CLOUD_NAME: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'your-cloud-name',
  
  // Upload preset from environment variable or placeholder
  UPLOAD_PRESET: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'your-upload-preset',
  
  // API URL (standard Cloudinary URL)
  API_URL: 'https://api.cloudinary.com/v1_1',
  
  // Maximum file size in bytes (5MB)
  MAX_FILE_SIZE: 5 * 1024 * 1024,
  
  // Maximum number of files
  MAX_FILES: 5,
  
  // Allowed file types
  ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
};

// To configure Cloudinary:
// 1. Create a .env file in the frontend root
// 2. Add these variables:
//    VITE_CLOUDINARY_CLOUD_NAME=your-actual-cloud-name
//    VITE_CLOUDINARY_UPLOAD_PRESET=your-actual-upload-preset
// 3. Or set them in your deployment environment