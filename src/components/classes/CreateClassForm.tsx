import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { classes } from '@/utils/api/classes';

interface CreateClassFormData {
  name: string;
  description: string;
  capacity: number;
  duration_minutes: number;
}

export default function CreateClassForm({ onSuccess }: { onSuccess?: () => void }) {
  const [error, setError] = useState<string>('');
  const queryClient = useQueryClient();
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<CreateClassFormData>();

  const createClass = useMutation({
    mutationFn: (data: CreateClassFormData) => {
      return classes.create({
        name: data.name,
        description: data.description,
        capacity: Number(data.capacity),
        duration_minutes: Number(data.duration_minutes)
      });
    },
    onSuccess: (newClass) => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      
      queryClient.setQueryData<any[]>(['classes'], (oldData) => {
        if (!oldData) return [newClass];
        return [...oldData, newClass];
      });

      reset();
      onSuccess?.();
    },
    onError: (error: any) => {
      let errorMessage = 'Failed to create class';
      
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    },
  });

  const onSubmit = (data: CreateClassFormData) => {
    createClass.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Class Name
        </label>
        <input
          {...register('name', { required: 'Name is required' })}
          type="text"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
          placeholder="Enter class name"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          {...register('description', { required: 'Description is required' })}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
          placeholder="Enter class description"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">
          Capacity
        </label>
        <input
          {...register('capacity', { 
            required: 'Capacity is required',
            min: { value: 1, message: 'Capacity must be at least 1' },
            valueAsNumber: true
          })}
          type="number"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
          placeholder="Enter capacity"
        />
        {errors.capacity && (
          <p className="mt-1 text-sm text-red-600">{errors.capacity.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="duration_minutes" className="block text-sm font-medium text-gray-700">
          Duration (minutes)
        </label>
        <input
          {...register('duration_minutes', { 
            required: 'Duration is required',
            min: { value: 15, message: 'Duration must be at least 15 minutes' },
            valueAsNumber: true
          })}
          type="number"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
          placeholder="Enter duration in minutes"
        />
        {errors.duration_minutes && (
          <p className="mt-1 text-sm text-red-600">{errors.duration_minutes.message}</p>
        )}
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</div>
      )}

      <button
        type="submit"
        disabled={createClass.isPending}
        className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {createClass.isPending ? 'Creating...' : 'Create Class'}
      </button>
    </form>
  );
} 