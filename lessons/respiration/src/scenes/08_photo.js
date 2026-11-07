/* Respiration vs photosynthesis vs breathing.
   Three muddled chips settle -> the two reactions as opposite arrows between the same boxes ->
   a plant that respires in every part, day and night (gas exchange flips at night) ->
   breathing is ventilation (lungs + diaphragm) -> the lungs-blood-cell loop -> mnemonic. */
scene('photo', S => {
  const { at, end, mid } = S, root = S.root;
  const idle = t => (S.reduce ? 0 : t);
  const scaleAt = (el, x, y, s) => el.setAttribute('transform', `translate(${x} ${y}) scale(${Math.max(0.001, s).toFixed(4)}) translate(${-x} ${-y})`);
  const estW = (s, size) => Math.max(textWidth(s, size, FD, 700), s.replace(/\*\*/g, '').length * size * 0.54);
  const pill = (parent, s, size, stroke, fill) => chip(parent, s, { size, fill: fill || C.card2, stroke, sw: 3, w: Math.ceil(estW(s, size) + size * 1.5) });
  // the same control point lib's arrow() uses for a bent arrow
  const ctrl = (x1, y1, x2, y2, bend) => { const L = Math.hypot(x2 - x1, y2 - y1) || 1; return [(x1 + x2) / 2 - (y2 - y1) / L * bend, (y1 + y2) / 2 + (x2 - x1) / L * bend]; };
  const qpt = (x1, y1, c, x2, y2, u) => [(1 - u) * (1 - u) * x1 + 2 * (1 - u) * u * c[0] + u * u * x2, (1 - u) * (1 - u) * y1 + 2 * (1 - u) * u * c[1] + u * u * y2];
  function sunIcon(parent, r) {
    const g = G(parent);
    E('circle', { r: r * 2.3, fill: glow('#FFD84A') }, g);
    const rays = G(g);
    for (let i = 0; i < 12; i++) { const a = i * TAU / 12; E('line', { x1: Math.cos(a) * r * 1.3, y1: Math.sin(a) * r * 1.3, x2: Math.cos(a) * r * 1.75, y2: Math.sin(a) * r * 1.75, stroke: '#FFD84A', 'stroke-width': r * 0.17, 'stroke-linecap': 'round' }, rays); }
    E('circle', { r, fill: ball('#FFE066', '#F2A81D'), stroke: '#FFF3B0', 'stroke-width': 2 }, g);
    g.upd = t => tr(rays, 0, 0, 1, (t * 14) % 360);
    return g;
  }
  // a row of fact pills centred on x=600; returns them, positioned
  function factRow(parent, items, y, size, stroke) {
    const ps = items.map(s => pill(parent, s, size, stroke));
    const gap = 16, total = ps.reduce((a, p) => a + p.w, 0) + gap * (ps.length - 1);
    let x = 600 - total / 2;
    ps.forEach(p => { p.cx = x + p.w / 2; p.cy = y; tr(p, p.cx, y); x += p.w + gap; });
    return ps;
  }
  const showPill = (p, t0, t, mul) => { const k = P(t, t0, 0.45, pop); op(p, clamp(k * 2) * (mul === undefined ? 1 : mul)); tr(p, p.cx, p.cy, Math.max(0.01, 0.6 + 0.4 * k)); };

  /* ================= 1. the equation diagram ================= */
  const eq = G(root);
  const BL = [230, 385], BR = [970, 385];
  const boxL = G(eq), boxR = G(eq);
  card(boxL, BL[0] - 165, BL[1] - 85, 330, 170, { fill: C.card, stroke: C.line });
  tr(molGlucose(boxL, 27), BL[0] - 72, BL[1] - 22);
  T(boxL, BL[0] - 16, BL[1] - 10, '+', { size: 36, weight: 700, anchor: 'middle', fill: C.muted });
  tr(molO2(boxL, 16), BL[0] + 48, BL[1] - 22);
  T(boxL, BL[0], BL[1] + 52, 'glucose + oxygen', { size: 28, weight: 600, anchor: 'middle' });
  card(boxR, BR[0] - 165, BR[1] - 85, 330, 170, { fill: C.card, stroke: C.line });
  tr(molCO2(boxR, 13), BR[0] - 66, BR[1] - 22);
  T(boxR, BR[0] - 10, BR[1] - 10, '+', { size: 36, weight: 700, anchor: 'middle', fill: C.muted });
  tr(molH2O(boxR, 16), BR[0] + 54, BR[1] - 26);
  const rtxt = 'carbon dioxide + water';
  T(boxR, BR[0], BR[1] + 52, rtxt, { size: Math.min(28, Math.floor(28 * 296 / estW(rtxt, 28))), weight: 600, anchor: 'middle' });
  const arrTop = arrow(eq, 405, 330, 795, 330, { color: C.energy, width: 7 });
  const arrBot = arrow(eq, 795, 440, 405, 440, { color: C.plant, width: 7 });
  const topParts = [0, 1, 2, 3].map(() => ({ a: molGlucose(eq, 10), b: molCO2(eq, 7) }));
  const botParts = [0, 1, 2, 3].map(() => ({ a: molCO2(eq, 7), b: molGlucose(eq, 10) }));
  const sparkTop = spark(eq, 20, { seed: 4 }); tr(sparkTop, 600, 330);
  const sunBot = sunIcon(eq, 21); tr(sunBot, 600, 440);
  const factsR = factRow(eq, ['releases energy', 'all living cells', 'all the time'], 182, 26, C.energy);
  const factsP = factRow(eq, ['stores energy from light', 'only green plant cells', 'only in the light'], 602, 26, C.plant);

  const chipsG = G(root);
  const CH3 = [['respiration', C.energy], ['photosynthesis', C.plant], ['breathing', '#F48FA6']].map(([s, col]) => pill(chipsG, s, 38, col));
  const SLOT = [[260, 375], [600, 375], [940, 375]];
  const TUMBLE = [[0.0, 1.3, 1.7], [2.1, 1.1, 1.4], [4.2, 1.5, 1.2]];
  const LABEL_AT = [[600, 266, 0.78], [600, 518, 0.78]];

  /* ================= 2. the plant: day and night ================= */
  const garden = G(root);
  const daySky = G(garden), nightSky = G(garden);
  E('rect', { x: 90, y: 105, width: 1020, height: 460, rx: 26, fill: linGrad('#6FC0EE', '#CDEEFF', true) }, daySky);
  const sunDay = sunIcon(daySky, 38);
  E('rect', { x: 90, y: 105, width: 1020, height: 460, rx: 26, fill: linGrad('#081232', '#1B2A55', true) }, nightSky);
  const stars = [], sr = rng(31);
  for (let i = 0; i < 22; i++) {
    const x = 120 + sr() * 960, y = 125 + sr() * 300, s = 3 + sr() * 4;
    stars.push({ el: E('path', { d: `M${x},${y - s * 2} L${x + s * 0.5},${y - s * 0.5} L${x + s * 2},${y} L${x + s * 0.5},${y + s * 0.5} L${x},${y + s * 2} L${x - s * 0.5},${y + s * 0.5} L${x - s * 2},${y} L${x - s * 0.5},${y - s * 0.5} Z`, fill: '#EAF2FF' }, nightSky), ph: sr() });
  }
  const moon = G(nightSky);
  E('circle', { r: 80, fill: glow('#BFD3FF') }, moon);
  E('path', { d: 'M0,-36 A36,36 0 1 0 0,36 A24,36 0 0 1 0,-36 Z', fill: '#F3F0D8', stroke: '#FFFBE6', 'stroke-width': 2 }, moon);
  E('path', { d: 'M90,540 H1110 V614 Q1110,640 1084,640 H116 Q90,640 90,614 Z', fill: linGrad('#7A5538', '#4A3120', true) }, garden);
  const plant = G(garden);
  ['M600,548 C598,575 585,595 558,612', 'M600,548 C603,580 620,598 650,610', 'M600,552 C600,585 598,605 600,630', 'M588,590 C575,598 565,601 546,598', 'M612,592 C626,602 641,604 656,600']
    .forEach(d => E('path', { d, fill: 'none', stroke: '#EAD7B7', 'stroke-width': 6, 'stroke-linecap': 'round' }, plant));
  E('path', { d: 'M600,550 C596,480 606,400 600,320 C597,290 600,270 600,252', fill: 'none', stroke: C.stem, 'stroke-width': 14, 'stroke-linecap': 'round' }, plant);
  const leaf = (x, y, ang, len) => {
    const lg = G(plant);
    E('path', { d: `M0,0 C${len * 0.3},${-len * 0.34} ${len * 0.75},${-len * 0.3} ${len},0 C${len * 0.75},${len * 0.3} ${len * 0.3},${len * 0.34} 0,0 Z`, fill: ball(C.plant, C.plantDk), stroke: C.plantDk, 'stroke-width': 3 }, lg);
    E('path', { d: `M6,0 L${len * 0.88},0`, stroke: C.plantDk, 'stroke-width': 3, opacity: 0.75 }, lg);
    lg.setAttribute('transform', `translate(${x} ${y}) rotate(${ang})`);
    return lg;
  };
  leaf(598, 455, 200, 140); leaf(602, 445, -20, 135); leaf(600, 362, 210, 112); leaf(600, 352, -30, 112);
  const flower = G(plant); tr(flower, 600, 236);
  for (let i = 0; i < 6; i++) E('ellipse', { cx: 0, cy: -24, rx: 15, ry: 24, fill: ball('#FF9EC7', '#D45A8E'), transform: `rotate(${i * 60})` }, flower);
  E('circle', { r: 16, fill: ball('#FFD84A', '#E0A21C') }, flower);
  const plantSparks = [[568, 600], [640, 606], [600, 624], [600, 500], [603, 410], [520, 428], [690, 418], [540, 334], [662, 322], [622, 212]]
    .map(([x, y], k) => ({ s: spark(garden, 10, { seed: k * 2 + 1 }), x, y, k }));
  const partLabels = [
    ['roots', 676, 612, 'start', [672, 604, 652, 606]],
    ['stems', 622, 512, 'start', null],
    ['flowers', 688, 228, 'start', [684, 220, 644, 230]],
    ['leaves', 452, 300, 'end', [458, 293, 505, 306]],
  ].map(([s, x, y, anchor, ln]) => {
    const g = G(garden);
    if (ln) E('line', { x1: ln[0], y1: ln[1], x2: ln[2], y2: ln[3], stroke: C.ink, 'stroke-width': 3, 'stroke-linecap': 'round' }, g);
    T(g, x, y, s, { size: 30, weight: 700, anchor });
    return g;
  });
  const both1 = pill(garden, 'photosynthesis', 30, C.plant); tr(both1, 300, 300);
  const both2 = pill(garden, 'respiration', 30, C.energy); tr(both2, 900, 300);
  const bannerS = 'Plants respire **all the time**: day and night';
  const banner = G(garden);
  const bw = estW(bannerS, 34) + 60;
  E('rect', { x: 600 - bw / 2, y: 122, width: bw, height: 62, rx: 31, fill: C.card2, stroke: C.energy, 'stroke-width': 3 }, banner);
  T(banner, 600, 164, bannerS, { size: 34, weight: 600, anchor: 'middle', boldFill: C.energy });
  // how fast each process runs
  const rates = G(garden);
  card(rates, 118, 126, 360, 160, { fill: 'rgba(14,36,49,0.94)', stroke: C.line });
  T(rates, 138, 166, 'photosynthesis', { size: 26, weight: 600 });
  const mP = meter(rates, { w: 320, h: 24, color: C.plant }); tr(mP, 138, 178);
  T(rates, 138, 240, 'respiration', { size: 26, weight: 600 });
  const mR = meter(rates, { w: 320, h: 24, color: C.energy }); tr(mR, 138, 252);
  const stopTxt = T(rates, 458, 166, 'stops', { size: 26, weight: 700, fill: C.bad, anchor: 'end' });
  // gas exchange: in from the left, out to the right
  function flow(x1, y1, x2, y2, color, mk, label, labelX, stroke) {
    const g = G(garden);
    const a = arrow(g, x1, y1, x2, y2, { color, width: 8, bend: -28 });
    const c = ctrl(x1, y1, x2, y2, -28);
    const mols = [0, 1, 2].map(() => mk(g));
    const lab = pill(g, label, 28, stroke || color, C.card); tr(lab, labelX, 482);
    return { g, a, c, mols, x1, y1, x2, y2 };
  }
  const dayIn = flow(150, 398, 448, 428, '#46586A', g => molCO2(g, 11), 'carbon dioxide in', 290, C.co2);
  const dayOut = flow(752, 404, 1050, 432, C.oxygenDk, g => molO2(g, 12), 'oxygen out', 905, C.oxygen);
  const nightIn = flow(150, 398, 448, 428, C.oxygen, g => molO2(g, 12), 'oxygen in', 290);
  const nightOut = flow(752, 404, 1050, 432, C.co2, g => molCO2(g, 11), 'carbon dioxide out', 905);
  const sumDay = pill(garden, 'In bright light: carbon dioxide in, oxygen out', 28, C.plant); tr(sumDay, 600, 690);
  const sumNight = pill(garden, 'At night: oxygen in, carbon dioxide out', 28, C.energy); tr(sumNight, 600, 690);

  /* ================= 3. breathing (ventilation) ================= */
  const lungG = G(root);
  const lungIn = G(lungG);
  const lu = lungs(lungIn, 1);
  const dia = E('path', { fill: 'none', stroke: '#C2456A', 'stroke-width': 12, 'stroke-linecap': 'round' }, lungIn);
  const diaLab = T(lungIn, 168, 222, 'diaphragm', { size: 26, weight: 600, fill: C.muted });
  const airIn = arrow(lungIn, 0, -282, 0, -186, { color: C.air, width: 7 });
  const airOut = arrow(lungIn, 0, -186, 0, -282, { color: C.air, width: 7 });
  const airLab = T(lungIn, 24, -224, 'air', { size: 28, weight: 700, fill: C.air });
  const breG = G(lungG);
  const br1 = pill(breG, 'breathing = ventilation', 32, '#F48FA6'); tr(br1, 858, 262);
  const br2 = pill(breG, 'muscles move air in and out', 30, C.air); tr(br2, 858, 362);
  const br3 = G(breG);
  const br3p = pill(br3, 'not a chemical reaction', 30, C.bad); tr(br3p, 880, 462);
  const br3x = cross(br3, 16); tr(br3x, 880 - br3p.w / 2 - 34, 462);
  const brList = [[br1, 858, 262], [br2, 858, 362], [br3, 0, 0]];

  /* ================= 4. the link: lungs -> blood -> cells ================= */
  const linkG = G(root);
  const CX = 935, CY = 390;
  const cell = animalCell(linkG, 140, 115, { sw: 5, seed: 8 }); tr(cell, CX, CY);
  const mito = mitochondrion(linkG, 110, 50, { glow: true }); tr(mito, CX + 50, CY + 30, 1, -14);
  const cellSpark = spark(linkG, 16, { seed: 9 }); tr(cellSpark, CX + 50, CY + 30);
  const TOPP = [330, 330, 790, 330], BOTP = [790, 452, 330, 452];
  const aTop = arrow(linkG, TOPP[0], TOPP[1], TOPP[2], TOPP[3], { color: C.oxygen, width: 7, bend: -150 });
  const aBot = arrow(linkG, BOTP[0], BOTP[1], BOTP[2], BOTP[3], { color: C.co2, width: 7, bend: -150 });
  const cTop = ctrl(...TOPP, -150), cBot = ctrl(...BOTP, -150);
  const o2s = [0, 1, 2, 3].map(() => molO2(linkG, 12)), co2s = [0, 1, 2, 3].map(() => molCO2(linkG, 11));
  const lbO2 = T(linkG, 560, 198, 'oxygen', { size: 30, weight: 700, fill: C.oxygen, anchor: 'middle' });
  const lbCO2 = T(linkG, 560, 584, 'carbon dioxide', { size: 30, weight: 700, fill: C.co2, anchor: 'middle' });
  const chBreath = pill(linkG, 'breathing', 28, '#F48FA6'); tr(chBreath, 230, 545);
  const chResp = pill(linkG, 'respiration', 28, C.energy); tr(chResp, CX, 565);
  const linkBanner = pill(linkG, 'Linked, but not the same', 34, C.energy); tr(linkBanner, 600, 680);

  /* ================= 5. mnemonic ================= */
  const memo = G(root);
  E('rect', { x: 230, y: 245, width: 740, height: 260, rx: 30, fill: 'rgba(20,54,70,0.96)', stroke: C.energy, 'stroke-width': 4 }, memo);
  const m1 = T(memo, 600, 355, '**C**ells **R**espire,', { size: 76, weight: 700, anchor: 'middle', boldFill: C.energy });
  const m2 = T(memo, 600, 455, '**L**ungs **V**entilate', { size: 76, weight: 700, anchor: 'middle', boldFill: C.energy });

  return t => {
    const tt = idle(t);
    /* ---- part 1 ---- */
    const p1 = 1 - P(t, at('both') - 0.25, 0.5, linear);
    op(eq, p1); op(chipsG, p1);
    if (p1 > 0) {
      const d0 = mid('opposite', 0.1);              // chips glide to the arrows
      CH3.forEach((c, i) => {
        const [ph, fx, fy] = TUMBLE[i];
        const mx = 600 + 210 * Math.sin(tt * fx * 0.9 + ph), my = 385 + 95 * Math.cos(tt * fy * 0.9 + ph * 1.3), mr = 24 * Math.sin(tt * 1.6 + ph);
        const settle = P(t, mid('three', [0.48, 0.64, 0.84][i]), 0.75);
        let x = lerp(mx, SLOT[i][0], settle), y = lerp(my, SLOT[i][1], settle), r = mr * (1 - settle), s = 1;
        // photosynthesis drops first so respiration can pass above it
        if (i < 2) { const g2 = P(t, d0 + (i ? 0 : 0.22), 0.8); x = lerp(x, LABEL_AT[i][0], g2); y = lerp(y, LABEL_AT[i][1], g2); s = lerp(1, LABEL_AT[i][2], g2); }
        let a = P(t, at('three') + i * 0.2, 0.4, linear);
        if (i === 2) { const gone = P(t, at('opposite'), 0.45, linear); a *= 1 - gone; s = 1 - 0.4 * gone; }
        op(c, a); tr(c, x, y, s, r);
      });
      const boxA = P(t, mid('opposite', 0.15), 0.5, linear);
      // focus: which reaction is being described
      const fR = win(t, at('resp') - 0.2, end('resp') + 0.4, 0.4), fP = win(t, at('photo') - 0.2, end('photo') + 0.4, 0.4);
      const dimTop = 1 - 0.6 * fP, dimBot = 1 - 0.6 * fR;
      op(boxL, boxA); op(boxR, boxA);
      const pulse = (g, x, y, t0) => scaleAt(g, x, y, 1 + 0.06 * Math.sin(clamp((t - t0) / 0.6) * Math.PI));
      pulse(boxL, BL[0], BL[1], t < at('photo') ? mid('resp', 0.08) : mid('photo', 0.3));
      pulse(boxR, BR[0], BR[1], t < at('photo') ? mid('resp', 0.33) : mid('photo', 0.1));
      arrTop.set(P(t, mid('opposite', 0.42), 0.8)); op(arrTop, (t > mid('opposite', 0.42) ? 1 : 0) * dimTop);
      arrBot.set(P(t, mid('opposite', 0.62), 0.8)); op(arrBot, (t > mid('opposite', 0.62) ? 1 : 0) * dimBot);
      op(CH3[0], (P(t, at('three'), 0.4, linear)) * dimTop);
      op(CH3[1], (P(t, at('three') + 0.2, 0.4, linear)) * dimBot);
      // things flowing along each arrow while it is described
      const fl = (parts, x0, x1, y, env, speed) => parts.forEach((o, k) => {
        const u = (tt * speed + k / parts.length) % 1;
        const x = lerp(x0, x1, u), fade = env * Math.min(1, u * 8, (1 - u) * 8);
        op(o.a, u < 0.5 ? fade : 0); op(o.b, u >= 0.5 ? fade : 0);
        tr(o.a, x, y, 1, u * 160); tr(o.b, x, y);
      });
      fl(topParts, 432, 770, 330, win(t, mid('resp', 0.1), end('resp') + 0.2, 0.4), 0.36);
      fl(botParts, 770, 432, 440, win(t, mid('photo', 0.1), end('photo') + 0.2, 0.4), 0.36);
      const sk = P(t, mid('resp', 0.42), 0.5, pop);
      op(sparkTop, clamp(sk * 2) * dimTop); tr(sparkTop, 600, 330, Math.max(0.01, sk * (1 + 0.25 * fR))); sparkTop.upd(tt);
      const su = P(t, mid('photo', 0.38), 0.5, pop);
      op(sunBot, clamp(su * 2) * dimBot); tr(sunBot, 600, 440, Math.max(0.01, su * (1 + 0.15 * fP))); sunBot.upd(tt);
      factsR.forEach((p, k) => showPill(p, mid('resp', [0.47, 0.7, 0.88][k]), t, 1 - 0.45 * fP));
      factsP.forEach((p, k) => showPill(p, mid('photo', [0.42, 0.64, 0.88][k]), t));
    }

    /* ---- part 2: the plant ---- */
    const p2 = P(t, at('both') - 0.25, 0.6, linear) * (1 - P(t, at('breathe') - 0.2, 0.5, linear));
    op(garden, p2);
    if (p2 > 0) {
      const grow = P(t, at('both') - 0.1, 1.0, easeOut);
      scaleAt(plant, 600, 548, 0.15 + 0.85 * grow);
      const dayA = P(t, at('day'), 0.8, linear), nightA = P(t, at('night'), 1.0, linear);
      op(daySky, nightA >= 1 ? 0 : dayA); op(nightSky, nightA);
      tr(sunDay, 985, lerp(260, 195, P(t, at('day'), 1.2, easeOut)) + 60 * nightA); sunDay.upd(tt);
      tr(moon, 985, lerp(250, 195, P(t, at('night'), 1.2, easeOut)));
      stars.forEach(s => s.el.setAttribute('opacity', (0.35 + 0.65 * wave(tt, 2.2, s.ph)).toFixed(3)));
      // every part respires: sparks twinkle from here on, brighter when only respiration shows
      const spA = P(t, mid('both', 0.36), 0.6, linear), boost = P(t, mid('night', 0.4), 0.6);
      plantSparks.forEach(o => {
        const k = 0.75 + 0.35 * wave(tt, 1.3, o.k * 0.13);
        op(o.s, spA * (0.75 + 0.25 * wave(tt, 1.7, o.k * 0.21)));
        tr(o.s, o.x, o.y, Math.max(0.01, k * (1 + 0.35 * boost) * grow)); o.s.upd(tt + o.k);
      });
      partLabels.forEach((g, k) => op(g, P(t, mid('both', [0.75, 0.81, 0.88, 0.95][k]), 0.4, linear) * (1 - P(t, at('day') - 0.2, 0.5, linear))));
      op(both1, win(t, mid('both', 0.04), mid('both', 0.36), 0.35)); op(both2, win(t, mid('both', 0.1), mid('both', 0.36), 0.35));
      const bn = P(t, mid('both', 0.33), 0.5, easeOut);
      op(banner, bn * (1 - P(t, at('day') - 0.1, 0.5, linear))); banner.setAttribute('transform', `translate(0 ${((1 - bn) * -16).toFixed(1)})`);
      // rates
      op(rates, P(t, mid('day', 0.1), 0.5, linear));
      mP.set(P(t, mid('day', 0.17), 1.0) * (1 - P(t, mid('night', 0.16), 1.0)));
      mR.set(0.34 * P(t, mid('day', 0.38), 0.8));
      op(stopTxt, P(t, mid('night', 0.25), 0.4, linear));
      // gas exchange
      const flowShow = (f, t0, t1) => {
        const a = win(t, t0, t1, 0.4);
        op(f.g, a);
        if (a <= 0) return;
        f.a.set(P(t, t0, 0.7));
        f.mols.forEach((m, k) => {
          const u = (tt * 0.32 + k / 3) % 1, pt = qpt(f.x1, f.y1, f.c, f.x2, f.y2, u);
          op(m, Math.min(1, u * 6, (1 - u) * 6) * P(t, t0 + 0.3, 0.4, linear)); tr(m, pt[0], pt[1] - 26);
        });
      };
      flowShow(dayIn, mid('day', 0.6), at('night') + 0.2);
      flowShow(dayOut, mid('day', 0.83), at('night') + 0.2);
      flowShow(nightIn, mid('night', 0.6), 1e6);
      flowShow(nightOut, mid('night', 0.82), 1e6);
      op(sumDay, P(t, mid('day', 0.9), 0.4, linear) * (1 - P(t, at('night'), 0.4, linear)));
      op(sumNight, P(t, mid('night', 0.9), 0.4, linear));
    }

    /* ---- part 3 + 4: lungs, then the loop ---- */
    const p3 = P(t, at('breathe') - 0.1, 0.5, linear);
    const dim = 1 - 0.78 * P(t, at('crlv') - 0.15, 0.5, linear);
    op(lungG, p3 * dim);
    if (p3 > 0) {
      const mv = P(t, at('link') - 0.1, 0.9);
      const lp = P(t, at('breathe'), 0.6, pop);
      lungIn.setAttribute('transform', `translate(${lerp(372, 230, mv)} ${lerp(415, 385, mv)}) scale(${(Math.max(0.01, lp) * lerp(1, 0.62, mv)).toFixed(4)})`);
      const b = wave(tt, 3.6), inhaling = Math.sin(TAU * tt / 3.6) > 0;
      lu.set(b);
      dia.setAttribute('d', `M-158,${196 + 6 * b} Q0,${132 + 40 * b} 158,${196 + 6 * b}`);
      const airA = P(t, mid('breathe', 0.4), 0.4, linear);
      const airK = airA * (1 - mv);
      op(airIn, airK * (inhaling ? 1 : 0.12)); op(airOut, airK * (inhaling ? 0.12 : 1));
      op(airLab, airK); op(diaLab, airK);
      const showBr = [mid('breathe', 0.2), mid('breathe', 0.45), mid('breathe', 0.8)];
      const brOut = 1 - P(t, at('link') - 0.2, 0.4, linear);
      brList.forEach(([g, x, y], k) => {
        const q = P(t, showBr[k], 0.45, pop);
        op(g, clamp(q * 2) * brOut);
        if (x) tr(g, x, y, Math.max(0.01, 0.6 + 0.4 * q)); else scaleAt(g, 860, 462, Math.max(0.01, 0.6 + 0.4 * q));
      });
    }
    const p4 = P(t, at('link') - 0.05, 0.5, linear);
    op(linkG, p4 * dim);
    if (p4 > 0) {
      const cp = P(t, mid('link', 0.06), 0.7, pop);
      op(cell, clamp(cp * 2)); cell.upd(tt);
      tr(cell, CX, CY, Math.max(0.01, 0.5 + 0.5 * cp));
      op(mito, clamp(cp * 2)); mito.upd(tt);
      const rs = P(t, mid('link', 0.3), 0.5, pop);
      op(cellSpark, clamp(rs * 2)); tr(cellSpark, CX + 50, CY + 30, Math.max(0.01, rs * (0.9 + 0.2 * wave(tt, 0.8)))); cellSpark.upd(tt);
      op(chResp, P(t, mid('link', 0.32), 0.4, linear));
      op(chBreath, P(t, mid('link', 0.03), 0.4, linear));
      const t1 = mid('link', 0.06), t2 = mid('link', 0.5);
      aTop.set(P(t, t1, 0.8)); op(aTop, t > t1 ? 1 : 0);
      aBot.set(P(t, t2, 0.8)); op(aBot, t > t2 ? 1 : 0);
      op(lbO2, P(t, t1 + 0.4, 0.4, linear)); op(lbCO2, P(t, t2 + 0.4, 0.4, linear));
      const along = (mols, path, c, t0) => mols.forEach((m, k) => {
        const u = (tt * 0.3 + k / mols.length) % 1, pt = qpt(path[0], path[1], c, path[2], path[3], u);
        op(m, Math.min(1, u * 7, (1 - u) * 7) * P(t, t0 + 0.5, 0.5, linear)); tr(m, pt[0], pt[1] - 22);
      });
      along(o2s, TOPP, cTop, t1); along(co2s, BOTP, cBot, t2);
      const lb = P(t, mid('link', 0.8), 0.45, pop);
      op(linkBanner, clamp(lb * 2)); tr(linkBanner, 600, 680, Math.max(0.01, 0.7 + 0.3 * lb));
    }

    /* ---- part 5: Cells Respire, Lungs Ventilate ---- */
    const p5 = P(t, at('crlv') - 0.1, 0.45, linear);
    op(memo, p5);
    if (p5 > 0) {
      const q1 = P(t, mid('crlv', 0.22), 0.5, pop), q2 = P(t, mid('crlv', 0.55), 0.5, pop);
      op(m1, clamp(q1 * 2)); scaleAt(m1, 600, 330, Math.max(0.01, 0.7 + 0.3 * q1));
      op(m2, clamp(q2 * 2)); scaleAt(m2, 600, 430, Math.max(0.01, 0.7 + 0.3 * q2));
    }
  };
});
