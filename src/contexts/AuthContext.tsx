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

  const login = async (credentials: { email: string; password: string }) => {
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
      router.push('/dashboard');
      
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await auth.logout();
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
      setUser(null);
      router.push('/login');
    } catch (error) {
      // Silently fail
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