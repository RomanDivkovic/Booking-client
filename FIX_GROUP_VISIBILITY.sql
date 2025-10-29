-- FIX: Allow users to see groups they've been invited to
-- Run this in Supabase SQL Editor

CREATE POLICY "Users can view groups they've been invited to" ON groups
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM group_invitations
      WHERE group_invitations.group_id = id
      AND group_invitations.invited_email = (SELECT email FROM profiles WHERE id = auth.uid())
      AND group_invitations.status = 'pending'
    )
  );
