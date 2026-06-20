import type { TopicExtras } from "../types";

// Engagement extras for magnetism-electricity. Content (hook, didYouKnow, experiments,
// bonusDiagrams) is filled by a content agent; interactive widget is wired here.
export const magnetismElectricityExtras: TopicExtras = {
  interactive: "circuit-lab",
  hook: "Wrap a plain iron nail in some wire, connect a single battery, and suddenly the nail can grab a fistful of paperclips. Disconnect the battery and they all clatter to the floor. How can a piece of wire switch magnetism on and off?",
  didYouKnow: [
    "The Earth itself is a giant magnet, and that invisible magnetic field is what swings a compass needle to point north and shields us from harmful particles streaming off the Sun.",
    "Electricity and magnetism are really two sides of the same thing: every electric current makes a magnetic field, and a moving magnet can push electricity through a wire — that is how every power station on Earth generates electricity.",
    "A single bolt of lightning carries around a billion volts and is roughly five times hotter than the surface of the Sun.",
    "Magnets always have two poles; if you snap a bar magnet in half you do not get a single north and a single south — you get two smaller magnets, each with its own north and south.",
    "Some animals can sense magnetic fields: pigeons, sea turtles and certain birds use the Earth's magnetism like a built-in compass to navigate thousands of kilometres.",
  ],
  experiments: [
    {
      title: "Build Your Own Electromagnet",
      emoji: "🧲",
      materials: [
        "A large iron nail",
        "About 1 metre of thin insulated (plastic-coated) wire",
        "One 1.5 volt AA or AAA battery",
        "A pile of steel paperclips",
      ],
      steps: [
        "Leave a short tail of wire free, then wrap the wire neatly around the nail in a tight coil, going round and round 30 or more times the same way.",
        "Strip or peel a little plastic off each end of the wire so the bare metal shows.",
        "Press one bare end onto the '+' end of the battery and the other onto the '-' end.",
        "Dip the tip of the nail into the pile of paperclips and count how many it lifts.",
        "Lift the wire off the battery and watch the paperclips drop.",
      ],
      science:
        "When current flows through the coil it creates a magnetic field, and the iron nail concentrates that field to make a strong temporary magnet called an electromagnet. The more turns of wire you add, the stronger it gets. Because the magnetism only exists while the current flows, switching the battery off makes it instantly let go.",
      safety:
        "Use only a single small battery — never mains electricity. The wire and battery can get warm, so disconnect it between tries and stop if anything feels hot.",
    },
    {
      title: "Map a Magnet's Field With a Compass",
      emoji: "🧭",
      materials: [
        "A bar or fridge magnet",
        "A small compass",
        "A sheet of paper and a pencil",
      ],
      steps: [
        "Lay the magnet flat in the middle of the paper and draw around it.",
        "Place the compass near one end of the magnet and mark a dot at each end of the needle.",
        "Move the compass a little, line it up with your last dot, and mark again.",
        "Join the dots into a smooth curving line, then repeat starting from different points.",
      ],
      science:
        "A magnet is surrounded by an invisible magnetic field, and the compass needle lines up with that field wherever you place it. By following the needle you trace out field lines that loop from the north pole around to the south pole, revealing the hidden shape of the field.",
    },
  ],
  bonusDiagrams: [
    {
      title: "Magnetic field around a bar magnet",
      svg: `<svg viewBox="0 0 300 180" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A bar magnet with curved field lines looping from the north pole to the south pole">
  <rect x="110" y="80" width="40" height="22" fill="#e21b1b" />
  <rect x="150" y="80" width="40" height="22" fill="#1b6be2" />
  <text x="122" y="96" font-size="14" fill="#fff">N</text>
  <text x="166" y="96" font-size="14" fill="#fff">S</text>
  <path d="M150 80 C150 30 90 20 60 50 C40 70 50 88 110 90" fill="none" stroke="#555" stroke-width="1.5" />
  <path d="M150 102 C150 152 90 162 60 132 C40 112 50 94 110 92" fill="none" stroke="#555" stroke-width="1.5" />
  <path d="M150 80 C150 30 210 20 240 50 C260 70 250 88 190 90" fill="none" stroke="#555" stroke-width="1.5" />
  <path d="M150 102 C150 152 210 162 240 132 C260 112 250 94 190 92" fill="none" stroke="#555" stroke-width="1.5" />
  <polygon points="86,30 92,38 80,40" fill="#555" />
  <polygon points="214,30 220,38 208,40" fill="#555" />
  <text x="40" y="20" font-size="10" fill="#333">field lines run N to S</text>
</svg>`,
      caption:
        "Field lines leave the north pole, curve around through the air and return to the south pole. Where the lines are closest the field is strongest.",
    },
    {
      title: "How an electromagnet is built",
      svg: `<svg viewBox="0 0 300 160" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="An iron nail wrapped in a coil of wire connected to a battery forming an electromagnet">
  <rect x="60" y="70" width="150" height="14" fill="#b0b0b0" />
  <polygon points="210,70 230,77 210,84" fill="#b0b0b0" />
  <text x="95" y="105" font-size="11" fill="#333">iron nail</text>
  <path d="M70 70 C75 55 85 55 90 70" fill="none" stroke="#c47f00" stroke-width="3" />
  <path d="M90 84 C95 99 105 99 110 84" fill="none" stroke="#c47f00" stroke-width="3" />
  <path d="M110 70 C115 55 125 55 130 70" fill="none" stroke="#c47f00" stroke-width="3" />
  <path d="M130 84 C135 99 145 99 150 84" fill="none" stroke="#c47f00" stroke-width="3" />
  <path d="M150 70 C155 55 165 55 170 70" fill="none" stroke="#c47f00" stroke-width="3" />
  <path d="M170 84 C175 99 185 99 190 84" fill="none" stroke="#c47f00" stroke-width="3" />
  <text x="105" y="48" font-size="11" fill="#c47f00">coil of wire</text>
  <line x1="70" y1="70" x2="40" y2="130" stroke="#c47f00" stroke-width="2" />
  <line x1="190" y1="84" x2="220" y2="130" stroke="#c47f00" stroke-width="2" />
  <rect x="115" y="125" width="40" height="22" fill="#333" />
  <text x="120" y="140" font-size="11" fill="#fff">cell</text>
  <line x1="40" y1="130" x2="115" y2="136" stroke="#c47f00" stroke-width="2" />
  <line x1="155" y1="136" x2="220" y2="130" stroke="#c47f00" stroke-width="2" />
</svg>`,
      caption:
        "Current from the cell flows through the coil and turns the iron nail into a magnet. No current means no magnetism.",
    },
  ],
};
