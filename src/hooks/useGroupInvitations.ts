import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { GroupInvitation } from "@/types/group";
import { generateInvitationLink } from "@/utils/groupUtils";

/**
 * Hook for managing group invitations
 */
export const useGroupInvitations = () => {
  const [invitations, setInvitations] = useState<GroupInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchInvitations = useCallback(async () => {
    if (!user) {
      setInvitations([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      // First, fetch the main invitation data
      const { data: invitationsData } = await supabase
        .from("group_invitations")
        .select("*")
        .eq("invited_email", user.email)
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (!invitationsData) {
        setInvitations([]);
        return;
      }

      // For each invitation, fetch group and inviter info separately
      const invitationsWithData = await Promise.all(
        invitationsData.map(async (invitation) => {
          const result = { ...invitation };

          // Try to fetch group info
          try {
            const { data: groupData } = await supabase
              .from("groups")
              .select("name, description")
              .eq("id", invitation.group_id)
              .maybeSingle();

            result.group = groupData || { name: "", description: null };
          } catch {
            result.group = { name: "", description: null };
          }

          // Try to fetch inviter info
          try {
            const { data: inviterData } = await supabase
              .from("profiles")
              .select("full_name, email")
              .eq("id", invitation.invited_by)
              .maybeSingle();

            result.invited_by_user = inviterData || {
              full_name: "Someone",
              email: ""
            };
          } catch {
            result.invited_by_user = {
              full_name: "Someone",
              email: ""
            };
          }

          return result;
        })
      );

      setInvitations(invitationsWithData);
    } catch {
      setInvitations([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchInvitations();

    // Set up real-time subscription for invitation changes (skip in test environment)
    try {
      const subscription = supabase
        .channel("invitations_changes")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "group_invitations",
            filter: `invited_email=eq.${user?.email}`
          },
          () => {
            fetchInvitations();
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    } catch {
      // Skip real-time subscriptions in test environment
    }
  }, [fetchInvitations, user?.email]);

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

      // Get group details for the email
      const { data: group } = await supabase
        .from("groups")
        .select("name")
        .eq("id", groupId)
        .single();

      if (group && invitation) {
        // Generate invitation link
        const inviteLink = generateInvitationLink(groupId, invitation.id);

        // Send email invitation
        try {
          const emailResponse = await fetch("/api/send-invite-email", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              to: emailLower,
              inviteLink,
              groupName: group.name,
              inviterName: user.user_metadata?.full_name || user.email
            })
          });

          if (!emailResponse.ok) {
            // Email sending failed, but invitation was created
          }
        } catch {
          // Email sending failed, but invitation was created successfully
        }
      }

      return {
        error: null,
        userExists: !!profile,
        invitationId: invitation?.id,
        message: profile
          ? "Inbjudan skickad till befintlig användare"
          : "Inbjudan skickad till ny användare"
      };
    } catch {
      return { error: "An unexpected error occurred while inviting" };
    }
  };

  const acceptInvitation = async (invitationId: string) => {
    if (!user) return { error: "Not authenticated" };

    try {
      const { data, error } = await supabase.rpc("accept_group_invitation", {
        invitation_id: invitationId
      });

      if (error || data === false) {
        return { error: "The invitation could not be accepted" };
      }

      // Refresh invitations
      await fetchInvitations();

      return { error: null };
    } catch {
      return { error: "An unexpected error occurred" };
    }
  };

  const declineInvitation = async (invitationId: string) => {
    if (!user) return { error: "Not authenticated" };

    try {
      const { data, error } = await supabase.rpc("decline_group_invitation", {
        invitation_id: invitationId
      });

      if (error || data === false) {
        return { error: "The invitation could not be declined" };
      }

      // Refresh invitations
      await fetchInvitations();

      return { error: null };
    } catch {
      return { error: "An unexpected error occurred" };
    }
  };

  return {
    invitations,
    loading,
    inviteUserToGroup,
    acceptInvitation,
    declineInvitation,
    refetchInvitations: fetchInvitations
  };
};
