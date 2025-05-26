"use client";

import { useQuery, useMutation, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { auth } from '@/utils/api/auth';
import type { LoginCredentials, User, GymClass } from '@/types';

export const queryClient = new QueryClient();

export function useClasses() {
  return useQuery({
    queryKey: ['classes'],
    queryFn: async () => {
      // Implement API call
      return [] as GymClass[];
    }
  });
}

export function useUserClasses(userId: string) {
  return useQuery({
    queryKey: ['classes', userId],
    queryFn: async () => {
      // Implement API call
      return [] as GymClass[];
    }
  });
} 