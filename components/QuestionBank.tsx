"use client";

import { useMemo, useState } from "react";
import type { MCQ, Paper, QA } from "@/lib/types";
import { useStore } from "@/lib/store";
import { PaperRunner } from "./PaperRunner";

type Selected =
  | { kind: "mcq"; paper: Paper<MCQ> }
  | { kind: "qa"; paper: Paper<QA> }
  | null;

export function QuestionBank({
  mcqPapers,
  qaPapers,
  topicId,
  storagePrefix,
  guideHref,
}: {
  mcqPapers: Paper<MCQ>[];
  qaPapers: Paper<QA>[];
  topicId?: string;
  storagePrefix: string; // e.g. `bank:photosynthesis` or `exam`
  guideHref?: (ref: string) => string | undefined;
}) {
  const [sel, setSel] = useState<Selected>(null);

  if (sel) {
    const key = `${storagePrefix}:${sel.paper.id}`;
    return (
      <div className="space-y-4">
        <button
          onClick={() => setSel(null)}
          className="text-sm font-semibold text-indigo-600 hover:underline"
        >
          ← All papers
        </button>
        {sel.kind === "mcq" ? (
          <PaperRunner
            kind="mcq"
            questions={sel.paper.questions}
            storageKey={key}
            title={sel.paper.title}
            topicId={topicId}
            guideHref={guideHref}
          />
        ) : (
          <PaperRunner
            kind="qa"
            questions={sel.paper.questions}
            storageKey={key}
            title={sel.paper.title}
            topicId={topicId}
            guideHref={guideHref}
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PaperGroup
        title="Multiple-choice papers"
        emoji="🔘"
        papers={mcqPapers}
        storagePrefix={storagePrefix}
        onOpen={(paper) => setSel({ kind: "mcq", paper })}
      />
      <PaperGroup
        title="Written-answer papers"
        emoji="✍️"
        papers={qaPapers}
        storagePrefix={storagePrefix}
        onOpen={(paper) => setSel({ kind: "qa", paper })}
      />
    </div>
  );
}

function PaperGroup<Q extends { id: string }>({
  title,
  emoji,
  papers,
  storagePrefix,
  onOpen,
}: {
  title: string;
  emoji: string;
  papers: Paper<Q>[];
  storagePrefix: string;
  onOpen: (paper: Paper<Q>) => void;
}) {
  if (!papers.length) return null;
  return (
    <section>
      <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-slate-900">
        <span>{emoji}</span> {title}
      </h3>
      <div className="grid gap-3 sm:grid-cols-2">
        {papers.map((p) => (
          <PaperCard key={p.id} paper={p} storageKey={`${storagePrefix}:${p.id}`} onOpen={() => onOpen(p)} />
        ))}
      </div>
    </section>
  );
}

function PaperCard<Q extends { id: string }>({
  paper,
  storageKey,
  onOpen,
}: {
  paper: Paper<Q>;
  storageKey: string;
  onOpen: () => void;
}) {
  const { attempts } = useStore();
  const attempt = attempts[storageKey];
  const status = useMemo(() => {
    if (!attempt) return { label: "Not started", answered: 0 };
    const answered = Object.keys(attempt.answers).length;
    return {
      label: attempt.completed ? "Completed ✓" : `In progress · Q${attempt.index + 1}`,
      answered,
    };
  }, [attempt]);

  const total = paper.questions.length;
  const pct = total ? Math.round((status.answered / total) * 100) : 0;

  return (
    <button
      onClick={onOpen}
      className="flex flex-col rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md"
    >
      <div className="flex items-center justify-between">
        <span className="font-bold text-slate-900">{paper.title}</span>
        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
          {total} Qs
        </span>
      </div>
      <span className="mt-1 text-sm text-slate-500">{status.label}</span>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-indigo-500 transition-all" style={{ width: `${pct}%` }} />
      </div>
    </button>
  );
}
