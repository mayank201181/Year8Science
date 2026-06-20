import type { TopicExtras } from "../types";
import { photosynthesisExtras } from "./photosynthesis";
import { respirationExtras } from "./respiration";
import { breathingExtras } from "./breathing";
import { digestionExtras } from "./digestion";
import { periodicTableExtras } from "./periodic-table";
import { elementsCompoundsMixturesExtras } from "./elements-compounds-mixtures";
import { chemicalReactionsExtras } from "./chemical-reactions";
import { acidsMetalsExtras } from "./acids-metals";
import { heatExtras } from "./heat";
import { lightExtras } from "./light";
import { soundExtras } from "./sound";
import { magnetismElectricityExtras } from "./magnetism-electricity";

export const EXTRAS: Record<string, TopicExtras> = {
  "photosynthesis": photosynthesisExtras,
  "respiration": respirationExtras,
  "breathing": breathingExtras,
  "digestion": digestionExtras,
  "periodic-table": periodicTableExtras,
  "elements-compounds-mixtures": elementsCompoundsMixturesExtras,
  "chemical-reactions": chemicalReactionsExtras,
  "acids-metals": acidsMetalsExtras,
  "heat": heatExtras,
  "light": lightExtras,
  "sound": soundExtras,
  "magnetism-electricity": magnetismElectricityExtras,
};

const EMPTY: TopicExtras = {};
export function getExtras(id: string): TopicExtras {
  return EXTRAS[id] ?? EMPTY;
}
