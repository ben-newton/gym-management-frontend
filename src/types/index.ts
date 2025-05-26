export enum UserRole {
  MANAGEMENT = 'management',
  INSTRUCTOR = 'instructor',
  MEMBER = 'member'
}

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Class {
  id: number;
  name: string;
  description: string;
  capacity: number;
  duration_minutes: number;
  created_at: string;
  updated_at: string;
}

export interface ClassSchedule {
  id: number;
  class_id: number;
  instructor_id: number;
  start_time: string;
  end_time: string;
  location: string;
  class: Class;
  instructor: User;
  bookings_count: number;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface Session {
  token: string;
  expiresAt: number;
}

export interface GymClass {
  id: string;
  name: string;
  description: string;
  instructor: User;
  capacity: number;
  duration_minutes: number;
  schedules: ClassSchedule[];
} 