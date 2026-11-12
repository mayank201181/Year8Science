"""BLOCK 34, episode 9 ("The Aircon Rule"): a mockumentary sitcom that teaches Heat & Temperature.

An original comedy: a documentary crew spends one sweltering June day in Kavya's HDB flat
(Block 34, 34 °C), where the aircon is only allowed after 9 p.m. The real stars are the
things nobody notices: Jules (thermal energy, an over-keen delivery courier who only ever
goes hot to cold), Cel (the tired thermometer on the kitchen wall), Gus (a water particle),
Zip (a free electron in a steel spoon), Ray (infrared radiation, an influencer live from
the Sun), Woolly (a wool jumper nobody wants in June) and Vic (the vacuum in a flask, who
never says a word). Every line has a speaker (`who`, a key of CAST); make_audio.py voices
each speaker differently. Captions show the speaker's name. `pause` adds silence after a
line (comic timing). Content follows lib/topics/heat.ts.
"""

META = {
    "name": "Block 34",
    "kicker": "Claude Sitcom · Ep 9 · Heat & Temperature",
    "dek": "One HDB flat, thirty-four degrees, and an aircon that's banned until 9 p.m. {chapters} scenes.",
    "gap": 0.32,          # shorter gaps between lines than the lessons: dialogue moves fast
    "unit": "Scene",
    "lab": "heat",
    "kit": "sitcom",
    "title": "Claude Sitcom Ep 9: Block 34 (Heat & Temperature)",
    "h1": "Block 34",
}

# voice, speed, caption name
CAST = {
    "narr":   {"voice": "bm_george",  "speed": 0.96, "name": "Narrator"},
    "kavya":  {"voice": "af_sky",     "speed": 1.02, "name": "Kavya"},
    "cel":    {"voice": "am_michael", "speed": 0.95, "name": "Cel"},
    "jules":  {"voice": "af_bella",   "speed": 1.1,  "name": "Jules"},
    "gus":    {"voice": "am_fenrir",  "speed": 0.94, "name": "Gus"},
    "zip":    {"voice": "am_puck",    "speed": 1.15, "name": "Zip"},
    "ray":    {"voice": "af_aoede",   "speed": 1.08, "name": "Ray"},
    "woolly": {"voice": "bm_fable",   "speed": 0.88, "name": "Woolly"},
}


def L(id, who, text, pause=0.0, say=None):
    line = {"id": id, "who": who, "cap": f"**{CAST[who]['name']}:** {text}", "pause": pause}
    line["say"] = say if say else text.replace("**", "")
    return line


CHAPTERS = [
    {
        "id": "cold", "title": "Cold open", "short": "Cold open", "card": False,
        "lines": [
            L("kavya", "narr", "This is Kavya. She is twelve. It is June, in Singapore, and it is **34 °C**.", 0.4,
              say="This is Kavya. She is twelve. It is June, in Singapore, and it is thirty-four degrees."),
            L("rule", "kavya", "My mum has a rule. The aircon only goes on after **9 p.m.**", 0.3,
              say="My mum has a rule. The aircon only goes on after nine at night."),
            L("soup", "kavya", "It is 2 p.m. I am basically soup.", 0.6,
              say="It is two in the afternoon. I am basically soup."),
            L("block", "narr", "She lives in Block **34**.", 0.7, say="She lives in Block thirty-four."),
            L("dont", "kavya", "Don't.", 0.6),
            L("see", "narr", "But this documentary is not about Kavya. It is about something in this flat that nobody can see.", 0.2),
            L("move", "narr", "It is never still. And it only ever travels one way.", 0.4),
            L("jules", "jules", "Heyyy! Jules! **Thermal energy**! Most people call me **heat**. I'm in deliveries!", 0.3,
              say="Hey hey! Jules! Thermal energy! Most people call me heat. I'm in deliveries!"),
            L("brand", "jules", "Like **joules**, the unit I'm measured in. Different spelling. It's my brand.", 0.5),
            L("thcel", "cel", "Cel. Thermometer. Kitchen wall. I've said **34 °C** since nine this morning.", 0.3,
              say="Cel. Thermometer. Kitchen wall. I've said thirty-four degrees since nine this morning."),
            L("thsigh", "cel", "People look at me, sigh, and walk away. I don't make the weather. I just read it out.", 0.6),
            L("title", "narr", "Block 34. Episode 9: The Aircon Rule.", 1.2,
              say="Block Thirty-Four. Episode nine: The Aircon Rule."),
        ],
    },
    {
        "id": "temp", "title": "Heat is not temperature", "short": "Heat vs temperature",
        "lines": [
            L("ice", "narr", "Two fifteen. Kavya is holding an ice cube against her neck.", 0.3),
            L("cold", "kavya", "Ahhh. I can feel the cold going into me.", 1.0, say="Ahh. I can feel the cold going into me."),
            L("no", "cel", "Nope. Not happening.", 0.5),
            L("out", "jules", "That's ME, leaving! OUT of your warm neck, INTO the ice! **Hot to cold**! Never the other way!", 0.3),
            L("thing", "cel", "**Cold** isn't a thing that flows. It just means **less thermal energy**. The ice isn't giving you cold. It's taking Jules.", 0.4),
            L("rob", "kavya", "So the ice cube is robbing me.", 0.4),
            L("yes", "cel", "Basically. Yes.", 0.7),
            L("mix", "narr", "Two words everybody mixes up: **heat** and **temperature**."),
            L("temp", "cel", "**Temperature** is **how hot** something is. I measure it, in **degrees Celsius**."),
            L("heat", "jules", "And **heat** is me! **Thermal energy**! Measured in **joules**, like all energy!"),
            L("thdept", "cel", "I do temperature. Jules is heat. Different department. Different units. We're not even the same shape.", 0.6),
            L("tube", "cel", "I'm a **liquid-in-glass** thermometer. Warm me up, and my liquid **expands** and climbs my thin tube."),
            L("fixed", "cel", "**0 °C** is where pure water **freezes**. **100 °C** is where it **boils**. Today I've been stuck on **34**.", 0.5,
              say="Zero degrees is where pure water freezes. A hundred degrees is where it boils. Today I've been stuck on thirty-four."),
            L("equal", "narr", "Thermal energy flows until both are the **same temperature**: **thermal equilibrium**."),
            L("gone", "kavya", "My ice cube's gone. Now it's just warm neck water.", 0.5),
            L("thjules", "jules", "Cold to hot? Never. Not once. It's in my contract. **Hot to cold**, all day!", 0.5),
        ],
    },
    {
        "id": "party", "title": "The particle party", "short": "Particles",
        "lines": [
            L("zoom", "narr", "To understand Jules, zoom in. Way in. Into Kavya's iced water."),
            L("every", "narr", "Everything is made of **particles**, and they are **always moving**."),
            L("gus", "gus", "Yo. Gus. Water particle. **H₂O**. Frozen in an ice cube. Living the dream.", 0.4,
              say="Yo. Gus. Water particle. H two O. Frozen in an ice cube. Living the dream."),
            L("solid", "gus", "In a **solid**, we just **vibrate** in our places. Like a queue for chicken rice.", 0.5),
            L("here", "jules", "Delivery! Thermal energy for the ice cube!"),
            L("faster", "gus", "Oh, that's nice. I'm vibrating faster. A LOT faster.", 0.2),
            L("ke", "narr", "Heating gives particles more **kinetic energy**, the energy of movement. They move **faster**, and the ice **melts**."),
            L("liquid", "gus", "Now I'm a **liquid**! Still close, but we can **slide past** each other. Freedom, bro.", 0.4),
            L("total", "cel", "Jules isn't really a separate thing. **Thermal energy** is the **total** kinetic energy of **all** the particles, added up."),
            L("rude", "jules", "Rude. Accurate. But rude.", 0.5),
            L("average", "cel", "**Temperature** is different. It measures the **average** kinetic energy of the particles."),
            L("quiz", "narr", "Which has more thermal energy? A cup of tea at **80 °C**, or a swimming pool at **30 °C**?", 0.8,
              say="Which has more thermal energy? A cup of tea at eighty degrees, or a swimming pool at thirty?"),
            L("pool", "cel", "The **pool**. It's cooler, so its particles are slower on **average**. But it has so many more, the **total** is enormous."),
            L("got", "kavya", "So the tea is hotter, but the pool holds more heat."),
            L("correct", "cel", "Most correct thing said in this flat all year.", 0.6),
            L("sweat", "narr", "Meanwhile, Gus is in a drop of sweat on Kavya's arm. Don't ask how.", 0.5),
            L("escape", "gus", "Some of us are slow, some fast. The **fastest** ones **escape** from the surface into the air. **Evaporation**! Later!", 0.3),
            L("cooler", "cel", "The slow ones left behind have a lower **average** kinetic energy. The sweat gets **cooler**. That's how sweating **cools** you."),
            L("thgus", "gus", "I'm a **gas** now. Far apart, moving **freely**. Best day of my life.", 0.5),
        ],
    },
    {
        "id": "floor", "title": "The floor is the coolest", "short": "Conduction",
        "lines": [
            L("three", "narr", "Three p.m. Kavya has found the coolest place in the flat.", 0.3,
              say="Three in the afternoon. Kavya has found the coolest place in the flat."),
            L("floor", "kavya", "The floor. The tiles are the only cold thing in this flat. I live here now.", 0.6),
            L("same", "cel", "The tiles are thirty-four degrees. So is the wooden table. **Same temperature**."),
            L("why", "kavya", "Then why do the tiles feel colder?"),
            L("cond", "narr", "**Conduction**: the main way thermal energy travels through **solids**."),
            L("pass", "jules", "Your skin particles jiggle into the tile particles, and pass me along. **Neighbour to neighbour**!"),
            L("gossip", "jules", "Like gossip at a hawker centre. Nobody leaves their table, but the news reaches every stall.", 0.5),
            L("better", "cel", "Tiles are better **conductors** than wood, so they carry thermal energy **out** of you faster. That chill is your own heat leaving.", 0.4),
            L("metals", "narr", "The best conductors of all are **metals**. Like the spoon by Kavya's head.", 0.2),
            L("zip", "zip", "COMING THROUGH! Zip! **Free electron**! Metals are full of us!", 0.2),
            L("free", "zip", "We're not stuck to any particle! We zoom through the metal, carrying energy super fast!"),
            L("thzip", "cel", "Zip has had seven coffees. Electrons don't drink coffee. That's just Zip.", 0.7),
            L("shiny", "kavya", "I thought metals conduct well because they're shiny."),
            L("look", "zip", "The shine is just my look! It's the **free electrons** that do the work!", 0.3),
            L("insul", "narr", "Materials that slow thermal energy down are **insulators**: **wood**, **plastic**, **wool** and **air**."),
            L("woolly", "woolly", "Hello. I'm Woolly. A woollen jumper. Back of the cupboard. Nobody wants me in June.", 1.0,
              say="Hello. I'm Woolly. A woollen jumper. Back of the cupboard. Nobody wants me in June."),
        ],
    },
    {
        "id": "ray", "title": "Ray goes live", "short": "Radiation",
        "lines": [
            L("four", "narr", "Four p.m. Kavya walks to the MRT. The covered walkway has ended.", 0.3,
              say="Four in the afternoon. Kavya walks to the M R T. The covered walkway has ended."),
            L("attack", "kavya", "Why does the sun feel like it's personally attacking me?", 0.3),
            L("ray", "ray", "Because it IS, bestie! Ray! **Infrared radiation**! I'm live, from the Sun!", 0.3),
            L("waves", "ray", "I'm not particles. I'm **electromagnetic waves**, like light. You can't see me, but you can **feel** me.", 0.3),
            L("vacuum", "ray", "I need **no particles**, so I'm the **only** way energy can cross a **vacuum**: totally empty space."),
            L("thray", "cel", "Ray crossed **150 million km** of empty space to get here. Conduction and convection can't: no particles. Ray mentions this a lot.", 0.6,
              say="Ray crossed a hundred and fifty million kilometres of empty space to get here. Conduction and convection can't: no particles. Ray mentions this a lot."),
            L("all", "ray", "And **everything** gives off infrared. The road. The buses. You! **Hotter** things give off **more**."),
            L("me", "kavya", "I'm giving off radiation?"),
            L("glow", "ray", "You're glowing, bestie. In infrared.", 0.5),
            L("shirt", "narr", "Kavya is wearing a **black** T-shirt.", 0.8),
            L("dark", "ray", "**Dark, matt** surfaces are the **best absorbers** of radiation, and the **best emitters**. That shirt is my biggest fan.", 0.4),
            L("shiny", "ray", "**Light, shiny** surfaces are **poor absorbers** and poor emitters. They **reflect** me. So rude.", 0.3),
            L("shade", "narr", "That's why cars wear **shiny sunshades** in their windscreens."),
            L("wrong", "kavya", "Dark absorbs. Shiny reflects. I'm wearing the wrong shirt.", 0.5),
            L("drinks", "ray", "Remember: **Dark Drinks, Shiny Reflects**! Like and subscribe!", 0.6),
        ],
    },
    {
        "id": "flask", "title": "Woolly and the flask", "short": "Insulation",
        "lines": [
            L("five", "narr", "Five p.m. On the MRT, the aircon is set to 'Arctic'.", 0.3,
              say="Five in the afternoon. On the M R T, the aircon is set to Arctic."),
            L("freeze", "kavya", "How is it thirty-four degrees outside and freezing in here?", 0.3),
            L("mum", "narr", "Luckily, Kavya's mum made her pack a jumper."),
            L("needed", "woolly", "I'm needed. I'm finally needed.", 0.8),
            L("warm", "kavya", "Thanks, Woolly. You're so warm."),
            L("notwarm", "woolly", "I'm not warm, actually. I **don't add any heat**. Never have.", 0.4),
            L("trap", "woolly", "I just **trap air**. Trapped air is a great **insulator**: it **slows** Jules down as she leaves you."),
            L("slow", "jules", "I'm still leaving! Just... very... slowly.", 0.4),
            L("flask", "narr", "In Kavya's bag is a **vacuum flask** of iced water. Between its walls lives the quietest member of the cast.", 0.4),
            L("vic", "jules", "That's Vic. Vic is a **vacuum**. Vic is nothing. No particles at all.", 0.8),
            L("blocked", "jules", "No particles means **no conduction** and **no convection**. I can't get across Vic. I've tried. So many times.", 0.4),
            L("silver", "ray", "And its walls are **silvered**. Shiny! They **reflect** me straight back.", 0.3),
            L("stopper", "narr", "And the **stopper** stops warm air sneaking in through the top."),
            L("soup", "kavya", "Wait. Mum uses this same flask for hot soup."),
            L("both", "jules", "Works both ways! It slows me getting **out** of hot soup, and **into** iced water!", 0.4),
        ],
    },
    {
        "id": "aircon", "title": "Nine p.m.: the aircon goes on", "short": "Convection",
        "lines": [
            L("nine", "narr", "Back at Block 34, it is 8:59 p.m.", 0.4,
              say="Back at Block thirty-four, it is eight fifty-nine at night."),
            L("count", "kavya", "Three. Two. One.", 0.3),
            L("on", "narr", "Nine p.m. The aircon goes on.", 0.4, say="Nine o'clock. The aircon goes on."),
            L("expand", "cel", "Quick lesson. Heat something, and its particles move **faster** and spread **further apart**. It **expands**."),
            L("mass", "cel", "Its **volume** goes **up**. Its **mass** stays exactly the **same**. Same particles. More personal space.", 0.4),
            L("order", "gus", "**Gases** expand the most, then **liquids**, then **solids**. We gases love personal space, bro.", 0.3),
            L("bridge", "narr", "That's why bridges have **expansion gaps**, so they don't **buckle** on hot days."),
            L("dense", "narr", "Warm air expands, so it's **less dense**, so it **rises**. Cold air is **denser**, so it **sinks**."),
            L("loop", "gus", "Cold air sinks... gets warmed... rises... cools by the aircon... sinks again! Round and round!"),
            L("current", "narr", "That loop is a **convection current**. It only happens in **fluids**, liquids and gases, because they can **flow**."),
            L("zip", "zip", "Oh! Can I do convection? Can I? Please?"),
            L("nozip", "cel", "Zip, you live in a spoon. Spoons are **solid**. Solids can't flow.", 0.4),
            L("sad", "zip", "...Coming through. Sadly.", 0.6),
            L("rises", "kavya", "So basically, heat rises.", 1.0),
            L("warmair", "cel", "**Warm air** rises. Because it's **less dense**. Not 'heat rises'. Not 'lighter'. **Less dense**.", 0.4),
            L("high", "narr", "That's why the aircon is **high** on the wall: the cold, dense air sinks through the whole room."),
            L("new", "cel", "**25 °C**. A new number. I'm emotional.", 0.8,
              say="Twenty-five degrees. A new number. I'm emotional."),
        ],
    },
    {
        "id": "traps", "title": "The residents save you some marks", "short": "Exam traps",
        "lines": [
            L("intro", "narr", "Before the credits, the residents of Block 34 would like to save you some marks.", 0.3,
              say="Before the credits, the residents of Block thirty-four would like to save you some marks."),
            L("t1", "cel", "One. **Heat** and **temperature** are different. Heat is energy, measured in **joules**. Temperature is how hot, measured in **degrees Celsius**.", 0.3),
            L("t2", "jules", "Two! Thermal energy flows from **hot to cold**! Never the other way! Cold doesn't flow anywhere!", 0.3),
            L("t3", "zip", "Three! Metals conduct well because of **free electrons**! NOT because they're shiny!", 0.3),
            L("t4", "gus", "Four. **Convection** needs a **fluid**. And warm fluid rises because it's **less dense**, not 'lighter'.", 0.3),
            L("t5", "ray", "Five! Radiation needs **no particles**, so it crosses a **vacuum**. And shiny surfaces are **poor absorbers**!", 0.3),
            L("t6", "woolly", "Six. Insulators **don't add heat**. They only **slow** thermal energy down.", 0.3),
            L("t7", "kavya", "Seven. When things **expand**, the **volume** goes up, but the **mass** stays the same. Yes. I was listening.", 0.6),
            L("return", "narr", "Block 34 will return.", 1.0, say="Block Thirty-Four will return."),
            L("vic", "narr", "Vic? Any final thoughts?", 1.6),
            L("cant", "jules", "He can't talk. **Sound** needs particles to travel. Vic hasn't got any.", 0.5),
            L("best", "cel", "Best colleague I've ever had.", 1.5),
        ],
    },
]
