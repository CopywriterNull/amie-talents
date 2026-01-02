-- API keys for web feed access (one per team, auto-created on first template processing)
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  api_key VARCHAR(67) UNIQUE NOT NULL,  -- mt_[64 hex chars]
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_used_at TIMESTAMPTZ,
  request_count INTEGER DEFAULT 0,
  UNIQUE(team_id)
);

-- Enable RLS
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Policy: Team members can read their team's API key
CREATE POLICY "Team members can read api_keys" ON api_keys
  FOR SELECT
  USING (
    team_id IN (
      SELECT team_id FROM team_members WHERE user_id = auth.uid()
    )
  );

-- Policy: Team admins/owners can update their team's API key
CREATE POLICY "Team admins can update api_keys" ON api_keys
  FOR UPDATE
  USING (
    team_id IN (
      SELECT team_id FROM team_members
      WHERE user_id = auth.uid() AND role IN ('admin', 'owner')
    )
  );

-- Index for fast API key lookups (public endpoint)
CREATE INDEX idx_api_keys_api_key ON api_keys(api_key);

-- Track when the web feed was created in Klaviyo for a team
ALTER TABLE klaviyo_connections ADD COLUMN IF NOT EXISTS web_feed_id TEXT;
ALTER TABLE klaviyo_connections ADD COLUMN IF NOT EXISTS web_feed_created_at TIMESTAMPTZ;

-- Add feed_injected column to processed_templates to track which templates use feeds
ALTER TABLE processed_templates ADD COLUMN IF NOT EXISTS feed_injected BOOLEAN DEFAULT false;
