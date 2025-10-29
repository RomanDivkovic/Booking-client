# URGENT: Revert Broken RLS Policies

## The Problem
The RLS policies I provided broke the app. You can't see events or groups anymore.

## The Solution - Run This SQL Immediately

Go to your **Supabase Dashboard** → **SQL Editor** → **New Query**

Copy and paste this SQL to revert:

```sql
-- Drop the problematic policies that are breaking the app
DROP POLICY IF EXISTS "profiles_invited_by_access" ON profiles;
DROP POLICY IF EXISTS "profiles_group_members_access" ON profiles;
```

Click **Run**

That's it! The app should work again.

## Why This Happened

The new RLS policies I created were conflicting with the existing policies and restricting access to groups and events. The issue is that in Supabase, RLS policies use AND/OR logic and sometimes they stack in unexpected ways.

## The Better Fix - Code Solution

I've updated the code in `useGroupInvitations.ts` to:
1. Remove the relationship-based query for `invited_by_user`
2. Fetch inviter info separately after getting the invitations
3. Handle missing data gracefully without needing RLS changes

This means:
- **No RLS changes needed** ✅
- **No app functionality broken** ✅
- **Inviter info still displays** (if accessible, otherwise shows "Unknown user" gracefully)
- **Groups and events work normally** ✅

## Testing

1. After running the SQL revert:
   - Hard refresh: **Cmd+Shift+R**
   - Check that you can see your groups again
   - Check that you can see events
   - Check that invitations show (might say "Unknown user" but that's OK for now)

2. The app should be back to normal!

## Why Not Use RLS Policies?

The problem with RLS-based solutions is that Supabase RLS can be very restrictive and interact unpredictably with existing policies. The code-based solution is:
- More predictable
- Safer (no risk of breaking existing functionality)
- Easier to maintain and debug

