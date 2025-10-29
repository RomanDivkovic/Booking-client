# How to Apply the Invitation Fixes

## Quick Summary of Changes

### Code Changes ✅ DONE
1. **Invitations.tsx**: Now refetches groups after accepting an invitation
2. **useGroupInvitations.ts**: Fixed RPC response handling  
3. **useGroups.ts**: Already has real-time subscriptions

### Database Changes ⏳ NEEDS YOUR ACTION

You need to apply new RLS policies to allow users to see inviter profiles.

## Option 1: Using Supabase CLI (Recommended)

1. Run the migration file:
```bash
cd /Users/romandivkovic/Documents/Repos/Roman/hem-kalender-samarbete-main
npx supabase migration up
```

Or push all migrations:
```bash
npx supabase db push
```

## Option 2: Using Supabase Dashboard (Manual)

1. Go to your Supabase Dashboard
2. Click on **SQL Editor**
3. Click **New Query**
4. Copy and paste this SQL:

```sql
-- Drop existing policies if they exist (optional, prevents errors)
DROP POLICY IF EXISTS "profiles_invited_by_access" ON profiles;
DROP POLICY IF EXISTS "profiles_group_members_access" ON profiles;

-- Allow users to view profiles of people who invited them
CREATE POLICY "profiles_invited_by_access" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM group_invitations
      WHERE group_invitations.invited_by = id
      AND group_invitations.invited_email = (SELECT email FROM profiles WHERE id = auth.uid())
    )
  );

-- Allow users to view profiles of group members (for people they share groups with)
CREATE POLICY "profiles_group_members_access" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM group_members gm1
      WHERE gm1.user_id = id
      AND gm1.group_id IN (
        SELECT gm2.group_id FROM group_members gm2
        WHERE gm2.user_id = auth.uid()
      )
    )
  );
```

5. Click **Run**
6. Close the query

## Option 3: Load the Simple RLS File in Supabase

The file `/ultra_simple_rls.sql` has been updated with the new policies. You can load it directly:

1. Go to Supabase Dashboard → SQL Editor
2. Click the folder icon to load a file
3. Select `ultra_simple_rls.sql`
4. Click **Run**

## Testing After Fix

1. **Create a test scenario:**
   - User A creates a group
   - User A invites User B

2. **User B checks invitations:**
   - Should see User A's name (not "Unknown user")
   - Should see the group name (not empty)

3. **User B accepts invitation:**
   - Should see success toast
   - Should be able to see the group in Calendar
   - Should see shared events

## What These Policies Do

### `profiles_invited_by_access`
- Allows a user to view the profile of anyone who invited them
- Example: User B can see User A's profile when viewing invitations

### `profiles_group_members_access`  
- Allows users to view profiles of others in their shared groups
- Example: Both users in a group can see each other's profiles

## Troubleshooting

If you still see "Unknown user":
1. Hard refresh browser: Cmd+Shift+R
2. Clear browser cache
3. Check Supabase logs for RLS policy errors

If calendar doesn't show after accepting:
1. Make sure the groups hook's real-time subscription is active
2. Check browser console for errors
3. Try manually clicking Calendar tab to refresh

