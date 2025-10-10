import { useState, useEffect } from "react";
import { Event } from "@/hooks/useEvents";
import { format } from "date-fns";

export interface EventFormData {
  title: string;
  description: string;
  date: string;
  time: string;
  type: "booking" | "task";
  assignee: string;
  category: string;
}

export const useEventForm = (event: Event | null) => {
  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    description: "",
    date: "",
    time: "",
    type: "booking",
    assignee: "",
    category: ""
  });

  // Initialize form data when event changes
  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description || "",
        date: format(new Date(event.event_date), "yyyy-MM-dd"),
        time: event.event_time || "",
        type: event.event_type,
        assignee: event.assignee_id || "",
        category: event.category || ""
      });
    }
  }, [event]);

  const updateFormData = (field: keyof EventFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description || "",
        date: format(new Date(event.event_date), "yyyy-MM-dd"),
        time: event.event_time || "",
        type: event.event_type,
        assignee: event.assignee_id || "",
        category: event.category || ""
      });
    }
  };

  return {
    formData,
    updateFormData,
    resetForm
  };
};
