import React from "react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Plus, Users, Calendar, UserPlus } from "lucide-react";
import { useGroups } from "@/hooks/useGroups";
import { useToast } from "@/components/ui/use-toast";
import { GroupInviteModal } from "./GroupInviteModal";
import { Footer } from "./Footer";
import { GroupCardSkeleton, LoadingSpinner } from "./SkeletonLoaders";
import { supabase } from "@/integrations/supabase/client";

interface GroupSelectionProps {
  onGroupSelect: (groupId: string) => void;
}

export const GroupSelection = ({ onGroupSelect }: GroupSelectionProps) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    groups,
    loading: groupsLoading,
    createGroup,
    inviteUserToGroup
  } = useGroups();
  const { toast } = useToast();

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim()) {
      toast({
        title: "Invalid group name",
        description: "Group name cannot be empty.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const { group } = await createGroup(groupName, groupDescription);

      if (group) {
        toast({
          title: "Group created!",
          description: `Group "${groupName}" has been created.`
        });
        setIsCreateModalOpen(false);
        setGroupName("");
        setGroupDescription("");
        onGroupSelect(group.id);
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Error creating group",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInviteUser = async (email: string) => {
    if (!selectedGroup) return { error: "No group selected" };

    const result = await inviteUserToGroup(selectedGroup.id, email);

    // If successful, get the invitation ID for link generation
    if (!result.error) {
      // Fetch the invitation ID that was just created
      const { data: invitations } = await supabase
        .from("group_invitations")
        .select("id")
        .eq("group_id", selectedGroup.id)
        .eq("invited_email", email.toLowerCase().trim())
        .eq("status", "pending")
        .order("created_at", { ascending: false })
        .limit(1);

      if (invitations && invitations.length > 0) {
        return { ...result, invitationId: invitations[0].id };
      }
    }

    return result;
  };

  const openInviteModal = (group: { id: string; name: string }) => {
    setSelectedGroup(group);
    setIsInviteModalOpen(true);
  };

  if (groupsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Calendar className="w-16 h-16 text-blue-600 mx-auto mb-4 animate-pulse" />
            <p className="text-gray-600">Loading groups...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col">
      <div className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Select Your Group
              </h1>
              <p className="text-xl text-gray-600">
                Choose a group to start managing your family calendar with
                FamCaly
              </p>
            </div>

            {/* Groups Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {groupsLoading ? (
                // Show skeleton loaders while loading
                Array.from({ length: 6 }).map((_, i) => (
                  <GroupCardSkeleton key={i} />
                ))
              ) : groups.length === 0 ? (
                // Show empty state
                <div className="col-span-full text-center py-12">
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No groups yet
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Create your first group to get started
                  </p>
                  <Button onClick={() => setIsCreateModalOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Group
                  </Button>
                </div>
              ) : (
                // Show actual groups
                groups.map((group) => (
                  <Card
                    key={group.id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="truncate">{group.name}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {group.description && (
                        <p className="text-gray-600 mb-4">
                          {group.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-gray-500">
                          {group.member_count} member
                          {group.member_count !== 1 ? "s" : ""}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => onGroupSelect(group.id)}
                          className="flex-1"
                        >
                          Select Group
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            openInviteModal({ id: group.id, name: group.name })
                          }
                          title="Invite member"
                        >
                          <UserPlus className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}

              <Dialog
                open={isCreateModalOpen}
                onOpenChange={setIsCreateModalOpen}
              >
                <DialogTrigger asChild>
                  <Card className="cursor-pointer hover:shadow-lg transition-shadow border-dashed border-2 border-blue-300">
                    <CardContent className="flex flex-col items-center justify-center h-full p-8">
                      <Plus className="w-12 h-12 text-blue-600 mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Create new group
                      </h3>
                      <p className="text-gray-600 text-center">
                        Create a new group and invite family or friends
                      </p>
                    </CardContent>
                  </Card>
                </DialogTrigger>

                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create new group</DialogTitle>
                  </DialogHeader>

                  <form onSubmit={handleCreateGroup} className="space-y-4">
                    <div>
                      <Label htmlFor="groupName">Group name *</Label>
                      <Input
                        id="groupName"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        placeholder="e.g. Andersson Family"
                        required
                        disabled={loading}
                      />
                    </div>

                    <div>
                      <Label htmlFor="groupDescription">Description</Label>
                      <Textarea
                        id="groupDescription"
                        value={groupDescription}
                        onChange={(e) => setGroupDescription(e.target.value)}
                        placeholder="Describe your group (optional)"
                        rows={3}
                        disabled={loading}
                      />
                    </div>

                    <div className="flex justify-end space-x-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsCreateModalOpen(false)}
                        disabled={loading}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={loading}>
                        {loading ? (
                          <div className="flex items-center space-x-2">
                            <LoadingSpinner size="small" />
                            <span>Creating...</span>
                          </div>
                        ) : (
                          "Create Group"
                        )}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      <GroupInviteModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onInvite={handleInviteUser}
        groupName={selectedGroup?.name || ""}
      />

      <Footer />
    </div>
  );
};
