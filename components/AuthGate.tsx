"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";

export function AuthGate() {
  const { login, signup } = useStore();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    const res = mode === "login" ? await login(username, password) : await signup(username, password, pin);
    setBusy(false);
    if (!res.ok) setError(res.error || "Something went wrong.");
  }

  return (
    <div className="grid min-h-screen place-items-center bg-gradient-to-br from-indigo-50 via-white to-emerald-50 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <div className="text-5xl">🔬</div>
          <h1 className="mt-2 text-2xl font-extrabold text-slate-900">Year 8 Science Lab</h1>
          <p className="mt-1 text-sm text-slate-500">
            {mode === "login" ? "Sign in to continue your progress." : "Create a family account to save progress across devices."}
          </p>
        </div>

        <form onSubmit={submit} className="space-y-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Account name</span>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. Mayank"
              autoCapitalize="off"
              className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
          </label>
          {mode === "signup" && (
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Parent PIN (4–8 digits)</span>
              <input
                inputMode="numeric"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 8))}
                placeholder="Used to unlock the parent dashboard"
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
              <span className="mt-1 block text-xs text-slate-400">Keep this private — it protects the progress reports.</span>
            </label>
          )}

          {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600">{error}</p>}

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-xl bg-indigo-600 px-4 py-2.5 font-bold text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {busy ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-500">
          {mode === "login" ? "New here?" : "Already have an account?"}{" "}
          <button
            onClick={() => {
              setMode(mode === "login" ? "signup" : "login");
              setError("");
            }}
            className="font-semibold text-indigo-600 hover:underline"
          >
            {mode === "login" ? "Create a family account" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}
