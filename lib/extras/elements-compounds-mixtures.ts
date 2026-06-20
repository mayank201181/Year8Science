import type { TopicExtras } from "../types";

// Engagement extras for elements-compounds-mixtures. Content (hook, didYouKnow, experiments,
// bonusDiagrams) is filled by a content agent; interactive widget is wired here.
export const elementsCompoundsMixturesExtras: TopicExtras = {
  hook: "Two of the most dangerous substances on Earth are a metal that bursts into flame in water and a poisonous green gas used as a weapon in war — yet when they join together, you sprinkle the result on your chips. How can two deadly elements make something you eat every day?",
  didYouKnow: [
    "Sodium is a metal that explodes in water and chlorine is a poisonous green gas, but bonded together as a compound they become ordinary, harmless table salt — proof that a compound is completely different from the elements inside it.",
    "Air is a mixture, not a compound: it is roughly 78% nitrogen and 21% oxygen with the gases simply mixed, which is why you can separate them by cooling air until it turns liquid.",
    "Pure gold is so soft that the gold in jewellery is almost always a mixture (an alloy) with other metals added to make it hard enough to wear.",
    "The black ink in many felt-tip pens is not really one colour at all — it is a mixture of several coloured dyes hidden together, which you can pull apart with nothing more than water and paper.",
    "Seawater is a mixture that contains so much dissolved salt that if you could spread all the salt from the oceans over the land, it would form a layer about 150 metres thick.",
  ],
  experiments: [
    {
      title: "Felt-Tip Rainbow (Paper Chromatography)",
      emoji: "🖊️",
      materials: [
        "A coffee filter, kitchen paper or a strip of white blotting paper",
        "Water-based felt-tip pens (black and dark colours work best)",
        "A glass of water",
        "A pencil and a paperclip or tape",
      ],
      steps: [
        "Cut a strip of paper and draw a thick dot of one pen colour about 2 cm up from the bottom.",
        "Pour a shallow layer of water into the glass — less than 2 cm deep.",
        "Hang the strip so the bottom edge just touches the water but the ink dot stays ABOVE the waterline.",
        "Watch for a few minutes as the water creeps up the paper and drags the ink with it.",
        "Take the strip out once the colours have spread, and let it dry to see the separate dyes.",
      ],
      science: "Felt-tip 'colours' are usually mixtures of several different dyes. As water soaks up the paper it carries each dye along at a different speed, so they spread out and separate into bands. This is called chromatography, and it shows that a single ink can be a mixture of many substances.",
    },
    {
      title: "Rescue the Salt from Sand",
      emoji: "🏖️",
      materials: [
        "A spoonful of table salt mixed with a spoonful of clean sand",
        "A glass of warm water",
        "A coffee filter or kitchen paper, plus a funnel or sieve",
        "A dark plate or saucer",
      ],
      steps: [
        "Stir the salt-and-sand mixture into the warm water and let the salt dissolve.",
        "Pour the cloudy water through a paper filter to catch the sand, collecting the clear liquid below.",
        "Pour the clear, filtered salty water onto a dark plate.",
        "Leave the plate somewhere warm for a day or two until the water evaporates.",
        "Look at the plate: the salt is back as tiny crystals, and the sand stayed in the filter.",
      ],
      science: "Sand does not dissolve in water but salt does, so filtering removes the solid sand while the dissolved salt passes straight through. When the water evaporates, the salt is left behind as crystals. Because nothing chemically changed, this proves salt and sand were only a mixture that could be separated by physical methods.",
      safety: "Use clean, food-grade salt and clean sand; do not eat the recovered salt.",
    },
  ],
  bonusDiagrams: [
    {
      title: "Element vs Compound vs Mixture",
      svg: `<svg viewBox="0 0 360 180" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Diagram comparing an element of identical atoms, a compound of bonded different atoms, and a mixture of unbonded different particles">
  <rect x="0" y="0" width="360" height="180" fill="#fffdf7"/>
  <rect x="15" y="30" width="100" height="100" fill="none" stroke="#888" stroke-width="1.5"/>
  <text x="65" y="22" font-size="12" text-anchor="middle" fill="#333">Element</text>
  <circle cx="45" cy="60" r="9" fill="#4a8ad0"/>
  <circle cx="80" cy="65" r="9" fill="#4a8ad0"/>
  <circle cx="55" cy="95" r="9" fill="#4a8ad0"/>
  <circle cx="90" cy="100" r="9" fill="#4a8ad0"/>
  <text x="65" y="150" font-size="9" text-anchor="middle" fill="#555">one kind of atom</text>
  <rect x="130" y="30" width="100" height="100" fill="none" stroke="#888" stroke-width="1.5"/>
  <text x="180" y="22" font-size="12" text-anchor="middle" fill="#333">Compound</text>
  <circle cx="160" cy="65" r="9" fill="#4a8ad0"/>
  <circle cx="178" cy="65" r="9" fill="#e07a3a"/>
  <line x1="160" y1="65" x2="178" y2="65" stroke="#333" stroke-width="2"/>
  <circle cx="165" cy="100" r="9" fill="#4a8ad0"/>
  <circle cx="183" cy="100" r="9" fill="#e07a3a"/>
  <line x1="165" y1="100" x2="183" y2="100" stroke="#333" stroke-width="2"/>
  <text x="180" y="150" font-size="9" text-anchor="middle" fill="#555">atoms bonded together</text>
  <rect x="245" y="30" width="100" height="100" fill="none" stroke="#888" stroke-width="1.5"/>
  <text x="295" y="22" font-size="12" text-anchor="middle" fill="#333">Mixture</text>
  <circle cx="270" cy="60" r="9" fill="#4a8ad0"/>
  <circle cx="305" cy="70" r="9" fill="#e07a3a"/>
  <circle cx="285" cy="95" r="9" fill="#4a8ad0"/>
  <circle cx="320" cy="100" r="9" fill="#7ac07a"/>
  <text x="295" y="150" font-size="9" text-anchor="middle" fill="#555">mixed, not bonded</text>
</svg>`,
      caption: "An element is one type of atom, a compound has different atoms chemically bonded, and a mixture just has them jumbled together.",
    },
    {
      title: "Separating a Mixture by Filtering and Evaporating",
      svg: `<svg viewBox="0 0 360 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Diagram of filtering salty sandy water through filter paper then evaporating the liquid to leave salt crystals">
  <rect x="0" y="0" width="360" height="200" fill="#fffdf7"/>
  <path d="M40 40 L100 40 L80 90 L60 90 Z" fill="#cfe8f7" stroke="#3a6a9a" stroke-width="2"/>
  <path d="M48 50 L92 50 L74 84 L66 84 Z" fill="#fff" stroke="#999" stroke-width="1"/>
  <text x="70" y="30" font-size="10" text-anchor="middle" fill="#333">Filter (catches sand)</text>
  <rect x="52" y="100" width="36" height="40" fill="#cfe8f7" stroke="#3a6a9a" stroke-width="2"/>
  <text x="70" y="160" font-size="9" text-anchor="middle" fill="#555">salty water</text>
  <line x1="110" y1="120" x2="160" y2="120" stroke="#444" stroke-width="2"/>
  <polygon points="160,120 152,115 152,125" fill="#444"/>
  <text x="135" y="112" font-size="9" text-anchor="middle" fill="#444">then heat / leave to dry</text>
  <rect x="190" y="120" width="90" height="20" fill="#f0dcc0" stroke="#a07a3a" stroke-width="2"/>
  <path d="M200 120 q5 -10 10 0 M220 120 q5 -10 10 0 M240 120 q5 -10 10 0 M260 120 q5 -10 10 0" fill="#fff" stroke="#a07a3a" stroke-width="1"/>
  <text x="300" y="116" font-size="10" fill="#a07a3a">salt crystals left</text>
  <text x="235" y="160" font-size="9" text-anchor="middle" fill="#555">water has evaporated away</text>
</svg>`,
      caption: "Filtering removes the undissolved sand; evaporating the water then leaves the dissolved salt behind as crystals.",
    },
  ],
};
