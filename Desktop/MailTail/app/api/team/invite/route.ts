import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendInviteEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { email, role } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    if (!["member", "admin"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    // Check if user is already invited
    const { data: existingInvite } = await supabase
      .from("team_invites")
      .select("id")
      .eq("email", email)
      .eq("status", "pending")
      .single();

    if (existingInvite) {
      return NextResponse.json(
        { error: "This email has already been invited" },
        { status: 400 }
      );
    }

    // Get or create team for user
    let { data: team } = await supabase
      .from("teams")
      .select("id")
      .eq("owner_id", user.id)
      .single();

    if (!team) {
      // Create team for user
      const { data: profile } = await supabase
        .from("profiles")
        .select("brand_name")
        .eq("id", user.id)
        .single();

      const { data: newTeam, error: teamError } = await supabase
        .from("teams")
        .insert({
          name: profile?.brand_name || "My Team",
          owner_id: user.id,
        })
        .select()
        .single();

      if (teamError) {
        console.error("Team creation error:", teamError);
        return NextResponse.json(
          { error: "Failed to create team" },
          { status: 500 }
        );
      }

      team = newTeam;

      // Add owner as team member
      await supabase.from("team_members").insert({
        team_id: team!.id,
        user_id: user.id,
        role: "owner",
      });
    }

    // Create invite
    const { data: invite, error: inviteError } = await supabase
      .from("team_invites")
      .insert({
        team_id: team!.id,
        email,
        role,
        invited_by: user.id,
      })
      .select()
      .single();

    if (inviteError) {
      console.error("Invite error:", inviteError);
      return NextResponse.json(
        { error: "Failed to create invite" },
        { status: 500 }
      );
    }

    // Get inviter's profile for the email
    const { data: inviterProfile } = await supabase
      .from("profiles")
      .select("first_name, last_name")
      .eq("id", user.id)
      .single();

    const inviterName = inviterProfile?.first_name && inviterProfile?.last_name
      ? `${inviterProfile.first_name} ${inviterProfile.last_name}`
      : user.email || "A team member";

    // Get team name
    const { data: teamData } = await supabase
      .from("teams")
      .select("name")
      .eq("id", team!.id)
      .single();

    const teamName = teamData?.name || "MailTail Team";

    // Send invite email
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const inviteLink = `${baseUrl}/invite/${invite.token}`;

    try {
      await sendInviteEmail({
        to: email,
        inviterName,
        teamName,
        role,
        inviteLink,
      });
    } catch (emailError) {
      console.error("Failed to send invite email:", emailError);
      // Don't fail the request if email fails - invite is still created
    }

    return NextResponse.json({
      message: "Invite sent successfully",
      invite: {
        id: invite.id,
        email: invite.email,
        role: invite.role,
        token: invite.token,
      },
    });
  } catch (error) {
    console.error("Invite error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
