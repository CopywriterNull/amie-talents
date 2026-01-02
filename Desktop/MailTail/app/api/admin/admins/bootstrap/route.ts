import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/server";

// Designated first admin email
const FIRST_ADMIN_EMAIL = "lennyhuynh526@gmail.com";

// POST - Bootstrap super_admin for designated admin email
export async function POST() {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized - not logged in" }, { status: 401 });
    }

    // Log for debugging
    console.log("Bootstrap attempt by:", user.email, "user_id:", user.id);

    // Only allow the designated first admin to bootstrap
    if (user.email?.toLowerCase() !== FIRST_ADMIN_EMAIL.toLowerCase()) {
      return NextResponse.json({
        error: `Only ${FIRST_ADMIN_EMAIL} can use this endpoint. You are logged in as: ${user.email}`
      }, { status: 403 });
    }

    // Use service client to bypass RLS
    const serviceSupabase = createServiceClient();

    // Check if user is already in admins table
    const { data: existingAdmin, error: selectError } = await serviceSupabase
      .from("admins")
      .select("id, role")
      .eq("user_id", user.id)
      .single();

    console.log("Existing admin check:", existingAdmin, selectError?.message);

    if (existingAdmin) {
      // Update to super_admin
      const { error: updateError } = await serviceSupabase
        .from("admins")
        .update({ role: "super_admin" })
        .eq("user_id", user.id);

      if (updateError) {
        console.error("Update error:", updateError);
        return NextResponse.json({ error: updateError.message }, { status: 500 });
      }
    } else {
      // Insert as super_admin
      const { error: insertError } = await serviceSupabase
        .from("admins")
        .insert({ user_id: user.id, role: "super_admin" });

      if (insertError) {
        console.error("Insert error:", insertError);
        return NextResponse.json({ error: insertError.message }, { status: 500 });
      }
    }

    return NextResponse.json({
      success: true,
      message: "You are now a super_admin"
    });
  } catch (error) {
    console.error("Bootstrap admin error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
