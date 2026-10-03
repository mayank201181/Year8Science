"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { MCQ, QA } from "@/lib/types";
import { useStore, type AttemptState } from "@/lib/store";
import { scoreSelfAssessment, claimAssessment } from "@/lib/selfAssessment";
import { optionOrder } from "@/lib/optionOrder";
import { MarkdownLite } from "./MarkdownLite";
import { AskAI } from "./AskAI";

type Props = {
  storageKey: string;
  title: string;
  /** Used to build "back to the guide" links and namespace stars. */
  topicId?: string;
  /** Build an href for a guide reference, or undefined to hide the link. */
  guideHref?: (guideRef: string) => string | undefined;
  onProgress?: () => void;
} & (
  | { kind: "mcq"; questions: MCQ[] }
  | { kind: "qa"; questions: QA[] }
);

export function PaperRunner(props: Props) {
  const { storageKey, title, topicId, guideHref, kind, questions } = props;
  const { getAttempt, saveAttempt, award, recordResult } = useStore();

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number | string>>({});
  const [scores, setScores] = useState<Record<string, number>>({});
  const [completed, setCompleted] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Per-question transient UI state (not persisted).
  const [selected, setSelected] = useState<number | null>(null); // current MCQ choice
  const [draft, setDraft] = useState(""); // current QA textarea
  const [showHint, setShowHint] = useState(false);
  const [checked, setChecked] = useState(false); // current question has been checked
  const [showSummary, setShowSummary] = useState(false);
  const [selfMarks, setSelfMarks] = useState<boolean[]>([]);
  const claimedResults = useRef(new Set<string>());

  // ---- hydrate saved attempt ----
  useEffect(() => {
    claimedResults.current.clear();
    const saved = getAttempt(storageKey);
    if (saved) {
      setIndex(Math.min(saved.index, questions.length - 1));
      setAnswers(saved.answers);
      setScores(saved.scores);
      setCompleted(saved.completed);
    } else {
      setIndex(0);
      setAnswers({});
      setScores({});
      setCompleted(false);
    }
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  // ---- persist on change ----
  const persist = useCallback(
    (next: Partial<AttemptState>) => {
      saveAttempt(storageKey, {
        index,
        answers,
        scores,
        completed,
        updatedAt: Date.now(),
        ...next,
      });
    },
    [saveAttempt, storageKey, index, answers, scores, completed],
  );

  const q = questions[index];

  // When the visible question changes, restore its committed state.
  useEffect(() => {
    if (!q) return;
    const committed = answers[q.id];
    setShowHint(false);
    setSelfMarks(kind === "qa" ? (q as QA).markScheme.map(() => false) : []);
    if (kind === "mcq") {
      setSelected(typeof committed === "number" ? committed : null);
      setChecked(typeof committed === "number");
      setDraft("");
    } else {
      setDraft(typeof committed === "string" ? committed : "");
      setChecked(typeof committed === "string");
      setSelected(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, hydrated, storageKey, answers, scores, kind, q?.id]);

  const go = (i: number) => {
    if (i < 0 || i >= questions.length) return;
    setIndex(i);
    persist({ index: i });
    props.onProgress?.();
  };

  // ---- per-question status for the navigator ----
  const statusOf = useCallback(
    (qi: number): "unanswered" | "correct" | "partial" | "incorrect" => {
      const item = questions[qi];
      if (kind === "mcq") {
        const a = answers[item.id];
        if (typeof a !== "number") return "unanswered";
        return a === (item as MCQ).answerIndex ? "correct" : "incorrect";
      } else {
        const s = scores[item.id];
        if (s === undefined) return "unanswered";
        if (s >= 0.75) return "correct";
        if (s >= 0.34) return "partial";
        return "incorrect";
      }
    },
    [answers, scores, kind, questions],
  );

  const answeredCount = useMemo(
    () => questions.filter((_, i) => statusOf(i) !== "unanswered").length,
    [questions, statusOf],
  );

  // ---- checking an MCQ ----
  function checkMcq() {
    if (selected === null) return;
    const mcq = q as MCQ;
    if (!claimAssessment(claimedResults.current, mcq.id, answers[mcq.id] !== undefined)) return;
    const nextAnswers = { ...answers, [mcq.id]: selected };
    setAnswers(nextAnswers);
    setChecked(true);
    const isRight = selected === mcq.answerIndex;
    recordResult(mcq.id, isRight);
    if (isRight) {
      award(`ans:${storageKey}:${mcq.id}`, 1);
    }
    saveAttempt(storageKey, { index, answers: nextAnswers, scores, completed, updatedAt: Date.now() });
    props.onProgress?.();
  }

  // Written answers are explicitly self-assessed against the model and mark points.
  // Keyword overlap cannot validate the meaning or negation of an explanation.
  function checkQa() {
    if (checked || !draft.trim()) return;
    const qa = q as QA;
    setChecked(true);
    const nextAnswers = { ...answers, [qa.id]: draft };
    setAnswers(nextAnswers);
    saveAttempt(storageKey, { index, answers: nextAnswers, scores, completed, updatedAt: Date.now() });
  }

  function submitQaAssessment() {
    const qa = q as QA;
    if (!checked || !claimAssessment(claimedResults.current, qa.id, scores[qa.id] !== undefined)) return;
    const result = scoreSelfAssessment(selfMarks);
    const nextScores = { ...scores, [qa.id]: result.coverage };
    setScores(nextScores);
    recordResult(qa.id, result.verdict === "correct");
    if (result.verdict === "correct") award(`ans:${storageKey}:${qa.id}`, 2);
    else if (result.verdict === "partial") award(`ans:${storageKey}:${qa.id}`, 1);
    saveAttempt(storageKey, { index, answers, scores: nextScores, completed, updatedAt: Date.now() });
    props.onProgress?.();
  }

  function finish() {
    const fullyAnswered = questions.length > 0 && answeredCount === questions.length;
    setCompleted(fullyAnswered);
    setShowSummary(true);
    if (fullyAnswered) award(`done:${storageKey}`, 10);
    saveAttempt(storageKey, { index, answers, scores, completed: fullyAnswered, updatedAt: Date.now() });
  }

  if (!questions.length) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500">
        These questions are being prepared. Check back soon!
      </div>
    );
  }
  if (!q) return null;

  const navColor: Record<string, string> = {
    unanswered: "bg-slate-100 text-slate-500 hover:bg-slate-200",
    correct: "bg-emerald-500 text-white",
    partial: "bg-amber-400 text-white",
    incorrect: "bg-rose-500 text-white",
  };

  const guideTo = q.guideRef && guideHref ? guideHref(q.guideRef) : undefined;

  return (
    <div className="space-y-4">
      {/* header + progress */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
        <div className="text-sm text-slate-500">
          Answered <span className="font-semibold text-slate-700">{answeredCount}</span> / {questions.length}
        </div>
      </div>

      {/* question navigator */}
      <div className="nav-scroll flex gap-1.5 overflow-x-auto rounded-xl border border-slate-200 bg-white p-2">
        {questions.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            className={`relative h-8 w-8 shrink-0 rounded-lg text-sm font-semibold transition ${navColor[statusOf(i)]} ${
              i === index ? "ring-2 ring-offset-2 ring-indigo-500" : ""
            }`}
            aria-label={`Go to question ${i + 1}`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* the question card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-3 flex items-center justify-between">
          <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">
            Question {index + 1} of {questions.length}
          </span>
          {kind === "qa" && (
            <span className="text-xs font-medium text-slate-400">{(q as QA).marks} marks</span>
          )}
        </div>

        <p className="mb-4 text-lg font-medium text-slate-900">{q.question}</p>

        {kind === "mcq" ? (
          <McqBody
            mcq={q as MCQ}
            selected={selected}
            checked={checked}
            onSelect={setSelected}
          />
        ) : (
          <QaBody
            draft={draft}
            checked={checked}
            onChange={setDraft}
            selfMarks={selfMarks}
            onMarkChange={(i, value) => setSelfMarks((marks) => marks.map((mark, j) => j === i ? value : mark))}
            onSubmit={submitQaAssessment}
            savedCoverage={scores[q.id]}
            qa={q as QA}
          />
        )}

        {/* hint */}
        <div className="mt-4">
          {!showHint ? (
            <button
              onClick={() => setShowHint(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-700 hover:bg-amber-100"
            >
              💡 Show hint
            </button>
          ) : (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              <span className="font-semibold">Hint: </span>
              {q.hint}
            </div>
          )}
        </div>

        {/* check button + feedback */}
        <div className="mt-5 flex flex-wrap items-center gap-3">
          {kind === "mcq" ? (
            <button
              onClick={checkMcq}
              disabled={selected === null || checked}
              className="rounded-xl bg-indigo-600 px-5 py-2.5 font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {checked ? "Answer checked" : "Check answer"}
            </button>
          ) : (
            <button
              onClick={checkQa}
              disabled={checked || draft.trim().length === 0}
              className="rounded-xl bg-indigo-600 px-5 py-2.5 font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {checked ? "Compare below" : "Compare with model answer"}
            </button>
          )}

          {guideTo && (
            <Link
              href={guideTo}
              className="text-sm font-medium text-indigo-600 underline-offset-2 hover:underline"
            >
              📖 Back to the guide
            </Link>
          )}
        </div>

        {/* MCQ explanation */}
        {kind === "mcq" && checked && (
          <div
            className={`mt-4 rounded-xl border p-4 text-sm ${
              selected === (q as MCQ).answerIndex
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-rose-200 bg-rose-50 text-rose-800"
            }`}
          >
            <p className="mb-1 font-bold">
              {selected === (q as MCQ).answerIndex ? "✅ Correct!" : "🔴 Not quite."}{" "}
              {selected !== (q as MCQ).answerIndex && (
                <span className="font-normal">
                  The answer is <strong>{(q as MCQ).options[(q as MCQ).answerIndex]}</strong>.
                </span>
              )}
            </p>
            <p className="font-normal">{(q as MCQ).explanation}</p>
          </div>
        )}

        {/* AI tutor — available once the answer has been checked */}
        {checked && (
          <div className="mt-3">
            <AskAI
              topic={title}
              context={
                kind === "mcq"
                  ? `Question: ${(q as MCQ).question}\nCorrect answer: ${(q as MCQ).options[(q as MCQ).answerIndex]}\nExplanation: ${(q as MCQ).explanation}`
                  : `Question: ${(q as QA).question}\nModel answer: ${(q as QA).modelAnswer}`
              }
              presets={[
                { kind: "why", label: "Explain why" },
                { kind: "example", label: "Give an example" },
              ]}
              buttonLabel="✨ Still confused? Ask the AI tutor"
              placeholder="Ask why, or anything about this question…"
            />
          </div>
        )}
      </div>

      {/* footer nav */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => go(index - 1)}
          disabled={index === 0}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 font-medium text-slate-600 disabled:opacity-40"
        >
          ← Previous
        </button>
        <button
          onClick={finish}
          className="rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2 font-semibold text-emerald-700 hover:bg-emerald-100"
        >
          Finish & see score
        </button>
        <button
          onClick={() => go(index + 1)}
          disabled={index === questions.length - 1}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 font-medium text-slate-600 disabled:opacity-40"
        >
          Next →
        </button>
      </div>

      {showSummary && (
        <SummaryCard
          questions={questions}
          selfAssessed={kind === "qa"}
          statusOf={statusOf}
          onClose={() => setShowSummary(false)}
          onReview={(i) => {
            setShowSummary(false);
            go(i);
          }}
        />
      )}
    </div>
  );
}

function McqBody({
  mcq,
  selected,
  checked,
  onSelect,
}: {
  mcq: MCQ;
  selected: number | null;
  checked: boolean;
  onSelect: (i: number) => void;
}) {
  // Options are shown in a per-question order; `i` stays the authored index.
  return (
    <div className="space-y-2">
      {optionOrder(mcq).map((i, position) => {
        const opt = mcq.options[i];
        const isSel = selected === i;
        const isCorrect = i === mcq.answerIndex;
        let cls = "border-slate-200 bg-white hover:border-indigo-300";
        if (checked) {
          if (isCorrect) cls = "border-emerald-400 bg-emerald-50";
          else if (isSel) cls = "border-rose-400 bg-rose-50";
          else cls = "border-slate-200 bg-white opacity-70";
        } else if (isSel) {
          cls = "border-indigo-500 bg-indigo-50";
        }
        return (
          <button
            key={i}
            onClick={() => !checked && onSelect(i)}
            disabled={checked}
            className={`flex w-full items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition ${cls}`}
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-slate-300 bg-white text-sm font-bold text-slate-600">
              {String.fromCharCode(65 + position)}
            </span>
            <span className="text-slate-800">{opt}</span>
            {checked && isCorrect && <span className="ml-auto">✅</span>}
            {checked && isSel && !isCorrect && <span className="ml-auto">❌</span>}
          </button>
        );
      })}
    </div>
  );
}

function QaBody({
  draft, checked, onChange, selfMarks, onMarkChange, onSubmit, savedCoverage, qa,
}: {
  draft: string;
  checked: boolean;
  onChange: (v: string) => void;
  selfMarks: boolean[];
  onMarkChange: (i: number, value: boolean) => void;
  onSubmit: () => void;
  savedCoverage: number | undefined;
  qa: QA;
}) {
  const submitted = savedCoverage !== undefined;
  return (
    <div className="space-y-4">
      <textarea
        value={draft}
        onChange={(e) => onChange(e.target.value)}
        disabled={checked}
        rows={5}
        aria-label="Your original written answer"
        placeholder="Write your answer here…"
        className="w-full rounded-xl border border-slate-300 bg-slate-50 p-3 text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
      />
      {checked && (
        <div className="space-y-3">
          <p className="text-sm text-slate-600">
            Compare your original answer with the model. Tick only points your answer
            explained correctly, not words it happened to include. If unsure, leave
            the point unticked and ask a grown-up or teacher. This is self-assessment.
          </p>
          <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4">
            <p className="mb-1 text-sm font-bold text-indigo-800">Model answer</p>
            <MarkdownLite text={qa.modelAnswer} className="text-indigo-900/90" />
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="mb-2 text-sm font-bold text-slate-700">Mark scheme</p>
            <ul className="space-y-2 text-sm">
              {qa.markScheme.map((mp, i) => (
                <li key={i}>
                  {submitted ? <span>{mp.point}</span> : (
                    <label className="flex items-start gap-2 cursor-pointer">
                      <input type="checkbox" checked={selfMarks[i] ?? false}
                        onChange={(e) => onMarkChange(i, e.target.checked)} className="mt-1" />
                      <span>{mp.point}</span>
                    </label>
                  )}
                </li>
              ))}
            </ul>
          </div>
          {submitted ? (
            <p className="rounded-xl border border-indigo-200 bg-indigo-50 p-3 text-sm text-indigo-900">
              Saved written-practice score: {Math.round((savedCoverage ?? 0) * qa.markScheme.length)} / {qa.markScheme.length} points.
              This is an unverified practice score. Earlier saved scores may have used the old automatic checker.
            </p>
          ) : (
            <button onClick={onSubmit} className="rounded-xl bg-indigo-600 px-5 py-2.5 font-semibold text-white">
              Save my self-assessment
            </button>
          )}
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            <span className="font-bold">Watch out: </span>{qa.commonError}
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({
  questions,
  selfAssessed,
  statusOf,
  onClose,
  onReview,
}: {
  questions: (MCQ | QA)[];
  selfAssessed: boolean;
  statusOf: (i: number) => "unanswered" | "correct" | "partial" | "incorrect";
  onClose: () => void;
  onReview: (i: number) => void;
}) {
  const correct = questions.filter((_, i) => statusOf(i) === "correct").length;
  const partial = questions.filter((_, i) => statusOf(i) === "partial").length;
  const pct = Math.round(((correct + partial * 0.5) / questions.length) * 100);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-xl animate-pop"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-2 text-5xl">{pct >= 80 ? "🏆" : pct >= 50 ? "👍" : "💪"}</div>
        <h3 className="text-xl font-bold text-slate-900">{selfAssessed ? "Written practice score (unverified)" : "You scored"} {pct}%</h3>
        <p className="mt-1 text-slate-500">
          {correct} correct{partial > 0 ? `, ${partial} partial` : ""} out of {questions.length}
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-1.5">
          {questions.map((_, i) => {
            const s = statusOf(i);
            const c =
              s === "correct" ? "bg-emerald-500" : s === "partial" ? "bg-amber-400" : s === "incorrect" ? "bg-rose-500" : "bg-slate-200";
            return (
              <button
                key={i}
                onClick={() => onReview(i)}
                className={`h-7 w-7 rounded-md text-xs font-bold text-white ${c}`}
                title={`Review question ${i + 1}`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
        <button
          onClick={onClose}
          className="mt-5 rounded-xl bg-indigo-600 px-5 py-2.5 font-semibold text-white hover:bg-indigo-700"
        >
          Keep going
        </button>
      </div>
    </div>
  );
}

