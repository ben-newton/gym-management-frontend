import { api } from '@/utils/api';
import type { User } from '@/types';
import type { AuthResponse } from '@/types/api';

// Use mock auth for development
export const auth = {
    login: async (credentials: { email: string; password: string }): Promise<AuthResponse> => {
        try {
            const formData = new URLSearchParams();
            formData.append('username', credentials.email);
            formData.append('password', credentials.password);
            
            // Use the full path including /api/v1
            const endpoint = 'api/v1/auth/login';
            
            const { data } = await api.post<AuthResponse>(endpoint, formData, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });
            
            return data;
        } catch (error) {
            // Simplified error handling - no logging
            throw error;
        }
    },

    getCurrentUser: async (): Promise<User> => {
        const { data } = await api.get<User>('api/v1/users/me');
        return data;
    },

    logout: async (): Promise<void> => {
        await api.post('api/v1/auth/logout');
    }
}; 