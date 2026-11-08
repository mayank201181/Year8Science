/* Intro: a red cabbage is chopped into warm water and makes a purple juice that changes colour
   -> three cups: lemon juice flashes one pink (acid), bicarbonate of soda turns one blue (alkali);
   acids and alkalis are in the kitchen, the soil and the stomach -> magnesium fizzes in acid while
   copper just sits there -> the title and a three-card roadmap (pH scale, neutralisation, reactivity). */
scene('intro', S => {
  const { at, mid } = S, root = S.root, R = S.reduce;
  const AMP = R ? 0.3 : 1;

  /* ---------- local helpers ---------- */
  const hx = c => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16));
  const mix = (a, b, p) => { const A = hx(a), B = hx(b); p = clamp(p); return '#' + A.map((v, i) => Math.round(lerp(v, B[i], p)).toString(16).padStart(2, '0')).join(''); };
  let clipN = 0;
  const clipTo = d => { const id = 'am-intro-c' + (++clipN); const cp = E('clipPath', { id }, defs()); E('path', { d }, cp); return `url(#${id})`; };
  function rich(parent, x, y, segs, o) {
    o = o || {};
    const t = E('text', { x, y, 'font-size': o.size || 30, 'font-weight': o.weight || 600, 'font-family': o.font || FD, 'text-anchor': o.anchor || 'start', fill: o.fill || C.ink }, parent);
    segs.forEach(s => { if (typeof s === 'string') s = [s]; E('tspan', { fill: s[1], 'font-weight': s[2] }, t).textContent = s[0]; });
    return t;
  }
  /* pop an element in at (x, y): p 0..1 */
  const popAt = (el, x, y, p, s0) => { s0 = s0 === undefined ? 0.6 : s0; op(el, clamp(p * 2)); tr(el, x, y, Math.max(0.01, s0 + (1 - s0) * p)); };

  const CAB = { purple: '#8B4FB8', pink: '#F0508C', blue: '#3F8FE8', green: '#4CC26E', yellow: '#E6D34A' };
  const CLEAR = '#CFE7F5', BENCH = 590;
  const CBF = '#B14E9A', CBD = '#4A1544', CBE = '#5E1B57', VEIN = '#EBC8E6';
  const PH = ['#E8424F', '#E8424F', '#E8424F', '#FF8A3D', '#FF8A3D', '#FFD84D', '#FFD84D', '#56D69B', '#3F8FE8', '#3F8FE8', '#3F8FE8', '#3F8FE8', '#8E5CF0', '#8E5CF0', '#8E5CF0'];

  /* ---------- art ---------- */
  function cabbage(parent, r) {
    const g = G(parent);
    E('circle', { r, fill: ball(CBF, CBD), stroke: CBE, 'stroke-width': 4 }, g);
    E('path', { d: `M${-r * 0.97},${r * 0.22} C${-r * 0.93},${-r * 0.55} ${-r * 0.45},${-r * 0.98} ${r * 0.22},${-r * 0.97}`, fill: 'none', stroke: CBE, 'stroke-width': 4, 'stroke-linecap': 'round' }, g);
    E('path', { d: `M${r * 0.96},${r * 0.32} C${r * 0.99},${-r * 0.3} ${r * 0.62},${-r * 0.82} ${-r * 0.04},${-r * 0.99}`, fill: 'none', stroke: CBE, 'stroke-width': 4, 'stroke-linecap': 'round', opacity: 0.8 }, g);
    [[-0.84, -0.16, -0.55, 0.38], [-0.4, -0.8, -0.22, 0.08], [0.3, -0.85, 0.16, 0.02], [0.85, -0.1, 0.48, 0.42]].forEach(([x, y, cx, cy]) =>
      E('path', { d: `M0,${r * 0.86} Q${cx * r},${cy * r} ${x * r},${y * r}`, fill: 'none', stroke: VEIN, 'stroke-width': r * 0.07, 'stroke-linecap': 'round', opacity: 0.85 }, g));
    [[-0.5, 0.2, -0.78, 0.12], [-0.28, -0.35, -0.55, -0.55], [0.2, -0.38, 0.5, -0.6], [0.55, 0.22, 0.8, 0.18]].forEach(([x1, y1, x2, y2]) =>
      E('path', { d: `M${x1 * r},${y1 * r} L${x2 * r},${y2 * r}`, stroke: VEIN, 'stroke-width': r * 0.035, 'stroke-linecap': 'round', opacity: 0.6 }, g));
    E('ellipse', { cx: 0, cy: r * 0.9, rx: r * 0.15, ry: r * 0.08, fill: '#E3EDCF', stroke: '#B9C9A2', 'stroke-width': 2 }, g);
    return g;
  }
  /* half a cabbage, cut face showing (side -1 left half, +1 right half); flat face on x = 0 */
  function cabbageHalf(parent, r, side) {
    const g = G(parent);
    const d = `M0,${-r} A${r},${r} 0 0 ${side > 0 ? 1 : 0} 0,${r} Z`;
    E('path', { d, fill: ball('#9C3F8A', CBD), stroke: CBE, 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
    const inner = G(g, { 'clip-path': clipTo(d) });
    for (let k = 0; k < 5; k++) {
      const rr = r * (0.2 + k * 0.17), pts = [];
      for (let i = 0; i <= 24; i++) { const a = -Math.PI / 2 + i / 24 * Math.PI, w = 1 + 0.1 * Math.sin(a * 7 + k * 1.7); pts.push([side * Math.cos(a) * rr * w, Math.sin(a) * rr * w]); }
      E('path', { d: openPath(pts), fill: 'none', stroke: VEIN, 'stroke-width': 4.5, opacity: 0.85 }, inner);
    }
    E('path', { d: `M0,${-r * 0.5} Q${side * r * 0.34},${r * 0.1} 0,${r * 0.8} Z`, fill: '#F1E6EE', opacity: 0.92 }, inner);
    return g;
  }
  function chunk(parent, s, seed) {
    const g = G(parent), q = rng(seed), pts = [];
    for (let i = 0; i < 6; i++) { const a = i / 6 * TAU + q() * 0.4, k = s * (0.75 + q() * 0.35); pts.push([Math.cos(a) * k, Math.sin(a) * k * 0.85]); }
    E('path', { d: closedPath(pts), fill: ball(CBF, CBD), stroke: CBE, 'stroke-width': 2.5 }, g);
    E('path', { d: `M${-s * 0.55},${s * 0.15} Q0,${-s * 0.35} ${s * 0.55},${-s * 0.1}`, fill: 'none', stroke: VEIN, 'stroke-width': 3.5, 'stroke-linecap': 'round', opacity: 0.85 }, g);
    return g;
  }
  function lemonHalf(parent) {
    const g = G(parent);
    E('path', { d: 'M-54,0 C-54,-34 -28,-50 0,-50 C28,-50 54,-34 54,0 Z', fill: ball('#FFE45C', '#C9A21A'), stroke: '#E8C23A', 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
    E('ellipse', { cx: 0, cy: 0, rx: 54, ry: 11, fill: '#FFF3B0', stroke: '#E8C23A', 'stroke-width': 3 }, g);
    for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI; E('line', { x1: 0, y1: 0, x2: Math.cos(a) * 44, y2: Math.sin(a) * 8, stroke: '#F1D35A', 'stroke-width': 2 }, g); E('line', { x1: 0, y1: 0, x2: -Math.cos(a) * 44, y2: -Math.sin(a) * 8, stroke: '#F1D35A', 'stroke-width': 2 }, g); }
    return g;
  }
  /* a teaspoon held at the end of its handle (0,0); the bowl is at (-140, 0) */
  function spoon(parent) {
    const g = G(parent);
    E('rect', { x: -118, y: -6, width: 124, height: 12, rx: 6, fill: '#B8C4CF', stroke: '#7D8C99', 'stroke-width': 2 }, g);
    E('ellipse', { cx: -140, cy: 0, rx: 34, ry: 18, fill: ball('#D5DEE6', '#8C99A6'), stroke: '#7D8C99', 'stroke-width': 2.5 }, g);
    E('path', { d: 'M-166,-4 Q-158,-20 -146,-14 Q-138,-24 -128,-14 Q-118,-18 -114,-4 Z', fill: '#F7F9FA', stroke: '#D8DEE3', 'stroke-width': 2 }, g);
    return g;
  }
  function drop(parent, color) { return E('path', { d: 'M0,-9 C5,-2 7,3 7,6 A7,7 0 0 1 -7,6 C-7,3 -5,-2 0,-9 Z', fill: color }, parent); }
  function vinegarIcon(parent) {
    const g = G(parent);
    E('rect', { x: -9, y: -58, width: 18, height: 12, rx: 3, fill: '#C0392B' }, g);
    E('path', { d: 'M-8,-46 L-8,-34 Q-26,-26 -26,-10 L-26,40 Q-26,48 -18,48 L18,48 Q26,48 26,40 L26,-10 Q26,-26 8,-34 L8,-46 Z', fill: 'rgba(200,230,250,0.12)', stroke: GLASS.stroke, 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
    E('path', { d: 'M-23,-4 L23,-4 L23,40 Q23,45 18,45 L-18,45 Q-23,45 -23,40 Z', fill: '#D9B26A', opacity: 0.85 }, g);
    E('rect', { x: -20, y: 6, width: 40, height: 22, rx: 3, fill: '#F4F7FA' }, g);
    E('line', { x1: -12, x2: 12, y1: 14, y2: 14, stroke: '#C0392B', 'stroke-width': 3 }, g);
    E('line', { x1: -9, x2: 9, y1: 21, y2: 21, stroke: '#9AA6B1', 'stroke-width': 2.5 }, g);
    return g;
  }
  function spadeIcon(parent) {
    const g = G(parent);
    E('rect', { x: -5, y: -62, width: 10, height: 64, rx: 4, fill: '#C8A165', stroke: '#8E6B3A', 'stroke-width': 2 }, g);
    E('rect', { x: -16, y: -66, width: 32, height: 10, rx: 5, fill: '#C8A165', stroke: '#8E6B3A', 'stroke-width': 2 }, g);
    E('path', { d: 'M-22,2 L22,2 L20,30 Q0,46 -20,30 Z', fill: ball('#C9D3DC', '#7D8C99'), stroke: '#8C99A6', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, g);
    E('path', { d: 'M-48,50 Q-36,22 -12,28 Q0,14 16,26 Q38,20 48,50 Z', fill: ball('#8A6040', C.soil), stroke: '#4E3524', 'stroke-width': 2 }, g);
    [[-24, 42], [-4, 38], [18, 42], [32, 46]].forEach(([x, y]) => E('circle', { cx: x, cy: y, r: 3, fill: '#4E3524' }, g));
    return g;
  }
  function stomachIcon(parent) {
    const g = G(parent);
    E('path', { d: 'M-22,-60 L-20,-30', stroke: '#F7A8C8', 'stroke-width': 14, 'stroke-linecap': 'round' }, g);
    E('path', { d: 'M38,-6 L56,-16', stroke: '#F7A8C8', 'stroke-width': 12, 'stroke-linecap': 'round' }, g);
    E('path', { d: closedPath([[-30, -34], [-8, -30], [4, -12], [18, -2], [38, -14], [48, -2], [36, 26], [6, 46], [-26, 42], [-46, 18], [-46, -12]]), fill: ball('#F48FB0', '#B8466A'), stroke: '#FFD0DC', 'stroke-width': 3 }, g);
    E('path', { d: 'M-34,26 Q-8,40 24,26 L22,34 Q-6,46 -32,34 Z', fill: '#FF6A3D', opacity: 0.8 }, g);
    return g;
  }

  /* ---------- the kitchen bench (always) ---------- */
  const bench = G(root);
  E('rect', { x: -10, y: BENCH, width: 1220, height: 170, fill: linGrad('#5C3C27', '#24160D', true) }, bench);
  [[636, 1], [668, 0.6], [701, 0.85], [732, 0.5]].forEach(([y, o]) => E('path', { d: `M-10,${y} C300,${y - 6} 700,${y + 8} 1210,${y - 3}`, stroke: '#8A5E3E', 'stroke-width': 2, fill: 'none', opacity: 0.45 * o }, bench));
  E('rect', { x: -10, y: BENCH - 8, width: 1220, height: 18, rx: 5, fill: '#8E623F' }, bench);
  E('rect', { x: -10, y: BENCH - 8, width: 1220, height: 4, rx: 2, fill: '#C08D60', opacity: 0.7 }, bench);

  /* ---------- hook: the cabbage, chopped into warm water ---------- */
  const H1 = G(root);
  const board = G(H1);
  E('ellipse', { cx: 330, cy: 588, rx: 175, ry: 10, fill: '#000000', opacity: 0.22 }, board);
  E('rect', { x: 165, y: 568, width: 330, height: 18, rx: 7, fill: '#D6B27E', stroke: '#9E7A48', 'stroke-width': 2 }, board);
  E('rect', { x: 452, y: 573, width: 26, height: 8, rx: 4, fill: '#9E7A48', opacity: 0.6 }, board);
  const CX = 330, CY = 468, CRAD = 100;
  const whole = G(H1); cabbage(whole, CRAD);
  const halves = [-1, 1].map(s => { const g = G(H1); cabbageHalf(g, CRAD, s); return g; });
  const cutGlow = E('ellipse', { cx: CX, cy: CY, rx: 34, ry: 150, fill: glow('#FFFFFF') }, H1);
  const cut = E('line', { x1: CX, y1: CY - CRAD - 34, x2: CX, y2: CY + CRAD + 4, stroke: '#FFFFFF', 'stroke-width': 6, 'stroke-linecap': 'round' }, H1);
  const juiceLbl = labelLine(H1, 944, 456, 884, 500, 'red cabbage\njuice', { size: 30, fill: '#D9B8F0', weight: 700 });
  const spy = G(H1);
  const spyChip = chip(spy, 'spy gadget!', { size: 30, fill: C.card2, stroke: '#B48CFF' }); tr(spyChip, 22, 0);
  const mag = G(spy); tr(mag, -spyChip.w / 2 - 22, 0);
  E('line', { x1: 9, y1: 9, x2: 22, y2: 22, stroke: '#E4EDF2', 'stroke-width': 7, 'stroke-linecap': 'round' }, mag);
  E('circle', { r: 15, fill: 'rgba(180,140,255,0.25)', stroke: '#E4EDF2', 'stroke-width': 5 }, mag);
  const SW = [CAB.pink, CAB.purple, CAB.blue, CAB.green, CAB.yellow];
  const swatches = SW.map(c => E('circle', { r: 12, fill: c, stroke: '#ffffff', 'stroke-width': 2.5 }, H1));
  const wisp = heatWaves(H1, { n: 3, h: 44, spacing: 30, color: '#FFB067', width: 4, speed: 0.5 }); tr(wisp, 800, 336);

  /* ---------- the three cups (the middle one starts as the warm beaker) ---------- */
  const cupGlow = [G(root), G(root)].map((g, i) => E('ellipse', { rx: 150, ry: 150, fill: glow(i ? CAB.blue : CAB.pink) }, g));
  const cups = [0, 1, 2].map(i => { const g = G(root); const b = beaker(g, 220, 250, { marks: false, level: 0.62, liquid: i === 1 ? CLEAR : CAB.purple, opacity: i === 1 ? 0.25 : 0.88 }); return { g, b }; });
  const BK = [800, 465], CUPY = 515, CUPS = 0.62, CUPX = [330, 600, 870];
  const SURF = 590 - 232 * 0.62, CSURF = CUPY + (125 - 232 * 0.62) * CUPS;   // water surface: big beaker, cup
  const swirl = E('path', { fill: 'none', stroke: '#B98CE6', 'stroke-width': 6, 'stroke-linecap': 'round' }, root);
  { const pts = []; for (let i = 0; i <= 60; i++) { const a = i / 60 * 3.6 * Math.PI, rr = 6 + a * 6.2; pts.push([Math.cos(a) * rr, Math.sin(a) * rr * 0.62]); } swirl.setAttribute('d', openPath(pts)); }
  const chunkG = G(root), cr = rng(23), chunks = [];
  const CHS = [[-0.52, -0.42], [-0.62, 0.28], [-0.24, -0.06], [-0.3, 0.6], [0.52, -0.4], [0.6, 0.3], [0.24, 0.04], [0.32, 0.62]];
  CHS.forEach(([fx, fy], i) => {
    const side = fx < 0 ? -1 : 1;
    chunks.push({ g: chunk(chunkG, 17 + cr() * 5, 30 + i), x0: CX + side * 46 + fx * CRAD, y0: CY + fy * CRAD, x1: 730 + (i % 4) * 44 + cr() * 14, y1: SURF + 34 + Math.floor(i / 4) * 44 + cr() * 18, t0: 2.15 + i * 0.12, bend: 150 + cr() * 80, ph: cr() * TAU });
  });
  const splashes = chunks.map(() => E('ellipse', { rx: 22, ry: 6, fill: 'none', stroke: '#E4EDF2', 'stroke-width': 3 }, root));

  /* ---------- secret: lemon juice and bicarbonate of soda ---------- */
  const SEC = G(root);
  const lemon = G(SEC); lemonHalf(lemon);
  const lemonNote = T(SEC, 330, 268, 'lemon juice', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  const lDrops = [0, 1, 2].map(() => drop(SEC, '#FFF3A0'));
  const spoonG = G(SEC); spoon(spoonG);
  const spoonNote = T(SEC, 930, 318, 'bicarbonate of soda', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  const grains = []; for (let k = 0; k < 9; k++) grains.push(E('circle', { r: 3.2 + (k % 3), fill: '#F7F9FA' }, SEC));
  const lblAcid = labelLine(SEC, 228, 470, 276, 508, 'acid', { size: 36, fill: '#FF7AA8', weight: 700, line: '#FF7AA8' });
  const lblAlk = labelLine(SEC, 972, 470, 924, 508, 'alkali', { size: 36, fill: '#6FB2FF', weight: 700, line: '#6FB2FF' });
  const where = G(SEC);
  card(where, 320, 150, 560, 210, { fill: 'rgba(20,54,70,0.85)', stroke: C.line });
  const icons = [[440, vinegarIcon, 'kitchen'], [600, spadeIcon, 'soil'], [760, stomachIcon, 'stomach']].map(([x, fn, name]) => {
    const g = G(where); const a = G(g); tr(a, 0, -6); fn(a);
    T(g, 0, 84, name, { size: 28, weight: 600, anchor: 'middle' });
    return { g, x };
  });

  /* ---------- metals: magnesium fizzes, copper sits there ---------- */
  const MET = G(root);
  const TX = [465, 735], TY = 425;
  E('rect', { x: 352, y: 392, width: 16, height: 196, rx: 4, fill: '#7A5236' }, MET);
  E('rect', { x: 832, y: 392, width: 16, height: 196, rx: 4, fill: '#7A5236' }, MET);
  const tubes = TX.map(x => { const g = G(MET); tr(g, x, TY); return testTube(g, 78, 300, { level: 0.5, liquid: CLEAR, opacity: 0.3 }); });
  const ribbon = G(MET); tr(ribbon, TX[0], 0);
  const rib = [[-24, 552], [-10, 532], [8, 548], [-6, 566], [14, 562], [24, 540]];
  E('path', { d: openPath(rib), fill: 'none', stroke: '#8D98A5', 'stroke-width': 10, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, ribbon);
  E('path', { d: openPath(rib), fill: 'none', stroke: '#E3E8EE', 'stroke-width': 6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, ribbon);
  E('rect', { x: TX[1] - 8, y: 462, width: 16, height: 104, rx: 3, fill: linGrad('#E8A06A', '#A85A2B'), stroke: '#7A3E1C', 'stroke-width': 2 }, MET);
  const fizz = bubbles(MET, TX[0] - 26, 438, 52, 128, { n: 16, r: 5, speed: 0.95, seed: 4 });
  const froth = []; for (let k = 0; k < 6; k++) froth.push(E('circle', { r: 4 + (k % 3) * 1.5, fill: 'rgba(255,255,255,0.25)', stroke: 'rgba(255,255,255,0.8)', 'stroke-width': 1.5 }, MET));
  E('rect', { x: 342, y: 572, width: 516, height: 18, rx: 5, fill: '#A87449', stroke: '#6E4A2E', 'stroke-width': 2 }, MET);
  E('rect', { x: 342, y: 392, width: 516, height: 20, rx: 5, fill: '#B98252', stroke: '#6E4A2E', 'stroke-width': 2 }, MET);
  const nameMg = T(MET, TX[0], 252, 'magnesium', { size: 30, weight: 700, anchor: 'middle', fill: '#E3E8EE' });
  const nameCu = T(MET, TX[1], 252, 'copper', { size: 30, weight: 700, anchor: 'middle', fill: '#F0A06A' });
  const noteFizz = T(MET, 324, 500, 'fizzes!', { size: 32, weight: 700, anchor: 'end', fill: C.energy });
  const noteSit = T(MET, 876, 486, 'just sits\nthere', { size: 30, weight: 600, fill: C.muted, lh: 36 });
  const qChip = chip(MET, '?', { size: 64, fill: C.card2, stroke: C.energy, color: C.energy });

  /* ---------- plan: title and roadmap ---------- */
  const title = rich(root, 600, 0, [['Acids', '#FF7A86'], [', ', C.ink], ['Bases', '#6FB2FF'], [' & ', C.ink], ['Metals', '#D8E1EA']], { size: 80, weight: 700, anchor: 'middle' });
  const road = G(root);
  const CARDY = 425;
  const stops = [
    { x: 240, text: 'pH scale', draw: g => {
      // the pH chapter's bar in miniature: square cells, rounded ends, a pale strip along the top
      const CW = 18, X0 = -135, Y0 = -26, r = 4.5;
      PH.forEach((c, i) => {
        const x = X0 + i * CW, x1 = x + CW, y1 = Y0 + CW;
        let d = `M${x},${Y0} H${x1} V${y1} H${x} Z`;
        if (i === 0) d = `M${x + r},${Y0} H${x1} V${y1} H${x + r} Q${x},${y1} ${x},${y1 - r} V${Y0 + r} Q${x},${Y0} ${x + r},${Y0} Z`;
        if (i === 14) d = `M${x},${Y0} H${x1 - r} Q${x1},${Y0} ${x1},${Y0 + r} V${y1 - r} Q${x1},${y1} ${x1 - r},${y1} H${x} Z`;
        E('path', { d, fill: c, stroke: C.bg0, 'stroke-width': 1, 'stroke-linejoin': 'round' }, g);
        E('rect', { x: x + 2, y: Y0 + 2, width: CW - 4, height: 2.5, rx: 1.25, fill: '#ffffff', opacity: 0.25 }, g);
      });
      [[0, '0'], [7, '7'], [14, '14']].forEach(([i, s]) => T(g, X0 + CW / 2 + i * CW, 20, s, { size: 24, weight: 600, anchor: 'middle', fill: C.muted }));
    } },
    { x: 600, text: 'neutralisation', draw: g => {
      E('circle', { cx: -100, cy: -14, r: 26, fill: ball('#E8424F', '#9E1F2B') }, g);
      T(g, -56, -2, '+', { size: 40, weight: 700, anchor: 'middle', fill: C.muted });
      E('circle', { cx: -10, cy: -14, r: 26, fill: ball('#3F8FE8', '#1E4FA8') }, g);
      arrow(g, 26, -14, 62, -14, { color: C.ink, width: 5 });
      E('circle', { cx: 100, cy: -14, r: 28, fill: ball('#56D69B', '#22844A') }, g);
    } },
    { x: 960, text: 'reactivity series', draw: g => {
      // rungs drawn as the reactivity-series chapter's mini ladder: 72 x 34 shaded pills
      const shade = (c, k, to) => '#' + [1, 3, 5].map(j => { const v = parseInt(c.slice(j, j + 2), 16); return Math.round(v + ((to ? 255 : 0) - v) * k).toString(16).padStart(2, '0'); }).join('');
      [['K', '#D8DEE6'], ['Mg', '#E3E8EE'], ['Fe', '#7A8590'], ['Cu', '#D9824B'], ['Au', '#F5C542']].forEach(([s, c], i) => {
        E('rect', { x: -36, y: -96 + i * 38, width: 72, height: 34, rx: 17, fill: ball(c, shade(c, 0.42, false)), stroke: shade(c, 0.45, true), 'stroke-width': 2 }, g);
        T(g, 0, -70 + i * 38, s, { size: 26, weight: 700, anchor: 'middle', fill: '#13232E' });
      });
      arrow(g, 64, -92, 64, 84, { color: C.faint, width: 4 });
    } },
  ].map(st => {
    const g = G(road);
    card(g, -160, -135, 320, 270, { fill: C.card, stroke: C.line });
    const art = G(g); tr(art, 0, -20); st.draw(art);
    T(g, 0, 100, st.text, { size: 30, weight: 600, anchor: 'middle' });
    return { g, x: st.x };
  });
  const roadArrows = [arrow(road, 404, CARDY, 436, CARDY, { color: C.faint, width: 5 }), arrow(road, 764, CARDY, 796, CARDY, { color: C.faint, width: 5 })];

  return t => {
    const tSplit = 1.0, tChunk = 2.0, tSec = at('secret'), tMet = at('metals'), tPlan = at('plan');

    /* hook: the cabbage splits, is chopped and soaked */
    op(H1, 1 - P(t, tSec - 0.75, 0.5, linear));
    const bob = R ? 0 : Math.sin(t * 1.6) * 2;
    op(whole, 1 - P(t, tSplit, 0.1, linear)); tr(whole, CX, CY + bob);
    const sep = P(t, tSplit, 0.6, easeOut), hv = P(t, tSplit - 0.02, 0.1, linear) * (1 - P(t, tChunk, 0.2, linear));
    halves.forEach((h, i) => { const s = i ? 1 : -1; op(h, hv); tr(h, CX + s * (4 + 42 * sep), CY, 1, s * 12 * sep); });
    const cf = win(t, tSplit - 0.12, tSplit + 0.28, 0.12); op(cut, cf); op(cutGlow, cf * 0.8);
    chunks.forEach((c, i) => {
      const u = clamp((t - c.t0) / 0.65), p = easeOut(u);
      let x = c.x0, y = c.y0, rot = 0;
      if (u > 0) {
        const cx = (c.x0 + c.x1) / 2, cy = Math.min(c.y0, c.y1) - c.bend, q = 1 - p;
        x = q * q * c.x0 + 2 * q * p * cx + p * p * c.x1; y = q * q * c.y0 + 2 * q * p * cy + p * p * c.y1; rot = u * 260;
      }
      if (u >= 1) { x += Math.sin(t * 1.1 + c.ph) * 4 * AMP; y += Math.cos(t * 0.9 + c.ph) * 3 * AMP; rot = 260 + Math.sin(t * 0.7 + c.ph) * 10 * AMP; }
      tr(c.g, x, y, 1, rot);
      op(c.g, P(t, tChunk - 0.06, 0.18, linear) * (1 - P(t, tSec - 0.75, 0.45, linear)));
      const v = (t - c.t0 - 0.6) / 0.45;
      if (v <= 0 || v >= 1) op(splashes[i], 0);
      else { tr(splashes[i], c.x1, SURF, 0.4 + 1.2 * v); op(splashes[i], 0.8 * (1 - v)); }
    });

    /* the warm beaker turns purple, flickers through its colours, then becomes the middle cup */
    const mv = P(t, tSec - 0.75, 0.75);
    const m = P(t, 2.6, 2.4, linear);
    let col = mix(CLEAR, CAB.purple, m);
    const T0 = mid('hook', 0.66), seq = [CAB.purple, CAB.pink, CAB.purple, CAB.blue, CAB.green, CAB.yellow, CAB.purple];
    if (t > T0 && t < T0 + 1.8) { const k = Math.min(5, Math.floor((t - T0) / 0.3)), f = (t - T0 - k * 0.3) / 0.3; col = mix(seq[k], seq[k + 1], ease(clamp(f * 1.6))); }
    cups[1].b.set(0.62, col); cups[1].b.liquid.setAttribute('opacity', lerp(0.25, 0.88, m).toFixed(3));
    op(swirl, win(t, 2.7, 5.4, 0.5) * 0.75); swirl.setAttribute('transform', `translate(800 ${SURF + 74}) rotate(${(t * 140 * (R ? 0.3 : 1)) % 360})`);
    op(wisp, 0.6 * P(t, 0.3, 0.8, linear) * (1 - P(t, 6.0, 1.2, linear))); wisp.upd(t);
    const sp = P(t, mid('hook', 0.44), 0.5, pop); popAt(spy, 800, 200, sp, 0.7);
    swatches.forEach((s, k) => { const p = P(t, T0 + 0.3 * (k + 0.6), 0.3, pop); popAt(s, 800 + (k - 2) * 34, 252, p, 0.3); });
    juiceLbl.set(P(t, mid('hook', 0.58), 0.4, linear));

    /* secret: the side cups slide in; lemon -> pink (acid), bicarbonate -> blue (alkali) */
    const cin = P(t, tSec - 0.75, 0.7, easeOut), cout = P(t, tMet - 0.4, 0.6, easeIn);
    [0, 2].forEach(i => { const x0 = i ? 1340 : -140; tr(cups[i].g, lerp(x0, CUPX[i], cin) - 760 * cout, CUPY, CUPS); op(cups[i].g, clamp(cin * 3) * (1 - cout)); });
    tr(cups[1].g, lerp(BK[0], CUPX[1], mv) - 760 * cout, lerp(BK[1], CUPY, mv), lerp(1, CUPS, mv));
    op(cups[1].g, 1 - cout);
    const tL = tSec + 0.42, tB = tSec + 1.5;
    cups[0].b.set(0.62, mix(CAB.purple, CAB.pink, P(t, tL, 0.3, linear)));
    cups[2].b.set(0.62, mix(CAB.purple, CAB.blue, P(t, tB, 0.35, linear)));
    [[0, tL], [2, tB]].forEach(([i, t0], k) => {
      const f = P(t, t0 - 0.05, 0.9, linear), flashA = f <= 0 || f >= 1 ? 0 : Math.sin(f * Math.PI);
      const linger = 0.22 * P(t, t0 + 0.6, 0.4, linear) * (1 - P(t, mid('secret', 0.46), 0.6, linear));
      op(cupGlow[k], (flashA * 0.9 + linger) * (1 - cout)); tr(cupGlow[k], CUPX[i] - 760 * cout, CUPY - 10, 0.8 + 0.4 * f);
    });
    op(SEC, P(t, tSec - 0.3, 0.3, linear) * (1 - P(t, tMet - 0.35, 0.4, linear)));
    const lemA = win(t, tSec - 0.3, mid('secret', 0.36), 0.3);
    op(lemon, lemA); op(lemonNote, lemA);
    lemon.setAttribute('transform', `translate(330 336) rotate(-10) scale(1 ${(1 - 0.08 * wave(t, 0.45) * P(t, tSec, 0.2, linear) * (1 - P(t, tL + 0.3, 0.2, linear))).toFixed(3)})`);
    lDrops.forEach((d, k) => { const u = (t - (tSec - 0.05 + k * 0.17)) / 0.4; if (u <= 0 || u >= 1) op(d, 0); else { op(d, 1); tr(d, 330 + (k - 1) * 6, lerp(352, CSURF + 4, easeIn(u))); } });
    const spA = win(t, tSec + 0.6, mid('secret', 0.44), 0.3);
    op(spoonG, spA); op(spoonNote, spA);
    const tilt = P(t, tB - 0.45, 0.35);
    spoonG.setAttribute('transform', `translate(1012 372) rotate(${(16 * tilt).toFixed(1)})`);
    grains.forEach((gr, k) => { const u = (t - (tB - 0.12 + k * 0.035)) / 0.42; if (u <= 0 || u >= 1) op(gr, 0); else { op(gr, 1); attr(gr, 'cx', 872 + ((k * 7) % 11) - 5); attr(gr, 'cy', lerp(420, CSURF + 4, easeIn(u))); } });
    lblAcid.set(P(t, tL + 0.25, 0.4, linear)); lblAlk.set(P(t, tB + 0.3, 0.4, linear));
    const wp = P(t, mid('secret', 0.5), 0.45, easeOut);
    op(where, wp); tr(where, 0, (1 - wp) * 70);
    icons.forEach((ic, k) => { const p = P(t, mid('secret', [0.51, 0.66, 0.82][k]), 0.5, pop); popAt(ic.g, ic.x, 246, p, 0.5); });

    /* metals */
    const mA = P(t, tMet - 0.1, 0.5, easeOut) * (1 - P(t, tPlan - 0.25, 0.45, linear));
    op(MET, clamp(mA * 1.2)); MET.setAttribute('transform', `translate(0 ${((1 - P(t, tMet - 0.1, 0.6, easeOut)) * 40).toFixed(1)})`);
    if (mA > 0) {
      fizz.upd(t, P(t, tMet + 0.2, 0.5, linear));
      froth.forEach((f, k) => { attr(f, 'cx', TX[0] - 24 + k * 9.5 + Math.sin(t * 7 + k) * 2); attr(f, 'cy', 434 + Math.cos(t * 9 + k * 2) * 2); f.style.opacity = P(t, tMet + 0.4, 0.4, linear).toFixed(3); });
      op(nameMg, P(t, mid('metals', 0.12), 0.4, linear)); op(nameCu, P(t, mid('metals', 0.16), 0.4, linear));
      popAt(qChip, 600, 330, P(t, mid('metals', 0.27), 0.5, pop), 0.5);
      op(noteFizz, P(t, mid('metals', 0.38), 0.4, linear));
      op(noteSit, P(t, mid('metals', 0.6), 0.4, linear));
    }

    /* plan: title and three-card roadmap */
    const tp = P(t, tPlan - 0.05, 0.8, easeOut);
    op(title, tp); tr(title, 0, lerp(196, 182, tp));
    op(road, P(t, tPlan, 0.4, linear));
    const showAt = [mid('plan', 0.1), mid('plan', 0.36), mid('plan', 0.68)];
    stops.forEach((st, i) => { const p = P(t, showAt[i], 0.6, pop); op(st.g, clamp(p * 2)); tr(st.g, st.x, CARDY + (1 - clamp(p)) * 30, 0.9 + 0.1 * clamp(p)); });
    roadArrows.forEach((a, i) => { a.set(P(t, showAt[i + 1] - 0.2, 0.5)); op(a, P(t, showAt[i + 1] - 0.2, 0.2, linear)); });
  };
});
