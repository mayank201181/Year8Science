/* Chapter 2, Transparent, translucent, opaque & shadows.
   Beats: a torch shines a beam at a pane: what the light does (side view) and what you see through the pane (front
   view). Clear glass lets the rays straight through and the smiley behind is sharp -> frosted glass scatters them
   and the smiley blurs -> a wooden board stops them dead and the smiley is gone -> a point source, an opaque cat
   cut-out and a screen, in gentle 3D: rays fan out, the ones that hit the cat stop, the two edge rays graze its ear
   and its base, and a cat-shaped shadow twice its size appears (showpiece) -> a zoom on the edge: sharp -> a long
   source: a black umbra inside a grey penumbra, bounded by the four edge rays -> the cat slides from halfway to a
   quarter of the way: the shadow grows from 2× to 4× -> outdoors: a high Sun (70°) gives a short shadow
   (0.36 × height), a low Sun (15°) a long one (3.7 ×).
   Geometry: 3D points (u along the light, v up, w across) are drawn with the oblique map P3, so every ray is exactly
   straight and the shadow is the cat scaled by (source-to-screen) / (source-to-cat) about the source's axis. */
scene('shadows', S => {
  const { at, end, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;
  const rset = (r, p, o) => { r.set(p); op(r, p > 0.002 ? (o === undefined ? 1 : o) : 0); };   // hidden at 0: no stray end-cap dot

  /* ---------- local helpers ---------- */
  function smileyArt(parent, r) {
    const g = G(parent);
    E('circle', { r, fill: ball('#FFE45C', '#E0A21E'), stroke: '#B57B12', 'stroke-width': 3 }, g);
    E('ellipse', { cx: -r * 0.34, cy: -r * 0.22, rx: r * 0.1, ry: r * 0.16, fill: '#3A2A08' }, g);
    E('ellipse', { cx: r * 0.34, cy: -r * 0.22, rx: r * 0.1, ry: r * 0.16, fill: '#3A2A08' }, g);
    E('path', { d: `M${-r * 0.52},${r * 0.12} Q0,${r * 0.72} ${r * 0.52},${r * 0.12}`, fill: 'none', stroke: '#3A2A08', 'stroke-width': r * 0.1, 'stroke-linecap': 'round' }, g);
    return g;
  }
  function grain(parent, x, y, w, h, n, seed, cols) {
    const rr = rng(seed);
    for (let i = 0; i < n; i++) E('circle', { cx: (x + rr() * w).toFixed(1), cy: (y + rr() * h).toFixed(1), r: (1.2 + rr() * 2.2).toFixed(1), fill: cols[i % cols.length], opacity: (0.35 + rr() * 0.5).toFixed(2) }, parent);
  }
  function woodGrain(parent, x, y, w, h, n, seed) {
    const rr = rng(seed);
    for (let i = 0; i < n; i++) {
      const vert = h > w, k = (i + 0.5) / n, a = rr() * 6 + 3;
      const d = vert ? `M${(x + k * w).toFixed(1)},${y + 6} q${a},${h * 0.25} 0,${h * 0.5} t0,${h * 0.5 - 12}` : `M${x + 6},${(y + k * h).toFixed(1)} q${w * 0.25},${a} ${w * 0.5},0 t${w * 0.5 - 12},0`;
      E('path', { d, fill: 'none', stroke: '#6B4426', 'stroke-width': 2.5, opacity: 0.7 }, parent);
    }
  }
  function torchArt(parent) {
    const g = G(parent);
    g.glow = E('ellipse', { cx: 34, cy: 0, rx: 70, ry: 120, fill: glow(C.energy) }, g);
    E('rect', { x: -112, y: -24, width: 94, height: 48, rx: 12, fill: ball('#5E6B78', '#2E3843'), stroke: '#8FA3B3', 'stroke-width': 2.5 }, g);
    E('rect', { x: -84, y: -31, width: 22, height: 9, rx: 3, fill: '#E07A3E' }, g);
    E('path', { d: 'M-20,-30 L16,-82 L16,82 L-20,30 Z', fill: ball('#6E7C89', '#36414C'), stroke: '#8FA3B3', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, g);
    E('ellipse', { cx: 16, cy: 0, rx: 9, ry: 80, fill: C.energyLt, stroke: '#FFF3B0', 'stroke-width': 2 }, g);
    return g;
  }
  const mix = (a, b, p) => { const h = s => [1, 3, 5].map(i => parseInt(s.slice(i, i + 2), 16)); const A = h(a), B = h(b); return '#' + A.map((v, i) => Math.round(lerp(v, B[i], clamp(p))).toString(16).padStart(2, '0')).join(''); };

  /* ================= A. transparent, translucent, opaque ================= */
  const A = G(root);
  const CATS = ['transparent', 'translucent', 'opaque'], CX3 = [330, 600, 870];
  const catChips = CATS.map((c, i) => {
    const g = G(A); tr(g, CX3[i], 140);
    const dim = chip(g, c, { size: 32, fill: C.card, stroke: C.line, color: C.muted });
    const on = chip(g, c, { size: 32, fill: C.card2, stroke: C.energy, color: C.energy });
    return { g, dim, on };
  });
  const subL = T(A, 312, 262, 'what the light does', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  const subR = T(A, 900, 262, 'what you see through it', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  // side view: torch -> pane
  const torch = torchArt(A); tr(torch, 150, 420);
  const RYS = [360, 390, 420, 450, 480], PX = 440, PWD = 26, PY0 = 300, PY1 = 540;
  const rIn = RYS.map(y => lightRay(A, 182, y, PX - 2, y, { width: 5, head: 15 }));
  const rThru = RYS.map(y => lightRay(A, PX + PWD + 2, y, 664, y, { width: 5, head: 15 }));
  const scat = [], sr = rng(23);
  RYS.forEach((y, k) => { for (let j = 0; j < 3; j++) { const ang = -58 + (j + sr() * 0.8) * 39, L = 62 + sr() * 50, e = ltPt(PX + PWD + 4, y, ang, L); scat.push(lightRay(A, PX + PWD + 4, y, e[0], e[1], { width: 4, head: 12, opacity: 0.75 })); } });
  const hits = RYS.map(y => E('circle', { cx: PX - 2, cy: y, r: 16, fill: glow(C.energy) }, A));
  const paneClear = G(A), paneFrost = G(A), paneWood = G(A);
  E('rect', { x: PX, y: PY0, width: PWD, height: PY1 - PY0, rx: 3, fill: LT.glassFill, stroke: LT.glassStroke, 'stroke-width': 3 }, paneClear);
  E('line', { x1: PX + 8, y1: PY0 + 14, x2: PX + 8, y2: PY0 + 110, stroke: '#FFFFFF', 'stroke-width': 3, opacity: 0.4, 'stroke-linecap': 'round' }, paneClear);
  E('rect', { x: PX, y: PY0, width: PWD, height: PY1 - PY0, rx: 3, fill: 'rgba(232,240,246,0.82)', stroke: '#F4F8FB', 'stroke-width': 3 }, paneFrost);
  grain(paneFrost, PX + 3, PY0 + 4, PWD - 6, PY1 - PY0 - 8, 28, 5, ['#FFFFFF', '#AFC2CF']);
  E('rect', { x: PX - 4, y: PY0, width: PWD + 8, height: PY1 - PY0, rx: 3, fill: '#8A5A33', stroke: '#5E3B1F', 'stroke-width': 3 }, paneWood);
  woodGrain(paneWood, PX - 4, PY0, PWD + 8, PY1 - PY0, 3, 9);
  const paneNames = ['clear glass', 'frosted glass', 'wooden board'].map(s => T(A, PX + PWD / 2, 584, s, { size: 26, weight: 600, anchor: 'middle', fill: C.ink }));
  // front view: the pane as a window, with a picture of a smiley behind it
  const RPX = 900, RPY = 420, RW = 300, RH = 250, wx = RPX - RW / 2, wy = RPY - RH / 2;
  const winG = G(A);
  E('rect', { x: wx, y: wy, width: RW, height: RH, rx: 10, fill: '#2B5F7E' }, winG);
  const smSharp = smileyArt(A, 74); tr(smSharp, RPX, RPY);
  const smBlur = G(A);
  for (let k = 0; k < 9; k++) { const a = k / 8 * TAU, d = k === 8 ? 0 : 11, s = smileyArt(smBlur, 78); tr(s, RPX + Math.cos(a) * d, RPY + Math.sin(a) * d); op(s, k === 8 ? 0.3 : 0.17); }
  const winClear = G(A), winFrost = G(A), winWood = G(A);
  E('rect', { x: wx, y: wy, width: RW, height: RH, rx: 10, fill: 'rgba(200,230,250,0.1)' }, winClear);
  E('path', { d: `M${wx + 30},${wy + 110} L${wx + 110},${wy + 30} M${wx + 52},${wy + 132} L${wx + 132},${wy + 52}`, stroke: '#FFFFFF', 'stroke-width': 5, opacity: 0.3, 'stroke-linecap': 'round' }, winClear);
  E('rect', { x: wx, y: wy, width: RW, height: RH, rx: 10, fill: 'rgba(232,240,246,0.6)' }, winFrost);
  grain(winFrost, wx + 6, wy + 6, RW - 12, RH - 12, 46, 8, ['#FFFFFF', '#C3D3DE']);
  E('rect', { x: wx, y: wy, width: RW, height: RH, rx: 10, fill: '#8A5A33' }, winWood);
  woodGrain(winWood, wx, wy, RW, RH, 6, 4);
  [[wx + 22, wy + 22], [wx + RW - 22, wy + 22], [wx + 22, wy + RH - 22], [wx + RW - 22, wy + RH - 22]].forEach(([x, y]) => E('circle', { cx: x, cy: y, r: 6, fill: '#3E2716' }, winWood));
  const winFrame = E('rect', { x: wx, y: wy, width: RW, height: RH, rx: 10, fill: 'none', stroke: '#C9D6DF', 'stroke-width': 9 }, A);
  // examples
  const EXS = [['clear glass', 'air', 'water'], ['frosted glass', 'tracing paper', 'thin curtains'], ['wood', 'metal', 'a brick wall']];
  const exChips = EXS.map(set => set.map((s, i) => { const c = chip(A, s, { size: 28, fill: C.card2, stroke: C.line }); tr(c, CX3[i], 662); return c; }));

  /* ================= B. shadows: a point source, an opaque cat cut-out, a screen ================= */
  const B = G(root);
  const X0 = 150, Y0 = 405, KX = 0.72, KY = -0.16, UB = 790, CS = 0.94;
  const P3 = (u, v, w) => [X0 + u + KX * w, Y0 - v + KY * w];
  // a sitting cat facing left, in its own design units (x across, y down; ear tips at y -66, base at y 58)
  const CAT_D = 'M-34,58 L24,58 C38,58 46,50 46,40 C56,44 66,36 66,22 C67,8 60,-2 52,-4 C47,-5 46,1 50,3 C56,7 57,20 49,25 C46,10 40,0 30,-8 C24,-14 20,-18 16,-22 C22,-32 20,-44 12,-50 L14,-64 L0,-55 L-18,-66 L-26,-48 C-34,-40 -34,-26 -24,-20 C-30,-10 -36,18 -34,40 Z';
  const TOPP = [-18 * CS, 66 * CS], BOTP = [0, -58 * CS];          // (w, v) of the cat's top (ear tip) and bottom
  const V_TOP0 = 55 * CS;                                           // the cat's top at w = 0 (between the ears)
  const catM = (u, m, dv) => `matrix(${(KX * CS * m).toFixed(4)} ${(KY * CS * m).toFixed(4)} 0 ${(CS * m).toFixed(4)} ${(X0 + u).toFixed(2)} ${(Y0 - (dv || 0)).toFixed(2)})`;
  const scrPts = [[-168, 280], [285, 280], [285, -250], [-168, -250]].map(([w, v]) => P3(UB, v, w));
  const scrD = 'M' + scrPts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' L') + 'Z';
  E('path', { d: scrD, fill: '#DCE5EB', stroke: '#9FB1BE', 'stroke-width': 4, 'stroke-linejoin': 'round' }, B);
  const lit = E('ellipse', { cx: P3(UB, 0, 50)[0], cy: P3(UB, 0, 50)[1], rx: 150, ry: 230, fill: glow('#FFFFFF'), opacity: 0.45 }, B);
  // the shadow: sharp; or a penumbra (shifted copies, grey) with an umbra (their overlap, black)
  const sharp = E('path', { d: CAT_D, fill: '#0E151B' }, B);
  const penG = G(B), NPEN = 13, pens = [];
  for (let k = 0; k < NPEN; k++) pens.push(E('path', { d: CAT_D, fill: '#7B8893' }, penG));
  const umbCP = E('clipPath', { id: 'light-shadows-umb' }, defs()), umbClip = E('path', { d: CAT_D }, umbCP);
  const umbG = G(B, { 'clip-path': 'url(#light-shadows-umb)' }), umb = E('path', { d: CAT_D, fill: '#0E151B' }, umbG);
  const scrLab = T(B, 1010, 690, 'screen', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  const shLab = G(B);
  E('line', { x1: 1044, y1: 566, x2: 956, y2: 444, stroke: '#3C4C58', 'stroke-width': 2.5 }, shLab);
  E('circle', { cx: 956, cy: 444, r: 5, fill: '#DCE5EB' }, shLab);
  T(shLab, 1056, 594, 'shadow', { size: 28, weight: 700, anchor: 'middle', fill: '#22313C' });
  // rays: the fan (behind the cat) and the edge rays
  const fanG = G(B);
  const SIG = [-0.23, -0.18, -0.09, 0, 0.09, 0.18, 0.23];
  const fan = SIG.map(() => rayPath(fanG, [[0, 0], [1, 0]], { width: 5, head: 15 }));
  const blockHits = SIG.map(() => E('circle', { r: 15, fill: glow(C.energy) }, fanG));
  const wedge = E('path', { fill: C.energy, opacity: 0 }, B);
  const cat = E('path', { d: CAT_D, fill: ball('#E3A25F', '#8A5A2E'), stroke: '#4A2E14', 'stroke-width': 3.5, 'stroke-linejoin': 'round' }, B);
  const edgeG = G(B);
  const eTT = rayPath(edgeG, [[0, 0], [1, 0]], { width: 5, head: 15, at: 0.36 }), eBB = rayPath(edgeG, [[0, 0], [1, 0]], { width: 5, head: 15, at: 0.36 });
  const eBT = rayPath(edgeG, [[0, 0], [1, 0]], { width: 4, head: 14, at: 0.36, color: '#FFF0A0' }), eTB = rayPath(edgeG, [[0, 0], [1, 0]], { width: 4, head: 14, at: 0.36, color: '#FFF0A0' });
  // the source: a point, or a long glowing strip
  const srcG = G(B);
  const srcHalo = E('circle', { cx: X0, cy: Y0, r: 46, fill: glow(C.energy) }, srcG);
  const strip = E('rect', { x: X0 - 7, y: Y0 - 7, width: 14, height: 14, rx: 7, fill: C.energyLt, stroke: '#FFF3B0', 'stroke-width': 2 }, srcG);
  const stripHalo = E('rect', { x: X0 - 40, y: Y0 - 40, width: 80, height: 80, rx: 40, fill: glow(C.energy) }, srcG);
  srcG.insertBefore(stripHalo, strip);
  const ptRing = E('circle', { cx: X0, cy: Y0, r: 24, fill: 'none', stroke: C.energy, 'stroke-width': 3 }, srcG);
  const srcLab = T(B, X0, Y0 + 82, 'point source', { size: 28, weight: 700, anchor: 'middle', fill: C.energy });
  const bigLab = T(B, X0, Y0 + 112, 'large source', { size: 28, weight: 700, anchor: 'middle', fill: C.energy });
  const opqChip = chip(B, 'opaque object', { size: 26, fill: C.card2, stroke: C.line }); tr(opqChip, 545, 256);
  const closeChip = chip(B, 'closer → bigger', { size: 30, fill: C.card2, stroke: C.energy, color: C.energy }); tr(closeChip, 470, 666);
  const magTxt = T(B, 626, 678, '2×', { size: 36, weight: 700, anchor: 'start', fill: C.energy });
  const spreadLab = T(B, 330, 560, 'a wider spread of rays blocked', { size: 26, weight: 600, anchor: 'middle', fill: C.energyLt });
  // umbra / penumbra labels
  const umLab = G(B), peLab = G(B);
  E('line', { x1: 786, y1: 578, x2: 944, y2: 430, stroke: C.muted, 'stroke-width': 2.5 }, umLab); E('circle', { cx: 944, cy: 430, r: 5, fill: C.ink }, umLab);
  T(umLab, 774, 590, 'umbra', { size: 30, weight: 700, anchor: 'end' }); T(umLab, 774, 618, 'fully dark', { size: 24, weight: 600, anchor: 'end', fill: C.muted });
  E('line', { x1: 786, y1: 662, x2: 934, y2: 552, stroke: C.muted, 'stroke-width': 2.5 }, peLab); E('circle', { cx: 934, cy: 552, r: 5, fill: '#22313C' }, peLab);
  T(peLab, 774, 672, 'penumbra', { size: 30, weight: 700, anchor: 'end' }); T(peLab, 774, 700, 'partly lit', { size: 24, weight: 600, anchor: 'end', fill: C.muted });
  // zoom bubble on the shadow's top edge
  const ZT = P3(UB, TOPP[1] * 2, TOPP[0] * 2), ZC = [470, 182], ZR = 78;
  const zoomG = G(B);
  const zDir = ltAng([ZT[0] - ZC[0], ZT[1] - ZC[1]]);
  [-1, 1].forEach(sg => { const a = ltPt(ZC[0], ZC[1], zDir + sg * 62, ZR), b = ltPt(ZT[0], ZT[1], zDir + 180 - sg * 62, 18); E('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke: C.muted, 'stroke-width': 2, 'stroke-dasharray': '5 6' }, zoomG); });
  E('circle', { cx: ZT[0], cy: ZT[1], r: 18, fill: 'none', stroke: C.muted, 'stroke-width': 2.5 }, zoomG);
  const zcp = E('clipPath', { id: 'light-shadows-zoom' }, defs()); E('circle', { cx: ZC[0], cy: ZC[1], r: ZR - 3 }, zcp);
  const zIn = G(zoomG, { 'clip-path': 'url(#light-shadows-zoom)' });
  E('circle', { cx: ZC[0], cy: ZC[1], r: ZR, fill: '#DCE5EB' }, zIn);
  const zSharp = G(zIn), zFuzzy = G(zIn);
  const ZANG = -18;                                                  // the edge inside the zoom rises to the right, shadow below
  const zEdge = d => ltPt(ZC[0], ZC[1], ZANG, d);
  { const a = zEdge(-140), b = zEdge(140), c = ltPt(b[0], b[1], ZANG + 90, 200), d = ltPt(a[0], a[1], ZANG + 90, 200);
    E('path', { d: `M${a} L${b} L${c} L${d} Z`, fill: '#0E151B' }, zSharp); }
  const zg = E('linearGradient', { id: 'light-shadows-fuzz', gradientUnits: 'userSpaceOnUse', x1: ltPt(ZC[0], ZC[1], ZANG - 90, 46)[0], y1: ltPt(ZC[0], ZC[1], ZANG - 90, 46)[1], x2: ltPt(ZC[0], ZC[1], ZANG + 90, 46)[0], y2: ltPt(ZC[0], ZC[1], ZANG + 90, 46)[1] }, defs());
  E('stop', { offset: 0, 'stop-color': '#DCE5EB' }, zg); E('stop', { offset: 0.5, 'stop-color': '#7B8893' }, zg); E('stop', { offset: 1, 'stop-color': '#0E151B' }, zg);
  E('circle', { cx: ZC[0], cy: ZC[1], r: ZR, fill: 'url(#light-shadows-fuzz)' }, zFuzzy);
  const ZRA = -8;                                                    // the rays' direction inside the zoom
  const zRays = [-34, 0].map((off, k) => { const end = ltPt(ZC[0], ZC[1], ZANG - 90, -off), st = ltPt(end[0], end[1], ZRA + 180, 130); return lightRay(zIn, st[0], st[1], end[0], end[1], { width: 5, head: 15, at: 0.45, opacity: k ? 1 : 0.7 }); });
  const zEnd = G(zIn); E('circle', { cx: ZC[0], cy: ZC[1], r: 7, fill: C.energy, stroke: '#FFFFFF', 'stroke-width': 2 }, zEnd);
  // fuzzy: the ray from the bottom of the source lands at the penumbra's outer edge (above, rising more steeply);
  // the ray from the top of the source lands at the umbra's edge (below, flatter)
  const zFz = [1, -1].map(sg => { const end = ltPt(ZC[0], ZC[1], ZANG - 90, sg * 40), st = ltPt(end[0], end[1], ZRA + 180 - sg * 6, 130); return lightRay(zFuzzy, st[0], st[1], end[0], end[1], { width: 4, head: 13, at: 0.45, color: sg > 0 ? '#FFF0A0' : C.energy }); });
  E('circle', { cx: ZC[0], cy: ZC[1], r: ZR, fill: 'none', stroke: C.ink, 'stroke-width': 4 }, zoomG);
  const zLab = T(zoomG, ZC[0] + ZR + 18, ZC[1] + 10, 'a sharp edge', { size: 28, weight: 700, anchor: 'start', fill: C.ink });
  const zLab2 = T(zoomG, ZC[0] + ZR + 18, ZC[1] + 10, 'a fuzzy edge', { size: 28, weight: 700, anchor: 'start', fill: C.ink });

  /* ================= C. outdoors: your shadow, midday and sunset ================= */
  const Cg = G(root);
  const skyG = E('linearGradient', { id: 'light-shadows-sky', x1: 0, y1: 0, x2: 0, y2: 1 }, defs());
  const sk0 = E('stop', { offset: 0, 'stop-color': '#1E4E70' }, skyG), sk1 = E('stop', { offset: 1, 'stop-color': '#5D9CC4' }, skyG);
  E('rect', { x: 0, y: 0, width: W, height: 616, fill: 'url(#light-shadows-sky)' }, Cg);
  E('rect', { x: 0, y: 612, width: W, height: 140, fill: '#2C5636' }, Cg);
  E('rect', { x: 0, y: 610, width: W, height: 8, fill: '#3E7A4B' }, Cg);
  const FEET = [860, 616], HT = 195, HEADT = [FEET[0], FEET[1] - HT];
  const shadowEl = G(Cg);
  const shBody = E('rect', { y: FEET[1] - 6, height: 16, rx: 8, fill: '#06120A', opacity: 0.88 }, shadowEl);
  const shHead = E('ellipse', { cy: FEET[1] + 2, ry: 10, fill: '#06120A', opacity: 0.88 }, shadowEl);
  const sunO = sun(Cg, 44);
  const rayLine = lightRay(Cg, 0, 0, 1, 0, { width: 5, head: 15 });     // a real ray of sunlight: solid (dashed means virtual)
  const tipDot = E('circle', { r: 7, fill: C.energy, stroke: '#FFFFFF', 'stroke-width': 2 }, Cg);
  const kid = person(Cg, { shirt: '#E07A3E', shorts: '#3B5A8C' }); kid.setAttribute('transform', `translate(${FEET[0]} ${FEET[1]}) scale(-1 1)`);
  const chMid = chip(Cg, 'midday: Sun high → **short** shadow', { size: 30, fill: C.card2, stroke: C.energy }); tr(chMid, 600, 682);
  const chSet = chip(Cg, 'sunset: Sun low → **long** shadow', { size: 30, fill: C.card2, stroke: C.heat }); tr(chSet, 600, 682);

  /* ================= update ================= */
  return t => {
    /* ---------- A: three kinds of material ---------- */
    const aA = 1 - P(t, at('shadow') - 0.15, 0.5, linear);
    op(A, aA);
    if (aA > 0) {
      const tl = at('translucent') - 0.15, to = at('opaque') - 0.15;
      const fr = P(t, tl, 0.6, linear), wd = P(t, to, 0.5, linear);
      catChips.forEach((c, i) => {
        const pIn = P(t, mid('transparent', 0.02 + i * 0.05), 0.4, pop);
        const on = i === 0 ? P(t, mid('transparent', 0.19), 0.3, linear) * (1 - fr) : i === 1 ? fr * (1 - wd) : wd;
        op(c.g, clamp(pIn * 2)); tr(c.g, CX3[i], 140, Math.max(0.01, (0.85 + 0.15 * pIn) * (1 + 0.08 * on)));
        op(c.on, on);
      });
      op(subL, P(t, mid('transparent', 0.08), 0.4, linear)); op(subR, P(t, mid('transparent', 0.5), 0.4, linear));
      op(torch, P(t, mid('transparent', 0.03), 0.4, linear)); op(torch.glow, 0.7 + 0.3 * wave(t, 1.5) * calm);
      rIn.forEach((r, k) => rset(r, P(t, mid('transparent', 0.1) + k * 0.06, 0.6, linear)));
      // the pane changes: clear glass -> frosted -> wood
      op(paneClear, P(t, mid('transparent', 0.06), 0.4, linear) * (1 - fr)); op(paneFrost, fr * (1 - wd)); op(paneWood, wd);
      paneNames.forEach((n, i) => op(n, i === 0 ? P(t, mid('transparent', 0.2), 0.4, linear) * (1 - fr) : i === 1 ? fr * (1 - wd) : wd));
      // after the pane: straight through, scattered, or nothing
      rThru.forEach((r, k) => rset(r, P(t, mid('transparent', 0.3) + k * 0.05, 0.7, linear), 1 - P(t, tl + 0.2, 0.4, linear)));
      const sc = 1 - P(t, to, 0.35, linear);
      scat.forEach((r, k) => rset(r, P(t, mid('translucent', 0.3) + (k % 5) * 0.06, 0.6, linear), 0.8 * sc));
      const hp = P(t, at('opaque') + 0.15, 0.4, linear);
      hits.forEach((h, k) => op(h, hp * (0.7 + 0.3 * wave(t, 1.1, k * 0.2))));
      // the window: clear, frosted, wood; the smiley sharp, blurred, gone
      const wIn = P(t, mid('transparent', 0.5), 0.5, linear);
      op(winG, wIn); op(winFrame, wIn);
      op(winClear, wIn * (1 - fr)); op(winFrost, fr * (1 - wd)); op(winWood, wd);
      const bl = P(t, mid('translucent', 0.44), 0.8, linear);
      op(smSharp, wIn * (1 - bl)); op(smBlur, wIn * bl * (1 - wd));
      // examples
      const exAt = [[mid('transparent', 0.78), tl], [mid('translucent', 0.75), to], [mid('opaque', 0.58), 1e6]];
      exChips.forEach((set, s) => set.forEach((c, i) => { const p = P(t, exAt[s][0] + i * 0.35, 0.45, pop); op(c, clamp(p * 2) * (1 - P(t, exAt[s][1], 0.3, linear))); tr(c, CX3[i], 662 + (1 - clamp(p)) * 18, Math.max(0.01, 0.85 + 0.15 * p)); }));
    }

    /* ---------- B: shadows ---------- */
    const aB = win(t, at('shadow') - 0.1, at('sun') - 0.05, 0.45);
    op(B, aB);
    if (aB > 0) {
      // where the cat is, and how long the source is
      const slide = P(t, mid('closer', 0.1), 2.4);
      const a = lerp(UB / 2, UB / 4, slide), m = UB / a;
      const sLen = 42 * P(t, at('extended') - 0.05, 0.7) * (1 - P(t, at('closer') - 0.1, 0.6));
      const ext = sLen / 42;
      cat.setAttribute('transform', catM(a, 1));
      // the source
      attr(strip, 'y', Y0 - 7 - sLen); attr(strip, 'height', 14 + 2 * sLen);
      attr(stripHalo, 'y', Y0 - 40 - sLen); attr(stripHalo, 'height', 80 + 2 * sLen);
      op(srcHalo, 1 - ext);
      const pr = P(t, at('point') + 0.05, 0.9, linear);
      op(ptRing, Math.sin(Math.PI * pr) * (1 - ext)); attr(ptRing, 'r', 14 + 30 * pr);
      op(srcLab, P(t, at('point') - 0.1, 0.4, linear) * (1 - ext));
      op(bigLab, ext);
      // the fan: blocked by the cat, or on to the screen
      const fanIn = (k) => P(t, mid('shadow', 0.04) + k * 0.12, 0.7, linear);
      const fanOut = 1 - 0.9 * P(t, at('extended') - 0.1, 0.4, linear) + 0.55 * P(t, at('closer') + 0.1, 0.5, linear);
      SIG.forEach((sg, k) => {
        const vC = a * sg, blocked = vC >= BOTP[1] && vC <= V_TOP0;
        const endP = blocked ? P3(a, vC, 0) : P3(UB, UB * sg, 0);
        fan[k].pts([[X0, Y0], endP]);
        rset(fan[k], fanIn(k), clamp(fanOut) * (blocked ? 0.85 : 1));
        const hb = blocked ? P(t, mid('shadow', 0.04) + k * 0.12 + 0.6, 0.3, linear) : 0;
        attr(blockHits[k], 'cx', endP[0] - 4); attr(blockHits[k], 'cy', endP[1]);
        op(blockHits[k], hb * clamp(fanOut) * (0.6 + 0.4 * win(t, mid('shadow', 0.3), mid('shadow', 0.55), 0.3)));
      });
      // the edge rays: from the top / bottom of the source, past the top / bottom of the cat, to the screen
      const ray = (sig, pt) => { const v = sig + (pt[1] - sig) * m, w = pt[0] * m; return [P3(0, sig, 0), P3(UB, v, w)]; };
      eTT.pts(ray(sLen, TOPP)); eBB.pts(ray(-sLen, BOTP)); eBT.pts(ray(-sLen, TOPP)); eTB.pts(ray(sLen, BOTP));
      const eIn = P(t, mid('shadow', 0.46), 0.9, linear);
      rset(eTT, eIn); rset(eBB, P(t, mid('shadow', 0.5), 0.9, linear));
      rset(eBT, P(t, at('extended') + 0.3, 0.7, linear) * ext, ext); rset(eTB, P(t, at('extended') + 0.45, 0.7, linear) * ext, ext);
      // the shadow on the screen
      const shIn = P(t, mid('shadow', 0.58), 0.7, linear);
      sharp.setAttribute('transform', catM(UB, m)); op(sharp, shIn * (1 - ext));
      op(penG, ext); op(umbG, ext);
      if (ext > 0) {
        const dv = sLen * (m - 1);
        pens.forEach((p, k) => p.setAttribute('transform', catM(UB, m, lerp(-dv, dv, k / (NPEN - 1)))));
        umbClip.setAttribute('transform', catM(UB, m, dv)); umb.setAttribute('transform', catM(UB, m, -dv));
      }
      op(scrLab, P(t, mid('shadow', 0.1), 0.4, linear));
      op(shLab, win(t, mid('shadow', 0.7), at('extended') - 0.1, 0.35));
      op(opqChip, win(t, mid('shadow', 0.3), at('point'), 0.35));
      // point / extended: the zoom bubble
      const zIn2 = win(t, mid('point', 0.32), at('closer') - 0.05, 0.4);
      op(zoomG, zIn2);
      if (zIn2 > 0) {
        tr(zoomG, 0, 0);
        op(zSharp, 1 - ext); op(zFuzzy, ext);
        zRays.forEach((r, k) => rset(r, P(t, mid('point', 0.4) + k * 0.12, 0.5, linear), (1 - ext) * (k ? 1 : 0.7)));
        op(zEnd, P(t, mid('point', 0.58), 0.3, linear) * (1 - ext));
        zFz.forEach((r, k) => rset(r, P(t, at('extended') + 0.4 + k * 0.15, 0.5, linear)));
        op(zLab, P(t, mid('point', 0.55), 0.4, linear) * (1 - ext)); op(zLab2, ext * P(t, at('extended') + 0.5, 0.4, linear));
      }
      op(umLab, P(t, mid('extended', 0.42), 0.4, linear) * ext);
      op(peLab, P(t, mid('extended', 0.72), 0.4, linear) * ext);
      // closer: the blocked spread widens, the shadow grows
      const wOn = P(t, at('closer') + 0.1, 0.4, linear);
      if (wOn > 0) {
        const q1 = P3(a, TOPP[1], TOPP[0]), q2 = P3(a, BOTP[1], BOTP[0]);
        wedge.setAttribute('d', `M${X0},${Y0} L${q1[0].toFixed(1)},${q1[1].toFixed(1)} L${q2[0].toFixed(1)},${q2[1].toFixed(1)} Z`);
      }
      op(wedge, wOn * (0.14 + 0.14 * Math.sin(Math.PI * P(t, mid('closer', 0.66), 0.9, linear))));
      op(spreadLab, P(t, mid('closer', 0.68), 0.4, linear));
      op(closeChip, P(t, mid('closer', 0.44), 0.4, linear));
      const mr = Math.round(m * 10) / 10;
      op(magTxt, P(t, at('closer') + 0.1, 0.4, linear)); setText(magTxt, (Math.abs(mr - Math.round(mr)) < 0.05 ? String(Math.round(mr)) : mr.toFixed(1)) + '× bigger');
    }

    /* ---------- C: outdoors ---------- */
    const aC = P(t, at('sun') - 0.05, 0.5, linear);
    op(Cg, aC);
    if (aC > 0) {
      const sink = P(t, mid('sun', 0.58), 2.4);
      const el = lerp(70, 15, sink), D = lerp(270, 226, sink);
      const sp = ltPt(HEADT[0], HEADT[1], -el, D);
      tr(sunO, sp[0], sp[1]); sunO.upd(t * calm);
      sk0.setAttribute('stop-color', mix('#1E4E70', '#2A2048', sink)); sk1.setAttribute('stop-color', mix('#5D9CC4', '#D9733D', sink));
      const L = HT / Math.tan(el * Math.PI / 180), tipX = FEET[0] - L;
      const rp = P(t, mid('sun', 0.12), 0.9, linear);
      const st = ltPt(sp[0], sp[1], 180 - el, 50);
      rayLine.pts([st, [tipX, FEET[1]]]); rset(rayLine, rp);
      attr(tipDot, 'cx', tipX); attr(tipDot, 'cy', FEET[1]); op(tipDot, P(t, mid('sun', 0.12) + 0.85, 0.3, linear));
      const shp = P(t, mid('sun', 0.12) + 0.7, 0.5, linear);
      op(shadowEl, shp);
      attr(shBody, 'x', tipX + L * 0.14); attr(shBody, 'width', Math.max(4, L * 0.86));
      attr(shHead, 'cx', tipX + L * 0.08); attr(shHead, 'rx', Math.max(5, L * 0.08));
      op(chMid, P(t, mid('sun', 0.3), 0.4, linear) * (1 - P(t, mid('sun', 0.62), 0.4, linear)));
      op(chSet, P(t, mid('sun', 0.84), 0.4, linear));
    }
  };
});
