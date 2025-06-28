
-- Drop the problematic policy that causes infinite recursion
DROP POLICY IF EXISTS "Users can view group members of their groups" ON public.group_members;

-- Create a simpler policy that doesn't cause recursion
CREATE POLICY "Users can view group members of their groups" ON public.group_members
  FOR SELECT USING (
    user_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM public.groups 
      WHERE id = group_id AND created_by = auth.uid()
    )
  );

-- Also fix the "Group creators can manage members" policy to be more specific
DROP POLICY IF EXISTS "Group creators can manage members" ON public.group_members;

CREATE POLICY "Group creators can insert members" ON public.group_members
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.groups 
      WHERE id = group_id AND created_by = auth.uid()
    )
  );

CREATE POLICY "Group creators can update members" ON public.group_members
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.groups 
      WHERE id = group_id AND created_by = auth.uid()
    )
  );

CREATE POLICY "Group creators can delete members" ON public.group_members
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.groups 
      WHERE id = group_id AND created_by = auth.uid()
    )
  );
