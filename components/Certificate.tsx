"use client";

import Link from "next/link";
import type { Topic } from "@/lib/types";
import { useStore } from "@/lib/store";

export function Certificate({ topic }: { topic: Topic }) {
  const { challengeBest } = useStore();
  const score = challengeBest[topic.id] ?? 0;
  const date = new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-4 flex items-center justify-between print:hidden">
        <Link href={`/topic/${topic.id}`} className="text-sm font-medium text-slate-500 hover:text-slate-700">← Back to topic</Link>
        <button onClick={() => window.print()} className="rounded-xl bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700">🖨️ Print / Save as PDF</button>
      </div>

      <div className="relative overflow-hidden rounded-3xl border-[6px] border-double border-amber-400 bg-gradient-to-br from-amber-50 to-white p-10 text-center shadow-lg">
        <div className="text-6xl">{topic.icon}</div>
        <p className="mt-4 text-sm font-bold uppercase tracking-[0.3em] text-amber-600">Certificate of Mastery</p>
        <p className="mt-6 text-slate-600">This certifies that</p>
        <p className="mt-1 text-3xl font-extrabold text-slate-900">a Year 8 Scientist</p>
        <p className="mt-4 text-slate-600">has demonstrated mastery of</p>
        <p className="mt-1 text-2xl font-bold text-indigo-700">{topic.title}</p>
        <p className="mt-1 text-sm text-slate-500">({topic.subject})</p>

        {score > 0 && (
          <p className="mt-6 inline-block rounded-full bg-amber-100 px-4 py-1.5 font-bold text-amber-700">Challenge best: {score}%</p>
        )}

        <div className="mt-8 flex items-center justify-center gap-10 text-sm text-slate-500">
          <div className="border-t-2 border-slate-300 pt-1 px-6">{date}</div>
          <div className="border-t-2 border-slate-300 pt-1 px-6">Year 8 Science Lab 🔬</div>
        </div>
        <div className="pointer-events-none absolute -right-6 -top-6 text-9xl opacity-10">🏅</div>
      </div>
    </div>
  );
}
