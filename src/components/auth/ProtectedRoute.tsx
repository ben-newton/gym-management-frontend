"use client";

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import type { User } from '@/types';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: Array<User['role']>;
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    const { user, isLoading, isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading) {
            if (!isAuthenticated) {
                router.push('/login');
            } else if (allowedRoles && user && !allowedRoles.includes(user.role)) {
                router.push('/unauthorized');
            }
        }
    }, [isLoading, isAuthenticated, user, router, allowedRoles]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
            </div>
        );
    }

    if (!isAuthenticated || (allowedRoles && user && !allowedRoles.includes(user.role))) {
        return null;
    }

    return <>{children}</>;
} 