"""LIGHT WORK, episode 10 ("Return to Sender"): a mockumentary sitcom that teaches Light & Optics.

An original comedy: a documentary crew follows Ray, a tired, sarcastic ray of white light who works
for Light Work Express, the courier firm that delivers pictures into people's eyes. One Saturday,
from the 7 a.m. wake-up to lights out, Ray's deliveries to Kavya (12) take him past Mirabel, a vain
bathroom mirror; Norman, the normal, a pedantic imaginary line who stands at 90 degrees to every
surface; Dennis, the swimming pool, slow, gentle and "optically dense"; Violet and Indigo, two of
the seven colours hiding inside Ray's white trench coat; and Rosie, a red filter who works the stage
lights like a bouncer. Every line has a speaker (`who`, a key of CAST); make_audio.py voices each
speaker differently. Captions show the speaker's name. `pause` adds silence after a line (comic
timing). Content follows lib/topics/light.ts (and lessons/light/script.py).
"""

META = {
    "name": "Light Work",
    "kicker": "Claude Sitcom · Ep 10 · Light & Optics",
    "dek": "A mockumentary about the courier who travels 150 million kilometres to wake you up, and never gets a tip. {chapters} scenes.",
    "gap": 0.32,          # shorter gaps between lines than the lessons: dialogue moves fast
    "unit": "Scene",
    "lab": "light",
    "kit": "sitcom",
    "title": "Claude Sitcom Ep 10: Light Work (Light & Optics)",
    "h1": "Light Work",
}

# voice, speed, caption name
CAST = {
    "narr":    {"voice": "bm_george",  "speed": 0.96, "name": "Narrator"},
    "kavya":   {"voice": "af_sky",     "speed": 1.02, "name": "Kavya"},
    "ray":     {"voice": "am_adam",    "speed": 0.96, "name": "Ray"},
    "norman":  {"voice": "bm_daniel",  "speed": 0.95, "name": "Norman"},
    "mirabel": {"voice": "bf_emma",    "speed": 1.0,  "name": "Mirabel"},
    "dennis":  {"voice": "am_onyx",    "speed": 0.86, "name": "Dennis"},
    "violet":  {"voice": "af_nova",    "speed": 1.07, "name": "Violet"},
    "indigo":  {"voice": "am_liam",    "speed": 0.9,  "name": "Indigo"},
    "rosie":   {"voice": "af_kore",    "speed": 1.0,  "name": "Rosie"},
}


def L(id, who, text, pause=0.0, say=None):
    line = {"id": id, "who": who, "cap": f"**{CAST[who]['name']}:** {text}", "pause": pause}
    line["say"] = say if say else text.replace("**", "")
    return line


CHAPTERS = [
    {
        "id": "cold", "title": "Cold open", "short": "Cold open", "card": False,
        "lines": [
            L("kavya", "narr", "This is Kavya. She is twelve. It is seven a.m. on a Saturday, and she planned to sleep until lunch.", 0.4),
            L("sun", "kavya", "Why is the sun in my face? It's Saturday. The sun doesn't even go to school.", 0.5),
            L("small", "narr", "But this documentary is not about Kavya. It is about the thing that just hit her in the face."),
            L("this", "narr", "This is him.", 0.5),
            L("hi", "ray", "Hi. Ray. I'm a **ray of light**. I work in deliveries.", 0.3),
            L("commute", "ray", "I left the Sun eight minutes ago. A hundred and fifty million kilometres. In a **straight line**.", 0.3),
            L("speed", "narr", "Light travels at about **300,000 km/s**. Nothing is faster.",
              say="Light travels at about three hundred thousand kilometres per second. Nothing is faster."),
            L("curves", "ray", "And always in **straight lines**. I don't do curves. I don't do shortcuts. I don't do scenic routes.", 0.4),
            L("thboss", "ray", "My boss is the Sun. **Luminous**: makes its own light. Never lets anyone forget it.", 0.5),
            L("tips", "ray", "All that, to wake up one twelve-year-old.", 0.4),
            L("notip", "ray", "Nobody tips.", 0.9),
            L("title", "narr", "Light Work. Episode ten: Return to Sender.", 1.2),
        ],
    },
    {
        "id": "seeing", "title": "Your eyes are not lasers", "short": "How we see",
        "lines": [
            L("window", "narr", "Seven oh five. Ray comes through the window. Glass is **transparent**: light goes straight through.", 0.2),
            L("curtain", "ray", "The curtains are **translucent**. They let me in, but scatter me everywhere. Unprofessional.", 0.3),
            L("blanket", "narr", "Kavya pulls the blanket over her head. The blanket is **opaque**. No light gets through at all.", 0.3),
            L("neighbour", "ray", "Opaque. Fine. I'll leave it with the neighbour.", 0.7),
            L("job", "ray", "Here's the job. Light bounces off things and goes **into your eye**. That's how you **see** them."),
            L("lasers", "kavya", "Wait. I thought my eyes sent something out. Like little lasers.", 1.2),
            L("no", "ray", "No.", 0.5),
            L("receive", "ray", "Your eyes don't send anything out. They only **receive** light. You're not a superhero. You're a letterbox.", 0.6),
            L("wall", "narr", "Her wall makes no light of its own. It's **non-luminous**."),
            L("moon", "kavya", "But the Moon glows. So the Moon makes light, right?", 0.3),
            L("moonno", "ray", "The Moon is **non-luminous**. It just reflects our sunlight, and takes all the credit.", 0.5),
            L("torch", "narr", "Fully awake and fully annoyed, Kavya makes a shadow puppet with her phone torch."),
            L("roar", "kavya", "It's a dinosaur. Roar.", 0.6),
            L("shadow", "ray", "Light travels in straight lines, so her hand **blocks** me. The dark patch behind it is a **shadow**."),
            L("closer", "narr", "She moves her hand **closer to the torch**. The shadow gets **bigger**.", 0.2),
            L("big", "kavya", "Big dinosaur. Roar.", 0.6),
            L("lamp", "narr", "A big lamp gives a fuzzy shadow: a dark **umbra**, and a lighter **penumbra**.",
              say="A big lamp gives a fuzzy shadow: a dark umbra, and a lighter pen-umbra.", pause=0.4),
        ],
    },
    {
        "id": "mirror", "title": "Mirabel, the plane mirror", "short": "Reflection",
        "lines": [
            L("bathroom", "narr", "Seven fifteen. The bathroom. Next stop for Ray: a very important client.", 0.3),
            L("hello", "mirabel", "Hello, darling. Mirabel. **Plane mirror**. Flat, shiny, and frankly stunning.", 0.4),
            L("thmira", "ray", "Mirabel reflects everything. Mostly, she reflects on herself.", 0.6),
            L("norman", "norman", "Excuse me. Norman. **The normal**. An imaginary line at **90°** to the surface.",
              say="Excuse me. Norman. The normal. An imaginary line at ninety degrees to the surface."),
            L("thnorm", "ray", "Norman turns up whenever light hits a surface. He's imaginary. He comes anyway.", 0.5),
            L("fromme", "norman", "All angles are measured from me. **Not** from the mirror. From **me**.", 0.4),
            L("inout", "mirabel", "The angle coming in equals the angle going out, darling. I'm a professional."),
            L("law", "narr", "That's **the law of reflection**: the **angle of incidence** equals the **angle of reflection**. **i = r**.",
              say="That's the law of reflection: the angle of incidence equals the angle of reflection. i equals r."),
            L("towel", "narr", "The towel is rough, so it scatters light in all directions. That's **diffuse reflection**.",
              say="The towel is rough, so it scatters light in all directions. That's di-fewss reflection."),
            L("smooth", "mirabel", "Whereas I'm smooth: **regular reflection**. Parallel rays stay parallel, so you see a clear picture. In me.", 0.4),
            L("behind", "narr", "Kavya's image seems to be **behind** the mirror, as far behind as she is in front."),
            L("virtual", "norman", "But no light actually goes behind the mirror. The image is **virtual**. You can't catch it on a screen."),
            L("real", "mirabel", "Virtual? My reflection is the most real thing in this flat!", 0.4),
            L("still", "norman", "It's virtual, Mirabel.", 0.7),
            L("vusl", "narr", "A plane mirror image is **virtual**, **upright**, the **same size**, and **laterally inverted**. **V U S L**.",
              say="A plane mirror image is virtual, upright, the same size, and laterally inverted. V, U, S, L."),
            L("wave", "kavya", "I'm waving my right hand. My reflection is waving her left.", 0.3),
            L("updown", "mirabel", "But I never turn you upside down, darling. I'm a mirror, not a roller coaster.", 0.6),
        ],
    },
    {
        "id": "pool", "title": "Deeper than he looks", "short": "Refraction",
        "lines": [
            L("pool", "narr", "Two p.m. The swimming complex. **33 °C**. Ray dives in.",
              say="Two p.m. The swimming complex. Thirty-three degrees. Ray dives in.", pause=0.2),
            L("dennis", "dennis", "Hello. I'm Dennis. I'm the water. People say I'm dense.", 0.4),
            L("optical", "dennis", "I prefer... **optically dense**.", 0.7),
            L("bend", "narr", "Light travels **more slowly** in water than in air. Entering a new **medium** at an angle, that change in speed makes Ray **bend**: **refraction**."),
            L("shortcut", "kavya", "So light bends because it's taking a shortcut?", 1.0),
            L("noshort", "ray", "I don't do shortcuts. It's the **change in speed** that bends me.", 0.4),
            L("towards", "norman", "Into a denser medium, he slows down and bends **towards** the normal. Towards me."),
            L("away", "norman", "Out into a less dense one, he speeds up and bends **away** from me.", 0.3),
            L("thnorm", "norman", "People think light always bends towards me. I wish. Only when it slows down.", 0.6),
            L("sloto", "narr", "Remember: **SloTo, FastAway**.",
              say="Remember: Slow To, Fast Away.", pause=0.3),
            L("along", "ray", "If I go in **along** the normal, I still slow down. But I don't bend at all.", 0.3),
            L("shallow", "narr", "Light bends as it leaves the water, so the pool looks **shallower** than it really is."),
            L("deeper", "dennis", "I'm deeper than I look. People say that about me a lot.", 0.8),
            L("legs", "kavya", "So that's why my legs look short in the pool. I thought it was just my legs.", 0.5),
            L("parallel", "narr", "A **rectangular glass block** bends light twice, in and out. The ray comes out **parallel**, just shifted sideways: **lateral displacement**.", 0.3),
            L("critical", "narr", "Inside glass, beyond the **critical angle**, about **42°**, no light escapes. It all reflects back inside.",
              say="Inside glass, beyond the critical angle, about forty-two degrees, no light escapes. It all reflects back inside."),
            L("fibre", "ray", "**Total internal reflection**. It's how we zig-zag down **optical fibres**, carrying your internet.", 0.3),
            L("thnet", "ray", "So when your video buffers, it's not me. I am literally light. It's your Wi-Fi.", 0.7,
              say="So when your video buffers, it's not me. I am literally light. It's your Wi-Fi."),
        ],
    },
    {
        "id": "prism", "title": "Seven colours in a trench coat", "short": "Dispersion",
        "lines": [
            L("storm", "narr", "Four p.m. A thunderstorm. Very Singapore.", 0.3),
            L("flash", "ray", "See the lightning? We always get there first. The thunder's still on its way.", 0.3),
            L("sound", "narr", "Light is about a **million times faster** than sound."),
            L("crystal", "narr", "After the rain, sunlight hits a glass **prism** in Grandma's window.", 0.3),
            L("secret", "ray", "Okay. Time you knew. I'm not one colour.", 0.5),
            L("coat", "ray", "**White light** is a **mixture** of colours. I'm basically seven colours in a trench coat.", 0.8),
            L("spread", "narr", "The prism refracts each colour by a slightly different amount, so the colours **spread out**."),
            L("violet", "violet", "Wheee! Hi! Violet! I bend the **most**!", 0.3),
            L("red", "narr", "Red bends the **least**. Red is very relaxed about everything.", 0.5),
            L("order", "narr", "Out comes the **visible spectrum**: red, orange, yellow, green, blue, indigo, violet. This is **dispersion**."),
            L("richard", "narr", "To remember the order: **Richard Of York Gave Battle In Vain**."),
            L("indigo", "indigo", "Hi. Indigo. Between blue and violet. Some people can't tell me apart from blue.", 0.4),
            L("feelings", "indigo", "I'm a real colour. I have feelings. Mostly blue ones.", 0.8),
            L("made", "kavya", "So the prism **made** the rainbow?", 0.8),
            L("nomade", "ray", "No. The prism doesn't **add** any colour. We were in there all along. It just **separates** us.", 0.4),
            L("rainbow", "narr", "Raindrops act like millions of tiny prisms. That's a **rainbow**. You only see one with the Sun **behind** you.", 0.4),
        ],
    },
    {
        "id": "filter", "title": "Not on the list", "short": "Colour & filters",
        "lines": [
            L("hall", "narr", "Six p.m. Drama club rehearsal, in the school hall.", 0.2),
            L("tree", "kavya", "I'm Tree Number Three. I have no lines. This is fine.", 0.6),
            L("apple", "narr", "White light hits a red prop apple. It **reflects** red light and **absorbs** all the other colours."),
            L("noglow", "ray", "Only red reaches your eye. The apple doesn't glow, and it doesn't turn the light red."),
            L("whiteblack", "narr", "A **white** object reflects **all** the colours. A **black** object absorbs them all.", 0.3),
            L("rosie", "rosie", "Name's Rosie. **Red filter**. I work the spotlight. Let me check the list.", 0.3),
            L("list", "rosie", "Red? You're on the list. Green? Blue? Not on the list.", 0.5),
            L("filter", "narr", "A **filter** **transmits** its own colour and **absorbs** the others. Remember: **a filter is selfish**."),
            L("throsie", "rosie", "Selfish? I prefer exclusive.", 0.6),
            L("green", "narr", "Under Rosie's red light, Kavya's green leaves have no green light to reflect."),
            L("black", "kavya", "Why are my leaves black? I'm a tree. Trees are green.", 0.4),
            L("notlist", "rosie", "Green? Not on the list.", 0.8),
            L("primary", "narr", "Next: red, green and blue spotlights, the **primary colours of light**."),
            L("mix", "narr", "**Red + green = yellow. Green + blue = cyan. Red + blue = magenta.** All three make **white**.",
              say="Red and green make yellow. Green and blue make Sian. Red and blue make magenta. All three make white.", pause=0.4),
            L("hiagain", "ray", "All three together? That's white. That's me. Hi again.", 0.5),
            L("screen", "narr", "Phone screens use tiny **red, green and blue** dots. No yellow dots at all."),
            L("paint", "narr", "**Paints** are different: they **absorb** light, so mixing them makes darker, muddier colours.", 0.3),
        ],
    },
    {
        "id": "eye", "title": "Final destination: the eye", "short": "The eye",
        "lines": [
            L("night", "narr", "Ten p.m. Kavya is reading in bed. Ray makes his last delivery: straight into her eye.", 0.3),
            L("cornea", "ray", "First, the **cornea**, the clear window at the front. It does **most** of the bending."),
            L("pupil", "ray", "Then the **pupil**. It's not really a part. It's a hole. I go through the hole.", 0.4),
            L("iris", "narr", "The **iris**, a coloured ring of muscle, makes the pupil **smaller** in bright light, **wider** in dim light."),
            L("lens", "ray", "Next, the **lens**. It fine-tunes the focus. It's squishy. Like Dennis, if Dennis did yoga.", 0.5),
            L("near", "narr", "To focus on her book, the **ciliary muscles** contract. The lens gets **fatter**, and bends light **more**.",
              say="To focus on her book, the sili-airy muscles contract. The lens gets fatter, and bends light more."),
            L("far", "narr", "For the clock across the room, they relax. The **suspensory ligaments** pull the lens **thinner**. This is **accommodation**.", 0.3),
            L("retina", "ray", "Last stop, the **retina**, at the back. The picture lands here. Upside down.", 0.4),
            L("upside", "kavya", "Upside down? I've been seeing upside down my whole life?", 0.6),
            L("brain", "narr", "The image is **real** and **inverted**. The **optic nerve** carries signals to the **brain**, which sees it the right way up."),
            L("thbrain", "ray", "Twelve years of upside-down pictures. Her brain quietly fixes every one. Nobody tips the brain either.", 0.6),
            L("lightsout", "narr", "Ten fifteen. Kavya switches off the light.", 0.3),
            L("shift", "ray", "Shift over. See you at seven.", 0.8),
        ],
    },
    {
        "id": "traps", "title": "The cast saves you some marks", "short": "Exam traps",
        "lines": [
            L("intro", "narr", "Before the credits, the cast would like to save you some marks.", 0.3),
            L("t1", "norman", "One. Measure every angle from the **normal**. Never from the surface. Never.", 0.3),
            L("t2", "mirabel", "Two. A plane mirror image is **virtual**, not real. It hurts me to say it.", 0.3),
            L("t3", "dennis", "Three. Light bends towards the normal **only** when it slows down, going into a **denser** medium.", 0.3),
            L("t4", "violet", "Four! **Violet** bends the most! **Red** bends the least! Not the other way round!", 0.3),
            L("t5", "ray", "Five. A prism doesn't **add** colour. It only **separates** the colours already there.", 0.3),
            L("t6", "rosie", "Six. A red apple doesn't turn light red. It **reflects** red and **absorbs** the rest.", 0.3),
            L("t7", "kavya", "Seven. Your eyes don't send anything out. They only **receive** light.", 0.4),
            L("return", "narr", "Light Work will return.", 1.0),
            L("anyone", "indigo", "Did anyone notice I was here?", 0.6),
            L("course", "ray", "Course we did, Blue.", 1.0),
            L("indigo", "indigo", "...Indigo.", 1.5, say="Indigo."),
        ],
    },
]
