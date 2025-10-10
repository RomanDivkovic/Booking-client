-- =============================================
-- ULTRA-SIMPLE RLS POLICIES (No Cross-Table References)
-- =============================================

-- Drop ALL existing policies first
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
-- ULTRA-SIMPLE POLICIES
-- =============================================

-- PROFILES: Users can only access their own profile
CREATE POLICY "profiles_policy" ON profiles
  FOR ALL USING (auth.uid() = id);

-- GROUPS: Users can only access groups they created
CREATE POLICY "groups_policy" ON groups
  FOR ALL USING (auth.uid() = created_by);

-- GROUP_MEMBERS: Users can only access memberships where they are the member
CREATE POLICY "group_members_policy" ON group_members
  FOR ALL USING (auth.uid() = user_id);

-- GROUP_INVITATIONS: Users can only access invitations they sent or received
CREATE POLICY "group_invitations_policy" ON group_invitations
  FOR ALL USING (
    auth.uid() = invited_by OR
    invited_email = (SELECT email FROM profiles WHERE id = auth.uid())
  );

-- EVENTS: Users can only access events they created
CREATE POLICY "events_policy" ON events
  FOR ALL USING (auth.uid() = created_by);