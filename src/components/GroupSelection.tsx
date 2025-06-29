import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Users, Calendar, UserPlus } from 'lucide-react';
import { useGroups } from '@/hooks/useGroups';
import { useToast } from '@/components/ui/use-toast';
import { GroupInviteModal } from './GroupInviteModal';
import { Footer } from './Footer';

interface GroupSelectionProps {
  onGroupSelect: (groupId: string) => void;
}

export const GroupSelection = ({ onGroupSelect }: GroupSelectionProps) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<{ id: string; name: string } | null>(null);
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { groups, loading: groupsLoading, createGroup, inviteUserToGroup } = useGroups();
  const { toast } = useToast();

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim()) {
      toast({
        title: 'Felaktigt gruppnamn',
        description: 'Gruppnamnet kan inte vara tomt.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    
    try {
      const { group, error } = await createGroup(groupName, groupDescription);
      
      if (error) {
        toast({
          title: 'Fel vid skapande av grupp',
          description: typeof error === 'string' ? error : 'Kunde inte skapa gruppen. Försök igen.',
          variant: 'destructive',
        });
      } else if (group) {
        toast({
          title: 'Grupp skapad!',
          description: `Gruppen "${groupName}" har skapats.`,
        });
        setIsCreateModalOpen(false);
        setGroupName('');
        setGroupDescription('');
        onGroupSelect(group.id);
      }
    } catch (error) {
      console.error('Unexpected error creating group:', error);
      toast({
        title: 'Fel vid skapande av grupp',
        description: 'Ett oväntat fel uppstod. Försök igen.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInviteUser = async (email: string) => {
    if (!selectedGroup) return { error: 'Ingen grupp vald' };
    
    return await inviteUserToGroup(selectedGroup.id, email);
  };

  const openInviteModal = (group: { id: string; name: string }) => {
    setSelectedGroup(group);
    setIsInviteModalOpen(true);
  };

  if (groupsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Calendar className="w-16 h-16 text-blue-600 mx-auto mb-4 animate-pulse" />
            <p className="text-gray-600">Laddar grupper...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col">
      <div className="flex-1 p-4">
        <div className="container mx-auto max-w-4xl pt-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Välj eller skapa en grupp</h1>
            <p className="text-gray-600">Välj en befintlig grupp eller skapa en ny för att komma igång</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {groups.map((group) => (
              <Card key={group.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    <span>{group.name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {group.description && (
                    <p className="text-gray-600 mb-4">{group.description}</p>
                  )}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-500">
                      {group.member_count} medlem{group.member_count !== 1 ? 'mar' : ''}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => onGroupSelect(group.id)}
                      className="flex-1"
                    >
                      Välj grupp
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openInviteModal({ id: group.id, name: group.name })}
                      title="Bjud in medlem"
                    >
                      <UserPlus className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Card className="cursor-pointer hover:shadow-lg transition-shadow border-dashed border-2 border-blue-300">
                  <CardContent className="flex flex-col items-center justify-center h-full p-8">
                    <Plus className="w-12 h-12 text-blue-600 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Skapa ny grupp</h3>
                    <p className="text-gray-600 text-center">Skapa en ny grupp och bjud in familj eller vänner</p>
                  </CardContent>
                </Card>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Skapa ny grupp</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleCreateGroup} className="space-y-4">
                  <div>
                    <Label htmlFor="groupName">Gruppnamn *</Label>
                    <Input
                      id="groupName"
                      value={groupName}
                      onChange={(e) => setGroupName(e.target.value)}
                      placeholder="T.ex. Familjen Andersson"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <Label htmlFor="groupDescription">Beskrivning</Label>
                    <Textarea
                      id="groupDescription"
                      value={groupDescription}
                      onChange={(e) => setGroupDescription(e.target.value)}
                      placeholder="Beskriv er grupp (valfritt)"
                      rows={3}
                      disabled={loading}
                    />
                  </div>

                  <div className="flex justify-end space-x-3">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsCreateModalOpen(false)}
                      disabled={loading}
                    >
                      Avbryt
                    </Button>
                    <Button type="submit" disabled={loading}>
                      {loading ? 'Skapar...' : 'Skapa grupp'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <GroupInviteModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onInvite={handleInviteUser}
        groupName={selectedGroup?.name || ''}
      />

      <Footer />
    </div>
  );
};
