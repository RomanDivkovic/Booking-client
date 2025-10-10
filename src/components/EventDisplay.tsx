import React from "react";
import { Calendar, Clock, User, Tag } from "lucide-react";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { Event } from "@/hooks/useEvents";

interface EventDisplayProps {
  event: Event;
}

export const EventDisplay: React.FC<EventDisplayProps> = ({ event }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {event.title}
        </h3>
        {event.description && (
          <p className="text-gray-600">{event.description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">
            {format(new Date(event.event_date), "EEEE dd MMMM yyyy", {
              locale: sv
            })}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">at {event.event_time}</span>
        </div>

        <div className="flex items-center space-x-2">
          <Tag className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">{event.category}</span>
        </div>

        <div className="flex items-center space-x-2">
          <User className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">
            {event.assignee?.full_name || "No assignee"}
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            event.event_type === "booking"
              ? "bg-blue-100 text-blue-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {event.event_type === "booking" ? "📅 Booking" : "✅ Task"}
        </span>
      </div>
    </div>
  );
};
