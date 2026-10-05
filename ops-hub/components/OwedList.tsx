"use client";

import { useMemo, useState } from "react";
import { TIERS, type Owed, type OwedStatus } from "@/lib/types";
import { breach, heat, queue, tierOf, waitLabel } from "@/lib/owed";

/**
 * The owed queue.
 *
 * One ranked list, not a board. Everything here has a clock on it, so the only
 * question the screen has to answer is "what goes cold first", and every row
 * carries the draft that would close it.
 */

const SNOOZE = [
  { label: "1h", hours: 1 },
  { label: "Tonight", hours: 6 },
  { label: "Tomorrow", hours: 24 },
];

function Row({
  o, todayISO, now, onStatus, onDrafted,
}: {
  o: Owed;
  todayISO: string;
  now: number;
  onStatus: (id: string, status: OwedStatus, snoozeHours?: number) => void;
  onDrafted: (id: string, draft: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [copied, setCopied] = useState(false);
  const [snoozing, setSnoozing] = useState(false);

  const t = tierOf(o.tier);
  const h = heat(o, now);
  const b = breach(o, now);
  const overdue = o.kind === "commitment" && o.due && o.due < todayISO;

  async function draft() {
    setBusy(true);
    setErr("");
    const res = await fetch("/api/owed/draft", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id: o.id }),
    });
    const body = await res.json().catch(() => ({}));
    if (res.ok) onDrafted(o.id, body.draft);
    else setErr(body.error ?? "Couldn't draft that.");
    setBusy(false);
  }

  async function copy() {
    if (!o.draft) return;
    await navigator.clipboard.writeText(o.draft);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="owed" data-heat={h}>
      <div className="owed-rail" aria-hidden />

      <div className="owed-main">
        <div className="owed-top">
          <span className="owed-who">{o.who}</span>
          <span className="tier" data-tier={o.tier}>{t.label}</span>
          {o.kind === "commitment" && <span className="tier" data-tier="promise">promised</span>}
          <span className="owed-wait" data-heat={h}>{waitLabel(o, now)}</span>
        </div>

        <p
          className="owed-what"
          role="button"
          tabIndex={0}
          onClick={() => setOpen((v) => !v)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setOpen((v) => !v); }
          }}
        >
          {o.what}
        </p>

        <div className="sla" aria-hidden>
          <i style={{ width: `${Math.min(b, 1) * 100}%` }} data-heat={h} />
        </div>

        {open && (
          <div className="owed-detail">
            {o.context && <p>{o.context}</p>}
            {o.tierReason && <p className="owed-why">Why {t.label.toLowerCase()}: {o.tierReason}</p>}
            <p className="owed-meta">
              {o.source ?? o.threadLabel}
              {o.due && ` · due ${o.due}`}
              {overdue && " · past due"}
            </p>
          </div>
        )}

        {err && <p className="reply-err">{err}</p>}

        {o.draft && (
          <div className="reply">
            <div className="reply-head">
              <span>{o.draftKind === "artifact" ? "Ready to send" : "Draft reply"}</span>
              <button className="reply-x" onClick={() => onDrafted(o.id, "")} aria-label="Discard draft">×</button>
            </div>
            <p className="reply-body">{o.draft}</p>
            <div className="acts">
              <button className="act solid" onClick={copy}>{copied ? "Copied" : "Copy"}</button>
              <button className="act" onClick={draft} disabled={busy}>{busy ? "…" : "Redraft"}</button>
              <button className="act" onClick={() => onStatus(o.id, "sent")}>Sent it</button>
            </div>
            <p className="reply-foot">Nothing is sent for you. Copy it across yourself.</p>
          </div>
        )}

        <div className="acts">
          {!o.draft && (
            <button className="act solid" onClick={draft} disabled={busy}>
              {busy ? "Drafting…" : o.kind === "thread" ? "Draft reply" : "Write it"}
            </button>
          )}
          <button className="act" onClick={() => onStatus(o.id, "done")}>Done</button>
          {snoozing ? (
            SNOOZE.map((s) => (
              <button key={s.hours} className="act" onClick={() => onStatus(o.id, "snoozed", s.hours)}>
                {s.label}
              </button>
            ))
          ) : (
            <button className="act" onClick={() => setSnoozing(true)}>Snooze</button>
          )}
          <button className="act" onClick={() => onStatus(o.id, "dismissed")}>Not mine</button>
        </div>
      </div>
    </div>
  );
}

export default function OwedList({
  owed, todayISO, onChange,
}: {
  owed: Owed[];
  todayISO: string;
  onChange: (next: Owed[]) => void;
}) {
  // One timestamp for the whole render, so every row's clock agrees.
  const now = useMemo(() => Date.now(), [owed]);
  const [tier, setTier] = useState<string>("all");

  const ranked = useMemo(() => queue(owed, todayISO, now), [owed, todayISO, now]);
  const shown = tier === "all" ? ranked : ranked.filter((o) => o.tier === tier);

  const late = ranked.filter((o) => breach(o, now) >= 1);
  const counts = TIERS.map((t) => ({ t, n: ranked.filter((o) => o.tier === t.id).length }));

  async function onStatus(id: string, status: OwedStatus, snoozeHours?: number) {
    onChange(owed.filter((o) => o.id !== id));
    await fetch("/api/owed", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id, status, snoozeHours }),
    });
  }

  function onDrafted(id: string, draft: string) {
    onChange(owed.map((o) => (o.id === id ? { ...o, draft: draft || undefined } : o)));
  }

  if (!ranked.length) {
    return (
      <div className="empty">
        <p>Nobody&rsquo;s waiting on you.</p>
        <span>Every thread has your reply last, and no promise is outstanding.</span>
      </div>
    );
  }

  return (
    <>
      <section className="attention" data-tone={late.length ? "hot" : undefined}>
        <h2>{late.length ? `${late.length} past the clock` : "All within time"}</h2>
        <ul>
          <li>
            <b>{ranked.length}</b> waiting.{" "}
            <span>
              A live client gets {tierOf("client").sla}h, an open deal {tierOf("deal").sla}h.
              The bar under each row is how much of that is gone.
            </span>
          </li>
        </ul>
      </section>

      <div className="ventures" style={{ marginTop: 12 }}>
        <button className="venture" data-on={tier === "all"} onClick={() => setTier("all")}>
          All <em>{ranked.length}</em>
        </button>
        {counts.map(({ t, n }) =>
          n ? (
            <button key={t.id} className="venture" data-on={tier === t.id} onClick={() => setTier(t.id)}>
              {t.label} <em>{n}</em>
            </button>
          ) : null,
        )}
      </div>

      <div className="stack">
        {shown.map((o) => (
          <Row
            key={o.id}
            o={o}
            todayISO={todayISO}
            now={now}
            onStatus={onStatus}
            onDrafted={onDrafted}
          />
        ))}
      </div>
    </>
  );
}
