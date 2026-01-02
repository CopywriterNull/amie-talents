import { randomBytes } from "crypto";
import { createServiceClient } from "@/lib/supabase/server";

/**
 * Generate a new API key with mt_ prefix
 * Format: mt_[64 hex characters]
 */
export function generateApiKey(): string {
  return `mt_${randomBytes(32).toString("hex")}`;
}

/**
 * Mask an API key for display (show first 6 and last 4 chars)
 */
export function maskApiKey(apiKey: string): string {
  if (apiKey.length < 15) return apiKey;
  return `${apiKey.slice(0, 6)}...${apiKey.slice(-4)}`;
}

/**
 * Ensure a team has an API key, creating one if it doesn't exist
 * Returns the API key record
 */
export async function ensureTeamHasApiKey(teamId: string): Promise<{
  id: string;
  api_key: string;
  is_active: boolean;
  request_count: number;
  last_used_at: string | null;
}> {
  const supabase = createServiceClient();

  // Check if team already has an API key
  const { data: existing } = await supabase
    .from("api_keys")
    .select("id, api_key, is_active, request_count, last_used_at")
    .eq("team_id", teamId)
    .single();

  if (existing) {
    return existing;
  }

  // Create a new API key for the team
  const newApiKey = generateApiKey();
  const { data: created, error } = await supabase
    .from("api_keys")
    .insert({
      team_id: teamId,
      api_key: newApiKey,
      is_active: true,
    })
    .select("id, api_key, is_active, request_count, last_used_at")
    .single();

  if (error || !created) {
    throw new Error("Failed to create API key");
  }

  return created;
}

/**
 * Get a team's API key info
 */
export async function getTeamApiKey(teamId: string): Promise<{
  id: string;
  api_key: string;
  is_active: boolean;
  request_count: number;
  last_used_at: string | null;
  created_at: string;
} | null> {
  const supabase = createServiceClient();

  const { data } = await supabase
    .from("api_keys")
    .select("id, api_key, is_active, request_count, last_used_at, created_at")
    .eq("team_id", teamId)
    .single();

  return data;
}

/**
 * Regenerate a team's API key (deletes old one, creates new one)
 */
export async function regenerateTeamApiKey(teamId: string): Promise<string> {
  const supabase = createServiceClient();

  // Delete the old key
  await supabase.from("api_keys").delete().eq("team_id", teamId);

  // Create a new one
  const newKey = generateApiKey();
  const { error } = await supabase.from("api_keys").insert({
    team_id: teamId,
    api_key: newKey,
    is_active: true,
  });

  if (error) {
    throw new Error("Failed to regenerate API key");
  }

  return newKey;
}

/**
 * Toggle API key active status
 */
export async function setApiKeyActive(teamId: string, isActive: boolean): Promise<void> {
  const supabase = createServiceClient();

  const { error } = await supabase
    .from("api_keys")
    .update({ is_active: isActive })
    .eq("team_id", teamId);

  if (error) {
    throw new Error("Failed to update API key status");
  }
}

/**
 * Validate an API key and return the associated team_id
 * Also updates usage stats
 */
export async function validateAndUseApiKey(apiKey: string): Promise<{
  valid: boolean;
  teamId: string | null;
  isActive: boolean;
}> {
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("api_keys")
    .select("id, team_id, is_active, request_count")
    .eq("api_key", apiKey)
    .single();

  if (error || !data) {
    return { valid: false, teamId: null, isActive: false };
  }

  // Update usage stats (fire and forget, don't await)
  supabase
    .from("api_keys")
    .update({
      last_used_at: new Date().toISOString(),
      request_count: (data.request_count || 0) + 1,
    })
    .eq("id", data.id)
    .then(() => {});

  return {
    valid: true,
    teamId: data.team_id,
    isActive: data.is_active,
  };
}

/**
 * Get the feed URL for a team
 */
export function getFeedUrl(apiKey: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://mailtail.io";
  return `${baseUrl}/api/feed/${apiKey}`;
}
