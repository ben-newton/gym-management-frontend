import { api } from '../api';
import type { ClassSchedule } from '@/types';

export const bookings = {
    getMyBookings: async () => {
        const { data } = await api.get<ClassSchedule[]>('/bookings/me');
        return data;
    },

    create: async (scheduleId: string) => {
        const { data } = await api.post<ClassSchedule>(`/bookings/${scheduleId}`);
        return data;
    },

    cancel: async (bookingId: number): Promise<ClassSchedule> => {
        const { data } = await api.post<ClassSchedule>(`/bookings/${bookingId}/cancel`);
        return data;
    },
}; 