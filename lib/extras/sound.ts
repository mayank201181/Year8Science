import type { TopicExtras } from "../types";

// Engagement extras for sound. Content (hook, didYouKnow, experiments,
// bonusDiagrams) is filled by a content agent; interactive widget is wired here.
export const soundExtras: TopicExtras = {
  interactive: "sound-wave",
  hook: "Out in space, a star can explode with the force of billions of bombs and you would hear absolutely nothing. Why does the loudest event imaginable make total silence?",
  didYouKnow: [
    "Sound cannot travel through empty space because it needs something to vibrate; in the vacuum of space there is nothing to carry the wave, so no one can hear an explosion.",
    "Sound travels about four times faster in water than in air, which is how whales can call to each other across hundreds of kilometres of ocean.",
    "Some sounds are too high for humans to hear at all — dogs hear pitches almost twice as high as we can, and bats use ultrasound far above our limit to 'see' in the dark with echoes.",
    "Elephants make rumbles so low you cannot hear them, and they can sense these vibrations through their feet from kilometres away.",
    "The 'crack' of a whip is a tiny sonic boom: the tip moves faster than the speed of sound, breaking the sound barrier in your back garden.",
  ],
  experiments: [
    {
      title: "Dancing Rice Drum",
      emoji: "🥁",
      materials: [
        "A bowl",
        "Cling film (plastic wrap)",
        "A few grains of dry rice",
        "A metal baking tray and a wooden spoon",
      ],
      steps: [
        "Stretch the cling film tightly over the top of the bowl so it makes a flat drum skin.",
        "Sprinkle a few grains of rice on top of the cling film.",
        "Hold the baking tray close to the bowl (but not touching it) and bang it with the wooden spoon.",
        "Watch the rice jump and dance without anything touching it.",
      ],
      science:
        "The bang sends sound waves through the air. When these waves hit the stretched cling film they make it vibrate up and down, and that vibration flicks the rice into the air. It shows that sound is a vibration travelling through the air.",
    },
    {
      title: "Cup-and-String Telephone",
      emoji: "📞",
      materials: [
        "Two paper or plastic cups",
        "A long piece of string (a few metres)",
        "A sharp pencil to make holes (ask an adult)",
      ],
      steps: [
        "Make a small hole in the bottom of each cup.",
        "Thread one end of the string through each cup and tie a knot inside so it cannot pull back out.",
        "Each person takes a cup and walks apart until the string is pulled tight and straight.",
        "One person talks into their cup while the other holds their cup to their ear and listens.",
      ],
      science:
        "When you speak, your voice makes the bottom of the cup vibrate. These vibrations travel along the tight string as a sound wave and shake the second cup, which your ear hears as sound. If the string is loose the vibrations cannot pass along it, so the line goes 'dead'.",
    },
  ],
  bonusDiagrams: [
    {
      title: "A sound wave is squashes and stretches",
      svg: `<svg viewBox="0 0 300 160" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A speaker creating compressions and rarefactions of air particles">
  <rect x="10" y="55" width="30" height="50" fill="#444" />
  <polygon points="40,55 70,40 70,120 40,105" fill="#777" />
  <text x="12" y="135" font-size="11" fill="#333">speaker</text>
  <circle cx="95" cy="80" r="3" fill="#1b6be2" />
  <circle cx="100" cy="80" r="3" fill="#1b6be2" />
  <circle cx="105" cy="80" r="3" fill="#1b6be2" />
  <circle cx="130" cy="80" r="3" fill="#1b6be2" />
  <circle cx="160" cy="80" r="3" fill="#1b6be2" />
  <circle cx="195" cy="80" r="3" fill="#1b6be2" />
  <circle cx="200" cy="80" r="3" fill="#1b6be2" />
  <circle cx="205" cy="80" r="3" fill="#1b6be2" />
  <circle cx="235" cy="80" r="3" fill="#1b6be2" />
  <circle cx="265" cy="80" r="3" fill="#1b6be2" />
  <text x="85" y="120" font-size="10" fill="#444">squashed</text>
  <text x="195" y="120" font-size="10" fill="#444">squashed</text>
  <text x="140" y="50" font-size="10" fill="#444">stretched</text>
  <line x1="80" y1="30" x2="290" y2="30" stroke="#888" stroke-width="1" />
  <polygon points="290,30 282,26 282,34" fill="#888" />
  <text x="120" y="22" font-size="10" fill="#444">wave travels this way</text>
</svg>`,
      caption:
        "A speaker pushes and pulls the air, making patches where particles are squashed together and patches where they are spread out. That pattern travelling along is a sound wave.",
    },
    {
      title: "High pitch versus low pitch",
      svg: `<svg viewBox="0 0 300 180" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Two waves comparing a high pitch with many waves to a low pitch with few waves">
  <line x1="10" y1="45" x2="290" y2="45" stroke="#ccc" stroke-width="1" />
  <path d="M10 45 Q22 15 34 45 Q46 75 58 45 Q70 15 82 45 Q94 75 106 45 Q118 15 130 45 Q142 75 154 45 Q166 15 178 45 Q190 75 202 45 Q214 15 226 45 Q238 75 250 45 Q262 15 274 45 Q286 75 298 45" fill="none" stroke="#e21b1b" stroke-width="2" />
  <text x="10" y="95" font-size="11" fill="#333">High pitch: waves close together</text>
  <line x1="10" y1="135" x2="290" y2="135" stroke="#ccc" stroke-width="1" />
  <path d="M10 135 Q45 95 80 135 Q115 175 150 135 Q185 95 220 135 Q255 175 290 135" fill="none" stroke="#1b6be2" stroke-width="2" />
  <text x="10" y="172" font-size="11" fill="#333">Low pitch: waves spread apart</text>
</svg>`,
      caption:
        "More waves squeezed into the same space means a higher pitch (frequency); fewer, wider waves mean a lower pitch.",
    },
  ],
};
