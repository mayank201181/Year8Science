"use client";

import Link from "next/link";
import { useMemo } from "react";
import { TOPIC_META, ACCENT, type TopicMeta } from "@/lib/topics/_meta";
import { rankFor, useStore } from "@/lib/store";

const SUBJECTS = ["Biology", "Chemistry", "Physics"] as const;
const SUBJECT_ICON = { Biology: "🧬", Chemistry: "⚗️", Physics: "⚡" } as const;

export default function Home() {
  const { stars, last, guidesRead, attempts } = useStore();
  const rank = rankFor(stars);

  // total "pieces" of a topic: guide + 2 quiz runners + 8 bank papers = 11
  const topicProgress = useMemo(() => {
    const map: Record<string, number> = {};
    for (const m of TOPIC_META) {
      let done = guidesRead[m.id] ? 1 : 0;
      const prefixes = [`quiz-mcq:${m.id}`, `quiz-qa:${m.id}`, `bank:${m.id}:`];
      for (const key of Object.keys(attempts)) {
        if (prefixes.some((p) => key.startsWith(p)) && attempts[key].completed) done++;
      }
      map[m.id] = Math.min(100, Math.round((done / 11) * 100));
    }
    return map;
  }, [guidesRead, attempts]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* hero */}
      <section className="overflow-hidden rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-sky-50 p-6 sm:p-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl">
            <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-100">
              🎓 Year 8 · Cambridge Lower Secondary Science
            </p>
            <h1 className="text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl">
              Welcome to your <span className="text-indigo-600">Science Lab</span>
            </h1>
            <p className="mt-3 text-slate-600">
              Twelve topics across Biology, Chemistry and Physics — each with an illustrated guide,
              memory tricks, flashcards, quizzes and full practice papers. Learn deeply, then prove it.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              {last ? (
                <Link
                  href={last.href}
                  className="rounded-xl bg-indigo-600 px-5 py-2.5 font-semibold text-white shadow-sm hover:bg-indigo-700"
                >
                  ▶ Resume: {last.label}
                </Link>
              ) : (
                <Link
                  href="/topic/photosynthesis"
                  className="rounded-xl bg-indigo-600 px-5 py-2.5 font-semibold text-white shadow-sm hover:bg-indigo-700"
                >
                  Start with Photosynthesis →
                </Link>
              )}
              <Link
                href="/exam"
                className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 font-semibold text-slate-700 hover:bg-slate-50"
              >
                🏁 The Big Exam
              </Link>
            </div>
          </div>

          <div className="flex shrink-0 flex-col items-center rounded-2xl bg-white p-5 text-center shadow-sm ring-1 ring-slate-100">
            <div className="animate-floaty text-5xl">{rank.emoji}</div>
            <div className="mt-2 text-3xl font-extrabold tabular-nums text-amber-500">⭐ {stars}</div>
            <div className="text-sm font-medium text-slate-500">{rank.name}</div>
            <Link href="/progress" className="mt-3 text-xs font-semibold text-indigo-600 hover:underline">
              View achievements →
            </Link>
          </div>
        </div>
      </section>

      {/* topics by subject */}
      {SUBJECTS.map((subject) => (
        <section key={subject} className="mt-10">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-900">
            <span>{SUBJECT_ICON[subject]}</span> {subject}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
            {TOPIC_META.filter((m) => m.subject === subject).map((m) => (
              <TopicCard key={m.id} meta={m} progress={topicProgress[m.id] ?? 0} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function TopicCard({ meta, progress }: { meta: TopicMeta; progress: number }) {
  const a = ACCENT[meta.accent];
  return (
    <Link
      href={`/topic/${meta.id}`}
      className={`group relative flex flex-col rounded-2xl border bg-gradient-to-br p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${a.card}`}
    >
      <div className="flex items-start gap-4">
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white text-3xl shadow-sm">
          {meta.icon}
        </div>
        <div className="min-w-0">
          <h3 className="font-bold text-slate-900">{meta.title}</h3>
          <p className="mt-0.5 text-sm text-slate-600">{meta.summary}</p>
        </div>
      </div>
      <div className="mt-4">
        <div className="mb-1 flex items-center justify-between text-xs font-medium text-slate-500">
          <span>Progress</span>
          <span className="tabular-nums">{progress}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white/70">
          <div className={`h-full rounded-full ${a.bar} transition-all`} style={{ width: `${progress}%` }} />
        </div>
      </div>
    </Link>
  );
}
