/* Investigating respiration: what experiments detect -> limewater test -> breathed-in vs breathed-out air
   -> germinating vs boiled peas in vacuum flasks -> the control and disinfectant -> a respirometer
   -> the fair-test checklist. */
scene('investigate', S => {
  const { at, end, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;

  /* ---------- local helpers ---------- */
  function rich(parent, x, y, segs, o) {
    o = o || {};
    const t = E('text', { x, y, 'font-size': o.size || 30, 'font-weight': o.weight || 600, 'font-family': o.font || FD, 'text-anchor': o.anchor || 'start', fill: o.fill || C.ink }, parent);
    segs.forEach(s => { if (typeof s === 'string') s = [s]; E('tspan', { fill: s[1], 'font-weight': s[2] }, t).textContent = s[0]; });
    return t;
  }
  function leader(parent, x1, y1, x2, y2) {
    E('path', { d: `M${x1},${y1} L${x2},${y2}`, stroke: C.muted, 'stroke-width': 3, fill: 'none', 'stroke-linecap': 'round' }, parent);
    E('circle', { cx: x2, cy: y2, r: 5, fill: C.muted }, parent);
  }
  const tubeD = (w, h) => { const r = w / 2; return `M${-r},0 L${-r},${h - r} A${r},${r} 0 0 0 ${r},${h - r} L${r},0`; };
  const liquidD = (w, h, top) => { const r = w / 2, q = r - 5; return `M${-q},${top} L${-q},${h - r} A${q},${q} 0 0 0 ${q},${h - r} L${q},${top} Z`; };
  /* glass test tube (origin = middle of the rim); g.setMilk(0..1) clouds the limewater */
  function testTube(parent, w, h, liquidTop) {
    const g = G(parent);
    E('path', { d: tubeD(w, h) + 'Z', fill: 'rgba(200,230,245,0.06)' }, g);
    if (liquidTop !== null) {
      E('path', { d: liquidD(w, h, liquidTop), fill: 'rgba(140,205,240,0.32)' }, g);
      g.milk = E('path', { d: liquidD(w, h, liquidTop), fill: '#EEF3F6' }, g);
      E('path', { d: `M${-w / 2 + 5},${liquidTop} L${w / 2 - 5},${liquidTop}`, stroke: '#CFE9F7', 'stroke-width': 3, opacity: 0.7 }, g);
    }
    E('path', { d: tubeD(w, h), fill: 'none', stroke: '#BFD9E6', 'stroke-width': 4, 'stroke-linecap': 'round' }, g);
    E('line', { x1: -w / 2 - 8, y1: 0, x2: w / 2 + 8, y2: 0, stroke: '#BFD9E6', 'stroke-width': 5, 'stroke-linecap': 'round' }, g);
    E('line', { x1: -w / 2 + 10, y1: 18, x2: -w / 2 + 10, y2: h - w / 2 - 6, stroke: '#ffffff', 'stroke-width': 3, opacity: 0.22, 'stroke-linecap': 'round' }, g);
    g.setMilk = v => { if (g.milk) op(g.milk, clamp(v) * 0.9); };
    g.setMilk(0);
    return g;
  }
  /* hollow glass delivery tube through points */
  function glassTube(parent, pts, wide) {
    const d = 'M' + pts.map(p => p.join(',')).join(' L'), g = G(parent);
    E('path', { d, fill: 'none', stroke: '#9DB7C6', 'stroke-width': wide || 12, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, g);
    E('path', { d, fill: 'none', stroke: '#11303D', 'stroke-width': (wide || 12) - 6, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, g);
    return g;
  }
  /* position along a polyline, u in 0..1 */
  function along(pts, u) {
    const segs = []; let L = 0;
    for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); segs.push(l); L += l; }
    let d = clamp(u) * L;
    for (let i = 0; i < segs.length; i++) { if (d <= segs[i] || i === segs.length - 1) { const f = segs[i] ? d / segs[i] : 0; return [lerp(pts[i][0], pts[i + 1][0], f), lerp(pts[i][1], pts[i + 1][1], f)]; } d -= segs[i]; }
    return pts[pts.length - 1];
  }
  function header(text) {
    const c = chip(root, text, { size: 28, fill: 'rgba(10,27,39,0.78)', stroke: C.line, sw: 2, color: C.energy });
    tr(c, 1160 - c.w / 2, 60); op(c, 0); return c;
  }
  const beat = (t, a, b) => win(t, a, b, 0.45);

  /* ================= A. what experiments can detect ================= */
  const A = G(root);
  const cellA = animalCell(A, 175, 140, { sw: 5, seed: 12 });
  tr(cellA, 310, 420);
  const mA = mitochondrion(cellA.inner, 118, 52, { glow: true }); tr(mA, 64, 52, 1, -18);
  const mA2 = mitochondrion(cellA.inner, 96, 44, { glow: true }); tr(mA2, -70, 80, 1, 24);
  const qm = T(A, 470, 300, '?', { size: 96, weight: 700, fill: C.faint, anchor: 'middle' });
  const mag = G(A);
  E('line', { x1: 56, y1: 56, x2: 128, y2: 128, stroke: '#C9D6DE', 'stroke-width': 20, 'stroke-linecap': 'round' }, mag);
  E('circle', { r: 80, fill: 'rgba(159,216,255,0.10)', stroke: '#E4EDF2', 'stroke-width': 11 }, mag);
  E('path', { d: 'M-50,-28 A58,58 0 0 1 -14,-58', stroke: '#ffffff', 'stroke-width': 6, fill: 'none', opacity: 0.5, 'stroke-linecap': 'round' }, mag);
  const aTitle = T(A, 640, 205, 'Experiments look for:', { size: 30, weight: 600, fill: C.muted });
  const rowsA = [
    { y: 290, text: 'carbon dioxide given out', draw: g => { tr(molCO2(g, 15), 0, 0); return null; } },
    { y: 420, text: 'heat released', draw: g => { const h = heatWaves(g, { n: 3, h: 64, spacing: 20 }); tr(h, 0, 32); return h; } },
    { y: 550, text: 'oxygen used up', draw: g => { tr(molO2(g, 17), 0, 0); return null; } },
  ].map(r => {
    const g = G(A); tr(g, 700, r.y);
    card(g, -62, -52, 500, 104, { fill: C.card, stroke: C.line });
    const art = G(g); const anim = r.draw(art);
    T(g, 62, 11, r.text, { size: 29, weight: 600 });
    return { g, anim };
  });

  /* ================= B. the limewater test ================= */
  const hdr1 = header('Test 1 · Carbon dioxide');
  const B = G(root);
  const tubeB = testTube(B, 112, 380, 150); tr(tubeB, 420, 210);
  const bubB = bubbles(B, 392, 372, 40, 188, { n: 9, r: 7, seed: 3, speed: 0.45 });
  const pathB = [[200, 160], [404, 160], [404, 556]];
  glassTube(B, pathB);
  const co2B = [0, 1, 2].map(() => molCO2(B, 8));
  T(B, 200, 128, 'carbon dioxide in', { size: 26, weight: 600, fill: C.co2 });
  leader(B, 590, 468, 482, 478);
  T(B, 600, 476, 'limewater', { size: 30, weight: 600 });
  const stateClear = chip(B, 'clear', { size: 28, fill: 'rgba(140,205,240,0.22)', stroke: '#8CCDF0', sw: 2 });
  const stateMilky = chip(B, 'milky', { size: 28, fill: '#EEF3F6', color: C.bg0 });
  tr(stateClear, 650, 540); tr(stateMilky, 650, 540);
  const factB = G(B);
  card(factB, 790, 300, 350, 200, { fill: C.card, stroke: C.line });
  T(factB, 965, 352, 'Test for CO₂', { size: 30, weight: 700, fill: C.energy, anchor: 'middle' });
  T(factB, 965, 405, 'limewater turns', { size: 28, weight: 600, anchor: 'middle' });
  rich(factB, 965, 458, [['clear', '#8CCDF0'], [' → ', C.muted], ['milky', '#FFFFFF', 800]], { size: 34, anchor: 'middle' });

  /* ================= C. breathed-in vs breathed-out air ================= */
  const Cg = G(root);
  const face = G(Cg); tr(face, 600, 172);
  E('circle', { r: 50, fill: ball('#F7C8A0', '#C98B5E'), stroke: '#FFE2C8', 'stroke-width': 3 }, face);
  E('circle', { cx: -17, cy: -10, r: 5.5, fill: '#2A1D14' }, face);
  E('circle', { cx: 17, cy: -10, r: 5.5, fill: '#2A1D14' }, face);
  const mouth = E('ellipse', { cx: 0, cy: 22, rx: 11, ry: 8, fill: '#5A2A22' }, face);
  const tubeIn = testTube(Cg, 104, 330, 120); tr(tubeIn, 360, 300);
  const tubeOut = testTube(Cg, 104, 330, 120); tr(tubeOut, 840, 300);
  const bubIn = bubbles(Cg, 334, 428, 30, 170, { n: 8, r: 6, seed: 5, speed: 0.5 });
  const bubOut = bubbles(Cg, 842, 428, 34, 170, { n: 8, r: 6, seed: 6, speed: 0.5 });
  const pipeIn = G(Cg), pipeOut = G(Cg);
  glassTube(pipeIn, [[600, 224], [600, 252], [384, 252], [384, 392]], 11);
  glassTube(pipeIn, [[236, 276], [344, 276], [344, 600]], 11);
  const roomIn = arrow(Cg, 214, 248, 290, 248, { color: C.air, width: 5 });
  glassTube(pipeOut, [[600, 252], [852, 252], [852, 600]], 11);
  const flowIn = arrow(Cg, 430, 226, 510, 226, { color: C.air, width: 5 });
  const flowOut = arrow(Cg, 690, 226, 770, 226, { color: C.air, width: 5 });
  const lblIn = rich(Cg, 360, 684, ['air breathed ', ['in', C.air, 800]], { size: 28, anchor: 'middle' });
  const lblOut = rich(Cg, 840, 684, ['air breathed ', ['out', C.air, 800]], { size: 28, anchor: 'middle' });
  const watch = G(Cg); tr(watch, 600, 470);
  E('circle', { r: 40, fill: C.card, stroke: C.muted, 'stroke-width': 5 }, watch);
  E('rect', { x: -8, y: -56, width: 16, height: 12, rx: 3, fill: C.muted }, watch);
  const hand = E('line', { x1: 0, y1: 0, x2: 0, y2: -28, stroke: C.energy, 'stroke-width': 5, 'stroke-linecap': 'round' }, watch);
  E('circle', { r: 5, fill: C.energy }, watch);
  const secs = T(Cg, 600, 552, '0 s', { size: 30, weight: 700, anchor: 'middle' });
  const noteOut = G(Cg);
  T(noteOut, 915, 470, 'respiration', { size: 28, weight: 600, fill: C.ink });
  rich(noteOut, 915, 506, ['added ', ['CO₂', C.co2, 800]], { size: 28 });
  const noteIn = G(Cg);
  T(noteIn, 285, 470, 'only a little', { size: 26, weight: 600, fill: C.muted, anchor: 'end' });
  T(noteIn, 285, 504, 'CO₂', { size: 26, weight: 600, fill: C.muted, anchor: 'end' });

  /* ================= D-F. germinating vs boiled peas ================= */
  const hdr2 = header('Test 2 · Heat');
  const Dg = G(root);
  function vacuumFlask(parent, live) {
    const g = G(parent);
    E('rect', { x: -80, y: -150, width: 160, height: 310, rx: 34, fill: linGrad('#D3DEE5', '#7D93A2'), stroke: '#EEF4F7', 'stroke-width': 3 }, g);
    E('rect', { x: -62, y: -134, width: 124, height: 278, rx: 24, fill: '#0D2330', stroke: '#5E7A8C', 'stroke-width': 3 }, g);
    E('rect', { x: -73, y: -118, width: 7, height: 226, rx: 3.5, fill: '#ffffff', opacity: 0.35 }, g);
    const r = rng(live ? 31 : 37);
    for (let row = 0; row < 5; row++) for (let k = 0; k < 4; k++) {
      const x = -39 + k * 26 + (row % 2 ? 6 : -6) + (r() - 0.5) * 4, y = 128 - row * 23 + (r() - 0.5) * 4;
      E('circle', { cx: x.toFixed(1), cy: y.toFixed(1), r: 12.5, fill: live ? ball('#86D964', '#3F8F2F') : ball('#CFC48E', '#8C845A'), stroke: live ? '#2F6E24' : '#77704C', 'stroke-width': 1.5 }, g);
      if (live && row >= 3 && r() > 0.3) E('path', { d: `M${x.toFixed(1)},${(y - 10).toFixed(1)} q${(-6 + r() * 12).toFixed(1)},-13 ${(6 - r() * 12).toFixed(1)},-21`, stroke: '#F3F0D2', 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round' }, g);
    }
    E('path', { d: closedPath(blobPts(64, 22, 12, 0, 0.14, live ? 2 : 3)), fill: '#F4F7FA', stroke: '#C9D6DE', 'stroke-width': 2, transform: 'translate(0 -150)' }, g);
    g.thG = G(g);
    g.th = thermometer(g.thG, 330, C.bad); tr(g.th, 24, 104);
    g.read = T(g.thG, 24, -252, '20 °C', { size: 30, weight: 700, anchor: 'middle' });
    return g;
  }
  const live = vacuumFlask(Dg, true); tr(live, 300, 410);
  const dead = vacuumFlask(Dg, false); tr(dead, 640, 410);
  const liveLbl = T(Dg, 300, 616, 'living, germinating peas', { size: 27, weight: 600, anchor: 'middle', fill: C.plant });
  const deadLbl = T(Dg, 640, 616, 'boiled, dead peas', { size: 27, weight: 600, anchor: 'middle', fill: '#D9CF97' });
  const hw = heatWaves(Dg, { n: 3, h: 84, spacing: 24 }); tr(hw, 236, 250);
  const deadNote = T(Dg, 640, 660, 'can’t respire, so no heat', { size: 25, weight: 600, anchor: 'middle', fill: C.muted });
  // days + temperature graph
  const graph = G(Dg);
  card(graph, 900, 142, 150, 54, { fill: C.card, stroke: C.line, rx: 27 });
  const dayTxt = T(graph, 975, 179, 'Day 1', { size: 30, weight: 700, anchor: 'middle', fill: C.energy });
  E('path', { d: 'M850,262 L850,520 L1132,520', stroke: C.muted, 'stroke-width': 3, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, graph);
  T(graph, 846, 246, 'temperature', { size: 24, weight: 600, fill: C.muted });
  T(graph, 1132, 556, 'days', { size: 24, weight: 600, fill: C.muted, anchor: 'end' });
  const lineLive = E('path', { d: 'M852,470 C930,462 1000,392 1118,310', stroke: C.plant, 'stroke-width': 6, fill: 'none', 'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': '1 1' }, graph);
  const lineDead = E('path', { d: 'M852,474 L1118,474', stroke: '#D9CF97', 'stroke-width': 6, fill: 'none', 'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': '1 1' }, graph);
  const lblLive = T(graph, 1100, 300, 'living', { size: 24, weight: 700, fill: C.plant, anchor: 'end' });
  const lblDead = T(graph, 1118, 456, 'dead', { size: 24, weight: 700, fill: '#D9CF97', anchor: 'end' });
  // the control tag and disinfectant
  const ctrl = chip(Dg, 'the CONTROL', { size: 26, fill: C.energy, color: C.bg0 }); tr(ctrl, 640, 666);
  const dis = G(Dg); tr(dis, 960, 330);
  const bottle = G(dis); tr(bottle, -70, -60, 1, 125);
  E('rect', { x: -34, y: -58, width: 68, height: 116, rx: 14, fill: ball('#6CC9F0', '#2B87B8'), stroke: '#BFE6F7', 'stroke-width': 3 }, bottle);
  E('rect', { x: -14, y: -84, width: 28, height: 28, rx: 5, fill: '#6CC9F0', stroke: '#BFE6F7', 'stroke-width': 3 }, bottle);
  E('rect', { x: -18, y: -102, width: 36, height: 20, rx: 5, fill: '#F4F7FA' }, bottle);
  E('rect', { x: -24, y: -22, width: 48, height: 44, rx: 6, fill: '#F4F7FA' }, bottle);
  E('path', { d: 'M0,-14 V14 M-14,0 H14', stroke: C.bad, 'stroke-width': 7, 'stroke-linecap': 'round' }, bottle);
  const drops = [0, 1, 2].map(() => E('path', { d: 'M0,-9 C5,-2 7,3 7,6 A7,7 0 0 1 -7,6 C-7,3 -5,-2 0,-9 Z', fill: '#8FD8F7' }, dis));
  E('ellipse', { cx: 40, cy: 110, rx: 100, ry: 24, fill: 'rgba(200,230,245,0.18)', stroke: '#BFD9E6', 'stroke-width': 3 }, dis);
  const dr = rng(44), microbes = [];
  for (let k = 0; k < 7; k++) {
    const x = -20 + k * 20, y = 104 + (k % 2) * 8;
    E('circle', { cx: x, cy: y, r: 9, fill: ball('#86D964', '#3F8F2F') }, dis);
    const mb = E('rect', { x: x - 6 + dr() * 6, y: y - 18 - dr() * 6, width: 12, height: 6, rx: 3, fill: '#C79BFF' }, dis);
    microbes.push(mb);
  }
  T(dis, 30, 196, 'disinfectant stops', { size: 26, weight: 600, anchor: 'middle' });
  T(dis, 30, 230, 'microbes making heat', { size: 26, weight: 600, anchor: 'middle' });

  /* ================= G. the respirometer ================= */
  const hdr3 = header('Test 3 · Oxygen');
  const Gr = G(root);
  const RX = 300, RY = 262;                      // tube rim
  const glass = G(Gr); tr(glass, RX, RY);
  E('path', { d: tubeD(132, 330) + 'Z', fill: 'rgba(200,230,245,0.06)' }, glass);
  const lime = G(glass), lr = rng(52);
  for (let k = 0; k < 34; k++) {
    const a = lr(), x = (lr() - 0.5) * 104, y = 262 + lr() * 52;
    if (Math.hypot(x, Math.max(0, y - 264)) > 56) continue;
    E('circle', { cx: x.toFixed(1), cy: y.toFixed(1), r: (6 + a * 4).toFixed(1), fill: a > 0.5 ? '#E8EEF2' : '#C9D9E3', stroke: '#9DB7C6', 'stroke-width': 1.5 }, lime);
  }
  E('path', { d: 'M-62,246 L62,246', stroke: '#C9D6DE', 'stroke-width': 4, 'stroke-dasharray': '8 6' }, glass);
  const sr = rng(61);
  for (let k = 0; k < 5; k++) {
    const x = -46 + k * 23, y = 232;
    E('circle', { cx: x, cy: y, r: 11.5, fill: ball('#86D964', '#3F8F2F'), stroke: '#2F6E24', 'stroke-width': 1.5 }, glass);
    if (k % 2 === 0) E('path', { d: `M${x},${y - 9} q${(-5 + sr() * 10).toFixed(1)},-12 ${(5 - sr() * 10).toFixed(1)},-19`, stroke: '#F3F0D2', 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round' }, glass);
  }
  const o2s = [], or = rng(73);
  for (let k = 0; k < 6; k++) { const m = molO2(glass, 11); o2s.push({ m, x: -36 + (k % 3) * 36 + (or() - 0.5) * 10, y: 70 + Math.floor(k / 3) * 70 + or() * 30, ph: or() * TAU }); }
  const co2s = [0, 1, 2].map(k => ({ m: molCO2(glass, 8), x: -34 + k * 34 }));
  E('path', { d: tubeD(132, 330), fill: 'none', stroke: '#BFD9E6', 'stroke-width': 4, 'stroke-linecap': 'round' }, glass);
  E('path', { d: 'M-84,-34 L84,-34 L70,16 L-70,16 Z', fill: ball('#A9483A', '#6E2A21'), stroke: '#C86A58', 'stroke-width': 3, 'stroke-linejoin': 'round' }, glass);
  glassTube(Gr, [[RX, RY - 34], [RX, 150], [1092, 150]], 16);
  const ruler = G(Gr);
  E('rect', { x: 470, y: 176, width: 600, height: 20, rx: 4, fill: '#E9DFC4', opacity: 0.92 }, ruler);
  for (let k = 0; k <= 30; k++) E('line', { x1: 470 + k * 20, y1: 176, x2: 470 + k * 20, y2: k % 5 ? 184 : 192, stroke: '#5A4A2A', 'stroke-width': 2 }, ruler);
  const drop = E('rect', { x: -24, y: -4, width: 48, height: 8, rx: 4, fill: '#FF4F6A' }, Gr);
  const rLabels = [
    G(Gr), G(Gr), G(Gr), G(Gr),
  ];
  leader(rLabels[0], 470, 262, 390, 246); T(rLabels[0], 480, 270, 'sealed tube', { size: 28, weight: 600 });
  leader(rLabels[1], 470, 478, 362, 488); rich(rLabels[1], 480, 486, [['living', C.plant, 700], ' seeds'], { size: 28 });
  leader(rLabels[2], 470, 552, 366, 548); rich(rLabels[2], 480, 560, ['chemical ', ['absorbs CO₂', C.co2, 700]], { size: 28 });
  const moveArrow = arrow(rLabels[3], 960, 222, 760, 222, { color: '#FF4F6A', width: 5 });
  rich(rLabels[3], 860, 268, ['drop moves as ', ['O₂', C.oxygen, 800], ' is used'], { size: 28, anchor: 'middle' });

  /* ================= H. fair test ================= */
  const Hf = G(root);
  card(Hf, 210, 150, 780, 500, { fill: C.card, stroke: C.line });
  T(Hf, 600, 224, 'Make it a fair test', { size: 46, weight: 700, anchor: 'middle' });
  const checks = [
    { y: 320, segs: ['Change just ', ['one', C.energy, 800], ' variable'], sub: 'e.g. living or boiled seeds' },
    { y: 430, segs: ['Keep everything else the ', ['same', C.energy, 800]], sub: 'same flasks, thermometers and room' },
    { y: 540, segs: ['Include a ', ['control', C.energy, 800], ' to compare with'], sub: 'the boiled seeds' },
  ].map(r => {
    const g = G(Hf);
    E('rect', { x: 262, y: r.y - 34, width: 48, height: 48, rx: 10, fill: '#0D2330', stroke: C.muted, 'stroke-width': 3 }, g);
    const tk = tick(g, 17, C.good);
    rich(g, 336, r.y, r.segs, { size: 33 });
    T(g, 336, r.y + 36, r.sub, { size: 24, weight: 500, fill: C.muted, font: FB });
    return { g, tk, y: r.y };
  });

  /* ================= update ================= */
  return t => {
    const tA0 = S.first - 0.6, tB0 = at('lime') - 0.1, tC0 = at('inout') - 0.1, tD0 = at('flasks') - 0.1, tG0 = at('respirometer') - 0.1, tH0 = at('fair') - 0.1;
    const aA = beat(t, tA0, tB0 + 0.35), aB = beat(t, tB0, tC0 + 0.35), aC = beat(t, tC0, tD0 + 0.35), aD = beat(t, tD0, tG0 + 0.35), aG = beat(t, tG0, tH0 + 0.35), aH = P(t, tH0, 0.45, linear);
    op(A, aA); op(B, aB); op(Cg, aC); op(Dg, aD); op(Gr, aG); op(Hf, aH);
    op(hdr1, Math.max(beat(t, tB0, tD0 + 0.35))); op(hdr2, aD); op(hdr3, aG);

    if (aA > 0) {
      cellA.upd(t); mA.upd(t); mA2.upd(t + 1);
      const sweep = wave(t, 4.2) * calm;
      tr(mag, lerp(230, 400, sweep), lerp(360, 470, wave(t, 3.1, 0.3) * calm));
      op(qm, 0.4 + 0.6 * wave(t, 2.4));
      op(aTitle, P(t, mid('detect', 0.4), 0.5, linear));
      rowsA.forEach((r, i) => {
        const p = P(t, mid('detect', 0.48 + i * 0.13), 0.5, pop);
        op(r.g, clamp(p * 2)); tr(r.g, 700 + (1 - clamp(p)) * 40, [290, 420, 550][i]);
        if (r.anim) r.anim.upd(t);
      });
    }

    if (aB > 0) {
      const bOn = P(t, mid('lime', 0.12), 0.6, linear);
      bubB.upd(t, bOn);
      co2B.forEach((m, k) => {
        const u = ((t - mid('lime', 0.1)) / 2.4 + k / 3) % 1;
        const on = t > mid('lime', 0.1) ? 1 : 0;
        const p = along(pathB, u); tr(m, p[0], p[1]);
        op(m, on * Math.min(1, u * 8, (1 - u) * 8));
      });
      const milk = P(t, mid('lime', 0.3), Math.max(1, end('lime') - mid('lime', 0.3)) * 0.85, ease);
      tubeB.setMilk(milk);
      op(stateClear, 1 - clamp((milk - 0.45) / 0.15)); op(stateMilky, clamp((milk - 0.45) / 0.15));
      const fp = P(t, mid('lime', 0.55), 0.6, pop); op(factB, clamp(fp * 2)); tr(factB, (1 - clamp(fp)) * 30, 0);
    }

    if (aC > 0) {
      const breath = (t % 3.2) / 3.2, inhale = breath < 0.5 ? 1 : 0;
      const sIn = P(t, mid('inout', 0.02), 0.5, pop), sOut = P(t, mid('inout', 0.26), 0.5, pop);
      op(tubeIn, clamp(sIn * 2)); op(tubeOut, clamp(sOut * 2)); op(pipeIn, clamp(sIn * 2)); op(pipeOut, clamp(sOut * 2)); op(lblIn, clamp(sIn * 2)); op(lblOut, clamp(sOut * 2));
      const bIn = sIn * (breath < 0.5 ? Math.sin(breath / 0.5 * Math.PI) : 0);
      const bOut = sOut * (breath >= 0.5 ? Math.sin((breath - 0.5) / 0.5 * Math.PI) : 0);
      bubIn.upd(t, bIn); bubOut.upd(t, bOut);
      flowIn.set(1); flowOut.set(1); roomIn.set(1);
      op(flowIn, sIn * (0.25 + 0.75 * bIn)); op(roomIn, sIn * (0.25 + 0.75 * bIn)); op(flowOut, sOut * (0.25 + 0.75 * bOut));
      attr(mouth, 'ry', 5 + 5 * (inhale ? bIn : bOut));
      const run = P(t, mid('inout', 0.05), end('inout') + 0.4 - mid('inout', 0.05), linear);
      setText(secs, Math.round(run * 60) + ' s');
      attr(hand, 'transform', `rotate(${(run * 360).toFixed(1)})`);
      tubeOut.setMilk(P(t, mid('inout', 0.42), 3.8, ease));
      tubeIn.setMilk(0.22 * P(t, mid('inout', 0.42), 9, linear));
      op(noteOut, P(t, mid('inout', 0.78), 0.5, linear)); op(noteIn, P(t, mid('inout', 0.62), 0.5, linear));
    }

    if (aD > 0) {
      const pl = P(t, mid('flasks', 0.12), 0.6, pop), pd = P(t, mid('flasks', 0.5), 0.6, pop), pth = P(t, mid('flasks', 0.8), 0.6, linear);
      op(live, clamp(pl * 2)); tr(live, 300, 410 + (1 - clamp(pl)) * 30);
      op(dead, clamp(pd * 2)); tr(dead, 640, 410 + (1 - clamp(pd)) * 30);
      op(liveLbl, clamp(pl * 2)); op(deadLbl, clamp(pd * 2));
      op(live.thG, pth); op(dead.thG, pth);
      const W0 = at('warmer'), WL = end('warmer') - W0;
      const day = 1 + Math.min(2, Math.floor(3 * P(t, W0 + 0.2, WL * 0.42, linear)));
      const warm = P(t, mid('warmer', 0.14), WL * 0.5, ease);
      live.th.set(0.3 + 0.48 * warm); dead.th.set(0.3);
      setText(live.read, (20 + Math.round(warm * 6)) + ' °C'); setText(dead.read, '20 °C');
      const gIn = win(t, W0 - 0.2, mid('control', 0.34), 0.45);
      op(graph, gIn); setText(dayTxt, 'Day ' + day);
      lineLive.setAttribute('stroke-dashoffset', (1 - P(t, mid('warmer', 0.12), WL * 0.5, linear)).toFixed(3));
      lineDead.setAttribute('stroke-dashoffset', (1 - P(t, mid('warmer', 0.12), WL * 0.5, linear)).toFixed(3));
      op(lblLive, P(t, mid('warmer', 0.5), 0.4, linear)); op(lblDead, P(t, mid('warmer', 0.66), 0.4, linear));
      hw.upd(t); op(hw, warm * 0.95);
      op(deadNote, P(t, mid('warmer', 0.66), 0.5, linear) * (1 - P(t, mid('control', 0.0), 0.3, linear)));
      const pc = P(t, mid('control', 0.04), 0.5, pop); op(ctrl, clamp(pc * 2)); tr(ctrl, 640, 666, Math.max(0.01, pc));
      const pdis = P(t, mid('control', 0.36), 0.6, pop); op(dis, clamp(pdis * 2)); tr(dis, 960 + (1 - clamp(pdis)) * 40, 330);
      const pour = clamp((t - mid('control', 0.45)) / 0.4);
      drops.forEach((dr_, k) => {
        const u = ((t - mid('control', 0.45)) / 0.9 + k / 3) % 1;
        tr(dr_, -10 + u * 30, -8 + u * 112); op(dr_, pour * (t < end('control') + 6 ? 1 : 0) * Math.min(1, u * 6, (1 - u) * 6));
      });
      const kill = P(t, mid('control', 0.6), 1.6, linear);
      microbes.forEach((m, k) => op(m, 1 - clamp(kill * 1.6 - k * 0.1)));
    }

    if (aG > 0) {
      const R0 = at('respirometer'), RL = end('respirometer') - R0;
      rLabels.forEach((g, k) => op(g, P(t, mid('respirometer', [0.1, 0.16, 0.34, 0.6][k]), 0.5, linear)));
      o2s.forEach((o, k) => {
        tr(o.m, o.x + Math.sin(t * 0.9 * calm + o.ph) * 6, o.y + Math.cos(t * 0.7 * calm + o.ph) * 5, 1, (t * 20 * calm + k * 50) % 360);
        op(o.m, k < 2 ? 1 : 1 - P(t, mid('respirometer', 0.14 + k * 0.035), 0.6, linear));
      });
      co2s.forEach((o, k) => {
        const u = P(t, mid('respirometer', 0.36 + k * 0.05), 2.2, ease);
        tr(o.m, o.x, lerp(212, 290, u));
        op(o.m, u <= 0 ? 0 : Math.min(1, u * 5) * (1 - P(u, 0.75, 0.25, linear)));
      });
      const mv = P(t, mid('respirometer', 0.58), RL * 0.42 + 0.4, linear);
      tr(drop, lerp(990, 640, mv), 150);
      moveArrow.set(P(t, mid('respirometer', 0.6), 0.8));
    }

    if (aH > 0) {
      checks.forEach((c, i) => {
        const p = P(t, mid('fair', [0.33, 0.5, 0.7][i]), 0.5, linear);
        op(c.g, p); tr(c.g, (1 - p) * 24, 0);
        const k = P(t, mid('fair', [0.33, 0.5, 0.7][i]) + 0.5, 0.45, pop);
        op(c.tk, clamp(k * 2)); tr(c.tk, 286, c.y - 10, Math.max(0.01, k));
      });
    }
  };
});
