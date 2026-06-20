"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { lookup } from "@/lib/questionIndex";
import type { MCQ, QA } from "@/lib/types";
import { MarkdownLite } from "@/components/MarkdownLite";

export default function ReviewPage() {
  const { missed, recordResult, award } = useStore();
  // Snapshot the queue once on mount so the list doesn't reshuffle as you answer.
  const initialIds = useMemo(() => Object.keys(missed).filter((id) => lookup(id)), []);
  const [i, setI] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [done, setDone] = useState(0);

  if (initialIds.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <div className="text-6xl">🎉</div>
        <h1 className="mt-4 text-2xl font-extrabold text-slate-900">Nothing to review!</h1>
        <p className="mt-2 text-slate-600">
          Your review pile is empty. As you practise, any question you get wrong lands here so you can
          master it later. Go earn some — and a few mistakes!
        </p>
        <Link href="/" className="mt-6 inline-block rounded-xl bg-indigo-600 px-5 py-2.5 font-semibold text-white hover:bg-indigo-700">
          Back to topics
        </Link>
      </div>
    );
  }

  if (i >= initialIds.length) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <div className="text-6xl">🏆</div>
        <h1 className="mt-4 text-2xl font-extrabold text-slate-900">Review complete!</h1>
        <p className="mt-2 text-slate-600">You worked through {initialIds.length} tricky questions and mastered {done} of them. Great focus.</p>
        <Link href="/" className="mt-6 inline-block rounded-xl bg-indigo-600 px-5 py-2.5 font-semibold text-white hover:bg-indigo-700">
          Done
        </Link>
      </div>
    );
  }

  const item = lookup(initialIds[i])!;
  const q = item.q;

  function next() {
    setRevealed(false);
    setI((v) => v + 1);
  }
  function gotIt() {
    recordResult(q.id, true);
    award(`review:${q.id}`, 1);
    setDone((d) => d + 1);
    next();
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-4 flex items-center justify-between">
        <Link href="/" className="text-sm font-medium text-slate-500 hover:text-slate-700">← Home</Link>
        <span className="text-sm font-semibold text-slate-500">{i + 1} / {initialIds.length}</span>
      </div>
      <div className="mb-4 h-2 overflow-hidden rounded-full bg-slate-200">
        <div className="h-full rounded-full bg-indigo-500 transition-all" style={{ width: `${(i / initialIds.length) * 100}%` }} />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="mb-1 text-xs font-bold uppercase tracking-wide text-indigo-400">{item.topicTitle} · review</p>
        <p className="text-lg font-medium text-slate-900">{q.question}</p>

        {item.kind === "mcq" && (
          <div className="mt-4 space-y-2">
            {(q as MCQ).options.map((opt, oi) => (
              <div
                key={oi}
                className={`rounded-xl border-2 px-4 py-2.5 text-sm ${
                  revealed && oi === (q as MCQ).answerIndex ? "border-emerald-400 bg-emerald-50 font-semibold text-emerald-800" : "border-slate-200 text-slate-700"
                }`}
              >
                {String.fromCharCode(65 + oi)}. {opt} {revealed && oi === (q as MCQ).answerIndex && "✅"}
              </div>
            ))}
          </div>
        )}

        {!revealed ? (
          <button onClick={() => setRevealed(true)} className="mt-5 w-full rounded-xl bg-indigo-600 px-5 py-2.5 font-semibold text-white hover:bg-indigo-700">
            Reveal answer
          </button>
        ) : (
          <div className="mt-5 space-y-3">
            {item.kind === "mcq" ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
                <span className="font-bold">Answer: </span>{(q as MCQ).options[(q as MCQ).answerIndex]}
                <p className="mt-1">{(q as MCQ).explanation}</p>
              </div>
            ) : (
              <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4">
                <p className="mb-1 text-sm font-bold text-indigo-800">⭐ Model answer</p>
                <MarkdownLite text={(q as QA).modelAnswer} className="text-indigo-900/90" />
              </div>
            )}
            <div className="flex gap-3">
              <button onClick={gotIt} className="flex-1 rounded-xl bg-emerald-600 px-4 py-2.5 font-semibold text-white hover:bg-emerald-700">
                ✅ Got it now (⭐1)
              </button>
              <button onClick={next} className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 font-semibold text-slate-600 hover:bg-slate-50">
                Still tricky — keep it
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
