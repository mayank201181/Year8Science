/* Intro: 1869. Element cards on Mendeleev's desk slide into a grid that leaves two "?" gaps
   -> the camera dives into one gap: his guesses appear as ghost writing, a real grey lump drops
   in and every guess earns a tick -> the cards become the modern periodic table, a map with a
   pin on it -> a three-stop roadmap. */
scene('intro', S => {
  const { at, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;
  const PAPER = '#F3E9D2', EDGE = '#C9B48C', INK = '#3A2A1A', PENCIL = '#7A6446';

  /* ---------- the 1869 grid: main groups 1-7 only (the noble gases were not yet known) ---------- */
  const CW = 86, CH = 100, PX = 100, PY = 112, X0 = 300, Y0 = 222;
  const slotXY = (c, r) => [X0 + c * PX, Y0 + r * PY];
  const LAYOUT = [                               // symbol, mass on his card, column, row (in order of mass)
    ['H', 1, 0, 0],
    ['Li', 7, 0, 1], ['Be', 9, 1, 1], ['B', 11, 2, 1], ['C', 12, 3, 1], ['N', 14, 4, 1], ['O', 16, 5, 1], ['F', 19, 6, 1],
    ['Na', 23, 0, 2], ['Mg', 24, 1, 2], ['Al', 27, 2, 2], ['Si', 28, 3, 2], ['P', 31, 4, 2], ['S', 32, 5, 2], ['Cl', 35.5, 6, 2],
    ['K', 39, 0, 3], ['Ca', 40, 1, 3], ['As', 75, 4, 3], ['Se', 79, 5, 3], ['Br', 80, 6, 3],
  ];
  const GA = slotXY(2, 3), GE = slotXY(3, 3);    // the two gaps: below aluminium and below silicon
  const ZOOM = 2.4, FOCUS_Y = 440;               // the camera dives into the gap below silicon

  /* ---------- Mendeleev's desk (inside camG, which the camera zooms) ---------- */
  const camG = G(root);
  const desk = G(camG);
  E('rect', { x: 44, y: 108, width: 1112, height: 616, rx: 30, fill: linGrad('#402E21', '#21160E', true), stroke: '#5C4330', 'stroke-width': 3 }, desk);
  const gr = rng(8);
  for (let k = 0; k < 9; k++) {
    const y0 = 150 + k * 66 + gr() * 18, pts = [];
    for (let i = 0; i <= 12; i++) pts.push([86 + i * 85.6, y0 + Math.sin(i * 0.7 + k) * 7 + (gr() - 0.5) * 4]);
    E('path', { d: openPath(pts), fill: 'none', stroke: '#583F2D', 'stroke-width': (2.5 + gr() * 2).toFixed(1), opacity: 0.55, 'stroke-linecap': 'round' }, desk);
  }
  E('ellipse', { cx: 600, cy: 400, rx: 560, ry: 330, fill: glow('#FFD79A'), opacity: 0.14 }, desk);
  // ink pot and quill, top right
  const pot = G(desk); tr(pot, 1060, 240);
  E('ellipse', { cx: 4, cy: 32, rx: 46, ry: 11, fill: '#000', opacity: 0.32 }, pot);
  E('path', { d: 'M-34,30 Q-42,-6 -18,-14 L-14,-28 L14,-28 L18,-14 Q42,-6 34,30 Z', fill: ball('#34476A', '#141C2B'), stroke: '#7089AE', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, pot);
  E('rect', { x: -17, y: -35, width: 34, height: 9, rx: 3, fill: '#1B2433', stroke: '#7089AE', 'stroke-width': 2 }, pot);
  E('path', { d: 'M-3,-30 C10,-78 40,-124 82,-142 C68,-104 42,-66 7,-30 Z', fill: '#EDE6D6', stroke: '#B9AE96', 'stroke-width': 2, 'stroke-linejoin': 'round' }, pot);
  E('path', { d: 'M1,-29 C20,-70 47,-108 78,-138', fill: 'none', stroke: '#8C8270', 'stroke-width': 2 }, pot);

  /* gaps: dashed empty places that pulse with "?" */
  const slotsG = G(camG);
  const gap = pos => {
    const g = G(slotsG); tr(g, pos[0], pos[1]);
    const halo = E('ellipse', { rx: 78, ry: 86, fill: glow(C.energy) }, g);
    const box = E('rect', { x: -CW / 2, y: -CH / 2, width: CW, height: CH, rx: 8, fill: 'rgba(243,233,210,0.07)', stroke: PAPER, 'stroke-width': 3, 'stroke-dasharray': '9 7' }, g);
    const q = T(g, 0, 20, '?', { size: 58, weight: 700, fill: PAPER, anchor: 'middle' });
    return { g, halo, box, q };
  };
  const gapGa = gap(GA), gapGe = gap(GE);

  /* element cards, as he wrote them: atomic mass at the top, symbol below. Built in reverse so the
     cards that move first are drawn on top of the ones still waiting. */
  const cardsG = G(camG);
  function elCard(sym, mass) {
    const g = G(cardsG);
    E('rect', { x: -CW / 2 + 4, y: -CH / 2 + 7, width: CW, height: CH, rx: 8, fill: '#000', opacity: 0.3 }, g);
    E('rect', { x: -CW / 2, y: -CH / 2, width: CW, height: CH, rx: 8, fill: PAPER, stroke: EDGE, 'stroke-width': 2.5 }, g);
    T(g, 0, -20, String(mass), { size: 24, weight: 600, fill: PENCIL, anchor: 'middle', font: FB });
    T(g, 0, 34, sym, { size: 40, weight: 700, fill: INK, anchor: 'middle' });
    return g;
  }
  const sr = rng(19), spots = [];
  for (let r = 0; r < 3; r++) for (let c = 0; c < 7; c++) spots.push([140 + c * 153 + (sr() - 0.5) * 40, 345 + r * 128 + (sr() - 0.5) * 26]);
  for (let i = spots.length - 1; i > 0; i--) { const j = Math.floor(sr() * (i + 1)); const tmp = spots[i]; spots[i] = spots[j]; spots[j] = tmp; }
  const cards = [];
  for (let i = LAYOUT.length - 1; i >= 0; i--) {
    const [sym, mass, c, r] = LAYOUT[i];
    const [x1, y1] = slotXY(c, r);
    cards[i] = { g: elCard(sym, mass), z: PT_SYM.indexOf(sym) + 1, x0: spots[i][0], y0: spots[i][1], r0: (sr() - 0.5) * 44, x1, y1, i };
  }

  /* the lumps that were found years later: grey germanium, silvery gallium */
  const lumpsG = G(camG);
  function lump(light, dark, seed) {
    const g = G(lumpsG), body = G(g), r = rng(seed), pts = [];
    E('ellipse', { cx: 2, cy: 15, rx: 25, ry: 6, fill: '#000', opacity: 0.38 }, g);
    for (let i = 0; i < 9; i++) { const a = i / 9 * TAU; pts.push([Math.cos(a) * 22 * (0.82 + r() * 0.28), Math.sin(a) * 14 * (0.8 + r() * 0.32)]); }
    E('path', { d: closedPath(pts), fill: ball(light, dark), stroke: dark, 'stroke-width': 1.5 }, body);
    E('path', { d: 'M-11,-6 L-3,-10 L6,-4 L-5,0 Z', fill: '#FFFFFF', opacity: 0.38 }, body);
    E('path', { d: 'M5,3 L14,-1 L16,6 L8,9 Z', fill: '#FFFFFF', opacity: 0.16 }, body);
    g.body = body;
    return g;
  }
  const geLump = lump('#B5BFC8', '#56606A', 4), gaLump = lump('#DCE4EA', '#7E8B97', 9);
  const geRest = [GE[0], GE[1] - 4], gaRest = [GA[0], GA[1] - 4];
  const geRing = E('circle', { r: 30, fill: 'none', stroke: PAPER, 'stroke-width': 2 }, camG);
  const geTick = tick(camG, 9); tr(geTick, GE[0] + 30, GE[1] - 34);

  /* ---------- screen-space overlays for the hook and the predictions ---------- */
  const date = chip(root, '1869', { size: 46, fill: 'rgba(10,27,39,0.86)', stroke: C.energy, color: C.energy, sw: 3 });
  const ghostG = G(root);
  const GHOST = ['mass ≈ 72', 'density 5.5', 'grey metal'];
  // his guesses, written like a pencil note on the desk just under the zoomed gap
  const GS = 32, GLY = k => 612 + k * 42;
  const gw = Math.max(...GHOST.map(s => textWidth(s, GS, FD, 600)));
  const gx = 600 - (gw + 46) / 2;
  const ghosts = GHOST.map((s, k) => {
    const el = T(ghostG, gx, GLY(k), '', { size: GS, weight: 600, fill: '#D3E7F2' });
    const tk = tick(ghostG, 12.5); tr(tk, gx + gw + 30, GLY(k) - 11);
    return { s, el, tk };
  });
  const question = T(root, 600, 690, 'How could a table predict the future?', { size: 40, weight: 700, anchor: 'middle', fill: C.energy });

  /* ---------- the modern table ---------- */
  const GX = 64, GY = 250;
  const gridG = G(root); tr(gridG, GX, GY);
  const grid = ptGrid(gridG, {});
  const title = T(root, 600, 175, 'The periodic table', { size: 66, weight: 700, anchor: 'middle' });
  const [cx6, cy6] = grid.xy(6);                 // a pin on carbon: an empty cell sits above it
  const pinX = GX + cx6, pinY = GY + cy6 - 24;
  const pinG = G(root);
  const pinRing = E('circle', { cx: pinX, cy: pinY + 22, r: 30, fill: 'none', stroke: C.energy, 'stroke-width': 3 }, pinG);
  const pin = G(pinG);
  E('ellipse', { cx: 0, cy: 1, rx: 9, ry: 3.5, fill: '#000', opacity: 0.35 }, pin);
  E('path', { d: 'M0,0 C-5,-12 -19,-22 -19,-37 A19,19 0 1 1 19,-37 C19,-22 5,-12 0,0 Z', fill: ball('#FF7A6B', '#B5372D'), stroke: '#FFD3CC', 'stroke-width': 2 }, pin);
  E('circle', { cx: 0, cy: -37, r: 7, fill: '#FFF3F0' }, pin);
  const mapChip = chip(root, 'where it sits → how it behaves', { size: 29, fill: 'rgba(10,27,39,0.86)', stroke: C.energy, color: C.ink, sw: 2.5 });
  tr(mapChip, 484, 366);

  /* ---------- roadmap ---------- */
  function miniTable(parent, pitch) {
    const g = G(parent), ts = pitch * 0.8, d = { metal: '', nonmetal: '', metalloid: '' };
    for (let z = 1; z <= 118; z++) {
      const el = ptElement(z); if (!el.col) continue;
      d[el.kind] += `M${((el.col - 1) * pitch - 9 * pitch).toFixed(1)},${((el.period - 1) * pitch - 3.5 * pitch).toFixed(1)}h${ts}v${ts}h${-ts}Z`;
    }
    for (const k in d) E('path', { d: d[k], fill: PT_KIND_COL[k] }, g);
    const colHi = E('rect', { x: -9 * pitch - 3, y: -2.5 * pitch - 3, width: ts + 6, height: 6 * pitch + 6 - (pitch - ts), rx: 4, fill: 'none', stroke: C.heat, 'stroke-width': 4 }, g);
    const rowHi = E('rect', { x: -9 * pitch - 3, y: -1.5 * pitch - 3, width: 18 * pitch + 6 - (pitch - ts), height: ts + 6, rx: 4, fill: 'none', stroke: C.energy, 'stroke-width': 4 }, g);
    return [colHi, rowHi];
  }
  const road = G(root);
  const stops = [
    { x: 240, text: 'Inside the atom', draw: g => [shellAtom(g, { z: 11, radii: [30, 52, 74], er: 7, nucleus: 'dot', nucR: 17 })] },
    { x: 600, text: 'Reading the table', draw: g => miniTable(g, 15) },
    { x: 960, text: 'The families', draw: g => {
      const fl = E('ellipse', { cx: 0, cy: -34, rx: 30, ry: 44, fill: glow('#C8A2F0') }, g);
      const tb = beaker(g, 200, 104, { level: 0.62, liquid: '#9A6ADF', marks: false });
      const bub = bubbles(g, -70, -2, 140, 46, { n: 9, r: 5, seed: 23, speed: 0.6 });
      const bit = E('rect', { x: -9, y: -9, width: 18, height: 12, rx: 5, fill: ball('#E4EAEE', '#8D9AA5') }, g);
      return [tb, bub, bit, fl];
    } },
  ].map(st => {
    const g = G(road); tr(g, st.x, 450);
    const box = card(g, -160, -130, 320, 270, { fill: C.card, stroke: C.line });
    const art = G(g); tr(art, 0, -26);
    const parts = st.draw(art);
    T(g, 0, 100, st.text, { size: 30, weight: 600, anchor: 'middle' });
    return { g, box, parts, x: st.x };
  });
  const roadArrows = [arrow(road, 406, 450, 434, 450, { color: C.faint, width: 5 }), arrow(road, 766, 450, 794, 450, { color: C.faint, width: 5 })];

  /* ---------- timing ---------- */
  const flyAt = i => mid('hook', 0.27) + i * 0.13, FLY = 0.75;
  const R0 = at('def') + 0.45, RD = 1.2;          // the modern table grows tile by tile, in atomic-number order
  const revealAt = z => R0 + RD * (z - 0.6) / 118;
  const gridPos = z => { const [x, y] = grid.xy(z); return [GX + x, GY + y]; };
  const lumpFall = (t, t0, rest) => {          // y offset while falling, then a little squash
    const u = clamp((t - t0) / 0.5);
    return { y: rest[1] - 250 * (1 - easeIn(u)), on: t >= t0 ? 1 : 0, sq: 0.16 * Math.sin(Math.PI * P(t, t0 + 0.5, 0.28, linear)) };
  };

  return t => {
    /* ----- camera: dive into the silicon gap during "predict", back out at its end ----- */
    const z = P(t, at('predict') - 0.1, 1.25, ease) * (1 - P(t, mid('predict', 0.79), 1.1, ease));
    const Z = lerp(1, ZOOM, z), fy = lerp(GE[1], FOCUS_Y, z);
    camG.setAttribute('transform', `translate(600 ${fy.toFixed(2)}) scale(${Z.toFixed(4)}) translate(-600 ${-GE[1]})`);

    /* ----- desk ----- */
    const deskA = P(t, 0, 0.5, linear) * (1 - P(t, at('def') - 0.25, 0.7, linear));
    op(desk, deskA);

    /* ----- the cards: scattered -> arranged by mass -> (def) fly into the modern table ----- */
    const toGrid = i => P(t, at('def') - 0.25 + i * 0.012, 0.6, ease);
    cards.forEach(cd => {
      const u = P(t, flyAt(cd.i), FLY, ease), lift = Math.sin(Math.PI * clamp((t - flyAt(cd.i)) / FLY));
      let x = lerp(cd.x0, cd.x1, u), y = lerp(cd.y0, cd.y1, u) - 26 * lift, rot = cd.r0 * (1 - u), s = 1 + 0.08 * lift;
      const v = toGrid(cd.i);
      if (v > 0) {
        const [gx2, gy2] = gridPos(cd.z);
        x = lerp(cd.x1, gx2, v); y = lerp(cd.y1, gy2, v) - 40 * Math.sin(Math.PI * v); s = lerp(1, 0.6, v);
      }
      tr(cd.g, x, y, s, rot);
      const dimmed = 1 - 0.5 * z;
      op(cd.g, P(t, 0.05 + cd.i * 0.02, 0.4, linear) * dimmed * (1 - P(t, revealAt(cd.z), 0.18, linear)));
    });

    /* ----- the gaps ----- */
    const gapOn = P(t, mid('hook', 0.6), 0.5, linear) * (1 - P(t, at('def') - 0.25, 0.4, linear));
    op(slotsG, gapOn);
    if (gapOn > 0) {
      const pulse = P(t, mid('hook', 0.64), 0.4, linear);
      const gaLand = mid('predict', 0.37) + 0.5, geLand = mid('predict', 0.42) + 0.5;
      [[gapGa, gaLand, 0.3], [gapGe, geLand, 0]].forEach(([gp, land, ph]) => {
        const w = wave(t, 1.3, ph) * calm;
        op(gp.halo, pulse * (0.3 + 0.45 * w) * (1 - P(t, land, 0.3, linear)) * (1 - 0.5 * z));
        tr(gp.q, 0, 0, 1 + 0.08 * pulse * w);
      });
      op(gapGa.q, pulse * (1 - P(t, gaLand - 0.1, 0.25, linear)));
      op(gapGe.q, pulse * (1 - P(t, mid('predict', 0.1), 0.5, linear)));
      gapGe.box.setAttribute('stroke', _ptMix(PAPER, C.good, P(t, mid('predict', 0.6), 0.6, linear) * (1 - P(t, mid('predict', 0.85), 0.6, linear))));
    }

    /* ----- lumps: dropped into the gaps "years later", then carried into the modern table ----- */
    [[geLump, mid('predict', 0.42), geRest, 32], [gaLump, mid('predict', 0.37), gaRest, 31]].forEach(([lp, t0, rest, zz]) => {
      const f = lumpFall(t, t0, rest);
      let x = rest[0], y = f.y;
      const v = toGrid(zz === 32 ? 11.5 : 10.5);
      if (v > 0) { const [gx2, gy2] = gridPos(zz); x = lerp(rest[0], gx2, v); y = lerp(rest[1], gy2, v) - 40 * Math.sin(Math.PI * v); }
      tr(lp, x, y, lerp(1, 0.9, v));
      lp.body.setAttribute('transform', `scale(${(1 + f.sq).toFixed(3)} ${(1 - f.sq).toFixed(3)})`);
      op(lp, f.on * (1 - P(t, revealAt(zz), 0.18, linear)));
    });
    const rg = P(t, mid('predict', 0.42) + 0.5, 0.7, easeOut);
    op(geRing, rg > 0 && rg < 1 ? 0.8 * (1 - rg) : 0);
    attr(geRing, 'r', 26 + 40 * rg); attr(geRing, 'cx', geRest[0]); attr(geRing, 'cy', geRest[1] + 8);
    const tb = P(t, mid('predict', 0.86), 0.45, pop);
    op(geTick, clamp(tb * 2) * (1 - P(t, at('def') - 0.3, 0.3, linear)));
    tr(geTick, GE[0] + 30, GE[1] - 34, Math.max(0.01, tb));

    /* ----- 1869 chip ----- */
    const dp = P(t, mid('hook', 0.0), 0.55, pop);
    op(date, clamp(dp * 2) * (1 - P(t, at('predict') - 0.3, 0.4, linear)));
    tr(date, 650, 222, 0.7 + 0.3 * dp);

    /* ----- ghost writing in the zoomed gap, then ticks ----- */
    const gA = P(t, mid('predict', 0.1), 0.3, linear) * (1 - P(t, mid('predict', 0.77), 0.35, linear));
    op(ghostG, gA);
    if (gA > 0) ghosts.forEach((o, k) => {
      const w0 = mid('predict', 0.13 + 0.09 * k), n = Math.round(o.s.length * P(t, w0, 0.75, linear));
      setText(o.el, o.s.slice(0, n));
      const sol = P(t, mid('predict', 0.6 + 0.06 * k), 0.35, linear);
      o.el.setAttribute('fill', _ptMix('#9FB9C9', '#FFFFFF', sol));
      op(o.el, 0.75 + 0.25 * sol);
      const tk = P(t, mid('predict', 0.6 + 0.06 * k) + 0.1, 0.45, pop);
      op(o.tk, clamp(tk * 2)); tr(o.tk, gx + gw + 30, GLY(k) - 11, Math.max(0.01, tk));
    });
    op(question, P(t, mid('predict', 0.84), 0.6, linear) * (1 - P(t, at('def') - 0.2, 0.4, linear)));

    /* ----- the modern table ----- */
    const reveal = 118 * P(t, R0, RD, linear);
    const pinT = mid('def', 0.58), land = pinT + 0.45;
    const plan = P(t, at('plan') - 0.1, 0.8);
    op(gridG, (t > R0 - 0.05 ? 1 : 0) * (1 - P(t, at('plan') + 0.05, 0.55, linear)));
    if (t > R0 - 0.05 && plan < 1) {
      grid.set({ reveal, kind: P(t, at('def') + 1.45, 0.7, linear), hi: [{ z: 6, p: P(t, land, 0.35, linear) * (1 - P(t, at('plan') - 0.1, 0.3, linear)), color: PT_KIND_COL.nonmetal }] });
      const gs2 = lerp(1, 0.25, plan);
      tr(gridG, lerp(GX, 465, plan), lerp(GY, 372, plan), gs2);
    }
    op(title, P(t, at('def') + 0.25, 0.6, linear));
    title.setAttribute('transform', `translate(600 ${(lerp(175, 158, plan) + (1 - P(t, at('def') + 0.25, 0.8, easeOut)) * 14).toFixed(1)}) scale(${lerp(1, 0.86, plan).toFixed(3)}) translate(-600 -175)`);

    /* ----- pin on the map ----- */
    const pinA = P(t, pinT, 0.15, linear) * (1 - P(t, at('plan') - 0.15, 0.35, linear));
    op(pinG, pinA);
    if (pinA > 0) {
      const u = clamp((t - pinT) / 0.45), bounce = Math.sin(Math.PI * P(t, land, 0.3, linear)) * 7;
      tr(pin, pinX, pinY - 150 * (1 - easeIn(u)) - bounce);
      const rp = ((t - land) / 1.4) % 1;
      op(pinRing, t > land ? 0.85 * (1 - rp) * (S.reduce ? 0.5 : 1) : 0);
      attr(pinRing, 'r', 22 + 34 * (t > land ? rp : 0));
    }
    const mc = P(t, mid('def', 0.7), 0.5, easeOut);
    op(mapChip, mc * (1 - P(t, at('plan') - 0.15, 0.35, linear)));
    tr(mapChip, 484, 366 + (1 - mc) * 12);

    /* ----- roadmap ----- */
    op(road, P(t, at('plan'), 0.4, linear));
    const showAt = [mid('plan', 0.02), mid('plan', 0.38), mid('plan', 0.66)];
    stops.forEach((st, i) => {
      const p = P(t, showAt[i], 0.6, pop);
      op(st.g, clamp(p * 2));
      tr(st.g, st.x, 450 + (1 - clamp(p)) * 30, 0.9 + 0.1 * clamp(p));
      const lit = win(t, showAt[i], i < 2 ? showAt[i + 1] + 0.2 : showAt[i] + 1.6, 0.35);
      st.box.setAttribute('stroke', _ptMix(C.line, C.energy, lit));
      st.box.setAttribute('stroke-width', (2 + 2 * lit).toFixed(2));
    });
    if (t > showAt[0] - 0.1) {
      stops[0].parts[0].set({ t, orbit: 36 * calm, outer: P(t, showAt[0] + 0.6, 0.5, linear) });
      const [colHi, rowHi] = stops[1].parts;
      op(colHi, P(t, showAt[1] + 0.5, 0.4, linear)); op(rowHi, P(t, showAt[1] + 0.9, 0.4, linear));
      const [, bub, bit, fl] = stops[2].parts;
      const bx = Math.sin(t * 2.3) * 48 * calm;
      attr(bit, 'x', bx - 9); bub.upd(t, 1); tr(fl, bx, 0, 0.85 + 0.15 * wave(t, 0.5) * calm);
    }
    roadArrows.forEach((a, i) => { a.set(P(t, showAt[i + 1] - 0.2, 0.5)); op(a, P(t, showAt[i + 1] - 0.2, 0.2, linear)); });
  };
});
