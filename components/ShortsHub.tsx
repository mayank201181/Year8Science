"use client";
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore, type TouchEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { SHORTS, type ShortClip } from "@/lib/shorts";

const STORAGE_KEY = "y8shorts:watched:v1";

function subscribeWatched(cb: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = () => cb();
  window.addEventListener("storage", handler);
  window.addEventListener("y8shorts-watched", handler);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener("y8shorts-watched", handler);
  };
}

function getWatchedSnapshot(): string {
  if (typeof window === "undefined") return "{}";
  try {
    return localStorage.getItem(STORAGE_KEY) ?? "{}";
  } catch {
    return "{}";
  }
}

function getServerWatchedSnapshot(): string {
  return "{}";
}

function markShortWatched(id: string) {
  if (typeof window === "undefined") return;
  try {
    const cur = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}") as Record<string, boolean>;
    if (!cur[id]) {
      cur[id] = true;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cur));
      window.dispatchEvent(new Event("y8shorts-watched"));
    }
  } catch {
    // ignore
  }
}

function fmtSec(sec: number): string {
  const s = Math.max(0, Math.floor(sec));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

interface LessonBridge {
  ready?: boolean;
  seek: (t: number) => void;
  play: () => void;
  pause: () => void;
  now: () => number;
  audio?: HTMLAudioElement;
}

export function ShortsHub({
  topicId,
  subjectLabel,
  onPractise,
}: {
  topicId?: string;
  subjectLabel?: string;
  onPractise?: () => void;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const rawWatched = useSyncExternalStore(subscribeWatched, getWatchedSnapshot, getServerWatchedSnapshot);
  const watched = useMemo(() => {
    try {
      return JSON.parse(rawWatched) as Record<string, boolean>;
    } catch {
      return {};
    }
  }, [rawWatched]);

  const basePool = useMemo(
    () => (topicId ? SHORTS.filter((s) => s.topicId === topicId) : SHORTS),
    [topicId]
  );

  const strands = useMemo(() => {
    const seen = new Set<string>();
    const list: string[] = ["All"];
    for (const s of basePool) {
      if (s.strand && !seen.has(s.strand)) {
        seen.add(s.strand);
        list.push(s.strand);
      }
    }
    return list;
  }, [basePool]);

  const [strandFilter, setStrandFilter] = useState<string>("All");
  const [selectedTopicFilter, setSelectedTopicFilter] = useState<string>("All");
  const [autoAdvance, setAutoAdvance] = useState<boolean>(true);
  const [selectedIdOverride, setSelectedIdOverride] = useState<string | null>(null);
  const [partIdx, setPartIdx] = useState<number>(0);
  const [playing, setPlaying] = useState<boolean>(false);
  const [relSec, setRelSec] = useState<number>(0);
  const [activeCaption, setActiveCaption] = useState<string>("");

  const pool = useMemo(() => {
    return basePool.filter((s) => {
      if (!topicId && strandFilter !== "All" && s.strand !== strandFilter) return false;
      if (!topicId && selectedTopicFilter !== "All" && s.topicId !== selectedTopicFilter) return false;
      return true;
    });
  }, [basePool, topicId, strandFilter, selectedTopicFilter]);

  const topicsInStrand = useMemo(() => {
    const map = new Map<string, { id: string; title: string; icon: string }>();
    for (const s of basePool) {
      if (strandFilter !== "All" && s.strand !== strandFilter) continue;
      if (!map.has(s.topicId)) map.set(s.topicId, { id: s.topicId, title: s.topicShort, icon: s.topicIcon });
    }
    return Array.from(map.values());
  }, [basePool, strandFilter]);

  const urlShortId = params.get("s");
  const activeId = selectedIdOverride ?? urlShortId;
  const current: ShortClip | undefined = useMemo(() => {
    if (!pool.length) return basePool[0];
    return pool.find((s) => s.id === activeId) ?? pool.find((s) => !watched[s.id]) ?? pool[0];
  }, [pool, basePool, activeId, watched]);

  const curIdx = current ? pool.findIndex((s) => s.id === current.id) : -1;
  const prevClip = curIdx > 0 ? pool[curIdx - 1] : undefined;
  const nextClip = curIdx >= 0 && curIdx + 1 < pool.length ? pool[curIdx + 1] : undefined;

  const videoRef = useRef<HTMLVideoElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const autoPlayRef = useRef<boolean>(false);
  const targetGlobalTimeRef = useRef<number>(0);
  const touchStartY = useRef<number | null>(null);

  const findPartForGlobal = useCallback((clip: ShortClip, globalSec: number): number => {
    if (!clip.parts?.length) return 0;
    for (let i = clip.parts.length - 1; i >= 0; i--) {
      if (globalSec >= clip.parts[i].start - 0.05) return i;
    }
    return 0;
  }, []);

  const selectClip = useCallback(
    (clip: ShortClip, shouldPlay: boolean) => {
      autoPlayRef.current = shouldPlay;
      targetGlobalTimeRef.current = clip.startSec;
      setSelectedIdOverride(clip.id);
      setPartIdx(findPartForGlobal(clip, clip.startSec));
      setRelSec(0);
      setActiveCaption(clip.captions[0]?.text ?? clip.summary);
      if (!topicId) {
        router.replace(`/shorts?s=${clip.id}`, { scroll: false });
      }
    },
    [router, topicId, findPartForGlobal]
  );

  // Resolve current MP4 part src + local offset for Science multi-part videos
  const activePart = useMemo(() => {
    if (!current) return null;
    if (current.parts?.length) {
      const idx = Math.min(partIdx, current.parts.length - 1);
      return current.parts[idx];
    }
    if (current.src) return { src: current.src, start: 0, duration: 99999 };
    return null;
  }, [current, partIdx]);

  // Seek video on clip or part change
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !current || !activePart) return;
    const desiredGlobal = Math.max(current.startSec, targetGlobalTimeRef.current || current.startSec);
    const localTarget = Math.max(0, desiredGlobal - activePart.start);
    const onLoaded = () => {
      try {
        v.currentTime = localTarget;
      } catch {
        // ignore
      }
      if (autoPlayRef.current) {
        void v.play().catch(() => {});
      }
    };
    if (v.readyState >= 1) {
      onLoaded();
    } else {
      v.addEventListener("loadedmetadata", onLoaded, { once: true });
      return () => v.removeEventListener("loadedmetadata", onLoaded);
    }
  }, [current, activePart]);

  // Poll English embedded HTML5 stage when embedHref is active
  useEffect(() => {
    if (!current?.embedHref) return;
    const iv = window.setInterval(() => {
      const win = iframeRef.current?.contentWindow as (Window & { __lesson?: LessonBridge }) | null;
      const br = win?.__lesson;
      if (!br?.ready) return;
      const t = br.now();
      const isPlaying = br.audio ? !br.audio.paused : false;
      setPlaying(isPlaying);
      if (isPlaying) {
        const elapsed = Math.max(0, t - current.startSec);
        setRelSec(Math.min(current.durationSec, elapsed));
        let cap = "";
        for (const c of current.captions) {
          if (t + 0.15 >= c.t) cap = c.text;
        }
        if (cap) setActiveCaption(cap);
        if (elapsed >= Math.min(10, current.durationSec * 0.6)) markShortWatched(current.id);
        if (t >= current.endSec - 0.12) {
          markShortWatched(current.id);
          br.pause();
          if (autoAdvance && nextClip) {
            selectClip(nextClip, true);
          } else {
            br.seek(current.startSec);
          }
        }
      }
    }, 200);
    return () => window.clearInterval(iv);
  }, [current, autoAdvance, nextClip, selectClip]);

  // Keyboard Up/Down navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (e.key === "ArrowDown" && nextClip) {
        e.preventDefault();
        selectClip(nextClip, true);
      } else if (e.key === "ArrowUp" && prevClip) {
        e.preventDefault();
        selectClip(prevClip, true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [nextClip, prevClip, selectClip]);

  if (!current) {
    return <p className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600">Concept Shorts are loading…</p>;
  }

  const togglePlay = () => {
    if (current.embedHref) {
      const win = iframeRef.current?.contentWindow as (Window & { __lesson?: LessonBridge }) | null;
      const br = win?.__lesson;
      if (!br?.ready) return;
      if (br.audio && !br.audio.paused) {
        br.pause();
        setPlaying(false);
      } else {
        if (br.now() < current.startSec - 0.5 || br.now() >= current.endSec - 0.2) {
          br.seek(current.startSec);
        }
        br.play();
        setPlaying(true);
      }
      return;
    }
    const v = videoRef.current;
    if (!v || !activePart) return;
    if (v.paused) {
      const gNow = activePart.start + v.currentTime;
      if (gNow < current.startSec - 0.5 || gNow >= current.endSec - 0.2) {
        const p0 = findPartForGlobal(current, current.startSec);
        targetGlobalTimeRef.current = current.startSec;
        if (p0 !== partIdx) {
          autoPlayRef.current = true;
          setPartIdx(p0);
          return;
        }
        v.currentTime = Math.max(0, current.startSec - activePart.start);
      }
      autoPlayRef.current = true;
      void v.play().catch(() => {});
    } else {
      autoPlayRef.current = false;
      v.pause();
    }
  };

  const handleTimeUpdate = () => {
    const v = videoRef.current;
    if (!v || !activePart) return;
    const gTime = activePart.start + v.currentTime;
    const elapsed = Math.max(0, gTime - current.startSec);
    setRelSec(Math.min(current.durationSec, elapsed));

    let cap = "";
    for (const c of current.captions) {
      if (gTime + 0.15 >= c.t) cap = c.who ? `${c.who}: ${c.text}` : c.text;
    }
    if (cap) setActiveCaption(cap);

    if (elapsed >= Math.min(10, current.durationSec * 0.6)) {
      markShortWatched(current.id);
    }

    if (gTime >= current.endSec - 0.08) {
      markShortWatched(current.id);
      if (autoAdvance && nextClip) {
        selectClip(nextClip, true);
      } else {
        v.pause();
        const p0 = findPartForGlobal(current, current.startSec);
        targetGlobalTimeRef.current = current.startSec;
        setPartIdx(p0);
        if (p0 === partIdx) v.currentTime = Math.max(0, current.startSec - activePart.start);
      }
      return;
    }

    // Advance seamlessly across Science multi-part MP4 boundary if needed
    if (current.parts && partIdx + 1 < current.parts.length && v.currentTime >= activePart.duration - 0.15) {
      targetGlobalTimeRef.current = current.parts[partIdx + 1].start;
      autoPlayRef.current = true;
      setPartIdx(partIdx + 1);
    }
  };

  const onTouchStart = (e: TouchEvent) => {
    touchStartY.current = e.touches[0]?.clientY ?? null;
  };
  const onTouchEnd = (e: TouchEvent) => {
    if (touchStartY.current === null) return;
    const dy = (e.changedTouches[0]?.clientY ?? touchStartY.current) - touchStartY.current;
    touchStartY.current = null;
    if (dy < -50 && nextClip) selectClip(nextClip, true);
    else if (dy > 50 && prevClip) selectClip(prevClip, true);
  };

  const watchedCount = basePool.filter((s) => watched[s.id]).length;
  const pct = current.durationSec > 0 ? Math.min(100, (relSec / current.durationSec) * 100) : 0;

  return (
    <div className={topicId ? "space-y-5 pb-6" : "mx-auto max-w-6xl space-y-6 px-4 py-6 pb-28"}>
      {!topicId ? (
        <header className="flex flex-wrap items-end justify-between gap-3 rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-sky-50 p-6">
          <div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold text-indigo-700">
                📱 {basePool.length} Concept Shorts · Bite-Sized Vertical Revision
              </span>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                ✓ {watchedCount}/{basePool.length} watched
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-extrabold text-slate-900 sm:text-3xl">
              {subjectLabel ?? "Year 8"} Concept Shorts
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Every individual syllabus concept turned into a punchy vertical Short. Swipe up/down or press ↑/↓ to binge!
            </p>
          </div>
          <label className="flex cursor-pointer items-center gap-2 text-sm font-bold text-slate-700">
            <input
              type="checkbox"
              checked={autoAdvance}
              onChange={(e) => setAutoAdvance(e.target.checked)}
              className="h-4 w-4 accent-indigo-600"
            />
            Auto-next Short
          </label>
        </header>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold text-indigo-700">
              📱 {basePool.length} Concept Shorts in this topic
            </span>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
              ✓ {watchedCount}/{basePool.length} watched
            </span>
          </div>
          <label className="flex cursor-pointer items-center gap-2 text-xs font-bold text-slate-700">
            <input
              type="checkbox"
              checked={autoAdvance}
              onChange={(e) => setAutoAdvance(e.target.checked)}
              className="h-4 w-4 accent-indigo-600"
            />
            Auto-next Short
          </label>
        </div>
      )}

      {!topicId && strands.length > 2 ? (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-1.5">
            {strands.map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => {
                  setStrandFilter(st);
                  setSelectedTopicFilter("All");
                }}
                className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
                  strandFilter === st
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {st === "All" ? `All (${basePool.length})` : st}
              </button>
            ))}
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => setSelectedTopicFilter("All")}
              className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-bold ${
                selectedTopicFilter === "All"
                  ? "bg-indigo-100 text-indigo-700"
                  : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              All topics
            </button>
            {topicsInStrand.map((tp) => (
              <button
                key={tp.id}
                type="button"
                onClick={() => setSelectedTopicFilter(tp.id)}
                className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-bold ${
                  selectedTopicFilter === tp.id
                    ? "bg-indigo-100 text-indigo-700"
                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {tp.icon} {tp.title}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="grid items-start gap-6 lg:grid-cols-[400px_1fr]">
        {/* Vertical 9:16 Phone-Framed Shorts Player */}
        <div className="mx-auto w-full max-w-[390px]">
          <div
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            className="relative flex aspect-[9/16] w-full flex-col justify-between overflow-hidden rounded-3xl border-2 border-slate-800 bg-slate-950 text-white shadow-xl"
          >
            <div className="z-10 bg-gradient-to-b from-slate-900 via-slate-900/95 to-transparent px-4 pt-4 pb-3">
              <div className="flex items-center justify-between gap-2 text-[11px] font-extrabold uppercase tracking-wider text-sky-300">
                <span className="truncate">
                  {current.topicIcon} {current.strand} · {current.topicShort}
                </span>
                <span className="shrink-0 rounded-full bg-white/15 px-2 py-0.5 text-white">
                  {current.index}/{current.totalInTopic}
                </span>
              </div>
              <h2 className="mt-1.5 line-clamp-2 text-lg font-black leading-snug text-white">
                {current.title}
              </h2>
            </div>

            <div className="relative my-auto w-full bg-black">
              {current.embedHref ? (
                <iframe
                  key={current.id}
                  ref={iframeRef}
                  src={current.embedHref}
                  title={current.title}
                  onLoad={() => {
                    if (!autoPlayRef.current) return;
                    window.setTimeout(() => {
                      const win = iframeRef.current?.contentWindow as (Window & { __lesson?: LessonBridge }) | null;
                      if (win?.__lesson?.ready) {
                        win.__lesson.seek(current.startSec);
                        win.__lesson.play();
                      }
                    }, 350);
                  }}
                  className="aspect-video w-full border-0 bg-slate-950"
                />
              ) : activePart ? (
                <>
                  <video
                    key={activePart.src}
                    ref={videoRef}
                    src={activePart.src}
                    poster={current.poster}
                    playsInline
                    preload="metadata"
                    onClick={togglePlay}
                    onPlay={() => setPlaying(true)}
                    onPause={() => setPlaying(false)}
                    onEnded={() => {
                      if (current.parts && partIdx + 1 < current.parts.length) {
                        targetGlobalTimeRef.current = current.parts[partIdx + 1].start;
                        autoPlayRef.current = true;
                        setPartIdx(partIdx + 1);
                      }
                    }}
                    onTimeUpdate={handleTimeUpdate}
                    className="aspect-video w-full cursor-pointer object-contain"
                  />
                  {!playing ? (
                    <button
                      type="button"
                      onClick={togglePlay}
                      aria-label="Play Short"
                      className="absolute inset-0 m-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-2xl text-slate-950 shadow-lg transition hover:scale-105"
                    >
                      ▶
                    </button>
                  ) : null}
                </>
              ) : null}
            </div>

            <div className="z-10 space-y-2.5 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent px-4 pt-2 pb-4">
              <div className="rounded-xl bg-white/10 px-3 py-2 text-xs leading-relaxed text-slate-100 backdrop-blur">
                <div className="mb-0.5 text-[10px] font-extrabold uppercase tracking-wider text-amber-300">
                  {activeCaption ? "Live Caption" : "Key Takeaway"}
                </div>
                <p className="line-clamp-3 font-medium">{activeCaption || current.summary}</p>
              </div>

              <div>
                <div
                  className="h-1.5 w-full cursor-pointer overflow-hidden rounded-full bg-white/20"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const k = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                    const gTarget = current.startSec + k * current.durationSec;
                    if (current.embedHref) {
                      const win = iframeRef.current?.contentWindow as (Window & { __lesson?: LessonBridge }) | null;
                      win?.__lesson?.seek(gTarget);
                      return;
                    }
                    const pTarget = findPartForGlobal(current, gTarget);
                    targetGlobalTimeRef.current = gTarget;
                    if (pTarget !== partIdx) {
                      setPartIdx(pTarget);
                    } else if (videoRef.current && activePart) {
                      videoRef.current.currentTime = Math.max(0, gTarget - activePart.start);
                    }
                  }}
                >
                  <div className="h-full rounded-full bg-sky-400 transition-all" style={{ width: `${pct}%` }} />
                </div>
                <div className="mt-1 flex justify-between text-[11px] font-bold tabular-nums text-slate-300">
                  <span>{fmtSec(relSec)}</span>
                  <span>{fmtSec(current.durationSec)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-1.5">
                <button
                  type="button"
                  disabled={!prevClip}
                  onClick={() => prevClip && selectClip(prevClip, true)}
                  className="rounded-xl bg-white/15 px-3 py-2 text-xs font-extrabold text-white enabled:hover:bg-white/25 disabled:opacity-35"
                >
                  ↑ Prev
                </button>
                <button
                  type="button"
                  onClick={togglePlay}
                  className="rounded-xl bg-sky-500 px-4 py-2 text-xs font-extrabold text-slate-950 hover:bg-sky-400"
                >
                  {playing ? "⏸ Pause" : "▶ Play"}
                </button>
                <button
                  type="button"
                  disabled={!nextClip}
                  onClick={() => nextClip && selectClip(nextClip, true)}
                  className="rounded-xl bg-white/15 px-3 py-2 text-xs font-extrabold text-white enabled:hover:bg-white/25 disabled:opacity-35"
                >
                  ↓ Next
                </button>
                {onPractise ? (
                  <button
                    type="button"
                    onClick={onPractise}
                    className="rounded-xl bg-emerald-500 px-3 py-2 text-xs font-extrabold text-slate-950 hover:bg-emerald-400"
                  >
                    ⚡ Quiz
                  </button>
                ) : (
                  <Link
                    href={`/topic/${current.topicId}?tab=quiz`}
                    className="rounded-xl bg-emerald-500 px-3 py-2 text-xs font-extrabold text-slate-950 hover:bg-emerald-400"
                  >
                    ⚡ Quiz
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900">
              {topicId ? "All Concept Shorts in This Topic" : `Shorts Reel (${pool.length})`}
            </h3>
            <span className="text-xs text-slate-500">Tap any concept to jump straight in</span>
          </div>
          <div className="grid max-h-[76vh] gap-2.5 overflow-y-auto pr-1 sm:grid-cols-2">
            {pool.map((sh) => {
              const isCur = sh.id === current.id;
              const isDone = !!watched[sh.id];
              return (
                <button
                  key={sh.id}
                  type="button"
                  onClick={() => selectClip(sh, true)}
                  className={`flex flex-col justify-between rounded-2xl border bg-white p-3.5 text-left shadow-sm transition hover:border-indigo-400 ${
                    isCur ? "border-2 border-indigo-600 ring-2 ring-indigo-100" : "border-slate-200"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 text-xs font-bold text-indigo-600">
                      <span className="truncate">
                        {sh.topicIcon} {sh.topicShort} · #{sh.index}/{sh.totalInTopic}
                      </span>
                      <span className="shrink-0 rounded bg-slate-100 px-1.5 py-0.5 tabular-nums text-slate-600">
                        {fmtSec(sh.durationSec)}
                      </span>
                    </div>
                    <div className="mt-1 font-extrabold leading-snug text-slate-900">{sh.title}</div>
                    <p className="mt-1 line-clamp-2 text-xs text-slate-500">{sh.summary}</p>
                  </div>
                  <div className="mt-2.5 flex items-center justify-between text-[11px] font-bold">
                    <span className={isCur ? "text-indigo-600" : "text-slate-400"}>
                      {isCur ? "▶ Playing now" : "Tap to watch"}
                    </span>
                    {isDone ? <span className="text-emerald-600">Watched ✓</span> : null}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
