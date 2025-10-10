import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { GroupMember } from "@/types/group";

/**
 * Hook for managing group members
 */
export const useGroupMembers = () => {
  const { user } = useAuth();

  const getGroupMembers = useCallback(
    async (groupId: string): Promise<GroupMember[]> => {
      if (!user) return [];

      try {
        // First get member IDs
        const { data: members } = await supabase
          .from("group_members")
          .select("user_id, role")
          .eq("group_id", groupId);

        if (!members || members.length === 0) return [];

        // Then get profile data for each member
        const userIds = members.map((m) => m.user_id);
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, full_name, email")
          .in("id", userIds);

        // Combine member data with profile data
        return members.map((member) => {
          const profile = profiles?.find((p) => p.id === member.user_id);
          return {
            id: member.user_id,
            full_name: profile?.full_name || "Unknown user",
            email: profile?.email || "",
            role: member.role
          };
        });
      } catch {
        return [];
      }
    },
    [user]
  );

  return {
    getGroupMembers
  };
};
