import { sql } from "./db";

/**
 * Recording an agent run.
 *
 * Deliberately fire-and-forget on the failure path: an agent must never die
 * because its own bookkeeping failed. A missing log line is a nuisance, a cron
 * that throws while logging is an outage.
 */

export function newRunId(prefix = "run"): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.round(Math.random() * 1e6).toString(36)}`;
}

export async function startRun(action: string, input?: unknown): Promise<string> {
  const id = newRunId(action);
  try {
    await sql().query(
      "INSERT INTO agent_runs (id, action, status, input) VALUES ($1,$2,'running',$3)",
      [id, action, input === undefined ? null : JSON.stringify(input)],
    );
  } catch {
    /* logging must not break the agent */
  }
  return id;
}

export async function finishRun(
  id: string,
  status: "ok" | "staged" | "sent" | "failed" | "skipped",
  extra?: { output?: unknown; error?: string },
): Promise<void> {
  try {
    await sql().query(
      `UPDATE agent_runs
          SET status = $2,
              output = COALESCE($3::jsonb, output),
              error = $4,
              finished_at = NOW()
        WHERE id = $1`,
      [
        id,
        status,
        extra?.output === undefined ? null : JSON.stringify(extra.output),
        extra?.error ?? null,
      ],
    );
  } catch {
    /* as above */
  }
}
