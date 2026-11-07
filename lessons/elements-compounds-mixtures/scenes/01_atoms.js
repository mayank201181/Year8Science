/* Chapter 1: Atoms, elements and symbols.
   A phone and a wisp of air -> zoom into the phone's metal: packed atoms, too small for a microscope
   -> a gold bar: every atom the same (element = one type of atom) -> a chemical reaction bounces off a
   gold atom -> the periodic table builds itself to 118 and five elements light up -> C, O and Mg tiles
   fly out -> capital first letter, lower-case second -> big N, small a: Na, not NA
   -> Co is cobalt, CO is carbon monoxide. */
scene('atoms', S => {
  const { at, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;

  /* ---------- helpers ---------- */
  const EL = { Na: '#B48CFF', Cl: '#6FD96F', N: '#5B8CFF', Fe: '#C27A4A', S: '#FFD84A', Mg: '#9FE3B0', Au: '#FFC94A', Cu: '#E08A4F', Zn: '#A9B8C8', Ar: '#C9B8FF' };
  const shade = (hex, k) => '#' + [1, 3, 5].map(i => Math.round(parseInt(hex.slice(i, i + 2), 16) * k).toString(16).padStart(2, '0')).join('');
  function elAtom(parent, sym, r, o) {
    o = o || {};
    const col = EL[sym], dk = shade(col, 0.58);
    const g = o.x === undefined ? G(parent) : parent, x = o.x || 0, y = o.y || 0;
    E('circle', { cx: x, cy: y, r, fill: ball(col, dk), stroke: dk, 'stroke-width': Math.max(1.5, r * 0.08) }, g);
    if (o.letter !== false) {
      const size = r * (sym.length > 1 ? 0.92 : 1.05);
      E('text', { x, y: (y + size * 0.36).toFixed(1), 'font-size': size.toFixed(1), 'font-weight': 700, 'font-family': FD, 'text-anchor': 'middle', fill: '#FFFFFF', stroke: shade(col, 0.4), 'stroke-width': Math.max(1.2, r * 0.09).toFixed(1), 'paint-order': 'stroke', 'stroke-linejoin': 'round' }, g).textContent = sym;
    }
    return g;
  }
  function rich(parent, x, y, segs, o) {
    o = o || {};
    const t = E('text', { x, y, 'font-size': o.size || 30, 'font-weight': o.weight || 600, 'font-family': o.font || FD, 'text-anchor': o.anchor || 'start', fill: o.fill || C.ink }, parent);
    segs.forEach(s => { if (typeof s === 'string') s = [s]; E('tspan', { fill: s[1], 'font-weight': s[2] }, t).textContent = s[0]; });
    return t;
  }
  const lum = hex => { const v = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16)); return (0.299 * v[0] + 0.587 * v[1] + 0.114 * v[2]) / 255; };

  /* ================= A. everything is made of atoms ================= */
  const A = G(root);
  const ZC = [672, 400], ZR = 196;                        // zoom circle
  const phoneG = G(A); tr(phoneG, 230, 452);
  E('rect', { x: -78, y: -150, width: 156, height: 300, rx: 28, fill: linGrad('#D5DEE4', '#7A8995'), stroke: '#EEF4F7', 'stroke-width': 2 }, phoneG);
  E('rect', { x: -69, y: -140, width: 138, height: 280, rx: 21, fill: '#0B1E2A' }, phoneG);
  E('rect', { x: -62, y: -124, width: 124, height: 240, rx: 13, fill: linGrad('#1F6182', '#10293A', true) }, phoneG);
  ['#FF6B5C', '#FFC247', '#56D69B', '#4CC9F0', '#B48CFF', '#FF8A3D', '#5BD27A', '#F7A8C8', '#9FD8FF', '#FFE45C', '#FF5FA2', '#8F9CAB']
    .forEach((c, i) => E('rect', { x: -46 + (i % 3) * 34, y: -106 + Math.floor(i / 3) * 38, width: 24, height: 24, rx: 7, fill: c, opacity: 0.92 }, phoneG));
  E('rect', { x: -24, y: 126, width: 48, height: 5, rx: 2.5, fill: '#5E7A8C' }, phoneG);
  const airG = G(A), airs = [0, 1, 2].map(i => E('path', { fill: 'none', stroke: C.air, 'stroke-width': 6, 'stroke-linecap': 'round', opacity: 0.8 }, airG));
  const airLbl = T(A, 230, 268, 'air', { size: 28, weight: 600, anchor: 'middle', fill: C.air });
  // the lens on the object, joined to the zoom circle
  const lens = G(root);
  E('circle', { r: 20, fill: 'rgba(159,216,255,0.12)', stroke: '#E4EDF2', 'stroke-width': 4 }, lens);
  const coneG = G(root);
  const cone1 = E('line', { stroke: '#E4EDF2', 'stroke-width': 2.5, opacity: 0.5, 'stroke-dasharray': '6 7' }, coneG);
  const cone2 = E('line', { stroke: '#E4EDF2', 'stroke-width': 2.5, opacity: 0.5, 'stroke-dasharray': '6 7' }, coneG);
  const zoomG = G(root); tr(zoomG, ZC[0], ZC[1]);
  const zBack = E('circle', { r: ZR, fill: '#0C2533' }, zoomG);
  const zcp = E('clipPath', { id: 'ecm-atoms-zoom' }, defs()); E('circle', { r: ZR - 4 }, zcp);
  const zIn = G(zoomG, { 'clip-path': 'url(#ecm-atoms-zoom)' });
  const zRim = E('circle', { r: ZR, fill: 'none', stroke: '#E4EDF2', 'stroke-width': 10 }, zoomG);
  const SILVER = ball('#C3CED6', '#66737E'), GOLD = ball(EL.Au, shade(EL.Au, 0.58));
  const zAtoms = [], zLetters = G(zIn), AR = 25, AS = 52;
  {
    const zr = rng(14);
    for (let j = -5; j <= 5; j++) for (let i = -5; i <= 5; i++) {
      const x = i * AS + (j % 2 ? AS / 2 : 0), y = j * AS * 0.866;
      if (Math.hypot(x, y) > ZR + AR * 0.5) continue;
      const c = E('circle', { cx: x, cy: y, r: AR, fill: SILVER, stroke: '#5A6670', 'stroke-width': 2 }, zIn);
      zAtoms.push({ c, x, y, ph: zr() * TAU, ph2: zr() * TAU, sw: (x + ZR) / (2 * ZR) * 1.1 + zr() * 0.25, centre: i === 0 && j === 0 });
    }
    zIn.appendChild(zLetters);
    zAtoms.forEach(a => { a.l = E('text', { x: a.x, y: a.y + 8, 'font-size': 23, 'font-weight': 700, 'font-family': FD, 'text-anchor': 'middle', fill: '#FFFFFF', stroke: shade(EL.Au, 0.4), 'stroke-width': 2.2, 'paint-order': 'stroke', 'stroke-linejoin': 'round' }, zLetters); a.l.textContent = 'Au'; });
  }
  const atomsLbl = T(root, ZC[0], 664, 'atoms', { size: 44, weight: 700, anchor: 'middle', fill: C.energy });
  const elemLbl = rich(root, ZC[0], 664, [['element', C.energy, 800], [' = one type of atom', C.ink, 600]], { size: 38, anchor: 'middle' });
  // the microscope can't see them
  const micG = G(A); tr(micG, 1040, 392);
  {
    const m = '#A9BCC9', d = '#5E7A8C';
    E('rect', { x: -60, y: 70, width: 120, height: 18, rx: 8, fill: m, stroke: d, 'stroke-width': 3 }, micG);
    E('path', { d: 'M30,72 L30,36 Q30,-14 -2,-44', fill: 'none', stroke: m, 'stroke-width': 20, 'stroke-linecap': 'round' }, micG);
    E('rect', { x: -56, y: 12, width: 84, height: 11, rx: 4, fill: m, stroke: d, 'stroke-width': 2.5 }, micG);
    const tube = G(micG); tube.setAttribute('transform', 'translate(-16 -40) rotate(-28)');
    E('rect', { x: -14, y: -64, width: 28, height: 90, rx: 6, fill: '#D3DEE5', stroke: d, 'stroke-width': 3 }, tube);
    E('rect', { x: -10, y: -84, width: 20, height: 24, rx: 4, fill: '#7D8C99', stroke: d, 'stroke-width': 2.5 }, tube);
    E('rect', { x: -7, y: 24, width: 14, height: 22, rx: 3, fill: '#7D8C99', stroke: d, 'stroke-width': 2.5 }, tube);
    E('circle', { cx: 38, cy: 26, r: 10, fill: '#7D8C99', stroke: d, 'stroke-width': 2.5 }, micG);
  }
  const micX = cross(A, 54); tr(micX, 1040, 392);
  const micLbl = T(A, 1040, 548, 'too small to see', { size: 28, weight: 600, anchor: 'middle', fill: C.muted });

  /* ================= B. a gold bar: an element ================= */
  const barG = G(root); tr(barG, 232, 452);
  const BAR_F = 'M-122,52 L-98,-22 L98,-22 L122,52 Z', BAR_T = 'M-98,-22 L-80,-54 L80,-54 L98,-22 Z';
  E('path', { d: BAR_F, fill: linGrad('#F9CC55', '#B07A12', true), stroke: '#FFE7A0', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, barG);
  E('path', { d: BAR_T, fill: linGrad('#FFF2C2', '#FFD15A', true), stroke: '#FFF2C2', 'stroke-width': 2, 'stroke-linejoin': 'round' }, barG);
  T(barG, 0, 30, 'Au', { size: 38, weight: 700, anchor: 'middle', fill: '#8A5C0C' });
  const bcp = E('clipPath', { id: 'ecm-atoms-bar' }, defs()); E('path', { d: 'M-122,52 L-98,-22 L-80,-54 L80,-54 L98,-22 L122,52 Z' }, bcp);
  const sheenG = G(barG, { 'clip-path': 'url(#ecm-atoms-bar)' });
  const sheen = E('rect', { x: -22, y: -80, width: 34, height: 170, fill: '#FFFFFF', opacity: 0.45, transform: 'rotate(20)' }, sheenG);
  const barLbl = T(barG, 0, 102, 'pure gold', { size: 30, weight: 600, anchor: 'middle', fill: EL.Au });

  /* ================= C. a chemical reaction can't split it ================= */
  const Cg = G(root);
  const bigAu = elAtom(Cg, 'Au', 80);
  const launcher = chip(Cg, 'chemical reaction', { size: 28, fill: C.card2, stroke: C.energy, color: C.energy }); tr(launcher, 1010, 176);
  const shot = G(Cg); arrow(shot, -150, 0, 0, 0, { color: C.energy, width: 10 });
  const hit = spark(Cg, 30, { seed: 5 });
  const cantChip = chip(Cg, 'can’t be broken down', { size: 30, fill: C.card2, stroke: '#E9EFF3', sw: 2.5 }); tr(cantChip, ZC[0], 566);

  /* ================= D. the periodic table ================= */
  const SYM = ('H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn Ga Ge As Se Br Kr '
    + 'Rb Sr Y Zr Nb Mo Tc Ru Rh Pd Ag Cd In Sn Sb Te I Xe Cs Ba La Ce Pr Nd Pm Sm Eu Gd Tb Dy Ho Er Tm Yb Lu '
    + 'Hf Ta W Re Os Ir Pt Au Hg Tl Pb Bi Po At Rn Fr Ra Ac Th Pa U Np Pu Am Cm Bk Cf Es Fm Md No Lr '
    + 'Rf Db Sg Bh Hs Mt Ds Rg Cn Nh Fl Mc Lv Ts Og').split(' ');
  /* [row, column]: rows 1-7 are the periods, 8 and 9 the two f-block rows under columns 4-17 */
  function cell(z) {
    if (z === 1) return [1, 1];
    if (z === 2) return [1, 18];
    if (z <= 10) return [2, z <= 4 ? z - 2 : z + 8];
    if (z <= 18) return [3, z <= 12 ? z - 10 : z];
    if (z <= 36) return [4, z - 18];
    if (z <= 54) return [5, z - 36];
    if (z <= 57) return [6, z - 54];
    if (z <= 71) return [8, z - 54];
    if (z <= 86) return [6, z - 68];
    if (z <= 89) return [7, z - 86];
    if (z <= 103) return [9, z - 86];
    return [7, z - 100];
  }
  const PIT = 52, TS = 48, TX = 132, TY = 128, FGAP = 14;
  const cxy = z => { const [r, c] = cell(z); return [TX + (c - 1) * PIT + TS / 2, TY + (r - 1) * PIT + (r > 7 ? FGAP : 0) + TS / 2]; };
  const tab = G(root), tilesG = G(tab), tiles = [];
  for (let z = 1; z <= 118; z++) {
    const [x, y] = cxy(z);
    const box = E('rect', { x: x - TS / 2, y: y - TS / 2, width: TS, height: TS, rx: 7, fill: C.card2, stroke: C.line, 'stroke-width': 2 }, tilesG);
    const sym = E('text', { x, y: y + 8, 'font-size': 24, 'font-weight': 700, 'font-family': FD, 'text-anchor': 'middle', fill: '#C9D8E2' }, tilesG);
    sym.textContent = SYM[z - 1];
    tiles.push({ z, x, y, box, sym, last: -1 });
  }
  const NAMED = [
    { z: 8, name: 'oxygen', col: C.oxygen, f: 0.53 }, { z: 26, name: 'iron', col: EL.Fe, f: 0.63 },
    { z: 79, name: 'gold', col: EL.Au, f: 0.69 }, { z: 6, name: 'carbon', col: C.carbon, f: 0.77 },
    { z: 1, name: 'hydrogen', col: C.hydrogen, f: 0.84 },
  ].map(n => {
    const [x, y] = cxy(n.z), g = G(tab);
    E('circle', { r: 46, fill: glow(n.col) }, g);
    E('rect', { x: -TS / 2, y: -TS / 2, width: TS, height: TS, rx: 7, fill: n.col, stroke: '#FFFFFF', 'stroke-width': 2.5 }, g);
    E('text', { x: 0, y: 8, 'font-size': 24, 'font-weight': 800, 'font-family': FD, 'text-anchor': 'middle', fill: lum(n.col) > 0.55 ? C.bg0 : '#FFFFFF' }, g).textContent = SYM[n.z - 1];
    return Object.assign(n, { g, x, y });
  });
  const counter = G(root);
  const cNum = T(counter, 496, 222, '0', { size: 76, weight: 700, anchor: 'middle', fill: C.energy });
  T(counter, 496, 264, 'elements', { size: 30, weight: 600, anchor: 'middle', fill: C.muted });
  const legend = G(root);
  {
    const items = NAMED.map(n => { const txt = n.sym = SYM[n.z - 1]; return { n, w: textWidth(txt + '  ' + n.name, 28, FD, 700) + 40 }; });
    const GAP = 18, tot = items.reduce((s, it) => s + it.w, 0) + GAP * (items.length - 1);
    let x = 600 - tot / 2;
    items.forEach(it => {
      const g = G(legend), cx = x + it.w / 2;
      E('rect', { x: -it.w / 2, y: -25, width: it.w, height: 50, rx: 25, fill: C.card2, stroke: it.n.col, 'stroke-width': 3 }, g);
      rich(g, 0, 10, [[it.n.sym + '  ', it.n.col, 800], [it.n.name, C.ink, 600]], { size: 28, anchor: 'middle' });
      tr(g, cx, 666); it.n.chip = g; it.n.cx = cx;
      x += it.w + GAP;
    });
  }

  /* ================= E-F. symbol tiles: C, O, Mg ================= */
  const symTxt = rich(root, 600, 652, ['a ', ['chemical symbol', C.energy, 800], ': one or two letters'], { size: 34, anchor: 'middle' });
  const BIG = 170;
  function symTile(sym, name, col) {
    const g = G(root), h = BIG / 2;
    E('rect', { x: -h, y: -h, width: BIG, height: BIG, rx: 24, fill: C.card2 }, g);
    E('rect', { x: -h, y: -h, width: BIG, height: BIG, rx: 24, fill: col, opacity: 0.2, stroke: col, 'stroke-width': 6 }, g);
    g.halos = G(g);
    g.sym = T(g, 0, 26, sym, { size: 92, weight: 700, anchor: 'middle', fill: '#FFFFFF' });
    g.name = T(g, 0, 66, name, { size: 26, weight: 700, anchor: 'middle', fill: col === C.carbon ? '#C9D3DC' : col });
    return g;
  }
  const FLY = [
    { z: 6, sym: 'C', name: 'carbon', col: C.carbon, x: 330, f: 0.46 },
    { z: 8, sym: 'O', name: 'oxygen', col: C.oxygen, x: 600, f: 0.61 },
    { z: 12, sym: 'Mg', name: 'magnesium', col: EL.Mg, x: 870, f: 0.78 },
  ].map(d => Object.assign(d, { g: symTile(d.sym, d.name, d.col) }));
  const TROW = 478, MG = FLY[2];
  // Mg: capital M, lower-case g (letters drawn separately so each can glow)
  const wM = textWidth('M', 92, FD, 700), wg = textWidth('g', 92, FD, 700);
  const mX = -(wM + wg) / 2 + wM / 2, gX = (wM + wg) / 2 - wg / 2;
  MG.g.sym.style.display = 'none';
  const hM = E('ellipse', { cx: mX, cy: -6, rx: wM * 0.8, ry: 58, fill: glow(C.energy) }, MG.g.halos);
  const hg = E('ellipse', { cx: gX, cy: 4, rx: wg * 0.9, ry: 58, fill: glow('#5CE1FF') }, MG.g.halos);
  const tM = T(MG.g, mX, 26, 'M', { size: 92, weight: 700, anchor: 'middle', fill: '#FFFFFF' });
  const tg = T(MG.g, gX, 26, 'g', { size: 92, weight: 700, anchor: 'middle', fill: '#FFFFFF' });
  const RS = 1.75, RC = [600, 392];                          // the Mg tile, grown, in the rules beat
  const capLbl = G(root), lowLbl = G(root);
  {
    const xm = RC[0] + mX * RS, xg = RC[0] + gX * RS;
    E('line', { x1: xm, y1: 188, x2: xm, y2: RC[1] - 62 * RS + 8, stroke: C.energy, 'stroke-width': 3 }, capLbl);
    E('circle', { cx: xm, cy: RC[1] - 62 * RS + 8, r: 5, fill: C.energy }, capLbl);
    T(capLbl, xm, 172, 'capital', { size: 34, weight: 700, anchor: 'middle', fill: C.energy });
    E('line', { x1: xg, y1: 616, x2: xg, y2: RC[1] + 52 * RS, stroke: '#5CE1FF', 'stroke-width': 3 }, lowLbl);
    E('circle', { cx: xg, cy: RC[1] + 52 * RS, r: 5, fill: '#5CE1FF' }, lowLbl);
    T(lowLbl, xg, 652, 'lower case', { size: 34, weight: 700, anchor: 'middle', fill: '#5CE1FF' });
  }

  /* ================= G. big then small ================= */
  const Gb = G(root);
  const bsTitle = rich(Gb, 600, 196, [['Big', C.energy, 800], [' then small', C.ink, 600]], { size: 52, anchor: 'middle' });
  const NA_X = 420, NA_Y = 500, NS = 230;
  const wN = textWidth('N', NS, FD, 700), wa = textWidth('a', NS, FD, 700);
  const bigN = T(Gb, NA_X - (wN + wa) / 2 + wN / 2, NA_Y, 'N', { size: NS, weight: 700, anchor: 'middle', fill: EL.Na });
  const smallA = T(Gb, NA_X + (wN + wa) / 2 - wa / 2, NA_Y, 'a', { size: NS, weight: 700, anchor: 'middle', fill: EL.Na });
  const naName = T(Gb, NA_X, 584, 'sodium', { size: 32, weight: 600, anchor: 'middle', fill: C.muted });
  const wrong = G(Gb);
  T(wrong, 870, 476, 'NA', { size: 150, weight: 700, anchor: 'middle', fill: C.faint });
  const wrongX = cross(wrong, 62); tr(wrongX, 870, 424);

  /* ================= H. Co vs CO ================= */
  const Hc = G(root);
  function symbolPair(parent, cx, second) {
    const g = G(parent), size = 120;
    const wC = textWidth('C', size, FD, 700), w2 = textWidth(second, size, FD, 700);
    g.cx0 = cx - (wC + w2) / 2 + wC / 2;
    g.c = T(g, g.cx0, 292, 'C', { size, weight: 700, anchor: 'middle', fill: '#FFFFFF' });
    g.x2 = cx + (wC + w2) / 2 - w2 / 2;
    return g;
  }
  function lump(parent) {
    const g = G(parent);
    E('path', { d: 'M-70,22 C-82,-10 -56,-46 -14,-44 C14,-60 62,-46 70,-14 C86,12 64,44 26,42 C0,56 -50,52 -70,22 Z', fill: linGrad('#C9D4E2', '#5E6E84', true), stroke: '#E1E8F0', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, g);
    E('path', { d: 'M-40,-22 Q-14,-38 18,-30', stroke: '#FFFFFF', 'stroke-width': 5, fill: 'none', opacity: 0.6, 'stroke-linecap': 'round' }, g);
    E('path', { d: 'M20,10 Q36,4 48,-8', stroke: '#FFFFFF', 'stroke-width': 4, fill: 'none', opacity: 0.35, 'stroke-linecap': 'round' }, g);
    return g;
  }
  const cardCo = G(Hc), cardCO = G(Hc);
  card(cardCo, 120, 150, 420, 460, { fill: C.card, stroke: C.line });
  card(cardCO, 660, 150, 420, 460, { fill: C.card, stroke: C.line });
  const pL = symbolPair(cardCo, 330, 'o'), pR = symbolPair(cardCO, 870, 'o');
  const oL = T(cardCo, pL.x2, 292, 'o', { size: 120, weight: 700, anchor: 'middle', fill: '#FFFFFF' });
  const oR = T(cardCO, pR.x2, 292, 'o', { size: 120, weight: 700, anchor: 'middle', fill: '#FFFFFF' });
  const wC2 = textWidth('C', 120, FD, 700), wO2 = textWidth('O', 120, FD, 700);
  const OR = T(cardCO, 870 + (wC2 + wO2) / 2 - wO2 / 2, 292, 'O', { size: 120, weight: 700, anchor: 'middle', fill: '#FFFFFF' });
  const lumpL = lump(cardCo); tr(lumpL, 330, 430);
  const lumpR = lump(cardCO); tr(lumpR, 870, 430);
  const coMol = G(cardCO); tr(coMol, 870, 430);
  const CK = 0.72 * 44;                                    // touching atoms with a short bond line, as in 03_molecules
  const coC = atom(coMol, 'C', 44, { letter: true }); tr(coC, -CK, 0);
  const coO = atom(coMol, 'O', 44, { letter: true }); tr(coO, CK, 0);
  E('line', { x1: -13.2, y1: 0, x2: 13.2, y2: 0, stroke: '#F4FAFD', 'stroke-width': 8.8, 'stroke-linecap': 'round', opacity: 0.9 }, coMol);
  const nameCo = rich(cardCo, 330, 560, [['cobalt', C.ink, 700], [', a metal', C.muted, 600]], { size: 32, anchor: 'middle' });
  const nameCo2 = rich(cardCO, 870, 560, [['cobalt', C.ink, 700], [', a metal', C.muted, 600]], { size: 32, anchor: 'middle' });
  const nameCO = rich(cardCO, 870, 560, [['carbon monoxide', C.ink, 700]], { size: 32, anchor: 'middle' });
  const noteCO = rich(Hc, 600, 668, [['two capitals', C.energy, 800], [' = two elements', C.ink, 600]], { size: 34, anchor: 'middle' });

  /* ================= update ================= */
  return t => {
    const tEl = at('element'), tSi = at('simpler'), tTa = at('table'), tSy = at('symbol'), tRu = at('rules'), tBi = at('big'), tCo = at('cobalt');

    /* --- A: phone, air, zoom, microscope --- */
    const aA = Math.min(P(t, S.first - 0.3, 0.5, linear), 1 - P(t, tEl - 0.1, 0.5, linear));
    op(A, aA);
    if (aA > 0) {
      const pp = P(t, S.first - 0.2, 0.6, pop), pulse = 0.05 * Math.sin(Math.PI * P(t, mid('atoms', 0.25), 0.5, linear));
      tr(phoneG, 230, 452, (0.85 + 0.15 * pp) * (1 + pulse));
      op(airG, P(t, mid('atoms', 0.14), 0.5, linear)); op(airLbl, P(t, mid('atoms', 0.17), 0.5, linear));
      airs.forEach((p, i) => {
        let d = ''; const y0 = 190 + i * 22, x0 = 120 + i * 18, len = 220 - i * 30;
        for (let k = 0; k <= 12; k++) { const x = x0 + k * len / 12, y = y0 + 9 * Math.sin(k * 0.8 - t * 3 * calm + i); d += (k ? 'L' : 'M') + x.toFixed(1) + ',' + y.toFixed(1); }
        p.setAttribute('d', d);
      });
      op(micG, P(t, mid('atoms', 0.68), 0.5, linear));
      const xp = P(t, mid('atoms', 0.88), 0.4, pop); op(micX, clamp(xp * 2)); tr(micX, 1040, 392, Math.max(0.01, xp));
      op(micLbl, P(t, mid('atoms', 0.8), 0.5, linear));
    }
    // lens + cone: on the phone's metal frame, then on the gold bar
    const lensP = P(t, mid('atoms', 0.36), 0.5, pop), lensOut = 1 - P(t, tSi + 0.1, 0.5, linear);
    const onBar = P(t, tEl, 0.6);
    const lx = lerp(304, 286, onBar), ly = lerp(384, 448, onBar);
    op(lens, clamp(lensP * 2) * lensOut); tr(lens, lx, ly, Math.max(0.01, lensP));
    const zp = P(t, mid('atoms', 0.38), 0.9, easeOut), zOut = P(t, tSi + 0.15, 0.6, linear);
    op(coneG, zp * (1 - zOut)); op(zoomG, clamp(zp * 2) * (zOut >= 1 && t > tSi + 0.3 ? 0 : 1));
    if (zp > 0 && !(zOut >= 1 && t > tSi + 0.3)) {
      attr(cone1, 'x1', lx); attr(cone1, 'y1', ly - 20); attr(cone1, 'x2', ZC[0]); attr(cone1, 'y2', ZC[1] - ZR);
      attr(cone2, 'x1', lx); attr(cone2, 'y1', ly + 20); attr(cone2, 'x2', ZC[0]); attr(cone2, 'y2', ZC[1] + ZR);
      tr(zoomG, ZC[0], ZC[1], 0.3 + 0.7 * zp);
      op(zBack, 1 - zOut); op(zRim, 1 - zOut);
      const tGold = tEl + 0.2, letters = P(t, mid('element', 0.86), 0.5, linear);
      op(zLetters, letters * (1 - zOut));
      zAtoms.forEach(a => {
        const jx = Math.sin(t * 7.3 + a.ph) * 1.4 * calm, jy = Math.cos(t * 6.1 + a.ph2) * 1.4 * calm;
        const u = clamp((t - tGold - a.sw) / 0.35), f = u > 0.5 ? GOLD : SILVER;
        if (a.f !== f) { a.c.setAttribute('fill', f); a.f = f; }
        const rv = AR * (1 + 0.28 * Math.sin(Math.PI * u));       // memo: write only when it changes
        if (a.rv !== rv) { attr(a.c, 'r', rv); a.rv = rv; }
        attr(a.c, 'cx', a.x + jx); attr(a.c, 'cy', a.y + jy);
        if (letters > 0) { attr(a.l, 'x', a.x + jx); attr(a.l, 'y', a.y + 8 + jy); }
        op(a.c, a.centre ? (t < tSi + 0.15 ? 1 : 0) : 1 - zOut);
        if (a.centre) op(a.l, t < tSi + 0.15 ? 1 : 0); else op(a.l, 1 - zOut);
      });
    }
    op(atomsLbl, win(t, mid('atoms', 0.52), tEl + 0.1, 0.4));
    op(elemLbl, win(t, mid('element', 0.22), tSi + 0.3, 0.4));

    /* --- B: gold bar --- */
    const aB = Math.min(P(t, tEl - 0.1, 0.6, linear), 1 - P(t, tTa - 0.1, 0.45, linear));
    op(barG, aB);
    if (aB > 0) {
      const bp = P(t, tEl - 0.1, 0.6, pop);
      tr(barG, 232, 452, 0.85 + 0.15 * bp);
      const sw = clamp((t - mid('element', 0.6)) / 1.1);
      tr(sheen, lerp(-170, 170, sw), 0, 1, 20); op(sheen, sw > 0 && sw < 1 ? 1 : 0);
      op(barLbl, P(t, mid('element', 0.7), 0.5, linear));
    }

    /* --- C: the chemical reaction bounces off --- */
    const aC = Math.min(P(t, tSi + 0.1, 0.3, linear), 1 - P(t, tTa - 0.1, 0.45, linear));
    op(Cg, aC);
    if (aC > 0) {
      const gp = P(t, tSi + 0.15, 0.9, easeOut);
      let sx = 1, sy = 1;
      const strikes = [mid('simpler', 0.36), mid('simpler', 0.8)];
      const Lp = [1004, 232], dir = [ZC[0] - Lp[0], ZC[1] - Lp[1]], dl = Math.hypot(dir[0], dir[1]), dn = [dir[0] / dl, dir[1] / dl];
      const Ip = [ZC[0] - dn[0] * 86, ZC[1] - dn[1] * 86], ang = Math.atan2(dn[1], dn[0]) * 180 / Math.PI;
      let shotOn = 0, hitP = -1;
      strikes.forEach(s0 => {
        const u = (t - s0) / 0.42, v = (t - s0 - 0.42) / 0.7;
        if (u > 0 && u <= 1) { const q = easeIn(u); tr(shot, lerp(Lp[0], Ip[0], q), lerp(Lp[1], Ip[1], q), 1, ang); shotOn = Math.min(1, u * 5); }
        else if (v > 0 && v < 1) {
          const bx = -dn[0] * 0.8 + 0.3, by = -dn[1] * 0.8 - 0.6, q = easeOut(v);
          tr(shot, Ip[0] + bx * 190 * q, Ip[1] + by * 190 * q, 1, ang + 160 * q); shotOn = 1 - v;
          const k = Math.exp(-5 * v) * Math.sin(v * 22);
          sx = 1 - 0.12 * k; sy = 1 + 0.12 * k;
          if (v < 0.6) hitP = v / 0.6;
        }
      });
      op(shot, shotOn);
      op(hit, hitP >= 0 ? Math.sin(hitP * Math.PI) : 0);
      if (hitP >= 0) { tr(hit, Ip[0], Ip[1], 0.6 + 0.8 * Math.sin(hitP * Math.PI)); hit.upd(t); }
      bigAu.setAttribute('transform', `translate(${ZC[0]} ${ZC[1]}) scale(${(lerp(AR / 80, 1, gp) * sx).toFixed(4)} ${(lerp(AR / 80, 1, gp) * sy).toFixed(4)})`);
      op(bigAu, t >= tSi + 0.15 ? 1 : 0);
      op(launcher, P(t, mid('simpler', 0.28), 0.4, linear));
      const lp = 0.08 * Math.sin(Math.PI * P(t, mid('simpler', 0.9), 0.5, linear));
      tr(launcher, 1010, 176, 1 + lp);
      const cp = P(t, mid('simpler', 0.46), 0.5, pop);
      op(cantChip, clamp(cp * 2)); tr(cantChip, ZC[0], 566 + (1 - clamp(cp)) * 14);
    }

    /* --- D: periodic table builds to 118 --- */
    const aD = Math.min(P(t, tTa - 0.05, 0.4, linear), 1 - P(t, tRu - 0.1, 0.45, linear));
    op(tab, aD);
    if (aD > 0) {
      const b0 = mid('table', 0.02), b1 = mid('table', 0.44), dz = (b1 - b0) / 117;
      let shown = 0;
      tiles.forEach(T_ => {
        const p = clamp((t - b0 - (T_.z - 1) * dz) / 0.2);
        if (p >= 0.5) shown++;
        const q = Math.round(p * 50) / 50;
        if (q === T_.last) return;
        T_.last = q;
        op(T_.box, q); op(T_.sym, q);
        attr(T_.box, 'y', T_.y - TS / 2 - 12 * (1 - q)); attr(T_.sym, 'y', T_.y + 8 - 12 * (1 - q));
      });
      setText(cNum, String(t >= b1 + 0.2 ? 118 : shown));
      const sOut = P(t, tSy - 0.1, 0.5, linear);
      NAMED.forEach(n => {
        const p = P(t, mid('table', n.f) - 0.05, 0.45, pop);
        op(n.g, clamp(p * 2) * (1 - sOut)); tr(n.g, n.x, n.y, Math.max(0.01, 1 + 0.32 * p));
        const lp = P(t, mid('table', n.f), 0.4, pop);
        op(n.chip, clamp(lp * 2) * (1 - sOut)); tr(n.chip, n.cx, 666 + (1 - clamp(lp)) * 12);
      });
      // shrink to the top to make room for the symbol tiles
      const sh = P(t, tSy + 0.05, 0.9);
      tab.setAttribute('transform', `translate(600 ${lerp(TY, 112, sh).toFixed(2)}) scale(${lerp(1, 0.5, sh).toFixed(4)}) translate(-600 ${-TY})`);
      op(tilesG, 1 - 0.45 * sh);
    }
    op(counter, Math.min(P(t, mid('table', 0.02), 0.4, linear), 1 - P(t, tSy - 0.1, 0.45, linear)));
    op(legend, aD > 0 ? 1 : 0);

    /* --- E-F: C, O, Mg tiles fly out; Mg grows: capital and lower case --- */
    op(symTxt, win(t, mid('symbol', 0.18), tRu + 0.1, 0.45));
    const shTab = z => { const [x, y] = cxy(z); return [600 + (x - 600) * 0.5, 112 + (y - TY) * 0.5]; };
    FLY.forEach((d, i) => {
      const t0 = mid('symbol', d.f) - 0.1, u = P(t, t0, 0.75);
      const vis = t >= t0 ? 1 : 0;
      const out = i < 2 ? 1 - P(t, tRu - 0.1, 0.45, linear) : 1 - P(t, tBi - 0.1, 0.45, linear);
      op(d.g, vis * Math.min(1, (t - t0) * 8) * out);
      if (!vis || out <= 0) return;
      const [x0, y0] = shTab(d.z), cx = (x0 + d.x) / 2, cy = Math.min(y0, TROW) - 90;
      const q = 1 - u, x = q * q * x0 + 2 * q * u * cx + u * u * d.x, y = q * q * y0 + 2 * q * u * cy + u * u * TROW;
      let s = lerp(TS * 0.5 / BIG, 1, u), X = x, Y = y;
      if (i === 2) { const g2 = P(t, tRu + 0.05, 0.9); X = lerp(x, RC[0], g2); Y = lerp(y, RC[1], g2); s = lerp(s, RS, g2); }
      tr(d.g, X, Y, Math.max(0.01, s));
    });
    op(MG.g.name, 1 - P(t, tRu + 0.05, 0.4, linear));
    const capP = P(t, mid('rules', 0.42), 0.5, linear), lowP = P(t, mid('rules', 0.8), 0.5, linear);
    op(hM, capP * (0.75 + 0.25 * wave(t, 1.3))); op(hg, lowP * (0.75 + 0.25 * wave(t, 1.3, 0.5)));
    tM.setAttribute('fill', capP > 0.5 ? C.energy : '#FFFFFF'); tg.setAttribute('fill', lowP > 0.5 ? '#5CE1FF' : '#FFFFFF');
    const lOut = 1 - P(t, tBi - 0.1, 0.45, linear);
    op(capLbl, capP * lOut); op(lowLbl, lowP * lOut);

    /* --- G: big then small --- */
    const aG = Math.min(P(t, tBi - 0.05, 0.4, linear), 1 - P(t, mid('cobalt', 0.08), 0.45, linear));
    op(Gb, aG);
    if (aG > 0) {
      const tp = P(t, mid('big', 0.06), 0.5, pop); op(bsTitle, clamp(tp * 2)); tr(bsTitle, 0, (1 - clamp(tp)) * 14);
      const dropN = P(t, mid('big', 0.42), 0.55, pop), dropA = P(t, mid('big', 0.82), 0.5, pop);
      op(bigN, clamp(dropN * 3)); tr(bigN, 0, (1 - dropN) * -150);
      op(smallA, clamp(dropA * 3)); tr(smallA, 0, (1 - dropA) * -150);
      op(naName, P(t, mid('big', 0.55), 0.5, linear));
      const wp = P(t, mid('big', 0.9), 0.4, linear); op(wrong, wp);
      const xp = P(t, mid('big', 0.95), 0.35, pop); op(wrongX, clamp(xp * 2)); tr(wrongX, 870, 424, Math.max(0.01, xp));
    }

    /* --- H: Co vs CO --- */
    const aH = P(t, mid('cobalt', 0.1), 0.45, linear);
    op(Hc, aH);
    if (aH > 0) {
      const pl = P(t, mid('cobalt', 0.12), 0.6, pop), pr = P(t, mid('cobalt', 0.45), 0.6, pop);
      op(cardCo, clamp(pl * 2)); tr(cardCo, 0, (1 - clamp(pl)) * 24);
      op(cardCO, clamp(pr * 2)); tr(cardCO, 0, (1 - clamp(pr)) * 24);
      op(lumpL, P(t, mid('cobalt', 0.26), 0.5, linear)); op(nameCo, P(t, mid('cobalt', 0.36), 0.5, linear));
      tr(lumpL, 330, 430 + 4 * Math.sin(t * 1.2) * calm);
      // the small o grows into a capital O, and the cobalt lump becomes carbon monoxide
      const m = P(t, mid('cobalt', 0.6), 0.55);
      op(oR, 1 - m); op(OR, m);
      const ox = 870 + (wC2 + wO2) / 2 - wO2 / 2;
      oR.setAttribute('transform', `translate(${lerp(pR.x2, ox, m).toFixed(1)} 292) scale(${(1 + 0.4 * m).toFixed(3)}) translate(${-pR.x2} -292)`);
      OR.setAttribute('transform', `translate(${ox} 292) scale(${(0.7 + 0.3 * m).toFixed(3)}) translate(${-ox} -292)`);
      pR.c.setAttribute('x', lerp(pR.cx0, 870 - (wC2 + wO2) / 2 + wC2 / 2, m).toFixed(1));
      const mo = P(t, mid('cobalt', 0.66), 0.6);
      op(lumpR, 1 - mo); op(nameCo2, 1 - P(t, mid('cobalt', 0.66), 0.4, linear));
      op(coMol, mo); tr(coMol, 870, 430, 0.7 + 0.3 * mo);
      op(nameCO, P(t, mid('cobalt', 0.72), 0.5, linear));
      const pc = 0.12 * Math.sin(Math.PI * P(t, mid('cobalt', 0.86), 0.5, linear)), po = 0.12 * Math.sin(Math.PI * P(t, mid('cobalt', 0.94), 0.5, linear));
      tr(coC, -CK, 0, 1 + pc); tr(coO, CK, 0, 1 + po);
      const np = P(t, mid('cobalt', 0.8), 0.5, linear); op(noteCO, np); tr(noteCO, 0, (1 - np) * 12);
    }
  };
});
