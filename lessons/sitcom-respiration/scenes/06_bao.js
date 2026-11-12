/* Scene 6: Cousin Bao from the bakery.
   Shots: A bakery wide (Bao kneading) -> B Bao confessional (yeast, a fungus) -> C chalkboard: fermentation
   -> D board close-up: glucose -> ethanol + carbon dioxide (+ a little energy) -> E Carl pops in
   -> F dough cross-section, CO2 bubbles, dough rises -> G Carl close-up, moved, tear turns to gas
   -> H oven: ethanol evaporates, bottle + "Kavya is 12" sticky note -> I Mitch confessional (cousin, technically)
   -> J limewater: clear -> milky, Carl bows. */
scene('bao', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;
  const CHALK = '#F4F1E6';

  /* ---------- helpers (prefixed bao) ---------- */
  function baoMix(a, b, p) {
    const pa = [1, 3, 5].map(i => parseInt(a.slice(i, i + 2), 16)), pb = [1, 3, 5].map(i => parseInt(b.slice(i, i + 2), 16));
    return '#' + pa.map((v, i) => Math.round(lerp(v, pb[i], clamp(p))).toString(16).padStart(2, '0')).join('');
  }
  // ethanol, drawn in the palette's violet: two C, one O, a few H
  function baoEth(p, r) {
    const g = G(p);
    E('circle', { cx: -r * 2.0, cy: -r * 0.7, r: r * 0.5, fill: '#F4F7FA', stroke: '#A9B5C0', 'stroke-width': 1.5 }, g);
    E('circle', { cx: r * 2.9, cy: -r * 1.1, r: r * 0.5, fill: '#F4F7FA', stroke: '#A9B5C0', 'stroke-width': 1.5 }, g);
    E('circle', { cx: -r * 0.9, r, fill: ball(C.ethanol, C.ethanolDk), stroke: C.ethanolDk, 'stroke-width': 2 }, g);
    E('circle', { cx: r * 0.9, r, fill: ball(C.ethanol, C.ethanolDk), stroke: C.ethanolDk, 'stroke-width': 2 }, g);
    E('circle', { cx: r * 2.1, cy: -r * 0.5, r: r * 0.85, fill: ball('#8E66E0', '#4E2F9A'), stroke: '#4E2F9A', 'stroke-width': 2 }, g);
    return g;
  }
  function baoLoaf(p, x, y, s) {
    const g = G(p); tr(g, x, y, s);
    E('ellipse', { rx: 44, ry: 25, fill: ball('#E3A55C', '#9A5A22'), stroke: '#7A4216', 'stroke-width': 3 }, g);
    E('path', { d: 'M-22,-14 L-12,4 M-2,-18 L8,2 M18,-14 L28,2', stroke: '#F7D9A6', 'stroke-width': 4, 'stroke-linecap': 'round' }, g);
    return g;
  }
  // camera on the world layer: (cx, cy) comes to the stage centre, zoom k
  function baoCam(cx, cy, k) { cx = clamp(cx, 600 / k, 1200 - 600 / k); cy = clamp(cy, 375 / k, 750 - 375 / k); attr(world, 'transform', `translate(600 375) scale(${k.toFixed(4)}) translate(${(-cx).toFixed(1)} ${(-cy).toFixed(1)})`); }

  /* ---------- layers ---------- */
  const world = G(root), bgL = G(world), propL = G(world), charL = G(world), frontL = G(world), fx = G(root);

  /* ---------- sets ---------- */
  const bakery = G(bgL);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#7A4A2A', '#3E2414', true) }, bakery);
  for (let i = 0; i < 7; i++) E('rect', { x: i * 180 + 40, y: 0, width: 70, height: 620, fill: '#FFFFFF', opacity: 0.035 }, bakery);
  { const r = rng(606);
    [235, 375].forEach((y, row) => {
      E('rect', { x: 20, y, width: 1160, height: 16, rx: 4, fill: '#8C5A32', stroke: '#5A3518', 'stroke-width': 3 }, bakery);
      for (let i = 0; i < 9; i++) {
        const x = 80 + i * 128 + r() * 18, k = (i + row) % 3;
        if (k === 0) baoLoaf(bakery, x, y - 22, 0.9);
        else if (k === 1) { [-18, 18].forEach(dx => E('circle', { cx: x + dx, cy: y - 18, r: 18, fill: ball('#EDB86E', '#A8642A'), stroke: '#7A4216', 'stroke-width': 2.5 }, bakery)); }
        else { E('ellipse', { cx: x, cy: y - 13, rx: 56, ry: 13, fill: ball('#E8B068', '#A0602A'), stroke: '#7A4216', 'stroke-width': 2.5 }, bakery); E('path', { d: `M${x - 30},${y - 18} l10,8 M${x - 6},${y - 18} l10,8 M${x + 18},${y - 18} l10,8`, stroke: '#F7D9A6', 'stroke-width': 3, 'stroke-linecap': 'round' }, bakery); }
      }
    });
  }
  E('rect', { x: 0, y: 620, width: 1200, height: 130, fill: '#2E1A0E', opacity: 0.75 }, bakery);
  E('ellipse', { cx: 600, cy: 360, rx: 560, ry: 300, fill: glow('#FFC27A'), opacity: 0.28 }, bakery);
  const motes = [], mr = rng(61);
  for (let i = 0; i < 10; i++) motes.push({ el: E('circle', { r: 2.5 + mr() * 2, fill: '#FFF3DC', opacity: 0.5 }, bakery), x: mr() * 1200, y: 120 + mr() * 480, ph: mr() * TAU });
  const dim = E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#1E0F06', opacity: 0.55 }, bgL);
  const warm = E('circle', { cx: 600, cy: 400, r: 330, fill: glow('#FFB27A') }, bgL);

  const confBao = scConfessional(bgL, 'bao');
  const confMitch = scConfessional(bgL, 'mitch');
  const lab = G(bgL);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad(C.bg1, C.bg0, true) }, lab);
  for (let i = 1; i < 6; i++) E('line', { x1: i * 200, y1: 0, x2: i * 200, y2: 600, stroke: '#FFFFFF', 'stroke-width': 2, opacity: 0.04 }, lab);
  E('rect', { x: 0, y: 600, width: 1200, height: 150, fill: '#24414F' }, lab);
  E('rect', { x: 0, y: 600, width: 1200, height: 10, fill: '#3B6578' }, lab);

  /* ---------- characters (one of each, moved between shots) ---------- */
  const bao = scChar(charL, 'bao', { s: 1 });
  const carl = scChar(charL, 'carl', { s: 1 });
  const mitch = scChar(charL, 'mitch', { s: 1 });
  const place = (c, p, dy) => { op(c, p ? 1 : 0); if (p) tr(c, p[0], p[1] + (dy || 0), p[2]); };

  /* ===== A: the bakery, Bao kneading ===== */
  const shA = { front: G(frontL), fx: G(fx) };
  { const s = G(shA.front);
    E('path', { d: 'M780,0 L780,96 M1000,0 L1000,96', stroke: '#3A2414', 'stroke-width': 5 }, s);
    E('rect', { x: 720, y: 92, width: 340, height: 104, rx: 16, fill: '#5A2E1A', stroke: '#E3A55C', 'stroke-width': 5 }, s);
    T(s, 890, 155, 'BAKERY', { size: 54, weight: 800, anchor: 'middle', fill: '#FFE29A', ls: 4 });
    T(s, 890, 186, 'fresh bread daily', { size: 26, weight: 600, anchor: 'middle', fill: '#F7D9A6', font: FB });
  }
  const aDough = E('ellipse', { cx: 600, cy: 536, rx: 92, ry: 28, fill: ball('#F7E3BC', '#C9A46A'), stroke: '#B8894E', 'stroke-width': 3 }, shA.front);
  { const c = G(shA.front);
    E('rect', { x: 180, y: 548, width: 840, height: 210, fill: '#7A4A28', stroke: '#4A2A12', 'stroke-width': 4 }, c);
    E('rect', { x: 170, y: 540, width: 860, height: 24, rx: 6, fill: '#C08A55', stroke: '#4A2A12', 'stroke-width': 4 }, c);
    for (let i = 0; i < 4; i++) E('rect', { x: 210 + i * 205, y: 590, width: 170, height: 130, rx: 10, fill: 'none', stroke: '#5A3518', 'stroke-width': 4 }, c);
    shA.front.insertBefore(c, aDough);
  }
  const aStrap = G(shA.fx);
  { const w = textWidth('Meanwhile: the bakery across the road', 28, FB, 700) + 48;
    E('rect', { x: 1160 - w, y: 650, width: w, height: 52, rx: 26, fill: '#0E1A24', opacity: 0.85 }, aStrap);
    T(aStrap, 1160 - w / 2, 685, 'Meanwhile: the bakery across the road', { size: 28, weight: 700, anchor: 'middle', font: FB, fill: '#FFE29A' }); }

  /* ===== B: Bao's confessional ===== */
  const shB = { fx: G(fx) };
  const bLower = scLowerThird(shB.fx, 'BAO', 'Yeast. A fungus. Bakery.');
  const bYeast = chip(shB.fx, 'yeast', { size: 46, fill: '#F7EACB', color: '#4A3410', weight: 800 }); tr(bYeast, 880, 220);
  const bFungus = T(shB.fx, 880, 305, 'a single-celled **fungus**', { size: 34, weight: 500, anchor: 'middle', boldFill: '#FFE29A' });
  const bMush = G(shB.fx);
  { const m = G(bMush); tr(m, 880, 440);
    E('rect', { x: -20, y: -6, width: 40, height: 64, rx: 12, fill: '#F3E6CF', stroke: SC_INK, 'stroke-width': 3 }, m);
    E('path', { d: 'M-72,0 Q-72,-70 0,-72 Q72,-70 72,0 Z', fill: ball('#E0543C', '#9A2A1A'), stroke: SC_INK, 'stroke-width': 3 }, m);
    [[-36, -26, 10], [8, -48, 9], [40, -18, 8]].forEach(([x, y, r]) => E('circle', { cx: x, cy: y, r, fill: '#FFF4E6' }, m));
    T(bMush, 880, 548, 'fungi, like mushrooms', { size: 28, weight: 600, anchor: 'middle', fill: C.muted }); }

  /* ===== C: chalkboard, fermentation ===== */
  const shC = { prop: G(propL) };
  { const b = shC.prop;
    E('rect', { x: 550, y: 125, width: 610, height: 460, rx: 14, fill: '#8C5A32', stroke: '#4A2A12', 'stroke-width': 4 }, b);
    E('rect', { x: 568, y: 143, width: 574, height: 424, rx: 8, fill: '#24352D' }, b);
    E('rect', { x: 600, y: 565, width: 120, height: 10, rx: 4, fill: '#F4F1E6', opacity: 0.7 }, b); }
  const cNoOx = G(shC.prop);
  { const o = molO2(cNoOx, 18); tr(o, 650, 210); const x = cross(cNoOx, 22); tr(x, 650, 210);
    T(cNoOx, 700, 222, 'no oxygen left', { size: 36, weight: 600, fill: CHALK }); }
  const cLac = G(shC.prop);
  const cLacChip = chip(cLac, 'lactic acid', { size: 30, fill: C.lactic, color: '#3A0A20' }); tr(cLacChip, 720, 300);
  const cLacStrike = strike(cLac, 720 - cLacChip.w / 2 - 8, 300, 720 + cLacChip.w / 2 + 8, '#FFFFFF');
  T(cLac, 880, 311, "(that's Larry)", { size: 30, weight: 600, fill: C.muted });
  const cFerm = T(shC.prop, 855, 430, 'FERMENTATION', { size: 58, weight: 800, anchor: 'middle', fill: '#FFE29A', ls: 1 });
  const cFermSub = T(shC.prop, 855, 488, '(yeast, no oxygen)', { size: 32, weight: 600, anchor: 'middle', fill: CHALK });

  /* ===== D: the equation on the board ===== */
  const shD = { prop: G(propL) };
  E('rect', { x: 40, y: 115, width: 1120, height: 510, rx: 16, fill: '#8C5A32', stroke: '#4A2A12', 'stroke-width': 4 }, shD.prop);
  E('rect', { x: 60, y: 135, width: 1080, height: 470, rx: 10, fill: '#24352D' }, shD.prop);
  T(shD.prop, 600, 195, 'Fermentation in yeast', { size: 36, weight: 700, anchor: 'middle', fill: C.muted });
  const EQY = 360;
  const dSpec = [
    { text: 'glucose', fill: C.glucose, color: '#3A2600', icon: g => molGlucose(g, 34) },
    { op: 'arrow' },
    { text: 'ethanol', fill: C.ethanol, color: '#22104A', icon: g => baoEth(g, 15) },
    { op: '+' },
    { text: 'carbon dioxide', fill: C.co2, color: '#10202B', icon: g => molCO2(g, 17) },
  ];
  const dParts = dSpec.map(sp => {
    const p = Object.assign({}, sp); p.g = G(shD.prop);
    if (sp.op === 'arrow') { arrow(p.g, -34, 0, 34, 0, { color: CHALK, width: 7 }); p.w = 76; }
    else if (sp.op) { T(p.g, 0, 16, '+', { size: 50, weight: 600, anchor: 'middle', fill: CHALK }); p.w = 40; }
    else { const c = chip(p.g, sp.text, { size: 38, fill: sp.fill, color: sp.color, weight: 800 }); p.w = c.w; p.icon = G(shD.prop); sp.icon(p.icon); }
    return p;
  });
  { const GAP = 18; let tot = 0; dParts.forEach((p, i) => { tot += p.w + (i ? GAP : 0); }); let x = 600 - tot / 2; dParts.forEach((p, i) => { if (i) x += GAP; p.x = x + p.w / 2; x += p.w; }); }
  dParts.forEach(p => { tr(p.g, p.x, EQY); if (p.icon) tr(p.icon, p.x, EQY - 100); });
  const dEn = G(shD.prop);
  const dSpark = spark(dEn, 14, { seed: 4 }); tr(dSpark, 410, 470);
  T(dEn, 440, 482, '+ a **little** energy', { size: 36, weight: 600, fill: C.energy, boldFill: '#FFFFFF' });

  /* ===== E: Carl pops in ===== */
  const shE = { front: G(frontL), fx: G(fx) };
  const ePuff = []; { const r = rng(9); for (let i = 0; i < 9; i++) { const a = i / 9 * TAU; ePuff.push({ el: E('circle', { r: 30 + r() * 20, fill: '#C9D3DC', opacity: 0.8 }, shE.front), a, d: 120 + r() * 50 }); } }
  const eChip = chip(shE.fx, 'carbon dioxide', { size: 34, fill: C.co2, color: '#10202B', weight: 800 }); tr(eChip, 860, 215);
  const eQ = T(shE.fx, 860 + eChip.w / 2 + 34, 232, '?', { size: 60, weight: 800, anchor: 'middle', fill: C.energy });
  const eArrow = arrow(shE.fx, 860, 250, 860, 300, { color: C.co2, width: 5 });

  /* ===== F: dough rising ===== */
  const shF = { prop: G(propL), front: G(frontL), fx: G(fx) };
  E('rect', { x: 0, y: 600, width: 1200, height: 150, fill: '#8C5A32' }, shF.prop);
  E('rect', { x: 0, y: 592, width: 1200, height: 16, fill: '#C08A55' }, shF.prop);
  const BX = 600, RIM = 470, BW = 236, BOT = 640;
  E('path', { d: `M${BX - BW},${RIM} Q${BX - BW},${BOT + 8} ${BX},${BOT + 8} Q${BX + BW},${BOT + 8} ${BX + BW},${RIM} Z`, fill: '#3A2A1E' }, shF.prop);
  const fDough = E('path', { d: '', fill: ball('#F7E3BC', '#D2A867'), stroke: '#B8894E', 'stroke-width': 4 }, shF.prop);
  const fBub = [], fr = rng(33);
  for (let i = 0; i < 14; i++) fBub.push({ el: E('circle', { r: 1, fill: '#D8AE72', stroke: '#A8763A', 'stroke-width': 2 }, shF.prop), u: (fr() * 2 - 1) * 0.78, v: 0.1 + fr() * 0.62, r: 7 + fr() * 9, d: fr() * 0.5 });
  E('path', { d: `M${BX - BW - 8},${RIM - 6} Q${BX - BW - 8},${BOT + 16} ${BX},${BOT + 16} Q${BX + BW + 8},${BOT + 16} ${BX + BW + 8},${RIM - 6}`, fill: 'none', stroke: '#DDE6EE', 'stroke-width': 16, 'stroke-linecap': 'round' }, shF.prop);
  const fCO2 = []; for (let i = 0; i < 3; i++) fCO2.push(molCO2(shF.prop, 5));
  const fLbl = labelLine(shF.front, 430, 300, 0, 0, 'carbon dioxide bubbles', { size: 30, anchor: 'end', fill: C.co2 });
  const fLine = fLbl.querySelector('line'), fDot = fLbl.querySelector('circle');
  const fRise = G(shF.fx);
  T(fRise, 600, 170, 'the dough **rises**', { size: 50, weight: 600, anchor: 'middle', boldFill: '#FFE29A' });
  const fUp = arrow(fRise, 860, 175, 860, 105, { color: '#FFE29A', width: 7 });
  const fSoft = chip(shF.fx, 'soft and fluffy', { size: 32, fill: '#F7EACB', color: '#4A3410' }); tr(fSoft, 600, 700);

  /* ===== G: Carl, moved ===== */
  const shG = { front: G(frontL), fx: G(fx) };
  const gTear = E('path', { d: 'M0,-14 Q11,2 0,10 Q-11,2 0,-14 Z', fill: '#BFEAFF', stroke: '#5AB4E0', 'stroke-width': 2.5 }, shG.front);
  const gPuffs = []; for (let i = 0; i < 4; i++) gPuffs.push(E('circle', { r: 9 + i * 2, fill: '#DDE6EE', opacity: 0.8 }, shG.front));
  const gSparks = []; for (let i = 0; i < 6; i++) gSparks.push({ sp: spark(shG.front, 12, { seed: i + 2 }), a: i / 6 * TAU + 0.4 });
  const gGas = chip(shG.fx, 'carbon dioxide is a gas', { size: 32, fill: C.co2, color: '#10202B' }); tr(gGas, 600, 690);

  /* ===== H: the oven, ethanol evaporates ===== */
  const shH = { prop: G(propL), front: G(frontL), fx: G(fx) };
  { const o = shH.prop;
    E('rect', { x: 80, y: 250, width: 400, height: 400, rx: 18, fill: linGrad('#6B7680', '#3B444D', true), stroke: '#A3AFBA', 'stroke-width': 4 }, o);
    E('rect', { x: 80, y: 250, width: 400, height: 70, rx: 18, fill: '#4A545E', stroke: '#A3AFBA', 'stroke-width': 4 }, o);
    [180, 280, 380].forEach(x => { E('circle', { cx: x, cy: 285, r: 18, fill: '#2A3036', stroke: '#C9D3DC', 'stroke-width': 3 }, o); E('line', { x1: x, y1: 285, x2: x + 8, y2: 272, stroke: '#C9D3DC', 'stroke-width': 3 }, o); });
    E('rect', { x: 120, y: 350, width: 320, height: 240, rx: 14, fill: '#2A1208', stroke: '#C9D3DC', 'stroke-width': 4 }, o);
  }
  const hGlow = E('ellipse', { cx: 280, cy: 480, rx: 170, ry: 120, fill: glow('#FF8A3D') }, shH.prop);
  const hLoaf = baoLoaf(shH.prop, 280, 520, 1.6);
  const hLoafBody = hLoaf.firstChild;
  E('rect', { x: 120, y: 350, width: 320, height: 240, rx: 14, fill: '#FFFFFF', opacity: 0.06 }, shH.prop);
  E('rect', { x: 150, y: 600, width: 260, height: 14, rx: 7, fill: '#C9D3DC' }, shH.prop);
  const hHeat = heatWaves(shH.prop, { n: 3, h: 70, spacing: 40, color: '#FF8A3D' }); tr(hHeat, 280, 240);
  const hEth = []; for (let i = 0; i < 6; i++) hEth.push({ g: baoEth(shH.front, 11), ph: i / 6 });
  card(shH.fx, 690, 118, 420, 150, { fill: '#1E0F06', stroke: '#6C4B8A', opacity: 0.82 });
  const hChip = chip(shH.fx, 'ethanol', { size: 44, fill: C.ethanol, color: '#22104A', weight: 800 }); tr(hChip, 900, 175);
  const hSub = T(shH.fx, 900, 238, '**evaporates** when baked', { size: 32, weight: 500, anchor: 'middle', boldFill: '#D9C6FF' });
  const hBottle = G(shH.prop);
  E('path', { d: 'M-18,-130 L18,-130 L18,-70 Q56,-50 56,0 L56,110 Q56,124 42,124 L-42,124 Q-56,124 -56,110 L-56,0 Q-56,-50 -18,-70 Z', fill: '#2B1B3A', stroke: '#6C4B8A', 'stroke-width': 4, 'stroke-linejoin': 'round' }, hBottle);
  E('rect', { x: -22, y: -140, width: 44, height: 16, rx: 4, fill: '#4A3560' }, hBottle);
  const hNote = G(shH.front), hNoteIn = G(hNote);
  E('rect', { x: -86, y: -66, width: 172, height: 132, rx: 4, fill: '#FFE45C', stroke: '#C9A800', 'stroke-width': 2 }, hNoteIn);
  E('rect', { x: -86, y: -66, width: 172, height: 22, fill: '#F5D531' }, hNoteIn);
  T(hNoteIn, 0, 4, 'Kavya', { size: 34, weight: 800, anchor: 'middle', fill: '#3A2A10' });
  T(hNoteIn, 0, 46, 'is 12', { size: 34, weight: 800, anchor: 'middle', fill: '#C2453A' });

  /* ===== I: Mitch's confessional ===== */
  const shI = { fx: G(fx) };
  const iCousin = T(shI.fx, 900, 200, 'cousin*', { size: 54, weight: 800, anchor: 'middle', fill: '#FFE29A' });
  const iTech = T(shI.fx, 900, 244, '*very technically', { size: 28, weight: 600, anchor: 'middle', fill: C.muted, font: FB });
  const iBoth = chip(shI.fx, 'both RESPIRE', { size: 38, fill: C.energy, color: '#3A3000', weight: 800 }); tr(iBoth, 900, 330);
  const iCards = [0, 1].map(k => {
    const g = G(shI.fx), x = k ? 1035 : 775;
    card(g, x - 112, 400, 224, 190, { fill: C.card, stroke: C.line });
    const art = G(g); tr(art, x, 470);
    if (!k) baoLoaf(art, 0, 0, 1.3);
    else {
      E('ellipse', { cx: -6, cy: -20, rx: 48, ry: 40, fill: glow('#FF4040') }, art);
      E('path', { d: 'M-14,-58 L10,-12 L-8,30', fill: 'none', stroke: '#B9784E', 'stroke-width': 24, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, art);
      E('ellipse', { cx: 6, cy: 38, rx: 24, ry: 11, fill: '#F2F7FA', stroke: SC_INK, 'stroke-width': 2.5 }, art);
      E('path', { d: 'M30,-46 l14,-8 M34,-28 l16,0 M30,-10 l14,8', stroke: '#FF6070', 'stroke-width': 4, 'stroke-linecap': 'round' }, art);
    }
    T(g, x, 568, k ? 'Mitch: sore legs' : 'Bao: bread', { size: 28, weight: 700, anchor: 'middle', fill: k ? '#FF9A8F' : '#F7D9A6' });
    return g;
  });

  /* ===== J: limewater ===== */
  const shJ = { prop: G(propL), front: G(frontL), fx: G(fx) };
  const TX = 470;
  { const st = shJ.prop;
    E('rect', { x: TX - 90, y: 560, width: 180, height: 40, rx: 6, fill: '#6B4A33', stroke: '#3E2A1C', 'stroke-width': 3 }, st);
    E('rect', { x: TX - 90, y: 420, width: 14, height: 140, fill: '#6B4A33' }, st); E('rect', { x: TX + 76, y: 420, width: 14, height: 140, fill: '#6B4A33' }, st);
    E('rect', { x: TX - 96, y: 410, width: 192, height: 16, rx: 4, fill: '#8C6A4A' }, st); }
  const jTube = testTube(shJ.prop, 100, 330, { level: 0.74, liquid: '#BFE6F7' }); tr(jTube, TX, 425);
  const jBub = G(shJ.prop); const jB = bubbles(jBub, TX - 26, 330, 52, 230, { n: 11, r: 9, speed: 0.9, seed: 5, color: '#FFFFFF', fill: 'rgba(255,255,255,0.35)' });
  const jStraw = G(shJ.front);
  const SD = `M866,452 C780,452 720,205 640,205 L500,205 Q${TX},205 ${TX},235 L${TX},548`;
  const jStrawO = E('path', { d: SD, fill: 'none', stroke: '#E9F4FA', 'stroke-width': 14, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', pathLength: 1, 'stroke-dasharray': '1 1' }, jStraw);
  const jStrawI = E('path', { d: SD, fill: 'none', stroke: '#7FB6D9', 'stroke-width': 5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', pathLength: 1, 'stroke-dasharray': '1 1' }, jStraw);
  const jLbl = labelLine(shJ.front, 330, 470, 424, 470, 'limewater', { size: 32, anchor: 'end', fill: '#BFE6F7' });
  const jHead = G(shJ.fx);
  const jClear = T(jHead, 690, 160, 'clear', { size: 48, weight: 700, anchor: 'middle', fill: '#9FD8FF' });
  const jArr = arrow(jHead, 760, 145, 840, 145, { color: C.ink, width: 6 });
  const jMilky = T(jHead, 930, 160, 'milky', { size: 48, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  const jSub = T(shJ.fx, 810, 216, 'carbon dioxide turns limewater milky', { size: 28, weight: 600, anchor: 'middle', fill: C.muted, font: FB });
  const jConf = [], jr = rng(71);
  for (let i = 0; i < 14; i++) jConf.push({ el: E('rect', { x: -6, y: -3, width: 12, height: 6, rx: 2, fill: [C.energy, C.lactic, C.water, C.good][i % 4] }, shJ.front), x: 300 + jr() * 820, d: jr() * 0.8, sp: 160 + jr() * 120, rot: jr() * 360 });

  /* ---------- shots ---------- */
  const SHOTS = [
    ['A', -9], ['B', at('hi') - 0.05], ['C', at('noox') - 0.05], ['D', at('eq') - 0.05], ['E', at('me') - 0.05],
    ['F', at('you') - 0.05], ['G', at('wants') - 0.05], ['H', at('ethanol') - 0.05], ['I', at('th_cousin') - 0.05], ['J', at('limewater') - 0.05],
  ];
  const shotAt = t => { let s = 'A'; for (const [k, t0] of SHOTS) if (t >= t0) s = k; return s; };
  const groups = { A: shA, B: shB, C: shC, D: shD, E: shE, F: shF, G: shG, H: shH, I: shI, J: shJ };

  return t => {
    const sh = shotAt(t);
    for (const k in groups) { const on = k === sh ? 1 : 0; for (const part in groups[k]) op(groups[k][part], on); }
    const bakeryOn = 'ACEFGH'.includes(sh) ? 1 : 0;
    op(bakery, bakeryOn); op(dim, sh === 'G' ? 0.55 : sh === 'H' || sh === 'F' ? 0.3 : 0);
    op(warm, sh === 'G' ? 0.2 + 0.5 * P(t, mid('wants', 0.55), 0.8, linear) : 0);
    confBao.set(sh === 'B' ? 1 : 0, t); confMitch.set(sh === 'I' ? 1 : 0, t); op(lab, sh === 'J' ? 1 : 0);
    if (bakeryOn) motes.forEach((m, i) => tr(m.el, (m.x + t * 8 * AMP) % 1200, m.y + Math.sin(t * 0.7 + m.ph) * 14 * AMP));

    const tb = scTalk(S, t, 'bao'), tc = scTalk(S, t, 'carl'), tm = scTalk(S, t, 'mitch');
    let pB = null, pC = null, pM = null, bMood = 'neutral', bLook = 0, cMood = 'neutral', cLook = 0, bDy = 0;
    let cam = [600, 375, 1];

    if (sh === 'A') {
      const knead = t < mid('bakery', 0.82) ? Math.abs(Math.sin(t * 3.4)) * 10 * AMP : 0;
      pB = [600, 474, 0.9]; bDy = knead;
      const up = P(t, mid('bakery', 0.82), 0.3);
      bMood = up > 0.5 ? 'deadpan' : 'happy'; bLook = 0;
      attr(aDough, 'rx', 92 + knead * 1.2); attr(aDough, 'ry', 28 - knead * 0.4);
      cam = [600, 400, 1 + 0.06 * P(t, 0, end('bakery'), linear)];
      op(aStrap, P(t, mid('bakery', 0.12), 0.4, linear)); tr(aStrap, (1 - P(t, mid('bakery', 0.12), 0.5, easeOut)) * 40, 0);
    } else if (sh === 'B') {
      pB = [430, 390, 1.5];
      bMood = t > mid('hi', 0.78) ? 'annoyed' : t > mid('hi', 0.2) ? 'happy' : 'neutral';
      bLook = t > mid('hi', 0.25) && t < mid('hi', 0.7) ? 0.6 : 0;
      bLower.set(win(t, at('hi') + 0.2, at('hi') + 3.4, 0.35));
      const yp = P(t, mid('hi', 0.22), 0.5, pop); op(bYeast, clamp(yp * 2)); tr(bYeast, 880, 220, 0.7 + 0.3 * yp);
      op(bFungus, P(t, mid('hi', 0.4), 0.4, linear));
      const mp = P(t, mid('hi', 0.6), 0.5, pop); op(bMush, clamp(mp * 2));
      const push = P(t, mid('hi', 0.8), end('hi') + 0.5 - mid('hi', 0.8), linear);
      cam = [lerp(600, 470, push), lerp(375, 360, push), 1 + 0.16 * ease(push)];
    } else if (sh === 'C') {
      pB = [290, 445, 1.15];
      bMood = t > mid('noox', 0.72) ? 'happy' : t > mid('noox', 0.35) ? 'smug' : 'neutral';
      bLook = 0.7;
      op(cNoOx, P(t, mid('noox', 0.1), 0.4, linear));
      op(cLac, P(t, mid('noox', 0.35), 0.4, linear)); cLacStrike.set(P(t, mid('noox', 0.5), 0.4));
      const fp = P(t, mid('noox', 0.74), 0.5, pop); op(cFerm, clamp(fp * 2));
      cFerm.setAttribute('transform', `translate(855 412) scale(${(0.7 + 0.3 * fp).toFixed(3)}) translate(-855 -412)`);
      op(cFermSub, P(t, mid('noox', 0.84), 0.4, linear));
      cam = [600, 375, 1 + 0.03 * P(t, at('noox'), 5, linear)];
    } else if (sh === 'D') {
      pB = [1062, 612, 0.72]; bMood = t > end('eq') ? 'smug' : 'neutral'; bLook = -0.8;
      const ats = [0.04, 0.2, 0.28, 0.44, 0.5];
      dParts.forEach((p, i) => {
        const a = P(t, mid('eq', ats[i]), 0.45, pop);
        op(p.g, clamp(a * 2)); tr(p.g, p.x, EQY, 0.7 + 0.3 * a);
        if (p.icon) { op(p.icon, clamp(a * 2)); tr(p.icon, p.x, EQY - 100 + (1 - clamp(a)) * 18); }
      });
      op(dEn, P(t, mid('eq', 0.72), 0.4, linear)); dSpark.upd(t);
    } else if (sh === 'E') {
      pB = [330, 455, 1.0]; bLook = 0.8; bMood = 'neutral';
      const pop0 = P(t, at('me'), 0.35, pop);
      pC = [860, 430, 0.95 * Math.max(0.01, pop0)];
      cMood = 'shock'; cLook = -0.6;
      ePuff.forEach((p, i) => { const q = P(t, at('me') - 0.05, 0.9, easeOut); tr(p.el, 860 + Math.cos(p.a) * p.d * q, 430 + Math.sin(p.a) * p.d * 0.7 * q, 0.4 + 0.8 * q); op(p.el, 0.85 * (1 - q)); });
      const cp = P(t, mid('me', 0.35), 0.45, pop); op(eChip, clamp(cp * 2)); tr(eChip, 860, 215, 0.7 + 0.3 * cp);
      op(eQ, P(t, mid('me', 0.45), 0.3, linear)); eArrow.set(P(t, mid('me', 0.7), 0.4));
      cam = [600, 400, 1.08];
    } else if (sh === 'F') {
      pB = [170, 505, 0.8]; bMood = 'happy'; bLook = 0.8;
      pC = [1030, 470, 0.7]; cLook = -0.9;
      cMood = t > end('you') ? 'shock' : t > mid('you', 0.15) ? 'shock' : 'neutral';
      const rise = P(t, mid('you', 0.15), 3.0, easeOut), peak = lerp(RIM + 6, 300, rise);
      const ctrl = 2 * peak - (RIM + 6);
      attr(fDough, 'd', `M${BX - BW + 6},${RIM + 6} Q${BX},${ctrl.toFixed(1)} ${BX + BW - 6},${RIM + 6} Q${BX + BW - 6},${BOT} ${BX},${BOT} Q${BX - BW + 6},${BOT} ${BX - BW + 6},${RIM + 6} Z`);
      const topAt = x => (RIM + 6) - (RIM + 6 - peak) * (1 - Math.pow((x - BX) / (BW - 6), 2));
      fBub.forEach((b, i) => {
        const x = BX + b.u * (BW - 30), bottom = BOT - 14 - (1 - Math.pow(b.u, 2)) * 0, y = lerp(bottom - 16, topAt(x) + 22, b.v);
        const g = P(t, mid('you', 0.12) + b.d, 2.6, easeOut);
        attr(b.el, 'cx', x); attr(b.el, 'cy', y); attr(b.el, 'r', Math.max(0.5, b.r * (0.25 + 0.75 * g) * (0.9 + 0.1 * Math.sin(t * 2 + i))));
        op(b.el, g > 0 ? 1 : 0);
      });
      fCO2.forEach((m, i) => { const b = fBub[i * 4 + 1], x = BX + b.u * (BW - 30), y = lerp(BOT - 30, topAt(x) + 22, b.v); tr(m, x, y, 0.8); op(m, P(t, mid('you', 0.3), 0.4, linear)); });
      const tb1 = fBub[5], tx = BX + tb1.u * (BW - 30), ty = lerp(BOT - 30, topAt(tx) + 22, tb1.v);
      attr(fLine, 'x2', tx); attr(fLine, 'y2', ty); attr(fDot, 'cx', tx); attr(fDot, 'cy', ty);
      fLbl.set(P(t, mid('you', 0.25), 0.4, linear) * (1 - P(t, end('you'), 0.25, linear)));
      const rp = P(t, mid('you', 0.38), 0.45, pop); op(fRise, clamp(rp * 2)); fUp.set(P(t, mid('you', 0.45), 0.5));
      const sp = P(t, mid('you', 0.72), 0.45, pop); op(fSoft, clamp(sp * 2)); tr(fSoft, 600, 700, 0.7 + 0.3 * sp);
      const push = P(t, end('you'), 1.0);
      cam = [lerp(600, 860, push), lerp(375, 440, push), 1 + 0.3 * push];
    } else if (sh === 'G') {
      pC = [600, 410, 1.6];
      cMood = t < mid('wants', 0.55) ? 'shock' : t < at('cry') ? 'happy' : t < mid('cry', 0.62) ? 'sad' : 'deadpan';
      cLook = t < at('cry') ? 0 : t < mid('cry', 0.62) ? -0.2 : 0;
      gSparks.forEach((g, i) => { const v = win(t, mid('wants', 0.55), at('cry') + 0.2, 0.3); const rr = 300 + 20 * Math.sin(t * 2 + i); tr(g.sp, 600 + Math.cos(g.a + t * 0.3 * AMP) * rr, 400 + Math.sin(g.a + t * 0.3 * AMP) * rr * 0.6); op(g.sp, v); g.sp.upd(t); });
      // the tear: wells up, rolls, then turns into gas and floats off
      const tw = P(t, mid('cry', 0.25), 0.4, easeOut), roll = P(t, mid('cry', 0.38), 0.6, easeIn), gas = P(t, mid('cry', 0.56), 1.2, easeOut);
      const tx0 = 600 - 37, ty0 = 410 + 6;
      op(gTear, tw * (1 - P(t, mid('cry', 0.56), 0.15, linear)));
      tr(gTear, tx0, ty0 + roll * 46, 0.6 + 0.6 * tw);
      gPuffs.forEach((p, i) => { const q = clamp(gas * 1.2 - i * 0.12); tr(p, tx0 - 10 + i * 9 + Math.sin(q * 6 + i) * 8, ty0 + 46 - q * (140 + i * 30)); op(p, Math.sin(Math.PI * q) * 0.9); });
      const gp = P(t, mid('cry', 0.62), 0.45, pop); op(gGas, clamp(gp * 2)); tr(gGas, 600, 690, 0.7 + 0.3 * gp);
      const push = P(t, at('wants'), end('cry') + 0.6 - at('wants'), linear);
      cam = [600, lerp(390, 400, push), 1 + 0.14 * push];
    } else if (sh === 'H') {
      pB = [1015, 505, 0.85];
      bLook = t < mid('ethanol', 0.4) ? -1 : -0.6;
      bMood = t > mid('ethanol', 0.68) ? 'deadpan' : t > mid('ethanol', 0.4) ? 'neutral' : 'happy';
      const bake = P(t, at('ethanol'), 4, linear);
      attr(hLoafBody, 'fill', baoMix('#F2D7A6', '#B9702E', bake));
      tr(hLoaf, 280, 520 - 10 * bake, 1.5 + 0.15 * bake);
      tr(hGlow, 0, 0, 1 + 0.06 * Math.sin(t * 3)); hHeat.upd(t);
      const ev = P(t, at('ethanol') + 0.2, 0.4, linear);
      hEth.forEach((m, i) => {
        const q = (t * 0.32 + m.ph) % 1, x = 260 + q * 320 + Math.sin(q * 7 + i) * 18, y = 300 - q * 175;
        tr(m.g, x, y, 0.8 + 0.3 * q, Math.sin(t + i) * 20); op(m.g, ev * Math.min(1, q * 6, (1 - q) * 3));
      });
      const hp = P(t, mid('ethanol', 0.04), 0.45, pop); op(hChip, clamp(hp * 2)); tr(hChip, 900, 175, 0.7 + 0.3 * hp);
      op(hSub, P(t, mid('ethanol', 0.18), 0.4, linear));
      const bp = P(t, mid('ethanol', 0.42), 0.45, pop); op(hBottle, clamp(bp * 2)); tr(hBottle, 720, 470, Math.max(0.01, 0.6 + 0.4 * bp));
      const np = P(t, mid('ethanol', 0.68), 0.3, easeOut); op(hNote, np > 0 ? 1 : 0);
      tr(hNote, 726, 474, lerp(1.7, 1, np), lerp(-20, -7, np));
      const push = P(t, end('ethanol') - 0.4, 1.2);
      cam = [lerp(600, 820, push), lerp(375, 440, push), 1 + 0.22 * push];
    } else if (sh === 'I') {
      pM = [400, 400, 1.35];
      const side = win(t, mid('th_cousin', 0.22), mid('th_cousin', 0.42), 0.2);
      mitch.set({ t, talk: tm, mood: 'deadpan', look: 0.7 * side });
      op(iCousin, P(t, mid('th_cousin', 0.05), 0.3, linear));
      op(iTech, P(t, mid('th_cousin', 0.25), 0.3, linear));
      const bp = P(t, mid('th_cousin', 0.44), 0.45, pop); op(iBoth, clamp(bp * 2)); tr(iBoth, 900, 330, 0.7 + 0.3 * bp);
      [0.6, 0.78].forEach((f, k) => { const p = P(t, mid('th_cousin', f), 0.45, pop); op(iCards[k], clamp(p * 2)); tr(iCards[k], 0, (1 - clamp(p)) * 24); });
      const push = P(t, end('th_cousin'), 1.0);
      cam = [lerp(600, 470, push), lerp(375, 380, push), 1 + 0.18 * push];
    } else if (sh === 'J') {
      pC = [880, 432, 0.85];
      const tr0 = mid('trick', 0.82), bow = Math.sin(Math.PI * P(t, tr0, 1.3, linear));
      cMood = t >= at('trick') ? 'happy' : t > mid('limewater', 0.82) ? 'smug' : 'neutral';
      cLook = t < at('trick') ? -0.8 : 0;
      const sp = P(t, mid('limewater', 0.4), 0.7, linear) * (1 - P(t, at('trick') + 0.1, 0.3, linear));
      jStrawO.setAttribute('stroke-dashoffset', (1 - sp).toFixed(4)); jStrawI.setAttribute('stroke-dashoffset', (1 - sp).toFixed(4));
      op(jStraw, sp > 0.01 ? 1 : 0);
      const blow = P(t, mid('limewater', 0.55), 0.3, linear) * (1 - P(t, at('trick') + 0.1, 0.4, linear));
      jB.upd(t, blow); op(jBub, blow);
      const milk = P(t, mid('limewater', 0.78), 1.6, linear);
      jTube.set(0.74, baoMix('#BFE6F7', '#F4F2EA', milk)); jTube.liquid.setAttribute('opacity', (0.45 + 0.5 * milk).toFixed(3));
      jLbl.set(P(t, mid('limewater', 0.5), 0.4, linear));
      op(jClear, P(t, mid('limewater', 0.55), 0.4, linear));
      jArr.set(P(t, mid('limewater', 0.8), 0.4)); op(jArr, P(t, mid('limewater', 0.8), 0.1, linear));
      const mp = P(t, mid('limewater', 0.84), 0.45, pop); op(jMilky, clamp(mp * 2));
      jMilky.setAttribute('transform', `translate(930 145) scale(${(0.7 + 0.3 * mp + 0.12 * Math.sin(Math.PI * P(t, mid('trick', 0.3), 0.6, linear))).toFixed(3)}) translate(-930 -145)`);
      op(jSub, P(t, mid('limewater', 0.92), 0.4, linear));
      const cf = P(t, mid('trick', 0.15), 0.2, linear);
      jConf.forEach((c, i) => { const q = (t - mid('trick', 0.15)) * 0.5 - c.d; const y = 120 + ((q * c.sp) % 520 + 520) % 520; tr(c.el, c.x + Math.sin(t * 2 + i) * 14, y, 1, c.rot + t * 140); op(c.el, cf * (q > 0 ? 1 : 0) * (y < 560 ? 0.9 : 0)); });
      pC[1] += 30 * bow;
      carl.set({ t, talk: tc, mood: cMood, look: cLook });
      op(carl, 1); tr(carl, pC[0], pC[1], pC[2], -28 * bow);
      pC = 'done';
      cam = [600, 375, 1];
    }

    place(bao, pB, bDy); place(mitch, pM);
    if (pC !== 'done') place(carl, pC);
    if (pB) bao.set({ t, talk: tb, mood: bMood, look: bLook });
    if (pC && pC !== 'done') carl.set({ t, talk: tc, mood: cMood, look: cLook });
    baoCam(cam[0], cam[1], cam[2]);
  };
});
