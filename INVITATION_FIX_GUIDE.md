# Steps to Fix the Invitation Issues

## Issue 1: Unknown User and Empty Group Name in Invitations
The problem is that the RLS (Row Level Security) policies on the `profiles` table only allow users to view their own profile. When the invitation query tries to join with `profiles` to get the inviter's name, it's blocked.

## Issue 2: Calendar Doesn't Show After Accepting Invitation
The groups list needs to be refreshed after accepting an invitation to show the newly joined group.

## Solution

### Step 1: Run the RLS Policy Migration in Supabase

Go to your Supabase dashboard → SQL Editor → New Query and run this SQL:

```sql
-- Allow users to view profiles of people who invited them
CREATE POLICY "Users can view profiles of people who invited them" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM group_invitations
      WHERE group_invitations.invited_by = id
      AND group_invitations.invited_email = (SELECT email FROM profiles WHERE id = auth.uid())
    )
  );

-- Allow users to view profiles of people in their groups
CREATE POLICY "Users can view profiles of group members" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM group_members
      WHERE group_members.user_id = id
      AND group_members.group_id IN (
        SELECT group_members.group_id
        FROM group_members
        WHERE group_members.user_id = auth.uid()
        UNION
        SELECT groups.id
        FROM groups
        WHERE groups.created_by = auth.uid()
      )
    )
  );

-- Allow group creators to view profiles of invited users
CREATE POLICY "Group creators can view invited user profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM group_invitations
      WHERE group_invitations.invited_by = auth.uid()
      AND (
        group_invitations.invited_user_id = id
        OR group_invitations.invited_by = id
      )
    )
  );
```

### Step 2: Code Changes Already Made

✅ **Invitations.tsx**: Updated to refetch groups after accepting an invitation
✅ **useGroupInvitations.ts**: Fixed the RPC response handling for `accept_group_invitation` and `decline_group_invitation`
✅ **useGroups.ts**: Already has real-time subscriptions for group_members changes

### What This Fixes

1. ✅ **Inviter name will display** - The RLS policy now allows the invited user to see the profile of who invited them
2. ✅ **Group name will display** - The group information is now properly accessible
3. ✅ **Calendar shows after accepting** - The groups list is manually refreshed and real-time subscriptions will keep it updated
4. ✅ **Automatic group updates** - Any changes to group membership will trigger an auto-refresh

## Testing

1. User A creates a group "TestGroup"
2. User A invites User B via email
3. User B logs in and goes to Invitations
4. User B should see:
   - The name of User A (not "Unknown user")
   - The group name "TestGroup" (not empty)
5. User B clicks Accept
6. User B should be redirected or see the group appear in their Calendar
7. User B can now see all events in the shared calendar

