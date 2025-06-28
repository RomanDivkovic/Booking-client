
-- Allow users to add themselves as members when creating groups
CREATE POLICY "Users can add themselves to groups" ON public.group_members
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Make sure users can view their own memberships
CREATE POLICY "Users can view their own memberships" ON public.group_members
  FOR SELECT USING (auth.uid() = user_id);
