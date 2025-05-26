import { api } from '../api';
import type { ClassSchedule } from '@/types';

export const bookings = {
    getMyBookings: async () => {
        const { data } = await api.get<ClassSchedule[]>('/api/v1/bookings/me');
        return data;
    },

    create: async (scheduleId: string) => {
        const { data } = await api.post<ClassSchedule>(`/api/v1/bookings/${scheduleId}`);
        return data;
    },

    cancel: async (bookingId: number): Promise<ClassSchedule> => {
        const { data } = await api.post<ClassSchedule>(`api/v1/bookings/${bookingId}/cancel`);
        return data;
    },
}; 