import { api } from '../api';
import type { Class, ClassSchedule } from '@/types/api';

export const classes = {
    getAll: async (): Promise<Class[]> => {
        const { data } = await api.get<Class[]>('/classes');
        return data;
    },

    getById: async (id: number): Promise<Class> => {
        const { data } = await api.get<Class>(`/classes/${id}`);
        return data;
    },

    create: async (classData: Pick<Class, 'name' | 'description' | 'capacity' | 'duration_minutes'>): Promise<Class> => {
        const { data } = await api.post<Class>('/classes', classData);
        return data;
    },

    getSchedules: async (): Promise<ClassSchedule[]> => {
        const { data } = await api.get<ClassSchedule[]>('/schedules');
        return data;
    },

    createSchedule: async (scheduleData: {
        class_id: number;
        instructor_id: number;
        location: string;
        start_time: string;
        end_time: string;
    }): Promise<ClassSchedule> => {
        const { data } = await api.post<ClassSchedule>('/schedules', scheduleData);
        return data;
    },
}; 