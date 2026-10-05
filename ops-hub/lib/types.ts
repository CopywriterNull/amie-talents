export type Status = "open" | "doing" | "done" | "unknown";

export type SectionId =
  | "today"
  | "runbook"
  | "slipped"
  | "pipeline"
  | "build"
  | "tiktok"
  | "decisions"
  | "people"
  | "yours"
  | "personal";

export interface Item {
  id: string;
  title: string;
  /** Supporting context — the "why" and the numbers. Plain text. */
  detail?: string;
  section: SectionId;
  /** ISO date (YYYY-MM-DD) this is due or fires. Undated items sort last. */
  due?: string;
  status: Status;
  /** Which meeting this came from, e.g. "TikTok Shop strategy — Aug 6". */
  source?: string;
  /** Grouping label inside a section, e.g. "Mud Water" inside pipeline. */
  group?: string;
  /** Freeform notes the user adds in the UI. */
  notes?: string;
  /** ISO timestamp of the last status change. */
  updatedAt?: string;
  /** True when this item was added by a refresh rather than the initial seed. */
  isNew?: boolean;
  /** Which business this belongs to: gfuel | escapehatch | mailtail | personal. */
  venture?: string;
}

export interface Note {
  id: string;
  body: string;
  createdAt: string;
}

export interface Board {
  /** When the seed/refresh last wrote this file. */
  lastRefresh: string;
  /** Newest meeting date covered, so refreshes know where to resume. */
  coversThrough: string;
  items: Item[];
  notes: Note[];
}

export const SECTIONS: { id: SectionId; label: string; blurb: string }[] = [
  { id: "today", label: "Today", blurb: "Fires in the next 24 hours" },
  { id: "runbook", label: "Launch runbook", blurb: "Aug 7 → Aug 14, in order" },
  { id: "slipped", label: "Slipped", blurb: "Past their date — chase now" },
  { id: "pipeline", label: "Pipeline", blurb: "Clients and prospects waiting on you" },
  { id: "build", label: "Build queue", blurb: "GFuel flows, CRO, listings" },
  { id: "tiktok", label: "TikTok Shop health", blurb: "Unowned, affects SPS" },
  { id: "decisions", label: "Decisions", blurb: "Have a clock on them" },
  { id: "people", label: "Follow-ups", blurb: "You owe someone a reply" },
  { id: "yours", label: "Yours", blurb: "Comp, career, manager" },
  { id: "personal", label: "Personal", blurb: "Off the org chart" },
];

/* ── owed: inbound triage + commitments ───────────────────────── */

/** `thread` = someone is waiting on you. `commitment` = you promised it. */
export type OwedKind = "thread" | "commitment";
export type OwedTier = "client" | "deal" | "partner" | "internal" | "social";
export type OwedStatus =
  | "open" | "drafted" | "sent" | "done" | "snoozed" | "dismissed";

export interface Owed {
  id: string;
  kind: OwedKind;
  /** Person or company on the other end. */
  who: string;
  /** The ask, or the promise, in one line. */
  what: string;
  context?: string;
  tier: OwedTier;
  /** Why the extractor put it in this tier — quoted evidence, not a guess. */
  tierReason?: string;
  source?: string;
  /** Digest thread label, so the drafter can find the transcript. */
  threadLabel?: string;
  /** ISO. When the clock started, not when the row appeared. */
  waitingSince: string;
  due?: string;
  status: OwedStatus;
  snoozeUntil?: string;
  draft?: string;
  draftKind?: string;
  draftedAt?: string;
  itemId?: string;
}

/**
 * `sla` is hours before it counts as late. These are deliberately aggressive at
 * the top: a live merchant who texts about a broken install and waits a day is
 * a churn risk, while a friend waiting a day is just a friend waiting a day.
 */
export const TIERS: {
  id: OwedTier; label: string; sla: number; weight: number; blurb: string;
}[] = [
  { id: "client",   label: "Live client", sla: 4,  weight: 100, blurb: "Installed and running" },
  { id: "deal",     label: "Open deal",   sla: 12, weight: 70,  blurb: "Money on the table" },
  { id: "partner",  label: "Partner",     sla: 24, weight: 45,  blurb: "Sends you referrals" },
  { id: "internal", label: "G FUEL",      sla: 24, weight: 35,  blurb: "The day job" },
  { id: "social",   label: "Personal",    sla: 72, weight: 10,  blurb: "Off the clock" },
];

export const VENTURES: { id: string; label: string }[] = [
  { id: "all", label: "All" },
  { id: "gfuel", label: "G FUEL" },
  { id: "escapehatch", label: "Escape Hatch" },
  { id: "mailtail", label: "MailTail" },
  { id: "personal", label: "Personal" },
];
