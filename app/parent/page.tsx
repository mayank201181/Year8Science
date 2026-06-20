"use client";

import Link from "next/link";
import { useState } from "react";
import { getTopic } from "@/lib/topics";
import type { Analytics, Profile } from "@/lib/profileTypes";

interface Learner {
  profile: Profile;
  stars: number;
  streak: { count: number; best: number };
  guidesRead: number;
  toReview: number;
  answered: number;
  correct: number;
  totalTimeMs: number;
  sessionCount: number;
  firstActiveAt: number;
  lastActiveAt: number;
  days: Analytics["days"];
  topics: Analytics["topics"];
  log: Analytics["log"];
}

function fmtDuration(ms: number): string {
  const m = Math.round(ms / 60000);
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  return `${h}h ${m % 60}m`;
}
function fmtDate(ts: number): string {
  if (!ts) return "—";
  return new Date(ts).toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}
function relDay(ts: number): string {
  if (!ts) return "never";
  const d = Math.floor((Date.now() - ts) / 86400000);
  if (d <= 0) return "today";
  if (d === 1) return "yesterday";
  return `${d} days ago`;
}
const LOG_LABEL: Record<string, string> = { start: "Opened the app", guide: "Read a guide", challenge: "Took a challenge" };

export default function ParentPage() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [data, setData] = useState<{ account: { displayName: string }; learners: Learner[] } | null>(null);

  async function unlock(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    const r = await fetch("/api/parent", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ pin }) });
    const j = await r.json();
    setBusy(false);
    if (!r.ok) {
      setError(j.error || "Could not unlock.");
      return;
    }
    setData(j);
  }

  if (!data) {
    return (
      <div className="grid min-h-[70vh] place-items-center px-4">
        <form onSubmit={unlock} className="w-full max-w-xs space-y-4 rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <div className="text-4xl">🔒</div>
          <h1 className="text-xl font-extrabold text-slate-900">Parent dashboard</h1>
          <p className="text-sm text-slate-500">Enter your parent PIN to see progress reports.</p>
          <input
            inputMode="numeric"
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 8))}
            autoFocus
            className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-center text-lg tracking-widest outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            placeholder="••••"
          />
          {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600">{error}</p>}
          <button type="submit" disabled={busy} className="w-full rounded-xl bg-indigo-600 px-4 py-2.5 font-bold text-white hover:bg-indigo-700 disabled:opacity-60">
            {busy ? "Checking…" : "Unlock"}
          </button>
          <Link href="/" className="block text-sm text-slate-400 hover:underline">← Back to app</Link>
        </form>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Progress reports</h1>
          <p className="text-sm text-slate-500">Account: {data.account.displayName} · {data.learners.length} learner{data.learners.length === 1 ? "" : "s"}</p>
        </div>
        <Link href="/" className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50">← Back to app</Link>
      </div>

      {data.learners.length === 0 && (
        <p className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-slate-500">No learners yet. Add one from the “Who's studying?” screen.</p>
      )}

      <div className="space-y-8">
        {data.learners.map((l) => {
          const acc = l.answered ? Math.round((l.correct / l.answered) * 100) : 0;
          const topicRows = Object.entries(l.topics).sort((a, b) => b[1].timeMs - a[1].timeMs);
          const last7 = Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            const key = d.toISOString().slice(0, 10);
            return { key, label: d.toLocaleDateString(undefined, { weekday: "short" }), stat: l.days[key] };
          });
          const maxDay = Math.max(1, ...last7.map((d) => d.stat?.timeMs || 0));
          return (
            <section key={l.profile.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 pb-4">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-indigo-50 text-3xl">{l.profile.emoji}</span>
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-slate-900">{l.profile.name}</h2>
                  <p className="text-sm text-slate-500">Last active {relDay(l.lastActiveAt)} · started {fmtDate(l.firstActiveAt)}</p>
                </div>
              </div>

              {/* headline stats */}
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Stat label="Time on task" value={fmtDuration(l.totalTimeMs)} />
                <Stat label="Sessions" value={String(l.sessionCount)} />
                <Stat label="Questions" value={String(l.answered)} />
                <Stat label="Accuracy" value={`${acc}%`} />
                <Stat label="Stars" value={`⭐ ${l.stars}`} />
                <Stat label="Day streak" value={`🔥 ${l.streak.count}`} />
                <Stat label="Guides read" value={`${l.guidesRead} / 12`} />
                <Stat label="To review" value={String(l.toReview)} />
              </div>

              {/* last 7 days */}
              <div className="mt-6">
                <p className="mb-2 text-sm font-bold text-slate-700">This week</p>
                <div className="flex items-end gap-2">
                  {last7.map((d) => (
                    <div key={d.key} className="flex flex-1 flex-col items-center gap-1">
                      <div className="flex h-20 w-full items-end rounded-lg bg-slate-50">
                        <div className="w-full rounded-lg bg-indigo-400" style={{ height: `${((d.stat?.timeMs || 0) / maxDay) * 100}%` }} title={`${fmtDuration(d.stat?.timeMs || 0)}`} />
                      </div>
                      <span className="text-[11px] text-slate-400">{d.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* per-topic */}
              {topicRows.length > 0 && (
                <div className="mt-6 overflow-x-auto">
                  <p className="mb-2 text-sm font-bold text-slate-700">By topic</p>
                  <table className="w-full text-left text-sm">
                    <thead className="text-xs uppercase text-slate-400">
                      <tr>
                        <th className="py-1 pr-3">Topic</th>
                        <th className="py-1 pr-3">Time</th>
                        <th className="py-1 pr-3">Q's</th>
                        <th className="py-1 pr-3">Accuracy</th>
                        <th className="py-1 pr-3">Guide</th>
                        <th className="py-1">Challenge</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topicRows.map(([id, t]) => {
                        const tacc = t.answered ? Math.round((t.correct / t.answered) * 100) : 0;
                        return (
                          <tr key={id} className="border-t border-slate-100">
                            <td className="py-1.5 pr-3 font-medium text-slate-700">{getTopic(id)?.title ?? id}</td>
                            <td className="py-1.5 pr-3 tabular-nums text-slate-600">{fmtDuration(t.timeMs)}</td>
                            <td className="py-1.5 pr-3 tabular-nums text-slate-600">{t.answered}</td>
                            <td className="py-1.5 pr-3 tabular-nums text-slate-600">{t.answered ? `${tacc}%` : "—"}</td>
                            <td className="py-1.5 pr-3">{t.guideRead ? "✅" : "—"}</td>
                            <td className="py-1.5 tabular-nums text-slate-600">{t.challengeBest ? `${t.challengeBest}%` : "—"}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* recent activity */}
              {l.log.length > 0 && (
                <details className="mt-6">
                  <summary className="cursor-pointer text-sm font-bold text-slate-700">Recent activity ({l.log.length})</summary>
                  <ul className="mt-2 space-y-1 text-sm text-slate-600">
                    {l.log.slice(0, 25).map((e, i) => (
                      <li key={i} className="flex justify-between gap-3 border-b border-slate-50 py-1">
                        <span>{LOG_LABEL[e.type] ?? e.type}{e.topicId ? ` — ${getTopic(e.topicId)?.title ?? e.topicId}` : ""}{e.detail ? ` (${e.detail})` : ""}</span>
                        <span className="shrink-0 text-slate-400">{fmtDate(e.at)}</span>
                      </li>
                    ))}
                  </ul>
                </details>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 p-3 text-center">
      <p className="text-lg font-extrabold text-slate-900">{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  );
}
