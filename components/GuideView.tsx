"use client";

import { useEffect } from "react";
import type { Topic } from "@/lib/types";
import { useStore } from "@/lib/store";
import { MarkdownLite } from "./MarkdownLite";

export function GuideView({ topic }: { topic: Topic }) {
  const { guidesRead, markGuideRead, award } = useStore();
  const read = !!guidesRead[topic.id];

  // Scroll to a section if the URL has a matching hash (deep-link from a question).
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      const el = document.getElementById(`guide-${hash}`);
      if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
    }
  }, []);

  function markRead() {
    markGuideRead(topic.id);
    award(`guide:${topic.id}`, 5);
  }

  return (
    <div className="space-y-6">
      <p className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4 text-slate-700">{topic.intro}</p>

      {topic.guide.map((s) => (
        <section
          key={s.id}
          id={`guide-${s.id}`}
          className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
        >
          <h3 className="mb-3 text-xl font-bold text-slate-900">{s.heading}</h3>
          <MarkdownLite text={s.body} />

          {s.diagram && (
            <figure className="my-5">
              <div
                className="diagram rounded-xl border border-slate-100 bg-slate-50 p-4"
                // Inline SVG authored in-repo (trusted content, no user input).
                dangerouslySetInnerHTML={{ __html: s.diagram }}
              />
              {s.diagramCaption && (
                <figcaption className="mt-2 text-center text-sm italic text-slate-500">
                  {s.diagramCaption}
                </figcaption>
              )}
            </figure>
          )}

          {s.keyPoints && s.keyPoints.length > 0 && (
            <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <p className="mb-2 text-sm font-bold text-emerald-800">🔑 Key points</p>
              <ul className="space-y-1.5">
                {s.keyPoints.map((k, i) => (
                  <li key={i} className="flex gap-2 text-sm text-emerald-900">
                    <span>•</span>
                    <span>{k}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {s.thinkDeeper && (
            <div className="mt-4 rounded-xl border-l-4 border-violet-400 bg-violet-50 p-4">
              <p className="text-sm font-bold text-violet-800">🧠 Think deeper</p>
              <p className="mt-1 text-sm text-violet-900">{s.thinkDeeper}</p>
            </div>
          )}
        </section>
      ))}

      <div className="flex items-center justify-center pt-2">
        {read ? (
          <span className="inline-flex items-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50 px-5 py-2.5 font-semibold text-emerald-700">
            ✅ Guide completed
          </span>
        ) : (
          <button
            onClick={markRead}
            className="rounded-xl bg-emerald-600 px-6 py-2.5 font-semibold text-white shadow-sm hover:bg-emerald-700"
          >
            ✔ I&apos;ve read this — give me ⭐5
          </button>
        )}
      </div>
    </div>
  );
}
