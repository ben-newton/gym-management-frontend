import { CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';

export default function MemberDashboard() {
    const upcomingBookings = [
        {
            id: 1,
            className: 'Yoga Basics',
            instructor: 'Jane Smith',
            date: 'Today',
            time: '10:00 AM',
        },
        {
            id: 2,
            className: 'HIIT Training',
            instructor: 'John Doe',
            date: 'Tomorrow',
            time: '09:00 AM',
        },
    ];

    return (
        <div className="space-y-6">
            <div className="bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                        My Upcoming Classes
                    </h3>
                    <div className="mt-5 space-y-4">
                        {upcomingBookings.map((booking) => (
                            <div
                                key={booking.id}
                                className="border rounded-lg p-4"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-900">
                                            {booking.className}
                                        </h4>
                                        <p className="text-sm text-gray-500">
                                            with {booking.instructor}
                                        </p>
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        <ClockIcon className="h-5 w-5 inline mr-1" />
                                        {booking.date}, {booking.time}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                        Quick Actions
                    </h3>
                    <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <button
                            type="button"
                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                            Book a Class
                        </button>
                        <button
                            type="button"
                            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                            <CalendarIcon className="-ml-1 mr-2 h-5 w-5 text-gray-400" />
                            View Schedule
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
} 