import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useGroup } from "@/contexts/GroupContext";
import { useEffect } from "react";

export interface Event {
  id: string;
  created_at: string;
  title: string;
  description?: string;
  event_date: string;
  event_time?: string;
  event_type: "booking" | "task";
  created_by: string;
  assignee_id?: string;
  group_id: string;
  category?: string;
  assignee?: {
    full_name: string;
    email: string;
  };
}

interface RawEventData {
  id: string;
  created_at: string;
  title: string;
  description?: string;
  event_date: string;
  event_time?: string;
  event_type: string;
  created_by: string;
  assignee_id?: string;
  group_id: string;
  category?: string;
  assignee?: {
    id: string;
    full_name: string;
    email: string;
  }[];
}

const fetchEvents = async (
  userId: string | undefined,
  activeGroupId: string | null
) => {
  if (!userId) {
    return [];
  }

  try {
    // Get all events the user can access (RLS will filter appropriately)
    const { data, error } = await supabase.from("events").select(`
        id,
        created_at,
        title,
        description,
        event_date,
        event_time,
        event_type,
        created_by,
        assignee_id,
        group_id,
        category,
        assignee:profiles!events_assignee_id_fkey(id, full_name, email)
      `);

    if (error) {
      throw new Error(error.message);
    }

    // Filter by active group if specified
    let filteredData = data || [];
    if (activeGroupId) {
      filteredData = filteredData.filter(
        (event: { group_id: string }) => event.group_id === activeGroupId
      );
    }

    return filteredData.map(
      (event: RawEventData): Event => ({
        ...event,
        event_type: event.event_type as "booking" | "task",
        assignee:
          event.assignee && event.assignee.length > 0
            ? {
                full_name: event.assignee[0].full_name,
                email: event.assignee[0].email
              }
            : undefined
      })
    );
  } catch {
    return [];
  }
};

export const useEvents = () => {
  const { user } = useAuth();
  const { activeGroup } = useGroup();
  const queryClient = useQueryClient();

  const {
    data: events,
    isLoading,
    isError,
    refetch
  } = useQuery<Event[]>({
    // The query key now depends on the active group, so it refetches on change
    queryKey: ["events", activeGroup?.id ?? "personal-overview", user?.id],
    queryFn: () => fetchEvents(user?.id, activeGroup?.id ?? null),
    enabled: !!user // Simplified: just check if user exists, don't require groups
  });

  const createEventMutation = useMutation({
    mutationFn: async (
      eventData: Omit<Event, "id" | "created_by" | "assignee" | "created_at">
    ) => {
      if (!user) throw new Error("Not authenticated");
      if (!eventData.group_id)
        throw new Error("Group ID is required to create an event");

      const { data, error } = await supabase
        .from("events")
        .insert({
          ...eventData,
          created_by: user.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidate the events query to refetch data
      queryClient.invalidateQueries({ queryKey: ["events"] });
    }
  });

  const updateEventMutation = useMutation({
    mutationFn: async (
      eventData: { id: string } & Partial<
        Omit<Event, "id" | "created_by" | "assignee" | "created_at">
      >
    ) => {
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("events")
        .update({
          ...eventData,
          updated_at: new Date().toISOString()
        })
        .eq("id", eventData.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    }
  });
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("events-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "events" },
        () => {
          // Invalidate query to trigger a refetch
          queryClient.invalidateQueries({ queryKey: ["events"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);

  return {
    events: events || [],
    isLoading,
    isError,
    createEvent: createEventMutation.mutateAsync,
    updateEvent: updateEventMutation.mutateAsync,
    isUpdatingEvent: updateEventMutation.isPending,
    refetch
  };
};
