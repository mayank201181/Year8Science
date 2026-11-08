/* Quick-fire quiz: five question cards. After each question a countdown ring runs through the
   silent thinking time, then the answer appears with a small picture and a progress dot fills.
   Outro: "Brilliant work!" with a burst of sparks. */
scene('quiz', S => {
  const { at, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;

  function rich(parent, x, y, segs, o) {
    o = o || {};
    const t = E('text', { x, y, 'font-size': o.size || 30, 'font-weight': o.weight || 600, 'font-family': o.font || FD, 'text-anchor': o.anchor || 'start', fill: o.fill || C.ink }, parent);
    segs.forEach(s => { if (typeof s === 'string') s = [s]; E('tspan', { fill: s[1], 'font-weight': s[2] }, t).textContent = s[0]; });
    return t;
  }
  const EL = { N: '#5B8CFF', Ar: '#C9B8FF' };
  const shade = (hex, k) => '#' + [1, 3, 5].map(i => Math.round(parseInt(hex.slice(i, i + 2), 16) * k).toString(16).padStart(2, '0')).join('');
  const Y = C.energy;
  /* bond lines as in 03_molecules: a short line across the joint of two touching atoms (centres a, b; radii ra, rb) */
  function bondD(ax, ay, ra, bx, by, rb, len) {
    const dx = bx - ax, dy = by - ay, d = Math.hypot(dx, dy) || 1, ux = dx / d, uy = dy / d;
    const s = (d * d + ra * ra - rb * rb) / (2 * d), L = (len || 0.6) * Math.min(ra, rb);
    return `M${(ax + ux * (s - L / 2)).toFixed(1)},${(ay + uy * (s - L / 2)).toFixed(1)} L${(ax + ux * (s + L / 2)).toFixed(1)},${(ay + uy * (s + L / 2)).toFixed(1)} `;
  }
  const bonds = (parent, d, rmin) => E('path', { d, fill: 'none', stroke: '#F4FAFD', 'stroke-width': Math.max(2.4, 0.2 * rmin).toFixed(1), 'stroke-linecap': 'round', opacity: 0.9 }, parent);
  /* table sugar as in the solutions chapter: a glucose hexagon joined to a fructose pentagon, amber, as one path */
  function sugarMol(parent, s) {
    const polyD = pts => 'M' + pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' L');
    const hex = [], pen = [];
    for (let i = 0; i < 6; i++) { const a = Math.PI / 6 + i * Math.PI / 3; hex.push([-s + Math.cos(a) * s, Math.sin(a) * s]); }
    for (let i = 0; i < 5; i++) { const a = Math.PI + i * TAU / 5; pen.push([s * 1.02 + Math.cos(a) * s * 0.86, Math.sin(a) * s * 0.86]); }
    const x0 = -s * 0.134, x1 = s * 0.17, hy = s * 0.12;
    const link = `M${x0.toFixed(1)},${(-hy).toFixed(1)} L${x1.toFixed(1)},${(-hy).toFixed(1)} L${x1.toFixed(1)},${hy.toFixed(1)} L${x0.toFixed(1)},${hy.toFixed(1)} Z`;
    return E('path', { d: polyD(hex) + 'Z' + polyD(pen) + 'Z' + link, fill: ball(C.glucose, C.glucoseDk), stroke: C.glucoseDk, 'stroke-width': Math.max(1.4, s * 0.12), 'stroke-linejoin': 'round' }, parent);
  }

  /* ---------- progress dots (top right) ---------- */
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
  T(intro, 600, 350, 'Quick-fire quiz', { size: 76, weight: 700, anchor: 'middle' });
  rich(intro, 600, 414, ['Say each answer ', ['out loud', Y, 800], ' before it appears'], { size: 32, anchor: 'middle', fill: C.muted });

  /* ---------- pictures for the answers ---------- */
  function picWater(g) {
    const r = 50, H1 = atom(g, 'H', r * 0.62, { letter: true }), H2 = atom(g, 'H', r * 0.62, { letter: true }), O = atom(g, 'O', r, { letter: true });
    tr(H1, -r * 0.98, r * 0.72); tr(H2, r * 0.98, r * 0.72); tr(O, 0, -6);
    bonds(g, bondD(0, -6, r, -r * 0.98, r * 0.72, r * 0.62, 0.5) + bondD(0, -6, r, r * 0.98, r * 0.72, r * 0.62, 0.5), r * 0.62);
    const t0 = at('a1');
    return t => {
      const p1 = Math.sin(Math.PI * P(t, mid('a1', 0.36), 0.45, linear)), p2 = Math.sin(Math.PI * P(t, mid('a1', 0.44), 0.45, linear)), p3 = Math.sin(Math.PI * P(t, mid('a1', 0.78), 0.5, linear));
      tr(H1, -r * 0.98, r * 0.72, 1 + 0.16 * p1); tr(H2, r * 0.98, r * 0.72, 1 + 0.16 * p2); tr(O, 0, -6, 1 + 0.1 * p3);
      tr(g, 300, 556 + 4 * Math.sin((t - t0) * 1.4) * calm);
    };
  }
  function picAir(g) {
    E('circle', { r: 112, fill: 'rgba(159,216,255,0.08)', stroke: C.air, 'stroke-width': 3, 'stroke-dasharray': '10 8' }, g);
    const cp = E('clipPath', { id: 'ecm-quiz-air' }, defs()); E('circle', { r: 108 }, cp);
    const inner = G(g, { 'clip-path': 'url(#ecm-quiz-air)' });
    const ar = rng(23), ps = [];
    const spots = [[-58, -52], [8, -70], [62, -34], [-72, 10], [-14, -6], [52, 26], [-40, 58], [20, 62], [74, -84]];
    spots.forEach(([x, y], i) => {
      const m = G(inner), kind = i === 1 || i === 5 ? 'O' : 'N';
      if (kind === 'O') { molO2(m, 13); bonds(m, bondD(-9.36, 0, 13, 9.36, 0, 13), 13); }
      else { [-1, 1].forEach(s => E('circle', { cx: s * 10, cy: 0, r: 13, fill: ball(EL.N, shade(EL.N, 0.58)), stroke: shade(EL.N, 0.58), 'stroke-width': 1.5 }, m)); bonds(m, bondD(-10, 0, 13, 10, 0, 13), 13); }
      ps.push({ m, x, y, ph: ar() * TAU, a0: ar() * 180, sp: (ar() - 0.5) * 60 });
    });
    T(g, -56, 150, 'N₂', { size: 28, weight: 700, anchor: 'middle', fill: '#8FB0FF' });
    T(g, 56, 150, 'O₂', { size: 28, weight: 700, anchor: 'middle', fill: '#FF9A8F' });
    return t => {
      ps.forEach(p => tr(p.m, p.x + 12 * Math.sin(t * 0.9 * calm + p.ph), p.y + 10 * Math.cos(t * 0.8 * calm + p.ph * 1.3), 1, p.a0 + t * p.sp * calm));
      tr(g, 300, 540);
    };
  }
  function picCurve(g) {
    tr(g, 300, 556);
    E('path', { d: 'M-130,-96 L-130,84 L140,84', fill: 'none', stroke: C.muted, 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    T(g, -118, -104, 'temperature', { size: 24, weight: 600, fill: C.muted });
    T(g, 140, 116, 'time', { size: 24, weight: 600, fill: C.muted, anchor: 'end' });
    const pure = E('path', { d: 'M-122,70 L-70,-6 L20,-6 L120,-86', fill: 'none', stroke: C.good, 'stroke-width': 6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', pathLength: 1, 'stroke-dasharray': '1 1' }, g);
    const imp = E('path', { d: 'M-122,70 L-92,42 L20,22 L120,-62', fill: 'none', stroke: C.bad, 'stroke-width': 6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-dasharray': '12 9' }, g);
    const down = arrow(g, -40, 0, -40, 28, { color: C.energy, width: 4, head: 12 });
    const lp = T(g, -20, -20, 'pure', { size: 24, weight: 700, fill: C.good, anchor: 'middle' });
    const li = T(g, 4, 66, 'impure', { size: 24, weight: 700, fill: C.bad, anchor: 'middle' });
    const clipId = 'ecm-quiz-curve'; const cp = E('clipPath', { id: clipId }, defs()); const cr = E('rect', { x: -140, y: -120, width: 0, height: 240 }, cp);
    imp.setAttribute('clip-path', `url(#${clipId})`);
    return t => {
      pure.setAttribute('stroke-dashoffset', (1 - P(t, at('a3') - 0.1, 0.8, linear)).toFixed(3));
      attr(cr, 'width', 300 * P(t, at('a3') + 0.4, 1.1, linear));
      op(lp, P(t, at('a3') + 0.3, 0.4, linear)); op(li, P(t, at('a3') + 1.0, 0.4, linear));
      down.set(P(t, mid('a3', 0.2), 0.5)); op(down, P(t, mid('a3', 0.2), 0.3, linear));
    };
  }
  function picChroma(g) {
    tr(g, 300, 556);
    const b = beaker(g, 150, 170, { level: 0.22, liquid: '#8FD3F0', marks: false }); tr(b, 0, 30);
    E('line', { x1: -86, y1: -78, x2: 86, y2: -78, stroke: '#8C9AA6', 'stroke-width': 6, 'stroke-linecap': 'round' }, g);
    E('rect', { x: -26, y: -78, width: 52, height: 172, fill: '#F6F3EC', stroke: '#D8D2C4', 'stroke-width': 1.5 }, g);
    E('line', { x1: -22, y1: 70, x2: 22, y2: 70, stroke: '#8A949C', 'stroke-width': 2.5 }, g);
    const front = E('rect', { x: -26, y: 0, width: 52, height: 0, fill: 'rgba(143,211,240,0.35)' }, g);
    // the same split as in the chromatography chapter: yellow travels furthest, then pink, then blue
    const spots = [['#3F7BFF', 6], ['#FF4FA0', -26], ['#FFD23F', -56]].map(([c, y]) => ({ el: E('ellipse', { cx: 0, cy: 70, rx: 11, ry: 8, fill: c }, g), y }));
    const ink = E('circle', { cx: 0, cy: 70, r: 10, fill: '#1B1B1B' }, g);
    return t => {
      const u = P(t, at('a4') - 0.1, 1.3, easeOut);
      attr(front, 'y', lerp(80, -66, u)); attr(front, 'height', lerp(0, 146, u));
      spots.forEach(s => { attr(s.el, 'cy', lerp(70, s.y, u)); op(s.el, clamp(u * 4)); });
      op(ink, 1 - clamp(u * 3));
    };
  }
  function picSugar(g) {
    tr(g, 300, 540);
    E('circle', { r: 112, fill: 'rgba(76,201,240,0.10)', stroke: C.water, 'stroke-width': 3 }, g);
    const cp = E('clipPath', { id: 'ecm-quiz-sugar' }, defs()); E('circle', { r: 108 }, cp);
    const inner = G(g, { 'clip-path': 'url(#ecm-quiz-sugar)' });
    const sr = rng(51), ws = [], sg = [];
    for (let j = -4; j <= 4; j++) for (let i = -4; i <= 4; i++) {
      const x = i * 27 + (j % 2 ? 13 : 0) + (sr() - 0.5) * 6, y = j * 25 + (sr() - 0.5) * 6;
      if (Math.hypot(x, y) > 112) continue;
      const sugar = [[-1, -2], [2, -1], [0, 1], [-2, 2], [1, 3]].some(([a, b]) => a === i && b === j);
      if (sugar) sg.push({ el: sugarMol(inner, 8), halo: null, x, y, ph: sr() * TAU, rot: ((i * 37 + j * 23) % 50) - 25 });
      else ws.push({ el: E('circle', { cx: x, cy: y, r: 10.5, fill: ball(C.water, C.waterDk) }, inner), x, y, ph: sr() * TAU });
    }
    const halos = G(inner); inner.insertBefore(halos, inner.firstChild);
    sg.forEach(s => { s.halo = E('circle', { cx: s.x, cy: s.y, r: 30, fill: glow(C.glucoseLt) }, halos); });
    T(g, 0, 150, 'sugar: still there', { size: 26, weight: 700, anchor: 'middle', fill: C.glucoseLt });
    const stamp = G(g); tr(stamp, 0, -10, 1, -12);
    E('rect', { x: -96, y: -34, width: 192, height: 68, rx: 10, fill: 'rgba(10,27,39,0.55)', stroke: C.bad, 'stroke-width': 6 }, stamp);
    T(stamp, 0, 17, 'FALSE', { size: 46, weight: 700, fill: C.bad, anchor: 'middle', ls: 3 });
    return t => {
      ws.forEach(w => { attr(w.el, 'cx', w.x + Math.sin(t * 1.3 * calm + w.ph) * 2.5); attr(w.el, 'cy', w.y + Math.cos(t * 1.1 * calm + w.ph) * 2.5); });
      const gl = P(t, mid('a5', 0.2), 0.6, linear);
      sg.forEach(s => { const x = s.x + Math.sin(t * 1.2 * calm + s.ph) * 2.5, y = s.y + Math.cos(t * calm + s.ph) * 2.5; tr(s.el, x, y, 1, s.rot); attr(s.halo, 'cx', x); attr(s.halo, 'cy', y); op(s.halo, gl * (0.7 + 0.3 * wave(t, 1.3, s.ph))); });
      const sp = P(t, at('a5') - 0.05, 0.45, pop), out = P(t, mid('a5', 0.14), 0.5, linear);
      op(stamp, clamp(sp * 2) * (1 - out)); tr(stamp, 0, -10, 1.5 - 0.5 * clamp(sp), -12);
    };
  }

  /* ---------- the five questions ---------- */
  const QS = [
    { q: 'What’s the chemical formula\nfor water?', a: [[['H₂O', Y, 800]], [['two hydrogen atoms bonded', C.ink]], [['to one oxygen atom.', C.ink]]], pic: picWater, big0: true },
    { q: 'Air: is it an element,\na compound or a mixture?', a: [[['A ', C.ink], ['mixture', Y, 800], ['.', C.ink]], [['Its gases are mixed,', C.ink]], [['but not bonded.', C.ink]]], pic: picAir },
    { q: 'How does an impurity change\na substance’s melting point?', a: [[['It ', C.ink], ['lowers', Y, 800], [' it, and', C.ink]], [['spreads it over a ', C.ink], ['range', Y, 800], ['.', C.ink]]], pic: picCurve },
    { q: 'Which method separates the\ndifferent dyes in an ink?', a: [[['Chromatography', Y, 800], ['.', C.ink]]], pic: picChroma },
    { q: 'True or false: when sugar dissolves\nin water, it’s destroyed.', a: [[['False.', C.bad, 800], [' Its particles spread out', C.ink]], [['among the water particles, and', C.ink]], [['the mass stays the same.', C.ink]]], pic: picSugar, small: true },
  ].map((d, i) => {
    const g = G(root);
    const qc = G(g);
    card(qc, 120, 126, 960, 262, { fill: C.card, stroke: C.line });
    T(qc, 600, 178, `QUESTION ${i + 1} OF 5`, { size: 24, weight: 700, fill: C.muted, anchor: 'middle', font: FB, ls: 2 });
    T(qc, 600, 250, d.q, { size: 42, weight: 700, anchor: 'middle', lh: 54 });
    const think = G(g); tr(think, 600, 528);
    const rg = ring(think, 54, Y);
    const num = T(think, 0, 16, '4', { size: 46, weight: 700, anchor: 'middle' });
    T(think, 0, 102, 'think…', { size: 28, weight: 600, fill: C.muted, anchor: 'middle' });
    const ans = G(g);
    const pic = G(ans);
    const anim = d.pic(pic) || (() => {});
    const tk = tick(ans, 12, C.good); tr(tk, 470, 450);
    T(ans, 492, 461, 'Answer', { size: 26, weight: 700, fill: C.good });
    const size = d.small ? 34 : 40, lh = d.small ? 46 : 52, y0 = d.small ? 512 : 526;
    d.a.forEach((line, k) => rich(ans, 464, y0 + k * lh + (d.big0 && k ? 14 : 0), line, { size: d.big0 && k === 0 ? 58 : size, weight: 700 }));
    return { g, qc, think, rg, num, ans, anim, k: i + 1 };
  });

  /* ---------- outro ---------- */
  const outro = G(root);
  const burst = G(outro);
  const sparks = [];
  const br = rng(17);
  for (let k = 0; k < 14; k++) { const s = spark(burst, 12 + br() * 10, { seed: k }); sparks.push({ s, a: (k / 14) * TAU + br() * 0.3, d: 200 + br() * 120, dl: br() * 0.4 }); }
  T(outro, 600, 330, 'Brilliant work!', { size: 80, weight: 700, anchor: 'middle' });
  rich(outro, 600, 404, ['Now try the ', ['Elements, Compounds & Mixtures quiz', Y, 800]], { size: 32, anchor: 'middle', fill: C.muted });
  T(outro, 600, 448, 'in your Science Lab, to lock it in', { size: 32, weight: 600, anchor: 'middle', fill: C.muted });
  const labChip = chip(outro, 'Science Lab  ›  Elements, Compounds & Mixtures  ›  Quiz', { size: 26, fill: C.card2, stroke: C.line, sw: 2 });
  tr(labChip, 600, 528);

  /* ---------- update ---------- */
  return t => {
    // progress dots
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
    const ia = win(t, S.first - 0.6, at('q1') - 0.1, 0.35);
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
      const a = S.end('q' + k) + 0.1, b = ta - 0.05;
      const tv = win(t, a - 0.25, b + 0.05, 0.2);
      op(q.think, tv);
      if (tv > 0) { q.rg.set((t - a) / (b - a)); setText(q.num, String(clamp(Math.ceil((b - t) / ((b - a) / 4)), 1, 4))); }
      const ap = P(t, ta - 0.1, 0.5, pop);
      op(q.ans, clamp(ap * 2)); tr(q.ans, 0, (1 - clamp(ap)) * 22);
      if (ap > 0) q.anim(t);
    });

    // outro
    const oa = P(t, at('outro') - 0.15, 0.5, linear);
    op(outro, oa);
    if (oa > 0) {
      const t0 = at('outro');
      sparks.forEach(o => {
        const u = clamp((t - t0 - o.dl) / 2.4);
        const d = easeOut(u) * o.d;
        tr(o.s, 600 + Math.cos(o.a) * d * 1.5, 300 + Math.sin(o.a) * d * 0.85, 0.4 + 0.8 * Math.sin(Math.min(1, u * 1.2) * Math.PI));
        op(o.s, u > 0 ? Math.sin(Math.min(1, u) * Math.PI) * 0.95 : 0);
        o.s.upd(t);
      });
      op(labChip, P(t, mid('outro', 0.5), 0.5, linear));
    }
  };
});
