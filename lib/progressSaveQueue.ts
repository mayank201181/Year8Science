/** Each save binds its immutable payload to the account and learner that produced it. */
export interface ProgressSaveSnapshot {
  accountId: string;
  profileId: string;
  body: string;
  cacheKey: string;
  revision: string;
}
interface TimerApi {
  set: (callback: () => void, delay: number) => ReturnType<typeof setTimeout>;
  clear: (timer: ReturnType<typeof setTimeout>) => void;
}
/** Wrapped, not `{ set: setTimeout }`: browsers throw "Illegal invocation" when
 * window timers are called as methods of another object. */
const browserTimers: TimerApi = {
  set: (callback, delay) => setTimeout(callback, delay),
  clear: (timer) => clearTimeout(timer),
};
export function createProgressSaveQueue(
  send: (snapshot: ProgressSaveSnapshot) => Promise<void>,
  delay: number,
  timers: TimerApi = browserTimers,
) {
  let pending: ProgressSaveSnapshot | null = null;
  let timer: ReturnType<typeof setTimeout> | null = null;
  let tail: Promise<void> = Promise.resolve();
  let generation = 0;
  function flush(): Promise<void> {
    if (timer !== null) timers.clear(timer);
    timer = null;
    const snapshot = pending;
    pending = null;
    if (!snapshot) return tail;
    const currentGeneration = generation;
    const request = tail.then(() => {
      if (currentGeneration === generation) return send(snapshot);
    });
    tail = request.catch(() => {}); // Keep the queue usable after a failed save.
    return request;
  }
  function schedule(snapshot: ProgressSaveSnapshot) {
    // A different learner must not replace another learner's queued save.
    if (pending && (pending.accountId !== snapshot.accountId || pending.profileId !== snapshot.profileId)) {
      void flush().catch(() => {});
    }
    pending = { ...snapshot };
    if (timer !== null) timers.clear(timer);
    timer = timers.set(() => { void flush().catch(() => {}); }, delay);
  }
  function cancel() {
    generation++;
    if (timer !== null) timers.clear(timer);
    timer = null;
    pending = null;
  }
  return { schedule, flush, cancel };
}

/** Keep a stalled request from blocking profile switching or sign-out indefinitely. */
export async function withProgressTimeout<T>(request: (signal: AbortSignal) => Promise<T>, timeoutMs = 10000): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await request(controller.signal);
  } finally {
    clearTimeout(timeout);
  }
}
