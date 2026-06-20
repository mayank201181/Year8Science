import type { QA } from "./types";

export type Verdict = "correct" | "partial" | "incorrect";

export interface QAResult {
  coverage: number; // 0..1
  verdict: Verdict;
  creditedPoints: boolean[]; // per mark point: was it credited?
  hitCount: number;
  total: number;
}

/**
 * Auto-assess a typed written answer against a mark scheme by keyword
 * coverage. This is deliberately generous: any keyword for a mark point
 * counts that point. It runs fully client-side (no LLM needed).
 */
export function gradeQA(qa: QA, answer: string): QAResult {
  const text = ` ${answer.toLowerCase().replace(/[^a-z0-9\s]/g, " ")} `;
  const credited = qa.markScheme.map((mp) =>
    mp.keywords.some((kw) => {
      const k = kw.toLowerCase().trim();
      if (!k) return false;
      // word-ish boundary match
      return text.includes(` ${k} `) || text.includes(` ${k}`) || text.includes(`${k} `);
    }),
  );
  const hitCount = credited.filter(Boolean).length;
  const total = qa.markScheme.length || 1;
  const coverage = hitCount / total;
  let verdict: Verdict = "incorrect";
  if (coverage >= 0.75) verdict = "correct";
  else if (coverage >= 0.34) verdict = "partial";
  // Empty / trivially short answers are always incorrect.
  if (answer.trim().length < 3) {
    return { coverage: 0, verdict: "incorrect", creditedPoints: credited.map(() => false), hitCount: 0, total };
  }
  return { coverage, verdict, creditedPoints: credited, hitCount, total };
}

export const VERDICT_META: Record<Verdict, { label: string; emoji: string; className: string }> = {
  correct: { label: "Correct!", emoji: "✅", className: "text-emerald-700 bg-emerald-50 border-emerald-200" },
  partial: { label: "Partially right", emoji: "🟡", className: "text-amber-700 bg-amber-50 border-amber-200" },
  incorrect: { label: "Needs work", emoji: "🔴", className: "text-rose-700 bg-rose-50 border-rose-200" },
};
