/* Chapter 10, Catalysts at work.
   One gold square helps pair after pair react, counting up, never changing -> a green enzyme with its active
   site splits a molecule inside a cell -> amylase in saliva snips starch into sugar; yeast makes dough rise
   -> at 37 °C, reactions with enzymes are fast enough, without them far too slow
   -> SHOWPIECE: a car's exhaust opens into a cutaway catalytic converter, a platinum-coated honeycomb
   -> 2CO + O2 -> 2CO2 flows through it -> the catalyst test: faster, and the same 2.00 g back on the balance
   -> same amount of the same product, only the stopwatch differs -> same temperature change either way. */
scene('catalysts', S => {
  const { at, end, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;
  const CA = C.water, CAd = C.waterDk, CB = C.heat, CBd = C.heatDk;      // reactant particles, as in Rate
  const ENZ = '#56D69B', ENZd = '#1F8A5B';
  const fade = (t, t0, d) => P(t, t0, d === undefined ? 0.4 : d, linear);

  /* ---------- local helpers ---------- */
  function rich(parent, x, y, segs, o) {
    o = o || {};
    const t = E('text', { x, y, 'font-size': o.size || 30, 'font-weight': o.weight || 600, 'font-family': o.font || FD, 'text-anchor': o.anchor || 'start', fill: o.fill || C.ink }, parent);
    segs.forEach(s => { if (typeof s === 'string') s = [s]; E('tspan', { fill: s[1], 'font-weight': s[2] }, t).textContent = s[0]; });
    return t;
  }
  const dot = (parent, r, col, dk) => E('circle', { r, fill: ball(col, dk), stroke: dk, 'stroke-width': Math.max(1.5, r * 0.1) }, parent);
  /* pop an element in at t0: fades and grows into place */
  const popIn = (el, t, t0, x, y, s0) => { const p = P(t, t0, 0.5, pop); op(el, clamp(p * 2)); tr(el, x, y, Math.max(0.01, (s0 === undefined ? 0.8 : s0) + (1 - (s0 === undefined ? 0.8 : s0)) * p)); return p; };
  const qb = (a, c, b, u) => { const v = 1 - u; return [v * v * a[0] + 2 * v * u * c[0] + u * u * b[0], v * v * a[1] + 2 * v * u * c[1] + u * u * b[1]]; };
  /* green enzyme blob with a pocket (its active site) opening towards +x, about 240 x 190 at s = 1 */
  function enzymeBlob(parent, s) {
    const g = G(parent), pts = [];
    for (let a = 0.5; a <= TAU - 0.5 + 1e-6; a += (TAU - 1) / 16) pts.push([Math.cos(a) * 120 * (1 + 0.05 * Math.sin(a * 3)), Math.sin(a) * 95 * (1 + 0.05 * Math.cos(a * 2))]);
    pts.push([78, -40], [58, -24], [56, 0], [58, 24], [78, 40]);
    E('path', { d: closedPath(pts), fill: ball(ENZ, ENZd), stroke: '#B9F2D6', 'stroke-width': 4 / s, transform: `scale(${s})` }, g);
    return g;
  }
  /* side view of a small car, wheels on y = 0, facing right (mirror it with a negative x scale) */
  function carArt(parent) {
    const g = G(parent);
    E('path', { d: 'M-178,-36 Q-180,-74 -148,-80 L-104,-84 Q-82,-128 -48,-134 L56,-134 Q88,-130 112,-86 L156,-80 Q182,-74 180,-44 L180,-36 Q180,-24 168,-24 L-168,-24 Q-178,-24 -178,-36 Z', fill: ball('#7FB2E3', '#2F5E8E'), stroke: '#CFE3F5', 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
    E('path', { d: 'M-86,-86 Q-70,-120 -44,-124 L-6,-124 L-6,-86 Z M6,-86 L6,-124 L50,-124 Q76,-120 96,-86 Z', fill: '#BFE6F7', opacity: 0.85 }, g);
    E('rect', { x: 166, y: -70, width: 12, height: 14, rx: 4, fill: C.energy }, g);
    E('rect', { x: -180, y: -68, width: 10, height: 14, rx: 4, fill: C.bad }, g);
    E('path', { d: 'M-176,-30 L-206,-30', stroke: '#9AA8B4', 'stroke-width': 9, 'stroke-linecap': 'round' }, g);
    g.wheels = [-110, 112].map(x => {
      E('circle', { cx: x, cy: -30, r: 30, fill: '#1B2730', stroke: '#56636E', 'stroke-width': 4 }, g);
      const w = G(g); tr(w, x, -30);
      E('circle', { r: 13, fill: '#B9C6D2' }, w);
      E('path', { d: 'M-13,0 L13,0 M0,-13 L0,13', stroke: '#56636E', 'stroke-width': 3 }, w);
      return { w, x };
    });
    return g;
  }
  function stopwatch(parent, r) {
    const g = G(parent);
    E('rect', { x: -7, y: -r - 14, width: 14, height: 10, rx: 3, fill: C.muted }, g);
    E('circle', { r, fill: C.card, stroke: C.muted, 'stroke-width': 4 }, g);
    const hand = E('line', { x1: 0, y1: 0, x2: 0, y2: -r + 8, stroke: C.energy, 'stroke-width': 4, 'stroke-linecap': 'round' }, g);
    E('circle', { r: 4, fill: C.energy }, g);
    g.set = turns => hand.setAttribute('transform', `rotate(${(turns * 360).toFixed(1)})`);
    return g;
  }

  /* ================= A. used over and over again ================= */
  const A = G(root);
  const CATX = 600, CATY = 400;
  const catA = rxCatalyst(A, 1.4); tr(catA, CATX, CATY);
  T(A, CATX, 500, 'catalyst', { size: 32, weight: 700, anchor: 'middle', fill: RX.gold });
  const sameA = G(A);
  const tkA = tick(sameA, 12); tr(tkA, 690, 396);
  T(sameA, 712, 406, 'unchanged', { size: 28, weight: 600 });
  const cntA = chip(A, 'used 0 times', { size: 30, fill: C.card, stroke: C.line, w: 250 }); tr(cntA, CATX, 590);
  const CYC = [];
  { let s = at('reuse') + 0.1; for (let k = 0; k < 7; k++) { CYC.push(s); s += Math.max(0.45, 1.0 * Math.pow(0.8, k)); } }
  const LAND = CATY - 45 - 20, APP = 0.6, HOLD = 0.25, RISE = 0.7;
  const slots = [0, 1, 2, 3].map(() => { const g = G(A); return { g, a: dot(g, 20, CA, CAd), b: dot(g, 20, CB, CBd), sp: spark(A, 22, { seed: 3 }) }; });

  /* ================= B. enzymes: biological catalysts ================= */
  const Bg = G(root);
  const cellB = animalCell(Bg, 300, 215, { sw: 5, seed: 11, nx: -205, ny: -92, nr: 44 }); tr(cellB, 420, 420);
  const enzB = enzymeBlob(Bg, 1); tr(enzB, 400, 440);
  const sub = G(Bg);
  const subH = [-17, 17].map(x => { const h = G(sub); E('rect', { x: -15, y: -15, width: 30, height: 30, rx: 8, fill: ball('#C9A8FF', '#7550C4'), stroke: '#E4D6FF', 'stroke-width': 2 }, h); tr(h, x, 0); return h; });
  const subBond = E('line', { x1: -3, y1: 0, x2: 3, y2: 0, stroke: '#E4D6FF', 'stroke-width': 6, 'stroke-linecap': 'round' }, sub);
  const spB = spark(Bg, 20, { seed: 5 });
  const siteLbl = G(Bg);
  E('line', { x1: 520, y1: 552, x2: 476, y2: 478, stroke: C.good, 'stroke-width': 3 }, siteLbl);
  E('circle', { cx: 476, cy: 478, r: 5, fill: C.good }, siteLbl);
  T(siteLbl, 520, 584, 'active site', { size: 28, weight: 700, fill: C.good, anchor: 'middle' });
  const bl = [
    T(Bg, 775, 262, 'enzymes', { size: 58, weight: 700, fill: C.good }),
    T(Bg, 775, 320, 'biological catalysts', { size: 32, weight: 700 }),
    T(Bg, 775, 366, 'special proteins', { size: 30, weight: 600, fill: C.muted }),
    T(Bg, 775, 446, 'speed up the reactions', { size: 28, weight: 600 }),
    T(Bg, 775, 482, 'inside living things', { size: 28, weight: 600 }),
  ];

  /* ================= C. amylase in saliva; enzymes in yeast ================= */
  const Cg = G(root);
  const panL = G(Cg), panR = G(Cg);
  card(panL, 50, 140, 530, 470, { fill: C.card, stroke: C.line });
  card(panR, 620, 140, 530, 470, { fill: C.card, stroke: C.line });
  // mouth and saliva
  const mouth = G(panL); tr(mouth, 112, 202);
  E('path', { d: 'M-36,0 Q-18,-20 0,-10 Q18,-20 36,0 Q18,24 0,24 Q-18,24 -36,0 Z', fill: '#E8607A', stroke: '#FFB3C1', 'stroke-width': 2.5 }, mouth);
  E('path', { d: 'M-26,1 Q0,-6 26,1 Q0,14 -26,1 Z', fill: '#5A1E2A' }, mouth);
  const drip = E('path', { d: 'M0,-9 C5,-2 7,3 7,6 A7,7 0 0 1 -7,6 C-7,3 -5,-2 0,-9 Z', fill: '#9FD8FF' }, mouth);
  T(panL, 162, 213, 'in your saliva', { size: 30, weight: 700 });
  const HEX = [];
  for (let i = 0; i < 8; i++) { const h = G(panL); molGlucose(h, 21); HEX.push({ h, x: 112 + 57 * i }); }
  const BONDS = [];
  for (let i = 0; i < 7; i++) BONDS.push(E('line', { x1: 112 + 57 * i + 19, y1: 330, x2: 112 + 57 * (i + 1) - 19, y2: 330, stroke: C.glucoseLt, 'stroke-width': 5, 'stroke-linecap': 'round' }, panL));
  const starchLbl = T(panL, 315, 276, 'starch', { size: 30, weight: 700, anchor: 'middle', fill: C.glucose });
  const sugarLbl = T(panL, 315, 276, 'sugar', { size: 30, weight: 700, anchor: 'middle', fill: C.glucoseLt });
  const amy = G(panL);
  const amyBlob = enzymeBlob(amy, 0.32); tr(amyBlob, 0, 0, 1, -90);
  T(amy, 0, 66, 'amylase', { size: 28, weight: 700, anchor: 'middle', fill: C.good });
  const SNIP = [1, 3, 5].map((b, k) => ({ b, t: mid('amylase', 0.12 + k * 0.08), x: 112 + 57 * b + 28.5 }));
  const eqAmy = G(panL);
  T(eqAmy, 190, 556, 'starch', { size: 30, weight: 700, anchor: 'middle', fill: C.glucose });
  arrow(eqAmy, 246, 546, 380, 546, { color: C.ink, width: 5 });
  T(eqAmy, 313, 528, 'amylase', { size: 24, weight: 600, anchor: 'middle', fill: C.good });
  T(eqAmy, 440, 556, 'sugar', { size: 30, weight: 700, anchor: 'middle', fill: C.glucoseLt });
  // yeast and rising dough
  const yeastIcon = G(panR); tr(yeastIcon, 660, 200);
  E('ellipse', { cx: -6, cy: 2, rx: 14, ry: 11, fill: '#F3E3A8', stroke: '#B9A46A', 'stroke-width': 2 }, yeastIcon);
  E('ellipse', { cx: 13, cy: -9, rx: 8, ry: 6.5, fill: '#F3E3A8', stroke: '#B9A46A', 'stroke-width': 2 }, yeastIcon);
  T(panR, 690, 212, 'in yeast', { size: 30, weight: 700 });
  T(panR, 690, 246, 'fermentation', { size: 26, weight: 600, fill: C.muted });
  const BOWX = 835, BOWY = 520;
  const dough = G(panR);
  const doughShape = E('path', { d: 'M-128,0 C-130,-40 -90,-62 0,-62 C90,-62 130,-40 128,0 Z', fill: ball('#F6E3B8', '#C9A66B'), stroke: '#FFF1D6', 'stroke-width': 2.5 }, dough);
  const yr = rng(19), YEAST = [], AIR = [];
  for (let i = 0; i < 6; i++) YEAST.push({ x: -95 + i * 38 + (yr() - 0.5) * 10, f: 0.25 + yr() * 0.5, el: E('ellipse', { rx: 9, ry: 7, fill: '#F3E3A8', stroke: '#9C8445', 'stroke-width': 2 }, panR) });
  for (let i = 0; i < 9; i++) AIR.push({ x: -100 + i * 25 + (yr() - 0.5) * 8, f: 0.15 + yr() * 0.7, el: E('circle', { r: 3, fill: 'rgba(255,255,255,0.35)', stroke: '#E9D3A0', 'stroke-width': 1.5 }, panR) });
  E('path', { d: `M${BOWX - 150},${BOWY} L${BOWX + 150},${BOWY} Q${BOWX + 140},${BOWY + 72} ${BOWX},${BOWY + 76} Q${BOWX - 140},${BOWY + 72} ${BOWX - 150},${BOWY} Z`, fill: ball('#7FB2E3', '#2F5E8E'), stroke: '#CFE3F5', 'stroke-width': 3 }, panR);
  T(panR, BOWX, BOWY + 52, 'dough rises', { size: 26, weight: 600, anchor: 'middle', fill: '#E9F3FA' });
  const loaf = G(panR); tr(loaf, 1068, 318);
  E('path', { d: 'M-52,22 C-56,-6 -40,-30 0,-30 C40,-30 56,-6 52,22 Z', fill: ball('#D9954A', '#8A5221'), stroke: '#F2C46E', 'stroke-width': 2.5 }, loaf);
  E('path', { d: 'M-24,-18 L-12,0 M0,-22 L12,-4 M24,-18 L34,-2', stroke: '#F2C46E', 'stroke-width': 3, 'stroke-linecap': 'round' }, loaf);
  T(loaf, 0, 62, 'bread', { size: 26, weight: 600, anchor: 'middle' });
  const glass = G(panR); tr(glass, 1068, 470);
  E('path', { d: 'M-24,-42 L24,-42 L19,40 L-19,40 Z', fill: 'rgba(200,230,250,0.10)', stroke: '#CFE7F5', 'stroke-width': 3, 'stroke-linejoin': 'round' }, glass);
  E('path', { d: 'M-22,-24 L22,-24 L19,38 L-19,38 Z', fill: '#E7B04A', opacity: 0.85 }, glass);
  E('path', { d: 'M-24,-42 Q-26,-56 -10,-52 Q0,-62 10,-52 Q26,-56 24,-42 Z', fill: '#FFF6E0' }, glass);
  T(glass, 0, 72, 'brewing', { size: 26, weight: 600, anchor: 'middle' });
  const brewG = [loaf, glass];

  /* ================= D. far too slow without enzymes, at 37 °C ================= */
  const Dg = G(root);
  const man = person(Dg, { shirt: '#5B8DEF' }); tr(man, 190, 650, 1.45);
  const thD = thermometer(Dg, 260, C.bad); tr(thD, 335, 612); thD.set(0.62);
  T(Dg, 335, 262, 'body temperature', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  const t37 = T(Dg, 335, 322, '37 °C', { size: 52, weight: 700, anchor: 'middle', fill: C.ink });
  const hD = T(Dg, 800, 228, 'the reactions in your cells', { size: 30, weight: 700, anchor: 'middle' });
  const mWith = meter(Dg, { w: 480, h: 40, color: C.good, label: 'with enzymes', labelSize: 28, labelFill: C.ink }); tr(mWith, 560, 322);
  const mWo = meter(Dg, { w: 480, h: 40, color: C.bad, label: 'without enzymes', labelSize: 28, labelFill: C.ink }); tr(mWo, 560, 482);
  const okD = G(Dg); const tkD = tick(okD, 12); tr(tkD, 574, 398);
  T(okD, 596, 408, 'fast enough to keep you alive', { size: 26, weight: 600, fill: C.good });
  const noD = G(Dg); const xD = cross(noD, 10); tr(xD, 574, 556);
  T(noD, 596, 566, 'far too slow', { size: 26, weight: 600, fill: C.bad });

  /* ================= E-F. the catalytic converter: 2CO + O2 -> 2CO2 ================= */
  const Eg = G(root);
  const pipe = G(Eg);
  const pipeOut = E('path', { fill: 'none', stroke: '#8E9CA9', 'stroke-width': 24, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, pipe);
  const pipeIn = E('path', { fill: 'none', stroke: '#33424E', 'stroke-width': 14, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, pipe);
  const carG = G(Eg); const car = carArt(carG);
  const CW = 400, CH = 170;
  const conv = G(Eg);
  const shellD = `M${-CW / 2 - 40},-12 L${-CW / 2},${-CH / 2 + 20} Q${-CW / 2},${-CH / 2} ${-CW / 2 + 30},${-CH / 2} L${CW / 2 - 30},${-CH / 2} Q${CW / 2},${-CH / 2} ${CW / 2},${-CH / 2 + 20} L${CW / 2 + 40},-12 L${CW / 2 + 40},12 L${CW / 2},${CH / 2 - 20} Q${CW / 2},${CH / 2} ${CW / 2 - 30},${CH / 2} L${-CW / 2 + 30},${CH / 2} Q${-CW / 2},${CH / 2} ${-CW / 2},${CH / 2 - 20} L${-CW / 2 - 40},12 Z`;
  E('path', { d: shellD, fill: '#1B2B36', stroke: '#B9C6D2', 'stroke-width': 4, 'stroke-linejoin': 'round' }, conv);
  const combD = (() => {
    let d = ''; const r = 15, w = r * Math.sqrt(3);
    for (let row = -4; row <= 4; row++) for (let col = -9; col <= 9; col++) {
      const cx = col * w + (row % 2 ? w / 2 : 0), cy = row * r * 1.5;
      if (Math.abs(cx) > CW / 2 - 16 || Math.abs(cy) > CH / 2 - 14) continue;
      for (let k = 0; k <= 6; k++) { const a = Math.PI / 6 + k * Math.PI / 3; d += (k ? 'L' : 'M') + (cx + Math.cos(a) * (r - 2.5)).toFixed(1) + ',' + (cy + Math.sin(a) * (r - 2.5)).toFixed(1); }
    }
    return d;
  })();
  const combGlow = E('rect', { x: -CW / 2 + 10, y: -CH / 2 + 10, width: CW - 20, height: CH - 20, rx: 14, fill: glow(RX.gold) }, conv);
  E('path', { d: combD, fill: 'rgba(245,197,66,0.10)', stroke: '#E7E2CF', 'stroke-width': 3 }, conv);
  const cover = E('path', { d: shellD, fill: linGrad('#C7D0D8', '#6F7D8A', true), stroke: '#DDE5EC', 'stroke-width': 4, 'stroke-linejoin': 'round' }, conv);
  const cutLine = E('path', { d: `M${-CW / 2 + 6},${-CH / 2 + 6} L${CW / 2 - 6},${-CH / 2 + 6}`, stroke: '#FFFFFF', 'stroke-width': 3, 'stroke-dasharray': '10 8', fill: 'none' }, conv);
  const convTitle = T(Eg, 700, 300, 'catalytic converter', { size: 36, weight: 700, anchor: 'middle' });
  const ptLeg = G(Eg);
  const ptCat = rxCatalyst(ptLeg, 0.45); tr(ptCat, 545, 562);
  rich(ptLeg, 572, 572, ['coated with ', ['platinum', RX.gold, 800], ': the catalyst'], { size: 28 });
  const exhLbl = T(Eg, 380, 300, 'exhaust', { size: 28, weight: 600, anchor: 'middle', fill: C.muted });
  const coLbl = G(Eg);
  T(coLbl, 380, 498, 'carbon monoxide', { size: 28, weight: 700, anchor: 'middle', fill: '#FF8C8C' });
  T(coLbl, 380, 532, 'harmful', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  const co2Lbl = G(Eg);
  T(co2Lbl, 1010, 352, 'carbon dioxide', { size: 28, weight: 700, anchor: 'middle', fill: C.co2 });
  T(co2Lbl, 1010, 386, 'less harmful', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  const eqF = G(Eg);
  const eqT = rxFormula(eqF, 700, 652, '2CO + O2 → 2CO2', { size: 46 });
  const GROUPS = [0, 1, 2].map(k => {
    const g = G(Eg);
    return { g, ins: [rxMol(g, 'CO', { r: 12 }), rxMol(g, 'CO', { r: 12 }), rxMol(g, 'O2', { r: 12 })], outs: [rxMol(g, 'CO2', { r: 12 }), rxMol(g, 'CO2', { r: 12 })], sp: spark(g, 22, { seed: 7 + k }) };
  });
  const CONV = [700, 420], CAR1 = [170, 334, 0.55];

  /* ================= G. the catalyst test ================= */
  const Gg = G(root);
  const bal = rxBalance(Gg); tr(bal, 260, 470);
  const flG = G(Gg);
  const fl = flask(flG, 1.1, { level: 0.55, liquid: '#BFE6F7', opacity: 0.4 }); tr(fl, 620, 460);
  const bubG = bubbles(flG, 584, 486, 72, 62, { n: 16, r: 6, speed: 0.6, seed: 9 });
  const catG = rxCatalyst(Gg, 0.7);
  const beforeChip = chip(Gg, 'before', { size: 28, fill: C.card, stroke: C.line, w: 150 }); tr(beforeChip, 260, 360);
  const afterChip = chip(Gg, 'after', { size: 28, fill: C.card, stroke: C.good, color: C.good, w: 150 }); tr(afterChip, 260, 360);
  const sameG = G(Gg); const tkG = tick(sameG, 13); tr(tkG, 132, 660);
  T(sameG, 156, 670, 'the same mass', { size: 30, weight: 700, fill: C.good });
  const rateM = meter(Gg, { w: 320, h: 34, color: C.energy, label: 'rate of reaction', labelSize: 28, labelFill: C.ink }); tr(rateM, 820, 380);
  const fasterChip = chip(Gg, 'faster!', { size: 30, fill: C.energy, color: C.bg0 }); tr(fasterChip, 980, 470);
  const filterNote = T(Gg, 620, 628, 'then filter it out, dry it and weigh it', { size: 24, weight: 600, anchor: 'middle', fill: C.muted });
  const CPAN = [260, 470 - 23], CFL = [620, 534];

  /* ================= H. same product, same amount, just faster ================= */
  const Hg = G(root);
  const BX = [280, 520], BASE = 560, BH = 260, BW = 120;
  E('line', { x1: 180, y1: BASE, x2: 620, y2: BASE, stroke: C.muted, 'stroke-width': 3 }, Hg);
  const bars = BX.map((x, i) => {
    const r = E('rect', { x: x - BW / 2, y: BASE, width: BW, height: 0, rx: 10, fill: i ? '#3E6A84' : C.good }, Hg);
    const pg = G(Hg); dot(pg, 15, CA, CAd).setAttribute('cx', -13); const b2 = dot(pg, 15, CB, CBd); b2.setAttribute('cx', 13);
    return { r, pg, x };
  });
  const sameLine = E('line', { x1: 200, y1: BASE - BH, x2: 600, y2: BASE - BH, stroke: C.energy, 'stroke-width': 3, 'stroke-dasharray': '10 8' }, Hg);
  const sameLbl = T(Hg, 612, BASE - BH + 9, 'same amount', { size: 28, weight: 700, fill: C.energy });
  const barLbls = G(Hg);
  T(barLbls, BX[0], 610, 'with catalyst', { size: 28, weight: 700, anchor: 'middle', fill: RX.gold });
  T(barLbls, BX[1], 610, 'without', { size: 28, weight: 700, anchor: 'middle', fill: '#9FC4DA' });
  const SW = BX.map(x => { const w = stopwatch(Hg, 28); tr(w, x - 34, 672); const tx = T(Hg, x - 0, 682, '0:00', { size: 30, weight: 700 }); return { w, tx }; });
  const checks = [
    { y: 330, ok: false, segs: ['more product'] },
    { y: 420, ok: false, segs: ['different products'] },
    { y: 510, ok: true, segs: ['just ', ['faster', C.energy, 800]] },
  ].map(c => { const g = G(Hg); const m = c.ok ? tick(g, 13) : cross(g, 11); tr(m, 852, c.y - 10); rich(g, 882, c.y, c.segs, { size: 30 }); return { g, y: c.y }; });

  /* ================= I. exothermic stays exothermic ================= */
  const Ig = G(root);
  const BK = [380, 780].map((x, i) => {
    const b = beaker(Ig, 170, 190, { level: 0.62, liquid: '#9FD8FF', opacity: 0.45 }); tr(b, x, 470);
    if (i) tr(rxCatalyst(Ig, 0.42), x - 40, 538);
    const hw = heatWaves(Ig, { n: 3, h: 70, spacing: 22 }); tr(hw, x - 34, 368);
    const th = thermometer(Ig, 240, C.bad); tr(th, x + 40, 532);
    const rd = T(Ig, x + 40, 262, '20 °C', { size: 32, weight: 700, anchor: 'middle' });
    T(Ig, x, 622, i ? 'with catalyst' : 'without catalyst', { size: 28, weight: 700, anchor: 'middle', fill: i ? RX.gold : '#9FC4DA' });
    return { th, rd, hw, x };
  });
  const eqSign = T(Ig, 580, 470, '=', { size: 72, weight: 700, anchor: 'middle', fill: C.good });
  const banner = T(Ig, 600, 170, 'same temperature change', { size: 40, weight: 700, anchor: 'middle' });
  const banner2 = T(Ig, 600, 214, 'exothermic stays exothermic; endothermic stays endothermic', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });

  /* ================= update ================= */
  return t => {
    /* A */
    const aA = win(t, S.first - 0.6, at('enzymes') - 0.1, 0.4);
    op(A, aA);
    if (aA > 0) {
      let n = 0, glowK = 0;
      slots.forEach(s => { op(s.g, 0); op(s.sp, 0); });
      CYC.forEach((s0, k) => {
        const sl = slots[k % 4], u = t - s0;
        if (u >= APP) n++;
        if (u <= 0 || u >= APP + HOLD + RISE) return;
        op(sl.g, 1);
        let ax, ay, bx, by, o = 1;
        if (u < APP) {
          const q = ease(u / APP);
          [ax, ay] = qb([130, 240], [360, 140], [CATX - 20, LAND], q); [bx, by] = qb([1070, 240], [840, 140], [CATX + 20, LAND], q);
          o = Math.min(1, u * 6);
        } else {
          const j = P(u, APP, 0.2), r = P(u, APP + HOLD, RISE, easeIn), gap = lerp(20, 16, j), y = lerp(LAND, 170, r);
          ax = CATX - gap; bx = CATX + gap; ay = by = y; o = 1 - P(u, APP + HOLD + RISE * 0.5, RISE * 0.5, linear);
          const q = (u - APP) / 0.6;
          if (q < 1) { op(sl.sp, Math.sin(q * Math.PI)); tr(sl.sp, CATX, LAND - 6, 0.7 + 0.6 * q); sl.sp.upd(t); glowK = Math.max(glowK, Math.sin(q * Math.PI)); }
        }
        attr(sl.a, 'cx', ax); attr(sl.a, 'cy', ay); attr(sl.b, 'cx', bx); attr(sl.b, 'cy', by); op(sl.g, o);
      });
      catA.set({ glow: 0.2 + 0.8 * glowK });
      _rxW(cntA.label, 'text', 'used ' + n + (n === 1 ? ' time' : ' times'));
      op(cntA, fade(t, CYC[0] + APP - 0.3));
      op(sameA, fade(t, mid('reuse', 0.6)));
    }

    /* B */
    const aB = win(t, at('enzymes') - 0.2, at('amylase') - 0.1, 0.4);
    op(Bg, aB);
    if (aB > 0) {
      cellB.upd(t * calm);
      const pe = P(t, at('enzymes') - 0.1, 0.6, pop); tr(enzB, 400, 440, Math.max(0.01, 0.7 + 0.3 * pe), calm * 3 * Math.sin(t * 0.9));
      [0.36, 0.18, 0.52, 0.7, 0.76].forEach((f, i) => { const p = P(t, mid('enzymes', f), 0.5, linear); op(bl[i], p); bl[i].setAttribute('transform', `translate(${((1 - p) * 24).toFixed(1)} 0)`); });
      op(siteLbl, fade(t, mid('enzymes', 0.56)));
      const tIn = mid('enzymes', 0.62), tSplit = mid('enzymes', 0.86);
      const pin = P(t, tIn, 0.9);
      const sx = lerp(700, 500, pin), sy = lerp(630, 440, pin);
      op(sub, t > tIn - 0.05 ? Math.min(1, (t - tIn) * 4) * (1 - fade(t, tSplit + 0.7, 0.4)) : 0);
      const sp = P(t, tSplit, 0.9, easeOut);
      tr(sub, sx, sy, 1, lerp(-30, 0, pin));
      tr(subH[0], -17 + sp * 70, -sp * 120, 1, sp * 40); tr(subH[1], 17 + sp * 160, sp * 70, 1, -sp * 30);
      op(subBond, t < tSplit ? 1 : 0);
      const q = (t - tSplit) / 0.6; op(spB, q > 0 && q < 1 ? Math.sin(q * Math.PI) : 0); tr(spB, 500, 440, 0.7 + 0.6 * clamp(q)); spB.upd(t);
    }

    /* C */
    const aC = win(t, at('amylase') - 0.2, at('body') - 0.1, 0.4);
    op(Cg, aC);
    if (aC > 0) {
      op(panL, fade(t, at('amylase') - 0.2));
      tr(drip, 0, 26 + 10 * ((t * 0.8) % 1)); op(drip, 1 - ((t * 0.8) % 1));
      const spread = P(t, SNIP[2].t + 0.15, 0.7);
      HEX.forEach((h, i) => tr(h.h, h.x + (Math.floor(i / 2) - 1.5) * 26 * spread, 330 + 22 * spread));
      BONDS.forEach((b, i) => {
        const s = SNIP.find(q => q.b === i);
        op(b, s && t > s.t ? 0 : 1);
        if (!s) { const k = Math.floor(i / 2) - 1.5; b.setAttribute('transform', `translate(${(k * 26 * spread).toFixed(1)} ${(22 * spread).toFixed(1)})`); }
      });
      const sw = fade(t, SNIP[2].t + 0.4, 0.5); op(starchLbl, 1 - sw); op(sugarLbl, sw);
      const pe = P(t, SNIP[2].t + 0.8, 0.5, linear); op(eqAmy, pe); tr(eqAmy, 0, (1 - pe) * 12);
      // amylase slides along under the chain and bites each bond it cuts
      let ax = lerp(40, SNIP[0].x, P(t, at('amylase') + 0.1, SNIP[0].t - at('amylase') - 0.1)), bite = 0;
      for (let k = 0; k < 3; k++) {
        const s = SNIP[k];
        if (k) ax = Math.max(ax, lerp(SNIP[k - 1].x, s.x, P(t, SNIP[k - 1].t + 0.12, s.t - SNIP[k - 1].t - 0.12)));
        bite = Math.max(bite, Math.sin(Math.PI * clamp((t - s.t + 0.15) / 0.3)));
      }
      ax = lerp(ax, 545, P(t, SNIP[2].t + 0.2, 0.8));
      tr(amy, ax, 420 - 26 * bite);
      op(amy, fade(t, at('amylase')) * (1 - fade(t, SNIP[2].t + 0.6, 0.4)));
      // yeast
      const pr = P(t, mid('amylase', 0.5), 0.5, linear); op(panR, pr);
      const rise = P(t, mid('amylase', 0.55), end('amylase') - mid('amylase', 0.55) + 0.3, easeOut), k = 1 + 1.6 * rise;
      dough.setAttribute('transform', `translate(${BOWX} ${BOWY}) scale(${(1 + 0.06 * rise).toFixed(3)} ${k.toFixed(3)})`);
      YEAST.forEach((y, i) => { attr(y.el, 'cx', BOWX + y.x * (1 + 0.06 * rise)); attr(y.el, 'cy', BOWY - 62 * k * y.f + 2 * Math.sin(t * 2 + i) * calm); });
      AIR.forEach((a, i) => { attr(a.el, 'cx', BOWX + a.x * (1 + 0.06 * rise)); attr(a.el, 'cy', BOWY - 62 * k * a.f); attr(a.el, 'r', 2 + 6 * rise * (0.6 + 0.4 * ((i * 7) % 5) / 4)); });
      brewG.forEach((g, i) => popIn(g, t, mid('amylase', 0.82 + i * 0.07), 1068, i ? 470 : 318));
    }

    /* D */
    const aD = win(t, at('body') - 0.2, at('converter') - 0.1, 0.4);
    op(Dg, aD);
    if (aD > 0) {
      man.pose({ lean: 0, armL: [10, 12], armR: [-10, 12] });
      op(hD, fade(t, mid('body', 0.1)));
      op(mWith, fade(t, mid('body', 0.12))); op(mWo, fade(t, mid('body', 0.2)));
      mWith.set(0.94 * P(t, mid('body', 0.18), 1.2, easeOut)); mWo.set(0.035 * P(t, mid('body', 0.26), 4.5, linear));
      op(okD, fade(t, mid('body', 0.32))); op(noD, fade(t, mid('body', 0.5)));
      const p37 = P(t, mid('body', 0.74), 0.6, pop);
      t37.setAttribute('transform', `translate(335 310) scale(${(1 + 0.18 * Math.sin(Math.PI * clamp(p37))).toFixed(3)}) translate(-335 -310)`);
      t37.setAttribute('fill', p37 > 0.05 && p37 < 1 ? C.energy : C.ink);
    }

    /* E-F: the converter */
    const aE = win(t, at('converter') - 0.2, at('test') - 0.1, 0.4);
    op(Eg, aE);
    if (aE > 0) {
      const drive = P(t, at('converter') - 0.2, 1.0, easeOut);
      const z = P(t, mid('converter', 0.3), 1.1);
      const cx = lerp(lerp(1300, 600, drive), CAR1[0], z), cy = lerp(450, CAR1[1], z), cs = lerp(1, CAR1[2], z);
      tr(carG, cx, cy, `${(-cs).toFixed(4)} ${cs.toFixed(4)}`);
      car.wheels.forEach(w => tr(w.w, w.x, -30, 1, (cx * 2.2) % 360));
      const kx = lerp(cx - 30, CONV[0], z), ky = lerp(cy - 14, CONV[1], z), ks = lerp(0.18, 1, z);
      tr(conv, kx, ky, ks);
      op(conv, z > 0 ? 1 : 0);
      const ex = [cx + 206 * cs, cy - 30 * cs], inl = [kx - (CW / 2 + 40) * ks, ky], outl = [kx + (CW / 2 + 40) * ks, ky], tail = [lerp(outl[0] + 30, 1120, z), ky];
      const pd = `M${ex[0].toFixed(1)},${ex[1].toFixed(1)} C${(ex[0] + 70 * cs).toFixed(1)},${ex[1].toFixed(1)} ${(inl[0] - 70 * ks).toFixed(1)},${inl[1].toFixed(1)} ${inl[0].toFixed(1)},${inl[1].toFixed(1)} M${outl[0].toFixed(1)},${outl[1].toFixed(1)} L${tail[0].toFixed(1)},${tail[1].toFixed(1)}`;
      pipeOut.setAttribute('d', pd); pipeIn.setAttribute('d', pd);
      op(pipe, z > 0 ? 1 : 0);
      const cut = P(t, mid('converter', 0.52), 0.8, linear);
      op(cover, 1 - 0.92 * cut); op(cutLine, z >= 1 ? 1 - cut : 0);
      op(combGlow, cut * (0.25 + 0.2 * wave(t, 1.6)));
      op(convTitle, fade(t, mid('converter', 0.42))); op(exhLbl, fade(t, mid('converter', 0.45)) * (1 - fade(t, at('co'), 0.3)));
      op(ptLeg, fade(t, mid('converter', 0.72)));
      // the gases: two CO and one O2 in, two CO2 out
      const flowOn = t > at('co') - 0.1;
      const IN = [[ex[0], ex[1]], [ex[0] + 70, ex[1]], [inl[0] - 70, inl[1]], [inl[0], inl[1]], [CONV[0] - 10, CONV[1]]];
      const along = (pts, u) => { let L = 0; const seg = []; for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(l); L += l; } let d = clamp(u) * L; for (let i = 0; i < seg.length; i++) { if (d <= seg[i] || i === seg.length - 1) { const f = seg[i] ? d / seg[i] : 0; return [lerp(pts[i][0], pts[i + 1][0], f), lerp(pts[i][1], pts[i + 1][1], f)]; } d -= seg[i]; } return pts[pts.length - 1]; };
      GROUPS.forEach((gr, k) => {
        const t0 = at('co') + 0.2 + k * 2.3, u = t - t0;
        if (!flowOn || u < 0 || u > 4.6) { op(gr.g, 0); return; }
        op(gr.g, 1);
        const TIN = 2.0, TOUT = 2.0;
        gr.ins.forEach((m, j) => {
          const q = (u - j * 0.28) / TIN;
          if (q < 0 || q > 1.05) { op(m, 0); return; }
          const p = along(IN, Math.min(1, q)), mm = [-12, 12, 0][j];
          tr(m, p[0], p[1] + (q > 0.7 ? mm * P(q, 0.7, 0.3) : 0), 1, (u * 60 + j * 90) * calm);
          op(m, Math.min(1, q * 8) * (1 - P(q, 0.95, 0.1, linear)));
        });
        const rq = (u - TIN - 0.3) / 0.6;
        op(gr.sp, rq > -0.5 && rq < 1 ? Math.sin(clamp(rq + 0.5) / 1.5 * Math.PI) : 0); tr(gr.sp, CONV[0], CONV[1], 1); gr.sp.upd(t);
        gr.outs.forEach((m, j) => {
          const q = (u - TIN - 0.2 - j * 0.35) / TOUT;
          if (q < 0 || q > 1) { op(m, 0); return; }
          const x = lerp(CONV[0] + 10, 1150, easeIn(q) * 0.4 + q * 0.6);
          tr(m, x, CONV[1] + (j ? 10 : -10) * (1 - q), 1, (u * 50 + j * 70) * calm);
          op(m, Math.min(1, q * 8) * (1 - P(q, 0.85, 0.15, linear)));
        });
      });
      op(coLbl, fade(t, mid('co', 0.12))); op(co2Lbl, fade(t, mid('co', 0.55)));
      op(eqF, fade(t, mid('co', 0.7), 0.5));
    }

    /* G: the test */
    const aG = win(t, at('test') - 0.2, at('not') - 0.1, 0.4);
    op(Gg, aG);
    if (aG > 0) {
      const tGo = mid('test', 0.28), tBack = mid('test', 0.62), FLY = 0.9;
      const go = P(t, tGo, FLY), back = P(t, tBack, FLY);
      let p;
      if (back > 0) p = qb(CFL, [620, 200], CPAN, back);
      else p = qb(CPAN, [620, 200], CFL, go);
      tr(catG, p[0], p[1], 1, (go > 0 && go < 1 ? go * 180 : 0) + (back > 0 && back < 1 ? back * 180 : 0));
      const onPan = go <= 0 || back >= 1;
      bal.set({ reading: onPan ? 2 : 0, flash: back >= 1 ? 1 - fade(t, tBack + FLY + 0.6, 0.6) : 0 });
      const r0 = P(t, tGo + FLY - 0.1, 0.6);
      bubG.upd(t, 0.25 + 0.75 * (back > 0 ? 1 - back : r0));
      rateM.set(lerp(0.18, 0.9, r0));
      op(fasterChip, fade(t, tGo + FLY + 0.3));
      op(beforeChip, 1 - fade(t, tBack + FLY - 0.2, 0.3)); op(afterChip, fade(t, tBack + FLY - 0.1, 0.3));
      op(sameG, fade(t, tBack + FLY + 0.2));
      op(filterNote, win(t, tBack - 0.3, tBack + FLY + 1.2, 0.3));
    }

    /* H: same product, same amount */
    const aH = win(t, at('not') - 0.2, at('exoendo') - 0.1, 0.4);
    op(Hg, aH);
    if (aH > 0) {
      const t0 = at('not') + 0.2, tW = mid('not', 0.34) - t0, tWo = mid('not', 0.92) - t0;
      const fW = P(t, t0, tW, linear), fWo = P(t, t0, tWo, linear);
      [fW, fWo].forEach((f, i) => {
        const h = BH * f, b = bars[i];
        attr(b.r, 'y', BASE - h); attr(b.r, 'height', h);
        tr(b.pg, b.x, BASE - h - 22); op(b.pg, f > 0.02 ? 1 : 0);
        const secs = Math.round(f * (i ? 300 : 60)), tx = SW[i].tx;
        _rxW(tx, 'text', Math.floor(secs / 60) + ':' + String(secs % 60).padStart(2, '0'));
        SW[i].w.set(f * (i ? 5 : 1));
      });
      const lv = fade(t, mid('not', 0.34), 0.4); op(sameLine, lv); op(sameLbl, lv);
      checks.forEach((c, i) => { const p = P(t, mid('not', [0.12, 0.42, 0.7][i]), 0.45, linear); op(c.g, p); tr(c.g, (1 - p) * 20, 0); });
    }

    /* I: exothermic stays exothermic */
    const aI = P(t, at('exoendo') - 0.2, 0.4, linear);
    op(Ig, aI);
    if (aI > 0) {
      const t0 = mid('exoendo', 0.1);
      BK.forEach((b, i) => {
        const f = i ? P(t, t0, mid('exoendo', 0.5) - t0, easeOut) : P(t, t0, mid('exoendo', 0.95) - t0, linear);
        b.th.set(0.28 + 0.42 * f); _rxW(b.rd, 'text', Math.round(20 + 15 * f) + ' °C');
        b.hw.upd(t * calm + i); op(b.hw, 0.9 * Math.min(1, f * 3));
      });
      op(banner, fade(t, mid('exoendo', 0.3))); op(banner2, fade(t, mid('exoendo', 0.6)));
      const ep = P(t, mid('exoendo', 0.97), 0.4, pop); op(eqSign, clamp(ep * 2));
    }
  };
});
