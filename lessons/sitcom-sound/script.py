"""PASS IT ON, Claude Sitcom episode 11 ("Bar Forty-Seven"): a mockumentary sitcom that teaches Sound.

An original comedy: a documentary crew follows Nigel, a tired nitrogen molecule who works in
"sound delivery" in the air of a school hall, where Kavya (12) is at band practice. She plays the
triangle: forty-six bars of nothing, then one ding, in bar forty-seven. Nigel never goes anywhere;
he passes it on. With Archie (argon, an over-keen trainee), Belle (the school bell nobody is ever
happy to hear), Freq and Amp (frequency and amplitude, a double act), Coco (the cochlea, front desk
of the inner ear) and Echo (the hall's back wall, who only ever repeats the end of what you said).

Every line has a speaker (`who`, a key of CAST); make_audio.py voices each speaker differently.
Captions show the speaker's name. `pause` adds silence after a line (comic timing). `say` is what
the voice reads when the caption has numbers, units or symbols, or a word it mispronounces
("rairifaction" keeps four syllables, "ultra-sound" and "in-fra-sound" keep their vowels clear,
"cut it in half" because this voice says "halve" like "have", "Trace eh" for the letter A).
Content follows lib/topics/sound.ts and the animated lesson lessons/sound/script.py.
"""

META = {
    "name": "Pass It On",
    "kicker": "Claude Sitcom · Ep 11 · Sound",
    "dek": "A mockumentary about the air particles who deliver every sound in the school hall, without ever going anywhere. {chapters} scenes.",
    "gap": 0.32,          # shorter gaps between lines than the lessons: dialogue moves fast
    "unit": "Scene",
    "lab": "sound",
    "kit": "sitcom",
    "title": "Claude Sitcom Ep 11: Pass It On (Sound)",
    "h1": "Pass It On",
}

# voice, speed, caption name
CAST = {
    "narr":   {"voice": "bm_george",  "speed": 0.96, "name": "Narrator"},
    "kavya":  {"voice": "af_sky",     "speed": 1.02, "name": "Kavya"},
    "nigel":  {"voice": "am_michael", "speed": 0.96, "name": "Nigel"},
    "archie": {"voice": "am_puck",    "speed": 1.12, "name": "Archie"},
    "belle":  {"voice": "bf_emma",    "speed": 0.93, "name": "Belle"},
    "freq":   {"voice": "af_bella",   "speed": 1.15, "name": "Freq"},
    "amp":    {"voice": "am_fenrir",  "speed": 0.88, "name": "Amp"},
    "coco":   {"voice": "af_aoede",   "speed": 1.0,  "name": "Coco"},
    "echo":   {"voice": "af_nicole",  "speed": 0.9,  "name": "Echo"},
}


def L(id, who, text, pause=0.0, say=None):
    line = {"id": id, "who": who, "cap": f"**{CAST[who]['name']}:** {text}", "pause": pause}
    line["say"] = say if say else text.replace("**", "")
    return line


CHAPTERS = [
    {
        "id": "cold", "title": "Cold open", "short": "Cold open", "card": False,
        "lines": [
            L("kavya", "narr", "This is Kavya. She is twelve. In the school band, she plays the **triangle**.", 0.6),
            L("bars", "kavya", "Forty-six bars of nothing. Then one ding. Bar forty-seven. That's my whole job.", 0.5),
            L("hall", "narr", "Band practice. Thirty-four degrees. The ceiling fans are doing their best.", 0.4),
            L("small", "narr", "But this documentary isn't about Kavya. It's about the air between her triangle and your ears."),
            L("this", "narr", "Trillions of tiny air particles. This is one of them.", 0.5),
            L("hi", "nigel", "Hi. Nigel. **Nitrogen** molecule. Air particle.", 0.3),
            L("percent", "nigel", "Seventy-eight percent of the air is nitrogen. And everyone only talks about oxygen.", 0.6),
            L("job", "nigel", "I work in sound. Deliveries. Every drum, every ding, every 'Kavya, focus!'", 0.4),
            L("go", "nigel", "People think I carry sound to your ear. I don't go anywhere. I **pass it on**.", 0.3),
            L("echo", "echo", "...pass it on.", 0.6, say="pass it on."),
            L("thecho", "nigel", "That's Echo. The back wall. She doesn't talk. She just repeats things.", 0.2),
            L("echo2", "echo", "...repeats things.", 0.9, say="repeats things."),
            L("title", "narr", "Pass It On. Episode eleven: Bar Forty-Seven.", 1.2),
        ],
    },
    {
        "id": "vibrate", "title": "Something is always vibrating", "short": "Vibrations",
        "lines": [
            L("start", "narr", "Every sound starts with something **vibrating**: moving quickly **back and forth** about a fixed position.", 0.3),
            L("drum", "nigel", "The drum. Hit it, and the drum **skin** vibrates."),
            L("guitar", "nigel", "The guitar. Pluck it, and the **string** vibrates."),
            L("speaker", "nigel", "The loudspeaker. Its **cone** vibrates in and out, shoving us. Rude.", 0.4),
            L("hum", "kavya", "Mmmmmm.", 0.2, say="Mmmmmm."),
            L("cords", "nigel", "Kavya's **vocal cords**. Two flaps of tissue in her throat. They vibrate when she talks, sings or complains.", 0.3),
            L("mostly", "kavya", "Mostly complains.", 0.6),
            L("archie", "archie", "Hi hi hi! Archie! **Argon**! One percent of the air! It's my first day!", 0.3,
              say="Hi hi hi! Archie! Argon! One percent of the air! It's my first day!"),
            L("thnigel", "nigel", "Archie's a trainee. Argon's a noble gas. Chemically, he reacts to nothing. Emotionally, to everything.", 0.7),
            L("test", "nigel", "Proof? Kavya, ding the triangle. Then grab it."),
            L("grab", "narr", "She strikes it, then grips it. The sound **stops** at once.", 0.4),
            L("source", "nigel", "Stop the vibration, stop the sound. **Vibration is the source of all sound**. And sound is a form of **energy**."),
            L("thkavya", "kavya", "Can I do that again? That's more dinging than I get in the actual song.", 0.7),
        ],
    },
    {
        "id": "relay", "title": "Pass it on (but don't go anywhere)", "short": "Sound waves",
        "lines": [
            L("how", "narr", "So how does one ding cross the hall?", 0.2),
            L("run", "archie", "Easy! I grab the sound and RUN it over there!", 0.4,
              say="Easy! I grab the sound and run it over there!"),
            L("no", "nigel", "No.", 0.6),
            L("knock", "nigel", "The triangle knocks the particles next to it. They bump their neighbours, who bump theirs. All the way across."),
            L("back", "nigel", "Each of us just vibrates **back and forth**, and ends up where we started. **We don't travel with the wave**.", 0.3),
            L("wave", "narr", "That travelling disturbance is a **sound wave**. The particles stay put. It's the **energy** that travels."),
            L("thnigel", "nigel", "If the air really ran from the band to your ears, every drum solo would blow your hair off.", 0.7),
            L("long", "narr", "Sound is a **longitudinal** wave: the particles vibrate in the **same direction** that the wave travels."),
            L("squash", "nigel", "So we bunch up, then spread out. Bunched up is a **compression**. Spread out is a **rarefaction**.",
              say="So we bunch up, then spread out. Bunched up is a compression. Spread out is a rairifaction."),
            L("stadium", "archie", "Oh! Oh! Is it like a stadium wave?", 0.4, say="Oh! Oh! Is it like a stadium wave?"),
            L("across", "nigel", "No. In a stadium wave, people move up and down, **across** the direction of travel. That's **transverse**."),
            L("light", "nigel", "**Light** is transverse. So are ripples on water. Sound is longitudinal. We go **along**.", 0.3),
            L("medium", "narr", "The material sound travels through is its **medium**: a **solid**, a **liquid** or a **gas**. Here, it's Nigel.", 0.4),
        ],
    },
    {
        "id": "jar", "title": "Belle in a jar", "short": "Vacuum",
        "lines": [
            L("lab", "narr", "Next door, the Year 8s are doing a science experiment. With a bell.", 0.3),
            L("belle", "belle", "Hello. I'm Belle. Electric bell. I ring for the end of recess.", 0.3),
            L("nobody", "belle", "Thirty years. Nobody has ever been happy to hear me.", 0.7),
            L("thnigel", "nigel", "Belle. The least popular sound in the school. Below the recorder.", 0.6),
            L("jar", "narr", "The **bell-jar experiment**. Belle hangs in a sealed glass jar, not touching the sides. She rings. Everyone hears her."),
            L("pump", "narr", "Then a **vacuum pump** removes the air from the jar. Nigel's cousins, mostly.", 0.3),
            L("quiet", "narr", "The ringing gets **quieter and quieter**, even though you can still **see** the hammer hitting the bell."),
            L("still", "belle", "I'm still ringing! Can anyone hear me?", 0.8),
            L("vacuum", "nigel", "Sound needs particles to pass it on. A **vacuum** has **no particles**. Nobody to pass it on to.", 0.3),
            L("lightok", "nigel", "But **light doesn't need a medium**. That's why they can still see her."),
            L("back", "narr", "Let the air back in, and the sound returns.", 0.4),
            L("happy", "belle", "They're... happy to hear me? Nobody has ever been happy to hear me.", 0.8),
            L("space", "nigel", "Space is a vacuum too. So space is **silent**. Whatever the films say."),
            L("radio", "narr", "So astronauts on spacewalks talk by **radio**. Radio waves, like light, cross a vacuum."),
            L("rhyme", "archie", "I made a rhyme! **No air, no aware**!", 0.5,
              say="I made a rhyme! No air... no aware!"),
        ],
    },
    {
        "id": "storm", "title": "Lightning alert", "short": "Speed of sound",
        "lines": [
            L("four", "narr", "Four p.m. A thunderstorm rolls in over the HDB blocks. Very Singapore.", 0.3,
              say="Four p m. A thunderstorm rolls in over the H D B blocks. Very Singapore."),
            L("flash", "narr", "Kavya sees the lightning first. The thunder arrives **seconds later**."),
            L("fast", "nigel", "Light travels at about **300,000,000 m/s**. Sound in air? About **340 m/s**.",
              say="Light travels at about three hundred million metres per second. Sound in air? About three hundred and forty metres per second."),
            L("million", "nigel", "Light is nearly a **million times** faster. We're not even in the same race.", 0.5),
            L("count", "narr", "Count the seconds from flash to bang, and **divide by three**. That's roughly the storm's distance in **kilometres**."),
            L("counting", "kavya", "One... two... three... four... five... six.", 0.3, say="One. Two. Three. Four. Five. Six."),
            L("two", "archie", "Six divided by three! **Two kilometres**!", 0.3,
              say="Six divided by three! Two kilometres!"),
            L("hawker", "kavya", "Two kilometres. That's the hawker centre. Somebody's chicken rice is getting wet.", 0.7),
            L("gas", "nigel", "Team Gas. That's us. In air, about **340 m/s**. We're the **slowest**.", 0.3,
              say="Team Gas. That's us. In air, about three hundred and forty metres per second. We're the slowest."),
            L("liquid", "narr", "Team Liquid. Water. About **1,500 m/s**: more than four times faster.",
              say="Team Liquid. Water. About fifteen hundred metres per second: more than four times faster."),
            L("solid", "narr", "Team Solid. Steel. About **5,000 m/s**. The **fastest** of all.", 0.3,
              say="Team Solid. Steel. About five thousand metres per second. The fastest of all."),
            L("wrong", "archie", "But air's so light and easy to push through!", 0.5),
            L("packed", "nigel", "Everyone thinks that. It's backwards. The **closer** packed the particles, the **faster** they pass it on. **Solids speed, gases go slow.**", 0.4),
        ],
    },
    {
        "id": "scope", "title": "Freq and Amp", "short": "Pitch & loudness",
        "lines": [
            L("two", "narr", "Every sound has a **pitch**, how high or low it is, and a **loudness**. Meet two very different colleagues.", 0.3),
            L("freq", "freq", "Hi! I'm Freq! **Frequency**! Vibrations per second, in **hertz**! **One hertz** is **one vibration per second**!", 0.2,
              say="Hi! I'm Freak! Frequency! Vibrations per second, in hertz! One hertz is one vibration per second!"),
            L("amp", "amp", "I'M AMP. **AMPLITUDE**. HOW FAR THE PARTICLES MOVE FROM THEIR **REST POSITION**.", 0.4,
              say="I'm Amp. Amplitude. How far the particles move from their rest position."),
            L("thnigel", "nigel", "Freq runs on bubble tea. Amp does not have an indoor voice.", 0.6),
            L("pitch", "freq", "**Pitch** depends on me! **High frequency**, **high pitch**, like a whistle! **Low frequency**, **low pitch**, like a bass drum!"),
            L("loud", "amp", "**LOUDNESS** DEPENDS ON ME. **BIG AMPLITUDE**, **LOUD**. **SMALL AMPLITUDE**, **QUIET**.", 0.3,
              say="Loudness depends on me. Big amplitude, loud. Small amplitude, quiet."),
            L("same", "archie", "So a high note is a loud note!", 0.5),
            L("whisper", "freq", "(whispering) Nope. High pitch. Small amplitude. High and quiet.", 0.2,
              say="Nope. High pitch. Small amplitude. High and quiet."),
            L("boom", "amp", "LOW PITCH. BIG AMPLITUDE. LOW AND LOUD.", 0.3,
              say="Low pitch. Big amplitude. Low and loud."),
            L("indep", "nigel", "They're **independent**. Pitch goes with frequency, loudness goes with amplitude. **Fast pitch, big bang.**", 0.3),
            L("guitar", "freq", "Higher note on a guitar? **Tighten** the string, **shorten** it, or use a **thinner** one!"),
            L("harder", "amp", "LOUDER? PLUCK **HARDER**. SAME NOTE.", 0.3, say="Louder? Pluck harder. Same note."),
            L("scope", "narr", "A **microphone** turns sound into an electrical signal. An **oscilloscope** draws it as a wavy line: a **trace**."),
            L("read", "nigel", "**Height** shows **amplitude**: tall is **loud**. **Spacing** shows **frequency**: close together is **high-pitched**."),
            L("quiz", "narr", "Trace **A**: tall waves, far apart. Trace **B**: short waves, close together. Describe each sound.", 1.4,
              say="Trace eh: tall waves, far apart. Trace B: short waves, close together. Describe each sound."),
            L("answer", "archie", "A is **loud** and **low**! B is **quiet** and **high**!",
              say="Eh is loud and low! B is quiet and high!"),
            L("correct", "nigel", "Correct. I'm as surprised as you are.", 0.6),
            L("length", "narr", "One whole wave, say compression to compression, is a **wavelength**, measured in **metres**."),
            L("period", "freq", "And the **time period**, **T**, is the time for one wave! **T = 1 ÷ f**! Five hertz? A fifth of a second each!",
              say="And the time period, T, is the time for one wave! T equals one divided by f! Five hertz? A fifth of a second each!"),
            L("equation", "nigel", "The **wave equation**: **speed = frequency × wavelength**. In air, every pitch has the same speed, so **higher frequency** means **shorter wavelength**.",
              say="The wave equation: speed equals frequency times wavelength. In air, every pitch has the same speed, so higher frequency means shorter wavelength.", pause=0.4),
        ],
    },
    {
        "id": "ear", "title": "Out of range", "short": "Ear & echoes",
        "lines": [
            L("arrive", "narr", "At last, the ding reaches its customer: Kavya's **ear**.", 0.2),
            L("coco", "coco", "Welcome to the ear. I'm Coco, the **cochlea**. Front desk, inner ear.", 0.3),
            L("pinna", "coco", "The **pinna**, the flap you can see, funnels sound into the **ear canal**."),
            L("drum", "coco", "The wave makes the **ear drum** vibrate: a thin, tight membrane."),
            L("bones", "coco", "Three tiny **bones** pass the vibrations on to me. I'm a coiled tube, full of fluid. It's a look.", 0.3),
            L("nerve", "coco", "My cells turn the vibrations into **nerve signals** for the **brain**."),
            L("range", "coco", "But I only accept about **20 Hz** to **20,000 Hz**: the human **hearing range**. Twenty to twenty k. The top end drops with age.",
              say="But I only accept about twenty hertz to twenty thousand hertz: the human hearing range. Twenty to twenty k. The top end drops with age."),
            L("ultra", "freq", "Above twenty thousand hertz, I'm **ultrasound**! Below twenty, I'm **infrasound**! Elephants rumble in it!", 0.3,
              say="Above twenty thousand hertz, I'm ultra-sound! Below twenty, I'm infra-sound! Elephants rumble in it!"),
            L("dog", "narr", "Outside that range is still real sound. A dog hears a dog whistle at about **25,000 Hz**. You hear nothing.",
              say="Outside that range is still real sound. A dog hears a dog whistle at about twenty-five thousand hertz. You hear nothing."),
            L("loud", "coco", "**Very loud sounds** carry lots of energy. They can damage my cells **permanently**.", 0.4),
            L("sorry", "amp", "SORRY.", 0.6, say="Sorry."),
            L("reflect", "narr", "Hard, flat surfaces, like tiled walls, **reflect** sound. A reflected sound you hear a moment later is an **echo**."),
            L("echo", "echo", "...an echo.", 0.4, say="an echo."),
            L("absorb", "narr", "Soft things, like curtains and carpet, **absorb** sound instead.", 0.2),
            L("mmf", "echo", "...mmf.", 0.7, say="mmf."),
            L("scans", "freq", "Ultrasound echoes make **medical scans**, like a baby before it's born! Ultrasound in a liquid **cleans** jewellery too!",
              say="Ultra-sound echoes make medical scans, like a baby before it's born! Ultra-sound in a liquid cleans jewellery too!"),
            L("sonar", "nigel", "And **sonar**. A ship sends ultrasound down into the sea, and times the echo.",
              say="And sonar. A ship sends ultra-sound down into the sea, and times the echo."),
            L("sum", "narr", "The echo returns after **4 seconds**. Sound in water travels at about **1,500 m/s**. How deep is the sea?", 1.4,
              say="The echo returns after four seconds. Sound in water travels at about fifteen hundred metres per second. How deep is the sea?"),
            L("times", "archie", "1,500 × 4! **6,000 metres**!", 0.3,
              say="Fifteen hundred times four! Six thousand metres!"),
            L("half", "nigel", "That's **there and back**. Cut it in half. The sea is **3,000 metres** deep.", 0.3,
              say="That's there and back. Cut it in half. The sea is three thousand metres deep."),
            L("knew", "archie", "I knew that.", 0.2),
            L("echo2", "echo", "...knew that.", 0.8, say="knew that."),
        ],
    },
    {
        "id": "traps", "title": "The cast saves you some marks", "short": "Exam traps",
        "lines": [
            L("intro", "narr", "Before the credits, the cast would like to save you some marks.", 0.3),
            L("t1", "belle", "One. Sound **cannot** travel through a vacuum. No particles. Trust me.", 0.3),
            L("t2", "archie", "Two! Particles **don't** travel with the wave! They vibrate! The **energy** does!", 0.3),
            L("t3a", "freq", "Three! **Pitch** depends on **frequency**!"),
            L("t3b", "amp", "**LOUDNESS** DEPENDS ON **AMPLITUDE**. DON'T MIX US UP.", 0.3,
              say="Loudness depends on amplitude. Don't mix us up."),
            L("t4", "nigel", "Four. Sound is about **340 m/s**. Light is about **300,000,000 m/s**. Not similar.", 0.3,
              say="Four. Sound is about three hundred and forty metres per second. Light is about three hundred million. Not similar."),
            L("t5", "coco", "Five. Hertz for frequency. Metres per second for speed. Units matter.", 0.3),
            L("t6", "archie", "Six! In echo sums, the sound goes **there and back**, so cut it in half!", 0.3),
            L("return", "narr", "Pass It On will return.", 0.8),
            L("bar", "kavya", "Wait. Bar forty-seven. This is it. My moment.", 0.8),
            L("ding", "narr", "Ding.", 1.2),
            L("echo", "echo", "...ding.", 0.9, say="ding."),
            L("nailed", "kavya", "Nailed it.", 0.5),
            L("last", "echo", "...nailed it.", 1.5, say="nailed it."),
        ],
    },
]
