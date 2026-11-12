/* Scene 4: Forty years, two poles (Thursday).
   The drawer: a box marked MAGNETS -> Nora & Stan rise out of it (lower third, N / S chips, wedding photo,
   "forty years") -> the golden rule card -> another north pole: REPEL (Nora annoyed) -> it turns round,
   S clicks onto N, hearts ("that's how we met") -> Kavya with toy scissors, Nora shocked, Stan delighted
   -> the cut: two smaller magnets, each N and S -> iron, steel, nickel, cobalt fly on ("I See No Cobwebs")
   -> Nora's confessional: copper, aluminium, gold feel nothing -> field lines draw in, tracers N -> S,
   never cross, strongest at the poles -> iron filings and plotting compasses -> a hiker's compass settles
   north; the Earth is a giant magnet -> cutaway Earth: molten iron core, magnetic S under geographic N ->
   the needle's N falls for the Earth's S -> "I married one." */
scene('magnets', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;

  /* ---------- local helpers (prefixed mag) ---------- */
  const magPop = (el, x, y, p, s, r) => { op(el, clamp(p * 2.5)); tr(el, x, y, Math.max(0.01, (s || 1) * (0.6 + 0.4 * p)), r); };
  const magCam = (el, cx, cy, k) => el.setAttribute('transform', `translate(${cx.toFixed(1)} ${cy.toFixed(1)}) scale(${k.toFixed(4)}) translate(${(-cx).toFixed(1)} ${(-cy).toFixed(1)})`);
  const magChip = (parent, text, o) => {
    o = o || {};
    return chip(parent, text, { size: o.size || 32, fill: o.fill || 'rgba(10,27,39,0.9)', stroke: o.stroke || C.line, sw: o.sw || 2, color: o.color || C.ink, weight: 800 });
  };
  const HEART = 'M0,12 C-26,-4 -20,-26 0,-12 C20,-26 26,-4 0,12 Z';
  const magHeart = (parent, s) => { const h = E('path', { d: HEART, fill: '#FF5C8A', stroke: '#B3264F', 'stroke-width': 2 }, parent); return h; };
  // bar magnet piece of width w, height h (N red on the left unless flip); faces: 'cross' | 'happy' | ''
  function magBar(parent, w, h, flip, face) {
    const g = G(parent);
    const m = magnet(g, w, h, { flip });
    E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: 10, fill: 'none', stroke: SC_INK, 'stroke-width': 4 }, g);
    if (face) {
      [-14, 14].forEach(x => {
        if (face === 'happy') E('path', { d: `M${x - 7},${-h * 0.12} Q${x},${-h * 0.12 - 9} ${x + 7},${-h * 0.12}`, fill: 'none', stroke: '#FFFFFF', 'stroke-width': 4, 'stroke-linecap': 'round' }, g);
        else { E('circle', { cx: x, cy: -h * 0.12, r: 7, fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 2 }, g); E('circle', { cx: x + (flip ? 2 : -2), cy: -h * 0.12, r: 3.5, fill: SC_INK }, g); }
      });
      if (face === 'cross') E('path', { d: `M-24,${-h * 0.12 - 14} L-6,${-h * 0.12 - 8} M24,${-h * 0.12 - 14} L6,${-h * 0.12 - 8}`, stroke: SC_INK, 'stroke-width': 4, 'stroke-linecap': 'round' }, g);
    }
    return g;
  }
  // toy scissors: g.set(open 0..1)
  function magScissors(parent) {
    const g = G(parent);
    const a = G(g), b = G(g);
    E('path', { d: 'M0,0 L-120,-10 L-120,4 Z', fill: '#D3DBE3', stroke: SC_INK, 'stroke-width': 3, 'stroke-linejoin': 'round' }, a);
    E('ellipse', { cx: 34, cy: 12, rx: 24, ry: 16, fill: 'none', stroke: '#FF8A3D', 'stroke-width': 10 }, a);
    E('path', { d: 'M0,0 L-120,10 L-120,-4 Z', fill: '#E6EBF0', stroke: SC_INK, 'stroke-width': 3, 'stroke-linejoin': 'round' }, b);
    E('ellipse', { cx: 34, cy: -12, rx: 24, ry: 16, fill: 'none', stroke: '#FF8A3D', 'stroke-width': 10 }, b);
    E('circle', { r: 6, fill: SC_INK }, g);
    g.set = o => { tr(a, 0, 0, 1, -16 * o); tr(b, 0, 0, 1, 16 * o); };
    g.set(0.5);
    return g;
  }

  /* ---------- layers ---------- */
  const cam = G(root);
  const Lset = G(cam), Lshot = G(cam), Lcast = G(cam), Lfront = G(cam);
  const Lov = G(root), Lhud = G(root);

  /* ---------- sets ---------- */
  const setDrawer = G(Lset); drDrawer(setDrawer);
  const setBench = G(Lset); drBench(setBench);
  const setLab = G(Lset); drLab(setLab);
  const setConf = drConf(Lset, 'magnet');
  const setMap = G(Lset);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#EFE2C0', '#DCC89C', true) }, setMap);
  { let d = ''; const r = rng(12);
    for (let k = 0; k < 7; k++) { const cx = 200 + r() * 800, cy = 120 + r() * 520; for (let j = 1; j <= 3; j++) d += `M${cx - 60 * j},${cy} Q${cx},${cy - 50 * j} ${cx + 60 * j},${cy} Q${cx},${cy + 44 * j} ${cx - 60 * j},${cy} `; }
    E('path', { d, fill: 'none', stroke: '#B59A62', 'stroke-width': 2, opacity: 0.6 }, setMap); }
  E('path', { d: 'M80,700 C260,600 300,520 470,520 S760,380 1120,300', fill: 'none', stroke: DR_RED, 'stroke-width': 5, 'stroke-dasharray': '4 14', 'stroke-linecap': 'round' }, setMap);
  E('path', { d: 'M1000,560 L1040,480 L1080,560 Z M1060,600 L1100,520 L1140,600 Z', fill: '#7FA36A', stroke: '#4E6E3E', 'stroke-width': 3 }, setMap);
  const setSpace = G(Lset);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#05091A', '#121A3A', true) }, setSpace);
  { let d = ''; const r = rng(77); for (let i = 0; i < 90; i++) { const x = r() * 1200, y = r() * 750, s = 1 + r() * 2.2; d += `M${x.toFixed(0)},${y.toFixed(0)} h${s.toFixed(1)} v${s.toFixed(1)} h${(-s).toFixed(1)} Z `; }
    E('path', { d, fill: '#FFFFFF', opacity: 0.7 }, setSpace); }
  const SETS = { drawer: setDrawer, bench: setBench, lab: setLab, conf: setConf, map: setMap, space: setSpace };

  /* ---------- the cast ---------- */
  const CAST = {};
  ['mag', 'kavya', 'cecil', 'eddie'].forEach(k => { const w = G(Lcast); CAST[k] = { w, c: cast(w, k === 'mag' ? 'magnet' : k) }; });

  /* =========== A: the box =========== */
  const boxB = G(Lshot), boxF = G(Lfront);
  E('path', { d: 'M-200,-60 L-170,-90 L170,-90 L200,-60 Z', fill: '#7A5A30', stroke: SC_INK, 'stroke-width': 4 }, boxB);
  E('rect', { x: -200, y: -60, width: 400, height: 130, rx: 6, fill: ball('#D9B47A', '#A47A42'), stroke: SC_INK, 'stroke-width': 4 }, boxF);
  E('rect', { x: -110, y: -34, width: 220, height: 64, rx: 8, fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 3 }, boxF);
  T(boxF, 0, 10, 'MAGNETS', { size: 38, weight: 800, anchor: 'middle', fill: DR_RED });
  const flapL = G(boxF), flapR = G(boxF);
  E('path', { d: 'M0,0 L200,0 L190,-16 L10,-16 Z', fill: '#C9A26B', stroke: SC_INK, 'stroke-width': 3, 'stroke-linejoin': 'round' }, flapL);
  E('path', { d: 'M0,0 L-200,0 L-190,-16 L-10,-16 Z', fill: '#C9A26B', stroke: SC_INK, 'stroke-width': 3, 'stroke-linejoin': 'round' }, flapR);
  const thuChip = magChip(Lov, 'THURSDAY', { size: 40, fill: DR_NAVY, stroke: '#FFFFFF', color: DR_GOLD, sw: 3 });
  const coupleChip = magChip(Lov, "the drawer's longest-married couple", { size: 30 });
  const boxHearts = G(Lshot); const bh = [0, 1, 2, 3].map(() => magHeart(boxHearts));

  /* =========== B: Nora & Stan rise =========== */
  const ltMag = scLowerThird(Lhud, ...DR_LOWER.magnet);
  const nChip = magChip(Lov, 'N = north pole', { size: 34, fill: '#5A1418', stroke: '#FF8A8E', color: '#FFFFFF' });
  const sChip = magChip(Lov, 'S = south pole', { size: 34, fill: '#142A5A', stroke: '#8EB4FF', color: '#FFFFFF' });
  const oneChip = magChip(Lov, 'one bar magnet, two poles', { size: 30, color: C.energy, stroke: C.energy });
  const photo = G(Lov);
  E('rect', { x: -120, y: -96, width: 240, height: 192, rx: 8, fill: '#C9A24A', stroke: '#6B4E12', 'stroke-width': 5 }, photo);
  E('rect', { x: -100, y: -76, width: 200, height: 130, fill: '#F6E7EE' }, photo);
  { const m = magBar(photo, 130, 44, false, ''); tr(m, 0, -6);
    E('path', { d: 'M-66,-28 Q-50,-56 -24,-30 L-40,20 Z', fill: '#FFFFFF', opacity: 0.85, stroke: '#C9D3DC', 'stroke-width': 2 }, photo);   // veil
    const h = magHeart(photo); tr(h, 0, -54, 0.7); }
  T(photo, 0, 82, 'EST. 1986', { size: 26, weight: 800, anchor: 'middle', fill: '#3A2A10' });
  const fortyChip = magChip(Lov, '40 YEARS', { size: 34, fill: '#FF5C8A', stroke: '#FFFFFF', color: '#FFFFFF', sw: 3 });

  /* =========== C: the golden rule =========== */
  const rule = G(Lov);
  E('rect', { x: -470, y: -250, width: 940, height: 500, rx: 26, fill: 'rgba(10,27,39,0.95)', stroke: C.energy, 'stroke-width': 4 }, rule);
  T(rule, 0, -196, 'THE GOLDEN RULE', { size: 40, weight: 800, anchor: 'middle', fill: C.energy, ls: 2 });
  E('line', { x1: -420, y1: 10, x2: 420, y2: 10, stroke: C.line, 'stroke-width': 3 }, rule);
  const row1 = G(rule), row2 = G(rule);
  T(row1, -410, -86, 'LIKE poles', { size: 44, weight: 800, fill: C.ink });
  T(row1, -410, -30, 'REPEL', { size: 56, weight: 800, fill: C.bad });
  T(row2, -410, 114, 'UNLIKE poles', { size: 44, weight: 800, fill: C.ink });
  T(row2, -410, 170, 'ATTRACT', { size: 56, weight: 800, fill: C.good });
  const r1a = magBar(row1, 170, 60, true), r1b = magBar(row1, 170, 60, false);
  const r2a = magBar(row2, 170, 60, true), r2b = magBar(row2, 170, 60, true);
  const r1arr = G(row1); arrow(r1arr, -20, -50, -80, -50, { color: C.bad, width: 7 }); arrow(r1arr, 20, -50, 80, -50, { color: C.bad, width: 7 });
  const r2arr = G(row2); arrow(r2arr, -90, -50, -30, -50, { color: C.good, width: 7 }); arrow(r2arr, 90, -50, 30, -50, { color: C.good, width: 7 });

  /* =========== D: another north pole =========== */
  const intrA = magBar(Lshot, 220, 80, true, 'cross'), intrB = magBar(Lshot, 220, 80, false, 'happy');
  const repArr = G(Lshot); arrow(repArr, -14, 0, -74, 0, { color: C.bad, width: 8 }); arrow(repArr, 14, 0, 74, 0, { color: C.bad, width: 8 });
  const clickSp = spark(Lshot, 30, { color: '#FFFFFF' });
  const metHearts = G(Lshot); const mh = [0, 1, 2, 3, 4].map(() => magHeart(metHearts));
  const nnChip = magChip(Lov, 'N + N: REPEL', { size: 36, color: C.bad, stroke: C.bad });
  const nsChip = magChip(Lov, 'N + S: ATTRACT', { size: 36, color: C.good, stroke: C.good });

  /* =========== E: Kavya with scissors =========== */
  const labFront = G(Lfront);
  E('rect', { x: 0, y: 560, width: 1200, height: 26, fill: '#2A2F36' }, labFront);
  E('rect', { x: 0, y: 586, width: 1200, height: 164, fill: '#C9B48E' }, labFront);
  E('path', { d: 'M300,586 L300,750 M600,586 L600,750 M900,586 L900,750', stroke: '#A6926C', 'stroke-width': 4 }, labFront);
  const kScis = magScissors(Lcast);
  const kChip = magChip(Lov, 'toy scissors', { size: 28 });

  /* =========== F: cut in half =========== */
  const snip = G(Lshot);
  const mkPiece = left => {
    const g = G(snip);
    E('rect', { x: -110, y: -46, width: 220, height: 92, rx: 10, fill: left ? ball('#F06A6F', '#A4232E') : ball('#6FA0F0', '#1E4FA8') }, g);
    const ov = E('rect', { x: left ? 0 : -110, y: -46, width: 110, height: 92, rx: 10, fill: left ? ball('#6FA0F0', '#1E4FA8') : ball('#F06A6F', '#A4232E') }, g);
    E('rect', { x: -110, y: -46, width: 220, height: 92, rx: 10, fill: 'none', stroke: SC_INK, 'stroke-width': 4 }, g);
    T(g, left ? -60 : 60, 18, left ? 'N' : 'S', { size: 50, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
    const nl = T(g, left ? 56 : -56, 18, left ? 'S' : 'N', { size: 50, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
    const sp = spark(g, 22, { color: '#FFFFFF' }); tr(sp, left ? 56 : -56, -56);
    return { g, ov, nl, sp };
  };
  const pcL = mkPiece(true), pcR = mkPiece(false);
  const cutLine = E('line', { x1: 600, y1: 220, x2: 600, y2: 380, stroke: '#FFFFFF', 'stroke-width': 4, 'stroke-dasharray': '10 8' }, snip);
  const sScis = magScissors(snip);
  const twoChip = magChip(Lov, 'two smaller magnets: each has an N and an S', { size: 32, color: C.energy, stroke: C.energy });
  const neverChip = magChip(Lov, 'never one pole on its own', { size: 36, fill: DR_NAVY, stroke: DR_GOLD, color: DR_GOLD, sw: 3 });

  /* =========== G: magnetic materials =========== */
  const mats = G(Lshot);
  const ITEMS = [];
  { // iron paper clip
    const g = G(mats); E('path', { d: 'M-32,-9 L24,-9 Q36,-9 36,0 Q36,9 24,9 L-24,9 Q-31,9 -31,2 Q-31,-4 -24,-4 L20,-4', fill: 'none', stroke: '#B9C4CF', 'stroke-width': 5, 'stroke-linecap': 'round' }, g);
    ITEMS.push({ g, x: 240, f: 0.43, tx: 418, ty: 270, tr: 90, word: 'iron' }); }
  { // steel spoon
    const g = G(mats); E('rect', { x: -14, y: -5, width: 70, height: 10, rx: 5, fill: '#C9D3DC', stroke: SC_INK, 'stroke-width': 2 }, g);
    E('ellipse', { cx: -30, cy: 0, rx: 20, ry: 13, fill: ball('#E6EBF0', '#8E9BA8'), stroke: SC_INK, 'stroke-width': 2 }, g);
    ITEMS.push({ g, x: 480, f: 0.5, tx: 800, ty: 275, tr: 180, word: 'steel' }); }
  { // nickel coin
    const g = G(mats); E('circle', { r: 26, fill: ball('#E6EBF0', '#9AA6B2'), stroke: SC_INK, 'stroke-width': 3 }, g);
    T(g, 0, 10, 'Ni', { size: 26, weight: 800, anchor: 'middle', fill: '#5A6470' });
    ITEMS.push({ g, x: 720, f: 0.58, tx: 424, ty: 340, tr: 0, word: 'nickel' }); }
  { // cobalt chip
    const g = G(mats); E('path', { d: 'M-26,-14 L6,-24 L28,-4 L18,20 L-16,22 L-30,4 Z', fill: ball('#7F93C9', '#3F4F86'), stroke: SC_INK, 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
    T(g, 0, 9, 'Co', { size: 26, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
    ITEMS.push({ g, x: 960, f: 0.66, tx: 778, ty: 342, tr: 0, word: 'cobalt' }); }
  ITEMS.forEach(it => { it.c = magChip(Lov, it.word, { size: 30, color: C.energy, stroke: C.energy }); });
  const matChip = magChip(Lov, 'magnetic materials', { size: 34 });
  const mnem = G(Lov);
  E('rect', { x: -280, y: -42, width: 560, height: 84, rx: 20, fill: DR_NAVY, stroke: DR_GOLD, 'stroke-width': 4 }, mnem);
  T(mnem, 0, 16, '**I** **S**ee **N**o **C**obwebs', { size: 44, weight: 700, anchor: 'middle', fill: '#FFFFFF', boldFill: DR_GOLD });

  /* =========== H: Nora's confessional =========== */
  const nonmag = G(Lshot);
  const NM = [];
  { const g = G(nonmag); tr(g, 790, 420);
    E('rect', { x: -56, y: -18, width: 112, height: 36, fill: ball('#F2A65A', '#A85A1E'), stroke: SC_INK, 'stroke-width': 3 }, g);
    E('ellipse', { cx: 56, rx: 8, ry: 18, fill: '#7A3E12', stroke: SC_INK, 'stroke-width': 3 }, g); NM.push([g, 'copper', 790]); }
  { const g = G(nonmag); tr(g, 935, 410);
    E('rect', { x: -32, y: -50, width: 64, height: 100, rx: 10, fill: ball('#E6EBF0', '#8E9BA8'), stroke: SC_INK, 'stroke-width': 3 }, g);
    E('rect', { x: -32, y: -12, width: 64, height: 30, fill: '#5EC8FF' }, g);
    T(g, 0, 12, 'Al', { size: 26, weight: 800, anchor: 'middle', fill: '#FFFFFF' }); NM.push([g, 'aluminium', 935]); }
  { const g = G(nonmag); tr(g, 1080, 425);
    E('circle', { r: 30, fill: 'none', stroke: '#E8B53A', 'stroke-width': 11 }, g);
    E('path', { d: 'M-10,-30 L0,-46 L10,-30 Z', fill: '#BFEAFF', stroke: SC_INK, 'stroke-width': 2 }, g); NM.push([g, 'gold', 1080]); }
  const nmX = NM.map(([g, name, x]) => {
    const lb = T(nonmag, x, 510, name, { size: 26, weight: 800, anchor: 'middle', fill: C.ink });
    const xx = cross(nonmag, 16); tr(xx, x, 320);
    return { g, lb, xx };
  });
  const nmChip = magChip(Lov, 'NOT magnetic', { size: 36, color: C.bad, stroke: C.bad });
  const nmChip2 = magChip(Lov, 'not all metals are magnetic', { size: 28 });

  /* =========== I: the field =========== */
  const fieldW = G(Lshot); tr(fieldW, 600, 410);
  const field = drField(fieldW, 320, { n: 4 });
  const glowN = E('ellipse', { cx: -175, cy: 0, rx: 110, ry: 120, fill: glow('#FFE45C') }, fieldW);
  const glowS = E('ellipse', { cx: 175, cy: 0, rx: 110, ry: 120, fill: glow('#FFE45C') }, fieldW);
  fieldW.insertBefore(glowS, field); fieldW.insertBefore(glowN, glowS);
  const tracers = [];
  for (let side = -1; side <= 1; side += 2) for (let k = 1; k < 4; k++) for (let j = 0; j < 2; j++) {
    const y0 = side * (12 + k * 13), spread = 60 + k * 70, h = side * (40 + k * 62);
    tracers.push({ el: E('circle', { r: 7, fill: C.energy, stroke: '#FFFFFF', 'stroke-width': 2 }, fieldW), P: [[-160, y0], [-160 - spread, y0 + h * 1.15], [160 + spread, y0 + h * 1.15], [160, y0]], j, k });
  }
  const defChip = magChip(Lov, 'magnetic field: where magnetic materials feel a force', { size: 30, color: C.ink, stroke: '#9FD8FF' });
  const flChip = magChip(Lov, 'field lines', { size: 38, color: '#9FD8FF', stroke: '#9FD8FF' });
  const nsDir = magChip(Lov, 'outside: N → S', { size: 34, color: C.energy, stroke: C.energy });
  const noCross = magChip(Lov, 'they never cross', { size: 34, color: C.energy, stroke: C.energy });
  const strongChip = magChip(Lov, 'closest together = strongest (at the poles)', { size: 32, color: C.energy, stroke: C.energy });

  /* =========== J: filings and compasses =========== */
  const filW = G(Lshot); tr(filW, 600, 400);
  const filings = drFilings(filW, 320, { width: 520, height: 280 });
  const CMP = [[-340, 0], [340, 0], [0, -175], [0, 175], [-250, -150], [250, 150]].map(([x, y], i) => {
    const c = drCompass(filW, 30); tr(c, x, y);
    const [bx, by] = drB(x, y, 160 * 0.82);
    return { c, x, y, a: Math.atan2(by, bx) * 180 / Math.PI, i };
  });
  const patChip = magChip(Lov, 'iron filings show the PATTERN', { size: 32, color: '#E6EBF0', stroke: '#E6EBF0' });
  const dirChip = magChip(Lov, 'a plotting compass shows the DIRECTION', { size: 32, color: C.energy, stroke: C.energy });

  /* =========== K: hiker's compass, then the Earth =========== */
  const bigC = G(Lshot); tr(bigC, 600, 380);
  E('rect', { x: -150, y: -150, width: 300, height: 330, rx: 30, fill: '#3F6E8C', stroke: SC_INK, 'stroke-width': 5 }, bigC);
  const bigComp = drCompass(bigC, 120);
  T(bigC, 0, -128, 'N', { size: 30, weight: 800, anchor: 'middle', fill: DR_RED });
  const tinyChip = magChip(Lov, 'a compass = a tiny magnet, free to spin', { size: 32 });
  const pointN = magChip(Lov, 'it points NORTH', { size: 34, color: DR_RED, stroke: DR_RED, fill: '#FFFFFF' });
  const earth = G(Lshot); tr(earth, 600, 390);
  E('circle', { r: 220, fill: glow('#7FC8FF'), opacity: 0.5 }, earth);
  E('circle', { r: 200, fill: ball('#4FA3E8', '#1D4F8E'), stroke: '#9FD8FF', 'stroke-width': 3 }, earth);
  E('path', { d: 'M-120,-110 Q-60,-160 10,-120 Q40,-60 -20,-30 Q-60,20 -110,-20 Q-150,-60 -120,-110 Z M40,20 Q110,-10 140,40 Q150,110 90,150 Q40,120 50,70 Q20,50 40,20 Z M-80,90 Q-40,70 -20,110 Q-40,160 -90,140 Z', fill: '#5BBF6A', stroke: '#2C8C4C', 'stroke-width': 3 }, earth);
  const ghost = G(earth);
  E('rect', { x: -30, y: -150, width: 60, height: 150, rx: 8, fill: '#3F7BE0' }, ghost);
  E('rect', { x: -30, y: 0, width: 60, height: 150, rx: 8, fill: '#E0474C' }, ghost);
  T(ghost, 0, -112, 'S', { size: 34, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  T(ghost, 0, 136, 'N', { size: 34, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  const giantChip = magChip(Lov, 'the Earth is a giant magnet', { size: 38, fill: DR_NAVY, stroke: DR_GOLD, color: DR_GOLD, sw: 3 });

  /* =========== L: cutaway Earth =========== */
  const core = G(Lshot); tr(core, 420, 420);
  E('circle', { r: 232, fill: '#3F7BE0', stroke: '#9FD8FF', 'stroke-width': 3 }, core);
  E('circle', { r: 220, fill: ball('#D9824A', '#8A3E1A') }, core);
  const coreGlow = E('circle', { r: 175, fill: glow('#FFB03A') }, core);
  E('circle', { r: 140, fill: ball('#FFB03A', '#E05A1A') }, core);
  const swirl = G(core);
  E('path', { d: 'M-100,-40 Q-60,-110 20,-100 M100,40 Q60,110 -20,100 M-110,60 Q-120,-10 -80,-70 M110,-60 Q120,10 80,70', fill: 'none', stroke: '#FFE45C', 'stroke-width': 6, 'stroke-linecap': 'round', opacity: 0.8 }, swirl);
  E('circle', { r: 56, fill: ball('#FFF3A8', '#FFC93C') }, core);
  const cMag = G(core);
  E('rect', { x: -26, y: -180, width: 52, height: 180, rx: 8, fill: '#3F7BE0', stroke: SC_INK, 'stroke-width': 3 }, cMag);
  E('rect', { x: -26, y: 0, width: 52, height: 180, rx: 8, fill: '#E0474C', stroke: SC_INK, 'stroke-width': 3 }, cMag);
  T(cMag, 0, -142, 'S', { size: 34, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  T(cMag, 0, 166, 'N', { size: 34, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  const flag = G(core); tr(flag, 0, -232);
  E('line', { x1: 0, y1: 0, x2: 0, y2: -56, stroke: '#FFFFFF', 'stroke-width': 4 }, flag);
  E('path', { d: 'M0,-56 L40,-46 L0,-36 Z', fill: '#FFFFFF' }, flag);
  const lab = (text, y, fill, x2, y2) => {
    const g = G(Lshot);
    E('path', { d: `M690,${y - 10} L${x2},${y2}`, stroke: fill, 'stroke-width': 3 }, g);
    E('circle', { cx: x2, cy: y2, r: 6, fill }, g);
    T(g, 700, y, text, { size: 30, weight: 800, fill });
    return g;
  };
  const labCore = lab('molten iron (outer core)', 470, '#FFB03A', 540, 460);
  const labGeo = lab('geographic North Pole', 170, '#FFFFFF', 430, 180);
  const labMag = lab('magnetic SOUTH pole', 262, '#8EB4FF', 446, 262);
  const lComp = drCompass(Lshot, 34);
  const loveLine = E('path', { d: 'M286,250 L390,252', fill: 'none', stroke: '#FF5C8A', 'stroke-width': 5, 'stroke-dasharray': '8 8' }, Lshot);
  const loveHearts = G(Lshot); const lh = [0, 1, 2].map(() => magHeart(loveHearts));
  const unlikeChip = magChip(Lov, "needle's N ♥ Earth's S: unlike poles attract", { size: 30, color: '#FF8FB0', stroke: '#FF8FB0' });

  /* =========== M: married =========== */
  const marHearts = G(Lshot); const mrh = [0, 1, 2, 3, 4, 5].map(() => magHeart(marHearts));

  /* ---------- cut list ---------- */
  const CUTS = [
    [-1, 'box', 'drawer'],
    [at('nora') - 0.08, 'rise', 'drawer'],
    [at('rule') - 0.08, 'rule', 'bench'],
    [at('away') - 0.08, 'pair', 'drawer'],
    [at('cut') - 0.08, 'kav', 'lab'],
    [at('two') - 0.08, 'snip', 'bench'],
    [at('materials') - 0.08, 'mats', 'bench'],
    [at('thnora') - 0.08, 'conf', 'conf'],
    [at('field') - 0.08, 'field', 'bench'],
    [at('filings') - 0.08, 'fil', 'bench'],
    [at('compass') - 0.08, 'map', 'map'],
    [mid('compass', 0.47), 'earth', 'space'],
    [at('core') - 0.08, 'core', 'space'],
    [at('married') - 0.08, 'married', 'drawer'],
  ];
  const cutAt = t => { let c = CUTS[0]; for (const k of CUTS) if (t >= k[0]) c = k; return c; };
  const ALL = [boxB, boxF, thuChip, coupleChip, boxHearts, nChip, sChip, oneChip, photo, fortyChip, rule, intrA, intrB, repArr, clickSp, metHearts,
    nnChip, nsChip, labFront, kScis, kChip, snip, twoChip, neverChip, mats, matChip, mnem, nonmag, nmChip, nmChip2, fieldW, defChip, flChip,
    nsDir, noCross, strongChip, filW, patChip, dirChip, bigC, tinyChip, pointN, earth, giantChip, core, labCore, labGeo, labMag, lComp,
    loveLine, loveHearts, unlikeChip, marHearts].concat(ITEMS.map(i => i.c));
  const bez = (Pp, u) => { const v = 1 - u; return [0, 1].map(k => v * v * v * Pp[0][k] + 3 * v * v * u * Pp[1][k] + 3 * v * u * u * Pp[2][k] + u * u * u * Pp[3][k]); };
  const floatHearts = (hs, t, t0, x, y, spread, rise) => hs.forEach((h, i) => {
    const q = ((t - t0) * 0.5 + i / hs.length) % 1;
    if (t < t0) { op(h, 0); return; }
    tr(h, x + (i - (hs.length - 1) / 2) * spread + 10 * Math.sin(q * 6 + i) * AMP, y - q * rise, 0.9 + 0.4 * q); op(h, Math.sin(q * Math.PI) * clamp((t - t0) * 3));
  });

  return t => {
    const [, shot, set] = cutAt(t);
    Object.keys(SETS).forEach(k => op(SETS[k], k === set ? 1 : 0));
    ALL.forEach(g => op(g, 0));
    ltMag.set(0);
    let cx = 600, cy = 375, k = 1;
    const pose = {};
    const L = (id, f) => mid(id, f);

    /* ----- A: the box ----- */
    if (shot === 'box' || shot === 'rise') {
      op(boxB, 1); op(boxF, 1);
      const bx = shot === 'box' ? 600 : 520;
      const by = shot === 'box' ? 590 : 525;
      tr(boxB, bx, by); tr(boxF, bx, by);
      const fo = shot === 'box' ? P(t, L('thursday', 0.6), 0.6, easeOut) : 1;
      const fa = shot === 'box' ? 125 : 100;
      tr(flapL, -200, -60, 1, -fa * fo); tr(flapR, 200, -60, 1, fa * fo);
    }
    if (shot === 'box') {
      k = 1 + 0.06 * P(t, at('thursday'), 4.5, linear); cx = 600; cy = 520;
      magPop(thuChip, 330, 170, P(t, at('thursday') - 0.1, 0.45, pop));
      magPop(coupleChip, 820, 330, P(t, L('thursday', 0.55), 0.45, pop));
      op(boxHearts, 1); floatHearts(bh, t, L('thursday', 0.72), 600, 500, 60, 160);
      pose.cecil = { x: 210, y: 470, s: 0.7, mood: 'deadpan', look: 0.7 };
      pose.eddie = { x: 1000, y: 470, s: 0.6, mood: 'happy', look: -0.8 };
      const peek = P(t, L('thursday', 0.8), 0.5, easeOut);
      pose.mag = { x: 600, y: 600 - 70 * peek, s: 1.0, mood: 'happy', moodB: 'neutral', look: 0, lookB: 0, hide: peek <= 0 };
    }

    /* ----- B: Nora & Stan ----- */
    if (shot === 'rise') {
      const rp = P(t, at('nora') - 0.1, 0.6, pop);
      const stanSaid = t > at('stan');
      pose.mag = { x: 520, y: lerp(500, 380, rp), s: 1.15, mood: 'happy', moodB: stanSaid && t > L('stan', 0.75) ? 'deadpan' : 'neutral', look: t > L('stan', 0.7) ? 0.8 : 0, lookB: 0 };
      if (t > end('stan')) { k = 1 + 0.06 * P(t, end('stan'), 0.6, ease); cx = 560; cy = 380; }
      ltMag.set(win(t, at('nora') + 0.1, at('nora') + 3.3, 0.3));
      magPop(nChip, 940, 300, P(t, L('nora', 0.55), 0.45, pop));
      magPop(sChip, 940, 375, P(t, L('stan', 0.15), 0.45, pop));
      magPop(oneChip, 940, 450, P(t, L('stan', 0.45), 0.45, pop));
      magPop(photo, 990, 590, P(t, L('stan', 0.72), 0.45, pop), 1, -4);
      magPop(fortyChip, 1050, 500, P(t, L('stan', 0.82), 0.4, pop), 1, 6);
    }

    /* ----- C: the rule ----- */
    if (shot === 'rule') {
      magPop(rule, 600, 420, P(t, at('rule') - 0.05, 0.45, pop));
      const p1 = P(t, L('rule', 0.28), 0.3, linear), p2 = P(t, L('rule', 0.6), 0.3, linear);
      op(row1, p1); op(row2, p2);
      const g1 = 40 + 30 * P(t, L('rule', 0.3), 0.5, easeOut) + 6 * Math.sin(t * 9) * AMP * (t > L('rule', 0.3) ? 1 : 0);
      tr(r1a, 160 - g1 / 2 - 85, -60); tr(r1b, 160 + g1 / 2 + 85, -60); tr(r1arr, 160, -60);
      const g2 = 70 * (1 - P(t, L('rule', 0.66), 0.35, easeIn));
      tr(r2a, 160 - g2 / 2 - 85, 140); tr(r2b, 160 + g2 / 2 + 85, 140); tr(r2arr, 160, 140); op(r2arr, g2 > 2 ? p2 : 0);
    }

    /* ----- D: repel, then attract ----- */
    if (shot === 'pair') {
      const met = t >= at('met') - 0.1;
      const arrive = P(t, at('away') - 0.1, 0.7, easeOut);
      const bounce = P(t, L('away', 0.35), 0.35, easeOut);
      let ix = lerp(-160, 400, arrive) - 70 * bounce;
      const shake = bounce > 0 && bounce < 1 ? 6 * Math.sin(t * 50) : 0;
      let push = 30 * bounce;
      // met: spin (scaleX), then slide in and click
      const sp = met ? P(t, at('met'), 0.5, linear) : 0;
      const slide = met ? P(t, L('met', 0.35), 0.35, easeIn) : 0;
      if (met) { ix = lerp(330, 760 + push - 160 - 110, slide); }
      const aS = met ? Math.max(0, 1 - sp * 2) : 1, bS = met ? Math.max(0, sp * 2 - 1) : 0;
      op(intrA, aS > 0.01 ? 1 : 0); op(intrB, bS > 0.01 ? 1 : 0);
      intrA.setAttribute('transform', `translate(${(ix + shake).toFixed(1)} 430) scale(${Math.max(0.01, aS).toFixed(3)} 1)`);
      intrB.setAttribute('transform', `translate(${ix.toFixed(1)} 430) scale(${Math.max(0.01, bS).toFixed(3)} 1)`);
      op(repArr, !met && bounce > 0 ? 1 - P(t, end('away') + 0.1, 0.2, linear) : 0); tr(repArr, 550, 430);
      const clicked = met && slide >= 1;
      const ct = L('met', 0.35) + 0.35;
      op(clickSp, clicked && t < ct + 0.6 ? 1 - (t - ct) / 0.6 : 0); tr(clickSp, 600 + push, 430, 1 + (t - ct)); clickSp.upd(t);
      op(metHearts, clicked ? 1 : 0); if (clicked) floatHearts(mh, t, ct, 620, 360, 50, 200);
      if (met && t > end('met')) { k = 1 + 0.08 * P(t, end('met'), 0.8, ease); cx = 660; cy = 420; }
      pose.mag = { x: 760 + push, y: 430, s: 1.0, mood: met ? (clicked ? 'happy' : 'neutral') : (bounce > 0 ? 'annoyed' : 'neutral'),
        moodB: met ? 'happy' : 'deadpan', look: -1, lookB: met ? 0 : -1 };
      magPop(nnChip, 760, 280, met ? 0 : P(t, L('away', 0.35), 0.4, pop));
      magPop(nsChip, 760, 280, met ? P(t, ct, 0.4, pop) : 0);
    }

    /* ----- E: Kavya, toy scissors ----- */
    if (shot === 'kav') {
      op(labFront, 1);
      k = 1 + 0.04 * P(t, at('cut'), 3.5, linear); cx = 600; cy = 450;
      pose.kavya = { x: 400, y: 445, s: 1.25, mood: 'smug', look: 0.6 };
      op(kScis, 1); tr(kScis, 560, 400 + 4 * Math.sin(t * 2), 1, 200);
      kScis.set(t > L('cut', 0.3) && t < L('cut', 0.6) ? 0.5 + 0.5 * Math.sin(t * 18) : 0.6);
      magPop(kChip, 660, 270, P(t, at('cut'), 0.4, pop));
      const space = t > L('cut', 0.62);
      pose.mag = { x: 870, y: 520, s: 0.55, mood: t > L('cut', 0.32) ? (space ? 'annoyed' : 'shock') : 'neutral', moodB: space ? 'happy' : t > L('cut', 0.32) ? 'shock' : 'neutral', look: space ? 1 : -0.8, lookB: -0.8 };
    }

    /* ----- F: two smaller magnets ----- */
    if (shot === 'snip') {
      op(snip, 1);
      const sn = L('two', 0.1), sep = P(t, L('two', 0.2), 0.5, ease), nw = P(t, L('two', 0.42), 0.4, linear);
      tr(pcL.g, lerp(490, 370, sep), 300); tr(pcR.g, lerp(710, 830, sep), 300);
      [pcL, pcR].forEach(pc => { op(pc.ov, nw); op(pc.nl, nw); op(pc.sp, nw > 0 && nw < 1 ? 1 : (t > L('two', 0.42) && t < L('two', 0.42) + 1.2 ? 1 - (t - L('two', 0.42) - 0.4) / 0.8 : 0)); pc.sp.upd(t); });
      const sc = P(t, sn - 0.5, 0.5, easeOut) * (1 - P(t, sn + 0.4, 0.4, linear));
      op(sScis, sc); tr(sScis, 600, lerp(80, 250, P(t, sn - 0.5, 0.5, easeOut)), 1.1, -90); sScis.set(t > sn - 0.05 && t < sn + 0.2 ? 0 : 0.7);
      op(cutLine, P(t, sn, 0.1, linear) * (1 - sep));
      magPop(twoChip, 600, 450, P(t, L('two', 0.5), 0.45, pop));
      magPop(neverChip, 600, 540, P(t, L('two', 0.85), 0.45, pop));
      pose.mag = { x: 1020, y: 640, s: 0.5, mood: 'smug', moodB: 'neutral', look: -0.9, lookB: -0.9 };
    }

    /* ----- G: magnetic materials ----- */
    if (shot === 'mats') {
      op(mats, 1);
      magPop(matChip, 780, 140, P(t, L('materials', 0.2), 0.45, pop));
      let hit = 0;
      ITEMS.forEach((it, i) => {
        const t0 = L('materials', it.f), q = P(t, t0, 0.45, easeIn);
        const x = lerp(it.x, it.tx, q), y = lerp(500, it.ty, q) - 120 * Math.sin(q * Math.PI);
        tr(it.g, x, y + (q === 0 ? 3 * Math.sin(t * 3 + i) * AMP : 0), 1, lerp(0, it.tr, q));
        magPop(it.c, it.x, 570, P(t, t0 - 0.05, 0.4, pop) * (q < 1 ? 1 : 1));
        if (t > t0 + 0.45 && t < t0 + 0.75) hit = 1;
      });
      magPop(mnem, 600, 668, P(t, L('materials', 0.76), 0.45, pop));
      pose.mag = { x: 600, y: 300, s: 0.95, mood: hit ? 'shock' : 'happy', moodB: hit ? 'shock' : 'smug', look: 0, lookB: 0 };
    }

    /* ----- H: Nora's confessional ----- */
    if (shot === 'conf') {
      setConf.set(1, t);
      op(nonmag, 1);
      const nothing = t > L('thnora', 0.75);
      if (t > end('thnora')) { k = 1 + 0.12 * P(t, end('thnora'), 0.6, ease); cx = 400; cy = 400; }
      pose.mag = { x: 400, y: 420, s: 1.35, mood: nothing ? 'deadpan' : 'neutral', moodB: 'deadpan', look: nothing ? 0 : 0.8, lookB: nothing ? 0 : 0.6 };
      nmX.forEach(({ g, lb, xx }, i) => {
        const t0 = L('thnora', [0.3, 0.45, 0.6][i]);
        const p = P(t, t0, 0.4, pop);
        op(g, clamp(p * 2.5)); op(lb, clamp(p * 2.5));
        op(xx, P(t, L('thnora', 0.78), 0.2, linear));
      });
      magPop(nmChip, 935, 590, P(t, L('thnora', 0.8), 0.4, pop));
      magPop(nmChip2, 935, 220, P(t, L('thnora', 0.1), 0.4, pop));
    }

    /* ----- I: field, lines, strong ----- */
    if (shot === 'field') {
      op(fieldW, 1);
      field.set(P(t, L('field', 0.35), 1.8, linear));
      const lines = t >= at('lines') - 0.08, strong = t >= at('strong') - 0.08;
      tracers.forEach(({ el, P: Pp, j, k: kk }) => {
        if (!lines) { op(el, 0); return; }
        const u = ((t - at('lines')) * 0.22 * (0.6 + 0.4 * AMP) + j / 2 + kk * 0.13) % 1;
        const [x, y] = bez(Pp, u); attr(el, 'cx', x); attr(el, 'cy', y); op(el, Math.min(1, Math.sin(u * Math.PI) * 4));
      });
      const pulse = strong ? 0.55 + 0.45 * Math.sin((t - at('strong')) * 6) : 0;
      op(glowN, strong ? pulse * P(t, at('strong'), 0.3, linear) : 0); op(glowS, strong ? pulse * P(t, at('strong'), 0.3, linear) : 0);
      magPop(defChip, 600, 685, lines ? 0 : P(t, L('field', 0.2), 0.45, pop));
      magPop(flChip, 870, 150, lines ? 0 : P(t, L('field', 0.8), 0.45, pop));
      magPop(nsDir, 300, 685, strong ? 0 : P(t, L('lines', 0.2), 0.45, pop));
      magPop(noCross, 900, 685, strong ? 0 : P(t, L('lines', 0.65), 0.45, pop));
      magPop(strongChip, 600, 685, P(t, L('strong', 0.3), 0.45, pop));
      const wonder = !lines && t > L('field', 0.4);
      pose.mag = { x: 600, y: 410, s: 1.0, mood: strong ? 'smug' : 'happy', moodB: strong ? 'smug' : (lines ? 'neutral' : 'happy'),
        look: wonder ? Math.sin(t * 1.6) : 0, lookB: wonder ? Math.sin(t * 1.6 + 1) : 0 };
    }

    /* ----- J: filings and compasses ----- */
    if (shot === 'fil') {
      op(filW, 1);
      filings.set(P(t, L('filings', 0.08), 1.6, linear));
      CMP.forEach(({ c, a, i }) => {
        const t0 = L('filings', 0.5) + i * 0.07;
        const p = P(t, t0, 0.35, pop);
        op(c, clamp(p * 2.5)); tr(c, CMP[i].x, CMP[i].y, Math.max(0.01, 0.6 + 0.4 * p));
        const u = Math.max(0, t - t0);
        c.set(a + 130 * Math.exp(-u * 2.6) * Math.cos(u * 9));
      });
      magPop(patChip, 600, 150, P(t, L('filings', 0.15), 0.45, pop));
      magPop(dirChip, 600, 690, P(t, L('filings', 0.55), 0.45, pop));
      pose.mag = { x: 600, y: 400, s: 1.0, mood: 'happy', moodB: 'neutral', look: 0, lookB: 0 };
    }

    /* ----- K: hiker's compass / the Earth ----- */
    if (shot === 'map') {
      op(bigC, 1);
      const u = Math.max(0, t - at('compass'));
      bigComp.set(-90 + 110 * Math.exp(-u * 1.3) * Math.cos(u * 4.2 * (0.7 + 0.3 * AMP)));
      k = 1 + 0.05 * P(t, at('compass'), 3, linear); cx = 600; cy = 380;
      magPop(tinyChip, 600, 650, P(t, L('compass', 0.06), 0.45, pop));
      magPop(pointN, 880, 180, P(t, L('compass', 0.3), 0.4, pop), 1, 4);
    }
    if (shot === 'earth') {
      op(earth, 1);
      const ep = P(t, L('compass', 0.47), 0.6, easeOut);
      tr(earth, 600, 390, 0.85 + 0.15 * ep, 0);
      op(ghost, P(t, L('compass', 0.7), 0.5, linear) * 0.55);
      magPop(giantChip, 600, 680, P(t, L('compass', 0.62), 0.45, pop));
    }

    /* ----- L: the core, and love ----- */
    if (shot === 'core') {
      op(core, 1);
      tr(swirl, 0, 0, 1, (t * 14 * AMP) % 360);
      op(coreGlow, 0.6 + 0.4 * Math.sin(t * 3));
      op(cMag, P(t, L('core', 0.42), 0.4, linear) * 0.92);
      op(flag, 1);
      op(labCore, P(t, L('core', 0.25), 0.3, linear));
      op(labGeo, P(t, L('core', 0.5), 0.3, linear));
      op(labMag, P(t, L('core', 0.76), 0.3, linear));
      const loves = t >= at('loves') - 0.08;
      if (loves) {
        op(lComp, P(t, at('loves'), 0.3, linear)); tr(lComp, 250, 250);
        const u = Math.max(0, t - L('loves', 0.15));
        lComp.set(1 + 140 * Math.exp(-u * 2.2) * Math.cos(u * 7));
        op(loveLine, P(t, L('loves', 0.4), 0.3, linear));
        op(loveHearts, 1); floatHearts(lh, t, L('loves', 0.45), 338, 236, 34, 70);
        magPop(unlikeChip, 600, 690, P(t, L('loves', 0.2), 0.45, pop));
        if (t > end('loves')) { k = 1 + 0.05 * P(t, end('loves'), 0.6, ease); cx = 900; cy = 600; }
      }
      pose.mag = { x: 1010, y: 610, s: 0.55, mood: loves ? 'smug' : 'neutral', moodB: loves ? 'happy' : 'neutral', look: loves && t > L('loves', 0.6) ? 0.9 : -0.8, lookB: loves ? 0 : -0.8 };
    }

    /* ----- M: married ----- */
    if (shot === 'married') {
      k = 1.0 + 0.14 * P(t, at('married'), end('married') - at('married') + 0.9, ease); cx = 600; cy = 400;
      op(marHearts, 1); floatHearts(mrh, t, at('married') + 0.2, 470, 330, 22, 200);
      pose.mag = { x: 600, y: 420, s: 1.3, r: -6, mood: 'happy', moodB: 'deadpan', look: 1, lookB: 0 };
    }

    magCam(cam, cx, cy, k);

    /* ----- the cast ----- */
    Object.keys(CAST).forEach(kind => {
      const { w, c } = CAST[kind], p = pose[kind];
      if (!p || p.hide) { op(w, 0); return; }
      op(w, 1); tr(w, p.x, p.y, p.s, p.r);
      if (kind === 'mag') c.set({ t, talk: scTalk(S, t, 'nora'), talkB: scTalk(S, t, 'stan'), mood: p.mood, moodB: p.moodB, look: p.look || 0, lookB: p.lookB || 0, still: S.reduce });
      else c.set({ t, talk: scTalk(S, t, kind), mood: p.mood, look: p.look || 0, still: S.reduce });
    });
  };
});
