import { promises as fs } from "fs";
import path from "path";
import { hasDatabase, sql } from "./db";
import { AGENTS, healthOf, type AgentStatus } from "./agents";
import type { Board, Item, Note, Owed, OwedKind, OwedStatus, OwedTier, Status } from "./types";

/**
 * Two backends behind one interface.
 *
 * With DATABASE_URL set (Vercel, or local after `vercel env pull`) the board
 * lives in Postgres. Without it, it falls back to data/board.json so the local
 * app and the refresh scripts keep working untouched. Phase 2 retires the file
 * path once the bridge pushes straight into Postgres.
 */

const BOARD_PATH = path.join(process.cwd(), "data", "board.json");

/* ── file backend ─────────────────────────────────────────────── */

async function readFileBoard(): Promise<Board> {
  const raw = await fs.readFile(BOARD_PATH, "utf8");
  return JSON.parse(raw) as Board;
}

async function writeFileBoard(board: Board): Promise<void> {
  // Temp file then rename, so a crash mid-write can't truncate the board.
  const tmp = `${BOARD_PATH}.tmp`;
  await fs.writeFile(tmp, `${JSON.stringify(board, null, 2)}\n`, "utf8");
  await fs.rename(tmp, BOARD_PATH);
}

/* ── postgres backend ─────────────────────────────────────────── */

type Row = {
  id: string;
  title: string;
  detail: string | null;
  section: string;
  grp: string | null;
  due: string | Date | null;
  status: Status;
  source: string | null;
  notes: string | null;
  is_new: boolean;
  venture: string | null;
  updated_at: string | Date | null;
};

function toItem(r: Row): Item {
  return {
    id: r.id,
    title: r.title,
    detail: r.detail ?? undefined,
    section: r.section as Item["section"],
    group: r.grp ?? undefined,
    // The driver hands back a Date for DATE columns; the UI wants YYYY-MM-DD.
    due: r.due ? new Date(r.due).toISOString().slice(0, 10) : undefined,
    status: r.status,
    source: r.source ?? undefined,
    notes: r.notes ?? undefined,
    isNew: r.is_new,
    venture: r.venture ?? undefined,
    updatedAt: r.updated_at ? new Date(r.updated_at).toISOString() : undefined,
  };
}

async function readDbBoard(): Promise<Board> {
  const db = sql();
  // The driver's return type is a union across result shapes, so each row set
  // goes through `unknown` before landing on its concrete type.
  const [items, notes, meta] = (await Promise.all([
    db.query("SELECT * FROM items ORDER BY position ASC"),
    db.query("SELECT id, body, created_at FROM notes ORDER BY created_at DESC"),
    db.query("SELECT key, value FROM meta"),
  ])) as unknown as [
    Row[],
    { id: string; body: string; created_at: string }[],
    { key: string; value: string }[],
  ];

  const kv = Object.fromEntries(meta.map((m) => [m.key, m.value]));

  return {
    lastRefresh: kv.lastRefresh ?? new Date().toISOString(),
    coversThrough: kv.coversThrough ?? "",
    items: items.map(toItem),
    notes: notes.map((n) => ({
      id: n.id,
      body: n.body,
      createdAt: new Date(n.created_at).toISOString(),
    })),
  };
}

/* ── public interface ─────────────────────────────────────────── */

export async function readBoard(): Promise<Board> {
  return hasDatabase() ? readDbBoard() : readFileBoard();
}

export async function updateItem(
  id: string,
  patch: Partial<Pick<Item, "status" | "notes">>,
): Promise<Item | null> {
  if (hasDatabase()) {
    const db = sql();
    const rows = (await (db.query(
      `UPDATE items SET
         status = COALESCE($2, status),
         notes  = COALESCE($3, notes),
         -- acting on an item clears its "new since refresh" highlight
         is_new = CASE WHEN $2 IS NULL THEN is_new ELSE FALSE END,
         updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [id, patch.status ?? null, patch.notes ?? null],
    ) as unknown as Promise<Row[]>));
    return rows.length ? toItem(rows[0]) : null;
  }

  const board = await readFileBoard();
  const item = board.items.find((i) => i.id === id);
  if (!item) return null;

  Object.assign(item, patch, { updatedAt: new Date().toISOString() });
  if (patch.status) item.isNew = false;

  await writeFileBoard(board);
  return item;
}

export async function addNote(body: string): Promise<Note> {
  const note: Note = {
    id: `n-${Date.now().toString(36)}`,
    body,
    createdAt: new Date().toISOString(),
  };

  if (hasDatabase()) {
    await sql().query("INSERT INTO notes (id, body, created_at) VALUES ($1,$2,$3)", [
      note.id,
      note.body,
      note.createdAt,
    ]);
    return note;
  }

  const board = await readFileBoard();
  board.notes.unshift(note);
  await writeFileBoard(board);
  return note;
}

export async function deleteNote(id: string): Promise<void> {
  if (hasDatabase()) {
    await sql().query("DELETE FROM notes WHERE id = $1", [id]);
    return;
  }

  const board = await readFileBoard();
  board.notes = board.notes.filter((n) => n.id !== id);
  await writeFileBoard(board);
}

/* ── owed ─────────────────────────────────────────────────────── */

type OwedRow = {
  id: string; kind: OwedKind; who: string; what: string; context: string | null;
  tier: OwedTier; tier_reason: string | null; source: string | null;
  thread_label: string | null; waiting_since: string | Date; due: string | Date | null;
  status: OwedStatus; snooze_until: string | Date | null; draft: string | null;
  draft_kind: string | null; drafted_at: string | Date | null; item_id: string | null;
};

/**
 * The owed queue lives in Postgres only. Unlike the board there is no file
 * fallback: without a database there is no cron to populate it, so an empty
 * list is the honest answer rather than a stale one read off disk.
 */
export async function readOwed(): Promise<Owed[]> {
  if (!hasDatabase()) return [];

  const rows = (await sql().query(
    `SELECT id, kind, who, what, context, tier, tier_reason, source, thread_label,
            waiting_since, due, status, snooze_until, draft, draft_kind, drafted_at, item_id
       FROM owed
      WHERE status NOT IN ('done','sent','dismissed')
      ORDER BY waiting_since ASC`,
  )) as unknown as OwedRow[];

  return rows.map((r) => ({
    id: r.id,
    kind: r.kind,
    who: r.who,
    what: r.what,
    context: r.context ?? undefined,
    tier: r.tier,
    tierReason: r.tier_reason ?? undefined,
    source: r.source ?? undefined,
    threadLabel: r.thread_label ?? undefined,
    waitingSince: new Date(r.waiting_since).toISOString(),
    due: r.due ? new Date(r.due).toISOString().slice(0, 10) : undefined,
    status: r.status,
    snoozeUntil: r.snooze_until ? new Date(r.snooze_until).toISOString() : undefined,
    draft: r.draft ?? undefined,
    draftKind: r.draft_kind ?? undefined,
    draftedAt: r.drafted_at ? new Date(r.drafted_at).toISOString() : undefined,
    itemId: r.item_id ?? undefined,
  }));
}

/* ── agents ───────────────────────────────────────────────────── */

/**
 * One row per registered agent, joined to its run history.
 *
 * The important column is `lastOk`, not `lastRun`: an agent that runs every
 * four hours and fails every time still has a fresh `lastRun`, which is exactly
 * how the drafter looked healthy while being broken for five days.
 */
export async function readAgents(): Promise<AgentStatus[]> {
  if (!hasDatabase()) {
    return AGENTS.map((a) => ({ ...a, runs24h: 0, fails24h: 0, health: "never" as const }));
  }

  const rows = (await sql().query(
    `SELECT action,
            MAX(started_at)                                        AS last_run,
            MAX(started_at) FILTER (WHERE status IN ('ok','staged','sent','skipped')) AS last_ok,
            COUNT(*) FILTER (WHERE started_at > NOW() - INTERVAL '24 hours')::int     AS runs_24h,
            COUNT(*) FILTER (WHERE started_at > NOW() - INTERVAL '24 hours'
                                   AND status = 'failed')::int                        AS fails_24h
       FROM agent_runs GROUP BY action`,
  )) as unknown as {
    action: string; last_run: string | Date | null; last_ok: string | Date | null;
    runs_24h: number; fails_24h: number;
  }[];

  const byAction = new Map(rows.map((r) => [r.action, r]));

  // The most recent run's own status and error, fetched per agent so a failure
  // shows its reason rather than just a red dot.
  const latest = (await sql().query(
    `SELECT DISTINCT ON (action) action, status, LEFT(COALESCE(error,''), 300) AS error
       FROM agent_runs ORDER BY action, started_at DESC`,
  )) as unknown as { action: string; status: string; error: string }[];
  const byLatest = new Map(latest.map((r) => [r.action, r]));

  return AGENTS.map((a) => {
    const agg = byAction.get(a.action);
    const last = byLatest.get(a.action);
    const status: AgentStatus = {
      ...a,
      lastRun: agg?.last_run ? new Date(agg.last_run).toISOString() : undefined,
      lastOk: agg?.last_ok ? new Date(agg.last_ok).toISOString() : undefined,
      lastStatus: last?.status,
      lastError: last?.error || undefined,
      runs24h: agg?.runs_24h ?? 0,
      fails24h: agg?.fails_24h ?? 0,
      health: "never",
    };
    status.health = healthOf(status);
    return status;
  });
}

/** Local-time YYYY-MM-DD. UTC would roll the day over at 5pm PT. */
export function today(): string {
  const d = new Date();
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
}
