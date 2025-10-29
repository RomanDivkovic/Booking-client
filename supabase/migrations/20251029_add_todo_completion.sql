-- Add completed status to events table for todos
ALTER TABLE events ADD COLUMN IF NOT EXISTS completed BOOLEAN DEFAULT FALSE;
ALTER TABLE events ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE;

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_events_completed ON events(completed);
CREATE INDEX IF NOT EXISTS idx_events_completed_at ON events(completed_at);