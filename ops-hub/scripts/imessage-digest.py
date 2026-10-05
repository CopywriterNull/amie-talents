#!/usr/bin/env python3
"""Pull recent messages from watched threads into data/imessage-digest.json.

Deliberately dumb: this does extraction only — which threads, which window,
strip the noise. Deciding what counts as a commitment is the model's job during
the refresh, and keeping that split means the expensive step never re-reads
1.1M rows.

Reads data/watched-threads.json. Requires Full Disk Access for the caller.

    ./imessage-digest.py                # honour lookbackDays from config
    ./imessage-digest.py --days 30      # override
    ./imessage-digest.py --stdout       # print instead of writing
"""

# macOS ships an older system python; this keeps `str | None` annotations legal.
from __future__ import annotations

import argparse
import glob
import json
import os
import sqlite3
import sys
from datetime import datetime, timedelta

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CHAT_DB = os.path.expanduser("~/Library/Messages/chat.db")
CONFIG = os.path.join(REPO, "data", "watched-threads.json")
OUT = os.path.join(REPO, "data", "imessage-digest.json")
APPLE_EPOCH = 978307200

# Tapbacks and their echoes carry no commitment and trebled the digest size.
REACTION_PREFIXES = (
    "Loved ", "Liked ", "Disliked ", "Laughed at ", "Emphasized ",
    "Questioned ", "Removed a like from ", "Removed a heart from ",
)


def apple_to_unix(ns: int) -> int:
    return (ns // 1_000_000_000 if ns > 1_000_000_000_000 else ns) + APPLE_EPOCH


def unix_to_apple_ns(ts: float) -> int:
    return int((ts - APPLE_EPOCH) * 1_000_000_000)


def digits(s: str | None) -> str:
    return "".join(c for c in (s or "") if c.isdigit())[-10:]


def load_contacts() -> dict[str, str]:
    names: dict[str, str] = {}
    for db in glob.glob(
        os.path.expanduser(
            "~/Library/Application Support/AddressBook/Sources/*/AddressBook-v22.abcddb"
        )
    ):
        try:
            con = sqlite3.connect(f"file:{db}?mode=ro", uri=True)
            rows = con.execute("""
                SELECT r.ZFIRSTNAME, r.ZLASTNAME, p.ZFULLNUMBER, e.ZADDRESS
                FROM ZABCDRECORD r
                LEFT JOIN ZABCDPHONENUMBER p ON p.ZOWNER = r.Z_PK
                LEFT JOIN ZABCDEMAILADDRESS e ON e.ZOWNER = r.Z_PK
            """).fetchall()
            con.close()
        except sqlite3.Error:
            continue
        for first, last, phone, email in rows:
            name = " ".join(x for x in (first, last) if x).strip()
            if not name:
                continue
            if phone:
                names[digits(phone)] = name
            if email:
                names[email] = name
    return names


def who(handle: str | None, contacts: dict[str, str]) -> str:
    if not handle:
        return "Me"
    return contacts.get(handle if "@" in handle else digits(handle), handle)


def decode(text: str | None, blob: bytes | None) -> str | None:
    """Newer messages store the body in an NSKeyedArchiver typedstream. The
    payload after the NSString marker is length-prefixed; reading that length
    is what keeps the plist trailer out of the text."""
    if text:
        return text.strip() or None
    if not blob:
        return None

    i = blob.find(b"NSString")
    if i == -1:
        return None
    p = blob.find(b"+", i)
    if p == -1:
        return None
    p += 1

    marker = blob[p]
    if marker == 0x81:
        length = int.from_bytes(blob[p + 1 : p + 3], "little")
        p += 3
    elif marker == 0x82:
        length = int.from_bytes(blob[p + 1 : p + 4], "little")
        p += 4
    else:
        length = marker
        p += 1

    return blob[p : p + length].decode("utf-8", errors="replace").strip() or None


# Shortcodes and toll-free senders are automated: order updates, 2FA, marketing.
# Nobody is waiting on a reply from any of them.
NOISE_PREFIXES = ("1800", "1833", "1844", "1855", "1866", "1877", "1888",
                  "800", "833", "844", "855", "866", "877", "888")
NOISE_PATTERNS = (
    "reply stop", "unsubscribe", "txt stop", "attn.tv", "is your code",
    "verification code", "your code is", "do not share this code",
)


def is_automated(handle: str | None, last_text: str) -> bool:
    d = "".join(c for c in (handle or "") if c.isdigit())
    if len(d) <= 6:
        return True                       # shortcode
    if d.startswith(NOISE_PREFIXES):
        return True
    low = last_text.lower()
    return any(p in low for p in NOISE_PATTERNS)


def waiting_scan(con: sqlite3.Connection, contacts: dict[str, str], days: int) -> dict:
    """Every thread whose last real message came from someone else.

    Deliberately dumb, and deliberately separate from the watched-thread digest:
    "the last message is not mine" is a *fact*, not a judgement, so it is
    settled here in SQL rather than asked of a model that might hallucinate an
    unanswered question into a thread Lenny already replied to.

    `scanned` matters as much as `waiting`. A thread that appears in `scanned`
    but not in `waiting` is one he has since answered, which is how the cloud
    knows it can close a row without guessing.
    """
    since = unix_to_apple_ns((datetime.now() - timedelta(days=days)).timestamp())

    active = con.execute(
        """SELECT j.chat_id, MAX(m.date) FROM message m
           JOIN chat_message_join j ON j.message_id = m.ROWID
           WHERE m.date > ? GROUP BY j.chat_id""",
        (since,),
    ).fetchall()

    scanned: list[str] = []
    waiting: list[dict] = []

    for cid, _ in active:
        ident, display, style = con.execute(
            "SELECT chat_identifier, display_name, style FROM chat WHERE ROWID = ?", (cid,)
        ).fetchone()

        rows = con.execute(
            """SELECT m.date, m.is_from_me, h.id, m.text, m.attributedBody
               FROM message m
               JOIN chat_message_join j ON j.message_id = m.ROWID
               LEFT JOIN handle h ON h.ROWID = m.handle_id
               WHERE j.chat_id = ? ORDER BY m.date DESC LIMIT 14""",
            (cid,),
        ).fetchall()

        clean = []
        for date, from_me, handle, text, blob in rows:
            body = decode(text, blob)
            if not body or body.startswith(REACTION_PREFIXES):
                continue
            clean.append((date, from_me, handle, body))
        if not clean:
            continue

        roster = [
            who(r[0], contacts)
            for r in con.execute(
                "SELECT h.id FROM chat_handle_join chj JOIN handle h ON h.ROWID = chj.handle_id "
                "WHERE chj.chat_id = ?",
                (cid,),
            )
        ]
        label = display or (", ".join(roster) if style == 43 else (roster[0] if roster else ident))

        last_date, last_mine, last_handle, last_text = clean[0]
        if is_automated(last_handle or ident, last_text):
            continue

        scanned.append(label)
        if last_mine:
            continue                       # he answered; nothing owed

        waiting.append({
            "label": label,
            "kind": "group" if style == 43 else "direct",
            "participants": roster,
            "lastFrom": who(last_handle, contacts),
            "waitingSince": datetime.fromtimestamp(apple_to_unix(last_date)).isoformat(timespec="minutes"),
            "hoursWaiting": round(
                (datetime.now() - datetime.fromtimestamp(apple_to_unix(last_date))).total_seconds() / 3600, 1
            ),
            # Oldest-first so the model reads it as a conversation.
            "recent": [
                {
                    "at": datetime.fromtimestamp(apple_to_unix(d)).isoformat(timespec="minutes"),
                    "from": "Me" if mine else who(h, contacts),
                    "text": b[:400],
                }
                for d, mine, h, b in reversed(clean[:8])
            ],
        })

    waiting.sort(key=lambda w: w["hoursWaiting"], reverse=True)
    return {"scanned": scanned, "waiting": waiting}


def watched_chat_ids(con: sqlite3.Connection, cfg: dict) -> set[int]:
    ids: set[int] = set()

    for entry in cfg.get("handles", []):
        num = entry["number"]
        ids.update(
            r[0]
            for r in con.execute(
                "SELECT DISTINCT chj.chat_id FROM chat_handle_join chj "
                "JOIN handle h ON h.ROWID = chj.handle_id "
                "WHERE replace(replace(replace(h.id,'+',''),'-',''),' ','') LIKE ?",
                (f"%{num}%",),
            )
        )

    for entry in cfg.get("chats", []):
        ids.update(
            r[0]
            for r in con.execute("SELECT ROWID FROM chat WHERE display_name = ?", (entry["name"],))
        )

    return ids


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--days", type=int)
    ap.add_argument("--stdout", action="store_true")
    args = ap.parse_args()

    with open(CONFIG, encoding="utf-8") as fh:
        cfg = json.load(fh)

    days = args.days or cfg.get("lookbackDays", 7)

    try:
        con = sqlite3.connect(f"file:{CHAT_DB}?mode=ro", uri=True)
        con.execute("SELECT 1 FROM message LIMIT 1")
    except sqlite3.OperationalError:
        # Not fatal: the refresh should still fold in meetings. Emit an empty
        # digest with the reason so the model reports it instead of silently
        # pretending there were no texts.
        payload = {
            "generatedAt": datetime.now().isoformat(timespec="seconds"),
            "error": "chat.db unreadable — grant Full Disk Access to the terminal",
            "threads": [],
        }
        if args.stdout:
            print(json.dumps(payload, indent=2))
        else:
            with open(OUT, "w", encoding="utf-8") as fh:
                json.dump(payload, fh, indent=2)
        print("chat.db unreadable; wrote empty digest", file=sys.stderr)
        return

    contacts = load_contacts()
    since = unix_to_apple_ns((datetime.now() - timedelta(days=days)).timestamp())

    threads = []
    for cid in sorted(watched_chat_ids(con, cfg)):
        ident, display, style = con.execute(
            "SELECT chat_identifier, display_name, style FROM chat WHERE ROWID = ?", (cid,)
        ).fetchone()

        roster = [
            who(r[0], contacts)
            for r in con.execute(
                "SELECT h.id FROM chat_handle_join chj JOIN handle h ON h.ROWID = chj.handle_id "
                "WHERE chj.chat_id = ?",
                (cid,),
            )
        ]

        rows = con.execute(
            """SELECT m.date, m.is_from_me, h.id, m.text, m.attributedBody
               FROM message m
               JOIN chat_message_join j ON j.message_id = m.ROWID
               LEFT JOIN handle h ON h.ROWID = m.handle_id
               WHERE j.chat_id = ? AND m.date > ?
               ORDER BY m.date ASC""",
            (cid, since),
        ).fetchall()

        msgs = []
        for date, from_me, handle, text, blob in rows:
            body = decode(text, blob)
            if not body or body.startswith(REACTION_PREFIXES):
                continue
            msgs.append({
                "at": datetime.fromtimestamp(apple_to_unix(date)).isoformat(timespec="minutes"),
                "from": "Me" if from_me else who(handle, contacts),
                "text": body,
            })

        if msgs:
            threads.append({
                "label": display or (", ".join(roster) if style == 43 else (roster[0] if roster else ident)),
                "kind": "group" if style == 43 else "direct",
                "participants": roster,
                "messages": msgs,
            })

    threads.sort(key=lambda t: t["messages"][-1]["at"], reverse=True)

    # The watched-thread digest above covers the accounts worth reading in full.
    # This second pass sweeps *every* thread for one narrow question: who is
    # still waiting? A live client texting from a number nobody saved is exactly
    # the message that gets missed, and the watch list can't know about it.
    inbox = waiting_scan(con, contacts, days)

    payload = {
        "generatedAt": datetime.now().isoformat(timespec="seconds"),
        "lookbackDays": days,
        "threadCount": len(threads),
        "messageCount": sum(len(t["messages"]) for t in threads),
        "threads": threads,
        "scanned": inbox["scanned"],
        "waiting": inbox["waiting"],
    }

    if args.stdout:
        print(json.dumps(payload, indent=2, ensure_ascii=False))
    else:
        with open(OUT, "w", encoding="utf-8") as fh:
            json.dump(payload, fh, indent=2, ensure_ascii=False)
        print(
            f"{payload['threadCount']} threads, {payload['messageCount']} messages, "
            f"{len(payload['waiting'])} awaiting reply (last {days}d) -> {OUT}",
            file=sys.stderr,
        )


if __name__ == "__main__":
    main()
