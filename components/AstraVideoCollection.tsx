"use client";

import { useState } from "react";
import Link from "next/link";
import { TOPIC_META } from "@/lib/topics/_meta";
import { ASTRA_VIDEOS, formatVideoTime } from "@/lib/astraVideos";
import { AstraVideoPlayer } from "./AstraVideoPlayer";

export function AstraVideoCollection() {
  const ready = TOPIC_META.filter((topic) => ASTRA_VIDEOS[topic.id]);
  const [selected, setSelected] = useState(ready[0]?.id ?? "");
  const selectedTopic = TOPIC_META.find((topic) => topic.id === selected);
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
      <header>
        <Link href="/" className="text-sm font-semibold text-sky-800">← All topics</Link>
        <p className="mt-5 text-sm font-bold uppercase tracking-widest text-sky-700">The classroom collection</p>
        <h1 className="mt-2 text-3xl font-extrabold text-slate-900">Real-life Videos Astra</h1>
        <p className="mt-3 max-w-2xl text-slate-600">Science conversations with a teacher and student, visual demonstrations and memorable questions. Choose a completed lesson below. New lessons will appear here as they are finished and checked.</p>
        <p className="mt-3 font-semibold text-sky-900">{ready.length} of {TOPIC_META.length} lessons available · AI-generated presenters</p>
      </header>
      {selectedTopic && <AstraVideoPlayer key={selectedTopic.id} topicId={selectedTopic.id} title={selectedTopic.title} />}
      <section aria-label="All 14 science topics" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TOPIC_META.map((topic) => {
          const video = ASTRA_VIDEOS[topic.id];
          return <article key={topic.id} className={`flex flex-col rounded-2xl border p-5 ${video ? "border-sky-300 bg-white" : "border-slate-200 bg-slate-50"}`}>
            <p className="text-xs font-bold uppercase text-slate-500">{topic.subject}</p>
            <h2 className="mt-2 text-lg font-bold text-slate-900"><span aria-hidden>{topic.icon} </span>{topic.title}</h2>
            <p className="mt-2 flex-1 text-sm text-slate-600">{topic.summary}</p>
            <p className={`mt-4 text-sm font-semibold ${video ? "text-emerald-700" : "text-slate-500"}`}>{video ? `Ready · ${formatVideoTime(video.durationSeconds)}` : "Planned · not yet available"}</p>
            {video && <button type="button" onClick={() => { setSelected(topic.id); window.scrollTo({ top: 0, behavior: "smooth" }); }} aria-pressed={selected === topic.id} className="mt-3 min-h-11 rounded-xl bg-sky-700 px-4 py-2 font-semibold text-white hover:bg-sky-800">{selected === topic.id ? "Selected above" : "Watch this lesson"}</button>}
            <Link href={`/topic/${topic.id}?tab=watch`} className="mt-3 text-sm font-semibold text-sky-800 underline">{video ? "Open topic’s Watch tab" : "Explore existing topic lessons"} →</Link>
          </article>;
        })}
      </section>
    </div>
  );
}
