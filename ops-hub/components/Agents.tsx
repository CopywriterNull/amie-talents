"use client";

import { useState } from "react";
import { sinceLabel, type AgentStatus } from "@/lib/agents";

/**
 * Agent health.
 *
 * The column that matters is "last worked", not "last ran". An agent failing
 * every four hours has a fresh last-run and is still dead.
 */

const HEALTH_WORD: Record<string, string> = {
  ok: "working",
  stale: "overdue",
  failing: "failing",
  never: "never run",
};

function Card({ a }: { a: AgentStatus }) {
  const [open, setOpen] = useState(false);
  const broken = a.health === "failing" || a.health === "stale";

  return (
    <div className="agent" data-health={a.health}>
      <div className="agent-top">
        <span className="dot" data-health={a.health} aria-hidden />
        <b>{a.label}</b>
        <span className="tier" data-tier={a.kind === "cron" ? "deal" : a.kind === "local" ? "partner" : ""}>
          {a.kind === "cron" ? "scheduled" : a.kind === "local" ? "on the mac" : "on demand"}
        </span>
        <span className="agent-when">{HEALTH_WORD[a.health]}</span>
      </div>

      <p className="agent-blurb">{a.blurb}</p>

      <dl className="agent-facts">
        <div><dt>Last worked</dt><dd>{sinceLabel(a.lastOk)}</dd></div>
        <div><dt>Last ran</dt><dd>{sinceLabel(a.lastRun)}</dd></div>
        <div><dt>Cadence</dt><dd>{a.cadence}</dd></div>
        <div><dt>24h</dt><dd>{a.runs24h} run{a.runs24h === 1 ? "" : "s"}{a.fails24h ? `, ${a.fails24h} failed` : ""}</dd></div>
      </dl>

      {broken && a.lastError && (
        <>
          <button className="act" onClick={() => setOpen((v) => !v)}>
            {open ? "Hide error" : "Why"}
          </button>
          {open && <pre className="agent-err">{a.lastError}</pre>}
        </>
      )}
    </div>
  );
}

export default function Agents({ agents }: { agents: AgentStatus[] }) {
  const bad = agents.filter((a) => a.health === "failing" || a.health === "stale");

  return (
    <>
      <section className="attention" data-tone={bad.length ? "hot" : undefined}>
        <h2>{bad.length ? `${bad.length} not working` : "All agents healthy"}</h2>
        <ul>
          <li>
            {bad.length ? (
              <>
                <b>{bad.map((a) => a.label).join(", ")}</b>{" "}
                <span>
                  hasn&rsquo;t completed successfully within its cadence. Open it for the reason.
                </span>
              </>
            ) : (
              <span>Every agent has finished a successful run inside its expected window.</span>
            )}
          </li>
        </ul>
      </section>

      <div className="stack">
        {agents.map((a) => <Card key={a.id} a={a} />)}
      </div>

      <div className="foot">
        Agents draft; nothing sends itself. Runs are logged to <code>agent_runs</code>.
      </div>
    </>
  );
}
