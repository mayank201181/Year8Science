import type { TopicExtras } from "../types";

// Engagement extras for periodic-table. Content (hook, didYouKnow, experiments,
// bonusDiagrams) is filled by a content agent; interactive widget is wired here.
export const periodicTableExtras: TopicExtras = {
  interactive: "atom-builder",
  hook: "In 1869 a Russian chemist arranged the known elements into a grid and left gaps where no element existed yet — then dared to predict the exact weight and colour of things nobody had ever seen. A few years later, those mystery elements were found, matching his guesses almost perfectly. How could a table predict the future?",
  didYouKnow: [
    "When Dmitri Mendeleev drew his table he left empty boxes for elements not yet discovered, and predicted gallium and germanium so accurately that when they were found years later his guesses were nearly spot on.",
    "Helium was discovered in the Sun before it was ever found on Earth — scientists spotted a strange colour in sunlight in 1868, which is why it is named after 'Helios', the Greek word for the Sun.",
    "Some elements are so unstable they exist for only a fraction of a second before falling apart, so chemists have to detect them by the tiny trail of particles they leave behind.",
    "Mercury and bromine are the only two elements that are liquid at room temperature, while gallium will melt into a puddle if you simply hold it in your warm hand.",
    "Francium is so rare that scientists think there are only a few tens of grams of it spread across the entire Earth's crust at any moment.",
  ],
  experiments: [
    {
      title: "The Magnet Metal Hunt",
      emoji: "🧲",
      materials: [
        "A fridge magnet or any strong magnet",
        "A coin, a paperclip, a steel spoon, aluminium foil, a copper coin or wire",
        "A small bowl of mixed metal bits to test",
      ],
      steps: [
        "Lay out your metal objects in a row and guess which ones the magnet will pull.",
        "Hold the magnet close to each object and note whether it sticks or not.",
        "Sort them into two piles: 'magnetic' and 'not magnetic'.",
        "Look at your magnetic pile — most will contain iron, nickel or cobalt.",
      ],
      science: "Only a few elements — iron, nickel and cobalt — are strongly attracted to magnets. Many shiny 'metals' like aluminium and copper are not magnetic at all, which shows that the elements in the periodic table have very different properties even though they are all metals. The magnet is sorting elements by a hidden property of their atoms.",
    },
    {
      title: "Grow Your Own Salt Crystals",
      emoji: "🧂",
      materials: [
        "Table salt (sodium chloride, an element compound)",
        "A clear glass or jar",
        "Warm water (from the tap is fine)",
        "A spoon, a piece of dark paper or a saucer",
      ],
      steps: [
        "Fill the glass with warm water and stir in salt one spoon at a time until no more will dissolve.",
        "Pour a thin layer of the salty water onto a saucer or dark paper.",
        "Leave it somewhere warm and undisturbed for a few days.",
        "Come back and look closely (a magnifier helps) at the cube-shaped crystals left behind.",
      ],
      science: "Salt is made of the elements sodium and chlorine locked together in a repeating cube pattern. As the water evaporates, the particles arrange themselves back into that neat pattern, which is why the crystals form perfect little cubes. The shape of a crystal is a clue to how its atoms are arranged.",
      safety: "Use clean, food-grade salt and a clean glass; this is not for eating after it has been left out.",
    },
  ],
  bonusDiagrams: [
    {
      title: "How the Periodic Table is Organised",
      svg: `<svg viewBox="0 0 360 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Simplified periodic table showing periods as rows and groups as columns with metals on the left and non-metals on the right">
  <rect x="0" y="0" width="360" height="220" fill="#fffdf7"/>
  <g stroke="#555" stroke-width="1">
    <rect x="30" y="40" width="22" height="22" fill="#bcd9f0"/>
    <rect x="30" y="64" width="22" height="22" fill="#bcd9f0"/>
    <rect x="54" y="64" width="22" height="22" fill="#bcd9f0"/>
    <rect x="30" y="88" width="22" height="22" fill="#bcd9f0"/>
    <rect x="54" y="88" width="22" height="22" fill="#bcd9f0"/>
    <rect x="246" y="88" width="22" height="22" fill="#f7d6a6"/>
    <rect x="270" y="88" width="22" height="22" fill="#f7d6a6"/>
    <rect x="294" y="88" width="22" height="22" fill="#c8e6c8"/>
    <rect x="294" y="64" width="22" height="22" fill="#c8e6c8"/>
    <rect x="294" y="40" width="22" height="22" fill="#c8e6c8"/>
  </g>
  <text x="42" y="22" font-size="10" text-anchor="middle" fill="#444">columns = groups</text>
  <line x1="42" y1="26" x2="42" y2="38" stroke="#444" stroke-width="1"/>
  <text x="14" y="78" font-size="10" text-anchor="middle" fill="#444" transform="rotate(-90 14 78)">rows = periods</text>
  <rect x="40" y="150" width="16" height="16" fill="#bcd9f0" stroke="#555"/>
  <text x="62" y="162" font-size="11" fill="#333">Metals (left side)</text>
  <rect x="40" y="174" width="16" height="16" fill="#c8e6c8" stroke="#555"/>
  <text x="62" y="186" font-size="11" fill="#333">Non-metals (right side)</text>
  <rect x="220" y="150" width="16" height="16" fill="#f7d6a6" stroke="#555"/>
  <text x="242" y="162" font-size="11" fill="#333">In-between zone</text>
</svg>`,
      caption: "Elements are placed in rows (periods) and columns (groups); elements in the same group behave in similar ways.",
    },
    {
      title: "What's Inside an Atom",
      svg: `<svg viewBox="0 0 320 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Diagram of an atom showing a central nucleus of protons and neutrons with electrons orbiting around it">
  <rect x="0" y="0" width="320" height="220" fill="#fffdf7"/>
  <ellipse cx="160" cy="110" rx="120" ry="70" fill="none" stroke="#88a" stroke-width="1.5" stroke-dasharray="4 4"/>
  <ellipse cx="160" cy="110" rx="70" ry="110" fill="none" stroke="#88a" stroke-width="1.5" stroke-dasharray="4 4"/>
  <circle cx="160" cy="110" r="22" fill="#f4a3a3" stroke="#a84747" stroke-width="2"/>
  <circle cx="153" cy="104" r="6" fill="#d04a4a"/>
  <circle cx="167" cy="106" r="6" fill="#d04a4a"/>
  <circle cx="158" cy="118" r="6" fill="#8a8a8a"/>
  <circle cx="280" cy="110" r="7" fill="#4a8ad0"/>
  <circle cx="160" cy="0" r="7" fill="#4a8ad0"/>
  <text x="160" y="200" font-size="11" text-anchor="middle" fill="#a84747">Nucleus: protons (+) and neutrons</text>
  <line x1="270" y1="110" x2="240" y2="110" stroke="#4a8ad0" stroke-width="1"/>
  <text x="170" y="20" font-size="11" fill="#4a8ad0">Electrons (-) orbit the nucleus</text>
</svg>`,
      caption: "Each element has a different number of protons in its nucleus, and that number is its place on the periodic table.",
    },
  ],
};
