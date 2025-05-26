'use client';

import { useState } from 'react';
import ScheduleList from '@/components/schedules/ScheduleList';
import ScheduleFormModal from '@/components/schedules/ScheduleFormModal';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types/api';

export default function SchedulesPage() {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const { user } = useAuth();
  
  const canCreateSchedule = user?.role === UserRole.MANAGEMENT;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Class Schedules</h1>
        {canCreateSchedule && (
          <button
            type="button"
            onClick={() => setIsFormModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create Schedule
          </button>
        )}
      </div>
      <ScheduleList />
      
      <ScheduleFormModal 
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
      />
    </div>
  );
} 