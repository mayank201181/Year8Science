import type { TopicExtras } from "../types";

// Engagement extras for light. Content (hook, didYouKnow, experiments,
// bonusDiagrams) is filled by a content agent; interactive widget is wired here.
export const lightExtras: TopicExtras = {
  interactive: "light-ray",
  hook: "Dip a straight pencil into a glass of water and it suddenly looks snapped in half — yet pull it out and it is perfectly whole. What is breaking the light on its way to your eye?",
  didYouKnow: [
    "Light is the fastest thing in the universe, travelling about 300,000 kilometres every second — fast enough to circle the Earth seven and a half times in one tick of a clock.",
    "When you look at the stars you are looking into the past: the light from some stars set off so long ago that the star may have already died before its glow reaches you.",
    "Sunlight takes roughly 8 minutes and 20 seconds to reach Earth, so you always see the Sun where it was, not where it is now.",
    "The sky is blue because air scatters short blue wavelengths much more than red ones; at sunset the light travels through more air, the blue is scattered away, and the leftover reds and oranges reach your eyes.",
    "Your eye does not see colour the way a screen makes it — it has just three kinds of colour-detecting cone cells (red, green and blue), and your brain mixes their signals into every shade you experience.",
  ],
  experiments: [
    {
      title: "The Bending Pencil",
      emoji: "🥤",
      materials: ["A clear glass", "Water", "A straight pencil or a straw"],
      steps: [
        "Fill the glass about three-quarters full with water.",
        "Stand the pencil upright in the glass and look at it straight on from the side.",
        "Notice how the part underwater looks shifted, fatter or even broken from the part above the water.",
        "Slowly look from different angles and watch the 'break' move.",
      ],
      science:
        "Light travels more slowly in water than in air, so when light rays leave the water and enter the air they change direction. This bending is called refraction, and it makes the underwater part of the pencil appear to be in a different place than it really is.",
    },
    {
      title: "Catch a Rainbow With a CD",
      emoji: "🌈",
      materials: ["An old CD or DVD", "A bright lamp or sunlight from a window"],
      steps: [
        "Hold the shiny side of the CD up towards a bright light.",
        "Tilt it slowly back and forth until you see bands of colour appear.",
        "Move the CD to spread the colours across a wall or your hand.",
      ],
      science:
        "White light is actually a mixture of all the colours of the rainbow. The tiny grooves on a CD split that white light into its separate colours by bending each colour by a slightly different amount, a process called dispersion — the same effect a glass prism produces.",
    },
  ],
  bonusDiagrams: [
    {
      title: "Refraction at a boundary",
      svg: `<svg viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A light ray bending as it passes from air into water">
  <rect x="0" y="0" width="300" height="100" fill="#e8f4ff" />
  <rect x="0" y="100" width="300" height="100" fill="#bcdcff" />
  <line x1="0" y1="100" x2="300" y2="100" stroke="#3b6ea5" stroke-width="2" />
  <line x1="150" y1="0" x2="150" y2="200" stroke="#888" stroke-width="1" stroke-dasharray="4 4" />
  <line x1="60" y1="20" x2="150" y2="100" stroke="#e07b00" stroke-width="3" />
  <polygon points="150,100 144,90 138,98" fill="#e07b00" />
  <line x1="150" y1="100" x2="210" y2="190" stroke="#e07b00" stroke-width="3" />
  <polygon points="210,190 200,186 204,178" fill="#e07b00" />
  <text x="20" y="40" font-size="12" fill="#333">Air</text>
  <text x="20" y="130" font-size="12" fill="#333">Water</text>
  <text x="155" y="20" font-size="11" fill="#555">normal</text>
  <text x="70" y="65" font-size="11" fill="#e07b00">incoming ray</text>
  <text x="160" y="160" font-size="11" fill="#e07b00">bent ray</text>
</svg>`,
      caption:
        "Light slows down as it enters the denser water and bends towards the normal line. This bending is refraction.",
    },
    {
      title: "Splitting white light with a prism",
      svg: `<svg viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A prism splitting white light into a rainbow of colours">
  <line x1="0" y1="80" x2="110" y2="80" stroke="#444" stroke-width="3" />
  <text x="10" y="70" font-size="11" fill="#444">white light</text>
  <polygon points="120,40 120,140 175,90" fill="#dfe9f5" stroke="#7f9cc0" stroke-width="2" />
  <text x="125" y="100" font-size="11" fill="#555">prism</text>
  <line x1="165" y1="88" x2="290" y2="55" stroke="#e21b1b" stroke-width="2" />
  <line x1="165" y1="89" x2="290" y2="72" stroke="#ff8a00" stroke-width="2" />
  <line x1="165" y1="90" x2="290" y2="89" stroke="#e8c800" stroke-width="2" />
  <line x1="165" y1="91" x2="290" y2="106" stroke="#2faa2f" stroke-width="2" />
  <line x1="165" y1="92" x2="290" y2="123" stroke="#1b6be2" stroke-width="2" />
  <line x1="165" y1="93" x2="290" y2="140" stroke="#7a1be2" stroke-width="2" />
  <text x="225" y="45" font-size="10" fill="#444">red</text>
  <text x="225" y="155" font-size="10" fill="#444">violet</text>
</svg>`,
      caption:
        "A prism bends each colour by a different amount, fanning white light out into the visible spectrum.",
    },
  ],
};
