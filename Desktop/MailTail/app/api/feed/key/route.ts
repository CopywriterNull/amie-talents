import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getTeamApiKey, ensureTeamHasApiKey, regenerateTeamApiKey, setApiKeyActive, maskApiKey, getFeedUrl } from "@/lib/api-keys";

/**
 * GET /api/feed/key
 * Get the current team's API key info
 */
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's team
    const { data: membership } = await supabase
      .from("team_members")
      .select("team_id")
      .eq("user_id", user.id)
      .single();

    if (!membership?.team_id) {
      return NextResponse.json({ error: "No team found" }, { status: 400 });
    }

    // Get or create API key
    const apiKeyRecord = await ensureTeamHasApiKey(membership.team_id);

    return NextResponse.json({
      id: apiKeyRecord.id,
      api_key: apiKeyRecord.api_key,
      masked_key: maskApiKey(apiKeyRecord.api_key),
      is_active: apiKeyRecord.is_active,
      request_count: apiKeyRecord.request_count,
      last_used_at: apiKeyRecord.last_used_at,
      feed_url: getFeedUrl(apiKeyRecord.api_key),
    });
  } catch (error) {
    console.error("Get API key error:", error);
    return NextResponse.json(
      { error: "Failed to get API key" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/feed/key
 * Regenerate the team's API key
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const action = body.action as string;

    // Get user's team
    const { data: membership } = await supabase
      .from("team_members")
      .select("team_id, role")
      .eq("user_id", user.id)
      .single();

    if (!membership?.team_id) {
      return NextResponse.json({ error: "No team found" }, { status: 400 });
    }

    // Only admins can modify API keys
    if (membership.role !== "admin" && membership.role !== "owner") {
      return NextResponse.json({ error: "Only admins can modify API keys" }, { status: 403 });
    }

    if (action === "regenerate") {
      const newKey = await regenerateTeamApiKey(membership.team_id);
      return NextResponse.json({
        success: true,
        api_key: newKey,
        masked_key: maskApiKey(newKey),
        feed_url: getFeedUrl(newKey),
        message: "API key regenerated. Remember to update the web feed in Klaviyo.",
      });
    }

    if (action === "toggle") {
      const isActive = body.is_active as boolean;
      await setApiKeyActive(membership.team_id, isActive);
      return NextResponse.json({
        success: true,
        is_active: isActive,
        message: isActive ? "Web feed activated" : "Web feed deactivated",
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("API key action error:", error);
    return NextResponse.json(
      { error: "Failed to update API key" },
      { status: 500 }
    );
  }
}
