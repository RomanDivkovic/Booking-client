-- REVERT THESE POLICIES - They are breaking the app
-- Run this SQL in Supabase to restore functionality

-- Drop the problematic policies
DROP POLICY IF EXISTS "profiles_invited_by_access" ON profiles;
DROP POLICY IF EXISTS "profiles_group_members_access" ON profiles;

-- The original profiles policies remain:
-- "Users can view their own profile"
-- "Users can update their own profile"
-- "Users can insert their own profile"

-- After running this, the app should work again!
