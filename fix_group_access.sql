-- Apply this SQL in your Supabase SQL Editor to fix group member access
-- This adds back the policy that allows invited users to see groups they're members of

-- Drop the overly restrictive groups policy
DROP POLICY IF EXISTS "groups_creator_access" ON groups;

-- Add back proper policies for groups
CREATE POLICY "groups_creator_access" ON groups
  FOR ALL USING (auth.uid() = created_by);

CREATE POLICY "groups_member_access" ON groups
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM group_members
      WHERE group_members.group_id = id
      AND group_members.user_id = auth.uid()
    )
  );