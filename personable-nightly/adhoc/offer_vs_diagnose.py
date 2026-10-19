#!/usr/bin/env python3
"""Offer-led vs diagnose-led openers on the same flow and window, plus how much recovery rides on our code (read-only)."""
import collections, math
exec(open("adhoc/recap.py").read().split("SHARE =")[0])
brands = {b["id"]: (b["display_name"] or b["name"]) for b in get("brand", {"select": "id,name,display_name"})}
fam = {f["id"]: f["family"] for f in get("flow", {"select": "id,family"})}
presets = {p["id"]: p["label"] or "" for p in get("flow_preset", {"select": "id,label"})}
agents = get("agent", {"select": "id,brand_id,flow_id,flow_preset_id,weight,state,owner_paused_at,created_at,archived_at"})
live = [a for a in agents if not a["owner_paused_at"] and not a["archived_at"] and float(a["weight"] or 0) > 0 and a["state"] == "active" and fam.get(a["flow_id"]) == "abandoned_checkout_recovery"]
byflow = collections.defaultdict(list)
for a in live: byflow[a["flow_id"]].append(a)
def kind(lab):
    l = lab.lower()
    return "offer" if "offer" in l else "diagnose" if ("diagnose" in l or "price or question" in l or "opener a" in l) else None
tot = collections.defaultdict(collections.Counter)
print("| Brand | Opener | n | Reply | Orders | Recovery | $/opener | Orders w/ our code | link only | neither |\n|---|---|---|---|---|---|---|---|---|---|")
lost_o = lost_r = 0
for fid, arms in byflow.items():
    ks = {kind(presets.get(a["flow_preset_id"], "")) for a in arms}
    if not {"offer", "diagnose"} <= ks: continue
    start = max(a["created_at"] for a in arms); b = brands[arms[0]["brand_id"]]
    agg = collections.defaultdict(collections.Counter)
    for a in arms:
        k = kind(presets.get(a["flow_preset_id"], ""))
        if not k: continue
        cv = get("conversation", {"select": "id,first_inbound_at", "agent_id": f"eq.{a['id']}", "opener_sent_at": f"gte.{start}"})
        ids = [c["id"] for c in cv]; rec, att, ref = {}, {}, {}
        for i in range(0, len(ids), 150):
            q = f"in.({','.join(ids[i:i+150])})"
            for r in get("result", {"select": "conversation_id,amount,reference", "kind": "eq.revenue", "outcome": "eq.Recovered", "conversation_id": q}, "conversation_id,observed_at"):
                rec[r["conversation_id"]] = float(r["amount"] or 0); ref[r["conversation_id"]] = r["reference"]
            for r in get("attribution", {"select": "conversation_id,code_redeemed,link_clicked", "conversation_id": q}):
                x = att.setdefault(r["conversation_id"], [False, False]); x[0] |= r["code_redeemed"]; x[1] |= r["link_clicked"]
        g = agg[k]; g["n"] += len(cv); g["rep"] += sum(bool(c["first_inbound_at"]) for c in cv); g["ord"] += len(rec); g["rev"] += sum(rec.values())
        for cid in rec:
            c, l = att.get(cid, [False, False]); g["code" if c else "link" if l else "none"] += 1
            if not c:
                so = get("shop_order", {"select": "discount_codes", "id": f"eq.{ref[cid]}"}) if ref.get(cid) else []
                dc = (so[0]["discount_codes"] if so else None) or []
                g["other_code" if dc else "no_code"] += 1
    for k in ("offer", "diagnose"):
        g = agg[k]; tot[k].update(g); n = max(g["n"], 1); o = max(g["ord"], 1)
        print(f"| {b} | {k} | {g['n']} | {100*g['rep']/n:.1f}% | {g['ord']} | {100*g['ord']/n:.1f}% | ${g['rev']/n:.2f} | {100*g['code']/o:.0f}% | {100*g['link']/o:.0f}% | {100*g['none']/o:.0f}% | brand/other code {g['other_code']}, no code {g['no_code']} |")
    o, d = agg["offer"], agg["diagnose"]
    if not (o["ord"] and d["ord"]): continue
    lost_o += o["n"] * (o["ord"] / o["n"] - d["ord"] / d["n"]); lost_r += o["n"] * (o["rev"] / o["n"] - d["rev"] / d["n"])
    print(f"|  | offer vs diagnose | | | | {100*(o['ord']/o['n'])/(d['ord']/d['n'])-100:+.0f}% | {100*(o['rev']/o['n'])/(d['rev']/d['n'])-100:+.0f}% | | | |")
for k in ("offer", "diagnose"):
    g = tot[k]; n = g["n"]; o = g["ord"]
    print(f"| **All** | {k} | {n} | {100*g['rep']/n:.1f}% | {o} | {100*o/n:.1f}% | ${g['rev']/n:.2f} | {100*g['code']/o:.0f}% | {100*g['link']/o:.0f}% | {100*g['none']/o:.0f}% | brand/other code {g['other_code']}, no code {g['no_code']} |")
print(f"\nIf the offer arms' openers had gone diagnose at each brand's diagnose rate: {lost_o:+.0f} orders, ${lost_r:+.0f} more for offer (i.e. lost by switching)")
