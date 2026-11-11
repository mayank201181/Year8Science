"use client";

import { useEffect, useRef, useState } from "react";
import type { Topic } from "@/lib/types";
import { getExtras } from "@/lib/extras";
import { useStore } from "@/lib/store";

/** Stars for finishing each chapter of an animated lesson, and for finishing it all. */
const CHAPTER_STARS = 1;
const LESSON_STARS = 5;

/** Messages the lesson page (public/lessons/<topic>.html?embed=1) posts to this window. */
type LessonMessage =
  | { source: "y8-lesson"; topic: string; type: "hello"; chapters: unknown }
  | { source: "y8-lesson"; topic: string; type: "height"; value: unknown }
  | { source: "y8-lesson"; topic: string; type: "chapter-done"; chapter: unknown }
  | { source: "y8-lesson"; topic: string; type: "complete" }
  | { source: "y8-lesson"; topic: string; type: "theater"; on: unknown };

export const lessonChapterKey = (topicId: string, chapterId: string) => `lesson:${topicId}:${chapterId}`;

// The companion lab uses shorter names for some topics than this dashboard.
const LAB_TOPICS: Record<string, string> = {
  photosynthesis: "photosynthesis",
  respiration: "respiration",
  breathing: "breathing",
  digestion: "digestion",
  "elements-compounds-mixtures": "materials",
  "periodic-table": "periodic",
  "chemical-reactions": "reactions",
  "acids-metals": "acids",
  forces: "forces",
  energy: "energy",
  heat: "heat",
  light: "light",
  sound: "sound",
  "magnetism-electricity": "magnetism",
};

function TopicCompanions({ topic }: { topic: Topic }) {
  const [active, setActive] = useState<"video" | "lab" | null>(null);
  const labTopic = LAB_TOPICS[topic.id];
  if (!labTopic) return null;

  const resources = {
    video: {
      title: "Watch & Think",
      description: "Watch the narrated video, answer questions along the way, and learn from each explanation.",
      action: "Play video + questions",
      href: `https://respiration-watch-and-think.mr201181.chatgpt.site/lesson.html?lesson=${encodeURIComponent(topic.id)}`,
    },
    lab: {
      title: "3D Lab",
      description: "Rotate the model, change the experiment, and test your understanding of this topic.",
      action: "Explore 3D Lab",
      href: `https://year8-science-3d.mr201181.chatgpt.site/#${labTopic}`,
    },
  };

  return (
    <section aria-label={`More ways to learn ${topic.title}`} className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        {(["video", "lab"] as const).map((kind) => {
          const resource = resources[kind];
          return (
            <div key={kind} className="flex flex-col rounded-2xl border border-indigo-200 bg-white p-5">
              <h2 className="font-bold text-slate-900">{resource.title}</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{resource.description}</p>
              <button
                type="button"
                onClick={() => setActive(kind)}
                aria-expanded={active === kind}
                aria-controls="topic-companion"
                className="mt-4 min-h-11 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {resource.action}
              </button>
              <a href={resource.href} target="_blank" rel="noopener noreferrer"
                className="mt-2 inline-flex min-h-11 items-center justify-center text-sm font-semibold text-indigo-700 underline underline-offset-4">
                Open {resource.title} in a new tab ↗
              </a>
            </div>
          );
        })}
      </div>
      {active && (
        <div id="topic-companion" className="overflow-hidden rounded-2xl border border-indigo-200 bg-white">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-indigo-50 p-4">
            <div>
              <h3 className="font-bold text-indigo-900">{topic.title} · {resources[active].title}</h3>
              <p className="mt-1 text-xs text-slate-600">Use the new-tab link above for more room.</p>
            </div>
            <button type="button" onClick={() => setActive(null)}
              className="min-h-11 rounded-lg border border-indigo-200 bg-white px-3 py-2 text-sm font-semibold text-indigo-800 hover:bg-indigo-100">
              Close activity
            </button>
          </div>
          <iframe
            key={`${topic.id}:${active}`}
            src={resources[active].href}
            title={`${topic.title}: ${resources[active].title}`}
            className="block min-h-[540px] w-full border-0"
            style={{ height: "min(80dvh, 960px)" }}
            allow="fullscreen; autoplay"
            allowFullScreen
          />
        </div>
      )}
    </section>
  );
}

export function LessonTab({ topic }: { topic: Topic }) {
  const lesson = getExtras(topic.id).lesson;
  const { award, hasAward } = useStore();
  const frame = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(900);
  const [theater, setTheater] = useState(false);
  const [chapters, setChapters] = useState<string[]>([]);
  const [, setTick] = useState(0);

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (e.origin !== window.location.origin || !frame.current || e.source !== frame.current.contentWindow) return;
      const m = e.data as LessonMessage;
      if (!m || m.source !== "y8-lesson" || m.topic !== topic.id) return;
      if (m.type === "hello") {
        const ids = Array.isArray(m.chapters) ? m.chapters.filter((x): x is string => typeof x === "string") : [];
        setChapters(ids);
        // Tick the chapters this learner has already finished, on any device.
        const watched = ids.filter((id) => hasAward(lessonChapterKey(topic.id, id)));
        frame.current.contentWindow?.postMessage({ source: "y8-app", type: "watched", ids: watched }, window.location.origin);
      } else if (m.type === "height") {
        if (typeof m.value === "number" && m.value > 200 && m.value < 20000) setHeight(Math.ceil(m.value));
      } else if (m.type === "chapter-done") {
        if (typeof m.chapter === "string") {
          award(lessonChapterKey(topic.id, m.chapter), CHAPTER_STARS);
          setTick((n) => n + 1);
        }
      } else if (m.type === "complete") {
        award(`lesson:${topic.id}`, LESSON_STARS);
        setTick((n) => n + 1);
      } else if (m.type === "theater") {
        setTheater(m.on === true);
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [topic.id, award, hasAward]);

  // Professor Photon sits bottom-right, over the player's controls; step him aside while a lesson is open.
  useEffect(() => {
    document.body.classList.add("lesson-watching");
    return () => document.body.classList.remove("lesson-watching");
  }, []);

  // While the lesson fills the screen (phones without element full screen), stop the page behind it scrolling.
  useEffect(() => {
    if (!theater) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [theater]);

  if (!lesson) {
    return (
      <p className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-slate-500">
        The animated lesson for this topic is coming soon. In the meantime, read the Guide and try the Quiz!
      </p>
    );
  }

  const watched = chapters.filter((id) => hasAward(lessonChapterKey(topic.id, id))).length;
  return (
    <div className="space-y-4">
      <TopicCompanions key={topic.id} topic={topic} />
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border-l-4 border-emerald-400 bg-emerald-50 p-4">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">🎬 Watch and listen</p>
          <p className="mt-1 font-medium text-emerald-900">
            The whole topic as a narrated animation: {lesson.minutes} minutes in {lesson.chapters} short chapters. Earn a
            star for every chapter you finish.
          </p>
        </div>
        {chapters.length > 0 && (
          <span className="shrink-0 rounded-full bg-white px-3 py-1 text-sm font-bold text-emerald-800 ring-1 ring-emerald-200">
            {watched === chapters.length ? "✓ All chapters watched" : `${watched} of ${chapters.length} chapters watched`}
          </span>
        )}
      </div>
      <div className={theater ? "fixed inset-0 z-[100] bg-[#05101A]" : undefined}>
        <iframe
          ref={frame}
          src={`${lesson.href}?embed=1`}
          title={`${topic.title}: animated lesson`}
          className="block w-full border-0"
          style={theater ? { height: "100%" } : { height }}
          allow="fullscreen; autoplay; screen-wake-lock"
          allowFullScreen
        />
      </div>
    </div>
  );
}
