"use client";

import { useState } from "react";
import { ALL_TOPICS } from "@/lib/topics";
import { SCIENCE_DIAGNOSTIC_BUILD } from "@/lib/clientDiagnostic";
import type { RecoveryHint } from "@/lib/progressRenderHint";
import { MarkdownLite } from "./MarkdownLite";

type RecoveryLearningProps = {
  hints: readonly RecoveryHint[];
  onRetry: () => void;
  onSwitch: () => void;
};

/** Authored guides only. This component never reads or writes learner progress. */
export function RecoveryLearning({ hints, onRetry, onSwitch }: RecoveryLearningProps) {
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const topic = ALL_TOPICS.find((candidate) => candidate.id === selectedTopicId);
  // Keep the diagnostic display fixed even if an untyped caller supplies other data.
  const knownHints: readonly RecoveryHint[] = ["ReviewMap", "ReviewEntry", "GuideMap"];
  const safeHints = knownHints.filter((hint) => hints.includes(hint)).join(", ") || "Unknown";

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-900 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-4xl space-y-6">
        <section aria-labelledby="recovery-heading" className="rounded-2xl border border-amber-200 bg-amber-50 p-5 sm:p-6">
          <p className="text-xs font-bold uppercase tracking-wide text-amber-800">Year 8 Science · Read-only recovery</p>
          <h1 id="recovery-heading" className="mt-2 text-2xl font-bold">You can still read the science guides</h1>
          <p className="mt-3 leading-relaxed text-slate-700">
            Saved progress cannot be safely opened right now. You can read the original learning guides below while progress loading is unavailable.
          </p>
          <p className="mt-2 leading-relaxed text-slate-700">
            Progress saving is paused. Quizzes, guide completion and AI help are disabled in this mode. Reading a guide here will not record progress or mark it complete.
          </p>
          <p className="mt-3 break-words text-sm text-slate-600">
            Shape hints: <span className="font-mono font-semibold">{safeHints}</span>
            <span aria-hidden="true"> · </span>
            Build: <span className="font-mono font-semibold">{SCIENCE_DIAGNOSTIC_BUILD}</span>
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <button type="button" onClick={onRetry} className="rounded-xl bg-indigo-700 px-4 py-3 font-semibold text-white hover:bg-indigo-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700">
              Retry loading progress
            </button>
            <button type="button" onClick={onSwitch} className="rounded-xl border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-800 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700">
              Switch learner
            </button>
          </div>
        </section>

        {topic ? (
          <article aria-labelledby="recovery-topic-heading" className="space-y-5">
            <button type="button" onClick={() => setSelectedTopicId(null)} className="rounded-xl border border-slate-300 bg-white px-4 py-3 font-semibold text-indigo-800 hover:bg-indigo-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700">
              Back to guides
            </button>
            <header>
              <p className="text-sm font-semibold text-indigo-700">{topic.subject} · Read-only guide</p>
              <h2 id="recovery-topic-heading" className="mt-1 text-2xl font-bold sm:text-3xl">
                <span aria-hidden="true">{topic.icon} </span>{topic.title}
              </h2>
            </header>
            <p className="rounded-2xl border border-indigo-100 bg-indigo-50 p-5 leading-relaxed text-slate-700">{topic.intro}</p>

            {topic.guide.map((section) => (
              <section key={section.id} className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <h3 className="mb-3 text-xl font-bold">{section.heading}</h3>
                <MarkdownLite text={section.body} />
                {section.diagram && (
                  <figure className="my-5">
                    <div
                      className="diagram overflow-x-auto rounded-xl border border-slate-100 bg-slate-50 p-3 sm:p-4 [&_svg]:h-auto [&_svg]:max-w-full"
                      // Only self-contained inline SVG from the authored curriculum.
                      dangerouslySetInnerHTML={{ __html: section.diagram }}
                    />
                    {section.diagramCaption && (
                      <figcaption className="mt-2 text-center text-sm italic text-slate-600">{section.diagramCaption}</figcaption>
                    )}
                  </figure>
                )}
                {section.keyPoints && section.keyPoints.length > 0 && (
                  <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                    <h4 className="mb-2 text-sm font-bold text-emerald-900">Key points</h4>
                    <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-emerald-950">
                      {section.keyPoints.map((point, index) => <li key={index}>{point}</li>)}
                    </ul>
                  </div>
                )}
                {section.thinkDeeper && (
                  <div className="mt-4 rounded-xl border-l-4 border-violet-400 bg-violet-50 p-4">
                    <h4 className="text-sm font-bold text-violet-900">Think deeper</h4>
                    <p className="mt-1 text-sm leading-relaxed text-violet-950">{section.thinkDeeper}</p>
                  </div>
                )}
              </section>
            ))}
            <button type="button" onClick={() => setSelectedTopicId(null)} className="rounded-xl border border-slate-300 bg-white px-4 py-3 font-semibold text-indigo-800 hover:bg-indigo-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700">
              Back to guides
            </button>
          </article>
        ) : (
          <section aria-labelledby="recovery-guides-heading">
            <h2 id="recovery-guides-heading" className="text-xl font-bold">Choose a science guide</h2>
            <p className="mt-2 text-sm text-slate-600">These are the original topic guides. No saved learner information is shown.</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {ALL_TOPICS.map((candidate) => (
                <button key={candidate.id} type="button" onClick={() => setSelectedTopicId(candidate.id)} className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm hover:border-indigo-300 hover:bg-indigo-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700">
                  <span className="block text-xs font-bold uppercase tracking-wide text-indigo-700">{candidate.subject}</span>
                  <span className="mt-2 block text-lg font-bold"><span aria-hidden="true">{candidate.icon} </span>{candidate.title}</span>
                  <span className="mt-2 block text-sm leading-relaxed text-slate-600">{candidate.summary}</span>
                  <span className="mt-3 block text-sm font-semibold text-indigo-800">Read guide →</span>
                </button>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
