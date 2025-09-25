-- Add DELETE policy for groups table
CREATE POLICY "Users can delete groups they created" ON public.groups
  FOR DELETE USING (auth.uid() = created_by);

-- Create RPC function for deleting groups
CREATE OR REPLACE FUNCTION public.delete_group(group_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_id UUID := auth.uid();
  is_admin BOOLEAN;
BEGIN
  -- Check if user is admin of the group
  SELECT EXISTS(
    SELECT 1 FROM public.group_members
    WHERE group_members.group_id = delete_group.group_id
    AND group_members.user_id = user_id
    AND group_members.role = 'admin'
  ) INTO is_admin;

  IF NOT is_admin THEN
    RAISE EXCEPTION 'User is not an admin of this group';
  END IF;

  -- Delete the group (cascade will handle related records)
  DELETE FROM public.groups WHERE id = group_id AND created_by = user_id;

  RETURN FOUND;
END;
$$;