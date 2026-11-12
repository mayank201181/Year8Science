"""LUNG HAUL, episode 3 ("Arrivals and Departures"): a mockumentary sitcom that teaches Breathing & Gas Exchange.

An original comedy: a documentary crew follows the staff of Lung International, the busiest airport in
the body, inside the chest of Kavya (12). Dennis the diaphragm runs Ground Operations and has done every
single breath for twelve years; Iggy the intercostal muscles is a gym bro who lives between the ribs;
Alvi is one alveolus among hundreds of millions (thin, damp, proud of her lanyard); Ozzie, an oxygen
molecule, is on his first trip; Colin, carbon dioxide, flies business class and knows the brain watches
him; Nigel, nitrogen, comes in and goes out unchanged and never says anything; Smokey (tobacco smoke)
appears in a security training video.

Every line has a speaker (`who`, a key of CAST); make_audio.py voices each speaker differently. Captions
show the speaker's name. `pause` adds silence after a line (comic timing). Content follows
lib/topics/breathing.ts.
"""

META = {
    "name": "Lung Haul",
    "kicker": "Claude Sitcom · Ep 3 · Breathing & Gas Exchange",
    "dek": "A mockumentary from inside the busiest airport in the body, where nobody has had a day off since 2014. {chapters} scenes.",
    "gap": 0.32,          # shorter gaps between lines than the lessons: dialogue moves fast
    "unit": "Scene",
    "lab": "breathing",
    "kit": "sitcom",
    "title": "Claude Sitcom Ep 3: Lung Haul (Breathing & Gas Exchange)",
    "h1": "Lung Haul",
}

# voice, speed, caption name
CAST = {
    "narr":   {"voice": "bm_george",  "speed": 0.96, "name": "Narrator"},
    "kavya":  {"voice": "af_sky",     "speed": 1.02, "name": "Kavya"},
    "dennis": {"voice": "bm_daniel",  "speed": 0.94, "name": "Dennis"},
    "iggy":   {"voice": "am_fenrir",  "speed": 1.12, "name": "Iggy"},
    "alvi":   {"voice": "af_kore",    "speed": 1.1,  "name": "Alvi"},
    "ozzie":  {"voice": "am_puck",    "speed": 1.08, "name": "Ozzie"},
    "colin":  {"voice": "bm_fable",   "speed": 0.98, "name": "Colin"},
    "nigel":  {"voice": "am_santa",   "speed": 0.86, "name": "Nigel"},
    "smokey": {"voice": "bm_lewis",   "speed": 1.0,  "name": "Smokey"},
}


def L(id, who, text, pause=0.0, say=None):
    line = {"id": id, "who": who, "cap": f"**{CAST[who]['name']}:** {text}", "pause": pause}
    line["say"] = say if say else text.replace("**", "")
    return line


CHAPTERS = [
    {
        "id": "cold", "title": "Cold open", "short": "Cold open", "card": False,
        "lines": [
            L("kavya", "narr", "This is Kavya. She is twelve. It is Saturday, and she is doing absolutely nothing.", 0.3),
            L("resting", "kavya", "I'm resting. It's thirty-four degrees outside. The aircon is on. This is a lifestyle.", 0.5,
              say="I'm resting. It's thirty-four degrees outside. The air-con is on. This is a lifestyle."),
            L("count", "narr", "Since I started talking, Kavya has breathed in and out four times.", 0.3),
            L("inside", "narr", "Because inside her chest is the busiest place in her body.", 0.3),
            L("airport", "narr", "Welcome to Lung International. Two terminals, one per lung. Twenty thousand flights a day.", 0.4),
            L("hi", "dennis", "Hi. Dennis. **Diaphragm**. Head of Ground Operations.", 0.3),
            L("floor", "dennis", "I'm the dome of muscle under the lungs. I am, literally, the floor.", 0.5),
            L("every", "dennis", "Every breath she takes, that's me. Contract. Relax. Contract. Relax.", 0.3),
            L("born", "dennis", "Since the day she was born. Twelve years. No lunch break.", 0.5),
            L("number", "dennis", "That was breath eighty-seven million, six hundred thousand and twelve.", 0.6),
            L("thirteen", "dennis", "And thirteen.", 1.0),
            L("title", "narr", "Lung Haul. Episode three: Arrivals and Departures.", 1.2),
        ],
    },
    {
        "id": "arrivals", "title": "Arrivals: the long way down", "short": "Arrivals",
        "lines": [
            L("batch", "narr", "Arrivals. A fresh breath is coming in through Kavya's nose.", 0.2),
            L("ozzie", "ozzie", "Hello! Ozzie! **Oxygen**! First time in a lung! I brought a backpack!", 0.3),
            L("thozzie", "dennis", "Ozzie is oxygen. Two atoms. One molecule. Zero chill.", 0.6),
            L("nose", "narr", "The best way in is the **nose**. It **warms** the air, makes it **moist**, and **filters** it."),
            L("spa", "ozzie", "Warm, damp, and a bit hairy. It's like a spa!", 0.5),
            L("trachea", "narr", "Next, the **trachea**, or windpipe. **C-shaped rings of cartilage** stop it collapsing."),
            L("goblet", "narr", "Its lining has **goblet cells**, which make sticky **mucus** to trap dust and germs."),
            L("cilia", "narr", "And **ciliated cells**, whose tiny **cilia** **sweep** the mucus up to the throat, to be swallowed."),
            L("thescal", "dennis", "We call it the **mucus escalator**. The only escalator where, at the top, you get swallowed.", 0.6),
            L("eating", "kavya", "I'm literally eating right now.", 0.8),
            L("bronchi", "narr", "The trachea splits into two **bronchi**, one per lung. Just one is a **bronchus**."),
            L("bronchioles", "narr", "Each bronchus branches again and again, into tiny tubes called **bronchioles**."),
            L("maze", "ozzie", "Left, right, left, left... This is worse than an MRT interchange!", 0.4),
            L("alveoli", "narr", "At the very ends: tiny air sacs called **alveoli**. Just one is an **alveolus**.",
              say="At the very ends: tiny air sacs called alvee-oh-lie. Just one is an alveolus."),
            L("tbba", "dennis", "Trachea, bronchi, bronchioles, alveoli. **Tall Brontosaurs Breathe Air**. Don't ask me why. I'm a muscle.", 0.5,
              say="Trachea, bronchi, bronchioles, alvee-oh-lie. Tall Brontosaurs Breathe Air. Don't ask me why. I'm a muscle."),
            L("nigel", "narr", "Also arriving: Nigel. Nigel is **nitrogen**. We'll come back to Nigel.", 1.2),
        ],
    },
    {
        "id": "ground", "title": "Ground operations", "short": "Breathing in & out",
        "lines": [
            L("vent", "narr", "**Breathing**, or **ventilation**, just moves air in and out. No chemistry. Only muscles."),
            L("nomuscle", "dennis", "Here's what nobody knows. The lungs have **no muscles**. They can't move themselves.", 0.3),
            L("sponges", "dennis", "They're two big, pink sponges. Lovely. Useless.", 0.5),
            L("iggy", "iggy", "So who does the work? US! Iggy! **Intercostal muscles**! I live between the ribs!", 0.3),
            L("thiggy", "dennis", "Iggy is the muscles between the ribs. To Iggy, every day is rib day.", 0.6),
            L("rule", "narr", "Air follows one simple rule: gas moves from **high pressure** to **low pressure**."),
            L("in", "dennis", "Breathing in. I **contract**, and I **flatten**. I move down.", 0.2),
            L("up", "iggy", "Me too! I **contract**! I pull the ribs **up and out**! Up and OUT, baby!", 0.3),
            L("volume", "narr", "The chest gets bigger: its **volume increases**. The air inside spreads out, so its **pressure falls**."),
            L("rush", "narr", "Now it's lower than the pressure outside, so air is **pushed in**."),
            L("suck", "kavya", "So my lungs suck the air in?", 1.2),
            L("nobody", "dennis", "Nobody sucks anything. We make the room bigger, and the air outside pushes in.", 0.6),
            L("out", "narr", "Breathing out is the reverse. The muscles **relax**: Dennis domes up, the ribs drop **down and in**."),
            L("outvol", "narr", "The **volume decreases**, the **pressure rises**, and air is **pushed out**."),
            L("passive", "dennis", "At rest, breathing out is mostly **passive**. The stretched lungs just spring back. My favourite part.", 0.3),
            L("relax", "dennis", "I just... relax.", 0.9, say="I just. Relax."),
            L("chain", "dennis", "So. **Volume up, pressure down, air in. Volume down, pressure up, air out.**", 0.4),
            L("hand", "iggy", "Breathing IN, the muscles **contract**! Not relax! Write it on your hand!", 0.5,
              say="Breathing in, the muscles contract! Not relax! Write it on your hand!"),
        ],
    },
    {
        "id": "gates", "title": "Gate 271,000,004", "short": "Gas exchange",
        "lines": [
            L("end", "narr", "Ozzie reaches the end of the line: one alveolus.", 0.2),
            L("alvi", "alvi", "Welcome to Gate two hundred and seventy-one million and four! I'm Alvi! I'm an **alveolus**!", 0.3),
            L("thalvi", "alvi", "There are between three and five hundred million of us. I'm the one with the lanyard.", 0.4),
            L("all", "alvi", "We all have lanyards.", 0.7),
            L("net", "narr", "Each alveolus is wrapped in a net of **capillaries**, the tiniest blood vessels."),
            L("back", "narr", "This blood is back from the body: **low in oxygen**, **high in carbon dioxide**."),
            L("diffusion", "narr", "So the gases swap by **diffusion**: each spreads from a **high concentration** to a **low** one."),
            L("off", "alvi", "Lots of oxygen in here, not much in the blood. Off you go, Ozzie!"),
            L("whee", "ozzie", "I'm diffusing! Look at me go!", 0.3),
            L("rbc", "narr", "In the blood, a **red blood cell** picks Ozzie up, using **haemoglobin**.",
              say="In the blood, a red blood cell picks Ozzie up, using heemoglobin."),
            L("co2", "narr", "And **carbon dioxide** diffuses the other way, from the blood into the air."),
            L("colin", "colin", "Colin. **Carbon dioxide**. Business class. Do keep up.", 0.5),
            L("pumps", "kavya", "Wait. Who pushes them across?"),
            L("nopump", "alvi", "Nobody! It's **passive**! Just the **concentration gradient**!", 0.3),
            L("steep", "dennis", "And every breath brings fresh air, keeping the gradient **steep**. That's why I can't stop. Ever.", 0.6),
            L("area", "alvi", "Why are we so fast? One! A **huge surface area**. Together we cover about seventy square metres. A badminton court!"),
            L("thin", "alvi", "Two! My wall is **one cell thick**. So is the capillary's. A tiny **distance** to diffuse."),
            L("thdiet", "alvi", "It's not a diet. It's a job requirement.", 0.6),
            L("moist", "alvi", "Three! I'm **moist** inside. Gases must **dissolve** before they can diffuse."),
            L("stop", "kavya", "Please stop saying moist.", 0.6),
            L("blood", "alvi", "Four! A **rich blood supply** carries the oxygen away, so the gradient stays steep!"),
            L("tims", "dennis", "**TIMS**. **T**hin walls, lots of blood **I**n the capillaries, **M**oist lining, big **S**urface area.", 0.4,
              say="Tims. Thin walls, lots of blood In the capillaries, Moist lining, big Surface area."),
            L("three", "narr", "So: **breathing** moves air. **Gas exchange** swaps gases. **Respiration** happens in cells."),
            L("eq", "dennis", "Ozzie's off to a muscle cell, for respiration: **glucose + oxygen → carbon dioxide + water**.",
              say="Ozzie's off to a muscle cell, for respiration: glucose plus oxygen gives carbon dioxide plus water."),
            L("mitch", "dennis", "Say hi to Mitch for me. He won't say hi back.", 0.7),
        ],
    },
    {
        "id": "departures", "title": "Departures", "short": "Air in vs air out",
        "lines": [
            L("board", "narr", "Departures. The air Kavya breathes out isn't the air she breathed in."),
            L("oxygen", "narr", "**Oxygen**: about **21%** of the air going in. About **16%** coming out.",
              say="Oxygen: about twenty-one percent of the air going in. About sixteen percent coming out."),
            L("plane", "colin", "Most of the oxygen never even gets off the plane. That's why rescue breaths work.", 0.4),
            L("me", "colin", "And me. **Carbon dioxide**: about **0.04%** in, about **4%** out. A hundred times more. I'm trending.", 0.4,
              say="And me. Carbon dioxide: about zero point zero four percent in, about four percent out. A hundred times more. I'm trending."),
            L("pure", "kavya", "So I breathe out pure carbon dioxide?"),
            L("wish", "colin", "Darling, I wish. I'm only four percent.", 0.6),
            L("vapour", "narr", "Breathed-out air also has more **water vapour**, and it's **warmer**."),
            L("nitrogen", "narr", "And Nigel. **Nitrogen**: about **78%** of the air. In. Out. **Unchanged**.", 0.6,
              say="And Nigel. Nitrogen: about seventy-eight percent of the air. In. Out. Unchanged."),
            L("thnigel", "dennis", "The body doesn't use nitrogen. Nigel just likes the trip.", 0.9),
            L("lime", "narr", "To test for carbon dioxide, use **limewater**. It turns from **clear** to **cloudy**, or milky."),
            L("carpet", "colin", "Clear to cloudy. Some call it a test. I call it a red carpet.", 0.5),
            L("proves", "narr", "Breathed-out air turns limewater cloudy much **faster** than room air. It has far **more carbon dioxide**."),
        ],
    },
    {
        "id": "run", "title": "The fitness test", "short": "Exercise",
        "lines": [
            L("monday", "narr", "Monday. The school fitness test: the two point four kilometre run.", 0.3),
            L("names", "kavya", "Two point four kilometres. Thirty-four degrees. Who designed this? I want names.", 0.5),
            L("faster", "narr", "As she runs, the cells in her leg muscles **respire faster**, to release more energy."),
            L("need", "narr", "So they need **more oxygen**, and make **more carbon dioxide**."),
            L("brain", "narr", "Her **brain** monitors the carbon dioxide in her blood. When it **rises**: breathe faster, and deeper!"),
            L("thcolin", "colin", "The brain doesn't watch oxygen, darling. The brain watches **me**. I'm basically famous.", 0.6),
            L("rate", "dennis", "**Breathing rate** up! More breaths per minute! Go, go, go!", 0.2),
            L("depth", "iggy", "And **breathing depth** up! Bigger breaths! This is the BEST day of my LIFE!", 0.4),
            L("heart", "narr", "Her **heart rate** rises too, pumping oxygen-rich blood to her muscles faster."),
            L("done", "kavya", "Finished. Lying down. Forever.", 0.6),
            L("debt", "narr", "After she stops, she keeps panting to repay the **oxygen debt**: extra oxygen to break down **lactic acid**."),
            L("larry", "dennis", "Larry's been here. I can tell.", 0.6),
            L("recovery", "narr", "A fitter person's breathing gets back to normal faster. That's a better **recovery rate**."),
            L("thagain", "dennis", "Iggy has asked if we can do that again tomorrow. We cannot.", 0.8),
        ],
    },
    {
        "id": "smoke", "title": "Security training video", "short": "Smoking",
        "lines": [
            L("drill", "dennis", "Relax. It's a training video. Kavya is twelve and doesn't smoke. But every airport should know this face.", 0.4),
            L("smokey", "smokey", "Evening. Name's Smokey. **Tobacco smoke**. I've brought a little luggage.", 0.4),
            L("tar", "narr", "First, **tar**: a sticky brown substance that coats the airways."),
            L("cancer", "narr", "Tar contains chemicals that cause **cancer**. It is a **carcinogen**."),
            L("cilia", "narr", "Tar also paralyses the **cilia**, so the mucus escalator stops: **smoker's cough** and chest infections."),
            L("order", "dennis", "Escalator out of order. Indefinitely.", 0.5),
            L("co", "narr", "Next, **carbon monoxide**, a poisonous gas. It grabs **haemoglobin** more strongly than oxygen does.",
              say="Next, carbon monoxide, a poisonous gas. It grabs heemoglobin more strongly than oxygen does."),
            L("seats", "ozzie", "Hey! Those are our seats! Now the blood carries **less oxygen**!", 0.3),
            L("nicotine", "smokey", "And **nicotine**. The **addictive** drug. Once you've met me, I'm very hard to leave.", 0.3),
            L("selling", "dennis", "That is not a selling point.", 0.5),
            L("emph", "narr", "Years of smoking can cause **emphysema**: the walls between alveoli break down into fewer, bigger sacs.",
              say="Years of smoking can cause emfiseema: the walls between alvee-oh-lie break down into fewer, bigger sacs."),
            L("area", "alvi", "Fewer walls, **less surface area**. Less oxygen gets in, so the person is breathless, even at rest.", 0.4),
            L("cancers", "narr", "Smoking also causes **lung cancer** and **bronchitis**."),
            L("escort", "dennis", "Security, please escort Smokey out. And do not let him back in.", 0.7),
        ],
    },
    {
        "id": "traps", "title": "The staff save you some marks", "short": "Exam traps",
        "lines": [
            L("intro", "narr", "Lung International never closes. But first: some free marks from the staff.", 0.3),
            L("t1", "dennis", "One. Breathing is **not** respiration. Respiration is a chemical reaction in your cells.", 0.3),
            L("t2", "iggy", "Two! Breathing **in**, the diaphragm and intercostals **contract**! Breathing out, they relax!", 0.3),
            L("t3", "kavya", "Three. Lungs don't suck. The **pressure** in your chest drops, and air gets pushed in. I listened.", 0.3),
            L("t4", "alvi", "Four! Oxygen gets into the blood by **diffusion**. Nobody pumps it!", 0.3),
            L("t5", "colin", "Five. Breathed-out air is still about **16% oxygen**. I'm only about **4%**.", 0.3,
              say="Five. Breathed-out air is still about sixteen percent oxygen. I'm only about four percent."),
            L("t6", "ozzie", "Six! Limewater turns **cloudy** with carbon dioxide. It doesn't go clear!", 0.3),
            L("water", "ozzie", "Also, I've been respired. Half of me is in one water molecule, half in another. Long story. Ask Mitch!", 0.7),
            L("return", "narr", "Lung Haul will return. In about four seconds.", 1.0),
            L("anything", "dennis", "Nigel. You've been here the whole episode. Anything you'd like to say?", 1.4),
            L("no", "nigel", "No.", 1.0),
            L("unchanged", "dennis", "Unchanged.", 1.5),
        ],
    },
]
