"""PUSH & PULL, episode 13 ("Moving Day"): a mockumentary sitcom that teaches Forces & Motion.

An original comedy: Kavya (12) and her family move out of their old HDB flat into a new BTO flat.
A documentary crew follows the invisible staff of Push & Pull Removals, the forces who actually
move everything: Rex (the resultant force, a tired foreman who is literally an arrow), Pushpa
(an over-eager applied push on her first day), Frieda (friction, against everything), Graham
(gravity, Kavya's weight, clingy, works remotely), Norm (the normal force: the floor, unthanked),
Tess (tension, a very tense spring) and Piv (the pivot, silent until the stinger).
Every line has a speaker (`who`, a key of CAST); make_audio.py voices each speaker differently.
Captions show the speaker's name. `pause` adds silence after a line (comic timing).
Content follows lib/topics/forces.ts and lessons/forces/script.py.
"""

META = {
    "name": "Push & Pull",
    "kicker": "Claude Sitcom · Ep 13 · Forces & Motion",
    "dek": "Moving day, as told by the invisible crew who do all the actual moving. {chapters} scenes.",
    "gap": 0.32,          # shorter gaps between lines than the lessons: dialogue moves fast
    "unit": "Scene",
    "lab": "forces",
    "kit": "sitcom",
    "title": "Claude Sitcom Ep 13: Push & Pull (Forces & Motion)",
    "h1": "Push & Pull",
}

# voice, speed, caption name
CAST = {
    "narr":   {"voice": "bm_george",  "speed": 0.96, "name": "Narrator"},
    "kavya":  {"voice": "af_sky",     "speed": 1.02, "name": "Kavya"},
    "rex":    {"voice": "am_michael", "speed": 0.95, "name": "Rex"},
    "pushpa": {"voice": "af_bella",   "speed": 1.1,  "name": "Pushpa"},
    "frieda": {"voice": "bf_emma",    "speed": 0.97, "name": "Frieda"},
    "graham": {"voice": "am_santa",   "speed": 0.9,  "name": "Graham"},
    "norm":   {"voice": "bm_fable",   "speed": 0.9,  "name": "Norm"},
    "tess":   {"voice": "af_nicole",  "speed": 1.12, "name": "Tess"},
    "piv":    {"voice": "am_onyx",    "speed": 0.85, "name": "Piv"},
}


def L(id, who, text, pause=0.0, say=None):
    line = {"id": id, "who": who, "cap": f"**{CAST[who]['name']}:** {text}", "pause": pause}
    line["say"] = say if say else text.replace("**", "")
    return line


CHAPTERS = [
    {
        "id": "cold", "title": "Cold open", "short": "Cold open", "card": False,
        "lines": [
            L("kavya", "narr", "This is Kavya. She is twelve. Today, her family is moving out of the flat she grew up in.", 0.2),
            L("boxes", "kavya", "We have forty-seven boxes. Forty-six of them say 'MISC'. My dad did the labels.", 0.5,
              say="We have forty-seven boxes. Forty-six of them say, miscellaneous. My dad did the labels."),
            L("small", "narr", "But this documentary isn't about Kavya. It's about the invisible crew that does the real moving.", 0.2),
            L("every", "narr", "Whenever anything here moves, stops or turns, they did it. This is the foreman.", 0.3),
            L("hi", "rex", "Rex. I'm the **resultant force**. Basically, the manager.", 0.2),
            L("job", "rex", "Everybody pushes, everybody pulls. I add it all up. Whatever's left over... is me.", 0.3),
            L("decide", "rex", "I decide what actually happens. Speed up, slow down, turn... or nothing.", 0.5),
            L("nothing", "rex", "Nothing is my favourite.", 0.9),
            L("since", "rex", "Been in this business since the Big Bang. Never once been thanked.", 0.2),
            L("sofa", "rex", "People say, 'the sofa moved'. The sofa didn't move. We moved the sofa.", 0.5),
            L("title", "narr", "Push and Pull. Episode thirteen: Moving Day.", 1.2),
        ],
    },
    {
        "id": "crew", "title": "The morning briefing", "short": "The crew",
        "lines": [
            L("seven", "narr", "Seven a.m. Before the humans wake up, Rex holds the briefing.", 0.2),
            L("rule1", "rex", "Rule one. Each of us is a **push** or a **pull**. That's all a **force** is.", 0.2),
            L("rule2", "rex", "Rule two. Nobody sees us. Only what we **do**."),
            L("do", "rex", "We make things **start** moving, **speed up**, **slow down**, change **direction**, or change **shape**.", 0.2),
            L("pushpa", "pushpa", "Hi hi! Pushpa! I'm a **push**! It's my first day! I've been practising on a door!", 0.2,
              say="Hi hi! Pushpa! I'm a push! It's my first day! I've been practising on a door!"),
            L("thpushpa", "rex", "Pushpa's an applied force. She's new. She has a lot of energy. Not literally. Different episode.", 0.5),
            L("newtons", "rex", "We're measured in **newtons**, **N**. A small apple weighs about **1 N**.",
              say="We're measured in newtons, with a capital N. A small apple weighs about one newton."),
            L("arrows", "rex", "On paper, we're **arrows**. The arrow points the way we act. Longer arrow, bigger force.", 0.2),
            L("contact", "narr", "Most of the crew are **contact forces**: they only work when things touch."),
            L("frieda", "frieda", "Frieda. **Friction**. Whatever you're doing, I'm against it.", 0.5,
              say="Freda. Friction. Whatever you're doing, I'm against it."),
            L("norm", "norm", "Norm. **Normal force**. I push back from surfaces, at right angles. Nobody's heard of me.", 0.5),
            L("tess", "tess", "Tess! **Tension**! I pull, in ropes and springs. I'm very, very tense.", 0.3),
            L("noncontact", "narr", "Others act from a distance, without touching. **Non-contact forces**."),
            L("graham", "graham", "Hello! Graham! **Gravity**! My pull on you is your **weight**. I work remotely.", 0.3),
            L("cousins", "graham", "So do my cousins, **magnetic** and **electrostatic** forces. Never touch anybody.", 0.3),
            L("thgraham", "rex", "Graham pulls everything down, towards the centre of the Earth. He's very clingy.", 0.5),
            L("upthrust", "narr", "**Upthrust**, the upward push of water, has the day off. No swimming pool in this episode.", 0.5),
        ],
    },
    {
        "id": "sofa", "title": "The sofa will not move", "short": "The sofa",
        "lines": [
            L("nine", "narr", "Nine a.m. Kavya tries to push the sofa to the door.", 0.2),
            L("go", "pushpa", "Pushing! A hundred newtons! Go, go, go!"),
            L("objection", "frieda", "A hundred newtons, straight back at you. Objection.", 0.2),
            L("stuck", "kavya", "Why is it not moving? I am pushing SO hard.", 0.3),
            L("balanced", "rex", "Because the forces are **balanced**. Same size, opposite directions. They cancel out."),
            L("zero", "rex", "Resultant force: **zero**. So a still sofa **stays still**. And I'm on my break.", 0.5),
            L("up", "norm", "Same with me. Graham pulls the sofa down, I push up just as hard. So it doesn't sink into the floor.", 0.2),
            L("thanks", "norm", "Nobody ever says thank you to the floor.", 0.8),
            L("dad", "narr", "Then Kavya's dad joins in.", 0.2),
            L("three", "pushpa", "Two of us now! Three hundred newtons!"),
            L("limit", "frieda", "Two hundred is the most I can do. Fine. I still object.", 0.2),
            L("subtract", "rex", "Three hundred forwards, two hundred back. **Subtract**: **100 N forwards**. That's me. I'm up.", 0.2,
              say="Three hundred forwards, two hundred back. Subtract: a hundred newtons forwards. That's me. I'm up."),
            L("unbalanced", "narr", "**Unbalanced forces** leave a **resultant force**, which **changes the motion**. The sofa **speeds up**."),
            L("trolley", "narr", "In the corridor, the sofa rolls along on a trolley at a steady speed."),
            L("harder", "pushpa", "To keep it moving, I have to push harder and harder, right? RIGHT?", 0.5),
            L("no", "rex", "No.", 0.5),
            L("steady", "rex", "Your push just equals the friction on the wheels. Balanced. So: **steady speed**, **straight line**.", 0.2),
            L("change", "rex", "You only need a resultant force to **change** the motion.", 0.3),
        ],
    },
    {
        "id": "weigh", "title": "The heaviest box", "short": "Mass & weight",
        "lines": [
            L("box", "narr", "Ten a.m. Box thirty-one. It says 'MISC'. It is very heavy.", 0.2,
              say="Ten a.m. Box thirty-one. It says, miscellaneous. It is very heavy."),
            L("twenty", "kavya", "This box weighs twenty kilograms. Minimum.", 0.3),
            L("mass", "rex", "That's its **mass**, Kavya. Not its weight."),
            L("matter", "rex", "**Mass** is the **amount of matter**, in **kilograms**. It never changes, wherever you take it.", 0.2),
            L("weight", "graham", "And **weight** is me! The **force** of gravity on that mass. So it's in **newtons**!", 0.2),
            L("wmg", "graham", "**Weight = mass × gravitational field strength**. **W = m × g**!",
              say="Weight equals mass times gravitational field strength. W equals m times g!"),
            L("g", "graham", "On Earth, g is about **10 N/kg**. So, twenty kilograms times ten...",
              say="On Earth, g is about ten newtons per kilogram. So, twenty kilograms times ten...", pause=0.3),
            L("arms", "kavya", "**200 N**. That explains my arms.", 0.4, say="Two hundred newtons. That explains my arms."),
            L("moon", "kavya", "Can we just move to the Moon instead?", 0.3),
            L("moong", "graham", "On the Moon, g is only **1.6 N/kg**. Same mass, but it weighs just **32 N**.",
              say="On the Moon, g is only one point six newtons per kilogram. Same mass, but it weighs just thirty-two newtons."),
            L("sixth", "graham", "Please don't move to the Moon. I'd only be one sixth as attached to you.", 0.7),
            L("meter", "narr", "Rex checks with a **newtonmeter**: a spring balance. Inside it is Tess.", 0.2),
            L("ext", "tess", "Pull me, I stretch! The stretch is my **extension**: new length, minus original length.", 0.2),
            L("hooke", "tess", "My extension is **proportional** to the force. Double the force, double the stretch! **Hooke's law**.", 0.2),
            L("line", "rex", "So a graph of force against extension is a **straight line** through the origin.", 0.2),
            L("limit", "tess", "But only up to my **elastic limit**! Past that, I'm **permanently stretched**. I don't go back.", 0.3),
            L("uncle", "tess", "It happened to my uncle. He worked in a trampoline. He's never been the same shape.", 0.7),
        ],
    },
    {
        "id": "slide", "title": "Frieda is not the villain", "short": "Friction",
        "lines": [
            L("mop", "narr", "Eleven a.m. Mum has mopped the floor. Kavya is wearing socks.", 0.5),
            L("whoa", "kavya", "No, no, no, no, NO!", 0.3, say="No, no, no, no, no!"),
            L("wet", "frieda", "Wet floor, smooth socks. Hardly any of me. That's why you're sliding.", 0.2),
            L("thfrieda", "frieda", "People think I'm the villain. Yes, I always act **against the motion**. But without me, you couldn't even **walk**.", 0.2),
            L("useful", "frieda", "Tyres wouldn't **grip**. **Brakes** wouldn't work. You'd all slide into walls.", 0.3),
            L("bumps", "narr", "Friction comes from tiny bumps. Even smooth surfaces are rough close up, and the bumps catch."),
            L("squeak", "narr", "But in the trolley's wheels, friction **wastes energy as heat**, and wears the parts out.", 0.2),
            L("oil", "rex", "So we **reduce** it: **oil** the wheels. A **lubricant**.", 0.2),
            L("object", "frieda", "Objection, Rex.", 0.2),
            L("overruled", "rex", "Objection overruled.", 0.5),
            L("grip", "narr", "To **increase** friction, use rougher surfaces, like rubber soles. Kavya changes her shoes."),
            L("drag", "frieda", "Outside, in the air, I go by another name. **Air resistance**. Or **drag**.", 0.2),
            L("faster", "frieda", "Drag is friction from air or water. The **faster** you go, the **more** of me there is.", 0.2),
            L("stream", "rex", "That's why fast things are **streamlined**: smooth and pointed, so the air slips past.", 0.2),
            L("lorry", "frieda", "The removal lorry is not streamlined. The removal lorry is a box.", 0.7),
        ],
    },
    {
        "id": "lorry", "title": "The longest half hour", "short": "Speed",
        "lines": [
            L("noon", "narr", "Noon. The movers arrive. Their lorry takes everything **15 km** to the new flat, in **half an hour**.",
              say="Noon. The movers arrive. Their lorry takes everything fifteen kilometres to the new flat, in half an hour."),
            L("speed", "rex", "How fast? **Speed = distance ÷ time**.", 0.2, say="How fast? Speed equals distance divided by time."),
            L("units", "rex", "In metres and seconds, that's **metres per second**, **m/s**. On roads, **kilometres per hour**.",
              say="In metres and seconds, that's metres per second. On roads, kilometres per hour."),
            L("calc", "kavya", "Fifteen divided by a half... **30 km/h**. My grandma drives faster than that.", 0.3,
              say="Fifteen divided by a half... thirty kilometres per hour. My grandma drives faster than that."),
            L("average", "rex", "That's the **average speed**: **total distance ÷ total time**. It wasn't steady.",
              say="That's the average speed: total distance divided by total time. It wasn't steady."),
            L("graph", "narr", "Here's the journey as a **distance-time graph**. Time along the bottom, distance up the side."),
            L("slope", "rex", "A straight sloping line means a **steady speed**. And the **steeper** the line, the **faster** it's going."),
            L("express", "pushpa", "That steep bit is the expressway! Wheee!", 0.3, say="That steep bit is the expressway! Wheeee!"),
            L("flat", "pushpa", "Oh no. Now the line's flat. Did we go backwards?", 0.5),
            L("stopped", "rex", "Flat means **stationary**. The distance isn't changing. That was the traffic jam.", 0.2),
            L("jam", "rex", "Ten minutes. Not moving at all.", 0.2),
            L("best", "frieda", "Best ten minutes of my day.", 0.5),
            L("gradient", "narr", "In fact, the **gradient** of a distance-time graph, its steepness, **equals the speed**.", 0.2),
        ],
    },
    {
        "id": "newflat", "title": "Turning and pressing", "short": "Moments & pressure",
        "lines": [
            L("one", "narr", "One p.m. The new flat. It smells of fresh paint.", 0.2),
            L("door", "narr", "The front door is heavy. Pushpa pushes it right next to the hinges."),
            L("stuck", "pushpa", "It's... not... turning!", 0.2),
            L("moment", "rex", "Turning effect, Pushpa. It's called a **moment**. **Moment = force × distance from the pivot**.",
              say="Turning effect, Pushpa. It's called a moment. Moment equals force times distance from the pivot."),
            L("piv", "rex", "That's the pivot. Piv. Everything turns around Piv. Piv doesn't talk.", 1.0),
            L("handle", "rex", "Push at the handle, far from the pivot. Same force, more distance, bigger moment. Same reason long spanners work."),
            L("opens", "pushpa", "It opened! I didn't even push harder!", 0.2),
            L("seesaw", "rex", "A seesaw **balances** when the moments are equal: **force × distance** is the same on each side.",
              say="A seesaw balances when the moments are equal: force times distance is the same on each side."),
            L("kids", "narr", "Kavya, **400 N**, one metre from Piv. Her brother, **200 N**, two metres out. **400 N m** each. Balanced.", 0.2,
              say="Kavya, four hundred newtons, one metre from Piv. Her brother, two hundred newtons, two metres out. Four hundred newton metres each. Balanced."),
            L("tv", "kavya", "Did you just say my weight on television?", 0.7),
            L("legs", "narr", "Then the sofa goes down, on four tiny legs, onto the new floor.", 0.2),
            L("ow", "norm", "Ouch. Ouch, ouch, ouch. Those legs are tiny.", 0.2),
            L("pressure", "rex", "**Pressure = force ÷ area**. Same weight on a tiny area: huge pressure. That dents floors.",
              say="Pressure equals force divided by area. Same weight on a tiny area: huge pressure. That dents floors."),
            L("pascal", "rex", "Pressure is in **newtons per square metre**, **N/m²**. Also called **pascals**, **Pa**.",
              say="Pressure is in newtons per square metre. Also called pascals."),
            L("pads", "narr", "Mum sticks wide felt pads under the legs. Bigger area, smaller pressure.", 0.2),
            L("lovely", "norm", "Oh. That's lovely. Nobody's ever done anything nice for me before.", 0.7),
            L("cutter", "narr", "A sharp box cutter works the other way: tiny edge, huge pressure. It slices through tape.", 0.2),
        ],
    },
    {
        "id": "traps", "title": "The crew saves you some marks", "short": "Exam traps",
        "lines": [
            L("intro", "narr", "Before the credits, the crew would like to save you some marks.", 0.2),
            L("t1", "graham", "One! **Mass** is in **kilograms**. **Weight** is a force, so it's in **newtons**!", 0.2),
            L("t2", "pushpa", "Two! Moving things don't need a forward force to keep going. Balanced forces mean a **steady speed**!", 0.2),
            L("t3", "frieda", "Three. Friction and drag always **oppose** the motion. And drag **grows** with speed.", 0.2),
            L("t4", "rex", "Four. Speed is distance **divided by** time. Pressure is force **divided by** area. Don't multiply!", 0.2),
            L("t5", "tess", "Five! Hooke's law only works up to the **elastic limit**! Ask my uncle!", 0.2),
            L("t6", "norm", "Six. A flat line on a distance-time graph means **stationary**. Not backwards. Like me. Forever.", 0.5),
            L("return", "narr", "Push and Pull will return.", 1.0),
            L("ask", "rex", "Piv. Anything you'd like to add?", 1.4),
            L("me", "piv", "...Everything revolves around me.", 1.0),
            L("wrong", "norm", "...He's not wrong.", 0.5),
            L("dont", "rex", "Don't encourage him.", 1.5),
        ],
    },
]
