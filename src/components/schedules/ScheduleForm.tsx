import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { classes } from '@/utils/api/classes';
import { useUsers } from '@/hooks/useQueries';
import { UserRole } from '@/types/api';

interface ScheduleFormData {
  class_id: number;
  instructor_id: number;
  start_time: string;
  end_time: string;
  location: string;
}

export default function ScheduleForm({ onSuccess }: { onSuccess?: () => void }) {
  const [error, setError] = useState<string>('');
  const queryClient = useQueryClient();
  const { data: instructors } = useUsers({ role: UserRole.INSTRUCTOR });
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ScheduleFormData>();

  const createSchedule = useMutation({
    mutationFn: (data: ScheduleFormData) => {
      return classes.createSchedule(data);
    },
    onSuccess: (newSchedule) => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
      reset();
      onSuccess?.();
    },
    onError: (error: any) => {
      setError(error.response?.data?.detail || 'Failed to create schedule');
    },
  });

  const onSubmit = handleSubmit((data: ScheduleFormData) => {
    createSchedule.mutate(data);
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Form fields will go here - I can provide the full form if you'd like */}
    </form>
  );
} 