import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    // Find the invite by token
    const { data: invite, error: inviteError } = await supabase
      .from("team_invites")
      .select("id, team_id, email, role, status, expires_at")
      .eq("token", token)
      .single();

    if (inviteError || !invite) {
      return NextResponse.json({ error: "Invite not found" }, { status: 404 });
    }

    // Check if invite is still pending
    if (invite.status !== "pending") {
      return NextResponse.json(
        { error: "This invite has already been used" },
        { status: 400 }
      );
    }

    // Check if invite has expired
    if (new Date(invite.expires_at) < new Date()) {
      await supabase
        .from("team_invites")
        .update({ status: "expired" })
        .eq("id", invite.id);

      return NextResponse.json(
        { error: "This invite has expired" },
        { status: 400 }
      );
    }

    // Verify email matches (case-insensitive)
    if (invite.email.toLowerCase() !== user.email?.toLowerCase()) {
      return NextResponse.json(
        { error: "This invite was sent to a different email address" },
        { status: 403 }
      );
    }

    // Check if user is already a member
    const { data: existingMember } = await supabase
      .from("team_members")
      .select("id")
      .eq("team_id", invite.team_id)
      .eq("user_id", user.id)
      .single();

    if (existingMember) {
      // Mark invite as accepted anyway
      await supabase
        .from("team_invites")
        .update({ status: "accepted" })
        .eq("id", invite.id);

      return NextResponse.json({
        message: "You are already a member of this team",
        team_id: invite.team_id
      });
    }

    // Add user to team
    const { error: memberError } = await supabase
      .from("team_members")
      .insert({
        team_id: invite.team_id,
        user_id: user.id,
        role: invite.role,
      });

    if (memberError) {
      console.error("Add member error:", memberError);
      return NextResponse.json(
        { error: "Failed to join team" },
        { status: 500 }
      );
    }

    // Mark invite as accepted
    await supabase
      .from("team_invites")
      .update({ status: "accepted" })
      .eq("id", invite.id);

    return NextResponse.json({
      message: "Successfully joined team",
      team_id: invite.team_id,
    });
  } catch (error) {
    console.error("Accept invite error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
