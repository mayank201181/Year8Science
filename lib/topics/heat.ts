import type { Topic } from "../types";

export const heat: Topic = {
  id: "heat",
  title: "Heat & Temperature",
  subject: "Physics",
  icon: "🌡️",
  summary: "Conduction, convection, radiation and thermal energy.",
  intro:
    "Every time you warm your hands on a mug, feel a sea breeze, or wrap up in a coat, you are using the physics of heat. In this topic you will learn the difference between heat and temperature, how thermal energy flows from hot to cold by conduction, convection and radiation, and how clever insulation traps energy where we want it.",

  guide: [
    {
      id: "heat-vs-temp",
      heading: "Heat is not the same as temperature",
      body:
        "**Temperature** tells you *how hot* something is. It is measured in degrees Celsius (**°C**) with a thermometer. **Heat** is a *type of energy* called **thermal energy**, and like all energy it is measured in **joules (J)**.\n\nThe two are different. A spark from a sparkler can be over 1000 °C but carries almost no thermal energy, so it does not hurt you. A warm bath is only about 40 °C but holds a huge amount of thermal energy because there is so much water.\n\nThe golden rule: **thermal energy always flows from the hotter object to the colder object**, never the other way. It keeps flowing until both objects reach the same temperature — we say they are in *thermal equilibrium*.\n\n- Temperature = how hot, measured in °C\n- Heat (thermal energy) = energy, measured in J\n- Energy flows hot → cold until temperatures match",
      diagram:
        '<svg viewBox="0 0 260 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Thermal energy flowing from a hot object to a cold object"><rect x="15" y="35" width="70" height="55" rx="6" fill="#fee2e2" stroke="#ef4444"/><text x="50" y="58" font-size="11" text-anchor="middle" fill="#991b1b">HOT</text><text x="50" y="74" font-size="10" text-anchor="middle" fill="#991b1b">80 °C</text><rect x="175" y="35" width="70" height="55" rx="6" fill="#dbeafe" stroke="#3b82f6"/><text x="210" y="58" font-size="11" text-anchor="middle" fill="#1e3a8a">COLD</text><text x="210" y="74" font-size="10" text-anchor="middle" fill="#1e3a8a">20 °C</text><line x1="90" y1="62" x2="170" y2="62" stroke="#ea580c" stroke-width="3" marker-end="url(#ah1)"/><defs><marker id="ah1" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#ea580c"/></marker></defs><text x="130" y="52" font-size="9" text-anchor="middle" fill="#ea580c">thermal energy</text></svg>',
      diagramCaption: "Thermal energy always moves from the hotter object to the colder one.",
      keyPoints: [
        "Temperature is measured in °C; heat (thermal energy) is measured in J.",
        "Thermal energy flows from hot to cold until temperatures are equal.",
        "A small hot spark can have less thermal energy than a large warm object.",
      ],
      thinkDeeper:
        "A bath at 40 °C can scald you over time but a 1000 °C sparkler spark does not. If the spark is far hotter, why does the bath transfer more energy to your skin?",
    },
    {
      id: "particles",
      heading: "Particles and thermal energy",
      body:
        "Everything is made of tiny **particles** (atoms and molecules) that are always moving. The energy of this movement is called **kinetic energy**, and the total kinetic energy of all the particles is the object's **thermal energy**.\n\nWhen you heat something, you give its particles more kinetic energy, so they **move faster**. Temperature is really a measure of the *average* kinetic energy of the particles.\n\n- In a **solid**, particles vibrate about fixed positions; heating makes them vibrate faster and more widely.\n- In a **liquid**, particles are close but can move past each other; heating speeds them up.\n- In a **gas**, particles are far apart and move freely and fast; heating makes them move even faster.\n\nThis particle picture explains everything else in this topic: how energy is passed along, why fluids rise when heated, and why materials expand.",
      diagram:
        '<svg viewBox="0 0 260 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Particles moving slowly when cold and fast when hot"><rect x="10" y="20" width="110" height="85" rx="6" fill="#dbeafe" stroke="#3b82f6"/><text x="65" y="16" font-size="10" text-anchor="middle" fill="#1e3a8a">Cold (slow)</text><circle cx="35" cy="45" r="7" fill="#3b82f6"/><circle cx="65" cy="50" r="7" fill="#3b82f6"/><circle cx="95" cy="42" r="7" fill="#3b82f6"/><circle cx="45" cy="80" r="7" fill="#3b82f6"/><circle cx="85" cy="82" r="7" fill="#3b82f6"/><rect x="140" y="20" width="110" height="85" rx="6" fill="#fee2e2" stroke="#ef4444"/><text x="195" y="16" font-size="10" text-anchor="middle" fill="#991b1b">Hot (fast)</text><circle cx="165" cy="45" r="7" fill="#ef4444"/><circle cx="200" cy="52" r="7" fill="#ef4444"/><circle cx="230" cy="40" r="7" fill="#ef4444"/><circle cx="175" cy="82" r="7" fill="#ef4444"/><circle cx="215" cy="85" r="7" fill="#ef4444"/><line x1="165" y1="35" x2="165" y2="28" stroke="#991b1b" stroke-width="1.5"/><line x1="200" y1="42" x2="200" y2="35" stroke="#991b1b" stroke-width="1.5"/><line x1="230" y1="30" x2="230" y2="23" stroke="#991b1b" stroke-width="1.5"/></svg>',
      diagramCaption: "Heating gives particles more kinetic energy, so they move faster.",
      keyPoints: [
        "Thermal energy is the total kinetic energy of an object's particles.",
        "Heating makes particles move (vibrate) faster.",
        "Temperature measures the average kinetic energy of the particles.",
      ],
      thinkDeeper:
        "If temperature is the *average* particle energy, two objects can be at the same temperature but hold very different amounts of thermal energy. How can that be?",
    },
    {
      id: "conduction",
      heading: "Conduction: passing energy through solids",
      body:
        "**Conduction** is the transfer of thermal energy through a material *without the material itself moving along*. It is the main way energy travels through **solids**.\n\nWhen one end of a solid is heated, its particles vibrate faster. They bump into neighbouring particles and pass the energy along, like a row of people jostling each other. Step by step, the energy travels to the cold end.\n\n**Metals are the best conductors.** This is because metals contain **free electrons** — tiny charged particles that can move through the whole metal. They carry energy quickly from the hot end to the cold end, much faster than vibrations alone.\n\nMaterials are grouped as:\n- **Conductors** — let thermal energy pass easily (metals: copper, aluminium, iron).\n- **Insulators** — slow thermal energy down (wood, plastic, glass, air, wool). Many insulators trap pockets of air.",
      diagram:
        '<svg viewBox="0 0 260 110" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A metal bar heated at one end conducting energy to the cold end"><rect x="20" y="45" width="220" height="22" fill="#d1d5db" stroke="#6b7280"/><path d="M15 56 q-8 -14 0 -28 q8 14 0 28" fill="#f97316"/><text x="10" y="80" font-size="9" text-anchor="middle" fill="#ea580c">flame</text><circle cx="60" cy="56" r="5" fill="#ef4444"/><circle cx="100" cy="56" r="5" fill="#fb923c"/><circle cx="140" cy="56" r="5" fill="#fbbf24"/><circle cx="180" cy="56" r="5" fill="#60a5fa"/><circle cx="220" cy="56" r="5" fill="#3b82f6"/><line x1="65" y1="56" x2="95" y2="56" stroke="#1f2937" stroke-width="1.5" marker-end="url(#ah2)"/><line x1="145" y1="56" x2="175" y2="56" stroke="#1f2937" stroke-width="1.5" marker-end="url(#ah2)"/><defs><marker id="ah2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#1f2937"/></marker></defs><text x="50" y="32" font-size="9" fill="#991b1b">hot end</text><text x="195" y="32" font-size="9" fill="#1e3a8a">cold end</text></svg>',
      diagramCaption: "Energy is passed particle-to-particle along a solid; free electrons make metals fastest.",
      keyPoints: [
        "Conduction passes energy particle-to-particle without the material flowing.",
        "Metals conduct best because of free electrons.",
        "Insulators (wood, plastic, air, wool) slow conduction down.",
      ],
      thinkDeeper:
        "A metal spoon and a wooden spoon at room temperature both feel different to the touch — the metal feels colder. They are the same temperature, so why does the metal feel colder?",
    },
    {
      id: "convection",
      heading: "Convection: currents in fluids",
      body:
        "**Convection** is the transfer of thermal energy by the *movement of a fluid* (a liquid or a gas). Unlike conduction, the warm material actually moves and carries its energy with it.\n\nHere is the chain of reasoning:\n- When a fluid is heated, its particles move faster and spread out, so the fluid **expands** and becomes **less dense**.\n- Less dense fluid is lighter for its size, so it **rises**.\n- Cooler, denser fluid sinks to take its place.\n- The risen fluid cools, becomes denser again and sinks — setting up a circulating loop called a **convection current**.\n\nConvection only works in fluids, because solids cannot flow. Everyday examples:\n- A **radiator** heats the air near it; warm air rises and circulates around the whole room.\n- **Sea breezes**: on a sunny day the land warms faster than the sea, so air rises over the land and cooler air flows in from the sea.\n- Hot-air balloons, boiling water in a pan, and the wind are all driven by convection.",
      diagram:
        '<svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A convection current loop in a pan of water above a flame"><rect x="30" y="40" width="140" height="80" rx="4" fill="#dbeafe" stroke="#3b82f6"/><path d="M70 110 q-15 -30 0 -60" fill="none" stroke="#ef4444" stroke-width="2.5" marker-end="url(#ah3)"/><path d="M130 50 q15 30 0 60" fill="none" stroke="#3b82f6" stroke-width="2.5" marker-end="url(#ah3)"/><path d="M70 50 q30 -10 60 0" fill="none" stroke="#9333ea" stroke-width="2" marker-end="url(#ah3)"/><path d="M130 110 q-30 10 -60 0" fill="none" stroke="#9333ea" stroke-width="2" marker-end="url(#ah3)"/><defs><marker id="ah3" markerWidth="8" markerHeight="8" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#374151"/></marker></defs><path d="M95 130 q-6 -10 0 -16 q6 10 0 16" fill="#f97316"/><path d="M105 130 q-6 -10 0 -16 q6 10 0 16" fill="#f97316"/><text x="70" y="35" font-size="8" fill="#ef4444">warm rises</text><text x="135" y="35" font-size="8" fill="#1e3a8a">cool sinks</text></svg>',
      diagramCaption: "Warm fluid rises, cool fluid sinks: a circulating convection current.",
      keyPoints: [
        "Convection happens in liquids and gases (fluids), not solids.",
        "Warm fluid is less dense and rises; cool fluid is denser and sinks.",
        "Radiators and sea breezes are everyday convection currents.",
      ],
      thinkDeeper:
        "A room radiator is often placed low on the wall, under a window. Using convection, explain why that is a smart place to put it.",
    },
    {
      id: "radiation",
      heading: "Radiation: heat that travels as waves",
      body:
        "**Thermal radiation** (also called **infrared radiation**) is energy that travels as **electromagnetic waves**. This is completely different from conduction and convection, because it **does not need any particles or medium** — it can travel through a **vacuum** (empty space).\n\nThat is how the Sun's energy reaches Earth across millions of kilometres of empty space, and why you feel the warmth of a fire or a lamp before you touch it.\n\nAll objects emit infrared radiation; the hotter the object, the more it emits. The colour and texture of a surface matter a lot:\n- **Dark, matt (dull) surfaces** are the **best emitters and best absorbers** of radiation.\n- **Light, shiny surfaces** are **poor emitters and poor absorbers** — they **reflect** radiation instead.\n\nThis is why solar panels are black, why marathon runners are wrapped in shiny foil blankets (to reflect their warmth back), and why houses in hot countries are often painted white.",
      diagram:
        '<svg viewBox="0 0 260 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="The Sun radiating infrared waves through empty space to Earth"><circle cx="40" cy="60" r="28" fill="#facc15" stroke="#f59e0b"/><text x="40" y="64" font-size="10" text-anchor="middle" fill="#92400e">Sun</text><path d="M70 50 q40 -6 80 0" fill="none" stroke="#f97316" stroke-width="2"/><path d="M70 60 q40 -6 80 0" fill="none" stroke="#f97316" stroke-width="2"/><path d="M70 70 q40 -6 80 0" fill="none" stroke="#f97316" stroke-width="2"/><text x="150" y="40" font-size="9" text-anchor="middle" fill="#92400e">vacuum (no particles)</text><circle cx="215" cy="60" r="22" fill="#60a5fa" stroke="#2563eb"/><text x="215" y="64" font-size="9" text-anchor="middle" fill="#1e3a8a">Earth</text></svg>',
      diagramCaption: "Infrared radiation crosses the vacuum of space from the Sun to the Earth.",
      keyPoints: [
        "Radiation travels as infrared (electromagnetic) waves and needs no medium.",
        "It is the only way energy crosses a vacuum, e.g. Sun to Earth.",
        "Dark matt surfaces emit/absorb best; shiny surfaces reflect.",
      ],
      thinkDeeper:
        "A teapot is wrapped in a shiny cosy and an identical one in a black cosy. Both start at the same temperature. Which stays hot longer, and why?",
    },
    {
      id: "insulation",
      heading: "Controlling heat transfer: insulation",
      body:
        "Often we want to **stop** thermal energy escaping (keeping a house warm) or **speed it up** (cooling fins on a computer). We do this by controlling all three transfer methods.\n\n**Insulating a home** reduces unwanted heat loss:\n- **Loft insulation** — a thick layer of wool-like material in the roof traps air and reduces conduction and convection upwards.\n- **Cavity wall insulation** — foam in the gap between two walls stops convection currents in the wall.\n- **Double glazing** — two panes of glass with a gap of trapped air or vacuum between them reduces conduction.\n\n**The vacuum flask (Thermos)** is the classic example, beating all three:\n- A **vacuum** between two walls stops **conduction** and **convection** (no particles to carry energy).\n- **Silvered (shiny) walls** reflect **radiation** back in.\n- A **stopper** and plastic supports stop the small remaining losses.\n\nLiving things and people insulate too: **fur, feathers and blubber** trap air or fat; a duvet, woolly jumper or several layers of clothing trap air to slow conduction.",
      diagram:
        '<svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Cross-section of a vacuum flask showing silvered walls and a vacuum"><rect x="55" y="15" width="90" height="115" rx="10" fill="#e5e7eb" stroke="#6b7280"/><rect x="70" y="30" width="60" height="95" rx="6" fill="#fee2e2" stroke="#ef4444"/><text x="100" y="80" font-size="9" text-anchor="middle" fill="#991b1b">hot</text><text x="100" y="93" font-size="9" text-anchor="middle" fill="#991b1b">drink</text><line x1="62" y1="30" x2="62" y2="125" stroke="#9ca3af" stroke-width="3"/><line x1="138" y1="30" x2="138" y2="125" stroke="#9ca3af" stroke-width="3"/><text x="100" y="25" font-size="8" text-anchor="middle" fill="#374151">stopper</text><text x="30" y="78" font-size="7" text-anchor="middle" fill="#374151">vacuum</text><line x1="42" y1="80" x2="60" y2="80" stroke="#374151" stroke-width="1" marker-end="url(#ah4)"/><text x="170" y="78" font-size="7" text-anchor="middle" fill="#374151">silvered</text><line x1="158" y1="80" x2="140" y2="80" stroke="#374151" stroke-width="1" marker-end="url(#ah4)"/><defs><marker id="ah4" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#374151"/></marker></defs></svg>',
      diagramCaption: "A vacuum flask defeats conduction, convection and radiation at once.",
      keyPoints: [
        "Trapped air is a great insulator (loft, cavity walls, clothing, fur).",
        "A vacuum stops conduction and convection; shiny surfaces stop radiation.",
        "The vacuum flask uses a vacuum AND silvered walls to beat all three.",
      ],
      thinkDeeper:
        "A vacuum flask can keep a drink hot in winter and cold in summer with no changes. Explain why the same design works for both jobs.",
    },
    {
      id: "expansion",
      heading: "Thermal expansion and contraction",
      body:
        "When a material is heated, its particles gain energy and move further apart, so the material gets slightly **bigger** — this is **thermal expansion**. When it cools, the particles move closer and it gets smaller — **thermal contraction**. The amount of material (mass) does not change, only the volume.\n\nGases expand the most for a given temperature rise, then liquids, then solids (whose particles are most tightly bound). The forces involved are huge, so engineers must plan for it:\n- **Bridges and railway lines** have small **expansion gaps** so they do not buckle on hot days.\n- **Overhead power lines** are hung slightly loose so they do not snap when they contract in winter.\n- **Bimetallic strips** (two metals that expand by different amounts) bend when heated and are used as switches in thermostats.\n\nExpansion is also useful. A **liquid-in-glass thermometer** works because the liquid (alcohol or, historically, mercury) expands up a thin tube when warmed — the higher it climbs, the higher the temperature.",
      diagram:
        '<svg viewBox="0 0 260 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A bar expanding when heated and an expansion gap in a bridge"><rect x="20" y="30" width="80" height="18" fill="#93c5fd" stroke="#2563eb"/><text x="60" y="22" font-size="9" text-anchor="middle" fill="#1e3a8a">cool</text><rect x="20" y="70" width="100" height="18" fill="#fca5a5" stroke="#dc2626"/><text x="70" y="62" font-size="9" text-anchor="middle" fill="#991b1b">heated (longer)</text><line x1="100" y1="39" x2="120" y2="39" stroke="#374151" stroke-width="1.5" marker-end="url(#ah5)"/><defs><marker id="ah5" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#374151"/></marker></defs><rect x="150" y="50" width="45" height="20" fill="#9ca3af"/><rect x="205" y="50" width="45" height="20" fill="#9ca3af"/><line x1="197" y1="45" x2="203" y2="45" stroke="#dc2626" stroke-width="1.5"/><text x="200" y="40" font-size="8" text-anchor="middle" fill="#dc2626">gap</text><text x="222" y="85" font-size="8" text-anchor="middle" fill="#374151">bridge</text></svg>',
      diagramCaption: "Solids expand when heated; engineers leave gaps to allow for it.",
      keyPoints: [
        "Heating makes particles move apart, so materials expand (volume up, mass same).",
        "Gases expand most, then liquids, then solids.",
        "Expansion gaps in bridges/rails prevent buckling; thermometers use expansion.",
      ],
      thinkDeeper:
        "On a hot day a railway line with no expansion gap could buckle. Why is leaving a gap a better solution than just building the rails from a stronger steel?",
    },
    {
      id: "thermometers",
      heading: "Measuring temperature with thermometers",
      body:
        "A **thermometer** is any device that gives a number for temperature. Most school thermometers are **liquid-in-glass** thermometers: a thin tube (capillary) connected to a bulb of liquid. As the bulb warms, the liquid **expands** and rises up the tube against a printed scale in °C.\n\nThe Celsius scale is fixed using two reproducible points: the **freezing point of pure water (0 °C)** and the **boiling point of pure water (100 °C)** at normal pressure. The space between is divided into 100 equal degrees.\n\nDifferent thermometers suit different jobs:\n- **Liquid-in-glass** — cheap, simple, good for everyday lab use.\n- **Digital (thermistor) thermometers** — use a component whose electrical resistance changes with temperature; fast and easy to read.\n- **Infrared thermometers** — detect the radiation an object emits, so they measure temperature without touching (useful for very hot or far-away things).\n\nGood practice: let the reading settle, read at eye level to avoid parallax error, and do not let the bulb touch the side of the container.",
      diagram:
        '<svg viewBox="0 0 160 140" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A liquid-in-glass thermometer with a Celsius scale"><rect x="70" y="10" width="14" height="100" rx="6" fill="#f3f4f6" stroke="#6b7280"/><rect x="72" y="55" width="10" height="55" fill="#ef4444"/><circle cx="77" cy="118" r="14" fill="#ef4444" stroke="#b91c1c"/><line x1="86" y1="20" x2="96" y2="20" stroke="#374151"/><text x="118" y="23" font-size="8" fill="#374151">100 °C</text><line x1="86" y1="60" x2="96" y2="60" stroke="#374151"/><text x="118" y="63" font-size="8" fill="#374151">50 °C</text><line x1="86" y1="100" x2="96" y2="100" stroke="#374151"/><text x="120" y="103" font-size="8" fill="#374151">0 °C</text><text x="40" y="120" font-size="8" text-anchor="middle" fill="#991b1b">bulb</text></svg>',
      diagramCaption: "Liquid in the bulb expands up the tube; the scale is set by the freezing and boiling points of water.",
      keyPoints: [
        "A liquid-in-glass thermometer works by thermal expansion of the liquid.",
        "Celsius is fixed at 0 °C (ice) and 100 °C (boiling water).",
        "Read at eye level to avoid parallax error; let the reading settle.",
      ],
      thinkDeeper:
        "Why is a thin capillary tube better than a wide one for making a thermometer that can show small temperature changes clearly?",
    },
  ],

  mnemonics: [
    {
      topic: "The three ways thermal energy travels",
      device: "Cats Cant Radiate (Conduction, Convection, Radiation)",
      explanation:
        "Conduction = through solids (touch), Convection = in fluids (currents), Radiation = waves through empty space.",
    },
    {
      topic: "Which surfaces are best for radiation",
      device: "Dark Drinks, Shiny Reflects",
      explanation:
        "Dark matt surfaces are good emitters AND absorbers; shiny light surfaces reflect (poor emitters and absorbers).",
    },
    {
      topic: "Why warm fluid rises in convection",
      device: "Hot Air Lifts (Heat → Less dense → Lifts/rises)",
      explanation:
        "Heating a fluid makes it expand, become less dense, and rise; cooler denser fluid sinks to replace it.",
    },
    {
      topic: "Heat versus temperature",
      device: "Joules Jiggle, Celsius Counts hotness",
      explanation:
        "Heat (thermal energy, the total jiggling of particles) is in joules; temperature (how hot) is in °C.",
    },
  ],

  examMistakes: [
    "Using 'heat' and 'temperature' as if they mean the same thing — heat is energy in joules, temperature is how hot in °C.",
    "Saying heat flows from cold to hot. Thermal energy always flows from hotter to colder.",
    "Saying convection happens in solids. Convection needs a fluid (liquid or gas) that can flow.",
    "Claiming radiation needs particles or air to travel — it travels through a vacuum as waves.",
    "Writing that warm fluid rises because it is 'lighter' without saying it is 'less dense'.",
    "Saying metals conduct well 'because they are shiny' instead of 'because they have free electrons'.",
    "Forgetting that mass stays the same during expansion — only the volume increases.",
    "Saying shiny surfaces are good absorbers; shiny surfaces reflect and are poor absorbers and emitters.",
  ],

  misconceptions: [
    {
      wrong: "Heat and temperature are the same thing.",
      right: "Temperature (°C) is how hot something is; heat (joules) is the thermal energy it contains. A big warm object can hold more heat than a small very hot one.",
    },
    {
      wrong: "Cold flows into warm objects to cool them down.",
      right: "Cold is not a substance that flows. Thermal energy flows OUT of the warmer object into the colder one until they reach the same temperature.",
    },
    {
      wrong: "Metal is naturally colder than wood, because it feels colder.",
      right: "At room temperature both are the same temperature. Metal feels colder because it conducts thermal energy away from your hand faster.",
    },
    {
      wrong: "Wrapping something in a 'warm' material like wool adds heat to it.",
      right: "Insulators add no energy. They simply slow the transfer of thermal energy, so a hot object cools slowly and a cold object warms slowly.",
    },
    {
      wrong: "Radiation can only travel through air.",
      right: "Thermal (infrared) radiation is an electromagnetic wave and travels through a vacuum — that is how the Sun's energy reaches Earth.",
    },
    {
      wrong: "When a solid expands, it gains extra material or mass.",
      right: "Expansion only spreads the same particles further apart, increasing volume. The mass stays exactly the same.",
    },
  ],

  expertDebates: [
    {
      question: "Is 'cold' a real thing, or just a lack of heat?",
      detail:
        "In physics there is only thermal energy and its flow. 'Cold' is simply the absence of thermal energy, and there is a lowest possible temperature (absolute zero, about -273 °C) where particle motion is minimal. Yet in everyday speech we treat cold as if it spreads — a useful shorthand that can mislead students.",
    },
    {
      question: "Does water always expand when heated?",
      detail:
        "Almost all materials expand when heated, but water is famously odd between 0 °C and 4 °C — it actually contracts as it warms, then expands. This 'anomalous expansion' means ice is less dense than water and floats, which lets fish survive under frozen ponds.",
    },
    {
      question: "Can a vacuum flask keep something hot forever?",
      detail:
        "No design is perfect. A flask greatly slows conduction, convection and radiation, but tiny amounts of energy still leak through the stopper, the supports and imperfect silvering. Real flasks only delay the inevitable return to room temperature.",
    },
  ],

  realWorld: [
    { title: "Vacuum flasks", detail: "Keep coffee hot or juice cold for hours by blocking all three heat-transfer methods.", emoji: "🍶" },
    { title: "Home insulation", detail: "Loft insulation, cavity walls and double glazing cut heating bills and carbon emissions.", emoji: "🏠" },
    { title: "Survival blankets", detail: "Shiny foil blankets reflect a runner's or casualty's body radiation back to keep them warm.", emoji: "🥇" },
    { title: "Sea and land breezes", detail: "Convection currents between warm land and cool sea create the breezes sailors and surfers rely on.", emoji: "🌊" },
    { title: "Bridge expansion joints", detail: "Gaps and interlocking teeth let bridges and rails expand on hot days without buckling.", emoji: "🌉" },
    { title: "Animal adaptations", detail: "Blubber, fur and feathers trap fat or air to slow heat loss in cold habitats.", emoji: "🐧" },
  ],

  flashcards: [
    { front: "What is temperature and its unit?", back: "How hot something is, measured in degrees Celsius (°C)." },
    { front: "What is heat (thermal energy) and its unit?", back: "A form of energy — the total kinetic energy of an object's particles — measured in joules (J)." },
    { front: "Which way does thermal energy flow?", back: "Always from the hotter object to the colder object, until they are the same temperature." },
    { front: "What is conduction?", back: "Transfer of thermal energy through a material (mainly solids) by particles passing energy to their neighbours." },
    { front: "Why are metals good conductors?", back: "They contain free electrons that carry energy quickly through the metal." },
    { front: "What is convection?", back: "Transfer of thermal energy by the movement of a fluid; warm fluid rises, cool fluid sinks." },
    { front: "Why does warm fluid rise?", back: "Heating makes it expand and become less dense, so it rises; denser cool fluid sinks to replace it." },
    { front: "What is thermal radiation?", back: "Infrared electromagnetic waves that carry energy and need no particles — they travel through a vacuum." },
    { front: "Which surfaces emit and absorb radiation best?", back: "Dark, matt (dull) surfaces. Shiny, light surfaces reflect and are poor emitters/absorbers." },
    { front: "How does a vacuum flask reduce heat loss?", back: "A vacuum stops conduction and convection; silvered walls reflect radiation; a stopper limits the rest." },
    { front: "What is thermal expansion?", back: "Materials getting bigger when heated because particles move further apart (volume up, mass unchanged)." },
    { front: "Why are there gaps in bridges and railway lines?", back: "To allow for thermal expansion on hot days so the structure does not buckle." },
    { front: "Why is trapped air a good insulator?", back: "Air conducts poorly, and being trapped stops it forming convection currents." },
    { front: "How does a liquid-in-glass thermometer work?", back: "The liquid expands and rises up a thin tube as temperature increases." },
  ],

  mustKnow: [
    "Explain the difference between heat (joules) and temperature (°C).",
    "State that thermal energy always flows from hotter to colder objects.",
    "Describe conduction and explain why metals are the best conductors.",
    "Explain convection currents in terms of density changes in a fluid.",
    "Explain that radiation is infrared waves that need no medium and cross a vacuum.",
    "Compare how dark matt and shiny surfaces emit, absorb and reflect radiation.",
    "Explain how a vacuum flask and home insulation reduce heat transfer.",
    "Describe thermal expansion and contraction and give everyday consequences.",
    "Describe how a liquid-in-glass thermometer measures temperature.",
  ],

  videos: [
    { title: "Conduction, Convection and Radiation", channel: "FuseSchool", url: "https://www.youtube.com/results?search_query=fuseschool+conduction+convection+radiation" },
    { title: "Heat vs Temperature explained", channel: "Cognito", url: "https://www.youtube.com/results?search_query=cognito+heat+and+temperature" },
    { title: "Reducing heat transfer and insulation", channel: "Free Science Lessons", url: "https://www.youtube.com/results?search_query=free+science+lessons+reducing+heat+transfer" },
    { title: "Thermal expansion of solids liquids and gases", channel: "Primrose Kitten", url: "https://www.youtube.com/results?search_query=primrose+kitten+thermal+expansion" },
  ],

  quiz: {
    mcq: [
      {
        id: "heat-q-mcq-1",
        question: "Which statement correctly describes heat and temperature?",
        options: [
          "Both are measured in degrees Celsius.",
          "Temperature is how hot something is (°C); heat is thermal energy (J).",
          "Heat is how hot something is; temperature is measured in joules.",
          "They are two words for exactly the same quantity.",
        ],
        answerIndex: 1,
        hint: "One is a measure of hotness; the other is a type of energy.",
        explanation:
          "Temperature measures how hot something is in °C, while heat is thermal energy measured in joules. Option 3 swaps the two, and option 4 wrongly treats them as identical.",
        guideRef: "heat-vs-temp",
      },
      {
        id: "heat-q-mcq-2",
        question: "Why are metals such good conductors of thermal energy?",
        options: [
          "They are shiny and reflect heat.",
          "Their particles are further apart than in other solids.",
          "They contain free electrons that carry energy quickly.",
          "They contain trapped air that passes energy along.",
        ],
        answerIndex: 2,
        hint: "Think about the special particles that can move through a metal.",
        explanation:
          "Free electrons move through the metal and carry energy rapidly from hot to cold. Shininess affects radiation, not conduction, and metal particles are actually closely packed.",
        guideRef: "conduction",
      },
      {
        id: "heat-q-mcq-3",
        question: "A fire warms your face from across a room. Which transfer method is mainly responsible?",
        options: ["Conduction", "Convection", "Radiation", "Contraction"],
        answerIndex: 2,
        hint: "Energy reaches you through the air gap without the air carrying it to you.",
        explanation:
          "Infrared radiation travels as waves directly to your face and needs no medium. Conduction needs contact, and convection would carry warm air upwards rather than sideways to you.",
        guideRef: "radiation",
      },
      {
        id: "heat-q-mcq-4",
        question: "Why does warm water rise to the top in a pan being heated from below?",
        options: [
          "It becomes more dense and floats.",
          "It expands, becomes less dense, and rises.",
          "Cold water pushes it up by conduction.",
          "Radiation lifts the warm water upwards.",
        ],
        answerIndex: 1,
        hint: "Heating changes the density of the water.",
        explanation:
          "Heated water expands and becomes less dense, so it rises; cooler denser water sinks. Option 1 has the density the wrong way round, and convection — not conduction or radiation — drives the loop.",
        guideRef: "convection",
      },
    ],
    qa: [
      {
        id: "heat-q-qa-1",
        question: "Explain the difference between heat and temperature, including the units of each.",
        marks: 3,
        hint: "Define each term and give its unit.",
        modelAnswer:
          "Temperature is a measure of how hot something is and is measured in degrees Celsius (°C). Heat is a form of energy called thermal energy and is measured in joules (J). Two objects at the same temperature can contain different amounts of heat depending on their size and material.",
        markScheme: [
          { point: "Temperature is how hot something is, in °C", keywords: ["how hot", "celsius", "°c", "degrees"] },
          { point: "Heat is thermal energy, in joules", keywords: ["joule", "thermal energy", "energy"] },
          { point: "They are different quantities (same temp can differ in heat)", keywords: ["different", "not the same", "more energy", "amount"] },
        ],
        commonError: "Treating heat and temperature as the same thing, or giving joules for temperature.",
        guideRef: "heat-vs-temp",
      },
      {
        id: "heat-q-qa-2",
        question: "Describe how thermal energy travels along a metal bar by conduction.",
        marks: 3,
        hint: "Talk about particles and free electrons.",
        modelAnswer:
          "The heated end gains energy so its particles vibrate faster. They collide with neighbouring particles and pass energy along the bar. In a metal, free electrons also move and carry energy quickly from the hot end to the cold end, which is why metals conduct so well.",
        markScheme: [
          { point: "Heated particles vibrate/move faster", keywords: ["vibrate", "faster", "move", "kinetic"] },
          { point: "Energy passed to neighbouring particles by collisions", keywords: ["collide", "neighbour", "pass", "bump"] },
          { point: "Free electrons carry energy quickly in metals", keywords: ["free electron", "electrons", "carry"] },
        ],
        commonError: "Saying the metal itself flows, or forgetting to mention free electrons for metals.",
        guideRef: "conduction",
      },
      {
        id: "heat-q-qa-3",
        question: "Explain why a vacuum flask keeps a hot drink hot for a long time. Refer to all three methods of heat transfer.",
        marks: 4,
        hint: "Address conduction, convection and radiation separately.",
        modelAnswer:
          "The vacuum between the two walls has no particles, so it stops conduction and convection, which both need a medium. The silvered (shiny) walls reflect infrared radiation back towards the drink, reducing radiation losses. The stopper reduces energy escaping by convection and evaporation from the top. Together these greatly slow the loss of thermal energy.",
        markScheme: [
          { point: "Vacuum stops conduction (no particles)", keywords: ["vacuum", "no particles", "conduction"] },
          { point: "Vacuum stops convection", keywords: ["convection", "no fluid", "cannot flow"] },
          { point: "Silvered walls reflect radiation", keywords: ["silvered", "shiny", "reflect", "radiation"] },
          { point: "Stopper/lid reduces loss from the top", keywords: ["stopper", "lid", "top", "evaporation"] },
        ],
        commonError: "Saying the flask 'adds heat' or only mentioning one transfer method.",
        guideRef: "insulation",
      },
      {
        id: "heat-q-qa-4",
        question: "Railway lines are built with small gaps between sections. Explain why, using ideas about thermal expansion.",
        marks: 3,
        hint: "Think about what happens to the metal on a hot day.",
        modelAnswer:
          "On a hot day the metal rails gain thermal energy, so their particles move further apart and the rails expand and get longer. If there were no gaps, the expanding rails would push against each other with huge force and could buckle or bend. The gaps give the rails room to expand safely.",
        markScheme: [
          { point: "Heating causes the metal to expand/get longer", keywords: ["expand", "longer", "bigger", "particles apart"] },
          { point: "Without gaps the rails would push together with large force", keywords: ["force", "push", "no gap", "buckle"] },
          { point: "Gaps allow room to expand and prevent buckling", keywords: ["gap", "room", "prevent", "buckle", "bend"] },
        ],
        commonError: "Saying the rails gain mass when they expand; only volume/length changes.",
        guideRef: "expansion",
      },
    ],
  },

  questionBank: {
    mcqPapers: [
      {
        id: "heat-mcq-p1",
        title: "MCQ Paper 1",
        questions: [
          { id: "heat-mcq-p1-q1", question: "What is the unit of temperature?", options: ["Joule", "Degree Celsius", "Newton", "Watt"], answerIndex: 1, hint: "It is read from a thermometer.", explanation: "Temperature is measured in degrees Celsius (°C). The joule is the unit of energy.", guideRef: "heat-vs-temp" },
          { id: "heat-mcq-p1-q2", question: "What is the unit of heat (thermal energy)?", options: ["Joule", "Degree Celsius", "Kelvin per second", "Metre"], answerIndex: 0, hint: "Heat is a form of energy.", explanation: "Heat is energy, measured in joules (J). Degrees Celsius measure temperature, not energy.", guideRef: "heat-vs-temp" },
          { id: "heat-mcq-p1-q3", question: "Thermal energy always flows from...", options: ["cold to hot", "hot to cold", "light to dark", "high to low pressure"], answerIndex: 1, hint: "Think which way a warm drink cools.", explanation: "Thermal energy flows from the hotter object to the colder one until they are at the same temperature.", guideRef: "heat-vs-temp" },
          { id: "heat-mcq-p1-q4", question: "Thermal energy is best described as the...", options: ["total kinetic energy of an object's particles", "speed of a single particle", "temperature in joules", "colour of an object"], answerIndex: 0, hint: "It involves all the particles moving.", explanation: "Thermal energy is the total kinetic energy of all an object's particles. Temperature is the average, not the total.", guideRef: "particles" },
          { id: "heat-mcq-p1-q5", question: "When a substance is heated, its particles...", options: ["move more slowly", "move faster", "disappear", "gain mass"], answerIndex: 1, hint: "More energy means more movement.", explanation: "Heating gives particles more kinetic energy so they move (vibrate) faster. Their mass does not change.", guideRef: "particles" },
          { id: "heat-mcq-p1-q6", question: "Conduction is the main method of heat transfer in...", options: ["gases", "liquids only", "solids", "a vacuum"], answerIndex: 2, hint: "It works where particles are fixed in place.", explanation: "Conduction is the main transfer method in solids, where particles pass energy to fixed neighbours. A vacuum has no particles at all.", guideRef: "conduction" },
          { id: "heat-mcq-p1-q7", question: "Metals conduct thermal energy well because they have...", options: ["trapped air", "free electrons", "a shiny surface", "low density"], answerIndex: 1, hint: "A special kind of moving charged particle.", explanation: "Free electrons move through metals and carry energy quickly. Shininess affects radiation, not conduction.", guideRef: "conduction" },
          { id: "heat-mcq-p1-q8", question: "Which of these is the best thermal insulator?", options: ["Copper", "Aluminium", "Wool", "Iron"], answerIndex: 2, hint: "Insulators are often soft and trap air.", explanation: "Wool traps air and is a good insulator. Copper, aluminium and iron are metals and are good conductors.", guideRef: "conduction" },
          { id: "heat-mcq-p1-q9", question: "Convection can occur in...", options: ["solids only", "liquids and gases", "a vacuum", "metals only"], answerIndex: 1, hint: "It needs something that can flow.", explanation: "Convection needs a fluid (liquid or gas) that can flow. Solids cannot flow, and a vacuum has no particles.", guideRef: "convection" },
          { id: "heat-mcq-p1-q10", question: "When a fluid is heated it becomes...", options: ["more dense and sinks", "less dense and rises", "more dense and rises", "less dense and sinks"], answerIndex: 1, hint: "Expanding spreads the same mass over more volume.", explanation: "Heated fluid expands, becoming less dense, so it rises. Cooler, denser fluid sinks to replace it.", guideRef: "convection" },
          { id: "heat-mcq-p1-q11", question: "A circulating loop of warm rising and cool sinking fluid is called a...", options: ["conduction path", "convection current", "radiation wave", "expansion gap"], answerIndex: 1, hint: "It is the flow set up in a heated fluid.", explanation: "This loop is a convection current. Radiation involves waves, not flowing fluid.", guideRef: "convection" },
          { id: "heat-mcq-p1-q12", question: "Thermal radiation travels as...", options: ["sound waves", "infrared (electromagnetic) waves", "moving particles", "convection currents"], answerIndex: 1, hint: "It is a kind of electromagnetic wave.", explanation: "Thermal radiation is infrared electromagnetic waves. It is not carried by particles, so it is not sound or convection.", guideRef: "radiation" },
          { id: "heat-mcq-p1-q13", question: "Which method of heat transfer can work through a vacuum?", options: ["Conduction", "Convection", "Radiation", "None of them"], answerIndex: 2, hint: "A vacuum has no particles.", explanation: "Radiation needs no medium, so it crosses a vacuum (e.g. Sun to Earth). Conduction and convection both need particles.", guideRef: "radiation" },
          { id: "heat-mcq-p1-q14", question: "Which surface is the best emitter and absorber of radiation?", options: ["Shiny silver", "Dark matt black", "Polished white", "Mirror-like"], answerIndex: 1, hint: "Think about what a solar panel looks like.", explanation: "Dark, matt surfaces emit and absorb radiation best. Shiny and light surfaces reflect it.", guideRef: "radiation" },
          { id: "heat-mcq-p1-q15", question: "A shiny silver surface is a good...", options: ["absorber of radiation", "emitter of radiation", "reflector of radiation", "conductor of radiation"], answerIndex: 2, hint: "Think about a survival blanket.", explanation: "Shiny surfaces reflect radiation; they are poor absorbers and emitters.", guideRef: "radiation" },
          { id: "heat-mcq-p1-q16", question: "How does the Sun's energy reach Earth?", options: ["By conduction through space", "By convection currents in space", "By radiation through the vacuum", "By the wind"], answerIndex: 2, hint: "Space is a vacuum.", explanation: "Energy crosses the vacuum of space as radiation. Conduction and convection cannot occur where there are no particles.", guideRef: "radiation" },
          { id: "heat-mcq-p1-q17", question: "Loft insulation reduces heat loss mainly by...", options: ["adding heat to the house", "trapping air to slow conduction and convection", "reflecting radiation into space", "cooling the roof"], answerIndex: 1, hint: "Insulators do not make heat.", explanation: "Loft insulation traps air, which slows conduction and convection upwards. Insulators never add energy.", guideRef: "insulation" },
          { id: "heat-mcq-p1-q18", question: "In a vacuum flask, the vacuum mainly stops...", options: ["radiation", "conduction and convection", "expansion", "evaporation only"], answerIndex: 1, hint: "What do conduction and convection both need?", explanation: "The vacuum has no particles, so it stops conduction and convection. The silvered walls deal with radiation.", guideRef: "insulation" },
          { id: "heat-mcq-p1-q19", question: "The silvered walls of a vacuum flask reduce heat loss by...", options: ["conducting energy away", "reflecting radiation back", "absorbing radiation", "trapping air"], answerIndex: 1, hint: "Shiny surfaces and radiation.", explanation: "Silvered walls reflect infrared radiation back towards the contents, reducing radiation losses.", guideRef: "insulation" },
          { id: "heat-mcq-p1-q20", question: "When a solid is heated it usually...", options: ["expands", "contracts", "loses mass", "gains particles"], answerIndex: 0, hint: "Particles move further apart.", explanation: "Heating makes particles move further apart, so the solid expands. Its mass stays the same.", guideRef: "expansion" },
          { id: "heat-mcq-p1-q21", question: "During thermal expansion, which stays the same?", options: ["Volume", "Length", "Mass", "Size"], answerIndex: 2, hint: "Only spacing of particles changes.", explanation: "Expansion increases volume by spreading particles apart, but the mass (amount of material) is unchanged.", guideRef: "expansion" },
          { id: "heat-mcq-p1-q22", question: "Gaps are left in railway lines to...", options: ["save metal", "allow for expansion on hot days", "let water drain", "reduce noise"], answerIndex: 1, hint: "Think about a hot summer day.", explanation: "The gaps give rails room to expand on hot days so they do not buckle.", guideRef: "expansion" },
          { id: "heat-mcq-p1-q23", question: "A liquid-in-glass thermometer works because the liquid...", options: ["changes colour", "expands and rises when warmed", "evaporates", "conducts electricity"], answerIndex: 1, hint: "Expansion up a thin tube.", explanation: "As the bulb warms, the liquid expands and rises up the capillary tube against the scale.", guideRef: "thermometers" },
          { id: "heat-mcq-p1-q24", question: "On the Celsius scale, the boiling point of pure water is fixed at...", options: ["0 °C", "37 °C", "100 °C", "273 °C"], answerIndex: 2, hint: "Water boils at this temperature.", explanation: "Pure water boils at 100 °C at normal pressure; its freezing point (0 °C) is the other fixed point.", guideRef: "thermometers" },
          { id: "heat-mcq-p1-q25", question: "To avoid parallax error when reading a thermometer you should read...", options: ["from above", "from below", "at eye level", "with one eye shut"], answerIndex: 2, hint: "Line of sight matters.", explanation: "Reading at eye level avoids parallax error. Looking from above or below gives a misread value.", guideRef: "thermometers" },
        ],
      },
      {
        id: "heat-mcq-p2",
        title: "MCQ Paper 2",
        questions: [
          { id: "heat-mcq-p2-q1", question: "A 1000 °C spark from a sparkler does not hurt because it...", options: ["is not really hot", "carries very little thermal energy", "is made of cold metal", "reflects heat"], answerIndex: 1, hint: "Tiny object, tiny energy.", explanation: "The spark is tiny so it holds very little thermal energy, even though its temperature is high.", guideRef: "heat-vs-temp" },
          { id: "heat-mcq-p2-q2", question: "Two objects placed in contact stop exchanging net thermal energy when they...", options: ["are the same colour", "reach the same temperature", "are the same size", "stop moving"], answerIndex: 1, hint: "This is called thermal equilibrium.", explanation: "Net energy flow stops at thermal equilibrium, when both objects are at the same temperature.", guideRef: "heat-vs-temp" },
          { id: "heat-mcq-p2-q3", question: "Temperature is a measure of the particles'...", options: ["total energy", "average kinetic energy", "mass", "colour"], answerIndex: 1, hint: "Average, not total.", explanation: "Temperature measures the average kinetic energy of the particles; thermal energy is the total.", guideRef: "particles" },
          { id: "heat-mcq-p2-q4", question: "In which state do particles move fastest at the same temperature?", options: ["Solid", "Liquid", "Gas", "All the same"], answerIndex: 2, hint: "Think how freely particles can move.", explanation: "Gas particles move fastest and most freely. Solid particles only vibrate in place.", guideRef: "particles" },
          { id: "heat-mcq-p2-q5", question: "A metal spoon feels colder than a wooden spoon at the same temperature because metal...", options: ["is actually colder", "conducts energy from your hand faster", "reflects more light", "is heavier"], answerIndex: 1, hint: "It draws energy from your skin quickly.", explanation: "Metal conducts thermal energy away from your hand faster, so it feels colder, even though both are the same temperature.", guideRef: "conduction" },
          { id: "heat-mcq-p2-q6", question: "Conduction transfers energy without...", options: ["any particles", "the material itself moving along", "a temperature difference", "free electrons"], answerIndex: 1, hint: "Particles stay roughly in place.", explanation: "In conduction the material does not flow; energy is passed between particles that stay in place.", guideRef: "conduction" },
          { id: "heat-mcq-p2-q7", question: "Which list contains only good thermal conductors?", options: ["Copper, aluminium, iron", "Wood, plastic, wool", "Air, glass, foam", "Cork, rubber, paper"], answerIndex: 0, hint: "Metals conduct well.", explanation: "Copper, aluminium and iron are metals and good conductors. The others are insulators.", guideRef: "conduction" },
          { id: "heat-mcq-p2-q8", question: "A saucepan often has a plastic or wooden handle so that it...", options: ["conducts heat to your hand", "looks nicer", "does not conduct heat to your hand", "weighs less"], answerIndex: 2, hint: "Insulator handle.", explanation: "Plastic and wood are insulators, so the handle does not conduct heat to your hand.", guideRef: "conduction" },
          { id: "heat-mcq-p2-q9", question: "A radiator is usually placed low on a wall so that...", options: ["warm air can rise and circulate the room", "it is easy to reach", "cold air sinks onto it", "radiation reaches the ceiling"], answerIndex: 0, hint: "Warm air rises.", explanation: "Warm air rising from a low radiator sets up a convection current that circulates around the whole room.", guideRef: "convection" },
          { id: "heat-mcq-p2-q10", question: "During the day a sea breeze blows from sea to land because...", options: ["the sea warms faster than the land", "the land warms faster, so air rises over it", "the wind always blows that way", "of radiation from the Sun only"], answerIndex: 1, hint: "Land heats up quicker than water.", explanation: "Land warms faster, so air rises over it and cooler air flows in from the sea: a convection breeze.", guideRef: "convection" },
          { id: "heat-mcq-p2-q11", question: "Why is the freezer compartment placed at the top of a fridge?", options: ["Cold air sinks, cooling the food below", "Warm air sinks past it", "Radiation travels downwards", "It is easier to reach"], answerIndex: 0, hint: "Think which way cold dense air moves.", explanation: "Cold air from the top freezer is dense and sinks, cooling the food below by convection.", guideRef: "convection" },
          { id: "heat-mcq-p2-q12", question: "Infrared radiation is part of the...", options: ["sound spectrum", "electromagnetic spectrum", "list of states of matter", "periodic table"], answerIndex: 1, hint: "Same family as visible light.", explanation: "Infrared is part of the electromagnetic spectrum, like visible light, and travels as waves.", guideRef: "radiation" },
          { id: "heat-mcq-p2-q13", question: "A house in a hot country is often painted white to...", options: ["absorb more radiation", "reflect radiation and stay cooler", "conduct heat away", "look clean only"], answerIndex: 1, hint: "Light surfaces reflect.", explanation: "White (light) surfaces reflect radiation, helping the house stay cool. Dark surfaces would absorb more.", guideRef: "radiation" },
          { id: "heat-mcq-p2-q14", question: "Solar panels are usually black because dark surfaces are good...", options: ["reflectors of radiation", "absorbers of radiation", "insulators", "conductors"], answerIndex: 1, hint: "They need to soak up the Sun.", explanation: "Dark matt surfaces absorb radiation well, so they collect more of the Sun's energy.", guideRef: "radiation" },
          { id: "heat-mcq-p2-q15", question: "Which transfer method does NOT require particles?", options: ["Conduction", "Convection", "Radiation", "All require particles"], answerIndex: 2, hint: "Which crosses empty space?", explanation: "Radiation needs no particles and crosses a vacuum. Conduction and convection both need a medium.", guideRef: "radiation" },
          { id: "heat-mcq-p2-q16", question: "Double glazing reduces heat loss because the gap between panes...", options: ["is filled with metal", "traps air (or is a vacuum) to slow conduction", "reflects all light", "adds heat"], answerIndex: 1, hint: "Trapped air is a poor conductor.", explanation: "The trapped air or vacuum between panes is a poor conductor, slowing heat loss through the window.", guideRef: "insulation" },
          { id: "heat-mcq-p2-q17", question: "Penguins huddle together mainly to...", options: ["share food", "reduce heat loss to the surroundings", "stay dry", "see better"], answerIndex: 1, hint: "Less exposed surface area.", explanation: "Huddling reduces the surface exposed to the cold, cutting heat loss to the surroundings.", guideRef: "insulation" },
          { id: "heat-mcq-p2-q18", question: "Birds fluff up their feathers in cold weather to...", options: ["look bigger to predators", "trap a thicker layer of air for insulation", "shed water", "cool down"], answerIndex: 1, hint: "Trapped air insulates.", explanation: "Fluffed feathers trap a thicker layer of air, which is a good insulator and slows heat loss.", guideRef: "insulation" },
          { id: "heat-mcq-p2-q19", question: "Wearing several thin layers can be warmer than one thick layer because...", options: ["layers add heat", "air is trapped between the layers", "thin cloth conducts better", "it reflects radiation"], answerIndex: 1, hint: "Think about the gaps between layers.", explanation: "Air trapped between layers is a good insulator, reducing conduction of body heat away.", guideRef: "insulation" },
          { id: "heat-mcq-p2-q20", question: "Which expands most for the same temperature rise?", options: ["Solid", "Liquid", "Gas", "All the same"], answerIndex: 2, hint: "Loosely held particles expand more.", explanation: "Gases expand most, then liquids, then solids, whose particles are held most tightly.", guideRef: "expansion" },
          { id: "heat-mcq-p2-q21", question: "Overhead power lines are hung slightly loose so that they do not...", options: ["sag in summer", "snap when they contract in winter", "carry too much current", "reflect sunlight"], answerIndex: 1, hint: "Cold makes them contract.", explanation: "In winter the lines contract and shorten; leaving them loose stops them snapping under tension.", guideRef: "expansion" },
          { id: "heat-mcq-p2-q22", question: "A bimetallic strip bends when heated because the two metals...", options: ["have different colours", "expand by different amounts", "have different masses", "conduct electricity"], answerIndex: 1, hint: "Unequal expansion causes bending.", explanation: "The two metals expand by different amounts, so the strip curves; this is used in thermostats.", guideRef: "expansion" },
          { id: "heat-mcq-p2-q23", question: "When a substance cools and its particles move closer together, this is called...", options: ["expansion", "contraction", "conduction", "radiation"], answerIndex: 1, hint: "Opposite of expansion.", explanation: "Cooling brings particles closer, so the material contracts (gets smaller).", guideRef: "expansion" },
          { id: "heat-mcq-p2-q24", question: "On the Celsius scale, the freezing point of pure water is...", options: ["0 °C", "32 °C", "100 °C", "-273 °C"], answerIndex: 0, hint: "Ice forms here.", explanation: "Pure water freezes at 0 °C, one of the two fixed points of the Celsius scale.", guideRef: "thermometers" },
          { id: "heat-mcq-p2-q25", question: "An infrared thermometer is useful because it can measure temperature...", options: ["only of liquids", "without touching the object", "in joules", "only at 0 °C"], answerIndex: 1, hint: "It detects emitted radiation.", explanation: "An infrared thermometer detects the radiation an object emits, so it measures temperature without contact.", guideRef: "thermometers" },
        ],
      },
      {
        id: "heat-mcq-p3",
        title: "MCQ Paper 3",
        questions: [
          { id: "heat-mcq-p3-q1", question: "Object A is 60 °C and object B is 60 °C but ten times bigger. Compared with A, object B has...", options: ["less thermal energy", "the same thermal energy", "more thermal energy", "no thermal energy"], answerIndex: 2, hint: "More particles, more total energy.", explanation: "Same temperature but more material means more total thermal energy. Temperature alone does not tell you the energy.", guideRef: "heat-vs-temp" },
          { id: "heat-mcq-p3-q2", question: "Which is the correct pairing of quantity and unit?", options: ["Heat — °C", "Temperature — J", "Heat — J and temperature — °C", "Both in kelvin per metre"], answerIndex: 2, hint: "Energy in joules, hotness in degrees.", explanation: "Heat is energy in joules; temperature is hotness in °C. The first two options swap the units.", guideRef: "heat-vs-temp" },
          { id: "heat-mcq-p3-q3", question: "A hot drink left on a table cools down because thermal energy...", options: ["is destroyed", "flows from the drink to the cooler surroundings", "flows from the room into the drink", "turns into cold"], answerIndex: 1, hint: "Hot to cold.", explanation: "Energy flows from the hotter drink to the cooler surroundings until they reach the same temperature.", guideRef: "heat-vs-temp" },
          { id: "heat-mcq-p3-q4", question: "Which best explains why gases are easy to compress but solids are not?", options: ["Gas particles are far apart with space between them", "Gas particles are heavier", "Solid particles are hotter", "Solids have no particles"], answerIndex: 0, hint: "Think about the spacing of particles.", explanation: "Gas particles are far apart with lots of space, so a gas compresses easily; solid particles are tightly packed.", guideRef: "particles" },
          { id: "heat-mcq-p3-q5", question: "As ice is warmed from -10 °C towards 0 °C, its particles...", options: ["stop moving", "vibrate faster", "leave the solid", "gain mass"], answerIndex: 1, hint: "Heating speeds particles up.", explanation: "Adding thermal energy makes the particles vibrate faster, even while the ice is still solid.", guideRef: "particles" },
          { id: "heat-mcq-p3-q6", question: "Heat passes along a metal rod fastest because of...", options: ["trapped air", "free electrons carrying energy", "convection currents in the metal", "radiation inside the rod"], answerIndex: 1, hint: "Charged particles that move freely.", explanation: "Free electrons move through the metal and carry energy quickly, faster than vibrations alone.", guideRef: "conduction" },
          { id: "heat-mcq-p3-q7", question: "Which property makes a material a good insulator?", options: ["It contains many free electrons", "It traps air and conducts poorly", "It is dense and metallic", "It is shiny"], answerIndex: 1, hint: "Insulators slow conduction.", explanation: "Good insulators conduct poorly and often trap air. Free electrons and metallic density make good conductors.", guideRef: "conduction" },
          { id: "heat-mcq-p3-q8", question: "Carpets feel warmer underfoot than tiles because carpet...", options: ["is at a higher temperature", "conducts heat away from your foot more slowly", "produces heat", "reflects radiation"], answerIndex: 1, hint: "It is a poorer conductor.", explanation: "Carpet conducts heat away from your foot slowly (it is an insulator), so it feels warmer than tile at the same temperature.", guideRef: "conduction" },
          { id: "heat-mcq-p3-q9", question: "In a beaker of water heated from the bottom, the warm water...", options: ["stays at the bottom", "rises and is replaced by sinking cool water", "sinks to the bottom", "does not move"], answerIndex: 1, hint: "Less dense fluid rises.", explanation: "Warm water is less dense and rises; cool denser water sinks to replace it, forming a convection current.", guideRef: "convection" },
          { id: "heat-mcq-p3-q10", question: "Why does smoke from a fire rise upwards?", options: ["Radiation pushes it up", "Hot air carrying it is less dense and rises", "Conduction lifts it", "It is lighter than light"], answerIndex: 1, hint: "Hot air convection.", explanation: "The hot air carrying the smoke is less dense and rises by convection, taking the smoke with it.", guideRef: "convection" },
          { id: "heat-mcq-p3-q11", question: "At night a land breeze can blow from land to sea because...", options: ["the land cools faster, so air rises over the warmer sea", "the sea cools faster than the land", "radiation reverses at night", "the wind always blows to the sea"], answerIndex: 0, hint: "At night the land cools quicker.", explanation: "At night the land cools faster, so the warmer sea heats the air above it, which rises, drawing air out from the land.", guideRef: "convection" },
          { id: "heat-mcq-p3-q12", question: "All objects above absolute zero...", options: ["emit some infrared radiation", "absorb but never emit radiation", "only emit visible light", "stop radiating"], answerIndex: 0, hint: "Everything glows in infrared.", explanation: "Every object above absolute zero emits some infrared radiation; the hotter it is, the more it emits.", guideRef: "radiation" },
          { id: "heat-mcq-p3-q13", question: "Two identical cans, one matt black and one shiny, are filled with hot water. Which cools faster?", options: ["The shiny can", "The matt black can", "They cool at the same rate", "Neither cools"], answerIndex: 1, hint: "Good emitters lose energy fastest.", explanation: "The matt black can is a better emitter of radiation, so it loses energy and cools faster than the shiny can.", guideRef: "radiation" },
          { id: "heat-mcq-p3-q14", question: "A survival (foil) blanket keeps a casualty warm by...", options: ["adding heat", "reflecting their body's infrared radiation back", "conducting heat to them", "creating convection"], answerIndex: 1, hint: "Shiny surfaces reflect.", explanation: "The shiny foil reflects the person's own infrared radiation back to them, reducing radiation heat loss.", guideRef: "radiation" },
          { id: "heat-mcq-p3-q15", question: "Which statement about radiation is correct?", options: ["It needs a medium to travel", "It is fastest in solids", "It can travel through a vacuum", "It only travels downwards"], answerIndex: 2, hint: "Sun to Earth.", explanation: "Radiation travels through a vacuum, which is why the Sun's energy reaches us across empty space.", guideRef: "radiation" },
          { id: "heat-mcq-p3-q16", question: "Cavity wall insulation reduces heat loss mainly by stopping...", options: ["radiation through the bricks", "convection currents in the wall gap", "expansion of the wall", "conduction in metals"], answerIndex: 1, hint: "Foam fills the air gap.", explanation: "Foam fills the cavity and stops air circulating, preventing convection currents that would carry heat out.", guideRef: "insulation" },
          { id: "heat-mcq-p3-q17", question: "Whales and seals have a thick layer of blubber to...", options: ["help them float only", "reduce heat loss in cold water", "conduct heat away", "reflect radiation"], answerIndex: 1, hint: "Fat is a poor conductor.", explanation: "Blubber is a thick fatty insulating layer that slows heat loss to the cold water.", guideRef: "insulation" },
          { id: "heat-mcq-p3-q18", question: "The stopper of a vacuum flask is important because it...", options: ["adds heat", "reduces heat loss by convection and evaporation from the top", "reflects radiation", "conducts heat in"], answerIndex: 1, hint: "Think about the open top.", explanation: "The stopper closes the top, reducing energy lost by convection and evaporation of the hot liquid.", guideRef: "insulation" },
          { id: "heat-mcq-p3-q19", question: "Why does the same vacuum flask keep cold drinks cold?", options: ["It adds cold", "It slows energy flowing IN as well as out", "It reflects cold", "It freezes the drink"], answerIndex: 1, hint: "Insulation works both ways.", explanation: "The flask slows thermal energy flow in either direction, so it keeps cold drinks cold by stopping energy flowing in.", guideRef: "insulation" },
          { id: "heat-mcq-p3-q20", question: "A glass bottle cracks when boiling water is poured in because...", options: ["glass is a metal", "the inside expands faster than the cold outside", "glass cannot get hot", "radiation breaks it"], answerIndex: 1, hint: "Uneven expansion causes stress.", explanation: "The inside heats and expands before the outside, and the uneven expansion stresses the glass until it cracks.", guideRef: "expansion" },
          { id: "heat-mcq-p3-q21", question: "A tight metal lid on a glass jar is easier to open after running it under hot water because the metal...", options: ["contracts more than the glass", "expands more than the glass", "becomes lighter", "melts slightly"], answerIndex: 1, hint: "Metals expand more than glass.", explanation: "The metal lid expands more than the glass when heated, loosening its grip so it is easier to open.", guideRef: "expansion" },
          { id: "heat-mcq-p3-q22", question: "Concrete road sections have gaps between them to allow for...", options: ["water flow", "expansion in hot weather", "easier repair only", "drainage of oil"], answerIndex: 1, hint: "Same reason as railway gaps.", explanation: "The gaps give the concrete room to expand on hot days so it does not crack or buckle.", guideRef: "expansion" },
          { id: "heat-mcq-p3-q23", question: "A balloon left in a hot car gets bigger because the gas inside...", options: ["gains particles", "expands as its particles move faster and spread out", "becomes denser", "turns to liquid"], answerIndex: 1, hint: "Gases expand a lot.", explanation: "The warmed gas particles move faster and spread out, expanding the balloon. No particles are added.", guideRef: "expansion" },
          { id: "heat-mcq-p3-q24", question: "Why is the bulb of a thermometer made thin-walled and narrow?", options: ["To use less liquid and respond quickly to temperature", "To make it stronger", "To reflect radiation", "To trap air"], answerIndex: 0, hint: "Quick response to small changes.", explanation: "A thin-walled, narrow bulb lets the liquid heat up and respond quickly, and a thin tube shows small changes clearly.", guideRef: "thermometers" },
          { id: "heat-mcq-p3-q25", question: "A digital thermometer often uses a thermistor, a component whose...", options: ["colour changes with temperature", "electrical resistance changes with temperature", "mass changes with temperature", "length changes with temperature"], answerIndex: 1, hint: "It is an electrical component.", explanation: "A thermistor's electrical resistance changes with temperature, which the device converts into a reading.", guideRef: "thermometers" },
        ],
      },
      {
        id: "heat-mcq-p4",
        title: "MCQ Paper 4",
        questions: [
          { id: "heat-mcq-p4-q1", question: "Which is the most complete definition of heat?", options: ["How hot something feels", "Thermal energy, measured in joules", "The temperature in degrees", "A shiny surface"], answerIndex: 1, hint: "It is a form of energy.", explanation: "Heat is thermal energy measured in joules. 'How hot it feels' describes temperature.", guideRef: "heat-vs-temp" },
          { id: "heat-mcq-p4-q2", question: "If two objects are in thermal equilibrium, they have the same...", options: ["mass", "colour", "temperature", "size"], answerIndex: 2, hint: "No net energy flows between them.", explanation: "Thermal equilibrium means equal temperatures, so there is no net flow of thermal energy.", guideRef: "heat-vs-temp" },
          { id: "heat-mcq-p4-q3", question: "Which statement is true?", options: ["A small object is always hotter than a large one", "Temperature tells you the total energy", "Two objects at the same temperature can store different amounts of heat", "Heat and temperature are identical"], answerIndex: 2, hint: "Size and material matter for total energy.", explanation: "Temperature does not fix total energy; a larger object at the same temperature stores more heat.", guideRef: "heat-vs-temp" },
          { id: "heat-mcq-p4-q4", question: "Which change happens to particles as a substance is cooled?", options: ["They move faster", "They move more slowly", "They gain mass", "They vanish"], answerIndex: 1, hint: "Cooling removes energy.", explanation: "Cooling removes kinetic energy, so particles move more slowly. Their mass is unchanged.", guideRef: "particles" },
          { id: "heat-mcq-p4-q5", question: "In a solid, the particles...", options: ["move freely in all directions", "vibrate about fixed positions", "are completely still", "are far apart"], answerIndex: 1, hint: "They are locked in a structure.", explanation: "Solid particles vibrate about fixed positions; they cannot move past each other like in a liquid or gas.", guideRef: "particles" },
          { id: "heat-mcq-p4-q6", question: "Which everyday object relies on conduction to work as intended?", options: ["A metal cooking pan", "A foil survival blanket", "A hot-air balloon", "A double-glazed window"], answerIndex: 0, hint: "It must pass heat to the food.", explanation: "A metal pan conducts heat from the hob to the food. The others are designed to reduce or use other transfer methods.", guideRef: "conduction" },
          { id: "heat-mcq-p4-q7", question: "Heat is conducted poorly through water and air because they...", options: ["have free electrons", "have particles that are not tightly connected", "are metals", "reflect heat"], answerIndex: 1, hint: "No closely linked lattice or free electrons.", explanation: "Water and air lack free electrons and a tightly bonded structure, so they conduct poorly and act as insulators.", guideRef: "conduction" },
          { id: "heat-mcq-p4-q8", question: "Which would feel the coldest to touch at room temperature?", options: ["A wooden block", "A plastic ruler", "A metal key", "A woollen glove"], answerIndex: 2, hint: "Best conductor feels coldest.", explanation: "The metal key conducts heat away from your hand fastest, so it feels coldest even at the same temperature.", guideRef: "conduction" },
          { id: "heat-mcq-p4-q9", question: "Convection currents transfer energy by...", options: ["particles passing energy without moving", "the bulk movement of a heated fluid", "infrared waves", "expansion of a solid"], answerIndex: 1, hint: "The fluid itself moves.", explanation: "In convection the heated fluid physically moves, carrying its energy with it.", guideRef: "convection" },
          { id: "heat-mcq-p4-q10", question: "A hot-air balloon rises because the air inside is...", options: ["denser than the surrounding air", "less dense than the surrounding air", "the same density", "made of helium"], answerIndex: 1, hint: "Heating lowers density.", explanation: "Heating the air makes it less dense than the cooler outside air, so the balloon rises by convection/buoyancy.", guideRef: "convection" },
          { id: "heat-mcq-p4-q11", question: "Why does heating water from the top (instead of the bottom) heat it very slowly?", options: ["Radiation stops", "Warm water at the top cannot sink, so little convection occurs", "Conduction speeds up", "The water freezes"], answerIndex: 1, hint: "Warm fluid wants to rise, not sink.", explanation: "Warm water at the top is already less dense and stays there, so convection currents barely form and heating is slow.", guideRef: "convection" },
          { id: "heat-mcq-p4-q12", question: "The hotter an object becomes, the...", options: ["less radiation it emits", "more radiation it emits", "more it reflects only", "less it conducts"], answerIndex: 1, hint: "Temperature and emission rise together.", explanation: "Hotter objects emit more infrared radiation. This is why a very hot object can even glow.", guideRef: "radiation" },
          { id: "heat-mcq-p4-q13", question: "Which surface would lose heat by radiation most slowly?", options: ["Matt black", "Dull grey", "Shiny silver", "Dark green"], answerIndex: 2, hint: "Poor emitters keep heat in.", explanation: "Shiny silver is a poor emitter, so it loses heat by radiation most slowly. Dark matt surfaces emit fastest.", guideRef: "radiation" },
          { id: "heat-mcq-p4-q14", question: "You feel warmth from a campfire even when standing to the side of it. This is mainly...", options: ["conduction", "convection", "radiation", "expansion"], answerIndex: 2, hint: "Energy reaches you sideways through air.", explanation: "Infrared radiation travels outward in all directions to your skin; convection would carry warm air upward instead.", guideRef: "radiation" },
          { id: "heat-mcq-p4-q15", question: "Which combination correctly stops all three transfer methods in a vacuum flask?", options: ["Vacuum for conduction/convection, silvering for radiation", "Silvering for conduction, vacuum for radiation", "Air gap for radiation, plastic for convection", "Black walls for radiation, metal for conduction"], answerIndex: 0, hint: "Match each feature to what it blocks.", explanation: "The vacuum blocks conduction and convection; the silvered walls reflect radiation. Together they block all three.", guideRef: "insulation" },
          { id: "heat-mcq-p4-q16", question: "Why is air a key ingredient in most home insulation?", options: ["Air adds heat", "Trapped air conducts poorly and cannot circulate", "Air reflects radiation", "Air is a metal"], answerIndex: 1, hint: "Still air is a poor conductor.", explanation: "Trapped (still) air conducts heat poorly and cannot form convection currents, making it an excellent insulator.", guideRef: "insulation" },
          { id: "heat-mcq-p4-q17", question: "A polar bear's fur keeps it warm chiefly by...", options: ["conducting heat to the air", "trapping a layer of air to reduce heat loss", "reflecting sunlight only", "producing extra heat"], answerIndex: 1, hint: "Fur traps air.", explanation: "The fur traps a layer of insulating air next to the skin, reducing conduction of heat to the cold surroundings.", guideRef: "insulation" },
          { id: "heat-mcq-p4-q18", question: "Which design choice would make a flask keep a drink hot for LONGER?", options: ["Painting the inner walls matt black", "Removing the stopper", "Making the inner walls more shiny/silvered", "Filling the gap with copper"], answerIndex: 2, hint: "Reduce radiation loss.", explanation: "More shiny/silvered walls reflect more radiation back, reducing radiation loss and keeping the drink hot longer.", guideRef: "insulation" },
          { id: "heat-mcq-p4-q19", question: "Why do thick stone walls help keep old houses cool in summer and warm in winter?", options: ["Stone produces heat", "Stone is a slow conductor, smoothing out temperature changes", "Stone reflects all radiation", "Stone has free electrons"], answerIndex: 1, hint: "It conducts slowly.", explanation: "Stone conducts heat slowly, so it delays and smooths temperature changes between inside and outside.", guideRef: "insulation" },
          { id: "heat-mcq-p4-q20", question: "Which sequence shows expansion from least to most for the same temperature rise?", options: ["gas, liquid, solid", "solid, liquid, gas", "liquid, solid, gas", "solid, gas, liquid"], answerIndex: 1, hint: "Solids expand least.", explanation: "Solids expand least, then liquids, then gases expand most for the same temperature rise.", guideRef: "expansion" },
          { id: "heat-mcq-p4-q21", question: "A metal bridge is fitted with interlocking 'teeth' expansion joints so it can...", options: ["look attractive", "expand and contract without buckling", "carry electricity", "drain rainwater"], answerIndex: 1, hint: "Room to move.", explanation: "The expansion joints let the bridge lengthen on hot days and shrink on cold days without buckling or cracking.", guideRef: "expansion" },
          { id: "heat-mcq-p4-q22", question: "Telephone or power cables sag more on a hot summer day because they have...", options: ["contracted", "expanded and become longer", "gained mass", "melted"], answerIndex: 1, hint: "Heat lengthens metal.", explanation: "On hot days the metal expands and the cables become longer, so they sag more between the poles.", guideRef: "expansion" },
          { id: "heat-mcq-p4-q23", question: "Which uses thermal expansion to do a useful job?", options: ["A liquid-in-glass thermometer", "A foil blanket", "A vacuum gap", "A black solar panel"], answerIndex: 0, hint: "Liquid rises up a tube.", explanation: "A liquid-in-glass thermometer uses the expansion of a liquid to indicate temperature. The others use radiation or insulation.", guideRef: "thermometers" },
          { id: "heat-mcq-p4-q24", question: "Between its two fixed points, the Celsius scale is divided into...", options: ["10 equal degrees", "50 equal degrees", "100 equal degrees", "273 equal degrees"], answerIndex: 2, hint: "Freezing to boiling of water.", explanation: "The gap between 0 °C (freezing) and 100 °C (boiling) is divided into 100 equal degrees.", guideRef: "thermometers" },
          { id: "heat-mcq-p4-q25", question: "Which is the best reason to use an infrared thermometer on a furnace?", options: ["It is cheaper than glass", "It can measure very high temperatures without contact", "It uses expansion of mercury", "It must touch the metal"], answerIndex: 1, hint: "Too hot to touch.", explanation: "An infrared thermometer reads the radiation emitted, so it safely measures very hot objects without touching them.", guideRef: "thermometers" },
        ],
      },
    ],
    qaPapers: [
      {
        id: "heat-qa-p1",
        title: "Written Paper 1",
        questions: [
          { id: "heat-qa-p1-q1", question: "Define temperature and heat, and give the unit of each.", marks: 4, hint: "Two definitions, two units.", modelAnswer: "Temperature is a measure of how hot something is, measured in degrees Celsius (°C). Heat is thermal energy, a form of energy, measured in joules (J).", markScheme: [ { point: "Temperature is how hot something is", keywords: ["how hot", "hotness"] }, { point: "Temperature unit is °C", keywords: ["celsius", "°c", "degrees"] }, { point: "Heat is thermal energy/a form of energy", keywords: ["thermal energy", "energy"] }, { point: "Heat unit is joules", keywords: ["joule", "j"] } ], commonError: "Giving joules as the unit of temperature or treating the two as the same.", guideRef: "heat-vs-temp" },
          { id: "heat-qa-p1-q2", question: "State the direction in which thermal energy flows and explain when this flow stops.", marks: 2, hint: "Hot to cold, until...", modelAnswer: "Thermal energy flows from the hotter object to the colder object. The net flow stops when both objects reach the same temperature (thermal equilibrium).", markScheme: [ { point: "Flows from hotter to colder", keywords: ["hot to cold", "hotter to colder", "warmer to cooler"] }, { point: "Stops at equal temperature/equilibrium", keywords: ["same temperature", "equilibrium", "equal"] } ], commonError: "Saying cold flows into the hot object.", guideRef: "heat-vs-temp" },
          { id: "heat-qa-p1-q3", question: "Explain why a small spark at 1000 °C is less dangerous than a bath at 40 °C.", marks: 3, hint: "Compare temperature with amount of thermal energy.", modelAnswer: "Although the spark has a very high temperature, it is tiny so it holds very little thermal energy. The bath is at a lower temperature but contains a large mass of water, so it holds far more thermal energy and can transfer much more energy to your skin.", markScheme: [ { point: "Spark is small so holds little thermal energy", keywords: ["small", "little energy", "tiny"] }, { point: "Bath holds a lot of thermal energy", keywords: ["lot of energy", "large mass", "more energy"] }, { point: "More energy can be transferred from the bath", keywords: ["transfer", "more energy to skin", "burns"] } ], commonError: "Assuming higher temperature always means more dangerous, ignoring the amount of energy.", guideRef: "heat-vs-temp" },
          { id: "heat-qa-p1-q4", question: "Describe what happens to the particles of a substance when it is heated.", marks: 2, hint: "Think about kinetic energy.", modelAnswer: "The particles gain kinetic energy, so they move (or vibrate) faster. The hotter the substance, the faster the particles move.", markScheme: [ { point: "Particles gain energy", keywords: ["gain energy", "kinetic", "more energy"] }, { point: "Particles move/vibrate faster", keywords: ["faster", "vibrate", "move quicker"] } ], commonError: "Saying the particles get bigger or gain mass.", guideRef: "particles" },
          { id: "heat-qa-p1-q5", question: "Explain why temperature is described as the average kinetic energy of particles, not the total.", marks: 2, hint: "Compare a small and a large object.", modelAnswer: "Temperature depends on how fast the particles move on average, not on how many there are. A large object can have the same average particle energy (temperature) as a small one but far more total energy because it has more particles.", markScheme: [ { point: "Temperature is the average particle energy", keywords: ["average", "per particle"] }, { point: "Total energy also depends on number of particles", keywords: ["total", "more particles", "amount"] } ], commonError: "Confusing temperature (average) with thermal energy (total).", guideRef: "particles" },
          { id: "heat-qa-p1-q6", question: "Define conduction.", marks: 2, hint: "Mention solids and particles.", modelAnswer: "Conduction is the transfer of thermal energy through a material, mainly solids, by particles passing energy to neighbouring particles without the material itself moving along.", markScheme: [ { point: "Transfer of thermal energy through a material/solid", keywords: ["transfer", "through", "solid"] }, { point: "Particles pass energy to neighbours (material does not flow)", keywords: ["particle", "neighbour", "pass", "does not move"] } ], commonError: "Describing convection (moving fluid) instead of conduction.", guideRef: "conduction" },
          { id: "heat-qa-p1-q7", question: "Explain why metals are better conductors of thermal energy than non-metals.", marks: 3, hint: "Think about a special kind of particle.", modelAnswer: "Metals contain free electrons that can move through the whole metal. When the metal is heated these electrons gain energy and carry it quickly from the hot end to the cold end. Non-metals have no free electrons, so they rely only on slower particle vibrations.", markScheme: [ { point: "Metals contain free electrons", keywords: ["free electron", "electrons"] }, { point: "Electrons carry energy quickly through the metal", keywords: ["carry", "quickly", "fast"] }, { point: "Non-metals lack free electrons so conduct slowly", keywords: ["no free electrons", "non-metal", "vibration only"] } ], commonError: "Saying metals conduct well because they are shiny or heavy.", guideRef: "conduction" },
          { id: "heat-qa-p1-q8", question: "A metal spoon and a wooden spoon are both at room temperature. Explain why the metal spoon feels colder.", marks: 3, hint: "They are the same temperature.", modelAnswer: "Both spoons are at the same temperature. The metal is a good conductor, so it conducts thermal energy away from your warm hand quickly, making your hand feel cooler. The wood is an insulator and conducts heat away slowly, so it feels warmer.", markScheme: [ { point: "Both at the same temperature", keywords: ["same temperature", "equal temperature"] }, { point: "Metal conducts heat away from hand quickly", keywords: ["conduct", "away", "quickly", "good conductor"] }, { point: "Wood/insulator conducts away slowly so feels warmer", keywords: ["insulator", "slowly", "warmer"] } ], commonError: "Saying the metal is genuinely colder than the wood.", guideRef: "conduction" },
          { id: "heat-qa-p1-q9", question: "Define convection and state where it can occur.", marks: 2, hint: "Movement of which kind of material?", modelAnswer: "Convection is the transfer of thermal energy by the movement of a fluid. It can occur in liquids and gases (fluids) but not in solids, because solids cannot flow.", markScheme: [ { point: "Transfer of energy by movement of a fluid", keywords: ["movement", "fluid", "flow"] }, { point: "Occurs in liquids and gases, not solids", keywords: ["liquid", "gas", "not solid"] } ], commonError: "Saying convection happens in solids.", guideRef: "convection" },
          { id: "heat-qa-p1-q10", question: "Explain, in terms of density, why a heated fluid rises.", marks: 3, hint: "Heating, expansion, density.", modelAnswer: "When a fluid is heated, its particles move faster and spread out, so it expands. This makes it less dense than the surrounding fluid. Being less dense, the warm fluid rises, and cooler, denser fluid sinks to take its place.", markScheme: [ { point: "Heated fluid expands", keywords: ["expand", "spread out"] }, { point: "It becomes less dense", keywords: ["less dense", "lower density"] }, { point: "Less dense fluid rises (denser sinks)", keywords: ["rises", "sinks", "replace"] } ], commonError: "Saying it rises because it is 'lighter' without mentioning density.", guideRef: "convection" },
          { id: "heat-qa-p1-q11", question: "Describe how a convection current is set up when a beaker of water is heated from below.", marks: 3, hint: "Trace the loop.", modelAnswer: "The water at the bottom is heated, expands and becomes less dense, so it rises. At the top it cools, becomes denser and sinks. Cooler water moves in to be heated, so a continuous circulating loop, the convection current, is set up.", markScheme: [ { point: "Bottom water heated, becomes less dense and rises", keywords: ["heated", "rises", "less dense"] }, { point: "At the top it cools, becomes denser and sinks", keywords: ["cools", "sinks", "denser"] }, { point: "Continuous circulating loop/current", keywords: ["loop", "current", "circulate", "continuous"] } ], commonError: "Describing only the rising warm water and not the sinking cool water.", guideRef: "convection" },
          { id: "heat-qa-p1-q12", question: "Explain how a sea breeze forms on a sunny day.", marks: 3, hint: "Land warms faster than sea.", modelAnswer: "On a sunny day the land warms up faster than the sea. The air above the warm land is heated, becomes less dense and rises. Cooler, denser air from over the sea flows in to replace it, creating a breeze blowing from the sea to the land.", markScheme: [ { point: "Land warms faster than the sea", keywords: ["land warms faster", "land heats", "quicker"] }, { point: "Warm air over land rises (less dense)", keywords: ["rises", "less dense", "warm air"] }, { point: "Cooler air flows in from the sea", keywords: ["from the sea", "flows in", "replace", "breeze"] } ], commonError: "Getting the direction of the breeze the wrong way round.", guideRef: "convection" },
          { id: "heat-qa-p1-q13", question: "Define thermal radiation and state one way it differs from conduction and convection.", marks: 3, hint: "Waves and medium.", modelAnswer: "Thermal radiation is energy transferred as infrared electromagnetic waves. Unlike conduction and convection, it does not need any particles or a medium, so it can travel through a vacuum.", markScheme: [ { point: "Energy carried as infrared/electromagnetic waves", keywords: ["infrared", "electromagnetic", "waves"] }, { point: "Needs no particles/medium", keywords: ["no particles", "no medium", "needs nothing"] }, { point: "Can travel through a vacuum", keywords: ["vacuum", "empty space"] } ], commonError: "Saying radiation needs air or particles to travel.", guideRef: "radiation" },
          { id: "heat-qa-p1-q14", question: "Explain why the Sun's energy can reach the Earth but conduction and convection cannot do this job.", marks: 3, hint: "Space is a vacuum.", modelAnswer: "Space between the Sun and Earth is a vacuum with almost no particles. Radiation travels as waves and needs no medium, so it crosses the vacuum. Conduction and convection both need particles to carry the energy, so they cannot work through empty space.", markScheme: [ { point: "Space is a vacuum/no particles", keywords: ["vacuum", "no particles", "empty"] }, { point: "Radiation needs no medium so crosses it", keywords: ["radiation", "no medium", "waves"] }, { point: "Conduction and convection need particles", keywords: ["need particles", "conduction", "convection"] } ], commonError: "Forgetting to say why conduction and convection fail in a vacuum.", guideRef: "radiation" },
          { id: "heat-qa-p1-q15", question: "Compare how dark matt and shiny light surfaces behave with infrared radiation.", marks: 4, hint: "Emit, absorb, reflect.", modelAnswer: "Dark, matt surfaces are good emitters and good absorbers of infrared radiation. Shiny, light surfaces are poor emitters and poor absorbers; instead they reflect radiation. So a dark object heats up and cools down by radiation faster than a shiny one.", markScheme: [ { point: "Dark matt surfaces are good absorbers", keywords: ["dark", "absorb", "good absorber"] }, { point: "Dark matt surfaces are good emitters", keywords: ["emit", "good emitter"] }, { point: "Shiny light surfaces reflect radiation", keywords: ["shiny", "reflect", "light"] }, { point: "Shiny surfaces are poor absorbers/emitters", keywords: ["poor absorber", "poor emitter"] } ], commonError: "Saying shiny surfaces absorb well.", guideRef: "radiation" },
          { id: "heat-qa-p1-q16", question: "A vacuum flask keeps a drink hot. Explain how it reduces heat loss by all three methods.", marks: 4, hint: "Vacuum, silvering, stopper.", modelAnswer: "The vacuum between the walls has no particles, so it stops conduction and convection. The silvered walls reflect infrared radiation back towards the drink. The stopper reduces heat lost by convection and evaporation from the top. Together these greatly slow the loss of thermal energy.", markScheme: [ { point: "Vacuum stops conduction", keywords: ["vacuum", "conduction", "no particles"] }, { point: "Vacuum stops convection", keywords: ["convection", "no fluid", "cannot circulate"] }, { point: "Silvered walls reflect radiation", keywords: ["silvered", "shiny", "reflect", "radiation"] }, { point: "Stopper reduces loss from the top", keywords: ["stopper", "lid", "top", "evaporation"] } ], commonError: "Only mentioning one or two methods, or saying it adds heat.", guideRef: "insulation" },
          { id: "heat-qa-p1-q17", question: "Explain why trapped air is used in so many forms of insulation.", marks: 2, hint: "Two reasons.", modelAnswer: "Air is a poor conductor of heat, so it slows conduction. When the air is trapped it cannot circulate, so it also cannot transfer heat by convection. This makes trapped air an excellent insulator.", markScheme: [ { point: "Air conducts poorly", keywords: ["poor conductor", "conducts poorly", "insulator"] }, { point: "Trapped air cannot form convection currents", keywords: ["trapped", "cannot circulate", "no convection"] } ], commonError: "Saying air adds heat or only mentioning one reason.", guideRef: "insulation" },
          { id: "heat-qa-p1-q18", question: "Describe two ways a home can be insulated to reduce heat loss and explain how each works.", marks: 4, hint: "Pick from loft, cavity walls, double glazing.", modelAnswer: "Loft insulation is a thick layer of wool-like material in the roof that traps air and slows conduction and convection of heat upwards. Double glazing uses two panes of glass with trapped air or a vacuum between them, which slows conduction of heat through the window.", markScheme: [ { point: "Names loft insulation", keywords: ["loft", "roof insulation"] }, { point: "Loft traps air/slows conduction and convection", keywords: ["traps air", "slows conduction", "convection"] }, { point: "Names double glazing (or cavity walls)", keywords: ["double glazing", "cavity wall"] }, { point: "Explains it traps air/vacuum to slow conduction", keywords: ["trapped air", "vacuum", "slows conduction"] } ], commonError: "Naming a method without explaining how it works.", guideRef: "insulation" },
          { id: "heat-qa-p1-q19", question: "Explain how a polar animal such as a seal stays warm in cold water.", marks: 2, hint: "Think about an insulating layer.", modelAnswer: "Seals have a thick layer of fat called blubber under the skin. Blubber is a poor conductor of heat, so it slows the loss of thermal energy from the warm body to the cold water.", markScheme: [ { point: "Has a thick fat/blubber layer", keywords: ["blubber", "fat", "thick layer"] }, { point: "It is a poor conductor that slows heat loss", keywords: ["poor conductor", "insulator", "slows heat loss"] } ], commonError: "Saying the fat produces or adds heat.", guideRef: "insulation" },
          { id: "heat-qa-p1-q20", question: "Define thermal expansion and state what happens to the particles.", marks: 2, hint: "Particles move apart.", modelAnswer: "Thermal expansion is the increase in size (volume) of a material when it is heated. The particles gain energy and move further apart, so the material takes up more space, although its mass stays the same.", markScheme: [ { point: "Material gets bigger/volume increases when heated", keywords: ["bigger", "expand", "volume increases"] }, { point: "Particles move further apart (mass unchanged)", keywords: ["further apart", "spread out", "mass same"] } ], commonError: "Saying the material gains mass or extra particles.", guideRef: "expansion" },
          { id: "heat-qa-p1-q21", question: "Explain why gaps are left between sections of a steel railway line.", marks: 3, hint: "Hot day.", modelAnswer: "On a hot day the steel rails gain thermal energy and expand, becoming longer. If there were no gaps the expanding rails would push against each other with a very large force and could buckle. The gaps give the rails room to expand safely.", markScheme: [ { point: "Heating makes the rails expand/lengthen", keywords: ["expand", "longer", "bigger"] }, { point: "Without gaps large forces would build up", keywords: ["force", "push", "no gap"] }, { point: "Gaps prevent buckling", keywords: ["gap", "prevent", "buckle", "bend"] } ], commonError: "Saying the rails gain mass when they expand.", guideRef: "expansion" },
          { id: "heat-qa-p1-q22", question: "Place solids, liquids and gases in order of how much they expand for the same temperature rise, and briefly explain the order.", marks: 3, hint: "Think about how tightly the particles are held.", modelAnswer: "Gases expand most, then liquids, then solids. In a solid the particles are held tightly in fixed positions so they can only move apart a little; in a liquid they are freer; in a gas they are far apart and free to spread out a lot, so the gas expands most.", markScheme: [ { point: "Order: gases > liquids > solids", keywords: ["gas most", "solid least", "gas, liquid, solid"] }, { point: "Solid particles held tightly so expand least", keywords: ["tightly", "fixed", "held", "bonds"] }, { point: "Gas particles free/far apart so expand most", keywords: ["far apart", "free", "spread"] } ], commonError: "Getting the order reversed.", guideRef: "expansion" },
          { id: "heat-qa-p1-q23", question: "Explain how a liquid-in-glass thermometer measures temperature.", marks: 3, hint: "Expansion up a tube.", modelAnswer: "The bulb contains a liquid. When the temperature rises, the liquid gains energy and expands, rising up the thin capillary tube. The level of the liquid is read against a printed scale in degrees Celsius, giving the temperature.", markScheme: [ { point: "Liquid in the bulb expands when warmed", keywords: ["expands", "liquid", "warmed"] }, { point: "Liquid rises up the thin tube", keywords: ["rises", "tube", "capillary"] }, { point: "Level read against the °C scale", keywords: ["scale", "read", "celsius"] } ], commonError: "Saying the liquid changes colour rather than expands.", guideRef: "thermometers" },
          { id: "heat-qa-p1-q24", question: "State the two fixed points of the Celsius scale and the value at each.", marks: 2, hint: "Water freezing and boiling.", modelAnswer: "The two fixed points are the freezing point of pure water, set at 0 °C, and the boiling point of pure water, set at 100 °C, both at normal pressure.", markScheme: [ { point: "Freezing point of water = 0 °C", keywords: ["freezing", "0", "ice"] }, { point: "Boiling point of water = 100 °C", keywords: ["boiling", "100"] } ], commonError: "Quoting body temperature (37 °C) as a fixed point.", guideRef: "thermometers" },
          { id: "heat-qa-p1-q25", question: "Suggest why an infrared thermometer is a good choice for measuring the temperature of molten metal in a factory.", marks: 2, hint: "Too hot to touch.", modelAnswer: "An infrared thermometer detects the radiation emitted by the metal, so it can measure the temperature without touching it. This is safer for very hot molten metal, which would damage a normal thermometer and cannot be touched.", markScheme: [ { point: "Measures without contact (detects radiation)", keywords: ["no contact", "without touching", "radiation"] }, { point: "Safer for very hot molten metal", keywords: ["safe", "very hot", "too hot to touch"] } ], commonError: "Saying it must touch the metal to work.", guideRef: "thermometers" },
        ],
      },
    ],
