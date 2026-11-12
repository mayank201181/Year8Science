"use client";

import { useEffect, useRef, useState } from "react";
import type { Topic } from "@/lib/types";
import { getExtras } from "@/lib/extras";
import { useStore } from "@/lib/store";

/** Stars for finishing each chapter of an animated lesson, and for finishing it all. */
const CHAPTER_STARS = 1;
const LESSON_STARS = 5;

/** Messages the lesson page (public/lessons/<topic>.html?embed=1 or /masterclass/<topic>.html?embed=1) posts to this window. */
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

type CompanionKind = "claude" | "sitcom" | "masterclass" | "video" | "lab";

/** Topics with a Claude Sitcom episode (public/lessons/sitcom-<topic>.html, built from lessons/sitcom-<topic>). */
const CLAUDE_SITCOMS = new Set<string>(["photosynthesis", "respiration", "breathing", "digestion", "periodic-table", "elements-compounds-mixtures", "acids-metals", "heat", "light", "sound", "magnetism-electricity", "forces", "energy"]);
/** Stars for a Claude Sitcom are kept apart from the animated lesson's (both use ids like "cold" or "energy"). */
const claudeSitcomId = (topicId: string) => `claude-sitcom-${topicId}`;
/** Companions that post y8-lesson messages (height, chapter-done, complete). */
const isPlayer = (kind: CompanionKind | null) => kind === "masterclass" || kind === "sitcom" || kind === "claude";

function TopicCompanions({ topic }: { topic: Topic }) {
  const [active, setActive] = useState<CompanionKind | null>(null);
  const [companionHeight, setCompanionHeight] = useState<number>(840);
  const companionFrame = useRef<HTMLIFrameElement>(null);
  const { award } = useStore();
  const labTopic = LAB_TOPICS[topic.id];

  useEffect(() => {
    if (!isPlayer(active)) return;
    const starId = active === "claude" ? claudeSitcomId(topic.id) : topic.id;
    function onCompanionMessage(e: MessageEvent) {
      if (e.origin !== window.location.origin || !companionFrame.current || e.source !== companionFrame.current.contentWindow) return;
      const m = e.data as LessonMessage;
      if (!m || m.source !== "y8-lesson" || m.topic !== topic.id) return;
      if (m.type === "height" && typeof m.value === "number" && m.value > 320 && m.value < 12000) {
        setCompanionHeight(Math.ceil(m.value));
      } else if (m.type === "chapter-done" && typeof m.chapter === "string") {
        award(lessonChapterKey(starId, m.chapter), CHAPTER_STARS);
      } else if (m.type === "complete") {
        award(`lesson:${starId}`, LESSON_STARS);
      }
    }
    window.addEventListener("message", onCompanionMessage);
    return () => window.removeEventListener("message", onCompanionMessage);
  }, [active, topic.id, award]);

  if (!labTopic) return null;

  const resources: Record<
    CompanionKind,
    { title: string; badge?: string; description: string; action: string; embedHref: string; newTabHref: string }
  > = {
    claude: {
      title: "Claude Sitcom",
      badge: "🎬 By Claude",
      description:
        "A 10-minute mockumentary comedy made by Claude: sarcastic characters, Kavya (12) and the real science of this topic, with every key idea and exam trap. Good with dinner.",
      action: "Watch Claude Sitcom",
      embedHref: `/lessons/sitcom-${encodeURIComponent(topic.id)}.html?embed=1`,
      newTabHref: `/lessons/sitcom-${encodeURIComponent(topic.id)}.html`,
    },
    sitcom: {
      title: "Gemini Sitcom",
      badge: "🍿 By Gemini",
      description:
        "Funny 3-character animated TV episode made by Gemini (Zara, Coach Mito & Guest Stars) with word-synced voices, live lab demos, and Cap-or-Fact roasts!",
      action: "Watch Gemini Sitcom",
      embedHref: `/sitcom/${encodeURIComponent(topic.id)}.html?embed=1`,
      newTabHref: `/sitcom/${encodeURIComponent(topic.id)}.html`,
    },
    masterclass: {
      title: "Studio Masterclass",
      badge: "New · 60fps",
      description:
        "Narrated 60fps cinema animations with live syllabus notes, Think Deeper vaults, and auto-marked exam questions.",
      action: "Play Studio Masterclass",
      embedHref: `/masterclass/${encodeURIComponent(topic.id)}.html?embed=1`,
      newTabHref: `/masterclass/${encodeURIComponent(topic.id)}.html`,
    },
    video: {
      title: "Watch & Think",
      description: "Watch the narrated video, answer questions along the way, and learn from each explanation.",
      action: "Play video + questions",
      embedHref: `https://respiration-watch-and-think.mr201181.chatgpt.site/lesson.html?lesson=${encodeURIComponent(topic.id)}`,
      newTabHref: `https://respiration-watch-and-think.mr201181.chatgpt.site/lesson.html?lesson=${encodeURIComponent(topic.id)}`,
    },
    lab: {
      title: "3D Lab",
      description: "Rotate the model, change the experiment, and test your understanding of this topic.",
      action: "Explore 3D Lab",
      embedHref: `https://year8-science-3d.mr201181.chatgpt.site/#${labTopic}`,
      newTabHref: `https://year8-science-3d.mr201181.chatgpt.site/#${labTopic}`,
    },
  };

  const hasClaude = CLAUDE_SITCOMS.has(topic.id);
  const kinds: CompanionKind[] = hasClaude ? ["claude", "sitcom", "masterclass", "video", "lab"] : ["sitcom", "masterclass", "video", "lab"];

  return (
    <section aria-label={`More ways to learn ${topic.title}`} className="space-y-4">
      <div className={`grid gap-3 sm:grid-cols-2 ${hasClaude ? "lg:grid-cols-3 xl:grid-cols-5" : "lg:grid-cols-4"}`}>
        {kinds.map((kind) => {
          const resource = resources[kind];
          const isMasterclass = isPlayer(kind);
          return (
            <div
              key={kind}
              className={`flex flex-col rounded-2xl border p-5 ${
                isMasterclass
                  ? "border-emerald-300 bg-gradient-to-b from-emerald-50/70 to-white"
                  : "border-indigo-200 bg-white"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-bold text-slate-900">{resource.title}</h2>
                {resource.badge && (
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                    {resource.badge}
                  </span>
                )}
              </div>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{resource.description}</p>
              <button
                type="button"
                onClick={() => setActive(active === kind ? null : kind)}
                aria-expanded={active === kind}
                aria-controls="topic-companion"
                className={`mt-4 min-h-11 rounded-xl px-4 py-2.5 text-sm font-bold text-white focus-visible:outline-2 focus-visible:outline-offset-2 ${
                  isMasterclass
                    ? "bg-emerald-600 hover:bg-emerald-700 focus-visible:outline-emerald-600"
                    : "bg-indigo-600 hover:bg-indigo-700 focus-visible:outline-indigo-600"
                }`}
              >
                {active === kind ? `Hide ${resource.title}` : resource.action}
              </button>
              <a
                href={resource.newTabHref}
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-2 inline-flex min-h-11 items-center justify-center text-sm font-semibold underline underline-offset-4 ${
                  isMasterclass ? "text-emerald-700" : "text-indigo-700"
                }`}
              >
                Open {resource.title} in a new tab ↗
              </a>
              {kind === "sitcom" && (
                <a
                  href="/season1/index.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-center text-xs font-semibold text-slate-500 hover:text-emerald-700"
                >
                  Browse all 14 Gemini Sitcom Episodes ↗
                </a>
              )}
              {kind === "masterclass" && (
                <a
                  href="/masterclass/index.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-center text-xs font-semibold text-slate-500 hover:text-emerald-700"
                >
                  Browse all 14 Studio Masterclasses ↗
                </a>
              )}
            </div>
          );
        })}
      </div>
      {active && (
        <div id="topic-companion" className="overflow-hidden rounded-2xl border border-indigo-200 bg-white">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-indigo-50 p-4">
            <div>
              <h3 className="font-bold text-indigo-900">
                {topic.title} · {resources[active].title}
              </h3>
              <p className="mt-1 text-xs text-slate-600">Use the new-tab link above for full-window cinema mode.</p>
            </div>
            <button
              type="button"
              onClick={() => setActive(null)}
              className="min-h-11 rounded-lg border border-indigo-200 bg-white px-3 py-2 text-sm font-semibold text-indigo-800 hover:bg-indigo-100"
            >
              Close activity
            </button>
          </div>
          <iframe
            ref={isPlayer(active) ? companionFrame : undefined}
            key={`${topic.id}:${active}`}
            src={resources[active].embedHref}
            title={`${topic.title}: ${resources[active].title}`}
            className="block min-h-[620px] w-full border-0"
            style={
              isPlayer(active)
                ? { height: Math.max(760, companionHeight) }
                : { height: "min(80dvh, 960px)" }
            }
            allow="fullscreen; autoplay; screen-wake-lock"
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
