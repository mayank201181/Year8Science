"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { lookup } from "@/lib/questionIndex";
import type { MCQ, QA } from "@/lib/types";
import { optionOrder } from "@/lib/optionOrder";
import { MarkdownLite } from "@/components/MarkdownLite";

export default function ReviewPage() {
  const { srs, recordResult, award } = useStore();
  // Snapshot the due queue once on mount so the list doesn't reshuffle as you answer.
  const initialIds = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return Object.entries(srs)
      .filter(([id, s]) => s.due <= today && lookup(id))
      .sort((a, b) => a[1].due.localeCompare(b[1].due))
      .map(([id]) => id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [i, setI] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [picked, setPicked] = useState<number | null>(null);
  const [draft, setDraft] = useState("");
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
    setPicked(null);
    setDraft("");
    setI((v) => v + 1);
  }
  // Review is retrieval practice: answer first, then the result moves the schedule.
  function markResult(right: boolean) {
    recordResult(q.id, right);
    if (right) {
      award(`review:${q.id}`, 1);
      setDone((d) => d + 1);
    }
  }
  function choose(option: number) {
    if (picked !== null) return;
    setPicked(option);
    markResult(option === (q as MCQ).answerIndex);
  }
  function rateWritten(right: boolean) {
    markResult(right);
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

        {item.kind === "mcq" ? (
          <McqReview mcq={q as MCQ} picked={picked} onPick={choose} onNext={next} />
        ) : !revealed ? (
          <div className="mt-4 space-y-3">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={4}
              aria-label="Your answer"
              placeholder="Write (or say out loud) your answer first, then check it…"
              className="w-full rounded-xl border border-slate-300 bg-slate-50 p-3 text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
            <button onClick={() => setRevealed(true)} className="w-full rounded-xl bg-indigo-600 px-5 py-2.5 font-semibold text-white hover:bg-indigo-700">
              Check against the model answer
            </button>
          </div>
        ) : (
          <div className="mt-5 space-y-3">
            {draft.trim() && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                <p className="mb-1 font-bold text-slate-800">Your answer</p>
                <p className="whitespace-pre-wrap">{draft}</p>
              </div>
            )}
            <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4">
              <p className="mb-1 text-sm font-bold text-indigo-800">⭐ Model answer</p>
              <MarkdownLite text={(q as QA).modelAnswer} className="text-indigo-900/90" />
            </div>
            <p className="text-sm text-slate-600">Be honest: did your answer include the key ideas?</p>
            <div className="flex gap-3">
              <button onClick={() => rateWritten(true)} className="flex-1 rounded-xl bg-emerald-600 px-4 py-2.5 font-semibold text-white hover:bg-emerald-700">
                ✅ I got it (⭐1)
              </button>
              <button onClick={() => rateWritten(false)} className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 font-semibold text-slate-600 hover:bg-slate-50">
                Not yet — see again soon
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function McqReview({ mcq, picked, onPick, onNext }: { mcq: MCQ; picked: number | null; onPick: (option: number) => void; onNext: () => void }) {
  const right = picked === mcq.answerIndex;
  return (
    <>
      <div className="mt-4 space-y-2">
        {optionOrder(mcq).map((oi, position) => {
          const isAnswer = oi === mcq.answerIndex;
          let cls = "border-slate-200 bg-white text-slate-700 hover:border-indigo-300";
          if (picked !== null) {
            if (isAnswer) cls = "border-emerald-400 bg-emerald-50 font-semibold text-emerald-800";
            else if (oi === picked) cls = "border-rose-400 bg-rose-50 text-rose-800";
            else cls = "border-slate-200 bg-white text-slate-500 opacity-70";
          }
          return (
            <button key={oi} type="button" onClick={() => onPick(oi)} disabled={picked !== null}
              className={`flex w-full items-center gap-3 rounded-xl border-2 px-4 py-2.5 text-left text-sm transition ${cls}`}>
              <span className="font-bold">{String.fromCharCode(65 + position)}.</span>
              <span>{mcq.options[oi]}</span>
              {picked !== null && isAnswer && <span className="ml-auto">✅</span>}
              {picked === oi && !isAnswer && <span className="ml-auto">❌</span>}
            </button>
          );
        })}
      </div>
      {picked === null ? (
        <p className="mt-4 text-sm text-slate-500">Pick the answer you think is right.</p>
      ) : (
        <div className="mt-5 space-y-3">
          <div className={`rounded-xl border p-4 text-sm ${right ? "border-emerald-200 bg-emerald-50 text-emerald-900" : "border-rose-200 bg-rose-50 text-rose-900"}`}>
            <p className="font-bold">{right ? "✅ Correct! ⭐1" : "Not quite — this one will come back soon."}</p>
            {!right && <p className="mt-1"><span className="font-semibold">Answer: </span>{mcq.options[mcq.answerIndex]}</p>}
            <p className="mt-1">{mcq.explanation}</p>
          </div>
          <button onClick={onNext} className="w-full rounded-xl bg-indigo-600 px-5 py-2.5 font-semibold text-white hover:bg-indigo-700">
            Next →
          </button>
        </div>
      )}
    </>
  );
}
