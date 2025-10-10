import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarView } from "@/components/CalendarView";
import { EventModal } from "@/components/EventModal";
import { EventDetailModal } from "@/components/EventDetailModal";
import { Sidebar } from "@/components/Sidebar";
import { HouseholdStats } from "@/components/HouseholdStats";
import { GroupSelection } from "@/components/GroupSelection";
import { useAuth } from "@/contexts/AuthContext";
import { useGroup } from "@/contexts/GroupContext";
import { useEvents } from "@/hooks/useEvents";
import { useGroups } from "@/hooks/useGroups";
import { useGroupInvitations } from "@/hooks/useGroupInvitations";
import { LoadingSpinner } from "@/components/SkeletonLoaders";
import { GroupInviteModal } from "@/components/GroupInviteModal";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const { user, loading: authLoading } = useAuth();
  const { groups, loading: groupsLoading } = useGroups();
  const { inviteUserToGroup } = useGroupInvitations();
  const { activeGroup } = useGroup();
  const navigate = useNavigate();

  // State for modals and UI interaction
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  // Use the refactored useEvents hook
  const {
    events,
    isLoading: eventsLoading,
    createEvent,
    refetch
  } = useEvents();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  const handleAddEvent = async (eventData: {
    title: string;
    date: Date;
    time: string;
    type: "booking" | "task";
    assignee: string;
    description: string;
    category: string;
    groupId?: string; // Add optional groupId for personal overview
  }) => {
    const groupId = eventData.groupId || activeGroup?.id;
    if (!groupId) {
      console.error("No group selected to add an event to.");
      return;
    }
    setIsAddingEvent(true);

    try {
      await createEvent({
        title: eventData.title,
        description: eventData.description,
        event_date: eventData.date.toISOString(),
        event_time: eventData.time,
        event_type: eventData.type,
        category: eventData.category,
        assignee_id: eventData.assignee,
        group_id: groupId // Use selected group or active group
      });
      // No need to manually refetch, react-query handles it on success
      setIsModalOpen(false);
    } catch (error: unknown) {
      // No need to console.error here, react-query can handle errors globally
      // You might want to log to a service like Sentry here
      console.log(error);
    } finally {
      setIsAddingEvent(false);
    }
  };

  const handleEventUpdate = () => {
    refetch();
  };

  if (authLoading || groupsLoading) {
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
    // This case is handled by the useEffect redirect, but it's good practice
    // to have a conditional return.
    return null;
  }

  if (groups.length === 0) {
    // The GroupSelection component now likely needs to create a group
    // and then the useGroups hook will update, causing a re-render.
    return <GroupSelection />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col">
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <HouseholdStats events={events} />
            <Sidebar
              onAddClick={() => setIsModalOpen(true)}
              onInviteClick={() => setIsInviteModalOpen(true)}
            />
          </div>

          <div className="lg:col-span-3">
            <CalendarView
              // No longer needs groupId
              onEventClick={(event) => {
                setSelectedEvent(event);
                setIsDetailModalOpen(true);
              }}
              onDateClick={(date) => {
                setSelectedDate(date);
                setIsModalOpen(true);
              }}
              loading={eventsLoading || isAddingEvent}
              events={events} // Pass events directly
            />
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
        groupId={activeGroup?.id ?? ""} // Pass active group ID
        selectedDate={selectedDate}
      />

      <EventDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        event={selectedEvent}
        onEventUpdate={handleEventUpdate}
      />

      <GroupInviteModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onInvite={async (email) => {
          if (!activeGroup?.id) return { error: "No group selected" };
          const result = await inviteUserToGroup(activeGroup.id, email);
          // Hämta invitationId för länk
          if (!result.error) {
            const { data: invitations } = await supabase
              .from("group_invitations")
              .select("id")
              .eq("group_id", activeGroup.id)
              .eq("invited_email", email.toLowerCase().trim())
              .eq("status", "pending")
              .order("created_at", { ascending: false })
              .limit(1);
            if (invitations && invitations.length > 0) {
              return { ...result, invitationId: invitations[0].id };
            }
          }
          return result;
        }}
        groupName={activeGroup?.name ?? ""}
      />
    </div>
  );
};

export default Index;
