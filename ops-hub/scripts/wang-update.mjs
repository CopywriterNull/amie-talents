import { neon } from "@neondatabase/serverless";
const sql = neon(process.env.DATABASE_URL);

const nextPos = "(SELECT COALESCE(MAX(position), 0) + 1 FROM items)";

// Sarina was in fact onboarded on Jul 29 — the merge said so and I overrode it.
// What's actually outstanding is the trial update he promised and never sent.
await sql.query("UPDATE items SET status='done', updated_at=NOW(), notes=$2 WHERE id=$1", [
  "p-sarina",
  "Onboarded Jul 29: Phoilex.com, collab code 3635, script live same day. Superseded by p-sarina-update.",
]);

const rows = [
  ["p-sarina-update", "Send Sarina her trial update — 8 days silent",
   "You told her Jul 29 you'd update her 'next week' and haven't messaged since Jul 30. Her two-week trial started Jul 29, so it's ending around Aug 12 with no result shared. Phoilex.com, referred by Big Wang.",
   "pipeline", "2026-08-08", "open", "iMessage — big wang, +16479704106, Jul 29", "escapehatch"],

  ["p-felix", "Send Felix the Escape Hatch details and client list",
   "Big Wang intro'd him today. German, based in Europe, normally uses WhatsApp or Telegram rather than iMessage — worth moving the thread there. He's waiting on what the product does and which brands you work with; Wang asked you to send exactly that.",
   "pipeline", "2026-08-08", "open", "iMessage — big wang, +4915738001193, Aug 7", "escapehatch"],

  ["p-nabeel-followup", "Nabeel has had no answer for two days",
   "Last message was yours on Aug 5 showing the strange traffic locations. Nothing since, and Big Wang had already chased once. Store is v0xwxv-1w.myshopify.com (collab code 7264). Even 'still digging, here's what I've ruled out' beats silence on a referred account.",
   "pipeline", "2026-08-07", "open", "iMessage — big wang, +18582122003, Aug 5", "escapehatch"],
];

for (const [id, title, detail, section, due, status, source, venture] of rows) {
  await sql.query(
    `INSERT INTO items (id,title,detail,section,due,status,source,venture,is_new,position)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,TRUE,${nextPos})
     ON CONFLICT (id) DO UPDATE SET detail=EXCLUDED.detail, due=EXCLUDED.due`,
    [id, title, detail, section, due, status, source, venture],
  );
}

// Jason answered the AdRevival split question on Aug 6.
await sql.query("UPDATE items SET title=$2, detail=$3, due=$4 WHERE id=$1", [
  "d-adrevival-cut",
  "Take Jason's AdRevival terms to Dan",
  "Jason's answer on Aug 6: give Dan 20% of profit, Jason and Wang take 30%, you keep 50%. His reasoning is Dan spends $40M/month on ads, so he wants him properly incentivised — and he asked you to tell Dan you never do this for anyone else. Nothing has gone to Dan yet.",
  "2026-08-11",
]);

const c = await sql.query("SELECT COUNT(*)::int n FROM items WHERE status<>'done'");
console.log("open items:", c[0].n);
