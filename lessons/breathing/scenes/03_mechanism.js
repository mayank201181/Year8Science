/* Chapter 3, How you breathe in and out.
   The lungs alone (no muscles of their own) -> the rule: gas moves from high to low pressure
   -> breathing in: the diaphragm flattens, the ribs swing up and out, the chest volume rises, the air inside
   spreads out so its pressure falls, and the air outside pushes in (showpiece) -> breathing out, the reverse
   -> the chain -> quiet breathing out is passive -> "IN: dips, rise, rises, dips" -> the bottle model
   -> on the Moon there is no air to push in. */
scene('mechanism', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.3 : 1;

  /* ---------- colours for this chapter ---------- */
  const BONE = '#EFE7D4', BONE_DK = '#8F8370';
  const MUS = '#9C3449', MUS_ON = '#FF6A84', MUS_LT = '#F6A0B0';
  const VOLC = '#7EE0B5';                          // chest-volume meter
  const AIRDK = '#3D7DB0';                         // shading of the air dots (as Heat's gas particles)
  const SKIN = '#C98E62', SKIN_LT = '#E8B48E';

  /* ---------- small helpers ---------- */
  const hex = c => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16));
  const mix = (a, b, p) => { const A = hex(a), B = hex(b); p = clamp(p); return 'rgb(' + A.map((v, i) => Math.round(v + (B[i] - v) * p)).join(',') + ')'; };
  const q2 = (a, c, b, u) => { const v = 1 - u; return [v * v * a[0] + 2 * v * u * c[0] + u * u * b[0], v * v * a[1] + 2 * v * u * c[1] + u * u * b[1]]; };
  const fx = v => v.toFixed(1);
  const bump = (t, t0, dur) => Math.sin(Math.PI * P(t, t0, dur, linear));
  const bounce = (u, a, b) => { const L = b - a, m = ((u - a) % (2 * L) + 2 * L) % (2 * L); return a + (m < L ? m : 2 * L - m); };
  /* position along a polyline, u 0..1 by length */
  function along(pts, u) {
    let L = 0; const seg = [];
    for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(l); L += l; }
    let d = clamp(u) * L;
    for (let i = 0; i < seg.length; i++) { if (d <= seg[i] || i === seg.length - 1) { const f = seg[i] ? clamp(d / seg[i]) : 0; return [lerp(pts[i][0], pts[i + 1][0], f), lerp(pts[i][1], pts[i + 1][1], f)]; } d -= seg[i]; }
    return pts[pts.length - 1];
  }
  /* a word whose letter i glows: g.glow is the halo behind the i */
  function iWord(parent, x, y, word, size) {
    const g = G(parent), k = word.indexOf('i');
    const pre = word.slice(0, k), w = textWidth(word, size, FD, 700), wp = pre ? textWidth(pre, size, FD, 700) : 0, wi = textWidth('i', size, FD, 800);
    g.glow = E('ellipse', { cx: x - w / 2 + wp + wi / 2, cy: y - size * 0.34, rx: size * 0.55, ry: size * 0.7, fill: glow(C.energy) }, g);
    T(g, x, y, pre + '**i**' + word.slice(k + 1), { size, weight: 700, anchor: 'middle', boldFill: C.energy });
    return g;
  }
  /* a heading line, centred over the right-hand panel */
  const PX = 895;
  const heading = (txt, size) => { const g = G(root); T(g, PX, 150, txt, { size: size || 50, weight: 700, anchor: 'middle' }); op(g, 0); return g; };

  /* ================= the chest (front view), centred at (CX, CY) ================= */
  const CX = 330, CY = 400;
  const chest = G(root); tr(chest, CX, CY);
  const cav = E('path', { fill: C.air, 'fill-opacity': 0.06, stroke: C.air, 'stroke-opacity': 0.3, 'stroke-width': 2 }, chest);
  const frameG = G(chest);                                // ribs, intercostals, diaphragm: assembled in "rule"
  const bandG = G(frameG), ribG = G(frameG);
  const lungG = G(chest);
  const lg = lungs(lungG, 1);
  const diaG = G(chest);                                  // the diaphragm sits in front of the lung bases

  // ribs on the right side: [inner end, control, outer end]; the left side mirrors them
  const RIBS = [
    [[40, -122], [104, -142], [128, -92]],
    [[46, -74], [130, -100], [160, -38]],
    [[52, -24], [146, -50], [176, 18]],
    [[58, 26], [154, 0], [182, 72]],
    [[64, 76], [158, 52], [182, 124]],
    [[70, 124], [154, 104], [172, 170]],
  ];
  /* rib i with the ribcage raised by r (0 rest .. 1 up and out); side 1 right, -1 left */
  function ribPts(i, r, side) {
    const [A, Q, B] = RIBS[i];
    const ang = -(10 - i * 1.2) * r * Math.PI / 180, ca = Math.cos(ang), sa = Math.sin(ang);
    const dx = 16 * r, dy = -(6 - i * 0.6) * r;
    const f = p => { const x = p[0] - A[0], y = p[1] - A[1]; return [A[0] + x * ca - y * sa + dx, A[1] + x * sa + y * ca + dy]; };
    const a = [A[0] + dx, A[1] + dy], q = f(Q), b = f(B);
    return side > 0 ? [a, q, b] : [[-a[0], a[1]], [-q[0], q[1]], [-b[0], b[1]]];
  }
  /* top edge of the diaphragm for flattening d (0 domed .. 1 flat) and ribs r */
  // relaxed: an arch rising under the middle of the chest; contracted: almost flat, and lower
  const DU = [-1, -0.85, -0.62, -0.34, 0, 0.34, 0.62, 0.85, 1], DRISE = [0, 22, 44, 60, 66, 60, 44, 22, 0], DFLAT = [0, 186, 187, 188, 188, 188, 187, 186, 0];
  function diaTop(d, r) {
    const b5 = ribPts(5, r, 1)[2], ex = b5[0] + 4, ey = b5[1] + 24;
    return DU.map((u, k) => [u * ex, k === 0 || k === 8 ? ey : lerp(ey - DRISE[k], DFLAT[k], d)]);
  }
  const DTH = [14, 18, 22, 25, 26, 25, 22, 18, 14];       // diaphragm thickness along its length
  const diaAt79 = d => lerp(142, 187, d);                  // top of the diaphragm under the middle of each lung
  function bandPath(top, th) {
    const bot = top.map((p, k) => [p[0], p[1] + th[k]]).reverse();
    return openPath(top) + ' L' + fx(bot[0][0]) + ',' + fx(bot[0][1]) + openPath(bot).replace(/^M[^C]*/, '') + 'Z';
  }
  /* the chest cavity: inside the ribs, above the diaphragm */
  function cavPts(d, r) {
    const R = [];
    for (let i = 0; i < 6; i++) { const [a, q, b] = ribPts(i, r, 1); const p = q2(a, q, b, 0.9); R.push([p[0] - 12, p[1] + 4]); }
    const top = diaTop(d, r);
    const floor = [[top[8][0] - 10, top[8][1] - 4]].concat(top.slice(1, 8).reverse().map(p => [p[0], p[1] - 2]), [[top[0][0] + 10, top[0][1] - 4]]);
    return [[-46, -138], [46, -138]].concat(R, floor, R.slice().reverse().map(p => [-p[0], p[1]]));
  }

  const ribEls = [], bandEls = [], fibreEls = [];
  [1, -1].forEach(side => {
    for (let i = 0; i < 5; i++) { bandEls.push({ side, i, el: E('path', { stroke: '#6E2232', 'stroke-width': 1.5, 'stroke-linejoin': 'round' }, bandG) }); fibreEls.push({ side, i, el: E('path', { fill: 'none', stroke: '#5A1A28', 'stroke-width': 2, opacity: 0.55, 'stroke-linecap': 'round' }, bandG) }); }
    for (let i = 0; i < 6; i++) {
      const g = G(ribG);
      ribEls.push({ side, i, g, base: E('path', { fill: 'none', stroke: BONE_DK, 'stroke-width': 13, 'stroke-linecap': 'round' }, g), core: E('path', { fill: 'none', stroke: BONE, 'stroke-width': 8, 'stroke-linecap': 'round' }, g) });
    }
  });
  const dia = E('path', { stroke: '#5E1A2A', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, diaG);
  const diaFib = E('path', { fill: 'none', stroke: '#5A1A28', 'stroke-width': 2, opacity: 0.5, 'stroke-linecap': 'round' }, diaG);
  const diaHi = E('path', { fill: 'none', stroke: MUS_LT, 'stroke-width': 3, opacity: 0.55, 'stroke-linecap': 'round' }, diaG);
  const ghost = E('path', { d: closedPath(cavPts(0, 0)), fill: 'none', stroke: C.ink, 'stroke-width': 3, 'stroke-dasharray': '10 8', opacity: 0.75 }, chest);

  function drawChest(d, r, gd, gi) {
    const ribs = {};
    ribEls.forEach(o => {
      const [a, q, b] = ribPts(o.i, r, o.side); ribs[o.side + ':' + o.i] = [a, q, b];
      const dd = `M${fx(a[0])},${fx(a[1])} Q${fx(q[0])},${fx(q[1])} ${fx(b[0])},${fx(b[1])}`;
      o.base.setAttribute('d', dd); o.core.setAttribute('d', dd);
    });
    const bandFill = mix(MUS, MUS_ON, gi);
    bandEls.forEach((o, k) => {
      const A = ribs[o.side + ':' + o.i], B = ribs[o.side + ':' + (o.i + 1)], pa = [], pb = [];
      for (let s = 0; s <= 6; s++) { const u = 0.3 + 0.7 * s / 6; pa.push(q2(A[0], A[1], A[2], u)); pb.push(q2(B[0], B[1], B[2], u)); }
      o.el.setAttribute('d', 'M' + pa.concat(pb.reverse()).map(p => fx(p[0]) + ',' + fx(p[1])).join(' L') + 'Z');
      o.el.setAttribute('fill', bandFill);
      const f = fibreEls[k]; let fd = '';
      [0.48, 0.64, 0.8].forEach(u => { const p = q2(A[0], A[1], A[2], u + 0.03), s2 = q2(B[0], B[1], B[2], u - 0.05); fd += `M${fx(p[0])},${fx(p[1] + 5)} L${fx(s2[0])},${fx(s2[1] - 5)} `; });
      f.el.setAttribute('d', fd);
    });
    const top = diaTop(d, r);
    dia.setAttribute('d', bandPath(top, DTH));
    dia.setAttribute('fill', mix(MUS, MUS_ON, gd));
    diaHi.setAttribute('d', openPath(top.slice(1, 8).map(p => [p[0], p[1] + 4])));
    diaFib.setAttribute('d', [0.4, 0.7].map(f => openPath(top.slice(1, 8).map((p, k) => [p[0], p[1] + DTH[k + 1] * f]))).join(' '));
    cav.setAttribute('d', closedPath(cavPts(d, r)));
  }

  /* ---------- air inside the lungs: small light-blue dots ---------- */
  const LOBE = [[-30, -70], [-70, -90], [-128, -40], [-132, 40], [-136, 110], [-112, 150], [-70, 152], [-40, 154], [-22, 130], [-20, 90], [-18, 40], [-10, -20], [-30, -70]];
  const lobePoly = [];
  for (let s = 0; s < 4; s++) {
    const p0 = LOBE[s * 3], c1 = LOBE[s * 3 + 1], c2 = LOBE[s * 3 + 2], p1 = LOBE[s * 3 + 3];
    for (let k = 0; k < 10; k++) { const u = k / 10, v = 1 - u; lobePoly.push([v * v * v * p0[0] + 3 * v * v * u * c1[0] + 3 * v * u * u * c2[0] + u * u * u * p1[0], v * v * v * p0[1] + 3 * v * v * u * c1[1] + 3 * v * u * u * c2[1] + u * u * u * p1[1]]); }
  }
  const inPoly = (x, y, poly) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const xi = poly[i][0], yi = poly[i][1], xj = poly[j][0], yj = poly[j][1]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c; } return c; };
  const inLobe = (x, y, m) => { if (!inPoly(x, y, lobePoly)) return false; for (let k = 0; k < 8; k++) { const a = k * TAU / 8; if (!inPoly(x + Math.cos(a) * m, y + Math.sin(a) * m, lobePoly)) return false; } return true; };
  let lobeCx = 0, lobeCy = 0; lobePoly.forEach(p => { lobeCx += p[0] / lobePoly.length; lobeCy += p[1] / lobePoly.length; });
  function scatter(list, n, seed, dmin, x0, x1, y0, y1, ok) {
    const r = rng(seed);
    for (let tries = 0, got = 0; got < n && tries < 6000; tries++) {
      const x = lerp(x0, x1, r()), y = lerp(y0, y1, r());
      if (!ok(x, y) || list.some(p => Math.hypot(p[0] - x, p[1] - y) < dmin)) continue;
      list.push([x, y]); got++;
    }
    return list;
  }
  const lobeOk = (x, y) => inLobe(x, y, 11);
  const leftPts = scatter([], 9, 31, 32, -132, -20, -90, 154, lobeOk);          // residents: the air already in the lungs
  scatter(leftPts, 8, 47, 22, -132, -20, -90, 154, lobeOk);                     // targets for the air that rushes in
  const rightPts = scatter([], 9, 53, 32, -132, -20, -90, 154, lobeOk);
  scatter(rightPts, 8, 59, 22, -132, -20, -90, 154, lobeOk);
  const dotG = G(lungG), cloudG = G(chest);
  const mkDot = (parent, r) => E('circle', { r: r || 6.5, fill: ball(C.air, AIRDK) }, parent);
  const inDots = [];
  [[leftPts, -1], [rightPts, 1]].forEach(([pts, side]) => pts.forEach((p, k) => inDots.push({
    el: mkDot(dotG), side, x: side < 0 ? p[0] : -p[0], y: p[1], rush: k >= 9, j: k >= 9 ? 2 * (k - 9) + (side > 0 ? 1 : 0) : -1,
    ph: (k * 1.7 + (side > 0 ? 0.9 : 0)) % TAU, sx: [-58, -30, 0, 30, 58][k % 5] * 1.2,
  })));
  const cloudPts = scatter([], 18, 71, 26, -138, 138, -258, -186, () => true);
  const cloud = cloudPts.map((p, k) => ({ el: mkDot(cloudG), x: p[0], y: p[1], ph: k * 2.3 }));

  /* ---------- arrows on the chest ---------- */
  const arrG = G(chest);
  const mvA = (x1, y1, x2, y2, o) => { const a = arrow(arrG, x1, y1, x2, y2, Object.assign({ color: C.ink, width: 7 }, o || {})); op(a, 0); return a; };
  const diaDown = mvA(0, 228, 0, 284), diaUp = mvA(0, 284, 0, 228);
  const ribOutR = mvA(214, 70, 252, 16, { bend: -12 }), ribOutL = mvA(-214, 70, -252, 16, { bend: 12 });
  const ribInR = mvA(252, 16, 214, 70, { bend: 12 }), ribInL = mvA(-252, 16, -214, 70, { bend: -12 });
  const airA = (x1, y1, x2, y2, bend) => { const a = arrow(arrG, x1, y1, x2, y2, { color: C.air, width: 7, bend }); op(a, 0); return a; };
  const airIn = [airA(0, -268, 0, -172), airA(-104, -252, -24, -180, -14), airA(104, -252, 24, -180, 14)];
  const airOut = [airA(0, -172, 0, -268), airA(-24, -180, -104, -252, 14), airA(24, -180, 104, -252, -14)];
  const springA = [[118, 30, 88, 30], [-118, 30, -88, 30], [70, 132, 70, 104], [-70, 132, -70, 104]].map(([a, b, c, d]) => { const s = arrow(arrG, a, b, c, d, { color: C.ink, width: 5 }); op(s, 0); return s; });

  /* ================= nomuscle: a flexed arm, crossed out ================= */
  const lungLbl = T(root, CX, 612, 'your lungs', { size: 30, weight: 600, anchor: 'middle', fill: C.muted });
  const armG = G(root);
  const arm = G(armG);
  E('rect', { x: -160, y: 20, width: 62, height: 64, rx: 12, fill: ball('#7FA8F5', '#3F6FD0') }, arm);
  E('path', { d: 'M-104,52 L14,52', stroke: SKIN, 'stroke-width': 50, 'stroke-linecap': 'round' }, arm);
  E('path', { d: 'M14,52 L40,-58', stroke: SKIN, 'stroke-width': 44, 'stroke-linecap': 'round' }, arm);
  E('ellipse', { cx: -40, cy: 22, rx: 56, ry: 42, fill: ball(SKIN_LT, SKIN) }, arm);
  E('circle', { cx: 44, cy: -84, r: 33, fill: ball(SKIN_LT, SKIN) }, arm);
  E('path', { d: 'M24,-104 Q44,-112 64,-100 M22,-86 Q44,-94 68,-84', fill: 'none', stroke: '#9A6440', 'stroke-width': 3.5, 'stroke-linecap': 'round' }, arm);
  const armX = cross(armG, 72); tr(armX, -36, -14);
  const armLbl = G(root);
  T(armLbl, PX, 500, 'lungs have **no muscles**', { size: 36, weight: 600, anchor: 'middle', boldFill: '#FF9AA5' });
  T(armLbl, PX, 542, 'to pull air in', { size: 30, weight: 600, anchor: 'middle', fill: C.muted });

  /* ================= rule: gas moves from high to low pressure ================= */
  const ruleG = G(root);
  const BX0 = 645, BX1 = 1145, BY0 = 235, BY1 = 425, WX = 895, GY0 = 302, GY1 = 358;
  E('rect', { x: BX0, y: BY0, width: BX1 - BX0, height: BY1 - BY0, rx: 12, fill: 'rgba(200,230,250,0.06)', stroke: GLASS.stroke, 'stroke-width': 3 }, ruleG);
  E('path', { d: `M${WX},${BY0} L${WX},${GY0} M${WX},${GY1} L${WX},${BY1}`, stroke: GLASS.stroke, 'stroke-width': 8, 'stroke-linecap': 'round' }, ruleG);
  const boxDots = [], brr = rng(83);
  for (let k = 0; k < 24; k++) {
    const left = k < 18, vx = brr() - 0.5, vy = brr() - 0.5, L = Math.hypot(vx, vy) || 1;
    boxDots.push({ el: mkDot(ruleG, 9), left, x: left ? lerp(660, 875, brr()) : lerp(915, 1130, brr()), y: lerp(250, 410, brr()), vx: vx / L, vy: vy / L, gy: lerp(314, 346, brr()) });
  }
  [0, 3, 6, 9, 12, 15].forEach((k, j) => { boxDots[k].mover = j; });
  const gasArrow = arrow(ruleG, 800, 214, 990, 214, { bend: -26, color: C.ink, width: 6 });
  T(ruleG, PX, 176, 'gas moves', { size: 30, weight: 600, anchor: 'middle', fill: C.muted });
  T(ruleG, 768, 472, '**high** pressure', { size: 32, weight: 600, anchor: 'middle' });
  T(ruleG, 1022, 472, '**low** pressure', { size: 32, weight: 600, anchor: 'middle' });
  T(ruleG, 768, 506, 'crowded', { size: 24, weight: 500, anchor: 'middle', fill: C.muted });
  T(ruleG, 1022, 506, 'spread out', { size: 24, weight: 500, anchor: 'middle', fill: C.muted });
  // the parts that do the work, named as the frame assembles
  const nameG = G(root);
  const rib1 = q2(...RIBS[1], 0.8), band23 = [lerp(q2(...RIBS[2], 0.85)[0], q2(...RIBS[3], 0.85)[0], 0.5), lerp(q2(...RIBS[2], 0.85)[1], q2(...RIBS[3], 0.85)[1], 0.5)];
  labelLine(nameG, 575, 318, CX + rib1[0], CY + rib1[1], 'ribs', { size: 30 });
  labelLine(nameG, 575, 436, CX + band23[0], CY + band23[1], 'intercostal muscles', { size: 30, fill: '#FF9AAE' });
  labelLine(nameG, 575, 616, CX + 132, CY + 176, 'diaphragm', { size: 30, fill: '#FF9AAE' });

  /* ================= right panel: headings, labels, meters ================= */
  const hIn = heading('Breathing in'), hOut = heading('Breathing out'), hChain = heading('Remember the chain', 44);
  const hPas = G(root); const pasChip = chip(hPas, 'passive', { size: 40, fill: '#123B2E', stroke: C.good, color: C.good }); tr(pasChip, PX, 136); op(hPas, 0);
  const hDips = G(root);
  {
    const s = 50, w = textWidth('Breathing IN', s, FD, 700), wIN = textWidth('IN', s, FD, 700), wI = textWidth('I', s, FD, 800);
    hDips.glow = E('ellipse', { cx: PX - w / 2 + (w - wIN) + wI / 2, cy: 150 - s * 0.36, rx: s * 0.5, ry: s * 0.75, fill: glow(C.energy) }, hDips);
    T(hDips, PX, 150, 'Breathing **I**N', { size: s, weight: 700, anchor: 'middle', boldFill: C.energy });
    op(hDips, 0);
  }
  const lblA = (txt, sub) => { const g = G(root); T(g, 362, 656, txt, { size: 30, weight: 600, boldFill: C.energy }); T(g, 362, 690, sub, { size: 24, weight: 500, fill: C.muted }); op(g, 0); return g; };
  const lblB = (txt, sub) => { const g = G(root); T(g, PX, 614, txt, { size: 30, weight: 600, anchor: 'middle', boldFill: C.energy }); T(g, PX, 648, sub, { size: 24, weight: 500, anchor: 'middle', fill: C.muted }); op(g, 0); return g; };
  const aIn = lblA('diaphragm **contracts**', 'flattens and moves down'), aOut = lblA('diaphragm **relaxes**', 'domes back up');
  const bIn = lblB('intercostals **contract**', 'ribs move up and out'), bOut = lblB('intercostals **relax**', 'ribs drop down and in');
  const MY = 215, MH = 240, MKY = MY + MH * 0.5;
  const volG = G(root), presG = G(root);
  const volM = meter(volG, { w: 48, h: MH, vertical: true, color: VOLC }); tr(volM, 746, MY);
  T(volG, 770, 492, 'volume', { size: 30, weight: 700, anchor: 'middle', fill: VOLC });
  T(volG, 770, 522, 'of your chest', { size: 24, weight: 500, anchor: 'middle', fill: C.muted });
  const presM = meter(presG, { w: 48, h: MH, vertical: true, color: C.air }); tr(presM, 966, MY);
  T(presG, 990, 492, 'pressure', { size: 30, weight: 700, anchor: 'middle', fill: C.air });
  T(presG, 990, 522, 'inside', { size: 24, weight: 500, anchor: 'middle', fill: C.muted });
  E('line', { x1: 954, y1: MKY, x2: 1030, y2: MKY, stroke: C.ink, 'stroke-width': 3.5, 'stroke-dasharray': '8 6' }, presG);
  T(presG, 1036, MKY + 9, 'air outside', { size: 26, weight: 600 });
  const mArr = (g, x, up, col) => { const a = up ? arrow(g, x, 410, x, 300, { color: col, width: 6 }) : arrow(g, x, 300, x, 410, { color: col, width: 6 }); op(a, 0); return a; };
  const volUp = mArr(volG, 716, true, VOLC), volDn = mArr(volG, 716, false, VOLC), presUp = mArr(presG, 936, true, C.air), presDn = mArr(presG, 936, false, C.air);
  const airLbl = T(root, 560, 196, 'air outside', { size: 30, weight: 700, fill: C.air });
  const pushLbl = T(root, 560, 234, '**pushes** it in', { size: 28, weight: 600, boldFill: C.energy });
  // the chain: two rows that light up word by word
  const chainG = G(root);
  const ROWS = [
    { y: 612, segs: [['volume ↑', VOLC], ['pressure ↓', C.air], ['air in', C.ink]], at: [0.2, 0.32, 0.46] },
    { y: 676, segs: [['volume ↓', VOLC], ['pressure ↑', C.air], ['air out', C.ink]], at: [0.58, 0.7, 0.84] },
  ].map(row => {
    const size = 30, gap = 14, aw = 34, ws = row.segs.map(s => textWidth(s[0], size, FD, 700));
    let x = PX - (ws[0] + ws[1] + ws[2] + 2 * (aw + 2 * gap)) / 2;
    const parts = row.segs.map((s, k) => {
      const g = G(chainG), cx = x + ws[k] / 2;
      T(g, cx, row.y, s[0], { size, weight: 700, anchor: 'middle', fill: s[1] });
      x += ws[k];
      let a = null;
      if (k < 2) { a = arrow(chainG, x + gap, row.y - 10, x + gap + aw, row.y - 10, { color: C.muted, width: 4 }); x += aw + 2 * gap; }
      return { g, cx, a };
    });
    return { parts, at: row.at, y: row.y };
  });
  const pasLbl = G(root);
  T(pasLbl, PX, 622, 'stretched lungs **spring back**', { size: 30, weight: 600, anchor: 'middle', boldFill: C.good });
  T(pasLbl, PX, 658, 'no muscle effort needed', { size: 24, weight: 500, anchor: 'middle', fill: C.muted });
  const dipsW = [iWord(root, 262, 668, 'dips', 38), iWord(root, 88, 342, 'rise', 38), iWord(root, 770, 586, 'rises', 38), iWord(root, 990, 586, 'dips', 38)];
  dipsW.forEach((g, k) => { g.cx = [262, 88, 770, 990][k]; g.cy = [655, 329, 573, 573][k]; });

  /* ================= the bottle model ================= */
  const BC = 600, SHEET_Y = 520;
  const modelG = G(root);
  const homeChip = chip(modelG, 'Try it at home', { size: 30, fill: C.card2, stroke: C.energy, color: C.energy }); tr(homeChip, 990, 150);
  const BOTTLE = 'M480,520 L480,300 Q480,252 532,241 L566,232 Q576,229 576,219 L576,192 L624,192 L624,219 Q624,229 634,232 L668,241 Q720,252 720,300 L720,520';
  const bodyFill = G(modelG);
  E('path', { d: BOTTLE + ' Z', fill: GLASS.fill }, bodyFill);
  E('path', { d: 'M497,300 Q497,270 516,258', fill: 'none', stroke: 'rgba(255,255,255,0.22)', 'stroke-width': 6, 'stroke-linecap': 'round' }, bodyFill);
  E('rect', { x: 494, y: 318, width: 6, height: 150, rx: 3, fill: 'rgba(255,255,255,0.12)' }, bodyFill);
  const balloonG = G(modelG);
  const bal = E('ellipse', { cx: BC, cy: 360, rx: 22, ry: 34, fill: ball('#FF7A90', '#C2415A'), stroke: '#FFC2CD', 'stroke-width': 3 }, balloonG);
  const wrinkles = E('path', { d: 'M590,346 Q596,360 589,376 M610,350 Q604,366 611,382', fill: 'none', stroke: '#B03650', 'stroke-width': 2.5, 'stroke-linecap': 'round' }, balloonG);
  E('rect', { x: BC - 9, y: 316, width: 18, height: 16, rx: 4, fill: '#E2566F' }, balloonG);
  const straw = G(modelG);
  E('rect', { x: BC - 7, y: 118, width: 14, height: 206, rx: 4, fill: '#F4F7FA', stroke: '#BFD9E6', 'stroke-width': 2 }, straw);
  E('path', { d: [130, 160, 250, 280].map(y => `M${BC - 6},${y + 8} L${BC + 6},${y}`).join(' '), stroke: '#FF6B7A', 'stroke-width': 3.5, 'stroke-linecap': 'round' }, straw);
  E('rect', { x: BC - 34, y: 177, width: 68, height: 24, rx: 8, fill: ball('#E7B35A', '#A8741F'), stroke: '#F6D49A', 'stroke-width': 2 }, straw);
  const bottle = E('path', { d: BOTTLE, fill: 'none', stroke: GLASS.stroke, 'stroke-width': 5, 'stroke-linejoin': 'round', 'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': '1 1' }, modelG);
  const sheetG = G(modelG);
  const sheetFill = E('path', { fill: GLASS.fill }, sheetG);
  const sheet = E('path', { fill: 'none', stroke: '#5AA8FF', 'stroke-width': 10, 'stroke-linecap': 'round' }, sheetG);
  E('path', { d: `M474,${SHEET_Y - 14} L474,${SHEET_Y + 8} M726,${SHEET_Y - 14} L726,${SHEET_Y + 8}`, stroke: '#5AA8FF', 'stroke-width': 12, 'stroke-linecap': 'round' }, sheetG);
  const knot = E('path', { d: 'M-8,0 Q0,-6 8,0 L5,14 Q0,18 -5,14 Z', fill: '#4A8FE6', stroke: '#BFE0FF', 'stroke-width': 2 }, sheetG);
  const mLbl = [
    labelLine(modelG, 452, 300, 481, 336, 'bottle with its\nbottom cut off', { size: 28, anchor: 'end' }),
    labelLine(modelG, 772, 380, 624, 366, 'balloon ‘lung’', { size: 28, anchor: 'start' }),
    labelLine(modelG, 772, 566, 708, 526, 'stretched balloon\n‘diaphragm’', { size: 28, anchor: 'start' }),
  ];
  const strawLbl = labelLine(modelG, 548, 140, BC - 9, 146, 'straw', { size: 26, anchor: 'end', fill: C.muted });
  const strawIn = arrow(modelG, BC, 46, BC, 110, { color: C.air, width: 7 }), strawOut = arrow(modelG, BC, 110, BC, 46, { color: C.air, width: 7 });
  const pullA = arrow(modelG, BC, 618, BC, 686, { color: '#9FD0FF', width: 7 }), pushA = arrow(modelG, BC, 686, BC, 618, { color: '#9FD0FF', width: 7 });
  const pullT = T(modelG, BC + 26, 664, 'pull', { size: 28, weight: 700, fill: '#9FD0FF' }), pushT = T(modelG, BC + 26, 664, 'push', { size: 28, weight: 700, fill: '#9FD0FF' });
  const infChip = chip(modelG, 'lung inflates', { size: 30, fill: '#4A1F2A', stroke: '#FF7A90', color: '#FFC2CD' }); tr(infChip, 320, 452);
  const defChip = chip(modelG, 'lung deflates', { size: 30, fill: C.card2, stroke: C.line, color: C.ink }); tr(defChip, 320, 452);

  /* ================= the Moon ================= */
  const moonG = G(root);
  E('rect', { x: 0, y: 0, width: W, height: H, fill: '#02060B' }, moonG);
  const stars = [], str = rng(97);
  for (let k = 0; k < 60 && stars.length < 44; k++) {
    const x = 20 + str() * 1160, y = 20 + str() * 500, rr = 0.8 + str() * 1.9, ph = str() * TAU;
    if (x < 580 && y < 110) continue;
    stars.push({ el: E('circle', { cx: fx(x), cy: fx(y), r: fx(rr), fill: '#FFFFFF' }, moonG), ph });
  }
  const earth = G(moonG); tr(earth, 1010, 178);
  E('circle', { r: 46, fill: ball('#5AA8FF', '#1E4F9A') }, earth);
  E('path', { d: 'M-24,-28 Q-6,-38 4,-24 Q10,-10 -8,-4 Q-22,2 -28,-12 Z M6,8 Q24,2 30,16 Q28,30 14,34 Q0,30 6,8 Z', fill: '#5BD27A', opacity: 0.85 }, earth);
  E('path', { d: 'M10,-45 A46,46 0 0 1 10,45 A26,46 0 0 0 10,-45 Z', fill: '#02060B', opacity: 0.5 }, earth);
  T(moonG, 1010, 260, 'Earth', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  E('path', { d: 'M0,566 C200,548 380,582 600,566 C800,552 1000,580 1200,560 L1200,750 L0,750 Z', fill: linGrad('#A7AFB8', '#4F5761', true) }, moonG);
  [[150, 640, 46, 12], [720, 690, 64, 15], [1010, 625, 38, 10], [330, 708, 30, 8], [880, 600, 24, 6]].forEach(([x, y, rx, ry]) => {
    E('ellipse', { cx: x, cy: y, rx, ry, fill: '#6F7882', stroke: '#C3CAD2', 'stroke-width': 2.5 }, moonG);
    E('ellipse', { cx: x, cy: y + ry * 0.25, rx: rx * 0.8, ry: ry * 0.6, fill: '#59616B' }, moonG);
  });
  T(moonG, 1010, 690, 'the Moon', { size: 26, weight: 600, anchor: 'middle', fill: C.ink });
  const astro = person(moonG, { shirt: '#5B8DEF', shorts: '#3A4F66' }); tr(astro, 420, 598, 1.3);
  astro.pose({ lean: 0, armL: [14, 18], armR: [-10, 12] });
  const MOUTH = [462, 376];
  const moonAir = [[780, 300], [792, 378], [780, 456]].map(([x, y]) => {
    const g = G(moonG), a = arrow(g, 0, 0, 110, 0, { color: C.air, width: 7 }), dx = MOUTH[0] - x, dy = MOUTH[1] - y, L = Math.hypot(dx, dy);
    op(g, 0); return { g, a, x, y, ux: dx / L, uy: dy / L, L, ang: Math.atan2(dy, dx) * 180 / Math.PI };
  });
  const moonGhost = G(moonG);
  E('path', { d: 'M770,378 L506,378', fill: 'none', stroke: C.air, 'stroke-width': 5, 'stroke-dasharray': '12 10', 'stroke-linecap': 'round', opacity: 0.55 }, moonGhost);
  E('path', { d: 'M524,366 L504,378 L524,390', fill: 'none', stroke: C.air, 'stroke-width': 5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: 0.55 }, moonGhost);
  const moonX = cross(moonGhost, 24); tr(moonX, 640, 378);
  const moonLbl = G(moonG);
  T(moonLbl, 965, 420, 'no air outside', { size: 40, weight: 700, anchor: 'middle', fill: C.air });
  T(moonLbl, 965, 466, 'to push in', { size: 32, weight: 600, anchor: 'middle' });
  const moonLbl2 = T(moonG, 965, 520, 'so your lungs would be useless', { size: 26, weight: 500, anchor: 'middle', fill: C.muted });

  /* ================= timing ================= */
  const c1 = mid('chain', 0.2), c2 = mid('chain', 0.6);              // the chain: in, then out
  const p1 = end('chain') - 0.2, p2 = mid('passive', 0.36);          // passive: in, then a relaxed spring back
  const dp1 = mid('dips', 0.4), dp2 = mid('dips', 0.55);             // dips: diaphragm, then ribs
  const tRushIn = j => mid('rush', 0.06) + j * 0.2, tRushOut = j => mid('outvol', 0.6) + j * 0.09;
  const ROUTE = [[0, -172], [0, -68]];
  const show = (a, v) => { op(a, v); if (v > 0) a.set(clamp(v * 1.5)); };

  return t => {
    /* ---------- the breath: d diaphragm flattening, r ribs up and out, gd / gi muscles contracting ---------- */
    const pre = 0.42 * bump(t, mid('rule', 0.24), 1.9);
    const d = clamp(pre + P(t, mid('in', 0.28), 2.0) - P(t, mid('out', 0.52), 1.8) + P(t, c1, 1.4) - P(t, c2, 1.4) + P(t, p1, 1.0) - P(t, p2, 2.0, easeOut) + P(t, dp1, 1.2));
    const r = clamp(pre + P(t, mid('ribs', 0.2), 2.2) - P(t, mid('out', 0.76), 1.6) + P(t, c1 + 0.15, 1.4) - P(t, c2 + 0.15, 1.4) + P(t, p1, 1.0) - P(t, p2, 2.0, easeOut) + P(t, dp2, 1.2));
    const gd = clamp(2.2 * pre + P(t, at('in') + 0.5, 0.5, linear) - P(t, mid('out', 0.3), 0.6, linear) + win(t, c1 - 0.1, c2, 0.3) + win(t, p1 - 0.1, p2 - 0.2, 0.3) + P(t, dp1 - 0.1, 0.4, linear));
    const gi = clamp(2.2 * pre + P(t, mid('ribs', 0.12), 0.5, linear) - P(t, mid('out', 0.32), 0.6, linear) + win(t, c1, c2 + 0.15, 0.3) + win(t, p1 - 0.1, p2 - 0.2, 0.3) + P(t, dp2 - 0.1, 0.4, linear));

    /* ---------- the chest ---------- */
    const aCh = P(t, S.first - 0.3, 0.5, linear) * (1 - P(t, at('model') - 0.1, 0.5, linear));
    op(chest, aCh);
    op(lungLbl, aCh * (1 - P(t, mid('rule', 0.06), 0.4, linear)));
    if (aCh > 0) {
      const fa = mid('rule', 0.03);
      op(frameG, P(t, fa, 0.5, linear));
      ribEls.forEach(o => op(o.g, P(t, fa + o.i * 0.07, 0.35, linear)));
      op(diaG, P(t, fa + 0.35, 0.5, linear)); tr(diaG, 0, 26 * (1 - P(t, fa + 0.35, 0.9, easeOut)));
      op(cav, P(t, fa + 0.2, 0.6, linear));
      drawChest(d, r, gd, gi);
      const b = clamp(0.5 * d + 0.5 * r), kx = 1 + 0.09 * b, ky = 1 + 0.05 * b;
      lg.set(b);
      const sx = (132 + 18 * r) / (20 + 112 * kx), sy = (diaAt79(d) + 4 + 150) / (152 * ky + 150);   // lung bases tuck just behind the dome
      lungG.setAttribute('transform', `translate(0 -150) scale(${sx.toFixed(4)} ${sy.toFixed(4)}) translate(0 150)`);
      const cg = Math.max(1.6 * pre, win(t, mid('volume', 0.1), at('pressure') + 0.4, 0.35));
      cav.setAttribute('fill-opacity', (0.06 + 0.16 * cg).toFixed(3)); cav.setAttribute('stroke-opacity', (0.3 + 0.55 * cg).toFixed(3));
      op(ghost, 0.85 * win(t, mid('volume', 0.08), at('pressure') + 0.5, 0.35));

      // the air inside: appears as "pressure" starts, spreads out, is joined by air rushing in, which later leaves
      const aIn = P(t, at('pressure') - 0.05, 0.4, linear) * (1 - P(t, at('chain') - 0.35, 0.4, linear));
      op(dotG, aIn);
      if (aIn > 0) {
        const k = lerp(0.7, 1, P(t, mid('pressure', 0.12), 1.7));
        inDots.forEach(o => {
          const cx = o.side < 0 ? lobeCx : -lobeCx, x = cx + (o.x - cx) * k, y = lobeCy + (o.y - lobeCy) * k;
          let p = [o.side * 20 + (x - o.side * 20) * kx, y * ky], a = 1;
          if (o.rush) {
            const ti = tRushIn(o.j), to = tRushOut(o.j), route = [[o.sx, -246]].concat(ROUTE, [[o.side * 44, -24]]);
            if (t < ti || t >= to + 1.0) a = 0;
            else if (t < ti + 1.5) { const u = (t - ti) / 1.5; p = along(route.concat([p]), ease(u)); a = clamp(u * 8); }
            else if (t > to) { const u = (t - to) / 1.0; p = along([p].concat(route.slice().reverse()), 0.6 * easeIn(u) + 0.4 * u); a = clamp((1 - u) * 6); }
          }
          op(o.el, a);
          if (a > 0) { attr(o.el, 'cx', p[0] + Math.sin(t * 1.7 + o.ph) * 2.6 * AMP); attr(o.el, 'cy', p[1] + Math.cos(t * 1.3 + o.ph * 1.3) * 2.6 * AMP); }
        });
      }
      // the air outside, which pushes in during the rush
      const aCl = P(t, mid('pressure', 0.58), 0.5, linear) * (1 - P(t, at('chain') - 0.35, 0.4, linear));
      op(cloudG, aCl);
      if (aCl > 0) {
        const sq = 0.16 * win(t, at('rush'), end('rush') + 0.4, 0.6);
        cloud.forEach(o => { const x = o.x + Math.sin(t * 0.9 + o.ph) * 7 * AMP, y = o.y + Math.cos(t * 0.75 + o.ph * 1.4) * 5 * AMP; attr(o.el, 'cx', lerp(x, 0, sq)); attr(o.el, 'cy', lerp(y, -205, sq)); });
      }

      // movement arrows
      show(diaDown, Math.max(win(t, mid('in', 0.25), at('volume') + 0.3, 0.35), win(t, c1 - 0.05, c1 + 1.5, 0.25), win(t, dp1 - 0.1, at('model') + 0.3, 0.3)));
      show(diaUp, Math.max(win(t, mid('out', 0.5), at('outvol') + 0.3, 0.35), win(t, c2 - 0.05, c2 + 1.5, 0.25)));
      const wRo = Math.max(win(t, mid('ribs', 0.18), at('volume') + 0.3, 0.35), win(t, c1 + 0.1, c1 + 1.6, 0.25), win(t, dp2 - 0.1, at('model') + 0.3, 0.3));
      show(ribOutR, wRo); show(ribOutL, wRo);
      const wRi = Math.max(win(t, mid('out', 0.74), at('outvol') + 0.3, 0.35), win(t, c2 + 0.1, c2 + 1.6, 0.25));
      show(ribInR, wRi); show(ribInL, wRi);
      const wIn = Math.max(win(t, at('rush') + 0.05, end('rush') + 0.6, 0.4), win(t, mid('chain', 0.44), mid('chain', 0.6), 0.25));
      airIn.forEach((a, k) => { const w = wave(t, 0.8, k * 0.3); show(a, wIn * (0.7 + 0.3 * w)); tr(a, 0, 10 * AMP * w); });
      const wOut = Math.max(win(t, mid('outvol', 0.58), end('outvol') + 0.3, 0.35), win(t, mid('chain', 0.82), end('chain') + 0.25, 0.25), 0.7 * win(t, p2 + 0.1, p2 + 1.9, 0.35));
      airOut.forEach((a, k) => { const w = wave(t, 0.8, k * 0.3); show(a, wOut * (0.7 + 0.3 * w)); tr(a, 0, -10 * AMP * w); });
      const wSp = win(t, p2, p2 + 2.0, 0.3);
      springA.forEach(a => show(a, wSp));
    }

    /* ---------- nomuscle: the crossed-out arm ---------- */
    const pa = P(t, mid('nomuscle', 0.25), 0.6, pop), fArm = 1 - P(t, at('rule') - 0.15, 0.4, linear);
    op(armG, clamp(pa * 2) * fArm); tr(armG, 905, 330, Math.max(0.01, 0.85 + 0.15 * pa));
    const xp = P(t, mid('nomuscle', 0.55), 0.4, pop); op(armX, clamp(xp * 2)); tr(armX, -36, -14, Math.max(0.01, xp));
    op(armLbl, P(t, mid('nomuscle', 0.45), 0.5, linear) * fArm);

    /* ---------- rule: the gas box ---------- */
    const aR = win(t, mid('rule', 0.5), at('in') + 0.05, 0.4);
    op(ruleG, aR);
    if (aR > 0) {
      gasArrow.set(P(t, mid('rule', 0.56), 0.8));
      const sp = 46 * AMP;
      const bpos = (o, tt, left) => [bounce((left ? o.x : (o.left ? o.x + 254 : o.x)) + o.vx * tt * sp, left ? 656 : 910, left ? 880 : 1134), bounce(o.y + o.vy * tt * sp, 246, 414)];
      boxDots.forEach(o => {
        let p;
        if (o.mover === undefined) p = bpos(o, t, o.left);
        else {
          const ts = mid('rule', 0.6) + o.mover * 0.42, te = ts + 1.1;
          if (t <= ts) p = bpos(o, t, true);
          else if (t >= te) p = bpos(o, t, false);
          else p = along([bpos(o, ts, true), [878, o.gy], [912, o.gy], bpos(o, te, false)], ease((t - ts) / 1.1));
        }
        attr(o.el, 'cx', p[0]); attr(o.el, 'cy', p[1]);
      });
    }
    op(nameG, win(t, mid('rule', 0.1), mid('rule', 0.5), 0.35));

    /* ---------- headings and labels ---------- */
    op(hIn, win(t, at('in') - 0.1, at('out') + 0.2, 0.35));
    op(hOut, win(t, at('out') - 0.15, at('chain') + 0.1, 0.35));
    op(hChain, win(t, at('chain') - 0.15, at('passive') + 0.1, 0.35));
    const pc = P(t, mid('passive', 0.4), 0.5, pop);
    op(hPas, clamp(pc * 2) * (1 - P(t, at('dips') - 0.2, 0.35, linear))); tr(pasChip, PX, 136, Math.max(0.01, 0.7 + 0.3 * pc));
    op(hDips, win(t, at('dips') - 0.05, at('model') + 0.25, 0.35)); op(hDips.glow, 0.45 + 0.55 * wave(t, 1.1));
    op(aIn, win(t, mid('in', 0.3), at('volume') + 0.2, 0.35));
    op(bIn, win(t, mid('ribs', 0.22), at('volume') + 0.4, 0.35));
    op(aOut, win(t, mid('out', 0.3), at('outvol') + 0.3, 0.35));
    op(bOut, win(t, mid('out', 0.36), at('outvol') + 0.3, 0.35));
    op(airLbl, aCh * win(t, mid('pressure', 0.6), at('chain') - 0.1, 0.35));
    op(pushLbl, win(t, mid('rush', 0.55), at('out') + 0.1, 0.35));

    /* ---------- the meters ---------- */
    const vol = 0.42 + 0.4 * clamp(P(t, mid('volume', 0.18), 1.2) - P(t, at('outvol') + 0.15, 1.2) + P(t, c1, 1.4) - P(t, c2, 1.4) + P(t, p1, 1.0) - P(t, p2, 2.0, easeOut) + P(t, mid('dips', 0.72), 0.9));
    const pres = 0.5 - 0.26 * P(t, mid('pressure', 0.3), 1.4) + 0.26 * P(t, mid('rush', 0.12), 3.6) + 0.26 * P(t, mid('outvol', 0.3), 1.0) - 0.26 * P(t, mid('outvol', 0.62), 1.8)
      - 0.24 * P(t, mid('chain', 0.32), 0.6) + 0.24 * P(t, mid('chain', 0.46), 0.8) + 0.24 * P(t, mid('chain', 0.7), 0.6) - 0.24 * P(t, mid('chain', 0.84), 0.8) - 0.24 * P(t, mid('dips', 0.88), 0.8);
    volM.set(vol); presM.set(pres);
    const dim = 1 - 0.6 * win(t, at('passive') - 0.1, at('dips') - 0.1, 0.35);
    op(volG, P(t, at('volume') - 0.1, 0.4, linear) * aCh * dim);
    op(presG, P(t, at('pressure') - 0.1, 0.4, linear) * aCh * dim);
    show(volUp, Math.max(win(t, mid('volume', 0.15), at('pressure') + 0.3, 0.3), win(t, c1, c1 + 1.5, 0.25), win(t, mid('dips', 0.71), at('model') + 0.3, 0.3)));
    show(volDn, Math.max(win(t, at('outvol') + 0.1, mid('outvol', 0.62), 0.3), win(t, c2, c2 + 1.5, 0.25)));
    show(presDn, Math.max(win(t, mid('pressure', 0.28), at('rush') + 0.3, 0.3), win(t, mid('chain', 0.32), mid('chain', 0.5), 0.25), win(t, mid('dips', 0.87), at('model') + 0.3, 0.3)));
    show(presUp, Math.max(win(t, mid('outvol', 0.28), mid('outvol', 0.66), 0.3), win(t, mid('chain', 0.7), mid('chain', 0.88), 0.25)));

    /* ---------- the chain, passive, dips ---------- */
    const aRows = win(t, at('chain') + 0.05, at('passive') + 0.1, 0.35);
    op(chainG, aRows);
    if (aRows > 0) ROWS.forEach(row => row.parts.forEach((pt, k) => {
      const tk = mid('chain', row.at[k]), s = 1 + 0.14 * Math.sin(Math.PI * P(t, tk, 0.5, linear)), cy = row.y - 10;
      op(pt.g, 0.22 + 0.78 * P(t, tk, 0.3, linear));
      pt.g.setAttribute('transform', `translate(${fx(pt.cx)} ${cy}) scale(${s.toFixed(3)}) translate(${fx(-pt.cx)} ${-cy})`);
      if (pt.a) op(pt.a, 0.25 + 0.75 * P(t, tk + 0.25, 0.3, linear));
    }));
    op(pasLbl, win(t, mid('passive', 0.5), at('dips') - 0.1, 0.35));
    [0.42, 0.57, 0.73, 0.89].forEach((f, k) => {
      const g = dipsW[k], p = P(t, mid('dips', f), 0.45, pop);
      op(g, clamp(p * 2) * (1 - P(t, at('model') - 0.1, 0.4, linear)));
      if (p > 0) { const s = Math.max(0.01, 0.6 + 0.4 * p); g.setAttribute('transform', `translate(${g.cx} ${g.cy}) scale(${s.toFixed(3)}) translate(${-g.cx} ${-g.cy})`); op(g.glow, 0.5 + 0.5 * wave(t, 1.1, k * 0.25)); }
    });

    /* ---------- the bottle model ---------- */
    const aM = win(t, at('model') - 0.05, at('moon') - 0.05, 0.4);
    op(modelG, aM);
    if (aM > 0) {
      const hp = P(t, at('model') + 0.05, 0.5, pop); op(homeChip, clamp(hp * 2)); tr(homeChip, 990, 150, Math.max(0.01, 0.8 + 0.2 * hp));
      bottle.setAttribute('stroke-dashoffset', (1 - P(t, at('model') + 0.15, 1.7)).toFixed(4));
      op(bodyFill, P(t, mid('model', 0.2), 0.6, linear));
      op(straw, P(t, mid('model', 0.38), 0.4, linear)); op(strawLbl, P(t, mid('model', 0.42), 0.4, linear));
      op(balloonG, clamp(P(t, mid('model', 0.45), 0.5, pop) * 2));
      op(sheetG, P(t, mid('model', 0.64), 0.4, linear));
      [0.24, 0.5, 0.7].forEach((f, k) => op(mLbl[k], P(t, mid('model', f), 0.45, linear)));
      // pull the sheet down -> the lung inflates; push it up -> it deflates
      const dd = 72 * P(t, mid('pull', 0.06), 1.3) - 86 * P(t, mid('pull', 0.55), 1.2) + 14 * P(t, mid('pull', 0.55) + 1.4, 0.6);
      sheet.setAttribute('d', `M474,${SHEET_Y} Q${BC},${fx(SHEET_Y + 2 * dd)} 726,${SHEET_Y}`);
      sheetFill.setAttribute('d', `M480,${SHEET_Y} Q${BC},${fx(SHEET_Y + 2 * Math.max(0, dd))} 720,${SHEET_Y} Z`);
      tr(knot, BC, SHEET_Y + dd + 4);
      const f = clamp(dd / 72), ry = lerp(34, 80, f);
      attr(bal, 'rx', lerp(22, 66, f)); attr(bal, 'ry', ry); attr(bal, 'cy', 326 + ry);
      op(wrinkles, 1 - clamp(f * 3));
      const wi = win(t, mid('pull', 0.06), mid('pull', 0.48), 0.3), wo = win(t, mid('pull', 0.55), mid('pull', 0.55) + 1.6, 0.3);
      show(strawIn, wi); show(strawOut, wo);
      const wpl = win(t, mid('pull', 0.02), mid('pull', 0.46), 0.3), wps = win(t, mid('pull', 0.52), mid('pull', 0.92), 0.3);
      show(pullA, wpl); op(pullT, wpl); show(pushA, wps); op(pushT, wps);
      op(infChip, win(t, mid('pull', 0.22), mid('pull', 0.56), 0.3)); op(defChip, P(t, mid('pull', 0.72), 0.3, linear));
    }

    /* ---------- the Moon ---------- */
    const aMo = P(t, at('moon') - 0.15, 0.6, linear);
    op(moonG, aMo);
    if (aMo > 0) {
      stars.forEach(s => op(s.el, S.reduce ? 0.8 : 0.45 + 0.55 * wave(t, 2.6, s.ph / TAU)));
      moonAir.forEach((m, k) => {
        const ts = mid('moon', 0.18) + k * 0.25, u = clamp((t - ts) / 2.0), dist = easeOut(u) * m.L * 0.42;
        op(m.g, Math.sin(Math.PI * u) * 0.95);
        if (u > 0 && u < 1) { tr(m.g, m.x + m.ux * dist, m.y + m.uy * dist, 1, m.ang); m.a.set(1); }
      });
      op(moonGhost, P(t, mid('moon', 0.74), 0.5, linear));
      const mx = P(t, mid('moon', 0.8), 0.45, pop); op(moonX, clamp(mx * 2)); tr(moonX, 640, 378, Math.max(0.01, mx));
      op(moonLbl, P(t, mid('moon', 0.36), 0.5, linear));
      op(moonLbl2, P(t, mid('moon', 0.72), 0.5, linear));
    }
  };
});
