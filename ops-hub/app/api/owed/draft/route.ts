import { NextResponse } from "next/server";
import { generateText } from "ai";
import { sql } from "@/lib/db";
import { isBillingError, MODEL } from "@/lib/model";
import { findThread, type Msg, type Thread } from "@/lib/threads";

export const maxDuration = 120;

type Row = {
  id: string; kind: "thread" | "commitment"; who: string; what: string;
  context: string | null; tier: string; source: string | null;
  thread_label: string | null; due: string | null;
};

type Waiting = { label: string; lastFrom: string; recent: Msg[]; participants?: string[] };

/** House style, shared by both drafters. */
const VOICE = [
  "Write the way Lenny actually writes: lowercase-leaning, short lines, direct, warm with people he knows, no corporate padding.",
  "- Say the one thing that moves this forward. Not a status update, not a recap.",
  "- Never invent a fact, number, date, or promise that isn't in the material below.",
  "- No sign-off. No greeting if the conversation is already mid-flight.",
  "- NEVER use em-dashes. They read as AI-written. Use a comma, a full stop, or split the sentence.",
].join("\n");

export async function POST(req: Request) {
  const { id } = await req.json().catch(() => ({}));
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const db = sql();
  const rows = (await db.query(
    `SELECT id, kind, who, what, context, tier, source, thread_label, due
     FROM owed WHERE id = $1`,
    [id],
  )) as unknown as Row[];

  const row = rows[0];
  if (!row) return NextResponse.json({ error: "no such row" }, { status: 404 });

  const digests = (await db.query(
    "SELECT payload FROM source_digests WHERE source='imessage' ORDER BY received_at DESC LIMIT 1",
  )) as unknown as { payload: { threads?: Thread[]; waiting?: Waiting[] } }[];

  const payload = digests[0]?.payload ?? {};
  let transcript: Msg[] = [];
  let to: string[] = [];

  if (row.kind === "thread" && row.thread_label) {
    // The watched-thread digest carries the full conversation; the waiting scan
    // only keeps the last eight messages. Prefer the fuller one when it's there.
    const full = findThread(payload.threads ?? [], row.thread_label);
    const brief = (payload.waiting ?? []).find((w) => w.label === row.thread_label);

    transcript = full?.messages ?? brief?.recent ?? [];
    to = (full?.participants ?? brief?.participants ?? []).filter((p) => p !== "Me");

    if (!transcript.length) {
      return NextResponse.json(
        { error: `No transcript for "${row.thread_label}" in the latest digest. Run the bridge and try again.` },
        { status: 404 },
      );
    }
  }

  const runId = `run-${Date.now().toString(36)}`;
  await db.query(
    "INSERT INTO agent_runs (id, action, status, input) VALUES ($1,$2,'running',$3)",
    [runId, row.kind === "thread" ? "owed_reply" : "owed_artifact",
     JSON.stringify({ owedId: row.id, who: row.who })],
  );

  try {
    const recent = transcript.slice(-25);

    const prompt = row.kind === "thread"
      ? [
          "Draft Lenny's next message in this thread.",
          "",
          VOICE,
          "- Usually one to three short lines. Longer only if the ask genuinely needs it.",
          "",
          `What he owes them: ${row.what}`,
          row.context ? `Context: ${row.context}` : "",
          row.due ? `He said it would be done by: ${row.due}` : "",
          `Last message came from: ${recent[recent.length - 1]?.from ?? "them"}`,
          "",
          `## Thread: ${row.thread_label}`,
          recent.map((m) => `${m.from}: ${m.text}`).join("\n"),
          "",
          "Reply with the message text only. No quotes, no preamble, no explanation.",
        ]
      : [
          "Lenny promised this on a call and hasn't delivered it. Write the thing itself, ready to send.",
          "",
          VOICE,
          "",
          "Pick the format from the deliverable:",
          "- Something that goes to a person → write the message or email, subject line first if it's an email.",
          "- Something he has to do rather than send (an install, a setup, a config) → write the short checklist of steps, and if a message needs to go with it, put that after.",
          "",
          "Do not write a plan for writing it. Write it.",
          "",
          `Owed to: ${row.who}`,
          `The deliverable: ${row.what}`,
          row.context ? `Context: ${row.context}` : "",
          row.source ? `Promised on: ${row.source}` : "",
          row.due ? `Due: ${row.due}` : "",
          "",
          "If a specific number, case study or result is needed and it isn't given above, write the sentence around it and mark the gap with [FILL: what's missing]. Never invent the figure.",
          "",
          "Reply with the artifact only.",
        ];

    const { text } = await generateText({
      model: MODEL,
      prompt: prompt.filter(Boolean).join("\n"),
    });

    const draft = text.trim().replace(/^["']|["']$/g, "");
    const kind = row.kind === "thread" ? "text" : "artifact";

    await db.query(
      `UPDATE owed SET draft=$2, draft_kind=$3, drafted_at=NOW(), updated_at=NOW(),
              status = CASE WHEN status='open' THEN 'drafted' ELSE status END
       WHERE id=$1`,
      [row.id, draft, kind],
    );
    await db.query(
      "UPDATE agent_runs SET status='staged', output=$2, finished_at=NOW() WHERE id=$1",
      [runId, JSON.stringify({ draft })],
    );

    return NextResponse.json({ draft, kind, to, runId });
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
