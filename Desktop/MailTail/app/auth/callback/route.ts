import { createClient, createServiceClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    // Use regular client for auth session exchange
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      const user = data.user;
      const metadata = user.user_metadata || {};

      // Use service client for data operations to bypass RLS
      const serviceClient = createServiceClient();

      // Ensure profile exists with correct data
      const { error: profileError } = await serviceClient
        .from("profiles")
        .upsert({
          id: user.id,
          email: user.email,
          first_name: metadata.first_name || null,
          last_name: metadata.last_name || null,
          brand_name: metadata.brand_name || null,
        }, { onConflict: "id" });

      if (profileError) {
        console.error("Profile upsert error:", profileError);
      }

      // Check if user already has a team
      const { data: existingMembership } = await serviceClient
        .from("team_members")
        .select("team_id")
        .eq("user_id", user.id)
        .single();

      // If no team exists and brand_name is provided, create one
      if (!existingMembership && metadata.brand_name) {
        // Create team
        const { data: team, error: teamError } = await serviceClient
          .from("teams")
          .insert({
            name: metadata.brand_name,
            owner_id: user.id,
          })
          .select()
          .single();

        if (teamError) {
          console.error("Team creation error:", teamError);
        } else if (team) {
          // Add user as team owner/admin
          const { error: memberError } = await serviceClient
            .from("team_members")
            .insert({
              team_id: team.id,
              user_id: user.id,
              role: "admin",
            });

          if (memberError) {
            console.error("Team member creation error:", memberError);
          }
        }
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=auth_callback_error`);
}
