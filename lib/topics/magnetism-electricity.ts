import type { Topic } from "../types";

export const magnetismElectricity: Topic = {
  id: "magnetism-electricity",
  title: "Magnetism & Electricity",
  subject: "Physics",
  icon: "🧲",
  summary: "Magnets, circuits, current and electromagnets.",
  intro:
    "From the compass that guided explorers across oceans to the electric motor spinning inside every fan, magnetism and electricity shape the modern world. In this topic you will discover how invisible fields push and pull, how current flows around a complete loop, and how a coil of wire can become a magnet you switch on and off. By the end you will be able to read circuit diagrams, measure current and voltage, and explain how an electromagnet lifts a car.",

  guide: [
    {
      id: "magnets-and-poles",
      heading: "Magnets and their poles",
      body:
        "A **magnet** is a material that attracts magnetic materials and that has two ends called **poles** — a **north pole (N)** and a **south pole (S)**. No matter how many times you cut a bar magnet, each piece always has both a north and a south pole; you can never get a single pole on its own.\n\nThe golden rule of poles is:\n\n- **Like poles repel** (N–N or S–S push apart).\n- **Unlike poles attract** (N–S pull together).\n\nOnly a few materials are **magnetic** (also called *ferromagnetic*) — meaning they are attracted to a magnet and can be made into magnets. The four to remember are **iron, steel, nickel and cobalt**. Most everyday materials — copper, aluminium, plastic, wood, glass and water — are **non-magnetic** and feel no force from a magnet. (Steel is mostly iron, which is why it is magnetic.)",
      diagram:
        '<svg viewBox="0 0 260 110" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Two bar magnets, like poles repelling and unlike poles attracting"><rect x="15" y="20" width="45" height="22" fill="#ef4444"/><rect x="60" y="20" width="45" height="22" fill="#3b82f6"/><text x="37" y="36" font-size="13" text-anchor="middle" fill="#fff">N</text><text x="82" y="36" font-size="13" text-anchor="middle" fill="#fff">S</text><rect x="125" y="20" width="45" height="22" fill="#ef4444"/><rect x="170" y="20" width="45" height="22" fill="#3b82f6"/><text x="147" y="36" font-size="13" text-anchor="middle" fill="#fff">N</text><text x="192" y="36" font-size="13" text-anchor="middle" fill="#fff">S</text><text x="115" y="36" font-size="13" text-anchor="middle" fill="#14532d">&#8594; &#8592;</text><text x="130" y="60" font-size="10" fill="#14532d">unlike poles attract</text><rect x="15" y="75" width="45" height="22" fill="#ef4444"/><rect x="105" y="75" width="45" height="22" fill="#ef4444"/><text x="37" y="91" font-size="13" text-anchor="middle" fill="#fff">N</text><text x="127" y="91" font-size="13" text-anchor="middle" fill="#fff">N</text><text x="70" y="91" font-size="13" text-anchor="middle" fill="#991b1b">&#8592; &#8594;</text><text x="160" y="91" font-size="10" fill="#991b1b">like poles repel</text></svg>',
      diagramCaption: "Unlike poles (N–S) attract; like poles (N–N or S–S) repel.",
      keyPoints: [
        "Every magnet has two poles: north and south — you can never isolate a single pole.",
        "Like poles repel, unlike poles attract.",
        "Magnetic materials: iron, steel, nickel, cobalt. Almost everything else is non-magnetic.",
      ],
      thinkDeeper:
        "If you hang an unmarked bar magnet from a thread and it slowly turns to point north–south, how could you work out which end is its north pole — without using a second magnet or a compass that is already labelled?",
    },
    {
      id: "magnetic-fields",
      heading: "Magnetic fields and field lines",
      body:
        "A magnet does not need to touch an object to push or pull it — it has a **magnetic field**, the region of space around it where another magnet or magnetic material feels a force.\n\nWe draw the field as **field lines** (also called *lines of force*). By agreement:\n\n- Field lines always point **from the north pole to the south pole** *outside* the magnet.\n- Field lines never cross.\n- Where the lines are **closest together, the field is strongest** — and they are most crowded at the **poles**.\n\nYou can reveal the field two ways. Sprinkling **iron filings** on paper over a magnet makes them line up along the field lines. Or you can move a small **plotting compass** around the magnet: its needle always lines up with the field, so you can mark the direction at each point and join the marks into smooth curves.",
      diagram:
        '<svg viewBox="0 0 240 130" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Magnetic field lines curving from the north pole to the south pole of a bar magnet"><rect x="95" y="55" width="25" height="20" fill="#ef4444"/><rect x="120" y="55" width="25" height="20" fill="#3b82f6"/><text x="107" y="70" font-size="11" text-anchor="middle" fill="#fff">N</text><text x="132" y="70" font-size="11" text-anchor="middle" fill="#fff">S</text><path d="M118 55 C118 20 122 20 122 55" fill="none" stroke="#7c3aed" stroke-width="1.5"/><path d="M112 55 C100 10 140 10 128 55" fill="none" stroke="#7c3aed" stroke-width="1.5"/><path d="M104 56 C70 5 170 5 136 56" fill="none" stroke="#7c3aed" stroke-width="1.5"/><path d="M118 75 C118 110 122 110 122 75" fill="none" stroke="#7c3aed" stroke-width="1.5"/><path d="M112 75 C100 120 140 120 128 75" fill="none" stroke="#7c3aed" stroke-width="1.5"/><path d="M104 74 C70 125 170 125 136 74" fill="none" stroke="#7c3aed" stroke-width="1.5"/><polygon points="118,18 115,24 121,24" fill="#7c3aed"/><polygon points="118,108 121,102 115,102" fill="#7c3aed"/></svg>',
      diagramCaption: "Field lines run from N to S; they bunch up at the poles where the field is strongest.",
      keyPoints: [
        "Field lines run from north to south outside the magnet and never cross.",
        "Lines closest together = strongest field (at the poles).",
        "Reveal a field with iron filings or by plotting it with a small compass.",
      ],
      thinkDeeper:
        "Iron filings show you the *shape* of a field but not its *direction*. A plotting compass shows direction too. Why does a compass give you the extra information that the filings cannot?",
    },
    {
      id: "earth-as-magnet",
      heading: "The Earth as a giant magnet",
      body:
        "A **compass** is just a tiny bar magnet, free to spin, with its north pole painted red. Left alone, it always settles pointing roughly north–south. That only makes sense if there is a huge magnet nearby pulling on it — and there is: **the Earth itself behaves like a giant bar magnet.**\n\nThe Earth's magnetic field comes from swirling molten iron in its outer core. Here is the twist that catches people out: because *unlike poles attract*, the end of the compass that points to the geographic North is its **north pole** — so the Earth must have a **magnetic south pole near the geographic North Pole**. The names are confusing, but the physics is simple: the compass's north is attracted to the Earth's (magnetic) south.\n\nFor centuries sailors and explorers used compasses to navigate when they could not see the stars, which is why magnetism literally changed the map of the world.",
      diagram:
        '<svg viewBox="0 0 180 170" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="The Earth shown as a bar magnet with field lines and a compass needle"><circle cx="90" cy="85" r="55" fill="#bfdbfe" stroke="#1e3a8a"/><rect x="83" y="45" width="14" height="35" fill="#3b82f6"/><rect x="83" y="80" width="14" height="35" fill="#ef4444"/><text x="90" y="40" font-size="9" text-anchor="middle" fill="#1e3a8a">geographic N</text><text x="90" y="155" font-size="9" text-anchor="middle" fill="#1e3a8a">geographic S</text><text x="90" y="66" font-size="8" text-anchor="middle" fill="#fff">S</text><text x="90" y="103" font-size="8" text-anchor="middle" fill="#fff">N</text><path d="M90 30 C150 60 150 110 90 140" fill="none" stroke="#7c3aed" stroke-width="1.2"/><path d="M90 30 C30 60 30 110 90 140" fill="none" stroke="#7c3aed" stroke-width="1.2"/><line x1="150" y1="20" x2="158" y2="28" stroke="#ef4444" stroke-width="3"/><text x="150" y="16" font-size="8" fill="#991b1b">compass N points north</text></svg>',
      diagramCaption: "The Earth acts like a bar magnet; its magnetic south pole lies near the geographic North.",
      keyPoints: [
        "A compass needle is a small bar magnet that lines up with Earth's field.",
        "Earth behaves like a giant magnet, with a magnetic south pole near geographic North.",
        "The compass's north pole points north because unlike poles attract.",
      ],
      thinkDeeper:
        "If you took a working compass deep underground next to a strong electromagnet, it might point the wrong way. What does that tell you about how a compass actually 'decides' which way to point?",
    },
    {
      id: "permanent-vs-temporary",
      heading: "Permanent and temporary magnets",
      body:
        "Not all magnets are the same. A **permanent magnet** keeps its magnetism for a long time once made — the magnets on your fridge are permanent, and they are usually made of **steel** or special alloys. A **temporary magnet** (sometimes called a *soft* magnet) is only magnetic while it is near another magnet or while current flows; it loses its magnetism easily. **Pure iron** is the classic temporary magnet.\n\nYou can **magnetise** a piece of iron or steel by stroking it repeatedly in the same direction with one pole of a permanent magnet, or by placing it inside a coil carrying current. This lines up the tiny magnetic regions inside (called *domains*) so they all point the same way.\n\nYou can **demagnetise** a magnet by:\n\n- **Heating** it strongly,\n- **Hammering** or dropping it repeatedly, or\n- Stroking it with an alternating current coil.\n\nAll of these jumble the domains so they point in random directions again, cancelling out.",
      diagram:
        '<svg viewBox="0 0 240 110" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Domains randomly arranged when unmagnetised and lined up when magnetised"><text x="55" y="14" font-size="10" text-anchor="middle" fill="#334155">unmagnetised</text><rect x="15" y="20" width="80" height="40" fill="none" stroke="#334155"/><text x="25" y="35" font-size="11">&#8599;</text><text x="45" y="35" font-size="11">&#8600;</text><text x="65" y="35" font-size="11">&#8592;</text><text x="30" y="55" font-size="11">&#8593;</text><text x="55" y="55" font-size="11">&#8601;</text><text x="78" y="55" font-size="11">&#8594;</text><text x="185" y="14" font-size="10" text-anchor="middle" fill="#334155">magnetised</text><rect x="145" y="20" width="80" height="40" fill="none" stroke="#334155"/><text x="155" y="35" font-size="11">&#8594;</text><text x="175" y="35" font-size="11">&#8594;</text><text x="195" y="35" font-size="11">&#8594;</text><text x="155" y="55" font-size="11">&#8594;</text><text x="175" y="55" font-size="11">&#8594;</text><text x="195" y="55" font-size="11">&#8594;</text><text x="120" y="95" font-size="9" text-anchor="middle" fill="#334155">domains line up when magnetised; heating/hammering jumbles them</text></svg>',
      diagramCaption: "Magnetising lines up the domains; heating or hammering randomises them (demagnetising).",
      keyPoints: [
        "Permanent magnets (steel) keep their magnetism; temporary magnets (iron) lose it easily.",
        "Magnetise by stroking with a magnet or using a current-carrying coil — this lines up domains.",
        "Demagnetise by heating, hammering, or using an alternating-current coil.",
      ],
      thinkDeeper:
        "Steel makes good permanent magnets but iron is better inside an electromagnet that needs to switch off. Using the idea of domains, explain why the property that makes iron 'bad' at staying magnetic makes it 'good' for an electromagnet.",
    },
    {
      id: "electromagnets",
      heading: "Electromagnets",
      body:
        "When an electric current flows through a wire, it creates a **magnetic field** around the wire. Wind the wire into a **coil** (a tightly wound coil is called a **solenoid**) and the fields of all the loops add together, giving a magnetic field just like a bar magnet's — with a north pole at one end and a south pole at the other. This is an **electromagnet**.\n\nIts huge advantage over a permanent magnet is that it can be **switched on and off**: when the current stops, the magnetism vanishes. You can also reverse its poles by reversing the current.\n\nThere are **three ways to make an electromagnet stronger**:\n\n- **More turns** of wire on the coil,\n- **More current** flowing (e.g. a bigger battery),\n- Adding an **iron core** inside the coil (iron is temporary, so it loses its magnetism when switched off).\n\nElectromagnets are everywhere: the **scrapyard crane** that lifts and drops cars, the **electric bell**, **relays** (switches operated by a small current), **loudspeakers** and **electric motors**.",
      diagram:
        '<svg viewBox="0 0 240 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A solenoid coil around an iron core connected to a cell, forming an electromagnet"><rect x="60" y="50" width="120" height="20" fill="#9ca3af" stroke="#4b5563"/><text x="120" y="64" font-size="9" text-anchor="middle" fill="#1f2937">iron core</text><g stroke="#b45309" stroke-width="3" fill="none"><path d="M70 50 q5 -12 10 0"/><path d="M90 50 q5 -12 10 0"/><path d="M110 50 q5 -12 10 0"/><path d="M130 50 q5 -12 10 0"/><path d="M150 50 q5 -12 10 0"/></g><text x="55" y="60" font-size="11" text-anchor="middle" fill="#991b1b">N</text><text x="185" y="60" font-size="11" text-anchor="middle" fill="#1e3a8a">S</text><line x1="70" y1="50" x2="70" y2="95" stroke="#333"/><line x1="160" y1="50" x2="160" y2="95" stroke="#333"/><line x1="70" y1="95" x2="105" y2="95" stroke="#333"/><line x1="125" y1="95" x2="160" y2="95" stroke="#333"/><line x1="105" y1="88" x2="105" y2="102" stroke="#333" stroke-width="2"/><line x1="125" y1="92" x2="125" y2="98" stroke="#333" stroke-width="2"/><text x="115" y="115" font-size="9" text-anchor="middle" fill="#334155">cell</text></svg>',
      diagramCaption: "A solenoid with an iron core: current makes it a magnet that switches on and off.",
      keyPoints: [
        "Current in a coil (solenoid) makes a magnetic field like a bar magnet.",
        "Make it stronger: more turns, more current, add an iron core.",
        "Key advantage: it can be switched on/off (and reversed). Uses: cranes, bells, relays, motors.",
      ],
      thinkDeeper:
        "A scrapyard crane uses an electromagnet, not a permanent magnet, even though a permanent magnet would never run out of power. Explain the design reason — and what disaster a permanent magnet would cause.",
    },
    {
      id: "current-and-circuits",
      heading: "Electric current, conductors and insulators",
      body:
        "**Electric current** is the flow of electric **charge** around a circuit. For current to flow you need two things: a **complete (unbroken) loop**, and an **energy source** — a **cell** (or several cells joined together, called a **battery**). The cell acts like a pump, pushing the charge around the loop.\n\nIf there is any gap in the loop — an open switch, a broken wire — the current stops everywhere instantly.\n\nMaterials are divided by how well they let current pass:\n\n- **Conductors** let current flow easily. All **metals** (copper, gold, aluminium) are good conductors; carbon (graphite) conducts too.\n- **Insulators** do not let current flow. Plastic, rubber, glass, wood and dry air are insulators.\n\nThis is why wires are made of copper (a conductor) wrapped in plastic (an insulator) — the plastic keeps the current in the wire and keeps you safe.",
      diagram:
        '<svg viewBox="0 0 220 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A simple complete circuit with a cell and a bulb, current flowing around the loop"><rect x="30" y="30" width="160" height="70" fill="none" stroke="#333" stroke-width="2"/><line x1="100" y1="30" x2="100" y2="22" stroke="#333" stroke-width="2"/><line x1="120" y1="30" x2="120" y2="38" stroke="#333" stroke-width="4"/><text x="92" y="20" font-size="9" fill="#334155">cell</text><circle cx="110" cy="100" r="11" fill="#fef9c3" stroke="#333" stroke-width="2"/><line x1="103" y1="93" x2="117" y2="107" stroke="#333"/><line x1="117" y1="93" x2="103" y2="107" stroke="#333"/><text x="135" y="103" font-size="9" fill="#334155">bulb</text><polygon points="30,65 34,59 34,71" fill="#16a34a"/><text x="15" y="68" font-size="10" fill="#166534">I</text></svg>',
      diagramCaption: "A complete loop with a cell (the pump) and a bulb; break the loop and current stops.",
      keyPoints: [
        "Current = flow of charge; it needs a complete loop and a cell/battery to push it.",
        "Break the circuit anywhere and current stops everywhere.",
        "Conductors (metals, carbon) let current flow; insulators (plastic, rubber, glass) do not.",
      ],
      thinkDeeper:
        "A torch bulb lights instantly the moment you close the switch, even though the individual charges drift very slowly. How can the bulb respond so fast if the charges themselves are crawling along the wire?",
    },
    {
      id: "circuit-symbols-diagrams",
      heading: "Circuit symbols and diagrams",
      body:
        "Rather than drawing realistic pictures, scientists use standard **circuit symbols** so that anyone, anywhere, can read a circuit diagram. The key ones for Year 8 are:\n\n- **Cell** — a long thin line (+) and a short thick line (−). A **battery** is two or more cells in a row.\n- **Lamp/bulb** — a circle with a cross inside.\n- **Switch** — a line that lifts to make a gap (open) or drops to close.\n- **Ammeter** — a circle with a letter **A** (measures current).\n- **Voltmeter** — a circle with a letter **V** (measures voltage).\n- **Resistor** — a rectangle (limits the current).\n- **Motor** — a circle with a letter **M**.\n\nWhen you draw a circuit diagram, use straight lines for wires, neat right-angle corners, and place each symbol clearly. A good diagram is a single complete loop (or set of loops) with no ambiguous gaps.",
      diagram:
        '<svg viewBox="0 0 300 90" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Standard circuit symbols for cell, lamp, switch, ammeter, voltmeter and resistor"><g stroke="#333" stroke-width="2" fill="none"><line x1="20" y1="25" x2="20" y2="45"/><line x1="28" y1="30" x2="28" y2="40"/></g><text x="24" y="60" font-size="9" text-anchor="middle" fill="#334155">cell</text><circle cx="70" cy="35" r="11" fill="none" stroke="#333" stroke-width="2"/><line x1="62" y1="27" x2="78" y2="43" stroke="#333"/><line x1="78" y1="27" x2="62" y2="43" stroke="#333"/><text x="70" y="60" font-size="9" text-anchor="middle" fill="#334155">lamp</text><line x1="105" y1="35" x2="118" y2="35" stroke="#333" stroke-width="2"/><line x1="118" y1="35" x2="132" y2="26" stroke="#333" stroke-width="2"/><line x1="132" y1="35" x2="145" y2="35" stroke="#333" stroke-width="2"/><text x="125" y="60" font-size="9" text-anchor="middle" fill="#334155">switch</text><circle cx="178" cy="35" r="11" fill="none" stroke="#333" stroke-width="2"/><text x="178" y="39" font-size="11" text-anchor="middle" fill="#333">A</text><text x="178" y="60" font-size="9" text-anchor="middle" fill="#334155">ammeter</text><circle cx="220" cy="35" r="11" fill="none" stroke="#333" stroke-width="2"/><text x="220" y="39" font-size="11" text-anchor="middle" fill="#333">V</text><text x="220" y="60" font-size="9" text-anchor="middle" fill="#334155">voltmeter</text><rect x="252" y="28" width="26" height="14" fill="none" stroke="#333" stroke-width="2"/><text x="265" y="60" font-size="9" text-anchor="middle" fill="#334155">resistor</text></svg>',
      diagramCaption: "Standard symbols: cell, lamp, switch, ammeter (A), voltmeter (V) and resistor.",
      keyPoints: [
        "Circuit symbols are a universal language for drawing circuits.",
        "Cell = long+short lines; lamp = circle with a cross; ammeter = (A); voltmeter = (V).",
        "Draw wires as straight lines with neat corners forming complete loops.",
      ],
      thinkDeeper:
        "Why is it useful that every scientist in the world uses the same circuit symbols, rather than each drawing realistic pictures of the components? What kind of mistakes does the standard system prevent?",
    },
    {
      id: "series-and-parallel",
      heading: "Series and parallel circuits",
      body:
        "Components can be joined in two ways.\n\nIn a **series circuit** everything is on **one single loop**, one after another. The current is the **same everywhere** in the loop. But the cell's push is shared between all the components, so **adding more bulbs makes them all dimmer**, and if one bulb breaks the gap stops the current and they **all go out**.\n\nIn a **parallel circuit** the components are on **separate branches** (separate loops). Each branch gets the full push of the cell, so the bulbs **stay bright** even when you add more. Best of all, if one branch breaks, the others **keep working** — which is exactly why the lights and sockets in your house are wired in parallel.\n\nQuick summary:\n\n- **Series**: one loop, current the same, more bulbs = dimmer, one breaks = all off.\n- **Parallel**: many branches, each full brightness, one breaks = others stay on.",
      diagram:
        '<svg viewBox="0 0 300 130" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A series circuit with two bulbs on one loop and a parallel circuit with two bulbs on separate branches"><text x="75" y="14" font-size="10" text-anchor="middle" fill="#334155">series</text><rect x="25" y="25" width="100" height="70" fill="none" stroke="#333" stroke-width="2"/><line x1="68" y1="25" x2="68" y2="18" stroke="#333" stroke-width="2"/><line x1="82" y1="25" x2="82" y2="32" stroke="#333" stroke-width="4"/><circle cx="55" cy="95" r="8" fill="#fef9c3" stroke="#333"/><circle cx="95" cy="95" r="8" fill="#fef9c3" stroke="#333"/><text x="225" y="14" font-size="10" text-anchor="middle" fill="#334155">parallel</text><rect x="175" y="25" width="110" height="70" fill="none" stroke="#333" stroke-width="2"/><line x1="218" y1="25" x2="218" y2="18" stroke="#333" stroke-width="2"/><line x1="232" y1="25" x2="232" y2="32" stroke="#333" stroke-width="4"/><line x1="205" y1="60" x2="255" y2="60" stroke="#333" stroke-width="2"/><line x1="205" y1="60" x2="205" y2="95" stroke="#333" stroke-width="2"/><line x1="255" y1="60" x2="255" y2="95" stroke="#333" stroke-width="2"/><circle cx="205" cy="95" r="8" fill="#fef9c3" stroke="#333"/><circle cx="255" cy="95" r="8" fill="#fef9c3" stroke="#333"/></svg>',
      diagramCaption: "Series: bulbs share one loop (dimmer, all-off if one breaks). Parallel: separate branches stay bright and independent.",
      keyPoints: [
        "Series = one loop, current the same everywhere, more bulbs = dimmer, one breaks = all off.",
        "Parallel = separate branches, each stays bright, one branch can break without the others stopping.",
        "House wiring is parallel so devices work independently.",
      ],
      thinkDeeper:
        "Old Christmas lights were wired in series, so if one bulb blew the whole string went dark and you had to test every bulb. Modern strings stay lit. What change to the wiring fixes this, and what is the trade-off?",
    },
    {
      id: "ammeters-voltmeters-static",
      heading: "Measuring current and voltage; static electricity",
      body:
        "Two meters let us measure what is happening in a circuit.\n\nAn **ammeter** measures **current** in **amps (A)**. Current is the same all the way round a series loop, so an ammeter is connected **in series** — *in* the loop, so the current flows through it.\n\nA **voltmeter** measures **voltage** (also called **potential difference**) in **volts (V)**. Voltage is the 'push' the cell gives, or the energy transferred by a component. A voltmeter is connected **in parallel** — *across* the component, on its own little branch beside it.\n\nA simple way to remember: the cell provides the voltage that pushes the current around the circuit.\n\nFinally, a quick look at **static electricity**. When you rub two insulators together (a balloon on your hair, a plastic rod with a cloth), tiny charged particles called **electrons** are transferred by **friction**. One object becomes **negatively charged** (gains electrons) and the other **positively charged** (loses them). Just like magnetic poles: **like charges repel, unlike charges attract** — which is why a rubbed balloon sticks to a wall and makes your hair stand on end.",
      diagram:
        '<svg viewBox="0 0 240 130" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Ammeter connected in series and voltmeter connected in parallel across a bulb"><rect x="30" y="30" width="170" height="70" fill="none" stroke="#333" stroke-width="2"/><line x1="100" y1="30" x2="100" y2="22" stroke="#333" stroke-width="2"/><line x1="114" y1="30" x2="114" y2="38" stroke="#333" stroke-width="4"/><circle cx="55" cy="30" r="10" fill="none" stroke="#333" stroke-width="2"/><text x="55" y="34" font-size="10" text-anchor="middle">A</text><circle cx="160" cy="100" r="10" fill="#fef9c3" stroke="#333"/><line x1="153" y1="93" x2="167" y2="107" stroke="#333"/><line x1="167" y1="93" x2="153" y2="107" stroke="#333"/><line x1="135" y1="100" x2="135" y2="120" stroke="#333"/><line x1="185" y1="100" x2="185" y2="120" stroke="#333"/><line x1="135" y1="120" x2="185" y2="120" stroke="#333"/><circle cx="160" cy="120" r="10" fill="none" stroke="#333" stroke-width="2"/><text x="160" y="124" font-size="10" text-anchor="middle">V</text></svg>',
      diagramCaption: "Ammeter (A) goes in series with the loop; voltmeter (V) goes in parallel across the component.",
      keyPoints: [
        "Ammeter measures current in amps, connected in series.",
        "Voltmeter measures voltage (potential difference) in volts, connected in parallel.",
        "Static: friction transfers electrons; like charges repel, unlike charges attract.",
      ],
      thinkDeeper:
        "An ammeter is designed to let current pass through it almost unchanged, while a voltmeter is designed so almost no current flows through it. Why must each meter be built that way for it to measure correctly without disturbing the circuit?",
    },
  ],

  mnemonics: [
    {
      topic: "Which poles attract or repel",
      device: "Likes Repel, Opposites Attract — 'LROA'",
      explanation:
        "Like poles (N–N, S–S) Repel; Opposite (unlike) poles Attract. The same rule works for electric charges too.",
    },
    {
      topic: "How a meter is connected",
      device: "Ammeter = Always in a line; Voltmeter = Verily across (parallel)",
      explanation:
        "An Ammeter goes in series ('in a line' with the current). A Voltmeter goes in parallel ('across' the component).",
    },
    {
      topic: "Making an electromagnet stronger",
      device: "TIC: Turns, Increase current, Core",
      explanation:
        "More Turns of wire, Increase the current, add an iron Core. Any of the three boosts the strength.",
    },
    {
      topic: "Magnetic materials",
      device: "I See No Cobwebs — Iron, Steel, Nickel, Cobalt",
      explanation:
        "The four common magnetic materials are Iron, Steel, Nickel and Cobalt; almost everything else is non-magnetic.",
    },
  ],

  examMistakes: [
    "Saying like poles attract — it is the opposite: like poles REPEL, unlike poles attract.",
    "Drawing field lines going from south to north, or letting them cross — outside the magnet they go N to S and never cross.",
    "Forgetting that the Earth's magnetic SOUTH pole is near the geographic North, so a compass north points north.",
    "Connecting the ammeter in parallel or the voltmeter in series — ammeters go in series, voltmeters in parallel.",
    "Stating that more bulbs in series makes them brighter — they get DIMMER because the voltage is shared.",
    "Claiming an electromagnet keeps working after the current is switched off — the magnetism disappears with the current.",
    "Confusing conductors and insulators (e.g. calling plastic a conductor); metals and carbon conduct, plastic/rubber/glass insulate.",
    "Writing the wrong unit: current is in amps (A), voltage in volts (V) — do not swap them.",
  ],

  misconceptions: [
    {
      wrong: "If you cut a magnet in half you get a separate north piece and a separate south piece.",
      right: "Every piece, however small, still has both a north and a south pole — you can never isolate one pole.",
    },
    {
      wrong: "All metals are magnetic.",
      right: "Only iron, steel, nickel and cobalt are magnetic. Copper, aluminium and gold are metals but are NOT magnetic.",
    },
    {
      wrong: "Current gets 'used up' as it goes round, so there is less coming back to the cell.",
      right: "In a series circuit the current is the same everywhere; it is energy (voltage) that is transferred to components, not the current itself.",
    },
    {
      wrong: "The compass needle's north end points to the Earth's magnetic north pole.",
      right: "It points toward the geographic North, where the Earth actually has a magnetic SOUTH pole (unlike poles attract).",
    },
    {
      wrong: "A bigger battery makes a permanent magnet stronger.",
      right: "A permanent magnet has no battery. Only an electromagnet's strength depends on current; you also need turns and an iron core.",
    },
    {
      wrong: "In a parallel circuit, if one bulb breaks all the others go out.",
      right: "Each branch is independent, so the other branches keep working when one breaks — that is the main advantage of parallel.",
    },
  ],

  expertDebates: [
    {
      question: "Does electric current actually flow from + to −, or from − to +?",
      detail:
        "By convention we draw 'conventional current' flowing from the positive terminal to the negative. But the electrons that really move in a metal flow the other way, from − to +. Both descriptions work for circuit calculations; scientists just had to pick a direction before electrons were discovered, and we kept it.",
    },
    {
      question: "Why does the Earth's magnetic field flip over time?",
      detail:
        "Rock records show the Earth's magnetic north and south have swapped many times over millions of years. The swirling molten iron in the core is not perfectly steady, and exactly why and when it reverses is still actively researched — a compass during a reversal would be very confusing.",
    },
    {
      question: "Is magnetism really separate from electricity?",
      detail:
        "At school we treat them as two topics, but they are two faces of one thing — electromagnetism. A moving charge makes a magnetic field, and a changing magnetic field pushes charges. This deep link, worked out in the 1800s, underlies every motor, generator and radio.",
    },
  ],

  realWorld: [
    { title: "Scrapyard crane", detail: "A giant electromagnet lifts whole cars, then drops them by switching the current off — impossible with a permanent magnet.", emoji: "🏗️" },
    { title: "Compass navigation", detail: "Hikers, sailors and aircraft use a magnetised needle lining up with Earth's field to find north when no GPS is available.", emoji: "🧭" },
    { title: "Electric motors", detail: "Electromagnets push and pull to spin the motor in fans, drills, electric cars and washing machines.", emoji: "⚙️" },
    { title: "Home wiring", detail: "Sockets and lights are wired in parallel so each appliance gets full voltage and can be switched on or off independently.", emoji: "💡" },
    { title: "Maglev trains", detail: "Powerful electromagnets lift the train off the track so it floats, removing friction and allowing very high speeds.", emoji: "🚄" },
    { title: "Loudspeakers and headphones", detail: "A coil carrying a changing current sits in a magnet's field; the changing force makes a cone vibrate and create sound.", emoji: "🔊" },
  ],

  flashcards: [
    { front: "What are the two poles of a magnet?", back: "North (N) and south (S)." },
    { front: "Like poles… / unlike poles…?", back: "Like poles repel; unlike poles attract." },
    { front: "Name four magnetic materials.", back: "Iron, steel, nickel and cobalt." },
    { front: "Which way do field lines point outside a magnet?", back: "From the north pole to the south pole." },
    { front: "Where is a magnet's field strongest?", back: "At the poles, where the field lines are closest together." },
    { front: "Why does a compass point north?", back: "It is a tiny magnet; its north end is attracted to the Earth's magnetic south pole (near geographic North)." },
    { front: "Permanent vs temporary magnet?", back: "Permanent (steel) keeps its magnetism; temporary (iron) loses it easily." },
    { front: "Three ways to make an electromagnet stronger?", back: "More turns, more current, add an iron core." },
    { front: "Main advantage of an electromagnet?", back: "It can be switched on and off (and its poles reversed)." },
    { front: "What is electric current?", back: "The flow of electric charge around a complete circuit." },
    { front: "Conductor vs insulator (give an example of each)?", back: "Conductor lets current flow (copper); insulator does not (plastic)." },
    { front: "How is an ammeter connected, and what unit?", back: "In series; it measures current in amps (A)." },
    { front: "How is a voltmeter connected, and what unit?", back: "In parallel (across a component); it measures voltage in volts (V)." },
    { front: "Series vs parallel if one bulb breaks?", back: "Series: all go out. Parallel: the others stay on." },
  ],

  mustKnow: [
    "State that like poles repel and unlike poles attract, and identify magnetic materials.",
    "Draw the magnetic field of a bar magnet with field lines from N to S and say where it is strongest.",
    "Explain why a compass points north and that the Earth behaves like a giant magnet.",
    "Describe the difference between permanent and temporary magnets and how to magnetise/demagnetise.",
    "Describe an electromagnet and list three ways to make it stronger plus its main advantage and uses.",
    "Explain what electric current is and what a circuit needs to make it flow.",
    "Recognise and draw the standard circuit symbols and a simple circuit diagram.",
    "Compare series and parallel circuits in terms of current, brightness and one component breaking.",
    "State how to connect an ammeter and a voltmeter and which quantity and unit each measures.",
    "Explain charging by friction and that like charges repel while unlike charges attract.",
  ],

  videos: [
    { title: "Magnets and magnetic fields", channel: "FuseSchool", url: "https://www.youtube.com/results?search_query=fuseschool+magnets+and+magnetic+fields" },
    { title: "Electromagnets explained", channel: "Cognito", url: "https://www.youtube.com/results?search_query=cognito+electromagnets+gcse+physics" },
    { title: "Series and parallel circuits", channel: "Free Science Lessons", url: "https://www.youtube.com/results?search_query=free+science+lessons+series+and+parallel+circuits" },
    { title: "Current, voltage, ammeters and voltmeters", channel: "Primrose Kitten", url: "https://www.youtube.com/results?search_query=primrose+kitten+current+voltage+ammeter+voltmeter" },
  ],

  quiz: {
    mcq: [
      {
        id: "magnetism-electricity-q-mcq-1",
        question: "Two magnets are pushed together north pole to north pole. What happens?",
        options: ["They attract", "They repel", "Nothing — N and N do not interact", "One pole turns into a south pole"],
        answerIndex: 1,
        hint: "Are these poles the same or different?",
        explanation: "N and N are like poles, and like poles repel. They only attract when an unlike pair (N–S) is brought together.",
        guideRef: "magnets-and-poles",
      },
      {
        id: "magnetism-electricity-q-mcq-2",
        question: "Which change would NOT make an electromagnet stronger?",
        options: ["Adding more turns of wire", "Increasing the current", "Adding an iron core", "Using a longer plastic core instead of iron"],
        answerIndex: 3,
        hint: "Think about what the core needs to be made of.",
        explanation: "A core must be a magnetic material like iron to boost the field; plastic is non-magnetic and does nothing. The other three all increase strength.",
        guideRef: "electromagnets",
      },
      {
        id: "magnetism-electricity-q-mcq-3",
        question: "How should a voltmeter be connected to measure the voltage across a bulb?",
        options: ["In series, in the main loop", "In parallel, across the bulb", "Between the two cells only", "It does not matter how it is connected"],
        answerIndex: 1,
        hint: "Remember 'Voltmeter = across'.",
        explanation: "A voltmeter is connected in parallel (across) the component. An ammeter is the one connected in series in the main loop.",
        guideRef: "ammeters-voltmeters-static",
      },
      {
        id: "magnetism-electricity-q-mcq-4",
        question: "In a series circuit with two identical bulbs, one bulb is removed. What happens to the other bulb?",
        options: ["It stays the same brightness", "It gets brighter", "It goes out", "It flashes on and off"],
        answerIndex: 2,
        hint: "A series circuit is a single loop.",
        explanation: "Removing a bulb breaks the single loop, so the current stops everywhere and the other bulb goes out. In parallel it would have stayed lit.",
        guideRef: "series-and-parallel",
      },
    ],
    qa: [
      {
        id: "magnetism-electricity-q-qa-1",
        question: "Explain why a freely-hanging bar magnet always settles pointing north–south.",
        marks: 2,
        hint: "Think about what big magnet is nearby.",
        modelAnswer:
          "The Earth behaves like a giant bar magnet with its own magnetic field. The hanging magnet lines up with this field, so it always settles pointing along the north–south direction.",
        markScheme: [
          { point: "Earth acts like a giant magnet / has a magnetic field", keywords: ["earth", "giant magnet", "magnetic field", "earth's field"] },
          { point: "The magnet lines up with that field", keywords: ["lines up", "aligns", "points along", "north-south", "north south"] },
        ],
        commonError: "Saying the magnet points to the Pole Star or to gravity, rather than aligning with the Earth's magnetic field.",
        guideRef: "earth-as-magnet",
      },
      {
        id: "magnetism-electricity-q-qa-2",
        question: "Give two ways to make an electromagnet stronger and state one advantage electromagnets have over permanent magnets.",
        marks: 3,
        hint: "Think turns, current, core — and switching.",
        modelAnswer:
          "You can make an electromagnet stronger by adding more turns of wire and by increasing the current (adding an iron core also works). An advantage over a permanent magnet is that it can be switched on and off.",
        markScheme: [
          { point: "More turns of wire", keywords: ["more turns", "turns", "more coils", "coils"] },
          { point: "More current (or add iron core)", keywords: ["more current", "increase current", "bigger battery", "iron core", "core"] },
          { point: "Can be switched on/off (or reversed)", keywords: ["switched on", "switch off", "on and off", "turned off", "reversed"] },
        ],
        commonError: "Giving 'use a stronger magnet' or repeating the same point twice instead of two distinct methods.",
        guideRef: "electromagnets",
      },
      {
        id: "magnetism-electricity-q-qa-3",
        question: "Compare a series circuit and a parallel circuit in terms of what happens to the other bulbs if one bulb breaks.",
        marks: 2,
        hint: "How many loops does each type have?",
        modelAnswer:
          "In a series circuit all the components are on one loop, so if one bulb breaks the loop is broken and all the other bulbs go out. In a parallel circuit each bulb is on its own branch, so if one breaks the others keep working.",
        markScheme: [
          { point: "Series: all bulbs go out when one breaks", keywords: ["series", "all go out", "all off", "whole circuit", "break the loop"] },
          { point: "Parallel: others keep working", keywords: ["parallel", "stay on", "keep working", "others still", "independent"] },
        ],
        commonError: "Getting series and parallel the wrong way round, or only describing one of the two circuit types.",
        guideRef: "series-and-parallel",
      },
      {
        id: "magnetism-electricity-q-qa-4",
        question: "A student rubs a plastic rod with a cloth and it becomes negatively charged. Explain how, and predict what happens if it is brought near another negatively charged rod.",
        marks: 3,
        hint: "Think about electrons moving, and the rule for like charges.",
        modelAnswer:
          "Rubbing transfers tiny charged particles called electrons by friction. The rod gains electrons, so it becomes negatively charged (the cloth loses them and becomes positive). Brought near another negatively charged rod, the two like charges repel, so the rods push apart.",
        markScheme: [
          { point: "Electrons transferred by friction", keywords: ["electrons", "friction", "rubbing", "transferred"] },
          { point: "Rod gains electrons so is negative", keywords: ["gains electrons", "gained electrons", "negative", "extra electrons"] },
          { point: "Like charges repel / they push apart", keywords: ["repel", "push apart", "like charges", "same charge"] },
        ],
        commonError: "Saying protons or charge move, rather than electrons; or predicting attraction between two like charges.",
        guideRef: "ammeters-voltmeters-static",
      },
    ],
  },

  questionBank: {
    mcqPapers: [
      {
        id: "magnetism-electricity-mcq-p1",
        title: "MCQ Paper 1",
        questions: [
          { id: "magnetism-electricity-mcq-p1-q1", question: "What are the two poles of every magnet called?", options: ["Positive and negative", "North and south", "Up and down", "Plus and minus"], answerIndex: 1, hint: "Think of a compass.", explanation: "Magnets have north and south poles. Positive and negative are used for electric charge, not magnetic poles.", guideRef: "magnets-and-poles" },
          { id: "magnetism-electricity-mcq-p1-q2", question: "Which pair of poles will attract each other?", options: ["North and north", "South and south", "North and south", "None attract"], answerIndex: 2, hint: "Unlike poles…", explanation: "Unlike poles (north and south) attract. Like poles such as N–N or S–S repel.", guideRef: "magnets-and-poles" },
          { id: "magnetism-electricity-mcq-p1-q3", question: "Which material is NOT magnetic?", options: ["Iron", "Cobalt", "Copper", "Nickel"], answerIndex: 2, hint: "Three of these are on the magnetic list.", explanation: "Copper is a metal but is non-magnetic. Iron, cobalt and nickel are all magnetic.", guideRef: "magnets-and-poles" },
          { id: "magnetism-electricity-mcq-p1-q4", question: "Outside a magnet, magnetic field lines point…", options: ["From south to north", "From north to south", "In random directions", "Always straight up"], answerIndex: 1, hint: "N then S.", explanation: "By convention field lines run from north to south outside the magnet. They never cross.", guideRef: "magnetic-fields" },
          { id: "magnetism-electricity-mcq-p1-q5", question: "A magnetic field is strongest where the field lines are…", options: ["Furthest apart", "Closest together", "Perfectly straight", "Crossing over"], answerIndex: 1, hint: "Crowded lines mean a strong field.", explanation: "The closer the field lines, the stronger the field — which is why it is strongest at the poles. Lines never cross.", guideRef: "magnetic-fields" },
          { id: "magnetism-electricity-mcq-p1-q6", question: "What can you sprinkle to reveal the shape of a magnetic field?", options: ["Salt", "Iron filings", "Sand", "Sugar"], answerIndex: 1, hint: "It must be a magnetic material.", explanation: "Iron filings line up along the field lines. Salt, sand and sugar are non-magnetic and would not respond.", guideRef: "magnetic-fields" },
          { id: "magnetism-electricity-mcq-p1-q7", question: "A compass needle is really a…", options: ["Small battery", "Small bar magnet", "Piece of copper", "Light sensor"], answerIndex: 1, hint: "It lines up with a field.", explanation: "A compass is a tiny bar magnet free to turn, so it lines up with the Earth's magnetic field.", guideRef: "earth-as-magnet" },
          { id: "magnetism-electricity-mcq-p1-q8", question: "The Earth's magnetic field is caused mainly by…", options: ["The Sun's rays", "Swirling molten iron in its core", "Ocean currents", "The Moon's gravity"], answerIndex: 1, hint: "Look deep inside the planet.", explanation: "Moving molten iron in the outer core generates Earth's magnetic field. The Sun and Moon do not create it.", guideRef: "earth-as-magnet" },
          { id: "magnetism-electricity-mcq-p1-q9", question: "Which is the best example of a permanent magnet?", options: ["A pure iron nail", "A steel fridge magnet", "A copper wire", "A plastic ruler"], answerIndex: 1, hint: "Which keeps its magnetism?", explanation: "Steel keeps its magnetism, making good permanent magnets. Pure iron is a temporary magnet; copper and plastic are not magnetic.", guideRef: "permanent-vs-temporary" },
          { id: "magnetism-electricity-mcq-p1-q10", question: "Which action would demagnetise a magnet?", options: ["Keeping it cool and still", "Hammering it repeatedly", "Storing it carefully", "Stroking it the same way with a magnet"], answerIndex: 1, hint: "What jumbles the domains?", explanation: "Hammering jumbles the domains and removes magnetism. Stroking it one way with a magnet does the opposite — it magnetises.", guideRef: "permanent-vs-temporary" },
          { id: "magnetism-electricity-mcq-p1-q11", question: "A coil of wire carrying a current is called a…", options: ["Resistor", "Solenoid", "Voltmeter", "Conductor"], answerIndex: 1, hint: "It makes a magnetic field like a bar magnet.", explanation: "A tightly wound coil is a solenoid; with current it makes a magnetic field. A resistor and voltmeter are different components.", guideRef: "electromagnets" },
          { id: "magnetism-electricity-mcq-p1-q12", question: "Which makes an electromagnet stronger?", options: ["Fewer turns of wire", "Less current", "Adding an iron core", "Using a plastic core"], answerIndex: 2, hint: "The core matters.", explanation: "An iron core greatly increases the field. Fewer turns or less current would weaken it, and plastic does nothing.", guideRef: "electromagnets" },
          { id: "magnetism-electricity-mcq-p1-q13", question: "The biggest advantage of an electromagnet over a permanent magnet is that it…", options: ["Never needs power", "Can be switched on and off", "Is always stronger", "Cannot be reversed"], answerIndex: 1, hint: "Think about a scrapyard crane dropping a car.", explanation: "Switching the current off removes the magnetism, so it can be turned on and off. It does need power and its poles can be reversed.", guideRef: "electromagnets" },
          { id: "magnetism-electricity-mcq-p1-q14", question: "Electric current is best described as the flow of…", options: ["Heat", "Charge", "Light", "Sound"], answerIndex: 1, hint: "Something electrical moves round the loop.", explanation: "Current is the flow of electric charge around a circuit. Heat or light may be produced, but they are not the current.", guideRef: "current-and-circuits" },
          { id: "magnetism-electricity-mcq-p1-q15", question: "For a current to flow, a circuit must be…", options: ["Made of plastic", "A complete, unbroken loop", "Very long", "Open at one end"], answerIndex: 1, hint: "Any gap stops the flow.", explanation: "Current needs a complete loop and an energy source. A gap anywhere stops the current everywhere.", guideRef: "current-and-circuits" },
          { id: "magnetism-electricity-mcq-p1-q16", question: "Which is a good electrical conductor?", options: ["Rubber", "Glass", "Copper", "Wood"], answerIndex: 2, hint: "Metals are good at this.", explanation: "Copper is a metal and a good conductor. Rubber, glass and wood are insulators.", guideRef: "current-and-circuits" },
          { id: "magnetism-electricity-mcq-p1-q17", question: "Which is an electrical insulator?", options: ["Aluminium", "Plastic", "Gold", "Iron"], answerIndex: 1, hint: "What coats the outside of a wire?", explanation: "Plastic is an insulator and coats wires. Aluminium, gold and iron are metals and conduct.", guideRef: "current-and-circuits" },
          { id: "magnetism-electricity-mcq-p1-q18", question: "What does the circuit symbol of a circle with a cross inside represent?", options: ["A cell", "A lamp/bulb", "A switch", "An ammeter"], answerIndex: 1, hint: "It gives out light.", explanation: "A circle with a cross is a lamp (bulb). A cell is two lines and an ammeter is a circle with an A.", guideRef: "circuit-symbols-diagrams" },
          { id: "magnetism-electricity-mcq-p1-q19", question: "Which symbol is an ammeter?", options: ["A circle with V", "A circle with A", "A rectangle", "A circle with M"], answerIndex: 1, hint: "A for amps.", explanation: "An ammeter is a circle with A. V is a voltmeter, the rectangle is a resistor and M is a motor.", guideRef: "circuit-symbols-diagrams" },
          { id: "magnetism-electricity-mcq-p1-q20", question: "In a series circuit, the current is…", options: ["Largest near the cell", "The same everywhere", "Zero", "Different in each part"], answerIndex: 1, hint: "One loop, one value.", explanation: "In a single series loop the current is the same at every point. It is not used up as it goes round.", guideRef: "series-and-parallel" },
          { id: "magnetism-electricity-mcq-p1-q21", question: "Adding more bulbs in series makes them…", options: ["Brighter", "Dimmer", "Flash", "Change colour"], answerIndex: 1, hint: "The voltage is shared.", explanation: "More bulbs in series share the cell's voltage, so each is dimmer. In parallel they would stay bright.", guideRef: "series-and-parallel" },
          { id: "magnetism-electricity-mcq-p1-q22", question: "House lighting is wired in parallel mainly so that…", options: ["Wires are cheaper", "Each light can be switched independently", "Less current is needed", "The lights are dimmer"], answerIndex: 1, hint: "What happens if one branch breaks?", explanation: "Parallel branches are independent, so each light works on its own. One failing does not switch off the rest.", guideRef: "series-and-parallel" },
          { id: "magnetism-electricity-mcq-p1-q23", question: "An ammeter should be connected…", options: ["In series, in the loop", "In parallel, across a bulb", "Only across the cell", "Outside the circuit"], answerIndex: 0, hint: "The current must flow through it.", explanation: "An ammeter goes in series so the current flows through it. A voltmeter is the one connected in parallel.", guideRef: "ammeters-voltmeters-static" },
          { id: "magnetism-electricity-mcq-p1-q24", question: "Voltage (potential difference) is measured in…", options: ["Amps", "Volts", "Watts", "Ohms"], answerIndex: 1, hint: "The clue is in the name.", explanation: "Voltage is measured in volts (V). Current is measured in amps (A).", guideRef: "ammeters-voltmeters-static" },
          { id: "magnetism-electricity-mcq-p1-q25", question: "When you rub a balloon on your hair, what is transferred?", options: ["Protons", "Electrons", "Neutrons", "Atoms of air"], answerIndex: 1, hint: "Tiny negative particles.", explanation: "Friction transfers electrons, charging the objects. Protons and neutrons stay in the nuclei and do not move.", guideRef: "ammeters-voltmeters-static" },
        ],
      },
      {
        id: "magnetism-electricity-mcq-p2",
        title: "MCQ Paper 2",
        questions: [
          { id: "magnetism-electricity-mcq-p2-q1", question: "If you cut a bar magnet in half, each half has…", options: ["Only a north pole", "Only a south pole", "Both a north and a south pole", "No poles at all"], answerIndex: 2, hint: "You can never get a single pole.", explanation: "Every piece keeps both a north and a south pole, however small you cut it. A single pole cannot be isolated.", guideRef: "magnets-and-poles" },
          { id: "magnetism-electricity-mcq-p2-q2", question: "Two south poles are brought close together. They will…", options: ["Attract", "Repel", "Do nothing", "Swap poles"], answerIndex: 1, hint: "Same poles…", explanation: "S and S are like poles, so they repel. Only unlike poles attract.", guideRef: "magnets-and-poles" },
          { id: "magnetism-electricity-mcq-p2-q3", question: "Which list contains ONLY magnetic materials?", options: ["Iron, steel, nickel", "Iron, copper, wood", "Steel, plastic, cobalt", "Nickel, glass, iron"], answerIndex: 0, hint: "Remember the four magnetic materials.", explanation: "Iron, steel and nickel are all magnetic. The other lists include copper, wood, plastic or glass, which are non-magnetic.", guideRef: "magnets-and-poles" },
          { id: "magnetism-electricity-mcq-p2-q4", question: "Why do magnetic field lines never cross?", options: ["They are too thin", "The field has one direction at each point", "They are painted on", "They always curve left"], answerIndex: 1, hint: "A compass points one way at any point.", explanation: "At any point the field has a single direction, so lines cannot cross. Crossing would mean two directions at once.", guideRef: "magnetic-fields" },
          { id: "magnetism-electricity-mcq-p2-q5", question: "A plotting compass gives information that iron filings do NOT, namely the field's…", options: ["Colour", "Direction", "Temperature", "Mass"], answerIndex: 1, hint: "The needle has a north end.", explanation: "The compass needle shows direction (N to S), while filings only show the shape of the field.", guideRef: "magnetic-fields" },
          { id: "magnetism-electricity-mcq-p2-q6", question: "Around which part of a bar magnet are the field lines most crowded?", options: ["The middle", "The poles", "Just above it", "Nowhere — they are evenly spaced"], answerIndex: 1, hint: "Where is the field strongest?", explanation: "Lines are most crowded at the poles, where the field is strongest. The field is weakest near the middle of the side.", guideRef: "magnetic-fields" },
          { id: "magnetism-electricity-mcq-p2-q7", question: "A compass needle's NORTH end points toward the Earth's geographic North because there lies the Earth's magnetic…", options: ["North pole", "South pole", "Equator", "Centre"], answerIndex: 1, hint: "Unlike poles attract.", explanation: "Unlike poles attract, so the compass north is pulled toward the Earth's magnetic SOUTH pole near geographic North.", guideRef: "earth-as-magnet" },
          { id: "magnetism-electricity-mcq-p2-q8", question: "Before GPS, sailors crossing the ocean mainly used a compass to find…", options: ["Their speed", "Direction", "Water depth", "The time"], answerIndex: 1, hint: "What does a needle show?", explanation: "A compass shows direction by aligning with Earth's field. It does not measure speed, depth or time.", guideRef: "earth-as-magnet" },
          { id: "magnetism-electricity-mcq-p2-q9", question: "A 'soft' (temporary) magnet is best made from…", options: ["Steel", "Pure iron", "Copper", "Plastic"], answerIndex: 1, hint: "Which loses its magnetism easily?", explanation: "Pure iron magnetises and demagnetises easily, so it is a temporary magnet. Steel keeps its magnetism (permanent).", guideRef: "permanent-vs-temporary" },
          { id: "magnetism-electricity-mcq-p2-q10", question: "Magnetising a steel bar works by lining up its…", options: ["Atoms of copper", "Magnetic domains", "Electrons in the cell", "Field lines outside"], answerIndex: 1, hint: "Tiny regions inside the metal.", explanation: "Magnetising lines up the magnetic domains so they point the same way. Jumbling them again demagnetises it.", guideRef: "permanent-vs-temporary" },
          { id: "magnetism-electricity-mcq-p2-q11", question: "Reversing the current in an electromagnet will…", options: ["Switch it off", "Swap its north and south poles", "Make it permanent", "Have no effect"], answerIndex: 1, hint: "Direction matters.", explanation: "Reversing the current swaps the poles. To switch it off you would stop the current, not reverse it.", guideRef: "electromagnets" },
          { id: "magnetism-electricity-mcq-p2-q12", question: "An electric bell, a relay and a scrapyard crane all rely on…", options: ["Permanent magnets only", "Electromagnets", "Static electricity", "Insulators"], answerIndex: 1, hint: "Something you can switch.", explanation: "All three use electromagnets that switch on and off. Permanent magnets could not be switched, which they all need.", guideRef: "electromagnets" },
          { id: "magnetism-electricity-mcq-p2-q13", question: "Doubling the number of turns on a solenoid (current unchanged) makes the field…", options: ["Weaker", "Stronger", "Disappear", "Reverse direction"], answerIndex: 1, hint: "More turns add their fields.", explanation: "More turns add more loops of field, making the electromagnet stronger. It does not reverse or disappear.", guideRef: "electromagnets" },
          { id: "magnetism-electricity-mcq-p2-q14", question: "What is the job of the cell in a circuit?", options: ["To resist the current", "To push the charge around the loop", "To measure the current", "To insulate the wires"], answerIndex: 1, hint: "It acts like a pump.", explanation: "The cell provides the voltage that pushes charge around the loop. Measuring is the meter's job; resisting is the resistor's.", guideRef: "current-and-circuits" },
          { id: "magnetism-electricity-mcq-p2-q15", question: "A battery is best described as…", options: ["A single cell", "Two or more cells joined together", "A type of bulb", "A switch"], answerIndex: 1, hint: "More than one cell.", explanation: "A battery is two or more cells joined together. A single unit is just a cell.", guideRef: "current-and-circuits" },
          { id: "magnetism-electricity-mcq-p2-q16", question: "Wires are made of copper covered in plastic because copper is a ___ and plastic is an ___.", options: ["insulator / conductor", "conductor / insulator", "magnet / metal", "metal / magnet"], answerIndex: 1, hint: "Which lets current flow?", explanation: "Copper conducts the current; the plastic insulates it to keep current in and you safe.", guideRef: "current-and-circuits" },
          { id: "magnetism-electricity-mcq-p2-q17", question: "Graphite (a form of carbon) is unusual because, unlike most non-metals, it…", options: ["Is magnetic", "Conducts electricity", "Is an insulator", "Glows in the dark"], answerIndex: 1, hint: "It is used in pencil leads and electrodes.", explanation: "Carbon (graphite) conducts electricity even though it is a non-metal. It is not magnetic.", guideRef: "current-and-circuits" },
          { id: "magnetism-electricity-mcq-p2-q18", question: "Which symbol is two parallel lines, one long and thin, one short and thick?", options: ["A lamp", "A cell", "A resistor", "A motor"], answerIndex: 1, hint: "It is the energy source.", explanation: "The long thin and short thick line pair is a cell. A lamp is a circle with a cross and a resistor is a rectangle.", guideRef: "circuit-symbols-diagrams" },
          { id: "magnetism-electricity-mcq-p2-q19", question: "A rectangle in a circuit diagram represents a…", options: ["Cell", "Resistor", "Switch", "Voltmeter"], answerIndex: 1, hint: "It limits the current.", explanation: "A rectangle is a resistor, which limits current. A voltmeter is a circle with V.", guideRef: "circuit-symbols-diagrams" },
          { id: "magnetism-electricity-mcq-p2-q20", question: "When drawing a circuit diagram you should use…", options: ["Curved, wavy wires", "Straight lines with neat corners", "Random shapes for each part", "Realistic photographs"], answerIndex: 1, hint: "Neat and standard.", explanation: "Good diagrams use straight lines and standard symbols so anyone can read them, not realistic pictures.", guideRef: "circuit-symbols-diagrams" },
          { id: "magnetism-electricity-mcq-p2-q21", question: "In a parallel circuit, each branch receives…", options: ["A share of the voltage", "The full voltage of the cell", "No voltage", "Half the current always"], answerIndex: 1, hint: "Why do parallel bulbs stay bright?", explanation: "Each branch gets the full cell voltage, so bulbs stay bright. In series the voltage is shared.", guideRef: "series-and-parallel" },
          { id: "magnetism-electricity-mcq-p2-q22", question: "If one branch of a parallel circuit breaks, the other branches…", options: ["All go out", "Keep working", "Get brighter forever", "Reverse direction"], answerIndex: 1, hint: "Branches are independent.", explanation: "Other branches keep working because each is a separate loop. In series everything would go out.", guideRef: "series-and-parallel" },
          { id: "magnetism-electricity-mcq-p2-q23", question: "Why must a voltmeter NOT be put in series in the main loop?", options: ["It would explode", "Almost no current flows through it, so it would stop the circuit", "It is too heavy", "It measures temperature"], answerIndex: 1, hint: "Think about how a voltmeter is built.", explanation: "A voltmeter lets almost no current through, so in series it would block the circuit. It belongs in parallel across a component.", guideRef: "ammeters-voltmeters-static" },
          { id: "magnetism-electricity-mcq-p2-q24", question: "Current is measured in amps using a…", options: ["Voltmeter", "Ammeter", "Thermometer", "Balance"], answerIndex: 1, hint: "A for amps.", explanation: "An ammeter measures current in amps. A voltmeter measures voltage in volts.", guideRef: "ammeters-voltmeters-static" },
          { id: "magnetism-electricity-mcq-p2-q25", question: "Two objects carry the SAME type of charge. They will…", options: ["Attract", "Repel", "Do nothing", "Become neutral instantly"], answerIndex: 1, hint: "Like the rule for magnetic poles.", explanation: "Like charges repel, just as like poles do. Unlike charges would attract.", guideRef: "ammeters-voltmeters-static" },
        ],
      },
      {
        id: "magnetism-electricity-mcq-p3",
        title: "MCQ Paper 3",
        questions: [
          { id: "magnetism-electricity-mcq-p3-q1", question: "A magnet picks up a paperclip. The paperclip is most likely made of…", options: ["Plastic", "Steel", "Copper", "Aluminium"], answerIndex: 1, hint: "Which of these is magnetic?", explanation: "Steel (mostly iron) is magnetic and is attracted. Plastic, copper and aluminium are not magnetic.", guideRef: "magnets-and-poles" },
          { id: "magnetism-electricity-mcq-p3-q2", question: "Which statement is TRUE?", options: ["Like poles attract", "Unlike poles repel", "Like poles repel", "All poles attract"], answerIndex: 2, hint: "Recall the golden rule.", explanation: "Like poles repel and unlike poles attract — only the third option states this correctly.", guideRef: "magnets-and-poles" },
          { id: "magnetism-electricity-mcq-p3-q3", question: "An aluminium can is NOT picked up by a magnet because aluminium is…", options: ["Too heavy", "Non-magnetic", "An insulator of heat", "Too smooth"], answerIndex: 1, hint: "It is a metal, but is it on the magnetic list?", explanation: "Aluminium is a non-magnetic metal, so it feels no force. Weight and smoothness are not the reason.", guideRef: "magnets-and-poles" },
          { id: "magnetism-electricity-mcq-p3-q4", question: "On a field-line diagram, the arrows on the lines show…", options: ["How heavy the magnet is", "The direction from north to south", "The temperature", "Where to cut the magnet"], answerIndex: 1, hint: "N to S outside.", explanation: "Arrows show the field direction, pointing from north to south outside the magnet.", guideRef: "magnetic-fields" },
          { id: "magnetism-electricity-mcq-p3-q5", question: "Where two unlike poles face each other, the field lines between them…", options: ["Disappear", "Run from the north pole across to the south pole", "Form closed circles", "Point straight up"], answerIndex: 1, hint: "Lines link N of one to S of the other.", explanation: "Between facing N and S poles the lines run across the gap from north to south, showing attraction.", guideRef: "magnetic-fields" },
          { id: "magnetism-electricity-mcq-p3-q6", question: "Which method does NOT reveal a magnetic field?", options: ["Iron filings", "A plotting compass", "Shining a torch on it", "Moving a compass around the magnet"], answerIndex: 2, hint: "Light is not magnetic.", explanation: "A torch does nothing — light is not affected by the field. Filings and a compass both reveal it.", guideRef: "magnetic-fields" },
          { id: "magnetism-electricity-mcq-p3-q7", question: "The Earth behaves most like a giant…", options: ["Battery", "Bar magnet", "Light bulb", "Resistor"], answerIndex: 1, hint: "Think of its two magnetic poles.", explanation: "Earth behaves like a giant bar magnet with a field, which is why compasses work.", guideRef: "earth-as-magnet" },
          { id: "magnetism-electricity-mcq-p3-q8", question: "If you placed a strong magnet next to a compass, the needle would…", options: ["Still point to geographic north", "Point toward the strong magnet instead", "Stop moving forever", "Melt"], answerIndex: 1, hint: "The compass follows the strongest nearby field.", explanation: "A nearby strong magnet dominates, so the needle points to it rather than to Earth's much weaker field.", guideRef: "earth-as-magnet" },
          { id: "magnetism-electricity-mcq-p3-q9", question: "Which is the best way to MAGNETISE a steel bar?", options: ["Drop it on the floor", "Heat it in a flame", "Stroke it the same way repeatedly with one pole of a magnet", "Wrap it in plastic"], answerIndex: 2, hint: "Line up the domains.", explanation: "Stroking it one way with a magnet lines up the domains and magnetises it. Heating or dropping would demagnetise.", guideRef: "permanent-vs-temporary" },
          { id: "magnetism-electricity-mcq-p3-q10", question: "A fridge magnet keeps working for years because it is a…", options: ["Temporary magnet", "Permanent magnet", "Electromagnet", "Non-magnet"], answerIndex: 1, hint: "It needs no power and stays magnetic.", explanation: "It is a permanent magnet that keeps its magnetism. An electromagnet would need current.", guideRef: "permanent-vs-temporary" },
          { id: "magnetism-electricity-mcq-p3-q11", question: "Adding an iron core to a solenoid helps because iron…", options: ["Is an insulator", "Strengthens the magnetic field and is temporary", "Stores the current", "Is non-magnetic"], answerIndex: 1, hint: "Why iron and not steel?", explanation: "Iron boosts the field and loses its magnetism when switched off (temporary), which is ideal for an electromagnet.", guideRef: "electromagnets" },
          { id: "magnetism-electricity-mcq-p3-q12", question: "A scrapyard crane drops a car by…", options: ["Reversing the poles", "Switching off the electromagnet's current", "Adding more turns", "Cooling the magnet"], answerIndex: 1, hint: "How do you make the magnetism vanish?", explanation: "Switching off the current removes the magnetism and releases the car. That is why a permanent magnet would not work.", guideRef: "electromagnets" },
          { id: "magnetism-electricity-mcq-p3-q13", question: "Which device uses an electromagnet to turn electrical energy into movement?", options: ["A voltmeter", "An electric motor", "A plastic ruler", "A glass rod"], answerIndex: 1, hint: "Think spinning.", explanation: "An electric motor uses electromagnets to produce movement. A voltmeter only measures voltage.", guideRef: "electromagnets" },
          { id: "magnetism-electricity-mcq-p3-q14", question: "If a switch in a series circuit is opened, the current…", options: ["Increases", "Stops everywhere", "Stays the same", "Only stops near the switch"], answerIndex: 1, hint: "A gap breaks the loop.", explanation: "Opening the switch breaks the loop, so current stops everywhere at once, not just at the switch.", guideRef: "current-and-circuits" },
          { id: "magnetism-electricity-mcq-p3-q15", question: "Which of these is needed to make a current flow?", options: ["A magnet only", "A complete loop and an energy source", "An insulator core", "Two voltmeters"], answerIndex: 1, hint: "Loop plus push.", explanation: "Current needs a complete loop and an energy source (cell/battery). A magnet alone will not drive current here.", guideRef: "current-and-circuits" },
          { id: "magnetism-electricity-mcq-p3-q16", question: "Which set are ALL insulators?", options: ["Plastic, rubber, glass", "Copper, plastic, wood", "Iron, glass, rubber", "Gold, rubber, plastic"], answerIndex: 0, hint: "No metals allowed.", explanation: "Plastic, rubber and glass are all insulators. The others contain metals (copper, iron, gold) that conduct.", guideRef: "current-and-circuits" },
          { id: "magnetism-electricity-mcq-p3-q17", question: "A circle with the letter M inside is the symbol for a…", options: ["Meter", "Motor", "Magnet", "Multimeter"], answerIndex: 1, hint: "M for movement.", explanation: "A circle with M is a motor. There is no standard 'magnet' symbol of this kind in a circuit.", guideRef: "circuit-symbols-diagrams" },
          { id: "magnetism-electricity-mcq-p3-q18", question: "Why do scientists worldwide use the same circuit symbols?", options: ["They look nicer", "So any diagram can be read and copied without confusion", "To save ink", "They are required by law in art"], answerIndex: 1, hint: "It is about communication.", explanation: "Standard symbols let anyone read and build the circuit, preventing misunderstandings. Appearance is not the point.", guideRef: "circuit-symbols-diagrams" },
          { id: "magnetism-electricity-mcq-p3-q19", question: "A lamp symbol is a circle containing…", options: ["A cross (X)", "The letter A", "A rectangle", "Two dots"], answerIndex: 0, hint: "Picture a bulb symbol.", explanation: "A lamp is a circle with a cross. The letter A is an ammeter; a rectangle is a resistor.", guideRef: "circuit-symbols-diagrams" },
          { id: "magnetism-electricity-mcq-p3-q20", question: "Two bulbs are in series. Compared with one bulb alone, each is…", options: ["Brighter", "Dimmer", "The same", "Off"], answerIndex: 1, hint: "Shared voltage.", explanation: "With two in series the voltage is shared, so each is dimmer than a single bulb on the same cell.", guideRef: "series-and-parallel" },
          { id: "magnetism-electricity-mcq-p3-q21", question: "Which circuit lets you switch one bulb off while the other stays lit?", options: ["A series circuit", "A parallel circuit", "Any single loop", "Neither can do this"], answerIndex: 1, hint: "Independent branches.", explanation: "Parallel branches are independent, so one bulb can be off while the other stays lit. Series cannot do this.", guideRef: "series-and-parallel" },
          { id: "magnetism-electricity-mcq-p3-q22", question: "In a series circuit the ammeter at the start of the loop reads 0.3 A. An ammeter later in the same loop reads…", options: ["0 A", "0.15 A", "0.3 A", "0.6 A"], answerIndex: 2, hint: "Series current is the same everywhere.", explanation: "Current is the same everywhere in a series loop, so it also reads 0.3 A. Current is not used up.", guideRef: "series-and-parallel" },
          { id: "magnetism-electricity-mcq-p3-q23", question: "A voltmeter measures the…", options: ["Current through a wire", "Potential difference (voltage) across a component", "Temperature of a bulb", "Length of a wire"], answerIndex: 1, hint: "Voltage = potential difference.", explanation: "A voltmeter measures voltage (potential difference) across a component, in volts. Current is the ammeter's job.", guideRef: "ammeters-voltmeters-static" },
          { id: "magnetism-electricity-mcq-p3-q24", question: "To measure the voltage across a single bulb, connect the voltmeter…", options: ["In series before the bulb", "In parallel across the bulb", "Across the whole circuit only", "In series after the cell"], answerIndex: 1, hint: "'Across' = parallel.", explanation: "The voltmeter goes in parallel directly across that bulb. In series it would block the circuit.", guideRef: "ammeters-voltmeters-static" },
          { id: "magnetism-electricity-mcq-p3-q25", question: "A rubbed balloon sticks to a wall because…", options: ["It is sticky", "Its charge attracts the neutral wall", "It is magnetic", "The wall is wet"], answerIndex: 1, hint: "Charged object near a surface.", explanation: "The charged balloon attracts the wall by electrostatic attraction. It is not magnetism or glue.", guideRef: "ammeters-voltmeters-static" },
        ],
      },
      {
        id: "magnetism-electricity-mcq-p4",
        title: "MCQ Paper 4",
        questions: [
          { id: "magnetism-electricity-mcq-p4-q1", question: "A bar magnet is suspended and free to turn. Its north pole will come to rest pointing…", options: ["Up", "Down", "Roughly north", "Roughly east"], answerIndex: 2, hint: "It behaves like a compass.", explanation: "It lines up with Earth's field, so its north pole points roughly north. It is not pulled up, down or east.", guideRef: "earth-as-magnet" },
          { id: "magnetism-electricity-mcq-p4-q2", question: "Which statement about cutting magnets is correct?", options: ["You can make a single north pole", "Each piece keeps two poles", "Cutting destroys magnetism", "Only the middle piece is magnetic"], answerIndex: 1, hint: "No single poles exist.", explanation: "Every piece keeps a north and a south pole. A single isolated pole cannot be made by cutting.", guideRef: "magnets-and-poles" },
          { id: "magnetism-electricity-mcq-p4-q3", question: "Nickel and cobalt are included on the list of magnetic materials along with…", options: ["Copper and gold", "Iron and steel", "Plastic and glass", "Water and wood"], answerIndex: 1, hint: "The four magnetic materials.", explanation: "The magnetic materials are iron, steel, nickel and cobalt. The other options are non-magnetic.", guideRef: "magnets-and-poles" },
          { id: "magnetism-electricity-mcq-p4-q4", question: "Which best describes a magnetic field?", options: ["The region where a magnet exerts a force", "The colour of the magnet", "The weight of the magnet", "The wires inside the magnet"], answerIndex: 0, hint: "It is a region of space.", explanation: "A magnetic field is the region where a magnet's force acts on other magnets or magnetic materials.", guideRef: "magnetic-fields" },
          { id: "magnetism-electricity-mcq-p4-q5", question: "Iron filings sprinkled over a magnet line up because each tiny piece becomes a…", options: ["Tiny insulator", "Tiny temporary magnet", "Tiny battery", "Tiny resistor"], answerIndex: 1, hint: "Iron is magnetic.", explanation: "Each filing becomes a tiny temporary magnet and lines up with the field, showing its shape.", guideRef: "magnetic-fields" },
          { id: "magnetism-electricity-mcq-p4-q6", question: "Which is the correct order for plotting a field with a compass?", options: ["Mark dots at the compass ends, then join them into lines", "Heat the magnet first", "Cut the magnet in half", "Pour iron filings on the compass"], answerIndex: 0, hint: "Track the needle around the magnet.", explanation: "You mark the needle's direction at each spot and join the dots into smooth field lines.", guideRef: "magnetic-fields" },
          { id: "magnetism-electricity-mcq-p4-q7", question: "Compasses have helped humans for centuries mainly with…", options: ["Cooking", "Navigation", "Telling the temperature", "Weighing goods"], answerIndex: 1, hint: "Finding your way.", explanation: "Compasses help with navigation by showing direction, vital before GPS and the stars were hidden.", guideRef: "earth-as-magnet" },
          { id: "magnetism-electricity-mcq-p4-q8", question: "Heating a magnet strongly tends to…", options: ["Make it permanent", "Demagnetise it", "Add more poles", "Turn it into copper"], answerIndex: 1, hint: "Heat jumbles the domains.", explanation: "Strong heating jumbles the domains and demagnetises the magnet. It does not add poles or change the metal.", guideRef: "permanent-vs-temporary" },
          { id: "magnetism-electricity-mcq-p4-q9", question: "Which is the main difference between a permanent and a temporary magnet?", options: ["Their colour", "How long they keep their magnetism", "Their weight", "Their length"], answerIndex: 1, hint: "Keeping vs losing magnetism.", explanation: "Permanent magnets keep magnetism; temporary ones lose it easily. Colour, weight and length are irrelevant.", guideRef: "permanent-vs-temporary" },
          { id: "magnetism-electricity-mcq-p4-q10", question: "A solenoid with NO current flowing is…", options: ["A strong magnet", "Not a magnet (unless it has a permanently magnetised core)", "Always permanently magnetic", "An insulator"], answerIndex: 1, hint: "What creates the field?", explanation: "Without current the solenoid produces no magnetic field, so it is not a magnet. The field needs the current.", guideRef: "electromagnets" },
          { id: "magnetism-electricity-mcq-p4-q11", question: "Which list gives three ways to strengthen an electromagnet?", options: ["More turns, more current, iron core", "Less current, plastic core, fewer turns", "Cool it, shorten it, paint it", "More turns, copper core, less current"], answerIndex: 0, hint: "TIC.", explanation: "More turns, more current and an iron core all strengthen it. The others include weakening or useless changes.", guideRef: "electromagnets" },
          { id: "magnetism-electricity-mcq-p4-q12", question: "A relay is a switch that is operated by…", options: ["A small current creating an electromagnet", "A permanent magnet only", "Heat from a flame", "Static electricity"], answerIndex: 0, hint: "Electromagnet switches a second circuit.", explanation: "A relay uses a small current in an electromagnet to close a second switch, controlling a larger circuit.", guideRef: "electromagnets" },
          { id: "magnetism-electricity-mcq-p4-q13", question: "Conventional current is said to flow from the cell's…", options: ["Negative to positive terminal", "Positive to negative terminal", "Top to bottom", "Middle outward"], answerIndex: 1, hint: "Conventional, not electron, direction.", explanation: "Conventional current flows from + to −. The electrons actually move the other way, but we draw conventional current.", guideRef: "current-and-circuits" },
          { id: "magnetism-electricity-mcq-p4-q14", question: "A bulb lights almost instantly when the switch closes because…", options: ["Charges travel at the speed of light", "The whole loop starts to feel the push almost at once", "The bulb stores charge", "The wire is short"], answerIndex: 1, hint: "The push spreads round the loop very fast.", explanation: "Closing the switch sets up the push around the whole loop almost instantly, so the bulb lights even though charges drift slowly.", guideRef: "current-and-circuits" },
          { id: "magnetism-electricity-mcq-p4-q15", question: "Which would stop a circuit working?", options: ["Replacing a wire with copper", "A break in the loop", "Adding a switch that is closed", "Using a fresh cell"], answerIndex: 1, hint: "Loops must be complete.", explanation: "A break in the loop stops the current. Copper wire, a closed switch and a fresh cell all keep it working.", guideRef: "current-and-circuits" },
          { id: "magnetism-electricity-mcq-p4-q16", question: "Which circuit symbol has a line that lifts to make a gap?", options: ["A cell", "A switch", "A resistor", "A lamp"], answerIndex: 1, hint: "Open or closed.", explanation: "A switch is drawn as a line that lifts (open) or drops (closed) to make or break the circuit.", guideRef: "circuit-symbols-diagrams" },
          { id: "magnetism-electricity-mcq-p4-q17", question: "Which is the correct symbol description for a voltmeter?", options: ["A circle with A", "A circle with V", "A rectangle", "Two parallel lines"], answerIndex: 1, hint: "V for volts.", explanation: "A voltmeter is a circle with V. A circle with A is an ammeter.", guideRef: "circuit-symbols-diagrams" },
          { id: "magnetism-electricity-mcq-p4-q18", question: "A battery of three cells is drawn as…", options: ["One cell symbol", "Three cell symbols in a row", "A rectangle", "A circle with B"], answerIndex: 1, hint: "Battery = several cells.", explanation: "A battery is several cell symbols in a row. A single symbol is just one cell.", guideRef: "circuit-symbols-diagrams" },
          { id: "magnetism-electricity-mcq-p4-q19", question: "In a parallel circuit with two identical bulbs, removing one bulb makes the other…", options: ["Go out", "Stay lit at about the same brightness", "Get much dimmer", "Flash"], answerIndex: 1, hint: "Branches are independent.", explanation: "The remaining branch still gets full voltage, so the other bulb stays lit. In series it would go out.", guideRef: "series-and-parallel" },
          { id: "magnetism-electricity-mcq-p4-q20", question: "The main reason homes use parallel wiring rather than series is that parallel…", options: ["Uses thinner wire", "Lets each device run at full power independently", "Always uses less electricity", "Cannot catch fire"], answerIndex: 1, hint: "Independent full-power branches.", explanation: "Parallel gives each device full voltage and independence. It is not chosen for thinner wire or fire safety alone.", guideRef: "series-and-parallel" },
          { id: "magnetism-electricity-mcq-p4-q21", question: "Which is true of current in a SERIES circuit?", options: ["It splits between components", "It is the same all the way round", "It is largest at the cell", "It is zero in the wires"], answerIndex: 1, hint: "One loop.", explanation: "Series current is the same everywhere. Splitting happens in parallel branches, not in a series loop.", guideRef: "series-and-parallel" },
          { id: "magnetism-electricity-mcq-p4-q22", question: "An ammeter is built to let current pass through almost unchanged so that it…", options: ["Heats up", "Does not disturb the circuit it measures", "Glows brightly", "Acts as a resistor"], answerIndex: 1, hint: "A good meter should not change what it measures.", explanation: "Low resistance means the ammeter barely affects the current, giving a true reading. It is not meant to resist or glow.", guideRef: "ammeters-voltmeters-static" },
          { id: "magnetism-electricity-mcq-p4-q23", question: "Which statement matches the units correctly?", options: ["Current in volts, voltage in amps", "Current in amps, voltage in volts", "Both in watts", "Both in ohms"], answerIndex: 1, hint: "Do not swap them.", explanation: "Current is in amps (A) and voltage in volts (V). Swapping them is a common error.", guideRef: "ammeters-voltmeters-static" },
          { id: "magnetism-electricity-mcq-p4-q24", question: "After rubbing, a cloth that has LOST electrons is now…", options: ["Negatively charged", "Positively charged", "Magnetic", "Neutral"], answerIndex: 1, hint: "Lost negatives means…", explanation: "Losing electrons leaves it positively charged. The object that gained electrons becomes negative.", guideRef: "ammeters-voltmeters-static" },
          { id: "magnetism-electricity-mcq-p4-q25", question: "Two balloons rubbed on hair are brought close. They…", options: ["Attract", "Repel", "Stick instantly", "Become magnets"], answerIndex: 1, hint: "They carry the same charge.", explanation: "Both gain the same (negative) charge, and like charges repel, so the balloons push apart.", guideRef: "ammeters-voltmeters-static" },
        ],
      },
    ],
    qaPapers: [
      {
        id: "magnetism-electricity-qa-p1",
        title: "Written Paper 1",
        questions: [
          { id: "magnetism-electricity-qa-p1-q1", question: "State the rule about how magnetic poles interact.", marks: 2, hint: "Two cases.", modelAnswer: "Like poles (N–N or S–S) repel each other. Unlike poles (N–S) attract each other.", markScheme: [ { point: "Like poles repel", keywords: ["like", "repel", "same pole", "push apart"] }, { point: "Unlike poles attract", keywords: ["unlike", "attract", "opposite", "pull together"] } ], commonError: "Writing the rule the wrong way round (like poles attract).", guideRef: "magnets-and-poles" },
          { id: "magnetism-electricity-qa-p1-q2", question: "Name the four common magnetic materials.", marks: 2, hint: "Two metals you write a lot, plus two less common ones.", modelAnswer: "Iron, steel, nickel and cobalt are the four common magnetic materials.", markScheme: [ { point: "Iron and steel", keywords: ["iron", "steel"] }, { point: "Nickel and cobalt", keywords: ["nickel", "cobalt"] } ], commonError: "Listing copper or aluminium, which are metals but non-magnetic.", guideRef: "magnets-and-poles" },
          { id: "magnetism-electricity-qa-p1-q3", question: "Explain what is meant by a magnetic field.", marks: 2, hint: "Region and force.", modelAnswer: "A magnetic field is the region of space around a magnet where another magnet or magnetic material feels a force, even without touching.", markScheme: [ { point: "Region/area around the magnet", keywords: ["region", "area", "space", "around"] }, { point: "Where a force is felt", keywords: ["force", "feels a force", "experiences", "push or pull"] } ], commonError: "Describing the magnet itself rather than the space around it.", guideRef: "magnetic-fields" },
          { id: "magnetism-electricity-qa-p1-q4", question: "Describe how to use iron filings to show the magnetic field of a bar magnet.", marks: 3, hint: "Paper, filings, tap.", modelAnswer: "Place a sheet of paper over the bar magnet, gently sprinkle iron filings on top, then tap the paper. The filings line up along the field lines, revealing the field's shape, strongest and most crowded at the poles.", markScheme: [ { point: "Paper over the magnet", keywords: ["paper", "card", "sheet", "over the magnet"] }, { point: "Sprinkle iron filings (and tap)", keywords: ["sprinkle", "iron filings", "tap", "scatter"] }, { point: "Filings line up to show field shape", keywords: ["line up", "field lines", "shape", "pattern"] } ], commonError: "Forgetting that filings show shape but not direction.", guideRef: "magnetic-fields" },
          { id: "magnetism-electricity-qa-p1-q5", question: "Where is a bar magnet's field strongest, and how can you tell from a field-line diagram?", marks: 2, hint: "Spacing of lines.", modelAnswer: "The field is strongest at the poles. On a diagram you can tell because the field lines are closest together there.", markScheme: [ { point: "Strongest at the poles", keywords: ["poles", "at the ends", "north and south"] }, { point: "Lines closest together", keywords: ["closest together", "closer", "crowded", "close"] } ], commonError: "Saying the field is strongest in the middle.", guideRef: "magnetic-fields" },
          { id: "magnetism-electricity-qa-p1-q6", question: "Explain why a compass needle points roughly north.", marks: 3, hint: "Compass is a magnet; Earth is a magnet.", modelAnswer: "A compass needle is a small bar magnet free to turn. The Earth behaves like a giant magnet, so the needle lines up with the Earth's magnetic field. Because unlike poles attract, the needle's north end is pulled toward the geographic North, where the Earth's magnetic south pole lies.", markScheme: [ { point: "Compass is a small magnet", keywords: ["small magnet", "bar magnet", "tiny magnet", "magnet free to turn"] }, { point: "Earth acts like a giant magnet / has a field", keywords: ["earth", "giant magnet", "magnetic field", "earth's field"] }, { point: "Lines up with the field / unlike poles attract", keywords: ["lines up", "aligns", "unlike poles attract", "points north"] } ], commonError: "Forgetting that the Earth has a magnetic SOUTH pole near geographic North.", guideRef: "earth-as-magnet" },
          { id: "magnetism-electricity-qa-p1-q7", question: "What causes the Earth's magnetic field?", marks: 1, hint: "Deep inside the Earth.", modelAnswer: "It is caused by the swirling, moving molten iron in the Earth's outer core.", markScheme: [ { point: "Moving molten iron in the core", keywords: ["molten iron", "core", "moving", "swirling"] } ], commonError: "Saying it comes from the Sun or the Moon.", guideRef: "earth-as-magnet" },
          { id: "magnetism-electricity-qa-p1-q8", question: "Explain the difference between a permanent and a temporary magnet, giving an example of each.", marks: 4, hint: "Keep vs lose; steel vs iron.", modelAnswer: "A permanent magnet keeps its magnetism for a long time, for example steel (a fridge magnet). A temporary magnet only stays magnetic while near a magnet or while current flows and loses its magnetism easily, for example pure iron.", markScheme: [ { point: "Permanent keeps its magnetism", keywords: ["permanent", "keeps", "stays magnetic", "long time"] }, { point: "Example: steel", keywords: ["steel"] }, { point: "Temporary loses magnetism easily", keywords: ["temporary", "loses", "soft", "easily"] }, { point: "Example: iron", keywords: ["iron", "pure iron"] } ], commonError: "Swapping the examples (saying iron is permanent and steel temporary).", guideRef: "permanent-vs-temporary" },
          { id: "magnetism-electricity-qa-p1-q9", question: "Describe two ways to demagnetise a magnet.", marks: 2, hint: "Disturb the domains.", modelAnswer: "You can demagnetise a magnet by heating it strongly, or by hammering/dropping it repeatedly. Both jumble the magnetic domains so they point in random directions.", markScheme: [ { point: "Heating it", keywords: ["heat", "heating", "flame", "hot"] }, { point: "Hammering/dropping it", keywords: ["hammer", "hammering", "drop", "hit", "bang"] } ], commonError: "Giving stroking with a magnet, which magnetises rather than demagnetises.", guideRef: "permanent-vs-temporary" },
          { id: "magnetism-electricity-qa-p1-q10", question: "Describe how to make an electromagnet from a battery, wire and an iron nail.", marks: 3, hint: "Coil, core, current.", modelAnswer: "Wind the wire many times into a coil around the iron nail, then connect the ends of the wire to the battery so a current flows. The current makes the coil magnetic and the iron nail (core) strengthens the field, forming an electromagnet.", markScheme: [ { point: "Wind wire into a coil", keywords: ["coil", "wind", "wrap", "turns", "solenoid"] }, { point: "Around the iron nail (core)", keywords: ["iron", "nail", "core", "around"] }, { point: "Connect to battery so current flows", keywords: ["battery", "current", "connect", "cell"] } ], commonError: "Leaving out the current — without it there is no magnetism.", guideRef: "electromagnets" },
          { id: "magnetism-electricity-qa-p1-q11", question: "Give three ways to make an electromagnet stronger.", marks: 3, hint: "TIC.", modelAnswer: "Use more turns of wire on the coil, increase the current, and add an iron core.", markScheme: [ { point: "More turns", keywords: ["more turns", "turns", "more coils", "more loops"] }, { point: "More current", keywords: ["more current", "increase current", "bigger battery"] }, { point: "Iron core", keywords: ["iron core", "core", "add iron"] } ], commonError: "Repeating one idea twice instead of three different methods.", guideRef: "electromagnets" },
          { id: "magnetism-electricity-qa-p1-q12", question: "Explain why a scrapyard crane uses an electromagnet rather than a permanent magnet.", marks: 2, hint: "Picking up and dropping.", modelAnswer: "An electromagnet can be switched on to pick up the metal and switched off to drop it. A permanent magnet could not be switched off, so it could never release the load.", markScheme: [ { point: "Electromagnet can be switched on/off", keywords: ["switched on", "switch off", "turned off", "on and off"] }, { point: "Permanent could not release the load", keywords: ["permanent", "cannot release", "could not drop", "stuck"] } ], commonError: "Saying an electromagnet is just stronger, missing the switching point.", guideRef: "electromagnets" },
          { id: "magnetism-electricity-qa-p1-q13", question: "Define electric current and state what a circuit needs for current to flow.", marks: 3, hint: "Charge, loop, source.", modelAnswer: "Electric current is the flow of electric charge around a circuit. For it to flow you need a complete (unbroken) loop and an energy source such as a cell or battery.", markScheme: [ { point: "Current is the flow of charge", keywords: ["flow of charge", "charge", "moving charge"] }, { point: "Needs a complete loop", keywords: ["complete loop", "unbroken", "closed circuit", "loop"] }, { point: "Needs an energy source (cell/battery)", keywords: ["cell", "battery", "energy source", "power"] } ], commonError: "Calling current the flow of energy or electricity rather than charge.", guideRef: "current-and-circuits" },
          { id: "magnetism-electricity-qa-p1-q14", question: "Explain the difference between a conductor and an insulator, giving an example of each.", marks: 3, hint: "Lets current flow or not.", modelAnswer: "A conductor lets electric current flow through it easily, for example copper (a metal). An insulator does not let current flow, for example plastic.", markScheme: [ { point: "Conductor lets current flow", keywords: ["conductor", "lets current", "allows current", "flows easily"] }, { point: "Example conductor (metal)", keywords: ["copper", "metal", "gold", "aluminium"] }, { point: "Insulator does not let current flow (example)", keywords: ["insulator", "plastic", "rubber", "glass", "does not"] } ], commonError: "Calling plastic a conductor or copper an insulator.", guideRef: "current-and-circuits" },
          { id: "magnetism-electricity-qa-p1-q15", question: "Why is a copper wire usually covered in plastic?", marks: 2, hint: "Two materials, two jobs.", modelAnswer: "The copper is a conductor that carries the current, and the plastic is an insulator that keeps the current inside the wire and stops you getting a shock.", markScheme: [ { point: "Copper conducts the current", keywords: ["copper", "conductor", "carries current", "conducts"] }, { point: "Plastic insulates / keeps you safe", keywords: ["insulator", "plastic", "safe", "no shock", "keeps current in"] } ], commonError: "Only mentioning one of the two materials' jobs.", guideRef: "current-and-circuits" },
          { id: "magnetism-electricity-qa-p1-q16", question: "Draw or describe the circuit symbols for a cell and for a lamp.", marks: 2, hint: "Lines vs circle.", modelAnswer: "A cell is a long thin line (positive) next to a short thick line (negative). A lamp is a circle with a cross inside it.", markScheme: [ { point: "Cell = long thin and short thick lines", keywords: ["long line", "short line", "thin", "thick", "two lines"] }, { point: "Lamp = circle with a cross", keywords: ["circle", "cross", "x inside"] } ], commonError: "Drawing the lamp as a plain circle (that could be a meter).", guideRef: "circuit-symbols-diagrams" },
          { id: "magnetism-electricity-qa-p1-q17", question: "Why is it useful for scientists everywhere to use the same circuit symbols?", marks: 2, hint: "Communication.", modelAnswer: "Standard symbols mean any scientist can read and build the same circuit without confusion, no matter what language they speak, which prevents mistakes.", markScheme: [ { point: "Anyone can read/understand the diagram", keywords: ["read", "understand", "anyone", "everyone", "universal"] }, { point: "Avoids confusion/mistakes", keywords: ["confusion", "mistakes", "clear", "no misunderstanding"] } ], commonError: "Saying it just looks tidier without the communication reason.", guideRef: "circuit-symbols-diagrams" },
          { id: "magnetism-electricity-qa-p1-q18", question: "Compare what happens to the current in a series circuit and a parallel circuit.", marks: 2, hint: "Same vs splits.", modelAnswer: "In a series circuit the current is the same everywhere in the single loop. In a parallel circuit the current splits between the branches and recombines.", markScheme: [ { point: "Series: current the same everywhere", keywords: ["series", "same", "everywhere", "one loop"] }, { point: "Parallel: current splits between branches", keywords: ["parallel", "splits", "divides", "branches", "shares"] } ], commonError: "Saying current is used up in a series circuit.", guideRef: "series-and-parallel" },
          { id: "magnetism-electricity-qa-p1-q19", question: "Explain why adding more bulbs in series makes them dimmer.", marks: 2, hint: "Sharing the push.", modelAnswer: "The cell's voltage is shared between all the bulbs in the series loop, so each bulb gets less voltage and a smaller current flows, making them dimmer.", markScheme: [ { point: "Voltage shared between bulbs", keywords: ["voltage shared", "shared", "split the voltage", "less voltage"] }, { point: "Less current / each bulb dimmer", keywords: ["less current", "smaller current", "dimmer", "current decreases"] } ], commonError: "Saying the current is shared (it is the same in series); it is the voltage that is shared.", guideRef: "series-and-parallel" },
          { id: "magnetism-electricity-qa-p1-q20", question: "Why are the lights in a house wired in parallel rather than series?", marks: 3, hint: "Independence and brightness.", modelAnswer: "In parallel each light is on its own branch, so each gets the full voltage and stays bright. They can be switched on and off independently, and if one bulb breaks the others keep working.", markScheme: [ { point: "Each gets full voltage / stays bright", keywords: ["full voltage", "bright", "same brightness"] }, { point: "Switched independently", keywords: ["independent", "separately", "on its own", "individually"] }, { point: "One breaking does not stop the others", keywords: ["one breaks", "others stay on", "keep working", "still work"] } ], commonError: "Giving only one advantage when three marks are available.", guideRef: "series-and-parallel" },
          { id: "magnetism-electricity-qa-p1-q21", question: "State how an ammeter is connected and what it measures.", marks: 2, hint: "In a line; amps.", modelAnswer: "An ammeter is connected in series (in the main loop) and it measures the current, in amps.", markScheme: [ { point: "Connected in series", keywords: ["series", "in the loop", "in line"] }, { point: "Measures current (amps)", keywords: ["current", "amps", "ampere", "a"] } ], commonError: "Saying an ammeter is connected in parallel.", guideRef: "ammeters-voltmeters-static" },
          { id: "magnetism-electricity-qa-p1-q22", question: "State how a voltmeter is connected and what it measures.", marks: 2, hint: "Across; volts.", modelAnswer: "A voltmeter is connected in parallel (across a component) and it measures the voltage or potential difference, in volts.", markScheme: [ { point: "Connected in parallel/across", keywords: ["parallel", "across", "beside"] }, { point: "Measures voltage (volts)", keywords: ["voltage", "potential difference", "volts", "v"] } ], commonError: "Saying a voltmeter is connected in series.", guideRef: "ammeters-voltmeters-static" },
          { id: "magnetism-electricity-qa-p1-q23", question: "Explain how rubbing a balloon on your hair charges it up.", marks: 3, hint: "Electrons and friction.", modelAnswer: "Rubbing transfers tiny charged particles called electrons by friction. The balloon gains electrons and becomes negatively charged, while your hair loses electrons and becomes positively charged.", markScheme: [ { point: "Electrons transferred by friction", keywords: ["electrons", "friction", "rubbing", "transferred"] }, { point: "Balloon gains electrons / becomes negative", keywords: ["gains electrons", "negative", "negatively charged"] }, { point: "Hair loses electrons / becomes positive", keywords: ["loses electrons", "positive", "positively charged"] } ], commonError: "Saying protons or charge itself moves rather than electrons.", guideRef: "ammeters-voltmeters-static" },
          { id: "magnetism-electricity-qa-p1-q24", question: "State the rule for how electric charges interact, and compare it with magnetic poles.", marks: 2, hint: "Like and unlike.", modelAnswer: "Like charges repel and unlike charges attract. This is the same pattern as magnetic poles, where like poles repel and unlike poles attract.", markScheme: [ { point: "Like charges repel, unlike attract", keywords: ["like charges repel", "unlike attract", "same repel", "opposite attract"] }, { point: "Same pattern as magnetic poles", keywords: ["like poles", "same as poles", "magnetic poles", "same rule"] } ], commonError: "Mixing up which charges attract and which repel.", guideRef: "ammeters-voltmeters-static" },
          { id: "magnetism-electricity-qa-p1-q25", question: "In a series circuit one ammeter reads 0.4 A. State what a second ammeter elsewhere in the same loop reads and explain why.", marks: 2, hint: "Series current.", modelAnswer: "The second ammeter also reads 0.4 A, because in a series circuit the current is the same at every point in the single loop and is not used up.", markScheme: [ { point: "Reads 0.4 A (same value)", keywords: ["0.4", "same", "same value", "same reading"] }, { point: "Current is the same everywhere in series", keywords: ["same everywhere", "series", "not used up", "one loop"] } ], commonError: "Thinking the current is smaller further round the loop.", guideRef: "series-and-parallel" },
        ],
      },
    ],
  },
};
