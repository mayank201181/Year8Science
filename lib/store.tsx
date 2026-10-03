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
import { emptyProgress, normalizeProgress } from "./profileTypes";
import { lookup } from "./questionIndex";
import { createProgressSaveQueue, withProgressTimeout } from "./progressSaveQueue";

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

type Status = "loading" | "anon" | "no-profile" | "ready" | "load-error";

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
/** Network or server failures become a message, never an unhandled rejection. */
const OFFLINE = "Couldn't reach the server. Check your internet connection and try again.";
async function postJson(url: string, method: string, body: unknown): Promise<{ ok: boolean; data: Record<string, unknown> }> {
  try {
    const r = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const data = await r.json().catch(() => ({}));
    return { ok: r.ok, data: (data && typeof data === "object" ? data : {}) as Record<string, unknown> };
  } catch {
    return { ok: false, data: { error: OFFLINE } };
  }
}
const errorOf = (data: Record<string, unknown>) => (typeof data.error === "string" ? data.error : "Something went wrong. Please try again.");

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
  const loadVersion = useRef(0);
  const saveRevision = useRef(0);
  const saver = useRef<ReturnType<typeof createProgressSaveQueue> | null>(null);
  if (!saver.current) saver.current = createProgressSaveQueue(async (snapshot) => {
    if (accountRef.current?.id !== snapshot.accountId) throw new Error("Account changed before save");
    const response = await withProgressTimeout((signal) => fetch("/api/progress", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: snapshot.body, signal,
      // Lets a save started as the app is closed finish; browsers cap keepalive bodies at 64 KB.
      keepalive: snapshot.body.length < 60000,
    }));
    if (!response.ok) throw new Error("Progress could not be saved");
    try {
      if (localStorage.getItem(`${snapshot.cacheKey}:dirty`) === snapshot.revision) {
        localStorage.removeItem(`${snapshot.cacheKey}:dirty`);
      }
    } catch {}
  }, 1800);

  // Send pending work as soon as the app is hidden (switching apps, locking the
  // phone) so another device sees it. On unmount, unsent work is cancelled; the
  // local cache and its dirty marker keep it for the next load.
  useEffect(() => {
    const onHide = () => {
      if (document.visibilityState === "hidden") void saver.current?.flush().catch(() => {});
    };
    const stop = () => {
      canSaveRef.current = false;
      ++loadVersion.current;
      saver.current?.cancel();
    };
    document.addEventListener("visibilitychange", onHide);
    return () => {
      document.removeEventListener("visibilitychange", onHide);
      stop();
    };
  }, []);

  // ---- bootstrap: who is signed in? ----
  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/auth/me", { cache: "no-store" });
        const j = await r.json();
        if (j.account) {
          const acc: PublicAccount = { ...j.account, profiles: Array.isArray(j.account.profiles) ? j.account.profiles : [] };
          setAccount(acc);
          let lastId: string | null = null;
          try { lastId = localStorage.getItem(lastProfileKey(acc.id)); } catch {}
          const prof = acc.profiles.find((p) => p.id === lastId);
          if (prof) {
            await selectLoaded(acc.id, prof);
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

  // Unexpected failures while loading show the retry screen rather than crashing.
  async function selectLoaded(accountId: string, prof: Profile) {
    try { await loadProfile(accountId, prof); }
    catch (error) {
      console.error("Could not load learner progress", error);
      canSaveRef.current = false;
      setStatus("load-error");
    }
  }

  async function loadProfile(accountId: string, prof: Profile) {
    const version = ++loadVersion.current;
    canSaveRef.current = false;
    setStatus("loading");
    await saver.current!.flush().catch(() => {});
    if (version !== loadVersion.current) return;
    setActiveProfile(prof);
    let cached: ProgressDoc | null = null;
    let dirty = false;
    try {
      const raw = localStorage.getItem(cacheKey(accountId, prof.id));
      if (raw) cached = normalizeProgress(JSON.parse(raw));
      dirty = !!localStorage.getItem(`${cacheKey(accountId, prof.id)}:dirty`);
    } catch {}
    let doc = cached ?? emptyProgress();
    setData(doc); // A fresh/offline profile must never inherit the prior learner's state.
    try {
      const j = await withProgressTimeout(async (signal) => {
        const r = await fetch(`/api/progress?profileId=${prof.id}`, { cache: "no-store", signal });
        if (!r.ok) throw new Error("Progress unavailable");
        return await r.json();
      });
      if (version !== loadVersion.current) return;
      // Unsynced local work takes precedence over an older remote copy.
      if (!cached || !dirty) doc = normalizeProgress(j.progress);
    } catch {
      if (version !== loadVersion.current) return;
      // An unreadable remote document is not evidence of empty progress.
      if (!cached) {
        setStatus("load-error");
        return; // canSave remains false; retry before accepting new work.
      }
    }
    if (version !== loadVersion.current) return;
    doc = { ...doc, analytics: pushLog({ ...doc.analytics, sessionCount: doc.analytics.sessionCount + 1 }, "start") };
    setData(doc);
    try { localStorage.setItem(lastProfileKey(accountId), prof.id); } catch {}
    canSaveRef.current = true;
    setStatus("ready");
  }

  // ---- persist an immutable, learner-bound snapshot (debounced) ----
  useEffect(() => {
    if (status !== "ready" || !accountRef.current || !activeRef.current || !canSaveRef.current) return;
    const acc = accountRef.current.id;
    const pid = activeRef.current.id;
    const key = cacheKey(acc, pid);
    const revision = `${Date.now()}:${++saveRevision.current}`;
    try {
      localStorage.setItem(key, JSON.stringify(data));
      localStorage.setItem(`${key}:dirty`, revision);
    } catch {}
    saver.current!.schedule({ accountId: acc, profileId: pid, cacheKey: key, revision,
      body: JSON.stringify({ profileId: pid, progress: data }) });
  }, [data, status]);

  // ---- heartbeat: time on task ----
  useEffect(() => {
    const id = setInterval(() => {
      if (!canSaveRef.current || status !== "ready" || document.visibilityState !== "visible") return;
      const tid = currentTopicId();
      setData((d) => {
        if (!canSaveRef.current) return d;
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
    const { ok, data } = await postJson("/api/auth/signup", "POST", { username, password, pin });
    if (!ok) return { ok: false, error: errorOf(data) };
    setAccount(data.account as PublicAccount);
    setStatus("no-profile");
    return { ok: true };
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const { ok, data } = await postJson("/api/auth/login", "POST", { username, password });
    if (!ok) return { ok: false, error: errorOf(data) };
    setAccount(data.account as PublicAccount);
    setStatus("no-profile");
    return { ok: true };
  }, []);

  const logout = useCallback(async () => {
    ++loadVersion.current;
    canSaveRef.current = false;
    setStatus("loading");
    await saver.current!.flush().catch(() => {});
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    setAccount(null);
    setActiveProfile(null);
    setData(emptyProgress());
    canSaveRef.current = false;
    setStatus("anon");
  }, []);

  const createProfile = useCallback(async (name: string, emoji: string) => {
    const { ok, data } = await postJson("/api/profiles", "POST", { name, emoji });
    if (!ok || !data.profile) return { ok: false, error: errorOf(data) };
    const prof = data.profile as Profile;
    setAccount((a) => (a ? { ...a, profiles: [...a.profiles, prof] } : a));
    const accId = accountRef.current?.id;
    if (accId) await selectLoaded(accId, prof);
    return { ok: true };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateProfile = useCallback(async (profileId: string, name: string, emoji: string) => {
    const { ok, data } = await postJson("/api/profiles", "PATCH", { profileId, name, emoji });
    if (!ok || !data.profile) return { ok: false, error: errorOf(data) };
    const prof = data.profile as Profile;
    setAccount((a) => (a ? { ...a, profiles: a.profiles.map((p) => (p.id === prof.id ? prof : p)) } : a));
    setActiveProfile((p) => (p && p.id === prof.id ? prof : p));
    return { ok: true };
  }, []);

  const deleteProfile = useCallback(async (profileId: string) => {
    const { ok, data } = await postJson("/api/profiles", "DELETE", { profileId });
    if (!ok) return { ok: false, error: errorOf(data) };
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
    if (acc && prof) await selectLoaded(acc.id, prof);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const switchProfile = useCallback(() => {
    ++loadVersion.current;
    canSaveRef.current = false;
    // flush() cancels the timer; its body is already bound to the old learner.
    void saver.current!.flush().catch(() => {});
    setActiveProfile(null);
    setData(emptyProgress());
    setStatus("no-profile");
  }, []);

  // Recheck inside the React updater so stale callbacks cannot modify an unloaded learner.
  const updateProgress = useCallback((update: (current: StoreData) => StoreData) => {
    if (!canSaveRef.current) return;
    setData(current => !canSaveRef.current ? current : update(current));
  }, []);

  // ---- progress mutations ----
  const award = useCallback((key: string, amount: number) => {
    let added = 0;
    updateProgress((d) => {
      if (d.awarded[key]) return d;
      added = amount;
      return { ...d, stars: d.stars + amount, awarded: { ...d.awarded, [key]: true } };
    });
    return added;
  }, [updateProgress]);

  const hasAward = useCallback((key: string) => !!dataRef.current.awarded[key], []);

  const saveAttempt = useCallback((key: string, state: AttemptState) => {
    updateProgress((d) => ({ ...d, attempts: { ...d.attempts, [key]: state }, streak: bumpStreak(d.streak) }));
  }, [updateProgress]);

  const getAttempt = useCallback((key: string) => dataRef.current.attempts[key] as AttemptState | undefined, []);

  const markGuideRead = useCallback((topicId: string) => {
    updateProgress((d) => {
      const topics = { ...d.analytics.topics };
      topics[topicId] = { ...(topics[topicId] || defTopic()), guideRead: true };
      const analytics = pushLog({ ...d.analytics, topics }, "guide", topicId);
      return { ...d, guidesRead: { ...d.guidesRead, [topicId]: true }, streak: bumpStreak(d.streak), analytics };
    });
  }, [updateProgress]);

  const recordResult = useCallback((qid: string, correct: boolean) => {
    const topicId = lookup(qid)?.topicId;
    updateProgress((d) => {
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
  }, [updateProgress]);

  const setGoalMinutes = useCallback((minutes: number) => {
    updateProgress((d) => ({ ...d, goalMinutes: Math.max(5, Math.min(60, Math.round(minutes))) }));
  }, [updateProgress]);

  const setChallengeBest = useCallback((topicId: string, score: number) => {
    updateProgress((d) => {
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
  }, [updateProgress]);

  const touchStreak = useCallback(() => {
    updateProgress((d) => ({ ...d, streak: bumpStreak(d.streak) }));
  }, [updateProgress]);

  const setLast = useCallback((a: Omit<LastActivity, "at">) => {
    updateProgress((d) => ({ ...d, last: { ...a, at: Date.now() } }));
  }, [updateProgress]);

  const resetAll = useCallback(() => {
    if (!canSaveRef.current) return;
    const fresh = emptyProgress();
    fresh.analytics.sessionCount = dataRef.current.analytics.sessionCount;
    updateProgress(() => fresh);
  }, [updateProgress]);

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

