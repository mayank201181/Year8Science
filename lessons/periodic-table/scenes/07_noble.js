/* Chapter 7, Group 0: the noble gases.
   The table with Group 0 lit -> helium, neon and argon slide forward -> they settle as atoms on velvet
   cushions and other atoms bounce off them -> each full outer shell glows (2; 2, 8; 2, 8, 8) -> gain,
   lose and share, each crossed out -> crowns ("too posh"), but full, not empty -> sodium hands its
   outer electron to chlorine: 2, 8 like neon, 2, 8, 8 like argon -> a violent flash, then salt on
   chips -> helium: a balloon, an airship, can't burn, the MRI scanner's frosty magnets -> found in the
   Sun first: its yellow spectrum line, "Helios" -> SHOWPIECE: a night street where a NEON sign
   flickers on -> argon in a filament bulb and shielding a weld -> 1962: xenon forced to react. */
scene('noble', S => {
  const { at, mid } = S, root = S.root;
  const calm = S.reduce ? 0.25 : 1;
  const Y = C.energy, VIO = PT_FAMILY_COL.noble, VIO_LT = '#D9C6FF', VIO_DK = C.ethanolDk;
  const LIME = PT_FAMILY_COL.halogen, LIME_DK = '#6E9A1F', F_COL = '#F5EE8C', NEON = '#FF5A36';
  let uid = 0;

  /* ---------- local helpers ---------- */
  function rich(parent, x, y, segs, o) {
    o = o || {};
    const t = E('text', { x, y, 'font-size': o.size || 30, 'font-weight': o.weight || 600, 'font-family': o.font || FD, 'text-anchor': o.anchor || 'start', fill: o.fill || C.ink }, parent);
    segs.forEach(s => { if (typeof s === 'string') s = [s]; E('tspan', { fill: s[1], 'font-weight': s[2] }, t).textContent = s[0]; });
    return t;
  }
  function ballAtom(parent, r, col, dk, letter, ink) {
    const g = G(parent);
    E('circle', { r, fill: ball(col, dk), stroke: dk, 'stroke-width': Math.max(1.5, r * 0.07) }, g);
    if (letter) T(g, 0, r * 0.33, letter, { size: Math.round(r * 0.88), weight: 700, anchor: 'middle', fill: ink || C.bg0 });
    return g;
  }
  /* a small gold crown, about 72 wide, centred on its band */
  function crown(parent) {
    const g = G(parent);
    E('path', { d: 'M-32,10 L-36,-20 L-18,-6 L0,-28 L18,-6 L36,-20 L32,10 Z', fill: ball('#FFD54A', '#C48A0C'), stroke: '#FFF0A8', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, g);
    E('rect', { x: -33, y: 6, width: 66, height: 11, rx: 4, fill: '#E5AE1F', stroke: '#FFF0A8', 'stroke-width': 2 }, g);
    E('path', { d: 'M0,-34 a5,5 0 1,0 0.1,0 Z M-36,-26 a4,4 0 1,0 0.1,0 Z M36,-26 a4,4 0 1,0 0.1,0 Z', fill: '#FF6B8A', stroke: '#FFC2CF', 'stroke-width': 1.5 }, g);
    return g;
  }
  /* a path of n dots of radius r spaced round a circle of radius R, starting at the top */
  function dotRing(R, n, r, a0) {
    let d = '';
    for (let j = 0; j < n; j++) { const a = (a0 || -90) * Math.PI / 180 + j * TAU / n, x = Math.cos(a) * R, y = Math.sin(a) * R; d += `M${(x - r).toFixed(1)},${y.toFixed(1)} a${r},${r} 0 1,0 ${2 * r},0 a${r},${r} 0 1,0 ${-2 * r},0 Z `; }
    return d;
  }
  const bez = (a, c, b, u) => { const v = 1 - u; return [v * v * a[0] + 2 * v * u * c[0] + u * u * b[0], v * v * a[1] + 2 * v * u * c[1] + u * u * b[1]]; };
  const beat = (t, a, b) => win(t, a, b, 0.45);

  /* ================= A. the table, Group 0, three tiles slide forward ================= */
  const grid = ptGrid(root); tr(grid, 64, 190);
  const gChip = chip(root, 'Group 0: the noble gases', { size: 30, fill: 'rgba(10,27,39,0.85)', stroke: VIO, color: VIO_LT });
  const NZ = [2, 10, 18], ROWX = [340, 600, 860], ROWY = 400, FLYAT = [0.73, 0.83, 0.9];
  const tilesG = G(root);
  const tiles = NZ.map(z => {
    const g = G(tilesG);
    ptTile(g, z, { size: 200, color: VIO }).set({ name: 0 });
    const name = T(tilesG, 0, 0, PT_NAME[z - 1], { size: 30, weight: 700, anchor: 'middle', fill: C.ink });
    const [gx, gy] = grid.xy(z);
    return { g, name, gx: 64 + gx, gy: 190 + gy };
  });

  /* ================= B. three atoms on velvet cushions ================= */
  const CY = 560, ER = 9;                            // the cushions' line
  const NOB = [
    { z: 2, x: 230, R: [56], cfg: '2', nucR: 13, cs: 0.75 },
    { z: 10, x: 520, R: [56, 96], cfg: '2, 8', nucR: 17, cs: 0.9 },
    { z: 18, x: 880, R: [56, 96, 136], cfg: '2, 8, 8', nucR: 21, cs: 1.05 },
  ];
  const rowG = G(root), rowLab = G(rowG);
  const nob = NOB.map((d, i) => {
    const Ro = d.R[d.R.length - 1], ay = -(Ro + ER + 8);
    const g = G(rowG); tr(g, d.x, CY);
    // a plump velvet cushion with a gold button and tassels; the atom sinks into it a little
    const cush = G(g), W = Ro + 40;
    E('path', { d: `M${-W},6 C${-W},-14 ${-W * 0.55},-18 0,-17 C${W * 0.55},-18 ${W},-14 ${W},6 C${W},26 ${W * 0.55},32 0,31 C${-W * 0.55},32 ${-W},26 ${-W},6 Z`, fill: ball('#9A66DC', '#43207A'), stroke: '#C7A6FF', 'stroke-width': 2.5 }, cush);
    E('path', { d: `M${-W * 0.72},-6 Q0,-15 ${W * 0.72},-6`, fill: 'none', stroke: '#E9DDFF', 'stroke-width': 3, opacity: 0.45, 'stroke-linecap': 'round' }, cush);
    E('path', { d: `M${-W - 2},8 l-8,16 M${W + 2},8 l8,16`, stroke: '#FFD54A', 'stroke-width': 4, 'stroke-linecap': 'round' }, cush);
    E('path', { d: `M${-W - 9},8 a7,7 0 1,0 14,0 a7,7 0 1,0 -14,0 Z M${W - 5},8 a7,7 0 1,0 14,0 a7,7 0 1,0 -14,0 Z M-5,14 a5,5 0 1,0 10,0 a5,5 0 1,0 -10,0 Z`, fill: '#FFD54A', stroke: '#C48A0C', 'stroke-width': 1.5 }, cush);
    const body = G(g);
    const ringG = G(body); tr(ringG, 0, ay);
    E('circle', { r: Ro, fill: 'none', stroke: Y, 'stroke-width': 16, opacity: 0.32 }, ringG);
    const atom = shellAtom(body, { z: d.z, radii: d.R, er: ER, nucleus: 'dot', nucR: d.nucR }); tr(atom, 0, ay);
    const cr = crown(body);
    const name = T(rowLab, d.x, CY + 66, PT_NAME[d.z - 1], { size: 30, weight: 700, anchor: 'middle', fill: VIO_LT });
    const cfg = T(rowLab, d.x, CY + 108, d.cfg, { size: 34, weight: 700, anchor: 'middle', fill: Y });
    return Object.assign({}, d, { g, body, ringG, atom, cr, name, cfg, Ro, ay });
  });
  // other atoms bounce off them
  const BOUNCE = [
    { k: 'O', col: C.oxygen, dk: C.oxygenDk, ink: '#FFFFFF', from: [80, 160], n: 0, ang: -135, f: 0.0 },
    { k: 'Na', col: PT_KIND_COL.metal, dk: '#3F6F9F', ink: C.bg0, from: [600, 104], n: 1, ang: -100, f: 0.1 },
    { k: 'Cl', col: LIME, dk: LIME_DK, ink: C.bg0, from: [1150, 150], n: 2, ang: -48, f: 0.2 },
    { k: 'H', col: C.hydrogen, dk: C.hydrogenDk, ink: '#3B4A57', from: [40, 640], n: 0, ang: 160, f: 0.3 },
    { k: 'K', col: '#9FC2EC', dk: '#3F6F9F', ink: C.bg0, from: [1170, 640], n: 2, ang: 22, f: 0.38 },
  ].map(b => {
    const d = NOB[b.n], Ro = d.R[d.R.length - 1], cx = d.x, cy = CY - (Ro + ER + 8), rb = 20;
    const a = b.ang * Math.PI / 180, nx = Math.cos(a), ny = Math.sin(a);
    const hit = [cx + nx * (Ro + ER + rb), cy + ny * (Ro + ER + rb)];
    const vx = hit[0] - b.from[0], vy = hit[1] - b.from[1], dot = vx * nx + vy * ny;
    const out = [hit[0] + (vx - 2 * dot * nx) * 0.9, hit[1] + (vy - 2 * dot * ny) * 0.9];
    const g = ballAtom(root, rb, b.col, b.dk, b.k, b.ink);
    const ringE = E('circle', { cx: hit[0], cy: hit[1], r: 10, fill: 'none', stroke: '#FFFFFF', 'stroke-width': 4 }, root);
    op(g, 0); op(ringE, 0);
    return Object.assign({ g, ringE, hit, out }, b);
  });
  const inertChip = chip(root, 'unreactive, or inert', { size: 32, fill: 'rgba(10,27,39,0.85)', stroke: VIO, color: VIO_LT });
  tr(inertChip, 600, 150);

  /* gain, lose, share: all crossed out */
  const stG = G(root);
  const stChip = chip(stG, 'a full outer shell is very stable', { size: 30, fill: 'rgba(10,27,39,0.85)', stroke: Y, color: Y });
  tr(stChip, 600, 362);
  const CARDX = [300, 600, 900];
  const cards = ['gain', 'lose', 'share'].map((word, i) => {
    const g = G(stG); tr(g, CARDX[i], 520);
    card(g, -125, -100, 250, 200, { fill: C.card, stroke: C.line, rx: 20 });
    const ic = G(g); tr(ic, 0, -22);
    const full8 = dotRing(42, 8, 6, -90);
    if (i < 2) {
      E('circle', { r: 42, fill: 'none', stroke: C.faint, 'stroke-width': 3 }, ic);
      E('circle', { r: 12, fill: ball(C.oxygen, C.oxygenDk) }, ic);
      E('path', { d: full8, fill: ball(Y, '#C9A800'), stroke: '#C9A800', 'stroke-width': 1.2 }, ic);
      if (i === 0) { arrow(ic, -104, 0, -58, 0, { color: C.water, width: 4, head: 12 }); E('circle', { cx: -110, r: 7, fill: ball(C.water, C.waterDk) }, ic); }
      else { arrow(ic, 56, 0, 100, 0, { color: C.water, width: 4, head: 12 }); E('circle', { cx: 108, r: 7, fill: ball(C.water, C.waterDk) }, ic); }
    } else {
      [-30, 30].forEach(x => { E('circle', { cx: x, r: 40, fill: 'none', stroke: C.faint, 'stroke-width': 3 }, ic); E('circle', { cx: x, r: 11, fill: ball(C.oxygen, C.oxygenDk) }, ic); });
      E('path', { d: 'M-7,-12 a7,7 0 1,0 14,0 a7,7 0 1,0 -14,0 Z M-7,12 a7,7 0 1,0 14,0 a7,7 0 1,0 -14,0 Z', fill: ball(C.water, C.waterDk) }, ic);
    }
    T(g, 0, 78, word, { size: 32, weight: 700, anchor: 'middle' });
    const ww = textWidth(word, 32, FD, 700) / 2 + 8;
    const st = strike(g, -ww, 67, ww, C.bad);
    const x = cross(g, 20); tr(x, 92, -72);
    return { g, ic, x, st };
  });
  const allE = rich(stG, 600, 684, [['reactions are all about ', C.ink], ['electrons', C.water, 800]], { size: 34, anchor: 'middle' });

  /* too posh? full, not empty */
  const poshG = G(root);
  const emptyP = G(poshG); tr(emptyP, 430, 548);
  E('circle', { r: 58, fill: 'none', stroke: C.faint, 'stroke-width': 3 }, emptyP);
  E('circle', { r: 14, fill: ball(C.oxygen, C.oxygenDk) }, emptyP);
  E('path', { d: dotRing(58, 8, 8, -90), fill: 'none', stroke: C.muted, 'stroke-width': 2, 'stroke-dasharray': '4 4' }, emptyP);
  const emptyX = cross(emptyP, 30);
  const fullP = G(poshG); tr(fullP, 770, 548);
  E('circle', { r: 58, fill: 'none', stroke: C.faint, 'stroke-width': 3 }, fullP);
  E('circle', { r: 14, fill: ball(C.oxygen, C.oxygenDk) }, fullP);
  E('path', { d: dotRing(58, 8, 9, -90), fill: ball(Y, '#C9A800'), stroke: '#C9A800', 'stroke-width': 1.5 }, fullP);
  const emptyT = T(poshG, 430, 660, 'empty', { size: 32, weight: 700, anchor: 'middle', fill: C.muted });
  const emptyS = strike(poshG, 380, 649, 480, C.bad);
  const fullT = T(poshG, 770, 660, 'full', { size: 32, weight: 700, anchor: 'middle', fill: Y });
  const fullTk = tick(poshG, 15, C.good); tr(fullTk, 836, 650);

  /* ================= C. sodium gives its outer electron to chlorine ================= */
  const NAX = 330, CLX = 870, OY = 396;
  const oG = G(root);
  const goal = rich(oG, 600, 140, [['the goal: a ', C.ink], ['full outer shell', Y, 800], [', like a noble gas', C.ink]], { size: 30, anchor: 'middle' });
  const naG = G(oG), clG = G(oG);
  const naRing3 = E('circle', { r: 136, fill: 'none', stroke: C.faint, 'stroke-width': 3, opacity: 0.8 }, naG);
  const naGlow = G(naG); E('circle', { r: 96, fill: 'none', stroke: VIO, 'stroke-width': 14, opacity: 0.45 }, naGlow);
  const naAt = shellAtom(naG, { z: 11, radii: [56, 96, 136], er: ER, nucleus: 'dot', nucR: 18, rings: 2 });
  const clGlow = G(clG); E('circle', { r: 136, fill: 'none', stroke: VIO, 'stroke-width': 14, opacity: 0.45 }, clGlow);
  const clAt = shellAtom(clG, { z: 17, max: 18, radii: [56, 96, 136], er: ER, nucleus: 'dot', nucR: 20 });
  const grp1 = T(oG, NAX, 226, 'Group 1', { size: 30, weight: 700, anchor: 'middle', fill: C.heat });
  const grp7 = T(oG, CLX, 226, 'Group 7', { size: 30, weight: 700, anchor: 'middle', fill: LIME });
  const naL1 = rich(oG, NAX, 602, [['sodium  ', C.ink], ['2, 8, 1', Y, 700]], { size: 30, weight: 700, anchor: 'middle' });
  const clL1 = rich(oG, CLX, 602, [['chlorine  ', C.ink], ['2, 8, 7', Y, 700]], { size: 30, weight: 700, anchor: 'middle' });
  const naL2 = rich(oG, NAX, 644, [['loses 1', C.heat, 700], [' → 2, 8', C.ink]], { size: 28, anchor: 'middle' });
  const clL2 = rich(oG, CLX, 644, [['gains 1', LIME, 700], [' → 2, 8, 8', C.ink]], { size: 28, anchor: 'middle' });
  const naL3 = T(oG, NAX, 686, 'like neon', { size: 30, weight: 700, anchor: 'middle', fill: VIO_LT });
  const clL3 = T(oG, CLX, 686, 'like argon', { size: 30, weight: 700, anchor: 'middle', fill: VIO_LT });
  const hop = G(oG);
  E('circle', { r: ER, fill: ball(Y, '#C9A800'), stroke: '#C9A800', 'stroke-width': 1.5 }, hop);
  const naSlot = naAt.slotXY(10, 11), clSlot = clAt.slotXY(17, 18);
  const HOP0 = [NAX + naSlot[0], OY + naSlot[1]], HOP1 = [CLX + clSlot[0], OY + clSlot[1]], HOPC = [600, 190];

  /* the flash, then salt on chips */
  const saltG = G(root);
  const flash = E('circle', { cx: 600, cy: OY, r: 240, fill: glow('#FFF6C9', '#FFFFFF') }, saltG);
  const burst = [];
  for (let k = 0; k < 6; k++) burst.push({ s: spark(saltG, 18, { seed: k }), a: k / 6 * TAU + 0.4 });
  const scTitle = rich(saltG, 600, 140, [['sodium chloride', C.ink, 700], [' = ', C.muted], ['salt', '#FFFFFF', 800]], { size: 40, anchor: 'middle' });
  // a scrap of salt crystal: small sodium and larger chloride particles in a checkerboard
  const nacl = G(saltG);
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) {
    const na = (r + c) % 2 === 0;
    E('circle', { cx: (c - 1) * 36, cy: (r - 1) * 36, r: na ? 13 : 18, fill: na ? ball(PT_KIND_COL.metal, '#3F6F9F') : ball(LIME, LIME_DK), stroke: na ? '#3F6F9F' : LIME_DK, 'stroke-width': 1.5 }, nacl);
  }
  const tray = G(saltG); tr(tray, 690, 600);
  const cr_ = rng(9);
  const chipBars = [];
  for (let k = 0; k < 11; k++) chipBars.push([-96 + k * 19 + (cr_() - 0.5) * 8, -24 - cr_() * 34, (cr_() - 0.5) * 70]);
  chipBars.forEach(([x, y, a]) => E('rect', { x: -8, y: -32, width: 16, height: 64, rx: 7, fill: ball('#FFD56B', '#D79B2B'), stroke: '#F7E3A6', 'stroke-width': 1.5, transform: `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${a.toFixed(1)})` }, tray));
  E('path', { d: 'M-130,-30 L130,-30 L110,40 L-110,40 Z', fill: ball('#F4F7FA', '#C9D6DE'), stroke: '#FFFFFF', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, tray);
  E('path', { d: 'M-122,-6 L122,-6 M-116,16 L116,16', stroke: '#E8424F', 'stroke-width': 7 }, tray);
  const shaker = G(saltG);
  E('rect', { x: -36, y: -60, width: 72, height: 110, rx: 22, fill: 'rgba(220,239,248,0.25)', stroke: '#EEF4F7', 'stroke-width': 3 }, shaker);
  E('rect', { x: -30, y: -14, width: 60, height: 58, rx: 16, fill: '#F4F7FA' }, shaker);
  E('path', { d: 'M-34,-60 Q-34,-92 0,-94 Q34,-92 34,-60 Z', fill: ball('#D7E1E8', '#7D8C99'), stroke: '#EEF4F7', 'stroke-width': 2.5 }, shaker);
  E('path', { d: 'M-12,-80 a3,3 0 1,0 6,0 a3,3 0 1,0 -6,0 Z M-3,-84 a3,3 0 1,0 6,0 a3,3 0 1,0 -6,0 Z M6,-80 a3,3 0 1,0 6,0 a3,3 0 1,0 -6,0 Z', fill: '#4A5A68' }, shaker);
  const grains = [];
  for (let k = 0; k < 9; k++) grains.push({ el: E('rect', { x: -3, y: -3, width: 6, height: 6, rx: 1.5, fill: '#FFFFFF' }, saltG), dx: (cr_() - 0.5) * 60, ph: k / 9 });

  /* ================= D. helium: balloons, airships, MRI ================= */
  const heG = G(root);
  const useChip = chip(heG, 'unreactive, so useful', { size: 28, fill: 'rgba(10,27,39,0.85)', stroke: VIO, color: VIO_LT });
  tr(useChip, 1170 - useChip.w / 2, 134);
  const bal = G(heG);
  const balStr = E('path', { fill: 'none', stroke: '#E4ECF2', 'stroke-width': 2.5 }, bal);
  const balB = G(bal);
  E('path', { d: 'M0,-130 C40,-130 62,-100 62,-70 C62,-34 30,-6 4,0 L-4,0 C-30,-6 -62,-34 -62,-70 C-62,-100 -40,-130 0,-130 Z', fill: ball('#FF7AA8', '#B3326F'), stroke: '#FFC2D6', 'stroke-width': 2.5 }, balB);
  E('path', { d: 'M-6,0 L6,0 L4,9 L-4,9 Z', fill: '#B3326F' }, balB);
  T(balB, 0, -54, 'He', { size: 36, weight: 700, anchor: 'middle', fill: '#FFFFFF' });
  const lighter = G(heG);
  arrow(lighter, 330, 470, 330, 380, { color: VIO_LT, width: 5, head: 14 });
  T(lighter, 352, 418, 'lighter', { size: 28, weight: 700, fill: VIO_LT });
  T(lighter, 352, 452, 'than air', { size: 28, weight: 700, fill: VIO_LT });
  const noBurn = G(heG); tr(noBurn, 470, 600);
  E('path', { d: 'M0,-48 C26,-18 34,4 28,22 C22,40 8,48 0,48 C-8,48 -24,40 -28,22 C-32,6 -18,-8 -10,-24 C-8,-10 -2,-4 4,-2 C8,-16 4,-32 0,-48 Z', fill: C.heat, stroke: '#FFC27A', 'stroke-width': 3 }, noBurn);
  const noBurnX = cross(noBurn, 30);
  T(noBurn, 0, 92, "can't burn", { size: 28, weight: 700, anchor: 'middle' });
  const ship = G(heG);
  E('path', { d: 'M-108,-16 L-138,-50 L-112,-50 L-88,-22 Z M-108,16 L-138,50 L-112,50 L-88,22 Z', fill: '#8F9CAB', stroke: '#C9D6DE', 'stroke-width': 2 }, ship);
  E('ellipse', { rx: 124, ry: 42, fill: ball('#E4ECF2', '#7D8C99'), stroke: '#F4F7FA', 'stroke-width': 2.5 }, ship);
  E('rect', { x: -26, y: 38, width: 52, height: 17, rx: 6, fill: '#5E7280', stroke: '#B9C6D2', 'stroke-width': 2 }, ship);
  T(ship, 6, 10, 'HELIUM', { size: 28, weight: 700, anchor: 'middle', fill: '#4A5A68' });
  const mriG = G(heG); tr(mriG, 880, 420);
  const frost = E('ellipse', { rx: 250, ry: 200, fill: glow('#BFE9FF') }, mriG);
  E('path', { d: 'M-290,44 L40,44 L40,62 L-290,62 Z', fill: '#C9D6DE', stroke: '#EEF4F7', 'stroke-width': 2 }, mriG);
  E('rect', { x: -150, y: -140, width: 300, height: 280, rx: 64, fill: ball('#F4F7FA', '#A9B5C0'), stroke: '#FFFFFF', 'stroke-width': 3 }, mriG);
  E('circle', { r: 114, fill: 'none', stroke: '#7FB2E5', 'stroke-width': 7, opacity: 0.85 }, mriG);
  E('circle', { r: 92, fill: '#163646', stroke: '#C9D6DE', 'stroke-width': 8 }, mriG);
  E('path', { d: 'M-92,44 L92,44 L92,62 L-92,62 Z', fill: '#C9D6DE' }, mriG);
  let flakes = '';
  [[-170, -120], [176, -96], [-196, 40], [190, 70], [-40, -168], [70, 164]].forEach(([x, y], k) => { const r = 11 + (k % 2) * 4; for (let j = 0; j < 3; j++) { const a = j * Math.PI / 3; flakes += `M${(x - Math.cos(a) * r).toFixed(1)},${(y - Math.sin(a) * r).toFixed(1)} L${(x + Math.cos(a) * r).toFixed(1)},${(y + Math.sin(a) * r).toFixed(1)} `; } });
  const flakeP = E('path', { d: flakes, stroke: '#E8F6FF', 'stroke-width': 3, 'stroke-linecap': 'round' }, mriG);
  const mriL1 = T(heG, 880, 624, 'MRI scanner', { size: 30, weight: 700, anchor: 'middle' });
  const mriL2 = rich(heG, 880, 662, [['magnets cooled by ', C.muted], ['liquid helium', '#BFE9FF', 700]], { size: 26, anchor: 'middle' });

  /* ================= E. found in the Sun first ================= */
  const sunG = G(root);
  const SUNX = 420, SUNY = 330;
  const beam = E('path', { d: `M${SUNX - 50},${SUNY + 70} L${SUNX + 50},${SUNY + 70} L${SUNX + 250},552 L${SUNX - 250},552 Z`, fill: '#FFD24A', 'fill-opacity': 0.09 }, sunG);
  const sunA = sun(sunG, 80); tr(sunA, SUNX, SUNY);
  const specId = 'nspec' + (++uid);
  { const gr = E('linearGradient', { id: specId, x1: 0, y1: 0, x2: 1, y2: 0 }, defs());
    [[0, '#7B3FE4'], [0.14, '#3B5BFF'], [0.3, '#2EC4F0'], [0.45, '#3FD27A'], [0.6, '#F5E33B'], [0.75, '#FF9A2E'], [1, '#E8424F']].forEach(([o, c]) => E('stop', { offset: o, 'stop-color': c }, gr)); }
  const spec = G(sunG);
  E('rect', { x: SUNX - 250, y: 552, width: 500, height: 40, rx: 8, fill: `url(#${specId})`, opacity: 0.55 }, spec);
  E('rect', { x: SUNX - 250, y: 552, width: 500, height: 40, rx: 8, fill: 'none', stroke: C.line, 'stroke-width': 2 }, spec);
  const HEX = SUNX - 250 + 0.625 * 500;
  const heLine = G(sunG);
  E('ellipse', { cx: HEX, cy: 572, rx: 26, ry: 46, fill: glow('#FFF6A0') }, heLine);
  E('rect', { x: HEX - 3.5, y: 542, width: 7, height: 60, rx: 3, fill: '#FFFDE0' }, heLine);
  const heLbl = rich(sunG, HEX, 640, [['a new yellow line: ', C.ink], ['helium', Y, 800]], { size: 28, anchor: 'middle' });
  const helios = T(sunG, SUNX, 176, 'Helios', { size: 60, weight: 700, anchor: 'middle', fill: '#FFD24A' });
  const greek = T(sunG, SUNX + 102, 172, '= the Sun, in Greek', { size: 28, weight: 600, fill: C.muted });
  const yr1 = chip(sunG, '1868', { size: 26, fill: 'rgba(10,27,39,0.85)', stroke: '#FFD24A', color: '#FFD24A' }); tr(yr1, SUNX - 150, 450);
  const earthG = G(sunG); tr(earthG, 960, 360);
  E('circle', { r: 64, fill: ball('#4C9BE8', '#1D4F9E'), stroke: '#A9D4FF', 'stroke-width': 2.5 }, earthG);
  E('path', { d: 'M-40,-30 C-24,-44 -6,-38 -4,-24 C0,-12 -22,-8 -20,6 C-18,20 -36,22 -44,6 C-50,-8 -50,-20 -40,-30 Z M12,-6 C26,-18 44,-10 46,6 C48,22 30,40 16,34 C6,30 10,16 4,8 C0,2 4,0 12,-6 Z', fill: ball('#5BD27A', '#22844A') }, earthG);
  const earthL = T(sunG, 960, 470, 'found on Earth later', { size: 28, weight: 700, anchor: 'middle' });
  const yr2 = chip(sunG, '1895', { size: 26, fill: 'rgba(10,27,39,0.85)', stroke: '#7FB2E5', color: '#A9D4FF' }); tr(yr2, 960, 520);

  /* ================= F. SHOWPIECE: a neon sign on a night street ================= */
  const nightG = G(root);
  E('rect', { width: 1200, height: 750, fill: '#040A11', opacity: 0.86 }, nightG);
  E('path', { d: 'M0,610 V420 H130 V350 H290 V610 Z M290,610 V230 H910 V610 Z M910,610 V370 H1040 V310 H1200 V610 Z', fill: '#0C1A26', stroke: '#1B3144', 'stroke-width': 2 }, nightG);
  let win_ = '';
  const wr = rng(31);
  [[20, 440, 4, 3], [150, 370, 3, 4], [930, 390, 2, 4], [1060, 330, 3, 5]].forEach(([x0, y0, nx, ny]) => { for (let a = 0; a < nx; a++) for (let b = 0; b < ny; b++) if (wr() > 0.3) win_ += `M${x0 + a * 38},${y0 + b * 44} h22 v26 h-22 Z `; });
  E('path', { d: win_, fill: '#F2C14E', opacity: 0.22 }, nightG);
  E('rect', { x: 0, y: 610, width: 1200, height: 140, fill: '#071018' }, nightG);
  E('path', { d: 'M0,612 H1200', stroke: '#24384A', 'stroke-width': 3 }, nightG);
  const signG = G(nightG);
  E('rect', { x: 372, y: 262, width: 456, height: 176, rx: 22, fill: '#0A141E', stroke: '#2A3B4A', 'stroke-width': 4 }, signG);
  const tubeOff = T(signG, 600, 404, 'NEON', { size: 150, weight: 700, anchor: 'middle', fill: 'none' });
  tubeOff.setAttribute('stroke', '#3A2626'); tubeOff.setAttribute('stroke-width', 10); tubeOff.setAttribute('stroke-linejoin', 'round');
  const lit = G(signG);
  E('ellipse', { cx: 600, cy: 350, rx: 400, ry: 190, fill: glow(NEON) }, lit);
  const tubeW = T(lit, 600, 404, 'NEON', { size: 150, weight: 700, anchor: 'middle', fill: 'none' });
  tubeW.setAttribute('stroke', NEON); tubeW.setAttribute('stroke-width', 14); tubeW.setAttribute('stroke-linejoin', 'round');
  const tubeC = T(lit, 600, 404, 'NEON', { size: 150, weight: 700, anchor: 'middle', fill: 'none' });
  tubeC.setAttribute('stroke', '#FFE2D8'); tubeC.setAttribute('stroke-width', 4); tubeC.setAttribute('stroke-linejoin', 'round');
  // its glow reflected in the wet road: a soft patch and shimmering streaks
  const refl = G(nightG);
  E('ellipse', { cx: 600, cy: 668, rx: 280, ry: 40, fill: glow(NEON) }, refl);
  const streaks = E('path', { d: 'M420,646 H780 M380,664 H820 M440,682 H760 M480,700 H720', stroke: NEON, 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-dasharray': '38 22', opacity: 0.8 }, refl);
  const neonLbl = rich(nightG, 600, 500, [['neon gas glows ', C.ink], ['orange-red', NEON, 800]], { size: 32, anchor: 'middle' });

  /* ================= G. argon: light bulbs and welding ================= */
  const arG = G(root);
  const bulb = G(arG); tr(bulb, 320, 360);
  const bulbGlow = E('circle', { r: 190, fill: glow('#FFE29A') }, bulb);
  E('path', { d: 'M-40,112 C-40,80 -104,52 -104,-8 C-104,-66 -58,-108 0,-108 C58,-108 104,-66 104,-8 C104,52 40,80 40,112 Z', fill: 'rgba(255,240,200,0.12)', stroke: '#F4EBD0', 'stroke-width': 4, 'stroke-linejoin': 'round' }, bulb);
  E('path', { d: 'M-16,112 L-16,40 M16,112 L16,40', stroke: '#B9C6D2', 'stroke-width': 4 }, bulb);
  const fil = E('path', { d: 'M-16,40 L-30,8 L-18,-6 L-6,8 L6,-6 L18,8 L30,-6 L16,40', fill: 'none', stroke: '#FFF3B0', 'stroke-width': 5, 'stroke-linejoin': 'round' }, bulb);
  E('path', { d: 'M-42,112 H42 V124 H-42 Z M-40,128 H40 V140 H-40 Z M-36,144 H36 V156 H-36 Z', fill: ball('#D7E1E8', '#7D8C99') }, bulb);
  E('path', { d: 'M-18,160 H18 L10,174 H-10 Z', fill: '#4A5A68' }, bulb);
  const arAtoms = [];
  for (let k = 0; k < 5; k++) arAtoms.push(ballAtom(bulb, 15, VIO, VIO_DK, ''));
  const arIn = G(arG);
  E('path', { d: 'M470,236 L392,282', stroke: C.muted, 'stroke-width': 2.5 }, arIn);
  E('circle', { cx: 392, cy: 282, r: 4.5, fill: C.muted }, arIn);
  rich(arIn, 478, 236, [['argon', VIO_LT, 800], [' inside', C.ink]], { size: 30 });
  const bulbL = T(arG, 320, 590, 'the hot filament', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  const bulbL2 = T(arG, 320, 624, "can't burn away", { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  const weld = G(arG);
  E('path', { d: 'M650,500 L856,500 L846,540 L640,540 Z', fill: ball('#B9C6D2', '#6F7E8C'), stroke: '#DDE6EC', 'stroke-width': 2 }, weld);
  E('path', { d: 'M864,500 L1070,500 L1080,540 L874,540 Z', fill: ball('#B9C6D2', '#6F7E8C'), stroke: '#DDE6EC', 'stroke-width': 2 }, weld);
  const seam = E('path', { d: 'M760,502 L860,502', stroke: '#FFB347', 'stroke-width': 6, 'stroke-linecap': 'round' }, weld);
  const cloud = E('ellipse', { cx: 870, cy: 470, rx: 120, ry: 84, fill: glow(VIO) }, weld);
  E('path', { d: 'M890,452 L1010,300 L1040,322 L908,468 Z', fill: ball('#7D8C99', '#3F4C58'), stroke: '#B9C6D2', 'stroke-width': 2, 'stroke-linejoin': 'round' }, weld);
  E('path', { d: 'M872,478 L890,452 L908,468 Z', fill: '#D9824A', stroke: '#F0B48A', 'stroke-width': 2 }, weld);
  const arcGlow = E('circle', { cx: 866, cy: 492, r: 46, fill: glow('#DDF0FF', '#FFFFFF') }, weld);
  const wSparks = [0, 1, 2].map(k => spark(weld, 11, { seed: k + 5, color: '#FFE9A8' }));
  const shieldL = G(arG);
  E('path', { d: 'M760,382 L828,430', stroke: C.muted, 'stroke-width': 2.5 }, shieldL);
  E('circle', { cx: 828, cy: 430, r: 4.5, fill: C.muted }, shieldL);
  rich(shieldL, 752, 376, [['argon', VIO_LT, 800], [' shield', C.ink]], { size: 30, anchor: 'end' });
  const weldL = T(arG, 860, 590, 'welding', { size: 30, weight: 700, anchor: 'middle' });
  const weldL2 = T(arG, 860, 624, 'keeps the air off hot metal', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  const wontR = chip(arG, "argon won't react with it", { size: 28, fill: 'rgba(10,27,39,0.85)', stroke: VIO, color: VIO_LT });
  tr(wontR, 600, 694);

  /* ================= H. 1962: xenon forced to react ================= */
  const xeG = G(root);
  const yr = chip(xeG, '1962', { size: 36, fill: 'rgba(10,27,39,0.85)', stroke: Y, color: Y }); tr(yr, 600, 140);
  const XC = [600, 392];
  const xeFlash = spark(xeG, 30, { seed: 2, color: '#FFFFFF' }); op(xeFlash, 0);
  const fAtoms = [-45, 45, 135, 225].map(deg => ({ g: ballAtom(xeG, 40, F_COL, '#B9B35A', 'F'), a: deg * Math.PI / 180 }));
  const xe = ballAtom(xeG, 64, VIO, VIO_DK, 'Xe', C.bg0);
  const pushA = [-90, 0, 90, 180].map(deg => { const a = deg * Math.PI / 180; return arrow(xeG, XC[0] + Math.cos(a) * 200, XC[1] + Math.sin(a) * 200, XC[0] + Math.cos(a) * 136, XC[1] + Math.sin(a) * 136, { color: Y, width: 6, head: 16 }); });
  const xeL1 = rich(xeG, 600, 590, [['a compound of xenon: ', C.ink], ['XeF₄', Y, 800]], { size: 32, anchor: 'middle' });
  const xeL2 = rich(xeG, 600, 660, [['even a noble gas can be ', C.ink], ['forced to react', VIO_LT, 800]], { size: 32, anchor: 'middle' });

  /* ================= update ================= */
  return t => {
    /* --- A --- */
    const aGrid = P(t, S.first - 0.5, 0.5, linear) * lerp(1, 0.16, P(t, mid('meet', 0.72), 1.0, linear)) * (1 - P(t, at('inert') - 0.4, 0.5, linear));
    op(grid, aGrid);
    if (aGrid > 0) {
      // Group 0 lights violet; "the ones to know" brighten
      const hp = P(t, mid('meet', 0.15), 0.7), kp = P(t, mid('meet', 0.56), 0.5, linear);
      grid.set({ hi: [{ z: [2, 10, 18], p: hp, color: _ptMix(VIO, '#F3ECFF', kp) }, { group: 0, p: hp * 0.999 }], dim: hp });
    }
    op(gChip, Math.min(P(t, mid('meet', 0.2), 0.5, linear), 1 - P(t, at('inert') - 0.4, 0.4, linear)));
    tr(gChip, 1168 - gChip.w / 2, 124 + (1 - P(t, mid('meet', 0.2), 0.6, easeOut)) * 12);
    tiles.forEach((o, i) => {
      const tf = mid('meet', FLYAT[i]), fly = P(t, tf, 0.75);
      let x = lerp(o.gx, ROWX[i], fly), y = lerp(o.gy, ROWY, fly) - Math.sin(Math.PI * fly) * 46, s = lerp(61.6 / 200, 1, fly);
      const d = NOB[i], mv = P(t, at('inert') - 0.35, 0.6);
      x = lerp(x, d.x, mv); y = lerp(y, CY - (d.R[d.R.length - 1] + ER + 8), mv); s = lerp(s, 0.4, mv);
      const a = (t >= tf ? 1 : 0) * (1 - P(t, at('inert') - 0.1, 0.3, linear));
      op(o.g, a); op(o.name, a * P(t, tf + 0.45, 0.4, linear) * (1 - mv));
      if (a > 0) { tr(o.g, x, y, s); tr(o.name, x, y + 100 * s + 42); }
    });

    /* --- B: the row of three atoms --- */
    const aRow = beat(t, at('inert') - 0.3, at('others') - 0.05);
    op(rowG, aRow);
    if (aRow > 0) {
      const toSt = P(t, at('stable') - 0.1, 0.8), toPo = P(t, at('posh') - 0.15, 0.8);
      const rs = lerp(lerp(1, 0.5, toSt), 0.62, toPo), ry = lerp(lerp(CY, 300, toSt), 396, toPo);
      rowG.setAttribute('transform', `translate(600 ${ry.toFixed(1)}) scale(${rs.toFixed(4)}) translate(-600 ${-CY})`);
      op(rowLab, 1 - toSt);
      nob.forEach((o, i) => {
        const pin = P(t, at('inert') - 0.3 + i * 0.12, 0.6, pop);
        tr(o.g, o.x, CY + (1 - clamp(pin)) * 20, 0.85 + 0.15 * clamp(pin));
        // bumps when an atom bounces off
        let bump = 0;
        BOUNCE.forEach(b => { if (b.n === i) bump = Math.max(bump, Math.sin(Math.PI * P(t, mid('inert', b.f) + 0.9, 0.3, linear))); });
        const posh = P(t, mid('posh', 0.02) + i * 0.15, 0.6, pop);
        const tilt = -9 * clamp(posh) * (1 - P(t, at('others') - 0.6, 0.4, linear));
        o.body.setAttribute('transform', `rotate(${tilt.toFixed(2)}) translate(0 ${(-6 * clamp(posh)).toFixed(1)}) scale(${(1 + 0.03 * bump).toFixed(4)})`);
        const fullAt = mid('full', [0.04, 0.5, 0.74][i]);
        const glowOn = P(t, fullAt, 0.6, linear);
        op(o.ringG, glowOn * (0.75 + 0.25 * wave(t, 1.6, i * 0.3)));
        o.atom.set({ outer: glowOn, t, orbit: 14 * calm });
        op(o.name, P(t, at('inert') - 0.1 + i * 0.12, 0.4, linear));
        const cp = P(t, mid('full', [0.1, 0.56, 0.84][i]), 0.5, pop); op(o.cfg, clamp(cp * 2));
        o.cfg.setAttribute('transform', `translate(${o.x} ${CY + 108}) scale(${(0.8 + 0.2 * cp).toFixed(3)}) translate(${-o.x} ${-(CY + 108)})`);
        const cd = P(t, mid('posh', 0.0) + i * 0.15, 0.55, easeOut);
        op(o.cr, clamp(cd * 3) * (1 - P(t, at('others') - 0.4, 0.35, linear)));
        tr(o.cr, 0, o.ay - o.Ro - ER - 14 - (1 - cd) * 90, o.cs, -8 * (1 - cd));
      });
    }
    BOUNCE.forEach(b => {
      const t0 = mid('inert', b.f), u = (t - t0) / 0.9;
      if (u <= 0 || u >= 2) { op(b.g, 0); op(b.ringE, 0); return; }
      const p = u < 1 ? [lerp(b.from[0], b.hit[0], u), lerp(b.from[1], b.hit[1], u)] : [lerp(b.hit[0], b.out[0], u - 1), lerp(b.hit[1], b.out[1], u - 1)];
      tr(b.g, p[0], p[1], 1, (u * 160) % 360);
      op(b.g, Math.min(1, u * 5, (2 - u) * 2.5));
      const rp = P(u, 1, 0.45, linear);
      op(b.ringE, u > 1 ? 1 - rp : 0); attr(b.ringE, 'r', 10 + 26 * rp);
    });
    op(inertChip, beat(t, mid('inert', 0.26), at('full') + 0.3));

    /* --- gain / lose / share --- */
    const aSt = beat(t, at('stable') + 0.1, at('posh') + 0.1);
    op(stG, aSt);
    if (aSt > 0) {
      const cp = P(t, mid('stable', 0.12), 0.5, pop); op(stChip, clamp(cp * 2)); tr(stChip, 600, 362, 0.85 + 0.15 * clamp(cp));
      cards.forEach((c, i) => {
        const t0 = mid('stable', [0.4, 0.46, 0.52][i]), p = P(t, t0, 0.5, pop);
        op(c.g, clamp(p * 2)); tr(c.g, CARDX[i], 520 + (1 - clamp(p)) * 24);
        const xp = P(t, t0 + 0.55, 0.4, pop); op(c.x, clamp(xp * 2)); tr(c.x, 92, -72, Math.max(0.01, xp));
        c.st.set(P(t, t0 + 0.6, 0.35)); op(c.ic, 1 - 0.45 * clamp(xp));
      });
      op(allE, P(t, mid('stable', 0.72), 0.5, linear));
    }

    /* --- too posh, but full --- */
    const aPo = beat(t, mid('posh', 0.36), at('others') - 0.05);
    op(poshG, aPo);
    if (aPo > 0) {
      const ep = P(t, mid('posh', 0.4), 0.5, pop), fp = P(t, mid('posh', 0.66), 0.5, pop);
      op(emptyP, clamp(ep * 2)); tr(emptyP, 430, 548, 0.8 + 0.2 * ep);
      op(emptyT, clamp(ep * 2));
      const xp = P(t, mid('posh', 0.86), 0.4, pop); op(emptyX, clamp(xp * 2)); tr(emptyX, 0, 0, Math.max(0.01, xp));
      emptyS.set(P(t, mid('posh', 0.88), 0.4));
      op(fullP, clamp(fp * 2)); tr(fullP, 770, 548, 0.8 + 0.2 * fp);
      op(fullT, clamp(fp * 2));
      const tp = P(t, mid('posh', 0.82), 0.4, pop); op(fullTk, clamp(tp * 2)); tr(fullTk, 836, 650, Math.max(0.01, tp));
    }

    /* --- C: sodium hands its electron to chlorine, then salt --- */
    const aO = beat(t, at('others') - 0.05, at('salt') + 0.5);
    op(oG, aO);
    if (aO > 0) {
      op(goal, beat(t, mid('others', 0.04), at('salt'), 0.4));
      const toward = P(t, at('salt') - 0.05, 1.6, easeIn);
      const naIn = P(t, at('others'), 0.6, pop), clIn = P(t, at('others') + 0.15, 0.6, pop);
      tr(naG, lerp(NAX, 540, toward), OY, (0.85 + 0.15 * clamp(naIn)) * lerp(1, 0.45, toward));
      tr(clG, lerp(CLX, 660, toward), OY, (0.85 + 0.15 * clamp(clIn)) * lerp(1, 0.45, toward));
      op(naG, clamp(naIn * 2) * (1 - P(t, mid('salt', 0.22), 0.3, linear)));
      op(clG, clamp(clIn * 2) * (1 - P(t, mid('salt', 0.22), 0.3, linear)));
      const lab = 1 - P(t, at('salt') - 0.05, 0.4, linear);
      op(grp1, P(t, at('others') + 0.2, 0.4, linear) * lab); op(grp7, P(t, at('others') + 0.35, 0.4, linear) * lab);
      op(naL1, P(t, at('others') + 0.3, 0.4, linear) * lab); op(clL1, P(t, at('others') + 0.45, 0.4, linear) * lab);
      const leave = mid('others', 0.6), arrive = mid('others', 0.84);
      const hu = clamp((t - leave) / (arrive - leave));
      naAt.set({ e: t < leave ? 11 : 10, outer: P(t, mid('others', 0.52), 0.4, linear) * (t < leave ? 1 : 0) + P(t, arrive + 0.2, 0.5, linear) });
      clAt.set({ e: t < arrive ? 17 : 18, gap: t < arrive ? P(t, mid('others', 0.7), 0.4, linear) * (0.6 + 0.4 * wave(t, 0.8)) : 0, outer: P(t, arrive, 0.3, linear) });
      op(naRing3, 0.8 * (1 - P(t, leave + 0.3, 0.6, linear)));
      if (hu > 0 && hu < 1) { const [x, y] = bez(HOP0, HOPC, HOP1, ease(hu)); tr(hop, x, y, 1.2); op(hop, 1); } else op(hop, 0);
      op(naL2, P(t, leave + 0.2, 0.4, linear) * lab); op(clL2, P(t, arrive, 0.4, linear) * lab);
      op(naGlow, P(t, leave + 0.5, 0.6, linear)); op(clGlow, P(t, arrive + 0.15, 0.6, linear));
      op(naL3, P(t, mid('others', 0.74), 0.4, linear) * lab); op(clL3, P(t, mid('others', 0.93), 0.4, linear) * lab);
    }
    const aSalt = beat(t, at('salt'), at('helium') + 0.1);
    op(saltG, aSalt);
    if (aSalt > 0) {
      const fl = win(t, mid('salt', 0.2), mid('salt', 0.55), 0.35);
      op(flash, fl); flash.setAttribute('r', (240 * (0.4 + 0.6 * P(t, mid('salt', 0.2), 0.5, easeOut))).toFixed(1));
      burst.forEach((b, k) => {
        const u = P(t, mid('salt', 0.22) + (k % 2) * 0.25, 1.6, easeOut), d = 60 + 230 * u;
        tr(b.s, 600 + Math.cos(b.a) * d, OY + Math.sin(b.a) * d * 0.8, 0.5 + 0.8 * Math.sin(Math.PI * clamp(u)));
        op(b.s, Math.sin(Math.PI * clamp(u)) * (u > 0 ? 1 : 0)); b.s.upd(t);
      });
      // what they make: salt, which goes into the shaker
      const cx_ = P(t, mid('salt', 0.42), 0.6, pop), into = P(t, mid('salt', 0.68), 0.7, easeIn);
      op(nacl, clamp(cx_ * 2) * (1 - P(t, mid('salt', 0.68) + 0.45, 0.25, linear)));
      tr(nacl, lerp(600, 562, into), lerp(OY, 334, into), Math.max(0.01, (0.7 + 0.3 * cx_) * lerp(1.15, 0.25, into)), 8 * Math.sin(t * 0.8 * calm));
      op(scTitle, P(t, mid('salt', 0.55), 0.5, linear));
      const sp = P(t, mid('salt', 0.64), 0.6, pop), sh = (t > mid('salt', 0.8) ? Math.sin(t * 14 * calm) : 0);
      op(shaker, clamp(sp * 2)); tr(shaker, 560 + sh * 4, 330 - (1 - clamp(sp)) * 30, 1, 150 + sh * 7);
      const tp = P(t, mid('salt', 0.7), 0.5, pop); op(tray, clamp(tp * 2)); tr(tray, 690, 600 + (1 - clamp(tp)) * 20);
      const pour = t > mid('salt', 0.8) ? 1 : 0;
      grains.forEach(g => {
        const u = ((t - mid('salt', 0.8)) / 0.9 + g.ph) % 1;
        tr(g.el, 607 + g.dx * u + sh * 3, 412 + u * 130, 1, u * 200);
        op(g.el, pour * Math.min(1, u * 6, (1 - u) * 5));
      });
    }

    /* --- D: helium --- */
    const aHe = beat(t, at('helium') - 0.1, at('sun') + 0.1);
    op(heG, aHe);
    if (aHe > 0) {
      // "Being unreactive makes them useful": centre stage first, then up to the corner
      const uc = P(t, at('helium') - 0.05, 0.5, pop), um = P(t, mid('helium', 0.17), 0.8);
      op(useChip, clamp(uc * 2));
      tr(useChip, lerp(600, 1170 - useChip.w / 2, um), lerp(380, 134, um), lerp(1.35, 1, um) * (0.85 + 0.15 * clamp(uc)));
      const bIn = P(t, mid('helium', 0.2), 0.6, linear), rise = P(t, mid('helium', 0.24), 5.0, easeOut);
      const bx = 200 + Math.sin(t * 1.3 * calm) * 10 * calm, by = lerp(640, 372, rise);
      op(bal, bIn); tr(balB, bx, by, 1, Math.sin(t * 1.3 * calm) * 5 * calm);
      const sp = []; for (let k = 0; k <= 8; k++) sp.push([bx + Math.sin(k * 0.8 + t * 2 * calm) * 6 * (k / 8), by + 10 + k * 20]);
      balStr.setAttribute('d', openPath(sp));
      op(lighter, P(t, mid('helium', 0.33), 0.5, linear));
      const nb = P(t, mid('helium', 0.41), 0.5, pop); op(noBurn, clamp(nb * 2)); tr(noBurn, 470, 600, 0.8 + 0.2 * nb);
      const nx = P(t, mid('helium', 0.45), 0.4, pop); op(noBurnX, clamp(nx * 2)); tr(noBurnX, 0, 0, Math.max(0.01, nx));
      const sx = P(t, mid('helium', 0.55), 4.2, easeOut);
      tr(ship, lerp(-170, 470, sx), 158 + Math.sin(t * 0.9 * calm) * 4, 1, -3 + Math.sin(t * 0.7 * calm) * 2);
      op(ship, P(t, mid('helium', 0.55), 0.3, linear));
      const mp = P(t, mid('helium', 0.68), 0.7, pop);
      op(mriG, clamp(mp * 2)); tr(mriG, 880, 420 + (1 - clamp(mp)) * 24, 0.9 + 0.1 * clamp(mp));
      const fr = P(t, mid('helium', 0.82), 0.8, linear);
      op(frost, fr * (0.75 + 0.25 * wave(t, 2.2))); op(flakeP, fr * (0.55 + 0.45 * wave(t, 1.4)));
      flakeP.setAttribute('transform', `rotate(${(t * 6 * calm).toFixed(1)})`);
      op(mriL1, P(t, mid('helium', 0.72), 0.4, linear)); op(mriL2, P(t, mid('helium', 0.84), 0.4, linear));
    }

    /* --- E: the Sun --- */
    const aSun = beat(t, at('sun') - 0.1, at('neon') + 0.2);
    op(sunG, aSun);
    if (aSun > 0) {
      const sp = P(t, at('sun') - 0.1, 0.8, pop); tr(sunA, SUNX, SUNY, Math.max(0.01, 0.7 + 0.3 * sp)); sunA.upd(t * calm);
      op(beam, P(t, mid('sun', 0.08), 0.6, linear));
      op(spec, P(t, mid('sun', 0.08), 0.5, linear));
      const hl = P(t, mid('sun', 0.17), 0.5, pop); op(heLine, clamp(hl * 2) * (0.8 + 0.2 * wave(t, 1.1)));
      op(heLbl, P(t, mid('sun', 0.22), 0.4, linear));
      op(yr1, P(t, mid('sun', 0.2), 0.4, linear));
      const ep = P(t, mid('sun', 0.36), 0.6, pop); op(earthG, clamp(ep * 2)); tr(earthG, 960, 360, Math.max(0.01, 0.8 + 0.2 * ep));
      op(earthL, P(t, mid('sun', 0.4), 0.4, linear)); op(yr2, P(t, mid('sun', 0.44), 0.4, linear));
      const hp = P(t, mid('sun', 0.66), 0.6, pop); op(helios, clamp(hp * 2));
      helios.setAttribute('transform', `translate(${SUNX} 176) scale(${(0.8 + 0.2 * hp).toFixed(3)}) translate(${-SUNX} -176)`);
      op(greek, P(t, mid('sun', 0.8), 0.4, linear));
    }

    /* --- F: the neon sign --- */
    const aN = beat(t, at('neon') - 0.15, at('argon') + 0.15);
    op(nightG, aN);
    if (aN > 0) {
      // flickers on, then glows steadily
      const k = t - at('neon') - 0.15;
      const on = k < 0 ? 0 : k < 0.12 ? 1 : k < 0.24 ? 0 : k < 0.3 ? 0.8 : k < 0.42 ? 0.1 : k < 0.5 ? 1 : k < 0.56 ? 0.3 : 1;
      const steady = on * (0.9 + 0.1 * wave(t, 1.7)) * P(t, at('neon') + 0.15, 0.06, linear);
      op(lit, steady); op(refl, 0.55 * steady);
      streaks.setAttribute('stroke-dashoffset', (-t * 22 * calm).toFixed(1));
      op(neonLbl, P(t, mid('neon', 0.6), 0.5, linear));
    }

    /* --- G: argon --- */
    const aAr = beat(t, at('argon') - 0.05, at('xenon') + 0.1);
    op(arG, aAr);
    if (aAr > 0) {
      const bp = P(t, at('argon'), 0.6, pop); op(bulb, clamp(bp * 2)); tr(bulb, 320, 360 + (1 - clamp(bp)) * 20);
      const glowOn = P(t, mid('argon', 0.08), 0.6, linear);
      op(bulbGlow, glowOn * (0.85 + 0.15 * wave(t, 2.4))); op(fil, 0.4 + 0.6 * glowOn);
      arAtoms.forEach((a, i) => {
        const ph = i * 1.3;
        tr(a, Math.sin(t * 0.8 * calm + ph) * 60 + [-50, 40, -10, 60, -60][i] * 0.3, Math.cos(t * 0.6 * calm + ph * 1.4) * 40 - 40 + [0, -20, 30, 10, -30][i]);
        op(a, P(t, mid('argon', 0.1) + i * 0.08, 0.4, linear));
      });
      op(arIn, P(t, mid('argon', 0.16), 0.4, linear));
      op(bulbL, P(t, mid('argon', 0.22), 0.4, linear)); op(bulbL2, P(t, mid('argon', 0.22), 0.4, linear));
      const wp = P(t, mid('argon', 0.36), 0.6, pop); op(weld, clamp(wp * 2)); tr(weld, 0, (1 - clamp(wp)) * 20);
      const arc = t > mid('argon', 0.42) ? 1 : 0;
      op(arcGlow, arc * (0.6 + 0.4 * wave(t, 0.23))); op(seam, P(t, mid('argon', 0.45), 3, linear));
      attr(seam, 'd', `M${lerp(860, 650, P(t, mid('argon', 0.45), 3, linear)).toFixed(1)},502 L860,502`);
      wSparks.forEach((s, i) => {
        const u = ((t - mid('argon', 0.42)) * 1.6 + i / 3) % 1, a = -2.2 + i * 0.7;
        tr(s, 866 + Math.cos(a) * 80 * u, 492 + Math.sin(a) * 60 * u + 50 * u * u, 0.6 + 0.5 * (1 - u));
        op(s, arc * Math.sin(Math.PI * u)); s.upd(t);
      });
      op(cloud, P(t, mid('argon', 0.5), 0.6, linear) * (0.8 + 0.2 * wave(t, 1.8)));
      op(shieldL, P(t, mid('argon', 0.52), 0.4, linear));
      op(weldL, P(t, mid('argon', 0.4), 0.4, linear)); op(weldL2, P(t, mid('argon', 0.58), 0.4, linear));
      const wr2 = P(t, mid('argon', 0.78), 0.5, pop); op(wontR, clamp(wr2 * 2)); tr(wontR, 600, 694, 0.85 + 0.15 * clamp(wr2));
    }

    /* --- H: xenon --- */
    const aX = P(t, at('xenon') - 0.1, 0.45, linear);
    op(xeG, aX);
    if (aX > 0) {
      const yp = P(t, mid('xenon', 0.12), 0.5, pop); op(yr, clamp(yp * 2)); tr(yr, 600, 140, 0.8 + 0.2 * clamp(yp));
      const xp = P(t, at('xenon') - 0.1, 0.6, pop); tr(xe, XC[0], XC[1], Math.max(0.01, 0.8 + 0.2 * xp));
      // the fluorine atoms close in, are pushed back, then forced on
      const c1 = P(t, mid('xenon', 0.36), 1.0, easeOut), back = Math.sin(Math.PI * P(t, mid('xenon', 0.36) + 1.0, 0.5, linear));
      const push = P(t, mid('xenon', 0.5), 0.5, easeIn);
      const dist = lerp(lerp(300, 132, c1) + 22 * back, 90, push);
      fAtoms.forEach((f, i) => {
        tr(f.g, XC[0] + Math.cos(f.a) * dist, XC[1] + Math.sin(f.a) * dist, 1, Math.sin(t * 2 * calm + i) * 6 * (1 - push));
        op(f.g, P(t, mid('xenon', 0.34) + i * 0.04, 0.4, linear));
      });
      const ap = win(t, mid('xenon', 0.4), mid('xenon', 0.57), 0.3);
      pushA.forEach((a, i) => { op(a, ap); a.set(P(t, mid('xenon', 0.4) + i * 0.05, 0.4)); });
      const fx = win(t, mid('xenon', 0.5) + 0.45, mid('xenon', 0.5) + 1.3, 0.25);
      op(xeFlash, fx); if (fx > 0) { tr(xeFlash, XC[0], XC[1], 1.5 + 2 * P(t, mid('xenon', 0.5) + 0.45, 0.8, easeOut)); xeFlash.upd(t); }
      op(xeL1, P(t, mid('xenon', 0.58), 0.5, linear));
      const lp = P(t, mid('xenon', 0.72), 0.5, pop); op(xeL2, clamp(lp * 2));
    }
  };
});
