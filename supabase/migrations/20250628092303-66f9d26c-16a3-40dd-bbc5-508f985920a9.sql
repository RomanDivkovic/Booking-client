
-- First, let's drop all existing problematic policies
DROP POLICY IF EXISTS "Users can view their own memberships" ON public.group_members;
DROP POLICY IF EXISTS "Users can add themselves to groups" ON public.group_members;
DROP POLICY IF EXISTS "Users can view group members of their groups" ON public.group_members;
DROP POLICY IF EXISTS "Group creators can insert members" ON public.group_members;
DROP POLICY IF EXISTS "Group creators can update members" ON public.group_members;
DROP POLICY IF EXISTS "Group creators can delete members" ON public.group_members;

-- Drop any existing policies on groups table
DROP POLICY IF EXISTS "Users can view groups they are members of" ON public.groups;
DROP POLICY IF EXISTS "Users can create groups" ON public.groups;
DROP POLICY IF EXISTS "Group creators can update their groups" ON public.groups;

-- Create simple, non-recursive policies for groups table
CREATE POLICY "Users can create groups" ON public.groups
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can view groups they created" ON public.groups
  FOR SELECT USING (auth.uid() = created_by);

CREATE POLICY "Users can update groups they created" ON public.groups
  FOR UPDATE USING (auth.uid() = created_by);

-- Create simple, non-recursive policies for group_members table
CREATE POLICY "Users can view their own memberships" ON public.group_members
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can add themselves as members" ON public.group_members
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Group creators can add members" ON public.group_members
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT created_by FROM public.groups WHERE id = group_id
    )
  );

CREATE POLICY "Group creators can view members" ON public.group_members
  FOR SELECT USING (
    auth.uid() IN (
      SELECT created_by FROM public.groups WHERE id = group_id
    )
  );
