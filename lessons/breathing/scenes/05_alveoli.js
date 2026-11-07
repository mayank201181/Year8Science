/* Alveoli: built for fast gas exchange.
   Beats: the working alveolus close-up, "faster diffusion" -> the three factors (area, distance, gradient)
   -> showpiece: a cluster of alveoli unfolds into a sheet the size of a badminton court (about 70 m²)
   -> zoom on the wall: two walls, each one cell thick -> a dot hops across in a blink
   -> a moist lining where gases dissolve -> a rich blood supply keeps the gradient steep
   -> ventilation keeps it steep too -> TIMS -> a red blood cell loads up in under a second.
   The close-up is the same art as the exchange chapter (see 04_exchange.js for the spec). Adaptation
   tiles collect in the right-hand column as each one is introduced, then line up to spell TIMS. */
scene('alveoli', S => {
  const { at, end, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;

  /* ---------- palette and helpers (as in the exchange chapter) ---------- */
  const SAC = '#1E4256', SAC_WALL = '#BFE6FA', TISSUE = '#E9BDC9', LUMEN = '#142634';
  const PL_BLUE = [88, 77, 156], PL_RED = [163, 48, 62], RBC_BLUE = [146, 108, 220], RBC_RED = [240, 74, 87];
  const O2C = C.oxygen, O2D = C.oxygenDk, CO2C = '#B9C9D8', CO2D = '#71828F';
  const rgb = (a, b, p) => `rgb(${Math.round(lerp(a[0], b[0], p))},${Math.round(lerp(a[1], b[1], p))},${Math.round(lerp(a[2], b[2], p))})`;
  const hash = (a, b, c) => { const x = Math.sin(a * 12.9898 + b * 78.233 + c * 37.719) * 43758.5453; return x - Math.floor(x); };
  const dotO = (parent, r) => E('circle', { r: r || 7, fill: ball(O2C, O2D) }, parent);
  const dotC = (parent, r) => E('circle', { r: r || 7, fill: ball(CO2C, CO2D) }, parent);
  const place = (el, x, y) => { attr(el, 'cx', x); attr(el, 'cy', y); };
  function leader(parent, x1, y1, x2, y2, color) {
    const g = G(parent);
    E('line', { x1, y1, x2, y2, stroke: color || C.muted, 'stroke-width': 3, 'stroke-linecap': 'round' }, g);
    E('circle', { cx: x2, cy: y2, r: 5, fill: color || C.muted }, g);
    return g;
  }
  const beat = (t, a, b) => win(t, a, b, 0.4);

  /* ===== the alveolus close-up (identical to 04_exchange.js), running in its steady state ===== */
  const O = [460, 420], RS = 190, RC = 232, CW = 70, BW = 62, BY0 = 312, BY1 = 382, BYC = 347, V = 90;
  const PH0 = 62 * Math.PI / 180, PH1 = -40 * Math.PI / 180;
  const arcPt = ph => [O[0] + RC * Math.cos(ph), O[1] + RC * Math.sin(ph)];
  const upDir = ph => [Math.sin(ph), -Math.cos(ph)];
  const bez3 = (a, b, c, d, u) => { const v = 1 - u; return [v * v * v * a[0] + 3 * v * v * u * b[0] + 3 * v * u * u * c[0] + u * u * u * d[0], v * v * v * a[1] + 3 * v * v * u * b[1] + 3 * v * u * u * c[1] + u * u * u * d[1]]; };
  const CP = [];
  {
    const a0 = arcPt(PH0), d0 = upDir(PH0), a1 = arcPt(PH1), d1 = upDir(PH1);
    for (let i = 0; i < 24; i++) CP.push(bez3([428, 800], [446, 742], [a0[0] - d0[0] * 64, a0[1] - d0[1] * 64], a0, i / 24));
    for (let i = 0; i <= 44; i++) CP.push(arcPt(lerp(PH0, PH1, i / 44)));
    for (let i = 1; i <= 24; i++) CP.push(bez3(a1, [a1[0] + d1[0] * 64, a1[1] + d1[1] * 64], [622, 120], [626, -50], i / 24));
  }
  const CUM = [0];
  for (let i = 1; i < CP.length; i++) CUM.push(CUM[i - 1] + Math.hypot(CP[i][0] - CP[i - 1][0], CP[i][1] - CP[i - 1][1]));
  const LEN = CUM[CUM.length - 1], SA0 = CUM[24], SA1 = CUM[68], ARC = SA1 - SA0;
  const LUT = [], NL = Math.ceil(LEN / 2) + 1;
  for (let k = 0, j = 0; k < NL; k++) {
    const s = Math.min(LEN, k * 2);
    while (j < CP.length - 2 && CUM[j + 1] < s) j++;
    const a = CP[j], b = CP[j + 1], L = (CUM[j + 1] - CUM[j]) || 1, f = clamp((s - CUM[j]) / L);
    LUT.push([lerp(a[0], b[0], f), lerp(a[1], b[1], f), (b[0] - a[0]) / L, (b[1] - a[1]) / L]);
  }
  const capPt = (s, off) => { const q = LUT[clamp(Math.round(s / 2), 0, NL - 1)]; off = off || 0; return [q[0] - q[3] * off, q[1] + q[2] * off, q[2], q[3]]; };
  const capD = 'M' + CP.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' L');

  const CU = G(root);
  const jx = y => O[0] - Math.sqrt(RS * RS - (y - O[1]) * (y - O[1]));
  E('path', { d: `M-700,${BY0} L${jx(BY0).toFixed(1)},${BY0} A${RS},${RS} 0 1 1 ${jx(BY1).toFixed(1)},${BY1} L-700,${BY1} Z`, fill: SAC, stroke: SAC_WALL, 'stroke-width': 4, 'stroke-linejoin': 'round' }, CU);
  const extD = capD + ' L630,-500 M428,800 L410,1250';
  E('path', { d: extD, fill: 'none', stroke: TISSUE, 'stroke-width': CW }, CU);
  E('path', { d: extD, fill: 'none', stroke: LUMEN, 'stroke-width': BW }, CU);
  const offAt = s => (800 - capPt(s, 0)[1]) / 850;
  const SQ = [0, SA0 + 0.2 * ARC, SA0 + 0.45 * ARC, SA0 + 0.7 * ARC];
  const bg = E('linearGradient', { id: 'baBloodGrad', gradientUnits: 'userSpaceOnUse', x1: 0, y1: 800, x2: 0, y2: -50 }, defs());
  [[0, PL_BLUE], [offAt(SQ[1]) - 0.03, PL_BLUE], [offAt(SQ[3]), PL_RED], [1, PL_RED]].forEach(([o, c]) => E('stop', { offset: o.toFixed(4), 'stop-color': rgb(c, c, 0) }, bg));
  E('path', { d: capD, fill: 'none', stroke: 'url(#baBloodGrad)', 'stroke-width': BW }, CU);

  // air in the sac (eight of the oxygen dots diffuse away and are replaced during "vent")
  const dwG = G(CU), dwr = rng(29), DW = [];
  for (let k = 0; k < 31; k++) {
    const rr = (RS - 34) * Math.sqrt(0.06 + 0.94 * dwr()), a = dwr() * TAU;
    DW.push({ red: k < 26, el: k < 26 ? dotO(dwG) : dotC(dwG), bx: O[0] + Math.cos(a) * rr, by: O[1] + Math.sin(a) * rr, p: [dwr() * TAU, dwr() * TAU, dwr() * TAU, dwr() * TAU], yo: (dwr() - 0.5) * 36 });
  }
  for (let k = 0; k < 8; k++) {
    const d = DW[k], c = k >> 2, ph = (-30 + 70 * hash(k, 5, 5)) * Math.PI / 180;
    d.tl = at('vent') - 0.4 + c * 2.6 + (k % 4) * 0.25; d.tr = at('vent') + 0.75 + c * 2.6 + (k % 4) * 0.16;
    d.wx = O[0] + Math.cos(ph) * (RS - 8); d.wy = O[1] + Math.sin(ph) * (RS - 8);
  }
  function wander(d, t) {
    let x = d.bx + calm * (15 * Math.sin(0.62 * t + d.p[0]) + 8 * Math.sin(1.37 * t + d.p[1]));
    let y = d.by + calm * (15 * Math.cos(0.55 * t + d.p[2]) + 8 * Math.sin(1.21 * t + d.p[3]));
    const dx = x - O[0], dy = y - O[1], L = Math.hypot(dx, dy), M = RS - 14;
    if (L > M) { x = O[0] + dx / L * M; y = O[1] + dy / L * M; }
    return [x, y];
  }
  function dwState(d, t) {
    if (d.tl !== undefined && t >= d.tl) {
      if (t < d.tl + 0.9) { const u = ease((t - d.tl) / 0.9), w = wander(d, d.tl); return [lerp(w[0], d.wx, u), lerp(w[1], d.wy, u), 1 - P(t, d.tl + 0.6, 0.3, linear)]; }
      if (t < d.tr) return null;
      const u = ease(clamp((t - d.tr) / 1.6)), v = 1 - u, w = wander(d, t), p0 = [-30, BYC + d.yo], p1 = [330, BYC + d.yo * 0.4];
      return [v * v * p0[0] + 2 * v * u * p1[0] + u * u * w[0], v * v * p0[1] + 2 * v * u * p1[1] + u * u * w[1], P(t, d.tr, 0.25, linear)];
    }
    const w = wander(d, t); return [w[0], w[1], 1];
  }
  // carbon dioxide in the blood, crossing into the sac and out through the bronchiole
  const gbG = G(CU), GB = [];
  for (let j = 0; j < 18; j++) GB.push({ el: dotC(gbG, 6.5), s0: (j + 0.4 * hash(j, 1, 2)) * LEN / 18, off: (hash(j, 2, 3) - 0.5) * 36, sx: SA0 + (0.1 + 0.8 * hash(j, 4, 5)) * ARC, ph: hash(j, 6, 7) * TAU, ey: (hash(j, 8, 9) - 0.5) * 32 });
  function co2Out(g, tau) {
    const q0 = capPt(g.sx, g.off), dx = q0[0] - O[0], dy = q0[1] - O[1], L = Math.hypot(dx, dy);
    const q1 = [O[0] + dx / L * (RS - 44), O[1] + dy / L * (RS - 44)], e1 = [300, BYC + g.ey], cc = [O[0] - 10, O[1] - 70];
    if (tau < 0.6) { const u = ease(tau / 0.6); return [lerp(q0[0], q1[0], u), lerp(q0[1], q1[1], u), 1]; }
    if (tau < 2.2) { const u = ease((tau - 0.6) / 1.6), v = 1 - u; return [v * v * q1[0] + 2 * v * u * cc[0] + u * u * e1[0], v * v * q1[1] + 2 * v * u * cc[1] + u * u * e1[1], 1]; }
    const u = (tau - 2.2) / 1.1; return [lerp(e1[0], -30, u), lerp(e1[1], BYC + g.ey * 0.5, u), 1 - P(tau, 3.0, 0.3, linear)];
  }
  // red blood cells; oxygen hops on as each one passes the sac
  const RBCN = 14, SPC = LEN / RBCN, FLY = 1.6, TRAIL = 0.34;
  const SPOT = [[-11, -5], [11, -5], [-11, 6], [11, 6]];
  const trG = G(CU, { opacity: 0.7 }), rbG = G(CU), spG = G(CU);
  const rbcs = [];
  for (let m = 0; m < RBCN; m++) {
    const g = G(rbG);
    const disc = E('ellipse', { rx: 21, ry: 12, fill: rgb(RBC_BLUE, RBC_BLUE, 0), stroke: '#FFD0D5', 'stroke-width': 1.5 }, g);
    E('ellipse', { rx: 10, ry: 5, fill: 'rgba(60,8,36,0.3)' }, g);
    rbcs.push({ m, g, disc, spots: SPOT.map(() => ({ el: dotO(spG, 6), tr: E('line', { stroke: '#FF8F84', 'stroke-width': 6, 'stroke-linecap': 'round' }, trG) })) });
  }
  const spotAt = (s, q) => { const c = capPt(s, 0), a = SPOT[q][0], b = SPOT[q][1]; return [c[0] - c[3] * a + c[2] * b, c[1] + c[2] * a + c[3] * b]; };
  function flightStart(m, q, n) {
    const c = capPt(SQ[q], 0), dx = O[0] - c[0], dy = O[1] - c[1], L = Math.hypot(dx, dy), dep = CW / 2 + 8 + 60 + 120 * hash(m, q, n), j = (hash(m, q + 7, n) - 0.5) * 90;
    return [c[0] + dx / L * dep + c[2] * j, c[1] + dy / L * dep + c[3] * j];
  }
  // tau: blood "flow time"; the blood runs faster while "blood" is spoken
  const flowT = t => t + 0.6 * clamp(t - at('blood'), 0, end('blood') + 0.6 - at('blood'));
  function updCloseUp(t, dim) {
    const tau = flowT(t);
    let pres = 0;
    DW.forEach(d => { const st = dwState(d, t); if (!st) { op(d.el, 0); return; } place(d.el, st[0], st[1]); op(d.el, st[2]); if (d.red) pres += st[2]; });
    GB.forEach(g => {
      const sr = g.s0 + V * tau, s = sr - Math.floor(sr / LEN) * LEN, dq = s - g.sx;
      if (dq >= 0) { const k = dq / V; if (k > 3.3) { op(g.el, 0); return; } const p = co2Out(g, k); place(g.el, p[0], p[1]); op(g.el, p[2]); return; }
      const p = capPt(s, g.off + calm * 3 * Math.sin(t * 2.3 + g.ph)); place(g.el, p[0], p[1]); op(g.el, 1);
    });
    rbcs.forEach(r => {
      const sr = r.m * SPC + V * tau, n = Math.floor(sr / LEN), s = sr - n * LEN, c = capPt(s, 0);
      tr(r.g, c[0], c[1], 1, Math.atan2(c[2], -c[3]) * 180 / Math.PI);
      let loaded = 0;
      r.spots.forEach((sp, q) => {
        const dq = s - SQ[q];
        if (q === 0 || dq >= 0) { if (q) loaded++; const p = spotAt(s, q); place(sp.el, p[0], p[1]); attr(sp.el, 'r', 6); op(sp.el, 1); op(sp.tr, 0); return; }
        if (dq < -V * FLY) { op(sp.el, 0); op(sp.tr, 0); return; }
        const u = 1 + dq / (V * FLY), p0 = flightStart(r.m, q, n), tg = spotAt(s, q), x = lerp(p0[0], tg[0], u), y = lerp(p0[1], tg[1], u);
        place(sp.el, x, y); attr(sp.el, 'r', (7 - u).toFixed(2)); op(sp.el, Math.min(1, u / 0.1));
        const u2 = u - TRAIL / FLY, tg2 = spotAt(s - V * TRAIL, q);
        attr(sp.tr, 'x1', u2 > 0 ? lerp(p0[0], tg2[0], u2) : p0[0]); attr(sp.tr, 'y1', u2 > 0 ? lerp(p0[1], tg2[1], u2) : p0[1]);
        attr(sp.tr, 'x2', x); attr(sp.tr, 'y2', y); op(sp.tr, Math.min(1, u / 0.2));
      });
      r.disc.setAttribute('fill', rgb(RBC_BLUE, RBC_RED, loaded / 3));
    });
    op(rbG, dim); op(spG, dim); op(trG, 0.7 * dim);
    return pres;
  }

  /* ===== built: every feature makes diffusion faster ===== */
  const builtG = G(root);
  T(builtG, 980, 196, 'built for the job', { size: 36, weight: 700, anchor: 'middle' });
  const fastChip = G(builtG); tr(fastChip, 1000, 268);
  chip(fastChip, 'faster diffusion', { size: 32, fill: C.card2, stroke: C.energy, color: C.energy });
  [-1, 0, 1].forEach(k => E('line', { x1: -200 + Math.abs(k) * 12, y1: k * 13, x2: -160, y2: k * 13, stroke: C.energy, 'stroke-width': 5, 'stroke-linecap': 'round' }, fastChip));
  const streaks = [12, 24, -4, 38].map((deg, i) => {
    const a = deg * Math.PI / 180, r0 = 110 + 18 * (i % 2), r1 = RS - 16;
    return E('line', { x1: O[0] + Math.cos(a) * r0, y1: O[1] + Math.sin(a) * r0, x2: O[0] + Math.cos(a) * r1, y2: O[1] + Math.sin(a) * r1, stroke: '#FFE7E3', 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-dasharray': '16 12' }, builtG);
  });

  /* ===== factors: what makes diffusion fast ===== */
  const facG = G(root);
  T(facG, 600, 200, 'Diffusion is faster with a…', { size: 40, weight: 700, anchor: 'middle' });
  const facCards = [
    { x: 220, l1: 'large', l2: 'surface area', icon: g => { for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) E('rect', { x: -58 + c * 30, y: -42 + r * 30, width: 26, height: 26, rx: 4, fill: SAC, stroke: SAC_WALL, 'stroke-width': 2.5 }, g); } },
    { x: 600, l1: 'short', l2: 'distance', icon: g => {
      E('rect', { x: -14, y: -50, width: 10, height: 100, rx: 4, fill: SAC_WALL }, g); E('rect', { x: 4, y: -50, width: 10, height: 100, rx: 4, fill: TISSUE }, g);
      tr(dotO(g, 9), -46, 0); tr(dotO(g, 9), 46, 0);
      arrow(g, -36, -66, 36, -66, { color: C.energy, width: 5 }); arrow(g, 36, -66, -36, -66, { color: C.energy, width: 5 });
    } },
    { x: 980, l1: 'steep concentration', l2: 'gradient', icon: g => {
      E('rect', { x: -92, y: -48, width: 64, height: 96, rx: 10, fill: 'rgba(200,230,250,0.06)', stroke: '#CFE7F5', 'stroke-width': 2.5 }, g);
      E('rect', { x: 28, y: -48, width: 64, height: 96, rx: 10, fill: 'rgba(200,230,250,0.06)', stroke: '#CFE7F5', 'stroke-width': 2.5 }, g);
      [[-74, -30], [-48, -28], [-62, -8], [-78, 12], [-46, 14], [-62, 32], [-80, 34]].forEach(([x, y]) => tr(dotO(g, 8), x, y));
      tr(dotO(g, 8), 60, 22);
      arrow(g, -20, 0, 22, 0, { color: C.energy, width: 6 });
    } },
  ].map(f => {
    const g = G(facG); tr(g, f.x, 410);
    card(g, -165, -130, 330, 260, { fill: C.card, stroke: C.line });
    const ic = G(g); tr(ic, 0, -40); f.icon(ic);
    T(g, 0, 68, f.l1, { size: 30, weight: 700, anchor: 'middle' });
    T(g, 0, 106, f.l2, { size: 30, weight: 700, anchor: 'middle', fill: C.energy });
    return { g, x: f.x };
  });

  /* ===== area: alveoli unfold into a badminton court (showpiece) ===== */
  const courtG = G(root), sheetG = G(courtG);
  const CX0 = 110, CY0 = 205, CWD = 860, CHT = CWD * 6.1 / 13.4, KX = CWD / 13.4, KY = CHT / 6.1;
  const sheet = [];
  for (let r = 0; r < 4; r++) for (let c = 0; c < 8; c++) {
    const u = (c - 3.5) / 4, v = (r - 1.5) / 2;                       // -0.875..0.875, -0.75..0.75
    const du = u * Math.sqrt(1 - v * v / 2), dv = v * Math.sqrt(1 - u * u / 2);   // square -> disc: a round bunch
    sheet.push({ el: E('rect', { fill: SAC, stroke: SAC_WALL, 'stroke-width': 3 }, sheetG), hx: 540 + du * 205 + (r % 2 ? 12 : -12) + (hash(c, r, 1) - 0.5) * 10, hy: 405 + dv * 150 + (hash(c, r, 2) - 0.5) * 10, rr: 23 + 5 * hash(c, r, 3), gx: CX0 + (c + 0.5) * CWD / 8, gy: CY0 + (r + 0.5) * CHT / 4, d: Math.hypot(u, v) });
  }
  const cm = (x, y) => (CX0 + x * KX).toFixed(1) + ',' + (CY0 + y * KY).toFixed(1);
  const courtLines = E('path', { d: [[0, 0, 13.4, 0], [0, 6.1, 13.4, 6.1], [0, 0, 0, 6.1], [13.4, 0, 13.4, 6.1], [0, 0.46, 13.4, 0.46], [0, 5.64, 13.4, 5.64], [4.72, 0, 4.72, 6.1], [8.68, 0, 8.68, 6.1], [0.76, 0, 0.76, 6.1], [12.64, 0, 12.64, 6.1], [0, 3.05, 4.72, 3.05], [8.68, 3.05, 13.4, 3.05]].map(l => 'M' + cm(l[0], l[1]) + ' L' + cm(l[2], l[3])).join(' '), fill: 'none', stroke: '#F2F7FA', 'stroke-width': 4 }, courtG);
  const netG = G(courtG);
  E('line', { x1: CX0 + 6.7 * KX, y1: CY0 - 16, x2: CX0 + 6.7 * KX, y2: CY0 + CHT + 16, stroke: '#FFE29A', 'stroke-width': 7, 'stroke-linecap': 'round' }, netG);
  [CY0 - 16, CY0 + CHT + 16].forEach(y => E('circle', { cx: CX0 + 6.7 * KX, cy: y, r: 9, fill: '#FFC247' }, netG));
  const shuttle = G(courtG);
  E('path', { d: 'M-8,-6 L-30,-52 Q0,-62 30,-52 L8,-6 Z', fill: '#F2F7FA', stroke: '#C9D6DE', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, shuttle);
  E('path', { d: 'M-15,-30 L15,-30 M-3,-8 L-10,-54 M3,-8 L10,-54', stroke: '#9DB0BF', 'stroke-width': 2 }, shuttle);
  E('circle', { cx: 0, cy: 0, r: 11, fill: ball('#FFF3D6', '#C9A86A') }, shuttle);
  const areaChip = chip(courtG, 'about 70 m²', { size: 40, fill: C.card2, stroke: C.air, color: C.air }); tr(areaChip, CX0 + CWD / 2, 150);
  const courtLab = T(courtG, CX0 + CWD / 2, 650, 'roughly a badminton court', { size: 30, weight: 700, anchor: 'middle', fill: '#F2F7FA' });
  const chestG = G(courtG);
  const chestLungs = lungs(chestG, 0.42); tr(chestLungs, 1078, 380);
  T(chestG, 1078, 482, 'squeezed into', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  T(chestG, 1078, 514, 'your chest', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });

  /* ===== thin / short / moist: a zoom on the wall between air and blood ===== */
  const XS = G(root);
  const XT = 196, XB = 610;
  E('rect', { x: 40, y: XT, width: 278, height: XB - XT, fill: SAC }, XS);
  const filmPts = []; for (let i = 0; i <= 14; i++) filmPts.push([300 + 3 * Math.sin(i * 1.3), XT + i * (XB - XT) / 14]);
  const film = E('path', { d: 'M318,' + XT + ' L' + filmPts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' L') + ' L318,' + XB + ' Z', fill: '#6FCBEF', opacity: 0.6 }, XS);
  E('rect', { x: 340, y: XT, width: 12, height: XB - XT, fill: '#1A3142' }, XS);
  E('rect', { x: 374, y: XT, width: 386, height: XB - XT, fill: linGrad('#7A2E45', '#4D4290', true) }, XS);
  const wallA = [], wallC = [];
  for (let k = 0; k < 3; k++) {
    const y0 = XT + 2 + k * 138;
    wallA.push(E('rect', { x: 318, y: y0, width: 22, height: 134, rx: 10, fill: '#BFE6FA', stroke: '#7FB6D2', 'stroke-width': 2 }, XS));
    E('ellipse', { cx: 329, cy: y0 + 67, rx: 6, ry: 22, fill: '#9B7FD6' }, XS);
  }
  for (let k = 0; k < 4; k++) {
    const y0 = Math.max(XT, XT - 69 + k * 138), y1 = Math.min(XB, XT - 69 + k * 138 + 134);
    wallC.push(E('rect', { x: 352, y: y0 + 2, width: 22, height: y1 - y0 - 4, rx: 10, fill: TISSUE, stroke: '#C98A9E', 'stroke-width': 2 }, XS));
    if (k > 0 && k < 3) E('ellipse', { cx: 363, cy: XT - 69 + k * 138 + 67, rx: 6, ry: 22, fill: '#B48CD9' }, XS);
  }
  const cellHi = G(XS);                                   // highlight: one cell in each wall
  E('rect', { x: 312, y: XT + 134, width: 34, height: 146, rx: 14, fill: 'none', stroke: C.energy, 'stroke-width': 4 }, cellHi);
  E('rect', { x: 346, y: XT + 64, width: 34, height: 146, rx: 14, fill: 'none', stroke: C.energy, 'stroke-width': 4 }, cellHi);
  const xsRbc = [0, 1, 2].map(() => { const g = G(XS); E('ellipse', { rx: 50, ry: 34, stroke: '#FFD0D5', 'stroke-width': 2.5 }, g); E('ellipse', { rx: 24, ry: 13, fill: 'rgba(60,8,36,0.3)' }, g); return g; });
  const xsTrails = G(XS, { opacity: 0.7 }), xsDots = G(XS);
  const xsO = [], xr = rng(57);
  for (let k = 0; k < 10; k++) xsO.push({ el: dotO(xsDots, 9), halo: E('circle', { r: 16, fill: 'none', stroke: '#9FE3FF', 'stroke-width': 3 }, xsDots), tr: E('line', { stroke: '#FF8F84', 'stroke-width': 7, 'stroke-linecap': 'round' }, xsTrails), bx: 80 + xr() * 190, by: XT + 40 + xr() * (XB - XT - 80), p: [xr() * TAU, xr() * TAU], hops: [] });
  const xsC = [];
  for (let k = 0; k < 4; k++) xsC.push({ el: dotC(xsDots, 9), tr: E('line', { stroke: '#DCE6EE', 'stroke-width': 7, 'stroke-linecap': 'round' }, xsTrails), bx: 430 + xr() * 250, by: XT + 60 + xr() * (XB - XT - 120), p: [xr() * TAU, xr() * TAU], hops: [] });
  [0, 1, 2, 3, 4, 5].forEach(i => xsO[(i * 3) % 10].hops.push([mid('short', 0.08 + i * 0.14), 'fast']));
  [0, 1, 2, 3].forEach(i => xsO[(i * 3 + 1) % 10].hops.push([mid('moist', 0.3 + i * 0.13), 'wet']));
  [0, 1, 2, 3].forEach(i => xsC[i].hops.push([mid('short', 0.2 + i * 0.16), 'fast']));
  const xsLab = G(XS);
  leader(xsLab, 324, 146, 329, 220, C.air); leader(xsLab, 360, 146, 363, 226, '#FF9AAE');
  T(xsLab, 316, 136, 'alveolus wall', { size: 30, weight: 700, anchor: 'end', fill: C.air });
  T(xsLab, 366, 136, 'capillary wall', { size: 30, weight: 700, fill: '#FF9AAE' });
  const oneCell = G(XS);
  T(oneCell, 304, 174, 'one cell thick', { size: 26, weight: 600, anchor: 'end', fill: C.energy });
  T(oneCell, 378, 174, 'one cell thick', { size: 26, weight: 600, fill: C.energy });
  T(XS, 180, 652, 'air', { size: 30, weight: 700, anchor: 'middle', fill: C.air });
  T(XS, 566, 652, 'blood', { size: 30, weight: 700, anchor: 'middle', fill: '#FF8A94' });
  const measure = G(XS);
  E('path', { d: 'M318,622 L318,640 M318,631 L374,631 M374,622 L374,640', fill: 'none', stroke: C.energy, 'stroke-width': 4, 'stroke-linecap': 'round' }, measure);
  T(measure, 346, 676, 'diffusion distance', { size: 26, weight: 700, anchor: 'middle', fill: C.energy });
  const moistLab = G(XS);
  leader(moistLab, 292, 186, 306, 236, '#9FE3FF');
  T(moistLab, 286, 136, 'moist lining', { size: 30, weight: 700, anchor: 'end', fill: '#9FE3FF' });
  T(moistLab, 286, 172, 'gases dissolve first', { size: 26, weight: 600, anchor: 'end', fill: C.muted });
  const inset = G(root);
  E('circle', { cx: 948, cy: 560, r: 58, fill: SAC, stroke: SAC_WALL, 'stroke-width': 3 }, inset);
  E('path', { d: `M${948 + 71 * Math.cos(1.05)},${560 + 71 * Math.sin(1.05)} A71,71 0 0 0 ${948 + 71 * Math.cos(-0.75)},${560 + 71 * Math.sin(-0.75)}`, fill: 'none', stroke: '#B83A4E', 'stroke-width': 18, 'stroke-linecap': 'round' }, inset);
  E('rect', { x: 994, y: 544, width: 32, height: 32, rx: 4, fill: 'none', stroke: C.energy, 'stroke-width': 3, 'stroke-dasharray': '6 4' }, inset);
  T(inset, 948, 660, 'zoomed in on the wall', { size: 24, weight: 600, anchor: 'middle', fill: C.muted });

  /* ===== the adaptation tiles (right-hand column; later they spell TIMS) ===== */
  const TILE_W = 360, TILE_H = 84;
  const TILES = [
    { key: 'S', name: 'large surface area', tims: 'a big **S**urface area', icon: g => { E('rect', { x: -22, y: -14, width: 44, height: 28, rx: 3, fill: SAC, stroke: '#F2F7FA', 'stroke-width': 2.5 }, g); E('path', { d: 'M0,-14 L0,14 M-22,0 L-10,0 M10,0 L22,0', stroke: '#F2F7FA', 'stroke-width': 2 }, g); } },
    { key: 'T', name: 'thin walls', tims: '**T**hin walls', icon: g => { E('rect', { x: -9, y: -22, width: 7, height: 44, rx: 3, fill: SAC_WALL }, g); E('rect', { x: 2, y: -22, width: 7, height: 44, rx: 3, fill: TISSUE }, g); tr(dotO(g, 6), -20, 0); } },
    { key: 'M', name: 'moist lining', tims: 'a **M**oist lining', icon: g => E('path', { d: 'M0,-22 C10,-8 16,2 16,10 A16,16 0 0 1 -16,10 C-16,2 -10,-8 0,-22 Z', fill: C.water, stroke: '#BDEBFA', 'stroke-width': 2 }, g) },
    { key: 'I', name: 'rich blood supply', tims: 'lots of blood **I**n the capillaries', icon: g => { E('path', { d: 'M-22,16 C-22,-24 22,-24 22,16', fill: 'none', stroke: '#E8424F', 'stroke-width': 9, 'stroke-linecap': 'round' }, g); E('ellipse', { cx: 0, cy: -14, rx: 7, ry: 5, fill: '#FF8A94' }, g); } },
    { key: 'V', name: 'ventilation', tims: '', icon: g => { tr(lungs(g, 0.14), 0, 2); } },
  ].map((d, i) => {
    const g = G(root);
    const bgR = E('rect', { x: -TILE_W / 2, y: -TILE_H / 2, width: TILE_W, height: TILE_H, rx: 16, fill: C.card, stroke: C.line, 'stroke-width': 2.5 }, g);
    const hi = E('rect', { x: -TILE_W / 2, y: -TILE_H / 2, width: TILE_W, height: TILE_H, rx: 16, fill: 'none', stroke: C.energy, 'stroke-width': 4 }, g);
    const ic = G(g); tr(ic, -TILE_W / 2 + 44, 0); d.icon(ic);
    const nm = T(g, -TILE_W / 2 + 88, 10, d.name, { size: 28, weight: 700 });
    const tm = d.tims ? T(g, -TILE_W / 2 + 88, 10, d.tims, { size: 28, weight: 600, boldFill: C.energy }) : null;
    const wT = d.tims ? textWidth(d.tims, 28, FD, 700) + 88 + 28 : TILE_W;
    return Object.assign(d, { g, bgR, hi, nm, tm, wT, col: [980, 162 + i * 100] });
  });
  const TIMS_ORDER = ['T', 'I', 'M', 'S'], TK = {}; TILES.forEach(d => { TK[d.key] = d; });
  const timsG = G(root);
  const timsTitle = T(timsG, 600, 140, 'Remember **TIMS**', { size: 40, weight: 600, anchor: 'middle', boldFill: C.energy });
  const letters = TIMS_ORDER.map((k, i) => ({ k, el: T(timsG, 330, 250 + i * 112, k, { size: 80, weight: 700, anchor: 'middle', fill: C.energy }) }));

  /* ===== blood / vent: the gradient stays steep ===== */
  const gauge = G(root);
  T(gauge, 125, 448, 'oxygen gradient', { size: 26, weight: 700, anchor: 'middle', fill: O2C });
  const gAir = meter(gauge, { w: 30, h: 130, vertical: true, color: O2C }); tr(gAir, 60, 470);
  const gBlood = meter(gauge, { w: 30, h: 130, vertical: true, color: O2C }); tr(gBlood, 160, 470);
  T(gauge, 75, 632, 'air', { size: 26, weight: 600, anchor: 'middle', fill: C.air });
  T(gauge, 175, 632, 'blood', { size: 26, weight: 600, anchor: 'middle', fill: '#FF8A94' });
  const gArrow = arrow(gauge, 96, 488, 154, 566, { color: C.ink, width: 7 });
  const steep = chip(gauge, 'steep', { size: 26, fill: C.card2, stroke: C.good, color: C.good }); tr(steep, 125, 688);
  const flowLab = G(root);
  arrow(flowLab, 548, 226, 548, 126, { color: '#FF8A94', width: 7 });
  T(flowLab, 532, 172, 'carried away', { size: 28, weight: 700, anchor: 'end', fill: '#FF8A94' });
  T(flowLab, 548, 722, 'fresh blood arrives', { size: 28, weight: 700, fill: '#B9A8F0' });
  const ventG = G(root);
  const inArrow = arrow(ventG, 24, BYC, 230, BYC, { color: C.air, width: 8 });
  const outArrow = arrow(ventG, 236, BYC, 30, BYC, { color: C.air, width: 8 });
  T(ventG, 40, 290, 'fresh air in', { size: 28, weight: 600, fill: C.air });

  /* ===== second: one red blood cell loads up in a fraction of a second ===== */
  const hero = G(root), heroCell = G(hero);
  E('circle', { r: 40, fill: glow('#FFF3A0') }, heroCell);
  const heroDisc = E('ellipse', { rx: 24, ry: 14, stroke: '#FFFFFF', 'stroke-width': 3 }, heroCell);
  E('ellipse', { rx: 11, ry: 6, fill: 'rgba(60,8,36,0.3)' }, heroCell);
  const heroSpots = SPOT.map(([a, b]) => { const d = dotO(heroCell, 6.5); place(d, a * 1.1, b * 1.1); return d; });
  const watch = G(root); tr(watch, 980, 300);
  E('circle', { r: 86, fill: C.card, stroke: C.muted, 'stroke-width': 6 }, watch);
  E('rect', { x: -14, y: -116, width: 28, height: 22, rx: 5, fill: C.muted }, watch);
  for (let i = 0; i < 12; i++) { const a = i * TAU / 12; E('line', { x1: Math.cos(a) * 66, y1: Math.sin(a) * 66, x2: Math.cos(a) * (i % 3 ? 74 : 78), y2: Math.sin(a) * (i % 3 ? 74 : 78), stroke: C.muted, 'stroke-width': i % 3 ? 3 : 5 }, watch); }
  const sweep = E('path', { fill: 'rgba(255,107,92,0.28)' }, watch);
  const hand = E('line', { x1: 0, y1: 0, x2: 0, y2: -62, stroke: C.energy, 'stroke-width': 6, 'stroke-linecap': 'round' }, watch);
  E('circle', { r: 8, fill: C.energy }, watch);
  const watchLab = T(root, 980, 452, 'under 1 second', { size: 36, weight: 700, anchor: 'middle', fill: C.energy });
  const watchSub = T(root, 980, 494, 'to load up with oxygen', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });

  /* ================= update ================= */
  const tF = at('factors'), tA = at('area'), tTh = at('thin'), tSh = at('short'), tMo = at('moist'), tBl = at('blood'), tV = at('vent'), tTi = at('tims'), tSe = at('second');
  const T_SHRINK = tTh - 0.4, CCX = CX0 + CWD / 2, CCY = CY0 + CHT / 2;
  const tileIn = { S: T_SHRINK + 0.55, T: mid('thin', 0.12), M: mid('moist', 0.1), I: mid('blood', 0.1), V: mid('vent', 0.12) };
  const swapAt = { T: mid('tims', 0.2), I: mid('tims', 0.38), M: mid('tims', 0.62), S: mid('tims', 0.8) };
  const T_HERO = mid('second', 0.22), H_IN = T_HERO + 160 / 300, H_OUT = H_IN + ARC / 300, H_GONE = T_HERO + (LEN - SA0 + 170) / 300;
  const xsWander = (d, t) => [d.bx + calm * 14 * Math.sin(0.7 * t + d.p[0]), d.by + calm * 14 * Math.cos(0.6 * t + d.p[1])];
  const hopDur = type => (type === 'wet' ? 2.27 : 1.32);
  // a dot crossing the wall: [x, y, opacity, dissolving 0..1] or null once it has gone
  function hopPos(d, t, h, type, inward) {
    const tau = t - h, w0 = xsWander(d, h), y0 = clamp(w0[1], XT + 30, XB - 30);
    const xA = inward ? (type === 'wet' ? 309 : 302) : 390, xB = inward ? 392 : 300, xC = inward ? 462 : 230;
    const tA_ = type === 'wet' ? 0.45 : 0.4, tW = type === 'wet' ? 0.9 : 0;
    if (tau < tA_) { const u = ease(tau / tA_); return [lerp(w0[0], xA, u), lerp(w0[1], y0, u), 1, 0]; }
    if (tau < tA_ + tW) { const u = (tau - tA_) / tW; return [xA + 2 * Math.sin(u * 12), y0, 1 - 0.3 * Math.sin(u * Math.PI), Math.sin(u * Math.PI)]; }
    const t2 = tau - tA_ - tW;
    if (t2 < 0.22) return [lerp(xA, xB, t2 / 0.22), y0, 1, 0];
    const t3 = t2 - 0.22;
    if (t3 < 0.7) { const u = t3 / 0.7; return [lerp(xB, xC, easeOut(u)), y0 - (inward ? 30 : 10) * u, 1 - u, 0]; }
    return null;
  }
  function updXsDot(d, t, inward) {
    let h = null;
    for (const hp of d.hops) if (hp[0] <= t) h = hp;
    let st = h ? hopPos(d, t, h[0], h[1], inward) : null;
    if (h && !st) {
      const back = h[0] + hopDur(h[1]) + 0.9;
      if (t < back) { op(d.el, 0); op(d.tr, 0); if (d.halo) op(d.halo, 0); return; }
      const w = xsWander(d, t); st = [w[0], w[1], P(t, back, 0.4, linear), 0];
    }
    if (!st) { const w = xsWander(d, t); st = [w[0], w[1], 1, 0]; }
    place(d.el, st[0], st[1]); op(d.el, st[2]);
    if (d.halo) { place(d.halo, st[0], st[1]); attr(d.halo, 'r', (14 + 4 * Math.sin(t * 9)).toFixed(1)); op(d.halo, st[3] * 0.9); }
    const pv = h ? hopPos(d, t - 0.1, h[0], h[1], inward) : null;
    if (pv && h && t - h[0] > 0.3 && Math.abs(pv[0] - st[0]) > 6) { attr(d.tr, 'x1', pv[0]); attr(d.tr, 'y1', pv[1]); attr(d.tr, 'x2', st[0]); attr(d.tr, 'y2', st[1]); op(d.tr, st[2]); }
    else op(d.tr, 0);
  }

  return t => {
    /* the close-up */
    const fCU = Math.max(beat(t, S.first - 0.5, tF + 0.3), beat(t, tBl - 0.4, tTi + 0.5), P(t, tSe - 0.3, 0.5, linear));
    op(CU, fCU);
    let pres = 26;
    if (fCU > 0) pres = updCloseUp(t, 1 - 0.55 * win(t, T_HERO - 0.3, H_GONE + 0.6, 0.5));

    /* built */
    const fBu = beat(t, mid('built', 0.12), tF + 0.2);
    op(builtG, fBu);
    if (fBu > 0) {
      op(builtG.childNodes[0], P(t, mid('built', 0.12), 0.5, linear));
      const cp = P(t, mid('built', 0.62), 0.5, pop); op(fastChip, clamp(cp * 2)); tr(fastChip, 1000, 268, Math.max(0.01, 0.8 + 0.2 * cp));
      streaks.forEach((s, i) => { s.setAttribute('stroke-dashoffset', (-t * 70 - i * 9).toFixed(1)); op(s, P(t, mid('built', 0.55), 0.5, linear) * (0.55 + 0.45 * wave(t, 1.3, i * 0.25))); });
    }

    /* factors */
    const fFa = beat(t, tF - 0.1, tA + 0.3);
    op(facG, fFa);
    if (fFa > 0) {
      op(facG.childNodes[0], P(t, tF + 0.1, 0.4, linear));
      facCards.forEach((c, i) => { const p = P(t, mid('factors', [0.3, 0.55, 0.8][i]), 0.55, pop); op(c.g, clamp(p * 2)); tr(c.g, c.x, 410 + (1 - clamp(p)) * 24, 0.9 + 0.1 * clamp(p)); });
    }

    /* area: unfold into a court, then fly into the "surface area" tile */
    const shr = P(t, T_SHRINK, 0.7, easeIn);
    const fCo = P(t, tA - 0.1, 0.4, linear) * (1 - P(shr, 0.8, 0.2, linear));
    op(courtG, fCo);
    if (fCo > 0) {
      const tgt = [TK.S.col[0] - TILE_W / 2 + 44, TK.S.col[1]], k = Math.pow(44 / CWD, shr);
      courtG.setAttribute('transform', shr > 0 ? `translate(${lerp(CCX, tgt[0], shr).toFixed(1)} ${lerp(CCY, tgt[1], shr).toFixed(1)}) scale(${k.toFixed(4)}) translate(${-CCX.toFixed(1)} ${-CCY.toFixed(1)})` : 'translate(0 0)');
      const T0 = mid('area', 0.14);
      sheet.forEach(a => {
        const app = P(t, tA + 0.1 + a.d * 0.35, 0.45, pop), u = P(t, T0 + a.d * 0.9, 1.5, ease);
        const w = lerp(2 * a.rr, CWD / 8, u), h = lerp(2 * a.rr, CHT / 4, u), x = lerp(a.hx, a.gx, u), y = lerp(a.hy, a.gy, u), s = Math.max(0.01, app);
        attr(a.el, 'x', x - w * s / 2); attr(a.el, 'y', y - h * s / 2); attr(a.el, 'width', w * s); attr(a.el, 'height', h * s); attr(a.el, 'rx', lerp(a.rr, 4, u) * s);
        attr(a.el, 'stroke-opacity', 1 - 0.8 * P(t, mid('area', 0.48), 0.8, linear));
        op(a.el, clamp(app * 2));
      });
      const lab = 1 - P(t, T_SHRINK - 0.35, 0.3, linear);
      const ap = P(t, mid('area', 0.36), 0.5, pop); op(areaChip, clamp(ap * 2) * lab); tr(areaChip, CCX, 150, Math.max(0.01, 0.8 + 0.2 * ap));
      op(courtLines, P(t, mid('area', 0.5), 0.6, linear)); op(netG, P(t, mid('area', 0.53), 0.5, linear));
      const sp = P(t, mid('area', 0.58), 0.5, pop); op(shuttle, clamp(sp * 2)); tr(shuttle, CX0 + 10.4 * KX, CY0 + 2.2 * KY + (S.reduce ? 0 : 4 * Math.sin(t * 2.2)), Math.max(0.01, sp), -24);
      op(courtLab, P(t, mid('area', 0.56), 0.5, linear) * lab);
      const cg = P(t, mid('area', 0.8), 0.5, linear); op(chestG, cg * lab); chestLungs.set(wave(t, 3.6) * calm * cg);
    }

    /* thin / short / moist: the wall up close */
    const fX = beat(t, tTh + 0.2, tBl + 0.2);
    op(XS, fX); op(inset, beat(t, tTh + 0.6, tBl + 0.1));
    if (fX > 0) {
      op(xsLab, beat(t, mid('thin', 0.4), tMo + 0.2)); op(oneCell, beat(t, mid('thin', 0.6), tMo + 0.2));
      op(cellHi, beat(t, mid('thin', 0.58), tSh + 0.2) * (0.6 + 0.4 * wave(t, 1.1)));
      op(measure, P(t, mid('thin', 0.85), 0.5, linear));
      op(film, P(t, tMo + 0.1, 0.6, linear) * (0.75 + 0.25 * wave(t, 1.7)));
      op(moistLab, P(t, mid('moist', 0.15), 0.5, linear));
      xsRbc.forEach((g, k) => {
        const y = XB + 50 - ((t * 55 + k * 175) % 525), p = clamp((XB - y) / (XB - XT));
        tr(g, 545 + (k - 1) * 70, y); g.firstChild.setAttribute('fill', rgb(RBC_BLUE, RBC_RED, p)); op(g, clamp(Math.min((y - XT - 36) / 40, (XB - 36 - y) / 40)));
      });
      xsO.forEach(d => updXsDot(d, t, true)); xsC.forEach(d => updXsDot(d, t, false));
    }

    /* blood and ventilation keep the gradient steep */
    const fGa = beat(t, mid('blood', 0.45), tTi + 0.3);
    op(gauge, fGa);
    if (fGa > 0) {
      const g0 = P(t, mid('blood', 0.48), 0.8, easeOut);
      gAir.set(0.85 * (pres / 26) * g0); gBlood.set(0.2 * g0);
      gArrow.set(P(t, mid('blood', 0.62), 0.6)); op(steep, P(t, mid('blood', 0.8), 0.4, linear));
    }
    op(flowLab, beat(t, mid('blood', 0.32), tV + 0.2));
    const fV = beat(t, tV, tTi + 0.2);
    op(ventG, fV);
    if (fV > 0) {
      const b1 = win(t, tV + 0.6, tV + 1.8, 0.3), b2 = win(t, tV + 3.2, tV + 4.4, 0.3), o1 = win(t, tV + 2.0, tV + 2.9, 0.3), o2 = win(t, tV + 4.6, tV + 5.5, 0.3);
      op(inArrow, Math.max(b1, b2)); inArrow.set(b1 > 0 ? P(t, tV + 0.6, 0.6) : P(t, tV + 3.2, 0.6));
      op(outArrow, Math.max(o1, o2)); outArrow.set(o1 > 0 ? P(t, tV + 2.0, 0.6) : P(t, tV + 4.6, 0.6));
    }

    /* tiles: collect on the right, then line up as TIMS */
    // the column fades as "Remember TIMS" starts; each tile then slides into its TIMS row as its word is said
    const tOut = 1 - P(t, tSe - 0.25, 0.5, linear), colOut = 1 - P(t, tTi + 0.05, 0.35, linear), timsMode = t >= tTi + 0.4;
    TILES.forEach(d => {
      const pin = P(t, tileIn[d.key], 0.5, pop);
      let vis, x = d.col[0], y = d.col[1], w = TILE_W, hiOn;
      if (!timsMode || d.key === 'V') {
        vis = clamp(pin * 2) * colOut * tOut; x += (1 - clamp(pin)) * 30;
        hiOn = P(t, tileIn[d.key], 0.3, linear) * (1 - P(t, tileIn[d.key] + 1.2, 0.6, linear));
        if (d.tm) { op(d.nm, 1); op(d.tm, 0); }
      } else {
        const j = TIMS_ORDER.indexOf(d.key), sp = P(t, swapAt[d.key] - 0.15, 0.45, easeOut);
        vis = sp * tOut; x = 380 + TILE_W / 2 - (1 - sp) * 40; y = 222 + j * 112; w = Math.max(TILE_W, d.wT);
        hiOn = win(t, swapAt[d.key] - 0.15, swapAt[d.key] + 1.0, 0.3);
        op(d.nm, 0); op(d.tm, 1);
      }
      op(d.g, vis);
      if (vis > 0) {
        tr(d.g, x, y, timsMode ? 1 : 0.9 + 0.1 * clamp(pin));
        attr(d.bgR, 'width', w); attr(d.hi, 'width', w); op(d.hi, hiOn);
      }
    });
    op(timsG, beat(t, tTi + 0.1, tSe + 0.1));
    op(timsTitle, P(t, tTi + 0.2, 0.5, linear));
    letters.forEach(l => { const p = P(t, swapAt[l.k], 0.5, pop); op(l.el, clamp(p * 2)); const ly = 222 + TIMS_ORDER.indexOf(l.k) * 112; l.el.setAttribute('transform', `translate(330 ${ly}) scale(${Math.max(0.01, 0.6 + 0.4 * p).toFixed(3)}) translate(-330 ${-ly})`); });

    /* second: one cell loads up as it zips past */
    const sh = T_HERO <= t ? SA0 - 160 + 300 * (t - T_HERO) : -1;
    if (sh >= 0 && sh <= LEN - 10) {
      const c = capPt(sh, 0);
      tr(hero, c[0], c[1], 1, Math.atan2(c[2], -c[3]) * 180 / Math.PI); op(hero, P(t, T_HERO, 0.2, linear) * (1 - P(sh, LEN - 80, 70, linear)));
      let loaded = 0;
      heroSpots.forEach((d, q) => { const on = q === 0 || sh >= SQ[q]; if (q && on) loaded++; op(d, on ? 1 : 0); });
      heroDisc.setAttribute('fill', rgb(RBC_BLUE, RBC_RED, loaded / 3));
    } else op(hero, 0);
    const fW = P(t, tSe + 0.1, 0.5, pop);
    op(watch, clamp(fW * 2)); tr(watch, 980, 300, Math.max(0.01, 0.85 + 0.15 * fW));
    if (fW > 0) {
      const a = 0.75 * TAU * P(t, H_IN, H_OUT - H_IN, linear), r = 62;
      hand.setAttribute('transform', `rotate(${(a * 180 / Math.PI).toFixed(1)})`);
      sweep.setAttribute('d', a > 0.01 ? `M0,0 L0,${-r} A${r},${r} 0 ${a > Math.PI ? 1 : 0} 1 ${(r * Math.sin(a)).toFixed(1)},${(-r * Math.cos(a)).toFixed(1)} Z` : 'M0,0');
    }
    op(watchLab, P(t, H_OUT + 0.1, 0.4, linear)); op(watchSub, P(t, H_OUT + 0.5, 0.4, linear));
  };
});
