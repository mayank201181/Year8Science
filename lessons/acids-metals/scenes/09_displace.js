/* Chapter: Displacement and extraction.
   The mini ladder stays on the left throughout. An iron ball swoops in, knocks copper out of its
   partnership with a sulfate group and takes its place -> an iron nail hangs in blue copper
   sulfate; the ladder shows iron above copper -> iron + copper sulfate -> iron sulfate + copper
   -> time-lapse (showpiece): the blue fades to pale green and a rough copper coat grows on the
   nail -> copper in iron sulfate: nothing, never the other way round -> an ore rock, and a lens
   showing metal atoms joined to oxygen -> carbon heated with iron oxide takes the oxygen as carbon
   dioxide; a carbon rung slides into the ladder above iron -> aluminium oxide: carbon bounces off,
   so electrolysis pulls the aluminium out, expensively -> gold found pure: only gold atoms in the
   lens -> a can goes round the recycling loop, 100% vs 5% of the energy, sun and wind power. */
scene('displace', S => {
  const { at, end, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;

  /* ---------- helpers ---------- */
  const rgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const mix = (a, b, p) => { const A = rgb(a), B = rgb(b); p = clamp(p); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * p).toString(16).padStart(2, '0')).join(''); };
  function rich(parent, x, y, segs, o) {
    o = o || {};
    const t = E('text', { x, y, 'font-size': o.size || 30, 'font-weight': o.weight || 600, 'font-family': o.font || FD, 'text-anchor': o.anchor || 'start', fill: o.fill || C.ink }, parent);
    segs.forEach(s => { if (typeof s === 'string') s = [s]; E('tspan', { fill: s[1], 'font-weight': s[2] }, t).textContent = s[0]; });
    return t;
  }
  const fade = (t, t0, d) => P(t, t0, d === undefined ? 0.4 : d, linear);
  const outBy = (t, next) => 1 - P(t, at(next) - 0.48, 0.45, linear);   // gone just as the next line starts
  /* pop an element in at t0 around (x, y); k scales its opacity */
  const popAt = (el, t, t0, x, y, s0, k) => {
    s0 = s0 === undefined ? 0.8 : s0; const p = P(t, t0, 0.45, pop);
    op(el, clamp(p * 2) * (k === undefined ? 1 : k)); if (p > 0) tr(el, x, y, Math.max(0.01, s0 + (1 - s0) * p));
    return p;
  };
  const bez = (a, c, b, u) => { const v = 1 - u; return [v * v * a[0] + 2 * v * u * c[0] + u * u * b[0], v * v * a[1] + 2 * v * u * c[1] + u * u * b[1]]; };
  function glint(parent, r) {
    const g = G(parent);
    E('circle', { r: r * 1.7, fill: glow('#FFF4C2') }, g);
    E('path', { d: `M0,${-r} Q${r * 0.16},${-r * 0.16} ${r},0 Q${r * 0.16},${r * 0.16} 0,${r} Q${-r * 0.16},${r * 0.16} ${-r},0 Q${-r * 0.16},${-r * 0.16} 0,${-r} Z`, fill: '#FFFFFF' }, g);
    return g;
  }
  const INK_DARK = '#13232E', H_FILL = '#123544';
  const CUSO4 = '#1FA2D6', FESO4 = '#B8DDB0', CU = '#D9824B', FE = '#7A8590', AL = '#C7D0DA', AUC = '#F5C542';
  /* a shaded metal atom with its symbol */
  function metalBall(parent, sym, color, r) {
    const g = G(parent);
    E('circle', { r, fill: ball(color, mix(color, '#000000', 0.45)), stroke: mix(color, '#FFFFFF', 0.35), 'stroke-width': Math.max(2, r * 0.07) }, g);
    T(g, 0, r * 0.34, sym, { size: Math.round(r * 0.88), weight: 700, anchor: 'middle', fill: INK_DARK });
    return g;
  }
  /* sulfate: a yellow sulfur atom with four red oxygens */
  function sulfate(parent) {
    const g = G(parent), arms = [[0, -38], [38, 0], [0, 38], [-38, 0]];
    arms.forEach(([x, y]) => E('line', { x1: 0, y1: 0, x2: x, y2: y, stroke: '#8FA3B3', 'stroke-width': 7 }, g));
    arms.forEach(([x, y]) => tr(atom(g, 'O', 17, { letter: true }), x, y));
    E('circle', { r: 25, fill: ball('#F2C94C', '#A8801C'), stroke: '#FBE3A0', 'stroke-width': 2.5 }, g);
    T(g, 0, 9, 'S', { size: 26, weight: 700, anchor: 'middle', fill: INK_DARK });
    return g;
  }
  /* an equation row of chips centred on cx: items are [text, fill, ink, stroke] | '+' | '>' */
  function eqRow(parent, y, items, cx) {
    const parts = items.map(it => {
      const g = G(parent);
      if (it === '+') { T(g, 0, 14, '+', { size: 40, weight: 600, anchor: 'middle', fill: C.muted }); return { g, w: 34 }; }
      if (it === '>') { arrow(g, -26, 0, 26, 0, { color: C.ink, width: 6 }); return { g, w: 62 }; }
      const c = chip(g, it[0], { size: 30, fill: it[1], color: it[2], stroke: it[3], sw: 3 });
      return { g, w: c.w, c };
    });
    const GAP = 12; let tot = 0; parts.forEach((p, i) => { tot += p.w + (i ? GAP : 0); });
    let x = cx - tot / 2; parts.forEach((p, i) => { if (i) x += GAP; p.x = x + p.w / 2; p.y = y; x += p.w; tr(p.g, p.x, y); });
    return parts;
  }
  /* an angular lump of rock, about 2rx x 2ry */
  function rock(parent, rx, ry, seed, col, dark, edge) {
    const g = G(parent), pts = blobPts(rx, ry, 11, 0, 0.2, seed);
    const d = 'M' + pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' L') + 'Z';
    E('path', { d, fill: linGrad(col, dark, true), stroke: edge, 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
    const f = [pts[1], pts[4], pts[7], pts[9]];
    E('path', { d: `M${f[0][0] * 0.3},${f[0][1] * 0.3} L${f[0][0]},${f[0][1]} M${f[0][0] * 0.3},${f[0][1] * 0.3} L${f[1][0]},${f[1][1]} M${f[0][0] * 0.3},${f[0][1] * 0.3} L${f[2][0] * 0.5},${f[2][1] * 0.5} L${f[3][0]},${f[3][1]}`, fill: 'none', stroke: edge, 'stroke-width': 2.5, opacity: 0.55, 'stroke-linejoin': 'round' }, g);
    const r = rng(seed + 3);
    for (let k = 0; k < 5; k++) E('circle', { cx: ((r() - 0.5) * rx * 1.2).toFixed(1), cy: ((r() - 0.5) * ry * 1.1).toFixed(1), r: (2 + r() * 3).toFixed(1), fill: dark, opacity: 0.6 }, g);
    return g;
  }

  /* ================= the mini ladder (a carbon rung slides in later) ================= */
  const LAD = [
    { s: 'K', c: '#D8DEE6' }, { s: 'Na', c: '#D8DEE6' }, { s: 'Ca', c: '#E4E0D4' }, { s: 'Mg', c: '#E3E8EE' }, { s: 'Al', c: AL },
    { s: 'C', c: C.carbon, mark: true, carbon: true },
    { s: 'Zn', c: '#A9B6C4' }, { s: 'Fe', c: FE }, { s: 'H', c: C.air, mark: true }, { s: 'Cu', c: CU }, { s: 'Ag', c: '#E8ECF0' }, { s: 'Au', c: AUC },
  ];
  const MX = 96, MY = j => 196 + 40 * j, CGREY = '#C9D2DB';
  const L = {};
  { let j = 0; LAD.forEach(m => { m.j = m.carbon ? 5 : j++; L[m.s] = m; }); }
  const ladG = G(root);
  LAD.forEach(m => {
    m.g = G(ladG);
    m.halo = E('ellipse', { rx: 60, ry: 30, fill: glow(C.energy) }, m.g);
    const w = 72, h = m.carbon ? 30 : 34;
    if (m.mark) {
      E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: h / 2, fill: H_FILL, stroke: m.carbon ? '#AEB9C4' : C.air, 'stroke-width': 2.5, 'stroke-dasharray': '8 6' }, m.g);
      T(m.g, 0, 9, m.s, { size: 26, weight: 700, anchor: 'middle', fill: m.carbon ? CGREY : C.air });
    } else {
      E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: h / 2, fill: ball(m.c, mix(m.c, '#000000', 0.42)), stroke: mix(m.c, '#FFFFFF', 0.45), 'stroke-width': 2 }, m.g);
      T(m.g, 0, 9, m.s, { size: 26, weight: 700, anchor: 'middle', fill: INK_DARK });
    }
  });
  const carbonLab = T(ladG, 146, MY(5) + 9, 'carbon', { size: 26, weight: 700, fill: CGREY });
  // annotations beside the ladder
  const ladMore = T(root, 146, MY(6) + 9, 'more reactive', { size: 26, weight: 700, fill: C.energy });
  const ladLess = T(root, 146, MY(8) + 9, 'less reactive', { size: 26, weight: 600, fill: C.muted });
  const cantG = G(root);
  const cantArrow = arrow(cantG, 144, MY(8) - 6, 144, MY(6) + 8, { color: C.bad, width: 4, head: 13, bend: 30 });
  const cantX = cross(cantG, 10); tr(cantX, 160, (MY(6) + MY(8)) / 2);
  T(cantG, 184, (MY(6) + MY(8)) / 2 + 9, 'can’t', { size: 26, weight: 700, fill: C.bad });

  /* ================= push: iron cuts in on copper and sulfate ================= */
  const pushG = G(root);
  const title = T(pushG, 690, 190, 'displacement', { size: 58, weight: 700, anchor: 'middle', fill: C.energy });
  const rule = rich(pushG, 690, 248, [['a ', C.ink], ['more reactive', C.energy, 800], [' metal pushes out a ', C.ink], ['less reactive', '#C9D6DE', 800], [' one', C.ink]], { size: 30, anchor: 'middle' });
  const SX = 800, SY = 430, PX = 670;
  const bond = E('line', { x1: PX, y1: SY, x2: SX, y2: SY, stroke: '#8FA3B3', 'stroke-width': 9, 'stroke-linecap': 'round' }, pushG);
  const sulf = sulfate(pushG); tr(sulf, SX, SY);
  const cuBall = metalBall(pushG, 'Cu', CU, 44), feBall = metalBall(pushG, 'Fe', FE, 44);
  const bumpFx = E('circle', { r: 20, fill: 'none', stroke: C.energy, 'stroke-width': 5 }, pushG);
  const chipCS = chip(pushG, 'copper sulfate', { size: 30, fill: CUSO4, color: INK_DARK }); tr(chipCS, 760, 550);
  const chipFS = chip(pushG, 'iron sulfate', { size: 30, fill: FESO4, color: INK_DARK }); tr(chipFS, 760, 550);
  const feLab = T(pushG, 0, 0, 'more reactive', { size: 28, weight: 700, anchor: 'middle', fill: C.energy });
  const cuLab = T(pushG, 0, 0, 'less reactive', { size: 28, weight: 700, anchor: 'middle', fill: '#C9D6DE' });
  const FE0 = [250, 372], FEB = [616, 362], CUEND = [440, 592];

  /* ================= the nail in copper sulfate ================= */
  const BX = 660, BY = 455, BW = 300, BH = 330, BSURF = BH / 2 - (BH - 18) * 0.7;   // beaker local surface y
  function hanger(parent) {
    const g = G(parent);
    E('rect', { x: -180, y: -BH / 2 - 11, width: 360, height: 12, rx: 6, fill: 'rgba(210,235,250,0.45)', stroke: '#E8F4FB', 'stroke-width': 2 }, g);
    E('line', { x1: 0, y1: -BH / 2 - 2, x2: 0, y2: -128, stroke: '#E9E2CF', 'stroke-width': 3 }, g);
    return g;
  }
  const nailG = G(root);
  const bk1 = beaker(nailG, BW, BH, { level: 0.7, liquid: CUSO4, opacity: 0.8 });
  const flakes = G(nailG);
  const fr = rng(41), flakeEls = [];
  for (let k = 0; k < 5; k++) flakeEls.push({ el: E('ellipse', { cx: (-110 + fr() * 220).toFixed(1), cy: (BH / 2 - 7 - fr() * 5).toFixed(1), rx: (5 + fr() * 6).toFixed(1), ry: 3, fill: [CU, '#B8642F'][k % 2] }, flakes), t: fr() });
  const hang1 = hanger(nailG);
  const METAL = linGrad('#A9B4BE', '#5C6671');
  E('rect', { x: -24, y: -130, width: 48, height: 12, rx: 4, fill: METAL, stroke: '#C9D2DA', 'stroke-width': 1.5 }, hang1);
  E('path', { d: 'M-8,-118 L8,-118 L8,104 L0,138 L-8,104 Z', fill: METAL, stroke: '#C9D2DA', 'stroke-width': 1.5, 'stroke-linejoin': 'round' }, hang1);
  // the copper coat: a solid layer over the dipped part, roughened by blobs
  const coatBase = E('path', { d: `M-10.5,${(BSURF + 5).toFixed(1)} L10.5,${(BSURF + 5).toFixed(1)} L10.5,104 L0,141 L-10.5,104 Z`, fill: '#B8642F', stroke: '#D9824B', 'stroke-width': 1.5, 'stroke-linejoin': 'round' }, hang1);
  const coat = G(hang1), cr = rng(29), blobs = [];
  for (let k = 0; k < 34; k++) {
    const y = BSURF + 8 + cr() * (130 - BSURF), half = y > 104 ? 8 * (138 - y) / 34 : 8, x = (cr() - 0.5) * 2 * (half + 2.5), r = 2.6 + cr() * 3.8;
    blobs.push({ el: E('circle', { cx: 0, cy: 0, r: r.toFixed(1), fill: [CU, '#B8642F', '#E89B63'][k % 3] }, coat), x, y, t: cr() });
  }
  const nailLabs = G(root);
  const labNail = labelLine(nailLabs, 872, 372, BX + 12, BY - 92, 'iron nail', { size: 28 });
  const labSol = labelLine(nailLabs, 872, 528, BX + 130, BY + 70, 'copper sulfate\nsolution', { size: 28 });
  const labCoat = labelLine(root, 872, 560, BX + 14, BY + 60, 'copper coating', { size: 28, fill: '#F0A070' });

  /* ================= equation rows ================= */
  const eqG = G(root);
  const row1 = eqRow(eqG, 196, [['iron', FE, INK_DARK], '+', ['copper sulfate', CUSO4, INK_DARK], '>', ['iron sulfate', FESO4, INK_DARK], '+', ['copper', CU, INK_DARK]], 690);
  const R1AT = [0.01, 0.16, 0.21, 0.5, 0.58, 0.8, 0.82];
  const rowHalo = [0, 1].map(() => E('ellipse', { rx: 130, ry: 44, fill: glow(C.energy) }, eqG));
  eqG.insertBefore(rowHalo[0], eqG.firstChild); eqG.insertBefore(rowHalo[1], eqG.firstChild);
  const revG = G(root);
  const row2 = eqRow(revG, 680, [['copper', CU, INK_DARK], '+', ['iron sulfate', FESO4, INK_DARK], '>', ['no reaction', C.card2, C.ink, C.bad]], 690);
  const R2AT = [0.0, 0.08, 0.1, 0.18, 0.88];

  /* ================= time-lapse clock ================= */
  const clock = G(root);
  E('rect', { x: -9, y: -64, width: 18, height: 14, rx: 3, fill: C.muted }, clock);
  E('circle', { r: 46, fill: C.card, stroke: C.muted, 'stroke-width': 5 }, clock);
  { let d = ''; for (let k = 0; k < 12; k++) { const a = k / 12 * TAU; d += `M${(Math.sin(a) * 34).toFixed(1)},${(-Math.cos(a) * 34).toFixed(1)} L${(Math.sin(a) * 40).toFixed(1)},${(-Math.cos(a) * 40).toFixed(1)} `; } E('path', { d, stroke: C.muted, 'stroke-width': 3, 'stroke-linecap': 'round' }, clock); }
  const handH = E('line', { x1: 0, y1: 0, x2: 0, y2: -20, stroke: C.ink, 'stroke-width': 6, 'stroke-linecap': 'round' }, clock);
  const handM = E('line', { x1: 0, y1: 0, x2: 0, y2: -32, stroke: C.energy, 'stroke-width': 4, 'stroke-linecap': 'round' }, clock);
  E('circle', { r: 5, fill: C.energy }, clock);
  const clockLab = T(clock, 0, 86, 'time-lapse', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });

  /* ================= never: copper in iron sulfate ================= */
  const bk2G = G(root);
  const bk2 = beaker(bk2G, BW, BH, { level: 0.7, liquid: FESO4, opacity: 0.7 });
  const strip = G(bk2G), stripIn = G(strip);   // a copper strip leaning against the glass
  E('rect', { x: -13, y: -130, width: 26, height: 260, rx: 5, fill: linGrad('#F0A877', '#A9582A'), stroke: '#F6C29C', 'stroke-width': 1.5, transform: 'rotate(9)' }, stripIn);
  const stripGl = glint(stripIn, 9); tr(stripGl, -2, 30);
  tr(stripIn, -12, 22);

  /* ================= lens (shared by ores and gold) ================= */
  const LX = 830, LY = 388, LR = 134;
  const lensClip = E('clipPath', { id: 'dspLensClip' }, defs()); E('circle', { cx: LX, cy: LY, r: LR }, lensClip);
  const cone = E('path', { fill: 'rgba(159,216,255,0.07)', stroke: 'rgba(159,216,255,0.3)', 'stroke-width': 2 }, root);
  const lensG = G(root);
  E('circle', { cx: LX, cy: LY, r: LR, fill: '#0B2230', opacity: 0.96 }, lensG);
  const lensIn = G(lensG, { 'clip-path': 'url(#dspLensClip)' });
  E('line', { x1: LX + LR * 0.74, y1: LY + LR * 0.74, x2: LX + LR * 1.18, y2: LY + LR * 1.18, stroke: '#C9D6DE', 'stroke-width': 18, 'stroke-linecap': 'round' }, lensG);
  E('circle', { cx: LX, cy: LY, r: LR, fill: 'none', stroke: '#C9D6DE', 'stroke-width': 10 }, lensG);
  E('path', { d: `M${LX - LR * 0.62},${LY - LR * 0.42} A${LR * 0.75},${LR * 0.75} 0 0 1 ${LX - LR * 0.2},${LY - LR * 0.72}`, fill: 'none', stroke: '#FFFFFF', 'stroke-width': 6, opacity: 0.35, 'stroke-linecap': 'round' }, lensG);
  const setCone = (x, y, r) => {   // two tangents from a point on the rock to the lens
    const dx = LX - x, dy = LY - y, D = Math.hypot(dx, dy), a = Math.atan2(dy, dx), b = Math.asin(Math.min(0.99, LR / D));
    const p1 = [x + Math.cos(a - b) * Math.sqrt(D * D - LR * LR), y + Math.sin(a - b) * Math.sqrt(D * D - LR * LR)];
    const p2 = [x + Math.cos(a + b) * Math.sqrt(D * D - LR * LR), y + Math.sin(a + b) * Math.sqrt(D * D - LR * LR)];
    cone.setAttribute('d', `M${(x + Math.cos(a - b) * r).toFixed(1)},${(y + Math.sin(a - b) * r).toFixed(1)} L${p1[0].toFixed(1)},${p1[1].toFixed(1)} L${p2[0].toFixed(1)},${p2[1].toFixed(1)} L${(x + Math.cos(a + b) * r).toFixed(1)},${(y + Math.sin(a + b) * r).toFixed(1)} Z`);
  };
  // ore lattice: iron atoms joined to oxygen atoms
  const oreAt = G(lensIn), oreAtoms = [];
  const bondsD = [];
  for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) {
    const x = LX - 96 + c * 64, y = LY - 64 + r * 64, isFe = (r + c) % 2 === 0;
    oreAtoms.push({ x, y, isFe });
    if (c < 3) bondsD.push(`M${x},${y} L${x + 64},${y}`);
    if (r < 2) bondsD.push(`M${x},${y} L${x},${y + 64}`);
  }
  const oreBonds = E('path', { d: bondsD.join(' '), stroke: '#8FA3B3', 'stroke-width': 7, 'stroke-linecap': 'round' }, oreAt);
  oreAtoms.forEach(a => {
    a.halo = a.isFe ? E('circle', { cx: a.x, cy: a.y, r: 40, fill: glow('#FFFFFF') }, oreAt) : null;
    a.g = a.isFe ? metalBall(oreAt, 'Fe', FE, 25) : atom(oreAt, 'O', 18, { letter: true });
    tr(a.g, a.x, a.y);
  });
  // gold lattice: gold atoms only
  const goldAt = G(lensIn), goldAtoms = [];
  for (let r = 0; r < 4; r++) for (let c = 0; c < 5; c++) {
    const x = LX - 116 + c * 58 + (r % 2) * 29, y = LY - 84 + r * 54;
    if (Math.hypot(x - LX, y - LY) > LR + 10) continue;
    const g = metalBall(goldAt, 'Au', AUC, 26); tr(g, x, y); goldAtoms.push({ g, x, y });
  }

  /* ================= ores ================= */
  const oreG = G(root);
  const oreRock = rock(oreG, 150, 108, 12, '#9A644C', '#5A3426', '#C9937A'); tr(oreRock, 410, 440);
  const oreLab = T(oreG, 410, 610, 'ore', { size: 46, weight: 700, anchor: 'middle', fill: '#E0A98E' });
  const oreLensLab = T(oreG, LX - 20, 590, 'metal joined to oxygen', { size: 28, weight: 700, anchor: 'middle' });
  const extChip = chip(oreG, 'extraction: getting the metal out', { size: 30, fill: C.card2, stroke: C.energy, color: C.ink }); tr(extChip, 690, 672);

  /* ================= carbon: heating iron oxide with carbon ================= */
  const cG = G(root);
  const bun = bunsen(cG, 0.72); tr(bun, 520, 652);
  E('path', { d: 'M380,652 L414,506 M660,652 L626,506', stroke: '#8E9CA9', 'stroke-width': 7, 'stroke-linecap': 'round' }, cG);
  E('rect', { x: 386, y: 498, width: 268, height: 10, rx: 5, fill: '#9DB0BF' }, cG);
  E('path', { d: 'M324,352 L716,352 Q708,474 650,498 L390,498 Q332,474 324,352 Z', fill: linGrad('#EEE8DA', '#A39B88', true), stroke: '#F4EEE2', 'stroke-width': 3, 'stroke-linejoin': 'round' }, cG);
  E('path', { d: 'M338,362 L702,362 Q696,464 644,486 L396,486 Q344,464 338,362 Z', fill: '#2A2622' }, cG);
  const molten = E('ellipse', { cx: 520, cy: 452, rx: 170, ry: 56, fill: glow('#FF9A3D') }, cG);
  const FEPOS = [[442, 412], [546, 412], [468, 458], [572, 458]], OPOS = [[390, 412], [494, 412], [598, 412], [416, 458], [520, 458], [624, 458]];
  const CPOS = [401, 507, 611], CY0 = 368;
  const ironAt = FEPOS.map(p => ({ g: metalBall(cG, 'Fe', FE, 24), p }));
  const oxAt = OPOS.map(p => ({ g: atom(cG, 'O', 18, { letter: true }), p }));
  const carbAt = CPOS.map((x, k) => ({ g: atom(cG, 'C', 19, { letter: true }), x, k }));
  const PAIRS = [[0, 3], [1, 4], [2, 5]];             // which two oxygens each carbon takes
  const labFeO = labelLine(cG, 748, 440, 630, 436, 'iron oxide', { size: 30 });
  const labC = labelLine(cG, 748, 372, 634, 368, 'carbon', { size: 30, fill: CGREY });
  const labCO2 = T(cG, 790, 140, 'carbon dioxide', { size: 32, weight: 700, anchor: 'middle', fill: C.co2 });
  const labFe = labelLine(cG, 748, 466, 620, 458, 'iron', { size: 34, weight: 700, fill: '#E8EDF2' });

  /* ================= electro: aluminium oxide, then electrolysis ================= */
  const elG = G(root);
  const aoG = G(elG);
  const AOA = [[648, 392], [764, 392], [619, 456], [735, 456]], AOO = [[590, 392], [706, 392], [822, 392], [561, 456], [677, 456], [793, 456]];
  const aoBondD = [];
  AOA.forEach(a => AOO.forEach(o => { if (Math.hypot(a[0] - o[0], a[1] - o[1]) < 76) aoBondD.push(`M${a[0]},${a[1]} L${o[0]},${o[1]}`); }));
  const aoGlow = E('path', { d: aoBondD.join(' '), stroke: C.energy, 'stroke-width': 24, 'stroke-linecap': 'round', opacity: 0.25 }, aoG);
  E('path', { d: aoBondD.join(' '), stroke: '#FFD27A', 'stroke-width': 9, 'stroke-linecap': 'round' }, aoG);
  AOA.forEach(p => tr(metalBall(aoG, 'Al', AL, 28), p[0], p[1]));
  AOO.forEach(p => tr(atom(aoG, 'O', 20, { letter: true }), p[0], p[1]));
  const aoLab = T(aoG, 692, 540, 'aluminium oxide', { size: 32, weight: 700, anchor: 'middle' });
  const aoNote = T(aoG, 692, 580, 'held very tightly', { size: 28, weight: 600, anchor: 'middle', fill: C.energy });
  const tryC = atom(elG, 'C', 17, { letter: true });
  const tryX = cross(elG, 14);
  const cellG = G(elG);
  E('rect', { x: 540, y: 420, width: 360, height: 192, rx: 16, fill: '#3B4650', stroke: '#9DB0BF', 'stroke-width': 4 }, cellG);
  const bath = E('rect', { x: 552, y: 446, width: 336, height: 154, rx: 10, fill: linGrad('#FFB861', '#D9622B', true) }, cellG);
  E('ellipse', { cx: 720, cy: 520, rx: 200, ry: 100, fill: glow('#FFC27A'), opacity: 0.6 }, cellG);
  const pool = E('rect', { x: 552, y: 600, width: 336, height: 0, rx: 4, fill: linGrad('#F4F7FA', '#A3AEB8', true) }, cellG);
  const oBub = [0, 1, 2, 3, 4].map(() => E('circle', { r: 6, fill: 'rgba(255,107,92,0.35)', stroke: '#FFB3AA', 'stroke-width': 2 }, cellG));
  const alP = [0, 1, 2, 3, 4, 5].map(() => { const g = G(cellG); E('circle', { r: 10, fill: ball(AL, '#6E7B88'), stroke: '#F4F7FA', 'stroke-width': 1.5 }, g); return g; });
  [[640, '+'], [800, '−']].forEach(([x]) => E('rect', { x: x - 12, y: 332, width: 24, height: 236, rx: 5, fill: linGrad('#626C76', '#2E363D'), stroke: '#8D99A5', 'stroke-width': 2 }, cellG));
  const batt = cellSym(cellG); tr(batt, 720, 266);
  const w1 = wire(cellG, [[678, 266], [640, 266], [640, 332]], { spacing: 30 });
  const w2 = wire(cellG, [[800, 332], [800, 266], [762, 266]], { spacing: 30 });
  const zap = bolt(cellG, 0.42, C.energy); tr(zap, 870, 250, 0.42);
  T(cellG, 614, 322, '+', { size: 34, weight: 700, anchor: 'middle', fill: '#FF6B76' });
  T(cellG, 828, 322, '−', { size: 34, weight: 700, anchor: 'middle', fill: '#7CC8FF' });
  T(cellG, 524, 498, 'molten', { size: 26, weight: 600, anchor: 'end', fill: '#FFC27A' });
  T(cellG, 524, 532, 'aluminium oxide', { size: 26, weight: 600, anchor: 'end', fill: '#FFC27A' });
  const labAl = labelLine(cellG, 922, 612, 868, 598, 'aluminium', { size: 28, weight: 700 });
  const elecLab = T(cellG, 720, 196, 'electrolysis', { size: 40, weight: 700, anchor: 'middle', fill: C.energy });
  const expG = G(elG);
  const expChip = chip(expG, 'expensive', { size: 32, fill: C.card2, stroke: C.heat, color: C.ink }); tr(expChip, 690, 672);
  const coins = [0, 1, 2].map(k => { const g = G(expG); E('circle', { r: 20, fill: ball('#FFD54F', '#B8860B'), stroke: '#FFF0B0', 'stroke-width': 2 }, g); T(g, 0, 9, '£', { size: 26, weight: 700, anchor: 'middle', fill: '#5A3E00' }); return g; });

  /* ================= gold: found pure ================= */
  const goldG = G(root);
  const qRock = rock(goldG, 150, 104, 21, '#B4BCC3', '#6C767F', '#DDE3E8'); tr(qRock, 410, 446);
  E('path', { d: closedPath(blobPts(46, 32, 9, 0, 0.2, 5)), fill: ball('#FFE07A', '#B8860B'), stroke: '#FFF0B0', 'stroke-width': 2.5, transform: 'translate(430 412)' }, goldG);
  E('path', { d: closedPath(blobPts(30, 19, 8, 0, 0.2, 8)), fill: ball('#F4F7FA', '#8E9AA6'), stroke: '#FFFFFF', 'stroke-width': 2, transform: 'translate(330 500)' }, goldG);
  const gGlints = [[446, 396, 13], [322, 492, 9]].map(([x, y, r]) => { const g = glint(goldG, r); tr(g, x, y); return g; });
  const labGold = labelLine(goldG, 250, 300, 412, 396, 'gold', { size: 30, weight: 700, fill: AUC });
  const labSilver = labelLine(goldG, 250, 628, 318, 516, 'silver', { size: 30, weight: 700, fill: '#E8ECF0' });
  const goldLensLab = T(goldG, LX - 20, 590, 'only gold atoms: no oxygen', { size: 28, weight: 700, anchor: 'middle' });
  const pureChip = chip(goldG, 'found pure', { size: 32, fill: AUC, color: INK_DARK }); tr(pureChip, 690, 672);

  /* ================= recycle ================= */
  const recG = G(root);
  const RCX = 300, RCY = 372, RR = 128, GREEN = '#56D69B';
  [0, 1, 2].forEach(k => {
    const a0 = (-80 + k * 120) * Math.PI / 180, a1 = a0 + 96 * Math.PI / 180;
    const p0 = [RCX + RR * Math.cos(a0), RCY + RR * Math.sin(a0)], p1 = [RCX + RR * Math.cos(a1), RCY + RR * Math.sin(a1)];
    E('path', { d: `M${p0[0].toFixed(1)},${p0[1].toFixed(1)} A${RR},${RR} 0 0 1 ${p1[0].toFixed(1)},${p1[1].toFixed(1)}`, fill: 'none', stroke: GREEN, 'stroke-width': 12, 'stroke-linecap': 'round', opacity: 0.85 }, recG);
    const ang = a1 + Math.PI / 2;
    E('path', { d: 'M0,0 L-22,-14 L-22,14 Z', fill: GREEN, transform: `translate(${p1[0].toFixed(1)} ${p1[1].toFixed(1)}) rotate(${(ang * 180 / Math.PI).toFixed(1)})` }, recG);
  });
  const can = G(recG), canBody = G(can);
  E('rect', { x: -22, y: -40, width: 44, height: 80, rx: 9, fill: linGrad('#EEF2F5', '#8E9AA6'), stroke: '#F4F7FA', 'stroke-width': 2 }, canBody);
  E('rect', { x: -22, y: -16, width: 44, height: 26, fill: '#E8424F' }, canBody);
  E('ellipse', { cx: 0, cy: -40, rx: 18, ry: 5, fill: '#C9D2DA', stroke: '#F4F7FA', 'stroke-width': 1.5 }, canBody);
  const canLab = T(recG, RCX, RCY + 8, 'Al', { size: 40, weight: 700, anchor: 'middle', fill: '#DDE4EA' });
  T(recG, RCX, 566, 'recycling aluminium', { size: 28, weight: 700, anchor: 'middle' });
  const enG = G(recG);
  T(enG, 600, 220, 'energy needed to make aluminium', { size: 28, weight: 600, fill: C.muted });
  T(enG, 600, 284, 'from ore', { size: 30, weight: 700 });
  T(enG, 600, 356, 'recycled', { size: 30, weight: 700, fill: GREEN });
  const mOre = meter(enG, { w: 300, h: 30, color: C.heat }); tr(mOre, 760, 262);
  const mRec = meter(enG, { w: 300, h: 30, color: GREEN }); tr(mRec, 760, 334);
  const vOre = T(enG, 1074, 286, '100%', { size: 28, weight: 700 }), vRec = T(enG, 1074, 358, '5%', { size: 28, weight: 700, fill: GREEN });
  const saveChip = chip(recG, 'saves about 95% of the energy', { size: 30, fill: C.energy, color: INK_DARK }); tr(saveChip, 860, 432);
  const renG = G(recG);
  const sunG = sun(renG, 30); tr(sunG, 610, 600);
  const turb = G(renG); tr(turb, 740, 640);
  E('path', { d: 'M-5,0 L-2.5,-104 L2.5,-104 L5,0 Z', fill: '#DDE4EA' }, turb);
  const blades = G(turb);
  [0, 1, 2].forEach(k => E('path', { d: 'M0,0 C6,-14 5,-50 0,-60 C-5,-50 -6,-14 0,0 Z', fill: '#F4F7FA', transform: `rotate(${k * 120})` }, blades));
  E('circle', { cy: 0, r: 6, fill: '#C9D2DA' }, blades);
  const renWire = wire(renG, [[790, 622], [930, 622]], { spacing: 32 });
  const mini = G(renG); tr(mini, 990, 612);
  E('rect', { x: -46, y: -30, width: 92, height: 56, rx: 10, fill: '#3B4650', stroke: '#9DB0BF', 'stroke-width': 3 }, mini);
  E('rect', { x: -38, y: -18, width: 76, height: 36, rx: 6, fill: linGrad('#FFB861', '#D9622B', true) }, mini);
  E('rect', { x: -22, y: -46, width: 10, height: 50, rx: 3, fill: '#4A545E' }, mini); E('rect', { x: 12, y: -46, width: 10, height: 50, rx: 3, fill: '#4A545E' }, mini);
  const renLab = T(renG, 800, 702, 'renewable electricity', { size: 30, weight: 700, anchor: 'middle', fill: GREEN });

  /* ================= timings ================= */
  const tE = mid('push', 0.4), tB = mid('push', 0.62);
  const SEE0 = mid('see', 0.12), SEE1 = at('never') - 0.3;     // the time-lapse
  const coatT0 = mid('see', 0.44);

  return t => {
    t = Math.min(t, S.D);

    /* ---- mini ladder ---- */
    const la = fade(t, S.first - 0.3, 0.5) * (1 - P(t, at('recycle') - 0.4, 0.5, linear));
    op(ladG, la);
    if (la > 0) {
      const kC = P(t, mid('carbon', 0.45), 0.8);
      LAD.forEach(m => {
        let y;
        if (m.carbon) { y = MY(5); const p = P(t, mid('carbon', 0.45) + 0.3, 0.5, pop); op(m.g, clamp(p * 2)); tr(m.g, MX, y, Math.max(0.01, 0.6 + 0.4 * p)); }
        else { y = MY(m.j) + (m.j >= 5 ? 40 * kC : 0); tr(m.g, MX, y); }
        let h = 0;
        if (m.s === 'Fe') h = Math.max(win(t, tE, at('nail') - 0.2, 0.4), win(t, mid('nail', 0.52), at('ores') - 0.2, 0.4), win(t, mid('carbon', 0.45), at('electro'), 0.4));
        if (m.s === 'Cu') h = Math.max(win(t, mid('push', 0.67), at('nail') - 0.2, 0.4), win(t, mid('nail', 0.52), at('ores') - 0.2, 0.4));
        if (m.carbon) h = win(t, mid('carbon', 0.5), at('gold'), 0.4);
        if (m.s === 'Al') h = win(t, at('electro'), at('gold'), 0.4);
        if (m.s === 'Ag' || m.s === 'Au') h = win(t, mid('gold', m.s === 'Au' ? 0.0 : 0.06), at('recycle') - 0.2, 0.4);
        op(m.halo, h * (0.8 + 0.2 * wave(t, 1.3)));
      });
      op(carbonLab, fade(t, mid('carbon', 0.45) + 0.5, 0.4));
    }
    op(ladMore, win(t, mid('nail', 0.52), at('never') + 0.2, 0.35));
    op(ladLess, win(t, mid('nail', 0.6), at('never') + 0.2, 0.35));
    const ca = win(t, mid('never', 0.3), at('ores') - 0.2, 0.4);
    op(cantG, ca); if (ca > 0) cantArrow.set(P(t, mid('never', 0.3), 0.6));

    /* ---- push ---- */
    const pa = fade(t, S.first - 0.2, 0.5) * outBy(t, 'nail');
    op(pushG, pa);
    if (pa > 0) {
      op(title, fade(t, mid('push', 0.18), 0.4)); tr(title, 0, (1 - P(t, mid('push', 0.18), 0.5, easeOut)) * 12);
      op(rule, fade(t, mid('push', 0.66), 0.5));
      // iron: in from the upper left, bumps copper, then takes its place
      let fx = FE0[0], fy = FE0[1], spin = 0;
      if (t >= tE) {
        const u = P(t, tE, tB - tE, ease);
        fx = lerp(FE0[0], FEB[0], u); fy = lerp(FE0[1], FEB[1], u) - Math.sin(Math.PI * u) * 40; spin = 300 * u;
        const v = P(t, tB, 0.65, easeOut);
        fx = lerp(fx, PX, v); fy = lerp(fy, SY, v); spin += 60 * v;
      }
      op(feBall, fade(t, tE - 0.1, 0.3)); tr(feBall, fx, fy, 1, spin);
      // copper: sits with sulfate, then is knocked out and rolls away (one full turn, so it ends upright)
      let cx = PX, cy = SY, cspin = 0;
      if (t >= tB) { const v = P(t, tB, 1.0, easeOut); [cx, cy] = bez([PX, SY], [590, 600], CUEND, v); cspin = -v * 360; }
      else { cx += Math.sin(t * 2.2) * 2 * calm; }
      tr(cuBall, cx, cy, 1, cspin); op(cuBall, fade(t, S.first - 0.1, 0.4));
      // the bond belongs to whichever metal is the partner
      const bondOn = t < tB ? 1 : P(t, tB + 0.5, 0.25, linear);
      attr(bond, 'x1', t < tB ? cx : fx); attr(bond, 'y1', t < tB ? cy : fy); op(bond, bondOn * fade(t, S.first - 0.1, 0.4));
      op(sulf, fade(t, S.first - 0.1, 0.4));
      const bu = clamp((t - tB) / 0.5); op(bumpFx, t > tB && bu < 1 ? 1 - bu : 0); if (t > tB) { attr(bumpFx, 'cx', (FEB[0] + PX) / 2); attr(bumpFx, 'cy', (FEB[1] + SY) / 2); attr(bumpFx, 'r', 16 + 50 * bu); }
      const sw = P(t, tB + 0.3, 0.35, linear);
      op(chipCS, fade(t, mid('push', 0.06), 0.4) * (1 - sw)); op(chipFS, sw);
      op(feLab, fade(t, tE + 0.1, 0.35)); attr(feLab, 'x', fx); attr(feLab, 'y', fy - 60);
      op(cuLab, fade(t, tB + 0.15, 0.4)); attr(cuLab, 'x', cx); attr(cuLab, 'y', cy + 76);
    }

    /* ---- the nail beaker: in at 'nail', time-lapse at 'see', slides left at 'never' ---- */
    const na = fade(t, at('nail') - 0.05, 0.4) * outBy(t, 'ores');
    op(nailG, na);
    const toL = P(t, at('never') - 0.1, 0.9);
    if (na > 0) {
      tr(nailG, lerp(BX, 410, toL), lerp(BY, 480, toL), lerp(1, 0.78, toL));
      const low = P(t, mid('nail', 0.02), 1.1, easeOut);
      tr(hang1, 0, -280 * (1 - low));
      const sp = P(t, SEE0, mid('see', 0.6) - SEE0, linear);   // blue -> pale green
      bk1.set(0.7, mix(CUSO4, FESO4, sp)); bk1.liquid.setAttribute('opacity', lerp(0.8, 0.7, sp).toFixed(3));
      op(coatBase, 0.95 * P(t, coatT0 + 0.2, 2.2, linear));
      blobs.forEach(b => { const q = P(t, coatT0 + b.t * 2.4, 0.45, easeOut); op(b.el, q); if (q > 0) tr(b.el, b.x, b.y, Math.max(0.01, q)); });
      flakeEls.forEach(f => op(f.el, P(t, coatT0 + 0.6 + f.t * 1.4, 0.4, linear)));
    }
    const nl = win(t, mid('nail', 0.1), at('eq') + 0.2, 0.4);
    op(nailLabs, nl);
    if (nl > 0) { op(labNail, fade(t, mid('nail', 0.1))); op(labSol, fade(t, mid('nail', 0.26))); }
    op(labCoat, win(t, mid('see', 0.72), at('never') - 0.15, 0.35));

    /* ---- equation rows ---- */
    const ea = fade(t, at('eq') - 0.1, 0.4) * outBy(t, 'ores');
    op(eqG, ea);
    if (ea > 0) {
      const dimCS = 1 - 0.5 * P(t, SEE0, 1.5, linear) * (1 - P(t, at('never') - 0.2, 0.4, linear));
      row1.forEach((p, i) => { const a = P(t, mid('eq', R1AT[i]), 0.45, pop); op(p.g, clamp(a * 2) * (i === 2 ? dimCS : 1)); tr(p.g, p.x, p.y, Math.max(0.01, 0.75 + 0.25 * a)); });
      const h1 = win(t, SEE0, mid('see', 0.66), 0.4), h2 = win(t, coatT0, at('never'), 0.4);
      op(rowHalo[0], h1); tr(rowHalo[0], row1[4].x, row1[4].y);
      op(rowHalo[1], h2); tr(rowHalo[1], row1[6].x, row1[6].y, 0.75);
    }
    const ra = fade(t, at('never') - 0.05, 0.4) * outBy(t, 'ores');
    op(revG, ra);
    if (ra > 0) row2.forEach((p, i) => { const a = P(t, mid('never', R2AT[i]), 0.45, pop); op(p.g, clamp(a * 2)); tr(p.g, p.x, p.y, Math.max(0.01, 0.75 + 0.25 * a)); });

    /* ---- clock: spins during the time-lapse and while copper does nothing ---- */
    const cla = Math.max(win(t, SEE0 - 0.2, at('never'), 0.35), win(t, mid('never', 0.62), at('ores') - 0.1, 0.35));
    op(clock, cla);
    if (cla > 0) {
      const second = t > at('never');
      tr(clock, second ? 660 : 1010, second ? 452 : 340);
      const spinT = second ? P(t, mid('never', 0.64), end('never') - mid('never', 0.64), linear) : P(t, SEE0, SEE1 - SEE0, linear);
      handM.setAttribute('transform', `rotate(${(spinT * 360 * 6).toFixed(1)})`);
      handH.setAttribute('transform', `rotate(${(spinT * 180).toFixed(1)})`);
    }

    /* ---- never: copper strip in iron sulfate ---- */
    const n2 = fade(t, at('never') + 0.1, 0.5) * outBy(t, 'ores');
    op(bk2G, n2);
    if (n2 > 0) {
      tr(bk2G, 910, 480 + (1 - P(t, at('never') + 0.1, 0.6, easeOut)) * 20, 0.78);
      const lo = P(t, mid('never', 0.6), 1.0, easeOut);
      tr(strip, 23 * (1 - lo), -150 * (1 - lo)); op(strip, fade(t, mid('never', 0.6), 0.3));
      op(stripGl, 0.4 + 0.6 * wave(t, 1.7));
    }

    /* ---- the lens (ores and gold) ---- */
    const lensA = Math.max(win(t, mid('ores', 0.26), at('carbon') - 0.05, 0.4), win(t, mid('gold', 0.4), S.D + 1, 0.4) * outBy(t, 'recycle'));
    op(lensG, lensA); op(cone, lensA);
    if (lensA > 0) {
      const isGold = t > at('electro');
      op(oreAt, isGold ? 0 : 1); op(goldAt, isGold ? 1 : 0);
      setCone(isGold ? 430 : 470, isGold ? 412 : 420, isGold ? 30 : 40);
      const ls = 0.8 + 0.2 * P(t, isGold ? mid('gold', 0.4) : mid('ores', 0.26), 0.6, easeOut);
      lensG.setAttribute('transform', `translate(${LX} ${LY}) scale(${ls.toFixed(3)}) translate(${-LX} ${-LY})`);
      if (!isGold) {
        const ex = P(t, mid('ores', 0.8), 1.2);
        oreAtoms.forEach(a => {
          if (a.isFe) { op(a.halo, ex * 0.8); return; }
          const dx = a.x - LX, dy = a.y - LY, D = Math.hypot(dx, dy) || 1;
          tr(a.g, a.x + dx / D * 60 * ex, a.y + dy / D * 60 * ex); op(a.g, 1 - ex);
        });
        op(oreBonds, 1 - ex);
      } else goldAtoms.forEach((a, k) => tr(a.g, a.x, a.y, 1 + 0.04 * Math.sin(t * 3 + k)));
    }

    /* ---- ores ---- */
    const oa = fade(t, at('ores') - 0.05, 0.4) * outBy(t, 'carbon');
    op(oreG, oa);
    if (oa > 0) {
      popAt(oreRock, t, at('ores'), 410, 440, 0.85);
      op(oreLab, fade(t, mid('ores', 0.13)));
      op(oreLensLab, fade(t, mid('ores', 0.5)));
      popAt(extChip, t, mid('ores', 0.86), 690, 672, 0.9);
    }

    /* ---- carbon ---- */
    const cA = fade(t, at('carbon') - 0.05, 0.4) * outBy(t, 'electro');
    op(cG, cA);
    if (cA > 0) {
      bun.set(t > mid('carbon', 0.18) ? 'blue' : 'off'); bun.upd(t * calm);
      const R0 = mid('carbon', 0.68);                      // carbon takes the oxygen
      ironAt.forEach((a, k) => {
        const m = P(t, R0 + 0.7, 0.7);
        const x = lerp(a.p[0], 448 + k * 48, m), y = lerp(a.p[1], 458, m);
        tr(a.g, x, y); op(a.g, fade(t, at('carbon'), 0.4));
      });
      op(molten, P(t, R0 + 0.8, 0.7, linear) * (0.75 + 0.25 * wave(t, 0.8)));
      oxAt.forEach(a => { tr(a.g, a.p[0], a.p[1]); op(a.g, fade(t, at('carbon'), 0.4)); });
      carbAt.forEach(c => {
        const drop = P(t, mid('carbon', 0.2) + c.k * 0.18, 0.5, easeIn);
        const cy = lerp(CY0 - 170, CY0, drop);
        op(c.g, fade(t, mid('carbon', 0.2) + c.k * 0.18, 0.2));
        const grab = P(t, R0 + c.k * 0.12, 0.45), rise = P(t, R0 + 0.5 + c.k * 0.12, 1.1, easeOut);
        const dx = rise * (220 + c.k * 50), dy = rise * (150 + c.k * 20);
        tr(c.g, c.x + dx, cy - dy);
        PAIRS[c.k].forEach((oi, s) => {
          const o = oxAt[oi], ox = lerp(o.p[0], c.x + (s ? 32 : -32), grab), oy = lerp(o.p[1], CY0, grab);
          if (grab > 0) tr(o.g, ox + dx, oy - dy);
        });
      });
      op(labFeO, win(t, mid('carbon', 0.05), R0 + 0.4, 0.35));
      op(labC, win(t, mid('carbon', 0.3), R0, 0.3));
      op(labCO2, fade(t, R0 + 1.0, 0.4));
      op(labFe, fade(t, R0 + 1.1, 0.4));
    }

    /* ---- electro ---- */
    const eA = fade(t, at('electro') - 0.05, 0.4) * outBy(t, 'gold');
    op(elG, eA);
    if (eA > 0) {
      const aoA = win(t, at('electro'), mid('electro', 0.55), 0.4);
      op(aoG, aoA);
      if (aoA > 0) { tr(aoG, 0, (1 - P(t, at('electro'), 0.6, easeOut)) * 16); op(aoGlow, 0.15 + 0.35 * wave(t, 0.9)); op(aoNote, fade(t, mid('electro', 0.36), 0.4)); }
      // carbon tries to take an oxygen and bounces off
      const tryT = mid('electro', 0.33), hit = [860, 370];
      const u1 = P(t, tryT, 0.8, easeIn), u2 = P(t, tryT + 0.8, 0.9, easeOut);
      const cx = t < tryT + 0.8 ? lerp(1090, hit[0], u1) : lerp(hit[0], 1070, u2), cy = t < tryT + 0.8 ? lerp(286, hit[1], u1) : lerp(hit[1], 236, u2) - Math.sin(Math.PI * u2) * 40;
      tr(tryC, cx, cy, 1, u2 * 240); op(tryC, win(t, tryT, mid('electro', 0.53), 0.3));
      popAt(tryX, t, tryT + 0.95, 922, 300, 0.8, aoA);
      const cA2 = fade(t, mid('electro', 0.55), 0.5);
      op(cellG, cA2);
      if (cA2 > 0) {
        const on = P(t, mid('electro', 0.72), 0.5, linear);
        w1.set(on); w2.set(on); w1.upd(t * calm, 70); w2.upd(t * calm, 70);
        op(zap, on * (0.7 + 0.3 * wave(t, 0.4)));
        attr(pool, 'height', 16 * P(t, mid('electro', 0.76), 2.0, linear)); attr(pool, 'y', 600 - 16 * P(t, mid('electro', 0.76), 2.0, linear));
        alP.forEach((g, k) => {
          const q = (((t - mid('electro', 0.72)) * 0.45 * calm + k / 6) % 1 + 1) % 1;
          const x0 = 580 + (k * 47) % 280, y0 = 470 + (k * 29) % 90;
          const x = q < 0.6 ? lerp(x0, 774, q / 0.6) : 774 - (k % 3) * 8, y = q < 0.6 ? lerp(y0, 480 + (k % 3) * 24, q / 0.6) : lerp(480 + (k % 3) * 24, 590, (q - 0.6) / 0.4);
          tr(g, x, y); op(g, on * Math.min(1, q * 8, (1 - q) * 8));
        });
        oBub.forEach((b, k) => { const q = ((t * 0.6 * calm + k / 5) % 1); attr(b, 'cx', 656 + Math.sin(q * 9 + k) * 4); attr(b, 'cy', 560 - q * 110); op(b, on * Math.sin(q * Math.PI)); });
        op(labAl, fade(t, mid('electro', 0.8)));
        op(elecLab, fade(t, mid('electro', 0.56)));
      }
      const xp = P(t, mid('electro', 0.88), 0.45, pop);
      op(expG, clamp(xp * 2)); tr(expChip, 690, 672, Math.max(0.01, 0.9 + 0.1 * xp));
      coins.forEach((g, k) => popAt(g, t, mid('electro', 0.9) + k * 0.12, 806 + k * 46, 672));
    }

    /* ---- gold ---- */
    const gA = fade(t, at('gold') - 0.05, 0.4) * outBy(t, 'recycle');
    op(goldG, gA);
    if (gA > 0) {
      gGlints.forEach((g, k) => { op(g, 0.4 + 0.6 * wave(t, 1.4, k * 0.4)); tr(g, k ? 322 : 446, k ? 492 : 396, 0.8 + 0.3 * wave(t, 1.4, k * 0.4), t * 30); });
      op(labGold, fade(t, mid('gold', 0.02))); op(labSilver, fade(t, mid('gold', 0.1)));
      op(goldLensLab, fade(t, mid('gold', 0.5)));
      popAt(pureChip, t, mid('gold', 0.58), 690, 672, 0.9);
    }

    /* ---- recycle ---- */
    const rA = fade(t, at('recycle') - 0.05, 0.45);
    op(recG, rA);
    if (rA > 0) {
      const th = (-90 + (t - at('recycle')) * 80 * calm) * Math.PI / 180;
      const x = RCX + RR * Math.cos(th), y = RCY + RR * Math.sin(th);
      const deg = ((th * 180 / Math.PI) % 360 + 360) % 360;
      const crush = Math.sin(Math.PI * clamp((deg - 40) / 100));            // squashed flat round the bottom of the loop
      tr(can, x, y); canBody.setAttribute('transform', `scale(${(1 + 0.25 * crush).toFixed(3)} ${(1 - 0.6 * crush).toFixed(3)})`);
      op(can, fade(t, at('recycle'), 0.4));
      op(canLab, fade(t, mid('recycle', 0.07)));
      op(enG, fade(t, mid('recycle', 0.22), 0.5));
      mOre.set(P(t, mid('recycle', 0.26), 1.2, easeOut)); mRec.set(0.05 * P(t, mid('recycle', 0.33), 0.8, easeOut));
      op(vOre, fade(t, mid('recycle', 0.3))); op(vRec, fade(t, mid('recycle', 0.37)));
      popAt(saveChip, t, mid('recycle', 0.4), 860, 432, 0.9);
      op(renG, fade(t, mid('recycle', 0.54), 0.5));
      sunG.upd(t * calm); blades.setAttribute('transform', `translate(0 -104) rotate(${(t * 90 * calm) % 360})`);
      const flow = P(t, mid('recycle', 0.7), 0.5, linear);
      renWire.set(flow); renWire.upd(t * calm, 60);
      op(mini, fade(t, mid('recycle', 0.72)));
      op(renLab, fade(t, mid('recycle', 0.84)));
    }
  };
});
