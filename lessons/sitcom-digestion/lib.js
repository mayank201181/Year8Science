/* MIND THE GUT (Claude Sitcom Ep 4, Food & Digestion): cast, sets and props.
   Bundled after engine lib.js, kit.js and sitcom.js (META kit "sitcom"), so scWho, scTalk, scMake, scKavya,
   scKavyaBody, scConfessional, scLowerThird, scVideoCall, scClipboard and SC_INK are all available.
   Every top-level name here starts with mg / MG_, except cast().

   CAST: cast(parent, kind, o) -> g, origin at the character's centre, about 200 px tall at s = 1
     o: { s (scale), mood (default mood) }
     g.set({ t, talk, mood, look, sweat, still, ... })   call every frame; talk = scTalk(S, t, kind)
       moods: neutral | happy | smug | annoyed | sad | shock | deadpan;  look -1..1 (pupils left/right)
     kinds:
       'percy'  Percy, peristalsis: a pink segment of muscular gut tube in an MRT staff cap, arms akimbo,
                tired bags under his eyes. Default mood deadpan. Extra: squeeze 0..1 pinches his waist
                (his whole job); g.set({ ..., squeeze: 0.5 + 0.5 * Math.sin(t * 5) }) while he demonstrates.
       'amy'    Amy, amylase (enzyme): round sky-blue blob, hexagon-shaped notch in her top right (her ACTIVE
                SITE: a glucose hexagon of a starch chain fits it), curl on top, pink cheeks, name tag.
                Default mood happy. Extra: sparkle 0..1 shows a twinkling star by her head.
       'priya'  Priya, protease (enzyme): rounded purple square, SQUARE notch in her left side (active site:
                the square protein beads of mgChain('protein') fit it), towel turban with safety goggles
                pushed up (the "acid spa"). Default mood smug.
       'lionel' Lionel, lipase (enzyme): tall teal oval, comb-shaped notch on top with three slots (active site:
                the three fatty-acid tails of mgFat fit it), round glasses, bow tie. Default mood neutral.
       'bill'   Bill, bile (NOT an enzyme, and no active site): a yellow-green squeezy bottle with a red
                nozzle cap and a label "BILE / not an enzyme". Default mood deadpan.
                Extra: bubbles 0..1 shows soap bubbles rising from his nozzle (when he emulsifies).
       'phoebe' Phoebe, fibre: a tall, thin, pale-green celery stalk with stringy fibres and drooping leaves,
                thin arms hanging. Default mood sad.
       'vinny'  Vinny, a villus: a small pink finger shape with fuzzy microvilli "hair" on top, a cream lacteal
                and red capillary loops showing faintly inside. Never talks (until the stinger).
                Default mood neutral. Extra: wave 0..1 makes him sway side to side (his only gesture).
       'kavya'  Kavya, 12 (the shared scKavya bust: head and shoulders, PE shirt "8"). Use scKavyaBody for full body.
   mgConf(parent, kind)        the talking-head background (scConfessional) in that character's colours; g.set(p, t)
   MG_NAME[kind]               [lower-third NAME, ROLE] for scLowerThird, e.g. scLowerThird(root, ...MG_NAME.percy)

   SETS (full stage 1200 x 750 unless stated; the chapter tag area x < 560, y < 100 has only background art)
     mgHawker(parent)          hawker centre: roof with two ceiling fans, four stalls ("CHICKEN RICE" second
                               from left), tiled floor, two background tables. g.upd(t) spins the fans.
     mgTable(parent, w)        a foreground round marble table top (w wide, default 760), centred at (0,0): put
                               the tray on it.
     mgPlatform(parent, name, code)  a station platform of the Alimentary Line inside the gut: pink muscular walls
                               and ceiling ribs, platform screen doors with a dark tunnel behind, grey platform with a
                               yellow safety strip (y 570-590), and a hanging station sign at the top centre.
                               g.sign.setName(name, code) changes it, e.g. ('MOUTH', 'AL1'). g.led (amber LED text over
                               the doors, setText(g.led, ...)).
     mgTunnel(parent)          inside the oesophagus, looking down it: rings of muscle; g.upd(t, k) sends squeeze
                               waves away from the camera (k = strength 0..1, default 1).
     mgSpa(parent)             inside the stomach, the "acid spa": folded (rugae) walls lined with a pale MUCUS layer
                               (g.mucus: highlight it with op), a bubbling pool of acid with a tiled rim, neon "ACID SPA"
                               sign and a "pH 2" tile. g.upd(t) bubbles the pool.
     mgGut(parent)             inside the small intestine: rows of swaying villi above and below, and a duct opening in
                               the ceiling at g.duct = [x, y] (where bile and pancreatic juice squirt in). g.upd(t).
     mgLab(parent)             school science lab: whiteboard (g.board = [x, y, w, h]), window, poster, a long bench
                               whose top is at y = 520.
     mgRack(parent, n, gap)    a wooden test-tube rack with n kit testTubes (44 x 190) gap apart, centred, tube bottoms
                               at y about 60; g.tubes[i].set(level, colour) fills a tube.
     mgEnd(parent)             the large intestine, the end of the line: pouchy brown-pink tunnel, a buffer stop with an
                               "END OF LINE" sign at the right. g.upd(t) shows blue water drops being absorbed into
                               the walls (g.drops: fade it in for "absorbs most of the remaining water").
   PROPS (drawn around (0,0))
     mgSign(parent, name, code, w)  station sign (white, roundel with code, name), w default 520; g.setName(name, code)
     mgLineMap(parent)         the line map, about 1000 x 300: seven stations M-O-S-S-L-R-A with their first letters in
                               amber (the mnemonic), and LIVER, GALL BLADDER, PANCREAS in grey ABOVE the line, joined
                               only by dashed ducts to the small intestine, under a "NOT ON THE LINE" tag.
                               g.set(active, off): active = station index 0..6 to highlight (-1 none), off 0..1 shows
                               the three helper organs. g.x(i) = x of station i (stations at y = 0).
     mgTray(parent)            the chicken rice lunch, about 470 x 200: plate with rice (g.parts.rice), chicken slices
                               (chicken), the shine of the chicken fat (fat), three cucumber slices (cucumber), chilli
                               dish (chilli) and a bowl of soup (soup). Highlight a part with op() or a ring.
     mgBoard(parent, w, h)     LED "SERVICE DISRUPTION" board (default 660 x 190); g.msg(line1, line2)
     mgMic(parent, s)          Percy's announcement microphone with a coiled cord
     mgChain(parent, kind, n)  a big molecule as a chain of n beads: 'starch' (amber glucose hexagons) or 'protein'
                               (rounded squares of 5 colours = different amino acids). g.set(p): bonds break and the
                               beads drift apart (p = 1: separate small molecules). g.beads[i] for one bead.
     mgFat(parent, s)          a fat molecule: one glycerol (cream bar, left) holding three fatty acids (yellow zigzag
                               tails). g.set(p) pulls the fatty acids off the glycerol. g.glycerol, g.acids.
     mgBlob(parent, r)         a big fat blob (radius r, default 90) that EMULSIFIES: g.set(p) breaks it into 16 tiny
                               droplets spread over about 2.4 r (same fat, much bigger surface area).
     mgBolus(parent, r)        the bolus: a soft beige ball with rice and cucumber flecks (radius r, default 40)
     mgPeriTube(parent, len)   side view of the oesophagus, len long (default 900), centred: g.set(p) moves a ring
                               of contraction along it, squeezing BEHIND the bolus (g.bolus) and pushing it forward;
                               the wall ahead stays relaxed.
     mgVillusCut(parent)       diagram of one villus, about 260 x 440, base at y = 210: wall one cell thick (g.wall),
                               red capillary network (g.cap), cream lacteal in the middle (g.lacteal). Label with labelLine.
     mgTeeth(parent)           the four types of teeth in a row, 130 apart, crowns up, on a gum: incisor, canine,
                               premolar, molar (g.teeth[0..3], centres at x = -195, -65, 65, 195).
*/

const MG_LINE = '#E0457B', MG_LINEDK = '#9E2453', MG_NAVY = '#1F3A6E';

/* ---------- the cast ---------- */
function mgNotchCircle(R, a1, a2, depth) {
  // a circle of radius R with a half-hexagon notch cut between angles a1 < a2 (radians, SVG y down)
  const p1 = [R * Math.cos(a1), R * Math.sin(a1)], p2 = [R * Math.cos(a2), R * Math.sin(a2)];
  const am = (a1 + a2) / 2, n = [-Math.cos(am), -Math.sin(am)];
  const dx = p2[0] - p1[0], dy = p2[1] - p1[1], l = Math.hypot(dx, dy), u = [dx / l, dy / l];
  const q1 = [p1[0] + n[0] * depth + u[0] * l * 0.25, p1[1] + n[1] * depth + u[1] * l * 0.25];
  const q2 = [p2[0] + n[0] * depth - u[0] * l * 0.25, p2[1] + n[1] * depth - u[1] * l * 0.25];
  const f = v => v.toFixed(1);
  return `M${f(p2[0])},${f(p2[1])} A${R},${R} 0 1 1 ${f(p1[0])},${f(p1[1])} L${f(q1[0])},${f(q1[1])} L${f(q2[0])},${f(q2[1])} Z`;
}
function mgPercyBody(sq) {
  // muscular tube segment; sq 0..1 pinches the waist (below the face)
  const w = 88, pinch = y => sq * 30 * Math.exp(-Math.pow((y - 64) / 26, 2));
  let r = '', l = '';
  for (let y = -46; y <= 92; y += 6) { r += ` L${(w - pinch(y)).toFixed(1)},${y}`; l = ` L${(-w + pinch(y)).toFixed(1)},${y}` + l; }
  return `M${-w + 30},-84 L${w - 30},-84 Q${w},-84 ${w},-50${r} Q${w},106 ${w - 32},106 L${-w + 32},106 Q${-w},106 ${-w},92${l} L${-w},-50 Q${-w},-84 ${-w + 30},-84 Z`;
}

const MG_TINT = {
  percy: ['#3A1424', '#6B2440'], amy: ['#0F2A3F', '#1E5272'], priya: ['#2A1440', '#4E2670'],
  bill: ['#24300E', '#47591A'], lionel: ['#0E302C', '#1A5A52'], phoebe: ['#17321A', '#2C5A30'],
  vinny: ['#40201A', '#73402E'], kavya: ['#14243A', '#25446B'],
};
const MG_NAME = {
  percy: ['PERCY', 'Peristalsis. Runs the line.'], amy: ['AMY', 'Amylase. Enzyme. Mouth.'],
  priya: ['PRIYA', 'Protease. Enzyme. Stomach.'], lionel: ['LIONEL', 'Lipase. Enzyme. Small intestine.'],
  bill: ['BILL', 'Bile. Not an enzyme.'], phoebe: ['PHOEBE', 'Fibre. Not digested.'],
  vinny: ['VINNY', 'A villus. Does not talk.'], kavya: ['KAVYA, 12', 'Test tomorrow. Eating.'],
};
function mgConf(parent, kind) { const [a, b] = MG_TINT[kind] || MG_TINT.kavya; return scConfessional(parent, a, b); }

function cast(parent, kind, o) {
  o = o || {};
  const ink = SC_INK;
  if (kind === 'kavya') return scKavya(parent, o);
  if (kind === 'percy') {
    let body = null;
    return scMake(parent, { s: o.s, mood: o.mood || 'deadpan', seed: 5, bob: 2,
      draw: g => {
        const arm = d => { E('path', { d, fill: 'none', stroke: ink, 'stroke-width': 26, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
          E('path', { d, fill: 'none', stroke: '#E57A8E', 'stroke-width': 18, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g); };
        arm('M-80,6 L-122,40 L-86,74'); arm('M80,6 L122,40 L86,74');   // arms akimbo
        body = E('path', { d: mgPercyBody(0), fill: ball('#F59AAA', '#C85068'), stroke: ink, 'stroke-width': 5, 'stroke-linejoin': 'round' }, g);
        g.bands = E('path', { d: '', fill: 'none', stroke: '#B84060', 'stroke-width': 5, 'stroke-linecap': 'round', opacity: 0.8 }, g);
        E('path', { d: 'M-42,2 Q-32,9 -22,2 M22,2 Q32,9 42,2', fill: 'none', stroke: '#C85068', 'stroke-width': 3.5, 'stroke-linecap': 'round' }, g);  // tired bags
        const cap = G(g); tr(cap, 4, 0, 1, -4);
        E('path', { d: 'M-64,-82 L-58,-128 Q0,-146 58,-128 L64,-82 Z', fill: MG_NAVY, stroke: ink, 'stroke-width': 4, 'stroke-linejoin': 'round' }, cap);
        E('rect', { x: -63, y: -100, width: 126, height: 16, fill: '#D7263D' }, cap);
        E('circle', { cx: 0, cy: -118, r: 12, fill: '#FFFFFF', stroke: ink, 'stroke-width': 3 }, cap);
        E('path', { d: 'M-6,-112 L0,-125 L6,-112 M-3,-117 L3,-117', fill: 'none', stroke: MG_LINE, 'stroke-width': 3, 'stroke-linecap': 'round' }, cap);
        E('path', { d: 'M-74,-82 Q0,-60 74,-82 Q0,-72 -74,-82 Z', fill: '#142645', stroke: ink, 'stroke-width': 4, 'stroke-linejoin': 'round' }, cap);
      },
      face: { x: 0, y: -30, eye: 21, gap: 64, mouthW: 54, mouthY: 42, lidCol: '#F08CA0' },
      sweat: [[-96, -50], [98, -40]],
      upd: (t, g, st) => {
        const sq = clamp(st.squeeze || 0);
        attr(body, 'd', mgPercyBody(sq));
        let d = '';
        [58, 74, 90].forEach(y => { const x = 88 - sq * 30 * Math.exp(-Math.pow((y - 64) / 26, 2)) - 5; d += `M${(-x).toFixed(1)},${y} Q0,${y + 9} ${x.toFixed(1)},${y} `; });
        attr(g.bands, 'd', d);
      } });
  }
  if (kind === 'amy') {
    let star = null;
    return scMake(parent, { s: o.s, mood: o.mood || 'happy', seed: 11, bob: 7,
      draw: g => {
        E('path', { d: 'M-30,-86 C-50,-120 -6,-132 -4,-104 C-2,-90 -22,-92 -18,-102', fill: 'none', stroke: '#2386B5', 'stroke-width': 9, 'stroke-linecap': 'round' }, g);  // curl
        E('path', { d: mgNotchCircle(94, -1.36, -0.72, 30), fill: ball('#7FD6F7', '#2386B5'), stroke: ink, 'stroke-width': 5, 'stroke-linejoin': 'round' }, g);
        E('ellipse', { cx: -52, cy: 22, rx: 14, ry: 9, fill: '#FF8FB0', opacity: 0.75 }, g);
        E('ellipse', { cx: 52, cy: 22, rx: 14, ry: 9, fill: '#FF8FB0', opacity: 0.75 }, g);
        const tag = G(g); tr(tag, -44, 62, 1, -8);
        E('rect', { x: -26, y: -13, width: 52, height: 26, rx: 6, fill: '#FFE45C', stroke: ink, 'stroke-width': 3 }, tag);
        T(tag, 0, 7, 'AMY', { size: 18, weight: 800, anchor: 'middle', fill: ink });
        star = G(g); tr(star, -86, -70);
        E('path', { d: 'M0,-18 L5,-5 L18,0 L5,5 L0,18 L-5,5 L-18,0 L-5,-5 Z', fill: C.energy, stroke: ink, 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, star);
      },
      face: { x: -4, y: -14, eye: 20, gap: 58, mouthW: 46, mouthY: 38, lidCol: '#7FD6F7' },
      upd: (t, g, st) => { const v = st.sparkle === undefined ? 1 : st.sparkle; op(star, v * (0.55 + 0.45 * Math.sin(t * 5))); tr(star, -86, -70, 0.8 + 0.25 * Math.sin(t * 5), t * 40); } });
  }
  if (kind === 'priya') {
    return scMake(parent, { s: o.s, mood: o.mood || 'smug', seed: 13, bob: 3,
      draw: g => {
        E('path', { d: 'M-64,-84 L64,-84 Q94,-84 94,-54 L94,62 Q94,92 64,92 L-64,92 Q-94,92 -94,62 L-94,26 L-58,26 L-58,-22 L-94,-22 L-94,-54 Q-94,-84 -64,-84 Z',
          fill: ball('#C892F0', '#7A3DB0'), stroke: ink, 'stroke-width': 5, 'stroke-linejoin': 'round' }, g);
        E('path', { d: 'M-94,58 Q-40,40 0,62 Q40,40 94,58 L94,62 Q94,92 64,92 L-64,92 Q-94,92 -94,62 Z', fill: '#FF9FC4', stroke: ink, 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);  // towel on shoulders
        const tb = G(g); tr(tb, 6, -84);   // towel turban
        E('path', { d: closedPath([[-78, 4], [-84, -26], [-52, -56], [-6, -66], [46, -58], [80, -30], [76, 4]]), fill: '#FFFFFF', stroke: ink, 'stroke-width': 4 }, tb);
        E('path', { d: 'M-50,-12 Q-10,-46 40,-30 M-30,-2 Q10,-28 58,-10', fill: 'none', stroke: '#C9D3DC', 'stroke-width': 4, 'stroke-linecap': 'round' }, tb);
        E('path', { d: 'M-76,-14 Q0,-30 76,-14', fill: 'none', stroke: '#3A4B5C', 'stroke-width': 6 }, tb);   // goggle strap
        [-24, 24].forEach(x => E('ellipse', { cx: x, cy: -24, rx: 21, ry: 15, fill: '#7FE0D0', stroke: ink, 'stroke-width': 4 }, tb));
        E('path', { d: 'M-28,-30 L-20,-30 M20,-30 L28,-30', stroke: '#FFFFFF', 'stroke-width': 3, 'stroke-linecap': 'round' }, tb);
      },
      face: { x: 10, y: -16, eye: 19, gap: 58, mouthW: 50, mouthY: 38, lidCol: '#C892F0' } });
  }
  if (kind === 'lionel') {
    return scMake(parent, { s: o.s, mood: o.mood || 'neutral', seed: 17, bob: 3,
      draw: g => {
        E('path', { d: 'M36,-88.7 A78,100 0 1 1 -36,-88.7 L-31,-90.5 L-31,-62 L-17,-62 L-17,-96 L-7,-97.5 L-7,-62 L7,-62 L7,-97.5 L17,-96 L17,-62 L31,-62 L31,-90.5 Z',
          fill: ball('#7FE0D2', '#1E8576'), stroke: ink, 'stroke-width': 5, 'stroke-linejoin': 'round' }, g);
        const bt = G(g); tr(bt, 0, 80);   // bow tie
        E('path', { d: 'M0,0 L-28,-16 L-28,16 Z M0,0 L28,-16 L28,16 Z', fill: '#C0304A', stroke: ink, 'stroke-width': 3.5, 'stroke-linejoin': 'round' }, bt);
        E('circle', { r: 7, fill: '#8E1E34', stroke: ink, 'stroke-width': 3 }, bt);
        [-28, 28].forEach(x => E('circle', { cx: x, cy: -10, r: 26, fill: '#E9FBF8', stroke: ink, 'stroke-width': 5 }, g));   // round glasses
        E('path', { d: 'M-2,-14 Q0,-20 2,-14 M-54,-14 L-76,-22 M54,-14 L76,-22', fill: 'none', stroke: ink, 'stroke-width': 5, 'stroke-linecap': 'round' }, g);
      },
      face: { x: 0, y: -10, eye: 17, gap: 56, mouthW: 46, mouthY: 42, lidCol: '#7FE0D2' } });
  }
  if (kind === 'bill') {
    let bub = [];
    return scMake(parent, { s: o.s, mood: o.mood || 'deadpan', seed: 19, bob: 2,
      draw: g => {
        bub = [0, 1, 2].map(i => E('circle', { r: 7 + i * 3, fill: 'rgba(255,255,255,0.25)', stroke: '#FFFFFF', 'stroke-width': 2.5 }, g));
        E('path', { d: 'M-12,-104 L-6,-124 L6,-124 L12,-104 Z', fill: '#D7263D', stroke: ink, 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);   // nozzle
        E('rect', { x: -34, y: -106, width: 68, height: 22, rx: 6, fill: '#D7263D', stroke: ink, 'stroke-width': 4 }, g);
        E('path', { d: 'M-66,104 L66,104 Q78,104 78,92 L78,-34 Q78,-64 40,-74 L40,-86 L-40,-86 L-40,-74 Q-78,-64 -78,-34 L-78,92 Q-78,104 -66,104 Z',
          fill: ball('#D2EC6A', '#7E9A18'), stroke: ink, 'stroke-width': 5, 'stroke-linejoin': 'round' }, g);
        E('rect', { x: -62, y: -40, width: 12, height: 120, rx: 6, fill: '#FFFFFF', opacity: 0.35 }, g);
        E('rect', { x: -58, y: 44, width: 116, height: 52, rx: 8, fill: '#FFFFFF', stroke: ink, 'stroke-width': 3 }, g);
        T(g, 0, 70, 'BILE', { size: 26, weight: 800, anchor: 'middle', fill: '#5E7A0C' });
        T(g, 0, 89, 'not an enzyme', { size: 14, weight: 700, anchor: 'middle', fill: '#5A6B7A', font: FB });
      },
      face: { x: 0, y: -22, eye: 18, gap: 56, mouthW: 46, mouthY: 34, lidCol: '#C2DE52' },
      upd: (t, g, st) => {
        const v = clamp(st.bubbles || 0);
        bub.forEach((b, i) => { const f = (t * 0.6 + i / 3) % 1; op(b, v * Math.sin(f * Math.PI)); attr(b, 'cx', 10 * Math.sin(t * 2 + i * 2) + (i - 1) * 14); attr(b, 'cy', -130 - f * 70); });
      } });
  }
  if (kind === 'phoebe') {
    return scMake(parent, { s: o.s, mood: o.mood || 'sad', seed: 23, bob: 2,
      draw: g => {
        E('path', { d: 'M-44,4 Q-60,40 -58,78 M44,4 Q60,40 58,78', fill: 'none', stroke: ink, 'stroke-width': 11, 'stroke-linecap': 'round' }, g);
        E('path', { d: 'M-44,4 Q-60,40 -58,78 M44,4 Q60,40 58,78', fill: 'none', stroke: '#9BD77A', 'stroke-width': 5, 'stroke-linecap': 'round' }, g);
        const lf = (x, y, r, c) => { const l = G(g); tr(l, x, y, 1, r); E('path', { d: 'M0,0 C-10,-26 -6,-52 10,-64 C24,-48 20,-20 0,0 Z', fill: c, stroke: ink, 'stroke-width': 3.5, 'stroke-linejoin': 'round' }, l); E('path', { d: 'M0,-2 L8,-52', stroke: '#2E6B24', 'stroke-width': 2.5 }, l); };
        lf(-14, -94, -58, '#6CC24A'); lf(16, -94, 64, '#6CC24A'); lf(0, -96, 8, '#7FD45A');   // droopy leaves
        E('rect', { x: -46, y: -100, width: 92, height: 206, rx: 40, fill: ball('#C2EDA2', '#5FA843'), stroke: ink, 'stroke-width': 5 }, g);
        E('path', { d: 'M-28,38 Q-30,70 -26,96 M-10,46 Q-12,74 -9,100 M8,44 Q10,72 7,100 M26,38 Q28,68 25,96', fill: 'none', stroke: '#5FA843', 'stroke-width': 4, 'stroke-linecap': 'round', opacity: 0.8 }, g);  // fibres
        E('path', { d: 'M-30,-80 Q-34,-60 -32,-46 M30,-80 Q34,-60 32,-46', fill: 'none', stroke: '#E6F8D6', 'stroke-width': 4, 'stroke-linecap': 'round', opacity: 0.7 }, g);
      },
      face: { x: 0, y: -26, eye: 16, gap: 46, mouthW: 30, mouthY: 34, lidCol: '#B0E290' } });
  }
  if (kind === 'vinny') {
    return scMake(parent, { s: o.s, mood: o.mood || 'neutral', seed: 29, bob: 0,
      draw: g => {
        let fuzz = '';
        for (let i = 0; i <= 12; i++) { const a = Math.PI + i / 12 * Math.PI, x = Math.cos(a) * 44, y = -54 + Math.sin(a) * 44; fuzz += `M${x.toFixed(1)},${y.toFixed(1)} L${(Math.cos(a) * 56).toFixed(1)},${(-54 + Math.sin(a) * 56).toFixed(1)} `; }
        E('path', { d: fuzz, stroke: ink, 'stroke-width': 4, 'stroke-linecap': 'round' }, g);   // microvilli
        E('path', { d: 'M-44,100 L-44,-54 A44,44 0 0 1 44,-54 L44,100 Z', fill: ball('#FBB8C2', '#D06478'), stroke: ink, 'stroke-width': 5, 'stroke-linejoin': 'round' }, g);
        E('path', { d: 'M-24,100 L-24,6 Q0,-18 24,6 L24,100 M-24,34 Q0,46 24,30 M-24,64 Q0,74 24,62', fill: 'none', stroke: '#E8424F', 'stroke-width': 3.5, opacity: 0.55 }, g);   // capillaries
        E('rect', { x: -6, y: 4, width: 12, height: 96, rx: 6, fill: '#FFF3D6', opacity: 0.8 }, g);   // lacteal
      },
      face: { x: 0, y: -50, eye: 14, gap: 38, mouthW: 22, mouthY: 26, lidCol: '#F6A3B0', brow: false },
      upd: (t, g, st) => { const a = clamp(st.wave || 0) * 9 * Math.sin(t * 4.2); g.setAttribute('transform', `rotate(${a.toFixed(2)} 0 100)`); } });
  }
  return scKavya(parent, o);
}

/* ---------- sets ---------- */
function mgHawker(parent) {
  const g = G(parent);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#F2E6CC' }, g);
  E('rect', { x: 0, y: 0, width: 1200, height: 150, fill: linGrad('#4A5852', '#647269', true) }, g);   // roof
  E('path', { d: 'M0,40 L1200,40 M0,95 L1200,95', stroke: '#3A4540', 'stroke-width': 8 }, g);
  for (let x = 100; x < 1200; x += 200) E('rect', { x: x - 6, y: 0, width: 12, height: 150, fill: '#3A4540' }, g);
  const fans = [];
  [330, 880].forEach(x => {
    E('line', { x1: x, y1: 0, x2: x, y2: 92, stroke: '#2A322E', 'stroke-width': 5 }, g);
    const f = G(g); tr(f, x, 100);
    const bl = G(f);
    for (let i = 0; i < 3; i++) E('ellipse', { cx: 48, cy: 0, rx: 48, ry: 9, fill: '#DCE3DF', stroke: '#2A322E', 'stroke-width': 2.5, transform: `rotate(${i * 120})` }, bl);
    E('circle', { r: 11, fill: '#2A322E' }, f);
    fans.push(bl);
  });
  // stalls
  const STALLS = [['NOODLES', '#2E8B57'], ['CHICKEN RICE', '#D7263D'], ['DRINKS', '#2F6FD6'], ['DESSERTS', '#E07A1F']];
  STALLS.forEach(([name, col], i) => {
    const x = 30 + i * 290, w = 270;
    E('rect', { x, y: 160, width: w, height: 62, rx: 6, fill: col, stroke: '#3A2A20', 'stroke-width': 3 }, g);
    T(g, x + w / 2, 202, name, { size: 30, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
    E('rect', { x, y: 222, width: w, height: 190, fill: '#5A4636' }, g);
    E('rect', { x: x + 12, y: 236, width: w - 24, height: 120, fill: '#3E2F24' }, g);
    E('rect', { x, y: 400, width: w, height: 70, fill: linGrad('#C9D2D8', '#9AA6AE', true), stroke: '#7D8992', 'stroke-width': 3 }, g);   // steel counter
    T(g, x + w - 14, 448, `#01-${12 + i}`, { size: 22, weight: 700, anchor: 'end', fill: '#5A6B7A', font: FB });
  });
  // the chicken rice stall's hanging chickens
  [370, 420, 470].forEach(x => {
    E('line', { x1: x, y1: 236, x2: x, y2: 262, stroke: '#8A8F94', 'stroke-width': 3 }, g);
    E('path', { d: `M${x - 18},${262} Q${x},${250} ${x + 18},${262} Q${x + 22},${302} ${x},${318} Q${x - 22},${302} ${x - 18},${262} Z`, fill: '#F2C46A', stroke: '#B07A2A', 'stroke-width': 3 }, g);
  });
  // floor tiles
  E('rect', { x: 0, y: 470, width: 1200, height: 280, fill: '#E3D3B0' }, g);
  let tl = '';
  for (let y = 500; y < 750; y += 50) tl += `M0,${y} L1200,${y} `;
  for (let x = -600; x < 1800; x += 90) tl += `M${600 + (x - 600) * 0.55},470 L${x},750 `;
  E('path', { d: tl, stroke: '#CDBB94', 'stroke-width': 2.5 }, g);
  // background tables and stools
  [[200, 540], [1000, 540]].forEach(([x, y]) => {
    E('ellipse', { cx: x - 70, cy: y + 30, rx: 22, ry: 9, fill: '#C25A3A' }, g); E('ellipse', { cx: x + 70, cy: y + 30, rx: 22, ry: 9, fill: '#C25A3A' }, g);
    E('rect', { x: x - 8, y, width: 16, height: 50, fill: '#8A8F94' }, g);
    E('ellipse', { cx: x, cy: y, rx: 90, ry: 26, fill: '#F7F7F2', stroke: '#B8BDB8', 'stroke-width': 3 }, g);
  });
  // pillars with green tiles
  [[0, 40], [1160, 40]].forEach(([x, w]) => { E('rect', { x, y: 150, width: w, height: 600, fill: '#3E8E6A' }, g); E('path', { d: `M${x},300 L${x + w},300 M${x},450 L${x + w},450 M${x},600 L${x + w},600`, stroke: '#2C6B4E', 'stroke-width': 3 }, g); });
  g.upd = t => fans.forEach((f, i) => f.setAttribute('transform', `rotate(${((t * 260 + i * 50) % 360).toFixed(1)})`));
  return g;
}
function mgTable(parent, w) {
  w = w || 760;
  const g = G(parent);
  E('ellipse', { cx: 0, cy: 18, rx: w / 2, ry: w * 0.14, fill: '#B8BDB8' }, g);
  E('ellipse', { cx: 0, cy: 0, rx: w / 2, ry: w * 0.14, fill: linGrad('#FFFFFF', '#E6E8E2', true), stroke: '#A9AEA9', 'stroke-width': 4 }, g);
  E('path', { d: `M${-w * 0.3},${-w * 0.03} Q${-w * 0.1},${w * 0.03} ${w * 0.05},${-w * 0.02} M${w * 0.12},${w * 0.05} Q${w * 0.25},0 ${w * 0.36},${w * 0.04}`, fill: 'none', stroke: '#D5D9D2', 'stroke-width': 3 }, g);
  return g;
}

function mgSign(parent, name, code, w) {
  w = w || 520;
  const g = G(parent);
  E('rect', { x: -w / 2 - 6, y: -46, width: w + 12, height: 92, rx: 12, fill: '#2B3138' }, g);
  E('rect', { x: -w / 2, y: -40, width: w, height: 80, rx: 8, fill: '#FFFFFF' }, g);
  E('rect', { x: -w / 2, y: 28, width: w, height: 12, fill: MG_LINE }, g);
  E('circle', { cx: -w / 2 + 44, cy: -6, r: 28, fill: MG_LINE, stroke: '#FFFFFF', 'stroke-width': 3 }, g);
  const codeT = T(g, -w / 2 + 44, 2, code || 'AL1', { size: 22, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  const nameT = T(g, -w / 2 + 92, 8, name || 'MOUTH', { size: 40, weight: 800, fill: MG_NAVY });
  g.setName = (n, c) => { setText(nameT, n); if (c) setText(codeT, c); };
  return g;
}
function mgPlatform(parent, name, code) {
  const g = G(parent);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#5A1A2A', '#8E3348', true) }, g);
  // ceiling ribs (rings of muscle)
  let rib = '';
  for (let i = 0; i < 7; i++) { const y = 20 + i * 30; rib += `M-20,${y + 60} Q600,${y - 40} 1220,${y + 60} `; }
  E('path', { d: rib, fill: 'none', stroke: '#B04A62', 'stroke-width': 12, opacity: 0.55 }, g);
  E('path', { d: rib, fill: 'none', stroke: '#E07A90', 'stroke-width': 3, opacity: 0.35 }, g);
  // platform screen doors with the dark tunnel behind
  E('rect', { x: 40, y: 250, width: 1120, height: 320, fill: '#2A0A12' }, g);
  let rings = '';
  for (let i = 0; i < 6; i++) rings += `M${70 + i * 190},560 Q${165 + i * 190},300 ${260 + i * 190},560 `;
  E('path', { d: rings, fill: 'none', stroke: '#6E2234', 'stroke-width': 10 }, g);
  for (let i = 0; i < 6; i++) {
    const x = 40 + i * 186.7;
    E('rect', { x: x + 6, y: 262, width: 174, height: 300, fill: 'rgba(170,210,230,0.16)', stroke: '#9AA6AE', 'stroke-width': 6 }, g);
    E('line', { x1: x + 93, y1: 262, x2: x + 93, y2: 562, stroke: '#9AA6AE', 'stroke-width': 4 }, g);
    E('path', { d: `M${x + 30},300 L${x + 60},280 M${x + 120},320 L${x + 160},290`, stroke: '#FFFFFF', 'stroke-width': 4, opacity: 0.18 }, g);
  }
  E('rect', { x: 40, y: 232, width: 1120, height: 30, fill: '#2B3138' }, g);
  g.led = T(g, 600, 255, 'NEXT ARRIVAL: YOUR LUNCH', { size: 22, weight: 700, anchor: 'middle', fill: '#FFB000', ls: 2 });
  // platform
  E('rect', { x: 0, y: 562, width: 1200, height: 188, fill: linGrad('#9AA3AC', '#6E7780', true) }, g);
  E('rect', { x: 0, y: 570, width: 1200, height: 20, fill: '#F2C230' }, g);
  let dots = '';
  for (let x = 10; x < 1200; x += 22) dots += `M${x},576 l0,8 `;
  E('path', { d: dots, stroke: '#C99A10', 'stroke-width': 6, 'stroke-linecap': 'round' }, g);
  // hanging station sign
  E('path', { d: 'M480,0 L480,128 M720,0 L720,128', stroke: '#2B3138', 'stroke-width': 6 }, g);
  g.sign = mgSign(g, name || 'MOUTH', code || 'AL1', 480); tr(g.sign, 600, 170);
  return g;
}
function mgTunnel(parent) {
  const g = G(parent);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#2A0810' }, g);
  E('ellipse', { cx: 600, cy: 380, rx: 900, ry: 700, fill: glow('#C24A62'), opacity: 0.5 }, g);
  const N = 13, rings = [];
  for (let i = 0; i < N; i++) rings.push(E('ellipse', { cx: 600, cy: 380, fill: 'none', stroke: i % 2 ? '#C85068' : '#E57A8E', 'stroke-width': 1 }, g));
  E('circle', { cx: 600, cy: 380, r: 40, fill: '#12030A' }, g);
  g.upd = (t, k) => {
    k = k === undefined ? 1 : k;
    rings.forEach((r, i) => {
      const f = ((i + (t * 1.2) % 1) / N), d = Math.pow(f, 2.2);          // 0 = far, 1 = near
      const sq = 1 - 0.28 * k * Math.pow(Math.max(0, Math.sin((f - t * 0.35) * TAU * 1.5)), 6);
      const rx = (60 + d * 900) * sq, ry = (48 + d * 700) * sq;
      attr(r, 'rx', rx); attr(r, 'ry', ry); attr(r, 'stroke-width', 2 + d * 46); r.style.opacity = (0.25 + 0.75 * f).toFixed(3);
    });
  };
  g.upd(0);
  return g;
}
function mgSpa(parent) {
  const g = G(parent);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#5E1A28', '#8E2F3E', true) }, g);
  // rugae: folds in the stomach wall
  let fold = '';
  for (let i = 0; i < 6; i++) { const y = 40 + i * 70; fold += `M-20,${y} Q300,${y + 40} 600,${y + 10} Q900,${y - 30} 1220,${y + 20} `; }
  E('path', { d: fold, fill: 'none', stroke: '#A8435A', 'stroke-width': 18, opacity: 0.6, 'stroke-linecap': 'round' }, g);
  E('path', { d: fold, fill: 'none', stroke: '#D46A80', 'stroke-width': 4, opacity: 0.45 }, g);
  // mucus lining: a pale, glossy layer over the wall surface
  g.mucus = G(g);
  E('path', { d: 'M0,470 Q300,440 600,452 Q900,464 1200,440 L1200,500 Q900,520 600,508 Q300,496 0,526 Z', fill: '#F4E6C8', opacity: 0.45 }, g.mucus);
  E('path', { d: 'M0,470 Q300,440 600,452 Q900,464 1200,440', fill: 'none', stroke: '#FFF6E0', 'stroke-width': 5, opacity: 0.7 }, g.mucus);
  // tiled rim and acid pool
  E('ellipse', { cx: 600, cy: 640, rx: 610, ry: 150, fill: '#E9F1F4', stroke: '#9FB4BF', 'stroke-width': 4 }, g);
  let tiles = '';
  for (let a = 0; a < 40; a++) { const th = a / 40 * TAU; tiles += `M${(600 + Math.cos(th) * 560).toFixed(0)},${(640 + Math.sin(th) * 128).toFixed(0)} L${(600 + Math.cos(th) * 610).toFixed(0)},${(640 + Math.sin(th) * 150).toFixed(0)} `; }
  E('path', { d: tiles, stroke: '#B9CBD4', 'stroke-width': 2.5 }, g);
  const pool = E('ellipse', { cx: 600, cy: 645, rx: 560, ry: 124, fill: linGrad('#C8F06A', '#79B02A', true), stroke: '#5E8A1E', 'stroke-width': 4 }, g);
  const surf = E('path', { d: '', fill: 'none', stroke: '#F0FFB8', 'stroke-width': 4, opacity: 0.6, 'stroke-linecap': 'round' }, g);
  const r = rng(321), bubs = [];
  for (let i = 0; i < 14; i++) bubs.push({ c: E('circle', { r: 5 + r() * 9, fill: 'rgba(240,255,190,0.35)', stroke: '#F0FFB8', 'stroke-width': 2 }, g), x: 120 + r() * 960, y: 600 + r() * 80, ph: r(), sp: 0.4 + r() * 0.5 });
  // neon sign and pH tile (right side, clear of the chapter tag)
  const neon = G(g); tr(neon, 930, 150);
  E('rect', { x: -170, y: -50, width: 340, height: 100, rx: 20, fill: '#1A0A14', stroke: '#FF6FB5', 'stroke-width': 5 }, neon);
  T(neon, 0, 18, 'ACID SPA', { size: 52, weight: 800, anchor: 'middle', fill: '#FFB3DA' });
  g.neon = neon;
  const ph = G(g); tr(ph, 1100, 330);
  E('rect', { x: -56, y: -40, width: 112, height: 80, rx: 10, fill: '#FFFFFF', stroke: '#9FB4BF', 'stroke-width': 4 }, ph);
  T(ph, 0, 14, 'pH 2', { size: 36, weight: 800, anchor: 'middle', fill: '#5E8A1E' });
  g.upd = t => {
    let d = '';
    for (let k = 0; k < 3; k++) { const y = 610 + k * 26, pts = []; for (let x = 140 + k * 60; x <= 1060 - k * 60; x += 60) pts.push([x, y + 5 * Math.sin(x * 0.02 + t * 2 + k)]); d += openPath(pts) + ' '; }
    attr(surf, 'd', d);
    bubs.forEach(b => { const f = (t * b.sp + b.ph) % 1; tr(b.c, b.x + 6 * Math.sin(t * 2 + b.ph * 9), b.y - f * 46, 0.4 + f); b.c.style.opacity = (Math.sin(f * Math.PI)).toFixed(3); });
    neon.style.opacity = (0.85 + 0.15 * Math.sin(t * 7)).toFixed(3);
  };
  g.upd(0);
  return g;
}
function mgGut(parent) {
  const g = G(parent);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#6E2434', '#9C3D4E', true) }, g);
  E('ellipse', { cx: 600, cy: 380, rx: 640, ry: 260, fill: glow('#FFB27A'), opacity: 0.22 }, g);
  const vil = [], r = rng(55);
  const row = (y0, dir, n, h, col, sc) => {
    for (let i = 0; i < n; i++) {
      const x = -20 + i * (1240 / (n - 1)) + (r() - 0.5) * 20, hh = h * (0.8 + r() * 0.4), w = 30 * sc;
      const v = E('path', { d: `M${-w},0 L${-w},${-dir * (hh - w)} A${w},${w} 0 0 ${dir > 0 ? 1 : 0} ${w},${-dir * (hh - w)} L${w},0 Z`, fill: col, stroke: '#5A1A28', 'stroke-width': 3 }, g);
      vil.push({ v, x, y: y0, ph: r() * TAU, dir });
    }
  };
  row(0, -1, 16, 140, '#B04A62', 0.85); row(750, 1, 16, 150, '#B04A62', 0.85);
  row(-10, -1, 13, 190, '#D46A80', 1.1); row(760, 1, 13, 210, '#E07A90', 1.1);
  // a duct opening in the ceiling (bile and pancreatic juice come in here)
  g.duct = [880, 120];
  E('ellipse', { cx: 880, cy: 118, rx: 64, ry: 30, fill: '#3A0A16', stroke: '#E8A0B0', 'stroke-width': 6 }, g);
  g.upd = t => vil.forEach(o => o.v.setAttribute('transform', `translate(${o.x.toFixed(1)} ${o.y}) rotate(${(7 * Math.sin(t * 1.6 + o.ph)).toFixed(2)})`));
  g.upd(0);
  return g;
}
function mgLab(parent) {
  const g = G(parent);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#DCE8EE', '#C6D6DE', true) }, g);
  // window (right)
  E('rect', { x: 960, y: 120, width: 200, height: 250, rx: 8, fill: linGrad('#7FC8F0', '#CDEBFA', true), stroke: '#8A9AA6', 'stroke-width': 8 }, g);
  E('path', { d: 'M1060,120 L1060,370 M960,245 L1160,245', stroke: '#8A9AA6', 'stroke-width': 6 }, g);
  // whiteboard
  g.board = [300, 110, 620, 300];
  E('rect', { x: 292, y: 102, width: 636, height: 316, rx: 10, fill: '#9AA6AE' }, g);
  E('rect', { x: 300, y: 110, width: 620, height: 300, rx: 6, fill: '#FBFCFD' }, g);
  E('rect', { x: 420, y: 418, width: 380, height: 12, rx: 4, fill: '#8A9AA6' }, g);
  // poster (left): a grid like a periodic table
  E('rect', { x: 40, y: 150, width: 210, height: 150, rx: 6, fill: '#FFFFFF', stroke: '#8A9AA6', 'stroke-width': 3 }, g);
  for (let rr = 0; rr < 5; rr++) for (let cc = 0; cc < 9; cc++) if (!(rr === 0 && cc > 0 && cc < 8) && !(rr < 3 && cc > 1 && cc < 7 && rr > 0))
    E('rect', { x: 52 + cc * 21, y: 166 + rr * 25, width: 18, height: 21, fill: ['#FFB3B3', '#B3D9FF', '#C8F0B0', '#FFE29A'][(rr + cc) % 4] }, g);
  // bench
  E('rect', { x: 0, y: 520, width: 1200, height: 40, fill: '#2E3A44' }, g);
  E('rect', { x: 0, y: 560, width: 1200, height: 190, fill: '#B98B5A' }, g);
  for (let x = 0; x < 1200; x += 200) { E('rect', { x: x + 14, y: 576, width: 172, height: 160, rx: 6, fill: '#C99B68', stroke: '#8E6338', 'stroke-width': 3 }, g); E('rect', { x: x + 90, y: 640, width: 20, height: 8, rx: 4, fill: '#6E4B28' }, g); }
  return g;
}
function mgRack(parent, n, gap) {
  n = n || 4; gap = gap || 110;
  const g = G(parent), w = (n - 1) * gap + 90;
  E('rect', { x: -w / 2, y: 40, width: w, height: 26, rx: 5, fill: '#A0703E', stroke: '#6E4B28', 'stroke-width': 3 }, g);
  g.tubes = [];
  for (let i = 0; i < n; i++) { const tt = testTube(g, 44, 190, { level: 0.35, liquid: '#E8EEF2' }); tr(tt, (i - (n - 1) / 2) * gap, -32); g.tubes.push(tt); }
  E('rect', { x: -w / 2, y: -40, width: w, height: 20, rx: 5, fill: '#B9844A', stroke: '#6E4B28', 'stroke-width': 3 }, g);
  E('rect', { x: -w / 2 + 6, y: -20, width: 10, height: 66, fill: '#8E6338' }, g); E('rect', { x: w / 2 - 16, y: -20, width: 10, height: 66, fill: '#8E6338' }, g);
  return g;
}
function mgEnd(parent) {
  const g = G(parent);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#3A1A16', '#6A3428', true) }, g);
  // haustra: the large intestine's pouches, as bulging wall segments top and bottom
  let top = 'M-10,-10 L-10,150', bot = 'M-10,760 L-10,600';
  for (let x = -10; x < 1210; x += 150) { top += ` Q${x + 75},${230} ${x + 150},150`; bot += ` Q${x + 75},${520} ${x + 150},600`; }
  E('path', { d: top + ' L1210,-10 Z', fill: '#8E4A3A', stroke: '#B66A52', 'stroke-width': 6 }, g);
  E('path', { d: bot + ' L1210,760 Z', fill: '#8E4A3A', stroke: '#B66A52', 'stroke-width': 6 }, g);
  // buffer stop and sign
  const bs = G(g); tr(bs, 1060, 470);
  E('rect', { x: -70, y: -60, width: 140, height: 60, fill: '#D7263D', stroke: SC_INK, 'stroke-width': 4 }, bs);
  E('path', { d: 'M-50,-60 L-20,0 M0,-60 L30,0 M50,-60 L70,-20', stroke: '#FFFFFF', 'stroke-width': 12 }, bs);
  E('rect', { x: -60, y: 0, width: 16, height: 60, fill: '#3A4540' }, bs); E('rect', { x: 44, y: 0, width: 16, height: 60, fill: '#3A4540' }, bs);
  const sg = G(g); tr(sg, 1010, 300);
  E('rect', { x: -150, y: -36, width: 300, height: 72, rx: 10, fill: '#FFFFFF', stroke: '#2B3138', 'stroke-width': 6 }, sg);
  T(sg, 0, 14, 'END OF LINE', { size: 40, weight: 800, anchor: 'middle', fill: '#D7263D' });
  // water drops being absorbed into the walls
  g.drops = G(g);
  const r = rng(91), drops = [];
  for (let i = 0; i < 12; i++) drops.push({ d: E('path', { d: 'M0,-12 Q9,2 0,9 Q-9,2 0,-12 Z', fill: C.water, stroke: C.waterDk, 'stroke-width': 2 }, g.drops), x: 80 + r() * 820, up: r() < 0.5, ph: r() });
  g.upd = t => drops.forEach(o => { const f = (t * 0.35 + o.ph) % 1; tr(o.d, o.x + 10 * Math.sin(f * 6), o.up ? lerp(400, 190, f) : lerp(400, 560, f), 1 - 0.5 * f); o.d.style.opacity = Math.sin(f * Math.PI).toFixed(3); });
  g.upd(0);
  return g;
}

/* ---------- props ---------- */
function mgLineMap(parent) {
  const g = G(parent);
  const NAMES = ['**M**OUTH', '**O**ESOPHAGUS', '**S**TOMACH', '**S**MALL INTESTINE', '**L**ARGE INTESTINE', '**R**ECTUM', '**A**NUS'];
  const X = i => -480 + i * 160;
  // helper organs (off the line), joined only by dashed ducts to the small intestine
  g.off = G(g);
  E('path', { d: 'M-230,-150 L0,-96 M0,-150 L0,-96 M230,-150 L0,-96 M0,-96 L0,-22', fill: 'none', stroke: '#8A9AA6', 'stroke-width': 5, 'stroke-dasharray': '10 9' }, g.off);
  [['LIVER', -230], ['GALL BLADDER', 0], ['PANCREAS', 230]].forEach(([n, x]) => { const c = chip(g.off, n, { size: 26, fill: '#3A4652', stroke: '#8A9AA6', color: '#D5DEE4' }); tr(c, x, -172); });
  const tag = chip(g.off, 'NOT ON THE LINE', { size: 26, fill: '#5A2030', stroke: '#FF6070', color: '#FFD0D6' }); tr(tag, 0, -238);
  E('rect', { x: -500, y: -9, width: 1000, height: 18, rx: 9, fill: MG_LINE, stroke: MG_LINEDK, 'stroke-width': 3 }, g);
  g.stations = NAMES.map((n, i) => {
    const s = G(g); tr(s, X(i), 0);
    s.ring = E('circle', { r: 30, fill: 'none', stroke: C.energy, 'stroke-width': 6, opacity: 0 }, s);
    E('circle', { r: 17, fill: '#FFFFFF', stroke: MG_LINEDK, 'stroke-width': 6 }, s);
    const up = i % 2 === 0;
    T(s, 0, up ? -36 : 52, n, { size: 26, weight: 700, anchor: 'middle', fill: C.ink, boldFill: C.energy });
    return s;
  });
  g.x = X;
  g.set = (active, off) => {
    g.stations.forEach((s, i) => { s.ring.style.opacity = i === active ? '1' : '0'; });
    op(g.off, off === undefined ? 1 : off);
  };
  g.set(-1, 1);
  return g;
}
function mgTray(parent) {
  const g = G(parent), parts = {};
  // soup bowl (right)
  parts.soup = G(g); tr(parts.soup, 250, -6);
  E('path', { d: 'M-62,0 Q-58,52 0,56 Q58,52 62,0 Z', fill: '#FFFFFF', stroke: '#9AA6AE', 'stroke-width': 4 }, parts.soup);
  E('ellipse', { cx: 0, cy: 0, rx: 62, ry: 18, fill: '#E2B56A', stroke: '#9AA6AE', 'stroke-width': 4 }, parts.soup);
  E('ellipse', { cx: -16, cy: -2, rx: 10, ry: 4, fill: '#7FB04A' }, parts.soup); E('ellipse', { cx: 18, cy: 3, rx: 8, ry: 3, fill: '#7FB04A' }, parts.soup);
  E('path', { d: 'M-18,-26 Q-8,-40 -18,-56 M14,-26 Q24,-40 14,-56', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 4, opacity: 0.6, 'stroke-linecap': 'round' }, parts.soup);
  // plate
  parts.plate = E('ellipse', { cx: 0, cy: 10, rx: 180, ry: 74, fill: '#FFFFFF', stroke: '#B8C4CE', 'stroke-width': 4 }, g);
  E('ellipse', { cx: 0, cy: 10, rx: 150, ry: 58, fill: 'none', stroke: '#E1E8EE', 'stroke-width': 3 }, g);
  // chilli dish (back left)
  parts.chilli = G(g); tr(parts.chilli, -150, -40);
  E('ellipse', { rx: 32, ry: 13, fill: '#FFFFFF', stroke: '#B8C4CE', 'stroke-width': 3 }, parts.chilli);
  E('ellipse', { rx: 24, ry: 8, fill: '#E0352B' }, parts.chilli);
  // rice dome
  parts.rice = G(g);
  E('path', { d: 'M-150,24 Q-156,-50 -76,-56 Q4,-52 0,24 Q-76,40 -150,24 Z', fill: '#FBF3DE', stroke: '#D9C79C', 'stroke-width': 4 }, parts.rice);
  const r = rng(12);
  let grains = '';
  for (let i = 0; i < 22; i++) { const x = -140 + r() * 130, y = -40 + r() * 58; grains += `M${x.toFixed(0)},${y.toFixed(0)} l${(6 + r() * 4).toFixed(1)},${(r() * 4 - 2).toFixed(1)} `; }
  E('path', { d: grains, stroke: '#E8DAB4', 'stroke-width': 4, 'stroke-linecap': 'round' }, parts.rice);
  parts.fat = E('path', { d: 'M-122,-24 Q-100,-40 -78,-38 M-60,-30 Q-40,-36 -24,-26', fill: 'none', stroke: '#FFE29A', 'stroke-width': 5, 'stroke-linecap': 'round', opacity: 0.9 }, parts.rice);
  // chicken slices
  parts.chicken = G(g);
  [[46, -30, -10], [70, -12, -6], [94, 6, -2], [118, 24, 2]].forEach(([x, y, a]) => {
    const s = G(parts.chicken); tr(s, x, y, 1, a);
    E('path', { d: 'M-46,-8 Q0,-22 46,-10 L42,14 Q0,24 -42,16 Z', fill: '#F7E8DA', stroke: '#C9A88A', 'stroke-width': 3, 'stroke-linejoin': 'round' }, s);
    E('path', { d: 'M-46,-8 Q0,-22 46,-10 L45,-3 Q0,-14 -45,-1 Z', fill: '#F2C46A', stroke: '#C9A88A', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, s);
    E('path', { d: 'M-24,6 Q0,0 24,4', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 4, opacity: 0.7, 'stroke-linecap': 'round' }, s);
  });
  // three cucumber slices
  parts.cucumber = G(g);
  [[-40, 50], [0, 58], [40, 52]].forEach(([x, y]) => {
    E('ellipse', { cx: x, cy: y, rx: 22, ry: 11, fill: '#4E9A3A', stroke: '#2E6B24', 'stroke-width': 2.5 }, parts.cucumber);
    E('ellipse', { cx: x, cy: y, rx: 17, ry: 8, fill: '#D8F0B8' }, parts.cucumber);
    E('path', { d: `M${x - 6},${y} l2,0 M${x + 4},${y - 2} l2,0 M${x},${y + 3} l2,0`, stroke: '#9BC97A', 'stroke-width': 3, 'stroke-linecap': 'round' }, parts.cucumber);
  });
  g.parts = parts;
  return g;
}
function mgBoard(parent, w, h) {
  w = w || 660; h = h || 190;
  const g = G(parent);
  E('rect', { x: -w / 2 - 8, y: -h / 2 - 8, width: w + 16, height: h + 16, rx: 14, fill: '#2B3138' }, g);
  E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: 8, fill: '#0B0C0E' }, g);
  E('rect', { x: -w / 2, y: -h / 2, width: w, height: 46, rx: 8, fill: '#D7263D' }, g);
  T(g, 0, -h / 2 + 33, 'SERVICE DISRUPTION', { size: 28, weight: 800, anchor: 'middle', fill: '#FFFFFF', ls: 2 });
  const a = T(g, 0, -h / 2 + 100, '', { size: 40, weight: 800, anchor: 'middle', fill: '#FFB000' });
  const b = T(g, 0, -h / 2 + 150, '', { size: 30, weight: 600, anchor: 'middle', fill: '#FFD66B' });
  g.msg = (l1, l2) => { setText(a, l1 || ''); setText(b, l2 || ''); };
  return g;
}
function mgMic(parent, s) {
  const g = G(parent); tr(g, 0, 0, s || 1);
  E('path', { d: 'M0,40 C20,60 -20,70 0,90 C20,110 -20,120 0,140', fill: 'none', stroke: '#2B3138', 'stroke-width': 5 }, g);
  E('rect', { x: -12, y: -10, width: 24, height: 54, rx: 8, fill: '#3A4652', stroke: SC_INK, 'stroke-width': 3 }, g);
  E('rect', { x: -20, y: -42, width: 40, height: 36, rx: 12, fill: '#5A6B7A', stroke: SC_INK, 'stroke-width': 3 }, g);
  E('path', { d: 'M-12,-30 L12,-30 M-12,-20 L12,-20', stroke: '#9AA6AE', 'stroke-width': 3 }, g);
  E('rect', { x: 10, y: 8, width: 8, height: 14, rx: 3, fill: '#D7263D' }, g);
  return g;
}
function mgChain(parent, kind, n) {
  n = n || 6;
  const g = G(parent), sp = 56, r = rng(kind === 'starch' ? 4 : 9);
  const PCOL = [['#FF8A7A', '#B5372D'], ['#7FD6F7', '#2386B5'], ['#C2EDA2', '#4E9A3A'], ['#C892F0', '#7A3DB0'], ['#FFD27A', '#B57B12']];
  g.bonds = []; g.beads = [];
  const off = [];
  for (let i = 0; i < n - 1; i++) g.bonds.push(E('line', { x1: 0, y1: 0, x2: 0, y2: 0, stroke: kind === 'starch' ? C.glucoseLt : '#DCE3E8', 'stroke-width': 7, 'stroke-linecap': 'round' }, g));
  for (let i = 0; i < n; i++) {
    let b;
    if (kind === 'starch') b = molGlucose(g, 22);
    else { b = G(g); const [c, dk] = PCOL[i % 5]; E('rect', { x: -18, y: -18, width: 36, height: 36, rx: 8, fill: ball(c, dk), stroke: dk, 'stroke-width': 3 }, b); }
    g.beads.push(b); off.push([(r() - 0.5) * 2, (r() - 0.5) * 2, (r() - 0.5) * 60]);
  }
  g.set = p => {
    p = clamp(p);
    const pos = g.beads.map((b, i) => [(i - (n - 1) / 2) * (sp + 34 * p) + off[i][0] * 10 * p, off[i][1] * 34 * p]);
    g.beads.forEach((b, i) => tr(b, pos[i][0], pos[i][1], 1, off[i][2] * p));
    g.bonds.forEach((l, i) => { attr(l, 'x1', pos[i][0]); attr(l, 'y1', pos[i][1]); attr(l, 'x2', pos[i + 1][0]); attr(l, 'y2', pos[i + 1][1]); l.style.opacity = (1 - clamp(p * 3)).toFixed(3); });
  };
  g.set(0);
  return g;
}
function mgFat(parent, s) {
  const g = G(parent); tr(g, 0, 0, s || 1);
  g.glycerol = G(g);
  E('rect', { x: -78, y: -60, width: 30, height: 120, rx: 12, fill: '#FFF2C2', stroke: '#C9A84A', 'stroke-width': 4 }, g.glycerol);
  g.acids = [-40, 0, 40].map(y => {
    const a = G(g);
    let d = 'M0,0';
    for (let k = 1; k <= 8; k++) d += ` L${k * 16},${k % 2 ? -10 : 0}`;
    E('path', { d, fill: 'none', stroke: '#B57B12', 'stroke-width': 13, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, a);
    E('path', { d, fill: 'none', stroke: '#FFD25A', 'stroke-width': 8, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, a);
    a.y = y; return a;
  });
  g.set = p => { p = clamp(p); g.acids.forEach((a, i) => tr(a, -44 + p * 46, a.y + (i - 1) * p * 26)); };
  g.set(0);
  return g;
}
function mgBlob(parent, r) {
  r = r || 90;
  const g = G(parent), rr = rng(33), N = 16;
  const big = E('circle', { r, fill: ball('#FFE38A', '#D9A520'), stroke: '#B57B12', 'stroke-width': 5 }, g);
  const drops = [];
  for (let i = 0; i < N; i++) {
    const a = i / N * TAU + rr() * 0.4, d = r * (0.6 + rr() * 1.8);
    drops.push({ c: E('circle', { r: r / 4, fill: ball('#FFE38A', '#D9A520'), stroke: '#B57B12', 'stroke-width': 3 }, g), x: Math.cos(a) * d, y: Math.sin(a) * d * 0.8 });
  }
  g.set = p => {
    p = clamp(p);
    tr(big, 0, 0, Math.max(0.01, 1 - p)); big.style.opacity = (1 - clamp(p * 1.4)).toFixed(3);
    drops.forEach(o => { tr(o.c, o.x * p, o.y * p, Math.max(0.01, p)); o.c.style.opacity = clamp(p * 3).toFixed(3); });
  };
  g.set(0);
  return g;
}
function mgBolus(parent, r) {
  r = r || 40;
  const g = G(parent), rr = rng(27);
  E('circle', { r, fill: ball('#F2DFB6', '#C9A86A'), stroke: '#8A6D35', 'stroke-width': Math.max(3, r * 0.08) }, g);
  let w = '', gr = '';
  for (let i = 0; i < 8; i++) { const a = rr() * TAU, d = rr() * r * 0.7; w += `M${(Math.cos(a) * d).toFixed(1)},${(Math.sin(a) * d).toFixed(1)} l${(r * 0.18).toFixed(1)},${(r * 0.04).toFixed(1)} `; }
  for (let i = 0; i < 4; i++) { const a = rr() * TAU, d = rr() * r * 0.6; gr += `M${(Math.cos(a) * d).toFixed(1)},${(Math.sin(a) * d).toFixed(1)} l${(r * 0.12).toFixed(1)},${(-r * 0.06).toFixed(1)} `; }
  E('path', { d: w, stroke: '#FFFBF0', 'stroke-width': Math.max(3, r * 0.09), 'stroke-linecap': 'round' }, g);
  E('path', { d: gr, stroke: '#6CB04A', 'stroke-width': Math.max(3, r * 0.1), 'stroke-linecap': 'round' }, g);
  E('ellipse', { cx: -r * 0.35, cy: -r * 0.4, rx: r * 0.25, ry: r * 0.14, fill: '#FFFFFF', opacity: 0.45 }, g);
  return g;
}
function mgPeriTube(parent, len) {
  len = len || 900;
  const g = G(parent), R = 52, wall = 30;
  E('rect', { x: -len / 2, y: -R, width: len, height: 2 * R, fill: '#5A1A28' }, g);
  g.bolus = mgBolus(g, 44);
  const top = E('path', { d: '', fill: ball('#F59AAA', '#C85068'), stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
  const bot = E('path', { d: '', fill: ball('#F59AAA', '#C85068'), stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
  const rings = E('path', { d: '', stroke: '#B84060', 'stroke-width': 3, opacity: 0.7 }, g);
  g.set = p => {
    p = clamp(p);
    const xs = lerp(-len / 2 - 40, len / 2 - 120, p);             // the contraction ring
    const pinch = x => 40 * Math.exp(-Math.pow((x - xs) / 46, 2));
    let tp = `M${-len / 2},${-R - wall}`, bp = `M${-len / 2},${R + wall}`, tq = '', bq = '', rg = '';
    for (let x = -len / 2; x <= len / 2; x += 10) { const k = pinch(x); tq += ` L${x},${(-R + k).toFixed(1)}`; bq += ` L${x},${(R - k).toFixed(1)}`; }
    attr(top, 'd', `${tp} L${-len / 2},${-R}${tq} L${len / 2},${-R - wall} Z`);
    attr(bot, 'd', `${bp} L${-len / 2},${R}${bq} L${len / 2},${R + wall} Z`);
    for (let x = -len / 2 + 20; x < len / 2; x += 40) { const k = pinch(x); rg += `M${x},${(-R - wall + 4).toFixed(1)} L${x},${(-R + k - 4).toFixed(1)} M${x},${(R - k + 4).toFixed(1)} L${x},${(R + wall - 4).toFixed(1)} `; }
    attr(rings, 'd', rg);
    tr(g.bolus, Math.min(len / 2 - 50, xs + 92), 0);
  };
  g.set(0);
  return g;
}
function mgVillusCut(parent) {
  const g = G(parent), W = 220, top = -110, base = 210, rr = W / 2;
  // gut wall underneath
  g.wall = G(g);
  E('rect', { x: -170, y: base - 4, width: 340, height: 40, rx: 8, fill: '#C85068', stroke: SC_INK, 'stroke-width': 4 }, g.wall);
  const outline = `M${-rr},${base} L${-rr},${top} A${rr},${rr} 0 0 1 ${rr},${top} L${rr},${base}`;
  E('path', { d: outline + ' Z', fill: '#FBD3D9' }, g);
  E('path', { d: outline, fill: 'none', stroke: '#F08CA0', 'stroke-width': 22 }, g.wall);
  // one layer of cells: ticks across the band
  let ticks = '';
  for (let y = base - 20; y > top; y -= 26) ticks += `M${-rr - 11},${y} L${-rr + 11},${y} M${rr - 11},${y} L${rr + 11},${y} `;
  for (let a = 0; a <= 12; a++) { const th = Math.PI + a / 12 * Math.PI, c = Math.cos(th), s = Math.sin(th); ticks += `M${((rr - 11) * c).toFixed(1)},${(top + (rr - 11) * s).toFixed(1)} L${((rr + 11) * c).toFixed(1)},${(top + (rr + 11) * s).toFixed(1)} `; }
  E('path', { d: ticks, stroke: '#B84060', 'stroke-width': 3 }, g.wall);
  E('path', { d: outline, fill: 'none', stroke: SC_INK, 'stroke-width': 4 }, g.wall);
  // capillary network
  g.cap = G(g);
  const ci = rr - 36;
  E('path', { d: `M${-ci},${base} L${-ci},${top} A${ci},${ci} 0 0 1 ${ci},${top} L${ci},${base}`, fill: 'none', stroke: '#E8424F', 'stroke-width': 9, 'stroke-linecap': 'round' }, g.cap);
  let net = '';
  for (let y = top + 10; y < base - 20; y += 52) net += `M${-ci},${y} Q${-ci / 2},${y + 18} 0,${y + 6} Q${ci / 2},${y - 8} ${ci},${y + 12} `;
  E('path', { d: net, fill: 'none', stroke: '#E8424F', 'stroke-width': 5, 'stroke-linecap': 'round' }, g.cap);
  // lacteal
  g.lacteal = G(g);
  E('path', { d: `M-16,${base} L-16,${top - 40} A16,16 0 0 1 16,${top - 40} L16,${base} Z`, fill: '#FFF6DC', stroke: '#D9C27A', 'stroke-width': 4 }, g.lacteal);
  return g;
}
function mgTeeth(parent) {
  const g = G(parent), tooth = { fill: '#FAF7EE', stroke: '#9A9480', 'stroke-width': 4, 'stroke-linejoin': 'round' };
  E('rect', { x: -270, y: 40, width: 540, height: 60, rx: 26, fill: '#F08CA0', stroke: '#B84060', 'stroke-width': 4 }, g);   // gum
  const D = [
    'M-26,60 L-26,-30 L-30,-70 L30,-70 L26,-30 L26,60 Z',                                                       // incisor: chisel edge
    'M-28,60 L-28,-20 Q-24,-50 0,-86 Q24,-50 28,-20 L28,60 Z',                                                  // canine: one point
    'M-34,60 L-34,-30 Q-30,-62 -16,-62 Q-6,-44 0,-46 Q6,-44 16,-62 Q30,-62 34,-30 L34,60 Z',                   // premolar: two cusps
    'M-48,60 L-48,-24 Q-46,-58 -32,-58 Q-24,-40 -16,-56 Q-8,-40 0,-56 Q8,-40 16,-56 Q24,-40 32,-58 Q46,-58 48,-24 L48,60 Z',  // molar: broad, many cusps
  ];
  g.teeth = D.map((d, i) => { const t = G(g); tr(t, -195 + i * 130, 0); E('path', Object.assign({ d }, tooth), t); E('path', { d: 'M-10,-20 Q-12,10 -8,36', stroke: '#FFFFFF', 'stroke-width': 5, 'stroke-linecap': 'round', opacity: 0.8 }, t); return t; });
  return g;
}
