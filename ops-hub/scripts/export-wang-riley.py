#!/usr/bin/env python3
"""Export every thread involving big wang or riley — direct and group.

Group chats named `chatNNNN...` have no display name, so each one is labelled
with its participant numbers (resolved to contact names where known).
"""

import json
import os
import sqlite3
import sys
from datetime import datetime

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from importlib import import_module

exp = import_module("export-imessages".replace("-", "_")) if False else None

CHAT_DB = os.path.expanduser("~/Library/Messages/chat.db")
APPLE_EPOCH = 978307200
TARGETS = ["6468868711", "6047247816"]  # big wang, riley purediffuserco


def apple_to_unix(ns):
    return (ns // 1_000_000_000 if ns > 1_000_000_000_000 else ns) + APPLE_EPOCH


def digits(s):
    return "".join(c for c in (s or "") if c.isdigit())[-10:]


def load_contacts():
    import glob

    names = {}
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


def who(handle, contacts):
    if not handle:
        return "Me"
    return contacts.get(handle if "@" in handle else digits(handle), handle)


def decode(text, blob):
    """Newer messages store the body in a NSKeyedArchiver typedstream rather
    than `text`. After the NSString marker the payload is length-prefixed;
    reading that length is what keeps the plist trailer out of the output."""
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

    body = blob[p : p + length].decode("utf-8", errors="replace").strip()
    return body or None


def main():
    con = sqlite3.connect(f"file:{CHAT_DB}?mode=ro", uri=True)
    contacts = load_contacts()

    like = " OR ".join(
        "replace(replace(replace(h.id,'+',''),'-',''),' ','') LIKE '%%%s%%'" % t for t in TARGETS
    )
    chat_ids = [
        r[0]
        for r in con.execute(
            f"SELECT DISTINCT chj.chat_id FROM chat_handle_join chj "
            f"JOIN handle h ON h.ROWID=chj.handle_id WHERE {like}"
        )
    ]

    threads = []
    for cid in chat_ids:
        ident, display, style = con.execute(
            "SELECT chat_identifier, display_name, style FROM chat WHERE ROWID=?", (cid,)
        ).fetchone()

        people = [
            r[0]
            for r in con.execute(
                "SELECT h.id FROM chat_handle_join chj JOIN handle h ON h.ROWID=chj.handle_id "
                "WHERE chj.chat_id=?",
                (cid,),
            )
        ]
        roster = [who(p, contacts) for p in people]

        rows = con.execute(
            """SELECT m.date, m.is_from_me, h.id, m.text, m.attributedBody
               FROM message m
               JOIN chat_message_join j ON j.message_id = m.ROWID
               LEFT JOIN handle h ON h.ROWID = m.handle_id
               WHERE j.chat_id = ? ORDER BY m.date ASC""",
            (cid,),
        ).fetchall()

        msgs = []
        for date, from_me, handle, text, blob in rows:
            body = decode(text, blob)
            if not body:
                continue
            msgs.append({
                "at": datetime.fromtimestamp(apple_to_unix(date)).isoformat(timespec="minutes"),
                "from": "Me" if from_me else who(handle, contacts),
                "text": body,
            })

        if not msgs:
            continue

        label = display or (", ".join(roster) if style == 43 else roster[0] if roster else ident)
        threads.append({
            "chat_id": cid,
            "label": label,
            "kind": "group" if style == 43 else "direct",
            "participants": [{"handle": p, "name": who(p, contacts)} for p in people],
            "message_count": len(msgs),
            "messages": msgs,
        })

    threads.sort(key=lambda t: t["messages"][-1]["at"], reverse=True)
    total = sum(t["message_count"] for t in threads)

    out_json = os.path.expanduser("~/Desktop/imessages-wang-riley.json")
    with open(out_json, "w", encoding="utf-8") as fh:
        json.dump({"threads": threads, "total_messages": total}, fh, indent=2, ensure_ascii=False)

    lines = [
        "# iMessages — big wang & riley purediffuserco",
        f"_{len(threads)} threads, {total} messages_",
        "",
        "## Threads",
        "",
    ]
    for t in threads:
        who_list = ", ".join(f"{p['name']} ({p['handle']})" for p in t["participants"])
        lines.append(f"- **{t['label']}** — {t['kind']}, {t['message_count']} msgs — {who_list}")

    for t in threads:
        lines += ["", "---", "", f"# {t['label']}",
                  f"_{t['kind']}, {t['message_count']} messages_", ""]
        day = None
        for m in t["messages"]:
            d = m["at"][:10]
            if d != day:
                lines += ["", f"### {d}", ""]
                day = d
            lines.append(f"**{m['from']}** {m['at'][11:]} — {m['text']}")

    out_md = os.path.expanduser("~/Desktop/imessages-wang-riley.md")
    with open(out_md, "w", encoding="utf-8") as fh:
        fh.write("\n".join(lines) + "\n")

    print(f"{len(threads)} threads, {total} messages")
    print(f"  {out_md}")
    print(f"  {out_json}")


if __name__ == "__main__":
    main()
