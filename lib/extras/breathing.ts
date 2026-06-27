import type { TopicExtras } from "../types";

// Engagement extras for breathing. Content (hook, didYouKnow, experiments,
// bonusDiagrams) is filled by a content agent; interactive widget is wired here.
export const breathingExtras: TopicExtras = {
  interactive: "breathing-lab",
  hook: "You breathe about 22,000 times a day without ever deciding to — but your lungs have no muscles of their own and can't pull in a single breath by themselves. So what is the hidden muscle that sucks the air in, and why would your lungs be useless on the surface of the Moon?",
  didYouKnow: [
    "If you unfolded all the tiny air sacs (alveoli) in your lungs and laid them out flat, they would cover an area about the size of a tennis court.",
    "Your lungs are not symmetrical — the left lung is smaller and has only two sections instead of three, to leave room for your heart.",
    "You don't breathe in because your body 'wants oxygen' — the urge to breathe is actually triggered by rising carbon dioxide in your blood, which is why you can't hold your breath forever.",
    "Air rushes into your lungs because your diaphragm flattening makes the space bigger and the pressure inside LOWER than the air outside — you don't really 'pull' air, the outside air pushes in.",
    "Astronauts can't breathe in space because there is almost no air pressure outside to push gas into their lungs — without a pressurised suit, breathing simply wouldn't work no matter how hard they tried.",
  ],
  experiments: [
    {
      title: "Build a Working Model of a Lung",
      emoji: "🫁",
      materials: [
        "A clear plastic bottle with the bottom cut off (ask an adult to cut it)",
        "A drinking straw or short bendy tube",
        "Two balloons",
        "A rubber band",
        "Modelling clay or sticky tack",
      ],
      steps: [
        "Push one balloon a little way into the bottle and stretch its neck over the top of the straw, sealing with the rubber band so the balloon hangs inside like a lung.",
        "Lower the straw through the bottle's neck so the balloon dangles inside, and seal around the straw with modelling clay to make it airtight.",
        "Cut the second balloon in half and stretch the wide part tightly across the open bottom of the bottle — this is your diaphragm.",
        "Gently pull the stretched bottom balloon downwards and watch the balloon-lung inside.",
        "Push the bottom balloon back up and watch the lung deflate, then repeat slowly.",
      ],
      science:
        "Pulling the bottom 'diaphragm' down makes the space inside the bottle bigger, lowering the air pressure around the balloon-lung. The higher-pressure air outside then pushes in through the straw and inflates the lung — exactly how breathing in works. Pushing the diaphragm back up squeezes the air out, just like breathing out.",
      safety: "Ask an adult to cut the bottle, as the plastic edges can be sharp.",
    },
    {
      title: "Measure Your Lung Power",
      emoji: "🌬️",
      materials: [
        "A large bowl of water",
        "A clear 1.5–2 litre bottle filled with water",
        "A length of bendy tube or a long straw",
        "A marker pen",
      ],
      steps: [
        "Half-fill the bowl with water and stand the full bottle upside-down in it, holding the cap on until the neck is underwater, then remove the cap without letting air in.",
        "Slide one end of the tube up into the bottle neck while it stays underwater.",
        "Take the biggest breath you can, then blow steadily through the other end of the tube in one long breath.",
        "Watch your breath bubble up and push the water out of the bottle, leaving a pocket of air.",
        "Mark the new water level and compare with a friend or family member.",
      ],
      science:
        "The air you breathe out pushes water out of the bottle and takes its place, so the size of the air pocket shows roughly how much air your lungs can move in one breath — your 'vital capacity'. Bigger or fitter lungs can usually shift more air, which is why athletes often record larger volumes.",
      safety: "Don't breathe IN through the tube — only blow out gently.",
    },
  ],
  bonusDiagrams: [
    {
      title: "Breathing in vs breathing out",
      svg: `<svg viewBox="0 0 420 230" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Two diagrams comparing the lungs and diaphragm when breathing in and breathing out">
  <rect x="0" y="0" width="420" height="230" fill="#eef4fb"/>
  <text x="105" y="25" font-size="13" text-anchor="middle" fill="#1f4e79">Breathing IN</text>
  <ellipse cx="80" cy="95" rx="28" ry="45" fill="#a8d0f0" stroke="#1f6aa8" stroke-width="2"/>
  <ellipse cx="130" cy="95" rx="28" ry="45" fill="#a8d0f0" stroke="#1f6aa8" stroke-width="2"/>
  <path d="M45 155 q60 25 120 0" fill="none" stroke="#b03a3a" stroke-width="5"/>
  <line x1="105" y1="175" x2="105" y2="200" stroke="#b03a3a" stroke-width="3" marker-end="url(#d)"/>
  <text x="105" y="218" font-size="10" text-anchor="middle" fill="#b03a3a">diaphragm flattens (down)</text>
  <text x="315" y="25" font-size="13" text-anchor="middle" fill="#1f4e79">Breathing OUT</text>
  <ellipse cx="290" cy="100" rx="24" ry="38" fill="#cfe2f5" stroke="#1f6aa8" stroke-width="2"/>
  <ellipse cx="338" cy="100" rx="24" ry="38" fill="#cfe2f5" stroke="#1f6aa8" stroke-width="2"/>
  <path d="M255 150 q60 -30 120 0" fill="none" stroke="#b03a3a" stroke-width="5"/>
  <line x1="315" y1="170" x2="315" y2="148" stroke="#b03a3a" stroke-width="3" marker-end="url(#d)"/>
  <text x="315" y="200" font-size="10" text-anchor="middle" fill="#b03a3a">diaphragm domes (up)</text>
  <defs>
    <marker id="d" markerWidth="9" markerHeight="9" refX="4" refY="7" orient="auto">
      <path d="M0,0 L8,0 L4,8 Z" fill="#b03a3a"/>
    </marker>
  </defs>
</svg>`,
      caption:
        "Breathing in: the diaphragm flattens and pulls down, the chest gets bigger and air rushes in. Breathing out: the diaphragm domes up, the chest gets smaller and air is pushed out.",
    },
    {
      title: "Gas swap inside an alveolus",
      svg: `<svg viewBox="0 0 380 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="An air sac next to a blood capillary showing oxygen moving into the blood and carbon dioxide moving out">
  <rect x="0" y="0" width="380" height="220" fill="#fdeef0"/>
  <circle cx="110" cy="110" r="75" fill="#ffffff" stroke="#1f6aa8" stroke-width="3"/>
  <text x="110" y="115" font-size="12" text-anchor="middle" fill="#1f6aa8">Air sac</text>
  <rect x="230" y="40" width="55" height="140" rx="25" fill="#f3a6a6" stroke="#b03a3a" stroke-width="3"/>
  <text x="320" y="115" font-size="12" text-anchor="middle" fill="#b03a3a">Blood</text>
  <line x1="180" y1="95" x2="235" y2="95" stroke="#1f6aa8" stroke-width="3" marker-end="url(#g)"/>
  <text x="200" y="85" font-size="11" text-anchor="middle" fill="#1f6aa8">O2 in</text>
  <line x1="235" y1="135" x2="180" y2="135" stroke="#444" stroke-width="3" marker-end="url(#g)"/>
  <text x="205" y="155" font-size="11" text-anchor="middle" fill="#444">CO2 out</text>
  <defs>
    <marker id="g" markerWidth="9" markerHeight="9" refX="7" refY="4" orient="auto">
      <path d="M0,0 L8,4 L0,8 Z" fill="#444"/>
    </marker>
  </defs>
</svg>`,
      caption:
        "Oxygen passes from the air sac into the blood, while carbon dioxide passes out of the blood to be breathed away — the walls are extremely thin so gases swap quickly.",
    },
  ],
};
