/* Chapter: Enzymes and bile, the chemical workers.
   An amylase blob on a conveyor of starch, snipping off sugars again and again (a catalyst, not used up,
   not alive, molecule after molecule) -> a table of the three enzymes (what they break, what they make,
   where they are made) -> P/L/A name hooks -> lock and key -> lactose intolerance -> pH conditions -> bile
   made, stored, released -> emulsifying one big fat globule into dozens of droplets (showpiece) ->
   neutralising the stomach acid -> a biological wash. */
scene('enzymes', S => {
  const { at, end, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;

  /* ---------- helpers: molecule set, enzymes, small art ---------- */
  const hx = c => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16));
  function mix(a, b, p) { const A_ = hx(a), B_ = hx(b), q = clamp(p); return '#' + A_.map((v, i) => Math.round(lerp(v, B_[i], q)).toString(16).padStart(2, '0')).join(''); }
  const hexPath = s => { let d = ''; for (let i = 0; i < 6; i++) { const a = -Math.PI / 2 + i * Math.PI / 3; d += (i ? 'L' : 'M') + (Math.cos(a) * s).toFixed(1) + ',' + (Math.sin(a) * s).toFixed(1); } return d + 'Z'; };
  /* repeated art is drawn once in <defs> and placed with one <use> element each (keeps the scene small) */
  const SYM = {};
  function sym(key, draw) { if (!SYM[key]) { const id = 'dgEnzSym' + key; draw(E('g', { id }, defs())); SYM[key] = '#' + id; } return SYM[key]; }
  function hexU(parent, s, pale) {
    return E('use', { href: sym('h' + s + (pale ? 'p' : ''), g => {
      E('path', { d: hexPath(s), fill: pale ? ball('#FFF6DE', '#CDB98A') : ball(C.glucose, C.glucoseDk), stroke: pale ? '#B8A06A' : C.glucoseDk, 'stroke-width': Math.max(1.5, s * 0.12), 'stroke-linejoin': 'round' }, g);
      E('circle', { cx: (s * 0.866).toFixed(1), cy: (-s * 0.5).toFixed(1), r: (s * 0.2).toFixed(1), fill: C.oxygen }, g);
    }) }, parent);
  }
  const BEADC = [['#FF8A80', '#C2534C'], ['#4DD0C8', '#1E8C85'], ['#B5E655', '#6E9A26'], [C.ethanol, C.ethanolDk]];
  function bead(parent, r, k) { const [c, dk] = BEADC[k % 4]; return E('circle', { r, fill: ball(c, dk), stroke: dk, 'stroke-width': Math.max(1.2, r * 0.12) }, parent); }
  function tail(parent, s) { let d = 'M0,0'; for (let i = 1; i <= 6; i++) d += ` L${(i * 11 * s).toFixed(1)},${((i % 2 ? -5 : 5) * s).toFixed(1)}`; return E('path', { d, fill: 'none', stroke: '#FFB347', 'stroke-width': 6 * s, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, parent); }
  function bar(parent, s) { return E('rect', { x: -8 * s, y: -34 * s, width: 16 * s, height: 68 * s, rx: 8 * s, fill: ball('#FFF0B8', '#C9B46A'), stroke: '#C9B46A', 'stroke-width': 2 }, parent); }
  function fatMol(parent, s) { const g = G(parent), k = G(g); tr(k, -36 * s, 0); [-1, 0, 1].forEach(j => tr(tail(k, s), 8 * s, j * 24 * s)); bar(k, s); return g; }
  const ENZ = { amy: [C.water, C.waterDk], pro: [C.lactic, C.lacticDk], lip: [C.heat, C.heatDk], lac: ['#EEF3F6', '#8FA3B2'] };
  function enzPath(kind, R) {
    const top = -0.55 * R, bot = 0.75 * R, n = 0.34 * R;
    let notch;
    if (kind === 'pro') notch = `A${n.toFixed(1)},${n.toFixed(1)} 0 0 0 ${n.toFixed(1)},${top.toFixed(1)}`;
    else if (kind === 'lip') notch = `L${-n},${top + 0.9 * n} L${n},${top + 0.9 * n} L${n},${top}`;
    else { const s = n / 0.866; notch = `L${-n},${top + 0.5 * s} L0,${top + s} L${n},${top + 0.5 * s} L${n},${top}`; }
    return `M${-n},${top} ${notch} C${0.62 * R},${top} ${R},${top + 0.1 * R} ${R},${0.1 * R} C${R},${0.55 * R} ${0.6 * R},${bot} 0,${bot} C${-0.6 * R},${bot} ${-R},${0.55 * R} ${-R},${0.1 * R} C${-R},${top + 0.1 * R} ${-0.62 * R},${top} ${-n},${top} Z`;
  }
  /* enzyme: rounded blob with its active site (a notch shaped for its molecule) at the top centre */
  function enzyme(parent, kind, R) {
    const [c, dk] = ENZ[kind];
    const e = E('use', { href: sym('e' + kind + R, g => {
      E('path', { d: enzPath(kind, R), fill: ball(c, dk), stroke: dk, 'stroke-width': Math.max(2, R * 0.07), 'stroke-linejoin': 'round' }, g);
      E('ellipse', { cx: -0.45 * R, cy: 0.02 * R, rx: 0.22 * R, ry: 0.12 * R, fill: '#FFFFFF', opacity: 0.35, transform: `rotate(-24 ${-0.45 * R} ${0.02 * R})` }, g);
    }) }, parent);
    e.top = -0.55 * R;
    return e;
  }
  function flash(parent, r) {
    const g = G(parent); r = r || 18;
    E('circle', { r: r * 1.3, fill: glow('#FFFFFF') }, g);
    let d = ''; for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; d += `M${(Math.cos(a) * r * 0.45).toFixed(1)},${(Math.sin(a) * r * 0.45).toFixed(1)} L${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r).toFixed(1)} `; }
    E('path', { d, stroke: '#FFFFFF', 'stroke-width': 3.5, 'stroke-linecap': 'round' }, g);
    return g;
  }
  const flashAt = (f, t, t0, x, y) => { const u = (t - t0) / 0.38; if (u < 0 || u > 1) { op(f, 0); return; } op(f, 1 - u * u); tr(f, x, y, 0.5 + 0.9 * u); };
  const pill = (parent, text, o) => chip(parent, text, Object.assign({ size: 28, fill: 'rgba(10,27,39,0.86)', stroke: C.line, sw: 2.5 }, o || {}));
  const popIn = (el, t, t0, x, y, d) => { const p = P(t, t0, 0.45, pop); op(el, clamp(p * 2)); tr(el, x, y + (1 - clamp(p)) * (d === undefined ? 14 : d), Math.max(0.01, 0.85 + 0.15 * p)); return p; };
  const fadeIO = (t, a, b) => win(t, a, b, 0.4);
  function along(pts, u) {
    let L = 0; const seg = [];
    for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(l); L += l; }
    let d = clamp(u) * L;
    for (let i = 0; i < seg.length; i++) { if (d <= seg[i] || i === seg.length - 1) { const f = seg[i] ? clamp(d / seg[i]) : 0; return [lerp(pts[i][0], pts[i + 1][0], f), lerp(pts[i][1], pts[i + 1][1], f)]; } d -= seg[i]; }
    return pts[pts.length - 1];
  }
  const pathLen = pts => { let L = 0; for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); return L; };
  const STOMACH = [[-62, -150], [-4, -150], [12, -104], [4, -56], [34, -18], [110, -4], [176, 22], [182, 82], [110, 120], [10, 160], [-104, 146], [-176, 72], [-180, -26], [-128, -112]];
  function stomachIcon(parent, s) { return E('path', { d: closedPath(STOMACH.map(p => [p[0] * s, p[1] * s])), fill: ball('#F7B9C8', '#C25A7A'), stroke: '#FFD0DC', 'stroke-width': Math.max(2, 10 * s) }, parent); }
  function pancreasIcon(parent, s) { return E('path', { d: 'M-34,6 C-36,-8 -22,-13 -10,-10 C4,-7 14,-17 28,-15 C40,-13 42,0 33,6 C20,14 6,8 -6,13 C-18,18 -32,17 -34,6 Z', transform: `scale(${s})`, fill: ball('#F7D06A', '#B8862A'), stroke: '#FFE7A8', 'stroke-width': 2 / s }, parent); }
  function salivaryIcon(parent) {
    const g = G(parent);
    E('path', { d: 'M-22,-26 C-6,-40 22,-34 26,-10 L34,2 L27,6 L29,12 L25,14 L27,19 Q22,30 8,30 L-2,30 L-2,38 L-24,38 L-24,18 C-36,6 -36,-16 -22,-26 Z', fill: '#E8B48E', stroke: '#F7D9C2', 'stroke-width': 2, 'stroke-linejoin': 'round' }, g);
    E('path', { d: 'M-24,-24 C-12,-40 18,-38 24,-20 C10,-26 -6,-24 -24,-12 Z', fill: '#5A3A24' }, g);
    E('circle', { cx: 13, cy: -8, r: 3.2, fill: '#2A1D14' }, g);
    E('ellipse', { cx: -7, cy: 17, rx: 11, ry: 7, fill: '#E58FBE', stroke: '#FFD1EA', 'stroke-width': 1.5 }, g);
    E('path', { d: 'M0,-7 C4,-2 5,2 5,4 A5,5 0 0 1 -5,4 C-5,2 -4,-2 0,-7 Z', fill: C.water, transform: 'translate(36 22)' }, g);
    return g;
  }

  /* ================= A. catalyst: amylase on a conveyor of starch ================= */
  const A = G(root);
  const XE = 560, CYc = 402, SPc = 40, NPOOL = 34, HS = 20;
  const cEnz = enzyme(A, 'amy', 62);
  const cBondG = G(A), cUnitG = G(A);
  const pool = []; for (let i = 0; i < NPOOL; i++) pool.push({ b: E('line', { stroke: '#C98F22', 'stroke-width': 6, 'stroke-linecap': 'round' }, cBondG), u: hexU(cUnitG, HS) });
  const cFlash = flash(A, 26);
  const TS = mid('catalysts', 0.26), TA = mid('notalive', 0.5), TB = mid('notalive', 0.64), V1 = 100, V2 = 300;
  const O1 = V1 * (TA - TS), O2 = O1 + (V1 + V2) / 2 * (TB - TA);
  const offAt = t => { if (t <= TS) return 0; if (t <= TA) return V1 * (t - TS); if (t <= TB) { const d = t - TA; return O1 + V1 * d + (V2 - V1) * d * d / (2 * (TB - TA)); } return O2 + V2 * (t - TB); };
  const tAt = o => { if (o <= O1) return TS + o / V1; if (o <= O2) { const a = (V2 - V1) / (2 * (TB - TA)), c = O1 - o; return TA + (-V1 + Math.sqrt(V1 * V1 - 4 * a * c)) / (2 * a); } return TB + (o - O2) / V2; };
  const REL = j => 18 + (2 * j + 1.5) * SPc;                // conveyor offset at which piece j (units 2j, 2j+1) is cut off
  const pr = rng(91), PIECE = []; for (let j = 0; j < 80; j++) { const f = 1 + 0.9 * clamp((j - 9) / 6); PIECE.push({ dx: (50 + pr() * 50) * f, dy: (90 + pr() * 60) * (0.8 + 0.25 * f), rot: (pr() - 0.5) * 90 }); }
  const aTitle = T(A, 600, 178, 'Enzymes', { size: 62, weight: 700, anchor: 'middle', fill: C.water });
  const aCat = pill(A, 'biological catalysts', { size: 32, stroke: C.water, color: '#BDEBFA' });
  const nSpeed = G(A);
  E('path', { d: 'M-118,-14 L-96,0 L-118,14 Z M-96,-14 L-74,0 L-96,14 Z', fill: C.energy }, nSpeed);
  T(nSpeed, -60, 10, 'speed up reactions', { size: 30, weight: 700, fill: C.energy });
  const nUsed = G(A);
  tr(tick(nUsed, 13), -88, 0);
  T(nUsed, -64, 10, 'not used up', { size: 30, weight: 700, fill: C.good });
  // not alive: a crossed-out heartbeat; made by cells; a counter
  const ecg = G(A);
  const ecgLine = E('path', { d: 'M-150,0 L-50,0 L-34,-30 L-16,40 L4,-56 L20,14 L34,0 L150,0', fill: 'none', stroke: C.good, 'stroke-width': 6, 'stroke-linejoin': 'round', 'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': '1 1' }, ecg);
  const ecgX = cross(ecg, 30);
  const ecgT = T(ecg, 190, 12, 'not alive', { size: 36, weight: 700, fill: '#FFB3BA' });
  const mkG = G(A); tr(mkG, 178, 330);
  const mkCell = animalCell(mkG, 118, 92, { sw: 5, seed: 6, nr: 22, nx: -50, ny: -26 });
  const mkEnz = [[20, -30], [-10, 38], [60, 22]].map(p => { const e = enzyme(mkG, 'amy', 17); tr(e, p[0], p[1]); return { e, p }; });
  const mkOut = enzyme(A, 'amy', 17);
  const mkLbl = T(A, 178, 470, 'made by your cells', { size: 28, weight: 700, anchor: 'middle', fill: C.cell });
  const ctrG = G(A);
  const ctrW = textWidth('molecules digested: 00', 30, FD, 700) + 50;
  E('rect', { x: -ctrW / 2, y: -28, width: ctrW, height: 56, rx: 28, fill: 'rgba(10,27,39,0.86)', stroke: C.glucose, 'stroke-width': 2.5 }, ctrG);
  T(ctrG, -ctrW / 2 + 25, 11, 'molecules digested:', { size: 30, weight: 700, fill: C.glucoseLt });
  const ctrN = T(ctrG, ctrW / 2 - 25, 11, '0', { size: 30, weight: 800, anchor: 'end', fill: C.energy });

  /* ================= B. the three enzymes ================= */
  const Bg = G(root);
  const TY = [222, 387, 552];
  [['enzyme', 70, 'start'], ['breaks down', 400, 'middle'], ['into', 705, 'middle'], ['made in', 1025, 'middle']].forEach(([s, x, a]) => T(Bg, x, 128, s, { size: 25, weight: 600, anchor: a, fill: C.muted, font: FB }));
  const ROWS = [
    { id: 'amylase', kind: 'amy', name: 'amylase', col: C.water, sub: 'starch', prod: 'sugars', where: [['salivary', 'glands'], ['pancreas']] },
    { id: 'protease', kind: 'pro', name: 'protease', col: C.lactic, sub: 'protein', prod: 'amino acids', where: [['stomach'], ['pancreas']] },
    { id: 'lipase', kind: 'lip', name: 'lipase', col: C.heat, sub: 'fats', prod: 'fatty acids + glycerol', where: [['pancreas']] },
  ].map((r, i) => {
    const Y = TY[i], g = G(Bg);
    card(g, 50, Y - 72, 1100, 148, { fill: 'rgba(20,54,70,0.55)', stroke: C.line, rx: 20 });
    r.blob = enzyme(g, r.kind, 30); tr(r.blob, 98, Y - 4);
    r.nameT = T(g, 140, Y + 8, r.name, { size: 38, weight: 700, fill: r.col });
    r.subG = G(g); r.prodG = G(g); r.prods = [];
    if (i === 0) {
      for (let k = 0; k < 4; k++) E('line', { x1: (k - 2) * 27, y1: 0, x2: (k - 1) * 27, y2: 0, stroke: '#C98F22', 'stroke-width': 5 }, r.subG);
      for (let k = 0; k < 5; k++) tr(hexU(r.subG, 14), (k - 2) * 27, 0);
      [[-62, -6, 2], [8, 8, 2], [64, -6, 1]].forEach(([x, y, n]) => { const pg = G(r.prodG); if (n === 2) E('line', { x1: -13, y1: 0, x2: 13, y2: 0, stroke: '#C98F22', 'stroke-width': 5 }, pg); for (let k = 0; k < n; k++) tr(hexU(pg, 14), n === 2 ? (k - 0.5) * 27 : 0, 0); r.prods.push({ g: pg, x, y }); });
    } else if (i === 1) {
      for (let k = 0; k < 4; k++) E('line', { x1: (k - 2) * 26, y1: 0, x2: (k - 1) * 26, y2: 0, stroke: '#C8B6CF', 'stroke-width': 5 }, r.subG);
      for (let k = 0; k < 5; k++) tr(bead(r.subG, 13, k), (k - 2) * 26, 0);
      for (let k = 0; k < 5; k++) { const pg = G(r.prodG); bead(pg, 13, k); r.prods.push({ g: pg, x: (k - 2) * 38, y: k % 2 ? 8 : -8 }); }
    } else {
      fatMol(r.subG, 0.95);
      [[-86, -24, -8], [-74, 2, 6], [-88, 28, -4]].forEach(([x, y, rr]) => { const pg = G(r.prodG); tail(pg, 0.95); r.prods.push({ g: pg, x, y, r: rr }); });
      const bg = G(r.prodG); bar(bg, 0.95); r.prods.push({ g: bg, x: 62, y: 0 });
    }
    tr(r.subG, 400, Y - 4);
    r.subT = T(g, 400, Y + 52, r.sub, { size: 28, weight: 700, anchor: 'middle', fill: C.ink });
    r.arw = arrow(g, 488, Y - 4, 590, Y - 4, { color: C.ink, width: 6 });
    r.prodT = T(g, 705, Y + 52, r.prod, { size: 28, weight: 700, anchor: 'middle', fill: C.ink });
    r.flash = flash(g, 20);
    r.icons = r.where.map((w, k) => {
      const ig = G(g), x = r.where.length === 2 ? [962, 1090][k] : 1025;
      const art = G(ig); tr(art, x, Y - 14);
      if (w[0] === 'salivary') salivaryIcon(art); else if (w[0] === 'stomach') stomachIcon(art, 0.17); else pancreasIcon(art, 1.05);
      w.forEach((ln, j) => T(ig, x, Y + 38 + j * 28, ln, { size: 26, weight: 600, anchor: 'middle', fill: w[0] === 'pancreas' ? '#F7D06A' : w[0] === 'stomach' ? '#F7B9C8' : '#E8B48E' }));
      return ig;
    });
    r.g = g; r.Y = Y;
    return r;
  });

  /* ================= C. the names help ================= */
  const Cg = G(root);
  const cHead = T(Cg, 600, 178, 'The names help:', { size: 44, weight: 700, anchor: 'middle' });
  const NAMES = [['pro', '**P**rotease', C.lactic, '**p**rotein'], ['lip', '**L**ipase', C.heat, '**l**ipids'], ['amy', '**A**mylase', C.water, 'st**a**rch']].map(([k, nm, col, sub], i) => {
    const g = G(Cg), y = 300 + i * 120;
    const e = enzyme(g, k, 34); tr(e, 322, y - 14);
    T(g, 380, y, nm, { size: 52, weight: 700, fill: col, boldFill: C.energy });
    arrow(g, 640, y - 16, 712, y - 16, { color: C.muted, width: 6 });
    T(g, 740, y, sub, { size: 52, weight: 700, fill: C.ink, boldFill: C.energy });
    return g;
  });

  /* ================= D. specific: lock and key ================= */
  const Dg = G(root);
  const spChip = pill(Dg, 'each enzyme is specific', { size: 30, stroke: C.lactic, color: '#FFC2DD' });
  const SPX = 560, SPY = 478, SR = 120, NY = SPY - 0.55 * SR;
  const sEnz = enzyme(Dg, 'pro', SR); tr(sEnz, SPX, SPY);
  const sName = T(Dg, SPX, SPY + 132, 'protease', { size: 34, weight: 700, anchor: 'middle', fill: C.lactic });
  const sStarch = G(Dg), sProt = G(Dg);
  [2, 1].forEach(k => E('line', { x1: -k * 66 + 66, y1: -k * 52 + 52, x2: -k * 66, y2: -k * 52, stroke: '#C98F22', 'stroke-width': 8 }, sStarch));
  const stU = [0, 1, 2].map(k => { const h = hexU(sStarch, 46); tr(h, -k * 66, -k * 52, 1, 30); return h; });
  [2, 1].forEach(k => E('line', { x1: k * 62 - 62, y1: -k * 54 + 54, x2: k * 62, y2: -k * 54, stroke: '#C8B6CF', 'stroke-width': 8 }, sProt));
  [0, 1, 2].forEach(k => { const b_ = bead(sProt, 40, k + 1); tr(b_, k * 62, -k * 54); });
  const stL = T(Dg, 0, 0, 'starch', { size: 30, weight: 700, anchor: 'end', fill: C.glucoseLt });
  const prL = T(Dg, 0, 0, 'protein', { size: 30, weight: 700, anchor: 'start', fill: '#FFB3AC' });
  const sX = cross(Dg, 22), sTick = tick(Dg, 24), sFlash = flash(Dg, 34);
  const noFit = T(Dg, SPX + 178, NY + 32, 'no fit', { size: 30, weight: 700, anchor: 'start', fill: '#FFB3BA' });
  const fits = T(Dg, SPX + 178, NY + 32, 'fits!', { size: 30, weight: 700, anchor: 'start', fill: C.good });
  const lockG = G(Dg); tr(lockG, 960, 360);
  const shackle = E('path', { d: 'M-30,-20 L-30,-52 A30,30 0 0 1 30,-52 L30,-20', fill: 'none', stroke: '#AEBAC4', 'stroke-width': 12, 'stroke-linecap': 'round' }, lockG);
  E('rect', { x: -52, y: -24, width: 104, height: 86, rx: 14, fill: ball('#F2C14E', '#A57A12'), stroke: '#FFE7A8', 'stroke-width': 3 }, lockG);
  E('path', { d: 'M0,4 m-9,0 a9,9 0 1 1 18,0 a9,9 0 1 1 -18,0 M-4,10 L-7,34 L7,34 L4,10 Z', fill: '#4A3A12' }, lockG);
  const keyG = G(lockG);
  E('path', { d: 'M2,16 L74,16 M42,16 L42,30 M58,16 L58,26', stroke: '#F7D06A', 'stroke-width': 9, 'stroke-linecap': 'round' }, keyG);
  E('circle', { cx: 96, cy: 16, r: 22, fill: 'none', stroke: '#F7D06A', 'stroke-width': 9 }, keyG);
  const lockL = T(Dg, 960, 486, 'one key, one lock', { size: 28, weight: 700, anchor: 'middle', fill: '#F7D06A' });

  /* ================= E. lactose intolerance ================= */
  const Eg = G(root);
  const lcChip = pill(Eg, 'lactose intolerance', { size: 32, stroke: '#EEF3F6', color: C.ink });
  const glass = G(Eg); tr(glass, 170, 470);
  const glassD = 'M-62,-112 L62,-112 L52,102 Q50,114 38,114 L-38,114 Q-50,114 -52,102 Z';
  E('path', { d: glassD, fill: 'rgba(200,230,250,0.08)' }, glass);
  E('path', { d: 'M-60,-80 L60,-80 L52,102 Q50,114 38,114 L-38,114 Q-50,114 -52,102 Z', fill: '#F4F1E8' }, glass);
  E('ellipse', { cx: 0, cy: -80, rx: 60, ry: 8, fill: '#FFFFFF' }, glass);
  E('path', { d: glassD, fill: 'none', stroke: GLASS.stroke, 'stroke-width': 4, 'stroke-linejoin': 'round' }, glass);
  const milkL = T(Eg, 170, 630, 'milk', { size: 30, weight: 700, anchor: 'middle' });
  const LCY = 430, LSLOT = [520, 680, 840];
  const slots = LSLOT.map((x, k) => {
    if (k === 1) { const e = enzyme(Eg, 'lac', 40); tr(e, x, LCY - e.top + 2); return e; }
    const e = E('path', { d: enzPath('lac', 40), fill: 'none', stroke: '#8FA3B2', 'stroke-width': 3, 'stroke-dasharray': '8 7', transform: `translate(${x} ${(LCY + 0.55 * 40 + 2).toFixed(1)})` }, Eg);
    return e;
  });
  const slotL = T(Eg, 680, 545, 'not enough of the enzyme', { size: 28, weight: 700, anchor: 'middle', fill: '#C9D6DE' });
  const lacL = T(Eg, 330, 352, 'milk sugar (lactose)', { size: 28, weight: 700, anchor: 'start', fill: '#FFF0C8' });
  const tummy = G(Eg); tr(tummy, 1040, 440);
  stomachIcon(tummy, 0.5);
  const rumble = G(tummy);
  [-1, 1].forEach(s => E('path', { d: `M${s * 112},-30 q${s * 16},16 0,32 q${-s * 16},16 0,32 M${s * 132},-20 q${s * 12},12 0,24 q${-s * 12},12 0,24`, fill: 'none', stroke: '#FFB3BA', 'stroke-width': 4, 'stroke-linecap': 'round' }, rumble));
  const gas = [0, 1, 2].map(() => E('circle', { r: 7, fill: 'none', stroke: '#C9D6DE', 'stroke-width': 3 }, tummy));
  const tumL = T(Eg, 1040, 560, 'tummy ache', { size: 28, weight: 700, anchor: 'middle', fill: '#FFB3BA' });
  const LPATH = [[170, 360], [250, LCY], [1000, LCY], [1030, 440]];
  const LLEN = pathLen(LPATH);
  const pairs = []; for (let k = 0; k < 9; k++) { const g = G(Eg); E('line', { x1: -15, y1: 0, x2: 15, y2: 0, stroke: '#C98F22', 'stroke-width': 5 }, g); const u0 = hexU(g, 16), u1 = hexU(g, 16, true); tr(u0, -16, 0); tr(u1, 16, 0); pairs.push({ g, u0, u1, t0: at('lactose') + 0.55 + k * 0.78 }); }
  const lacFlash = flash(Eg, 22);
  const CUTK = 1, CUT_T = pairs[CUTK].t0 + pathLen([[170, 360], [250, LCY], [680, LCY]]) / 150;

  /* ================= F. conditions: pH ================= */
  const Fg = G(root);
  const fL = G(Fg), fR = G(Fg);
  card(fL, 60, 112, 500, 420, { fill: 'rgba(20,54,70,0.6)', stroke: C.line });
  card(fR, 640, 112, 500, 420, { fill: 'rgba(20,54,70,0.6)', stroke: C.line });
  T(fL, 310, 166, 'stomach', { size: 36, weight: 700, anchor: 'middle', fill: '#F7B9C8' });
  T(fR, 890, 166, 'small intestine', { size: 36, weight: 700, anchor: 'middle', fill: '#F7B9C8' });
  const fStom = G(fL); tr(fStom, 300, 330); stomachIcon(fStom, 0.62);
  const fBub = bubbles(fL, 220, 300, 160, 100, { n: 8, r: 6, seed: 4, speed: 0.45, color: 'rgba(255,180,160,0.9)' });
  const fPro = enzyme(fL, 'pro', 32);
  const acidChip = chip(fL, 'acid', { size: 30, fill: '#C9403A', color: '#FFFFFF' }); tr(acidChip, 310, 482);
  const gutD = 'M-170,-30 C-120,-90 -60,-90 -30,-40 C0,10 50,10 80,-40 C110,-90 170,-60 170,0 C170,60 110,80 80,40 C50,0 0,0 -30,50 C-60,100 -130,90 -170,40';
  E('path', { d: gutD, fill: 'none', stroke: '#B8466A', 'stroke-width': 46, 'stroke-linecap': 'round', transform: 'translate(890 335)' }, fR);
  E('path', { d: gutD, fill: 'none', stroke: '#F4A6B8', 'stroke-width': 36, 'stroke-linecap': 'round', transform: 'translate(890 335)' }, fR);
  const fAmy = enzyme(fR, 'amy', 28), fLip = enzyme(fR, 'lip', 28);
  const alkChip = chip(fR, 'slightly alkaline', { size: 30, fill: '#3D6FD8', color: '#FFFFFF' }); tr(alkChip, 890, 482);
  // the pH scale (shared with the neutralise beat)
  const phG = G(root);
  const phId = 'dgEnzPhGrad';
  { const lg = E('linearGradient', { id: phId, x1: 0, y1: 0, x2: 1, y2: 0 }, defs()); [['0', '#E8424F'], ['0.25', '#F59A3A'], ['0.45', '#E8D24A'], ['0.55', '#5BC46A'], ['0.75', '#3D7BE0'], ['1', '#7A4FD0']].forEach(([o, c]) => E('stop', { offset: o, 'stop-color': c }, lg)); }
  const PHX = ph => 150 + 900 * ph / 14;
  E('rect', { x: 150, y: 592, width: 900, height: 26, rx: 13, fill: `url(#${phId})`, stroke: '#0A1B27', 'stroke-width': 2 }, phG);
  T(phG, 150, 656, 'acid', { size: 26, weight: 700, fill: '#FF8A80' });
  T(phG, 600, 656, 'neutral', { size: 26, weight: 700, anchor: 'middle', fill: '#9EE5A8' });
  T(phG, 1050, 656, 'alkaline', { size: 26, weight: 700, anchor: 'end', fill: '#B7A2FF' });
  const pinD = 'M0,0 L-13,-22 A15,15 0 1 1 13,-22 Z';
  const pinA = E('path', { d: pinD, fill: '#C9403A', stroke: '#FFFFFF', 'stroke-width': 2.5 }, phG);
  const pinB = E('path', { d: pinD, fill: '#3D6FD8', stroke: '#FFFFFF', 'stroke-width': 2.5 }, phG);
  const pinN = E('path', { d: pinD, fill: '#FFFFFF', stroke: '#0A1B27', 'stroke-width': 2.5 }, phG);

  /* ================= G. bile: made, stored, released ================= */
  const Gg = G(root);
  const liver = G(Gg); tr(liver, 300, 262);
  E('path', { d: 'M-176,-62 C-120,-106 40,-100 150,-82 C204,-72 222,-50 196,-30 C140,4 40,44 -60,74 C-132,94 -192,64 -198,4 C-200,-30 -194,-48 -176,-62 Z', fill: linGrad('#C9505B', '#7A1F2A', true), stroke: '#E27A84', 'stroke-width': 3, 'stroke-linejoin': 'round' }, liver);
  E('path', { d: 'M12,-96 C20,-50 14,0 -14,58', fill: 'none', stroke: '#7A1F2A', 'stroke-width': 4, opacity: 0.75 }, liver);
  E('path', { d: 'M-150,-50 C-110,-80 -40,-84 10,-80', fill: 'none', stroke: '#E27A84', 'stroke-width': 5, opacity: 0.35, 'stroke-linecap': 'round' }, liver);
  const GBX = 430, GBY = 408;
  const gbD = 'M0,-56 C32,-52 38,-12 32,24 C26,56 -26,56 -32,24 C-38,-12 -32,-52 0,-56 Z';
  const gbClip = 'dgEnzGbClip';
  { const cp = E('clipPath', { id: gbClip }, defs()); E('path', { d: gbD, transform: `translate(${GBX} ${GBY})` }, cp); }
  E('path', { d: 'M430,352 C428,330 420,320 410,312', fill: 'none', stroke: '#4C8A26', 'stroke-width': 10, 'stroke-linecap': 'round' }, Gg);
  E('path', { d: 'M436,462 C440,510 470,540 500,582', fill: 'none', stroke: '#4C8A26', 'stroke-width': 14, 'stroke-linecap': 'round' }, Gg);
  E('path', { d: 'M436,462 C440,510 470,540 500,582', fill: 'none', stroke: '#9BD46A', 'stroke-width': 7, 'stroke-linecap': 'round' }, Gg);
  E('path', { d: gbD, transform: `translate(${GBX} ${GBY})`, fill: 'rgba(127,191,77,0.18)' }, Gg);
  const gbLevel = E('rect', { x: GBX - 40, y: GBY + 56, width: 80, height: 0, fill: '#7FBF4D', opacity: 0.9, 'clip-path': `url(#${gbClip})` }, Gg);
  E('path', { d: gbD, transform: `translate(${GBX} ${GBY})`, fill: 'none', stroke: '#B5E68A', 'stroke-width': 3 }, Gg);
  E('path', { d: 'M110,612 L640,612', stroke: '#B8466A', 'stroke-width': 64, 'stroke-linecap': 'round' }, Gg);
  E('path', { d: 'M110,612 L640,612', stroke: '#F4A6B8', 'stroke-width': 52, 'stroke-linecap': 'round' }, Gg);
  const giL = T(Gg, 375, 696, 'small intestine', { size: 26, weight: 600, anchor: 'middle', fill: '#F7B9C8' });
  const bDrops = []; for (let k = 0; k < 12; k++) bDrops.push(E('circle', { r: 8, fill: ball('#9BD46A', '#4C8A26') }, Gg));
  const lvL = labelLine(Gg, 650, 236, 480, 250, 'liver: makes bile', { size: 30, fill: '#F2A0A8' });
  const gbL = labelLine(Gg, 650, 412, 466, 404, 'gall bladder: stores it', { size: 30, fill: '#B5E68A' });
  const notE = G(Gg); tr(notE, 895, 528);
  const neChip = pill(notE, 'bile is NOT an enzyme', { size: 30, stroke: '#7FBF4D', color: '#D8F5BF' });
  const neE = enzyme(notE, 'lac', 18); tr(neE, -neChip.w / 2 - 40, 2);
  const neX = cross(notE, 15); tr(neX, -neChip.w / 2 - 40, 2);
  const jobs = G(Gg); tr(jobs, 895, 622);
  const jobChips = ['job 1', 'job 2'].map((s, k) => { const c = pill(jobs, s, { size: 28, stroke: C.energy, color: C.energy }); tr(c, (k - 0.5) * 170, 0); return c; });

  /* ================= H. emulsify: one big globule, dozens of droplets ================= */
  const Hg = G(root);
  E('rect', { x: 50, y: 106, width: 1100, height: 590, rx: 30, fill: 'rgba(244,166,184,0.06)', stroke: 'rgba(244,166,184,0.25)', 'stroke-width': 2 }, Hg);
  const hIn = T(Hg, 80, 150, 'in the small intestine', { size: 26, weight: 600, fill: '#F7B9C8' });
  const GX = 520, GY = 410;
  const globule = E('circle', { cx: 0, cy: 0, r: 122, fill: ball('#FFE9A8', '#D9A93A'), stroke: '#FFF3CC', 'stroke-width': 3 }, Hg);
  const er = rng(64), drops = [];
  for (let tries = 0; drops.length < 44 && tries < 2000; tries++) {
    const x = GX + (er() - 0.5) * 760, y = GY + (er() - 0.5) * 400, r = 10 + er() * 8;
    if (((x - GX) / 380) ** 2 + ((y - GY) / 200) ** 2 > 1) continue;
    if (drops.some(d => Math.hypot(d.x - x, d.y - y) < d.r + r + 16)) continue;
    const a = er() * TAU, q = Math.sqrt(er()) * 90;
    drops.push({ x, y, r, sx: GX + Math.cos(a) * q, sy: GY + Math.sin(a) * q, d: er(), el: E('circle', { r, fill: ball('#FFE9A8', '#D9A93A'), stroke: '#7FBF4D', 'stroke-width': 0 }, Hg) });
  }
  const dropPos = (d, t, t0) => { const p = P(t, t0 + d.d * 0.35, 0.9, easeOut); return [lerp(d.sx, d.x, p) + Math.sin(t * 1.3 + d.d * 9) * 4 * calm, lerp(d.sy, d.y, p) + Math.cos(t * 1.1 + d.d * 7) * 4 * calm, p]; };
  const bileIn = []; for (let k = 0; k < 10; k++) { const a = -2.75 + k * 0.27; bileIn.push({ el: E('circle', { r: 10, fill: ball('#9BD46A', '#4C8A26') }, Hg), a, x0: 150 + (er() - 0.5) * 80, y0: 130 + er() * 40 }); }
  const lips = []; for (let k = 0; k < 9; k++) lips.push({ e: enzyme(Hg, 'lip', 21), target: Math.floor(k * drops.length / 9 + 2) % drops.length, side: k % 2 ? 1 : -1, from: [k % 3 === 0 ? 40 : k % 3 === 1 ? 1160 : 600, k % 3 === 2 ? 720 : 200 + k * 50] });
  const saM = meter(Hg, { w: 44, h: 300, vertical: true, color: C.energy }); tr(saM, 1036, 250);
  T(Hg, 1058, 596, 'surface area', { size: 26, weight: 700, anchor: 'middle', fill: C.energy });
  const emChip = pill(Hg, 'emulsified: lots of tiny droplets', { size: 28, stroke: '#7FBF4D', color: '#D8F5BF' });
  const lfChip = pill(Hg, 'so lipase works faster', { size: 28, stroke: C.heat, color: '#FFC9A3' });

  /* ================= I. neutralise the stomach acid ================= */
  const Ig = G(root);
  const TUY = 380;
  E('path', { d: `M126,${TUY} L1074,${TUY}`, stroke: '#B8466A', 'stroke-width': 176, 'stroke-linecap': 'round' }, Ig);
  E('path', { d: `M126,${TUY} L1074,${TUY}`, stroke: '#3A1620', 'stroke-width': 160, 'stroke-linecap': 'round' }, Ig);
  const lumId = 'dgEnzLumClip';
  { const cp = E('clipPath', { id: lumId }, defs()); E('rect', { x: 46, y: TUY - 80, width: 1108, height: 160, rx: 80 }, cp); }
  const lum = G(Ig, { 'clip-path': `url(#${lumId})` });
  const acidR = E('rect', { x: 40, y: TUY - 80, width: 0, height: 160, fill: '#E5533F', opacity: 0.55 }, lum);
  const neutR = E('rect', { x: 440, y: TUY - 80, width: 0, height: 160, fill: '#5ED4C1', opacity: 0.78 }, lum);
  E('path', { d: 'M440,110 L440,296', stroke: '#4C8A26', 'stroke-width': 30, 'stroke-linecap': 'round' }, Ig);
  E('path', { d: 'M440,110 L440,300', stroke: '#9BD46A', 'stroke-width': 18, 'stroke-linecap': 'round' }, Ig);
  const nDrops = []; for (let k = 0; k < 6; k++) nDrops.push(E('circle', { r: 8, fill: ball('#C2F09A', '#4C8A26') }, Ig));
  const acidBub = bubbles(Ig, 110, TUY - 60, 310, 120, { n: 10, r: 6, seed: 9, speed: 0.5, color: 'rgba(255,190,170,0.85)' });
  const nAcidL = T(Ig, 90, 236, 'stomach acid →', { size: 28, weight: 700, fill: '#FF9A8A' });
  const nBileL = T(Ig, 470, 150, 'bile (alkaline)', { size: 28, weight: 700, fill: '#B5E68A' });
  const nEnz = [['amy', 700, -20], ['lip', 860, 26], ['amy', 1020, -10]].map(([k, x, y]) => ({ e: enzyme(Ig, k, 30), x, y }));
  const pinChip = pill(Ig, 'acid', { size: 28, fill: '#C9403A', color: '#FFFFFF', stroke: '#FFFFFF', sw: 2 });
  const pinChip2 = pill(Ig, 'slightly alkaline', { size: 28, fill: '#3D6FD8', color: '#FFFFFF', stroke: '#FFFFFF', sw: 2 });
  const happyL = T(Ig, 880, 262, 'enzymes back to work', { size: 28, weight: 700, anchor: 'middle', fill: C.good });

  /* ================= J. biological washing powder ================= */
  const Jg = G(root);
  const MX = 470, MY = 420;
  E('rect', { x: MX - 210, y: 130, width: 420, height: 540, rx: 26, fill: linGrad('#F4F7FA', '#C9D3DC', true), stroke: '#FFFFFF', 'stroke-width': 3 }, Jg);
  E('line', { x1: MX - 210, y1: 214, x2: MX + 210, y2: 214, stroke: '#AEBAC4', 'stroke-width': 3 }, Jg);
  E('rect', { x: MX - 180, y: 156, width: 110, height: 36, rx: 8, fill: '#C9D3DC', stroke: '#AEBAC4', 'stroke-width': 2 }, Jg);
  const dial = G(Jg); tr(dial, MX + 140, 172);
  E('circle', { r: 26, fill: '#3A4752', stroke: '#AEBAC4', 'stroke-width': 3 }, dial);
  const dialP = E('line', { x1: 0, y1: 0, x2: 0, y2: -18, stroke: C.water, 'stroke-width': 5, 'stroke-linecap': 'round' }, dial);
  E('circle', { cx: MX, cy: MY + 20, r: 168, fill: '#9AA8B4', stroke: '#E9EEF2', 'stroke-width': 4 }, Jg);
  E('circle', { cx: MX, cy: MY + 20, r: 140, fill: '#22323D' }, Jg);
  const drumId = 'dgEnzDrumClip';
  { const cp = E('clipPath', { id: drumId }, defs()); E('circle', { cx: MX, cy: MY + 20, r: 138 }, cp); }
  const drum = G(Jg, { 'clip-path': `url(#${drumId})` });
  E('rect', { x: MX - 140, y: MY + 70, width: 280, height: 100, fill: '#4CC9F0', opacity: 0.22 }, drum);
  const shirt = G(drum);
  E('path', { d: 'M-78,-66 L-32,-84 Q0,-66 32,-84 L78,-66 L106,-22 L72,-6 L66,80 L-66,80 L-72,-6 L-106,-22 Z', fill: ball('#7FA8F5', '#3D6FD8'), stroke: '#BFD4FB', 'stroke-width': 3, 'stroke-linejoin': 'round' }, shirt);
  const blood = E('path', { d: closedPath(blobPts(26, 20, 9, 0, 0.18, 5)), fill: '#7E1621', opacity: 0.95 }, shirt);
  const grease = E('path', { d: closedPath(blobPts(28, 18, 9, 0, 0.2, 9)), fill: '#8E6A2A', opacity: 0.9 }, shirt);
  const STB = [-26, -14], STG = [30, 34];
  const wEnz = [['pro', -1], ['pro', 1], ['lip', -1], ['lip', 1]].map(([k, s], i) => ({ e: enzyme(drum, k, 15), k, s, i }));
  E('circle', { cx: MX, cy: MY + 20, r: 140, fill: 'none', stroke: 'rgba(255,255,255,0.25)', 'stroke-width': 8 }, Jg);
  E('path', { d: `M${MX - 96},${MY - 66} A118,118 0 0 1 ${MX + 20},${MY - 98}`, fill: 'none', stroke: '#FFFFFF', 'stroke-width': 7, opacity: 0.3, 'stroke-linecap': 'round' }, Jg);
  const wChip = pill(Jg, 'biological washing powder', { size: 30, stroke: C.water, color: '#BDEBFA' });
  const wEnzL = G(Jg);
  { const e1 = enzyme(wEnzL, 'pro', 18); tr(e1, -150, 0); T(wEnzL, -122, 10, 'protease', { size: 28, weight: 700, fill: C.lactic }); const e2 = enzyme(wEnzL, 'lip', 18); tr(e2, 30, 0); T(wEnzL, 58, 10, 'lipase', { size: 28, weight: 700, fill: C.heat }); }
  const bLbl = G(Jg), gLbl = G(Jg);
  const bLine = E('line', { stroke: '#FF8A94', 'stroke-width': 2.5 }, bLbl), bDot = E('circle', { r: 5, fill: '#FF8A94' }, bLbl);
  T(bLbl, 760, 400, 'blood stain: protein', { size: 28, weight: 700, fill: '#FF8A94' });
  const gLine = E('line', { stroke: '#E8C27A', 'stroke-width': 2.5 }, gLbl), gDot = E('circle', { r: 5, fill: '#E8C27A' }, gLbl);
  T(gLbl, 760, 500, 'grease stain: fat', { size: 28, weight: 700, fill: '#E8C27A' });
  const coolChip = pill(Jg, 'even in a cool wash: 30 °C', { size: 28, stroke: C.water, color: '#BDEBFA' });

  /* ---------- headers ---------- */
  const header = text => { const c = chip(root, text, { size: 28, fill: 'rgba(10,27,39,0.78)', stroke: C.line, sw: 2, color: C.energy }); tr(c, 1160 - c.w / 2, 60); return c; };
  const hd1 = header('Job 1 · Emulsify fat'), hd2 = header('Job 2 · Neutralise acid');

  /* ================= update ================= */
  return t => {
    /* ----- A: the conveyor ----- */
    const aA = Math.min(P(t, S.first - 0.1, 0.4, linear), 1 - P(t, at('amylase') - 0.35, 0.4, linear));
    op(A, aA);
    if (aA > 0) {
      const off = offAt(t);
      let jMin = 0; while (jMin < 70 && tAt(REL(jMin)) < t - 1.7) jMin++;
      const k0 = 2 * jMin, pos = [];
      for (let k = k0; k <= k0 + NPOOL; k++) {
        const j = k >> 1, released = off >= REL(j);
        if (!released) {
          const x = XE + 18 + k * SPc - off, damp = clamp((x - XE - 40) / 160);
          pos.push([x, CYc + 7 * Math.sin(k * 0.7 - t * 1.4) * damp * calm, 0, 1, false]);
        } else {
          const tr_ = tAt(REL(j)), tau = t - tr_, pc = PIECE[j % 80];
          const x = XE - 40 + (k % 2 ? 20 : -20) - pc.dx * tau, y = CYc + pc.dy * easeOut(clamp(tau / 1.5)) + 15 * tau;
          pos.push([x, y, pc.rot * tau, 1 - P(tau, 1.15, 0.5, linear), true]);
        }
      }
      pool.forEach((s, i) => {
        // slot i draws logical unit k = the one in [k0, k0 + NPOOL) with k % NPOOL == i
        const k = k0 + ((i - k0) % NPOOL + NPOOL) % NPOOL, q = pos[k - k0], q2 = pos[k - k0 + 1];
        const j = k >> 1;
        if (q[4]) { const cx = (pos[(k & ~1) - k0][0] + pos[(k | 1) - k0][0]) / 2, cy = (pos[(k & ~1) - k0][1] + pos[(k | 1) - k0][1]) / 2, a = q[2] * Math.PI / 180, dx = (k % 2 ? 20 : -20); tr(s.u, cx + Math.cos(a) * dx, cy + Math.sin(a) * dx, 1, q[2]); }
        else tr(s.u, q[0], q[1]);
        op(s.u, q[3]);
        const internal = k % 2 === 0, keep = internal ? true : !(off >= REL(j));
        if (keep && q2) {
          let x1 = q[0], y1 = q[1], x2 = q2[0], y2 = q2[1];
          if (internal && q[4]) { const cx = (q[0] + q2[0]) / 2, cy = (q[1] + q2[1]) / 2, a = q[2] * Math.PI / 180; x1 = cx - Math.cos(a) * 20; y1 = cy - Math.sin(a) * 20; x2 = cx + Math.cos(a) * 20; y2 = cy + Math.sin(a) * 20; }
          attr(s.b, 'x1', x1); attr(s.b, 'y1', y1); attr(s.b, 'x2', x2); attr(s.b, 'y2', y2); op(s.b, q[3]);
        } else op(s.b, 0);
      });
      let jl = -1; for (let j = jMin; j < 80 && off >= REL(j); j++) jl = j;
      const tl = jl >= 0 ? tAt(REL(jl)) : -9;
      flashAt(cFlash, t, tl, XE, CYc);
      const pulse = Math.sin(Math.PI * clamp((t - tl) / 0.25));
      tr(cEnz, XE, CYc - cEnz.top + 3 + 4 * pulse, 1 + 0.04 * pulse);
      // words
      const aW = 1 - P(t, at('notalive') - 0.25, 0.4, linear);
      op(aTitle, P(t, mid('catalysts', 0.14), 0.5, linear) * aW); tr(aTitle, 0, (1 - P(t, mid('catalysts', 0.14), 0.6, easeOut)) * 12);
      const cp = popIn(aCat, t, mid('catalysts', 0.42), 600, 248); op(aCat, clamp(cp * 2) * aW);
      const ns = popIn(nSpeed, t, mid('catalysts', 0.64), 360, 652); op(nSpeed, clamp(ns * 2) * aW);
      const nu = popIn(nUsed, t, mid('catalysts', 0.84), 860, 652); op(nUsed, clamp(nu * 2) * aW);
      // not alive
      const eIn = P(t, at('notalive') - 0.05, 0.4, linear);
      op(ecg, eIn); tr(ecg, 520, 182);
      ecgLine.setAttribute('stroke-dashoffset', (1 - P(t, at('notalive'), 0.7, linear)).toFixed(3));
      const xp = P(t, mid('notalive', 0.12), 0.4, pop); op(ecgX, clamp(xp * 2)); tr(ecgX, 0, 0, Math.max(0.01, xp));
      op(ecgT, P(t, mid('notalive', 0.12), 0.4, linear));
      const mk = P(t, mid('notalive', 0.27), 0.5, pop); op(mkG, clamp(mk * 2)); tr(mkG, 178, 330, Math.max(0.01, 0.8 + 0.2 * mk)); mkCell.upd(t);
      mkEnz.forEach((o, k) => { const p = P(t, mid('notalive', 0.3 + k * 0.05), 0.4, pop); op(o.e, clamp(p * 2)); tr(o.e, o.p[0], o.p[1] + Math.sin(t * 2 + k) * 3 * calm, Math.max(0.01, p)); });
      const fo = P(t, mid('notalive', 0.42), 1.3, ease);
      op(mkOut, fo > 0 && fo < 1 ? Math.min(1, fo * 6, (1 - fo) * 3) : 0); tr(mkOut, lerp(238, 470, fo), lerp(352, 402, fo) - Math.sin(fo * Math.PI) * 60);
      op(mkLbl, P(t, mid('notalive', 0.34), 0.4, linear));
      const c0 = mid('notalive', 0.56);
      let n = 0, tLast = -9; for (let j = 0; j < 80 && off >= REL(j); j++) { const tj = tAt(REL(j)); if (tj >= c0) { n++; tLast = tj; } }
      setText(ctrN, String(n));
      popIn(ctrG, t, c0, 860, 652);
      const bump = Math.sin(Math.PI * clamp((t - tLast) / 0.22));
      ctrN.setAttribute('transform', `translate(${(ctrW / 2 - 25).toFixed(1)} 0) scale(${(1 + 0.25 * bump).toFixed(3)}) translate(${(-(ctrW / 2 - 25)).toFixed(1)} 0)`);
    }

    /* ----- B: the table ----- */
    const aB = fadeIO(t, at('amylase') - 0.2, at('names') + 0.25);
    op(Bg, aB);
    if (aB > 0) {
      ROWS.forEach((r, i) => {
        const L = r.id, on = P(t, at(L) - 0.15, 0.4, linear);
        op(r.g, on);
        if (on <= 0) return;
        const bp = P(t, at(L), 0.5, pop); tr(r.blob, 98, r.Y - 4 + Math.sin(t * 2 + i) * 2 * calm, Math.max(0.01, bp));
        op(r.nameT, P(t, mid(L, i === 0 ? 0.1 : 0.02), 0.4, linear));
        const sp = P(t, mid(L, 0.18), 0.45, pop); op(r.subG, clamp(sp * 2)); tr(r.subG, 400, r.Y - 4, Math.max(0.01, 0.8 + 0.2 * sp));
        op(r.subT, P(t, mid(L, 0.2), 0.4, linear));
        r.arw.set(P(t, mid(L, 0.3), 0.5)); op(r.arw, P(t, mid(L, 0.3), 0.15, linear));
        flashAt(r.flash, t, mid(L, 0.36), 540, r.Y - 4);
        r.prods.forEach((q, k) => {
          const p = P(t, mid(L, 0.38) + k * 0.08, 0.5, easeOut);
          op(q.g, clamp(p * 3)); tr(q.g, lerp(600, 705 + q.x, p), r.Y - 4 + q.y * p, Math.max(0.01, 0.5 + 0.5 * p), (q.r || 0) * p);
        });
        op(r.prodT, P(t, mid(L, 0.42), 0.4, linear));
        const IW = [[0.58, 0.87], [0.65, 0.86], [0.75]][i];
        r.icons.forEach((ig, k) => { const p = P(t, mid(L, IW[k]), 0.45, pop); op(ig, clamp(p * 2)); });
      });
    }

    /* ----- C: names ----- */
    const aC = fadeIO(t, at('names') - 0.2, at('specific') + 0.15);
    op(Cg, aC);
    if (aC > 0) {
      op(cHead, P(t, at('names') - 0.1, 0.4, linear));
      NAMES.forEach((g, i) => { const p = P(t, mid('names', [0.2, 0.48, 0.72][i]), 0.5, easeOut); op(g, p); tr(g, (1 - p) * -30, 0); });
    }

    /* ----- D: specific ----- */
    const aD = fadeIO(t, at('specific') - 0.2, at('lactose') + 0.15);
    op(Dg, aD);
    if (aD > 0) {
      popIn(spChip, t, at('specific') - 0.1, 600, 160);
      // starch tries the notch: no fit
      const sIn = P(t, mid('specific', 0.12), 0.9, easeOut), sOut = P(t, mid('specific', 0.42), 0.8, ease);
      const wob = Math.sin((t - mid('specific', 0.12) - 0.9) * 18) * 5 * (t > mid('specific', 0.12) + 0.9 && sOut === 0 ? 1 : 0) * calm;
      const stx = lerp(lerp(-120, SPX, sIn), 330, sOut) + wob, sty = lerp(lerp(150, NY - 14, sIn), 240, sOut);
      tr(sStarch, stx, sty); op(sStarch, Math.min(P(t, mid('specific', 0.1), 0.3, linear), 1 - P(t, mid('specific', 0.55), 0.4, linear)));
      attr(stL, 'x', stx - 132 - 58); attr(stL, 'y', sty - 104 + 10); op(stL, P(t, mid('specific', 0.16), 0.4, linear) * (1 - P(t, mid('specific', 0.55), 0.4, linear)));
      const xp = P(t, mid('specific', 0.3), 0.4, pop); op(sX, clamp(xp * 2) * (1 - P(t, mid('specific', 0.5), 0.3, linear))); tr(sX, SPX + 150, NY + 22, Math.max(0.01, xp));
      op(noFit, P(t, mid('specific', 0.3), 0.3, linear) * (1 - P(t, mid('specific', 0.5), 0.3, linear)));
      // protein clicks in: fits
      const pIn = P(t, mid('specific', 0.4), 0.9, easeOut), click = mid('specific', 0.4) + 0.9;
      const ptx = lerp(1250, SPX, pIn), pty = lerp(160, NY, pIn);
      tr(sProt, ptx, pty); op(sProt, P(t, mid('specific', 0.38), 0.3, linear));
      attr(prL, 'x', ptx + 124 + 52); attr(prL, 'y', pty - 108 + 10); op(prL, P(t, mid('specific', 0.44), 0.4, linear));
      flashAt(sFlash, t, click, SPX, NY);
      const sq = Math.sin(Math.PI * clamp((t - click) / 0.3));
      sEnz.setAttribute('transform', `translate(${SPX} ${SPY}) scale(${(1 + 0.05 * sq).toFixed(3)} ${(1 - 0.05 * sq).toFixed(3)})`);
      const tk = P(t, click + 0.1, 0.4, pop); op(sTick, clamp(tk * 2)); tr(sTick, SPX + 150, NY + 22, Math.max(0.01, tk));
      op(fits, P(t, click + 0.1, 0.3, linear));
      op(sName, P(t, at('specific') + 0.2, 0.4, linear));
      // lock and key
      const lk = P(t, mid('specific', 0.62), 0.5, pop); op(lockG, clamp(lk * 2)); tr(lockG, 960, 360, Math.max(0.01, 0.8 + 0.2 * lk));
      const kin = P(t, mid('specific', 0.7), 0.6, easeOut), open_ = P(t, mid('specific', 0.86), 0.35, easeOut);
      keyG.setAttribute('transform', `translate(${lerp(66, 0, kin).toFixed(1)} 0)`);
      op(keyG, P(t, mid('specific', 0.68), 0.2, linear));
      shackle.setAttribute('transform', `translate(0 ${(-16 * open_).toFixed(1)})`);
      op(lockL, P(t, mid('specific', 0.82), 0.4, linear));
    }

    /* ----- E: lactose ----- */
    const aE = fadeIO(t, at('lactose') - 0.2, at('conditions') + 0.15);
    op(Eg, aE);
    if (aE > 0) {
      popIn(lcChip, t, at('lactose') - 0.1, 600, 160);
      const gp = P(t, at('lactose') - 0.05, 0.5, pop); op(glass, clamp(gp * 2)); tr(glass, 170, 470 + (1 - clamp(gp)) * 20);
      op(milkL, P(t, at('lactose') + 0.3, 0.4, linear));
      op(lacL, P(t, mid('lactose', 0.2), 0.4, linear));
      slots.forEach((s, k) => { const p = P(t, mid('lactose', 0.5 + k * 0.05), 0.4, linear); op(s, p); });
      op(slotL, P(t, mid('lactose', 0.6), 0.4, linear));
      let arrived = 0;
      pairs.forEach((q, k) => {
        const u = (t - q.t0) * 150 / LLEN;
        if (u <= 0) { op(q.g, 0); return; }
        if (u >= 1) arrived++;
        const [x, y] = along(LPATH, u);
        if (k === CUTK && t >= CUT_T) {
          const d = t - CUT_T;
          op(q.g, 1 - P(d, 0.6, 0.5, linear));
          tr(q.g, 680, LCY);
          tr(q.u0, -16 - d * 40, d * 50); tr(q.u1, 16 + d * 30, d * 60);
          q.g.firstChild.style.opacity = 0;
        } else {
          q.g.firstChild.style.opacity = '';
          tr(q.u0, -16, 0); tr(q.u1, 16, 0);
          op(q.g, Math.min(1, u * 10) * (1 - P(u, 0.94, 0.06, linear)));
          tr(q.g, x, y + Math.sin(t * 3 + k) * 3 * calm, 1, Math.sin(t * 2 + k) * 8 * calm);
        }
      });
      flashAt(lacFlash, t, CUT_T, 680, LCY);
      const tp = P(t, mid('lactose', 0.06), 0.5, pop); op(tummy, clamp(tp * 2));
      const grum = clamp(arrived / 3) * P(t, mid('lactose', 0.7), 0.5, linear);
      tr(tummy, 1040 + Math.sin(t * 22) * 3 * grum * calm, 440, Math.max(0.01, 0.85 + 0.15 * tp));
      op(rumble, grum * (0.6 + 0.4 * wave(t, 0.5)));
      gas.forEach((g, k) => { const q = ((t * 0.5 + k / 3) % 1); attr(g, 'cx', -30 + k * 30); attr(g, 'cy', -70 - q * 70); op(g, grum * Math.sin(q * Math.PI)); });
      op(tumL, P(t, mid('lactose', 0.8), 0.4, linear));
    }

    /* ----- F: conditions (and the pH scale) ----- */
    const aF = fadeIO(t, at('conditions') - 0.2, at('bile') + 0.15);
    op(Fg, aF);
    const aPh = Math.max(aF * P(t, mid('conditions', 0.08), 0.4, linear), fadeIO(t, at('neutralise') - 0.2, at('washing') + 0.15));
    op(phG, aPh);
    if (aF > 0) {
      const lp = P(t, at('conditions') - 0.1, 0.5, pop), rp = P(t, mid('conditions', 0.08), 0.5, pop);
      op(fL, clamp(lp * 2)); op(fR, clamp(rp * 2));
      fBub.upd(t, P(t, mid('conditions', 0.3), 0.5, linear));
      const pp = P(t, mid('conditions', 0.3), 0.5, pop); op(fPro, clamp(pp * 2)); tr(fPro, 296 + Math.sin(t * 2.4) * 8 * calm, 352 + Math.cos(t * 1.9) * 5 * calm, Math.max(0.01, pp));
      popIn(acidChip, t, mid('conditions', 0.48), 310, 482);
      const ap = P(t, mid('conditions', 0.62), 0.5, pop);
      op(fAmy, clamp(ap * 2)); op(fLip, clamp(ap * 2));
      tr(fAmy, 820 + Math.sin(t * 2.2) * 6 * calm, 300, Math.max(0.01, ap)); tr(fLip, 975 + Math.sin(t * 2 + 1) * 6 * calm, 360, Math.max(0.01, ap));
      popIn(alkChip, t, mid('conditions', 0.83), 890, 482);
      const pa = P(t, mid('conditions', 0.5), 0.5, pop), pb = P(t, mid('conditions', 0.85), 0.5, pop);
      op(pinA, clamp(pa * 2)); tr(pinA, PHX(2), 590 - (1 - clamp(pa)) * 20);
      op(pinB, clamp(pb * 2)); tr(pinB, PHX(8), 590 - (1 - clamp(pb)) * 20);
    }

    /* ----- G: bile ----- */
    const aG = fadeIO(t, at('bile') - 0.2, at('emulsify') + 0.15);
    op(Gg, aG);
    if (aG > 0) {
      const lv = P(t, at('bile') - 0.1, 0.5, pop); op(liver, clamp(lv * 2));
      lvL.set(P(t, mid('bile', 0.18), 0.4, linear)); gbL.set(P(t, mid('bile', 0.36), 0.4, linear));
      const fill = P(t, mid('bile', 0.3), 1.6, ease) * (1 - 0.45 * P(t, mid('bile', 0.8), 1.2, linear));
      attr(gbLevel, 'y', GBY + 56 - 104 * fill); attr(gbLevel, 'height', 104 * fill + 2);
      bDrops.forEach((d, k) => {
        // made in the liver, flowing to the gall bladder; later released down the duct
        const u = (t - mid('bile', 0.16) - k * 0.14) / 1.0;
        const v = (t - mid('bile', 0.8) - k * 0.1) / 0.9;
        if (v > 0 && v < 1 && k < 8) { const [x, y] = along([[436, 462], [446, 510], [474, 548], [500, 582], [560, 612]], v); tr(d, x, y); op(d, Math.min(1, v * 6, (1 - v) * 5)); }
        else if (u > 0 && u < 1) { const [x, y] = along([[300 + (k % 4) * 30 - 40, 250 + (k % 3) * 20], [410, 312], [430, 352], [432, 380]], u); tr(d, x, y); op(d, Math.min(1, u * 6, (1 - u) * 5)); }
        else op(d, 0);
      });
      const ne = P(t, mid('bile', 0.56), 0.5, pop); op(notE, clamp(ne * 2)); tr(notE, 895, 528 + (1 - clamp(ne)) * 12);
      jobChips.forEach((c, k) => { const p = P(t, mid('bile', 0.82 + k * 0.08), 0.45, pop); op(c, clamp(p * 2)); tr(c, (k - 0.5) * 170, (1 - clamp(p)) * 12, Math.max(0.01, 0.85 + 0.15 * p)); });
    }

    /* ----- H: emulsify (showpiece) ----- */
    const aH = fadeIO(t, at('emulsify') - 0.2, at('neutralise') + 0.15);
    op(Hg, aH); op(hd1, aH);
    if (aH > 0) {
      const shatter = mid('emulsify', 0.27);
      const gp = P(t, at('emulsify') - 0.1, 0.5, pop);
      const wob = P(t, mid('emulsify', 0.18), 0.4, linear);
      const gr = 1 + 0.06 * Math.sin(t * 30) * wob * calm;
      globule.setAttribute('transform', `translate(${GX} ${GY}) scale(${(Math.max(0.01, gp) * gr).toFixed(3)} ${(Math.max(0.01, gp) / gr).toFixed(3)})`);
      op(globule, t < shatter ? clamp(gp * 2) : 0);
      bileIn.forEach((b, k) => {
        const u = P(t, mid('emulsify', 0.05) + k * 0.06, 0.7, easeIn);
        const tx = GX + Math.cos(b.a) * 120, ty = GY + Math.sin(b.a) * 120;
        if (t >= shatter) { op(b.el, 0); return; }
        op(b.el, Math.min(1, u * 5)); tr(b.el, lerp(b.x0, tx, u), lerp(b.y0, ty, u));
      });
      drops.forEach(d => {
        if (t < shatter) { op(d.el, 0); return; }
        const [x, y, p] = dropPos(d, t, shatter);
        const eaten = P(t, mid('emulsify', 0.9) + d.d * 1.6, 1.4, linear);      // lipase digests them during the pause
        op(d.el, 1 - 0.85 * eaten);
        tr(d.el, x, y, Math.max(0.01, (0.6 + 0.4 * p) * (1 - 0.5 * eaten)));
        attr(d.el, 'stroke-width', 3 * p);
      });
      const mIn = P(t, mid('emulsify', 0.58), 0.4, linear);
      op(saM, mIn); saM.set(lerp(0.18, 0.88, P(t, mid('emulsify', 0.66), 0.8, easeOut)));
      popIn(emChip, t, mid('emulsify', 0.36), 520, 660);
      op(emChip, P(t, mid('emulsify', 0.36), 0.3, linear) * (1 - P(t, mid('emulsify', 0.82), 0.3, linear)));
      lips.forEach((l, k) => {
        const d = drops[l.target], p = P(t, mid('emulsify', 0.82) + k * 0.07, 0.9, easeOut);
        if (p <= 0) { op(l.e, 0); return; }
        const [dx_, dy_] = dropPos(d, t, shatter), tx = dx_ + l.side * (d.r + 16), ty = dy_;
        op(l.e, clamp(p * 3));
        tr(l.e, lerp(l.from[0], tx, p), lerp(l.from[1], ty, p) + Math.sin(t * 5 + k) * 2 * calm, 1, l.side * -90);
      });
      popIn(lfChip, t, mid('emulsify', 0.86), 520, 660);
    }

    /* ----- I: neutralise ----- */
    const aI = fadeIO(t, at('neutralise') - 0.2, at('washing') + 0.15);
    op(Ig, aI); op(hd2, aI);
    if (aI > 0) {
      const acid = P(t, at('neutralise'), 1.6, ease);
      attr(acidR, 'width', 1120 * acid);
      const bl = P(t, mid('neutralise', 0.1), 0.5, linear);
      nDrops.forEach((d, k) => { const q = ((t - mid('neutralise', 0.1)) / 0.9 + k / 6) % 1; tr(d, 440 + Math.sin(k * 2) * 4, 130 + q * 190); op(d, bl * Math.min(1, q * 8, (1 - q) * 5) * (t > mid('neutralise', 0.1) ? 1 : 0)); });
      const nt = P(t, mid('neutralise', 0.3), 2.2, ease);
      attr(neutR, 'width', 720 * nt);
      acidBub.upd(t, aI * (1 - 0.7 * nt));
      op(nAcidL, P(t, at('neutralise') + 0.1, 0.4, linear)); op(nBileL, P(t, mid('neutralise', 0.08), 0.4, linear));
      const perk = P(t, mid('neutralise', 0.6), 0.8, easeOut);
      nEnz.forEach((o, k) => {
        const bounce = perk * Math.abs(Math.sin(t * 3.2 + k * 1.3)) * 10 * calm;
        tr(o.e, o.x, TUY + o.y + 18 * (1 - perk) - bounce, 0.85 + 0.15 * perk, (1 - perk) * (k % 2 ? 22 : -22));
        o.e.style.opacity = (0.35 + 0.65 * perk).toFixed(3);
      });
      op(happyL, P(t, mid('neutralise', 0.76), 0.4, linear));
      // the pH pin slides from acid to slightly alkaline
      const sl = P(t, mid('neutralise', 0.3), 2.0, ease);
      const px = lerp(PHX(2), PHX(8), sl);
      op(pinN, 1); tr(pinN, px, 590);
      tr(pinChip, px, 532); op(pinChip, 1 - clamp((sl - 0.45) / 0.15));
      tr(pinChip2, px, 532); op(pinChip2, clamp((sl - 0.45) / 0.15));
    } else op(pinN, 0);
    if (aF <= 0) { op(pinA, 0); op(pinB, 0); }

    /* ----- J: washing ----- */
    const aJ = P(t, at('washing') - 0.2, 0.4, linear);
    op(Jg, aJ);
    if (aJ > 0) {
      const sw = 12 * Math.sin(t * 0.9) * calm, a = sw * Math.PI / 180;
      shirt.setAttribute('transform', `translate(${MX} ${MY + 14}) rotate(${sw.toFixed(2)})`);
      const rot = p => [MX + p[0] * Math.cos(a) - p[1] * Math.sin(a), MY + 14 + p[0] * Math.sin(a) + p[1] * Math.cos(a)];
      tr(blood, STB[0], STB[1]); tr(grease, STG[0], STG[1]);
      const clean = P(t, mid('washing', 0.55), 2.2, linear);
      op(blood, 0.95 * (1 - P(clean, 0, 1, linear))); tr(blood, STB[0], STB[1], Math.max(0.01, 1 - 0.7 * clean));
      op(grease, 0.9 * (1 - P(clean, 0.1, 0.9, linear))); tr(grease, STG[0], STG[1], Math.max(0.01, 1 - 0.7 * P(clean, 0.1, 0.9, linear)));
      popIn(wChip, t, at('washing') - 0.05, 912, 160);
      const el = P(t, mid('washing', 0.3), 0.5, linear); op(wEnzL, el); tr(wEnzL, 900, 260);
      wEnz.forEach(o => {
        const p = P(t, mid('washing', 0.3) + o.i * 0.1, 0.9, easeOut);
        const st = o.k === 'pro' ? STB : STG, tgt = rot([st[0] + o.s * 30, st[1] + 4]);
        const x = lerp(MX + (o.i - 1.5) * 60, tgt[0], p), y = lerp(MY + 150, tgt[1], p) + Math.sin(t * 6 + o.i) * 3 * calm;
        tr(o.e, x, y, 1, o.s * -90 + sw); op(o.e, clamp(p * 3));
      });
      const bp = rot(STB), gp = rot(STG);
      op(bLbl, P(t, mid('washing', 0.5), 0.4, linear)); attr(bLine, 'x1', 752); attr(bLine, 'y1', 391); attr(bLine, 'x2', bp[0]); attr(bLine, 'y2', bp[1]); attr(bDot, 'cx', bp[0]); attr(bDot, 'cy', bp[1]);
      op(gLbl, P(t, mid('washing', 0.62), 0.4, linear)); attr(gLine, 'x1', 752); attr(gLine, 'y1', 491); attr(gLine, 'x2', gp[0]); attr(gLine, 'y2', gp[1]); attr(gDot, 'cx', gp[0]); attr(gDot, 'cy', gp[1]);
      attr(dialP, 'transform', `rotate(${lerp(40, -60, P(t, mid('washing', 0.84), 0.6, ease)).toFixed(1)})`);
      popIn(coolChip, t, mid('washing', 0.84), 930, 610);
    }
  };
});
