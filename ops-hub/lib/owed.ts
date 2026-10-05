import { TIERS, type Owed, type OwedTier } from "./types";

/**
 * Ranking for the owed queue.
 *
 * Deliberately plain arithmetic rather than another model call. The extractor
 * already made the one genuinely hard judgement — what tier this person is in —
 * and it justifies that with quoted evidence. Turning "tier + how long" into a
 * position in a list is not a judgement, and a scorer you can read is a scorer
 * you can argue with when it puts the wrong thing on top.
 */

const BY_ID = new Map(TIERS.map((t) => [t.id, t]));

export function tierOf(tier: OwedTier) {
  return BY_ID.get(tier) ?? BY_ID.get("social")!;
}

export function hoursWaiting(o: Owed, now = Date.now()): number {
  return Math.max(0, (now - new Date(o.waitingSince).getTime()) / 3_600_000);
}

/** 1.0 means exactly at the tier's SLA. Above 1 is late. */
export function breach(o: Owed, now = Date.now()): number {
  return hoursWaiting(o, now) / tierOf(o.tier).sla;
}

export type Heat = "fresh" | "due" | "late" | "cold";

export function heat(o: Owed, now = Date.now()): Heat {
  const b = breach(o, now);
  if (b < 0.6) return "fresh";
  if (b < 1) return "due";
  if (b < 2.5) return "late";
  return "cold";
}

export function score(o: Owed, todayISO: string, now = Date.now()): number {
  const t = tierOf(o.tier);

  // Capped at 3. Without a cap a personal thread left alone for three weeks
  // outranks a client who messaged this morning, purely on elapsed time — which
  // is exactly the mistake this queue exists to stop.
  let s = t.weight * (1 + Math.min(breach(o, now), 3));

  // The cap has a side effect: everything past ~2.5x its SLA lands on the same
  // number, so a four-day-old deal and a nine-day-old one sort arbitrarily.
  // A logarithmic age term breaks those ties in favour of the older one while
  // staying far too small (max 10) to lift anything across a tier boundary —
  // the nearest gap between tier bands is 40.
  s += Math.min(Math.log2(1 + hoursWaiting(o, now)), 10);

  // A dated promise that has come and gone is a different failure from a slow
  // reply: they were told a day and the day passed.
  if (o.kind === "commitment" && o.due && o.due < todayISO) s += 60;

  // Already drafted means it's one click from finished, so it needs less
  // shouting than something that hasn't been looked at.
  if (o.draft) s -= 15;

  return s;
}

/** Everything still on the clock, hottest first. */
export function queue(all: Owed[], todayISO: string, now = Date.now()): Owed[] {
  return all
    .filter((o) => o.status === "open" || o.status === "drafted" || isAwake(o, now))
    .filter((o) => o.status !== "done" && o.status !== "sent" && o.status !== "dismissed")
    .sort((a, b) => score(b, todayISO, now) - score(a, todayISO, now));
}

/** A snoozed row comes back when its timer runs out. */
function isAwake(o: Owed, now: number): boolean {
  if (o.status !== "snoozed") return false;
  return !o.snoozeUntil || new Date(o.snoozeUntil).getTime() <= now;
}

export function waitLabel(o: Owed, now = Date.now()): string {
  const h = hoursWaiting(o, now);
  if (h < 1) return "just now";
  if (h < 24) return `${Math.round(h)}h`;
  const d = Math.round(h / 24);
  return `${d}d`;
}
