"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ASTRA_VIDEOS, formatVideoTime } from "@/lib/astraVideos";

export function AstraVideoPlayer({ topicId, title }: { topicId: string; title: string }) {
  const video = ASTRA_VIDEOS[topicId];
  const player = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);
  const [partIndex, setPartIndex] = useState(0);
  const pendingSeek = useRef(0);
  const resume = useRef(false);
  const part = video?.parts[partIndex];
  function goToPart(index: number, time = 0, play = false) {
    pendingSeek.current = time;
    resume.current = play;
    if (index === partIndex && player.current) {
      player.current.currentTime = time;
      if (play) void player.current.play().catch(() => {});
    } else setPartIndex(index);
  }
  if (!video || !part) return (
    <section className="rounded-2xl border border-sky-200 bg-sky-50 p-5">
      <h2 className="font-bold text-sky-950">Real-life Videos Astra</h2>
      <p className="mt-2 text-sm text-slate-600">This topic&apos;s teacher–student video is planned, but is not available yet. The existing lessons below are ready to watch.</p>
      <Link href="/reallife-videos-astra" className="mt-3 inline-block font-semibold text-sky-800 underline">Browse the video collection →</Link>
    </section>
  );
  return (
    <section className="overflow-hidden rounded-2xl border border-sky-200 bg-white" aria-label={`${title}: Real-life Videos Astra`}>
      <div className="p-5">
        <p className="text-xs font-bold uppercase tracking-wide text-sky-700">Real-life Videos Astra · {formatVideoTime(video.durationSeconds)}</p>
        <h2 className="mt-1 text-xl font-bold text-slate-900">{title}: the classroom conversation</h2>
        <p className="mt-2 text-sm text-slate-600">AI-generated teacher and student, whiteboard diagrams, props and questions. Pause to answer before the student does.</p>
      </div>
      <video ref={player} key={`${topicId}:${partIndex}`} controls playsInline preload="metadata" poster={video.poster} onError={() => setFailed(true)}
        onLoadedMetadata={() => { setFailed(false); if (player.current) { player.current.currentTime = pendingSeek.current; if (resume.current) void player.current.play().catch(() => {}); } }}
        onEnded={() => { if (partIndex + 1 < video.parts.length) goToPart(partIndex + 1, 0, true); }} className="aspect-video w-full bg-slate-950" aria-label={`${title} full lesson`}>
        <source src={part.src} type="video/mp4" />
        <track src={part.captions} kind="captions" srcLang="en" label="English" />
        Your browser cannot play this video. Use the download link below.
      </video>
      <div className="space-y-4 p-5">
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <p className="mr-auto text-slate-600">Part {partIndex + 1} of {video.parts.length} · continues automatically. Use Next if your browser pauses.</p>
          <button type="button" disabled={partIndex === 0} onClick={() => goToPart(partIndex - 1)} className="min-h-11 rounded-lg border px-3 disabled:opacity-40">Previous</button>
          <button type="button" disabled={partIndex === video.parts.length - 1} onClick={() => goToPart(partIndex + 1, 0, true)} className="min-h-11 rounded-lg border px-3 disabled:opacity-40">Next</button>
        </div>
        {failed && <p role="alert" className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900">The video could not load. Check your connection or use the direct video link below.</p>}
        <details>
          <summary className="cursor-pointer font-semibold text-slate-800">Jump to a chapter</summary>
          <ol className="mt-3 grid gap-2 sm:grid-cols-2">
            {video.chapters.map((chapter) => <li key={chapter.start}>
              <button type="button" onClick={() => { const index = video.parts.findLastIndex((p) => p.start <= chapter.start); goToPart(Math.max(0, index), chapter.start - video.parts[Math.max(0, index)].start, !!player.current && !player.current.paused); }} className="min-h-11 w-full rounded-lg bg-slate-50 px-3 py-2 text-left text-sm text-slate-700 hover:bg-sky-50 focus-visible:outline-2 focus-visible:outline-sky-600">
                <span className="mr-2 font-mono text-xs text-sky-700">{formatVideoTime(chapter.start)}</span>{chapter.title}
              </button>
            </li>)}
          </ol>
        </details>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-sky-800">
          {video.parts.map((p, i) => <a key={p.src} href={p.src} download className="underline">Download part {i + 1}</a>)}
          <Link href="/reallife-videos-astra" className="underline">All Real-life Videos Astra →</Link>
        </div>
      </div>
    </section>
  );
}
