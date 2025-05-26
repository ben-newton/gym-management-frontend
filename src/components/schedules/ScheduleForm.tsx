import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { classes } from '@/utils/api/classes';
import { useClasses, useUsers } from '@/hooks/useQueries';
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
  const { data: availableClasses } = useClasses();
  
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<ScheduleFormData>();
  const selectedClassId = watch('class_id');
  const selectedClass = availableClasses?.find(c => c.id === Number(selectedClassId));

  // Calculate end time based on selected class duration
  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedClass && e.target.value) {
      const startTime = new Date(e.target.value);
      const endTime = new Date(startTime.getTime() + selectedClass.duration_minutes * 60000);
      
      // Format to ISO string and extract the datetime-local compatible portion
      const endTimeStr = endTime.toISOString().slice(0, 16);
      
      // Get the form element and set the end_time value
      const endTimeInput = document.querySelector('input[name="end_time"]') as HTMLInputElement;
      if (endTimeInput) {
        endTimeInput.value = endTimeStr;
      }
    }
  };

  const createSchedule = useMutation({
    mutationFn: (data: ScheduleFormData) => {
      return classes.createSchedule(data);
    },
    onSuccess: () => {
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
      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <div>
        <label htmlFor="class_id" className="block text-sm font-medium text-gray-700">
          Class Type
        </label>
        <select
          {...register('class_id', { required: 'Class is required' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">Select a class</option>
          {availableClasses?.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.duration_minutes} min)
            </option>
          ))}
        </select>
        {errors.class_id && (
          <p className="mt-1 text-sm text-red-600">{errors.class_id.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="instructor_id" className="block text-sm font-medium text-gray-700">
          Instructor
        </label>
        <select
          {...register('instructor_id', { required: 'Instructor is required' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">Select an instructor</option>
          {instructors?.map((instructor) => (
            <option key={instructor.id} value={instructor.id}>
              {instructor.first_name} {instructor.last_name}
            </option>
          ))}
        </select>
        {errors.instructor_id && (
          <p className="mt-1 text-sm text-red-600">{errors.instructor_id.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700">
          Location
        </label>
        <input
          {...register('location', { required: 'Location is required' })}
          type="text"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="e.g., Studio A"
        />
        {errors.location && (
          <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="start_time" className="block text-sm font-medium text-gray-700">
          Start Time
        </label>
        <input
          {...register('start_time', { required: 'Start time is required' })}
          type="datetime-local"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          onChange={handleStartTimeChange}
        />
        {errors.start_time && (
          <p className="mt-1 text-sm text-red-600">{errors.start_time.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="end_time" className="block text-sm font-medium text-gray-700">
          End Time
        </label>
        <input
          {...register('end_time', { required: 'End time is required' })}
          type="datetime-local"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.end_time && (
          <p className="mt-1 text-sm text-red-600">{errors.end_time.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={createSchedule.isPending}
        className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {createSchedule.isPending ? 'Creating...' : 'Create Schedule'}
      </button>
    </form>
  );
} 