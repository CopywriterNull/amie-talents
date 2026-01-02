import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET - List all admins
export async function GET() {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is super_admin
    const { data: currentAdmin } = await supabase
      .from("admins")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (!currentAdmin || currentAdmin.role !== "super_admin") {
      return NextResponse.json({ error: "Only super admins can view admin list" }, { status: 403 });
    }

    // Get all admins with their profile info
    const { data: admins, error } = await supabase
      .from("admins")
      .select("id, user_id, role, created_at")
      .order("created_at", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Get profile info for each admin
    const userIds = admins.map(a => a.user_id);
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, email, first_name, last_name")
      .in("id", userIds);

    const profilesById = new Map(
      (profiles || []).map(p => [p.id, p])
    );

    const adminsWithProfiles = admins.map(admin => ({
      ...admin,
      profile: profilesById.get(admin.user_id) || null,
    }));

    return NextResponse.json({ admins: adminsWithProfiles });
  } catch (error) {
    console.error("Get admins error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST - Add new admin by email
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { email, role = "admin" } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is super_admin
    const { data: currentAdmin } = await supabase
      .from("admins")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (!currentAdmin || currentAdmin.role !== "super_admin") {
      return NextResponse.json({ error: "Only super admins can add new admins" }, { status: 403 });
    }

    // Find the user by email
    const { data: targetProfile, error: profileError } = await supabase
      .from("profiles")
      .select("id, email")
      .eq("email", email.toLowerCase())
      .single();

    if (profileError || !targetProfile) {
      return NextResponse.json({ error: "User not found. They must have an account first." }, { status: 404 });
    }

    // Check if already an admin
    const { data: existingAdmin } = await supabase
      .from("admins")
      .select("id")
      .eq("user_id", targetProfile.id)
      .single();

    if (existingAdmin) {
      return NextResponse.json({ error: "User is already an admin" }, { status: 400 });
    }

    // Add as admin
    const { error: insertError } = await supabase
      .from("admins")
      .insert({
        user_id: targetProfile.id,
        role: role === "super_admin" ? "super_admin" : "admin",
      });

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: `${email} added as admin` });
  } catch (error) {
    console.error("Add admin error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE - Remove admin
export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const adminId = searchParams.get("id");

    if (!adminId) {
      return NextResponse.json({ error: "Admin ID is required" }, { status: 400 });
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is super_admin
    const { data: currentAdmin } = await supabase
      .from("admins")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (!currentAdmin || currentAdmin.role !== "super_admin") {
      return NextResponse.json({ error: "Only super admins can remove admins" }, { status: 403 });
    }

    // Don't allow removing yourself
    const { data: targetAdmin } = await supabase
      .from("admins")
      .select("user_id")
      .eq("id", adminId)
      .single();

    if (targetAdmin?.user_id === user.id) {
      return NextResponse.json({ error: "You cannot remove yourself as admin" }, { status: 400 });
    }

    // Remove admin
    const { error } = await supabase
      .from("admins")
      .delete()
      .eq("id", adminId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Remove admin error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
