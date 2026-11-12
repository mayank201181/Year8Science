/* Scene 5: Ferris and the reaction families.
   A  kitchen wide: ROUND 5 card (spot the family -> predict the products)
   B  Ferris alone in a spotlight, the rust-o-meter creeping up
   C  Ferris close: family card 1 OXIDATION = gaining oxygen; O atoms cling to him; Olly pops up: "You're welcome!"
   D  chalkboard: oxygen alone? no. Oxygen AND water; iron + oxygen + water -> hydrated iron oxide
   E  Arrow and three test tubes: dry air / boiled water under oil -> no rust; air + water -> rust
   F  Ferris confessional: a bridge being painted; dreaming of a coat of paint
   G  family card 2 REDUCTION: carbon takes the oxygen from iron oxide (Ferris watching, hopeful, then sweating)
   H  family card 3 THERMAL DECOMPOSITION: green copper carbonate -> black copper oxide; CO2 turns limewater milky
   I  family card 4 NEUTRALISATION on the board, A B S W; Arrow sprinkles salt. Finally.
   J  family card 5 DISPLACEMENT: Fe shoves Cu out of copper sulfate
   K  Ferris takes a bath in copper sulfate (reactivity ladder), rises coated in copper: WINNING. Confetti.
   L  Arrow's confessional: "It's unsettling." Ferris dancing in the inset. */
scene('ferris', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;

  /* ---------- helpers ---------- */
  const on = (t, a, b) => (t >= a && t < b ? 1 : 0);
  const cam = (k, fx, fy, sx, sy) => `translate(${(sx === undefined ? fx : sx).toFixed(1)} ${(sy === undefined ? fy : sy).toFixed(1)}) scale(${k.toFixed(4)}) translate(${(-fx).toFixed(1)} ${(-fy).toFixed(1)})`;
  const M = []; let seen = new Set();
  const reg = el => { M.push(el); return el; };
  const show = (el, o) => { seen.add(el); op(el, o === undefined ? 1 : o); };
  const popIn = (el, t, t0, x, y, s, r) => { const p = P(t, t0, 0.4, pop); show(el, clamp(p * 2.5)); tr(el, x, y, Math.max(0.01, (s || 1) * (0.6 + 0.4 * p)), r); return p; };
  const fadeAt = (el, t, t0, x, y, s) => { show(el, P(t, t0, 0.3, linear)); if (x !== undefined) tr(el, x, y, s || 1); };
  const lbl = (parent, text, o) => { o = o || {}; return reg(chip(parent, text, { size: o.size || 30, fill: o.fill || 'rgba(10,27,39,0.9)', stroke: o.stroke || C.line, sw: o.sw || 3, color: o.color || C.ink, weight: 700 })); };
  const hex = c => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16));
  const mixCol = (a, b, p) => { const A = hex(a), B = hex(b); return '#' + A.map((v, i) => Math.round(lerp(v, B[i], clamp(p))).toString(16).padStart(2, '0')).join(''); };
  // a row of words laid out left to right, centred on cx; shrinks (to 26 px) to fit maxW. Returns the <text>s.
  function eqRow(parent, cx, y, parts, o) {
    let size = o.size || 40; const gapK = 0.34;
    const wOf = s => parts.reduce((a, p) => a + textWidth(p, s, FD, 800), 0) + s * gapK * (parts.length - 1);
    while (size > 26 && wOf(size) > o.maxW) size -= 1;
    let x = cx - wOf(size) / 2;
    return parts.map((p, i) => {
      const w = textWidth(p, size, FD, 800);
      const el = T(parent, x, y, p, { size, weight: 800, fill: (o.fills && o.fills[i]) || o.fill || C.ink });
      el.cx = x + w / 2; x += w + size * gapK; return el;
    });
  }
  const FAM = [null,
    ['OXIDATION', 'gaining oxygen', '#FF8A3D'],
    ['REDUCTION', 'losing oxygen', '#8AD8FF'],
    ['THERMAL DECOMPOSITION', 'heat breaks one compound into simpler ones', '#FFC247'],
    ['NEUTRALISATION', 'acid + base → salt + water', '#56D69B'],
    ['DISPLACEMENT', 'a more reactive metal pushes a less reactive one out', '#F0A27E']];
  function famCard(parent, n) {
    const [name, def, col] = FAM[n];
    const g = reg(G(parent));
    const w = Math.min(1100, Math.max(textWidth(name, 46, FD, 800), textWidth(def, 30, FD, 700)) + 180), x0 = -w / 2;
    E('rect', { x: x0, y: -68, width: w, height: 136, rx: 22, fill: 'rgba(16,10,32,0.94)', stroke: col, 'stroke-width': 5 }, g);
    const b = G(g); tr(b, x0 + 64, 0);
    E('circle', { r: 40, fill: col, stroke: '#FFFFFF', 'stroke-width': 4 }, b);
    T(b, 0, 17, String(n), { size: 50, weight: 800, anchor: 'middle', fill: '#1A1030' });
    const cx = x0 + 124 + (w - 140) / 2;
    T(g, cx, -10, name, { size: 46, weight: 800, anchor: 'middle', fill: col, ls: 1 });
    g.def = T(g, cx, 42, def, { size: 30, weight: 700, anchor: 'middle', fill: C.ink });
    return g;
  }
  function famShow(card, t, t0, tDef) { popIn(card, t, t0, 600, 190); op(card.def, P(t, tDef, 0.3, linear)); }
  function feAtom(parent, r, eyes) {
    const g = G(parent);
    E('circle', { r, fill: ball('#DCE2E8', '#6E7A86'), stroke: '#4A5560', 'stroke-width': 3 }, g);
    T(g, 0, eyes ? r * 0.66 : r * 0.33, 'Fe', { size: Math.max(26, r * 0.8), weight: 800, anchor: 'middle', fill: '#26313C' });
    if (eyes) [-1, 1].forEach(sd => { E('circle', { cx: sd * r * 0.32, cy: -r * 0.32, r: r * 0.17, fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 2 }, g); E('circle', { cx: sd * r * 0.32 + 2, cy: -r * 0.3, r: r * 0.08, fill: SC_INK }, g); });
    return g;
  }
  function cuAtom(parent, r) {
    const g = G(parent);
    E('circle', { r, fill: ball('#F2A27A', '#A8532E'), stroke: '#7A3A1E', 'stroke-width': 3 }, g);
    T(g, 0, r * 0.33, 'Cu', { size: Math.max(26, r * 0.8), weight: 800, anchor: 'middle', fill: '#FFF1E6' });
    return g;
  }
  function so4(parent) {
    const g = G(parent);
    E('rect', { x: -52, y: -36, width: 104, height: 72, rx: 30, fill: ball('#B79CFF', '#6A4CC4'), stroke: '#4B3394', 'stroke-width': 3 }, g);
    tkFormula(g, 0, 11, 'SO4', { size: 32, fill: '#FFFFFF' });
    return g;
  }
  function drop(parent, s) {
    const g = G(parent);
    E('path', { d: 'M0,-36 C14,-14 24,0 24,14 A24,24 0 0,1 -24,14 C-24,0 -14,-14 0,-36 Z', fill: ball(C.water, C.waterDk), stroke: C.waterDk, 'stroke-width': 3 }, g);
    E('path', { d: 'M-10,6 Q-12,18 -2,24', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 4, 'stroke-linecap': 'round', opacity: 0.7 }, g);
    if (s) tr(g, 0, 0, s);
    return g;
  }
  function flameIcon(parent) {
    const g = G(parent), f = G(g);
    E('path', { d: 'M0,0 C-14,-12 -12,-40 0,-62 C12,-40 14,-12 0,0 Z', fill: '#FF8A3D' }, f);
    E('path', { d: 'M0,-2 C-7,-9 -7,-24 0,-36 C7,-24 7,-9 0,-2 Z', fill: '#FFE07A' }, f);
    g.upd = (t, ph) => attr(f, 'transform', `scale(${(1 + 0.08 * Math.sin(t * 11 + ph) * AMP).toFixed(3)} ${(1 + 0.16 * Math.sin(t * 13 + ph * 2) * AMP).toFixed(3)})`);
    return g;
  }
  function nailMini(parent, rusty) {
    const g = G(parent);
    E('path', { d: 'M-5,4 L5,4 L5,112 L0,128 L-5,112 Z', fill: '#AEB9C4', stroke: SC_INK, 'stroke-width': 2 }, g);
    E('rect', { x: -16, y: -6, width: 32, height: 11, rx: 3, fill: '#C9D3DC', stroke: SC_INK, 'stroke-width': 2 }, g);
    if (rusty) [[0, 34, 8], [1, 64, 9], [-1, 96, 8], [0, 14, 6]].forEach(([x, y, r]) => E('ellipse', { cx: x, cy: y, rx: r, ry: r * 1.3, fill: '#C9692A' }, g));
    return g;
  }
  function confetti(parent, n, seed) {
    const g = G(parent), r = rng(seed), ps = [], cols = ['#FFE45C', '#FF6FB5', '#56D69B', '#5AB4FF', '#FF8A3D', '#F0A27E'];
    for (let i = 0; i < n; i++) ps.push({ el: E('rect', { x: -6, y: -10, width: 12, height: 20, rx: 2, fill: cols[i % 6] }, g), x: 40 + r() * 1120, d: r() * 1.2, v: 200 + r() * 180, sw: r() * TAU, rot: (r() - 0.5) * 600 });
    g.upd = (t, t0) => ps.forEach(p => {
      const u = t - t0 - p.d;
      if (u < 0) { op(p.el, 0); return; }
      op(p.el, 1);
      tr(p.el, p.x + 40 * Math.sin(u * 2.2 + p.sw) * AMP, 90 + ((u * p.v) % 530), 1, (p.rot * u * AMP) % 360);
    });
    return g;
  }

  /* ---------- layers ---------- */
  const world = G(root);
  const Wbg = G(world), Wcast = G(world), Wfront = G(world), Wprops = G(world);
  const Lfg = G(root), Lhud = G(root);

  /* ---------- sets ---------- */
  const kitchen = reg(tkKitchen(Wbg));
  const diagBg = reg(G(Wbg));
  E('rect', { x: -100, y: -100, width: 1400, height: 950, fill: linGrad('#120B26', '#24163F', true) }, diagBg);
  E('ellipse', { cx: 600, cy: 440, rx: 560, ry: 260, fill: glow('#6E4BB8'), opacity: 0.45 }, diagBg);
  const confF = reg(tkConf(Wbg, 'ferris')), confA = reg(tkConf(Wbg, 'arrow'));
  const insetBg = reg(G(Wbg));
  E('circle', { cx: 900, cy: 300, r: 150, fill: linGrad('#3A1745', '#160D2E', true) }, insetBg);
  E('rect', { x: 760, y: 360, width: 280, height: 80, fill: '#2C1F52' }, insetBg);
  const dim = reg(E('rect', { x: -100, y: -100, width: 1400, height: 950, fill: '#05030C' }, Wbg));
  const counter = reg(tkCounter(Wfront));
  const spot = reg(E('path', { d: 'M-50,-560 L50,-560 L200,0 L-200,0 Z', fill: glow('#FFF4C2') }, Wfront));
  const insetRing = reg(G(Wfront));
  E('circle', { cx: 900, cy: 300, r: 150, fill: 'none', stroke: '#FFFFFF', 'stroke-width': 8 }, insetRing);
  const live = chip(insetRing, 'LIVE', { size: 26, fill: C.bad, color: '#FFFFFF' }); tr(live, 900, 168);

  /* ---------- the cast ---------- */
  const ch = {};
  ['kat', 'olly', 'ferris', 'arrow'].forEach(k => { ch[k] = reg(cast(Wcast, k)); });

  /* ===== A: round card ===== */
  const roundCard = reg(G(Lfg));
  E('rect', { x: -400, y: -76, width: 800, height: 152, rx: 24, fill: 'rgba(16,10,32,0.94)', stroke: '#FF6FB5', 'stroke-width': 5 }, roundCard);
  T(roundCard, 0, -12, 'ROUND 5: REACTION FAMILIES', { size: 46, weight: 800, anchor: 'middle', fill: '#FFF1F8', ls: 1 });
  const roundSub = T(roundCard, 0, 44, 'spot the family → predict the products', { size: 32, weight: 700, anchor: 'middle', fill: C.energy });

  /* ===== B: rust-o-meter ===== */
  const rustM = reg(G(Lfg));
  E('rect', { x: -40, y: -150, width: 80, height: 300, rx: 40, fill: '#1A1030', stroke: '#C9692A', 'stroke-width': 5 }, rustM);
  const rustBar = E('rect', { x: -26, y: 0, width: 52, height: 0, rx: 26, fill: linGrad('#E07A30', '#9C4314', true) }, rustM);
  const rustPct = T(rustM, 0, -172, '66%', { size: 40, weight: 800, anchor: 'middle', fill: '#FF9A50' });
  T(rustM, 0, 196, 'RUST', { size: 32, weight: 800, anchor: 'middle', fill: '#FF9A50', ls: 3 });
  const stillChip = lbl(Lfg, 'still turning orange', { size: 30, color: '#FF9A50', stroke: '#C9692A' });

  /* ===== C: oxidation ===== */
  const card1 = famCard(Lfg, 1);
  const rustChip = lbl(Lfg, 'rusting', { size: 40, color: '#FF9A50', stroke: '#C9692A', sw: 4 });
  const oxAtoms = reg(G(Wprops)), oxList = [];
  const OX_AT = [[-50, -58], [52, -18], [-52, 26], [52, 50], [-26, 96], [28, 90]];
  OX_AT.forEach(() => oxList.push(atom(oxAtoms, 'O', 17, { letter: true })));
  const plusO = lbl(Lfg, '+ oxygen', { size: 32, color: '#FFB3A8', stroke: C.oxygen });

  /* ===== D: rusting board ===== */
  const boardD = reg(tkBoard(Lfg, 840, 290, ''));
  tr(boardD, 520, 318);
  T(boardD, 0, -100, 'RUSTING', { size: 40, weight: 800, anchor: 'middle', fill: '#FFF7C2', ls: 4 });
  const dO2 = G(boardD); tr(dO2, -300, -26); molO2(dO2, 24, { letter: true });
  const dO2l = T(boardD, -300, 30, 'oxygen', { size: 30, weight: 700, anchor: 'middle', fill: '#FFB3A8' });
  const dAlone = T(boardD, -40, -14, 'on its own: no rust', { size: 32, weight: 800, anchor: 'start', fill: C.bad });
  const dAnd = T(boardD, -170, -12, 'AND', { size: 42, weight: 800, anchor: 'middle', fill: C.energy });
  const dDrop = drop(boardD, 0.95); tr(dDrop, -40, -26);
  const dDropl = T(boardD, -40, 30, 'water', { size: 30, weight: 700, anchor: 'middle', fill: '#9FE3FF' });
  const dTick1 = tick(boardD, 16); tr(dTick1, -236, -42);
  const dTick2 = tick(boardD, 16); tr(dTick2, 10, -42);
  const dEq = T(boardD, 90, -10, '=', { size: 52, weight: 800, anchor: 'middle', fill: C.ink });
  const dRust = G(boardD); tr(dRust, 230, -24);
  E('path', { d: closedPath(blobPts(56, 34, 9, 0, 0.3, 5)), fill: '#C9692A', stroke: '#7A3A12', 'stroke-width': 3 }, dRust);
  E('path', { d: closedPath(blobPts(26, 16, 7, 0, 0.3, 9).map(([a, b]) => [a - 14, b - 4])), fill: '#E07A30' }, dRust);
  const dRustl = T(boardD, 230, 30, 'rust', { size: 30, weight: 700, anchor: 'middle', fill: '#FF9A50' });
  const dRow = eqRow(boardD, 0, 104, ['iron', '+', 'oxygen', '+', 'water', '→', 'hydrated iron oxide'], { size: 40, maxW: 780, fills: [null, C.muted, '#FFB3A8', C.muted, '#9FE3FF', C.energy, '#FF9A50'] });

  /* ===== E: three test tubes ===== */
  const tubesE = reg(G(Wprops));
  const TX = [640, 830, 1020];
  E('rect', { x: 575, y: 520, width: 510, height: 14, rx: 5, fill: '#B08A5E', stroke: '#6E5236', 'stroke-width': 3 }, tubesE);
  const tubeA = G(tubesE), tubeB = G(tubesE), tubeC = G(tubesE);
  [tubeA, tubeB, tubeC].forEach((g, i) => tr(g, TX[i], 450));
  // A: dry air, drying agent, bung
  const tA = testTube(tubeA, 80, 260, { level: 0 });
  const nA = nailMini(tubeA, false); tr(nA, 0, -104);
  const rr = rng(4);
  let gran = ''; for (let i = 0; i < 9; i++) { const cx = -22 + (i % 5) * 11 + rr() * 4, cy = 112 - Math.floor(i / 5) * 12 - rr() * 3; gran += `M${(cx - 7).toFixed(1)},${cy.toFixed(1)} a7,7 0 1,0 14,0 a7,7 0 1,0 -14,0 `; }
  E('path', { d: gran, fill: '#F4F7FA', stroke: '#9FB0BF', 'stroke-width': 2 }, tubeA);
  E('rect', { x: -32, y: -150, width: 64, height: 36, rx: 6, fill: '#8A5A33', stroke: SC_INK, 'stroke-width': 3 }, tubeA);
  // B: boiled water under a layer of oil, bung
  const tB = testTube(tubeB, 80, 260, { level: 0.82, liquid: '#9CCBFF' });
  E('rect', { x: -38, y: -110, width: 76, height: 20, fill: '#F2C94C', opacity: 0.95 }, tubeB);
  const nB = nailMini(tubeB, false); tr(nB, 0, -104);
  E('rect', { x: -32, y: -150, width: 64, height: 36, rx: 6, fill: '#8A5A33', stroke: SC_INK, 'stroke-width': 3 }, tubeB);
  // C: open to the air, tap water: rusty
  const tC = testTube(tubeC, 80, 260, { level: 0.42, liquid: '#9CCBFF' });
  const nC = nailMini(tubeC, true); tr(nC, 0, -104);
  void tA; void tB; void tC; void nA; void nB; void nC;
  const eLab = [['dry air', '#FFFFFF'], ['boiled water', '#9FE3FF'], ['air + water', '#FFFFFF']].map(([s, c]) => lbl(Lfg, s, { size: 28, color: c }));
  const eOil = lbl(Lfg, 'oil layer', { size: 26, color: '#F2C94C', stroke: '#F2C94C' });
  const eDry = lbl(Lfg, 'drying agent', { size: 26, color: C.muted });
  const eVer = [['no rust ✓', C.good], ['no rust ✓', C.good], ['RUST', '#FF9A50']].map(([s, c]) => lbl(Lfg, s, { size: 28, color: c, stroke: c }));

  /* ===== F: Ferris's paint daydream ===== */
  const bubble = reg(G(Lfg));
  [[540, 330, 14], [580, 300, 22]].forEach(([x, y, r]) => E('circle', { cx: x, cy: y, r, fill: '#F4F1E8', stroke: SC_INK, 'stroke-width': 4 }, bubble));
  E('ellipse', { cx: 860, cy: 300, rx: 260, ry: 175, fill: '#F4F1E8', stroke: SC_INK, 'stroke-width': 5 }, bubble);
  const bridge = G(bubble); tr(bridge, 860, 330);
  const BR = 'M-200,40 L200,40 M-180,40 Q0,-150 180,40 M-120,40 L-120,-36 M-60,40 L-60,-74 M0,40 L0,-86 M60,40 L60,-74 M120,40 L120,-36';
  E('path', { d: BR, fill: 'none', stroke: '#8E99A6', 'stroke-width': 12, 'stroke-linecap': 'round' }, bridge);
  E('path', { d: BR, fill: 'none', stroke: '#C9692A', 'stroke-width': 5, 'stroke-dasharray': '6 18', 'stroke-linecap': 'round' }, bridge);
  const brClip = E('clipPath', { id: 'ferrisBridgeClip' }, defs());
  const brClipR = E('rect', { x: -220, y: -170, width: 0, height: 260 }, brClip);
  E('path', { d: BR, fill: 'none', stroke: '#3F7BD9', 'stroke-width': 14, 'stroke-linecap': 'round', 'clip-path': 'url(#ferrisBridgeClip)' }, bridge);
  E('rect', { x: -230, y: 40, width: 460, height: 16, rx: 6, fill: '#6FB7E8', opacity: 0.6 }, bridge);
  const brush = G(bridge);
  E('rect', { x: -6, y: -110, width: 12, height: 70, rx: 5, fill: '#B07A45', stroke: SC_INK, 'stroke-width': 3 }, brush);
  E('path', { d: 'M-16,-44 L16,-44 L14,-10 Q0,0 -14,-10 Z', fill: '#3F7BD9', stroke: SC_INK, 'stroke-width': 3 }, brush);
  const ghost = G(bubble); tr(ghost, 860, 300, 0.95);
  E('path', { d: 'M-46,-92 L46,-92 L46,64 L0,122 L-46,64 Z', fill: linGrad('#7FB2FF', '#2F5FC4'), stroke: SC_INK, 'stroke-width': 5, 'stroke-linejoin': 'round' }, ghost);
  E('rect', { x: -74, y: -116, width: 148, height: 28, rx: 12, fill: linGrad('#A9CBFF', '#3F6FD0', true), stroke: SC_INK, 'stroke-width': 5 }, ghost);
  E('rect', { x: 22, y: -86, width: 10, height: 140, rx: 5, fill: '#FFFFFF', opacity: 0.45 }, ghost);
  [-1, 1].forEach(sd => E('path', { d: `M${sd * 22 - 10},-40 Q${sd * 22},-50 ${sd * 22 + 10},-40`, fill: 'none', stroke: SC_INK, 'stroke-width': 4, 'stroke-linecap': 'round' }, ghost));
  E('path', { d: 'M-14,-10 Q0,4 14,-10', fill: 'none', stroke: SC_INK, 'stroke-width': 4, 'stroke-linecap': 'round' }, ghost);
  const ghostSpark = spark(ghost, 14, { color: '#CFE4FF' }); tr(ghostSpark, 70, -60);
  const paintChip = lbl(Lfg, 'paint keeps out oxygen and water', { size: 30, color: '#9FC8FF', stroke: '#3F7BD9' });

  /* ===== G: reduction ===== */
  const card2 = famCard(Lfg, 2);
  const redG = reg(G(Lfg));
  const heatGlow = E('ellipse', { cx: 520, cy: 440, rx: 330, ry: 90, fill: glow('#FF8A3D'), opacity: 0 }, redG);
  const flG = G(redG), fls = [];
  [330, 430, 720].forEach(x => { const f = flameIcon(flG); tr(f, x, 498); fls.push(f); });
  const fe1 = feAtom(redG, 36), fe2 = feAtom(redG, 36); tr(fe1, 330, 418); tr(fe2, 430, 418);
  const cAt = atom(redG, 'C', 32, { letter: true }); tr(cAt, 720, 418);
  const oG1 = atom(redG, 'O', 26, { letter: true }), oG2 = atom(redG, 'O', 26, { letter: true });
  const plusG = T(redG, 575, 432, '+', { size: 50, weight: 800, anchor: 'middle', fill: C.muted });
  const gLabOx = T(redG, 380, 560, 'iron oxide', { size: 32, weight: 800, anchor: 'middle', fill: '#C9D3DC' });
  const gLabFe = T(redG, 380, 560, 'iron', { size: 32, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  const gLabC = T(redG, 720, 560, 'carbon', { size: 32, weight: 800, anchor: 'middle', fill: '#C9D3DC' });
  const gLabCO2 = T(redG, 720, 560, 'carbon dioxide', { size: 32, weight: 800, anchor: 'middle', fill: C.co2 });
  const gTake = T(redG, 560, 300, 'the carbon takes the oxygen', { size: 30, weight: 800, anchor: 'middle', fill: C.energy });
  const gArc = arrow(redG, 470, 340, 680, 360, { color: C.energy, width: 5, bend: -40 });
  const feSpark = spark(redG, 14, { color: '#FFFFFF' }); tr(feSpark, 470, 370);
  const gRow = eqRow(redG, 520, 616, ['iron oxide', '+', 'carbon', '→', 'iron', '+', 'carbon dioxide'], { size: 34, maxW: 860, fills: [null, C.muted, null, C.energy, null, C.muted, C.co2] });

  /* ===== H: thermal decomposition + limewater ===== */
  const card3 = famCard(Lfg, 3);
  const app = reg(G(Wprops));
  E('rect', { x: 690, y: 574, width: 100, height: 16, rx: 4, fill: '#5A6672', stroke: SC_INK, 'stroke-width': 3 }, app);   // clamp stand
  E('rect', { x: 734, y: 300, width: 12, height: 280, rx: 4, fill: '#9FB0BF', stroke: SC_INK, 'stroke-width': 3 }, app);
  E('rect', { x: 640, y: 380, width: 100, height: 12, rx: 4, fill: '#9FB0BF', stroke: SC_INK, 'stroke-width': 3 }, app);
  const bun = bunsen(app, 0.8); tr(bun, 450, 590);
  const btube = G(app); tr(btube, 560, 420, 1, 80);
  testTube(btube, 64, 280, { level: 0 });
  const powder = E('path', { d: 'M28,34 L28,118 Q22,134 8,128 Q2,80 28,34 Z', fill: '#46B86A', stroke: SC_INK, 'stroke-width': 2 }, btube);
  E('rect', { x: -28, y: -158, width: 56, height: 30, rx: 6, fill: '#8A5A33', stroke: SC_INK, 'stroke-width': 3 }, btube);
  E('rect', { x: 618, y: 384, width: 44, height: 28, rx: 8, fill: '#C9A227', stroke: SC_INK, 'stroke-width': 3 }, app);   // clamp
  const DT = [[704, 395], [886, 395], [900, 410], [900, 548]];
  E('path', { d: 'M704,395 L886,395 Q900,395 900,410 L900,548', fill: 'none', stroke: '#CFE7F5', 'stroke-width': 12, 'stroke-linejoin': 'round', opacity: 0.85 }, app);
  E('path', { d: 'M704,395 L886,395 Q900,395 900,410 L900,548', fill: 'none', stroke: '#2B3A4A', 'stroke-width': 5, 'stroke-linejoin': 'round' }, app);
  const gasDots = [0, 1, 2, 3].map(() => E('circle', { r: 6, fill: '#E8EEF3', stroke: '#8FA2B0', 'stroke-width': 2 }, app));
  const lime = testTube(app, 72, 230, { level: 0.62, liquid: '#DDF3FF' }); tr(lime, 900, 470);
  const limeB = bubbles(app, 884, 470, 32, 100, { n: 7, r: 6, speed: 0.6, seed: 5 });
  const hLabG = lbl(Lfg, 'green copper carbonate', { size: 30, color: '#7CE0A0', stroke: '#46B86A' });
  const hLabK = lbl(Lfg, 'black copper oxide', { size: 30, color: '#FFFFFF', stroke: '#60656C', fill: 'rgba(8,8,10,0.94)' });
  const hLabCO2 = lbl(Lfg, '+ carbon dioxide', { size: 30, color: C.co2, stroke: C.co2 });
  const hLime = lbl(Lfg, 'limewater', { size: 30, color: '#DDF3FF' });
  const hMilky = lbl(Lfg, 'turns MILKY', { size: 34, color: '#FFFFFF', stroke: '#FFFFFF', sw: 4 });
  const hTest = lbl(Lfg, 'limewater turns milky = carbon dioxide ✓', { size: 34, color: C.energy, stroke: C.energy, sw: 4 });

  /* ===== I: neutralisation board + salt ===== */
  const card4 = famCard(Lfg, 4);
  const boardI = reg(tkBoard(Wprops, 640, 230, ''));
  tr(boardI, 560, 400);
  const iRow = eqRow(boardI, 0, -58, ['acid', '+', 'base', '→', 'salt', '+', 'water'], { size: 46, maxW: 590, fills: [C.bad, C.muted, '#8AD8FF', C.energy, '#FFFFFF', C.muted, '#9FE3FF'] });
  const ABSW = [0, 2, 4, 6].map((ix, i) => { const g = G(boardI); tr(g, iRow[ix].cx, -2); E('circle', { r: 24, fill: glow(C.energy), opacity: 0.6 }, g); T(g, 0, 13, 'ABSW'[i], { size: 38, weight: 800, anchor: 'middle', fill: C.energy }); return g; });
  const iL1 = T(boardI, 0, 50, 'hydrochloric acid + sodium hydroxide', { size: 32, weight: 700, anchor: 'middle', fill: C.ink });
  const iL2 = T(boardI, 0, 94, '→ **sodium chloride** + water', { size: 32, weight: 700, anchor: 'middle', fill: C.ink, boldFill: '#FFFFFF' });
  const plate = reg(tkDish(Wprops, 0.45)); plate.set(1);
  const shaker = reg(G(Wprops)), shIn = G(shaker);
  E('path', { d: 'M-34,-40 L34,-40 L40,60 Q40,70 30,70 L-30,70 Q-40,70 -40,60 Z', fill: 'rgba(240,248,255,0.92)', stroke: SC_INK, 'stroke-width': 4 }, shIn);
  E('rect', { x: -36, y: -70, width: 72, height: 32, rx: 10, fill: '#C9D3DC', stroke: SC_INK, 'stroke-width': 4 }, shIn);
  [-16, 0, 16].forEach(x => E('circle', { cx: x, cy: -60, r: 3.5, fill: SC_INK }, shIn));
  T(shIn, 0, 30, 'NaCl', { size: 26, weight: 800, anchor: 'middle', fill: '#3F5BD9' });
  const grains = [0, 1, 2, 3, 4, 5, 6, 7].map(() => reg(E('rect', { x: -3, y: -3, width: 6, height: 6, fill: '#FFFFFF' }, Wprops)));
  const iSalt = lbl(Lfg, 'salt!', { size: 32, color: '#FFFFFF', stroke: '#FFFFFF' });

  /* ===== J: displacement ===== */
  const card5 = famCard(Lfg, 5);
  const disJ = reg(G(Lfg));
  const jSO4 = so4(disJ); tr(jSO4, 730, 420);
  const jCu = cuAtom(disJ, 38), jFe = feAtom(disJ, 38, true);
  const jLabCS = T(disJ, 680, 522, 'copper sulfate', { size: 30, weight: 800, anchor: 'middle', fill: '#9FC8FF' });
  const jLabIS = T(disJ, 680, 522, 'iron sulfate', { size: 30, weight: 800, anchor: 'middle', fill: '#A8E6B4' });
  const jMore = lbl(disJ, 'more reactive', { size: 28, color: C.good, stroke: C.good });
  const jLess = lbl(disJ, 'less reactive', { size: 28, color: C.muted });
  const jLabCu = T(disJ, 380, 548, 'copper', { size: 30, weight: 800, anchor: 'middle', fill: '#F0A27E' });
  const jShove = T(disJ, 560, 330, 'SHOVE!', { size: 40, weight: 800, anchor: 'middle', fill: C.energy });
  const jRow = eqRow(disJ, 560, 616, ['iron', '+', 'copper sulfate', '→', 'iron sulfate', '+', 'copper'], { size: 34, maxW: 900, fills: [null, C.muted, '#9FC8FF', C.energy, '#A8E6B4', C.muted, '#F0A27E'] });

  /* ===== K: the copper sulfate bath ===== */
  const bk = reg(beaker(Wprops, 300, 300, { level: 0.55, liquid: '#2F7DEB' })); tr(bk, 520, 440);
  const kLabB = lbl(Lfg, 'blue copper sulfate', { size: 30, color: '#9FC8FF', stroke: '#2F7DEB' });
  const kLabG = lbl(Lfg, 'pale green iron sulfate', { size: 30, color: '#A8E6B4', stroke: '#56D69B' });
  const ladder = reg(G(Lfg));
  E('path', { d: 'M890,250 L890,540 M1030,250 L1030,540', stroke: '#B08A5E', 'stroke-width': 10, 'stroke-linecap': 'round' }, ladder);
  T(ladder, 960, 228, 'more reactive ↑', { size: 30, weight: 800, anchor: 'middle', fill: C.good });
  const RUNGS = ['Mg', 'Zn', 'Fe', 'Cu', 'Ag'], rungEl = [];
  RUNGS.forEach((s, i) => {
    const y = 278 + i * 62, g = G(ladder);
    E('rect', { x: 896, y: y - 22, width: 128, height: 44, rx: 10, fill: '#2A2040', stroke: '#B08A5E', 'stroke-width': 3 }, g);
    T(g, 960, y + 11, s, { size: 32, weight: 800, anchor: 'middle', fill: s === 'Fe' ? '#DCE2E8' : s === 'Cu' ? '#F0A27E' : C.muted });
    rungEl.push(g);
  });
  const hiFe = E('rect', { x: 890, y: 278 + 2 * 62 - 27, width: 140, height: 54, rx: 12, fill: 'none', stroke: C.good, 'stroke-width': 5 }, ladder);
  const hiCu = E('rect', { x: 890, y: 278 + 3 * 62 - 27, width: 140, height: 54, rx: 12, fill: 'none', stroke: '#F0A27E', 'stroke-width': 5 }, ladder);
  const kPushed = lbl(Lfg, 'copper pushed out!', { size: 36, color: '#F0A27E', stroke: '#F0A27E', sw: 4 });
  const kEq = reg(G(Lfg));
  card(kEq, -470, -38, 940, 76, { fill: 'rgba(16,10,32,0.94)', stroke: '#F0A27E', sw: 4, rx: 38 });
  eqRow(kEq, 0, 12, ['iron', '+', 'copper sulfate', '→', 'iron sulfate', '+', 'copper'], { size: 34, maxW: 880, fills: [null, C.muted, '#9FC8FF', C.energy, '#A8E6B4', C.muted, '#F0A27E'] });
  const conf = reg(confetti(Wprops, 24, 9));

  /* cut points */
  const cB = at('first') - 0.06, cC = at('rust') - 0.06, cD = at('both') - 0.06, cE = at('dry') - 0.06, cF = at('paint') - 0.06,
    cG = at('reduce') - 0.06, cH = at('decomp') - 0.06, cI = at('neutral') - 0.06, cJ = at('displace') - 0.06, cK = at('dip') - 0.06,
    cL = at('thhappy') - 0.06;

  return t => {
    seen = new Set();
    const put = (k, x, y, s, st, r) => { const c = ch[k]; seen.add(c); op(c, st.op === undefined ? 1 : st.op); tr(c, x, y, s, r); c.set(Object.assign({ t, talk: scTalk(S, t, k) }, st)); };
    const kat = (x, y, s) => put('kat', x, y, s || 0.42, { mood: 'deadpan', still: true });
    const kit = t >= cB && t < cC ? 2 : (t < cF || (t >= cH && t < cJ) || (t >= cK && t < cL)) ? 1 : 0;
    if (kit) { show(kitchen); kitchen.upd(t); show(counter); op(kitchen.sign, t < cB || (t >= cC && t < cD) || (t >= cH && t < cJ) || (t >= cK && t < cL) ? 0 : 1); }
    let wcam = cam(1, 600, 375);

    /* ---------- A: round card ---------- */
    if (t < cB) {
      wcam = cam(1 + 0.025 * P(t, 0, cB, linear), 600, 420);
      kat(150, 549);
      put('olly', 330, 450, 1, { mood: t > mid('round', 0.55) ? 'smug' : 'happy', look: t > mid('round', 0.55) ? 0 : 0.5, sparkle: 1 });
      put('ferris', 540, 478, 0.85, { rust: 0.7, look: -0.2 });
      put('arrow', 780, 486, 1, { look: -0.3 });
      popIn(roundCard, t, at('round') + 0.1, 600, 222);
      op(roundSub, P(t, mid('round', 0.5), 0.3, linear));
    }

    /* ---------- B: Ferris alone in the spotlight ---------- */
    if (t >= cB && t < cC) {
      wcam = cam(1 + 0.07 * P(t, cB, cC - cB, linear), 600, 430);
      show(dim, 0.62); show(spot, 0.9); tr(spot, 600, 560);
      kat(150, 549);
      const ru = 0.66 + 0.06 * P(t, mid('first', 0.4), 2.2, linear);
      put('ferris', 600, 470, 1.05, { rust: ru, look: t > end('first') ? 0 : -0.3 });
      popIn(rustM, t, mid('first', 0.45), 900, 380);
      attr(rustBar, 'y', 150 - 300 * ru); attr(rustBar, 'height', 300 * ru - 10);
      setText(rustPct, Math.round(ru * 100) + '%');
      popIn(stillChip, t, mid('first', 0.55), 600, 230);
    }

    /* ---------- C: oxidation ---------- */
    if (t >= cC && t < cD) {
      const kz = 1.06 + 0.07 * P(t, end('welcome') + 0.05, cD - end('welcome'), linear);
      wcam = cam(kz, 420, 440);
      kat(1080, 549);
      const ru = 0.72 + 0.1 * P(t, mid('rust', 0.72), 1.4, linear);
      const tw = t >= at('welcome') - 0.05;
      const oy = 600 - 265 * P(t, at('welcome') - 0.25, 0.35, pop);
      if (t >= at('welcome') - 0.3) put('olly', 235, oy, 0.85, { look: 0.8, sparkle: 1, mood: 'happy' });
      put('ferris', 380, 455, 1.1, { rust: ru, look: tw ? (t > end('welcome') + 0.15 ? 0 : -0.6) : 0.15 });
      popIn(rustChip, t, mid('rust', 0.06), 820, 380);
      famShow(card1, t, mid('rust', 0.32), mid('rust', 0.62));
      show(oxAtoms);
      oxList.forEach((a, i) => {
        const t0 = mid('rust', 0.66) + i * 0.13, p = P(t, t0, 0.5, easeOut);
        const [lx, ly] = OX_AT[i], tx = 380 + lx * 1.1, ty = 455 + ly * 1.1;
        op(a, p > 0 ? 1 : 0);
        tr(a, lerp(1180, tx, p), lerp(260 + i * 40, ty, p) - 50 * Math.sin(p * Math.PI));
      });
      popIn(plusO, t, mid('rust', 0.75), 820, 470);
    }

    /* ---------- D: rusting needs oxygen AND water ---------- */
    if (t >= cD && t < cE) {
      kat(150, 549);
      put('ferris', 1068, 470, 0.9, { rust: 0.82, look: -0.7 });
      show(boardD, P(t, cD, 0.15, linear));
      op(dO2, P(t, at('both'), 0.3, linear)); op(dO2l, P(t, at('both') + 0.1, 0.3, linear));
      op(dAlone, P(t, mid('both', 0.08), 0.3, linear) * (1 - P(t, mid('both', 0.27), 0.2, linear)));
      op(dAnd, P(t, mid('both', 0.3), 0.25, linear));
      op(dDrop, P(t, mid('both', 0.33), 0.25, linear)); op(dDropl, P(t, mid('both', 0.35), 0.25, linear));
      op(dTick1, P(t, mid('both', 0.42), 0.2, linear)); op(dTick2, P(t, mid('both', 0.44), 0.2, linear));
      op(dEq, P(t, mid('both', 0.48), 0.2, linear)); op(dRust, P(t, mid('both', 0.5), 0.25, linear)); op(dRustl, P(t, mid('both', 0.52), 0.25, linear));
      [0.58, 0.63, 0.66, 0.71, 0.74, 0.79, 0.84].forEach((f, i) => op(dRow[i], P(t, mid('both', f), 0.25, linear)));
    }

    /* ---------- E: three test tubes ---------- */
    if (t >= cE && t < cF) {
      kat(120, 549);
      put('arrow', 290, 452, 0.9, { look: 0.8 });
      show(tubesE);
      [tubeA, tubeB, tubeC].forEach((g, i) => {
        const p = P(t, mid('dry', [0.12, 0.42, 0.7][i]), 0.4, pop);
        op(g, clamp(p * 2.5)); tr(g, TX[i], 450 + 30 * (1 - clamp(p)));
        popIn(eLab[i], t, mid('dry', [0.14, 0.44, 0.72][i]), TX[i], 290);
        popIn(eVer[i], t, mid('dry', [0.84, 0.86, 0.78][i]), TX[i], 616);
      });
      tr(eDry, 640, 352); show(eDry, P(t, mid('dry', 0.26), 0.3, linear) * (1 - P(t, mid('dry', 0.42), 0.2, linear)));
      popIn(eOil, t, mid('dry', 0.55), 830, 352);
    }

    /* ---------- F: Ferris's confessional ---------- */
    if (t >= cF && t < cG) {
      show(confF); confF.set(1, t);
      wcam = cam(1 + 0.1 * P(t, end('paint'), cG - end('paint'), linear), 400, 380);
      const dream = t > mid('paint', 0.6);
      put('ferris', 390, 430, 1.3, { rust: 0.82, look: dream ? 0.6 : 0.3, mood: 'sad' });
      popIn(bubble, t, at('paint') + 0.1, 0, 0);
      const pp = P(t, mid('paint', 0.12), mid('paint', 0.45) - mid('paint', 0.12), linear);
      attr(brClipR, 'width', 440 * pp);
      tr(brush, -200 + 400 * pp, -40 + 60 * Math.sin(pp * Math.PI) - 20, 1, 20 * Math.sin(t * 9) * AMP);
      op(bridge, 1 - P(t, mid('paint', 0.6), 0.25, linear));
      op(ghost, P(t, mid('paint', 0.62), 0.35, linear)); ghostSpark.upd(t);
      tr(ghost, 860, 300 + 6 * Math.sin(t * 2) * AMP, 0.95);
      popIn(paintChip, t, mid('paint', 0.3), 860, 520);
    }

    /* ---------- G: reduction ---------- */
    if (t >= cG && t < cH) {
      show(diagBg);
      famShow(card2, t, mid('reduce', 0.04), mid('reduce', 0.22));
      const hot = t > mid('reduce', 0.42);
      put('ferris', 1085, 470, 0.6, { rust: 0.82, look: -0.8, mood: t > mid('reduce', 0.1) && t < mid('reduce', 0.42) ? 'neutral' : 'sad', sweat: hot ? 0.8 : 0 });
      show(redG, P(t, mid('reduce', 0.2), 0.3, linear));
      const hp = P(t, mid('reduce', 0.42), 0.4, linear);
      op(heatGlow, 0.7 * hp); op(flG, hp); fls.forEach((f, i) => f.upd(t, i));
      // the oxygen atoms jump from the iron to the carbon
      const jp = P(t, mid('reduce', 0.62), 0.9, ease);
      const up = P(t, mid('reduce', 0.86), 1.4, ease);
      const cx = 720 + 120 * up, cy = 418 - 120 * up;
      [[oG1, 330, 352, -52], [oG2, 430, 352, 52]].forEach(([o, x0, y0, dx], i) => {
        const p = clamp(jp * 1.15 - i * 0.15);
        tr(o, lerp(x0, cx + dx, p), lerp(y0, cy, p) - 110 * Math.sin(p * Math.PI));
      });
      tr(cAt, cx, cy);
      gArc.set(P(t, mid('reduce', 0.6), 0.5, linear)); op(gArc, 1 - P(t, mid('reduce', 0.86), 0.3, linear));
      op(gTake, P(t, mid('reduce', 0.6), 0.25, linear) * (1 - P(t, mid('reduce', 0.86), 0.3, linear)));
      const sw = P(t, mid('reduce', 0.8), 0.3, linear);
      op(gLabOx, 1 - sw); op(gLabFe, sw); op(gLabC, 1 - sw); op(gLabCO2, sw);
      tr(gLabCO2, 120 * up, -198 * up);
      op(feSpark, sw); feSpark.upd(t);
      [0.6, 0.64, 0.68, 0.72, 0.76, 0.8, 0.84].forEach((f, i) => op(gRow[i], P(t, mid('reduce', f), 0.25, linear)));
    }

    /* ---------- H: thermal decomposition, limewater ---------- */
    if (t >= cH && t < cI) {
      const zp = P(t, at('lime') - 0.1, 0.6, ease);
      wcam = cam(lerp(1, 1.25, zp), lerp(600, 760, zp), lerp(375, 440, zp), lerp(600, 760, zp), lerp(375, 440, zp));
      kat(1135, 549);
      const hop = Math.abs(Math.sin(t * 5.5)) * 14 * AMP * (t > mid('decomp', 0.1) ? 1 : 0.3);
      put('olly', 215, 440 - hop, 0.85, { look: 0.6, sparkle: 1, mood: 'happy' });
      show(app);
      if (t < at('lime')) famShow(card3, t, mid('decomp', 0.04), mid('decomp', 0.2));
      const fon = t > mid('decomp', 0.5);
      bun.set(fon ? 'blue' : 'off'); bun.upd(t);
      const blk = P(t, mid('decomp', 0.58), mid('decomp', 0.84) - mid('decomp', 0.58), linear);
      attr(powder, 'fill', mixCol('#46B86A', '#1E2124', blk));
      if (t < at('lime')) {
        popIn(hLabG, t, mid('decomp', 0.46), 430, 320); op(hLabG, P(t, mid('decomp', 0.46), 0.3, linear) * (1 - P(t, mid('decomp', 0.78), 0.2, linear)));
        popIn(hLabK, t, mid('decomp', 0.8), 430, 320);
        popIn(hLabCO2, t, mid('decomp', 0.9), 820, 320);
      }
      const gas = P(t, mid('decomp', 0.88), 0.4, linear);
      // gas dots travel along the delivery tube
      const segL = [182, 21, 138], tot = 341;
      gasDots.forEach((d, i) => {
        const u = ((t * 0.55 + i / 4) % 1) * tot; let k = 0, acc = 0;
        while (k < 2 && acc + segL[k] < u) { acc += segL[k]; k++; }
        const f = clamp((u - acc) / segL[k]), a = DT[k], b = DT[k + 1];
        attr(d, 'cx', lerp(a[0], b[0], f)); attr(d, 'cy', lerp(a[1], b[1], f)); op(d, gas);
      });
      limeB.upd(t, gas);
      const milk = P(t, mid('lime', 0.22), mid('lime', 0.55) - mid('lime', 0.22), linear);
      lime.liquid.setAttribute('fill', mixCol('#DDF3FF', '#F6F5EE', milk)); lime.liquid.style.opacity = (0.45 + 0.53 * milk).toFixed(3);
      if (t >= at('lime') - 0.1) {
        popIn(hLime, t, at('lime') + 0.1, 1060, 300);
        popIn(hMilky, t, mid('lime', 0.4), 1060, 372);
        popIn(hTest, t, mid('lime', 0.62), 600, 170);
      }
    }

    /* ---------- I: neutralisation, salt ---------- */
    if (t >= cI && t < cJ) {
      const pz = P(t, end('salt'), cJ - end('salt'), linear);
      wcam = cam(1 + 0.12 * pz, lerp(600, 1000, Math.min(1, pz * 4)), lerp(375, 430, Math.min(1, pz * 4)));
      kat(150, 549);
      const fin = t > mid('salt', 0.86);
      put('arrow', 1020, 460, 0.85, { look: t < at('salt') ? -0.7 : fin ? 0 : t > mid('salt', 0.7) ? 0.6 : -0.5 });
      famShow(card4, t, at('neutral') + 0.05, at('neutral') + 0.6);
      show(boardI, P(t, cI, 0.15, linear));
      [0.12, 0.24, 0.3, 0.4, 0.48, 0.57, 0.62].forEach((f, i) => op(iRow[i], P(t, mid('neutral', f), 0.25, linear)));
      ABSW.forEach((g, i) => {
        const p = P(t, mid('neutral', 0.78) + i * 0.12, 0.35, pop), pul = 1 + 0.25 * Math.max(0, Math.sin((t - at('salt') - i * 0.35) * Math.PI / 0.5)) * (t > at('salt') && t < at('salt') + 1.8 ? 1 : 0);
        op(g, clamp(p * 2.5)); tr(g, iRow[[0, 2, 4, 6][i]].cx, -2, Math.max(0.01, (0.6 + 0.4 * p) * pul));
      });
      op(iL1, P(t, mid('salt', 0.24), 0.3, linear)); op(iL2, P(t, mid('salt', 0.42), 0.3, linear));
      // "Salt." the shaker drops into Arrow's... tip; "Finally." he sprinkles
      const dp = P(t, mid('salt', 0.6), 0.4, easeOut), tilt = P(t, mid('salt', 0.7), 0.35, ease);
      if (t > mid('salt', 0.6)) {
        show(plate); tr(plate, 1050, 588);
        show(shaker); tr(shaker, 1112, lerp(-120, 500, dp), 1, -150 * tilt);
        popIn(iSalt, t, mid('salt', 0.62), 1080, 300);
        grains.forEach((gr, i) => {
          const u = ((t * 1.3 + i / 8) % 1);
          show(gr, tilt > 0.9 ? 1 : 0); tr(gr, 1100 - 20 + i * 5 - u * 40, 520 + u * 62 + (i % 3) * 3);
        });
      }
    }

    /* ---------- J: displacement ---------- */
    if (t >= cJ && t < cK) {
      show(diagBg);
      famShow(card5, t, at('displace') + 0.05, mid('displace', 0.3));
      put('ferris', 1085, 470, 0.6, { rust: 0.82, look: -0.8, mood: t > mid('displace', 0.62) ? 'happy' : 'sad' });
      show(disJ, P(t, mid('displace', 0.1), 0.3, linear));
      const ein = P(t, mid('displace', 0.25), 0.9, easeOut);
      const sh = P(t, mid('displace', 0.55), 0.35, easeOut), fly = P(t, mid('displace', 0.55), 0.7, easeOut);
      tr(jFe, lerp(170, 530, ein) + 90 * sh, 420);
      tr(jCu, lerp(630, 380, fly), 420 + 70 * fly - 120 * Math.sin(fly * Math.PI), 1, -360 * fly);
      tr(jMore, lerp(170, 530, ein) + 90 * sh, 342); op(jMore, P(t, mid('displace', 0.4), 0.3, linear));
      tr(jLess, 630, 342); op(jLess, P(t, mid('displace', 0.45), 0.3, linear) * (1 - P(t, mid('displace', 0.55), 0.15, linear)));
      op(jShove, win(t, mid('displace', 0.55), mid('displace', 0.72), 0.1));
      const ls = P(t, mid('displace', 0.62), 0.3, linear);
      op(jLabCS, 1 - ls); op(jLabIS, ls); op(jLabCu, P(t, mid('displace', 0.7), 0.3, linear));
      [0.68, 0.72, 0.75, 0.79, 0.83, 0.87, 0.9].forEach((f, i) => op(jRow[i], P(t, mid('displace', f), 0.25, linear)));
    }

    /* ---------- K: the copper sulfate bath ---------- */
    if (t >= cK && t < cL) {
      const kz = P(t, at('winning') - 0.05, 0.5, ease);
      wcam = cam(1 + 0.06 * kz, 560, 400);
      kat(150, 549);
      const win_ = t >= at('winning') - 0.05;
      const dipP = P(t, at('dip') - 0.05, 1.2, ease), rise = P(t, at('winning') - 0.05, 0.6, pop);
      const dance = win_ ? Math.sin((t - at('winning')) * 7) * AMP : 0;
      const fy = lerp(250, 400, dipP) - 78 * rise - Math.abs(dance) * 16;
      const mood = win_ ? 'happy' : t > mid('dip', 0.66) ? 'smug' : t > mid('dip', 0.4) ? 'neutral' : 'sad';
      put('ferris', 520, fy, 0.9, { rust: 0.82, copper: win_ ? 1 : 0, look: win_ ? 0 : 0.3, mood }, dance * 9);
      show(bk);
      const gc = P(t, mid('dip', 0.5), at('winning') + 0.6 - mid('dip', 0.5), linear);
      bk.liquid.setAttribute('fill', mixCol('#2F7DEB', '#9EDDA8', gc));
      popIn(kLabB, t, mid('dip', 0.12), 215, 330); if (t > at('winning') + 0.1) op(kLabB, 0);
      popIn(kLabG, t, at('winning') + 0.2, 215, 330);
      if (!win_) {
        show(ladder, P(t, mid('dip', 0.45), 0.3, linear));
        op(hiFe, P(t, mid('dip', 0.6), 0.2, linear)); op(hiCu, P(t, mid('dip', 0.68), 0.2, linear));
      }
      if (win_) {
        popIn(kEq, t, at('winning') + 0.15, 600, 150);
        popIn(kPushed, t, mid('winning', 0.45), 940, 380);
        show(conf); conf.upd(t, at('winning') + 0.1);
      }
    }

    /* ---------- L: Arrow's confessional ---------- */
    if (t >= cL) {
      show(confA); confA.set(1, t);
      wcam = cam(1 + 0.08 * P(t, end('thhappy'), 1.4, linear), 420, 380);
      put('arrow', 420, 420, 1.35, { look: t > mid('thhappy', 0.45) && t < end('thhappy') ? 0.7 : 0, mood: 'deadpan' });
      show(insetBg); show(insetRing);
      const d = Math.sin(t * 6) * AMP;
      put('ferris', 900 + 14 * d, 310 - Math.abs(d) * 14, 0.6, { copper: 1, rust: 0.82, mood: 'happy' }, d * 14);
    }

    world.setAttribute('transform', wcam);
    M.forEach(el => { if (!seen.has(el)) op(el, 0); });
    void kit;
  };
});
