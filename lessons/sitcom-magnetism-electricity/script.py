"""DRAWER 8B, episode 12 ("The Practical"): a mockumentary sitcom that teaches Magnetism & Electricity.

An original comedy: a documentary crew films the equipment that lives in drawer 8B, in the prep room
behind Lab Three, during the week before Kavya's (12) Science practical test. Cecil, a tired 1.5 V
cell (and NOT a battery), runs the place; the electrons are all called Eddie; Dimitri the lamp is a
diva who keeps getting dimmer; Amy the ammeter queues for everything; Vic the voltmeter stands across
things and only holds up signs; Auntie Rez the resistor slows everybody down; Nora and Stan are one
bar magnet (N and S, forty years married); Sol the solenoid is a gym bro only when switched on.

Every line has a speaker (`who`, a key of CAST); make_audio.py voices each speaker differently.
Captions show the speaker's name. `pause` adds silence after a line (comic timing). Content follows
lib/topics/magnetism-electricity.ts (all 13 guide sections, the exam traps and misconceptions).

Respellings in `say`: "ohmiga" (omega), "reeostat" (rheostat), "Tick" (TIC), "in-crease" (the verb),
"Drawer Eight B", "am-meter" (ammeter, in the
traps), "air-con", and every number with a unit spelt out in words.
"""

META = {
    "name": "Drawer 8B",
    "kicker": "Claude Sitcom · Ep 12 · Magnetism & Electricity",
    "dek": "Ten years in a lab drawer, one Year 8 practical, and nobody is a battery. {chapters} scenes.",
    "gap": 0.32,          # dialogue moves fast
    "unit": "Scene",
    "lab": "magnetism-electricity",
    "kit": "sitcom",
    "title": "Claude Sitcom Ep 12: Drawer 8B (Magnetism & Electricity)",
    "h1": "Drawer 8B",
}

# voice, speed, caption name
CAST = {
    "narr":    {"voice": "bm_george",  "speed": 0.96, "name": "Narrator"},
    "kavya":   {"voice": "af_sky",     "speed": 1.02, "name": "Kavya"},
    "cecil":   {"voice": "bm_daniel",  "speed": 0.93, "name": "Cecil"},
    "eddie":   {"voice": "am_puck",    "speed": 1.13, "name": "Eddie"},
    "dimitri": {"voice": "bm_fable",   "speed": 1.02, "name": "Dimitri"},
    "amy":     {"voice": "af_nova",    "speed": 1.08, "name": "Amy"},
    "vic":     {"voice": "am_onyx",    "speed": 0.86, "name": "Vic"},
    "rez":     {"voice": "bf_emma",    "speed": 0.94, "name": "Auntie Rez"},
    "nora":    {"voice": "af_jessica", "speed": 1.04, "name": "Nora"},
    "stan":    {"voice": "am_adam",    "speed": 0.94, "name": "Stan"},
    "sol":     {"voice": "am_fenrir",  "speed": 1.06, "name": "Sol"},
}


def L(id, who, text, pause=0.0, say=None):
    line = {"id": id, "who": who, "cap": f"**{CAST[who]['name']}:** {text}", "pause": pause}
    line["say"] = say if say else text.replace("**", "")
    return line


CHAPTERS = [
    {
        "id": "cold", "title": "Cold open", "short": "Cold open", "card": False,
        "lines": [
            L("kavya", "narr", "This is Kavya. She is twelve. In one week, she has her Science practical test: build a circuit.", 0.3),
            L("plan", "kavya", "I've watched four videos about circuits. I've built zero circuits. My plan is confidence.", 0.6),
            L("small", "narr", "But this documentary is not about Kavya. It is about a drawer.", 0.5),
            L("drawer", "narr", "Behind Lab Three, there's a drawer: 'Electricity and Magnetism. Do not touch.'", 0.4),
            L("hi", "cecil", "Hi. Cecil. I'm a **cell**. **1.5 V**.",
              say="Hi. Cecil here. I am a cell. One point five volts.", pause=0.3),
            L("battery", "cecil", "And no, I'm not a battery. A **battery** is two or more cells joined together. I'm one cell.", 0.4),
            L("since", "cecil", "I've been in this drawer since twenty fifteen. Still a perfect **1.5 V**. I don't get out much.",
              say="I've been in this drawer since twenty fifteen. Still a perfect one point five volts. I don't get out much.", pause=0.6),
            L("rubber", "cecil", "Last year, a boy in Year Eight used a rubber band as a wire. We don't talk about it.", 0.8),
            L("title", "narr", "Drawer 8B. Episode twelve: The Practical.",
              say="Drawer Eight B. Episode twelve: The Practical.", pause=1.2),
        ],
    },
    {
        "id": "loop", "title": "No loop, no glow", "short": "The loop",
        "lines": [
            L("monday", "narr", "Monday. Practice run one: a cell, a lamp, and two wires.", 0.2),
            L("dimitri", "dimitri", "At last! Dimitri. The **lamp**. The star of every circuit.", 0.3),
            L("thdimitri", "cecil", "Dimitri thinks the circuit exists so he can shine. Honestly? It sort of does.", 0.6),
            L("eddies", "narr", "In the copper wire live the **electrons**: tiny particles with a **negative** charge."),
            L("eddie", "eddie", "Hi hi! Eddie! Electron! That's Eddie. That's also Eddie. We're all Eddie. It saves time.", 0.5),
            L("current", "narr", "**Electric current** is the flow of **charge** around a circuit: here, the Eddies on the move."),
            L("pump", "cecil", "I'm the pump. I push the charge round. I don't make the Eddies. They're in the wire already.", 0.3),
            L("oneway", "kavya", "Wire from the cell to the lamp. Done?", 0.5),
            L("nothing", "dimitri", "Nothing. I feel nothing.", 0.6),
            L("gap", "cecil", "There's a gap. Current only flows round a **complete loop**. Any gap, and it stops **everywhere**.", 0.3),
            L("shine", "dimitri", "LIGHT! She closed the loop! I'm SHINING!", 0.3),
            L("back", "eddie", "And we all come back to Cecil! The current isn't used up!"),
            L("energy", "cecil", "What gets passed on is **energy**. From me, to Dimitri, to the room, as light.", 0.3),
            L("copper", "narr", "Metals, like copper, are **conductors**: they let current flow. So does carbon."),
            L("plastic", "narr", "Plastic is an **insulator**, like rubber, glass and wood. The coat keeps the current in, and Kavya safe."),
            L("hence", "cecil", "Hence, the rubber band incident.", 0.7),
            L("arrows", "narr", "Current arrows on circuit diagrams go from **+ to −**. That's called **conventional current**.",
              say="Current arrows on circuit diagrams go from plus to minus. That's called conventional current."),
            L("minus", "eddie", "But we're negative, so we really go from **− to +**! The other way!",
              say="But we're negative, so we really go from minus to plus! The other way!", pause=0.3),
            L("why", "cecil", "Scientists chose the direction before anyone knew electrons existed. It stuck.", 0.3),
            L("theddie", "eddie", "Two hundred years of arrows pointing the other way. Nobody asks us.", 0.6),
            L("exam", "cecil", "In exams, draw current arrows from **+ to −**. Just be consistent.",
              say="In exams, draw current arrows from plus to minus. Just be consistent.", pause=0.5),
        ],
    },
    {
        "id": "series", "title": "Two lamps, one loop", "short": "Series",
        "lines": [
            L("tuesday", "narr", "Tuesday. Two lamps **in series**: one single loop, one after another.", 0.2),
            L("share", "dimitri", "Two lamps? I don't share a stage.", 0.3),
            L("now", "cecil", "You do now.", 0.5),
            L("symbols", "narr", "Kavya draws it first, with **circuit symbols**. In this drawer, they're on everyone's staff pass."),
            L("cell", "cecil", "Mine: a **long, thin** line, the **positive** side, and a **short, thick** one."),
            L("lamp", "dimitri", "Mine: a circle with a cross. Iconic.", 0.3),
            L("amy", "amy", "Amy. **Ammeter**. I measure **current**, in **amps**. I stand **in the line**: in **series**."),
            L("same", "amy", "**0.2 A** before the lamps. **0.2 A** after. The current is the **same everywhere** in a series loop.",
              say="Zero point two amps before the lamps. Zero point two after. The current is the same everywhere in a series loop."),
            L("thamy", "cecil", "Amy loves a queue. She queued for this interview. Nobody else was here.", 0.6),
            L("vic", "cecil", "That's Vic. **Voltmeter**. **Voltage**, or **potential difference**, in **volts**. He stands **across** a component: **in parallel**.", 0.3),
            L("signs", "cecil", "Vic doesn't talk. He holds up signs.", 0.9),
            L("shared", "narr", "In series, the cell's **voltage** is **shared**. Two identical lamps get **half** each."),
            L("dim", "dimitri", "Half?! I'm DIM! Do you know what it's like to be DIM?", 0.4),
            L("name", "cecil", "Dimitri. It's in your name.", 0.8),
            L("dimmer", "narr", "More lamps in series? They **all** get **dimmer**."),
            L("unscrew", "kavya", "And if I unscrew one...", 0.3),
            L("dark", "narr", "The loop breaks. In series, if one lamp goes, they **all go out**.", 0.6),
            L("betrayal", "dimitri", "In the dark: betrayal.", 0.8),
        ],
    },
    {
        "id": "parallel", "title": "Branches, and Auntie Rez", "short": "Parallel",
        "lines": [
            L("wednesday", "narr", "Wednesday. **Parallel**: each lamp gets its own **branch**.", 0.2),
            L("bright", "dimitri", "I'm BRIGHT again! Nobody touch anything!", 0.3),
            L("full", "narr", "Each branch gets the **full voltage** of the cell, so the lamps stay bright, even when you add more."),
            L("split", "eddie", "At the junction, we split up! Some go left, some go right!"),
            L("addup", "amy", "**0.4 A** in each branch. **0.8 A** from the cell. The branch currents **add up** to the total.",
              say="Zero point four amps in each branch. Zero point eight from the cell. The branch currents add up to the total.", pause=0.3),
            L("unscrew", "narr", "Kavya unscrews one lamp."),
            L("still", "dimitri", "I'm... still on. I'm still ON!", 0.3),
            L("keep", "narr", "If one branch breaks, the others **keep working**. So homes are wired in **parallel**."),
            L("aircon", "kavya", "So if my brother's lamp blows, the aircon stays on. Correct priorities.",
              say="So if my brother's lamp blows, the air-con stays on. Correct priorities.", pause=0.5),
            L("rez", "narr", "Next on the worksheet: a **resistor**. Enter Auntie Rez.", 0.2),
            L("hi", "rez", "Rez. **Resistor**. I make it **harder** for current to flow. Somebody has to.", 0.4),
            L("less", "amy", "**More resistance** means a **smaller current**.", 0.2),
            L("ohms", "rez", "Measured in **ohms**. Symbol: **Ω**, omega. Like a little horseshoe. Very nice.",
              say="Measured in ohms. Symbol: ohmiga. Like a little horseshoe. Very nice."),
            L("wire", "rez", "Even wires resist. A **longer** wire, **more** resistance. A **thinner** wire, **more** again.", 0.3),
            L("threz", "cecil", "Auntie Rez limits the current, to protect other components. Still annoying.", 0.6),
            L("nephew", "rez", "My nephew is a **variable resistor**, a **rheostat**. Slide him, and the lamp dims. He works in **dimmer switches** and **volume controls**.",
              say="My nephew is a variable resistor, a reeostat. Slide him, and the lamp dims. He works in dimmer switches and volume controls.", pause=0.5),
        ],
    },
    {
        "id": "magnets", "title": "Forty years, two poles", "short": "Magnets",
        "lines": [
            L("thursday", "narr", "Thursday. Magnetism. Meet the drawer's longest-married couple.", 0.2),
            L("nora", "nora", "Hello! Nora. **North pole**."),
            L("stan", "stan", "Stan. **South pole**. Same **bar magnet**. Forty years.", 0.4),
            L("rule", "narr", "The golden rule: **like poles repel**. **Unlike poles attract**."),
            L("away", "nora", "Ugh. Another north pole. Get AWAY from me.", 0.3),
            L("met", "stan", "But a north and a south? That's how we met.", 0.6),
            L("cut", "kavya", "What if I cut you in half? You'd finally get some space.", 0.3),
            L("two", "nora", "Doesn't work, sweetie. You'd get **two smaller magnets**, each with a north **and** a south."),
            L("materials", "narr", "Magnets attract **magnetic materials**: **iron, steel, nickel and cobalt**. I See No Cobwebs."),
            L("thnora", "nora", "Not all metals, though. Copper? Aluminium? Gold? We feel nothing.", 0.5),
            L("field", "narr", "A **magnetic field** is the region where magnetic materials feel a force. We draw it with **field lines**."),
            L("lines", "stan", "Outside the magnet, they go from **north to south**, and they **never cross**."),
            L("strong", "nora", "They're **closest together** at the **poles**. That's where we're **strongest**.", 0.3),
            L("filings", "narr", "**Iron filings** show the pattern. A **plotting compass** shows the direction."),
            L("compass", "narr", "A **compass** is a tiny magnet, free to spin. It points north, because the **Earth** is a giant magnet."),
            L("core", "stan", "Its field comes from molten iron in its core. Near the geographic North Pole is a magnetic **south** pole."),
            L("loves", "stan", "Unlike poles attract. A north always falls for a south.", 0.4),
            L("married", "nora", "I married one.", 0.9),
        ],
    },
    {
        "id": "electro", "title": "The magnet with an off switch", "short": "Electromagnet",
        "lines": [
            L("friday", "narr", "Friday. The **electromagnet**.", 0.2),
            L("sol", "sol", "Hey. Sol. **Solenoid**. A coil of wire round an iron nail. Right now? A nail in a scarf.", 0.5),
            L("wire", "narr", "Current in a wire makes a **magnetic field**. Coil the wire, and the loops' fields add up."),
            L("on", "sol", "Current's ON! North pole! South pole! I'm a MAGNET!", 0.3),
            L("thsol", "cecil", "Switched on, Sol is unbearable. Switched off, he's a nail.", 0.6),
            L("switch", "narr", "That's an electromagnet's big advantage: you can switch it **on and off**."),
            L("off", "sol", "And... I'm a nail again.", 0.8),
            L("reverse", "narr", "Reverse the current, and the **poles swap** over."),
            L("tic", "sol", "Want me stronger? **TIC**. More **turns**. **Increase** the current. Iron **core**.",
              say="Want me stronger? Tick. More turns. In-crease the current. Iron core."),
            L("more", "eddie", "More current? That's more of us!", 0.3),
            L("bigger", "cecil", "And a bigger cell won't help Nora and Stan. **Permanent magnets** don't run on cells.", 0.4),
            L("iron", "narr", "Sol's core is **pure iron**: a **temporary magnet**. It loses its magnetism easily."),
            L("steel", "stan", "We're made of **steel**. **Permanent**. We keep our magnetism for years."),
            L("domains", "nora", "Inside us, tiny regions called **domains** all point the same way.", 0.2),
            L("stroke", "narr", "To **magnetise** steel, stroke it with a magnet **in one direction**, again and again. The domains line up."),
            L("heat", "nora", "**Heat** us or **hammer** us, and they jumble. We'd be **demagnetised**. So stop dropping us, Year Eight.", 0.4),
            L("crane", "narr", "Scrapyard cranes lift cars with electromagnets, and switch off to drop them. **Bells**, **loudspeakers** and **motors** use them too."),
            L("cousin", "sol", "My cousin drops a car every day. On purpose. Living the dream.", 0.8),
        ],
    },
    {
        "id": "static", "title": "Test day, bad hair day", "short": "Static",
        "lines": [
            L("monday", "narr", "Monday. Test day. Kavya combs her hair with a plastic comb. Thirty-one times.", 0.3),
            L("hair", "kavya", "Why is my hair standing up? Why TODAY?!", 0.4),
            L("friction", "eddie", "That was us! Rubbing two **insulators** together moves electrons, by **friction**!"),
            L("static", "narr", "This is **static electricity**: charge that builds up and **stays put**, instead of flowing."),
            L("gained", "narr", "The comb **gained** electrons, so it's **negatively** charged. Her hair **lost** electrons, so it's **positive**."),
            L("only", "eddie", "Only electrons move! The positive charges just sit there.", 0.4),
            L("like", "narr", "**Like charges repel**. **Unlike charges attract**."),
            L("strands", "kavya", "So all my hairs have the same charge, and they're repelling each other.", 0.3),
            L("same", "nora", "Likes repel, sweetie. We've been saying.", 0.5),
            L("paper", "narr", "The charged comb can even pick up tiny bits of **uncharged** paper."),
            L("earth", "narr", "**Earthing** removes charge: a conductor to the ground lets the electrons flow away. Fuel tankers are earthed for safety."),
            L("lightning", "kavya", "And lightning? We get it almost every afternoon here.", 0.2),
            L("sky", "cecil", "A giant static spark, between a cloud and the ground. Very big sky static.", 0.5),
            L("test", "narr", "Ten a.m. Amy in series, Vic across the lamp. It lights.", 0.4),
            L("marks", "kavya", "Full marks. I'd like to thank... nobody. It's a drawer.", 0.5),
            L("thanks", "dimitri", "I'd like to thank... me.", 0.8),
        ],
    },
    {
        "id": "traps", "title": "The drawer saves you some marks", "short": "Exam traps",
        "lines": [
            L("intro", "narr", "Before the drawer closes, the cast would like to save you some marks.", 0.3),
            L("t1", "nora", "One. **Like** poles **repel**. **Unlike** poles **attract**.", 0.3),
            L("t2", "stan", "Two. Field lines go **north to south**, never crossing. Earth's magnetic **south** pole is up north.", 0.3),
            L("t3", "amy", "Three. **Ammeter** in **series**, measuring **amps**. **Voltmeter** **across**, in **parallel**, measuring **volts**.",
              say="Three. Am-meter: in series, measuring amps. Voltmeter: across, in parallel, measuring volts.", pause=0.3),
            L("t4", "dimitri", "Four. More lamps in **series** means **dimmer**. Never brighter. Trust me.", 0.3),
            L("t5", "sol", "Five. Switch off the current, and an electromagnet's magnetism **disappears**.", 0.3),
            L("t6", "eddie", "Six! Current is **not** used up! Every Eddie comes back!", 0.3),
            L("t7", "cecil", "Seven. Metals **conduct**. Plastic and rubber **insulate**. A rubber band is not a wire.", 0.6),
            L("return", "narr", "Drawer 8B will return.", say="Drawer Eight B will return.", pause=1.0),
            L("vic", "cecil", "Vic. Ten years in a drawer together. Anything you'd like to say?", 1.4),
            L("volts", "vic", "...**1.4 V**.", say="One point four volts.", pause=1.2),
            L("camera", "cecil", "...Turn the camera off.", say="Turn the camera off.", pause=1.5),
        ],
    },
]
