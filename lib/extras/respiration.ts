import type { TopicExtras } from "../types";

// Engagement extras for respiration. Content (hook, didYouKnow, experiments,
// bonusDiagrams) is filled by a content agent; interactive widget is wired here.
export const respirationExtras: TopicExtras = {
  interactive: "respiration-lab",
  hook: "Right now, inside trillions of your cells, something is quietly burning your breakfast — without any flames, smoke or heat that could cook you. How does your body release the energy locked inside a piece of toast as gently as a candle, and what happens to that energy when you sprint until your legs burn?",
  didYouKnow: [
    "Every cell in your body has hundreds of tiny 'power stations' called mitochondria — laid end to end, the mitochondria in one person would stretch tens of thousands of kilometres.",
    "Respiration and burning are almost the same chemical reaction (glucose + oxygen → carbon dioxide + water + energy) — your cells just do it in tiny, controlled steps instead of one fiery burst.",
    "The burning ache in your muscles during a hard sprint isn't from lactic acid alone, as people used to think — it's a build-up of several chemicals when your cells respire WITHOUT enough oxygen (anaerobic respiration).",
    "Yeast carries out anaerobic respiration too, but it makes alcohol and carbon dioxide instead — the same process raises bread dough and fizzes up every fizzy drink and beer ever made.",
    "Your brain is only about 2% of your body weight but uses roughly 20% of all the energy your respiration releases, even while you sleep.",
  ],
  experiments: [
    {
      title: "Blow Up a Balloon With Living Yeast",
      emoji: "🎈",
      materials: [
        "A clean small plastic bottle",
        "A sachet of dried baking yeast",
        "Two teaspoons of sugar",
        "Warm (not hot) water",
        "A balloon",
      ],
      steps: [
        "Pour about 3 cm of warm water into the bottle.",
        "Stir in the sugar until it dissolves, then add the yeast and swirl gently.",
        "Stretch the balloon a few times, then fit its neck tightly over the top of the bottle.",
        "Put the bottle somewhere warm and leave it for 30–60 minutes.",
        "Watch the balloon slowly stand up and inflate, and listen for a faint fizzing.",
      ],
      science:
        "Yeast are living single-celled fungi. With sugar to feed on but little oxygen, they carry out anaerobic respiration (fermentation), releasing carbon dioxide gas. The gas can't escape, so it fills the balloon. Warm water wakes the yeast up; water that is too hot would kill them and nothing would happen.",
      safety: "Use warm, not boiling, water — ask an adult if you're unsure.",
    },
    {
      title: "Feel Your Own Energy Being Released",
      emoji: "💪",
      materials: [
        "A clock or phone timer",
        "A clear space to do star jumps",
        "Your own hands",
      ],
      steps: [
        "Sit still for two minutes, then place a hand flat on your chest and count your breaths for 30 seconds.",
        "Now do star jumps as fast as you safely can for one minute.",
        "Immediately place your hand back on your chest and count your breaths for 30 seconds again.",
        "Touch your forehead and the back of your neck — notice anything about the temperature?",
        "Rest and watch how quickly your breathing slows back down.",
      ],
      science:
        "Exercise makes your muscle cells respire much faster to release energy, so they need more oxygen and produce more carbon dioxide — which is why you breathe harder and faster afterwards. Respiration also releases heat as a by-product, so your skin feels warmer and you may sweat to cool down.",
    },
  ],
  bonusDiagrams: [
    {
      title: "Aerobic respiration: the word equation",
      svg: `<svg viewBox="0 0 420 160" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Word equation showing glucose plus oxygen reacting to form carbon dioxide plus water plus energy">
  <rect x="0" y="0" width="420" height="160" fill="#fff6f0"/>
  <rect x="15" y="50" width="90" height="50" rx="8" fill="#ffd9a8" stroke="#c2701b" stroke-width="2"/>
  <text x="60" y="80" font-size="12" text-anchor="middle" fill="#7a3e00">Glucose</text>
  <text x="118" y="80" font-size="22" text-anchor="middle" fill="#444">+</text>
  <rect x="135" y="50" width="90" height="50" rx="8" fill="#bfe3ff" stroke="#1f6aa8" stroke-width="2"/>
  <text x="180" y="80" font-size="12" text-anchor="middle" fill="#0d3f6b">Oxygen</text>
  <text x="245" y="80" font-size="22" text-anchor="middle" fill="#444">=</text>
  <rect x="270" y="20" width="135" height="36" rx="8" fill="#d6d6d6" stroke="#666" stroke-width="2"/>
  <text x="337" y="43" font-size="11" text-anchor="middle" fill="#333">Carbon dioxide</text>
  <rect x="270" y="62" width="63" height="36" rx="8" fill="#bfe3ff" stroke="#1f6aa8" stroke-width="2"/>
  <text x="301" y="85" font-size="11" text-anchor="middle" fill="#0d3f6b">Water</text>
  <rect x="338" y="62" width="67" height="36" rx="8" fill="#ffe98a" stroke="#c2a000" stroke-width="2"/>
  <text x="371" y="85" font-size="11" text-anchor="middle" fill="#6b5600">Energy</text>
  <text x="210" y="135" font-size="11" text-anchor="middle" fill="#a05a00">Released in every living cell, using oxygen</text>
</svg>`,
      caption:
        "Aerobic respiration breaks down glucose using oxygen, releasing energy plus carbon dioxide and water as waste.",
    },
    {
      title: "A mitochondrion: the cell's power station",
      svg: `<svg viewBox="0 0 360 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Cross-section of a mitochondrion showing its smooth outer membrane and folded inner membrane">
  <rect x="0" y="0" width="360" height="200" fill="#fbf0f4"/>
  <ellipse cx="180" cy="100" rx="150" ry="70" fill="#f4b9cf" stroke="#b03a66" stroke-width="4"/>
  <path d="M40 100 q30 -45 60 0 q30 45 60 0 q30 -45 60 0 q30 45 60 0" fill="none" stroke="#7a1f42" stroke-width="4"/>
  <text x="180" y="28" font-size="13" text-anchor="middle" fill="#7a1f42">Mitochondrion</text>
  <text x="20" y="185" font-size="11" fill="#b03a66">Outer membrane</text>
  <line x1="55" y1="174" x2="60" y2="150" stroke="#b03a66" stroke-width="2"/>
  <text x="225" y="185" font-size="11" fill="#7a1f42">Folded inner membrane</text>
  <line x1="270" y1="174" x2="240" y2="120" stroke="#7a1f42" stroke-width="2"/>
</svg>`,
      caption:
        "Most respiration happens inside mitochondria. The inner membrane is folded to pack in a huge surface area for releasing energy.",
    },
  ],
};
