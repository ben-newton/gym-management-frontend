export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export enum UserRole {
  MANAGEMENT = 'management',
  INSTRUCTOR = 'instructor',
  MEMBER = 'member'
}

export interface GymClass {
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
  class: GymClass;
  instructor: User;
  bookings_count: number;
} 