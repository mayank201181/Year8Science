/* Chapter 3: Groups and periods.
   The table on the left two-thirds, atom diagrams on the right, the key sentence in the strip under the table.
   Beats: a sweep down Group 1 -> Li, Na and K atoms, one outer electron each -> each fizzes the same way:
   similar properties -> the group numbers light; Na has 1 outer electron, Cl has 7 -> a sweep across
   Period 3: period number = shells -> across Period 3 one atom fills its third shell from 1 to 8
   (showpiece) -> chlorine: up its column to Group 7, along its row to Period 3 -> calcium: Group 2,
   Period 4 -> groups go down, periods go across -> a mystery Group 1 element: a reactive metal. */
scene('groups', S => {
  const { at, end, mid } = S, root = S.root;
  const ORB = S.reduce ? 3 : 18;
  const LIME = '#B5E655', ORANGE = C.heat, AMBER = C.glucose;

  /* ---------- local helpers ---------- */
  function rich(parent, x, y, segs, o) {
    o = o || {};
    const t = E('text', { x, y, 'font-size': o.size || 30, 'font-weight': o.weight || 600, 'font-family': o.font || FD, 'text-anchor': o.anchor || 'start', fill: o.fill || C.ink }, parent);
    segs.forEach(s => { if (typeof s === 'string') s = [s]; E('tspan', { fill: s[1], 'font-weight': s[2] }, t).textContent = s[0]; });
    return t;
  }
  const plain = segs => segs.map(s => (typeof s === 'string' ? s : s[0])).join('');
  const fit = (segs, size, maxW) => { const w = textWidth(plain(segs), size, FD, 700); return w > maxW ? Math.floor(size * maxW / w) : size; };
  /* a key sentence for the strip under the table (one or two lines) */
  function caption(lines, size) {
    const g = G(root);
    lines.forEach((segs, i) => rich(g, 66, 588 + i * 50, segs, { size: fit(segs, size || 34, 750), fill: C.ink }));
    op(g, 0); return g;
  }
  /* a little trough of water with a lump of metal fizzing in it */
  function fizzIcon(parent, seed) {
    const g = G(parent);
    E('rect', { x: -44, y: -4, width: 88, height: 36, rx: 9, fill: 'rgba(76,201,240,0.42)' }, g);
    E('line', { x1: -42, y1: -4, x2: 42, y2: -4, stroke: '#BFEAFA', 'stroke-width': 2.5 }, g);
    E('path', { d: 'M-47,-24 L-47,26 Q-47,36 -37,36 L37,36 Q47,36 47,26 L47,-24', fill: 'none', stroke: '#CFE7F5', 'stroke-width': 4, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, g);
    g.lump = E('rect', { x: -13, y: -12, width: 26, height: 13, rx: 5, fill: ball('#E4EBF0', '#8F9CAB'), stroke: '#8F9CAB', 'stroke-width': 1.5 }, g);
    g.bub = bubbles(g, -20, -58, 40, 52, { n: 8, r: 5.5, seed: seed || 3, speed: 1.0, color: '#E6F7FF', fill: 'rgba(255,255,255,0.25)' });
    return g;
  }
  /* symbol over electron arrangement, beside a small atom; .last is the outer-shell count */
  function tag(x, y, sym, arr, col) {
    const g = G(root);
    T(g, x, y - 4, sym, { size: 36, weight: 800, fill: col });
    const t = E('text', { x, y: y + 33, 'font-size': 32, 'font-weight': 700, 'font-family': FD, fill: C.ink }, g);
    const parts = arr.split(', ');
    E('tspan', {}, t).textContent = parts.slice(0, -1).join(', ') + ', ';
    g.last = E('tspan', {}, t); g.last.textContent = parts[parts.length - 1];
    g.note = T(g, x, y + 70, '', { size: 28, weight: 700, fill: C.energy });
    op(g, 0); return g;
  }
  function focusRing() { const r = E('rect', { x: -26, y: -26, width: 52, height: 52, rx: 10, fill: 'none', stroke: C.energy, 'stroke-width': 4 }, root); op(r, 0); return r; }
  /* an arrow with a dark outline, so it reads on top of the tiles */
  function bigArrow(x1, y1, x2, y2, col, w) {
    const g = G(root);
    const u = arrow(g, x1, y1, x2, y2, { color: C.bg0, width: (w || 6) + 6, head: (w || 6) * 3.4 + 8 });
    const a = arrow(g, x1, y1, x2, y2, { color: col, width: w || 6 });
    g.set = p => { u.set(p); a.set(p); };
    op(g, 0); return g;
  }

  /* ---------- the table ---------- */
  const GX = 66, GY = 200;
  const grid = ptGrid(root, { pitch: 42, symSize: 22 }); tr(grid, GX, GY);
  const gx = col => GX + grid.colX(col), gy = per => GY + grid.rowY(per);
  const tXY = z => { const [x, y] = grid.xy(z); return [GX + x, GY + y]; };
  // bright copies of the group numbers (columns 1, 2, 13-18) and period numbers, to light them up
  const GCOLS = [1, 2, 13, 14, 15, 16, 17, 18], GNUM = ['1', '2', '3', '4', '5', '6', '7', '0'];
  const gLab = GCOLS.map((c, i) => { const g = G(root); tr(g, gx(c), GY - 23); T(g, 0, 9, GNUM[i], { size: 26, weight: 800, anchor: 'middle', fill: C.energy }); op(g, 0); return g; });
  const pLab = [1, 2, 3, 4, 5, 6, 7].map(r => { const g = G(root); tr(g, GX - 24, gy(r)); T(g, 0, 9, String(r), { size: 26, weight: 800, anchor: 'middle', fill: C.energy }); op(g, 0); return g; });
  // the sweeping outlines: down Group 1, across Period 3
  const colBox = E('rect', { x: gx(1) - 26, y: gy(2) - 26, width: 52, height: 52, rx: 16, fill: 'none', stroke: ORANGE, 'stroke-width': 4 }, root);
  const rowBox = E('rect', { x: gx(1) - 26, y: gy(3) - 26, width: 52, height: 52, rx: 16, fill: 'none', stroke: C.energy, 'stroke-width': 4 }, root);
  op(colBox, 0); op(rowBox, 0);
  const rings = [focusRing(), focusRing(), focusRing()];
  // arrows from an element to its group number and its period number
  const clUp = bigArrow(gx(17), gy(3) - 26, gx(17), GY - 3, LIME), clLeft = bigArrow(gx(17) - 26, gy(3), GX - 4, gy(3), C.energy);
  const caUp = bigArrow(gx(2), gy(4) - 26, gx(2), GY - 3, AMBER), caLeft = bigArrow(gx(2) - 26, gy(4), GX - 4, gy(4), C.energy);
  // groups go down, periods go across
  const downA = bigArrow(gx(1), GY + 4, gx(1), GY + 290, ORANGE, 9), acrossA = bigArrow(GX - 2, gy(4), GX + 760, gy(4), C.energy, 9);
  const downLab = T(root, gx(1), 534, 'group', { size: 32, weight: 800, anchor: 'middle', fill: ORANGE });
  const acrossLab = T(root, GX + 770, gy(4) + 11, 'period', { size: 32, weight: 800, fill: C.energy });
  op(downLab, 0); op(acrossLab, 0);
  // the mystery element in Rubidium's place
  const [RBX, RBY] = tXY(37);
  const myst = G(root); tr(myst, RBX, RBY);
  const mystBox = E('rect', { x: -22, y: -22, width: 44, height: 44, rx: 6, fill: C.card2, stroke: '#FFFFFF', 'stroke-width': 2.5 }, myst);
  const mystQ = T(myst, 0, 9, '?', { size: 26, weight: 800, anchor: 'middle', fill: C.ink });
  op(myst, 0);

  /* ---------- the right-hand side: definitions and atoms ---------- */
  const defG = G(root);
  T(defG, 1010, 292, 'group', { size: 60, weight: 700, anchor: 'middle', fill: ORANGE });
  rich(defG, 1010, 342, ['= a ', ['vertical column', C.ink, 800]], { size: 30, anchor: 'middle', fill: C.muted });
  const defArrow = arrow(defG, 1010, 372, 1010, 452, { color: ORANGE, width: 8 });
  const defMore = G(defG);
  T(defMore, 1010, 512, 'same number of', { size: 28, weight: 600, anchor: 'middle', fill: C.muted });
  T(defMore, 1010, 548, 'outer-shell electrons', { size: 30, weight: 800, anchor: 'middle', fill: C.energy });

  const small = { radii: [20, 36, 52, 68], er: 8, nucleus: 'dot', nucR: 10 };
  const mk = (z, o) => { const g = G(root); const a = shellAtom(g, Object.assign({ z }, small, o || {})); op(g, 0); return { g, a }; };
  const li = mk(3), na = mk(11), k = mk(19);
  const YL = [236, 380, 562], YN = [262, 522];                       // Li, Na, K rows; Na and Cl for "number"
  const tagLi = tag(988, YL[0], 'Li', '2, 1', ORANGE), tagNa = tag(988, YL[1], 'Na', '2, 8, 1', ORANGE), tagK = tag(988, YL[2], 'K', '2, 8, 8, 1', ORANGE);
  const tagCl = tag(988, YN[1], 'Cl', '2, 8, 7', LIME);
  const fizz = YL.map((y, i) => { const f = fizzIcon(root, 5 + i); tr(f, 1110, y + 6); op(f, 0); return f; });
  const ringHi = YN.map(() => [0, 1, 2].map(kk => { const c = E('circle', { r: small.radii[kk], fill: 'none', stroke: C.energy, 'stroke-width': 4 }, root); op(c, 0); return c; }));
  // one atom on the right plays chlorine (small, for "number" and "period"), each Period 3 element, chlorine
  // again and calcium; its electron count only changes while it is faded out. Only calcium uses the 4th shell.
  const AX = 1000, AY = 318;
  const B = mk(20, { radii: [22, 40, 58, 76], er: 8.5, nucR: 11 });
  const ring4 = B.a.childNodes[0].childNodes[3];
  const bigLab = G(root);
  const blSym = E('text', { x: AX, y: 456, 'font-size': 40, 'font-weight': 800, 'font-family': FD, 'text-anchor': 'middle', fill: C.energy }, bigLab);
  const blSymT = E('tspan', {}, blSym), blName = E('tspan', { 'font-size': 30, 'font-weight': 600, fill: C.muted }, blSym);
  const blArr = E('text', { x: AX, y: 504, 'font-size': 36, 'font-weight': 700, 'font-family': FD, 'text-anchor': 'middle', fill: C.ink }, bigLab);
  const blArrHead = E('tspan', {}, blArr), blArrLast = E('tspan', { fill: C.energy }, blArr);
  const blNum = rich(bigLab, AX, 548, ['atomic number ', ['11', C.energy, 800]], { size: 28, anchor: 'middle', fill: C.muted });
  const blNumV = blNum.childNodes[1];
  op(bigLab, 0);
  // third-shell electron counts under Period 3's columns
  const P3 = [11, 12, 13, 14, 15, 16, 17, 18];
  const cnt = P3.map((z, i) => { const g = G(root); tr(g, tXY(z)[0], 524); E('circle', { r: 17, fill: C.card2, stroke: C.energy, 'stroke-width': 2.5 }, g); T(g, 0, 9, String(i + 1), { size: 24, weight: 800, anchor: 'middle', fill: C.energy }); op(g, 0); return g; });
  const cntLab = T(root, (gx(2) + gx(13)) / 2, 533, 'electrons in the third shell', { size: 28, weight: 600, anchor: 'middle', fill: C.muted });
  op(cntLab, 0);
  // the swapped-round mistake, struck out
  const trapG = G(root);
  const wrongs = ['groups go across', 'periods go down'].map((s, i) => {
    const y = 470 + i * 64, size = fit([s], 30, 230);
    const x = cross(trapG, 11); tr(x, 892, y - 10);
    T(trapG, 918, y, s, { size, weight: 600, fill: C.muted });
    return strike(trapG, 912, y - 10, 922 + textWidth(s, size, FD, 600), C.bad);
  });
  T(trapG, 1030, 414, 'not this way round', { size: 28, weight: 600, anchor: 'middle', fill: C.muted });
  // the mystery tile, close up
  const mBig = G(root); tr(mBig, AX, 310);
  const mBigBox = E('rect', { x: -70, y: -70, width: 140, height: 140, rx: 14, fill: C.card2, stroke: '#FFFFFF', 'stroke-width': 3 }, mBig);
  const mBigQ = T(mBig, 0, 30, '?', { size: 84, weight: 800, anchor: 'middle', fill: C.ink });
  const mChip = chip(root, 'Group 1', { size: 28, fill: C.card2, stroke: ORANGE, color: ORANGE }); tr(mChip, AX, 196);
  const mLab = T(root, AX, 432, 'reactive metal', { size: 38, weight: 800, anchor: 'middle', fill: ORANGE });
  const mFizz = fizzIcon(root, 9); tr(mFizz, AX, 530, 1.3);
  op(mBig, 0); op(mChip, 0); op(mLab, 0); op(mFizz, 0);

  /* ---------- the strip under the table ---------- */
  const capLnk = caption([['each has just ', ['one', C.energy, 800], ' outer electron']]);
  const capSim = caption([['same outer electrons'], ['→ ', ['similar chemical properties', C.energy, 800]]]);
  const capNum = caption([['main groups: ', ['group number', C.energy, 800], ' = number of ', ['outer electrons', C.energy, 800]]]);
  const capPer1 = caption([['a ', ['period', C.energy, 800], ' is a ', ['horizontal row', C.ink, 800]]]);
  const capPer2 = G(root); rich(capPer2, 66, 638, [['period number', C.energy, 800], ' = number of ', ['shells', C.energy, 800]], { size: 34 }); op(capPer2, 0);
  const capAcr = caption([['atomic number ', ['+1', C.energy, 800], ' each step, ', ['one more', C.energy, 800], ' electron']]);
  const capCl = caption([[['7', LIME, 800], ' outer electrons → ', ['Group 7', LIME, 800]], [['3', C.energy, 800], ' shells → ', ['Period 3', C.energy, 800]]]);
  const capCa = caption([[['2', AMBER, 800], ' outer electrons → ', ['Group 2', AMBER, 800]], [['4', C.energy, 800], ' shells → ', ['Period 4', C.energy, 800]]]);
  const capTrap = caption([[['groups', ORANGE, 800], ' go ', ['down', ORANGE, 800], ',  ', ['periods', C.energy, 800], ' go ', ['across', C.energy, 800]]]);
  const capPred = caption([['same group as Li, Na and K → a ', ['reactive metal', ORANGE, 800]]]);
  const capCl2 = capCl.childNodes[1], capCa2 = capCa.childNodes[1];

  /* ================= update ================= */
  return t => {
    const tSweep = mid('group', 0.16), tRow = mid('period', 0.04);
    const g1Out = 1 - P(t, at('period') - 0.1, 0.5, linear), g1Pred = P(t, at('predict') - 0.1, 0.5, linear);
    const STEP0 = mid('across', 0.08), STEP = 1.15;
    const step = clamp(Math.floor((t - STEP0) / STEP) + 1, 0, 7);           // 0 = Na ... 7 = Ar
    const aIn = P(t, at('across') - 0.2, 0.45, linear);
    // the right-hand atom's beats never overlap, so it fades right out before each change of element
    const inAcross = win(t, at('across') - 0.2, at('chlorine') - 0.2, 0.3);
    const clB = win(t, at('chlorine') - 0.15, at('calcium') - 0.2, 0.3), caB = win(t, at('calcium') - 0.15, at('trap') - 0.1, 0.3);
    const trB = win(t, at('trap') - 0.1, at('predict') - 0.1, 0.35), prB = P(t, at('predict') - 0.1, 0.4, linear);

    /* --- the table --- */
    const hi = [];
    [3, 11, 19, 37, 55, 87].forEach((z, i) => {
      const p = Math.max(P(t, tSweep + i * 0.16, 0.35, linear) * g1Out, z === 37 ? 0 : g1Pred);
      hi.push({ z, p, color: ORANGE });
    });
    hi.push({ group: 7, p: P(t, mid('number', 0.78), 0.5, linear) * g1Out, color: LIME });
    P3.forEach((z, i) => {
      const sweep = P(t, tRow + i * 0.1, 0.3, linear) * (1 - aIn);
      const acr = inAcross * (i < step ? 0.55 : i === step ? 1 : 0);
      hi.push({ z, p: Math.max(sweep, acr), color: C.energy, lift: inAcross > 0 ? i === step : true });
    });
    hi.push({ z: 17, p: clB, color: LIME }, { col: 17, p: clB * 0.45, color: LIME, lift: false }, { period: 3, p: clB * 0.35, color: C.energy, lift: false });
    hi.push({ z: 20, p: caB, color: AMBER }, { col: 2, p: caB * 0.45, color: AMBER, lift: false }, { period: 4, p: caB * 0.35, color: C.energy, lift: false });
    const dim = 0.6 * P(t, tSweep, 0.5, linear) - 0.35 * trB;
    grid.set({ reveal: 118 * P(t, at('group'), 1.0, linear), hi, dim });

    // sweeping outlines
    const cb = P(t, tSweep, 1.1);
    op(colBox, P(t, tSweep, 0.2, linear) * (1 - P(t, at('number') - 0.2, 0.4, linear)));
    attr(colBox, 'height', 52 + (gy(7) - gy(2)) * cb);
    const rb = P(t, tRow, 1.0);
    op(rowBox, P(t, tRow, 0.2, linear) * (1 - P(t, at('chlorine') - 0.2, 0.4, linear)));
    attr(rowBox, 'width', 52 + (gx(18) - gx(1)) * rb);

    // bright group and period numbers
    gLab.forEach((g, i) => {
      const pn = P(t, mid('number', 0.06 + i * 0.05), 0.4, pop) * (1 - P(t, at('period') - 0.1, 0.4, linear));
      const lit = Math.max(pn, i === 6 ? clB * P(t, mid('chlorine', 0.4) + 0.5, 0.3, linear) : 0, i === 1 ? caB * P(t, mid('calcium', 0.5) + 0.5, 0.3, linear) : 0);
      const pulse = i === 0 ? win(t, mid('number', 0.6), mid('number', 0.78), 0.2) : i === 6 ? win(t, mid('number', 0.8), at('period'), 0.2) : 0;
      op(g, clamp(lit * 2)); tr(g, gx(GCOLS[i]), GY - 23, Math.max(0.01, (0.7 + 0.3 * clamp(lit)) * (1 + 0.35 * pulse)));
    });
    pLab.forEach((g, i) => {
      const pp = P(t, mid('period', 0.36 + i * 0.05), 0.4, pop) * (i === 2 ? 1 : 1 - P(t, mid('period', 0.8), 0.4, linear)) * (1 - P(t, at('across') + 1, 0.4, linear));
      const lit = Math.max(pp, i === 2 ? clB * P(t, mid('chlorine', 0.75) + 0.5, 0.3, linear) : 0, i === 3 ? caB * P(t, mid('calcium', 0.78) + 0.5, 0.3, linear) : 0);
      op(g, clamp(lit * 2)); tr(g, GX - 24, gy(i + 1), Math.max(0.01, 0.7 + 0.3 * clamp(lit)));
    });

    // focus rings: Li, Na, K as their atoms arrive; the current Period 3 element; Cl; Ca; the neighbours of "?"
    const ringAt = (r, z, v, s) => { op(r, v); if (v > 0) { const [x, y] = tXY(z); tr(r, x, y, s || 1); } };
    const lnkT = [mid('lnk', 0.04), mid('lnk', 0.3), mid('lnk', 0.56)];
    const pr = [winRing(lnkT[0]), winRing(lnkT[1]), winRing(lnkT[2])];
    function winRing(t0) { return win(t, t0, t0 + 1.6, 0.25); }
    if (Math.max(pr[0], pr[1], pr[2]) > 0) { ringAt(rings[0], 3, pr[0]); ringAt(rings[1], 11, pr[1]); ringAt(rings[2], 19, pr[2]); }
    else if (inAcross > 0) { ringAt(rings[0], P3[step], inAcross, 1.12 + 0.06 * Math.sin(Math.PI * clamp((t - STEP0 - (step - 1) * STEP) / 0.5))); op(rings[1], 0); op(rings[2], 0); }
    else if (clB > 0) { ringAt(rings[0], 17, clB, 1.12); op(rings[1], 0); op(rings[2], 0); }
    else if (caB > 0) { ringAt(rings[0], 20, caB, 1.12); op(rings[1], 0); op(rings[2], 0); }
    else if (prB > 0) { const nb = win(t, mid('predict', 0.12), mid('predict', 0.5), 0.25); ringAt(rings[0], 19, nb); ringAt(rings[1], 55, nb); ringAt(rings[2], 37, P(t, mid('predict', 0.4), 0.3, linear), 1.1 + 0.05 * wave(t, 1)); }
    else rings.forEach(r => op(r, 0));

    // arrows
    op(clUp, clB); clUp.set(P(t, mid('chlorine', 0.4), 0.55)); op(clLeft, clB); clLeft.set(P(t, mid('chlorine', 0.75), 0.6));
    op(caUp, caB); caUp.set(P(t, mid('calcium', 0.5), 0.55)); op(caLeft, caB); caLeft.set(P(t, mid('calcium', 0.78), 0.45));
    op(downA, trB); downA.set(P(t, mid('trap', 0.05), 0.6)); op(acrossA, trB); acrossA.set(P(t, mid('trap', 0.32), 0.6));
    op(downLab, trB * P(t, mid('trap', 0.2), 0.3, linear)); op(acrossLab, trB * P(t, mid('trap', 0.5), 0.3, linear));
    // the mystery element
    op(myst, prB);
    const orange = P(t, mid('predict', 0.42), 0.6, linear);
    mystBox.setAttribute('fill', _ptMix(C.card2, ORANGE, orange * 0.9));
    mystQ.setAttribute('fill', orange > 0.5 ? C.bg0 : C.ink);

    /* --- right-hand side --- */
    const dA = win(t, mid('group', 0.1), at('lnk') + 0.1, 0.4);
    op(defG, dA);
    if (dA > 0) { defArrow.set(P(t, mid('group', 0.18), 0.8)); op(defMore, P(t, mid('group', 0.55), 0.5, linear)); }

    // Li, Na, K: in for "lnk", Na moves up for "number" and "period"
    const lkOut = 1 - P(t, at('number') - 0.15, 0.4, linear), naOut = 1 - P(t, at('across') - 0.62, 0.4, linear);
    const naUp = P(t, at('number') - 0.1, 0.8);
    const outerGlow = Math.max(P(t, mid('lnk', 0.8), 0.5, linear), 0) * (0.8 + 0.2 * wave(t, 1.1));
    [[li, tagLi, YL[0], lnkT[0], lkOut], [na, tagNa, YL[1], lnkT[1], naOut], [k, tagK, YL[2], lnkT[2], lkOut]].forEach(([o, tg, y, t0, out], i) => {
      const p = P(t, t0, 0.55, pop), v = clamp(p * 2) * out;
      op(o.g, v); op(tg, v);
      if (v <= 0) return;
      const yy = i === 1 ? lerp(y, YN[0], naUp) : y;
      tr(o.g, 900, yy, Math.max(0.01, 0.6 + 0.4 * p));
      tg.setAttribute('transform', `translate(0 ${(yy - y).toFixed(1)})`);
      o.a.set({ t, orbit: ORB, outer: outerGlow });
      tg.last.setAttribute('fill', outerGlow > 0.3 ? C.energy : C.ink);
      const note = i === 1 ? (t > at('period') - 0.1 ? '3 shells' : '→ Group 1') : '';
      setText(tg.note, note);
      op(tg.note, i === 1 ? Math.max(P(t, mid('number', 0.62), 0.4, linear) * (1 - P(t, at('period') - 0.1, 0.3, linear)), P(t, mid('period', 0.64), 0.4, linear)) : 0);
    });
    fizz.forEach((f, i) => {
      const p = P(t, mid('similar', 0.15 + i * 0.12), 0.5, pop), v = clamp(p * 2) * lkOut;
      op(f, v);
      if (v > 0) { tr(f, 1110, YL[i] + 6, Math.max(0.01, 0.6 + 0.4 * p)); f.bub.upd(t + i * 0.7, P(t, mid('similar', 0.15 + i * 0.12) + 0.3, 0.5, linear)); attr(f.lump, 'y', -13 + Math.sin(t * 5 + i) * 1.5); }
    });
    // fade the electron arrangements while the fizz icons are on
    [tagLi, tagNa, tagK].forEach(tg => op(tg.childNodes[1], 1 - win(t, mid('similar', 0.1), at('number') - 0.1, 0.4)));
    // the right-hand atom: small chlorine ("number", "period") -> Na ... Ar ("across") -> chlorine -> calcium
    const clSmallP = P(t, mid('number', 0.78), 0.55, pop), clSmall = clamp(clSmallP * 2) * naOut;
    const vB = Math.max(clSmall, inAcross, clB, caB);
    op(B.g, vB); op(tagCl, clSmall);
    if (vB > 0) {
      const wob = 0.8 + 0.2 * wave(t, 1.1);
      let e = 17, outer, s;
      if (clSmall > 0) { tr(B.g, 900, YN[1], 0.9 * Math.max(0.01, 0.6 + 0.4 * clSmallP)); outer = P(t, mid('number', 0.85), 0.5, linear) * wob; }
      else if (inAcross > 0) {
        e = 11; for (let k2 = 1; k2 <= 7; k2++) e += P(t, STEP0 + (k2 - 1) * STEP - 0.25, 0.7, linear);
        outer = 0.85 * P(t, STEP0 - 0.2, 0.4, linear); s = 1.2 * (0.85 + 0.15 * P(t, at('across') - 0.2, 0.6, easeOut));
      } else if (clB > 0) { outer = P(t, mid('chlorine', 0.36), 0.5, linear) * wob; s = 1.2 * (0.85 + 0.15 * P(t, at('chlorine') - 0.15, 0.5, easeOut)); }
      else { e = 20; outer = P(t, mid('calcium', 0.46), 0.5, linear) * wob; s = 0.85 + 0.15 * P(t, at('calcium') - 0.15, 0.5, easeOut); }
      if (s) tr(B.g, AX, AY, s);
      B.a.set({ e, t, orbit: ORB, outer });
      op(ring4, caB > 0 ? 1 : 0);
      tagCl.last.setAttribute('fill', outer > 0.3 ? C.energy : C.ink);
      setText(tagCl.note, t > at('period') - 0.1 ? '3 shells' : '→ Group 7');
      op(tagCl.note, Math.max(P(t, mid('number', 0.86), 0.4, linear) * (1 - P(t, at('period') - 0.1, 0.3, linear)), P(t, mid('period', 0.64), 0.4, linear)));
    }
    // "period number = shells": count the rings of Na and Cl
    ringHi.forEach((rs, ai) => rs.forEach((c, kk) => {
      const v = naOut * win(t, mid('period', 0.54 + kk * 0.06), at('across') - 0.6, 0.2);
      op(c, v);
      if (v > 0) tr(c, 900, YN[ai]);
    }));

    // labels under the big atom
    const lbA = Math.max(inAcross, clB, caB);
    op(bigLab, lbA);
    if (lbA > 0) {
      const z = caB > 0 ? 20 : clB > 0 ? 17 : 11 + step, el = ptElement(z);
      const sh = z === 20 ? [2, 8, 8, 2] : [2, 8, z - 10];
      setText(blSymT, el.sym); setText(blName, '  ' + el.name);
      setText(blArrHead, sh.slice(0, -1).join(', ') + ', '); setText(blArrLast, String(sh[sh.length - 1]));
      setText(blNumV, String(z));
      blSym.setAttribute('fill', z === 20 ? AMBER : z === 17 && clB > 0 ? LIME : C.energy);
    }
    cnt.forEach((g, i) => { const p = inAcross * P(t, STEP0 + (i - 1) * STEP + 0.1, 0.4, pop); op(g, clamp(p * 2)); if (p > 0) { tr(g, tXY(P3[i])[0], 524, Math.max(0.01, 0.6 + 0.4 * p)); } });
    op(cntLab, inAcross * P(t, STEP0 + 0.4, 0.5, linear));

    // the mistake, struck out
    op(trapG, trB * P(t, mid('trap', 0.4), 0.3, linear));
    wrongs.forEach((s, i) => s.set(P(t, mid('trap', 0.56 + i * 0.14), 0.35, easeOut)));
    // the mystery tile, close up
    const mp = P(t, at('predict'), 0.55, pop);
    op(mBig, clamp(mp * 2)); tr(mBig, AX, 310, Math.max(0.01, 0.6 + 0.4 * mp));
    mBigBox.setAttribute('fill', _ptMix(C.card2, ORANGE, orange * 0.9));
    mBigQ.setAttribute('fill', orange > 0.5 ? C.bg0 : C.ink);
    op(mChip, P(t, mid('predict', 0.1), 0.4, linear));
    const lp = P(t, mid('predict', 0.55), 0.5, pop); op(mLab, clamp(lp * 2)); tr(mLab, 0, (1 - clamp(lp)) * 12);
    const fp = P(t, mid('predict', 0.68), 0.5, pop); op(mFizz, clamp(fp * 2));
    if (fp > 0) { tr(mFizz, AX, 530, Math.max(0.01, 1.3 * (0.6 + 0.4 * fp))); mFizz.bub.upd(t, P(t, mid('predict', 0.75), 0.5, linear)); }

    /* --- the strip under the table --- */
    op(capLnk, win(t, mid('lnk', 0.8), at('similar') - 0.1, 0.35));
    op(capSim, win(t, mid('similar', 0.4), at('number') - 0.1, 0.35));
    op(capNum, win(t, mid('number', 0.1), at('period') - 0.1, 0.35));
    op(capPer1, win(t, mid('period', 0.06), at('across') - 0.1, 0.35));
    op(capPer2, win(t, mid('period', 0.58), at('across') - 0.1, 0.35));
    op(capAcr, win(t, mid('across', 0.35), at('chlorine') - 0.15, 0.35));
    op(capCl, win(t, mid('chlorine', 0.38), at('calcium') - 0.1, 0.35)); op(capCl2, P(t, mid('chlorine', 0.72), 0.4, linear));
    op(capCa, win(t, mid('calcium', 0.48), at('trap') - 0.1, 0.35)); op(capCa2, P(t, mid('calcium', 0.76), 0.4, linear));
    op(capTrap, win(t, mid('trap', 0.12), at('predict') - 0.1, 0.3));
    op(capPred, P(t, mid('predict', 0.3), 0.4, linear));
  };
});
