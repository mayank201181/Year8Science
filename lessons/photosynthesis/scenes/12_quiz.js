/* Quick-fire quiz: five question cards. After each question a countdown ring runs through the silent
   thinking time, then the answer appears with a small picture and a progress dot fills.
   Pictures: carbon dioxide + water; a leaf reflecting green light into an eye; stomata between guard
   cells; ethanol turning green beside a leaf going pale; the potted plant drawing carbon dioxide from the air.
   Outro: "Brilliant work!" with a burst of sparks and leaves. */
scene('quiz', S => {
  const { at, end, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;

  function rich(parent, x, y, segs, o) {
    o = o || {};
    const t = E('text', { x, y, 'font-size': o.size || 30, 'font-weight': o.weight || 600, 'font-family': o.font || FD, 'text-anchor': o.anchor || 'start', fill: o.fill || C.ink }, parent);
    segs.forEach(s => { if (typeof s === 'string') s = [s]; E('tspan', { fill: s[1], 'font-weight': s[2] }, t).textContent = s[0]; });
    return t;
  }
  const hex = c => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16));
  const mixCol = (a, b, p) => { const x = hex(a), y = hex(b); return 'rgb(' + x.map((v, i) => Math.round(lerp(v, y[i], clamp(p)))).join(',') + ')'; };
  const LEAF_D = 'M0,0 C40,-60 150,-70 205,0 C150,70 40,60 0,0 Z';
  const Y = C.energy, RED = '#FF5A4F', BLUE = '#4D8DFF', GREEN = '#4FE07A';

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
  T(intro, 600, 350, 'Quick-fire quiz!', { size: 76, weight: 700, anchor: 'middle' });
  rich(intro, 600, 414, ['Say each answer ', ['out loud', Y, 800], ' before it appears'], { size: 32, anchor: 'middle', fill: C.muted });

  /* ---------- pictures for the answers (drawn around (0,0), placed at (300,556)) ---------- */
  // 1. the two raw materials
  function picRaw(g) {
    const co2 = molCO2(g, 18, { letter: true }), h2o = molH2O(g, 22, { letter: true });
    const c1 = chip(g, 'carbon dioxide', { size: 26, fill: C.co2, color: '#10202B' }); tr(c1, -82, 52);
    const c2 = chip(g, 'water', { size: 26, fill: C.water, color: '#06283A' }); tr(c2, 92, 52);
    return t => {
      tr(co2, -82, -22 + 4 * Math.sin(t * 1.7 * calm), 1, 8 * Math.sin(t * 0.9 * calm));
      tr(h2o, 92, -26 + 4 * Math.sin(t * 1.7 * calm + 1.3), 1, 10 * Math.sin(t * 0.9 * calm + 1));
    };
  }
  // 2. red and blue sink into the leaf, green bounces off into an eye
  function picLeaf(g) {
    const lf = leaf(g, 0.74); tr(lf, -150, 56, 1, -8);
    const ray = (x1, y1, x2, y2, col) => E('path', { d: `M${x1},${y1} L${x2},${y2}`, stroke: col, 'stroke-width': 7, 'stroke-linecap': 'round', fill: 'none', 'stroke-dasharray': '16 10' }, g);
    // red and blue end on the leaf (absorbed); green hits it and bounces off to the eye
    const rR = ray(-168, -88, -78, 30, RED), rB = ray(-128, -104, -50, 26, BLUE), rG = ray(-86, -116, -24, 22, GREEN);
    const EX = 104, EY = -62;
    const rOut = ray(-24, 22, EX - 34, EY + 16, GREEN);
    const ang = Math.atan2(EY + 16 - 22, EX - 34 + 24) * 180 / Math.PI;
    const head = E('path', { d: 'M0,0 L-20,-12 L-14,0 L-20,12 Z', fill: GREEN, transform: `translate(${EX - 30} ${EY + 14}) rotate(${ang.toFixed(1)})` }, g);
    const sR = spark(g, 11, { seed: 2 }), sB = spark(g, 11, { seed: 5 });
    const eye = G(g); tr(eye, EX, EY, 1, -32);
    E('path', { d: 'M-30,0 Q0,-24 30,0 Q0,24 -30,0 Z', fill: '#F4F7FA', stroke: '#C9D6DE', 'stroke-width': 3 }, eye);
    E('circle', { cx: -7, r: 11, fill: ball(C.plant, C.plantDk) }, eye);
    E('circle', { cx: -7, r: 5, fill: '#10202B' }, eye);
    return t => {
      const k = (t * 40 * calm) % 26;
      [rR, rB, rG, rOut].forEach(r => r.setAttribute('stroke-dashoffset', (-k).toFixed(1)));
      op(head, 1);
      sR.upd(t); sB.upd(t + 0.4);
      tr(sR, -78, 30, 0.7 + 0.3 * wave(t, 0.8)); tr(sB, -50, 26, 0.7 + 0.3 * wave(t, 0.8, 0.5));
    };
  }
  // 3. one stoma seen from the underside of the leaf, between its two guard cells (the leaf chapter's
  //    close-up, 04_leaf.js); carbon dioxide drifts in through the pore
  /* a stoma seen from below: two kidney-shaped guard cells around a pore; g.set(open 0..1). Copied from 04_leaf.js */
  function stomaFace(parent) {
    const g = G(parent);
    const pr = rng(77);
    for (let i = 0; i < 9; i++) {      // walls of the neighbouring epidermis cells
      const a = -Math.PI / 2 + i * TAU / 9 + (pr() - 0.5) * 0.3, r0 = 104, r1 = 190, pts = [];
      for (let k = 0; k <= 5; k++) { const rk = lerp(r0, r1, k / 5); pts.push([Math.cos(a + Math.sin(k * 1.7 + i) * 0.08) * rk * 0.82, Math.sin(a + Math.sin(k * 1.7 + i) * 0.08) * rk]); }
      E('path', { d: openPath(pts), fill: 'none', stroke: '#A9DCC2', 'stroke-width': 3, opacity: 0.55 }, g);
    }
    const pore = E('path', { fill: '#06131B', stroke: '#16402B', 'stroke-width': 2 }, g);
    const cells = [-1, 1].map(s => ({ s, el: E('path', { fill: '#2E7D50', stroke: '#9BEAB2', 'stroke-width': 3.5, 'stroke-linejoin': 'round' }, g), wall: E('path', { fill: 'none', stroke: '#173F2B', 'stroke-width': 6, 'stroke-linecap': 'round' }, g), chl: [0, 1, 2].map(() => E('ellipse', { rx: 6, ry: 9.5, fill: ball(C.chloro, C.chloroDk) }, g)) }));
    g.set = v => {
      v = clamp(v);
      const ho = 96, wo = 68 + 8 * v, hp = 60 + 6 * v, wp = 3 + 19 * v;
      attr(pore, 'd', `M0,${-hp} Q${-2 * wp},0 0,${hp} Q${2 * wp},0 0,${-hp} Z`);
      cells.forEach(c => {
        const s = c.s, k = 4 / 3 * wo;
        attr(c.el, 'd', `M0,${-ho} C${s * -k},${-ho} ${s * -k},${ho} 0,${ho} L0,${hp} Q${s * -2 * wp},0 0,${-hp} Z`);
        attr(c.wall, 'd', `M0,${hp} Q${s * -2 * wp},0 0,${-hp}`);
        c.chl.forEach((e, i) => { const y = (i - 1) * 42, xi = wp * (1 - (y / hp) ** 2), xo = wo * Math.sqrt(Math.max(0, 1 - (y / ho) ** 2)); attr(e, 'cx', -s * (xi + xo) / 2); attr(e, 'cy', y); });
      });
    };
    g.set(0.5);
    return g;
  }
  function picStomata(g) {
    const clip = E('clipPath', { id: 'phQuizStoma' }, defs());
    E('rect', { x: -140, y: -132, width: 280, height: 224, rx: 24 }, clip);
    card(g, -140, -132, 280, 224, { fill: '#163A2E', stroke: C.line });
    const faceG = G(g); faceG.setAttribute('clip-path', 'url(#phQuizStoma)');
    const face = stomaFace(faceG); tr(face, 0, -20, 0.74); face.set(0.85);
    const mols = [0, 1].map(() => molCO2(g, 8));
    T(g, 0, 130, 'one stoma', { size: 30, weight: 700, anchor: 'middle', fill: C.chloro });
    return t => mols.forEach((m, k) => {
      const u = ((t * 0.38 * calm) + k / 2) % 1, p = easeIn(u);
      tr(m, lerp(k ? -96 : 98, 0, p), lerp(k ? 56 : -104, -20, p), 1 - 0.6 * p, (k ? -50 : 40) + 30 * Math.sin(u * 4));
      op(m, Math.min(1, u * 6) * (1 - P(u, 0.78, 0.22, linear)));
    });
  }
  // 4. ethanol turns green as the leaf beside it goes pale
  function picEthanol(g) {
    const tube = testTube(g, 58, 200, { level: 0.64, liquid: '#E4F1F6' }); tr(tube, -88, -12);
    const bs = bubbles(g, -104, 10, 30, 62, { n: 5, r: 5, seed: 4, speed: 0.5 });
    T(g, -88, 118, 'ethanol', { size: 26, weight: 700, anchor: 'middle', fill: C.muted });
    const lf = leaf(g, 0.56); tr(lf, 6, 30, 1, -38);
    const pale = G(g); tr(pale, 6, 30, 1, -38);
    const pin = G(pale); tr(pin, 0, 0, 0.56);
    E('path', { d: LEAF_D, fill: ball('#EEF3DA', '#BCC79B'), stroke: '#AEB98C', 'stroke-width': 3 }, pin);
    E('path', { d: 'M-10,0 L200,0', stroke: '#FFFFFF', 'stroke-width': 4, 'stroke-linecap': 'round', opacity: 0.7 }, pin);
    const lbl = T(g, 66, 118, 'leaf goes pale', { size: 26, weight: 700, anchor: 'middle', fill: C.muted });
    return t => {
      const k = P(t, at('a4') + 0.25, 2.0, ease);
      tube.set(0.64, mixCol('#E4F1F6', '#3FBF5E', k));
      op(pale, k); op(lbl, P(t, at('a4') + 1.2, 0.5, linear));
      bs.upd(t * calm);
    };
  }
  /* ---------- shared art: the lesson's potted plant, exactly as drawn in the intro (00_intro.js) ----------
     The same code is in every chapter that shows a potted plant. Origin: the middle of the soil surface;
     about 230 x 545 at o.s = 1. o.s scales it; o.see makes the pot see-through, as in 01_bigidea.js, and
     g.soil is then the layer for roots and anything else in the soil; o.k stretches the stem (1 = the
     intro's height); o.ls scales the leaves; o.bare draws the pot only. g.leaves[i] = { el, blade, x, y, r, s }
     are the intro's four leaves, then its two tip leaves; g.grow(k) restretches the stem; g.leafPt(i, f) is
     the point f of the way along leaf i and g.topY() the stem tip, both in g's own coordinates. */
  function introPlant(parent, o) {
    o = o || {};
    const g = G(parent), pg = G(g), S = o.s || 1, ls = o.ls || 1, f1 = v => +v.toFixed(1);
    if (S !== 1) tr(pg, 0, 0, S);
    if (o.see) {
      E('path', { d: 'M-110,-6 L110,-6 L110,24 L100,24 L80,164 Q78,176 66,176 L-66,176 Q-78,176 -80,164 L-100,24 L-110,24 Z', fill: linGrad('#7A5538', '#3E2818', true) }, pg);
      g.soil = G(pg);
    }
    const stem = o.bare ? null : E('path', { fill: 'none', stroke: C.stem, 'stroke-width': 12, 'stroke-linecap': 'round' }, pg);
    g.leaves = (o.bare ? [] : [[-5, -75, 198, 0.62], [5, -135, -24, 0.66], [-4, -205, 206, 0.7], [4, -262, -30, 0.56], [0, -328, -64, 0.2], [0, -328, -116, 0.2]]).map(([x, y, r, s], i) => {
      const el = leaf(pg, s * ls), parts = Array.from(el.firstChild.children), veins = parts.slice(2);
      if (i < 4) veins[0].setAttribute('d', veins.map(v => v.getAttribute('d')).join(' '));   // one path for the side veins
      veins.slice(i < 4 ? 1 : 0).forEach(v => v.remove());                                    // (too small to see on the tip leaves)
      return { el, blade: parts[0], x, y, r, s: s * ls };
    });
    E('path', { d: 'M-100,22 L100,22 L80,164 Q78,176 66,176 L-66,176 Q-78,176 -80,164 Z', fill: o.see ? 'rgba(217,130,74,0.2)' : ball('#D9824A', '#9A4E1E'), stroke: '#F0B48A', 'stroke-width': 3, 'stroke-linejoin': 'round' }, pg);
    E('rect', { x: -114, y: -6, width: 228, height: 32, rx: 9, fill: o.see ? 'rgba(227,149,94,0.3)' : ball('#E3955E', '#A9592A'), stroke: '#F0B48A', 'stroke-width': 3 }, pg);
    E('ellipse', { cx: 0, cy: -6, rx: 113, ry: 12, fill: '#EBA26C', stroke: '#F0B48A', 'stroke-width': 3 }, pg);
    E('ellipse', { cx: 0, cy: -5, rx: 99, ry: 8, fill: C.soil }, pg);
    let kNow = 1;
    g.grow = k => {
      kNow = k;
      if (stem) stem.setAttribute('d', `M0,-6 C-9,${f1(-90 * k)} 10,${f1(-180 * k)} 0,${f1(-268 * k)} C-4,${f1(-298 * k)} 0,${f1(-318 * k)} 0,${f1(-330 * k)}`);
      g.leaves.forEach(L => tr(L.el, L.x, L.y * k, 1, L.r));
    };
    g.grow(o.k || 1);
    g.leafPt = (i, f) => { const L = g.leaves[i], a = L.r * Math.PI / 180, d = 205 * L.s * f; return [S * (L.x + Math.cos(a) * d), S * (L.y * kNow + Math.sin(a) * d)]; };
    g.topY = () => -330 * kNow * S;
    return g;
  }
  // 5. the lesson's potted plant takes in carbon dioxide from the air (its soil gives almost none of the mass)
  function picPlant(g) {
    const PS = 0.4, PY = 128 - 176 * PS;                                      // pot bottom at y = 128
    const plant = introPlant(g, { s: PS }); tr(plant, 0, PY);
    const mols = [0, 1, 2].map(() => molCO2(g, 10));
    const air = chip(g, 'from the air', { size: 26, fill: C.card2, stroke: C.co2, sw: 2 }); tr(air, -100, -128);
    const SRC = [[118, -112], [124, -46], [96, -146]];                         // in the air, clear of the answer text
    const TGT = [plant.leafPt(3, 0.6), plant.leafPt(1, 0.6), plant.leafPt(2, 0.6)].map(p => [p[0], PY + p[1]]);
    return t => mols.forEach((m, k) => {
      const u = ((t * 0.3 * calm) + k / 3) % 1, p = ease(u);
      tr(m, lerp(SRC[k][0], TGT[k][0], p), lerp(SRC[k][1], TGT[k][1], p), 1 - 0.5 * p, u * 120);
      op(m, Math.min(1, u * 6) * (1 - P(u, 0.8, 0.2, linear)));
    });
  }

  /* ---------- the five questions ---------- */
  const QS = [
    { q: 'What are the two raw materials\nfor photosynthesis?', a: [[['Carbon dioxide', C.co2, 800], [' and', C.ink]], [['water', C.water, 800], ['.', C.ink]]], pic: picRaw },
    { q: 'Why do leaves look green?', a: [[['Chlorophyll ', C.ink], ['reflects', Y, 800]], [['green', GREEN, 800], [' light, and absorbs', C.ink]], [['mainly ', C.ink], ['red', RED, 800], [' and ', C.ink], ['blue', '#7FB0FF', 800], ['.', C.ink]]], pic: picLeaf, small: true },
    { q: 'Through which tiny pores does\ncarbon dioxide get into a leaf?', a: [[['The ', C.ink], ['stomata', Y, 800], ['.', C.ink]]], pic: picStomata },
    { q: 'In the starch test, why is the\nleaf boiled in ethanol?', a: [[['To ', C.ink], ['remove the', Y, 800]], [['chlorophyll', Y, 800], [', so the colour', C.ink]], [['change is easy to see.', C.ink]]], pic: picEthanol, small: true },
    { q: "Where does most of a plant's\ndry mass come from?", a: [[['Carbon dioxide', C.co2, 800]], [['from the air.', C.ink]], [['Not the soil!', C.bad, 800]]], pic: picPlant, small: true },
  ].map((d, i) => {
    const g = G(root);
    const qc = G(g);
    card(qc, 120, 126, 960, 262, { fill: C.card, stroke: C.line });
    T(qc, 600, 178, `QUESTION ${i + 1} OF 5`, { size: 24, weight: 700, fill: C.muted, anchor: 'middle', font: FB, ls: 2 });
    const one = d.q.indexOf('\n') < 0;
    T(qc, 600, one ? 280 : 250, d.q, { size: 42, weight: 700, anchor: 'middle', lh: 54 });
    const think = G(g); tr(think, 600, 528);
    const rg = ring(think, 54, Y);
    const num = T(think, 0, 16, '4', { size: 46, weight: 700, anchor: 'middle' });
    T(think, 0, 102, 'think…', { size: 28, weight: 600, fill: C.muted, anchor: 'middle' });
    const ans = G(g);
    const pic = G(ans); tr(pic, 300, 556);
    const anim = d.pic(pic) || (() => {});
    const tk = tick(ans, 12, C.good); tr(tk, 470, 450);
    T(ans, 492, 461, 'Answer', { size: 26, weight: 700, fill: C.good });
    const size = d.small ? 36 : 40, lh = d.small ? 46 : 52, y0 = d.small ? 514 : 526;
    d.a.forEach((line, k) => rich(ans, 464, y0 + k * lh, line, { size, weight: 700 }));
    return { g, qc, think, rg, num, ans, anim, k: i + 1 };
  });

  /* ---------- outro ---------- */
  const outro = G(root);
  const burst = G(outro);
  const flyers = [];
  const br = rng(23);
  for (let k = 0; k < 16; k++) {
    const isLeaf = k % 2 === 1;
    let el;
    if (isLeaf) { el = G(burst); const inner = G(el); tr(inner, -26, 0, 0.26); E('path', { d: LEAF_D, fill: ball(C.plant, C.plantDk), stroke: C.plantDk, 'stroke-width': 4 }, inner); }
    else { el = spark(burst, 12 + br() * 9, { seed: k }); }
    flyers.push({ el, isLeaf, a: (k / 16) * TAU + br() * 0.3, d: 210 + br() * 120, dl: br() * 0.45, spin: (br() - 0.5) * 400 });
  }
  T(outro, 600, 330, 'Brilliant work!', { size: 80, weight: 700, anchor: 'middle' });
  rich(outro, 600, 404, ['Now try the ', ['Photosynthesis quiz', Y, 800], ' in your Science Lab'], { size: 32, anchor: 'middle', fill: C.muted });
  const labChip = chip(outro, 'Science Lab  ›  Photosynthesis  ›  Quiz', { size: 26, fill: C.card2, stroke: C.line, sw: 2 });
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

    // outro: sparks and leaves burst out, then settle and drift
    const oa = P(t, at('outro') - 0.15, 0.5, linear);
    op(outro, oa);
    if (oa > 0) {
      const t0 = at('outro');
      flyers.forEach(o => {
        const u = clamp((t - t0 - o.dl) / 2.4);
        const d = easeOut(u) * o.d;
        const x = 600 + Math.cos(o.a) * d * 1.5, y = 300 + Math.sin(o.a) * d * 0.85 + (o.isLeaf ? 40 * u * u : 0);
        const s = o.isLeaf ? 0.6 + 0.6 * Math.min(1, u * 3) : 0.4 + 0.8 * Math.sin(Math.min(1, u * 1.2) * Math.PI);
        tr(o.el, x, y, Math.max(0.01, s), o.isLeaf ? o.a * 57.3 + o.spin * easeOut(u) : 0);
        op(o.el, u > 0 ? Math.sin(Math.min(1, u) * Math.PI) * 0.95 : 0);
        if (!o.isLeaf) o.el.upd(t);
      });
      op(labChip, P(t, mid('outro', 0.5), 0.5, linear));
    }
  };
});
