/* Chapter 9, Testing a leaf for starch.
   A leaf's spare glucose links into starch grains: finding starch proves photosynthesis -> iodine on a white
   tile stays orange-brown, but turns blue-black on starch -> along a lab bench, one leaf moves through the four
   steps: boiling water (inset: the membranes break), ethanol in a water bath (the chlorophyll bleeds out, the
   leaf goes pale; the Bunsen is off because ethanol is flammable), warm water (it softens), then iodine turns
   it blue-black (showpiece) -> We End With Iodine over the four stations -> destarching in a dark cupboard,
   new starch back in the light -> three test cards: variegated leaf, foil strip, soda lime. */
scene('starch', S => {
  const { at, end, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;
  const idle = t => t * calm;
  const IOD = '#C8782E', BLK = '#1E2257', PALE = '#EDE3C2', PALE_DK = '#B9A66E', WHITE_LF = '#F4F0DE';
  const ETH0 = '#E4EEF4', ETH1 = '#4CBF62';

  /* ---------- local helpers ---------- */
  const rgb = c => { const n = parseInt(c.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; };
  const mix = (a, b, p) => { const x = rgb(a), y = rgb(b), q = clamp(p); return `rgb(${x.map((v, i) => Math.round(v + (y[i] - v) * q)).join(',')})`; };
  const scaleAt = (el, x, y, s) => el.setAttribute('transform', `translate(${x} ${y}) scale(${Math.max(0.001, s).toFixed(4)}) translate(${-x} ${-y})`);
  const popAt = (el, x, y, t0, t, s) => { const k = P(t, t0, 0.5, pop); op(el, clamp(k * 2)); tr(el, x, y, Math.max(0.01, (s || 1) * (0.6 + 0.4 * k))); return k; };
  /* keyframes [[t, v1, v2, ...], ...] -> [v1, v2, ...] at time t: eased between keys, held outside them */
  function track(keys, t) {
    if (t <= keys[0][0]) return keys[0].slice(1);
    for (let i = 1; i < keys.length; i++) if (t < keys[i][0]) { const a = keys[i - 1], b = keys[i], p = ease((t - a[0]) / (b[0] - a[0])); return a.slice(1).map((v, k) => lerp(v, b[k + 1], p)); }
    return keys[keys.length - 1].slice(1);
  }
  /* a leader from (0,0) to (dx,dy) with text beyond it; place the group on its anchor with tr() */
  function pin(parent, text, dx, dy, o) {
    o = o || {};
    const g = G(parent), col = o.line || C.muted, size = o.size || 28, right = dx >= 0;
    E('line', { x1: 0, y1: 0, x2: dx, y2: dy, stroke: col, 'stroke-width': 2.5 }, g);
    E('circle', { r: 5, fill: col }, g);
    T(g, dx + (right ? 10 : -10), dy + size * 0.34, text, { size, weight: o.weight || 700, fill: o.fill || C.ink, anchor: right ? 'start' : 'end', lh: size * 1.15 });
    return g;
  }
  let nClip = 0;
  function clipTo(d) { const id = 'starchClip' + (++nClip); const cp = E('clipPath', { id }, defs()); E('path', { d }, cp); return `url(#${id})`; }
  const circD = (cx, cy, r) => `M${cx - r},${cy} a${r},${r} 0 1 0 ${2 * r},0 a${r},${r} 0 1 0 ${-2 * r},0 Z`;
  const dropD = 'M0,-9 C5,-2 7,3 7,6 A7,7 0 0 1 -7,6 C-7,3 -5,-2 0,-9 Z';

  /* the kit leaf's outline, centred on (0,0): 205 long, about 98 wide */
  const LEAF_D = 'M-102.5,0 C-62.5,-60 47.5,-70 102.5,0 C47.5,70 -62.5,60 -102.5,0 Z';
  const VEINS_D = 'M-106,0 L96,0' + [1, 2, 3, 4].map(i => { const x = -102.5 + i * 38; return ` M${x},0 Q${x + 16},${-(18 + i * 2)} ${x + 26},${-(30 - i * 2)} M${x},0 Q${x + 16},${18 + i * 2} ${x + 26},${30 - i * 2}`; }).join('');
  const cub = (p0, p1, p2, p3, u) => { const v = 1 - u; return [0, 1].map(k => v * v * v * p0[k] + 3 * v * v * u * p1[k] + 3 * v * u * u * p2[k] + u * u * u * p3[k]); };
  const LEAF_PTS = [];
  for (let i = 0; i < 10; i++) LEAF_PTS.push(cub([-102.5, 0], [-62.5, -60], [47.5, -70], [102.5, 0], i / 10));
  for (let i = 0; i < 10; i++) LEAF_PTS.push(cub([102.5, 0], [47.5, 70], [-62.5, 60], [-102.5, 0], i / 10));
  /* the green middle of a variegated leaf: the outline pulled in, with a wavy edge */
  const INNER_D = closedPath(LEAF_PTS.map(([x, y], i) => [x * 0.78 - 6, y * (0.52 + 0.12 * Math.sin(i * 1.9))]));
  /* a leaf for the starch test, centred on (0,0). g.set({ green, dark, brown, black, band, rb, rk }):
     layer strengths 0..1, and rb/rk the radii of the iodine and blue-black stains spreading from the middle.
     o.layers: which layers to build, from 'g' green, 'd' boiled-dark, 'b' orange-brown, 'k' blue-black,
     's' spreading stains (default 'g'). o.base: colour under the layers; o.inner: the green (and the blue-black)
     only in the middle (variegated); o.band: [x0, x1] a strip that stays orange-brown (foil) */
  function testLeaf(parent, o) {
    o = o || {};
    const L = o.layers || 'g', has = c => L.indexOf(c) >= 0, g = G(parent);
    E('path', { d: 'M-100,2 Q-118,8 -132,24', fill: 'none', stroke: o.stalk || C.stem, 'stroke-width': 5, 'stroke-linecap': 'round' }, g);
    E('path', { d: LEAF_D, fill: o.base || PALE }, g);
    const inn = has('s') || o.band ? G(g, { 'clip-path': clipTo(LEAF_D) }) : g;
    const green = has('g') ? E('path', { d: o.inner || LEAF_D, fill: ball(C.plant, C.plantDk) }, inn) : null;
    const dark = has('d') ? E('path', { d: LEAF_D, fill: '#2A4A1E' }, inn) : null;
    const brown = has('b') ? E('path', { d: LEAF_D, fill: IOD }, inn) : null;
    const black = has('k') ? E('path', { d: o.inner || LEAF_D, fill: BLK }, inn) : null;
    const band = o.band ? E('rect', { x: o.band[0], y: -80, width: o.band[1] - o.band[0], height: 160, fill: IOD }, inn) : null;
    const blobB = has('s') ? E('path', { fill: IOD }, inn) : null, blobK = has('s') ? E('path', { fill: BLK }, inn) : null;
    const edge = E('path', { d: LEAF_D, fill: 'none', stroke: C.plantDk, 'stroke-width': 3 }, g);
    const vein = E('path', { d: VEINS_D, fill: 'none', 'stroke-width': 3, 'stroke-linecap': 'round' }, g);
    const bp = blobPts(1, 0.8, 14, 0, 0.18, o.seed || 4);
    const blob = r => (r <= 0.5 ? 'M0,0' : closedPath(bp.map(p => [p[0] * r + 6, p[1] * r])));
    g.set = v => {
      const gr = v.green || 0, b = v.brown || 0, k = v.black || 0, stain = Math.max(b, k, clamp((v.rb || 0) / 40));
      if (green) op(green, gr); if (dark) op(dark, (v.dark || 0) * 0.5 * gr); if (brown) op(brown, b); if (black) op(black, k); if (band) op(band, v.band || 0);
      const blue = k > 0.5 || (v.rk || 0) > 60;
      edge.setAttribute('stroke', blue ? '#3B3F80' : stain > 0.5 ? '#8A5220' : mix(PALE_DK, '#22844A', gr));
      vein.setAttribute('stroke', stain > 0.5 ? (blue ? '#4A4F92' : '#E2A060') : mix(PALE_DK, '#C9F2D3', gr));
      op(vein, stain > 0.5 ? 0.45 : 0.75 + 0.05 * (1 - gr));
      if (blobB) { blobB.setAttribute('d', blob(v.rb || 0)); blobK.setAttribute('d', blob(v.rk || 0)); }
    };
    g.set({ green: 1 });
    return g;
  }
  /* starch grain: a pale oval with a growth ring */
  function grain(parent, rx, ry) {
    const g = G(parent);
    E('ellipse', { rx, ry, fill: ball('#FBF7EA', '#D9CFB4'), stroke: '#C9BE9C', 'stroke-width': 2 }, g);
    E('ellipse', { cx: -rx * 0.14, rx: rx * 0.55, ry: ry * 0.52, fill: 'none', stroke: '#CFC4A2', 'stroke-width': 1.6 }, g);
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
  /* glass dropper, origin at its tip */
  function dropper(parent) {
    const g = G(parent);
    E('path', { d: 'M-2,0 L2,0 L6,-24 L6,-104 L-6,-104 L-6,-24 Z', fill: GLASS.fill, stroke: GLASS.stroke, 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, g);
    E('path', { d: 'M-1.4,-3 L1.4,-3 L4,-24 L4,-60 L-4,-60 L-4,-24 Z', fill: IOD }, g);
    E('rect', { x: -10, y: -134, width: 20, height: 34, rx: 9, fill: ball('#D9534A', '#8E2A22'), stroke: '#F09A8E', 'stroke-width': 2 }, g);
    return g;
  }

  /* ================= A. proof: spare glucose becomes starch ================= */
  const A = G(root);
  const bigLeaf = G(A);
  E('path', { d: 'M4,0 Q-26,26 -58,52', fill: 'none', stroke: C.stem, 'stroke-width': 10, 'stroke-linecap': 'round' }, bigLeaf);
  leaf(bigLeaf, 2.3);
  const LB = [120, 420];
  const SITES = [[245, 452], [365, 386], [482, 444]];
  const hexes = [], hr = rng(31);
  SITES.forEach(st => [-1, 0, 1].forEach(j => {
    const g = molGlucose(A, 13);
    hexes.push({ g, x0: st[0] + (hr() - 0.5) * 130, y0: st[1] + (hr() - 0.5) * 90, x1: st[0] + j * 23, y1: st[1] + (j % 2 ? 6 : 0), d: hr() * 0.5 });
  }));
  const grains = SITES.map(([x, y]) => { const g = grain(A, 21, 15); tr(g, x, y); return g; });
  const lens = G(A);
  E('line', { x1: 64, y1: 64, x2: 140, y2: 140, stroke: '#C9D6DE', 'stroke-width': 20, 'stroke-linecap': 'round' }, lens);
  E('circle', { r: 90, fill: '#2C7443' }, lens);
  E('path', { d: 'M-90,-26 L90,-12 M-90,40 L90,52 M-30,-90 L-22,90 M44,-90 L52,90', stroke: '#4FAE6A', 'stroke-width': 4, opacity: 0.6 }, lens);
  [[-36, -38], [34, 8], [-24, 50]].forEach(([x, y]) => { const g = grain(lens, 30, 22); tr(g, x, y); });
  E('circle', { r: 90, fill: 'none', stroke: '#E4EDF2', 'stroke-width': 10 }, lens);
  E('path', { d: 'M-58,-36 A68,68 0 0 1 -26,-64', stroke: '#ffffff', 'stroke-width': 6, fill: 'none', opacity: 0.45, 'stroke-linecap': 'round' }, lens);
  const lensAt = [365, 386];
  const flow = G(A);
  const fr1 = G(flow); tr(molGlucose(fr1, 24), 790, 228); T(fr1, 834, 240, 'spare glucose', { size: 32, weight: 700, fill: C.glucoseLt });
  const fArr = arrow(flow, 790, 272, 790, 324, { color: C.muted, width: 5 });
  const fr2 = G(flow); tr(grain(fr2, 26, 19), 790, 364); T(fr2, 834, 376, 'stored as starch', { size: 32, weight: 700, fill: '#F3EEDD' });
  const proofCard = G(A);
  card(proofCard, 760, 470, 390, 150, { fill: C.card, stroke: C.energy, sw: 3 });
  T(proofCard, 955, 534, 'starch = proof', { size: 42, weight: 700, anchor: 'middle', fill: C.energy });
  T(proofCard, 955, 582, 'it has been photosynthesising', { size: 26, weight: 600, anchor: 'middle', fill: C.ink });
  const lensLab = pin(A, 'starch grains', 120, -86, { size: 28, fill: '#F3EEDD', line: '#F3EEDD' });

  /* ================= B. the lab bench, filmed by a moving camera ================= */
  const Bg = G(root);
  const cam = G(Bg);
  const BY = 640, SX = [175, 450, 725, 1010];
  E('rect', { x: -500, y: BY, width: 2300, height: 14, fill: '#4A5C6A' }, cam);
  E('rect', { x: -500, y: BY + 14, width: 2300, height: 260, fill: '#1F2D37' }, cam);
  E('line', { x1: -500, x2: 1800, y1: BY, y2: BY, stroke: '#8FA3B2', 'stroke-width': 2 }, cam);
  // station 4, under the leaf: the white tile and its spots
  const st4a = G(cam);
  E('path', { d: 'M886,630 L1110,630 L1134,550 L910,550 Z', fill: '#F4F7FA', stroke: '#DDE5EC', 'stroke-width': 2, 'stroke-linejoin': 'round' }, st4a);
  E('path', { d: 'M886,630 L1110,630 L1110,640 L886,640 Z', fill: '#BCC8D2' }, st4a);
  const spots = G(st4a);
  const spotA = E('ellipse', { cx: 955, cy: 600, rx: 24, ry: 9, fill: IOD }, spots);
  const starchPile = E('path', { d: 'M1040,603 Q1046,586 1066,584 Q1086,586 1092,603 Z', fill: '#FBF8F0', stroke: '#D6D0C2', 'stroke-width': 2 }, spots);
  const spotB = E('ellipse', { cx: 1066, cy: 598, rx: 27, ry: 10, fill: IOD }, spots);
  // the leaf (in front of the tile, behind every beaker)
  const leafG = G(cam);
  const lf = testLeaf(leafG, { layers: 'gds', seed: 6 });
  const LS = 0.54;
  // station 1: boiling water on a Bunsen
  const st1 = G(cam);
  const bun = bunsen(st1, 0.75); tr(bun, SX[0], BY - 18 * 0.75);
  E('path', { d: `M${SX[0] - 66},452 L${SX[0] - 86},${BY} M${SX[0] + 66},452 L${SX[0] + 86},${BY}`, stroke: '#9DB0BF', 'stroke-width': 6, 'stroke-linecap': 'round' }, st1);
  E('rect', { x: SX[0] - 82, y: 448, width: 164, height: 7, rx: 3, fill: '#9DB0BF' }, st1);
  E('rect', { x: SX[0] - 40, y: 448, width: 80, height: 7, fill: '#E8EEF2' }, st1);
  tr(beaker(st1, 150, 135, { level: 0.75, liquid: C.water, opacity: 0.42 }), SX[0], 448 - 67.5);
  const bub1 = bubbles(st1, SX[0] - 64, 372, 128, 72, { n: 9, r: 5.5, seed: 5, speed: 0.8 });
  const steam1 = heatWaves(st1, { n: 3, h: 56, spacing: 36, width: 4, color: '#DCEBF5' }); tr(steam1, SX[0], 306);
  // station 2: a test tube of ethanol in a hot-water bath
  const st2 = G(cam);
  tr(beaker(st2, 170, 150, { level: 0.55, liquid: C.water, opacity: 0.38, marks: false }), SX[1], BY - 75);
  const tube = testTube(st2, 52, 230, { level: 0.72, liquid: ETH0, opacity: 0.4 }); tr(tube, SX[1], 520);
  const bub2 = bubbles(st2, SX[1] - 12, 486, 24, 76, { n: 5, r: 3.5, seed: 7, speed: 0.9 });
  const wisps = [0, 1, 2, 3].map(() => E('path', { d: 'M0,-7 C5,-3 6,3 0,7 C-6,3 -5,-3 0,-7 Z', fill: ETH1 }, st2));
  E('rect', { x: SX[1] - 81, y: 568, width: 162, height: 70, rx: 10, fill: C.water, opacity: 0.18 }, st2);
  const steam2 = heatWaves(st2, { n: 2, h: 46, spacing: 112, width: 4, color: '#DCEBF5' }); tr(steam2, SX[1], 484);
  // station 3: warm water
  const st3 = G(cam);
  tr(beaker(st3, 150, 135, { level: 0.72, liquid: '#7FD3F7', opacity: 0.4, marks: false }), SX[2], BY - 67.5);
  const warm3 = heatWaves(st3, { n: 2, h: 38, spacing: 64, width: 3, color: C.heat }); tr(warm3, SX[2], 498);
  // station 4, in front of the leaf: iodine bottle, dropper and drops
  const st4b = G(cam);
  E('rect', { x: 828, y: 566, width: 46, height: 74, rx: 8, fill: ball('#A8642E', '#5A2E10'), stroke: '#D9A06A', 'stroke-width': 2 }, st4b);
  E('path', { d: 'M834,568 L842,552 L860,552 L868,568 Z', fill: '#7A4520', stroke: '#D9A06A', 'stroke-width': 2, 'stroke-linejoin': 'round' }, st4b);
  E('rect', { x: 834, y: 590, width: 34, height: 26, rx: 3, fill: '#F2E6CC' }, st4b);
  const pip = dropper(st4b);
  const drops = [0, 1, 2].map(() => E('path', { d: dropD, fill: IOD }, st4b));
  const STATIONS = [st1, st2, st3, [st4a, st4b]];

  /* screen-space overlays for the bench */
  const ov = G(Bg);
  function header(text, color) { const c = chip(ov, text, { size: 28, fill: 'rgba(10,27,39,0.8)', stroke: C.line, sw: 2, color: color || C.energy }); tr(c, 1160 - c.w / 2, 60); return c; }
  const hdrs = [header('The iodine test'), header('Step 1 · boil in water'), header('Step 2 · boil in ethanol'), header('Step 3 · warm water'), header('Step 4 · add iodine')];
  // iodine: swatches
  const sw = G(ov);
  card(sw, 862, 214, 288, 252, { fill: C.card, stroke: C.line });
  T(sw, 1006, 258, 'iodine turns', { size: 28, weight: 600, anchor: 'middle', fill: C.muted });
  const swRows = [['no starch:', 'orange-brown', IOD, '#F0A456', 318], ['starch:', 'blue-black', BLK, '#A9B2FF', 410]].map(([a, b, c, tc, y]) => {
    const g = G(sw);
    E('rect', { x: 884, y: y - 34, width: 64, height: 64, rx: 12, fill: '#F4F7FA' }, g);
    E('ellipse', { cx: 916, cy: y - 2, rx: 22, ry: 15, fill: c }, g);
    T(g, 964, y - 8, a, { size: 26, weight: 600, fill: C.ink });
    T(g, 964, y + 24, b, { size: 28, weight: 700, fill: tc });
    return g;
  });
  const lbNo = T(ov, 0, 0, 'no starch', { size: 26, weight: 700, anchor: 'middle', fill: C.muted });
  const lbSt = T(ov, 0, 0, 'starch', { size: 26, weight: 700, anchor: 'middle', fill: '#F3EEDD' });
  const lbIod = pin(ov, 'iodine\nsolution', -60, -170, { size: 28, fill: '#F0A456', line: '#F0A456' });
  // boil: inside a leaf cell
  const IN = [905, 352], INR = 168;
  const inset = G(ov);
  const inLead = E('line', { stroke: C.muted, 'stroke-width': 2.5, 'stroke-dasharray': '8 7' }, inset);
  E('circle', { cx: IN[0], cy: IN[1], r: INR, fill: '#0E2431', stroke: C.muted, 'stroke-width': 4 }, inset);
  T(inset, IN[0], IN[1] - INR + 46, 'one leaf cell', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  const cellG = G(inset);
  E('rect', { x: IN[0] - 112, y: IN[1] - 70, width: 224, height: 150, rx: 18, fill: 'rgba(91,210,122,0.10)', stroke: '#3FA463', 'stroke-width': 9 }, cellG);
  const memb = E('rect', { x: IN[0] - 98, y: IN[1] - 56, width: 196, height: 122, rx: 12, fill: 'none', stroke: '#F7A8C8', 'stroke-width': 4, pathLength: 100 }, cellG);
  const cellIn = G(cellG);
  E('circle', { cx: IN[0] - 44, cy: IN[1] - 4, r: 24, fill: 'rgba(150,120,220,0.45)', stroke: '#B79CF0', 'stroke-width': 3 }, cellIn);
  [[30, -26, 10], [62, 8, -20], [8, 34, 25], [-62, 36, -10], [48, 44, 15]].forEach(([x, y, r]) => {
    const c = G(cellIn); tr(c, IN[0] + x, IN[1] + y, 1, r);
    E('ellipse', { rx: 20, ry: 10, fill: ball(C.chloro, C.chloroDk), stroke: C.chloroDk, 'stroke-width': 2 }, c);
    E('path', { d: 'M-10,-4 L-10,4 M-2,-5 L-2,5 M6,-4 L6,4 M13,-2 L13,2', stroke: C.chloroDk, 'stroke-width': 3.5, 'stroke-linecap': 'round' }, c);
  });
  const iodIn = [0, 1, 2, 3, 4].map(() => E('circle', { r: 6, fill: IOD, stroke: '#F0B070', 'stroke-width': 1.5 }, inset));
  const lbMem = G(inset);
  E('line', { x1: IN[0], y1: IN[1] + 66, x2: IN[0], y2: IN[1] + 92, stroke: '#F7A8C8', 'stroke-width': 2.5 }, lbMem);
  T(lbMem, IN[0], IN[1] + 122, 'cell membrane', { size: 26, weight: 700, anchor: 'middle', fill: '#F7A8C8' });
  const capBack = E('rect', { x: IN[0] - 190, y: IN[1] + INR + 12, width: 380, height: 88, rx: 20, fill: 'rgba(14,36,49,0.94)', stroke: C.line, 'stroke-width': 2 }, ov);
  const lbBreak = T(ov, IN[0], IN[1] + INR + 46, 'the membranes break down', { size: 28, weight: 700, anchor: 'middle', fill: '#F7A8C8' });
  const lbIn = T(ov, IN[0], IN[1] + INR + 82, 'so iodine can get in', { size: 28, weight: 700, anchor: 'middle', fill: '#F0A456' });
  // ethanol
  const lbEth = pin(ov, 'ethanol', 150, -60, { size: 28, fill: '#E4EEF4', line: C.muted });
  const lbChl = pin(ov, 'green chlorophyll\ncomes out', 160, 0, { size: 28, fill: '#8EE59F', line: ETH1 });
  const lbPale = pin(ov, 'pale leaf', 170, 50, { size: 28, fill: PALE, line: PALE_DK });
  const bunOff = G(ov);
  { const c = chip(bunOff, 'Bunsen off', { size: 28, fill: C.card2, stroke: C.good }); const tk = tick(bunOff, 11); tr(tk, -c.w / 2 - 26, -2); }
  // safety
  const haz = G(ov);
  E('rect', { x: -32, y: -32, width: 64, height: 64, rx: 4, fill: '#ffffff', stroke: '#E8424F', 'stroke-width': 7, transform: 'rotate(45)' }, haz);
  E('path', { d: 'M0,-26 C14,-10 18,2 15,12 C12,22 5,26 0,26 C-5,26 -14,22 -16,12 C-18,3 -10,-5 -5,-14 C-4,-6 0,-2 3,-1 C5,-9 3,-18 0,-26 Z', fill: '#1A1A1A' }, haz);
  E('rect', { x: -22, y: 24, width: 44, height: 5, fill: '#1A1A1A' }, haz);
  const hazTxt = T(ov, 0, 0, 'flammable', { size: 30, weight: 700, fill: '#FF9AA2' });
  const ghostFlame = G(ov);
  E('path', { d: 'M0,0 C-20,-20 -18,-62 0,-104 C18,-62 20,-20 0,0 Z', fill: 'rgba(90,168,255,0.12)', stroke: '#5AA8FF', 'stroke-width': 3, 'stroke-dasharray': '8 6' }, ghostFlame);
  const gfX = cross(ghostFlame, 22); tr(gfX, 0, -50);
  const lbBath = pin(ov, 'water\nbath', -36, -112, { size: 28, fill: C.water, line: C.water });
  // warm
  const lbBrit = pin(ov, 'stiff and brittle', 120, -60, { size: 28, fill: PALE, line: PALE_DK });
  const lbSoft = pin(ov, 'soft again', -64, -66, { size: 28, fill: C.heat, line: C.heat });
  // add
  const lbBB = chip(ov, 'blue-black: starch!', { size: 30, fill: C.card2, stroke: '#A9B2FF', color: '#C9CEFF' });
  // We End With Iodine
  const wewi = G(ov);
  const WW = ['We', 'End', 'With', 'Iodine'], STEPW = ['water', 'ethanol', 'warm water', 'iodine'];
  const wWords = WW.map((w, i) => ({ el: T(wewi, SX[i], 196, `**${w[0]}**${w.slice(1)}`, { size: 58, weight: 700, anchor: 'middle', boldFill: C.energy }), x: SX[i] }));
  const tags = STEPW.map((w, i) => {
    const g = G(wewi);
    const c = chip(g, w, { size: 28, fill: C.card2, stroke: C.line, padX: 22 });
    const lit = E('rect', { x: -c.w / 2 - 4, y: -c.h / 2 - 4, width: c.w + 8, height: c.h + 8, rx: (c.h + 8) / 2, fill: 'none', stroke: C.energy, 'stroke-width': 4 }, g);
    const n = G(g); tr(n, -c.w / 2 - 6, -c.h / 2 + 2);
    E('circle', { r: 18, fill: C.energy }, n); T(n, 0, 8.5, String(i + 1), { size: 24, weight: 700, anchor: 'middle', fill: C.bg0 });
    tr(g, SX[i], 268);
    return { g, lit, c };
  });

  /* camera keys: bench point (bx, by) shown at screen (X, Y), zoom s */
  const KI = [1010, 590, 540, 470, 1.75], KO = [600, 375, 600, 375, 1], K1 = [SX[0], BY, 330, 690, 1.6], K2 = [SX[1], BY, 420, 690, 1.6];
  const K12 = [312, BY, 520, 690, 1.3], K3 = [SX[2], BY, 600, 690, 1.6], K4 = [1010, 590, 600, 470, 2.0];
  /* the leaf's journey: [t, x, y, rotation, scale along, scale across] in bench coordinates */
  const b0 = mid('boil', 0.32), e0 = at('ethanol') + 0.25, w0 = at('warm') + 0.1, a0 = at('add') - 0.3;
  const CAM = [
    [at('boil'), ...KI], [at('boil') + 0.8, ...KO], [mid('boil', 0.22), ...KO], [mid('boil', 0.22) + 0.9, ...K1],
    [e0 + 0.45, ...K1], [e0 + 1.6, ...K2], [at('safety'), ...K2], [at('safety') + 1.0, ...K12],
    [w0 + 0.4, ...K12], [w0 + 1.5, ...K3], [a0 + 0.3, ...K3], [a0 + 1.3, ...K4],
    [at('wewi'), ...K4], [at('wewi') + 1.0, ...KO],
  ];
  const LEAFK = [
    [b0, SX[0], 236, -12, 1, 1], [b0 + 0.9, SX[0], 404, -6, 1, 1],
    [e0, SX[0], 404, -6, 1, 1], [e0 + 0.6, SX[0], 286, -4, 1, 1], [e0 + 1.5, SX[1], 330, 60, 0.95, 0.55], [e0 + 2.2, SX[1], 524, 90, 0.88, 0.34],
    [w0, SX[1], 524, 90, 0.88, 0.34], [w0 + 0.6, SX[1], 318, 70, 0.95, 0.5], [w0 + 1.4, SX[2], 430, 8, 1, 0.58], [w0 + 1.9, SX[2], 598, 4, 1, 0.58], [w0 + 2.8, SX[2], 598, 0, 1, 1],
    [a0, SX[2], 598, 0, 1, 1], [a0 + 0.5, SX[2], 430, 0, 1, 1], [a0 + 1.3, 1010, 430, 0, 1, 0.9], [a0 + 1.75, 1010, 591, 0, 1, 0.78],
  ];
  /* the dropper: [t, x, y] of its tip, and when each drop leaves it */
  const REST = [851, 610];
  const PIPK = [
    [mid('iodine', 0.1), ...REST], [mid('iodine', 0.24), 955, 520], [mid('iodine', 0.42), 955, 520], [mid('iodine', 0.52), 1066, 516], [mid('iodine', 0.74), 1066, 516], [mid('iodine', 0.86), ...REST],
    [a0 + 1.5, ...REST], [a0 + 2.0, 1012, 506], [a0 + 3.1, 1012, 506], [a0 + 3.6, ...REST],
  ];
  const DROPS = [[mid('iodine', 0.3), 955, 600], [mid('iodine', 0.58), 1066, 596], [a0 + 2.1, 1012, 590], [a0 + 2.35, 1012, 590], [a0 + 2.6, 1012, 590]];

  /* ================= C. destarching in a dark cupboard ================= */
  const Cg = G(root);
  const FLOOR = 620;
  E('rect', { x: 80, y: FLOOR, width: 1040, height: 10, rx: 5, fill: '#3A4A57' }, Cg);
  const cSun = sun(Cg, 34); tr(cSun, 1088, 150);
  E('rect', { x: 120, y: 178, width: 360, height: 452, rx: 12, fill: linGrad('#8A6240', '#5A3A22'), stroke: '#B98A5E', 'stroke-width': 4 }, Cg);
  E('rect', { x: 142, y: 200, width: 316, height: 420, rx: 6, fill: '#060C12' }, Cg);
  const plantG = G(Cg), PPS = 0.6, potPl = introPlant(plantG, { s: PPS }); tr(potPl, 0, -176 * PPS);   // pot bottom on the floor
  const LEADP = potPl.leafPt(3, 0.6);                                                                     // the leaf the inset looks into
  const cupDark = E('rect', { x: 142, y: 200, width: 316, height: 420, fill: '#060C12' }, Cg);
  const door = E('path', { fill: linGrad('#A27650', '#6E4A2C'), stroke: '#C9996B', 'stroke-width': 3, 'stroke-linejoin': 'round' }, Cg);
  const knob = E('circle', { r: 9, fill: '#E9D3A6', stroke: '#8A6240', 'stroke-width': 2 }, Cg);
  const clock = G(Cg); tr(clock, 800, 232);
  E('circle', { r: 58, fill: C.card, stroke: C.muted, 'stroke-width': 5 }, clock);
  E('path', { d: [...Array(12).keys()].map(i => { const a = i * TAU / 12; return `M${(Math.cos(a) * 45).toFixed(1)},${(Math.sin(a) * 45).toFixed(1)} L${(Math.cos(a) * 52).toFixed(1)},${(Math.sin(a) * 52).toFixed(1)}`; }).join(' '), stroke: C.muted, 'stroke-width': 3 }, clock);
  const hHour = E('line', { x1: 0, y1: 0, x2: 0, y2: -28, stroke: C.ink, 'stroke-width': 6, 'stroke-linecap': 'round' }, clock);
  const hMin = E('line', { x1: 0, y1: 0, x2: 0, y2: -44, stroke: C.energy, 'stroke-width': 4, 'stroke-linecap': 'round' }, clock);
  E('circle', { r: 6, fill: C.energy }, clock);
  const clockLab = T(Cg, 800, 334, '1–2 days in the dark', { size: 30, weight: 700, anchor: 'middle', fill: C.energy });
  const IC = [930, 516], IR = 104;
  const insLead = E('line', { stroke: C.muted, 'stroke-width': 2.5, 'stroke-dasharray': '8 7' }, Cg);
  const ins = G(Cg);
  E('circle', { cx: IC[0], cy: IC[1], r: IR, fill: '#1B4A2C', stroke: C.muted, 'stroke-width': 4 }, ins);
  const insIn = G(ins, { 'clip-path': clipTo(circD(IC[0], IC[1], IR - 2)) });
  E('path', { d: [-1, 0, 1].map(r => [-1, 0, 1].map(c => { const x = IC[0] + c * 70 - 32 + (r % 2) * 18, y = IC[1] + r * 62 - 27; return `M${x + 12},${y} h40 a12,12 0 0 1 12,12 v30 a12,12 0 0 1 -12,12 h-40 a12,12 0 0 1 -12,-12 v-30 a12,12 0 0 1 12,-12 Z`; }).join(' ')).join(' '), fill: 'rgba(91,210,122,0.14)', stroke: '#3FA463', 'stroke-width': 3 }, insIn);
  const GR = [[-40, -38], [30, -46], [-58, 18], [8, 4], [56, 22], [-14, 56]];
  const oldG = GR.map(([x, y]) => { const g = grain(insIn, 15, 11); tr(g, IC[0] + x, IC[1] + y); return g; });
  const newG = GR.map(([x, y], i) => { const g = grain(insIn, 15, 11); tr(g, IC[0] + x + (i % 2 ? 8 : -6), IC[1] + y + 6); return g; });
  const insLab = T(Cg, IC[0], IC[1] - IR - 20, 'starch in a leaf', { size: 28, weight: 600, anchor: 'middle', fill: C.muted });
  const usedUp = chip(Cg, 'starch used up', { size: 28, fill: C.card2, stroke: C.line });
  const newChip = chip(Cg, 'new starch: made during the experiment', { size: 30, fill: 'rgba(86,214,155,0.16)', stroke: C.good });

  /* ================= D. three tests, one card each ================= */
  const Dg = G(root);
  const DX = [215, 600, 985];
  const cards = DX.map((x, i) => {
    const g = G(Dg);
    card(g, x - 176, 126, 352, 576, { fill: C.card, stroke: C.line });
    const title = T(g, x, 180, ['chlorophyll', 'light', 'carbon dioxide'][i], { size: 36, weight: 700, anchor: 'middle', fill: [C.plant, C.energy, C.co2][i] });
    const sub = T(g, x, 218, ['a variegated leaf', 'part covered by foil', 'sealed in with soda lime'][i], { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
    const arr = arrow(g, x - 60, 410, x - 60, 462, { color: C.muted, width: 5 });
    const arrT = T(g, x - 36, 446, 'starch test', { size: 26, weight: 600, fill: C.muted });
    const tile = G(g);
    E('rect', { x: x - 152, y: 476, width: 304, height: 134, rx: 18, fill: '#F4F7FA', stroke: '#DDE5EC', 'stroke-width': 2 }, tile);
    const res = G(g);
    const okG = G(g);
    const ok = chip(okG, ['chlorophyll needed', 'light needed', 'CO₂ needed'][i], { size: 28, fill: 'rgba(86,214,155,0.16)', stroke: C.good, padX: 30 });
    const okT = tick(okG, 11); tr(okT, -ok.w / 2 + 18, -2);
    ok.label.setAttribute('x', 14);
    return { g, title, sub, arr, arrT, tile, res, okG, x };
  });
  // 1. variegated
  const v0 = testLeaf(cards[0].g, { base: WHITE_LF, inner: INNER_D, seed: 3 }); tr(v0, DX[0], 312, 1.18); v0.set({ green: 1 });
  const v1 = testLeaf(cards[0].res, { layers: 'bk', base: PALE, inner: INNER_D, seed: 3, stalk: PALE_DK }); tr(v1, DX[0] + 4, 542, 0.98);
  // 2. foil
  const f0 = testLeaf(cards[1].g, { seed: 8 }); tr(f0, DX[1], 312, 1.18); f0.set({ green: 1 });
  const foilD = 'M-16,-66 L36,-66 L38,66 L-14,66 Z', crinkle = 'M-12,-50 L8,-40 L-6,-22 L20,-8 L-4,10 L18,30 L-2,48 L22,58';
  const foil0 = G(cards[1].g);
  E('path', { d: foilD, fill: linGrad('#F2F5F8', '#9AA9B5'), stroke: '#DDE5EC', 'stroke-width': 2, 'stroke-linejoin': 'round' }, foil0);
  E('path', { d: crinkle, fill: 'none', stroke: '#ffffff', 'stroke-width': 2.5, opacity: 0.7 }, foil0);
  const f1 = testLeaf(cards[1].res, { layers: 'bk', base: PALE, band: [-16, 36], seed: 8, stalk: PALE_DK }); tr(f1, DX[1] + 4, 542, 0.98);
  const foil1 = G(cards[1].res);
  E('path', { d: foilD, fill: linGrad('#F2F5F8', '#9AA9B5'), stroke: '#DDE5EC', 'stroke-width': 2 }, foil1);
  E('path', { d: crinkle, fill: 'none', stroke: '#ffffff', 'stroke-width': 2.5, opacity: 0.7 }, foil1);
  // 3. soda lime
  const FLX = DX[2] - 56, FLY = 318, FS = 0.9;
  const flG = G(cards[2].g);
  E('path', { d: `M${FLX},${FLY - 104} L${FLX},${FLY - 70}`, stroke: C.stem, 'stroke-width': 6, 'stroke-linecap': 'round' }, flG);
  const s0 = testLeaf(flG, { seed: 5 }); tr(s0, FLX + 2, FLY + 2, 0.4, 90); s0.set({ green: 1 });
  const gran = G(flG), grr = rng(12);
  for (let k = 0; k < 17; k++) { const row = Math.floor(k / 9), x = FLX - 58 + (k % 9) * 14.5 + row * 7 + (grr() - 0.5) * 4; E('circle', { cx: x, cy: FLY + 74 - row * 11 + (grr() - 0.5) * 3, r: 5.5 + grr() * 2, fill: grr() > 0.5 ? '#ECE6F0' : '#CFC2D8', stroke: '#9E92AA', 'stroke-width': 1.2 }, gran); }
  tr(flask(flG, FS, { level: 0, liquid: C.water }), FLX, FLY);
  E('rect', { x: FLX - 19, y: FLY - 96, width: 38, height: 20, rx: 4, fill: '#6B4A33', stroke: '#9A7458', 'stroke-width': 2 }, flG);
  const co2s = [[-40, 50], [36, 42], [30, 20]].map(([x, y]) => ({ g: molCO2(flG, 5.5), x: FLX + x, y: FLY + y }));
  const lbAbs = pin(cards[2].g, 'absorbs\nCO₂', 60, -44, { size: 26, fill: '#D9CFE6', line: '#B9AECB' });
  tr(lbAbs, FLX + 46, FLY + 70);
  const sT = testLeaf(cards[2].res, { layers: 'b', base: PALE, seed: 5, stalk: PALE_DK }); tr(sT, DX[2] - 70, 528, 0.5);
  const sN = testLeaf(cards[2].res, { layers: 'bk', base: PALE, seed: 9, stalk: PALE_DK }); tr(sN, DX[2] + 76, 528, 0.5);
  T(cards[2].res, DX[2] - 70, 590, 'soda lime', { size: 24, weight: 700, anchor: 'middle', fill: '#5A4A6A' });
  T(cards[2].res, DX[2] + 76, 590, 'normal air', { size: 24, weight: 700, anchor: 'middle', fill: '#2C5468' });

  /* ================= update ================= */
  return t => {
    const tt = idle(t);

    /* --- A: proof --- */
    const aA = Math.min(P(t, S.first - 0.5, 0.5, linear), 1 - P(t, at('iodine') - 0.15, 0.5, linear));
    op(A, aA);
    if (aA > 0) {
      const lp = P(t, S.first - 0.3, 0.8, easeOut);
      tr(bigLeaf, LB[0], LB[1] + (1 - lp) * 20, 0.94 + 0.06 * lp); op(bigLeaf, lp);
      const conv = P(t, mid('proof', 0.24), 0.9), merge = P(t, mid('proof', 0.38), 0.6);
      hexes.forEach(h => {
        const a = P(t, mid('proof', 0.04) + h.d, 0.4, pop);
        const x = lerp(h.x0, h.x1, conv), y = lerp(h.y0, h.y1, conv) + (1 - conv) * Math.sin(tt * 1.4 + h.d * 9) * 4;
        tr(h.g, x, y, Math.max(0.01, a * (1 - 0.6 * merge)), (1 - conv) * 40);
        op(h.g, clamp(a * 2) * (1 - merge));
      });
      grains.forEach((g, i) => { const k = P(t, mid('proof', 0.4) + i * 0.06, 0.5, pop); op(g, clamp(k * 2)); tr(g, SITES[i][0], SITES[i][1], Math.max(0.01, k)); });
      op(fr1, P(t, mid('proof', 0.08), 0.5, linear));
      fArr.set(P(t, mid('proof', 0.34), 0.5)); op(fArr, P(t, mid('proof', 0.34), 0.2, linear));
      op(fr2, P(t, mid('proof', 0.4), 0.5, linear));
      const lz = P(t, mid('proof', 0.5), 0.7, easeOut);
      op(lens, lz); tr(lens, lerp(lensAt[0] + 260, lensAt[0], lz), lerp(lensAt[1] + 140, lensAt[1], lz), 0.7 + 0.3 * lz);
      op(lensLab, P(t, mid('proof', 0.6), 0.4, linear)); tr(lensLab, lensAt[0] + 64, lensAt[1] - 64);
      const pc = P(t, mid('proof', 0.72), 0.5, easeOut); op(proofCard, pc); tr(proofCard, 0, (1 - pc) * 16);
    }

    /* --- B: the bench --- */
    const aB = Math.min(P(t, at('iodine') - 0.1, 0.5, linear), 1 - P(t, at('destarch') - 0.1, 0.5, linear));
    op(Bg, aB);
    if (aB > 0) {
      const [bx, by, X, Y, s] = track(CAM, t);
      const tx = X - s * bx, ty = Y - s * by;
      cam.setAttribute('transform', `translate(${tx.toFixed(2)} ${ty.toFixed(2)}) scale(${s.toFixed(4)})`);
      const scr = (x, y) => [tx + s * x, ty + s * y];
      // focus: the station being described is bright, the rest dim
      const F = [
        Math.max(win(t, at('boil') + 0.4, at('ethanol') + 1.0, 0.5), win(t, at('safety'), at('warm'), 0.4)),
        win(t, at('ethanol') + 0.3, at('warm') + 0.2, 0.5),
        win(t, at('warm') - 0.2, at('add') + 0.2, 0.5),
        Math.max(1 - P(t, at('boil') + 0.4, 0.5, linear), P(t, at('add') - 0.1, 0.5, linear)),
      ];
      const over = win(t, at('boil') + 0.1, mid('boil', 0.22) + 0.5, 0.4);
      const lit = i => P(t, mid('wewi', [0.58, 0.69, 0.8, 0.91][i]), 0.3, linear);
      STATIONS.forEach((st, i) => {
        const wewiA = P(t, at('wewi') + 0.2, 0.6, linear);
        let a = 0.3 + 0.7 * Math.max(F[i], over);
        a = lerp(a, 0.5 + 0.5 * lit(i), wewiA);
        (Array.isArray(st) ? st : [st]).forEach(e => op(e, a));
      });
      // station 1: the flame burns until step 2
      const flameOn = t < at('ethanol') + 0.15;
      bun.set(flameOn ? 'blue' : 'off'); bun.upd(tt);
      bub1.upd(t, flameOn ? 1 : 0);
      steam1.upd(tt); op(steam1, flameOn ? 0.8 : 0.8 * (1 - P(t, at('ethanol') + 0.15, 1.5, linear)));
      // station 2: ethanol bubbles and turns green
      const greenOut = P(t, e0 + 2.0, 3.2, ease);
      tube.set(0.72, mix(ETH0, ETH1, greenOut * 0.85));
      bub2.upd(t, win(t, e0 + 2.2, at('safety') + 3, 0.5));
      steam2.upd(tt); op(steam2, 0.7 * win(t, at('iodine'), at('warm') + 1, 0.5));
      wisps.forEach((w, i) => {
        const u = ((t - e0 - 2.2) / 1.6 + i / 4) % 1, on = win(t, e0 + 2.2, at('safety') + 1.5, 0.4);
        tr(w, SX[1] - 8 + i * 6 + Math.sin(u * 5 + i) * 4, 560 - u * 80, 0.7 + 0.6 * u); op(w, on * Math.sin(u * Math.PI) * 0.8);
      });
      warm3.upd(tt); op(warm3, 0.75 * win(t, at('warm') - 0.2, at('add') + 0.6, 0.5));
      // the leaf
      const [lx, ly, lr, lsx, lsy] = track(LEAFK, t);
      op(leafG, P(t, b0, 0.3, linear));
      leafG.setAttribute('transform', `translate(${lx.toFixed(1)} ${ly.toFixed(1)}) rotate(${lr.toFixed(1)}) scale(${(LS * lsx).toFixed(4)} ${(LS * lsy).toFixed(4)})`);
      const pale = P(t, e0 + 2.0, 3.0, ease), boiled = P(t, b0 + 1.0, 1.6, linear);
      const spread = P(t, DROPS[2][0] + 0.45, 2.0, linear);
      lf.set({ green: 1 - pale, dark: boiled, rb: lerp(0, 150, P(t, DROPS[2][0] + 0.3, 1.2, easeOut)), rk: lerp(0, 160, spread) });
      // dropper and drops
      const [px, py] = track(PIPK, t);
      tr(pip, px, py);
      drops.forEach((d, i) => {
        const fall = (k, t0, x, y) => { const u = (t - t0) / 0.32; if (u <= 0 || u >= 1) return false; tr(d, x, lerp(k, y, u * u)); return true; };
        let shown = false;
        DROPS.forEach(([t0, x, y], j) => { if (j % 3 === i && fall(j < 2 ? 520 : 506, t0, x, y - 6)) shown = true; });
        op(d, shown ? 1 : 0);
      });
      // tile spots: plain tile stays orange-brown, the starch goes blue-black
      const sA = P(t, DROPS[0][0] + 0.3, 0.3, easeOut), sB = P(t, DROPS[1][0] + 0.3, 0.3, easeOut), sBk = P(t, DROPS[1][0] + 0.5, 0.8, linear);
      op(spots, 1 - P(t, mid('boil', 0.4), 0.4, linear));          // wiped off-screen, before the tile is needed again
      op(spotA, sA); attr(spotA, 'rx', 24 * (0.5 + 0.5 * sA));
      op(spotB, sB * 0.95); spotB.setAttribute('fill', mix(IOD, BLK, sBk));
      starchPile.setAttribute('fill', mix('#FBF8F0', BLK, sBk));
      // overlays
      hdrs.forEach((h, i) => op(h, win(t, [at('iodine'), at('boil') + 0.1, at('ethanol') + 0.1, at('warm'), at('add')][i], [at('boil'), at('ethanol'), at('warm'), at('add'), at('wewi')][i], 0.35)));
      // iodine beat
      const aI = win(t, at('iodine'), at('boil') + 0.1, 0.4);
      op(sw, aI); swRows.forEach((r, i) => { const k = P(t, mid('iodine', [0.44, 0.74][i]), 0.45, easeOut); op(r, k); tr(r, (1 - k) * 20, 0); });
      const pA = scr(955, 632), pB = scr(1066, 632);
      tr(lbNo, pA[0], pA[1] + 40); tr(lbSt, pB[0], pB[1] + 40);
      op(lbNo, aI * P(t, mid('iodine', 0.14), 0.4, linear)); op(lbSt, aI * P(t, mid('iodine', 0.08), 0.4, linear));
      const pBt = scr(851, 560); tr(lbIod, pBt[0], pBt[1]); op(lbIod, aI * P(t, mid('iodine', 0.02), 0.4, linear));
      // boil beat: inside a cell
      const aIn = win(t, mid('boil', 0.42), at('ethanol') + 0.2, 0.45);
      op(inset, aIn);
      if (aIn > 0) {
        const lp2 = scr(lx + 30, ly - 20);
        attr(inLead, 'x1', lp2[0]); attr(inLead, 'y1', lp2[1]); attr(inLead, 'x2', IN[0] - INR * 0.82); attr(inLead, 'y2', IN[1] + INR * 0.42);
        const die = P(t, mid('boil', 0.5), 0.8, linear), brk = P(t, mid('boil', 0.58), 0.9, linear);
        memb.setAttribute('stroke-dasharray', brk <= 0 ? '100 0' : `${lerp(100, 9, brk).toFixed(2)} ${lerp(0, 7, brk).toFixed(2)}`);
        op(memb, 1 - 0.25 * brk);
        op(cellIn, 1 - 0.45 * die);
        op(lbMem, win(t, mid('boil', 0.46), mid('boil', 0.8), 0.3));
        iodIn.forEach((d, i) => {
          const u = P(t, mid('boil', 0.8) + i * 0.12, 1.0, easeOut), ang = Math.PI * (0.75 + i * 0.1);
          tr(d, IN[0] - 40 + Math.cos(ang) * lerp(150, 40, u), IN[1] + Math.sin(ang) * lerp(110, 30, u) + 8);
          op(d, P(t, mid('boil', 0.8) + i * 0.12, 0.2, linear));
        });
        op(lbBreak, aIn * P(t, mid('boil', 0.62), 0.4, linear)); op(lbIn, aIn * P(t, mid('boil', 0.84), 0.4, linear));
        op(capBack, aIn * P(t, mid('boil', 0.6), 0.4, linear));
      } else { op(lbBreak, 0); op(lbIn, 0); op(capBack, 0); }
      // ethanol beat
      const aE = win(t, at('ethanol') + 1.2, at('safety') + 0.1, 0.4);
      const pE = scr(SX[1] + 12, 490), pC = scr(SX[1] + 10, 520), pL = scr(SX[1] + 4, 556);
      tr(lbEth, pE[0], pE[1]); op(lbEth, aE * P(t, at('ethanol') + 1.3, 0.4, linear));
      tr(lbChl, pC[0], pC[1]); op(lbChl, aE * P(t, mid('ethanol', 0.55), 0.4, linear));
      tr(lbPale, pL[0], pL[1]); op(lbPale, aE * P(t, mid('ethanol', 0.82), 0.4, linear));
      const pBo = scr(SX[0], 300);
      op(bunOff, win(t, mid('safety', 0.38), at('warm'), 0.35));
      tr(bunOff, pBo[0] + 20, pBo[1] - 24);
      // safety beat
      const aS = win(t, at('safety') + 0.3, at('warm') + 0.1, 0.4);
      const pT = scr(SX[1] + 26, 420);
      const hp = P(t, mid('safety', 0.08), 0.5, pop);
      op(haz, aS * clamp(hp * 2)); tr(haz, pT[0] + 86, pT[1] - 70, Math.max(0.01, 0.6 + 0.4 * hp));
      op(hazTxt, aS * P(t, mid('safety', 0.14), 0.4, linear)); tr(hazTxt, pT[0] + 140, pT[1] - 60);
      const pF = scr(SX[0], 536);
      op(ghostFlame, aS * P(t, mid('safety', 0.36), 0.4, linear)); tr(ghostFlame, pF[0], pF[1], s / 1.3 * 0.75);
      const gx = P(t, mid('safety', 0.44), 0.35, easeOut); op(gfX, gx); tr(gfX, 0, -50, 0.4 + 0.6 * gx);
      const pW = scr(SX[1] - 66, 604);
      tr(lbBath, pW[0], pW[1]); op(lbBath, aS * P(t, mid('safety', 0.68), 0.4, linear));
      // warm beat
      const aW = win(t, at('warm') + 0.6, at('add'), 0.35);
      const pLf = scr(lx + 20, ly), pLs = scr(lx - 40, ly);
      tr(lbBrit, pLf[0], pLf[1]); op(lbBrit, aW * win(t, w0 + 0.5, w0 + 1.9, 0.3));
      tr(lbSoft, pLs[0], pLs[1]); op(lbSoft, aW * P(t, w0 + 2.2, 0.4, linear));
      // add beat
      const bbk = P(t, DROPS[2][0] + 1.8, 0.5, pop);
      op(lbBB, clamp(bbk * 2) * (1 - P(t, at('wewi'), 0.4, linear))); tr(lbBB, 600, 648, Math.max(0.01, 0.6 + 0.4 * bbk));
      // We End With Iodine
      const aWw = P(t, at('wewi') + 0.5, 0.5, linear);
      op(wewi, aWw);
      if (aWw > 0) {
        wWords.forEach((w, i) => { const k = P(t, mid('wewi', 0.26 + i * 0.07), 0.45, pop); op(w.el, clamp(k * 2)); scaleAt(w.el, w.x, 176, 0.7 + 0.3 * k); });
        tags.forEach((g, i) => {
          const k = P(t, at('wewi') + 0.6 + i * 0.12, 0.4, easeOut), l = lit(i);
          op(g.g, k); op(g.lit, l);
          g.c.box.setAttribute('fill', l > 0.5 ? 'rgba(255,228,92,0.2)' : C.card2);
          tr(g.g, SX[i], 268, 1 + 0.1 * Math.sin(Math.PI * P(t, mid('wewi', [0.58, 0.69, 0.8, 0.91][i]), 0.4, linear)));
        });
      }
    }

    /* --- C: destarching --- */
    const aC = Math.min(P(t, at('destarch') - 0.1, 0.5, linear), 1 - P(t, at('variegated') - 0.15, 0.5, linear));
    op(Cg, aC);
    if (aC > 0) {
      const inP = P(t, mid('destarch', 0.14), 1.4), outP = P(t, mid('proves', 0.1), 1.2);
      const px = lerp(lerp(650, 300, inP), 650, outP);
      tr(plantG, px, FLOOR);
      const shut = Math.min(P(t, mid('destarch', 0.36), 0.7), 1 - P(t, at('proves') - 0.1, 0.6));
      const xr = lerp(56, 458, shut), yt = lerp(176, 200, shut), yb = lerp(644, 620, shut);
      door.setAttribute('d', `M142,200 L${xr.toFixed(1)},${yt.toFixed(1)} L${xr.toFixed(1)},${yb.toFixed(1)} L142,620 Z`);
      attr(knob, 'cx', xr + (xr > 142 ? -26 : 16)); attr(knob, 'cy', 410); op(knob, Math.abs(xr - 142) > 34 ? 1 : 0);
      const inside = clamp((360 - px) / 60);
      op(cupDark, 0.55 * inside);
      const darkT = win(t, mid('destarch', 0.4), at('proves'), 0.4);
      op(cSun, 1 - 0.75 * darkT); cSun.upd(tt);
      const spin = P(t, mid('destarch', 0.42), end('destarch') - mid('destarch', 0.42) + 0.2, linear);
      hMin.setAttribute('transform', `rotate(${(spin * 360 * 6).toFixed(1)})`); hHour.setAttribute('transform', `rotate(${(spin * 360 * 0.5).toFixed(1)})`);
      op(clock, P(t, mid('destarch', 0.4), 0.4, linear) * (1 - P(t, mid('proves', 0.2), 0.5, linear)));
      op(clockLab, P(t, mid('destarch', 0.48), 0.4, linear) * (1 - P(t, mid('proves', 0.2), 0.5, linear)));
      // inside the leaf: old starch fades in the dark, new starch appears in the light
      const lead = [px + LEADP[0], FLOOR - 176 * PPS + LEADP[1]];
      attr(insLead, 'x1', lead[0]); attr(insLead, 'y1', lead[1]); attr(insLead, 'x2', IC[0] - IR * 0.86); attr(insLead, 'y2', IC[1] - IR * 0.5);
      op(insLead, 0.8 * (1 - 0.6 * shut));
      const fade = P(t, mid('destarch', 0.5), 2.2, linear);
      oldG.forEach((g, i) => op(g, 1 - clamp(fade * 1.6 - i * 0.09)));
      newG.forEach((g, i) => { const k = P(t, mid('proves', 0.42) + i * 0.07, 0.4, pop); op(g, clamp(k * 2)); tr(g, IC[0] + GR[i][0] + (i % 2 ? 8 : -6), IC[1] + GR[i][1] + 6, Math.max(0.01, k)); });
      op(ins, P(t, at('destarch') + 0.2, 0.5, linear)); op(insLab, P(t, at('destarch') + 0.3, 0.5, linear));
      op(usedUp, win(t, mid('destarch', 0.84), at('proves') + 0.3, 0.35)); tr(usedUp, IC[0], IC[1] + IR + 42);
      popAt(newChip, 640, 690, mid('proves', 0.56), t);
    }

    /* --- D: three tests --- */
    const aD = P(t, at('variegated') - 0.1, 0.5, linear);
    op(Dg, aD);
    if (aD > 0) {
      const T0 = [at('variegated'), at('foil'), at('sodalime')], L = ['variegated', 'foil', 'sodalime'];
      cards.forEach((c, i) => {
        const nxt = i < 2 ? T0[i + 1] : 1e6;
        const dim = 1 - 0.4 * win(t, nxt - 0.1, mid('sodalime', 0.95), 0.4);
        op(c.g, P(t, T0[i] - 0.1, 0.45, linear) * dim);
        tr(c.g, 0, (1 - P(t, T0[i] - 0.1, 0.5, easeOut)) * 16);
        op(c.title, P(t, mid(L[i], 0.03), 0.4, linear));
        op(c.sub, P(t, mid(L[i], [0.34, 0.36, 0.3][i]), 0.4, linear));
        const ta = mid(L[i], [0.54, 0.5, 0.7][i]);
        c.arr.set(P(t, ta, 0.5)); op(c.arr, P(t, ta, 0.15, linear));
        op(c.arrT, P(t, ta + 0.2, 0.4, linear));
        const rt = P(t, ta + 0.25, 0.45, easeOut);
        op(c.tile, rt); op(c.res, rt);
        const k = P(t, mid(L[i], [0.92, 0.9, 0.93][i]), 0.5, pop);
        op(c.okG, clamp(k * 2)); tr(c.okG, c.x, 656, Math.max(0.01, 0.7 + 0.3 * k));
      });
      // 1. variegated
      popAt(v0, DX[0], 312, mid('variegated', 0.14), t, 1.18);
      v1.set({ brown: P(t, mid('variegated', 0.6), 0.5, linear), black: P(t, mid('variegated', 0.66), 0.8, linear) });
      // 2. foil
      popAt(f0, DX[1], 312, mid('foil', 0.1), t, 1.18);
      const fo = P(t, mid('foil', 0.34), 0.6, easeOut);
      op(foil0, fo); tr(foil0, DX[1], 312 - (1 - fo) * 60, 1.18);
      const lift = P(t, mid('foil', 0.56), 0.6, ease);
      op(foil1, 1 - lift); tr(foil1, DX[1] + 4, 542 - lift * 40, 0.98);
      f1.set({ brown: P(t, mid('foil', 0.58), 0.4, linear), black: P(t, mid('foil', 0.64), 0.6, linear), band: P(t, mid('foil', 0.64), 0.6, linear) });
      // 3. soda lime
      const fp = P(t, mid('sodalime', 0.14), 0.5, easeOut); op(flG, fp); tr(flG, 0, (1 - fp) * 16);
      op(gran, P(t, mid('sodalime', 0.36), 0.4, linear));
      co2s.forEach((m, i) => {
        const u = P(t, mid('sodalime', 0.5) + i * 0.05, 1.3, ease);
        tr(m.g, m.x + Math.sin(tt * 1.3 + i) * 3 * (1 - u), lerp(m.y, FLY + 70, u), 1, (tt * 30 + i * 70) % 360);
        op(m.g, P(t, mid('sodalime', 0.3), 0.4, linear) * (1 - P(u, 0.8, 0.2, linear)));
      });
      op(lbAbs, P(t, mid('sodalime', 0.55), 0.4, linear));
      const sb = P(t, mid('sodalime', 0.76), 0.45, linear);
      sT.set({ brown: sb }); sN.set({ brown: sb, black: P(t, mid('sodalime', 0.8), 0.6, linear) });
    }
  };
});
