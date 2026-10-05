-- Ops Hub schema.
--
-- `position` preserves the order items were written in, because the UI groups
-- the runbook chronologically by first appearance rather than by date — two
-- items can share a due date and still need a stable order.

CREATE TABLE IF NOT EXISTS items (
  id          TEXT PRIMARY KEY,
  title       TEXT NOT NULL,
  detail      TEXT,
  section     TEXT NOT NULL,
  grp         TEXT,
  due         DATE,
  status      TEXT NOT NULL DEFAULT 'open'
              CHECK (status IN ('open','doing','done','unknown')),
  source      TEXT,
  notes       TEXT,
  is_new      BOOLEAN NOT NULL DEFAULT FALSE,
  position    INTEGER NOT NULL DEFAULT 0,
  updated_at  TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS items_section_position ON items (section, position);
CREATE INDEX IF NOT EXISTS items_due ON items (due) WHERE status <> 'done';

CREATE TABLE IF NOT EXISTS notes (
  id          TEXT PRIMARY KEY,
  body        TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Single-row key/value for lastRefresh and coversThrough.
CREATE TABLE IF NOT EXISTS meta (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- Phase 3 lands here: one row per agent invocation, so every action a button
-- fires is auditable after the fact.
CREATE TABLE IF NOT EXISTS agent_runs (
  id           TEXT PRIMARY KEY,
  item_id      TEXT REFERENCES items(id) ON DELETE CASCADE,
  action       TEXT NOT NULL,
  status       TEXT NOT NULL DEFAULT 'running'
               CHECK (status IN ('running','staged','sent','failed','discarded')),
  input        JSONB,
  output       JSONB,
  error        TEXT,
  started_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  finished_at  TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS agent_runs_item ON agent_runs (item_id, started_at DESC);

-- Raw source payloads pushed up by the Mac bridge. Kept as-is so a merge can be
-- re-run against the same input after a prompt change, and so a bad merge is
-- diagnosable after the fact.
CREATE TABLE IF NOT EXISTS source_digests (
  id          TEXT PRIMARY KEY,
  source      TEXT NOT NULL,          -- granola | imessage | gmail
  payload     JSONB NOT NULL,
  covers_from DATE,
  covers_to   DATE,
  merged_at   TIMESTAMPTZ,
  received_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS digests_pending
  ON source_digests (received_at DESC) WHERE merged_at IS NULL;

-- One row per thing owed, from two directions:
--   thread     — someone is waiting on a reply
--   commitment — something was promised on a call
--
-- Kept apart from `items` on purpose. An item is a task that stays until it's
-- done; an owed row has a *clock* on it and resolves the moment the reply goes
-- out. Merging the two would mean either items grow a decay model or owed rows
-- linger after they stop being owed.
CREATE TABLE IF NOT EXISTS owed (
  id            TEXT PRIMARY KEY,
  kind          TEXT NOT NULL CHECK (kind IN ('thread','commitment')),
  who           TEXT NOT NULL,
  what          TEXT NOT NULL,
  context       TEXT,
  tier          TEXT NOT NULL DEFAULT 'social'
                CHECK (tier IN ('client','deal','partner','internal','social')),
  tier_reason   TEXT,
  source        TEXT,
  thread_label  TEXT,
  -- When the clock started: the timestamp of the message that went unanswered,
  -- or the date the promise was made. NOT when the row was created — a thread
  -- discovered late is still four days old.
  waiting_since TIMESTAMPTZ NOT NULL,
  due           DATE,
  status        TEXT NOT NULL DEFAULT 'open'
                CHECK (status IN ('open','drafted','sent','done','snoozed','dismissed')),
  snooze_until  TIMESTAMPTZ,
  draft         TEXT,
  draft_kind    TEXT,
  drafted_at    TIMESTAMPTZ,
  item_id       TEXT REFERENCES items(id) ON DELETE SET NULL,
  first_seen    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_seen     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS owed_live ON owed (tier, waiting_since)
  WHERE status IN ('open','drafted','snoozed');
CREATE INDEX IF NOT EXISTS owed_thread ON owed (thread_label) WHERE kind = 'thread';

-- Cron agents record runs too, and "ok"/"skipped" are the honest words for a
-- scheduled pass that produced nothing to stage. Widened here rather than in a
-- new table so one query answers "when did each agent last work?".
ALTER TABLE agent_runs DROP CONSTRAINT IF EXISTS agent_runs_status_check;
ALTER TABLE agent_runs ADD CONSTRAINT agent_runs_status_check
  CHECK (status IN ('running','staged','sent','failed','discarded','ok','skipped'));

CREATE INDEX IF NOT EXISTS agent_runs_action ON agent_runs (action, started_at DESC);
