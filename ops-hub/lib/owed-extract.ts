import { z } from "zod";

/**
 * Shared guts of the owed extractor.
 *
 * Split out of the route because the same prompt has to run in two places: the
 * Vercel cron when the AI Gateway has credit, and a local script through the
 * Claude Code CLI when it doesn't. Keeping the prompt, the schema and the
 * upsert in one module means the two paths cannot drift into disagreeing about
 * what a commitment is.
 */

export const TIER_IDS = ["client", "deal", "partner", "internal", "social"] as const;

/** How far back a meeting can be and still generate a live commitment. */
export const MEETING_WINDOW_DAYS = 10;

// `.nullish()` throughout: the model emits explicit nulls for absent optional
// fields, and rejecting those throws away an otherwise good pass.
export const ThreadItem = z
  .object({
    label: z.string(),
    who: z.string(),
    what: z.string(),
    context: z.string().nullish(),
    tier: z.enum(TIER_IDS),
    // Optional in the schema, required in practice — see the refine below.
    tierReason: z.string().nullish(),
    ignore: z.boolean().nullish(),
  })
  // Justification is the point of the tier, so a real row must carry one. A row
  // being ignored has nothing to justify, and demanding a reason for those was
  // silently dropping every automated sender the model correctly flagged.
  .refine((t) => Boolean(t.ignore) || Boolean(t.tierReason?.trim()), {
    message: "tierReason is required unless the thread is ignored",
    path: ["tierReason"],
  });

export const CommitmentItem = z.object({
  id: z.string(),
  who: z.string(),
  what: z.string(),
  context: z.string().nullish(),
  tier: z.enum(TIER_IDS),
  tierReason: z.string(),
  due: z.string().nullish(),
  source: z.string(),
  meetingDate: z.string(),
});

export const Extract = z.object({
  threads: z.array(ThreadItem),
  commitments: z.array(CommitmentItem),
});

export type Extracted = z.infer<typeof Extract> & { dropped?: string[] };

export type Waiting = {
  label: string; kind?: string; participants?: string[]; lastFrom: string;
  waitingSince: string; hoursWaiting: number;
  recent: { at: string; from: string; text: string }[];
};

export type Meeting = { title: string; date: string; summary?: string; nextSteps?: string[] };

/** Same envelope-unwrapping problem as the refresh merge. See that route. */
export function parseExtract(raw: string): Extracted {
  let text = raw.trim();
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fence) text = fence[1].trim();

  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("no JSON object in model output");

  let parsed: unknown = JSON.parse(text.slice(start, end + 1));
  if (parsed && typeof parsed === "object" && !("threads" in parsed)) {
    const inner = Object.values(parsed as Record<string, unknown>).find(
      (v) => v && typeof v === "object" && "threads" in (v as object),
    );
    if (inner) parsed = inner;
  }

  // Validate per item, not per batch. One entry with a missing `tierReason`
  // used to reject the whole pass and leave the queue untouched, which is a
  // spectacularly bad trade for 37 good rows.
  const obj = (parsed ?? {}) as { threads?: unknown[]; commitments?: unknown[] };
  const out: Extracted = { threads: [], commitments: [] };
  const dropped: string[] = [];

  for (const t of Array.isArray(obj.threads) ? obj.threads : []) {
    const r = ThreadItem.safeParse(t);
    if (r.success) out.threads.push(r.data);
    else dropped.push(`thread ${JSON.stringify((t as { label?: string })?.label ?? t).slice(0, 60)}`);
  }
  for (const c of Array.isArray(obj.commitments) ? obj.commitments : []) {
    const r = CommitmentItem.safeParse(c);
    if (r.success) out.commitments.push(r.data);
    else dropped.push(`commitment ${JSON.stringify((c as { id?: string })?.id ?? c).slice(0, 60)}`);
  }

  if (dropped.length) out.dropped = dropped;
  if (!out.threads.length && !out.commitments.length && dropped.length) {
    throw new Error(`every item failed validation (${dropped.length})`);
  }
  return out;
}

export function slug(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48);
}

/**
 * Union meetings across several granola digests.
 *
 * The extraction prompt writes only meetings newer than its last run, so any
 * single digest is a slice. Reading just the newest one meant a laptop that had
 * already synced today saw zero meetings and extracted zero commitments —
 * silently, because zero meetings is indistinguishable from a quiet week.
 */
export function mergeMeetings(payloads: { meetings?: Meeting[] }[]): Meeting[] {
  const seen = new Map<string, Meeting>();
  for (const p of payloads) {
    for (const m of p?.meetings ?? []) {
      const key = `${m.date}|${m.title}`;
      // Later payloads win: a meeting re-extracted later has fuller notes.
      if (!seen.has(key) || (m.nextSteps?.length ?? 0) > (seen.get(key)!.nextSteps?.length ?? 0)) {
        seen.set(key, m);
      }
    }
  }
  return [...seen.values()].sort((a, b) => b.date.localeCompare(a.date));
}

/** Meetings recent enough, and specific enough, to still be worth chasing. */
export function recentMeetings(all: Meeting[], now = Date.now()): Meeting[] {
  const cutoff = new Date(now - MEETING_WINDOW_DAYS * 86_400_000).toISOString().slice(0, 10);
  return all.filter((m) => m.date >= cutoff && (m.nextSteps?.length ?? 0) > 0);
}

export function buildPrompt(
  needTier: Waiting[],
  meetings: Meeting[],
  todayISO: string,
): string {
  return [
    "You triage what Lenny owes people. He runs ecommerce at G FUEL and owns Escape Hatch (opens Instagram links in Safari instead of the in-app browser, $300/mo + 10% of incremental lift) and MailTail (email deliverability).",
    "",
    "Two jobs.",
    "",
    "## Job 1 — tier the threads waiting on a reply",
    "",
    "The fact that these are unanswered is already established; do not re-litigate it. Decide only how much it matters, and say what the ask actually is.",
    "",
    "Tiers, most urgent first:",
    "- `client`   — their store is installed and running Escape Hatch or MailTail right now. Highest stakes: a live client asking about a broken install or missing results is a churn risk.",
    "- `deal`     — an active sales conversation. A call happened, a price was discussed, or they asked for something before deciding.",
    "- `partner`  — sends referrals or introductions. Riley (purediffuserco) and Big Wang are the main two.",
    "- `internal` — G FUEL work: team, vendors, agencies, the day job.",
    "- `social`   — friends, family, anything not business.",
    "",
    "Rules:",
    "- `tierReason` must quote or closely paraphrase the evidence from the transcript. \"Seems important\" is not a reason. If nothing in the thread supports a business tier, it is `social`.",
    "- Set `ignore: true` for automated senders that slipped through: delivery notifications, appointment reminders, marketing blasts, government or transit notices. Nobody is waiting on a reply from a robot.",
    "- `what` is the ask in one line, from HIS side: what he needs to do. Not a summary of the thread.",
    "- When a thread is just banter with no ask, tier it `social` and make `what` honest about that.",
    "- Return one entry for every thread given to you unless you are marking it ignored.",
    "",
    "## Job 2 — pull commitments out of the meetings",
    "",
    "Each meeting has a Next Steps list. Extract only the ones **Lenny owes someone else**. Skip anything assigned to the other party, and skip anything vague enough that you couldn't tell whether it had been done.",
    "",
    "- `what` is the deliverable, concretely. \"Send MUD/WTR the case studies and a written summary of trial terms\" beats \"follow up\".",
    "- `due` only when a date was actually stated. Never invent one.",
    "- `id` must be stable across runs: `c-<meeting date>-<short slug of the deliverable>`, e.g. `c-2026-08-04-mudwtr-case-studies`.",
    "- `meetingDate` is the meeting's date, YYYY-MM-DD. The clock starts there.",
    "",
    `Today is ${todayISO}.`,
    "",
    "## Threads awaiting a reply",
    JSON.stringify(
      needTier.map((w) => ({
        label: w.label,
        lastFrom: w.lastFrom,
        hoursWaiting: w.hoursWaiting,
        recent: w.recent,
      })),
    ),
    "",
    "## Meetings",
    JSON.stringify(
      meetings.map((m) => ({
        title: m.title,
        date: m.date,
        nextSteps: m.nextSteps ?? [],
        summary: (m.summary ?? "").slice(0, 1400),
      })),
    ),
    "",
    "## Output",
    "Reply with a single JSON object and nothing else — no prose, no code fence, no wrapper key:",
    JSON.stringify({
      threads: [{
        label: "the thread label exactly as given",
        who: "person or company",
        what: "what he needs to do, one line",
        context: "optional supporting detail",
        tier: TIER_IDS.join(" | "),
        tierReason: "the evidence",
        ignore: "true only for automated senders",
      }],
      commitments: [{
        id: "c-YYYY-MM-DD-slug",
        who: "person or company",
        what: "the deliverable",
        context: "optional",
        tier: TIER_IDS.join(" | "),
        tierReason: "the evidence",
        due: "YYYY-MM-DD, optional",
        source: "'<Meeting title> — Mon D'",
        meetingDate: "YYYY-MM-DD",
      }],
    }),
    "Use empty arrays where there is nothing to report.",
  ].join("\n");
}

type Db = { query: (q: string, p?: unknown[]) => Promise<unknown> };

export type ApplyResult = {
  added: number; refreshed: number; closed: number;
  tiered: number; commitments: number;
};

/**
 * Write an extraction into the `owed` table.
 *
 * Shared by both entry points so the local and cloud paths cannot disagree.
 */
export async function applyExtract(
  db: Db,
  waiting: Waiting[],
  scanned: string[],
  extracted: Extracted,
  knownTier: Map<string, { tier: string; tier_reason: string }>,
): Promise<ApplyResult> {
  const byLabel = new Map(extracted.threads.map((t) => [t.label, t]));
  let added = 0;
  let refreshed = 0;

  for (const w of waiting) {
    const fresh = byLabel.get(w.label);
    if (fresh?.ignore) continue;

    const prior = knownTier.get(w.label);
    if (!fresh && !prior) continue; // never judged, and this pass didn't judge it

    const tier = prior?.tier ?? fresh!.tier;
    const reason = prior?.tier_reason ?? fresh!.tierReason ?? "";

    const res = (await db.query(
      `INSERT INTO owed (id, kind, who, what, context, tier, tier_reason, source,
                         thread_label, waiting_since, status, last_seen)
       VALUES ($1,'thread',$2,$3,$4,$5,$6,$7,$8,$9,'open',NOW())
       ON CONFLICT (id) DO UPDATE SET
         last_seen = NOW(),
         -- A newer unanswered message restarts the clock and invalidates any
         -- draft written against the old tail of the thread.
         waiting_since = EXCLUDED.waiting_since,
         draft      = CASE WHEN owed.waiting_since <> EXCLUDED.waiting_since THEN NULL ELSE owed.draft END,
         drafted_at = CASE WHEN owed.waiting_since <> EXCLUDED.waiting_since THEN NULL ELSE owed.drafted_at END,
         status     = CASE
                        WHEN owed.waiting_since <> EXCLUDED.waiting_since
                             AND owed.status IN ('done','sent','drafted') THEN 'open'
                        ELSE owed.status
                      END,
         what       = EXCLUDED.what,
         context    = EXCLUDED.context
       RETURNING (xmax = 0) AS inserted`,
      [`w-${slug(w.label)}`, fresh?.who ?? w.lastFrom, fresh?.what ?? `Reply to ${w.lastFrom}`,
       fresh?.context ?? null, tier, reason,
       // Slack labels already carry their own prefix; only iMessage needs one.
       w.label.startsWith("Slack") ? w.label : `iMessage — ${w.label}`,
       w.label, w.waitingSince],
    )) as { inserted: boolean }[];

    if (res[0]?.inserted) added += 1;
    else refreshed += 1;
  }

  for (const c of extracted.commitments) {
    const res = (await db.query(
      `INSERT INTO owed (id, kind, who, what, context, tier, tier_reason, source, waiting_since, due, status, last_seen)
       VALUES ($1,'commitment',$2,$3,$4,$5,$6,$7,$8::date,$9,'open',NOW())
       ON CONFLICT (id) DO UPDATE SET last_seen = NOW()
       RETURNING (xmax = 0) AS inserted`,
      [c.id, c.who, c.what, c.context ?? null, c.tier, c.tierReason, c.source,
       c.meetingDate, c.due || null],
    )) as { inserted: boolean }[];
    if (res[0]?.inserted) added += 1;
  }

  // Closing a thread row is safe in a way closing a board item is not: the
  // scanner looked at this exact conversation and the last message is now his.
  // That is an observation, not an inference, which is why this closes outright
  // where the refresh merge only ever proposes.
  let closed = 0;
  if (scanned.length) {
    const stillWaiting = new Set(waiting.map((w) => w.label));
    const answered = scanned.filter((l) => !stillWaiting.has(l));
    if (answered.length) {
      const done = (await db.query(
        `UPDATE owed SET status='done', updated_at=NOW()
         WHERE kind='thread' AND status IN ('open','drafted','snoozed')
           AND thread_label = ANY($1)
         RETURNING id`,
        [answered],
      )) as { id: string }[];
      closed = done.length;
    }
  }

  return {
    added, refreshed, closed,
    tiered: extracted.threads.length,
    commitments: extracted.commitments.length,
  };
}
