/* Quick-fire quiz: five question cards. After each question a countdown ring runs through the
   silent thinking time, then the answer appears with a small picture and a progress dot fills.
   Pictures: a big N beside a newtonmeter holding an apple (1 N); a sliding box with equal and opposite
   forces and a 0 N resultant; a 3 kg bag on a newtonmeter reading 30 N; a cyclist covering 200 m as a
   stopwatch reaches 25 s, then 8 m/s; sharp and blunt knives on tomatoes with their pressure readouts.
   Outro: "Brilliant work!" with a burst of sparks. */
scene('quiz', S => {
  const { at, end, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;

  function rich(parent, x, y, segs, o) {
    o = o || {};
    const t = E('text', { x, y, 'font-size': o.size || 30, 'font-weight': o.weight || 600, 'font-family': o.font || FD, 'text-anchor': o.anchor || 'start', fill: o.fill || C.ink }, parent);
    segs.forEach(s => { if (typeof s === 'string') s = [s]; E('tspan', { fill: s[1], 'font-weight': s[2] }, t).textContent = s[0]; });
    return t;
  }
  const Y = C.energy, AREA = C.air;

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

  /* ---------- small art ---------- */
  /* a small apple hanging by its stalk from (0, 0) */
  function apple(parent) {
    const g = G(parent);
    E('path', { d: 'M0,0 L0,12', stroke: '#6B4423', 'stroke-width': 3, 'stroke-linecap': 'round' }, g);
    E('path', { d: 'M1,6 C8,0 16,2 18,6 C12,10 6,10 1,6 Z', fill: C.plant, stroke: C.plantDk, 'stroke-width': 1.5 }, g);
    E('path', { d: 'M0,16 C-8,8 -26,10 -26,30 C-26,46 -14,56 0,52 C14,56 26,46 26,30 C26,10 8,8 0,16 Z', fill: ball('#FF6A55', '#B3241B'), stroke: '#8A1A12', 'stroke-width': 2 }, g);
    return g;
  }
  /* a stopwatch, face radius r; g.set(seconds of a 60 s dial) */
  function stopwatch(parent, r) {
    const g = G(parent);
    E('rect', { x: -7, y: -r - 14, width: 14, height: 12, rx: 3, fill: C.muted }, g);
    E('circle', { r, fill: C.card, stroke: C.muted, 'stroke-width': 4 }, g);
    for (let k = 0; k < 12; k++) E('line', { x1: 0, y1: -r + 4, x2: 0, y2: -r + (k % 3 ? 8 : 11), stroke: C.muted, 'stroke-width': 2, transform: `rotate(${k * 30})` }, g);
    const hand = E('line', { x1: 0, y1: 4, x2: 0, y2: -r + 8, stroke: Y, 'stroke-width': 4, 'stroke-linecap': 'round' }, g);
    E('circle', { r: 4, fill: Y }, g);
    g.set = s => hand.setAttribute('transform', `rotate(${(s * 6).toFixed(1)})`);
    g.set(0);
    return g;
  }
  /* a knife blade end-on: a steel wedge, tip at (0, 0); sharp or blunt */
  function wedge(parent, sharp, hgt) {
    const g = G(parent), H2 = hgt;
    const d = sharp ? `M-14,${-H2} L14,${-H2} L1.2,-1 Q0,0 -1.2,-1 Z` : `M-14,${-H2} L14,${-H2} L12,-8 Q11,0 3,0 L-3,0 Q-11,0 -12,-8 Z`;
    E('path', { d, fill: linGrad('#EEF3F7', '#8E9EAC'), stroke: '#66788A', 'stroke-width': 2, 'stroke-linejoin': 'round' }, g);
    return g;
  }

  /* ---------- pictures for the answers (drawn around (0, 0) = (300, 556) on the stage) ---------- */
  // 1. the newton: a big N beside a newtonmeter holding a small apple (about 1 N)
  function picN(g) {
    T(g, -100, 66, 'N', { size: 170, weight: 700, fill: Y, anchor: 'middle' });
    const NS = 0.62, nmG = G(g); tr(nmG, 26, -138);
    const nm = fmNewtonmeter(nmG, { max: 10, len: 100, every: 5, minor: 1 }); tr(nm, 0, 0, NS);
    const ap = G(nmG); apple(ap);
    const rd = T(nmG, 70, 0, '1 N', { size: 30, weight: 700, fill: Y });
    return t => {
      const v = P(t, at('a1') + 0.1, 0.7, easeOut);
      nm.set(v); const hk = nm.hook(); tr(ap, hk[0] * NS, hk[1] * NS);
      attr(rd, 'y', (30 + 8 + 48 + 10 * v) * NS + 10); op(rd, P(t, at('a1') + 0.6, 0.3, linear));
    };
  }
  // 2. balanced: a box sliding at a steady speed, push and friction equal, resultant 0 N
  function picBox(g) {
    const FL = 70, SC = 4;
    const floor = G(g);
    E('line', { x1: -170, x2: 140, y1: FL, y2: FL, stroke: '#8FA3B3', 'stroke-width': 5, 'stroke-linecap': 'round' }, floor);
    const hatch = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(() => E('line', { stroke: '#8FA3B3', 'stroke-width': 3, opacity: 0.5, 'stroke-linecap': 'round' }, floor));
    const crate = fmCrate(g, 110, 84); crate.at(-10, FL);
    fmArrow(g, 'push', crate.pt.left[0], crate.pt.left[1] - 12, 20, 'right', { scale: SC, tip: true, nudge: [-36, 0] });
    fmArrow(g, 'friction', crate.pt.bottom[0], FL, 20, 'left', { scale: SC, side: 'below' });
    const zero = chip(g, 'resultant: 0 N', { size: 26, fill: C.card2, stroke: Y, sw: 2.5, color: Y }); tr(zero, -10, -52);
    fmScaleBar(g, 70, 140, 10, { scale: SC });
    return t => { const d = t * 70 * calm; hatch.forEach((l, k) => { const x = -160 + ((k * 28 - d) % 336 + 336) % 336; attr(l, 'x1', x); attr(l, 'y1', FL + 5); attr(l, 'x2', x - 16); attr(l, 'y2', FL + 23); op(l, x > -152 && x < 148 ? 1 : 0); }); };
  }
  // 3. weight: a 3 kg bag on a newtonmeter reading 30 N
  function picBag(g) {
    const NS = 0.6, nmG = G(g); tr(nmG, -60, -150);
    const nm = fmNewtonmeter(nmG, { max: 40, len: 100, every: 20, minor: 5 }); tr(nm, 0, 0, NS);
    const bag = G(nmG); fmBag(bag, '3 kg', { s: 0.55 });
    const rd = T(nmG, 72, 0, '30 N', { size: 34, weight: 700, fill: Y });
    return t => {
      const v = 30 * P(t, at('a3') + 0.1, 0.8, easeOut);
      nm.set(v); const hk = nm.hook(); tr(bag, hk[0] * NS, hk[1] * NS);
      attr(rd, 'y', (30 + 8 + 48 + 100 * v / 40) * NS + 11); op(rd, P(t, at('a3') + 0.7, 0.3, linear));
    };
  }
  // 4. speed: a cyclist covers 200 m as the stopwatch reaches 25 s
  function picRide(g) {
    const RD = 84, X0 = -140, X1 = 120;
    E('line', { x1: -170, x2: 150, y1: RD, y2: RD, stroke: C.muted, 'stroke-width': 4 }, g);
    [X0, X1].forEach(x => E('line', { x1: x, x2: x, y1: RD - 12, y2: RD + 12, stroke: C.ink, 'stroke-width': 4 }, g));
    fmDim(g, X0, RD + 24, X1, RD + 24, '200 m', { tick: 9 });
    const cg = G(g), cyc = fmCyclist(cg); tr(cyc, 0, 0, 0.5);
    const sw = stopwatch(g, 34); tr(sw, -112, -86);
    const secs = T(g, -64, -74, '0 s', { size: 34, weight: 700, fill: C.ink });
    const spd = chip(g, '8 m/s', { size: 34, fill: Y, color: C.bg0 });
    return t => {
      const u = P(t, at('a4') - 0.05, 2.4, linear);
      const x = lerp(X0, X1, u); tr(cg, x, RD); cyc.roll((x - X0) / 0.5);
      sw.set(25 * u); setText(secs, Math.round(25 * u) + ' s');
      const sp = P(t, at('a4') + 2.4, 0.5, pop); op(spd, clamp(sp * 2)); tr(spd, -10, 0, Math.max(0.01, 0.6 + 0.4 * sp));
    };
  }
  // 5. pressure: sharp and blunt knives on tomatoes, the same push, very different pressures
  function picKnives(g) {
    const KX = [-90, 70], TR = 48, TCY = 96, TTOP = TCY - TR;
    const parts = KX.map((x, i) => {
      E('circle', { cx: x, cy: TCY, r: TR, fill: ball('#FF6A55', '#B3241B'), stroke: '#8A1A12', 'stroke-width': 2.5 }, g);
      E('path', { d: 'M0,-8 L4,-3 L12,-4 L6,1 L9,8 L0,4 L-9,8 L-6,1 L-12,-4 L-4,-3 Z', fill: '#3E9B4F', stroke: '#2A6E37', 'stroke-width': 1.5, transform: `translate(${x - TR * 0.5} ${TCY - TR * 0.58}) rotate(-35)` }, g);
      T(g, x, -136, i ? 'blunt' : 'sharp', { size: 28, weight: 700, anchor: 'middle' });
      const m = meter(g, { w: 110, h: 18, color: Y }); tr(m, x - 55, -122);
      const wg = G(g, i ? {} : { 'clip-path': 'url(#qwedge)' }), w = wedge(wg, i === 0, 86);
      const push = fmArrow(g, 'push', 0, 0, 44, 'down', { scale: 1, width: 6, tip: true, value: false, label: '' });
      return { x, m, w, push };
    });
    const cp = E('clipPath', { id: 'qwedge' }, defs());
    E('path', { d: `M-400,-400 H400 V${TTOP + 1} H-400 Z` }, cp);
    const area = E('line', { x1: KX[1] - 9, x2: KX[1] + 9, stroke: AREA, 'stroke-width': 6, 'stroke-linecap': 'round' }, g);
    const slit = E('line', { x1: KX[0], x2: KX[0], y1: TTOP + 1, stroke: '#6E140E', 'stroke-width': 2.5, 'stroke-linecap': 'round' }, g);
    return t => {
      const p = P(t, at('a5') + 0.1, 1.0);
      parts.forEach((q, i) => {
        const y = TTOP + (i === 0 ? 18 : 3) * p;
        tr(q.w, q.x, y); q.push.move(q.x, y - 86); q.push.set(1);
        q.m.set((i === 0 ? 0.95 : 0.22) * p);
      });
      attr(area, 'y1', TTOP + 3 * p + 1); attr(area, 'y2', TTOP + 3 * p + 1);
      attr(slit, 'y2', TTOP + 18 * p + 6); op(slit, p > 0.05 ? 1 : 0);
    };
  }

  /* ---------- the five questions ---------- */
  const QS = [
    { q: 'What is the unit of force?', a: [[['The ', C.ink], ['newton', Y, 800], [', N.', C.ink]]], pic: picN },
    { q: 'A box slides at a steady speed\nin a straight line. What can you\nsay about the forces on it?', a: [[['They’re ', C.ink], ['balanced', Y, 800], [':', C.ink]], [['the resultant force', C.ink]], [['is ', C.ink], ['zero', Y, 800], ['.', C.ink]]], pic: picBox },
    { q: 'A bag has a mass of 3 kg.\nWhat is its weight on Earth?', a: [[['30 N', Y, 800], [': 3 × 10', C.ink]], [['(W = m × g)', C.muted]]], pic: picBag },
    { q: 'A cyclist rides 200 m in 25 s.\nWhat is their average speed?', a: [[['8 m/s', Y, 800], [': 200 ÷ 25', C.ink]]], pic: picRide },
    { q: 'Why does a sharp knife cut\nbetter than a blunt one?', a: [[['Its ', C.ink], ['tiny area', AREA, 800], [' gives', C.ink]], [['a much ', C.ink], ['higher pressure', Y, 800]], [['for the same force.', C.ink]]], pic: picKnives },
  ].map((d, i) => {
    const g = G(root);
    const qc = G(g);
    card(qc, 120, 126, 960, 262, { fill: C.card, stroke: C.line });
    T(qc, 600, 178, `QUESTION ${i + 1} OF 5`, { size: 24, weight: 700, fill: C.muted, anchor: 'middle', font: FB, ls: 2 });
    const n = d.q.split('\n').length;
    T(qc, 600, n === 1 ? 286 : n === 2 ? 250 : 238, d.q, { size: n === 3 ? 40 : 42, weight: 700, anchor: 'middle', lh: n === 3 ? 50 : 54 });
    const think = G(g); tr(think, 600, 528);
    const rg = ring(think, 54, Y);
    const num = T(think, 0, 16, '4', { size: 46, weight: 700, anchor: 'middle' });
    T(think, 0, 102, 'think…', { size: 28, weight: 600, fill: C.muted, anchor: 'middle' });
    const ans = G(g);
    const pic = G(ans); tr(pic, 300, 556);
    const anim = d.pic(pic) || (() => {});
    const tk = tick(ans, 12, C.good); tr(tk, 470, 450);
    T(ans, 492, 461, 'Answer', { size: 26, weight: 700, fill: C.good });
    const many = d.a.length > 1, size = many ? 38 : 44, lh = many ? 50 : 52, y0 = many ? 518 : 530;
    d.a.forEach((line, k) => rich(ans, 464, y0 + k * lh, line, { size, weight: 700 }));
    return { g, qc, think, rg, num, ans, anim, k: i + 1 };
  });

  /* ---------- outro ---------- */
  const outro = G(root);
  const burst = G(outro);
  const sparks = [];
  const br = rng(17);
  for (let k = 0; k < 14; k++) { const s = spark(burst, 12 + br() * 10, { seed: k }); sparks.push({ s, a: (k / 14) * TAU + br() * 0.3, d: 200 + br() * 120, dl: br() * 0.4 }); }
  T(outro, 600, 330, 'Brilliant work!', { size: 80, weight: 700, anchor: 'middle' });
  rich(outro, 600, 404, ['Now try the ', ['Forces & Motion quiz', Y, 800], ' in your Science Lab'], { size: 32, anchor: 'middle', fill: C.muted });
  const labChip = chip(outro, 'Science Lab  ›  Forces & Motion  ›  Quiz', { size: 26, fill: C.card2, stroke: C.line, sw: 2 });
  tr(labChip, 600, 490);

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
        op(o.s, u > 0 && u < 1 ? Math.sin(u * Math.PI) * 0.95 : 0);
        o.s.upd(t);
      });
      op(labChip, P(t, mid('outro', 0.5), 0.5, linear));
    }
  };
});
