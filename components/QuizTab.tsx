"use client";

import { useState } from "react";
import type { Topic } from "@/lib/types";
import { PaperRunner } from "./PaperRunner";

export function QuizTab({ topic }: { topic: Topic }) {
  const [mode, setMode] = useState<"mcq" | "qa">("mcq");
  const guideHref = (ref: string) => `/topic/${topic.id}?tab=guide#${ref}`;

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-4 text-sm text-slate-600">
        A quick check on <strong>{topic.title}</strong> — 4 multiple-choice and 4 written questions. Each
        correct answer earns stars. Use the hints if you get stuck!
      </div>

      <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1">
        <button
          onClick={() => setMode("mcq")}
          className={`rounded-lg px-4 py-1.5 text-sm font-semibold ${mode === "mcq" ? "bg-indigo-600 text-white" : "text-slate-600"}`}
        >
          Multiple choice ({topic.quiz.mcq.length})
        </button>
        <button
          onClick={() => setMode("qa")}
          className={`rounded-lg px-4 py-1.5 text-sm font-semibold ${mode === "qa" ? "bg-indigo-600 text-white" : "text-slate-600"}`}
        >
          Written ({topic.quiz.qa.length})
        </button>
      </div>

      {mode === "mcq" ? (
        <PaperRunner
          kind="mcq"
          questions={topic.quiz.mcq}
          storageKey={`quiz-mcq:${topic.id}`}
          title="Quick Quiz · Multiple choice"
          topicId={topic.id}
          guideHref={guideHref}
        />
      ) : (
        <PaperRunner
          kind="qa"
          questions={topic.quiz.qa}
          storageKey={`quiz-qa:${topic.id}`}
          title="Quick Quiz · Written"
          topicId={topic.id}
          guideHref={guideHref}
        />
      )}
    </div>
  );
}
