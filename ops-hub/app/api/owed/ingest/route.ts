import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { applyExtract, Extract, type Waiting } from "@/lib/owed-extract";
import { finishRun, startRun } from "@/lib/runs";

export const maxDuration = 120;

/**
 * Accepts an extraction produced on the Mac.
 *
 * The cron route is the normal path. This exists because the AI Gateway can run
 * out of credit while the Claude Code CLI on the laptop keeps working, and a
 * triage queue that silently stops updating is worse than no queue at all.
 * Same prompt, same schema, same upsert — only the model call moves.
 */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "bad json" }, { status: 400 });

  const parsed = Extract.safeParse(body.extracted);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "extracted failed validation", issues: parsed.error.issues.slice(0, 5) },
      { status: 400 },
    );
  }

  const waiting: Waiting[] = Array.isArray(body.waiting) ? body.waiting : [];
  const scanned: string[] = Array.isArray(body.scanned) ? body.scanned : [];

  // Logged under the same action as the cron. When the gateway is dry this IS
  // the extractor, and an agents view that calls it "never run" while the queue
  // is being rebuilt every day is worse than no view.
  const runId = await startRun("owed_scan", { via: "local" });

  const db = sql();
  const known = (await db.query(
    "SELECT thread_label, tier, tier_reason FROM owed WHERE kind='thread' AND thread_label IS NOT NULL",
  )) as unknown as { thread_label: string; tier: string; tier_reason: string }[];

  const result = await applyExtract(
    db as never,
    waiting,
    scanned,
    parsed.data,
    new Map(known.map((k) => [k.thread_label, k])),
  );

  await db.query(
    `INSERT INTO meta (key, value) VALUES ('lastOwedScan', $1)
     ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`,
    [new Date().toISOString()],
  );

  const out = { via: "local", waiting: waiting.length, ...result };
  await finishRun(runId, "ok", { output: out });
  return NextResponse.json(out);
}
