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
import { Calendar, Clock, User, Tag, Edit, Trash2, X } from "lucide-react";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { useAuth } from "@/contexts/AuthContext";
import { useGroups } from "@/hooks/useGroups";
import { Event } from "@/hooks/useEvents";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

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
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [groupMembers, setGroupMembers] = useState<
    Array<{ id: string; full_name: string; email: string }>
  >([]);
  const { getGroupMembers } = useGroups();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    type: "booking" as "booking" | "task",
    assignee: "",
    category: ""
  });

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description || "",
        date: format(new Date(event.event_date), "yyyy-MM-dd"),
        time: event.event_time,
        type: event.event_type,
        assignee: event.assignee_id || "",
        category: event.category
      });
    }
  }, [event]);

  useEffect(() => {
    if (isOpen && event?.group_id) {
      const fetchMembers = async () => {
        const members = await getGroupMembers(event.group_id);
        setGroupMembers(members);
      };
      fetchMembers();
    }
  }, [isOpen, event?.group_id, getGroupMembers]);

  const handleUpdateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!event || !user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from("events")
        .update({
          title: formData.title,
          description: formData.description,
          event_date: new Date(formData.date).toISOString(),
          event_time: formData.time,
          event_type: formData.type,
          category: formData.category,
          assignee_id: formData.assignee || null,
          updated_at: new Date().toISOString()
        })
        .eq("id", event.id);

      if (error) throw error;

      toast({
        title: "Händelse uppdaterad!",
        description: "Händelsen har uppdaterats framgångsrikt."
      });

      setIsEditing(false);
      onEventUpdate();
    } catch (error) {
      console.log(error);
      toast({
        title: "Fel vid uppdatering",
        description: "Kunde inte uppdatera händelsen. Försök igen.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async () => {
    if (!event || !user) return;

    if (!window.confirm("Är du säker på att du vill ta bort denna händelse?")) {
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from("events")
        .delete()
        .eq("id", event.id);

      if (error) throw error;

      toast({
        title: "Händelse borttagen!",
        description: "Händelsen har tagits bort."
      });

      onClose();
      onEventUpdate();
    } catch (error) {
      console.log(error);
      toast({
        title: "Fel vid borttagning",
        description: "Kunde inte ta bort händelsen. Försök igen.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const canEdit =
    event && (event.created_by === user?.id || user?.id === event.assignee_id);

  if (!event) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>
                {isEditing ? "Redigera händelse" : "Händelsedetaljer"}
              </span>
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
                    disabled={loading}
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
          <form onSubmit={handleUpdateEvent} className="space-y-4">
            <div>
              <Label htmlFor="title">Titel *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Datum</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, date: e.target.value }))
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="time">Tid *</Label>
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
                <Label htmlFor="type">Typ *</Label>
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
                    <SelectItem value="booking">📅 Bokning</SelectItem>
                    <SelectItem value="task">✅ Uppgift</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="assignee">Ansvarig *</Label>
                <Select
                  value={formData.assignee}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, assignee: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Välj person" />
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
              <Label htmlFor="category">Kategori *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, category: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Välj kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Hushåll">🏠 Hushåll</SelectItem>
                  <SelectItem value="Barn">👶 Barn</SelectItem>
                  <SelectItem value="Husdjur">🐕 Husdjur</SelectItem>
                  <SelectItem value="Hälsa">💊 Hälsa</SelectItem>
                  <SelectItem value="Fritid">🎯 Fritid</SelectItem>
                  <SelectItem value="Övrigt">📋 Övrigt</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description">Beskrivning</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value
                  }))
                }
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditing(false)}
              >
                Avbryt
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Sparar..." : "Spara ändringar"}
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {event.title}
              </h3>
              {event.description && (
                <p className="text-gray-600">{event.description}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  {format(new Date(event.event_date), "EEEE dd MMMM yyyy", {
                    locale: sv
                  })}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  kl. {event.event_time}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <Tag className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">{event.category}</span>
              </div>

              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  {event.assignee?.full_name || "Ingen tilldelad"}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  event.event_type === "booking"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {event.event_type === "booking" ? "📅 Bokning" : "✅ Uppgift"}
              </span>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
