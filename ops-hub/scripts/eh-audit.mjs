import { neon } from "@neondatabase/serverless";
const sql = neon(process.env.DATABASE_URL);
const pos = "(SELECT COALESCE(MAX(position),0)+1 FROM items)";

const rows = [
  ["p-kaiyo-disabled", "Kaiyo/Crafted has escape_enabled = false",
   "craftedbykaiyo.com is installed but the escape is switched off, and it stopped sending events on Aug 3. This is the same brand Big Wang asked about on Jul 29 — 'why is crafted not getting best results when the rest are' — and you told him you had no idea. Worth checking whether it was already off then. Either way it isn't running now.",
   "pipeline", "2026-08-10", "open"],

  ["p-ember-disabled", "Ember has escape_enabled = false",
   "buyember.co went live Jul 30, sent events until Aug 4, and the escape is now switched off. Eleven days old and already dark — no test, no result, nothing to sell them on.",
   "pipeline", "2026-08-10", "open"],

  ["p-andar-dead", "Andar has been dark for six weeks",
   "andar.com has escape_enabled = false and its last event was Jun 26. 402k events historically, so it worked — then stopped. Either revive it or mark the account closed so it stops inflating the client count.",
   "pipeline", "2026-08-11", "open"],

  ["p-phoilex-nodata", "Phoilex has no funnel data at all",
   "Sarina's store has 356 events in 11 days but zero rows in hourly_funnel_rollups, so there is no measurable A/B result to report. Sending her a trial update right now would mean reporting on a test that has not produced data. Fix the funnel tracking first, then update her.",
   "pipeline", "2026-08-10", "open"],

  ["p-billing-gap", "20 of 22 live merchants have never been billed",
   "Only PURE ($300 paid) and SuperBonsai have a card on file. Everyone else is live, generating events daily, and on an indefinite free trial. The longest running: RideCased 89 days, COVE 84, Elavi 84, Haus 83, NotJustSundays 75, Huppy 54. COVE and Haus are the two case studies you quote at every prospect — +43.9% and +41% — and neither has ever been invoiced. This is the single biggest revenue item in the business.",
   "pipeline", "2026-08-11", "open"],
];

for (const [id, title, detail, section, due, status] of rows) {
  await sql.query(
    `INSERT INTO items (id,title,detail,section,due,status,source,venture,is_new,position)
     VALUES ($1,$2,$3,$4,$5,$6,'Escape Hatch DB audit — Aug 10','escapehatch',TRUE,${pos})
     ON CONFLICT (id) DO UPDATE SET detail=EXCLUDED.detail, due=EXCLUDED.due`,
    [id, title, detail, section, due, status],
  );
}

const c = await sql.query("SELECT COUNT(*)::int n FROM items WHERE status<>'done'");
console.log("open items:", c[0].n);
