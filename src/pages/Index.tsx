
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarView } from '@/components/CalendarView';
import { Header } from '@/components/Header';
import { EventModal } from '@/components/EventModal';
import { Sidebar } from '@/components/Sidebar';
import { HouseholdStats } from '@/components/HouseholdStats';
import { GroupSelection } from '@/components/GroupSelection';
import { useAuth } from '@/contexts/AuthContext';
import { useEvents } from '@/hooks/useEvents';

const Index = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');

  const { events, loading: eventsLoading, createEvent } = useEvents(selectedGroupId);

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

  const handleAddEvent = async (eventData: any) => {
    const { error } = await createEvent({
      title: eventData.title,
      description: eventData.description,
      event_date: eventData.date.toISOString(),
      event_time: eventData.time,
      event_type: eventData.type,
      category: eventData.category,
      assignee_id: eventData.assignee === 'Nuvarande användare' ? user.id : null,
    });

    if (!error) {
      setIsModalOpen(false);
    }
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <Header />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center">
          <p className="text-gray-600">Laddar händelser...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
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
            />
          </div>
        </div>
      </div>

      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddEvent}
        selectedDate={selectedDate}
      />
    </div>
  );
};

export default Index;
