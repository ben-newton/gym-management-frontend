import { CalendarIcon, ClockIcon, UserGroupIcon } from '@heroicons/react/24/outline';

export default function InstructorDashboard() {
    const todayClasses = [
        {
            id: 1,
            name: 'Morning Yoga',
            time: '08:00 AM',
            attendees: 12,
            maxCapacity: 15,
        },
        {
            id: 2,
            name: 'HIIT Training',
            time: '10:00 AM',
            attendees: 8,
            maxCapacity: 10,
        },
    ];

    return (
        <div className="space-y-6">
            <div className="bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                        Today's Classes
                    </h3>
                    <div className="mt-5 space-y-4">
                        {todayClasses.map((class_) => (
                            <div
                                key={class_.id}
                                className="border rounded-lg p-4 flex items-center justify-between"
                            >
                                <div className="flex items-center space-x-4">
                                    <ClockIcon className="h-6 w-6 text-gray-400" />
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-900">
                                            {class_.name}
                                        </h4>
                                        <p className="text-sm text-gray-500">{class_.time}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="text-sm text-gray-500">
                                        <UserGroupIcon className="h-5 w-5 inline mr-1" />
                                        {class_.attendees}/{class_.maxCapacity}
                                    </div>
                                    <button
                                        type="button"
                                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                        Upcoming Schedule
                    </h3>
                    <div className="mt-3">
                        <button
                            type="button"
                            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                            <CalendarIcon className="-ml-1 mr-2 h-5 w-5 text-gray-400" />
                            View Full Schedule
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
} 