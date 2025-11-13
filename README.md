# 🐾 Pashu Rakshak

## 🎯 Aim
To create a streamlined web application that connects citizens with government agencies and NGOs to provide rapid assistance to injured or distressed animals.

---

## 🚀 Overview
**Pashu Rakshak** is a web-based platform that bridges the gap between citizens and animal rescue organizations.  
It allows users to report injured or distressed animals, automatically notifies nearby NGOs or government agencies, and tracks rescue progress in real time.  
The system ensures **faster response**, **better coordination**, and **efficient animal rescue operations**.

---

## 🛠️ Technology Stack

### **Frontend**
- **Framework:** React.js  
- **Key Libraries:**
  - `React Router` – Navigation between pages (Home, Report, Status)
  - `Axios` – API communication with the backend
  - `Leaflet` / `Mapbox` – Map display and geolocation handling
  - `Tailwind CSS` – Modern and responsive UI design

### **Backend**
- **Framework:** Spring Boot (Java)
- **Key Dependencies:**
  - `Spring Web` – For building RESTful APIs
  - `Spring Data JPA` – For database operations
  - `Spring Security` – For authentication and authorization (future integration)

### **Database**
- **PostgreSQL** with **PostGIS Extension**  
  Used to efficiently store and query geographic data (e.g., animal and NGO locations).

### **Deployment**
- **Containerization:** Docker  
- **Hosting:** Render / Railway (for CI/CD and scalability)

---

## 🌟 Core Features

### **For Citizens**
#### 🐶 Report an Injured Animal
- Form with fields: Animal type, injury description, and additional notes  
- Upload multiple images of the animal and surroundings  
- Auto-capture or manually select geolocation on a map  

#### 🔍 Track Report Status
- Unique tracking ID for each report  
- Real-time status updates:
  - `Report Submitted`
  - `Searching for Help`
  - `Help is on the Way (NGO Name)`
  - `Case Resolved`

---

### **For NGOs & Government Agencies**
#### 🗺️ Dashboard
- View all reports on a list or interactive map  
- Access details like location, photos, and descriptions  

#### 🔔 Notifications
- Receive real-time alerts (email, SMS, or push) for nearby cases  

#### ✅ Accept & Manage Cases
- First NGO to accept a case gets it assigned (prevents duplication)  
- Update rescue status:
  - `Team Dispatched`
  - `Animal Rescued`
  - `Case Closed`

---

## 🔄 Application Workflow

1. A citizen finds an injured animal.  
2. They open the **Pashu Rakshak** web app.  
3. They fill the **Report Form**, upload photos, and confirm the location.  
4. Data is sent to the **Spring Boot backend**, which stores it in **PostgreSQL + PostGIS**.  
5. The backend identifies NGOs and government agencies within a specific radius (e.g., 10–15 km).  
6. Notifications are sent to those nearby organizations.  
7. An NGO logs in and **accepts the case**, which locks it for others.  
8. The citizen tracks the status in real time using their **tracking ID**.  
9. The NGO updates the case progress until **resolved**.  
10. The citizen is notified once the case is **closed**.

---

## 🧱 Future Enhancements
- Role-based authentication for NGOs and government users  
- AI-based animal injury classification from uploaded images  
- Mobile app integration  
- Multilingual support for broader accessibility  

---

## 📦 Deployment Instructions (Planned)
1. **Containerize the app** using Docker  
2. **Push the code to GitHub**  
3. **Deploy on Render/Railway** with automatic build and deployment  
4. **Connect PostgreSQL** database instance  
5. **Monitor logs** and performance using the platform dashboard  

---

## 👨‍💻 Contributors
- **Jidnyesh Suryawanshi** – Developer & Project Lead

---

## 🐕 License
This project is licensed under the **MIT License** – feel free to use and modify with attribution.

---