import type { TopicExtras } from "../types";

// Engagement extras for photosynthesis. Content (hook, didYouKnow, experiments,
// bonusDiagrams) is filled by a content agent; interactive widget is wired here.
export const photosynthesisExtras: TopicExtras = {
  interactive: "photosynthesis-rate",
  hook: "Almost every atom of your body was once floating in the air as an invisible gas — until a plant grabbed it using nothing but sunlight. How can a silent leaf build solid food out of air and water, with no mouth, no muscles and no machinery?",
  didYouKnow: [
    "The oxygen in roughly every second breath you take was made by microscopic plant-like life in the ocean, not by trees on land.",
    "A single large tree can pull more than 20 kilograms of carbon dioxide out of the air in one year and lock it away as wood.",
    "Leaves look green because chlorophyll throws AWAY green light — it absorbs red and blue and reflects the green it can't use, so green is the colour a plant rejects.",
    "Photosynthesis is incredibly slow to capture energy: a leaf turns less than about 1% of the sunlight that lands on it into chemical energy, yet that tiny fraction feeds nearly all life on Earth.",
    "The first organisms to release oxygen poisoned the early planet — the build-up of this 'waste gas' billions of years ago caused one of the biggest mass extinctions ever, the Great Oxidation Event.",
  ],
  experiments: [
    {
      title: "Catch a Plant Breathing Out Oxygen",
      emoji: "🫧",
      materials: [
        "A clear glass jar or drinking glass",
        "A sprig of pondweed (e.g. Elodea/Cabomba from a pet shop) or a fresh leafy water plant",
        "Tap water left to stand for a few hours",
        "A sunny windowsill",
        "A small pinch of baking soda (optional, adds extra carbon dioxide)",
      ],
      steps: [
        "Fill the jar with the standing water and stir in the optional pinch of baking soda.",
        "Push the pondweed under the water, cut-stem end pointing upwards.",
        "Place the jar on a bright, sunny windowsill and wait 10–20 minutes.",
        "Watch the cut ends and leaves closely — tiny bubbles should start to stream off.",
        "Move the jar into a dark cupboard for 15 minutes and check again to compare.",
      ],
      science:
        "In bright light the plant photosynthesises, using carbon dioxide dissolved in the water and releasing oxygen as a waste gas — those tiny bubbles ARE the oxygen. Adding baking soda gives the plant more carbon dioxide, so it bubbles faster. In the dark there is no light energy, photosynthesis stops, and the bubbling fades — proving light is what drives the reaction.",
    },
    {
      title: "Find the Hidden Starch in a Leaf",
      emoji: "🍃",
      materials: [
        "A leaf from a houseplant kept in bright light for a day",
        "A small pan of boiling water",
        "A cup of rubbing alcohol (surgical spirit)",
        "Brown iodine solution (from a first-aid kit or pharmacy)",
        "A white plate and tweezers",
      ],
      steps: [
        "Ask an adult to dip the leaf in boiling water for about 30 seconds to soften it.",
        "Stand the leaf in a cup of alcohol placed in the hot (off-heat) water until the green colour leaks out and the leaf turns pale.",
        "Rinse the pale, brittle leaf gently in warm water and lay it flat on the white plate.",
        "Drip iodine solution all over the leaf and wait one minute.",
        "Look for the colour change where starch is present.",
      ],
      science:
        "Plants store the sugar they make in photosynthesis as starch. Iodine turns blue-black when it touches starch, so the leaf darkens — proof that the leaf has been making and storing food. The alcohol step removes the green chlorophyll so the colour change is easy to see.",
      safety:
        "Ask an adult to help with the boiling water. Keep the alcohol well away from any flame or hotplate — never heat alcohol directly. Iodine stains skin and clothes, so wash hands afterwards.",
    },
  ],
  bonusDiagrams: [
    {
      title: "What goes in and what comes out of a leaf",
      svg: `<svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Diagram of a leaf showing carbon dioxide and water entering, and glucose and oxygen produced using sunlight">
  <rect x="0" y="0" width="400" height="240" fill="#f0fbf2"/>
  <ellipse cx="200" cy="120" rx="95" ry="55" fill="#6cc070" stroke="#2f7a37" stroke-width="3"/>
  <line x1="200" y1="120" x2="200" y2="200" stroke="#2f7a37" stroke-width="4"/>
  <circle cx="320" cy="45" r="26" fill="#ffd23f" stroke="#e0a800" stroke-width="3"/>
  <text x="320" y="50" font-size="11" text-anchor="middle" fill="#5a4500">Sun</text>
  <line x1="300" y1="60" x2="250" y2="95" stroke="#e0a800" stroke-width="3"/>
  <text x="35" y="95" font-size="13" fill="#1d5a25">CO2</text>
  <line x1="62" y1="92" x2="110" y2="112" stroke="#1d5a25" stroke-width="2" marker-end="url(#a)"/>
  <text x="35" y="170" font-size="13" fill="#1f5fa0">Water</text>
  <line x1="80" y1="166" x2="120" y2="140" stroke="#1f5fa0" stroke-width="2" marker-end="url(#a)"/>
  <text x="345" y="150" font-size="13" fill="#1d5a25">O2</text>
  <line x1="290" y1="135" x2="335" y2="148" stroke="#1d5a25" stroke-width="2" marker-end="url(#a)"/>
  <text x="320" y="205" font-size="13" fill="#9a6b00">Glucose</text>
  <line x1="270" y1="150" x2="315" y2="195" stroke="#9a6b00" stroke-width="2" marker-end="url(#a)"/>
  <defs>
    <marker id="a" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#444"/>
    </marker>
  </defs>
</svg>`,
      caption:
        "Carbon dioxide and water go IN; using sunlight captured by chlorophyll, the leaf makes glucose (food) and releases oxygen.",
    },
    {
      title: "Inside a chloroplast",
      svg: `<svg viewBox="0 0 380 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Cross-section of a chloroplast showing the outer membrane, stacks of green thylakoids and the surrounding stroma">
  <rect x="0" y="0" width="380" height="220" fill="#eef9f0"/>
  <ellipse cx="190" cy="110" rx="150" ry="80" fill="#cdeccf" stroke="#2f7a37" stroke-width="4"/>
  <ellipse cx="100" cy="100" rx="22" ry="34" fill="#3f9a47" stroke="#206128" stroke-width="2"/>
  <ellipse cx="175" cy="130" rx="22" ry="34" fill="#3f9a47" stroke="#206128" stroke-width="2"/>
  <ellipse cx="255" cy="95" rx="22" ry="34" fill="#3f9a47" stroke="#206128" stroke-width="2"/>
  <text x="190" y="30" font-size="13" text-anchor="middle" fill="#1d5a25">Chloroplast</text>
  <text x="50" y="200" font-size="12" fill="#206128">Thylakoid stacks</text>
  <line x1="95" y1="190" x2="100" y2="135" stroke="#206128" stroke-width="2"/>
  <text x="280" y="200" font-size="12" fill="#2f7a37">Stroma (fluid)</text>
  <line x1="300" y1="190" x2="300" y2="150" stroke="#2f7a37" stroke-width="2"/>
</svg>`,
      caption:
        "Photosynthesis happens inside tiny green chloroplasts. The stacked green thylakoids are packed with chlorophyll that traps light.",
    },
  ],
};
