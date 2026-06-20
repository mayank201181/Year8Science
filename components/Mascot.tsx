"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useStore } from "@/lib/store";

// "Professor Photon" — a small, dismissible guide that offers contextual nudges.
export function Mascot() {
  const { stars, streak, srs, guidesRead, goalMinutes, analytics } = useStore();
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
    // Show on first mount unless dismissed earlier this session.
    const dismissed = sessionStorage.getItem("mascotDismissed");
    setOpen(!dismissed);
  }, []);

  const today = new Date().toISOString().slice(0, 10);
  const missedCount = Object.values(srs).filter((s) => s.due <= today).length;
  const guidesCount = Object.keys(guidesRead).length;
  const minsToday = Math.floor((analytics.days[today]?.timeMs ?? 0) / 60000);
  const goalMet = minsToday >= goalMinutes;

  const msg = useMemo<{ text: string; cta?: { href: string; label: string } }>(() => {
    if (stars === 0 && guidesCount === 0)
      return { text: "Hi, I'm Professor Photon! 🧑‍🔬 Pick any topic and start your guide — I'll cheer you on.", cta: { href: "/topic/photosynthesis", label: "Start here" } };
    if (missedCount >= 3)
      return { text: `You've got ${missedCount} questions due for review. A quick session now will lock them into memory! 🔁`, cta: { href: "/review", label: "Review now" } };
    if (!goalMet && minsToday > 0)
      return { text: `You're ${goalMinutes - minsToday} min from today's goal — so close! Keep going. 🎯` };
    if (streak.count >= 2 && minsToday === 0)
      return { text: `🔥 ${streak.count}-day streak! Do something today to keep the flame alive.`, cta: { href: "/review", label: "Quick review" } };
    if (goalMet)
      return { text: `🎉 Daily goal smashed — ${minsToday} minutes today! You're on fire.` };
    if (guidesCount >= 1 && guidesCount < 12)
      return { text: `Nice work — ${guidesCount} guide${guidesCount > 1 ? "s" : ""} down! Try a timed Challenge to earn bonus stars. ⭐`, cta: { href: "/", label: "Pick a topic" } };
    return { text: "Looking great! Keep exploring — every star counts. 🌟" };
  }, [stars, streak.count, missedCount, guidesCount, goalMet, minsToday, goalMinutes]);

  function dismiss() {
    setOpen(false);
    sessionStorage.setItem("mascotDismissed", "1");
  }

  if (!hydrated) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 print:hidden">
      {open ? (
        <div className="flex max-w-xs items-end gap-2 animate-pop">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-indigo-600 text-2xl shadow-lg">🧑‍🔬</div>
          <div className="relative rounded-2xl rounded-bl-none border border-slate-200 bg-white p-3 pr-7 shadow-xl">
            <button onClick={dismiss} className="absolute right-1.5 top-1.5 text-slate-300 hover:text-slate-500" aria-label="Dismiss">✕</button>
            <p className="text-sm text-slate-700">{msg.text}</p>
            {msg.cta && (
              <Link href={msg.cta.href} onClick={() => setOpen(false)} className="mt-2 inline-block rounded-lg bg-indigo-600 px-3 py-1 text-xs font-bold text-white hover:bg-indigo-700">
                {msg.cta.label} →
              </Link>
            )}
          </div>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="grid h-12 w-12 place-items-center rounded-full bg-indigo-600 text-2xl shadow-lg transition hover:scale-105"
          aria-label="Open Professor Photon"
        >
          🧑‍🔬
        </button>
      )}
    </div>
  );
}
