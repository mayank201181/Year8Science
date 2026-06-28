import type { Subject } from "../types";

export interface TopicMeta {
  id: string;
  title: string;
  subject: Subject;
  icon: string;
  summary: string;
  /** Soft accent colour used on cards (tailwind class fragments). */
  accent: string;
}

// The full Year 8 science curriculum, four topics per science.
// Order here is the order shown on the home page.
export const TOPIC_META: TopicMeta[] = [
  // Biology
  { id: "photosynthesis", title: "Plants & Photosynthesis", subject: "Biology", icon: "🌱", summary: "How green plants make their own food from light.", accent: "emerald" },
  { id: "respiration", title: "Respiration", subject: "Biology", icon: "🫁", summary: "How living cells release energy from glucose.", accent: "emerald" },
  { id: "breathing", title: "Breathing & Gas Exchange", subject: "Biology", icon: "🌬️", summary: "How the lungs swap oxygen and carbon dioxide.", accent: "emerald" },
  { id: "digestion", title: "Food & Digestion", subject: "Biology", icon: "🍎", summary: "A balanced diet and how the gut breaks down food.", accent: "emerald" },
  // Chemistry
  { id: "periodic-table", title: "The Periodic Table", subject: "Chemistry", icon: "⚛️", summary: "How elements are organised into groups and periods.", accent: "violet" },
  { id: "elements-compounds-mixtures", title: "Elements, Compounds & Mixtures", subject: "Chemistry", icon: "🧪", summary: "The building blocks of all matter and how to separate them.", accent: "violet" },
  { id: "chemical-reactions", title: "Chemical Reactions", subject: "Chemistry", icon: "🔥", summary: "How new substances form, and the signs of a reaction.", accent: "violet" },
  { id: "acids-metals", title: "Acids, Bases & Metals", subject: "Chemistry", icon: "⚗️", summary: "The pH scale, neutralisation and the reactivity series.", accent: "violet" },
  // Physics
  { id: "heat", title: "Heat & Temperature", subject: "Physics", icon: "🌡️", summary: "Conduction, convection, radiation and thermal energy.", accent: "sky" },
  { id: "light", title: "Light & Optics", subject: "Physics", icon: "💡", summary: "Reflection, refraction, colour and how we see.", accent: "sky" },
  { id: "sound", title: "Sound", subject: "Physics", icon: "🔊", summary: "How sound waves travel, and pitch and loudness.", accent: "sky" },
  { id: "magnetism-electricity", title: "Magnetism & Electricity", subject: "Physics", icon: "🧲", summary: "Magnets, circuits, current and electromagnets.", accent: "sky" },
  { id: "forces", title: "Forces & Motion", subject: "Physics", icon: "🏋️", summary: "Pushes and pulls, balanced forces, speed, springs and pressure.", accent: "sky" },
  { id: "energy", title: "Energy: Stores & Transfers", subject: "Physics", icon: "⚡", summary: "The eight energy stores, transfers, efficiency and resources.", accent: "sky" },
];

export const ACCENT: Record<string, { card: string; chip: string; bar: string; text: string; ring: string }> = {
  emerald: { card: "from-emerald-50 to-white border-emerald-200", chip: "bg-emerald-100 text-emerald-700", bar: "bg-emerald-500", text: "text-emerald-700", ring: "ring-emerald-300" },
  violet: { card: "from-violet-50 to-white border-violet-200", chip: "bg-violet-100 text-violet-700", bar: "bg-violet-500", text: "text-violet-700", ring: "ring-violet-300" },
  sky: { card: "from-sky-50 to-white border-sky-200", chip: "bg-sky-100 text-sky-700", bar: "bg-sky-500", text: "text-sky-700", ring: "ring-sky-300" },
};

export function metaById(id: string): TopicMeta | undefined {
  return TOPIC_META.find((m) => m.id === id);
}
