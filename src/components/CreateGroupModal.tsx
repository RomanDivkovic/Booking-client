import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useGroups } from "@/hooks/useGroups";
import { LoadingSpinner } from "./SkeletonLoaders";
import { useToast } from "@/hooks/use-toast";

interface CreateGroupModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export const CreateGroupModal = ({
  isOpen,
  onOpenChange
}: CreateGroupModalProps) => {
  const { createGroup, refetch } = useGroups();
  const { toast } = useToast();
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim()) {
      setError("Group name cannot be empty.");
      return;
    }
    setError("");
    setLoading(true);

    const { error: createError } = await createGroup(
      groupName,
      groupDescription
    );

    setLoading(false);

    if (createError) {
      setError(createError);
      toast({
        title: "Error creating group",
        description: createError,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Group Created",
        description: `The group "${groupName}" has been successfully created.`
      });
      setGroupName("");
      setGroupDescription("");
      onOpenChange(false);
      refetch(); // Refetch groups to update the list
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
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
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
