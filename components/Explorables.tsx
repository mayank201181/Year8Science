"use client";

// Interactive "explorables" — small widgets the learner can play with inside a
// guide. Each is registered under a key; a topic's extras map a guide-section id
// to one of these keys. All are self-contained (no network, no deps).

import { useEffect, useRef, useState } from "react";

function Frame({ title, children, caption }: { title: string; children: React.ReactNode; caption: string }) {
  return (
    <div className="my-5 rounded-2xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50/70 to-white p-4">
      <p className="mb-3 flex items-center gap-2 text-sm font-bold text-indigo-700">
        <span>🕹️</span> Try it: {title}
      </p>
      {children}
      <p className="mt-3 text-sm text-slate-600">{caption}</p>
    </div>
  );
}

function Slider({ label, min, max, value, onChange, suffix = "" }: { label: string; min: number; max: number; value: number; onChange: (n: number) => void; suffix?: string }) {
  return (
    <label className="block">
      <span className="flex items-center justify-between text-sm font-medium text-slate-700">
        <span>{label}</span>
        <span className="tabular-nums text-indigo-600">{value}{suffix}</span>
      </span>
      <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(+e.target.value)} className="mt-1 w-full accent-indigo-600" />
    </label>
  );
}

// 1) Photosynthesis rate vs light intensity ---------------------------------
function PhotosynthesisRate() {
  const [light, setLight] = useState(30);
  const plateau = 65;
  const rate = Math.round(Math.min(light, plateau) * 1.4);
  const bubbles = Math.max(0, Math.round(rate / 12));
  const limiting = light < plateau ? "Light intensity is limiting the rate — add more light and the rate climbs." : "Light is no longer the limit — now carbon dioxide or temperature caps the rate, so it plateaus.";
  // graph points
  const pts = Array.from({ length: 21 }, (_, i) => {
    const x = i * 5;
    const y = Math.min(x, plateau) * 1.4;
    return `${20 + x * 1.6},${120 - y}`;
  }).join(" ");
  return (
    <Frame title="Light and photosynthesis" caption={limiting}>
      <div className="grid gap-4 sm:grid-cols-[1fr_180px] sm:items-center">
        <div>
          <Slider label="Light intensity" min={0} max={100} value={light} onChange={setLight} suffix="%" />
          <div className="mt-3 flex items-end gap-1.5">
            <span className="text-3xl">🌱</span>
            <div className="flex flex-wrap gap-1">
              {Array.from({ length: bubbles }).map((_, i) => (
                <span key={i} className="animate-floaty text-sm" style={{ animationDelay: `${i * 0.15}s` }}>🫧</span>
              ))}
            </div>
          </div>
          <p className="mt-2 text-sm font-semibold text-emerald-700">Oxygen made: {rate} units/min</p>
        </div>
        <svg viewBox="0 0 200 140" className="w-full rounded-lg bg-white">
          <line x1="20" y1="120" x2="190" y2="120" stroke="#94a3b8" />
          <line x1="20" y1="20" x2="20" y2="120" stroke="#94a3b8" />
          <polyline points={pts} fill="none" stroke="#10b981" strokeWidth="2.5" />
          <circle cx={20 + light * 1.6} cy={120 - Math.min(light, plateau) * 1.4} r="4" fill="#059669" />
          <text x="105" y="135" fontSize="9" textAnchor="middle" fill="#64748b">light intensity →</text>
          <text x="10" y="70" fontSize="9" textAnchor="middle" fill="#64748b" transform="rotate(-90 10 70)">rate →</text>
        </svg>
      </div>
    </Frame>
  );
}

// 2) Series vs parallel circuit ---------------------------------------------
function CircuitLab() {
  const [parallel, setParallel] = useState(false);
  const [on, setOn] = useState(true);
  const brightness = !on ? 0 : parallel ? 1 : 0.45;
  const glow = (b: number) => (b === 0 ? "#cbd5e1" : b < 0.6 ? "#fde68a" : "#facc15");
  return (
    <Frame
      title="Series vs parallel"
      caption={
        !on
          ? "Switch is open — no complete circuit, so no current flows and both bulbs are off."
          : parallel
          ? "Parallel: each bulb is on its own loop and gets the full voltage, so both stay bright. Unscrew one and the other keeps glowing."
          : "Series: the bulbs share one loop and split the voltage, so both are dimmer. Break the loop anywhere and BOTH go out."
      }
    >
      <div className="flex flex-wrap items-center gap-2">
        <button onClick={() => setParallel(false)} className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${!parallel ? "bg-indigo-600 text-white" : "bg-white text-slate-600 ring-1 ring-slate-200"}`}>Series</button>
        <button onClick={() => setParallel(true)} className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${parallel ? "bg-indigo-600 text-white" : "bg-white text-slate-600 ring-1 ring-slate-200"}`}>Parallel</button>
        <button onClick={() => setOn((v) => !v)} className="ml-auto rounded-lg bg-slate-800 px-3 py-1.5 text-sm font-semibold text-white">{on ? "Open switch" : "Close switch"}</button>
      </div>
      <svg viewBox="0 0 240 120" className="mt-3 w-full rounded-lg bg-white">
        <rect x="14" y="52" width="16" height="16" fill="none" stroke="#334155" strokeWidth="2" />
        <line x1="18" y1="56" x2="26" y2="64" stroke="#334155" strokeWidth="2" />
        <text x="22" y="84" fontSize="8" textAnchor="middle" fill="#64748b">cell</text>
        {/* wires */}
        <path d={parallel ? "M30 60 H70 V30 H170 V60 M70 60 V90 H170 V60" : "M30 60 H70"} fill="none" stroke={on ? "#334155" : "#cbd5e1"} strokeWidth="2" />
        {!parallel && <path d="M70 60 H110 M150 60 H210 V60" fill="none" stroke={on ? "#334155" : "#cbd5e1"} strokeWidth="2" />}
        {parallel ? (
          <>
            <circle cx="120" cy="30" r="11" fill={glow(brightness)} stroke="#334155" />
            <circle cx="120" cy="90" r="11" fill={glow(brightness)} stroke="#334155" />
            <path d="M170 30 H210 V90 H170 M210 60 H226" fill="none" stroke={on ? "#334155" : "#cbd5e1"} strokeWidth="2" />
          </>
        ) : (
          <>
            <circle cx="120" cy="60" r="11" fill={glow(brightness)} stroke="#334155" />
            <circle cx="170" cy="60" r="11" fill={glow(brightness)} stroke="#334155" />
          </>
        )}
        {/* switch */}
        <line x1="210" y1="60" x2="226" y2={on ? 60 : 50} stroke="#334155" strokeWidth="2" />
        <path d="M226 60 V60 M14 60 H14" stroke="#334155" />
      </svg>
    </Frame>
  );
}

// 3) Reflection / refraction ray --------------------------------------------
function LightRay() {
  const [angle, setAngle] = useState(40);
  const [mode, setMode] = useState<"reflect" | "refract">("reflect");
  const rad = (angle * Math.PI) / 180;
  const cx = 120, cy = 80, L = 70;
  const ix = cx - L * Math.sin(rad), iy = cy - L * Math.cos(rad);
  // reflected: mirror across normal (vertical)
  const rx = cx + L * Math.sin(rad), ry = cy - L * Math.cos(rad);
  // refracted: bends toward normal (smaller angle) going into denser medium
  const r2 = (angle * 0.66 * Math.PI) / 180;
  const fx = cx + L * Math.sin(r2), fy = cy + L * Math.cos(r2);
  return (
    <Frame
      title="Bending light"
      caption={
        mode === "reflect"
          ? `Reflection: the angle of incidence (${angle}°) equals the angle of reflection (${angle}°) — both measured from the dotted normal, not the surface.`
          : `Refraction: entering the denser glass the ray slows and bends TOWARDS the normal, so the angle shrinks from ${angle}° to about ${Math.round(angle * 0.66)}°.`
      }
    >
      <div className="flex gap-2">
        <button onClick={() => setMode("reflect")} className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${mode === "reflect" ? "bg-indigo-600 text-white" : "bg-white text-slate-600 ring-1 ring-slate-200"}`}>Reflection</button>
        <button onClick={() => setMode("refract")} className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${mode === "refract" ? "bg-indigo-600 text-white" : "bg-white text-slate-600 ring-1 ring-slate-200"}`}>Refraction</button>
      </div>
      <div className="mt-2"><Slider label="Angle from normal" min={5} max={80} value={angle} onChange={setAngle} suffix="°" /></div>
      <svg viewBox="0 0 240 160" className="mt-2 w-full rounded-lg bg-white">
        {mode === "refract" && <rect x="0" y="80" width="240" height="80" fill="#dbeafe" />}
        <line x1="0" y1="80" x2="240" y2="80" stroke="#334155" strokeWidth={mode === "reflect" ? 3 : 1.5} />
        <line x1="120" y1="20" x2="120" y2="140" stroke="#94a3b8" strokeDasharray="4 4" />
        <line x1={ix} y1={iy} x2={cx} y2={cy} stroke="#f59e0b" strokeWidth="2.5" />
        {mode === "reflect" ? (
          <line x1={cx} y1={cy} x2={rx} y2={ry} stroke="#ef4444" strokeWidth="2.5" />
        ) : (
          <line x1={cx} y1={cy} x2={fx} y2={fy} stroke="#ef4444" strokeWidth="2.5" />
        )}
        <text x="40" y="40" fontSize="9" fill="#b45309">incoming</text>
        {mode === "reflect" ? <text x="170" y="40" fontSize="9" fill="#b91c1c">reflected</text> : <text x="150" y="135" fontSize="9" fill="#b91c1c">refracted</text>}
      </svg>
    </Frame>
  );
}

// 4) pH scale ----------------------------------------------------------------
const PH_COLORS = ["#e11d48", "#ef4444", "#f97316", "#f59e0b", "#eab308", "#facc15", "#a3e635", "#22c55e", "#16a34a", "#10b981", "#06b6d4", "#3b82f6", "#6366f1", "#7c3aed", "#6d28d9"];
const PH_EX = ["battery acid", "stomach acid", "lemon juice", "vinegar", "black coffee", "rain water", "milk", "pure water", "sea water", "baking soda", "toothpaste", "soapy water", "bleach", "oven cleaner", "drain cleaner"];
function PhSlider() {
  const [ph, setPh] = useState(7);
  const kind = ph < 7 ? "acidic" : ph > 7 ? "alkaline" : "neutral";
  return (
    <Frame title="The pH scale" caption={`pH ${ph} is ${kind}. Universal indicator turns this colour. A neutral substance (pH 7) like pure water sits right in the middle; below 7 is acid, above 7 is alkali.`}>
      <Slider label="pH value" min={0} max={14} value={ph} onChange={setPh} />
      <div className="mt-3 flex items-center gap-3">
        <div className="grid h-16 w-16 shrink-0 place-items-center rounded-xl text-2xl font-extrabold text-white shadow-inner" style={{ background: PH_COLORS[ph] }}>{ph}</div>
        <div>
          <p className="font-bold capitalize text-slate-800">{kind}</p>
          <p className="text-sm text-slate-600">e.g. {PH_EX[ph]}</p>
        </div>
      </div>
      <div className="mt-3 flex h-3 overflow-hidden rounded-full">
        {PH_COLORS.map((c, i) => (<div key={i} className="flex-1" style={{ background: c, outline: i === ph ? "2px solid #0f172a" : "none" }} />))}
      </div>
    </Frame>
  );
}

// 5) Convection current ------------------------------------------------------
function Convection() {
  const [heat, setHeat] = useState(true);
  return (
    <Frame title="Convection current" caption={heat ? "Heated water at the bottom EXPANDS, becomes less dense and RISES. Cooler, denser water sinks to take its place — a loop called a convection current." : "Turn the heat on to start the current."}>
      <button onClick={() => setHeat((v) => !v)} className="rounded-lg bg-orange-500 px-3 py-1.5 text-sm font-semibold text-white">{heat ? "🔥 Heat: ON" : "Heat: OFF"}</button>
      <svg viewBox="0 0 200 130" className="mt-3 w-full rounded-lg" style={{ background: "linear-gradient(#bfdbfe,#93c5fd)" }}>
        <rect x="20" y="20" width="160" height="100" fill="none" stroke="#1e3a8a" strokeWidth="3" />
        {heat && (
          <>
            <path d="M50 110 V40" fill="none" stroke="#ef4444" strokeWidth="2" markerEnd="url(#up)" className="animate-pulse" />
            <path d="M150 40 V110" fill="none" stroke="#2563eb" strokeWidth="2" markerEnd="url(#dn)" className="animate-pulse" />
            <path d="M50 35 H150" fill="none" stroke="#7c3aed" strokeWidth="2" />
            <path d="M150 115 H50" fill="none" stroke="#7c3aed" strokeWidth="2" />
            <defs>
              <marker id="up" markerWidth="8" markerHeight="8" refX="4" refY="6" orient="auto"><path d="M0,6 L4,0 L8,6" fill="none" stroke="#ef4444" /></marker>
              <marker id="dn" markerWidth="8" markerHeight="8" refX="4" refY="2" orient="auto"><path d="M0,2 L4,8 L8,2" fill="none" stroke="#2563eb" /></marker>
            </defs>
            <text x="58" y="75" fontSize="9" fill="#b91c1c">hot rises</text>
            <text x="120" y="75" fontSize="9" fill="#1d4ed8">cool sinks</text>
          </>
        )}
        {heat && <g className="animate-pulse"><path d="M70 122 q5 -8 10 0 M95 122 q5 -8 10 0 M120 122 q5 -8 10 0" stroke="#f97316" strokeWidth="2" fill="none" /></g>}
      </svg>
    </Frame>
  );
}

// 6) Sound wave (pitch & loudness) ------------------------------------------
function SoundWave() {
  const [freq, setFreq] = useState(4);
  const [amp, setAmp] = useState(20);
  const path = Array.from({ length: 121 }, (_, i) => {
    const x = i * 2;
    const y = 40 - amp * Math.sin((i / 120) * freq * 2 * Math.PI);
    return `${i === 0 ? "M" : "L"}${x},${y}`;
  }).join(" ");
  return (
    <Frame title="Pitch and loudness" caption={`Higher frequency = waves packed closer together = HIGHER pitch. Bigger amplitude (taller wave) = LOUDER sound. Right now: ${freq <= 3 ? "low" : freq >= 7 ? "high" : "medium"} pitch, ${amp <= 12 ? "quiet" : amp >= 28 ? "loud" : "medium"} volume.`}>
      <div className="grid gap-2 sm:grid-cols-2">
        <Slider label="Frequency (pitch)" min={1} max={10} value={freq} onChange={setFreq} />
        <Slider label="Amplitude (loudness)" min={4} max={36} value={amp} onChange={setAmp} />
      </div>
      <svg viewBox="0 0 242 80" className="mt-2 w-full rounded-lg bg-slate-900">
        <line x1="0" y1="40" x2="242" y2="40" stroke="#334155" />
        <path d={path} fill="none" stroke="#34d399" strokeWidth="2" />
      </svg>
    </Frame>
  );
}

export const EXPLORABLES: Record<string, React.FC> = {
  "photosynthesis-rate": PhotosynthesisRate,
  "circuit-lab": CircuitLab,
  "light-ray": LightRay,
  "ph-slider": PhSlider,
  "convection": Convection,
  "sound-wave": SoundWave,
};
