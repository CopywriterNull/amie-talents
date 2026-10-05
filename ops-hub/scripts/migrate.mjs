#!/usr/bin/env node
/**
 * Create the schema and import data/board.json into Postgres.
 *
 * Idempotent: re-running upserts rather than duplicating, so it doubles as the
 * "push local changes up" path while both copies of the board exist.
 *
 *   npx dotenv -e .env.local -- node scripts/migrate.mjs
 */

import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { neon } from "@neondatabase/serverless";

const REPO = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

if (!process.env.DATABASE_URL) {
  console.error(
    "DATABASE_URL is not set.\n" +
      "Run: vercel env pull .env.local --yes\n" +
      "Then: npx dotenv -e .env.local -- node scripts/migrate.mjs",
  );
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

const schema = await readFile(path.join(REPO, "lib", "schema.sql"), "utf8");
// neon-http sends one statement per round trip, so split on the semicolons
// that end a statement rather than shipping the whole file.
for (const stmt of schema.split(/;\s*$/m).map((s) => s.trim()).filter(Boolean)) {
  await sql.query(stmt);
}
console.log("schema applied");

const board = JSON.parse(await readFile(path.join(REPO, "data", "board.json"), "utf8"));

let n = 0;
for (const [i, item] of board.items.entries()) {
  await sql.query(
    `INSERT INTO items (id, title, detail, section, grp, due, status, source, notes, is_new, position, updated_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
     ON CONFLICT (id) DO UPDATE SET
       title = EXCLUDED.title,
       detail = EXCLUDED.detail,
       section = EXCLUDED.section,
       grp = EXCLUDED.grp,
       due = EXCLUDED.due,
       source = EXCLUDED.source,
       position = EXCLUDED.position,
       -- status and notes are the user's; a re-import must never clobber them
       status = items.status,
       notes = items.notes`,
    [
      item.id,
      item.title,
      item.detail ?? null,
      item.section,
      item.group ?? null,
      item.due ?? null,
      item.status,
      item.source ?? null,
      item.notes ?? null,
      item.isNew ?? false,
      i,
      item.updatedAt ?? null,
    ],
  );
  n++;
}
console.log(`${n} items imported`);

for (const note of board.notes ?? []) {
  await sql.query(
    `INSERT INTO notes (id, body, created_at) VALUES ($1,$2,$3)
     ON CONFLICT (id) DO NOTHING`,
    [note.id, note.body, note.createdAt],
  );
}
console.log(`${(board.notes ?? []).length} notes imported`);

for (const [key, value] of Object.entries({
  lastRefresh: board.lastRefresh,
  coversThrough: board.coversThrough,
})) {
  await sql.query(
    `INSERT INTO meta (key, value) VALUES ($1,$2)
     ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`,
    [key, value],
  );
}

const [{ count }] = await sql.query("SELECT COUNT(*)::int AS count FROM items");
console.log(`done — ${count} items in Postgres`);
