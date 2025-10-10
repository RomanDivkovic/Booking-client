import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Group } from "@/types/group";

/**
 * Hook for managing groups (CRUD operations)
 */
export const useGroups = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchGroups = useCallback(async () => {
    if (!user) {
      setGroups([]);
      setLoading(false);
      return;
    }

    try {
      // Get groups created by the user (these will be visible due to RLS policy)
      const { data: createdGroups } = await supabase.from("groups").select("*");

      // Get groups where user is a member
      const { data: membershipData } = await supabase
        .from("group_members")
        .select("group_id")
        .eq("user_id", user.id);

      // Get details for groups where user is a member (but didn't create)
      const memberGroups: Group[] = [];
      if (membershipData && membershipData.length > 0) {
        const memberGroupIds = membershipData.map((m) => m.group_id);
        const nonCreatedGroupIds = memberGroupIds.filter(
          (id) => !createdGroups?.some((g) => g.id === id)
        );

        if (nonCreatedGroupIds.length > 0) {
          // We need to get these groups without RLS restrictions
          // For now, we'll skip them since RLS prevents access
        }
      }

      // Combine created groups with member groups
      const allGroups = [...(createdGroups || []), ...memberGroups];

      // Add member count to each group
      const groupsWithMemberCount = await Promise.all(
        allGroups.map(async (group) => {
          const { count } = await supabase
            .from("group_members")
            .select("*", { count: "exact", head: true })
            .eq("group_id", group.id);

          return {
            ...group,
            member_count: count || 0
          };
        })
      );

      setGroups(groupsWithMemberCount);
    } catch {
      setGroups([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const createGroup = async (name: string, description?: string) => {
    if (!user) return { error: "Not authenticated" };

    try {
      // First, ensure user has a profile
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .maybeSingle();

      if (!existingProfile) {
        const { error: profileError } = await supabase.from("profiles").insert({
          id: user.id,
          email: user.email || "",
          full_name: user.user_metadata?.full_name || user.email || ""
        });

        if (profileError) {
          return { error: "Could not create user profile" };
        }
      }

      const { data: group, error: groupError } = await supabase
        .from("groups")
        .insert({
          name: name.trim(),
          description: description?.trim() || null,
          created_by: user.id
        })
        .select()
        .single();

      if (groupError) {
        throw new Error(`Database error: ${groupError.message}`);
      }

      // Add creator as first member with admin role
      if (group) {
        const { error: memberError } = await supabase
          .from("group_members")
          .insert({
            group_id: group.id,
            user_id: user.id,
            role: "admin"
          });

        if (memberError) {
          // Try to clean up the group if member addition fails
          await supabase.from("groups").delete().eq("id", group.id);
          throw new Error("Could not add you as a member of the group");
        }
      } else {
        throw new Error("Failed to create group record.");
      }

      await fetchGroups();
      return { group, error: null };
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred while creating the group";
      return { error: errorMessage };
    }
  };

  const deleteGroup = async (groupId: string) => {
    if (!user) return { error: "Not authenticated" };

    try {
      // Use RPC function to delete group
      const { data, error } = await supabase.rpc("delete_group", {
        group_id: groupId
      });

      if (error) {
        throw error;
      }

      if (!data) {
        return { error: "Failed to delete group" };
      }

      // Refresh the groups list
      await fetchGroups();

      return { error: null };
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred while deleting the group.";
      return { error: errorMessage };
    }
  };

  return {
    groups,
    loading,
    createGroup,
    deleteGroup,
    refetch: fetchGroups
  };
};
