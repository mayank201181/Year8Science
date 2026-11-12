"""MIND THE GUT, episode 4 ("The Chicken Rice Express"): a mockumentary sitcom that teaches Food & Digestion.

An original comedy: a documentary crew follows Percy (peristalsis), the tired, sarcastic muscle who runs
the Alimentary Line, the only line inside Kavya (12). Her hawker-centre chicken rice rides it from the
mouth to the end of the line, past the enzymes who work its stations (Amy the amylase, Priya the
protease, Lionel the lipase), Bill the bile (not an enzyme), Phoebe the fibre (nobody digests her) and
Vinny the villus (does not talk). Every line has a speaker (`who`, a key of CAST); make_audio.py voices
each speaker differently. Captions show the speaker's name. `pause` adds silence after a line (comic
timing). Content follows lib/topics/digestion.ts.

Respellings in `say` (checked with the Kokoro phonemizer): "protee-aze" (protease), "lypase" (lipase),
"by-yoo-ret" (biuret), "allimentary" (alimentary), "ee-jestion" (egestion), "excreeshun" (excretion).
"""

META = {
    "name": "Mind the Gut",
    "kicker": "Claude Sitcom · Ep 4 · Food & Digestion",
    "dek": "One chicken rice, seven stations, and a muscle who has had enough. {chapters} scenes.",
    "gap": 0.32,          # shorter gaps between lines than the lessons: dialogue moves fast
    "unit": "Scene",
    "lab": "digestion",
    "kit": "sitcom",
    "title": "Claude Sitcom Ep 4: Mind the Gut (Food & Digestion)",
    "h1": "Mind the Gut",
}

# voice, speed, caption name
CAST = {
    "narr":   {"voice": "bm_george",  "speed": 0.96, "name": "Narrator"},
    "kavya":  {"voice": "af_sky",     "speed": 1.02, "name": "Kavya"},
    "percy":  {"voice": "am_fenrir",  "speed": 0.95, "name": "Percy"},
    "amy":    {"voice": "af_nova",    "speed": 1.12, "name": "Amy"},
    "priya":  {"voice": "bf_emma",    "speed": 1.0,  "name": "Priya"},
    "bill":   {"voice": "am_liam",    "speed": 0.98, "name": "Bill"},
    "lionel": {"voice": "bm_fable",   "speed": 0.94, "name": "Lionel"},
    "phoebe": {"voice": "af_river",   "speed": 0.9,  "name": "Phoebe"},
    "vinny":  {"voice": "am_onyx",    "speed": 0.85, "name": "Vinny"},
}


def L(id, who, text, pause=0.0, say=None):
    line = {"id": id, "who": who, "cap": f"**{CAST[who]['name']}:** {text}", "pause": pause}
    line["say"] = say if say else text.replace("**", "")
    return line


CHAPTERS = [
    {
        "id": "cold", "title": "Cold open", "short": "Cold open", "card": False,
        "lines": [
            L("kavya", "narr", "This is Kavya. She is twelve. It is one p.m., thirty-four degrees, and she has just bought chicken rice.", 0.3),
            L("test", "kavya", "I have a Science test on digestion tomorrow. So I'm eating. That counts as revision.", 0.5),
            L("small", "narr", "But this documentary is not about Kavya. It is about the long, dark tube her lunch is about to go down."),
            L("line", "narr", "The **Alimentary Line**. Seven stations. One direction. No refunds.", 0.5,
              say="The allimentary Line. Seven stations. One direction. No refunds."),
            L("this", "narr", "And this is the man who runs it.", 0.4),
            L("thpercy", "percy", "Percy. Short for **peristalsis**.", 0.4),
            L("trains", "percy", "People ask where the trains are. There are no trains. The tunnel is a muscle. The muscle is me.", 0.4),
            L("squeeze", "percy", "I squeeze behind the food and push it along. Like toothpaste. All the way to the other end.", 0.3),
            L("otherend", "percy", "We don't talk about the other end.", 0.9),
            L("years", "narr", "Percy has worked the line for twelve years. Every meal. Every curry puff."),
            L("puff", "percy", "She once had four curry puffs in one recess. I still think about it.", 0.8),
            L("title", "narr", "Mind the Gut. Episode four: The Chicken Rice Express.", 1.2),
        ],
    },
    {
        "id": "tray", "title": "The passenger check", "short": "The tray",
        "lines": [
            L("balanced", "percy", "Passenger check. A **balanced diet** has all seven nutrient groups, in the **right amounts**.", 0.2),
            L("crazy", "percy", "**C**razy **P**eople **F**ind **V**ery **M**any **F**ish **W**et. Carbohydrates, proteins, fats, vitamins, minerals, fibre, water.",
              say="Crazy People Find Very Many Fish Wet. Carbohydrates, proteins, fats, vitamins, minerals, fibre, water.", pause=0.3),
            L("fish", "kavya", "There's no fish. It's chicken rice.", 0.5),
            L("keepup", "percy", "The fish is a memory trick, Kavya. Keep up.", 0.5),
            L("rice", "percy", "Rice: **carbohydrates**, your **main energy source**. Chicken: **protein**, for **growth and repair**."),
            L("fat", "percy", "The rice is cooked in chicken fat. **Fats** store energy, keep you warm, and protect organs."),
            L("fatbad", "kavya", "Hang on. Isn't fat bad for you?", 0.3),
            L("notbad", "percy", "Fat isn't bad. Eating far **more energy** than you use is the problem.", 0.3),
            L("cucumber", "percy", "Three cucumber slices: **vitamins** and **minerals**, needed in tiny amounts. And her."),
            L("phoebe", "phoebe", "Hi. Phoebe. **Fibre**. Nobody can digest me. I just... go through.", 0.7),
            L("thpercy", "percy", "The soup: **water**, the solvent for your reactions. Water and fibre give no energy, but both are **essential**.", 0.5),
            L("missing", "narr", "If a nutrient is missing for a long time, the line posts a service disruption: a **deficiency disease**."),
            L("scurvy", "percy", "No **vitamin C**: **scurvy**. Bleeding gums. Wounds heal slowly."),
            L("rickets", "percy", "No **vitamin D** or **calcium**: **rickets**. Soft, bent bones."),
            L("anaemia", "percy", "No **iron**: **anaemia**. Too few red blood cells. Tired and pale."),
            L("constip", "phoebe", "No fibre: **constipation**. That one's about me. Nobody says thank you.", 0.5),
            L("germ", "percy", "They're caused by a **lack** of something, not a germ. You can't catch them. Don't blame the passengers.", 0.5),
            L("energy", "narr", "Energy needs vary with **age**, how **active** you are, **size**, **sex**, and **pregnancy**."),
            L("upsize", "kavya", "I'm growing. I need more energy. Uncle! Can I upsize?", 0.4),
            L("variety", "percy", "Upsize the cucumber. No single food has everything. **Variety**, Kavya.", 0.6),
        ],
    },
    {
        "id": "mouth", "title": "Station one: the mouth", "short": "The mouth",
        "lines": [
            L("first", "narr", "Station one: the **mouth**. This is where digestion **begins**.", 0.2),
            L("teeth", "percy", "Teeth do **mechanical digestion**: smaller pieces, but no chemical change."),
            L("four", "percy", "**Incisors** cut. **Canines** grip and tear. **Premolars** and **molars** crush and grind.", 0.2),
            L("area", "percy", "Smaller pieces have a bigger **surface area**, so chemical digestion goes faster."),
            L("amy", "amy", "Which is where I come in! Hiii! I'm Amy! **Amylase**! I'm an **enzyme**! I live in the saliva!", 0.3,
              say="Which is where I come in! Hi hi hi! I'm Amy! Amylase! I'm an enzyme! I live in the saliva!"),
            L("thamy", "percy", "Amy has one job. She is very, very excited about it.", 0.6),
            L("starch", "amy", "**Starch** into **sugars**! Starch is a long chain, and I snip it!"),
            L("snip", "amy", "Snip! Snip! Snip!", 0.4, say="Snip... snip... snip!"),
            L("chem", "percy", "**Chemical digestion**: enzymes breaking the bonds inside molecules. It starts here too."),
            L("cracker", "kavya", "Is that why a plain cracker goes sweet if you keep it in your mouth?"),
            L("yes", "amy", "YES! That's me! You can TASTE me working!", 0.5),
            L("why", "narr", "Why bother? Starch, protein and fat are **large, insoluble** molecules: too big to pass through the gut wall."),
            L("soluble", "percy", "So they're broken into **small, soluble** molecules, which can be **absorbed**.", 0.3),
            L("bolus", "percy", "Tongue and saliva roll it into a soft, slippery ball: a **bolus**.", 0.2),
            L("doors", "percy", "Doors closing. Next station: the **oesophagus**.", 0.8),
        ],
    },
    {
        "id": "stomach", "title": "The squeeze and the acid spa", "short": "The stomach",
        "lines": [
            L("tube", "narr", "The **oesophagus**: the tube down to the stomach. Percy's favourite stretch.", 0.2),
            L("waves", "percy", "Waves of muscle squeeze behind the food and push it along. **Peristalsis**. Me."),
            L("gravity", "kavya", "Doesn't gravity just do that?", 0.4),
            L("upside", "percy", "No. You could eat upside down and I'd still get it there. Don't test that.", 0.6),
            L("stomach", "narr", "Next: the **stomach**, a muscular bag that **churns** food and adds **acid**."),
            L("priya", "priya", "Welcome to the acid spa. I'm Priya. **Protease**.", 0.3,
              say="Welcome to the acid spa. I'm Priya. Protee-aze."),
            L("job", "priya", "I break **protein** into **amino acids**. The chicken? Mine."),
            L("thpriya", "percy", "Priya calls it a spa. It's acid. Nobody else calls it a spa.", 0.6),
            L("acid", "kavya", "So the acid digests the food?"),
            L("kills", "priya", "No. Acid **kills harmful microbes**, and gives me the **acidic** conditions I need. I do the digesting.", 0.3),
            L("itself", "kavya", "Then why doesn't the stomach digest itself?"),
            L("mucus", "percy", "A thick layer of slimy **mucus**. And it replaces its lining every few days.", 0.4),
            L("catalyst", "narr", "Amy and Priya are **enzymes**: **biological catalysts**. They **speed up** reactions, without being **used up**."),
            L("alive", "priya", "We're not alive. We're molecules. A million proteins today. No breaks. No lunch.", 0.4),
            L("specific", "priya", "Each enzyme is **specific**. Only protein fits my **active site**, like a key in a lock."),
            L("tried", "amy", "I tried to snip the chicken once.", 0.3),
            L("fit", "priya", "Didn't fit.", 0.7),
            L("notjust", "percy", "It's not all done here. Digestion **starts** in the mouth, and **finishes** in the small intestine."),
            L("still", "phoebe", "Still not digested. If anyone was wondering.", 0.7),
        ],
    },
    {
        "id": "bile", "title": "Bill is not an enzyme", "short": "Bile",
        "lines": [
            L("small", "narr", "Next: the **small intestine**. Here, digestion **finishes**.", 0.2),
            L("bill", "bill", "Bill. **Bile**. Made in the **liver**, stored in the **gall bladder**, squirted in here.", 0.3),
            L("fave", "amy", "Bill's my favourite enzyme!"),
            L("not", "bill", "I'm not an enzyme.", 0.7),
            L("thbill", "bill", "Every day. 'Bill the enzyme.' I don't break any bonds. I'm basically washing-up liquid.", 0.5),
            L("lionel", "lionel", "And I'm Lionel. **Lipase**. I break **fats** into **fatty acids and glycerol**.",
              say="And I'm Lionel. Lypase. I break fats into fatty acids and glycerol."),
            L("both", "lionel", "Fatty acids AND glycerol. Both. Every time. Write both.", 0.4),
            L("blob", "lionel", "But this fat is one enormous blob. I can only work on the outside.", 0.3),
            L("emulsify", "bill", "Stand back. I **emulsify** it: big blobs into tiny droplets. Much more **surface area**.", 1.0),
            L("faster", "lionel", "Now I work much faster. Bill doesn't digest the fat. I do.", 0.3),
            L("alkaline", "bill", "And I'm **alkaline**. I **neutralise** the stomach acid, so the enzymes here can work."),
            L("heard", "priya", "I heard that.", 0.6),
            L("pancreas", "narr", "The **pancreas** sends in enzymes too: more amylase, protease and lipase.",
              say="The pancreas sends in enzymes too: more amylase, protee-aze and lypase."),
            L("more", "amy", "More of me! Hello, me!", 0.5),
            L("helpers", "percy", "Liver, gall bladder, pancreas: food never goes through them. They're **not** part of the alimentary canal.",
              say="Liver, gall bladder, pancreas: food never goes through them. They're not part of the allimentary canal."),
            L("commute", "bill", "I've never once been on the line. I commute.", 0.5),
            L("done", "narr", "Starch is now **glucose**, protein is **amino acids**, and fat is **fatty acids and glycerol**.", 0.3),
            L("still", "phoebe", "I'm still here.", 0.8),
        ],
    },
    {
        "id": "lab", "title": "Meanwhile, in the school lab", "short": "Food tests",
        "lines": [
            L("lab", "narr", "Meanwhile, in Kavya's Science lesson: food tests. Each one gives a **colour change**.", 0.2),
            L("iodine", "kavya", "Starch: add orange-brown **iodine**. With starch, it turns **blue-black**."),
            L("mine", "amy", "Blue-black! That's starch! Mine!", 0.3),
            L("backwards", "percy", "Iodine **starts** orange-brown, and stays that way with no starch. Don't write it backwards.", 0.3),
            L("benedict", "kavya", "Sugar: blue **Benedict's solution**...", 1.0),
            L("nothing", "kavya", "Nothing's happening.", 0.4),
            L("heat", "percy", "You have to **heat** it, Kavya. In a water bath. No heat, no result.", 0.3),
            L("sweep", "narr", "Blue, green, yellow, orange... **brick-red**. A reducing sugar.", 0.6),
            L("biuret", "kavya", "Protein: **biuret** solution. Blue to **purple**.",
              say="Protein: by-yoo-ret solution. Blue to purple."),
            L("purple", "priya", "Purple. Protein. Mine.", 0.3),
            L("fat", "kavya", "Fat: shake it with **ethanol**, pour it into water. A **cloudy white emulsion**."),
            L("move", "bill", "An emulsion! That's my move!"),
            L("lionel", "lionel", "It's still my fat.", 0.5),
            L("control", "narr", "Stronger colour, more nutrient. And a **control**, water with no food, shows what 'negative' looks like."),
            L("thkavya", "kavya", "Four tests. Four colours. And everyone inside me yelling 'mine'. I have enzymes with opinions.", 0.7),
        ],
    },
    {
        "id": "villi", "title": "Vinny and the end of the line", "short": "End of the line",
        "lines": [
            L("villi", "narr", "Back in the small intestine, millions of tiny, finger-like **villi** **absorb** the molecules. One is a **villus**.", 0.2),
            L("vinny", "percy", "This is Vinny. Vinny is a villus. Vinny doesn't talk. Vinny absorbs.", 1.0),
            L("big", "percy", "**Big**: a huge **surface area**. Spread flat, the lining covers about **30 m²**. Half a badminton court.",
              say="Big: a huge surface area. Spread flat, the lining covers about thirty square metres. Half a badminton court."),
            L("thin", "percy", "**Thin**: a wall just **one cell thick**. A short trip into the blood."),
            L("bloody", "percy", "**Bloody**: a good **blood supply**. **Capillaries** carry the glucose and amino acids away."),
            L("lacteal", "percy", "And a **lacteal** in the middle, for the products of **fat** digestion."),
            L("horror", "kavya", "Big, Thin, Bloody, Lacteal. That sounds like a horror film.", 0.6),
            L("large", "narr", "What's left moves on to the **large intestine**, which absorbs most of the remaining **water**."),
            L("bulk", "phoebe", "And this is me. I give the leftovers **bulk**, so Percy has something to push."),
            L("grip", "percy", "Without Phoebe, I'm squeezing nothing. She stops **constipation**."),
            L("useful", "phoebe", "I'm... useful?", 0.7),
            L("rectum", "narr", "The next morning. The waste, **faeces**, waits in the **rectum**, then leaves through the **anus**."),
            L("egestion", "narr", "That's **egestion**: removing **undigested** food that was never absorbed.",
              say="That's ee-jestion: removing undigested food that was never absorbed."),
            L("excretion", "kavya", "Isn't that called excretion?", 0.4, say="Isn't that called excreeshun?"),
            L("no", "percy", "No. **Excretion** removes waste made by your body's own reactions, in your cells.",
              say="No. Excreeshun removes waste made by your body's own reactions, in your cells."),
            L("urea", "percy", "Carbon dioxide, out through your **lungs**. **Urea**, made by the **liver** and removed by the **kidneys**, in urine."),
            L("stop", "phoebe", "Well. This is my stop. Goodbye, everyone.", 1.0),
            L("terminates", "percy", "This service terminates here. Thank you for riding the Alimentary Line.", 0.8,
              say="This service terminates here. Thank you for riding the allimentary Line."),
        ],
    },
    {
        "id": "traps", "title": "The staff save you some marks", "short": "Exam traps",
        "lines": [
            L("intro", "narr", "Before the credits, the staff of the line would like to save you some marks.", 0.3),
            L("t1", "percy", "One. Digestion isn't just the stomach. It starts in the mouth, and finishes in the small intestine.", 0.3),
            L("t2", "amy", "Two! Benedict's must be **heated**! And iodine goes orange-brown to **blue-black**, not the other way round!", 0.3),
            L("t3", "priya", "Three. Enzymes aren't alive, and aren't used up. And stomach acid doesn't digest food. I do.", 0.3),
            L("t4", "bill", "Four. Bile **emulsifies** fat; it doesn't digest it. And liver, gall bladder and pancreas aren't on the line.", 0.3),
            L("t5", "lionel", "Five. Fat gives fatty acids **and** glycerol. Protein gives **amino acids**.", 0.3),
            L("t6", "phoebe", "Six. Most leftover water is absorbed in the **large** intestine. And fibre isn't useless. Apparently.", 0.3),
            L("t7", "kavya", "Seven. You can't catch a deficiency disease. I asked.", 0.5),
            L("return", "narr", "Mind the Gut will return.", 1.0),
            L("vinny", "percy", "Vinny. Anything you'd like to add?", 1.4),
            L("singular", "vinny", "...I'm a villus. Singular.", 0.9, say="I'm a villus. Singular."),
            L("talks", "amy", "He TALKS!", 0.5),
            L("encourage", "percy", "Don't encourage him.", 1.5),
        ],
    },
]
