-- =============================================
-- FamCaly Database Setup with RLS Policies
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- CREATE ALL TABLES FIRST
-- =============================================

-- PROFILES TABLE
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- GROUPS TABLE
CREATE TABLE IF NOT EXISTS groups (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_by UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- GROUP MEMBERS TABLE
CREATE TABLE IF NOT EXISTS group_members (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(group_id, user_id)
);

-- GROUP INVITATIONS TABLE
CREATE TABLE IF NOT EXISTS group_invitations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE NOT NULL,
  invited_user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  invited_email TEXT NOT NULL,
  invited_by UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- EVENTS TABLE (includes todos)
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  event_time TIME,
  event_type TEXT DEFAULT 'booking' CHECK (event_type IN ('booking', 'task')),
  created_by UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  assignee_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE NOT NULL,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- ENABLE RLS ON ALL TABLES
-- =============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- =============================================
-- CREATE RLS POLICIES (AFTER ALL TABLES EXIST)
-- =============================================

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Groups policies
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

-- Group members policies
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

-- Group invitations policies
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

-- Events policies
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

-- =============================================
-- FUNCTIONS
-- =============================================

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to accept group invitation
CREATE OR REPLACE FUNCTION public.accept_group_invitation(invitation_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  invitation_record RECORD;
  user_profile_id UUID;
BEGIN
  -- Get the invitation details
  SELECT * INTO invitation_record
  FROM group_invitations
  WHERE id = invitation_id AND status = 'pending';

  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;

  -- Get the current user's profile ID
  SELECT id INTO user_profile_id
  FROM profiles
  WHERE id = auth.uid() AND email = invitation_record.invited_email;

  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;

  -- Update invitation status
  UPDATE group_invitations
  SET status = 'accepted', updated_at = NOW()
  WHERE id = invitation_id;

  -- Add user to group
  INSERT INTO group_members (group_id, user_id, role)
  VALUES (invitation_record.group_id, user_profile_id, 'member')
  ON CONFLICT (group_id, user_id) DO NOTHING;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to decline group invitation
CREATE OR REPLACE FUNCTION public.decline_group_invitation(invitation_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE group_invitations
  SET status = 'declined', updated_at = NOW()
  WHERE id = invitation_id
    AND invited_email = (SELECT email FROM profiles WHERE id = auth.uid())
    AND status = 'pending';

  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to delete group (only by creator)
CREATE OR REPLACE FUNCTION public.delete_group(group_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  group_creator UUID;
BEGIN
  -- Get the group creator
  SELECT created_by INTO group_creator
  FROM groups
  WHERE id = group_id;

  -- Check if current user is the creator
  IF group_creator != auth.uid() THEN
    RETURN FALSE;
  END IF;

  -- Delete group (cascade will handle related records)
  DELETE FROM groups WHERE id = group_id AND created_by = auth.uid();

  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- FUNCTION TO GET EVENTS FOR GROUP MEMBERS
-- =============================================
CREATE OR REPLACE FUNCTION public.get_group_events(user_id UUID)
RETURNS TABLE (
  id UUID,
  created_at TIMESTAMPTZ,
  title TEXT,
  description TEXT,
  event_date DATE,
  event_time TEXT,
  event_type TEXT,
  created_by UUID,
  assignee_id UUID,
  group_id UUID,
  category TEXT,
  assignee JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    e.id,
    e.created_at,
    e.title,
    e.description,
    e.event_date,
    e.event_time,
    e.event_type,
    e.created_by,
    e.assignee_id,
    e.group_id,
    e.category,
    jsonb_build_object(
      'id', p.id,
      'full_name', p.full_name,
      'email', p.email
    ) as assignee
  FROM events e
  LEFT JOIN profiles p ON e.assignee_id = p.id
  WHERE e.group_id IN (
    SELECT gm.group_id
    FROM group_members gm
    WHERE gm.user_id = user_id
    UNION
    SELECT g.id
    FROM groups g
    WHERE g.created_by = user_id
  )
  ORDER BY e.event_date ASC, e.event_time ASC;
END;
$$;

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================
CREATE INDEX IF NOT EXISTS idx_groups_created_by ON groups(created_by);
CREATE INDEX IF NOT EXISTS idx_group_members_group_id ON group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_group_members_user_id ON group_members(user_id);
CREATE INDEX IF NOT EXISTS idx_group_invitations_group_id ON group_invitations(group_id);
CREATE INDEX IF NOT EXISTS idx_group_invitations_invited_email ON group_invitations(invited_email);
CREATE INDEX IF NOT EXISTS idx_events_group_id ON events(group_id);
CREATE INDEX IF NOT EXISTS idx_events_created_by ON events(created_by);
CREATE INDEX IF NOT EXISTS idx_events_event_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_events_event_type ON events(event_type);
