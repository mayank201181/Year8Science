/* Chapter 2: Compounds and formulae.
   Two H atoms and an O atom drift in and bond: a compound -> copies in a fixed 2 : 1 ratio, locked
   -> H2O, both H atoms counted -> CO2 and the NaCl grid (1 : 1) -> subscripts count the atom before them
   -> HO and CO are something else -> elements != compound -> showpiece: hydrogen flares, oxygen feeds a
   flame, their atoms bond into water, which puts the flame out -> callback: sodium + chlorine make
   harmless salt -> same atoms, loose or joined -> a chemical reaction is needed to split a compound. */
scene('compounds', S => {
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
  /* a formula as separate pieces (symbols full size, digits as subscripts), centred on cx:
     returns [{ el, x, w, sub, txt }] so each piece can be lit, moved or dropped */
  function fparts(parent, cx, y, str, size, fill) {
    const toks = str.match(/[A-Z][a-z]?|\d+/g), sub = Math.round(size * 0.62), dy = Math.round(size * 0.24);
    const ps = toks.map(tk => { const isSub = /\d/.test(tk); return { txt: tk, sub: isSub, w: textWidth(tk, isSub ? sub : size, FD, 700) }; });
    let x = cx - ps.reduce((s, p) => s + p.w, 0) / 2;
    ps.forEach(p => {
      p.x = x + p.w / 2; x += p.w;
      p.y = y + (p.sub ? dy : 0);
      p.el = T(parent, p.x, p.y, p.txt, { size: p.sub ? sub : size, weight: 700, anchor: 'middle', fill: fill || C.ink });
    });
    return ps;
  }
  function saltGrid(parent, cols, rows, r, s) {
    const g = G(parent), bonds = G(g), atomsG = G(g), cells = [];
    const x0 = -(cols - 1) * s / 2, y0 = -(rows - 1) * s / 2, bw = Math.max(4, r * 0.3);
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
      const x = x0 + i * s, y = y0 + j * s;
      if (i < cols - 1) E('line', { x1: x, y1: y, x2: x + s, y2: y, stroke: '#CBD8E0', 'stroke-width': bw, 'stroke-linecap': 'round' }, bonds);
      if (j < rows - 1) E('line', { x1: x, y1: y, x2: x, y2: y + s, stroke: '#CBD8E0', 'stroke-width': bw, 'stroke-linecap': 'round' }, bonds);
      elAtom(atomsG, (i + j) % 2 ? 'Cl' : 'Na', r, { x, y });
      cells.push([x, y]);
    }
    g.cells = cells;
    return g;
  }
  /* padlock, about 50 x 66; g.set(closed 0..1) lowers the shackle */
  function padlock(parent, s, col) {
    const g = G(parent), k = G(g); tr(k, 0, 0, s || 1);
    const shackle = E('path', { d: 'M-14,0 L-14,-16 A14,14 0 0 1 14,-16 L14,0', fill: 'none', stroke: '#C9D6DE', 'stroke-width': 7, 'stroke-linecap': 'round' }, k);
    E('rect', { x: -24, y: -4, width: 48, height: 38, rx: 8, fill: ball(col || C.glucose, shade(col || C.glucose, 0.6)), stroke: '#FFF3C2', 'stroke-width': 2 }, k);
    E('circle', { cx: 0, cy: 10, r: 5, fill: '#3A2600' }, k);
    E('rect', { x: -2.5, y: 10, width: 5, height: 12, rx: 2, fill: '#3A2600' }, k);
    g.set = c => { c = clamp(c); shackle.setAttribute('transform', `translate(${(6 * (1 - c)).toFixed(2)} ${(-12 * (1 - c)).toFixed(2)}) rotate(${(-28 * (1 - c)).toFixed(1)} 14 0)`); };
    g.set(1);
    return g;
  }
  /* water molecule built from lib atoms so each atom can move: { g, O, H1, H2, r } */
  function water(parent, r, letters) {
    const g = G(parent);
    const H1 = atom(g, 'H', r * 0.62, { letter: letters }), H2 = atom(g, 'H', r * 0.62, { letter: letters }), O = atom(g, 'O', r, { letter: letters });
    tr(H1, -r * 0.98, r * 0.72); tr(H2, r * 0.98, r * 0.72);
    return { g, O, H1, H2, r };
  }
  const halo = (parent, r, col) => { const h = E('circle', { r, fill: glow(col || '#FFF3A0') }, parent); op(h, 0); return h; };
  const pulse = (t, t0, d) => Math.sin(Math.PI * P(t, t0, d || 0.5, linear));

  /* ================= 1-3. a compound, its fixed ratio, its formula ================= */
  const MOL = [600, 300], MR = 60;
  const big = G(root);
  const hH1 = halo(big, 70), hH2 = halo(big, 70), hO = halo(big, 105);
  const aH1 = atom(big, 'H', MR * 0.62, { letter: true }), aH2 = atom(big, 'H', MR * 0.62, { letter: true }), aO = atom(big, 'O', MR, { letter: true });
  const FIN = { H1: [-MR * 0.98, MR * 0.72], H2: [MR * 0.98, MR * 0.72], O: [0, 0] };
  const START = { H1: [-470, 170], H2: [470, 90], O: [90, -270] };
  const tags = [['hydrogen', -380, 230], ['hydrogen', 380, 160], ['oxygen', 0, -170]].map(([s, x, y]) => ({ el: T(big, x, y, s, { size: 28, weight: 600, anchor: 'middle', fill: s === 'oxygen' ? '#FF9A8F' : C.ink }), x, y }));
  const flashes = [spark(big, 20, { seed: 1 }), spark(big, 20, { seed: 2 })];
  const cmpLbl = T(root, 600, 470, 'compound', { size: 54, weight: 700, anchor: 'middle', fill: C.energy });
  // ratio: identical copies, a locked 2 : 1 badge
  const row = [-2, -1, 1, 2].map(k => { const w = water(root, 33, true); return { g: w.g, k }; });
  const badge = G(root);
  {
    const w = textWidth('2 hydrogen : 1 oxygen', 36, FD, 700) + 64;
    E('rect', { x: -w / 2, y: -34, width: w, height: 68, rx: 34, fill: C.card2, stroke: C.energy, 'stroke-width': 3 }, badge);
    rich(badge, 0, 13, [['2 hydrogen', '#FFFFFF', 700], ['  :  ', C.muted, 600], ['1 oxygen', '#FF9A8F', 700]], { size: 36, anchor: 'middle' });
    badge.w = w;
  }
  const lock = padlock(root, 1.1);
  const fixedLbl = T(root, 600, 590, 'fixed ratio: never changes', { size: 30, weight: 600, anchor: 'middle', fill: C.muted });
  // water: counting, then the formula
  const twoH = rich(root, 600, 420, [['two ', C.ink, 600], ['hydrogen', '#FFFFFF', 800], [' atoms', C.ink, 600]], { size: 30, anchor: 'middle' });
  const oneO = rich(root, 600, 196, [['one ', C.ink, 600], ['oxygen', '#FF9A8F', 800], [' atom', C.ink, 600]], { size: 30, anchor: 'middle' });
  const fW = G(root), fWp = fparts(fW, 600, 572, 'H2O', 120, C.ink);

  /* ================= 4. carbon dioxide and sodium chloride ================= */
  const O4 = G(root);
  const co2 = G(O4); tr(co2, 330, 290);
  const hC = halo(co2, 66), hOa = halo(co2, 60), hOb = halo(co2, 60);
  const c2O1 = atom(co2, 'O', 40, { letter: true }), c2O2 = atom(co2, 'O', 40, { letter: true }), c2C = atom(co2, 'C', 44, { letter: true });
  tr(c2O1, -70, 0); tr(c2O2, 70, 0); tr(hOa, -70, 0); tr(hOb, 70, 0);
  const co2Name = T(O4, 330, 538, 'carbon dioxide', { size: 30, weight: 600, anchor: 'middle', fill: C.co2 });
  const fC = G(O4), fCp = fparts(fC, 330, 466, 'CO2', 96, C.ink);
  const b1 = chip(O4, '1 carbon : 2 oxygen', { size: 30, fill: C.card2, stroke: C.co2, sw: 2.5 }); tr(b1, 330, 612);
  const nacl = G(O4); tr(nacl, 870, 290);
  const grid = saltGrid(nacl, 4, 3, 24, 58);
  const pairRing = E('rect', { x: -87 - 30, y: -58 - 30, width: 58 + 60, height: 60, rx: 30, fill: 'none', stroke: C.energy, 'stroke-width': 4 }, nacl);
  const saltName = rich(O4, 870, 538, [['sodium chloride', '#E9EFF3', 700], ['  (table salt)', C.muted, 600]], { size: 30, anchor: 'middle' });
  const fN = G(O4), fNp = fparts(fN, 870, 466, 'NaCl', 96, C.ink);
  const b2 = chip(O4, '1 sodium : 1 chlorine', { size: 30, fill: C.card2, stroke: EL.Na, sw: 2.5 }); tr(b2, 870, 612);

  /* ================= 5-6. subscripts; leave one out ================= */
  const S5 = G(root);
  const fS = G(S5), fSp = fparts(fS, 600, 440, 'H2O', 210, C.ink);
  const [pH, p2, pO] = fSp;
  const h2 = E('ellipse', { cx: p2.x, cy: p2.y - 40, rx: 70, ry: 80, fill: glow(C.energy) }, fS); fS.insertBefore(h2, fS.firstChild);
  const subLbl = G(S5);
  E('line', { x1: p2.x + 70, y1: p2.y + 74, x2: p2.x + 20, y2: p2.y + 18, stroke: C.energy, 'stroke-width': 3 }, subLbl);
  E('circle', { cx: p2.x + 20, cy: p2.y + 18, r: 5, fill: C.energy }, subLbl);
  T(subLbl, p2.x + 78, p2.y + 102, 'subscript', { size: 34, weight: 700, fill: C.energy });
  const curl = arrow(S5, p2.x, p2.y - 92, pH.x + 6, pH.y - 152, { color: C.energy, width: 6, bend: 60 });
  const twoAtoms = G(S5); tr(twoAtoms, pH.x, pH.y - 214);
  tr(atom(twoAtoms, 'H', 20, { letter: true }), -24, 0); tr(atom(twoAtoms, 'H', 20, { letter: true }), 24, 0);
  T(twoAtoms, 0, -34, '× 2', { size: 30, weight: 700, anchor: 'middle', fill: C.energy });
  const ghost1 = T(S5, pO.x + 0.5 * pO.w + 26, p2.y, '1', { size: Math.round(210 * 0.62), weight: 700, anchor: 'middle', fill: 'none' });
  ghost1.setAttribute('stroke', C.muted); ghost1.setAttribute('stroke-width', 3); ghost1.setAttribute('stroke-dasharray', '8 7');
  const oneAtom = G(S5); tr(oneAtom, pO.x, pO.y - 214);
  tr(atom(oneAtom, 'O', 26, { letter: true }), 0, 0);
  T(oneAtom, 0, -40, '× 1', { size: 30, weight: 700, anchor: 'middle', fill: C.muted });
  // miss: HO and CO
  const M6 = G(root);
  const hoX = cross(M6, 40), coX = cross(M6, 40);
  const hoPair = G(M6); tr(hoPair, 330, 470);
  E('line', { x1: -22, y1: 0, x2: 22, y2: 0, stroke: '#CBD8E0', 'stroke-width': 7, 'stroke-linecap': 'round' }, hoPair);
  tr(atom(hoPair, 'H', 22, { letter: true }), -30, 0); tr(atom(hoPair, 'O', 32, { letter: true }), 28, 0);
  const hoLbl = T(M6, 330, 560, 'not water', { size: 30, weight: 700, anchor: 'middle', fill: C.bad });
  const coText = G(M6), coP = fparts(coText, 870, 380, 'CO', 150, C.ink);
  const coMol = G(M6); tr(coMol, 870, 486); molCO2(coMol, 24, { letter: true });
  const coLbl = rich(M6, 870, 572, [['carbon dioxide is ', C.ink, 600], ['CO₂', C.good, 800]], { size: 30, anchor: 'middle' });
  const coTick = tick(M6, 16); tr(coTick, 870 + 196, 560);

  /* ================= 7. different properties ================= */
  const P7 = G(root);
  const surprise = T(P7, 600, 186, 'The most surprising idea', { size: 46, weight: 700, anchor: 'middle', fill: C.energy });
  const colE = G(P7), colC = G(P7);
  T(colE, 300, 290, 'elements', { size: 38, weight: 700, anchor: 'middle' });
  const h2m = G(colE); tr(h2m, 230, 400); tr(atom(h2m, 'H', 26, { letter: true }), -18, 0); tr(atom(h2m, 'H', 26, { letter: true }), 18, 0);
  const o2m = G(colE); tr(o2m, 370, 400); molO2(o2m, 30, { letter: true });
  T(colE, 230, 470, 'hydrogen', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  T(colE, 370, 470, 'oxygen', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  T(colC, 900, 290, 'compound', { size: 38, weight: 700, anchor: 'middle' });
  const w7 = water(colC, 44, true); tr(w7.g, 900, 392);
  T(colC, 900, 470, 'water', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  const neq = T(P7, 600, 430, '≠', { size: 130, weight: 700, anchor: 'middle', fill: C.energy });
  const diffLbl = rich(P7, 600, 594, [['completely different ', C.ink, 600], ['properties', C.energy, 800]], { size: 36, anchor: 'middle' });

  /* ================= 8. showpiece: fire ================= */
  const F8 = G(root);
  const BAL = [262, 330], CLD = [938, 300], FIRE = [600, 600];
  // campfire
  const fireG = G(F8); tr(fireG, FIRE[0], FIRE[1]);
  const fireHalo = E('ellipse', { cx: 0, cy: -70, rx: 120, ry: 140, fill: glow('#FFB347') }, fireG);
  const flameG = G(fireG);
  const flOut = E('path', { d: 'M0,0 C-46,-26 -48,-92 -6,-150 C2,-120 20,-112 22,-92 C34,-110 30,-130 26,-140 C58,-98 52,-30 0,0 Z', fill: '#FF8A3D', stroke: '#FFC27A', 'stroke-width': 3, 'stroke-linejoin': 'round' }, flameG);
  E('path', { d: 'M0,-4 C-24,-18 -26,-58 -2,-92 C8,-62 26,-52 18,-24 C14,-12 8,-6 0,-4 Z', fill: '#FFE07A' }, flameG);
  E('rect', { x: -78, y: -12, width: 156, height: 26, rx: 13, fill: '#8A5A33', stroke: '#B57B4C', 'stroke-width': 3, transform: 'rotate(-12)' }, fireG);
  E('rect', { x: -78, y: -12, width: 156, height: 26, rx: 13, fill: '#7A4E2B', stroke: '#B57B4C', 'stroke-width': 3, transform: 'rotate(12)' }, fireG);
  const steam = [0, 1, 2].map(() => E('path', { d: 'M0,0 C-14,-18 14,-30 0,-48 C-14,-64 10,-76 0,-92', fill: 'none', stroke: '#C9D6DE', 'stroke-width': 7, 'stroke-linecap': 'round' }, F8));
  // hydrogen balloon and oxygen cloud
  const balG = G(F8); tr(balG, BAL[0], BAL[1]);
  const burst = E('circle', { r: 160, fill: glow('#FF9A3D') }, balG);
  const rays = G(balG), rayEls = [];
  for (let i = 0; i < 14; i++) { const a = i / 14 * TAU + 0.1; rayEls.push({ el: E('line', { x1: 0, y1: 0, x2: 0, y2: 0, stroke: i % 2 ? '#FFE07A' : '#FF9A3D', 'stroke-width': 9, 'stroke-linecap': 'round' }, rays), a, l: i % 2 ? 26 : 38 }); }
  const balSkin = G(balG);
  E('path', { d: 'M0,104 C-10,118 10,128 -4,142', fill: 'none', stroke: '#C9D6DE', 'stroke-width': 3 }, balSkin);
  E('ellipse', { cx: 0, cy: 0, rx: 92, ry: 98, fill: 'rgba(200,230,250,0.16)', stroke: '#E4EDF2', 'stroke-width': 4 }, balSkin);
  E('path', { d: 'M-8,96 L8,96 L4,106 L-4,106 Z', fill: '#E4EDF2' }, balSkin);
  E('path', { d: 'M-52,-50 A70,74 0 0 1 -18,-76', stroke: '#FFFFFF', 'stroke-width': 7, fill: 'none', opacity: 0.45, 'stroke-linecap': 'round' }, balSkin);
  const cldG = G(F8); tr(cldG, CLD[0], CLD[1]);
  E('path', { d: 'M-110,40 C-150,40 -150,-14 -104,-18 C-110,-70 -40,-86 -14,-48 C4,-90 84,-86 84,-30 C134,-34 140,40 96,40 Z', fill: 'rgba(255,107,92,0.12)', stroke: 'rgba(255,154,143,0.7)', 'stroke-width': 4, 'stroke-dasharray': '10 8' }, cldG);
  const R8 = 20, rH8 = R8 * 0.62;
  const Hs = [], Os = [];
  const hHome = [[-40, -36], [30, -40], [-32, 26], [38, 30]].map(([x, y]) => [BAL[0] + x, BAL[1] + y]);
  const oHome = [[-46, -6], [42, 2]].map(([x, y]) => [CLD[0] + x, CLD[1] + y]);
  const atomsG = G(F8);
  hHome.forEach((p, k) => [-1, 1].forEach(s => Hs.push({ el: atom(atomsG, 'H', rH8), x0: p[0] + s * rH8 * 0.9, y0: p[1], k })));
  oHome.forEach((p, k) => [-1, 1].forEach(s => Os.push({ el: atom(atomsG, 'O', R8), x0: p[0] + s * R8 * 0.72, y0: p[1], k })));
  const WX = [450, 550, 650, 750], WY = 236;
  Os.forEach((o, m) => { o.x1 = WX[m]; o.y1 = WY; });
  Hs.forEach((h, i) => { const m = Math.floor(i / 2), s = i % 2 ? 1 : -1; h.x1 = WX[m] + s * R8 * 0.98; h.y1 = WY + R8 * 0.72; });
  const tagH = T(F8, BAL[0], 522, 'explosive gas', { size: 30, weight: 700, anchor: 'middle', fill: '#FFB13B' });
  const nameH = T(F8, BAL[0], 160, 'hydrogen', { size: 30, weight: 600, anchor: 'middle' });
  const tagO = T(F8, CLD[0], 410, 'helps things burn', { size: 30, weight: 700, anchor: 'middle', fill: '#FF9A8F' });
  const nameO = T(F8, CLD[0], 176, 'oxygen', { size: 30, weight: 600, anchor: 'middle', fill: '#FF9A8F' });
  const tagW = T(F8, 600, 160, 'water', { size: 34, weight: 700, anchor: 'middle', fill: C.water });
  const drops = [];
  { const dr = rng(19); for (let i = 0; i < 9; i++) drops.push({ el: E('path', { d: 'M0,-14 C7,-4 10,3 10,7 A10,10 0 0 1 -10,7 C-10,3 -7,-4 0,-14 Z', fill: C.water, stroke: '#BDEBFA', 'stroke-width': 1.5 }, F8), x: 470 + dr() * 260, dl: dr() * 0.35 }); }
  const outLbl = T(F8, 600, 690, 'puts fires out', { size: 34, weight: 700, anchor: 'middle', fill: C.water });

  /* ================= 9. callback: sodium + chlorine -> harmless salt ================= */
  const S9 = G(root);
  function dangerCard(parent, cx) {
    const g = G(parent);
    card(g, cx - 150, 176, 300, 380, { fill: C.card, stroke: C.bad, sw: 5, rx: 24 });
    const tag = chip(g, 'DANGER', { size: 26, fill: '#D8394A', color: '#FFFFFF' }); tr(tag, cx, 176);
    return g;
  }
  function nameChip(parent, name, sym, col) {
    const size = 30, w = textWidth(name + '  ' + sym, size, FD, 700) + 46, h = 54, g = G(parent);
    E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: h / 2, fill: C.card2, stroke: col, 'stroke-width': 3 }, g);
    rich(g, 0, size * 0.35, [[name + '  ', C.ink, 600], [sym, col, 800]], { size, anchor: 'middle' });
    return g;
  }
  const cNa = dangerCard(S9, 240), cCl = dangerCard(S9, 960);
  const bk = beaker(cNa, 170, 180, { level: 0.5 }); tr(bk, 240, 380);
  const SURF9 = 389;
  const fz = G(cNa), fzB = bubbles(fz, -28, -38, 56, 44, { n: 8, r: 5, seed: 7, speed: 1.1 });
  const naFlash = spark(cNa, 26, { seed: 8, color: '#FFD45C' });
  const lumpG = G(cNa), lumpIn = G(lumpG); tr(lumpIn, 0, 0, 1.2);
  E('path', { d: 'M-21,-3 C-23,-14 -9,-18 1,-16 C12,-18 23,-12 22,-2 C25,8 12,14 0,13 C-12,15 -23,8 -21,-3 Z', fill: linGrad('#E8EEF2', '#7F8E9A', true), stroke: '#C9D3DA', 'stroke-width': 1.6 }, lumpIn);
  const FLASK = 'M-17,-95 L-17,-38 L-76,78 Q-80,92 -66,92 L66,92 Q80,92 76,78 L17,-38 L17,-95 Z';
  const fl = flask(cCl, 1.0, { level: 0 }); tr(fl, 960, 372);
  const flIn = fl.firstChild;
  flIn.insertBefore(E('path', { d: FLASK, fill: '#D8F77E', opacity: 0.5 }, null), flIn.childNodes[1]);
  E('path', { d: 'M-21,-112 L21,-112 L18,-86 L-18,-86 Z', fill: '#5E6B76', stroke: '#8FA0AD', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, flIn);
  const hz = G(cCl); tr(hz, 1062, 256);
  {
    const s = 58;
    E('rect', { x: -s / 2, y: -s / 2, width: s, height: s, rx: s * 0.07, fill: '#FFFFFF', stroke: '#E8424F', 'stroke-width': s * 0.11, transform: 'rotate(45)' }, hz);
    const k = G(hz); tr(k, 0, 0, s / 100); const ink = '#1B1B1B';
    E('path', { d: 'M-26,16 L26,40 M26,16 L-26,40', stroke: ink, 'stroke-width': 8, 'stroke-linecap': 'round' }, k);
    E('circle', { cx: 0, cy: -14, r: 22, fill: ink }, k); E('rect', { x: -12, y: -2, width: 24, height: 16, rx: 4, fill: ink }, k);
    E('circle', { cx: -8.5, cy: -15, r: 6.5, fill: '#FFFFFF' }, k); E('circle', { cx: 8.5, cy: -15, r: 6.5, fill: '#FFFFFF' }, k);
  }
  const nNa = nameChip(cNa, 'sodium', 'Na', EL.Na); tr(nNa, 240, 512);
  const nCl = nameChip(cCl, 'chlorine', 'Cl', EL.Cl); tr(nCl, 960, 512);
  const naA = elAtom(S9, 'Na', 30), clA = elAtom(S9, 'Cl', 30);
  const bond9 = E('line', { x1: -33, y1: 0, x2: 33, y2: 0, stroke: '#CBD8E0', 'stroke-width': 9, 'stroke-linecap': 'round' }, S9);
  const snap9 = spark(S9, 26, { seed: 9 });
  const shk = G(S9);
  {
    E('path', { d: 'M-40,-58 L-46,62 Q-46,74 -34,74 L34,74 Q46,74 46,62 L40,-58 Z', fill: 'rgba(200,230,250,0.14)' }, shk);
    E('path', { d: 'M-42.5,-8 L-45,62 Q-45,72 -34,72 L34,72 Q45,72 45,62 L42.5,-8 Z', fill: '#F2F5F8' }, shk);
    E('path', { d: 'M-40,-58 L-46,62 Q-46,74 -34,74 L34,74 Q46,74 46,62 L40,-58', fill: 'none', stroke: GLASS.stroke, 'stroke-width': 4, 'stroke-linejoin': 'round' }, shk);
    E('rect', { x: 26, y: -46, width: 7, height: 104, rx: 3.5, fill: GLASS.shine }, shk);
    E('path', { d: 'M-45,-56 L-41,-92 Q-39,-100 -29,-100 L29,-100 Q39,-100 41,-92 L45,-56 Z', fill: linGrad('#E4EBF0', '#8C9AA6'), stroke: '#F2F7FA', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, shk);
    E('ellipse', { cx: 0, cy: -100, rx: 29, ry: 6, fill: '#B9C6D2', stroke: '#F2F7FA', 'stroke-width': 2 }, shk);
  }
  const harmless = G(S9);
  const hTick = tick(harmless, 20); tr(hTick, -150, -10);
  T(harmless, 18, 0, 'harmless table salt', { size: 34, weight: 700, anchor: 'middle', fill: C.good });

  /* ================= 10-11. same atoms, loose or joined; a reaction is needed ================= */
  const J10 = G(root);
  const loose = [['H', 210, 330, 0], ['H', 318, 262, 1], ['O', 420, 344, 2]].map(([k, x, y, i]) => ({ el: atom(J10, k, k === 'H' ? 31 : 50, { letter: true }), x, y, i }));
  const tL1 = rich(J10, 315, 470, [['hydrogen: ', C.ink, 600], ['explosive gas', '#FFB13B', 800]], { size: 28, anchor: 'middle' });
  const tL2 = rich(J10, 315, 514, [['oxygen: ', C.ink, 600], ['helps burning', '#FF9A8F', 800]], { size: 28, anchor: 'middle' });
  const sameChip = chip(J10, 'the same atoms', { size: 30, fill: C.card2, stroke: C.line, sw: 2 }); tr(sameChip, 600, 170);
  const joinArrow = arrow(J10, 520, 320, 690, 320, { color: C.energy, width: 7 });
  const joinLbl = T(J10, 605, 292, 'joined', { size: 32, weight: 700, anchor: 'middle', fill: C.energy });
  const wJ = water(root, 50, true);
  const bondGlow = E('ellipse', { rx: 92, ry: 66, fill: glow(C.energy) }, wJ.g); wJ.g.insertBefore(bondGlow, wJ.g.firstChild);
  const tR = rich(J10, 885, 470, [['water: ', C.ink, 600], ['puts out fires', C.water, 800]], { size: 28, anchor: 'middle' });
  const R11 = G(root);
  const plinth = G(R11); tr(plinth, 420, 470);
  E('path', { d: 'M-150,0 L150,0 L130,120 L-130,120 Z', fill: linGrad('#2A5A70', '#173A4C', true), stroke: '#4B7C93', 'stroke-width': 3, 'stroke-linejoin': 'round' }, plinth);
  E('rect', { x: -164, y: -18, width: 328, height: 22, rx: 8, fill: '#3C6C83', stroke: '#5E90A7', 'stroke-width': 2.5 }, plinth);
  const lk = padlock(plinth, 1.15); tr(lk, 0, 52);
  const rxArrow = arrow(R11, 590, 330, 800, 330, { color: C.energy, width: 7 });
  const rxLbl = T(R11, 695, 296, 'chemical reaction', { size: 30, weight: 700, anchor: 'middle', fill: C.energy });
  const ghosts = G(R11);
  const gAtom = (x, y, r, col) => E('circle', { cx: x, cy: y, r, fill: 'none', stroke: col, 'stroke-width': 3, 'stroke-dasharray': '7 6' }, ghosts);
  gAtom(890, 290, 22, C.hydrogen); gAtom(926, 290, 22, C.hydrogen); gAtom(890, 370, 28, C.oxygen); gAtom(936, 370, 28, C.oxygen);
  T(ghosts, 912, 450, 'its elements', { size: 28, weight: 600, anchor: 'middle', fill: C.muted });
  const hardChip = chip(R11, 'hard to split', { size: 30, fill: C.card2, stroke: C.bad, sw: 2.5, color: '#FFB3BB' }); tr(hardChip, 695, 400);

  /* ================= update ================= */
  return t => {
    const tR_ = at('ratio'), tW = at('water'), tO = at('others'), tS = at('subs'), tM = at('miss'), tP = at('props'), tF = at('fire'), tSa = at('salt'), tJ = at('joined'), tRe = at('react');

    /* --- 1-3: the big molecule (def -> ratio -> water) --- */
    const aBig = 1 - P(t, tO - 0.15, 0.45, linear);
    op(big, aBig * P(t, S.first - 0.2, 0.3, linear));
    if (aBig > 0) {
      const u = ease(P(t, S.first, mid('def', 0.46) - S.first, linear));        // drift in
      const sn = P(t, mid('def', 0.5), 0.45, pop);                               // snap together
      const place = (el, k) => {
        const s = START[k], f = FIN[k];
        const near = [lerp(s[0], f[0] * 1.9, u), lerp(s[1], f[1] * 1.9 + (k === 'O' ? -40 : 30), u)];
        const x = lerp(near[0], f[0], sn), y = lerp(near[1], f[1], sn);
        return [x + (sn < 1 ? Math.sin(t * 1.6 + k.length) * 4 * calm * (1 - sn) : 0), y];
      };
      // ratio: shrink and move up; water: grow back
      const rs = P(t, tR_, 0.7), ws = P(t, tW, 0.7);
      const sc = lerp(lerp(1, 0.55, rs), 1, ws), my = lerp(lerp(MOL[1], 300, rs), MOL[1], ws);
      const bob = 3 * Math.sin(t * 1.3) * calm * sn;
      tr(big, MOL[0], my + bob, sc);
      const pH1 = place(aH1, 'H1'), pH2 = place(aH2, 'H2'), pO = place(aO, 'O');
      tr(aH1, pH1[0], pH1[1]); tr(aH2, pH2[0], pH2[1]); tr(aO, pO[0], pO[1]);
      tr(hH1, pH1[0], pH1[1]); tr(hH2, pH2[0], pH2[1]); tr(hO, pO[0], pO[1]);
      tags.forEach((g, i) => { op(g.el, P(t, mid('def', 0.12 + i * 0.06), 0.4, linear) * (1 - P(t, mid('def', 0.47), 0.3, linear))); const p = [pH1, pH2, pO][i]; g.el.setAttribute('x', (p[0] + (i === 2 ? 132 : 0)).toFixed(1)); g.el.setAttribute('y', (p[1] + (i === 2 ? 10 : 62)).toFixed(1)); });
      flashes.forEach((f, i) => { const v = clamp((t - mid('def', 0.5) - 0.32) / 0.6); op(f, v > 0 && v < 1 ? Math.sin(v * Math.PI) : 0); const p = i ? pH2 : pH1; tr(f, (p[0] + pO[0]) / 2, (p[1] + pO[1]) / 2, 0.5 + 0.8 * Math.sin(v * Math.PI)); f.upd(t); });
      // water: light up the two H atoms, then the O; then again as the formula is read
      const lH1 = Math.max(win(t, mid('water', 0.12), mid('water', 0.4), 0.25), pulse(t, mid('water', 0.89), 0.5));
      const lH2 = Math.max(win(t, mid('water', 0.21), mid('water', 0.4), 0.25), pulse(t, mid('water', 0.89), 0.5));
      const lO = Math.max(win(t, mid('water', 0.45), mid('water', 0.64), 0.25), pulse(t, mid('water', 0.95), 0.5));
      op(hH1, lH1); op(hH2, lH2); op(hO, lO);
    }
    op(cmpLbl, win(t, mid('def', 0.8), tR_ + 0.1, 0.35));
    const aRow = win(t, tR_ + 0.05, tW + 0.1, 0.35);
    row.forEach((r, i) => {
      const p = P(t, mid('ratio', 0.06 + Math.abs(r.k) * 0.1 + (r.k > 0 ? 0.04 : 0)), 0.55, easeOut);
      tr(r.g, lerp(600, 600 + r.k * 185, p), 300 + 3 * Math.sin(t * 1.3) * calm);
      op(r.g, aRow * clamp(p * 3));
    });
    const bp = P(t, mid('ratio', 0.32), 0.5, pop), bOut = 1 - P(t, tW - 0.05, 0.35, linear);
    op(badge, clamp(bp * 2) * bOut); tr(badge, 600, 470 + (1 - clamp(bp)) * 16);
    const lockP = P(t, mid('ratio', 0.34), 0.5, pop);
    op(lock, clamp(lockP * 2) * bOut); tr(lock, 600 + badge.w / 2 + 44, 466, Math.max(0.01, lockP) * (1 + 0.12 * pulse(t, mid('ratio', 0.62), 0.35)));
    lock.set(P(t, mid('ratio', 0.6), 0.25, easeIn));
    op(fixedLbl, P(t, mid('ratio', 0.62), 0.4, linear) * bOut);
    op(twoH, win(t, mid('water', 0.14), tO - 0.1, 0.35)); op(oneO, win(t, mid('water', 0.45), tO - 0.1, 0.35));
    const fw = win(t, mid('water', 0.7), tO - 0.1, 0.35);
    op(fW, fw);
    if (fw > 0) {
      fWp.forEach((p, i) => { const on = pulse(t, mid('water', [0.82, 0.89, 0.95][i]), 0.5); p.el.setAttribute('fill', on > 0.3 ? C.energy : C.ink); });
      tr(fW, 0, (1 - P(t, mid('water', 0.7), 0.5, easeOut)) * 16);
    }

    /* --- 4: CO2 and NaCl --- */
    const a4 = win(t, tO - 0.05, tS + 0.05, 0.4);
    op(O4, a4);
    if (a4 > 0) {
      const cp = P(t, tO + 0.05, 0.6, pop); op(co2, clamp(cp * 2)); tr(co2, 330, 290 + 3 * Math.sin(t * 1.2) * calm, 0.8 + 0.2 * cp);
      op(co2Name, P(t, mid('others', 0.06), 0.5, linear));
      op(hC, win(t, mid('others', 0.12), mid('others', 0.3), 0.25)); op(hOa, win(t, mid('others', 0.22), mid('others', 0.32), 0.25)); op(hOb, win(t, mid('others', 0.24), mid('others', 0.34), 0.25));
      op(fC, P(t, mid('others', 0.31), 0.4, linear));
      const b1p = P(t, mid('others', 0.26), 0.5, pop); op(b1, clamp(b1p * 2)); tr(b1, 330, 612 + (1 - clamp(b1p)) * 12);
      const np = P(t, mid('others', 0.43), 0.6, pop); op(nacl, clamp(np * 2)); tr(nacl, 870, 290, 0.8 + 0.2 * np);
      op(saltName, P(t, mid('others', 0.5), 0.5, linear));
      fNp.forEach((p, i) => op(p.el, P(t, mid('others', [0.64, 0.68, 0.72, 0.76][i]), 0.25, linear)));
      const b2p = P(t, mid('others', 0.83), 0.5, pop); op(b2, clamp(b2p * 2)); tr(b2, 870, 612 + (1 - clamp(b2p)) * 12);
      op(pairRing, P(t, mid('others', 0.84), 0.4, linear) * (0.7 + 0.3 * wave(t, 1.2)));
    }

    /* --- 5: subscripts --- */
    const a5 = win(t, tS - 0.05, tP + 0.05, 0.4);
    op(S5, a5);
    if (a5 > 0) {
      op(fS, P(t, tS, 0.5, linear));
      op(h2, P(t, mid('subs', 0.12), 0.5, linear) * (0.8 + 0.2 * wave(t, 1.4)) * (1 - P(t, tM, 0.3, linear)));
      p2.el.setAttribute('fill', t > mid('subs', 0.14) && t < tM ? C.energy : C.ink);
      op(subLbl, win(t, mid('subs', 0.22), tM + 0.1, 0.35));
      curl.set(P(t, mid('subs', 0.5), 0.7)); op(curl, win(t, mid('subs', 0.48), tM + 0.1, 0.3));
      const tp = P(t, mid('subs', 0.62), 0.5, pop); op(twoAtoms, clamp(tp * 2) * (1 - P(t, tM, 0.3, linear))); tr(twoAtoms, pH.x, pH.y - 214, Math.max(0.01, tp));
      op(ghost1, win(t, mid('subs', 0.82), end_('subs') + 0.4, 0.3));
      const op1 = P(t, mid('subs', 0.84), 0.5, pop); op(oneAtom, clamp(op1 * 2) * (1 - P(t, tM, 0.3, linear))); tr(oneAtom, pO.x, pO.y - 214, Math.max(0.01, op1));
      // leave one out: the 2 drops away, HO closes up and moves left
      const drop = P(t, mid('miss', 0.02), 0.6, easeIn);
      p2.el.setAttribute('transform', `translate(0 ${(drop * 260).toFixed(1)}) rotate(${(drop * 70).toFixed(1)} ${p2.x} ${p2.y})`);
      op(p2.el, 1 - P(t, mid('miss', 0.02) + 0.35, 0.25, linear));
      const close = P(t, mid('miss', 0.14), 0.6), mv = P(t, mid('miss', 0.3), 0.7);
      const gap = p2.w / 2, s5 = lerp(1, 150 / 210, mv);
      tr(fS, lerp(0, 330 - 600 * s5, mv), lerp(0, 380 - 440 * s5, mv), s5);
      pH.el.setAttribute('x', (pH.x + gap * close).toFixed(1)); pO.el.setAttribute('x', (pO.x - gap * close).toFixed(1));
    }

    /* --- 6: HO and CO are something else --- */
    const a6 = win(t, mid('miss', 0.36), tP + 0.05, 0.35);
    op(M6, a6);
    if (a6 > 0) {
      const xp = P(t, mid('miss', 0.46), 0.4, pop); op(hoX, clamp(xp * 2)); tr(hoX, 486, 332, Math.max(0.01, xp));
      const hp = P(t, mid('miss', 0.42), 0.5, pop); op(hoPair, clamp(hp * 2)); tr(hoPair, 330, 470, Math.max(0.01, hp));
      op(hoLbl, P(t, mid('miss', 0.5), 0.4, linear));
      op(coText, P(t, mid('miss', 0.64), 0.4, linear));
      const cx2 = P(t, mid('miss', 0.74), 0.4, pop); op(coX, clamp(cx2 * 2)); tr(coX, 1026, 332, Math.max(0.01, cx2));
      const cm = P(t, mid('miss', 0.8), 0.5, pop); op(coMol, clamp(cm * 2)); tr(coMol, 870, 486, Math.max(0.01, cm));
      op(coLbl, P(t, mid('miss', 0.84), 0.4, linear)); op(coTick, P(t, mid('miss', 0.88), 0.3, linear));
    }

    /* --- 7: elements != compound --- */
    const a7 = win(t, tP - 0.05, tF + 0.05, 0.4);
    op(P7, a7);
    if (a7 > 0) {
      const sp = P(t, mid('props', 0.04), 0.5, pop); op(surprise, clamp(sp * 2)); tr(surprise, 0, (1 - clamp(sp)) * 14);
      const ep = P(t, mid('props', 0.42), 0.5, pop), cp = P(t, mid('props', 0.52), 0.5, pop);
      op(colE, clamp(ep * 2)); tr(colE, (1 - clamp(ep)) * -30, 0);
      op(colC, clamp(cp * 2)); tr(colC, (1 - clamp(cp)) * 30, 0);
      const nq = P(t, mid('props', 0.62), 0.5, pop); op(neq, clamp(nq * 2)); neq.setAttribute('transform', `translate(600 400) scale(${Math.max(0.01, nq).toFixed(3)}) translate(-600 -400)`);
      op(diffLbl, P(t, mid('props', 0.72), 0.5, linear));
    }

    /* --- 8: showpiece: fire --- */
    const a8 = win(t, tF - 0.05, tSa + 0.05, 0.4);
    op(F8, a8);
    if (a8 > 0) {
      const tGo = mid('fire', 0.57), tBond = mid('fire', 0.72), tSplash = mid('fire', 0.82);
      // flame: normal, brighter with oxygen, then put out
      const big8 = P(t, mid('fire', 0.38), 0.7), out = P(t, tSplash + 0.3, 0.55, ease);
      const fs = lerp(1, 1.55, big8) * (1 - out);
      flameG.setAttribute('transform', `scale(${(fs * (1 + 0.05 * Math.sin(t * 9) * calm)).toFixed(3)} ${(fs * (1 + 0.08 * Math.sin(t * 13 + 1) * calm)).toFixed(3)})`);
      op(flameG, fs > 0.02 ? 1 : 0);
      tr(fireHalo, 0, 0, Math.max(0.01, fs * (0.9 + 0.1 * wave(t, 0.8))));
      flOut.setAttribute('fill', big8 > 0.5 ? '#FFA33D' : '#FF8A3D');
      steam.forEach((s, i) => { const q = ((t - tSplash - 0.45) / 1.4 + i / 3) % 1; const on = P(t, tSplash + 0.45, 0.3, linear); tr(s, FIRE[0] - 50 + i * 50, FIRE[1] - 40 - q * 90, 0.7 + 0.4 * q); op(s, on * Math.sin(q * Math.PI) * 0.8); });
      // balloon flares at "explosive"
      const bIn = P(t, tF, 0.5, pop);
      const fl8 = clamp((t - mid('fire', 0.14)) / 1.2), fa = fl8 > 0 && fl8 < 1 ? Math.sin(fl8 * Math.PI) : 0;
      const shakeX = fa * 6 * Math.sin(t * 40) * calm;
      tr(balG, BAL[0] + shakeX, BAL[1] + 6 * Math.sin(t * 1.1) * calm, Math.max(0.01, 0.8 + 0.2 * bIn));
      op(burst, fa); op(rays, fa);
      if (fa > 0) rayEls.forEach(r => { const d0 = 102 + 14 * fl8, d1 = d0 + r.l * (0.6 + 0.4 * fa); attr(r.el, 'x1', Math.cos(r.a) * d0); attr(r.el, 'y1', Math.sin(r.a) * d0); attr(r.el, 'x2', Math.cos(r.a) * d1); attr(r.el, 'y2', Math.sin(r.a) * d1); });
      const empty = P(t, tGo + 0.2, 0.6, linear);
      op(balSkin, clamp(bIn * 2) * (1 - empty)); op(cldG, P(t, tF + 0.2, 0.5, linear) * (1 - empty));
      tr(cldG, CLD[0] - 30 * P(t, mid('fire', 0.32), 1.2) - 0 * shakeX, CLD[1] + 5 * Math.sin(t * 0.9) * calm);
      op(tagH, win(t, mid('fire', 0.16), tGo, 0.35)); op(nameH, win(t, tF + 0.1, tGo, 0.35));
      op(tagO, win(t, mid('fire', 0.4), tGo, 0.35)); op(nameO, win(t, mid('fire', 0.3), tGo, 0.35));
      // atoms: wander in their gases, then fly together into four water molecules, which fall as a splash
      const dropT = clamp((t - tSplash) / 0.25);
      const apply = (a, wob) => {
        const u = ease(clamp((t - tGo - (a.k % 2) * 0.12) / (tBond - tGo)));
        const hx = a.x0 + wob[0], hy = a.y0 + wob[1];
        tr(a.el, lerp(hx, a.x1, u), lerp(hy, a.y1, u) - Math.sin(u * Math.PI) * 50);
        op(a.el, P(t, tF + 0.1, 0.5, linear) * (1 - dropT));
      };
      const cldDx = -30 * P(t, mid('fire', 0.32), 1.2);
      Hs.forEach((h, i) => apply(h, [shakeX + 3 * Math.sin(t * 1.7 + h.k) * calm, 3 * Math.cos(t * 1.4 + h.k) * calm]));
      Os.forEach(o => apply(o, [cldDx + 3 * Math.sin(t * 1.5 + o.k * 2) * calm, 3 * Math.cos(t * 1.2 + o.k) * calm]));
      op(tagW, win(t, tBond - 0.1, tSplash + 0.1, 0.3));
      drops.forEach(d => {
        const u = clamp((t - tSplash - d.dl) / 0.55);
        if (u <= 0 || u >= 1) { op(d.el, 0); return; }
        tr(d.el, d.x + (FIRE[0] - d.x) * 0.3 * u, WY + 10 + u * u * (FIRE[1] - 90 - WY)); op(d.el, Math.min(1, u * 6, (1 - u) * 4));
      });
      op(outLbl, P(t, mid('fire', 0.9), 0.4, linear));
    }

    /* --- 9: sodium + chlorine -> harmless salt --- */
    const a9 = win(t, tSa - 0.05, tJ + 0.05, 0.4);
    op(S9, a9);
    if (a9 > 0) {
      const pc = P(t, tSa, 0.5, pop), pr = P(t, mid('salt', 0.1), 0.5, pop);
      const dim = 1 - 0.6 * P(t, mid('salt', 0.68), 0.6, linear);
      op(cNa, clamp(pc * 2) * dim); op(cCl, clamp(pr * 2) * dim);
      const lx = 240 + 34 * Math.sin(t * 2.1) * calm;
      tr(lumpG, lx, SURF9 - 5 + 2 * Math.sin(t * 9) * calm, 1, 30 * Math.sin(t * 1.7) * calm);
      op(fz, 1); tr(fz, lx, SURF9 - 5); fzB.upd(t, 1);
      const nf = clamp((t - mid('salt', 0.33)) / 0.9), nfa = nf > 0 && nf < 1 ? Math.sin(nf * Math.PI) : 0;
      op(naFlash, nfa); tr(naFlash, lx, SURF9 - 14, 0.5 + 0.9 * nfa); naFlash.upd(t);
      const hp = P(t, mid('salt', 0.52), 0.5, pop); op(hz, clamp(hp * 2)); tr(hz, 1062, 256, Math.max(0.01, hp));
      op(nNa, P(t, mid('salt', 0.04), 0.4, linear)); op(nCl, P(t, mid('salt', 0.14), 0.4, linear));
      // atoms leave the cards and join
      const tGo = mid('salt', 0.63), tMeet = mid('salt', 0.74);
      const u = ease(clamp((t - tGo) / (tMeet - tGo)));
      const fly = (x0, y0, cx, cy, x1, y1) => { const q = 1 - u; return [q * q * x0 + 2 * q * u * cx + u * u * x1, q * q * y0 + 2 * q * u * cy + u * u * y1]; };
      let [nx, ny] = fly(lx, SURF9 - 10, 380, 170, 567, 380), [cx, cy] = fly(960, 262, 820, 170, 633, 380);
      const into = P(t, mid('salt', 0.77), 0.4);                  // the joined pair shrinks into the shaker
      nx = lerp(nx, 592, into); ny = lerp(ny, 400, into); cx = lerp(cx, 608, into); cy = lerp(cy, 400, into);
      const ap = P(t, tGo - 0.05, 0.3, pop), gone = 1 - P(t, mid('salt', 0.79), 0.25, linear), ks = 1 - 0.75 * into;
      tr(naA, nx, ny, Math.max(0.01, ap * ks)); tr(clA, cx, cy, Math.max(0.01, ap * ks));
      op(naA, clamp(ap * 2) * gone); op(clA, clamp(ap * 2) * gone);
      op(bond9, P(t, tMeet - 0.05, 0.2, linear) * gone); tr(bond9, (nx + cx) / 2, (ny + cy) / 2, ks);
      const sv = clamp((t - tMeet) / 0.7); op(snap9, sv > 0 && sv < 1 ? Math.sin(sv * Math.PI) : 0); tr(snap9, 600, 380, 0.6 + 0.9 * Math.sin(sv * Math.PI)); snap9.upd(t);
      const sh = P(t, mid('salt', 0.8), 0.5, pop);
      op(shk, clamp(sh * 2)); tr(shk, 600, 360, Math.max(0.01, 0.6 + 0.4 * sh), 4 * Math.sin(t * 1.6) * calm);
      const hm = P(t, mid('salt', 0.88), 0.5, pop); op(harmless, clamp(hm * 2)); tr(harmless, 600, 590, Math.max(0.01, 0.8 + 0.2 * hm));
    }

    /* --- 10: same atoms, loose or joined --- */
    const a10 = win(t, tJ - 0.05, tRe + 0.05, 0.4);
    op(J10, a10);
    loose.forEach((a, i) => { const p = P(t, tJ + i * 0.12, 0.5, pop); tr(a.el, a.x + 10 * Math.sin(t * 0.9 + i * 2) * calm, a.y + 8 * Math.cos(t * 0.8 + i) * calm, Math.max(0.01, p)); });
    op(tL1, P(t, mid('joined', 0.18), 0.4, linear)); op(tL2, P(t, mid('joined', 0.32), 0.4, linear));
    const scp = P(t, mid('joined', 0.5), 0.5, pop); op(sameChip, clamp(scp * 2)); tr(sameChip, 600, 170 + (1 - clamp(scp)) * 12);
    joinArrow.set(P(t, mid('joined', 0.74), 0.6)); op(joinLbl, P(t, mid('joined', 0.8), 0.4, linear));
    op(tR, P(t, mid('joined', 0.42), 0.4, linear) * (1 - P(t, tRe - 0.05, 0.35, linear)));
    // the water molecule: in the joined panel, then onto the padlocked plinth
    const wIn = P(t, mid('joined', 0.36), 0.5, pop);
    const toPl = P(t, tRe, 0.8);
    op(wJ.g, t >= tJ - 0.05 ? clamp(wIn * 2) : 0);
    const shakeW = win(t, mid('react', 0.66), mid('react', 0.9), 0.15) * Math.sin(t * 30) * 4 * calm;
    tr(wJ.g, lerp(885, 420, toPl) + shakeW, lerp(330, 380, toPl) + 3 * Math.sin(t * 1.2) * calm, Math.max(0.01, wIn));
    const split = win(t, mid('react', 0.68), mid('react', 0.88), 0.2) * 10 * calm;
    tr(wJ.H1, -50 * 0.98 - split, 50 * 0.72 + split * 0.4); tr(wJ.H2, 50 * 0.98 + split, 50 * 0.72 + split * 0.4);
    op(bondGlow, pulse(t, mid('joined', 0.86), 0.6) * 0.9);

    /* --- 11: a chemical reaction is needed --- */
    const a11 = P(t, tRe + 0.1, 0.45, linear);
    op(R11, a11);
    if (a11 > 0) {
      const pp = P(t, tRe + 0.2, 0.6, easeOut); tr(plinth, 420, 470 + (1 - pp) * 40); op(plinth, pp);
      const lp = P(t, mid('react', 0.12), 0.5, pop); op(lk, clamp(lp * 2)); tr(lk, 0, 52, Math.max(0.01, 1.15 * lp));
      lk.set(1 - win(t, mid('react', 0.3), mid('react', 0.5), 0.2) * 0.25);
      rxArrow.set(P(t, mid('react', 0.3), 0.7)); op(rxLbl, P(t, mid('react', 0.34), 0.4, linear));
      op(ghosts, P(t, mid('react', 0.56), 0.5, linear) * (0.75 + 0.25 * wave(t, 1.6)));
      const hc = P(t, mid('react', 0.72), 0.5, pop); op(hardChip, clamp(hc * 2)); tr(hardChip, 695, 400 + (1 - clamp(hc)) * 12);
    }
  };
  function end_(id) { return S.end(id); }
});
