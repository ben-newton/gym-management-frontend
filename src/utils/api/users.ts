import { api } from '../api';
import type { User } from '@/types';

export const users = {
    getAll: async (): Promise<User[]> => {
        const { data } = await api.get<User[]>('/api/v1/users');
        return data;
    },

    create: async (userData: {
        email: string;
        password: string;
        role: User['role'];
        first_name: string;
        last_name: string;
    }): Promise<User> => {
        const { data } = await api.post<User>('/api/v1/users', userData);
        return data;
    },
}; 