/** A learner's explicit comparison with the mark scheme, not an automatic grade. */
export function scoreSelfAssessment(points: readonly boolean[]) {
  const total = points.length;
  const hitCount = points.filter(Boolean).length;
  const coverage = total === 0 ? 0 : hitCount / total;
  const verdict: "correct" | "partial" | "incorrect" =
    coverage >= 0.75 ? "correct" : coverage >= 0.34 ? "partial" : "incorrect";
  return { total, hitCount, coverage, verdict };
}

/** A repeated UI event must not count as another attempt or spaced review. */
export function claimAssessment(claimed: Set<string>, questionId: string, hasSavedResult: boolean) {
  if (hasSavedResult || claimed.has(questionId)) return false;
  claimed.add(questionId);
  return true;
}
