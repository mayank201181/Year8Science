"use client";

import type { Topic } from "@/lib/types";
import { Flashcards } from "./Flashcards";

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl border bg-white p-5 shadow-sm ${className}`}>{children}</div>;
}

function SectionTitle({ emoji, title, subtitle }: { emoji: string; title: string; subtitle?: string }) {
  return (
    <div className="mb-3">
      <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900">
        <span>{emoji}</span> {title}
      </h3>
      {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
    </div>
  );
}

export function LearnSmart({ topic }: { topic: Topic }) {
  return (
    <div className="space-y-8">
      {/* Flashcards */}
      <section>
        <SectionTitle emoji="🃏" title="Flashcards" subtitle="Flip through to lock in the key facts. See them all for ⭐4." />
        <Flashcards cards={topic.flashcards} topicId={topic.id} />
      </section>

      {/* Mnemonics */}
      {topic.mnemonics.length > 0 && (
        <section>
          <SectionTitle emoji="🧩" title="Memory tricks" subtitle="Mnemonics that make facts stick." />
          <div className="grid gap-3 sm:grid-cols-2">
            {topic.mnemonics.map((m, i) => (
              <Card key={i} className="border-amber-200 bg-amber-50/50">
                <p className="text-sm font-semibold text-amber-700">{m.topic}</p>
                <p className="my-1 text-lg font-bold text-slate-900">“{m.device}”</p>
                <p className="text-sm text-slate-600">{m.explanation}</p>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Must know */}
      {topic.mustKnow.length > 0 && (
        <section>
          <SectionTitle emoji="🎯" title="What every student should be able to do" />
          <Card className="border-slate-200">
            <ul className="space-y-2">
              {topic.mustKnow.map((m, i) => (
                <li key={i} className="flex items-start gap-2 text-slate-700">
                  <span className="mt-0.5 text-emerald-500">✔</span>
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </Card>
        </section>
      )}

      {/* Exam mistakes */}
      {topic.examMistakes.length > 0 && (
        <section>
          <SectionTitle emoji="⚠️" title="Common exam mistakes" subtitle="Lose these and you lose easy marks." />
          <div className="grid gap-2 sm:grid-cols-2">
            {topic.examMistakes.map((m, i) => (
              <div key={i} className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">
                <span>❌</span>
                <span>{m}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Misconceptions */}
      {topic.misconceptions.length > 0 && (
        <section>
          <SectionTitle emoji="🔄" title="Myth vs reality" subtitle="Swap the wrong idea for the right one." />
          <div className="space-y-3">
            {topic.misconceptions.map((m, i) => (
              <Card key={i} className="border-slate-200">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl bg-rose-50 p-3 text-sm text-rose-800">
                    <span className="font-bold">Myth: </span>
                    {m.wrong}
                  </div>
                  <div className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">
                    <span className="font-bold">Reality: </span>
                    {m.right}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Real world */}
      {topic.realWorld.length > 0 && (
        <section>
          <SectionTitle emoji="🌍" title="Where it's used in real life" subtitle="Why this is worth learning." />
          <div className="grid gap-3 sm:grid-cols-2">
            {topic.realWorld.map((r, i) => (
              <Card key={i} className="border-sky-200 bg-sky-50/50">
                <p className="font-semibold text-slate-900">
                  {r.emoji ?? "✨"} {r.title}
                </p>
                <p className="mt-1 text-sm text-slate-600">{r.detail}</p>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Expert debates */}
      {topic.expertDebates.length > 0 && (
        <section>
          <SectionTitle emoji="🤔" title="Where even experts disagree" subtitle="The frontier — questions without tidy answers." />
          <div className="space-y-3">
            {topic.expertDebates.map((d, i) => (
              <Card key={i} className="border-violet-200 bg-violet-50/40">
                <p className="font-semibold text-violet-900">{d.question}</p>
                <p className="mt-1 text-sm text-slate-600">{d.detail}</p>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Videos */}
      {topic.videos.length > 0 && (
        <section>
          <SectionTitle emoji="📺" title="Watch & learn" subtitle="Prefer a video? Try these." />
          <div className="grid gap-2 sm:grid-cols-2">
            {topic.videos.map((v, i) => (
              <a
                key={i}
                href={v.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 text-sm hover:border-indigo-300 hover:bg-indigo-50"
              >
                <span className="text-xl">▶️</span>
                <span>
                  <span className="block font-semibold text-slate-800">{v.title}</span>
                  <span className="text-slate-500">{v.channel}</span>
                </span>
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
