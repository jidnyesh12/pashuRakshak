import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import type { User, UserRole, JwtResponse } from '../types';
import { setAuthData, getAuthUser, getAuthToken, clearAuthData } from '../utils/auth';
import { authAPI } from '../utils/api'; // Removed userAPI import

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
    const checkAuth = async () => {
      console.log("AuthContext: Checking authentication...");
      const storedUser = getAuthUser();
      const storedToken = getAuthToken();
      
      console.log("AuthContext: Stored User:", storedUser);
      console.log("AuthContext: Stored Token:", storedToken);

      if (storedToken) {
        console.log("AuthContext: Token found, validating with backend...");
        try {
          const isValid = await authAPI.validateToken(storedToken);
          console.log("AuthContext: Token validation result:", isValid);
          if (isValid) {
            if (storedUser) {
              setUser(storedUser);
              setToken(storedToken);
              console.log("AuthContext: User and token set from storage.");
            } else {
              // Token is valid but user data is missing in localStorage. Fetch user profile.
              console.log("AuthContext: Token valid but user data missing, fetching profile...");
              const fetchedUser = await authAPI.getProfile(); // Use authAPI.getProfile()
              if (fetchedUser) {
                setUser(fetchedUser);
                setToken(storedToken);
                localStorage.setItem('user', JSON.stringify(fetchedUser)); // Persist fetched user data
                console.log("AuthContext: User profile fetched and set.");
              } else {
                console.log("AuthContext: Failed to fetch user profile, logging out.");
                logout();
              }
            }
          } else {
            console.log("AuthContext: Token invalid, logging out.");
            logout(); 
          }
        } catch (error) {
          console.error("AuthContext: Error validating or fetching token/user:", error);
          logout();
        }
      } else {
        console.log("AuthContext: No token found in storage.");
      }
    };

    checkAuth();
  }, []);

  const login = (userData: Partial<User>, authToken: string) => {
    setUser(userData);
    setToken(authToken);
    // Persist to localStorage
    setAuthData({ id: userData.id!, username: userData.username!, email: userData.email!, fullName: userData.fullName!, roles: userData.roles!, token: authToken, type: 'Bearer' });
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