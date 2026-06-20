import type { Topic } from "../types";

export const elementsCompoundsMixtures: Topic = {
  id: "elements-compounds-mixtures",
  title: "Elements, Compounds & Mixtures",
  subject: "Chemistry",
  icon: "🧪",
  summary: "The building blocks of all matter and how to separate them.",
  intro:
    "Everything around you — the air you breathe, the water you drink, the metal in your phone — is built from tiny particles called atoms. In this topic you will learn how atoms join (or simply mix) to make elements, compounds and mixtures, why a compound behaves nothing like the elements inside it, and how scientists cleverly pull mixtures apart again using filtration, distillation, crystallisation and chromatography.",

  guide: [
    {
      id: "atoms-elements",
      heading: "Atoms and elements",
      body:
        "All matter is made of incredibly small particles called **atoms**. An atom is the smallest particle of a substance that still behaves like that substance — you could not see one even with an ordinary microscope.\n\nAn **element** is a substance made of only **one type of atom**. There are about 118 known elements, and they are all listed in the **periodic table**. Examples include oxygen, iron, gold, carbon and hydrogen. Because an element contains a single kind of atom, it cannot be broken down into anything simpler by a chemical reaction.\n\nEach element has its own **chemical symbol** — a shorthand of one or two letters. The rules are strict:\n\n- The **first letter is always a CAPITAL**.\n- If there is a **second letter, it is always lower case**.\n- So carbon is **C**, oxygen is **O**, sodium is **Na** and magnesium is **Mg**.\n\nWriting *CO* (capital C, capital O) does not mean cobalt — it means a compound of carbon and oxygen. Cobalt is **Co**. The capitalisation genuinely changes the meaning, which is why exams are fussy about it.",
      diagram:
        '<svg viewBox="0 0 300 140" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="An element made of one type of atom"><rect x="5" y="5" width="290" height="130" rx="8" fill="#f0f9ff" stroke="#0ea5e9"/><text x="150" y="26" font-size="13" text-anchor="middle" fill="#075985">Element = one type of atom</text><circle cx="60" cy="70" r="16" fill="#bae6fd" stroke="#0369a1"/><circle cx="110" cy="70" r="16" fill="#bae6fd" stroke="#0369a1"/><circle cx="160" cy="70" r="16" fill="#bae6fd" stroke="#0369a1"/><circle cx="100" cy="110" r="16" fill="#bae6fd" stroke="#0369a1"/><circle cx="150" cy="110" r="16" fill="#bae6fd" stroke="#0369a1"/><text x="60" y="74" font-size="10" text-anchor="middle" fill="#075985">O</text><text x="110" y="74" font-size="10" text-anchor="middle" fill="#075985">O</text><text x="160" y="74" font-size="10" text-anchor="middle" fill="#075985">O</text><text x="100" y="114" font-size="10" text-anchor="middle" fill="#075985">O</text><text x="150" y="114" font-size="10" text-anchor="middle" fill="#075985">O</text><text x="245" y="74" font-size="11" text-anchor="middle" fill="#075985">all the</text><text x="245" y="90" font-size="11" text-anchor="middle" fill="#075985">same</text></svg>',
      diagramCaption: "Every atom in an element is the same kind — here, all oxygen atoms.",
      keyPoints: [
        "An element contains only one type of atom and cannot be broken down chemically.",
        "Chemical symbols are 1–2 letters: first letter CAPITAL, any second letter lower case.",
        "There are about 118 elements, organised in the periodic table.",
      ],
      thinkDeeper:
        "A student writes the symbol for magnesium as 'MG' and for cobalt as 'CO'. Explain exactly what those two symbols actually mean to a chemist, and why the mistakes are more than just 'untidy handwriting'.",
    },
    {
      id: "compounds",
      heading: "Compounds and formulae",
      body:
        "A **compound** is a substance made when atoms of **two or more different elements** are **chemically bonded** together. The atoms are joined in a **fixed ratio** that never changes for a given compound.\n\nFor example, **water** is always two hydrogen atoms bonded to one oxygen atom — written **H2O**. **Carbon dioxide** is always one carbon to two oxygens — **CO2**. **Sodium chloride** (table salt) is **NaCl**, one sodium to one chlorine.\n\nThe little numbers (subscripts) tell you how many of each atom there are. If there is no number, it means one. A **chemical formula** is this shorthand for a compound.\n\nThe most surprising idea is that a **compound has completely different properties from the elements that make it**:\n\n- Hydrogen is an explosive gas; oxygen helps things burn — yet bonded together as water they put fires out.\n- Sodium is a soft metal that explodes in water; chlorine is a poisonous green gas — yet bonded together they make harmless table salt that you eat.\n\nMaking or breaking a compound is a **chemical reaction**, so it usually needs energy and is not easy to reverse.",
      diagram:
        '<svg viewBox="0 0 320 150" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Water compound formula H2O"><rect x="5" y="5" width="310" height="140" rx="8" fill="#ecfdf5" stroke="#10b981"/><text x="160" y="26" font-size="13" text-anchor="middle" fill="#065f46">Compound: water (H2O)</text><circle cx="160" cy="85" r="22" fill="#fecaca" stroke="#b91c1c"/><text x="160" y="90" font-size="13" text-anchor="middle" fill="#7f1d1d">O</text><circle cx="115" cy="120" r="15" fill="#dbeafe" stroke="#1d4ed8"/><text x="115" y="125" font-size="11" text-anchor="middle" fill="#1e3a8a">H</text><circle cx="205" cy="120" r="15" fill="#dbeafe" stroke="#1d4ed8"/><text x="205" y="125" font-size="11" text-anchor="middle" fill="#1e3a8a">H</text><line x1="142" y1="98" x2="123" y2="112" stroke="#065f46" stroke-width="3"/><line x1="178" y1="98" x2="197" y2="112" stroke="#065f46" stroke-width="3"/><text x="270" y="90" font-size="12" text-anchor="middle" fill="#065f46">2 H + 1 O</text><text x="270" y="108" font-size="12" text-anchor="middle" fill="#065f46">bonded</text></svg>',
      diagramCaption: "In water, two hydrogen atoms are chemically bonded to one oxygen atom in a fixed 2:1 ratio.",
      keyPoints: [
        "A compound = two or more elements chemically bonded in a fixed ratio.",
        "A formula shows the ratio: H2O, CO2, NaCl; small numbers count the atoms.",
        "A compound's properties are different from the elements it is made from.",
      ],
      thinkDeeper:
        "Sodium is dangerous and chlorine is poisonous, but sodium chloride is safe to sprinkle on chips. What does this tell you about whether the 'properties' of a substance live in its atoms, or in the way the atoms are joined?",
    },
    {
      id: "atoms-molecules",
      heading: "Atoms, molecules and particle pictures",
      body:
        "A **molecule** is a particle made of **two or more atoms joined together** by chemical bonds. Molecules can be made of the same element or of different elements.\n\n- **Element molecules:** oxygen gas exists as O2 (two oxygen atoms joined). Hydrogen is H2, nitrogen is N2. These are still **elements** because every atom is the same type.\n- **Compound molecules:** water (H2O) and carbon dioxide (CO2) are molecules of compounds because they contain more than one type of atom.\n\nScientists draw **particle pictures** to show the difference. Each circle is an atom and the **colour or shading shows the type**:\n\n- **Element:** all circles the same colour, either single atoms or joined in identical molecules.\n- **Compound:** different-coloured circles **joined together** in fixed groups.\n- **Mixture:** different particles **not joined**, jumbled together.\n\nReading these diagrams is a classic exam skill. Ask yourself two questions: *Are the atoms the same or different?* and *Are they joined together or just mixed?*",
      diagram:
        '<svg viewBox="0 0 360 150" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Particle pictures of element, compound and mixture"><rect x="5" y="25" width="110" height="110" rx="8" fill="#eff6ff" stroke="#3b82f6"/><text x="60" y="20" font-size="11" text-anchor="middle" fill="#1e3a8a">Element</text><circle cx="40" cy="60" r="10" fill="#60a5fa"/><circle cx="62" cy="60" r="10" fill="#60a5fa"/><circle cx="50" cy="95" r="10" fill="#60a5fa"/><circle cx="80" cy="100" r="10" fill="#60a5fa"/><rect x="125" y="25" width="110" height="110" rx="8" fill="#ecfdf5" stroke="#10b981"/><text x="180" y="20" font-size="11" text-anchor="middle" fill="#065f46">Compound</text><circle cx="160" cy="65" r="10" fill="#34d399"/><circle cx="182" cy="65" r="8" fill="#f59e0b"/><line x1="170" y1="65" x2="182" y2="65" stroke="#065f46" stroke-width="2"/><circle cx="165" cy="105" r="10" fill="#34d399"/><circle cx="187" cy="105" r="8" fill="#f59e0b"/><line x1="175" y1="105" x2="187" y2="105" stroke="#065f46" stroke-width="2"/><rect x="245" y="25" width="110" height="110" rx="8" fill="#fef2f2" stroke="#ef4444"/><text x="300" y="20" font-size="11" text-anchor="middle" fill="#7f1d1d">Mixture</text><circle cx="275" cy="60" r="10" fill="#60a5fa"/><circle cx="305" cy="70" r="8" fill="#f59e0b"/><circle cx="285" cy="100" r="10" fill="#34d399"/><circle cx="320" cy="105" r="8" fill="#f59e0b"/><circle cx="330" cy="55" r="10" fill="#60a5fa"/></svg>',
      diagramCaption: "Same colour = same atom. Joined = bonded. Element, compound and mixture compared.",
      keyPoints: [
        "A molecule is two or more atoms joined by bonds (O2 is an element molecule; H2O is a compound molecule).",
        "In particle pictures, colour shows atom type and lines show bonds.",
        "Ask: same or different atoms? joined or just mixed?",
      ],
      thinkDeeper:
        "A diagram shows pairs of identical circles all joined in twos. Could this be a compound? Justify your answer using the definition of 'compound', not just the picture.",
    },
    {
      id: "mixtures",
      heading: "Mixtures",
      body:
        "A **mixture** contains two or more substances that are **just mixed together, not chemically bonded**. Because nothing is bonded:\n\n- The substances keep their **own properties**.\n- They can be mixed in **any ratio** (unlike a compound's fixed ratio).\n- They can usually be **separated again by physical methods** — no chemical reaction needed.\n\nEveryday mixtures include:\n\n- **Air** — a mixture of gases: about 78% nitrogen, 21% oxygen, plus argon and carbon dioxide.\n- **Sea water** — water with salt and other substances dissolved in it.\n- **Alloys** — mixtures of metals (or metals with carbon), such as brass (copper + zinc) or steel (iron + carbon). Alloys are mixtures even though they look like a single shiny metal.\n\nThe big contrast to learn is **compound vs mixture**: a compound needs a chemical reaction to make or break and has a fixed ratio; a mixture forms by simply combining substances, in any ratio, and comes apart with physical separation methods.",
      diagram:
        '<svg viewBox="0 0 320 150" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Air as a mixture of gases"><rect x="5" y="5" width="310" height="140" rx="8" fill="#eef2ff" stroke="#6366f1"/><text x="160" y="24" font-size="13" text-anchor="middle" fill="#3730a3">Air = a mixture of gases</text><circle cx="50" cy="60" r="9" fill="#818cf8"/><circle cx="90" cy="80" r="9" fill="#818cf8"/><circle cx="130" cy="55" r="9" fill="#818cf8"/><circle cx="70" cy="110" r="9" fill="#818cf8"/><circle cx="160" cy="105" r="9" fill="#818cf8"/><circle cx="200" cy="70" r="9" fill="#818cf8"/><circle cx="110" cy="120" r="9" fill="#fca5a5"/><circle cx="180" cy="120" r="9" fill="#fca5a5"/><circle cx="230" cy="105" r="9" fill="#fca5a5"/><circle cx="240" cy="55" r="9" fill="#86efac"/><text x="285" y="55" font-size="10" text-anchor="middle" fill="#3730a3">N2 78%</text><text x="285" y="105" font-size="10" text-anchor="middle" fill="#3730a3">O2 21%</text><text x="285" y="125" font-size="10" text-anchor="middle" fill="#3730a3">+ others</text></svg>',
      diagramCaption: "Air's gases are mixed, not bonded, so they keep their own properties and can be separated.",
      keyPoints: [
        "A mixture is not chemically bonded; substances keep their own properties.",
        "Mixtures can be any ratio and separated by physical methods.",
        "Air, sea water and alloys are common mixtures.",
      ],
      thinkDeeper:
        "Brass looks like one solid, gold-coloured metal, yet chemists call it a mixture. What evidence would convince you it really is a mixture and not a compound of copper and zinc?",
    },
    {
      id: "pure-impure",
      heading: "Pure substances, impurities and melting points",
      body:
        "In everyday speech 'pure orange juice' means nothing added. In chemistry, **pure** has a stricter meaning: a **pure substance is a single element or a single compound, with nothing else mixed in**. So pure water is *only* H2O.\n\nA substance with other things mixed in is **impure** — it is really a mixture.\n\nThe clever bit: **purity can be tested using melting and boiling points**.\n\n- A **pure substance melts and boils at one exact, sharp temperature**. Pure ice melts at exactly 0°C and pure water boils at exactly 100°C.\n- An **impurity changes this**. Impurities tend to **lower the melting point** and **raise the boiling point**, and the substance melts or boils over a **range** of temperatures rather than a single sharp value.\n\nThis is why salt is spread on icy roads — the salt lowers the freezing/melting point of water, so the ice melts even when it is below 0°C. It is also how chemists check a product is pure: a sharp melting point at the expected temperature is good evidence of purity.",
      diagram:
        '<svg viewBox="0 0 320 160" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Pure substance melts at a sharp temperature, impure over a range"><rect x="5" y="5" width="310" height="150" rx="8" fill="#fffbeb" stroke="#f59e0b"/><line x1="40" y1="130" x2="300" y2="130" stroke="#92400e" stroke-width="1.5"/><line x1="40" y1="130" x2="40" y2="25" stroke="#92400e" stroke-width="1.5"/><text x="170" y="150" font-size="10" text-anchor="middle" fill="#92400e">time / heating</text><polyline points="50,120 90,120 90,60 150,60 150,40 290,40" fill="none" stroke="#16a34a" stroke-width="2.5"/><text x="120" y="55" font-size="9" fill="#16a34a">pure: sharp</text><polyline points="50,125 100,125 130,95 170,70 200,55 290,45" fill="none" stroke="#dc2626" stroke-width="2.5" stroke-dasharray="4 3"/><text x="215" y="80" font-size="9" fill="#dc2626">impure: range</text><text x="20" y="35" font-size="9" fill="#92400e">temp</text></svg>',
      diagramCaption: "A pure substance melts at one sharp temperature; an impure one melts over a range.",
      keyPoints: [
        "Pure (in chemistry) = a single element or compound only.",
        "A pure substance melts/boils at a single sharp temperature.",
        "Impurities lower the melting point, raise the boiling point, and spread it over a range.",
      ],
      thinkDeeper:
        "A factory making a medicine measures its melting point as 118–123°C, but the pure drug should melt sharply at 124°C. What does the result tell them, and what should they do next?",
    },
    {
      id: "solutions",
      heading: "Solutions: solute, solvent and solubility",
      body:
        "When you stir sugar into tea and it seems to vanish, it has **dissolved**. Dissolving makes a special kind of mixture called a **solution**.\n\nThe key words:\n\n- **Solute** — the substance that dissolves (e.g. sugar or salt).\n- **Solvent** — the liquid it dissolves in (e.g. water).\n- **Solution** — the clear mixture formed (solute + solvent).\n\nA substance that dissolves is **soluble**; one that does not is **insoluble** (e.g. sand in water). Water is called the 'universal solvent' because so many things dissolve in it, but other solvents exist too.\n\nThere is a limit to how much solute will dissolve. When no more will dissolve at that temperature, the solution is **saturated**. The mass of solute that dissolves in a fixed amount of solvent is its **solubility**. Solubility usually **increases as temperature increases** — hot water dissolves more sugar than cold water, which is why warming helps things dissolve.\n\nImportant: when a solute dissolves, it is **not destroyed**. The particles are still there, just spread out between the solvent particles — which is exactly why we can get them back by evaporation.",
      diagram:
        '<svg viewBox="0 0 320 150" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Solute dissolving in solvent to form a solution"><rect x="5" y="5" width="310" height="140" rx="8" fill="#f0fdfa" stroke="#14b8a6"/><text x="160" y="24" font-size="12" text-anchor="middle" fill="#0f766e">solute + solvent = solution</text><path d="M40 50 L55 130 L95 130 L110 50 Z" fill="#99f6e4" stroke="#0f766e"/><text x="75" y="100" font-size="9" text-anchor="middle" fill="#0f766e">solvent</text><circle cx="60" cy="70" r="4" fill="#0f766e"/><circle cx="85" cy="85" r="4" fill="#0f766e"/><circle cx="70" cy="110" r="4" fill="#0f766e"/><text x="135" y="95" font-size="20" text-anchor="middle" fill="#0f766e">&#8594;</text><path d="M170 50 L185 130 L225 130 L240 50 Z" fill="#5eead4" stroke="#0f766e"/><text x="205" y="100" font-size="9" text-anchor="middle" fill="#0f766e">solution</text><circle cx="190" cy="70" r="3" fill="#115e59"/><circle cx="215" cy="80" r="3" fill="#115e59"/><circle cx="200" cy="105" r="3" fill="#115e59"/><circle cx="222" cy="110" r="3" fill="#115e59"/><circle cx="195" cy="120" r="3" fill="#115e59"/><text x="285" y="80" font-size="9" text-anchor="middle" fill="#0f766e">clear,</text><text x="285" y="94" font-size="9" text-anchor="middle" fill="#0f766e">not lost</text></svg>',
      diagramCaption: "The solute dissolves into the solvent; its particles spread out but are not destroyed.",
      keyPoints: [
        "Solute dissolves in a solvent to make a solution.",
        "Soluble = dissolves; insoluble = does not; saturated = no more will dissolve.",
        "Solubility usually rises with temperature; dissolved solute is not destroyed.",
      ],
      thinkDeeper:
        "If a dissolved solute is 'not destroyed', the mass should not vanish. Predict what happens to the total mass when you dissolve 10 g of salt in 100 g of water, and explain how you could prove it.",
    },
    {
      id: "filtration-evaporation",
      heading: "Separating: filtration, evaporation and crystallisation",
      body:
        "Because a mixture is not bonded, we can separate it with **physical methods**. Choosing the right one depends on what is mixed.\n\n**Filtration** separates an **insoluble solid from a liquid** (e.g. sand from water). The mixture is poured through **filter paper** in a funnel. The liquid that passes through is the **filtrate**; the solid trapped on the paper is the **residue**. It works because the solid particles are too big to fit through the tiny holes in the paper.\n\n**Evaporation / crystallisation** gets a **dissolved (soluble) solid back from a solution** (e.g. salt from salt water). You cannot filter salt water — the salt is dissolved and slips through the paper. Instead you **heat the solution** so the solvent (water) evaporates away as a gas, leaving the solid behind.\n\n- **Evaporation** drives off all the liquid to leave a dry solid.\n- **Crystallisation** heats the solution until it is saturated, then lets it cool slowly so neat **crystals** form — giving a purer, better-shaped solid.\n\nKey idea: filtration keeps the solid you can see and trap; evaporation/crystallisation recovers the solid that had dissolved.",
      diagram:
        '<svg viewBox="0 0 340 160" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Filtration apparatus separating residue and filtrate"><rect x="5" y="5" width="330" height="150" rx="8" fill="#f5f3ff" stroke="#8b5cf6"/><text x="170" y="22" font-size="12" text-anchor="middle" fill="#5b21b6">Filtration</text><path d="M70 40 L130 40 L100 95 Z" fill="#ddd6fe" stroke="#5b21b6"/><text x="100" y="60" font-size="8" text-anchor="middle" fill="#5b21b6">filter</text><text x="100" y="70" font-size="8" text-anchor="middle" fill="#5b21b6">paper</text><circle cx="92" cy="50" r="3" fill="#7c3a4a"/><circle cx="105" cy="52" r="3" fill="#7c3a4a"/><text x="160" y="50" font-size="9" fill="#5b21b6">residue</text><text x="160" y="62" font-size="8" fill="#5b21b6">(solid)</text><line x1="100" y1="95" x2="100" y2="115" stroke="#3b82f6" stroke-width="2" stroke-dasharray="2 2"/><path d="M70 120 L130 120 L122 150 L78 150 Z" fill="#bfdbfe" stroke="#1d4ed8"/><text x="160" y="138" font-size="9" fill="#1d4ed8">filtrate</text><text x="160" y="150" font-size="8" fill="#1d4ed8">(liquid)</text></svg>',
      diagramCaption: "Filtration: the insoluble residue is trapped on the paper; the liquid filtrate passes through.",
      keyPoints: [
        "Filtration separates an insoluble solid from a liquid (residue stays, filtrate passes).",
        "Evaporation/crystallisation recovers a dissolved solid from a solution by removing the solvent.",
        "You cannot filter a dissolved solid out of a solution.",
      ],
      thinkDeeper:
        "You are given a beaker of muddy, salty water. Describe the order of methods you would use to obtain (a) clean water and (b) dry salt, and explain why doing them in the wrong order would fail.",
    },
    {
      id: "distillation-chromatography",
      heading: "Separating: distillation and chromatography",
      body:
        "**Simple distillation** separates a **solvent (liquid) from a solution** — for example, getting pure water from salt water. The solution is heated; the water **boils and turns to vapour**, the vapour travels into a **condenser** where it **cools and condenses back to liquid**, and pure water drips into a clean container. The dissolved salt is left behind because it has a much higher boiling point. (Evaporation keeps the solid; distillation keeps the liquid — that is the difference.)\n\n**Fractional distillation** separates a **mixture of liquids** that have **different boiling points**, such as crude oil or the gases in liquefied air. A tall **fractionating column** lets liquids boil off and be collected one at a time: the one with the **lowest boiling point comes off first**, at the top of the column.\n\n**Chromatography** separates **mixtures of coloured substances** — such as the dyes in an ink or food colouring. A spot of the mixture is placed on **chromatography paper** and a **solvent** soaks up the paper. Each dye travels a **different distance** depending on how soluble it is and how strongly it sticks to the paper, so the colours spread out and separate.\n\nThe golden rule for the exam: **match the method to the mixture** — what states are involved, and what property differs (size, solubility, boiling point, colour)?",
      diagram:
        '<svg viewBox="0 0 340 170" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Simple distillation and chromatography"><rect x="5" y="5" width="330" height="160" rx="8" fill="#fef2f2" stroke="#ef4444"/><text x="90" y="22" font-size="11" text-anchor="middle" fill="#991b1b">Distillation</text><path d="M40 90 L40 130 L80 130 L80 90 Z" fill="#fecaca" stroke="#991b1b"/><text x="60" y="120" font-size="8" text-anchor="middle" fill="#991b1b">heat</text><line x1="60" y1="90" x2="60" y2="60" stroke="#991b1b" stroke-width="2"/><line x1="60" y1="60" x2="150" y2="60" stroke="#1d4ed8" stroke-width="6" stroke-linecap="round" opacity="0.5"/><text x="105" y="52" font-size="8" text-anchor="middle" fill="#1d4ed8">condenser</text><path d="M150 60 L150 120 L170 120 L170 60" fill="none" stroke="#1d4ed8"/><path d="M148 122 L172 122 L166 150 L154 150 Z" fill="#bfdbfe" stroke="#1d4ed8"/><text x="160" y="142" font-size="7" text-anchor="middle" fill="#1d4ed8">pure</text><line x1="200" y1="30" x2="200" y2="150" stroke="#7c3aed" stroke-width="1.5"/><text x="270" y="22" font-size="11" text-anchor="middle" fill="#5b21b6">Chromatography</text><line x1="220" y1="150" x2="320" y2="150" stroke="#5b21b6" stroke-width="1.5"/><line x1="240" y1="40" x2="240" y2="150" stroke="#cbd5e1"/><line x1="300" y1="40" x2="300" y2="150" stroke="#cbd5e1"/><circle cx="250" cy="60" r="5" fill="#f59e0b"/><circle cx="270" cy="95" r="5" fill="#10b981"/><circle cx="285" cy="125" r="5" fill="#3b82f6"/><text x="270" y="160" font-size="8" text-anchor="middle" fill="#5b21b6">dyes separate</text></svg>',
      diagramCaption: "Distillation recovers the pure liquid; chromatography spreads coloured dyes by how far they travel.",
      keyPoints: [
        "Simple distillation separates a liquid solvent from a solution (boil then condense).",
        "Fractional distillation separates liquids with different boiling points (crude oil, air).",
        "Chromatography separates coloured substances by how far they travel up the paper.",
      ],
      thinkDeeper:
        "Petrol and diesel both come from crude oil but are collected separately by fractional distillation. What single property must differ between them for this to work, and what would happen if their boiling points were identical?",
    },
  ],

  mnemonics: [
    {
      topic: "Element vs compound vs mixture",
      device: "Same–Bonded–Free",
      explanation:
        "Element = Same atoms only. Compound = different atoms Bonded together. Mixture = particles Free (not bonded). Run through the three words to classify any particle picture.",
    },
    {
      topic: "Writing chemical symbols",
      device: "Big then small",
      explanation:
        "The first letter is always a BIG capital and any second letter is small (lower case): Na, Mg, Cl. 'Big then small' stops you writing NA, MG or CL.",
    },
    {
      topic: "Solution words",
      device: "The solUTE is what dissolves; the solVEnt is the liquid it is IN",
      explanation:
        "Solute = the bit that dissolves (sugar/salt). Solvent = the liquid it dissolves in (water). Solution = the two together.",
    },
    {
      topic: "Choosing a separation method",
      device: "FECD: Filter, Evaporate, Crystallise, Distil",
      explanation:
        "Filter an insoluble solid from a liquid; Evaporate or Crystallise to get a dissolved solid back; Distil to get the liquid back. Match each to the mixture you have.",
    },
  ],

  examMistakes: [
    "Writing chemical symbols with two capitals (e.g. 'CO' for cobalt or 'MG' for magnesium) — the correct forms are Co and Mg; two capitals means a compound.",
    "Saying a compound has the same properties as the elements in it — bonded sodium and chlorine make edible salt, nothing like the metal and the gas.",
    "Confusing a compound (fixed ratio, chemically bonded) with a mixture (any ratio, not bonded) when classifying a particle diagram.",
    "Claiming a dissolved solute has 'disappeared' or been destroyed — it is still there, just spread out, and its mass is conserved.",
    "Trying to separate salt from salt water by filtration — dissolved salt passes straight through the filter paper; you must evaporate or distil.",
    "Mixing up evaporation and distillation: evaporation keeps the solid left behind, distillation keeps the liquid that is collected.",
    "Saying impurities raise the melting point — impurities LOWER the melting point and raise the boiling point, and spread it over a range.",
    "Forgetting the small subscript numbers in a formula (writing H2O as HO, or CO2 as CO) so the ratio of atoms is wrong.",
  ],

  misconceptions: [
    {
      wrong: "When sugar dissolves it disappears and its mass is gone.",
      right: "The sugar particles spread out among the water particles; nothing is lost, so the total mass stays the same and you can recover the sugar by evaporating the water.",
    },
    {
      wrong: "A compound is just a very well-mixed mixture.",
      right: "A compound has its atoms chemically bonded in a fixed ratio and needs a chemical reaction to make or break; a mixture is not bonded and separates by physical methods.",
    },
    {
      wrong: "A compound behaves like the elements that make it.",
      right: "A compound has its own, different properties. Hydrogen and oxygen are gases, but water is a liquid that puts out fires.",
    },
    {
      wrong: "Adding impurities makes a substance melt at a higher temperature.",
      right: "Impurities lower the melting point and broaden it into a range; pure substances melt sharply at one temperature.",
    },
    {
      wrong: "You can filter salt out of salt water.",
      right: "Dissolved salt particles are far too small to be trapped by filter paper; you must use evaporation, crystallisation or distillation instead.",
    },
    {
      wrong: "An alloy like brass is a compound because it looks like one metal.",
      right: "An alloy is a mixture of metals; the metals are not chemically bonded in a fixed ratio, and the proportions can be varied.",
    },
  ],

  expertDebates: [
    {
      question: "Is anything ever 100% pure?",
      detail:
        "Chemists can purify substances to extraordinary levels, but reaching truly perfect, atom-by-atom purity is practically impossible — there are always trace impurities. 'Pure enough' depends on the use: drinking water, medicines and computer-chip silicon each demand very different purity standards.",
    },
    {
      question: "Where is the line between a mixture and a compound for alloys?",
      detail:
        "Most alloys are treated as mixtures, but in some the atoms arrange into very regular, ratio-locked patterns (intermetallic compounds) that behave a bit like compounds. This shows that the neat 'mixture vs compound' boxes are a useful Year 8 model, while real materials can sit near the boundary.",
    },
    {
      question: "Is dissolving a physical or a chemical change?",
      detail:
        "We treat dissolving as physical because you can usually get the solute back unchanged by evaporation. But sometimes dissolving involves new interactions between solute and solvent particles (and a temperature change), so scientists sometimes debate exactly how 'purely physical' it really is.",
    },
  ],

  realWorld: [
    {
      title: "Clean drinking water",
      detail: "Water treatment uses filtration to remove insoluble dirt, and some desert and ship desalination plants use distillation to get fresh water from sea water.",
      emoji: "💧",
    },
    {
      title: "Petrol, diesel and jet fuel",
      detail: "Crude oil is separated into useful fuels by fractional distillation, because each fuel boils off at a different temperature in the fractionating column.",
      emoji: "⛽",
    },
    {
      title: "Forensic science",
      detail: "Chromatography separates the dyes in inks and the chemicals in samples, helping investigators match a pen or identify substances at a crime scene.",
      emoji: "🔬",
    },
    {
      title: "Salt from the sea",
      detail: "In hot countries sea water is left in shallow pans so the sun evaporates the water, leaving sea salt behind to harvest.",
      emoji: "🧂",
    },
    {
      title: "Stronger metals (alloys)",
      detail: "Steel (iron + carbon) and brass (copper + zinc) are mixtures designed to be stronger or more useful than the pure metals on their own.",
      emoji: "⚙️",
    },
    {
      title: "Gritting icy roads",
      detail: "Salt is an impurity that lowers water's melting point, so spreading it on roads melts ice even when the temperature is below 0°C.",
      emoji: "❄️",
    },
  ],

  flashcards: [
    { front: "What is an element?", back: "A substance made of only one type of atom; it cannot be broken down chemically." },
    { front: "What is a compound?", back: "Two or more different elements chemically bonded together in a fixed ratio." },
    { front: "What is a mixture?", back: "Two or more substances mixed but not chemically bonded; any ratio; separated by physical methods." },
    { front: "Rule for chemical symbols", back: "First letter is a capital; any second letter is lower case (e.g. Na, Mg, Cl)." },
    { front: "What does H2O tell you?", back: "Each water molecule has 2 hydrogen atoms bonded to 1 oxygen atom (a 2:1 ratio)." },
    { front: "What is a molecule?", back: "Two or more atoms joined by chemical bonds (e.g. O2 element molecule, CO2 compound molecule)." },
    { front: "Solute, solvent, solution?", back: "Solute dissolves, solvent is the liquid it dissolves in, solution is the mixture formed." },
    { front: "What does 'saturated' mean?", back: "A solution that can dissolve no more solute at that temperature." },
    { front: "How do impurities affect melting point?", back: "They lower the melting point and spread it over a range (pure substances melt sharply)." },
    { front: "When do you use filtration?", back: "To separate an insoluble solid from a liquid (residue trapped, filtrate passes through)." },
    { front: "When do you use evaporation/crystallisation?", back: "To recover a dissolved (soluble) solid from a solution by removing the solvent." },
    { front: "When do you use simple distillation?", back: "To get the pure liquid solvent back from a solution (boil then condense)." },
    { front: "When do you use fractional distillation?", back: "To separate liquids with different boiling points, e.g. crude oil or liquefied air." },
    { front: "When do you use chromatography?", back: "To separate mixtures of coloured substances such as inks and food dyes." },
  ],

  mustKnow: [
    "Define element, compound and mixture and give an example of each.",
    "Write and read chemical symbols and simple formulae (H2O, CO2, NaCl) correctly.",
    "Classify a particle diagram as an element, compound or mixture and justify it.",
    "Explain why a compound's properties differ from the elements it contains.",
    "Use the words solute, solvent, solution, soluble, insoluble and saturated correctly.",
    "Describe how impurities change a substance's melting and boiling points.",
    "Choose the correct separation technique for a given mixture and justify the choice.",
    "Describe filtration, evaporation/crystallisation, distillation and chromatography with their apparatus.",
  ],

  videos: [
    { title: "Elements, compounds and mixtures", channel: "FuseSchool", url: "https://www.youtube.com/results?search_query=fuseschool+elements+compounds+and+mixtures" },
    { title: "Separating mixtures", channel: "Cognito", url: "https://www.youtube.com/results?search_query=cognito+separating+mixtures+filtration+distillation" },
    { title: "Distillation and chromatography explained", channel: "Free Science Lessons", url: "https://www.youtube.com/results?search_query=free+science+lessons+distillation+chromatography" },
    { title: "Pure substances and mixtures", channel: "Primrose Kitten", url: "https://www.youtube.com/results?search_query=primrose+kitten+pure+substances+and+mixtures" },
  ],

  quiz: {
    mcq: [
      {
        id: "elements-compounds-mixtures-q-mcq-1",
        question: "Which statement best describes an element?",
        options: [
          "A substance made of only one type of atom",
          "Two or more elements chemically bonded together",
          "Substances mixed but not bonded",
          "A liquid with a solid dissolved in it",
        ],
        answerIndex: 0,
        hint: "Think about how many types of atom are present.",
        explanation: "An element contains only one type of atom. Option B describes a compound, option C a mixture, and option D a solution.",
        guideRef: "atoms-elements",
      },
      {
        id: "elements-compounds-mixtures-q-mcq-2",
        question: "What is the correct chemical formula for water?",
        options: ["HO", "H2O", "OH2", "H2O2"],
        answerIndex: 1,
        hint: "Two hydrogen atoms join to one oxygen atom.",
        explanation: "Water is H2O: two hydrogen atoms to one oxygen. HO leaves out a hydrogen, and H2O2 (with two oxygens) is hydrogen peroxide, a different compound.",
        guideRef: "compounds",
      },
      {
        id: "elements-compounds-mixtures-q-mcq-3",
        question: "Which technique would best separate salt from salt water?",
        options: ["Filtration", "Chromatography", "Evaporation", "Sieving"],
        answerIndex: 2,
        hint: "The salt is dissolved, so it will not stay on filter paper.",
        explanation: "Evaporation removes the water and leaves the dissolved salt. Filtration fails because dissolved salt passes through the paper.",
        guideRef: "filtration-evaporation",
      },
      {
        id: "elements-compounds-mixtures-q-mcq-4",
        question: "How does adding an impurity affect a substance's melting point?",
        options: [
          "It raises the melting point and makes it sharper",
          "It lowers the melting point and spreads it over a range",
          "It has no effect on the melting point",
          "It removes the melting point entirely",
        ],
        answerIndex: 1,
        hint: "Pure substances melt sharply at one temperature; impure ones do not.",
        explanation: "Impurities lower the melting point and make it occur over a range. A single sharp melting point is evidence of purity, not impurity.",
        guideRef: "pure-impure",
      },
    ],
    qa: [
      {
        id: "elements-compounds-mixtures-q-qa-1",
        question: "Explain the difference between a compound and a mixture.",
        marks: 4,
        hint: "Think about bonding, ratio and how each can be separated.",
        modelAnswer:
          "In a compound, two or more different elements are chemically bonded together in a fixed ratio, and a chemical reaction is needed to make or break it. In a mixture the substances are not chemically bonded, they can be present in any ratio, and they can be separated again by physical methods such as filtration or distillation.",
        markScheme: [
          { point: "Compound is chemically bonded", keywords: ["bonded", "chemically joined", "bond"] },
          { point: "Compound has a fixed ratio", keywords: ["fixed ratio", "set ratio", "fixed proportion"] },
          { point: "Mixture is not bonded / any ratio", keywords: ["not bonded", "any ratio", "not joined"] },
          { point: "Mixture separated by physical methods", keywords: ["physical", "filtration", "separated easily", "distillation"] },
        ],
        commonError: "Students say a mixture is 'less well mixed' than a compound, missing that the real difference is chemical bonding.",
        guideRef: "mixtures",
      },
      {
        id: "elements-compounds-mixtures-q-qa-2",
        question: "Name the three solution words and give an example of each using salty water.",
        marks: 3,
        hint: "One dissolves, one is the liquid, one is the result.",
        modelAnswer:
          "The solute is the substance that dissolves — here the salt. The solvent is the liquid it dissolves in — here the water. The solution is the mixture formed — here the salt water.",
        markScheme: [
          { point: "Solute = salt (dissolves)", keywords: ["solute", "salt", "dissolves"] },
          { point: "Solvent = water (the liquid)", keywords: ["solvent", "water", "liquid"] },
          { point: "Solution = salt water (mixture formed)", keywords: ["solution", "salt water", "mixture formed"] },
        ],
        commonError: "Mixing up solute and solvent — remember the solute is the bit that dissolves into the solvent.",
        guideRef: "solutions",
      },
      {
        id: "elements-compounds-mixtures-q-qa-3",
        question: "Describe how you would obtain pure water from salty water using distillation.",
        marks: 4,
        hint: "Think boil, vapour, condense, collect.",
        modelAnswer:
          "Heat the salty water so the water boils and turns into water vapour. The salt stays behind because it has a much higher boiling point. The vapour passes into a condenser where it cools and condenses back into liquid water. The pure water is collected in a clean container, leaving the salt in the original flask.",
        markScheme: [
          { point: "Heat/boil the solution to make vapour", keywords: ["heat", "boil", "evaporate", "vapour"] },
          { point: "Salt left behind (higher boiling point)", keywords: ["salt left", "left behind", "higher boiling"] },
          { point: "Vapour cools and condenses in a condenser", keywords: ["condense", "condenser", "cools"] },
          { point: "Pure water collected", keywords: ["collected", "pure water", "distillate"] },
        ],
        commonError: "Forgetting the condensing step, or confusing distillation (keeps the liquid) with evaporation (keeps the solid).",
        guideRef: "distillation-chromatography",
      },
      {
        id: "elements-compounds-mixtures-q-qa-4",
        question: "A student says that when sugar dissolves in water it is destroyed. Explain why this is wrong.",
        marks: 3,
        hint: "Think about where the particles go and whether mass changes.",
        modelAnswer:
          "The sugar is not destroyed. When it dissolves, the sugar particles separate and spread out evenly among the water particles, which is why you can no longer see them. The particles are still there, so the total mass of the solution equals the mass of the sugar plus the water, and you can recover the sugar by evaporating the water.",
        markScheme: [
          { point: "Sugar particles spread out, not destroyed", keywords: ["spread out", "not destroyed", "still there"] },
          { point: "Mass is conserved", keywords: ["mass", "conserved", "same mass"] },
          { point: "Can be recovered by evaporation", keywords: ["evaporate", "recover", "get it back"] },
        ],
        commonError: "Saying the sugar 'turns into water' rather than spreading out as separate particles within the water.",
        guideRef: "solutions",
      },
    ],
  },

  questionBank: {
    mcqPapers: [
      {
        id: "elements-compounds-mixtures-mcq-p1",
        title: "MCQ Paper 1",
        questions: [
          { id: "elements-compounds-mixtures-mcq-p1-q1", question: "What is an element?", options: ["A substance made of one type of atom", "Two elements bonded together", "A mixture of metals", "A dissolved solid"], answerIndex: 0, hint: "How many types of atom?", explanation: "An element has only one type of atom. Two elements bonded is a compound.", guideRef: "atoms-elements" },
          { id: "elements-compounds-mixtures-mcq-p1-q2", question: "Roughly how many elements are known?", options: ["About 12", "About 50", "About 118", "About 1000"], answerIndex: 2, hint: "Think of the periodic table.", explanation: "There are about 118 known elements. The other numbers are far too few or too many.", guideRef: "atoms-elements" },
          { id: "elements-compounds-mixtures-mcq-p1-q3", question: "Which is the correct chemical symbol for magnesium?", options: ["MG", "mg", "Mg", "Mg2"], answerIndex: 2, hint: "Capital first, lower case second.", explanation: "Mg is correct: capital M, lower-case g. MG (two capitals) would suggest two elements.", guideRef: "atoms-elements" },
          { id: "elements-compounds-mixtures-mcq-p1-q4", question: "Which substance is a compound?", options: ["Oxygen (O2)", "Iron (Fe)", "Water (H2O)", "A bowl of air"], answerIndex: 2, hint: "Look for two different elements bonded.", explanation: "Water has hydrogen and oxygen bonded, so it is a compound. O2 and Fe are elements; air is a mixture.", guideRef: "compounds" },
          { id: "elements-compounds-mixtures-mcq-p1-q5", question: "What does the formula CO2 tell you?", options: ["One carbon and two oxygen atoms", "Two carbon and one oxygen atom", "Cobalt and oxygen", "Carbon only"], answerIndex: 0, hint: "Subscript numbers count the atoms before them.", explanation: "CO2 means one carbon bonded to two oxygens. Two capitals (Co) would mean cobalt, not C and O.", guideRef: "compounds" },
          { id: "elements-compounds-mixtures-mcq-p1-q6", question: "A mixture is best described as substances that are...", options: ["Chemically bonded in a fixed ratio", "Mixed but not chemically bonded", "Always solids", "Always pure"], answerIndex: 1, hint: "Is anything bonded in a mixture?", explanation: "In a mixture substances are not bonded, so they keep their own properties and any ratio.", guideRef: "mixtures" },
          { id: "elements-compounds-mixtures-mcq-p1-q7", question: "Which of these is a mixture?", options: ["Carbon dioxide", "Sodium chloride", "Air", "Water"], answerIndex: 2, hint: "Which one is several substances not bonded?", explanation: "Air is a mixture of gases. The others are single compounds.", guideRef: "mixtures" },
          { id: "elements-compounds-mixtures-mcq-p1-q8", question: "What is a molecule?", options: ["A single atom", "Two or more atoms joined by bonds", "Any liquid", "A type of element only"], answerIndex: 1, hint: "Think 'atoms joined'.", explanation: "A molecule is two or more atoms bonded together, e.g. O2 or H2O.", guideRef: "atoms-molecules" },
          { id: "elements-compounds-mixtures-mcq-p1-q9", question: "Oxygen gas O2 is classed as a(n)...", options: ["Compound", "Mixture", "Element", "Solution"], answerIndex: 2, hint: "Are the two atoms the same or different?", explanation: "Both atoms in O2 are oxygen, so it is still an element (an element molecule).", guideRef: "atoms-molecules" },
          { id: "elements-compounds-mixtures-mcq-p1-q10", question: "In chemistry, a pure substance is...", options: ["Anything natural", "A single element or compound only", "Always a liquid", "Any clear liquid"], answerIndex: 1, hint: "Stricter than everyday 'pure'.", explanation: "Pure means a single element or compound with nothing else mixed in.", guideRef: "pure-impure" },
          { id: "elements-compounds-mixtures-mcq-p1-q11", question: "A pure substance melts at...", options: ["A range of temperatures", "One sharp temperature", "No temperature", "A different temperature each time"], answerIndex: 1, hint: "Sharp vs range.", explanation: "Pure substances melt at one sharp temperature; a range suggests impurity.", guideRef: "pure-impure" },
          { id: "elements-compounds-mixtures-mcq-p1-q12", question: "How does an impurity usually affect the melting point of ice?", options: ["Raises it", "Lowers it", "No change", "Doubles it"], answerIndex: 1, hint: "Why is salt put on icy roads?", explanation: "Impurities lower the melting point, which is why salt melts ice below 0°C.", guideRef: "pure-impure" },
          { id: "elements-compounds-mixtures-mcq-p1-q13", question: "In a salt solution, the salt is the...", options: ["Solvent", "Solute", "Solution", "Residue"], answerIndex: 1, hint: "Which one dissolves?", explanation: "The solute is the substance that dissolves; here it is the salt. Water is the solvent.", guideRef: "solutions" },
          { id: "elements-compounds-mixtures-mcq-p1-q14", question: "A substance that does NOT dissolve is described as...", options: ["Soluble", "Saturated", "Insoluble", "Dilute"], answerIndex: 2, hint: "The opposite of soluble.", explanation: "Insoluble means it does not dissolve, e.g. sand in water.", guideRef: "solutions" },
          { id: "elements-compounds-mixtures-mcq-p1-q15", question: "A saturated solution is one that...", options: ["Has no solute in it", "Can dissolve no more solute at that temperature", "Is always boiling", "Has been filtered"], answerIndex: 1, hint: "Think 'full up'.", explanation: "Saturated means no more solute will dissolve at that temperature.", guideRef: "solutions" },
          { id: "elements-compounds-mixtures-mcq-p1-q16", question: "Solubility of most solids usually... as temperature increases.", options: ["Decreases", "Stays the same", "Increases", "Becomes zero"], answerIndex: 2, hint: "Hot drinks dissolve sugar faster.", explanation: "Higher temperature usually means more solute can dissolve, so solubility increases.", guideRef: "solutions" },
          { id: "elements-compounds-mixtures-mcq-p1-q17", question: "Which method separates sand from water?", options: ["Distillation", "Filtration", "Chromatography", "Crystallisation"], answerIndex: 1, hint: "Sand is insoluble.", explanation: "Filtration traps the insoluble sand on the paper while water passes through.", guideRef: "filtration-evaporation" },
          { id: "elements-compounds-mixtures-mcq-p1-q18", question: "In filtration, the liquid that passes through the paper is the...", options: ["Residue", "Filtrate", "Solute", "Distillate"], answerIndex: 1, hint: "Not the solid left behind.", explanation: "The filtrate passes through; the residue is the solid trapped on the paper.", guideRef: "filtration-evaporation" },
          { id: "elements-compounds-mixtures-mcq-p1-q19", question: "To get dissolved salt back from salt water you would use...", options: ["Filtration", "Evaporation", "Sieving", "Magnetism"], answerIndex: 1, hint: "The salt is dissolved.", explanation: "Evaporation removes the water leaving the salt; filtration cannot trap dissolved salt.", guideRef: "filtration-evaporation" },
          { id: "elements-compounds-mixtures-mcq-p1-q20", question: "Crystallisation is used to...", options: ["Trap an insoluble solid", "Form neat crystals of a dissolved solid", "Separate coloured dyes", "Separate two gases"], answerIndex: 1, hint: "Cool a saturated solution slowly.", explanation: "Crystallisation forms crystals of a dissolved solid as the solution cools.", guideRef: "filtration-evaporation" },
          { id: "elements-compounds-mixtures-mcq-p1-q21", question: "Simple distillation is used to obtain...", options: ["The dissolved solid", "The pure liquid from a solution", "Coloured inks", "An insoluble solid"], answerIndex: 1, hint: "Boil then condense.", explanation: "Distillation collects the pure liquid (solvent) after boiling and condensing it.", guideRef: "distillation-chromatography" },
          { id: "elements-compounds-mixtures-mcq-p1-q22", question: "In distillation, the vapour turns back to liquid in the...", options: ["Funnel", "Condenser", "Filter paper", "Beaker of solid"], answerIndex: 1, hint: "It cools there.", explanation: "The condenser cools the vapour so it condenses back to liquid.", guideRef: "distillation-chromatography" },
          { id: "elements-compounds-mixtures-mcq-p1-q23", question: "Crude oil is separated into fuels by...", options: ["Filtration", "Chromatography", "Fractional distillation", "Crystallisation"], answerIndex: 2, hint: "Liquids with different boiling points.", explanation: "Fractional distillation separates liquids by their different boiling points.", guideRef: "distillation-chromatography" },
          { id: "elements-compounds-mixtures-mcq-p1-q24", question: "Chromatography is best for separating...", options: ["Sand from water", "Salt from water", "Coloured dyes in ink", "Two metals"], answerIndex: 2, hint: "Think coloured substances.", explanation: "Chromatography separates coloured substances such as the dyes in ink.", guideRef: "distillation-chromatography" },
          { id: "elements-compounds-mixtures-mcq-p1-q25", question: "Brass (copper + zinc) is an example of a(n)...", options: ["Compound", "Element", "Alloy (mixture)", "Solution of gases"], answerIndex: 2, hint: "Metals mixed, not bonded.", explanation: "Brass is an alloy, a mixture of metals, not a compound.", guideRef: "mixtures" },
        ],
      },
      {
        id: "elements-compounds-mixtures-mcq-p2",
        title: "MCQ Paper 2",
        questions: [
          { id: "elements-compounds-mixtures-mcq-p2-q1", question: "An atom is best described as...", options: ["A type of liquid", "The smallest particle of a substance", "A large lump you can see", "A mixture of gases"], answerIndex: 1, hint: "Smallest building block.", explanation: "An atom is the smallest particle of a substance; it is far too small to see.", guideRef: "atoms-elements" },
          { id: "elements-compounds-mixtures-mcq-p2-q2", question: "Which is the correct symbol for sodium?", options: ["So", "Na", "Sd", "NA"], answerIndex: 1, hint: "Some symbols come from Latin names.", explanation: "Sodium is Na (from Latin natrium). NA with two capitals is wrong.", guideRef: "atoms-elements" },
          { id: "elements-compounds-mixtures-mcq-p2-q3", question: "Why can't an element be broken down chemically?", options: ["It is too small", "It is made of only one type of atom", "It is always a gas", "It is a mixture"], answerIndex: 1, hint: "Think what 'element' means.", explanation: "An element is a single type of atom, so there is nothing simpler to break it into chemically.", guideRef: "atoms-elements" },
          { id: "elements-compounds-mixtures-mcq-p2-q4", question: "Sodium chloride is made from sodium and chlorine. What is true of its properties?", options: ["Same as sodium and chlorine", "Different from both elements", "Explosive like sodium", "Poisonous like chlorine"], answerIndex: 1, hint: "You eat salt safely.", explanation: "A compound has different properties; salt is safe though sodium and chlorine are dangerous.", guideRef: "compounds" },
          { id: "elements-compounds-mixtures-mcq-p2-q5", question: "Which formula represents one carbon atom and two oxygen atoms?", options: ["CO", "C2O", "CO2", "Co2"], answerIndex: 2, hint: "Subscript after the atom it counts.", explanation: "CO2 is one C and two O. CO is one of each; Co2 means cobalt.", guideRef: "compounds" },
          { id: "elements-compounds-mixtures-mcq-p2-q6", question: "How are atoms held together in a compound?", options: ["By being close but not joined", "By chemical bonds", "By magnetism only", "They are not held at all"], answerIndex: 1, hint: "Compounds are chemically joined.", explanation: "A compound's atoms are held by chemical bonds in a fixed ratio.", guideRef: "compounds" },
          { id: "elements-compounds-mixtures-mcq-p2-q7", question: "Which statement about mixtures is correct?", options: ["They have a fixed ratio", "They are easily separated physically", "They need a reaction to separate", "Their parts lose their properties"], answerIndex: 1, hint: "Nothing is bonded.", explanation: "Mixtures separate by physical methods and keep their parts' properties.", guideRef: "mixtures" },
          { id: "elements-compounds-mixtures-mcq-p2-q8", question: "Sea water is a mixture of...", options: ["Two bonded elements", "Water with substances dissolved in it", "Pure water only", "Two metals"], answerIndex: 1, hint: "Salt and more dissolved in water.", explanation: "Sea water is water with salt and other substances dissolved in it — a mixture.", guideRef: "mixtures" },
          { id: "elements-compounds-mixtures-mcq-p2-q9", question: "A particle diagram shows two different coloured circles joined in pairs. This is a...", options: ["Element", "Compound", "Mixture of elements", "Saturated solution"], answerIndex: 1, hint: "Different atoms, joined.", explanation: "Different atoms joined together means a compound.", guideRef: "atoms-molecules" },
          { id: "elements-compounds-mixtures-mcq-p2-q10", question: "A diagram shows single circles all the same colour, not joined. This is a...", options: ["Compound", "Element", "Mixture", "Solution"], answerIndex: 1, hint: "Same atoms only.", explanation: "All the same atoms means an element.", guideRef: "atoms-molecules" },
          { id: "elements-compounds-mixtures-mcq-p2-q11", question: "Which best shows a mixture in a particle diagram?", options: ["Identical joined pairs", "Different atoms all bonded", "Different unjoined particles jumbled together", "One single atom"], answerIndex: 2, hint: "Not bonded, different.", explanation: "Different particles not joined and jumbled together is a mixture.", guideRef: "atoms-molecules" },
          { id: "elements-compounds-mixtures-mcq-p2-q12", question: "What is good evidence that a substance is pure?", options: ["It is colourless", "It melts over a wide range", "It melts at one sharp temperature", "It dissolves quickly"], answerIndex: 2, hint: "Sharp vs range.", explanation: "A sharp melting point is evidence of purity; a range suggests impurities.", guideRef: "pure-impure" },
          { id: "elements-compounds-mixtures-mcq-p2-q13", question: "Impurities change boiling point by...", options: ["Lowering it", "Raising it", "Removing it", "Not changing it"], answerIndex: 1, hint: "Opposite to melting point.", explanation: "Impurities raise the boiling point (and lower the melting point).", guideRef: "pure-impure" },
          { id: "elements-compounds-mixtures-mcq-p2-q14", question: "Pure water boils at exactly...", options: ["0°C", "50°C", "100°C", "200°C"], answerIndex: 2, hint: "Standard boiling point.", explanation: "Pure water boils at 100°C; impurities would raise this.", guideRef: "pure-impure" },
          { id: "elements-compounds-mixtures-mcq-p2-q15", question: "In sugar dissolved in water, water is the...", options: ["Solute", "Solvent", "Residue", "Filtrate"], answerIndex: 1, hint: "The liquid that does the dissolving.", explanation: "Water is the solvent; sugar is the solute.", guideRef: "solutions" },
          { id: "elements-compounds-mixtures-mcq-p2-q16", question: "When salt dissolves, its mass...", options: ["Disappears", "Is destroyed", "Stays the same (conserved)", "Doubles"], answerIndex: 2, hint: "Particles spread, not lost.", explanation: "Mass is conserved; the salt particles spread out but are not destroyed.", guideRef: "solutions" },
          { id: "elements-compounds-mixtures-mcq-p2-q17", question: "A solution is...", options: ["A solute and solvent mixed together", "Any cloudy liquid", "An undissolved solid", "Two metals bonded"], answerIndex: 0, hint: "Solute + solvent.", explanation: "A solution is the clear mixture of a solute dissolved in a solvent.", guideRef: "solutions" },
          { id: "elements-compounds-mixtures-mcq-p2-q18", question: "Which mixture can be separated by filtration?", options: ["Salt water", "Sand and water", "Ink dyes", "Two miscible liquids"], answerIndex: 1, hint: "Need an insoluble solid.", explanation: "Filtration works for insoluble solids like sand in water; dissolved salt passes through.", guideRef: "filtration-evaporation" },
          { id: "elements-compounds-mixtures-mcq-p2-q19", question: "The solid left on the filter paper is called the...", options: ["Filtrate", "Residue", "Solvent", "Distillate"], answerIndex: 1, hint: "It stays behind.", explanation: "The residue is the solid trapped on the paper.", guideRef: "filtration-evaporation" },
          { id: "elements-compounds-mixtures-mcq-p2-q20", question: "Which gives larger, purer crystals of a dissolved solid?", options: ["Fast boiling dry", "Slow crystallisation on cooling", "Filtration", "Chromatography"], answerIndex: 1, hint: "Cooling slowly.", explanation: "Slow crystallisation gives neater, purer crystals than boiling everything off quickly.", guideRef: "filtration-evaporation" },
          { id: "elements-compounds-mixtures-mcq-p2-q21", question: "The main difference between evaporation and distillation is that distillation...", options: ["Keeps the solid", "Collects the liquid", "Needs no heat", "Uses filter paper"], answerIndex: 1, hint: "Which product do you keep?", explanation: "Distillation collects the pure liquid; evaporation keeps the solid.", guideRef: "distillation-chromatography" },
          { id: "elements-compounds-mixtures-mcq-p2-q22", question: "In fractional distillation, the liquid collected first has the...", options: ["Highest boiling point", "Lowest boiling point", "Largest molecules", "Most colour"], answerIndex: 1, hint: "Easiest to boil off.", explanation: "The lowest boiling point liquid boils off and is collected first at the top of the column.", guideRef: "distillation-chromatography" },
          { id: "elements-compounds-mixtures-mcq-p2-q23", question: "Air can be separated into oxygen and nitrogen by...", options: ["Filtration", "Chromatography", "Fractional distillation", "Crystallisation"], answerIndex: 2, hint: "Liquefied air, different boiling points.", explanation: "Liquefied air is separated by fractional distillation because the gases have different boiling points.", guideRef: "distillation-chromatography" },
          { id: "elements-compounds-mixtures-mcq-p2-q24", question: "In paper chromatography, a dye that is more soluble in the solvent will...", options: ["Stay at the start", "Travel further up the paper", "Sink down", "Disappear"], answerIndex: 1, hint: "More soluble = carried further.", explanation: "A more soluble dye is carried further up the paper by the solvent.", guideRef: "distillation-chromatography" },
          { id: "elements-compounds-mixtures-mcq-p2-q25", question: "Steel is iron mixed with a little carbon. Steel is a(n)...", options: ["Compound", "Element", "Alloy (mixture)", "Solution"], answerIndex: 2, hint: "Metals/carbon mixed, not bonded.", explanation: "Steel is an alloy, a mixture, not a compound.", guideRef: "mixtures" },
        ],
      },
    ],
    qaPapers: [],
  },
};
