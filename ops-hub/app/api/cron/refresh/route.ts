import { NextResponse } from "next/server";
import { generateText } from "ai";
import { z } from "zod";
import { sql } from "@/lib/db";
import { isBillingError, MODEL } from "@/lib/model";
import { finishRun, startRun } from "@/lib/runs";

// Merging is an LLM call over a few hundred messages; give it room.
export const maxDuration = 300;

const SECTIONS = [
  "today", "runbook", "slipped", "pipeline", "build",
  "tiktok", "decisions", "people", "yours", "personal",
] as const;

// `.nullish()` throughout on purpose: the model emits explicit nulls for absent
// optional fields, and rejecting those threw away an otherwise perfect merge.
const Merge = z.object({
  newItems: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      detail: z.string().nullish(),
      section: z.enum(SECTIONS),
      group: z.string().nullish(),
      due: z.string().nullish(),
      source: z.string(),
    }),
  ),
  updates: z.array(
    z.object({
      id: z.string(),
      detail: z.string().nullish(),
      due: z.string().nullish(),
      reason: z.string().nullish(),
    }),
  ),
  closed: z.array(
    z.object({ id: z.string(), evidence: z.string().nullish() }),
  ),
  summary: z.string().nullish(),
});

/**
 * The gateway's structured-output path kept returning the object nested under a
 * generic wrapper key ("parameter" / "parameters") and validation rejected the
 * whole response. Rather than depend on that plumbing, ask for raw JSON and
 * parse it here: strip code fences, unwrap a single-key envelope if one is
 * present, then validate.
 */
function parseMerge(raw: string): z.infer<typeof Merge> {
  let text = raw.trim();

  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fence) text = fence[1].trim();

  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("no JSON object in model output");

  let parsed: unknown = JSON.parse(text.slice(start, end + 1));

  if (parsed && typeof parsed === "object" && !("newItems" in parsed)) {
    const values = Object.values(parsed as Record<string, unknown>);
    const inner = values.find((v) => v && typeof v === "object" && "newItems" in (v as object));
    if (inner) parsed = inner;
  }

  return Merge.parse(parsed);
}

/**
 * Shrink a digest before it reaches the model.
 *
 * A ten-day iMessage pull is ~700 messages across ~17 threads, and sending it
 * whole timed the function out at 300s. The full payload stays in the database
 * so a merge can be re-run; only what the model sees is trimmed.
 */
function compact(source: string, payload: unknown): unknown {
  if (source !== "imessage" || !payload || typeof payload !== "object") return payload;

  const p = payload as { threads?: { label: string; messages: { at: string; from: string; text: string }[] }[] };
  if (!Array.isArray(p.threads)) return payload;

  return {
    ...p,
    threads: p.threads.map((t) => ({
      label: t.label,
      // Commitments live in the tail of a thread; the top is old context the
      // board already absorbed on a previous run.
      messages: (t.messages ?? [])
        .filter((m) => m.text && m.text.trim().length > 3)
        .slice(-45),
    })),
  };
}

export async function POST() {
  const db = sql();
  const runId = await startRun("refresh");

  // One digest per invocation. Two large ones together is what blew the
  // 300s ceiling; extras drain on the next run.
  const pending = (await db.query(
    "SELECT id, source, payload FROM source_digests WHERE merged_at IS NULL ORDER BY received_at ASC LIMIT 1",
  )) as unknown as { id: string; source: string; payload: unknown }[];

  if (!pending.length) {
    await finishRun(runId, "skipped", { output: { reason: "nothing pending" } });
    return NextResponse.json({ status: "nothing pending" });
  }

  // `detail` and `notes` are included deliberately. Without them the model
  // duplicated an item because the board called it "Brian + Joshua" while the
  // texts called the same company "Vaca Chips" — the connection only existed in
  // the detail text. Truncated to keep the prompt inside the time budget.
  const existing = (await db.query(
    `SELECT id, title, section, grp, due, status, source,
            LEFT(COALESCE(detail, ''), 320) AS detail,
            LEFT(COALESCE(notes, ''), 160) AS notes
     FROM items ORDER BY position`,
  )) as unknown as Record<string, unknown>[];

  let text: string;
  try {
    // A cron that dies on a gateway 403 leaves `merged_at` NULL and looks
    // identical to "nothing came in", which is how this went unnoticed for
    // days. Name the cause in the response instead.
    ({ text } = await generateText({
      model: MODEL,
      prompt: buildPrompt(),
    }));
  } catch (err) {
    if (isBillingError(err)) {
      await finishRun(runId, "failed", { error: "AI Gateway has no credit" });
      return NextResponse.json(
        { error: "model_unavailable", detail: "AI Gateway has no credit. Digests are queued, not lost." },
        { status: 503 },
      );
    }
    await finishRun(runId, "failed", { error: String(err).slice(0, 400) });
    throw err;
  }

  function buildPrompt() {
    return [
      "You maintain Lenny's action-item board. He runs ecommerce at G FUEL and owns Escape Hatch and MailTail on the side.",
      "",
      "Fold the new source material into the board. Rules that matter more than completeness:",
      "",
      "- NEVER invent a commitment. If it isn't in the source, it doesn't exist.",
      "- Most of a text thread is banter. Add an item only when Lenny promised something, someone is waiting on him, a deal moved, a number or date was committed to, or a problem was raised and left unresolved.",
      "- Dedupe hard. The same deal usually appears in a meeting AND a text AND an email. Matching names is not enough — ask whether the ACTION is the same. If an existing item covers it, put it in `updates`, not `newItems`.",
      "- Only `closed` something when a source says outright that it happened, in words you can quote. Silence is not completion, and neither is a related thing having happened. When in doubt, leave it open — a wrongly-closed item disappears from view and gets missed.",
      "- You are seeing ONE source. A thread going quiet does not mean Lenny owes a reply; he may have answered by email or on a call you cannot see. Only claim someone is waiting on him when the source itself shows the ask unanswered AND he committed to something.",
      "- Never touch status or notes beyond `closed`; those are his hand-edits.",
      "- Re-file by date: a dated item whose date has passed belongs in `slipped`; due today belongs in `today`.",
      "",
      `Today is ${new Date().toISOString().slice(0, 10)}.`,
      "",
      "## Board as it stands",
      JSON.stringify(existing),
      "",
      "## New source material",
      JSON.stringify(pending.map((p) => ({ source: p.source, payload: compact(p.source, p.payload) }))),
      "",
      "## Output",
      "Reply with a single JSON object and nothing else — no prose, no code fence, no wrapper key:",
      JSON.stringify({
        newItems: [{
          id: "kebab-case, section-prefixed, e.g. p-nabeel-cvr",
          title: "string",
          detail: "string, optional",
          section: SECTIONS.join(" | "),
          group: "string, optional",
          due: "YYYY-MM-DD, optional — only when a date was actually stated",
          source: "'<Meeting title> — Mon D' | 'iMessage — <thread>, Mon D' | 'Email — <subject>, Mon D'",
        }],
        updates: [{ id: "existing item id", detail: "optional replacement", due: "optional", reason: "why" }],
        closed: [{ id: "existing item id", evidence: "the words saying it was done" }],
        summary: "one or two sentences",
      }),
      "Use empty arrays where there is nothing to report. Omit optional fields rather than sending null.",
    ].join("\n");
  }

  const merge = parseMerge(text);

  const [{ max }] = (await db.query(
    "SELECT COALESCE(MAX(position), 0)::int AS max FROM items",
  )) as unknown as { max: number }[];

  let position = max;
  for (const item of merge.newItems) {
    position += 1;
    await db.query(
      `INSERT INTO items (id, title, detail, section, grp, due, status, source, is_new, position)
       VALUES ($1,$2,$3,$4,$5,$6,'open',$7,TRUE,$8)
       ON CONFLICT (id) DO NOTHING`,
      [item.id, item.title, item.detail ?? null, item.section, item.group ?? null, item.due || null, item.source, position],
    );
  }

  for (const u of merge.updates) {
    await db.query(
      `UPDATE items SET detail = COALESCE($2, detail), due = COALESCE($3, due) WHERE id = $1`,
      [u.id, u.detail ?? null, u.due ?? null],
    );
  }

  // The merge proposes closures; it does not perform them. On the first live
  // run it closed an item on partial evidence, and a wrongly-closed item drops
  // out of view entirely — the one failure mode with no recovery path short of
  // reading the database. So the claim gets attached to the item for review and
  // the status stays where Lenny put it.
  for (const c of merge.closed) {
    await db.query(
      `UPDATE items
         SET notes = TRIM(BOTH E'\\n' FROM COALESCE(notes || E'\\n', '') ||
                     'Refresh thinks this is done: ' || $2)
       WHERE id = $1 AND status <> 'done'`,
      [c.id, c.evidence ?? "no evidence given"],
    );
  }

  await db.query(
    `UPDATE source_digests SET merged_at = NOW() WHERE id = ANY($1)`,
    [pending.map((p) => p.id)],
  );
  await db.query(
    `INSERT INTO meta (key, value) VALUES ('lastRefresh', $1)
     ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`,
    [new Date().toISOString()],
  );

  const result = {
    merged: pending.length,
    added: merge.newItems.length,
    updated: merge.updates.length,
    closeCandidates: merge.closed.length,
    summary: merge.summary,
  };

  await finishRun(runId, "ok", { output: result });
  return NextResponse.json(result);
}

// Vercel Cron issues GET.
export const GET = POST;
