/* Chapter 11, Trapped light: total internal reflection.
   Beats: a semicircular glass block, light aimed out through its flat face -> at 25° most refracts out (39°), a little
   reflects -> the ray box swings to 38°, the escaping ray bends to 67° -> at the critical angle (42°) it runs along the
   surface -> beyond it (55°) nothing escapes: total internal reflection, i = r -> the two conditions -> an optical
   fibre -> light zig-zags along it, every bounce above 42° (a magnified bounce) -> undersea cables and an endoscope
   -> a diamond: two internal reflections, then it flashes back out of the top. */
scene('fibres', S => {
  const { at, end, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;
  const DEG = Math.PI / 180, NG = LT.nGlass, CRIT = criticalAngle(NG, 1);   // 41.8°

  /* ---------- local helpers ---------- */
  function rich(parent, x, y, segs, o) {
    o = o || {};
    const t = E('text', { x, y, 'font-size': o.size || 30, 'font-weight': o.weight || 600, 'font-family': o.font || FD, 'text-anchor': o.anchor || 'start', fill: o.fill || C.ink }, parent);
    segs.forEach(s => { if (typeof s === 'string') s = [s]; E('tspan', { fill: s[1], 'font-weight': s[2] }, t).textContent = s[0]; });
    return t;
  }
  const plain = segs => segs.map(s => (typeof s === 'string' ? s : s[0])).join('');
  const fit = (segs, size, maxW) => { const w = textWidth(plain(segs), size, FD, 700); return w > maxW ? Math.floor(size * maxW / w) : size; };
  const popIn = (el, p, x, y, s0) => { s0 = s0 === undefined ? 0.75 : s0; op(el, clamp(p * 2)); tr(el, x, y + (1 - clamp(p)) * 16, Math.max(0.01, s0 + (1 - s0) * p)); };
  // a ray drawn to p (0..1) at opacity a; hidden at 0, where its round end cap would still paint a dot
  const rset = (r, p, a) => { r.set(p); op(r, p > 0.002 ? (a === undefined ? 1 : a) : 0); };
  /* angle of refraction (deg) for light leaving glass at angle i: exactly 90° at the critical angle, null beyond (TIR) */
  const rOut = i => { const s = NG * Math.sin(i * DEG); return s > 1 + 1e-6 ? null : s >= 1 - 1e-6 ? 90 : Math.asin(s) / DEG; };
  /* polylines measured by arc length: along(m, s) is the point s px from the start */
  function measure(pts) { const cum = [0]; for (let k = 1; k < pts.length; k++) cum.push(cum[k - 1] + Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1])); return { pts, cum, len: cum[cum.length - 1] }; }
  function along(m, s) {
    s = clamp(s, 0, m.len); let k = 1;
    while (k < m.pts.length - 1 && m.cum[k] < s) k++;
    const f = (s - m.cum[k - 1]) / ((m.cum[k] - m.cum[k - 1]) || 1);
    return [lerp(m.pts[k - 1][0], m.pts[k][0], f), lerp(m.pts[k - 1][1], m.pts[k][1], f)];
  }
  const wrap180 = a => { a = ((a + 180) % 360 + 360) % 360 - 180; return a; };
  const polyD = pts => 'M' + pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' L');
  /* set an angle arc's progress and aim, touching the DOM only when they change (each redraw measures its label) */
  function arcTo(arc, p, x, y, a0, a1) {
    const key = a0.toFixed(2) + ',' + a1.toFixed(2);
    let drew = false;
    if (p !== arc._p) { arc._p = p; arc.set(p); drew = true; }
    if (key !== arc._k) { arc._k = key; arc.to(x, y, a0, a1); drew = true; }
    return drew;
  }
  /* push an arc's label further out from its centre (wide angles: the lib keeps it only r + 30 away) */
  function nudge(arc, cx, cy, extra) {
    const lab = arc.lastChild, x = +lab.getAttribute('x'), y = +lab.getAttribute('y') - 28 * 0.35, L = Math.hypot(x - cx, y - cy) || 1;
    attr(lab, 'x', cx + (x - cx) * (L + extra) / L); attr(lab, 'y', cy + (y - cy) * (L + extra) / L + 28 * 0.35);
  }

  /* ================= A. the semicircular block: refraction out, the critical angle, TIR ================= */
  const A = G(root);
  const OX = 600, OY = 330, RB = 250, SLIT = 282, LREF = 300, LBACK = 330;
  const blkG = G(A); tr(blkG, OX, OY);
  semiBlock(blkG, RB);
  const glassHi = E('path', { d: `M${-RB},0 L${RB},0 A${RB},${RB} 0 0 1 ${-RB},0 Z`, fill: '#BFE6FF' }, blkG);
  normalLine(A, OX, OY, 90, 232, { back: 200 });
  const lblAir = T(A, 455, 312, 'air', { size: 26, weight: 600, fill: C.muted, anchor: 'middle' });
  const lblGlass = T(A, 455, 370, 'glass', { size: 26, weight: 600, fill: C.muted, anchor: 'middle' });
  const arcI = arcFromNormal(A, OX, OY, 90, 25, 62, { color: LT.angI, text: 'i = {deg}°' });
  const arcR = arcFromNormal(A, OX, OY, -90, 39, 62, { color: LT.angR, text: 'r = {deg}°' });
  const arcF = arcFromNormal(A, OX, OY, 90, -55, 62, { color: LT.angR, text: 'r = {deg}°' });
  const rayF = rayPath(A, [[OX, OY], [OX + 20, OY + 20]]);       // reflected back inside the glass
  const rayR = rayPath(A, [[OX, OY], [OX + 20, OY - 20]]);       // refracted out into the air
  const rayI = rayPath(A, [[OX - 20, OY + 20], [OX, OY]]);       // incident, from the ray box
  const boxG = G(A), box = rayBox(boxG);
  const flash = E('circle', { cx: OX, cy: OY, r: 54, fill: glow(C.energy) }, A);
  const runner = E('circle', { r: 26, fill: glow(C.energyLt) }, A);   // a burst of light running down the reflected ray
  const noteOut = T(A, 816, 120, 'most light refracts out', { size: 26, weight: 600 });
  const noteBack = T(A, 762, 652, 'a little reflects back', { size: 26, weight: 600, fill: C.muted });
  const noEsc = G(A);
  { const x = cross(noEsc, 11); tr(x, 702, 283); T(noEsc, 724, 292, 'no light escapes', { size: 26, weight: 600, fill: C.muted }); }
  const eqChip = chip(A, 'i = r', { size: 30, fill: C.card2, stroke: C.line });
  T(eqChip, 0, 52, 'the law of reflection', { size: 26, weight: 600, fill: C.muted, anchor: 'middle' });
  // headlines, top right
  const hCrit = G(root), hTir = G(root);
  chip(hCrit, 'critical angle ≈ 42°', { size: 32, fill: C.card2, stroke: C.energy });
  chip(hTir, 'total internal reflection', { size: 32, fill: C.card2, stroke: C.energy });
  const subTir = T(hTir, 0, 62, 'it needs two conditions', { size: 26, weight: 600, fill: C.muted, anchor: 'middle' });
  // the two conditions, along the bottom
  const CY = 598, CWd = 540, CHt = 120;
  const conds = [
    { x: 50, l1: ['Inside the ', ['denser', C.energy, 800], ' material'], l2: [['heading out: ', C.muted], ['glass → air', C.ink, 700]] },
    { x: 610, l1: ['Angle of incidence ', ['>', C.energy, 800], ' critical angle'], l2: [['here: ', C.muted], ['55°', LT.angI, 800], [' > ', C.muted], ['42°', C.ink, 800]] },
  ].map((c, k) => {
    const g = G(root);
    card(g, c.x, CY, CWd, CHt, { fill: C.card, stroke: C.line });
    const badge = E('circle', { cx: c.x + 48, cy: CY + 60, r: 27, fill: C.card2, stroke: C.muted, 'stroke-width': 3 }, g);
    const num = T(g, c.x + 48, CY + 70, String(k + 1), { size: 30, weight: 700, anchor: 'middle' });
    const tk = tick(g, 13, C.bg0); tr(tk, c.x + 48, CY + 61);
    rich(g, c.x + 92, CY + 52, c.l1, { size: fit(c.l1, 30, CWd - 112), weight: 700 });
    rich(g, c.x + 92, CY + 94, c.l2, { size: 26, weight: 600 });
    return { g, badge, num, tk, x: c.x };
  });
  // the ray box swings: 25° -> 38° (bigger) -> 41.8° (critical) -> 55° (total)
  const iOf = t => {
    let i = lerp(25, 38, P(t, mid('bigger', 0.1), Math.max(0.6, end('bigger') - mid('bigger', 0.1) - 0.3), ease));
    i = lerp(i, CRIT, P(t, at('critical') + 0.1, 2.4, ease));
    return lerp(i, 55, P(t, at('total') + 0.15, 1.6, ease));
  };
  const refrOp = i => (i <= CRIT ? lerp(1, 0.62, clamp((i - 25) / (CRIT - 25))) : 0.62 * (1 - clamp((i - CRIT) / 1.2)));
  const reflOp = i => (i <= CRIT ? lerp(0.25, 0.5, clamp((i - 25) / (CRIT - 25))) : lerp(0.5, 1, clamp((i - CRIT) / 4)));

  /* ================= B. an optical fibre: light zig-zags along it ================= */
  const Bg = G(root);
  const FA = 30, FP0 = [[230, 580], [580, 580], [720, 330], [1070, 330]];
  const bez = (Pp, u) => { const v = 1 - u; return [v * v * v * Pp[0][0] + 3 * v * v * u * Pp[1][0] + 3 * v * u * u * Pp[2][0] + u * u * u * Pp[3][0], v * v * v * Pp[0][1] + 3 * v * v * u * Pp[1][1] + 3 * v * u * u * Pp[2][1] + u * u * u * Pp[3][1]]; };
  function centreline(Pp, n) {           // n + 1 points, evenly spaced by arc length
    const raw = []; for (let k = 0; k <= 600; k++) raw.push(bez(Pp, k / 600));
    const m = measure(raw), out = [];
    for (let k = 0; k <= n; k++) out.push(along(m, m.len * k / n));
    return out;
  }
  function offset(c, a) {                // the polyline a px to the left of travel (the upper wall for a > 0)
    return c.map((p, k) => { const q0 = c[Math.max(0, k - 1)], q1 = c[Math.min(c.length - 1, k + 1)], L = Math.hypot(q1[0] - q0[0], q1[1] - q0[1]) || 1; return [p[0] + (q1[1] - q0[1]) / L * a, p[1] - (q1[0] - q0[0]) / L * a]; });
  }
  const fibLayers = [
    { w: 2 * FA + 34, c: '#9FD8FF', o: 0.08 }, { w: 2 * FA + 6, c: LT.glassStroke, o: 0.9 }, { w: 2 * FA - 2, c: '#14394B', o: 1 },
    { w: 2 * FA - 24, c: '#2A5A70', o: 0.55 },
  ].map(L => E('path', { fill: 'none', stroke: L.c, 'stroke-width': L.w, opacity: L.o, 'stroke-linejoin': 'round', pathLength: 1, 'stroke-dasharray': '1 1' }, Bg));
  const coreGlow = E('path', { fill: 'none', stroke: C.energy, 'stroke-width': 18, opacity: 0.16, 'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': '1 1' }, Bg);
  const shine = E('path', { fill: 'none', stroke: '#FFFFFF', 'stroke-width': 3, opacity: 0.32, 'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': '1 1' }, Bg);
  const shapeD = Pp => { const c = centreline(Pp, 90); return [polyD(c), polyD(offset(c, FA * 0.62).slice(2, -2))]; };
  const REST = shapeD(FP0);
  const drawFibre = (fx, p) => {
    const [d, ds] = fx === 0 ? REST : shapeD([FP0[0], [FP0[1][0], FP0[1][1] + fx], [FP0[2][0], FP0[2][1] - fx], FP0[3]]), off = (1 - clamp(p)).toFixed(4);
    fibLayers.forEach(L => { L.setAttribute('d', d); L.setAttribute('stroke-dashoffset', off); });
    coreGlow.setAttribute('d', d);
    shine.setAttribute('d', ds); shine.setAttribute('stroke-dashoffset', off);
  };
  // trace the ray along the resting fibre: it enters the left end face, reflects off the walls (i = r about each
  // wall's own normal) and leaves through the right end face
  const C0 = centreline(FP0, 320), WT = offset(C0, FA), WB = offset(C0, -FA);
  const segs = [];
  [WT, WB].forEach((wl, w) => { for (let k = 0; k < wl.length - 1; k++) segs.push({ a: wl[k], b: wl[k + 1], w }); });
  const E0 = C0[0], dIn0 = ltDir(-22);
  const dExt = (() => { const q = refractVec([-dIn0[0], -dIn0[1]], [-1, 0], NG, 1); return [-q[0], -q[1]]; })();   // steeper outside the glass
  const fibPath = [[E0[0] - dExt[0] * 92, E0[1] - dExt[1] * 92], E0.slice()], fibHits = [];
  {
    const eL = C0[C0.length - 1], eT = (() => { const q = C0[C0.length - 2], L = Math.hypot(eL[0] - q[0], eL[1] - q[1]); return [(eL[0] - q[0]) / L, (eL[1] - q[1]) / L]; })();
    let p = E0.slice(), d = dIn0.slice(), last = -1;
    for (let step = 0; step < 30; step++) {
      let best = null;
      segs.forEach((s, k) => {
        if (k === last) return;
        const ex = s.b[0] - s.a[0], ey = s.b[1] - s.a[1], den = d[0] * ey - d[1] * ex;
        if (Math.abs(den) < 1e-9) return;
        const tt = ((s.a[0] - p[0]) * ey - (s.a[1] - p[1]) * ex) / den, u = ((s.a[0] - p[0]) * d[1] - (s.a[1] - p[1]) * d[0]) / den;
        if (tt > 1e-6 && u >= 0 && u <= 1 && (!best || tt < best.t)) best = { t: tt, k, ex, ey, w: s.w };
      });
      const den2 = d[0] * eT[0] + d[1] * eT[1], tEnd = den2 > 1e-9 ? ((eL[0] - p[0]) * eT[0] + (eL[1] - p[1]) * eT[1]) / den2 : Infinity;
      if (!best || tEnd < best.t) {
        const x = [p[0] + d[0] * tEnd, p[1] + d[1] * tEnd], dOut = refractVec(d, eT, NG, 1) || d;
        fibPath.push(x, [x[0] + dOut[0] * 92, x[1] + dOut[1] * 92]);
        break;
      }
      p = [p[0] + d[0] * best.t, p[1] + d[1] * best.t]; last = best.k;
      const L = Math.hypot(best.ex, best.ey); let nrm = [best.ey / L, -best.ex / L];
      if (best.w === 1) nrm = [-nrm[0], -nrm[1]];                                     // inward normal for either wall
      if (nrm[0] * d[0] + nrm[1] * d[1] > 0) nrm = [-nrm[0], -nrm[1]];
      const inc = Math.acos(clamp(-(nrm[0] * d[0] + nrm[1] * d[1]), -1, 1)) / DEG;
      const dNew = reflectVec(d, nrm);
      fibHits.push({ p: p.slice(), nrm, dIn: d.slice(), dOut: dNew, inc, idx: fibPath.length });
      fibPath.push(p.slice()); d = dNew;
    }
  }
  const fibM = measure(fibPath);
  const extLen = fibM.cum[1], inLen = fibM.cum[fibPath.length - 2] - extLen;
  const fibBox = G(Bg); rayBox(fibBox);
  tr(fibBox, E0[0] - dExt[0] * 142, E0[1] - dExt[1] * 142, 1, ltAng(dExt));
  const fibRay = rayPath(Bg, fibPath, { head: 16 });
  const hitFlash = fibHits.map(h => E('circle', { cx: h.p[0], cy: h.p[1], r: 30, fill: glow(C.energyLt) }, Bg));
  const pulse = G(Bg);
  E('circle', { r: 34, fill: glow(C.energy) }, pulse); E('circle', { r: 8, fill: '#FFFDE8' }, pulse);
  const burst = G(Bg), burstAt = fibPath[fibPath.length - 2];
  tr(burst, burstAt[0], burstAt[1]);
  E('circle', { r: 70, fill: glow(C.energy) }, burst);
  const burstSpark = spark(burst, 26, { seed: 4 });
  const fTitle = chip(Bg, 'optical fibre', { size: 34, fill: C.card2, stroke: C.energy });
  const fSub = T(Bg, 900, 228, 'thin, flexible threads\nof very pure glass', { size: 28, weight: 600, fill: C.muted, anchor: 'middle', lh: 36 });
  // a magnified bounce
  const HB = fibHits[Math.min(2, fibHits.length - 1)], MG = [480, 238], MR = 116;
  const magLink = G(Bg);
  {
    const u = [HB.p[0] - MG[0], HB.p[1] - MG[1]], L = Math.hypot(u[0], u[1]);
    E('line', { x1: MG[0] + u[0] / L * MR, y1: MG[1] + u[1] / L * MR, x2: HB.p[0] - u[0] / L * 14, y2: HB.p[1] - u[1] / L * 14, stroke: C.muted, 'stroke-width': 3, 'stroke-dasharray': '6 6' }, magLink);
    E('circle', { cx: HB.p[0], cy: HB.p[1], r: 13, fill: 'none', stroke: C.muted, 'stroke-width': 3 }, magLink);
  }
  const mag = G(Bg);
  const magClip = (() => { const id = 'light-fibres-mag'; const cp = E('clipPath', { id }, defs()); E('circle', { cx: MG[0], cy: MG[1], r: MR }, cp); return `url(#${id})`; })();
  E('circle', { cx: MG[0], cy: MG[1], r: MR, fill: '#0B2230' }, mag);
  const magIn = G(mag, { 'clip-path': magClip });
  const nDeg = ltAng(HB.nrm), tw = [-HB.nrm[1], HB.nrm[0]];
  const HM = [MG[0] - HB.nrm[0] * 42, MG[1] - HB.nrm[1] * 42];                     // the bounce, magnified
  E('path', { d: polyD([[HM[0] - tw[0] * 200, HM[1] - tw[1] * 200], [HM[0] + tw[0] * 200, HM[1] + tw[1] * 200], [HM[0] + tw[0] * 200 + HB.nrm[0] * 300, HM[1] + tw[1] * 200 + HB.nrm[1] * 300], [HM[0] - tw[0] * 200 + HB.nrm[0] * 300, HM[1] - tw[1] * 200 + HB.nrm[1] * 300]]) + 'Z', fill: '#17425A' }, magIn);
  E('line', { x1: HM[0] - tw[0] * 200, y1: HM[1] - tw[1] * 200, x2: HM[0] + tw[0] * 200, y2: HM[1] + tw[1] * 200, stroke: LT.glassStroke, 'stroke-width': 4 }, magIn);
  const magN = normalLine(magIn, HM[0], HM[1], nDeg, 96, { back: 0 });
  const aInRev = ltAng([-HB.dIn[0], -HB.dIn[1]]), aOut = ltAng(HB.dOut);
  const magArcI = angleArc(magIn, HM[0], HM[1], nDeg, nDeg + wrap180(aInRev - nDeg), 42, { color: LT.angI, text: '{deg}°' });
  const magArcR = angleArc(magIn, HM[0], HM[1], nDeg, nDeg + wrap180(aOut - nDeg), 42, { color: LT.angR, text: '{deg}°' });
  const magRay = rayPath(magIn, [[HM[0] - HB.dIn[0] * 150, HM[1] - HB.dIn[1] * 150], HM, [HM[0] + HB.dOut[0] * 150, HM[1] + HB.dOut[1] * 150]], { head: 16 });
  E('circle', { cx: MG[0], cy: MG[1], r: MR, fill: 'none', stroke: '#E4EDF2', 'stroke-width': 6 }, mag);
  const magChip = G(Bg);
  chip(magChip, 'more than 42°, so it reflects', { size: 28, fill: C.card2, stroke: C.good });
  const zz = chip(Bg, 'reflects again and again', { size: 26, fill: C.card, stroke: C.line });

  /* ================= C. cables under the oceans, and an endoscope ================= */
  const Cg = G(root);
  const MX = 50, MY = 150, KX = 660 / 360;                     // world map: 660 px wide, latitudes 85° N to 60° S
  const ll = (lon, lat) => [MX + (lon + 180) * KX, MY + (85 - lat) * KX];
  const mapG = G(Cg);
  card(mapG, MX - 12, MY - 12, 660 + 24, 145 * KX + 24, { fill: '#0B2F45', stroke: C.line, rx: 18 });
  const LAND = [
    [[-165, 62], [-158, 70], [-140, 70], [-125, 72], [-100, 73], [-85, 70], [-78, 64], [-68, 60], [-60, 53], [-55, 48], [-66, 44], [-71, 41], [-76, 37], [-81, 31], [-80, 26], [-84, 29], [-90, 30], [-97, 27], [-97, 21], [-92, 18], [-88, 16], [-83, 10], [-79, 8], [-83, 8], [-88, 13], [-96, 16], [-105, 21], [-112, 29], [-117, 32], [-121, 36], [-124, 41], [-124, 47], [-128, 51], [-135, 57], [-146, 60], [-156, 58], [-163, 56]],
    [[-52, 60], [-42, 60], [-22, 70], [-18, 77], [-30, 83], [-60, 82], [-70, 78], [-58, 70]],
    [[-80, 9], [-74, 11], [-64, 10], [-52, 5], [-44, -2], [-35, -6], [-39, -14], [-41, -22], [-48, -26], [-53, -34], [-58, -38], [-63, -41], [-66, -46], [-68, -51], [-72, -54], [-74, -50], [-74, -42], [-72, -33], [-71, -22], [-75, -15], [-81, -6], [-80, 1], [-78, 6]],
    [[-9, 37], [-9, 43], [-2, 44], [-4, 48], [2, 51], [5, 53], [8, 55], [11, 57], [6, 59], [5, 62], [12, 66], [18, 70], [28, 71], [40, 67], [45, 68], [60, 69], [70, 73], [80, 73], [95, 76], [110, 74], [125, 72], [140, 72], [160, 70], [176, 68], [178, 64], [170, 60], [162, 58], [156, 51], [150, 59], [140, 54], [137, 47], [132, 43], [128, 39], [126, 35], [121, 31], [122, 25], [117, 23], [110, 21], [108, 15], [109, 11], [105, 9], [103, 2], [100, 7], [98, 10], [98, 16], [94, 17], [91, 22], [87, 21], [80, 15], [78, 8], [73, 16], [72, 21], [67, 25], [62, 25], [57, 26], [56, 24], [59, 22], [55, 17], [45, 13], [43, 15], [39, 21], [35, 28], [34, 31], [35, 36], [30, 36], [27, 37], [26, 40], [23, 38], [22, 40], [19, 42], [16, 40], [18, 40], [16, 38], [13, 41], [12, 44], [9, 44], [3, 43], [3, 42], [-1, 37], [-5, 36]],
    [[-5, 50], [1, 51], [2, 53], [-1, 55], [-2, 57], [-4, 58.5], [-6, 57], [-5, 55], [-3, 54], [-4, 52]],
    [[-17, 21], [-16, 27], [-10, 31], [-6, 35], [0, 36], [10, 37], [11, 33], [20, 31], [25, 32], [32, 31], [34, 28], [37, 22], [39, 16], [43, 12], [51, 12], [50, 8], [42, -1], [40, -10], [40, -16], [35, -22], [33, -28], [28, -33], [20, -35], [18, -32], [15, -26], [12, -17], [13, -10], [12, -5], [9, 0], [9, 4], [5, 6], [-2, 5], [-8, 4], [-13, 8], [-17, 13]],
    [[44, -13], [50, -15], [49, -21], [45, -25], [44, -20]],
    [[130, 31], [135, 34], [140, 35], [141, 39], [142, 43], [145, 44], [141, 45], [140, 41], [137, 37], [132, 34]],
    [[95, 5], [98, 4], [104, -2], [106, -6], [102, -4], [96, 1]],
    [[109, 1], [113, 4], [117, 7], [119, 1], [116, -4], [111, -3]],
    [[131, -1], [141, -3], [150, -10], [143, -9], [138, -8], [133, -4]],
    [[114, -22], [117, -20], [122, -17], [126, -14], [130, -12], [136, -12], [137, -15], [140, -17], [142, -11], [145, -15], [146, -19], [150, -23], [153, -27], [153, -31], [150, -37], [146, -39], [141, -38], [137, -35], [135, -34], [131, -31], [125, -32], [118, -35], [115, -34], [114, -29]],
    [[172, -34], [178, -38], [175, -41], [171, -44], [167, -46], [170, -42]],
    [[-24, 64], [-14, 64], [-14, 66], [-22, 66]],
  ];
  LAND.forEach(poly => E('path', { d: closedPath(poly.map(q => ll(q[0], q[1]))), fill: '#2C5D4B', stroke: '#5E9E83', 'stroke-width': 2, 'stroke-linejoin': 'round' }, mapG));
  const CABLES = [
    [[-74, 40], [-52, 45], [-26, 50], [-5, 50]],
    [[-80, 26], [-66, 18], [-48, 6], [-38, -4]],
    [[-38, -4], [-16, -8], [13, -9]],
    [[5, 43], [18, 35], [30, 33], [36, 24], [44, 12], [60, 12], [72, 17], [80, 4], [96, 4], [104, 1], [112, 10], [118, 20], [130, 28], [139, 34]],
    [[104, 1], [108, -12], [111, -24], [115, -32]],
  ].map((c, k) => {
    const pts = c.map(q => ll(q[0], q[1]));
    // sample the smooth path so pulses can ride along it
    const tmp = E('path', { d: openPath(pts) }, defs());
    let samp = []; try { const L = tmp.getTotalLength(); for (let s = 0; s <= 40; s++) { const q = tmp.getPointAtLength(L * s / 40); samp.push([q.x, q.y]); } } catch (e) { samp = pts; }
    tmp.remove();
    const g = G(Cg);
    E('path', { d: openPath(pts), fill: 'none', stroke: C.water, 'stroke-width': 10, opacity: 0.16, 'stroke-linecap': 'round' }, g);
    const line = E('path', { d: openPath(pts), fill: 'none', stroke: C.water, 'stroke-width': 3.5, 'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': '1 1' }, g);
    const m = measure(samp), n = Math.max(2, Math.round(m.len / 70));
    const dots = []; for (let j = 0; j < n; j++) { const dg = G(g); E('circle', { r: 13, fill: glow(C.energy) }, dg); E('circle', { r: 4.5, fill: '#FFFBD6' }, dg); dots.push(dg); }
    return { g, line, m, dots, k };
  });
  const useG = G(Cg), uses = ['phone calls', 'TV', 'internet'].map(s => chip(useG, s, { size: 28, fill: C.card2, stroke: C.line }));
  { let x = MX + 330 - (uses.reduce((s, c) => s + c.w, 0) + 36) / 2; uses.forEach(c => { c.x = x + c.w / 2; x += c.w + 18; }); }
  const mapNote = rich(Cg, MX + 330, 548, [['flashes of light', C.energy, 700], ' in cables under the oceans'], { size: 27, anchor: 'middle', fill: C.muted });
  // endoscope
  const En = G(Cg);
  const body = G(En);
  const bodyLine = { fill: 'rgba(160,200,225,0.11)', stroke: C.muted, 'stroke-width': 3, 'stroke-linejoin': 'round' };
  E('rect', Object.assign({ x: 940, y: 238, width: 40, height: 62, rx: 8 }, bodyLine), body);                       // neck
  E('path', Object.assign({ d: 'M812,706 L812,436 C812,344 872,296 960,296 C1048,296 1108,344 1108,436 L1108,706 Z' }, bodyLine), body);
  E('circle', Object.assign({ cx: 960, cy: 194, r: 58 }, bodyLine, { fill: '#18394A' }), body);
  E('ellipse', { cx: 960, cy: 230, rx: 13, ry: 6, fill: '#08161F' }, body);                                        // mouth
  E('path', { d: 'M960,232 L960,300 C960,362 958,402 974,438', fill: 'none', stroke: '#E9A9B9', 'stroke-width': 16, opacity: 0.4, 'stroke-linecap': 'round' }, body);
  const stomach = E('path', { d: closedPath([[972, 432], [1014, 424], [1052, 444], [1068, 490], [1052, 536], [1006, 554], [966, 538], [956, 492]]), fill: 'rgba(247,168,200,0.22)', stroke: C.cell, 'stroke-width': 3 }, body);
  T(body, 1012, 596, 'stomach', { size: 26, weight: 600, fill: C.cell, anchor: 'middle' });
  const scopeD = 'M1122,250 C1086,246 1030,228 992,228 C972,228 962,230 960,240 L960,300 C960,362 958,402 976,442 C986,464 996,478 1004,492';
  const scope = E('path', { d: scopeD, fill: 'none', stroke: '#4A5C6C', 'stroke-width': 11, 'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': '1 1' }, En);
  const scopeCore = E('path', { d: scopeD, fill: 'none', stroke: C.energy, 'stroke-width': 2.5, opacity: 0.7, 'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': '1 1' }, En);
  const handle = G(En); tr(handle, 1140, 254, 1, 8);
  E('rect', { x: -22, y: -16, width: 50, height: 32, rx: 9, fill: ball('#56687A', '#2A3642'), stroke: '#8FA3B3', 'stroke-width': 2 }, handle);
  const scopeM = (() => { const tmp = E('path', { d: scopeD }, defs()); let s = []; try { const L = tmp.getTotalLength(); for (let k = 0; k <= 60; k++) { const q = tmp.getPointAtLength(L * k / 60); s.push([q.x, q.y]); } } catch (e) { s = [[1122, 250], [1004, 492]]; } tmp.remove(); return measure(s); })();
  const scopeDots = [0, 1, 2].map(() => { const dg = G(En); E('circle', { r: 11, fill: glow(C.energy) }, dg); E('circle', { r: 4, fill: '#FFFBD6' }, dg); return dg; });
  const tipGlow = E('circle', { cx: 1004, cy: 492, r: 62, fill: glow(C.energy) }, En);
  const enName = G(En);
  T(enName, 1092, 152, 'endoscope', { size: 30, weight: 700, fill: C.energy, anchor: 'middle' });
  E('line', { x1: 1090, y1: 164, x2: 1067, y2: 230, stroke: C.energy, 'stroke-width': 2.5 }, enName);
  E('circle', { cx: 1066, cy: 234, r: 4.5, fill: C.energy }, enName);
  const enNote = T(En, 960, 662, 'see inside the body', { size: 26, weight: 600, fill: C.muted, anchor: 'middle' });

  /* ================= D. a diamond: tiny critical angle, so the light bounces inside ================= */
  const Dg = G(root);
  const DX = 470, DY = 400, DW = 260, TWd = 148, CRH = 77, PVD = 226;       // pavilion facets at 41° to the girdle
  const dmG = G(Dg);
  const DV = [[-TWd, -CRH], [TWd, -CRH], [DW, 0], [0, PVD], [-DW, 0]];
  _ltGlass(dmG, DV).at(DX, DY);
  E('path', { d: polyD(DV) + 'Z', fill: linGrad('#E8F6FF', '#6FA9CF', true), opacity: 0.3 }, dmG);
  [[[-TWd, -CRH], [TWd, -CRH], [100, 0], [-100, 0]], [[-DW, 0], [-100, 0], [0, PVD]], [[100, 0], [DW, 0], [0, PVD]]].forEach((f, k) => E('path', { d: polyD(f) + 'Z', fill: '#FFFFFF', opacity: [0.1, 0.06, 0.12][k] }, dmG));
  const crownZ = [[-DW, 0], [-TWd, -CRH], [-100, 0], [-50, -CRH], [0, 0], [50, -CRH], [100, 0], [TWd, -CRH], [DW, 0]];
  E('path', { d: polyD(crownZ), fill: 'none', stroke: '#DDF1FF', 'stroke-width': 2, opacity: 0.55, 'stroke-linejoin': 'round' }, dmG);
  E('path', { d: [-180, -100, 0, 100, 180].map(x => `M${x},0 L0,${PVD}`).join(' ') + ` M${-DW},0 L${DW},0`, fill: 'none', stroke: '#DDF1FF', 'stroke-width': 2, opacity: 0.4 }, dmG);
  E('path', { d: polyD(DV) + 'Z', fill: 'none', stroke: '#EAF7FF', 'stroke-width': 4, 'stroke-linejoin': 'round' }, dmG);
  // entering 110 left of centre, the light leaves through the middle of the right crown facet (not at the table's
  // corner), so its bend up-left out of that sloping face is clear; the angles are 41° and 57° at any entry point
  const dPath = dmG.trace([DX - 110, 126], 90, LT.nDiamond, 150);  // [start, table, facet 1, facet 2, exit, end]
  const dRay = rayPath(Dg, dPath, { head: 16 });
  const dM = measure(dPath);
  const facetNormal = (p, k) => {                                        // inward normal of the facet the point lies on
    const V = DV.map(v => [v[0] + DX, v[1] + DY]); let best = null;
    V.forEach((a, j) => { const b = V[(j + 1) % V.length], ex = b[0] - a[0], ey = b[1] - a[1], L = Math.hypot(ex, ey), dist = Math.abs((p[0] - a[0]) * ey - (p[1] - a[1]) * ex) / L; if (!best || dist < best.dist) best = { dist, n: [-ey / L, ex / L] }; });
    const cx = DX, cy = DY + 40; let n = best.n; if ((cx - p[0]) * n[0] + (cy - p[1]) * n[1] < 0) n = [-n[0], -n[1]]; return n;
  };
  const dHits = [2, 3].map(k => {
    const p = dPath[k], prev = dPath[k - 1], n = facetNormal(p), nd = ltAng(n), back = ltAng([prev[0] - p[0], prev[1] - p[1]]);
    const g = G(Dg);
    const nl = normalLine(g, p[0], p[1], nd, 74, { back: 0 });
    const arc = angleArc(g, p[0], p[1], nd, nd + wrap180(back - nd), 40, { color: LT.angI, text: '{deg}°', size: 28 });
    const fl = E('circle', { cx: p[0], cy: p[1], r: 34, fill: glow(C.energyLt) }, Dg);
    return { g, nl, arc, fl, s: dM.cum[k] };
  });
  const exitP = dPath[4], exitS = dM.cum[4];
  const exitSpark = spark(Dg, 30, { seed: 7 }); tr(exitSpark, exitP[0], exitP[1]);
  const twinkles = [[DX - 150, DY - 66, 0], [DX + 120, DY - 40, 1], [DX - 210, DY + 4, 2], [DX + 40, DY + 150, 3]].map(([x, y, k]) => { const sp = spark(Dg, 14, { seed: k + 11 }); tr(sp, x, y); return sp; });
  const dName = chip(Dg, 'diamond', { size: 30, fill: C.card2, stroke: C.line });
  const dCard = G(Dg);
  card(dCard, 790, 214, 360, 236, { fill: C.card, stroke: C.line });
  T(dCard, 970, 262, 'critical angle', { size: 30, weight: 700, anchor: 'middle' });
  const dRows = [['glass', '42°', 42, C.muted, 330], ['diamond', '24°', 24.4, C.energy, 404]].map(([name, val, ang, col, y]) => {
    const g = G(dCard), vx = 832, vy = y + 14;                   // a little angle: a normal, a ray, the arc between
    angleArc(g, vx, vy, -90, -90 + ang, 26, { color: col, wedge: 0.35, width: 3 });
    E('line', { x1: vx, y1: vy, x2: vx, y2: vy - 58, stroke: C.muted, 'stroke-width': 3, 'stroke-dasharray': '6 5' }, g);
    const e = ltPt(vx, vy, -90 + ang, 60); E('line', { x1: vx, y1: vy, x2: e[0], y2: e[1], stroke: col, 'stroke-width': 4, 'stroke-linecap': 'round' }, g);
    T(g, 912, y, name, { size: 30, weight: 700, fill: col === C.energy ? C.ink : C.muted });
    T(g, 1118, y, val, { size: 34, weight: 700, fill: col, anchor: 'end' });
    return g;
  });
  const dNote = rich(Dg, 970, 506, [['tiny', C.energy, 800], ', so light'], { size: 28, anchor: 'middle', fill: C.muted });
  const dNote2 = T(Dg, 970, 544, 'bounces around inside', { size: 28, weight: 600, anchor: 'middle', fill: C.muted });

  /* ================= update ================= */
  return t => {
    /* ---- A ---- */
    const aA = Math.min(P(t, S.first - 0.4, 0.5, linear), 1 - P(t, at('fibre') - 0.4, 0.45, linear));
    op(A, aA);
    op(hCrit, aA * win(t, mid('critical', 0.5), at('total') + 0.5, 0.4));
    op(hTir, aA * P(t, mid('total', 0.72), 0.5, linear));
    const conA = aA;
    if (aA > 0) {
      const i = iOf(t), r = rOut(i), rr = r === null ? 90 : r;
      const dS = ltDir(90 + i), dR = ltDir(-90 + rr), dF = ltDir(90 - i);
      tr(boxG, OX + dS[0] * (SLIT + 50), OY + dS[1] * (SLIT + 50), 1, -90 + i);
      box.set(P(t, at('out') - 0.1, 0.4, linear));
      const tHit = at('out') + 1.25;
      rayI.pts([[OX + dS[0] * SLIT, OY + dS[1] * SLIT], [OX, OY]]); rset(rayI, P(t, at('out') + 0.25, 1.0, linear));
      rayR.pts([[OX, OY], [OX + dR[0] * LREF, OY + dR[1] * LREF]]); rset(rayR, P(t, tHit, 0.8, linear), refrOp(i));
      rayF.pts([[OX, OY], [OX + dF[0] * LBACK, OY + dF[1] * LBACK]]); rset(rayF, P(t, tHit + 0.55, 0.9, linear), reflOp(i));
      const fl = Math.max(Math.sin(Math.PI * P(t, tHit - 0.15, 0.7, linear)), 0.9 * Math.sin(Math.PI * P(t, at('total') + 1.0, 0.9, linear)));
      op(flash, fl);
      // TIR: a burst of light runs down the reflected ray
      const run = P(t, at('total') + 1.15, 1.1, easeOut);
      op(runner, run > 0 && run < 1 ? Math.sin(run * Math.PI) : 0);
      attr(runner, 'cx', OX + dF[0] * LBACK * run); attr(runner, 'cy', OY + dF[1] * LBACK * run);
      // arcs: i (amber) always; r for the refracted ray until it is gone; then r for the reflection
      arcTo(arcI, P(t, mid('out', 0.4), 0.6), OX, OY, 90, 90 + i);
      if (arcTo(arcR, P(t, mid('out', 0.5), 0.6), OX, OY, -90, -90 + rr)) nudge(arcR, OX, OY, 24 * clamp((rr - 60) / 30));
      op(arcR, r === null ? 1 - clamp((i - CRIT) / 1.2) : 1);
      arcTo(arcF, P(t, mid('total', 0.45), 0.6), OX, OY, 90, 90 - i);
      const pulse2 = Math.sin(Math.PI * P(t, mid('two', 0.3), 0.8, linear));
      arcI.firstChild.setAttribute('opacity', (0.18 + 0.4 * pulse2).toFixed(3));
      op(noteOut, win(t, mid('out', 0.55), mid('bigger', 0.12), 0.4));
      op(noteBack, win(t, mid('out', 0.8), mid('bigger', 0.12), 0.4));
      op(noEsc, win(t, mid('total', 0.12), at('one') - 0.1, 0.4));
      op(eqChip, win(t, mid('total', 0.55), at('one') - 0.1, 0.4)); tr(eqChip, OX, 646);
      op(glassHi, 0.2 * win(t, mid('one', 0.42), end('one') + 0.2, 0.5) * (0.75 + 0.25 * wave(t, 1.1)));
    }
    tr(hCrit, 880, 190); tr(hTir, 880, 190);
    op(subTir, P(t, at('one') + 0.1, 0.5, linear));
    conds.forEach((c, k) => {
      const t0 = k ? mid('two', 0.05) : mid('one', 0.3), tk = k ? mid('two', 0.78) : mid('one', 0.86);
      const p = P(t, t0, 0.55, pop);
      op(c.g, conA * clamp(p * 2)); tr(c.g, 0, (1 - clamp(p)) * 20);
      const kp = P(t, tk, 0.45, pop);
      c.badge.setAttribute('fill', kp > 0.05 ? C.good : C.card2); c.badge.setAttribute('stroke', kp > 0.05 ? C.good : C.muted);
      op(c.num, 1 - clamp(kp * 3)); op(c.tk, clamp(kp * 2)); tr(c.tk, c.x + 48, CY + 61, Math.max(0.01, kp));
    });

    /* ---- B ---- */
    const aB = Math.min(P(t, at('fibre') - 0.2, 0.4, linear), 1 - P(t, at('internet') - 0.25, 0.45, linear));
    op(Bg, aB);
    if (aB > 0) {
      const dp = P(t, at('fibre') - 0.1, 1.6, easeOut);
      // "flexible": a gentle bend that settles back before the light goes in
      const fx = calm * 48 * Math.sin(TAU * P(t, mid('fibre', 0.5), 2.2, linear) * 1.5) * (1 - P(t, mid('fibre', 0.5), 2.4, linear)) * (t > mid('fibre', 0.5) ? 1 : 0);
      drawFibre(fx, dp);
      popIn(fTitle, P(t, mid('fibre', 0.2), 0.5, pop), 900, 168);
      op(fSub, win(t, mid('fibre', 0.5), mid('zigzag', 0.42), 0.4));
      op(fibBox, P(t, mid('fibre', 0.85), 0.4, linear));
      // the pulse
      const T0 = at('zigzag') - 0.1, T1 = mid('zigzag', 0.9), q = P(t, T0, T1 - T0, linear), s = q * fibM.len;
      rset(fibRay, q);
      const pp = along(fibM, s);
      op(pulse, q > 0 && q < 1 ? 1 : 0); tr(pulse, pp[0], pp[1], 0.9 + 0.15 * wave(t, 0.35));
      coreGlow.setAttribute('stroke-dashoffset', (1 - clamp((s - extLen) / inLen)).toFixed(4));
      op(coreGlow, q > 0 ? 1 : 0);
      fibHits.forEach((h, k) => { const tHit = T0 + fibM.cum[h.idx] / fibM.len * (T1 - T0); op(hitFlash[k], Math.sin(Math.PI * P(t, tHit - 0.12, 0.5, linear))); });
      const tOut = T0 + fibM.cum[fibPath.length - 2] / fibM.len * (T1 - T0), bp = P(t, tOut - 0.05, 0.6, pop);
      op(burst, clamp(bp * 2)); tr(burst, burstAt[0], burstAt[1], Math.max(0.01, 0.4 + 0.6 * bp) * (1 + 0.06 * wave(t, 0.8))); burstSpark.upd(t);
      // the magnified bounce appears as the pulse reaches it
      const tMag = T0 + fibM.cum[HB.idx] / fibM.len * (T1 - T0) - 0.5;
      const mp = P(t, tMag, 0.6, pop);
      op(mag, clamp(mp * 2)); mag.setAttribute('transform', `translate(${MG[0]} ${MG[1]}) scale(${Math.max(0.01, 0.6 + 0.4 * clamp(mp, 0, 1.2)).toFixed(3)}) translate(${-MG[0]} ${-MG[1]})`);
      op(magLink, P(t, tMag, 0.4, linear));
      rset(magRay, P(t, tMag + 0.2, 0.9, linear));
      magN.set(P(t, tMag + 0.3, 0.5));
      arcTo(magArcI, P(t, tMag + 0.7, 0.5), HM[0], HM[1], nDeg, nDeg + wrap180(aInRev - nDeg));
      arcTo(magArcR, P(t, tMag + 1.0, 0.5), HM[0], HM[1], nDeg, nDeg + wrap180(aOut - nDeg));
      popIn(magChip, P(t, tMag + 1.4, 0.5, pop), 900, 240);
      popIn(zz, P(t, mid('zigzag', 0.62), 0.5, pop), 660, 610);
    }

    /* ---- C ---- */
    const aC = Math.min(P(t, at('internet') - 0.2, 0.45, linear), 1 - P(t, at('diamond') - 0.25, 0.45, linear));
    op(Cg, aC);
    if (aC > 0) {
      const mIn = P(t, at('internet') - 0.1, 0.6, easeOut);
      op(mapG, mIn);
      uses.forEach((c, k) => popIn(c, P(t, mid('internet', 0.06 + k * 0.075), 0.45, pop), c.x, 492));
      CABLES.forEach(cb => {
        const lp = P(t, mid('internet', 0.27) + cb.k * 0.12, 0.8, linear);
        cb.line.setAttribute('stroke-dashoffset', (1 - lp).toFixed(4));
        op(cb.g, mIn);
        const on = P(t, mid('internet', 0.33) + cb.k * 0.12, 0.4, linear);
        cb.dots.forEach((dg, j) => {
          const u = (((t - mid('internet', 0.33)) * 110 / cb.m.len) + j / cb.dots.length) % 1;
          const q = along(cb.m, u * cb.m.len);
          tr(dg, q[0], q[1]); op(dg, on * Math.min(1, u * 8, (1 - u) * 8) * (t > mid('internet', 0.33) ? 1 : 0));
        });
      });
      op(mapNote, P(t, mid('internet', 0.4), 0.5, linear));
      const eIn = P(t, mid('internet', 0.58), 0.6, easeOut);
      op(En, eIn); tr(En, (1 - eIn) * 40, 0);
      const sp = P(t, mid('internet', 0.62), 1.4, ease);
      scope.setAttribute('stroke-dashoffset', (1 - sp).toFixed(4)); scopeCore.setAttribute('stroke-dashoffset', (1 - sp).toFixed(4));
      const lit = P(t, mid('internet', 0.62) + 1.3, 0.5, linear);
      scopeDots.forEach((dg, j) => { const u = ((t - mid('internet', 0.62)) * 0.6 + j / 3) % 1, q = along(scopeM, u * scopeM.len); tr(dg, q[0], q[1]); op(dg, lit * Math.min(1, u * 6, (1 - u) * 6)); });
      op(tipGlow, lit * (0.75 + 0.25 * wave(t, 1.3)));
      stomach.setAttribute('fill', `rgba(247,168,200,${(0.22 + 0.25 * lit).toFixed(3)})`);
      op(enName, P(t, mid('internet', 0.62), 0.4, linear));
      op(enNote, P(t, mid('internet', 0.86), 0.4, linear));
    }

    /* ---- D ---- */
    const aD = P(t, at('diamond') - 0.2, 0.45, linear);
    op(Dg, aD);
    if (aD > 0) {
      const dIn = P(t, at('diamond') - 0.1, 0.7, pop);
      op(dmG, clamp(dIn * 2)); dmG.setAttribute('transform', `translate(${DX} ${DY + (1 - clamp(dIn)) * 24})`);
      popIn(dName, P(t, at('diamond') + 0.3, 0.5, pop), DX, 690);
      twinkles.forEach((sp, k) => { const ph = ((t - at('diamond')) * 0.7 + k * 0.27) % 1; op(sp, aD * (t > at('diamond') ? Math.sin(ph * Math.PI) : 0) * (k === 3 ? 0.7 : 1)); sp.upd(t + k); });
      const T0 = mid('diamond', 0.12), T1 = mid('diamond', 0.9), q = P(t, T0, T1 - T0, linear), s = q * dM.len;
      rset(dRay, q);
      dHits.forEach(h => {
        const th = T0 + h.s / dM.len * (T1 - T0);
        op(h.fl, Math.sin(Math.PI * P(t, th - 0.12, 0.55, linear)));
        h.nl.set(P(t, th - 0.1, 0.4)); op(h.g, P(t, th - 0.15, 0.3, linear));
        const ap = P(t, th + 0.1, 0.5); if (ap !== h.arc._p) { h.arc._p = ap; h.arc.set(ap); }
      });
      const te = T0 + exitS / dM.len * (T1 - T0), ep = P(t, te - 0.05, 0.6, pop);
      op(exitSpark, clamp(ep * 2)); tr(exitSpark, exitP[0], exitP[1], Math.max(0.01, 0.5 + 1.0 * ep) * (1 + 0.08 * wave(t, 0.7))); exitSpark.upd(t);
      const cp = P(t, mid('diamond', 0.3), 0.55, pop);
      op(dCard, clamp(cp * 2)); tr(dCard, (1 - clamp(cp)) * 30, 0);
      op(dRows[0], P(t, mid('diamond', 0.34), 0.4, linear)); op(dRows[1], P(t, mid('diamond', 0.44), 0.4, linear));
      op(dNote, P(t, mid('diamond', 0.58), 0.4, linear)); op(dNote2, P(t, mid('diamond', 0.62), 0.4, linear));
    }
  };
});
