"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { TOPIC_META } from "@/lib/topics/_meta";
import { RANKS, rankFor, useStore } from "@/lib/store";

interface Achievement {
  id: string;
  name: string;
  emoji: string;
  done: boolean;
  hint: string;
}

export default function ProgressPage() {
  const { stars, guidesRead, attempts, resetAll } = useStore();
  const rank = rankFor(stars);
  const nextRank = RANKS.find((r) => r.min > stars);

  const guidesDone = Object.keys(guidesRead).length;
  const completedAttempts = useMemo(
    () => Object.values(attempts).filter((a) => a.completed).length,
    [attempts],
  );

  const achievements: Achievement[] = [
    { id: "first-guide", name: "First Steps", emoji: "👣", done: guidesDone >= 1, hint: "Read your first guide" },
    { id: "five-guides", name: "Bookworm", emoji: "📚", done: guidesDone >= 5, hint: "Read 5 topic guides" },
    { id: "all-guides", name: "Curriculum Crusher", emoji: "🏰", done: guidesDone >= TOPIC_META.length, hint: `Read all ${TOPIC_META.length} guides` },
    { id: "first-paper", name: "Paper Rookie", emoji: "📝", done: completedAttempts >= 1, hint: "Finish any quiz or paper" },
    { id: "ten-papers", name: "Practice Machine", emoji: "⚙️", done: completedAttempts >= 10, hint: "Finish 10 quizzes/papers" },
    { id: "stars-100", name: "Century", emoji: "💯", done: stars >= 100, hint: "Collect 100 stars" },
    { id: "stars-300", name: "Star Hoarder", emoji: "🌟", done: stars >= 300, hint: "Collect 300 stars" },
    { id: "professor", name: "Professor", emoji: "🎓", done: stars >= 500, hint: "Reach 500 stars" },
  ];

  const pctToNext = nextRank
    ? Math.round(((stars - rank.min) / (nextRank.min - rank.min)) * 100)
    : 100;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link href="/" className="text-sm font-medium text-slate-500 hover:text-slate-700">
        ← Home
      </Link>

      <div className="mt-3 rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-6 text-center sm:p-8">
        <div className="animate-floaty text-6xl">{rank.emoji}</div>
        <div className="mt-2 text-4xl font-extrabold text-amber-500">⭐ {stars}</div>
        <div className="text-lg font-bold text-slate-800">{rank.name}</div>
        {nextRank ? (
          <div className="mx-auto mt-4 max-w-xs">
            <div className="mb-1 text-xs font-medium text-slate-500">
              {nextRank.min - stars} stars to {nextRank.name} {nextRank.emoji}
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-white">
              <div className="h-full rounded-full bg-amber-400" style={{ width: `${pctToNext}%` }} />
            </div>
          </div>
        ) : (
          <p className="mt-3 font-semibold text-emerald-600">Top rank reached! 🎉</p>
        )}
      </div>

      {/* stats */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Stat label="Guides read" value={`${guidesDone} / ${TOPIC_META.length}`} emoji="📖" />
        <Stat label="Quizzes & papers done" value={`${completedAttempts}`} emoji="✅" />
        <Stat label="Stars earned" value={`${stars}`} emoji="⭐" />
      </div>

      {/* achievements */}
      <h2 className="mb-3 mt-8 text-xl font-bold text-slate-900">🏅 Achievements</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {achievements.map((a) => (
          <div
            key={a.id}
            className={`rounded-2xl border p-4 text-center ${
              a.done ? "border-amber-300 bg-amber-50" : "border-slate-200 bg-white opacity-70"
            }`}
            title={a.hint}
          >
            <div className={`text-3xl ${a.done ? "" : "grayscale"}`}>{a.emoji}</div>
            <div className="mt-1 text-sm font-bold text-slate-800">{a.name}</div>
            <div className="text-xs text-slate-500">{a.done ? "Unlocked!" : a.hint}</div>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <ResetProgress onReset={resetAll} />
      </div>
    </div>
  );
}

/** Wiping a learner's progress also overwrites the cloud copy, so a grown-up must confirm with the parent PIN. */
function ResetProgress({ onReset }: { onReset: () => void }) {
  const [open, setOpen] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function confirmReset(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const r = await fetch("/api/parent", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ pin, verifyOnly: true }) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) {
        setError(j.error || "Could not check the PIN.");
        return;
      }
      onReset();
      setOpen(false);
      setPin("");
    } catch {
      setError("Couldn't reach the server. Check your internet connection.");
    } finally {
      setBusy(false);
    }
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="text-sm font-medium text-rose-500 hover:underline">
        Reset all progress
      </button>
    );
  }
  return (
    <form onSubmit={confirmReset} className="mx-auto max-w-xs space-y-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-left">
      <p className="text-sm text-rose-800">
        This deletes all stars, scores and saved answers for this learner and can&apos;t be undone. A grown-up needs to enter the parent PIN.
      </p>
      <input
        inputMode="numeric"
        value={pin}
        onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 8))}
        aria-label="Parent PIN"
        placeholder="Parent PIN"
        className="w-full rounded-xl border border-rose-200 bg-white px-3 py-2 text-center tracking-widest outline-none focus:border-rose-400"
      />
      {error && <p className="text-sm text-rose-700">{error}</p>}
      <div className="flex gap-2">
        <button type="submit" disabled={busy || pin.length < 4} className="flex-1 rounded-xl bg-rose-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50">
          {busy ? "Checking…" : "Reset progress"}
        </button>
        <button type="button" onClick={() => { setOpen(false); setPin(""); setError(""); }} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600">
          Cancel
        </button>
      </div>
    </form>
  );
}

function Stat({ label, value, emoji }: { label: string; value: string; emoji: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm">
      <div className="text-2xl">{emoji}</div>
      <div className="mt-1 text-xl font-extrabold text-slate-900">{value}</div>
      <div className="text-xs text-slate-500">{label}</div>
    </div>
  );
}
