import { useState } from "react";
import { useEvents } from "@/hooks/useEvents";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Event } from "@/hooks/useEvents";

export const useEventActions = (
  event: Event | null,
  onEventUpdate: () => void,
  onClose: () => void
) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { updateEvent, isUpdatingEvent } = useEvents();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleUpdateEvent = async (formData: {
    title: string;
    description: string;
    date: string;
    time: string;
    type: "booking" | "task";
    assignee: string;
    category: string;
  }) => {
    if (!event || !user) return;

    try {
      await updateEvent({
        id: event.id,
        title: formData.title,
        description: formData.description,
        event_date: new Date(formData.date).toISOString(),
        event_time: formData.time,
        event_type: formData.type,
        category: formData.category,
        assignee_id: formData.assignee || null
      });

      toast({
        title: "Event updated!",
        description: "The event was updated successfully."
      });

      onEventUpdate();
      return false;
    } catch {
      toast({
        title: "Error updating event",
        description: "Could not update the event. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  const handleDeleteEvent = async () => {
    if (!event || !user) return;

    if (!window.confirm("Are you sure you want to delete this event?")) {
      return;
    }

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("events")
        .delete()
        .eq("id", event.id);

      if (error) throw error;

      toast({
        title: "Event deleted!",
        description: "The event has been deleted."
      });

      onClose();
      onEventUpdate();
      window.location.reload();
    } catch {
      toast({
        title: "Error deleting event",
        description: "Could not delete the event. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    handleUpdateEvent,
    handleDeleteEvent,
    isUpdating: isUpdatingEvent,
    isDeleting
  };
};
