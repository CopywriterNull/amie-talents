import { spawn } from "child_process";
import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";

const REPO = process.cwd();
const SECRET_PATH = path.join(REPO, "data", "hook.secret");
const STAMP_PATH = path.join(REPO, "data", ".last-hook");

/** Refuse to re-run within this window — Granola rewrites its cache in bursts. */
const COOLDOWN_MS = 15 * 60 * 1000;

async function readSecret(): Promise<string | null> {
  try {
    return (await fs.readFile(SECRET_PATH, "utf8")).trim();
  } catch {
    return null;
  }
}

async function lastRun(): Promise<number> {
  try {
    return Number((await fs.readFile(STAMP_PATH, "utf8")).trim()) || 0;
  } catch {
    return 0;
  }
}

/**
 * Fired when a meeting wraps: the watcher sees Granola's cache change and POSTs
 * here. Kicks off the same refresh the daily cron runs, then returns
 * immediately — the refresh shells out to Claude Code and takes minutes.
 */
export async function POST(req: Request) {
  const secret = await readSecret();
  if (!secret) {
    return NextResponse.json({ error: "no hook secret installed" }, { status: 503 });
  }

  const provided =
    req.headers.get("x-ops-hub-token") ??
    new URL(req.url).searchParams.get("token") ??
    "";

  // Any page in the browser can POST to localhost, so the token is what stops a
  // stray tab from kicking off refreshes.
  if (provided !== secret) {
    return NextResponse.json({ error: "bad token" }, { status: 401 });
  }

  const since = Date.now() - (await lastRun());
  if (since < COOLDOWN_MS) {
    const mins = Math.ceil((COOLDOWN_MS - since) / 60_000);
    return NextResponse.json(
      { status: "skipped", reason: `cooling down, ${mins}m left` },
      { status: 429 },
    );
  }

  await fs.writeFile(STAMP_PATH, String(Date.now()), "utf8");

  const child = spawn("/bin/bash", [path.join(REPO, "scripts", "refresh-ops.sh")], {
    detached: true,
    stdio: "ignore",
    cwd: REPO,
  });
  child.unref();

  return NextResponse.json({ status: "refreshing" }, { status: 202 });
}

export async function GET() {
  const last = await lastRun();
  return NextResponse.json({
    ok: true,
    lastTriggered: last ? new Date(last).toISOString() : null,
    cooldownMinutes: COOLDOWN_MS / 60_000,
  });
}
