/* Chapter 2: Aerobic respiration and its equations.
   Beats: aerobic = with oxygen -> word equation -> Glad Owls Carry Wet Eggs -> reactants / products
   -> (+ energy) -> symbol equation -> count the atoms -> 36 atoms rearrange -> mass conserved
   -> a large amount of energy -> blood carries O2 in and CO2 out. */
scene('aerobic', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;

  /* ---------- local helpers ---------- */
  // chemical formula with real subscripts: '6CO2' -> 6CO₂ (leading digits stay full size)
  function formula(parent, x, y, str, o) {
    o = o || {};
    const size = o.size || 50, sub = Math.round(size * 0.62), dy = Math.round(size * 0.24);
    const t = E('text', { x, y, 'font-size': size, 'font-weight': o.weight || 600, fill: o.fill || C.ink, 'text-anchor': o.anchor || 'middle', 'font-family': FD }, parent);
    const m = str.match(/^(\d*)(.*)$/);
    let low = false;
    const push = (txt, isSub) => {
      const ts = E('tspan', {}, t); ts.textContent = txt;
      if (isSub) { ts.setAttribute('font-size', sub); if (!low) { ts.setAttribute('dy', dy); low = true; } }
      else if (low) { ts.setAttribute('dy', -dy); low = false; }
    };
    if (m[1]) push(m[1], false);
    m[2].replace(/([A-Za-z]+)|(\d+)/g, (all, letters, digits) => { push(letters || digits, !letters); return ''; });
    return t;
  }
  // a brace under [xl, xr] at y; returns a path that can be drawn progressively with .set(p)
  function brace(parent, xl, xr, y, color) {
    const xm = (xl + xr) / 2, d = `M${xl},${y} Q${xl},${y + 16} ${xl + 16},${y + 16} L${xm - 14},${y + 16} Q${xm},${y + 16} ${xm},${y + 30} Q${xm},${y + 16} ${xm + 14},${y + 16} L${xr - 16},${y + 16} Q${xr},${y + 16} ${xr},${y}`;
    const pth = E('path', { d, fill: 'none', stroke: color, 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', pathLength: 1, 'stroke-dasharray': '1 1' }, parent);
    pth.set = p => pth.setAttribute('stroke-dashoffset', (1 - clamp(p)).toFixed(4));
    pth.set(0);
    return pth;
  }
  const cubic = (a, b, c, d, u) => { const v = 1 - u; return [v * v * v * a[0] + 3 * v * v * u * b[0] + 3 * v * u * u * c[0] + u * u * u * d[0], v * v * v * a[1] + 3 * v * v * u * b[1] + 3 * v * u * u * c[1] + u * u * u * d[1]]; };
  function person(p) {
    E('path', { d: 'M-28,34 Q-28,-4 0,-6 Q28,-4 28,34 Z', fill: ball('#4CC9F0', '#1D84A6'), stroke: '#BDEBFA', 'stroke-width': 2.5 }, p);
    E('circle', { cx: 0, cy: -26, r: 17, fill: ball('#E8B48E', '#B9825A'), stroke: '#F7D9C2', 'stroke-width': 2.5 }, p);
  }
  function paw(p) {
    E('ellipse', { cx: 0, cy: 14, rx: 22, ry: 18, fill: ball('#D9AE84', '#9C6E46'), stroke: '#F3D8BB', 'stroke-width': 2.5 }, p);
    [[-24, -10], [-9, -24], [9, -24], [24, -10]].forEach(([x, y]) => E('ellipse', { cx: x, cy: y, rx: 8.5, ry: 10, fill: ball('#D9AE84', '#9C6E46'), stroke: '#F3D8BB', 'stroke-width': 2.5 }, p));
  }
  function potPlant(p) {
    E('path', { d: 'M0,8 L0,-26', stroke: C.stem, 'stroke-width': 5, 'stroke-linecap': 'round' }, p);
    [[-14, -18, -35], [14, -26, 35], [0, -40, 0]].forEach(([x, y, r]) => E('ellipse', { cx: 0, cy: 0, rx: 15, ry: 8, fill: ball(C.plant, C.plantDk), stroke: '#9EF0B4', 'stroke-width': 2, transform: `translate(${x} ${y}) rotate(${r})` }, p));
    E('path', { d: 'M-24,6 L24,6 L17,38 L-17,38 Z', fill: ball('#D9824A', '#9A4E1E'), stroke: '#F0B48A', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, p);
  }

  /* ===== beat: aerobic = with air (oxygen) ===== */
  const bA = G(root);
  const aWord = T(bA, 600, 186, 'aerobic', { size: 76, weight: 700, anchor: 'middle', fill: C.energy });
  const aMean = T(bA, 600, 244, "= 'with air', or with oxygen", { size: 38, weight: 600, anchor: 'middle' });
  const aCell = animalCell(bA, 250, 150, { sw: 6, seed: 14, nr: 34, nx: -150, ny: -30 }); tr(aCell, 600, 505);
  const aMito = mitochondrion(aCell.inner, 190, 82, { glow: true }); tr(aMito, 40, 10, 1, -6);
  const aLblL = T(bA, 120, 400, 'oxygen', { size: 30, weight: 600, anchor: 'middle', fill: '#FF9A8F' });
  const aLblR = T(bA, 1080, 400, 'oxygen', { size: 30, weight: 600, anchor: 'middle', fill: '#FF9A8F' });
  const aFlow = G(bA), aPops = G(bA), ar = rng(41), aO2 = [];
  for (let k = 0; k < 13; k++) {
    const side = k % 2 ? 1 : -1;
    aO2.push({ g: molO2(aFlow, 15), sp: spark(aPops, 13, { seed: k }), t0: 1.6 + k * 0.62, x0: side < 0 ? -40 : 1240, y0: 430 + ar() * 170, a2: ar() * TAU });
  }
  const aT = [640, 515];

  /* ===== word equation ===== */
  const EQY = 300;
  const eqG = G(root);
  const SPEC = [
    { key: 'glu', text: 'glucose', fill: C.glucose, color: '#3A2600', mn: '**G**lad', icon: g => molGlucose(g, 30), sym: 'C6H12O6' },
    { op: '+' },
    { key: 'oxy', text: 'oxygen', fill: C.oxygen, color: '#FFFFFF', mn: '**O**wls', icon: g => molO2(g, 17), sym: '6O2' },
    { op: '→' },
    { key: 'co2', text: 'carbon dioxide', fill: C.co2, color: '#10202B', mn: '**C**arry', icon: g => molCO2(g, 15), sym: '6CO2' },
    { op: '+' },
    { key: 'wat', text: 'water', fill: C.water, color: '#06283A', mn: '**W**et', icon: g => molH2O(g, 18), sym: '6H2O' },
    { key: 'en', text: '(+ energy)', fill: C.energy, color: '#3A3000', mn: '**E**ggs', icon: g => spark(g, 24, { seed: 2 }) },
  ];
  const parts = SPEC.map(sp => {
    const p = Object.assign({}, sp);
    if (sp.op) {
      p.g = G(eqG);
      if (sp.op === '+') T(p.g, 0, 15, '+', { size: 46, weight: 600, anchor: 'middle', fill: C.muted });
      else arrow(p.g, -28, 0, 28, 0, { color: C.ink, width: 6 });
      p.w = sp.op === '+' ? 40 : 64;
    } else {
      p.g = chip(eqG, sp.text, { size: 31, fill: sp.fill, color: sp.color, weight: 700 });
      p.w = p.g.w;
      p.icon = G(eqG); p.iconArt = sp.icon(p.icon);
      p.mnT = T(eqG, 0, 0, sp.mn, { size: 36, weight: 500, anchor: 'middle', boldFill: C.energy });
    }
    return p;
  });
  { const GAP = 12; let total = 0; parts.forEach((p, i) => { total += p.w + (i ? GAP : 0); }); let x = 600 - total / 2; parts.forEach((p, i) => { if (i) x += GAP; p.x = x + p.w / 2; x += p.w; }); }
  const PK = {}; parts.forEach(p => { if (p.key) PK[p.key] = p; });
  parts.forEach(p => { tr(p.g, p.x, EQY); if (p.icon) tr(p.icon, p.x, EQY - 90); if (p.mnT) { p.mnT.setAttribute('x', p.x); p.mnT.setAttribute('y', EQY + 76); } });
  const chipAt = [0.22, 0.3, 0.34, 0.43, 0.48, 0.58, 0.62, 0.79];
  const mnAt = { glu: 0.37, oxy: 0.43, co2: 0.49, wat: 0.55, en: 0.6 };
  const pulseAt = { glu: 0.66, oxy: 0.73, co2: 0.8, wat: 0.88, en: 0.94 };
  // reactants / products braces
  const brG = G(eqG);
  const bxl = PK.glu.x - PK.glu.w / 2, bxm = PK.oxy.x + PK.oxy.w / 2, pxl = PK.co2.x - PK.co2.w / 2, pxr = PK.wat.x + PK.wat.w / 2;
  const brR = brace(brG, bxl, bxm, EQY + 42, C.glucoseLt), brP = brace(brG, pxl, pxr, EQY + 42, C.water);
  const lbR = T(brG, (bxl + bxm) / 2, EQY + 116, '**reactants**: what goes in', { size: 30, weight: 500, anchor: 'middle', boldFill: C.glucoseLt });
  const lbP = T(brG, (pxl + pxr) / 2, EQY + 116, '**products**: what comes out', { size: 30, weight: 500, anchor: 'middle', boldFill: C.water });
  // energy note
  const enNote = G(eqG);
  const nW = textWidth('released, not a substance', 28, FD, 600), nX = Math.min(PK.en.x, 1170 - nW / 2);
  E('line', { x1: PK.en.x, y1: EQY + 34, x2: PK.en.x, y2: EQY + 128, stroke: C.energy, 'stroke-width': 3, 'stroke-dasharray': '6 6' }, enNote);
  T(enNote, nX, EQY + 166, 'released, not a substance', { size: 28, weight: 600, anchor: 'middle', fill: C.energy });

  /* ===== symbol equation (under the word equation, later moves to the top) ===== */
  const SY0 = 492;
  const symG = G(root), symParts = [];
  parts.forEach(p => {
    if (p.op) { const g = G(symG); if (p.op === '+') T(g, 0, 16, '+', { size: 46, weight: 600, anchor: 'middle', fill: C.muted }); else arrow(g, -28, 0, 28, 0, { color: C.ink, width: 6 }); symParts.push({ g, xa: p.x, y: SY0 - 16, w: p.op === '+' ? 30 : 60 }); }
    else if (p.sym) { const g = G(symG); const te = formula(g, 0, 0, p.sym, { size: 46, weight: 600, fill: C.ink }); let w = 0; try { w = te.getComputedTextLength(); } catch (e) { w = 0; } symParts.push({ g, xa: p.x, y: SY0, w: w || p.sym.length * 24 }); }
  });
  { const GAP = 20; let tot = 0; symParts.forEach((q, i) => { tot += q.w + (i ? GAP : 0); }); let x = 600 - tot / 2; symParts.forEach((q, i) => { if (i) x += GAP; q.xc = x + q.w / 2; x += q.w; }); }
  const symAt = [0.27, 0.46, 0.5, 0.61, 0.65, 0.79, 0.83];

  /* ===== atoms: count, rearrange, conserve ===== */
  const atG = G(root);
  const GX = 225, GY = 385, R = 58, sc = R / 70;
  const OX = [410, 488], ROWS = [305, 385, 465], CX = [722, 842], WX = [978, 1078];
  const pol = (r, deg) => [Math.cos(deg * Math.PI / 180) * r, Math.sin(deg * Math.PI / 180) * r];
  const add = (a, b) => [a[0] + b[0], a[1] + b[1]];
  const A = {};
  const put = (name, kind, rel) => { A[name] = { kind, x: GX + rel[0], y: GY + rel[1] }; };
  const RING = { O5: -30, C1: 30, C2: 90, C3: 150, C4: 210, C5: 270 };
  for (const k in RING) put(k, k[0], pol(R, RING[k]));
  [1, 2, 3, 4].forEach(i => { const a = RING['C' + i]; put('O' + i, 'O', pol(1.8 * R, a + 15)); put('H' + i + 'o', 'H', pol(2.4 * R, a + 15)); put('H' + i, 'H', pol(1.6 * R, a - 25)); });
  put('H5', 'H', pol(1.55 * R, 250));
  const c6 = pol(1.9 * R, 300); put('C6', 'C', c6);
  put('H6a', 'H', add(c6, pol(42 * sc, 210))); put('H6b', 'H', add(c6, pol(42 * sc, 30)));
  const o6 = add(c6, pol(50 * sc, 300)); put('O6', 'O', o6); put('H6o', 'H', add(o6, pol(36 * sc, 340)));
  const BONDS = [['O5', 'C1'], ['C1', 'C2'], ['C2', 'C3'], ['C3', 'C4'], ['C4', 'C5'], ['C5', 'O5'], ['C1', 'O1'], ['O1', 'H1o'], ['C1', 'H1'], ['C2', 'O2'], ['O2', 'H2o'], ['C2', 'H2'], ['C3', 'O3'], ['O3', 'H3o'], ['C3', 'H3'], ['C4', 'O4'], ['O4', 'H4o'], ['C4', 'H4'], ['C5', 'H5'], ['C5', 'C6'], ['C6', 'H6a'], ['C6', 'H6b'], ['C6', 'O6'], ['O6', 'H6o']];

  const bondG = G(atG), haloG = G(atG), atomG = G(atG);
  BONDS.forEach(([a, b]) => E('line', { x1: A[a].x, y1: A[a].y, x2: A[b].x, y2: A[b].y, stroke: '#7F96A8', 'stroke-width': 6, 'stroke-linecap': 'round' }, bondG));
  const hexBack = E('path', { d: 'M' + [-90, -30, 30, 90, 150, 210].map(a => pol(R * 1.02, a).map((v, i) => (v + (i ? GY : GX)).toFixed(1)).join(',')).join(' L') + 'Z', fill: 'rgba(255,194,71,0.12)', stroke: 'rgba(255,194,71,0.35)', 'stroke-width': 3 }, bondG);
  bondG.insertBefore(hexBack, bondG.firstChild);
  const recs = [];
  const mk = (kind, x0, y0, tag) => { const r = { kind, x0, y0, r0: kind === 'H' ? 10 : 15, tag }; recs.push(r); return r; };
  const GA = {}; for (const n in A) GA[n] = mk(A[n].kind, A[n].x, A[n].y, 'glu');
  const O2A = []; for (let j = 0; j < 6; j++) { const cx = OX[j % 2], cy = ROWS[Math.floor(j / 2)]; O2A.push([mk('O', cx - 10.8, cy, 'o2'), mk('O', cx + 10.8, cy, 'o2')]); }
  const T0 = mid('watch', 0.3), FLY = 1.45, fr = rng(57);
  const dest = (r, x, y, s, st, prod) => { r.x1 = x; r.y1 = y; r.s1 = s; r.st = st + fr() * 0.12; r.bend = -(150 + fr() * 70); r.prod = prod; };
  const gluO = ['O1', 'O2', 'O3', 'O4', 'O5', 'O6'], gluH = ['H1', 'H1o', 'H2', 'H2o', 'H3', 'H3o', 'H4', 'H4o', 'H5', 'H6a', 'H6b', 'H6o'];
  for (let j = 0; j < 6; j++) {
    const cy = ROWS[Math.floor(j / 2)], s1 = T0 + (2 * j) * 0.28, s2 = T0 + (2 * j + 1) * 0.28;
    const cx = CX[j % 2];
    dest(GA['C' + (j + 1)], cx, cy, 1, s1, 'co2'); dest(GA[gluO[j]], cx - 24, cy, 0.9, s1, 'co2'); dest(O2A[j][0], cx + 24, cy, 0.9, s1, 'co2');
    const wx = WX[j % 2];
    dest(O2A[j][1], wx, cy, 1, s2, 'h2o'); dest(GA[gluH[2 * j]], wx - 14.7, cy + 10.8, 0.93, s2, 'h2o'); dest(GA[gluH[2 * j + 1]], wx + 14.7, cy + 10.8, 0.93, s2, 'h2o');
  }
  const ghostG = G(atG); atG.insertBefore(ghostG, atG.firstChild);
  ['H', 'O', 'C'].forEach(kind => recs.filter(r => r.kind === kind).forEach(r => {
    r.ghost = E('circle', { cx: r.x0, cy: r.y0, r: r.r0 - 1, fill: 'none', stroke: ATOM[kind][0], 'stroke-width': 2, 'stroke-dasharray': '4 4', opacity: 0.35 }, ghostG);
    r.halo = E('circle', { r: r.r0 * 2.3, fill: glow('#FFF3A0') }, haloG);
    r.el = atom(atomG, kind, r.r0, { letter: kind !== 'H' });
  }));
  recs.forEach((r, i) => { r.i = i; r.d = (Math.hypot(r.x0 - 300, r.y0 - 385) / 300) * 0.5; });
  const rxArrow = arrow(atG, 568, 385, 646, 385, { color: C.ink, width: 9 });
  const lbGlu = T(atG, 205, 562, '1 glucose', { size: 28, weight: 600, anchor: 'middle', fill: C.glucoseLt });
  const lbO2 = T(atG, 449, 562, '6 oxygen', { size: 28, weight: 600, anchor: 'middle', fill: '#FF9A8F' });
  const lbCO2 = T(atG, 782, 562, '6 carbon dioxide', { size: 28, weight: 600, anchor: 'middle', fill: C.co2 });
  const lbH2O = T(atG, 1028, 562, '6 water', { size: 28, weight: 600, anchor: 'middle', fill: C.water });
  // tallies
  function tally(parent, xs, withTicks) {
    return ['C', 'H', 'O'].map((k, i) => {
      const g = G(parent); tr(g, xs[i], 600);
      atom(g, k, 17, { letter: true });
      const n = T(g, 28, 13, '0', { size: 38, weight: 700 });
      T(g, 14, 50, ['carbon', 'hydrogen', 'oxygen'][i], { size: 24, weight: 500, anchor: 'middle', fill: C.muted });
      const tk = withTicks ? tick(g, 10) : null; if (tk) tr(tk, 90, -6);
      return { g, n, tk, total: [6, 12, 18][i] };
    });
  }
  const tL = tally(atG, [100, 225, 350], false), tR = tally(atG, [722, 862, 1002], true);
  const oNote = T(atG, 440, 613, '(6 + 12)', { size: 24, weight: 600, fill: C.muted });
  const eqSign = T(atG, 600, 622, '=', { size: 64, weight: 700, anchor: 'middle', fill: C.good });
  const ban = G(atG);
  E('rect', { x: 230, y: 666, width: 740, height: 54, rx: 27, fill: 'rgba(86,214,155,0.14)', stroke: C.good, 'stroke-width': 2.5 }, ban);
  T(ban, 600, 703, 'No atoms lost or made: **mass is conserved**', { size: 30, weight: 500, anchor: 'middle', boldFill: C.good });

  /* ===== a large amount of energy ===== */
  const bL = G(root);
  const rays = G(bL);
  for (let i = 0; i < 16; i++) { const a = i / 16 * TAU; E('line', { x1: Math.cos(a) * 92, y1: Math.sin(a) * 92, x2: Math.cos(a) * (i % 2 ? 140 : 165), y2: Math.sin(a) * (i % 2 ? 140 : 165), stroke: C.energy, 'stroke-width': 7, 'stroke-linecap': 'round', opacity: 0.8 }, rays); }
  const core = spark(bL, 62, { seed: 3 });
  const flyers = []; for (let i = 0; i < 14; i++) flyers.push({ sp: spark(bL, 14, { seed: i }), a: i / 14 * TAU + 0.2, ph: (i * 0.37) % 1 });
  const bigTxt = T(bL, 600, 508, 'a large amount of energy', { size: 50, weight: 700, anchor: 'middle', fill: C.energy });
  const enMeter = meter(bL, { w: 540, h: 30, color: C.energy }); tr(enMeter, 330, 534);
  const who = [[440, person, 'humans'], [600, paw, 'animals'], [760, potPlant, 'plants']].map(([x, fn, label]) => {
    const g = G(bL); const art = G(g); fn(art); tr(art, 0, 0); T(g, 0, 72, label, { size: 26, weight: 600, anchor: 'middle' }); return { g, x };
  });

  /* ===== blood: oxygen in, carbon dioxide out ===== */
  const bB = G(root);
  const TP = [[318, 352], [470, 205], [700, 205], [836, 340]], BP = [[836, 460], [700, 596], [470, 596], [318, 448]];
  const vpath = q => `M${q[0][0]},${q[0][1]} C${q[1][0]},${q[1][1]} ${q[2][0]},${q[2][1]} ${q[3][0]},${q[3][1]}`;
  E('path', { d: vpath(TP), fill: 'none', stroke: '#5E1A26', 'stroke-width': 36, 'stroke-linecap': 'round' }, bB);
  E('path', { d: vpath(TP), fill: 'none', stroke: '#E8424F', 'stroke-width': 24, 'stroke-linecap': 'round' }, bB);
  E('path', { d: vpath(BP), fill: 'none', stroke: '#4A1626', 'stroke-width': 36, 'stroke-linecap': 'round' }, bB);
  E('path', { d: vpath(BP), fill: 'none', stroke: '#9C2C4A', 'stroke-width': 24, 'stroke-linecap': 'round' }, bB);
  const lg = lungs(bB, 0.62); tr(lg, 230, 402);
  const bCell = animalCell(bB, 140, 112, { sw: 5, seed: 12, nr: 26, nx: -55, ny: -28 }); tr(bCell, 962, 400);
  const bMito = mitochondrion(bCell.inner, 104, 48, { glow: true }); tr(bMito, 30, 30, 1, -10);
  const rbcT = [], rbcB = [];
  for (let i = 0; i < 8; i++) { rbcT.push(E('ellipse', { rx: 9, ry: 6, fill: '#FF8A94', stroke: '#FFD0D5', 'stroke-width': 1.5 }, bB)); rbcB.push(E('ellipse', { rx: 9, ry: 6, fill: '#C2577A', stroke: '#E9A4BA', 'stroke-width': 1.5 }, bB)); }
  const ridersO2 = [], ridersCO2 = [], exhale = [];
  for (let i = 0; i < 5; i++) { ridersO2.push(molO2(bB, 10)); ridersCO2.push(molCO2(bB, 8.5)); }
  for (let i = 0; i < 3; i++) exhale.push(molCO2(bB, 10));
  const airUp = arrow(bB, 292, 300, 292, 218, { color: C.air, width: 6 });
  const lbOut = T(bB, 314, 236, 'breathed out', { size: 28, weight: 600, fill: C.air });
  const lbOx = T(bB, 584, 216, 'oxygen', { size: 30, weight: 700, anchor: 'middle', fill: '#FF9A8F' });
  const lbCd = T(bB, 584, 648, 'carbon dioxide', { size: 30, weight: 700, anchor: 'middle', fill: C.co2 });
  T(bB, 230, 562, 'lungs', { size: 28, weight: 600, anchor: 'middle', fill: C.muted });
  T(bB, 962, 562, 'body cell', { size: 28, weight: 600, anchor: 'middle', fill: C.muted });
  T(bB, 584, 410, 'blood', { size: 32, weight: 700, anchor: 'middle', fill: '#FF8A94' });

  return t => {
    /* --- aerobic beat --- */
    const fA = 1 - P(t, at('word') - 0.2, 0.5, linear);
    op(bA, fA);
    if (fA > 0) {
      const wp = P(t, mid('aerobic', 0.42), 0.6, pop);
      op(aWord, clamp(wp * 2)); aWord.setAttribute('transform', `translate(600 186) scale(${(0.8 + 0.2 * wp).toFixed(3)}) translate(-600 -186)`);
      op(aMean, P(t, mid('aerobic', 0.6), 0.5, linear));
      op(aLblL, P(t, mid('aerobic', 0.1), 0.5, linear)); op(aLblR, P(t, mid('aerobic', 0.1), 0.5, linear));
      aCell.upd(t); aMito.upd(t);
      aO2.forEach(o => {
        const u = (t - o.t0) / 2.4;
        if (u <= 0 || u >= 1) op(o.g, 0);
        else { const p = ease(u); tr(o.g, lerp(o.x0, aT[0], p), lerp(o.y0, aT[1], p) - Math.sin(p * Math.PI) * 40, 1 - 0.35 * p, u * 90); op(o.g, Math.min(1, u * 5, (1 - u) * 6)); }
        const v = (t - o.t0 - 2.4) / 1.2;
        if (v <= 0 || v >= 1) op(o.sp, 0);
        else { const d = easeOut(v) * 120; tr(o.sp, aT[0] + Math.cos(o.a2) * d, aT[1] + Math.sin(o.a2) * d * 0.6, 0.6 + 0.5 * Math.sin(v * Math.PI)); op(o.sp, Math.sin(v * Math.PI)); o.sp.upd(t); }
      });
    }

    /* --- word equation, mnemonic, braces, energy note --- */
    const fE = win(t, at('word') - 0.1, at('count') - 0.1, 0.5);
    op(eqG, fE);
    if (fE > 0) {
      parts.forEach((p, i) => {
        const t0 = mid('word', chipAt[i]), a = P(t, t0, 0.5, pop);
        let s = 0.7 + 0.3 * a;
        if (p.key && pulseAt[p.key] !== undefined) s += 0.12 * Math.sin(Math.PI * P(t, mid('owls', pulseAt[p.key]), 0.45, linear));
        if (p.key === 'en') s += 0.1 * Math.sin(Math.PI * P(t, at('brackets') + 0.1, 0.6, linear)) + 0.06 * Math.sin(Math.PI * P(t, mid('brackets', 0.5), 0.6, linear));
        op(p.g, clamp(a * 2)); tr(p.g, p.x, EQY, s);
        if (p.icon) { op(p.icon, clamp(a * 2)); tr(p.icon, p.x, EQY - 90 + (1 - clamp(a)) * 16); if (p.iconArt && p.iconArt.upd) p.iconArt.upd(t); }
        if (p.mnT) op(p.mnT, P(t, mid('owls', mnAt[p.key]), 0.4, linear) * (1 - P(t, at('reactants') - 0.2, 0.4, linear)));
      });
      brR.set(P(t, mid('reactants', 0.04), 0.7)); brP.set(P(t, mid('reactants', 0.52), 0.7));
      const dimSym = 1 - 0.55 * P(t, at('symbol') - 0.1, 0.5, linear);
      op(brG, dimSym);
      op(lbR, P(t, mid('reactants', 0.12), 0.5, linear)); op(lbP, P(t, mid('reactants', 0.6), 0.5, linear));
      op(enNote, win(t, mid('brackets', 0.28), at('symbol') + 0.2, 0.4));
    }

    /* --- symbol equation: appears, then moves to the top --- */
    const fS = P(t, mid('symbol', 0.2), 0.3, linear) * (1 - P(t, at('lots') - 0.2, 0.5, linear));
    op(symG, fS);
    if (fS > 0) {
      const mv = P(t, at('count') - 0.2, 1.0);
      symParts.forEach((q, i) => { op(q.g, P(t, mid('symbol', symAt[i]), 0.35, linear)); tr(q.g, lerp(q.xa, q.xc, mv), q.y); });
      const y = lerp(SY0, 150, mv), s = lerp(1, 0.8, mv);
      symG.setAttribute('transform', `translate(600 ${y.toFixed(1)}) scale(${s.toFixed(3)}) translate(-600 ${-SY0})`);
    }

    /* --- atoms --- */
    const fT = win(t, at('count') + 0.0, at('lots') + 0.1, 0.5);
    op(atG, fT);
    if (fT > 0) {
      const hC = win(t, mid('count', 0.29), mid('count', 0.43), 0.3), hH = win(t, mid('count', 0.42), mid('count', 0.56), 0.3);
      const hO = win(t, mid('count', 0.55), mid('count', 0.71), 0.3), hOg = win(t, mid('count', 0.71), mid('count', 0.85), 0.3), hO2 = win(t, mid('count', 0.85), end('count') + 0.4, 0.3);
      const rC = win(t, mid('right', 0.16), mid('right', 0.27), 0.3), rH = win(t, mid('right', 0.25), mid('right', 0.36), 0.3), rO = win(t, mid('right', 0.34), mid('right', 0.46), 0.3);
      const rCO2 = win(t, mid('right', 0.47), mid('right', 0.58), 0.3), rH2O = win(t, mid('right', 0.57), mid('right', 0.67), 0.3);
      op(bondG, 1 - P(t, T0 - 0.3, 0.5, linear));
      recs.forEach(r => {
        const u = clamp((t - r.st) / FLY), p = ease(u);
        let x = r.x0, y = r.y0, s = 1;
        if (u > 0) {
          const cx = (r.x0 + r.x1) / 2, cy = Math.min(r.y0, r.y1) + r.bend, q = 1 - p;
          x = q * q * r.x0 + 2 * q * p * cx + p * p * r.x1; y = q * q * r.y0 + 2 * q * p * cy + p * p * r.y1; s = lerp(1, r.s1, p);
        }
        const settle = u >= 1 ? 1 + 0.12 * Math.sin(Math.PI * P(t, r.st + FLY, 0.35, linear)) : 1;
        const jig = (u <= 0 || u >= 1) ? Math.sin(t * 2.1 + r.i * 1.7) * 1.4 * AMP : 0;
        const appear = P(t, at('count') + 0.1 + r.d, 0.45, pop);
        op(r.ghost, P(t, r.st + 0.2, 0.5, linear) * 0.9);
        tr(r.el, x + jig, y, Math.max(0.01, s * settle * appear));
        let h = 0;
        if (u <= 0) { h = r.kind === 'C' ? hC : r.kind === 'H' ? hH : Math.max(hO, r.tag === 'glu' ? hOg : hO2); }
        else if (u >= 1) { h = Math.max(r.kind === 'C' ? rC : r.kind === 'H' ? rH : rO, r.prod === 'co2' ? rCO2 : rH2O); }
        op(r.halo, h * 0.95);
        if (h > 0) tr(r.halo, x, y, s);
      });
      rxArrow.set(P(t, at('count') + 0.3, 0.6));
      op(lbGlu, P(t, at('count') + 0.5, 0.5, linear) * (1 - P(t, T0 - 0.3, 0.4, linear)));
      op(lbO2, P(t, at('count') + 0.6, 0.5, linear) * (1 - P(t, T0 - 0.3, 0.4, linear)));
      op(lbCO2, P(t, T0 + 2.6, 0.5, linear)); op(lbH2O, P(t, T0 + 2.9, 0.5, linear));
      [0.3, 0.44, 0.57].forEach((f, i) => { const o = tL[i]; op(o.g, P(t, mid('count', f) - 0.1, 0.4, linear)); setText(o.n, String(Math.round(o.total * P(t, mid('count', f), 0.7, linear)))); });
      op(oNote, P(t, mid('count', 0.73), 0.4, linear));
      [0.17, 0.26, 0.35].forEach((f, i) => { const o = tR[i]; op(o.g, P(t, mid('right', f) - 0.1, 0.4, linear)); setText(o.n, String(Math.round(o.total * P(t, mid('right', f), 0.6, linear)))); op(o.tk, P(t, mid('right', f) + 0.7, 0.3, linear)); });
      const eqp = P(t, mid('right', 0.4), 0.5, pop); op(eqSign, clamp(eqp * 2));
      const bp = P(t, mid('right', 0.68), 0.6, easeOut); op(ban, bp); tr(ban, 0, (1 - bp) * 16);
    }

    /* --- a large amount of energy --- */
    const fL = win(t, at('lots') - 0.1, at('blood') + 0.1, 0.5);
    op(bL, fL);
    if (fL > 0) {
      const bp = P(t, at('lots') + 0.1, 0.7, pop);
      tr(core, 600, 290, Math.max(0.01, bp)); core.upd(t);
      tr(rays, 600, 290, 0.6 + 0.4 * clamp(bp), (t * 10) % 360); op(rays, clamp(bp));
      flyers.forEach(f => { const q = (t * 0.5 + f.ph) % 1, d = 80 + 210 * easeOut(q); tr(f.sp, 600 + Math.cos(f.a) * d * 1.2, 290 + Math.sin(f.a) * d * 0.8, 0.5 + 0.5 * (1 - q)); op(f.sp, Math.sin(q * Math.PI) * clamp(bp)); f.sp.upd(t); });
      op(bigTxt, P(t, mid('lots', 0.22), 0.5, linear));
      enMeter.set(P(t, mid('lots', 0.3), 1.6, easeOut)); op(enMeter, P(t, mid('lots', 0.26), 0.4, linear));
      who.forEach((w, i) => { const p = P(t, mid('lots', 0.73 + i * 0.08), 0.5, pop); op(w.g, clamp(p * 2)); tr(w.g, w.x, 630 + (1 - clamp(p)) * 16, 0.8 + 0.2 * p); });
    }

    /* --- blood loop --- */
    const fB = P(t, at('blood') - 0.1, 0.5, linear);
    op(bB, fB);
    if (fB > 0) {
      lg.set(wave(t, 3.4) * AMP);
      bCell.upd(t); bMito.upd(t);
      const flow = t * 0.11;
      rbcT.forEach((e, i) => { const [x, y] = cubic(TP[0], TP[1], TP[2], TP[3], (flow + i / 8) % 1); attr(e, 'cx', x); attr(e, 'cy', y); });
      rbcB.forEach((e, i) => { const [x, y] = cubic(BP[0], BP[1], BP[2], BP[3], (flow + i / 8 + 0.06) % 1); attr(e, 'cx', x); attr(e, 'cy', y); });
      const oIn = P(t, mid('blood', 0.04), 0.5, linear), cOut = P(t, mid('blood', 0.42), 0.5, linear);
      ridersO2.forEach((g, i) => { const u = (flow + i / 5 + 0.03) % 1, [x, y] = cubic(TP[0], TP[1], TP[2], TP[3], u); tr(g, x, y - 2); op(g, oIn * Math.min(1, u * 8, (1 - u) * 8)); });
      ridersCO2.forEach((g, i) => { const u = (flow + i / 5 + 0.09) % 1, [x, y] = cubic(BP[0], BP[1], BP[2], BP[3], u); tr(g, x, y - 2); op(g, cOut * Math.min(1, u * 8, (1 - u) * 8)); });
      op(lbOx, oIn); op(lbCd, cOut);
      const ex = P(t, mid('blood', 0.74), 0.4, linear);
      exhale.forEach((g, i) => { const q = ((t - mid('blood', 0.74)) * 0.55 + i / 3) % 1; tr(g, 230 + Math.sin(q * 5 + i) * 8, 300 - q * 120, 0.8 + 0.3 * q); op(g, ex * Math.sin(q * Math.PI)); });
      airUp.set(P(t, mid('blood', 0.76), 0.6)); op(airUp, ex); op(lbOut, P(t, mid('blood', 0.8), 0.4, linear));
    }
  };
});
