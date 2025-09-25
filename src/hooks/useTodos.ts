import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useGroup } from "@/contexts/GroupContext";
import { useGroups } from "./useGroups";
import { useEffect } from "react";
import { Event } from "./useEvents"; // Re-use the Event type

// A Todo is just a specific type of Event
export type Todo = Event;

const fetchTodos = async (
  userId: string | undefined,
  activeGroupId: string | null,
  allGroupIds: string[]
): Promise<Todo[]> => {
  if (!userId) return [];

  let query = supabase.from("events").select(`
    *,
    assignee:profiles (
      id,
      full_name
    )
  `);

  // Always filter for tasks
  query = query.eq("event_type", "task");

  if (activeGroupId) {
    // Fetch todos for the single active group
    query = query.eq("group_id", activeGroupId);
  } else {
    // Fetch todos for all groups the user is a member of (Personal Overview)
    if (allGroupIds.length === 0) return []; // No groups to fetch from
    query = query.in("group_id", allGroupIds);
  }

  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
};

export const useTodos = () => {
  const { user } = useAuth();
  const { activeGroup } = useGroup();
  const { groups } = useGroups();
  const queryClient = useQueryClient();

  const allGroupIds = groups?.map((g) => g.id) || [];

  const {
    data: todos,
    isLoading,
    isError
  } = useQuery<Todo[]>({
    queryKey: ["todos", activeGroup?.id ?? "personal-overview", user?.id],
    queryFn: () => fetchTodos(user?.id, activeGroup?.id ?? null, allGroupIds),
    enabled: !!user && (!!activeGroup || allGroupIds.length > 0)
  });

  const createTodoMutation = useMutation({
    mutationFn: async (
      todoData: Omit<
        Todo,
        "id" | "created_by" | "assignee" | "created_at" | "event_type"
      >
    ) => {
      if (!user) throw new Error("Not authenticated");
      if (!todoData.group_id)
        throw new Error("Group ID is required to create a todo");

      const { data, error } = await supabase
        .from("events")
        .insert({
          ...todoData,
          event_type: "task", // Always set event_type to 'task'
          created_by: user.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      queryClient.invalidateQueries({ queryKey: ["events"] }); // Also invalidate events
    }
  });

  const deleteTodoMutation = useMutation({
    mutationFn: async (todoId: string) => {
      const { error } = await supabase.from("events").delete().eq("id", todoId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    }
  });

  // Real-time subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("todos-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "events",
          filter: "event_type=eq.task"
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["todos"] });
          queryClient.invalidateQueries({ queryKey: ["events"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);

  return {
    todos: todos || [],
    isLoading,
    isError,
    createTodo: createTodoMutation.mutateAsync,
    isCreatingTodo: createTodoMutation.isPending,
    deleteTodo: deleteTodoMutation.mutateAsync,
    isDeletingTodo: deleteTodoMutation.isPending
  };
};
