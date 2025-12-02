# Pashu Rakshak API Documentation

## Base URL
```
http://localhost:8080/api
```

## Authentication
The API uses JWT (JSON Web Token) for authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## Authentication Endpoints

### 1. User Registration
**POST** `/auth/signup`

Register a new user in the system.

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com", 
  "password": "password123",
  "fullName": "John Doe",
  "phone": "+91-9876543210",
  "userType": "USER"
}
```

### 2. User Login
**POST** `/auth/signin`

Authenticate user and get JWT token.

**Request Body:**
```json
{
  "username": "johndoe",
  "password": "password123"
}
```

### 3. Validate Token
**GET** `/auth/validateToken`

Validate JWT token.

**Headers:**
```
Authorization: Bearer <token>
```

---

## User Management Endpoints

### 1. Get User Profile
**GET** `/users/profile`

Get current user's profile information.

**Headers:**
```
Authorization: Bearer <token>
```

### 2. Update User Profile
**PUT** `/users/profile`

Update current user's profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "fullName": "John Doe Updated",
  "email": "john.updated@example.com",
  "phone": "+91-9876543211"
}
```

### 3. Change Password
**PUT** `/users/change-password`

Change current user's password.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword123", 
  "confirmPassword": "newpassword123"
}
```

### 4. Get All Users (Admin Only)
**GET** `/users`

Get all users in the system.

**Headers:**
```
Authorization: Bearer <admin-token>
```

### 5. Get User by ID (Admin Only)
**GET** `/users/{id}`

Get specific user by ID.

**Headers:**
```
Authorization: Bearer <admin-token>
```

### 6. Get User by Username (Admin Only)
**GET** `/users/username/{username}`

Get user by username.

**Headers:**
```
Authorization: Bearer <admin-token>
```

### 7. Get User by Email (Admin Only)
**GET** `/users/email/{email}`

Get user by email address.

**Headers:**
```
Authorization: Bearer <admin-token>
```

### 8. Get Users by Role (Admin Only)
**GET** `/users/role/{role}`

Get all users with specific role (USER, NGO, ADMIN).

**Headers:**
```
Authorization: Bearer <admin-token>
```

### 9. Toggle User Status (Admin Only)
**PUT** `/users/{id}/toggle-status`

Enable or disable user account.

**Headers:**
```
Authorization: Bearer <admin-token>
```

### 10. Delete User (Admin Only)
**DELETE** `/users/{id}`

Delete user account.

**Headers:**
```
Authorization: Bearer <admin-token>
```

### 11. Add Role to User (Admin Only)
**POST** `/users/{id}/roles/{role}`

Add role to user.

**Headers:**
```
Authorization: Bearer <admin-token>
```

### 12. Remove Role from User (Admin Only)
**DELETE** `/users/{id}/roles/{role}`

Remove role from user.

**Headers:**
```
Authorization: Bearer <admin-token>
```

---

## Animal Report Endpoints

### 1. Create Animal Report
**POST** `/reports`

Create new animal rescue report.

**Request Body:**
```json
{
  "animalType": "Dog",
  "condition": "Injured",
  "injuryDescription": "Injured leg, bleeding",
  "additionalNotes": "Found near main road",
  "latitude": 18.5204,
  "longitude": 73.8567,
  "imageUrls": ["url1", "url2"],
  "reporterName": "John Doe",
  "reporterPhone": "+91-9876543210",
  "reporterEmail": "john@example.com"
}
```

### 2. Track Report by Tracking ID
**GET** `/reports/track/{trackingId}`

Get report status using tracking ID.

### 3. Get All Reports
**GET** `/reports`

Get all reports in the system.

### 4. Get Available Reports
**GET** `/reports/available`

Get reports available for NGOs to accept.

**Headers:**
```
Authorization: Bearer <token>
```

### 5. Get Reports by NGO
**GET** `/reports/ngo/{ngoId}`

Get all reports assigned to specific NGO.

**Headers:**
```
Authorization: Bearer <token>
```

### 6. Accept Report
**POST** `/reports/{trackingId}/accept`

Accept a report using tracking ID.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "ngoId": 1,
  "ngoName": "Animal Welfare Society"
}
```

### 7. Update Report Status
**PUT** `/reports/{trackingId}/status`

Update report status using tracking ID.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "status": "TEAM_DISPATCHED"
}
```

**Available Status Values:**
- SUBMITTED
- SEARCHING_FOR_HELP
- HELP_ON_THE_WAY
- TEAM_DISPATCHED
- ANIMAL_RESCUED
- CASE_RESOLVED

---

## NGO Management Endpoints

### 1. Create NGO
**POST** `/ngos`

Register new NGO in the system.

**Request Body:**
```json
{
  "name": "Animal Welfare Society",
  "email": "contact@animalwelfare.org",
  "phone": "+91-9876543210",
  "address": "123 Main Street, Pune",
  "latitude": 18.5204,
  "longitude": 73.8567,
  "description": "Dedicated to animal rescue and welfare"
}
```

### 2. Get All Active NGOs
**GET** `/ngos`

Get all active NGOs.

### 3. Get NGO by ID
**GET** `/ngos/{id}`

Get specific NGO by ID.

### 4. Get NGO by Email
**GET** `/ngos/email/{email}`

Get NGO by email address.

### 5. Get Nearby NGOs
**GET** `/ngos/nearby`

Get NGOs within specified radius.

**Query Parameters:**
- latitude (required): Latitude coordinate
- longitude (required): Longitude coordinate
- radius (optional): Search radius in degrees (default: 0.1)

### 6. Update NGO
**PUT** `/ngos/{id}`

Update NGO information.

**Request Body:**
```json
{
  "name": "Updated NGO Name",
  "email": "updated@animalwelfare.org",
  "phone": "+91-9876543210",
  "address": "Updated Address",
  "latitude": 18.5204,
  "longitude": 73.8567,
  "description": "Updated description"
}
```

### 7. Deactivate NGO
**DELETE** `/ngos/{id}`

Deactivate NGO (soft delete).

---

## Response Status Codes

- **200 OK** - Success
- **201 Created** - Resource created successfully
- **204 No Content** - Success with no response body
- **400 Bad Request** - Invalid request data
- **401 Unauthorized** - Authentication required
- **403 Forbidden** - Access denied
- **404 Not Found** - Resource not found
- **500 Internal Server Error** - Server error

## User Roles

- **USER** - Can create reports, view public data, manage own profile
- **NGO** - All USER permissions + accept reports, manage assigned cases
- **ADMIN** - Full system access including user management

## Test Credentials

- **Admin:** `admin` / `admin123`
- **NGO User:** `ngouser` / `ngo123`
- **Regular User:** `testuser` / `user123`