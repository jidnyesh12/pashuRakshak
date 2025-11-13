import type { JwtResponse, User, UserRole } from '../types';

export const setAuthData = (authData: JwtResponse) => {
  localStorage.setItem('token', authData.token);
  localStorage.setItem('user', JSON.stringify({
    id: authData.id,
    username: authData.username,
    email: authData.email,
    fullName: authData.fullName,
    roles: authData.roles,
  }));
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

export const getAuthUser = (): Partial<User> | null => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

export const hasRole = (role: UserRole): boolean => {
  const user = getAuthUser();
  return user?.roles?.includes(role) || false;
};

export const isAdmin = (): boolean => {
  return hasRole('ADMIN');
};

export const isNGO = (): boolean => {
  return hasRole('NGO');
};

export const isUser = (): boolean => {
  return hasRole('USER');
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'SUBMITTED':
      return 'status-submitted';
    case 'SEARCHING_FOR_HELP':
      return 'status-searching';
    case 'HELP_ON_THE_WAY':
      return 'status-help-on-way';
    case 'TEAM_DISPATCHED':
      return 'status-dispatched';
    case 'ANIMAL_RESCUED':
      return 'status-rescued';
    case 'CASE_RESOLVED':
      return 'status-resolved';
    default:
      return 'status-submitted';
  }
};

export const getStatusText = (status: string): string => {
  switch (status) {
    case 'SUBMITTED':
      return 'Report Submitted';
    case 'SEARCHING_FOR_HELP':
      return 'Searching for Help';
    case 'HELP_ON_THE_WAY':
      return 'Help is on the Way';
    case 'TEAM_DISPATCHED':
      return 'Team Dispatched';
    case 'ANIMAL_RESCUED':
      return 'Animal Rescued';
    case 'CASE_RESOLVED':
      return 'Case Resolved';
    default:
      return status;
  }
};