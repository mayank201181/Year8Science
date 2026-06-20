"use client";

import { useEffect } from "react";
import type { Topic } from "@/lib/types";
import { useStore } from "@/lib/store";
import { getExtras } from "@/lib/extras";
import { EXPLORABLES } from "./Explorables";
import { ListenButton } from "./ListenButton";
import { MarkdownLite } from "./MarkdownLite";

export function GuideView({ topic }: { topic: Topic }) {
  const { guidesRead, markGuideRead, award } = useStore();
  const read = !!guidesRead[topic.id];
  const extras = getExtras(topic.id);
  const Widget = extras.interactive ? EXPLORABLES[extras.interactive] : undefined;

  const fullText = () =>
    `${topic.title}. ${topic.intro} ` +
    topic.guide.map((s) => `${s.heading}. ${s.body.replace(/[*`#-]/g, " ")}`).join(" ");

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
      {extras.hook && (
        <div className="rounded-2xl border-l-4 border-amber-400 bg-amber-50 p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-amber-600">🤔 Mystery to solve</p>
          <p className="mt-1 font-medium text-amber-900">{extras.hook}</p>
        </div>
      )}

      <div className="flex items-center justify-between gap-3">
        <p className="flex-1 rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4 text-slate-700">{topic.intro}</p>
      </div>
      <div className="-mt-2"><ListenButton getText={fullText} label="Read this guide aloud" /></div>

      {Widget && <Widget />}

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

      {extras.bonusDiagrams && extras.bonusDiagrams.length > 0 && (
        <div className="space-y-4">
          {extras.bonusDiagrams.map((d, i) => (
            <figure key={i} className="rounded-2xl border border-slate-200 bg-white p-5">
              <figcaption className="mb-2 font-bold text-slate-900">{d.title}</figcaption>
              <div className="diagram rounded-xl border border-slate-100 bg-slate-50 p-4" dangerouslySetInnerHTML={{ __html: d.svg }} />
              {d.caption && <p className="mt-2 text-center text-sm italic text-slate-500">{d.caption}</p>}
            </figure>
          ))}
        </div>
      )}

      {extras.didYouKnow && extras.didYouKnow.length > 0 && (
        <section>
          <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-slate-900">💡 Did you know?</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {extras.didYouKnow.map((f, i) => (
              <div key={i} className="rounded-2xl border border-sky-200 bg-sky-50/60 p-4 text-sm text-sky-900">{f}</div>
            ))}
          </div>
        </section>
      )}

      {extras.experiments && extras.experiments.length > 0 && (
        <section>
          <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-slate-900">🧫 Try this at home</h3>
          <div className="space-y-4">
            {extras.experiments.map((ex, i) => (
              <div key={i} className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5">
                <p className="text-lg font-bold text-slate-900">{ex.emoji} {ex.title}</p>
                <div className="mt-3 grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">You need</p>
                    <ul className="mt-1 space-y-1 text-sm text-slate-700">
                      {ex.materials.map((m, j) => (<li key={j} className="flex gap-2"><span>•</span>{m}</li>))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">Steps</p>
                    <ol className="mt-1 space-y-1 text-sm text-slate-700">
                      {ex.steps.map((s, j) => (<li key={j} className="flex gap-2"><span className="font-semibold text-emerald-600">{j + 1}.</span>{s}</li>))}
                    </ol>
                  </div>
                </div>
                <p className="mt-3 rounded-lg bg-white/70 p-3 text-sm text-slate-700"><span className="font-bold text-emerald-700">The science: </span>{ex.science}</p>
                {ex.safety && <p className="mt-2 text-sm text-rose-600">⚠️ {ex.safety}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

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
