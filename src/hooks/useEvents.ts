import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useGroup } from "@/contexts/GroupContext";
import { useEffect } from "react";
import { useGroups } from "./useGroups";

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

const fetchEvents = async (
  userId: string | undefined,
  activeGroupId: string | null,
  allGroupIds: string[]
) => {
  if (!userId) return [];

  // This join assumes you have a 'profiles' table with 'id' and 'full_name'
  let query = supabase.from("events").select(`
    *,
    assignee:profiles (
      id,
      full_name
    )
  `);

  if (activeGroupId) {
    // Fetch events for the single active group
    query = query.eq("group_id", activeGroupId);
  } else {
    // Fetch events for all groups the user is a member of (Personal Overview)
    if (allGroupIds.length === 0) return []; // No groups to fetch from
    query = query.in("group_id", allGroupIds);
  }

  const { data, error } = await query.order("event_date", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data || []).map((event) => ({
    ...event,
    event_type: event.event_type as "booking" | "task"
  }));
};

export const useEvents = () => {
  const { user } = useAuth();
  const { activeGroup } = useGroup();
  const { groups } = useGroups(); // Get all groups the user is part of
  const queryClient = useQueryClient();

  const allGroupIds = groups?.map((g) => g.id) || [];

  const {
    data: events,
    isLoading,
    isError,
    refetch
  } = useQuery<Event[]>({
    // The query key now depends on the active group, so it refetches on change
    queryKey: ["events", activeGroup?.id ?? "personal-overview", user?.id],
    queryFn: () => fetchEvents(user?.id, activeGroup?.id ?? null, allGroupIds),
    enabled: !!user && (!!activeGroup || allGroupIds.length > 0)
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

  // Real-time subscription
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
    refetch
  };
};
