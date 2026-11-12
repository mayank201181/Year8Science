/* Scene 3: Deeper than he looks (refraction).
   Swimming complex, 2 p.m., 33 °C: Ray dives in -> Dennis (the water) rises: "people say I'm dense" ->
   "optically dense" (push-in on Ray, deadpan) -> diagram: air/water, ray slows and bends, REFRACTION ->
   Kavya's shortcut thought bubble (hold on Ray) -> bubble pops; speedometer drops 300 000 -> 225 000 km/s ->
   Norman stands ON the water surface: slows -> towards him; speeds up -> away from him -> Norman's confessional
   (crossed-out exam answer) -> "SloTo, FastAway" -> along the normal: slows, no bend -> coin on the pool floor:
   real vs apparent depth -> Dennis, wistful -> Kavya's short legs -> glass block: parallel, lateral displacement
   -> semicircular block: the critical angle (42°) and total internal reflection -> Ray rides an optical fibre
   -> confessional: "It's your Wi-Fi" (the router looks guilty). */
scene('pool', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;

  /* ---------- local helpers ---------- */
  const on = (t, a, b) => (t >= a && t < b ? 1 : 0);                 // hard sitcom cut
  const camAt = (el, k, cx, cy) => el.setAttribute('transform', `translate(${cx.toFixed(1)} ${cy.toFixed(1)}) scale(${k.toFixed(4)}) translate(${(-cx).toFixed(1)} ${(-cy).toFixed(1)})`);
  const popIn = (el, t, t0, x, y, s, r, f) => { const p = P(t, t0, 0.45, pop); op(el, clamp(p * 2.5) * (f === undefined ? 1 : f)); tr(el, x, y, Math.max(0.01, (s || 1) * (0.6 + 0.4 * p)), r); };
  const label = (parent, text, o) => {
    o = o || {};
    return chip(parent, text, { size: o.size || 30, fill: o.fill || 'rgba(10,27,39,0.9)', stroke: o.stroke || C.line, sw: o.sw || 2, color: o.color || C.ink, weight: o.weight || 700 });
  };
  // a card of centred text rows [[text, size, colour], ...] centred on its origin
  function poolCard(parent, rows, o) {
    o = o || {};
    const g = G(parent), pad = o.pad || 26;
    let w = 0, h = 0;
    rows.forEach(([s, size]) => { w = Math.max(w, textWidth(s, size, FD, 700)); h += size * 1.32; });
    w += pad * 2; h += pad * 1.4;
    E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: 20, fill: o.fill || 'rgba(10,27,39,0.93)', stroke: o.stroke || C.energy, 'stroke-width': 3 }, g);
    let y = -h / 2 + pad * 0.7;
    rows.forEach(([s, size, col]) => { y += size * 1.32; T(g, 0, y - size * 0.32, s, { size, weight: 700, anchor: 'middle', fill: col || C.ink, boldFill: o.bold || C.energy }); });
    g.w = w; g.h = h;
    return g;
  }
  // a double-headed measuring arrow from (x1, y1) to (x2, y2)
  function poolDouble(parent, x1, y1, x2, y2, col) {
    const g = G(parent), a = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI, hs = 14;
    E('line', { x1, y1, x2, y2, stroke: col, 'stroke-width': 4 }, g);
    [[x2, y2, a], [x1, y1, a + 180]].forEach(([x, y, r]) => E('path', { d: `M0,0 L${-hs},${-hs * 0.6} L${-hs},${hs * 0.6} Z`, fill: col, transform: `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${r.toFixed(1)})` }, g));
    return g;
  }
  // Kavya's swimsuit body and legs below her bust (x about 220); outline = dashed "where they really are"
  function poolLegs(parent, outline) {
    const g = G(parent);
    const st = outline ? { fill: 'none', stroke: '#FFFFFF', 'stroke-width': 4, 'stroke-dasharray': '12 9' } : { stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' };
    if (!outline) E('path', Object.assign({ d: 'M152,380 L288,380 L280,472 Q220,488 160,472 Z', fill: '#1E3A8A' }, st), g);
    E('path', Object.assign({ d: 'M168,468 L208,468 L204,684 L172,684 Z', fill: '#B9784E' }, st), g);
    E('path', Object.assign({ d: 'M232,468 L272,468 L268,684 L236,684 Z', fill: '#B9784E' }, st), g);
    E('ellipse', Object.assign({ cx: 184, cy: 690, rx: 26, ry: 10, fill: '#B9784E' }, st), g);
    E('ellipse', Object.assign({ cx: 256, cy: 690, rx: 26, ry: 10, fill: '#B9784E' }, st), g);
    return g;
  }
  // thought bubble w x h centred on its origin, tail dots towards (tx, ty) (local)
  function poolBubble(parent, w, h, tx, ty) {
    const g = G(parent);
    [[0.78, 18], [0.9, 11]].forEach(([f, r]) => E('circle', { cx: tx * f, cy: ty * f, r, fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 4 }, g));
    E('ellipse', { rx: w / 2, ry: h / 2, fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 4 }, g);
    return g;
  }
  // the dark diagram background
  function poolDark(parent) {
    const g = G(parent);
    E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad(C.bg0, C.bg1, true) }, g);
    return g;
  }

  // a plain polyline that draws on with .set(p) (one element; no arrowheads)
  function poolLine(parent, pts, o) {
    const e = E('path', { d: 'M' + pts.map(q => q[0].toFixed(1) + ',' + q[1].toFixed(1)).join(' L'), fill: 'none', stroke: o.color, 'stroke-width': o.width || 4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', pathLength: 1, 'stroke-dasharray': '1 1', 'stroke-dashoffset': 1, opacity: o.opacity }, parent);
    e.set = p => attr(e, 'stroke-dashoffset', 1 - clamp(p));
    return e;
  }

  /* layers */
  const Lpool = G(root), Ldiag = G(root), Lconf = G(root), Lmid = G(root), Lcast = G(root), Lfg = G(root), Lhud = G(root);

  /* ================= the pool (one group, so the camera can move it) ================= */
  const poolShot = G(Lpool);
  const pBack = G(poolShot), pCast = G(poolShot), pFront = G(poolShot), pTop = G(poolShot), pOver = G(poolShot);
  const pool = lwPool(pBack, pFront);
  const WY = pool.waterY;   // 380
  const legsW = G(pCast); poolLegs(legsW, false);
  legsW.setAttribute('transform', `translate(0 ${WY}) scale(1 0.7) translate(0 ${-WY})`);   // under water, so it looks squashed
  const kav = cast(pCast, 'kavya', { outfit: 'swim' });
  const KX = 220, KY = 268, KS = 0.9;
  const coin = G(pCast); tr(coin, 600, 694);
  E('ellipse', { rx: 24, ry: 8, fill: '#E0B23A', stroke: '#7A5A10', 'stroke-width': 3 }, coin);
  E('ellipse', { cx: -5, cy: -2, rx: 9, ry: 2.5, fill: '#FFF1B0', opacity: 0.8 }, coin);
  const rayP = cast(pCast, 'ray', {});
  const den = cast(pTop, 'dennis', {});
  // splash
  const splash = G(pTop);
  const drops = [0, 1, 2, 3, 4, 5, 6].map(i => E('path', { d: 'M0,-12 Q8,2 0,8 Q-8,2 0,-12 Z', fill: '#E6FAFF', stroke: '#5AB4E0', 'stroke-width': 2 }, splash));
  const splashRing = E('ellipse', { rx: 10, ry: 4, fill: 'none', stroke: '#FFFFFF', 'stroke-width': 5 }, splash);
  // shallow: the coin's rays bending into Kavya's eye, and the image they seem to come from
  const shallowG = G(pOver);
  const CN = [600, 690], EYE = [243, 248], nW = LW_OPT.nWater;
  const surfHit = (E2) => {
    let lo = E2[0] + 1, hi = CN[0] - 1;
    for (let k = 0; k < 50; k++) {
      const x = (lo + hi) / 2, sa = (x - E2[0]) / Math.hypot(x - E2[0], WY - E2[1]), sw = (CN[0] - x) / Math.hypot(CN[0] - x, CN[1] - WY);
      if (sa - nW * sw > 0) hi = x; else lo = x;
    }
    return [(lo + hi) / 2, WY];
  };
  const EYES = [EYE, [EYE[0] - 14, EYE[1] - 30]];
  const hits = EYES.map(surfHit);
  // backward extensions (from the eye through the hit point) meet at the image
  const dirs = EYES.map((e, i) => lwUnit([hits[i][0] - e[0], hits[i][1] - e[1]]));
  const IMG = (() => {
    const [p, q] = hits, [u, v] = dirs, den2 = u[0] * v[1] - u[1] * v[0];
    const s = ((q[0] - p[0]) * v[1] - (q[1] - p[1]) * v[0]) / den2;
    return [p[0] + u[0] * s, p[1] + u[1] * s];
  })();
  const shNorms = hits.map(h => lwNormal(shallowG, h[0], h[1], -90, 60, { back: 60, width: 2.5 }));
  const shExt = hits.map(h => E('line', { x1: h[0], y1: h[1], x2: IMG[0], y2: IMG[1], stroke: '#FFFFFF', 'stroke-width': 3.5, 'stroke-dasharray': '10 8', opacity: 0.85 }, shallowG));
  const shRays = hits.map((h, i) => lwRayPath(shallowG, [CN, h, EYES[i]], { width: 4.5, head: 15 }));
  const ghost = G(shallowG); tr(ghost, IMG[0], IMG[1]);
  E('ellipse', { rx: 24, ry: 8, fill: 'rgba(224,178,58,0.35)', stroke: '#FFE45C', 'stroke-width': 3, 'stroke-dasharray': '6 5' }, ghost);
  const depthG = G(shallowG);
  const DX1 = CN[0] + 90, DX2 = CN[0] + 190;
  poolDouble(depthG, DX1, WY + 6, DX1, CN[1] - 4, '#FFFFFF');
  E('line', { x1: CN[0] + 30, y1: CN[1], x2: DX1, y2: CN[1], stroke: '#FFFFFF', 'stroke-width': 2.5, 'stroke-dasharray': '5 5' }, depthG);
  T(depthG, DX1 + 16, CN[1] - 40, 'real depth', { size: 28, weight: 700, fill: '#FFFFFF' });
  const appG = G(shallowG);
  poolDouble(appG, DX2, WY + 6, DX2, IMG[1] - 2, C.energy);
  E('line', { x1: IMG[0] + 30, y1: IMG[1], x2: DX2, y2: IMG[1], stroke: C.energy, 'stroke-width': 2.5, 'stroke-dasharray': '5 5' }, appG);
  T(appG, DX2 + 16, (WY + IMG[1]) / 2 + 10, 'apparent depth', { size: 28, weight: 700, fill: C.energy });
  // legs: where they really are
  const realLegs = G(pOver); poolLegs(realLegs, true);
  const realLab = G(realLegs);
  E('line', { x1: 290, y1: 640, x2: 360, y2: 600, stroke: '#FFFFFF', 'stroke-width': 2.5 }, realLab);
  T(realLab, 368, 598, 'where her feet really are', { size: 26, weight: 700, fill: '#FFFFFF' });

  /* ================= diagrams ================= */
  const O = [430, 400];
  const surf = G(Ldiag);
  E('rect', { x: 0, y: 0, width: 1200, height: 400, fill: linGrad('#0E2433', '#16405A', true) }, surf);
  E('rect', { x: 0, y: 400, width: 1200, height: 350, fill: linGrad('#0F5778', '#0A3550', true) }, surf);
  E('line', { x1: 0, y1: 400, x2: 1200, y2: 400, stroke: '#BFEFFF', 'stroke-width': 5 }, surf);
  T(surf, 1150, 380, 'air', { size: 32, weight: 700, anchor: 'end', fill: C.air });
  T(surf, 1150, 446, 'water', { size: 32, weight: 700, anchor: 'end', fill: C.water });
  // B: bend
  const dBend = G(Ldiag);
  const bB = lwBend(O[0], O[1], -90, -40, 1, nW, 300, 300);
  const bNorm = lwNormal(dBend, O[0], O[1], -90, 230, { back: 280, square: 20, label: 'normal' });
  const bInc = lwRayPath(dBend, [bB.a, bB.o]), bRef = lwRayPath(dBend, [bB.o, bB.b]);
  const bArcI = lwArcFromNormal(dBend, O[0], O[1], -90, -40, 100, { text: 'i = {deg}°', color: LW_OPT.angI });
  const bArcR = lwArc(dBend, O[0], O[1], 90, 90 - bB.r, 100, { text: 'r = {deg}°', color: LW_OPT.angR });
  const pulse = [0, 1].map(() => { const g = G(dBend); E('circle', { r: 26, fill: glow('#FFFFFF') }, g); E('circle', { r: 9, fill: '#FFFFFF' }, g); return g; });
  const tagFast = label(dBend, 'fast', { size: 30, color: C.energy }); tr(tagFast, 282, 330);
  const tagSlow = label(dBend, 'slow', { size: 30, color: C.water }); tr(tagSlow, 575, 500);
  const refrCard = poolCard(Lfg, [['REFRACTION', 52, C.energy], ['light changes speed in a', 30], ['new medium, so it bends', 30]]);
  const medCard = poolCard(Lfg, [['medium =', 30, C.water], ['the material light', 30], ['travels through', 30]], { stroke: C.water });
  // D: towards / away, with Norman standing on the surface
  const NS = 1.0;
  const dTow = G(Ldiag);
  const tB = lwBend(O[0], O[1], -90, -50, 1, nW, 300, 300);
  lwNormal(dTow, O[0], O[1], 90, 280, { back: 0, square: 20 });
  const tInc = lwRayPath(dTow, [tB.a, tB.o]), tRef = lwRayPath(dTow, [tB.o, tB.b]);
  const tArcI = lwArcFromNormal(dTow, O[0], O[1], -90, -50, 170, { text: 'i = {deg}°', color: LW_OPT.angI, lr: 275 });
  const tArcR = lwArc(dTow, O[0], O[1], 90, 90 - tB.r, 110, { text: 'r = {deg}°', color: LW_OPT.angR });
  const towCard = poolCard(Lfg, [['slows down →', 34, C.water], ['bends **TOWARDS**', 34], ['the normal', 34]], { stroke: C.water, bold: C.water });
  const dAway = G(Ldiag);
  const aB = lwBend(O[0], O[1], 90, 35, nW, 1, 300, 300);
  lwNormal(dAway, O[0], O[1], 90, 280, { back: 0, square: 20 });
  const aInc = lwRayPath(dAway, [aB.a, aB.o]), aRef = lwRayPath(dAway, [aB.o, aB.b]);
  const aArcI = lwArcFromNormal(dAway, O[0], O[1], 90, 35, 110, { text: 'i = {deg}°', color: LW_OPT.angI });
  const aArcR = lwArc(dAway, O[0], O[1], -90, -90 + aB.r, 170, { text: 'r = {deg}°', color: LW_OPT.angR, lr: 275 });
  const awayCard = poolCard(Lfg, [['speeds up →', 34, C.energy], ['bends **AWAY**', 34], ['from the normal', 34]]);
  // G: along the normal
  const dAlong = G(Ldiag);
  lwNormal(dAlong, O[0], O[1], -90, 260, { back: 300, square: 20 });
  const alRay = lwRayPath(dAlong, [[O[0], 130], [O[0], 690]], { heads: true, at: 0.3 });
  const alFast = label(dAlong, 'fast', { size: 30, color: C.energy }); tr(alFast, O[0] - 130, 250);
  const alSlow = label(dAlong, 'slow', { size: 30, color: C.water }); tr(alSlow, O[0] - 130, 560);
  const alongCard = poolCard(Lfg, [['along the normal:', 34, C.energy], ['slows down,', 34], ['**NO** bending', 34]]);
  const zeroLab = T(dAlong, O[0] + 80, 470, 'i = 0°', { size: 30, weight: 700, fill: LW_OPT.angI });
  // dark diagrams: glass block, semicircular block, optical fibre, SloTo card
  const dark = poolDark(Ldiag);
  // I: glass block
  const dBlock = G(Ldiag);
  const blk = lwGlassBlock(dBlock, 440, 200, { label: 'glass' }).at(560, 400);
  const BIN = [480, 300], bStart = lwPt(BIN[0], BIN[1], -135, 262);
  const bPts = blk.trace(bStart, 45, LW_OPT.nGlass, 230);
  const bOut = bPts[2];
  lwNormal(dBlock, BIN[0], BIN[1], -90, 80, { back: 80, width: 2.5 });
  lwNormal(dBlock, bOut[0], bOut[1], 90, 80, { back: 80, width: 2.5 });
  const bExt = E('line', { x1: BIN[0], y1: BIN[1], x2: BIN[0], y2: BIN[1], stroke: '#FFFFFF', 'stroke-width': 4, 'stroke-dasharray': '12 10', opacity: 0.75 }, dBlock);
  const bRay = lwRayPath(dBlock, bPts);
  const EXT_END = lwPt(BIN[0], BIN[1], 45, 390);
  // lateral displacement: from a point on the emerging ray to the extended incoming line
  const LQ = lwPt(bOut[0], bOut[1], 45, 120), u45 = lwDir(45);
  const LF = (() => { const d = (LQ[0] - BIN[0]) * u45[0] + (LQ[1] - BIN[1]) * u45[1]; return [BIN[0] + u45[0] * d, BIN[1] + u45[1] * d]; })();
  const latG = G(dBlock);
  poolDouble(latG, LF[0], LF[1], LQ[0], LQ[1], C.energy);
  const latLab = label(Lfg, 'lateral displacement', { size: 32, color: C.energy });
  const blockTitle = label(Lfg, 'rectangular glass block', { size: 34 });
  const parCard = poolCard(Lfg, [['comes out', 32], ['**PARALLEL**', 40], ['just shifted sideways', 28, C.muted]]);
  // J: semicircular block (critical angle, TIR)
  const dSemi = G(Ldiag);
  const SO = [430, 330], SR = 220;
  const semi = lwSemiBlock(dSemi, SR, {}); tr(semi, SO[0], SO[1]);
  T(dSemi, SO[0], SO[1] + 202, 'glass', { size: 26, weight: 600, fill: LW_OPT.normal, anchor: 'middle' });
  T(dSemi, 150, 270, 'air', { size: 32, weight: 700, fill: C.air });
  lwNormal(dSemi, SO[0], SO[1], -90, 200, { back: 200, square: 18, label: 'normal' });
  const sIn = lwRayPath(dSemi, [[0, 0], [1, 1]]), sOut = lwRayPath(dSemi, [[0, 0], [1, 1]]), sRefl = lwRayPath(dSemi, [[0, 0], [1, 1]], { glow: false });
  const sArcI = lwArc(dSemi, SO[0], SO[1], 90, 120, 80, { text: 'i = {deg}°', color: LW_OPT.angI });
  const sArcR = lwArc(dSemi, SO[0], SO[1], -90, -60, 80, { text: 'r = {deg}°', color: LW_OPT.angR });
  const critChip = poolCard(Lfg, [['critical angle', 32, C.ink], ['≈ 42°', 46, C.energy]]);
  const tirCard = poolCard(Lfg, [['TOTAL INTERNAL', 40, C.energy], ['REFLECTION', 40, C.energy], ['beyond the critical angle', 28], ['needs:', 26, C.muted], ['• going from the DENSER material', 26], ['• an angle bigger than 42°', 26]]);
  // K: optical fibre
  const dFib = G(Ldiag);
  const FN = 48, FIB = [];
  for (let i = 0; i <= FN; i++) { const x = 70 + i * 1060 / FN; FIB.push([x, 470 - 120 * Math.sin((x - 70) / 1060 * Math.PI * 1.3 + 0.15)]); }
  const HW = 30;
  const fNorm = FIB.map((p, i) => { const a = FIB[Math.max(0, i - 1)], b = FIB[Math.min(FN, i + 1)], d = lwUnit([b[0] - a[0], b[1] - a[1]]); return [-d[1], d[0]]; });
  const wallU = FIB.map((p, i) => [p[0] + fNorm[i][0] * HW, p[1] + fNorm[i][1] * HW]);
  const wallD = FIB.map((p, i) => [p[0] - fNorm[i][0] * HW, p[1] - fNorm[i][1] * HW]);
  const poly = pts => 'M' + pts.map(q => q[0].toFixed(1) + ',' + q[1].toFixed(1)).join(' L');
  E('path', { d: poly(FIB), fill: 'none', stroke: '#2C5468', 'stroke-width': HW * 2 + 22, 'stroke-linejoin': 'round' }, dFib);
  E('path', { d: poly(FIB), fill: 'none', stroke: 'rgba(159,216,255,0.16)', 'stroke-width': HW * 2, 'stroke-linejoin': 'round' }, dFib);
  E('path', { d: poly(wallU), fill: 'none', stroke: '#9FD8FF', 'stroke-width': 3 }, dFib);
  E('path', { d: poly(wallD), fill: 'none', stroke: '#9FD8FF', 'stroke-width': 3 }, dFib);
  const walls = [];
  for (let i = 0; i < FN; i++) { walls.push([wallU[i], wallU[i + 1]]); walls.push([wallD[i], wallD[i + 1]]); }
  const zig = (() => {
    const t0 = lwUnit([FIB[1][0] - FIB[0][0], FIB[1][1] - FIB[0][1]]);
    let p = [FIB[0][0] - 30, FIB[0][1] + 8], d = lwDir(lwAng(t0) - 19), last = -1;
    const out = [p.slice()];
    for (let step = 0; step < 80; step++) {
      let best = null;
      walls.forEach(([a, b], k) => {
        if (k === last) return;
        const ex = b[0] - a[0], ey = b[1] - a[1], den2 = d[0] * ey - d[1] * ex;
        if (Math.abs(den2) < 1e-9) return;
        const tt = ((a[0] - p[0]) * ey - (a[1] - p[1]) * ex) / den2, uu = ((a[0] - p[0]) * d[1] - (a[1] - p[1]) * d[0]) / den2;
        if (tt > 1e-6 && uu >= -1e-6 && uu <= 1 + 1e-6 && (!best || tt < best.t)) best = { t: tt, k, ex, ey };
      });
      if (!best) { out.push([p[0] + d[0] * 60, p[1] + d[1] * 60]); break; }
      p = [p[0] + d[0] * best.t, p[1] + d[1] * best.t]; out.push(p.slice()); last = best.k;
      d = lwUnit(lwReflectVec(d, [best.ey, -best.ex]));
      if (p[0] > FIB[FN][0] - 4) break;
    }
    return out;
  })();
  const zigSeg = []; let zigLen = 0;
  for (let k = 1; k < zig.length; k++) { const l = Math.hypot(zig[k][0] - zig[k - 1][0], zig[k][1] - zig[k - 1][1]); zigSeg.push({ a: zig[k - 1], b: zig[k], l, s0: zigLen }); zigLen += l; }
  const zigAt = s => { s = clamp(s, 0, zigLen); for (const g of zigSeg) if (s <= g.s0 + g.l) { const f = (s - g.s0) / (g.l || 1); return { p: [lerp(g.a[0], g.b[0], f), lerp(g.a[1], g.b[1], f)], ang: Math.atan2(g.b[1] - g.a[1], g.b[0] - g.a[0]) * 180 / Math.PI }; } const g = zigSeg[zigSeg.length - 1]; return { p: g.b, ang: 0 }; };
  const zigFaint = poolLine(dFib, zig, { color: C.energy, width: 4, opacity: 0.75 });
  const zigPulse = E('path', { d: '', fill: 'none', stroke: C.energy, 'stroke-width': 9, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, dFib);
  const zigGlow = E('path', { d: '', fill: 'none', stroke: C.energy, 'stroke-width': 26, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: 0.2 }, dFib);
  const fibLab = G(dFib);
  const fl0 = FIB[10];
  E('line', { x1: fl0[0], y1: fl0[1] - HW - 12, x2: fl0[0] + 40, y2: fl0[1] - HW - 84, stroke: C.muted, 'stroke-width': 2.5 }, fibLab);
  T(fibLab, fl0[0] + 48, fl0[1] - HW - 90, 'optical fibre', { size: 32, weight: 700, fill: '#9FD8FF' });
  const tirChip = label(Lfg, 'total internal reflection at every bounce', { size: 30, color: C.energy });
  const netChip = label(Lfg, 'carries your internet', { size: 30 });

  /* ================= confessionals ================= */
  const confN = lwConf(Lconf, 'norman');
  const confR = lwConf(Lconf, 'ray');
  // Norman's red-pen exam script
  const exam = G(Lmid);
  E('rect', { x: -190, y: -170, width: 380, height: 340, rx: 8, fill: '#FBFBF5', stroke: '#C9C2A8', 'stroke-width': 3 }, exam);
  for (let i = 0; i < 6; i++) E('line', { x1: -170, y1: -80 + i * 44, x2: 170, y2: -80 + i * 44, stroke: '#D7E4F0', 'stroke-width': 2 }, exam);
  T(exam, -168, -126, 'Q4. Which way does', { size: 26, weight: 700, fill: SC_INK, font: FB });
  T(exam, -168, -94, 'light bend?', { size: 26, weight: 700, fill: SC_INK, font: FB });
  T(exam, -168, -26, 'Light ALWAYS bends', { size: 28, weight: 600, fill: '#2B3A66', font: FB });
  T(exam, -168, 14, 'towards the normal.', { size: 28, weight: 600, fill: '#2B3A66', font: FB });
  const exStrike1 = strike(exam, -172, -36, 92, '#E8282F'), exStrike2 = strike(exam, -172, 4, 92, '#E8282F');
  const exX = cross(exam, 22, '#E8282F'); tr(exX, 140, -12);
  const exNote = G(exam);
  T(exNote, 0, 84, 'Only when it', { size: 30, weight: 800, anchor: 'middle', fill: '#E8282F' });
  T(exNote, 0, 122, 'SLOWS DOWN!', { size: 30, weight: 800, anchor: 'middle', fill: '#E8282F' });
  // SloTo card
  const slo = G(Lmid);
  E('rect', { x: -400, y: -190, width: 800, height: 380, rx: 26, fill: 'rgba(10,27,39,0.95)', stroke: C.energy, 'stroke-width': 4 }, slo);
  const sloBig = E('text', { x: 0, y: -80, 'font-size': 76, 'font-weight': 800, 'text-anchor': 'middle', 'font-family': FD, fill: C.ink }, slo);
  [['Slo', C.water], ['To', C.water], [', ', C.ink], ['Fast', C.energy], ['Away', C.energy]].forEach(([s, c], i) => { const ts = E('tspan', { fill: c }, sloBig); ts.textContent = s; if (i === 1 || i === 4) ts.setAttribute('text-decoration', 'underline'); });
  const sloRow1 = T(slo, 0, 30, '**SLO**w down → bend **TO**wards the normal', { size: 34, weight: 600, anchor: 'middle', boldFill: C.water });
  const sloRow2 = T(slo, 0, 110, '**FAST** → bend **AWAY** from the normal', { size: 34, weight: 600, anchor: 'middle', boldFill: C.energy });
  tr(slo, 500, 400);
  // shortcut thought bubble (Ray, the map)
  const bub = G(Lmid);
  poolBubble(bub, 430, 250, -270, 90);
  const mini = G(bub); tr(mini, -100, 0, 1, -8);   // Ray's head, map in hand
  E('circle', { cy: 6, r: 50, fill: ball('#FFF8D6', '#F2C84B'), stroke: '#B88A1A', 'stroke-width': 4 }, mini);
  E('path', { d: 'M-48,-14 Q-46,-56 0,-58 Q46,-56 48,-14 Z M-50,-14 L64,-14 Q74,-10 78,-4 L-50,-6 Z', fill: '#2F6FD6', stroke: SC_INK, 'stroke-width': 3.5, 'stroke-linejoin': 'round' }, mini);
  E('path', { d: 'M-18,8 a7,9 0 1,0 0.1,0 M18,8 a7,9 0 1,0 0.1,0', fill: SC_INK }, mini);
  E('path', { d: 'M-18,30 Q0,46 18,30', fill: 'none', stroke: SC_INK, 'stroke-width': 4, 'stroke-linecap': 'round' }, mini);
  const map = G(bub); tr(map, 90, -20);
  E('rect', { x: -86, y: -62, width: 172, height: 124, rx: 6, fill: '#F6EEDF', stroke: '#B8AE98', 'stroke-width': 3 }, map);
  E('path', { d: 'M-66,40 C-40,-60 10,60 30,-10 S60,-50 64,-40', fill: 'none', stroke: '#E8424F', 'stroke-width': 5, 'stroke-dasharray': '10 7', 'stroke-linecap': 'round' }, map);
  E('path', { d: 'M54,-52 L72,-30 M72,-52 L54,-30', stroke: '#E8424F', 'stroke-width': 5, 'stroke-linecap': 'round' }, map);
  T(bub, 90, 86, 'SHORTCUT', { size: 30, weight: 800, anchor: 'middle', fill: '#2E8B57' });
  const pops = G(Lmid);
  for (let i = 0; i < 10; i++) { const a = i / 10 * TAU; E('line', { x1: Math.cos(a) * 140, y1: Math.sin(a) * 90, x2: Math.cos(a) * 200, y2: Math.sin(a) * 130, stroke: '#FFFFFF', 'stroke-width': 6, 'stroke-linecap': 'round' }, pops); }
  // speedometer
  const speedo = G(Lmid);
  E('rect', { x: -210, y: -150, width: 420, height: 300, rx: 24, fill: 'rgba(10,27,39,0.94)', stroke: C.water, 'stroke-width': 3 }, speedo);
  E('path', { d: 'M-140,50 A140,140 0 0 1 140,50', fill: 'none', stroke: '#3A5568', 'stroke-width': 16, 'stroke-linecap': 'round' }, speedo);
  const SPA = v => 180 + 180 * v / 330000;
  let tk = '';
  for (let v = 0; v <= 330000; v += 55000) { const a = SPA(v), p1 = lwPt(0, 50, a, 112), p2 = lwPt(0, 50, a, 132); tk += `M${p1[0].toFixed(1)},${p1[1].toFixed(1)} L${p2[0].toFixed(1)},${p2[1].toFixed(1)} `; }
  E('path', { d: tk, stroke: '#A4BCCB', 'stroke-width': 4 }, speedo);
  const needle = E('line', { x1: 0, y1: 50, x2: 110, y2: 50, stroke: '#FF4D4D', 'stroke-width': 7, 'stroke-linecap': 'round' }, speedo);
  E('circle', { cx: 0, cy: 50, r: 12, fill: '#FF4D4D', stroke: SC_INK, 'stroke-width': 3 }, speedo);
  const spMed = T(speedo, 0, -106, 'in AIR', { size: 30, weight: 800, anchor: 'middle', fill: C.air });
  const spVal = T(speedo, 0, 120, '300 000 km/s', { size: 36, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  // thnet: the phone and the router
  const phone = G(Lmid);
  E('rect', { x: -90, y: -160, width: 180, height: 320, rx: 26, fill: '#1B2733', stroke: '#3A4B5C', 'stroke-width': 6 }, phone);
  E('rect', { x: -74, y: -130, width: 148, height: 250, rx: 8, fill: '#26394B' }, phone);
  E('path', { d: 'M-20,-90 L24,-66 L-20,-42 Z', fill: '#FFFFFF', opacity: 0.25 }, phone);
  const spin = G(phone); tr(spin, 0, 10);
  const spinDots = [0, 1, 2, 3, 4, 5, 6, 7].map(i => E('circle', { cx: Math.cos(i / 8 * TAU) * 30, cy: Math.sin(i / 8 * TAU) * 30, r: 8, fill: '#FFFFFF' }, spin));
  T(phone, 0, 96, 'buffering…', { size: 26, weight: 700, anchor: 'middle', fill: '#C9D6DF' });
  const router = G(Lmid);
  E('path', { d: 'M-70,-30 L-84,-100 M70,-30 L84,-100', stroke: '#3A4B5C', 'stroke-width': 8, 'stroke-linecap': 'round' }, router);
  E('rect', { x: -120, y: -36, width: 240, height: 84, rx: 16, fill: '#E9EEF2', stroke: SC_INK, 'stroke-width': 4 }, router);
  T(router, -100, 34, 'Wi-Fi', { size: 26, weight: 800, fill: '#3A4B5C' });
  const leds = [0, 1, 2].map(i => E('circle', { cx: 44 + i * 26, cy: 22, r: 7, fill: '#56D69B' }, router));
  const rFace = G(router);
  const rPupils = [-1, 1].map(s => { E('ellipse', { cx: s * 26, cy: -8, rx: 14, ry: 12, fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 3 }, rFace); return E('circle', { cx: s * 26, cy: -8, r: 6, fill: SC_INK }, rFace); });
  E('path', { d: 'M-10,14 Q0,8 10,14', fill: 'none', stroke: SC_INK, 'stroke-width': 3.5, 'stroke-linecap': 'round' }, rFace);
  const rSweat = E('path', { d: 'M0,-12 Q9,2 0,8 Q-9,2 0,-12 Z', fill: '#BFEAFF', stroke: '#5AB4E0', 'stroke-width': 2 }, router);
  const lightChip = label(Lfg, 'Ray: 300 000 km/s', { size: 30, color: C.energy });

  /* ================= cast that moves between shots ================= */
  const norman = cast(Lcast, 'norman', {});
  // one Ray for every shot: he lives in the pool (under the water layer) and moves up to Lcast for the other shots
  const rayX = rayP;

  /* ================= chips and lower thirds ================= */
  const cTime = label(Lfg, '2:00 PM', { size: 36 });
  const cTemp = label(Lfg, '33 °C', { size: 36, color: '#FF8A3D' });
  const cDense = label(Lfg, 'OPTICALLY DENSE', { size: 44, color: C.water, stroke: C.water, sw: 3 });
  const cSpeed = label(Lfg, 'it bends because its SPEED CHANGES', { size: 32, color: C.energy });
  const cShallow = label(Lfg, 'the pool looks SHALLOWER than it is', { size: 32, color: C.energy });
  const cLegs = poolCard(Lfg, [['legs look **SHORTER**', 32], ['(refraction at the surface)', 26, C.muted]]);
  const ltDen = lwLower(Lhud, 'dennis');

  /* cut points */
  const cut = id => at(id) - 0.06;
  const cB = cut('bend'), cC = cut('shortcut'), cD = cut('towards'), cE = cut('thnorm'), cF = cut('sloto'), cG = cut('along'),
    cH = cut('shallow'), cI = cut('parallel'), cJ = cut('critical'), cK = cut('fibre'), cL = cut('thnet');
  const DIVE = mid('pool', 0.74);

  return t => {
    const sA = on(t, -1, cB), sB = on(t, cB, cC), sC = on(t, cC, cD), sD = on(t, cD, cE), sE = on(t, cE, cF), sF = on(t, cF, cG),
      sG = on(t, cG, cH), sH = on(t, cH, cI), sI = on(t, cI, cJ), sJ = on(t, cJ, cK), sK = on(t, cK, cL), sL = on(t, cL, 1e9);
    const talkR = scTalk(S, t, 'ray'), talkN = scTalk(S, t, 'norman');
    const poolOn = sA || sC || sH;
    const home = poolOn ? pCast : Lcast;
    if (rayP.parentNode !== home) home.appendChild(rayP);   // depends on t only

    /* ---------- the pool (A, C, H) ---------- */
    op(poolShot, poolOn);
    if (poolOn) {
      pool.upd(t * AMP);
      // camera
      let k = 1, cx = 600, cy = 380;
      if (sA) {
        if (t < at('dennis') - 0.06) { k = 1 + 0.03 * P(t, 0, at('dennis'), linear); }
        else if (t < at('optical') - 0.06) { k = 1.12; cx = 640; cy = 380; }
        else if (t < end('optical') + 0.05) { k = 1.5 + 0.05 * P(t, at('optical'), 2.7, linear); cx = 850; cy = 400; }
        else { k = 2.0 + 0.25 * P(t, end('optical'), cB - end('optical'), linear); cx = 470; cy = 328; }
      } else if (sC) {
        if (t < end('shortcut') + 0.05 || (t >= at('noshort') - 0.06 && t < at('noshort') + 0.4)) { k = 1.5; cx = 230; cy = 300; }
        else if (t < at('noshort') - 0.06) { k = 2.0 + 0.3 * P(t, end('shortcut'), 1.3, linear); cx = 470; cy = 328; }
        else { k = 1.35; cx = 470; cy = 360; }
      } else {
        if (t < at('deeper') - 0.06) { k = 1; }
        else if (t < end('deeper') + 0.05) { k = 1.25; cx = 820; cy = 380; }
        else if (t < at('legs') - 0.06) { k = 1.6 + 0.2 * P(t, end('deeper'), 1.1, linear); cx = 900; cy = 380; }
        else { k = 1.3 + 0.04 * P(t, at('legs'), 4.5, linear); cx = 230; cy = 470; }
      }
      camAt(poolShot, k, cx, cy);

      // Kavya: chest-deep at the edge of the pool
      tr(kav, KX, KY, KS);
      let kMood = 'neutral', kLook = 0.5;
      if (sA) { kLook = t < at('dennis') ? 0.6 : 0.85; kMood = t > at('dennis') && t < mid('dennis', 0.35) ? 'shock' : t > at('dennis') ? 'deadpan' : 'neutral'; }
      else if (sC) { kMood = t < end('shortcut') + 0.05 ? 'happy' : 'deadpan'; kLook = t < end('shortcut') ? -0.2 + 0.6 * P(t, at('shortcut'), 0.6, linear) : 0.7; }
      else {
        if (t < at('deeper') - 0.06) { kMood = 'neutral'; kLook = 0.8; }
        else if (t < at('legs') - 0.06) { kMood = 'deadpan'; kLook = 0.9; }
        else { kMood = t < mid('legs', 0.45) ? 'annoyed' : 'annoyed'; kLook = t < mid('legs', 0.5) ? -0.3 : 0.6; }
      }
      kav.set({ t, talk: scTalk(S, t, 'kavya'), mood: kMood, look: kLook });

      // Ray: on the deck, dives, treads water
      let rx = 470, ry = 385, rs = 0.62, rr = 0, rOn = 1, rMood = 'deadpan', rLook = 0;
      if (sA) {
        if (t < DIVE) { rx = 410; ry = 330 - 98 * rs; rLook = -0.3; rMood = 'neutral'; }
        else {
          const dp = P(t, DIVE, 0.75, linear), up = P(t, DIVE + 0.9, 0.5, easeOut);
          if (dp < 1) { rx = lerp(410, 520, dp); ry = lerp(330 - 98 * rs, 520, dp) - Math.sin(dp * Math.PI) * 110; rr = 175 * ease(dp); }
          else { rx = 500; ry = lerp(560, 385, up); rr = 0; }
          rLook = t > at('dennis') ? 0.85 : 0;
        }
      } else if (sC) { rx = 470; rLook = t < end('shortcut') ? -0.6 : 0; rMood = 'deadpan'; }
      else {
        if (t < at('deeper') - 0.06) rOn = 0;
        else { const up = P(t, at('deeper') - 0.06, 0.4, easeOut); rx = 690; ry = lerp(470, 387, up); rLook = t < at('legs') - 0.06 ? 0.85 : -0.8; }
      }
      if (sA && t >= DIVE) rx = t < DIVE + 0.75 ? rx : 500;
      op(rayP, rOn); tr(rayP, rx, ry, rs, rr);
      rayP.set({ t, talk: talkR, mood: rMood, look: rLook, still: sA && t > DIVE && t < DIVE + 1.4 });
      // splash
      const sp = sA ? P(t, DIVE + 0.55, 0.9, linear) : 0;
      op(splash, sp > 0 && sp < 1 ? 1 : 0);
      if (sp > 0 && sp < 1) {
        drops.forEach((d, i) => { const a = -150 + i * 20, v = 260 + (i % 3) * 50, x = 505 + Math.cos(a * Math.PI / 180) * v * sp, y = WY + Math.sin(a * Math.PI / 180) * v * sp + 420 * sp * sp; tr(d, x, y, 1.2); op(d, 1 - sp); });
        tr(splashRing, 505, WY, 1 + sp * 8); op(splashRing, 1 - sp);
      }
      // Dennis
      let dOn = 0, dx = 850, dy = 400, dS = 1.25, dMood = 'neutral', dLook = -0.4;
      if (sA && t > at('dennis') - 0.5) { dOn = 1; dy = lerp(560, 400, P(t, at('dennis') - 0.5, 0.6, easeOut)); dMood = t < at('optical') ? 'happy' : 'smug'; dLook = -0.5; }
      if (sH && t >= at('deeper') - 0.06) { dOn = 1; dx = 920; dS = 1.15; dy = lerp(560, 410, P(t, at('deeper') - 0.3, 0.5, easeOut)); dMood = t < at('legs') - 0.06 ? 'sad' : 'happy'; dLook = t < at('legs') - 0.06 ? -0.25 : -0.8; }
      op(den, dOn); tr(den, dx, dy, dS);
      den.set({ t, talk: scTalk(S, t, 'dennis'), mood: dMood, look: dLook });
      // shallow: the coin's rays, legs
      op(coin, sH && t < at('legs') - 0.06 ? 1 : 0);
      const shOn = sH && t < at('deeper') - 0.06;
      op(shallowG, shOn);
      if (shOn) {
        shRays.forEach((r, i) => r.set(P(t, at('shallow') + 0.2 + i * 0.25, 1.1, linear)));
        shNorms.forEach(n => n.set(P(t, mid('shallow', 0.2), 0.4)));
        shExt.forEach(e => op(e, P(t, mid('shallow', 0.4), 0.4, linear)));
        popIn(ghost, t, mid('shallow', 0.55), IMG[0], IMG[1], 1);
        op(depthG, P(t, mid('shallow', 0.6), 0.4, linear)); op(appG, P(t, mid('shallow', 0.72), 0.4, linear));
      }
      op(realLegs, sH && t >= at('legs') - 0.06 ? P(t, mid('legs', 0.25), 0.4, linear) : 0);
    }
    if (sA) {
      const f = 1 - P(t, at('dennis') - 0.4, 0.3, linear);
      popIn(cTime, t, at('pool') + 0.2, 720, 160, 1, 0, f);
      popIn(cTemp, t, mid('pool', 0.42), 720, 240, 1, 0, f);
    } else { op(cTime, 0); op(cTemp, 0); }
    ltDen.set(sA ? win(t, at('dennis') + 0.3, at('dennis') + 3.6, 0.3) : 0);
    if (sA && t > at('optical')) popIn(cDense, t, mid('optical', 0.55), 850, 190, 1, 0, 1 - P(t, end('optical') - 0.06, 0.05, linear)); else op(cDense, 0);

    /* ---------- B: refraction diagram ---------- */
    const surfOn = sB || sD || sG;
    op(surf, surfOn);
    op(dBend, sB);
    if (sB) {
      bNorm.set(P(t, at('bend'), 0.4));
      bInc.set(P(t, at('bend') + 0.2, 0.8, linear)); bRef.set(P(t, at('bend') + 1.0, 0.8, linear));
      op(tagFast, P(t, mid('bend', 0.08), 0.3, linear)); op(tagSlow, P(t, mid('bend', 0.2), 0.3, linear));
      bArcI.set(P(t, mid('bend', 0.5), 0.5)); bArcR.set(P(t, mid('bend', 0.58), 0.5));
      // light pulses: fast in air, slower in water
      const v1 = 330 * AMP + 40, v2 = v1 / nW, T1 = 300 / v1, T2 = 300 / v2, per = T1 + T2 + 0.35;
      pulse.forEach((pg, i) => {
        const u = t - (at('bend') + 1.8) - i * per / 2;
        if (u < 0) { op(pg, 0); return; }
        const w = u % per;
        if (w < T1) { op(pg, 1); tr(pg, lerp(bB.a[0], O[0], w / T1), lerp(bB.a[1], O[1], w / T1)); }
        else if (w < T1 + T2) { op(pg, 1); const f = (w - T1) / T2; tr(pg, lerp(O[0], bB.b[0], f), lerp(O[1], bB.b[1], f)); }
        else op(pg, 0);
      });
    }
    if (sB) { popIn(medCard, t, mid('bend', 0.4), 930, 560, 1); popIn(refrCard, t, mid('bend', 0.8), 930, 210, 1); }
    else { op(medCard, 0); op(refrCard, 0); }

    /* ---------- C: shortcut bubble, speedometer ---------- */
    const bubOn = sC && t < at('noshort') + 0.25;
    const bubHide = t > end('shortcut') + 0.05 && t < at('noshort') - 0.06;   // the hold on Ray's face
    op(bub, 0);
    if (bubOn && !bubHide) { const bp = P(t, mid('shortcut', 0.25), 0.4, pop); tr(bub, 640, 220, Math.max(0.01, 0.5 + 0.5 * bp)); op(bub, t < at('noshort') + 0.12 ? clamp(bp * 3) : 0); }
    const pp = sC ? P(t, at('noshort') + 0.1, 0.25, linear) : 0;
    op(pops, pp > 0 && pp < 1 ? 1 - pp : 0); tr(pops, 640, 220, 0.8 + pp * 0.5);
    const spOn = sC && t >= at('noshort') + 0.4;
    if (spOn) {
      popIn(speedo, t, at('noshort') + 0.45, 900, 300, 1);
      const drop = P(t, mid('noshort', 0.58), 0.7, easeOut), v = lerp(300000, 225000, drop);
      const ang = SPA(v), np = lwPt(0, 50, ang, 110);
      attr(needle, 'x2', np[0]); attr(needle, 'y2', np[1]);
      setText(spVal, (Math.round(v / 1000) + ' 000 km/s').replace(/^(\d{3}) 000/, '$1 000'));
      setText(spMed, drop > 0.5 ? 'in WATER' : 'in AIR'); attr(spMed, 'fill', drop > 0.5 ? C.water : C.air);
      popIn(cSpeed, t, mid('noshort', 0.66), 860, 610, 1);
    } else { op(speedo, 0); op(cSpeed, 0); }

    /* ---------- D: towards / away (Norman on the water) ---------- */
    op(dTow, sD && t < at('away') - 0.06); op(dAway, sD && t >= at('away') - 0.06);
    if (sD) {
      if (t < at('away') - 0.06) {
        tInc.set(P(t, at('towards') + 0.3, 0.7, linear)); tRef.set(P(t, at('towards') + 1.0, 0.7, linear));
        tArcI.set(P(t, mid('towards', 0.4), 0.5)); tArcR.set(P(t, mid('towards', 0.5), 0.5));
        popIn(towCard, t, mid('towards', 0.45), 930, 230, 1); op(awayCard, 0);
      } else {
        aInc.set(P(t, at('away') + 0.1, 0.7, linear)); aRef.set(P(t, at('away') + 0.8, 0.7, linear));
        aArcI.set(P(t, mid('away', 0.3), 0.5)); aArcR.set(P(t, mid('away', 0.42), 0.5));
        popIn(awayCard, t, mid('away', 0.45), 930, 230, 1); op(towCard, 0);
      }
    } else { op(towCard, 0); op(awayCard, 0); }

    /* ---------- E: Norman's confessional ---------- */
    confN.set(sE, t);
    if (sE) {
      const k = 1 + 0.05 * P(t, cE, end('thnorm') - cE, linear) + 0.22 * P(t, end('thnorm'), 0.9, ease);
      camAt(confN, k, 430, 330);
      popIn(exam, t, at('thnorm') + 0.2, 860, 360, 1, 4);
      exStrike1.set(P(t, mid('thnorm', 0.28), 0.3, linear)); exStrike2.set(P(t, mid('thnorm', 0.34), 0.3, linear));
      const xp = P(t, mid('thnorm', 0.38), 0.3, pop); op(exX, clamp(xp * 3)); tr(exX, 140, -12, Math.max(0.01, xp));
      op(exNote, P(t, mid('thnorm', 0.72), 0.3, linear));
    } else op(exam, 0);

    /* ---------- F: SloTo card ---------- */
    op(dark, sF || sI || sJ || sK);
    if (sF) {
      popIn(slo, t, at('sloto') + 0.05, 500, 400, 1);
      op(sloRow1, P(t, mid('sloto', 0.3), 0.3, linear)); op(sloRow2, P(t, mid('sloto', 0.62), 0.3, linear));
    } else op(slo, 0);

    /* ---------- G: along the normal ---------- */
    op(dAlong, sG);
    if (sG) {
      alRay.set(P(t, at('along') + 0.1, 0.9, linear));
      op(alFast, P(t, at('along') + 0.4, 0.3, linear)); op(alSlow, P(t, mid('along', 0.5), 0.3, linear));
      op(zeroLab, P(t, mid('along', 0.3), 0.3, linear));
      popIn(alongCard, t, mid('along', 0.6), 930, 250, 1);
    } else op(alongCard, 0);

    /* ---------- Norman (D, E, F) ---------- */
    let nOn = 0;
    if (sD) {
      nOn = 1; tr(norman, O[0], O[1] - 112 * NS, NS);
      let mood = 'neutral', look = -0.7;
      if (t < at('away') - 0.06) { look = t < mid('towards', 0.45) ? -0.7 : 0.6; mood = t > mid('towards', 0.75) ? 'happy' : 'neutral'; }
      else { look = t < mid('away', 0.4) ? -0.5 : 0.7; mood = t > mid('away', 0.6) ? 'sad' : 'neutral'; }
      norman.set({ t, talk: talkN, mood, look });
    } else if (sE) {
      nOn = 1;
      const k = 1 + 0.05 * P(t, cE, end('thnorm') - cE, linear) + 0.22 * P(t, end('thnorm'), 0.9, ease);
      tr(norman, 430 + k * (430 - 430), 330 + k * (400 - 330), 1.3 * k);
      let mood = 'annoyed', look = 0.6;
      if (t > mid('thnorm', 0.42)) { mood = 'sad'; look = 0; }
      if (t > mid('thnorm', 0.6)) { mood = 'neutral'; look = 0; }
      if (t > end('thnorm')) { mood = 'sad'; look = 0; }
      norman.set({ t, talk: talkN, mood, look });
    } else if (sF) {
      nOn = 1; popIn(norman, t, mid('sloto', 0.2), 1050, 480, 0.8);
      norman.set({ t, mood: 'smug', look: -0.6 });
    }
    if (!nOn) op(norman, 0); else if (!sF) op(norman, 1);

    /* ---------- rayX: bubble Ray, rider, confessional Ray ---------- */
    let xOn = 0;
    if (sG) {
      xOn = 1;
      // rides down the ray: fast in air, slower in water
      const t0 = at('along') + 0.6, va = 210, vw = va / nW, ya = 160, yb = 650, Ta = (O[1] - ya) / va;
      const u = Math.max(0, t - t0), y = u < Ta ? ya + u * va : Math.min(yb, O[1] + (u - Ta) * vw);
      tr(rayX, O[0], y, 0.45); op(rayX, 1);
      rayX.set({ t, talk: talkR, mood: 'deadpan', look: 0.4 });
    } else if (sK) {
      xOn = 1;
      const s = Math.max(0, t - (at('fibre') + 0.2)) * 260, z = zigAt(s);
      tr(rayX, z.p[0], z.p[1] - 40, 0.42, z.ang * 0.35); op(rayX, 1);
      rayX.set({ t, talk: talkR, mood: s >= zigLen ? 'deadpan' : 'happy', look: 0.5 });
    } else if (sL) {
      xOn = 1;
      const k = 1 + 0.04 * P(t, cL, end('thnet') - cL, linear) + 0.3 * P(t, end('thnet'), 0.9, ease);
      tr(rayX, 430, 330 + k * 90, 1.4 * k); op(rayX, 1);
      let mood = 'deadpan', look = 0;
      if (t > mid('thnet', 0.25) && t < mid('thnet', 0.55)) { mood = 'smug'; }
      if (t > mid('thnet', 0.72)) { look = 0.8; mood = 'annoyed'; }
      if (t > end('thnet')) { look = 0; mood = 'deadpan'; }
      rayX.set({ t, talk: talkR, mood, look });
    }
    if (!xOn && !poolOn) op(rayX, 0);

    /* ---------- I: glass block ---------- */
    op(dBlock, sI);
    if (sI) {
      bRay.set(P(t, at('parallel') + 0.2, 2.0, linear));
      const ep = P(t, mid('parallel', 0.42), 0.8, linear), ee = lwPt(BIN[0], BIN[1], 45, 390 * ep);
      attr(bExt, 'x2', ee[0]); attr(bExt, 'y2', ee[1]); op(bExt, ep > 0 ? 0.8 : 0);
      op(latG, P(t, mid('parallel', 0.72), 0.3, linear));
      popIn(blockTitle, t, at('parallel') + 0.1, 900, 170, 1);
      popIn(parCard, t, mid('parallel', 0.48), 960, 380, 1);
      popIn(latLab, t, mid('parallel', 0.75), 900, 640, 1);
    } else { op(blockTitle, 0); op(parCard, 0); op(latLab, 0); }

    /* ---------- J: semicircular block, critical angle ---------- */
    op(dSemi, sJ);
    if (sJ) {
      const crit = lwCritical(LW_OPT.nGlass);
      let th = lerp(20, 35, P(t, at('critical') + 0.3, mid('critical', 0.28) - at('critical') - 0.3));
      th = lerp(th, crit, P(t, mid('critical', 0.3), mid('critical', 0.48) - mid('critical', 0.3)));
      th = lerp(th, 56, P(t, mid('critical', 0.62), mid('critical', 0.8) - mid('critical', 0.62)));
      const bd = lwBend(SO[0], SO[1], 90, th, LW_OPT.nGlass, 1, SR, 240);
      sIn.pts([bd.a, bd.o]); sIn.set(P(t, at('critical') + 0.1, 0.5, linear));
      sArcI.to(SO[0], SO[1], 90, 90 + th); sArcI.set(P(t, at('critical') + 0.5, 0.4));
      if (!bd.tir) {
        sOut.pts([bd.o, bd.b]); op(sOut, 1); sOut.set(P(t, at('critical') + 0.5, 0.4, linear));
        sArcR.to(SO[0], SO[1], -90, -90 + bd.r); op(sArcR, 1); sArcR.set(P(t, at('critical') + 0.8, 0.4));
        sRefl.pts([bd.o, bd.part]); op(sRefl, 0.3); sRefl.set(1);
      } else {
        op(sOut, 0); op(sArcR, 0);
        sRefl.pts([bd.o, bd.b]); op(sRefl, 1); sRefl.set(1);
      }
      popIn(critChip, t, mid('critical', 0.38), 940, 190, 1);
      popIn(tirCard, t, mid('critical', 0.68), 940, 470, 1);
    } else { op(critChip, 0); op(tirCard, 0); }

    /* ---------- K: optical fibre ---------- */
    op(dFib, sK);
    if (sK) {
      zigFaint.set(P(t, at('fibre'), 0.8, linear));
      const s = Math.max(0, t - (at('fibre') + 0.2)) * 260, s0 = Math.max(0, s - 150);
      let d = '';
      if (s > 0 && s0 < zigLen) {
        const a = zigAt(s0).p; d = `M${a[0].toFixed(1)},${a[1].toFixed(1)}`;
        zigSeg.forEach(g => { if (g.s0 > s0 && g.s0 < s) d += ` L${g.a[0].toFixed(1)},${g.a[1].toFixed(1)}`; });
        const b = zigAt(Math.min(s, zigLen)).p; d += ` L${b[0].toFixed(1)},${b[1].toFixed(1)}`;
      }
      attr(zigPulse, 'd', d || 'M0,0'); attr(zigGlow, 'd', d || 'M0,0'); op(zigPulse, d ? 1 : 0); op(zigGlow, d ? 0.2 : 0);
      op(fibLab, P(t, at('fibre') + 0.3, 0.4, linear));
      popIn(tirChip, t, mid('fibre', 0.12), 760, 175, 1);
      popIn(netChip, t, mid('fibre', 0.7), 930, 660, 1);
    } else { op(tirChip, 0); op(netChip, 0); }

    /* ---------- L: Ray's confessional ---------- */
    confR.set(sL, t);
    if (sL) {
      const k = 1 + 0.04 * P(t, cL, end('thnet') - cL, linear) + 0.3 * P(t, end('thnet'), 0.9, ease);
      camAt(confR, k, 430, 330);
      popIn(phone, t, at('thnet') + 0.2, 880, 270, 1, 3);
      spinDots.forEach((d, i) => op(d, 0.2 + 0.8 * (((i - Math.floor(t * 10 * AMP)) % 8 + 8) % 8) / 7));
      popIn(router, t, mid('thnet', 0.62), 880, 570, 1);
      const guilty = P(t, mid('thnet', 0.8), 0.3, linear);
      op(rFace, guilty);
      rPupils.forEach((p, i) => attr(p, 'cx', (i ? 26 : -26) + 7 * guilty));
      const sw = ((t * 0.8) % 1);
      op(rSweat, guilty * (1 - sw)); tr(rSweat, 90, -40 + sw * 30);
      leds.forEach((l, i) => op(l, Math.sin(t * (7 + i * 3) * AMP + i) > 0 ? 1 : 0.25));
      popIn(lightChip, t, mid('thnet', 0.38), 430, 670, 1, 0, 1 - P(t, mid('thnet', 0.7), 0.3, linear));
    } else { op(phone, 0); op(router, 0); op(lightChip, 0); }

    /* ---------- H chips ---------- */
    if (sH && t < at('deeper') - 0.06) popIn(cShallow, t, mid('shallow', 0.35), 860, 170, 1); else op(cShallow, 0);
    if (sH && t >= at('legs') - 0.06) popIn(cLegs, t, mid('legs', 0.5), 880, 175, 1); else op(cLegs, 0);
  };
});
