/* Intro: Switching magnetism on and off.
   Wire wraps an iron nail; a lead touches the cell and paperclips leap up into a chain at the
   nail's point (showpiece). The lead lifts, the clips clatter down and a "?" floats up. The nail
   steps aside under the title while "magnetism" and "electricity" cards are linked; then a
   five-stop roadmap lights up stop by stop. */
scene('intro', S => {
  const { at, end, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;
  const COPPER = '#D9893F', COPPER_DK = '#8A5426', CLIPC = '#C3CEDA';

  /* ---------- helpers ---------- */
  // a polyline [[x, y, visible], ...] that current dots ride, by arc length
  function track(pts) {
    const cum = [0];
    for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    return { pts, cum, L: cum[cum.length - 1] };
  }
  const TQ = [0, 0, 0];                      // trackAt's result, reused (read it straight away)
  function trackAt(tk, s) {
    s = ((s % tk.L) + tk.L) % tk.L;
    let lo = 0, hi = tk.cum.length - 1;
    while (hi - lo > 1) { const m = (lo + hi) >> 1; if (tk.cum[m] <= s) lo = m; else hi = m; }
    const a = tk.pts[lo], b = tk.pts[hi], f = (s - tk.cum[lo]) / ((tk.cum[hi] - tk.cum[lo]) || 1);
    TQ[0] = a[0] + (b[0] - a[0]) * f; TQ[1] = a[1] + (b[1] - a[1]) * f; TQ[2] = Math.min(a[2], b[2]);
    return TQ;
  }
  const bez = (p0, p1, p2, p3, u) => { const v = 1 - u; return [v * v * v * p0[0] + 3 * v * v * u * p1[0] + 3 * v * u * u * p2[0] + u * u * u * p3[0], v * v * v * p0[1] + 3 * v * v * u * p1[1] + 3 * v * u * u * p2[1] + u * u * u * p3[1]]; };
  const bezD = (p0, p1, p2, p3) => `M${p0[0].toFixed(1)},${p0[1].toFixed(1)} C${p1[0].toFixed(1)},${p1[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)} ${p3[0].toFixed(1)},${p3[1].toFixed(1)}`;
  const bezPts = (p0, p1, p2, p3, n) => { const out = []; for (let i = 0; i <= n; i++) { const q = bez(p0, p1, p2, p3, i / n); out.push([q[0], q[1], 1]); } return out; };

  // steel paperclip, standing upright: top hook at about (3,-34), bottom hook at (0,37)
  const CLIP_D = 'M5,-18 L5,22 A5,5 0 0 1 -5,22 L-5,-26 A8,8 0 0 1 11,-26 L11,26 A11,11 0 0 1 -11,26 L-11,-10';
  function clip(parent) { const g = G(parent); E('path', { d: CLIP_D, fill: 'none', stroke: CLIPC, 'stroke-width': 3.6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g); return g; }

  /* the nail electromagnet: an iron nail (point on the right) centred on (0,0), 420 x 26, wrapped
     in n turns of copper wire between x = c0 and c1 (back halves dimmer, behind the nail). Current
     entering at the left end runs down the front of each turn, so the point is a north pole.
     g.coil(thMax) redraws the turns up to angle thMax (to wrap them on); g.samples() for dots. */
  function nailRig(parent, o) {
    o = o || {};
    const n = o.turns || 10, c0 = o.c0 !== undefined ? o.c0 : -120, c1 = o.c1 !== undefined ? o.c1 : 110;
    const R = o.R || 21, yaw = o.yaw !== undefined ? o.yaw : 0.32, ww = o.wire || 5.5;
    const g = G(parent);
    const back = E('path', { fill: 'none', stroke: o.dark || COPPER_DK, 'stroke-width': ww, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    const nail = G(g);
    const steel = linGrad('#DCE4EA', '#66737F', true);
    E('path', { d: 'M-200,-13 L168,-13 L212,0 L168,13 L-200,13 Z', fill: steel, stroke: '#EEF3F6', 'stroke-width': 2, 'stroke-linejoin': 'round' }, nail);
    E('rect', { x: -214, y: -27, width: 16, height: 54, rx: 5, fill: steel, stroke: '#EEF3F6', 'stroke-width': 2 }, nail);
    E('path', { d: 'M-194,-6 L160,-6', stroke: '#FFFFFF', 'stroke-width': 3, opacity: 0.4, 'stroke-linecap': 'round' }, nail);
    const front = E('path', { fill: 'none', stroke: o.color || COPPER, 'stroke-width': ww, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    const th0 = Math.PI, th1 = Math.PI + TAU * n;
    const X = th => c0 + (c1 - c0) * (th - th0) / (th1 - th0) + R * yaw * Math.sin(th), Y = th => -R * Math.cos(th);
    let last = -1;
    g.coil = thMax => {
      if (thMax === last) return;
      last = thMax;
      let db = '', df = '';
      for (let k = 0; k < 2 * n; k++) {
        const a = th0 + k * Math.PI, b = Math.min(a + Math.PI, thMax);
        if (b <= a + 1e-6) break;
        let d = '';
        for (let i = 0; i <= 8; i++) { const th = a + (b - a) * i / 8; d += (i ? 'L' : 'M') + X(th).toFixed(1) + ',' + Y(th).toFixed(1); }
        if (k % 2) df += d; else db += d;
      }
      back.setAttribute('d', db); front.setAttribute('d', df);
    };
    g.coil(th1);
    g.th0 = th0; g.th1 = th1;
    g.start = [X(th0), Y(th0)]; g.end = [X(th1), Y(th1)];
    g.samples = () => { const out = []; for (let th = th0; th <= th1 + 1e-6; th += Math.PI / 12) out.push([X(th), Y(th), Math.sin(th) > 0.08 ? 1 : 0]); return out; };
    return g;
  }
  // AA cell lying on its side, about 150 x 52: copper-coloured + end (with the nub) on the left
  function aaCell(parent) {
    const g = G(parent), w = 150, h = 52, x0 = -w / 2, y0 = -h / 2;
    E('rect', { x: x0, y: y0, width: w, height: h, rx: 9, fill: linGrad('#3E4D59', '#1A232B', true), stroke: '#7D8C99', 'stroke-width': 2 }, g);
    E('path', { d: `M${x0 + 9},${y0} L${x0 + 54},${y0} L${x0 + 54},${y0 + h} L${x0 + 9},${y0 + h} Q${x0},${y0 + h} ${x0},${y0 + h - 9} L${x0},${y0 + 9} Q${x0},${y0} ${x0 + 9},${y0} Z`, fill: linGrad('#F0B06A', '#9A5A22', true) }, g);
    E('rect', { x: x0 - 9, y: -10, width: 11, height: 20, rx: 3, fill: '#C9D3DC', stroke: '#EEF3F6', 'stroke-width': 1.5 }, g);
    E('rect', { x: x0 + 8, y: y0 + 6, width: w - 16, height: 6, rx: 3, fill: '#FFFFFF', opacity: 0.18 }, g);
    T(g, x0 + 27, 11, '+', { size: 32, weight: 700, anchor: 'middle', fill: '#3A2000' });
    T(g, x0 + w - 24, 10, '−', { size: 30, weight: 700, anchor: 'middle', fill: C.ink });
    return g;
  }

  /* ---------- the nail world: nail, cell, leads, dots, paperclips ---------- */
  const world = G(root);
  const NX = 600, NY = 280, CXc = 600, CYc = 486;
  const leadL = E('path', { fill: 'none', stroke: COPPER, 'stroke-width': 5.5, 'stroke-linecap': 'round' }, world);
  const leadR = E('path', { fill: 'none', stroke: COPPER, 'stroke-width': 5.5, 'stroke-linecap': 'round' }, world);
  const tipR = E('circle', { r: 4.5, fill: '#F6C79A' }, world);          // bare end of the moving lead
  const rig = nailRig(world); tr(rig, NX, NY);
  const cell = aaCell(world); tr(cell, CXc, CYc);
  const tipGlow = E('ellipse', { cx: NX + 212, cy: NY, rx: 70, ry: 54, fill: glow(C.energy) }, world);
  // leads: + nub -> coil start, and coil end -> − end (the right lead lifts on and off)
  const cs = [NX + rig.start[0], NY + rig.start[1]], ce = [NX + rig.end[0], NY + rig.end[1]];
  const plus = [CXc - 84, CYc], minus = [CXc + 77, CYc];
  const LA = [plus, [plus[0] - 66, plus[1] + 2], [cs[0] - 4, cs[1] + 96], cs];
  leadL.setAttribute('d', bezD(...LA));
  const rOn = [ce, [ce[0] + 2, ce[1] + 96], [minus[0] + 70, minus[1] + 2], minus];
  const rOff = [ce, [ce[0] + 6, ce[1] + 90], [minus[0] + 86, minus[1] - 34], [minus[0] + 34, minus[1] - 40]];
  const coilPts = rig.samples().map(p => [p[0] + NX, p[1] + NY, p[2]]);
  const circuit = track([...bezPts(...LA, 18), ...coilPts, ...bezPts(...rOn, 18)]);
  const dotsG = G(world), DOTS = [];
  const nDots = Math.round(circuit.L / 30);
  for (let k = 0; k < nDots; k++) DOTS.push(E('circle', { r: 5.5, fill: C.energy }, dotsG));

  // paperclips: a heap under the point; four leap up into a chain hanging from the point
  const clipsG = G(world), cr = rng(14), CLIPS = [];
  const HEAP = [845, 652];
  for (let i = 0; i < 9; i++) {
    const g = clip(clipsG);
    CLIPS.push({ g, hx: HEAP[0] + (cr() - 0.5) * 150, hy: HEAP[1] + (cr() - 0.5) * 22, hr: 90 + (cr() - 0.5) * 70 + (i % 2 ? 180 : 0), ph: cr() * TAU });
  }
  CLIPS.sort((a, b) => a.hy - b.hy);
  CLIPS.forEach(c => clipsG.appendChild(c.g));
  const CHAIN = [CLIPS[7], CLIPS[3], CLIPS[5], CLIPS[1]];          // the four that jump
  const TIP = [NX + 212, NY + 2], LINK = 62;

  /* ---------- "?" ---------- */
  const qMark = T(root, 600, 150, '?', { size: 124, weight: 700, anchor: 'middle', fill: C.energy });

  /* ---------- title and the two linked cards ---------- */
  const title = G(root);
  const TTXT = 'Magnetism & Electricity';
  const tSize = Math.min(78, 78 * 1000 / textWidth(TTXT, 78, FD, 700));
  T(title, 0, 0, TTXT, { size: tSize, weight: 700, anchor: 'middle' });
  const pair = G(root);
  function bigCard(x, name, note, color) {
    const g = G(pair); tr(g, x, 470);
    card(g, -130, -150, 260, 300, { fill: C.card, stroke: C.line });
    const art = G(g);
    T(g, 0, 98, name, { size: 36, weight: 700, anchor: 'middle', fill: color });
    const nt = T(g, 0, 134, note, { size: 25, weight: 600, anchor: 'middle', fill: C.muted, font: FB });
    return { g, art, nt };
  }
  const cMag = bigCard(650, 'magnetism', 'push and pull', '#FF8A94');
  const cEl = bigCard(990, 'electricity', 'flow of charge', C.energy);
  // magnetism card: a small magnet with two field arcs (N on the left, so the arcs run left to right)
  const mg = magnet(cMag.art, 150, 44); tr(mg, 0, -20);
  const arcs = G(cMag.art);
  [['M-75,-34 C-120,-122 120,-122 75,-34', -98], ['M-75,-6 C-120,82 120,82 75,-6', 58]].forEach(([d, y]) => {
    E('path', { d, fill: 'none', stroke: '#C4B5FD', 'stroke-width': 3.5 }, arcs);
    E('path', { d: `M8,${y} L-6,${y - 8} L-6,${y + 8} Z`, fill: '#C4B5FD' }, arcs);
  });
  const pullClip = clip(cMag.art);
  // electricity card: a tiny loop, cell at the bottom (+ on the left), bulb at the top
  const loopG = G(cEl.art); tr(loopG, 0, -28);
  const lw1 = wire(loopG, [[-29.5, 44], [-78, 44], [-78, -44], [-25, -44]], { spacing: 26, dot: 4.5 });
  const lw2 = wire(loopG, [[25, -44], [78, -44], [78, 44], [29.5, 44]], { spacing: 26, dot: 4.5 });
  const lBulb = bulbSym(loopG); tr(lBulb, 0, -44, 0.55);
  const lCell = cellSym(loopG, { cells: 2, signs: false }); tr(lCell, 0, 44, 0.5);   // the 3 V battery used in every circuit
  // the link between the cards
  const link = G(pair); tr(link, 820, 470);
  const linkLine = E('path', { d: 'M-40,0 L40,0', stroke: C.energy, 'stroke-width': 5, 'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': '1 1' }, link);
  const linkIcon = G(link);
  E('rect', { x: -26, y: -12, width: 30, height: 24, rx: 12, fill: C.bg1, stroke: C.energy, 'stroke-width': 5 }, linkIcon);
  E('rect', { x: -4, y: -12, width: 30, height: 24, rx: 12, fill: 'none', stroke: C.energy, 'stroke-width': 5 }, linkIcon);

  /* ---------- roadmap: five stops ---------- */
  const road = G(root);
  const RX = [148, 374, 600, 826, 1052], RY = 452;
  const icons = [
    g => { const m = magnet(g, 128, 38); tr(m, 0, 0); E('path', { d: 'M-64,-10 C-96,-74 96,-74 64,-10', fill: 'none', stroke: '#C4B5FD', 'stroke-width': 3 }, g); E('path', { d: 'M-64,10 C-96,74 96,74 64,10', fill: 'none', stroke: '#C4B5FD', 'stroke-width': 3 }, g); E('path', { d: 'M8,-58 L-5,-65 L-5,-51 Z M8,58 L-5,51 L-5,65 Z', fill: '#C4B5FD' }, g); return null; },
    g => { const n = nailRig(g, { turns: 8, wire: 6.5 }); tr(n, -10, -20, 0.44); [0, 1].forEach(i => { const c = clip(g); tr(c, 82, -5 + i * 29.5, 0.44); }); return null; },
    g => { const a = wire(g, [[-22.4, 38], [-62, 38], [-62, -38], [-20, -38]], { spacing: 24, dot: 4 }); const b = wire(g, [[20, -38], [62, -38], [62, 38], [22.4, 38]], { spacing: 24, dot: 4 }); const bl = bulbSym(g); tr(bl, 0, -38, 0.44); const c = cellSym(g, { cells: 2, signs: false }); tr(c, 0, 38, 0.38); return { upd: (t, on) => { a.upd(t, 60); b.upd(t, 60); a.set(on); b.set(on); bl.set(on); } }; },
    g => { const m = meterSym(g, 'A'); tr(m, 0, 4, 1.35); return { upd: (t, on) => m.set(on > 0.5 ? '0.4 A' : '') }; },
    g => { E('path', { d: 'M-8,54 Q-18,66 -6,76 Q4,86 -4,96', fill: 'none', stroke: '#C9D6DE', 'stroke-width': 2.5 }, g); E('ellipse', { cx: -10, cy: -6, rx: 44, ry: 54, fill: ball('#FF6B7D', '#B7283C') }, g); E('path', { d: 'M-16,46 L-2,46 L-9,56 Z', fill: '#B7283C' }, g); [[-26, -24], [4, -32], [-14, 10], [12, 0]].forEach(([x, y]) => T(g, x, y + 8, '−', { size: 26, weight: 700, anchor: 'middle', fill: '#FFFFFF' })); const sp = spark(g, 18, { seed: 3 }); tr(sp, 50, -40); return { upd: t => sp.upd(t) }; },
  ];
  const LBL = ['magnets\n& fields', 'electromagnets', 'circuits', 'measuring', 'static'];
  const stops = RX.map((x, i) => {
    const g = G(road); tr(g, x, RY);
    const box = card(g, -103, -125, 206, 250, { fill: C.card, stroke: C.line });
    const art = G(g); tr(art, 0, -30);
    const anim = icons[i](art);
    const lines = LBL[i].split('\n');
    const widest = Math.max(...lines.map(l => textWidth(l, 28, FD, 700)));
    const lab = T(g, 0, lines.length > 1 ? 70 : 88, LBL[i], { size: widest > 188 ? Math.max(26, Math.floor(28 * 188 / widest)) : 28, weight: 700, anchor: 'middle', lh: 32 });
    return { g, box, art, anim, lab };
  });

  return t => {
    /* --- the nail world --- */
    const tIn = at('hook');
    const tWrap0 = mid('hook', 0.05), tWrap1 = mid('hook', 0.3);
    const tC = mid('hook', 0.38);                     // the lead touches the cell
    const tLift = mid('drop', 0.03);                  // the lead lifts off
    const tFall = tLift + 0.12;
    const dp = P(t, at('def') - 0.15, 1.0);           // shrink to the left
    const s = lerp(1.12, 0.56, dp), wx = lerp(600, 238, dp), wy = lerp(425, 478, dp);
    world.setAttribute('transform', `translate(${wx.toFixed(1)} ${wy.toFixed(1)}) scale(${s.toFixed(4)}) translate(-670 -466)`);
    op(world, P(t, tIn - 0.1, 0.5, linear) * (1 - P(t, at('plan') - 0.3, 0.4, linear)));

    // wrap the coil on, then the leads
    const wp = P(t, tWrap0, tWrap1 - tWrap0, linear);
    rig.coil(wp >= 1 ? rig.th1 : lerp(rig.th0, rig.th1, wp));
    const leadOp = P(t, tWrap1 - 0.1, 0.4, linear);
    op(leadL, leadOp); op(leadR, leadOp);
    // right lead: hovering -> touches -> lifts away
    const down = P(t, tC - 0.45, 0.45, easeIn), up = P(t, tLift, 0.7, easeOut);
    const k = clamp(down - up);
    if (k !== leadR._k) {
      leadR._k = k;
      const RL = rOff.map((p, i) => [lerp(p[0], rOn[i][0], k), lerp(p[1], rOn[i][1], k)]);
      leadR.setAttribute('d', bezD(...RL));
      attr(tipR, 'cx', RL[3][0]); attr(tipR, 'cy', RL[3][1]);
    }
    op(tipR, leadOp);

    // current dots: start together at contact, freeze together when the lead lifts
    const flow = clamp(t, tC, tLift) - tC;
    const dOn = P(t, tC, 0.12, linear) * (1 - P(t, tLift, 0.35, linear));
    op(dotsG, dOn);
    if (dOn > 0) DOTS.forEach((d, i) => { const q = trackAt(circuit, i * circuit.L / nDots + flow * 60); attr(d, 'cx', q[0]); attr(d, 'cy', q[1]); op(d, q[2]); });
    const mag = P(t, tC, 0.3, linear) * (1 - P(t, tLift, 0.2, linear));
    op(tipGlow, mag * 0.5 * (0.85 + 0.15 * wave(t, 1.2)));

    // paperclips: leap up one by one into a chain, sway, then clatter back to the heap
    const sway = calm * 3.2 * Math.sin(t * 2.3) * P(t, tC + 1.0, 1.0, linear);
    // each clip's top hook (3,-32) sits on the hook above it; its own bottom hook is (0,35)
    let px = TIP[0], py = TIP[1];
    const chainPose = CHAIN.map((c, i) => {
      const r = -(sway * (1 + 0.35 * i)), rad = r * Math.PI / 180, co = Math.cos(rad), si = Math.sin(rad);
      const cx = px - (3 * co + 32 * si), cy = py - (3 * si - 32 * co);
      px = cx - 35 * si; py = cy + 35 * co;
      return [cx, cy, r];
    });
    CLIPS.forEach(c => {
      const ci = CHAIN.indexOf(c);
      let x = c.hx, y = c.hy, r = c.hr;
      if (ci >= 0) {
        const tj = mid('hook', 0.56) + ci * 0.3, u = P(t, tj, 0.42, linear);
        const [cx, cy, cr2] = chainPose[ci];
        if (u > 0) {
          const e = ease(u), qx = (c.hx + cx) / 2 - 30, qy = Math.min(c.hy, cy) - 70;
          x = (1 - e) * (1 - e) * c.hx + 2 * (1 - e) * e * qx + e * e * cx;
          y = (1 - e) * (1 - e) * c.hy + 2 * (1 - e) * e * qy + e * e * cy;
          r = lerp(c.hr, cr2 + (c.hr > 180 ? 360 : 0), e);
        }
        const f = (t - tFall - (3 - ci) * 0.03) / 0.62;
        if (f > 0 && u >= 1) {
          const ff = clamp(f);
          // fall with one bounce
          const yb = ff < 0.72 ? Math.pow(ff / 0.72, 2) : 1 - 0.16 * Math.sin(Math.PI * (ff - 0.72) / 0.28);
          x = lerp(cx, c.hx, ease(ff)); y = lerp(cy, c.hy, yb); r = lerp(cr2 + (c.hr > 180 ? 360 : 0), c.hr, ease(ff));
        }
      }
      tr(c.g, x, y, 1, r);
    });

    /* --- "?" --- */
    const qa = win(t, mid('drop', 0.46), at('def') - 0.05, 0.45);
    op(qMark, qa);
    if (qa > 0) { const qp = P(t, mid('drop', 0.46), 0.6, pop); qMark.setAttribute('transform', `translate(600 ${(150 + (1 - qp) * 30 + calm * 6 * Math.sin(t * 2)).toFixed(1)}) scale(${Math.max(0.01, 0.7 + 0.3 * qp).toFixed(3)}) translate(-600 -150)`); }

    /* --- title --- */
    const tp = P(t, at('def') + 0.05, 0.9, easeOut), tq = P(t, at('plan') - 0.05, 0.9);
    op(title, tp);
    tr(title, 600, lerp(lerp(178, 152, tp), 140, tq), lerp(1, 0.8, tq));

    /* --- magnetism + electricity, linked --- */
    const pa = win(t, at('def') - 0.1, at('plan') + 0.1, 0.4);
    op(pair, pa);
    if (pa > 0) {
      [cMag, cEl].forEach((c, i) => {
        const p = P(t, mid('def', 0.06 + i * 0.07), 0.6, pop);
        op(c.g, clamp(p * 2)); tr(c.g, i ? 990 : 650, 470 + (1 - clamp(p)) * 26, Math.max(0.01, 0.9 + 0.1 * p));
      });
      const lp = P(t, mid('def', 0.17), 0.5);
      linkLine.setAttribute('stroke-dashoffset', (1 - lp).toFixed(3));
      op(linkIcon, P(t, mid('def', 0.2), 0.3, linear)); tr(linkIcon, 0, 0, Math.max(0.01, P(t, mid('def', 0.2), 0.5, pop)));
      // "the invisible push and pull": the arcs glow and a paperclip is pulled onto the magnet
      const hm = P(t, mid('def', 0.24), 0.5, linear);
      op(arcs, 0.45 + 0.55 * hm * (0.75 + 0.25 * wave(t, 1.4)));
      op(cMag.nt, P(t, mid('def', 0.28), 0.5, linear));
      const pc = P(t, mid('def', 0.3), 0.7, easeIn);
      tr(pullClip, lerp(112, 90, pc), -20, 0.42, 90);
      op(pullClip, P(t, mid('def', 0.22), 0.3, linear));
      // "the flow of charge around a circuit": the dots run and the bulb lights
      const eOn = P(t, mid('def', 0.55), 0.3, linear);
      const ef = Math.max(0, t - mid('def', 0.55));
      lw1.upd(ef, 60); lw2.upd(ef, 60); lw1.set(eOn); lw2.set(eOn); lBulb.set(eOn);
      op(cEl.nt, P(t, mid('def', 0.62), 0.5, linear));
    }

    /* --- roadmap --- */
    op(road, P(t, at('plan') + 0.1, 0.3, linear));
    if (t > at('plan')) {
      const lightAt = [0.08, 0.3, 0.5, 0.62, 0.84];
      stops.forEach((st, i) => {
        const p = P(t, at('plan') + 0.15 + i * 0.08, 0.5, pop);
        op(st.g, clamp(p * 2)); tr(st.g, RX[i], RY + (1 - clamp(p)) * 24, Math.max(0.01, 0.92 + 0.08 * p));
        const L = P(t, mid('plan', lightAt[i]), 0.45, linear);
        st.box.setAttribute('stroke', L > 0.5 ? C.energy : C.line);
        st.box.setAttribute('stroke-width', (2 + 2 * L).toFixed(2));
        op(st.art, 0.32 + 0.68 * L);
        st.lab.setAttribute('fill', L > 0.5 ? C.ink : C.muted);
        const bump = Math.sin(Math.PI * P(t, mid('plan', lightAt[i]), 0.5, linear));
        tr(st.art, 0, -30, 1 + 0.08 * bump);
        if (st.anim) st.anim.upd(t, L);
      });
    }
  };
});
