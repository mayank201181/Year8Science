"use client";

import { useState } from "react";
import type { Flashcard } from "@/lib/types";
import { useStore } from "@/lib/store";

export function Flashcards({ cards, topicId }: { cards: Flashcard[]; topicId: string }) {
  const { award } = useStore();
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [seen, setSeen] = useState<Set<number>>(new Set([0]));

  if (!cards.length) return <p className="text-slate-500">Flashcards coming soon.</p>;

  const card = cards[i];

  function move(delta: number) {
    const ni = (i + delta + cards.length) % cards.length;
    setI(ni);
    setFlipped(false);
    const ns = new Set(seen);
    ns.add(ni);
    setSeen(ns);
    if (ns.size === cards.length) award(`flashcards:${topicId}`, 4);
  }

  return (
    <div className="mx-auto max-w-lg">
      <button
        onClick={() => setFlipped((f) => !f)}
        className="relative block h-56 w-full [perspective:1200px]"
        aria-label="Flip card"
      >
        <div
          className="relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d]"
          style={{ transform: flipped ? "rotateY(180deg)" : "none" }}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border-2 border-indigo-200 bg-white p-6 text-center [backface-visibility:hidden]">
            <span className="mb-2 text-xs font-bold uppercase tracking-wide text-indigo-400">Question</span>
            <p className="text-lg font-semibold text-slate-900">{card.front}</p>
            <span className="mt-4 text-xs text-slate-400">Tap to flip</span>
          </div>
          <div
            className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border-2 border-emerald-300 bg-emerald-50 p-6 text-center [backface-visibility:hidden]"
            style={{ transform: "rotateY(180deg)" }}
          >
            <span className="mb-2 text-xs font-bold uppercase tracking-wide text-emerald-500">Answer</span>
            <p className="text-base font-medium text-emerald-900">{card.back}</p>
          </div>
        </div>
      </button>

      <div className="mt-4 flex items-center justify-between">
        <button onClick={() => move(-1)} className="rounded-xl border border-slate-200 bg-white px-4 py-2 font-medium text-slate-600 hover:bg-slate-50">
          ← Prev
        </button>
        <span className="text-sm font-medium text-slate-500">
          {i + 1} / {cards.length} · seen {seen.size}
        </span>
        <button onClick={() => move(1)} className="rounded-xl border border-slate-200 bg-white px-4 py-2 font-medium text-slate-600 hover:bg-slate-50">
          Next →
        </button>
      </div>
    </div>
  );
}
