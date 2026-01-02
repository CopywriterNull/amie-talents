-- Migration: Add team_id to processed_templates and backfill existing records
-- Run this if you see 0 templates in admin dashboard despite having processed templates

-- Step 1: Add team_id column if it doesn't exist
ALTER TABLE processed_templates ADD COLUMN IF NOT EXISTS team_id UUID REFERENCES teams(id) ON DELETE CASCADE;

-- Step 2: Backfill team_id for existing templates based on user's team membership
UPDATE processed_templates pt
SET team_id = tm.team_id
FROM team_members tm
WHERE pt.user_id = tm.user_id
  AND pt.team_id IS NULL;

-- Step 3: Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_processed_templates_team_id ON processed_templates(team_id);

-- Verify the update
SELECT
  'Total templates' as metric,
  COUNT(*) as count
FROM processed_templates
UNION ALL
SELECT
  'Templates with team_id' as metric,
  COUNT(*) as count
FROM processed_templates
WHERE team_id IS NOT NULL
UNION ALL
SELECT
  'Templates without team_id' as metric,
  COUNT(*) as count
FROM processed_templates
WHERE team_id IS NULL;
