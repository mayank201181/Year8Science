"use client";

import { useState } from "react";

interface Preset {
  kind: string;
  label: string;
}

export function AskAI({
  topic,
  context,
  presets = [],
  placeholder = "Ask Professor Photon anything about this topic…",
  buttonLabel = "✨ Ask the AI tutor",
}: {
  topic: string;
  context?: string;
  presets?: Preset[];
  placeholder?: string;
  buttonLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function ask(body: object) {
    setBusy(true);
    setError("");
    setAnswer("");
    try {
      const r = await fetch("/api/ai", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ topic, ...body }) });
      const j = await r.json();
      if (!r.ok) setError(j.error || "Something went wrong.");
      else setAnswer(j.text);
    } catch {
      setError("Couldn't reach the tutor. Check your connection.");
    } finally {
      setBusy(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-violet-200 bg-violet-50 px-3 py-1.5 text-sm font-semibold text-violet-700 hover:bg-violet-100"
      >
        {buttonLabel}
      </button>
    );
  }

  return (
    <div className="my-3 rounded-2xl border-2 border-violet-200 bg-gradient-to-br from-violet-50/70 to-white p-4">
      <div className="mb-2 flex items-center justify-between">
        <p className="flex items-center gap-2 text-sm font-bold text-violet-700">🧑‍🔬 Professor Photon — AI tutor</p>
        <button onClick={() => setOpen(false)} className="text-violet-300 hover:text-violet-500" aria-label="Close">✕</button>
      </div>

      {presets.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {presets.map((p) => (
            <button
              key={p.kind}
              onClick={() => ask({ kind: p.kind, context })}
              disabled={busy}
              className="rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-violet-700 disabled:opacity-60"
            >
              {p.label}
            </button>
          ))}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (question.trim()) ask({ kind: "ask", question, context });
        }}
        className="flex gap-2"
      >
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={placeholder}
          className="flex-1 rounded-lg border border-violet-200 px-3 py-2 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
        />
        <button type="submit" disabled={busy || !question.trim()} className="rounded-lg bg-violet-600 px-3 py-2 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-60">
          Ask
        </button>
      </form>

      {busy && <p className="mt-3 animate-pulse text-sm text-violet-500">Professor Photon is thinking… 💭</p>}
      {error && <p className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600">{error}</p>}
      {answer && (
        <div className="mt-3 whitespace-pre-wrap rounded-xl border border-violet-100 bg-white p-3 text-sm text-slate-700">{answer}</div>
      )}
      <p className="mt-2 text-[11px] text-slate-400">AI can make mistakes — always double-check with your guide.</p>
    </div>
  );
}
