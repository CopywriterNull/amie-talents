import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { startTrial, extendTrial, endTrial } from "@/lib/admin";

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
    const { action, type, value } = body;

    let result;

    switch (action) {
      case "start":
        if (!type || !value) {
          return NextResponse.json(
            { error: "Missing type or value" },
            { status: 400 }
          );
        }
        result = await startTrial(teamId, type, value, adminId);
        break;

      case "extend":
        if (!value) {
          return NextResponse.json({ error: "Missing value" }, { status: 400 });
        }
        result = await extendTrial(teamId, value, adminId);
        break;

      case "end":
        result = await endTrial(teamId, adminId);
        break;

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Trial action error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
