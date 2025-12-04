# 🐾 Pashu Rakshak - Animal Rescue Platform

A comprehensive platform for reporting and managing animal rescue cases with **real-time location detection**, **professional Cloudinary image upload**, and **complete NGO coordination**.

## 🚀 **FULLY IMPLEMENTED FEATURES**

### ✅ **Real Location Detection**
- Browser geolocation API with address resolution
- Manual location entry fallback
- Reverse geocoding (coordinates to address)
- HTTPS/localhost compatibility

### ✅ **Professional Image Upload**
- **Real Cloudinary integration** (no mocks)
- Multiple image support (max 5 images, 5MB each)
- Server-side processing and optimization
- Image preview and management

### ✅ **Complete Backend**
- Spring Boot 3.5.7 with Java 17
- JWT authentication and security
- PostgreSQL database integration
- Cloudinary SDK integration
- File upload validation

### ✅ **Full Frontend**
- React 18 with TypeScript
- Responsive design with Tailwind CSS
- Real-time form validation
- Progress indicators and error handling

## 🛠️ **Tech Stack**

### **Backend**
- **Java 17** with **Spring Boot 3.5.7**
- **Spring Security** with JWT authentication
- **Spring Data JPA** with PostgreSQL
- **Cloudinary SDK** for image storage
- **Maven** for dependency management

### **Frontend**
- **React 18** with **TypeScript**
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **React Router** for navigation
- **React Hook Form** for form management

## 🚀 **Quick Start**

### **1. Prerequisites**
- Java 17 or higher
- Node.js 16 or higher
- Maven 3.6 or higher
- **Cloudinary Account** (free at [cloudinary.com](https://cloudinary.com))

### **2. Cloudinary Setup**
1. Sign up at [https://cloudinary.com/users/register/free](https://cloudinary.com/users/register/free)
2. Go to Dashboard and copy:
   - Cloud Name
   - API Key
   - API Secret

### **3. Configure Backend**

Edit `backend/src/main/resources/application.properties`:

```properties
# Replace with your actual Cloudinary credentials
cloudinary.cloud-name=YOUR_CLOUDINARY_CLOUD_NAME
cloudinary.api-key=YOUR_CLOUDINARY_API_KEY
cloudinary.api-secret=YOUR_CLOUDINARY_API_SECRET
```

### **4. Start Backend**

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Backend available at: `http://localhost:8080`

### **5. Start Frontend**

```bash
cd frontend
npm install
npm run dev
```

Frontend available at: `http://localhost:5173`

## 🧪 **Test the Application**

### **Test Location Detection:**
1. Go to `http://localhost:5173/report-animal`
2. Click "Get Current Location"
3. Allow location access when prompted
4. Should display your address

### **Test Image Upload:**
1. Select 1-5 images (max 5MB each)
2. Images upload to Cloudinary
3. See preview thumbnails
4. Submit complete report

### **Test Report Tracking:**
1. Note the tracking ID after submission
2. Go to `/track-report`
3. Enter tracking ID to view full report

## 🔧 **Troubleshooting**

### **Location Issues:**
- **"Location information is unavailable"**:
  - Allow location access in browser
  - Use HTTPS in production (localhost works for development)
  - Enable device location services
  - Use manual location entry as fallback

### **Image Upload Issues:**
- **Upload fails**: Check Cloudinary credentials in `application.properties`
- **File too large**: Max 5MB per image
- **Invalid file**: Only image files allowed

## 🔐 **Default Test Accounts**

```
Admin Account:
Username: admin
Password: admin123

NGO Account:
Username: ngouser  
Password: ngo123

Regular User:
Username: testuser
Password: user123
```

## 📊 **API Endpoints**

### **Authentication**
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login

### **Reports**
- `POST /api/reports` - Create report
- `GET /api/reports/track/{trackingId}` - Track report

### **File Upload (Cloudinary)**
- `POST /api/upload/image` - Upload single image
- `POST /api/upload/images` - Upload multiple images
- `DELETE /api/upload/image` - Delete image

### **Users & NGOs**
- `GET /api/users/profile` - Get user profile
- `GET /api/ngos` - Get all NGOs
- `GET /api/ngos/nearby` - Find nearby NGOs

## 🌐 **Production Deployment**

### **Backend:**
1. Update `application.properties` with production database
2. Set production Cloudinary credentials
3. Build: `mvn clean package`
4. Deploy JAR file

### **Frontend:**
1. Update `.env` with production API URL
2. Build: `npm run build`
3. Deploy `dist` folder to static hosting

**Important**: Use HTTPS in production for location services to work.

## 📚 **Documentation**

- [**Cloudinary Setup Guide**](CLOUDINARY_SETUP.md) - Complete Cloudinary configuration
- [**Complete Setup Guide**](SETUP_COMPLETE.md) - Comprehensive setup instructions

## 🎯 **Core Workflow**

1. **Citizen** finds injured animal
2. Opens **Pashu Rakshak** web app
3. **Reports** with location detection and image upload
4. **Backend** stores in PostgreSQL and uploads images to Cloudinary
5. **NGOs** receive notifications and can accept cases
6. **Real-time tracking** with unique tracking ID
7. **Status updates** until case resolution

## 👨‍💻 **Contributors**
- **Jidnyesh Suryawanshi** – Developer & Project Lead

## 🐕 **License**
This project is licensed under the **MIT License** – feel free to use and modify with attribution.

---

**🎉 Ready for production use with real Cloudinary integration and location services!**