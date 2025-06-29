import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarView } from '@/components/CalendarView';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { EventModal } from '@/components/EventModal';
import { EventDetailModal } from '@/components/EventDetailModal';
import { Sidebar } from '@/components/Sidebar';
import { HouseholdStats } from '@/components/HouseholdStats';
import { GroupSelection } from '@/components/GroupSelection';
import { useAuth } from '@/contexts/AuthContext';
import { useEvents } from '@/hooks/useEvents';
import { Event } from '@/hooks/useEvents';

const Index = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');

  const { events, loading: eventsLoading, createEvent, refetch } = useEvents(selectedGroupId);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4 animate-pulse">
            <div className="w-8 h-8 bg-white rounded"></div>
          </div>
          <p className="text-gray-600">Laddar...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (!selectedGroupId) {
    return <GroupSelection onGroupSelect={setSelectedGroupId} />;
  }

  const handleAddEvent = async (eventData: {
    title: string;
    date: Date;
    time: string;
    type: 'booking' | 'task';
    assignee: string;
    description: string;
    category: string;
  }) => {
    const { error } = await createEvent({
      title: eventData.title,
      description: eventData.description,
      event_date: eventData.date.toISOString(),
      event_time: eventData.time,
      event_type: eventData.type,
      category: eventData.category,
      assignee_id: eventData.assignee,
    });

    if (!error) {
      setIsModalOpen(false);
      // Add a small delay to show the animation
      setTimeout(() => {
        refetch();
      }, 100);
    }
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsDetailModalOpen(true);
  };

  const handleEventUpdate = () => {
    refetch();
  };

  // Convert events to the format expected by existing components
  const formattedEvents = events.map(event => ({
    id: event.id,
    title: event.title,
    date: new Date(event.event_date),
    time: event.event_time,
    type: event.event_type as 'booking' | 'task',
    assignee: event.assignee?.full_name || 'Okänd',
    description: event.description || '',
    category: event.category,
  }));

  if (eventsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col">
        <Header />
        <div className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
          <p className="text-gray-600">Laddar händelser...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col">
      <Header />
      
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <HouseholdStats events={events} />
            <Sidebar onAddClick={() => setIsModalOpen(true)} />
          </div>

          <div className="lg:col-span-3">
            <CalendarView 
              events={events}
              view={view}
              onViewChange={setView}
              onDateSelect={handleDateSelect}
              onEventClick={handleEventClick}
            />
          </div>
        </div>
      </div>

      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddEvent}
        selectedDate={selectedDate}
        groupId={selectedGroupId}
      />

      <EventDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedEvent(null);
        }}
        event={selectedEvent}
        onEventUpdate={handleEventUpdate}
      />

      <Footer />
    </div>
  );
};

export default Index;
