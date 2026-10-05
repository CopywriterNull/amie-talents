"use client";

import { useState } from "react";
import type { Item, Status } from "@/lib/types";

export function dueMeta(due: string, todayISO: string) {
  const days = Math.round(
    (new Date(`${due}T00:00:00`).getTime() - new Date(`${todayISO}T00:00:00`).getTime()) / 86_400_000,
  );

  if (days < 0) return { when: "late", label: `${Math.abs(days)}d late`, days };
  if (days === 0) return { when: "today", label: "Today", days };
  if (days === 1) return { when: "soon", label: "Tomorrow", days };
  if (days <= 7) return { when: "soon", label: `${days} days`, days };

  return {
    when: "later",
    label: new Date(`${due}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    days,
  };
}

export default function Card({
  item,
  todayISO,
  onSetStatus,
  onSaveNote,
}: {
  item: Item;
  todayISO: string;
  onSetStatus: (s: Status) => void;
  onSaveNote: (text: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [writing, setWriting] = useState(false);
  const [draft, setDraft] = useState(item.notes ?? "");
  const [reply, setReply] = useState<{ draft: string; thread: string; to: string[] } | null>(null);
  const [drafting, setDrafting] = useState(false);
  const [replyErr, setReplyErr] = useState("");
  const [copied, setCopied] = useState(false);

  const fromText = Boolean(item.source?.startsWith("iMessage"));

  async function draftReply() {
    setDrafting(true);
    setReplyErr("");
    const res = await fetch("/api/draft", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ itemId: item.id }),
    });
    const body = await res.json().catch(() => ({}));
    if (res.ok) setReply(body);
    else setReplyErr(body.error ?? "Couldn't draft a reply.");
    setDrafting(false);
  }

  async function copyReply() {
    if (!reply) return;
    await navigator.clipboard.writeText(reply.draft);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  const due = item.due ? dueMeta(item.due, todayISO) : null;
  const hot = Boolean(due && due.days <= 0 && item.status !== "done");
  const hasDetail = Boolean(item.detail);

  function save() {
    onSaveNote(draft.trim());
    setWriting(false);
  }

  return (
    <div className="card" data-status={item.status} data-hot={hot}>
      <button
        className="check"
        data-status={item.status}
        onClick={() => onSetStatus(item.status === "done" ? "open" : "done")}
        aria-pressed={item.status === "done"}
        aria-label={item.status === "done" ? `Reopen ${item.title}` : `Mark done: ${item.title}`}
      >
        <i />
      </button>

      <div className="card-main">
        <p
          className="card-title"
          role={hasDetail ? "button" : undefined}
          tabIndex={hasDetail ? 0 : undefined}
          aria-expanded={hasDetail ? open : undefined}
          onClick={() => hasDetail && setOpen((v) => !v)}
          onKeyDown={(e) => {
            if (hasDetail && (e.key === "Enter" || e.key === " ")) {
              e.preventDefault();
              setOpen((v) => !v);
            }
          }}
        >
          {item.title}
        </p>

        {open && item.detail && <p className="card-detail">{item.detail}</p>}

        <div className="chips">
          {due && (
            <span className="chip" data-when={due.when}>
              {due.label}
            </span>
          )}
          {item.status === "unknown" && (
            <span className="chip" data-kind="unknown">
              unconfirmed
            </span>
          )}
          {item.isNew && (
            <span className="chip" data-kind="new">
              new
            </span>
          )}
          {item.source && (
            <span className="chip" data-kind="src">
              {item.source}
            </span>
          )}
        </div>

        {replyErr && <p className="reply-err">{replyErr}</p>}

        {reply && (
          <div className="reply">
            <div className="reply-head">
              <span>To {reply.to.join(", ") || reply.thread}</span>
              <button className="reply-x" onClick={() => setReply(null)} aria-label="Discard draft">×</button>
            </div>
            <p className="reply-body">{reply.draft}</p>
            <div className="acts">
              <button className="act solid" onClick={copyReply}>
                {copied ? "Copied" : "Copy"}
              </button>
              <button className="act" onClick={draftReply} disabled={drafting}>
                {drafting ? "…" : "Redraft"}
              </button>
            </div>
            <p className="reply-foot">Nothing is sent. Copy it into Messages yourself.</p>
          </div>
        )}

        {!writing && item.notes && (
          <div className="jot" onClick={() => setWriting(true)}>
            {item.notes}
          </div>
        )}

        {writing ? (
          <div className="editor">
            <textarea
              value={draft}
              autoFocus
              placeholder="What's the state of this?"
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) save();
                if (e.key === "Escape") {
                  setDraft(item.notes ?? "");
                  setWriting(false);
                }
              }}
            />
            <div className="acts">
              <button className="act solid" onClick={save}>Save</button>
              <button className="act" onClick={() => { setDraft(item.notes ?? ""); setWriting(false); }}>
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="acts">
            {item.status !== "done" && (
              <button
                className="act"
                data-on={item.status === "doing"}
                onClick={() => onSetStatus(item.status === "doing" ? "open" : "doing")}
              >
                {item.status === "doing" ? "In progress" : "Start"}
              </button>
            )}
            {hasDetail && (
              <button className="act" onClick={() => setOpen((v) => !v)}>
                {open ? "Less" : "Details"}
              </button>
            )}
            {!item.notes && (
              <button className="act" onClick={() => setWriting(true)}>Note</button>
            )}
            {fromText && !reply && (
              <button className="act" onClick={draftReply} disabled={drafting}>
                {drafting ? "Drafting…" : "Draft reply"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
