/* Scene 2: "Colour coordination" (indicators, strength vs concentration, hazards).
   Shots (hard sitcom cuts): venue: Indi IS the colour scheme (paint-chip fan) -> three test tubes (acidic,
   neutral, alkaline) -> video call with cousin Litmus (red in acid, blue in alkali, no numbers) -> Indi's
   confessional: universal indicator = a mixture of dyes -> the showpiece: Indi walks along the pH scale and
   her colour follows it band by band (red, orange, yellow, GREEN, blue, purple) -> Hal and Natalie barge in
   and pull her red / purple -> "Please stop." -> Hal's confessional: STRONG + CONCENTRATED glued together
   -> Indi stares; the two words split (≠) -> strength (ionises fully / partly) -> concentration
   (concentrated / dilute) -> the 2 x 2 grid: Hal is strong but dilute -> corrosive / irritant hazard
   diamonds -> dilute strong can be safer than concentrated weak -> Kavya in the lab: NEVER TASTE. */
scene('colours', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;
  const INK = SC_INK;

  /* ---------- local helpers (prefixed cl) ---------- */
  const clPop = (el, t, t0, x, y, s, r) => { const p = P(t, t0, 0.45, pop); op(el, clamp(p * 2.5)); tr(el, x, y, Math.max(0.01, (s || 1) * (0.6 + 0.4 * p)), r); return p; };
  const clCam = (el, k, cx, cy) => el.setAttribute('transform', Math.abs(k - 1) < 1e-4 ? '' : `translate(${cx} ${cy}) scale(${k.toFixed(4)}) translate(${-cx} ${-cy})`);
  const clDark = 'rgba(10,27,39,0.9)';
  function clChip(parent, str, o) {
    o = o || {};
    const size = o.size || 30, g = G(parent), h = Math.round(size * 1.7);
    const box = E('rect', { y: -h / 2, height: h, rx: h / 2, fill: o.fill || clDark, stroke: o.stroke || C.line, 'stroke-width': o.sw || 2.5 }, g);
    const tx = ngFormula(g, 0, size * 0.35, str, { size, fill: o.color || C.ink, weight: o.weight || 700 });
    let w = 0; try { w = tx.getComputedTextLength(); } catch (e) { w = 0; }
    w = (w || str.length * size * 0.55) + size * 1.3;
    attr(box, 'x', -w / 2); attr(box, 'width', w);
    g.w = w; g.h = h;
    return g;
  }
  const BANDS = [[0, 2, 1, 'RED'], [3, 4, 3.5, 'ORANGE'], [5, 6, 5.5, 'YELLOW'], [7, 7, 7, 'GREEN'], [8, 11, 9.5, 'BLUE'], [12, 14, 13, 'PURPLE']];
  const clBand = p => (p < 2.5 ? 0 : p < 4.5 ? 1 : p < 6.5 ? 2 : p < 7.5 ? 3 : p < 11.5 ? 4 : 5);
  // a cheap water molecule (red O, two white H) and acid particle (H stuck to a partner ion)
  function clWater(p, r) {
    const g = G(p); r = r || 9;
    E('path', { d: `M${-r * 1.9},${r * 0.7} a${r * 0.6},${r * 0.6} 0 1,0 ${r * 1.2},0 a${r * 0.6},${r * 0.6} 0 1,0 ${-r * 1.2},0 M${r * 0.7},${r * 0.7} a${r * 0.6},${r * 0.6} 0 1,0 ${r * 1.2},0 a${r * 0.6},${r * 0.6} 0 1,0 ${-r * 1.2},0`, fill: '#F4F7FA', stroke: '#A9B5C0', 'stroke-width': 1.5 }, g);
    E('circle', { r, fill: C.oxygen, stroke: C.oxygenDk, 'stroke-width': 1.5 }, g);
    return g;
  }
  function clDrop(p, col) { return E('path', { d: 'M0,-26 Q20,0 18,10 A18,18 0 0 1 -18,10 Q-20,0 0,-26 Z', fill: col, stroke: '#FFFFFF', 'stroke-width': 3 }, p); }
  function clNote(p) {
    const g = G(p);
    E('path', { d: 'M6,-34 L6,6 M6,-34 Q20,-26 24,-14', fill: 'none', stroke: '#BFF5CB', 'stroke-width': 5, 'stroke-linecap': 'round' }, g);
    E('ellipse', { cx: -2, cy: 8, rx: 10, ry: 7, fill: '#BFF5CB', transform: 'rotate(-20 -2 8)' }, g);
    return g;
  }

  /* ---------- layers and sets ---------- */
  const cam = G(root), HUD = G(root);
  const Lbg = G(cam), Lprop = G(cam), Lcast = G(cam), Lfg = G(cam);
  const venue = ngVenue(Lbg);
  const dim = E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#0A0F18' }, Lbg);
  const confI = ngConf(Lbg, 'indi');
  const confH = ngConf(Lbg, 'hal');
  const lab = ngLab(Lbg);

  const SH = [
    ['scheme', -1e9, 'venue'], ['what', at('what') - 0.08, 'venue'], ['litmus', at('litmus') - 0.08, 'venue'],
    ['rainbow', at('rainbow') - 0.08, 'confI'], ['walk', at('acidside') - 0.08, 'confI'], ['pull', at('red') - 0.08, 'confI'],
    ['strong', at('strong') - 0.08, 'confH'], ['stare', end('strong') + 0.2, 'confI'], ['strength', at('strength') - 0.1, 'venue'],
    ['today', at('today') - 0.08, 'venue'], ['corrosive', at('corrosive') - 0.1, 'venue'], ['safer', at('safer') - 0.08, 'venue'],
    ['goggles', at('goggles') - 0.08, 'lab'],
  ];
  const shotAt = t => { let k = 0; for (let i = 0; i < SH.length; i++) if (t >= SH[i][1]) k = i; return SH[k]; };
  const FG = {}, BK = {};
  SH.forEach(([id]) => { BK[id] = G(Lprop); FG[id] = G(Lfg); });

  /* ---------- cast ---------- */
  const indi = cast(Lcast, 'indi', { ph: 1, mood: 'deadpan' });
  const hal = cast(Lcast, 'hal', { mood: 'happy' });
  const nat = cast(Lcast, 'natalie', { mood: 'smug' });
  const kavW = G(Lcast);
  const kavya = cast(kavW, 'kavya', { goggles: 'on', mood: 'deadpan' });
  const bench = ngBench(Lcast, 560);

  /* ---------- scheme: the paint-chip fan ---------- */
  const fan = G(FG.scheme);
  const sw = BANDS.map(b => {
    const g = G(fan);
    E('rect', { x: -34, y: -250, width: 68, height: 230, rx: 10, fill: '#FBF7EC', stroke: INK, 'stroke-width': 3 }, g);
    E('rect', { x: -26, y: -242, width: 52, height: 150, rx: 6, fill: ngPH(b[2]) }, g);
    E('path', { d: 'M-22,-70 L22,-70 M-22,-50 L10,-50', stroke: '#C9BFA6', 'stroke-width': 5, 'stroke-linecap': 'round' }, g);
    return g;
  });
  E('circle', { r: 12, fill: '#9AA6B2', stroke: INK, 'stroke-width': 3 }, fan);
  const schemeChip = chip(FG.scheme, 'COLOUR SCHEME', { size: 40, fill: clDark, stroke: '#FFFFFF', sw: 3 });
  const isIndi = chip(FG.scheme, '= Indi', { size: 36, fill: ngPH(1), color: '#FFFFFF', stroke: '#FFFFFF', sw: 3 });
  const isArrow = arrow(FG.scheme, 700, 250, 530, 330, { color: '#FFFFFF', width: 6, bend: -30 });

  /* ---------- what: three test tubes ---------- */
  const indChip = chip(FG.what, 'INDICATOR', { size: 46, fill: ngPH(7), color: '#FFFFFF', stroke: '#FFFFFF', sw: 3 });
  const indNote = T(FG.what, 880, 248, 'changes colour with pH', { size: 32, weight: 700, anchor: 'middle' });
  const TUBES = [[720, 1, 'acidic'], [880, 7, 'neutral'], [1040, 13, 'alkaline']];
  const tubes = TUBES.map(([x, ph, lb]) => {
    const g = G(FG.what);
    testTube(g, 64, 220, { level: 0.7, liquid: ngPH(ph), opacity: 0.92 });
    const c = chip(g, lb, { size: 30, fill: ngPH(ph), color: '#FFFFFF', stroke: '#FFFFFF', sw: 2 }); tr(c, 0, 160);
    return g;
  });
  const glance = chip(FG.what, 'at a glance', { size: 30, fill: clDark, stroke: C.line, color: C.energy });

  /* ---------- litmus: video call with cousin Litmus ---------- */
  const call = scVideoCall(FG.litmus, 470, 280, 'Cousin Litmus');
  const litmus = scMake(call.screen, { seed: 4, bob: 4, mood: 'happy',
    draw: g => {
      E('rect', { x: -46, y: -112, width: 92, height: 112, rx: 8, fill: '#E8424F', stroke: INK, 'stroke-width': 4 }, g);
      E('rect', { x: -46, y: 0, width: 92, height: 112, rx: 8, fill: '#2E6FDB', stroke: INK, 'stroke-width': 4 }, g);
      E('rect', { x: -42, y: -6, width: 84, height: 12, fill: '#2E6FDB' }, g);
    },
    face: { x: 0, y: -8, eye: 15, gap: 44, mouthW: 28, mouthY: 30, lidCol: '#C9D3DC' } });
  tr(litmus, -130, 6, 0.95);
  const DEMO = [[40, ngPH(1), '#2E6FDB', '#E8424F', 'acid'], [160, ngPH(13), '#E8424F', '#2E6FDB', 'alkali']];
  const demos = DEMO.map(([x, liq, c0, c1, lb]) => {
    const g = G(call.screen); tr(g, x, 40);
    const strip = E('rect', { x: -9, y: -110, width: 18, height: 120, rx: 4, fill: c0, stroke: INK, 'stroke-width': 3 }, g);
    beaker(g, 90, 96, { level: 0.6, liquid: liq, marks: false });
    T(g, 0, 86, lb, { size: 26, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
    return { g, strip, c0, c1 };
  });
  const lmRed = chip(FG.litmus, 'acid → RED', { size: 32, fill: '#E8424F', color: '#FFFFFF', stroke: '#FFFFFF', sw: 2 });
  const lmBlue = chip(FG.litmus, 'alkali → BLUE', { size: 32, fill: '#2E6FDB', color: '#FFFFFF', stroke: '#FFFFFF', sw: 2 });
  const lmNo = G(FG.litmus);
  chip(lmNo, 'no pH numbers', { size: 32, fill: clDark, stroke: C.bad, sw: 3 });
  tr(cross(lmNo, 14), 150, 0);
  const bless = chip(FG.litmus, 'bless her', { size: 28, fill: clDark, stroke: C.line, color: '#FFB0C8' });

  /* ---------- rainbow: a mixture of dyes ---------- */
  const DYE = [['#E8424F', 760, 210], ['#FFD43B', 900, 170], ['#2E6FDB', 1040, 210]];
  const dyes = DYE.map(([c]) => clDrop(FG.rainbow, c));
  const fl = flask(FG.rainbow, 0.9, { level: 0, liquid: ngPH(7), opacity: 0.9 }); tr(fl, 900, 430);
  const arcs = BANDS.map((b, i) => { const r = 200 - i * 11; return E('path', { d: `M${900 - r},360 A${r},${r} 0 0 1 ${900 + r},360`, fill: 'none', stroke: ngPH(b[2]), 'stroke-width': 11, 'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': '1 1' }, FG.rainbow); });
  const uiChip = chip(FG.rainbow, 'universal indicator', { size: 38, fill: ngPH(7), color: '#FFFFFF', stroke: '#FFFFFF', sw: 3 });
  const mixChip = chip(FG.rainbow, '= a MIXTURE of dyes', { size: 32, fill: clDark, stroke: C.line });

  /* ---------- walk: the pH scale, band by band ---------- */
  const SCX = 600, SCY = 470;
  const scaleG = G(BK.walk); tr(scaleG, SCX, SCY);
  const phs = ngPhScale(scaleG, 980);
  const sx = ph => SCX + phs.x(ph);
  const bandBox = E('rect', { y: SCY - 40, height: 80, rx: 12, fill: 'none', stroke: '#FFFFFF', 'stroke-width': 6 }, BK.walk);
  const brackets = BANDS.map(([a, b, , name], i) => {
    const g = G(BK.walk), x0 = sx(a) - 28, x1 = sx(b) + 28;
    E('rect', { x: x0, y: 572, width: x1 - x0, height: 12, rx: 6, fill: ngPH(BANDS[i][2]), stroke: '#FFFFFF', 'stroke-width': 2 }, g);
    T(g, (x0 + x1) / 2, 616, a === b ? String(a) : `${a}–${b}`, { size: 28, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
    return g;
  });
  const GROUPS = [[0, 6, 'ACIDIC', '#FF8A7A'], [7, 7, 'NEUTRAL', '#7CE38F'], [8, 14, 'ALKALINE', '#B9A0FF']].map(([a, b, name, col]) => {
    const g = G(BK.walk), x0 = sx(a) - 30, x1 = sx(b) + 30;
    E('path', { d: `M${x0},636 L${x0},648 L${x1},648 L${x1},636`, fill: 'none', stroke: col, 'stroke-width': 5, 'stroke-linejoin': 'round' }, g);
    const c = chip(g, name, { size: 30, fill: clDark, stroke: col, sw: 3, color: col }); tr(c, (x0 + x1) / 2, 680);
    return g;
  });
  const nameChip = chip(FG.walk, 'RED', { size: 44, fill: ngPH(1), color: '#FFFFFF', stroke: '#FFFFFF', sw: 3 });
  const calmGlow = E('circle', { r: 190, fill: glow('#7CE38F') }, BK.walk);
  const notes = [0, 1, 2].map(() => clNote(FG.walk));

  /* ---------- pull: Hal and Natalie barge into the confessional ---------- */
  const redTag = chip(FG.pull, 'next to acid: RED', { size: 30, fill: '#E8424F', color: '#FFFFFF', stroke: '#FFFFFF', sw: 2 });
  const purTag = chip(FG.pull, 'next to alkali: PURPLE', { size: 30, fill: ngPH(13), color: '#FFFFFF', stroke: '#FFFFFF', sw: 2 });
  const twitch = G(FG.pull);
  E('path', { d: 'M-14,-10 L0,0 L-14,10 M14,-10 L0,0 L14,10', fill: 'none', stroke: '#FFE45C', 'stroke-width': 5, 'stroke-linecap': 'round' }, twitch);

  /* ---------- strong / stare / twothings: two different things ---------- */
  function clGlued(p) {
    const g = G(p);
    g.a = chip(g, 'STRONG', { size: 40, fill: '#E8424F', color: '#FFFFFF', stroke: '#FFFFFF', sw: 3 });
    g.b = chip(g, 'CONCENTRATED', { size: 40, fill: '#B32630', color: '#FFFFFF', stroke: '#FFFFFF', sw: 3 });
    g.tape = G(g);
    E('rect', { x: -20, y: -44, width: 40, height: 88, rx: 3, fill: '#F2E9C9', opacity: 0.85, transform: 'rotate(12)' }, g.tape);
    E('rect', { x: -20, y: -44, width: 40, height: 88, rx: 3, fill: '#F2E9C9', opacity: 0.85, transform: 'rotate(-14)' }, g.tape);
    g.place = (split, cx, cy) => {
      const wa = g.a.w, wb = g.b.w, joinX = cx - (wa + wb) / 2 + wa - 6;
      tr(g.a, lerp(joinX - wa / 2 + 6, cx, split), lerp(cy, cy - 110, split));
      tr(g.b, lerp(joinX + wb / 2 - 6, cx, split), lerp(cy, cy + 110, split));
      tr(g.tape, joinX, cy); op(g.tape, 1 - clamp(split * 3));
    };
    return g;
  }
  const glueH = clGlued(FG.strong);
  const glueI = clGlued(FG.stare);
  const neq = T(FG.stare, 880, 312, '≠', { size: 110, weight: 800, anchor: 'middle', fill: '#FFE45C' });
  const twoChip = chip(FG.stare, 'two different things', { size: 30, fill: clDark, stroke: C.line, color: C.energy });
  const flexLines = G(FG.strong);
  [[-170, -60, -210, -90], [170, -60, 210, -90], [-180, 10, -228, 10], [180, 10, 228, 10]].forEach(([a, b, c, d]) => E('line', { x1: a, y1: b, x2: c, y2: d, stroke: '#FFE45C', 'stroke-width': 6, 'stroke-linecap': 'round' }, flexLines));

  /* ---------- strength + concentration: two beakers ---------- */
  const BX = [340, 860], BY = 430;
  const bk = BX.map(x => { const b = beaker(BK.strength, 360, 330, { level: 0.85, liquid: ngPH(1), opacity: 0.3 }); tr(b, x, BY); return b; });
  const MOL = [[-105, -70], [0, -85], [105, -70], [-105, 50], [0, 35], [105, 50]];
  // strength: H+ (white) + partner (green Cl- in the strong acid, orange in the weak acid)
  const strMol = [0, 1].map(side => MOL.map(() => {
    const g = G(BK.strength);
    const pr = E('circle', { r: 22, fill: side === 0 ? ball('#9BE36A', '#3E8F2A') : ball('#FFB36B', '#C2651B'), stroke: side === 0 ? '#3E8F2A' : '#C2651B', 'stroke-width': 3 }, g);
    const h = E('circle', { r: 13, fill: ball(C.hydrogen, C.hydrogenDk), stroke: C.hydrogenDk, 'stroke-width': 2.5 }, g);
    return { g, h };
  }));
  const strDef = clChip(FG.strength, 'STRENGTH: how fully it splits into ions', { size: 32, stroke: '#FFE45C' });
  const strHead = [chip(FG.strength, 'STRONG', { size: 36, fill: '#E8424F', color: '#FFFFFF', stroke: '#FFFFFF', sw: 3 }), chip(FG.strength, 'WEAK', { size: 36, fill: '#FF8A1F', color: '#FFFFFF', stroke: '#FFFFFF', sw: 3 })];
  const strFoot = [chip(FG.strength, 'ionises FULLY', { size: 32, fill: clDark, stroke: '#E8424F', sw: 3 }), chip(FG.strength, 'ionises PARTLY', { size: 32, fill: clDark, stroke: '#FF8A1F', sw: 3 })];
  const legend = G(FG.strength);
  { const a = G(legend); tr(a, -70, 0); E('circle', { r: 13, fill: ball(C.hydrogen, C.hydrogenDk), stroke: C.hydrogenDk, 'stroke-width': 2.5 }, a); ngFormula(a, 40, 10, 'H^+', { size: 28 });
    const b = G(legend); tr(b, 60, 0); E('circle', { r: 16, fill: ball('#9BE36A', '#3E8F2A') }, b); T(b, 26, 10, 'partner ion', { size: 26, weight: 700, font: FB, fill: C.muted }); }
  // concentration: acid particles (H stuck to Cl) and water molecules
  function clAcid(p) { const g = G(p); E('circle', { cx: 8, r: 15, fill: ball('#9BE36A', '#3E8F2A'), stroke: '#3E8F2A', 'stroke-width': 2 }, g); E('circle', { cx: -12, cy: -6, r: 10, fill: ball(C.hydrogen, C.hydrogenDk), stroke: C.hydrogenDk, 'stroke-width': 2 }, g); return g; }
  const rC = rng(23);
  const grid = (n, i) => { const cols = Math.ceil(Math.sqrt(n * 1.6)), rows = Math.ceil(n / cols); const c = i % cols, r = Math.floor(i / cols); return [(c - (cols - 1) / 2) * (280 / cols), (r - (rows - 1) / 2) * (210 / rows) + 10]; };
  const concSet = [[11, 3], [3, 11]].map(([na, nw], side) => {
    const items = [];
    const n = na + nw;
    const order = []; for (let i = 0; i < n; i++) order.push(i);
    for (let i = n - 1; i > 0; i--) { const j = Math.floor(rC() * (i + 1)); const tmp = order[i]; order[i] = order[j]; order[j] = tmp; }
    for (let i = 0; i < n; i++) {
      const isAcid = order[i] < na, g = isAcid ? clAcid(BK.strength) : clWater(BK.strength, 10);
      const [dx, dy] = grid(n, i);
      items.push({ g, x: BX[side] + dx + (rC() - 0.5) * 14, y: BY + dy + (rC() - 0.5) * 14, a: rC() * 6 });
    }
    return items;
  });
  const concDef = clChip(FG.strength, 'CONCENTRATION: how much acid is in the water', { size: 32, stroke: C.water });
  const concHead = [chip(FG.strength, 'CONCENTRATED', { size: 34, fill: '#B32630', color: '#FFFFFF', stroke: '#FFFFFF', sw: 3 }), chip(FG.strength, 'DILUTE', { size: 34, fill: C.waterDk, color: '#FFFFFF', stroke: '#FFFFFF', sw: 3 })];
  const concFoot = [chip(FG.strength, 'lots of acid', { size: 30, fill: clDark, stroke: '#B32630', sw: 3 }), chip(FG.strength, 'a little acid, lots of water', { size: 30, fill: clDark, stroke: C.water, sw: 3 })];
  const concLeg = G(FG.strength);
  { const a = clAcid(concLeg); tr(a, -130, 0); T(concLeg, -100, 10, 'acid', { size: 26, weight: 700, font: FB, fill: C.muted }); const w = clWater(concLeg, 10); tr(w, 20, -2); T(concLeg, 50, 10, 'water', { size: 26, weight: 700, font: FB, fill: C.muted }); }

  /* ---------- today / safer: the 2 x 2 grid ---------- */
  const GX = [735, 975], GY = [305, 465];
  const gridG = G(Lprop);
  const cells = [];
  for (let r = 0; r < 2; r++) for (let c = 0; c < 2; c++) cells.push(E('rect', { x: GX[c] - 115, y: GY[r] - 75, width: 230, height: 150, rx: 14, fill: 'rgba(10,27,39,0.88)', stroke: C.line, 'stroke-width': 3 }, gridG));
  T(gridG, GX[0], 210, 'STRONG', { size: 32, weight: 800, anchor: 'middle', fill: '#FF8A7A' });
  T(gridG, GX[1], 210, 'WEAK', { size: 32, weight: 800, anchor: 'middle', fill: '#FFC27A' });
  T(gridG, 0, 0, 'CONC.', { size: 28, weight: 800, anchor: 'middle', fill: '#FFB0A0' }).setAttribute('transform', `translate(598 ${GY[0]}) rotate(-90)`);
  T(gridG, 0, 0, 'DILUTE', { size: 28, weight: 800, anchor: 'middle', fill: '#9FE6FF' }).setAttribute('transform', `translate(598 ${GY[1]}) rotate(-90)`);
  const cellHi = E('rect', { width: 242, height: 162, rx: 18, fill: 'none', stroke: '#7CE38F', 'stroke-width': 7 }, gridG);
  const cellWarn = E('rect', { width: 242, height: 162, rx: 18, fill: 'none', stroke: '#FF8A1F', 'stroke-width': 7 }, gridG);
  const gHal = cast(gridG, 'hal', { mood: 'happy' });
  const scary = G(gridG); tr(scary, GX[0], GY[0]);
  E('path', { d: 'M0,-58 L40,8 L-40,8 Z', fill: '#FFD43B', stroke: INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, scary);
  E('path', { d: 'M0,-38 L0,-12', stroke: INK, 'stroke-width': 7, 'stroke-linecap': 'round' }, scary);
  E('circle', { cy: -1, r: 4, fill: INK }, scary);
  T(scary, 0, 50, 'NOT for Year 8', { size: 26, weight: 800, anchor: 'middle', fill: '#FFB0A0' });
  const labChip = chip(FG.today, 'school lab', { size: 30, fill: '#7CE38F', color: '#0E2A1A', stroke: '#FFFFFF', sw: 2 });
  const saferChip = G(FG.safer);
  chip(saferChip, 'can be SAFER', { size: 30, fill: '#7CE38F', color: '#0E2A1A', stroke: '#FFFFFF', sw: 2 });
  tr(tick(saferChip, 14, '#FFFFFF'), 0, 0); saferChip.lastChild.setAttribute('transform', 'translate(150 0)');
  const bang = G(FG.safer);
  E('circle', { r: 30, fill: '#FF8A1F', stroke: '#FFFFFF', 'stroke-width': 4 }, bang);
  T(bang, 0, 16, '!', { size: 46, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  const riskChip = chip(FG.safer, 'can be more harmful', { size: 28, fill: clDark, stroke: '#FF8A1F', sw: 3, color: '#FFC27A' });

  /* ---------- corrosive / irritant ---------- */
  function clDiamond(p) {
    const g = G(p);
    E('path', { d: 'M0,-150 L150,0 L0,150 L-150,0 Z', fill: '#FFFFFF', stroke: '#E8242F', 'stroke-width': 14, 'stroke-linejoin': 'round' }, g);
    return g;
  }
  const dC = clDiamond(FG.corrosive), dI = clDiamond(FG.corrosive);
  // corrosive pictogram: two tubes pour drops onto a hand and a slab, both eaten away
  [-1, 1].forEach(sd => {
    const tb = G(dC); tr(tb, sd * 42, -70, 1, sd * -40);
    E('rect', { x: -12, y: -40, width: 24, height: 70, rx: 10, fill: '#FFFFFF', stroke: INK, 'stroke-width': 4 }, tb);
  });
  E('path', { d: 'M-96,62 L-96,30 Q-96,18 -86,18 L-80,18 L-80,-2 Q-74,-10 -68,-2 L-68,18 L-62,18 L-62,6 Q-56,-2 -50,6 L-50,30 Q-44,24 -38,30 L-46,62 Z', fill: INK }, dC);
  E('path', { d: 'M8,40 L84,40 L84,62 L8,62 Z M30,40 Q38,50 46,40 M58,40 Q64,48 70,40', fill: INK, stroke: '#FFFFFF', 'stroke-width': 3 }, dC);
  const cDrops = [0, 1].map(() => E('path', { d: 'M0,-10 Q7,2 0,8 Q-7,2 0,-10 Z', fill: INK }, dC));
  E('rect', { x: -14, y: -96, width: 28, height: 112, rx: 10, fill: INK }, dI);
  E('circle', { cy: 54, r: 17, fill: INK }, dI);
  const cHead = chip(FG.corrosive, 'CONCENTRATED', { size: 30, fill: clDark, stroke: '#FF8A7A', sw: 3, color: '#FFB0A0' });
  const iHead = chip(FG.corrosive, 'DILUTE', { size: 30, fill: clDark, stroke: '#9FE6FF', sw: 3, color: '#9FE6FF' });
  const cName = T(FG.corrosive, 360, 590, 'CORROSIVE', { size: 44, weight: 800, anchor: 'middle', fill: '#FF8A7A' });
  const cDesc = T(FG.corrosive, 360, 636, 'destroys skin and eyes', { size: 30, weight: 700, anchor: 'middle' });
  const iName = T(FG.corrosive, 840, 590, 'IRRITANT', { size: 44, weight: 800, anchor: 'middle', fill: '#FFC27A' });
  const iDesc = T(FG.corrosive, 840, 636, 'redness, itching', { size: 30, weight: 700, anchor: 'middle' });

  /* ---------- goggles: Kavya in the lab ---------- */
  const labBeaker = beaker(BK.goggles, 130, 150, { level: 0.6, liquid: ngPH(1) }); tr(labBeaker, 650, 485);
  const sign = G(FG.goggles);
  E('rect', { x: -160, y: -170, width: 320, height: 340, rx: 18, fill: '#FBF7EC', stroke: '#C9BFA6', 'stroke-width': 5 }, sign);
  E('path', { d: 'M-40,-70 Q-44,10 0,14 Q44,10 40,-70 Z', fill: '#FF8FB0', stroke: INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, sign);
  E('path', { d: 'M0,-60 L0,-14', stroke: '#C9577F', 'stroke-width': 4, 'stroke-linecap': 'round' }, sign);
  E('circle', { cy: -46, r: 86, fill: 'none', stroke: '#E8242F', 'stroke-width': 14 }, sign);
  E('path', { d: 'M-61,-107 L61,15', stroke: '#E8242F', 'stroke-width': 14, 'stroke-linecap': 'round' }, sign);
  T(sign, 0, 96, 'NEVER', { size: 40, weight: 800, anchor: 'middle', fill: '#C2262F' });
  T(sign, 0, 142, 'TASTE', { size: 40, weight: 800, anchor: 'middle', fill: '#C2262F' });
  const glint = E('path', { d: 'M0,-26 L10,0 L0,26 L-10,0 Z', fill: '#FFFFFF' }, FG.goggles);
  const notChip = chip(FG.goggles, 'NOT going to taste it', { size: 32, fill: clDark, stroke: C.bad, sw: 3 });

  const blackout = E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#000000' }, HUD);

  return t => {
    const [sid, , set] = shotAt(t);
    const talk = who => scTalk(S, t, who);
    op(blackout, 1 - P(t, S.first - 0.5, 0.5, linear));
    SH.forEach(([id]) => { op(FG[id], id === sid ? 1 : 0); op(BK[id], id === sid ? 1 : 0); });
    op(venue, set === 'venue' ? 1 : 0); confI.set(set === 'confI' ? 1 : 0, t); confH.set(set === 'confH' ? 1 : 0, t); op(lab, set === 'lab' ? 1 : 0);
    if (set === 'venue') venue.set(1, t * AMP);
    if (set === 'lab') lab.upd(t * AMP);
    const DIM = { what: 0.35, litmus: 0.4, strength: 0.6, today: 0.55, corrosive: 0.62, safer: 0.55 };
    op(dim, set === 'venue' ? (DIM[sid] || 0) : 0);
    op(gridG, sid === 'today' || sid === 'safer' ? 1 : 0);
    let k = 1, fx = 600, fy = 400;
    const shown = new Set();
    const put = (c, x, y, s, r) => { shown.add(c); tr(c, x, y, s, r); };
    op(bench, 0);

    /* ---------- scheme ---------- */
    if (sid === 'scheme') {
      k = 1 + 0.03 * P(t, at('scheme'), 5, linear); fx = 600; fy = 450;
      put(indi, 420, 470, 1.3);
      const fp = P(t, mid('scheme', 0.18), 0.7, easeOut);
      tr(fan, 840, 600, 1, -6 * (1 - fp));
      sw.forEach((g, i) => { tr(g, 0, 0, 1, lerp(0, -55 + i * 22, fp)); op(g, 1); });
      op(fan, P(t, mid('scheme', 0.1), 0.25, linear));
      clPop(schemeChip, t, mid('scheme', 0.2), 840, 190);
      const ip = P(t, mid('scheme', 0.62), 0.5, easeOut);
      op(isArrow, ip > 0 ? 1 : 0); isArrow.set(ip);
      clPop(isIndi, t, mid('scheme', 0.68), 420, 220);
      indi.set({ t, ph: 1, mood: t > mid('scheme', 0.7) ? 'smug' : 'deadpan', look: t < mid('scheme', 0.6) ? 0.8 : 0 });
    }

    /* ---------- what ---------- */
    if (sid === 'what') {
      put(indi, 300, 460, 1.2);
      indi.set({ t, talk: talk('indi'), ph: 1, mood: 'deadpan', look: t > mid('what', 0.4) ? 0.8 : 0 });
      clPop(indChip, t, at('what') + 0.05, 880, 180);
      op(indNote, P(t, mid('what', 0.18), 0.3, linear));
      tubes.forEach((g, i) => clPop(g, t, mid('what', 0.5 + i * 0.12), TUBES[i][0], 390));
      clPop(glance, t, mid('what', 0.86), 880, 640);
    }

    /* ---------- litmus ---------- */
    if (sid === 'litmus') {
      put(indi, 250, 470, 1.1);
      indi.set({ t, talk: talk('indi'), ph: 1, mood: 'deadpan', look: t > end('litmus') ? 0 : 0.8 });
      clPop(call, t, at('litmus') + 0.05, 860, 285);
      const bless_ = t > mid('litmus', 0.84);
      litmus.set({ t, mood: bless_ ? 'happy' : 'happy', look: -0.6, talk: 0 });
      demos.forEach((d, i) => {
        const t0 = mid('litmus', i ? 0.5 : 0.3);
        const dip = win(t, t0, t0 + 1.4, 0.3);
        tr(d.strip, 0, 0); d.strip.setAttribute('transform', `translate(0 ${(55 * dip).toFixed(1)})`);
        attr(d.strip, 'fill', ngMix(d.c0, d.c1, P(t, t0 + 0.3, 0.4, linear)));
      });
      clPop(lmRed, t, mid('litmus', 0.36), 740, 515);
      clPop(lmBlue, t, mid('litmus', 0.56), 990, 515);
      clPop(lmNo, t, mid('litmus', 0.7), 860, 610);
      clPop(bless, t, mid('litmus', 0.88), 250, 230);
    }

    /* ---------- rainbow ---------- */
    if (sid === 'rainbow') {
      put(indi, 380, 410, 1.45);
      indi.set({ t, talk: talk('indi'), ph: 1, mood: t > mid('rainbow', 0.66) ? 'smug' : 'deadpan', look: t > mid('rainbow', 0.2) && t < mid('rainbow', 0.66) ? 0.7 : 0 });
      const sw_ = P(t, mid('rainbow', 0.22), 1.6, ease);
      dyes.forEach((d, i) => {
        const [, x0, y0] = DYE[i], a0 = Math.atan2(y0 - 345, x0 - 900), r0 = Math.hypot(x0 - 900, y0 - 345);
        const a = a0 + sw_ * TAU * 1.1, r = r0 * (1 - sw_);
        op(d, clamp(P(t, at('rainbow') + i * 0.12, 0.3, linear) * (1 - P(t, mid('rainbow', 0.22) + 1.45, 0.15, linear))));
        tr(d, 900 + Math.cos(a) * r, 345 + Math.sin(a) * r, 1 - 0.4 * sw_);
      });
      fl.set(0.62 * P(t, mid('rainbow', 0.22) + 1.2, 0.6, easeOut), ngPH(7));
      arcs.forEach((a, i) => a.setAttribute('stroke-dashoffset', (1 - P(t, mid('rainbow', 0.7) + i * 0.06, 0.5, easeOut)).toFixed(3)));
      clPop(uiChip, t, at('rainbow') + 0.1, 900, 580);
      clPop(mixChip, t, mid('rainbow', 0.4), 900, 650);
    }

    /* ---------- walk: acidside, green, alkside ---------- */
    if (sid === 'walk') {
      // where Indi stands on the scale (her colour is the band she is in)
      let p = 0.3 + 1.4 * P(t, mid('acidside', 0.04), mid('acidside', 0.3) - mid('acidside', 0.04), linear);
      p = lerp(p, 3.5, P(t, mid('acidside', 0.34), 0.45, ease));
      p = lerp(p, 5.5, P(t, mid('acidside', 0.62), 0.45, ease));
      p = lerp(p, 7, P(t, at('green') - 0.1, 0.5, ease));
      p = lerp(p, 9.5, P(t, at('alkside') + 0.1, 0.5, ease));
      p = lerp(p, 13, P(t, mid('alkside', 0.48), 0.5, ease));
      const bi = clBand(p), band = BANDS[bi], ph = band[2];
      const moving = Math.abs(p - ph) > 0.2 && p > 1.8;
      put(indi, sx(p), 290 - (moving ? 10 * Math.abs(Math.sin(t * 10)) * AMP : 0), 0.95, moving ? 6 : 0);
      const calm = bi === 3;
      indi.set({ t, talk: talk('indi'), ph, mood: calm ? 'happy' : 'deadpan', look: 0 });
      phs.set(p, 0);
      attr(bandBox, 'x', sx(band[0]) - 37); attr(bandBox, 'width', sx(band[1]) - sx(band[0]) + 74);
      // range brackets appear as she names each band, then stay
      const BT = [at('acidside') + 0.05, mid('acidside', 0.38), mid('acidside', 0.66), at('green') + 0.25, at('alkside') + 0.3, mid('alkside', 0.55)];
      brackets.forEach((g, i) => { const q = P(t, BT[i], 0.35, easeOut); op(g, q); tr(g, 0, 16 * (1 - q)); });
      const GT = [mid('acidside', 0.86), at('green') + 0.4, mid('alkside', 0.86)];
      GROUPS.forEach((g, i) => { const q = P(t, GT[i], 0.4, easeOut); op(g, q); tr(g, 0, 12 * (1 - q)); });
      // the colour's name next to her
      const nx = sx(p) + (sx(p) > 760 ? -230 : 230);
      nameChip.label.textContent = band[3];
      attr(nameChip.box, 'fill', ngPH(ph));
      const nw = textWidth(band[3], 44, FD, 700) + 62; attr(nameChip.box, 'x', -nw / 2); attr(nameChip.box, 'width', nw);
      op(nameChip, 1); tr(nameChip, nx, 230);
      op(calmGlow, calm ? 0.7 * P(t, at('green') + 0.2, 0.6, linear) * (0.85 + 0.15 * Math.sin(t * 2)) : 0); tr(calmGlow, sx(7), 290);
      notes.forEach((n, i) => {
        const f = (t * 0.45 + i / 3) % 1;
        op(n, calm ? Math.sin(Math.PI * f) * P(t, at('green') + 0.4, 0.5, linear) : 0);
        tr(n, sx(7) + 130 + i * 18 + 10 * Math.sin(f * 7), 330 - f * 170, 1.1);
      });
      if (t > end('green')) op(calmGlow, 0);
    }

    /* ---------- pull: red, purple, stop ---------- */
    if (sid === 'pull') {
      const hIn = P(t, at('red') - 0.1, 0.45, easeOut), nIn = P(t, at('purple') - 0.1, 0.45, easeOut);
      const toHal = P(t, mid('red', 0.35), 0.35, ease), toNat = P(t, mid('purple', 0.3), 0.4, ease);
      let ix = 600 - 150 * toHal + 300 * toNat, ph = 7;
      if (t >= mid('red', 0.7)) ph = 1;
      if (t >= mid('purple', 0.62)) ph = 13;
      // tug of war, then "Please stop."
      const tug = t >= end('purple') + 0.05 && t < at('stop') + 0.25;
      if (tug) { const s = Math.sin(t * 22); ix = 600 + 70 * s; ph = s > 0 ? 13 : 1; }
      const settle = P(t, end('stop') + 0.05, 0.6, ease);
      if (t >= at('stop') + 0.25) { ix = 600; ph = lerp(13, 7, settle); }
      const twitchOn = t > end('stop') + 0.3;
      const jit = twitchOn && Math.sin(t * 31) > 0.6 ? 3 : 0;
      put(indi, ix + jit, 420, 1.3, tug ? 4 * Math.sin(t * 22) : 0);
      const iMood = t >= at('stop') ? (twitchOn && Math.sin(t * 13) > 0.85 ? 'annoyed' : 'deadpan') : (t > mid('red', 0.4) ? 'shock' : 'deadpan');
      indi.set({ t, talk: talk('indi'), ph, mood: iMood, look: t < at('purple') ? -0.8 : t < at('stop') ? 0.8 : 0 });
      put(hal, lerp(-160, 230, hIn), 440, 1.15);
      hal.set({ t, talk: talk('hal'), mood: t >= at('stop') ? 'shock' : 'happy', look: 0.8 });
      if (nIn > 0) { put(nat, lerp(1380, 990, nIn), 440, 1.15); nat.set({ t, talk: talk('natalie'), mood: t >= at('stop') ? 'shock' : 'smug', look: -0.8 }); }
      clPop(redTag, t, mid('red', 0.75), 260, 230);
      if (t >= at('purple')) op(redTag, 0);
      clPop(purTag, t, mid('purple', 0.66), 900, 230);
      if (t >= at('stop')) op(purTag, 0);
      op(twitch, twitchOn ? (Math.sin(t * 13) > 0.3 ? 1 : 0) : 0); tr(twitch, 720, 300);
      if (t >= at('stop')) { k = 1 + 0.1 * P(t, at('stop'), 1.6, ease); fx = 600; fy = 380; }
    }

    /* ---------- strong (Hal's confessional) ---------- */
    if (sid === 'strong') {
      const f1 = win(t, mid('strong', 0.3), mid('strong', 0.5), 0.1), f2 = win(t, mid('strong', 0.75), end('strong') + 0.3, 0.1);
      const flex = Math.max(f1, f2);
      put(hal, 400, 430 - 12 * flex * AMP, 1.45 * (1 + 0.07 * flex), 6 * flex * Math.sin(t * 16) * AMP);
      hal.set({ t, talk: talk('hal'), mood: flex > 0.5 ? 'happy' : 'smug', look: 0 });
      op(flexLines, flex); tr(flexLines, 400, 420, 1.45);
      op(glueH.a, P(t, mid('strong', 0.32), 0.25, linear)); op(glueH.b, P(t, mid('strong', 0.8), 0.25, linear));
      glueH.place(0, 860, 300);
      op(glueH.tape, P(t, mid('strong', 0.86), 0.2, linear));
      const gp = P(t, mid('strong', 0.32), 0.45, pop);
      glueH.setAttribute('transform', `translate(860 300) scale(${Math.max(0.01, 0.7 + 0.3 * gp).toFixed(3)}) translate(-860 -300)`);
    }

    /* ---------- stare + twothings (Indi's confessional) ---------- */
    if (sid === 'stare') {
      k = 1 + 0.1 * P(t, end('strong') + 0.2, at('twothings') - end('strong'), ease); fx = 430; fy = 380;
      put(indi, 430, 410, 1.5);
      indi.set({ t, talk: talk('indi'), ph: 1, mood: 'deadpan', look: t > mid('twothings', 0.4) ? 0.6 : 0 });
      const split = P(t, mid('twothings', 0.35), 0.6, ease);
      glueI.place(split, lerp(760, 880, split), 320);
      op(glueI, 1);
      op(neq, P(t, mid('twothings', 0.6), 0.3, linear));
      clPop(twoChip, t, mid('twothings', 0.75), 880, 600);
    }

    /* ---------- strength + conc ---------- */
    if (sid === 'strength') {
      const isConc = t >= at('conc') - 0.1;
      bk[0].set(0.85, isConc ? ngPH(0.5) : ngPH(1)); bk[1].set(0.85, isConc ? ngPH(2.5) : ngPH(4));
      // strength: every molecule splits on "Strong: fully", only two on "Weak: only partly"
      strMol.forEach((mols, side) => mols.forEach((m, i) => {
        op(m.g, isConc ? 0 : 1);
        if (isConc) return;
        const [dx, dy] = MOL[i], cx = BX[side] + dx + 5 * Math.sin(t * 1.3 + i) * AMP, cy = BY + dy + 5 * Math.cos(t * 1.1 + i * 2) * AMP;
        const splits = side === 0 || i === 1 || i === 3;
        const tS = side === 0 ? mid('strength', 0.62) + i * 0.08 : mid('strength', 0.84) + (i === 1 ? 0 : 0.15);
        const sp = splits ? P(t, tS, 0.6, easeOut) : 0;
        tr(m.g, cx, cy);
        const a = i * 1.7 + t * 0.6 * AMP;
        attr(m.h, 'cx', -20 * (1 - sp) + sp * 46 * Math.cos(a)); attr(m.h, 'cy', -14 * (1 - sp) + sp * 36 * Math.sin(a));
      }));
      concSet.forEach(items => items.forEach(it => { op(it.g, isConc ? 1 : 0); if (isConc) tr(it.g, it.x + 4 * Math.sin(t * 1.4 + it.a) * AMP, it.y + 4 * Math.cos(t * 1.2 + it.a) * AMP, 1, it.a * 30); }));
      [strDef, legend, ...strHead, ...strFoot, concDef, concLeg, ...concHead, ...concFoot].forEach(el => op(el, 0));
      if (!isConc) {
        clPop(strDef, t, at('strength') + 0.05, 600, 140);
        strHead.forEach((c, i) => clPop(c, t, at('strength') + 0.2 + i * 0.1, BX[i], 222));
        clPop(legend, t, mid('strength', 0.3), 600, 700);
        clPop(strFoot[0], t, mid('strength', 0.64), BX[0], 640);
        clPop(strFoot[1], t, mid('strength', 0.86), BX[1], 640);
      } else {
        clPop(concDef, t, at('conc') - 0.05, 600, 140);
        concHead.forEach((c, i) => clPop(c, t, at('conc') + 0.1 + i * 0.1, BX[i], 222));
        clPop(concLeg, t, mid('conc', 0.3), 640, 700);
        clPop(concFoot[0], t, mid('conc', 0.6), BX[0], 640);
        clPop(concFoot[1], t, mid('conc', 0.82), BX[1], 640);
      }
    }

    /* ---------- today + safer: the grid ---------- */
    if (sid === 'today' || sid === 'safer') {
      const tl = sid === 'today';
      put(indi, 260, 470, 1.1);
      indi.set({ t, talk: talk('indi'), ph: 1, mood: 'deadpan', look: 0.8 });
      const hp = tl ? P(t, mid('today', 0.22), 0.5, pop) : 1;
      op(gHal, clamp(hp * 3)); tr(gHal, GX[0], GY[1] - 160 * (1 - clamp(hp)), Math.max(0.01, 0.48 * hp));
      gHal.set({ t, mood: tl ? 'happy' : 'smug', look: 0 });
      op(scary, tl ? P(t, mid('today', 0.62), 0.3, linear) : 1);
      if (tl) clPop(labChip, t, mid('today', 0.35), GX[0], 592);
      const hi = tl ? 0 : P(t, mid('safer', 0.1), 0.3, linear);
      op(cellHi, hi); attr(cellHi, 'x', GX[0] - 121); attr(cellHi, 'y', GY[1] - 81);
      const wr = tl ? 0 : P(t, mid('safer', 0.66), 0.3, linear);
      op(cellWarn, wr); attr(cellWarn, 'x', GX[1] - 121); attr(cellWarn, 'y', GY[0] - 81);
      if (!tl) {
        clPop(saferChip, t, mid('safer', 0.38), GX[0], 592);
        clPop(bang, t, mid('safer', 0.7), GX[1], GY[0]);
        clPop(riskChip, t, mid('safer', 0.78), GX[1], 652);
      }
    }

    /* ---------- corrosive ---------- */
    if (sid === 'corrosive') {
      clPop(cHead, t, at('corrosive') + 0.05, 360, 170);
      clPop(dC, t, mid('corrosive', 0.12), 360, 370);
      op(cName, P(t, mid('corrosive', 0.3), 0.3, linear));
      op(cDesc, P(t, mid('corrosive', 0.52), 0.3, linear));
      cDrops.forEach((d, i) => { const f = (t * 0.9 + i * 0.5) % 1; tr(d, (i ? 1 : -1) * 58, -30 + f * 60); op(d, Math.sin(Math.PI * f)); });
      clPop(iHead, t, mid('corrosive', 0.74), 840, 170);
      clPop(dI, t, mid('corrosive', 0.8), 840, 370);
      op(iName, P(t, mid('corrosive', 0.84), 0.3, linear));
      op(iDesc, P(t, mid('corrosive', 0.9), 0.3, linear));
    }

    /* ---------- goggles (lab) ---------- */
    if (sid === 'goggles') {
      k = 1 + 0.08 * P(t, mid('goggles', 0.5), 3, ease); fx = 400; fy = 340;
      tr(kavW, 380, 420, 1.55); shown.add(kavW); op(bench, 1);
      const notWord = t > mid('goggles', 0.48) && t < mid('goggles', 0.75);
      kavya.set({ t, talk: talk('kavya'), mood: notWord ? 'annoyed' : 'deadpan', look: t > mid('goggles', 0.4) && t < mid('goggles', 0.6) ? 0.7 : 0 });
      const gl = P(t, mid('goggles', 0.12), 0.5, linear);
      op(glint, gl > 0 && gl < 1 ? Math.sin(Math.PI * gl) : 0); tr(glint, 380 + lerp(-90, 90, gl) * 1.55 * 0.6, 420 - 34 * 1.55, 1, 20);
      labBeaker.set(0.6, ngPH(1));
      clPop(sign, t, mid('goggles', 0.55), 900, 300);
      clPop(notChip, t, mid('goggles', 0.62), 900, 600);
    }

    [indi, hal, nat, kavW].forEach(c => op(c, shown.has(c) ? 1 : 0));
    clCam(cam, k, fx, fy);
  };
});
