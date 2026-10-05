/**
 * The agent registry, and how to tell whether one is actually working.
 *
 * This exists because the reply drafter died on 6 August and nobody noticed
 * until 11 August. Every agent already wrote to `agent_runs`; what was missing
 * was anywhere that showed the last *successful* run next to how often it is
 * supposed to run. A failure you can't see is the same as no agent at all.
 */

export type AgentKind = "cron" | "button" | "local";
export type Health = "ok" | "stale" | "failing" | "never";

export interface AgentDef {
  id: string;
  /** Value written to agent_runs.action. */
  action: string;
  label: string;
  blurb: string;
  kind: AgentKind;
  cadence: string;
  /** Hours after which a silent agent is considered stale. Null = on demand. */
  expectEvery: number | null;
}

export const AGENTS: AgentDef[] = [
  {
    id: "refresh", action: "refresh", kind: "cron",
    label: "Board refresh",
    blurb: "Folds meetings, texts and email into the board",
    cadence: "Daily, 8:23am PT", expectEvery: 30,
  },
  {
    id: "owed", action: "owed_scan", kind: "cron",
    label: "Owed extractor",
    blurb: "Ranks who's waiting and pulls promises out of meetings",
    cadence: "Every 4 hours", expectEvery: 8,
  },
  {
    id: "brief", action: "brief", kind: "cron",
    label: "Morning brief",
    blurb: "Texts you what's past the clock",
    cadence: "8am and 4pm PT", expectEvery: 14,
  },
  {
    id: "reply", action: "owed_reply", kind: "button",
    label: "Reply drafter",
    blurb: "Writes your next message in a thread",
    cadence: "On demand", expectEvery: null,
  },
  {
    id: "artifact", action: "owed_artifact", kind: "button",
    label: "Commitment closer",
    blurb: "Writes the thing you promised, not a reminder about it",
    cadence: "On demand", expectEvery: null,
  },
  {
    id: "bridge", action: "bridge", kind: "local",
    label: "Mac bridge",
    blurb: "Pushes iMessage, Granola and Gmail up from the laptop",
    cadence: "Hourly, while the Mac is awake", expectEvery: 6,
  },
];

export interface AgentStatus extends AgentDef {
  lastRun?: string;
  lastOk?: string;
  lastStatus?: string;
  lastError?: string;
  runs24h: number;
  fails24h: number;
  health: Health;
}

const OK_STATUSES = new Set(["ok", "staged", "sent", "skipped"]);

export function healthOf(a: AgentStatus, now = Date.now()): Health {
  if (!a.lastRun) return "never";
  if (a.lastStatus && !OK_STATUSES.has(a.lastStatus)) return "failing";
  // On-demand agents can't be stale: not being clicked isn't a fault.
  if (a.expectEvery === null) return "ok";
  if (!a.lastOk) return "failing";
  const hours = (now - new Date(a.lastOk).getTime()) / 3_600_000;
  return hours > a.expectEvery ? "stale" : "ok";
}

export function isOkStatus(s: string): boolean {
  return OK_STATUSES.has(s);
}

export function sinceLabel(iso?: string, now = Date.now()): string {
  if (!iso) return "never";
  const h = (now - new Date(iso).getTime()) / 3_600_000;
  if (h < 1) return `${Math.max(1, Math.round(h * 60))}m ago`;
  if (h < 48) return `${Math.round(h)}h ago`;
  return `${Math.round(h / 24)}d ago`;
}
