import type { TopicExtras } from "../types";

// Engagement extras for acids-metals. Content (hook, didYouKnow, experiments,
// bonusDiagrams) is filled by a content agent; interactive widget is wired here.
export const acidsMetalsExtras: TopicExtras = {
  interactive: "ph-slider",
  hook: "Chop a red cabbage and you have accidentally made a spy gadget: a liquid that flashes pink, purple or green depending on what secret it touches. What is it actually detecting, and could you use it to unmask the hidden chemicals in your own kitchen?",
  didYouKnow: [
    "Your stomach is full of hydrochloric acid strong enough to dissolve metal, yet it does not dissolve you because your stomach lining grows a fresh protective coat every few days.",
    "Bee stings are acidic and wasp stings are alkaline, which is why people once treated them with opposite remedies to try to neutralise the pain.",
    "The pH scale is logarithmic: lemon juice (pH 2) is about ten times more acidic than orange juice (pH 3) and a hundred times more acidic than tomato juice (pH 4).",
    "Some metals are so reactive that they fizz, hiss or even catch fire in plain water — caesium can explode the instant it touches a puddle.",
    "Indicators like the dye in red cabbage are made by plants partly to attract insects, but they happen to change colour when acids or alkalis tweak their molecular shape.",
  ],
  experiments: [
    {
      title: "Red-cabbage rainbow indicator",
      emoji: "🥬",
      materials: [
        "A few leaves of red cabbage",
        "Hot water from a tap (warm, not boiling)",
        "A bowl and a strainer",
        "Clear cups or a clear ice-cube tray",
        "Test liquids: lemon juice, vinegar, water, soapy water, bicarbonate of soda dissolved in water",
      ],
      steps: [
        "Tear the cabbage leaves into a bowl and cover with warm water; squash them with a spoon until the water turns deep purple, then leave for 10 minutes.",
        "Strain off the purple liquid — this is your indicator. Throw the leaves away.",
        "Pour a little purple liquid into each clear cup.",
        "Add a different test liquid to each cup and stir gently.",
        "Line the cups up from reddest to greenest and note what each colour tells you.",
      ],
      science:
        "Red cabbage contains a dye that changes shape, and therefore colour, depending on how many hydrogen ions surround it. Acids turn it red or pink, neutral liquids stay purple, and alkalis turn it blue or green. You have built a homemade pH scale that sorts your kitchen liquids by acidity.",
      safety:
        "Use warm tap water rather than boiling water, and only taste-test nothing — soapy water and cleaning liquids are not for drinking.",
    },
  ],
  bonusDiagrams: [
    {
      title: "The pH scale",
      svg: `<svg viewBox="0 0 460 150" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A pH scale from 0 to 14 coloured from red acid through green neutral to purple alkali with example liquids">
  <rect x="0" y="0" width="460" height="150" fill="#ffffff"/>
  <text x="230" y="22" font-family="sans-serif" font-size="15" font-weight="bold" text-anchor="middle" fill="#1f2937">The pH scale</text>
  <rect x="30" y="40" width="30" height="28" fill="#d7263d"/>
  <rect x="60" y="40" width="30" height="28" fill="#f4511e"/>
  <rect x="90" y="40" width="30" height="28" fill="#fb8c00"/>
  <rect x="120" y="40" width="30" height="28" fill="#fdd835"/>
  <rect x="150" y="40" width="30" height="28" fill="#cddc39"/>
  <rect x="180" y="40" width="30" height="28" fill="#7cb342"/>
  <rect x="210" y="40" width="30" height="28" fill="#43a047"/>
  <rect x="240" y="40" width="30" height="28" fill="#26a69a"/>
  <rect x="270" y="40" width="30" height="28" fill="#039be5"/>
  <rect x="300" y="40" width="30" height="28" fill="#1e88e5"/>
  <rect x="330" y="40" width="30" height="28" fill="#3949ab"/>
  <rect x="360" y="40" width="30" height="28" fill="#5e35b1"/>
  <rect x="390" y="40" width="30" height="28" fill="#8e24aa"/>
  <rect x="420" y="40" width="30" height="28" fill="#6a1b9a"/>
  <text x="45" y="84" font-family="sans-serif" font-size="11" text-anchor="middle" fill="#374151">0</text>
  <text x="225" y="84" font-family="sans-serif" font-size="11" text-anchor="middle" fill="#374151">7</text>
  <text x="435" y="84" font-family="sans-serif" font-size="11" text-anchor="middle" fill="#374151">14</text>
  <text x="60" y="108" font-family="sans-serif" font-size="12" font-weight="bold" text-anchor="middle" fill="#991b1b">ACID</text>
  <text x="225" y="108" font-family="sans-serif" font-size="12" font-weight="bold" text-anchor="middle" fill="#1b5e20">NEUTRAL</text>
  <text x="405" y="108" font-family="sans-serif" font-size="12" font-weight="bold" text-anchor="middle" fill="#4a148c">ALKALI</text>
  <text x="60" y="130" font-family="sans-serif" font-size="10" text-anchor="middle" fill="#374151">lemon</text>
  <text x="225" y="130" font-family="sans-serif" font-size="10" text-anchor="middle" fill="#374151">pure water</text>
  <text x="405" y="130" font-family="sans-serif" font-size="10" text-anchor="middle" fill="#374151">bleach</text>
</svg>`,
      caption:
        "Low numbers are acids, 7 is neutral, and high numbers are alkalis — each step of 1 means a tenfold change in strength.",
    },
    {
      title: "Acid plus metal reaction",
      svg: `<svg viewBox="0 0 380 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A test tube of acid with a metal strip producing hydrogen gas bubbles that pop a lit splint">
  <rect x="0" y="0" width="380" height="200" fill="#ffffff"/>
  <text x="190" y="22" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#1f2937">Acid + metal makes hydrogen gas</text>
  <path d="M120 40 L120 160 Q120 180 140 180 Q160 180 160 160 L160 40 Z" fill="#cce5ff" stroke="#1d4ed8" stroke-width="2"/>
  <rect x="135" y="70" width="10" height="90" fill="#9ca3af" stroke="#4b5563" stroke-width="1"/>
  <circle cx="128" cy="120" r="4" fill="#ffffff" stroke="#1d4ed8"/>
  <circle cx="150" cy="100" r="4" fill="#ffffff" stroke="#1d4ed8"/>
  <circle cx="140" cy="80" r="4" fill="#ffffff" stroke="#1d4ed8"/>
  <text x="140" y="196" font-family="sans-serif" font-size="11" text-anchor="middle" fill="#374151">acid + metal strip</text>
  <line x1="170" y1="60" x2="240" y2="60" stroke="#374151" stroke-width="2"/>
  <polygon points="240,60 230,55 230,65" fill="#374151"/>
  <text x="290" y="55" font-family="sans-serif" font-size="12" text-anchor="middle" fill="#374151">hydrogen gas</text>
  <text x="290" y="72" font-family="sans-serif" font-size="11" text-anchor="middle" fill="#374151">gives a squeaky pop</text>
</svg>`,
      caption:
        "Reactive metals fizz in acid, releasing hydrogen gas that makes a tell-tale squeaky pop with a lit splint.",
    },
  ],
};
