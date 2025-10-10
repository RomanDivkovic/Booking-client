import React from "react";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { useGroups } from "@/hooks/useGroups";
import { useGroupMembers } from "@/hooks/useGroupMembers";
// import { useGroup } from "@/contexts/GroupContext";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (event: {
    title: string;
    date: Date;
    time: string;
    type: "booking" | "task";
    assignee: string;
    description: string;
    category: string;
    groupId?: string; // Add optional groupId for personal overview
  }) => void;
  selectedDate: Date | null;
  groupId: string | null;
}

export const EventModal = ({
  isOpen,
  onClose,
  onSubmit,
  selectedDate,
  groupId
}: EventModalProps) => {
  const [formData, setFormData] = useState({
    title: "",
    date: selectedDate || new Date(),
    time: "",
    type: "booking" as "booking" | "task",
    assignee: "",
    description: "",
    category: "",
    selectedGroupId: groupId || "" // Add selected group for personal overview
  });
  const [groupMembers, setGroupMembers] = useState<
    Array<{ id: string; full_name: string; email: string }>
  >([]);
  const { groups } = useGroups();
  const { getGroupMembers } = useGroupMembers();

  useEffect(() => {
    if (selectedDate) {
      setFormData((prev) => ({ ...prev, date: selectedDate }));
    }
  }, [selectedDate]);

  useEffect(() => {
    if (isOpen) {
      // Reset selectedGroupId when modal opens
      setFormData((prev) => ({ ...prev, selectedGroupId: groupId || "" }));
    }
  }, [isOpen, groupId]);

  useEffect(() => {
    const currentGroupId = formData.selectedGroupId || groupId;
    if (isOpen && currentGroupId) {
      const fetchMembers = async () => {
        const members = await getGroupMembers(currentGroupId);
        setGroupMembers(members);
      };
      fetchMembers();
    } else {
      setGroupMembers([]);
    }
  }, [isOpen, formData.selectedGroupId, groupId, getGroupMembers]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const currentGroupId = formData.selectedGroupId || groupId;
    if (
      formData.title &&
      formData.time &&
      formData.assignee &&
      formData.category &&
      currentGroupId
    ) {
      onSubmit({
        ...formData,
        groupId: currentGroupId
      });
      setFormData({
        title: "",
        date: new Date(),
        time: "",
        type: "booking",
        assignee: "",
        description: "",
        category: "",
        selectedGroupId: groupId || ""
      });
    }
  };

  const handleClose = () => {
    onClose();
    setFormData({
      title: "",
      date: new Date(),
      time: "",
      type: "booking",
      assignee: "",
      description: "",
      category: "",
      selectedGroupId: groupId || ""
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>Add event</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="E.g. Veterinarian visit or Buy groceries"
              required
            />
          </div>

          {!groupId && (
            <div>
              <Label htmlFor="group">Group *</Label>
              <Select
                value={formData.selectedGroupId}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, selectedGroupId: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select group" />
                </SelectTrigger>
                <SelectContent>
                  {groups.map((group) => (
                    <SelectItem key={group.id} value={group.id}>
                      🏠 {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={format(formData.date, "yyyy-MM-dd")}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    date: new Date(e.target.value)
                  }))
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="time">Time *</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, time: e.target.value }))
                }
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value: "booking" | "task") =>
                  setFormData((prev) => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="booking">📅 Booking</SelectItem>
                  <SelectItem value="task">✅ Task</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="assignee">Assignee *</Label>
              <Select
                value={formData.assignee}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, assignee: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select person" />
                </SelectTrigger>
                <SelectContent>
                  {groupMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      👤 {member.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="category">Category *</Label>
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, category: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Household">🏠 Household</SelectItem>
                <SelectItem value="Children">👶 Children</SelectItem>
                <SelectItem value="Pets">🐕 Pets</SelectItem>
                <SelectItem value="Health">💊 Health</SelectItem>
                <SelectItem value="Leisure">🎯 Leisure</SelectItem>
                <SelectItem value="Other">📋 Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value
                }))
              }
              placeholder="Additional information..."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                !formData.title ||
                !formData.time ||
                !formData.assignee ||
                !formData.category ||
                (!groupId && !formData.selectedGroupId)
              }
            >
              Add event
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
