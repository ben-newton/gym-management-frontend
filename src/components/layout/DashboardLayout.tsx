"use client";

import { useAuth } from '@/hooks/useAuth';
import Navigation from './Navigation';
import { ReactNode } from 'react';

interface DashboardLayoutProps {
    children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const { user } = useAuth();

    const getNavItems = () => {
        switch (user?.role) {
            case 'management':
                return [
                    { name: 'Dashboard', href: '/dashboard' },
                    { name: 'Users', href: '/users' },
                    { name: 'Classes', href: '/classes' },
                    { name: 'Schedules', href: '/schedules' },
                ];
            case 'instructor':
                return [
                    { name: 'Dashboard', href: '/dashboard' },
                    { name: 'My Classes', href: '/my-classes' },
                    { name: 'Schedule', href: '/schedule' },
                ];
            case 'member':
                return [
                    { name: 'Dashboard', href: '/dashboard' },
                    { name: 'Available Classes', href: '/classes' },
                    { name: 'My Bookings', href: '/bookings' },
                ];
            default:
                return [];
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Navigation items={getNavItems()} />
            
            <main className="py-10">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Role-specific welcome message */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-semibold text-gray-900">
                            Welcome, {user?.first_name}
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">
                            {user?.role === 'management' && 'Manage your gym facilities and staff'}
                            {user?.role === 'instructor' && 'View and manage your classes'}
                            {user?.role === 'member' && 'Book classes and view your schedule'}
                        </p>
                    </div>
                    
                    {/* Main content */}
                    {children}
                </div>
            </main>
        </div>
    );
} 