
-- Allow users to add themselves as members when creating groups
CREATE POLICY "Users can add themselves to groups" ON public.group_members
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Make sure users can view their own memberships
CREATE POLICY "Users can view their own memberships" ON public.group_members
  FOR SELECT USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID REFERENCES public.groups ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  event_time TEXT,
  event_type TEXT NOT NULL,
  category TEXT,
  assignee_id UUID REFERENCES auth.users,
  created_by UUID REFERENCES auth.users,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
