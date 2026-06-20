import type { TopicExtras } from "../types";

// Engagement extras for chemical-reactions. Content (hook, didYouKnow, experiments,
// bonusDiagrams) is filled by a content agent; interactive widget is wired here.
export const chemicalReactionsExtras: TopicExtras = {
  hook: "Strike a match and a tiny stick of wood releases light and heat it was never given — where was that energy hiding all along? Every reaction is a secret swap of partners between atoms, and once you spot the rules, you can predict the magic.",
  didYouKnow: [
    "When wood burns, almost nothing actually disappears — the missing mass floats away as invisible carbon dioxide and water vapour, which is why a 'closed' reaction weighs exactly the same before and after.",
    "Your body is running thousands of slow chemical reactions right now; respiration is basically a very gentle, controlled version of burning sugar.",
    "Glow sticks work by a cold chemical reaction called chemiluminescence — they make light without making heat, the opposite of a flame.",
    "A single gram of certain catalysts can speed up a reaction without ever being used up, so the same atoms can help millions of times over.",
    "Rust is iron slowly 'burning' in air — the same reaction as fire, just so slow you could watch a nail rust for years instead of seconds.",
  ],
  experiments: [
    {
      title: "Balloon-inflating fizz reaction",
      emoji: "🎈",
      materials: [
        "An empty plastic bottle",
        "A balloon",
        "Baking soda (bicarbonate of soda)",
        "Vinegar",
        "A teaspoon and a funnel (or rolled paper)",
      ],
      steps: [
        "Pour about 3 tablespoons of vinegar into the empty bottle.",
        "Using the funnel, spoon 2 teaspoons of baking soda into the deflated balloon.",
        "Stretch the mouth of the balloon over the top of the bottle, keeping the baking soda trapped in the balloon for now.",
        "Lift the balloon upright so the baking soda tips down into the vinegar.",
        "Watch the fizzing — and the balloon inflate by itself.",
      ],
      science:
        "Vinegar (an acid) reacts with baking soda (a base) to make carbon dioxide gas. The gas has nowhere to go but up into the balloon, so it inflates without you blowing into it. This is a chemical reaction: new substances are made, and you can tell because a brand-new gas appears.",
    },
    {
      title: "Grow your own rust",
      emoji: "🔩",
      materials: [
        "A small piece of plain steel wool (no soap)",
        "A saucer or jar lid",
        "Water",
        "A little vinegar",
      ],
      steps: [
        "Dip the steel wool in vinegar for one minute to strip off its protective coating.",
        "Squeeze out the extra vinegar and lay the steel wool on the saucer.",
        "Sprinkle a little water over it so it is damp but not flooded.",
        "Leave it somewhere safe and check it each day for three days.",
      ],
      science:
        "Iron in the steel reacts slowly with oxygen and water to form iron oxide — rust. It is the same kind of reaction as burning, but thousands of times slower, so it gives off heat too gently to feel. Rust is a new substance, flaky and orange, totally unlike the shiny metal you started with.",
      safety:
        "Steel wool has sharp tiny fibres — handle it carefully and wash your hands afterwards. Do not use the soapy cleaning kind.",
    },
  ],
  bonusDiagrams: [
    {
      title: "Conservation of mass",
      svg: `<svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A sealed flask of reactants weighs the same as the products after reacting, shown on balanced scales">
  <rect x="0" y="0" width="400" height="220" fill="#ffffff"/>
  <text x="200" y="24" font-family="sans-serif" font-size="15" font-weight="bold" text-anchor="middle" fill="#1f2937">Nothing is lost: mass stays the same</text>
  <line x1="40" y1="170" x2="360" y2="170" stroke="#374151" stroke-width="3"/>
  <polygon points="200,120 185,170 215,170" fill="#374151"/>
  <line x1="80" y1="120" x2="320" y2="120" stroke="#374151" stroke-width="3"/>
  <circle cx="110" cy="100" r="22" fill="#bfdbfe" stroke="#1d4ed8" stroke-width="2"/>
  <text x="110" y="105" font-family="sans-serif" font-size="12" text-anchor="middle" fill="#1e3a8a">A + B</text>
  <circle cx="290" cy="100" r="22" fill="#fde68a" stroke="#b45309" stroke-width="2"/>
  <text x="290" y="105" font-family="sans-serif" font-size="13" text-anchor="middle" fill="#7c2d12">AB</text>
  <text x="110" y="200" font-family="sans-serif" font-size="12" text-anchor="middle" fill="#374151">Reactants 50 g</text>
  <text x="290" y="200" font-family="sans-serif" font-size="12" text-anchor="middle" fill="#374151">Products 50 g</text>
</svg>`,
      caption:
        "In a sealed container the atoms only rearrange, they are never created or destroyed, so the total mass before equals the total mass after.",
    },
    {
      title: "Exothermic vs endothermic",
      svg: `<svg viewBox="0 0 420 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Energy arrows showing an exothermic reaction releasing heat outward and an endothermic reaction taking heat inward">
  <rect x="0" y="0" width="420" height="200" fill="#ffffff"/>
  <rect x="30" y="60" width="120" height="80" rx="8" fill="#fee2e2" stroke="#dc2626" stroke-width="2"/>
  <text x="90" y="48" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#991b1b">Exothermic</text>
  <text x="90" y="105" font-family="sans-serif" font-size="12" text-anchor="middle" fill="#991b1b">gives out heat</text>
  <line x1="150" y1="80" x2="200" y2="70" stroke="#dc2626" stroke-width="3"/>
  <polygon points="200,70 188,66 190,78" fill="#dc2626"/>
  <line x1="150" y1="120" x2="200" y2="130" stroke="#dc2626" stroke-width="3"/>
  <polygon points="200,130 188,122 190,134" fill="#dc2626"/>
  <rect x="270" y="60" width="120" height="80" rx="8" fill="#dbeafe" stroke="#2563eb" stroke-width="2"/>
  <text x="330" y="48" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#1e40af">Endothermic</text>
  <text x="330" y="105" font-family="sans-serif" font-size="12" text-anchor="middle" fill="#1e40af">takes in heat</text>
  <line x1="220" y1="70" x2="270" y2="80" stroke="#2563eb" stroke-width="3"/>
  <polygon points="270,80 258,72 256,84" fill="#2563eb"/>
  <line x1="220" y1="130" x2="270" y2="120" stroke="#2563eb" stroke-width="3"/>
  <polygon points="270,120 258,116 256,128" fill="#2563eb"/>
</svg>`,
      caption:
        "Exothermic reactions release energy so they feel warm, while endothermic reactions absorb energy so they feel cold.",
    },
  ],
};
