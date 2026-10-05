import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

/**
 * A short PIN is only safe if guessing is expensive. Five wrong attempts from
 * an IP locks it out for fifteen minutes, which turns a 10,000-guess space from
 * under a minute of scripting into weeks. The counter lives in Postgres rather
 * than memory because serverless instances don't share state — an in-memory
 * limiter here would reset on nearly every request and protect nothing.
 */
const MAX_FAILS = 5;
const LOCKOUT_MINUTES = 15;

function clientIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

export async function POST(req: Request) {
  const secret = process.env.OPS_HUB_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "not configured" }, { status: 503 });
  }

  const db = sql();
  const ip = clientIp(req);

  const rows = (await db.query(
    "SELECT fails, locked_until FROM login_attempts WHERE ip = $1",
    [ip],
  )) as unknown as { fails: number; locked_until: string | null }[];

  const record = rows[0];
  if (record?.locked_until && new Date(record.locked_until) > new Date()) {
    const mins = Math.ceil(
      (new Date(record.locked_until).getTime() - Date.now()) / 60_000,
    );
    return NextResponse.json(
      { error: `Too many attempts. Try again in ${mins} minute${mins === 1 ? "" : "s"}.` },
      { status: 429 },
    );
  }

  const { password } = await req.json().catch(() => ({ password: "" }));

  const ok =
    typeof password === "string" &&
    password.length === secret.length &&
    password.split("").reduce((acc, ch, i) => acc + (ch === secret[i] ? 0 : 1), 0) === 0;

  if (!ok) {
    const fails = (record?.fails ?? 0) + 1;
    const lockedUntil =
      fails >= MAX_FAILS
        ? new Date(Date.now() + LOCKOUT_MINUTES * 60_000).toISOString()
        : null;

    await db.query(
      `INSERT INTO login_attempts (ip, fails, locked_until, last_at)
       VALUES ($1, $2, $3, NOW())
       ON CONFLICT (ip) DO UPDATE SET
         fails = $2, locked_until = $3, last_at = NOW()`,
      [ip, fails, lockedUntil],
    );

    const left = MAX_FAILS - fails;
    return NextResponse.json(
      {
        error:
          left > 0
            ? `Wrong password. ${left} attempt${left === 1 ? "" : "s"} left.`
            : `Too many attempts. Locked for ${LOCKOUT_MINUTES} minutes.`,
      },
      { status: 401 },
    );
  }

  // Success clears the counter for this IP.
  await db.query("DELETE FROM login_attempts WHERE ip = $1", [ip]);

  const res = NextResponse.json({ ok: true });
  res.cookies.set("ops_session", secret, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 90,
  });
  return res;
}
