import { useState } from 'react';
import { PlusIcon, UserGroupIcon, CalendarIcon, ClipboardIcon } from '@heroicons/react/24/outline';
import { useUsers, useClasses, useSchedules } from '@/hooks/useQueries';
import CreateClassModal from '../classes/CreateClassModal';
import ClassList from '../classes/ClassList';
import type { ClassSchedule } from '@/types/api';

export default function ManagementDashboard() {
    const [isCreateClassModalOpen, setIsCreateClassModalOpen] = useState(false);
    const { data: users, isLoading: usersLoading } = useUsers();
    const { data: classes, isLoading: classesLoading } = useClasses();
    const { data: schedules, isLoading: schedulesLoading } = useSchedules();

    const stats = [
        {
            name: 'Total Members',
            value: users?.filter(u => u.role === 'member').length ?? '-',
            icon: UserGroupIcon,
        },
        {
            name: 'Active Classes',
            value: classes?.length ?? '-',
            icon: ClipboardIcon,
        },
        {
            name: 'This Week\'s Sessions',
            value: schedules?.filter((s: ClassSchedule) => {
                const date = new Date(s.start_time);
                const now = new Date();
                const weekFromNow = new Date();
                weekFromNow.setDate(now.getDate() + 7);
                return date >= now && date <= weekFromNow;
            }).length ?? '-',
            icon: CalendarIcon,
        },
    ];

    if (usersLoading || classesLoading || schedulesLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
            </div>
        );
    }

    return (
        <>
            <div className="space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {stats.map((stat) => (
                        <div
                            key={stat.name}
                            className="bg-white overflow-hidden shadow rounded-lg"
                        >
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <stat.icon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                {stat.name}
                                            </dt>
                                            <dd className="text-lg font-medium text-gray-900">
                                                {stat.value}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="bg-white shadow sm:rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">
                            Quick Actions
                        </h3>
                        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <button
                                type="button"
                                onClick={() => setIsCreateClassModalOpen(true)}
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                                Create New Class
                            </button>
                            <button
                                type="button"
                                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                <CalendarIcon className="-ml-1 mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                                Manage Schedule
                            </button>
                        </div>
                    </div>
                </div>

                {/* Class List */}
                <ClassList />
            </div>

            <CreateClassModal 
                isOpen={isCreateClassModalOpen}
                onClose={() => setIsCreateClassModalOpen(false)}
            />
        </>
    );
} 