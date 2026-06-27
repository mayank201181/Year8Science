"use client";

import type { Topic } from "@/lib/types";
import { getExtras } from "@/lib/extras";
import { EXPLORABLES_ALL } from "./InteractiveWidgets";

export function InteractiveTab({ topic }: { topic: Topic }) {
  const extras = getExtras(topic.id);
  const keys = extras.interactives ?? (extras.interactive ? [extras.interactive] : []);
  const widgets = keys.map((k) => EXPLORABLES_ALL[k]).filter(Boolean);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border-l-4 border-indigo-400 bg-indigo-50 p-4">
        <p className="text-xs font-bold uppercase tracking-wide text-indigo-600">🧪 Play & discover</p>
        <p className="mt-1 font-medium text-indigo-900">
          Change the inputs and watch what happens — the best way to really understand {topic.title.toLowerCase()}.
        </p>
      </div>

      {widgets.length > 0 ? (
        widgets.map((W, i) => <W key={i} />)
      ) : (
        <p className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-slate-500">
          An interactive for this topic is coming soon. In the meantime, explore the Guide and try the Quiz!
        </p>
      )}
    </div>
  );
}
