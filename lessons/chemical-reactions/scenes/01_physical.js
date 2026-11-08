/* Physical or chemical change?
   Two columns drop in: physical (blue, left) and chemical (red, right)
   -> physical: an ice cube melts into a puddle while its water molecules go from a solid lattice to a
      jumbled liquid, the same molecules throughout: "no new substance"
   -> melting, boiling and sugar dissolving in tea: "still water", "still sugar"
   -> the puddle refreezes and the molecules line up again: two-way arrows, "easy to reverse"
   -> chemical: 2 H2 + O2 regroup into 2 H2O: two gases make a liquid, "new substance, new properties"
   -> a log burns to ash, smoke and gases; the way back gets a cross: "hard to reverse"
   -> "new substance?" under a magnifier: burning, rusting, cooking and neutralising each get a tick
   -> showpiece: an egg cracks into a pan, no flames, no smoke, but still chemical; a zoom shows its loose
      protein chains unfolding and tangling into a network; a crossed-out way back: "can't un-cook". */
scene('physical', S => {
  const { at, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;
  const PHY = C.water, CHE = '#FF7466', CHEtx = '#FF9A8F';

  /* ---------- local art ---------- */
  // ice cube drawn in 3D, centred, 2s tall (as in Elements, Compounds & Mixtures)
  function iceCube(parent, s) {
    const g = G(parent), k = s * 0.87;
    E('path', { d: `M${-k},${-s * 0.5} L0,0 L0,${s} L${-k},${s * 0.5} Z`, fill: '#A9DDF6', stroke: '#E8F7FF', 'stroke-width': 1.5, 'stroke-linejoin': 'round' }, g);
    E('path', { d: `M0,0 L${k},${-s * 0.5} L${k},${s * 0.5} L0,${s} Z`, fill: '#7FC4EA', stroke: '#E8F7FF', 'stroke-width': 1.5, 'stroke-linejoin': 'round' }, g);
    E('path', { d: `M0,${-s} L${k},${-s * 0.5} L0,0 L${-k},${-s * 0.5} Z`, fill: '#E4F6FF', stroke: '#FFFFFF', 'stroke-width': 1.5, 'stroke-linejoin': 'round' }, g);
    return g;
  }
  // an ice cube standing on y = 0 that melts into a puddle: g.set(m 0..1)
  function meltingIce(parent, s) {
    const g = G(parent);
    const puddle = E('ellipse', { cx: 0, cy: 0, rx: s, ry: s * 0.2, fill: 'rgba(76,201,240,0.5)', stroke: 'rgba(190,235,252,0.85)', 'stroke-width': 2.5 }, g);
    const shine = E('ellipse', { cx: -s * 0.35, cy: -s * 0.04, rx: s * 0.3, ry: s * 0.06, fill: '#FFFFFF', opacity: 0.45 }, g);
    const cubeG = G(g); tr(iceCube(cubeG, s), 0, -s);
    g.set = m => {
      m = clamp(m);
      cubeG.setAttribute('transform', `scale(${(1 - 0.45 * m).toFixed(3)} ${Math.max(0.02, 1 - 0.9 * m).toFixed(3)})`);
      op(cubeG, 1 - P(m, 0.86, 0.14, linear));
      attr(puddle, 'rx', s * (0.95 + 1.05 * m)); attr(puddle, 'ry', s * (0.14 + 0.16 * m));
      op(puddle, 0.2 + 0.8 * clamp(m * 3));
      attr(shine, 'rx', s * (0.2 + 0.45 * m)); op(shine, clamp(m * 2) * 0.45);
    };
    g.set(0);
    return g;
  }
  // a box of 12 water molecules, w x h with its top-left at (0,0), in the kit's particleBox style.
  // g.set(m, t): m = 0 a neat vibrating lattice (solid), m = 1 jumbled, tumbling and sliding (liquid)
  function waterBox(parent, w, h, seed) {
    const g = G(parent);
    E('rect', { x: -6, y: -6, width: w + 12, height: h + 12, rx: 10, fill: 'rgba(200,230,250,0.06)', stroke: '#CFE7F5', 'stroke-width': 3 }, g);
    const rr = rng(seed), cols = 4, rows = 3, sx = w / cols, sy = h / rows, ps = [];
    for (let i = 0; i < cols * rows; i++) {
      const c = i % cols, r = Math.floor(i / cols);
      ps.push({ m: molH2O(g, 12), lx: (c + 0.5) * sx, ly: h - (r + 0.5) * sy, jx: (c + 0.5 + (rr() - 0.5) * 0.55) * sx, jy: h - 6 - (r + 0.5 + (rr() - 0.5) * 0.4) * sy * 0.9, ja: (rr() - 0.5) * 300, sw: 20 + rr() * 30, ph: rr() * TAU });
    }
    g.set = (m, t) => {
      ps.forEach(p => {
        const vx = Math.sin(t * 17 + p.ph) * 1.3 * calm, vy = Math.cos(t * 21 + p.ph) * 1.3 * calm;
        const qx = p.jx + Math.sin(t * 0.8 + p.ph) * 9 * calm, qy = p.jy + Math.cos(t * 1.1 + p.ph) * 3 * calm;
        tr(p.m, lerp(p.lx + vx, qx, m), lerp(p.ly + vy, qy, m), 1, m * (p.ja + p.sw * Math.sin(t * 0.6 + p.ph) * calm));
      });
    };
    g.set(0, 0);
    return g;
  }
  // a hot plate, w wide, top surface at y = 0
  function hotPlate(parent, w) {
    const g = G(parent);
    E('rect', { x: -w / 2, y: 0, width: w, height: 18, rx: 5, fill: '#56636F', stroke: '#8B9AA8', 'stroke-width': 2 }, g);
    E('rect', { x: -w / 2 + 10, y: -4, width: w - 20, height: 6, rx: 3, fill: '#FF6A3D' }, g);
    E('rect', { x: -w / 2 + 6, y: -16, width: w - 12, height: 18, rx: 9, fill: glow('#FF6A3D'), opacity: 0.8 }, g);
    return g;
  }
  // a wooden log about 170 x 54 lying on y = 0; g.set(burnt 0..1) chars it
  function logArt(parent) {
    const g = G(parent);
    E('rect', { x: -85, y: -54, width: 170, height: 54, rx: 26, fill: linGrad('#A86C3B', '#5E3519', true), stroke: '#3E2210', 'stroke-width': 3 }, g);
    E('path', { d: 'M-60,-36 Q-20,-42 20,-36 M-48,-18 Q0,-24 40,-17', fill: 'none', stroke: '#4A2A12', 'stroke-width': 3, 'stroke-linecap': 'round', opacity: 0.6 }, g);
    E('ellipse', { cx: 70, cy: -27, rx: 17, ry: 26, fill: '#DDAE70', stroke: '#8A5A2B', 'stroke-width': 3 }, g);
    E('ellipse', { cx: 70, cy: -27, rx: 8, ry: 13, fill: 'none', stroke: '#A8763E', 'stroke-width': 2 }, g);
    const ch = E('rect', { x: -85, y: -54, width: 170, height: 54, rx: 26, fill: '#2C2522', stroke: '#17110E', 'stroke-width': 3 }, g);
    const embers = E('path', { d: 'M-50,-30 l14,4 M-10,-40 l12,-3 M20,-24 l16,3 M46,-38 l10,6', stroke: '#FF7A2E', 'stroke-width': 4, 'stroke-linecap': 'round' }, g);
    g.set = b => { op(ch, clamp(b) * 0.9); op(embers, clamp(b * 2) * (1 - P(b, 0.9, 0.1, linear))); };
    g.set(0);
    return g;
  }
  // a pile of grey ash standing on y = 0
  function ashPile(parent) {
    const g = G(parent);
    E('path', { d: 'M-78,0 C-60,-26 -30,-46 0,-46 C30,-46 60,-26 78,0 Z', fill: linGrad('#B4B9BE', '#6C7379', true), stroke: '#8E959B', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, g);
    const rr = rng(31); let d = '';
    for (let i = 0; i < 22; i++) { const x = (rr() - 0.5) * 120, y = -rr() * 34 * (1 - Math.abs(x) / 80); d += `M${x.toFixed(1)},${(y - 4).toFixed(1)} h3 `; }
    E('path', { d, stroke: '#4E555B', 'stroke-width': 3, 'stroke-linecap': 'round' }, g);
    return g;
  }
  // a frying pan seen from the front and above, centred, rim rx x ry
  function fryingPan(parent, rx, ry) {
    const g = G(parent);
    E('path', { d: `M${-rx * 0.8},${ry * 0.55} L${-rx * 1.32},${ry * 1.55}`, stroke: '#1F272E', 'stroke-width': 30, 'stroke-linecap': 'round' }, g);
    E('path', { d: `M${-rx * 0.8},${ry * 0.55} L${-rx * 1.32},${ry * 1.55}`, stroke: '#3C4650', 'stroke-width': 22, 'stroke-linecap': 'round' }, g);
    E('ellipse', { cx: 0, cy: 10, rx: rx * 1.01, ry: ry * 1.05, fill: '#1B2329' }, g);
    E('ellipse', { rx, ry, fill: '#2C3740', stroke: '#7A8994', 'stroke-width': 4 }, g);
    E('ellipse', { cx: 0, cy: 7, rx: rx * 0.88, ry: ry * 0.8, fill: '#151D23' }, g);
    return g;
  }
  // a magnifying glass, lens radius r, handle to the bottom-right
  function magnifier(parent, r) {
    const g = G(parent);
    E('line', { x1: r * 0.7, y1: r * 0.7, x2: r * 1.6, y2: r * 1.6, stroke: '#C9D6DE', 'stroke-width': r * 0.28, 'stroke-linecap': 'round' }, g);
    E('circle', { r, fill: 'rgba(159,216,255,0.10)', stroke: '#E4EDF2', 'stroke-width': r * 0.15 }, g);
    E('path', { d: `M${-r * 0.62},${-r * 0.3} A${r * 0.7},${r * 0.7} 0 0 1 ${-r * 0.2},${-r * 0.66}`, stroke: '#ffffff', 'stroke-width': r * 0.08, fill: 'none', opacity: 0.55, 'stroke-linecap': 'round' }, g);
    return g;
  }
  // flame and smoke icons for "no flames, no smoke"
  function flameIcon(parent) {
    return E('path', { d: 'M0,-44 C24,-16 32,4 26,20 C20,36 8,44 0,44 C-8,44 -22,36 -26,20 C-30,6 -16,-8 -9,-22 C-7,-9 -2,-4 4,-2 C8,-15 4,-30 0,-44 Z', fill: '#FF8A3D', stroke: '#FFC27A', 'stroke-width': 3 }, parent);
  }
  function smokeIcon(parent) {
    return E('path', { d: 'M-40,20 C-60,20 -60,-6 -40,-8 C-44,-30 -14,-38 -4,-22 C4,-40 34,-36 34,-14 C56,-14 56,20 34,20 Z', fill: '#8A9BAA', stroke: '#C4D0DA', 'stroke-width': 3 }, parent);
  }
  const DROP = 'M0,-14 C8,-4 10,2 10,6 A10,10 0 0 1 -10,6 C-10,2 -8,-4 0,-14 Z';

  /* ===== the two columns ===== */
  const colsG = G(root);
  const left = G(colsG), right = G(colsG);
  card(left, 40, 200, 540, 510, { fill: 'rgba(76,201,240,0.05)', stroke: 'rgba(76,201,240,0.4)' });
  card(right, 620, 200, 540, 510, { fill: 'rgba(255,116,102,0.05)', stroke: 'rgba(255,116,102,0.4)' });
  const hdrL = chip(colsG, 'physical', { size: 40, fill: '#0F3747', stroke: PHY, color: PHY });
  const hdrR = chip(colsG, 'chemical', { size: 40, fill: '#43201F', stroke: CHE, color: CHEtx });

  /* --- physical column: ice, molecules, chips --- */
  const phyDemo = G(left);
  const ice = meltingIce(phyDemo, 46); tr(ice, 150, 470);
  E('line', { x1: 62, y1: 470, x2: 238, y2: 470, stroke: C.faint, 'stroke-width': 3, 'stroke-linecap': 'round' }, phyDemo);
  const box = waterBox(phyDemo, 220, 160, 5); tr(box, 300, 310);
  const lbIce = T(phyDemo, 150, 282, 'ice', { size: 30, weight: 700, anchor: 'middle', fill: '#BFE9FA' });
  const lbWat = T(phyDemo, 150, 282, 'water', { size: 30, weight: 700, anchor: 'middle', fill: PHY });
  const lbSol = T(phyDemo, 410, 282, 'solid', { size: 30, weight: 700, anchor: 'middle', fill: '#BFE9FA' });
  const lbLiq = T(phyDemo, 410, 282, 'liquid', { size: 30, weight: 700, anchor: 'middle', fill: PHY });
  const twoWay = G(left);
  arrow(twoWay, 236, 522, 384, 522, { color: PHY, width: 6 });
  arrow(twoWay, 384, 550, 236, 550, { color: PHY, width: 6 });
  const chipNone = chip(left, 'no new substance', { size: 28, fill: '#0F3747', stroke: PHY, color: '#BFE9FA' }); tr(chipNone, 310, 606);
  const chipEasy = chip(left, 'easy to reverse', { size: 28, fill: '#0F3747', stroke: PHY, color: '#BFE9FA' }); tr(chipEasy, 310, 666);

  /* --- three everyday physical changes --- */
  const egs = G(left);
  const egLbl = [['melting', 140], ['boiling', 310], ['dissolving', 480]].map(([s, x]) => T(egs, x, 282, s, { size: 28, weight: 700, anchor: 'middle' }));
  const egA = G(egs), egB = G(egs), egC = G(egs);
  const ice2 = meltingIce(egA, 30); tr(ice2, 140, 452);
  E('line', { x1: 80, y1: 452, x2: 200, y2: 452, stroke: C.faint, 'stroke-width': 3, 'stroke-linecap': 'round' }, egA);
  const plate = hotPlate(egB, 120); tr(plate, 310, 462);
  const bk = beaker(egB, 96, 112, { level: 0.62, liquid: C.water }); tr(bk, 310, 404);
  const boil = bubbles(egB, 272, 384, 76, 66, { n: 9, r: 6, seed: 7, speed: 0.9 });
  const steam = heatWaves(egB, { n: 3, h: 34, spacing: 22, color: '#DCEBF4', width: 4 }); tr(steam, 310, 344);
  const handle = E('path', { d: 'M528,370 C562,370 562,420 528,420', fill: 'none', stroke: '#CFE7F5', 'stroke-width': 7, 'stroke-linecap': 'round' }, egC);
  const tea = beaker(egC, 96, 112, { level: 0.68, liquid: '#A5642C', marks: false }); tr(tea, 480, 400);
  const sugarG = G(egC);
  E('rect', { x: -13, y: -13, width: 26, height: 26, rx: 4, fill: ball('#FFFFFF', '#C9D3DA'), stroke: '#9DAAB4', 'stroke-width': 2 }, sugarG);
  const sr = rng(19), sugarBits = [];
  for (let k = 0; k < 12; k++) sugarBits.push({ el: E('rect', { x: -2.5, y: -2.5, width: 5, height: 5, rx: 1, fill: '#FFFFFF' }, egC), x: 446 + sr() * 68, y: 388 + sr() * 54, ph: sr() * TAU });
  const tagW = chip(egs, 'still water', { size: 26, fill: '#0F3747', stroke: PHY, color: '#BFE9FA' }); tr(tagW, 225, 528);
  const tagS = chip(egs, 'still sugar', { size: 26, fill: '#3A3020', stroke: C.glucose, color: C.glucoseLt }); tr(tagS, 480, 528);

  /* --- chemical column: hydrogen + oxygen -> water --- */
  const chemG = G(right);
  const recs = [];
  const mk = (kind, x0, y0, x1, y1, st) => { const r = { kind, x0, y0, x1, y1, st, el: null }; recs.push(r); return r; };
  const TC = mid('chem', 0.4), FLY = 1.1;
  // H2 at (690,345) and (690,445), O2 at (778,395) -> H2O at (1000,350) and (1068,440)
  [[690, 345, 1000, 350], [690, 445, 1068, 440]].forEach(([x, y, wx, wy], i) => {
    mk('H', x - 10, y, wx - 23.5, wy + 11, TC + i * 0.25);
    mk('H', x + 10, y, wx + 23.5, wy + 11, TC + i * 0.25 + 0.05);
  });
  mk('O', 778 - 17, 395, 1000, 344, TC); mk('O', 778 + 17, 395, 1068, 434, TC + 0.25);
  recs.forEach((r, i) => { r.r = r.kind === 'O' ? 24 : 15; r.bend = -90 - i * 14; r.el = null; });
  const ghostC = G(chemG);
  recs.forEach(r => { r.ghost = E('circle', { cx: r.x0, cy: r.y0, r: r.r - 1, fill: 'none', stroke: ATOM[r.kind][0], 'stroke-width': 2, 'stroke-dasharray': '4 4' }, ghostC); });
  ['H', 'O'].forEach(kind => recs.filter(r => r.kind === kind).forEach(r => { r.el = atom(chemG, kind, r.r, { letter: kind === 'O' }); }));
  const chemArrow = arrow(chemG, 850, 395, 912, 395, { color: C.ink, width: 6 });
  const lbHO = T(chemG, 732, 282, 'hydrogen + oxygen', { size: 26, weight: 700, anchor: 'middle' });
  const lbW = T(chemG, 1032, 282, 'water', { size: 30, weight: 700, anchor: 'middle', fill: PHY });
  const propL = G(chemG), propR = G(chemG);
  T(propL, 732, 538, 'both gases', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  E('path', { d: 'M-22,8 C-36,8 -36,-10 -22,-10 C-22,-24 0,-26 4,-14 C12,-22 28,-16 24,-4 C36,-2 34,8 24,8 Z', fill: 'rgba(200,230,250,0.25)', stroke: '#CFE7F5', 'stroke-width': 2.5, transform: 'translate(732 498) scale(1.35)' }, propL);
  T(propR, 1032, 538, 'a liquid', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  E('path', { d: DROP, fill: ball(C.water, C.waterDk), stroke: '#BDEBFA', 'stroke-width': 2, transform: 'translate(1032 500) scale(1.4)' }, propR);
  const chipNew = chip(right, 'new substance, new properties', { size: 28, fill: '#43201F', stroke: CHE, color: CHEtx }); tr(chipNew, 890, 606);

  /* --- chemical column: burning wood --- */
  const woodG = G(right);
  const lbWood = T(woodG, 732, 282, 'wood', { size: 30, weight: 700, anchor: 'middle', fill: '#DDAE70' });
  const lbAsh = T(woodG, 1032, 282, 'ash, smoke, gases', { size: 28, weight: 700, anchor: 'middle', fill: '#C9D2D8' });
  const logGhost = E('rect', { x: 647, y: 416, width: 170, height: 54, rx: 26, fill: 'none', stroke: '#DDAE70', 'stroke-width': 2.5, 'stroke-dasharray': '7 6' }, woodG);
  const logG = G(woodG), log = logArt(logG);
  const logFlame = rxFlame(woodG, 0.9, { smoke: true });
  const woodArrow = arrow(woodG, 850, 410, 912, 410, { color: C.ink, width: 6 });
  const pileG = G(woodG), pile = ashPile(pileG);
  const puffs = [], pr = rng(23);
  for (let k = 0; k < 6; k++) puffs.push({ el: E('circle', { r: 16 + pr() * 10, fill: '#8C969E' }, woodG), ph: k / 6, dx: (pr() - 0.5) * 30 });
  const gases = [molCO2(woodG, 9), molH2O(woodG, 11), molCO2(woodG, 9)].map((m, k) => ({ m, ph: k / 3, x: 1098 + (k % 2) * 16 }));
  const back = G(woodG);
  arrow(back, 1010, 498, 760, 498, { color: CHE, width: 6, bend: -46 });
  const backX = cross(back, 20); tr(backX, 885, 532);
  const chipHard = chip(right, 'hard to reverse', { size: 28, fill: '#43201F', stroke: CHE, color: CHEtx }); tr(chipHard, 890, 666);

  /* ===== "new substance?" ===== */
  const testG = G(root);
  const qCard = G(testG);
  card(qCard, 290, 180, 620, 140, { fill: C.card2, stroke: C.energy, sw: 3 });
  T(qCard, 548, 270, 'new substance?', { size: 58, weight: 700, anchor: 'middle' });
  const mag = magnifier(testG, 66);
  const ICX = [255, 485, 715, 945], ICY = 492;
  const icons = ['burning', 'rusting', 'cooking', 'neutralising'].map((label, i) => {
    const g = G(testG); tr(g, ICX[i], ICY);
    card(g, -100, -112, 200, 224, { fill: C.card, stroke: C.line });
    const art = G(g); tr(art, 0, -20);
    T(g, 0, 88, label, { size: 28, weight: 700, anchor: 'middle' });
    const tk = G(g); tr(tk, 72, -104);
    E('circle', { r: 24, fill: C.good, stroke: C.bg0, 'stroke-width': 4 }, tk);
    tick(tk, 11, C.bg0);
    return { g, art, tk };
  });
  const icFlame = rxFlame(icons[0].art, 0.62); tr(icFlame, 0, 40); icFlame.set('yellow', 1);
  E('path', { d: 'M-34,44 L34,44', stroke: '#7A4A22', 'stroke-width': 12, 'stroke-linecap': 'round' }, icons[0].art);
  const icNail = rxNail(icons[1].art, 140, { seed: 4 }); tr(icNail, 0, 0, 1, 35); icNail.set({ rust: 0.75 });
  const icPan = G(icons[2].art); tr(icPan, 6, 6, 0.62);
  fryingPan(icPan, 100, 46);
  E('path', { d: closedPath([[-62, 4], [-44, -24], [0, -32], [46, -22], [66, 2], [40, 26], [-6, 30], [-48, 22]]), fill: '#F6F8FA', stroke: '#D9E2E8', 'stroke-width': 2 }, icPan);
  E('ellipse', { cx: 6, cy: -2, rx: 22, ry: 17, fill: ball('#FFC93D', '#E08A00') }, icPan);
  const tA = testTube(icons[3].art, 30, 92, { level: 0.6, liquid: '#FF5A67' }); tr(tA, -52, -6, 1, -28);
  const tB = testTube(icons[3].art, 30, 92, { level: 0.6, liquid: '#7E6BFF' }); tr(tB, 52, -6, 1, 28);
  const bkN = beaker(icons[3].art, 62, 66, { level: 0.55, liquid: C.good, marks: false }); tr(bkN, 0, 38);
  const allNew = chip(testG, 'all make new substances', { size: 30, fill: 'rgba(86,214,155,0.16)', stroke: C.good, color: C.good }); tr(allNew, 600, 672);

  /* ===== showpiece: frying an egg ===== */
  const eggG = G(root);
  const hob = G(eggG);
  E('rect', { x: 110, y: 548, width: 560, height: 40, rx: 12, fill: '#2A343C', stroke: '#4A5964', 'stroke-width': 2 }, hob);
  const hobGlow = E('ellipse', { cx: 390, cy: 552, rx: 210, ry: 26, fill: glow('#FF6A3D') }, hob);
  const pan = G(eggG); tr(pan, 390, 470); fryingPan(pan, 200, 92);
  const PTS = [[-118, 6], [-92, -34], [-30, -50], [40, -46], [104, -28], [122, 8], [84, 40], [10, 50], [-60, 44], [-106, 30]];
  const whiteD = closedPath(PTS);
  const fill = G(eggG);
  const cooked = E('path', { d: whiteD, fill: '#F6F8FA', stroke: '#D9E2E8', 'stroke-width': 2.5 }, fill);
  const raw = E('path', { d: whiteD, fill: 'rgba(190,220,232,0.28)', stroke: 'rgba(225,240,247,0.8)', 'stroke-width': 3 }, fill);
  const shineE = E('path', { d: 'M-70,-16 Q-40,-34 0,-36', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 4, 'stroke-linecap': 'round', opacity: 0.5 }, fill);
  const yolk = E('ellipse', { cx: 18, cy: -6, rx: 36, ry: 27, fill: ball('#FFC93D', '#E08A00'), stroke: '#D98A12', 'stroke-width': 2.5 }, fill);
  const shellG = G(eggG);
  const shTop = G(shellG), shBot = G(shellG);
  E('path', { d: 'M-46,0 C-46,-40 -26,-62 0,-62 C26,-62 46,-40 46,0 L30,-10 L16,4 L2,-10 L-14,4 L-30,-10 Z', fill: ball('#F7EBD6', '#C9B08A'), stroke: '#E9D9BC', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, shTop);
  E('path', { d: 'M-46,0 L-30,-10 L-14,4 L2,-10 L16,4 L30,-10 L46,0 C46,34 26,52 0,52 C-26,52 -46,34 -46,0 Z', fill: ball('#F2E2C6', '#BFA37A'), stroke: '#E9D9BC', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, shBot);
  const crack = E('path', { d: 'M-46,0 L-30,-10 L-14,4 L2,-10 L16,4 L30,-10 L46,0', fill: 'none', stroke: '#6B5536', 'stroke-width': 3, 'stroke-linejoin': 'round', pathLength: 1, 'stroke-dasharray': '1 1' }, shellG);
  const noG = G(eggG);
  const noF = G(noG); tr(noF, 760, 196); flameIcon(noF); const xF = cross(noF, 30);
  const noS = G(noG); tr(noS, 920, 200); smokeIcon(noS); const xS = cross(noS, 30);
  const stillChip = chip(eggG, 'still a chemical change', { size: 30, fill: '#43201F', stroke: CHE, color: CHEtx }); tr(stillChip, 390, 318);
  // the zoom: protein chains in the egg white
  const ZX = 870, ZY = 400, ZR = 186, SPX = 316, SPY = 486, SPR = 26;
  const zoomG = G(eggG);
  const dZ = Math.atan2(ZY - SPY, ZX - SPX), nA = dZ + Math.PI / 2;
  const conn = E('path', { d: `M${SPX + Math.cos(nA) * SPR},${SPY + Math.sin(nA) * SPR} L${ZX + Math.cos(nA) * ZR},${ZY + Math.sin(nA) * ZR} M${SPX - Math.cos(nA) * SPR},${SPY - Math.sin(nA) * SPR} L${ZX - Math.cos(nA) * ZR},${ZY - Math.sin(nA) * ZR}`, stroke: C.muted, 'stroke-width': 2.5, 'stroke-dasharray': '6 6', fill: 'none' }, zoomG);
  E('circle', { cx: SPX, cy: SPY, r: SPR, fill: 'none', stroke: C.ink, 'stroke-width': 3 }, zoomG);
  const lensBg = E('circle', { cx: ZX, cy: ZY, r: ZR, fill: 'rgba(190,220,232,0.12)' }, zoomG);
  const lensCooked = E('circle', { cx: ZX, cy: ZY, r: ZR, fill: 'rgba(246,248,250,0.16)' }, zoomG);
  const cid = 'cr-physical-zoom';
  const cp = E('clipPath', { id: cid }, defs()); E('circle', { cx: ZX, cy: ZY, r: ZR - 3 }, cp);
  const chainsG = G(zoomG, { 'clip-path': `url(#${cid})` });
  E('circle', { cx: ZX, cy: ZY, r: ZR, fill: 'none', stroke: C.ink, 'stroke-width': 5 }, zoomG);
  // raw: seven separate, folded-up protein coils; cooked: the same chains unfolded into a woven mesh
  // (three across, four down) that is cross-linked where they cross
  const NPT = 24, chains = [], cr = rng(77);
  const CENT = [[-96, -84], [12, -112], [104, -58], [-110, 30], [0, 0], [100, 78], [-20, 108]];
  const MESH = [['h', -95, 0.12], ['h', -5, -0.1], ['h', 85, 0.08], ['v', -118, -0.14], ['v', -40, 0.1], ['v', 40, -0.08], ['v', 118, 0.13]];
  CENT.forEach(([cx, cy], i) => {
    const rawP = [], ckP = [], ang0 = cr() * TAU;
    for (let k = 0; k < NPT; k++) {
      const a = ang0 + k * 0.92, rad = 5 + 19 * Math.abs(Math.sin(k * 0.42 + i));
      rawP.push([cx + Math.cos(a) * rad, cy + Math.sin(a) * rad * 0.9]);
    }
    const [dirK, off, tilt] = MESH[i];
    for (let k = 0; k < NPT; k++) {
      const s = (k / (NPT - 1) - 0.5) * 380, wob = Math.sin(k * 1.1 + i * 2) * 9;
      ckP.push(dirK === 'h' ? [s, off + s * tilt + wob] : [off + s * tilt + wob, s]);
    }
    chains.push({ el: E('path', { fill: 'none', stroke: ['#FFD27A', '#FFB86B', '#F7E39A'][i % 3], 'stroke-width': 5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, chainsG), rawP, ckP, ph: cr() * TAU, dl: i * 0.1 });
  });
  const links = [];
  for (let i = 0; i < 3; i++) for (let j = 3; j < 7; j++) {
    if ((i + j) % 4 === 3) continue;
    let best = null;
    chains[i].ckP.forEach(p => chains[j].ckP.forEach(q => { const d = Math.hypot(p[0] - q[0], p[1] - q[1]); if (!best || d < best.d) best = { d, x: (p[0] + q[0]) / 2, y: (p[1] + q[1]) / 2 }; }));
    if (best && Math.hypot(best.x, best.y) < ZR - 22) links.push(best);
  }
  links.forEach(l => { l.el = E('circle', { cx: ZX + l.x, cy: ZY + l.y, r: 8, fill: C.energy, stroke: '#FFF7C2', 'stroke-width': 2 }, chainsG); });
  const zLoose = T(eggG, ZX, 186, 'loose protein chains', { size: 30, weight: 700, anchor: 'middle', fill: '#FFD27A' });
  const zNet = T(eggG, ZX, 186, 'a tangled network', { size: 30, weight: 700, anchor: 'middle', fill: '#FFD27A' });
  const uncook = G(eggG);
  arrow(uncook, 792, 652, 702, 652, { color: CHE, width: 6 });
  const unX = cross(uncook, 17); tr(unX, 748, 652);
  T(uncook, 816, 664, "can't un-cook", { size: 36, weight: 700, fill: CHEtx });

  return t => {
    /* --- columns --- */
    const tTest = at('test'), tEgg = at('egg');
    const colA = 1 - P(t, tTest - 0.25, 0.5, linear);
    op(colsG, colA);
    if (colA > 0) {
      const hl = P(t, at('two') + 0.1, 0.6, pop), hr = P(t, mid('two', 0.62), 0.6, pop);
      op(hdrL, clamp(hl * 2)); tr(hdrL, 310, lerp(150, 200, clamp(hl)), 0.8 + 0.2 * hl);
      op(hdrR, clamp(hr * 2)); tr(hdrR, 890, lerp(150, 200, clamp(hr)), 0.8 + 0.2 * hr);
      op(left, (0.35 + 0.65 * P(t, at('two') + 0.1, 0.4, linear)) * (1 - 0.55 * win(t, at('chem') - 0.1, mid('wood', 0.62), 0.5)));
      op(right, 0.35 + 0.65 * P(t, mid('two', 0.62), 0.4, linear));

      // physical demo: shown for phys and rev, hidden while the three examples play
      const tEgs = at('egs'), tRev = at('rev');
      const demoA = P(t, at('phys') - 0.1, 0.5, linear) * (1 - win(t, tEgs - 0.1, tRev + 0.15, 0.4));
      op(phyDemo, demoA);
      const melt = P(t, mid('phys', 0.2), 3.2, ease) * (1 - P(t, mid('rev', 0.42), 2.4, ease));
      ice.set(melt); box.set(clamp(melt * 1.15 - 0.05), t);
      op(lbIce, 1 - clamp(melt * 3 - 1)); op(lbWat, clamp(melt * 3 - 1));
      op(lbSol, 1 - clamp(melt * 3 - 1)); op(lbLiq, clamp(melt * 3 - 1));
      op(twoWay, P(t, mid('rev', 0.12), 0.5, linear));
      const pn = P(t, mid('phys', 0.68), 0.5, pop); op(chipNone, clamp(pn * 2)); tr(chipNone, 310, 606 + (1 - clamp(pn)) * 14);
      const pe = P(t, mid('rev', 0.24), 0.5, pop); op(chipEasy, clamp(pe * 2)); tr(chipEasy, 310, 666 + (1 - clamp(pe)) * 14);

      // three everyday physical changes
      const eA = win(t, tEgs - 0.1, tRev + 0.15, 0.4);
      op(egs, eA);
      if (eA > 0) {
        const s1 = tEgs + 0.05, s2 = mid('egs', 0.12), s3 = mid('egs', 0.26);
        [s1, s2, s3].forEach((s, i) => { const p = P(t, s, 0.5, pop); op([egA, egB, egC][i], clamp(p * 2)); op(egLbl[i], clamp(p * 2)); });
        ice2.set(P(t, s1 + 0.3, 2.4, ease));
        boil.upd(t, P(t, s2 + 0.2, 0.5, linear)); steam.upd(t); op(steam, P(t, s2 + 0.4, 0.5, linear) * 0.8);
        const drop = P(t, s3 + 0.35, 0.6, easeIn), sink = P(t, s3 + 0.95, 0.6, easeOut), dis = P(t, s3 + 1.4, 2.2, linear);
        tr(sugarG, 480, lerp(310, 396, drop) + 34 * sink, Math.max(0.01, 1 - dis), drop * 20);
        op(sugarG, P(t, s3 + 0.3, 0.2, linear) * (1 - P(dis, 0.85, 0.15, linear)));
        sugarBits.forEach((b, k) => {
          const u = clamp(dis * 1.3 - k * 0.025);
          attr(b.el, 'x', lerp(477, b.x + Math.sin(t * 0.9 + b.ph) * 5 * calm, u) - 2.5);
          attr(b.el, 'y', lerp(432, b.y + Math.cos(t * 0.7 + b.ph) * 4 * calm, u) - 2.5);
          op(b.el, u > 0 ? 0.85 * Math.min(1, u * 4) : 0);
        });
        const pw = P(t, mid('egs', 0.5), 0.5, pop); op(tagW, clamp(pw * 2)); tr(tagW, 225, 528 + (1 - clamp(pw)) * 12);
        const ps = P(t, mid('egs', 0.74), 0.5, pop); op(tagS, clamp(ps * 2)); tr(tagS, 480, 528 + (1 - clamp(ps)) * 12);
      }

      // chemical: hydrogen + oxygen -> water
      const tWood = at('wood');
      const cA = P(t, at('chem') - 0.05, 0.4, linear) * (1 - P(t, tWood - 0.15, 0.4, linear));
      op(chemG, cA);
      if (cA > 0) {
        recs.forEach((r, i) => {
          const app = P(t, at('chem') + 0.1 + i * 0.06, 0.4, pop);
          const u = clamp((t - r.st) / FLY), p = ease(u);
          let x = r.x0, y = r.y0;
          if (u > 0) { const cx = (r.x0 + r.x1) / 2, cy = Math.min(r.y0, r.y1) + r.bend, q = 1 - p; x = q * q * r.x0 + 2 * q * p * cx + p * p * r.x1; y = q * q * r.y0 + 2 * q * p * cy + p * p * r.y1; }
          else { x += Math.sin(t * 2 + i) * 1.5 * calm; }
          const settle = u >= 1 ? 1 + 0.14 * Math.sin(Math.PI * P(t, r.st + FLY, 0.35, linear)) : 1;
          tr(r.el, x, y, Math.max(0.01, app * settle));
          op(r.ghost, 0.4 * P(t, r.st + 0.15, 0.5, linear));
        });
        chemArrow.set(P(t, mid('chem', 0.3), 0.5)); op(chemArrow, P(t, mid('chem', 0.3), 0.15, linear));
        op(lbHO, P(t, at('chem') + 0.3, 0.4, linear)); op(lbW, P(t, TC + FLY + 0.2, 0.4, linear));
        op(propL, P(t, mid('chem', 0.74), 0.4, linear)); op(propR, P(t, mid('chem', 0.8), 0.4, linear));
      }
      const pc = P(t, mid('chem', 0.62), 0.5, pop); op(chipNew, clamp(pc * 2)); tr(chipNew, 890, 606 + (1 - clamp(pc)) * 14);

      // chemical: burning wood
      const wA = P(t, tWood - 0.1, 0.4, linear);
      op(woodG, wA);
      if (wA > 0) {
        const lit = P(t, tWood + 0.1, 0.5, pop), burn = P(t, tWood + 0.5, mid('wood', 0.42) - tWood - 0.5, linear);
        op(lbWood, P(t, tWood, 0.4, linear));
        log.set(burn);
        logG.setAttribute('transform', `translate(732 470) scale(${(1 - 0.5 * burn).toFixed(3)} ${(1 - 0.45 * burn).toFixed(3)})`);
        op(logGhost, P(t, tWood + 1.0, 0.6, linear) * 0.6);
        logFlame.set('yellow', Math.max(0.01, clamp(lit) * (1 - 0.75 * P(t, mid('wood', 0.5), 1.2, linear))));
        tr(logFlame, 732, 470 - 54 * (1 - 0.45 * burn) + 4); logFlame.upd(t);
        woodArrow.set(P(t, mid('wood', 0.1), 0.5)); op(woodArrow, P(t, mid('wood', 0.1), 0.15, linear));
        const grow = P(t, mid('wood', 0.14), 2.0, easeOut);
        op(pileG, clamp(grow * 3)); pileG.setAttribute('transform', `translate(1032 470) scale(${(0.3 + 0.7 * grow).toFixed(3)})`);
        op(lbAsh, P(t, mid('wood', 0.16), 0.5, linear));
        const sm = P(t, mid('wood', 0.18), 0.6, linear);
        puffs.forEach(o => {
          const u = (t * 0.32 * (S.reduce ? 0.5 : 1) + o.ph) % 1;
          attr(o.el, 'cx', 1018 + o.dx * u + Math.sin(t + o.ph * 6) * 6); attr(o.el, 'cy', 436 - u * 120);
          o.el.setAttribute('r', (14 + 16 * u).toFixed(1)); op(o.el, sm * Math.sin(u * Math.PI) * 0.55);
        });
        const gs = P(t, mid('wood', 0.26), 0.6, linear);
        gases.forEach((o, k) => { const u = (t * 0.25 + o.ph) % 1; tr(o.m, o.x + Math.sin(t * 1.4 + k) * 6, 448 - u * 136, 1, u * 90); op(o.m, gs * Math.sin(u * Math.PI)); });
        op(back, P(t, mid('wood', 0.38), 0.4, linear));
        const bx = P(t, mid('wood', 0.5), 0.45, pop); op(backX, clamp(bx * 2)); tr(backX, 885, 532, Math.max(0.01, 0.4 + 0.6 * bx));
      }
      const ph = P(t, mid('wood', 0.64), 0.5, pop); op(chipHard, clamp(ph * 2)); tr(chipHard, 890, 666 + (1 - clamp(ph)) * 14);
    }

    /* --- "new substance?" --- */
    const tA_ = win(t, tTest - 0.1, tEgg + 0.1, 0.45);
    op(testG, tA_);
    if (tA_ > 0) {
      const qp = P(t, tTest + 0.05, 0.6, pop);
      op(qCard, clamp(qp * 2)); tr(qCard, 0, (1 - clamp(qp)) * 20);
      const mp = P(t, mid('test', 0.2), 0.6, easeOut);
      op(mag, mp); tr(mag, lerp(1010, 848, mp) + 5 * Math.sin(t * 1.3 * calm), 244 + 4 * Math.cos(t * 1.1 * calm), 1, 0);
      const atI = [0.22, 0.5, 0.62, 0.72].map(f => mid('test', f)), tkI = [0.53, 0.64, 0.74, 0.86].map(f => mid('test', f));
      icons.forEach((ic, i) => {
        const p = P(t, i === 0 ? mid('test', 0.3) : atI[i] - 0.25, 0.5, pop);
        op(ic.g, clamp(p * 2)); tr(ic.g, ICX[i], ICY + (1 - clamp(p)) * 20);
        const k = P(t, tkI[i], 0.45, pop); op(ic.tk, clamp(k * 2)); tr(ic.tk, 72, -104, Math.max(0.01, k));
      });
      icFlame.upd(t);
      const ap = P(t, mid('test', 0.9), 0.5, pop); op(allNew, clamp(ap * 2)); tr(allNew, 600, 672 + (1 - clamp(ap)) * 12);
    }

    /* --- frying an egg --- */
    const eA2 = P(t, tEgg - 0.05, 0.45, linear);
    op(eggG, eA2);
    if (eA2 > 0) {
      op(hobGlow, 0.5 + 0.2 * wave(t * calm, 1.8));
      const ep = P(t, tEgg, 0.5, pop), crk = P(t, tEgg + 0.55, 0.35, linear), split = P(t, tEgg + 0.95, 0.6, easeOut);
      op(shellG, clamp(ep * 2) * (1 - P(t, tEgg + 1.3, 0.35, linear)));
      tr(shellG, 390, 236, Math.max(0.01, 0.7 + 0.3 * ep));
      crack.setAttribute('stroke-dashoffset', (1 - crk).toFixed(3)); op(crack, 1 - split);
      tr(shTop, -split * 46, -split * 26, 1, -split * 24); tr(shBot, split * 46, split * 14, 1, split * 22);
      const fall = P(t, tEgg + 1.0, 0.55, easeIn);
      op(fill, P(t, tEgg + 1.0, 0.15, linear));
      fill.setAttribute('transform', `translate(390 ${lerp(270, 470, fall).toFixed(1)}) scale(${lerp(0.3, 1, fall).toFixed(3)} ${lerp(0.5, 1, fall).toFixed(3)})`);
      const cook = P(t, mid('egg', 0.48), 2.6, ease);
      op(cooked, cook); op(raw, 1 - cook); op(shineE, 0.5 * (1 - cook));
      // no flames, no smoke
      const nA = 1 - P(t, mid('egg', 0.4), 0.4, linear);
      op(noG, nA);
      if (nA > 0) {
        const f1 = P(t, mid('egg', 0.12), 0.5, pop), f2 = P(t, mid('egg', 0.24), 0.5, pop);
        op(noF, clamp(f1 * 2)); op(noS, clamp(f2 * 2));
        const x1 = P(t, mid('egg', 0.12) + 0.35, 0.35, pop), x2 = P(t, mid('egg', 0.24) + 0.35, 0.35, pop);
        op(xF, clamp(x1 * 2)); tr(xF, 0, 0, Math.max(0.01, 0.4 + 0.6 * x1)); op(xS, clamp(x2 * 2)); tr(xS, 0, 0, Math.max(0.01, 0.4 + 0.6 * x2));
      }
      const sc = P(t, mid('egg', 0.3), 0.5, pop); op(stillChip, clamp(sc * 2)); tr(stillChip, 390, 318, 0.85 + 0.15 * sc);
      // the zoom
      const zp = P(t, mid('egg', 0.42), 0.7, easeOut);
      op(zoomG, zp);
      if (zp > 0) {
        zoomG.setAttribute('transform', `translate(${SPX} ${SPY}) scale(${lerp(0.15, 1, zp).toFixed(3)}) translate(${-SPX} ${-SPY})`);
        op(lensCooked, cook);
        chains.forEach(c => {
          const m = clamp((cook - c.dl * 0.5) / 0.7), mm = ease(m), pts = [];
          for (let k = 0; k < NPT; k++) {
            const a = c.rawP[k], b = c.ckP[k];
            const jx = Math.sin(t * 1.1 + c.ph + k * 0.3) * 5 * calm * (1 - mm), jy = Math.cos(t * 0.9 + c.ph) * 5 * calm * (1 - mm);
            pts.push([ZX + lerp(a[0] + jx, b[0], mm), ZY + lerp(a[1] + jy, b[1], mm)]);
          }
          c.el.setAttribute('d', openPath(pts));
        });
        links.forEach((l, k) => { const p = P(cook, 0.7 + k * 0.025, 0.12, pop); op(l.el, clamp(p * 2)); l.el.setAttribute('r', (8 * Math.max(0.01, p)).toFixed(2)); });
      }
      op(zLoose, zp * (1 - P(cook, 0.45, 0.2, linear))); op(zNet, zp * P(cook, 0.5, 0.2, linear));
      const up = P(t, mid('egg', 0.8), 0.5, pop); op(uncook, clamp(up * 2)); tr(uncook, 0, (1 - clamp(up)) * 14);
      const ux = P(t, mid('egg', 0.8) + 0.3, 0.4, pop); op(unX, clamp(ux * 2)); tr(unX, 748, 652, Math.max(0.01, 0.4 + 0.6 * ux));
    }
  };
});
