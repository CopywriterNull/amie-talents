"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      // Read the redirect target off the URL directly rather than via
      // useSearchParams, which would force the whole form into a Suspense
      // boundary and leave the login screen blank until JS loads.
      const next = new URLSearchParams(window.location.search).get("next");
      router.replace(next || "/");
      router.refresh();
    } else {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? "That password didn't match.");
      setBusy(false);
    }
  }

  return (
    <main className="gate-wrap">
      <form className="gate" onSubmit={submit}>
        <h1>Ops Hub</h1>
        <p>This board is private.</p>
        <input
          type="password"
          value={password}
          autoFocus
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          aria-label="Password"
        />
        <button className="act" type="submit" disabled={busy || !password}>
          {busy ? "Checking…" : "Unlock"}
        </button>
        {error && <span className="gate-error">{error}</span>}
      </form>
    </main>
  );
}
