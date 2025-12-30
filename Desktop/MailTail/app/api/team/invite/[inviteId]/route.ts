import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ inviteId: string }> }
) {
  try {
    const supabase = await createClient();
    const { inviteId } = await params;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify user owns the team that this invite belongs to
    const { data: invite } = await supabase
      .from("team_invites")
      .select("id, team_id, teams!inner(owner_id)")
      .eq("id", inviteId)
      .single();

    if (!invite) {
      return NextResponse.json({ error: "Invite not found" }, { status: 404 });
    }

    // Check if user is owner or admin of the team
    const { data: membership } = await supabase
      .from("team_members")
      .select("role")
      .eq("team_id", invite.team_id)
      .eq("user_id", user.id)
      .single();

    if (!membership || !["owner", "admin"].includes(membership.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Delete the invite
    const { error: deleteError } = await supabase
      .from("team_invites")
      .delete()
      .eq("id", inviteId);

    if (deleteError) {
      console.error("Delete invite error:", deleteError);
      return NextResponse.json(
        { error: "Failed to cancel invite" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Invite cancelled" });
  } catch (error) {
    console.error("Cancel invite error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
