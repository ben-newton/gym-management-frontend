import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { classes } from '@/utils/api/classes';

interface DeleteScheduleConfirmationProps {
  scheduleId: number;
  className: string;
  onCancel: () => void;
  onSuccess: () => void;
}

export default function DeleteScheduleConfirmation({
  scheduleId,
  className,
  onCancel,
  onSuccess,
}: DeleteScheduleConfirmationProps) {
  const [error, setError] = useState<string>('');
  const queryClient = useQueryClient();

  const deleteSchedule = useMutation({
    mutationFn: () => {
      // You'll need to implement this API function
      return classes.deleteSchedule(scheduleId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
      onSuccess();
    },
    onError: (error: any) => {
      setError(error.response?.data?.detail || 'Failed to delete schedule');
    },
  });

  return (
    <div className="p-4">
      <h3 className="text-lg font-medium text-gray-900 mb-3">Delete Schedule</h3>
      <p className="text-sm text-gray-500 mb-4">
        Are you sure you want to delete the scheduled class "{className}"? This action cannot be undone.
      </p>
      
      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => deleteSchedule.mutate()}
          disabled={deleteSchedule.isPending}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
        >
          {deleteSchedule.isPending ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  );
} 