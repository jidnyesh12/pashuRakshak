import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, UserRole } from '../types';
import { getAuthUser, getAuthToken, clearAuthData } from '../utils/auth';

interface AuthContextType {
  user: Partial<User> | null;
  token: string | null;
  isAuthenticated: boolean;
  hasRole: (role: UserRole) => boolean;
  login: (user: Partial<User>, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<Partial<User> | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = getAuthUser();
    const storedToken = getAuthToken();
    
    if (storedUser && storedToken) {
      setUser(storedUser);
      setToken(storedToken);
    }
  }, []);

  const login = (userData: Partial<User>, authToken: string) => {
    setUser(userData);
    setToken(authToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    clearAuthData();
  };

  const updateUser = (userData: Partial<User>) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const hasRole = (role: UserRole): boolean => {
    return user?.roles?.includes(role) || false;
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token,
    hasRole,
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};