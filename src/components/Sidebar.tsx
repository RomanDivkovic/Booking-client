import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Plus, List, User, UserPlus, Users, Trash2 } from "lucide-react";
import { useGroups } from "@/hooks/useGroups";
import { Group } from "@/types/group";
import { useGroup } from "@/contexts/GroupContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { CreateGroupModal } from "./CreateGroupModal";
import { useAuth } from "@/contexts/AuthContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

interface SidebarProps {
  onAddClick: () => void;
  onInviteClick: () => void;
}

export const Sidebar = ({ onAddClick, onInviteClick }: SidebarProps) => {
  const { user } = useAuth();
  const { groups, loading, deleteGroup, refetch } = useGroups();
  const { activeGroup, setActiveGroup } = useGroup();
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState<Group | null>(null);
  const { toast } = useToast();

  // Set the first group as active by default
  useEffect(() => {
    if (groups && groups.length > 0 && !activeGroup) {
      setActiveGroup(groups[0]);
    }
  }, [groups, activeGroup, setActiveGroup]);

  const handleGroupChange = (groupId: string) => {
    if (groupId === "personal-overview") {
      setActiveGroup(null); // Represents the personal overview
    } else {
      const selectedGroup = groups?.find((g) => g.id === groupId);
      if (selectedGroup) {
        setActiveGroup(selectedGroup);
      }
    }
  };

  const openDeleteDialog = (group: Group) => {
    setGroupToDelete(group);
    setDeleteDialogOpen(true);
  };

  const handleDeleteGroup = async () => {
    if (!groupToDelete) return;

    const { error } = await deleteGroup(groupToDelete.id);

    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: `Group "${groupToDelete.name}" has been deleted.`
      });
      refetch();
      // If the deleted group was the active one, switch to personal overview
      if (activeGroup?.id === groupToDelete.id) {
        setActiveGroup(null);
      }
    }
    setDeleteDialogOpen(false);
    setGroupToDelete(null);
  };

  return (
    <div className="space-y-6">
      {/* Group Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Group
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setCreateModalOpen(true)}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading && <p>Loading groups...</p>}
          {groups && (
            <Select
              value={activeGroup?.id ?? "personal-overview"}
              onValueChange={handleGroupChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="personal-overview">
                  Personal Overview
                </SelectItem>
                {groups.map((group) => (
                  <div key={group.id} className="flex items-center pr-2">
                    <SelectItem value={group.id} className="flex-grow">
                      {group.name}
                    </SelectItem>
                    {group.created_by === user?.id && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          openDeleteDialog(group);
                        }}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    )}
                  </div>
                ))}
              </SelectContent>
            </Select>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            onClick={onAddClick}
            className="w-full"
            disabled={!activeGroup}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Event
          </Button>
          <Button
            onClick={onInviteClick}
            className="w-full"
            variant="outline"
            disabled={!activeGroup}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Invite Member
          </Button>
        </CardContent>
      </Card>

      {/* Navigation */}
      <Card>
        <CardHeader>
          <CardTitle>Navigation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Link to="/todos">
            <Button variant="ghost" className="w-full justify-start">
              <List className="w-4 h-4 mr-2" />
              Todos
            </Button>
          </Link>

          <Link to="/profile">
            <Button variant="ghost" className="w-full justify-start">
              <User className="w-4 h-4 mr-2" />
              Profile
            </Button>
          </Link>
        </CardContent>
      </Card>
      <CreateGroupModal
        isOpen={isCreateModalOpen}
        onOpenChange={setCreateModalOpen}
      />
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the "
              {groupToDelete?.name}" group and all of its data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteGroup}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
