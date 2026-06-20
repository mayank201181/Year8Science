"use client";

// Global progress + rewards store.
//
// Progress is now per-LEARNER-PROFILE and synced to the cloud (Vercel Blob)
// so it follows the learner across devices. localStorage is kept only as a
// fast offline cache. The provider also records lightweight usage analytics
// (time on task, questions answered/correct, per-topic activity) for the
// PIN-protected parent dashboard.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { Analytics, AttemptState, Profile, ProgressDoc, TopicStat } from "./profileTypes";
import { emptyAnalytics, emptyProgress } from "./profileTypes";
import { lookup } from "./questionIndex";

export type { AttemptState } from "./profileTypes";

export interface LastActivity {
  href: string;
  label: string;
  topicId?: string;
  at: number;
}

export interface Streak {
  count: number;
  last: string;
  best: number;
}

export interface PublicAccount {
  id: string;
  displayName: string;
  profiles: Profile[];
}

type Status = "loading" | "anon" | "no-profile" | "ready";

type StoreData = ProgressDoc;

const HEARTBEAT_MS = 20000;
/** Spaced-repetition interval ladder (days). Graduate after the last step. */
const SRS_STEPS = [1, 3, 7, 16, 35];

function addDaysISO(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}
function dayDiff(a: string, b: string): number {
  return Math.round((Date.parse(b + "T00:00:00") - Date.parse(a + "T00:00:00")) / 86400000);
}
function bumpStreak(s: Streak): Streak {
  const today = todayISO();
  if (s.last === today) return s;
  let count = 1;
  if (s.last && dayDiff(s.last, today) === 1) count = s.count + 1;
  return { count, last: today, best: Math.max(s.best, count) };
}
function defTopic(): TopicStat {
  return { timeMs: 0, answered: 0, correct: 0, guideRead: false, challengeBest: 0 };
}
function pushLog(a: Analytics, type: string, topicId?: string, detail?: string): Analytics {
  const log = [...a.log, { at: Date.now(), type, topicId, detail }].slice(-120);
  return { ...a, log, lastActiveAt: Date.now() };
}
function normalize(d: Partial<ProgressDoc> | null): ProgressDoc {
  const base = emptyProgress();
  if (!d) return base;
  return {
    ...base,
    ...d,
    streak: { ...base.streak, ...(d.streak || {}) },
    analytics: { ...emptyAnalytics(), ...(d.analytics || {}), days: { ...(d.analytics?.days || {}) }, topics: { ...(d.analytics?.topics || {}) }, log: d.analytics?.log || [] },
  };
}

interface StoreContextValue extends StoreData {
  status: Status;
  account: PublicAccount | null;
  activeProfile: Profile | null;
  // auth / profile actions
  signup: (username: string, password: string, pin: string) => Promise<{ ok: boolean; error?: string }>;
  login: (username: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
  createProfile: (name: string, emoji: string) => Promise<{ ok: boolean; error?: string }>;
  updateProfile: (profileId: string, name: string, emoji: string) => Promise<{ ok: boolean; error?: string }>;
  deleteProfile: (profileId: string) => Promise<{ ok: boolean; error?: string }>;
  selectProfile: (profileId: string) => Promise<void>;
  switchProfile: () => void;
  // progress actions
  award: (key: string, amount: number) => number;
  hasAward: (key: string) => boolean;
  saveAttempt: (key: string, state: AttemptState) => void;
  getAttempt: (key: string) => AttemptState | undefined;
  markGuideRead: (topicId: string) => void;
  setLast: (a: Omit<LastActivity, "at">) => void;
  recordResult: (qid: string, correct: boolean) => void;
  setChallengeBest: (topicId: string, score: number) => void;
  setGoalMinutes: (minutes: number) => void;
  touchStreak: () => void;
  resetAll: () => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

const cacheKey = (acc: string, prof: string) => `y8cache:${acc}:${prof}`;
const lastProfileKey = (acc: string) => `y8last:${acc}`;

function currentTopicId(): string | undefined {
  if (typeof window === "undefined") return undefined;
  const m = window.location.pathname.match(/\/(?:topic|challenge|certificate)\/([^/]+)/);
  return m ? m[1] : undefined;
}

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<Status>("loading");
  const [account, setAccount] = useState<PublicAccount | null>(null);
  const [activeProfile, setActiveProfile] = useState<Profile | null>(null);
  const [data, setData] = useState<StoreData>(emptyProgress());

  const dataRef = useRef(data);
  dataRef.current = data;
  const accountRef = useRef(account);
  accountRef.current = account;
  const activeRef = useRef(activeProfile);
  activeRef.current = activeProfile;
  const canSaveRef = useRef(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ---- bootstrap: who is signed in? ----
  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/auth/me", { cache: "no-store" });
        const j = await r.json();
        if (j.account) {
          setAccount(j.account);
          const lastId = localStorage.getItem(lastProfileKey(j.account.id));
          const prof = j.account.profiles.find((p: Profile) => p.id === lastId);
          if (prof) {
            await loadProfile(j.account.id, prof);
            return;
          }
          setStatus("no-profile");
        } else {
          setStatus("anon");
        }
      } catch {
        setStatus("anon");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadProfile(accountId: string, prof: Profile) {
    canSaveRef.current = false;
    setActiveProfile(prof);
    // instant paint from cache
    try {
      const cached = localStorage.getItem(cacheKey(accountId, prof.id));
      if (cached) setData(normalize(JSON.parse(cached)));
    } catch {}
    setStatus("ready");
    try {
      const r = await fetch(`/api/progress?profileId=${prof.id}`, { cache: "no-store" });
      const j = await r.json();
      const doc = normalize(j.progress);
      // register a new session
      doc.analytics = pushLog({ ...doc.analytics, sessionCount: doc.analytics.sessionCount + 1 }, "start");
      setData(doc);
    } catch {
      /* keep cache */
    }
    localStorage.setItem(lastProfileKey(accountId), prof.id);
    canSaveRef.current = true;
  }

  // ---- persist (debounced) ----
  useEffect(() => {
    if (status !== "ready" || !accountRef.current || !activeRef.current || !canSaveRef.current) return;
    const acc = accountRef.current.id;
    const pid = activeRef.current.id;
    try {
      localStorage.setItem(cacheKey(acc, pid), JSON.stringify(data));
    } catch {}
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileId: pid, progress: dataRef.current }),
      }).catch(() => {});
    }, 1800);
  }, [data, status]);

  // ---- heartbeat: time on task ----
  useEffect(() => {
    const id = setInterval(() => {
      if (status !== "ready" || document.visibilityState !== "visible") return;
      const tid = currentTopicId();
      setData((d) => {
        const today = todayISO();
        const days = { ...d.analytics.days };
        const day = { ...(days[today] || { timeMs: 0, answered: 0, correct: 0 }) };
        day.timeMs += HEARTBEAT_MS;
        days[today] = day;
        const topics = { ...d.analytics.topics };
        if (tid) {
          const t = { ...(topics[tid] || defTopic()) };
          t.timeMs += HEARTBEAT_MS;
          topics[tid] = t;
        }
        return { ...d, analytics: { ...d.analytics, totalTimeMs: d.analytics.totalTimeMs + HEARTBEAT_MS, lastActiveAt: Date.now(), days, topics } };
      });
    }, HEARTBEAT_MS);
    return () => clearInterval(id);
  }, [status]);

  // ---- auth / profile actions ----
  const signup = useCallback(async (username: string, password: string, pin: string) => {
    const r = await fetch("/api/auth/signup", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username, password, pin }) });
    const j = await r.json();
    if (!r.ok) return { ok: false, error: j.error };
    setAccount(j.account);
    setStatus("no-profile");
    return { ok: true };
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const r = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username, password }) });
    const j = await r.json();
    if (!r.ok) return { ok: false, error: j.error };
    setAccount(j.account);
    setStatus("no-profile");
    return { ok: true };
  }, []);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    setAccount(null);
    setActiveProfile(null);
    setData(emptyProgress());
    canSaveRef.current = false;
    setStatus("anon");
  }, []);

  const createProfile = useCallback(async (name: string, emoji: string) => {
    const r = await fetch("/api/profiles", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, emoji }) });
    const j = await r.json();
    if (!r.ok) return { ok: false, error: j.error };
    const prof: Profile = j.profile;
    setAccount((a) => (a ? { ...a, profiles: [...a.profiles, prof] } : a));
    const accId = accountRef.current?.id;
    if (accId) await loadProfile(accId, prof);
    return { ok: true };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateProfile = useCallback(async (profileId: string, name: string, emoji: string) => {
    const r = await fetch("/api/profiles", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ profileId, name, emoji }) });
    const j = await r.json();
    if (!r.ok) return { ok: false, error: j.error };
    const prof: Profile = j.profile;
    setAccount((a) => (a ? { ...a, profiles: a.profiles.map((p) => (p.id === prof.id ? prof : p)) } : a));
    setActiveProfile((p) => (p && p.id === prof.id ? prof : p));
    return { ok: true };
  }, []);

  const deleteProfile = useCallback(async (profileId: string) => {
    const r = await fetch("/api/profiles", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ profileId }) });
    const j = await r.json();
    if (!r.ok) return { ok: false, error: j.error };
    setAccount((a) => (a ? { ...a, profiles: a.profiles.filter((p) => p.id !== profileId) } : a));
    if (activeRef.current?.id === profileId) {
      canSaveRef.current = false;
      setActiveProfile(null);
      setData(emptyProgress());
      setStatus("no-profile");
    }
    return { ok: true };
  }, []);

  const selectProfile = useCallback(async (profileId: string) => {
    const acc = accountRef.current;
    const prof = acc?.profiles.find((p) => p.id === profileId);
    if (acc && prof) await loadProfile(acc.id, prof);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const switchProfile = useCallback(() => {
    // flush pending save immediately
    const acc = accountRef.current?.id;
    const pid = activeRef.current?.id;
    if (acc && pid && canSaveRef.current) {
      fetch("/api/progress", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ profileId: pid, progress: dataRef.current }) }).catch(() => {});
    }
    canSaveRef.current = false;
    setActiveProfile(null);
    setData(emptyProgress());
    setStatus("no-profile");
  }, []);

  // ---- progress mutations ----
  const award = useCallback((key: string, amount: number) => {
    let added = 0;
    setData((d) => {
      if (d.awarded[key]) return d;
      added = amount;
      return { ...d, stars: d.stars + amount, awarded: { ...d.awarded, [key]: true } };
    });
    return added;
  }, []);

  const hasAward = useCallback((key: string) => !!dataRef.current.awarded[key], []);

  const saveAttempt = useCallback((key: string, state: AttemptState) => {
    setData((d) => ({ ...d, attempts: { ...d.attempts, [key]: state }, streak: bumpStreak(d.streak) }));
  }, []);

  const getAttempt = useCallback((key: string) => dataRef.current.attempts[key] as AttemptState | undefined, []);

  const markGuideRead = useCallback((topicId: string) => {
    setData((d) => {
      const topics = { ...d.analytics.topics };
      topics[topicId] = { ...(topics[topicId] || defTopic()), guideRead: true };
      const analytics = pushLog({ ...d.analytics, topics }, "guide", topicId);
      return { ...d, guidesRead: { ...d.guidesRead, [topicId]: true }, streak: bumpStreak(d.streak), analytics };
    });
  }, []);

  const recordResult = useCallback((qid: string, correct: boolean) => {
    const topicId = lookup(qid)?.topicId;
    setData((d) => {
      const missed = { ...d.missed };
      const srs = { ...d.srs };
      if (correct) {
        // Advance the spaced-repetition schedule if this was a review item.
        const cur = srs[qid];
        if (cur) {
          const reps = cur.reps + 1;
          if (reps >= SRS_STEPS.length) {
            delete srs[qid]; // graduated — mastered
            delete missed[qid];
          } else {
            const interval = SRS_STEPS[reps];
            srs[qid] = { due: addDaysISO(interval), reps, interval };
            delete missed[qid]; // not due again until `due`
          }
        }
      } else {
        // Missed: schedule for review today, reset the ladder.
        srs[qid] = { due: todayISO(), reps: 0, interval: 1 };
        missed[qid] = true;
      }
      const today = todayISO();
      const days = { ...d.analytics.days };
      const day = { ...(days[today] || { timeMs: 0, answered: 0, correct: 0 }) };
      day.answered += 1;
      if (correct) day.correct += 1;
      days[today] = day;
      const topics = { ...d.analytics.topics };
      if (topicId) {
        const t = { ...(topics[topicId] || defTopic()) };
        t.answered += 1;
        if (correct) t.correct += 1;
        topics[topicId] = t;
      }
      const analytics: Analytics = {
        ...d.analytics,
        answered: d.analytics.answered + 1,
        correct: d.analytics.correct + (correct ? 1 : 0),
        lastActiveAt: Date.now(),
        days,
        topics,
      };
      return { ...d, missed, srs, streak: bumpStreak(d.streak), analytics };
    });
  }, []);

  const setGoalMinutes = useCallback((minutes: number) => {
    setData((d) => ({ ...d, goalMinutes: Math.max(5, Math.min(60, Math.round(minutes))) }));
  }, []);

  const setChallengeBest = useCallback((topicId: string, score: number) => {
    setData((d) => {
      const topics = { ...d.analytics.topics };
      topics[topicId] = { ...(topics[topicId] || defTopic()), challengeBest: Math.max(topics[topicId]?.challengeBest ?? 0, score) };
      const analytics = pushLog({ ...d.analytics, topics }, "challenge", topicId, `${score}%`);
      return {
        ...d,
        challengeBest: { ...d.challengeBest, [topicId]: Math.max(d.challengeBest[topicId] ?? 0, score) },
        streak: bumpStreak(d.streak),
        analytics,
      };
    });
  }, []);

  const touchStreak = useCallback(() => {
    setData((d) => ({ ...d, streak: bumpStreak(d.streak) }));
  }, []);

  const setLast = useCallback((a: Omit<LastActivity, "at">) => {
    setData((d) => ({ ...d, last: { ...a, at: Date.now() } }));
  }, []);

  const resetAll = useCallback(() => {
    const fresh = emptyProgress();
    fresh.analytics.sessionCount = dataRef.current.analytics.sessionCount;
    setData(fresh);
  }, []);

  const value = useMemo<StoreContextValue>(
    () => ({
      ...data,
      status,
      account,
      activeProfile,
      signup,
      login,
      logout,
      createProfile,
      updateProfile,
      deleteProfile,
      selectProfile,
      switchProfile,
      award,
      hasAward,
      saveAttempt,
      getAttempt,
      markGuideRead,
      setLast,
      recordResult,
      setChallengeBest,
      setGoalMinutes,
      touchStreak,
      resetAll,
    }),
    [data, status, account, activeProfile, signup, login, logout, createProfile, updateProfile, deleteProfile, selectProfile, switchProfile, award, hasAward, saveAttempt, getAttempt, markGuideRead, setLast, recordResult, setChallengeBest, setGoalMinutes, touchStreak, resetAll],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within ProgressProvider");
  return ctx;
}

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
