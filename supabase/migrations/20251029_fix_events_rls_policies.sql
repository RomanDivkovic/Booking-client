-- Fix events RLS policies to allow viewing events in groups user belongs to
-- This replaces the overly restrictive "events_creator_access" policy

-- Drop the current restrictive policy
DROP POLICY IF EXISTS "events_creator_access" ON events;

-- Drop any existing event policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view events in groups they created" ON events;
DROP POLICY IF EXISTS "Users can view events in groups they are members of" ON events;
DROP POLICY IF EXISTS "Users can create events in groups they created" ON events;
DROP POLICY IF EXISTS "Users can create events in groups they are members of" ON events;
DROP POLICY IF EXISTS "Users can update their own events in groups they created" ON events;
DROP POLICY IF EXISTS "Users can update their own events in groups they are members of" ON events;
DROP POLICY IF EXISTS "Users can delete their own events in groups they created" ON events;
DROP POLICY IF EXISTS "Users can delete their own events in groups they are members of" ON events;

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
CREATE POLICY "Users can delete their own events in groups they created" ON events
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