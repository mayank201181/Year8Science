/* Chapter 2: Inside the atom: particles and shells.
   One big sodium atom centre-left (in a camera that can zoom into its nucleus), a number panel on the right.
   Beats: sodium's tile -> fly inside: a tiny nucleus -> protons and neutrons -> their charges; electrons
   orbit in shells -> count the protons (atomic number) -> count on to 23 (mass number); an electron barely
   moves a scale -> the + and - charges cancel -> sodium's numbers -> 23 - 11 = 12 neutrons pop in
   -> isotopes: carbon-12 and carbon-14 -> same place, same electrons -> shells hold 2, 8, 8 -> the bus
   -> sodium's 11 electrons fill 2, 8, 1 (showpiece) -> the lonely outer electron. */
scene('atom', S => {
  const { at, end, mid } = S, root = S.root;
  const ORB = S.reduce ? 3 : 22;                 // first-shell orbit, degrees per second
  const RED = '#FF9A8F', GREY = '#C9D3DC';

  /* ---------- local helpers ---------- */
  function rich(parent, x, y, segs, o) {
    o = o || {};
    const t = E('text', { x, y, 'font-size': o.size || 30, 'font-weight': o.weight || 600, 'font-family': o.font || FD, 'text-anchor': o.anchor || 'start', fill: o.fill || C.ink }, parent);
    segs.forEach(s => { if (typeof s === 'string') s = [s]; E('tspan', { fill: s[1], 'font-weight': s[2] }, t).textContent = s[0]; });
    return t;
  }
  /* the nucleus balls of a shellAtom, read from its drawing, in the order set({ p, n }) pops them */
  function nucInfo(a) {
    const kids = Array.from(a.childNodes[1].childNodes), ps = [], ns = [];
    kids.forEach(b => {
      const m = /translate\(([-\d.]+)[ ,]+([-\d.]+)\)/.exec(b.getAttribute('transform') || '');
      const isP = (b.firstChild.getAttribute('fill') || '').indexOf(C.oxygen.slice(1)) >= 0;
      (isP ? ps : ns).push({ x: m ? +m[1] : 0, y: m ? +m[2] : 0 });
    });
    ps.reverse(); ns.reverse();
    return { p: ps, n: ns, r: kids.length ? +kids[0].firstChild.getAttribute('r') : 9 };
  }
  const clock = b => (Math.atan2(b.x, -b.y) + TAU) % TAU;      // 0 at twelve o'clock, then clockwise
  const byAngle = arr => arr.slice().sort((a, b) => clock(a) - clock(b));
  const rotXY = (x, y, deg) => { const a = deg * Math.PI / 180, c = Math.cos(a), s = Math.sin(a); return [x * c - y * s, x * s + y * c]; };
  /* proton (red, +), neutron (grey) or electron (blue, -) */
  function particle(parent, kind, r) {
    const g = G(parent), col = { p: [C.oxygen, C.oxygenDk], n: [C.carbon, C.carbonDk], e: [C.water, C.waterDk] }[kind];
    E('circle', { r, fill: ball(col[0], col[1]), stroke: col[1], 'stroke-width': 2 }, g);
    if (kind !== 'n') g.sign = T(g, 0, r * 0.45, kind === 'p' ? '+' : '−', { size: r * 1.45, weight: 800, anchor: 'middle', fill: kind === 'p' ? '#FFFFFF' : C.bg0 });
    return g;
  }
  /* two-line label ("title" / "sub") ending at x, with a leader to (tx, ty) */
  function label2(parent, x, y, tx, ty, title, sub, col) {
    const g = G(parent);
    E('line', { x1: x + 12, y1: y - 11, x2: tx, y2: ty, stroke: col, 'stroke-width': 3, 'stroke-linecap': 'round' }, g);
    E('circle', { cx: tx, cy: ty, r: 5, fill: col }, g);
    T(g, x, y, title, { size: 32, weight: 700, anchor: 'end', fill: col });
    T(g, x, y + 35, sub, { size: 27, weight: 600, anchor: 'end' });
    return g;
  }
  /* top-down cartoon bus, about 500 x 180, windscreen on the left: seats in blocks of 2, 8 and 8.
     g.seats[k] (fill order) has .pass (an electron passenger) and .yel (its yellow highlight) */
  function busArt(parent) {
    const g = G(parent);
    for (const x of [-150, 150]) for (const s of [-1, 1]) E('rect', { x: x - 34, y: s * 96 - 13, width: 68, height: 26, rx: 10, fill: '#33444F', stroke: '#8EA3B0', 'stroke-width': 2.5 }, g);
    for (const s of [-1, 1]) E('rect', { x: -236, y: s * 104 - 7, width: 26, height: 14, rx: 6, fill: '#33444F', stroke: '#8EA3B0', 'stroke-width': 2 }, g);   // wing mirrors
    E('rect', { x: -252, y: -92, width: 504, height: 184, rx: 38, fill: '#E2553F', stroke: '#FFAA94', 'stroke-width': 4 }, g);
    for (let k = 0; k < 3; k++) E('line', { x1: 240, y1: -30 + k * 30, x2: 248, y2: -30 + k * 30, stroke: '#A8331F', 'stroke-width': 4, 'stroke-linecap': 'round' }, g);   // engine grille
    E('rect', { x: -230, y: -72, width: 462, height: 144, rx: 24, fill: '#EBDDC3' }, g);
    E('path', { d: 'M-241,-58 Q-250,0 -241,58', fill: 'none', stroke: '#9FD8FF', 'stroke-width': 9, 'stroke-linecap': 'round' }, g);
    for (const s of [-1, 1]) E('circle', { cx: -244, cy: s * 72, r: 8, fill: C.energy }, g);
    E('circle', { cx: -206, cy: -40, r: 13, fill: 'none', stroke: '#6B5A48', 'stroke-width': 4 }, g);
    E('line', { x1: -172, y1: 0, x2: 224, y2: 0, stroke: '#CDB99A', 'stroke-width': 3, 'stroke-dasharray': '9 7' }, g);
    const blocks = [[-166, 44], [-104, 158], [72, 158]].map(([x, w]) => { const b = E('rect', { x, y: -64, width: w, height: 128, rx: 14, fill: C.energy }, g); op(b, 0); return b; });
    const seats = [];
    [[-144], [-82, -44, -6, 32], [94, 132, 170, 208]].forEach(xs => xs.forEach(x => [-38, 38].forEach(y => {
      const sg = G(g); tr(sg, x, y);
      E('rect', { x: -15, y: -15, width: 30, height: 30, rx: 7, fill: '#7A93A3', stroke: '#506A7A', 'stroke-width': 2 }, sg);
      E('rect', { x: 9, y: -16, width: 8, height: 32, rx: 3.5, fill: '#506A7A' }, sg);
      const pass = G(g); tr(pass, x - 2, y);
      E('circle', { r: 12, fill: ball(C.water, C.waterDk), stroke: C.waterDk, 'stroke-width': 1.5 }, pass);
      const yel = E('circle', { r: 12, fill: ball(C.energy, '#C9A800'), stroke: '#C9A800', 'stroke-width': 1.5 }, pass);
      op(pass, 0); op(yel, 0);
      seats.push({ pass, yel });
    })));
    g.seats = seats; g.blocks = blocks; g.blockX = [-144, -25, 151];
    return g;
  }
  /* piecewise-linear value through [[t, v], ...] */
  function keyed(t, keys) {
    if (t <= keys[0][0]) return keys[0][1];
    for (let i = 1; i < keys.length; i++) if (t <= keys[i][0]) { const [t0, v0] = keys[i - 1], [t1, v1] = keys[i]; return lerp(v0, v1, (t - t0) / (t1 - t0)); }
    return keys[keys.length - 1][1];
  }

  /* ================= A. sodium, in a camera that can zoom into the nucleus ================= */
  const AX = 380, AY = 420, ZN = 2.5;
  const tileZ = ptTile(root, 11, { size: 240 }); tr(tileZ, AX, AY);
  const cam = G(root); tr(cam, AX, AY);
  const nucGlow = E('circle', { r: 105, fill: glow(C.energy) }, cam); op(nucGlow, 0);
  const na = shellAtom(cam, { z: 11, radii: [80, 135, 190], er: 11, signs: true });
  const naE = na.childNodes[2], RAD = na.radii, NI = nucInfo(na), NR = NI.r;
  const under = G(na); na.insertBefore(under, naE);         // over the nucleus, under the electrons
  const hiRings = [0, 1, 2].map(k => { const c = E('circle', { r: RAD[k], fill: 'none', stroke: C.energy, 'stroke-width': 7 }, under); op(c, 0); return c; });
  const ringChips = [2, 8, 8].map(n => {
    const g = G(under);
    E('circle', { r: 19, fill: C.card2, stroke: C.energy, 'stroke-width': 3 }, g);
    T(g, 0, 9, String(n), { size: 26, weight: 700, anchor: 'middle', fill: C.energy });
    op(g, 0); return g;
  });
  const ghosts = NI.n.map(b => { const c = E('circle', { cx: b.x, cy: b.y, r: NR - 0.8, fill: 'none', stroke: GREY, 'stroke-width': 1.5, 'stroke-dasharray': '3 2.4' }, under); op(c, 0); return c; });
  const popRings = NI.n.map(b => { const c = E('circle', { cx: b.x, cy: b.y, r: NR, fill: 'none', stroke: C.energy, 'stroke-width': 2.2 }, under); op(c, 0); return c; });
  const numLabel = (b, txt, fill) => { const g = G(under); tr(g, b.x, b.y); T(g, 0, NR * 0.4, txt, { size: NR * 1.15, weight: 800, anchor: 'middle', fill }); op(g, 0); return { g, b }; };
  const pNums = byAngle(NI.p).map((b, k) => numLabel(b, String(k + 1), '#FFFFFF'));
  const nNums = byAngle(NI.n).map((b, k) => numLabel(b, String(12 + k), C.bg0));
  const tinyLab = labelLine(root, 640, 300, AX + 44, AY - 40, 'a tiny nucleus', { size: 34, fill: C.energy, line: C.energy });
  const nucTitle = T(root, AX, 246, 'the nucleus', { size: 36, weight: 700, anchor: 'middle', fill: C.energy }); op(nucTitle, 0);
  const shellLab = labelLine(root, 566, 684, AX + 134, AY + 134, 'shells', { size: 32, anchor: 'start' });
  op(tinyLab, 0); op(shellLab, 0);

  /* legend: proton, neutron, electron */
  const leg = G(root), LX = 734;
  const legRows = [
    { kind: 'p', y: 290, name: 'proton', note: [['positive', RED, 800], ' charge (+)'] },
    { kind: 'n', y: 418, name: 'neutron', note: [['no', GREY, 800], ' charge'] },
    { kind: 'e', y: 546, name: 'electron', note: [['negative', C.water, 800], ' (−), very light'] },
  ].map(r => {
    const g = G(leg);
    const ic = particle(g, r.kind, r.kind === 'e' ? 15 : 24); tr(ic, LX, r.y);
    T(g, LX + 46, r.y + 13, r.name, { size: 40, weight: 700 });
    const note = rich(g, LX + 46, r.y + 54, r.note, { size: 28, fill: C.muted });
    return { g, ic, note };
  });
  const pick = (arr, up) => arr.filter(b => (up ? b.y < 0 : b.y > 0)).sort((a, b) => b.x - a.x)[0] || arr[0];
  const leads = [[pick(NI.p, true), RED, 290], [pick(NI.n, false), GREY, 418]].map(([b, col, y]) => ({
    b, y, ln: E('line', { stroke: col, 'stroke-width': 3, 'stroke-linecap': 'round' }, leg), dot: E('circle', { r: 5, fill: col }, leg),
  }));

  /* number panel: sodium's tile with its two numbers explained */
  const TX = 1062, TY = 252;
  const panel = G(root);
  const tileP = ptTile(panel, 11, { size: 180 }); tr(tileP, TX, TY);
  const labMass = label2(panel, 944, 198, TX - 24, TY + tileP.at.mass[1], 'mass number', '= protons + neutrons', C.energy);
  const labNum = label2(panel, 944, 322, TX - 22, TY + tileP.at.num[1], 'atomic number', '= number of protons', C.energy);
  const chipA = rich(root, 880, 478, [['11 protons', RED, 800], ' → always ', ['sodium', C.ink, 800]], { size: 32, anchor: 'middle', fill: C.muted });
  const chipM = rich(root, 880, 482, [['11', RED, 800], ' + ', ['12', GREY, 800], ' = ', ['23', C.energy, 800]], { size: 52, anchor: 'middle', fill: C.muted });
  op(chipA, 0); op(chipM, 0);
  // a kitchen scale: an electron barely moves the needle
  const scaleG = G(root); tr(scaleG, 752, 610);
  E('rect', { x: -10, y: -6, width: 20, height: 12, fill: '#6D8C9C' }, scaleG);
  E('rect', { x: -84, y: -18, width: 168, height: 12, rx: 6, fill: '#A9BFCC' }, scaleG);
  E('rect', { x: -74, y: 4, width: 148, height: 60, rx: 14, fill: '#2C4A59', stroke: '#6D8C9C', 'stroke-width': 3 }, scaleG);
  E('circle', { cx: 0, cy: 34, r: 22, fill: '#E9F2F7', stroke: '#8FB0C2', 'stroke-width': 2 }, scaleG);
  for (let k = -2; k <= 2; k++) { const a = (-90 + k * 32) * Math.PI / 180; E('line', { x1: Math.cos(a) * 15, y1: 34 + Math.sin(a) * 15, x2: Math.cos(a) * 20, y2: 34 + Math.sin(a) * 20, stroke: '#57636F', 'stroke-width': 2 }, scaleG); }
  const needle = E('line', { x1: 0, y1: 34, x2: 0, y2: 17, stroke: C.bad, 'stroke-width': 3, 'stroke-linecap': 'round' }, scaleG);
  E('circle', { cx: 0, cy: 34, r: 3, fill: C.bad }, scaleG);
  const scaleE = particle(scaleG, 'e', 13);
  const scaleTxt = G(root);
  T(scaleTxt, 856, 604, 'an electron:', { size: 30, weight: 700, fill: C.water });
  T(scaleTxt, 856, 642, 'almost no mass', { size: 30, weight: 600 });

  /* the charges cancel: 11 + and 11 -, and a running total */
  const neu = G(root);
  const NX0 = 712, NDX = 33, NYP = 432, NYE = 512, NYM = 472;
  const pD = [], eD = [], flashes = [];
  for (let k = 0; k < 11; k++) { flashes.push(E('circle', { r: 26, fill: glow('#FFFFFF') }, neu)); pD.push(particle(neu, 'p', 14)); eD.push(particle(neu, 'e', 14)); }
  flashes.forEach(f => op(f, 0));
  const noCharge = rich(neu, 880, 486, ['no ', ['overall', C.ink, 800], ' charge'], { size: 36, anchor: 'middle', fill: C.muted });
  const met = G(neu);
  T(met, 712, 648, 'total charge', { size: 28, weight: 600, anchor: 'end', fill: C.muted });
  E('line', { x1: 740, y1: 640, x2: 1040, y2: 640, stroke: C.line, 'stroke-width': 8, 'stroke-linecap': 'round' }, met);
  [[740, '−'], [890, '0'], [1040, '+']].forEach(([x, s]) => { E('line', { x1: x, y1: 628, x2: x, y2: 652, stroke: C.muted, 'stroke-width': 3 }, met); T(met, x, 686, s, { size: 30, weight: 700, anchor: 'middle', fill: C.muted }); });
  const ptr = G(met);
  E('path', { d: 'M0,-6 L-10,-22 L10,-22 Z', fill: C.energy }, ptr);
  const ptrTxt = T(ptr, 0, -32, '0', { size: 30, weight: 800, anchor: 'middle', fill: C.energy });

  /* sodium, worked out from its tile */
  const sod = G(root);
  const RY = [452, 520, 588];
  const nBar = E('rect', { x: 686, y: RY[2] - 40, width: 470, height: 56, rx: 28, fill: C.card2, stroke: C.energy, 'stroke-width': 2.5 }, sod);
  op(nBar, 0);
  const sodRows = [['p', 'protons'], ['e', 'electrons'], ['n', 'neutrons']].map(([k, name], i) => {
    const g = G(sod);
    const ic = particle(g, k, 15); tr(ic, 712, RY[i] - 11);
    T(g, 740, RY[i], name, { size: 32, weight: 600 });
    return g;
  });
  const val = (txt, i, col, x) => { const g = G(sod); tr(g, x || 930, RY[i]); T(g, 0, 0, txt, { size: 40, weight: 800, fill: col }); op(g, 0); return g; };
  const vP = val('11', 0, RED), vE = val('11', 1, C.water), vQ = val('?', 2, GREY);
  const toks = [];
  { let x = 930; [['23', C.energy], ['−', C.muted], ['11', RED], ['=', C.muted], ['12', GREY]].forEach(([s, col]) => { toks.push({ g: val(s, 2, col, x), x }); x += textWidth(s, 40, FD, 800) + 14; }); }

  /* ================= B. isotopes: carbon-12 and carbon-14 ================= */
  const iso = G(root);
  const isoTitle = T(iso, 600, 160, 'Isotopes', { size: 58, weight: 700, anchor: 'middle', fill: C.energy });
  const isoSub = rich(iso, 600, 212, ['same ', ['element', C.ink, 800], ', different numbers of ', ['neutrons', GREY, 800]], { size: 30, anchor: 'middle', fill: C.muted });
  const CXs = [330, 870], CY = 405;
  const cs = [12, 14].map((m, i) => {
    const g = G(iso); tr(g, CXs[i], CY);
    const halo = E('circle', { r: 86, fill: glow(C.oxygen) }, g); op(halo, 0);
    const a = shellAtom(g, { z: 6, mass: m, radii: [75, 125], er: 11, nr: 11, fit: false, seed: 4 + i * 3 });
    const name = T(iso, CXs[i], 590, 'carbon-' + m, { size: 40, weight: 700, anchor: 'middle' });
    const pTxt = rich(iso, CXs[i], 634, [['6', RED, 800], ' protons'], { size: 30, anchor: 'middle' });
    const nTxt = rich(iso, CXs[i], 674, [[String(m - 6), GREY, 800], ' neutrons'], { size: 30, anchor: 'middle' });
    const eTxt = rich(iso, CXs[i], 634, ['electrons ', ['2, 4', C.energy, 800]], { size: 30, anchor: 'middle' });
    return { g, a, halo, name, pTxt, nTxt, eTxt, info: nucInfo(a) };
  });
  const extraG = G(cs[1].a); cs[1].a.insertBefore(extraG, cs[1].a.childNodes[2]);
  const extraRings = cs[1].info.n.slice().sort((a, b) => Math.hypot(b.x, b.y) - Math.hypot(a.x, a.y)).slice(0, 2)
    .map(b => { const c = E('circle', { cx: b.x, cy: b.y, r: 14, fill: 'none', stroke: C.energy, 'stroke-width': 3.5 }, extraG); op(c, 0); return c; });
  const bothG = G(iso); tr(bothG, 600, CY);
  { const w = textWidth('both carbon', 30, FD, 700) + 86, c = chip(bothG, '', { size: 30, w, fill: C.card2, stroke: C.good });
    c.label.remove(); T(bothG, 18, 11, 'both carbon', { size: 30, weight: 700, anchor: 'middle' }); tr(tick(bothG, 11), -w / 2 + 30, 1); }
  // same place in the table, same electrons
  const cTile = ptTile(iso, 6, { size: 140 }); tr(cTile, 600, 192);
  const arL = arrow(iso, 420, 292, 516, 214, { color: C.muted, width: 5, bend: -26 });
  const arR = arrow(iso, 780, 292, 684, 214, { color: C.muted, width: 5, bend: 26 });
  const sameLab = G(iso);
  T(sameLab, 600, 322, 'same place', { size: 30, weight: 700, anchor: 'middle' });
  T(sameLab, 600, 358, 'in the table', { size: 30, weight: 600, anchor: 'middle', fill: C.muted });
  const ghost = G(iso);
  [75, 125].forEach(r => E('circle', { r, fill: 'none', stroke: C.energy, 'stroke-width': 3, 'stroke-dasharray': '10 8' }, ghost));
  const ghostE = []; for (let i = 0; i < 6; i++) ghostE.push(E('circle', { r: 13, fill: 'none', stroke: C.energy, 'stroke-width': 3, 'stroke-dasharray': '5 4' }, ghost));
  const matchTick = G(iso); tr(matchTick, CXs[1] + 150, CY - 140);
  tick(matchTick, 16);
  const chemChip = G(iso); tr(chemChip, 600, 696);
  { const c = chip(chemChip, '', { size: 30, w: 720, fill: C.card2, stroke: C.energy }); c.label.remove(); }
  rich(chemChip, 0, 11, ['chemistry depends on ', ['electrons', C.energy, 800], ', not neutrons'], { size: 30, anchor: 'middle' });

  /* ================= C. shells: 2, 8, 8, the bus, and sodium's 2, 8, 1 ================= */
  const shellPan = G(root);
  const BX = 905, BY = 440, BS = 0.92;
  const bus = busArt(shellPan);
  const BXS = bus.blockX.map(x => BX + x * BS);
  const shellHead = T(shellPan, BX, 222, 'each shell holds up to', { size: 30, weight: 600, anchor: 'middle', fill: C.muted });
  const digits = [2, 8, 8].map((n, k) => { const g = G(shellPan); tr(g, BXS[k], 306); T(g, 0, 0, String(n), { size: 60, weight: 700, anchor: 'middle', fill: C.energy }); return g; });
  const commas = [0, 1].map(k => T(shellPan, (BXS[k] + BXS[k + 1]) / 2, 306, ',', { size: 60, weight: 700, anchor: 'middle', fill: C.muted }));
  const conns = BXS.map(x => E('line', { x1: x, y1: 318, x2: x, y2: BY - 86 * BS, stroke: C.energy, 'stroke-width': 3, 'stroke-dasharray': '6 6' }, shellPan));
  const sodLab = T(shellPan, BX, 584, 'sodium', { size: 30, weight: 600, anchor: 'middle', fill: C.muted });
  const arrToks = (() => {
    const parts = ['2', ', 8', ', 1'], ws = parts.map(s => textWidth(s, 58, FD, 800)), tot = ws.reduce((a, b) => a + b, 0);
    let x = BX - tot / 2;
    return parts.map((s, i) => { const g = G(shellPan); tr(g, x, 642); T(g, 0, 0, s, { size: 58, weight: 800, fill: i === 2 ? C.energy : C.ink }); x += ws[i]; return g; });
  })();
  const arrPulse = G(shellPan);
  arrToks.forEach(g => arrPulse.appendChild(g));
  const msg = rich(shellPan, BX, 706, [['outer electrons', C.energy, 800], ' decide how it reacts'], { size: 30, anchor: 'middle' });
  // the lonely outer electron's label (follows it round)
  const outerG = G(root);
  const outerHalo = E('circle', { r: 42, fill: glow(C.energy) }, outerG);
  const outerLn = E('line', { stroke: C.energy, 'stroke-width': 3, 'stroke-linecap': 'round' }, outerG);
  T(outerG, 64, 168, 'outer electron', { size: 32, weight: 700, fill: C.energy });
  const outerTW = textWidth('outer electron', 32, FD, 700);

  /* ================= update ================= */
  return t => {
    const tz1 = mid('nucleus', 0.14), tTiny = mid('nucleus', 0.36), tz2 = mid('nucleus', 0.5);
    const tOut1 = mid('charges', 0.4), tIn2 = at('atomicno') - 0.15, tOut2 = at('neutral') - 0.2;
    const tIso = at('isotopes') - 0.25, tShell = at('shells') - 0.2;
    const KE = [[mid('build', 0.08), 0], [mid('build', 0.26), 2], [mid('build', 0.32), 2], [mid('build', 0.58), 10], [mid('build', 0.62), 10], [mid('build', 0.71), 11]];
    const e = t > tIso + 0.6 ? keyed(t, KE) : 11;
    const outerV = P(t, mid('outer', 0.04), 0.5, linear) * (0.8 + 0.2 * wave(t, 1.1));
    const busMap = [win(t, mid('bus', 0.28), mid('bus', 0.52), 0.2), win(t, mid('bus', 0.52), mid('bus', 0.76), 0.2), win(t, mid('bus', 0.76), at('build') + 0.3, 0.2)];
    const buildMap = [win(t, KE[0][0], KE[1][0] + 0.35, 0.25), win(t, KE[2][0], KE[3][0] + 0.35, 0.25), win(t, KE[4][0], KE[5][0] + 0.5, 0.25)];

    /* --- the tile, then the camera flies into it --- */
    const tp = P(t, at('nucleus'), 0.6, pop), fly = P(t, tz1, 1.3, easeIn);
    op(tileZ, clamp(tp * 2) * (1 - P(t, tz1 + 0.45, 0.7, linear)));
    tr(tileZ, AX, AY, Math.max(0.01, (0.7 + 0.3 * tp) * (1 + 3.6 * fly)));

    /* --- camera --- */
    let Z = lerp(0.28, 1, P(t, tz1, 1.4, easeOut));
    Z = lerp(Z, ZN, P(t, tz2, 1.0));
    Z = lerp(Z, 1, P(t, tOut1, 1.2));
    Z = lerp(Z, ZN, P(t, tIn2, 1.0));
    Z = lerp(Z, 1, P(t, tOut2, 1.0));
    Z = lerp(Z, 1.3, P(t, mid('subtract', 0.42), 0.8));       // lean in as the neutrons pop back
    Z = lerp(Z, 1, P(t, tIso + 0.5, 0.3, linear));             // (hidden by then)
    const zf = clamp((ZN - Z) / (ZN - 1.4)), zf2 = zf * zf;     // rings and electrons fade as we zoom in
    const camA = t < tShell ? Math.min(P(t, tz1 + 0.3, 0.6, linear), 1 - P(t, tIso, 0.45, linear)) : P(t, tShell, 0.5, linear);
    op(cam, camA);
    if (camA > 0) {
      tr(cam, AX, AY, Z);
      const nOut = P(t, tOut2 + 0.3, 0.5, linear), popT0 = mid('subtract', 0.55), popD = 1.3, nIn = P(t, popT0, popD, linear);
      const ch = t < tOut2 ? P(t, at('charges') + 0.15, 0.5, linear) * (1 - P(t, tIn2, 0.4, linear)) : P(t, tOut2 + 0.4, 0.5, linear);
      const ringsOp = Math.max(0.5 * P(t, tz1 + 0.3, 0.6, linear), P(t, tOut1 + 0.3, 0.8, linear)) * zf2;
      na.set({ e, n: 12 * (1 - nOut + nIn), charges: ch, rings: ringsOp, outer: outerV, t, orbit: ORB });
      op(naE, P(t, tOut1 + 0.8, 0.7, linear) * zf2);
      const g1 = win(t, tTiny - 0.1, tz2 + 0.4, 0.35), g2 = win(t, mid('sodium', 0.66), mid('sodium', 0.66) + 1.6, 0.35);
      op(nucGlow, Math.max(g1, g2) * (0.65 + 0.35 * wave(t, 1.2)));
      // shell highlights: inside-out sweep, the bus mapping, the shell being filled, sodium's electrons
      const sodE = win(t, mid('sodium', 0.84), mid('sodium', 0.84) + 1.6, 0.3);
      hiRings.forEach((c, k) => {
        const v = Math.max(win(t, mid('shells', 0.06 + k * 0.08), mid('shells', 0.06 + k * 0.08) + 0.8, 0.25), busMap[k], buildMap[k] * 0.8);
        op(c, Math.max(v, sodE * 0.4));
        attr(c, 'stroke-width', v > 0.01 ? 7 : 18);
      });
      [0.42, 0.64, 0.84].forEach((f, k) => {
        const p = P(t, mid('shells', f), 0.5, pop);
        op(ringChips[k], clamp(p * 2));
        tr(ringChips[k], RAD[k] * 0.7071, -RAD[k] * 0.7071, Math.max(0.01, (0.6 + 0.4 * p) * (1 + 0.18 * Math.max(busMap[k], buildMap[k]))));
      });
      // neutrons: dashed ghosts while unknown, then they pop back in
      ghosts.forEach((c, k) => op(c, nOut * (1 - clamp(12 * nIn - k)) * 0.9));
      popRings.forEach((c, k) => { const u = (t - (popT0 + popD * k / 12)) / 0.55; if (u <= 0 || u >= 1) op(c, 0); else { op(c, 1 - u); attr(c, 'r', NR * (1 + 1.3 * u)); } });
      // counting the protons, then on through the neutrons
      const tP0 = mid('atomicno', 0.3), tN0 = mid('massno', 0.14), lblOut = 1 - P(t, tOut2 - 0.1, 0.35, linear);
      pNums.forEach((o, k) => { const p = P(t, tP0 + k * 0.19, 0.35, pop); op(o.g, clamp(p * 2) * lblOut); if (p > 0) tr(o.g, o.b.x, o.b.y, 1.5 - 0.5 * p); });
      nNums.forEach((o, k) => { const p = P(t, tN0 + k * 0.16, 0.35, pop); op(o.g, clamp(p * 2) * lblOut); if (p > 0) tr(o.g, o.b.x, o.b.y, 1.5 - 0.5 * p); });
    }
    tinyLab.set(win(t, tTiny, tz2 + 0.15, 0.35));
    op(nucTitle, win(t, tz2 + 0.55, tOut1 + 0.2, 0.35));
    shellLab.set(win(t, mid('charges', 0.84), at('atomicno') - 0.3, 0.35));

    /* --- legend --- */
    const legA = Math.min(P(t, mid('nucleus', 0.6) - 0.1, 0.4, linear), 1 - P(t, at('atomicno') - 0.35, 0.4, linear));
    op(leg, legA);
    if (legA > 0) {
      const rowT = [mid('nucleus', 0.6), mid('nucleus', 0.68), mid('charges', 0.5)];
      const noteT = [mid('charges', 0.05), mid('charges', 0.24), mid('charges', 0.66)];
      legRows.forEach((r, i) => {
        const p = P(t, rowT[i], 0.5, pop); op(r.g, clamp(p * 2)); tr(r.g, (1 - clamp(p)) * 30, 0);
        op(r.note, P(t, noteT[i], 0.45, linear));
        if (r.ic.sign) op(r.ic.sign, i === 0 ? P(t, noteT[0], 0.4, linear) : 1);
      });
      leads.forEach((l, k) => {
        const a = P(t, rowT[k] + 0.25, 0.4, linear) * (1 - P(t, tOut1, 0.3, linear));
        op(l.ln, a); op(l.dot, a);
        if (a > 0) { const x2 = AX + l.b.x * Z, y2 = AY + l.b.y * Z; attr(l.ln, 'x1', LX - 30); attr(l.ln, 'y1', l.y); attr(l.ln, 'x2', x2); attr(l.ln, 'y2', y2); attr(l.dot, 'cx', x2); attr(l.dot, 'cy', y2); }
      });
    }

    /* --- number panel --- */
    const panA = Math.min(P(t, at('atomicno') - 0.1, 0.5, linear), 1 - P(t, tIso, 0.45, linear));
    op(panel, panA);
    if (panA > 0) {
      const hlNum = Math.max(win(t, mid('atomicno', 0.12), at('massno'), 0.3), win(t, mid('sodium', 0.26), end('sodium'), 0.3), win(t, mid('subtract', 0.43), end('subtract') + 0.3, 0.3));
      const hlMass = Math.max(win(t, mid('massno', 0.06), at('neutral') - 0.1, 0.3), win(t, mid('sodium', 0.48), end('sodium'), 0.3), win(t, mid('subtract', 0.27), mid('subtract', 0.45), 0.3));
      tileP.set({ hlNum, hlMass });
      const lp = P(t, mid('atomicno', 0.08), 0.5, pop); op(labNum, clamp(lp * 2)); tr(labNum, (1 - clamp(lp)) * 24, 0);
      const mp = P(t, mid('massno', 0.03), 0.5, pop); op(labMass, clamp(mp * 2)); tr(labMass, (1 - clamp(mp)) * 24, 0);
    }
    op(chipA, win(t, mid('atomicno', 0.6), at('massno') + 0.1, 0.35));
    op(chipM, win(t, mid('massno', 0.52), tOut2 + 0.2, 0.35));
    const scA = win(t, mid('massno', 0.56), tOut2 + 0.2, 0.35);
    op(scaleG, scA);
    if (scA > 0) {
      const tDrop = mid('massno', 0.6), d = P(t, tDrop, 0.45, easeIn), b = P(t, tDrop + 0.45, 0.9, linear);
      tr(scaleE, 0, lerp(-112, -31, d));
      attr(needle, 'transform', `rotate(${(b > 0 ? 1.5 + 4 * Math.sin(b * Math.PI * 3) * (1 - b) : 0).toFixed(2)} 0 34)`);
    }
    op(scaleTxt, win(t, mid('massno', 0.64), tOut2 + 0.2, 0.35));

    /* --- charges cancel --- */
    const nA = win(t, at('neutral') + 0.05, at('sodium') - 0.05, 0.4);
    op(neu, nA);
    if (nA > 0) {
      const tp0 = mid('neutral', 0.08), te0 = mid('neutral', 0.3), tc0 = mid('neutral', 0.52);
      let total = 0;
      for (let k = 0; k < 11; k++) {
        const pp = P(t, tp0 + k * 0.08, 0.35, pop), pe = P(t, te0 + k * 0.08, 0.35, pop);
        const tk = tc0 + k * 0.11, c = P(t, tk, 0.32, easeIn), gone = P(t, tk + 0.3, 0.18, linear);
        const x = NX0 + k * NDX;
        op(pD[k], clamp(pp * 2) * (1 - gone)); tr(pD[k], x, lerp(NYP, NYM - 10, c), Math.max(0.01, pp));
        op(eD[k], clamp(pe * 2) * (1 - gone)); tr(eD[k], x, lerp(NYE, NYM + 10, c), Math.max(0.01, pe));
        const fu = (t - tk - 0.3) / 0.45;
        if (fu > 0 && fu < 1) { op(flashes[k], Math.sin(fu * Math.PI)); tr(flashes[k], x, NYM, 0.6 + 0.8 * fu); } else op(flashes[k], 0);
        total += P(t, tp0 + k * 0.08, 0.15, linear) - P(t, te0 + k * 0.08, 0.15, linear);   // each electron's − cancels a proton's +
      }
      op(noCharge, P(t, tc0 + 1.5, 0.5, linear));
      op(met, P(t, mid('neutral', 0.06), 0.4, linear));
      tr(ptr, 890 + total * 150 / 11, 640);
      setText(ptrTxt, total > 0.5 ? '+' + Math.round(total) : '0');
      const zero = P(t, tc0 + 1.5, 0.4, linear);
      ptrTxt.setAttribute('fill', zero > 0.5 ? C.good : C.energy);
    }

    /* --- sodium worked out --- */
    const sA = win(t, mid('sodium', 0.62), tIso, 0.4);
    op(sod, sA);
    if (sA > 0) {
      const rt = [mid('sodium', 0.68), mid('sodium', 0.84), mid('sodium', 0.95)];
      sodRows.forEach((g, i) => { const p = P(t, rt[i], 0.45, pop); op(g, clamp(p * 2)); tr(g, (1 - clamp(p)) * 24, 0); });
      const popV = (g, t0, x, y) => { const p = P(t, t0, 0.4, pop); op(g, clamp(p * 2)); tr(g, x, y, Math.max(0.01, 0.6 + 0.4 * p)); };
      popV(vP, rt[0] + 0.2, 930, RY[0]); popV(vE, rt[1] + 0.2, 930, RY[1]);
      const qp = P(t, rt[2] + 0.1, 0.4, pop);
      op(vQ, clamp(qp * 2) * (1 - P(t, mid('subtract', 0.25), 0.25, linear))); tr(vQ, 930, RY[2], Math.max(0.01, 0.6 + 0.4 * qp));
      op(nBar, win(t, at('subtract') - 0.1, tIso, 0.3));
      toks.forEach((o, i) => { const p = P(t, mid('subtract', [0.3, 0.38, 0.45, 0.53, 0.61][i]), 0.4, pop); op(o.g, clamp(p * 2)); tr(o.g, o.x, RY[2], Math.max(0.01, 0.6 + 0.4 * p)); });
    }

    /* --- isotopes --- */
    const iA = win(t, at('isotopes') - 0.1, tShell + 0.1, 0.45);
    op(iso, iA);
    if (iA > 0) {
      const tSame = at('same') - 0.15;
      op(isoTitle, P(t, at('isotopes'), 0.5, linear) * (1 - P(t, tSame, 0.4, linear)));
      op(isoSub, P(t, mid('isotopes', 0.42), 0.5, linear) * (1 - P(t, tSame, 0.4, linear)));
      const yel = P(t, mid('same', 0.58), 0.6, linear);
      cs.forEach((c, i) => {
        const p = P(t, mid('isotopes', 0.1 + i * 0.14), 0.6, pop);
        op(c.g, clamp(p * 2)); tr(c.g, CXs[i], CY + (1 - clamp(p)) * 30, Math.max(0.01, 0.7 + 0.3 * p));
        c.a.set({ t, orbit: ORB, outer: yel * (0.85 + 0.15 * wave(t, 1.1)) });
        op(c.halo, win(t, mid('carbon', 0.24), mid('carbon', 0.24) + 1.8, 0.35) * (0.7 + 0.3 * wave(t, 1.2)));
        op(c.name, P(t, mid('carbon', 0.02 + i * 0.12), 0.45, linear));
        op(c.pTxt, P(t, mid('carbon', 0.25), 0.45, linear) * (1 - P(t, tSame, 0.4, linear)));
        op(c.nTxt, P(t, mid('carbon', i ? 0.84 : 0.62), 0.45, linear) * (1 - P(t, tSame, 0.4, linear)));
        op(c.eTxt, P(t, mid('same', 0.5), 0.5, linear));
      });
      extraRings.forEach(r => op(r, P(t, mid('carbon', 0.86), 0.4, linear) * (1 - P(t, tSame, 0.4, linear)) * (0.6 + 0.4 * wave(t, 0.9))));
      const bp = P(t, mid('carbon', 0.42), 0.5, pop);
      op(bothG, clamp(bp * 2) * (1 - P(t, tSame, 0.35, linear))); tr(bothG, 600, CY, Math.max(0.01, 0.7 + 0.3 * bp));
      // same place in the table
      const tpop = P(t, mid('same', 0.03), 0.55, pop);
      op(cTile, clamp(tpop * 2)); tr(cTile, 600, 192, Math.max(0.01, 0.6 + 0.4 * tpop));
      arL.set(P(t, mid('same', 0.1), 0.6)); arR.set(P(t, mid('same', 0.13), 0.6));
      op(arL, P(t, mid('same', 0.1), 0.2, linear)); op(arR, P(t, mid('same', 0.13), 0.2, linear));
      op(sameLab, win(t, mid('same', 0.16), mid('same', 0.36), 0.3));
      // a dashed copy of carbon-12's electrons slides across and fits carbon-14's exactly
      const gT = mid('same', 0.37), gv = win(t, gT - 0.2, mid('same', 0.66), 0.3);
      op(ghost, gv);
      if (gv > 0) {
        tr(ghost, lerp(CXs[0], CXs[1], P(t, gT, 1.3)), CY);
        ghostE.forEach((c, i) => { const [x0, y0] = cs[0].a.slotXY(i, 6), [x, y] = rotXY(x0, y0, t * ORB / (i < 2 ? 1 : 2)); attr(c, 'cx', x); attr(c, 'cy', y); });
      }
      const mt = P(t, gT + 1.3, 0.45, pop); op(matchTick, clamp(mt * 2) * (1 - P(t, mid('same', 0.66), 0.3, linear))); tr(matchTick, CXs[1] + 150, CY - 140, Math.max(0.01, mt));
      const cp = P(t, mid('same', 0.64), 0.5, easeOut); op(chemChip, cp); tr(chemChip, 600, 696 + (1 - cp) * 16);
    }

    /* --- shells, the bus and 2, 8, 1 --- */
    const shA = P(t, tShell + 0.1, 0.5, linear);
    op(shellPan, shA);
    if (shA > 0) {
      op(shellHead, P(t, mid('shells', 0.3), 0.5, linear));
      [0.42, 0.64, 0.84].forEach((f, k) => {
        const p = P(t, mid('shells', f), 0.5, pop);
        op(digits[k], clamp(p * 2)); tr(digits[k], BXS[k], 306, Math.max(0.01, (0.6 + 0.4 * p) * (1 + 0.15 * Math.max(busMap[k], buildMap[k]))));
        if (k) op(commas[k - 1], P(t, mid('shells', f) - 0.1, 0.3, linear));
      });
      const drive = P(t, at('bus') - 0.15, 1.0, easeOut);
      op(bus, P(t, at('bus') - 0.15, 0.3, linear));
      tr(bus, BX + (1 - drive) * 460, BY + Math.sin(P(t, at('bus') + 0.75, 0.4, linear) * Math.PI) * -6, BS);
      conns.forEach((c, k) => op(c, P(t, at('bus') + 0.7 + k * 0.1, 0.35, linear) * 0.8));
      bus.blocks.forEach((b, k) => op(b, 0.45 * Math.max(busMap[k], buildMap[k])));
      bus.seats.forEach((s, k) => { op(s.pass, clamp((e - k - 0.75) / 0.25)); if (k === 10) op(s.yel, outerV); });
      op(sodLab, P(t, at('build'), 0.5, linear));
      [KE[1][0], KE[3][0], KE[5][0]].forEach((t0, i) => { const p = P(t, t0, 0.45, pop); op(arrToks[i], clamp(p * 2)); });
      const pulse = 1 + 0.12 * Math.sin(Math.PI * P(t, mid('build', 0.86), 0.7, linear));
      arrPulse.setAttribute('transform', `translate(${BX} 624) scale(${pulse.toFixed(3)}) translate(${-BX} -624)`);
      const mg = P(t, mid('outer', 0.45), 0.6, easeOut); op(msg, mg); tr(msg, 0, (1 - mg) * 14);
    }
    const oA = P(t, mid('outer', 0.1), 0.5, linear);
    op(outerG, oA);
    if (oA > 0) {
      const a = (-90 + t * ORB / 3) * Math.PI / 180, ex = AX + Math.cos(a) * RAD[2], ey = AY + Math.sin(a) * RAD[2];
      tr(outerHalo, ex, ey, 0.9 + 0.2 * wave(t, 1.1));
      attr(outerLn, 'x1', 64 + outerTW / 2); attr(outerLn, 'y1', 180); attr(outerLn, 'x2', ex); attr(outerLn, 'y2', ey);
    }
  };
});
