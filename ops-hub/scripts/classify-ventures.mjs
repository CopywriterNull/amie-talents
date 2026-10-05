/**
 * Tag every item with the business it belongs to, so the board can be filtered
 * by venture rather than only by urgency.
 *
 * Section is a good default but not sufficient — "slipped" holds both a G FUEL
 * SMS contract and an Escape Hatch prospect, and "people" mixes both. So:
 * section sets the default, then explicit ids override it.
 *
 *   npx dotenv -e .env.local -- node scripts/classify-ventures.mjs
 */

import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

await sql.query(`ALTER TABLE items ADD COLUMN IF NOT EXISTS venture TEXT`);

const BY_SECTION = {
  today: "gfuel",
  runbook: "gfuel",
  tiktok: "gfuel",
  build: "gfuel",
  decisions: "gfuel",
  people: "gfuel",
  slipped: "gfuel",
  pipeline: "escapehatch",
  yours: "personal",
  personal: "personal",
};

// Items whose section doesn't imply their venture.
const OVERRIDE = {
  "s-swipe-ai": "escapehatch",
  "d-agency-revshare": "escapehatch",
  "p-pure-close": "escapehatch",
  "b-redwood-webhook": "personal",   // Jeff's site, not G FUEL
  "f-major-futures": "personal",
  "f-brandon": "personal",
  "y-jeff-retainer": "personal",
  "y-jeff-referral-fee": "personal",
  "x-immigration": "personal",
  "x-nobu-tonight": "personal",
  "y-comp": "gfuel",
  "y-kingswood": "gfuel",
  "y-wes": "gfuel",
  "y-transaction": "gfuel",
  "p-sappington-slack": "escapehatch",
};

const items = await sql.query("SELECT id, section, source, title FROM items");

let n = 0;
for (const it of items) {
  let venture = OVERRIDE[it.id] ?? BY_SECTION[it.section] ?? "gfuel";

  // MailTail shows up by name rather than by section.
  if (/mailtail/i.test(`${it.title} ${it.source ?? ""}`)) venture = "mailtail";

  await sql.query("UPDATE items SET venture = $2 WHERE id = $1", [it.id, venture]);
  n++;
}

const counts = await sql.query(
  "SELECT venture, COUNT(*)::int n FROM items GROUP BY venture ORDER BY n DESC",
);
console.log(`tagged ${n} items`);
console.log(counts.map((r) => `${r.venture}=${r.n}`).join("  "));

// The `is_new` flags have all been reviewed by now; leaving them set would make
// the "added since you last looked" count permanently wrong.
const cleared = await sql.query(
  "UPDATE items SET is_new = FALSE WHERE is_new RETURNING id",
);
console.log(`cleared ${cleared.length} stale "new" flags`);
