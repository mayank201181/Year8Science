"use client";
import { useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { TopicCramPack } from "@/lib/cram";

type SectionFilter = "all" | "mistakes" | "mustknow" | "myths" | "tricks" | "facts";

const SEL_EVENT = "y8cram-sel-change";
const CHECK_EVENT = "y8cram-check-change";

function subscribeEvent(evName: string, cb: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", cb);
  window.addEventListener(evName, cb);
  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener(evName, cb);
  };
}

function readLocal(key: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
}

function writeLocal(key: string, val: string, evName: string) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, val);
    window.dispatchEvent(new Event(evName));
  } catch {
    // ignore
  }
}

export function CramSheet({
  packs,
  singleTopicMode = false,
  subjectLabel = "Year 8",
  onPractise,
}: {
  packs: TopicCramPack[];
  singleTopicMode?: boolean;
  subjectLabel?: string;
  onPractise?: () => void;
}) {
  const params = useSearchParams();
  const urlTopicsParam = params.get("topics");

  const storageKey = `y8cram:selected:${subjectLabel.toLowerCase().replace(/\s+/g, "-")}`;
  const rawSaved = useSyncExternalStore(
    (cb) => subscribeEvent(SEL_EVENT, cb),
    () => readLocal(storageKey, ""),
    () => ""
  );

  const rawChecks = useSyncExternalStore(
    (cb) => subscribeEvent(CHECK_EVENT, cb),
    () => readLocal("y8cram:mustknow:v1", "{}"),
    () => "{}"
  );

  const checkedMap = useMemo(() => {
    try {
      return JSON.parse(rawChecks) as Record<string, boolean>;
    } catch {
      return {};
    }
  }, [rawChecks]);

  const [urlOverrideUsed, setUrlOverrideUsed] = useState(false);
  const [sectionFilter, setSectionFilter] = useState<SectionFilter>("all");
  const [query, setQuery] = useState("");

  const allIds = useMemo(() => packs.map((p) => p.id), [packs]);

  const selectedIds: Set<string> = useMemo(() => {
    if (singleTopicMode) return new Set(allIds);
    if (urlTopicsParam && !urlOverrideUsed) {
      const fromUrl = urlTopicsParam
        .split(",")
        .map((s) => s.trim())
        .filter((id) => allIds.includes(id));
      if (fromUrl.length) return new Set(fromUrl);
    }
    if (rawSaved !== "") {
      try {
        const parsed = JSON.parse(rawSaved) as string[];
        if (Array.isArray(parsed)) {
          return new Set(parsed.filter((id) => allIds.includes(id)));
        }
      } catch {
        // ignore
      }
    }
    return new Set(allIds);
  }, [singleTopicMode, allIds, urlTopicsParam, urlOverrideUsed, rawSaved]);

  const updateSelection = (next: Set<string>) => {
    setUrlOverrideUsed(true);
    writeLocal(storageKey, JSON.stringify(Array.from(next)), SEL_EVENT);
  };

  const toggleTopic = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    updateSelection(next);
  };

  const selectStrand = (strand: string) => {
    const strandIds = packs.filter((p) => p.strand === strand).map((p) => p.id);
    const allIn = strandIds.every((id) => selectedIds.has(id));
    if (allIn && selectedIds.size > strandIds.length) {
      const next = new Set(selectedIds);
      strandIds.forEach((id) => next.delete(id));
      updateSelection(next);
    } else {
      updateSelection(new Set(strandIds));
    }
  };

  const toggleMustKnow = (key: string) => {
    const next = { ...checkedMap, [key]: !checkedMap[key] };
    writeLocal("y8cram:mustknow:v1", JSON.stringify(next), CHECK_EVENT);
  };

  const strands = useMemo(() => Array.from(new Set(packs.map((p) => p.strand).filter(Boolean))), [packs]);

  const qNorm = query.trim().toLowerCase();
  const visiblePacks = useMemo(() => {
    return packs.filter((p) => {
      if (!selectedIds.has(p.id)) return false;
      if (!qNorm) return true;
      const hay = [
        p.title,
        p.strand,
        ...p.examMistakes,
        ...p.mustKnow,
        ...p.misconceptions.flatMap((m) => [m.wrong, m.right]),
        ...p.mnemonics.flatMap((m) => [m.topic, m.device, m.explanation]),
        ...p.keyFacts.flatMap((f) => [f.name, f.value]),
        ...p.questionTraps.flatMap((t) => [t.question, t.commonError]),
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(qNorm);
    });
  }, [packs, selectedIds, qNorm]);

  const totalMistakes = visiblePacks.reduce((s, p) => s + p.examMistakes.length + p.questionTraps.length, 0);
  const totalMustKnow = visiblePacks.reduce((s, p) => s + p.mustKnow.length, 0);

  return (
    <div className={singleTopicMode ? "space-y-6 pb-8" : "mx-auto max-w-6xl space-y-6 px-4 py-6 pb-28"}>
      {!singleTopicMode ? (
        <header className="space-y-4 rounded-3xl border border-rose-200 bg-gradient-to-br from-rose-50 via-white to-amber-50 p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-700">
                  🚨 {totalMistakes} Exam Traps &amp; Mark-Losers
                </span>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                  ✅ {totalMustKnow} Exam Must-Knows
                </span>
              </div>
              <h1 className="mt-2 text-2xl font-extrabold text-slate-900 sm:text-3xl">
                {subjectLabel} — Custom Exam Cram Sheet
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                Have an upcoming test on just 3 or 4 topics? Tick <strong>only the topics in your test</strong> below — your custom cram sheet updates immediately and saves on this iPad!
              </p>
            </div>
            <button
              type="button"
              onClick={() => window.print()}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 print:hidden"
            >
              🖨️ Print / Save PDF
            </button>
          </div>

          <div className="space-y-3 rounded-2xl border border-slate-200 bg-white/90 p-4 print:hidden">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                1. Pick Topics in Your Upcoming Test ({selectedIds.size} of {packs.length} selected)
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => updateSelection(new Set(allIds))}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700"
                >
                  Select all ({packs.length})
                </button>
                <button
                  type="button"
                  onClick={() => updateSelection(new Set())}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700"
                >
                  Clear all
                </button>
                {strands.map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => selectStrand(st)}
                    className="rounded-lg border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700 hover:bg-indigo-100"
                  >
                    Only {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {packs.map((p) => {
                const active = selectedIds.has(p.id);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => toggleTopic(p.id)}
                    className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition ${
                      active
                        ? "border-indigo-600 bg-indigo-600 text-white shadow-sm"
                        : "border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:text-slate-900"
                    }`}
                  >
                    <span aria-hidden>{p.icon}</span>
                    <span>{p.title}</span>
                    {active ? <span aria-hidden>✓</span> : null}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
            <div className="flex flex-wrap gap-1.5">
              {(
                [
                  ["all", "All Exam Notes"],
                  ["mistakes", "⚠️ What Loses Marks"],
                  ["mustknow", "✅ What Earns Marks"],
                  ["myths", "🕵️ Myth vs Fact"],
                  ["tricks", "🧩 Memory Tricks"],
                  ["facts", "📖 Key Facts"],
                ] as [SectionFilter, string][]
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setSectionFilter(id)}
                  className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
                    sectionFilter === id
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter keywords across selected topics…"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-800 sm:w-64"
            />
          </div>
        </header>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-rose-200 bg-rose-50/60 p-4">
          <div>
            <div className="text-xs font-extrabold uppercase tracking-wider text-rose-700">
              🚨 Rapid Pre-Test Cram &amp; Mark-Saver Sheet
            </div>
            <p className="text-sm text-slate-600">
              Everything examiners reward — and every trap that loses easy marks in <strong>{packs[0]?.title}</strong>.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 print:hidden">
            <Link
              href={`/cram?topics=${packs[0]?.id ?? ""}`}
              className="rounded-xl border border-indigo-200 bg-white px-3.5 py-2 text-xs font-bold text-indigo-700 hover:bg-indigo-50"
            >
              ➕ Combine 3–4 Topics for a Test
            </Link>
            <button
              type="button"
              onClick={() => window.print()}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              🖨️ Print
            </button>
          </div>
        </div>
      )}

      {visiblePacks.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-600 shadow-sm">
          <div className="text-3xl" aria-hidden>📋</div>
          <p className="mt-2 font-bold text-slate-900">No topics selected yet</p>
          <p className="mt-1 text-sm">Tap any 1, 3, or 4 topic pills above to build your custom test cram sheet.</p>
        </div>
      ) : null}
      <div className="space-y-8">
        {visiblePacks.map((pack) => (
          <article key={pack.id} className="space-y-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-indigo-50 text-2xl" aria-hidden>
                  {pack.icon}
                </span>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">{pack.strand}</span>
                  <h2 className="text-xl font-extrabold text-slate-900 sm:text-2xl">{pack.title}</h2>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 print:hidden">
                {!singleTopicMode ? (
                  <Link
                    href={`/topic/${pack.id}?tab=guide`}
                    className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                  >
                    📖 Full Guide
                  </Link>
                ) : null}
                {onPractise ? (
                  <button
                    type="button"
                    onClick={onPractise}
                    className="rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-indigo-700"
                  >
                    📝 Practice Papers
                  </button>
                ) : (
                  <Link
                    href={`/topic/${pack.id}?tab=papers`}
                    className="rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-indigo-700"
                  >
                    📝 Practice Papers
                  </Link>
                )}
              </div>
            </div>

            {(sectionFilter === "all" || sectionFilter === "mistakes") &&
            (pack.examMistakes.length > 0 || pack.questionTraps.length > 0) ? (
              <section className="space-y-3 break-inside-avoid">
                <h3 className="flex items-center gap-2 text-base font-extrabold text-rose-700">
                  <span aria-hidden>⚠️</span> What Loses Marks in Exams (Avoid These Traps!)
                </h3>
                {pack.examMistakes.length > 0 ? (
                  <ul className="grid gap-2.5 sm:grid-cols-2">
                    {pack.examMistakes.map((m, i) => (
                      <li key={i} className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-900">
                        <span className="mt-0.5 shrink-0 font-black text-rose-600" aria-hidden>✗</span>
                        <span>{m}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}

                {pack.questionTraps.length > 0 ? (
                  <div className="space-y-2 pt-1">
                    <div className="text-xs font-extrabold uppercase tracking-wider text-amber-700">
                      🪤 Real Written-Paper Mark Losers
                    </div>
                    <div className="grid gap-2.5 sm:grid-cols-2">
                      {pack.questionTraps.map((qt, i) => (
                        <div key={i} className="rounded-xl border border-amber-200 bg-amber-50/60 p-3 text-xs">
                          <div className="font-bold text-slate-700">When asked: {qt.question}</div>
                          <div className="mt-1 font-semibold text-rose-700">⚠️ Marks lost if: {qt.commonError}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </section>
            ) : null}

            {(sectionFilter === "all" || sectionFilter === "mustknow") && pack.mustKnow.length > 0 ? (
              <section className="space-y-2.5 break-inside-avoid">
                <h3 className="flex items-center gap-2 text-base font-extrabold text-emerald-700">
                  <span aria-hidden>✅</span> What Examiners Award Marks For (&ldquo;Can You…?&rdquo;)
                </h3>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {pack.mustKnow.map((mk, i) => {
                    const ck = `${pack.id}:${i}`;
                    const isDone = !!checkedMap[ck];
                    return (
                      <li key={i}>
                        <label className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-800 hover:bg-slate-50 has-checked:border-emerald-300 has-checked:bg-emerald-50">
                          <input
                            type="checkbox"
                            checked={isDone}
                            onChange={() => toggleMustKnow(ck)}
                            className="mt-0.5 h-4 w-4 shrink-0 accent-emerald-600"
                          />
                          <span>{mk}</span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ) : null}

            {(sectionFilter === "all" || sectionFilter === "myths") && pack.misconceptions.length > 0 ? (
              <section className="space-y-2.5 break-inside-avoid">
                <h3 className="flex items-center gap-2 text-base font-extrabold text-slate-900">
                  <span aria-hidden>🕵️</span> Don&apos;t Write This → Write This Instead
                </h3>
                <div className="space-y-2.5">
                  {pack.misconceptions.map((m, i) => (
                    <div key={i} className="grid overflow-hidden rounded-xl border border-slate-200 sm:grid-cols-2">
                      <div className="bg-rose-50 p-3 text-sm text-rose-900">
                        <div className="text-[11px] font-black uppercase tracking-wider text-rose-700">✗ Loses the mark</div>
                        <p className="mt-0.5">{m.wrong}</p>
                      </div>
                      <div className="bg-emerald-50 p-3 text-sm text-emerald-900">
                        <div className="text-[11px] font-black uppercase tracking-wider text-emerald-700">✓ Earns the mark</div>
                        <p className="mt-0.5 font-semibold">{m.right}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            {(sectionFilter === "all" || sectionFilter === "tricks") && pack.mnemonics.length > 0 ? (
              <section className="space-y-2.5 break-inside-avoid">
                <h3 className="flex items-center gap-2 text-base font-extrabold text-slate-900">
                  <span aria-hidden>🧩</span> Exam Memory Tricks &amp; Mnemonics
                </h3>
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {pack.mnemonics.map((m, i) => (
                    <div key={i} className="rounded-xl border border-amber-200 bg-amber-50/50 p-3.5 text-sm">
                      <div className="text-xs font-bold text-amber-800">{m.topic}</div>
                      <div className="my-1 text-base font-black text-slate-900">&ldquo;{m.device}&rdquo;</div>
                      <div className="text-xs text-slate-600">{m.explanation}</div>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            {(sectionFilter === "all" || sectionFilter === "facts") && pack.keyFacts.length > 0 ? (
              <section className="space-y-2.5 break-inside-avoid">
                <h3 className="flex items-center gap-2 text-base font-extrabold text-slate-900">
                  <span aria-hidden>📖</span> Must-Memorise Key Points
                </h3>
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {pack.keyFacts.map((f, i) => (
                    <div key={i} className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-sm">
                      <div className="text-xs font-extrabold text-indigo-700">{f.name}</div>
                      <p className="mt-0.5 text-sm font-medium text-slate-800">{f.value}</p>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}
          </article>
        ))}
      </div>
    </div>
  );
}
