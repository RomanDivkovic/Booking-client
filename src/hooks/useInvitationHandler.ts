import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { useGroupInvitations } from "@/hooks/useGroupInvitations";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export const useInvitationHandler = () => {
  const [invitationId, setInvitationId] = useState<string | null>(null);
  const [invitationGroup, setInvitationGroup] = useState<{
    name: string;
    description?: string;
  } | null>(null);

  const { user } = useAuth();
  const { acceptInvitation, invitations } = useGroupInvitations();
  const { toast } = useToast();
  const location = useLocation();

  // Handle invitation links
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const inviteId = urlParams.get("invite");

    if (inviteId) {
      setInvitationId(inviteId);

      // Find the invitation details
      const invitation = invitations.find((inv) => inv.id === inviteId);
      if (invitation) {
        setInvitationGroup(invitation.group);
      }
    }
  }, [location.search, invitations]);

  // Handle invitation acceptance after successful auth
  const handleAcceptInvitation = useCallback(async () => {
    if (!invitationId) return;

    const result = await acceptInvitation(invitationId);

    if (result.error) {
      toast({
        title: "Could not accept invitation",
        description: result.error,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Welcome to the group!",
        description: `You have successfully joined ${invitationGroup?.name || "the group"}.`
      });
      // Clear invitation state
      setInvitationId(null);
      setInvitationGroup(null);
    }
  }, [invitationId, acceptInvitation, toast, invitationGroup?.name]);

  useEffect(() => {
    if (user && invitationId) {
      handleAcceptInvitation();
    }
  }, [user, invitationId, handleAcceptInvitation]);

  const clearInvitation = () => {
    setInvitationId(null);
    setInvitationGroup(null);
  };

  return {
    invitationId,
    invitationGroup,
    clearInvitation
  };
};
