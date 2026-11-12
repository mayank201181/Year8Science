"""TEST TUBE KITCHEN, episode 7 ("Nothing Is Lost"): a mockumentary sitcom that teaches Chemical Reactions.

An original comedy for Claude Sitcom: a documentary crew films the final of a cooking competition held,
at the size of atoms, at the bottom of Kavya's test tube during a Year 8 Science practical. Ingredients
are reactants, dishes are products. Arrow, the reaction arrow, is the tired head judge (he is NOT an
equals sign); Olly, an oxygen molecule, is the celebrity guest chef who joins in everything; Madam Mass,
a digital balance, audits the mass of every dish; Ferris, an iron nail, is the mopey contestant who is
slowly rusting; Monty, carbon monoxide, is the guest nobody invited; Kat, a platinum catalyst, says
nothing and is never used up. Every line has a speaker (`who`, a key of CAST); make_audio.py voices
each speaker differently. Captions show the speaker's name. `pause` adds silence after a line (comic
timing). Content follows lib/topics/chemical-reactions.ts.

"Exothermic" is respelt "ekso-thermic" in `say` (the voice otherwise says "egza-thermic").
"""

META = {
    "name": "Test Tube Kitchen",
    "kicker": "Claude Sitcom · Ep 7 · Chemical Reactions",
    "dek": "A cooking competition at the bottom of a test tube, judged by a very tired arrow. {chapters} scenes.",
    "gap": 0.32,          # shorter gaps between lines than the lessons: dialogue moves fast
    "unit": "Scene",
    "lab": "chemical-reactions",
    "kit": "sitcom",
    "title": "Claude Sitcom Ep 7: Test Tube Kitchen (Chemical Reactions)",
    "h1": "Test Tube Kitchen",
}

# voice, speed, caption name
CAST = {
    "narr":   {"voice": "bm_george",  "speed": 0.96, "name": "Narrator"},
    "kavya":  {"voice": "af_sky",     "speed": 1.02, "name": "Kavya"},
    "arrow":  {"voice": "bm_daniel",  "speed": 1.02, "name": "Arrow"},
    "olly":   {"voice": "am_puck",    "speed": 1.1,  "name": "Olly"},
    "mass":   {"voice": "bf_emma",    "speed": 0.97, "name": "Madam Mass"},
    "ferris": {"voice": "bm_fable",   "speed": 0.94, "name": "Ferris"},
    "monty":  {"voice": "am_onyx",    "speed": 0.94, "name": "Monty"},
    "kat":    {"voice": "af_nicole",  "speed": 0.9,  "name": "Kat"},
}


def L(id, who, text, pause=0.0, say=None):
    line = {"id": id, "who": who, "cap": f"**{CAST[who]['name']}:** {text}", "pause": pause}
    line["say"] = say if say else text.replace("**", "")
    return line


CHAPTERS = [
    {
        "id": "cold", "title": "Cold open", "short": "Cold open", "card": False,
        "lines": [
            L("kavya", "narr", "This is Kavya. She is twelve. The science lab is 34 °C, because the aircon is broken.", 0.3,
              say="This is Kavya. She is twelve. The science lab is thirty-four degrees, because the aircon is broken."),
            L("stare", "kavya", "We're meant to 'observe a chemical reaction'. I've been staring at this test tube for five minutes. Nothing.", 0.3),
            L("weekend", "kavya", "It's like watching my weekend.", 0.6),
            L("small", "narr", "But this documentary is not about Kavya. It is about the bottom of her test tube."),
            L("shrink", "narr", "Shrink down to the size of atoms, and there's a cooking competition going on.", 0.4),
            L("hi", "arrow", "Hello. I'm Arrow. Head judge.", 0.3),
            L("rules", "arrow", "Simple rules. You start with ingredients. You finish with a brand-new dish. That's a **chemical reaction**.", 0.3),
            L("noteq", "arrow", "And yes, I'm an arrow. I mean '**turns into**'. I am **not** an equals sign.", 0.4),
            L("therapy", "arrow", "People still call me 'Equals'. I'm in therapy for it. My therapist is a question mark.", 0.9),
            L("tonight", "narr", "Tonight's final: a celebrity guest chef, a strict auditor, and a contestant who is slowly turning orange.", 0.4),
            L("ferris", "ferris", "Hi. Ferris. I'm an iron nail. Don't mind me.", 0.6),
            L("title", "narr", "Test Tube Kitchen. Episode seven: Nothing Is Lost.", 1.1),
        ],
    },
    {
        "id": "newdish", "title": "Is it a new dish?", "short": "New dish?",
        "lines": [
            L("round", "narr", "Round one: the signature dish. Every dish must be a **new substance**.", 0.2),
            L("olly", "olly", "Hello, Kitchen! Olly! **Oxygen**! Guest chef! I react with EVERYTHING!", 0.3),
            L("tharrow", "arrow", "Olly is oxygen. Nobody invites him. He just... joins in.", 0.5),
            L("choc", "olly", "First up: melted chocolate! Ta-da!", 0.3),
            L("same", "arrow", "That's chocolate. It was chocolate before. It's still chocolate. Just... sadder.", 0.5),
            L("phys", "arrow", "Melting is a **physical change**: **no new substance** is made. And it's **easy to reverse**. Put it in the fridge."),
            L("sugar", "olly", "Sugar, dissolved in tea!"),
            L("still", "arrow", "Still sugar. Still tea. Physical.", 0.4),
            L("egg", "olly", "A fried egg!", 0.2),
            L("chem", "arrow", "Now that's new. The runny egg has turned into **new substances**, with new properties. You can't un-fry it. A **chemical change**.", 0.4),
            L("taste", "kavya", "How do I tell if MY test tube reacted? We're not allowed to taste anything. I asked.", 0.5),
            L("signs", "narr", "Luckily, reactions usually leave **evidence**. Five signs."),
            L("colour", "olly", "Okay! First sign: a **colour change**!"),
            L("gas", "olly", "Sign two! A **gas given off**! Fizzing! Bubbles!"),
            L("temp", "olly", "Sign three! A **temperature change**! Hotter, or colder!"),
            L("precip", "olly", "Sign four! A **precipitate**! Two solutions mix, and a cloudy **insoluble solid** appears!",
              say="Sign four! A precipitate! Two solutions mix, and a cloudy, insoluble, solid appears!"),
            L("light", "olly", "And sign five! **Light or sound**! Bangs! Pops! My favourite!", 0.3,
              say="And sign five! Light, or sound! Bangs! Pops! My favourite!"),
            L("mnem", "arrow", "Remember them as **Cool Guys Take Pretty Lasses**. Colour, Gas, Temperature, Precipitate, Light. I didn't write it.", 0.5),
            L("boil", "kavya", "My water's bubbling! It's reacting!", 0.3),
            L("vapour", "arrow", "It's boiling. Those bubbles are just **water vapour**. Still water. **Physical**.", 0.4),
            L("clue", "arrow", "One sign is only a **clue**. The real question: has a **new substance** been made?", 0.5),
        ],
    },
    {
        "id": "menu", "title": "Writing the menu", "short": "Equations",
        "lines": [
            L("round", "narr", "Round two: write the menu. In chemistry, the menu is called an **equation**.", 0.2),
            L("rp", "arrow", "The ingredients you start with are the **reactants**. The new dishes you make are the **products**."),
            L("me", "arrow", "And in between: me. The arrow. It means '**turns into**'.", 0.3),
            L("special", "olly", "Today's special! Magnesium, cooked with ME!", 0.2),
            L("whoa", "kavya", "WHOA. Okay. That is definitely a reaction.", 0.4),
            L("word", "arrow", "**Word equation**: **magnesium + oxygen → magnesium oxide**. A white powder.",
              say="Word equation. Magnesium, plus oxygen, turns into magnesium oxide. A white powder."),
            L("equals", "olly", "Great equation, Equals!", 0.3),
            L("arrow", "arrow", "My name is Arrow.", 0.8),
            L("symbol", "narr", "Chemists also write a **symbol equation**, with **formulae**, to **count the atoms**."),
            L("sub", "arrow", "**O₂** means two oxygen atoms, joined. The small **subscript** number counts only the atom before it.",
              say="O two means two oxygen atoms, joined. The small subscript number counts only the atom before it."),
            L("gorgeous", "olly", "That's me! Two atoms! One gorgeous molecule!", 0.4),
            L("big", "arrow", "A **big number** in front, the **coefficient**, multiplies the **whole formula**. **2H₂O** means two water molecules.",
              say="A big number in front, the coefficient, multiplies the whole formula. Two H two O means two water molecules."),
            L("two", "olly", "So that's... two hydrogen atoms!", 0.5),
            L("four", "arrow", "Four. Two molecules, two hydrogens each. **Four hydrogen** and **two oxygen** atoms.", 0.4),
            L("thconf", "arrow", "Olly is very confident, and very often wrong. It's a powerful combination.", 0.6),
        ],
    },
    {
        "id": "audit", "title": "The audit", "short": "Mass audit",
        "lines": [
            L("round", "narr", "Round three. Every dish must now pass... the **audit**.", 0.4),
            L("hi", "mass", "Madam Mass. Auditor. I weigh everything going in, and everything coming out.", 0.3),
            L("rule", "mass", "Atoms are only **rearranged**: none made, none destroyed. So the mass of the **products** equals the mass of the **reactants**."),
            L("law", "narr", "The **law of conservation of mass**.", 0.2),
            L("motto", "mass", "Atoms can't hide, and atoms can't die.", 0.5),
            L("heavier", "kavya", "Um. My magnesium got HEAVIER when I burned it. Did I make atoms?", 0.4),
            L("no", "mass", "No.", 0.5),
            L("joined", "olly", "That was ME! I came in from the air, and joined on!"),
            L("fizz", "narr", "Now the opposite. Marble chips fizz in acid in an open flask, and the reading goes **down**."),
            L("escaped", "mass", "Carbon dioxide gas **escaped** into the room. Nobody leaves my kitchen without signing out.", 0.5),
            L("sealed", "mass", "In a **sealed** flask, nothing gets in or out, and the total mass stays **exactly the same**.", 0.3),
            L("thmass", "mass", "Twenty-three years. Same mass in, same mass out. I have never been surprised. I would quite like to be.", 0.7),
            L("balanced", "narr", "So a symbol equation must be **balanced**: the same number of each type of atom on both sides."),
            L("hydrogen", "olly", "Next! Hydrogen, cooked with me! **H₂ + O₂ → H₂O**!",
              say="Next! Hydrogen, cooked with me! H two, plus O two, turns into H two O!"),
            L("count", "mass", "Oxygen atoms: two on the left. One on the right. Unbalanced.", 0.3),
            L("cheat", "olly", "Easy! Just make the water **H₂O₂**!", 0.4, say="Easy! Just make the water H two O two!"),
            L("bleach", "arrow", "That's **hydrogen peroxide**. You've made bleach. **Never change a subscript**. Only put big numbers in front.", 0.4),
            L("fix", "arrow", "A **2** in front of the water fixes the oxygen. Then a **2** in front of the hydrogen: **2H₂ + O₂ → 2H₂O**.",
              say="A two in front of the water fixes the oxygen. Then a two in front of the hydrogen. Two H two, plus O two, turns into two H two O."),
            L("approved", "mass", "Four hydrogen, two oxygen, each side. **Balanced**. Approved.", 0.4),
        ],
    },
    {
        "id": "heat", "title": "The heat round", "short": "Heat & fire",
        "lines": [
            L("round", "narr", "Round four: heat. Reactions also **give out**, or **take in**, energy."),
            L("exo", "arrow", "An **exothermic** reaction **gives out** heat, so the surroundings get **hotter**: burning, neutralisation, hand warmers.",
              say="An ekso-thermic reaction gives out heat, so the surroundings get hotter. Burning, neutralisation, hand warmers."),
            L("warmer", "ferris", "Some hand warmers are just iron rusting, really fast. My life, on fast-forward.", 0.5),
            L("exit", "arrow", "**Exo** sounds like **exit**: energy exits, so it gets warmer.", say="Ekso sounds like exit. Energy exits, so it gets warmer."),
            L("endo", "arrow", "An **endothermic** reaction **takes in** heat, so the surroundings get **colder**. **Endo** sounds like **enter**.", 0.2),
            L("pack", "kavya", "So my cold pack is pushing cold INTO my hand?", 0.5),
            L("nocold", "arrow", "No. **Heat** flows **out of your hand**, into the reaction. That's why it feels cold.", 0.3),
            L("main", "narr", "The main event: **combustion**. A **fuel** burns in oxygen, releasing energy."),
            L("methane", "olly", "Methane, from the gas cooker! Plenty of me: **complete combustion**! **Methane + oxygen → carbon dioxide + water**!",
              say="Methane, from the gas cooker! Plenty of me: complete combustion! Methane, plus oxygen, turns into carbon dioxide, plus water!"),
            L("blue", "arrow", "A clean **blue flame**. The **most energy**.", 0.3),
            L("limited", "narr", "With **limited** oxygen: **incomplete combustion**. A smoky **yellow flame**, **less energy**, black **soot**, and a guest nobody invited.", 0.5),
            L("monty", "monty", "Heh. Monty. **Carbon monoxide**. You can't see me. You can't smell me.", 0.4),
            L("toxic", "arrow", "Monty is **toxic**. He stops your blood carrying oxygen.", 0.3),
            L("alarm", "monty", "Nobody can catch me. Except... that **carbon monoxide alarm**. I hate that alarm.", 0.5),
            L("bunsen", "kavya", "Oh! So that's why my Bunsen flame is yellow with the air hole closed...", 0.2),
            L("open", "narr", "...and **blue** with it open. More oxygen mixes in.", 0.4),
        ],
    },
    {
        "id": "ferris", "title": "Ferris and the reaction families", "short": "Families",
        "lines": [
            L("round", "narr", "Round five: reaction families. Spot the family, and you can **predict the products**."),
            L("first", "narr", "First: Ferris. Still turning orange.", 0.3),
            L("rust", "ferris", "It's called **rusting**: an **oxidation**. Oxidation means **gaining oxygen**."),
            L("welcome", "olly", "You're welcome!", 0.5),
            L("both", "ferris", "But oxygen alone can't do it. Rusting needs **oxygen AND water**: **iron + oxygen + water → hydrated iron oxide**.",
              say="But oxygen alone can't do it. Rusting needs oxygen and water. Iron, plus oxygen, plus water, turns into hydrated iron oxide."),
            L("dry", "arrow", "In completely **dry air**, or in **boiled water** with the air driven out, Ferris won't rust."),
            L("paint", "ferris", "That's why we paint bridges: to keep out oxygen and water. I'd love a coat of paint.", 0.5),
            L("reduce", "narr", "The opposite is **reduction**: **losing oxygen**. Heat iron oxide with carbon, and the carbon takes the oxygen away."),
            L("decomp", "olly", "**Thermal decomposition**! Heat breaks **one compound** into **simpler** ones: green **copper carbonate** into black **copper oxide**, and **carbon dioxide**!"),
            L("lime", "narr", "Bubble that gas through **limewater**: it turns **milky**. The test for **carbon dioxide**.", 0.3),
            L("neutral", "narr", "**Neutralisation**: **acid + base → salt + water**.", say="Neutralisation. Acid, plus base, turns into salt, plus water."),
            L("salt", "arrow", "**A, B, S, W**. Hydrochloric acid and sodium hydroxide make **sodium chloride**, and water. Salt. On a cooking show. Finally.",
              say="A, B, S, W. Hydrochloric acid and sodium hydroxide make sodium chloride, and water. Salt. On a cooking show. Finally.", pause=0.5),
            L("displace", "narr", "And **displacement**: a **more reactive** metal pushes a less reactive one out of its compound."),
            L("dip", "ferris", "Put me in blue **copper sulfate**, and I push the copper out. I'm **more reactive** than copper!", 0.3),
            L("winning", "ferris", "I'm coated in copper! I'm shiny! I'm WINNING!", 0.5),
            L("thhappy", "arrow", "First time I've ever seen Ferris happy. It's unsettling.", 0.6),
        ],
    },
    {
        "id": "speed", "title": "The speed round", "short": "Speed round",
        "lines": [
            L("round", "narr", "The final round: speed. An explosion is over in a flash. Rusting takes years."),
            L("rate", "arrow", "The **rate** is how fast reactants turn into products. To react, particles must **collide**, with enough energy."),
            L("temp", "narr", "Raise the **temperature**: particles move faster, so they collide **more often**, and **harder**."),
            L("conc", "narr", "Raise the **concentration**: more particles crammed into the same space, so **more collisions**."),
            L("mrt", "olly", "Like the MRT at rush hour!", 0.4, say="Like the M R T at rush hour!"),
            L("surface", "narr", "Increase the **surface area**: crush a lump into **powder**, and far more of it can be hit."),
            L("cat", "narr", "And finally... a **catalyst**.", 0.5),
            L("kat", "arrow", "This is Kat. She's a **catalyst**. She **speeds up** a reaction, **without being used up**.", 0.3),
            L("route", "arrow", "She gives particles an **easier route** to react, then walks off, completely unchanged.", 0.5),
            L("more", "olly", "Ooh! So she makes MORE food!", 0.4),
            L("same", "arrow", "No. Same products. Same amount. Just **faster**.", 0.5),
            L("enzymes", "narr", "Living things use catalysts called **enzymes**. **Amylase**, in saliva, speeds up the breakdown of starch."),
            L("bread", "kavya", "That's why bread tastes sweeter if you chew it for ages. I've been chewing this for three minutes.", 0.5),
            L("car", "narr", "And a car's **catalytic converter**, with metals like **platinum**, turns carbon monoxide into **carbon dioxide**."),
            L("boring", "monty", "Carbon dioxide? Me? I'm going to be so... boring.", 0.5),
        ],
    },
    {
        "id": "traps", "title": "The judges save you some marks", "short": "Exam traps",
        "lines": [
            L("intro", "narr", "Before the judges decide, the cast would like to save you some marks.", 0.3),
            L("t1", "arrow", "One. Equations use an **arrow**. Never an equals sign. Please.", 0.3),
            L("t2", "olly", "Two! Balance with **big numbers** in front. Never change a subscript! I learned the hard way!", 0.3),
            L("t3", "mass", "Three. Mass is **never destroyed**. If it seems to drop, a **gas escaped**.", 0.3),
            L("t4", "ferris", "Four. Rusting needs **oxygen and water**. Not just air.", 0.3),
            L("t5", "monty", "Five. Incomplete combustion makes **carbon monoxide** and soot. Not just carbon dioxide. Write ME.", 0.3),
            L("t6", "arrow", "Six. Temperature **rises**: **exothermic**. Temperature **falls**: **endothermic**.",
              say="Six. Temperature rises: ekso-thermic. Temperature falls: endothermic.", pause=0.3),
            L("winner", "narr", "And the winner of Test Tube Kitchen is...", 0.7),
            L("ferris", "arrow", "Ferris. Copper, pushed out of copper sulfate. Genuinely new substances. Well done.", 0.4),
            L("happy", "ferris", "I won? I'm so happy, I could rust.", 0.7),
            L("return", "narr", "Test Tube Kitchen will return.", 0.9),
            L("tired", "arrow", "Kat. Twelve reactions today. You must be exhausted.", 0.9),
            L("weigh", "mass", "Five point zero zero grams. Same as this morning.", 0.7),
            L("again", "kat", "...Again.", 1.5),
        ],
    },
]
