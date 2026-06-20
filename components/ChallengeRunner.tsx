"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { MCQ, Topic } from "@/lib/types";
import { topicMcqPool } from "@/lib/questionIndex";
import { useStore } from "@/lib/store";

const ROUND = 10;
const SECONDS = 90;

function pickRandom(pool: MCQ[], n: number): MCQ[] {
  const a = [...pool];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, n);
}

export function ChallengeRunner({ topic }: { topic: Topic }) {
  const { setChallengeBest, award, recordResult, challengeBest } = useStore();
  const [seed, setSeed] = useState(0);
  const questions = useMemo(() => pickRandom(topicMcqPool(topic.id), ROUND), [topic.id, seed]);
  const [phase, setPhase] = useState<"intro" | "play" | "done">("intro");
  const [idx, setIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [time, setTime] = useState(SECONDS);
  const [picked, setPicked] = useState<number | null>(null);

  useEffect(() => {
    if (phase !== "play") return;
    if (time <= 0) {
      finish();
      return;
    }
    const t = setTimeout(() => setTime((s) => s - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, time]);

  const best = challengeBest[topic.id] ?? 0;

  function start() {
    setPhase("play");
    setIdx(0);
    setCorrect(0);
    setTime(SECONDS);
    setPicked(null);
  }

  function choose(i: number) {
    if (picked !== null) return;
    setPicked(i);
    const right = i === questions[idx].answerIndex;
    recordResult(questions[idx].id, right);
    if (right) setCorrect((c) => c + 1);
    setTimeout(() => {
      if (idx + 1 >= questions.length) finish(right ? correct + 1 : correct);
      else {
        setIdx((v) => v + 1);
        setPicked(null);
      }
    }, 700);
  }

  function finish(finalCorrect?: number) {
    const c = finalCorrect ?? correct;
    const score = Math.round((c / questions.length) * 100);
    setChallengeBest(topic.id, score);
    award(`challenge-done:${topic.id}:${Date.now()}`, 5);
    if (score === 100) award(`challenge-perfect:${topic.id}`, 15);
    else if (score >= 80) award(`challenge-pass:${topic.id}`, 8);
    setPhase("done");
  }

  if (phase === "intro") {
    return (
      <Card>
        <div className="text-5xl">⏱️</div>
        <h1 className="mt-3 text-2xl font-extrabold text-slate-900">{topic.title} Challenge</h1>
        <p className="mt-2 text-slate-600">{ROUND} multiple-choice questions. {SECONDS} seconds. No second chances — answer fast and accurately!</p>
        {best > 0 && <p className="mt-2 font-semibold text-amber-600">🏅 Your best: {best}%</p>}
        <button onClick={start} className="mt-5 rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white hover:bg-indigo-700">Start challenge →</button>
        <div className="mt-3"><Link href={`/topic/${topic.id}`} className="text-sm text-slate-500 hover:underline">Back to topic</Link></div>
      </Card>
    );
  }

  if (phase === "done") {
    const score = Math.round((correct / questions.length) * 100);
    const mastered = score >= 80;
    return (
      <Card>
        <div className="text-6xl">{score === 100 ? "🏆" : score >= 80 ? "🎉" : "💪"}</div>
        <h1 className="mt-3 text-2xl font-extrabold text-slate-900">{score}%</h1>
        <p className="mt-1 text-slate-600">{correct} / {questions.length} correct</p>
        {mastered ? (
          <Link href={`/certificate/${topic.id}`} className="mt-4 inline-block rounded-xl bg-emerald-600 px-5 py-2.5 font-bold text-white hover:bg-emerald-700">
            🎓 Get your certificate
          </Link>
        ) : (
          <p className="mt-3 text-sm text-slate-500">Score 80% or more to unlock the topic certificate.</p>
        )}
        <div className="mt-5 flex justify-center gap-3">
          <button onClick={() => { setSeed((s) => s + 1); start(); }} className="rounded-xl border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-600 hover:bg-slate-50">Try again</button>
          <Link href={`/topic/${topic.id}`} className="rounded-xl border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-600 hover:bg-slate-50">Back to topic</Link>
        </div>
      </Card>
    );
  }

  const q = questions[idx];
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-500">Q{idx + 1} / {questions.length}</span>
        <span className={`rounded-full px-3 py-1 text-sm font-bold tabular-nums ${time <= 15 ? "bg-rose-100 text-rose-700" : "bg-slate-100 text-slate-700"}`}>⏱ {time}s</span>
      </div>
      <div className="mb-4 h-2 overflow-hidden rounded-full bg-slate-200">
        <div className="h-full rounded-full bg-amber-400 transition-all" style={{ width: `${(time / SECONDS) * 100}%` }} />
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-lg font-medium text-slate-900">{q.question}</p>
        <div className="mt-4 space-y-2">
          {q.options.map((opt, i) => {
            let cls = "border-slate-200 bg-white hover:border-indigo-300";
            if (picked !== null) {
              if (i === q.answerIndex) cls = "border-emerald-400 bg-emerald-50";
              else if (i === picked) cls = "border-rose-400 bg-rose-50";
              else cls = "border-slate-200 opacity-60";
            }
            return (
              <button key={i} onClick={() => choose(i)} disabled={picked !== null} className={`flex w-full items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition ${cls}`}>
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-slate-300 text-sm font-bold text-slate-600">{String.fromCharCode(65 + i)}</span>
                <span className="text-slate-800">{opt}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">{children}</div>
    </div>
  );
}
