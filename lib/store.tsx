"use client";

// Global progress + rewards store, persisted to localStorage.
// Everything the app remembers (stars, which guides were read, in-progress
// papers, the "resume where you left off" pointer) lives here.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const STORAGE_KEY = "year8science.v1";

/** State of a single paper / quiz attempt, used for autosave + resume. */
export interface AttemptState {
  /** Index of the question currently being viewed. */
  index: number;
  /** MCQ: chosen option index per question id. QA: typed text per id. */
  answers: Record<string, number | string>;
  /** QA self-assessment results per question id: 0..1 coverage. */
  scores: Record<string, number>;
  /** Whether the attempt has been finished at least once. */
  completed: boolean;
  updatedAt: number;
}

export interface LastActivity {
  href: string;
  label: string;
  topicId?: string;
  at: number;
}

interface StoreData {
  stars: number;
  /** Idempotency keys for already-granted rewards. */
  awarded: Record<string, true>;
  /** Per-attempt saved state, keyed by a stable storage key. */
  attempts: Record<string, AttemptState>;
  /** Topic ids whose guide has been marked as read. */
  guidesRead: Record<string, true>;
  last?: LastActivity;
}

const EMPTY: StoreData = {
  stars: 0,
  awarded: {},
  attempts: {},
  guidesRead: {},
};

interface StoreContextValue extends StoreData {
  /** Grant `amount` stars once for `key`. Returns stars actually added. */
  award: (key: string, amount: number) => number;
  hasAward: (key: string) => boolean;
  saveAttempt: (key: string, state: AttemptState) => void;
  getAttempt: (key: string) => AttemptState | undefined;
  markGuideRead: (topicId: string) => void;
  setLast: (a: Omit<LastActivity, "at">) => void;
  resetAll: () => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

function load(): StoreData {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<StoreData>;
    return { ...EMPTY, ...parsed };
  } catch {
    return EMPTY;
  }
}

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<StoreData>(EMPTY);
  const [hydrated, setHydrated] = useState(false);
  const dataRef = useRef(data);
  dataRef.current = data;

  // Hydrate from localStorage on mount (client only).
  useEffect(() => {
    setData(load());
    setHydrated(true);
  }, []);

  // Persist on every change once hydrated.
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      /* storage full or unavailable — ignore */
    }
  }, [data, hydrated]);

  const award = useCallback((key: string, amount: number) => {
    let added = 0;
    setData((d) => {
      if (d.awarded[key]) return d;
      added = amount;
      return {
        ...d,
        stars: d.stars + amount,
        awarded: { ...d.awarded, [key]: true },
      };
    });
    return added;
  }, []);

  const hasAward = useCallback((key: string) => !!dataRef.current.awarded[key], []);

  const saveAttempt = useCallback((key: string, state: AttemptState) => {
    setData((d) => ({ ...d, attempts: { ...d.attempts, [key]: state } }));
  }, []);

  const getAttempt = useCallback(
    (key: string) => dataRef.current.attempts[key],
    [],
  );

  const markGuideRead = useCallback((topicId: string) => {
    setData((d) => ({ ...d, guidesRead: { ...d.guidesRead, [topicId]: true } }));
  }, []);

  const setLast = useCallback((a: Omit<LastActivity, "at">) => {
    setData((d) => ({ ...d, last: { ...a, at: Date.now() } }));
  }, []);

  const resetAll = useCallback(() => setData(EMPTY), []);

  const value = useMemo<StoreContextValue>(
    () => ({
      ...data,
      award,
      hasAward,
      saveAttempt,
      getAttempt,
      markGuideRead,
      setLast,
      resetAll,
    }),
    [data, award, hasAward, saveAttempt, getAttempt, markGuideRead, setLast, resetAll],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within ProgressProvider");
  return ctx;
}

/** Star "levels" so the header can show a friendly rank. */
export interface Rank {
  min: number;
  name: string;
  emoji: string;
}
export const RANKS: Rank[] = [
  { min: 0, name: "Curious Cadet", emoji: "🌱" },
  { min: 25, name: "Junior Scientist", emoji: "🔬" },
  { min: 75, name: "Lab Explorer", emoji: "🧪" },
  { min: 150, name: "Science Whiz", emoji: "⚗️" },
  { min: 300, name: "Master Investigator", emoji: "🧠" },
  { min: 500, name: "Professor", emoji: "🎓" },
];

export function rankFor(stars: number) {
  let r = RANKS[0];
  for (const rank of RANKS) if (stars >= rank.min) r = rank;
  return r;
}
