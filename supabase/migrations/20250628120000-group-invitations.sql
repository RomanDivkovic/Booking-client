-- Create group_invitations table for managing invitations
CREATE TABLE public.group_invitations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID REFERENCES public.groups ON DELETE CASCADE NOT NULL,
  invited_user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  invited_by UUID REFERENCES auth.users NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(group_id, invited_user_id)
);

-- Enable Row Level Security
ALTER TABLE public.group_invitations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for group_invitations
CREATE POLICY "Users can view invitations sent to them" ON public.group_invitations
  FOR SELECT USING (auth.uid() = invited_user_id);

CREATE POLICY "Users can view invitations they sent" ON public.group_invitations
  FOR SELECT USING (auth.uid() = invited_by);

CREATE POLICY "Group creators can send invitations" ON public.group_invitations
  FOR INSERT WITH CHECK (
    auth.uid() = invited_by AND
    EXISTS (
      SELECT 1 FROM public.groups 
      WHERE id = group_id AND created_by = auth.uid()
    )
  );

CREATE POLICY "Invited users can update their invitations" ON public.group_invitations
  FOR UPDATE USING (auth.uid() = invited_user_id);

-- Function to handle invitation acceptance
CREATE OR REPLACE FUNCTION public.accept_group_invitation(invitation_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  invitation_record RECORD;
BEGIN
  -- Get the invitation
  SELECT * INTO invitation_record 
  FROM public.group_invitations 
  WHERE id = invitation_id AND invited_user_id = auth.uid() AND status = 'pending';
  
  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;
  
  -- Update invitation status
  UPDATE public.group_invitations 
  SET status = 'accepted', updated_at = now() 
  WHERE id = invitation_id;
  
  -- Add user to group
  INSERT INTO public.group_members (group_id, user_id, role)
  VALUES (invitation_record.group_id, invitation_record.invited_user_id, 'member')
  ON CONFLICT (group_id, user_id) DO NOTHING;
  
  RETURN TRUE;
END;
$$;

-- Function to handle invitation decline
CREATE OR REPLACE FUNCTION public.decline_group_invitation(invitation_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.group_invitations 
  SET status = 'declined', updated_at = now() 
  WHERE id = invitation_id AND invited_user_id = auth.uid() AND status = 'pending';
  
  RETURN FOUND;
END;
$$;

-- Function to cancel invitation (for group creators)
CREATE OR REPLACE FUNCTION public.cancel_group_invitation(invitation_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.group_invitations 
  WHERE id = invitation_id 
  AND invited_by = auth.uid() 
  AND status = 'pending';
  
  RETURN FOUND;
END;
$$; 