/* Chapter 6, Efficiency and Sankey diagrams.
   Beats: a device with energy in, useful out of the front and wasted out of the side, and an
   efficiency dial -> the formula types in as a fraction -> Useful Over Total -> worked example: a
   motor given 200 J turns 150 J into the kinetic store of a wheel -> 150 ÷ 200 = 0.75 on a number
   line -> × 100 = 75%, a 100-square grid -> the other 25 squares: 50 J wasted -> a big dial that
   never reaches 100% -> 120% crossed out -> showpiece: a Sankey band grows, its width is the energy,
   then it splits -> a filament bulb's fat wasted branch beside a branch that thins as the device
   gets more efficient. */
scene('efficiency', S => {
  const { at, end, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;
  const Y = EN.useful, O = EN.wasted, KIN = EN.store.kinetic.color;

  /* ---------- local helpers ---------- */
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
  // a steady stream of sparks along a path, one every `gap` s from t0 (as in the wasted chapter)
  function stream(parent, pts, o) {
    o = o || {};
    const g = G(parent), path = poly(pts), gap = o.gap || 0.3, sp = o.speed || 160;
    const n = Math.ceil(path.L / sp / gap) + 1, ps = [];
    for (let k = 0; k < n; k++) ps.push(spark(g, o.r || 11, { color: o.color || Y, seed: (o.seed || 0) + k }));
    g.set = (t, t0, t1) => {
      ps.forEach((q, k) => {
        const m = Math.floor((t - t0 - k * gap) / (n * gap)), e = t0 + (k + m * n) * gap, s = (t - e) * sp;
        const v = (m >= 0 && e <= t1 + 1e-6 && s <= path.L) ? Math.min(1, s / 16, (path.L - s) / 16) : 0;
        if (v <= 0) { op(q, 0); return; }
        const [x, y] = path.pos(s); tr(q, x, y); op(q, v); q.upd(t);
      });
    };
    g.set(0, 1e6, 0);
    return g;
  }
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
  function rich(parent, x, y, segs, o) {
    o = o || {};
    const t = E('text', { x, y, 'font-size': o.size || 30, 'font-weight': o.weight || 700, 'font-family': o.font || FD, 'text-anchor': o.anchor || 'start', fill: o.fill || C.ink }, parent);
    segs.forEach(s => { if (typeof s === 'string') s = [s]; E('tspan', { fill: s[1], 'font-weight': s[2] }, t).textContent = s[0]; });
    return t;
  }
  function show(el, p, x, y, rot) { op(el, clamp(p * 2)); tr(el, x, y + (1 - clamp(p)) * 14, Math.max(0.01, 0.8 + 0.2 * p), rot); }
  const popIn = (t, t0) => P(t, t0, 0.5, pop);
  const chipC = (parent, text, col, size, textCol) => chip(parent, text, { size: size || 28, fill: C.card, stroke: col, color: textCol || col, sw: 3 });
  /* an efficiency gauge: a half ring from 0% (left) to 100% (right), useful part yellow, the rest orange.
     g.set(v 0..1, wasteShown 0..1) */
  function gauge(parent, R, w, o) {
    o = o || {};
    const g = G(parent);
    const arcD = (v0, v1) => {
      const a0 = Math.PI * (1 + v0), a1 = Math.PI * (1 + v1);
      return `M${(Math.cos(a0) * R).toFixed(1)},${(Math.sin(a0) * R).toFixed(1)} A${R},${R} 0 0 1 ${(Math.cos(a1) * R).toFixed(1)},${(Math.sin(a1) * R).toFixed(1)}`;
    };
    E('path', { d: arcD(0, 1), fill: 'none', stroke: '#0B2230', 'stroke-width': w + 10, 'stroke-linecap': 'round' }, g);
    E('path', { d: arcD(0, 1), fill: 'none', stroke: C.card2, 'stroke-width': w, 'stroke-linecap': 'butt' }, g);
    const useA = E('path', { fill: 'none', stroke: Y, 'stroke-width': w }, g);
    const wasteA = E('path', { fill: 'none', stroke: O, 'stroke-width': w }, g);
    for (let i = 0; i <= 10; i++) {
      const a = Math.PI * (1 + i / 10), r1 = R - w / 2 - 6, r2 = r1 - (i % 5 ? 10 : 20);
      E('line', { x1: Math.cos(a) * r1, y1: Math.sin(a) * r1, x2: Math.cos(a) * r2, y2: Math.sin(a) * r2, stroke: C.muted, 'stroke-width': i % 5 ? 2.5 : 4, 'stroke-linecap': 'round' }, g);
    }
    const ls = o.labelSize || 26;
    T(g, -R, w / 2 + ls + 8, '0%', { size: ls, weight: 700, anchor: 'middle', fill: C.muted });
    T(g, R, w / 2 + ls + 8, '100%', { size: ls, weight: 700, anchor: 'middle', fill: C.muted });
    if (o.half) T(g, 0, -R - w / 2 - 14, '50%', { size: ls, weight: 700, anchor: 'middle', fill: C.muted });
    const nl = R - w / 2 - 26;
    const needle = E('path', { d: `M0,-7 L${nl},-1.5 L${nl},1.5 L0,7 Z`, fill: C.ink }, g);
    E('circle', { r: 13, fill: C.card, stroke: C.ink, 'stroke-width': 4 }, g);
    g.set = (v, ws) => {
      v = clamp(v);
      if (v > 0.002) { useA.setAttribute('d', arcD(0, v)); op(useA, 1); } else op(useA, 0);
      if (v < 0.998 && ws > 0) { wasteA.setAttribute('d', arcD(v, 1)); op(wasteA, ws); } else op(wasteA, 0);
      needle.setAttribute('transform', `rotate(${(180 + 180 * v).toFixed(2)})`);
    };
    g.set(0, 0);
    return g;
  }
  // a brace along x = x0 from y1 to y2, opening to the right (it points left); .set(p) draws it
  function vbrace(parent, x0, y1, y2, color) {
    const ym = (y1 + y2) / 2, x1 = x0 - 14, x2 = x0 - 28;
    const d = `M${x0},${y1} Q${x1},${y1} ${x1},${y1 + 14} L${x1},${ym - 12} Q${x1},${ym} ${x2},${ym} Q${x1},${ym} ${x1},${ym + 12} L${x1},${y2 - 14} Q${x1},${y2} ${x0},${y2}`;
    const p = E('path', { d, fill: 'none', stroke: color, 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', pathLength: 1, 'stroke-dasharray': '1 1' }, parent);
    p.set = q => p.setAttribute('stroke-dashoffset', (1 - clamp(q)).toFixed(4));
    p.set(0);
    return p;
  }

  /* ================= A. a device and its efficiency dial ================= */
  const A = G(root);
  const DX = 380, DY = 430;
  const sIn = stream(A, [[70, DY], [266, DY]], { gap: 0.24, speed: 170, seed: 2 });
  const sUse = stream(A, [[494, DY], [716, DY]], { gap: 0.36, speed: 170, seed: 20 });
  const sWaste = stream(A, curve([[404, 517], [430, 572], [480, 618], [540, 640]], 8), { gap: 0.6, speed: 140, color: O, seed: 40 });
  const dev = G(A); tr(dev, DX, DY);
  E('rect', { x: -110, y: -85, width: 220, height: 170, rx: 26, fill: '#1D4A5E', stroke: '#8FB4C8', 'stroke-width': 3 }, dev);
  const cg = cog(dev, 44, 10); tr(cg, 0, -16);
  T(dev, 0, 62, 'device', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  const lbIn = T(A, 168, 390, 'energy in', { size: 28, weight: 700, anchor: 'middle' });
  const lbTot = T(A, 168, 390, 'total supplied', { size: 28, weight: 700, anchor: 'middle', fill: C.ink });
  const cUse = chipC(A, 'useful', Y, 30);
  const cWas = chipC(A, 'wasted', O, 30);
  const dialS = G(A); tr(dialS, 1000, 470);
  const gS = gauge(dialS, 122, 24);
  const lbEff = T(dialS, 0, 86, 'efficiency', { size: 32, weight: 700, anchor: 'middle', fill: Y });

  /* ================= B. the formula card ================= */
  const Bf = G(root);
  const card_ = G(Bf);
  card(card_, -460, -92, 920, 184, { fill: C.card, stroke: C.line, sw: 2.5 });
  const FS = 38, wE = textWidth('efficiency =', 42, FD, 700), wN = textWidth('useful energy transferred', FS, FD, 700), wD = textWidth('total energy supplied', FS, FD, 700);
  const wBar = Math.max(wN, wD) + 24, x0 = -(wE + 26 + wBar) / 2, xBar = x0 + wE + 26;
  const fE = T(card_, x0, 15, 'efficiency =', { size: 42, weight: 700 });
  const NUM = 'useful energy transferred', DEN = 'total energy supplied';
  const xN = xBar + (wBar - wN) / 2, xD = xBar + (wBar - wD) / 2;
  const glU = E('circle', { cx: xN + 11, cy: -28, r: 40, fill: glow(Y) }, card_);
  const glT = E('circle', { cx: xD + 11, cy: 36, r: 40, fill: glow(Y) }, card_);
  const fN = T(card_, xN, -16, '', { size: FS, weight: 700, fill: Y });
  const fD = T(card_, xD, 50, '', { size: FS, weight: 700 });
  const bar = E('line', { x1: xBar, y1: 0, x2: xBar + wBar, y2: 0, stroke: C.ink, 'stroke-width': 5, 'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': '1 1' }, card_);
  const preN = [], preD = [];
  for (let i = 0; i <= NUM.length; i++) preN.push(textWidth(NUM.slice(0, i) || ' ', FS, FD, 700) * (i ? 1 : 0));
  for (let i = 0; i <= DEN.length; i++) preD.push(textWidth(DEN.slice(0, i) || ' ', FS, FD, 700) * (i ? 1 : 0));
  const caret = E('rect', { x: -2, y: -34, width: 4, height: 40, rx: 2, fill: Y }, card_);
  const uot = G(Bf);
  const uotW = textWidth('Useful Over Total', 32, FD, 700) + 56;
  E('rect', { x: -uotW / 2, y: -28, width: uotW, height: 56, rx: 28, fill: C.card, stroke: Y, 'stroke-width': 3 }, uot);
  rich(uot, 0, 11, [['U', Y, 800], ['seful ', C.ink, 600], ['O', Y, 800], ['ver ', C.ink, 600], ['T', Y, 800], ['otal', C.ink, 600]], { size: 32, anchor: 'middle' });

  /* ================= C. worked example: a motor ================= */
  const Cw = G(root);
  const MX = 285, MY = 470;
  // socket and cable
  const sock = G(Cw); tr(sock, 64, MY);
  E('rect', { x: -22, y: -22, width: 44, height: 44, rx: 8, fill: '#E9EEF2', stroke: '#9AA6B2', 'stroke-width': 2.5 }, sock);
  E('rect', { x: -10, y: -11, width: 6, height: 12, rx: 2, fill: '#3A444E' }, sock); E('rect', { x: 4, y: -11, width: 6, height: 12, rx: 2, fill: '#3A444E' }, sock);
  E('path', { d: `M86,${MY} L182,${MY}`, stroke: '#6F8797', 'stroke-width': 8, 'stroke-linecap': 'round' }, Cw);
  const mIn = stream(Cw, [[88, MY], [180, MY]], { gap: 0.3, speed: 120, seed: 4 });
  // the motor
  const mot = G(Cw); tr(mot, MX, MY);
  E('path', { d: 'M-92,60 L-72,42 L68,42 L88,60 Z', fill: '#4B5865', stroke: '#7D8C99', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, mot);
  E('rect', { x: -105, y: -62, width: 190, height: 124, rx: 30, fill: ball('#9DB0BF', '#4B5E6E'), stroke: '#CFE0EA', 'stroke-width': 3 }, mot);
  for (let i = 0; i < 6; i++) E('line', { x1: -74 + i * 26, y1: -56, x2: -74 + i * 26, y2: 56, stroke: '#5E7282', 'stroke-width': 4, opacity: 0.7 }, mot);
  E('ellipse', { cx: 85, cy: 0, rx: 22, ry: 58, fill: ball('#B9C6D2', '#6E7F8E'), stroke: '#DCE6ED', 'stroke-width': 3 }, mot);
  E('rect', { x: -46, y: -84, width: 60, height: 24, rx: 5, fill: '#3E5568', stroke: '#8FB4CC', 'stroke-width': 2.5 }, mot);
  const motHot = E('rect', { x: -105, y: -62, width: 190, height: 124, rx: 30, fill: O }, mot);
  E('rect', { x: 106, y: -7, width: 58, height: 14, rx: 4, fill: ball('#DCE6ED', '#7D8C99') }, mot);   // shaft
  // the wheel it spins (its kinetic store)
  const WX = MX + 214, wheelG = G(Cw); tr(wheelG, WX, MY);
  const wheelSpin = G(wheelG);
  E('circle', { r: 56, fill: 'rgba(76,201,240,0.10)', stroke: KIN, 'stroke-width': 11 }, wheelSpin);
  for (let i = 0; i < 4; i++) { const a = i * Math.PI / 4; E('line', { x1: Math.cos(a) * 50, y1: Math.sin(a) * 50, x2: -Math.cos(a) * 50, y2: -Math.sin(a) * 50, stroke: '#BDEBFA', 'stroke-width': 4 }, wheelSpin); }
  E('circle', { r: 11, fill: ball('#DCE6ED', '#7D8C99') }, wheelG);
  const rimSp = [0, 1, 2].map(k => spark(wheelSpin, 11, { seed: k + 3 }));
  rimSp.forEach((s, k) => tr(s, Math.cos(k * TAU / 3) * 56, Math.sin(k * TAU / 3) * 56));
  const lbKin = T(Cw, WX, MY + 98, 'kinetic', { size: 28, weight: 700, anchor: 'middle', fill: KIN });
  const cSup = chipC(Cw, '200 J supplied', '#FFFFFF', 30, C.ink);
  const cUse2 = chipC(Cw, '150 J useful', Y, 30);
  const cWas2 = chipC(Cw, '50 J wasted', O, 30);
  const hwMot = heatWaves(Cw, { n: 3, h: 54, spacing: 24 }); tr(hwMot, MX + 52, MY - 66);
  const heatSp = [0, 1, 2].map(k => spark(Cw, 10, { color: O, seed: k + 20 }));
  // the sum: 150 ÷ 200 = 0.75
  const EQY = 304, EQX = 885;
  const eqParts = [['150', Y], ['÷', C.muted], ['200', C.ink], ['=', C.muted], ['0.75', Y]].map(([s, col]) => ({ s, col, w: textWidth(s, 46, FD, 700) }));
  { let tot = 0; eqParts.forEach((p, i) => { tot += p.w + (i ? 20 : 0); }); let x = EQX - tot / 2; eqParts.forEach((p, i) => { if (i) x += 20; p.x = x + p.w / 2; x += p.w; }); }
  eqParts.forEach(p => { p.el = T(Cw, 0, 0, p.s, { size: 46, weight: 700, anchor: 'middle', fill: p.col }); });
  // number line 0..1
  const NLX0 = 660, NLX1 = 1110, NLY = 430, nlx = v => lerp(NLX0, NLX1, v);
  const nlG = G(Cw);
  E('line', { x1: NLX0, y1: NLY, x2: NLX1, y2: NLY, stroke: C.ink, 'stroke-width': 4, 'stroke-linecap': 'round' }, nlG);
  [0, 0.25, 0.5, 0.75, 1].forEach(v => E('line', { x1: nlx(v), y1: NLY - (v % 1 ? 10 : 16), x2: nlx(v), y2: NLY + (v % 1 ? 10 : 16), stroke: C.ink, 'stroke-width': 3, 'stroke-linecap': 'round' }, nlG));
  const nl0 = T(nlG, NLX0, NLY + 52, '0', { size: 30, weight: 700, anchor: 'middle' });
  const nl1 = T(nlG, NLX1, NLY + 52, '1', { size: 30, weight: 700, anchor: 'middle' });
  T(nlG, nlx(0.5), NLY + 48, '0.5', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  const nlM = G(nlG);
  E('path', { d: 'M0,-12 L-12,-30 L12,-30 Z', fill: Y }, nlM);
  E('circle', { r: 9, fill: Y, stroke: '#FFF7C2', 'stroke-width': 2 }, nlM);
  const nlMt = T(nlM, 0, -42, '0.75', { size: 28, weight: 700, anchor: 'middle', fill: Y });
  // × 100 = 75%, and the grid
  const l2 = rich(Cw, EQX, 372, [['0.75', C.ink], [' × 100 = ', C.muted], ['75%', Y, 800]], { size: 44, anchor: 'middle' });
  const grid = enGrid100(Cw, { cell: 22, gap: 4 }); tr(grid, 650, 410);
  const gLab = G(Cw);
  const g75 = T(gLab, 932, 480, '75%', { size: 54, weight: 700, fill: Y });
  const g75b = T(gLab, 932, 516, 'useful', { size: 28, weight: 700, fill: Y });
  const g25 = T(gLab, 932, 604, '25%', { size: 54, weight: 700, fill: O });
  const g25b = T(gLab, 932, 640, 'wasted (50 J)', { size: 28, weight: 700, fill: O });

  /* ================= D. never 100%; over 100% means a mistake ================= */
  const Dn = G(root);
  const dialB = G(Dn); tr(dialB, 600, 520);
  const gB = gauge(dialB, 220, 40, { half: true, labelSize: 28 });
  const readB = T(dialB, 0, 74, '75%', { size: 52, weight: 700, anchor: 'middle', fill: Y });
  const lbEffB = T(dialB, 0, 116, 'efficiency', { size: 30, weight: 700, anchor: 'middle', fill: C.muted });
  const hwGap = heatWaves(Dn, { n: 2, h: 48, spacing: 18, width: 4 });
  const cSome = chipC(Dn, 'always some waste', O, 30);
  const lead = E('path', { fill: 'none', stroke: O, 'stroke-width': 3, 'stroke-linecap': 'round' }, Dn);
  const eng = G(Dn); tr(eng, 200, 250);
  E('circle', { r: 46, fill: C.card2, stroke: C.line, 'stroke-width': 3 }, eng);
  const spanner = G(eng); tr(spanner, 0, 0, 1, 45);
  E('rect', { x: -7, y: -6, width: 14, height: 52, rx: 7, fill: '#C9D3DC', stroke: '#8E9CA9', 'stroke-width': 2 }, spanner);
  E('circle', { cx: 0, cy: -20, r: 19, fill: '#C9D3DC', stroke: '#8E9CA9', 'stroke-width': 2 }, spanner);
  E('rect', { x: -7, y: -44, width: 14, height: 24, fill: C.card2 }, spanner);
  const cEng = G(Dn);
  card(cEng, -150, -45, 300, 90, { fill: C.card, stroke: C.good, sw: 3, rx: 22 });
  T(cEng, 0, -6, 'engineers make the', { size: 28, weight: 700, anchor: 'middle', fill: C.good });
  T(cEng, 0, 28, 'waste smaller', { size: 28, weight: 700, anchor: 'middle', fill: C.good });
  // the check: a result over 100% is a mistake
  const Ck = G(root);
  const work = G(Ck); tr(work, 600, 290);
  card(work, -300, -80, 600, 160, { fill: '#F4F1DE', stroke: '#C9BE8E', sw: 3, rx: 14 });
  for (let i = 0; i < 3; i++) E('line', { x1: -280, y1: -36 + i * 44, x2: 280, y2: -36 + i * 44, stroke: '#A8C8E0', 'stroke-width': 2, opacity: 0.7 }, work);
  E('line', { x1: -238, y1: -80, x2: -238, y2: 80, stroke: '#E8A0A0', 'stroke-width': 2.5 }, work);
  const wTxt = rich(work, 0, 18, [['efficiency = ', '#2A3440'], ['120%', '#C2253A', 800]], { size: 54, anchor: 'middle' });
  const w1 = textWidth('efficiency = ', 54, FD, 700), w2 = textWidth('120%', 54, FD, 800), XC = -(w1 + w2) / 2 + w1 + w2 / 2;
  const wStrike = E('line', { x1: XC - w2 / 2 - 6, y1: 0, x2: XC + w2 / 2 + 6, y2: 0, stroke: '#C2253A', 'stroke-width': 6, 'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': '1 1' }, work);
  const wX = cross(work, 34); tr(wX, 352, 0);
  const mag = G(Ck); tr(mag, 400, 458);
  E('line', { x1: 14, y1: 14, x2: 38, y2: 38, stroke: '#C9D6DE', 'stroke-width': 10, 'stroke-linecap': 'round' }, mag);
  E('circle', { r: 24, fill: 'rgba(159,216,255,0.14)', stroke: '#E4EDF2', 'stroke-width': 6 }, mag);
  const lbCheck = T(Ck, 446, 470, 'check your working!', { size: 38, weight: 700, fill: C.ink });
  const cOut = G(Ck); tr(cOut, 600, 586);
  const coW = textWidth('energy out ≤ energy in', 34, FD, 700) + 64;
  E('rect', { x: -coW / 2, y: -31, width: coW, height: 62, rx: 31, fill: C.card, stroke: C.good, 'stroke-width': 3 }, cOut);
  rich(cOut, 0, 12, [['energy ', C.ink], ['out', Y, 800], [' ≤ energy ', C.ink], ['in', C.ink, 800]], { size: 34, anchor: 'middle' });

  /* ================= E. Sankey diagrams ================= */
  const Es = G(root);
  const SKX = 310, SKY = 300;
  const SPL = 330;
  const sk = enSankey(Es, { width: 200, useful: 0.75, len: 640, split: SPL, drop: 150, r: 40, labels: { in: '200 J in', useful: '150 J useful', wasted: '50 J wasted' } });
  tr(sk, SKX, SKY);
  const inHead = E('path', { d: 'M0,-114 L58,0 L0,114 Z', fill: Y }, Es);
  const brG = G(Es);
  const br = vbrace(brG, SKX - 12, SKY - 100, SKY + 100, '#FFFFFF');
  const brT = G(brG);
  T(brT, SKX - 50, SKY - 8, 'width =', { size: 28, weight: 700, anchor: 'end' });
  T(brT, SKX - 50, SKY + 28, 'amount of', { size: 28, weight: 700, anchor: 'end' });
  T(brT, SKX - 50, SKY + 64, 'energy', { size: 28, weight: 700, anchor: 'end' });
  // the filament bulb's Sankey (left) and labels for both small ones
  const SL = { x: 120, y: 330 }, SR = { x: 688, y: 330 }, SS = 0.56;
  const skL = enSankey(Es, { width: 200 * SS, useful: 0.1, len: 640 * SS, split: SPL * SS, drop: 150 * SS, r: 40 * SS, labels: { in: '', useful: '', wasted: '' } });
  tr(skL, SL.x, SL.y);
  const smallLab = (parent, text, col) => T(parent, 0, 0, text, { size: 28, weight: 700, fill: col });
  const labL = G(Es), labR = G(Es);
  const lLight = smallLab(labL, 'light', Y), lHeat = smallLab(labL, 'heat', O);
  const rUse = smallLab(labR, 'useful', Y), rWas = smallLab(labR, 'wasted', O);
  const bulbIc = enBulb(labL, 'filament', { s: 0.5, on: 1 }); tr(bulbIc, 150, 214);
  T(labL, 190, 214, 'filament bulb', { size: 28, weight: 700 });
  const effL = rich(labL, 300, 612, [['efficiency ', C.muted, 600], ['10%', O, 800]], { size: 30, anchor: 'middle' });
  const tagL = chipC(labL, 'inefficient', C.bad, 30);
  const titleR = T(labR, 880, 214, 'a more efficient device', { size: 28, weight: 700, anchor: 'middle' });
  const effR = rich(labR, 880, 612, [['efficiency ', C.muted, 600], ['75%', Y, 800]], { size: 30, anchor: 'middle' });
  const tagR = chipC(labR, 'efficient', C.good, 30);
  // place a small Sankey's labels from its geometry (origin o, scale s)
  function placeLabels(g, o, s, uEl, wEl) {
    const q = g.geo, ww = q.yBottom - q.ySplit;
    attr(uEl, 'x', o.x + s * (q.len + 14)); attr(uEl, 'y', o.y + s * (q.yTop + q.ySplit) / 2 + 10);
    attr(wEl, 'x', o.x + s * (q.wasteX + ww / 2) + 16); attr(wEl, 'y', o.y + s * (q.yBottom + q.wasteEnd) / 2 + 22);
  }

  /* ================= update ================= */
  return t => {
    /* ---- A ---- */
    const aA = Math.min(P(t, at('what') - 0.1, 0.4, linear), 1 - P(t, at('motor') - 0.3, 0.45, linear));
    op(A, aA);
    if (aA > 0) {
      const t0 = at('what'), dp = popIn(t, t0);
      op(dev, clamp(dp * 2)); tr(dev, DX, DY, Math.max(0.01, 0.85 + 0.15 * dp));
      tr(cg, 0, -16, 1, (t * 50 * calm) % 360);
      const tOut = t0 + 0.3 + 196 / 170;
      sIn.set(t, t0 + 0.3, 1e6); sUse.set(t, tOut, 1e6); sWaste.set(t, tOut + 0.2, 1e6);
      // "energy in" becomes "total supplied" as the formula's bottom line types in
      const tm = mid('formula', 0.62);
      op(lbIn, P(t, t0 + 0.3, 0.4, linear) * (1 - P(t, tm, 0.22, linear))); op(lbTot, P(t, tm + 0.2, 0.3, linear));
      // "Useful", "Over" and "Total" are said at 0.34, 0.55 and 0.7 of the uot line
      const uP = Math.sin(Math.PI * P(t, mid('uot', 0.32), 0.5, linear)), tP = Math.sin(Math.PI * P(t, mid('uot', 0.7), 0.5, linear));
      const nP = Math.sin(Math.PI * P(t, mid('formula', 0.26), 0.6, linear));
      const cu = popIn(t, mid('what', 0.48));
      op(cUse, clamp(cu * 2)); tr(cUse, 772, DY + (1 - clamp(cu)) * 14, Math.max(0.01, 0.8 + 0.2 * cu + 0.12 * Math.max(uP, nP)));
      lbTot.setAttribute('transform', `translate(168 390) scale(${(1 + 0.12 * tP).toFixed(3)}) translate(-168 -390)`);
      show(cWas, popIn(t, mid('what', 0.76)), 612, 652);
      const dS = win(t, mid('what', 0.12), at('formula') + 0.1, 0.4);
      op(dialS, dS);
      if (dS > 0) {
        const v = 0.62 * P(t, mid('what', 0.3), 1.4, easeOut);
        gS.set(v + 0.01 * Math.sin(t * 3) * calm * P(t, mid('what', 0.55), 0.5, linear), P(t, mid('what', 0.72), 0.5, linear));
      }
    }

    /* ---- B: formula ---- */
    const aB = Math.min(P(t, at('formula') - 0.1, 0.4, linear), 1 - P(t, at('never') - 0.3, 0.45, linear));
    op(Bf, aB);
    if (aB > 0) {
      const cp = P(t, at('motor') - 0.2, 0.9);
      const pin = popIn(t, at('formula') - 0.1);
      tr(card_, 600, lerp(204, 172, cp), lerp(0.85 + 0.15 * clamp(pin), 0.72, cp));
      op(fE, P(t, at('formula'), 0.4, linear));
      const n1 = Math.round(NUM.length * P(t, mid('formula', 0.2), mid('formula', 0.52) - mid('formula', 0.2), linear));
      const n2 = Math.round(DEN.length * P(t, mid('formula', 0.62), mid('formula', 0.93) - mid('formula', 0.62), linear));
      setText(fN, NUM.slice(0, n1)); setText(fD, DEN.slice(0, n2));
      bar.setAttribute('stroke-dashoffset', (1 - P(t, mid('formula', 0.53), 0.5)).toFixed(4));
      const typing1 = t >= mid('formula', 0.18) && n1 < NUM.length, typing2 = t >= mid('formula', 0.6) && n2 < DEN.length;
      op(caret, (typing1 || typing2) && wave(t, 0.5) > 0.3 ? 1 : 0);
      if (typing1) { attr(caret, 'x', xN + preN[n1] + 2); attr(caret, 'y', -48); }
      if (typing2) { attr(caret, 'x', xD + preD[n2] + 2); attr(caret, 'y', 18); }
      // Useful Over Total: U, the bar ("over") and T light up
      const pU = Math.sin(Math.PI * P(t, mid('uot', 0.32), 0.6, linear)), pO = Math.sin(Math.PI * P(t, mid('uot', 0.52), 0.6, linear)), pT = Math.sin(Math.PI * P(t, mid('uot', 0.7), 0.6, linear));
      op(glU, pU); op(glT, pT);
      bar.setAttribute('stroke', pO > 0.05 ? Y : C.ink); bar.setAttribute('stroke-width', (5 + 4 * pO).toFixed(2));
      const up = popIn(t, at('uot') + 0.05);
      op(uot, clamp(up * 2) * (1 - P(t, at('motor') - 0.3, 0.4, linear))); tr(uot, 880, 340 + (1 - clamp(up)) * 12, Math.max(0.01, 0.85 + 0.15 * up));
    }

    /* ---- C: the motor ---- */
    const aC = win(t, at('motor') - 0.25, at('never') - 0.05, 0.45);
    op(Cw, aC);
    if (aC > 0) {
      const t0 = at('motor');
      const mp = popIn(t, t0 + 0.05);
      op(mot, clamp(mp * 2)); tr(mot, MX, MY, Math.max(0.01, 0.85 + 0.15 * mp));
      op(wheelG, clamp(popIn(t, t0 + 0.25) * 2));
      mIn.set(t, t0 + 0.2, 1e6);
      const spin = clamp((t - t0 - 0.6) / 1.2);
      wheelSpin.setAttribute('transform', `rotate(${(((t - t0) * 140 * calm * spin) % 360).toFixed(1)})`);
      rimSp.forEach((s, k) => { op(s, P(t, mid('motor', 0.72) + k * 0.15, 0.4, linear)); s.upd(t); });
      show(cSup, popIn(t, mid('motor', 0.32)), 178, 364);
      show(cUse2, popIn(t, mid('motor', 0.66)), WX, 364);
      op(lbKin, P(t, mid('motor', 0.8), 0.4, linear));
      // the 50 J of waste
      const hot = P(t, mid('rest', 0.15), 1.2, linear);
      op(motHot, 0.35 * hot); hwMot.upd(t * calm); op(hwMot, hot);
      heatSp.forEach((s, k) => { const u = ((t - mid('rest', 0.15)) / 1.6 + k / 3) % 1; tr(s, MX + 18 + k * 30 + Math.sin(u * 5 + k) * 8, MY - 66 - u * 90); op(s, hot * Math.sin(u * Math.PI)); s.upd(t); });
      show(cWas2, popIn(t, mid('rest', 0.3)), MX, 610);
      // the sum, built from the two chips
      const fly = (p, from, to) => { const e = ease(clamp(p)); return [lerp(from[0], to[0], e), lerp(from[1], to[1], e) - Math.sin(Math.PI * clamp(p)) * 40]; };
      eqParts.forEach((p, i) => {
        let x = p.x, y = EQY, a;
        if (i === 0 || i === 2) {
          const q = P(t, mid('calc', i ? 0.34 : 0.14), 0.8, linear);
          [x, y] = fly(q, i ? [124, 376] : [WX - 52, 376], [p.x, EQY]); a = q > 0 ? 1 : 0;
        } else a = P(t, mid('calc', [0, 0.29, 0, 0.5, 0.53][i]), 0.35, linear);
        p.el.setAttribute('x', x.toFixed(1)); p.el.setAttribute('y', y.toFixed(1)); op(p.el, a);
      });
      const nlA = win(t, mid('calc', 0.62), at('percent') + 0.1, 0.4);
      op(nlG, nlA);
      if (nlA > 0) {
        const v = 0.75 * P(t, mid('calc', 0.66), 1.3, easeOut);
        tr(nlM, nlx(v), NLY);
        op(nlMt, P(t, mid('calc', 0.66) + 1.0, 0.3, linear));
        const pz = Math.sin(Math.PI * P(t, mid('calc', 0.86), 0.6, linear));
        [nl0, nl1].forEach(e => { e.setAttribute('fill', pz > 0.1 ? Y : C.ink); });
      }
      op(l2, P(t, at('percent') + 0.2, 0.45, linear));
      const gA = P(t, mid('percent', 0.3), 0.4, linear);
      op(grid, gA);
      grid.set({ useful: 75 * P(t, mid('percent', 0.4), 1.6, linear), wasted: 25 * P(t, mid('rest', 0.12), 1.0, linear) });
      op(g75, P(t, mid('percent', 0.4) + 1.6, 0.4, linear)); op(g75b, P(t, mid('percent', 0.4) + 1.6, 0.4, linear));
      op(g25, P(t, mid('rest', 0.12) + 1.0, 0.4, linear)); op(g25b, P(t, mid('rest', 0.12) + 1.0, 0.4, linear));
    }

    /* ---- D: never 100% ---- */
    const aD = win(t, at('never') - 0.2, at('check') + 0.05, 0.45);
    op(Dn, aD);
    if (aD > 0) {
      const t0 = at('never');
      const dp = popIn(t, t0 - 0.1);
      tr(dialB, 600, 520, Math.max(0.01, 0.9 + 0.1 * dp));
      // the needle rises towards 100% but always stops short, then engineers nudge it closer
      const up = P(t, mid('never', 0.08), 1.6, easeOut), nudge = P(t, mid('never', 0.72), 1.8, ease);   // "Engineers work..." at 0.7
      const bump = Math.exp(-3 * Math.max(0, t - mid('never', 0.08) - 1.6)) * Math.sin(Math.max(0, t - mid('never', 0.08) - 1.6) * 14) * 0.012 * (t > mid('never', 0.08) + 1.6 ? 1 : 0);
      const v = 0.75 + 0.15 * up + 0.07 * nudge + bump * calm;
      gB.set(v, 1);
      setText(readB, Math.round(clamp(v) * 100) + '%');
      // a wisp of heat from the waste end of the gauge
      const ang = Math.PI * (1 + (v + 1) / 2), gx = 600 + Math.cos(ang) * 220, gy = 520 + Math.sin(ang) * 220;
      tr(hwGap, gx, gy - 24); hwGap.upd(t * calm); op(hwGap, P(t, mid('never', 0.28), 0.5, linear));
      const sp = popIn(t, mid('never', 0.3));
      show(cSome, sp, 950, 250);
      lead.setAttribute('d', `M${890},${276} Q${gx + 30},${gy - 70} ${gx + 6},${gy - 18}`);
      op(lead, clamp(sp * 2));
      const ep = popIn(t, mid('never', 0.66));
      op(eng, clamp(ep * 2)); tr(eng, 200, 250, Math.max(0.01, 0.8 + 0.2 * ep));
      tr(spanner, 0, 0, 1, 45 + 18 * Math.sin(Math.max(0, t - mid('never', 0.72)) * 7) * nudge * (1 - nudge) * 4 * calm);
      show(cEng, popIn(t, mid('never', 0.7)), 200, 362);
    }
    const aK = win(t, at('check') - 0.15, at('sankey') - 0.05, 0.4);
    op(Ck, aK);
    if (aK > 0) {
      const wp = popIn(t, at('check') + 0.05);
      op(work, clamp(wp * 2)); tr(work, 600, 290 + (1 - clamp(wp)) * 14);
      // "over a hundred per cent" ends at 0.44 of the line, "check your working" 0.48, "You can't get more..." 0.68
      const xp = popIn(t, mid('check', 0.42));
      op(wX, clamp(xp * 2)); tr(wX, 352, 0, Math.max(0.01, xp));
      wStrike.setAttribute('stroke-dashoffset', (1 - P(t, mid('check', 0.4), 0.4)).toFixed(4));
      const mp = popIn(t, mid('check', 0.46));
      op(mag, clamp(mp * 2)); tr(mag, 400 + 6 * Math.sin(t * 2.5) * calm, 458, Math.max(0.01, 0.8 + 0.2 * mp));
      op(lbCheck, P(t, mid('check', 0.48), 0.4, linear));
      show(cOut, popIn(t, mid('check', 0.68)), 600, 586);
    }

    /* ---- E: Sankey ---- */
    const aE = P(t, at('sankey') - 0.15, 0.4, linear);
    op(Es, aE);
    if (aE > 0) {
      const grow = P(t, at('sankey') + 0.2, 2.0, ease);
      const split = P(t, at('branch') + 0.2, 3.0, ease);
      const shrink = P(t, at('fat') - 0.2, 1.0, ease);
      const uR = lerp(0.75, 0.9, P(t, mid('fat', 0.56), 2.2, ease));
      sk.set({ grow, split, useful: uR, labels: 1 - clamp(shrink * 2.5) });
      const skO = { x: lerp(SKX, SR.x, shrink), y: lerp(SKY, SR.y, shrink) }, skS = lerp(1, SS, shrink);
      tr(sk, skO.x, skO.y, skS);
      tr(inHead, SKX + SPL * grow - 1, SKY); op(inHead, clamp(grow * 6) * (1 - clamp(split * 10)));
      op(brG, Math.min(P(t, mid('sankey', 0.5), 0.3, linear), 1 - P(t, at('branch') + 1.0, 0.5, linear)));
      br.set(P(t, mid('sankey', 0.5), 0.7));
      op(brT, P(t, mid('sankey', 0.6), 0.4, linear));
      // the two small Sankeys
      const lIn = P(t, at('fat') + 0.3, 0.4, linear);
      op(skL, lIn);
      skL.set({ grow: P(t, at('fat') + 0.3, 0.7, ease), split: P(t, at('fat') + 0.9, 1.2, ease) });
      op(labL, lIn);
      placeLabels(skL, SL, 1, lLight, lHeat);
      op(lLight, P(t, at('fat') + 1.8, 0.4, linear)); op(lHeat, P(t, at('fat') + 1.8, 0.4, linear));
      op(effL, P(t, mid('fat', 0.3), 0.4, linear));
      show(tagL, popIn(t, mid('fat', 0.36)), 300, 664);
      op(labR, P(t, at('fat') + 0.6, 0.4, linear));
      placeLabels(sk, skO, skS, rUse, rWas);
      op(titleR, P(t, mid('fat', 0.54), 0.4, linear));
      setText(effR.lastChild, Math.round(uR * 100) + '%');
      op(effR, P(t, at('fat') + 0.8, 0.4, linear));
      show(tagR, popIn(t, mid('fat', 0.8)), 880, 664);
    }
  };
});
