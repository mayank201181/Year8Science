"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { rankFor, useStore } from "@/lib/store";

export function SiteHeader() {
  const { stars, streak, srs, activeProfile, switchProfile, logout } = useStore();
  const rank = rankFor(stars);
  const today = new Date().toISOString().slice(0, 10);
  const missedCount = Object.values(srs).filter((s) => s.due <= today).length;
  const [menu, setMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenu(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

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

          {activeProfile && (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenu((v) => !v)}
                className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                title={activeProfile.name}
              >
                <span className="text-lg leading-none">{activeProfile.emoji}</span>
                <span className="hidden max-w-[7rem] truncate sm:inline">{activeProfile.name}</span>
                <span className="text-slate-400">▾</span>
              </button>
              {menu && (
                <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
                  <Link href="/progress" onClick={() => setMenu(false)} className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 sm:hidden">My Progress</Link>
                  <button onClick={() => { setMenu(false); switchProfile(); }} className="block w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">🔄 Switch learner</button>
                  <Link href="/parent" onClick={() => setMenu(false)} className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">🔒 Parent dashboard</Link>
                  <button onClick={() => { setMenu(false); logout(); }} className="block w-full px-4 py-2 text-left text-sm text-rose-600 hover:bg-rose-50">Log out</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
