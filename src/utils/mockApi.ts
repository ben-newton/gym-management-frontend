import { User, LoginCredentials, AuthResponse, UserRole } from '@/types';

// Mock user data
const mockUsers: User[] = [
  {
    id: 1,
    email: 'admin@gym.com',
    first_name: 'Admin',
    last_name: 'User',
    role: UserRole.MANAGEMENT,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    email: 'instructor@gym.com',
    first_name: 'John',
    last_name: 'Trainer',
    role: UserRole.INSTRUCTOR,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 3,
    email: 'member@gym.com',
    first_name: 'Jane',
    last_name: 'Member',
    role: UserRole.MEMBER,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Mock authentication functions
export const mockAuth = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const user = mockUsers.find(u => u.email === credentials.email);
    
    if (user && credentials.password === 'password') {
      return {
        access_token: 'mock-jwt-token',
        token_type: 'Bearer',
      };
    }
    
    throw new Error('Invalid credentials');
  },

  getCurrentUser: async (): Promise<User> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const token = localStorage.getItem('token');
    if (token) {
      // For testing, return the management user
      return mockUsers[0];
    }
    
    throw new Error('Not authenticated');
  },

  logout: async (): Promise<void> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
  },
}; 