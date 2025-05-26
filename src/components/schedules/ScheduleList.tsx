import { useAuth } from '@/hooks/useAuth';
import { useSchedules } from '@/hooks/useQueries';
import { format } from 'date-fns';
import { UserRole, ClassSchedule } from '@/types/api';
import { CalendarIcon, ClockIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function ScheduleList() {
  const { user } = useAuth();
  const { data: schedules, isLoading } = useSchedules();
  const [showPast, setShowPast] = useState(false);

  if (!user) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  const now = new Date();
  
  const filteredSchedules = schedules?.filter((schedule: ClassSchedule) => {
    // First filter by role
    const roleFilter = 
      user.role === UserRole.MANAGEMENT ||
      (user.role === UserRole.INSTRUCTOR && schedule.instructor_id === user.id);
    
    if (!roleFilter) return false;
    
    // Then filter by date if needed
    if (!showPast) {
      return new Date(schedule.start_time) >= now;
    }
    
    return true;
  }).sort((a: ClassSchedule, b: ClassSchedule) => {
    // Sort by date, most recent first
    return new Date(a.start_time).getTime() - new Date(b.start_time).getTime();
  });

  if (!filteredSchedules?.length) {
    return (
      <div className="text-center py-12 bg-white shadow rounded-lg">
        <p className="text-gray-500">No scheduled classes found</p>
        {!showPast && (
          <button
            onClick={() => setShowPast(true)}
            className="mt-4 text-sm text-indigo-600 hover:text-indigo-500"
          >
            Show past schedules
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Scheduled Classes</h3>
        <div className="flex items-center">
          <label className="mr-2 text-sm text-gray-500">
            <input
              type="checkbox"
              checked={showPast}
              onChange={() => setShowPast(!showPast)}
              className="mr-1"
            />
            Show past schedules
          </label>
        </div>
      </div>
      <ul className="divide-y divide-gray-200">
        {filteredSchedules.map((schedule: ClassSchedule) => {
          const isPast = new Date(schedule.end_time) < now;
          
          return (
            <li 
              key={schedule.id} 
              className={`p-4 ${isPast ? 'opacity-60' : ''}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    <h4 className="text-lg font-medium text-gray-900">{schedule.class.name}</h4>
                    {user.role === UserRole.MANAGEMENT && (
                      <span className="ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Instructor: {schedule.instructor.first_name} {schedule.instructor.last_name}
                      </span>
                    )}
                    {isPast && (
                      <span className="ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                        Past
                      </span>
                    )}
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <CalendarIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                    {format(new Date(schedule.start_time), 'MMMM d, yyyy')}
                    <ClockIcon className="ml-4 mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                    {format(new Date(schedule.start_time), 'h:mm a')} - 
                    {format(new Date(schedule.end_time), 'h:mm a')}
                    <div className="ml-4 flex items-center">
                      <UserGroupIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                      <span className={schedule.bookings_count >= schedule.class.capacity ? 'text-red-500 font-medium' : ''}>
                        {schedule.bookings_count || 0} / {schedule.class.capacity}
                      </span>
                    </div>
                    <span className="ml-4 text-sm text-gray-500">
                      Location: {schedule.location}
                    </span>
                  </div>
                </div>
                <div className="ml-4 flex items-center space-x-2">
                  {user.role === UserRole.INSTRUCTOR && schedule.instructor_id !== user.id && !isPast && (
                    <button
                      type="button"
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Offer to Substitute
                    </button>
                  )}
                  {(user.role === UserRole.MANAGEMENT || schedule.instructor_id === user.id) && !isPast && (
                    <button
                      type="button"
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Manage Class
                    </button>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
} 