/* Chapter 5, Useful and wasted energy.
   Beats: a device splits the energy it is given: useful (yellow) carries on, the rest turns orange and
   goes to the thermal store of the surroundings -> an old filament bulb glows and gets hot -> of ten
   sparks in, one leaves as light and nine as heat -> an LED gives the same light from far fewer ->
   the nine wasted sparks don't vanish: a counter stays at 9 -> showpiece: they dissipate, spreading
   thinner and thinner through the room -> a jar on a stick can't scoop them back -> friction and air
   resistance -> hot drill bits and brakes -> rub your palms: kinetic -> thermal. */
scene('wasted', S => {
  const { at, end, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;
  const Y = EN.useful, O = EN.wasted;

  /* ---------- local helpers ---------- */
  // point at arc length s along a polyline
  function poly(pts) {
    const segs = []; let L = 0;
    for (let i = 0; i < pts.length - 1; i++) {
      const l = Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]);
      segs.push({ s0: L, l, a: pts[i], b: pts[i + 1] }); L += l;
    }
    const pos = s => {
      s = clamp(s, 0, L);
      for (const q of segs) if (s <= q.s0 + q.l) { const f = q.l ? (s - q.s0) / q.l : 0; return [lerp(q.a[0], q.b[0], f), lerp(q.a[1], q.b[1], f)]; }
      const z = pts[pts.length - 1]; return [z[0], z[1]];
    };
    return { L, pos };
  }
  // smooth curve through control points, sampled into a polyline
  function curve(ctrl, n) {
    const out = [];
    for (let i = 0; i < ctrl.length - 1; i++) {
      const p0 = ctrl[Math.max(0, i - 1)], p1 = ctrl[i], p2 = ctrl[i + 1], p3 = ctrl[Math.min(ctrl.length - 1, i + 2)];
      for (let k = 0; k < n; k++) {
        const u = k / n, u2 = u * u, u3 = u2 * u;
        out.push([0, 1].map(j => 0.5 * (2 * p1[j] + (-p0[j] + p2[j]) * u + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * u2 + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * u3)));
      }
    }
    out.push(ctrl[ctrl.length - 1].slice());
    return out;
  }
  /* a steady stream of sparks along a path, one every `gap` s from t0 until t1, at `speed` px/s.
     o.color2 adds a second colour; set(t, t0, t1, mix) blends to it (mix: 0..1, or a function of
     each spark's 0..1 progress along the path). */
  function stream(parent, pts, o) {
    o = o || {};
    const g = G(parent), path = poly(pts), gap = o.gap || 0.3, sp = o.speed || 160;
    const n = Math.ceil(path.L / sp / gap) + 1, ps = [];
    for (let k = 0; k < n; k++) ps.push({
      a: spark(g, o.r || 11, { color: o.color || Y, seed: (o.seed || 0) + k }),
      b: o.color2 ? spark(g, o.r || 11, { color: o.color2, seed: (o.seed || 0) + k + 5 }) : null,
    });
    g.set = (t, t0, t1, mix) => {
      ps.forEach((q, k) => {
        const m = Math.floor((t - t0 - k * gap) / (n * gap)), e = t0 + (k + m * n) * gap, s = (t - e) * sp;
        const v = (m >= 0 && e <= t1 + 1e-6 && s <= path.L) ? Math.min(1, s / 16, (path.L - s) / 16) : 0;
        if (v <= 0) { op(q.a, 0); if (q.b) op(q.b, 0); return; }
        const [x, y] = path.pos(s);
        const mx = q.b ? clamp(typeof mix === 'function' ? mix(s / path.L) : (mix || 0)) : 0;
        tr(q.a, x, y); op(q.a, v * (1 - mx)); if (mx < 1) q.a.upd(t);
        if (q.b) { tr(q.b, x, y); op(q.b, v * mx); if (mx > 0) q.b.upd(t); }
      });
    };
    g.set(0, 1e6, 0, 0);
    return g;
  }
  // a gear wheel of outer radius R with n teeth
  function cog(parent, R, n) {
    const g = G(parent), r = R * 0.78, step = TAU / n; let d = '';
    for (let i = 0; i < n; i++) {
      [[r, -0.25], [R, -0.14], [R, 0.14], [r, 0.25]].forEach(([rad, f], j) => {
        const a = (i + f) * step; d += (i === 0 && j === 0 ? 'M' : 'L') + (Math.cos(a) * rad).toFixed(1) + ',' + (Math.sin(a) * rad).toFixed(1);
      });
    }
    E('path', { d: d + 'Z', fill: ball('#C9D3DC', '#6E7F8E'), stroke: '#E6EEF3', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, g);
    E('circle', { r: R * 0.3, fill: '#1D4A5E', stroke: '#E6EEF3', 'stroke-width': 2.5 }, g);
    return g;
  }
  // a wall socket, about 44 x 44
  function socket(parent, x, y) {
    const g = G(parent); tr(g, x, y);
    E('rect', { x: -22, y: -22, width: 44, height: 44, rx: 8, fill: '#E9EEF2', stroke: '#9AA6B2', 'stroke-width': 2.5 }, g);
    E('rect', { x: -10, y: -11, width: 6, height: 12, rx: 2, fill: '#3A444E' }, g);
    E('rect', { x: 4, y: -11, width: 6, height: 12, rx: 2, fill: '#3A444E' }, g);
    E('circle', { cx: 0, cy: 9, r: 3.5, fill: '#3A444E' }, g);
    return g;
  }
  // a row of n square cells (the bulbs' energy tally); cells[k].set(colour, p)
  function tally(parent, n, cx, y, cw, gap) {
    const g = G(parent), W_ = n * cw + (n - 1) * gap, x0 = cx - W_ / 2, cells = [];
    for (let i = 0; i < n; i++) {
      const x = x0 + i * (cw + gap) + cw / 2;
      E('rect', { x: x - cw / 2, y: y - cw / 2, width: cw, height: cw, rx: 7, fill: C.card2, stroke: C.line, 'stroke-width': 2 }, g);
      const f = E('rect', { x: -cw / 2, y: -cw / 2, width: cw, height: cw, rx: 7, 'stroke-width': 2 }, g);
      cells.push({ f, x, set: (col, p) => { f.setAttribute('fill', col); f.setAttribute('stroke', col === Y ? '#C9A800' : C.heatDk); op(f, clamp(p * 2)); tr(f, x, y, Math.max(0.01, 0.6 + 0.4 * p)); } });
      cells[i].set(Y, 0);
    }
    g.cells = cells; g.x0 = x0; g.w = W_;
    return g;
  }
  // a pop-in: fade, rise and scale
  function show(el, p, x, y, rot) { op(el, clamp(p * 2)); tr(el, x, y + (1 - clamp(p)) * 14, Math.max(0.01, 0.8 + 0.2 * p), rot); }
  const popIn = (t, t0) => P(t, t0, 0.5, pop);
  const chipO = (parent, text, col, size) => chip(parent, text, { size: size || 28, fill: C.card, stroke: col, color: col, sw: 3 });

  /* ================= A. a device: useful and wasted ================= */
  const A = G(root);
  const DX = 470, DY = 360;
  const surr = E('ellipse', { cx: 900, cy: 610, rx: 240, ry: 120, fill: glow(O) }, A);
  const sIn = stream(A, [[70, DY], [356, DY]], { gap: 0.26, speed: 170, seed: 1 });
  const sUse = stream(A, [[584, 330], [856, 330]], { gap: 0.44, speed: 170, seed: 20 });
  const sWaste = stream(A, curve([[540, 446], [598, 518], [700, 574], [806, 600]], 8), { gap: 0.44, speed: 150, color2: O, seed: 40 });
  const dev = G(A); tr(dev, DX, DY);
  E('rect', { x: -110, y: -85, width: 220, height: 170, rx: 26, fill: '#1D4A5E', stroke: '#8FB4C8', 'stroke-width': 3 }, dev);
  const cg = cog(dev, 44, 10); tr(cg, 0, -16);
  T(dev, 0, 62, 'device', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  const lbIn = T(A, 210, 316, 'energy in', { size: 30, weight: 700, anchor: 'middle' });
  const cUse = chipO(A, 'useful', Y, 32);
  const lbWant = T(A, 950, 392, 'where we want it', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  const cWaste = chipO(A, 'wasted', O, 32);
  const thG = G(A);
  const thB = enBadge(thG, 'thermal', { r: 40, label: false }); tr(thB, 852, 604);
  T(thG, 906, 594, 'thermal store', { size: 28, weight: 700, fill: O });
  T(thG, 906, 630, 'of the surroundings', { size: 28, weight: 700, fill: O });

  /* ================= C (back). the room ================= */
  const Cb = G(root);
  const RX0 = 110, RY0 = 112, RW = 980, RH = 528;          // room interior
  E('rect', { x: RX0, y: RY0, width: RW, height: RH, rx: 12, fill: '#15303C', stroke: '#2F5A6E', 'stroke-width': 3 }, Cb);
  E('rect', { x: RX0, y: RY0 + RH, width: RW, height: 52, rx: 6, fill: '#4A3B30', stroke: '#6B5546', 'stroke-width': 3 }, Cb);
  for (let i = 1; i < 7; i++) E('line', { x1: RX0 + i * RW / 7, y1: RY0 + RH + 3, x2: RX0 + i * RW / 7 - 18, y2: RY0 + RH + 49, stroke: '#6B5546', 'stroke-width': 2.5 }, Cb);
  E('line', { x1: RX0, y1: RY0 + RH - 10, x2: RX0 + RW, y2: RY0 + RH - 10, stroke: '#2F5A6E', 'stroke-width': 3 }, Cb);
  const win_ = G(Cb);
  E('rect', { x: 432, y: 160, width: 136, height: 132, rx: 6, fill: '#0A2340', stroke: '#8FB4C8', 'stroke-width': 5 }, win_);
  E('path', { d: 'M500,162 L500,290 M434,226 L566,226', stroke: '#8FB4C8', 'stroke-width': 4 }, win_);
  [[452, 184], [534, 198], [466, 268], [522, 274]].forEach(([x, y]) => E('circle', { cx: x, cy: y, r: 2.5, fill: '#DCE9F2' }, win_));
  E('path', { d: 'M538,174 A13,13 0 1 0 549,194 A10,10 0 1 1 538,174 Z', fill: '#F4F1DE' }, win_);
  // lamp stand under the bulb
  E('rect', { x: 296, y: 420, width: 8, height: 214, fill: '#7D8C99' }, Cb);
  E('ellipse', { cx: 300, cy: 636, rx: 52, ry: 10, fill: '#5D6B78', stroke: '#8E9CA9', 'stroke-width': 2 }, Cb);
  const tint = E('rect', { x: RX0, y: RY0, width: RW, height: RH, rx: 12, fill: '#FF7A30' }, Cb);

  /* ================= B. filament bulb vs LED ================= */
  const B = G(root);
  const FX = 300, LX = 900, BY = 320, BS = 1.4;
  const cabF = G(B), cabL = G(B);
  E('path', { d: `M94,462 L${FX},462 L${FX},423`, fill: 'none', stroke: '#6F8797', 'stroke-width': 8, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, cabF);
  E('path', { d: `M1106,462 L${LX},462 L${LX},423`, fill: 'none', stroke: '#6F8797', 'stroke-width': 8, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, cabL);
  socket(cabF, 72, 462); socket(cabL, 1128, 462);
  const led = enBulb(B, 'led', { s: BS }); tr(led, LX, BY);
  const hwL = heatWaves(B, { n: 2, h: 40, spacing: 26, width: 4 }); tr(hwL, LX, 214);
  const nameF = T(B, 392, 344, 'filament bulb', { size: 28, weight: 700 });
  const nameL = T(B, 806, 344, 'LED bulb', { size: 28, weight: 700, anchor: 'end' });
  const tlF = tally(B, 10, FX, 560, 40, 8), tlL = tally(B, 3, LX, 560, 40, 8);
  const tlabs = G(B);
  T(tlabs, tlF.cells[0].x, 612, 'light', { size: 26, weight: 700, anchor: 'middle', fill: Y });
  T(tlabs, (tlF.cells[1].x + tlF.cells[9].x) / 2, 612, 'heat', { size: 26, weight: 700, anchor: 'middle', fill: O });
  const cTenth = chip(B, '1/10 useful', { size: 28, fill: C.card, stroke: Y, color: Y, sw: 3 });
  const cLed = chip(B, 'same light, far less waste', { size: 28, fill: C.card, stroke: C.good, color: C.good, sw: 3 });
  const lbLight = T(B, 128, 222, 'light', { size: 26, weight: 700, anchor: 'middle', fill: Y });

  /* ---------- the filament bulb and its sparks (they stay on into the room) ---------- */
  const F = G(root);
  const fil = enBulb(F, 'filament', { s: BS }); tr(fil, FX, BY);
  const hwF = heatWaves(F, { n: 3, h: 64, spacing: 28 }); tr(hwF, FX, 204);
  const SPD = 300;
  const cr = rng(55);
  // nine heat sparks: where each hovers above the bulb, and where it ends up once it has spread
  const CL = [], SPREAD = [[150, 150], [170, 470], [190, 600], [420, 520], [600, 140], [900, 140], [1050, 230], [880, 470], [470, 380]];
  for (let k = 0; k < 9; k++) CL.push([FX + (k - 4) * 27 + (cr() - 0.5) * 14, 150 + (k % 2 ? -24 : 22) + (cr() - 0.5) * 16]);
  function bulbSparks(parent, x0, sockX, nHeat, cl, lightTo) {
    const ps = [];
    for (let k = 0; k <= nHeat; k++) {
      const pts = [[sockX, 462], [x0, 462], [x0, 410], [x0, 280]];
      const sFil = poly(pts).L;
      if (k === 0) pts.push([lerp(x0, lightTo[0], 0.55), lerp(280, lightTo[1], 0.55) + 6], lightTo);
      else curve([[x0, 280], [x0 + (cl[k - 1][0] - x0) * 0.25, 214], cl[k - 1]], 6).slice(1).forEach(p => pts.push(p));
      const path = poly(pts);
      ps.push({ a: spark(parent, 11, { color: Y, seed: k + 1 }), b: k ? spark(parent, 11, { color: O, seed: k + 11 }) : null, path, sFil, light: k === 0, cl: k ? cl[k - 1] : null, ph: cr() * TAU });
    }
    return ps;
  }
  const fSp = bulbSparks(F, FX, 94, 9, CL, [118, 246]);
  const lSp = bulbSparks(B, LX, 1106, 2, [[878, 152], [928, 136]], [1082, 246]);
  // position of one bulb spark at time t (emitted at e); returns [x, y, mix(0 yellow..1 orange), vis, arrived]
  function bulbSparkAt(q, t, e) {
    const s = (t - e) * SPD;
    if (s <= 0) return null;
    if (s < q.path.L) {
      const [x, y] = q.path.pos(s);
      const mx = q.light ? 0 : clamp((s - q.sFil + 10) / 26);
      const v = Math.min(1, s / 16, q.light ? (q.path.L - s) / 60 : 1);
      return [x, y, mx, v, false];
    }
    if (q.light) return null;
    return [q.cl[0], q.cl[1], 1, 1, true];
  }

  /* ================= C (front). counter, thermometer, the jar on a stick ================= */
  const Cf = G(root);
  const cnt = G(Cf); tr(cnt, 735, 250);
  card(cnt, -115, -48, 230, 96, { fill: C.card, stroke: O, sw: 3 });
  const cntSp = spark(cnt, 17, { color: O, seed: 4 }); tr(cntSp, -62, 0);
  const cntN = T(cnt, -24, 17, '× 0', { size: 46, weight: 700 });
  T(cnt, 0, -62, 'wasted energy', { size: 26, weight: 700, anchor: 'middle', fill: C.muted });
  const cCons = chip(Cf, 'energy is conserved', { size: 28, fill: C.card, stroke: C.good, color: C.good, sw: 3 });
  const cDiss = chip(Cf, 'dissipates: it spreads out', { size: 30, fill: C.card, stroke: O, color: O, sw: 3 });
  const thermo = G(Cf); tr(thermo, 1040, 604);
  const th = thermometer(thermo, 150, C.bad); th.set(0.3);
  const thRead = T(Cf, 1012, 532, '20 °C', { size: 30, weight: 700, anchor: 'end' });
  const cWarm = chip(Cf, 'slightly warmer', { size: 26, fill: C.card, stroke: O, color: O, sw: 2.5 });
  const scoop = G(Cf);
  const pole = E('line', { x1: 0, y1: 0, x2: 0, y2: 0, stroke: '#C8955F', 'stroke-width': 10, 'stroke-linecap': 'round' }, scoop);
  const jarG = G(scoop);
  const jar = enJar(jarG, 'thermal', { w: 100, h: 130, level: 0, label: false });
  const cHard = chip(Cf, 'very hard to reuse', { size: 30, fill: C.card, stroke: O, color: O, sw: 3 });
  const lbNothing = T(Cf, 640, 438, 'caught almost nothing', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  const stamp = G(Cf);
  E('rect', { x: -118, y: -33, width: 236, height: 66, rx: 12, fill: 'rgba(10,27,39,0.6)', stroke: O, 'stroke-width': 6 }, stamp);
  T(stamp, 0, 16, 'WASTED', { size: 44, weight: 700, anchor: 'middle', fill: O, ls: 4 });

  /* ================= D. friction, air resistance, hot brakes, rubbing hands ================= */
  const D = G(root);
  const hdF = chip(D, 'friction', { size: 30, fill: C.card, stroke: C.line, sw: 2.5 }); tr(hdF, 310, 166);
  const hdA = chip(D, 'air resistance', { size: 30, fill: C.card, stroke: C.line, sw: 2.5 }); tr(hdA, 880, 166);
  const hdH = chip(D, 'friction makes them hot', { size: 30, fill: C.card, stroke: O, color: O, sw: 3 }); tr(hdH, 600, 166);
  const Dart = G(D); tr(Dart, 0, 30);                    // the panels' art sits a little lower

  // left: a block rubbing on a rough floor
  const Lf = G(Dart);
  let gd = 'M80,482';
  for (let x = 80; x < 540; x += 12) gd += ` L${x + 6},475 L${x + 12},482`;
  E('path', { d: gd + ' L548,532 L80,532 Z', fill: '#6B4A33', stroke: '#9A7154', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, Lf);
  const rubGlow = E('ellipse', { rx: 110, ry: 16, fill: glow(O) }, Lf);
  const blk = G(Lf);
  let bd = 'M-100,-126 L100,-126 L100,-2';
  for (let x = 100; x > -100; x -= 10) bd += ` L${x - 5},5 L${x - 10},-2`;
  E('path', { d: bd + ' Z', fill: ball('#C8955F', '#8A5E36'), stroke: '#5A3B22', 'stroke-width': 3, 'stroke-linejoin': 'round' }, blk);
  E('path', { d: 'M-100,-86 L100,-86 M-100,-44 L100,-44', stroke: '#8A5E36', 'stroke-width': 3 }, blk);
  const kB = enBadge(blk, 'kinetic', { r: 30, label: false }); tr(kB, 0, -64);
  const hwBL = heatWaves(Lf, { n: 2, h: 46, spacing: 16, width: 4 }), hwBR = heatWaves(Lf, { n: 2, h: 46, spacing: 16, width: 4 });
  const fr = rng(71), rubSp = [];
  for (let k = 0; k < 4; k++) rubSp.push({ a: spark(Lf, 10, { color: Y, seed: k }), b: spark(Lf, 10, { color: O, seed: k + 9 }), ox: (fr() - 0.5) * 140, side: k % 2 ? 1 : -1, up: 40 + fr() * 50 });
  const arrowBlk = G(Lf);
  arrow(arrowBlk, -36, 0, 36, 0, { color: C.water, width: 5 }); arrow(arrowBlk, 36, 0, -36, 0, { color: C.water, width: 5 });

  // left, later: a drill bit going into wood
  const Dr = G(Dart); tr(Dr, 290, 392);
  E('rect', { x: 92, y: -96, width: 128, height: 196, rx: 6, fill: ball('#C8955F', '#8A5E36'), stroke: '#5A3B22', 'stroke-width': 3 }, Dr);
  E('path', { d: 'M110,-70 Q150,-60 200,-74 M108,40 Q150,52 204,36', fill: 'none', stroke: '#8A5E36', 'stroke-width': 3 }, Dr);
  E('rect', { x: -168, y: 112, width: 92, height: 34, rx: 8, fill: '#2B3035', stroke: '#5C6670', 'stroke-width': 2.5 }, Dr);
  E('path', { d: 'M-150,24 L-104,24 L-94,116 L-150,116 Z', fill: ball('#3B82F6', '#1E4FA8'), stroke: '#9CC3FF', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, Dr);
  E('rect', { x: -196, y: -34, width: 160, height: 64, rx: 22, fill: ball('#3B82F6', '#1E4FA8'), stroke: '#9CC3FF', 'stroke-width': 2.5 }, Dr);
  E('rect', { x: -112, y: 34, width: 12, height: 22, rx: 3, fill: '#2B3035' }, Dr);
  E('rect', { x: -38, y: -20, width: 40, height: 38, rx: 6, fill: ball('#B9C6D2', '#5D6B78'), stroke: '#DCE6ED', 'stroke-width': 2 }, Dr);
  const bitG = G(Dr);
  E('path', { d: 'M2,-7 L112,-7 L124,-1 L112,5 L2,5 Z', fill: '#AEBAC4', stroke: '#E6EEF3', 'stroke-width': 2 }, bitG);
  const bitHot = E('path', { d: 'M40,-7 L112,-7 L124,-1 L112,5 L40,5 Z', fill: O, stroke: '#FFC27A', 'stroke-width': 2 }, bitG);
  const flutes = E('path', { d: 'M8,5 L20,-7 M24,5 L36,-7 M40,5 L52,-7 M56,5 L68,-7 M72,5 L84,-7 M88,5 L100,-7', stroke: '#6E7F8E', 'stroke-width': 3, 'stroke-linecap': 'round' }, bitG);
  const bitGlow = E('ellipse', { cx: 98, cy: -1, rx: 70, ry: 40, fill: glow(O) }, Dr);
  const hwDr = heatWaves(Dr, { n: 3, h: 56, spacing: 18, width: 4 }); tr(hwDr, 84, -14);
  const lbDrill = T(Dart, 258, 318, 'drill bit', { size: 28, weight: 700, anchor: 'middle', fill: O });

  // right: a cyclist pushing through the air
  const BX = 880, BYk = 430, BKS = 1.2;
  const Rt = G(Dart);
  const ground = E('line', { x1: 640, y1: BYk + 44 * BKS + 3, x2: 1130, y2: BYk + 44 * BKS + 3, stroke: '#5E7A8C', 'stroke-width': 4, 'stroke-linecap': 'round' }, Rt);
  const dash = E('line', { x1: 640, y1: BYk + 44 * BKS + 16, x2: 1130, y2: BYk + 44 * BKS + 16, stroke: '#3E5A6C', 'stroke-width': 4, 'stroke-dasharray': '26 30', 'stroke-linecap': 'round' }, Rt);
  const airG = G(Rt);
  const STREAKS = [
    'M1135,214 C1060,214 1000,206 950,198 C890,190 830,196 790,224 C766,242 752,264 768,280 C782,294 802,282 796,266',
    'M1135,262 C1070,262 1030,248 990,236 C950,226 900,232 862,250 C820,270 784,300 760,322 C744,338 746,360 764,362 C782,364 784,344 770,338',
    'M1135,320 C1080,320 1050,316 1020,326 C990,338 976,370 940,384 C900,398 820,396 772,404 C744,410 730,428 744,442 C758,454 774,440 764,428',
    'M1135,382 C1090,382 1060,388 1040,404 C1020,420 1000,440 970,446',
  ];
  const streaks = STREAKS.map((d, i) => E('path', { d, fill: 'none', stroke: C.air, 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-dasharray': '46 22', opacity: i === 3 ? 0.55 : 0.85 }, airG));
  const wake = [0, 1, 2].map(k => spark(Rt, 9, { color: O, seed: k + 30 }));
  const WAKE = [[770, 262], [748, 338], [742, 426]];
  const bike = G(Rt); tr(bike, BX, BYk, BKS);
  const wheel = (cx) => {
    const g = G(bike); tr(g, cx, 0);
    E('circle', { r: 44, fill: 'none', stroke: '#2B3035', 'stroke-width': 8 }, g);
    E('circle', { r: 39, fill: 'none', stroke: '#C9D3DC', 'stroke-width': 3 }, g);
    const sp = G(g);
    for (let i = 0; i < 4; i++) { const a = i * Math.PI / 4; E('line', { x1: Math.cos(a) * 38, y1: Math.sin(a) * 38, x2: -Math.cos(a) * 38, y2: -Math.sin(a) * 38, stroke: '#9AA6B2', 'stroke-width': 1.6 }, sp); }
    E('circle', { r: 5, fill: '#DCE6ED' }, g);
    return { g, sp };
  };
  const RW_ = wheel(-62), FW_ = wheel(64);
  const far = G(bike);                                   // far crank and pedal, behind the frame
  const farArm = E('line', { stroke: '#7D8C99', 'stroke-width': 5, 'stroke-linecap': 'round' }, far);
  const frame = G(bike);
  const FR = '#E9EEF2', K = [-6, 4];
  E('path', { d: `M${K[0]},${K[1]} L-24,-60 L42,-62 L48,-44 Z M${K[0]},${K[1]} L-62,0 L-24,-60 M48,-44 L64,0 M42,-62 L44,-76 L58,-74`, fill: 'none', stroke: FR, 'stroke-width': 5, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, frame);
  E('path', { d: 'M-42,-77 Q-28,-82 -12,-77 L-14,-73 L-40,-73 Z', fill: '#2B3035' }, frame);
  E('path', { d: 'M-24,-60 L-27,-74', stroke: '#9AA6B2', 'stroke-width': 4 }, frame);
  const disc = G(frame); tr(disc, 64, 0);
  E('circle', { r: 17, fill: ball('#C9D3DC', '#6E7F8E'), stroke: '#E6EEF3', 'stroke-width': 2 }, disc);
  const discHoles = G(disc);
  for (let i = 0; i < 5; i++) { const a = i * TAU / 5; E('circle', { cx: Math.cos(a) * 10, cy: Math.sin(a) * 10, r: 2.6, fill: '#4B5865' }, discHoles); }
  const discHot = E('circle', { r: 17, fill: O, stroke: '#FFC27A', 'stroke-width': 2 }, disc);
  const discGlow = E('circle', { r: 44, fill: glow(O) }, disc);
  E('rect', { x: 54, y: -22, width: 16, height: 12, rx: 3, fill: '#2B3035', stroke: '#7D8C99', 'stroke-width': 1.5 }, frame);
  const person_ = person(bike, { shirt: '#5B8DEF', shorts: '#2B3A4A' });
  const PS = 1.15, HIP = [-27, -76];
  const near = G(bike);
  const nearArm = E('line', { stroke: '#C9D3DC', 'stroke-width': 5, 'stroke-linecap': 'round' }, near);
  const pedN = E('rect', { x: -8, y: -3, width: 16, height: 6, rx: 2, fill: '#2B3035' }, near);
  const pedF = E('rect', { x: -8, y: -3, width: 16, height: 6, rx: 2, fill: '#2B3035' }, far);
  E('circle', { cx: K[0], cy: K[1], r: 6, fill: '#9AA6B2' }, near);
  const hwBrake = heatWaves(Rt, { n: 2, h: 40, spacing: 16, width: 4 }); tr(hwBrake, BX + 64 * BKS, BYk - 20);
  const lbBrake = labelLine(Rt, 992, 344, BX + 68 * BKS, BYk - 10, 'brakes', { size: 28, anchor: 'start', fill: O, line: O });
  const cBoth = G(D); tr(cBoth, 600, 664);
  const cBothChip = chip(cBoth, 'both transfer energy to thermal stores', { size: 28, fill: C.card, stroke: O, color: C.ink, sw: 3, padX: 34 });
  const thSmall = enBadge(cBoth, 'thermal', { r: 26, label: false }); tr(thSmall, -cBothChip.w / 2 - 6, 0);
  // two-link reach: angles (degrees, forward-positive from straight down) for a limb from h to target
  function reach(h, tg, l1, l2, bendFwd) {
    let dx = tg[0] - h[0], dy = tg[1] - h[1], d = Math.hypot(dx, dy);
    d = clamp(d, Math.abs(l1 - l2) + 0.01, l1 + l2 - 0.01);
    const fv = Math.atan2(dx, dy), al = Math.acos(clamp((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d), -1, 1));
    const a1 = fv + (bendFwd ? al : -al);
    const kx = h[0] + l1 * Math.sin(a1), ky = h[1] + l1 * Math.cos(a1);
    const a2 = Math.atan2(tg[0] - kx, tg[1] - ky);
    return [a1 * 180 / Math.PI, (a2 - a1) * 180 / Math.PI];
  }
  const LEAN = 34;
  function poseRider(crank) {
    // in person units: hip at (0,-92); the person is drawn at HIP + (0, 92) * PS in bike units, scaled PS
    const toP = b => [(b[0] - HIP[0]) / PS, (b[1] - HIP[1]) / PS - 92];
    const pedal = a => [K[0] + 17 * Math.cos(a), K[1] + 17 * Math.sin(a)];
    const pN = pedal(crank), pF = pedal(crank + Math.PI);
    const lN = reach([0, -92], toP(pN), 45, 45, true), lF = reach([0, -92], toP(pF), 45, 45, true);
    const L = LEAN * Math.PI / 180, sh = [54 * Math.sin(L), -92 - 54 * Math.cos(L)];
    const arm = reach(sh, toP([57, -74]), 33, 31, false);
    person_.pose({ lean: LEAN, legL: [lF[0] + LEAN, lF[1]], legR: [lN[0] + LEAN, lN[1]], armL: [arm[0] + LEAN, arm[1]], armR: [arm[0] + LEAN, arm[1]] });
    farArm.setAttribute('x1', K[0]); farArm.setAttribute('y1', K[1]); attr(farArm, 'x2', pF[0]); attr(farArm, 'y2', pF[1]);
    nearArm.setAttribute('x1', K[0]); nearArm.setAttribute('y1', K[1]); attr(nearArm, 'x2', pN[0]); attr(nearArm, 'y2', pN[1]);
    tr(pedN, pN[0], pN[1]); tr(pedF, pF[0], pF[1]);
  }
  tr(person_, HIP[0], HIP[1] + 92 * PS, PS);

  // finale: rubbing hands, a stopwatch and kinetic -> thermal
  const Rb = G(D);
  const cTry = chip(Rb, 'try it yourself', { size: 30, fill: C.card, stroke: Y, color: Y, sw: 3 }); tr(cTry, 420, 140);
  const HANDX = 420, HANDY = 462;
  const seamGlow = E('ellipse', { cx: HANDX, cy: HANDY - 30, rx: 90, ry: 190, fill: glow(O) }, Rb);
  const HAND = 'M0,112 L0,-118 Q0,-160 24,-160 Q48,-158 50,-112 L54,-36 Q60,4 52,44 L44,112 Z';
  const THUMB = 'M3,34 Q28,26 29,-14 Q30,-56 12,-63 Q1,-58 3,-24 Z';
  function hand(flip) {
    const g = G(Rb), k = G(g); if (flip) k.setAttribute('transform', 'scale(-1 1)');
    E('path', { d: HAND, fill: ball('#F0C4A0', '#C98E62'), stroke: '#B5774C', 'stroke-width': 3, 'stroke-linejoin': 'round' }, k);
    E('path', { d: 'M22,-46 L24,-146 M37,-42 L40,-136', stroke: '#C98E62', 'stroke-width': 2.5, 'stroke-linecap': 'round' }, k);
    const warm = E('path', { d: HAND, fill: O }, k);
    E('path', { d: THUMB, fill: ball('#F7D2B2', '#D9A27A'), stroke: '#B5774C', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, k);
    const warmT = E('path', { d: THUMB, fill: O }, k);
    E('path', { d: 'M-2,98 L49,98 L104,320 L56,320 Z', fill: ball('#5B8DEF', '#2F5DB8'), stroke: '#9CC3FF', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, k);
    E('path', { d: 'M-2,98 L49,98 L52,112 L1,112 Z', fill: '#2F5DB8' }, k);
    return { g, warm, warmT };
  }
  const hL = hand(true), hR = hand(false);
  const motion = [-1, 1].map(s => E('path', { d: `M${HANDX + s * 104},${HANDY - 92} L${HANDX + s * 104},${HANDY + 12} M${HANDX + s * 124},${HANDY - 72} L${HANDX + s * 124},${HANDY - 8}`, stroke: C.muted, 'stroke-width': 4, 'stroke-linecap': 'round' }, Rb));
  const hwHands = heatWaves(Rb, { n: 3, h: 70, spacing: 26 }); tr(hwHands, HANDX, HANDY - 200);
  const handSp = [0, 1, 2].map(k => spark(Rb, 9, { color: O, seed: k + 50 }));
  const watch = G(Rb); tr(watch, 790, 282);
  E('rect', { x: -9, y: -64, width: 18, height: 14, rx: 3, fill: C.muted }, watch);
  E('circle', { r: 48, fill: C.card, stroke: C.ink, 'stroke-width': 5 }, watch);
  for (let i = 0; i < 12; i++) { const a = i * TAU / 12; E('line', { x1: Math.cos(a) * 36, y1: Math.sin(a) * 36, x2: Math.cos(a) * 42, y2: Math.sin(a) * 42, stroke: C.muted, 'stroke-width': 3, 'stroke-linecap': 'round' }, watch); }
  const wHand = E('line', { x1: 0, y1: 0, x2: 0, y2: -34, stroke: Y, 'stroke-width': 5, 'stroke-linecap': 'round' }, watch);
  E('circle', { r: 5, fill: Y }, watch);
  const wRead = T(Rb, 862, 300, '0 s', { size: 44, weight: 700 });
  const kt = G(Rb);
  const kBadge = enBadge(kt, 'kinetic', { r: 44 }); tr(kBadge, 770, 500);
  const tBadge = enBadge(kt, 'thermal', { r: 44, label: false }); tr(tBadge, 1000, 500);
  const tLab = G(kt);
  T(tLab, 1000, 576, 'thermal store', { size: 26, weight: 700, anchor: 'middle' });
  T(tLab, 1000, 608, 'of your skin', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  const ktArrow = arrow(kt, 834, 500, 934, 500, { color: '#FFFFFF', width: 6 });
  const ktFlow = stream(kt, [[836, 500], [926, 500]], { gap: 0.3, speed: 120, r: 9, color: Y, seed: 60 });

  /* ================= update ================= */
  return t => {
    /* ---- A: device ---- */
    const aA = Math.min(P(t, at('useful') - 0.1, 0.4, linear), 1 - P(t, at('bulb') - 0.3, 0.45, linear));
    op(A, aA);
    if (aA > 0) {
      const t0 = at('useful');
      const dp = popIn(t, t0);
      op(dev, clamp(dp * 2)); tr(dev, DX, DY, Math.max(0.01, 0.85 + 0.15 * dp));
      tr(cg, 0, -16, 1, (t * 50 * calm) % 360);
      op(lbIn, P(t, t0 + 0.3, 0.4, linear));
      const tOut = t0 + 0.3 + 286 / 170;
      sIn.set(t, t0 + 0.3, 1e6, 0);
      sUse.set(t, tOut, 1e6, 0);
      const wm = P(t, at('wasted') + 0.1, 0.6, linear);
      sWaste.set(t, tOut, 1e6, f => wm * clamp((f - 0.04) * 5));
      show(cUse, popIn(t, mid('useful', 0.6)), 950, 330);
      op(lbWant, P(t, mid('useful', 0.68), 0.4, linear));
      show(cWaste, popIn(t, mid('wasted', 0.1)), 560, 612);
      const tp = P(t, mid('wasted', 0.5), 0.5, easeOut);
      op(thG, tp); tr(thG, (1 - tp) * 20, 0);
      thB.set({ glow: 0.5 * tp * (0.7 + 0.3 * wave(t, 1.4)) });
      op(surr, 0.12 + 0.3 * P(t, mid('wasted', 0.3), 2.5, linear));
    }

    /* ---- B and the filament bulb ---- */
    const aB = win(t, at('bulb') - 0.25, at('vanish') + 0.2, 0.45);
    op(B, aB);
    const aF = Math.min(P(t, at('bulb') - 0.25, 0.45, linear), 1 - P(t, at('friction') - 0.35, 0.45, linear));
    op(F, aF);
    if (aF > 0) {
      const bp = popIn(t, at('bulb') - 0.1);
      tr(fil, FX, BY, Math.max(0.01, 0.85 + 0.15 * bp));
      const on = P(t, mid('bulb', 0.22), 0.5, linear) * (1 - P(t, at('vanish') + 0.2, 0.7, linear));
      fil.set(on * (0.9 + 0.1 * wave(t, 0.4)));
      hwF.upd(t * calm); op(hwF, P(t, mid('bulb', 0.55), 0.6, linear) * (1 - P(t, at('vanish') + 0.2, 0.7, linear)));
      // the filament's ten sparks: one becomes light, nine become heat that hover above the bulb
      const e0 = at('tenth') + 0.2, spread = P(t, at('dissipate') + 0.05, 3.9, ease);
      fSp.forEach((q, k) => {
        const e = e0 + 0.3 * k;
        let r = bulbSparkAt(q, t, e);
        if (q.light) {
          if (!r) { op(q.a, 0); return; }
          tr(q.a, r[0], r[1]); op(q.a, r[3]); q.a.upd(t);
          return;
        }
        if (!r) { op(q.a, 0); op(q.b, 0); return; }
        let [x, y, mx, v] = r;
        let s = 1;
        if (r[4]) {
          // hovering, then spreading out through the room (vanish / dissipate)
          const ek = SPREAD[k - 1], pk = clamp(spread * 1.08 - (k - 1) * 0.01);
          const amp = (4 + 5 * pk) * calm;
          x = lerp(q.cl[0], ek[0], pk) + Math.sin(t * 0.9 + q.ph) * amp;
          y = lerp(q.cl[1], ek[1], pk) + Math.cos(t * 0.75 + q.ph) * amp * 0.8;
          s = lerp(1, 0.52, pk); v = lerp(1, 0.45, pk);
          // counting pulses
          const c1 = at('vanish') + 0.5 + 0.13 * (k - 1), c2 = mid('dissipate', 0.86) + 0.09 * (k - 1);
          s *= 1 + 0.45 * Math.sin(Math.PI * P(t, c1, 0.3, linear)) + 0.6 * Math.sin(Math.PI * P(t, c2, 0.3, linear));
          v = Math.min(1, v + 0.5 * Math.sin(Math.PI * P(t, c2, 0.3, linear)));
        }
        tr(q.a, x, y, s); tr(q.b, x, y, s);
        op(q.a, v * (1 - mx)); op(q.b, v * mx);
        if (mx < 1) q.a.upd(t); if (mx > 0) q.b.upd(t);
      });
    }
    if (aB > 0) {
      op(cabF, P(t, at('bulb'), 0.5, linear)); op(cabL, P(t, at('led'), 0.4, linear));
      op(nameF, P(t, mid('bulb', 0.15), 0.5, linear));
      // filament tally
      const e0 = at('tenth') + 0.2;
      tlF.cells.forEach((c, k) => { const tf = e0 + 0.3 * k + fSp[k].sFil / SPD; c.set(k === 0 ? Y : O, popIn(t, tf)); });
      op(tlF, P(t, at('tenth'), 0.4, linear));
      op(tlabs, P(t, e0 + fSp[0].sFil / SPD + 0.2, 0.4, linear));
      show(cTenth, popIn(t, e0 + 0.3 * 9 + fSp[9].sFil / SPD + 0.25), FX, 668);
      op(lbLight, win(t, e0 + fSp[0].sFil / SPD + 0.15, at('led') + 0.3, 0.3));
      // LED
      const lp = popIn(t, at('led') + 0.05);
      op(led, clamp(lp * 2)); tr(led, LX, BY, Math.max(0.01, 0.85 + 0.15 * lp));
      op(nameL, P(t, at('led') + 0.2, 0.4, linear));
      led.set(P(t, at('led') + 0.45, 0.5, linear) * 0.95);
      hwL.upd(t * calm); op(hwL, 0.5 * P(t, at('led') + 1.6, 0.6, linear));
      const l0 = at('led') + 0.45;
      lSp.forEach((q, k) => {
        const r = bulbSparkAt(q, t, l0 + 0.3 * k);
        if (!r) { op(q.a, 0); if (q.b) op(q.b, 0); return; }
        let [x, y, mx, v] = r;
        if (r[4]) { x += Math.sin(t * 0.9 + q.ph) * 4 * calm; y += Math.cos(t * 0.75 + q.ph) * 3 * calm; }
        tr(q.a, x, y); op(q.a, v * (1 - mx)); if (mx < 1) q.a.upd(t);
        if (q.b) { tr(q.b, x, y); op(q.b, v * mx); if (mx > 0) q.b.upd(t); }
      });
      tlL.cells.forEach((c, k) => c.set(k === 0 ? Y : O, popIn(t, l0 + 0.3 * k + lSp[k].sFil / SPD)));
      op(tlL, P(t, at('led') + 0.3, 0.4, linear));
      show(cLed, popIn(t, l0 + 0.6 + lSp[2].sFil / SPD + 0.2), LX, 668);
    }

    /* ---- C: the room ---- */
    const aC = win(t, at('vanish') - 0.25, at('friction') - 0.1, 0.45);
    op(Cb, aC); op(Cf, aC);
    if (aC > 0) {
      const spread = P(t, at('dissipate') + 0.05, 3.9, ease);
      op(tint, 0.24 * spread);
      // the counter counts the nine sparks, and they are all still there after spreading
      const shown = P(t, at('vanish') + 0.25, 0.45, pop);
      const cIn = win(t, at('vanish') + 0.25, at('hard') + 0.1, 0.4);
      op(cnt, cIn); tr(cnt, 735, 250, Math.max(0.01, 0.85 + 0.15 * clamp(shown)));
      let n = 0; for (let k = 0; k < 9; k++) if (t >= at('vanish') + 0.5 + 0.13 * k + 0.1) n++;
      setText(cntN, '× ' + n);
      const bump = Math.sin(Math.PI * P(t, mid('dissipate', 0.86) + 0.85, 0.35, linear));
      cntN.setAttribute('transform', `translate(-24 0) scale(${(1 + 0.18 * bump).toFixed(3)}) translate(24 0)`);
      cntSp.upd(t);
      const cp = popIn(t, mid('vanish', 0.62));
      op(cCons, clamp(cp * 2) * (1 - P(t, at('hard'), 0.4, linear))); tr(cCons, 735, 334 + (1 - clamp(cp)) * 12, Math.max(0.01, 0.85 + 0.15 * cp));
      const dp = popIn(t, mid('dissipate', 0.18));
      op(cDiss, clamp(dp * 2) * (1 - P(t, at('hard') + 0.1, 0.4, linear))); tr(cDiss, 640, 590 + (1 - clamp(dp)) * 12, Math.max(0.01, 0.85 + 0.15 * dp));
      // thermometer creeps up a little
      op(thermo, P(t, at('dissipate') + 0.3, 0.5, linear)); op(thRead, P(t, at('dissipate') + 0.3, 0.5, linear));
      const warm = P(t, at('dissipate') + 0.8, 3.6, ease);
      th.set(0.3 + 0.07 * warm);
      setText(thRead, (20 + Math.round(warm)) + ' °C');
      show(cWarm, popIn(t, at('hard') + 0.1), 920, 470);
      // the jar on a stick sweeps through the room and catches almost nothing
      const sw = P(t, mid('hard', 0.22), 2.6, ease), sIn_ = P(t, mid('hard', 0.16), 0.4, linear);
      op(scoop, sIn_);
      if (sIn_ > 0) {
        const jx = lerp(1030, 640, sw), jy = 348 - 40 * Math.sin(sw * Math.PI);
        tr(jarG, jx, jy, 1, -90 + 10 * Math.sin(sw * Math.PI * 2));
        attr(pole, 'x1', jx + 66); attr(pole, 'y1', jy + 2); attr(pole, 'x2', 1250); attr(pole, 'y2', jy + 34);
        jar.set(0.035 * sw);
      }
      op(lbNothing, P(t, mid('hard', 0.22) + 2.4, 0.4, linear));
      show(cHard, popIn(t, mid('hard', 0.58)), 640, 494);
      const st = P(t, mid('hard', 0.84), 0.45, pop);
      op(stamp, clamp(st * 2)); tr(stamp, 640, 577, Math.max(0.01, 1.4 - 0.5 * clamp(st)), -6);
    }

    /* ---- D: friction, air resistance, hot, rub ---- */
    const aD = P(t, at('friction') - 0.25, 0.45, linear);
    op(D, aD);
    if (aD > 0) {
      const panels = 1 - P(t, at('rub') - 0.3, 0.45, linear);
      const hd = panels * (1 - P(t, at('hot') - 0.25, 0.35, linear));
      op(hdF, hd * popIn(t, at('friction'))); op(hdA, hd * popIn(t, mid('friction', 0.4)));
      const hh = popIn(t, at('hot') - 0.1); op(hdH, panels * clamp(hh * 2)); tr(hdH, 600, 166, Math.max(0.01, 0.85 + 0.15 * hh));
      // block rubbing
      const aL = Math.min(panels, 1 - P(t, at('hot') - 0.2, 0.4, linear));
      op(Lf, aL);
      if (aL > 0) {
        const tf = at('friction'), bx = 310 + 64 * Math.sin((t - tf) * 2.6 * calm);
        tr(blk, bx, 478);
        tr(rubGlow, bx, 480); op(rubGlow, 0.55 + 0.35 * wave(t, 0.6));
        tr(arrowBlk, bx, 312); op(arrowBlk, 0.85);
        tr(hwBL, bx - 114, 474); tr(hwBR, bx + 114, 474); hwBL.upd(t * calm); hwBR.upd(t * calm + 0.4);
        rubSp.forEach((q, k) => {
          const u = ((t - tf) / 1.2 + k / 4) % 1;
          if (t < tf + 0.2) { op(q.a, 0); op(q.b, 0); return; }
          let x, y, mx, v;
          if (u < 0.35) { const f = u / 0.35; x = bx + q.ox * 0.6; y = lerp(420, 478, f); mx = 0; v = Math.min(1, f * 5); }
          else { const f = (u - 0.35) / 0.65; x = bx + q.ox * 0.6 + q.side * (40 + 80 * f); y = 478 - q.up * easeOut(f); mx = clamp(f * 6); v = 1 - f; }
          tr(q.a, x, y); tr(q.b, x, y); op(q.a, v * (1 - mx)); op(q.b, v * mx); q.a.upd(t); q.b.upd(t);
        });
      }
      // drill
      const aDr = Math.min(panels, P(t, at('hot') - 0.2, 0.4, linear));
      op(Dr, aDr); op(lbDrill, aDr * P(t, at('hot') + 0.3, 0.4, linear));
      if (aDr > 0) {
        const hot = P(t, at('hot') + 0.1, 1.2, linear);
        op(bitHot, hot * 0.9); op(bitGlow, hot);
        flutes.setAttribute('transform', `translate(${(((t * 60) % 16) - 8).toFixed(1)} 0)`);
        tr(bitG, 0, Math.sin(t * 40) * 0.8 * calm);
        hwDr.upd(t * calm); op(hwDr, hot);
      }
      // cyclist
      const aRt = panels * P(t, mid('friction', 0.4), 0.5, linear);
      op(Rt, aRt);
      if (aRt > 0) {
        const tb = at('hot') + 0.2, dt = t - tb;
        // wheel turn: steady, then braking to 40% speed over 1.5 s
        const w = 6.2 * calm, dist = dt <= 0 ? t * w : tb * w + (dt < 1.5 ? w * (dt - 0.2 * dt * dt) : w * (1.5 - 0.45 + 0.4 * (dt - 1.5)));
        const deg = dist * 180 / Math.PI;
        RW_.sp.setAttribute('transform', `rotate(${(deg % 360).toFixed(1)})`); FW_.sp.setAttribute('transform', `rotate(${(deg % 360).toFixed(1)})`);
        discHoles.setAttribute('transform', `rotate(${(deg % 360).toFixed(1)})`);
        const crank = dt <= 0 ? t * 4.4 * calm : tb * 4.4 * calm;
        poseRider(crank);
        dash.setAttribute('stroke-dashoffset', ((dist * 44 * BKS) % 56).toFixed(1));
        const air = P(t, mid('friction', 0.45), 0.6, linear) * (1 - 0.7 * P(t, at('hot'), 0.6, linear));
        op(airG, air);
        streaks.forEach((s, i) => s.setAttribute('stroke-dashoffset', (-(t * 160 * calm + i * 17) % 68).toFixed(1)));
        WAKE.forEach((p, k) => { const q = ((t - mid('friction', 0.5)) / 1.6 + k / 3) % 1; tr(wake[k], p[0] - 30 * q, p[1] + 8 * Math.sin(q * 6 + k), 0.8 + 0.3 * Math.sin(q * Math.PI)); op(wake[k], air * Math.sin(q * Math.PI) * (t > mid('friction', 0.5) ? 1 : 0)); wake[k].upd(t); });
        const hot = P(t, at('hot') + 0.35, 1.0, linear);
        op(discHot, hot * 0.85); op(discGlow, hot);
        hwBrake.upd(t * calm); op(hwBrake, hot);
        lbBrake.set(P(t, at('hot') + 0.5, 0.4, linear));
      }
      const bc = popIn(t, mid('friction', 0.62));
      op(cBoth, clamp(bc * 2) * (1 - P(t, at('hot') - 0.2, 0.4, linear))); tr(cBoth, 600, 664 + (1 - clamp(bc)) * 12);
      // rubbing hands
      const aR = P(t, at('rub') - 0.2, 0.45, linear);
      op(Rb, aR);
      if (aR > 0) {
        const tr0 = at('rub');
        show(cTry, popIn(t, tr0 + 0.1), 420, 140);
        const go = P(t, mid('rub', 0.18), 0.5, linear), dy = 17 * go * Math.sin((t - tr0) * TAU * 2.4 * calm);
        tr(hL.g, HANDX - 1, HANDY + dy); tr(hR.g, HANDX + 1, HANDY - dy);
        const heat = P(t, mid('rub', 0.36), end('rub') - mid('rub', 0.36) - 0.4, linear);
        [hL, hR].forEach(h => { op(h.warm, 0.42 * heat); op(h.warmT, 0.3 * heat); });
        op(seamGlow, 0.25 + 0.75 * heat);
        motion.forEach((m, i) => op(m, go * (0.5 + 0.5 * Math.abs(Math.sin((t - tr0) * TAU * 2.4 * calm + i)))));
        hwHands.upd(t * calm); op(hwHands, heat);
        handSp.forEach((s, k) => { const u = ((t - tr0) / 1.3 + k / 3) % 1, side = k % 2 ? 1 : -1; tr(s, HANDX + side * (20 + 70 * u), HANDY - 60 - 90 * u + (k % 3) * 20); op(s, heat * Math.sin(u * Math.PI)); s.upd(t); });
        const wp = P(t, mid('rub', 0.22), 0.4, linear);
        op(watch, wp); op(wRead, wp);
        const secs = 15 * P(t, mid('rub', 0.26), mid('rub', 0.62) - mid('rub', 0.26), linear);
        wHand.setAttribute('transform', `rotate(${(secs / 60 * 360).toFixed(1)})`);
        setText(wRead, Math.floor(secs + 1e-6) + ' s');
        const kp = popIn(t, mid('rub', 0.6)), tp = popIn(t, mid('rub', 0.74));
        op(kBadge, clamp(kp * 2)); tr(kBadge, 770, 500, Math.max(0.01, 0.8 + 0.2 * kp));
        ktArrow.set(P(t, mid('rub', 0.66), 0.5)); op(ktArrow, P(t, mid('rub', 0.66), 0.2, linear));
        op(tBadge, clamp(tp * 2)); tr(tBadge, 1000, 500, Math.max(0.01, 0.8 + 0.2 * tp));
        op(tLab, clamp(tp * 2));
        tBadge.set({ label: 1, glow: 0.6 * heat });
        ktFlow.set(t, mid('rub', 0.74), 1e6, 0);
      }
    }
  };
});
