"use client";

import { createContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/utils/api/auth';
import type { User } from '@/types';
import type { AuthResponse } from '@/types/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: { email: string; password: string }) => Promise<AuthResponse>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,
  login: () => {
    throw new Error('login() not implemented');
  },
  logout: () => {
    throw new Error('logout() not implemented');
  }
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const getStoredToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  };

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = getStoredToken();
      
      if (token) {
        try {
          const userData = await auth.getCurrentUser();
          setUser(userData);
        } catch (error) {
          // If token is invalid, clear it
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
          }
        }
      }
      
      // Important: Always set loading to false when done
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      const response = await auth.login(credentials);
      
      if (!response || !response.access_token) {
        throw new Error('Invalid login response');
      }
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', response.access_token);
      }
      
      const userData = await auth.getCurrentUser();
      setUser(userData);
      
      // Set loading to false before redirect
      setIsLoading(false);
      router.push('/dashboard');
      
      return response;
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await auth.logout();
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
      setUser(null);
      setIsLoading(false);
      router.push('/login');
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      token: getStoredToken(),
      isLoading,
      isAuthenticated: !!user,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
} 