import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { logAdminAction } from "@/lib/admin";

async function getAdminId(supabase: Awaited<ReturnType<typeof createClient>>, userId: string) {
  const { data: admin } = await supabase
    .from("admins")
    .select("id, role")
    .eq("user_id", userId)
    .single();

  if (!admin || (admin.role !== "super_admin" && admin.role !== "admin")) {
    return null;
  }

  return admin.id;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: teamId } = await params;
    const supabase = await createClient();

    // Check auth
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check admin
    const adminId = await getAdminId(supabase, user.id);
    if (!adminId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { notes } = body;

    // Update or create subscription with notes
    const { data: existing } = await supabase
      .from("team_subscriptions")
      .select("id")
      .eq("team_id", teamId)
      .single();

    if (existing) {
      const { error } = await supabase
        .from("team_subscriptions")
        .update({ admin_notes: notes })
        .eq("team_id", teamId);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
    } else {
      const { error } = await supabase.from("team_subscriptions").insert({
        team_id: teamId,
        admin_notes: notes,
        status: "expired",
      });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
    }

    await logAdminAction(adminId, "update_notes", "team", teamId, {
      notes_length: notes?.length || 0,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Notes update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
