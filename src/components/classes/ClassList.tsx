import { useState } from 'react';
import { useClasses } from '@/hooks/useQueries';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/hooks/useAuth';
import { UserRole, Class } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { classes } from '@/utils/api/classes';
import Modal from '../common/Modal';

export default function ClassList() {
  const { data: classList, isLoading } = useClasses();
  const { user } = useAuth();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<{ id: number, name: string } | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  
  const queryClient = useQueryClient();
  const canManageClasses = user?.role === UserRole.MANAGEMENT;

  const deleteClass = useMutation({
    mutationFn: (classId: number) => {
      return classes.deleteClass(classId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      setDeleteModalOpen(false);
      setSelectedClass(null);
      setDeleteError(null);
    },
    onError: (error: any) => {
      setDeleteError(error.response?.data?.detail || 'Failed to delete class');
    },
  });

  const handleDeleteClick = (classId: number, className: string) => {
    setSelectedClass({ id: classId, name: className });
    setDeleteModalOpen(true);
    setDeleteError(null);
  };

  const confirmDelete = () => {
    if (selectedClass) {
      deleteClass.mutate(selectedClass.id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (!classList?.length) {
    return (
      <div className="text-center py-12 bg-white shadow rounded-lg">
        <p className="text-gray-500">No classes found</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Classes</h3>
      </div>
      <div className="border-t border-gray-200">
        <ul role="list" className="divide-y divide-gray-200">
          {classList.map((class_: Class) => (
            <li key={class_.id} className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-indigo-600 truncate">
                      {class_.name}
                    </p>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Capacity: {class_.capacity}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">
                      {class_.description}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      Duration: {class_.duration_minutes} minutes
                    </p>
                  </div>
                </div>
                <div className="ml-6 flex items-center space-x-3">
                  {canManageClasses && (
                    <>
                      <button
                        type="button"
                        className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <PencilIcon className="h-4 w-4" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteClick(class_.id, class_.name)}
                        className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-red-500 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <TrashIcon className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedClass(null);
          setDeleteError(null);
        }}
        title="Delete Class"
      >
        <div className="p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Delete Class</h3>
          <p className="text-sm text-gray-500 mb-4">
            Are you sure you want to delete the class "{selectedClass?.name}"? This action cannot be undone and will remove all scheduled instances of this class.
          </p>
          
          {deleteError && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded mb-4">
              {deleteError}
            </div>
          )}
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => {
                setDeleteModalOpen(false);
                setSelectedClass(null);
              }}
              className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={confirmDelete}
              disabled={deleteClass.isPending}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
            >
              {deleteClass.isPending ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
} 