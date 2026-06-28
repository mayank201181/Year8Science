import type { Topic } from "../types";
import { TOPIC_META } from "./_meta";

import { photosynthesis } from "./photosynthesis";
import { respiration } from "./respiration";
import { breathing } from "./breathing";
import { digestion } from "./digestion";
import { periodicTable } from "./periodic-table";
import { elementsCompoundsMixtures } from "./elements-compounds-mixtures";
import { chemicalReactions } from "./chemical-reactions";
import { acidsMetals } from "./acids-metals";
import { heat } from "./heat";
import { light } from "./light";
import { sound } from "./sound";
import { magnetismElectricity } from "./magnetism-electricity";
import { forces } from "./forces";
import { energy } from "./energy";

const REGISTRY: Record<string, Topic> = {
  photosynthesis,
  respiration,
  breathing,
  digestion,
  "periodic-table": periodicTable,
  "elements-compounds-mixtures": elementsCompoundsMixtures,
  "chemical-reactions": chemicalReactions,
  "acids-metals": acidsMetals,
  heat,
  light,
  sound,
  "magnetism-electricity": magnetismElectricity,
  forces,
  energy,
};

/** All topics in curriculum order. */
export const ALL_TOPICS: Topic[] = TOPIC_META.map((m) => REGISTRY[m.id]).filter(Boolean);

export function getTopic(id: string): Topic | undefined {
  return REGISTRY[id];
}

export function topicIds(): string[] {
  return TOPIC_META.map((m) => m.id);
}
