import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarView } from "@/components/CalendarView";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { EventModal } from "@/components/EventModal";
import { EventDetailModal } from "@/components/EventDetailModal";
import { Sidebar } from "@/components/Sidebar";
import { HouseholdStats } from "@/components/HouseholdStats";
import { GroupSelection } from "@/components/GroupSelection";
import { useAuth } from "@/contexts/AuthContext";
import { useEvents } from "@/hooks/useEvents";
import { useGroups } from "@/hooks/useGroups";
import { LoadingSpinner } from "@/components/SkeletonLoaders";

const Index = () => {
  const { user, loading: authLoading } = useAuth();
  const { groups, loading: groupsLoading } = useGroups();
  const navigate = useNavigate();
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const {
    events,
    loading: eventsLoading,
    createEvent,
    refetch
  } = useEvents(selectedGroupId);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    // Get selected group from localStorage or use first available group
    const storedGroupId = localStorage.getItem("selectedGroupId");
    if (storedGroupId && groups.some((g) => g.id === storedGroupId)) {
      setSelectedGroupId(storedGroupId);
    } else if (groups.length > 0) {
      setSelectedGroupId(groups[0].id);
      localStorage.setItem("selectedGroupId", groups[0].id);
    }
  }, [groups]);

  const handleGroupSelect = (groupId: string) => {
    setSelectedGroupId(groupId);
    localStorage.setItem("selectedGroupId", groupId);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="large" />
          <p className="text-gray-600 mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <LoadingSpinner size="large" />
            <p className="text-gray-600 mt-4">Loading...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (groupsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <LoadingSpinner size="large" />
            <p className="text-gray-600 mt-4">Loading your groups...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (groups.length === 0) {
    return <GroupSelection onGroupSelect={handleGroupSelect} />;
  }

  if (!selectedGroupId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <LoadingSpinner size="large" />
            <p className="text-gray-600 mt-4">Selecting group...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleAddEvent = async (eventData: {
    title: string;
    date: Date;
    time: string;
    type: "booking" | "task";
    assignee: string;
    description: string;
    category: string;
  }) => {
    const { error } = await createEvent({
      title: eventData.title,
      description: eventData.description,
      event_date: eventData.date.toISOString(),
      event_time: eventData.time,
      event_type: eventData.type,
      category: eventData.category,
      assignee_id: eventData.assignee
    });

    if (!error) {
      setIsModalOpen(false);
      // Add a small delay to show the animation
      setTimeout(() => {
        refetch();
      }, 100);
    }
  };

  const handleEventUpdate = () => {
    refetch();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col">
      <Header />

      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <HouseholdStats events={events} />
            <Sidebar onAddClick={() => setIsModalOpen(true)} />
          </div>

          <div className="lg:col-span-3">
            {eventsLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <LoadingSpinner size="large" />
                  <p className="text-gray-600 mt-4">Loading events...</p>
                </div>
              </div>
            ) : (
              <CalendarView
                groupId={selectedGroupId}
                onEventClick={(event) => {
                  setSelectedEvent(event);
                  setIsDetailModalOpen(true);
                }}
                onDateClick={(date) => {
                  setSelectedDate(date);
                  setIsModalOpen(true);
                }}
              />
            )}
          </div>
        </div>
      </div>

      <EventModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedDate(null);
        }}
        onSubmit={handleAddEvent}
        groupId={selectedGroupId}
        selectedDate={selectedDate}
      />

      <EventDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        event={selectedEvent}
        onEventUpdate={handleEventUpdate}
      />

      <Footer />
    </div>
  );
};

export default Index;
