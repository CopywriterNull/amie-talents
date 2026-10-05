import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { mergeMeetings, type Meeting } from "@/lib/owed-extract";

/**
 * Latest raw payload per source.
 *
 * The local extractor reads this instead of the files on disk. The Granola
 * digest file only ever contains meetings newer than its last run, so a laptop
 * that had already pushed today saw zero meetings while the cloud held all of
 * them — the two paths were extracting from different inputs and quietly
 * disagreeing. One source of truth removes that whole class of bug.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  const rows = (await sql().query(
    `SELECT DISTINCT ON (source) source, payload, received_at
       FROM source_digests
      ORDER BY source, received_at DESC`,
  )) as unknown as { source: string; payload: unknown; received_at: string }[];

  const out = Object.fromEntries(rows.map((r) => [r.source, r.payload])) as
    Record<string, { meetings?: Meeting[] } | unknown>;

  // Granola is the one source whose digests are slices rather than snapshots.
  const granolas = (await sql().query(
    `SELECT payload FROM source_digests
      WHERE source='granola' AND received_at > NOW() - INTERVAL '21 days'
      ORDER BY received_at DESC LIMIT 20`,
  )) as unknown as { payload: { meetings?: Meeting[] } }[];

  if (granolas.length) {
    out.granola = { meetings: mergeMeetings(granolas.map((g) => g.payload)) };
  }

  return NextResponse.json(out);
}
