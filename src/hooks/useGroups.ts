
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Group {
  id: string;
  name: string;
  description: string | null;
  created_by: string;
  created_at: string;
  member_count?: number;
}

export const useGroups = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchGroups = async () => {
    if (!user) {
      setGroups([]);
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching groups for user:', user.id);
      
      // Get groups created by the user (these will be visible due to RLS policy)
      const { data: createdGroups, error: createdError } = await supabase
        .from('groups')
        .select('*');

      if (createdError) {
        console.error('Error fetching created groups:', createdError);
        throw createdError;
      }

      console.log('Created groups:', createdGroups);

      // Get groups where user is a member
      const { data: membershipData, error: memberError } = await supabase
        .from('group_members')
        .select('group_id')
        .eq('user_id', user.id);

      if (memberError) {
        console.error('Error fetching memberships:', memberError);
        throw memberError;
      }

      console.log('User memberships:', membershipData);

      // Get details for groups where user is a member (but didn't create)
      let memberGroups: Group[] = [];
      if (membershipData && membershipData.length > 0) {
        const memberGroupIds = membershipData.map(m => m.group_id);
        const nonCreatedGroupIds = memberGroupIds.filter(id => 
          !createdGroups?.some(g => g.id === id)
        );

        if (nonCreatedGroupIds.length > 0) {
          // We need to get these groups without RLS restrictions
          // For now, we'll skip them since RLS prevents access
          console.log('User is member of additional groups but cannot access due to RLS:', nonCreatedGroupIds);
        }
      }

      // Combine created groups with member groups
      const allGroups = [...(createdGroups || []), ...memberGroups];

      // Get member counts for each group
      const groupsWithCounts = await Promise.all(
        allGroups.map(async (group) => {
          const { count, error: countError } = await supabase
            .from('group_members')
            .select('*', { count: 'exact', head: true })
            .eq('group_id', group.id);

          if (countError) {
            console.error('Error getting member count:', countError);
          }

          return {
            ...group,
            member_count: count || 0
          };
        })
      );

      console.log('Groups with counts:', groupsWithCounts);
      setGroups(groupsWithCounts);
    } catch (error) {
      console.error('Error fetching groups:', error);
      setGroups([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, [user]);

  const createGroup = async (name: string, description?: string) => {
    if (!user) return { error: 'Not authenticated' };

    try {
      console.log('Creating group:', { name, description, created_by: user.id });

      const { data: group, error: groupError } = await supabase
        .from('groups')
        .insert({
          name: name.trim(),
          description: description?.trim() || null,
          created_by: user.id,
        })
        .select()
        .single();

      if (groupError) {
        console.error('Error creating group:', groupError);
        return { error: groupError.message || 'Kunde inte skapa gruppen' };
      }

      console.log('Group created:', group);

      // Add creator as first member with admin role
      const { error: memberError } = await supabase
        .from('group_members')
        .insert({
          group_id: group.id,
          user_id: user.id,
          role: 'admin',
        });

      if (memberError) {
        console.error('Error adding creator as member:', memberError);
        // Try to clean up the group if member addition fails
        await supabase.from('groups').delete().eq('id', group.id);
        return { error: 'Kunde inte lägga till dig som medlem i gruppen' };
      }

      console.log('Creator added as member');

      await fetchGroups();
      return { group, error: null };
    } catch (error) {
      console.error('Error creating group:', error);
      return { error: 'Ett oväntat fel uppstod vid skapande av gruppen' };
    }
  };

  const inviteUserToGroup = async (groupId: string, email: string) => {
    if (!user) return { error: 'Not authenticated' };

    try {
      console.log('Inviting user to group:', { groupId, email });

      // First check if user exists in profiles
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, email')
        .eq('email', email.toLowerCase().trim())
        .single();

      if (profileError || !profile) {
        console.error('User not found:', profileError);
        return { error: 'Användaren finns inte i systemet' };
      }

      // Check if user is already a member
      const { data: existingMember, error: memberCheckError } = await supabase
        .from('group_members')
        .select('id')
        .eq('group_id', groupId)
        .eq('user_id', profile.id)
        .maybeSingle();

      if (memberCheckError) {
        console.error('Error checking existing membership:', memberCheckError);
        return { error: 'Kunde inte kontrollera medlemskap' };
      }

      if (existingMember) {
        return { error: 'Användaren är redan medlem i gruppen' };
      }

      // Add user to group
      const { error: inviteError } = await supabase
        .from('group_members')
        .insert({
          group_id: groupId,
          user_id: profile.id,
          role: 'member',
        });

      if (inviteError) {
        console.error('Error inviting user:', inviteError);
        return { error: 'Kunde inte bjuda in användaren' };
      }

      console.log('User invited successfully');

      await fetchGroups();
      return { error: null };
    } catch (error) {
      console.error('Error inviting user to group:', error);
      return { error: 'Ett oväntat fel uppstod vid inbjudan' };
    }
  };

  return {
    groups,
    loading,
    createGroup,
    inviteUserToGroup,
    refetch: fetchGroups,
  };
};
