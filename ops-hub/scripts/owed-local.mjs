#!/usr/bin/env node
/**
 * Run the owed extraction on this Mac and push the result to the cloud.
 *
 * The cron at /api/cron/owed is the normal path. This is the fallback for when
 * the AI Gateway has no credit: same prompt, same schema, same upsert, but the
 * model call goes through the Claude Code CLI — which is already how the bridge
 * reads Granola and Gmail, so no new dependency and no new key.
 *
 *   npm run owed
 */

import { readFile, writeFile, unlink } from "node:fs/promises";
import { execFile } from "node:child_process";
import { existsSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

import { buildPrompt, parseExtract, recentMeetings } from "../lib/owed-extract.ts";

const run = promisify(execFile);
const REPO = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const ENDPOINT = `${process.env.OPS_HUB_URL ?? "https://lenny-ops.vercel.app"}/api/owed/ingest`;

function findClaude() {
  const candidates = [
    path.join(process.env.HOME, ".local/bin/claude"),
    path.join(process.env.HOME, ".claude/local/claude"),
    "/opt/homebrew/bin/claude",
  ];
  return candidates.find((c) => existsSync(c));
}

async function readJson(rel) {
  try {
    return JSON.parse(await readFile(path.join(REPO, rel), "utf8"));
  } catch {
    return null;
  }
}

const secret =
  process.env.OPS_HUB_SECRET ??
  (await readFile(path.join(REPO, ".env.local"), "utf8"))
    .split("\n")
    .find((l) => l.startsWith("OPS_HUB_SECRET="))
    ?.split("=")
    .slice(1)
    .join("=")
    .replace(/^"|"$/g, "");

if (!secret) {
  console.error("OPS_HUB_SECRET missing — run: vercel env pull .env.local --yes");
  process.exit(1);
}

const claude = findClaude();
if (!claude) {
  console.error("claude CLI not found. Install it, or top up the AI Gateway and use the cron instead.");
  process.exit(1);
}

// Read what the CLOUD has, not what is on disk. The Granola digest file is
// rewritten each bridge run with only meetings newer than the last one, so a
// laptop that already pushed today sees an empty file while the cloud holds
// every meeting. Same input, same output, either path.
const BASE = process.env.OPS_HUB_URL ?? "https://lenny-ops.vercel.app";
let digests = {};
try {
  const r = await fetch(`${BASE}/api/digests`, {
    headers: { authorization: `Bearer ${secret}` },
  });
  if (r.ok) digests = await r.json();
  else console.warn(`could not read cloud digests (${r.status}), falling back to local files`);
} catch {
  console.warn("could not reach the cloud, falling back to local files");
}

const im = digests.imessage ?? (await readJson("data/imessage-digest.json"));
const gr = digests.granola ?? (await readJson("data/granola-digest.json"));
const sl = digests.slack ?? (await readJson("data/slack-digest.json"));

const waiting = [...(im?.waiting ?? []), ...(sl?.waiting ?? [])];
const scanned = [...(im?.scanned ?? []), ...(sl?.scanned ?? [])];
const meetings = recentMeetings(gr?.meetings ?? []);

if (!waiting.length && !meetings.length) {
  console.log("nothing to extract — run scripts/imessage-digest.py first");
  process.exit(0);
}

const todayISO = new Date().toISOString().slice(0, 10);
const prompt = buildPrompt(waiting, meetings, todayISO);

// The prompt carries whole transcripts, so it goes via a file rather than argv.
const promptFile = path.join(tmpdir(), `owed-prompt-${Date.now()}.txt`);
await writeFile(promptFile, prompt, "utf8");

console.log(`extracting: ${waiting.length} threads, ${meetings.length} meetings…`);

let stdout;
try {
  ({ stdout } = await run(claude, ["-p", prompt], {
    maxBuffer: 32 * 1024 * 1024,
    timeout: 10 * 60_000,
  }));
} catch (err) {
  console.error("claude CLI failed:", err.shortMessage ?? err.message);
  process.exit(1);
} finally {
  await unlink(promptFile).catch(() => {});
}

let extracted;
try {
  extracted = parseExtract(stdout);
  if (extracted.dropped?.length) {
    console.warn(`dropped ${extracted.dropped.length} malformed: ${extracted.dropped.slice(0, 3).join("; ")}`);
  }
} catch (err) {
  console.error("could not parse model output:", err.message);
  console.error(stdout.slice(0, 600));
  process.exit(1);
}

console.log(`tiered ${extracted.threads.length}, ${extracted.commitments.length} commitments — pushing…`);

const res = await fetch(ENDPOINT, {
  method: "POST",
  headers: { "content-type": "application/json", authorization: `Bearer ${secret}` },
  body: JSON.stringify({ waiting, scanned, extracted }),
});

const body = await res.json().catch(() => ({}));
if (!res.ok) {
  console.error(`push failed (${res.status}):`, JSON.stringify(body).slice(0, 400));
  process.exit(1);
}
console.log("done:", JSON.stringify(body));
