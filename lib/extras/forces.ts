import type { TopicExtras } from "../types";

// Engagement extras for forces. Content (hook, didYouKnow, experiments,
// bonusDiagrams) is filled by a content agent; interactive widget is wired here.
export const forcesExtras: TopicExtras = {
  interactive: "forces-lab",
  hook: "Drop a hammer and a feather at the same moment and the hammer wins easily. But take them to the airless Moon, as the Apollo astronauts actually did, and they hit the ground together. So is it really the feather's lightness that makes it lose the race on Earth?",
  didYouKnow: [
    "On the airless Moon a hammer and a feather fall side by side and land at exactly the same time, because with no air resistance gravity speeds up everything at the same rate.",
    "Your weight would be about six times smaller on the Moon, so an Earth high-jump champion could clear a small house there, yet their mass would be completely unchanged.",
    "A single ice skate blade presses on the ice with such a tiny area that the pressure underneath it is enormous, which is part of why skating feels so slippery.",
    "Geckos can hang from glass using billions of microscopic hairs on their feet that grip with tiny electrostatic-style forces, a non-contact effect scaled up by sheer numbers.",
    "Without friction you could not even strike a match, tie a knot or walk across the room, so a totally frictionless world would be impossible to live in.",
  ],
  experiments: [
    {
      title: "Make your own newtonmeter",
      emoji: "🪀",
      materials: [
        "A rubber band or a soft spring",
        "A paper clip and a small plastic cup or bag",
        "A ruler",
        "A few identical coins or small weights",
        "Sticky tape and a pencil",
      ],
      steps: [
        "Hang the rubber band from a fixed point (like a pencil taped across the top of a doorway or shelf) and attach the cup to the bottom with the paper clip.",
        "Hold the ruler next to the band and mark the starting position of the bottom of the cup.",
        "Add one coin and measure how far the band has stretched (the extension).",
        "Add the coins one at a time, measuring the extension each time, and write the numbers in a table.",
        "Look at your results: each equal coin should add roughly the same extra stretch.",
      ],
      science:
        "You have built a simple newtonmeter. Each coin adds the same downward force, and Hooke's law tells us the extension is proportional to the force, so equal coins give equal extra stretches. If you keep piling on coins the band will eventually stop following this neat pattern, which is what happens past the elastic limit.",
      safety:
        "Do not over-stretch the rubber band or stand directly under a heavy load, as bands can snap. Use light coins, not heavy weights.",
    },
    {
      title: "The pressure pin test",
      emoji: "🎈",
      materials: [
        "Two identical balloons, blown up",
        "One drawing pin",
        "A board with lots of pins or nails pushed through (optional, ask an adult)",
        "A wooden skewer and a little cooking oil (optional)",
      ],
      steps: [
        "Gently press a single balloon against the point of one drawing pin and push lightly.",
        "Notice how quickly it pops, even with a very small push.",
        "If you have a bed of many pins, press a balloon down evenly onto all of them at once and watch what happens.",
        "Compare: one sharp point pops the balloon easily, but the same force shared over many points often does not.",
      ],
      science:
        "A single pin has a tiny contact area, so even a small force gives a very high pressure (pressure = force / area) that bursts the balloon. Spread the same force over many points, or a large flat surface, and the pressure at each point is small enough that the balloon survives. This is the same idea that lets a person lie on a bed of nails unharmed.",
      safety:
        "Pins are sharp. Push gently, keep fingers clear of the points, and ask an adult to help set up any bed of nails.",
    },
  ],
  bonusDiagrams: [
    {
      title: "Free body diagram of a falling skydiver",
      svg: `<svg viewBox="0 0 320 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A skydiver with a small weight arrow and small drag arrow speeding up, then equal weight and drag arrows at terminal speed">
  <rect x="0" y="0" width="320" height="240" fill="#ffffff"/>
  <text x="160" y="22" font-family="sans-serif" font-size="15" font-weight="bold" text-anchor="middle" fill="#1f2937">Forces on a falling skydiver</text>
  <text x="85" y="48" font-family="sans-serif" font-size="12" font-weight="bold" text-anchor="middle" fill="#b45309">Speeding up</text>
  <circle cx="85" cy="95" r="14" fill="#fde68a" stroke="#b45309" stroke-width="2"/>
  <line x1="85" y1="55" x2="85" y2="80" stroke="#2563eb" stroke-width="3"/>
  <polygon points="85,55 80,66 90,66" fill="#2563eb"/>
  <text x="118" y="68" font-family="sans-serif" font-size="10" fill="#1e3a8a">small drag</text>
  <line x1="85" y1="110" x2="85" y2="165" stroke="#dc2626" stroke-width="3"/>
  <polygon points="85,165 80,154 90,154" fill="#dc2626"/>
  <text x="118" y="150" font-family="sans-serif" font-size="10" fill="#991b1b">weight</text>
  <text x="85" y="195" font-family="sans-serif" font-size="10" text-anchor="middle" fill="#374151">weight &gt; drag</text>
  <text x="235" y="48" font-family="sans-serif" font-size="12" font-weight="bold" text-anchor="middle" fill="#166534">Terminal speed</text>
  <circle cx="235" cy="105" r="14" fill="#fde68a" stroke="#b45309" stroke-width="2"/>
  <line x1="235" y1="45" x2="235" y2="90" stroke="#2563eb" stroke-width="3"/>
  <polygon points="235,45 230,56 240,56" fill="#2563eb"/>
  <text x="268" y="70" font-family="sans-serif" font-size="10" fill="#1e3a8a">big drag</text>
  <line x1="235" y1="120" x2="235" y2="165" stroke="#dc2626" stroke-width="3"/>
  <polygon points="235,165 230,154 240,154" fill="#dc2626"/>
  <text x="268" y="150" font-family="sans-serif" font-size="10" fill="#991b1b">weight</text>
  <text x="235" y="195" font-family="sans-serif" font-size="10" text-anchor="middle" fill="#374151">weight = drag (balanced)</text>
</svg>`,
      caption:
        "At first weight is bigger than drag, so the skydiver speeds up. As speed rises, drag grows until it balances weight and the skydiver falls at a steady terminal speed.",
    },
    {
      title: "Why area changes pressure",
      svg: `<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="The same weight on a small area gives high pressure and sinks, while on a large area it gives low pressure and rests on the surface">
  <rect x="0" y="0" width="320" height="200" fill="#ffffff"/>
  <text x="160" y="22" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#1f2937">Same weight, different area</text>
  <rect x="55" y="45" width="40" height="40" fill="#fca5a5" stroke="#dc2626" stroke-width="2"/>
  <text x="75" y="40" font-family="sans-serif" font-size="10" text-anchor="middle" fill="#991b1b">500 N</text>
  <polygon points="70,85 80,85 75,120" fill="#9ca3af" stroke="#6b7280"/>
  <rect x="30" y="120" width="90" height="40" fill="#fde68a"/>
  <line x1="75" y1="120" x2="75" y2="150" stroke="#7f1d1d" stroke-width="2" stroke-dasharray="3 2"/>
  <text x="75" y="180" font-family="sans-serif" font-size="10" text-anchor="middle" fill="#374151">small area: sinks</text>
  <rect x="205" y="45" width="40" height="40" fill="#bfdbfe" stroke="#1d4ed8" stroke-width="2"/>
  <text x="225" y="40" font-family="sans-serif" font-size="10" text-anchor="middle" fill="#1e3a8a">500 N</text>
  <rect x="195" y="85" width="60" height="14" fill="#9ca3af" stroke="#6b7280"/>
  <rect x="180" y="120" width="90" height="40" fill="#fde68a"/>
  <text x="225" y="180" font-family="sans-serif" font-size="10" text-anchor="middle" fill="#374151">large area: rests on top</text>
</svg>`,
      caption:
        "The same 500 N weight on a small area gives a high pressure and sinks in, but spread over a large area it gives a low pressure and stays on the surface.",
    },
  ],
};
