"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { users } from '@/utils/api/users';
import { classes } from '@/utils/api/classes';
import { bookings } from '@/utils/api/bookings';
import type { Class, ClassSchedule, User } from '@/types/api';
import { api } from '@/utils/api';
import type { GymClass } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types/api';

// Classes
export function useClasses() {
  return useQuery<Class[]>({
    queryKey: ['classes'],
    queryFn: classes.getAll,
  });
}

export function useClass(id: number) {
  return useQuery({
    queryKey: ['classes', id],
    queryFn: () => classes.getById(id),
    enabled: !!id,
  });
}

export function useSchedules(options?: { includeHistory?: boolean }) {
  const { user } = useAuth();
  const token = localStorage.getItem('token');
  
  return useQuery({
    queryKey: ['schedules', options?.includeHistory],
    queryFn: async () => {
      const { data } = await api.get('/api/v1/schedules/', {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: {
          instructor_id: user?.role === UserRole.INSTRUCTOR ? user.id : undefined,
          include_details: true,
          include_history: options?.includeHistory ? true : undefined
        }
      });
      return data;
    },
    enabled: !!token
  });
}

export function useInstructorSchedules(instructorId: number) {
  return useQuery({
    queryKey: ['schedules', 'instructor', instructorId],
    queryFn: async () => {
      const { data } = await api.get(`/api/v1/schedules`, {
        params: { instructor_id: instructorId, include_details: true }
      });
      return data;
    },
    enabled: !!instructorId
  });
}

// Bookings
export function useMyBookings() {
  return useQuery({
    queryKey: ['bookings', 'my'],
    queryFn: bookings.getMyBookings,
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: bookings.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings', 'my'] });
    },
  });
}

// Users (Management only)
export function useUsers(options?: { role?: UserRole }) {
  return useQuery<User[]>({
    queryKey: ['users', options?.role],
    queryFn: async () => {
      const { data } = await api.get('/api/v1/users', {
        params: { role: options?.role }
      });
      return data;
    }
  });
} 