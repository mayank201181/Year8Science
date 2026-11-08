/* Gas exchange in the alveoli.
   Beats: a cluster of alveoli in a net of capillaries, zoom into one -> diffusion demo (high -> low)
   -> bluish blood arrives (low O2, high CO2) -> fresh air fills the sac (high O2, low CO2)
   -> showpiece: oxygen streams across the thin wall onto red blood cells, the blood turns red
   -> carbon dioxide crosses the other way and is breathed out -> haemoglobin carries the oxygen away
   -> no pump: the concentration gradient -> breathing keeps it steep -> fewer O2 per breath on a mountain.

   Shared art, the ALVEOLUS CLOSE-UP (the alveoli chapter draws the same one; copy it, don't vary it):
   sac = circle r 190 at (460,420), fill #1E4256, wall #BFE6FA 4 px, bronchiole entering from the left
   (y 312..382); capillary = 70 px tube (tissue #E9BDC9, 62 px of blood inside) hugging the sac's right
   side 5 px from it, blood flowing UP from bluish (arriving) to red (leaving); red blood cells are discs
   that go purple -> red as up to four O2 dots cling to them. Gas dots: oxygen = C.oxygen, CO2 = #B9C9D8. */
scene('exchange', S => {
  const { at, end, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;

  /* ---------- palette and helpers ---------- */
  const SAC = '#1E4256', SAC_WALL = '#BFE6FA', TISSUE = '#E9BDC9', LUMEN = '#142634';
  const PL_BLUE = [88, 77, 156], PL_RED = [163, 48, 62];        // blood plasma: arriving / leaving
  const RBC_BLUE = [146, 108, 220], RBC_RED = [240, 74, 87];     // red blood cells: no oxygen / loaded
  const O2C = C.oxygen, O2D = C.oxygenDk, CO2C = '#B9C9D8', CO2D = '#71828F';
  const rgb = (a, b, p) => `rgb(${Math.round(lerp(a[0], b[0], p))},${Math.round(lerp(a[1], b[1], p))},${Math.round(lerp(a[2], b[2], p))})`;
  const hash = (a, b, c) => { const x = Math.sin(a * 12.9898 + b * 78.233 + c * 37.719) * 43758.5453; return x - Math.floor(x); };
  function leader(parent, x1, y1, x2, y2, color) {
    const g = G(parent);
    E('line', { x1, y1, x2, y2, stroke: color || C.muted, 'stroke-width': 3, 'stroke-linecap': 'round' }, g);
    E('circle', { cx: x2, cy: y2, r: 5, fill: color || C.muted }, g);
    return g;
  }
  // a gas dot and its words: "● **high** in oxygen"
  function dotLab(parent, x, y, red, text, size) {
    size = size || 27;
    const g = G(parent);
    E('circle', { cx: x, cy: y - size * 0.34, r: 8, fill: red ? ball(O2C, O2D) : ball(CO2C, CO2D) }, g);
    T(g, x + 20, y, text, { size, weight: 500, boldFill: red ? '#FF9A8F' : '#E4ECF2' });
    return g;
  }

  /* ---------- the close-up's geometry: sac, bronchiole, capillary centre line ---------- */
  const O = [460, 420], RS = 190, RC = 232, CW = 70, BW = 62;
  const BY0 = 312, BY1 = 382, BYC = 347;                          // bronchiole top, bottom, centre
  const PH0 = 62 * Math.PI / 180, PH1 = -40 * Math.PI / 180;      // the capillary hugs the sac between these angles
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
  // point at path length s (0 = bottom, where blood arrives), `off` px to the right of the flow; + flow direction
  const capPt = (s, off) => { const q = LUT[clamp(Math.round(s / 2), 0, NL - 1)]; off = off || 0; return [q[0] - q[3] * off, q[1] + q[2] * off, q[2], q[3]]; };
  const capD = 'M' + CP.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' L');

  /* ===== A. a cluster of alveoli wrapped in capillaries ===== */
  // layers: vessels and neighbours fade first as we zoom; the hero alveolus and its bronchiole line up with the close-up
  const A = G(root), Av = G(A), Ab = G(A), An = G(A), Ah = G(A);
  const ALV = [[612, 300, 64], [726, 262, 66], [838, 320, 64], [872, 442, 66], [806, 556, 64], [690, 590, 66], [583, 522, 62], [716, 420, 72]];
  const HERO = ALV[7], ZK = RS / HERO[2], HBY = HERO[1] + (BYC - O[1]) / ZK;
  [['M560,790 C580,700 610,660 652,632', '#3B2F6E', '#8068D4'], ['M930,446 C1000,440 1080,420 1230,404', '#6E1C28', '#E8424F']].forEach(([d, dk, c]) => {
    E('path', { d, fill: 'none', stroke: dk, 'stroke-width': 26, 'stroke-linecap': 'round' }, Av);
    E('path', { d, fill: 'none', stroke: c, 'stroke-width': 17, 'stroke-linecap': 'round' }, Av);
  });
  E('path', { d: `M-40,${HBY.toFixed(1)} L690,${HBY.toFixed(1)}`, fill: 'none', stroke: SAC_WALL, 'stroke-width': 34 }, Ab);
  E('path', { d: `M-40,${HBY.toFixed(1)} L690,${HBY.toFixed(1)}`, fill: 'none', stroke: SAC, 'stroke-width': 27 }, Ab);
  const netD = (x, y, r) => [[-0.42, -0.9, -0.95, 0, -0.42, 0.9], [0.42, -0.9, 0.95, 0, 0.42, 0.9], [-0.92, -0.3, 0, 0.18, 0.92, -0.3], [-0.82, 0.5, 0, 0.9, 0.82, 0.5]]
    .map(q => `M${(x + q[0] * r).toFixed(1)},${(y + q[1] * r).toFixed(1)} Q${(x + q[2] * r).toFixed(1)},${(y + q[3] * r).toFixed(1)} ${(x + q[4] * r).toFixed(1)},${(y + q[5] * r).toFixed(1)}`).join(' ');
  const nets = ALV.map(([x, y, r], i) => {
    const par = i === 7 ? Ah : An;
    E('circle', { cx: x, cy: y, r, fill: SAC, stroke: SAC_WALL, 'stroke-width': 4 }, par);
    const f = clamp(((x - 580) + (600 - y)) / 520);
    return E('path', { d: netD(x, y, r), fill: 'none', stroke: rgb([142, 112, 230], [255, 96, 108], f), 'stroke-width': 5, 'stroke-linecap': 'round' }, par);
  });
  const heroRing = E('circle', { cx: HERO[0], cy: HERO[1], r: HERO[2] + 12, fill: 'none', stroke: C.ink, 'stroke-width': 4, 'stroke-dasharray': '12 9' }, Ah);
  const labCap = G(A);
  leader(labCap, 892, 206, 846, 286, '#FF8A94');
  T(labCap, 904, 204, 'capillaries', { size: 36, weight: 700, fill: '#FF8A94' });
  T(labCap, 904, 242, 'the smallest blood vessels', { size: 24, weight: 500, fill: C.muted });
  const labAlv = G(A);
  leader(labAlv, 950, 612, 866, 574, C.air);
  T(labAlv, 962, 622, 'alveoli', { size: 32, weight: 700, fill: C.air });

  /* ===== B. the alveolus close-up ===== */
  const B = G(root);
  const jx = y => O[0] - Math.sqrt(RS * RS - (y - O[1]) * (y - O[1]));
  E('path', { d: `M-700,${BY0} L${jx(BY0).toFixed(1)},${BY0} A${RS},${RS} 0 1 1 ${jx(BY1).toFixed(1)},${BY1} L-700,${BY1} Z`, fill: SAC, stroke: SAC_WALL, 'stroke-width': 4, 'stroke-linejoin': 'round' }, B);
  const extD = capD + ' L630,-500 M428,800 L410,1250';
  E('path', { d: extD, fill: 'none', stroke: TISSUE, 'stroke-width': CW }, B);
  E('path', { d: extD, fill: 'none', stroke: LUMEN, 'stroke-width': BW }, B);
  const bloodGrad = E('linearGradient', { id: 'bxBloodGrad', gradientUnits: 'userSpaceOnUse', x1: 0, y1: 800, x2: 0, y2: -50 }, defs());
  const stops = [0, 1, 1, 1, 1, 1].map(o => E('stop', { offset: o, 'stop-color': rgb(PL_BLUE, PL_BLUE, 0) }, bloodGrad));
  const blood = E('path', { d: capD, fill: 'none', stroke: 'url(#bxBloodGrad)', 'stroke-width': BW, pathLength: 1, 'stroke-dasharray': '1 1', 'stroke-dashoffset': 1 }, B);
  const labClose = G(root);
  T(labClose, 452, 338, 'alveolus', { size: 34, weight: 700, anchor: 'middle', fill: C.air });
  T(labClose, 452, 374, '(an air sac)', { size: 26, weight: 500, anchor: 'middle', fill: C.muted });
  T(labClose, 552, 722, 'capillary', { size: 30, weight: 700, fill: '#FF8A94' });

  /* ===== D. diffusion demo: high -> low concentration ===== */
  const Dm = G(root);
  const DX0 = 790, DX1 = 1130, DY0 = 252, DY1 = 432;
  E('rect', { x: DX0 - 8, y: DY0 - 8, width: DX1 - DX0 + 16, height: DY1 - DY0 + 16, rx: 14, fill: 'rgba(200,230,250,0.06)', stroke: '#CFE7F5', 'stroke-width': 3 }, Dm);
  const divider = E('line', { x1: 960, y1: DY0 - 6, x2: 960, y2: DY1 + 6, stroke: '#CFE7F5', 'stroke-width': 3, 'stroke-dasharray': '9 7' }, Dm);
  const dr = rng(83), dDots = [];
  for (let k = 0; k < 22; k++) dDots.push({ el: E('circle', { r: 8.5, fill: ball('#EEF4F8', '#8DA3B3') }, Dm), x0: DX0 + 14 + dr() * 140, y0: DY0 + 14 + dr() * 152, x1: DX0 + 14 + ((k + dr()) / 22) * 312, y1: DY0 + 14 + dr() * 152, d: dr() * 1.4, ph: dr() * TAU });
  const dTitle = T(Dm, 960, 196, 'diffusion', { size: 40, weight: 700, anchor: 'middle' });
  const dHigh = T(Dm, 875, 236, 'high', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  const dLow = T(Dm, 1045, 236, 'low', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  const dRule = T(Dm, 960, 486, '**high → low** concentration', { size: 30, weight: 500, anchor: 'middle', boldFill: C.energy });

  /* ---------- moving parts of the close-up (built inside B so they zoom with it) ---------- */
  const V = 90;                                         // blood speed, px/s
  // air in the sac: 26 oxygen + 5 carbon dioxide dots that wander; they come in through the bronchiole
  const dwG = G(B), dwr = rng(29), DW = [];
  for (let k = 0; k < 31; k++) {
    const rr = (RS - 34) * Math.sqrt(0.06 + 0.94 * dwr()), a = dwr() * TAU;
    DW.push({ red: k < 26, el: E('circle', { r: 7, fill: k < 26 ? ball(O2C, O2D) : ball(CO2C, CO2D) }, dwG), bx: O[0] + Math.cos(a) * rr, by: O[1] + Math.sin(a) * rr, p: [dwr() * TAU, dwr() * TAU, dwr() * TAU, dwr() * TAU], yo: (dwr() - 0.5) * 36 });
  }
  [...Array(31).keys()].sort((i, j) => hash(i, 3, 1) - hash(j, 3, 1)).forEach((k, i) => { DW[k].te = at('air') + 0.1 + i * 0.1; });
  // during "refresh", eight of them diffuse away and fresh ones come in with each breath
  for (let k = 0; k < 8; k++) {
    const d = DW[k], c = k >> 2, ph = (-30 + 70 * hash(k, 5, 5)) * Math.PI / 180;
    d.tl = at('refresh') - 0.3 + c * 2.7 + (k % 4) * 0.28; d.tr = at('refresh') + 1.05 + c * 2.7 + (k % 4) * 0.16;
    d.wx = O[0] + Math.cos(ph) * (RS - 8); d.wy = O[1] + Math.sin(ph) * (RS - 8);
  }
  function wander(d, t) {
    let x = d.bx + calm * (15 * Math.sin(0.62 * t + d.p[0]) + 8 * Math.sin(1.37 * t + d.p[1]));
    let y = d.by + calm * (15 * Math.cos(0.55 * t + d.p[2]) + 8 * Math.sin(1.21 * t + d.p[3]));
    const dx = x - O[0], dy = y - O[1], L = Math.hypot(dx, dy), M = RS - 14;
    if (L > M) { x = O[0] + dx / L * M; y = O[1] + dy / L * M; }
    return [x, y];
  }
  function entering(d, t, t0, dur) {
    const u = ease(clamp((t - t0) / dur)), v = 1 - u, w = wander(d, t), p0 = [-30, BYC + d.yo], p1 = [330, BYC + d.yo * 0.4];
    return [v * v * p0[0] + 2 * v * u * p1[0] + u * u * w[0], v * v * p0[1] + 2 * v * u * p1[1] + u * u * w[1]];
  }
  // [x, y, opacity, presence 0..1] or null
  function dwState(d, t) {
    if (t < d.te) return null;
    if (d.tl !== undefined && t >= d.tl) {
      if (t < d.tl + 0.9) { const u = ease((t - d.tl) / 0.9), w = wander(d, d.tl); return [lerp(w[0], d.wx, u), lerp(w[1], d.wy, u), 1 - P(t, d.tl + 0.6, 0.3, linear), 1 - u]; }
      if (t < d.tr) return null;
      const p = entering(d, t, d.tr, 1.6); return [p[0], p[1], P(t, d.tr, 0.25, linear), ease(clamp((t - d.tr) / 1.6))];
    }
    if (t < d.te + 1.8) { const p = entering(d, t, d.te, 1.8); return [p[0], p[1], P(t, d.te, 0.25, linear), 1]; }
    const w = wander(d, t); return [w[0], w[1], 1, 1];
  }

  // carbon dioxide carried in the blood; from "cotwo" each one crosses into the sac and is breathed out
  const gbG = G(B), GBN = 18, GB = [];
  for (let j = 0; j < GBN; j++) GB.push({ el: E('circle', { r: 6.5, fill: ball(CO2C, CO2D) }, gbG), s0: (j + 0.4 * hash(j, 1, 2)) * LEN / GBN, off: (hash(j, 2, 3) - 0.5) * 36, sx: SA0 + (0.1 + 0.8 * hash(j, 4, 5)) * ARC, ph: hash(j, 6, 7) * TAU, ey: (hash(j, 8, 9) - 0.5) * 32 });
  function co2Out(g, tau) {
    const q0 = capPt(g.sx, g.off), dx = q0[0] - O[0], dy = q0[1] - O[1], L = Math.hypot(dx, dy);
    const q1 = [O[0] + dx / L * (RS - 44), O[1] + dy / L * (RS - 44)], e1 = [300, BYC + g.ey], cc = [O[0] - 10, O[1] - 70];
    if (tau < 0.6) { const u = ease(tau / 0.6); return [lerp(q0[0], q1[0], u), lerp(q0[1], q1[1], u), 1]; }
    if (tau < 2.2) { const u = ease((tau - 0.6) / 1.6), v = 1 - u; return [v * v * q1[0] + 2 * v * u * cc[0] + u * u * e1[0], v * v * q1[1] + 2 * v * u * cc[1] + u * u * e1[1], 1]; }
    const u = (tau - 2.2) / 1.1; return [lerp(e1[0], -30, u), lerp(e1[1], BYC + g.ey * 0.5, u), 1 - P(tau, 3.0, 0.3, linear)];
  }

  // red blood cells: purple discs that turn red as oxygen clings to their four spots
  const RBCN = 14, SPC = LEN / RBCN, FLY = 1.6, TRAIL = 0.34;
  const SQ = [0, SA0 + 0.2 * ARC, SA0 + 0.45 * ARC, SA0 + 0.7 * ARC];    // where each spot is loaded
  const SPOT = [[-11, -5], [11, -5], [-11, 6], [11, 6]];                // [across, along] the flow
  const trG = G(B, { opacity: 0.7 }), rbG = G(B), spG = G(B);
  const rbcs = [];
  for (let m = 0; m < RBCN; m++) {
    const g = G(rbG);
    const disc = E('ellipse', { rx: 21, ry: 12, fill: rgb(RBC_BLUE, RBC_BLUE, 0), stroke: '#FFD0D5', 'stroke-width': 1.5 }, g);
    E('ellipse', { rx: 10, ry: 5, fill: 'rgba(60,8,36,0.3)' }, g);
    const spots = SPOT.map(() => ({ el: E('circle', { r: 6, fill: ball(O2C, O2D) }, spG), tr: E('line', { stroke: '#FF8F84', 'stroke-width': 6, 'stroke-linecap': 'round' }, trG) }));
    rbcs.push({ m, g, disc, spots });
  }
  const wallGlow = E('path', { d: `M${(O[0] + (RS + 6) * Math.cos(PH0)).toFixed(1)},${(O[1] + (RS + 6) * Math.sin(PH0)).toFixed(1)} A${RS + 6},${RS + 6} 0 0 0 ${(O[0] + (RS + 6) * Math.cos(PH1)).toFixed(1)},${(O[1] + (RS + 6) * Math.sin(PH1)).toFixed(1)}`, fill: 'none', stroke: '#FFC2BA', 'stroke-width': 12, 'stroke-linecap': 'round' }, B);
  B.insertBefore(wallGlow, dwG);
  const offAt = s => (800 - capPt(s, 0)[1]) / 850, G1 = offAt(SQ[1]) - 0.03, G3 = offAt(SQ[3]);
  const spotAt = (s, q) => { const c = capPt(s, 0), a = SPOT[q][0], b = SPOT[q][1]; return [c[0] - c[3] * a + c[2] * b, c[1] + c[2] * a + c[3] * b]; };
  function flightStart(m, q, n) {
    const c = capPt(SQ[q], 0), dx = O[0] - c[0], dy = O[1] - c[1], L = Math.hypot(dx, dy), dep = CW / 2 + 8 + 60 + 120 * hash(m, q, n), j = (hash(m, q + 7, n) - 0.5) * 90;
    return [c[0] + dx / L * dep + c[2] * j, c[1] + dy / L * dep + c[3] * j];
  }

  /* ---------- labels and panels (in root: they never zoom) ---------- */
  const airLab = G(root);
  T(airLab, 40, 150, 'fresh air', { size: 34, weight: 700, fill: C.air });
  dotLab(airLab, 52, 194, true, '**high** in oxygen');
  dotLab(airLab, 52, 234, false, '**low** in carbon dioxide');
  const bloodLab = G(root);
  T(bloodLab, 770, 566, 'blood from your body', { size: 30, weight: 700, fill: '#B9A8F0' });
  dotLab(bloodLab, 782, 610, true, '**low** in oxygen');
  dotLab(bloodLab, 782, 650, false, '**high** in carbon dioxide');
  const key = G(root);
  card(key, 892, 118, 262, 96, { fill: 'rgba(20,54,70,0.85)', stroke: C.line, rx: 16 });
  dotLab(key, 914, 156, true, 'oxygen', 26);
  dotLab(key, 914, 196, false, 'carbon dioxide', 26);
  const chipO = chip(root, 'oxygen → blood', { size: 28, fill: 'rgba(255,107,92,0.16)', stroke: O2C, color: '#FFB3AA' }); tr(chipO, 980, 330);
  const chipC = chip(root, 'carbon dioxide → air', { size: 28, fill: 'rgba(185,201,216,0.14)', stroke: CO2C, color: '#E4ECF2' }); tr(chipC, 980, 410);
  // breathing through the bronchiole
  const bronG = G(root);
  const outArrow = arrow(bronG, 236, BYC, 30, BYC, { color: C.air, width: 8 });
  const outLab = T(bronG, 40, 430, 'breathed out', { size: 28, weight: 600, fill: C.air });
  const inArrow = arrow(bronG, 24, BYC, 230, BYC, { color: C.air, width: 8 });
  const inLab = T(bronG, 40, 290, 'fresh air in', { size: 28, weight: 600, fill: C.air });
  // red blood cell inset
  const inset = G(root);
  leader(inset, 858, 336, 700, 356, C.muted);
  E('circle', { cx: 975, cy: 330, r: 118, fill: '#10283A', stroke: C.muted, 'stroke-width': 3 }, inset);
  const bigR = G(inset); tr(bigR, 975, 330);
  E('ellipse', { rx: 78, ry: 46, fill: ball('#FF6B74', '#B8283A'), stroke: '#FFD0D5', 'stroke-width': 3 }, bigR);
  E('ellipse', { rx: 38, ry: 18, fill: 'rgba(90,10,30,0.3)' }, bigR);
  const bigO2 = [[-54, -40, -20], [46, -42, 16], [-58, 36, 22], [52, 38, -14]].map(([x, y, r]) => { const g = G(bigR); tr(molO2(g, 12), 0, 0, 1, r); return { g, x, y }; });
  const inLab1 = T(inset, 975, 496, 'red blood cell', { size: 32, weight: 700, anchor: 'middle', fill: '#FF8A94' });
  const inLab2 = T(inset, 975, 538, '**haemoglobin** holds the oxygen', { size: 27, weight: 500, anchor: 'middle', boldFill: '#FF9A8F' });
  const toBody = G(root);
  arrow(toBody, 688, 196, 688, 112, { color: '#FF8A94', width: 7 });
  T(toBody, 706, 150, 'to your body', { size: 28, weight: 700, fill: '#FF8A94' });
  // no pump; the concentration gradient
  const pumpG = G(root);
  const pumpArt = G(pumpG); tr(pumpArt, 852, 250);
  E('rect', { x: -46, y: 50, width: 92, height: 12, rx: 6, fill: '#7F96A8' }, pumpArt);
  E('rect', { x: -18, y: -40, width: 36, height: 92, rx: 9, fill: ball('#A8BAC8', '#5E7384'), stroke: '#C9D6DE', 'stroke-width': 2.5 }, pumpArt);
  E('line', { x1: 0, y1: -40, x2: 0, y2: -66, stroke: '#C9D6DE', 'stroke-width': 6 }, pumpArt);
  E('rect', { x: -42, y: -78, width: 84, height: 14, rx: 7, fill: '#C9D6DE' }, pumpArt);
  E('path', { d: 'M18,38 C48,38 54,8 66,-8', fill: 'none', stroke: '#C9D6DE', 'stroke-width': 5, 'stroke-linecap': 'round' }, pumpArt);
  const pumpX = cross(pumpG, 42);
  const pumpLab = T(pumpG, 852, 352, 'no pump', { size: 28, weight: 600, anchor: 'middle', fill: C.muted });
  const passive = chip(pumpG, 'passive', { size: 32, fill: C.card2, stroke: C.energy, color: C.energy }); tr(passive, 1052, 250);
  const grad = G(root);
  T(grad, 968, 404, 'oxygen', { size: 28, weight: 700, anchor: 'middle', fill: O2C });
  const mAir = meter(grad, { w: 40, h: 170, vertical: true, color: O2C }); tr(mAir, 860, 424);
  const mBlood = meter(grad, { w: 40, h: 170, vertical: true, color: O2C }); tr(mBlood, 1036, 424);
  T(grad, 880, 632, 'in the air', { size: 26, weight: 600, anchor: 'middle', fill: C.air });
  T(grad, 1056, 632, 'in the blood', { size: 26, weight: 600, anchor: 'middle', fill: '#FF8A94' });
  const gArrow = arrow(grad, 912, 458, 1026, 546, { color: C.ink, width: 10 });
  const gLab = T(grad, 968, 694, 'concentration gradient', { size: 32, weight: 700, anchor: 'middle' });
  const steep = chip(root, 'kept steep', { size: 30, fill: C.card2, stroke: C.good, color: C.good }); tr(steep, 968, 330);

  /* ===== F. high on a mountain ===== */
  const Fm = G(root), CS = 1.15;
  const slopeY = x => 210 + 0.59 * (x - 300);
  E('path', { d: 'M-30,760 L-30,420 L300,210 L1230,759 L1230,760 Z', fill: '#2B4557', stroke: '#4F7086', 'stroke-width': 3, 'stroke-linejoin': 'round' }, Fm);
  E('path', { d: 'M300,210 L-30,420 L-30,760 L280,760 Z', fill: '#355468', opacity: 0.55 }, Fm);
  E('path', { d: 'M470,360 L560,392 M700,500 L820,540 M140,420 L220,402 M930,640 L1060,690', stroke: '#4F7086', 'stroke-width': 3, 'stroke-linecap': 'round', opacity: 0.6 }, Fm);
  E('path', { d: 'M300,210 L352,241 L334,250 L314,236 L294,258 L270,242 L248,243 Z', fill: '#EAF2F8', stroke: '#C9D6DE', 'stroke-width': 2, 'stroke-linejoin': 'round' }, Fm);
  const climbG = G(Fm);
  const climber = person(climbG, { shirt: '#E8603C', shorts: '#3E4F66' });
  const cbody = climber.firstChild;
  const tank = G(cbody); cbody.insertBefore(tank, cbody.firstChild);
  E('rect', { x: -36, y: -154, width: 24, height: 64, rx: 10, fill: ball('#F7B24A', '#B8741A'), stroke: '#FFD99A', 'stroke-width': 2 }, tank);
  E('rect', { x: -29, y: -162, width: 10, height: 10, rx: 3, fill: '#C9D6DE' }, tank);
  E('path', { d: 'M-24,-160 C-34,-186 -6,-196 12,-172', fill: 'none', stroke: '#C9D6DE', 'stroke-width': 3.5, 'stroke-linecap': 'round' }, cbody);
  E('ellipse', { cx: 15, cy: -169, rx: 8, ry: 7, fill: '#DDE6EC', stroke: '#9DB0BF', 'stroke-width': 2 }, cbody);
  const puffs = [0, 1, 2].map(() => E('ellipse', { rx: 14, ry: 9, fill: 'rgba(220,235,245,0.5)', stroke: 'rgba(240,248,252,0.75)', 'stroke-width': 2 }, Fm));
  const fastLab = T(Fm, 440, 224, 'breathe faster', { size: 30, weight: 700, anchor: 'middle', fill: C.air });
  const tankLab = G(Fm);
  T(tankLab, 670, 372, 'oxygen tank', { size: 28, weight: 700, fill: '#F7B24A' });
  const tankLead = E('line', { x1: 664, y1: 362, x2: 0, y2: 0, stroke: '#F7B24A', 'stroke-width': 3, 'stroke-linecap': 'round' }, tankLab);
  function breathBubble(cx, cy, n, label) {
    const g = G(Fm);
    E('circle', { cx, cy, r: 78, fill: 'rgba(159,216,255,0.10)', stroke: C.air, 'stroke-width': 3 }, g);
    const slots = [[0, 0], [-28, -2], [28, 2], [-14, -26], [16, -24], [-14, 26], [16, 26], [-42, 22], [42, -22], [-40, -28], [38, 30], [0, -48], [2, 48], [-50, 0]];
    slots.forEach(([x, y], i) => {
      if (i < n) E('circle', { cx: cx + x * 1.1, cy: cy + y * 1.1, r: 9, fill: ball(O2C, O2D) }, g);
      else E('circle', { cx: cx + x * 1.1, cy: cy + y * 1.1, r: 8, fill: 'none', stroke: '#FF9A8F', 'stroke-width': 2, 'stroke-dasharray': '4 4', opacity: 0.55 }, g);
    });
    T(g, cx, cy + 118, label, { size: 28, weight: 700, anchor: 'middle', fill: C.ink });
    return g;
  }
  const bubSea = breathBubble(880, 200, 14, 'sea level');
  const bubHigh = breathBubble(1080, 200, 7, 'high up');
  const fewer = T(Fm, 1080, 356, 'fewer O₂', { size: 26, weight: 600, anchor: 'middle', fill: '#FF9A8F' });

  /* ================= update ================= */
  const tNet = at('net'), tBlood = at('blood'), tRbc = at('rbc'), tPump = at('nopump'), tRef = at('refresh'), tAlt = at('altitude');
  const T_O2 = at('otwo') + 0.9, T_CO2 = at('cotwo') + 0.2, T_SPREAD = mid('diffusion', 0.42);
  const pushIn = (el, x, y, p) => { op(el, p); tr(el, x, y + (1 - easeOut(clamp(p))) * 14); };

  return t => {
    /* camera: from the cluster into one alveolus */
    const z = P(t, mid('net', 0.8), 1.7, ease);
    const K = Math.pow(ZK, z), px = lerp(HERO[0], O[0], z), py = lerp(HERO[1], O[1], z);
    const fA = 1 - clamp((z - 0.45) / 0.4);
    op(A, fA);
    if (fA > 0) {
      A.setAttribute('transform', `translate(${px.toFixed(1)} ${py.toFixed(1)}) scale(${K.toFixed(4)}) translate(${-HERO[0]} ${-HERO[1]})`);
      const side = 1 - clamp(z / 0.32);
      op(Av, side); op(An, side);
      nets.forEach((n, i) => op(n, P(t, tNet + 0.1 + i * 0.12, 0.5, linear)));
      op(labCap, P(t, mid('net', 0.3), 0.5, linear) * (1 - clamp(z / 0.2)));
      op(labAlv, P(t, mid('net', 0.5), 0.5, linear) * (1 - clamp(z / 0.2)));
      op(heroRing, P(t, mid('net', 0.64), 0.4, linear) * (1 - clamp((z - 0.3) / 0.3)));
      heroRing.setAttribute('stroke-dashoffset', (-t * 24).toFixed(1));
    }

    /* the close-up */
    const fB = clamp((z - 0.3) / 0.45) * (1 - P(t, tAlt - 0.1, 0.6, linear));
    op(B, fB);
    let pres = 26;
    if (fB > 0) {
      B.setAttribute('transform', z < 1 ? `translate(${px.toFixed(1)} ${py.toFixed(1)}) scale(${(K / ZK).toFixed(4)}) translate(${-O[0]} ${-O[1]})` : 'translate(0 0)');
      const front = LEN * P(t, tBlood + 0.1, 2.2, easeOut);
      blood.setAttribute('stroke-dashoffset', (1 - front / LEN).toFixed(4));
      // the blood turns red where it has picked up oxygen, and the red blood flows on up
      const k = P(t, T_O2 - 0.4, 1.4, linear), cF = clamp(offAt(Math.min(LEN, SQ[3] + V * Math.max(0, t - T_O2))), G3, 1);
      const bl = rgb(PL_BLUE, PL_BLUE, 0), rd = rgb(PL_BLUE, PL_RED, k), top = cF + 0.03 >= 1 ? rd : bl;
      [[0, bl], [G1, bl], [G3, rd], [cF, rd], [Math.min(1, cF + 0.03), top], [1, top]].forEach(([o, c], i) => { stops[i].setAttribute('offset', o.toFixed(4)); stops[i].setAttribute('stop-color', c); });

      op(wallGlow, win(t, at('otwo') + 0.1, at('cotwo') + 0.5, 0.5) * (0.45 + 0.25 * wave(t, 1.1)));
      // air in the sac
      pres = 0;
      DW.forEach(d => {
        const st = dwState(d, t);
        if (!st) { op(d.el, 0); return; }
        attr(d.el, 'cx', st[0]); attr(d.el, 'cy', st[1]); op(d.el, st[2]);
        if (d.red) pres += st[3];
      });

      // carbon dioxide in the blood, crossing into the sac and out through the bronchiole
      GB.forEach(g => {
        const sr = g.s0 + V * t, n = Math.floor(sr / LEN), s = sr - n * LEN, dq = s - g.sx;
        if (dq >= 0 && t - dq / V >= T_CO2) {
          const tau = dq / V;
          if (tau > 3.3) { op(g.el, 0); return; }
          const p = co2Out(g, tau); attr(g.el, 'cx', p[0]); attr(g.el, 'cy', p[1]); op(g.el, p[2]);
          return;
        }
        if (s > front - 8) { op(g.el, 0); return; }
        const p = capPt(s, g.off + calm * 3 * Math.sin(t * 2.3 + g.ph));
        attr(g.el, 'cx', p[0]); attr(g.el, 'cy', p[1]); op(g.el, 1);
      });

      // red blood cells, and the oxygen that hops onto them
      const hl = win(t, tRbc + 0.2, tPump + 0.1, 0.4);
      rbcs.forEach(r => {
        const sr = r.m * SPC + V * t, n = Math.floor(sr / LEN), s = sr - n * LEN;
        if (s > front - 12) { op(r.g, 0); r.spots.forEach(sp => { op(sp.el, 0); op(sp.tr, 0); }); return; }
        const c = capPt(s, 0);
        tr(r.g, c[0], c[1], 1, Math.atan2(c[2], -c[3]) * 180 / Math.PI); op(r.g, 1);
        let loaded = 0;
        r.spots.forEach((sp, q) => {
          if (q === 0) { const p = spotAt(s, 0); attr(sp.el, 'cx', p[0]); attr(sp.el, 'cy', p[1]); op(sp.el, 1); op(sp.tr, 0); return; }
          const dq = s - SQ[q], ta = t - dq / V;
          if (ta < T_O2 || dq < -V * FLY) { op(sp.el, 0); op(sp.tr, 0); return; }
          if (dq >= 0) { loaded++; const p = spotAt(s, q); attr(sp.el, 'cx', p[0]); attr(sp.el, 'cy', p[1]); attr(sp.el, 'r', 6); op(sp.el, 1); op(sp.tr, 0); return; }
          const u = 1 + dq / (V * FLY), p0 = flightStart(r.m, q, n), tg = spotAt(s, q), e = u;
          const x = lerp(p0[0], tg[0], e), y = lerp(p0[1], tg[1], e);
          attr(sp.el, 'cx', x); attr(sp.el, 'cy', y); attr(sp.el, 'r', (7 - e).toFixed(2)); op(sp.el, Math.min(1, u / 0.1));
          const u2 = u - TRAIL / FLY;
          let bx = p0[0], by = p0[1];
          if (u2 > 0) { const tg2 = spotAt(s - V * TRAIL, q), e2 = u2; bx = lerp(p0[0], tg2[0], e2); by = lerp(p0[1], tg2[1], e2); }
          attr(sp.tr, 'x1', bx); attr(sp.tr, 'y1', by); attr(sp.tr, 'x2', x); attr(sp.tr, 'y2', y); op(sp.tr, Math.min(1, u / 0.2));
        });
        r.disc.setAttribute('fill', rgb(RBC_BLUE, RBC_RED, loaded / 3));
        r.disc.setAttribute('stroke-width', (1.5 + 2.5 * hl).toFixed(2));
      });
    }
    op(labClose, win(t, at('diffusion') + 0.45, tBlood + 0.2, 0.4));

    /* diffusion demo */
    const fD = win(t, mid('diffusion', 0.16), tBlood + 0.15, 0.4);
    op(Dm, fD);
    if (fD > 0) {
      op(dTitle, P(t, mid('diffusion', 0.2), 0.4, linear));
      const hl2 = P(t, mid('diffusion', 0.3), 0.4, linear) * (1 - P(t, T_SPREAD + 2.6, 0.5, linear));
      op(dHigh, hl2); op(dLow, hl2);
      op(dRule, P(t, mid('diffusion', 0.6), 0.5, linear));
      op(divider, 1 - P(t, T_SPREAD - 0.2, 0.4, linear));
      dDots.forEach(d => {
        const sp = P(t, T_SPREAD + d.d, 2.4, ease), wob = Math.sin(sp * Math.PI) * 16;
        attr(d.el, 'cx', lerp(d.x0, d.x1, sp) + calm * 4 * Math.sin(t * 3.1 + d.ph));
        attr(d.el, 'cy', lerp(d.y0, d.y1, sp) + wob * Math.sin(d.ph * 3) + calm * 4 * Math.cos(t * 2.7 + d.ph * 1.3));
      });
    }

    /* labels: what is in the blood and in the air, and the swap */
    op(bloodLab, win(t, mid('blood', 0.42), tRbc + 0.1, 0.4));
    op(airLab, win(t, mid('air', 0.25), tRbc + 0.1, 0.4));
    op(key, win(t, mid('blood', 0.3), tPump + 0.1, 0.4));
    pushIn(chipO, 980, 330, win(t, mid('otwo', 0.3), tRbc + 0.1, 0.4));
    pushIn(chipC, 980, 410, win(t, mid('cotwo', 0.25), tRbc + 0.1, 0.4));
    const fOut = win(t, mid('cotwo', 0.4), tRbc + 0.5, 0.4);
    op(outArrow, fOut * (0.6 + 0.4 * wave(t, 1.2))); outArrow.set(P(t, mid('cotwo', 0.4), 0.6)); op(outLab, fOut);
    const b1 = win(t, tRef + 0.9, tRef + 2.2, 0.35), b2 = win(t, tRef + 3.6, tRef + 4.9, 0.35);
    op(inArrow, Math.max(b1, b2) * fB); inArrow.set(b1 > 0 ? P(t, tRef + 0.9, 0.6) : P(t, tRef + 3.6, 0.6));
    op(inLab, win(t, tRef + 0.8, tAlt + 0.3, 0.4));

    /* red blood cells and haemoglobin */
    const fI = win(t, mid('rbc', 0.12), tPump + 0.1, 0.4);
    op(inset, fI);
    if (fI > 0) {
      bigO2.forEach((o, i) => { const p = P(t, mid('rbc', 0.38 + i * 0.07), 0.5, pop), kk = 1 + (1 - clamp(p)) * 0.8; op(o.g, clamp(p * 2)); tr(o.g, o.x * kk, o.y * kk, Math.max(0.01, p)); });
      op(inLab1, P(t, mid('rbc', 0.15), 0.4, linear)); op(inLab2, P(t, mid('rbc', 0.42), 0.4, linear));
      tr(bigR, 975, 330 + (S.reduce ? 0 : 3 * Math.sin(t * 2)));
    }
    op(toBody, win(t, mid('rbc', 0.72), tPump + 0.1, 0.35));

    /* no pump: the concentration gradient, kept steep by breathing */
    const fP = win(t, tPump + 0.05, tRef + 0.1, 0.4);
    op(pumpG, fP);
    if (fP > 0) {
      const pp = P(t, tPump + 0.1, 0.5, pop); tr(pumpArt, 852, 250, Math.max(0.01, 0.6 + 0.4 * pp));
      const xp = P(t, mid('nopump', 0.16), 0.35, easeOut); op(pumpX, xp); tr(pumpX, 852, 250, 0.4 + 0.6 * xp);
      op(pumpLab, P(t, mid('nopump', 0.18), 0.4, linear));
      const cp = P(t, mid('nopump', 0.33), 0.5, pop); op(passive, clamp(cp * 2)); tr(passive, 1052, 250, Math.max(0.01, 0.7 + 0.3 * cp));
    }
    const fG = win(t, mid('nopump', 0.52), tAlt + 0.3, 0.4);
    op(grad, fG);
    if (fG > 0) {
      const g0 = P(t, mid('nopump', 0.55), 0.9, easeOut);
      mAir.set(0.85 * pres / 26 * g0); mBlood.set(0.25 * g0);
      gArrow.set(P(t, mid('nopump', 0.68), 0.6)); op(gLab, P(t, mid('nopump', 0.76), 0.4, linear));
    }
    pushIn(steep, 968, 330, win(t, mid('refresh', 0.42), tAlt + 0.3, 0.4));

    /* high on a mountain */
    const fF = P(t, tAlt - 0.1, 0.6, linear);
    op(Fm, fF);
    if (fF > 0) {
      const cx = lerp(625, 595, P(t, tAlt, end('altitude') - tAlt + 0.6, linear)), cy = slopeY(cx);
      climbG.setAttribute('transform', `translate(${cx.toFixed(1)} ${cy.toFixed(1)}) scale(${-CS} ${CS})`);
      climber.pose(walkPose(t, 0.7));
      const tf = mid('altitude', 0.52), ph = t < tf ? (t - tAlt) / 2.4 : (tf - tAlt) / 2.4 + (t - tf) / 0.9;
      const mx = cx - CS * 15, my = cy - CS * 169;
      puffs.forEach((pf, i) => {
        const q = ((ph + i / 3) % 1 + 1) % 1, on = t < tf ? (i === 0 ? 1 : 0) : 1;
        tr(pf, mx - 12 - 80 * q, my - 10 - 24 * q, 0.6 + 0.8 * q);
        op(pf, on * Math.sin(q * Math.PI) * 0.9 * P(t, tAlt + 0.3, 0.4, linear));
      });
      op(fastLab, P(t, mid('altitude', 0.55), 0.4, linear));
      op(tankLab, P(t, mid('altitude', 0.78), 0.4, linear));
      attr(tankLead, 'x2', cx + CS * 24); attr(tankLead, 'y2', cy - CS * 122);
      op(bubSea, P(t, mid('altitude', 0.1), 0.5, linear));
      op(bubHigh, P(t, mid('altitude', 0.22), 0.5, linear));
      op(fewer, P(t, mid('altitude', 0.34), 0.4, linear));
    }
  };
});
