/* Chapter 1: Breathing, gas exchange and respiration.
   Three panels, as in the topic diagram: Breathing (a person, with chest and lungs), Gas exchange (one air
   sac and its capillary), Respiration (a body cell with its mitochondrion).
   Beats: three muddled words settle as the panel headings -> breathing is ventilation, moving air -> done
   by the diaphragm and rib muscles, not a chemical reaction -> gas exchange: the air sac beside the blood
   -> oxygen into the blood, carbon dioxide out, by diffusion -> respiration in a cell: oxygen and glucose
   in, energy out -> the word equation -> showpiece: one oxygen molecule travels through all three panels
   (order, cells) -> breathing is not respiration: hold your breath, the cells keep respiring. */
scene('three', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;

  /* ---------- shared breathing art (same in every chapter of this lesson) ---------- */
  const SKIN = '#C98E62', SKINDK = '#9C6B45', SHIRT = '#5B8DEF', SHIRTDK = '#3F6FCC', HAIR = '#2B1D14';
  const TUBE = '#E9C7D2', TUBEDK = '#C99AAA', MUSCLE = '#D24B63', MUSCLELT = '#F59AAE', BONE = '#EFE6D2';
  const O2T = '#FF9A8F', GREY = '#9AA6B2', BLUE = '#8E5BB0', RED = '#FF5A64';

  /* The chest, front view, in "lungs units" (lib lungs at s=1 centred on 0,0). g.set(v): 0 relaxed, 1 in. */
  function chestArt(parent) {
    const g = G(parent);
    const lw = G(g);
    g.lungs = lungs(lw, 1);
    g.bands = G(g); g.ribs = G(g); g.dia = G(g);
    const R = [], B = [];
    for (const sg of [-1, 1]) for (let i = 0; i < 4; i++) B.push({ sg, i, el: E('path', { fill: MUSCLE, opacity: 0.5 }, g.bands) });
    g.bandEls = B.map(b => b.el);
    for (const sg of [-1, 1]) for (let i = 0; i < 5; i++) R.push({ sg, i, el: E('path', { fill: 'none', stroke: BONE, 'stroke-width': 9, 'stroke-linecap': 'round' }, g.ribs) });
    g.diaBody = E('path', { fill: 'none', stroke: MUSCLE, 'stroke-width': 16, 'stroke-linecap': 'round' }, g.dia);
    g.diaHi = E('path', { fill: 'none', stroke: MUSCLELT, 'stroke-width': 4, 'stroke-linecap': 'round', opacity: 0.85, transform: 'translate(0 -4)' }, g.dia);
    const rib = (sg, i, v) => { const y0 = -88 + 46 * i; return [[sg * 30, y0], [sg * (150 + 8 * i + 8 * v), y0 - 28 - 10 * v], [sg * (178 + 6 * i + 12 * v), y0 + 46 - 16 * v]]; };
    const f = n => n.toFixed(1);
    const q = r => `M${f(r[0][0])},${f(r[0][1])} Q${f(r[1][0])},${f(r[1][1])} ${f(r[2][0])},${f(r[2][1])}`;
    g.domeD = v => `M${f(-190 - 6 * v)},${f(205 - 4 * v)} C-120,${f(132 + 52 * v)} 120,${f(132 + 52 * v)} ${f(190 + 6 * v)},${f(205 - 4 * v)}`;
    g.set = v => {
      v = clamp(v);
      g.lungs.set(v);
      lw.setAttribute('transform', `translate(0 -150) scale(1 ${(1 + 0.1 * v).toFixed(4)}) translate(0 150)`);
      R.forEach(r => r.el.setAttribute('d', q(rib(r.sg, r.i, v))));
      B.forEach(b => { const a = rib(b.sg, b.i, v), c = rib(b.sg, b.i + 1, v); b.el.setAttribute('d', `${q(a)} L${f(c[2][0])},${f(c[2][1])} Q${f(c[1][0])},${f(c[1][1])} ${f(c[0][0])},${f(c[0][1])} Z`); });
      const d = g.domeD(v); g.diaBody.setAttribute('d', d); g.diaHi.setAttribute('d', d);
    };
    g.set(0);
    return g;
  }
  /* A person from the waist up, front view, round the chest (0,0) in chestArt units. g.puff(p) holds a breath. */
  function bust(parent) {
    const g = G(parent);
    for (const sg of [-1, 1]) E('path', { d: `M${sg * 196},-150 C${sg * 236},-90 ${sg * 246},40 ${sg * 244},380`, fill: 'none', stroke: SHIRTDK, 'stroke-width': 54, 'stroke-linecap': 'round' }, g);
    E('path', { d: 'M-40,-206 C-96,-206 -172,-202 -202,-166 C-224,-138 -226,-80 -222,-10 L-214,380 L214,380 L222,-10 C226,-80 224,-138 202,-166 C172,-202 96,-206 40,-206 Q0,-178 -40,-206 Z', fill: SHIRT }, g);
    E('rect', { x: -34, y: -270, width: 68, height: 80, rx: 14, fill: SKIN }, g);
    E('path', { d: 'M-40,-206 Q0,-178 40,-206', fill: 'none', stroke: SHIRTDK, 'stroke-width': 6, 'stroke-linecap': 'round' }, g);
    g.tube = G(g);
    E('path', { d: 'M0,-258 L0,-150', stroke: TUBE, 'stroke-width': 16, 'stroke-linecap': 'round' }, g.tube);
    for (let k = 0; k < 6; k++) E('line', { x1: -9, x2: 9, y1: -246 + k * 17, y2: -246 + k * 17, stroke: TUBEDK, 'stroke-width': 4 }, g.tube);
    g.chest = chestArt(g);
    const h = g.head = G(g);
    for (const sg of [-1, 1]) E('ellipse', { cx: sg * 78, cy: -330, rx: 14, ry: 22, fill: SKIN, stroke: SKINDK, 'stroke-width': 3 }, h);
    g.faceEl = E('ellipse', { cx: 0, cy: -335, rx: 78, ry: 86, fill: SKIN }, h);
    const puffs = [-1, 1].map(sg => E('ellipse', { cx: sg * 60, cy: -300, rx: 22, ry: 20, fill: SKIN }, h));
    E('path', { d: 'M-80,-330 C-92,-404 -34,-430 6,-428 C56,-426 94,-398 82,-330 C72,-366 38,-384 -2,-378 C-38,-374 -66,-358 -80,-330 Z', fill: HAIR }, h);
    for (const sg of [-1, 1]) { E('circle', { cx: sg * 28, cy: -340, r: 8, fill: '#2A1D14' }, h); E('circle', { cx: sg * 28 + 2.5, cy: -343, r: 2.6, fill: '#FFFFFF' }, h); }
    E('path', { d: 'M-6,-318 Q0,-308 6,-318', fill: 'none', stroke: SKINDK, 'stroke-width': 4, 'stroke-linecap': 'round' }, h);
    const cheeks = [-1, 1].map(sg => E('ellipse', { cx: sg * 47, cy: -304, rx: 14, ry: 9, fill: '#E8848A', opacity: 0.45 }, h));
    const smile = E('path', { d: 'M-22,-292 Q0,-276 22,-292', fill: 'none', stroke: '#5A2A22', 'stroke-width': 5, 'stroke-linecap': 'round' }, h);
    const shut = E('path', { d: 'M-11,-289 L11,-289', fill: 'none', stroke: '#5A2A22', 'stroke-width': 5, 'stroke-linecap': 'round' }, h);
    g.puff = p => {
      p = clamp(p);
      attr(g.faceEl, 'rx', 78 + 6 * p);
      puffs.forEach((e, i) => { op(e, p); attr(e, 'cx', (i ? 1 : -1) * (58 + 8 * p)); attr(e, 'rx', 16 + 10 * p); attr(e, 'ry', 14 + 8 * p); });
      cheeks.forEach((e, i) => { attr(e, 'cx', (i ? 1 : -1) * (47 + 14 * p)); attr(e, 'rx', 14 + 4 * p); });
      op(smile, 1 - p); op(shut, p);
    };
    g.puff(0);
    return g;
  }

  /* ---------- local helpers ---------- */
  /* dense points along the same smooth curve openPath() draws */
  function spline(pts, per) {
    const out = [pts[0]], n = pts.length;
    for (let i = 0; i < n - 1; i++) {
      const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(n - 1, i + 2)];
      const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6], c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      for (let k = 1; k <= per; k++) { const u = k / per, v = 1 - u; out.push([v * v * v * p1[0] + 3 * v * v * u * c1[0] + 3 * v * u * u * c2[0] + u * u * u * p2[0], v * v * v * p1[1] + 3 * v * v * u * c1[1] + 3 * v * u * u * c2[1] + u * u * u * p2[1]]); }
    }
    return out;
  }
  /* a polyline with arc-length lookups: at(u) -> [x, y, angle], near(point) -> u */
  function track(pts) {
    const L = [0];
    for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    const tot = L[L.length - 1];
    return {
      at(u) { const d = clamp(u) * tot; let i = 1; while (i < L.length - 1 && L[i] < d) i++; const k = (d - L[i - 1]) / ((L[i] - L[i - 1]) || 1), a = pts[i - 1], b = pts[i]; return [lerp(a[0], b[0], k), lerp(a[1], b[1], k), Math.atan2(b[1] - a[1], b[0] - a[0])]; },
      near(p) { let bi = 0, bd = 1e9; pts.forEach((q, i) => { const d = Math.hypot(q[0] - p[0], q[1] - p[1]); if (d < bd) { bd = d; bi = i; } }); return L[bi] / tot; },
      d: 'M' + pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' L'),
    };
  }
  function along(pts, u) {
    let L = 0; const seg = [];
    for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(l); L += l; }
    let d = clamp(u) * L;
    for (let i = 0; i < seg.length; i++) { if (d <= seg[i] || i === seg.length - 1) { const k = seg[i] ? clamp(d / seg[i]) : 0; return [lerp(pts[i][0], pts[i + 1][0], k), lerp(pts[i][1], pts[i + 1][1], k)]; } d -= seg[i]; }
    return pts[pts.length - 1];
  }
  const hex = c => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16));
  const mix = (a, b, p) => { const A = hex(a), B = hex(b); return `rgb(${A.map((v, i) => Math.round(lerp(v, B[i], clamp(p)))).join(',')})`; };
  const polar = (c, r, deg) => [c[0] + r * Math.cos(deg * Math.PI / 180), c[1] + r * Math.sin(deg * Math.PI / 180)];
  function rich(parent, x, y, segs, o) {
    o = o || {};
    const t = E('text', { x, y, 'font-size': o.size || 30, 'font-weight': o.weight || 600, 'font-family': FD, 'text-anchor': o.anchor || 'start', fill: o.fill || C.ink }, parent);
    segs.forEach(s => { if (typeof s === 'string') s = [s]; E('tspan', { fill: s[1], 'font-weight': s[2] }, t).textContent = s[0]; });
    return t;
  }
  function bloodGrad(id, x1, y1, x2, y2, c1, c2) {
    const lg = E('linearGradient', { id, gradientUnits: 'userSpaceOnUse', x1, y1, x2, y2 }, defs());
    E('stop', { offset: 0, 'stop-color': c1 }, lg); E('stop', { offset: 0.35, 'stop-color': c1 }, lg); E('stop', { offset: 1, 'stop-color': c2 }, lg);
    return `url(#${id})`;
  }
  function vessel(parent, tk, grad) {
    E('path', { d: tk.d, fill: 'none', stroke: '#4A1E3A', 'stroke-width': 34, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, parent);
    E('path', { d: tk.d, fill: 'none', stroke: grad, 'stroke-width': 27, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, parent);
  }
  function rbcEl(parent) {
    const g = G(parent);
    g.disc = E('ellipse', { rx: 9.5, ry: 6.5, stroke: '#FFC9CD', 'stroke-width': 1.3 }, g);
    E('ellipse', { rx: 4, ry: 2.4, fill: '#000000', opacity: 0.18 }, g);
    return g;
  }
  const dot = (parent, col, rim, r) => E('circle', { r: r || 7, fill: col, stroke: rim, 'stroke-width': 1.6 }, parent);

  /* ================= the three panels ================= */
  const PX = [220, 600, 980], PW = 340, PT = 118, PB = 580, HY = 152;
  const COL = [C.air, C.good, C.energy];
  const NAMES = ['breathing', 'gas exchange', 'respiration'];
  const panels = PX.map((x, i) => {
    const g = G(root);
    card(g, x - PW / 2, PT, PW, PB - PT, { fill: C.card, stroke: C.line });
    const edge = E('rect', { x: x - PW / 2, y: PT, width: PW, height: PB - PT, rx: 22, fill: 'none', stroke: COL[i], 'stroke-width': 3 }, g);
    const id = 'br-three-clip' + i, cp = E('clipPath', { id }, defs());
    E('rect', { x: x - PW / 2 + 3, y: 216, width: PW - 6, height: PB - 219, rx: 19 }, cp);
    const art = G(g, { 'clip-path': `url(#${id})` });
    return { g, edge, art, x };
  });
  const subs = [
    T(panels[0].g, PX[0], 204, 'ventilation = moving air', { size: 26, weight: 600, anchor: 'middle', fill: C.air }),
    T(panels[1].g, PX[1], 204, 'swapping gases', { size: 26, weight: 600, anchor: 'middle', fill: C.good }),
    T(panels[2].g, PX[2], 204, 'a chemical reaction', { size: 26, weight: 600, anchor: 'middle', fill: C.energy }),
  ];

  /* ----- panel 1: a person breathing ----- */
  const A1 = G(panels[0].art);
  const BX = 220, BY = 440, BS = 0.5;
  const pers = G(A1); const bu = bust(pers); tr(pers, BX, BY, BS);
  const ch = bu.chest;
  const diaGlow = E('ellipse', { cx: 0, cy: 182, rx: 250, ry: 64, fill: glow(C.energy) }, ch); ch.insertBefore(diaGlow, ch.dia);
  const ribGlow = [-1, 1].map(sg => { const e = E('ellipse', { cx: sg * 158, cy: 8, rx: 92, ry: 170, fill: glow(C.energy) }, ch); ch.insertBefore(e, ch.bands); return e; });
  const stS = (x, y) => [BX + x * BS, BY + y * BS];
  // air that moves with the breath: in through the mouth, down the windpipe, into the lungs
  const AIRP = [[[150, -306], [40, -294], [0, -290], [0, -250], [0, -150], [0, -60], [-46, -22], [-80, 30]],
    [[150, -306], [40, -294], [0, -290], [0, -250], [0, -150], [0, -60], [46, -22], [80, 30]]].map(p => p.map(q => stS(q[0], q[1])));
  const airDots = [0, 1, 2, 3, 4].map(() => E('circle', { r: 5.5, fill: C.air, stroke: '#FFFFFF', 'stroke-width': 1.5 }, A1));
  const arIn = arrow(A1, 354, 280, 272, 294, { color: C.air, width: 6 });
  const arOut = arrow(A1, 272, 310, 354, 326, { color: C.air, width: 6 });
  const heldG = G(A1); tr(heldG, 312, 248);
  E('circle', { r: 22, fill: 'rgba(10,27,39,0.85)', stroke: C.air, 'stroke-width': 3 }, heldG);
  E('rect', { x: -9, y: -10, width: 6, height: 20, rx: 2, fill: C.air }, heldG); E('rect', { x: 3, y: -10, width: 6, height: 20, rx: 2, fill: C.air }, heldG);

  /* ----- panel 2: an air sac and its capillary ----- */
  const A2 = G(panels[1].art);
  const SC = [570, 400], SR = 82;
  E('path', { d: 'M430,336 L490,363', stroke: TUBEDK, 'stroke-width': 30, 'stroke-linecap': 'round' }, A2);
  E('path', { d: 'M430,336 L490,363', stroke: TUBE, 'stroke-width': 24, 'stroke-linecap': 'round' }, A2);
  const cap2 = track(spline([[436, 548], [500, 520], [570, 502], [627, 482], [662, 440], [671, 390], [660, 340], [684, 290], [730, 255], [780, 240]], 10));
  vessel(A2, cap2, bloodGrad('br-three-b2', 440, 548, 760, 240, BLUE, '#E8424F'));
  E('circle', { cx: SC[0], cy: SC[1], r: SR, fill: 'rgba(159,216,255,0.16)', stroke: '#BFE6FF', 'stroke-width': 4 }, A2);
  const lblAir = T(A2, 562, 352, 'air', { size: 28, weight: 700, anchor: 'middle', fill: C.air });
  const lblBlood = G(A2);
  E('line', { x1: 668, y1: 530, x2: 634, y2: 500, stroke: C.muted, 'stroke-width': 2.5 }, lblBlood);
  E('circle', { cx: 634, cy: 500, r: 4, fill: C.muted }, lblBlood);
  T(lblBlood, 674, 552, 'blood', { size: 28, weight: 700, fill: '#FF8A94' });
  const V = 0.09;                                     // blood speed (track lengths per second)
  const rbc2 = [0, 1, 2, 3, 4, 5].map(() => rbcEl(A2));
  const RH = [[528, 392], [556, 418], [590, 382], [612, 420], [540, 452], [575, 456], [606, 452], [520, 424]];
  const GH = [[548, 382], [604, 392], [530, 440], [565, 425], [628, 430], [590, 428]];
  // oxygen dots cross into the blood, downstream ones first so they spread out as the blood carries them off
  const reds = RH.map((h, k) => {
    const el = dot(A2, C.oxygen, '#FFC2BA');
    if (k >= 5) return { el, h, k };
    const th = [-5, 15, 35, 55, 75][k], wIn = polar(SC, 72, th), cp = polar(SC, 102, th), u0 = cap2.near(cp);
    return { el, h, k, tc: mid('swap', 0.04 + 0.06 * k), wIn, cp: cap2.at(u0), u0 };
  });
  // carbon dioxide dots arrive spaced out in the blood, and each leaves it as it reaches the air sac
  const TS = mid('swap', 0.38);
  const greys = GH.map((h, k) => {
    const el = dot(A2, GREY, '#D5DDE4', 6.5);
    const uS = 0.45 - 0.065 * k, u0 = [0.47, 0.5, 0.44, 0.48, 0.46, 0.5][k], c = cap2.at(u0);
    const dx = c[0] - SC[0], dy = c[1] - SC[1], L = Math.hypot(dx, dy);
    return { el, h, k, tx: TS + (u0 - uS) / V, wIn: [SC[0] + dx / L * 72, SC[1] + dy / L * 72], cp: c, u0 };
  });

  /* ----- panel 3: a body cell, fed by a capillary ----- */
  const A3 = G(panels[2].art);
  const cap3 = track(spline([[808, 240], [846, 262], [862, 320], [866, 400], [860, 480], [842, 548], [826, 600]], 10));
  vessel(A3, cap3, bloodGrad('br-three-b3', 808, 240, 826, 600, '#E8424F', BLUE));
  const rbc3 = [0, 1, 2, 3].map(() => rbcEl(A3));
  const cellG = G(A3);
  const cell = animalCell(cellG, 122, 104, { sw: 5, seed: 8, nx: -62, ny: -36, nr: 26 }); tr(cell, 1012, 410);
  const mito = mitochondrion(cell.inner, 118, 52, { glow: true }); tr(mito, 40, 40, 1, -12);
  const MITO = [1052, 450];
  const rGlu = molGlucose(A3, 20), rO2 = molO2(A3, 11);
  const sp = spark(A3, 22, { seed: 4 });
  const lblCell = T(A3, 1040, 548, 'body cell', { size: 26, weight: 600, anchor: 'middle', fill: C.cell });

  /* ----- headings: three muddled words that settle into place ----- */
  const heads = NAMES.map((n, i) => chip(root, n, { size: 30, fill: '#0E2836', stroke: COL[i], sw: 3, color: COL[i] }));
  const nums = heads.map((h, i) => { const g = G(root); E('circle', { r: 18, fill: C.energy }, g); T(g, 0, 8, String(i + 1), { size: 24, weight: 700, anchor: 'middle', fill: C.bg0 }); return { g, x: PX[i] - h.w / 2 - 28 }; });

  /* ----- links between the panels ----- */
  const L12 = [arrow(root, 394, 340, 426, 340, { color: C.faint, width: 6 }), arrow(root, 394, 340, 426, 340, { color: C.energy, width: 6 })];
  const L23 = [arrow(root, 776, 240, 806, 240, { color: C.faint, width: 6 }), arrow(root, 776, 240, 806, 240, { color: C.energy, width: 6 })];

  /* ----- the bottom band ----- */
  const marks = G(root);
  const mChip = chip(marks, 'easy marks', { size: 30, fill: 'rgba(86,214,155,0.14)', stroke: C.good, color: C.good }); tr(mChip, 600, 650);
  const mTick = tick(marks, 16); tr(mTick, 600 + mChip.w / 2 + 34, 650);
  const b1 = G(root), b1a = G(b1), b1b = G(b1);
  const c1a = chip(b1a, 'just moves air', { size: 28, fill: '#0E2836', stroke: C.air, color: C.ink }); tr(c1a, 205, 630);
  const t1a = tick(b1a, 14); tr(t1a, 205 + c1a.w / 2 + 28, 630);
  const c1b = chip(b1b, 'chemical reaction?', { size: 28, fill: '#0E2836', stroke: C.line, color: C.muted }); tr(c1b, 205, 694);
  const x1b = cross(b1b, 14); tr(x1b, 205 + c1b.w / 2 + 28, 694);
  const b2 = G(root);
  const c2 = chip(b2, '', { size: 28, fill: 'rgba(86,214,155,0.12)', stroke: C.good, w: 230 }); tr(c2, 600, 640);
  rich(b2, 600, 650, ['by ', ['diffusion', C.good, 800]], { size: 30, anchor: 'middle' });
  // the word equation
  const eqG = G(root);
  const EQ = [
    { text: 'glucose', fill: C.glucose, color: '#3A2600', f: 0.2 }, { op: '+', f: 0.29 },
    { text: 'oxygen', fill: C.oxygen, color: '#FFFFFF', f: 0.32 }, { op: '→', f: 0.45 },
    { text: 'carbon dioxide', fill: C.co2, color: '#10202B', f: 0.49 }, { op: '+', f: 0.66 },
    { text: 'water', fill: C.water, color: '#06283A', f: 0.7 }, { text: '(+ energy)', fill: C.energy, color: '#3A3000', f: 0.8 },
  ].map(sp_ => {
    const p = Object.assign({}, sp_);
    if (sp_.op) { p.g = G(eqG); if (sp_.op === '+') T(p.g, 0, 14, '+', { size: 42, weight: 600, anchor: 'middle', fill: C.muted }); else arrow(p.g, -24, 0, 24, 0, { color: C.ink, width: 6 }); p.w = sp_.op === '+' ? 34 : 56; }
    else { p.g = chip(eqG, sp_.text, { size: 28, fill: sp_.fill, color: sp_.color }); p.w = p.g.w; }
    return p;
  });
  { const GAP = 10; let tot = 0; EQ.forEach((p, i) => { tot += p.w + (i ? GAP : 0); }); let x = 600 - tot / 2; EQ.forEach((p, i) => { if (i) x += GAP; p.x = x + p.w / 2; x += p.w; }); }
  // breathing is not respiration
  const ban = G(root);
  E('rect', { x: 318, y: 610, width: 564, height: 60, rx: 30, fill: 'rgba(10,27,39,0.9)', stroke: C.energy, 'stroke-width': 3 }, ban);
  rich(ban, 600, 652, [['breathing', C.air, 700], ['  ≠  ', C.energy, 700], ['respiration', C.energy, 700]], { size: 36, anchor: 'middle' });
  const n1 = G(root); T(n1, 220, 706, 'breathing stops', { size: 27, weight: 600, anchor: 'middle', fill: C.air });
  const n3 = G(root); T(n3, 966, 706, 'cells keep respiring', { size: 27, weight: 600, anchor: 'middle', fill: C.energy });
  const n3t = tick(n3, 13); tr(n3t, 966 + textWidth('cells keep respiring', 27, FD, 600) / 2 + 26, 697);

  /* ----- the showpiece: one oxygen molecule through all three panels ----- */
  const heroRBC = G(root);
  const hrHalo = E('circle', { r: 24, fill: glow('#FF8A94') }, heroRBC);
  const hr = rbcEl(heroRBC); tr(hr, 0, 0, 1.2);
  const heroO2 = G(root);
  E('circle', { r: 30, fill: glow('#FFFFFF') }, heroO2);
  molO2(heroO2, 12);
  const MOUTH = stS(0, -290), LUNG = stS(84, 36);
  const PA = [[380, 262], [304, 280], [240, 292], MOUTH];
  const PBp = [MOUTH, stS(0, -250), stS(0, -150), stS(0, -60), stS(46, -22), LUNG];
  const PC = [LUNG, [318, 410], [394, 340], [426, 340], [442, 341], [490, 363]];
  const WALL = polar(SC, 74, 40), uMeet = cap2.near(polar(SC, 102, 40)), MEET = cap2.at(uMeet);
  const PD = [[490, 363], [540, 395], [594, 426], WALL];
  const tA0 = mid('order', 0.2), tA1 = mid('order', 0.32), tB1 = mid('order', 0.55), tC0 = mid('order', 0.58), tC1 = mid('order', 0.68), tD1 = mid('order', 0.8), tE1 = mid('order', 0.86);
  const VF = 0.3, tX = tE1 + (1 - uMeet) / VF, tL = tX + 0.35;
  const uRel = cap3.near([866, 400]), tR = tL + uRel / 0.32, tM = tR + 1.1;
  const CELLIN = [896, 404];

  /* ----- the panel-1 breath: idle, one deep breath for "order", then held ----- */
  function breath(t) {
    const base = wave(t, 3.4, 0.5);
    const wo = win(t, mid('order', 0.12), end('order') + 0.3, 0.5);
    const so = P(t, mid('order', 0.18), 1.8) * (1 - P(t, mid('order', 0.64), 1.6));
    const wn = P(t, mid('notsame', 0.3), 0.8);
    return lerp(lerp(base, so, wo), 0.92, wn) * AMP;
  }

  return t => {
    /* --- panels and headings --- */
    const settle = [mid('muddle', 0.33), mid('muddle', 0.43), mid('muddle', 0.53)];
    const lit = [win(t, at('breathing') - 0.2, at('gasex') - 0.1, 0.4), win(t, at('gasex') - 0.1, at('resp') - 0.1, 0.4), win(t, at('resp') - 0.1, at('order') - 0.1, 0.4)];
    const dimOf = i => Math.max(lit[(i + 1) % 3], lit[(i + 2) % 3], i === 1 ? P(t, mid('notsame', 0.1), 0.6, linear) : 0);
    panels.forEach((p, i) => {
      op(p.g, P(t, settle[i] + 0.15, 0.6, linear) * (1 - 0.55 * dimOf(i)));
      op(p.edge, lit[i] * (0.55 + 0.35 * wave(t, 2.2)));
    });
    heads.forEach((c, i) => {
      const a0 = P(t, S.first - 0.1, 0.6, pop);
      const ang = t * 1.5 * AMP + i * TAU / 3;
      const ox = 600 + Math.cos(ang) * 130, oy = 380 + Math.sin(ang * 1.3) * 64;
      const p = P(t, settle[i], 0.8);
      tr(c, lerp(ox, PX[i], p), lerp(oy, HY, p), Math.max(0.01, lerp(1.3 * a0, 1, p)), lerp(Math.sin(t * 2.2 + i * 2) * 16 * AMP, 0, p));
      op(c, clamp(a0 * 2) * (1 - 0.55 * dimOf(i)));
    });
    subs.forEach((s, i) => op(s, P(t, [mid('breathing', 0.26), mid('gasex', 0.22), mid('resp', 0.18)][i], 0.5, linear)));
    nums.forEach((n, i) => { const p = P(t, mid('order', 0.02 + 0.05 * i), 0.5, pop); op(n.g, clamp(p * 2)); tr(n.g, n.x, HY, Math.max(0.01, p)); });

    /* --- panel 1 --- */
    const f1 = P(t, at('breathing') - 0.15, 0.6, linear);
    op(A1, f1);
    if (f1 > 0) {
      const br = breath(t), dv = (br - breath(t - 0.12)) / 0.12;
      ch.set(br);
      const mus = P(t, mid('muscles', 0.12), 0.6, linear);
      op(ch.ribs, 0.3 + 0.7 * mus); op(ch.bands, 0.3 + 0.7 * mus); op(ch.dia, 0.4 + 0.6 * mus);
      const hD = win(t, mid('muscles', 0.15), at('gasex'), 0.4), hR = win(t, mid('muscles', 0.31), at('gasex'), 0.4);
      const bk = br / AMP;
      op(diaGlow, hD * (0.45 + 0.55 * bk)); ribGlow.forEach(e => op(e, hR * (0.35 + 0.5 * bk)));
      ch.bandEls.forEach(e => e.setAttribute('opacity', (0.5 + 0.4 * hR * (0.4 + 0.6 * bk)).toFixed(3)));
      airDots.forEach((d, k) => {
        const u = bk * 0.92 + 0.08 - 0.13 * k, [x, y] = along(AIRP[k % 2], u);
        attr(d, 'cx', x); attr(d, 'cy', y); op(d, clamp((u - 0.04) * 10) * clamp((1.02 - u) * 12));
      });
      op(arIn, 0.12 + 0.88 * clamp(dv * 2.4)); op(arOut, 0.12 + 0.88 * clamp(-dv * 2.4));
      const hold = P(t, mid('notsame', 0.37), 0.5);
      bu.puff(hold);
      op(heldG, P(t, mid('notsame', 0.5), 0.4, linear));
    }
    op(marks, win(t, mid('muddle', 0.76), at('breathing') - 0.1, 0.4));
    const fb1 = 1 - P(t, at('gasex') - 0.2, 0.4, linear);
    op(b1a, P(t, mid('muscles', 0.6), 0.4, linear) * fb1);
    op(b1b, P(t, mid('muscles', 0.74), 0.4, linear) * fb1);
    const xp = P(t, mid('muscles', 0.86), 0.4, pop); op(x1b, clamp(xp * 2)); tr(x1b, 205 + c1b.w / 2 + 28, 694, Math.max(0.01, xp));

    /* --- panel 2 --- */
    const f2 = P(t, at('gasex') - 0.1, 0.6, linear);
    op(A2, f2);
    if (f2 > 0) {
      rbc2.forEach((e, k) => {
        const u = (t * V + k / 6) % 1, [x, y, a] = cap2.at(u);
        tr(e, x, y, 1, a * 180 / Math.PI); e.disc.setAttribute('fill', mix(BLUE, RED, (u - 0.3) / 0.35)); op(e, Math.min(1, u * 14, (1 - u) * 14));
      });
      const jig = (k, s) => [Math.sin(t * 1.9 + k * 1.7) * 4 * s * AMP, Math.cos(t * 1.6 + k * 2.3) * 4 * s * AMP];
      reds.forEach(r => {
        const [jx, jy] = jig(r.k, 1);
        if (r.tc === undefined || t < r.tc) { attr(r.el, 'cx', r.h[0] + jx); attr(r.el, 'cy', r.h[1] + jy); op(r.el, 1); return; }
        const d = t - r.tc;
        if (d < 0.6) { const p = ease(d / 0.6); attr(r.el, 'cx', lerp(r.h[0] + jx, r.wIn[0], p)); attr(r.el, 'cy', lerp(r.h[1] + jy, r.wIn[1], p)); op(r.el, 1); }
        else if (d < 0.9) { const p = ease((d - 0.6) / 0.3); attr(r.el, 'cx', lerp(r.wIn[0], r.cp[0], p)); attr(r.el, 'cy', lerp(r.wIn[1], r.cp[1], p)); op(r.el, 1); }
        else { const u = r.u0 + V * (d - 0.9), [x, y] = cap2.at(u); attr(r.el, 'cx', x); attr(r.el, 'cy', y - 3); op(r.el, clamp((1 - u) * 14)); }
      });
      greys.forEach(g => {
        const d = t - g.tx;
        if (d < 0) { const u = g.u0 + V * d, [x, y] = cap2.at(u); attr(g.el, 'cx', x); attr(g.el, 'cy', y + 3); op(g.el, clamp(u * 14)); return; }
        op(g.el, 1);
        const [jx, jy] = jig(g.k + 9, P(t, g.tx + 1.0, 0.6, linear));
        if (d < 0.35) { const p = ease(d / 0.35); attr(g.el, 'cx', lerp(g.cp[0], g.wIn[0], p)); attr(g.el, 'cy', lerp(g.cp[1] + 3, g.wIn[1], p)); }
        else { const p = ease(clamp((d - 0.35) / 0.65)); attr(g.el, 'cx', lerp(g.wIn[0], g.h[0], p) + jx); attr(g.el, 'cy', lerp(g.wIn[1], g.h[1], p) + jy); }
      });
      op(lblAir, P(t, mid('gasex', 0.6), 0.4, linear));
      op(lblBlood, P(t, mid('gasex', 0.86), 0.4, linear));
    }
    op(b2, win(t, mid('swap', 0.84), at('resp') - 0.1, 0.4));

    /* --- panel 3 --- */
    const f3 = P(t, at('resp') - 0.1, 0.6, linear);
    op(A3, f3);
    if (f3 > 0) {
      cell.upd(t); mito.upd(t);
      rbc3.forEach((e, k) => {
        const u = (t * V * 1.15 + k / 4) % 1, [x, y, a] = cap3.at(u);
        tr(e, x, y, 1, a * 180 / Math.PI); e.disc.setAttribute('fill', mix(RED, BLUE, (u - 0.25) / 0.4)); op(e, Math.min(1, u * 14, (1 - u) * 14));
      });
      // oxygen and glucose leave the blood, enter the cell and reach the mitochondrion
      [[rO2, [866, 384], mid('resp', 0.56)], [rGlu, [866, 438], mid('resp', 0.64)]].forEach(([m, from, t0]) => {
        const u = clamp((t - t0) / 1.4);
        if (u <= 0 || u >= 1) { op(m, 0); return; }
        const [x, y] = along([from, CELLIN, [966, 430], MITO], ease(u));
        tr(m, x, y, 1 - 0.45 * P(u, 0.75, 0.25, linear), u * 80); op(m, Math.min(1, u * 8, (1 - u) * 5));
      });
      const s0 = P(t, mid('resp', 0.8), 0.5, pop);
      const flash = Math.sin(Math.PI * clamp((t - tM) / 0.8));
      const pulse = Math.pow(wave(t, 1.5), 6) * P(t, mid('resp', 0.9), 0.5, linear);
      tr(sp, MITO[0], MITO[1], Math.max(0.01, s0 * (0.9 + 0.3 * pulse * AMP + 0.7 * flash)));
      op(sp, clamp(s0 * 2)); sp.upd(t);
      op(lblCell, P(t, mid('resp', 0.3), 0.4, linear));
    }

    /* --- the word equation --- */
    const fE = win(t, at('eq') - 0.1, at('order') - 0.1, 0.4);
    op(eqG, fE);
    if (fE > 0) EQ.forEach(p => { const a = P(t, mid('eq', p.f), 0.5, pop); op(p.g, clamp(a * 2)); tr(p.g, p.x, 652, Math.max(0.01, 0.7 + 0.3 * a)); });

    /* --- the showpiece --- */
    let hx = 0, hy = 0, hOn = 0;
    if (t >= tA0 - 0.3 && t < tM + 0.6) {
      hOn = Math.min(P(t, tA0 - 0.3, 0.3, linear), 1 - P(t, tM, 0.5, linear));
      if (t < tA1) [hx, hy] = along(PA, ease(clamp((t - tA0) / (tA1 - tA0))));
      else if (t < tB1) [hx, hy] = along(PBp, ease((t - tA1) / (tB1 - tA1)));
      else if (t < tC0) [hx, hy] = LUNG;
      else if (t < tC1) [hx, hy] = along(PC, ease((t - tC0) / (tC1 - tC0)));
      else if (t < tD1) [hx, hy] = along(PD, ease((t - tC1) / (tD1 - tC1)));
      else if (t < tE1) { const p = ease((t - tD1) / (tE1 - tD1)); hx = lerp(WALL[0], MEET[0], p); hy = lerp(WALL[1], MEET[1], p) - 10 * p; }
    }
    // the red blood cell that carries it
    let rx = 0, ry = 0, ra = 0, rOn = 0;
    const uH = t < tE1 ? uMeet - V * (tE1 - t) : uMeet + VF * (t - tE1);
    if (t < tX) { if (uH > 0) { [rx, ry, ra] = cap2.at(uH); rOn = clamp(uH * 14); } }
    else if (t < tL) { const p = (t - tX) / (tL - tX), a = cap2.at(1), b = cap3.at(0); rx = lerp(a[0], b[0], p); ry = lerp(a[1], b[1], p); rOn = 1; }
    else { const u3 = t < tR ? 0.32 * (t - tL) : uRel + V * (t - tR); if (u3 < 1) { [rx, ry, ra] = cap3.at(u3); rOn = clamp((1 - u3) * 10); } }
    const rbcShow = rOn * P(t, at('order'), 0.5, linear) * (1 - P(t, tR + 2.5, 0.6, linear));
    op(heroRBC, rbcShow);
    if (rbcShow > 0) {
      tr(heroRBC, rx, ry, 1, ra * 180 / Math.PI);
      const red = t < tE1 ? clamp((uH - 0.3) / 0.35) * 0.4 : t < tR ? lerp(0.4, 1, P(t, tE1, 0.4, linear)) : 1 - 0.8 * P(t, tR, 1.2, linear);
      hr.disc.setAttribute('fill', mix(BLUE, RED, red));
      op(hrHalo, P(t, tE1 - 0.6, 0.4, linear));
    }
    if (t >= tE1 && t < tR) { hx = rx; hy = ry - 11; }
    else if (t >= tR && t < tM + 0.6) { const p = ease(clamp((t - tR) / (tM - tR))); [hx, hy] = along([[rx, ry - 11], CELLIN, [968, 432], MITO], p); }
    op(heroO2, hOn);
    if (hOn > 0) tr(heroO2, hx, hy, 1 - 0.4 * P(t, tM - 0.2, 0.6, linear), (t - tA0) * 40);
    const l12 = win(t, tC0 - 0.15, tC1 + 0.5, 0.25), l23 = win(t, tX - 0.25, tL + 0.5, 0.25);
    const lk = P(t, mid('order', 0.1), 0.5, linear);
    op(L12[0], P(t, settle[1] + 0.5, 0.5, linear) * (0.5 + 0.5 * lk)); op(L23[0], P(t, settle[2] + 0.5, 0.5, linear) * (0.5 + 0.5 * lk));
    op(L12[1], l12); op(L23[1], l23);

    /* --- breathing is not respiration --- */
    const fN = P(t, mid('notsame', 0.04), 0.5, easeOut);
    op(ban, fN); tr(ban, 0, (1 - fN) * 16);
    op(n1, P(t, mid('notsame', 0.52), 0.4, linear));
    op(n3, P(t, mid('notsame', 0.74), 0.4, linear));
  };
});
