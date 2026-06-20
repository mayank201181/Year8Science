import type { Topic } from "../types";

export const photosynthesis: Topic = {
  id: "photosynthesis",
  title: "Plants & Photosynthesis",
  subject: "Biology",
  icon: "🌱",
  summary: "How green plants make their own food from light.",
  intro:
    "Almost all life on Earth is powered by sunlight, and green plants are the gateway that lets that energy in. In photosynthesis, plants use light energy to build sugar from two simple raw materials — carbon dioxide and water — and they release the oxygen we breathe as a by-product. Understand this one reaction and you understand where your food, your fuel, and the air in your lungs all come from.",

  guide: [
    {
      id: "big-idea",
      heading: "The big idea: making food from light",
      body:
        "**Photosynthesis** is the process green plants use to make their own food (the sugar **glucose**) using **light energy**. The word means \"building with light\" (*photo* = light, *synthesis* = making).\n\nPlants are **producers**: they do not eat, they build food from scratch. To do this they need three things — light, **carbon dioxide** (a gas from the air) and **water** (taken from the soil). Light energy is captured by a green pigment called **chlorophyll** and used to join carbon dioxide and water together into glucose. **Oxygen** is released as a waste product.\n\nThe energy stored in glucose can later be released by **respiration** to power the plant's life processes, so photosynthesis is really about **trapping light energy and storing it as chemical energy** in food.\n\n- Raw materials: carbon dioxide + water\n- Energy source: light (absorbed by chlorophyll)\n- Products: glucose + oxygen",
      diagram:
        '<svg viewBox="0 0 320 150" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Inputs and outputs of photosynthesis"><defs><marker id="ph1" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#1e3a8a"/></marker></defs><circle cx="40" cy="30" r="18" fill="#fde68a" stroke="#f59e0b"/><text x="40" y="34" font-size="9" text-anchor="middle" fill="#92400e">light</text><rect x="10" y="70" width="70" height="24" rx="5" fill="#dbeafe" stroke="#3b82f6"/><text x="45" y="86" font-size="9" text-anchor="middle" fill="#1e3a8a">CO2</text><rect x="10" y="104" width="70" height="24" rx="5" fill="#dbeafe" stroke="#3b82f6"/><text x="45" y="120" font-size="9" text-anchor="middle" fill="#1e3a8a">water</text><rect x="120" y="55" width="80" height="60" rx="8" fill="#dcfce7" stroke="#22c55e"/><text x="160" y="80" font-size="9" text-anchor="middle" fill="#14532d">green leaf</text><text x="160" y="95" font-size="8" text-anchor="middle" fill="#14532d">chlorophyll</text><line x1="80" y1="82" x2="118" y2="78" stroke="#1e3a8a" stroke-width="2" marker-end="url(#ph1)"/><line x1="80" y1="116" x2="118" y2="95" stroke="#1e3a8a" stroke-width="2" marker-end="url(#ph1)"/><line x1="48" y1="46" x2="125" y2="60" stroke="#f59e0b" stroke-width="2" marker-end="url(#ph1)"/><rect x="240" y="58" width="70" height="24" rx="5" fill="#fef3c7" stroke="#f59e0b"/><text x="275" y="74" font-size="9" text-anchor="middle" fill="#92400e">glucose</text><rect x="240" y="92" width="70" height="24" rx="5" fill="#e0f2fe" stroke="#0284c7"/><text x="275" y="108" font-size="9" text-anchor="middle" fill="#075985">oxygen</text><line x1="200" y1="78" x2="238" y2="70" stroke="#1e3a8a" stroke-width="2" marker-end="url(#ph1)"/><line x1="200" y1="92" x2="238" y2="104" stroke="#1e3a8a" stroke-width="2" marker-end="url(#ph1)"/></svg>',
      diagramCaption: "Light, carbon dioxide and water go in; glucose and oxygen come out.",
      keyPoints: [
        "Photosynthesis makes glucose using light energy.",
        "Raw materials are carbon dioxide and water.",
        "Oxygen is released as a by-product.",
        "Plants are producers — they make their own food.",
      ],
      thinkDeeper:
        "A plant kept in total darkness for two weeks slowly dies even though it has plenty of water and air. Using the idea of energy, explain exactly which step has stopped and why water and air alone cannot keep it alive.",
    },
    {
      id: "equations",
      heading: "The word and symbol equations",
      body:
        "Scientists summarise photosynthesis with equations. The **word equation** is:\n\n**carbon dioxide + water → glucose + oxygen** (using light energy and chlorophyll).\n\nLight and chlorophyll are written above or beside the arrow because they are *needed* but are not used up like raw materials — chlorophyll is a catalyst-like helper and light is the energy source.\n\nThe **balanced symbol equation** is:\n\n**6CO2 + 6H2O → C6H12O6 + 6O2**\n\nCheck that it balances: there are 6 carbon, 18 oxygen and 12 hydrogen atoms on each side. The big number (6) in front is a **coefficient** telling you how many molecules; the small numbers are how many atoms are in one molecule.\n\n- Glucose has the formula C6H12O6.\n- You need 6 molecules of carbon dioxide and 6 of water to make 1 molecule of glucose.\n- The 6 oxygen molecules (O2) released come mostly from the water.",
      diagram:
        '<svg viewBox="0 0 320 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Balanced symbol equation for photosynthesis"><defs><marker id="ph2" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="#14532d"/></marker></defs><rect x="6" y="40" width="90" height="34" rx="6" fill="#dbeafe" stroke="#3b82f6"/><text x="51" y="62" font-size="12" text-anchor="middle" fill="#1e3a8a">6CO2 + 6H2O</text><line x1="100" y1="57" x2="160" y2="57" stroke="#14532d" stroke-width="2" marker-end="url(#ph2)"/><text x="130" y="48" font-size="8" text-anchor="middle" fill="#92400e">light</text><text x="130" y="74" font-size="8" text-anchor="middle" fill="#14532d">chlorophyll</text><rect x="166" y="40" width="148" height="34" rx="6" fill="#dcfce7" stroke="#22c55e"/><text x="240" y="62" font-size="12" text-anchor="middle" fill="#14532d">C6H12O6 + 6O2</text><text x="160" y="100" font-size="9" text-anchor="middle" fill="#475569">C:6 H:12 O:18 on each side — balanced</text></svg>',
      diagramCaption: "The balanced equation: count the atoms — both sides match.",
      keyPoints: [
        "Word equation: carbon dioxide + water → glucose + oxygen.",
        "Symbol equation: 6CO2 + 6H2O → C6H12O6 + 6O2.",
        "Light and chlorophyll go over the arrow — needed but not used up.",
        "The equation is balanced: same atoms on both sides.",
      ],
      thinkDeeper:
        "A student writes 'CO2 + H2O → C6H12O6 + O2' and says it is correct because all the right substances appear. Why is this not acceptable in chemistry, and what does balancing actually guarantee about atoms?",
    },
    {
      id: "chloroplasts",
      heading: "Chlorophyll and chloroplasts: why leaves are green",
      body:
        "Photosynthesis happens inside tiny structures called **chloroplasts**, found mainly in leaf cells. Each chloroplast is packed with the green pigment **chlorophyll**.\n\nChlorophyll's job is to **absorb light energy**. It absorbs red and blue light strongly but **reflects green light** — and the green light that bounces back is what reaches your eyes. That is why healthy leaves look green: not because green is used, but because green is the colour the plant *rejects*.\n\nBecause chloroplasts need light, leaf cells near the top surface of the leaf (the **palisade** cells) are long, packed tightly and crammed full of chloroplasts to catch as much light as possible.\n\n- Chloroplast = the structure where photosynthesis happens.\n- Chlorophyll = the green pigment inside it that absorbs light.\n- Leaves look green because chlorophyll reflects green light.",
      diagram:
        '<svg viewBox="0 0 300 140" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A plant cell containing chloroplasts"><rect x="20" y="20" width="170" height="100" rx="8" fill="#ecfccb" stroke="#65a30d" stroke-width="3"/><text x="105" y="16" font-size="9" text-anchor="middle" fill="#3f6212">cell wall</text><ellipse cx="70" cy="55" rx="18" ry="11" fill="#22c55e" stroke="#15803d"/><ellipse cx="120" cy="80" rx="18" ry="11" fill="#22c55e" stroke="#15803d"/><ellipse cx="90" cy="100" rx="18" ry="11" fill="#22c55e" stroke="#15803d"/><line x1="138" y1="78" x2="210" y2="60" stroke="#15803d" stroke-width="1.5"/><text x="255" y="62" font-size="10" text-anchor="middle" fill="#15803d">chloroplast</text><text x="255" y="76" font-size="8" text-anchor="middle" fill="#15803d">(holds chlorophyll)</text></svg>',
      diagramCaption: "Green chloroplasts inside a leaf cell — each full of light-absorbing chlorophyll.",
      keyPoints: [
        "Chloroplasts are where photosynthesis occurs.",
        "Chlorophyll absorbs light energy, mainly red and blue.",
        "Leaves look green because chlorophyll reflects green light.",
      ],
      thinkDeeper:
        "Some plants grown under pure green light grow very poorly. Using what chlorophyll absorbs and reflects, explain why green light is almost the worst colour to give a plant.",
    },
    {
      id: "leaf-structure",
      heading: "Leaf structure and adaptations",
      body:
        "A leaf is a superbly designed solar panel and gas-exchange surface. Each part is **adapted** to help photosynthesis:\n\n- **Large, flat surface area** — catches as much light as possible and lets gases diffuse in and out.\n- **Waxy cuticle** — a clear, waterproof layer on top that stops water loss but lets light through.\n- **Palisade mesophyll** — column-shaped cells near the top, packed with chloroplasts, where most photosynthesis happens.\n- **Spongy mesophyll** — loosely packed cells below with **air spaces** so carbon dioxide can diffuse to all the cells.\n- **Stomata** (singular *stoma*) — tiny pores, mostly on the underside, that let carbon dioxide in and oxygen out.\n- **Guard cells** — surround each stoma and change shape to open or close it, controlling gas exchange and water loss.\n- **Veins** containing **xylem** (carries water in) and **phloem** (carries glucose away as sugars).\n\nThe thin shape means gases do not have far to travel, and the upper palisade layer gets first access to the light.",
      diagram:
        '<svg viewBox="0 0 320 170" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Cross-section of a leaf"><rect x="20" y="20" width="280" height="14" fill="#bbf7d0" stroke="#16a34a"/><text x="312" y="30" font-size="8" text-anchor="end" fill="#166534">cuticle</text><rect x="20" y="34" width="280" height="18" fill="#dcfce7" stroke="#16a34a"/><text x="312" y="47" font-size="8" text-anchor="end" fill="#166534">upper epidermis</text><g fill="#22c55e" stroke="#15803d"><rect x="24" y="54" width="14" height="38"/><rect x="42" y="54" width="14" height="38"/><rect x="60" y="54" width="14" height="38"/><rect x="78" y="54" width="14" height="38"/></g><text x="200" y="76" font-size="8" fill="#166534">palisade mesophyll</text><circle cx="40" cy="110" r="9" fill="#86efac" stroke="#15803d"/><circle cx="70" cy="118" r="9" fill="#86efac" stroke="#15803d"/><circle cx="100" cy="108" r="9" fill="#86efac" stroke="#15803d"/><text x="200" y="115" font-size="8" fill="#166534">spongy mesophyll (air spaces)</text><rect x="20" y="132" width="280" height="16" fill="#dcfce7" stroke="#16a34a"/><text x="312" y="144" font-size="8" text-anchor="end" fill="#166534">lower epidermis</text><circle cx="120" cy="148" r="6" fill="#fff" stroke="#15803d"/><circle cx="135" cy="148" r="6" fill="#fff" stroke="#15803d"/><text x="160" y="164" font-size="8" fill="#166534">stoma + guard cells</text></svg>',
      diagramCaption: "A cross-section of a leaf showing each layer and its role.",
      keyPoints: [
        "Palisade cells (top) are packed with chloroplasts to absorb light.",
        "Stomata let CO2 in and O2 out; guard cells open and close them.",
        "Xylem brings water in; phloem carries sugars away.",
        "Large flat shape and air spaces speed up light capture and diffusion.",
      ],
      thinkDeeper:
        "Stomata are mostly on the shaded underside of the leaf, not the sunny top. Suggest why this position helps the plant balance getting carbon dioxide against losing water.",
    },
    {
      id: "raw-materials",
      heading: "Getting the raw materials in",
      body:
        "For photosynthesis a plant must continuously bring in **carbon dioxide** and **water** and remove **oxygen**.\n\n**Carbon dioxide** comes from the air. It enters the leaf through the **stomata** by **diffusion** — the movement of a substance from where it is more concentrated (outside) to where it is less concentrated (inside the leaf, because photosynthesis keeps using it up). No energy is needed for diffusion.\n\n**Water** comes from the soil. **Root hair cells** absorb it, and it travels up the stem and into the leaf through **xylem** vessels — long, hollow tubes. The pull that lifts water up is created as water evaporates from the leaf (**transpiration**).\n\n**Oxygen**, the waste product, diffuses out of the leaf through the same stomata.\n\n- CO2 in: through stomata, by diffusion.\n- Water in: from roots, up the xylem.\n- O2 out: through stomata, by diffusion.",
      diagram:
        '<svg viewBox="0 0 300 170" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="How raw materials reach the leaf"><defs><marker id="ph5" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#1e3a8a"/></marker></defs><ellipse cx="150" cy="40" rx="70" ry="26" fill="#dcfce7" stroke="#16a34a"/><text x="150" y="44" font-size="10" text-anchor="middle" fill="#166534">leaf</text><line x1="150" y1="66" x2="150" y2="150" stroke="#65a30d" stroke-width="6"/><text x="160" y="110" font-size="8" fill="#3f6212">xylem (water up)</text><path d="M150 150 L120 165 M150 150 L150 168 M150 150 L180 165" stroke="#a16207" stroke-width="3" fill="none"/><line x1="60" y1="40" x2="80" y2="40" stroke="#1e3a8a" stroke-width="2" marker-end="url(#ph5)"/><text x="40" y="43" font-size="8" text-anchor="middle" fill="#1e3a8a">CO2</text><line x1="240" y1="40" x2="220" y2="40" stroke="#0284c7" stroke-width="2" marker-end="url(#ph5)"/><text x="262" y="43" font-size="8" text-anchor="middle" fill="#075985">O2 out</text><line x1="135" y1="155" x2="143" y2="120" stroke="#3b82f6" stroke-width="2" marker-end="url(#ph5)"/><text x="110" y="150" font-size="8" fill="#3b82f6">water from roots</text></svg>',
      diagramCaption: "Carbon dioxide diffuses in through stomata; water rises through xylem; oxygen diffuses out.",
      keyPoints: [
        "Carbon dioxide enters by diffusion through the stomata.",
        "Water is absorbed by roots and carried up in the xylem.",
        "Oxygen leaves by diffusion through the stomata.",
        "Diffusion needs no energy — it follows the concentration gradient.",
      ],
      thinkDeeper:
        "On a bright, busy afternoon a leaf uses carbon dioxide very fast. Explain how this high usage actually helps even more carbon dioxide diffuse in, using the idea of concentration gradient.",
    },
    {
      id: "products",
      heading: "What happens to the glucose",
      body:
        "The **glucose** a plant makes is incredibly useful, and it is put to several jobs:\n\n- **Respiration** — glucose is broken down (with oxygen) to release energy for the plant's living processes, day and night.\n- **Stored as starch** — spare glucose is turned into **starch**, an insoluble store, kept in leaves, stems and seeds. Being insoluble, starch does not affect the cell's water balance, making it a perfect store.\n- **Made into cellulose** — glucose is built into **cellulose**, the tough fibre that makes strong cell walls so the plant can grow and stand up.\n- **Making other substances** — combined with minerals from the soil (such as **nitrates**) glucose is used to build proteins, oils and other molecules.\n\nThe **oxygen** produced is mostly released to the air, though the plant also uses some for its own respiration.\n\nSo photosynthesis does not just feed the plant — it provides the raw building material for the plant's whole body.",
      diagram:
        '<svg viewBox="0 0 320 150" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Uses of glucose in a plant"><defs><marker id="ph6" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#92400e"/></marker></defs><circle cx="60" cy="75" r="30" fill="#fef3c7" stroke="#f59e0b"/><text x="60" y="79" font-size="10" text-anchor="middle" fill="#92400e">glucose</text><line x1="90" y1="60" x2="150" y2="30" stroke="#92400e" stroke-width="2" marker-end="url(#ph6)"/><rect x="152" y="18" width="120" height="24" rx="5" fill="#fee2e2" stroke="#ef4444"/><text x="212" y="34" font-size="9" text-anchor="middle" fill="#991b1b">respiration (energy)</text><line x1="92" y1="70" x2="150" y2="62" stroke="#92400e" stroke-width="2" marker-end="url(#ph6)"/><rect x="152" y="50" width="120" height="24" rx="5" fill="#e0e7ff" stroke="#6366f1"/><text x="212" y="66" font-size="9" text-anchor="middle" fill="#3730a3">stored as starch</text><line x1="92" y1="82" x2="150" y2="94" stroke="#92400e" stroke-width="2" marker-end="url(#ph6)"/><rect x="152" y="82" width="120" height="24" rx="5" fill="#dcfce7" stroke="#22c55e"/><text x="212" y="98" font-size="9" text-anchor="middle" fill="#166534">cellulose (cell walls)</text><line x1="88" y1="92" x2="150" y2="126" stroke="#92400e" stroke-width="2" marker-end="url(#ph6)"/><rect x="152" y="114" width="120" height="24" rx="5" fill="#fae8ff" stroke="#a855f7"/><text x="212" y="130" font-size="9" text-anchor="middle" fill="#6b21a8">proteins (with nitrates)</text></svg>',
      diagramCaption: "Glucose is used for energy, stored as starch, built into cellulose, and made into proteins.",
      keyPoints: [
        "Glucose is used in respiration to release energy.",
        "Spare glucose is stored as insoluble starch.",
        "Glucose is built into cellulose for cell walls.",
        "With nitrates from the soil, glucose helps make proteins.",
      ],
      thinkDeeper:
        "Plants store food as starch rather than as glucose. Using the words 'insoluble' and 'water', explain why storing the soluble glucose directly would be a problem for the cell.",
    },
    {
      id: "limiting-factors",
      heading: "Limiting factors: light, CO2 and temperature",
      body:
        "Photosynthesis can only go as fast as conditions allow. A **limiting factor** is the one thing in shortest supply that is holding the rate back — increase it and the rate rises; increase something else and nothing changes.\n\nThree main limiting factors:\n\n- **Light intensity** — more light means more energy for the reaction, so the rate rises. But only up to a point: eventually something else becomes limiting and the graph levels off (a **plateau**).\n- **Carbon dioxide concentration** — more CO2 means more raw material. The rate rises then plateaus once light or temperature limits it. CO2 is often the main limiting factor in normal air.\n- **Temperature** — photosynthesis relies on **enzymes**, so a warmer temperature speeds it up. But above about 40 to 45 degrees Celsius the enzymes **denature** (their shape is destroyed) and the rate crashes.\n\nOn a graph, look for the **rising part** (the factor is limiting) and the **flat part** (something else has taken over). At the plateau, adding more of that factor does nothing.",
      diagram:
        '<svg viewBox="0 0 300 160" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Graph of rate against light intensity"><line x1="40" y1="20" x2="40" y2="130" stroke="#334155" stroke-width="2"/><line x1="40" y1="130" x2="280" y2="130" stroke="#334155" stroke-width="2"/><text x="20" y="80" font-size="9" fill="#334155" transform="rotate(-90 20 80)">rate</text><text x="150" y="150" font-size="9" text-anchor="middle" fill="#334155">light intensity</text><path d="M40 130 Q90 60 150 50 L260 50" fill="none" stroke="#16a34a" stroke-width="3"/><line x1="150" y1="50" x2="150" y2="130" stroke="#94a3b8" stroke-width="1" stroke-dasharray="3"/><text x="95" y="40" font-size="8" fill="#16a34a">light limiting</text><text x="210" y="42" font-size="8" fill="#16a34a">plateau</text></svg>',
      diagramCaption: "Rate rises with light, then plateaus when another factor becomes limiting.",
      keyPoints: [
        "A limiting factor is whatever is in shortest supply, holding back the rate.",
        "Light, CO2 and temperature are the three main limiting factors.",
        "Graphs rise then plateau when a different factor takes over.",
        "Too hot denatures the enzymes and the rate falls.",
      ],
      thinkDeeper:
        "A grower increases the light in a greenhouse but the rate of photosynthesis does not change at all. List the two things that could now be the limiting factor, and describe a test to find out which one it is.",
    },
    {
      id: "starch-test",
      heading: "Testing a leaf for starch",
      body:
        "Because a plant turns spare glucose into **starch**, we can test a leaf for starch to prove photosynthesis has happened. **Iodine solution** turns from orange-brown to **blue-black** when starch is present.\n\nThe method:\n\n1. **Boil the leaf in water** — this kills the leaf and breaks down the cell membranes so iodine can get in.\n2. **Boil the leaf in ethanol** (with the Bunsen turned off and using a water bath, because ethanol is flammable) — this removes the green **chlorophyll** so colour changes are easy to see.\n3. **Dip in warm water** to soften the now brittle leaf.\n4. **Add iodine solution** — areas with starch turn **blue-black**; areas without stay orange-brown.\n\nFirst the plant is **destarched** (left in the dark for 1 to 2 days) so any starch found must have been made during the experiment. Then controlled experiments can show what photosynthesis needs:\n\n- **Variegated leaf** (green and white parts): only the green parts turn blue-black, proving **chlorophyll** is needed.\n- **Strip of leaf covered with foil** (no light): the covered part stays orange-brown, proving **light** is needed.\n- **Leaf sealed in a flask with soda lime** (no CO2): the leaf stays orange-brown, proving **carbon dioxide** is needed.",
      diagram:
        '<svg viewBox="0 0 320 150" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Starch test steps"><defs><marker id="ph8" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#334155"/></marker></defs><rect x="6" y="50" width="60" height="40" rx="4" fill="#dbeafe" stroke="#3b82f6"/><text x="36" y="68" font-size="8" text-anchor="middle" fill="#1e3a8a">boil in</text><text x="36" y="80" font-size="8" text-anchor="middle" fill="#1e3a8a">water</text><line x1="66" y1="70" x2="86" y2="70" stroke="#334155" stroke-width="2" marker-end="url(#ph8)"/><rect x="88" y="50" width="60" height="40" rx="4" fill="#fef3c7" stroke="#f59e0b"/><text x="118" y="66" font-size="8" text-anchor="middle" fill="#92400e">boil in</text><text x="118" y="78" font-size="8" text-anchor="middle" fill="#92400e">ethanol</text><line x1="148" y1="70" x2="168" y2="70" stroke="#334155" stroke-width="2" marker-end="url(#ph8)"/><rect x="170" y="50" width="60" height="40" rx="4" fill="#e0f2fe" stroke="#0284c7"/><text x="200" y="66" font-size="8" text-anchor="middle" fill="#075985">rinse,</text><text x="200" y="78" font-size="8" text-anchor="middle" fill="#075985">soften</text><line x1="230" y1="70" x2="250" y2="70" stroke="#334155" stroke-width="2" marker-end="url(#ph8)"/><rect x="252" y="50" width="62" height="40" rx="4" fill="#1e293b" stroke="#0f172a"/><text x="283" y="66" font-size="8" text-anchor="middle" fill="#fff">iodine:</text><text x="283" y="78" font-size="8" text-anchor="middle" fill="#fff">blue-black</text><text x="160" y="120" font-size="8" text-anchor="middle" fill="#475569">blue-black = starch present = photosynthesis happened</text></svg>',
      diagramCaption: "The starch test: boil in water, remove chlorophyll with ethanol, then add iodine.",
      keyPoints: [
        "Iodine turns blue-black with starch, staying orange-brown without it.",
        "Ethanol removes chlorophyll so the colour change is visible.",
        "Destarch in the dark first, so new starch proves photosynthesis.",
        "Variegated, foil-covered and no-CO2 leaves test chlorophyll, light and CO2.",
      ],
      thinkDeeper:
        "Why is destarching the plant first absolutely essential? Describe what wrong conclusion you might reach about a foil-covered leaf if you skipped the destarching step.",
    },
    {
      id: "importance-respiration",
      heading: "Why it matters, and the link to respiration",
      body:
        "Photosynthesis is the foundation of almost all life on Earth.\n\n- It is the **start of nearly every food chain**: producers (plants) trap light energy as food, which is then passed to herbivores, then carnivores. Without producers there would be no food for anything else.\n- It puts the **oxygen** into our atmosphere. The oxygen you are breathing right now was released by plants, algae and other photosynthesisers.\n- It removes **carbon dioxide** from the air, helping to control the greenhouse effect.\n\nPhotosynthesis and **respiration** are closely linked — in fact they are almost **opposites**:\n\n- Photosynthesis: CO2 + water → glucose + oxygen (stores energy, needs light).\n- Respiration: glucose + oxygen → CO2 + water (releases energy, happens all the time).\n\nIn daylight a plant does both, but on a bright day it photosynthesises **faster** than it respires, so overall it takes in CO2 and gives out O2. At night, only respiration happens, so a plant gives out CO2.\n\nThe point where photosynthesis exactly cancels respiration (no net gas exchange) is called the **compensation point**.",
      diagram:
        '<svg viewBox="0 0 320 150" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Photosynthesis and respiration as opposite processes"><defs><marker id="ph9" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#334155"/></marker></defs><rect x="20" y="30" width="110" height="34" rx="6" fill="#dbeafe" stroke="#3b82f6"/><text x="75" y="51" font-size="9" text-anchor="middle" fill="#1e3a8a">CO2 + water</text><rect x="190" y="30" width="110" height="34" rx="6" fill="#dcfce7" stroke="#22c55e"/><text x="245" y="51" font-size="9" text-anchor="middle" fill="#166534">glucose + O2</text><line x1="130" y1="42" x2="188" y2="42" stroke="#16a34a" stroke-width="2" marker-end="url(#ph9)"/><text x="159" y="34" font-size="8" text-anchor="middle" fill="#16a34a">photosynthesis</text><line x1="190" y1="56" x2="132" y2="56" stroke="#ef4444" stroke-width="2" marker-end="url(#ph9)"/><text x="159" y="72" font-size="8" text-anchor="middle" fill="#b91c1c">respiration</text><text x="160" y="110" font-size="8" text-anchor="middle" fill="#475569">opposite reactions: one stores energy, one releases it</text></svg>',
      diagramCaption: "Photosynthesis and respiration are opposite reactions that cycle the same substances.",
      keyPoints: [
        "Photosynthesis begins almost every food chain.",
        "It supplies the oxygen in the atmosphere and removes CO2.",
        "Respiration is essentially the reverse of photosynthesis.",
        "By day a plant photosynthesises faster than it respires; by night only respiration occurs.",
      ],
      thinkDeeper:
        "At dawn and dusk a plant releases no net oxygen or carbon dioxide. Explain what must be true about its two processes at that exact moment, and why this point shifts as the sun gets brighter.",
    },
  ],

  mnemonics: [
    {
      topic: "Raw materials and products of photosynthesis",
      device: "\"Cars Won't Go On Grass\"",
      explanation: "Carbon dioxide + Water → Glucose + Oxygen. The reactants come first, the products after the arrow.",
    },
    {
      topic: "The three limiting factors",
      device: "\"Light Cools Things\"",
      explanation: "Light intensity, Carbon dioxide concentration and Temperature are the three things that can limit the rate.",
    },
    {
      topic: "Starch test order",
      device: "\"We End With Iodine\" — Water, Ethanol, Warm water, Iodine",
      explanation: "Boil in Water (kill leaf), boil in Ethanol (remove chlorophyll), dip in Warm water (soften), add Iodine (test).",
    },
    {
      topic: "Uses of glucose",
      device: "\"Really Sweet Crunchy Plants\"",
      explanation: "Respiration, Starch (storage), Cellulose (cell walls), Proteins (with nitrates).",
    },
  ],

  examMistakes: [
    "Writing that plants 'take in oxygen and give out carbon dioxide' for photosynthesis — that is respiration; photosynthesis is the other way round.",
    "Saying plants only respire at night. Plants respire all the time, day and night; in daylight photosynthesis just outpaces it.",
    "Forgetting the large numbers in the balanced equation (writing CO2 + H2O → C6H12O6 + O2 instead of 6CO2 + 6H2O → C6H12O6 + 6O2).",
    "Saying chlorophyll absorbs green light. It reflects green light — that is why leaves look green — and absorbs mainly red and blue.",
    "Confusing chlorophyll (the green pigment) with chloroplast (the structure that contains it).",
    "In the starch test, forgetting that ethanol must be heated in a water bath with the flame off because it is flammable.",
    "Writing 'sunlight' as a reactant in the equation. Light is the energy source written over the arrow, not a substance that is used up.",
    "Saying a graph 'plateaus because the plant is full'. It plateaus because another factor has become limiting.",
  ],

  misconceptions: [
    {
      wrong: "Plants get their food from the soil through their roots.",
      right: "Plants make their own food (glucose) by photosynthesis in their leaves. From the soil they only take water and a few minerals.",
    },
    {
      wrong: "Plants photosynthesise instead of respiring.",
      right: "Plants do both. They respire constantly to release energy, and photosynthesise when there is light to make food.",
    },
    {
      wrong: "Chlorophyll absorbs green light because leaves are green.",
      right: "Chlorophyll reflects green light (so leaves look green) and absorbs mainly red and blue light.",
    },
    {
      wrong: "The oxygen released comes from the carbon dioxide.",
      right: "Most of the oxygen released comes from splitting water molecules, not from the carbon dioxide.",
    },
    {
      wrong: "More light always means faster photosynthesis.",
      right: "Only up to a point. Eventually CO2 or temperature becomes the limiting factor and the rate stops rising.",
    },
    {
      wrong: "Plants gain their mass mostly from the soil they grow in.",
      right: "Most of a plant's dry mass comes from carbon dioxide in the air, fixed into glucose by photosynthesis.",
    },
  ],

  expertDebates: [
    {
      question: "Could we engineer crops that photosynthesise more efficiently?",
      detail: "Photosynthesis is surprisingly inefficient — most plants convert only about 1 to 2 percent of the light energy that reaches them into food. Scientists are trying to improve the enzyme Rubisco and copy the faster 'C4' system of plants like maize into rice, which could raise yields and help feed a growing world.",
    },
    {
      question: "Where exactly does the released oxygen come from?",
      detail: "For a long time people assumed the oxygen came from carbon dioxide. Experiments using a heavy form of oxygen as a tracer showed that almost all the released oxygen actually comes from the water molecules being split — a subtle point that textbooks sometimes still get wrong.",
    },
    {
      question: "Can we build 'artificial leaves' to make fuel from sunlight?",
      detail: "Researchers are designing devices that, like a leaf, use sunlight to split water and combine carbon dioxide into fuel. If it can be made cheap and efficient, artificial photosynthesis could store solar energy as a clean fuel — but matching the elegance of a real leaf is extremely hard.",
    },
  ],

  realWorld: [
    { title: "The food on your plate", detail: "Every meal traces back to photosynthesis — plants directly, or animals that ate plants. It is the first link in nearly every food chain.", emoji: "🍎" },
    { title: "The oxygen you breathe", detail: "The oxygen in every breath was released by photosynthesising plants, algae and bacteria. Forests and ocean plankton are the planet's lungs.", emoji: "🫁" },
    { title: "Greenhouses and growers", detail: "Commercial growers pump in extra carbon dioxide, add lamps and control temperature to push photosynthesis to its maximum and grow more food faster.", emoji: "🏡" },
    { title: "Tackling climate change", detail: "Planting trees and protecting forests removes carbon dioxide from the air through photosynthesis, helping to slow global warming.", emoji: "🌍" },
    { title: "Fossil fuels", detail: "Coal, oil and gas are the remains of ancient plants and plankton. The energy we burn today was trapped from sunlight by photosynthesis millions of years ago.", emoji: "⛽" },
    { title: "Biofuels", detail: "Crops like sugar cane and algae are grown to make fuels such as bioethanol — storing today's sunlight as energy we can drive on.", emoji: "🚗" },
  ],

  flashcards: [
    { front: "Word equation for photosynthesis?", back: "Carbon dioxide + water → glucose + oxygen (using light and chlorophyll)." },
    { front: "Balanced symbol equation?", back: "6CO2 + 6H2O → C6H12O6 + 6O2." },
    { front: "What is chlorophyll?", back: "The green pigment in chloroplasts that absorbs light energy for photosynthesis." },
    { front: "Why are leaves green?", back: "Chlorophyll reflects green light (and absorbs red and blue)." },
    { front: "Where does photosynthesis happen?", back: "In chloroplasts, mainly in the palisade mesophyll cells of the leaf." },
    { front: "How does carbon dioxide enter a leaf?", back: "By diffusion through the stomata." },
    { front: "How does water reach the leaf?", back: "Absorbed by roots and carried up the stem in the xylem." },
    { front: "What is a limiting factor?", back: "The factor in shortest supply that holds back the rate of photosynthesis." },
    { front: "Name the three main limiting factors.", back: "Light intensity, carbon dioxide concentration and temperature." },
    { front: "What does iodine do in the starch test?", back: "Turns from orange-brown to blue-black where starch is present." },
    { front: "Why boil a leaf in ethanol?", back: "To remove the chlorophyll so the iodine colour change can be seen." },
    { front: "Why destarch a plant before an experiment?", back: "So any starch found afterwards must have been made during the experiment." },
    { front: "List four uses of glucose in a plant.", back: "Respiration, storage as starch, building cellulose, and making proteins (with nitrates)." },
    { front: "How are photosynthesis and respiration related?", back: "They are opposite reactions — one stores energy and makes glucose, the other releases energy and breaks it down." },
  ],

  mustKnow: [
    "Write the word and balanced symbol equations for photosynthesis from memory.",
    "Explain the role of chlorophyll and chloroplasts and why leaves are green.",
    "Label a leaf cross-section and explain how each part is adapted for photosynthesis.",
    "Describe how carbon dioxide and water reach the chloroplasts.",
    "List the uses of glucose, including why it is stored as starch.",
    "Identify the limiting factor from a rate graph and explain the rise and plateau.",
    "Describe the starch test, including why ethanol is used and why heating is done safely.",
    "Design controlled experiments to show that light, chlorophyll and CO2 are needed.",
    "Explain why photosynthesis matters for food chains and atmospheric oxygen.",
    "Compare photosynthesis and respiration as opposite processes.",
  ],

  videos: [
    { title: "Photosynthesis explained", channel: "FuseSchool", url: "https://www.youtube.com/results?search_query=fuseschool+photosynthesis" },
    { title: "Photosynthesis and limiting factors", channel: "Cognito", url: "https://www.youtube.com/results?search_query=cognito+photosynthesis+limiting+factors" },
    { title: "Leaf structure and adaptations", channel: "Free Science Lessons", url: "https://www.youtube.com/results?search_query=free+science+lessons+leaf+structure+photosynthesis" },
    { title: "Testing a leaf for starch", channel: "Primrose Kitten", url: "https://www.youtube.com/results?search_query=primrose+kitten+testing+leaf+for+starch+iodine" },
  ],

  quiz: {
    mcq: [
      {
        id: "photosynthesis-q-mcq-1",
        question: "Which row correctly gives the raw materials and products of photosynthesis?",
        options: [
          "Raw materials: glucose + oxygen; products: carbon dioxide + water",
          "Raw materials: carbon dioxide + water; products: glucose + oxygen",
          "Raw materials: oxygen + water; products: glucose + carbon dioxide",
          "Raw materials: carbon dioxide + glucose; products: water + oxygen",
        ],
        answerIndex: 1,
        hint: "What goes in, and what comes out? Think about which gas the plant takes in.",
        explanation: "Photosynthesis uses carbon dioxide and water to make glucose and oxygen. The option starting with glucose + oxygen describes respiration, the reverse reaction.",
        guideRef: "equations",
      },
      {
        id: "photosynthesis-q-mcq-2",
        question: "Why do healthy leaves appear green?",
        options: [
          "Chlorophyll absorbs green light strongly",
          "Chlorophyll reflects green light",
          "Green light is not present in sunlight",
          "Chloroplasts produce a green dye",
        ],
        answerIndex: 1,
        hint: "Leaves look the colour of the light they bounce back, not the light they use.",
        explanation: "Chlorophyll reflects green light to our eyes while absorbing red and blue. The first option is the classic trap: if chlorophyll absorbed green, leaves would not look green.",
        guideRef: "chloroplasts",
      },
      {
        id: "photosynthesis-q-mcq-3",
        question: "A rate-of-photosynthesis graph rises as light increases, then becomes flat. The flat part shows that:",
        options: [
          "the plant has stopped respiring",
          "light is now the limiting factor",
          "another factor, such as CO2 or temperature, is now limiting",
          "the leaf has run out of chlorophyll",
        ],
        answerIndex: 2,
        hint: "If adding more light no longer helps, light cannot be what is holding it back.",
        explanation: "At the plateau, extra light does nothing, so light is no longer limiting — something else (CO2 or temperature) now is. Saying light is still limiting contradicts the flat line.",
        guideRef: "limiting-factors",
      },
      {
        id: "photosynthesis-q-mcq-4",
        question: "In the starch test, why is the leaf boiled in ethanol?",
        options: [
          "To kill the leaf cells",
          "To soften the brittle leaf",
          "To remove the chlorophyll so colour changes show clearly",
          "To add starch to the leaf",
        ],
        answerIndex: 2,
        hint: "Think about what makes the leaf green and why that would hide a colour change.",
        explanation: "Ethanol dissolves out the green chlorophyll so the iodine's blue-black colour is visible. Boiling in water (not ethanol) is what kills the cells, so that option is the trap.",
        guideRef: "starch-test",
      },
    ],
    qa: [
      {
        id: "photosynthesis-q-qa-1",
        question: "State the balanced symbol equation for photosynthesis and explain why light and chlorophyll are written over the arrow.",
        marks: 3,
        hint: "Remember the big numbers, and think about what is 'used up' versus what is 'needed'.",
        modelAnswer: "6CO2 + 6H2O → C6H12O6 + 6O2. Light and chlorophyll are written over the arrow because they are needed for the reaction but are not used up as reactants — light is the energy source and chlorophyll absorbs that light.",
        markScheme: [
          { point: "Correct reactants with coefficients", keywords: ["6co2", "6h2o", "6 co2", "carbon dioxide + water"] },
          { point: "Correct products with coefficients", keywords: ["c6h12o6", "6o2", "glucose", "oxygen"] },
          { point: "Explains light/chlorophyll not used up", keywords: ["not used up", "energy source", "absorbs light", "needed", "catalyst"] },
        ],
        commonError: "Leaving out the large numbers (coefficients) so the equation does not balance.",
        guideRef: "equations",
      },
      {
        id: "photosynthesis-q-qa-2",
        question: "Describe two ways a palisade mesophyll cell is adapted for photosynthesis.",
        marks: 2,
        hint: "Think about its position in the leaf and what it is packed with.",
        modelAnswer: "Palisade cells are near the top surface of the leaf so they receive the most light. They are packed with many chloroplasts containing chlorophyll to absorb as much light as possible, and they are tall and column-shaped so many can be fitted close together near the surface.",
        markScheme: [
          { point: "Near top surface / receives most light", keywords: ["top", "upper", "near surface", "most light"] },
          { point: "Many chloroplasts / packed with chlorophyll", keywords: ["chloroplasts", "chlorophyll", "packed", "absorb light"] },
        ],
        commonError: "Confusing chloroplast and chlorophyll, or describing spongy mesophyll instead.",
        guideRef: "leaf-structure",
      },
      {
        id: "photosynthesis-q-qa-3",
        question: "A leaf is tested for starch. Explain why the plant is first left in the dark for two days, and what result this control allows you to trust.",
        marks: 3,
        hint: "What might already be in the leaf before the experiment starts?",
        modelAnswer: "Leaving the plant in the dark destarches it: with no light it cannot photosynthesise, so it uses up its stored starch. This means the leaf starts with no starch. Then any starch found at the end must have been made during the experiment, so you can trust that a blue-black result really shows photosynthesis happened under the conditions you provided.",
        markScheme: [
          { point: "Dark stops photosynthesis / uses up stored starch", keywords: ["destarch", "no light", "uses up", "removes starch"] },
          { point: "Leaf starts with no starch", keywords: ["no starch", "free of starch", "starts without"] },
          { point: "So new starch proves photosynthesis happened", keywords: ["made during", "new starch", "proves", "valid", "reliable"] },
        ],
        commonError: "Saying the dark 'rests' the plant rather than explaining it removes existing starch.",
        guideRef: "starch-test",
      },
      {
        id: "photosynthesis-q-qa-4",
        question: "Compare photosynthesis and respiration in a plant, and explain what is happening to gases at night.",
        marks: 4,
        hint: "They are opposite reactions; think about which one needs light.",
        modelAnswer: "Photosynthesis uses carbon dioxide and water to make glucose and oxygen, storing energy, and it needs light. Respiration is essentially the opposite: it uses glucose and oxygen to release energy, producing carbon dioxide and water, and it happens all the time. At night there is no light, so photosynthesis stops but respiration continues. The plant therefore takes in oxygen and releases carbon dioxide at night.",
        markScheme: [
          { point: "Photosynthesis: makes glucose/oxygen, needs light", keywords: ["photosynthesis", "glucose", "oxygen", "light", "stores energy"] },
          { point: "Respiration: uses glucose and oxygen, releases energy/CO2", keywords: ["respiration", "releases energy", "carbon dioxide", "uses glucose"] },
          { point: "They are opposite reactions", keywords: ["opposite", "reverse", "reversed"] },
          { point: "At night only respiration: takes in O2, gives out CO2", keywords: ["night", "only respiration", "gives out carbon dioxide", "takes in oxygen"] },
        ],
        commonError: "Claiming plants do not respire at night or only respire at night.",
        guideRef: "importance-respiration",
      },
    ],
  },

  questionBank: {
    mcqPapers: [],
    qaPapers: [],
  },
};
