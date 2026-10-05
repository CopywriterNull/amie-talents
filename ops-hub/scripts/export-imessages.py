#!/usr/bin/env python3
"""Export a slice of iMessage history to JSON or Markdown.

Deliberately scoped: chat.db here holds 1.1M messages going back to 2016, and
almost no question needs all of it. Pass a thread and a window.

Requires Full Disk Access for the terminal running this.

  # what threads exist, most recent first
  ./export-imessages.py --list --days 60

  # one thread, last 30 days, as markdown
  ./export-imessages.py --thread "+16619925567" --days 30 --format md

  # search everything for a phrase without dumping the rest
  ./export-imessages.py --grep "collaborator code" --days 90
"""

import argparse
import glob
import json
import os
import sqlite3
import sys
from datetime import datetime, timedelta

CHAT_DB = os.path.expanduser("~/Library/Messages/chat.db")
APPLE_EPOCH = 978307200  # 2001-01-01 in Unix seconds


def apple_to_unix(ns: int) -> int:
    """Apple stores nanoseconds since 2001. Older rows store seconds."""
    return (ns // 1_000_000_000 if ns > 1_000_000_000_000 else ns) + APPLE_EPOCH


def unix_to_apple_ns(ts: float) -> int:
    return int((ts - APPLE_EPOCH) * 1_000_000_000)


def load_contacts() -> dict[str, str]:
    """Map phone/email → contact name, so exports read as people not numbers."""
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
            for raw in (phone, email):
                if not raw:
                    continue
                key = raw if "@" in raw else "".join(ch for ch in raw if ch.isdigit())[-10:]
                if key:
                    names[key] = name
    return names


def pretty(handle: str, contacts: dict[str, str]) -> str:
    if not handle:
        return "Me"
    key = handle if "@" in handle else "".join(c for c in handle if c.isdigit())[-10:]
    return contacts.get(key, handle)


def connect() -> sqlite3.Connection:
    if not os.path.exists(CHAT_DB):
        sys.exit(f"No chat.db at {CHAT_DB}")
    try:
        con = sqlite3.connect(f"file:{CHAT_DB}?mode=ro", uri=True)
        con.execute("SELECT 1 FROM message LIMIT 1")
        return con
    except sqlite3.OperationalError:
        sys.exit(
            "Can't read chat.db. Grant Full Disk Access to your terminal in\n"
            "System Settings → Privacy & Security → Full Disk Access, then restart it."
        )


def list_threads(con: sqlite3.Connection, since_ns: int, contacts: dict[str, str]) -> None:
    rows = con.execute(
        """
        SELECT COALESCE(NULLIF(c.display_name,''), c.chat_identifier),
               CASE WHEN c.style = 43 THEN 'group' ELSE 'direct' END,
               COUNT(*), MAX(m.date)
        FROM message m
        JOIN chat_message_join cmj ON cmj.message_id = m.ROWID
        JOIN chat c ON c.ROWID = cmj.chat_id
        WHERE m.date > ?
        GROUP BY c.ROWID
        ORDER BY COUNT(*) DESC
        """,
        (since_ns,),
    ).fetchall()

    print(f"{'conversation':<34} {'kind':<7} {'msgs':>6}  last")
    print("-" * 66)
    for ident, kind, n, last in rows:
        label = pretty(ident, contacts) if kind == "direct" else ident
        when = datetime.fromtimestamp(apple_to_unix(last)).strftime("%Y-%m-%d")
        print(f"{label[:33]:<34} {kind:<7} {n:>6}  {when}")


def fetch(con, since_ns, thread=None, grep=None, limit=None):
    sql = """
        SELECT m.date,
               m.is_from_me,
               h.id,
               COALESCE(NULLIF(c.display_name,''), c.chat_identifier),
               m.text,
               m.attributedBody
        FROM message m
        JOIN chat_message_join cmj ON cmj.message_id = m.ROWID
        JOIN chat c ON c.ROWID = cmj.chat_id
        LEFT JOIN handle h ON h.ROWID = m.handle_id
        WHERE m.date > ?
    """
    params: list = [since_ns]

    if thread:
        sql += " AND (c.chat_identifier = ? OR c.display_name = ?)"
        params += [thread, thread]
    if grep:
        sql += " AND m.text LIKE ?"
        params.append(f"%{grep}%")

    sql += " ORDER BY m.date ASC"
    if limit:
        sql += f" LIMIT {int(limit)}"

    return con.execute(sql, params).fetchall()


def decode(text, blob):
    """Newer messages keep the body in an NSKeyedArchiver typedstream instead of
    `text`. The payload after the NSString marker is length-prefixed; reading
    that length is what keeps the plist trailer out of the output."""
    if text:
        return text
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


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--list", action="store_true", help="list threads and exit")
    ap.add_argument("--thread", help="chat identifier or group name")
    ap.add_argument("--grep", help="only messages containing this text")
    ap.add_argument("--days", type=int, default=30, help="how far back (default 30)")
    ap.add_argument("--limit", type=int, help="cap the number of messages")
    ap.add_argument("--format", choices=["json", "md"], default="json")
    ap.add_argument("--out", help="write here instead of stdout")
    args = ap.parse_args()

    con = connect()
    contacts = load_contacts()
    since_ns = unix_to_apple_ns((datetime.now() - timedelta(days=args.days)).timestamp())

    if args.list:
        list_threads(con, since_ns, contacts)
        return

    if not args.thread and not args.grep:
        sys.exit("Pass --thread or --grep. Use --list to see what's there.")

    rows = fetch(con, since_ns, args.thread, args.grep, args.limit)

    messages = []
    for date, from_me, handle, chat_name, text, blob in rows:
        body = decode(text, blob)
        if not body:
            continue
        messages.append({
            "at": datetime.fromtimestamp(apple_to_unix(date)).isoformat(timespec="minutes"),
            "from": "Me" if from_me else pretty(handle, contacts),
            "thread": chat_name,
            "text": body,
        })

    if args.format == "json":
        payload = json.dumps({"count": len(messages), "messages": messages}, indent=2, ensure_ascii=False)
    else:
        lines = [f"# iMessage export — {args.thread or f'search: {args.grep}'}",
                 f"_{len(messages)} messages, last {args.days} days_", ""]
        day = None
        for m in messages:
            d = m["at"][:10]
            if d != day:
                lines.append(f"\n## {d}\n")
                day = d
            lines.append(f"**{m['from']}** ({m['at'][11:]}) — {m['text']}")
        payload = "\n".join(lines)

    if args.out:
        with open(args.out, "w", encoding="utf-8") as fh:
            fh.write(payload + "\n")
        print(f"wrote {len(messages)} messages to {args.out}", file=sys.stderr)
    else:
        print(payload)


if __name__ == "__main__":
    main()
