import { NextResponse } from "next/server";
import { generateText } from "ai";
import { sql } from "@/lib/db";
import { isBillingError, MODEL } from "@/lib/model";
import { finishRun, startRun } from "@/lib/runs";
import {
  applyExtract, buildPrompt, mergeMeetings, parseExtract, recentMeetings,
  type Meeting, type Waiting,
} from "@/lib/owed-extract";

export const maxDuration = 300;

/**
 * Cloud path for the owed extractor.
 *
 * The prompt, schema and upsert all live in lib/owed-extract so the local
 * runner (scripts/owed-local.mjs) does exactly the same work when the AI
 * Gateway has no credit. This route is only the plumbing.
 */
export async function POST() {
  const db = sql();
  const runId = await startRun("owed_scan");

  const [im, sl, gr] = (await Promise.all([
    db.query("SELECT payload FROM source_digests WHERE source='imessage' ORDER BY received_at DESC LIMIT 1"),
    db.query("SELECT payload FROM source_digests WHERE source='slack' ORDER BY received_at DESC LIMIT 1"),
    db.query(
      `SELECT payload FROM source_digests
        WHERE source='granola' AND received_at > NOW() - INTERVAL '21 days'
        ORDER BY received_at DESC LIMIT 20`,
    ),
  ])) as unknown as [
    { payload: { waiting?: Waiting[]; scanned?: string[] } }[],
    { payload: { waiting?: Waiting[]; scanned?: string[] } }[],
    { payload: { meetings?: Meeting[] } }[],
  ];

  // Slack emits the same shape as the iMessage scan on purpose, so a client
  // waiting in a shared reporting channel ranks against one waiting by text
  // rather than living in a separate list nobody opens.
  const waiting = [...(im[0]?.payload?.waiting ?? []), ...(sl[0]?.payload?.waiting ?? [])];
  const scanned = [...(im[0]?.payload?.scanned ?? []), ...(sl[0]?.payload?.scanned ?? [])];
  const meetings = recentMeetings(mergeMeetings(gr.map((r) => r.payload)));

  if (!waiting.length && !meetings.length) {
    await finishRun(runId, "skipped", { output: { reason: "no source material" } });
    return NextResponse.json({ status: "no source material" });
  }

  // Rows already carrying a tier are not re-judged. The tier is about who the
  // person *is*, which doesn't change because they sent another text, and
  // re-asking every run would let a stable answer drift for no reason.
  const known = (await db.query(
    "SELECT thread_label, tier, tier_reason FROM owed WHERE kind='thread' AND thread_label IS NOT NULL",
  )) as unknown as { thread_label: string; tier: string; tier_reason: string }[];
  const knownTier = new Map(known.map((k) => [k.thread_label, k]));

  const needTier = waiting.filter((w) => !knownTier.has(w.label));
  const todayISO = new Date().toISOString().slice(0, 10);

  let extracted = { threads: [], commitments: [] } as ReturnType<typeof parseExtract>;

  if (needTier.length || meetings.length) {
    try {
      const { text } = await generateText({
        model: MODEL,
        prompt: buildPrompt(needTier, meetings, todayISO),
      });
      extracted = parseExtract(text);
    } catch (err) {
      if (isBillingError(err)) {
        await finishRun(runId, "failed", { error: "AI Gateway has no credit" });
        return NextResponse.json(
          {
            error: "model_unavailable",
            detail:
              "The AI Gateway has no credit, so nothing was tiered. Top it up, or run `npm run owed` on the Mac to do this pass through the Claude Code CLI instead.",
          },
          { status: 503 },
        );
      }
      await finishRun(runId, "failed", { error: String(err).slice(0, 400) });
      throw err;
    }
  }

  const result = await applyExtract(db as never, waiting, scanned, extracted, knownTier);

  await db.query(
    `INSERT INTO meta (key, value) VALUES ('lastOwedScan', $1)
     ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`,
    [new Date().toISOString()],
  );

  const out = { waiting: waiting.length, scanned: scanned.length, ...result };
  await finishRun(runId, "ok", { output: out });
  return NextResponse.json(out);
}

export const GET = POST;
