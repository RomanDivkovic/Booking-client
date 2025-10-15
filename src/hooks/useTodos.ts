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

  let query = supabase.from("events").select(`
    *,
    assignee:profiles (
      id,
      full_name
    )
  `);

  // Always filter for tasks
  query = query.eq("event_type", "task");

  if (activeGroupId !== null && activeGroupId !== "") {
    // Fetch todos for the specific group
    query = query.eq("group_id", activeGroupId);
  } else {
    // Fetch todos for all groups the user can access (created or member of)
    // Get groups created by user
    const { data: createdGroups } = await supabase
      .from("groups")
      .select("id")
      .eq("created_by", userId);

    // Get groups where user is a member
    const { data: memberGroups } = await supabase
      .from("group_members")
      .select("group_id")
      .eq("user_id", userId);

    const createdGroupIds = createdGroups?.map((g) => g.id) || [];
    const memberGroupIds = memberGroups?.map((g) => g.group_id) || [];
    const allGroupIds = [...new Set([...createdGroupIds, ...memberGroupIds])];

    if (allGroupIds.length === 0) {
      // If user has no groups, return empty array
      return [];
    }

    query = query.in("group_id", allGroupIds);
  }

  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
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
