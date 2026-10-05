import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import type { OwedStatus } from "@/lib/types";

const ALLOWED: OwedStatus[] = ["open", "drafted", "sent", "done", "snoozed", "dismissed"];

export async function PATCH(req: Request) {
  const { id, status, snoozeHours } = await req.json().catch(() => ({}));
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  if (status && !ALLOWED.includes(status)) {
    return NextResponse.json({ error: "bad status" }, { status: 400 });
  }

  const db = sql();

  // Snoozing is the honest option for "I've seen it and it can wait", and it
  // needs its own state. Marking such a row done would hide a real obligation,
  // and leaving it open means the queue keeps shouting about something already
  // triaged, which is how people stop trusting a queue.
  const until = status === "snoozed"
    ? new Date(Date.now() + (Number(snoozeHours) || 24) * 3_600_000).toISOString()
    : null;

  const rows = (await db.query(
    `UPDATE owed
        SET status = COALESCE($2, status),
            snooze_until = CASE WHEN $2 = 'snoozed' THEN $3::timestamptz ELSE NULL END,
            updated_at = NOW()
      WHERE id = $1
      RETURNING id, status, snooze_until`,
    [id, status ?? null, until],
  )) as unknown as { id: string; status: string; snooze_until: string | null }[];

  if (!rows.length) return NextResponse.json({ error: "no such row" }, { status: 404 });
  return NextResponse.json(rows[0]);
}
