/* Chapter 8, Trends, prediction and Mendeleev.
   A magnifier finds a "?" in Group 1 -> trend arrows down Groups 1 and 7, smooth melting points
   -> Period 3 turns from metal to non-metal as outer electrons go 1 to 8 -> the "?" is rubidium:
   predicted, even more violent in water -> Mendeleev, 1869, and his desk of cards -> the cards line
   up, arsenic is pushed along and two gaps open -> his prediction for the gap below silicon ->
   gallium's density, measured again -> germanium matches every guess -> the ticks become an
   "evidence" stamp -> tellurium and iodine in proton-number order. */
scene('mendeleev', S => {
  const { at, end, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;
  const GX = 64, GY = 236;
  const PAPER = '#F3E9D2', EDGE = '#C9B48C', INK = '#3A2A1A', PENCIL = '#7A6446';
  const HAL = '#B5E655', ALK = C.heat;
  const cubic = (a, b, c, d, u) => { const v = 1 - u; return [v * v * v * a[0] + 3 * v * v * u * b[0] + 3 * v * u * u * c[0] + u * u * u * d[0], v * v * v * a[1] + 3 * v * v * u * b[1] + 3 * v * u * u * c[1] + u * u * u * d[1]]; };
  const beat = (t, a, b) => win(t, a, b, 0.45);

  /* ================= A. the table's power: prediction ================= */
  const A = G(root);
  const gridG = G(A); tr(gridG, GX, GY);
  const grid = ptGrid(gridG, {});
  const [rbx, rby] = grid.xy(37);
  const qCover = G(gridG); tr(qCover, rbx, rby);
  E('rect', { x: -33, y: -33, width: 66, height: 66, rx: 9, fill: C.bg1, stroke: C.energy, 'stroke-width': 3, 'stroke-dasharray': '7 5' }, qCover);
  T(qCover, 0, 14, '?', { size: 40, weight: 700, anchor: 'middle', fill: C.energy });
  const mag = G(A);
  E('line', { x1: 48, y1: 48, x2: 104, y2: 104, stroke: '#C9D6DE', 'stroke-width': 17, 'stroke-linecap': 'round' }, mag);
  E('circle', { r: 64, fill: 'rgba(159,216,255,0.10)', stroke: '#E4EDF2', 'stroke-width': 9 }, mag);
  E('path', { d: 'M-40,-22 A46,46 0 0 1 -11,-46', stroke: '#ffffff', 'stroke-width': 5, fill: 'none', opacity: 0.5, 'stroke-linecap': 'round' }, mag);
  const pChip = chip(A, 'prediction', { size: 40, fill: 'rgba(10,27,39,0.9)', stroke: C.energy, color: C.energy, sw: 3 });
  tr(pChip, GX + 420, GY + 62);
  const pSub = T(A, GX + 420, GY + 136, 'from where an element sits', { size: 28, weight: 600, anchor: 'middle' });
  const MAGP = [[1030, 470], [780, 640], [380, 380], [rbx + GX, rby + GY]];

  /* ================= shared: big family tiles ================= */
  function famTile(parent, sym, fill, ink) {
    const g = G(parent);
    const box = E('rect', { x: -46, y: -46, width: 92, height: 92, rx: 10, fill, stroke: '#FFFFFF', 'stroke-opacity': 0.35, 'stroke-width': 2 }, g);
    const tx = T(g, 0, 15, sym, { size: 42, weight: 700, anchor: 'middle', fill: ink });
    return { g, box, tx };
  }
  /* trend wedge pointing down from y0 to y1; thin-to-thick = rises, thick-to-thin = falls */
  function wedge(parent, x, y0, y1, wTop, wBot, color) {
    const hy = y1 - 32, hw = Math.max(wBot / 2 + 12, 24);
    const d = `M${x - wTop / 2},${y0} L${x + wTop / 2},${y0} L${x + wBot / 2},${hy} L${x + hw},${hy} L${x},${y1} L${x - hw},${hy} L${x - wBot / 2},${hy} Z`;
    return E('path', { d, fill: color, 'stroke-linejoin': 'round' }, parent);
  }
  const growDown = (el, x, y0, p) => el.setAttribute('transform', `translate(0 ${y0}) scale(1 ${Math.max(0.001, p).toFixed(4)}) translate(0 ${-y0})`);
  const ROW = [262, 366, 470, 574];

  /* ================= B. down a group ================= */
  // the Group 1 stack is shared with "rubidium"
  const g1 = G(root);
  T(g1, 170, 196, 'Group 1', { size: 30, weight: 700, anchor: 'middle', fill: ALK });
  ['Li', 'Na', 'K'].forEach((s, i) => { const o = famTile(g1, s, ALK, C.bg0); tr(o.g, 170, ROW[i]); });
  const rbG = G(g1);
  const rbQ = G(rbG);
  E('rect', { x: -46, y: -46, width: 92, height: 92, rx: 10, fill: C.bg1, stroke: C.energy, 'stroke-width': 3, 'stroke-dasharray': '8 6' }, rbQ);
  T(rbQ, 0, 15, '?', { size: 44, weight: 700, anchor: 'middle', fill: C.energy });
  const rbFace = famTile(rbG, 'Rb', ALK, C.bg0);
  const w1 = wedge(g1, 250, 222, 622, 6, 34, ALK);
  T(g1, 286, 404, 'reactivity', { size: 28, weight: 600 });
  T(g1, 286, 446, 'rises', { size: 38, weight: 700, fill: ALK });

  const Bg = G(root);
  T(Bg, 560, 196, 'Group 7', { size: 30, weight: 700, anchor: 'middle', fill: HAL });
  ['F', 'Cl', 'Br', 'I'].forEach((s, i) => { const o = famTile(Bg, s, HAL, C.bg0); tr(o.g, 560, ROW[i]); });
  const w7 = wedge(Bg, 640, 222, 622, 34, 6, HAL);
  T(Bg, 676, 404, 'reactivity', { size: 28, weight: 600 });
  T(Bg, 676, 446, 'falls', { size: 38, weight: 700, fill: HAL });
  // melting points change smoothly
  const graph = G(Bg);
  const GXa = 892, GYb = 590, GTop = 250, xs = k => 920 + k * 68, ys = T_ => GYb - 22 - (T_ + 230) * 0.72;
  arrow(graph, GXa, GYb, GXa, GTop - 14, { color: C.muted, width: 3.5, head: 12 });
  arrow(graph, GXa, GYb, 1150, GYb, { color: C.muted, width: 3.5, head: 12 });
  T(graph, GXa + 14, GTop - 4, 'melting point', { size: 26, weight: 600, fill: C.muted });
  T(graph, 1150, GYb + 36, 'down the group', { size: 24, weight: 600, fill: C.muted, anchor: 'end' });
  const MP1 = [181, 98, 63].map((v, k) => [xs(k), ys(v)]), MP7 = [-220, -101, -7, 114].map((v, k) => [xs(k), ys(v)]);
  const c1 = E('path', { d: openPath(MP1), fill: 'none', stroke: ALK, 'stroke-width': 6, 'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': '1 1' }, graph);
  const c7 = E('path', { d: openPath(MP7), fill: 'none', stroke: HAL, 'stroke-width': 6, 'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': '1 1' }, graph);
  const dots1 = MP1.map(([x, y]) => E('circle', { cx: x, cy: y, r: 7, fill: ALK }, graph));
  const dots7 = MP7.map(([x, y]) => E('circle', { cx: x, cy: y, r: 7, fill: HAL }, graph));

  /* ================= C. across a period ================= */
  const Cg = G(root);
  T(Cg, 600, 178, 'Across Period 3', { size: 36, weight: 700, anchor: 'middle' });
  const outLab = T(Cg, 600, 252, 'outer electrons', { size: 28, weight: 600, anchor: 'middle', fill: C.energy });
  const acr = [11, 12, 13, 14, 15, 16, 17, 18].map((z, i) => {
    const el = ptElement(z), x = 166 + i * 124, o = famTile(Cg, el.sym, C.card2, C.ink);
    tr(o.g, x, 420);
    const b = G(Cg); tr(b, x, 306);
    E('circle', { r: 26, fill: C.energy }, b);
    T(b, 0, 11, String(i + 1), { size: 30, weight: 700, anchor: 'middle', fill: C.bg0 });
    return Object.assign(o, { x, kc: PT_KIND_COL[el.kind], b });
  });
  const sweep = E('ellipse', { cx: 0, cy: 420, rx: 70, ry: 110, fill: glow(C.energy) }, Cg);
  const kindBar = G(Cg);
  E('rect', { x: 120, y: 541, width: 930, height: 12, rx: 6, fill: linGrad(PT_KIND_COL.metal, C.chloro) }, kindBar);
  E('path', { d: 'M1046,527 L1082,547 L1046,567 Z', fill: C.chloro }, kindBar);
  T(kindBar, 120, 598, 'metals', { size: 32, weight: 700, fill: PT_KIND_COL.metal });
  T(kindBar, 1082, 598, 'non-metals', { size: 32, weight: 700, fill: C.chloro, anchor: 'end' });
  const between = T(Cg, acr[3].x, 504, 'in between', { size: 24, weight: 700, anchor: 'middle', fill: PT_KIND_COL.metalloid });

  /* ================= D. rubidium in water ================= */
  const Dg = G(root);
  const trough = beaker(Dg, 420, 210, { level: 0.58, liquid: '#5BD27A', marks: false }); tr(trough, 800, 500);
  const SURF = 500 + 105 - (210 - 18) * 0.58;    // water surface (y)
  const rx = G(Dg);
  const fl = E('ellipse', { cx: 0, cy: -40, rx: 120, ry: 150, fill: glow('#E05CC0') }, rx);
  const flash = E('circle', { r: 170, fill: glow('#FFFFFF', '#FFFFFF') }, rx);
  let sd = ''; for (let i = 0; i < 18; i++) { const a = i / 18 * TAU, r = i % 2 ? 46 : 150; sd += (i ? 'L' : 'M') + (Math.cos(a) * r).toFixed(1) + ',' + (Math.sin(a) * r * 0.8).toFixed(1); }
  const star = E('path', { d: sd + 'Z', fill: '#FFF3FB', stroke: '#E05CC0', 'stroke-width': 3, 'stroke-linejoin': 'round' }, rx);
  const drops = [], dr = rng(33);
  for (let i = 0; i < 20; i++) drops.push({ el: E('circle', { r: 6 + dr() * 7, fill: i % 3 ? '#9FE8B4' : '#F2B8FF', opacity: 0.9 }, rx), vx: (dr() - 0.5) * 640, vy: -(300 + dr() * 300), ph: dr() });
  const rbBub = bubbles(Dg, 640, SURF + 10, 320, 80, { n: 12, r: 7, seed: 5, speed: 1.1 });
  const rbBit = E('rect', { x: -15, y: -11, width: 30, height: 20, rx: 7, fill: ball('#E4EAEE', '#8D9AA5'), stroke: '#6E7B86', 'stroke-width': 1.5 }, Dg);
  const think = G(Dg); tr(think, 800, 300);
  E('path', { d: 'M-64,-48 Q-64,-80 -30,-80 L30,-80 Q64,-80 64,-48 L64,0 Q64,30 30,30 L4,30 L-14,58 L-14,30 L-30,30 Q-64,30 -64,0 Z', fill: C.card2, stroke: C.line, 'stroke-width': 3 }, think);
  T(think, 0, 6, '?', { size: 70, weight: 700, anchor: 'middle', fill: C.energy });
  const predChip = chip(Dg, 'predicted: even more violent!', { size: 30, fill: 'rgba(10,27,39,0.9)', stroke: C.energy, color: C.energy, sw: 3 });
  tr(predChip, 800, 214);
  const waterLab = T(Dg, 800, 662, 'water + universal indicator', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });

  /* ================= E-K. Mendeleev's desk ================= */
  const deskG = G(root);
  E('rect', { x: 44, y: 110, width: 1112, height: 614, rx: 30, fill: linGrad('#402E21', '#21160E', true), stroke: '#5C4330', 'stroke-width': 3 }, deskG);
  const gr = rng(8);
  for (let k = 0; k < 9; k++) {
    const y0 = 150 + k * 66 + gr() * 18, pts = [];
    for (let i = 0; i <= 12; i++) pts.push([86 + i * 85.6, y0 + Math.sin(i * 0.7 + k) * 7 + (gr() - 0.5) * 4]);
    E('path', { d: openPath(pts), fill: 'none', stroke: '#583F2D', 'stroke-width': (2.5 + gr() * 2).toFixed(1), opacity: 0.55, 'stroke-linecap': 'round' }, deskG);
  }
  E('ellipse', { cx: 600, cy: 400, rx: 560, ry: 330, fill: glow('#FFD79A'), opacity: 0.14 }, deskG);

  const CW = 74, CHh = 86, colX = c => 110 + c * 82, rowY = r => 200 + r * 98;
  const bandsG = G(deskG), bands = [];
  for (let c = 0; c < 7; c++) bands.push(E('rect', { x: colX(c) - 40, y: rowY(0) - 50, width: 80, height: rowY(3) - rowY(0) + 100, rx: 14, fill: C.energy }, bandsG));
  const slotsG = G(deskG);
  const gapSlot = (c, r) => {
    const g = G(slotsG); tr(g, colX(c), rowY(r));
    const halo = E('ellipse', { rx: 70, ry: 78, fill: glow(C.energy) }, g);
    E('rect', { x: -CW / 2, y: -CHh / 2, width: CW, height: CHh, rx: 8, fill: 'rgba(243,233,210,0.07)', stroke: PAPER, 'stroke-width': 3, 'stroke-dasharray': '8 6' }, g);
    const q = T(g, 0, 17, '?', { size: 48, weight: 700, fill: PAPER, anchor: 'middle' });
    return { g, halo, q };
  };
  const gapGa = gapSlot(2, 3), gapGe = gapSlot(3, 3);
  const cardsG = G(deskG);
  function elCard(sym, mass) {
    const g = G(cardsG);
    E('rect', { x: -CW / 2 + 4, y: -CHh / 2 + 6, width: CW, height: CHh, rx: 8, fill: '#000', opacity: 0.3 }, g);
    const box = E('rect', { x: -CW / 2, y: -CHh / 2, width: CW, height: CHh, rx: 8, fill: PAPER, stroke: EDGE, 'stroke-width': 2.5 }, g);
    T(g, 0, -17, String(mass), { size: 24, weight: 600, fill: PENCIL, anchor: 'middle', font: FB });
    T(g, 0, 30, sym, { size: 36, weight: 700, fill: INK, anchor: 'middle' });
    return { g, box };
  }
  const LAYOUT = [['H', 0, 0], ['Li', 0, 1], ['Be', 1, 1], ['B', 2, 1], ['C', 3, 1], ['N', 4, 1], ['O', 5, 1], ['F', 6, 1],
    ['Na', 0, 2], ['Mg', 1, 2], ['Al', 2, 2], ['Si', 3, 2], ['P', 4, 2], ['S', 5, 2], ['Cl', 6, 2], ['K', 0, 3], ['Ca', 1, 3], ['As', 4, 3], ['Se', 5, 3], ['Br', 6, 3]];
  const sr = rng(23), spots = [];
  for (let r = 0; r < 3; r++) for (let c = 0; c < 7; c++) spots.push([118 + c * 92 + (sr() - 0.5) * 30, 250 + r * 160 + (sr() - 0.5) * 40]);
  for (let i = spots.length - 1; i > 0; i--) { const j = Math.floor(sr() * (i + 1)); const tmp = spots[i]; spots[i] = spots[j]; spots[j] = tmp; }
  const cards = [];
  for (let i = LAYOUT.length - 1; i >= 0; i--) {
    const [sym, c, r] = LAYOUT[i], z = PT_SYM.indexOf(sym) + 1;
    const o = elCard(sym, ptElement(z).mass);
    cards[i] = Object.assign(o, { i, sym, c, r, x0: spots[i][0], y0: spots[i][1], r0: (sr() - 0.5) * 50, forced: sym === 'As' ? 2 : sym === 'Se' ? 3 : sym === 'Br' ? 4 : -1 });
  }
  const pushed = cards.filter(cd => cd.forced >= 0);
  const gaCard = elCard('Ga', ptElement(31).mass), geCard = elCard('Ge', ptElement(32).mass);

  // portrait card
  const portG = G(deskG); tr(portG, 930, 410);
  E('rect', { x: -150, y: -210, width: 300, height: 420, rx: 20, fill: '#2B2118', stroke: '#C9A877', 'stroke-width': 3 }, portG);
  const pClip = 'mdPort' + Math.random().toString(36).slice(2, 7);
  E('ellipse', { cx: 0, cy: -60, rx: 108, ry: 128 }, E('clipPath', { id: pClip }, defs()));
  E('ellipse', { cx: 0, cy: -60, rx: 108, ry: 128, fill: linGrad('#E3C995', '#A98858', true) }, portG);
  const sil = G(portG, { 'clip-path': `url(#${pClip})` });
  E('path', { d: 'M-124,80 Q-114,2 -52,-18 L52,-18 Q114,2 124,80 Z', fill: '#2B241F' }, sil);                     // dark coat
  E('path', { d: 'M-66,-84 C-92,-156 -40,-192 0,-188 C40,-192 92,-156 66,-84 C80,-54 74,-22 58,-4 L-58,-4 C-74,-22 -80,-54 -66,-84 Z', fill: '#8A7764' }, sil);   // long, wild hair
  E('path', { d: 'M-54,-120 C-62,-90 -64,-50 -56,-20 M54,-120 C62,-90 64,-50 56,-20 M-30,-176 C-44,-160 -52,-140 -54,-120 M30,-176 C44,-160 52,-140 54,-120', fill: 'none', stroke: '#6E5E4E', 'stroke-width': 4, 'stroke-linecap': 'round' }, sil);
  E('ellipse', { cx: 0, cy: -100, rx: 33, ry: 41, fill: '#E2B48C', stroke: '#B98A62', 'stroke-width': 2 }, sil);    // face
  E('path', { d: 'M-24,-114 Q-15,-120 -6,-114 M6,-114 Q15,-120 24,-114', fill: 'none', stroke: '#5E4C3A', 'stroke-width': 4.5, 'stroke-linecap': 'round' }, sil);
  E('circle', { cx: -14, cy: -104, r: 3.6, fill: '#2B1D14' }, sil); E('circle', { cx: 14, cy: -104, r: 3.6, fill: '#2B1D14' }, sil);
  E('path', { d: 'M0,-102 Q-6,-90 1,-86', fill: 'none', stroke: '#B98A62', 'stroke-width': 3, 'stroke-linecap': 'round' }, sil);
  E('path', { d: 'M-33,-96 C-42,-62 -40,-22 -24,10 C-15,30 -7,46 0,62 C7,46 15,30 24,10 C40,-22 42,-62 33,-96 C26,-80 14,-76 0,-76 C-14,-76 -26,-80 -33,-96 Z', fill: '#9C8973' }, sil);   // long beard
  E('path', { d: 'M-20,-80 Q0,-72 20,-80 M-14,-50 C-18,-20 -12,10 -6,36 M0,-60 C-2,-28 2,6 0,44 M14,-50 C18,-20 12,10 6,36', fill: 'none', stroke: '#7A6852', 'stroke-width': 3.5, 'stroke-linecap': 'round' }, sil);
  E('ellipse', { cx: 0, cy: -60, rx: 108, ry: 128, fill: 'none', stroke: '#E8D3A8', 'stroke-width': 6 }, portG);
  T(portG, 0, 112, 'Dmitri Mendeleev', { size: 30, weight: 700, anchor: 'middle', fill: PAPER });
  T(portG, 0, 146, 'Russian chemist', { size: 26, weight: 600, anchor: 'middle', fill: '#C9B48C' });
  const yr = chip(portG, '1869', { size: 30, fill: C.energy, color: C.bg0 }); tr(yr, 0, 182);

  // prediction table for the gap below silicon
  const tabG = G(root);
  const TX0 = 668, TY0 = 150, TW = 472, THh = 340;
  card(tabG, TX0, TY0, TW, THh, { fill: 'rgba(20,54,70,0.96)', stroke: C.energy, sw: 2.5 });
  const tabIn = G(tabG);                          // contents dim; the panel stays solid
  const headIcon = G(tabIn); tr(headIcon, TX0 + 44, TY0 + 46);
  E('rect', { x: -22, y: -26, width: 44, height: 52, rx: 6, fill: 'rgba(243,233,210,0.1)', stroke: PAPER, 'stroke-width': 2.5, 'stroke-dasharray': '5 4' }, headIcon);
  const hiQ = T(headIcon, 0, 12, '?', { size: 32, weight: 700, anchor: 'middle', fill: PAPER });
  const hiGe = T(headIcon, 0, 10, 'Ge', { size: 24, weight: 700, anchor: 'middle', fill: C.good });
  T(tabIn, TX0 + 80, TY0 + 56, 'the gap below **silicon**', { size: 30, weight: 600, boldFill: C.energy });
  const colP = TX0 + 228, colF = TX0 + 376;
  T(tabIn, colP, TY0 + 102, 'predicted', { size: 26, weight: 700, anchor: 'middle', fill: C.muted });
  const fHead = T(tabIn, colF, TY0 + 102, 'found, 1886', { size: 26, weight: 700, anchor: 'middle', fill: C.good });
  const ROWS = [['mass', '≈ 72', '72.6'], ['density', '5.5', '5.35'], ['colour', 'grey metal', 'grey'], ['oxide', 'XO₂', 'GeO₂']];
  const tRows = ROWS.map(([lab, pv, fv], k) => {
    const y = TY0 + 150 + k * 44;
    const l = T(tabIn, TX0 + 24, y, lab, { size: 26, weight: 600, fill: C.muted });
    const p = T(tabIn, colP, y, '', { size: 28, weight: 700, anchor: 'middle', fill: '#D3E7F2' });
    const f = T(tabIn, colF, y, fv, { size: 28, weight: 700, anchor: 'middle', fill: C.good });
    return { l, p, f, pv, y };
  });
  const unitNote = T(tabIn, TX0 + 24, TY0 + THh - 18, 'density in g/cm³', { size: 24, weight: 500, fill: C.muted, font: FB });
  const tickG = G(root);                            // the table's ticks live here so they can fly to the stamp
  const tTicks = tRows.map(r => tick(tickG, 12));

  // gallium: measured again
  const gaG = G(root);
  card(gaG, 64, 574, 580, 140, { fill: 'rgba(20,54,70,0.96)', stroke: C.line, sw: 2 });
  const gaIn = G(gaG);
  T(gaIn, 86, 608, 'gallium, found **1875**: density', { size: 28, weight: 600, boldFill: C.energy });
  const ga1 = T(gaIn, 120, 684, '4.7', { size: 38, weight: 700, anchor: 'middle', fill: '#FF9AA4' });
  const gaX = cross(gaIn, 12); tr(gaX, 176, 671);
  const gaArrow = arrow(gaIn, 214, 678, 330, 678, { color: C.energy, width: 5, bend: -24 });
  const gaAgain = T(gaIn, 272, 646, 'measure again', { size: 24, weight: 700, anchor: 'middle', fill: C.energy });
  const ga2 = T(gaIn, 380, 684, '5.9', { size: 38, weight: 700, anchor: 'middle', fill: C.good });
  const gaTick = tick(root, 12);
  const gaNote = T(gaIn, 468, 684, 'as predicted', { size: 24, weight: 600, fill: C.muted, font: FB });
  const GA_TICK = [438, 671];

  // evidence stamp and the pattern
  const STAMP = [904, 590];
  const stampG = G(root); tr(stampG, STAMP[0], STAMP[1]);
  const stampIn = G(stampG);
  E('rect', { x: -164, y: -46, width: 328, height: 92, rx: 16, fill: 'rgba(86,214,155,0.12)', stroke: C.good, 'stroke-width': 6 }, stampIn);
  T(stampIn, 0, 17, 'EVIDENCE', { size: 50, weight: 700, anchor: 'middle', fill: C.good, ls: 4 });
  const patLab = T(root, 356, 632, 'a real pattern in nature', { size: 32, weight: 700, anchor: 'middle', fill: C.energy });

  /* ================= L. today: proton number ================= */
  const Lg = G(root);
  T(Lg, 600, 186, 'Today: in order of **proton number**', { size: 40, weight: 600, anchor: 'middle', boldFill: C.energy });
  const teG = G(Lg), ioG = G(Lg);
  const teT = ptTile(teG, 52, { size: 230 }), ioT = ptTile(ioG, 53, { size: 230 });
  const LX = [450, 750];
  T(Lg, LX[0], 590, 'Group 6', { size: 28, weight: 700, anchor: 'middle', fill: C.muted });
  T(Lg, LX[1], 590, 'Group 7', { size: 28, weight: 700, anchor: 'middle', fill: HAL });
  const massLab = T(Lg, 600, 654, 'by mass, iodine (127) would come first', { size: 28, weight: 600, anchor: 'middle', fill: '#FF9AA4' });
  const protLab = T(Lg, 600, 654, 'by proton number: 52 then 53', { size: 30, weight: 700, anchor: 'middle', fill: C.good });
  const lTick = tick(Lg, 16);
  const ioRing = E('rect', { x: -121, y: -121, width: 242, height: 242, rx: 26, fill: 'none', stroke: C.bad, 'stroke-width': 6 }, ioG);

  /* ================= update ================= */
  return t => {
    /* ---------- A: power ---------- */
    const aA = beat(t, S.first - 0.6, at('down') + 0.2);
    op(A, aA);
    if (aA > 0) {
      const hi1 = P(t, mid('power', 0.6), 0.6, linear);
      grid.set({ kind: 1, dim: 0.65 * hi1, hi: [{ group: 1, p: hi1 }, { period: 5, p: 0.75 * P(t, mid('power', 0.68), 0.6, linear), color: C.energy }] });
      const u = P(t, at('power') + 0.1, mid('power', 0.45) - at('power') - 0.1);
      const [mx, my] = cubic(MAGP[0], MAGP[1], MAGP[2], MAGP[3], u);
      tr(mag, mx + (u >= 1 ? Math.sin(t * 1.7) * 3 * calm : 0), my + (u >= 1 ? Math.cos(t * 1.3) * 3 * calm : 0), 1 - 0.12 * u);
      op(mag, P(t, at('power'), 0.4, linear));
      const qp = P(t, mid('power', 0.45), 0.5, pop);
      tr(qCover, rbx, rby, 1 + 0.12 * Math.sin(Math.PI * clamp(qp)) + 0.04 * wave(t, 1.2) * calm);
      const pc = P(t, mid('power', 0.2), 0.55, pop);
      op(pChip, clamp(pc * 2)); tr(pChip, GX + 420, GY + 62, 0.8 + 0.2 * pc);
      op(pSub, P(t, mid('power', 0.62), 0.5, linear));
    }

    /* ---------- B: down a group (Group 1 stays for "rubidium") ---------- */
    const a1 = Math.max(beat(t, at('down') - 0.1, at('across') - 0.05), beat(t, at('rubidium') - 0.1, at('mendeleev') - 0.1));
    op(g1, a1);
    if (a1 > 0) {
      growDown(w1, 250, 222, P(t, mid('down', 0.1), 1.1, easeOut));
      const f = P(t, mid('rubidium', 0.18), 0.6, linear);
      const sx = Math.abs(Math.cos(Math.PI * f));
      rbG.setAttribute('transform', `translate(170 ${ROW[3]}) scale(${Math.max(0.02, sx).toFixed(3)} 1)`);
      op(rbQ, f < 0.5 ? 1 : 0); op(rbFace.g, f >= 0.5 ? 1 : 0);
    }
    const aB = beat(t, at('down') - 0.1, at('across') - 0.05);
    op(Bg, aB);
    if (aB > 0) {
      growDown(w7, 640, 222, P(t, mid('down', 0.42), 1.1, easeOut));
      const gp = P(t, mid('down', 0.66), 0.4, linear);
      op(graph, gp);
      c1.setAttribute('stroke-dashoffset', (1 - P(t, mid('down', 0.68), 1.2, ease)).toFixed(4));
      c7.setAttribute('stroke-dashoffset', (1 - P(t, mid('down', 0.72), 1.3, ease)).toFixed(4));
      dots1.forEach((d, k) => op(d, P(t, mid('down', 0.68) + k * 0.4, 0.3, linear)));
      dots7.forEach((d, k) => op(d, P(t, mid('down', 0.72) + k * 0.32, 0.3, linear)));
    }

    /* ---------- C: across a period ---------- */
    const aC = beat(t, at('across') - 0.1, at('rubidium') - 0.05);
    op(Cg, aC);
    if (aC > 0) {
      const s0 = mid('across', 0.08), s1 = mid('across', 0.56);
      const sx = lerp(100, 1100, P(t, s0, s1 - s0, linear));
      attr(sweep, 'cx', sx);
      op(sweep, win(t, s0, s1 + 0.2, 0.3) * 0.8);
      acr.forEach((o, i) => {
        const p = P(t, at('across') + i * 0.05, 0.45, pop);
        op(o.g, clamp(p * 2)); tr(o.g, o.x, 420 + (1 - clamp(p)) * 18);
        const k = P(t, s0 + (o.x - 100) / 1000 * (s1 - s0) - 0.1, 0.5, linear);
        const fill = _ptMix(C.card2, o.kc, k);
        o.box.setAttribute('fill', fill); o.tx.setAttribute('fill', _ptLum(fill) > 0.5 ? C.bg0 : C.ink);
        const bp = P(t, mid('across', 0.62) + i * 0.1, 0.4, pop);
        op(o.b, clamp(bp * 2)); tr(o.b, o.x, 306, Math.max(0.01, bp));
      });
      op(outLab, P(t, mid('across', 0.6), 0.4, linear));
      op(kindBar, P(t, mid('across', 0.18), 0.6, linear));
      op(between, P(t, mid('across', 0.45), 0.5, linear));
    }

    /* ---------- D: rubidium in water ---------- */
    const aD = beat(t, at('rubidium') - 0.1, at('mendeleev') - 0.1);
    op(Dg, aD);
    if (aD > 0) {
      const tp = P(t, mid('rubidium', 0.3), 0.5, pop);
      op(trough, clamp(tp * 2)); op(waterLab, clamp(tp * 2));
      op(think, win(t, mid('rubidium', 0.46), mid('rubidium', 0.66), 0.3));
      const drop = mid('rubidium', 0.64), u = clamp((t - drop) / 0.45), hit = drop + 0.45;
      const zx = 800 + (t > hit ? Math.sin((t - hit) * 4.2) * 120 * calm : 0);
      tr(rbBit, zx, lerp(SURF - 220, SURF - 6, easeIn(u)));
      op(rbBit, P(t, drop - 0.1, 0.15, linear));
      trough.set(0.58, _ptMix('#5BD27A', '#8E5BD0', P(t, hit + 0.3, 1.4, linear)));
      tr(rx, zx, SURF - 10);
      op(rx, t > hit ? 1 : 0);
      if (t > hit) {
        const fP = P(t, hit, 0.35, linear);
        op(flash, (1 - fP) * 0.95); attr(flash, 'r', 120 + 220 * fP);
        const sp = Math.sin(Math.PI * clamp((t - hit) / 0.5));
        op(star, Math.max(sp, 0.55 + 0.35 * wave(t, 0.23))); tr(star, 0, -30, 0.6 + 0.5 * sp + 0.15 * wave(t, 0.17), (t * 90) % 360);
        op(fl, 0.95); tr(fl, 0, 0, 1.25 + 0.2 * wave(t, 0.31) * calm);
        drops.forEach(d => {
          const q = ((t - hit) / 0.9 + d.ph) % 1, k = t - hit < 0.9 ? 1 : 0.65;
          attr(d.el, 'cx', d.vx * q * 0.6); attr(d.el, 'cy', d.vy * q * 1.1 + 500 * q * q);
          op(d.el, k * Math.sin(Math.PI * q));
        });
      }
      rbBub.upd(t, t > hit ? 1 : 0);
      const pc = P(t, mid('rubidium', 0.8), 0.5, pop);
      op(predChip, clamp(pc * 2)); tr(predChip, 800, 214, 0.8 + 0.2 * pc);
    }

    /* ---------- E-K: the desk ---------- */
    const aDesk = beat(t, at('mendeleev') - 0.2, at('today') - 0.1);
    op(deskG, aDesk);
    if (aDesk > 0) {
      const pp = P(t, at('mendeleev') + 0.1, 0.7, pop);
      op(portG, clamp(pp * 2) * (1 - P(t, at('predicted') - 0.35, 0.45, linear)));
      tr(portG, 930 + (1 - clamp(pp)) * 40, 410, 0.9 + 0.1 * clamp(pp));
      const yp = P(t, mid('mendeleev', 0.78), 0.5, pop);
      op(yr, clamp(yp * 2)); tr(yr, 0, 182, Math.max(0.01, yp));
      // cards: scattered -> in order of mass -> (gaps) arsenic, selenium, bromine pushed along
      cards.forEach(cd => {
        const t0 = mid('arranged', 0.03) + cd.i * 0.1, u = P(t, t0, 0.6, ease), lift = Math.sin(Math.PI * clamp((t - t0) / 0.6));
        let col = cd.c;
        if (cd.forced >= 0) col = lerp(cd.forced, cd.c, P(t, mid('gaps', 0.3) + (6 - cd.c) * 0.12, 0.75, ease));   // bromine moves first
        const x1 = colX(col), y1 = rowY(cd.r);
        tr(cd.g, lerp(cd.x0, x1, u), lerp(cd.y0, y1, u) - 20 * lift, 1 + 0.08 * lift, cd.r0 * (1 - u));
        if (cd.forced >= 0) {
          const bad = win(t, mid('gaps', 0.04), mid('gaps', 0.36), 0.25), good = win(t, mid('gaps', 0.5), mid('gaps', 0.8), 0.25);
          cd.box.setAttribute('stroke', bad > 0.01 ? _ptMix(EDGE, C.bad, bad) : _ptMix(EDGE, C.good, good));
          cd.box.setAttribute('stroke-width', (2.5 + 3 * Math.max(bad, good)).toFixed(2));
        }
      });
      bands.forEach((b, c) => {
        const s = win(t, mid('arranged', 0.62) + c * 0.07, mid('arranged', 0.62) + c * 0.07 + 0.9, 0.3) * 0.22;
        const e = P(t, mid('evidence', 0.52) + c * 0.07, 0.5, linear) * (0.14 + 0.08 * wave(t, 2.2, c * 0.1) * calm);
        op(b, Math.max(s, e));
      });
      // the two gaps, then gallium and germanium drop into them
      const gOn = P(t, mid('gaps', 0.55), 0.5, linear);
      op(slotsG, gOn);
      const gaLand = mid('gallium', 0.04) + 0.5, geLand = mid('germanium', 0.08) + 0.5;
      [[gapGa, gaLand, 0], [gapGe, geLand, 0.35]].forEach(([gp, land, ph]) => {
        const w = wave(t, 1.3, ph) * calm, focus = gp === gapGe ? 1 + 0.8 * win(t, at('predicted'), at('gallium'), 0.4) : 1 + 0.8 * win(t, at('gallium'), gaLand + 0.6, 0.4);
        op(gp.halo, (0.25 + 0.3 * w) * focus * (1 - P(t, land, 0.3, linear)));
        op(gp.q, 1 - P(t, land - 0.15, 0.2, linear));
        tr(gp.q, 0, 0, 1 + 0.07 * w);
      });
      [[gaCard, mid('gallium', 0.04), 2], [geCard, mid('germanium', 0.08), 3]].forEach(([cd, t0, c]) => {
        const u = clamp((t - t0) / 0.5), sq = 0.12 * Math.sin(Math.PI * P(t, t0 + 0.5, 0.3, linear));
        cd.g.setAttribute('transform', `translate(${colX(c)} ${(rowY(3) - 600 * (1 - easeIn(u))).toFixed(1)}) scale(${(1 + sq).toFixed(3)} ${(1 - sq).toFixed(3)})`);
        op(cd.g, t >= t0 ? 1 : 0);
        cd.box.setAttribute('stroke', _ptMix(EDGE, C.good, win(t, t0 + 0.5, t0 + 2.2, 0.3)));
        cd.box.setAttribute('stroke-width', (2.5 + 3 * win(t, t0 + 0.5, t0 + 2.2, 0.3)).toFixed(2));
      });
    }

    /* ---------- the prediction table ---------- */
    const aT = beat(t, at('predicted') - 0.15, at('today') - 0.1);
    const dimT = 1 - 0.55 * win(t, at('gallium'), at('germanium') - 0.1, 0.4);
    op(tabG, aT); op(tabIn, dimT * (1 - 0.5 * P(t, mid('evidence', 0.3), 0.5, linear)));
    if (aT > 0) {
      tRows.forEach((r, k) => {
        const w0 = mid('predicted', [0.34, 0.47, 0.6, 0.76][k]);
        op(r.l, P(t, w0 - 0.2, 0.3, linear));
        setText(r.p, r.pv.slice(0, Math.round(r.pv.length * P(t, w0, 0.6, linear))));
        const fT = mid('germanium', [0.3, 0.42, 0.54, 0.66][k]), fu = P(t, fT, 0.45, easeOut);
        op(r.f, fu); r.f.setAttribute('transform', `translate(${((1 - fu) * 50).toFixed(1)} 0)`);
      });
      op(unitNote, P(t, mid('predicted', 0.5), 0.4, linear));
      const geIn = P(t, mid('germanium', 0.08) + 0.5, 0.4, linear);
      op(hiQ, 1 - geIn); op(hiGe, geIn);
      op(fHead, P(t, mid('germanium', 0.16), 0.4, linear));
    }
    // ticks: pop beside each found value, then fly to the stamp
    const fly0 = mid('evidence', 0.05), sp_ = P(t, mid('evidence', 0.3), 0.45, pop);
    tTicks.forEach((tk, k) => {
      const r = tRows[k], tp = P(t, mid('germanium', [0.3, 0.42, 0.54, 0.66][k]) + 0.32, 0.4, pop);
      const fu = P(t, fly0 + k * 0.08, 0.6, ease);
      const x = lerp(TX0 + TW - 30, STAMP[0], fu), y = lerp(r.y - 10, STAMP[1], fu) - 90 * Math.sin(Math.PI * fu);
      op(tk, clamp(tp * 2) * (1 - P(t, fly0 + k * 0.08 + 0.5, 0.12, linear)));
      tr(tk, x, y, Math.max(0.01, tp) * (1 - 0.5 * fu));
    });

    /* ---------- gallium box ---------- */
    const aG = beat(t, mid('gallium', 0.1), at('evidence') + 0.4);
    op(gaG, aG); op(gaIn, 1 - 0.55 * win(t, at('germanium'), at('evidence'), 0.4));
    if (aG > 0) {
      op(ga1, P(t, mid('gallium', 0.27), 0.35, linear));
      const xp = P(t, mid('gallium', 0.35), 0.4, pop); op(gaX, clamp(xp * 2)); tr(gaX, 176, 671, Math.max(0.01, xp));
      gaArrow.set(P(t, mid('gallium', 0.52), 0.6)); op(gaArrow, P(t, mid('gallium', 0.52), 0.1, linear));
      op(gaAgain, P(t, mid('gallium', 0.54), 0.4, linear));
      op(ga2, P(t, mid('gallium', 0.7), 0.4, linear));
      op(gaNote, P(t, mid('gallium', 0.86), 0.4, linear));
    }
    {
      const tp = P(t, mid('gallium', 0.8), 0.4, pop), fu = P(t, fly0 + 0.32, 0.6, ease);
      const x = lerp(GA_TICK[0], STAMP[0], fu), y = lerp(GA_TICK[1], STAMP[1], fu) - 120 * Math.sin(Math.PI * fu);
      op(gaTick, clamp(tp * 2) * (1 - P(t, fly0 + 0.82, 0.12, linear)) * (1 - 0.55 * win(t, at('germanium'), fly0, 0.4)));
      tr(gaTick, x, y, Math.max(0.01, tp) * (1 - 0.5 * fu));
    }

    /* ---------- evidence ---------- */
    const aS = P(t, mid('evidence', 0.28), 0.12, linear) * (1 - P(t, at('today') - 0.2, 0.4, linear));
    op(stampG, aS);
    if (aS > 0) { const s = 1 + 0.6 * (1 - P(t, mid('evidence', 0.28), 0.4, easeIn)); tr(stampIn, 0, 0, s * (0.98 + 0.02 * wave(t, 1.6) * calm), -7); }
    op(patLab, P(t, mid('evidence', 0.62), 0.5, linear) * (1 - P(t, at('today') - 0.2, 0.4, linear)));

    /* ---------- L: today ---------- */
    const aL = P(t, at('today') - 0.05, 0.5, linear);
    op(Lg, aL);
    if (aL > 0) {
      const sw = P(t, mid('today', 0.36), 1.0, ease), arc = Math.sin(Math.PI * sw);
      const tePop = P(t, at('today') + 0.1, 0.5, pop), ioPop = P(t, at('today') + 0.25, 0.5, pop);
      tr(ioG, lerp(LX[0], LX[1], sw), 400 - 60 * arc, (0.85 + 0.15 * ioPop) * (1 - 0.12 * arc)); op(ioG, clamp(ioPop * 2));
      tr(teG, lerp(LX[1], LX[0], sw), 400 + 60 * arc, (0.85 + 0.15 * tePop) * (1 - 0.12 * arc)); op(teG, clamp(tePop * 2));
      const hm = win(t, at('today') + 0.3, mid('today', 0.36), 0.35), hn = P(t, mid('today', 0.3), 0.4, linear);
      teT.set({ hlMass: hm, hlNum: hn }); ioT.set({ hlMass: hm, hlNum: hn });
      op(ioRing, win(t, at('today') + 0.5, mid('today', 0.36) + 0.2, 0.3));
      op(massLab, win(t, at('today') + 0.5, mid('today', 0.4), 0.35));
      op(protLab, P(t, mid('today', 0.62), 0.5, linear));
      const tk = P(t, mid('today', 0.66), 0.45, pop);
      op(lTick, clamp(tk * 2)); tr(lTick, 600 + textWidth('by proton number: 52 then 53', 30, FD, 700) / 2 + 34, 644, Math.max(0.01, tk));
    }
  };
});
