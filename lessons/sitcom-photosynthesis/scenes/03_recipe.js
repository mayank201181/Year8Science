/* Scene 3: The recipe.
   Factory floor with the GLUCOSE MAKER 3000: Phyllis in the skylight beam, Cosmo and Dewi ride the belt in ->
   the porthole: light energy joins CO2 + H2O into glucose -> Gus pops out (lower third) -> Clive confessional,
   Gus as a packed lunch (chemical energy) -> Olive slumps out (lower third) -> the Guards put Olive out of the stoma
   like rubbish -> Dewi: the oxygen comes from water (not CO2) -> the word equation with the cast underneath ->
   Kavya's flashcards (Cars Won't Go On Grass) -> "...and sunlight?" (1 s on Clive) -> sunlight goes OVER the arrow,
   chlorophyll under -> Phyllis on the arrow as a stage -> the symbol equation, 6 + 6 -> 1 (+ 6), atoms counted,
   and without the sixes it does not balance. */
scene('recipe', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;

  /* ---------- local helpers (prefixed rcp) ---------- */
  const rcpCam = (el, k, fx, fy, sx, sy) => el.setAttribute('transform', `translate(${sx.toFixed(1)} ${sy.toFixed(1)}) scale(${k.toFixed(4)}) translate(${(-fx).toFixed(1)} ${(-fy).toFixed(1)})`);
  const rcpPop = (el, p, x, y, s, r) => { op(el, clamp(p * 2.5)); tr(el, x, y, Math.max(0.01, (s || 1) * (0.6 + 0.4 * p)), r); };
  // rich text: '_2' subscripts, '**bold**' in o.boldFill; centred on x (or o.anchor 'start')
  function rcpRich(parent, x, y, str, o) {
    o = o || {};
    const size = o.size || 32, sub = size * 0.62, dy = size * 0.26, font = o.font || FD;
    const segs = [];
    String(str).split(/(\*\*[^*]+\*\*)/).forEach(seg => {
      if (!seg) return;
      const bold = seg.startsWith('**'), inner = bold ? seg.slice(2, -2) : seg;
      inner.split(/(_\d+)/).forEach(p => { if (p) segs.push({ s: p[0] === '_' ? p.slice(1) : p, sub: p[0] === '_', bold }); });
    });
    const w = segs.reduce((a, q) => a + textWidth(q.s, q.sub ? sub : size, font, q.bold ? 800 : (o.weight || 700)), 0);
    const tx = E('text', { x: o.anchor === 'start' ? x : x - w / 2, y, 'font-size': size, 'font-family': font, 'font-weight': o.weight || 700, fill: o.fill || C.ink }, parent);
    tx.w = w;
    if (segs.length === 1 && !segs[0].sub) { tx.textContent = segs[0].s; if (segs[0].bold) { tx.setAttribute('font-weight', 800); if (o.boldFill) tx.setAttribute('fill', o.boldFill); } return tx; }
    let low = false;
    segs.forEach(q => {
      const sp = E('tspan', {}, tx); sp.textContent = q.s;
      if (q.bold) { sp.setAttribute('font-weight', 800); if (o.boldFill) sp.setAttribute('fill', o.boldFill); }
      if (q.sub) { sp.setAttribute('font-size', sub.toFixed(1)); if (!low) { sp.setAttribute('dy', dy.toFixed(1)); low = true; } }
      else if (low) { sp.setAttribute('dy', (-dy).toFixed(1)); low = false; }
    });
    return tx;
  }
  function rcpChip(parent, str, o) {
    o = o || {};
    const size = o.size || 32, g = G(parent), h = Math.round(size * 1.75);
    const box = E('rect', { y: -h / 2, height: h, rx: h / 2, fill: o.fill || 'rgba(10,27,39,0.9)', stroke: o.stroke || C.line, 'stroke-width': 3 }, g);
    const tx = rcpRich(g, 0, size * 0.35, str, { size, fill: o.color || C.ink, boldFill: o.boldFill || C.energy });
    const w = tx.w + size * 1.4;
    attr(box, 'x', -w / 2); attr(box, 'width', w);
    g.w = w;
    return g;
  }
  const rcpRing = (x, y, r) => `M${(x - r).toFixed(1)},${y.toFixed(1)} a${r.toFixed(1)},${r.toFixed(1)} 0 1,0 ${(2 * r).toFixed(1)},0 a${r.toFixed(1)},${r.toFixed(1)} 0 1,0 ${(-2 * r).toFixed(1)},0 `;
  function rcpCO2(parent, r) { const g = G(parent); E('path', { d: rcpRing(-r * 1.5, 0, r * 0.85) + rcpRing(r * 1.5, 0, r * 0.85), fill: C.oxygen, stroke: C.oxygenDk, 'stroke-width': 2 }, g); E('circle', { r, fill: ball(C.carbon, C.carbonDk), stroke: C.carbonDk, 'stroke-width': 1.5 }, g); return g; }
  function rcpH2O(parent, r) { const g = G(parent); E('path', { d: rcpRing(-r * 0.95, r * 0.72, r * 0.6) + rcpRing(r * 0.95, r * 0.72, r * 0.6), fill: C.hydrogen, stroke: C.hydrogenDk, 'stroke-width': 2 }, g); E('circle', { r, fill: ball(C.oxygen, C.oxygenDk), stroke: C.oxygenDk, 'stroke-width': 1.5 }, g); return g; }
  function rcpO2(parent, r) { const g = G(parent); E('path', { d: rcpRing(-r * 0.72, 0, r) + rcpRing(r * 0.72, 0, r), fill: C.oxygen, stroke: C.oxygenDk, 'stroke-width': 2 }, g); return g; }
  // centres of items laid out in a row (relative to the row's centre)
  function rcpRow(ws, gap) { const tot = ws.reduce((a, w) => a + w, 0) + gap * (ws.length - 1); let x = -tot / 2; return { tot, xs: ws.map(w => { const c = x + w / 2; x += w + gap; return c; }) }; }

  /* layers */
  const Lbg = G(root), Lmid = G(root), Lcast = G(root), Lfg = G(root), Lhud = G(root);

  /* ================= the factory and the machine ================= */
  const facShot = G(Lbg), facWrap = G(facShot);
  const fac = phFactory(facWrap);
  const dark = E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#04140B' }, facShot);
  const mach = G(facShot);
  const beam = E('path', { d: 'M560,0 L720,0 L790,330 L490,330 Z', fill: '#FFF3A0', opacity: 0.3 }, mach);
  E('path', { d: 'M452,600 L452,560 L400,520 L400,600 Z', fill: '#5A6B7A', stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, mach);   // intake
  E('path', { d: 'M828,560 L900,610 L900,636 L828,636 Z', fill: '#5A6B7A', stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, mach);   // output chute
  E('rect', { x: 452, y: 330, width: 376, height: 306, rx: 26, fill: linGrad('#9FB3C2', '#5E7383', true), stroke: SC_INK, 'stroke-width': 5 }, mach);
  const port = E('circle', { cx: 640, cy: 450, r: 74, fill: '#1A3A28', stroke: '#C9D3DC', 'stroke-width': 12 }, mach);
  const portGlow = E('circle', { cx: 640, cy: 450, r: 64, fill: glow('#FFE45C') }, mach);
  E('rect', { x: 500, y: 552, width: 280, height: 52, rx: 8, fill: '#2A3A48', stroke: SC_INK, 'stroke-width': 3 }, mach);
  T(mach, 640, 587, 'GLUCOSE MAKER 3000', { size: 26, weight: 800, anchor: 'middle', fill: '#FFE45C' });
  const mLamps = [0, 1].map(i => E('circle', { cx: 490 + i * 300, cy: 370, r: 12, fill: '#FF6060', stroke: SC_INK, 'stroke-width': 3 }, mach));
  const console_ = G(facShot);
  E('rect', { x: 310, y: 410, width: 80, height: 96, rx: 8, fill: '#3A4652', stroke: SC_INK, 'stroke-width': 4 }, console_);
  const lever = E('path', { d: 'M0,0 L0,-52', stroke: SC_INK, 'stroke-width': 8, 'stroke-linecap': 'round' }, console_);
  const knob = E('circle', { r: 12, fill: '#E8424F', stroke: SC_INK, 'stroke-width': 3 }, console_);
  const gusSpk = [0, 1].map(i => spark(Lfg, 16, { seed: i + 2 }));
  const cGlu = rcpChip(Lfg, '**glucose**: a sugar', { size: 36, boldFill: C.glucose });
  const cOx = rcpChip(Lfg, '**oxygen** (O_2): the by-product', { size: 34, boldFill: '#FF9A8F' });

  /* ================= the porthole (inside the machine) ================= */
  const portShot = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#4E6272', '#2A3A48', true) }, portShot);
  E('circle', { cx: 600, cy: 360, r: 290, fill: linGrad('#163A26', '#0B2416', true), stroke: '#C9D3DC', 'stroke-width': 30 }, portShot);
  { let d = ''; for (let i = 0; i < 16; i++) { const a = i / 16 * TAU; d += rcpRing(600 + Math.cos(a) * 290, 360 + Math.sin(a) * 290, 7); } E('path', { d, fill: '#7D8892' }, portShot); }
  const pBeam = E('path', { d: 'M540,70 L660,70 L700,360 L500,360 Z', fill: '#FFF3A0', opacity: 0.25 }, portShot);
  const flashP = E('circle', { cx: 600, cy: 360, r: 200, fill: glow('#FFFFFF') }, portShot);
  const pSparks = [0, 1, 2].map(i => spark(Lfg, 20, { seed: i + 4 }));
  const bigGlu = molGlucose(Lfg, 74);
  const cJoin = rcpChip(Lfg, 'light energy joins **carbon dioxide** + **water** → **glucose**', { size: 30, boldFill: C.glucose });

  /* the molecules (shared: in the porthole, then under the symbol equation) */
  const mCO2 = [0, 1, 2, 3, 4, 5].map(() => rcpCO2(Lfg, 10.5));
  const mH2O = [0, 1, 2, 3, 4, 5].map(() => rcpH2O(Lfg, 14));
  const mO2 = [0, 1, 2, 3, 4, 5].map(() => rcpO2(Lfg, 11));
  const smallGlu = molGlucose(Lfg, 24);

  /* ================= confessional: the packed lunch ================= */
  const conf = phConf(Lbg, 'clive');
  const lunch = G(Lfg);
  E('rect', { x: -130, y: -150, width: 260, height: 70, rx: 14, fill: '#3D7BFF', stroke: SC_INK, 'stroke-width': 5, transform: 'rotate(-14 -130 -80)' }, lunch);   // open lid
  E('rect', { x: -130, y: -80, width: 260, height: 150, rx: 18, fill: '#56A0FF', stroke: SC_INK, 'stroke-width': 5 }, lunch);
  E('path', { d: 'M-40,-80 Q0,-128 40,-80', fill: 'none', stroke: SC_INK, 'stroke-width': 8 }, lunch);
  const lGlu = molGlucose(lunch, 52); tr(lGlu, 0, -10);
  const lSpk = spark(lunch, 22, { seed: 3 }); tr(lSpk, 0, -10);
  const cChem = rcpChip(Lfg, '**light energy** → stored as **chemical energy**', { size: 30 });
  const cLunch = rcpChip(Lfg, 'a packed lunch', { size: 30, color: C.muted });

  /* ================= the stoma door ================= */
  const doorShot = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#BFE9C8', '#9FD8AE', true) }, doorShot);
  { let d = ''; const r = rng(8);
    for (let row = 0; row < 6; row++) for (let col = 0; col < 7; col++) {
      const x = col * 190 - 40 + (row % 2) * 95, y = row * 140 - 30, w = 190, h = 140, j = () => (r() - 0.5) * 30;
      d += `M${x},${y} C${x + 60},${y + j()} ${x + 130},${y + j()} ${x + w},${y} C${x + w + j()},${y + 50} ${x + w + j()},${y + 90} ${x + w},${y + h} `;
    }
    E('path', { d, fill: 'none', stroke: '#5FB474', 'stroke-width': 5, opacity: 0.8 }, doorShot); }
  const rubSign = G(doorShot); tr(rubSign, 600, 112);
  E('rect', { x: -170, y: -34, width: 340, height: 68, rx: 10, fill: '#3A3F45', stroke: '#FFFFFF', 'stroke-width': 4 }, rubSign);
  T(rubSign, 0, 12, 'RUBBISH OUT →', { size: 34, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  const cOut = rcpChip(Lfg, '**oxygen** leaves through the **stomata**', { size: 32, boldFill: '#FF9A8F' });

  /* ================= oxygen comes from water ================= */
  const splitG = G(Lfg);
  const sO = [0, 1].map(() => E('circle', { r: 22, fill: ball(C.oxygen, C.oxygenDk), stroke: C.oxygenDk, 'stroke-width': 2 }, splitG));
  const sH = [0, 1, 2, 3].map(() => E('circle', { r: 13, fill: ball(C.hydrogen, C.hydrogenDk), stroke: C.hydrogenDk, 'stroke-width': 2 }, splitG));
  const sSpk = spark(splitG, 26, { seed: 6 });
  const sLblO2 = rcpRich(splitG, 806, 470, 'O_2', { size: 40, fill: '#FF9A8F' });
  const sLblH = rcpChip(splitG, 'H: goes into glucose', { size: 26, color: C.muted });
  const cFromW = rcpChip(Lfg, 'the oxygen comes from **WATER**', { size: 36, boldFill: '#7FDBFF' });
  const noCO2 = G(Lfg);
  E('rect', { x: -110, y: -40, width: 220, height: 80, rx: 14, fill: 'rgba(10,27,39,0.9)', stroke: C.line, 'stroke-width': 3 }, noCO2);
  rcpRich(noCO2, 0, 14, 'CO_2 → O_2', { size: 38 });
  const noX = cross(noCO2, 30, '#FF3B4E');
  const cNotC = rcpChip(Lfg, 'not from carbon dioxide', { size: 30, color: '#FF9A8F' });

  /* ================= Kavya's desk ================= */
  const deskShot = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#F2E4D2', '#E2CDB6', true) }, deskShot);
  E('rect', { x: -20, y: 90, width: 520, height: 330, fill: linGrad('#6EC3F5', '#D2F0FF', true), stroke: '#FFFFFF', 'stroke-width': 16 }, deskShot);
  E('path', { d: 'M40,420 V260 h140 v160 M240,420 V200 h150 v220', fill: '#F2EEE6', stroke: '#9C927C', 'stroke-width': 3 }, deskShot);
  E('path', { d: 'M760,560 h460 v30 h-460 Z M800,590 h34 v170 h-34 Z', fill: '#B07A45', stroke: SC_INK, 'stroke-width': 4 }, deskShot);
  const cards = G(Lfg), CW = ['Cars', "Won't", 'Go', 'On', 'Grass'], CC = ['#4C5866', '#1D84A6', '#B57B12', '#C2453A', '#2C8C4C'];
  const cardEls = CW.map((w, i) => {
    const g = G(cards);
    E('rect', { x: -70, y: -58, width: 140, height: 116, rx: 10, fill: '#FFFFFF', stroke: '#C9D3DC', 'stroke-width': 3 }, g);
    const tx = E('text', { x: 0, y: 16, 'font-size': 38, 'font-weight': 700, 'text-anchor': 'middle', 'font-family': FD, fill: '#5A6B7A' }, g);
    const a = E('tspan', { 'font-size': 60, 'font-weight': 800, fill: CC[i] }, tx); a.textContent = w[0];
    const b = E('tspan', {}, tx); b.textContent = w.slice(1);
    return g;
  });
  const TERMS = [['carbon\ndioxide', '#4C5866'], ['water', '#1D84A6'], ['glucose', '#B57B12'], ['oxygen', '#C2453A']];
  const termEls = TERMS.map(([s, c]) => T(cards, 0, 0, s, { size: 30, weight: 800, anchor: 'middle', fill: c }));
  const grass = E('path', { d: 'M-40,0 l10,-34 l8,30 l10,-40 l8,40 l10,-30 l8,34 Z', fill: '#5BBF6A', stroke: '#2C8C4C', 'stroke-width': 3 }, cards);
  const recipe = G(Lfg);
  E('rect', { x: -270, y: -170, width: 540, height: 340, rx: 10, fill: '#FFFDF4', stroke: '#C9B53A', 'stroke-width': 4 }, recipe);
  E('path', { d: 'M-240,-70 H240 M-240,0 H240 M-240,70 H240 M-240,140 H240', stroke: '#BFD3E6', 'stroke-width': 2 }, recipe);
  E('line', { x1: -190, y1: -170, x2: -190, y2: 170, stroke: '#F2A0A0', 'stroke-width': 3 }, recipe);
  T(recipe, 0, -110, 'INGREDIENTS', { size: 44, weight: 800, anchor: 'middle', fill: '#C2453A' });
  const ing = [['carbon dioxide ✓', '#4C5866'], ['water ✓', '#1D84A6'], ['sunlight?', '#B07A00']].map(([s, c], i) => T(recipe, -160, -16 + i * 70, s, { size: 40, weight: 800, fill: c }));
  const sunHi = E('rect', { x: -170, y: 104, width: 220, height: 44, rx: 8, fill: '#FFE45C', opacity: 0.6 }, recipe);
  recipe.insertBefore(sunHi, ing[2]);

  /* ================= the whiteboard ================= */
  const bd = G(Lmid);   // everything on the board (the talent shot zooms it)
  const board = phBoard(bd, 1060, 400); tr(board, 600, 330);
  const ROWY = 270;
  // word equation
  const wordRow = G(bd);
  const WSZ = 38;
  const mkWord = (s, c) => { const t = T(wordRow, 0, 0, s, { size: WSZ, weight: 800, anchor: 'middle', fill: c }); return { el: t, w: textWidth(s, WSZ, FD, 800) }; };
  const mkPlus = () => { const t = T(wordRow, 0, 0, '+', { size: WSZ, weight: 700, anchor: 'middle', fill: '#8A96A3' }); return { el: t, w: 30 }; };
  const W = { co2: mkWord('carbon dioxide', '#4C5866'), p1: mkPlus(), water: mkWord('water', '#1D84A6'), pS: mkPlus(), glu: mkWord('glucose', '#B57B12'), p2: mkPlus(), oxy: mkWord('oxygen', '#C2453A') };
  { const g = G(wordRow); arrow(g, -80, -12, 80, -12, { color: SC_INK, width: 7 }); W.arr = { el: g, w: 170 }; }
  { const g = G(wordRow), c = chip(g, 'sunlight', { size: 34, fill: '#FFE45C', color: '#5A4100', stroke: '#B07A00', sw: 3 }); const s = sun(g, 14); tr(s, -c.w / 2 - 6, 0); tr(c, 12, -12); W.sun = { el: g, w: c.w + 40, s }; }
  const lChl = T(wordRow, 0, 0, 'chlorophyll', { size: 30, weight: 800, anchor: 'middle', fill: '#1F7A3E' });
  const KA = ['co2', 'p1', 'water', 'pS', 'sun', 'arr', 'glu', 'p2', 'oxy'], KB = ['co2', 'p1', 'water', 'arr', 'glu', 'p2', 'oxy'];
  const LA = rcpRow(KA.map(k => W[k].w), 16), LB = rcpRow(KB.map(k => W[k].w), 20);
  const sA = Math.min(1, 1010 / LA.tot), sB = Math.min(1, 1010 / LB.tot);
  const posA = {}, posB = {}; KA.forEach((k, i) => posA[k] = LA.xs[i] * sA); KB.forEach((k, i) => posB[k] = LB.xs[i] * sB);
  const cLightSrc = rcpChip(bd, 'light = the **energy source**, not a reactant', { size: 30 });
  const rX = G(bd); cross(rX, 34, '#E8424F');
  // symbol equation
  const symRow = G(bd);
  const symHead = T(bd, 600, 186, 'BALANCED SYMBOL EQUATION', { size: 30, weight: 800, anchor: 'middle', fill: '#8A96A3', ls: 2 });
  const SSZ = 54, COEF = '#E59400';
  const mkSym = s => { const t = phChem(symRow, 0, 0, s, { size: SSZ, fill: SC_INK, coef: COEF }); return { el: t, w: t.w }; };
  const Y = { c1: mkSym('6CO_2'), p1: { el: T(symRow, 0, 0, '+', { size: SSZ, weight: 700, anchor: 'middle', fill: '#8A96A3' }), w: 36 }, c2: mkSym('6H_2O'),
    c3: mkSym('C_6H_12O_6'), p2: { el: T(symRow, 0, 0, '+', { size: SSZ, weight: 700, anchor: 'middle', fill: '#8A96A3' }), w: 36 }, c4: mkSym('6O_2') };
  { const g = G(symRow); arrow(g, -70, -16, 70, -16, { color: SC_INK, width: 7 });
    T(g, 0, -46, 'light', { size: 26, weight: 800, anchor: 'middle', fill: '#B07A00' }); T(g, 0, 28, 'chlorophyll', { size: 26, weight: 800, anchor: 'middle', fill: '#1F7A3E' });
    Y.arr = { el: g, w: 160 }; }
  const KS = ['c1', 'p1', 'c2', 'arr', 'c3', 'p2', 'c4'], LS = rcpRow(KS.map(k => Y[k].w), 22);
  const posS = {}; KS.forEach((k, i) => { posS[k] = 600 + LS.xs[i]; tr(Y[k].el, posS[k], ROWY); });
  const coefSpans = [Y.c1, Y.c2, Y.c4].map(o => o.el.querySelector('tspan[fill]')).filter(Boolean);
  // atom counters and the ghost
  const cnt = G(bd);
  const CNT = [['C', C.carbon, C.carbonDk, '6'], ['H', C.hydrogen, C.hydrogenDk, '12'], ['O', C.oxygen, C.oxygenDk, '18']].map(([a, c, dk, n], i) => {
    const g = G(cnt); tr(g, 260 + i * 340, 452);
    E('circle', { cx: -110, cy: -12, r: 20, fill: ball(c, dk), stroke: dk, 'stroke-width': 2 }, g);
    T(g, -110, -2, a, { size: 24, weight: 800, anchor: 'middle', fill: a === 'H' ? '#3B4A57' : '#FFFFFF' });
    T(g, 10, 0, `${n} = ${n}`, { size: 40, weight: 800, anchor: 'middle', fill: SC_INK });
    const ok = tick(g, 16); tr(ok, 112, -12);
    return { g, ok };
  });
  const cntHead = T(cnt, 600, 508, 'atoms on the left = atoms on the right', { size: 26, weight: 700, anchor: 'middle', fill: '#5A6B7A' });
  const ghost = G(bd);
  phChem(ghost, 600, 458, 'CO_2 + H_2O → C_6H_12O_6 + O_2', { size: 40, fill: '#9AA6B2' });
  const ghostBad = rcpChip(ghost, "**doesn't balance** ✗", { size: 28, boldFill: '#FF6070' }); tr(ghostBad, 600, 508);
  const tag = G(Lfg);
  E('path', { d: 'M-80,-26 L64,-26 L84,0 L64,26 L-80,26 Z', fill: '#FFF8C4', stroke: '#C9B53A', 'stroke-width': 3 }, tag);
  T(tag, -6, -3, 'VERY', { size: 26, weight: 800, anchor: 'middle', fill: '#C2453A' });
  T(tag, -6, 21, 'EXPENSIVE', { size: 20, weight: 800, anchor: 'middle', fill: '#C2453A' });
  const spot = E('path', { d: 'M560,40 L640,40 L760,520 L440,520 Z', fill: '#FFF3A0', opacity: 0.3 }, null); root.insertBefore(spot, Lcast);   // over the board, under the cast
  const spotSun = sun(Lfg, 24);
  const spotLbl = T(Lfg, 0, 0, 'light', { size: 34, weight: 800, anchor: 'middle', fill: '#FFE45C' });
  const cTalent = rcpChip(Lfg, 'needed, but **not used up**', { size: 36 });

  /* ================= the cast ================= */
  const guards = cast(Lcast, 'guards', { mood: 'deadpan' });
  const kav = cast(Lcast, 'kavya', { mood: 'happy' });
  const cosmo = cast(Lcast, 'cosmo', { mood: 'smug' });
  const dewi = cast(Lcast, 'dewi', { mood: 'happy' });
  const olive = cast(Lcast, 'olive', { mood: 'deadpan' });
  const gus = cast(Lcast, 'gus', { mood: 'happy' });
  const clive = cast(Lcast, 'clive', { mood: 'deadpan' });
  const phyl = cast(Lcast, 'phyllis', { mood: 'smug' });
  Lcast.appendChild(tag);
  const lt = { gus: phLower(Lhud, 'gus'), olive: phLower(Lhud, 'olive') };

  /* ================= cut points ================= */
  const SH = [['go', -1e9], ['join', at('join') - 0.1], ['gus', at('gus') - 0.1], ['conf', at('thgus') - 0.1], ['olive', at('olive') - 0.1],
    ['door', at('rubbish') - 0.1], ['mine', at('mine') - 0.1], ['word', at('word') - 0.1], ['cars', at('cars') - 0.1], ['sun', at('sun') - 0.1],
    ['react', end('sun') + 0.08], ['arrow', at('arrow') - 0.1], ['talent', at('talent') - 0.1], ['eq', at('eq') - 0.1]];
  const shotAt = t => { let k = 0; for (let i = 0; i < SH.length; i++) if (t >= SH[i][1]) k = i; return SH[k]; };
  const FAC = { go: 1, gus: 1, olive: 1, mine: 1, word: 1, react: 1, arrow: 1, talent: 1, eq: 1 };
  const BOARD = { word: 1, arrow: 1, talent: 1, eq: 1 };

  return t => {
    const [sid, s0] = shotAt(t);
    op(facShot, FAC[sid] ? 1 : 0); op(portShot, sid === 'join' ? 1 : 0); op(doorShot, sid === 'door' ? 1 : 0); op(deskShot, sid === 'cars' || sid === 'sun' ? 1 : 0);
    conf.set(sid === 'conf' ? 1 : 0, t);
    [mach, console_, cGlu, cOx, cJoin, bigGlu, lunch, cChem, cLunch, cOut, splitG, cFromW, noCO2, cNotC, cards, recipe, bd, tag, spot, spotSun, spotLbl, cTalent,
      ...gusSpk, ...pSparks, ...mCO2, ...mH2O, ...mO2, smallGlu].forEach(e => op(e, 0));
    [guards, kav, cosmo, dewi, olive, gus, clive, phyl].forEach(c => op(c, 0));
    Object.values(lt).forEach(l => l.set(0));
    Lmid.removeAttribute('transform');
    const show = (c, x, y, s, st, r) => { op(c, 1); tr(c, x, y, s, r); c.set(Object.assign({ t }, st)); };
    const talk = w => scTalk(S, t, w);

    /* ---------- factory floor with the machine (go, gus, olive) ---------- */
    if (FAC[sid]) {
      fac.set({ t, light: 1, belt: sid === 'go' || sid === 'gus' || sid === 'olive' ? 70 : 20 });
      let dim = 0;
      if (sid === 'mine') dim = 0.5;
      if (BOARD[sid]) dim = 0.55;
      dark.setAttribute('opacity', dim.toFixed(3));
      rcpCam(facWrap, 1, 600, 375, 600, 375);
    }
    if (sid === 'go' || sid === 'gus' || sid === 'olive') {
      op(mach, 1); op(console_, 1);
      const pull = sid === 'go' ? P(t, mid('go', 0.62), 0.3) : 1;
      tr(lever, 350, 430, 1, lerp(-40, 40, pull)); const la = lerp(-40, 40, pull) * Math.PI / 180; attr(knob, 'cx', 350 + Math.sin(la) * 52); attr(knob, 'cy', 430 - Math.cos(la) * 52);
      const glowOn = sid === 'go' ? P(t, mid('go', 0.25), 0.5, linear) : 1;
      op(beam, 0.15 + 0.25 * glowOn); op(portGlow, glowOn * (0.6 + 0.4 * wave(t, 0.7)));
      mLamps.forEach((l, i) => attr(l, 'fill', glowOn > 0.5 && Math.sin(t * 6 + i * 2) > 0 ? '#56D69B' : '#FF6060'));
      const phMood = sid === 'go' && t < mid('go', 0.3) ? 'neutral' : 'smug';
      show(phyl, 640, 232, 0.62, { talk: talk('phyllis'), mood: phMood, look: sid === 'go' ? -0.6 : 0.6 });
      let cLook = 0.6, cMood = 'neutral';
      if (sid === 'go') {
        cLook = t < mid('go', 0.45) ? 0.7 : 0.2;
        // Dewi and Cosmo ride the belt into the intake
        const ride = (c, who, x0, t0, s, mood) => {
          const x = lerp(x0, 470, P(t, t0, end('go') + 0.4 - t0, linear));
          const inn = clamp((x - 400) / 70);
          if (inn < 1) show(c, x, 640 - 94 * s * (1 - 0.5 * inn), s * (1 - 0.7 * inn), { talk: talk(who), mood, look: 1 });
          op(c, 1 - inn);
        };
        ride(dewi, 'dewi', 250, at('go') - 0.2, 0.42, 'happy');
        ride(cosmo, 'cosmo', 40, at('go') - 0.2, 0.42, 'smug');
      }
      if (sid === 'gus' || sid === 'olive') {
        cMood = 'deadpan';
        const gp = P(t, at('gus') - 0.05, 0.6, pop), rideG = (t - at('gus') - 0.6) * 22;
        const gx = lerp(830, 900, clamp(gp)) + Math.max(0, rideG), gy = lerp(560, 584, clamp(gp)) - Math.abs(Math.sin(t * 5)) * 10 * AMP;
        const lookG = sid === 'olive' ? -1 : Math.sin(t * 2.4);
        show(gus, Math.min(gx, 1060), gy, 0.6 * Math.max(0.05, gp), { talk: talk('gus'), mood: 'happy', look: lookG });
        cLook = 1;
        gusSpk.forEach((s, i) => { op(s, sid === 'gus' ? 1 : 0); tr(s, Math.min(gx, 1060) + [-70, 74][i], gy - [50, 30][i]); s.upd(t); });
        if (sid === 'gus') {
          lt.gus.set(win(t, at('gus') + 0.2, at('gus') + 3.5, 0.3));
          rcpPop(cGlu, P(t, mid('gus', 0.28), 0.45, pop), 960, 420);
        } else {
          const op_ = P(t, at('olive') - 0.05, 0.7, easeOut);
          show(olive, lerp(800, 860, op_), lerp(560, 592, op_), 0.55 * Math.max(0.05, op_), { talk: talk('olive'), mood: 'deadpan', look: -0.3 }, 10);
          lt.olive.set(win(t, at('olive') + 0.2, at('olive') + 3.3, 0.3));
          rcpPop(cOx, P(t, mid('olive', 0.45), 0.45, pop), 930, 420);
        }
      }
      show(clive, 200, 420, 0.8, { talk: talk('clive'), mood: cMood, look: cLook });
    }

    /* ---------- the porthole ---------- */
    if (sid === 'join') {
      const fuse = mid('join', 0.66);
      const q = P(t, at('join'), fuse - at('join'), ease);
      op(pBeam, 0.2 + 0.15 * wave(t, 0.8));
      pSparks.forEach((s, i) => { const f = ((t * 0.45) + i / 3) % 1; op(s, t < fuse + 0.4 ? Math.sin(Math.PI * f) : 0); tr(s, 560 + i * 40, 80 + f * 280); s.upd(t); });
      const ring = (i, n, R) => [600 + Math.cos(i / n * TAU + t * 0.6) * R, 360 + Math.sin(i / n * TAU + t * 0.6) * R];
      mCO2.forEach((m, i) => { const [x, y] = ring(i, 6, 60); const sx = 410, sy = 240 + i * 46; tr(m, lerp(sx, x, q), lerp(sy, y, q), 1, t * 40 + i * 30); op(m, 1 - P(t, fuse, 0.25, linear)); });
      mH2O.forEach((m, i) => { const [x, y] = ring(i + 0.5, 6, 110); const sx = 790, sy = 240 + i * 46; tr(m, lerp(sx, x, q), lerp(sy, y, q), 1, -t * 40 + i * 30); op(m, 1 - P(t, fuse, 0.25, linear)); });
      const fl = P(t, fuse - 0.1, 0.6, linear);
      op(flashP, Math.sin(Math.PI * fl)); tr(flashP, 0, 0, 0.6 + fl);
      rcpPop(bigGlu, P(t, fuse + 0.05, 0.5, pop), 600, 360, 1, (t * 10) % 360 * (S.reduce ? 0.3 : 1));
      rcpPop(cJoin, P(t, mid('join', 0.2), 0.45, pop), 600, 700);
    }

    /* ---------- confessional: Gus is a packed lunch ---------- */
    if (sid === 'conf') {
      const k = 1 + 0.1 * P(t, end('thgus') - 0.2, at('olive') - end('thgus'), linear);
      rcpCam(conf, k, 430, 380, 430, 380);
      show(clive, 430 + 0 * k, 380 + 20 * k, 1.5 * k, { talk: talk('clive'), mood: 'deadpan', look: t > mid('thgus', 0.75) && t < end('thgus') ? 0.7 : 0 });
      rcpPop(cChem, P(t, mid('thgus', 0.28), 0.45, pop), 860, 560);
      rcpPop(lunch, P(t, mid('thgus', 0.72), 0.5, pop), 880, 300, 1, -4); lSpk.upd(t);
      rcpPop(cLunch, P(t, mid('thgus', 0.8), 0.45, pop), 880, 450);
    }

    /* ---------- the stoma door: Olive put out ---------- */
    if (sid === 'door') {
      let open = t < mid('rubbish', 0.38) ? 0 : P(t, mid('rubbish', 0.38), 0.5);
      open *= 1 - P(t, end('rubbish') + 0.15, 0.5);
      op(guards, 1); tr(guards, 600, 380, 1.5);
      guards.set({ t, talk: 0, mood: 'deadpan', look: 0, open, still: true });
      const out = P(t, mid('rubbish', 0.45), end('rubbish') - mid('rubbish', 0.45), easeIn);
      if (out < 0.99) show(olive, 600, lerp(570, 380, out), 0.85 * (1 - 0.94 * out), { talk: talk('olive'), mood: 'sad', look: 0 }, 120 * out);
      rcpPop(cOut, P(t, mid('rubbish', 0.5), 0.45, pop), 600, 690);
    }

    /* ---------- oxygen comes from water ---------- */
    if (sid === 'mine') {
      show(dewi, 210, 450, 0.95, { talk: talk('dewi'), mood: 'happy', look: 0.6 });
      op(splitG, P(t, at('mine'), 0.3, linear));
      const sp = P(t, mid('mine', 0.4), 0.9), pair = P(t, mid('mine', 0.62), 0.7);
      const O0 = [[520, 320], [520, 470]], OP = [[540, 395], [580, 395]], OF = [[783, 400], [829, 400]];
      sO.forEach((o, i) => { const x = lerp(lerp(O0[i][0], OP[i][0], sp), OF[i][0], pair), y = lerp(lerp(O0[i][1], OP[i][1], sp), OF[i][1], pair); attr(o, 'cx', x.toFixed(1)); attr(o, 'cy', y.toFixed(1)); });
      sH.forEach((h, i) => { const m = i < 2 ? 0 : 1, sd = i % 2 ? 1 : -1, x0 = O0[m][0] + sd * 21, y0 = O0[m][1] + 16;
        const x = lerp(x0, 640 + i * 28, sp), y = lerp(y0, 230 - (i % 2) * 10, sp); attr(h, 'cx', x.toFixed(1)); attr(h, 'cy', y.toFixed(1)); op(h, 1 - 0.4 * sp); });
      op(sSpk, win(t, mid('mine', 0.36), mid('mine', 0.6), 0.15)); tr(sSpk, 520, 395); sSpk.upd(t);
      op(sLblO2, pair); op(sLblH, P(t, mid('mine', 0.55), 0.3, linear)); tr(sLblH, 640, 180);
      rcpPop(cFromW, P(t, mid('mine', 0.68), 0.45, pop), 760, 560);
      const cx = P(t, mid('mine', 0.8), 0.4, pop);
      show(cosmo, 1050, 600, 0.5, { talk: 0, mood: cx > 0.5 ? 'annoyed' : 'neutral', look: -1 });
      rcpPop(noCO2, cx, 1050, 440); op(noX, P(t, mid('mine', 0.86), 0.2, linear));
      rcpPop(cNotC, P(t, mid('mine', 0.9), 0.45, pop), 1000, 690);
    }

    /* ---------- the whiteboard ---------- */
    if (BOARD[sid]) {
      op(bd, 1);
      const isSym = sid === 'eq';
      op(wordRow, isSym ? 0 : 1); op(symRow, isSym ? 1 : 0); op(symHead, isSym ? P(t, at('eq'), 0.3, linear) : 0);
      op(cnt, 0); op(ghost, 0); op(cLightSrc, 0); op(rX, 0);
      // where each cast member stands, under its term
      let under = {};
      if (!isSym) {
        // layout A (sunlight as an ingredient) -> B (sunlight over the arrow)
        let m = 1;
        if (sid === 'arrow') m = P(t, mid('arrow', 0.3), 0.8);
        const sc = lerp(sA, sB, m);
        wordRow.setAttribute('transform', `translate(600 ${ROWY}) scale(${sc.toFixed(4)})`);
        const X = k => lerp(posA[k] / sA, posB[k] / sB, m);   // unscaled row coordinates
        KB.forEach(k => tr(W[k].el, X(k), 0));
        const pS = sid === 'arrow' ? 1 - m : 0; op(W.pS.el, pS); tr(W.pS.el, posA.pS / sA, 0);
        const onSun = sid === 'arrow' || sid === 'talent';
        const lift = Math.sin(Math.PI * m) * -60;
        op(W.sun.el, onSun ? (sid === 'talent' ? 1 - P(t, s0, 0.3, linear) : 1) : 0);
        tr(W.sun.el, lerp(posA.sun / sA, X('arr'), m), lerp(0, -62, m) + lift, lerp(1, 0.85, m));
        W.sun.s.upd(t);
        op(lChl, sid === 'talent' ? 1 : sid === 'arrow' ? P(t, mid('arrow', 0.74), 0.3, linear) : 0); tr(lChl, X('arr'), 52);
        if (sid === 'word') {
          const F = { co2: 0.14, p1: 0.3, water: 0.34, arr: 0.46, glu: 0.55, p2: 0.72, oxy: 0.76 };
          KB.forEach(k => { const p = P(t, mid('word', F[k]), 0.4, pop); op(W[k].el, clamp(p * 2.5)); });
        } else KB.forEach(k => op(W[k].el, 1));
        if (sid === 'arrow') {
          const xp = win(t, at('arrow') + 0.05, mid('arrow', 0.3), 0.15);
          op(rX, xp); tr(rX, 600 + posA.sun, ROWY - 12);
          rcpPop(cLightSrc, P(t, mid('arrow', 0.45), 0.45, pop), 600, 452);
        }
        const toS = k => 600 + X(k) * sc;
        under = { cosmo: toS('co2'), dewi: toS('water'), gus: toS('glu'), olive: toS('oxy') };
      } else {
        const F = { c1: 0.3, p1: 0.41, c2: 0.44, arr: 0.58, c3: 0.62, p2: 0.85, c4: 0.88 };
        KS.forEach(k => { const p = P(t, mid('eq', F[k]), 0.4, pop); op(Y[k].el, clamp(p * 2.5)); });
        under = { cosmo: posS.c1, dewi: posS.c2, gus: posS.c3, olive: posS.c4 };
        // molecules under the terms
        const grid = (arr, cx, t0, dx) => arr.forEach((m, i) => { const p = P(t, t0 + i * 0.1, 0.35, pop); rcpPop(m, p, cx + ((i % 3) - 1) * dx, 335 + Math.floor(i / 3) * 44); });
        grid(mCO2, posS.c1, at('six') + 0.05, 54); grid(mH2O, posS.c2, at('sixw') + 0.05, 44); grid(mO2, posS.c4, at('one') + 0.6, 44);
        rcpPop(smallGlu, P(t, at('one') + 0.1, 0.4, pop), posS.c3, 356);
        // count the atoms
        const cOn = t > at('count') - 0.1;
        op(cnt, cOn ? 1 - P(t, mid('count', 0.74), 0.3, linear) : 0);
        CNT.forEach((c, i) => { op(c.g, P(t, mid('count', [0.1, 0.22, 0.37][i]), 0.3, linear)); const k = P(t, mid('count', 0.52 + i * 0.03), 0.3, pop); op(c.ok, clamp(k * 2.5)); tr(c.ok, 112, -12, Math.max(0.01, k)); });
        op(cntHead, P(t, mid('count', 0.55), 0.3, linear));
        const fl = t > mid('count', 0.64) ? 0.5 + 0.5 * Math.sin((t - mid('count', 0.64)) * 9) : 0;
        coefSpans.forEach(sp => sp.setAttribute('fill', fl > 0 ? phMix(COEF, '#E8424F', fl) : COEF));
        op(ghost, P(t, mid('count', 0.78), 0.35, linear)); op(ghostBad, P(t, mid('count', 0.9), 0.3, linear));
      }
      // the cast underneath the board (talent shot: Phyllis instead)
      if (sid !== 'talent') {
        const sp = scWho(S, t);
        const hop = w => (sp === w ? Math.abs(Math.sin(t * 6)) * 12 * AMP : 0);
        const appear = k => sid === 'word' ? P(t, mid('word', { cosmo: 0.14, dewi: 0.34, gus: 0.55, olive: 0.76 }[k]), 0.4, pop) : 1;
        const big = sid === 'eq' && t > at('one') - 0.1 ? P(t, at('one') - 0.1, 0.4, pop) : 0;
        const gm = sid === 'eq' && t > at('one') - 0.1 ? (t < mid('one', 0.45) ? 'shock' : 'happy') : 'happy';
        show(cosmo, under.cosmo, 650 - hop('cosmo'), 0.36 * Math.max(0.01, appear('cosmo')), { talk: talk('cosmo'), mood: 'smug', look: 0 });
        show(dewi, under.dewi, 650 - hop('dewi'), 0.36 * Math.max(0.01, appear('dewi')), { talk: talk('dewi'), mood: 'happy', look: 0 });
        show(gus, under.gus, 650 - hop('gus') - 20 * big, (0.36 + 0.16 * big) * Math.max(0.01, appear('gus')), { talk: talk('gus'), mood: gm, look: 0 });
        show(olive, under.olive, 650, 0.36 * Math.max(0.01, appear('olive')), { talk: 0, mood: 'deadpan', look: 0 });
        rcpPop(tag, big, under.gus - 140, 640, 1, -8 + 4 * Math.sin(t * 3) * AMP);
        const cm = sid === 'arrow' && t < mid('arrow', 0.3) ? 'annoyed' : 'deadpan';
        show(clive, 1110, 655, 0.42, { talk: talk('clive'), mood: cm, look: -1 });
      } else {
        // the arrow is a stage: zoom in on it
        const k = 1.9, ax = 600 + posB.arr;
        const push = 1 + 0.06 * P(t, end('talent') - 0.2, at('eq') - end('talent'), linear);
        rcpCam(Lmid, k * push, ax, ROWY - 12, 600, 470);
        op(spot, 0.3);
        show(phyl, 600, 470 - 70 * push, 0.72 * push, { talk: talk('phyllis'), mood: 'smug', look: 0 });
        rcpPop(spotSun, P(t, at('talent'), 0.4, pop), 520, 160); spotSun.upd(t);
        op(spotLbl, P(t, at('talent') + 0.2, 0.3, linear)); attr(spotLbl, 'x', 600); attr(spotLbl, 'y', 172);
        tr(spotLbl, 40, 0);
        rcpPop(cTalent, P(t, mid('talent', 0.4), 0.45, pop), 600, 690);
      }
    }

    /* ---------- Kavya's desk: flashcards, then the recipe card ---------- */
    if (sid === 'cars' || sid === 'sun') {
      const k = 1 + 0.05 * P(t, s0, 4, linear);
      show(kav, 990, 560, 1.35 * k, { talk: talk('kavya'), mood: sid === 'cars' ? 'happy' : (t < mid('sun', 0.6) ? 'happy' : 'smug'), look: -0.5 });
      if (sid === 'cars') {
        op(cards, 1);
        const XC = [105, 255, 405, 555, 705];
        cardEls.forEach((c, i) => rcpPop(c, P(t, mid('cars', 0.02 + i * 0.07), 0.4, pop), XC[i], 250, 1, (i % 2 ? 3 : -3)));
        termEls.forEach((e, i) => { op(e, P(t, mid('cars', 0.52 + i * 0.11), 0.3, linear)); attr(e, 'x', XC[i]); attr(e, 'y', i === 0 ? 352 : 370); e.querySelectorAll('tspan').forEach(sp => attr(sp, 'x', XC[i])); });
        op(grass, P(t, mid('cars', 0.33), 0.3, linear)); tr(grass, XC[4] + 10, 350);
      } else {
        rcpPop(recipe, P(t, at('sun') - 0.05, 0.45, pop), 420, 330, 1, -2);
        ing.forEach((e, i) => op(e, P(t, mid('sun', [0.12, 0.3, 0.72][i]), 0.3, linear)));
        op(sunHi, P(t, mid('sun', 0.78), 0.3, linear));
      }
    }

    /* ---------- the 1 s pause: Clive ---------- */
    if (sid === 'react') {
      const k = 1 + 0.12 * P(t, s0, at('arrow') - s0, linear);
      rcpCam(facWrap, k, 600, 420, 600, 420);
      show(clive, 600, 440, 1.7 * k, { talk: 0, mood: 'deadpan', look: 0 });
    }
  };
});
