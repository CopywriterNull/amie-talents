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

// Disconnect Klaviyo for a team
export async function DELETE(
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

    // Delete Klaviyo connection
    const { error } = await supabase
      .from("klaviyo_connections")
      .delete()
      .eq("team_id", teamId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    await logAdminAction(adminId, "disconnect_klaviyo", "team", teamId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Klaviyo disconnect error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
