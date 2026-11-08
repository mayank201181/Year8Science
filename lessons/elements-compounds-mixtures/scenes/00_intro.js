/* Intro: two dangerous elements on red-bordered cards (sodium fizzing in water, poisonous chlorine gas)
   -> their atoms leave the cards, join, and tile into a salt crystal -> a salt shaker over chips
   -> a magnifier on a grain: alternating atoms -> joined together vs just mixed
   -> roadmap: elements, compounds, mixtures, then four ways to pull mixtures apart. */
scene('intro', S => {
  const { at, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;

  /* ---------- helpers ---------- */
  const EL = { Na: '#B48CFF', Cl: '#6FD96F', N: '#5B8CFF', Fe: '#C27A4A', S: '#FFD84A', Mg: '#9FE3B0', Au: '#FFC94A', Cu: '#E08A4F', Zn: '#A9B8C8', Ar: '#C9B8FF' };
  const shade = (hex, k) => '#' + [1, 3, 5].map(i => Math.round(parseInt(hex.slice(i, i + 2), 16) * k).toString(16).padStart(2, '0')).join('');
  /* an element's atom: a shaded ball with its symbol in white (a dark rim keeps it readable on pale
     colours). With o.x / o.y it draws straight into parent, without a group (cheaper for big grids). */
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
  /* bond lines as in 03_molecules: a short line across the joint of two touching atoms (centres a, b; radii ra, rb).
     Several joints of one molecule go into one path. */
  function bondD(ax, ay, ra, bx, by, rb, len) {
    const dx = bx - ax, dy = by - ay, d = Math.hypot(dx, dy) || 1, ux = dx / d, uy = dy / d;
    const s = (d * d + ra * ra - rb * rb) / (2 * d), L = (len || 0.6) * Math.min(ra, rb);
    return `M${(ax + ux * (s - L / 2)).toFixed(1)},${(ay + uy * (s - L / 2)).toFixed(1)} L${(ax + ux * (s + L / 2)).toFixed(1)},${(ay + uy * (s + L / 2)).toFixed(1)} `;
  }
  const bonds = (parent, d, rmin) => E('path', { d, fill: 'none', stroke: '#F4FAFD', 'stroke-width': Math.max(2.4, 0.2 * rmin).toFixed(1), 'stroke-linecap': 'round', opacity: 0.9 }, parent);
  /* alternating Na / Cl grid centred on (0,0), with short bond sticks between neighbours */
  function saltGrid(parent, cols, rows, r, s, grouped) {
    const g = G(parent), bonds = G(g), atomsG = G(g), list = [], links = [];
    const x0 = -(cols - 1) * s / 2, y0 = -(rows - 1) * s / 2, bw = Math.max(4, r * 0.3);
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
      const x = x0 + i * s, y = y0 + j * s, k = j * cols + i;
      if (i < cols - 1) links.push({ el: E('line', { x1: x, y1: y, x2: x + s, y2: y, stroke: '#CBD8E0', 'stroke-width': bw, 'stroke-linecap': 'round' }, bonds), a: k, b: k + 1 });
      if (j < rows - 1) links.push({ el: E('line', { x1: x, y1: y, x2: x, y2: y + s, stroke: '#CBD8E0', 'stroke-width': bw, 'stroke-linecap': 'round' }, bonds), a: k, b: k + cols });
      const sym = (i + j) % 2 ? 'Cl' : 'Na';
      if (grouped) { const a = elAtom(atomsG, sym, r); tr(a, x, y); list.push({ g: a, x, y, sym }); }
      else elAtom(atomsG, sym, r, { x, y });
    }
    g.bonds = bonds; g.atoms = list; g.links = links;
    return g;
  }
  function dangerCard(parent, cx) {
    const g = G(parent);
    card(g, cx - 175, 146, 350, 446, { fill: C.card, stroke: C.bad, sw: 5, rx: 26 });
    const tag = chip(g, 'DANGER', { size: 26, fill: '#D8394A', color: '#FFFFFF' });
    tr(tag, cx, 146);
    return g;
  }
  function nameChip(parent, name, sym, col) {
    const size = 30, w = textWidth(name + '  ' + sym, size, FD, 700) + 46, h = 54, g = G(parent);
    E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: h / 2, fill: C.card2, stroke: col, 'stroke-width': 3 }, g);
    rich(g, 0, size * 0.35, [[name + '  ', C.ink, 600], [sym, col, 800]], { size, anchor: 'middle' });
    return g;
  }
  /* hazard diamond with a skull and crossbones (toxic), s = side of the square */
  function hazard(parent, s) {
    const g = G(parent);
    E('rect', { x: -s / 2, y: -s / 2, width: s, height: s, rx: s * 0.07, fill: '#FFFFFF', stroke: '#E8424F', 'stroke-width': s * 0.11, transform: 'rotate(45)' }, g);
    const k = G(g); tr(k, 0, 0, s / 100);
    const ink = '#1B1B1B';
    E('path', { d: 'M-26,16 L26,40 M26,16 L-26,40', stroke: ink, 'stroke-width': 8, 'stroke-linecap': 'round' }, k);
    [[-27, 16], [27, 16], [-27, 40], [27, 40]].forEach(([x, y]) => E('circle', { cx: x, cy: y, r: 5.5, fill: ink }, k));
    E('circle', { cx: 0, cy: -14, r: 22, fill: ink }, k);
    E('rect', { x: -12, y: -2, width: 24, height: 16, rx: 4, fill: ink }, k);
    E('circle', { cx: -8.5, cy: -15, r: 6.5, fill: '#FFFFFF' }, k);
    E('circle', { cx: 8.5, cy: -15, r: 6.5, fill: '#FFFFFF' }, k);
    E('path', { d: 'M0,-6 L-3.5,0 L3.5,0 Z', fill: '#FFFFFF' }, k);
    return g;
  }
  /* salt shaker, about 92 x 180, pivot at the middle of its body; holes at (0,-100) */
  function shaker(parent) {
    const g = G(parent);
    E('path', { d: 'M-40,-58 L-46,62 Q-46,74 -34,74 L34,74 Q46,74 46,62 L40,-58 Z', fill: 'rgba(200,230,250,0.14)' }, g);
    E('path', { d: 'M-42.5,-8 L-45,62 Q-45,72 -34,72 L34,72 Q45,72 45,62 L42.5,-8 Z', fill: '#F2F5F8' }, g);
    const sr = rng(5);
    for (let i = 0; i < 12; i++) E('rect', { x: (-34 + sr() * 66).toFixed(1), y: (0 + sr() * 62).toFixed(1), width: 4, height: 4, fill: '#C9D6DE' }, g);
    E('path', { d: 'M-40,-58 L-46,62 Q-46,74 -34,74 L34,74 Q46,74 46,62 L40,-58', fill: 'none', stroke: GLASS.stroke, 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
    E('rect', { x: 26, y: -46, width: 7, height: 104, rx: 3.5, fill: GLASS.shine }, g);
    E('path', { d: 'M-45,-56 L-41,-92 Q-39,-100 -29,-100 L29,-100 Q39,-100 41,-92 L45,-56 Z', fill: linGrad('#E4EBF0', '#8C9AA6'), stroke: '#F2F7FA', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, g);
    E('ellipse', { cx: 0, cy: -100, rx: 29, ry: 6, fill: '#B9C6D2', stroke: '#F2F7FA', 'stroke-width': 2 }, g);
    [-13, 0, 13].forEach(x => E('circle', { cx: x, cy: -100, r: 2.6, fill: '#3B4A57' }, g));
    return g;
  }
  /* a paper cone of chips, cone mouth at y = 0, about 160 wide */
  function chipsCone(parent) {
    const g = G(parent), cr = rng(12);
    for (let i = 0; i < 10; i++) {
      const x = -66 + i * 14.5, h = 48 + cr() * 42, a = (cr() - 0.5) * 36;
      E('rect', { x: -7.5, y: -h, width: 15, height: h + 14, rx: 4, fill: ball('#FFD36B', '#D3962A'), stroke: '#B57F1F', 'stroke-width': 1.5, transform: `translate(${x.toFixed(1)} 4) rotate(${a.toFixed(1)})` }, g);
    }
    E('path', { d: 'M-84,-4 L84,-4 L0,136 Z', fill: '#F4F7FA', stroke: '#C9D6DE', 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
    E('path', { d: 'M-52,-4 L-14,113 M-18,-4 L-4,121 M18,-4 L4,121 M52,-4 L14,113', stroke: '#E8424F', 'stroke-width': 7, opacity: 0.85 }, g);
    E('path', { d: 'M-84,-4 L84,-4', stroke: '#C9D6DE', 'stroke-width': 5, 'stroke-linecap': 'round' }, g);
    return g;
  }

  /* ================= A. the two danger cards ================= */
  const cardL = dangerCard(root, 250), cardR = dangerCard(root, 950);
  // sodium: a lump on a white tile, then dropped into water
  const tile = E('rect', { x: 192, y: 238, width: 116, height: 16, rx: 5, fill: '#5C6E7B', stroke: '#8FA3B1', 'stroke-width': 2 }, cardL);
  const bk = beaker(cardL, 190, 200, { level: 0.52 }); tr(bk, 250, 410);
  const SURF = 415;                                             // world y of the water surface
  const fizz = G(cardL);
  const fizzB = bubbles(fizz, -30, -40, 60, 48, { n: 9, r: 5, seed: 4, speed: 1.1 });
  const halo = E('circle', { r: 95, fill: glow('#FFB347') }, cardL);
  const flash = spark(cardL, 36, { seed: 3, color: '#FFD45C' });
  const lumpG = G(cardL), lumpIn = G(lumpG); tr(lumpIn, 0, 0, 1.35);
  E('path', { d: 'M-21,-3 C-23,-14 -9,-18 1,-16 C12,-18 23,-12 22,-2 C25,8 12,14 0,13 C-12,15 -23,8 -21,-3 Z', fill: linGrad('#E8EEF2', '#7F8E9A', true), stroke: '#C9D3DA', 'stroke-width': 1.6, 'stroke-linejoin': 'round' }, lumpIn);
  E('path', { d: 'M-12,-8 Q-2,-13 9,-9', stroke: '#FFFFFF', 'stroke-width': 3, fill: 'none', 'stroke-linecap': 'round', opacity: 0.85 }, lumpIn);
  const drops = [0, 1, 2, 3].map(() => E('circle', { r: 5, fill: C.water, opacity: 0.9 }, cardL));
  // chlorine: a stoppered flask of pale green gas, with a toxic hazard diamond
  const FLASK = 'M-17,-95 L-17,-38 L-76,78 Q-80,92 -66,92 L66,92 Q80,92 76,78 L17,-38 L17,-95 Z';
  const fl = flask(cardR, 1.15, { level: 0 }); tr(fl, 950, 400);
  const flIn = fl.firstChild;
  const gas = E('path', { d: FLASK, fill: '#D8F77E', opacity: 0.5 }, null);
  flIn.insertBefore(gas, flIn.childNodes[1]);
  const gcp = E('clipPath', { id: 'ecm-intro-gas' }, defs()); E('path', { d: FLASK }, gcp);
  const swirlG = G(null, { 'clip-path': 'url(#ecm-intro-gas)' }); flIn.insertBefore(swirlG, flIn.childNodes[2]);
  const swirls = [[-20, 40, 28], [22, 58, 22], [0, -2, 16]].map(([x, y, r]) => ({ el: E('path', { d: `M${-r},0 A${r},${r} 0 1 1 ${r * 0.2},${r * 0.95}`, fill: 'none', stroke: '#EFFFC2', 'stroke-width': 4, 'stroke-linecap': 'round', opacity: 0.55 }, swirlG), x, y }));
  E('path', { d: 'M-21,-112 L21,-112 L18,-86 L-18,-86 Z', fill: '#5E6B76', stroke: '#8FA0AD', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, flIn);
  const hz = hazard(cardR, 66); tr(hz, 1062, 236);
  const nameNa = nameChip(cardL, 'sodium', 'Na', EL.Na); tr(nameNa, 250, 548);
  const nameCl = nameChip(cardR, 'chlorine', 'Cl', EL.Cl); tr(nameCl, 950, 548);

  /* ================= B. the atoms join and tile into salt ================= */
  const CRY = [600, 380], CR = 21, CS = 50;
  const crystal = G(root);
  const cryG = saltGrid(crystal, 4, 4, CR, CS, true);
  const cryPair = [cryG.atoms[5], cryG.atoms[6]];             // (1,1) Na and (2,1) Cl: where the pair lands
  cryG.atoms.forEach(a => { a.d = Math.hypot(a.x - (cryPair[0].x + cryPair[1].x) / 2, a.y - cryPair[0].y) / CS; });
  const saltChip = chip(root, 'table salt', { size: 30, fill: C.card2, stroke: '#E9EFF3', sw: 2.5 }); tr(saltChip, 600, 540);
  const pairG = G(root);
  const bondNaCl = E('line', { x1: -33, y1: 0, x2: 33, y2: 0, stroke: '#CBD8E0', 'stroke-width': 9, 'stroke-linecap': 'round' }, pairG);
  const naA = elAtom(root, 'Na', 30), clA = elAtom(root, 'Cl', 30);
  const snap = spark(root, 26, { seed: 6 });

  /* ================= C. shaker and chips ================= */
  const shake = G(root);
  const shG = shaker(shake);
  const PIV = [588, 300], TILT = 140;
  const CHIPS = [660, 548];
  const chipsG = G(root); chipsCone(chipsG); tr(chipsG, CHIPS[0], CHIPS[1]);
  const grains = [], gr = rng(33);
  for (let i = 0; i < 16; i++) grains.push({ el: E('rect', { x: -3.2, y: -3.2, width: 6.4, height: 6.4, fill: '#FFFFFF' }, root), ph: gr(), dx: (gr() - 0.5) * 34, rot: gr() * 90 });
  const specks = G(chipsG);
  for (let i = 0; i < 12; i++) E('rect', { x: (-60 + gr() * 120).toFixed(1), y: (-70 + gr() * 50).toFixed(1), width: 5, height: 5, fill: '#FFFFFF', transform: `rotate(${(gr() * 90).toFixed(0)})` }, specks);

  /* ================= D. magnifier on a grain ================= */
  const MAG = [600, 380], MR = 205;
  const mag = G(root);
  E('circle', { r: MR, fill: '#0C2533' }, mag);
  const mcp = E('clipPath', { id: 'ecm-intro-mag' }, defs()); E('circle', { r: MR - 4 }, mcp);
  const magIn = G(mag, { 'clip-path': 'url(#ecm-intro-mag)' });
  saltGrid(magIn, 6, 6, 30, 76, false);
  E('line', { x1: MR * 0.72, y1: MR * 0.72, x2: MR * 1.18, y2: MR * 1.18, stroke: '#8FA3B1', 'stroke-width': 30, 'stroke-linecap': 'round' }, mag);
  E('line', { x1: MR * 0.74, y1: MR * 0.74, x2: MR * 1.16, y2: MR * 1.16, stroke: '#C9D6DE', 'stroke-width': 16, 'stroke-linecap': 'round' }, mag);
  E('circle', { r: MR, fill: 'none', stroke: '#E4EDF2', 'stroke-width': 12 }, mag);
  E('path', { d: `M${-MR * 0.62},${-MR * 0.42} A${MR * 0.75},${MR * 0.75} 0 0 1 ${-MR * 0.2},${-MR * 0.72}`, stroke: '#FFFFFF', 'stroke-width': 7, fill: 'none', opacity: 0.35, 'stroke-linecap': 'round' }, mag);
  const atomsLbl = T(root, 600, 660, 'atoms', { size: 44, weight: 700, anchor: 'middle', fill: C.energy });

  /* ================= E. joined together vs just mixed ================= */
  const split = G(root);
  E('line', { x1: 600, y1: 176, x2: 600, y2: 620, stroke: C.line, 'stroke-width': 3, 'stroke-dasharray': '10 10' }, split);
  const hdJ = T(split, 320, 214, 'joined together', { size: 42, weight: 700, anchor: 'middle', fill: C.ink });
  const hdM = T(split, 880, 214, 'just mixed', { size: 42, weight: 700, anchor: 'middle', fill: C.ink });
  const joinG = G(split); tr(joinG, 320, 420);
  const joined = saltGrid(joinG, 4, 3, 26, 66, false);
  const mixG = G(split), mixed = [];
  {
    const mr = rng(91), pts = [];
    for (let tries = 0; pts.length < 12 && tries < 4000; tries++) {
      const x = 680 + mr() * 400, y = 290 + mr() * 270;
      if (pts.every(p => Math.hypot(p[0] - x, p[1] - y) > 96)) pts.push([x, y]);
    }
    pts.forEach((p, i) => { const a = elAtom(mixG, i % 2 ? 'Cl' : 'Na', 26); mixed.push({ g: a, x: p[0], y: p[1], ph: mr() * TAU, ph2: mr() * TAU, d: mr() * 0.5 }); });
  }

  /* ================= F. roadmap ================= */
  const road = G(root);
  const tiny = (g, x, y) => { const a = G(g); tr(a, x, y); a.bx = x; a.by = y; return a; };
  const stops = [
    { x: 250, text: 'elements', col: EL.Au, draw: g => { [[-34, -14], [0, -14], [34, -14], [-17, 16], [17, 16], [51, 16]].forEach(([x, y]) => elAtom(g, 'Au', 16, { x: x - 8, y, letter: false })); } },
    { x: 600, text: 'compounds', col: C.water, draw: g => { [[-52, 4, -10], [6, -16, 8], [52, 14, 18]].forEach(([x, y, r]) => { const m = molH2O(g, 15); bonds(m, bondD(0, 0, 15, -14.7, 10.8, 9.3, 0.5) + bondD(0, 0, 15, 14.7, 10.8, 9.3, 0.5), 9.3); tr(m, x, y, 1, r); }); } },
    { x: 950, text: 'mixtures', col: C.plant, draw: g => {
      const ps = [], n2 = p => { elAtom(p, 'N', 11, { x: -9, y: 0, letter: false }); elAtom(p, 'N', 11, { x: 9, y: 0, letter: false }); bonds(p, bondD(-9, 0, 11, 9, 0, 11), 11); };
      const o2 = p => { tr(molO2(p, 12), 0, 0); bonds(p, bondD(-8.64, 0, 12, 8.64, 0, 12), 12); };
      ps.push(tiny(g, -52, -18)); n2(ps[0]);
      ps.push(tiny(g, 28, -26)); o2(ps[1]);
      ps.push(tiny(g, -12, 22)); o2(ps[2]);
      ps.push(tiny(g, 54, 18)); n2(ps[3]);
      ps.push(tiny(g, -66, 26)); elAtom(ps[4], 'Ar', 12, { x: 0, y: 0, letter: false });
      return ps;
    } },
  ].map(st => {
    const g = G(road);
    card(g, -150, -120, 300, 236, { fill: C.card, stroke: C.line });
    const art = G(g); tr(art, 0, -34, 1.3);
    const parts = st.draw(art) || [];
    const c = chip(g, st.text, { size: 32, fill: C.card2, stroke: st.col, sw: 3 }); tr(c, 0, 66);
    return { g, x: st.x, parts };
  });
  const sepChip = T(road, 600, 486, 'then: pulling mixtures apart', { size: 30, weight: 600, anchor: 'middle', fill: C.muted });
  function iconFilter(g) {
    const f = flask(g, 0.42, { level: 0.22 }); tr(f, 0, 30);
    const fu = G(g); tr(fu, 0, -25, 0.75);                    // 07_filter's funnel icon: glass cone, filter paper, sand
    E('path', { d: 'M-48,-44 L-6,10 L-6,46 L6,52 L6,10 L48,-44 Z', fill: 'rgba(200,230,250,0.14)', stroke: GLASS.stroke, 'stroke-width': 4, 'stroke-linejoin': 'round' }, fu);
    E('path', { d: 'M-40,-40 L0,6 L40,-40 Z', fill: '#F4F7FA', stroke: '#C9D3DC', 'stroke-width': 2, 'stroke-linejoin': 'round' }, fu);
    E('path', { d: 'M-16,-12 Q0,-22 16,-12 L0,6 Z', fill: '#D9B77E' }, fu);
  }
  /* Liebig condenser (08_distil's look): glass tube in a pale-blue water jacket; cold water in at the lower end, out at the top */
  function iconCondenser(g) {
    const c = G(g); tr(c, 0, 0, 1, 28);
    const arms = 'M-26,-13 L-26,-27 M26,13 L26,27';
    E('path', { d: arms, stroke: GLASS.stroke, 'stroke-width': 8, 'stroke-linecap': 'round' }, c);
    E('path', { d: arms, stroke: '#1D5D78', 'stroke-width': 3.5, 'stroke-linecap': 'round' }, c);
    E('rect', { x: -44, y: -15, width: 88, height: 30, rx: 12, fill: 'rgba(76,201,240,0.34)', stroke: GLASS.stroke, 'stroke-width': 3 }, c);
    E('line', { x1: -66, y1: 0, x2: 66, y2: 0, stroke: GLASS.stroke, 'stroke-width': 10, 'stroke-linecap': 'round' }, c);
    E('line', { x1: -66, y1: 0, x2: 66, y2: 0, stroke: '#123848', 'stroke-width': 4, 'stroke-linecap': 'round' }, c);
    arrow(c, 40, 46, 28, 32, { color: C.water, width: 4, head: 11 });
    arrow(c, -28, -32, -40, -46, { color: C.water, width: 4, head: 11 });
  }
  /* chromatography strip (08_distil's look): the black ink has split into yellow, pink and blue, top to bottom */
  function iconChroma(g) {
    const b = beaker(g, 80, 96, { level: 0.2, marks: false }); tr(b, 0, 14);
    E('line', { x1: -46, y1: -40, x2: 46, y2: -40, stroke: '#8C9AA6', 'stroke-width': 5, 'stroke-linecap': 'round' }, g);
    E('rect', { x: -14, y: -40, width: 28, height: 92, fill: '#F6F3EC', stroke: '#D8D2C4', 'stroke-width': 1.5 }, g);
    E('line', { x1: -12, y1: 34, x2: 12, y2: 34, stroke: '#8A949C', 'stroke-width': 2 }, g);
    [['#3F7BFF', 22], ['#FF4FA0', 4], ['#FFD23F', -18]].forEach(([c, y]) => E('ellipse', { cx: 0, cy: y, rx: 7, ry: 5, fill: c }, g));
  }
  function iconMagnet(g) {
    const ir = rng(8);
    for (let i = 0; i < 11; i++) {
      const side = i % 2 ? 1 : -1, x = side * (30 + ir() * 22), len = 10 + ir() * 8;
      E('rect', { x: -2, y: 0, width: 4, height: len, rx: 2, fill: '#B4BEC6', transform: `translate(${x.toFixed(1)} ${(5 + ir() * 3).toFixed(1)}) rotate(${((ir() - 0.5) * 50).toFixed(0)})` }, g);
    }
    const m = magnet(g, 120, 36); tr(m, 0, -14);
  }
  const icons = [[iconFilter, 'filtration'], [iconCondenser, 'distillation'], [iconChroma, 'chromatography'], [iconMagnet, 'magnets']].map(([fn, label], i) => {
    const g = G(road);
    E('circle', { r: 64, fill: C.card, stroke: C.line, 'stroke-width': 2 }, g);
    const art = G(g); fn(art);
    T(g, 0, 104, label, { size: 26, weight: 600, anchor: 'middle', fill: C.ink });
    return { g, x: 285 + i * 210 };
  });

  /* ================= update ================= */
  return t => {
    const tSalt = at('salt'), tHow = at('how'), tPlan = at('plan');

    /* --- A. danger cards --- */
    const cardFade = 1 - 0.62 * P(t, mid('salt', 0.5), 0.6, linear);
    const cardsOut = 1 - P(t, tHow - 0.1, 0.5, linear);
    [[cardL, mid('hook', 0.02), 250], [cardR, mid('hook', 0.08), 950]].forEach(([g, t0, cx]) => {
      const p = P(t, t0, 0.6, pop);
      op(g, clamp(p * 2) * cardFade * cardsOut);
      g.setAttribute('transform', `translate(${cx} 370) scale(${(0.86 + 0.14 * p).toFixed(4)}) translate(${-cx} -370)`);
    });
    if (cardsOut > 0) {
      // sodium lump: rests on the tile, hops into the water, then darts about on the surface, fizzing
      const tHop = mid('hook', 0.27), tLand = tHop + 0.55;
      let lx = 250, ly = 220, lr = 0;
      if (t >= tHop && t < tLand) { const u = (t - tHop) / 0.55; lx = 250 + 12 * Math.sin(u * Math.PI); ly = lerp(220, SURF - 6, u * u); lr = u * 50; }
      else if (t >= tLand) {
        const k = clamp((t - tLand) / 0.6) * calm;
        lx = 250 + k * (46 * Math.sin((t - tLand) * 2.1) + 10 * Math.sin((t - tLand) * 5.3));
        ly = SURF - 6 + 2 * Math.sin(t * 9) * calm; lr = 50 + k * 25 * Math.sin((t - tLand) * 1.7);
      }
      const shrink = 1 - 0.18 * P(t, tLand, 9, linear);
      tr(lumpG, lx, ly, shrink, lr);
      op(tile, 1 - P(t, tLand + 0.4, 0.5, linear));
      const fz = P(t, tLand, 0.4, linear);
      op(fizz, fz); tr(fizz, lx, ly); fizzB.upd(t, fz);
      drops.forEach((d, i) => {
        const u = (t - tLand) / 0.55;
        if (u <= 0 || u >= 1) { op(d, 0); return; }
        const a = -Math.PI / 2 + (i - 1.5) * 0.55;
        attr(d, 'cx', 250 + Math.cos(a) * 60 * u); attr(d, 'cy', SURF - 4 + Math.sin(a) * 70 * u + 120 * u * u);
        op(d, 1 - u);
      });
      const tFl = mid('hook', 0.46), fp = clamp((t - tFl) / 1.1);
      const fa = fp > 0 && fp < 1 ? Math.sin(fp * Math.PI) : 0;
      op(flash, fa); op(halo, fa * 0.95 + (t > tFl ? 0.25 * fz * (0.6 + 0.4 * wave(t, 0.7)) : 0));
      tr(flash, lx, ly - 10, 0.5 + 1.1 * fa); flash.upd(t); tr(halo, lx, ly - 6, 0.6 + 0.6 * fa);
      // chlorine: swirling gas, hazard diamond at "poisonous"
      swirls.forEach((s, i) => tr(s.el, s.x + 6 * Math.sin(t * 0.7 + i) * calm, s.y + 4 * Math.cos(t * 0.6 + i * 2) * calm, 1, (t * (30 + i * 12) * calm + i * 120) % 360));
      const gp = P(t, mid('hook', 0.6), 0.8, linear);
      gas.setAttribute('opacity', (0.42 + 0.14 * gp * wave(t, 1.6)).toFixed(3));
      const hp = P(t, mid('hook', 0.66), 0.5, pop), hw = 0.06 * Math.sin(Math.PI * P(t, mid('hook', 0.84), 0.5, linear));
      op(hz, clamp(hp * 2)); tr(hz, 1062, 236, Math.max(0.01, hp + hw), (1 - clamp(hp)) * -30);
      // names
      [[nameNa, mid('salt', 0.04), 250], [nameCl, mid('salt', 0.15), 950]].forEach(([g, t0, x]) => { const p = P(t, t0, 0.5, pop); op(g, clamp(p * 2)); tr(g, x, 548 + (1 - clamp(p)) * 14, 0.8 + 0.2 * p); });
    }

    /* --- B. one Na and one Cl leave the cards, join, and grow into a crystal --- */
    const tGo = mid('salt', 0.3), tMeet = mid('salt', 0.46), tGrid = mid('salt', 0.5);
    const cryOut = P(t, mid('salt', 0.74), 0.5, ease);
    const flyAt = (x0, y0, cx, cy, x1, y1, u) => { const q = 1 - u; return [q * q * x0 + 2 * q * u * cx + u * u * x1, q * q * y0 + 2 * q * u * cy + u * u * y1]; };
    if (t < tGo - 0.05 || t > tGrid + 0.75) { op(naA, 0); op(clA, 0); op(pairG, 0); }
    else {
      const u = ease(clamp((t - tGo) / (tMeet - tGo)));
      const appear = P(t, tGo - 0.05, 0.35, pop);
      const g2 = P(t, tGrid, 0.5);                              // move onto the crystal's grid and shrink
      const lumpX = 250 + 46 * Math.sin((tGo - mid('hook', 0.27) - 0.55) * 2.1) * calm;
      let [nx, ny] = flyAt(lumpX, SURF - 10, 400, 150, 567, 380, u);
      let [cx, cy] = flyAt(950, 270, 800, 150, 633, 380, u);
      const pz = [CRY[0] + cryPair[0].x, CRY[1] + cryPair[0].y], pc = [CRY[0] + cryPair[1].x, CRY[1] + cryPair[1].y];
      nx = lerp(nx, pz[0], g2); ny = lerp(ny, pz[1], g2); cx = lerp(cx, pc[0], g2); cy = lerp(cy, pc[1], g2);
      const s = lerp(1, CR / 30, g2) * Math.max(0.01, appear);
      tr(naA, nx, ny, s); tr(clA, cx, cy, s);
      const hide = t > tGrid + 0.55 ? 0 : 1;
      op(naA, clamp(appear * 2) * hide); op(clA, clamp(appear * 2) * hide);
      const bp = P(t, tMeet - 0.05, 0.25, linear) * hide;
      op(pairG, bp); tr(pairG, (nx + cx) / 2, (ny + cy) / 2, lerp(1, CR / 30, g2));
    }
    const sp = clamp((t - tMeet + 0.05) / 0.7);
    op(snap, sp > 0 && sp < 1 ? Math.sin(sp * Math.PI) : 0); tr(snap, 600, 380, 0.6 + 0.9 * Math.sin(sp * Math.PI)); snap.upd(t);
    const cryVis = (t >= tGrid + 0.5 ? 1 : 0) * (1 - P(t, mid('salt', 0.79), 0.3, linear));
    op(crystal, cryVis);
    if (cryVis > 0) {
      tr(crystal, lerp(CRY[0], PIV[0], cryOut), lerp(CRY[1], PIV[1] + 32, cryOut), lerp(1, 0.2, cryOut));
      const shown = cryG.atoms.map((a, i) => (i === 5 || i === 6) ? 1 : P(t, tGrid + 0.45 + a.d * 0.42, 0.45, pop));
      cryG.atoms.forEach((a, i) => { const p = shown[i]; tr(a.g, a.x, a.y, Math.max(0.01, p)); op(a.g, clamp(p * 2)); });
      cryG.links.forEach(l => op(l.el, clamp(Math.min(shown[l.a], shown[l.b]) * 1.6)));
    }
    const scp = P(t, mid('salt', 0.6), 0.5, pop);
    op(saltChip, clamp(scp * 2) * (1 - P(t, mid('salt', 0.74), 0.35, linear))); tr(saltChip, 600, 540 + (1 - clamp(scp)) * 14);

    /* --- C. shaker sprinkles salt on chips --- */
    const tShk = mid('salt', 0.79), tTilt = mid('salt', 0.86);
    const shIn = P(t, tShk, 0.45, pop), chIn = P(t, tShk + 0.15, 0.5, pop);
    const shOut = 1 - P(t, mid('how', 0.03), 0.4, linear);
    op(shake, clamp(shIn * 2) * shOut); op(chipsG, clamp(chIn * 2) * shOut);
    const tiltP = P(t, tTilt, 0.5);
    const wob = t > tTilt + 0.5 ? 9 * Math.sin((t - tTilt) * 13) * calm : 0;
    const ang = TILT * tiltP + wob;
    tr(shake, PIV[0], PIV[1], 0.7 + 0.3 * clamp(shIn), ang);
    tr(chipsG, CHIPS[0], CHIPS[1], Math.max(0.01, 0.7 + 0.3 * chIn));
    const rad = ang * Math.PI / 180, hx = PIV[0] + 100 * Math.sin(rad), hy = PIV[1] - 100 * Math.cos(rad);
    const tPour = tTilt + 0.4;
    grains.forEach(g => {
      const u = ((t - tPour) / 0.75 + g.ph) % 1;
      if (t < tPour || shOut <= 0) { op(g.el, 0); return; }
      const x = hx + g.dx * u, y = hy + 8 + u * u * (486 - hy);
      g.el.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(g.rot + u * 200).toFixed(0)})`);
      op(g.el, Math.min(1, u * 8, (1 - u) * 6) * shOut);
    });
    op(specks, P(t, tPour + 0.4, 1.2, linear));

    /* --- D. magnifier: zoom into a grain --- */
    const tMag = mid('how', 0.05);
    const mz = P(t, tMag, 1.2, ease), mOut = 1 - P(t, mid('how', 0.5), 0.45, linear);
    op(mag, (t > tMag ? clamp(mz * 3) : 0) * mOut);
    if (mz > 0 && mOut > 0) tr(mag, lerp(655, MAG[0], mz), lerp(486, MAG[1], mz), Math.max(0.01, lerp(0.04, 1, mz) * (1 - 0.06 * (1 - mOut))));
    op(atomsLbl, P(t, mid('how', 0.33), 0.5, linear) * mOut);

    /* --- E. joined vs mixed --- */
    const sa = win(t, mid('how', 0.5), tPlan + 0.05, 0.4);
    op(split, sa);
    if (sa > 0) {
      op(hdJ, P(t, mid('how', 0.56), 0.4, linear)); op(hdM, P(t, mid('how', 0.84), 0.4, linear));
      const jp = P(t, mid('how', 0.52), 0.6, easeOut);
      tr(joined, 0, 0, 0.9 + 0.1 * jp);
      op(joined.bonds, 0.75 + 0.25 * wave(t, 1.4));
      const mp = P(t, mid('how', 0.72), 0.7, easeOut);
      mixed.forEach(m => {
        const p = P(t, mid('how', 0.7) + m.d * 0.5, 0.5, pop);
        tr(m.g, m.x + 12 * Math.sin(t * 0.8 + m.ph) * calm, m.y + 10 * Math.cos(t * 0.7 + m.ph2) * calm, Math.max(0.01, p));
        op(m.g, clamp(p * 2) * mp);
      });
    }

    /* --- F. roadmap --- */
    const ra = P(t, tPlan - 0.05, 0.3, linear);
    op(road, ra);
    if (ra > 0) {
      const showAt = [tPlan - 0.05, mid('plan', 0.25), mid('plan', 0.42)];
      stops.forEach((st, i) => {
        const p = P(t, showAt[i], 0.6, pop);
        op(st.g, clamp(p * 2)); tr(st.g, st.x, 286 + (1 - clamp(p)) * 34, 0.9 + 0.1 * clamp(p));
        st.parts.forEach((q, k) => tr(q, q.bx + 5 * Math.sin(t * 0.9 + k * 1.7) * calm, q.by + 4 * Math.cos(t * 0.8 + k) * calm));
      });
      op(sepChip, P(t, mid('plan', 0.56), 0.5, linear));
      icons.forEach((ic, i) => { const p = P(t, mid('plan', 0.6 + i * 0.08), 0.5, pop); op(ic.g, clamp(p * 2)); tr(ic.g, ic.x, 580 + (1 - clamp(p)) * 24, 0.85 + 0.15 * p); });
    }
  };
});
