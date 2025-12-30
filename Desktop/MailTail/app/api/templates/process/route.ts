import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { decrypt } from "@/lib/encryption";
import { getTemplate, createTemplate, injectFooter } from "@/lib/klaviyo";
import { canTeamProcessTemplate, incrementTrialUsage, logActivity } from "@/lib/admin";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { templateId } = await request.json();

    if (!templateId || typeof templateId !== "string") {
      return NextResponse.json(
        { error: "Template ID is required" },
        { status: 400 }
      );
    }

    // Get user's team membership
    const { data: membership } = await supabase
      .from("team_members")
      .select("team_id")
      .eq("user_id", user.id)
      .single();

    const teamId = membership?.team_id;

    // Check subscription status if user has a team
    if (teamId) {
      const canProcess = await canTeamProcessTemplate(teamId);
      if (!canProcess.allowed) {
        return NextResponse.json(
          { error: canProcess.reason || "Cannot process templates" },
          { status: 403 }
        );
      }
    }

    // Get Klaviyo connection (team-based if available, otherwise user-based)
    let connection;
    if (teamId) {
      const { data } = await supabase
        .from("klaviyo_connections")
        .select("encrypted_api_key")
        .eq("team_id", teamId)
        .single();
      connection = data;
    }

    // Fallback to user-based connection
    if (!connection) {
      const { data } = await supabase
        .from("klaviyo_connections")
        .select("encrypted_api_key")
        .eq("user_id", user.id)
        .single();
      connection = data;
    }

    if (!connection) {
      return NextResponse.json(
        { error: "Please connect your Klaviyo account first" },
        { status: 400 }
      );
    }

    // Decrypt the API key
    const apiKey = decrypt(connection.encrypted_api_key);

    // Fetch the original template from Klaviyo
    const { html: originalHtml, name: originalName } = await getTemplate(
      apiKey,
      templateId
    );

    // Inject the footer
    const newHtml = injectFooter(originalHtml);

    // Create new template in Klaviyo
    const newName = `${originalName} - MailTail`;
    const newTemplateId = await createTemplate(apiKey, newName, newHtml);

    // Save to processing history
    const { error: dbError } = await supabase
      .from("processed_templates")
      .insert({
        user_id: user.id,
        team_id: teamId || null,
        original_template_id: templateId,
        new_template_id: newTemplateId,
        template_name: newName,
      });

    if (dbError) {
      console.error("Database error:", dbError);
      // Don't fail the request, template was already created
    }

    // Increment trial usage if team has usage-based trial
    if (teamId) {
      await incrementTrialUsage(teamId);

      // Log activity
      await logActivity(
        "template_processed",
        teamId,
        user.id,
        {
          original_template_id: templateId,
          new_template_id: newTemplateId,
          template_name: newName,
        }
      );
    }

    return NextResponse.json({
      success: true,
      newTemplateId,
      templateName: newName,
    });
  } catch (error) {
    console.error("Process error:", error);
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
