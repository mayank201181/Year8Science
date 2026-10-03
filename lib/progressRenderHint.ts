/** Structural hints only. Never store a document, field key, count, or value. */
export type ProgressRenderHint = "None" | "ReviewMap" | "ReviewEntry" | "GuideMap" | "AttemptMap" | "AttemptEntry" | "ResumeLink" | "UnreadableShape";
const unreadable = Symbol("unreadable");
const object = (value: unknown): value is object => typeof value === "object" && value !== null;
function own(value: unknown, key: string): unknown {
  if (!object(value)) return undefined;
  const descriptor = Object.getOwnPropertyDescriptor(value, key);
  if (!descriptor) return undefined;
  return "value" in descriptor ? descriptor.value : unreadable;
}
function entries(value: object): Array<[string, unknown]> {
  return Object.keys(value).map(key => [key, own(value, key)]);
}
/** Observe the fields read by the initial learner view; do not validate, repair,
 * reject, copy, or mutate progress. A hint is not proof of the error's cause.
 */
export function progressRenderHint(doc: unknown): ProgressRenderHint {
  try {
    if (!object(doc)) return "UnreadableShape";
    const review = own(doc, "srs");
    if (review === unreadable) return "UnreadableShape";
    if (review == null) return "ReviewMap";
    if (object(review)) for (const [, entry] of entries(review)) {
      if (entry === unreadable) return "UnreadableShape";
      if (entry == null) return "ReviewEntry";
    }
    const guides = own(doc, "guidesRead");
    if (guides === unreadable) return "UnreadableShape";
    if (guides == null) return "GuideMap";
    const attempts = own(doc, "attempts");
    if (attempts === unreadable) return "UnreadableShape";
    if (attempts == null) return "AttemptMap";
    if (object(attempts)) for (const [key, entry] of entries(attempts)) {
      if (entry === unreadable) return "UnreadableShape";
      if (/^(quiz-mcq|quiz-qa|bank):/.test(key) && entry == null) return "AttemptEntry";
    }
    const last = own(doc, "last");
    if (last === unreadable) return "UnreadableShape";
    if (last) {
      const href = own(last, "href");
      if (href === unreadable) return "UnreadableShape";
      if (href == null || (typeof href !== "string" && !object(href))) return "ResumeLink";
    }
    return "None";
  } catch { return "UnreadableShape"; }
}
export type RecoveryHint = "ReviewMap" | "ReviewEntry" | "GuideMap";
/** Recovery is deliberately limited to three reproduced nullish render failures. */
export function knownRecoveryHints(doc: unknown): RecoveryHint[] {
  try {
    if (!object(doc)) return [];
    const hints: RecoveryHint[] = [];
    const review = own(doc, "srs");
    if (review == null) hints.push("ReviewMap");
    else if (object(review) && entries(review).some(([, entry]) => entry == null)) hints.push("ReviewEntry");
    if (own(doc, "guidesRead") == null) hints.push("GuideMap");
    return hints;
  } catch { return []; }
}
let current: ProgressRenderHint = "None";
export function captureProgressRenderHint(doc: unknown): void { current = progressRenderHint(doc); }
export function clearProgressRenderHint(): void { current = "None"; }
export function currentProgressRenderHint(): ProgressRenderHint { return current; }
