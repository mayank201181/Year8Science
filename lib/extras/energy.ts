import type { TopicExtras } from "../types";

// Engagement extras for energy. Content (hook, didYouKnow, experiments,
// bonusDiagrams) is filled by a content agent; interactive widget is wired here.
export const energyExtras: TopicExtras = {
  interactive: "energy-stores",
  hook: "Every single thing that has ever happened — your heartbeat, a lightning bolt, a rocket launch, the Sun shining — is energy quietly moving from one store to another. And here is the astonishing part: not one single joule of it has ever been created or destroyed since the universe began. So where does all the energy you 'use up' today actually go?",
  didYouKnow: [
    "The Sun has been pouring out energy from its nuclear store for about 4.6 billion years, and it has only used up around half of its fuel — it will keep shining for roughly another 5 billion years.",
    "You can never really 'use energy up'. The energy in your breakfast does not vanish; it ends up spread out as warmth, movement and sound, eventually dissipating into your surroundings.",
    "Old filament light bulbs were so inefficient that only about a tenth of the energy became light — the rest leaked away as heat, which is why they were warm enough to fry an egg on.",
    "A bolt of lightning releases its electrostatic store in a flash carrying about a billion joules, briefly heating the air to around five times hotter than the surface of the Sun.",
    "A 'perpetual motion machine' that runs forever for free has been attempted thousands of times for centuries — and every single one has failed, because it would have to break the law of conservation of energy.",
  ],
  experiments: [
    {
      title: "The energy-store pendulum swap",
      emoji: "🪀",
      materials: [
        "A length of string about 50 cm long",
        "A small heavy object such as a metal washer or a key bunch",
        "A pencil or ruler to tie the string to",
        "A helper or a fixed point to hold the pencil steady",
      ],
      steps: [
        "Tie the heavy object to one end of the string and the other end to the pencil.",
        "Hold the pencil steady so the object hangs and can swing freely (a pendulum).",
        "Pull the object out to one side, hold it still, then let go without pushing.",
        "Watch where it moves fastest and where it pauses, and notice how high it rises on each side.",
        "Count how many swings it takes before it slows right down.",
      ],
      science:
        "At the highest point the object is still for an instant — all its energy is in the gravitational potential store. At the bottom it moves fastest — the energy is now in the kinetic store. The two stores swap back and forth. Each swing rises a tiny bit lower because air resistance and friction at the top dissipate a little energy as warmth, which is why it eventually stops. Energy is never destroyed, just spread out.",
    },
    {
      title: "Feel friction make heat",
      emoji: "🤲",
      materials: [
        "Just your two hands",
        "Optional: a metal spoon and a rough cloth",
      ],
      steps: [
        "Press your palms flat together.",
        "Rub them back and forth as fast as you can for about fifteen seconds.",
        "Stop and notice how warm your palms feel.",
        "If you like, rub a metal spoon hard with a cloth and feel the spoon warm up too.",
      ],
      science:
        "Your muscles use a chemical store of energy to move your hands, giving them a kinetic store. Friction between your palms transfers that kinetic energy into the thermal store of your skin, so your hands warm up. This is exactly the same wasted-energy process that warms up bicycle brakes, drill bits and machine parts everywhere.",
      safety:
        "Rub gently enough to feel warmth, not soreness. Do not rub bare skin against rough surfaces hard enough to hurt.",
    },
  ],
  bonusDiagrams: [
    {
      title: "Energy stores versus transfer pathways",
      svg: `<svg viewBox="0 0 460 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A diagram separating energy stores from the pathways that connect them">
  <rect x="0" y="0" width="460" height="200" fill="#ffffff"/>
  <text x="230" y="22" font-family="sans-serif" font-size="15" font-weight="bold" text-anchor="middle" fill="#1f2937">Stores (where) and pathways (how)</text>
  <rect x="20" y="55" width="120" height="60" rx="10" fill="#fef9c3" stroke="#ca8a04" stroke-width="2"/>
  <text x="80" y="82" font-family="sans-serif" font-size="12" text-anchor="middle" fill="#854d0e">chemical</text>
  <text x="80" y="100" font-family="sans-serif" font-size="10" text-anchor="middle" fill="#854d0e">store (battery)</text>
  <rect x="320" y="55" width="120" height="60" rx="10" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/>
  <text x="380" y="82" font-family="sans-serif" font-size="12" text-anchor="middle" fill="#14532d">kinetic</text>
  <text x="380" y="100" font-family="sans-serif" font-size="10" text-anchor="middle" fill="#14532d">store (fan)</text>
  <line x1="140" y1="85" x2="320" y2="85" stroke="#2563eb" stroke-width="3" marker-end="url(#bd1)"/>
  <defs><marker id="bd1" markerWidth="10" markerHeight="10" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#2563eb"/></marker></defs>
  <text x="230" y="78" font-family="sans-serif" font-size="11" text-anchor="middle" fill="#1e3a8a">electrically + mechanically</text>
  <text x="230" y="94" font-family="sans-serif" font-size="9" text-anchor="middle" fill="#1e3a8a">(pathway)</text>
  <text x="230" y="150" font-family="sans-serif" font-size="11" text-anchor="middle" fill="#374151">Stores are the boxes; the arrow is the pathway.</text>
  <text x="230" y="170" font-family="sans-serif" font-size="11" text-anchor="middle" fill="#374151">Energy moves; the total stays the same.</text>
</svg>`,
      caption:
        "Stores are WHERE energy is held (the boxes); pathways are HOW it moves between them (the arrow). The total energy never changes.",
    },
    {
      title: "A Sankey diagram for a light bulb",
      svg: `<svg viewBox="0 0 360 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A Sankey diagram showing 100 joules in, 10 joules useful light and 90 joules wasted heat for a filament bulb">
  <rect x="0" y="0" width="360" height="200" fill="#ffffff"/>
  <text x="180" y="22" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#1f2937">Sankey diagram: filament bulb</text>
  <rect x="20" y="55" width="40" height="90" fill="#fde68a" stroke="#d97706" stroke-width="1"/>
  <text x="40" y="50" font-family="sans-serif" font-size="10" text-anchor="middle" fill="#92400e">100 J in</text>
  <polygon points="60,58 240,68 240,78 60,68" fill="#86efac" stroke="#16a34a" stroke-width="1"/>
  <text x="250" y="74" font-family="sans-serif" font-size="9" fill="#14532d">useful light 10 J</text>
  <polygon points="60,68 200,68 200,175 120,175" fill="#fca5a5" stroke="#dc2626" stroke-width="1"/>
  <text x="205" y="150" font-family="sans-serif" font-size="9" fill="#991b1b">wasted heat 90 J</text>
  <text x="180" y="195" font-family="sans-serif" font-size="10" text-anchor="middle" fill="#374151">Thin useful branch, fat wasted branch = inefficient.</text>
</svg>`,
      caption:
        "The width of each arrow shows the amount of energy. A filament bulb wastes most energy as heat (a fat wasted branch), so it is very inefficient.",
    },
  ],
};
