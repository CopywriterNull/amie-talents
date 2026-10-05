import { neon } from "@neondatabase/serverless";

/**
 * Lazy init on purpose: `neon()` throws when DATABASE_URL is missing, and
 * Next.js evaluates top-level module code during `next build`. Calling it at
 * import time crashes the build on any deploy that happens before the env var
 * is wired. A plain function — not a Proxy — since Proxy wrappers break
 * libraries that introspect the client.
 */
let cached: ReturnType<typeof neon> | null = null;

export function sql() {
  if (!cached) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL is not set");
    cached = neon(url);
  }
  return cached;
}

export function hasDatabase(): boolean {
  return Boolean(process.env.DATABASE_URL);
}
