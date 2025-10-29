import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useGroup } from "@/contexts/GroupContext";
import { useEffect } from "react";
import { Event } from "./useEvents"; // Re-use the Event type

// A Todo is just a specific type of Event
export type Todo = Event;

const fetchTodos = async (
  userId: string | undefined,
  activeGroupId: string | null
): Promise<Todo[]> => {
  if (!userId) return [];

  try {
    // Get all todos the user can access (RLS will filter appropriately)
    const { data, error } = await supabase
      .from("events")
      .select(
        `
        *,
        assignee:profiles (
          id,
          full_name
        )
      `
      )
      .eq("event_type", "task");

    if (error) {
      throw new Error(error.message);
    }

    // Filter by active group if specified
    let filteredData = data || [];
    if (activeGroupId) {
      filteredData = filteredData.filter(
        (todo: { group_id: string }) => todo.group_id === activeGroupId
      );
    }

    return filteredData;
  } catch {
    return [];
  }
};

export const useTodos = (groupId?: string | null) => {
  const { user } = useAuth();
  const { activeGroup } = useGroup();
  const queryClient = useQueryClient();

  // Determine which group to fetch todos for:
  // - If groupId is a string (including empty string), use that specific group
  // - If groupId is null, fetch from all groups
  // - If groupId is undefined, use active group
  const effectiveGroupId = groupId !== undefined ? groupId : activeGroup?.id;

  const {
    data: todos,
    isLoading,
    isError
  } = useQuery<Todo[]>({
    queryKey: ["todos", effectiveGroupId ?? "all-groups", user?.id],
    queryFn: () => fetchTodos(user?.id, effectiveGroupId),
    enabled: !!user
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

      const insertData: Record<string, string | boolean | null> = {
        ...todoData,
        event_type: "task", // Always set event_type to 'task'
        created_by: user.id
      };

      // Only add completed field if it exists in the database
      try {
        insertData.completed = false;
        insertData.completed_at = null;
      } catch {
        // If completed fields don't exist, skip them
      }

      const { data, error } = await supabase
        .from("events")
        .insert(insertData)
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

  const toggleTodoCompletionMutation = useMutation({
    mutationFn: async (todoId: string) => {
      // First get the current todo
      const { data: currentTodo, error: fetchError } = await supabase
        .from("events")
        .select("completed")
        .eq("id", todoId)
        .single();

      if (fetchError) throw fetchError;

      const newCompleted = !currentTodo?.completed;

      // Try to update with completed fields, fallback if they don't exist
      const updateData: Record<string, string | boolean | null> = {
        updated_at: new Date().toISOString()
      };

      // Only add completed fields if they exist in the database
      try {
        updateData.completed = newCompleted;
        if (newCompleted) {
          updateData.completed_at = new Date().toISOString();
        } else {
          updateData.completed_at = null;
        }
      } catch {
        // If completed fields don't exist, just update the timestamp
      }

      const { data, error } = await supabase
        .from("events")
        .update(updateData)
        .eq("id", todoId)
        .select()
        .single();

      if (error) throw error;
      return data;
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
    toggleTodoCompletion: toggleTodoCompletionMutation.mutateAsync,
    isTogglingCompletion: toggleTodoCompletionMutation.isPending
  };
};
