
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (event: any) => void;
  selectedDate: Date | null;
}

export const EventModal = ({ isOpen, onClose, onSubmit, selectedDate }: EventModalProps) => {
  const [formData, setFormData] = useState({
    title: '',
    date: selectedDate || new Date(),
    time: '',
    type: 'booking' as 'booking' | 'task',
    assignee: '',
    description: '',
    category: ''
  });

  useEffect(() => {
    if (selectedDate) {
      setFormData(prev => ({ ...prev, date: selectedDate }));
    }
  }, [selectedDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title && formData.time && formData.assignee && formData.category) {
      onSubmit(formData);
      setFormData({
        title: '',
        date: new Date(),
        time: '',
        type: 'booking',
        assignee: '',
        description: '',
        category: ''
      });
    }
  };

  const handleClose = () => {
    onClose();
    setFormData({
      title: '',
      date: new Date(),
      time: '',
      type: 'booking',
      assignee: '',
      description: '',
      category: ''
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>Lägg till händelse</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Titel *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="T.ex. Veterinärbesök eller Handla mat"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Datum</Label>
              <Input
                id="date"
                type="date"
                value={format(formData.date, 'yyyy-MM-dd')}
                onChange={(e) => setFormData(prev => ({ ...prev, date: new Date(e.target.value) }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="time">Tid *</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Typ *</Label>
              <Select value={formData.type} onValueChange={(value: 'booking' | 'task') => setFormData(prev => ({ ...prev, type: value }))}>
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
              <Select value={formData.assignee} onValueChange={(value) => setFormData(prev => ({ ...prev, assignee: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Välj person" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Nuvarande användare">👤 Jag</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="category">Kategori *</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
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
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Ytterligare information..."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={handleClose}>
              Avbryt
            </Button>
            <Button type="submit">
              Lägg till händelse
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
