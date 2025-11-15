export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  phone?: string;
  roles: UserRole[];
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'USER' | 'NGO' | 'ADMIN';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  userType: 'USER' | 'NGO';
}

export interface JwtResponse {
  token: string;
  type: string;
  id: number;
  username: string;
  email: string;
  fullName: string;
  roles: UserRole[];
}

export interface AnimalReport {
  id: number;
  trackingId: string;
  animalType: string;
  condition: string;
  urgencyLevel: string;
  location: string;
  description?: string;
  injuryDescription: string;
  additionalNotes?: string;
  latitude: number;
  longitude: number;
  address?: string;
  imageUrls: string[];
  status: ReportStatus;
  reporterName: string;
  reporterPhone: string;
  reporterEmail: string;
  createdAt: string;
  updatedAt: string;
  assignedNgoId?: number;
  assignedNgoName?: string;
  assignedNgo?: string;
}

export type ReportStatus = 
  | 'SUBMITTED'
  | 'SEARCHING_FOR_HELP'
  | 'HELP_ON_THE_WAY'
  | 'TEAM_DISPATCHED'
  | 'ANIMAL_RESCUED'
  | 'CASE_RESOLVED';

export interface ReportRequest {
  animalType: string;
  condition: string;
  // urgencyLevel: string; // Removed as per new requirement
  description?: string;
  injuryDescription?: string;
  additionalNotes?: string;
  latitude: number;
  longitude: number;
  imageUrls?: string[];
  reporterName: string;
  reporterPhone: string;
  reporterEmail?: string;
}

export interface NGO {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  latitude: number;
  longitude: number;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserRequest {
  fullName: string;
  email: string;
  phone?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}