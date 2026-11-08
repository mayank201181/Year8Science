/* Quick-fire quiz: five question cards, each with a little diagram. A countdown ring runs through the thinking time,
   then the answer appears with a tick, the diagram completes itself and a progress pip fills:
   1 a mirror, i = 40°, r = ? -> the cyan arc opens to 40°;  2 air into glass, towards or away? -> towards lights up;
   3 a blue book in a red spotlight -> it turns black;  4 ? + ? = yellow -> red and green overlap into yellow;
   5 the image on the retina, true or false? -> an upside-down tree, "false".
   Outro: a rainbow sweeps across, one colour at a time, over "Brilliant work!". */
scene('quiz', S => {
  const { at, end, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;
  const Y = C.energy, NG = LT.nGlass;
  const RED = '#FF4D4D', GREEN = '#4CD964', BLUE = '#3B82F6', YEL = '#FFF04D';

  function rich(parent, x, y, segs, o) {
    o = o || {};
    const t = E('text', { x, y, 'font-size': o.size || 30, 'font-weight': o.weight || 600, 'font-family': o.font || FD, 'text-anchor': o.anchor || 'start', fill: o.fill || C.ink }, parent);
    segs.forEach(s => { if (typeof s === 'string') s = [s]; E('tspan', { fill: s[1], 'font-weight': s[2] }, t).textContent = s[0]; });
    return t;
  }
  let _qc = 0;
  const clipCircle = (cx, cy, r) => { const id = 'light-quiz-clip' + (++_qc); const cp = E('clipPath', { id }, defs()); E('circle', { cx, cy, r }, cp); return `url(#${id})`; };
  /* the eye chapter's tree: base at (0,0), top at (0,-195) */
  function treeArt(parent) {
    const g = G(parent);
    E('path', { d: 'M-12,2 L-9,-84 L9,-84 L12,2 Z', fill: ball('#A9713C', '#6B4423'), stroke: '#5A3A1C', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, g);
    const pts = [];
    for (let i = 0; i < 14; i++) { const a = i / 14 * TAU, k = 1 + 0.07 * Math.cos(a * 5 + 0.6); pts.push([Math.cos(a) * 74 * k, -118 + Math.sin(a) * 72 * k]); }
    E('path', { d: closedPath(pts), fill: ball(C.plant, C.plantDk), stroke: C.plantDk, 'stroke-width': 3 }, g);
    E('path', { d: 'M-38,-150 Q-20,-170 4,-168', fill: 'none', stroke: '#C9F2D3', 'stroke-width': 5, 'stroke-linecap': 'round', opacity: 0.55 }, g);
    return g;
  }
  /* the mixing chapter's stage spotlight, pointing down (+y) from its yoke; g.head turns */
  function stageLamp(parent, col) {
    const g = G(parent);
    E('path', { d: 'M-31,4 L-31,-18 L31,-18 L31,4', fill: 'none', stroke: '#8FA3B3', 'stroke-width': 5, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, g);
    E('line', { x1: 0, y1: -18, x2: 0, y2: -28, stroke: '#8FA3B3', 'stroke-width': 6, 'stroke-linecap': 'round' }, g);
    const head = G(g);
    E('rect', { x: -24, y: -14, width: 48, height: 66, rx: 11, fill: ball('#4A5866', '#232C35'), stroke: '#8FA3B3', 'stroke-width': 2.5 }, head);
    E('rect', { x: -29, y: 46, width: 58, height: 14, rx: 6, fill: '#2E3A45', stroke: '#8FA3B3', 'stroke-width': 2 }, head);
    E('circle', { cx: 0, cy: 4, r: 6, fill: '#8FA3B3' }, head);
    E('circle', { cx: 0, cy: 62, r: 50, fill: glow(col) }, head);
    E('ellipse', { cx: 0, cy: 61, rx: 23, ry: 7, fill: col }, head);
    g.head = head;
    return g;
  }
  // a ray drawn to p (0..1); hidden at 0, where its round end cap would still paint a dot
  const rset = (r, p) => { r.set(p); op(r, p > 0.002 ? 1 : 0); };
  const unit = v => { const L = Math.hypot(v[0], v[1]) || 1; return [v[0] / L, v[1] / L]; };

  /* ---------- progress pips (top right) ---------- */
  const dotsG = G(root);
  const dots = [0, 1, 2, 3, 4].map(k => {
    const g = G(dotsG); tr(g, 984 + k * 42, 58);
    const ring_ = E('circle', { r: 14, fill: 'rgba(10,27,39,0.6)', stroke: C.muted, 'stroke-width': 3 }, g);
    const fill = E('circle', { r: 14, fill: Y }, g);
    const tk = tick(g, 7, C.bg0);
    return { g, ring_, fill, tk };
  });

  /* ---------- intro ---------- */
  const intro = G(root);
  const bub = G(intro); tr(bub, 600, 190);
  E('path', { d: 'M-70,-52 H70 Q92,-52 92,-30 V22 Q92,44 70,44 H-6 L-34,72 L-30,44 H-70 Q-92,44 -92,22 V-30 Q-92,-52 -70,-52 Z', fill: Y, stroke: '#FFF3A6', 'stroke-width': 4, 'stroke-linejoin': 'round' }, bub);
  T(bub, 0, 22, '?', { size: 76, weight: 700, fill: C.bg0, anchor: 'middle' });
  T(intro, 600, 350, 'Quick-fire quiz!', { size: 76, weight: 700, anchor: 'middle' });
  rich(intro, 600, 414, ['Say each answer ', ['out loud', Y, 800], ' before it appears'], { size: 32, anchor: 'middle', fill: C.muted });

  /* ---------- the five diagrams: each returns (t, tA) => ..., tA = when its answer starts ---------- */
  function picMirror(g) {
    const O = [330, 644];
    const m = planeMirror(g, 380); tr(m, O[0], O[1]);
    normalLine(g, O[0], O[1], -90, 250, { back: 0, square: 16 });
    const inc = rayPath(g, [ltPt(O[0], O[1], -130, 250), O]);
    const refl = rayPath(g, [O, ltPt(O[0], O[1], -50, 250)]);
    const aI = arcFromNormal(g, O[0], O[1], -90, -40, 70, { color: LT.angI, text: 'i = {deg}°' });
    const aR = arcFromNormal(g, O[0], O[1], -90, 40, 70, { color: LT.angR, text: 'r = {deg}°' });
    const lab = aR.lastChild, qChip = chip(g, 'r = ?', { size: 28, fill: C.card2, stroke: LT.angR, color: LT.angR });
    tr(qChip, +lab.getAttribute('x'), +lab.getAttribute('y') - 10);
    const tk = tick(g, 15); tr(tk, 540, 470);
    return (t, tA) => {
      rset(inc, P(t, at('q1') + 0.1, 0.8, linear)); rset(refl, P(t, at('q1') + 0.8, 0.8, linear));
      aI.set(P(t, mid('q1', 0.55), 0.6));
      op(qChip, P(t, mid('q1', 0.68), 0.4, linear) * (1 - P(t, tA, 0.3, linear)));
      aR.set(P(t, tA + 0.1, 0.7));
      const p = P(t, tA + 0.6, 0.45, pop); op(tk, clamp(p * 2)); tr(tk, 540, 470, Math.max(0.01, p));
    };
  }
  function picGlass(g) {
    const O = [330, 498], rT = snellAngle(50, 1, NG);
    E('rect', { x: 80, y: O[1], width: 500, height: 210, rx: 10, fill: LT.glassFill }, g);
    E('line', { x1: 80, y1: O[1], x2: 580, y2: O[1], stroke: LT.glassStroke, 'stroke-width': 3 }, g);
    T(g, 102, O[1] - 20, 'air', { size: 26, weight: 600, fill: C.muted });
    T(g, 102, O[1] + 42, 'glass', { size: 26, weight: 600, fill: C.muted });
    normalLine(g, O[0], O[1], -90, 150, { back: 190 });
    const inc = rayPath(g, [ltPt(O[0], O[1], -140, 200), O]);
    const ghost = d => { const e = ltPt(O[0], O[1], d, 150); return E('line', { x1: O[0], y1: O[1], x2: e[0], y2: e[1], stroke: C.ink, 'stroke-width': 4, 'stroke-dasharray': '10 9', opacity: 0.55, 'stroke-linecap': 'round' }, g); };
    const gT = ghost(90 - rT), gA = ghost(20);
    const cT = chip(g, 'towards', { size: 26, fill: C.card2, stroke: C.line }); tr(cT, ...ltPt(O[0], O[1], 90 - rT, 196));
    const cA = chip(g, 'away', { size: 26, fill: C.card2, stroke: C.line }); tr(cA, ...ltPt(O[0], O[1], 20, 214));
    const good = rayPath(g, [O, ltPt(O[0], O[1], 90 - rT, 160)]);
    const tk = tick(g, 13); const tkAt = ltPt(O[0], O[1], 90 - rT, 196); tkAt[0] -= cT.w / 2 + 28;
    return (t, tA) => {
      rset(inc, P(t, at('q2') + 0.1, 0.8, linear));
      const gp = P(t, mid('q2', 0.5), 0.5, linear);
      op(gT, gp * (1 - P(t, tA, 0.3, linear))); op(gA, gp * (1 - 0.75 * P(t, tA, 0.4, linear)));
      op(cT, P(t, mid('q2', 0.55), 0.4, linear)); op(cA, P(t, mid('q2', 0.6), 0.4, linear) * (1 - 0.6 * P(t, tA, 0.4, linear)));
      cT.box.setAttribute('stroke', t >= tA ? C.good : C.line);
      rset(good, P(t, tA + 0.05, 0.7, linear));
      const p = P(t, tA + 0.5, 0.45, pop); op(tk, clamp(p * 2)); tr(tk, tkAt[0], tkAt[1], Math.max(0.01, p));
    };
  }
  function picBook(g) {
    const LP = [148, 392], BK = [380, 582], ang = Math.atan2(BK[1] - LP[1], BK[0] - LP[0]) * 180 / Math.PI;
    E('line', { x1: 100, y1: 662, x2: 560, y2: 662, stroke: C.muted, 'stroke-width': 4, 'stroke-linecap': 'round' }, g);   // table
    // the mixing chapter's stage spotlight, hung from a short truss and turned towards the book
    const truss = G(g);
    E('path', { d: `M${LP[0] - 60},${LP[1] - 40} L${LP[0] + 60},${LP[1] - 40} M${LP[0] - 60},${LP[1] - 26} L${LP[0] + 60},${LP[1] - 26}`, stroke: '#8FA3B3', 'stroke-width': 4, 'stroke-linecap': 'round' }, truss);
    let zz = `M${LP[0] - 60},${LP[1] - 40}`; for (let x = LP[0] - 60; x < LP[0] + 60; x += 20) zz += ` L${x + 10},${LP[1] - 26} L${x + 20},${LP[1] - 40}`;
    E('path', { d: zz, fill: 'none', stroke: '#62808F', 'stroke-width': 2.5 }, truss);
    const lens = ltPt(LP[0], LP[1], ang, 64), e0 = ltPt(lens[0], lens[1], ang - 15, 290), e1 = ltPt(lens[0], lens[1], ang + 15, 290);
    const f0 = ltPt(lens[0], lens[1], ang + 90, 20), f1 = ltPt(lens[0], lens[1], ang - 90, 20);
    const beam = E('path', { d: `M${f0[0].toFixed(1)},${f0[1].toFixed(1)} L${e1[0].toFixed(1)},${e1[1].toFixed(1)} L${e0[0].toFixed(1)},${e0[1].toFixed(1)} L${f1[0].toFixed(1)},${f1[1].toFixed(1)} Z`, fill: RED, opacity: 0.18 }, g);
    const rays = [-7, 0, 7].map(d => rayPath(g, [lens, ltPt(lens[0], lens[1], ang + d, 200 - Math.abs(d) * 3)], { color: RED, width: 4, head: 13 }));
    const lamp = stageLamp(g, RED); tr(lamp, LP[0], LP[1]); tr(lamp.head, 0, 0, 1, ang - 90);
    // the colour chapter's book: in pure red light its blue cover reflects nothing, so it is black, and its white
    // pages reflect the red
    const book = G(g); tr(book, BK[0], BK[1]);
    const bkA = G(book); tr(bkA, 0, 0, 0.78);
    E('rect', { x: -70, y: -100, width: 150, height: 200, rx: 8, fill: '#9E3036', stroke: '#C24C52', 'stroke-width': 2.6 }, bkA);   // pages, lit red
    E('rect', { x: -80, y: -104, width: 150, height: 208, rx: 8, fill: '#101418', stroke: '#3A4652', 'stroke-width': 3.8 }, bkA);   // the blue cover: black
    E('rect', { x: -80, y: -104, width: 22, height: 208, rx: 6, fill: '#05070A', opacity: 0.75 }, bkA);   // spine
    const qCard = G(book);
    E('rect', { x: -63, y: -82, width: 118, height: 164, rx: 7, fill: C.card2, stroke: C.muted, 'stroke-width': 3 }, qCard);
    T(qCard, -4, 22, '?', { size: 72, weight: 700, anchor: 'middle', fill: C.muted });
    const black = T(g, BK[0] - 4, BK[1] + 8, 'black', { size: 28, weight: 700, anchor: 'middle', fill: C.muted });
    rich(g, BK[0] + 4, 700, [['blue', BLUE, 800], ' book'], { size: 26, anchor: 'middle' });
    const tk = tick(g, 15); tr(tk, 500, 470);
    return (t, tA) => {
      const on = P(t, at('q3') + 0.1, 0.5, linear);
      op(beam, on); rays.forEach((r, k) => rset(r, P(t, at('q3') + 0.3 + k * 0.12, 0.8, linear)));
      const rv = P(t, tA, 0.6, ease);
      op(qCard, 1 - rv); tr(qCard, 0, -rv * 30);
      op(black, P(t, tA + 0.4, 0.4, linear));
      const p = P(t, tA + 0.6, 0.45, pop); op(tk, clamp(p * 2)); tr(tk, 500, 470, Math.max(0.01, p));
    };
  }
  function picMix(g) {
    const A = [272, 566], B = [388, 566], R = 92;
    E('rect', { x: 90, y: 444, width: 480, height: 248, rx: 18, fill: '#071219', stroke: C.line, 'stroke-width': 2 }, g);   // dark screen
    const lit = G(g);
    const hA = E('circle', { cx: A[0], cy: A[1], r: R * 1.35, fill: glow(RED) }, lit), hB = E('circle', { cx: B[0], cy: B[1], r: R * 1.35, fill: glow(GREEN) }, lit);
    const fA = E('circle', { cx: A[0], cy: A[1], r: R, fill: RED, opacity: 0.92 }, lit);
    const fB = E('circle', { cx: B[0], cy: B[1], r: R, fill: GREEN, opacity: 0.92 }, lit);
    const lens = E('circle', { cx: B[0], cy: B[1], r: R, fill: YEL, 'clip-path': clipCircle(A[0], A[1], R) }, lit);
    const outl = [A, B].map(c => E('circle', { cx: c[0], cy: c[1], r: R, fill: 'none', stroke: C.muted, 'stroke-width': 3, 'stroke-dasharray': '10 8' }, g));
    const qs = [[A[0] - 34, A[1]], [B[0] + 34, B[1]]].map(([x, y]) => T(g, x, y + 22, '?', { size: 60, weight: 700, anchor: 'middle', fill: C.muted }));
    const eqQ = rich(g, 330, 404, [['?', C.muted, 800], ' + ', ['?', C.muted, 800], ' = ', ['yellow', YEL, 800]], { size: 40, weight: 700, anchor: 'middle' });
    const eqA = rich(g, 330, 404, [['red', RED, 800], ' + ', ['green', GREEN, 800], ' = ', ['yellow', YEL, 800]], { size: 40, weight: 700, anchor: 'middle' });
    const tk = tick(g, 15); tr(tk, 530, 470);
    return (t, tA) => {
      const pa = P(t, tA - 0.05, 0.35, linear), pb = P(t, tA + 0.12, 0.35, linear), pl = P(t, tA + 0.32, 0.3, linear);
      op(fA, 0.92 * pa); op(hA, 0.55 * pa); op(fB, 0.92 * pb); op(hB, 0.55 * pb); op(lens, pl);
      outl.forEach(o => op(o, 1 - pb)); qs.forEach((q, k) => op(q, 1 - (k ? pb : pa)));
      op(eqQ, P(t, at('q4') + 0.1, 0.4, linear) * (1 - P(t, tA, 0.3, linear))); op(eqA, P(t, tA + 0.15, 0.4, linear));
      const p = P(t, tA + 0.5, 0.4, pop); op(tk, clamp(p * 2)); tr(tk, 530, 470, Math.max(0.01, p));
    };
  }
  function picEye(g) {
    const EC = [380, 512], ER = 118;                                                // the eye chapter's eye, smaller
    const eyeG = G(g); tr(eyeG, EC[0], EC[1]);
    const eye = eyeSection(eyeG, ER); eye.pupil(0.6);
    const geo = eye.geo, lensX = geo.lensX, irisX = geo.irisX, Rr = geo.retinaR, [cx0, cy0, cCtl] = geo.cornea;
    // the tree as in the eye chapter (in the eye's coordinates): its top level with the axis, its base below
    const TX = -296, TH = 105, top = [TX, -3], base = [TX, TH - 3];
    const tr0 = G(eyeG); treeArt(tr0); tr(tr0, base[0], base[1], TH / 195);
    E('line', { x1: TX - 58, y1: base[1] + 3, x2: TX + 58, y2: base[1] + 3, stroke: C.faint, 'stroke-width': 3, 'stroke-linecap': 'round' }, eyeG);
    // rays as in the eye chapter: chosen by where they cross the pupil, so none passes through the iris; after the
    // cornea each heads for where the cornea alone would focus, and the lens bends it on to the image on the retina
    const corneaX = y => { const u = (y / cy0 + 1) / 2; return cx0 + 2 * u * (1 - u) * (cCtl - cx0); };
    const retinaHit = (p, d) => { d = unit(d); const b = p[0] * d[0] + p[1] * d[1], c = p[0] * p[0] + p[1] * p[1] - Rr * Rr, k = -b + Math.sqrt(Math.max(0, b * b - c)); return [p[0] + d[0] * k, p[1] + d[1] * k]; };
    const eyeRays = (sx, sy, n) => {
      const I = eye.image(sx, sy), ax = unit([I[0] - lensX, I[1]]), Q = [I[0] + ax[0] * 2.4 * ER, I[1] + ax[1] * 2.4 * ER];
      const half = eye.pupilHalf() * 0.78, pts = [];
      for (let k = 0; k < n; k++) {
        const Pp = [irisX, lerp(-half, half, k / (n - 1))], d = unit([Pp[0] - Q[0], Pp[1] - Q[1]]);
        let lo = 0, hi = 140;
        for (let it = 0; it < 24; it++) { const m = (lo + hi) / 2; if (Pp[0] + d[0] * m > corneaX(Pp[1] + d[1] * m)) lo = m; else hi = m; }
        const Cp = [Pp[0] + d[0] * hi, Pp[1] + d[1] * hi], u = (lensX - Pp[0]) / (Q[0] - Pp[0]), Lp = [lensX, lerp(Pp[1], Q[1], u)];
        pts.push([[sx, sy], Cp, Lp, retinaHit(Lp, [I[0] - Lp[0], I[1] - Lp[1]])]);
      }
      return { pts, I };
    };
    // light from the top (yellow) and the base (paler yellow, as in the eye chapter)
    const RT = eyeRays(top[0], top[1], 3), RB = eyeRays(base[0], base[1], 3);
    const rp = [...RT.pts.map(p => rayPath(eyeG, p, { width: 3.5, head: 12, heads: [0, 2] })), ...RB.pts.map(p => rayPath(eyeG, p, { color: '#FFF0A0', width: 3.5, head: 12, heads: [0, 2] }))];
    // the image: a slim, upside-down tree on the retina, from the base's image (high) to the top's (low)
    const I0 = RT.I, IB = RB.I, img = G(eyeG); treeArt(img);
    { const v = [I0[0] - IB[0], I0[1] - IB[1]], L = Math.hypot(v[0], v[1]), rot = Math.atan2(v[1], v[0]) * 180 / Math.PI + 90, s = L / 195;
      const n = unit([-v[1], v[0]]), side = n[0] * (IB[0] + I0[0]) + n[1] * (IB[1] + I0[1]) > 0 ? -4 : 4;
      tr(img, IB[0] + n[0] * side, IB[1] + n[1] * side, `${(s * 0.34).toFixed(4)} ${s.toFixed(4)}`, rot); }
    const bx0 = Math.min(I0[0], IB[0]) - 34, bx1 = Math.max(I0[0], IB[0]) + 8, by0 = Math.min(I0[1], IB[1]) - 16, by1 = Math.max(I0[1], IB[1]) + 16;
    const cover = G(eyeG);
    E('rect', { x: bx0, y: by0, width: bx1 - bx0, height: by1 - by0, rx: 12, fill: C.card2, stroke: C.muted, 'stroke-width': 3 }, cover);
    T(cover, (bx0 + bx1) / 2, (by0 + by1) / 2 + 15, '?', { size: 44, weight: 700, anchor: 'middle', fill: C.muted });
    const cTrue = chip(g, 'true', { size: 28, fill: C.card2, stroke: C.line }), cFalse = chip(g, 'false', { size: 28, fill: C.card2, stroke: C.line });
    tr(cTrue, 290, 690); tr(cFalse, 430, 690);
    const xTrue = cross(g, 10); tr(xTrue, 290 + cTrue.w / 2 + 22, 690);
    return (t, tA) => {
      op(cTrue, P(t, at('q5') + 0.2, 0.4, linear) * (1 - 0.55 * P(t, tA + 0.6, 0.4, linear))); op(cFalse, P(t, at('q5') + 0.35, 0.4, linear));
      rp.forEach((r, k) => rset(r, P(t, tA + 0.05 + (k >= 3 ? 0.35 : 0), 0.8, linear)));
      const rv = P(t, tA + 0.8, 0.5, ease);                                         // the image shows as the light lands
      op(cover, 1 - rv); op(img, rv);
      const f = P(t, tA + 0.8, 0.4, pop);
      cFalse.box.setAttribute('fill', f > 0.05 ? C.good : C.card2); cFalse.label.setAttribute('fill', f > 0.05 ? C.bg0 : C.ink);
      tr(cFalse, 430, 690, 1 + 0.12 * Math.sin(Math.PI * clamp(f)));
      op(xTrue, P(t, tA + 0.9, 0.3, linear));
    };
  }

  /* ---------- the five questions ---------- */
  const QS = [
    { q: 'A light ray hits a mirror with an angle of\nincidence of 40°. What is the angle of reflection?', a: [[['40°', LT.angR, 800]], [['angle of incidence', C.ink]], [['= angle of reflection', C.ink]]], big: true, pic: picMirror },
    { q: 'Light passes from air into glass at an angle.\nWhich way does it bend?', a: [[['Towards', Y, 800], [' the normal,', C.ink]], [['because it slows down.', C.ink]]], pic: picGlass },
    { q: 'What colour does a blue book look\nin pure red light?', a: [[['Black.', C.ink, 800]], [['No blue light to reflect,', C.ink]], [['and it absorbs the red.', C.ink]]], big: true, pic: picBook },
    { q: 'Which two colours of light add\ntogether to make yellow?', a: [[['Red', RED, 800], [' and ', C.ink], ['green', GREEN, 800], ['.', C.ink]]], big: true, pic: picMix },
    { q: 'True or false: the image on your\nretina is the right way up.', a: [[['False.', C.bad, 800]], [['It is real and ', C.ink], ['inverted', Y, 800], [',', C.ink]], [['and your brain sees it', C.ink]], [['the right way up.', C.ink]]], big: true, pic: picEye },
  ].map((d, i) => {
    const g = G(root);
    const qc = G(g);
    card(qc, 120, 110, 960, 202, { fill: C.card, stroke: C.line });
    T(qc, 600, 154, `QUESTION ${i + 1} OF 5`, { size: 24, weight: 700, fill: C.muted, anchor: 'middle', font: FB, ls: 2 });
    T(qc, 600, 214, d.q, { size: 40, weight: 700, anchor: 'middle', lh: 50 });
    const pic = G(g);
    const anim = d.pic(pic);
    const think = G(g); tr(think, 880, 488);
    const rg = ring(think, 54, Y);
    const num = T(think, 0, 16, '4', { size: 46, weight: 700, anchor: 'middle' });
    T(think, 0, 102, 'think…', { size: 28, weight: 600, fill: C.muted, anchor: 'middle' });
    const ans = G(g);
    const tk = tick(ans, 12, C.good); tr(tk, 660, 392);
    T(ans, 684, 403, 'Answer', { size: 26, weight: 700, fill: C.good });
    let y = 468;
    d.a.forEach((line, k) => {
      const size = k === 0 ? (d.big ? 50 : 38) : 32;
      rich(ans, 650, y, line, { size, weight: 700 });
      y += k === 0 ? (d.big ? 56 : 48) : 44;
    });
    return { g, qc, think, rg, num, ans, anim, k: i + 1 };
  });

  /* ---------- outro: a rainbow sweeps across ---------- */
  const outro = G(root);
  const RC = [600, 704], bands = SPECTRUM.map((s, k) => {
    const r = 520 - k * 17;
    const p = E('path', { d: `M${RC[0] - r},${RC[1]} A${r},${r} 0 0 1 ${RC[0] + r},${RC[1]}`, fill: 'none', stroke: s.color, 'stroke-width': 17.5, pathLength: 1, 'stroke-dasharray': '1 1' }, outro);
    const sp = spark(outro, 13, { seed: k + 2 });
    return { p, r, sp };
  });
  const brill = T(outro, 600, 470, 'Brilliant work!', { size: 80, weight: 700, anchor: 'middle' });
  const sub = rich(outro, 600, 538, ['Now try the ', ['Light & Optics quiz', Y, 800], ' in your Science Lab'], { size: 28, anchor: 'middle', fill: C.muted });
  const labChip = chip(outro, 'Science Lab  ›  Light & Optics  ›  Quiz', { size: 26, fill: C.card2, stroke: C.line, sw: 2 });
  tr(labChip, 600, 620);

  /* ---------- update ---------- */
  return t => {
    // progress pips
    op(dotsG, P(t, S.first - 0.4, 0.5, linear));
    dots.forEach((d, i) => {
      const k = i + 1, ans = at('a' + k), cur = t >= at('q' + k) - 0.15 && t < ans;
      const pf = P(t, ans - 0.05, 0.4, pop);
      op(d.fill, clamp(pf * 2)); op(d.tk, clamp(pf * 2));
      tr(d.g, 984 + i * 42, 58, cur ? 1.18 + 0.06 * wave(t, 1) : 1);
      d.ring_.setAttribute('stroke', cur ? Y : C.muted);
      const pi = P(t, mid('intro', 0.45 + i * 0.08), 0.4, pop);
      op(d.g, clamp(pi * 2));
    });

    // intro
    const ia = win(t, S.first - 0.6, at('q1') + 0.1, 0.35);
    op(intro, ia);
    if (ia > 0) tr(bub, 600, 190 - 8 * wave(t * calm, 1.4), 0.6 + 0.4 * P(t, S.first - 0.5, 0.6, pop), -4 + 8 * wave(t * calm, 2.8));

    // questions
    QS.forEach(q => {
      const k = q.k, tq = at('q' + k), ta = at('a' + k), nx = k < 5 ? at('q' + (k + 1)) : at('outro');
      const v = win(t, tq - 0.2, nx + 0.05, 0.3);
      op(q.g, v);
      if (v <= 0) return;
      const cp = P(t, tq - 0.2, 0.5, pop);
      tr(q.qc, 0, (1 - clamp(cp)) * 24);
      const a = end('q' + k) + 0.1, b = ta - 0.05;
      const tv = win(t, a - 0.25, b + 0.05, 0.2);
      op(q.think, tv);
      if (tv > 0) { q.rg.set((t - a) / (b - a)); setText(q.num, String(clamp(Math.ceil((b - t) / ((b - a) / 4)), 1, 4))); }
      const ap = P(t, ta - 0.1, 0.5, pop);
      op(q.ans, clamp(ap * 2)); tr(q.ans, 0, (1 - clamp(ap)) * 22);
      q.anim(t, ta);
    });

    // outro
    const oa = P(t, at('outro') - 0.15, 0.5, linear);
    op(outro, oa);
    if (oa > 0) {
      const t0 = at('outro');
      bands.forEach((b, k) => {
        const p = P(t, t0 + 0.1 + k * 0.16, 1.3, easeOut);
        b.p.setAttribute('stroke-dashoffset', (1 - p).toFixed(4));
        const tip = ltPt(RC[0], RC[1], 180 + 180 * p, b.r);
        tr(b.sp, tip[0], tip[1], 0.6 + 0.5 * Math.sin(Math.PI * p)); op(b.sp, p > 0 && p < 1 ? Math.sin(Math.PI * p) : 0); b.sp.upd(t);
      });
      const bp = P(t, t0 + 0.5, 0.6, pop); op(brill, clamp(bp * 2)); brill.setAttribute('transform', `translate(600 470) scale(${(0.85 + 0.15 * bp).toFixed(3)}) translate(-600 -470)`);
      op(sub, P(t, mid('outro', 0.3), 0.5, linear));
      op(labChip, P(t, mid('outro', 0.55), 0.5, linear));
    }
  };
});
