-- =============================================
-- COMPREHENSIVE RLS FIX FOR INVITATIONS AND EVENTS
-- =============================================
-- This fixes the issues with:
-- 1. Users not seeing shared events after accepting invitations
-- 2. Users not seeing profiles of inviters/group members
-- 3. Proper group visibility for invited users

-- First, drop ALL existing policies to start fresh - use a more comprehensive approach
DO $$
DECLARE
    pol record;
BEGIN
    -- Drop all policies on all our tables
    FOR pol IN (
        SELECT schemaname, tablename, policyname
        FROM pg_policies
        WHERE schemaname = 'public'
        AND tablename IN ('profiles', 'groups', 'group_members', 'group_invitations', 'events')
    ) LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I',
                      pol.policyname, pol.schemaname, pol.tablename);
    END LOOP;
END $$;

-- =============================================
-- PROFILES POLICIES - Allow necessary profile access
-- =============================================

-- Users can view their own profile
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Allow users to view profiles of people who invited them
CREATE POLICY "Users can view profiles of inviters" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM group_invitations
      WHERE group_invitations.invited_by = profiles.id
      AND group_invitations.invited_email = (SELECT email FROM profiles WHERE id = auth.uid())
    )
  );

-- Allow users to view profiles of group members
CREATE POLICY "Users can view profiles of group members" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM group_members gm1
      WHERE gm1.user_id = profiles.id
      AND gm1.group_id IN (
        SELECT gm2.group_id FROM group_members gm2
        WHERE gm2.user_id = auth.uid()
        UNION
        SELECT g.id FROM groups g
        WHERE g.created_by = auth.uid()
      )
    )
  );

-- =============================================
-- GROUPS POLICIES
-- =============================================

-- Users can view groups they created
CREATE POLICY "Users can view groups they created" ON groups
  FOR SELECT USING (auth.uid() = created_by);

-- Users can view groups they are members of
CREATE POLICY "Users can view groups they are members of" ON groups
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM group_members
      WHERE group_members.group_id = groups.id
      AND group_members.user_id = auth.uid()
    )
  );

-- Users can view groups they've been invited to (pending invitations)
CREATE POLICY "Users can view groups they've been invited to" ON groups
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM group_invitations
      WHERE group_invitations.group_id = groups.id
      AND group_invitations.invited_email = (SELECT email FROM profiles WHERE id = auth.uid())
      AND group_invitations.status = 'pending'
    )
  );

-- Users can create groups
CREATE POLICY "Users can create groups" ON groups
  FOR INSERT WITH CHECK (auth.uid() = created_by);

-- Group creators can update their groups
CREATE POLICY "Group creators can update their groups" ON groups
  FOR UPDATE USING (auth.uid() = created_by);

-- Group creators can delete their groups
CREATE POLICY "Group creators can delete their groups" ON groups
  FOR DELETE USING (auth.uid() = created_by);

-- =============================================
-- GROUP MEMBERS POLICIES
-- =============================================

-- Users can view members of groups they created
CREATE POLICY "Users can view members of groups they created" ON group_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM groups
      WHERE groups.id = group_members.group_id
      AND groups.created_by = auth.uid()
    )
  );

-- Users can view their own membership
CREATE POLICY "Users can view their own membership" ON group_members
  FOR SELECT USING (user_id = auth.uid());

-- Group creators can manage members
CREATE POLICY "Group creators can manage members" ON group_members
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM groups
      WHERE groups.id = group_members.group_id
      AND groups.created_by = auth.uid()
    )
  );

-- =============================================
-- EVENTS POLICIES - CRITICAL FIX
-- =============================================

-- Users can view events in groups they created
CREATE POLICY "Users can view events in groups they created" ON events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM groups
      WHERE groups.id = events.group_id
      AND groups.created_by = auth.uid()
    )
  );

-- Users can view events in groups they are members of
CREATE POLICY "Users can view events in groups they are members of" ON events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM group_members
      WHERE group_members.group_id = events.group_id
      AND group_members.user_id = auth.uid()
    )
  );

-- Users can create events in groups they created
CREATE POLICY "Users can create events in groups they created" ON events
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM groups
      WHERE groups.id = events.group_id
      AND groups.created_by = auth.uid()
    ) AND
    auth.uid() = created_by
  );

-- Users can create events in groups they are members of
CREATE POLICY "Users can create events in groups they are members of" ON events
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM group_members
      WHERE group_members.group_id = events.group_id
      AND group_members.user_id = auth.uid()
    ) AND
    auth.uid() = created_by
  );

-- Users can update their own events in groups they created
CREATE POLICY "Users can update their own events in groups they created" ON events
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM groups
      WHERE groups.id = events.group_id
      AND groups.created_by = auth.uid()
    ) AND
    auth.uid() = created_by
  );

-- Users can update their own events in groups they are members of
CREATE POLICY "Users can update their own events in groups they are members of" ON events
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM group_members
      WHERE group_members.group_id = events.group_id
      AND group_members.user_id = auth.uid()
    ) AND
    auth.uid() = created_by
  );

-- Users can delete their own events in groups they created
CREATE POLICY "Users can delete their own events in groups they are members of" ON events
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM groups
      WHERE groups.id = events.group_id
      AND groups.created_by = auth.uid()
    ) AND
    auth.uid() = created_by
  );

-- Users can delete their own events in groups they are members of
CREATE POLICY "Users can delete their own events in groups they are members of" ON events
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM group_members
      WHERE group_members.group_id = events.group_id
      AND group_members.user_id = auth.uid()
    ) AND
    auth.uid() = created_by
  );

-- =============================================
-- GROUP INVITATIONS POLICIES (unchanged)
-- =============================================

-- (These should already be correct from the original schema)