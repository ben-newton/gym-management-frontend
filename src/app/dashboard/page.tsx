"use client";

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ManagementDashboard from '@/components/dashboard/ManagementDashboard';
import InstructorDashboard from '@/components/dashboard/InstructorDashboard';
import MemberDashboard from '@/components/dashboard/MemberDashboard';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardPage() {
    const { user } = useAuth();

    const getDashboardComponent = () => {
        switch (user?.role) {
            case 'management':
                return <ManagementDashboard />;
            case 'instructor':
                return <InstructorDashboard />;
            case 'member':
                return <MemberDashboard />;
            default:
                return null;
        }
    };

    return (
        <ProtectedRoute>
            <DashboardLayout>
                {getDashboardComponent()}
            </DashboardLayout>
        </ProtectedRoute>
    );
} 