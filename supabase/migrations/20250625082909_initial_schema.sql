
-- Create groups table for household/group management
CREATE TABLE IF NOT EXISTS public.groups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_by UUID REFERENCES auth.users NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create group_members table for managing group membership
CREATE TABLE public.group_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID REFERENCES public.groups ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL DEFAULT 'member',
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(group_id, user_id)
);

-- Create events table for calendar events
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID REFERENCES public.groups ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  event_time TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('booking', 'task')),
  category TEXT NOT NULL,
  assignee_id UUID REFERENCES auth.users,
  created_by UUID REFERENCES auth.users NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for groups
CREATE POLICY "Users can view groups they are members of" ON public.groups
  FOR SELECT USING (
    id IN (
      SELECT group_id FROM public.group_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create groups" ON public.groups
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Group creators can update their groups" ON public.groups
  FOR UPDATE USING (auth.uid() = created_by);

-- RLS Policies for group_members
CREATE POLICY "Users can view group members of their groups" ON public.group_members
  FOR SELECT USING (
    group_id IN (
      SELECT group_id FROM public.group_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Group creators can manage members" ON public.group_members
  FOR ALL USING (
    group_id IN (
      SELECT id FROM public.groups 
      WHERE created_by = auth.uid()
    )
  );

CREATE POLICY "Users can join groups" ON public.group_members
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for events
CREATE POLICY "Users can view events in their groups" ON public.events
  FOR SELECT USING (
    group_id IN (
      SELECT group_id FROM public.group_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create events in their groups" ON public.events
  FOR INSERT WITH CHECK (
    group_id IN (
      SELECT group_id FROM public.group_members 
      WHERE user_id = auth.uid()
    ) AND auth.uid() = created_by
  );

CREATE POLICY "Users can update events in their groups" ON public.events
  FOR UPDATE USING (
    group_id IN (
      SELECT group_id FROM public.group_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete events they created" ON public.events
  FOR DELETE USING (auth.uid() = created_by);

