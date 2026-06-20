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
