
import { Button } from '@/components/ui/button';
import { GroupInviteModal } from '@/components/GroupInviteModal';
import { Plus, UserPlus, User, List } from 'lucide-react';
import { useState } from 'react';
import { useGroups } from '@/hooks/useGroups';
import { useToast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';

interface SidebarProps {
  onAddClick: () => void;
}

export const Sidebar = ({ onAddClick }: SidebarProps) => {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const { groups, inviteUserToGroup } = useGroups();
  const { toast } = useToast();

  // Get the first group for now (in a real app, you'd have group selection)
  const currentGroup = groups[0];

  const handleInviteUser = async (email: string) => {
    if (!currentGroup) {
      console.log('Ingen grupp vald för inbjudan');
      return { error: 'Ingen grupp vald' };
    }

    console.log('Bjuder in användare till grupp:', { email, groupId: currentGroup.id, groupName: currentGroup.name });
    
    const result = await inviteUserToGroup(currentGroup.id, email);
    
    if (!result.error) {
      console.log('Användare inbjuden framgångsrikt:', email);
    } else {
      console.log('Fel vid inbjudan:', result.error);
    }
    
    return result;
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Snabbåtgärder</h3>
        
        <div className="space-y-3">
          <Button 
            onClick={onAddClick}
            className="w-full justify-start"
            variant="outline"
          >
            <Plus className="w-4 h-4 mr-2" />
            Lägg till händelse
          </Button>

          <Button 
            onClick={() => setIsInviteModalOpen(true)}
            className="w-full justify-start"
            variant="outline"
            disabled={!currentGroup}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Bjud in medlem
          </Button>

          <Link to="/todos">
            <Button 
              className="w-full justify-start"
              variant="outline"
            >
              <List className="w-4 h-4 mr-2" />
              To-dos
            </Button>
          </Link>

          <Link to="/profile">
            <Button 
              className="w-full justify-start"
              variant="outline"
            >
              <User className="w-4 h-4 mr-2" />
              Min profil
            </Button>
          </Link>
        </div>
      </div>

      {currentGroup && (
        <GroupInviteModal
          isOpen={isInviteModalOpen}
          onClose={() => setIsInviteModalOpen(false)}
          onInvite={handleInviteUser}
          groupName={currentGroup.name}
        />
      )}
    </div>
  );
};
