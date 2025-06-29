import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Event {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  event_time: string;
  event_type: 'booking' | 'task';
  category: string;
  assignee_id: string | null;
  created_by: string;
  group_id: string;
  assignee?: {
    full_name: string;
    email: string;
  };
}

export const useEvents = (groupId: string | null) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchEvents = async () => {
    if (!user || !groupId) return;

    try {
      // First fetch events without the profile join
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .eq('group_id', groupId)
        .order('event_date', { ascending: true });

      if (eventsError) throw eventsError;

      // Then fetch profiles separately for assignees
      const assigneeIds = eventsData?.filter(e => e.assignee_id).map(e => e.assignee_id) || [];
      let profiles: any[] = [];
      
      if (assigneeIds.length > 0) {
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, full_name, email')
          .in('id', assigneeIds);

        if (!profilesError) {
          profiles = profilesData || [];
        }
      }

      // Combine events with profile data
      const typedEvents: Event[] = (eventsData || []).map(event => ({
        ...event,
        event_type: event.event_type as 'booking' | 'task',
        assignee: profiles.find(p => p.id === event.assignee_id)
      }));
      
      setEvents(typedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();

    // Set up real-time subscription for live updates
    if (groupId) {
      const subscription = supabase
        .channel(`events-${groupId}`)
        .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: 'events',
            filter: `group_id=eq.${groupId}`
          }, 
          (payload) => {
            console.log('Real-time event update:', payload);
            // Refresh events when changes occur
            fetchEvents();
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [user, groupId]);

  const createEvent = async (eventData: Omit<Event, 'id' | 'created_by' | 'group_id' | 'assignee'>) => {
    if (!user || !groupId) return { error: 'Not authenticated or no group selected' };

    try {
      const { data, error } = await supabase
        .from('events')
        .insert({
          ...eventData,
          group_id: groupId,
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      // No need to manually fetchEvents() here as real-time subscription will handle it
      return { data, error: null };
    } catch (error) {
      console.error('Error creating event:', error);
      return { error };
    }
  };

  return {
    events,
    loading,
    createEvent,
    refetch: fetchEvents,
  };
};
