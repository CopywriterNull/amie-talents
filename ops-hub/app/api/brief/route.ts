import { NextResponse } from "next/server";
import { composeBrief } from "@/lib/brief";
import { readBoard, readOwed, today } from "@/lib/data";
import { finishRun, startRun } from "@/lib/runs";

/**
 * Composes the brief. Does not send it.
 *
 * Vercel cannot send an iMessage, so the Mac fetches this and does the sending
 * (scripts/brief.sh). Same split as the digests: the laptop is the only thing
 * that can touch Messages, the cloud is the only thing that knows the queue.
 */
export const dynamic = "force-dynamic";

const URL = process.env.OPS_HUB_URL ?? "https://lenny-ops.vercel.app";

export async function GET() {
  // Logged on compose rather than on send. If the Mac stops collecting it the
  // run goes stale, which is exactly the signal the agents view should show.
  const runId = await startRun("brief");
  try {
    const [owed, board] = await Promise.all([readOwed(), readBoard()]);
    const brief = composeBrief(owed, board.items, today(), URL);
    await finishRun(runId, brief.worthSending ? "ok" : "skipped", {
      output: { late: brief.late, waiting: brief.waiting, dueToday: brief.dueToday },
    });
    return NextResponse.json(brief);
  } catch (err) {
    await finishRun(runId, "failed", { error: String(err).slice(0, 400) });
    throw err;
  }
}
