import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { finishRun, startRun } from "@/lib/runs";

/**
 * Where the Mac bridge drops raw source payloads.
 *
 * Deliberately dumb: it stores and returns. Merging happens in /api/cron/refresh
 * so a push is fast and can't fail halfway through an LLM call, and so a merge
 * can be re-run against the same input after a prompt change.
 *
 * Auth is the middleware's bearer check — this route is not in PUBLIC_PATHS.
 */

const SOURCES = ["granola", "imessage", "gmail", "slack"];

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "expected JSON" }, { status: 400 });
  }

  const { source, payload, coversFrom, coversTo } = body;

  if (!SOURCES.includes(source)) {
    return NextResponse.json(
      { error: `source must be one of ${SOURCES.join(", ")}` },
      { status: 400 },
    );
  }
  if (!payload || typeof payload !== "object") {
    return NextResponse.json({ error: "payload must be an object" }, { status: 400 });
  }

  const id = `${source}-${Date.now().toString(36)}`;

  await sql().query(
    `INSERT INTO source_digests (id, source, payload, covers_from, covers_to)
     VALUES ($1, $2, $3, $4, $5)`,
    [id, source, JSON.stringify(payload), coversFrom ?? null, coversTo ?? null],
  );

  const [{ pending }] = (await sql().query(
    "SELECT COUNT(*)::int AS pending FROM source_digests WHERE merged_at IS NULL",
  )) as unknown as { pending: number }[];

  // A digest landing is the only proof the Mac bridge ran; there is nothing
  // else the cloud can observe about a laptop.
  const runId = await startRun("bridge", { source });
  await finishRun(runId, "ok", { output: { id, source, pending } });

  return NextResponse.json({ id, source, pending }, { status: 202 });
}

export async function GET() {
  const rows = (await sql().query(
    `SELECT source, received_at, merged_at,
            jsonb_array_length(COALESCE(payload->'threads', payload->'meetings', '[]'::jsonb)) AS units
     FROM source_digests
     ORDER BY received_at DESC
     LIMIT 12`,
  )) as unknown as Record<string, unknown>[];

  return NextResponse.json({ digests: rows });
}
