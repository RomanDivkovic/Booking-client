import { Users, Calendar, CheckSquare } from "lucide-react";
import { Event } from "@/hooks/useEvents";

interface HouseholdStatsProps {
  events: Event[];
}

export const HouseholdStats = ({ events }: HouseholdStatsProps) => {
  const thisWeekEvents = events.filter((event) => {
    const eventDate = new Date(event.event_date);
    const now = new Date();
    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    return eventDate >= now && eventDate <= weekFromNow;
  });

  const pendingTasks = events.filter(
    (event) => event.event_type === "task"
  ).length;
  const upcomingBookings = events.filter(
    (event) => event.event_type === "booking"
  ).length;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Overview</h3>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                Upcoming Bookings
              </p>
              <p className="text-xs text-gray-500">This week</p>
            </div>
          </div>
          <span className="text-xl font-bold text-blue-600">
            {upcomingBookings}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckSquare className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Pending Tasks</p>
              <p className="text-xs text-gray-500">Total</p>
            </div>
          </div>
          <span className="text-xl font-bold text-green-600">
            {pendingTasks}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">This Week</p>
              <p className="text-xs text-gray-500">Events</p>
            </div>
          </div>
          <span className="text-xl font-bold text-purple-600">
            {thisWeekEvents.length}
          </span>
        </div>
      </div>
    </div>
  );
};
