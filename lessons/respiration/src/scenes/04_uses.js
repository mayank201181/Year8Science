/* Chapter 4, What the energy is used for.
   An energy hub with six empty slots -> it moves left and a panel shows each use in turn:
   movement, growth, big molecules, active transport, keeping warm, nerve impulses
   -> some energy always leaves as heat (an energy-transfer diagram) -> bird vs lizard
   -> the brain: 2% of body mass, about a fifth of the energy. */
scene('uses', S => {
  const { at, mid } = S, root = S.root, R = S.reduce;
  const IDS = ['move', 'grow', 'build', 'active', 'warm', 'nerve'];
  const SKIN = '#EDBF9C', SKIN_DK = '#C98E66';

  /* ---------- small helpers ---------- */
  function snow(parent, x, y, w, h, n, seed) {
    const g = G(parent), r = rng(seed), fl = [];
    for (let i = 0; i < n; i++) fl.push({ el: E('circle', { r: 3 + r() * 4, fill: '#F4F8FF', opacity: 0.85 }, g), x: x + r() * w, ph: r(), sp: 0.12 + r() * 0.1, sw: r() * TAU });
    g.upd = t => fl.forEach(f => { const p = (t * f.sp + f.ph) % 1; attr(f.el, 'cx', f.x + Math.sin(t * 1.3 + f.sw) * 10); attr(f.el, 'cy', y + p * h); f.el.style.opacity = (0.9 * Math.min(1, p * 8, (1 - p) * 8)).toFixed(3); });
    g.upd(0);
    return g;
  }
  function clipRect(x, y, w, h, rx) {
    const id = 'uclip' + Math.round(x) + '_' + Math.round(y) + '_' + Math.round(w);
    const cp = E('clipPath', { id }, defs()); E('rect', { x, y, width: w, height: h, rx: rx || 0 }, cp);
    return `url(#${id})`;
  }
  function bird(parent) {
    const g = G(parent);
    E('path', { d: 'M-58,8 L-104,-6 L-96,22 Z', fill: '#8A4526' }, g);                       // tail
    E('line', { x1: -10, y1: 52, x2: -16, y2: 82, stroke: '#E0A040', 'stroke-width': 5, 'stroke-linecap': 'round' }, g);
    E('line', { x1: 14, y1: 52, x2: 18, y2: 82, stroke: '#E0A040', 'stroke-width': 5, 'stroke-linecap': 'round' }, g);
    E('circle', { r: 62, fill: ball('#C8714A', '#8A4526') }, g);                                  // body
    E('ellipse', { cx: 20, cy: 14, rx: 40, ry: 38, fill: '#F2793F' }, g);                          // red breast
    E('ellipse', { cx: -18, cy: 2, rx: 38, ry: 24, fill: '#9C5530', transform: 'rotate(-18 -18 2)' }, g); // wing
    const head = G(g); tr(head, 40, -52);
    E('circle', { r: 34, fill: ball('#C8714A', '#8A4526') }, head);
    E('path', { d: 'M28,-6 L56,2 L28,10 Z', fill: '#F2B33D' }, head);
    E('circle', { cx: 12, cy: -8, r: 6, fill: '#1A1A1A' }, head);
    E('circle', { cx: 14, cy: -10, r: 2, fill: '#fff' }, head);
    g.head = head;
    return g;
  }
  function mouse(parent) {
    const g = G(parent);
    E('path', { d: 'M-74,10 C-120,20 -130,-30 -160,-10', fill: 'none', stroke: '#C9A3B2', 'stroke-width': 6, 'stroke-linecap': 'round' }, g);
    E('ellipse', { rx: 80, ry: 52, fill: ball('#B9B3C9', '#7C7594') }, g);
    E('circle', { cx: 62, cy: -46, r: 22, fill: '#B9B3C9', stroke: '#7C7594', 'stroke-width': 3 }, g);
    E('circle', { cx: 62, cy: -46, r: 12, fill: '#F2A7BE' }, g);
    E('ellipse', { cx: 86, cy: -16, rx: 40, ry: 32, fill: ball('#C4BED3', '#7C7594') }, g);
    E('circle', { cx: 124, cy: -12, r: 7, fill: '#F27C9C' }, g);
    E('circle', { cx: 94, cy: -24, r: 5, fill: '#1A1A1A' }, g);
    E('path', { d: 'M110,-6 L146,-14 M110,-2 L146,4', stroke: '#E8E4F0', 'stroke-width': 2 }, g);
    [-40, 40].forEach(x => E('ellipse', { cx: x, cy: 50, rx: 14, ry: 7, fill: '#F2A7BE' }, g));
    return g;
  }
  function phase(t, t0, r0, ta, tb, r1) {            // integral of a rate that ramps r0 -> r1 between ta and tb
    if (t <= ta) return (t - t0) * r0;
    const base = (ta - t0) * r0, d = tb - ta;
    if (t <= tb) { const x = t - ta; return base + r0 * x + 0.5 * (r1 - r0) * x * x / d; }
    return base + r0 * d + 0.5 * (r1 - r0) * d + r1 * (t - tb);
  }

  /* ---------- the energy hub with six slots ---------- */
  const HC0 = [600, 400, 1], HC1 = [250, 420, 0.82], DIST = 178, SR = 54;
  const hubG = G(root);
  const ANG = [-90, -30, 30, 90, 150, 210].map(a => a * Math.PI / 180);
  const spokes = ANG.map(a => { const l = E('line', { x1: Math.cos(a) * 46, y1: Math.sin(a) * 46, x2: Math.cos(a) * (DIST - SR), y2: Math.sin(a) * (DIST - SR), stroke: C.line, 'stroke-width': 5, 'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': '1 1' }, hubG); return l; });
  const ICONS = [
    g => { E('line', { x1: -26, y1: 16, x2: 6, y2: 16, stroke: C.ink, 'stroke-width': 13, 'stroke-linecap': 'round' }, g); E('line', { x1: 6, y1: 16, x2: 16, y2: -18, stroke: C.ink, 'stroke-width': 12, 'stroke-linecap': 'round' }, g); E('circle', { cx: 16, cy: -24, r: 10, fill: C.ink }, g); E('ellipse', { cx: -9, cy: 6, rx: 14, ry: 10, fill: '#EE7D8C' }, g); },
    g => { [-12, 12].forEach(x => { E('circle', { cx: x, cy: 0, r: 17, fill: 'rgba(247,168,200,0.25)', stroke: C.cell, 'stroke-width': 4 }, g); E('circle', { cx: x, cy: 0, r: 5, fill: '#B79CF0' }, g); }); },
    g => { const p = [[-28, 8], [-14, -6], [0, 6], [14, -6], [28, 8]]; E('path', { d: 'M' + p.map(q => q.join(',')).join('L'), fill: 'none', stroke: C.muted, 'stroke-width': 3 }, g); p.forEach((q, i) => E('circle', { cx: q[0], cy: q[1], r: 7, fill: ['#FF9466', '#56D69B', '#B48CFF', '#4CC9F0', '#FFC247'][i] }, g)); },
    g => { E('line', { x1: 0, y1: -26, x2: 0, y2: 26, stroke: C.plant, 'stroke-width': 4 }, g); [[-20, 12], [-14, -14]].forEach(q => E('circle', { cx: q[0], cy: q[1], r: 5, fill: '#C6F45C' }, g)); [[12, -16], [22, -4], [12, 8], [24, 14], [16, 22]].forEach(q => E('circle', { cx: q[0], cy: q[1], r: 5, fill: '#C6F45C' }, g)); E('path', { d: 'M-24,-2 Q-6,-30 14,-4', fill: 'none', stroke: C.energy, 'stroke-width': 3.5 }, g); E('path', { d: 'M8,-10 L15,-3 L5,0 Z', fill: C.energy }, g); },
    g => { E('rect', { x: -6, y: -28, width: 12, height: 36, rx: 6, fill: '#E9F2F7' }, g); E('circle', { cx: 0, cy: 12, r: 10, fill: C.bad }, g); E('rect', { x: -3, y: -12, width: 6, height: 22, fill: C.bad }, g); E('path', { d: 'M18,-22 q5,6 0,12 q-5,6 0,12', fill: 'none', stroke: C.heat, 'stroke-width': 3.5, 'stroke-linecap': 'round' }, g); },
    g => { E('circle', { cx: -20, cy: 0, r: 9, fill: C.ink }, g); E('path', { d: 'M-26,-6 L-34,-16 M-27,6 L-36,14 M-20,-9 L-22,-20 M-12,0 L26,0 M26,0 L33,-9 M26,0 L33,9', stroke: C.ink, 'stroke-width': 3.5, 'stroke-linecap': 'round' }, g); E('circle', { cx: 6, cy: 0, r: 5, fill: C.energy }, g); },
  ];
  const slots = ANG.map((a, k) => {
    const g = G(hubG); tr(g, Math.cos(a) * DIST, Math.sin(a) * DIST);
    const empty = E('circle', { r: SR, fill: C.bg0, stroke: C.faint, 'stroke-width': 3, 'stroke-dasharray': '7 7' }, g);
    const q = T(g, 0, 13, '?', { size: 38, weight: 700, anchor: 'middle', fill: C.faint });
    const lit = G(g);
    E('circle', { r: SR, fill: C.card2, stroke: C.energy, 'stroke-width': 4 }, lit);
    const ic = G(lit); tr(ic, 0, 0, 1.15); ICONS[k](ic);
    const hw = heatWaves(g, { n: 2, h: 48, spacing: 18, width: 4 }); tr(hw, 0, -SR - 4);
    return { g, empty, q, lit, hw, a };
  });
  const hub = spark(hubG, 34, { seed: 2 });
  const spokeSparks = ANG.map((a, k) => [0, 1].map(j => ({ el: spark(hubG, 9, { seed: k * 2 + j }), j, k })));
  const lifeLab = T(root, 600, 690, 'the life processes', { size: 34, weight: 700, anchor: 'middle', fill: C.energy });

  /* ---------- the panel ---------- */
  const panel = G(root);
  card(panel, 480, 118, 690, 590, { fill: C.card, stroke: C.line, rx: 26 });
  const PX = 825;
  function focus(title, sub) {
    const g = G(root);
    T(g, PX, 182, title, { size: 44, weight: 700, anchor: 'middle' });
    T(g, PX, 222, sub, { size: 27, weight: 500, anchor: 'middle', fill: C.muted, font: FB });
    return g;
  }

  // 1. movement: a flexing arm
  const F1 = focus('Movement', 'muscles contract');
  const arm = G(F1);
  const S0 = [628, 470], E0 = [840, 470], FL = 170;
  E('line', { x1: S0[0], y1: S0[1], x2: E0[0], y2: E0[1], stroke: SKIN_DK, 'stroke-width': 62, 'stroke-linecap': 'round' }, arm);
  E('circle', { cx: S0[0] - 6, cy: S0[1] - 6, r: 46, fill: SKIN, stroke: SKIN_DK, 'stroke-width': 5 }, arm);
  E('line', { x1: S0[0], y1: S0[1], x2: E0[0], y2: E0[1], stroke: SKIN, 'stroke-width': 54, 'stroke-linecap': 'round' }, arm);
  const bump = E('ellipse', { cx: 728, cy: 452, rx: 74, ry: 20, fill: SKIN, stroke: SKIN_DK, 'stroke-width': 4 }, arm);
  const biceps = E('ellipse', { cx: 728, cy: 456, rx: 54, ry: 12, fill: ball('#EE7D8C', '#B8466A'), opacity: 0.9 }, arm);
  const bicepsLab = T(F1, 734, 560, 'the biceps muscle contracts', { size: 26, weight: 700, anchor: 'middle', fill: '#EE7D8C' });
  const fore0 = E('line', { stroke: SKIN_DK, 'stroke-width': 54, 'stroke-linecap': 'round' }, arm);
  const fore1 = E('line', { stroke: SKIN, 'stroke-width': 46, 'stroke-linecap': 'round' }, arm);
  const fist = E('circle', { r: 32, fill: SKIN, stroke: SKIN_DK, 'stroke-width': 5 }, arm);
  const armSparks = [[680, 404], [770, 396], [812, 420], [700, 500], [784, 504], [650, 436], [730, 392], [828, 456]].map((p, i) => { const s = spark(F1, 11, { seed: i }); tr(s, p[0], p[1]); return { s, p, i }; });
  const rateM = meter(F1, { w: 300, h: 26, color: C.energy, label: 'respiration rate in the muscle', labelSize: 25 }); tr(rateM, 560, 640);
  const faster = T(F1, 880, 662, 'faster!', { size: 32, weight: 700, fill: C.energy });

  // 2. growth: one cell -> two -> four
  const F2 = focus('Growth', 'new cells and tissues');
  const cellsG = G(F2), gc = [];
  for (let i = 0; i < 4; i++) { const g = G(cellsG); const m = E('circle', { r: 70, fill: 'rgba(247,168,200,0.16)', stroke: C.cell, 'stroke-width': 5 }, g); const n = E('circle', { r: 18, fill: 'rgba(150,120,220,0.5)', stroke: '#B79CF0', 'stroke-width': 3 }, g); gc.push({ g, m, n }); }
  const growLab1 = T(F2, 690, 650, 'to get bigger', { size: 29, weight: 700, anchor: 'middle', fill: C.energy });
  const growLab2 = T(F2, 960, 650, 'to repair damage', { size: 29, weight: 700, anchor: 'middle', fill: C.energy });

  // 3. making big molecules: amino acids join into a protein
  const F3 = focus('Making big molecules', 'small molecules join into large ones');
  const bondG = G(F3), beadG = G(F3), joinG = G(F3);
  const BC = ['#FF9466', '#56D69B', '#B48CFF', '#4CC9F0', '#FFC247', '#FF5FA2', '#9FD8FF'];
  const br = rng(17);
  const beads = BC.map((c, k) => ({ el: (() => { const b = E('circle', { r: 24, fill: ball(c, '#3A4650'), stroke: '#ffffff', 'stroke-width': 2, opacity: 1 }, beadG); return b; })(), from: [560 + br() * 530, 290 + br() * 110], to: [615 + k * 70, 488 + 26 * Math.sin(k * 1.1)], k }));
  const bonds = beads.slice(1).map(() => E('line', { stroke: C.ink, 'stroke-width': 6, 'stroke-linecap': 'round' }, bondG));
  const joins = beads.slice(1).map((b, i) => spark(joinG, 14, { seed: i + 5 }));
  const aaLab = T(F3, PX, 272, 'amino acids', { size: 30, weight: 700, anchor: 'middle', fill: C.muted });
  const protLab = T(F3, PX, 600, 'a protein: one big molecule', { size: 32, weight: 700, anchor: 'middle', fill: C.energy });
  const protBr = E('path', { d: 'M600,540 Q600,558 620,558 L1030,558 Q1050,558 1050,540', fill: 'none', stroke: C.energy, 'stroke-width': 4 }, F3);

  // 4. active transport: a root hair cell takes minerals in from the soil
  const F4 = focus('Active transport', 'moving substances against a concentration gradient');
  E('rect', { x: 500, y: 250, width: 650, height: 370, rx: 18, fill: '#3A2A1F' }, F4);
  const sg = rng(23);
  for (let i = 0; i < 34; i++) { const x = 515 + sg() * 620, y = 262 + sg() * 345; if (y > 270 && y < 450 && x > 580) continue; E('circle', { cx: x, cy: y, r: 6 + sg() * 10, fill: ['#5A4130', '#6B4E38', '#4E3828'][i % 3] }, F4); }
  E('path', { d: 'M950,280 L1110,280 Q1130,280 1130,300 L1130,420 Q1130,440 1110,440 L612,440 Q590,440 590,420 Q590,400 612,400 L930,400 L930,300 Q930,280 950,280 Z', fill: 'rgba(91,210,122,0.2)', stroke: C.plant, 'stroke-width': 5, 'stroke-linejoin': 'round' }, F4);
  E('circle', { cx: 1050, cy: 335, r: 24, fill: 'rgba(150,120,220,0.5)', stroke: '#B79CF0', 'stroke-width': 3 }, F4);
  const MIN = '#C6F45C';
  const inside = [[960, 300], [990, 370], [1010, 305], [975, 340], [1085, 300], [1100, 380], [1060, 395], [1025, 375], [945, 385], [1110, 340], [660, 420], [740, 414], [820, 426], [890, 418]];
  inside.forEach(p => E('circle', { cx: p[0], cy: p[1], r: 9, fill: MIN, stroke: '#8DB12F', 'stroke-width': 2 }, F4));
  const OUT = [[640, 520], [760, 560], [900, 500], [560, 330], [1060, 560]];
  OUT.forEach(p => E('circle', { cx: p[0], cy: p[1], r: 9, fill: MIN, stroke: '#8DB12F', 'stroke-width': 2, opacity: 0.95 }, F4));
  const movers = [[700, 520, 700, 440, 760, 422], [820, 560, 820, 440, 860, 424], [880, 340, 880, 400, 920, 420]].map((m, i) => ({ el: E('circle', { r: 10, fill: MIN, stroke: '#ffffff', 'stroke-width': 3 }, F4), m, sp: (() => { const s = spark(F4, 16, { seed: 40 + i }); return s; })(), i }));
  T(F4, 1030, 268, 'lots inside', { size: 26, weight: 700, anchor: 'middle', fill: MIN });
  T(F4, 520, 600, 'few outside, in the soil', { size: 26, weight: 700, fill: '#E8D3B8' });
  const gradChip = chip(F4, 'against a concentration gradient: needs energy', { size: 27, fill: C.card2, stroke: C.energy }); tr(gradChip, PX, 664);

  // 5. keeping warm
  const F5 = focus('Keeping warm', 'mammals and birds');
  const snowA = snow(F5, 500, 240, 650, 450, 18, 5); snowA.setAttribute('clip-path', clipRect(482, 120, 686, 586, 26));
  const warmGlow1 = E('ellipse', { cx: 690, cy: 440, rx: 130, ry: 120, fill: glow(C.heat), opacity: 0.7 }, F5);
  const warmGlow2 = E('ellipse', { cx: 950, cy: 455, rx: 150, ry: 110, fill: glow(C.heat), opacity: 0.7 }, F5);
  const bird1 = bird(F5); tr(bird1, 680, 450, 0.95);
  const mouse1 = mouse(F5); tr(mouse1, 920, 470, 0.9);
  const hw1 = heatWaves(F5, { n: 3, h: 60 }); tr(hw1, 690, 345);
  const hw2 = heatWaves(F5, { n: 3, h: 60 }); tr(hw2, 935, 380);
  T(F5, 680, 572, 'bird', { size: 28, weight: 600, anchor: 'middle' });
  T(F5, 930, 572, 'mammal', { size: 28, weight: 600, anchor: 'middle' });
  const th5 = G(F5); tr(th5, 1112, 560, 0.75); const thm = thermometer(th5, 200, C.bad);
  const steady = chip(F5, 'a steady body temperature', { size: 28, fill: C.card2, stroke: C.heat }); tr(steady, PX, 650);

  // 6. nerve impulses
  const F6 = focus('Nerve impulses', 'and lots of other jobs inside cells');
  const AX = []; for (let i = 0; i <= 40; i++) { const x = 640 + i * 10.5; AX.push([x, 430 + Math.sin(i * 0.22) * 16]); }
  E('path', { d: openPath(AX), fill: 'none', stroke: '#C9B8F0', 'stroke-width': 9, 'stroke-linecap': 'round' }, F6);
  [[1060, 430, 1100, 395], [1060, 430, 1108, 432], [1060, 430, 1100, 470]].forEach(b => { E('line', { x1: b[0], y1: b[1], x2: b[2], y2: b[3], stroke: '#C9B8F0', 'stroke-width': 6, 'stroke-linecap': 'round' }, F6); E('circle', { cx: b[2], cy: b[3], r: 9, fill: '#C9B8F0' }, F6); });
  [[-30, -50, -60, -78], [10, -52, 20, -92], [-52, 4, -98, 0], [-30, 46, -62, 76], [12, 50, 26, 90]].forEach(d => E('path', { d: `M${600 + d[0] * 0.4},${430 + d[1] * 0.4} L${600 + d[0]},${430 + d[1]} L${600 + d[2]},${430 + d[3]}`, fill: 'none', stroke: '#C9B8F0', 'stroke-width': 6, 'stroke-linecap': 'round' }, F6));
  E('circle', { cx: 600, cy: 430, r: 44, fill: ball('#B79CF0', '#6E54B8') }, F6);
  E('circle', { cx: 596, cy: 426, r: 16, fill: '#6E54B8' }, F6);
  const imps = [0, 1].map(i => spark(F6, 18, { seed: 60 + i }));
  const impLab = chip(F6, 'a nerve impulse', { size: 30, fill: C.card2, stroke: C.energy }); tr(impLab, PX, 560);

  // 7. heat: an energy-transfer diagram
  const F7 = focus('Not all of it is useful', 'some energy always leaves as heat');
  const revId = 'urev' + Math.random().toString(36).slice(2, 7);
  const rcp = E('clipPath', { id: revId }, defs()); const revRect = E('rect', { x: 500, y: 200, width: 0, height: 420 }, rcp);
  const flow = G(F7, { 'clip-path': `url(#${revId})` });
  E('path', { d: 'M520,360 L722,360 L722,460 L520,460 Z', fill: C.energy, opacity: 0.92 }, flow);
  E('path', { d: 'M720,360 C800,360 820,255 900,255 L900,320 C842,320 800,425 720,425 Z', fill: C.energy, opacity: 0.92 }, flow);
  E('path', { d: 'M898,238 L944,287 L898,337 Z', fill: C.energy }, flow);
  E('path', { d: 'M720,425 C800,425 820,520 900,520 L900,556 C830,556 800,460 720,460 Z', fill: C.heat, opacity: 0.95 }, flow);
  E('path', { d: 'M898,505 L934,538 L898,571 Z', fill: C.heat }, flow);
  const fl1 = T(F7, 520, 344, 'energy released', { size: 26, weight: 600, fill: C.muted });
  const fl2 = G(F7); T(fl2, 958, 280, 'useful:', { size: 30, weight: 700, fill: C.energy }); T(fl2, 958, 314, 'life processes', { size: 26, weight: 600 });
  const fl3 = G(F7); T(fl3, 950, 534, 'heat', { size: 32, weight: 700, fill: C.heat }); T(fl3, 950, 568, 'to the', { size: 26, weight: 600 }); T(fl3, 950, 600, 'surroundings', { size: 26, weight: 600 });
  const hw7 = heatWaves(F7, { n: 3, h: 70, width: 5 }); tr(hw7, 880, 505);
  const warmNote = G(F7);
  const wb = bird(warmNote); tr(wb, 560, 640, 0.38); const wm = mouse(warmNote); tr(wm, 650, 650, 0.36);
  T(warmNote, 712, 662, 'keeps mammals and birds warm', { size: 27, weight: 700, fill: C.good });
  const wt = tick(warmNote, 13); tr(wt, 1130, 652);

  /* ---------- bird vs lizard ---------- */
  const BL = G(root);
  card(BL, 40, 118, 548, 590, { fill: '#163246', stroke: C.line, rx: 26 });
  card(BL, 612, 118, 548, 590, { fill: C.card, stroke: C.line, rx: 26 });
  T(BL, 314, 178, 'Small bird', { size: 40, weight: 700, anchor: 'middle' });
  T(BL, 314, 216, 'uses energy to keep warm', { size: 26, weight: 500, anchor: 'middle', fill: C.muted, font: FB });
  T(BL, 886, 178, 'Lizard', { size: 40, weight: 700, anchor: 'middle' });
  T(BL, 886, 216, "doesn't use energy to keep warm", { size: 26, weight: 500, anchor: 'middle', fill: C.muted, font: FB });
  const snowB = snow(BL, 50, 240, 528, 400, 16, 9); snowB.setAttribute('clip-path', clipRect(42, 120, 544, 586, 26));
  E('rect', { x: 42, y: 596, width: 544, height: 64, fill: '#E6EEF5', opacity: 0.85 }, BL);
  const sun = G(BL); E('circle', { r: 46, fill: glow(C.energy) }, sun); E('circle', { r: 20, fill: C.energy }, sun);
  const seeds = []; for (let k = 0; k < 9; k++) seeds.push(E('ellipse', { cx: 330 + k * 26, cy: 600, rx: 8, ry: 5, fill: '#8A5A2B' }, BL));
  const birdB = bird(BL); tr(birdB, 220, 520, 0.9);
  const seedCount = T(BL, 314, 690, 'seeds eaten: 0', { size: 30, weight: 700, anchor: 'middle', fill: C.energy });
  E('ellipse', { cx: 886, cy: 590, rx: 190, ry: 54, fill: ball('#8C98A4', '#56616C') }, BL);
  const liz = G(BL); tr(liz, 886, 528);
  E('path', { d: 'M-110,8 C-160,14 -200,-2 -236,16 C-200,10 -160,30 -108,24 Z', fill: '#4E9A43' }, liz);
  [[-60, 16, -86, 44], [-30, 18, -4, 46], [50, 16, 26, 46], [80, 14, 104, 44]].forEach(l => E('path', { d: `M${l[0]},${l[1]} L${l[2]},${l[3]} l${l[2] < l[0] ? -12 : 12},2`, fill: 'none', stroke: '#4E9A43', 'stroke-width': 9, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, liz));
  const lizBody = E('ellipse', { cx: 0, cy: 6, rx: 120, ry: 28, fill: ball('#7CC65F', '#3E7F33') }, liz);
  E('ellipse', { cx: 130, cy: -2, rx: 42, ry: 24, fill: ball('#7CC65F', '#3E7F33') }, liz);
  E('circle', { cx: 146, cy: -10, r: 5, fill: '#1A1A1A' }, liz);
  [[-60, 0], [-20, -6], [24, 0], [64, -4]].forEach(p => E('circle', { cx: p[0], cy: p[1], r: 7, fill: '#3E7F33', opacity: 0.7 }, liz));
  T(BL, 886, 690, 'can go much longer without food', { size: 27, weight: 700, anchor: 'middle', fill: C.good });

  /* ---------- the brain ---------- */
  const BR = G(root);
  const brain = G(BR); tr(brain, 290, 420);
  E('path', { d: 'M-130,10 C-150,-60 -100,-120 -30,-118 C10,-140 80,-130 110,-90 C160,-80 170,-10 140,30 C150,80 100,110 50,100 C20,130 -50,128 -80,100 C-130,100 -150,60 -130,10 Z', fill: ball('#F7A8C8', '#C25A88'), stroke: '#FFD3E4', 'stroke-width': 4 }, brain);
  E('path', { d: 'M-90,-60 q30,-20 50,10 q20,30 50,0 M-110,10 q40,-30 70,0 q30,30 70,-10 q20,-20 50,10 M-70,70 q30,-30 60,0 q30,26 60,-6 M0,-110 q-10,40 10,60', fill: 'none', stroke: '#C25A88', 'stroke-width': 5, 'stroke-linecap': 'round' }, brain);
  E('path', { d: 'M20,100 Q30,140 10,170', fill: 'none', stroke: '#E58BB0', 'stroke-width': 16, 'stroke-linecap': 'round' }, brain);
  const moon = G(BR); tr(moon, 450, 250);
  E('circle', { r: 56, fill: glow('#FFF3B0'), opacity: 0.6 }, moon);
  E('path', { d: 'M8,-30 A32,32 0 1 0 8,30 A24,24 0 1 1 8,-30 Z', fill: '#FFF3B0' }, moon);
  const zzz = [0, 1, 2].map(i => T(BR, 0, 0, 'z', { size: 30 + i * 8, weight: 700, fill: C.air }));
  const sleepLab = T(BR, 290, 660, 'even while you sleep', { size: 30, weight: 700, anchor: 'middle', fill: C.air });
  const rowA = G(BR), rowB = G(BR);
  T(rowA, 560, 300, 'share of your body mass', { size: 28, weight: 600 });
  E('rect', { x: 560, y: 318, width: 560, height: 46, rx: 23, fill: '#0B2230', stroke: C.line, 'stroke-width': 2 }, rowA);
  const barA = E('rect', { x: 560, y: 318, width: 0, height: 46, rx: 12, fill: '#F7A8C8' }, rowA);
  const labA = T(rowA, 600, 352, '2%', { size: 32, weight: 700, fill: '#F7A8C8' });
  T(rowB, 560, 470, 'share of your energy', { size: 28, weight: 600 });
  E('rect', { x: 560, y: 488, width: 560, height: 46, rx: 23, fill: '#0B2230', stroke: C.line, 'stroke-width': 2 }, rowB);
  const barB = E('rect', { x: 560, y: 488, width: 0, height: 46, rx: 23, fill: C.energy }, rowB);
  const labB = T(rowB, 694, 522, 'about 20%: a fifth', { size: 32, weight: 700, fill: C.energy });

  return t => {
    const tMove = at('move'), tBird = at('bird'), tBrain = at('brain');

    /* hub */
    const aH = Math.min(P(t, S.first - 0.6, 0.6, linear), 1 - P(t, tBird - 0.3, 0.5, linear));
    op(hubG, aH);
    op(lifeLab, Math.min(P(t, mid('what', 0.6), 0.4, linear), 1 - P(t, tMove - 0.3, 0.3, linear)));
    if (aH > 0) {
      const hp = P(t, tMove - 0.3, 0.9);
      tr(hubG, lerp(HC0[0], HC1[0], hp), lerp(HC0[1], HC1[1], hp), lerp(HC0[2], HC1[2], hp));
      hub.upd(t); tr(hub, 0, 0, 1 + 0.08 * Math.sin(t * 2.4));
      spokes.forEach((l, k) => l.setAttribute('stroke-dashoffset', (1 - P(t, mid('what', 0.08 + k * 0.06), 0.5)).toFixed(4)));
      slots.forEach((sl, k) => {
        const appear = P(t, mid('what', 0.1 + k * 0.07), 0.45, pop);
        tr(sl.g, Math.cos(sl.a) * DIST, Math.sin(sl.a) * DIST, Math.max(0.01, appear));
        const tl = at(IDS[k]) + 0.25, lit = P(t, tl, 0.5, pop);
        op(sl.lit, clamp(lit * 2)); tr(sl.lit, 0, 0, 0.6 + 0.4 * lit);
        op(sl.q, 1 - clamp(lit * 2)); op(sl.empty, 1 - clamp(lit * 2));
        const hwA = P(t, mid('heat', 0.25) + k * 0.08, 0.5, linear);
        op(sl.hw, hwA); if (hwA > 0) sl.hw.upd(t + k * 0.3);
        spokes[k].setAttribute('stroke', lit > 0.5 ? C.energy : C.line);
        spokeSparks[k].forEach(sp => {
          if (lit < 0.5) { op(sp.el, 0); return; }
          const ph = k === 0 ? phase(t, tl, 0.55, mid('move', 0.45), at('grow'), 1.6) : (t - tl) * 0.55;
          const u = ((ph + sp.j * 0.5) % 1 + 1) % 1, d = 40 + u * (DIST - SR - 40);
          tr(sp.el, Math.cos(sl.a) * d, Math.sin(sl.a) * d, 0.8);
          op(sp.el, Math.sin(u * Math.PI)); sp.el.upd(t);
        });
      });
    }

    /* panel and its six uses */
    const aP = Math.min(P(t, tMove - 0.1, 0.5, linear), 1 - P(t, tBird - 0.3, 0.5, linear));
    op(panel, aP);
    tr(panel, (1 - P(t, tMove - 0.1, 0.7, easeOut)) * 60, 0);
    const wins = [[tMove, at('grow')], [at('grow'), at('build')], [at('build'), at('active')], [at('active'), at('warm')], [at('warm'), at('nerve')], [at('nerve'), at('heat')], [at('heat'), tBird]];
    const FS = [F1, F2, F3, F4, F5, F6, F7];
    const al = wins.map((w, i) => win(t, w[0] - 0.1, w[1] - (i === 6 ? 0.3 : 0.05), 0.35));
    FS.forEach((f, i) => op(f, al[i] * aP));

    if (al[0] > 0) {                                   // movement
      const per = 1.4, w = wave(t - tMove, per), th = -(12 + 100 * w) * Math.PI / 180;
      const hx = E0[0] + Math.cos(th) * FL, hy = E0[1] + Math.sin(th) * FL;
      [fore0, fore1].forEach(l => { attr(l, 'x1', E0[0]); attr(l, 'y1', E0[1]); attr(l, 'x2', hx); attr(l, 'y2', hy); });
      attr(fist, 'cx', hx); attr(fist, 'cy', hy);
      attr(bump, 'ry', 18 + 26 * w); attr(bump, 'cy', 458 - 22 * w); attr(bump, 'rx', 74 - 8 * w);
      attr(biceps, 'ry', 9 + 20 * w); attr(biceps, 'cy', 460 - 20 * w); attr(biceps, 'rx', 52 - 6 * w);
      op(bicepsLab, P(t, tMove + 0.8, 0.4, linear));
      const fast = P(t, mid('move', 0.45), 2.0);
      armSparks.forEach(o => { const on = o.i < 4 ? 1 : fast; const tw = wave(t, o.i < 4 ? 1.1 : 0.6, o.i * 0.17); op(o.s, on * (0.25 + 0.75 * tw) * P(t, tMove + 0.2, 0.5, linear)); o.s.upd(t); });
      rateM.set(0.32 + 0.6 * fast);
      op(faster, P(t, mid('move', 0.6), 0.4, linear));
    }
    if (al[1] > 0) {                                   // growth
      const t0 = at('grow'), p1 = P(t, mid('grow', 0.12), 0.9), p2 = P(t, mid('grow', 0.45), 0.9), pg = P(t, mid('grow', 0.75), 0.8);
      const r = 70 - 12 * p1 - 9 * p2 + 12 * pg, dx = 82 * p1, dy = 74 * p2;
      gc.forEach((c, i) => { const sx = i < 2 ? -1 : 1, sy = i % 2 ? 1 : -1; tr(c.g, PX + sx * dx, 450 + sy * dy); attr(c.m, 'r', r + (R ? 0 : 2 * Math.sin(t * 2 + i))); attr(c.n, 'r', 18 - 4 * p2 + 3 * pg); });
      op(growLab1, P(t, mid('grow', 0.5), 0.4, linear)); op(growLab2, P(t, mid('grow', 0.72), 0.4, linear));
    }
    if (al[2] > 0) {                                   // big molecules
      const pos = beads.map(b => {
        const ta = mid('build', 0.28 + b.k * 0.075), p = P(t, ta, 0.8);
        const fx = b.from[0] + (R ? 0 : 8 * Math.sin(t * 1.5 + b.k)), fy = b.from[1] + (R ? 0 : 8 * Math.cos(t * 1.3 + b.k));
        const x = lerp(fx, b.to[0], p), y = lerp(fy, b.to[1], p) - Math.sin(p * Math.PI) * 40;
        attr(b.el, 'cx', x); attr(b.el, 'cy', y);
        op(b.el, P(t, at('build') + b.k * 0.08, 0.4, linear));
        return [x, y, p];
      });
      bonds.forEach((l, i) => { const a = pos[i], b = pos[i + 1], on = a[2] >= 1 && b[2] >= 1 ? 1 : 0; attr(l, 'x1', a[0]); attr(l, 'y1', a[1]); attr(l, 'x2', b[0]); attr(l, 'y2', b[1]); op(l, on); });
      joins.forEach((s, i) => { const tj = mid('build', 0.28 + (i + 1) * 0.075) + 0.8, u = (t - tj) / 0.7; if (u <= 0 || u >= 1) { op(s, 0); return; } tr(s, (pos[i][0] + pos[i + 1][0]) / 2, (pos[i][1] + pos[i + 1][1]) / 2, 0.6 + 0.6 * Math.sin(u * Math.PI)); op(s, Math.sin(u * Math.PI)); s.upd(t); });
      op(aaLab, Math.min(P(t, mid('build', 0.12), 0.4, linear), 1 - P(t, mid('build', 0.75), 0.4, linear)));
      op(protLab, P(t, mid('build', 0.86), 0.4, linear)); op(protBr, P(t, mid('build', 0.86), 0.4, linear));
    }
    if (al[3] > 0) {                                   // active transport
      movers.forEach(o => {
        const [sx, sy, mx, my, ex, ey] = o.m, ta = mid('active', 0.22 + o.i * 0.2);
        const p1 = P(t, ta, 0.7), p2 = P(t, ta + 0.95, 0.9);
        let x = lerp(sx, mx, p1), y = lerp(sy, my, p1);
        x = lerp(x, ex, p2); y = lerp(y, ey, p2);
        const jig = R ? 0 : 3;
        attr(o.el, 'cx', x + jig * Math.sin(t * 5 + o.i)); attr(o.el, 'cy', y + jig * Math.cos(t * 4 + o.i));
        const u = (t - ta - 0.6) / 0.6;
        if (u > 0 && u < 1) { tr(o.sp, mx, my, 0.6 + 0.7 * Math.sin(u * Math.PI)); op(o.sp, Math.sin(u * Math.PI)); o.sp.upd(t); } else op(o.sp, 0);
      });
      op(gradChip, P(t, mid('active', 0.5), 0.4, linear));
    }
    if (al[4] > 0) {                                   // keeping warm
      snowA.upd(t); hw1.upd(t); hw2.upd(t + 0.4);
      attr(warmGlow1, 'opacity', 0.5 + 0.25 * wave(t, 1.8)); attr(warmGlow2, 'opacity', 0.5 + 0.25 * wave(t, 1.8, 0.3));
      thm.set(0.72 + (R ? 0 : 0.01 * Math.sin(t * 3)));
      tr(bird1.head, 40, -52 + (R ? 0 : 2 * Math.sin(t * 2)), 1, R ? 0 : 6 * Math.sin(t * 0.9));
      op(steady, P(t, mid('warm', 0.55), 0.4, linear));
    }
    if (al[5] > 0) {                                   // nerve impulses
      imps.forEach((s, i) => {
        const u = (((t - at('nerve')) / 1.3 + i * 0.5) % 1 + 1) % 1, f = u * (AX.length - 1), k = Math.min(AX.length - 2, Math.floor(f)), q = f - k;
        tr(s, lerp(AX[k][0], AX[k + 1][0], q), lerp(AX[k][1], AX[k + 1][1], q), 1);
        op(s, Math.min(1, u * 8, (1 - u) * 8)); s.upd(t);
      });
      op(impLab, P(t, mid('nerve', 0.2), 0.4, linear));
    }
    if (al[6] > 0) {                                   // heat
      attr(revRect, 'width', 470 * P(t, at('heat') + 0.3, 2.2, easeOut));
      op(fl1, P(t, at('heat') + 0.3, 0.4, linear));
      op(fl2, P(t, at('heat') + 1.6, 0.4, linear));
      op(fl3, P(t, mid('heat', 0.3), 0.4, linear));
      op(hw7, P(t, mid('heat', 0.3), 0.4, linear)); hw7.upd(t);
      op(warmNote, P(t, mid('heat', 0.68), 0.5, linear));
    }

    /* bird vs lizard */
    const aB = Math.min(P(t, tBird - 0.2, 0.5, linear), 1 - P(t, tBrain - 0.3, 0.5, linear));
    op(BL, aB);
    if (aB > 0) {
      snowB.upd(t);
      const day = P(t, tBird, at('brain') - tBird - 0.4, linear);
      tr(sun, lerp(90, 540, day), 380 - 130 * Math.sin(day * Math.PI));
      const t0 = tBird + 0.5, gap = 0.72;
      let eaten = 0;
      seeds.forEach((s, k) => { const te = t0 + k * gap + 0.35; if (t >= te) eaten++; op(s, t < te ? 1 : 0); });
      setText(seedCount, 'seeds eaten: ' + eaten);
      const ph = ((t - t0) / gap % 1 + 1) % 1, peck = t > t0 && eaten < seeds.length ? Math.sin(ph * Math.PI) : 0;
      const nextX = 330 + Math.min(eaten, seeds.length - 1) * 26;
      tr(birdB, lerp(220, nextX - 70, P(t, t0 - 0.4, 0.4)), 520, 0.9);
      tr(birdB.head, 40 + 10 * peck, -52 + 42 * peck, 1, 38 * peck);
      liz.setAttribute('transform', `translate(886 528) scale(1 ${(1 + (R ? 0 : 0.03) * Math.sin(t * 1.2)).toFixed(4)})`);
    }

    /* brain */
    const aR = P(t, tBrain - 0.2, 0.5, linear);
    op(BR, aR);
    if (aR > 0) {
      tr(brain, 290, 420 + (R ? 0 : 4 * Math.sin(t * 1.4)));
      const pa = P(t, mid('brain', 0.1), 0.9, easeOut), pb = P(t, mid('brain', 0.42), 1.2, easeOut);
      op(rowA, P(t, mid('brain', 0.05), 0.4, linear)); attr(barA, 'width', Math.max(0.1, 560 * 0.02 * pa)); op(labA, pa);
      op(rowB, P(t, mid('brain', 0.38), 0.4, linear)); attr(barB, 'width', Math.max(0.1, 560 * 0.2 * pb)); op(labB, pb);
      const sl = P(t, mid('brain', 0.78), 0.5, linear);
      op(moon, sl); op(sleepLab, sl);
      zzz.forEach((z, i) => { const u = ((t * 0.45 + i / 3) % 1); attr(z, 'x', 500 + i * 16 + u * 30); attr(z, 'y', 250 - u * 70 - i * 12); op(z, sl * Math.sin(u * Math.PI)); });
    }
  };
});
