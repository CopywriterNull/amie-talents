import { breach, hoursWaiting, queue, tierOf, waitLabel } from "./owed";
import type { Item, Owed } from "./types";

/**
 * The twice-daily text.
 *
 * Composed with plain string building, not a model call, for two reasons. It is
 * a list of facts that needs no writing, and it has to keep working on days the
 * AI Gateway is empty — a brief that stops arriving is worse than no brief,
 * because silence reads as "nothing owed".
 *
 * Short on purpose. Six lines get read every day; sixty get ignored by Thursday.
 */

const MAX_ROWS = 3;

function firstName(who: string): string {
  return who.split(/[,(—-]/)[0].trim().split(/\s+/).slice(0, 2).join(" ");
}

/**
 * Bullets have to survive being read on a lock screen. The extractor writes a
 * full sentence because the dashboard has room for it; here it gets cut at a
 * word boundary, and the dashboard is one tap away for the rest.
 */
function short(what: string, max = 76): string {
  const clean = what.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(" ")) || cut}…`;
}

export interface Brief {
  text: string;
  late: number;
  waiting: number;
  dueToday: number;
  /** False when there is genuinely nothing worth interrupting for. */
  worthSending: boolean;
}

export function composeBrief(
  owed: Owed[],
  items: Item[],
  todayISO: string,
  url: string,
  now = Date.now(),
): Brief {
  const ranked = queue(owed, todayISO, now);
  const late = ranked.filter((o) => breach(o, now) >= 1);
  const dueToday = items.filter((i) => i.status !== "done" && i.due === todayISO);

  const hour = new Date(now).getHours();
  const greeting = hour < 12 ? "morning" : "afternoon";

  const lines: string[] = [];

  if (!late.length && !dueToday.length) {
    return {
      text: `${greeting} — nothing past the clock and nothing due today. ${ranked.length} in the queue.`,
      late: 0, waiting: ranked.length, dueToday: 0,
      // Nothing on fire is worth knowing once a day, not twice.
      worthSending: hour < 12,
    };
  }

  lines.push(
    late.length
      ? `${greeting} — ${late.length} past the clock, ${ranked.length} waiting total`
      : `${greeting} — nothing past the clock, ${ranked.length} waiting`,
  );

  for (const o of late.slice(0, MAX_ROWS)) {
    const t = tierOf(o.tier);
    const overdue = o.kind === "commitment" && o.due && o.due < todayISO;
    // The tier is the reason this row is above the others, so it earns its space.
    lines.push(
      `• ${firstName(o.who)} ${waitLabel(o, now)}${overdue ? " (past due)" : ""}: ${short(o.what)}` +
      (t.id === "client" || t.id === "deal" ? ` [${t.label.toLowerCase()}]` : ""),
    );
  }

  const rest = late.length - MAX_ROWS;
  if (rest > 0) lines.push(`+ ${rest} more past the clock`);

  if (dueToday.length) {
    lines.push(
      `due today: ${dueToday.slice(0, 2).map((i) => short(i.title, 46)).join("; ")}` +
      (dueToday.length > 2 ? ` +${dueToday.length - 2}` : ""),
    );
  }

  lines.push(url);

  return {
    text: lines.join("\n"),
    late: late.length,
    waiting: ranked.length,
    dueToday: dueToday.length,
    worthSending: true,
  };
}

/** Longest wait in the queue, for the "is this getting worse" read. */
export function worstWait(owed: Owed[], todayISO: string, now = Date.now()): number {
  const ranked = queue(owed, todayISO, now);
  return ranked.reduce((max, o) => Math.max(max, hoursWaiting(o, now)), 0);
}
