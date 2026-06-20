"use client";

import Link from "next/link";
import { rankFor, useStore } from "@/lib/store";

export function SiteHeader() {
  const { stars, streak, missed } = useStore();
  const rank = rankFor(stars);
  const missedCount = Object.keys(missed).length;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-bold text-slate-900">
          <span className="text-2xl" aria-hidden>
            🔬
          </span>
          <span className="leading-tight">
            Year 8 <span className="text-indigo-600">Science Lab</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 text-sm font-medium text-slate-600 sm:flex">
          <Link href="/" className="rounded-lg px-3 py-1.5 hover:bg-slate-100">
            Topics
          </Link>
          <Link href="/exam" className="rounded-lg px-3 py-1.5 hover:bg-slate-100">
            Big Exam
          </Link>
          <Link href="/review" className="relative rounded-lg px-3 py-1.5 hover:bg-slate-100">
            Review
            {missedCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                {missedCount > 99 ? "99+" : missedCount}
              </span>
            )}
          </Link>
          <Link href="/progress" className="rounded-lg px-3 py-1.5 hover:bg-slate-100">
            My Progress
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          {streak.count > 0 && (
            <span
              className="flex items-center gap-1 rounded-full border border-orange-200 bg-orange-50 px-2.5 py-1.5 text-sm font-bold text-orange-600"
              title={`${streak.count}-day streak · best ${streak.best}`}
            >
              🔥 <span className="tabular-nums">{streak.count}</span>
            </span>
          )}
          <Link
            href="/progress"
            className="flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-sm font-semibold text-amber-700 hover:bg-amber-100"
            title={`${rank.emoji} ${rank.name}`}
          >
            <span className="text-lg leading-none" aria-hidden>
              ⭐
            </span>
            <span className="tabular-nums">{stars}</span>
            <span className="hidden text-amber-400 md:inline">·</span>
            <span className="hidden md:inline">{rank.name}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
