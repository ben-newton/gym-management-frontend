"use client";

import { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  console.log('useAuth hook called with context:', {
    hasContext: !!context,
    hasLogin: typeof context?.login === 'function',
  });
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}; 