"use client";

import { useState } from "react";
import type { Note } from "@/lib/types";

export default function Scratchpad({
  notes,
  setNotes,
}: {
  notes: Note[];
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
}) {
  const [draft, setDraft] = useState("");

  async function add() {
    const body = draft.trim();
    if (!body) return;

    setDraft("");
    const res = await fetch("/api/note", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ body }),
    });
    const saved: Note = await res.json();
    setNotes((prev) => [saved, ...prev]);
  }

  async function remove(id: string) {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    await fetch("/api/note", {
      method: "DELETE",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id }),
    });
  }

  return (
    <section className="scratch">
      <h2>Scratchpad</h2>
      <textarea
        value={draft}
        placeholder="Anything that isn't a task yet. ⌘↵ to save."
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) add();
        }}
        aria-label="New note"
      />
      <div className="scratch-foot">
        <button className="act" onClick={add}>
          Save note
        </button>
      </div>

      {notes.length > 0 && (
        <div className="jots">
          {notes.map((n) => (
            <div className="jot-row" key={n.id}>
              <span>{n.body}</span>
              <span style={{ display: "flex", gap: 10, alignItems: "center", flex: "none" }}>
                <time dateTime={n.createdAt}>
                  {new Date(n.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </time>
                <button className="jot-del" onClick={() => remove(n.id)} aria-label="Delete note">
                  ×
                </button>
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
