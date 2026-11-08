/* Chapter 6, Group 7: the halogens.
   The table with Group 7 lit -> its five tiles slide forward ("reactive non-metals") -> chlorine's
   2, 8, 7 atom with one gap -> two chlorine atoms click into Cl2 -> a shelf of samples fills colour by
   colour: fluorine, chlorine (pools and taps), bromine (beside mercury), iodine warmed to a purple
   vapour -> gas, gas, liquid, solid over particle boxes, boiling points rising -> Funny Clowns Bring
   Ice -> the twist: reactivity decreases (Group 1 faintly the other way), fluorine crowned
   -> SHOWPIECE: chlorine water pushes bromine out of sodium bromide and the tube turns orange
   -> gaining one electron -> fluorine grips an incoming electron, iodine lets one slip past. */
scene('halogens', S => {
  const { at, mid } = S, root = S.root;
  const calm = S.reduce ? 0.25 : 1;
  const Y = C.energy;
  const LIME = PT_FAMILY_COL.halogen, LIME_DK = '#6E9A1F';
  const F_COL = '#F5EE8C', CL_COL = '#C9E35A', BR_COL = '#8E2F1C', BR_LT = '#C2552F', BR_VAP = '#C0603A';
  const I_VAP = '#9B59D0', ORANGE = '#F28A2A';
  let uid = 0;

  /* ---------- local helpers ---------- */
  function rich(parent, x, y, segs, o) {
    o = o || {};
    const t = E('text', { x, y, 'font-size': o.size || 30, 'font-weight': o.weight || 600, 'font-family': o.font || FD, 'text-anchor': o.anchor || 'start', fill: o.fill || C.ink }, parent);
    segs.forEach(s => { if (typeof s === 'string') s = [s]; E('tspan', { fill: s[1], 'font-weight': s[2] }, t).textContent = s[0]; });
    return t;
  }
  /* a shaded ball with its symbol, for molecules and ions */
  function ballAtom(parent, r, col, dk, letter, ink) {
    const g = G(parent);
    E('circle', { r, fill: ball(col, dk), stroke: dk, 'stroke-width': Math.max(1.5, r * 0.07) }, g);
    if (letter) T(g, 0, r * 0.33, letter, { size: Math.round(r * 0.88), weight: 700, anchor: 'middle', fill: ink || C.bg0 });
    return g;
  }
  const clBall = (p, r) => ballAtom(p, r, LIME, LIME_DK, 'Cl');
  const brBall = (p, r) => ballAtom(p, r, BR_LT, BR_COL, 'Br', '#FFFFFF');
  const naBall = (p, r) => ballAtom(p, r, PT_KIND_COL.metal, '#3F6F9F', 'Na');
  /* a small gold crown, about 72 wide, centred on its band */
  function crown(parent) {
    const g = G(parent);
    E('path', { d: 'M-32,10 L-36,-20 L-18,-6 L0,-28 L18,-6 L36,-20 L32,10 Z', fill: ball('#FFD54A', '#C48A0C'), stroke: '#FFF0A8', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, g);
    E('rect', { x: -33, y: 6, width: 66, height: 11, rx: 4, fill: '#E5AE1F', stroke: '#FFF0A8', 'stroke-width': 2 }, g);
    E('path', { d: 'M0,-34 a5,5 0 1,0 0.1,0 Z M-36,-26 a4,4 0 1,0 0.1,0 Z M36,-26 a4,4 0 1,0 0.1,0 Z', fill: '#FF6B8A', stroke: '#FFC2CF', 'stroke-width': 1.5 }, g);
    return g;
  }
  /* a tapered arrow pointing down at x, from y0 (w0 wide) to y1 (w1 wide); g.set(p) grows it */
  function wedge(parent, x, y0, y1, w0, w1, color) {
    const g = G(parent), body = E('path', { fill: color, stroke: color, 'stroke-width': 2, 'stroke-linejoin': 'round' }, g);
    g.set = p => {
      p = clamp(p);
      const HL = 40, ye = y0 + (y1 - y0) * Math.max(p, 0.001), yb = Math.max(y0, ye - HL);
      const wb = lerp(w0, w1, clamp((yb - y0) / Math.max(1, y1 - y0 - HL))), k = clamp((ye - y0) / HL);
      const hw = (wb / 2 + 17) * k, f = v => v.toFixed(1);
      body.setAttribute('d', `M${f(x - w0 / 2)},${y0} L${f(x + w0 / 2)},${y0} L${f(x + wb / 2)},${f(yb)} L${f(x + hw)},${f(yb)} L${x},${f(ye)} L${f(x - hw)},${f(yb)} L${f(x - wb / 2)},${f(yb)} Z`);
    };
    g.set(1);
    return g;
  }
  /* a gas that fills a vessel from the bottom with a soft top edge, clipped to the glass outline d
     (vessel-local coordinates, inside spans top..bottom); r.set(level 0..1); r.clip for extra art */
  function gasFill(parent, d, top, bottom, color, opacity) {
    const id = 'hg' + (++uid);
    const cp = E('clipPath', { id }, defs()); E('path', { d }, cp);
    const gr = E('linearGradient', { id: id + 'f', x1: 0, y1: 0, x2: 0, y2: 1 }, defs());
    E('stop', { offset: 0, 'stop-color': color, 'stop-opacity': 0 }, gr);
    E('stop', { offset: 0.28, 'stop-color': color, 'stop-opacity': opacity }, gr);
    E('stop', { offset: 1, 'stop-color': color, 'stop-opacity': opacity }, gr);
    const H = (bottom - top) * 1.45;
    const r = E('rect', { x: -200, y: bottom, width: 400, height: H, fill: `url(#${id}f)`, 'clip-path': `url(#${id})` }, parent);
    r.set = lv => attr(r, 'y', bottom - clamp(lv) * H);
    r.clip = `url(#${id})`;
    r.set(0);
    return r;
  }
  /* two faint swirls drifting inside a gas, so it reads as a gas and not a liquid */
  function swirls(parent, clip, color) {
    const g = G(parent, { 'clip-path': clip });      // the clip stays put; g.drift moves inside it
    g.drift = G(g);
    E('path', { d: 'M-58,52 C-34,24 -8,66 16,40 S52,30 64,46 M-40,4 C-18,-20 6,16 30,-6', fill: 'none', stroke: color, 'stroke-width': 5, 'stroke-linecap': 'round', opacity: 0.55 }, g.drift);
    return g;
  }
  const FLASK_D = 'M-17,-95 L-17,-38 L-76,78 Q-80,92 -66,92 L66,92 Q80,92 76,78 L17,-38 L17,-95 Z';
  const tubeD = (w, h) => { const r = w / 2; return `M${-r},${-h / 2} L${-r},${h / 2 - r} A${r},${r} 0 0 0 ${r},${h / 2 - r} L${r},${-h / 2} Z`; };
  function poolIcon(parent) {
    const g = G(parent);
    E('rect', { x: -54, y: -20, width: 108, height: 46, rx: 9, fill: '#1D84A6', stroke: '#BFE6F7', 'stroke-width': 3 }, g);
    E('path', { d: 'M-46,-6 q11,-8 22,0 t22,0 t22,0 t22,0 M-46,10 q11,-8 22,0 t22,0 t22,0 t22,0', fill: 'none', stroke: '#BFEFFF', 'stroke-width': 3, 'stroke-linecap': 'round', opacity: 0.85 }, g);
    E('path', { d: 'M30,-20 V-46 Q30,-54 38,-54 M46,-20 V-46 Q46,-54 54,-54 M30,-30 H46 M30,-40 H46', fill: 'none', stroke: '#E4ECF2', 'stroke-width': 3.5, 'stroke-linecap': 'round' }, g);
    return g;
  }
  function tapIcon(parent) {
    const g = G(parent);
    E('path', { d: 'M-44,-32 H4 Q22,-32 22,-14 V2 H8 V-12 Q8,-18 2,-18 H-44 Z', fill: ball('#D7E1E8', '#7D8C99'), stroke: '#EEF4F7', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, g);
    E('rect', { x: -22, y: -48, width: 9, height: 17, fill: '#9DB0BF' }, g);
    E('rect', { x: -36, y: -55, width: 37, height: 9, rx: 4.5, fill: '#4C9BE8' }, g);
    g.drop = E('path', { d: 'M15,8 C20,16 22,20 22,24 A7,7 0 0 1 8,24 C8,20 10,16 15,8 Z', fill: C.water }, g);
    return g;
  }
  function microbe(parent) {
    const g = G(parent);
    E('path', { d: 'M-24,0 q-8,-7 -15,0 M24,0 q8,7 15,0', fill: 'none', stroke: '#86D964', 'stroke-width': 3, 'stroke-linecap': 'round' }, g);
    E('rect', { x: -24, y: -11, width: 48, height: 22, rx: 11, fill: ball('#86D964', '#3F8F2F'), stroke: '#2F6E24', 'stroke-width': 2 }, g);
    cross(g, 17);
    return g;
  }

  /* ================= A. the table, Group 7, five tiles slide forward ================= */
  const grid = ptGrid(root); tr(grid, 64, 190);
  const gChip = chip(root, 'Group 7: the halogens', { size: 30, fill: 'rgba(10,27,39,0.85)', stroke: LIME, color: LIME });
  const HZ = [9, 17, 35, 53, 85];
  const ROWX = [180, 390, 600, 810, 1020], ROWY = 400;
  const FLYAT = [0.47, 0.57, 0.67, 0.77, 0.87], SAYAT = [0.55, 0.67, 0.79, 0.92];
  const CX4 = [240, 480, 720, 960], CY4 = 432, CS4 = 176 / 190;
  const COLX7 = 640, COLY = [212, 322, 432, 542], COLS = 100 / 190;
  const STRX = [760, 860, 960, 1060], STRY = 134, STRS = 62 / 190;
  const ATX = 400, ATY = 430;                       // chlorine's atom
  const T7 = mid('seven', 0.27);                    // the tiles make way for the atom
  const tilesG = G(root);
  const tiles = HZ.map((z, i) => {
    const g = G(tilesG);
    const halo = E('circle', { r: 150, fill: glow(LIME) }, g); op(halo, 0);
    const tile = ptTile(g, z, { size: 190, color: LIME });
    tile.set({ name: 0 });
    const nameG = T(tilesG, 0, 0, PT_NAME[z - 1], { size: 28, weight: 700, anchor: 'middle', fill: C.ink });
    const [gx, gy] = grid.xy(z);
    return { z, g, tile, halo, nameG, gx: 64 + gx, gy: 190 + gy };
  });
  const fCrown = crown(tiles[0].g); op(fCrown, 0);

  /* ================= B. chlorine: 2, 8, 7 (reused for gaining one electron) ================= */
  const atomG = G(root);
  const clAtom = shellAtom(atomG, { z: 17, max: 18 }); tr(clAtom, ATX, ATY);
  const clName = T(atomG, ATX, ATY + 232, 'chlorine', { size: 30, weight: 700, anchor: 'middle', fill: LIME });
  const sevenG = G(root);
  const cfg = rich(sevenG, 660, 404, [['2, 8, ', C.ink], ['7', Y, 800]], { size: 64, weight: 700 });
  const outerT = rich(sevenG, 660, 462, [['7', Y, 800], [' outer electrons', C.ink]], { size: 34 });
  const gapNote = G(sevenG);
  E('circle', { cx: 674, cy: 512, r: 13, fill: 'none', stroke: Y, 'stroke-width': 3, 'stroke-dasharray': '5 4' }, gapNote);
  T(gapNote, 700, 522, 'one space left', { size: 28, weight: 600, fill: C.muted });
  const rnm = chip(root, 'reactive non-metals', { size: 30, fill: 'rgba(10,27,39,0.85)', stroke: LIME, color: LIME });

  /* ================= C. atoms in pairs: Cl2 ================= */
  const pairG = G(root);
  const gasPairs = [], gr_ = rng(73);
  for (let k = 0; k < 6; k++) {
    const g = G(pairG);
    E('circle', { cx: -12, r: 17, fill: ball(LIME, LIME_DK), stroke: LIME_DK, 'stroke-width': 1.5 }, g);
    E('circle', { cx: 12, r: 17, fill: ball(LIME, LIME_DK), stroke: LIME_DK, 'stroke-width': 1.5 }, g);
    const left = k % 2 === 0;
    gasPairs.push({ g, x0: left ? 70 + gr_() * 240 : 880 + gr_() * 240, y0: 200 + gr_() * 440, vx: (gr_() - 0.5) * 50, vy: (gr_() - 0.5) * 40, left });
  }
  const pA = clBall(pairG, 56), pB = clBall(pairG, 56);
  const clickSpark = spark(pairG, 26, { seed: 4 }); op(clickSpark, 0);
  const cl2Lbl = T(pairG, 600, 306, 'Cl₂', { size: 72, weight: 700, anchor: 'middle', fill: LIME });
  const diLbl = T(pairG, 600, 552, 'a diatomic molecule', { size: 38, weight: 700, anchor: 'middle' });
  const diSub = rich(pairG, 600, 598, [['di', Y, 800], [' = two atoms joined together', C.muted]], { size: 28, anchor: 'middle' });
  const gasLbl = T(pairG, 600, 664, 'chlorine gas is made of Cl₂ molecules', { size: 28, weight: 600, anchor: 'middle', fill: C.muted });

  /* ================= D. the shelf of samples ================= */
  const SHELF = 540, FS = 0.92, FY = -92 * FS;          // flask centre above the shelf line
  const shelfG = G(root);
  const plank = G(shelfG);
  E('rect', { x: 100, y: SHELF, width: 1000, height: 14, rx: 7, fill: '#2E5163', stroke: '#5E8AA0', 'stroke-width': 2 }, plank);
  const SAMP = [
    { name: 'fluorine', prop: 'pale yellow gas', col: F_COL },
    { name: 'chlorine', prop: 'green-yellow gas', col: CL_COL },
    { name: 'bromine', prop: 'red-brown liquid', col: '#E08A6A' },
    { name: 'iodine', prop: 'dark grey solid', col: '#B9B4D8' },
  ];
  const samples = SAMP.map((sp, i) => {
    const g = G(shelfG); tr(g, CX4[i], SHELF);
    const o = { g, sp };
    if (i < 3) {
      const gasG = G(g); tr(gasG, 0, FY, FS);
      o.gas = gasFill(gasG, FLASK_D, -95, 92, i === 0 ? F_COL : i === 1 ? CL_COL : BR_VAP, i === 0 ? 0.9 : i === 1 ? 0.85 : 0.6);
      o.sw = swirls(gasG, o.gas.clip, i === 2 ? '#E8A07E' : '#FFFFFF');
      o.flask = flask(g, FS, { level: 0, liquid: BR_COL, opacity: 0.95 }); tr(o.flask, 0, FY);
      const st = G(g); tr(st, 0, FY, FS);
      E('rect', { x: -21, y: -114, width: 42, height: 22, rx: 6, fill: ball('#D9B48A', '#9C7046'), stroke: '#EBD2B2', 'stroke-width': 2 }, st);
    } else {
      // iodine: crystals in a tube, clamped over a Bunsen burner
      E('rect', { x: 60, y: -9, width: 70, height: 9, rx: 3, fill: '#5E7280' }, g);
      E('line', { x1: 95, y1: -9, x2: 95, y2: -322, stroke: '#9DB0BF', 'stroke-width': 7, 'stroke-linecap': 'round' }, g);
      o.bun = bunsen(g, 0.6); tr(o.bun, 0, -18 * 0.6); o.bun.set('off');
      const tg = G(g); tr(tg, 0, -250);
      o.gas = gasFill(tg, tubeD(52, 180), -90, 90, I_VAP, 0.62);
      testTube(tg, 52, 180, { level: 0, liquid: I_VAP });
      o.xtal = G(tg);
      E('path', { d: 'M-19,78 L-12,62 L-4,76 Z M-9,85 L0,57 L10,83 Z M4,86 L14,65 L20,79 Z M-13,87 L-7,72 L0,87 Z', fill: ball('#5C6170', '#1E2026'), stroke: '#8D93A3', 'stroke-width': 1.5, 'stroke-linejoin': 'round' }, o.xtal);
      E('path', { d: 'M-1,64 L2,72 M13,70 L15,75', stroke: '#FFFFFF', 'stroke-width': 2, 'stroke-linecap': 'round', opacity: 0.7 }, o.xtal);
      o.wisp = heatWaves(tg, { n: 3, h: 60, spacing: 13, color: I_VAP, width: 6, speed: 0.45 }); tr(o.wisp, 0, -94);
      E('line', { x1: 95, y1: -290, x2: 30, y2: -290, stroke: '#9DB0BF', 'stroke-width': 5, 'stroke-linecap': 'round' }, g);
      E('rect', { x: -31, y: -297, width: 62, height: 14, rx: 4, fill: '#7D8C99', stroke: '#B9C6D2', 'stroke-width': 2 }, g);
    }
    o.lab = G(g);
    T(o.lab, 0, 46, sp.name, { size: 30, weight: 700, anchor: 'middle', fill: sp.col });
    o.prop = T(o.lab, 0, 82, sp.prop, { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
    return o;
  });
  // chlorine's uses
  const useG = G(shelfG);
  card(useG, 572, 182, 330, 150, { fill: C.card, stroke: C.line, rx: 18 });
  const pool = poolIcon(useG), mic = microbe(useG), tap = tapIcon(useG);
  T(useG, 737, 316, 'kills bacteria', { size: 28, weight: 700, anchor: 'middle', fill: CL_COL });
  // mercury beside bromine
  const hgG = G(shelfG);
  E('ellipse', { cx: 0, cy: -11, rx: 25, ry: 11, fill: linGrad('#F4F7FA', '#6F7E8C', true), stroke: '#C9D6DE', 'stroke-width': 1.5 }, hgG);
  E('ellipse', { cx: -8, cy: -16, rx: 8, ry: 3, fill: '#FFFFFF', opacity: 0.85 }, hgG);
  T(hgG, 0, -36, 'mercury', { size: 26, weight: 700, anchor: 'middle', fill: '#DDE6EC' });
  const liqChip = chip(shelfG, 'liquid at room temperature', { size: 26, fill: 'rgba(10,27,39,0.85)', stroke: '#E08A6A', color: '#F4B49A' });
  tr(liqChip, 752, 316);
  const purpleLbl = T(shelfG, 900, 246, 'purple vapour', { size: 28, weight: 700, anchor: 'end', fill: '#C9A0F0' });

  /* states and boiling points */
  const stateG = G(root);
  const PB = [
    { st: 'gas', n: 6, col: F_COL, dk: '#B9B35A' }, { st: 'gas', n: 6, col: CL_COL, dk: '#7E9A26' },
    { st: 'liquid', n: 10, col: BR_LT, dk: BR_COL }, { st: 'solid', n: 12, col: '#6E7484', dk: '#1E2026' },
  ];
  const pboxes = PB.map((b, i) => {
    const g = G(stateG);
    const box = particleBox(g, 128, 86, { n: b.n, r: 9, color: b.col, dark: b.dk, seed: 30 + i, state: b.st });
    T(g, 64, 140, b.st, { size: 32, weight: 700, anchor: 'middle' });
    return { g, box, st: b.st };
  });
  const BP = [-188, -34, 59, 184], BAR0 = 692;
  const barsG = G(stateG);
  E('line', { x1: 168, y1: BAR0, x2: 1032, y2: BAR0, stroke: C.muted, 'stroke-width': 3, 'stroke-linecap': 'round' }, barsG);
  T(barsG, 150, BAR0 - 34, 'boiling', { size: 24, weight: 600, anchor: 'end', fill: C.muted });
  T(barsG, 150, BAR0 - 6, 'point', { size: 24, weight: 600, anchor: 'end', fill: C.muted });
  const bars = BP.map((c, i) => {
    const h = (c + 273) * 0.29;
    const r = E('rect', { x: CX4[i] - 34, y: BAR0, width: 68, height: 0, rx: 6, fill: ball(PB[i].col, PB[i].dk) }, barsG);
    const v = T(barsG, CX4[i], BAR0 - h - 12, (c < 0 ? '−' + -c : c) + ' °C', { size: 26, weight: 700, anchor: 'middle' });
    return { r, v, h };
  });

  /* ================= E. Funny Clowns Bring Ice ================= */
  const mnG = G(root);
  const words = ['unny', 'lowns', 'ring', 'ce'].map((rest, i) => {
    const g = G(mnG);
    rich(g, 0, 0, [['FCBI'[i], Y, 800], [rest, C.ink, 700]], { size: 56, anchor: 'middle', weight: 700 });
    return g;
  });

  /* ================= F. the twist ================= */
  const twG = G(root);
  const w7 = wedge(twG, 748, 166, 600, 60, 14, LIME);
  const decT = G(twG);
  T(decT, 800, 372, 'reactivity', { size: 32, weight: 600, fill: C.ink });
  T(decT, 800, 424, 'decreases', { size: 44, weight: 700, fill: LIME });
  const g1G = G(twG);
  [3, 11, 19].forEach((z, k) => { const t = ptTile(g1G, z, { size: 80, color: C.heat }); t.set({ mass: 0, num: 0, name: 0 }); tr(t, 336, 262 + k * 92); });
  const w1 = wedge(g1G, 236, 222, 500, 14, 60, C.heat);
  T(g1G, 286, 192, 'Group 1', { size: 28, weight: 700, anchor: 'middle', fill: C.heat });
  T(g1G, 286, 548, 'increases', { size: 28, weight: 700, anchor: 'middle', fill: C.heat });
  const mostChip = chip(twG, 'most reactive', { size: 28, fill: 'rgba(10,27,39,0.85)', stroke: Y, color: Y });

  /* ================= G. SHOWPIECE: displacement ================= */
  const dG = G(root);
  const TUBE = [250, 400];
  const dTube = testTube(dG, 92, 300, { level: 0.56, liquid: '#DCEFF8', opacity: 0.3 }); tr(dTube, TUBE[0], TUBE[1]);
  const liqY = TUBE[1] + 150 - 290 * 0.56;            // liquid surface (stage y)
  const dropper = G(dG);
  E('path', { d: 'M-9,0 L-9,74 L-3,96 L3,96 L9,74 L9,0 Z', fill: 'rgba(201,227,90,0.35)', stroke: GLASS.stroke, 'stroke-width': 3, 'stroke-linejoin': 'round' }, dropper);
  E('path', { d: 'M-15,2 Q-17,-46 0,-50 Q17,-46 15,2 Z', fill: ball('#E8424F', '#9C1F2B'), stroke: '#FF9AA3', 'stroke-width': 2 }, dropper);
  const DROP_Y0 = 250;
  const drops = [0, 1, 2].map(() => E('path', { d: 'M0,-8 C5,-1 7,3 7,6 A7,7 0 0 1 -7,6 C-7,3 -5,-1 0,-8 Z', fill: CL_COL }, dG));
  const cwLbl = T(dG, 300, 204, 'chlorine water', { size: 28, weight: 700, fill: CL_COL });
  const tubeLbl = T(dG, TUBE[0], 594, 'sodium bromide solution', { size: 26, weight: 600, anchor: 'middle' });
  const stClear = chip(dG, 'colourless', { size: 26, fill: 'rgba(220,239,248,0.16)', stroke: '#CFE7F5', sw: 2 });
  const stOrange = chip(dG, 'orange', { size: 26, fill: ORANGE, color: C.bg0 });
  tr(stClear, TUBE[0], 640); tr(stOrange, TUBE[0], 640);
  // the zoom into the solution
  const INS = [840, 418], INR = 190;
  const zoomG = G(dG);
  E('path', { d: `M${TUBE[0] + 52},${liqY + 26} L${INS[0] - 160},${INS[1] - 103} M${TUBE[0] + 52},${TUBE[1] + 128} L${INS[0] - 150},${INS[1] + 118}`, stroke: C.muted, 'stroke-width': 2.5, 'stroke-dasharray': '7 7', fill: 'none', opacity: 0.8 }, zoomG);
  const insBg = E('circle', { cx: INS[0], cy: INS[1], r: INR, fill: '#DCEFF8', opacity: 0.08 }, zoomG);
  const insId = 'hins' + (++uid);
  { const cp = E('clipPath', { id: insId }, defs()); E('circle', { cx: INS[0], cy: INS[1], r: INR - 3 }, cp); }
  const insIn = G(zoomG, { 'clip-path': `url(#${insId})` });
  E('circle', { cx: INS[0], cy: INS[1], r: INR, fill: 'none', stroke: GLASS.stroke, 'stroke-width': 5 }, zoomG);
  const brHalo = E('ellipse', { rx: 90, ry: 110, fill: glow(ORANGE) }, insIn); op(brHalo, 0);
  const P0 = {
    naA: [-90, -40], brA: [-42, -40], naB: [-20, 90], brB: [28, 90],
    clA0: [-70, -250], clB0: [-28, -250], clA1: [-70, -128], clB1: [-28, -128],
    brAend: [108, -38], brBend: [108, 10],
  };
  const pp = { naA: naBall(insIn, 30), naB: naBall(insIn, 30), brA: brBall(insIn, 32), brB: brBall(insIn, 32), clA: clBall(insIn, 30), clB: clBall(insIn, 30) };
  const br2Lbl = T(zoomG, INS[0] + 108, INS[1] + 82, 'Br₂', { size: 32, weight: 700, anchor: 'middle', fill: '#F4B49A' });
  const stripG = G(dG);
  T(stripG, 715, 144, 'reactivity:', { size: 26, weight: 600, anchor: 'end', fill: C.muted });
  [810, 910, 1010].forEach(x => T(stripG, x, 143, '>', { size: 30, weight: 700, anchor: 'middle', fill: C.muted }));
  const eq = rich(dG, 600, 706, [['chlorine', LIME, 700], [' + sodium bromide  →  sodium chloride + ', C.ink], ['bromine', ORANGE, 800]], { size: 28, anchor: 'middle' });

  /* ================= H. why: gaining one electron ================= */
  const gainG = G(root);
  const whyChip = chip(gainG, 'Why the opposite trend?', { size: 30, fill: C.card2, stroke: C.line, color: C.ink }); tr(whyChip, 600, 134);
  const gainT = rich(gainG, 680, 370, [['gains ', C.ink], ['1', Y, 800], [' electron', C.ink]], { size: 42, weight: 700 });
  const fillT = T(gainG, 680, 424, 'to fill its outer shell', { size: 30, weight: 600, fill: C.muted });
  const fullT = rich(gainG, 680, 500, [['2, 8, ', C.ink], ['8', Y, 800], [': full!', C.good]], { size: 44, weight: 700 });

  /* ================= I. grip: fluorine vs iodine ================= */
  const gripG = G(root);
  const FX = 300, IX = 820, AY = 372;
  const fAt = shellAtom(gripG, { z: 9, max: 10, radii: [44, 84], er: 9, nucleus: 'dot', nucR: 15 }); tr(fAt, FX, AY);
  // iodine, 2, 8, 18, 18, 7: the four inner shells are drawn once as plain rings and dots; shellAtom
  // draws the outer shell (its seven electrons and the gap) and the nucleus
  const iG = G(gripG);
  const IR = [34, 66, 100, 136], IN = [2, 8, 18, 18];
  let dDots = '', dShine = '';
  IR.forEach((r, k) => {
    E('circle', { r, fill: 'none', stroke: C.faint, 'stroke-width': 3, opacity: 0.8 }, iG);
    const n = IN[k], dl = (7 * 1.25 / r) * 180 / Math.PI;
    for (let j = 0; j < n; j++) {
      const a = (n <= 2 ? -90 + j * 180 : n === 8 ? [-90, 90, 0, 180][j % 4] + (j < 4 ? -dl : dl) : -90 + j * 360 / n) * Math.PI / 180;
      const x = Math.cos(a) * r, y = Math.sin(a) * r;
      dDots += `M${(x - 7).toFixed(1)},${y.toFixed(1)} a7,7 0 1,0 14,0 a7,7 0 1,0 -14,0 Z `;
      dShine += `M${(x - 4.6).toFixed(1)},${(y - 2.4).toFixed(1)} a2.4,2.4 0 1,0 4.8,0 a2.4,2.4 0 1,0 -4.8,0 Z `;
    }
  });
  E('path', { d: dDots, fill: '#36B4DE', stroke: C.waterDk, 'stroke-width': 1.5 }, iG);
  E('path', { d: dShine, fill: '#FFFFFF', opacity: 0.6 }, iG);
  const iAt = shellAtom(iG, { protons: 53, neutrons: 0, electrons: 7, shells: [8], radii: [172], er: 7, nucleus: 'dot', nucR: 20 });
  const curtain = G(iG);
  E('path', { d: 'M-151,0 a151,151 0 1,0 302,0 a151,151 0 1,0 -302,0 Z M-28,0 a28,28 0 1,0 56,0 a28,28 0 1,0 -56,0 Z', fill: C.bg0, 'fill-rule': 'evenodd', opacity: 0.62 }, curtain);
  E('circle', { r: 151, fill: 'none', stroke: C.muted, 'stroke-width': 2.5, 'stroke-dasharray': '6 6' }, curtain);
  const dF = arrow(gripG, FX - 13, AY - 13, FX - 56, AY - 56, { color: Y, width: 5, head: 14 });
  const dI = arrow(gripG, IX - 17, AY - 17, IX - 118, AY - 118, { color: Y, width: 5, head: 14 });
  const pullF = E('line', { x1: FX, y1: AY, x2: FX, y2: AY, stroke: Y, 'stroke-width': 7, 'stroke-linecap': 'round' }, gripG);
  const pullI = E('line', { x1: IX, y1: AY, x2: IX, y2: AY, stroke: Y, 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-dasharray': '6 9' }, gripG);
  const freeE = G(gripG);
  E('circle', { r: 7, fill: ball(C.water, C.waterDk), stroke: C.waterDk, 'stroke-width': 1.5 }, freeE);
  const nameF = T(gripG, FX, 150, 'fluorine', { size: 34, weight: 700, anchor: 'middle', fill: F_COL });
  const nameI = T(gripG, IX, 150, 'iodine', { size: 34, weight: 700, anchor: 'middle', fill: '#C9A0F0' });
  const fL1 = T(gripG, FX, 600, 'close to the nucleus', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  const iL1 = T(gripG, IX, 600, 'further from the nucleus', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  const iL2 = T(gripG, IX, 636, 'and more shielded', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  const fL3 = rich(gripG, FX, 682, [['strong', Y, 800], [' grip', C.ink]], { size: 32, weight: 700, anchor: 'middle' });
  const iL3 = rich(gripG, IX, 682, [['weak', C.muted, 800], [' grip', C.ink]], { size: 32, weight: 700, anchor: 'middle' });
  const fallG = G(gripG);
  const fallA = arrow(fallG, 412, AY, 626, AY, { color: LIME, width: 7 });
  T(fallG, 519, AY - 24, 'reactivity', { size: 28, weight: 600, anchor: 'middle' });
  T(fallG, 519, AY + 50, 'falls', { size: 36, weight: 700, anchor: 'middle', fill: LIME });
  // where fluorine's incoming electron flies from (as shellAtom draws it), and iodine's passer-by path
  const fSlot = fAt.slotXY(9, 10), fAng = Math.atan2(fSlot[1], fSlot[0]) * 180 / Math.PI, fR = 84;
  const fFly = p => { const a = (fAng - 40 * (1 - p)) * Math.PI / 180, r = fR + 110 * (1 - p); return [FX + Math.cos(a) * r, AY + Math.sin(a) * r]; };
  const IQ = [[1150, 676], [948, 384], [1150, 108]];
  const iPass = u => { const v = 1 - u; return [v * v * IQ[0][0] + 2 * v * u * IQ[1][0] + u * u * IQ[2][0], v * v * IQ[0][1] + 2 * v * u * IQ[1][1] + u * u * IQ[2][1]]; };

  /* ================= update ================= */
  return t => {
    /* --- A: grid + tiles --- */
    const aGrid = P(t, S.first - 0.5, 0.5, linear) * lerp(1, 0.16, P(t, mid('meet', 0.44), 1.0, linear)) * (1 - P(t, at('seven') - 0.4, 0.5, linear));
    op(grid, aGrid);
    if (aGrid > 0) {
      const hp = P(t, mid('meet', 0.12), 0.7);
      grid.set({ hi: [{ group: 7, p: hp }], dim: hp });
    }
    op(gChip, Math.min(P(t, mid('meet', 0.16), 0.5, linear), 1 - P(t, T7 - 0.2, 0.4, linear)));
    tr(gChip, 1168 - gChip.w / 2, 124 + (1 - P(t, mid('meet', 0.16), 0.6, easeOut)) * 12);

    tiles.forEach((o, i) => {
      const tf = mid('meet', FLYAT[i]), fly = P(t, tf, 0.75);
      let x = lerp(o.gx, ROWX[i], fly), y = lerp(o.gy, ROWY, fly) - Math.sin(Math.PI * fly) * 46, s = lerp(61.6 / 190, 1, fly);
      let a = t >= tf ? 1 : 0, nameA = P(t, tf + 0.45, 0.4, linear), halo = 0;
      // making way for chlorine's atom: chlorine shrinks into it, the rest drop away
      const lv = P(t, T7, 0.6);
      if (i === 1) { x = lerp(x, ATX, lv); y = lerp(y, ATY, lv); s = lerp(s, 0.5, lv); a *= 1 - P(t, T7 + 0.18, 0.3, linear); }
      else { a *= 1 - P(t, T7, 0.35, linear); y += 40 * P(t, T7, 0.4, easeIn); }
      nameA *= 1 - P(t, T7 - 0.1, 0.3, linear);
      if (i < 4 && t >= at('clowns') - 0.05) {
        const ci = P(t, at('clowns') - 0.05 + i * 0.1, 0.55, pop);
        x = CX4[i]; y = CY4 + (1 - clamp(ci)) * 40; s = CS4 * (0.75 + 0.25 * ci); a = clamp(ci * 2);
        const say = P(t, mid('clowns', SAYAT[i]) - 0.1, 0.5, linear);
        s *= 1 + 0.1 * Math.sin(Math.PI * say);
        halo = 0.8 * Math.sin(Math.PI * say);
        nameA = P(t, mid('clowns', SAYAT[i]) - 0.1, 0.35, linear);
        const tw = P(t, at('twist') - 0.15 + i * 0.07, 0.9);
        x = lerp(x, COLX7, tw); y = lerp(y, COLY[i], tw); s = lerp(s, COLS, tw);
        nameA *= 1 - P(t, at('twist') - 0.25, 0.3, linear);
        if (i === 0) halo = Math.max(halo, win(t, mid('twist', 0.7), at('displace') - 0.2, 0.4));
        const dp = P(t, at('displace') - 0.35, 0.8);
        x = lerp(x, STRX[i], dp); y = lerp(y, STRY, dp); s = lerp(s, STRS, dp);
        if (i === 1) halo = Math.max(halo, win(t, mid('displace', 0.03), mid('displace', 0.44), 0.4));
        if (i === 2) halo = Math.max(halo, 0.7 * win(t, mid('displace', 0.23), mid('displace', 0.44), 0.4));
        a *= 1 - P(t, at('gain') - 0.35, 0.4, linear);
      }
      op(o.g, a); op(o.nameG, a * nameA);
      if (a > 0) { tr(o.g, x, y, s); tr(o.nameG, x, y + 95 * s + 40); op(o.halo, halo); }
    });
    const cr = P(t, mid('twist', 0.7), 0.5, pop);
    op(fCrown, clamp(cr * 2) * (1 - P(t, at('displace') - 0.4, 0.3, linear)));
    tr(fCrown, 0, -104 - (1 - clamp(cr)) * 40, 1.45, -6 + 6 * clamp(cr));

    /* --- B: chlorine's atom (seven, and again for gain) --- */
    const aB = win(t, T7 + 0.1, at('pairs') + 0.7, 0.35), aH = win(t, at('gain') - 0.3, at('grip') + 0.15, 0.4);
    const aAtom = Math.max(aB, aH);
    op(atomG, aAtom);
    if (aAtom > 0) {
      const inP = aB > aH ? P(t, T7 + 0.1, 0.7, easeOut) : P(t, at('gain') - 0.3, 0.7, easeOut);
      const shrink = aB > aH ? P(t, at('pairs'), 0.6, easeIn) : 0;
      tr(clAtom, ATX, ATY, (0.62 + 0.38 * inP) * (1 - 0.65 * shrink));
      clAtom.set({
        e: aH > aB ? 17 + P(t, mid('gain', 0.5), 1.3, linear) : 17,
        outer: aH > aB ? P(t, mid('gain', 0.76), 0.5, linear) : P(t, mid('seven', 0.42), 0.5, linear),
        gap: aH > aB ? 0.55 + 0.45 * wave(t, 0.9) : P(t, mid('seven', 0.82), 0.3, linear) * (0.45 + 0.55 * wave(t, 0.9)),
        t, orbit: 10 * calm,
      });
      op(clName, aB > aH ? 1 - shrink : 1);
    }
    const rp = P(t, mid('seven', 0.03), 0.5, pop), rm = P(t, T7 + 0.1, 0.8);
    op(rnm, clamp(rp * 2) * (1 - P(t, at('pairs') - 0.05, 0.35, linear)));
    tr(rnm, lerp(600, 660 + rnm.w / 2, rm), lerp(604, 290, rm), 0.85 + 0.15 * clamp(rp));
    const a7 = win(t, mid('seven', 0.38), at('pairs') + 0.3, 0.35);
    op(sevenG, a7);
    if (a7 > 0) {
      op(cfg, P(t, mid('seven', 0.42), 0.4, linear));
      op(outerT, P(t, mid('seven', 0.56), 0.4, linear));
      op(gapNote, P(t, mid('seven', 0.8), 0.4, linear));
    }

    /* --- C: Cl2 --- */
    const aC = win(t, at('pairs') + 0.1, at('fluorine') + 0.1, 0.45);
    op(pairG, aC);
    if (aC > 0) {
      const ia = P(t, at('pairs') + 0.15, 0.5, linear);
      const mv = P(t, mid('pairs', 0.1), 1.1), inB = P(t, mid('pairs', 0.1), 1.1, easeOut);
      const click = mid('pairs', 0.1) + 1.1;
      const bump = Math.sin(Math.PI * P(t, click, 0.35, linear));
      tr(pA, lerp(ATX, 600 - 41, mv) - bump * 4, lerp(ATY, 420, mv), (0.6 + 0.4 * ia) * (1 + 0.05 * bump));
      op(pA, ia);
      tr(pB, lerp(1180, 600 + 41, inB) + bump * 4, 420, 1 + 0.05 * bump);
      op(pB, P(t, mid('pairs', 0.1), 0.3, linear));
      const cs = win(t, click - 0.05, click + 0.6, 0.15);
      op(clickSpark, cs); if (cs > 0) { tr(clickSpark, 600, 420, 0.7 + 0.6 * P(t, click, 0.5, easeOut)); clickSpark.upd(t); }
      op(diLbl, P(t, mid('pairs', 0.34), 0.4, linear));
      op(diSub, P(t, mid('pairs', 0.44), 0.4, linear));
      const cl2 = P(t, mid('pairs', 0.9), 0.5, pop); op(cl2Lbl, clamp(cl2 * 2));
      cl2Lbl.setAttribute('transform', `translate(600 306) scale(${(0.8 + 0.2 * cl2).toFixed(3)}) translate(-600 -306)`);
      const gs = P(t, mid('pairs', 0.6), 0.6, linear);
      op(gasLbl, P(t, mid('pairs', 0.66), 0.5, linear));
      const bx = (v, lo, hi) => { const L = hi - lo, m = ((v - lo) % (2 * L) + 2 * L) % (2 * L); return lo + (m < L ? m : 2 * L - m); };
      gasPairs.forEach((q, k) => {
        const u = t * calm;
        tr(q.g, bx(q.x0 + q.vx * u, q.left ? 60 : 870, q.left ? 330 : 1140), bx(q.y0 + q.vy * u, 190, 640), 1, (u * 30 + k * 47) % 360);
        op(q.g, gs * 0.9 * P(t, mid('pairs', 0.6) + k * 0.1, 0.4, linear));
      });
    }

    /* --- D: the shelf, then the states --- */
    const aD = win(t, at('fluorine') - 0.25, at('clowns') - 0.05, 0.4);
    op(shelfG, aD);
    const stP = P(t, at('state') - 0.1, 0.9);              // samples shrink and rise for the states
    if (aD > 0) {
      samples.forEach((o, i) => {
        const pin = P(t, at('fluorine') - 0.2 + i * 0.12, 0.6, pop);
        tr(o.g, CX4[i], lerp(SHELF, 300, stP) + (1 - clamp(pin)) * 24, lerp(1, 0.55, stP) * (0.9 + 0.1 * clamp(pin)));
        op(o.g, clamp(pin * 2));
        const cue = ['fluorine', 'chlorine', 'bromine', 'iodine'][i];
        op(o.lab, P(t, i === 0 ? mid('fluorine', 0.5) : at(cue) - 0.1, 0.4, linear) * (1 - P(t, at('state') - 0.1, 0.4, linear)));
        op(o.prop, P(t, i === 0 ? mid('fluorine', 0.72) : mid(cue, i === 3 ? 0.18 : 0.12), 0.4, linear));
      });
      tr(plank, 0, lerp(0, 300 - SHELF, stP));
      op(plank, P(t, at('fluorine') - 0.2, 0.6, linear));
      // fluorine and chlorine fill with gas; bromine with liquid, then its vapour
      const sf = samples[0], sc = samples[1], sb = samples[2], si = samples[3];
      const fF = P(t, mid('fluorine', 0.55), 1.4, easeOut), fC = P(t, at('chlorine') + 0.1, 1.4, easeOut);
      sf.gas.set(fF); sc.gas.set(fC);
      sb.flask.set(0.34 * P(t, at('bromine') + 0.1, 0.9, easeOut));
      const fB = P(t, mid('bromine', 0.24), 1.6, easeOut);
      sb.gas.set(lerp(0.2, 1, fB) * P(t, mid('bromine', 0.22), 0.3, linear));
      [[sf, fF, 0], [sc, fC, 1.3], [sb, fB, 2.6]].forEach(([o, f, ph]) => {
        op(o.sw, f * (0.6 + 0.4 * wave(t, 3.2, ph / 3.2)));
        tr(o.sw.drift, Math.sin(t * 0.7 * calm + ph) * 10, -Math.cos(t * 0.5 * calm + ph) * 8);
      });
      // iodine: crystals, a gentle flame, purple vapour
      const xp = P(t, at('iodine') - 0.05, 0.5, pop);
      op(si.xtal, clamp(xp * 2)); tr(si.xtal, 0, (1 - clamp(xp)) * -30);
      si.bun.set(t >= mid('iodine', 0.4) && t < at('state') + 0.4 ? 'blue' : 'off'); si.bun.upd(t * calm);
      const vap = P(t, mid('iodine', 0.45), 1.8, easeOut) * (1 - 0.35 * P(t, at('state'), 1.0, linear));
      si.gas.set(vap > 0 ? lerp(0.1, 1, vap) : 0);
      op(si.wisp, vap * (1 - P(t, at('state') - 0.2, 0.4, linear))); si.wisp.upd(t * calm);
      // chlorine's uses
      const ua = win(t, mid('chlorine', 0.34), at('bromine') + 0.1, 0.4);
      op(useG, ua);
      if (ua > 0) {
        const pm = P(t, mid('chlorine', 0.34), 0.5, pop); op(mic, clamp(pm * 2)); tr(mic, 744, 242, Math.max(0.01, pm));
        const pp1 = P(t, mid('chlorine', 0.66), 0.5, pop); op(pool, clamp(pp1 * 2)); tr(pool, 638, 250 + (1 - clamp(pp1)) * 14);
        const pp2 = P(t, mid('chlorine', 0.82), 0.5, pop); op(tap, clamp(pp2 * 2)); tr(tap, 846, 250 + (1 - clamp(pp2)) * 14);
        const du = ((t - mid('chlorine', 0.9)) / 1.1) % 1, dripping = t > mid('chlorine', 0.9);
        tr(tap.drop, 0, dripping ? du * 16 : 0); op(tap.drop, dripping ? Math.min(1, (1 - du) * 3) : 1);
      }
      // mercury, the other liquid element
      const ha = P(t, mid('bromine', 0.43), 0.5, pop) * (1 - P(t, at('state') - 0.2, 0.4, linear));
      op(hgG, clamp(ha * 2)); tr(hgG, 846, SHELF - (1 - clamp(ha)) * 20);
      op(liqChip, win(t, mid('bromine', 0.62), at('iodine') + 0.2, 0.4));
      op(purpleLbl, P(t, mid('iodine', 0.64), 0.4, linear) * (1 - P(t, at('state') - 0.2, 0.4, linear)));
    }
    const aS = win(t, at('state') + 0.1, at('clowns') - 0.05, 0.4);
    op(stateG, aS);
    if (aS > 0) {
      pboxes.forEach((b, i) => {
        const p = P(t, mid('state', [0.28, 0.33, 0.38, 0.5][i]), 0.5, pop);
        op(b.g, clamp(p * 2)); tr(b.g, CX4[i] - 64, 330 + (1 - clamp(p)) * 18);
        b.box.set(b.st, t, b.st === 'gas' ? 0.5 * calm : 0.35 * calm);
      });
      bars.forEach((b, i) => {      // early enough that iodine's 184 °C is held for a second before the fade
        const g = P(t, mid('state', 0.56 + i * 0.06), 0.6, easeOut);
        attr(b.r, 'y', BAR0 - b.h * g); attr(b.r, 'height', b.h * g);
        op(b.v, P(t, mid('state', 0.56 + i * 0.06) + 0.4, 0.3, linear));
      });
      op(barsG, P(t, mid('state', 0.52), 0.4, linear));
    }

    /* --- E: Funny Clowns Bring Ice --- */
    const aE = win(t, at('clowns') + 0.3, at('twist') + 0.2, 0.4);
    op(mnG, aE);
    if (aE > 0) words.forEach((w, i) => {
      const t0 = mid('clowns', [0.28, 0.36, 0.41, 0.45][i]), p = P(t, t0, 0.45, pop);
      op(w, clamp(p * 2));
      tr(w, CX4[i], 288 + (1 - clamp(p)) * 20, 0.8 + 0.2 * p, (i % 2 ? 4 : -4) * Math.sin(Math.PI * P(t, t0, 0.6, linear)));
    });

    /* --- F: the twist --- */
    const aF = win(t, at('twist') + 0.2, at('displace') - 0.1, 0.4);
    op(twG, aF);
    if (aF > 0) {
      w7.set(P(t, mid('twist', 0.12), 1.4));
      op(decT, P(t, mid('twist', 0.22), 0.5, linear));
      op(g1G, 0.5 * P(t, mid('twist', 0.47), 0.7, linear));
      w1.set(P(t, mid('twist', 0.5), 1.2));
      const mc = P(t, mid('twist', 0.82), 0.5, pop);
      op(mostChip, clamp(mc * 2)); tr(mostChip, 902, 214, 0.8 + 0.2 * clamp(mc));
    }

    /* --- G: displacement --- */
    const aG = win(t, at('displace') - 0.1, at('gain') + 0.1, 0.45);
    op(dG, aG);
    if (aG > 0) {
      tr(dTube, TUBE[0], TUBE[1] + (1 - P(t, at('displace') - 0.1, 0.6, easeOut)) * 24);
      op(tubeLbl, P(t, mid('displace', 0.5), 0.4, linear));
      op(stripG, P(t, mid('displace', 0.05), 0.4, linear));
      // the solution: colourless -> orange
      const col = P(t, mid('displace', 0.8), 2.2, ease);
      dTube.liquid.setAttribute('fill', _ptMix('#DCEFF8', ORANGE, col));
      attr(dTube.liquid, 'opacity', lerp(0.3, 0.88, col));
      op(stClear, 1 - clamp((col - 0.4) / 0.2)); op(stOrange, clamp((col - 0.4) / 0.2));
      // dropper of chlorine water
      const dIn = P(t, mid('displace', 0.42), 0.6, easeOut), dOut = 1 - P(t, mid('displace', 0.9), 0.6, linear);
      tr(dropper, TUBE[0], lerp(60, 150, dIn)); op(dropper, dIn * dOut); op(cwLbl, dIn * dOut);
      drops.forEach((d, k) => {
        const u = clamp((t - mid('displace', 0.5 + k * 0.06)) / 0.55);
        if (u <= 0 || u >= 1) { op(d, 0); return; }
        tr(d, TUBE[0], lerp(DROP_Y0, liqY, u * u)); op(d, Math.min(1, (1 - u) * 6));
      });
      // the zoom: sodium bromide; chlorine arrives; bromine is pushed out and pairs up
      const zIn = P(t, mid('displace', 0.1), 0.6, linear);
      op(zoomG, zIn);
      insBg.setAttribute('fill', _ptMix('#DCEFF8', ORANGE, col)); attr(insBg, 'opacity', lerp(0.07, 0.2, col));
      if (zIn > 0) {
        const place = (el, p, k) => tr(el, INS[0] + p[0] + Math.sin(t * 2.2 * calm + k * 1.7) * 3 * calm, INS[1] + p[1] + Math.cos(t * 1.8 * calm + k * 2.2) * 3 * calm);
        const lp = (a, b, p) => [lerp(a[0], b[0], p), lerp(a[1], b[1], p)];
        const cIn = P(t, mid('displace', 0.55), 1.3, easeOut);
        const swA = P(t, mid('displace', 0.72), 1.1), swB = P(t, mid('displace', 0.79), 1.1);
        const pushA = P(t, mid('displace', 0.72) + 0.55, 1.0), pushB = P(t, mid('displace', 0.79) + 0.55, 1.0);
        place(pp.naA, P0.naA, 0); place(pp.naB, P0.naB, 1);
        place(pp.clA, lp(lp(P0.clA0, P0.clA1, cIn), P0.brA, swA), 2);
        place(pp.clB, lp(lp(P0.clB0, P0.clB1, cIn), P0.brB, swB), 3);
        place(pp.brA, lp(P0.brA, P0.brAend, pushA), 4); place(pp.brB, lp(P0.brB, P0.brBend, pushB), 5);
        op(brHalo, P(t, mid('displace', 0.86), 0.8, linear) * (0.75 + 0.25 * wave(t, 1.4))); tr(brHalo, INS[0] + 108, INS[1] - 14);
        op(br2Lbl, P(t, mid('displace', 0.9), 0.4, linear));
      }
      op(eq, P(t, mid('displace', 0.84), 0.6, linear)); tr(eq, 0, (1 - P(t, mid('displace', 0.84), 0.6, easeOut)) * 12);
    }

    /* --- H: gaining one electron (the atom itself is drawn in B) --- */
    const aGain = win(t, at('gain') - 0.1, at('grip') + 0.1, 0.4);
    op(gainG, aGain);
    if (aGain > 0) {
      op(whyChip, P(t, at('gain'), 0.4, linear));
      op(gainT, P(t, mid('gain', 0.48), 0.4, linear));
      op(fillT, P(t, mid('gain', 0.76), 0.4, linear));
      const fp = P(t, mid('gain', 0.5) + 1.3, 0.5, pop); op(fullT, clamp(fp * 2));
    }

    /* --- I: fluorine grips, iodine lets go --- */
    const aI = P(t, at('grip') - 0.15, 0.5, linear);
    op(gripG, aI);
    if (aI > 0) {
      const fIn = P(t, at('grip') - 0.15, 0.6, pop), iIn = P(t, at('grip') + 0.1, 0.6, pop);
      tr(fAt, FX, AY, Math.max(0.01, 0.8 + 0.2 * fIn)); op(fAt, clamp(fIn * 2));
      tr(iG, IX, AY, Math.max(0.01, 0.8 + 0.2 * iIn)); op(iG, clamp(iIn * 2));
      op(nameF, clamp(fIn * 2)); op(nameI, clamp(iIn * 2));
      const fe = P(t, mid('grip', 0.56), 1.5, linear);
      fAt.set({ e: 9 + fe, gap: 0.6 + 0.4 * wave(t, 0.9), outer: P(t, mid('grip', 0.56) + 1.5, 0.5, linear) });
      iAt.set({ e: 7, gap: 0.6 + 0.4 * wave(t, 0.9, 0.3), t: 1, orbit: 180 });
      dF.set(P(t, mid('grip', 0.1), 0.6)); op(dF, P(t, mid('grip', 0.1), 0.2, linear));
      dI.set(P(t, mid('grip', 0.2), 0.8)); op(dI, P(t, mid('grip', 0.2), 0.2, linear));
      op(fL1, P(t, mid('grip', 0.12), 0.4, linear)); op(iL1, P(t, mid('grip', 0.22), 0.4, linear));
      op(curtain, P(t, mid('grip', 0.39), 0.7, linear)); op(iL2, P(t, mid('grip', 0.41), 0.4, linear));
      // fluorine reels its electron in
      if (fe > 0 && fe < 1) {
        const [x, y] = fFly(ease(fe));
        attr(pullF, 'x2', x); attr(pullF, 'y2', y); op(pullF, 0.9 * Math.min(1, fe * 5, (1 - fe) * 4));
      } else op(pullF, 0);
      // iodine's passer-by: a faint tug, then it slips away
      const u = P(t, mid('grip', 0.6), 3.0, linear);
      if (u > 0 && u < 1) {
        const [x, y] = iPass(u);
        tr(freeE, x, y); op(freeE, Math.min(1, u * 8, (1 - u) * 8));
        attr(pullI, 'x2', x); attr(pullI, 'y2', y);
        op(pullI, 0.55 * Math.sin(Math.PI * clamp((u - 0.25) / 0.5)) * (0.7 + 0.3 * wave(t, 0.35)));
      } else { op(freeE, 0); op(pullI, 0); }
      const g3 = P(t, mid('grip', 0.66), 0.5, pop); op(fL3, clamp(g3 * 2));
      const g4 = P(t, mid('grip', 0.8), 0.5, pop); op(iL3, clamp(g4 * 2));
      op(fallG, P(t, mid('grip', 0.86), 0.6, linear)); fallA.set(P(t, mid('grip', 0.86), 0.7));
    }
  };
});
