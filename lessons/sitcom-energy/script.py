"""EVERY JOULE COUNTS, episode 14 ("The Case of the Missing Joules"): a mockumentary sitcom that teaches
Energy: Stores & Transfers.

An original comedy: inside the electricity meter in the corridor outside Kavya's HDB flat is a tiny
accounting firm that keeps track of every joule. Its senior auditor, Constance, IS the law of conservation
of energy. When Kavya's mum says the aircon is "using up all the energy", Constance opens a case: where did
the joules go? Every line has a speaker (`who`, a key of CAST); make_audio.py voices each speaker
differently, and captions show the speaker's name. `pause` adds silence after a line (comic timing).
Content follows lib/topics/energy.ts.
"""

META = {
    "name": "Every Joule Counts",
    "kicker": "Claude Sitcom · Ep 14 · Energy: Stores & Transfers",
    "dek": "An auditor who is also a law of physics hunts down the energy your family 'used up'. {chapters} scenes.",
    "gap": 0.32,          # shorter gaps between lines than the lessons: dialogue moves fast
    "unit": "Scene",
    "lab": "energy",
    "kit": "sitcom",
    "title": "Claude Sitcom Ep 14: Every Joule Counts (Energy: Stores & Transfers)",
    "h1": "Every Joule Counts",
}

# voice, speed, caption name
CAST = {
    "narr":   {"voice": "bm_george",  "speed": 0.96, "name": "Narrator"},
    "kavya":  {"voice": "af_sky",     "speed": 1.02, "name": "Kavya"},
    "mum":    {"voice": "af_kore",    "speed": 1.04, "name": "Mum"},
    "con":    {"voice": "bf_emma",    "speed": 0.94, "name": "Constance"},
    "jules":  {"voice": "am_puck",    "speed": 1.12, "name": "Jules"},
    "pat":    {"voice": "am_eric",    "speed": 1.03, "name": "Pat"},
    "theo":   {"voice": "bm_daniel",  "speed": 0.88, "name": "Theo"},
    "effie":  {"voice": "bf_alice",   "speed": 1.05, "name": "Effie"},
    "colin":  {"voice": "am_onyx",    "speed": 0.9,  "name": "Colin"},
    "gerald": {"voice": "am_liam",    "speed": 0.86, "name": "Gerald"},
}


def L(id, who, text, pause=0.0, say=None):
    line = {"id": id, "who": who, "cap": f"**{CAST[who]['name']}:** {text}", "pause": pause}
    line["say"] = say if say else text.replace("**", "")
    return line


CHAPTERS = [
    {
        "id": "cold", "title": "Cold open", "short": "Cold open", "card": False,
        "lines": [
            L("kavya", "narr", "This is Kavya. She is twelve. It is Saturday, 34 °C, and the aircon has been on since breakfast.", 0.3,
              say="This is Kavya. She is twelve. It is Saturday, thirty-four degrees, and the aircon has been on since breakfast."),
            L("mum", "mum", "Kavya! Switch off the aircon! You're using up all the energy!", 0.2),
            L("actually", "kavya", "Actually, Mum, energy can't be used up. It can't be destroyed. We learnt it in science.", 0.5),
            L("half", "narr", "Kavya is half right. So is her mum. Neither of them will admit it.", 0.6),
            L("meter", "narr", "But this documentary is not about Kavya. It is about the electricity meter outside her front door."),
            L("inside", "narr", "Inside is a tiny accounting firm. Its job: to account for every joule that comes through the door.", 0.4),
            L("hi", "con", "Constance. Senior auditor. I am the **law of conservation of energy**.", 0.4),
            L("law", "con", "Energy cannot be **created** or **destroyed**. It can only be **transferred** from one store to another.", 0.3),
            L("never", "con", "I have never been broken. Not once in 13.8 billion years. And people have tried.", 0.6,
              say="I have never been broken. Not once in thirteen point eight billion years. And people have tried."),
            L("case", "con", "Now somebody says energy is being '**used up**'. Not on my watch. I'm opening a case.", 0.5),
            L("title", "narr", "Every Joule Counts. Episode 14: The Case of the Missing Joules.", 1.2,
              say="Every Joule Counts. Episode fourteen: The Case of the Missing Joules."),
        ],
    },
    {
        "id": "stores", "title": "The eight departments", "short": "Eight stores",
        "lines": [
            L("file", "narr", "Case file one. Constance questions her only witness.", 0.3),
            L("hi", "jules", "Hi hi hi! I'm Jules! I'm a **joule**! Energy is measured in **joules**, J for short!", 0.2,
              say="Hi hi hi! I'm Jules! I'm a joule! Energy is measured in joules. J, for short!"),
            L("thjules", "con", "A joule is tiny. Lifting a small apple up by one metre takes about one joule.", 0.3),
            L("apple", "jules", "I lifted an apple once! A whole metre! Best day of my life.", 0.6),
            L("kilo", "con", "So we usually count in **kilojoules**. **1 kJ = 1000 J**.",
              say="So we usually count in kilojoules. One kilojoule is a thousand joules."),
            L("banana", "jules", "A banana holds about four hundred thousand of us. It's a very crowded banana.", 0.6),
            L("stores", "narr", "Every joule is always in one of **eight stores**. The firm has a department for each."),
            L("tour", "con", "The tour. Keep up, Jules.", 0.2),
            L("kin", "con", "**Kinetic**: anything **moving**. **Gravitational potential**: anything **high up**."),
            L("gerald", "jules", "That's Gerald, on the top shelf. He's got a lot of potential.", 0.9),
            L("elastic", "con", "**Elastic potential**: stretched or squashed things. **Chemical**: food, fuels and batteries."),
            L("thermal", "con", "**Thermal**: warm things, with jiggling particles. **Nuclear**: energy in the **nucleus** of an atom."),
            L("electro", "con", "**Electrostatic**: charges that attract or repel. And **magnetic**: magnets that attract or repel.", 0.2),
            L("mnemonic", "jules", "**K**ind **G**orillas **E**at **C**hocolate, **T**igers **N**ever **E**at **M**ango!", 0.3,
              say="Kind... Gorillas... Eat... Chocolate! Tigers... Never... Eat... Mango!"),
            L("thgorillas", "con", "Jules made that up. He's very proud of it. He's told the gorillas.", 0.6),
            L("where", "kavya", "Hang on. Where's the electricity department? Or light? Or heat?", 0.4),
            L("not", "con", "Not stores.", 0.9),
        ],
    },
    {
        "id": "pat", "title": "Pat is not a store", "short": "Pathways",
        "lines": [
            L("pat", "narr", "Energy moves between stores along **transfer pathways**. In this firm, that means Pat.", 0.2),
            L("hi", "pat", "Pat. Courier. I don't **keep** energy. I **move** it. Big difference.", 0.4),
            L("thpat", "con", "Pat is a pathway. People keep trying to file things with Pat. Pat hates that.", 0.5),
            L("mech", "pat", "Four routes. One: **mechanically**. A **force** pushes, pulls or stretches something."),
            L("kick", "pat", "Kick a ball: I carry energy mechanically into its **kinetic** store."),
            L("elec", "pat", "Two: **electrically**. An **electric current** in a circuit. Like charging your phone."),
            L("heat", "pat", "Three: **by heating**. From a **hotter** thing to a **colder** thing. Hot pan, cold egg."),
            L("rad", "pat", "Four: **by radiation**. Carried by **waves**: light, infrared, sound. Sunshine. Your speaker."),
            L("leave", "jules", "Hey, Pat! Can I leave this light energy with you for a bit?", 0.3),
            L("no", "pat", "I'm. Not. A. Store.", 0.9),
            L("rule", "con", "**Stores** are **where** energy is held. **Pathways** are **how** it moves. **Heat, light, sound** and **electricity** are pathways.", 0.4),
            L("kettle", "narr", "Example: Kavya's dad is boiling the kettle for his kopi. At thirty-four degrees. He does not care.", 0.4,
              say="Example: Kavya's dad is boiling the kettle for his kopi. At thirty-four degrees. He does not care."),
            L("first", "pat", "First I go **electrically**, from the mains to the **heating element**."),
            L("then", "pat", "Then **by heating**, from the element into the water's **thermal store**.", 0.3),
            L("so", "kavya", "So that's electrically, then by heating. Two pathways, one kettle."),
            L("correct", "con", "Correct. Annoyingly.", 0.6),
            L("thcorrect", "kavya", "She said I was correct. I'm telling everyone.", 0.6),
        ],
    },
    {
        "id": "tea", "title": "The bubble tea incident", "short": "Conservation",
        "lines": [
            L("four", "narr", "Four p.m. A tragedy.", 0.4),
            L("cup", "narr", "Kavya's bubble tea is on the edge of the table. Her elbow is about to make a terrible decision.", 0.4),
            L("before", "con", "Before it falls, the cup has energy in its **gravitational potential** store. Because it's **high up**."),
            L("falling", "jules", "It's falling! Gravitational store emptying! **Kinetic** store filling! It's speeding up!", 0.1),
            L("no", "kavya", "No no no no no!", 0.2),
            L("lands", "con", "Just before it lands, nearly all of it is **kinetic**. Then: splat.", 0.5),
            L("theo", "theo", "And then it all comes down to me. Hello. Theo. **Thermal store**.", 0.4),
            L("splat", "theo", "Some went off as **sound**. The rest warmed the floor, the tea and the pearls. A tiny bit.", 0.4),
            L("total", "con", "The **total energy before** equals the **total energy after**. Every joule. I counted.", 0.4),
            L("flow", "con", "We file it as an **energy flow diagram**: **gravitational potential → kinetic → thermal + sound**.",
              say="We file it as an energy flow diagram: gravitational potential, to kinetic, to thermal and sound."),
            L("toy", "jules", "Same with a wind-up toy! **Elastic** store in the spring, to **kinetic**, plus a bit of **thermal** from friction!", 0.3),
            L("pearls", "kavya", "I don't care about the joules. I care about my pearls.", 0.6),
            L("thpearls", "con", "The pearls are fine. Energetically speaking.", 0.8),
        ],
    },
    {
        "id": "basement", "title": "Theo's basement", "short": "Wasted energy",
        "lines": [
            L("fan", "narr", "Five p.m. The aircon is finally off. Kavya has switched to an old fan. It rattles.", 0.3),
            L("useful", "con", "Energy that goes where we **want** is **useful**. For a fan, that's the **kinetic** store of the moving air."),
            L("wasted", "con", "Energy that goes where we **don't** want is **wasted**. Usually into the **thermal store** of the surroundings.", 0.2),
            L("me", "theo", "That's me. The motor gets warm. The rattle is sound, and that ends up as heat too. It all ends up with me.", 0.5),
            L("theo", "theo", "Nobody comes down here on purpose. They just end up here. Like a lost umbrella.", 0.6),
            L("gone", "jules", "So the wasted energy just vanishes? Poof?", 0.4),
            L("denied", "con", "Denied.", 0.6),
            L("spread", "con", "Wasted energy is never destroyed. It **dissipates**: it spreads out into the surroundings, thinner and thinner."),
            L("thin", "theo", "I've got all of it. But it's spread so thin, nobody can collect it and use it again. My legacy: a slightly warmer room.", 0.6),
            L("friction", "narr", "Waste often comes from **friction** and **air resistance**, transferring energy to **thermal** stores. That's why bike brakes get hot."),
            L("rub", "narr", "Try it. Rub your palms together fast. Friction transfers energy into the **thermal store** of your skin.", 0.4),
            L("cool", "kavya", "Ooh. Warm. Okay, that's actually cool.", 0.3),
            L("warm", "theo", "It's actually warm.", 0.9),
        ],
    },
    {
        "id": "review", "title": "Effie's performance review", "short": "Efficiency",
        "lines": [
            L("effie", "narr", "Every device in the flat gets a yearly review. From Effie.", 0.3),
            L("hi", "effie", "Effie. **Efficiency**. I measure how much of your energy actually does the job.", 0.3),
            L("theffie", "effie", "I've reviewed every appliance in this flat. The rice cooker cried.", 0.6),
            L("formula", "effie", "**efficiency = useful energy transferred ÷ total energy supplied**",
              say="Efficiency equals useful energy transferred, divided by total energy supplied."),
            L("uot", "jules", "Useful Over Total! Useful Over Total!", 0.3),
            L("fan", "effie", "The fan. You were supplied with **200 J**. Only **150 J** went into moving air.", 0.2,
              say="The fan. You were supplied with two hundred joules. Only a hundred and fifty went into moving air."),
            L("divide", "effie", "**150 ÷ 200 = 0.75**. Times 100: **75%**.", 0.3,
              say="A hundred and fifty divided by two hundred is zero point seven five. Times a hundred: seventy-five per cent."),
            L("waste", "effie", "The other **50 J**, **25%**, was wasted. Mostly as heat.", 0.3,
              say="The other fifty joules, twenty-five per cent, was wasted. Mostly as heat."),
            L("hello", "theo", "Hello again.", 0.5),
            L("never", "effie", "**No** real device is **100%** efficient. There's always some waste, usually heat.", 0.2,
              say="No real device is a hundred per cent efficient. There's always some waste, usually heat."),
            L("more", "jules", "What if I write down a hundred and ten per cent?", 0.4),
            L("check", "con", "Denied. Check your working. You can't get more energy out than you put in.", 0.5),
            L("sankey", "narr", "Effie's favourite chart: the **Sankey diagram**. Arrow **width** shows the **amount** of energy."),
            L("branch", "effie", "Useful energy carries straight on. Wasted energy **peels off** in a branch, usually downwards."),
            L("fat", "effie", "Fat wasted branch: inefficient. Thin wasted branch: efficient. Simple. Brutal. Beautiful.", 0.5),
            L("always", "theo", "I'm the branch. I'm always the branch.", 0.8),
        ],
    },
    {
        "id": "supply", "title": "Where the joules come from", "short": "Resources",
        "lines": [
            L("where", "narr", "One question remains: where do the joules come from?", 0.2),
            L("hi", "colin", "Colin. **Coal**. Three hundred million years underground. I'm a **fossil fuel**.", 0.3),
            L("family", "colin", "Me, my brother **Oil**, my cousin **Natural Gas**. Burn us, and the energy in our **chemical store** is released."),
            L("station", "colin", "In a power station, we heat water into **steam**. The steam spins a **turbine**. The turbine turns a **generator**."),
            L("chain", "con", "**Chemical → thermal** store of the steam **→ kinetic** store of the turbine. Then **electrically**, down the wires, to here.", 0.3,
              say="Chemical, to the thermal store of the steam, to the kinetic store of the turbine. Then electrically, down the wires, to here."),
            L("skip", "jules", "Wind and falling water spin turbines directly! Solar cells don't even need a turbine!", 0.2),
            L("reliable", "colin", "I'm **reliable**. Day or night. A little of me releases a lot of energy.", 0.3),
            L("but", "con", "But burning fossil fuels releases **carbon dioxide**, a greenhouse gas linked to **climate change**. And they're **non-renewable**. They'll run out."),
            L("thcolin", "colin", "Three hundred million years to make me. Twenty minutes to burn me. Nobody respects the process.", 0.6),
            L("nuclear", "jules", "What about nuclear? It hardly makes any carbon dioxide. So it's renewable, right?", 0.4),
            L("uranium", "con", "Denied. Nuclear fuel is **uranium**. It's mined, and it will run out. Nuclear is **non-renewable**.", 0.3),
            L("renew", "narr", "**Renewable** resources are constantly replaced, so they won't run out: **solar**, **wind**, **hydroelectric**, **tidal**, **wave**, **geothermal** and **biomass**."),
            L("horses", "jules", "**S**ix **W**ild **H**orses **T**ook **W**et **G**rass **B**ack!", 0.3,
              say="Six Wild Horses Took Wet Grass Back!"),
            L("unreliable", "con", "Most release little carbon dioxide. But many are **unreliable**: no solar at night, no wind on a calm day."),
            L("mix", "narr", "So countries use a **mix**. Singapore gets most of its electricity from **natural gas**, and puts solar panels on HDB roofs.",
              say="So countries use a mix. Singapore gets most of its electricity from natural gas, and puts solar panels on H D B roofs."),
            L("so", "kavya", "So nothing was used up. It was all just... in Theo's basement?", 0.4),
            L("closed", "con", "Case closed. No joule was destroyed. But plenty were **wasted**: spread out as heat, doing nothing useful.", 0.4),
            L("save", "con", "**Saving energy** doesn't mean stopping joules vanishing. It means **wasting less** of what we pay for."),
            L("how", "narr", "So: **insulate** homes, choose **efficient appliances**, and **switch off** things instead of leaving them on **standby**.", 0.3),
            L("mum", "kavya", "Mum. You were right. I'm switching it off.", 0.5),
            L("who", "mum", "Who are you talking to?", 1.0),
        ],
    },
    {
        "id": "traps", "title": "The firm saves you some marks", "short": "Exam traps",
        "lines": [
            L("intro", "narr", "Before the credits, the firm would like to save you some marks.", 0.3),
            L("t1", "con", "One. Energy is **never created or destroyed**. Not used up. Not lost. **Transferred**.", 0.3),
            L("t2", "pat", "Two. **Heat, light, sound** and **electricity** are **pathways**, not stores. I'm. Not. A. Store.", 0.3),
            L("t3", "theo", "Three. Wasted energy **dissipates** into the **thermal store** of the surroundings. Hello again.", 0.3),
            L("t4", "effie", "Four. Efficiency is **never** more than **100%**. Never. I've checked.", 0.3,
              say="Four. Efficiency is never more than a hundred per cent. Never. I've checked."),
            L("t5", "colin", "Five. **Nuclear** is **non-renewable**. Uranium runs out. Like me.", 0.4),
            L("t6", "jules", "Six! Energy is measured in **joules**! Not watts! Not degrees! That's me!", 0.4),
            L("return", "narr", "Every Joule Counts will return.", 1.0),
            L("gerald", "con", "Gerald. Anything you'd like to add?", 1.4),
            L("finally", "gerald", "...Finally!", 0.4),
            L("filed", "con", "Gravitational potential, to kinetic. Filed.", 0.3),
            L("mine", "theo", "And now his joules are in my department.", 0.6),
            L("worth", "gerald", "Worth it.", 1.6),
        ],
    },
]
