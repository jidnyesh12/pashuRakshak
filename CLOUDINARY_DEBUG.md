# Cloudinary Upload Error Fix & Debug Guide

## 🔧 **Issue Fixed**

The error `Invalid transformation parameter - {fetch` was caused by incorrect transformation parameters in the CloudinaryService. 

### **What was wrong:**
```java
// ❌ WRONG - These parameters don't exist
"transformation", ObjectUtils.asMap(
    "quality", "auto",
    "fetch_format", "auto"
)
```

### **What's fixed:**
```java
// ✅ CORRECT - Simple upload without invalid transformations
ObjectUtils.asMap(
    "folder", "pashu-rakshak/reports",
    "resource_type", "image"
)
```

## 🚀 **How to Test the Fix**

### **1. Restart Backend**
```bash
cd backend
mvn spring-boot:run
```

### **2. Check Configuration**
The backend will now log Cloudinary configuration on startup:
```
Initializing Cloudinary with cloud_name: your-cloud-name
API Key present: true
API Secret present: true
```

### **3. Test Upload Endpoint**
```bash
curl http://localhost:8080/api/upload/test
```
Should return:
```json
{
  "message": "Cloudinary service is available",
  "timestamp": 1234567890
}
```

### **4. Test Image Upload**
1. Go to `http://localhost:5173/report-animal`
2. Select images (max 5MB each)
3. Should upload successfully to Cloudinary

## 🔍 **Debug Steps if Still Failing**

### **Step 1: Check Cloudinary Credentials**

Edit `backend/src/main/resources/application.properties`:
```properties
# Make sure these are your ACTUAL Cloudinary values
cloudinary.cloud-name=YOUR_ACTUAL_CLOUD_NAME
cloudinary.api-key=YOUR_ACTUAL_API_KEY
cloudinary.api-secret=YOUR_ACTUAL_API_SECRET
```

### **Step 2: Verify Credentials**
1. Go to [Cloudinary Dashboard](https://cloudinary.com/console)
2. Copy the exact values:
   - **Cloud name** (not the account name)
   - **API Key** (numbers only)
   - **API Secret** (long string)

### **Step 3: Check Backend Logs**
Look for these messages in backend console:
```
✅ Initializing Cloudinary with cloud_name: demo-cloud
✅ API Key present: true
✅ API Secret present: true
✅ Uploading file: image.jpg (123456 bytes)
✅ Upload successful: https://res.cloudinary.com/...
```

### **Step 4: Check for Warnings**
If you see these warnings, fix your credentials:
```
❌ WARNING: Cloudinary cloud_name not configured properly!
❌ WARNING: Cloudinary api_key not configured properly!
❌ WARNING: Cloudinary api_secret not configured properly!
```

## 🔧 **Common Issues & Solutions**

### **Issue 1: "Invalid API credentials"**
**Solution:** Double-check your Cloudinary credentials
```properties
# Wrong format examples:
cloudinary.cloud-name=https://cloudinary.com/demo  # ❌ Don't include URL
cloudinary.api-key=demo-api-key                    # ❌ Use actual numbers
cloudinary.api-secret=YOUR_CLOUDINARY_API_SECRET   # ❌ Replace placeholder

# Correct format:
cloudinary.cloud-name=demo-cloud                   # ✅ Just the cloud name
cloudinary.api-key=123456789012345                 # ✅ Actual API key numbers
cloudinary.api-secret=abcdefghijklmnopqrstuvwxyz    # ✅ Actual API secret
```

### **Issue 2: "Transformation parameter error"**
**Solution:** Already fixed! The CloudinaryService now uses simple upload without invalid transformations.

### **Issue 3: "File upload fails silently"**
**Solution:** Check backend logs for detailed error messages. The controller now logs all upload attempts.

### **Issue 4: "CORS errors"**
**Solution:** Already configured in `application.properties`:
```properties
spring.web.cors.allowed-origins=http://localhost:5173,http://localhost:3000
```

## 📊 **Verification Checklist**

### **Backend Verification:**
- [ ] Backend starts without errors
- [ ] Cloudinary configuration logs show correct values
- [ ] No "WARNING" messages about credentials
- [ ] Test endpoint returns success: `GET /api/upload/test`

### **Frontend Verification:**
- [ ] Can select images in report form
- [ ] Images show preview thumbnails
- [ ] Upload progress indicator works
- [ ] Success message after upload
- [ ] Images appear in submitted report

### **Cloudinary Dashboard Verification:**
- [ ] Login to Cloudinary dashboard
- [ ] Check "Media Library"
- [ ] Should see uploaded images in `pashu-rakshak/reports` folder

## 🎯 **Expected Behavior**

### **Successful Upload Flow:**
1. **Select Images** → Preview thumbnails appear
2. **Submit Report** → "Uploading Images..." message
3. **Upload Complete** → "X image(s) uploaded successfully"
4. **Report Submitted** → Tracking ID provided
5. **Cloudinary Dashboard** → Images visible in Media Library

### **Error Handling:**
- **File too large** → "File size must be less than 5MB"
- **Invalid file type** → "File must be an image"
- **Upload fails** → Detailed error message with cause
- **No credentials** → Configuration warning in logs

## 📞 **Still Having Issues?**

### **Check These:**
1. **Restart backend** after changing `application.properties`
2. **Clear browser cache** and try again
3. **Check browser console** for frontend errors
4. **Check backend logs** for detailed error messages
5. **Verify Cloudinary account** is active and not suspended

### **Test with cURL:**
```bash
# Test single image upload
curl -X POST \
  -F "file=@/path/to/your/image.jpg" \
  http://localhost:8080/api/upload/image
```

---

**🎉 The transformation error is now fixed! Your Cloudinary integration should work perfectly.**