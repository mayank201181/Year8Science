import type { TopicExtras } from "../types";

// Engagement extras for digestion. Content (hook, didYouKnow, experiments,
// bonusDiagrams) is filled by a content agent; interactive widget is wired here.
export const digestionExtras: TopicExtras = {
  hook: "Right now, coiled up inside you, is a tube about the length of a small car turned on its end — and a sandwich you ate at lunch is being taken apart, molecule by molecule, by acid strong enough to dissolve metal. So why doesn't your stomach simply digest itself?",
  didYouKnow: [
    "Your small intestine is about 6–7 metres long, but it folds up to fit inside you — and its inner wall has so many tiny finger-like folds that, spread flat, the lining would cover an area roughly the size of a tennis court.",
    "Stomach acid is hydrochloric acid with a pH of around 1.5–2, strong enough to dissolve a razor blade over time — your stomach protects itself by making a fresh layer of slimy mucus every few days.",
    "It takes food roughly 24–72 hours to travel all the way through you, but it leaves your stomach in just 2–4 hours.",
    "The muscular squeezing called peristalsis means you could swallow and digest a meal even while hanging upside down — gravity is not what moves food along.",
    "You make around 1–1.5 litres of saliva every single day, and it already contains an enzyme (amylase) that starts breaking down starch before food even leaves your mouth.",
  ],
  experiments: [
    {
      title: "Stomach in a Bag",
      emoji: "🥪",
      materials: [
        "A strong zip-lock sandwich bag",
        "A slice of bread or a few crackers",
        "A small cup of water (or watery juice)",
        "A bit of squeezing power from your hands",
      ],
      steps: [
        "Tear the bread into small pieces and drop them into the bag — this is like your teeth doing the first cutting.",
        "Pour in enough water to make everything wet and slushy, then push out the extra air and seal the bag tightly.",
        "Squeeze, squish and roll the bag with your hands for a couple of minutes — keep the food moving the way muscles move it.",
        "Look at what is left: a soft, soupy mush instead of solid bread.",
      ],
      science: "Your hands act like the muscles of your stomach wall, squeezing in a wave called peristalsis, while the water stands in for digestive juices. Together they turn solid food into a smooth liquid mush called chyme. This mechanical breakdown gives enzymes a huge wet surface to work on so chemical digestion can happen faster.",
      safety: "Use a clean bag and clean food; do not eat the squished mush afterwards.",
    },
    {
      title: "Spit Attack on Starch",
      emoji: "💧",
      materials: [
        "A plain cracker or a small piece of white bread",
        "Your own clean mouth",
        "A timer or clock",
      ],
      steps: [
        "Put a small piece of cracker on your tongue but do NOT chew or swallow it yet.",
        "Let it sit and mix with your saliva, holding it there for about a minute (longer if you can).",
        "Notice the taste slowly changing as the minute goes by.",
        "Now compare: the cracker started bland, but it begins to taste slightly sweet.",
      ],
      science: "Crackers are made of starch, which is a long chain of sugar molecules with almost no taste. An enzyme in your saliva called amylase snips the starch chain into small sugar molecules called maltose, which your tongue can taste as sweet. This proves chemical digestion begins in the mouth, not the stomach.",
    },
  ],
  bonusDiagrams: [
    {
      title: "The Journey of Food",
      svg: `<svg viewBox="0 0 360 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Diagram of the digestive system showing the path of food from mouth to large intestine">
  <rect x="0" y="0" width="360" height="240" fill="#fffdf7"/>
  <ellipse cx="80" cy="28" rx="26" ry="14" fill="#f4b6b6" stroke="#b35858" stroke-width="2"/>
  <text x="80" y="32" font-size="11" text-anchor="middle" fill="#5a2a2a">Mouth</text>
  <rect x="72" y="42" width="16" height="62" rx="6" fill="#f6c9a0" stroke="#b07a3a" stroke-width="2"/>
  <text x="120" y="78" font-size="10" fill="#6a4a1a">Oesophagus</text>
  <path d="M80 104 q40 12 36 44 q-4 24 -34 24 q-26 0 -26 -24 q0 -28 24 -44 Z" fill="#f4a3a3" stroke="#a84747" stroke-width="2"/>
  <text x="150" y="138" font-size="10" fill="#5a2a2a">Stomach (acid)</text>
  <path d="M70 176 q-30 8 -30 30 q0 26 30 26 q34 0 34 -26 q0 -22 -22 -26" fill="none" stroke="#c98b3a" stroke-width="9" stroke-linecap="round"/>
  <text x="130" y="206" font-size="10" fill="#6a4a1a">Small intestine</text>
  <path d="M40 206 q-18 0 -18 -40 q0 -36 18 -36" fill="none" stroke="#9a7a4a" stroke-width="11" stroke-linecap="round"/>
  <text x="250" y="226" font-size="10" fill="#4a3a1a">Large intestine wraps around</text>
  <line x1="106" y1="28" x2="150" y2="28" stroke="#888" stroke-width="1"/>
  <text x="155" y="32" font-size="10" fill="#444">Food enters here</text>
</svg>`,
      caption: "Food travels in one direction through a long muscular tube, getting broken down a bit more at each stop.",
    },
    {
      title: "Villi: Tiny Folds That Soak Up Food",
      svg: `<svg viewBox="0 0 360 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Diagram of villi, the finger-like folds lining the small intestine that absorb digested food">
  <rect x="0" y="0" width="360" height="200" fill="#fffdf7"/>
  <rect x="20" y="120" width="320" height="50" fill="#f6d8c0" stroke="#b07a3a" stroke-width="2"/>
  <text x="180" y="160" font-size="11" text-anchor="middle" fill="#6a4a1a">Intestine wall</text>
  <path d="M40 120 q12 -70 24 0 Z" fill="#f4a3a3" stroke="#a84747" stroke-width="1.5"/>
  <path d="M80 120 q12 -80 24 0 Z" fill="#f4a3a3" stroke="#a84747" stroke-width="1.5"/>
  <path d="M120 120 q12 -70 24 0 Z" fill="#f4a3a3" stroke="#a84747" stroke-width="1.5"/>
  <path d="M160 120 q12 -82 24 0 Z" fill="#f4a3a3" stroke="#a84747" stroke-width="1.5"/>
  <path d="M200 120 q12 -72 24 0 Z" fill="#f4a3a3" stroke="#a84747" stroke-width="1.5"/>
  <path d="M240 120 q12 -80 24 0 Z" fill="#f4a3a3" stroke="#a84747" stroke-width="1.5"/>
  <path d="M280 120 q12 -70 24 0 Z" fill="#f4a3a3" stroke="#a84747" stroke-width="1.5"/>
  <line x1="172" y1="60" x2="172" y2="20" stroke="#444" stroke-width="1"/>
  <text x="178" y="24" font-size="10" fill="#444">Each fold is a villus</text>
  <line x1="296" y1="80" x2="330" y2="80" stroke="#2a7a2a" stroke-width="1.5"/>
  <text x="200" y="95" font-size="9" fill="#2a7a2a">food soaks in here</text>
</svg>`,
      caption: "Thousands of finger-like villi give the gut a massive surface area, so digested food can be absorbed into the blood quickly.",
    },
  ],
};
