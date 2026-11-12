"""HAPPILY EVER ATOM, episode 6 ("Just Flatmates"): a mockumentary sitcom that teaches
Elements, Compounds & Mixtures.

An original comedy: a documentary crew follows Arthur, a tired argon atom who runs a matchmaking
agency for atoms in the air of Kavya's kitchen, but never bonds himself (he is a noble gas).
Singles are elements; bonded couples are compounds with brand new personalities (Nate the sodium
and Chloe the chlorine become Sal, table salt); flatmates are mixtures, and they can move out
(separation techniques). Every line has a speaker (`who`, a key of CAST); make_audio.py voices
each speaker differently. Captions show the speaker's name. `pause` adds silence after a line
(comic timing). Content follows lib/topics/elements-compounds-mixtures.ts.
"""

META = {
    "name": "Happily Ever Atom",
    "kicker": "Claude Sitcom · Ep 6 · Elements, Compounds & Mixtures",
    "dek": "A matchmaking agency for atoms, run by the one atom who never bonds. {chapters} scenes.",
    "gap": 0.32,          # shorter gaps between lines than the lessons: dialogue moves fast
    "unit": "Scene",
    "lab": "elements-compounds-mixtures",
    "kit": "sitcom",
    "title": "Claude Sitcom Ep 6: Happily Ever Atom (Elements, Compounds & Mixtures)",
    "h1": "Happily Ever Atom",
}

# voice, speed, caption name
CAST = {
    "narr":   {"voice": "bm_george",  "speed": 0.96, "name": "Narrator"},
    "kavya":  {"voice": "af_sky",     "speed": 1.02, "name": "Kavya"},
    "arthur": {"voice": "am_michael", "speed": 1.0,  "name": "Arthur"},
    "nate":   {"voice": "am_puck",    "speed": 1.12, "name": "Nate"},
    "chloe":  {"voice": "af_nicole",  "speed": 0.98, "name": "Chloe"},
    "sal":    {"voice": "am_fenrir",  "speed": 0.95, "name": "Sal"},
    "nigels": {"voice": "bm_fable",   "speed": 1.0,  "name": "Nigel & Nigel"},
    "sandy":  {"voice": "bf_emma",    "speed": 0.93, "name": "Sandy"},
    "inky":   {"voice": "af_bella",   "speed": 1.08, "name": "Inky"},
}


def L(id, who, text, pause=0.0, say=None):
    line = {"id": id, "who": who, "cap": f"**{CAST[who]['name']}:** {text}", "pause": pause}
    line["say"] = say if say else text.replace("**", "")
    return line


CHAPTERS = [
    {
        "id": "cold", "title": "Cold open", "short": "Cold open", "card": False,
        "lines": [
            L("kavya", "narr", "This is Kavya. She is twelve. It is Saturday, and she has science homework.", 0.2),
            L("homework", "kavya", "'Find twenty things in your kitchen. Element, compound or mixture?' On a Saturday.", 0.5),
            L("bowls", "kavya", "Most of our kitchen is a mixture. Of my brother's dirty bowls.", 0.6),
            L("small", "narr", "But this documentary is not about Kavya. It is about something much, much smaller."),
            L("air", "narr", "Above her noodles drift billions of atoms. Some are looking for a partner."),
            L("agency", "narr", "And this is where they come to find one.", 0.5),
            L("hi", "arthur", "Hi. Arthur. **Argon**. I run the agency.", 0.2),
            L("match", "arthur", "I find atoms their perfect match. They bond. Happily ever after.", 0.2),
            L("me", "arthur", "Me? No. I'm a **noble gas**. I hardly react with anything. I don't bond.", 0.5),
            L("lazy", "arthur", "My name literally means 'lazy', in Greek.", 0.6),
            L("single", "arthur", "I've been single for about four billion years. It's going great.", 0.9),
            L("title", "narr", "Happily Ever Atom. Episode six: Just Flatmates.", 1.2),
        ],
    },
    {
        "id": "singles", "title": "The singles", "short": "Elements",
        "lines": [
            L("open", "narr", "Nine a.m. The agency opens. Every client is single: an **element**.", 0.2),
            L("element", "arthur", "An **element** is made of only **one type of atom**. Gold? Only gold atoms."),
            L("catalogue", "arthur", "There are about **118** of them, all in our catalogue: the **periodic table**.", 0.2,
              say="There are about a hundred and eighteen of them, all in our catalogue: the periodic table."),
            L("simpler", "arthur", "An element **can't be broken down** into anything simpler by a chemical reaction.", 0.4),
            L("nate", "nate", "HI! I'm Nate! **Sodium**! A soft, shiny metal, and I am SO ready to bond!", 0.2,
              say="Hi! I'm Nate! Sodium! A soft, shiny metal, and I am so ready to bond!"),
            L("thnate", "arthur", "Nate is sodium. Very reactive. Banned from every pool in Singapore.", 0.6),
            L("na", "nate", "Name: Nate! **Chemical symbol**: N, A!", 0.6, say="Name: Nate! Chemical symbol: N. A!"),
            L("lower", "arthur", "Small a.", 0.5),
            L("rule", "arthur", "The **first letter is always a capital**. A **second letter is always lower case**."),
            L("big", "arthur", "**Big then small**. Sodium is **Na**. Magnesium is **Mg**. Carbon is just **C**.",
              say="Big, then small. Sodium is capital N, small a. Magnesium is capital M, small g. Carbon is just C."),
            L("cobalt", "arthur", "It matters. The metal **cobalt** is **Co**. But **CO** is **carbon monoxide**: carbon and oxygen, bonded.",
              say="It matters. The metal cobalt is capital C, small o. But capital C, capital O is carbon monoxide: carbon and oxygen, bonded."),
            L("couple", "arthur", "Two capitals isn't a client. It's a couple.", 0.6),
        ],
    },
    {
        "id": "match", "title": "The perfect match", "short": "Compounds",
        "lines": [
            L("chloe", "chloe", "Hello. I'm Chloe. **Chlorine**. A poisonous green gas.", 0.4),
            L("toxic", "chloe", "I'm toxic. It's not a personality. It's a fact.", 0.5),
            L("thchloe", "arthur", "A metal that explodes in water. A poisonous gas. On paper, a disaster. In chemistry? Perfect.", 0.6),
            L("def", "narr", "When atoms of **two or more different elements** are **chemically bonded** together, they make a **compound**."),
            L("bond", "nate", "Here we go! Bonding in three, two, one!", 0.8),
            L("sal", "sal", "Hey. I'm Sal. **Sodium chloride**. Table salt.", 0.4),
            L("food", "sal", "I go on food. I love it there.", 0.6),
            L("where", "kavya", "Wait. Where did the explosive one and the poisonous one go?", 0.2),
            L("props", "arthur", "Still in there. But a **compound** has **different properties** from the elements that make it.", 0.2),
            L("ratio", "arthur", "One sodium for every chlorine. Always. A **fixed ratio**. The **formula** is **NaCl**.",
              say="One sodium for every chlorine. Always. A fixed ratio. The formula is N, A, C, L."),
            L("water", "narr", "Same with water. Hydrogen's an explosive gas. Oxygen helps things burn. Bonded, as **water**, they put fires out.", 0.2),
            L("h2o", "arthur", "Its formula: **H₂O**. The little two counts the atom before it: two hydrogens. No number means one oxygen.",
              say="Its formula: H two O. The little two counts the atom before it: two hydrogens. No number means one oxygen."),
            L("co2", "arthur", "**Carbon dioxide** is **CO₂**. Forget the little two, and you've written carbon monoxide.", 0.2,
              say="Carbon dioxide is C O two. Forget the little two, and you've written carbon monoxide."),
            L("split", "arthur", "Splitting a compound back up takes a **chemical reaction**. Not easy.", 0.2),
            L("happy", "sal", "Relax. We're not splitting up.", 0.8),
        ],
    },
    {
        "id": "flat", "title": "Just flatmates", "short": "Mixtures",
        "lines": [
            L("flat", "narr", "Meanwhile, at Arthur's flat. It's in the air. Literally.", 0.2),
            L("hi", "nigels", "Hello. I'm Nigel.", 0.2),
            L("also", "nigels", "And I'm also Nigel.", 0.6),
            L("thnigels", "arthur", "My flatmates. Two **nitrogen** atoms, joined: a **molecule**.", 0.2),
            L("def", "narr", "A **molecule** is **two or more atoms joined** by chemical bonds."),
            L("ask", "kavya", "So they're bonded. That makes them a compound, right?", 1.2),
            L("no", "arthur", "No.", 0.5),
            L("same", "arthur", "Both nitrogen. Same type of atom, so still an **element**, like **O₂**. A compound needs **different** elements.",
              say="Both nitrogen. Same type of atom, so still an element, like O two. A compound needs different elements."),
            L("lot", "nigels", "We get that a lot.", 0.5),
            L("pictures", "narr", "In **particle pictures**, each circle is an atom, and its **colour** shows its type."),
            L("two", "arthur", "Ask two things. Same atoms, or different? Joined, or just mixed?"),
            L("sbf", "arthur", "All the same: **element**. Different, and bonded: **compound**. Different, but not bonded to each other: **mixture**. **Same, Bonded, Free**.", 0.2),
            L("share", "arthur", "And air? A **mixture**. **78%** nitrogen, **21%** oxygen, about **1%** argon: me. Nobody's bonded to their flatmates. We just share.", 0.2,
              say="And air? A mixture. Seventy-eight percent nitrogen, twenty-one percent oxygen, about one percent argon: me. Nobody's bonded to their flatmates. We just share."),
            L("alloys", "narr", "**Sea water** is a mixture. So are **alloys**: **brass** is copper and zinc, **steel** is iron and carbon."),
            L("brass", "kavya", "Brass looks like one metal, though.", 0.2),
            L("costume", "arthur", "It's a mixture in a very convincing costume.", 0.5),
            L("versus", "arthur", "So. **Compound**: bonded, **fixed ratio**, needs a **chemical reaction** to split. **Mixture**: not bonded, each keeps its **own properties**, **any ratio**, separated by **physical methods**.", 0.5),
        ],
    },
    {
        "id": "swim", "title": "Sal goes for a swim", "short": "Purity & solutions",
        "lines": [
            L("carton", "kavya", "My juice carton says 'one hundred percent pure'. See? Pure.", 0.4),
            L("pure", "arthur", "In chemistry, **pure** means **one element or one compound**, and nothing else. Your juice? A delicious mixture.", 0.5),
            L("melt", "narr", "Test purity with a **melting point**. A pure substance melts at **one sharp temperature**: pure ice, at exactly **0 °C**.",
              say="Test purity with a melting point. A pure substance melts at one sharp temperature: pure ice, at exactly zero degrees Celsius."),
            L("impurity", "sal", "Add me, and I'm an **impurity**. The **melting point goes down**, the **boiling point goes up**, and both spread over a **range**."),
            L("roads", "sal", "That's why cold countries spread me on icy roads.", 0.2),
            L("hot", "kavya", "We don't have icy roads. It's thirty-four degrees.", 0.7),
            L("gone", "kavya", "He's gone! He disappeared!", 0.2),
            L("dissolved", "arthur", "He hasn't disappeared. He's **dissolved**.", 0.2),
            L("words", "arthur", "Sal's the **solute**: what dissolves. Water's the **solvent**: the liquid it's in. Together: a **solution**."),
            L("mass", "arthur", "**10 g** of salt plus **100 g** of water: **110 g** of solution. Nothing destroyed.", 0.2,
              say="Ten grams of salt plus a hundred grams of water: a hundred and ten grams of solution. Nothing destroyed."),
            L("sandy", "sandy", "Hi. Sandy. Sand. I'm **insoluble**. Everyone else goes for a swim. I just sit at the bottom.", 0.6),
            L("saturated", "narr", "Keep adding salt, and eventually no more dissolves. The solution is **saturated**."),
            L("solubility", "arthur", "The most that can dissolve in a fixed amount of solvent is its **solubility**. It usually **rises with temperature**."),
            L("peng", "kavya", "That's why there's always sugar at the bottom of my iced teh-O!", 0.2,
              say="That's why there's always sugar at the bottom of my iced tay-oh!"),
            L("stir", "arthur", "Partly. Also, stir it.", 0.5),
            L("conc", "arthur", "**Concentration**: how much solute is in a given volume. **Few** particles: **dilute**. **Many**: **concentrated**."),
            L("siewdai", "kavya", "So teh-O siew dai, less sugar, is more **dilute**.", 0.6,
              say="So tay-oh see-oh-dye, less sugar, is more dilute."),
        ],
    },
    {
        "id": "evict", "title": "Eviction night", "short": "Separating",
        "lines": [
            L("evict", "narr", "Eviction night. Kavya's beaker of muddy, salty water must be separated.", 0.2),
            L("filter", "arthur", "**Filtration** separates an **insoluble solid** from a **liquid**. Pour it through **filter paper** in a funnel."),
            L("stuck", "sandy", "Oh. Oh no. I'm stuck. I'm stuck in the paper.", 0.2),
            L("holes", "arthur", "Sand's too big for the paper's holes. What stays on the paper: the **residue**. What passes through: the **filtrate**."),
            L("residue", "sandy", "Residue. They even gave me a sad name.", 0.6),
            L("through", "sal", "Bye, Sandy! I'm going straight through!", 0.2),
            L("cant", "arthur", "Dissolved particles slip right through. You **can't filter salt out of salt water**.", 0.2),
            L("evap", "narr", "To get a dissolved solid back, heat it. The water **evaporates**. The salt is left behind."),
            L("cryst", "arthur", "For neater crystals, **crystallisation**: heat until it's **saturated**, then **cool slowly**. **Filter** off the crystals, and **dry** them."),
            L("cube", "sal", "Ta-da! Crystals! I'm a cube again!", 0.5, say="Ta da! Crystals! I'm a cube again!"),
            L("distil", "narr", "To get the water back, use **simple distillation**. The water **boils** into vapour. The salt stays behind."),
            L("condense", "arthur", "In the **condenser**, the vapour **cools** and **condenses** back into pure water.", 0.2),
            L("keep", "arthur", "So: **evaporation keeps the solid**. **Distillation keeps the liquid**.", 0.4),
            L("fraction", "narr", "**Fractional distillation** separates liquids with **different boiling points**, like crude oil. The **lowest boiling point** comes off first, at the top."),
            L("thair", "arthur", "They did that to my flat once. Cooled the air to a liquid, then boiled us off one at a time.", 0.2),
            L("first", "nigels", "We came off first. Lowest boiling point. Very proud.", 0.6),
        ],
    },
    {
        "id": "band", "title": "The band breaks up", "short": "Chromatography",
        "lines": [
            L("crime", "narr", "Back home, a crime. Someone drank Kavya's bubble tea and left a note.", 0.2),
            L("note", "kavya", "'Sorry.' In black ink. Three suspects. One of them is my brother.", 0.5),
            L("inky", "inky", "Hey hey! I'm Inky! Black ink! Just one colour. Very mysterious.", 0.4,
              say="Hey hey! I'm Ink-ee! Black ink! Just one colour. Very mysterious."),
            L("chroma", "narr", "**Chromatography** separates **coloured substances**, like the dyes in an ink."),
            L("spot", "arthur", "Spot the ink on a **pencil line** near the bottom. Stand the paper in a **solvent**, the spot just **above** it."),
            L("travel", "narr", "The solvent soaks up. Each dye travels a **different distance**, depending on how **soluble** it is and how much it **sticks to the paper**."),
            L("split", "inky", "Wait. Why am I splitting up? I'm blue! And pink! And yellow?!", 0.5),
            L("thinky", "arthur", "Inky thought she was one colour. Turns out, she's a mixture. Big day for her.", 0.6,
              say="Ink-ee thought she was one colour. Turns out, she's a mixture. Big day for her."),
            L("identify", "arthur", "Now run each suspect's pen alongside. If spots end up **level**, they're very likely the **same substance**."),
            L("knew", "kavya", "My brother's pen. Every spot, level. I KNEW it.", 0.5, say="My brother's pen. Every spot, level. I knew it."),
            L("oil", "narr", "**Oil and water** don't mix: they're **immiscible**. They form **layers**, the less dense oil on top."),
            L("funnel", "arthur", "In a **separating funnel**, open the **tap**: the **lower layer** drains first. Close it at the boundary."),
            L("magnet", "narr", "If one solid is **magnetic**, like **iron filings** in sand, a **magnet** lifts it out."),
            L("leaving", "sandy", "Great. Now even the iron is leaving me.", 0.5),
            L("only", "arthur", "Only magnetic metals: **iron**, **steel**, **nickel** and **cobalt**. Small o.", 0.4),
            L("method", "arthur", "Solids, liquids, or dissolved? Do they mix? Anything magnetic? **Match the method to the mixture**.", 0.2),
            L("job", "arthur", "Matching. It's what I do.", 0.6),
        ],
    },
    {
        "id": "traps", "title": "The cast saves you some marks", "short": "Exam traps",
        "lines": [
            L("intro", "narr", "Before the credits, the cast would like to save you marks.", 0.2),
            L("t1", "nate", "One! **Big then small**! Sodium is **Na**, not NA. Two capitals means two elements!", 0.2,
              say="One! Big, then small! Sodium is capital N, small a. Two capitals means two elements!"),
            L("t2", "chloe", "Two. A compound has **different properties** from its elements. I was poison gas. Now I'm on chips.", 0.2),
            L("t3", "nigels", "Three. Identical atoms joined together are still an **element**. We're both Nigel.", 0.2),
            L("t4", "sal", "Four. Dissolved isn't destroyed. I'm still there, and my **mass is conserved**.", 0.2),
            L("t5", "sandy", "Five. You **can't filter** salt out of salt water. Only I get stuck.", 0.2),
            L("t6", "arthur", "Six. **Evaporation** keeps the solid. **Distillation** keeps the liquid.", 0.2),
            L("t7", "inky", "Seven! Impurities **lower** the melting point, and spread it over a **range**!", 0.4),
            L("return", "narr", "Happily Ever Atom will return.", 1.0),
            L("setup", "nigels", "Arthur. We've found you a match.", 0.4),
            L("noble", "arthur", "Nigel. I'm a noble gas. I don't bond.", 0.4),
            L("argon", "nigels", "It's another argon atom.", 1.0),
            L("flatmates", "arthur", "...Fine. We'll be flatmates.", 1.5, say="Fine. We'll be flatmates."),
        ],
    },
]
