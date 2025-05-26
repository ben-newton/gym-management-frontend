import { useClasses } from '@/hooks/useQueries';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function ClassList() {
  const { data: classes, isLoading } = useClasses();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (!classes?.length) {
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
          {classes.map((class_) => (
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
                  <button
                    type="button"
                    className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <PencilIcon className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-red-500 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <TrashIcon className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
} 