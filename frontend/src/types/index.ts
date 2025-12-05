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
    ngoId?: number;
}

export type UserRole = 'USER' | 'NGO' | 'ADMIN' | 'NGO_WORKER';

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
    // NGO-specific fields (required when userType is NGO)
    ngoName?: string;
    address?: string;
    latitude?: number;
    longitude?: number;
    description?: string;
    registrationDocumentUrl?: string;
}

export interface JwtResponse {
    token: string;
    type: string;
    id: number;
    username: string;
    email: string;
    fullName: string;
    ngoId?: number;
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
    assignedWorkerId?: number;
    assignedWorkerName?: string;
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
    description?: string;
    injuryDescription?: string;
    additionalNotes?: string;
    latitude: number;
    longitude: number;
    address?: string;
    imageUrls?: string[];
    reporterName: string;
    reporterPhone: string;
    reporterEmail?: string;
}

export type VerificationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface NGO {
    id: number;
    uniqueId?: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    latitude: number;
    longitude: number;
    description: string;
    registrationDocumentUrl?: string;
    verificationStatus: VerificationStatus;
    verifiedBy?: number;
    verifiedAt?: string;
    rejectionReason?: string;
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

export interface UserResponse {
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

export interface NgoRequest {
    name: string;
    email: string;
    phone: string;
    address: string;
    latitude: number;
    longitude: number;
    description?: string;
    registrationDocumentUrl?: string;
}
