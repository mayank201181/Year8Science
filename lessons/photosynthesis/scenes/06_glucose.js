/* What happens to the glucose. The topic diagram (a glucose hub with four use cards) builds down the
   left as an index, and each use is acted out on the right.
   Beats: hub + four empty slots -> 1 respiration: glucose into a mitochondrion, energy out, day and
   night -> the plant does both -> 2 starch: hexagons link and coil into a grain, stored in leaves,
   stems and seeds -> showpiece: glucose dissolves and drags water into a cell, insoluble starch sits
   still -> a potato fed with sugar from the leaves -> 3 cellulose: chains bundle into fibres that wall
   a cell, and a seedling stands up -> 4 proteins (glucose + nitrate) and oils -> Really Sweet Crunchy
   Plants -> oxygen: most to the air, some into the leaf's own mitochondria. */
scene('glucose', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.3 : 1;

  /* ---------- local helpers ---------- */
  const scaleAt = (el, x, y, s) => el.setAttribute('transform', `translate(${x} ${y}) scale(${Math.max(0.001, s).toFixed(4)}) translate(${-x} ${-y})`);
  const hexPts = s => { const p = []; for (let i = 0; i < 6; i++) { const a = -Math.PI / 2 + i * Math.PI / 3; p.push([Math.cos(a) * s, Math.sin(a) * s]); } return p; };
  const polyD = pts => 'M' + pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' L') + 'Z';
  const lineD = pts => 'M' + pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' L');
  const cubicPt = (a, b, c, d, u) => { const v = 1 - u; return [v * v * v * a[0] + 3 * v * v * u * b[0] + 3 * v * u * u * c[0] + u * u * u * d[0], v * v * v * a[1] + 3 * v * v * u * b[1] + 3 * v * u * u * c[1] + u * u * u * d[1]]; };
  const quadPt = (a, c, b, u) => [(1 - u) * (1 - u) * a[0] + 2 * (1 - u) * u * c[0] + u * u * b[0], (1 - u) * (1 - u) * a[1] + 2 * (1 - u) * u * c[1] + u * u * b[1]];
  /* fade + pop a group built around its own origin into place at (x, y) */
  const popAt = (el, x, y, t, t0, s1) => { const k = P(t, t0, 0.5, pop); op(el, clamp(k * 2)); tr(el, x, y, Math.max(0.01, (s1 || 1) * (0.6 + 0.4 * k))); return k; };
  /* one beat's window: in as its line starts, out in the gap before the next line */
  const beat = (t, a, b) => Math.min(P(t, a - 0.3, 0.3, linear), 1 - P(t, b - 0.55, 0.3, linear));
  function rich(parent, x, y, segs, o) {
    o = o || {};
    const t = E('text', { x, y, 'font-size': o.size || 30, 'font-weight': o.weight || 600, 'font-family': o.font || FD, 'text-anchor': o.anchor || 'start', fill: o.fill || C.ink }, parent);
    segs.forEach(s => { if (typeof s === 'string') s = [s]; E('tspan', { fill: s[1], 'font-weight': s[2] }, t).textContent = s[0]; });
    return t;
  }
  /* a small glucose hexagon in one element, for chains and flyers: molGlucose's look, with its ring oxygen
     drawn by a marker on the path's first corner (the same corner as molGlucose's), so it costs no element */
  const ringO = E('marker', { id: 'phGlucoseRingO', viewBox: '-3 -3 6 6', markerWidth: 6, markerHeight: 6, markerUnits: 'strokeWidth', overflow: 'visible' }, defs());
  E('circle', { r: 1.3, fill: C.oxygen, stroke: C.oxygenDk, 'stroke-width': 0.6 }, ringO);
  function miniHex(parent, s) {
    const p = hexPts(s);
    return E('path', { d: polyD(p.slice(1).concat([p[0]])), fill: ball(C.glucose, C.glucoseDk), stroke: C.glucoseDk, 'stroke-width': Math.max(1.5, s * 0.13), 'stroke-linejoin': 'round', 'marker-start': 'url(#phGlucoseRingO)' }, parent);
  }
  /* light molecules for flyers: lib's molO2 / molH2O geometry, one circle per atom */
  const atomC = (parent, kind, r, x, y) => { const [c, dk] = ATOM[kind]; return E('circle', { cx: x, cy: y, r, fill: ball(c, dk), stroke: dk, 'stroke-width': Math.max(1.5, r * 0.08) }, parent); };
  function o2(parent, r) { const g = G(parent); atomC(g, 'O', r, -r * 0.72, 0); atomC(g, 'O', r, r * 0.72, 0); return g; }
  function h2o(parent, r) { const g = G(parent); atomC(g, 'H', r * 0.62, -r * 0.98, r * 0.72); atomC(g, 'H', r * 0.62, r * 0.98, r * 0.72); atomC(g, 'O', r, 0, 0); return g; }
  /* kit leaf with its four side-vein strokes merged into one path: same look, fewer elements */
  function leafL(parent, s, o) {
    const lf = leaf(parent, s, o), inner = lf.firstChild, veins = Array.from(inner.children).slice(2);
    if (veins.length > 1) { veins[0].setAttribute('d', veins.map(v => v.getAttribute('d')).join(' ')); veins.slice(1).forEach(v => v.remove()); }
    return lf;
  }
  /* a starch grain: a cream oval with growth rings around its hilum */
  function starchGrain(parent, s) {
    const g = G(parent), ry = s * 0.8;
    E('ellipse', { rx: s, ry, fill: ball('#FFFDF4', '#C9B486'), stroke: '#B8A06A', 'stroke-width': Math.max(1.5, s * 0.06) }, g);
    let d = '';
    [0.74, 0.52, 0.3].forEach(k => {
      const cx = -s * 0.18 * (1 - k), cy = -ry * 0.18 * (1 - k), rx = s * k, ryy = ry * k;
      d += `M${(cx - rx).toFixed(1)},${cy.toFixed(1)} a${rx.toFixed(1)},${ryy.toFixed(1)} 0 1 0 ${(2 * rx).toFixed(1)},0 a${rx.toFixed(1)},${ryy.toFixed(1)} 0 1 0 ${(-2 * rx).toFixed(1)},0 `;
    });
    E('path', { d, fill: 'none', stroke: '#C2AA74', 'stroke-width': Math.max(1, s * 0.05), opacity: 0.8 }, g);
    E('circle', { cx: -s * 0.18, cy: -ry * 0.18, r: Math.max(1.5, s * 0.08), fill: '#A88E57' }, g);
    return g;
  }
  function moonIcon(parent, r) {
    const g = G(parent);
    E('circle', { r: r * 2.1, fill: glow('#BFD3FF') }, g);
    E('path', { d: 'M0,-36 A36,36 0 1 0 0,36 A24,36 0 0 1 0,-36 Z', fill: '#F3F0D8', stroke: '#FFFBE6', 'stroke-width': 2, transform: `translate(${(r * 0.25).toFixed(1)} 0) scale(${(r / 36).toFixed(3)})` }, g);
    return g;
  }
  /* ---------- shared art: the lesson's potted plant, exactly as drawn in the intro (00_intro.js) ----------
     The same code is in every chapter that shows a potted plant. Origin: the middle of the soil surface;
     about 230 x 545 at o.s = 1. o.s scales it; o.see makes the pot see-through, as in 01_bigidea.js, and
     g.soil is then the layer for roots and anything else in the soil; o.k stretches the stem (1 = the
     intro's height); o.ls scales the leaves; o.bare draws the pot only. g.leaves[i] = { el, blade, x, y, r, s }
     are the intro's four leaves, then its two tip leaves; g.grow(k) restretches the stem; g.leafPt(i, f) is
     the point f of the way along leaf i and g.topY() the stem tip, both in g's own coordinates. */
  function introPlant(parent, o) {
    o = o || {};
    const g = G(parent), pg = G(g), S = o.s || 1, ls = o.ls || 1, f1 = v => +v.toFixed(1);
    if (S !== 1) tr(pg, 0, 0, S);
    if (o.see) {
      E('path', { d: 'M-110,-6 L110,-6 L110,24 L100,24 L80,164 Q78,176 66,176 L-66,176 Q-78,176 -80,164 L-100,24 L-110,24 Z', fill: linGrad('#7A5538', '#3E2818', true) }, pg);
      g.soil = G(pg);
    }
    const stem = o.bare ? null : E('path', { fill: 'none', stroke: C.stem, 'stroke-width': 12, 'stroke-linecap': 'round' }, pg);
    g.leaves = (o.bare ? [] : [[-5, -75, 198, 0.62], [5, -135, -24, 0.66], [-4, -205, 206, 0.7], [4, -262, -30, 0.56], [0, -328, -64, 0.2], [0, -328, -116, 0.2]]).map(([x, y, r, s], i) => {
      const el = leaf(pg, s * ls), parts = Array.from(el.firstChild.children), veins = parts.slice(2);
      if (i < 4) veins[0].setAttribute('d', veins.map(v => v.getAttribute('d')).join(' '));   // one path for the side veins
      veins.slice(i < 4 ? 1 : 0).forEach(v => v.remove());                                    // (too small to see on the tip leaves)
      return { el, blade: parts[0], x, y, r, s: s * ls };
    });
    E('path', { d: 'M-100,22 L100,22 L80,164 Q78,176 66,176 L-66,176 Q-78,176 -80,164 Z', fill: o.see ? 'rgba(217,130,74,0.2)' : ball('#D9824A', '#9A4E1E'), stroke: '#F0B48A', 'stroke-width': 3, 'stroke-linejoin': 'round' }, pg);
    E('rect', { x: -114, y: -6, width: 228, height: 32, rx: 9, fill: o.see ? 'rgba(227,149,94,0.3)' : ball('#E3955E', '#A9592A'), stroke: '#F0B48A', 'stroke-width': 3 }, pg);
    E('ellipse', { cx: 0, cy: -6, rx: 113, ry: 12, fill: '#EBA26C', stroke: '#F0B48A', 'stroke-width': 3 }, pg);
    E('ellipse', { cx: 0, cy: -5, rx: 99, ry: 8, fill: C.soil }, pg);
    let kNow = 1;
    g.grow = k => {
      kNow = k;
      if (stem) stem.setAttribute('d', `M0,-6 C-9,${f1(-90 * k)} 10,${f1(-180 * k)} 0,${f1(-268 * k)} C-4,${f1(-298 * k)} 0,${f1(-318 * k)} 0,${f1(-330 * k)}`);
      g.leaves.forEach(L => tr(L.el, L.x, L.y * k, 1, L.r));
    };
    g.grow(o.k || 1);
    g.leafPt = (i, f) => { const L = g.leaves[i], a = L.r * Math.PI / 180, d = 205 * L.s * f; return [S * (L.x + Math.cos(a) * d), S * (L.y * kNow + Math.sin(a) * d)]; };
    g.topY = () => -330 * kNow * S;
    return g;
  }
  /* a smooth connector from the hub to a card: leaves level, arrives level. g.set(p) draws it; g.pt(u) */
  function fanArrow(parent, x1, y1, x2, y2, color, w) {
    const g = G(parent), hs = w * 3.2, ex = x2 - hs * 0.7, mx = (x1 + x2) / 2;
    const A = [x1, y1], B = [mx + 6, y1], Cc = [mx - 6, y2], D = [ex, y2];
    const line = E('path', { d: `M${x1},${y1} C${B[0]},${B[1]} ${Cc[0]},${Cc[1]} ${ex},${y2}`, fill: 'none', stroke: color, 'stroke-width': w, 'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': '1 1' }, g);
    const head = E('path', { d: `M0,0 L${-hs},${-hs * 0.62} L${-hs * 0.72},0 L${-hs},${hs * 0.62} Z`, fill: color, transform: `translate(${x2} ${y2})` }, g);
    g.set = p => { p = clamp(p); line.setAttribute('stroke-dashoffset', (1 - p).toFixed(4)); head.style.opacity = clamp((p - 0.8) / 0.2).toFixed(3); };
    g.pt = u => cubicPt(A, B, Cc, D, clamp(u));
    g.set(1);
    return g;
  }
  /* a plant cell: green wall, thin membrane, nucleus. Centred, w x h */
  function plantCell(parent, w, h, o) {
    o = o || {};
    const g = G(parent);
    E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: 22, fill: 'rgba(91,210,122,0.10)', stroke: '#6CCB7E', 'stroke-width': 8 }, g);
    E('rect', { x: -w / 2 + 9, y: -h / 2 + 9, width: w - 18, height: h - 18, rx: 15, fill: 'rgba(201,242,211,0.08)', stroke: '#C9F2D3', 'stroke-width': 2, opacity: 0.8 }, g);
    if (o.nucleus !== false) E('circle', { cx: w / 2 - 40, cy: -h / 2 + 34, r: 15, fill: 'rgba(150,120,220,0.45)', stroke: '#B79CF0', 'stroke-width': 2.5 }, g);
    return g;
  }

  /* ================= the index: hub + four use cards (the topic diagram) ================= */
  const HUB = [96, 410];
  const CX0 = 226, CW = 318, CH = 104, CYS = [218, 346, 474, 602];
  const IDX = G(root);
  const hubHalo = E('circle', { cx: HUB[0], cy: HUB[1], r: 92, fill: glow(C.glucose) }, IDX);
  const hubG = G(IDX); molGlucose(hubG, 46);
  const hubLbl = T(IDX, HUB[0], HUB[1] + 84, 'glucose', { size: 30, weight: 700, anchor: 'middle', fill: C.glucoseLt });
  const CARDS = [
    { title: 'Respiration', sub: 'releases energy', col: '#FF9A6B' },
    { title: 'Starch', sub: 'a food store', col: '#EFE2BE' },
    { title: 'Cellulose', sub: 'strong cell walls', col: '#7FE09A' },
    { title: 'Proteins', sub: 'with nitrates', col: '#E6A8FF' },
  ];
  const fansDim = G(IDX), fansOn = G(IDX), cardsG = G(IDX);
  CARDS.forEach((c, i) => {
    const cy = CYS[i];
    c.fanDim = fanArrow(fansDim, HUB[0] + 46, HUB[1], CX0 - 6, cy, C.line, 4);
    c.fanOn = fanArrow(fansOn, HUB[0] + 46, HUB[1], CX0 - 6, cy, C.glucose, 5);
    c.flyer = miniHex(IDX, 10);
    // the empty slot
    c.slot = G(cardsG);
    E('rect', { x: CX0, y: cy - CH / 2, width: CW, height: CH, rx: 18, fill: 'rgba(20,54,70,0.35)', stroke: C.faint, 'stroke-width': 3, 'stroke-dasharray': '10 8' }, c.slot);
    T(c.slot, CX0 + 40, cy + 15, String(i + 1), { size: 42, weight: 700, anchor: 'middle', fill: C.faint });
    T(c.slot, CX0 + CW / 2 + 20, cy + 17, '?', { size: 46, weight: 700, anchor: 'middle', fill: C.faint });
    // the card
    c.g = G(cardsG);
    c.box = E('rect', { x: CX0, y: cy - CH / 2, width: CW, height: CH, rx: 18, fill: C.card, stroke: c.col, 'stroke-width': 3 }, c.g);
    c.glowR = E('rect', { x: CX0 - 5, y: cy - CH / 2 - 5, width: CW + 10, height: CH + 10, rx: 22, fill: 'none', stroke: c.col, 'stroke-width': 3, opacity: 0 }, c.g);
    const ic = G(c.g); tr(ic, CX0 + 54, cy);
    if (i === 0) c.icon = spark(ic, 19, { seed: 3 });
    else if (i === 1) starchGrain(ic, 24);
    else if (i === 2) {
      E('rect', { x: -26, y: -21, width: 52, height: 42, rx: 9, fill: 'rgba(91,210,122,0.12)', stroke: '#7FE09A', 'stroke-width': 6 }, ic);
      E('path', { d: 'M-26,-8 L-13,-21 M-26,8 L3,-21 M-20,21 L19,-21 M-4,21 L26,-11 M12,21 L26,7', stroke: '#C9F2D3', 'stroke-width': 2, opacity: 0.7 }, ic);
    } else {
      const bp = [[-24, 10], [-12, -6], [2, 8], [15, -8], [26, 6]], bc = ['#FF8FB1', '#7AD3FF', '#FFD166', '#9BE38A', '#C9A0FF'];
      E('path', { d: lineD(bp), fill: 'none', stroke: '#E9EEF2', 'stroke-width': 3, opacity: 0.7 }, ic);
      bp.forEach((p, k) => E('circle', { cx: p[0], cy: p[1], r: 8.5, fill: ball(bc[k], '#55606B') }, ic));
    }
    c.titleT = T(c.g, CX0 + 100, cy - 4, c.title, { size: 32, weight: 700, fill: c.col });
    c.initial = T(c.g, CX0 + 100, cy - 4, c.title[0], { size: 32, weight: 700, fill: C.energy });
    c.iniGlow = E('circle', { cx: CX0 + 110, cy: cy - 15, r: 34, fill: glow(C.energy) }, c.g);
    c.g.insertBefore(c.iniGlow, c.titleT);
    T(c.g, CX0 + 100, cy + 30, c.sub, { size: 24, weight: 600, fill: C.muted, font: FB });
    const badge = G(c.g); tr(badge, CX0 + 2, cy - CH / 2 + 4);
    E('circle', { r: 17, fill: c.col, stroke: C.bg0, 'stroke-width': 3 }, badge);
    T(badge, 0, 8, String(i + 1), { size: 22, weight: 700, anchor: 'middle', fill: C.bg0 });
  });
  const useLines = [['resp', 'both'], ['starch', 'insoluble', 'potato'], ['cellulose'], ['proteins']];

  /* ================= jobs: the plant and its glucose ================= */
  const RX0 = 872;                                   // centre of the right-hand stage
  const sunG = G(root);
  const sunJ = sun(sunG, 32); tr(sunJ, 662, 168);
  const plantG = G(root);
  const plant = introPlant(plantG, { s: 0.7 }); tr(plant, RX0, 568);
  const plantSugar = [[0, 0.62], [1, 0.55], [2, 0.6], [3, 0.55], [1, 0.25]].map(([i, f], k) => { const g = miniHex(plantG, 12); const p = plant.leafPt(i, f); return { g, x: RX0 + p[0], y: 568 + p[1], k }; });
  const JB = G(root);
  const qMark = T(JB, 1040, 360, '?', { size: 120, weight: 700, anchor: 'middle', fill: C.glucoseLt });
  const usesChip = chip(JB, '4 main uses', { size: 32, fill: C.card2, stroke: C.glucose, color: C.glucoseLt });
  tr(usesChip, CX0 + CW / 2, 128);

  /* ================= resp: glucose into a mitochondrion, energy out, day and night ================= */
  const MX = 930, MY = 430;
  const RG = G(root);
  const mitoG = G(RG); tr(mitoG, MX, MY);
  const mitoArt = mitochondrion(mitoG, 300, 130, { glow: true });
  const rSparks = [], sr = rng(23);
  for (let k = 0; k < 9; k++) { const a = (k / 9) * TAU + sr() * 0.3; rSparks.push({ el: spark(RG, 15, { seed: k }), a, ph: k / 9 + sr() * 0.05 }); }
  const rFlyers = [0, 1, 2, 3, 4].map(k => ({ g: miniHex(RG, 17), k }));
  const mitoLbl = T(RG, MX, MY + 172, 'mitochondrion', { size: 28, weight: 600, anchor: 'middle', fill: C.mito });
  const enChip = chip(RG, 'energy for life processes', { size: 28, fill: '#3A3410', stroke: C.energy, color: C.energy });
  tr(enChip, MX, 255);
  const dnG = G(RG);
  const moonR = moonIcon(dnG, 26); tr(moonR, 1096, 168);
  const dnChip = chip(dnG, 'day and night', { size: 30, fill: C.card2, stroke: C.line });
  tr(dnChip, 880, 168);

  /* ================= both: photosynthesis in, respiration out ================= */
  const BG = G(root);
  const RESP_RED = '#FF6B5C';
  const PA = [700, 296], PB = [800, 436], RA = [948, 430], RB = [1076, 296];
  const arP = arrow(BG, PA[0], PA[1], PB[0], PB[1], { color: C.plant, width: 8, bend: 26 });
  const arR = arrow(BG, RA[0], RA[1], RB[0], RB[1], { color: RESP_RED, width: 8, bend: 26 });
  const lbP = T(BG, 672, 276, 'photosynthesis', { size: 30, weight: 700, anchor: 'middle', fill: C.plant });
  const lbR = T(BG, 1080, 276, 'respiration', { size: 30, weight: 700, anchor: 'middle', fill: RESP_RED });
  const bothG = G(BG); tr(bothG, RX0, 168);
  const bothChip = chip(bothG, 'both!', { size: 36, fill: '#163F2A', stroke: C.good, color: C.good, padX: 34 });
  const bothTick = tick(bothG, 15); tr(bothTick, -bothChip.w / 2 + 30, 0);
  bothChip.label.setAttribute('x', 16);
  const bSparks = [0, 1, 2].map(k => spark(BG, 12, { seed: k + 5 }));
  const bRays = [0, 1, 2].map(() => E('circle', { r: 7, fill: C.energy, stroke: C.energyLt, 'stroke-width': 2 }, BG));

  /* ================= starch: hexagons link and coil into a grain ================= */
  const SG = G(root);
  const SC = [RX0, 318];
  const sHead = rich(SG, RX0, 168, [['spare glucose', C.glucoseLt, 700], [' → ', C.muted], ['starch', '#EFE2BE', 700]], { size: 34, anchor: 'middle' });
  const sBond = E('path', { fill: 'none', stroke: C.glucoseDk, 'stroke-width': 6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, SG);
  const NS = 9, sHex = [], srr = rng(41);
  for (let i = 0; i < NS; i++) {
    const row = [RX0 + (i - (NS - 1) / 2) * 40, 300];
    const ang = 0.5 + i * 0.95, rad = 14 + i * 7.5;
    sHex.push({ el: miniHex(SG, 16), x0: 620 + srr() * 90, y0: 210 + srr() * 200, row, coil: [SC[0] + Math.cos(ang) * rad, SC[1] + Math.sin(ang) * rad * 0.85] });
  }
  const sGrain = G(SG); starchGrain(sGrain, 62);
  const sGrainLbl = T(SG, RX0 + 90, SC[1] + 10, 'starch grain', { size: 30, weight: 700, fill: '#EFE2BE' });
  const STORE_X = [690, RX0, 1054], STORE_Y = 548;
  const stores = STORE_X.map((x, i) => {
    const g = G(SG);
    if (i === 0) { const lf = leafL(g, 0.62); tr(lf, -64, 0, 1, -18); }
    else if (i === 1) {
      E('rect', { x: -15, y: -64, width: 30, height: 128, rx: 12, fill: ball(C.stem, C.plantDk), stroke: '#9EF0B4', 'stroke-width': 2.5 }, g);
      E('path', { d: 'M-15,-6 Q0,4 15,-6', fill: 'none', stroke: '#9EF0B4', 'stroke-width': 3 }, g);
      E('path', { d: 'M15,-10 C40,-30 58,-28 70,-52', fill: 'none', stroke: C.stem, 'stroke-width': 9, 'stroke-linecap': 'round' }, g);
    } else {
      E('path', { d: 'M-50,4 C-56,-36 -10,-50 18,-38 C50,-26 60,8 40,30 C18,52 -44,46 -50,4 Z', fill: ball('#D9B26E', '#8C6A32'), stroke: '#F0D49A', 'stroke-width': 3 }, g);
      E('path', { d: 'M-8,-30 Q-2,-14 -10,0', fill: 'none', stroke: '#8C6A32', 'stroke-width': 4, 'stroke-linecap': 'round' }, g);
    }
    const lbl = T(SG, x, STORE_Y + 104, ['leaves', 'stems', 'seeds'][i], { size: 30, weight: 700, anchor: 'middle', fill: C.ink });
    const gr = G(SG); starchGrain(gr, 17);
    return { g, x, lbl, gr, dx: [6, 0, 2][i], dy: [-2, -24, 0][i] };
  });

  /* ================= insoluble (showpiece): dissolves vs doesn't; water balance ================= */
  const IG = G(root);
  const LX = 735, RXc = 1035, BY = 278, CY2 = 532;
  const hdrG = T(IG, LX, 152, 'glucose', { size: 32, weight: 700, anchor: 'middle', fill: C.glucoseLt });
  const hdrS = T(IG, RXc, 152, 'starch', { size: 32, weight: 700, anchor: 'middle', fill: '#EFE2BE' });
  const bkL = beaker(IG, 150, 170, { level: 0.8, liquid: C.water, opacity: 0.45 }); tr(bkL, LX, BY);
  const bkR = beaker(IG, 150, 170, { level: 0.8, liquid: C.water, opacity: 0.45 }); tr(bkR, RXc, BY);
  const WTOP = BY - 37, WBOT = BY + 80;                  // the water inside each beaker
  const lump = [], lr = rng(58);
  const LUMP = [[0, 0], [-17, -10], [17, -10], [-17, 10], [17, 10], [0, -20], [0, 20], [-34, 0], [34, 0], [-34, -20]];
  LUMP.forEach(([dx, dy], k) => lump.push({ el: miniHex(IG, 9.5), dx, dy, sx: LX - 58 + lr() * 116, sy: WTOP + 14 + lr() * (WBOT - WTOP - 24), ph: lr() * TAU }));
  const grainB = G(IG); starchGrain(grainB, 26);
  const lbDis = T(IG, LX, 400, 'dissolves', { size: 28, weight: 700, anchor: 'middle', fill: C.glucoseLt });
  const lbIns = T(IG, RXc, 400, 'insoluble', { size: 28, weight: 700, anchor: 'middle', fill: '#EFE2BE' });
  const cellL = G(IG), cellLin = G(cellL); plantCell(cellLin, 200, 112, { nucleus: false });
  const cellDots = [], cr = rng(77);
  for (let k = 0; k < 11; k++) { const x = -80 + cr() * 160, y = -38 + cr() * 76; cellDots.push({ el: miniHex(cellLin, 8), x, y, ph: cr() * TAU }); }
  const cellR = G(IG); plantCell(cellR, 200, 112, { nucleus: false });
  [[-50, 6, 21], [10, -10, 18], [58, 14, 16]].forEach(([x, y, s]) => { const g = G(cellR); starchGrain(g, s); tr(g, x, y); });
  tr(cellR, RXc, CY2);
  const WA = [[-152, 0, -116, 0], [152, 0, 116, 0], [-96, 92, -66, 62], [96, 92, 66, 62]];
  const wArrows = WA.map(([x1, y1, x2, y2]) => arrow(IG, LX + x1, CY2 + y1, LX + x2, CY2 + y2, { color: C.water, width: 6 }));
  const wMols = WA.map(() => h2o(IG, 8));
  const verdL = G(IG); tr(verdL, LX, 664);
  T(verdL, 16, 10, 'upsets water balance', { size: 27, weight: 700, anchor: 'middle', fill: '#FF9AA4' });
  const vlX = cross(verdL, 11); tr(vlX, -textWidth('upsets water balance', 27, FD, 700) / 2 - 8, 1);
  const verdR = G(IG); tr(verdR, RXc, 664);
  T(verdR, 16, 10, 'a perfect store', { size: 27, weight: 700, anchor: 'middle', fill: C.good });
  const vrT = tick(verdR, 12); tr(vrT, -textWidth('a perfect store', 27, FD, 700) / 2 - 10, 0);

  /* ================= potato: a starch store, fed from the leaves ================= */
  const PG = G(root);
  const GROUND = 430, PX = 930, PY = 578, STX = 720;
  E('path', { d: `M585,${GROUND} Q700,${GROUND - 8} 820,${GROUND} T1060,${GROUND} L1165,${GROUND - 4} L1165,690 Q1165,712 1143,712 L607,712 Q585,712 585,690 Z`, fill: linGrad('#6B4A33', '#3E2A1C', true), stroke: '#8A6446', 'stroke-width': 2 }, PG);
  E('path', { d: `M585,${GROUND} Q700,${GROUND - 8} 820,${GROUND} T1060,${GROUND} L1165,${GROUND - 4}`, fill: 'none', stroke: '#4E9A5A', 'stroke-width': 6, 'stroke-linecap': 'round' }, PG);
  const stolon = 'M722,436 C730,500 790,560 852,568';
  E('path', { d: stolon, fill: 'none', stroke: '#D8C7A0', 'stroke-width': 8, 'stroke-linecap': 'round' }, PG);
  const potStem = G(PG);
  E('path', { d: `M${STX},${GROUND + 8} C${STX + 6},380 ${STX - 6},300 ${STX},212`, fill: 'none', stroke: C.stem, 'stroke-width': 10, 'stroke-linecap': 'round' }, potStem);
  [[STX, 350, 200, 0.54], [STX, 292, -22, 0.52], [STX, 222, -56, 0.42]].forEach(([x, y, r, s]) => { const lf = leafL(potStem, s); tr(lf, x, y, 1, r); });
  const potato = G(PG); tr(potato, PX, PY);
  E('path', { d: closedPath(blobPts(134, 86, 14, 0, 0.07, 6)), fill: ball('#C99A5E', '#7E5426'), stroke: '#E2BE86', 'stroke-width': 3 }, potato);
  E('path', { d: closedPath(blobPts(110, 66, 14, 0, 0.06, 8)), fill: ball('#FFF4D6', '#E6CF97'), stroke: '#D7BE85', 'stroke-width': 2.5, transform: 'translate(-8 -8)' }, potato);
  E('path', { d: 'M-124,-30 q6,-6 12,0 M118,22 q6,-6 12,0 M40,72 q6,-6 12,0 M-70,70 q6,-6 12,0', fill: 'none', stroke: '#6E4620', 'stroke-width': 3.5, 'stroke-linecap': 'round' }, potato);
  const pGrains = [], pr = rng(19);
  for (let k = 0; k < 14; k++) {
    const a = pr() * TAU, q = Math.sqrt(pr());
    const s = 9 + pr() * 4, g = E('ellipse', { rx: s, ry: s * 0.8, fill: ball('#FFFDF4', '#C9B486'), stroke: '#B8A06A', 'stroke-width': 1.6 }, potato);
    pGrains.push({ g, k, x: -6 + Math.cos(a) * 88 * q, y: -6 + Math.sin(a) * 52 * q });
  }
  const sugarPath = [[760, 300], [726, 318], [722, 420], [726, 470], [768, 538], [842, 566]];
  const sugarArrow = E('path', { d: openPath(sugarPath), fill: 'none', stroke: C.glucose, 'stroke-width': 6, 'stroke-linecap': 'round', 'stroke-dasharray': '1 1', pathLength: 1 }, PG);
  const sugarHead = E('path', { d: 'M0,0 L-18,-11 L-13,0 L-18,11 Z', fill: C.glucose, transform: 'translate(858 568) rotate(8)' }, PG);
  const sugarHex = [0, 1, 2, 3].map(() => miniHex(PG, 9));
  const pLblTop = rich(PG, 1000, 268, [['sugar', C.glucoseLt, 700], ' sent down'], { size: 30, anchor: 'middle' });
  const pLblTop2 = T(PG, 1000, 306, 'from the leaves', { size: 30, weight: 600, anchor: 'middle' });
  const pLblBot = T(PG, PX, 700, 'potato: a big store of starch', { size: 28, weight: 700, anchor: 'middle', fill: '#FFF4D6' });
  const along = (pts, u) => {
    const segs = []; let L = 0;
    for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); segs.push(l); L += l; }
    let d = clamp(u) * L;
    for (let i = 0; i < segs.length; i++) { if (d <= segs[i] || i === segs.length - 1) { const f = segs[i] ? d / segs[i] : 0; return [lerp(pts[i][0], pts[i + 1][0], f), lerp(pts[i][1], pts[i + 1][1], f)]; } d -= segs[i]; }
    return pts[pts.length - 1];
  };

  /* ================= cellulose: chains -> fibre -> cell wall; a seedling stands up ================= */
  const CG = G(root);
  const ROWS = 3, PER = 8, CHX = 900;
  const fibG = G(CG);
  const cBonds = [0, 1, 2].map(() => E('path', { fill: 'none', stroke: C.glucoseDk, 'stroke-width': 5, 'stroke-linecap': 'round' }, fibG));
  const cHex = [], cr2 = rng(63);
  for (let r = 0; r < ROWS; r++) for (let j = 0; j < PER; j++) cHex.push({ el: miniHex(fibG, 12.5), r, j, x0: 600 + cr2() * 80, y0: 150 + cr2() * 160, ph: cr2() });
  const fibre = E('rect', { x: CHX - 122, y: 176, width: 244, height: 58, rx: 29, fill: 'rgba(168,230,160,0.20)', stroke: '#A8E6A0', 'stroke-width': 4 }, fibG);
  const fibreLbl = T(CG, CHX - 140, 214, 'tough fibre', { size: 30, weight: 700, anchor: 'end', fill: '#A8E6A0' });
  const WCX = 820, WCY = 478, WW = 280, WH = 190;
  const wallCell = G(CG);
  E('rect', { x: WCX - WW / 2 + 10, y: WCY - WH / 2 + 10, width: WW - 20, height: WH - 20, rx: 18, fill: 'rgba(201,242,211,0.08)', stroke: '#C9F2D3', 'stroke-width': 2.5 }, wallCell);
  E('circle', { cx: WCX + 70, cy: WCY - 30, r: 24, fill: 'rgba(150,120,220,0.45)', stroke: '#B79CF0', 'stroke-width': 3 }, wallCell);
  [[-70, 30, 20], [-10, 48, -15]].forEach(([x, y, r]) => { const g = G(wallCell); chloroplast(g, 50, 26); tr(g, WCX + x, WCY + y, 1, r); });
  const wallBand = E('rect', { x: WCX - WW / 2, y: WCY - WH / 2, width: WW, height: WH, rx: 26, fill: 'none', stroke: '#A8E6A0', 'stroke-width': 14, pathLength: 1, 'stroke-dasharray': '1 1' }, CG);
  const wallHatch = E('rect', { x: WCX - WW / 2, y: WCY - WH / 2, width: WW, height: WH, rx: 26, fill: 'none', stroke: '#2F7A45', 'stroke-width': 14, 'stroke-dasharray': '3 9', opacity: 0.8 }, CG);
  const wallLbl = labelLine(CG, 1000, 362, WCX + WW / 2 - 4, WCY - WH / 2 + 30, 'cell wall', { size: 30, fill: '#A8E6A0', anchor: 'start', weight: 700, line: '#A8E6A0' });
  const SEX = 1072, SEY = 652;
  const seedG = G(CG);
  E('path', { d: `M${SEX - 62},${SEY} Q${SEX},${SEY - 24} ${SEX + 62},${SEY} Z`, fill: C.soil, stroke: '#8A6446', 'stroke-width': 2 }, seedG);
  const seedStem = E('path', { fill: 'none', stroke: C.stem, 'stroke-width': 8, 'stroke-linecap': 'round' }, seedG);
  const seedTop = G(seedG);
  const sl1 = leafL(seedTop, 0.28), sl2 = leafL(seedTop, 0.28);
  tr(sl1, 0, 0, 1, -40); tr(sl2, 0, 0, 1, 220);
  const seedLbl = T(CG, SEX, 700, 'stands up', { size: 28, weight: 700, anchor: 'middle', fill: C.good });

  /* ================= proteins: glucose + nitrate -> protein; also oils ================= */
  const PRG = G(root);
  const R1 = 318;
  const prHead = T(PRG, RX0, 168, 'making other substances', { size: 32, weight: 700, anchor: 'middle', fill: '#E6A8FF' });
  E('path', { d: 'M585,622 Q760,612 900,622 T1165,620 L1165,690 Q1165,712 1143,712 L607,712 Q585,712 585,690 Z', fill: linGrad('#6B4A33', '#3E2A1C', true), stroke: '#8A6446', 'stroke-width': 2 }, PRG);
  T(PRG, 1130, 690, 'soil', { size: 26, weight: 600, anchor: 'end', fill: '#D8C7A0' });
  const NIT = '#6FA8FF', NIT_DK = '#2F5FBF';
  const nDots = [], nr = rng(5);
  for (let k = 0; k < 9; k++) nDots.push({ el: E('circle', { r: 6, fill: ball(NIT, NIT_DK) }, PRG), x: 620 + nr() * 420, y: 646 + nr() * 50, ph: nr() * TAU });
  const pHex = G(PRG); molGlucose(pHex, 34);
  const pPlus = T(PRG, 732, R1 + 16, '+', { size: 48, weight: 700, anchor: 'middle', fill: C.muted });
  const nChip = chip(PRG, 'nitrate', { size: 28, fill: NIT, color: '#08203F' });
  const prArrow = arrow(PRG, 898, R1, 958, R1, { color: C.ink, width: 6 });
  const beadsG = G(PRG); tr(beadsG, 1068, R1);
  const BP = [[-78, 18], [-58, -10], [-34, 12], [-12, -16], [10, 8], [30, -18], [52, 6], [74, -14], [86, 16]];
  const BC = ['#FF8FB1', '#7AD3FF', '#FFD166', '#9BE38A', '#C9A0FF', '#FF8FB1', '#7AD3FF', '#FFD166', '#9BE38A'];
  const beadLine = E('path', { d: openPath(BP), fill: 'none', stroke: '#E9EEF2', 'stroke-width': 4, opacity: 0.75 }, beadsG);
  const beads = BP.map((p, k) => { const e = E('circle', { cx: p[0], cy: p[1], r: 12, fill: ball(BC[k], '#55606B'), stroke: '#ffffff', 'stroke-width': 1.5 }, beadsG); return e; });
  const protLbl = T(PRG, 1068, R1 + 84, 'protein', { size: 30, weight: 700, anchor: 'middle', fill: '#E6A8FF' });
  const flash = E('circle', { r: 70, fill: glow(C.energyLt) }, PRG);
  const R2 = 500;
  const oHex = G(PRG); molGlucose(oHex, 30);
  const oArrow = arrow(PRG, 740, R2, 880, R2, { color: C.ink, width: 6 });
  const oil = G(PRG); tr(oil, 960, R2);
  E('path', { d: 'M0,-46 C16,-22 34,-4 34,16 A34,34 0 0 1 -34,16 C-34,-4 -16,-22 0,-46 Z', fill: ball('#FFE27A', '#D99A18'), stroke: '#FFF0B0', 'stroke-width': 3 }, oil);
  E('path', { d: 'M-14,8 Q-16,22 -4,30', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 4, 'stroke-linecap': 'round', opacity: 0.7 }, oil);
  const oilLbl = T(PRG, 1020, R2 + 12, 'oils', { size: 32, weight: 700, fill: '#FFE27A' });

  /* ================= rscp: Really Sweet Crunchy Plants ================= */
  const MG = G(root);
  const mWords = ['Really', 'Sweet', 'Crunchy', 'Plants'].map((w, i) => rich(MG, 596, CYS[i] + 24, [[w[0], C.energy, 800], [w.slice(1), C.ink, 600]], { size: 66 }));
  const carrot = G(MG);
  [[-14, -40, -0.5], [0, -46, 0], [14, -40, 0.5]].forEach(([x, y, a]) => E('path', { d: `M0,0 C-16,-30 -12,-70 0,-96 C12,-70 16,-30 0,0 Z`, fill: ball(C.plant, C.plantDk), stroke: C.plantDk, 'stroke-width': 2.5, transform: `translate(${x} ${y - 52}) rotate(${(a * 40).toFixed(1)})` }, carrot));
  E('path', { d: 'M-44,-92 Q0,-110 44,-92 C42,-30 16,60 0,130 C-16,60 -42,-30 -44,-92 Z', fill: ball('#FFA14A', '#C4561A'), stroke: '#FFC98A', 'stroke-width': 3, 'stroke-linejoin': 'round' }, carrot);
  E('path', { d: 'M-34,-56 L-14,-54 M12,-28 L32,-30 M-26,4 L-8,6 M6,40 L20,38 M-12,76 L-2,77', stroke: '#C4561A', 'stroke-width': 3.5, 'stroke-linecap': 'round' }, carrot);
  const crunch = G(MG);
  E('path', { d: closedPath([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map(i => { const a = i / 14 * TAU, r = i % 2 ? 44 : 70; return [Math.cos(a) * r * 1.5, Math.sin(a) * r * 0.8]; })), fill: '#3A3410', stroke: C.energy, 'stroke-width': 3 }, crunch);
  T(crunch, 0, 12, 'crunch!', { size: 34, weight: 700, anchor: 'middle', fill: C.energy });

  /* ================= oxygen: most to the air, some to its own respiration ================= */
  const OG = G(root);
  const LF0 = [356, 512], LFS = 2.3;
  const bigLeaf = leafL(OG, LFS); tr(bigLeaf, LF0[0], LF0[1]);
  const oxMitoG = G(OG); tr(oxMitoG, 690, 540, 1, -8);
  const oxMito = mitochondrion(oxMitoG, 128, 56, { glow: true });
  const airLbl = T(OG, 600, 140, 'the air', { size: 32, weight: 700, anchor: 'middle', fill: C.air });
  const oxQ = G(OG); molO2(oxQ, 24, { letter: true }); T(oxQ, 54, 16, '?', { size: 56, weight: 700, fill: C.oxygen });
  const OUT = [], orr = rng(91);
  for (let k = 0; k < 7; k++) OUT.push({ el: o2(OG, 14), x0: 440 + k * 52 + orr() * 20, y0: 470 + orr() * 50, dx: (orr() - 0.5) * 120, ph: k / 7 });
  const IN = [0, 1].map(k => ({ el: o2(OG, 12), x0: 520 + k * 70, y0: 470, ph: k / 2 }));
  const oxMost = chip(OG, 'most: into the air', { size: 30, fill: C.card2, stroke: C.air, color: C.air });
  tr(oxMost, 960, 236);
  const oxSome = G(OG);
  E('line', { x1: 676, y1: 652, x2: 690, y2: 574, stroke: C.mito, 'stroke-width': 2.5 }, oxSome);
  E('circle', { cx: 690, cy: 574, r: 4.5, fill: C.mito }, oxSome);
  T(oxSome, 676, 690, 'some: for its own respiration', { size: 30, weight: 700, anchor: 'middle', fill: C.mito });

  /* ================= update ================= */
  return t => {

    /* ---- the index ---- */
    const idxA = P(t, at('jobs') - 0.1, 0.4, linear) * (1 - P(t, at('oxygen') - 0.2, 0.6, linear));
    op(IDX, idxA);
    if (idxA > 0) {
      const hp = P(t, at('jobs'), 0.6, pop);
      tr(hubG, HUB[0], HUB[1], Math.max(0.01, hp * (1 + 0.04 * Math.sin(t * 1.8))));
      op(hubLbl, P(t, at('jobs') + 0.3, 0.4, linear));
      op(hubHalo, 0.55 + 0.25 * wave(t, 2.2));
      CARDS.forEach((c, i) => {
        const tSlot = mid('jobs', 0.42 + i * 0.07), tCard = mid(useLines[i][0], 0.04);
        c.fanDim.set(P(t, tSlot - 0.1, 0.5)); op(c.fanDim, t > tSlot - 0.1 ? 1 : 0);
        const sp = P(t, tSlot, 0.45, pop);
        op(c.slot, clamp(sp * 2) * (1 - P(t, tCard + 0.2, 0.3, linear)));
        scaleAt(c.slot, CX0 + CW / 2, CYS[i], 0.8 + 0.2 * sp);
        const on = P(t, tCard - 0.2, 0.5);
        c.fanOn.set(on); op(c.fanOn, on > 0 ? 1 : 0);
        // a glucose zips along the arrow into the card as it arrives
        const fu = (t - (tCard - 0.2)) / 0.7;
        if (fu > 0 && fu < 1) { const p = c.fanOn.pt(ease(fu)); tr(c.flyer, p[0], p[1], 1, fu * 120); op(c.flyer, Math.min(1, fu * 6, (1 - fu) * 6)); } else op(c.flyer, 0);
        const cp = P(t, tCard + 0.2, 0.5, pop);
        op(c.g, clamp(cp * 2));
        scaleAt(c.g, CX0 + CW / 2, CYS[i], 0.82 + 0.18 * cp);
        if (c.icon) c.icon.upd(t);
        // highlight while its lines are spoken
        const lines = useLines[i], hi = win(t, at(lines[0]) + 0.1, end(lines[lines.length - 1]) + 0.3, 0.4);
        op(c.glowR, hi * (0.55 + 0.45 * wave(t, 1.4)));
        // Really Sweet Crunchy Plants: the initials light up
        const ti = mid('rscp', 0.17 + i * 0.1), ini = P(t, ti, 0.4, linear);
        op(c.initial, ini); op(c.iniGlow, ini * (0.7 + 0.3 * wave(t, 1.2, i * 0.2)) * (1 - P(t, end('rscp'), 0.6, linear) * 0.6));
        const pulse = Math.sin(Math.PI * P(t, mid('rscp', 0.62 + i * 0.09), 0.5, linear));
        if (pulse > 0) scaleAt(c.g, CX0 + CW / 2, CYS[i], 1 + 0.05 * pulse);
      });
    }

    /* ---- jobs + both: the potted plant ---- */
    const plA = Math.max(beat(t, at('jobs'), at('resp')), beat(t, at('both'), at('starch')));
    op(plantG, plA);
    // the sun: with the plant, and as the 'day' half of day and night
    const dnA = P(t, mid('resp', 0.74), 0.5, linear) * beat(t, at('resp'), at('both')), dayW = wave(t, 2.6);
    op(sunG, Math.max(plA, dnA * (0.35 + 0.65 * dayW)));
    if (plA > 0 || dnA > 0) { sunJ.upd(t); tr(sunJ, 662, 168, plA > 0 ? 1 : 0.9 + 0.15 * dayW); }
    if (plA > 0) {
      const pp = P(t, at('jobs') + 0.1, 0.7, easeOut);
      tr(plant, RX0, 568 + (1 - pp) * 30);
      plantSugar.forEach(o => {
        const a = P(t, mid('jobs', 0.12 + o.k * 0.05), 0.4, pop);
        op(o.g, clamp(a * 2) * (0.75 + 0.25 * wave(t, 1.3, o.k * 0.2)));
        tr(o.g, o.x, o.y + (1 - pp) * 30, Math.max(0.01, a));
      });
    }
    const jA = beat(t, at('jobs'), at('resp'));
    op(JB, jA);
    if (jA > 0) {
      const qp = P(t, mid('jobs', 0.18), 0.5, pop);
      op(qMark, clamp(qp * 2)); scaleAt(qMark, 1040, 320, Math.max(0.01, qp * (1 + 0.05 * Math.sin(t * 3))));
      popAt(usesChip, CX0 + CW / 2, 128, t, mid('jobs', 0.4));
    }

    /* ---- resp ---- */
    const rA = beat(t, at('resp'), at('both'));
    op(RG, rA);
    if (rA > 0) {
      popAt(mitoG, MX, MY, t, mid('resp', 0.08));
      mitoArt.upd(t);
      const T0 = mid('resp', 0.16);
      rFlyers.forEach(o => {
        const per = 2.6, u = ((t - T0) / per - o.k / 5);
        const f = u - Math.floor(u);
        if (u < 0) { op(o.g, 0); return; }
        const p = ease(clamp(f / 0.6));
        const a = [CX0 + CW + 16, CYS[0] + (o.k - 2) * 12], cc = [700, 230 + o.k * 8], b = [MX - 40, MY];
        const q = quadPt(a, cc, b, p);
        tr(o.g, q[0], q[1], 1 - 0.55 * p, f * 140);
        op(o.g, f < 0.6 ? Math.min(1, f * 10, (0.6 - f) * 8) : 0);
      });
      const T1 = mid('resp', 0.3), sOn = P(t, T1, 0.4, linear);
      rSparks.forEach(o => {
        const u = ((t - T1) / 1.7 + o.ph) % 1, uu = u < 0 ? u + 1 : u;
        const r0x = 150, r0y = 66, d = 10 + 92 * easeOut(uu);
        const x = MX + Math.cos(o.a) * (r0x + d), y = MY + Math.sin(o.a) * (r0y + d * 0.75);
        tr(o.el, x, y, 0.55 + 0.6 * Math.sin(uu * Math.PI));
        op(o.el, sOn * Math.sin(uu * Math.PI)); o.el.upd(t);
      });
      op(mitoLbl, P(t, mid('resp', 0.12), 0.4, linear));
      popAt(enChip, MX, 255, t, mid('resp', 0.42));
      const dn = P(t, mid('resp', 0.74), 0.5, linear);
      op(dnG, dn);
      if (dn > 0) { op(moonR, 0.35 + 0.65 * (1 - dayW)); tr(moonR, 1096, 168, 0.9 + 0.15 * (1 - dayW)); }
    }

    /* ---- both ---- */
    const bA = beat(t, at('both'), at('starch'));
    op(BG, bA);
    if (bA > 0) {
      const b0 = mid('both', 0.08), b1 = mid('both', 0.22);
      arP.set(P(t, b0, 0.6)); op(arP, t > b0 ? 1 : 0);
      arR.set(P(t, b1, 0.6)); op(arR, t > b1 ? 1 : 0);
      op(lbP, P(t, b0 + 0.2, 0.4, linear)); op(lbR, P(t, b1 + 0.2, 0.4, linear));
      // light dots ride the green arrow in, energy sparks ride the red arrow out
      const pa = PA, pb = PB, ra = RA, rb = RB;
      const ctl = (a, b, bend) => { const L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1; return [(a[0] + b[0]) / 2 - (b[1] - a[1]) / L * bend, (a[1] + b[1]) / 2 + (b[0] - a[0]) / L * bend]; };
      const pc = ctl(pa, pb, 26), rc = ctl(ra, rb, 26);
      bRays.forEach((e, k) => { const u = (t * 0.6 + k / 3) % 1, q = quadPt(pa, pc, pb, u * 0.88); attr(e, 'cx', q[0]); attr(e, 'cy', q[1]); op(e, P(t, b0 + 0.6, 0.3, linear) * Math.min(1, u * 6, (1 - u) * 6)); });
      bSparks.forEach((e, k) => { const u = (t * 0.6 + k / 3) % 1, q = quadPt(ra, rc, rb, 0.1 + u * 0.85); tr(e, q[0], q[1], 0.9); op(e, P(t, b1 + 0.6, 0.3, linear) * Math.min(1, u * 6, (1 - u) * 6)); e.upd(t); });
      popAt(bothG, RX0 + 10, 168, t, mid('both', 0.66));
    }

    /* ---- starch ---- */
    const sA = beat(t, at('starch'), at('insoluble'));
    op(SG, sA);
    if (sA > 0) {
      op(sHead, P(t, mid('starch', 0.22), 0.4, linear));
      const tIn = mid('starch', 0.1), tLink = mid('starch', 0.3), tCoil = mid('starch', 0.38), tGrain = mid('starch', 0.55);
      const coil = P(t, tCoil, 0.9);
      const pts = sHex.map((o, i) => {
        const a = P(t, tIn + i * 0.06, 0.55);
        let x = lerp(o.x0, o.row[0], a), y = lerp(o.y0, o.row[1], a);
        x = lerp(x, o.coil[0], coil); y = lerp(y, o.coil[1], coil);
        const wob = a < 1 ? 0 : Math.sin(t * 2 + i) * 1.5 * AMP * (1 - coil);
        tr(o.el, x, y + wob, 1, coil * 40 + i * 10 * (1 - a));
        op(o.el, P(t, tIn + i * 0.06, 0.25, linear) * (1 - P(t, tGrain, 0.4, linear)));
        return [x, y + wob];
      });
      sBond.setAttribute('d', openPath(pts));
      op(sBond, P(t, tLink, 0.4, linear) * (1 - P(t, tGrain, 0.4, linear)));
      const gp = P(t, tGrain, 0.6, pop);
      op(sGrain, clamp(gp * 2)); tr(sGrain, SC[0], SC[1], Math.max(0.01, 0.5 + 0.5 * gp), 0);
      op(sGrainLbl, P(t, tGrain + 0.3, 0.4, linear));
      stores.forEach((o, i) => {
        const ts = mid('starch', 0.66 + i * 0.1);
        popAt(o.g, o.x, STORE_Y, t, ts);
        op(o.lbl, P(t, ts + 0.1, 0.35, linear));
        const fu = P(t, ts + 0.15, 0.6, easeIn);
        const fx = lerp(SC[0], o.x + o.dx, fu), fy = lerp(SC[1] + 20, STORE_Y + o.dy, fu) - Math.sin(fu * Math.PI) * 40;
        op(o.gr, P(t, ts + 0.2, 0.2, linear)); tr(o.gr, fx, fy, 1 - 0.2 * fu);
      });
    }

    /* ---- insoluble (showpiece) ---- */
    const iA = beat(t, at('insoluble'), at('potato'));
    op(IG, iA);
    if (iA > 0) {
      const tB = at('insoluble');
      op(hdrG, P(t, tB, 0.4, linear)); op(hdrS, P(t, tB + 0.15, 0.4, linear));
      // starch: falls in, sinks, stays whole
      const tS = mid('insoluble', 0.04), fall = P(t, tS, 0.7, easeIn), sink = P(t, tS + 0.7, 1.1, easeOut);
      const gy = fall < 1 ? lerp(178, WTOP + 8, fall) : lerp(WTOP + 8, WBOT - 22, sink);
      op(grainB, P(t, tS, 0.2, linear));
      tr(grainB, RXc + (sink > 0 && sink < 1 ? Math.sin(sink * 9) * 4 : 0), gy, 1, sink * 14);
      op(lbIns, P(t, mid('insoluble', 0.16), 0.4, linear));
      // glucose: a lump falls in and breaks up into molecules that spread through the water
      const tG = mid('insoluble', 0.12), gFall = P(t, tG, 0.6, easeIn), spread = P(t, tG + 0.7, 1.6, easeOut);
      const ly = lerp(176, WTOP + 20, gFall);
      lump.forEach((o, k) => {
        const x = lerp(LX + o.dx * 0.8, o.sx, spread), y = lerp(ly + o.dy * 0.8, o.sy, spread);
        const jx = spread > 0.6 ? Math.sin(t * 1.7 + o.ph) * 3 * AMP : 0, jy = spread > 0.6 ? Math.cos(t * 1.3 + o.ph) * 3 * AMP : 0;
        tr(o.el, x + jx, y + jy, 1, spread * 120 + k * 7);
        op(o.el, P(t, tG, 0.2, linear));
      });
      op(lbDis, P(t, mid('insoluble', 0.33), 0.4, linear));
      // the cells: glucose drags water in and the cell swells; starch changes nothing
      const tC = mid('insoluble', 0.42);
      const cl = P(t, tC, 0.5, pop), crr = P(t, tC + 0.2, 0.5, pop);
      const swell = P(t, mid('insoluble', 0.52), 1.8, ease);
      op(cellL, clamp(cl * 2));
      const wob = swell > 0 ? 0.012 * Math.sin(t * 6) * AMP * swell : 0;
      cellL.setAttribute('transform', `translate(${LX} ${CY2}) scale(${(Math.max(0.01, 0.7 + 0.3 * cl) * (1 + 0.13 * swell + wob)).toFixed(4)} ${(Math.max(0.01, 0.7 + 0.3 * cl) * (1 + 0.2 * swell - wob)).toFixed(4)})`);
      cellDots.forEach(o => tr(o.el, o.x + Math.sin(t * 1.4 + o.ph) * 3 * AMP, o.y + Math.cos(t * 1.1 + o.ph) * 2 * AMP, 1, (t * 20 + o.ph * 50) % 360));
      op(cellR, clamp(crr * 2)); tr(cellR, RXc, CY2, Math.max(0.01, 0.7 + 0.3 * crr));
      wArrows.forEach((a, k) => {
        const ta = mid('insoluble', 0.5) + k * 0.12, ap = P(t, ta, 0.4);
        a.set(ap); op(a, ap > 0 ? 0.55 + 0.45 * wave(t, 0.9, k * 0.25) : 0);
        const [x1, y1, x2, y2] = WA[k], u = ((t - ta) / 1.3 + k * 0.3) % 1, uu = u < 0 ? u + 1 : u;
        const ex = x2 + (x2 - x1) * 0.9, ey = y2 + (y2 - y1) * 0.9;
        tr(wMols[k], LX + lerp(x1, ex, uu), CY2 + lerp(y1, ey, uu) - (y1 === 0 ? 18 : 0));
        op(wMols[k], P(t, ta + 0.3, 0.3, linear) * Math.min(1, uu * 6, (1 - uu) * 4));
      });
      const vl = P(t, mid('insoluble', 0.62), 0.45, pop);
      op(verdL, clamp(vl * 2)); tr(verdL, LX, 664, Math.max(0.01, 0.8 + 0.2 * vl));
      const vr = P(t, mid('insoluble', 0.8), 0.45, pop);
      op(verdR, clamp(vr * 2)); tr(verdR, RXc, 664, Math.max(0.01, 0.8 + 0.2 * vr));
    }

    /* ---- potato ---- */
    const pA = beat(t, at('potato'), at('cellulose'));
    op(PG, pA);
    if (pA > 0) {
      const pp = P(t, mid('potato', 0.04), 0.6, pop);
      tr(potato, PX, PY, Math.max(0.01, 0.7 + 0.3 * pp)); op(potato, clamp(pp * 2));
      const ar = P(t, mid('potato', 0.42), 0.9);
      sugarArrow.setAttribute('stroke-dashoffset', (1 - ar).toFixed(4)); op(sugarHead, clamp((ar - 0.85) / 0.15));
      const hOn = P(t, mid('potato', 0.5), 0.3, linear);
      sugarHex.forEach((e, k) => {
        const u = ((t - mid('potato', 0.5)) / 1.8 + k / 4) % 1, uu = u < 0 ? u + 1 : u;
        const q = along(sugarPath, uu);
        tr(e, q[0], q[1], 1, uu * 200);
        op(e, hOn * Math.min(1, uu * 8, (1 - uu) * 8));
      });
      pGrains.forEach(o => { const a = P(t, mid('potato', 0.12) + o.k * 0.05, 0.35, pop); op(o.g, clamp(a * 2)); tr(o.g, o.x, o.y, Math.max(0.01, a)); });
      op(pLblTop, P(t, mid('potato', 0.5), 0.4, linear)); op(pLblTop2, P(t, mid('potato', 0.55), 0.4, linear));
      op(pLblBot, P(t, mid('potato', 0.2), 0.4, linear));
    }

    /* ---- cellulose ---- */
    const cA = beat(t, at('cellulose'), at('proteins'));
    op(CG, cA);
    if (cA > 0) {
      const tIn = mid('cellulose', 0.08), tBund = mid('cellulose', 0.3), tWall = mid('cellulose', 0.46), tUp = mid('cellulose', 0.74);
      const bund = P(t, tBund, 0.8);
      const rowsPts = [[], [], []];
      cHex.forEach((o, k) => {
        const a = P(t, tIn + o.j * 0.07 + o.r * 0.12, 0.5);
        const tx = CHX + (o.j - (PER - 1) / 2) * 27, ty = 205 + (o.r - 1) * lerp(32, 15, bund);
        const x = lerp(o.x0, tx, a), y = lerp(o.y0, ty, a);
        tr(o.el, x, y, 1, (1 - a) * 90);
        op(o.el, P(t, tIn + o.j * 0.07 + o.r * 0.12, 0.2, linear));
        rowsPts[o.r].push([x, y]);
      });
      cBonds.forEach((b, r) => { b.setAttribute('d', lineD(rowsPts[r])); op(b, P(t, mid('cellulose', 0.24), 0.4, linear)); });
      op(fibre, P(t, tBund + 0.3, 0.5, linear)); op(fibreLbl, P(t, tBund + 0.4, 0.4, linear) * (1 - P(t, tWall + 0.3, 0.4, linear)));
      // the fibre drops onto the top of the cell and becomes its wall
      const mv = P(t, tWall - 0.3, 0.8);
      const sx = lerp(1, WW / 244, mv), sy = lerp(1, 0.25, mv), dy = lerp(0, WCY - WH / 2 - 205, mv);
      fibG.setAttribute('transform', `translate(${CHX} ${(205 + dy).toFixed(1)}) scale(${sx.toFixed(4)} ${sy.toFixed(4)}) translate(${-CHX} -205)`);
      op(fibG, 1 - P(t, tWall + 0.4, 0.4, linear));
      const wp = P(t, tWall + 0.2, 1.3);
      op(wallCell, P(t, tWall - 0.3, 0.5, linear));
      wallBand.setAttribute('stroke-dashoffset', (1 - wp).toFixed(4)); op(wallBand, t > tWall + 0.2 ? 1 : 0);
      op(wallHatch, P(t, tWall + 1.1, 0.4, linear) * 0.8);
      op(wallLbl, P(t, tWall + 0.9, 0.4, linear));
      // the seedling: limp, then it stands up
      const up = P(t, tUp, 1.0, easeOut);
      op(seedG, P(t, tWall + 0.4, 0.5, linear));
      const tipX = lerp(SEX + 44, SEX, up), tipY = lerp(SEY - 70, SEY - 140, up);
      const mx = lerp(SEX + 34, SEX + 4, up), my = lerp(SEY - 92, SEY - 80, up);
      seedStem.setAttribute('d', `M${SEX},${SEY - 4} Q${mx.toFixed(1)},${my.toFixed(1)} ${tipX.toFixed(1)},${tipY.toFixed(1)}`);
      tr(seedTop, tipX, tipY, 1, lerp(120, 0, up));
      op(seedLbl, P(t, tUp + 0.6, 0.4, linear));
    }

    /* ---- proteins ---- */
    const prA = beat(t, at('proteins'), at('rscp'));
    op(PRG, prA);
    if (prA > 0) {
      op(prHead, P(t, mid('proteins', 0.06), 0.4, linear));
      nDots.forEach(o => { attr(o.el, 'cx', o.x + Math.sin(t * 0.9 + o.ph) * 4 * AMP); attr(o.el, 'cy', o.y + Math.cos(t * 0.8 + o.ph) * 3 * AMP); });
      const tHex = mid('proteins', 0.2), tN = mid('proteins', 0.3), tJoin = mid('proteins', 0.52);
      const hp = P(t, tHex, 0.5, pop);
      op(pHex, clamp(hp * 2)); tr(pHex, 662, R1, Math.max(0.01, 0.6 + 0.4 * hp));
      op(pPlus, P(t, tN + 0.5, 0.3, linear));
      const nr2 = P(t, tN, 1.1, easeOut);
      tr(nChip, lerp(930, 818, nr2), lerp(652, R1, nr2) - Math.sin(nr2 * Math.PI) * 20);
      op(nChip, P(t, tN, 0.3, linear));
      const fl = Math.sin(Math.PI * P(t, tJoin + 0.15, 0.6, linear));
      op(flash, fl); tr(flash, 930, R1, 0.5 + 0.6 * fl);
      prArrow.set(P(t, tJoin, 0.4)); op(prArrow, t > tJoin ? 1 : 0);
      beads.forEach((b, k) => { const bp = P(t, tJoin + 0.5 + k * 0.07, 0.35, pop); op(b, clamp(bp * 2)); b.setAttribute('r', (12 * Math.max(0.01, bp)).toFixed(2)); });
      op(beadLine, P(t, tJoin + 0.6, 0.4, linear) * 0.75);
      beadsG.setAttribute('transform', `translate(1068 ${R1}) rotate(${(Math.sin(t * 0.9) * 4 * AMP).toFixed(2)})`);
      op(protLbl, P(t, tJoin + 1.0, 0.4, linear));
      // glucose -> oils
      const tO = mid('proteins', 0.8);
      popAt(oHex, 662, R2, t, tO);
      oArrow.set(P(t, tO + 0.25, 0.4)); op(oArrow, t > tO + 0.25 ? 1 : 0);
      const op_ = P(t, tO + 0.5, 0.5, pop); op(oil, clamp(op_ * 2)); tr(oil, 960, R2 + Math.sin(t * 1.6) * 3 * AMP, Math.max(0.01, 0.6 + 0.4 * op_));
      op(oilLbl, P(t, tO + 0.65, 0.4, linear));
    }

    /* ---- rscp ---- */
    const mA = beat(t, at('rscp'), at('oxygen'));
    op(MG, mA);
    if (mA > 0) {
      mWords.forEach((w, i) => {
        const p = P(t, mid('rscp', 0.17 + i * 0.1), 0.45, easeOut);
        op(w, p); w.setAttribute('transform', `translate(${((1 - p) * -24).toFixed(1)} 0)`);
      });
      const cp = P(t, mid('rscp', 0.38), 0.6, pop);
      op(carrot, clamp(cp * 2)); tr(carrot, 1010, 440, Math.max(0.01, 0.6 + 0.4 * cp), 18 + 4 * Math.sin(t * 2) * AMP);
      const kp = P(t, mid('rscp', 0.5), 0.4, pop);
      op(crunch, clamp(kp * 2)); tr(crunch, 1035, 172, Math.max(0.01, kp), -6);
    }

    /* ---- oxygen ---- */
    const oA = P(t, at('oxygen') - 0.3, 0.4, linear);
    op(OG, oA);
    if (oA > 0) {
      const lp = P(t, at('oxygen'), 0.6, easeOut);
      tr(bigLeaf, LF0[0], LF0[1] + (1 - lp) * 30);
      op(airLbl, P(t, mid('oxygen', 0.3), 0.4, linear));
      const q = P(t, at('oxygen') + 0.1, 0.45, pop);
      const qOut = P(t, mid('oxygen', 0.3), 0.4, linear);
      op(oxQ, clamp(q * 2) * (1 - qOut)); tr(oxQ, 600, 330 - qOut * 40, Math.max(0.01, 0.6 + 0.4 * q));
      const T2 = mid('oxygen', 0.28), on = P(t, T2, 0.4, linear);
      OUT.forEach(o => {
        const u = ((t - T2) / 3.2 + o.ph) % 1, uu = u < 0 ? u + 1 : u;
        const x = o.x0 + o.dx * uu + Math.sin(uu * 5 + o.ph * 7) * 10, y = lerp(o.y0, 170, easeOut(uu));
        tr(o.el, x, y, 1, Math.sin(uu * 6 + o.ph) * 30);
        op(o.el, on * Math.min(1, uu * 8, (1 - uu) * 4));
      });
      const T3 = mid('oxygen', 0.62), on2 = P(t, T3, 0.4, linear);
      oxMito.upd(t); op(oxMitoG, P(t, mid('oxygen', 0.55), 0.4, linear));
      IN.forEach(o => {
        const u = ((t - T3) / 2.2 + o.ph) % 1, uu = u < 0 ? u + 1 : u;
        const qq = quadPt([o.x0, o.y0], [o.x0 + 40, 380], [690, 540], easeIn(uu));
        tr(o.el, qq[0], qq[1], 1 - 0.4 * uu, uu * 90);
        op(o.el, on2 * Math.min(1, uu * 6, (1 - uu) * 5));
      });
      popAt(oxMost, 960, 236, t, mid('oxygen', 0.36));
      op(oxSome, P(t, mid('oxygen', 0.7), 0.4, linear));
    }
  };
});
