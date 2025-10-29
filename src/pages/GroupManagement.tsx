import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useGroup } from "@/contexts/GroupContext";
import { supabase } from "@/integrations/supabase/client";
import { Users, UserPlus, Trash2, Crown, Mail } from "lucide-react";
import { LoadingSpinner } from "@/components/SkeletonLoaders";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";

interface GroupMember {
  id: string;
  user_id: string;
  role: string;
  joined_at: string;
  profiles: {
    id: string;
    email: string;
    full_name: string;
  } | null;
}

export default function GroupManagement() {
  const { user } = useAuth();
  const { activeGroup } = useGroup();
  const { toast } = useToast();
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviting, setInviting] = useState(false);
  const [removingMember, setRemovingMember] = useState<string | null>(null);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);

  const isAdmin = activeGroup?.created_by === user?.id;

  const fetchMembers = useCallback(async () => {
    if (!activeGroup) return;

    try {
      const { data, error } = await supabase
        .from("group_members")
        .select(
          `
          id,
          user_id,
          role,
          joined_at,
          profiles (
            id,
            email,
            full_name
          )
        `
        )
        .eq("group_id", activeGroup.id)
        .order("joined_at", { ascending: true });

      if (error) throw error;
      setMembers(data || []);
    } catch {
      toast({
        title: "Error",
        description: "Failed to load group members.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [activeGroup, toast]);

  useEffect(() => {
    if (activeGroup) {
      fetchMembers();
    }
  }, [activeGroup, fetchMembers]);

  const handleInviteMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeGroup || !inviteEmail.trim()) return;

    setInviting(true);
    try {
      const emailLower = inviteEmail.toLowerCase().trim();

      // Check if user exists
      const { data: profile } = await supabase
        .from("profiles")
        .select("id, email")
        .eq("email", emailLower)
        .maybeSingle();

      // Check if already a member
      if (profile) {
        const { data: existingMember } = await supabase
          .from("group_members")
          .select("id")
          .eq("group_id", activeGroup.id)
          .eq("user_id", profile.id)
          .maybeSingle();

        if (existingMember) {
          toast({
            title: "Already a member",
            description: "This user is already a member of the group.",
            variant: "destructive"
          });
          return;
        }
      }

      // Check for pending invitation
      const { data: existingInvitation } = await supabase
        .from("group_invitations")
        .select("id")
        .eq("group_id", activeGroup.id)
        .eq("invited_email", emailLower)
        .eq("status", "pending")
        .maybeSingle();

      if (existingInvitation) {
        toast({
          title: "Invitation already sent",
          description: "An invitation has already been sent to this email.",
          variant: "destructive"
        });
        return;
      }

      // Create invitation
      const { error: inviteError } = await supabase
        .from("group_invitations")
        .insert({
          group_id: activeGroup.id,
          invited_user_id: profile?.id || null,
          invited_email: emailLower,
          invited_by: user?.id
        });

      if (inviteError) throw inviteError;

      // Send email if user exists
      if (profile) {
        try {
          const response = await fetch("/api/send-invite-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              to: emailLower,
              inviteLink: `${window.location.origin}/invitations`,
              groupName: activeGroup.name,
              inviterName:
                user?.user_metadata?.full_name || user?.email || "En gruppadmin"
            })
          });

          if (!response.ok) {
            // Email sending failed, but invitation was created
          }
        } catch {
          // Email sending failed, but invitation was created
        }
      }

      toast({
        title: "Invitation sent!",
        description: profile
          ? "Inbjudan skickad till befintlig användare"
          : "Inbjudan skickad till ny användare"
      });

      setInviteEmail("");
      setInviteDialogOpen(false);
    } catch {
      toast({
        title: "Error",
        description: "Failed to send invitation.",
        variant: "destructive"
      });
    } finally {
      setInviting(false);
    }
  };

  const handleRemoveMember = async (memberId: string, memberName: string) => {
    if (!activeGroup) return;

    setRemovingMember(memberId);
    try {
      const { error } = await supabase
        .from("group_members")
        .delete()
        .eq("id", memberId);

      if (error) throw error;

      toast({
        title: "Member removed",
        description: `${memberName} has been removed from the group.`
      });

      fetchMembers();
    } catch {
      toast({
        title: "Error",
        description: "Failed to remove member.",
        variant: "destructive"
      });
    } finally {
      setRemovingMember(null);
    }
  };

  if (!activeGroup) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            No Group Selected
          </h1>
          <p className="text-gray-600">
            Please select a group from the sidebar to manage its members.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <LoadingSpinner size="large" />
            <p className="mt-4 text-gray-600">Loading group members...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Group Management
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Manage members of "{activeGroup.name}"
          </p>
          {!isAdmin && (
            <p className="text-sm text-gray-500">
              Only group admins can manage members
            </p>
          )}
        </div>

        {/* Members List */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Members ({members.length})</span>
              </div>
              {isAdmin && (
                <Dialog
                  open={inviteDialogOpen}
                  onOpenChange={setInviteDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Invite Member
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Invite New Member</DialogTitle>
                      <DialogDescription>
                        Send an invitation to join "{activeGroup.name}"
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleInviteMember}>
                      <div className="space-y-4 py-4">
                        <div>
                          <Label htmlFor="inviteEmail">Email Address</Label>
                          <Input
                            id="inviteEmail"
                            type="email"
                            value={inviteEmail}
                            onChange={(e) => setInviteEmail(e.target.value)}
                            placeholder="Enter email address"
                            required
                            disabled={inviting}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          type="submit"
                          disabled={inviting || !inviteEmail.trim()}
                        >
                          {inviting ? (
                            <div className="flex items-center space-x-2">
                              <LoadingSpinner size="small" />
                              <span>Sending...</span>
                            </div>
                          ) : (
                            <>
                              <Mail className="w-4 h-4 mr-2" />
                              Send Invitation
                            </>
                          )}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {members.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No members found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold">
                          {member.profiles?.full_name
                            ?.charAt(0)
                            ?.toUpperCase() || "?"}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="font-medium">
                            {member.profiles?.full_name || "Unknown User"}
                          </p>
                          {member.role === "admin" && (
                            <Crown className="w-4 h-4 text-yellow-500" />
                          )}
                        </div>
                        <p className="text-sm text-gray-500">
                          {member.profiles?.email}
                        </p>
                        <p className="text-xs text-gray-400">
                          Joined{" "}
                          {new Date(member.joined_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {isAdmin && member.user_id !== user?.id && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            disabled={removingMember === member.id}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remove Member</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to remove{" "}
                              {member.profiles?.full_name || "this member"} from
                              the group? They will lose access to all group
                              events and data.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() =>
                                handleRemoveMember(
                                  member.id,
                                  member.profiles?.full_name || "Unknown User"
                                )
                              }
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Remove Member
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Group Info */}
        <Card>
          <CardHeader>
            <CardTitle>Group Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Group Name</Label>
              <p className="text-gray-900">{activeGroup.name}</p>
            </div>
            {activeGroup.description && (
              <div>
                <Label className="text-sm font-medium">Description</Label>
                <p className="text-gray-900">{activeGroup.description}</p>
              </div>
            )}
            <div>
              <Label className="text-sm font-medium">Created</Label>
              <p className="text-gray-900">
                {new Date(activeGroup.created_at || "").toLocaleDateString()}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium">Total Events</Label>
              <p className="text-gray-900">
                {activeGroup.member_count || 0} members
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
