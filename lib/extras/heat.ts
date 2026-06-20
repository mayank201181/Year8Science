import type { TopicExtras } from "../types";

// Engagement extras for heat. Content (hook, didYouKnow, experiments,
// bonusDiagrams) is filled by a content agent; interactive widget is wired here.
export const heatExtras: TopicExtras = {
  interactive: "convection",
  hook: "Step out of bed onto a tiled floor and it feels freezing, but the wooden floor next door feels cosy — even though a thermometer says they are exactly the same temperature. So why does one feel so much colder than the other?",
  didYouKnow: [
    "Hot air really does rise, which is how hot-air balloons fly: heating the air inside makes it spread out, become lighter than the air outside, and float upward.",
    "Metal feels colder than wood at the same temperature only because metal pulls heat out of your warm hand much faster — the chill is your own heat escaping.",
    "Heat from the Sun crosses 150 million kilometres of empty space with no air to travel through, because radiation needs no material at all.",
    "A vacuum flask keeps drinks hot for hours by attacking all three heat routes at once: a vacuum gap blocks conduction and convection, and a shiny silver coating bounces radiation back.",
    "Most things expand when heated, so engineers leave gaps in railway tracks and bridges; without them the metal would buckle on a hot day.",
  ],
  experiments: [
    {
      title: "Which surface steals heat fastest?",
      emoji: "🧊",
      materials: [
        "Two or three ice cubes the same size",
        "A metal tray or large spoon",
        "A wooden chopping board",
        "A plastic plate",
        "A clock or phone timer",
      ],
      steps: [
        "Lay the metal, wood and plastic items side by side so they are all at room temperature.",
        "Place one ice cube on each surface at exactly the same moment and start the timer.",
        "Watch closely and write down which ice cube starts melting first.",
        "Time how long each one takes to melt fully and compare.",
      ],
      science:
        "All three surfaces are the same temperature, but metal is a brilliant conductor, so it carries its heat into the ice very quickly and melts it fastest. Wood and plastic are insulators, so they pass heat slowly and their ice cubes last longer. This is exactly why a metal floor feels colder to your feet than a wooden one.",
    },
    {
      title: "The spinning convection snake",
      emoji: "🐍",
      materials: [
        "A sheet of paper",
        "Scissors",
        "A pencil and a length of thread",
        "A warm radiator or a safely placed lamp",
      ],
      steps: [
        "Draw a spiral on the paper, starting from the edge and curling inward to the centre.",
        "Cut along the line so the paper opens out into a dangling coil.",
        "Tape a thread to the very centre of the spiral.",
        "Hold the thread so the spiral hangs in the warm rising air above a radiator.",
        "Watch the spiral begin to turn on its own.",
      ],
      science:
        "Air warmed by the radiator expands, becomes less dense and rises in a current called convection. As this stream of rising air pushes past the angled paper, it gives the spiral a tiny twist and it spins. You are literally watching invisible moving heat.",
      safety:
        "Keep the paper near a warm radiator or a cool LED lamp, never over a flame, a hot bulb or a stove.",
    },
  ],
  bonusDiagrams: [
    {
      title: "Three ways heat travels",
      svg: `<svg viewBox="0 0 460 180" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Three panels showing conduction through a metal bar, convection in heated water, and radiation from the Sun">
  <rect x="0" y="0" width="460" height="180" fill="#ffffff"/>
  <text x="230" y="22" font-family="sans-serif" font-size="15" font-weight="bold" text-anchor="middle" fill="#1f2937">Three ways heat travels</text>
  <text x="75" y="44" font-family="sans-serif" font-size="13" font-weight="bold" text-anchor="middle" fill="#b45309">Conduction</text>
  <rect x="25" y="70" width="100" height="16" fill="#fdba74" stroke="#b45309" stroke-width="1"/>
  <line x1="30" y1="100" x2="120" y2="100" stroke="#dc2626" stroke-width="2"/>
  <polygon points="120,100 112,95 112,105" fill="#dc2626"/>
  <text x="75" y="120" font-family="sans-serif" font-size="10" text-anchor="middle" fill="#374151">through a solid</text>
  <text x="230" y="44" font-family="sans-serif" font-size="13" font-weight="bold" text-anchor="middle" fill="#1e40af">Convection</text>
  <rect x="190" y="60" width="80" height="50" fill="#bfdbfe" stroke="#1e40af" stroke-width="1"/>
  <path d="M210 105 C205 90 215 80 210 65" stroke="#dc2626" stroke-width="2" fill="none"/>
  <polygon points="210,65 205,73 215,73" fill="#dc2626"/>
  <path d="M250 65 C245 80 255 90 250 105" stroke="#1e40af" stroke-width="2" fill="none"/>
  <polygon points="250,105 245,97 255,97" fill="#1e40af"/>
  <text x="230" y="128" font-family="sans-serif" font-size="10" text-anchor="middle" fill="#374151">in liquids and gases</text>
  <text x="385" y="44" font-family="sans-serif" font-size="13" font-weight="bold" text-anchor="middle" fill="#92400e">Radiation</text>
  <circle cx="385" cy="80" r="16" fill="#fde047" stroke="#ca8a04" stroke-width="2"/>
  <line x1="385" y1="100" x2="385" y2="120" stroke="#ca8a04" stroke-width="2"/>
  <line x1="365" y1="95" x2="350" y2="110" stroke="#ca8a04" stroke-width="2"/>
  <line x1="405" y1="95" x2="420" y2="110" stroke="#ca8a04" stroke-width="2"/>
  <text x="385" y="138" font-family="sans-serif" font-size="10" text-anchor="middle" fill="#374151">across empty space</text>
</svg>`,
      caption:
        "Conduction passes heat through touching particles, convection carries it in moving liquids and gases, and radiation beams it through empty space.",
    },
    {
      title: "Why a vacuum flask keeps drinks hot",
      svg: `<svg viewBox="0 0 320 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Cross-section of a vacuum flask showing the vacuum gap and shiny silvered walls that block heat loss">
  <rect x="0" y="0" width="320" height="220" fill="#ffffff"/>
  <text x="160" y="22" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#1f2937">Inside a vacuum flask</text>
  <rect x="90" y="40" width="140" height="160" rx="12" fill="#e5e7eb" stroke="#6b7280" stroke-width="2"/>
  <rect x="110" y="55" width="100" height="130" rx="8" fill="#cbd5e1" stroke="#94a3b8" stroke-width="2"/>
  <rect x="125" y="70" width="70" height="100" rx="6" fill="#fca5a5" stroke="#dc2626" stroke-width="2"/>
  <text x="160" y="125" font-family="sans-serif" font-size="11" text-anchor="middle" fill="#7f1d1d">hot drink</text>
  <line x1="232" y1="120" x2="285" y2="120" stroke="#374151" stroke-width="1"/>
  <text x="288" y="116" font-family="sans-serif" font-size="9" fill="#374151">vacuum</text>
  <text x="288" y="128" font-family="sans-serif" font-size="9" fill="#374151">gap</text>
  <line x1="125" y1="190" x2="40" y2="190" stroke="#374151" stroke-width="1"/>
  <text x="6" y="186" font-family="sans-serif" font-size="9" fill="#374151">shiny</text>
  <text x="6" y="198" font-family="sans-serif" font-size="9" fill="#374151">walls</text>
</svg>`,
      caption:
        "The vacuum gap stops conduction and convection while the shiny silvered walls reflect radiation back, so the drink stays hot far longer.",
    },
  ],
};
