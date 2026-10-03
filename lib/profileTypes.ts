// Types shared between the client store and the server API.

/** State of a single paper / quiz attempt, used for autosave + resume. */
export interface AttemptState {
  index: number;
  answers: Record<string, number | string>;
  scores: Record<string, number>;
  completed: boolean;
  updatedAt: number;
}

export interface Profile {
  id: string;
  name: string;
  emoji: string;
  createdAt: number;
}

export interface DayStat {
  timeMs: number;
  answered: number;
  correct: number;
}

export interface TopicStat {
  timeMs: number;
  answered: number;
  correct: number;
  guideRead: boolean;
  challengeBest: number;
}

export interface ActivityEntry {
  at: number;
  type: string;
  topicId?: string;
  detail?: string;
}

/** Spaced-repetition schedule entry for a missed question. */
export interface SrsItem {
  /** ISO date (YYYY-MM-DD) the item is next due for review. */
  due: string;
  /** Successful reviews in a row (index into the interval ladder). */
  reps: number;
  /** Current interval in days. */
  interval: number;
}

export interface Analytics {
  firstActiveAt: number;
  lastActiveAt: number;
  totalTimeMs: number;
  sessionCount: number;
  answered: number;
  correct: number;
  days: Record<string, DayStat>;
  topics: Record<string, TopicStat>;
  log: ActivityEntry[];
}

/** The full per-learner document stored in the cloud. */
export interface ProgressDoc {
  stars: number;
  awarded: Record<string, true>;
  attempts: Record<string, AttemptState>;
  guidesRead: Record<string, true>;
  missed: Record<string, true>;
  challengeBest: Record<string, number>;
  streak: { count: number; last: string; best: number };
  /** Spaced-repetition schedule for missed questions, keyed by question id. */
  srs: Record<string, SrsItem>;
  /** Daily study goal in minutes. */
  goalMinutes: number;
  last?: { href: string; label: string; topicId?: string; at: number };
  analytics: Analytics;
}

export function emptyAnalytics(): Analytics {
  const now = Date.now();
  return { firstActiveAt: now, lastActiveAt: now, totalTimeMs: 0, sessionCount: 0, answered: 0, correct: 0, days: {}, topics: {}, log: [] };
}

export function emptyProgress(): ProgressDoc {
  return {
    stars: 0,
    awarded: {},
    attempts: {},
    guidesRead: {},
    missed: {},
    challengeBest: {},
    streak: { count: 0, last: "", best: 0 },
    srs: {},
    goalMinutes: 10,
    analytics: emptyAnalytics(),
  };
}

// ---- normalisation of stored documents ----
// Saved progress may come from older app versions or a partly-written cache,
// so every field is coerced to the shape the UI expects. Missing or malformed
// values fall back to their empty defaults; valid data is kept as-is.

type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const num = (v: unknown, fallback = 0): number => (typeof v === "number" && Number.isFinite(v) ? v : fallback);
const str = (v: unknown, fallback = ""): string => (typeof v === "string" ? v : fallback);

function mapOf<T>(v: unknown, item: (value: unknown) => T | undefined): Record<string, T> {
  const out: Record<string, T> = {};
  if (!isObj(v)) return out;
  for (const [key, value] of Object.entries(v)) {
    const parsed = item(value);
    if (parsed !== undefined) out[key] = parsed;
  }
  return out;
}
const flag = (v: unknown): true | undefined => (v ? true : undefined);

function attemptOf(v: unknown): AttemptState | undefined {
  if (!isObj(v)) return undefined;
  return {
    index: Math.max(0, Math.floor(num(v.index))),
    answers: mapOf(v.answers, (a) => (typeof a === "number" || typeof a === "string" ? a : undefined)),
    scores: mapOf(v.scores, (s) => (typeof s === "number" && Number.isFinite(s) ? s : undefined)),
    completed: v.completed === true,
    updatedAt: num(v.updatedAt),
  };
}

function srsOf(v: unknown): SrsItem | undefined {
  if (!isObj(v) || typeof v.due !== "string") return undefined;
  return { due: v.due, reps: Math.max(0, Math.floor(num(v.reps))), interval: num(v.interval, 1) };
}

function dayOf(v: unknown): DayStat | undefined {
  if (!isObj(v)) return undefined;
  return { timeMs: num(v.timeMs), answered: num(v.answered), correct: num(v.correct) };
}

function topicOf(v: unknown): TopicStat | undefined {
  if (!isObj(v)) return undefined;
  return { timeMs: num(v.timeMs), answered: num(v.answered), correct: num(v.correct), guideRead: v.guideRead === true, challengeBest: num(v.challengeBest) };
}

/** Coerce any stored value into a well-formed ProgressDoc. */
export function normalizeProgress(raw: unknown): ProgressDoc {
  const base = emptyProgress();
  if (!isObj(raw)) return base;
  const streak = isObj(raw.streak) ? raw.streak : {};
  const a = isObj(raw.analytics) ? raw.analytics : {};
  const doc: ProgressDoc = {
    stars: Math.max(0, num(raw.stars)),
    awarded: mapOf(raw.awarded, flag),
    attempts: mapOf(raw.attempts, attemptOf),
    guidesRead: mapOf(raw.guidesRead, flag),
    missed: mapOf(raw.missed, flag),
    challengeBest: mapOf(raw.challengeBest, (v) => (typeof v === "number" && Number.isFinite(v) ? v : undefined)),
    streak: { count: num(streak.count), last: str(streak.last), best: num(streak.best) },
    srs: mapOf(raw.srs, srsOf),
    goalMinutes: Math.max(5, Math.min(60, num(raw.goalMinutes, base.goalMinutes))),
    analytics: {
      firstActiveAt: num(a.firstActiveAt, base.analytics.firstActiveAt),
      lastActiveAt: num(a.lastActiveAt, base.analytics.lastActiveAt),
      totalTimeMs: num(a.totalTimeMs),
      sessionCount: num(a.sessionCount),
      answered: num(a.answered),
      correct: num(a.correct),
      days: mapOf(a.days, dayOf),
      topics: mapOf(a.topics, topicOf),
      log: (Array.isArray(a.log) ? a.log : [])
        .filter(isObj)
        .map((e) => ({ at: num(e.at), type: str(e.type, "start"), topicId: typeof e.topicId === "string" ? e.topicId : undefined, detail: typeof e.detail === "string" ? e.detail : undefined }))
        .slice(-120),
    },
  };
  // Only internal links may be offered as "Resume".
  const last = raw.last;
  if (isObj(last) && typeof last.href === "string" && last.href.startsWith("/") && !last.href.startsWith("//")) {
    doc.last = { href: last.href, label: str(last.label, "Continue"), topicId: typeof last.topicId === "string" ? last.topicId : undefined, at: num(last.at) };
  }
  return doc;
}
