import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEvents } from "@/hooks/useEvents";
import { Event } from "@/hooks/useEvents";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  addWeeks,
  subWeeks
} from "date-fns";
import { CalendarDaySkeleton } from "./SkeletonLoaders";

interface CalendarViewProps {
  groupId: string;
  onEventClick?: (event: Event) => void;
  onDateClick?: (date: Date) => void;
  loading?: boolean;
  optimisticEvents?: Event[];
}

export const CalendarView = ({
  groupId,
  onEventClick,
  onDateClick,
  loading: externalLoading = false,
  optimisticEvents = []
}: CalendarViewProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"month" | "week">("month");

  const { events, loading } = useEvents(groupId);
  const isLoading =
    typeof externalLoading === "boolean" ? externalLoading : loading;
  const allEvents = [...events, ...optimisticEvents];

  // Get days based on current view
  const getDaysForView = () => {
    if (view === "month") {
      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(currentDate);
      const daysInMonth = eachDayOfInterval({
        start: monthStart,
        end: monthEnd
      });

      // Add padding days to fill the calendar grid
      const startPadding = monthStart.getDay();
      const endPadding = 6 - monthEnd.getDay();
      const paddingDays = [];

      // Add days from previous month
      for (let i = startPadding - 1; i >= 0; i--) {
        paddingDays.push(
          subMonths(currentDate, 1).setDate(monthStart.getDate() - i - 1)
        );
      }

      // Add days from next month
      for (let i = 1; i <= endPadding; i++) {
        paddingDays.push(addMonths(currentDate, 1).setDate(i));
      }

      return [...paddingDays, ...daysInMonth.map((day) => day.getTime())];
    } else {
      // Week view
      const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday start
      const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
      const daysInWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });
      return daysInWeek.map((day) => day.getTime());
    }
  };

  const allDays = getDaysForView();

  const getEventsForDay = (date: Date) => {
    return allEvents.filter((event) =>
      isSameDay(new Date(event.event_date), date)
    );
  };

  const handleDayClick = (date: Date) => {
    if (onDateClick) onDateClick(date);
  };

  const handleEventClick = (event: Event) => {
    if (onEventClick) onEventClick(event);
  };

  const goToPrevious = () => {
    if (view === "month") {
      setCurrentDate(subMonths(currentDate, 1));
    } else {
      setCurrentDate(subWeeks(currentDate, 1));
    }
  };

  const goToNext = () => {
    if (view === "month") {
      setCurrentDate(addMonths(currentDate, 1));
    } else {
      setCurrentDate(addWeeks(currentDate, 1));
    }
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getViewTitle = () => {
    if (view === "month") {
      return format(currentDate, "MMMM yyyy");
    } else {
      const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
      return `${format(weekStart, "MMM d")} - ${format(weekEnd, "MMM d, yyyy")}`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={goToPrevious}
            className="sm:w-auto w-full"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <h2 className="text-2xl font-bold text-gray-900">{getViewTitle()}</h2>
          <Button
            variant="outline"
            onClick={goToNext}
            className="sm:w-auto w-full"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-2 w-full sm:w-auto">
          <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1 w-full sm:w-auto">
            <Button
              variant={view === "month" ? "default" : "ghost"}
              size="sm"
              onClick={() => setView("month")}
              className="text-xs w-full sm:w-auto"
            >
              Month
            </Button>
            <Button
              variant={view === "week" ? "default" : "ghost"}
              size="sm"
              onClick={() => setView("week")}
              className="text-xs w-full sm:w-auto"
            >
              Week
            </Button>
          </div>
          <Button
            variant="outline"
            onClick={goToToday}
            className="w-full sm:w-auto"
          >
            Today
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <Card>
        <CardContent className="p-6">
          {/* Day Headers */}
          <div
            className={`grid gap-1 mb-2 ${view === "month" ? "grid-cols-7" : "grid-cols-7"}`}
          >
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <div
                key={day}
                className="text-center text-sm font-medium text-gray-500 py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div
            className={`grid gap-1 ${view === "month" ? "grid-cols-7" : "grid-cols-7"}`}
          >
            {isLoading
              ? // Show skeleton loaders while loading
                Array.from({ length: view === "month" ? 42 : 7 }).map(
                  (_, i) => <CalendarDaySkeleton key={i} />
                )
              : allDays.map((dayTimestamp, index) => {
                  const day = new Date(dayTimestamp);
                  const dayEvents = getEventsForDay(day);
                  const isCurrentMonth =
                    view === "month" ? isSameMonth(day, currentDate) : true;
                  const isToday = isSameDay(day, new Date());

                  // Check if this day has an optimistic event
                  const hasOptimistic = dayEvents.some(
                    (event) => (event as any).optimistic
                  );
                  return (
                    <div
                      key={index}
                      className={`
                      min-h-[120px] p-2 border rounded-lg cursor-pointer transition-colors
                      ${isCurrentMonth ? "bg-white" : "bg-gray-50"}
                      ${isToday ? "border-blue-500 bg-blue-50" : "border-gray-200"}
                      hover:bg-gray-50 hover:border-gray-300
                    `}
                      onClick={() => handleDayClick(day)}
                    >
                      <div
                        className={`
                      text-sm font-medium mb-1
                      ${isCurrentMonth ? "text-gray-900" : "text-gray-400"}
                      ${isToday ? "text-blue-600" : ""}
                    `}
                      >
                        {format(day, "d")}
                      </div>

                      <div className="space-y-1">
                        {hasOptimistic && (
                          <div className="mb-1">
                            <CalendarDaySkeleton />
                          </div>
                        )}
                        {dayEvents.slice(0, 3).map((event) => (
                          <div
                            key={event.id}
                            className={`
                            text-xs p-1 rounded truncate cursor-pointer
                            ${
                              event.event_type === "booking"
                                ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                                : "bg-green-100 text-green-800 hover:bg-green-200"
                            }
                          `}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEventClick(event);
                            }}
                          >
                            {event.title}
                          </div>
                        ))}
                        {dayEvents.length > 3 && (
                          <div className="text-xs text-gray-500 text-center">
                            +{dayEvents.length - 3} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
