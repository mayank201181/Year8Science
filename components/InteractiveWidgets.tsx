"use client";

// Extra interactive "explorables" — parameter-driven widgets where the learner
// changes inputs and watches the output change. Combined with the originals
// into EXPLORABLES_ALL for the per-topic Interactive tab.

import { useState } from "react";
import { EXPLORABLES } from "./Explorables";

function Frame({ title, children, caption }: { title: string; children: React.ReactNode; caption: string }) {
  return (
    <div className="my-3 rounded-2xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50/70 to-white p-4">
      <p className="mb-3 flex items-center gap-2 text-sm font-bold text-indigo-700"><span>🕹️</span> {title}</p>
      {children}
      <p className="mt-3 text-sm text-slate-600">{caption}</p>
    </div>
  );
}

function Stepper({ label, value, min, max, onChange, color = "#4f46e5" }: { label: string; value: number; min: number; max: number; onChange: (n: number) => void; color?: string }) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm font-medium text-slate-700">
        <span>{label}</span>
        <div className="flex items-center gap-2">
          <button onClick={() => onChange(Math.max(min, value - 1))} className="grid h-7 w-7 place-items-center rounded-lg bg-white font-bold text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50">−</button>
          <span className="w-8 text-center text-base font-bold tabular-nums" style={{ color }}>{value}</span>
          <button onClick={() => onChange(Math.min(max, value + 1))} className="grid h-7 w-7 place-items-center rounded-lg bg-white font-bold text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50">+</button>
        </div>
      </div>
      <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(+e.target.value)} className="mt-1 w-full" style={{ accentColor: color }} />
    </div>
  );
}

// ---- 1) Atom & Element builder (the marquee widget) -----------------------
const ELEMENTS: [string, string][] = [
  ["H", "Hydrogen"], ["He", "Helium"], ["Li", "Lithium"], ["Be", "Beryllium"], ["B", "Boron"],
  ["C", "Carbon"], ["N", "Nitrogen"], ["O", "Oxygen"], ["F", "Fluorine"], ["Ne", "Neon"],
  ["Na", "Sodium"], ["Mg", "Magnesium"], ["Al", "Aluminium"], ["Si", "Silicon"], ["P", "Phosphorus"],
  ["S", "Sulfur"], ["Cl", "Chlorine"], ["Ar", "Argon"], ["K", "Potassium"], ["Ca", "Calcium"],
];
const NONMETAL = new Set([1, 2, 6, 7, 8, 9, 10, 15, 16, 17, 18]);
const METALLOID = new Set([5, 14]);

function shells(electrons: number): number[] {
  const cap = [2, 8, 8, 2];
  const out: number[] = [];
  let rem = electrons;
  for (const c of cap) {
    if (rem <= 0) break;
    const n = Math.min(rem, c);
    out.push(n);
    rem -= n;
  }
  return out;
}

function AtomBuilder() {
  const [p, setP] = useState(6);
  const [n, setN] = useState(6);
  const [e, setE] = useState(6);
  const [sym, name] = ELEMENTS[p - 1];
  const mass = p + n;
  const charge = p - e;
  const kind = NONMETAL.has(p) ? "non-metal" : METALLOID.has(p) ? "metalloid" : "metal";
  const ion = charge === 0 ? "neutral atom" : charge > 0 ? `${charge}+ ion (cation)` : `${Math.abs(charge)}− ion (anion)`;
  const sh = shells(e);
  const caption =
    charge === 0
      ? `A neutral ${name} atom: ${p} protons balanced by ${e} electrons, so no overall charge. Change the protons and the element itself changes!`
      : `Same element (${p} protons = ${name}), but electrons ≠ protons, so it's now an ION with a ${Math.abs(charge)}${charge > 0 ? "+" : "−"} charge. Protons decide the element; electrons decide the charge.`;

  return (
    <Frame title="Build an atom" caption={caption}>
      <div className="grid gap-4 sm:grid-cols-[200px_1fr] sm:items-center">
        {/* Bohr model */}
        <svg viewBox="0 0 200 200" className="mx-auto w-44 rounded-xl bg-slate-900">
          {sh.map((cnt, i) => {
            const r = 30 + i * 22;
            return <circle key={`r${i}`} cx="100" cy="100" r={r} fill="none" stroke="#334155" strokeWidth="1" />;
          })}
          {sh.map((cnt, i) => {
            const r = 30 + i * 22;
            return Array.from({ length: cnt }).map((_, j) => {
              const a = (j / cnt) * 2 * Math.PI - Math.PI / 2;
              return <circle key={`e${i}-${j}`} cx={100 + r * Math.cos(a)} cy={100 + r * Math.sin(a)} r="3.5" fill="#38bdf8" />;
            });
          })}
          <circle cx="100" cy="100" r="20" fill="#f43f5e" />
          <text x="100" y="97" fontSize="11" fontWeight="bold" textAnchor="middle" fill="white">{p}p</text>
          <text x="100" y="110" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#fecdd3">{n}n</text>
        </svg>

        {/* result card */}
        <div>
          <div className="flex items-center gap-3">
            <div className="grid h-16 w-16 place-items-center rounded-xl bg-indigo-600 text-white">
              <div className="text-center leading-none">
                <div className="text-[10px]">{mass}</div>
                <div className="text-2xl font-extrabold">{sym}</div>
                <div className="text-[10px]">{p}</div>
              </div>
            </div>
            <div>
              <p className="text-lg font-extrabold text-slate-900">{name}</p>
              <p className="text-sm capitalize text-slate-500">{kind} · mass number {mass}</p>
            </div>
          </div>
          <p className={`mt-2 inline-block rounded-full px-3 py-1 text-sm font-bold ${charge === 0 ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{ion}</p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <Stepper label="Protons (element)" value={p} min={1} max={20} onChange={(v) => setP(v)} color="#f43f5e" />
        <Stepper label="Neutrons (mass)" value={n} min={0} max={25} onChange={setN} color="#64748b" />
        <Stepper label="Electrons (charge)" value={e} min={0} max={25} onChange={setE} color="#38bdf8" />
      </div>
      <button onClick={() => setE(p)} className="mt-3 rounded-lg bg-slate-800 px-3 py-1.5 text-sm font-semibold text-white hover:bg-slate-700">Make it a neutral atom</button>
    </Frame>
  );
}

// ---- 2) Molecule builder --------------------------------------------------
const MOLECULES: Record<string, [string, string, "element" | "compound"]> = {
  "0-2-0": ["H₂", "Hydrogen gas", "element"],
  "0-0-2": ["O₂", "Oxygen gas", "element"],
  "1-0-0": ["C", "Carbon", "element"],
  "0-2-1": ["H₂O", "Water", "compound"],
  "1-0-2": ["CO₂", "Carbon dioxide", "compound"],
  "1-4-0": ["CH₄", "Methane", "compound"],
  "1-0-1": ["CO", "Carbon monoxide", "compound"],
};
function MoleculeBuilder() {
  const [c, setC] = useState(1);
  const [h, setH] = useState(0);
  const [o, setO] = useState(2);
  const hit = MOLECULES[`${c}-${h}-${o}`];
  const types = [c > 0, h > 0, o > 0].filter(Boolean).length;
  const classify = types >= 2 ? "compound" : types === 1 ? "element" : "nothing yet";
  const atoms = [
    ...Array(c).fill(["#334155", "C"]),
    ...Array(o).fill(["#ef4444", "O"]),
    ...Array(h).fill(["#cbd5e1", "H"]),
  ] as [string, string][];
  return (
    <Frame
      title="Build a molecule"
      caption={
        hit
          ? `You made ${hit[1]} (${hit[0]}) — a ${hit[2]}. ${hit[2] === "element" ? "Only one kind of atom → it's an element." : "More than one kind of atom joined together → it's a compound."}`
          : `These atoms (${classify}) don't form a common molecule. Try 2×H + 1×O = water, or 1×C + 2×O = carbon dioxide.`
      }
    >
      <div className="grid min-h-[72px] place-items-center rounded-xl bg-white p-3">
        <div className="flex flex-wrap items-center justify-center gap-1.5">
          {atoms.length === 0 && <span className="text-sm text-slate-400">add some atoms…</span>}
          {atoms.map(([col, lab], i) => (
            <span key={i} className="grid h-9 w-9 place-items-center rounded-full text-xs font-bold text-white shadow" style={{ background: col, color: lab === "H" ? "#334155" : "white" }}>{lab}</span>
          ))}
        </div>
      </div>
      {hit && <p className="mt-2 text-center text-xl font-extrabold text-slate-900">{hit[0]} — {hit[1]}</p>}
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <Stepper label="Carbon (C)" value={c} min={0} max={3} onChange={setC} color="#334155" />
        <Stepper label="Hydrogen (H)" value={h} min={0} max={4} onChange={setH} color="#94a3b8" />
        <Stepper label="Oxygen (O)" value={o} min={0} max={4} onChange={setO} color="#ef4444" />
      </div>
    </Frame>
  );
}

// ---- 3) Reaction rate (collision theory) ----------------------------------
function ReactionRate() {
  const [temp, setTemp] = useState(40);
  const [conc, setConc] = useState(5);
  const rate = Math.round((temp / 12 + conc) * 4);
  const speed = rate < 25 ? "slow" : rate < 45 ? "medium" : "fast";
  const particles = Math.min(30, 6 + conc * 2);
  return (
    <Frame title="Speed up a reaction" caption={`Higher temperature makes particles move faster, and higher concentration packs more particles in — both cause MORE collisions per second, so the reaction goes ${speed}. This is collision theory.`}>
      <svg viewBox="0 0 240 90" className="w-full rounded-lg bg-slate-900">
        {Array.from({ length: particles }).map((_, i) => {
          const x = 12 + ((i * 53) % 220);
          const y = 12 + ((i * 37) % 66);
          return <circle key={i} cx={x} cy={y} r={3 + temp / 50} fill={i % 2 ? "#34d399" : "#60a5fa"} />;
        })}
      </svg>
      <p className="mt-2 text-center text-sm font-bold text-slate-700">Reaction speed: <span className={speed === "fast" ? "text-emerald-600" : speed === "slow" ? "text-rose-600" : "text-amber-600"}>{speed}</span> ({rate} collisions/sec)</p>
      <div className="mt-2 grid gap-3 sm:grid-cols-2">
        <Stepper label="Temperature" value={temp} min={0} max={100} onChange={setTemp} color="#f97316" />
        <Stepper label="Concentration" value={conc} min={1} max={10} onChange={setConc} color="#22c55e" />
      </div>
    </Frame>
  );
}

// ---- 4) Respiration / exercise lab ----------------------------------------
function RespirationLab() {
  const [effort, setEffort] = useState(20);
  const anaerobic = effort > 70;
  const heart = Math.round(60 + effort * 1.3);
  const breaths = Math.round(12 + effort * 0.4);
  return (
    <Frame
      title="Exercise & respiration"
      caption={
        anaerobic
          ? `Sprinting! Your muscles need energy faster than oxygen can arrive, so they switch to ANAEROBIC respiration: glucose → lactic acid (+ a little energy). That lactic acid is the burn you feel.`
          : `At this effort your cells get enough oxygen for AEROBIC respiration: glucose + oxygen → carbon dioxide + water (+ lots of energy). Heart and breathing rates rise to deliver more oxygen.`
      }
    >
      <div className="flex items-center justify-between rounded-xl bg-white p-3 text-center">
        <div><div className="text-2xl font-extrabold text-rose-600">{heart}</div><div className="text-xs text-slate-500">heart bpm</div></div>
        <div className="text-3xl">{effort < 30 ? "🧍" : effort < 70 ? "🚶" : "🏃"}</div>
        <div><div className="text-2xl font-extrabold text-sky-600">{breaths}</div><div className="text-xs text-slate-500">breaths/min</div></div>
        <div><div className={`text-sm font-extrabold ${anaerobic ? "text-amber-600" : "text-emerald-600"}`}>{anaerobic ? "ANAEROBIC" : "AEROBIC"}</div><div className="text-xs text-slate-500">respiration</div></div>
      </div>
      <p className="mt-2 rounded-lg bg-slate-50 p-2 text-center text-xs font-medium text-slate-600">{anaerobic ? "glucose → lactic acid (+ little energy)" : "glucose + oxygen → carbon dioxide + water (+ energy)"}</p>
      <div className="mt-2"><Stepper label="Effort level" value={effort} min={0} max={100} onChange={setEffort} color="#e11d48" /></div>
    </Frame>
  );
}

// ---- 5) Breathing mechanics -----------------------------------------------
function BreathingLab() {
  const [inhaling, setInhaling] = useState(true);
  const [rate, setRate] = useState(15);
  const litres = (rate * 0.5).toFixed(1);
  return (
    <Frame
      title="How breathing works"
      caption={
        inhaling
          ? `Breathing IN: the diaphragm pulls DOWN and flattens, the ribcage lifts, so the chest gets bigger. That lowers the pressure inside, and air rushes in (carrying oxygen).`
          : `Breathing OUT: the diaphragm relaxes UP into a dome, the chest gets smaller, pressure rises, and air is pushed out (carrying carbon dioxide).`
      }
    >
      <div className="flex items-center gap-4">
        <svg viewBox="0 0 120 130" className="w-28 rounded-lg bg-sky-50">
          <path d="M60 18 V40" stroke="#475569" strokeWidth="3" />
          <ellipse cx="42" cy={inhaling ? 78 : 66} rx={inhaling ? 20 : 15} ry={inhaling ? 30 : 22} fill="#fca5a5" />
          <ellipse cx="78" cy={inhaling ? 78 : 66} rx={inhaling ? 20 : 15} ry={inhaling ? 30 : 22} fill="#fca5a5" />
          <path d={inhaling ? "M20 110 Q60 116 100 110" : "M20 104 Q60 84 100 104"} stroke="#1d4ed8" strokeWidth="4" fill="none" />
          <text x="60" y="126" fontSize="8" textAnchor="middle" fill="#1e3a8a">diaphragm</text>
        </svg>
        <div className="flex-1">
          <button onClick={() => setInhaling((v) => !v)} className="rounded-lg bg-sky-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-sky-700">{inhaling ? "🫁 Breathe in (tap to switch)" : "💨 Breathe out (tap to switch)"}</button>
          <p className="mt-2 text-sm text-slate-600">Air moved: <span className="font-bold text-sky-700">{litres} L/min</span></p>
        </div>
      </div>
      <div className="mt-2"><Stepper label="Breathing rate (breaths/min)" value={rate} min={6} max={40} onChange={setRate} color="#0284c7" /></div>
    </Frame>
  );
}

// ---- 6) Digestion: nutrient journey ---------------------------------------
const NUTRIENTS: Record<string, { emoji: string; enzyme: string; where: string; into: string }> = {
  Carbohydrate: { emoji: "🍞", enzyme: "amylase", where: "mouth + small intestine", into: "simple sugars (glucose)" },
  Protein: { emoji: "🥚", enzyme: "protease (pepsin)", where: "stomach + small intestine", into: "amino acids" },
  Fat: { emoji: "🧈", enzyme: "lipase (+ bile)", where: "small intestine", into: "fatty acids + glycerol" },
};
function DigestionLab() {
  const [food, setFood] = useState<keyof typeof NUTRIENTS>("Carbohydrate");
  const d = NUTRIENTS[food];
  return (
    <Frame title="Digesting your food" caption={`${food}s are broken down by the enzyme ${d.enzyme} in the ${d.where}, ending up as ${d.into} — small enough to be absorbed into the blood.`}>
      <div className="flex gap-2">
        {(Object.keys(NUTRIENTS) as (keyof typeof NUTRIENTS)[]).map((k) => (
          <button key={k} onClick={() => setFood(k)} className={`flex-1 rounded-lg px-2 py-2 text-sm font-semibold ${food === k ? "bg-emerald-600 text-white" : "bg-white text-slate-600 ring-1 ring-slate-200"}`}>
            {NUTRIENTS[k].emoji} {k}
          </button>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between gap-2 text-center text-sm">
        <div className="flex-1 rounded-lg bg-white p-2"><div className="text-2xl">{d.emoji}</div><div className="text-xs text-slate-500">{food}</div></div>
        <div className="text-slate-400">→</div>
        <div className="flex-1 rounded-lg bg-amber-50 p-2"><div className="font-bold text-amber-700">{d.enzyme}</div><div className="text-xs text-slate-500">{d.where}</div></div>
        <div className="text-slate-400">→</div>
        <div className="flex-1 rounded-lg bg-emerald-50 p-2"><div className="font-bold text-emerald-700">{d.into}</div><div className="text-xs text-slate-500">absorbed</div></div>
      </div>
    </Frame>
  );
}

// ---- 7) Forces: resultant force ------------------------------------------
function ForcesLab() {
  const [left, setLeft] = useState(6);
  const [right, setRight] = useState(6);
  const res = right - left;
  const balanced = res === 0;
  const dir = res > 0 ? "right" : "left";
  const caption = balanced
    ? "The forces are balanced (resultant = 0 N). The object stays still, or keeps moving at a steady speed — its motion does not change."
    : `Unbalanced! There's a resultant force of ${Math.abs(res)} N to the ${dir}, so the object accelerates (speeds up) to the ${dir}. Bigger resultant → bigger acceleration.`;
  return (
    <Frame title="Balanced vs unbalanced forces" caption={caption}>
      <svg viewBox="0 0 240 80" className="w-full rounded-lg bg-slate-900">
        <rect x="100" y="28" width="40" height="28" rx="3" fill="#fbbf24" />
        {left > 0 && <line x1={100} y1="42" x2={100 - left * 4} y2="42" stroke="#f87171" strokeWidth="4" markerEnd="url(#al)" />}
        {right > 0 && <line x1={140} y1="42" x2={140 + right * 4} y2="42" stroke="#34d399" strokeWidth="4" markerEnd="url(#ar)" />}
        <defs>
          <marker id="al" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M8,0 L0,4 L8,8" fill="#f87171" /></marker>
          <marker id="ar" markerWidth="8" markerHeight="8" refX="2" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8" fill="#34d399" /></marker>
        </defs>
        <text x="120" y="72" fontSize="9" textAnchor="middle" fill="#94a3b8">{balanced ? "balanced — no change in motion" : `resultant ${Math.abs(res)} N → ${dir}`}</text>
      </svg>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <Stepper label="Push left (N)" value={left} min={0} max={20} onChange={setLeft} color="#ef4444" />
        <Stepper label="Push right (N)" value={right} min={0} max={20} onChange={setRight} color="#10b981" />
      </div>
    </Frame>
  );
}

// ---- 8) Energy stores & transfers ----------------------------------------
const SCENARIOS: { emoji: string; label: string; stores: string; transfer: string }[] = [
  { emoji: "🚗", label: "Moving car", stores: "kinetic (+ chemical in fuel)", transfer: "chemical store (fuel) → kinetic store, by heating & mechanically" },
  { emoji: "🏹", label: "Stretched bow", stores: "elastic potential", transfer: "elastic store → kinetic store of the arrow (mechanically)" },
  { emoji: "☕", label: "Hot drink", stores: "thermal (internal)", transfer: "thermal store of the drink → thermal store of the room (by heating)" },
  { emoji: "🔦", label: "Battery torch", stores: "chemical → electrical", transfer: "chemical store → (electrically) → light + thermal stores" },
  { emoji: "⬆️", label: "Ball held up high", stores: "gravitational potential", transfer: "gravitational store → kinetic store as it falls" },
  { emoji: "💨", label: "Wind turbine", stores: "kinetic → electrical", transfer: "kinetic store of the wind → electrical (generator, mechanically)" },
  { emoji: "☀️", label: "The Sun", stores: "nuclear", transfer: "nuclear store → radiation (light) → thermal store of the Earth" },
  { emoji: "🧲", label: "Two magnets", stores: "magnetic", transfer: "magnetic store → kinetic store as they snap together" },
];
function EnergyStores() {
  const [i, setI] = useState(0);
  const s = SCENARIOS[i];
  return (
    <Frame title="Energy stores & transfers" caption={`${s.label}: energy is held in the ${s.stores} store(s). Transfer: ${s.transfer}. Remember — energy is never created or destroyed, only shifted between stores (measured in joules, J).`}>
      <div className="flex flex-wrap gap-2">
        {SCENARIOS.map((sc, idx) => (
          <button key={idx} onClick={() => setI(idx)} className={`rounded-lg px-2.5 py-1.5 text-sm font-semibold ${i === idx ? "bg-indigo-600 text-white" : "bg-white text-slate-600 ring-1 ring-slate-200"}`}>
            {sc.emoji} {sc.label}
          </button>
        ))}
      </div>
      <div className="mt-3 rounded-xl bg-white p-4 text-center">
        <div className="text-4xl">{s.emoji}</div>
        <p className="mt-2 font-bold text-indigo-700">{s.stores}</p>
        <p className="mt-1 text-sm text-slate-600">{s.transfer}</p>
      </div>
    </Frame>
  );
}

export const EXPLORABLES_ALL: Record<string, React.FC> = {
  ...EXPLORABLES,
  "forces-lab": ForcesLab,
  "energy-stores": EnergyStores,
  "atom-builder": AtomBuilder,
  "molecule-builder": MoleculeBuilder,
  "reaction-rate": ReactionRate,
  "respiration-lab": RespirationLab,
  "breathing-lab": BreathingLab,
  "digestion-lab": DigestionLab,
};
