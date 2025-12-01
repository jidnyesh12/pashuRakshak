import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import type { User, UserRole } from '../types';
import { getAuthUser, getAuthToken, clearAuthData } from '../utils/auth';

interface AuthContextType {
  user: Partial<User> | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = () => {
      console.log("AuthContext: Initializing authentication...");
      
      const storedUser = getAuthUser();
      const storedToken = getAuthToken();
      
      console.log("AuthContext: Stored User:", storedUser);
      console.log("AuthContext: Stored Token:", !!storedToken);

      if (storedToken && storedUser) {
        setUser(storedUser);
        setToken(storedToken);
        console.log("AuthContext: Authentication restored from localStorage");
      } else {
        console.log("AuthContext: No valid authentication found");
      }
      
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = (userData: Partial<User>, authToken: string) => {
    console.log("AuthContext: Logging in user:", userData);
    setUser(userData);
    setToken(authToken);
    
    // Store in localStorage
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    console.log("AuthContext: Logging out user");
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
    isAuthenticated: !!token && !!user,
    isLoading,
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