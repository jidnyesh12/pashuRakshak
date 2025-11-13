# Pashu Rakshak API Documentation

## Base URL
```
http://localhost:8080/api
```

## Authentication

The API uses JWT (JSON Web Token) for authentication. 

### Authentication Flow:
1. **Register** a new user with `/auth/signup` (optional)
2. **Login** with `/auth/signin` to get JWT token
3. **Include token** in Authorization header for protected endpoints
4. **Token expires** after 24 hours - login again for fresh token

### Token Usage:
Include the token in the Authorization header for all protected endpoints:
```
Authorization: Bearer <your-jwt-token>
```

### User Roles & Permissions:
- **USER**: Can create reports, view public data, manage own profile
- **NGO**: All USER permissions + accept reports, manage assigned cases
- **ADMIN**: Full system access including user management

### Public Endpoints (No Authentication Required):
- `POST /auth/signup` - User registration
- `POST /auth/signin` - User login  
- `POST /reports` - Create animal report
- `GET /reports/track/{trackingId}` - Track report by ID
- `GET /reports` - Get all reports
- `GET /ngos` - Get all NGOs
- `POST /ngos` - Register NGO

### Protected Endpoints (Authentication Required):
- All `/users/*` endpoints
- `GET /reports/available` - Get available reports
- `GET /reports/ngo/{ngoId}` - Get reports by NGO
- `POST /reports/{trackingId}/accept` - Accept report
- `PUT /reports/{trackingId}/status` - Update report status
- Most `/ngos/*` endpoints (except public ones)

## Authentication APIs

### 1. User Registration
**POST** `/auth/signup`

Registers a new user in the system. **No authentication required.**

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

**Field Validations:**
- `username`: Required, 3-20 characters, must be unique
- `email`: Required, valid email format, must be unique
- `password`: Required, minimum 6 characters
- `fullName`: Required
- `phone`: Optional, should include country code
- `userType`: Optional, defaults to "USER"

**User Types:**
- `USER` - Regular user who can report animals
- `NGO` - NGO representative who can accept reports

**Success Response (200 OK):**
```json
"User registered successfully!"
```

**Error Responses:**

**400 Bad Request - Username already taken:**
```json
"Error: Username is already taken!"
```

**400 Bad Request - Email already in use:**
```json
"Error: Email is already in use!"
```

**400 Bad Request - Validation errors:**
```json
{
  "timestamp": "2024-01-15T10:30:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed for object='signupRequest'. Error count: 2",
  "path": "/api/auth/signup"
}
```

**Example cURL:**
```bash
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "password123",
    "fullName": "John Doe",
    "phone": "+91-9876543210",
    "userType": "USER"
  }'
```

### 2. User Login
**POST** `/auth/signin`

Authenticates a user and returns JWT token. **No authentication required.**

**Request Body:**
```json
{
  "username": "johndoe",
  "password": "password123"
}
```

**Field Validations:**
- `username`: Required, can be username or email
- `password`: Required

**Success Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJqb2huZG9lIiwiaWF0IjoxNzA1MzE0NjAwLCJleHAiOjE3MDU0MDEwMDB9.signature",
  "type": "Bearer",
  "id": 1,
  "username": "johndoe",
  "email": "john@example.com",
  "fullName": "John Doe",
  "roles": ["USER"]
}
```

**Response Fields:**
- `token`: JWT token to be used in Authorization header
- `type`: Always "Bearer"
- `id`: User's unique ID
- `username`: User's username
- `email`: User's email address
- `fullName`: User's full name
- `roles`: Array of user roles (USER, NGO, ADMIN)

**Error Responses:**

**400 Bad Request - Invalid credentials:**
```json
"Error: Invalid username or password!"
```

**400 Bad Request - Validation errors:**
```json
{
  "timestamp": "2024-01-15T10:30:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "path": "/api/auth/signin"
}
```

**Example cURL:**
```bash
curl -X POST http://localhost:8080/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "password": "password123"
  }'
```

**Token Usage:**
After successful login, include the token in all authenticated requests:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Token Expiration:**
- JWT tokens expire after 24 hours (86400000 ms)
- When token expires, you'll get 401 Unauthorized
- Login again to get a fresh token

## User Management APIs

### 1. Get User Profile
**GET** `/users/profile`

Retrieves the current user's profile information. **Authentication required.**

**Headers:** 
```
Authorization: Bearer <token>
```

**Success Response (200 OK):**
```json
{
  "id": 1,
  "username": "johndoe",
  "email": "john@example.com",
  "fullName": "John Doe",
  "phone": "+91-9876543210",
  "roles": ["USER"],
  "enabled": true,
  "createdAt": "2024-01-15T10:30:00",
  "updatedAt": "2024-01-15T10:30:00"
}
```

**Error Responses:**

**401 Unauthorized - Invalid/expired token:**
```json
{
  "timestamp": "2024-01-15T10:30:00",
  "status": 401,
  "error": "Unauthorized",
  "message": "Full authentication is required to access this resource",
  "path": "/api/users/profile"
}
```

**404 Not Found - User not found:**
```json
{
  "timestamp": "2024-01-15T10:30:00",
  "status": 404,
  "error": "Not Found",
  "message": "User not found",
  "path": "/api/users/profile"
}
```

**Example cURL:**
```bash
curl -X GET http://localhost:8080/api/users/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 2. Update User Profile
**PUT** `/users/profile`

Updates the current user's profile information. **Authentication required.**

**Headers:** 
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "fullName": "John Doe Updated",
  "email": "john.updated@example.com",
  "phone": "+91-9876543211"
}
```

**Field Validations:**
- `fullName`: Required
- `email`: Required, valid email format, must be unique
- `phone`: Optional

**Success Response (200 OK):**
```json
{
  "id": 1,
  "username": "johndoe",
  "email": "john.updated@example.com",
  "fullName": "John Doe Updated",
  "phone": "+91-9876543211",
  "roles": ["USER"],
  "enabled": true,
  "createdAt": "2024-01-15T10:30:00",
  "updatedAt": "2024-01-15T11:00:00"
}
```

**Error Responses:**

**400 Bad Request - Email already in use:**
```json
"Failed to update profile. Email might already be in use."
```

**400 Bad Request - Validation errors:**
```json
{
  "timestamp": "2024-01-15T10:30:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "path": "/api/users/profile"
}
```

**Example cURL:**
```bash
curl -X PUT http://localhost:8080/api/users/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "fullName": "John Doe Updated",
    "email": "john.updated@example.com",
    "phone": "+91-9876543211"
  }'
```

### 3. Change Password
**PUT** `/users/change-password`

Changes the current user's password. **Authentication required.**

**Headers:** 
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword123",
  "confirmPassword": "newpassword123"
}
```

**Field Validations:**
- `currentPassword`: Required
- `newPassword`: Required, minimum 6 characters
- `confirmPassword`: Required, must match newPassword

**Success Response (200 OK):**
```json
{
  "message": "Password changed successfully"
}
```

**Error Responses:**

**400 Bad Request - Current password incorrect:**
```json
{
  "error": "Current password is incorrect"
}
```

**400 Bad Request - Passwords don't match:**
```json
{
  "error": "New password and confirm password do not match"
}
```

**400 Bad Request - Validation errors:**
```json
{
  "timestamp": "2024-01-15T10:30:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "path": "/api/users/change-password"
}
```

**Example cURL:**
```bash
curl -X PUT http://localhost:8080/api/users/change-password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "currentPassword": "oldpassword123",
    "newPassword": "newpassword123",
    "confirmPassword": "newpassword123"
  }'
```

### 4. Get All Users (Admin Only)
**GET** `/users`

Retrieves all users in the system. **Admin authentication required.**

**Headers:** `Authorization: Bearer <admin-token>`

**Response:** Array of user objects

### 5. Get User by ID (Admin Only)
**GET** `/users/{id}`

Retrieves a specific user by ID. **Admin authentication required.**

**Headers:** `Authorization: Bearer <admin-token>`

**Example:** `GET /users/1`

**Response:** User object

### 6. Get User by Username (Admin Only)
**GET** `/users/username/{username}`

Retrieves a user by username. **Admin authentication required.**

**Headers:** `Authorization: Bearer <admin-token>`

**Example:** `GET /users/username/johndoe`

**Response:** User object

### 7. Get User by Email (Admin Only)
**GET** `/users/email/{email}`

Retrieves a user by email address. **Admin authentication required.**

**Headers:** `Authorization: Bearer <admin-token>`

**Example:** `GET /users/email/john@example.com`

**Response:** User object

### 8. Get Users by Role (Admin Only)
**GET** `/users/role/{role}`

Retrieves all users with a specific role. **Admin authentication required.**

**Headers:** `Authorization: Bearer <admin-token>`

**Available Roles:** `USER`, `NGO`, `ADMIN`

**Example:** `GET /users/role/NGO`

**Response:** Array of user objects

### 9. Toggle User Status (Admin Only)
**PUT** `/users/{id}/toggle-status`

Enables or disables a user account. **Admin authentication required.**

**Headers:** `Authorization: Bearer <admin-token>`

**Example:** `PUT /users/1/toggle-status`

**Response:**
```json
{
  "message": "User status updated successfully"
}
```

### 10. Delete User (Admin Only)
**DELETE** `/users/{id}`

Permanently deletes a user account. **Admin authentication required.**

**Headers:** `Authorization: Bearer <admin-token>`

**Example:** `DELETE /users/1`

**Response:**
```json
{
  "message": "User deleted successfully"
}
```

### 11. Add Role to User (Admin Only)
**POST** `/users/{id}/roles/{role}`

Adds a role to a user. **Admin authentication required.**

**Headers:** `Authorization: Bearer <admin-token>`

**Available Roles:** `USER`, `NGO`, `ADMIN`

**Example:** `POST /users/1/roles/NGO`

**Response:**
```json
{
  "message": "Role added successfully"
}
```

### 12. Remove Role from User (Admin Only)
**DELETE** `/users/{id}/roles/{role}`

Removes a role from a user (cannot remove if it's the only role). **Admin authentication required.**

**Headers:** `Authorization: Bearer <admin-token>`

**Example:** `DELETE /users/1/roles/USER`

**Response:**
```json
{
  "message": "Role removed successfully"
}
```

## Test Credentials

For testing purposes, the following users are pre-created:

- **Admin:** `admin` / `admin123`
- **NGO User:** `ngouser` / `ngo123`
- **Regular User:** `testuser` / `user123`

## Animal Report APIs

### 1. Create Animal Report
**POST** `/reports`

Creates a new animal rescue report. **No authentication required.**

**Request Body:**
```json
{
  "animalType": "Dog",
  "injuryDescription": "Injured leg, bleeding",
  "additionalNotes": "Found near main road",
  "latitude": 18.5204,
  "longitude": 73.8567,
  "address": "Pune, Maharashtra",
  "imageUrls": ["url1", "url2"],
  "reporterName": "John Doe",
  "reporterPhone": "+91-9876543210",
  "reporterEmail": "john@example.com"
}
```

**Response:**
```json
{
  "id": 1,
  "trackingId": "PR-A1B2C3D4",
  "animalType": "Dog",
  "injuryDescription": "Injured leg, bleeding",
  "additionalNotes": "Found near main road",
  "latitude": 18.5204,
  "longitude": 73.8567,
  "address": "Pune, Maharashtra",
  "imageUrls": ["url1", "url2"],
  "status": "SUBMITTED",
  "statusDisplayName": "Report Submitted",
  "reporterName": "John Doe",
  "reporterPhone": "+91-9876543210",
  "reporterEmail": "john@example.com",
  "createdAt": "2024-01-15T10:30:00",
  "updatedAt": "2024-01-15T10:30:00",
  "assignedNgoId": null,
  "assignedNgoName": null
}
```

### 2. Track Report by Tracking ID
**GET** `/reports/track/{trackingId}`

Retrieves report status using tracking ID. **No authentication required.**

**Example:** `GET /reports/track/PR-A1B2C3D4`

**Response:** Same as create report response

### 3. Get All Reports
**GET** `/reports`

Retrieves all reports (for admin/NGO dashboard). **No authentication required.**

**Response:** Array of report objects

### 4. Get Available Reports
**GET** `/reports/available`

Retrieves reports that are available for NGOs to accept (status: SUBMITTED or SEARCHING_FOR_HELP). **Authentication required.**

**Headers:** `Authorization: Bearer <token>`

**Response:** Array of report objects

### 5. Get Reports by NGO
**GET** `/reports/ngo/{ngoId}`

Retrieves all reports assigned to a specific NGO. **Authentication required.**

**Headers:** `Authorization: Bearer <token>`

**Example:** `GET /reports/ngo/1`

**Response:** Array of report objects

### 6. Accept Report
**POST** `/reports/{trackingId}/accept`

Allows an NGO to accept a report using tracking ID. **Authentication required.**

**Headers:** `Authorization: Bearer <token>`

**Example:** `POST /reports/PR-A1B2C3D4/accept`

**Request Body:**
```json
{
  "ngoId": 1,
  "ngoName": "Animal Welfare Society"
}
```

**Response:** Updated report object with assigned NGO details

### 7. Update Report Status
**PUT** `/reports/{trackingId}/status`

Updates the status of a report using tracking ID. **Authentication required.**

**Headers:** `Authorization: Bearer <token>`

**Example:** `PUT /reports/PR-A1B2C3D4/status`

**Request Body:**
```json
{
  "status": "TEAM_DISPATCHED"
}
```

**Available Status Values:**
- `SUBMITTED` - Report Submitted
- `SEARCHING_FOR_HELP` - Searching for Help
- `HELP_ON_THE_WAY` - Help is on the Way
- `TEAM_DISPATCHED` - Team Dispatched
- `ANIMAL_RESCUED` - Animal Rescued
- `CASE_RESOLVED` - Case Resolved

**Response:** Updated report object

## NGO APIs

### 1. Register NGO
**POST** `/ngos`

Registers a new NGO in the system. **No authentication required.**

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

**Response:**
```json
{
  "id": 1,
  "name": "Animal Welfare Society",
  "email": "contact@animalwelfare.org",
  "phone": "+91-9876543210",
  "address": "123 Main Street, Pune",
  "latitude": 18.5204,
  "longitude": 73.8567,
  "description": "Dedicated to animal rescue and welfare",
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00",
  "updatedAt": "2024-01-15T10:30:00"
}
```

### 2. Get All Active NGOs
**GET** `/ngos`

Retrieves all active NGOs. **No authentication required.**

**Response:** Array of NGO objects

### 3. Get NGO by ID
**GET** `/ngos/{id}`

Retrieves a specific NGO by ID. **Authentication required.**

**Headers:** `Authorization: Bearer <token>`

**Example:** `GET /ngos/1`

**Response:** NGO object

### 4. Get NGO by Email
**GET** `/ngos/email/{email}`

Retrieves NGO by email address. **Authentication required.**

**Headers:** `Authorization: Bearer <token>`

**Example:** `GET /ngos/email/contact@animalwelfare.org`

**Response:** NGO object

### 5. Get Nearby NGOs
**GET** `/ngos/nearby?latitude={lat}&longitude={lng}&radius={radius}`

Retrieves NGOs within a specified radius of given coordinates. **Authentication required.**

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `latitude` (required): Latitude coordinate
- `longitude` (required): Longitude coordinate  
- `radius` (optional): Search radius in degrees (default: 0.1)

**Example:** `GET /ngos/nearby?latitude=18.5204&longitude=73.8567&radius=0.1`

**Response:** Array of NGO objects

### 6. Update NGO
**PUT** `/ngos/{id}`

Updates NGO information. **Authentication required (NGO or Admin role).**

**Headers:** `Authorization: Bearer <token>`

**Request Body:** Same as register NGO

**Response:** Updated NGO object

### 7. Deactivate NGO
**DELETE** `/ngos/{id}`

Deactivates an NGO (soft delete). **Authentication required (Admin role only).**

**Headers:** `Authorization: Bearer <token>`

**Response:** 204 No Content

## Error Responses

All APIs return appropriate HTTP status codes:

- `200 OK` - Success
- `201 Created` - Resource created successfully
- `204 No Content` - Success with no response body
- `400 Bad Request` - Invalid request data
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

**Error Response Format:**
```json
{
  "timestamp": "2024-01-15T10:30:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "path": "/api/reports"
}
```

## Database Access

For development purposes, H2 console is available at:
```
http://localhost:8080/h2-console
```

**Connection Details:**
- JDBC URL: `jdbc:h2:file:./data/pashurakshak`
- Username: `sa`
- Password: `password`

## Important Changes

### Fixed Issues:
1. **Report Accept/Status APIs now use tracking ID instead of report ID**
   - Old: `POST /reports/{reportId}/accept`
   - New: `POST /reports/{trackingId}/accept`
   - Old: `PUT /reports/{reportId}/status`
   - New: `PUT /reports/{trackingId}/status`

2. **Added JWT Authentication**
   - Most APIs now require authentication
   - Use `Authorization: Bearer <token>` header
   - Get token from `/auth/signin` endpoint

3. **User Roles**
   - `USER`: Can create reports and view public data
   - `NGO`: Can accept reports and manage assigned cases
   - `ADMIN`: Full system access

## Security

- JWT tokens expire after 24 hours (86400000 ms)
- Passwords are encrypted using BCrypt
- CORS is configured for `http://localhost:3000`
- H2 console is enabled for development only

## API Testing Examples

### 1. Complete User Flow Test

**Step 1: Register a new user**
```bash
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newuser",
    "email": "newuser@example.com",
    "password": "password123",
    "fullName": "New User",
    "phone": "+91-9876543214",
    "userType": "USER"
  }'
```

**Step 2: Login to get JWT token**
```bash
curl -X POST http://localhost:8080/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newuser",
    "password": "password123"
  }'
```

**Step 3: Get user profile (use token from step 2)**
```bash
curl -X GET http://localhost:8080/api/users/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Step 4: Update profile**
```bash
curl -X PUT http://localhost:8080/api/users/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "fullName": "Updated User Name",
    "email": "updated@example.com",
    "phone": "+91-9876543215"
  }'
```

**Step 5: Change password**
```bash
curl -X PUT http://localhost:8080/api/users/change-password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "currentPassword": "password123",
    "newPassword": "newpassword123",
    "confirmPassword": "newpassword123"
  }'
```

### 2. Admin Operations Test

**Login as admin**
```bash
curl -X POST http://localhost:8080/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

**Get all users**
```bash
curl -X GET http://localhost:8080/api/users \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"
```

**Get users by role**
```bash
curl -X GET http://localhost:8080/api/users/role/NGO \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"
```

**Add role to user**
```bash
curl -X POST http://localhost:8080/api/users/1/roles/NGO \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"
```

### 3. Report Management Test

**Accept a report (NGO user)**
```bash
curl -X POST http://localhost:8080/api/reports/PR-66521121/accept \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer NGO_JWT_TOKEN" \
  -d '{
    "ngoId": 1,
    "ngoName": "Pune Animal Welfare Society"
  }'
```

**Update report status**
```bash
curl -X PUT http://localhost:8080/api/reports/PR-66521121/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer NGO_JWT_TOKEN" \
  -d '{
    "status": "TEAM_DISPATCHED"
  }'
```

## Notes

1. All timestamps are in ISO 8601 format
2. Coordinates are in decimal degrees format
3. Image URLs should be valid HTTP/HTTPS URLs
4. Phone numbers should include country code
5. The database file will be created in the `data` directory relative to the application root
6. CORS is configured to allow requests from `http://localhost:3000` (React frontend)
7. **Use tracking IDs (e.g., PR-A1B2C3D4) for report operations, not database IDs**
8. **Replace YOUR_JWT_TOKEN, ADMIN_JWT_TOKEN, NGO_JWT_TOKEN with actual tokens from login responses**
9. **JWT tokens expire after 24 hours - you'll need to login again to get a fresh token**