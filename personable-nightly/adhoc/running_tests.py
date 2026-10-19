#!/usr/bin/env python3
"""Live arms per brand (not owner-paused, weight > 0), read from when the newest arm on that flow started to now (read-only)."""
import collections, math
exec(open("adhoc/recap.py").read().split("SHARE =")[0])
brands = {b["id"]: (b["display_name"] or b["name"]) for b in get("brand", {"select": "id,name,display_name,state"})}
fam = {f["id"]: f["family"] for f in get("flow", {"select": "id,family"})}
presets = {p["id"]: p for p in get("flow_preset", {"select": "id,label,opener_messages"})}
agents = get("agent", {"select": "id,brand_id,flow_id,flow_preset_id,weight,state,owner_paused_at,created_at,archived_at"})
print("## Paused since 10/16\n")
for a in agents:
    if a["owner_paused_at"] and a["owner_paused_at"] >= "2026-10-16T22:00":
        print("-", brands.get(a["brand_id"]), presets.get(a["flow_preset_id"], {}).get("label"), a["owner_paused_at"][:16])
live = [a for a in agents if not a["owner_paused_at"] and not a["archived_at"] and float(a["weight"] or 0) > 0 and a["state"] == "active"]
byflow = collections.defaultdict(list)
for a in live: byflow[a["flow_id"]].append(a)
def op_text(p):
    m = p.get("opener_messages") or []
    return " / ".join((x.get("body") or x.get("text") or str(x)) if isinstance(x, dict) else str(x) for x in m)[:200]
for fid, arms in sorted(byflow.items(), key=lambda kv: brands.get(kv[1][0]["brand_id"], "")):
    start = max(a["created_at"] for a in arms)
    print(f"\n## {brands.get(arms[0]['brand_id'])} [{fam.get(fid)}] since {start[:16]} UTC, {len(arms)} live arm(s)\n")
    rows = []
    for a in arms:
        cv = get("conversation", {"select": "id,first_inbound_at", "agent_id": f"eq.{a['id']}", "opener_sent_at": f"gte.{start}"})
        ids = [c["id"] for c in cv]; rec = {}
        for i in range(0, len(ids), 150):
            for r in get("result", {"select": "conversation_id,amount", "kind": "eq.revenue", "outcome": "eq.Recovered", "conversation_id": f"in.({','.join(ids[i:i+150])})"}, "conversation_id,observed_at"):
                rec[r["conversation_id"]] = float(r["amount"] or 0)
        n, rep = len(cv), sum(bool(c["first_inbound_at"]) for c in cv)
        p = presets.get(a["flow_preset_id"], {})
        rows.append((p.get("label"), float(a["weight"]), n, rep, len(rec), sum(rec.values()), op_text(p)))
    for lab, w, n, rep, o, rev, txt in sorted(rows, key=lambda r: -(r[5] / r[2] if r[2] else 0)):
        print(f"- {lab} w={w:.3f}: n={n} reply {100*rep/max(n,1):.1f}% orders {o} rec {100*o/max(n,1):.1f}% ${rev:.0f} ${rev/max(n,1):.2f}/op\n    opener: {txt}")
    if len(rows) >= 2:
        r = sorted(rows, key=lambda r: -(r[4] / r[2] if r[2] else 0))
        (_, _, n1, _, o1, *_), (_, _, n2, _, o2, *_) = r[0], r[1]
        pp = (o1 + o2) / max(n1 + n2, 1); se = math.sqrt(pp * (1 - pp) * (1 / max(n1, 1) + 1 / max(n2, 1))) or 1
        print(f"  top-2 recovery z = {(o1/max(n1,1) - o2/max(n2,1)) / se:.1f}")
print(f"\nnow {(now - PT):%Y-%m-%d %-I:%M %p} PT")
