/* Chapter 10, Egestion and excretion: not the same.
   Beats: two words for getting rid of waste, egestion ≠ excretion -> left panel: fibre, dead gut cells and
   leftovers pack into faeces and leave through the anus -> faeces never cross the gut lining into your
   cells or blood -> right panel: a cell's own reactions make waste -> CO2 travels in the blood to the
   lungs and is breathed out -> the liver makes urea from extra amino acids, the kidneys put it in urine,
   while the CO2 route keeps running (showpiece: the waste routes side by side) -> water and salts in
   urine and sweat -> the test: food never used = egestion; the body's own reactions = excretion. */
scene('egestion', S => {
  const { at, end, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;

  const COLON = '#D79C8E', COLONDK = '#8C4A43', LUMEN = '#2E1C14';
  const AMB = C.glucose, BLU = C.water;
  const WASTE = ball('#9A6844', '#5A3820'), CRUMB = ball('#F0C274', '#A8742E');
  const BEADS = ['#FF8A80', '#4DD0C8', '#B5E655', C.ethanol];
  const NITRO = '#6F9BFF';

  /* ---------- local helpers ---------- */
  const dropD = r => `M0,${-r * 1.35} C${r * 0.7},${-r * 0.35} ${r},${r * 0.2} ${r},${r * 0.45} A${r},${r} 0 0 1 ${-r},${r * 0.45} C${-r},${r * 0.2} ${-r * 0.7},${-r * 0.35} 0,${-r * 1.35} Z`;
  function sample(parent, d, step) {
    const p = E('path', { d }, parent);
    const L = p.getTotalLength(), n = Math.max(2, Math.ceil(L / (step || 4))), pts = [];
    for (let i = 0; i <= n; i++) { const q = p.getPointAtLength(L * i / n); pts.push([q.x, q.y]); }
    p.remove();
    return { L, at: f => { const x = clamp(f) * n, i = Math.min(n - 1, Math.floor(x)), r = x - i; return [lerp(pts[i][0], pts[i + 1][0], r), lerp(pts[i][1], pts[i + 1][1], r)]; } };
  }
  function noteChip(parent, text, o) { o = o || {}; return chip(parent, text, Object.assign({ size: 26, fill: 'rgba(20,54,70,0.92)', stroke: C.line, sw: 2, weight: 600 }, o)); }
  function label(parent, x, y, tx, ty, text, o) {
    o = o || {};
    const g = G(parent), size = o.size || 27, anchor = o.anchor || (tx < x ? 'start' : 'end');
    E('line', { x1: anchor === 'start' ? x - 10 : x + 10, y1: y - size * 0.33, x2: tx, y2: ty, stroke: o.line || C.muted, 'stroke-width': 2.5 }, g);
    E('circle', { cx: tx, cy: ty, r: 4.5, fill: o.line || C.muted }, g);
    T(g, x, y, text, { size, weight: 700, anchor, fill: o.fill || C.ink });
    return g;
  }
  function urea(parent, r) {   // CO(NH2)2: grey carbon, red oxygen, two blue nitrogens
    const g = G(parent); r = r || 8;
    E('line', { x1: 0, y1: 0, x2: 0, y2: -r * 1.7, stroke: '#7F96A8', 'stroke-width': r * 0.5 }, g);
    E('line', { x1: -r * 1.5, y1: r * 1.0, x2: r * 1.5, y2: r * 1.0, stroke: '#7F96A8', 'stroke-width': r * 0.5 }, g);
    E('circle', { cx: 0, cy: -r * 1.7, r: r * 0.9, fill: ball(C.oxygen, C.oxygenDk) }, g);
    E('circle', { cx: -r * 1.5, cy: r * 1.0, r: r * 0.9, fill: ball(NITRO, '#2F55B5') }, g);
    E('circle', { cx: r * 1.5, cy: r * 1.0, r: r * 0.9, fill: ball(NITRO, '#2F55B5') }, g);
    E('circle', { r, fill: ball(C.carbon, C.carbonDk) }, g);
    return g;
  }
  const kidneyD = 'M0,-32 C24,-32 28,-12 20,-4 C13,2 13,10 20,17 C28,27 18,36 0,34 C-24,32 -28,12 -28,0 C-28,-18 -20,-32 0,-32 Z';

  /* ================= titles: egestion ≠ excretion ================= */
  const ttl = G(root);
  const sub = T(ttl, 600, 236, 'both mean getting rid of waste', { size: 34, weight: 600, anchor: 'middle', fill: C.muted });
  const outL = arrow(ttl, 380, 280, 300, 280, { color: C.muted, width: 5 }), outR = arrow(ttl, 820, 280, 900, 280, { color: C.muted, width: 5 });
  const cardE = G(ttl), cardX = G(ttl);
  const cE = chip(cardE, 'egestion', { size: 54, fill: AMB, color: '#3A2600', weight: 700, padX: 44 });
  const cX = chip(cardX, 'excretion', { size: 54, fill: BLU, color: '#06283A', weight: 700, padX: 44 });
  const neq = G(ttl); T(neq, 0, 30, '≠', { size: 92, weight: 700, anchor: 'middle', fill: C.ink });
  const HEADY = 152, EX = 312, XX = 888;
  function XX0() { return XX; }

  /* ================= panels ================= */
  const panL = G(root), panR = G(root);
  card(panL, 40, 112, 545, 600, { fill: 'rgba(255,194,71,0.05)', stroke: 'rgba(255,194,71,0.38)', sw: 2.5, rx: 26 });
  card(panR, 615, 112, 545, 600, { fill: 'rgba(76,201,240,0.05)', stroke: 'rgba(76,201,240,0.38)', sw: 2.5, rx: 26 });
  const qWait = T(root, XX0(), 470, '?', { size: 170, weight: 700, anchor: 'middle', fill: 'rgba(76,201,240,0.22)' });

  /* ================= left: the end of the gut ================= */
  { const cp = E('clipPath', { id: 'dgEgLeft' }, defs()); E('rect', { x: 41, y: 113, width: 543, height: 598, rx: 25 }, cp); }
  const L = G(root, { 'clip-path': 'url(#dgEgLeft)' });
  const TUBE = 'M640,268 C440,268 312,278 312,356 L312,596';
  const vessel = G(L);
  E('path', { d: 'M446,372 L446,632', stroke: '#5E1A26', 'stroke-width': 34, 'stroke-linecap': 'round' }, vessel);
  E('path', { d: 'M446,372 L446,632', stroke: '#C93242', 'stroke-width': 22, 'stroke-linecap': 'round' }, vessel);
  const vRbc = [0, 1, 2, 3, 4, 5].map(() => E('ellipse', { rx: 6, ry: 9, fill: '#FF8A94', stroke: '#FFD0D5', 'stroke-width': 1.2 }, vessel));
  E('path', { d: TUBE, fill: 'none', stroke: COLONDK, 'stroke-width': 138 }, L);
  E('path', { d: TUBE, fill: 'none', stroke: COLON, 'stroke-width': 130 }, L);
  E('path', { d: 'M248,596 L272,640 L352,640 L376,596 Z', fill: COLON, stroke: COLONDK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, L);
  E('path', { d: TUBE, fill: 'none', stroke: LUMEN, 'stroke-width': 84 }, L);
  E('path', { d: 'M270,592 L296,642 L328,642 L354,592 Z', fill: LUMEN }, L);
  E('rect', { x: 276, y: 628, width: 72, height: 18, rx: 9, fill: '#7A3A36', stroke: COLONDK, 'stroke-width': 3 }, L);
  const lining = E('path', { d: 'M640,226 C440,226 270,236 270,356 L270,592 M640,310 C470,310 354,312 354,370 L354,592', fill: 'none', stroke: C.energy, 'stroke-width': 4, 'stroke-dasharray': '10 8' }, L);
  // contents: fibre, dead gut cells, leftovers
  const ITEMS = [];
  const fibreG = [0, 1].map(i => { const g = G(L); E('path', { d: 'M-24,4 C-14,-10 -6,12 4,-2 C10,-10 18,-6 24,2', fill: 'none', stroke: '#7FBF4D', 'stroke-width': 8, 'stroke-linecap': 'round' }, g); E('path', { d: 'M-24,4 C-14,-10 -6,12 4,-2 C10,-10 18,-6 24,2', fill: 'none', stroke: '#C4EE9C', 'stroke-width': 2.5, 'stroke-linecap': 'round', opacity: 0.8 }, g); return g; });
  const cellG = [0, 1].map(() => { const g = G(L); E('ellipse', { rx: 15, ry: 11, fill: '#D8BFC6', stroke: '#9C7A86', 'stroke-width': 2 }, g); E('circle', { cx: 2, cy: 1, r: 4, fill: '#8A6E9C' }, g); return g; });
  const crumbG = [0, 1].map(i => { const g = G(L); E('path', { d: closedPath(blobPts(11, 9, 7, 0, 0.2, 70 + i)), fill: CRUMB, stroke: '#FFE2A8', 'stroke-width': 1.5 }, g); return g; });
  [[fibreG[0], 292, 352, 30], [fibreG[1], 330, 420, -25], [cellG[0], 330, 372, 0], [cellG[1], 296, 448, 0], [crumbG[0], 300, 400, 0], [crumbG[1], 332, 466, 0]].forEach(([g, x, y, r], k) => ITEMS.push({ g, x, y, r, d: k * 0.12 }));
  const log = G(L);
  E('rect', { x: -26, y: -34, width: 52, height: 68, rx: 24, fill: WASTE, stroke: '#C79A72', 'stroke-width': 2 }, log);
  E('path', { d: 'M-16,-12 Q0,-6 16,-14 M-18,10 Q0,16 18,8', fill: 'none', stroke: '#5A3820', 'stroke-width': 3, 'stroke-linecap': 'round', opacity: 0.7 }, log);
  const lFibre = label(L, 236, 346, 284, 352, 'fibre', { fill: '#B5E08F', anchor: 'end' });
  const lCells = label(L, 236, 404, 296, 448, 'dead gut cells', { fill: '#E9CFD6', anchor: 'end' });
  const lLeft = label(L, 236, 470, 300, 400, 'leftovers', { fill: '#FFD98A', anchor: 'end' });
  const lFaeces = noteChip(L, 'faeces', { size: 28, color: '#3A2214', fill: '#C49A74', stroke: 'none' }); tr(lFaeces, 160, 560);
  const lFaecesLine = E('line', { x1: 206, y1: 560, x2: 280, y2: 560, stroke: '#C49A74', 'stroke-width': 3 }, L);
  const lAnus = label(L, 236, 692, 290, 648, 'anus', { anchor: 'end' });
  const lUndig = noteChip(L, 'undigested food', { size: 27, color: '#FFD98A' }); tr(lUndig, 470, 205);
  // never absorbed
  const lBlood = T(L, 446, 672, 'your blood', { size: 27, weight: 700, anchor: 'middle', fill: '#FF9AA4' });
  const lCellsY = label(L, 236, 300, 268, 352, 'your cells', { fill: '#FFC2D4', anchor: 'end' });
  const bounce = G(L);
  const bArrow = arrow(bounce, 340, 512, 420, 512, { color: C.ink, width: 5, dash: true });
  const bCross = cross(bounce, 13); tr(bCross, 400, 512);
  const lNever = G(L);
  card(lNever, -86, -50, 172, 100, { fill: AMB, stroke: 'none', rx: 20 });
  T(lNever, 0, -8, 'never', { size: 32, weight: 700, anchor: 'middle', fill: '#3A2600' });
  T(lNever, 0, 30, 'absorbed', { size: 32, weight: 700, anchor: 'middle', fill: '#3A2600' });

  /* ================= right: waste the body makes ================= */
  const R = G(root);
  // vessels
  const vesTop = G(R), vesBot = G(R);
  E('path', { d: 'M780,322 L986,322', stroke: '#5E1A26', 'stroke-width': 32, 'stroke-linecap': 'round' }, vesTop);
  E('path', { d: 'M780,322 L986,322', stroke: '#C93242', 'stroke-width': 21, 'stroke-linecap': 'round' }, vesTop);
  E('path', { d: 'M800,582 L996,582', stroke: '#5E1A26', 'stroke-width': 32, 'stroke-linecap': 'round' }, vesBot);
  E('path', { d: 'M800,582 L996,582', stroke: '#C93242', 'stroke-width': 21, 'stroke-linecap': 'round' }, vesBot);
  const rbcT = [0, 1, 2, 3, 4].map(() => E('ellipse', { rx: 9, ry: 5.5, fill: '#FF8A94', stroke: '#FFD0D5', 'stroke-width': 1.2 }, vesTop));
  const rbcBt = [0, 1, 2, 3, 4].map(() => E('ellipse', { rx: 9, ry: 5.5, fill: '#FF8A94', stroke: '#FFD0D5', 'stroke-width': 1.2 }, vesBot));
  // a body cell
  const cellW = G(R);
  const bodyCell = animalCell(cellW, 170, 130, { sw: 6, seed: 22, nr: 34, nx: -88, ny: -30 });
  const mitos = [[40, -50, -14], [70, 52, 18], [-40, 66, 6]].map(([x, y, r]) => { const m = mitochondrion(bodyCell.inner, 96, 42, { glow: true }); tr(m, x, y, 1, r); return m; });
  const rx = G(cellW), rr0 = rng(13), rxs = [];
  for (let i = 0; i < 8; i++) rxs.push({ s: spark(rx, 11, { seed: i }), m: i % 3, a: rr0() * TAU, ph: rr0() });
  const cellCO2 = [0, 1, 2, 3].map(() => molCO2(cellW, 10));
  const cellWasteChip = noteChip(R, 'waste, made inside cells', { size: 27, color: C.ink, stroke: BLU }); tr(cellWasteChip, XX, 612);
  // lungs and breath
  const lungG = G(R); tr(lungG, 1066, 336);
  const lung = lungs(lungG, 0.4);
  const lLungs = T(R, 1066, 434, 'lungs', { size: 27, weight: 700, anchor: 'middle' });
  const breath = arrow(R, 1066, 258, 1066, 196, { color: C.air, width: 6 });
  const lBreath = T(R, 1026, 232, 'breathed out', { size: 27, weight: 700, anchor: 'end', fill: C.air });
  const co2Ride = [0, 1, 2, 3].map(() => molCO2(R, 9));
  const lCO2 = T(R, 884, 296, 'carbon dioxide', { size: 26, weight: 700, anchor: 'middle', fill: C.co2 });
  // skin and sweat
  const skin = G(R); tr(skin, 884, 448);
  E('rect', { x: -78, y: -18, width: 156, height: 36, rx: 18, fill: ball('#E8B48E', '#B9825A'), stroke: '#F7D9C2', 'stroke-width': 2.5 }, skin);
  const sweat = [-44, 0, 44].map(x => { const d = E('path', { d: dropD(7), fill: 'rgba(170,228,255,0.95)', stroke: '#FFFFFF', 'stroke-width': 1.5 }, skin); return { d, x }; });
  const lSkin = T(R, 978, 457, 'sweat', { size: 27, weight: 700, fill: '#9FE3F8' });
  // liver, urea, kidneys, bladder
  const liverG = G(R); tr(liverG, 728, 584);
  E('path', { d: closedPath([[-74, -10], [-60, -40], [-20, -48], [30, -46], [70, -34], [76, -22], [40, -2], [0, 16], [-40, 34], [-68, 26]]), fill: ball('#C8444F', '#7A1F2A'), stroke: '#E37C86', 'stroke-width': 3 }, liverG);
  const lLiver = T(R, 718, 650, 'liver', { size: 27, weight: 700, anchor: 'middle', fill: '#F2A0A8' });
  const BEADK = ['#C2534C', '#1E8C85', '#6E9A26', C.ethanolDk];   // amino-acid beads, as in the molecule chapters
  const beadsIn = [0, 1, 2, 3].map(i => E('circle', { r: 8, fill: ball(BEADS[i], BEADK[i]), stroke: BEADK[i], 'stroke-width': 1.2 }, R));
  const lAmino = T(R, 728, 520, 'extra amino acids', { size: 26, weight: 700, anchor: 'middle', fill: '#FFB3AC' });
  const ureaRide = [0, 1, 2].map(() => urea(R, 6.5));
  const lUrea = T(R, 898, 556, 'urea', { size: 27, weight: 700, anchor: 'middle', fill: '#C9D6FF' });
  const kidG = G(R);
  const kidL = G(kidG); tr(kidL, 1032, 574); E('path', { d: kidneyD, fill: ball('#C8505A', '#7A2230'), stroke: '#E58A92', 'stroke-width': 2.5, transform: 'scale(-1 1)' }, kidL);
  const kidR = G(kidG); tr(kidR, 1100, 574); E('path', { d: kidneyD, fill: ball('#C8505A', '#7A2230'), stroke: '#E58A92', 'stroke-width': 2.5 }, kidR);
  const kidGlow = E('ellipse', { cx: 1066, cy: 574, rx: 82, ry: 54, fill: glow('#FFD54A') }, kidG); kidG.insertBefore(kidGlow, kidG.firstChild);
  E('path', { d: 'M1040,604 C1044,624 1052,636 1056,648 M1092,604 C1088,624 1080,636 1076,648', fill: 'none', stroke: '#E8C25A', 'stroke-width': 5, 'stroke-linecap': 'round' }, kidG);
  const lKid = T(R, 1066, 528, 'kidneys', { size: 27, weight: 700, anchor: 'middle', fill: '#F2A0A8' });
  const blad = G(R); tr(blad, 1066, 672);
  const bladD = 'M-30,-14 C-30,-24 -16,-26 0,-26 C16,-26 30,-24 30,-14 C30,10 16,22 0,22 C-16,22 -30,10 -30,-14 Z';
  const bcid = 'dgEgBladder'; { const cp = E('clipPath', { id: bcid }, defs()); E('path', { d: bladD }, cp); }
  E('path', { d: bladD, fill: 'rgba(232,194,90,0.12)' }, blad);
  const urine = E('rect', { x: -32, y: 22, width: 64, height: 0, fill: '#F2D24A', 'clip-path': `url(#${bcid})` }, blad);
  E('path', { d: bladD, fill: 'none', stroke: '#E8C25A', 'stroke-width': 3 }, blad);
  const lUrine = T(R, 1026, 684, 'urine', { size: 27, weight: 700, anchor: 'end', fill: '#F2D24A' });
  const pee = [0, 1, 2].map(() => E('path', { d: dropD(5), fill: '#F2D24A' }, R));
  const salts = [0, 1, 2].map(i => { const g = G(R); if (i === 1) E('rect', { x: -6, y: -6, width: 12, height: 12, rx: 2, fill: '#F4F7FA', stroke: '#A9B5C0', 'stroke-width': 1.5, transform: 'rotate(20)' }, g); else E('path', { d: dropD(6), fill: ball(C.water, C.waterDk) }, g); return g; });
  const saltChip = noteChip(R, 'extra water and salts', { size: 24, color: '#9FE3F8' }); tr(saltChip, 880, 402);   // clear of the cell, the lungs label and the skin

  /* ================= the test ================= */
  const Tq = G(root);
  E('rect', { x: 44, y: 196, width: 1112, height: 512, rx: 24, fill: 'rgba(10,27,39,0.88)' }, Tq);
  const qT = G(Tq); tr(qT, 600, 250);
  noteChip(qT, 'Where did the waste come from?', { size: 34, color: C.ink, stroke: C.energy, weight: 700 });
  function branch(x, l1, l2, col, ans, ansCol, ansText) {
    const g = G(Tq);
    card(g, x - 230, 324, 460, 132, { fill: C.card, stroke: col, sw: 3 });
    T(g, x, 378, l1, { size: 31, weight: 600, anchor: 'middle' });
    rich(g, x, 422, l2, { size: 31, anchor: 'middle' });
    const a = arrow(g, x, 466, x, 540, { color: col, width: 6 });
    const c = G(g); tr(c, x, 592); chip(c, ansText, { size: 44, fill: ans, color: ansCol, weight: 700, padX: 36 });
    return { g, a, c };
  }
  function rich(parent, x, y, segs, o) {
    const t = E('text', { x, y, 'font-size': o.size || 30, 'font-weight': 600, 'font-family': FD, 'text-anchor': o.anchor || 'start', fill: C.ink }, parent);
    segs.forEach(s => { if (typeof s === 'string') s = [s]; E('tspan', { fill: s[1], 'font-weight': s[2] }, t).textContent = s[0]; });
    return t;
  }
  const brE = branch(EX, 'from food that was', [['never used', AMB, 800], '?'], AMB, AMB, '#3A2600', 'egestion');
  const brX = branch(XX, "from your body's", [['own reactions', BLU, 800], '?'], BLU, BLU, '#06283A', 'excretion');

  /* ================= update ================= */
  const cellPath = [[XX, 410, 1], [712, 322, 0.5]];
  return t => {
    /* titles: big in the middle, then up into the panel headers */
    const up = P(t, at('egestion') - 0.1, 1.0, ease);
    op(sub, win(t, S.first, at('egestion') + 0.1, 0.4));
    outL.set(P(t, mid('two', 0.1), 0.6)); outR.set(P(t, mid('two', 0.1), 0.6));
    op(outL, win(t, mid('two', 0.08), at('egestion') + 0.1, 0.3)); op(outR, win(t, mid('two', 0.08), at('egestion') + 0.1, 0.3));
    const sE = P(t, mid('two', 0.5), 0.7, easeOut), sX = P(t, mid('two', 0.6), 0.7, easeOut);
    const pulseE = 1 + 0.08 * Math.sin(Math.PI * P(t, mid('two', 0.8), 0.5, linear)) + 0.1 * Math.sin(Math.PI * P(t, mid('test', 0.44), 0.6, linear));
    const pulseX = 1 + 0.08 * Math.sin(Math.PI * P(t, mid('two', 0.93), 0.5, linear)) + 0.1 * Math.sin(Math.PI * P(t, mid('test', 0.88), 0.6, linear));
    tr(cardE, lerp(lerp(-200, 330, sE), EX, up), lerp(380, HEADY, up), lerp(1, 0.62, up) * pulseE);
    tr(cardX, lerp(lerp(1400, 870, sX), XX, up), lerp(380, HEADY, up), lerp(1, 0.62, up) * pulseX);
    op(cardE, P(t, mid('two', 0.5), 0.3, linear)); op(cardX, P(t, mid('two', 0.6), 0.3, linear));
    const nq = P(t, mid('two', 0.68), 0.5, pop);
    op(neq, clamp(nq * 2)); tr(neq, 600, lerp(382, HEADY, up), Math.max(0.01, nq * lerp(1, 0.6, up)));
    op(panL, P(t, at('egestion'), 0.6, linear)); op(panR, P(t, at('egestion') + 0.2, 0.6, linear));
    op(qWait, win(t, at('egestion') + 0.4, at('excretion') + 0.1, 0.5) * (0.7 + 0.3 * wave(t, 2.2)));

    /* ---------- left: egestion ---------- */
    const lA = P(t, at('egestion') + 0.1, 0.6, linear);
    op(L, lA);
    if (lA > 0) {
      const fl = t * 50;
      vRbc.forEach((e, i) => { attr(e, 'cx', 446); attr(e, 'cy', 380 + ((i * 44 + fl) % 248)); });
      const pack = P(t, mid('egestion', 0.7), 0.9, ease);
      ITEMS.forEach((it, k) => {
        const u = P(t, mid('egestion', 0.08) + it.d, 1.4, easeOut);
        const x0 = 600, y0 = 268;
        let x = lerp(x0, it.x, u), y = lerp(y0, it.y, u);
        if (u < 1) y = lerp(y0, it.y, u) - Math.sin(u * Math.PI) * 20 * (k % 2 ? 1 : -1);
        x = lerp(x, 312, pack); y = lerp(y, 552, pack);
        tr(it.g, x + (pack < 1 ? Math.sin(t * 1.4 + k) * 3 * calm : 0), y, 1 - 0.6 * pack, it.r + Math.sin(t + k) * 8 * calm);
        op(it.g, (u > 0 ? 1 : 0) * (1 - P(pack, 0.7, 0.3, linear)));
      });
      // the faeces log forms, leaves through the anus; a new one is there for "never"
      const form = P(t, mid('egestion', 0.76), 0.5, pop), exit = P(t, mid('egestion', 0.88), 1.0, easeIn);
      const again = P(t, at('never') - 0.2, 0.8, easeOut);
      let ly = lerp(552, 700, exit), lop = clamp(form * 2) * (1 - P(exit, 0.55, 0.4, linear)), ls = Math.max(0.01, form);
      if (t > at('never') - 0.2) { ly = lerp(330, 470, again); lop = P(t, at('never') - 0.2, 0.4, linear); ls = 1; }
      tr(log, 312, ly, ls); op(log, lop);
      op(lUndig, win(t, mid('egestion', 0.05), mid('egestion', 0.4), 0.35));
      op(lFibre, win(t, mid('egestion', 0.4), mid('egestion', 0.72), 0.35));
      op(lCells, win(t, mid('egestion', 0.5), mid('egestion', 0.72), 0.35));
      op(lLeft, win(t, mid('egestion', 0.6), mid('egestion', 0.72), 0.35));
      op(lFaeces, win(t, mid('egestion', 0.78), at('never') + 0.3, 0.35)); op(lFaecesLine, win(t, mid('egestion', 0.78), mid('egestion', 0.9), 0.3));
      op(lAnus, P(t, mid('egestion', 0.86), 0.4, linear));
      // never absorbed
      const nv = win(t, at('never'), at('test') + 0.6, 0.4);
      op(lining, nv); lining.setAttribute('stroke-dashoffset', (-t * 20).toFixed(1));
      op(lCellsY, nv * P(t, mid('never', 0.28), 0.4, linear)); op(lBlood, P(t, mid('never', 0.4), 0.4, linear));
      const bb = (t - mid('never', 0.12)) / 1.6, bu = bb - Math.floor(bb);
      op(bounce, nv * P(t, mid('never', 0.12), 0.3, linear));
      bArrow.set(t > mid('never', 0.12) ? clamp(bu / 0.5) : 0);
      const xc = P(t, mid('never', 0.2), 0.4, pop); op(bCross, clamp(xc * 2)); tr(bCross, 404, 512, Math.max(0.01, xc));
      const np = P(t, mid('never', 0.08), 0.5, pop); op(lNever, clamp(np * 2) * nv); tr(lNever, 140, 470, Math.max(0.01, 0.8 + 0.2 * np));
      if (t > at('never') - 0.2) tr(log, 312 + Math.sin(Math.PI * clamp(bu / 0.5)) * 10 * (t > mid('never', 0.12) ? 1 : 0), ly, 1);
    }

    /* ---------- right: excretion ---------- */
    const rA = P(t, at('excretion') - 0.1, 0.6, linear);
    op(R, rA);
    if (rA > 0) {
      const mv = P(t, at('co2') - 0.1, 1.0, ease);
      const cx = lerp(cellPath[0][0], cellPath[1][0], mv), cy = lerp(cellPath[0][1], cellPath[1][1], mv), cs = lerp(cellPath[0][2], cellPath[1][2], mv);
      tr(cellW, cx, cy, cs * (0.85 + 0.15 * P(t, at('excretion') - 0.1, 0.6, easeOut)));
      bodyCell.upd(t); mitos.forEach((m, i) => m.upd(t + i));
      const mp = [[40, -50], [70, 52], [-40, 66]];
      rxs.forEach((r, i) => { const u = ((t - at('excretion')) / 1.4 + r.ph) % 1, o = mp[r.m], d = 20 + 40 * easeOut(u); tr(r.s, o[0] + Math.cos(r.a) * d, o[1] + Math.sin(r.a) * d, 0.5 + 0.5 * Math.sin(u * Math.PI)); op(r.s, t > at('excretion') + 0.3 ? Math.sin(u * Math.PI) : 0); r.s.upd(t); });
      cellCO2.forEach((m, i) => {
        const a = P(t, mid('excretion', 0.35) + i * 0.2, 0.5, pop);
        const leave = P(t, at('co2') + 0.6 + i * 0.35, 0.8, easeIn);
        const hx = [-20, 100, 10, 120][i], hy = [-80, -20, 20, 70][i];
        tr(m, lerp(hx, 190, leave), lerp(hy, 0, leave), Math.max(0.01, a), (t * 30 + i * 70) % 360);
        op(m, clamp(a * 2) * (1 - P(leave, 0.8, 0.2, linear)));
      });
      op(cellWasteChip, win(t, mid('excretion', 0.55), at('co2') + 0.2, 0.35));
      // CO2: cell -> blood -> lungs -> out
      const cA = P(t, at('co2') + 0.4, 0.5, linear);
      op(vesTop, cA); op(lungG, cA); op(lLungs, P(t, mid('co2', 0.62), 0.4, linear)); op(lCO2, P(t, mid('co2', 0.12), 0.4, linear));
      lung.set(wave(t, 3.2) * calm);
      const fl = t * 70;
      rbcT.forEach((e, i) => { attr(e, 'cx', 784 + ((i * 41 + fl) % 200)); attr(e, 'cy', 322); });
      co2Ride.forEach((m, i) => {
        const u = ((t - (at('co2') + 1.0)) / 3.0 + i / 4) % 1, on = t > at('co2') + 1.0 ? 1 : 0;
        let x, y;
        if (u < 0.55) { x = lerp(792, 1066, u / 0.55); y = 322; }
        else { const q = (u - 0.55) / 0.45; x = 1066 + Math.sin(q * 6 + i) * 6 * calm; y = lerp(318, 176, q); }
        tr(m, x, y, 1, (t * 40 + i * 90) % 360);
        op(m, on * cA * Math.min(1, u * 10, (1 - u) * 6));
      });
      breath.set(P(t, mid('co2', 0.78), 0.6)); op(breath, P(t, mid('co2', 0.76), 0.3, linear)); op(lBreath, P(t, mid('co2', 0.8), 0.4, linear));
      // urea: amino acids -> liver -> blood -> kidneys -> urine
      const uA = P(t, at('urea') - 0.1, 0.5, linear);
      op(liverG, uA); op(vesBot, uA); op(kidG, P(t, mid('urea', 0.52), 0.5, linear)); op(blad, P(t, mid('urea', 0.7), 0.5, linear));
      op(lLiver, P(t, mid('urea', 0.18), 0.4, linear)); op(lAmino, P(t, mid('urea', 0.32), 0.4, linear)); op(lUrea, P(t, mid('urea', 0.08), 0.4, linear));
      op(lKid, P(t, mid('urea', 0.6), 0.4, linear)); op(lUrine, P(t, mid('urea', 0.85), 0.4, linear));
      op(kidGlow, P(t, mid('urea', 0.62), 0.5, linear) * (0.3 + 0.25 * wave(t, 1.2)));
      rbcBt.forEach((e, i) => { attr(e, 'cx', 804 + ((i * 41 + fl) % 200)); attr(e, 'cy', 582); });
      beadsIn.forEach((b, i) => {
        const u = ((t - (mid('urea', 0.3))) / 2.4 + i / 4) % 1, on = t > mid('urea', 0.3) ? 1 : 0;
        attr(b, 'cx', lerp(632, 712, u)); attr(b, 'cy', 584 + Math.sin(u * 5 + i) * 6);
        op(b, on * uA * Math.min(1, u * 8, (1 - u) * 5));
      });
      ureaRide.forEach((m, i) => {
        const u = ((t - mid('urea', 0.36)) / 2.6 + i / 3) % 1, on = t > mid('urea', 0.36) ? 1 : 0;
        tr(m, lerp(790, 1012, u), 582, 1, Math.sin(t * 2 + i) * 20 * calm);
        op(m, on * uA * Math.min(1, u * 8, (1 - u) * 8));
      });
      pee.forEach((d, i) => {
        const u = ((t - mid('urea', 0.78)) / 1.2 + i / 3) % 1, on = t > mid('urea', 0.78) ? 1 : 0, side = i % 2 ? 1 : -1;
        tr(d, 1066 + side * lerp(26, 12, u), lerp(606, 650, u));
        op(d, on * Math.min(1, u * 8, (1 - u) * 8));
      });
      const lvl = P(t, mid('urea', 0.8), 4.0, linear);
      attr(urine, 'y', 22 - 36 * lvl); attr(urine, 'height', 2 + 36 * lvl);
      // water and salts
      const sA = P(t, at('salts') - 0.1, 0.4, linear);
      op(skin, sA); op(lSkin, P(t, mid('salts', 0.6), 0.4, linear)); op(saltChip, P(t, mid('salts', 0.05), 0.4, linear));
      sweat.forEach((sw, i) => { const u = ((t - mid('salts', 0.55)) / 1.4 + i / 3) % 1, on = t > mid('salts', 0.55) ? 1 : 0; tr(sw.d, sw.x, 24 + u * 22, 0.6 + 0.4 * Math.min(1, u * 4)); op(sw.d, on * Math.min(1, u * 6, (1 - u) * 4)); });
      salts.forEach((g, i) => {
        const u = ((t - mid('salts', 0.15)) / 2.2 + i / 3) % 1, on = t > mid('salts', 0.15) ? 1 : 0;
        let x, y;
        if (u < 0.6) { x = lerp(800, 1040, u / 0.6); y = 582 + (i - 1) * 4; } else { const q = (u - 0.6) / 0.4; x = lerp(1040, 1066, q); y = lerp(582, 660, q); }
        tr(g, x, y, 1, t * 60 % 360); op(g, on * sA * Math.min(1, u * 8, (1 - u) * 6));
      });
    }

    /* ---------- the test ---------- */
    const qA = P(t, at('test') - 0.1, 0.5, linear);
    op(Tq, qA);
    if (qA > 0) {
      const p = P(t, at('test'), 0.5, pop); op(qT, clamp(p * 2)); tr(qT, 600, 250, Math.max(0.01, 0.85 + 0.15 * p));
      [[brE, 0.12, 0.42], [brX, 0.57, 0.86]].forEach(([b, q1, q2]) => {
        const s1 = P(t, mid('test', q1), 0.5, linear); op(b.g, s1); tr(b.g, 0, (1 - s1) * 20);
        b.a.set(P(t, mid('test', q2) - 0.3, 0.5)); op(b.a, P(t, mid('test', q2) - 0.3, 0.2, linear));
        const s2 = P(t, mid('test', q2), 0.5, pop); op(b.c, clamp(s2 * 2)); b.c.setAttribute('transform', `translate(${b === brE ? EX : XX} 592) scale(${Math.max(0.01, 0.7 + 0.3 * s2).toFixed(3)})`);
      });
    }
  };
});
