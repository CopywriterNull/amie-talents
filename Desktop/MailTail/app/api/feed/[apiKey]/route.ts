import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getFeedResponse } from "@/lib/footer-content";

/**
 * Public Web Feed Endpoint
 *
 * This endpoint is called by Klaviyo when rendering emails that use the MailTail web feed.
 * It must respond quickly (< 5 seconds) and return JSON with a "content" field.
 *
 * Security is handled via unique API keys - Klaviyo cannot send auth headers.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ apiKey: string }> }
) {
  const startTime = Date.now();

  try {
    const { apiKey } = await params;

    // Basic validation
    if (!apiKey || !apiKey.startsWith("mt_") || apiKey.length !== 67) {
      // Return empty content for invalid keys (email still sends, just without footer)
      return NextResponse.json({ content: "" }, { status: 200 });
    }

    // Create a direct Supabase client (no auth context needed)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Look up the API key
    const { data: keyData, error } = await supabase
      .from("api_keys")
      .select("id, team_id, is_active, request_count")
      .eq("api_key", apiKey)
      .single();

    if (error || !keyData) {
      // Invalid key - return empty content (graceful degradation)
      return NextResponse.json({ content: "" }, { status: 200 });
    }

    // Check if key is active
    if (!keyData.is_active) {
      // Inactive key - return empty content
      return NextResponse.json({ content: "" }, { status: 200 });
    }

    // Update usage stats asynchronously (don't wait for it)
    // This keeps response time fast
    supabase
      .from("api_keys")
      .update({
        last_used_at: new Date().toISOString(),
        request_count: (keyData.request_count || 0) + 1,
      })
      .eq("id", keyData.id)
      .then(() => {
        // Log response time for monitoring
        const duration = Date.now() - startTime;
        if (duration > 1000) {
          console.warn(`Feed endpoint slow response: ${duration}ms for key ${apiKey.slice(0, 10)}...`);
        }
      });

    // Return the footer content
    const response = getFeedResponse();

    return NextResponse.json(response, {
      status: 200,
      headers: {
        // Cache for 5 minutes on CDN, stale-while-revalidate for 1 hour
        "Cache-Control": "public, max-age=300, stale-while-revalidate=3600",
        // Allow CORS for Klaviyo
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Feed endpoint error:", error);
    // Return empty content on error (graceful degradation)
    return NextResponse.json({ content: "" }, { status: 200 });
  }
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
