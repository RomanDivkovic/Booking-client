/* global console */
import { supabase } from "./src/integrations/supabase/client.js";

async function createProfilesForExistingUsers() {
  try {
    // Get all users from auth.users (this requires admin privileges)
    // Since we can't access auth.users directly, let's check if current user has a profile
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      console.log("No authenticated user found");
      return;
    }

    console.log("Current user:", user.email);

    // Check if profile exists
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (error) {
      console.error("Error checking profile:", error);
      return;
    }

    if (!profile) {
      console.log("Creating profile for user:", user.email);
      const { error: insertError } = await supabase.from("profiles").insert({
        id: user.id,
        email: user.email || "",
        full_name: user.user_metadata?.full_name || user.email || ""
      });

      if (insertError) {
        console.error("Error creating profile:", insertError);
      } else {
        console.log("Profile created successfully");
      }
    } else {
      console.log("Profile already exists for user:", user.email);
    }
  } catch (error) {
    console.error("Unexpected error:", error);
  }
}

createProfilesForExistingUsers();
