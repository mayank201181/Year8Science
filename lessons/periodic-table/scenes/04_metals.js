/* Chapter 4: Metals, non-metals and the staircase.
   The big table splits blue / green and the staircase draws itself between them; four in five are
   metals, hydrogen the odd one out. The table then shrinks to a legend in the corner while a demo
   bench shows the properties: shiny, conducts heat and electricity; malleable, ductile; solid, high
   melting point and density, sonorous. Non-metals: dull, gases, low melting point and density;
   insulators, brittle; graphite the exception. Back to the table for the metalloids, then a
   fridge-magnet test and the copper-coated steel coins. */
scene('metals', S => {
  const { at, end, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;
  const BLUE = PT_KIND_COL.metal, GREEN = PT_KIND_COL.nonmetal, AMBER = PT_KIND_COL.metalloid;
  const BY = 586;                                   // bench top: demo objects rest on it
  const SULF = '#D6C04A', SULF_DK = '#9C8A2A', CU = '#D9824A', CU_LT = '#F0B48A', CU_DK = '#8E4A1E';
  const SILVER = linGrad('#E6ECF1', '#8796A4', true), STEEL_ST = '#C9D3DC';

  /* ---------- helpers ---------- */
  let nClip = 0;
  const clipTo = d => { const id = 'mtl' + (++nClip); const cp = E('clipPath', { id }, defs()); E('path', { d }, cp); return `url(#${id})`; };
  const wr = (el, k, v) => { const m = el._m || (el._m = {}); if (m[k] === v) return; m[k] = v; if (k === 'o') op(el, v); else el.setAttribute(k, v); };
  // position along time-sorted keyframes [[t, x, y], ...], eased between neighbours
  const along = (t, ks) => {
    if (t <= ks[0][0]) return [ks[0][1], ks[0][2]];
    for (let i = 1; i < ks.length; i++) if (t < ks[i][0]) { const a = ks[i - 1], b = ks[i], p = ease((t - a[0]) / (b[0] - a[0])); return [lerp(a[1], b[1], p), lerp(a[2], b[2], p)]; }
    const l = ks[ks.length - 1]; return [l[1], l[2]];
  };
  // swing for strikes at times hits: 0 at rest, 1 at the moment of each hit
  const swing = (t, hits) => { let v = 0; hits.forEach(s => { v = Math.max(v, P(t, s - 0.2, 0.2, easeIn) * (1 - P(t, s + 0.06, 0.4, easeOut))); }); return v; };
  function benchLabel(x, main, note, color) {
    const g = G(root);
    T(g, x, 650, main, { size: 30, weight: 700, anchor: 'middle', fill: color || C.ink });
    if (note) T(g, x, 684, note, { size: 24, weight: 600, anchor: 'middle', fill: C.muted, font: FB });
    op(g, 0);
    return g;
  }

  /* ================= the table ================= */
  const GX = 62, GY = 200, MX = 718, MY = 42, MS = 0.42;      // big table / small legend top-right
  const gridG = G(root), grid = ptGrid(gridG);
  const halo = E('circle', { r: 66, fill: glow(C.energy) }, grid); grid.insertBefore(halo, grid.firstChild);
  const stairGlow = E('path', { d: grid.stairPath.getAttribute('d'), fill: 'none', stroke: C.energy, 'stroke-width': 22, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', pathLength: 1, 'stroke-dasharray': '1 1' }, grid);
  grid.insertBefore(stairGlow, grid.stairPath);
  // the staircase corners (grid coordinates), for the spark that draws it
  const sx = c => c * grid.pitch - 2, sy = r => r * grid.pitch - 2, ST = [[sx(12), sy(1)], [sx(12), sy(2)]];
  for (let k = 13; k <= 16; k++) ST.push([sx(k), sy(k - 11)], [sx(k), sy(k - 10)]);
  const stairSpark = spark(grid, 15, { seed: 4 });
  // Until the metalloids line, the six metalloids wear the colour of their side of the staircase.
  const SIDE = { 5: 'nonmetal', 14: 'nonmetal', 33: 'nonmetal', 52: 'nonmetal', 32: 'metal', 51: 'metal' };
  const ovG = G(grid); grid.insertBefore(ovG, stairGlow);
  const ovs = Object.keys(SIDE).map(k => {
    const z = +k, tl = grid.tile(z), g = G(ovG); tr(g, tl.cx, tl.cy);
    const box = E('rect', { x: -28, y: -28, width: 56, height: 56, rx: 7.3, 'stroke-width': 2 }, g);
    const sym = T(g, 0, 9.4, tl.el.sym, { size: 26, weight: 700, anchor: 'middle' });
    return { z, g, box, sym, kind: SIDE[k], col: PT_KIND_COL[SIDE[k]] };
  });
  const allTiles = []; for (let z = 1; z <= 118; z++) if (grid.tile(z)) allTiles.push(grid.tile(z));
  let symMemo = -1;
  function gridSet(st, amber, symOp) {
    grid.set(st);
    const kind = clamp(st.kind || 0), dim = clamp(st.dim || 0), his = st.hi.filter(h => h.p > 0.001);
    ovs.forEach(o => {
      let hp = 0, hc = null;
      for (const h of his) if (h.p > hp && (h.kind === o.kind || (h.z !== undefined && [].concat(h.z).indexOf(o.z) >= 0))) { hp = clamp(h.p); hc = h.color; }
      let fill = kind > 0 ? _ptMix(C.card2, o.col, kind) : C.card2;
      if (hp > 0) fill = _ptMix(fill, hc, hp * 0.9);
      wr(o.box, 'fill', fill);
      wr(o.box, 'stroke', hp > 0 ? _ptMix(C.line, '#FFFFFF', hp * 0.8) : kind > 0 ? _ptMix(C.line, o.col, kind * 0.5) : C.line);
      wr(o.box, 'stroke-width', hp > 0.5 ? 3 : 2);
      wr(o.sym, 'fill', _ptLum(fill) > 0.5 ? C.bg0 : C.ink);
      wr(o.g, 'o', (1 - amber) * (dim > 0 ? 1 - 0.72 * dim * (1 - hp) : 1));
    });
    const so = Math.round(clamp(symOp) * 50) / 50;
    if (so !== symMemo) { symMemo = so; allTiles.forEach(tl => op(tl.sym, so)); ovs.forEach(o => op(o.sym, so)); }
  }

  /* labels on the big table (stage coordinates; the notch above the transition metals is free) */
  const labMetals = T(root, 420, 302, 'metals', { size: 52, weight: 700, anchor: 'middle', fill: BLUE });
  const labNon = T(root, 1020, 142, 'non-metals', { size: 46, weight: 700, anchor: 'middle', fill: GREEN });
  const stairLab = G(root);
  T(stairLab, 700, 356, 'the staircase', { size: 36, weight: 700, anchor: 'end', fill: C.energy });
  const stairArrow = arrow(stairLab, 710, 342, 766, 306, { color: C.energy, width: 5, bend: -12 });
  const hLab = G(root);                                  // in the empty notch, pointing back at hydrogen
  const hArrow = arrow(hLab, 192, 236, 128, 230, { color: GREEN, width: 4 });
  T(hLab, 200, 244, 'non-metal!', { size: 32, weight: 700, fill: GREEN });
  T(hLab, 200, 274, 'the odd one out', { size: 26, weight: 600, fill: C.muted });
  const pieG = G(root); tr(pieG, 652, 292);
  E('circle', { r: 60, fill: GREEN, stroke: C.bg0, 'stroke-width': 3 }, pieG);
  const pieM = E('path', { fill: BLUE, stroke: C.bg0, 'stroke-width': 3, 'stroke-linejoin': 'round' }, pieG);
  const pieTxt = T(root, 566, 306, '**4 in 5** are metals', { size: 30, weight: 600, anchor: 'end', boldFill: BLUE });
  const mdG = G(root);                                   // metalloids
  T(mdG, 224, 266, 'metalloids', { size: 50, weight: 700, fill: AMBER });
  const mdMix = T(mdG, 224, 306, 'a mix of metal and\nnon-metal properties', { size: 28, weight: 600, lh: 34 });
  const chipIc = G(mdG); tr(chipIc, 660, 288);
  { let d = ''; for (let i = 0; i < 4; i++) { const p = -27 + i * 18; d += `M${p},-38 V-50 M${p},38 V50 M-38,${p} H-50 M38,${p} H50 `; }
    E('path', { d, stroke: STEEL_ST, 'stroke-width': 5, 'stroke-linecap': 'round' }, chipIc);
    E('rect', { x: -38, y: -38, width: 76, height: 76, rx: 8, fill: '#26303A', stroke: '#7F8F9C', 'stroke-width': 3 }, chipIc);
    T(chipIc, 0, 12, 'Si', { size: 34, weight: 700, anchor: 'middle', fill: AMBER }); }
  const chipLab = T(mdG, 660, 368, 'silicon chip', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });

  /* ================= the bench ================= */
  const HEADS = [['Metals', BLUE], ['Non-metals', GREEN], ['Try this at home', C.energy], ['One surprise', C.energy]]
    .map(([s, c]) => { const e = T(root, 60, 166, s, { size: 54, weight: 700, fill: c }); op(e, 0); return e; });
  const bench = G(root);
  E('rect', { x: 40, y: BY, width: 1120, height: 18, rx: 6, fill: '#26506A', stroke: '#3B6A82', 'stroke-width': 2 }, bench);
  E('rect', { x: 52, y: BY + 18, width: 1096, height: 102, rx: 14, fill: C.card, stroke: C.line, 'stroke-width': 2 }, bench);

  /* --- shiny: a polished ingot --- */
  const ingot = G(root);
  let band;
  { const x0 = 84, x1 = 300, y0 = BY - 70, y1 = BY, dx = 28, dy = -22;
    E('path', { d: `M${x0},${y0} L${x0 + dx},${y0 + dy} L${x1 + dx},${y0 + dy} L${x1},${y0} Z`, fill: '#F1F5F8', stroke: STEEL_ST, 'stroke-width': 2, 'stroke-linejoin': 'round' }, ingot);
    E('path', { d: `M${x1},${y0} L${x1 + dx},${y0 + dy} L${x1 + dx},${y1 + dy} L${x1},${y1} Z`, fill: '#7F8E9C', stroke: STEEL_ST, 'stroke-width': 2, 'stroke-linejoin': 'round' }, ingot);
    const fd = `M${x0},${y0} H${x1} V${y1} H${x0} Z`;
    E('path', { d: fd, fill: SILVER, stroke: STEEL_ST, 'stroke-width': 2 }, ingot);
    band = E('path', { d: `M0,${y0 - 4} L44,${y0 - 4} L16,${y1 + 4} L-28,${y1 + 4} Z`, fill: '#FFFFFF', opacity: 0.75 }, G(ingot, { 'clip-path': clipTo(fd) })); }
  const glints = [[328, 494], [104, 530]].map(([x, y], i) => { const s = spark(ingot, 11, { seed: i + 2 }); tr(s, x, y); return s; });
  const labShiny = benchLabel(190, 'shiny', 'when freshly cut', BLUE);

  /* --- heat: a metal spoon in a hot drink --- */
  const mug = G(root);
  const SP0 = [492, 506], SP1 = [452, 384];
  E('line', { x1: SP0[0], y1: SP0[1], x2: SP1[0], y2: SP1[1], stroke: '#D3DCE4', 'stroke-width': 11, 'stroke-linecap': 'round' }, mug);
  const spoonHot = E('line', { x1: SP0[0], y1: SP0[1], x2: SP1[0], y2: SP1[1], stroke: C.heat, 'stroke-width': 11, 'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': '1 1', 'stroke-dashoffset': 1 }, mug);
  E('ellipse', { cx: 480, cy: 480, rx: 66, ry: 9, fill: '#6B3E22' }, mug);
  E('path', { d: 'M546,500 C588,500 588,560 546,560', fill: 'none', stroke: '#2F6E96', 'stroke-width': 13, 'stroke-linecap': 'round' }, mug);
  E('path', { d: 'M414,478 L414,566 Q414,586 434,586 L526,586 Q546,586 546,566 L546,478 Q480,494 414,478 Z', fill: linGrad('#4C9BCB', '#2B6A93'), stroke: '#8CC8EA', 'stroke-width': 3, 'stroke-linejoin': 'round' }, mug);
  const steam = heatWaves(mug, { n: 2, h: 56, spacing: 30, color: '#D8E4EC', width: 4 }); tr(steam, 506, 462);
  const tipHeat = heatWaves(mug, { n: 2, h: 44, spacing: 18, color: C.heat, width: 4 }); tr(tipHeat, SP1[0] - 4, SP1[1] - 14);
  const labHeat = benchLabel(480, 'conducts heat', null, BLUE);

  /* --- electricity: a test circuit; the sample sits between two clips --- */
  const circ = G(root);
  const CY0 = 322, CY1 = 540, CXL = 690, CXR = 1110, SA = 828, SB = 972;
  const cell = cellSym(circ); tr(cell, 800, CY0);
  const bulb = bulbSym(circ); tr(bulb, 990, CY0);
  const wires = [wire(circ, [[758, CY0], [CXL, CY0], [CXL, CY1], [SA - 18, CY1]]), wire(circ, [[SB + 18, CY1], [CXR, CY1], [CXR, CY0], [1036, CY0]]), wire(circ, [[944, CY0], [842, CY0]])];
  const rod = E('rect', { x: SA, y: CY1 - 11, width: SB - SA, height: 22, rx: 6, fill: SILVER, stroke: '#D3DCE4', 'stroke-width': 2 }, circ);
  const sRod = E('rect', { x: SA, y: CY1 - 12, width: SB - SA, height: 24, rx: 9, fill: SULF, stroke: SULF_DK, 'stroke-width': 2 }, circ);
  const pencil = G(circ);
  E('path', { d: `M${SA},${CY1} L${SA + 24},${CY1 - 11} L${SB - 24},${CY1 - 11} L${SB},${CY1} L${SB - 24},${CY1 + 11} L${SA + 24},${CY1 + 11} Z`, fill: '#E8C99A', stroke: '#B08A5A', 'stroke-width': 2, 'stroke-linejoin': 'round' }, pencil);
  E('rect', { x: SA + 24, y: CY1 - 11, width: SB - SA - 48, height: 22, fill: '#F2B93B', stroke: '#C98F1E', 'stroke-width': 2 }, pencil);
  E('path', { d: `M${SA},${CY1} L${SA + 9},${CY1 - 4} L${SA + 9},${CY1 + 4} Z M${SB},${CY1} L${SB - 9},${CY1 - 4} L${SB - 9},${CY1 + 4} Z`, fill: '#3E464E' }, pencil);
  [[SA - 18, 1], [SB + 18, -1]].forEach(([x, s]) => E('path', { d: `M${x},${CY1 - 9} L${x + s * 26},${CY1 - 4} L${x + s * 26},${CY1 + 4} L${x},${CY1 + 9} Z`, fill: '#9AA8B5', stroke: '#D3DCE4', 'stroke-width': 2, 'stroke-linejoin': 'round' }, circ));
  const flow = wire(circ, [[SA, CY1], [SB, CY1]], { color: 'none' });
  const okT = tick(circ, 18); tr(okT, 1070, 262);
  const noX = cross(circ, 15); tr(noX, 1070, 262);
  const labCond = benchLabel(900, 'conducts electricity', null, BLUE);
  const labIns = benchLabel(900, 'insulator', 'no current flows', GREEN);
  const labGr = benchLabel(900, 'graphite conducts!', 'pencil “lead” is graphite', C.energy);

  /* --- malleable: hammer and anvil --- */
  const malG = G(root);
  E('path', { d: 'M110,522 L344,522 L344,548 L300,554 L292,568 L318,586 L182,586 L208,568 L200,554 L176,548 Q140,542 110,522 Z', fill: '#4C5964', stroke: '#7F8F9C', 'stroke-width': 3, 'stroke-linejoin': 'round' }, malG);
  const lump = E('ellipse', { cx: 248, fill: ball('#E3EAF0', '#7F8E9C'), stroke: STEEL_ST, 'stroke-width': 2 }, malG);
  const labMal = benchLabel(240, 'malleable', 'hammered into shape', BLUE);

  /* --- ductile: a rod pulled through a die becomes a wire --- */
  const dukG = G(root);
  const thick = E('rect', { y: 486, height: 28, rx: 5, fill: SILVER, stroke: '#D3DCE4', 'stroke-width': 2 }, dukG);
  const thin = E('rect', { x: 830, y: 496, height: 8, rx: 4, fill: '#DCE4EA' }, dukG);
  E('line', { x1: 830, y1: 556, x2: 830, y2: BY, stroke: '#7F8F9C', 'stroke-width': 10 }, dukG);
  E('path', { d: 'M806,440 L854,440 L854,556 L806,556 Z M806,484 L830,496 L830,504 L806,516 Z', fill: '#56636F', 'fill-rule': 'evenodd', stroke: '#8D9BA7', 'stroke-width': 3, 'stroke-linejoin': 'round' }, dukG);
  const pull = G(dukG); arrow(pull, 0, 500, 44, 500, { color: C.energy, width: 5 });
  const labDuc = benchLabel(900, 'ductile', 'drawn into wires', BLUE);

  /* --- dense: an iron block lands with a thud; two property meters; a bell --- */
  const blockG = G(root), block = G(blockG);
  { const x0 = 140, x1 = 280, y0 = BY - 116, dx = 26, dy = -20;
    E('path', { d: `M${x0},${y0} L${x0 + dx},${y0 + dy} L${x1 + dx},${y0 + dy} L${x1},${y0} Z`, fill: '#AEB8C2', stroke: STEEL_ST, 'stroke-width': 2, 'stroke-linejoin': 'round' }, block);
    E('path', { d: `M${x1},${y0} L${x1 + dx},${y0 + dy} L${x1 + dx},${BY + dy} L${x1},${BY} Z`, fill: '#55606A', stroke: STEEL_ST, 'stroke-width': 2, 'stroke-linejoin': 'round' }, block);
    E('rect', { x: x0, y: y0, width: x1 - x0, height: 116, fill: linGrad('#909BA6', '#5D6873', true), stroke: STEEL_ST, 'stroke-width': 2 }, block);
    T(block, (x0 + x1) / 2, y0 + 72, 'Fe', { size: 40, weight: 700, anchor: 'middle', fill: '#DCE3E9' }); }
  const dust = [0, 1, 2, 3].map(() => E('ellipse', { rx: 15, ry: 7, fill: '#A9B5C0' }, blockG));
  const labSolid = benchLabel(210, 'solid', 'e.g. iron', BLUE);
  const metG = G(root);
  const mMelt = meter(metG, { w: 38, h: 232, vertical: true, color: BLUE }); tr(mMelt, 421, 348);
  const mDens = meter(metG, { w: 38, h: 232, vertical: true, color: BLUE }); tr(mDens, 601, 348);
  const vMelt = T(metG, 440, 332, 'high', { size: 28, weight: 700, anchor: 'middle' });
  const vDens = T(metG, 620, 332, 'high', { size: 28, weight: 700, anchor: 'middle' });
  const labMelt = benchLabel(440, 'melting point'), labDens = benchLabel(620, 'density');
  const bellG = G(root), bell = G(bellG);
  E('rect', { x: 922, y: 352, width: 16, height: 40, rx: 5, fill: '#8A5A33' }, bell);
  E('circle', { cx: 930, cy: 348, r: 15, fill: ball('#B07A45', '#6E4422') }, bell);
  E('path', { d: 'M884,430 Q884,392 930,390 Q976,392 976,430 L984,520 Q990,556 1018,570 L1018,586 L842,586 L842,570 Q870,556 876,520 Z', fill: linGrad('#F7D889', '#B5862E'), stroke: '#FFE7A8', 'stroke-width': 3, 'stroke-linejoin': 'round' }, bell);
  E('path', { d: 'M902,424 Q904,408 918,404 L912,540', fill: 'none', stroke: '#FFF4CF', 'stroke-width': 6, 'stroke-linecap': 'round', opacity: 0.55 }, bell);
  const mallet = G(bellG);
  E('line', { x1: 0, y1: 0, x2: 156, y2: 0, stroke: '#B07A45', 'stroke-width': 9, 'stroke-linecap': 'round' }, mallet);
  E('ellipse', { cx: 172, cy: 0, rx: 16, ry: 22, fill: ball('#E8424F', '#9C2230') }, mallet);
  const arcs = [0, 1, 2, 3, 4, 5].map(() => E('path', { fill: 'none', stroke: C.energyLt, 'stroke-width': 5, 'stroke-linecap': 'round' }, bellG));
  const labBell = benchLabel(930, 'sonorous', 'rings when struck', BLUE);

  /* --- non-metals: a dull sulfur lump and a jar of gas --- */
  const lumpG = G(root);
  E('path', { d: closedPath(blobPts(80, 50, 11, 0, 0.13, 9)), fill: SULF, stroke: SULF_DK, 'stroke-width': 3, transform: `translate(210 ${BY - 48})` }, lumpG);
  [[-30, -12, 14, 8], [22, 6, 18, 9], [-6, 22, 12, 6]].forEach(([x, y, rx, ry]) => E('ellipse', { cx: 210 + x, cy: BY - 48 + y, rx, ry, fill: '#BBA63A', opacity: 0.8 }, lumpG));
  const labDull = benchLabel(210, 'dull', 'e.g. sulfur', GREEN);
  const jarG = G(root);
  E('rect', { x: 868, y: 336, width: 124, height: 250, rx: 10, fill: 'rgba(200,230,250,0.10)' }, jarG);
  const gas = particleBox(jarG, 100, 222, { n: 12, r: 9, color: '#9FD8FF', dark: '#4A8DBF', box: false, seed: 5 }); tr(gas, 880, 350);
  E('path', { d: 'M868,342 L868,576 Q868,586 878,586 L982,586 Q992,586 992,576 L992,342', fill: 'none', stroke: '#CFE7F5', 'stroke-width': 4, 'stroke-linejoin': 'round' }, jarG);
  E('rect', { x: 856, y: 326, width: 148, height: 12, rx: 4, fill: 'rgba(200,230,250,0.35)', stroke: '#CFE7F5', 'stroke-width': 3 }, jarG);
  const labGas = benchLabel(930, 'many are gases', 'e.g. oxygen, nitrogen', GREEN);

  /* --- brittle: the lump shatters --- */
  const shG = G(root), shards = [];
  { const r = rng(23);
    for (let i = 0; i < 9; i++) {
      const s = 11 + r() * 12, pts = [];
      for (let k = 0; k < 4; k++) { const a = k / 4 * TAU + r() * 0.9, q = s * (0.6 + r() * 0.5); pts.push([Math.cos(a) * q, Math.sin(a) * q]); }
      const el = E('path', { d: 'M' + pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' L') + 'Z', fill: SULF, stroke: SULF_DK, 'stroke-width': 2, 'stroke-linejoin': 'round' }, shG);
      const ang = -Math.PI / 2 - 0.8 + (i / 8) * 2.0, v = 170 + r() * 120;
      const sh = { el, x0: 210 + Math.cos(ang) * 22, y0: BY - 50 + Math.sin(ang) * 14, vx: Math.cos(ang) * v, vy: Math.sin(ang) * v - 60, w: (r() - 0.5) * 700, floor: BY - s * 0.45 };
      sh.tl = (-sh.vy + Math.sqrt(sh.vy * sh.vy + 1800 * (sh.floor - sh.y0))) / 900;   // time to land (gravity 900 px/s²)
      shards.push(sh);
    } }
  const labBrit = benchLabel(210, 'brittle', 'shatters instead of bending', GREEN);
  const ham = G(root);                                  // the hammer, used on both lumps
  E('line', { x1: 0, y1: 0, x2: -168, y2: 0, stroke: '#B07A45', 'stroke-width': 14, 'stroke-linecap': 'round' }, ham);
  E('rect', { x: -214, y: -34, width: 48, height: 64, rx: 7, fill: linGrad('#9AA8B5', '#5E6B77'), stroke: STEEL_ST, 'stroke-width': 2 }, ham);

  /* --- graphite: the exception, and electrodes --- */
  const exChip = chip(root, 'the exception', { size: 28, fill: C.card2, stroke: C.energy, color: C.energy }); tr(exChip, 520, 148); op(exChip, 0);
  const elG = G(root);
  beaker(elG, 236, 150, { level: 0.6, liquid: '#86CDEB', opacity: 0.45 }).setAttribute('transform', `translate(250 ${BY - 75})`);
  [208, 292].forEach(x => { E('line', { x1: x, y1: 372, x2: x, y2: 402, stroke: WIRE, 'stroke-width': 5 }, elG); E('rect', { x: x - 8, y: 400, width: 16, height: 164, rx: 4, fill: '#3E464E', stroke: '#7F8C98', 'stroke-width': 2 }, elG); });
  const eCell = cellSym(elG); tr(eCell, 250, 372);
  const eBub = [bubbles(elG, 192, 514, 32, 50, { n: 5, r: 5, seed: 7 }), bubbles(elG, 276, 514, 32, 50, { n: 5, r: 5, seed: 8 })];
  const labEl = benchLabel(250, 'used in electrodes', 'graphite rods conduct', C.energy);

  /* --- try this at home: the magnet test --- */
  const fcn = G(root);
  const fcnT = ['Fe', 'Co', 'Ni'].map((s, i) => { const g = G(fcn); E('rect', { x: -36, y: -36, width: 72, height: 72, rx: 9, fill: '#E8424F', stroke: '#FFB3BA', 'stroke-width': 3 }, g); T(g, 0, 12, s, { size: 34, weight: 700, anchor: 'middle', fill: '#FFFFFF' }); return g; });
  const fcnLab = T(fcn, 324, 274, 'iron, cobalt, nickel', { size: 30, weight: 700, fill: '#FF9AA2' });
  const objG = G(root);
  const OBJ = [
    { x: 210, hh: 18, mag: true, label: 'steel paperclip', draw: g => E('path', { d: 'M-20,-4 L24,-4 A5,5 0 0 1 24,6 L-34,6 A9,9 0 0 1 -34,-12 L34,-12 A13,13 0 0 1 34,14 L-14,14', fill: 'none', stroke: STEEL_ST, 'stroke-width': 3.4, 'stroke-linecap': 'round', transform: 'scale(1.35)' }, g) },
    { x: 450, hh: 14, mag: true, label: 'iron nail', draw: g => E('path', { d: 'M-62,-14 L-54,-14 L-54,-5 L48,-5 L68,0 L48,5 L-54,5 L-54,14 L-62,14 Z', fill: linGrad('#B9C3CC', '#6F7B86', true), stroke: STEEL_ST, 'stroke-width': 2, 'stroke-linejoin': 'round' }, g) },
    { x: 690, hh: 30, mag: false, label: 'aluminium foil', draw: g => { E('path', { d: closedPath(blobPts(62, 30, 12, 0, 0.2, 13)), fill: '#DCE3E9', stroke: '#9FACB8', 'stroke-width': 2 }, g); E('path', { d: 'M-34,-8 L-8,8 L12,-12 L36,4 M-18,16 L4,0 L22,14', fill: 'none', stroke: '#A9B5C0', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, g); } },
    { x: 930, hh: 22, mag: false, label: 'copper wire', draw: g => { const pts = []; for (let i = 0; i <= 150; i++) { const th = i / 150 * 12 * Math.PI; pts.push([-60 + th * 120 / (12 * Math.PI) + 11 * Math.sin(th), 19 * Math.cos(th)]); } E('path', { d: 'M' + pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' L'), fill: 'none', stroke: CU, 'stroke-width': 4.5, 'stroke-linejoin': 'round' }, g); } },
  ];
  OBJ.forEach(o => {
    o.g = G(objG); o.draw(o.g); o.rest = BY - o.hh - 2;
    o.mark = o.mag ? tick(objG, 17) : cross(objG, 14); tr(o.mark, o.x, BY - 112);
    o.lab = benchLabel(o.x, o.label);
  });
  const magG = G(root), mag = magnet(magG, 200, 56);
  const mostChip = chip(root, 'Most metals aren’t magnetic!', { size: 32, fill: C.card2, stroke: C.energy, color: C.energy }); tr(mostChip, 560, 410);

  /* --- one surprise: copper-coloured coins, steel inside --- */
  const coinG = G(root);
  const COINS = [{ x: 228, r: 34, s: '1p' }, { x: 330, r: 44, s: '2p' }].map(c => {
    const g = G(coinG);
    E('circle', { r: c.r, fill: ball('#EDA56B', '#9A4E1E'), stroke: CU_LT, 'stroke-width': 3 }, g);
    E('circle', { r: c.r * 0.78, fill: 'none', stroke: '#B8652E', 'stroke-width': 2, opacity: 0.7 }, g);
    T(g, 0, c.r * 0.3, c.s, { size: Math.round(c.r * 0.8), weight: 700, anchor: 'middle', fill: '#6E3415' });
    return Object.assign(c, { g, rest: BY - c.r });
  });
  const pop2 = spark(root, 20, { seed: 9 });
  const labStick = benchLabel(280, '1p and 2p coins stick!', 'newer copper-coloured ones', C.energy);
  // the 2p, magnified and cut open: a front quarter lifts out to show a steel core under a thin copper coat
  const cut = G(root), wedge = G(cut);
  const CC = [846, 392], CA = 180, CB = 70, CH = 48, CK = 7;
  const Pe = (th, dy) => [CC[0] + CA * Math.cos(th * Math.PI / 180), CC[1] + CB * Math.sin(th * Math.PI / 180) + (dy || 0)];
  const pt = p => p[0].toFixed(1) + ',' + p[1].toFixed(1);
  const rimD = (a1, a2) => `M${pt(Pe(a1))} A${CA},${CB} 0 0 1 ${pt(Pe(a2))} L${pt(Pe(a2, CH))} A${CA},${CB} 0 0 0 ${pt(Pe(a1, CH))} Z`;
  const quad = (R, d0, d1) => `M${CC[0]},${CC[1] + d0} L${pt([R[0], R[1] + d0])} L${pt([R[0], R[1] + d1])} L${CC[0]},${CC[1] + d1} Z`;
  [[45, '#A7B2BC'], [135, '#7E8B97']].forEach(([a, steel]) => {
    const R = Pe(a);
    E('path', { d: quad(R, 0, CK), fill: CU }, cut);
    E('path', { d: quad(R, CK, CH - CK), fill: steel }, cut);
    E('path', { d: quad(R, CH - CK, CH), fill: CU }, cut);
  });
  E('path', { d: rimD(0, 45), fill: '#A9592A' }, cut);
  E('path', { d: rimD(135, 180), fill: '#A9592A' }, cut);
  const topD = `M${pt(CC)} L${pt(Pe(135))} A${CA},${CB} 0 1 1 ${pt(Pe(45))} Z`;
  const cutTop = E('path', { d: topD, fill: linGrad('#F4B47E', '#C46A30'), stroke: '#FFD2A6', 'stroke-width': 2, 'stroke-linejoin': 'round' }, cut);
  E('text', { x: 0, y: 0, 'font-size': 92, 'font-weight': 700, 'font-family': FD, 'text-anchor': 'middle', fill: '#8E4A1E', opacity: 0.55, transform: `translate(${CC[0]} ${CC[1] - 14}) scale(1 0.4)` }, cut).textContent = '2p';
  E('path', { d: rimD(45, 135), fill: '#A9592A' }, wedge);
  E('path', { d: `M${pt(CC)} L${pt(Pe(45))} A${CA},${CB} 0 0 1 ${pt(Pe(135))} Z`, fill: linGrad('#F4B47E', '#C46A30'), stroke: '#FFD2A6', 'stroke-width': 2, 'stroke-linejoin': 'round' }, wedge);
  const cutLabCu = labelLine(root, 640, 366, 782, 421, 'thin copper coat', { size: 30, fill: CU_LT, anchor: 'end' });
  const cutLabFe = labelLine(root, 640, 470, 782, 442, 'steel core', { size: 30, fill: '#D3DCE4', anchor: 'end' });

  /* ---------- timings that do not depend on t ---------- */
  const T0 = k => mid('magnet', 0.16 + 0.15 * k);
  const KS = [[mid('magnet', 0.04), -160, 410], [T0(0), OBJ[0].x, 410]];
  OBJ.forEach((o, k) => {
    const tk = T0(k), yd = o.rest - o.hh - 40 - 28;
    KS.push([tk + 0.3, o.x, yd], [tk + 0.55, o.x, yd], [tk + 0.85, o.x, 410]);
    if (k < 3) KS.push([tk + 1.0, o.x, 410], [T0(k + 1), OBJ[k + 1].x, 410]);
  });
  KS.push([T0(3) + 1.0, OBJ[3].x, 410], [T0(3) + 1.6, 1040, 410]);
  KS.push([mid('coins', 0.12), 1040, 410], [mid('coins', 0.26), 280, 410], [mid('coins', 0.31), 280, 430], [mid('coins', 0.36), 280, 430], [mid('coins', 0.42), 280, 404]);
  const MAL_HITS = [mid('malleable', 0.12), mid('malleable', 0.24), mid('malleable', 0.36)];
  const T_SH = mid('brittle', 0.62), BELL_HITS = [mid('dense', 0.62), mid('dense', 0.8)];
  const T_STICK = mid('coins', 0.3), T_FLY = mid('coins', 0.46), T_OPEN = mid('coins', 0.58);

  return t => {
    /* ===== the table: big, or a small legend in the corner ===== */
    const mm = clamp(P(t, at('shiny') - 0.5, 1.0) - P(t, at('metalloids') - 0.4, 1.0) + P(t, at('magnet') - 0.4, 1.0));
    tr(gridG, lerp(GX, MX, mm), lerp(GY, MY, mm), lerp(1, MS, mm));
    const stair = P(t, at('staircase') + 0.1, 2.3, ease);
    const hiM = win(t, at('shiny') - 0.3, at('dull') + 0.3, 0.6), hiN = win(t, at('dull') - 0.1, at('metalloids') + 0.1, 0.6);
    const fH = win(t, mid('most', 0.42), at('shiny') - 0.2, 0.3), fC = win(t, mid('graphite', 0.2), mid('graphite', 0.8), 0.3);
    const fMd = win(t, mid('metalloids', 0.22), at('magnet') - 0.1, 0.5), fF = P(t, mid('magnet', 0.42), 0.6);
    gridSet({
      kind: P(t, mid('split', 0.12), 1.2), stair, labels: 1 - mm, dim: Math.max(hiM, hiN, 0.7 * fMd, fF),
      hi: [{ z: 1, p: fH, color: GREEN }, { z: 6, p: fC, color: C.energy }, { z: 14, p: fMd, color: '#FFD978' }, { z: [26, 27, 28], p: fF, color: C.bad },
        { kind: 'metal', p: hiM, color: BLUE, lift: false }, { kind: 'nonmetal', p: hiN, color: GREEN, lift: false }, { family: 'metalloid', p: fMd, color: AMBER }],
    }, P(t, mid('metalloids', 0.2), 0.8), 1 - mm);
    const hz = fH > 0 ? 1 : fC > 0 ? 6 : 14, hv = Math.max(fH, fC, fMd);
    op(halo, hv * (0.65 + 0.35 * wave(t, 1.1)));
    if (hv > 0) tr(halo, grid.xy(hz)[0], grid.xy(hz)[1]);
    const sg = Math.max(win(t, at('staircase'), at('shiny') - 0.1, 0.4), win(t, mid('metalloids', 0.2), at('magnet') - 0.2, 0.4));
    op(stairGlow, 0.3 * sg * (0.75 + 0.25 * wave(t, 1.6)));
    stairGlow.setAttribute('stroke-dashoffset', (1 - stair).toFixed(4));
    const ss = win(t, at('staircase') + 0.1, at('staircase') + 2.6, 0.25);
    op(stairSpark, ss);
    if (ss > 0) { const u = stair * (ST.length - 1), i = Math.min(ST.length - 2, Math.floor(u)), f = u - i; tr(stairSpark, lerp(ST[i][0], ST[i + 1][0], f), lerp(ST[i][1], ST[i + 1][1], f)); stairSpark.upd(t); }

    op(labMetals, win(t, mid('split', 0.42), at('most') + 0.1, 0.4));
    op(labNon, win(t, mid('split', 0.6), at('most') + 0.1, 0.4));
    op(stairLab, win(t, mid('staircase', 0.35), at('most') + 0.1, 0.4)); stairArrow.set(P(t, mid('staircase', 0.45), 0.5));
    const pe = win(t, mid('most', 0.04), at('shiny') - 0.1, 0.4);
    op(pieG, pe); op(pieTxt, pe);
    if (pe > 0) {
      const a = 288 * P(t, mid('most', 0.08), 1.6, easeOut) * Math.PI / 180;
      pieM.setAttribute('d', a < 0.01 ? '' : `M0,0 L0,-60 A60,60 0 ${a > Math.PI ? 1 : 0} 1 ${(60 * Math.sin(a)).toFixed(1)},${(-60 * Math.cos(a)).toFixed(1)} Z`);
    }
    op(hLab, win(t, mid('most', 0.5), at('shiny') - 0.1, 0.35)); hArrow.set(P(t, mid('most', 0.5), 0.45));
    const md = win(t, mid('metalloids', 0.3), at('magnet') - 0.2, 0.4);
    op(mdG, md);
    if (md > 0) {
      op(mdG.firstChild, P(t, mid('metalloids', 0.62), 0.4, linear)); op(mdMix, P(t, mid('metalloids', 0.42), 0.4, linear));
      const cp = P(t, mid('metalloids', 0.3), 0.5, pop); tr(chipIc, 660, 288 + (1 - clamp(cp)) * 20, 0.8 + 0.2 * cp); op(chipLab, P(t, mid('metalloids', 0.36), 0.4, linear));
    }

    /* ===== heading and bench ===== */
    const hd = [win(t, at('shiny') - 0.1, at('dull') - 0.1, 0.4), win(t, at('dull') - 0.1, at('metalloids') - 0.1, 0.4), win(t, at('magnet') + 0.1, at('coins'), 0.4), P(t, at('coins'), 0.4, linear)];
    HEADS.forEach((h, i) => op(h, hd[i]));
    op(bench, Math.max(win(t, at('shiny') - 0.3, at('metalloids') + 0.1, 0.5), P(t, at('magnet') - 0.1, 0.5, linear)));
    // pop a group in from below at t0, inside the window env
    const show = (g, t0, env) => { const p = P(t, t0, 0.5, pop); tr(g, 0, (1 - clamp(p)) * 24); const v = clamp(p * 2) * env; op(g, v); return v; };

    /* --- shiny, heat, electricity --- */
    const aS = win(t, at('shiny') - 0.1, at('malleable') - 0.05, 0.4);
    if (show(ingot, mid('shiny', 0.02), aS) > 0) {
      const ph = ((t - at('shiny')) * 0.62 * calm) % 1;
      tr(band, lerp(30, 340, ph), 0);
      glints.forEach((g, i) => { op(g, Math.sin(Math.PI * (((t - at('shiny')) * 0.5 + i * 0.5) % 1))); g.upd(t); });
    }
    op(labShiny, win(t, mid('shiny', 0.08), at('malleable') - 0.05, 0.4));
    if (show(mug, mid('shiny', 0.3), aS) > 0) {
      spoonHot.setAttribute('stroke-dashoffset', (1 - P(t, mid('shiny', 0.42), 1.5, linear)).toFixed(4));
      steam.upd(t * calm); tipHeat.upd(t * calm); op(tipHeat, P(t, mid('shiny', 0.42) + 1.3, 0.4, linear));
    }
    op(labHeat, win(t, mid('shiny', 0.42), at('malleable') - 0.05, 0.4));
    const aC1 = win(t, mid('shiny', 0.45), at('malleable') - 0.05, 0.4), aC2 = win(t, at('brittle') - 0.1, at('metalloids') - 0.1, 0.4);
    const aC = Math.max(show(circ, t < at('brittle') - 0.2 ? mid('shiny', 0.45) : at('brittle') - 0.1, Math.max(aC1, aC2)), 0);
    if (aC > 0) {
      const lift = P(t, mid('graphite', 0.14), 0.5), drop = P(t, mid('graphite', 0.22), 0.55, easeOut);
      op(rod, t < at('brittle') - 0.2 ? 1 : 0);
      op(sRod, t < at('brittle') - 0.2 ? 0 : 1 - lift); tr(sRod, 0, -70 * lift);
      op(pencil, t < mid('graphite', 0.2) ? 0 : clamp(drop * 3)); tr(pencil, 0, -90 * (1 - drop));
      const on = t < at('brittle') - 0.2 ? P(t, mid('shiny', 0.62), 0.4, linear) : P(t, mid('graphite', 0.42), 0.4, linear);
      bulb.set(on);
      wires.forEach(w => { w.set(on); w.upd(t, 70 * calm); }); flow.set(on); flow.upd(t, 70 * calm);
      const okp = P(t, mid('graphite', 0.5), 0.45, pop), nop = P(t, mid('brittle', 0.3), 0.45, pop) * (1 - P(t, mid('graphite', 0.14), 0.3, linear));
      op(okT, clamp(okp * 2)); tr(okT, 1070, 262, Math.max(0.01, okp));
      op(noX, clamp(nop * 2)); tr(noX, 1070, 262, Math.max(0.01, clamp(nop)));
    }
    op(labCond, win(t, mid('shiny', 0.62), at('malleable') - 0.05, 0.4));
    op(labIns, win(t, mid('brittle', 0.3), at('graphite') + 0.2, 0.4));
    op(labGr, win(t, mid('graphite', 0.44), at('metalloids') - 0.1, 0.4));

    /* --- malleable, ductile --- */
    const aM = win(t, at('malleable') - 0.1, at('dense') - 0.05, 0.4);
    if (show(malG, at('malleable'), aM) > 0) {
      const f = MAL_HITS.reduce((s, h) => s + P(t, h - 0.02, 0.1, easeOut), 0) / 3;
      const rx = lerp(40, 104, f), ry = lerp(30, 9, f);
      attr(lump, 'rx', rx); attr(lump, 'ry', ry); attr(lump, 'cy', 522 - ry);
    }
    op(labMal, win(t, mid('malleable', 0.14), at('dense') - 0.05, 0.4));
    if (show(dukG, mid('malleable', 0.5), aM) > 0) {
      const d = P(t, mid('malleable', 0.56), 1.9, linear), x0 = lerp(640, 772, d);
      attr(thick, 'x', x0); attr(thick, 'width', 840 - x0); attr(thin, 'width', 24 + 250 * d);
      tr(pull, 860 + 250 * d, 0); op(pull, P(t, mid('malleable', 0.56), 0.3, linear) * (1 - P(t, mid('malleable', 0.56) + 1.9, 0.3, linear)));
    }
    op(labDuc, win(t, mid('malleable', 0.56), at('dense') - 0.05, 0.4));
    // the hammer: three blows on the metal lump, then one on the sulfur lump
    const hM = win(t, at('malleable') + 0.1, at('dense') - 0.05, 0.3), hB = win(t, mid('brittle', 0.42), mid('brittle', 0.95), 0.3);
    op(ham, Math.max(hM, hB));
    if (hM > 0) {
      const f = MAL_HITS.reduce((s, h) => s + P(t, h + 0.04, 0.4, linear), 0) / 3, top = 522 - 2 * lerp(30, 9, Math.min(1, f + 1 / 3));
      const hit = -Math.asin(clamp((top - 462) / 190, -1, 1)) * 180 / Math.PI;
      ham.setAttribute('transform', `translate(440 432) rotate(${lerp(38, hit, swing(t, MAL_HITS)).toFixed(2)})`);
    } else if (hB > 0) ham.setAttribute('transform', `translate(400 452) rotate(${lerp(38, 0, swing(t, [T_SH])).toFixed(2)})`);

    /* --- dense: block, meters, bell --- */
    const tDrop = mid('dense', 0.04), out = P(t, at('dull') - 0.05, 0.45);
    const aB = win(t, at('dense') - 0.1, at('dull') + 0.45, 0.3);
    op(blockG, aB * (1 - out));
    if (aB > 0) {
      const dy = -380 * (1 - P(t, tDrop, 0.42, easeIn)) - 40 * out, sq = Math.sin(Math.PI * P(t, tDrop + 0.42, 0.22, linear));
      block.setAttribute('transform', `translate(0 ${dy.toFixed(1)}) translate(210 ${BY}) scale(${(1 + 0.05 * sq).toFixed(3)} ${(1 - 0.08 * sq).toFixed(3)}) translate(-210 ${-BY})`);
      const u = (t - tDrop - 0.42) / 0.7;
      dust.forEach((e, i) => { const side = i % 2 ? 1 : -1, k = Math.floor(i / 2); op(e, u > 0 && u < 1 ? (1 - u) * 0.8 : 0); if (u > 0 && u < 1) { attr(e, 'cx', 210 + side * (72 + 70 * easeOut(u) + k * 18)); attr(e, 'cy', BY - 6 - k * 10 - 12 * u); } });
    }
    op(labSolid, win(t, mid('dense', 0.1), at('dull') - 0.05, 0.4));
    const aMt = win(t, mid('dense', 0.2), at('brittle') - 0.05, 0.4);
    if (show(metG, mid('dense', 0.2), aMt) > 0) {
      // once the non-metals line starts, each meter waits (dimmed, no value shown) until its own drop
      [[mMelt, vMelt, mid('dull', 0.42), 0.9 * P(t, mid('dense', 0.26), 0.9, easeOut), 0.14], [mDens, vDens, mid('dull', 0.58), 0.82 * P(t, mid('dense', 0.42), 0.9, easeOut), 0.18]].forEach(([m, v, t0, hi, lo]) => {
        const d = P(t, t0, 0.9), hold = win(t, at('dull') - 0.1, t0 + 0.3, 0.3);
        m.set(lerp(hi, lo, d)); op(m, 1 - 0.55 * hold);
        wr(m.children[1], 'fill', _ptMix(BLUE, GREEN, d));
        wr(v, 'fill', d < 0.5 ? BLUE : GREEN); if (v.textContent !== (d < 0.5 ? 'high' : 'low')) setText(v, d < 0.5 ? 'high' : 'low');
        op(v, (hi > 0.3 ? 1 : 0) * (1 - Math.sin(Math.PI * d)) * (d < 0.5 ? 1 - hold : 1));
      });
    }
    op(labMelt, aMt * P(t, mid('dense', 0.24), 0.4, linear)); op(labDens, aMt * P(t, mid('dense', 0.4), 0.4, linear));
    const bOut = P(t, at('dull') + 0.05, 0.45);
    if (show(bellG, mid('dense', 0.52), win(t, mid('dense', 0.5), at('dull') + 0.5, 0.3) * (1 - bOut)) > 0) {
      let wob = 0; BELL_HITS.forEach(h => { const u = t - h; if (u > 0) wob += 3 * Math.exp(-3 * u) * Math.sin(18 * u) * calm; });
      bell.setAttribute('transform', `rotate(${wob.toFixed(2)} 930 352)`);
      mallet.setAttribute('transform', `translate(1130 400) rotate(${lerp(112, 136, swing(t, BELL_HITS)).toFixed(2)})`);
      const ring = win(t, BELL_HITS[0], at('dull') + 0.3, 0.2);
      arcs.forEach((a, i) => {
        const q = ((t - BELL_HITS[0]) * 0.9 * (S.reduce ? 0.5 : 1) + (i % 3) / 3) % 1, r = 118 + q * 80, s = i < 3 ? 0 : 180;
        const a1 = (s - 32) * Math.PI / 180, a2 = (s + 32) * Math.PI / 180;
        a.setAttribute('d', `M${(930 + r * Math.cos(a1)).toFixed(1)},${(476 + r * Math.sin(a1)).toFixed(1)} A${r.toFixed(1)},${r.toFixed(1)} 0 0 1 ${(930 + r * Math.cos(a2)).toFixed(1)},${(476 + r * Math.sin(a2)).toFixed(1)}`);
        op(a, ring * (1 - q) * 0.9);
      });
    }
    op(labBell, win(t, mid('dense', 0.62), at('dull') - 0.05, 0.4));

    /* --- non-metals: dull lump, gas jar --- */
    if (show(lumpG, mid('dull', 0.06), win(t, mid('dull', 0.04), at('graphite'), 0.3) * (t < T_SH ? 1 : 0)) > 0) { /* static */ }
    op(labDull, win(t, mid('dull', 0.1), at('brittle') - 0.05, 0.4));
    if (show(jarG, mid('dull', 0.28), win(t, mid('dull', 0.26), at('brittle') - 0.05, 0.4)) > 0) gas.set('gas', t * calm, 0.45);
    op(labGas, win(t, mid('dull', 0.3), at('brittle') - 0.05, 0.4));

    /* --- brittle: shards --- */
    const aSh = t >= T_SH ? 1 - P(t, mid('graphite', 0.45), 0.4, linear) : 0;
    op(shG, aSh);
    if (aSh > 0) shards.forEach(s => {
      const u = t - T_SH, f = Math.min(u, s.tl);
      tr(s.el, s.x0 + s.vx * f + (u > s.tl ? s.vx * 0.04 * Math.min(1, (u - s.tl) * 4) : 0), Math.min(s.floor, s.y0 + s.vy * f + 450 * f * f), 1, s.w * f);
    });
    op(labBrit, win(t, T_SH + 0.1, mid('graphite', 0.5), 0.4));

    /* --- graphite: exception, electrodes --- */
    const ex = P(t, mid('graphite', 0.03), 0.5, pop) * win(t, at('graphite'), at('metalloids') - 0.1, 0.3);
    op(exChip, clamp(ex * 2)); tr(exChip, 520, 148, 0.8 + 0.2 * clamp(ex));
    if (show(elG, mid('graphite', 0.62), win(t, mid('graphite', 0.6), at('metalloids') - 0.1, 0.4)) > 0) eBub.forEach(b => b.upd(t * calm, 1));
    op(labEl, win(t, mid('graphite', 0.64), at('metalloids') - 0.1, 0.4));

    /* --- magnet --- */
    const aT = win(t, mid('magnet', 0.42), at('coins'), 0.4);
    op(fcn, aT);
    if (aT > 0) { fcnT.forEach((g, i) => { const p = P(t, mid('magnet', 0.44 + i * 0.04), 0.5, pop); op(g, clamp(p * 2)); tr(g, 104 + i * 82, 262, Math.max(0.01, 0.6 + 0.4 * p)); }); op(fcnLab, P(t, mid('magnet', 0.56), 0.4, linear)); }
    const [mx, my] = along(t, KS);
    op(magG, P(t, at('magnet'), 0.3, linear));
    tr(mag, mx, my);
    const aO = win(t, at('magnet') + 0.1, at('coins') + 0.1, 0.4);
    op(objG, aO);
    OBJ.forEach((o, k) => {
      op(o.lab, aO * P(t, at('magnet') + 0.3 + 0.12 * k, 0.4, linear));
      if (aO <= 0) return;
      const tk = T0(k), pin = P(t, at('magnet') + 0.2 + 0.12 * k, 0.5, pop);
      const s = o.mag ? P(t, tk + 0.32, 0.12, easeOut) - P(t, tk + 1.02, 0.3, easeIn) : 0;
      tr(o.g, o.x, lerp(o.rest, my + 28 + o.hh, s) + (1 - clamp(pin)) * 20);
      op(o.g, clamp(pin * 2));
      const mp = P(t, tk + 1.25, 0.45, pop); op(o.mark, clamp(mp * 2)); tr(o.mark, o.x, BY - 112, Math.max(0.01, mp));
    });
    const mc = P(t, mid('magnet', 0.84), 0.5, pop) * (1 - P(t, at('coins') + 0.1, 0.4, linear));
    op(mostChip, clamp(mc * 2)); tr(mostChip, 560, 410 + (1 - clamp(mc)) * 16);

    /* --- coins --- */
    const aCo = P(t, at('coins') + 0.3, 0.4, linear);
    op(coinG, aCo);
    if (aCo > 0) COINS.forEach((c, i) => {
      const pin = P(t, at('coins') + 0.3 + 0.15 * i, 0.5, pop), s = P(t, T_STICK + 0.04 * i, 0.12, easeOut);
      let x = c.x, y = lerp(c.rest, my + 28 + c.r, s) + (1 - clamp(pin)) * 20, sc = '1';
      let o = clamp(pin * 2);
      if (i === 1) {
        const f = P(t, T_FLY, 0.9);
        x = lerp(x, CC[0], f); y = lerp(y, CC[1] + 10, f) - Math.sin(Math.PI * f) * 60;
        sc = `${lerp(1, CA / c.r, f).toFixed(3)} ${lerp(1, CB / c.r, f).toFixed(3)}`;
        o *= 1 - P(t, T_FLY + 0.6, 0.3, linear);
      }
      c.g.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${sc})`);
      op(c.g, o);
    });
    const ps = win(t, T_STICK + 0.05, T_STICK + 1.0, 0.2); op(pop2, ps); if (ps > 0) { tr(pop2, 412, 430, 0.6 + 0.6 * P(t, T_STICK, 0.4, easeOut)); pop2.upd(t); }
    op(labStick, P(t, T_STICK + 0.1, 0.4, linear));
    const cv = P(t, T_FLY + 0.55, 0.4, linear);
    op(cut, cv);
    if (cv > 0) {
      const w = P(t, T_OPEN, 0.7);
      op(wedge, 1 - w); tr(wedge, 0, 80 * w);
      cutTop.setAttribute('stroke-width', (2 + 3 * win(t, mid('coins', 0.72), mid('coins', 0.95), 0.3) * wave(t, 0.9)).toFixed(2));
    }
    cutLabFe.set(P(t, mid('coins', 0.62), 0.4, linear)); cutLabCu.set(P(t, mid('coins', 0.72), 0.4, linear));
  };
});
