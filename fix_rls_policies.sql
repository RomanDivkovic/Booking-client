-- =============================================
-- FIX INFINITE RECURSION IN RLS POLICIES
-- =============================================

-- Drop ALL existing policies first to ensure clean slate
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;

DROP POLICY IF EXISTS "Users can view groups they created or are members of" ON groups;
DROP POLICY IF EXISTS "Users can view groups they created" ON groups;
DROP POLICY IF EXISTS "Users can view groups they are members of" ON groups;
DROP POLICY IF EXISTS "Users can create groups" ON groups;
DROP POLICY IF EXISTS "Group admins can update their groups" ON groups;
DROP POLICY IF EXISTS "Group creators can update their groups" ON groups;
DROP POLICY IF EXISTS "Group creators can delete their groups" ON groups;

DROP POLICY IF EXISTS "Users can view members of groups they belong to" ON group_members;
DROP POLICY IF EXISTS "Users can view members of groups they created" ON group_members;
DROP POLICY IF EXISTS "Group admins can manage members" ON group_members;
DROP POLICY IF EXISTS "Group creators can manage members" ON group_members;

DROP POLICY IF EXISTS "Users can view invitations for groups they belong to" ON group_invitations;
DROP POLICY IF EXISTS "Users can view invitations for groups they created" ON group_invitations;
DROP POLICY IF EXISTS "Users can view their own invitations" ON group_invitations;
DROP POLICY IF EXISTS "Group members can create invitations" ON group_invitations;
DROP POLICY IF EXISTS "Group creators can create invitations" ON group_invitations;
DROP POLICY IF EXISTS "Users can update their own invitation status" ON group_invitations;

DROP POLICY IF EXISTS "Users can view events in groups they belong to" ON events;
DROP POLICY IF EXISTS "Users can view events in groups they created" ON events;
DROP POLICY IF EXISTS "Users can view events in groups they are members of" ON events;
DROP POLICY IF EXISTS "Users can create events in groups they belong to" ON events;
DROP POLICY IF EXISTS "Users can create events in groups they created" ON events;
DROP POLICY IF EXISTS "Users can create events in groups they are members of" ON events;
DROP POLICY IF EXISTS "Users can update events they created in groups they belong to" ON events;
DROP POLICY IF EXISTS "Users can update their own events in groups they created" ON events;
DROP POLICY IF EXISTS "Users can update their own events in groups they are members of" ON events;
DROP POLICY IF EXISTS "Users can delete events they created in groups they belong to" ON events;
DROP POLICY IF EXISTS "Users can delete their own events in groups they created" ON events;
DROP POLICY IF EXISTS "Users can delete their own events in groups they are members of" ON events;

-- =============================================
-- FIXED POLICIES (No Infinite Recursion)
-- =============================================

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Group members policies (fixed)
CREATE POLICY "Users can view members of groups they created" ON group_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM groups
      WHERE groups.id = group_members.group_id
      AND groups.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can view members of groups they belong to" ON group_members
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Group creators can manage members" ON group_members
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM groups
      WHERE groups.id = group_members.group_id
      AND groups.created_by = auth.uid()
    )
  );

-- Groups policies (fixed)
CREATE POLICY "Users can view groups they created" ON groups
  FOR SELECT USING (auth.uid() = created_by);

CREATE POLICY "Users can view groups they are members of" ON groups
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM group_members
      WHERE group_members.group_id = id
      AND group_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create groups" ON groups
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Group creators can update their groups" ON groups
  FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Group creators can delete their groups" ON groups
  FOR DELETE USING (auth.uid() = created_by);

-- Group invitations policies (fixed)
CREATE POLICY "Users can view invitations for groups they created" ON group_invitations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM groups
      WHERE groups.id = group_invitations.group_id
      AND groups.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can view their own invitations" ON group_invitations
  FOR SELECT USING (invited_email = (SELECT email FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Group creators can create invitations" ON group_invitations
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM groups
      WHERE groups.id = group_invitations.group_id
      AND groups.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can update their own invitation status" ON group_invitations
  FOR UPDATE USING (invited_email = (SELECT email FROM profiles WHERE id = auth.uid()));

-- Events policies (fixed)
CREATE POLICY "Users can view events in groups they created" ON events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM groups
      WHERE groups.id = events.group_id
      AND groups.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can view events in groups they are members of" ON events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM group_members
      WHERE group_members.group_id = events.group_id
      AND group_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create events in groups they created" ON events
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM groups
      WHERE groups.id = events.group_id
      AND groups.created_by = auth.uid()
    ) AND
    auth.uid() = created_by
  );

CREATE POLICY "Users can create events in groups they are members of" ON events
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM group_members
      WHERE group_members.group_id = events.group_id
      AND group_members.user_id = auth.uid()
    ) AND
    auth.uid() = created_by
  );

CREATE POLICY "Users can update their own events in groups they created" ON events
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM groups
      WHERE groups.id = events.group_id
      AND groups.created_by = auth.uid()
    ) AND
    auth.uid() = created_by
  );

CREATE POLICY "Users can update their own events in groups they are members of" ON events
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM group_members
      WHERE group_members.group_id = events.group_id
      AND group_members.user_id = auth.uid()
    ) AND
    auth.uid() = created_by
  );

CREATE POLICY "Users can delete their own events in groups they created" ON events
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM groups
      WHERE groups.id = events.group_id
      AND groups.created_by = auth.uid()
    ) AND
    auth.uid() = created_by
  );

CREATE POLICY "Users can delete their own events in groups they are members of" ON events
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM group_members
      WHERE group_members.group_id = events.group_id
      AND group_members.user_id = auth.uid()
    ) AND
    auth.uid() = created_by
  );