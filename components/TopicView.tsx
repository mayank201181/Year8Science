"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Topic } from "@/lib/types";
import { ACCENT, metaById } from "@/lib/topics/_meta";
import { useStore } from "@/lib/store";
import { GuideView } from "./GuideView";
import { InteractiveTab } from "./InteractiveTab";
import { LearnSmart } from "./LearnSmart";
import { QuizTab } from "./QuizTab";
import { QuestionBank } from "./QuestionBank";

type Tab = "guide" | "interactive" | "smart" | "quiz" | "papers";
const TABS: { id: Tab; label: string; emoji: string }[] = [
  { id: "guide", label: "Guide", emoji: "📖" },
  { id: "interactive", label: "Interactive", emoji: "🧪" },
  { id: "smart", label: "Learn Smart", emoji: "🧠" },
  { id: "quiz", label: "Quick Quiz", emoji: "⚡" },
  { id: "papers", label: "Practice Papers", emoji: "📝" },
];

export function TopicView({ topic }: { topic: Topic }) {
  const meta = metaById(topic.id);
  const accent = ACCENT[meta?.accent ?? "violet"];
  const { setLast } = useStore();
  const [tab, setTab] = useState<Tab>("guide");

  // initial tab from ?tab= ; remember activity for "resume".
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("tab") as Tab | null;
    if (t && TABS.some((x) => x.id === t)) setTab(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const label = `${topic.title} · ${TABS.find((t) => t.id === tab)?.label}`;
    setLast({ href: `/topic/${topic.id}?tab=${tab}`, label, topicId: topic.id });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, topic.id]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <Link href="/" className="text-sm font-medium text-slate-500 hover:text-slate-700">
        ← All topics
      </Link>

      {/* topic header */}
      <div className="mt-3 flex items-center gap-4">
        <div className={`grid h-16 w-16 place-items-center rounded-2xl bg-white text-4xl shadow-sm ring-1 ${accent.ring}`}>
          {topic.icon}
        </div>
        <div className="flex-1">
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${accent.chip}`}>{topic.subject}</span>
          <h1 className="mt-1 text-2xl font-extrabold text-slate-900">{topic.title}</h1>
        </div>
        <Link
          href={`/challenge/${topic.id}`}
          className="hidden shrink-0 items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2.5 font-bold text-white shadow-sm hover:bg-amber-600 sm:flex"
        >
          ⏱️ Challenge
        </Link>
      </div>
      <Link
        href={`/challenge/${topic.id}`}
        className="mt-3 flex items-center justify-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2.5 font-bold text-white shadow-sm hover:bg-amber-600 sm:hidden"
      >
        ⏱️ Take the timed Challenge
      </Link>

      {/* tabs */}
      <div className="sticky top-[57px] z-30 -mx-4 mt-5 border-b border-slate-200 bg-[var(--background)]/95 px-4 backdrop-blur">
        <div className="flex gap-1 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`shrink-0 border-b-2 px-4 py-3 text-sm font-semibold transition ${
                tab === t.id
                  ? "border-indigo-600 text-indigo-700"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <span className="mr-1">{t.emoji}</span>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        {tab === "guide" && <GuideView topic={topic} />}
        {tab === "interactive" && <InteractiveTab topic={topic} />}
        {tab === "smart" && <LearnSmart topic={topic} />}
        {tab === "quiz" && <QuizTab topic={topic} />}
        {tab === "papers" && (
          <QuestionBank
            mcqPapers={topic.questionBank.mcqPapers}
            qaPapers={topic.questionBank.qaPapers}
            topicId={topic.id}
            storagePrefix={`bank:${topic.id}`}
            guideHref={(ref) => `/topic/${topic.id}?tab=guide#${ref}`}
          />
        )}
      </div>
    </div>
  );
}
