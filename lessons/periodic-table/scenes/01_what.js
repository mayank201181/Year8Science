/* Chapter 1, What the periodic table is.
   A phone, water, air and you dissolve into atoms that fly into a ghost table -> a gold bar under a
   magnifier is all gold atoms; a hammer and a flame can't break it down -> gold, oxygen, carbon,
   118 elements -> the empty table and an atomic-number counter -> tiles fill 1, 2, 3 ... -> sodium's
   box, labelled -> tellurium and iodine swapped by mass land in the wrong families -> one column glows. */
scene('what', S => {
  const { at, end, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;
  const GX = 64, GY = 236;                       // the table's top-left corner on the stage

  /* ================= the table (shared by several beats) ================= */
  const gridG = G(root);
  const outline = E('path', { fill: 'rgba(27,68,87,0.28)', stroke: C.faint, 'stroke-width': 2, 'stroke-dasharray': '6 5' }, gridG);
  const grid = ptGrid(gridG, {});
  { let d = ''; for (let z = 1; z <= 118; z++) { const el = ptElement(z); if (!el.col) continue; const [x, y] = grid.xy(z); d += `M${x - 28},${y - 28}h56v56h-56Z`; } outline.setAttribute('d', d); }
  gridG.insertBefore(outline, gridG.firstChild);

  /* ================= A. everything is made of elements ================= */
  const A = G(root);
  const AT = { H: [C.hydrogen, C.hydrogenDk], O: [C.oxygen, C.oxygenDk], C: [C.carbon, C.carbonDk], N: ['#7C95FF', '#3B55B8'], Si: ['#8FA8C8', '#4E6684'],
    Cu: ['#E08A4E', '#9A4E1E'], Li: ['#D8DEE4', '#8A96A1'], Au: [C.glucose, C.glucoseDk], Al: ['#C3CDD6', '#7D8A96'], Ar: [C.ethanol, C.ethanolDk],
    Ca: ['#EDE6CC', '#A89F7E'], P: ['#FF9F43', '#B8620F'], Fe: ['#C07A5C', '#6E3E2B'] };
  const SM = 0.5, SX = 330, SY = 118;            // the ghost table, small, across the top
  const cellG = G(gridG), cells = {};
  Object.keys(AT).forEach(sym => { const z = PT_SYM.indexOf(sym) + 1, [x, y] = grid.xy(z); cells[sym] = E('rect', { x: x - 28, y: y - 28, width: 56, height: 56, rx: 7, fill: AT[sym][0] }, cellG); op(cells[sym], 0); });
  const objs = [
    { x: 205, y: 520, label: 'your phone', atoms: ['Si', 'Cu', 'Li', 'Au', 'Al', 'Si', 'Cu', 'Li'], draw: g => {
      E('rect', { x: -44, y: -80, width: 88, height: 160, rx: 16, fill: '#1E2A36', stroke: '#8FA9BD', 'stroke-width': 4 }, g);
      E('rect', { x: -35, y: -64, width: 70, height: 122, rx: 6, fill: linGrad('#4CC9F0', '#5B6FEF', true) }, g);
      E('rect', { x: -14, y: 66, width: 28, height: 5, rx: 2.5, fill: '#8FA9BD' }, g);
      E('circle', { cx: 0, cy: -72, r: 3, fill: '#8FA9BD' }, g);
    } },
    { x: 455, y: 525, label: 'water', atoms: ['H', 'H', 'O', 'H', 'O', 'H', 'H', 'O'], draw: g => {
      const body = 'M-52,-72 L-40,72 Q-39,80 -30,80 L30,80 Q39,80 40,72 L52,-72 Z';
      E('path', { d: body, fill: 'rgba(200,230,250,0.10)' }, g);
      E('path', { d: 'M-46,-20 L-40,72 Q-39,80 -30,80 L30,80 Q39,80 40,72 L46,-20 Z', fill: C.water, opacity: 0.62 }, g);
      E('path', { d: body.replace(' Z', ''), fill: 'none', stroke: '#CFE7F5', 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
      E('rect', { x: 28, y: -54, width: 7, height: 110, rx: 3.5, fill: 'rgba(255,255,255,0.28)', transform: 'rotate(4)' }, g);
    } },
    { x: 720, y: 515, label: 'air', atoms: ['N', 'N', 'O', 'N', 'O', 'N', 'Ar', 'N'], draw: g => {
      [[-60, -40], [-20, 10], [-70, 54]].forEach(([x, y], i) => E('path', { d: `M${x},${y} q40,-24 80,0 t80,0 q22,-14 0,-28`, fill: 'none', stroke: C.air, 'stroke-width': 5, 'stroke-linecap': 'round', opacity: 0.7 - i * 0.12 }, g));
      tr(molO2(g, 13), -40, -64); tr(molO2(g, 13), 58, 30);
      const n2 = (x, y) => { const m = G(g); tr(m, x, y); [-9.4, 9.4].forEach(dx => E('circle', { cx: dx, cy: 0, r: 13, fill: ball('#7C95FF', '#3B55B8'), stroke: '#3B55B8', 'stroke-width': 1.5 }, m)); };
      n2(52, -52); n2(-30, 36);
    } },
    { x: 975, y: 600, label: 'your body', atoms: ['C', 'H', 'O', 'N', 'C', 'Ca', 'P', 'Fe'], draw: g => {
      const p = person(g, { shirt: '#FF8A3D', shorts: '#5B6F8A' }); tr(p, 0, 0, 0.72);
    } },
  ];
  const fly = [];
  const ar = rng(12);
  objs.forEach((o, i) => {
    o.g = G(A); tr(o.g, o.x, o.y); o.art = G(o.g); tr(o.art, 0, 0, 1.15); o.draw(o.art);
    o.lab = T(A, o.x, 668, o.label, { size: 28, weight: 600, anchor: 'middle', fill: C.muted });
    o.atoms.forEach((sym, k) => {
      const [cx, cy] = grid.xy(PT_SYM.indexOf(sym) + 1);
      fly.push({ el: E('circle', { r: 11, fill: ball(AT[sym][0], AT[sym][1]), stroke: AT[sym][1], 'stroke-width': 1.5 }, A), sym, i, k,
        x0: o.x + (ar() - 0.5) * 80, y0: (i === 3 ? o.y - 70 : o.y) + (ar() - 0.5) * 90, x1: SX + cx * SM, y1: SY + cy * SM, bend: 60 + ar() * 90 });
    });
  });

  /* ================= B. an element: one kind of atom ================= */
  const B = G(root);
  const bWord = T(B, 600, 168, 'element', { size: 64, weight: 700, anchor: 'middle', fill: C.energy });
  const bMean = T(B, 600, 218, 'a pure substance made of **only one kind of atom**', { size: 32, weight: 500, anchor: 'middle', boldFill: C.energy });
  // gold bar
  const barG = G(B); tr(barG, 300, 440);
  const bar = G(barG);
  E('ellipse', { cx: 0, cy: 50, rx: 150, ry: 12, fill: '#000', opacity: 0.35 }, bar);
  E('path', { d: 'M-108,-52 L108,-52 L134,-22 L-134,-22 Z', fill: ball('#FFE29A', '#E0A526'), stroke: '#B57B12', 'stroke-width': 3, 'stroke-linejoin': 'round' }, bar);
  E('path', { d: 'M-134,-22 L134,-22 L156,46 L-156,46 Z', fill: linGrad('#FFC247', '#B57B12', true), stroke: '#8C5C0A', 'stroke-width': 3, 'stroke-linejoin': 'round' }, bar);
  E('path', { d: 'M-60,-22 L-30,-22 L-62,46 L-92,46 Z', fill: '#FFF4D6', opacity: 0.35 }, bar);
  T(bar, 30, 22, 'Au', { size: 30, weight: 700, anchor: 'middle', fill: '#8C5C0A' });
  const heatGlow = E('ellipse', { cx: 0, cy: 10, rx: 170, ry: 80, fill: glow('#FF8A3D') }, barG);
  barG.insertBefore(heatGlow, bar);
  const barLab = T(B, 262, 350, 'a gold bar', { size: 30, weight: 600, anchor: 'middle', fill: C.glucoseLt });
  // magnifier: the bar is made of gold atoms, all the same
  const LX = 840, LY = 420, LR = 160;
  const lens = E('circle', { cx: 330, cy: 452, r: 28, fill: 'rgba(159,216,255,0.12)', stroke: '#E4EDF2', 'stroke-width': 4 }, B);
  const cone = E('path', { d: `M330,424 L${LX},${LY - LR} M330,480 L${LX},${LY + LR}`, stroke: '#E4EDF2', 'stroke-width': 2.5, opacity: 0.35, fill: 'none' }, B);
  const magG = G(B); tr(magG, LX, LY);
  const clipId = 'whatLens' + Math.random().toString(36).slice(2, 7);
  E('circle', { r: LR - 4 }, E('clipPath', { id: clipId }, defs()));
  E('circle', { r: LR, fill: '#0E2230' }, magG);
  const latG = G(magG, { 'clip-path': `url(#${clipId})` });
  const lat = [];
  for (let row = -3; row <= 3; row++) for (let col = -3; col <= 3; col++) {
    const x = col * 60 + (row % 2 ? 30 : 0), y = row * 52;
    if (Math.hypot(x, y) > LR + 20) continue;
    const g = G(latG); tr(g, x, y);
    E('circle', { r: 28, fill: ball(C.glucose, C.glucoseDk), stroke: C.glucoseDk, 'stroke-width': 2 }, g);
    T(g, 0, 9, 'Au', { size: 24, weight: 700, anchor: 'middle', fill: '#6B4A06' });
    lat.push({ g, x, y, ph: (row * 7 + col * 3) * 0.7 });
  }
  E('circle', { r: LR, fill: 'none', stroke: '#E4EDF2', 'stroke-width': 9 }, magG);
  const latLab = T(B, LX, LY + LR + 46, 'every atom is a **gold** atom', { size: 28, weight: 500, anchor: 'middle', boldFill: C.glucose });
  // hammer (origin at the grip) and flame
  const hammer = G(B);
  E('rect', { x: -168, y: -8, width: 168, height: 16, rx: 7, fill: ball('#C98A4E', '#7A4A22'), stroke: '#5E3818', 'stroke-width': 2 }, hammer);
  E('rect', { x: -190, y: -34, width: 40, height: 82, rx: 6, fill: linGrad('#D5DEE6', '#6F7C88'), stroke: '#4E5A66', 'stroke-width': 2.5 }, hammer);
  const bang = G(B);
  for (let i = 0; i < 6; i++) { const a = -Math.PI * (0.12 + i * 0.152); E('line', { x1: Math.cos(a) * 26, y1: Math.sin(a) * 26, x2: Math.cos(a) * 52, y2: Math.sin(a) * 52, stroke: C.energy, 'stroke-width': 5, 'stroke-linecap': 'round' }, bang); }
  const burner = bunsen(B, 0.72); tr(burner, 300, 660);
  const noBreak = G(B);
  const NB = "can't be broken down into anything simpler";
  const nbChip = chip(noBreak, NB, { size: 28, fill: 'rgba(255,96,112,0.14)', stroke: C.bad, sw: 2.5, w: Math.ceil(textWidth(NB, 28, FD, 700)) + 96 });
  tr(nbChip.label, 20, 0);                       // room for the cross inside the pill
  const nbX = cross(noBreak, 11); tr(nbX, -nbChip.w / 2 + 36, 0);
  const NBX = 1170 - nbChip.w / 2;

  /* ================= C. gold, oxygen and carbon; 118 elements ================= */
  const Cg = G(root);
  const knownT = [[79, 300, g => { const b = G(g); tr(b, 0, 0, 0.42); E('path', { d: 'M-108,-52 L108,-52 L134,-22 L-134,-22 Z', fill: ball('#FFE29A', '#E0A526'), stroke: '#B57B12', 'stroke-width': 5 }, b); E('path', { d: 'M-134,-22 L134,-22 L156,46 L-156,46 Z', fill: linGrad('#FFC247', '#B57B12', true), stroke: '#8C5C0A', 'stroke-width': 5 }, b); }],
    [8, 600, g => { tr(molO2(g, 19), 0, 0); }],
    [6, 900, g => { E('path', { d: 'M-34,-14 L-18,-32 L18,-32 L34,-14 L0,30 Z', fill: 'rgba(210,240,255,0.55)', stroke: '#E9F7FF', 'stroke-width': 3, 'stroke-linejoin': 'round' }, g); E('path', { d: 'M-34,-14 L34,-14 M-18,-32 L-8,-14 L0,30 L8,-14 L18,-32', fill: 'none', stroke: '#E9F7FF', 'stroke-width': 2, opacity: 0.8 }, g); }],
  ].map(([z, x, icon]) => {
    const g = G(Cg); tr(g, x, 380);
    const tile = ptTile(g, z, { size: 220 });
    const ic = G(g); tr(ic, 0, -170); icon(ic);
    return { g, x };
  });
  const counter = T(Cg, 600, 622, '0', { size: 84, weight: 700, anchor: 'middle', fill: C.energy });
  const counterLab = T(Cg, 600, 672, 'elements known today', { size: 30, weight: 600, anchor: 'middle', fill: C.muted });

  /* ================= D/E. the counter panel inside the table's empty middle ================= */
  const panel = G(root);
  E('rect', { x: GX + 136, y: GY + 12, width: 564, height: 160, rx: 20, fill: 'rgba(10,27,39,0.6)', stroke: C.line, 'stroke-width': 2 }, panel);
  const numBox = E('rect', { x: GX + 154, y: GY + 32, width: 120, height: 120, rx: 18, fill: C.card2, stroke: C.energy, 'stroke-width': 4 }, panel);
  const numT = T(panel, GX + 214, GY + 116, '?', { size: 64, weight: 700, anchor: 'middle', fill: C.energy });
  const pl1 = T(panel, GX + 298, GY + 70, 'atomic number', { size: 36, weight: 700, fill: C.energy });
  const pl2 = T(panel, GX + 298, GY + 108, 'or proton number', { size: 28, weight: 600, fill: C.muted });
  const pl3 = [
    T(panel, GX + 298, GY + 148, '= protons in each atom', { size: 28, weight: 600 }),
    T(panel, GX + 298, GY + 148, 'hydrogen: **1** proton', { size: 28, weight: 600, boldFill: C.energy }),
    T(panel, GX + 298, GY + 148, 'helium: **2** protons', { size: 28, weight: 600, boldFill: C.energy }),
    T(panel, GX + 298, GY + 148, '…up by **one** each step', { size: 28, weight: 600, boldFill: C.energy }),
  ];

  /* ================= F. sodium's box ================= */
  const Fg = G(root);
  const TX = 400, TY = 440, TS = 270;
  const naG = G(Fg);
  const na = ptTile(naG, 11, { size: TS });
  const LBX = 668;
  const parts = [
    { key: 'sym', label: 'symbol', y: 412, val: 'Na', f: 0.1, fv: 0.6 },
    { key: 'name', label: 'name', y: 490, val: 'sodium', f: 0.19, fv: 0.6 },
    { key: 'num', label: 'atomic number', y: 572, val: '11', f: 0.29, fv: 0.73 },
    { key: 'mass', label: 'mass number', y: 322, val: '23', f: 0.4, fv: 0.87 },
  ].map(p => {
    const [px, py] = na.at[p.key];
    const ll = labelLine(Fg, LBX, p.y, TX + TS / 2 - 24, TY + py, p.label, { size: 30, weight: 700, fill: C.ink });
    const v = T(Fg, LBX + textWidth(p.label, 30, FD, 700) + 22, p.y, p.val, { size: 34, weight: 700, fill: C.energy });
    return Object.assign(p, { ll, v });
  });

  /* ================= G. ordered by atomic number, not mass ================= */
  const Gg = G(root);
  function sTile(parent, z, fill, ink) {
    const el = ptElement(z), g = G(parent);
    const box = E('rect', { x: -52, y: -52, width: 104, height: 104, rx: 11, fill, stroke: '#FFFFFF', 'stroke-opacity': 0.35, 'stroke-width': 2 }, g);
    let ringM = null, ringN = null;              // number rings only where the swap needs them
    if (z === 52 || z === 53) {
      ringM = E('rect', { x: -34, y: -48, width: 68, height: 29, rx: 9, fill: 'none', stroke: C.energy, 'stroke-width': 3.5 }, g);
      ringN = E('rect', { x: -26, y: 22, width: 52, height: 29, rx: 9, fill: 'none', stroke: C.energy, 'stroke-width': 3.5 }, g);
      op(ringM, 0); op(ringN, 0);
    }
    T(g, 0, -26, el.mass, { size: 24, weight: 600, anchor: 'middle', fill: ink });
    T(g, 0, 15, el.sym, { size: 44, weight: 700, anchor: 'middle', fill: ink });
    T(g, 0, 44, String(z), { size: 24, weight: 700, anchor: 'middle', fill: ink });
    return { g, box, ringM, ringN, z };
  }
  const COLX = [390, 510], ROWY = [262, 378, 494, 610];
  const HAL = '#B5E655';
  const g6 = [8, 16, 34, 52].map((z, r) => Object.assign(sTile(Gg, z, C.card2, C.ink), { x: COLX[0], y: ROWY[r] }));
  const g7 = [9, 17, 35, 53].map((z, r) => Object.assign(sTile(Gg, z, HAL, C.bg0), { x: COLX[1], y: ROWY[r] }));
  const te = g6[3], io = g7[3];
  T(Gg, COLX[0], 188, 'Group 6', { size: 26, weight: 700, anchor: 'middle', fill: C.muted });
  T(Gg, COLX[1], 188, 'Group 7', { size: 26, weight: 700, anchor: 'middle', fill: HAL });
  const ioBad = cross(Gg, 13);
  const PXL = 640;
  const rowM = G(Gg);
  T(rowM, PXL, 276, 'Sorted by **mass**?', { size: 34, weight: 600, boldFill: C.bad });
  T(rowM, PXL, 322, 'iodine (127) before tellurium (128)', { size: 26, weight: 500, fill: C.muted, font: FB });
  const rmX = cross(rowM, 12); tr(rmX, PXL + 14, 362);
  T(rowM, PXL + 40, 372, 'iodine joins the wrong family', { size: 28, weight: 700, fill: C.bad });
  const rowA = G(Gg);
  T(rowA, PXL, 482, 'Sorted by **atomic number**', { size: 34, weight: 600, boldFill: C.good });
  T(rowA, PXL, 528, 'tellurium (52) before iodine (53)', { size: 26, weight: 500, fill: C.muted, font: FB });
  const raT = tick(rowA, 13); tr(raT, PXL + 14, 566);
  T(rowA, PXL + 40, 578, 'iodine joins the halogens', { size: 28, weight: 700, fill: C.good });

  /* ================= H. columns: similar properties ================= */
  const Hg = G(root);
  const hc1 = chip(Hg, 'same column → similar properties', { size: 30, fill: 'rgba(10,27,39,0.88)', stroke: C.heat, sw: 3 });
  const hc2 = chip(Hg, 'so position predicts behaviour', { size: 30, fill: 'rgba(10,27,39,0.88)', stroke: C.energy, sw: 3, color: C.energy });
  tr(hc1, GX + 418, GY + 62); tr(hc2, GX + 418, GY + 138);

  /* ================= update ================= */
  return t => {
    const tA1 = at('element') - 0.15, tB0 = at('element') - 0.1, tB1 = at('known') - 0.05, tC1 = at('order') - 0.1;

    /* ---- table: small ghost (A), full outline + counter (D, E), dimmed for sodium (F), back for columns (H) ---- */
    const aSmall = win(t, S.first - 0.2, tA1 + 0.3, 0.45);
    const aBig = win(t, at('order') - 0.05, at('box') + 0.9, 0.5);
    const aBack = P(t, at('columns') - 0.15, 0.5, linear);
    const aGrid = Math.max(aSmall, aBig, aBack);
    op(gridG, aGrid);
    if (aGrid > 0) {
      if (aSmall > 0) tr(gridG, SX, SY, SM); else tr(gridG, GX, GY);
      let st;
      if (aSmall > 0) st = { reveal: 0, labels: 0 };
      else if (t < at('columns') - 0.2) {
        // count: H (1), He (2), then up by one each step, faster and faster, row by row
        const r1 = P(t, mid('count', 0.04), 0.45, linear), r2 = P(t, mid('count', 0.36), 0.45, linear);
        const c0 = mid('count', 0.62), c1 = end('count') + 0.9;
        const rc = Math.pow(P(t, c0, c1 - c0, linear), 1.7);
        const reveal = r1 + r2 + 116 * rc;
        const cur = Math.min(118, Math.ceil(reveal - 1e-6));
        const naHi = P(t, at('box') - 0.2, 0.4, linear);
        st = { reveal, labels: P(t, at('order') + 0.2, 0.6, linear), dim: 0.9 * naHi,
          hi: [{ z: cur, p: cur >= 1 && reveal < 117.9 ? 1 : 0 }, { z: 11, p: naHi, color: PT_KIND_COL.metal }] };
      } else {
        const g1 = P(t, mid('columns', 0.08), 0.6, linear), g70 = P(t, mid('columns', 0.6), 0.6, linear);
        st = { reveal: 118, dim: 0.75 * g1, hi: [{ group: 1, p: g1 }, { group: 7, p: g70 }, { group: 0, p: P(t, mid('columns', 0.66), 0.6, linear) }] };
      }
      grid.set(st);
      op(outline, aSmall > 0 ? 0.9 : (t < at('columns') - 0.2 ? 1 : 0));
      op(cellG, aSmall > 0 ? 1 : 0);
    }

    /* ---- A ---- */
    const aA = win(t, S.first - 0.2, tA1 + 0.3, 0.45);
    op(A, aA);
    if (aA > 0) {
      objs.forEach((o, i) => {
        const p = P(t, at('everything') + i * 0.2, 0.5, pop), d = P(t, mid('everything', 0.5) + i * 0.12, 0.8, linear);
        op(o.g, clamp(p * 2) * (1 - d)); op(o.lab, clamp(p * 2));
        tr(o.g, o.x, o.y + (1 - clamp(p)) * 24, (0.85 + 0.15 * clamp(p)) * (1 + 0.12 * d));
      });
      const lit = {};
      fly.forEach(f => {
        const t0 = mid('everything', 0.48) + f.i * 0.12 + f.k * 0.045, u = clamp((t - t0) / 1.1);
        if (t < t0) { op(f.el, 0); return; }
        const p = ease(u), cx = (f.x0 + f.x1) / 2, cy = Math.min(f.y0, f.y1) - f.bend, q = 1 - p;
        attr(f.el, 'cx', q * q * f.x0 + 2 * q * p * cx + p * p * f.x1);
        attr(f.el, 'cy', q * q * f.y0 + 2 * q * p * cy + p * p * f.y1);
        attr(f.el, 'r', lerp(11, 9, p));
        op(f.el, Math.min(1, u * 5) * (1 - P(u, 0.92, 0.08, linear)));
        lit[f.sym] = Math.max(lit[f.sym] || 0, P(t, t0 + 1.0, 0.3, linear));
      });
      for (const s in cells) op(cells[s], (lit[s] || 0) * 0.9);
    }

    /* ---- B ---- */
    const aBb = win(t, tB0, tB1 + 0.25, 0.4);
    op(B, aBb);
    if (aBb > 0) {
      const wp = P(t, mid('element', 0.02), 0.6, pop);
      op(bWord, clamp(wp * 2)); bWord.setAttribute('transform', `translate(600 168) scale(${(0.8 + 0.2 * wp).toFixed(3)}) translate(-600 -168)`);
      op(bMean, P(t, mid('element', 0.12), 0.5, linear));
      const bp = P(t, at('element') + 0.1, 0.6, pop);
      const hit = mid('element', 0.6), shake = Math.sin(Math.PI * P(t, hit, 0.35, linear)) * Math.sin(t * 60) * 5 * calm;
      tr(barG, 300 + shake, 440 + (1 - clamp(bp)) * 20, Math.max(0.01, bp));
      op(barLab, P(t, at('element') + 0.3, 0.4, linear));
      const lp = P(t, mid('element', 0.16), 0.5, linear);
      op(lens, lp); op(cone, lp * 0.9);
      const mp = P(t, mid('element', 0.2), 0.7, pop);
      op(magG, clamp(mp * 2)); tr(magG, LX, LY, Math.max(0.01, 0.6 + 0.4 * mp));
      const heat = P(t, mid('element', 0.72), 0.8, linear);
      lat.forEach(a => tr(a.g, a.x + Math.sin(t * (3 + 9 * heat) + a.ph) * (1 + 4 * heat) * calm, a.y + Math.cos(t * (3.4 + 9 * heat) + a.ph) * (1 + 4 * heat) * calm));
      op(latLab, P(t, mid('element', 0.36), 0.5, linear));
      // hammer: raised, strikes the bar, bounces off
      const hIn = P(t, mid('element', 0.5), 0.4, linear), hOut = P(t, mid('element', 0.72), 0.4, linear);
      op(hammer, hIn * (1 - hOut));
      const sw = P(t, hit - 0.45, 0.45, easeIn), back = P(t, hit, 0.6, easeOut);
      const rot = 38 * (1 - sw) + 24 * Math.sin(Math.PI * back) * (1 - P(t, hit + 0.6, 0.4));
      tr(hammer, 560, 340, 1, rot);
      const bg = P(t, hit, 0.35, linear);
      op(bang, bg > 0 && bg < 1 ? 1 - bg : 0); tr(bang, 390, 388, 0.7 + 0.6 * bg);
      // flame: the gold just gets hot
      op(burner, P(t, mid('element', 0.66), 0.4, linear));
      burner.set('blue'); burner.upd(t);
      op(heatGlow, heat * (0.45 + 0.15 * wave(t, 0.8) * calm));
      const nb = P(t, mid('element', 0.8), 0.5, easeOut);
      op(noBreak, nb); tr(noBreak, NBX, 690 + (1 - nb) * 14);
    }

    /* ---- C ---- */
    const aCc = win(t, at('known') - 0.15, tC1 + 0.3, 0.4);
    op(Cg, aCc);
    if (aCc > 0) {
      knownT.forEach((k, i) => { const p = P(t, mid('known', [0.0, 0.14, 0.28][i]), 0.55, pop); op(k.g, clamp(p * 2)); tr(k.g, k.x, 380 + (1 - clamp(p)) * 26, 0.85 + 0.15 * p); });
      const cp = P(t, mid('known', 0.55), 0.4, linear);
      op(counter, cp); op(counterLab, cp);
      setText(counter, String(Math.round(118 * P(t, mid('known', 0.57), 1.4, easeOut))));
    }

    /* ---- D/E panel ---- */
    const aP = win(t, mid('order', 0.28), at('box') + 0.4, 0.45);
    op(panel, aP);
    if (aP > 0) {
      op(pl1, P(t, mid('order', 0.4), 0.45, linear)); op(pl2, P(t, mid('order', 0.6), 0.45, linear));
      const s1 = mid('count', 0.04), s2 = mid('count', 0.36), s3 = mid('count', 0.62);
      op(pl3[0], P(t, mid('order', 0.76), 0.45, linear) * (1 - P(t, s1 - 0.2, 0.3, linear)));
      op(pl3[1], win(t, s1, s2, 0.3)); op(pl3[2], win(t, s2, s3, 0.3)); op(pl3[3], P(t, s3, 0.3, linear));
      const r1 = P(t, s1, 0.45, linear), r2 = P(t, s2, 0.45, linear), rc = Math.pow(P(t, s3, end('count') + 0.9 - s3, linear), 1.7);
      const n = Math.min(118, Math.ceil(r1 + r2 + 116 * rc - 1e-6));
      setText(numT, n >= 1 ? String(n) : '?');
      numT.setAttribute('font-size', n >= 100 ? 54 : 64);
      const bump = Math.sin(Math.PI * clamp((r1 + r2 + 116 * rc) % 1));
      numBox.setAttribute('stroke-width', (4 + 2 * (n < 6 ? bump : 0)).toFixed(2));
    }

    /* ---- F: sodium's box ---- */
    const aF = win(t, at('box') + 0.05, at('notmass') + 0.1, 0.4);
    op(Fg, aF);
    if (aF > 0) {
      const [sx, sy] = grid.xy(11), u = P(t, at('box') + 0.05, 1.0, ease);
      tr(naG, lerp(GX + sx, TX, u), lerp(GY + sy, TY, u), lerp(62 / TS, 1, u));
      na.set({ hlNum: P(t, mid('box', 0.73), 0.4, linear), hlMass: P(t, mid('box', 0.87), 0.4, linear) });
      parts.forEach(p => { p.ll.set(P(t, mid('box', p.f), 0.45, linear)); op(p.v, P(t, mid('box', p.fv), 0.4, linear)); });
    }

    /* ---- G: tellurium and iodine ---- */
    const aG = win(t, at('notmass') - 0.1, at('columns') + 0.05, 0.4);
    op(Gg, aG);
    if (aG > 0) {
      const sw1 = P(t, mid('notmass', 0.42), 0.9, ease), sw2 = P(t, mid('notmass', 0.8), 0.8, ease), swp = sw1 - sw2;
      const arc = Math.sin(Math.PI * sw1) - Math.sin(Math.PI * sw2);
      [...g6, ...g7].forEach((tl, i) => {
        const p = P(t, at('notmass') + 0.05 + (i % 4) * 0.08 + (i >= 4 ? 0.04 : 0), 0.5, pop);
        let x = tl.x, y = tl.y;
        if (tl === te) { x = lerp(COLX[0], COLX[1], swp); y = ROWY[3] + 40 * arc; }
        if (tl === io) { x = lerp(COLX[1], COLX[0], swp); y = ROWY[3] - 40 * arc; }
        op(tl.g, clamp(p * 2)); tr(tl.g, x, y, 0.85 + 0.15 * clamp(p));
        if (tl === te || tl === io) {
          op(tl.ringN, win(t, mid('notmass', 0.1), mid('notmass', 0.4), 0.3) + P(t, mid('notmass', 0.84), 0.4, linear));
          op(tl.ringM, win(t, mid('notmass', 0.42), mid('notmass', 0.8), 0.3));
        }
      });
      const bad = clamp(sw1 * 3 - 2) * (1 - sw2);
      io.box.setAttribute('stroke', bad > 0.02 ? C.bad : '#FFFFFF');
      io.box.setAttribute('stroke-width', (2 + 4 * bad).toFixed(2));
      io.box.setAttribute('stroke-opacity', (0.35 + 0.65 * bad).toFixed(2));
      op(ioBad, bad); tr(ioBad, lerp(COLX[1], COLX[0], swp) + 46, ROWY[3] - 46, 0.6 + 0.4 * bad);
      op(rowM, P(t, mid('notmass', 0.5), 0.5, linear) * (1 - 0.45 * P(t, mid('notmass', 0.8), 0.4, linear)));
      op(rowA, P(t, mid('notmass', 0.82), 0.5, linear));
      const tk = P(t, mid('notmass', 0.9), 0.4, pop); op(raT, clamp(tk * 2)); tr(raT, PXL + 14, 566, Math.max(0.01, tk));
    }

    /* ---- H ---- */
    const aH = P(t, at('columns') + 0.2, 0.4, linear);
    op(Hg, aH);
    if (aH > 0) {
      const c1 = P(t, mid('columns', 0.24), 0.5, easeOut), c2 = P(t, mid('columns', 0.7), 0.5, easeOut);
      op(hc1, c1); tr(hc1, GX + 418, GY + 62 + (1 - c1) * 12);
      op(hc2, c2); tr(hc2, GX + 418, GY + 138 + (1 - c2) * 12);
    }
  };
});
