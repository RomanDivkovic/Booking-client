import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Group {
  id: string;
  name: string;
  description: string | null;
  created_by: string;
  created_at: string;
  member_count?: number;
}

export interface GroupInvitation {
  id: string;
  group_id: string;
  invited_user_id: string;
  invited_by: string;
  status: "pending" | "accepted" | "declined";
  created_at: string;
  updated_at: string;
  group?: {
    name: string;
    description: string | null;
  };
  invited_by_user?: {
    full_name: string;
    email: string;
  };
}

export const useGroups = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [invitations, setInvitations] = useState<GroupInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchGroups = async () => {
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
    } catch (error) {
      console.log(error);
      setGroups([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchInvitations = async () => {
    if (!user) {
      setInvitations([]);
      return;
    }

    try {
      const { data: invitationsData } = await supabase
        .from("group_invitations")
        .select(
          `
          *,
          group:group_id(name, description),
          invited_by_user:invited_by(full_name, email)
        `
        )
        .eq("invited_email", user.email)
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      setInvitations(invitationsData || []);
    } catch (error) {
      console.log(error);
      setInvitations([]);
    }
  };

  useEffect(() => {
    fetchGroups();
    fetchInvitations();
  }, [user]);

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

  const inviteUserToGroup = async (groupId: string, email: string) => {
    if (!user) return { error: "Not authenticated" };

    try {
      const emailLower = email.toLowerCase().trim();

      // Check if user exists in profiles
      const { data: profile } = await supabase
        .from("profiles")
        .select("id, email")
        .eq("email", emailLower)
        .maybeSingle();

      // Check if user is already a member
      if (profile) {
        const { data: existingMember } = await supabase
          .from("group_members")
          .select("id")
          .eq("group_id", groupId)
          .eq("user_id", profile.id)
          .maybeSingle();

        if (existingMember) {
          return { error: "The user is already a member of the group" };
        }
      }

      // Check if there's already a pending invitation for this email
      const { data: existingInvitation } = await supabase
        .from("group_invitations")
        .select("id")
        .eq("group_id", groupId)
        .eq("invited_email", emailLower)
        .eq("status", "pending")
        .maybeSingle();

      if (existingInvitation) {
        return { error: "An invitation for this email already exists" };
      }

      // Create invitation
      const { data: invitation, error: inviteError } = await supabase
        .from("group_invitations")
        .insert({
          group_id: groupId,
          invited_user_id: profile?.id || null,
          invited_email: emailLower,
          invited_by: user.id
        })
        .select()
        .single();

      if (inviteError) {
        return { error: "Could not create invitation" };
      }

      // If user doesn't exist, we could send an email here
      // For now, just return success
      return {
        error: null,
        userExists: !!profile,
        invitationId: invitation?.id,
        message: profile
          ? "Inbjudan skickad till befintlig användare"
          : "Inbjudan skapad för ny användare"
      };
    } catch {
      return { error: "An unexpected error occurred while inviting" };
    }
  };

  // const generateInvitationLink = (groupId: string, invitationId: string) => {
  //   const baseUrl = window.location.origin;
  //   return `${baseUrl}/auth?invite=${invitationId}`;
  // };

  // const copyInvitationLink = async (groupId: string, invitationId: string) => {
  //   const link = generateInvitationLink(groupId, invitationId);
  //   try {
  //     await navigator.clipboard.writeText(link);
  //     return { success: true, link };
  //   } catch (error) {
  //     return { success: false, error: "Kunde inte kopiera länken" };
  //   }
  // };

  const acceptInvitation = async (invitationId: string) => {
    if (!user) return { error: "Not authenticated" };

    try {
      const { data } = await supabase.rpc("accept_group_invitation", {
        invitation_id: invitationId
      });

      if (!data) {
        return { error: "The invitation could not be accepted" };
      }

      // Refresh groups and invitations
      await fetchGroups();
      await fetchInvitations();

      return { error: null };
    } catch (error) {
      console.log(error);
      return { error: "An unexpected error occurred" };
    }
  };

  const declineInvitation = async (invitationId: string) => {
    if (!user) return { error: "Not authenticated" };

    try {
      const { data } = await supabase.rpc("decline_group_invitation", {
        invitation_id: invitationId
      });

      if (!data) {
        return { error: "The invitation could not be declined" };
      }

      // Refresh invitations
      await fetchInvitations();

      return { error: null };
    } catch (error) {
      console.log(error);
      return { error: "An unexpected error occurred" };
    }
  };

  const getGroupMembers = useCallback(
    async (groupId: string) => {
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
      } catch (error) {
        console.log(error);
        return [];
      }
    },
    [user]
  );

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
    invitations,
    loading,
    createGroup,
    inviteUserToGroup,
    acceptInvitation,
    declineInvitation,
    getGroupMembers,
    deleteGroup,
    refetch: fetchGroups,
    refetchInvitations: fetchInvitations
  };
};
