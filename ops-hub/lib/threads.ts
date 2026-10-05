export type Msg = { at: string; from: string; text: string };
export type Thread = { label: string; participants?: string[]; messages: Msg[] };

/**
 * Matching a stored `source` string back to a thread in the latest digest.
 *
 * Shared by the reply drafter and the owed closer. Labels drift between what
 * the digest emits and what got written into an item's `source`, so an exact
 * match is the exception — hence scoring rather than lookup.
 */

/**
 * `iMessage — riley purediffuserco, +17164820419, Aug 4` → thread label.
 * Trailing dates come in several shapes the sources actually produce:
 * "Aug 4", "Aug 3-5", "Jul 30 - Aug 2". Strip whatever date tail is there
 * rather than demanding one exact form.
 */
export function threadLabelFrom(source: string): string | null {
  const body = source.replace(/^iMessage\s*[—-]\s*/i, "");
  const stripped = body
    .replace(/,\s*[A-Z][a-z]{2}\s+\d{1,2}(\s*[-–—]\s*([A-Z][a-z]{2}\s+)?\d{1,2})?\s*$/, "")
    .replace(/\s+group\s*$/i, "")
    .trim();
  return stripped || null;
}

/** Token overlap. One shared word is a coincidence, so most of the label must land. */
export function labelScore(label: string, candidate: string): number {
  const a = label.toLowerCase().trim();
  const b = candidate.toLowerCase().trim();
  if (a === b) return 1000;
  if (b.includes(a) || a.includes(b)) return 500;

  const tokens = a.split(/[\s,+]+/).filter((t) => t.length > 2 && t !== "group");
  if (!tokens.length) return 0;

  const hits = tokens.filter((t) => b.includes(t)).length;
  return hits / tokens.length >= 0.5 ? hits * 40 : 0;
}

export function findThread(threads: Thread[], label: string | null): Thread | undefined {
  if (!label) return undefined;
  return threads
    .map((t) => ({ t, s: labelScore(label, t.label) }))
    .sort((a, b) => b.s - a.s)
    .filter((x) => x.s > 0)[0]?.t;
}
