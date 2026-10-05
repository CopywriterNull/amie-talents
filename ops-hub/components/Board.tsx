"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SECTIONS, VENTURES, type Board as BoardData, type Item, type Note, type Owed, type Status } from "@/lib/types";
import type { AgentStatus } from "@/lib/agents";
import { breach, queue } from "@/lib/owed";
import Agents from "./Agents";
import Card, { dueMeta } from "./Card";
import OwedList from "./OwedList";
import Scratchpad from "./Scratchpad";

type View = "owed" | "now" | "soon" | "all" | "agents";

function daysTo(due: string, todayISO: string) {
  return Math.round(
    (new Date(`${due}T00:00:00`).getTime() - new Date(`${todayISO}T00:00:00`).getTime()) / 86_400_000,
  );
}

export default function Board({
  initial,
  owed: initialOwed,
  agents,
  todayISO,
}: {
  initial: BoardData;
  owed: Owed[];
  agents: AgentStatus[];
  todayISO: string;
}) {
  const [items, setItems] = useState<Item[]>(initial.items);
  const [notes, setNotes] = useState<Note[]>(initial.notes);
  const [owed, setOwed] = useState<Owed[]>(initialOwed);
  // Land on whatever is actually on fire: if something has blown its SLA the
  // queue opens first, otherwise the day's list does.
  const [view, setView] = useState<View>(() => {
    const now = Date.now();
    return queue(initialOwed, todayISO, now).some((o) => breach(o, now) >= 1) ? "owed" : "now";
  });
  const [venture, setVenture] = useState("all");
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [showDone, setShowDone] = useState(false);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [dark, setDark] = useState(false);

  useEffect(() => {
    // Light unless they've explicitly chosen dark before.
    setDark(localStorage.getItem("ops-theme") === "dark");
  }, []);

  function flipTheme() {
    const next = !dark;
    setDark(next);
    document.documentElement.dataset.theme = next ? "dark" : "light";
    localStorage.setItem("ops-theme", next ? "dark" : "light");
  }

  const history = useRef<{ id: string; status: Status }[]>([]);
  const itemsRef = useRef(items);
  itemsRef.current = items;

  const push = useCallback(async (id: string, status: Status) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
    await fetch("/api/item", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
  }, []);

  const setStatus = useCallback(
    (id: string, status: Status) => {
      const before = itemsRef.current.find((i) => i.id === id);
      if (before && before.status !== status) history.current.push({ id, status: before.status });
      return push(id, status);
    },
    [push],
  );

  const saveNote = useCallback(async (id: string, text: string) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, notes: text } : i)));
    await fetch("/api/item", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id, notes: text }),
    });
  }, []);

  const live = useMemo(
    () =>
      items.filter(
        (i) =>
          (showDone || i.status !== "done") &&
          (venture === "all" || i.venture === venture),
      ),
    [items, showDone, venture],
  );

  const searched = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return live;
    return live.filter((i) =>
      `${i.title} ${i.detail ?? ""} ${i.source ?? ""} ${i.notes ?? ""}`.toLowerCase().includes(q),
    );
  }, [live, query]);

  const now = useMemo(
    () =>
      searched
        .filter((i) => i.due && daysTo(i.due, todayISO) <= 0)
        .sort((a, b) => {
          const da = daysTo(a.due!, todayISO);
          const db = daysTo(b.due!, todayISO);
          if ((da === 0) !== (db === 0)) return da === 0 ? -1 : 1;
          return da - db;
        }),
    [searched, todayISO],
  );

  const soon = useMemo(
    () =>
      searched
        .filter((i) => i.due && daysTo(i.due, todayISO) > 0 && daysTo(i.due, todayISO) <= 7)
        .sort((a, b) => daysTo(a.due!, todayISO) - daysTo(b.due!, todayISO)),
    [searched, todayISO],
  );

  const done = items.filter((i) => i.status === "done").length;
  const pct = items.length ? Math.round((done / items.length) * 100) : 0;

  // Recomputed on every owed change so the tab count and the late badge track
  // the list rather than the last render's snapshot.
  const owedLive = useMemo(() => queue(owed, todayISO), [owed, todayISO]);
  const owedLate = useMemo(
    () => owedLive.filter((o) => breach(o) >= 1).length,
    [owedLive],
  );

  const agentsBad = agents.filter(
    (a) => a.health === "failing" || a.health === "stale",
  ).length;

  // Things the board wants to tell you before you start scrolling.
  const flags = useMemo(() => {
    const proposals = live.filter((i) => i.notes?.includes("Refresh thinks this is done"));
    const unconfirmed = live.filter((i) => i.status === "unknown");
    const fresh = live.filter((i) => i.isNew);
    return { proposals, unconfirmed, fresh };
  }, [live]);

  function toggleSection(id: string) {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const stamp = new Date(`${todayISO}T12:00:00`);
  const C = 2 * Math.PI * 16;

  function render(list: Item[]) {
    return list.map((i) => (
      <Card
        key={i.id}
        item={i}
        todayISO={todayISO}
        onSetStatus={(s) => setStatus(i.id, s)}
        onSaveNote={(t) => saveNote(i.id, t)}
      />
    ));
  }

  return (
    <>
      <header className="top">
        <div className="top-row">
          <div className="brand">
            <b>Ops Hub</b>
            <span>
              {stamp.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
              {" · "}
              {items.length - done} open
            </span>
          </div>

          <button
            className="icon-btn"
            data-on={searching}
            onClick={() => { setSearching((v) => !v); if (searching) setQuery(""); }}
            aria-label="Search"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" />
            </svg>
          </button>

          <button
            className="icon-btn"
            data-on={showDone}
            onClick={() => setShowDone((v) => !v)}
            aria-label={showDone ? "Hide completed" : "Show completed"}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </button>

          <button className="icon-btn" onClick={flipTheme} aria-label={dark ? "Switch to light" : "Switch to dark"}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor" stroke="none" />
            </svg>
          </button>

          <div className="ring" aria-label={`${pct}% complete`}>
            <svg width="38" height="38">
              <circle className="track" cx="19" cy="19" r="16" />
              <circle
                className="fill"
                cx="19" cy="19" r="16"
                strokeDasharray={C}
                strokeDashoffset={C - (C * pct) / 100}
              />
            </svg>
            <b>{pct}%</b>
          </div>
        </div>

        <div className="ventures">
          {VENTURES.map((v) => {
            const n = v.id === "all"
              ? items.filter((i) => i.status !== "done").length
              : items.filter((i) => i.venture === v.id && i.status !== "done").length;
            if (!n && v.id !== "all") return null;
            return (
              <button
                key={v.id}
                className="venture"
                data-on={venture === v.id}
                onClick={() => setVenture(v.id)}
              >
                {v.label}
                <em>{n}</em>
              </button>
            );
          })}
        </div>

        <div className="views">
          {([
            ["owed", "Owed", owedLive.length],
            ["now", "Now", now.length],
            ["soon", "This week", soon.length],
            ["all", "Everything", searched.length],
            ["agents", "Agents", agentsBad || agents.length],
          ] as [View, string, number][]).map(([id, label, n]) => (
            <button key={id} className="view" data-on={view === id} onClick={() => setView(id)}>
              {label} <em data-late={(id === "owed" && owedLate > 0) || (id === "agents" && agentsBad > 0)}>{n}</em>
            </button>
          ))}
        </div>

        {searching && (
          <div className="searchbar">
            <input
              autoFocus
              value={query}
              placeholder="Search items, notes, meetings…"
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search"
            />
          </div>
        )}
      </header>

      <main className="page" id="main">
        {view === "owed" && (
          <OwedList owed={owed} todayISO={todayISO} onChange={setOwed} />
        )}

        {view === "agents" && <Agents agents={agents} />}

        {view === "now" && flags.proposals.length + flags.unconfirmed.length + flags.fresh.length > 0 && (
          <section className="attention">
            <h2>Worth knowing</h2>
            <ul>
              {flags.proposals.length > 0 && (
                <li>
                  <b>{flags.proposals.length}</b>{" "}
                  {flags.proposals.length === 1 ? "item looks" : "items look"} finished to the last
                  refresh. <span>Open them and confirm — the refresh can't close things itself.</span>
                </li>
              )}
              {flags.unconfirmed.length > 0 && (
                <li>
                  <b>{flags.unconfirmed.length}</b> unconfirmed —{" "}
                  <span>the source never recorded an outcome. Dashed checkbox.</span>
                </li>
              )}
              {flags.fresh.length > 0 && (
                <li>
                  <b>{flags.fresh.length}</b> added since you last looked.{" "}
                  <span>Treat them as proposals, not facts.</span>
                </li>
              )}
            </ul>
          </section>
        )}

        {view === "now" && (
          <div className="stack">
            {now.length ? render(now) : (
              <div className="empty">
                <p>Nothing due today.</p>
                <span>Check &ldquo;This week&rdquo; for what&rsquo;s coming.</span>
              </div>
            )}
          </div>
        )}

        {view === "soon" && (
          <div className="stack">
            {soon.length ? (
              soon.map((item, i) => {
                const prev = soon[i - 1];
                const label = dueMeta(item.due!, todayISO).label;
                const newDay = !prev || dueMeta(prev.due!, todayISO).label !== label;
                return (
                  <div key={item.id}>
                    {newDay && <div className="date-line">{label}</div>}
                    <Card
                      item={item}
                      todayISO={todayISO}
                      onSetStatus={(s) => setStatus(item.id, s)}
                      onSaveNote={(t) => saveNote(item.id, t)}
                    />
                  </div>
                );
              })
            ) : (
              <div className="empty">
                <p>Nothing scheduled this week.</p>
                <span>Everything dated is further out.</span>
              </div>
            )}
          </div>
        )}

        {view === "all" &&
          SECTIONS.map((section) => {
            const list = searched.filter((i) => i.section === section.id);
            if (!list.length) return null;
            const isOpen = !collapsed.has(section.id);

            return (
              <section key={section.id} style={{ marginTop: 22 }}>
                <button
                  className="head"
                  aria-expanded={isOpen}
                  onClick={() => toggleSection(section.id)}
                >
                  <h2>{section.label}</h2>
                  <span className="n">{list.length}</span>
                  <span className="chev">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 6l6 6-6 6" />
                    </svg>
                  </span>
                </button>
                {isOpen && (
                  <>
                    <p className="head-note">{section.blurb}</p>
                    <div className="stack" style={{ marginTop: 0 }}>{render(list)}</div>
                  </>
                )}
              </section>
            );
          })}

        {!searched.length && query && (
          <div className="empty">
            <p>Nothing matches &ldquo;{query}&rdquo;.</p>
            <span>Try fewer words, or turn on completed items.</span>
          </div>
        )}

        {view === "all" && <Scratchpad notes={notes} setNotes={setNotes} />}

        <div className="foot">
          Tap a title to read the detail · tap the box to finish it
          <br />
          Refreshed{" "}
          {new Date(initial.lastRefresh).toLocaleString("en-US", {
            month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
          })}{" "}
          from meetings, texts and email.
        </div>
      </main>
    </>
  );
}
