import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { decrypt } from "@/lib/encryption";
import { listTemplates } from "@/lib/klaviyo";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's Klaviyo connection
    const { data: connection } = await supabase
      .from("klaviyo_connections")
      .select("encrypted_api_key")
      .eq("user_id", user.id)
      .single();

    if (!connection) {
      return NextResponse.json(
        { error: "Klaviyo not connected. Please connect your account in Settings." },
        { status: 400 }
      );
    }

    // Decrypt API key
    const apiKey = decrypt(connection.encrypted_api_key);

    // Get cursor from query params for pagination
    const cursor = request.nextUrl.searchParams.get("cursor") || undefined;

    // Fetch templates from Klaviyo
    const { templates, nextCursor } = await listTemplates(apiKey, cursor);

    return NextResponse.json({
      templates,
      nextCursor,
    });
  } catch (error) {
    console.error("List templates error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch templates" },
      { status: 500 }
    );
  }
}
