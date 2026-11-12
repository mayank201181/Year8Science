# THE POWERHOUSE, Episode 1 "Sports Day": storyboard

A mockumentary sitcom (documentary crew, characters talk to camera) that teaches Respiration.
Audience: a 12-year-old watching while eating. It must be FUNNY first, and teach every idea clearly.
Read `script.py`: every line has a speaker (`who`), and its caption shows the speaker's name.

## Comedy rules (the most important part)

- **Mouths:** only the speaker's mouth moves. Every frame: `c.set({ t, talk: scTalk(S, t, 'mitch'), mood, look })`.
  For the twins: `talk: scTalk(S,t,'otto'), talkB: scTalk(S,t,'oscar')`.
- **Reactions sell the joke.** Characters who are listening react: they look at the speaker (`look` -1..1)
  and change mood on the beat (Mitch goes `deadpan` at every silly remark, Gloria `happy`, Carl `sad`,
  Larry `happy`/`smug`). Moods: neutral, happy, smug, annoyed, sad, shock, deadpan.
- **Pauses are punchlines.** Lines with a `pause` are followed by silence. Hold the reaction there, for
  example a slow push-in on Mitch's deadpan face, Wally blinking, or Carl staring.
- **Talking heads** (line ids starting `th_`, plus the ones marked TH below) use the confessional shot:
  `scConfessional(root, kind)` full stage, the character big (s about 1.5) at about (430, 380), the mug or
  a prop where it helps. The first time a character appears in a confessional, show
  `scLowerThird(root, NAME, ROLE)` for about 3 s. Cut instantly (fade over 0.25 s at most): sitcom cuts are snappy.
- **Science on screen:** whenever a key word or equation is said, it appears big and clear (chip, card or
  whiteboard), with equation subscripts as real `tspan`s. The jokes can be silly; the science must be exact.
- Keep the engine's chapter tag area clear (x < 560, y < 100). Labels at least 26 px.

## Cast (lib.js `scChar(root, kind, { s })`)

| kind | who | look | lower third |
| --- | --- | --- | --- |
| mitch | Mitch, a mitochondrion: tired, sarcastic, office tie, `scMug` | orange bean | MITCH / Mitochondrion, left thigh |
| gloria | Gloria, glucose: bubbly, a lot | amber hexagon, bow | GLORIA / Glucose. The fuel. |
| twins | Otto (left, spiky tuft) and Oscar (right, glasses): one O₂ molecule | two red balls | OTTO & OSCAR / Oxygen. Always a pair. |
| carl | Carl, carbon dioxide: mopey, unwanted | grey C, red O ends | CARL / Carbon dioxide. Waste product. |
| wally | Wally, water: silent, chill | blue O, white H | WALLY / Water. Doesn't talk. |
| larry | Larry, lactic acid: chaotic emergency cover | pink spiky, headband | LARRY / Lactic acid. Emergency cover. |
| fern | Fern, a plant-cell mitochondrion: relentlessly cheerful | green bean, flower | (on a video call) FERN / Plant cell, windowsill |
| bao | Bao, a yeast: calm, dry | cream budding cell, baker's hat | BAO / Yeast. A fungus. Bakery. |
| kavya | Kavya, 12, the human: exasperated | girl in PE shirt "8" | KAVYA, 12 / Did not sign up for this. |

Sets: `scOffice` (inside the mitochondrion), `scBlood` (blood vessel), `scTrack` (Sports Day, sunny),
`scVideoCall` (Fern), a bakery (draw it in scene 6). Kavya full body: `scKavyaBody` (+ kit `runPose`).

## 0 cold: Cold open (card: none)
- kavya: `scTrack`; Kavya (bust, s 1.3) in front, mood annoyed, eyes on camera; a clock or "800 m" chip.
- signed: Kavya talks (deadpan/annoyed). Lower third KAVYA.
- small: documentary zoom: the camera pushes into Kavya's thigh; the field blurs into a mosaic of muscle cells.
- thigh: muscle cells (long, striped) each dotted with tiny mitochondria; label "muscle cells", "mitochondria".
- this: zoom right into one mitochondrion: it turns out to be Mitch, who looks up, unimpressed.
- hi, before: Mitch confessional (TH), deadpan; lower third MITCH. "the powerhouse of the cell" appears as a
  sarcastic quote card on "before".
- mug: Mitch lifts `scMug` ("#1 POWERHOUSE"). havemug: hold the mug up, deadpan, in silence (pause 0.9 s).
- family: a framed family photo on the wall: a little rod-shaped bacterium, "Great-great-...-grandpa, 2 billion years ago".
- dayoff: a calendar where every day says WORK. Mitch sad on "I don't know when my birthday is".
- title: the show logo "THE POWERHOUSE" with "Episode 1: Sports Day"; the whole cast pops in below it in a
  row, bobbing (classic sitcom title card). Hold it.

## 1 delivery: The breakfast delivery
- time: `scBlood`; a "9:00 AM" clock; Gloria floats along in the blood plasma.
- gloria: the office (`scOffice`): Gloria bursts in, sparkles, happy; lower third GLORIA. Mitch at his desk.
- th_gloria (TH): Mitch confessional, deadpan.
- stored: Gloria glows; little yellow sparks inside her; chip "energy stored in chemical bonds".
- needox: Mitch, annoyed, points at the door.
- otto1, oscar1: the twins arrive riding a red blood cell like a taxi (oxygen really is carried by red blood
  cells); otto2–otto3: they introduce themselves; lower third OTTO & OSCAR; "O₂" chip on "O two".
- th_twins (TH): Mitch confessional, annoyed.
- aerobic: big title chip "AEROBIC RESPIRATION = with oxygen".
- word: the word equation builds on a whiteboard, term by term: glucose + oxygen → carbon dioxide + water,
  then a yellow energy burst labelled "energy released".
- party: Gloria and the twins dance (disco lights); fine: Mitch deadpan; the atoms visibly swap partners.
- carl: a grey puff; Carl appears, sad; lower third CARL.
- thrown: Carl is shown out of a door marked EXIT; a route sign "blood → lungs → out of the mouth".
- breath: cutaway: Kavya breathes out; tiny CO₂ molecules puff from her mouth. Carl: annoyed.
- wally: Wally appears and waves; lower third WALLY. Hold 1 s of silence: Wally just blinks. Everyone stares.
- symbol, eq: whiteboard: **C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O** (real subscripts, big numbers amber).
- six, plus, count: the twins count oxygen atoms; red O counters fill "18" on the left and "18" on the right.
- balance: a balance scale levels: "same atoms, new partners".
- make: Gloria excited. no: slow push-in on Mitch's deadpan face (the pause is the joke). "No."
- cant: chips "made ✗" and "released ✓".
- th_exam (TH): Mitch confessional; a small inset of a cartoon examiner crying into a teacup.

## 2 energy: Where does the energy go?
- where, list: office; Mitch with `scClipboard`, deadpan.
- muscles, growth, warm: request tickets fly in one by one: a flexing arm (movement), building blocks or a
  protein chain (growth and repair), a thermometer at 37 °C (keeping warm).
- singapore: cut to Kavya on the track (bust), sweating, a "34 °C" sun; mood annoyed.
- mammal (TH): Mitch confessional; chip "mammals and birds keep a steady body temperature".
- many: zoom out: a muscle cell packed with mitochondria.
- colleagues: rows of tiny Mitches with ties, "× 2000".
- accounts: one tiny Mitch with glasses in an "ACCOUNTS" box; Mitch side-eyes it.
- folds, accordion: cutaway of a mitochondrion; the folded inner membrane highlighted, "folded = large surface
  area"; the folds squeeze like an accordion.

## 3 breathing: Respiration is NOT breathing
- mistake: a red "COMMON MISTAKE" stamp thumps onto the screen.
- ask: Kavya (bust), curious. Then the 1.4 s pause: hard cut to Mitch, slow push-in, deadpan.
- stare: "No."
- breath: left panel: lungs filling and a delivery van: "BREATHING: moving air in and out (muscles, ribs)".
- resp: right panel: a factory with Mitch: "RESPIRATION: a chemical reaction in every cell".
- brings, uses: the twins ride in through the lungs (left) and get used up in the factory (right).
- out: Carl leaves through the lungs, sighing.
- everyone: a fish, a bacterium and a potted plant, each with "respires ✓".
- fern–shifts: `scVideoCall` with Fern; a day/night switch (sun, moon): "respiration: ALWAYS ON",
  "photosynthesis: only in light"; Fern happy, Mitch deadpan.
- th_fern (TH): Mitch, annoyed, side-eye.
- opposite: two big arrows: "photosynthesis STORES energy in glucose" ⇄ "respiration RELEASES it".

## 4 race: The eight hundred metres
- eleven, ready: `scTrack`; Kavya (`scKavyaBody`) at the start line, nervous; "800 m".
- go: "BANG"; Kavya runs (`runPose`, track scrolls); an "energy needed" gauge shoots up.
- allhands: office: red alarm light flashing, Mitch in shock.
- coming, deeper, cant: the twins on their red-blood-cell taxi, stuck in traffic; a heart beating faster
  (bpm number rising) and lungs breathing faster; "not fast enough".
- noox: Mitch picks up a red emergency phone: "CALL LARRY".
- anaerobic: chip "ANAEROBIC RESPIRATION = without oxygen".
- larry: Larry bursts through the office wall; lower third LARRY.
- th_larry (TH): Mitch confessional, deadpan.
- larryeq: whiteboard: glucose → lactic acid (+ a little energy).
- little, hurry: Gloria is only partly broken down; energy bars: aerobic a long bar, anaerobic a short bar,
  "much less energy".
- worth: Mitch shrugs.
- fire: Kavya running, legs glowing orange-red, sweat (`sweat: 1`).
- me, welcome: pink lactic acid dots pile up in the muscle; "MUSCLE FATIGUE"; Larry smug, then a bow.
- finish, fourth: finish tape; Kavya flat on the grass; a "4th of 5" sign.

## 5 debt: Paying the oxygen debt
- still, why: Kavya lying on the grass, panting (big breath puffs), sweat.
- mess: office: pink lactic acid everywhere; Mitch annoyed.
- here, whereis: the twins arrive.
- debt: a big invoice: "OXYGEN DEBT: extra oxygen needed to break down lactic acid"; lactic acid dots fade.
- borrowed, bills: the invoice gets a "PAY BACK WITH OXYGEN" stamp.
- bye: the twins escort Larry out the door; Larry waves cheerfully.
- compare (TH-like summary): a two-column card: AEROBIC (oxygen ✓, energy LOTS, products carbon dioxide +
  water) vs ANAEROBIC in muscles (oxygen ✗, energy A LITTLE, product lactic acid).

## 6 bao: Cousin Bao from the bakery
- bakery: a warm bakery: shelves of loaves and buns, a "BAKERY" sign.
- hi (TH): Bao confessional; lower third BAO. "Don't make that face": Bao annoyed.
- noox: chip "FERMENTATION (yeast, no oxygen)".
- eq: whiteboard: glucose → ethanol + carbon dioxide (+ a little energy).
- me: Carl appears in the bakery, shock.
- you: dough cross-section: carbon dioxide bubbles grow and the dough rises.
- wants, cry: Carl moved (sad, then happy).
- ethanol: the oven; violet ethanol molecules float away as it bakes; a bottle silhouette covered by a sticky
  note "Kavya is 12".
- th_cousin (TH): Mitch confessional, deadpan.
- limewater, trick: a test tube of clear limewater; bubbles; it turns milky; Carl takes a bow ("clear → milky").

## 7 traps: The cast saves you some marks
- intro: "6 EXAM TRAPS" heading.
- t1–t6: quick confessional cuts, one per speaker (Mitch, Gloria, Fern, Larry, the twins, Carl), each with
  its trap on a card: 1 respiration ≠ breathing; 2 energy is released, not made; 3 plants respire all the time;
  4 muscles make lactic acid, not ethanol; 5 aerobic releases much more energy; 6 anaerobic in muscles makes no
  carbon dioxide. story: Carl sad.
- return: the show logo returns: "THE POWERHOUSE will return".
- wally, hi, saving (stinger): Wally's confessional; long silence while he blinks; "...Hi." (his only word,
  tiny mouth); Mitch deadpan. Final frame: Wally waving, logo.
