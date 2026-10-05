import { NextResponse } from "next/server";
import { generateText } from "ai";
import { sql } from "@/lib/db";
import { isBillingError, MODEL } from "@/lib/model";

export const maxDuration = 120;

type Msg = { at: string; from: string; text: string };
type Thread = { label: string; participants?: string[]; messages: Msg[] };

/**
 * `iMessage — riley purediffuserco, +17164820419, Aug 4` → thread label.
 * Trailing dates come in several shapes the sources actually produce:
 * "Aug 4", "Aug 3-5", "Jul 30 - Aug 2". Strip whatever date tail is there
 * rather than demanding one exact form.
 */
function threadLabelFrom(source: string): string | null {
  const body = source.replace(/^iMessage\s*[—-]\s*/i, "");
  const stripped = body
    .replace(/,\s*[A-Z][a-z]{2}\s+\d{1,2}(\s*[-–—]\s*([A-Z][a-z]{2}\s+)?\d{1,2})?\s*$/, "")
    .replace(/\s+group\s*$/i, "")
    .trim();
  return stripped || null;
}

/** Token overlap — labels drift between the digest and what got written into
 *  `source`, so an exact match is the exception rather than the rule. */
function score(label: string, candidate: string): number {
  const a = label.toLowerCase().trim();
  const b = candidate.toLowerCase().trim();
  if (a === b) return 1000;
  if (b.includes(a) || a.includes(b)) return 500;

  const tokens = a.split(/[\s,+]+/).filter((t) => t.length > 2 && t !== "group");
  if (!tokens.length) return 0;

  const hits = tokens.filter((t) => b.includes(t)).length;
  // Require most of the label to appear; one shared word is a coincidence.
  return hits / tokens.length >= 0.5 ? hits * 40 : 0;
}

export async function POST(req: Request) {
  const { itemId } = await req.json().catch(() => ({}));
  if (!itemId) return NextResponse.json({ error: "itemId required" }, { status: 400 });

  const db = sql();

  const items = (await db.query(
    "SELECT id, title, detail, source, notes, status, due FROM items WHERE id = $1",
    [itemId],
  )) as unknown as {
    id: string; title: string; detail: string | null; source: string | null;
    notes: string | null; status: string; due: string | null;
  }[];

  const item = items[0];
  if (!item) return NextResponse.json({ error: "no such item" }, { status: 404 });
  if (!item.source?.startsWith("iMessage")) {
    return NextResponse.json(
      { error: "Reply drafting only applies to items that came from a text thread." },
      { status: 400 },
    );
  }

  const digests = (await db.query(
    "SELECT payload FROM source_digests WHERE source = 'imessage' ORDER BY received_at DESC LIMIT 1",
  )) as unknown as { payload: { threads?: Thread[] } }[];

  const threads = digests[0]?.payload?.threads ?? [];
  const label = threadLabelFrom(item.source);

  // Best-effort match: labels drift between the digest and what got written
  // into `source`, so score rather than requiring an exact hit.
  const thread = label
    ? threads
        .map((t) => ({ t, s: score(label, t.label) }))
        .sort((a, b) => b.s - a.s)
        .filter((x) => x.s > 0)[0]?.t
    : undefined;

  if (!thread) {
    return NextResponse.json(
      { error: `Couldn't find the thread for "${label ?? item.source}" in the latest digest.` },
      { status: 404 },
    );
  }

  const recent = thread.messages.slice(-25);
  const lastFrom = recent[recent.length - 1]?.from ?? "them";

  const runId = `run-${Date.now().toString(36)}`;
  await db.query(
    "INSERT INTO agent_runs (id, item_id, action, status, input) VALUES ($1,$2,'draft_reply','running',$3)",
    [runId, item.id, JSON.stringify({ thread: thread.label, messages: recent.length })],
  );

  try {
    const { text } = await generateText({
      model: MODEL,
      prompt: [
        "Draft Lenny's next text message in this thread. He runs ecommerce at G FUEL and owns Escape Hatch, a tool that opens Instagram links in Safari instead of the in-app browser.",
        "",
        "Write the way he actually writes, which you can see in the transcript: lowercase-leaning, short lines, direct, warm with people he knows, no corporate padding. He does not write paragraphs to friends.",
        "",
        "Rules:",
        "- Say the one thing that moves this forward. Not a status update, not a recap.",
        "- Never invent a fact, number, date, or promise that isn't in the transcript or the task below.",
        "- If he owes them something concrete, say when — but only if the task states it.",
        "- No greeting if the thread is mid-conversation. No sign-off ever.",
        "- Usually one to three short lines. Longer only if the ask genuinely needs it.",
        "- NEVER use em-dashes. They read as AI-written. Use a comma, a full stop, or split the sentence.",
        "",
        `The open task: ${item.title}`,
        item.detail ? `Context: ${item.detail}` : "",
        item.notes ? `His own note: ${item.notes}` : "",
        item.due ? `Due: ${item.due}` : "",
        `Last message came from: ${lastFrom}`,
        "",
        `## Thread: ${thread.label}`,
        recent.map((m) => `${m.from}: ${m.text}`).join("\n"),
        "",
        "Reply with the message text only. No quotes, no preamble, no explanation.",
      ]
        .filter(Boolean)
        .join("\n"),
    });

    const draft = text.trim().replace(/^["']|["']$/g, "");

    await db.query(
      "UPDATE agent_runs SET status='staged', output=$2, finished_at=NOW() WHERE id=$1",
      [runId, JSON.stringify({ draft })],
    );

    return NextResponse.json({
      draft,
      thread: thread.label,
      to: thread.participants?.filter((p) => p !== "Me") ?? [],
      lastFrom,
      runId,
    });
  } catch (err) {
    await db.query(
      "UPDATE agent_runs SET status='failed', error=$2, finished_at=NOW() WHERE id=$1",
      [runId, String(err)],
    );
    // A dry gateway and a broken prompt look identical from the button, and
    // "try again" sends you round the same loop forever.
    if (isBillingError(err)) {
      return NextResponse.json(
        { error: "The AI Gateway is out of credit, so nothing can be drafted. Top it up in Vercel." },
        { status: 503 },
      );
    }
    return NextResponse.json({ error: "Draft failed. Try again." }, { status: 500 });
  }
}
