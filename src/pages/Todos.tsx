import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useEvents } from '@/hooks/useEvents';
import { useGroups } from '@/hooks/useGroups';
import { Plus, CheckSquare, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';

const Todos = () => {
  const { user } = useAuth();
  const { groups } = useGroups();
  const selectedGroupId = groups.length > 0 ? groups[0].id : null;
  const { events, createEvent, refetch } = useEvents(selectedGroupId);
  const [isAdding, setIsAdding] = useState(false);
  const [newTodo, setNewTodo] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    time: '12:00'
  });

  const todos = events.filter(event => event.event_type === 'task');

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.title.trim() || !selectedGroupId) return;

    const { error } = await createEvent({
      title: newTodo.title,
      description: newTodo.description,
      event_date: new Date(newTodo.date).toISOString(),
      event_time: newTodo.time,
      event_type: 'task',
      category: 'Uppgift',
      assignee_id: user?.id || null,
    });

    if (!error) {
      setNewTodo({
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        time: '12:00'
      });
      setIsAdding(false);
      setTimeout(() => {
        refetch();
      }, 100);
    }
  };

  if (!selectedGroupId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col">
        <Header />
        <div className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-gray-500">Du måste skapa eller vara medlem i en grupp för att använda to-dos.</p>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col">
      <Header />
      
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Mina To-dos</h1>
            <Button onClick={() => setIsAdding(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Lägg till uppgift
            </Button>
          </div>

          {isAdding && (
            <Card className="mb-6 animate-in slide-in-from-top-2 duration-300">
              <CardHeader>
                <CardTitle>Ny uppgift</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddTodo} className="space-y-4">
                  <Input
                    placeholder="Uppgiftens namn"
                    value={newTodo.title}
                    onChange={(e) => setNewTodo(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                  <Textarea
                    placeholder="Beskrivning (valfritt)"
                    value={newTodo.description}
                    onChange={(e) => setNewTodo(prev => ({ ...prev, description: e.target.value }))}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      type="date"
                      value={newTodo.date}
                      onChange={(e) => setNewTodo(prev => ({ ...prev, date: e.target.value }))}
                    />
                    <Input
                      type="time"
                      value={newTodo.time}
                      onChange={(e) => setNewTodo(prev => ({ ...prev, time: e.target.value }))}
                    />
                  </div>
                  <div className="flex justify-end space-x-3">
                    <Button type="button" variant="outline" onClick={() => setIsAdding(false)}>
                      Avbryt
                    </Button>
                    <Button type="submit">
                      Lägg till
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            {todos.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <CheckSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Inga uppgifter än. Lägg till din första uppgift!</p>
                </CardContent>
              </Card>
            ) : (
              todos.map((todo, index) => (
                <Card 
                  key={todo.id} 
                  className="animate-in slide-in-from-bottom-2 duration-300"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{todo.title}</h3>
                        {todo.description && (
                          <p className="text-gray-600 mb-3">{todo.description}</p>
                        )}
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="w-4 h-4 mr-1" />
                          {format(new Date(todo.event_date), 'dd MMM yyyy', { locale: sv })} kl. {todo.event_time}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          Markera som klar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Todos;
