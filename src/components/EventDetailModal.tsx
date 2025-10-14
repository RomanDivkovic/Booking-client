import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, Edit, Trash2, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Event } from "@/hooks/useEvents";
import { useEventForm } from "@/hooks/useEventForm";
import { useEventActions } from "@/hooks/useEventActions";
import { useGroupMembersForEvent } from "@/hooks/useGroupMembersForEvent";
import { EventEditForm } from "./EventEditForm";
import { EventDisplay } from "./EventDisplay";

interface EventDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null;
  onEventUpdate: () => void;
}

export const EventDetailModal = ({
  isOpen,
  onClose,
  event,
  onEventUpdate
}: EventDetailModalProps) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  // Custom hooks for state management
  const { formData, updateFormData } = useEventForm(event);
  const { handleUpdateEvent, handleDeleteEvent, isUpdating, isDeleting } =
    useEventActions(event, onEventUpdate, onClose);
  const groupMembers = useGroupMembersForEvent(isOpen, event?.group_id);

  // Event handlers
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await handleUpdateEvent(formData);
    if (success) {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  // Permissions check
  const canEdit =
    event && (event.created_by === user?.id || user?.id === event.assignee_id);

  if (!event) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-[95vw] sm:max-w-[600px] p-2 sm:p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between pr-8">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>{isEditing ? "Redigera event" : "Event details"}</span>
            </div>
            <div className="flex items-center space-x-2">
              {canEdit && !isEditing && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDeleteEvent}
                    disabled={isDeleting}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </>
              )}
              {isEditing && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        {isEditing ? (
          <EventEditForm
            formData={formData}
            onFormDataChange={updateFormData}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            groupMembers={groupMembers}
            isSubmitting={isUpdating}
          />
        ) : (
          <EventDisplay event={event} />
        )}
      </DialogContent>
    </Dialog>
  );
};
