-- =============================================
-- ULTRA SIMPLE RLS POLICIES - MINIMAL VERSION
-- =============================================

-- Drop all existing policies first
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view groups they created" ON groups;
DROP POLICY IF EXISTS "Users can view groups they are members of" ON groups;
DROP POLICY IF EXISTS "Users can create groups" ON groups;
DROP POLICY IF EXISTS "Group creators can update their groups" ON groups;
DROP POLICY IF EXISTS "Group creators can delete their groups" ON groups;
DROP POLICY IF EXISTS "Users can view members of groups they created" ON group_members;
DROP POLICY IF EXISTS "Users can view members of groups they belong to" ON group_members;
DROP POLICY IF EXISTS "Group creators can manage members" ON group_members;
DROP POLICY IF EXISTS "Users can view invitations for groups they created" ON group_invitations;
DROP POLICY IF EXISTS "Users can view their own invitations" ON group_invitations;
DROP POLICY IF EXISTS "Group creators can create invitations" ON group_invitations;
DROP POLICY IF EXISTS "Users can update their own invitation status" ON group_invitations;
DROP POLICY IF EXISTS "Users can view events in groups they created" ON events;
DROP POLICY IF EXISTS "Users can view events in groups they are members of" ON events;
DROP POLICY IF EXISTS "Users can create events in groups they created" ON events;
DROP POLICY IF EXISTS "Users can create events in groups they are members of" ON events;
DROP POLICY IF EXISTS "Users can update their own events in groups they created" ON events;
DROP POLICY IF EXISTS "Users can update their own events in groups they are members of" ON events;
DROP POLICY IF EXISTS "Users can delete their own events in groups they created" ON events;
DROP POLICY IF EXISTS "Users can delete their own events in groups they are members of" ON events;

-- =============================================
-- ULTRA SIMPLE POLICIES - NO CROSS TABLE REFERENCES
-- =============================================

-- Profiles policies - only self access
CREATE POLICY "profiles_self_access" ON profiles
  FOR ALL USING (auth.uid() = id);

-- Groups policies - creators can do everything, no member checks
CREATE POLICY "groups_creator_access" ON groups
  FOR ALL USING (auth.uid() = created_by);

-- Group members policies - users can see their own membership
CREATE POLICY "group_members_self_access" ON group_members
  FOR ALL USING (auth.uid() = user_id);

-- Group invitations policies - creators can manage, invitees can view/update
CREATE POLICY "group_invitations_creator_access" ON group_invitations
  FOR SELECT USING (
    auth.uid() = invited_by OR
    invited_email = (SELECT email FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "group_invitations_creator_insert" ON group_invitations
  FOR INSERT WITH CHECK (auth.uid() = invited_by);

CREATE POLICY "group_invitations_invitee_update" ON group_invitations
  FOR UPDATE USING (
    invited_email = (SELECT email FROM profiles WHERE id = auth.uid())
  );

-- Events policies - creator access only (simplified)
CREATE POLICY "events_creator_access" ON events
  FOR ALL USING (auth.uid() = created_by);