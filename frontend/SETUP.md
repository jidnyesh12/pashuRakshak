# Pashu Rakshak Frontend Setup Guide

## Features Implemented

### ✅ Complete Reporting System
- **Location Services**: Automatic location detection using browser geolocation
- **Photo Upload**: Support for up to 5 images per report (5MB each)
- **Real-time Validation**: Form validation with error handling
- **Progress Tracking**: Visual feedback during image upload and form submission

### ✅ Report Tracking
- **Tracking by ID**: Search reports using tracking ID
- **Detailed View**: Complete report information with status updates
- **Image Gallery**: View uploaded photos in a responsive grid
- **Status Timeline**: Track report progress from submission to resolution

### ✅ User Management
- **Profile Management**: Update personal information and change passwords
- **Role-based Access**: Different dashboards for Users, NGOs, and Admins
- **Admin Controls**: User management with role assignment and status control

### ✅ NGO Management
- **NGO Registration**: Complete NGO onboarding with location data
- **Report Assignment**: NGOs can accept and manage reports
- **Status Updates**: Real-time status updates for assigned reports

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Cloudinary (Optional)
For real image upload functionality:

1. Create a free account at [Cloudinary](https://cloudinary.com)
2. Go to Settings > Upload presets
3. Create a new upload preset with mode "Unsigned"
4. Update `frontend/src/config/cloudinary.ts` with your credentials:
   ```typescript
   export const CLOUDINARY_CONFIG = {
     CLOUD_NAME: 'your-actual-cloud-name',
     UPLOAD_PRESET: 'your-actual-upload-preset',
     // ... rest of config
   };
   ```
5. In `frontend/src/utils/cloudinary.ts`, replace `mockUploadToCloudinary` with `uploadToCloudinary` in the import statements

### 3. Start Development Server
```bash
npm run dev
```

### 4. Backend Configuration
Ensure your backend is running on `http://localhost:8080` or update the API base URL in `frontend/src/utils/api.ts`

## Key Features

### 🚨 Emergency Reporting
- **Quick Access**: Direct links from homepage for emergency situations
- **Location Detection**: One-click location detection with address resolution
- **Photo Evidence**: Upload multiple photos with preview and removal options
- **Validation**: Real-time form validation with helpful error messages

### 📍 Location Services
- **Automatic Detection**: Browser-based geolocation with fallback
- **Address Resolution**: Reverse geocoding using OpenStreetMap
- **Coordinate Display**: Precise latitude/longitude coordinates
- **Privacy Friendly**: No third-party tracking, uses open-source services

### 📸 Photo Upload System
- **Multiple Files**: Support for up to 5 images per report
- **Size Validation**: 5MB limit per image with user feedback
- **Type Validation**: JPEG, PNG, WebP support
- **Preview System**: Thumbnail previews with remove functionality
- **Progress Feedback**: Upload progress indication

### 🔍 Report Tracking
- **Tracking ID Search**: Easy report lookup system
- **Status Updates**: Real-time status tracking
- **Detailed View**: Complete report information display
- **Image Gallery**: Responsive photo gallery
- **Contact Information**: Reporter and NGO contact details

### 👥 User Roles & Permissions
- **USER**: Can create reports, view public data, manage profile
- **NGO**: Can accept reports, update status, manage assigned cases
- **ADMIN**: Full system access, user management, NGO management

### 📱 Responsive Design
- **Mobile First**: Optimized for mobile devices
- **Touch Friendly**: Large touch targets and intuitive gestures
- **Progressive Enhancement**: Works on all devices and browsers

## API Integration

All backend endpoints are fully integrated:

### Authentication
- ✅ User registration and login
- ✅ JWT token management
- ✅ Token validation

### User Management
- ✅ Profile management
- ✅ Password changes
- ✅ Admin user controls
- ✅ Role management

### Report Management
- ✅ Report creation with images and location
- ✅ Report tracking by ID
- ✅ Status updates
- ✅ NGO assignment

### NGO Management
- ✅ NGO registration
- ✅ NGO profile management
- ✅ Report assignment system

## Testing the Application

### 1. Test Report Creation
1. Go to `/report-animal`
2. Fill out the form
3. Click "Get Current Location" (allow location access)
4. Upload 1-5 images
5. Submit the report
6. Note the tracking ID

### 2. Test Report Tracking
1. Go to `/track-report`
2. Enter the tracking ID from step 1
3. View the complete report details

### 3. Test User Roles
1. Login as different user types
2. Check dashboard access
3. Test role-specific features

### 4. Test Admin Features
1. Login as admin
2. Go to `/admin/users` for user management
3. Go to `/admin/ngos` for NGO management

## Production Deployment

### Environment Variables
Create a `.env` file with:
```
VITE_API_BASE_URL=https://your-backend-url.com/api
VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
VITE_CLOUDINARY_UPLOAD_PRESET=your-upload-preset
```

### Build for Production
```bash
npm run build
```

### Deploy
The `dist` folder contains the production build ready for deployment to any static hosting service.

## Troubleshooting

### Location Not Working
- Ensure HTTPS in production (geolocation requires secure context)
- Check browser permissions
- Test on different devices/browsers

### Images Not Uploading
- Check Cloudinary configuration
- Verify file size limits
- Check network connectivity
- Review browser console for errors

### API Errors
- Verify backend is running
- Check API base URL configuration
- Review network requests in browser dev tools
- Ensure CORS is properly configured on backend

## Browser Support
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Performance Optimizations
- Lazy loading for images
- Code splitting for routes
- Optimized bundle size
- Efficient re-renders with React hooks