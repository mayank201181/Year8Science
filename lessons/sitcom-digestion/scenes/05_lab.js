/* Scene 5: Meanwhile, in the school lab (food tests).
   One bench shot (Kavya behind the bench on the left, a rack of four test tubes, the whiteboard above,
   video calls from the gut top right) and one confessional:
   whiteboard "FOOD TESTS" -> tube 1: iodine orange-brown -> blue-black (STARCH) -> Amy calls: "Mine!"
   -> Percy calls: iodine STARTS orange-brown (no starch: stays orange-brown), "DON'T WRITE IT BACKWARDS"
   -> tube 2: blue Benedict's... nothing (slow push-in) -> Percy: HEAT it, water bath -> the colour sweep
   blue, green, yellow, orange, brick-red -> tube 3: biuret blue -> purple; Priya calls: "Mine."
   -> tube 4: shake with ethanol, pour into water, cloudy white emulsion; Bill delighted, Lionel deadpan
   -> strength scale + a control tube (water, no food) -> Kavya's confessional: four colours, four calls
   all yelling MINE!, and Bill's "NOT AN ENZYME". */
scene('lab', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;
  const talk = (t, who) => scTalk(S, t, who);

  /* ---------- local helpers (prefixed lab) ---------- */
  const on = (t, a, b) => (t >= a && t < b ? 1 : 0);
  function labCamSet(el, k, cx, cy) { el.setAttribute('transform', `translate(${cx.toFixed(1)} ${cy.toFixed(1)}) scale(${k.toFixed(4)}) translate(${(-cx).toFixed(1)} ${(-cy).toFixed(1)})`); }
  function labPop(el, t, t0, x, y, s, r) { const p = P(t, t0, 0.4, pop); op(el, clamp(p * 2.5)); tr(el, x, y, Math.max(0.01, (s || 1) * (0.6 + 0.4 * p)), r); return p; }
  const labRGB = c => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16));
  function labMix(a, b, p) { p = clamp(p); const A = labRGB(a), B = labRGB(b); return '#' + A.map((v, i) => Math.round(lerp(v, B[i], p)).toString(16).padStart(2, '0')).join(''); }
  // colour along a list of [time, colour] stops
  function labStops(t, stops) {
    if (t <= stops[0][0]) return stops[0][1];
    for (let i = 1; i < stops.length; i++) if (t < stops[i][0]) return labMix(stops[i - 1][1], stops[i][1], ease((t - stops[i - 1][0]) / (stops[i][0] - stops[i - 1][0])));
    return stops[stops.length - 1][1];
  }
  // one line of text in several colours: segs = [[text, fill, weight], ...]; t.spans[i] for each part
  function labRich(parent, x, y, segs, o) {
    o = o || {};
    const t = E('text', { x, y, 'font-size': o.size || 32, 'font-weight': o.weight || 700, 'text-anchor': o.anchor || 'middle', 'font-family': FD, fill: o.fill || LAB_INK }, parent);
    t.spans = segs.map(([s, f, w]) => { const sp = E('tspan', { fill: f || o.fill || LAB_INK, 'font-weight': w || o.weight || 700 }, t); sp.textContent = s; return sp; });
    return t;
  }
  // a rubber stamp; g.set(p, x, y, rot) thumps it down
  function labStamp(parent, text, o) {
    o = o || {};
    const size = o.size || 40, col = o.color || C.bad, g = G(parent);
    const w = textWidth(text, size, FD, 800) + size * 1.2, h = size * 1.7;
    E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: 12, fill: o.fill || 'rgba(255,245,245,0.94)', stroke: col, 'stroke-width': 6 }, g);
    E('rect', { x: -w / 2 + 8, y: -h / 2 + 8, width: w - 16, height: h - 16, rx: 8, fill: 'none', stroke: col, 'stroke-width': 2, opacity: 0.6 }, g);
    T(g, 0, size * 0.36, text, { size, weight: 800, anchor: 'middle', fill: col, ls: 1 });
    g.set = (p, x, y, rot) => { op(g, clamp(p * 4)); tr(g, x, y, lerp(1.6, 1, easeOut(clamp(p))), rot); };
    return g;
  }
  // a dropping pipette (tip at 0,0) with three falling drops; g.set(t, t0, col, fall)
  function labDropper(parent) {
    const g = G(parent);
    const drops = [0, 1, 2].map(() => E('path', { d: 'M0,-9 Q7,2 0,7 Q-7,2 0,-9 Z', fill: '#C8701E', stroke: SC_INK, 'stroke-width': 1.5 }, g));
    const body = G(g);
    E('path', { d: 'M-9,-112 L9,-112 L9,-26 L2,0 L-2,0 L-9,-26 Z', fill: 'rgba(220,240,252,0.85)', stroke: SC_INK, 'stroke-width': 3, 'stroke-linejoin': 'round' }, body);
    g.liq = E('path', { d: 'M-6,-70 L6,-70 L6,-26 L1,-4 L-1,-4 L-6,-26 Z', fill: '#C8701E' }, body);
    E('path', { d: 'M-15,-112 L15,-112 L15,-128 Q15,-162 0,-162 Q-15,-162 -15,-128 Z', fill: '#D7263D', stroke: SC_INK, 'stroke-width': 3, 'stroke-linejoin': 'round' }, body);
    g.set = (t, t0, col, x, yTip, fallTo) => {
      // arrives at t0, drips from t0 + 0.35 for about 1 s, leaves at t0 + 1.7
      const inP = P(t, t0, 0.35, easeOut), outP = P(t, t0 + 1.6, 0.3, easeIn);
      op(g, inP * (1 - outP));
      tr(g, x, yTip, 0.6);
      attr(g.liq, 'fill', col);
      drops.forEach((d, i) => {
        const f = (t - (t0 + 0.4 + i * 0.32)) / 0.4;
        attr(d, 'fill', col);
        op(d, f > 0 && f < 1 ? 1 : 0);
        tr(d, 0, 8 + clamp(f) * clamp(f) * (fallTo - yTip) / 0.6);
      });
    };
    return g;
  }
  // a jagged speech burst
  function labBurst(parent, text, o) {
    o = o || {};
    const size = o.size || 40, g = G(parent), w = textWidth(text, size, FD, 800) + 60, h = size * 1.9;
    let d = '';
    for (let i = 0; i < 20; i++) { const a = i / 20 * TAU, r = i % 2 ? 0.82 : 1.08; d += (i ? 'L' : 'M') + (Math.cos(a) * w / 2 * r).toFixed(1) + ',' + (Math.sin(a) * h / 2 * r).toFixed(1); }
    E('path', { d: d + 'Z', fill: o.fill || '#FFE45C', stroke: o.stroke || '#D7263D', 'stroke-width': 5, 'stroke-linejoin': 'round' }, g);
    T(g, 0, size * 0.36, text, { size, weight: 800, anchor: 'middle', fill: o.color || '#D7263D' });
    return g;
  }
  // a video call with a cast member in it
  function labCall(parent, kind, label, w, h, s, dy) {
    const g = scVideoCall(parent, w, h, ' ');
    T(g, w / 2 - 4, -h / 2 - 12, label, { size: 24, weight: 700, anchor: 'end', fill: C.muted, font: FB });
    const c = cast(g.screen, kind, {}); tr(c, 0, dy || 0, s);
    g.c = c;
    return g;
  }
  const LAB_INK = '#1F2A36';
  const COL = {
    food1: '#F3E7C9', food2: '#F4EDD6', food3: '#F3E4DC', food4: '#FFF2C2',
    ob: '#C8701E', bb: '#1C1E46', blue: '#2F6FD6', green: '#58A83A', yellow: '#E8C832', orange: '#E8862A', brick: '#A8391C',
    biuret: '#3C7FD8', purple: '#8A3FC0', cloudy: '#F4F1E8',
  };

  /* ---------- layers ---------- */
  const labShot = G(root), labCam = G(labShot);
  const confShot = G(root);
  const hud = G(root);

  /* ================= the lab ================= */
  mgLab(labCam);
  const [BX, BY, BW] = [300, 110, 620], BCX = BX + BW / 2;
  // Kavya behind the bench (the bench front is redrawn in front of her)
  const kav = cast(labCam, 'kavya', { s: 1.3 });
  E('rect', { x: 0, y: 520, width: 1200, height: 40, fill: '#2E3A44' }, labCam);
  E('rect', { x: 0, y: 560, width: 1200, height: 190, fill: '#B98B5A' }, labCam);
  for (let x = 0; x < 1200; x += 200) { E('rect', { x: x + 14, y: 576, width: 172, height: 160, rx: 6, fill: '#C99B68', stroke: '#8E6338', 'stroke-width': 3 }, labCam); E('rect', { x: x + 90, y: 640, width: 20, height: 8, rx: 4, fill: '#6E4B28' }, labCam); }

  /* the whiteboard: one group of writing per beat */
  const board = G(labCam);
  const bTitle = (g, s) => T(g, BCX, 160, s, { size: 44, weight: 800, anchor: 'middle', fill: '#1F3A6E' });
  // lab: FOOD TESTS + rainbow "colour change"
  const bLab = G(board);
  T(bLab, BCX, 190, 'FOOD TESTS', { size: 60, weight: 800, anchor: 'middle', fill: '#1F3A6E', ls: 2 });
  const rainbow = [COL.bb, COL.brick, COL.purple, '#7D8C99'];
  const lcSegs = [['look for a ', LAB_INK]];
  'colour change'.split('').forEach((ch, i) => lcSegs.push([ch, ch === ' ' ? LAB_INK : rainbow[i % 4], 800]));
  const bLab2 = labRich(bLab, BCX, 256, lcSegs, { size: 38 });
  // iodine
  const bIod = G(board);
  bTitle(bIod, '1 · STARCH');
  const bIod2 = labRich(bIod, BCX, 208, [['iodine: ', LAB_INK], ['orange-brown', COL.ob, 800], [' → ', LAB_INK], ['blue-black', COL.bb, 800]], { size: 36 });
  // backwards
  const bBack = G(board);
  labRich(bBack, BCX, 168, [['iodine ', LAB_INK], ['STARTS', '#D7263D', 800], [' orange-brown', COL.ob, 800]], { size: 38 });
  const miniTube = (g, x, y, col) => { const m = testTube(g, 22, 64, { level: 0.6, liquid: col, opacity: 1 }); tr(m, x, y); return m; };
  const bBackA = G(bBack); miniTube(bBackA, 350, 214, COL.ob); labRich(bBackA, 380, 226, [['no starch: ', LAB_INK], ['stays orange-brown', COL.ob, 800]], { size: 30, anchor: 'start' });
  const bBackB = G(bBack); miniTube(bBackB, 350, 260, COL.bb); labRich(bBackB, 380, 272, [['starch: ', LAB_INK], ['turns blue-black', COL.bb, 800]], { size: 30, anchor: 'start' });
  // Benedict's
  const bBen = G(board);
  bTitle(bBen, "2 · SUGAR");
  const bBen2 = labRich(bBen, BCX, 208, [["Benedict's: ", LAB_INK], ['blue', COL.blue, 800], [' → ', LAB_INK], ['?', '#9AA6AE', 800]], { size: 36 });
  const bHeat = G(board);
  bTitle(bHeat, "2 · SUGAR");
  labRich(bHeat, BCX, 208, [['+ ', LAB_INK], ['HEAT', '#D7263D', 800], [' it in a water bath', LAB_INK]], { size: 36 });
  // the sweep: five swatches
  const bSweep = G(board);
  bTitle(bSweep, '2 · SUGAR: heated');
  const SW = [['blue', COL.blue, 0.03], ['green', COL.green, 0.2], ['yellow', COL.yellow, 0.36], ['orange', COL.orange, 0.52], ['brick-red', COL.brick, 0.72]];
  const swatches = SW.map(([n, c], i) => {
    const g = G(bSweep), x = BCX + (i - 2) * 118;
    E('rect', { x: x - 46, y: 196, width: 92, height: 44, rx: 10, fill: c, stroke: LAB_INK, 'stroke-width': 3 }, g);
    T(g, x, 278, n, { size: 26, weight: 700, anchor: 'middle', fill: LAB_INK });
    g.x = x; return g;
  });
  const swPtr = E('path', { d: 'M-12,0 L12,0 L0,-14 Z', fill: '#D7263D' }, bSweep);
  for (let i = 0; i < 4; i++) { const x = BCX + (i - 1.5) * 118; E('path', { d: `M${x - 7},211 L${x + 5},218 L${x - 7},225`, fill: 'none', stroke: LAB_INK, 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, bSweep); }
  // biuret
  const bBiu = G(board);
  bTitle(bBiu, '3 · PROTEIN');
  const bBiu2 = labRich(bBiu, BCX, 208, [['biuret: ', LAB_INK], ['blue', COL.biuret, 800], [' → ', LAB_INK], ['purple', COL.purple, 800]], { size: 36 });
  // fat
  const bFat = G(board);
  bTitle(bFat, '4 · FAT');
  const bFat2 = T(bFat, BCX, 208, 'shake with **ethanol**, pour into **water**', { size: 32, weight: 600, anchor: 'middle', fill: LAB_INK, boldFill: '#7550C4' });
  // control: strength scale
  const bCtl = G(board);
  T(bCtl, BCX, 166, 'stronger colour = more nutrient', { size: 38, weight: 800, anchor: 'middle', fill: '#1F3A6E' });
  const sgId = 'labStrength';
  { const lg = E('linearGradient', { id: sgId, x1: 0, y1: 0, x2: 1, y2: 0 }, defs());
    [[0, '#B8E07A'], [0.33, COL.yellow], [0.66, COL.orange], [1, COL.brick]].forEach(([o, c]) => E('stop', { offset: o, 'stop-color': c }, lg)); }
  const scaleBar = E('rect', { x: 350, y: 194, width: 520, height: 42, rx: 12, fill: `url(#${sgId})`, stroke: LAB_INK, 'stroke-width': 3 }, bCtl);
  T(bCtl, 350, 276, 'a little sugar', { size: 26, weight: 700, fill: LAB_INK });
  T(bCtl, 870, 276, 'lots of sugar', { size: 26, weight: 700, anchor: 'end', fill: LAB_INK });
  const scArrow = arrow(bCtl, 560, 266, 680, 266, { color: LAB_INK, width: 4 });
  const BOARDS = [bLab, bIod, bBack, bBen, bHeat, bSweep, bBiu, bFat, bCtl];

  /* the rack: four tubes of food samples */
  const RX = 640, RY = 445, RS = 1.2, GAP = 110;
  const TX = i => RX + (i - 1.5) * GAP * RS;            // tube centre on screen
  const TY = RY - 32 * RS, TTOP = RY - 127 * RS;       // tube centre y, tube top y
  const hiGlow = E('ellipse', { cx: 0, cy: 0, rx: 70, ry: 150, fill: glow('#FFF4B0'), opacity: 0 }, labCam);
  const rack = mgRack(labCam, 4, GAP); tr(rack, RX, RY, RS);
  const FOOD = [COL.food1, COL.food2, COL.food3, COL.food4];
  rack.tubes.forEach((tb, i) => tb.set(0.35, FOOD[i]));
  const home = i => [(i - 1.5) * GAP, -32];
  // test numbers on the bench edge
  for (let i = 0; i < 4; i++) T(labCam, TX(i), 548, String(i + 1), { size: 26, weight: 800, anchor: 'middle', fill: '#C9D3DC' });
  // hot plate + water bath (for Benedict's)
  const bathX = 1010;
  const bath = G(labCam);
  E('rect', { x: bathX - 110, y: 500, width: 220, height: 22, rx: 6, fill: '#3A4652', stroke: SC_INK, 'stroke-width': 3 }, bath);
  const hotLine = E('rect', { x: bathX - 90, y: 505, width: 180, height: 6, rx: 3, fill: '#FF5A2A' }, bath);
  const bathBk = beaker(bath, 190, 150, { level: 0.7, liquid: '#7FC8F0', opacity: 0.45 }); tr(bathBk, bathX, 425);
  const steam = heatWaves(bath, { n: 3, h: 50, spacing: 40, color: '#E9F2F7', width: 5 }); tr(steam, bathX, 355);
  // a small beaker of water (for the emulsion test)
  const potX = 1020;
  const pot = beaker(labCam, 120, 110, { level: 0.55, liquid: '#9FD8F5', opacity: 0.6 }); tr(pot, potX, 465);
  // the control tube in a wooden block
  const ctl = G(labCam);
  const ctlTube = testTube(ctl, 44, 190, { level: 0.4, liquid: COL.blue }); tr(ctlTube, 0, -32);
  E('rect', { x: -44, y: 30, width: 88, height: 36, rx: 6, fill: '#B9844A', stroke: '#6E4B28', 'stroke-width': 3 }, ctl);
  // the pour: a stream from tube 4 into the beaker
  const stream = E('path', { d: '', fill: 'none', stroke: '#E8E2F0', 'stroke-width': 7, 'stroke-linecap': 'round', opacity: 0.9 }, labCam);
  const cloudDots = G(labCam);
  { const r = rng(61); for (let i = 0; i < 7; i++) E('circle', { cx: potX - 40 + r() * 80, cy: 470 + r() * 40, r: 6 + r() * 6, fill: '#FFFFFF', opacity: 0.8 }, cloudDots); }
  const dropper = labDropper(labCam);

  /* bench-front chips (result words, big) */
  const benchChip = (txt, col, sz) => chip(labCam, txt, { size: sz || 36, fill: '#0E1A24', color: col || C.ink, stroke: col || C.line, sw: 3 });
  const cStarch = benchChip('STARCH ✓', '#8FA0FF');
  const cStill = benchChip('still blue...', '#7FB0FF', 30);
  const cHeat = benchChip('HEAT it: no heat, no result', '#FF8A5A', 32);
  const cBrick = benchChip('brick-red = reducing sugar ✓', '#FF8A6A', 34);
  const cProt = benchChip('PROTEIN ✓', '#C892F0');
  const cFat = benchChip('cloudy white emulsion = FAT ✓', '#F4F1E8', 34);
  const cCtl = benchChip('CONTROL: water, no food', '#9FD8FF', 30);
  const cNeg = chip(labCam, "stays blue = 'negative'", { size: 28, fill: 'rgba(14,26,36,0.85)', color: C.ink, stroke: C.line, sw: 2 });
  const stamp = labStamp(labCam, "DON'T WRITE IT BACKWARDS", { size: 40 });
  const BENCH = [cStarch, cStill, cHeat, cBrick, cProt, cFat, cCtl, cNeg];

  /* video calls from inside the gut (top right) */
  const CALLX = 1044, CALLY = 225, CW = 236, CH = 150;
  const callAmy = labCall(labCam, 'amy', 'Amy', CW, CH, 0.62, 18);
  const callPercy = labCall(labCam, 'percy', 'Percy', CW, CH, 0.5, 44);
  const pMic = mgMic(callPercy.screen, 0.4); tr(pMic, -46, 52, 0.4, 24);
  const callPriya = labCall(labCam, 'priya', 'Priya', CW, CH, 0.6, 26);
  const callBill = labCall(labCam, 'bill', 'Bill', CW, CH, 0.56, 36);
  const callLionel = labCall(labCam, 'lionel', 'Lionel', CW, CH, 0.56, 30);
  const CALLS = [callAmy, callPercy, callPriya, callBill, callLionel];
  const burstMine = labBurst(labCam, 'MINE!', { size: 44 });
  const burstMine2 = labBurst(labCam, 'Mine.', { size: 36, fill: '#E9D8FF', stroke: '#7A3DB0', color: '#4E2670' });
  const burstMove = labBurst(labCam, 'MY MOVE!', { size: 36, fill: '#F0FFB8', stroke: '#7E9A18', color: '#47591A' });
  const noteLionel = chip(labCam, "still MY fat.", { size: 30, fill: '#E9FBF8', color: '#0E302C', stroke: '#1E8576', sw: 3 });

  /* ================= confessional ================= */
  const conf = mgConf(confShot, 'kavya');
  const confCam = G(confShot);
  const kavC = cast(confCam, 'kavya', { s: 1.5 });
  // four tests, four colours
  const fourT = G(confShot);
  [['starch', COL.bb], ['sugar', COL.brick], ['protein', COL.purple], ['fat', COL.cloudy]].forEach(([n, c], i) => {
    const g = G(fourT), x = 760 + i * 120;
    const tb = testTube(g, 40, 160, { level: 0.55, liquid: c, opacity: 1 }); tr(tb, 0, -30);
    T(g, 0, 90, n, { size: 28, weight: 700, anchor: 'middle', fill: C.ink });
    g.mx = x;
  });
  const fourHead = T(fourT, 940, 175, '4 tests · 4 colours', { size: 40, weight: 800, anchor: 'middle', fill: C.energy });
  // the call grid, all yelling MINE!
  // (the same call windows as in the lab, moved into the confessional and shrunk)
  const gridLayer = G(confShot), gridFx = G(confShot);
  const GRID = [[callAmy, 'amy', 790, 230], [callPriya, 'priya', 1010, 230], [callLionel, 'lionel', 790, 450], [callBill, 'bill', 1010, 450]];
  const grid = GRID.map(([g, k, x, y]) => {
    const b = k === 'bill' ? null : labBurst(gridFx, 'MINE!', { size: 28 });
    return { g, x, y, b, k };
  });
  const billNote = chip(confShot, 'NOT AN ENZYME', { size: 28, fill: '#FFF176', color: '#5A4A00', stroke: '#D9C24A', sw: 3, rx: 4 });

  /* cut points */
  const cConf = at('thkavya') - 0.08;

  return t => {
    const sLab = on(t, -1, cConf), sConf = on(t, cConf, 1e9);
    op(labShot, sLab); conf.set(sConf, t); op(confShot, sConf);

    /* ---------------- the lab ---------------- */
    if (sLab) {
      // camera: gentle drift; push in on the Benedict's wait
      let k = 1 + 0.025 * P(t, S.first, 6, linear), cx = 600, cy = 400;
      const wait0 = end('benedict') - 0.2, wait1 = end('nothing') + 0.3;
      if (t >= at('benedict') - 0.1 && t < at('heat') - 0.1) { const pp = P(t, wait0, wait1 - wait0, ease); k = 1 + 0.16 * pp; cx = lerp(600, 380, pp); cy = lerp(400, 420, pp); }
      if (t >= at('lionel') - 0.1 && t < at('control') - 0.1) { k = 1 + 0.06 * P(t, end('lionel'), 0.5, ease); cx = lerp(600, 1000, P(t, end('lionel'), 0.5, ease)); cy = 300; }
      labCamSet(labCam, k, cx, cy);

      // whiteboard: which writing is up
      const bIdx = t < at('iodine') - 0.1 ? 0 : t < at('backwards') - 0.1 ? 1 : t < at('benedict') - 0.1 ? 2 : t < at('heat') - 0.1 ? 3 : t < at('sweep') - 0.1 ? 4 : t < at('biuret') - 0.1 ? 5 : t < at('fat') - 0.1 ? 6 : t < at('control') - 0.1 ? 7 : 8;
      BOARDS.forEach((b, i) => op(b, i === bIdx ? 1 : 0));
      if (bIdx === 0) {
        const p = P(t, at('lab') + 0.05, 0.5, pop);
        op(bLab.firstChild, clamp(p * 2)); bLab.firstChild.setAttribute('transform', `translate(${BCX} 172) scale(${(0.7 + 0.3 * p).toFixed(3)}) translate(${-BCX} -172)`);
        op(bLab2, P(t, mid('lab', 0.55), 0.4, linear));
      }
      if (bIdx === 1) { const sp = bIod2.spans; [0, 1, 2, 3].forEach(i => attr(sp[i], 'fill-opacity', P(t, mid('iodine', [0.2, 0.3, 0.62, 0.68][i]), 0.3, linear))); }
      if (bIdx === 2) { op(bBackA, P(t, mid('backwards', 0.32), 0.3, linear)); op(bBackB, P(t, mid('backwards', 0.55), 0.3, linear)); }
      if (bIdx === 3) { const sp = bBen2.spans; [0, 1, 2, 3].forEach(i => attr(sp[i], 'fill-opacity', i < 2 ? P(t, mid('benedict', 0.3), 0.3, linear) : P(t, at('nothing') - 0.2, 0.3, linear))); }
      if (bIdx === 5) {
        let cur = -1;
        swatches.forEach((g, i) => { const tt = mid('sweep', SW[i][2]); const p = P(t, tt, 0.35, pop); op(g, clamp(p * 2)); g.setAttribute('transform', `translate(${g.x} 218) scale(${Math.max(0.01, 0.6 + 0.4 * p).toFixed(3)}) translate(${-g.x} -218)`); if (t >= tt) cur = i; });
        op(swPtr, cur >= 0 ? 1 : 0); if (cur >= 0) tr(swPtr, swatches[cur].x, 194);
      }
      if (bIdx === 6) { const sp = bBiu2.spans; [0, 1, 2, 3].forEach(i => attr(sp[i], 'fill-opacity', P(t, mid('biuret', [0.05, 0.12, 0.6, 0.66][i]), 0.3, linear))); }
      if (bIdx === 7) { op(bFat2, P(t, mid('fat', 0.08), 0.3, linear)); op(bFat, t > at('lionel') - 0.1 ? 1 - 0.75 * P(t, at('lionel') - 0.1, 0.3, linear) : 1); }
      if (bIdx === 8) { op(scaleBar, 1); scArrow.set(P(t, mid('control', 0.12), 0.6)); }

      // Kavya
      let mood = 'neutral', look = 0.6;
      if (t >= at('iodine') - 0.1) look = 0.8;
      if (t >= at('mine') - 0.1) { mood = 'deadpan'; look = 1; }
      if (t >= at('backwards') - 0.1) { mood = t < mid('backwards', 0.3) ? 'deadpan' : 'annoyed'; look = 1; }
      if (t >= at('benedict') - 0.1) { mood = 'neutral'; look = 0.75; }
      if (t >= at('nothing') - 0.2) { mood = 'annoyed'; look = 0; }
      if (t >= at('heat') - 0.1) { mood = t < mid('heat', 0.5) ? 'sad' : 'neutral'; look = 1; }
      if (t >= at('sweep') - 0.1) { mood = t < mid('sweep', 0.72) ? 'shock' : 'happy'; look = 1; }
      if (t >= at('biuret') - 0.1) { mood = 'neutral'; look = 0.9; }
      if (t >= at('purple') - 0.1) { mood = 'deadpan'; look = 1; }
      if (t >= at('fat') - 0.1) { mood = 'happy'; look = 1; }
      if (t >= at('move') - 0.1) { mood = 'deadpan'; look = 1; }
      if (t >= at('control') - 0.1) { mood = 'neutral'; look = 0.8; }
      tr(kav, 175, 420, 1.3);
      kav.set({ t, talk: talk(t, 'kavya'), mood, look });

      // the tubes
      const t1 = rack.tubes[0], t2 = rack.tubes[1], t3 = rack.tubes[2], t4 = rack.tubes[3];
      // 1 iodine: food -> orange-brown -> blue-black
      t1.set(0.35 + 0.08 * P(t, mid('iodine', 0.25), 0.8, linear), labStops(t, [[mid('iodine', 0.24), COL.food1], [mid('iodine', 0.42), COL.ob], [mid('iodine', 0.64), COL.ob], [mid('iodine', 0.82), COL.bb]]));
      // 2 Benedict's: food -> blue ... heated -> green, yellow, orange, brick-red
      t2.set(0.35 + 0.08 * P(t, mid('benedict', 0.3), 0.8, linear), labStops(t, [[mid('benedict', 0.28), COL.food2], [mid('benedict', 0.5), COL.blue], ...SW.map(([, c, f]) => [mid('sweep', f) + 0.15, c])]));
      // 3 biuret: food -> blue -> purple
      t3.set(0.35 + 0.08 * P(t, mid('biuret', 0.15), 0.8, linear), labStops(t, [[mid('biuret', 0.14), COL.food3], [mid('biuret', 0.34), COL.biuret], [mid('biuret', 0.62), COL.biuret], [mid('biuret', 0.85), COL.purple]]));
      // 4 fat: food + ethanol, shaken, poured into water
      const pourIn = P(t, mid('fat', 0.36), 0.4, ease), pourBack = P(t, at('move') + 0.1, 0.5, ease);
      t4.set(0.35 - 0.2 * P(t, mid('fat', 0.5), 0.5, linear), labMix(COL.food4, '#F7F3E4', P(t, mid('fat', 0.08), 0.5, linear)));

      // tube 2 to the water bath and back
      const toBath = P(t, mid('heat', 0.3), 0.6, ease), fromBath = P(t, at('biuret') - 0.05, 0.5, ease);
      const bathP = toBath * (1 - fromBath);
      const [h2x, h2y] = home(1), bx = (bathX - RX) / RS, by = (385 - RY) / RS;
      const lift = Math.sin(Math.PI * bathP) * 30;
      tr(t2, lerp(h2x, bx, bathP), lerp(h2y, by, bathP) - lift);
      // tube 4: shake, pour, back
      const [h4x, h4y] = home(3), shake = on(t, mid('fat', 0.06), mid('fat', 0.32)) * Math.sin(t * 30) * 14 * AMP;
      const pour = pourIn * (1 - pourBack);
      const px = (880 - RX) / RS, py = (350 - RY) / RS;
      tr(t4, lerp(h4x, px, pour), lerp(h4y, py, pour) - 18 * on(t, mid('fat', 0.06), mid('fat', 0.32)), 1, shake + 105 * pour);
      // the bath, the beaker of water, the control
      const bathOn = P(t, mid('heat', 0.15), 0.35, pop) * (1 - P(t, at('biuret') + 0.3, 0.3, linear));
      op(bath, clamp(bathOn * 2)); tr(bath, 0, 0);
      op(hotLine, 0.6 + 0.4 * wave(t, 0.8)); steam.upd(t); op(steam, P(t, mid('heat', 0.6), 0.5, linear));
      const potOn = P(t, mid('fat', 0.28), 0.35, pop) * (1 - P(t, at('control') - 0.1, 0.3, linear));
      op(pot, clamp(potOn * 2)); tr(pot, potX, 465 + 20 * (1 - clamp(potOn)));
      const cloudy = P(t, mid('fat', 0.62), 0.6, linear);
      pot.set(0.55 + 0.12 * P(t, mid('fat', 0.5), 0.5, linear), labMix('#9FD8F5', COL.cloudy, cloudy)); attr(pot.liquid, 'opacity', lerp(0.6, 0.95, cloudy));
      op(cloudDots, clamp(potOn * 2) * cloudy * (0.6 + 0.4 * wave(t, 1.4)));
      const pouring = on(t, mid('fat', 0.5), mid('fat', 0.72));
      attr(stream, 'd', pouring ? `M992,${382} Q1008,${410} 1014,${448}` : ''); op(stream, pouring);
      const ctlOn = P(t, mid('control', 0.5), 0.4, pop);
      op(ctl, clamp(ctlOn * 2.5)); tr(ctl, 1020, 445, Math.max(0.01, RS * (0.7 + 0.3 * ctlOn)));

      // highlight the tube being tested + the dropper
      let hi = -1;
      if (t >= at('iodine') - 0.1 && t < at('benedict') - 0.1) hi = 0;
      else if (t >= at('benedict') - 0.1 && t < mid('heat', 0.3)) hi = 1;
      else if (t >= at('biuret') - 0.1 && t < at('fat') - 0.1) hi = 2;
      else if (t >= at('fat') - 0.1 && t < mid('fat', 0.32)) hi = 3;
      op(hiGlow, hi >= 0 ? 0.75 : 0); if (hi >= 0) tr(hiGlow, TX(hi), TY + 20);
      op(dropper, 0);
      const liqY = i => RY + 63 * RS - 0.42 * 160 * RS;
      if (t >= at('iodine') - 0.1 && t < at('mine')) dropper.set(t, mid('iodine', 0.08), COL.ob, TX(0), TTOP + 30, liqY(0));
      else if (t >= at('benedict') - 0.1 && t < at('nothing')) dropper.set(t, mid('benedict', 0.1), COL.blue, TX(1), TTOP + 30, liqY(1));
      else if (t >= at('biuret') - 0.1 && t < at('purple')) dropper.set(t, mid('biuret', 0.0), COL.biuret, TX(2), TTOP + 30, liqY(2));

      // bench-front chips
      BENCH.forEach(c => op(c, 0)); stamp.set(0, 0, 0);
      if (t >= at('iodine') && t < at('backwards') - 0.1) labPop(cStarch, t, mid('iodine', 0.84), TX(0), 625);
      if (t >= at('backwards') - 0.1 && t < at('benedict') - 0.1) stamp.set(P(t, mid('backwards', 0.74), 0.3, easeOut), 640, 628, -4);
      if (t >= at('nothing') - 0.1 && t < at('heat') - 0.1) labPop(cStill, t, mid('nothing', 0.4), TX(1), 625);
      if (t >= at('heat') - 0.1 && t < at('sweep') - 0.1) labPop(cHeat, t, mid('heat', 0.62), 820, 625);
      if (t >= at('sweep') - 0.1 && t < at('biuret') - 0.1) labPop(cBrick, t, mid('sweep', 0.82), 820, 625);
      if (t >= at('biuret') && t < at('fat') - 0.1) labPop(cProt, t, mid('biuret', 0.88), TX(2), 625);
      if (t >= at('fat') && t < at('control') - 0.1) labPop(cFat, t, mid('fat', 0.8), 840, 625);
      if (t >= at('control')) { labPop(cCtl, t, mid('control', 0.56), 960, 612); labPop(cNeg, t, mid('control', 0.72), 960, 668); }

      // video calls
      CALLS.forEach(c => { if (c.parentNode !== labCam) labCam.insertBefore(c, burstMine); op(c, 0); }); [burstMine, burstMine2, burstMove, noteLionel].forEach(b => op(b, 0));
      const showCall = (c, t0, t1, who, mood, extra, x) => {
        if (t < t0 || t >= t1) return 0;
        const p = P(t, t0, 0.3, pop);
        op(c, clamp(p * 3)); tr(c, x || CALLX, CALLY, Math.max(0.01, 0.7 + 0.3 * p));
        c.c.set(Object.assign({ t, talk: talk(t, who), mood, look: -0.6 }, extra || {}));
        return 1;
      };
      if (showCall(callAmy, at('mine') - 0.15, at('backwards') - 0.1, 'amy', 'happy', { sparkle: 1 })) {
        tr(callAmy.c, 0, 18 - Math.abs(Math.sin(t * 9)) * 16 * AMP, 0.62);
        const bp = P(t, mid('mine', 0.6), 0.3, pop); op(burstMine, clamp(bp * 3)); tr(burstMine, CALLX, 375, Math.max(0.01, 0.6 + 0.4 * bp), -6 + 4 * Math.sin(t * 20) * AMP);
      }
      showCall(callPercy, at('backwards') - 0.1, at('benedict') - 0.1, 'percy', 'deadpan');
      showCall(callPercy, at('heat') - 0.1, at('sweep') - 0.1, 'percy', 'deadpan');
      if (showCall(callPriya, at('purple') - 0.15, at('fat') - 0.1, 'priya', 'smug')) {
        const bp = P(t, mid('purple', 0.75), 0.3, pop); op(burstMine2, clamp(bp * 3)); tr(burstMine2, CALLX, 372, Math.max(0.01, 0.6 + 0.4 * bp), 4);
      }
      const lionelIn = at('lionel') - 0.1;
      if (t >= at('move') - 0.15 && t < at('control') - 0.1) {
        const slide = P(t, lionelIn, 0.35, ease);
        showCall(callBill, at('move') - 0.15, at('control') - 0.1, 'bill', t < lionelIn ? 'happy' : 'deadpan', { bubbles: t < lionelIn + 0.3 ? 1 : 0, look: t < lionelIn ? -0.6 : 1 }, lerp(CALLX, 790, slide));
        const bp = P(t, mid('move', 0.45), 0.3, pop); op(burstMove, clamp(bp * 3) * (1 - slide)); tr(burstMove, CALLX, 372, Math.max(0.01, 0.6 + 0.4 * bp), -4);
        showCall(callLionel, lionelIn, at('control') - 0.1, 'lionel', t < mid('lionel', 0.3) ? 'annoyed' : 'deadpan', { look: t < end('lionel') ? -1 : 0 });
        const np = P(t, mid('lionel', 0.6), 0.3, pop); op(noteLionel, t >= lionelIn ? clamp(np * 3) : 0); tr(noteLionel, CALLX, 360, Math.max(0.01, 0.6 + 0.4 * np));
      }
    }

    /* ---------------- confessional ---------------- */
    if (sConf) {
      const push = P(t, mid('thkavya', 0.78), end('thkavya') + 1.2 - mid('thkavya', 0.78), linear);
      labCamSet(confCam, 1 + 0.1 * ease(push), 400, 360);
      tr(kavC, 400, 420, 1.5);
      const f = (t - at('thkavya')) / (end('thkavya') - at('thkavya'));
      const mood = f < 0.33 ? 'neutral' : f < 0.72 ? 'annoyed' : 'deadpan';
      kavC.set({ t, talk: talk(t, 'kavya'), mood, look: f > 0.4 && f < 0.72 ? 0.7 : 0 });
      // four tubes, then the calls
      const fOut = P(t, mid('thkavya', 0.36), 0.25, linear);
      op(fourT, 1 - fOut);
      op(fourHead, P(t, at('thkavya') + 0.1, 0.3, linear));
      Array.from(fourT.children).forEach((g, i) => { if (g.mx) labPop(g, t, mid('thkavya', 0.04 + i * 0.06), g.mx, 330); });
      grid.forEach((c, i) => {
        const p = P(t, mid('thkavya', 0.38 + i * 0.07), 0.35, pop);
        if (c.g.parentNode !== gridLayer) gridLayer.appendChild(c.g);
        op(c.g, clamp(p * 3)); tr(c.g, c.x, c.y, Math.max(0.01, 0.72 * (0.6 + 0.4 * p)));
        const st = { t, mood: c.k === 'bill' ? 'deadpan' : c.k === 'lionel' ? 'annoyed' : c.k === 'priya' ? 'smug' : 'happy', look: -0.8, sparkle: 1 };
        c.g.c.set(st);
        if (c.b) { const shout = 0.5 + 0.5 * Math.sin(t * 14 + i * 1.7); op(c.b, clamp(p * 3)); tr(c.b, c.x, c.y + 34, 0.9 + 0.12 * shout * AMP, (i % 2 ? 4 : -4)); }
      });
      const bn = P(t, mid('thkavya', 0.86), 0.35, pop); op(billNote, clamp(bn * 3)); tr(billNote, 1010, 560, Math.max(0.01, 0.6 + 0.4 * bn), -3);
    }
  };
});
