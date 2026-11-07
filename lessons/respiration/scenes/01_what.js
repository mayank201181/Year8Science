/* Chapter 1: Respiration is not breathing.
   Beats: breathing vs respiration panels -> every living cell -> no lungs needed (fish, tree)
   -> "releases", not "makes"/"creates" -> energy transferred out of glucose -> where glucose comes from. */
scene('what', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;

  /* ---------- local art ---------- */
  function skinIcon(p) {
    const rows = [[-60, -34, 6, 22, '#F7C7B0'], [-60, -8, 5, 24, '#F2B49B'], [-60, 20, 5, 26, '#E89F86']];
    E('rect', { x: -72, y: -48, width: 144, height: 100, rx: 16, fill: 'rgba(242,180,155,0.12)' }, p);
    rows.forEach(([x0, y, n, h, f], r) => {
      const w = 120 / n;
      for (let i = 0; i < n + (r % 2); i++) {
        const x = x0 + i * w - (r % 2) * w / 2;
        const xx = Math.max(-66, x), ww = Math.min(x + w - 3, 66) - xx;
        if (ww > 8) E('rect', { x: xx, y, width: ww, height: h - 3, rx: 7, fill: f, stroke: '#B9735E', 'stroke-width': 2.5 }, p);
      }
    });
    E('path', { d: 'M-66,-36 Q-33,-46 0,-38 Q33,-30 66,-40', fill: 'none', stroke: '#FFE1D2', 'stroke-width': 4, 'stroke-linecap': 'round', opacity: 0.8 }, p);
  }
  function brainIcon(p) {
    const pts = []; for (let i = 0; i < 28; i++) { const a = i / 28 * TAU; const k = 1 + 0.06 * Math.sin(a * 9); pts.push([Math.cos(a) * 70 * k, Math.sin(a) * 52 * k - (Math.sin(a) > 0 ? -Math.sin(a) * 6 : 0)]); }
    E('path', { d: closedPath(pts), fill: ball('#F4A6C0', '#C25A88'), stroke: '#FFD3E2', 'stroke-width': 3 }, p);
    E('path', { d: 'M0,-50 Q-8,-20 4,0 Q14,24 0,50', fill: 'none', stroke: '#B04A78', 'stroke-width': 4, 'stroke-linecap': 'round' }, p);
    ['M-50,-18 q12,-14 24,0 q12,14 22,-2', 'M-56,12 q14,-12 26,2 q12,14 22,0', 'M16,-26 q12,-12 24,2 q10,12 22,-4', 'M14,10 q14,-12 26,2 q12,14 24,0', 'M-34,34 q10,-8 20,2', 'M22,36 q10,-8 20,2']
      .forEach(d => E('path', { d, fill: 'none', stroke: '#B04A78', 'stroke-width': 3.5, 'stroke-linecap': 'round', opacity: 0.85 }, p));
  }
  function muscleIcon(p) {
    E('path', { d: 'M-80,0 C-50,-44 50,-44 80,0 C50,44 -50,44 -80,0 Z', fill: ball('#F0606E', '#A82634'), stroke: '#FFB3BB', 'stroke-width': 3 }, p);
    for (let i = -6; i <= 6; i++) { const x = i * 9, hh = 34 * Math.sqrt(Math.max(0, 1 - (x / 78) * (x / 78))); E('line', { x1: x, y1: -hh + 4, x2: x, y2: hh - 4, stroke: '#FFC6CC', 'stroke-width': 2.5, opacity: 0.55 }, p); }
    E('path', { d: 'M-80,0 L-96,0 M80,0 L96,0', stroke: '#F4EDE4', 'stroke-width': 8, 'stroke-linecap': 'round' }, p);
  }
  function plantIcon(p) {
    E('rect', { x: -70, y: -50, width: 140, height: 100, rx: 14, fill: 'rgba(91,210,122,0.14)', stroke: C.plant, 'stroke-width': 8 }, p);
    E('rect', { x: -40, y: -30, width: 82, height: 58, rx: 18, fill: 'rgba(159,216,255,0.32)', stroke: '#9FD8FF', 'stroke-width': 2.5 }, p);
    E('circle', { cx: -48, cy: 26, r: 12, fill: 'rgba(150,120,220,0.5)', stroke: '#B79CF0', 'stroke-width': 2.5 }, p);
    [[-52, -30, 20], [52, -30, -15], [56, 22, 25], [8, 38, 0], [-20, -40, 5]].forEach(([x, y, r]) => tr(chloroplast(p, 26, 14), x, y, 1, r));
  }
  function bactIcon(p) {
    const fl = E('path', { fill: 'none', stroke: '#7FE0CB', 'stroke-width': 4, 'stroke-linecap': 'round' }, p);
    E('rect', { x: -62, y: -26, width: 124, height: 52, rx: 26, fill: ball('#57C7B0', '#22806E'), stroke: '#A8F0E0', 'stroke-width': 3 }, p);
    E('path', { d: 'M-34,0 q10,-14 20,0 q10,14 20,0 q10,-14 20,0', fill: 'none', stroke: '#0E4F44', 'stroke-width': 4, 'stroke-linecap': 'round' }, p);
    return t => { const pts = []; for (let k = 0; k <= 10; k++) pts.push([62 + k * 5.5, Math.sin(k * 0.9 - t * 7) * 7 * (k / 10 + 0.2)]); fl.setAttribute('d', openPath(pts)); };
  }
  function goldfish(p) {
    const tail = G(p);
    E('path', { d: 'M-92,0 C-120,-30 -150,-62 -168,-56 C-156,-20 -156,20 -168,56 C-150,62 -120,30 -92,0 Z', fill: ball('#FFB062', '#D2651C'), stroke: '#FFD2A0', 'stroke-width': 3 }, tail);
    E('path', { d: 'M-30,-56 C-10,-92 30,-90 44,-58 Z', fill: '#F58A35', stroke: '#FFD2A0', 'stroke-width': 3 }, p);
    E('ellipse', { rx: 104, ry: 62, fill: ball('#FFA24A', '#D2651C'), stroke: '#FFD2A0', 'stroke-width': 3 }, p);
    E('path', { d: 'M-10,40 C0,70 30,74 34,52', fill: '#F58A35', stroke: '#FFD2A0', 'stroke-width': 3 }, p);
    E('path', { d: 'M40,-40 Q22,0 40,40 M26,-34 Q10,0 26,34', fill: 'none', stroke: '#B4500F', 'stroke-width': 5, 'stroke-linecap': 'round' }, p);
    E('circle', { cx: 64, cy: -14, r: 13, fill: '#FFFFFF' }, p);
    E('circle', { cx: 68, cy: -14, r: 7, fill: '#1B2430' }, p);
    E('path', { d: 'M100,10 q-8,6 -14,2', fill: 'none', stroke: '#8E3A0C', 'stroke-width': 3.5, 'stroke-linecap': 'round' }, p);
    return tail;
  }
  function tree(p) {
    E('ellipse', { cx: 0, cy: 150, rx: 130, ry: 15, fill: C.soil, opacity: 0.9 }, p);
    E('path', { d: 'M-10,150 Q-30,160 -56,166 M10,150 Q32,162 60,164 M0,150 L0,168', stroke: '#7A5236', 'stroke-width': 7, 'stroke-linecap': 'round', fill: 'none' }, p);
    E('path', { d: 'M-22,152 L-13,10 L13,10 L22,152 Z', fill: ball('#9C6B45', '#5E3C22'), stroke: '#C49470', 'stroke-width': 2.5 }, p);
    E('path', { d: 'M-6,40 L-42,-6 M6,60 L40,18', stroke: '#7A5236', 'stroke-width': 9, 'stroke-linecap': 'round' }, p);
    [[-66, -40, 66], [64, -38, 66], [0, -84, 82], [-30, -2, 54], [34, 0, 54]].forEach(([x, y, r]) => E('circle', { cx: x, cy: y, r, fill: ball(C.plant, C.plantDk), stroke: '#9EF0B4', 'stroke-width': 2.5 }, p));
  }
  function plate(p) {
    E('ellipse', { cx: 0, cy: 10, rx: 92, ry: 30, fill: '#E9EEF2', stroke: '#B7C4CE', 'stroke-width': 3 }, p);
    E('ellipse', { cx: 0, cy: 6, rx: 66, ry: 18, fill: '#F7FAFC' }, p);
    E('path', { d: 'M-56,4 C-50,-36 -6,-38 0,2 Z', fill: '#FFF8E6', stroke: '#E2D3AE', 'stroke-width': 2.5 }, p);
    [[18, -6, 13, '#5BD27A'], [38, -2, 11, '#3FA463'], [28, -18, 10, '#FF8A3D'], [48, -14, 9, '#5BD27A'], [8, -16, 8, '#FFC247']]
      .forEach(([x, y, r, f]) => E('circle', { cx: x, cy: y, r, fill: f, stroke: 'rgba(0,0,0,0.2)', 'stroke-width': 1.5 }, p));
  }
  function leaf(p) {
    E('path', { d: 'M-70,30 C-60,-40 20,-70 80,-50 C70,10 10,60 -70,30 Z', fill: ball(C.plant, C.plantDk), stroke: '#9EF0B4', 'stroke-width': 3 }, p);
    E('path', { d: 'M-70,30 C-20,0 30,-30 80,-50 M-30,8 L-24,-26 M0,-8 L10,-40 M26,-24 L40,-48 M-20,4 L-4,26 M10,-14 L30,12', fill: 'none', stroke: '#22844A', 'stroke-width': 3.5, 'stroke-linecap': 'round' }, p);
    E('path', { d: 'M-70,30 L-96,52', stroke: '#3FA463', 'stroke-width': 6, 'stroke-linecap': 'round' }, p);
  }
  function sun(p) {
    const rays = G(p);
    for (let i = 0; i < 10; i++) { const a = i / 10 * TAU; E('line', { x1: Math.cos(a) * 44, y1: Math.sin(a) * 44, x2: Math.cos(a) * 62, y2: Math.sin(a) * 62, stroke: C.energy, 'stroke-width': 6, 'stroke-linecap': 'round' }, rays); }
    E('circle', { r: 64, fill: glow(C.energy), opacity: 0.7 }, p);
    E('circle', { r: 34, fill: ball('#FFE45C', '#F2A900'), stroke: C.energyLt, 'stroke-width': 3 }, p);
    return rays;
  }
  /* a small "living cell" marker: a glowing dot with a twinkling spark */
  function lifeDot(p, x, y, seed) {
    const g = G(p); tr(g, x, y);
    E('circle', { r: 30, fill: glow(C.energy) }, g);
    E('circle', { r: 12, fill: 'rgba(255,228,92,0.25)', stroke: C.energy, 'stroke-width': 3 }, g);
    const sp = spark(g, 9, { seed }); tr(sp, 14, -14);
    return { g, sp };
  }

  /* ===== beat 1-3: breathing vs respiration ===== */
  const ph1 = G(root);
  const left = G(ph1), right = G(ph1);
  card(left, 50, 118, 500, 580, { fill: C.card, stroke: C.line });
  card(right, 650, 118, 500, 580, { fill: C.card, stroke: C.line });

  T(left, 300, 180, 'Breathing', { size: 46, weight: 700, anchor: 'middle' });
  const vent = T(left, 300, 224, '= ventilation', { size: 30, weight: 600, anchor: 'middle', fill: C.air });
  const ribs = [];
  for (let i = 0; i < 4; i++) {
    const y = 380 + i * 44;
    for (const sg of [-1, 1]) ribs.push({ el: E('path', { d: `M${300 + sg * 22},${y} Q${300 + sg * 152},${y - 20} ${300 + sg * 160},${y + 34}`, fill: 'none', stroke: '#E9DFC9', 'stroke-width': 7, 'stroke-linecap': 'round', opacity: 0.6 }, left), sg, y });
  }
  const lg = lungs(left, 0.8); tr(lg, 300, 448);
  const diaphragm = E('path', { fill: 'none', stroke: '#F08FAB', 'stroke-width': 10, 'stroke-linecap': 'round' }, left);
  const airIn = arrow(left, 300, 250, 300, 314, { color: C.air, width: 7 });
  const airOut = arrow(left, 300, 314, 300, 250, { color: C.air, width: 7 });
  const airLbl = T(left, 326, 290, 'air', { size: 28, weight: 600, fill: C.air });
  const phys = T(left, 300, 664, 'physical: muscles, ribs, diaphragm', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });

  T(right, 900, 180, 'Respiration', { size: 46, weight: 700, anchor: 'middle' });
  const chem = T(right, 900, 224, 'a chemical reaction in cells', { size: 28, weight: 600, anchor: 'middle', fill: C.energy });
  const rcell = animalCell(right, 168, 138, { sw: 5, seed: 8 }); tr(rcell, 900, 450);
  const rmito = mitochondrion(rcell.inner, 124, 56, { glow: true }); tr(rmito, 34, 28, 1, -12);
  const relabel = T(right, 900, 664, 'releases energy from glucose', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  const flow = G(right), pops = G(right), fr = rng(31), feed = [];
  for (let k = 0; k < 20; k++) {
    const g = k % 2 === 0 ? molGlucose(flow, 19) : molO2(flow, 11);
    feed.push({ g, sp: spark(pops, 12, { seed: k }), t0: 1.6 + k * 1.02, a: fr() * TAU, a2: fr() * TAU, d2: 110 + fr() * 50 });
  }
  const target = [934, 478];

  const neq = G(ph1);
  E('path', { d: 'M572,392 L628,392 M572,428 L628,428 M588,456 L612,364', fill: 'none', stroke: C.energy, 'stroke-width': 9, 'stroke-linecap': 'round' }, neq);

  /* ===== beat 4: every living cell ===== */
  const ph2 = G(root);
  T(ph2, 600, 178, 'In **every** living cell, all the time', { size: 46, weight: 600, anchor: 'middle', boldFill: C.energy });
  const ICONS = [['skin', skinIcon], ['brain', brainIcon], ['muscle', muscleIcon], ['plant cell', plantIcon], ['bacterium', bactIcon]];
  const icons = ICONS.map(([label, fn], i) => {
    const g = G(ph2), x = 150 + i * 225, y = 400;
    const halo = E('circle', { r: 108, fill: glow(C.energy) }, g);
    const art = G(g); const upd = fn(art);
    T(g, 0, 130, label, { size: 30, weight: 600, anchor: 'middle' });
    const sp = spark(g, 18, { seed: i * 3 + 1 }); tr(sp, 70, -64);
    return { g, halo, sp, upd, x, y };
  });
  const iconAt = [0.44, 0.54, 0.65, 0.77, 0.88];

  /* ===== beat 5: no lungs needed ===== */
  const ph3 = G(root);
  T(ph3, 600, 170, 'No lungs needed', { size: 48, weight: 700, anchor: 'middle' });
  const noL = G(ph3); tr(noL, 600, 262);
  tr(lungs(noL, 0.36), 0, 0); tr(cross(noL, 40), 0, 0);
  const fishG = G(ph3), fishInner = G(fishG);
  const fishTail = goldfish(fishInner);
  const fishBub = bubbles(fishG, 96, -170, 40, 150, { n: 6, r: 7, speed: 0.4, seed: 5 });
  T(fishG, 0, 175, 'goldfish', { size: 30, weight: 600, anchor: 'middle' });
  const gillLbl = G(fishG);
  T(gillLbl, -4, -118, 'gills', { size: 28, weight: 600, fill: '#FFC27A', anchor: 'middle' });
  E('line', { x1: 6, y1: -108, x2: 30, y2: -46, stroke: '#FFC27A', 'stroke-width': 3, 'stroke-linecap': 'round' }, gillLbl);
  const treeG = G(ph3); tree(treeG);
  T(treeG, 0, 215, 'a tree: no lungs at all', { size: 30, weight: 600, anchor: 'middle' });
  const fishDots = [[-46, 6], [14, 22], [-8, -30]].map(([x, y], i) => lifeDot(fishInner, x, y, i));
  const treeDots = [[-56, -40], [40, -70], [0, 70], [-40, 158]].map(([x, y], i) => lifeDot(treeG, x, y, i + 5));
  const FISH = [330, 455], TREE = [880, 440];

  /* ===== beat 6: releases, not makes / creates ===== */
  const ph4 = G(root);
  const relG = G(ph4);
  const relW = textWidth('releases', 92, FD, 700);
  T(relG, -24, 0, 'releases', { size: 92, weight: 700, anchor: 'middle', fill: C.energy });
  const relTick = tick(relG, 30); tr(relTick, relW / 2 + 28, -30);
  const mk = G(ph4), cr = G(ph4);
  T(mk, 0, 0, 'makes', { size: 66, weight: 600, anchor: 'middle', fill: C.ink });
  T(cr, 0, 0, 'creates', { size: 66, weight: 600, anchor: 'middle', fill: C.ink });
  const mkW = textWidth('makes', 66, FD, 600), crW = textWidth('creates', 66, FD, 600);
  const mkS = strike(mk, -mkW / 2 - 12, -22, mkW / 2 + 12), crS = strike(cr, -crW / 2 - 12, -22, crW / 2 + 12);
  const mkX = cross(mk, 18); tr(mkX, mkW / 2 + 40, -24);
  const crX = cross(cr, 18); tr(crX, crW / 2 + 40, -24);
  const note = T(ph4, 600, 590, "energy can't be created", { size: 38, weight: 600, anchor: 'middle', fill: C.muted });
  const rightWord = T(ph4, 600, 170, 'Use the right word', { size: 40, weight: 600, anchor: 'middle', fill: C.muted });

  /* ===== beat 7: transferred ===== */
  const ph5 = G(root);
  const bat = glucoseBattery(ph5, 108); tr(bat, 300, 400);
  T(ph5, 300, 580, 'chemical energy', { size: 32, weight: 600, anchor: 'middle', fill: C.glucoseLt });
  T(ph5, 300, 616, 'stored in glucose', { size: 26, weight: 500, anchor: 'middle', fill: C.muted });
  const big = arrow(ph5, 440, 400, 700, 400, { color: C.energy, width: 10 });
  const transLbl = T(ph5, 570, 366, 'transferred', { size: 32, weight: 700, anchor: 'middle', fill: C.energy });
  const useG = G(ph5);
  const uses = [[800, 'move'], [920, 'warm'], [1040, 'build']].map(([x, kind]) => {
    const g = G(useG); tr(g, x, 400);
    E('circle', { r: 50, fill: C.card2, stroke: C.line, 'stroke-width': 2.5 }, g);
    if (kind === 'move') bolt(g, 0.62);
    else if (kind === 'warm') { const h = heatWaves(g, { n: 3, h: 56, spacing: 18, width: 5 }); tr(h, 0, 26); g.heat = h; }
    else for (let i = 0; i < 4; i++) E('circle', { cx: -27 + i * 18, cy: Math.sin(i * 1.4) * 8, r: 9, fill: ['#5BD27A', '#4CC9F0', '#B48CFF', '#FF8A3D'][i], stroke: '#fff', 'stroke-width': 2 }, g);
    return g;
  });
  T(ph5, 920, 580, 'energy the cell can use', { size: 32, weight: 600, anchor: 'middle' });
  const tr2 = G(ph5), trSparks = [], tr_r = rng(77);
  for (let k = 0; k < 12; k++) trSparks.push({ sp: spark(tr2, 11, { seed: k }), ph: k / 12, dy: (tr_r() - 0.5) * 60, to: k % 3 });

  /* ===== beat 8: where glucose comes from ===== */
  const ph6 = G(root);
  const glu = molGlucose(ph6, 58); tr(glu, 910, 405);
  T(ph6, 910, 500, 'glucose', { size: 34, weight: 600, anchor: 'middle', fill: C.glucoseLt });
  const qm = T(ph6, 996, 362, '?', { size: 72, weight: 700, fill: C.energy });
  const r1 = G(ph6), r2 = G(ph6);
  T(r1, 210, 168, 'Animals', { size: 30, weight: 600, anchor: 'middle', fill: C.muted });
  const plt = G(r1); plate(plt); tr(plt, 210, 236);
  const a1 = arrow(r1, 320, 236, 830, 372, { color: C.glucose, width: 7, bend: -60 });
  T(r1, 570, 236, 'digesting food', { size: 32, weight: 700, anchor: 'middle', fill: C.ink });
  T(r2, 210, 660, 'Plants', { size: 30, weight: 600, anchor: 'middle', fill: C.muted });
  const sunG = G(r2); const sunRays = sun(sunG); tr(sunG, 130, 520, 0.78);
  const lf = G(r2); leaf(lf); tr(lf, 230, 580, 0.9);
  const a2 = arrow(r2, 330, 570, 830, 440, { color: C.plant, width: 7, bend: 60 });
  T(r2, 575, 600, 'photosynthesis', { size: 32, weight: 700, anchor: 'middle', fill: C.ink });

  return t => {
    /* --- phase 1 --- */
    const f1 = 1 - P(t, at('every') - 0.25, 0.5, linear);
    op(ph1, f1);
    if (f1 > 0) {
      const sl = P(t, S.first - 0.5, 0.9, easeOut);
      const dimL = P(t, at('resp') - 0.2, 0.5), dimR = P(t, at('breathing') - 0.2, 0.5) - dimL;
      op(left, 1 - 0.6 * dimL); op(right, 1 - 0.6 * dimR);
      left.setAttribute('transform', `translate(${(-(1 - sl) * 40).toFixed(1)} 0)`);
      right.setAttribute('transform', `translate(${((1 - sl) * 40).toFixed(1)} 0)`);
      const ph = (t / 3.6) % 1, b = wave(t, 3.6) * AMP, s = Math.sin(ph * TAU);
      lg.set(b);
      ribs.forEach(r => r.el.setAttribute('transform', `rotate(${(-r.sg * 7 * b).toFixed(2)} ${300 + r.sg * 22} ${r.y})`));
      diaphragm.setAttribute('d', `M150,592 Q300,${(540 + 38 * b).toFixed(1)} 450,592`);
      const showAir = P(t, at('breathing'), 0.5, linear);
      op(airIn, clamp(s * 2) * showAir); op(airOut, clamp(-s * 2) * showAir); op(airLbl, showAir);
      op(vent, P(t, mid('breathing', 0.18), 0.5, linear));
      op(phys, P(t, mid('breathing', 0.6), 0.5, linear));
      op(chem, P(t, mid('resp', 0.12), 0.5, linear));
      op(relabel, P(t, mid('resp', 0.62), 0.5, linear));
      const np = P(t, mid('notsame', 0.55), 0.5, pop);
      op(neq, clamp(np * 2)); neq.setAttribute('transform', `translate(600 410) scale(${(0.6 + 0.4 * np).toFixed(3)}) translate(-600 -410)`);
      rcell.upd(t); rmito.upd(t);
      feed.forEach(o => {
        const u = (t - o.t0) / 2.1;
        if (u <= 0 || u >= 1) op(o.g, 0);
        else {
          const p = ease(u), x0 = 900 + Math.cos(o.a) * 232, y0 = 450 + Math.sin(o.a) * 196;
          tr(o.g, lerp(x0, target[0], p), lerp(y0, target[1], p), 1 - 0.4 * p, u * 120);
          op(o.g, Math.min(1, u * 6, (1 - u) * 6));
        }
        const v = (t - o.t0 - 2.1) / 1.3;
        if (v <= 0 || v >= 1) op(o.sp, 0);
        else { const d = easeOut(v) * o.d2; tr(o.sp, target[0] + Math.cos(o.a2) * d, target[1] + Math.sin(o.a2) * d, 0.6 + 0.6 * Math.sin(v * Math.PI)); op(o.sp, Math.sin(v * Math.PI)); o.sp.upd(t); }
      });
    }

    /* --- phase 2: every living cell --- */
    const f2 = win(t, at('every') - 0.1, at('nolungs') + 0.1, 0.5);
    op(ph2, f2);
    if (f2 > 0) icons.forEach((o, i) => {
      const t0 = mid('every', iconAt[i]), d0 = mid('every', 0.08 + i * 0.035);
      const pin = P(t, d0, 0.5, easeOut), p = P(t, t0, 0.55, pop);
      op(o.g, 0.3 * pin + 0.7 * clamp(p * 2));
      tr(o.g, o.x, o.y + (1 - pin) * 24, 0.86 + 0.08 * pin + 0.06 * p);
      const l = P(t, t0 + 0.2, 0.4, linear);
      op(o.halo, l * (0.45 + 0.2 * wave(t, 1.6, i * 0.3)));
      op(o.sp, l); o.sp.upd(t + i);
      if (o.upd) o.upd(t);
    });

    /* --- phase 3: no lungs needed --- */
    const f3 = win(t, at('nolungs') - 0.1, at('released') + 0.1, 0.5);
    op(ph3, f3);
    if (f3 > 0) {
      const lp = P(t, at('nolungs') + 0.1, 0.5, pop);
      op(noL, clamp(lp * 2)); tr(noL, 600, 262, 0.7 + 0.3 * lp);
      const fp = P(t, mid('nolungs', 0.2), 0.7, easeOut);
      op(fishG, fp);
      tr(fishG, FISH[0] - (1 - fp) * 80, FISH[1] + Math.sin(t * 1.7) * 7 * AMP);
      fishTail.setAttribute('transform', `translate(-92 0) rotate(${(Math.sin(t * 5) * 9 * AMP).toFixed(2)}) translate(92 0)`);
      fishBub.upd(t);
      op(gillLbl, P(t, mid('nolungs', 0.3), 0.4, linear));
      const tp = P(t, mid('nolungs', 0.44), 0.7, pop);
      op(treeG, clamp(tp * 2)); tr(treeG, TREE[0], TREE[1] + (1 - clamp(tp)) * 30, 0.85 + 0.15 * tp);
      fishDots.concat(treeDots).forEach((d, i) => { op(d.g, P(t, mid('nolungs', 0.66 + i * 0.04), 0.4, linear)); d.sp.upd(t); });
    }

    /* --- phase 4: releases --- */
    const f4 = win(t, at('released') - 0.1, at('transfer') + 0.1, 0.5);
    op(ph4, f4);
    if (f4 > 0) {
      op(rightWord, P(t, at('released') + 0.05, 0.4, linear));
      const rp = P(t, mid('released', 0.2), 0.6, pop);
      op(relG, clamp(rp * 2)); tr(relG, 600, 300, 0.8 + 0.2 * rp);
      op(relTick, P(t, mid('released', 0.32), 0.3, linear));
      const m0 = mid('released', 0.47), c0 = mid('released', 0.57);
      op(mk, P(t, m0, 0.4, linear)); tr(mk, 400, 455);
      op(cr, P(t, c0, 0.4, linear)); tr(cr, 800, 455);
      mkS.set(P(t, m0 + 0.35, 0.35)); crS.set(P(t, c0 + 0.35, 0.35));
      op(mkX, P(t, m0 + 0.6, 0.3, linear)); op(crX, P(t, c0 + 0.6, 0.3, linear));
      op(note, P(t, mid('released', 0.74), 0.5, linear));
    }

    /* --- phase 5: transferred --- */
    const f5 = win(t, at('transfer') - 0.1, at('source') + 0.1, 0.5);
    op(ph5, f5);
    if (f5 > 0) {
      const s0 = mid('transfer', 0.22), s1 = end('transfer') + 0.4;
      bat.set(1 - 0.75 * P(t, s0, end('transfer') - s0, linear));
      big.set(P(t, at('transfer') + 0.2, 0.8));
      op(transLbl, P(t, mid('transfer', 0.35), 0.4, linear));
      uses.forEach((g, i) => { const p = P(t, s0 + 0.5 + i * 0.35, 0.5, pop); op(g, clamp(p * 2)); tr(g, 800 + i * 120, 400, 0.6 + 0.4 * p); if (g.heat) g.heat.upd(t); });
      trSparks.forEach(o => {
        const run = t > s0 && t < s1 ? ((t - s0) / 1.4 + o.ph) % 1 : -1;
        if (run < 0) { op(o.sp, 0); return; }
        const tx = 800 + o.to * 120, p = ease(run);
        tr(o.sp, lerp(360, tx, p), lerp(400 + o.dy, 400, p) - Math.sin(p * Math.PI) * 40, 0.8);
        op(o.sp, Math.min(1, run * 5, (1 - run) * 5)); o.sp.upd(t);
      });
    }

    /* --- phase 6: sources of glucose --- */
    const f6 = P(t, at('source') - 0.1, 0.5, linear);
    op(ph6, f6);
    if (f6 > 0) {
      const gp = P(t, at('source') + 0.05, 0.6, pop);
      tr(glu, 910, 405, 0.6 + 0.4 * gp, Math.sin(t * 0.8) * 6 * AMP);
      op(qm, P(t, at('source') + 0.3, 0.3, linear) * (1 - P(t, mid('source', 0.6), 0.5, linear)));
      const p1 = P(t, mid('source', 0.17), 0.5, linear), p2 = P(t, mid('source', 0.56), 0.5, linear);
      op(r1, p1); a1.set(P(t, mid('source', 0.22), 0.9));
      op(r2, p2); a2.set(P(t, mid('source', 0.62), 0.9));
      sunRays.setAttribute('transform', `rotate(${((t * 12) % 360).toFixed(1)})`);
    }
  };
});
