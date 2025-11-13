import axios from 'axios';
import type { 
  LoginRequest, 
  SignupRequest, 
  JwtResponse, 
  User, 
  AnimalReport, 
  ReportRequest, 
  NGO,
  UpdateUserRequest,
  ChangePasswordRequest
} from '../types';

const API_BASE_URL = 'http://localhost:8080/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (data: LoginRequest): Promise<JwtResponse> => {
    const response = await api.post('/auth/signin', data);
    return response.data;
  },

  signup: async (data: SignupRequest): Promise<string> => {
    const response = await api.post('/auth/signup', data);
    return response.data;
  },
};

// User API
export const userAPI = {
  getProfile: async (): Promise<User> => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  updateProfile: async (data: UpdateUserRequest): Promise<User> => {
    const response = await api.put('/users/profile', data);
    return response.data;
  },

  changePassword: async (data: ChangePasswordRequest): Promise<{ message: string }> => {
    const response = await api.put('/users/change-password', data);
    return response.data;
  },

  getAllUsers: async (): Promise<User[]> => {
    const response = await api.get('/users');
    return response.data;
  },

  getUserById: async (id: number): Promise<User> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  getUsersByRole: async (role: string): Promise<User[]> => {
    const response = await api.get(`/users/role/${role}`);
    return response.data;
  },

  toggleUserStatus: async (id: number): Promise<{ message: string }> => {
    const response = await api.put(`/users/${id}/toggle-status`);
    return response.data;
  },

  deleteUser: async (id: number): Promise<{ message: string }> => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },

  addRole: async (id: number, role: string): Promise<{ message: string }> => {
    const response = await api.post(`/users/${id}/roles/${role}`);
    return response.data;
  },

  removeRole: async (id: number, role: string): Promise<{ message: string }> => {
    const response = await api.delete(`/users/${id}/roles/${role}`);
    return response.data;
  },
};

// Reports API
export const reportsAPI = {
  createReport: async (data: ReportRequest): Promise<AnimalReport> => {
    const response = await api.post('/reports', data);
    return response.data;
  },

  trackReport: async (trackingId: string): Promise<AnimalReport> => {
    const response = await api.get(`/reports/track/${trackingId}`);
    return response.data;
  },

  getAllReports: async (): Promise<AnimalReport[]> => {
    const response = await api.get('/reports');
    return response.data;
  },

  getAvailableReports: async (): Promise<AnimalReport[]> => {
    const response = await api.get('/reports/available');
    return response.data;
  },

  getReportsByNgo: async (ngoId: number): Promise<AnimalReport[]> => {
    const response = await api.get(`/reports/ngo/${ngoId}`);
    return response.data;
  },

  acceptReport: async (trackingId: string, ngoId: number, ngoName: string): Promise<AnimalReport> => {
    const response = await api.post(`/reports/${trackingId}/accept`, {
      ngoId,
      ngoName,
    });
    return response.data;
  },

  updateReportStatus: async (trackingId: string, status: string): Promise<AnimalReport> => {
    const response = await api.put(`/reports/${trackingId}/status`, {
      status,
    });
    return response.data;
  },
};

// NGO API
export const ngoAPI = {
  getAllNgos: async (): Promise<NGO[]> => {
    const response = await api.get('/ngos');
    return response.data;
  },

  getNgoById: async (id: number): Promise<NGO> => {
    const response = await api.get(`/ngos/${id}`);
    return response.data;
  },

  getNearbyNgos: async (latitude: number, longitude: number, radius?: number): Promise<NGO[]> => {
    const response = await api.get(`/ngos/nearby?latitude=${latitude}&longitude=${longitude}&radius=${radius || 0.1}`);
    return response.data;
  },

  createNgo: async (data: Omit<NGO, 'id' | 'isActive' | 'createdAt' | 'updatedAt'>): Promise<NGO> => {
    const response = await api.post('/ngos', data);
    return response.data;
  },

  updateNgo: async (id: number, data: Partial<NGO>): Promise<NGO> => {
    const response = await api.put(`/ngos/${id}`, data);
    return response.data;
  },

  deactivateNgo: async (id: number): Promise<void> => {
    await api.delete(`/ngos/${id}`);
  },
};

export default api;