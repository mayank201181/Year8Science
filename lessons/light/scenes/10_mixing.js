/* Chapter 11, Mixing coloured light: three stage spotlights over a dark screen, then a phone screen, a pixel, the
   eye's cones and a paint palette.
   Beats: red, green and blue lamps switch on -> two circles slide together and add -> red + green = yellow ->
   green + blue = cyan -> red + blue = magenta -> all three settle into the Venn and the centre turns white
   (showpiece) -> the secondary colours -> a magnifier shows a phone's yellow flower is only red and green dots ->
   one pixel's red, green and blue amounts make any colour, even white -> three kinds of cones, the brain mixes
   their signals -> paints subtract, so mixing them makes a darker, muddier colour. Overlaps are drawn with
   clipPath (no blend modes). */
scene('mixing', S => {
  const { at, end, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;
  const COL = { R: '#FF4D4D', G: '#4CD964', B: '#3B82F6', Y: '#FFF04D', C: '#4DF0FF', M: '#FF4DFF', W: '#FFFFFF' };
  const KS = ['R', 'G', 'B'], RAD = 140;
  // circle centres: in a row; red and green together; blue joins green; green steps aside, blue meets red; the Venn
  const POS = {
    row: { R: [230, 450], G: [600, 450], B: [970, 450] },
    pair: { R: [520, 410], G: [680, 410], B: [985, 480] },
    cyan: { R: [520, 410], G: [680, 410], B: [775, 545] },
    gAway: { R: [520, 410], G: [860, 360], B: [775, 545] },
    mag: { R: [520, 410], G: [860, 360], B: [560, 565] },
    venn: { R: [520, 410], G: [680, 410], B: [600, 548.6] },
  };
  const VC = [600, 456];                                       // centre of the Venn (where white appears)

  /* ---------- local helpers ---------- */
  function rich(parent, x, y, segs, o) {
    o = o || {};
    const t = E('text', { x, y, 'font-size': o.size || 28, 'font-weight': o.weight || 700, 'font-family': FD, 'text-anchor': o.anchor || 'start', fill: o.fill || C.ink }, parent);
    segs.forEach(s => { E('tspan', { fill: s[1] || o.fill || C.ink, 'font-weight': s[2] }, t).textContent = s[0]; });
    return t;
  }
  function lampArt(parent, col) {
    const g = G(parent);
    E('path', { d: 'M-31,4 L-31,-18 L31,-18 L31,4', fill: 'none', stroke: '#8FA3B3', 'stroke-width': 5, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, g);
    E('line', { x1: 0, y1: -18, x2: 0, y2: -28, stroke: '#8FA3B3', 'stroke-width': 6, 'stroke-linecap': 'round' }, g);
    const head = G(g);
    E('rect', { x: -24, y: -14, width: 48, height: 66, rx: 11, fill: ball('#4A5866', '#232C35'), stroke: '#8FA3B3', 'stroke-width': 2.5 }, head);
    E('rect', { x: -29, y: 46, width: 58, height: 14, rx: 6, fill: '#2E3A45', stroke: '#8FA3B3', 'stroke-width': 2 }, head);
    E('circle', { cx: 0, cy: 4, r: 6, fill: '#8FA3B3' }, head);
    const halo = E('circle', { cx: 0, cy: 62, r: 50, fill: glow(col) }, head);
    const face = E('ellipse', { cx: 0, cy: 61, rx: 23, ry: 7, fill: col }, head);
    g.head = head; g.halo = halo; g.face = face;
    return g;
  }
  function blob(parent, rx, ry, seed, fill, stroke) {
    return E('path', { d: closedPath(blobPts(rx, ry, 11, 0, 0.12, seed)), fill, stroke, 'stroke-width': 3 }, parent);
  }
  function brainArt(parent) {
    const g = G(parent);
    E('path', { d: 'M12,30 Q18,58 10,80', fill: 'none', stroke: '#D9799F', 'stroke-width': 16, 'stroke-linecap': 'round' }, g);
    E('ellipse', { cx: 40, cy: 40, rx: 30, ry: 18, fill: ball('#EE95BB', '#B04B7A'), stroke: '#FFD3E4', 'stroke-width': 2.5 }, g);
    const pts = [];
    for (let i = 0; i < 18; i++) { const a = i / 18 * TAU, k = 1 + 0.05 * Math.cos(a * 7); pts.push([Math.cos(a) * 76 * k, -8 + Math.sin(a) * 52 * k]); }
    E('path', { d: closedPath(pts), fill: ball('#F7A8C8', '#C25A88'), stroke: '#FFD3E4', 'stroke-width': 3 }, g);
    E('path', { d: 'M-56,-22 Q-44,-38 -28,-24 T2,-26 T30,-22 T54,-30 M-62,6 Q-46,-8 -30,6 T0,4 T28,8 T58,0 M-40,30 Q-24,18 -8,30 T24,26 M-22,-50 Q-4,-60 14,-50', fill: 'none', stroke: '#B04B7A', 'stroke-width': 4, 'stroke-linecap': 'round', opacity: 0.85 }, g);
    return g;
  }
  const along = (pts, u) => {
    let L = 0; const seg = [];
    for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(l); L += l; }
    let d = clamp(u) * L;
    for (let i = 0; i < seg.length; i++) { if (d <= seg[i] || i === seg.length - 1) { const f = seg[i] ? d / seg[i] : 0; return [lerp(pts[i][0], pts[i + 1][0], f), lerp(pts[i][1], pts[i + 1][1], f)]; } d -= seg[i]; }
    return pts[pts.length - 1];
  };
  const hex = v => Math.round(clamp(v) * 255).toString(16).padStart(2, '0');
  const rgb = (r, g, b) => '#' + hex(r) + hex(g) + hex(b);

  /* ================= A. spotlights on a dark screen ================= */
  const A = G(root);
  E('rect', { x: 70, y: 214, width: 1060, height: 500, rx: 16, fill: '#03080C', stroke: C.line, 'stroke-width': 2 }, A);
  const truss = G(A);
  E('path', { d: 'M200,106 L1000,106 M200,120 L1000,120', stroke: '#8FA3B3', 'stroke-width': 4, 'stroke-linecap': 'round' }, truss);
  let zz = 'M200,106'; for (let x = 200; x < 1000; x += 20) zz += ` L${x + 10},120 L${x + 20},106`;
  E('path', { d: zz, fill: 'none', stroke: '#62808F', 'stroke-width': 2.5 }, truss);
  const LAMPX = { R: 300, G: 600, B: 900 }, LAMPY = 146;
  const beamG = G(A), venn = G(A), lampG = G(A);
  const beams = {}, lamps = {}, halos = {}, discs = {}, clips = {};
  KS.forEach(k => {
    beams[k] = E('path', { fill: COL[k], opacity: 0.08 }, beamG);
    const cp = E('clipPath', { id: 'ltmix-' + k.toLowerCase() }, defs()); clips[k] = E('circle', { r: RAD }, cp);
    halos[k] = E('circle', { r: RAD * 1.3, fill: glow(COL[k]) }, venn);
  });
  KS.forEach(k => { discs[k] = E('circle', { r: RAD, fill: COL[k] }, venn); });
  const yel = E('circle', { r: RAD, fill: COL.Y, 'clip-path': 'url(#ltmix-r)' }, venn);     // green's disc inside red
  const cya = E('circle', { r: RAD, fill: COL.C, 'clip-path': 'url(#ltmix-g)' }, venn);     // blue's disc inside green
  const mag = E('circle', { r: RAD, fill: COL.M, 'clip-path': 'url(#ltmix-r)' }, venn);     // blue's disc inside red
  const whG = G(venn, { 'clip-path': 'url(#ltmix-g)' });
  const whi = E('circle', { r: RAD, fill: COL.W, 'clip-path': 'url(#ltmix-r)' }, whG);      // blue's disc inside red and green
  const burst = E('circle', { cx: VC[0], cy: VC[1], r: 150, fill: glow('#FFFFFF') }, venn);
  const yGlow = E('ellipse', { rx: 78, ry: 124, fill: glow(COL.Y) }, venn);                 // the new colour lights up
  const sparks = [0, 1, 2, 3, 4, 5].map(i => { const s = spark(venn, 13, { seed: i, color: '#FFFFFF' }); return { s, a: i / 6 * TAU + 0.3 }; });
  const petalLab = G(venn);
  [['yellow', 600, 360], ['cyan', 694, 516], ['magenta', 506, 516]].forEach(([s, x, y]) => T(petalLab, x, y, s, { size: 26, weight: 700, anchor: 'middle', fill: '#0A1B27' }));
  T(petalLab, VC[0], VC[1] + 9, 'white', { size: 24, weight: 700, anchor: 'middle', fill: '#5A6B78' });
  KS.forEach(k => { lamps[k] = lampArt(lampG, COL[k]); tr(lamps[k], LAMPX[k], LAMPY); });
  const plus = T(A, 600, 432, '+', { size: 84, weight: 700, anchor: 'middle', fill: C.ink });
  // headers and the list of mixes
  const hdrPrim = G(A); { const c = chip(hdrPrim, 'primary colours of light', { size: 32, fill: C.card2, stroke: C.line }); tr(c, 600, 640); T(hdrPrim, 600, 694, 'you can’t make them by mixing other lights', { size: 24, weight: 600, anchor: 'middle', fill: C.muted }); }
  const hdrAdd = chip(A, 'additive mixing: lights add', { size: 32, fill: C.card2, stroke: C.energy, color: C.energy }); tr(hdrAdd, 600, 660);
  const hdrSec = G(A); T(hdrSec, 985, 392, 'secondary', { size: 34, weight: 700, anchor: 'middle', fill: C.energy }); T(hdrSec, 985, 432, 'colours of light', { size: 28, weight: 600, anchor: 'middle' });
  const LEG = [
    [['red', COL.R], [' + ', C.muted], ['green', COL.G], [' = ', C.muted], ['yellow', COL.Y]],
    [['green', COL.G], [' + ', C.muted], ['blue', '#6FA3FF'], [' = ', C.muted], ['cyan', COL.C]],
    [['red', COL.R], [' + ', C.muted], ['blue', '#6FA3FF'], [' = ', C.muted], ['magenta', COL.M]],
    [['all three', C.ink], [' = ', C.muted], ['white', COL.W]],
  ].map((segs, i) => { const g = G(A); rich(g, 0, 0, segs, { size: 27 }); return g; });

  /* ================= B. a phone screen under a magnifier, and one pixel ================= */
  const B = G(root);
  const SCR = { x: 196, y: 206, w: 250, h: 430 }, FC = [321, 382];
  // an ellipse as a plain path (no transform), so a pixel pattern inside it stays upright
  const ellD = (cx, cy, rx, ry, deg) => {
    const a = deg * Math.PI / 180, ca = Math.cos(a), sa = Math.sin(a), pts = [];
    for (let i = 0; i < 16; i++) { const u = i / 16 * TAU, x = rx * Math.cos(u), y = ry * Math.sin(u); pts.push([cx + x * ca - y * sa, cy + x * sa + y * ca]); }
    return closedPath(pts);
  };
  function flower(parent, f) {
    const g = G(parent);
    E('rect', { x: SCR.x, y: SCR.y, width: SCR.w, height: SCR.h, rx: 10, fill: f.bg }, g);
    E('path', { d: `M${FC[0]},${FC[1] + 20} C${FC[0] - 4},${FC[1] + 90} ${FC[0] + 6},${FC[1] + 160} ${FC[0]},${FC[1] + 236}`, fill: 'none', stroke: f.stem, 'stroke-width': 12, 'stroke-linecap': 'round' }, g);
    E('path', { d: ellD(FC[0] + 38, FC[1] + 168, 40, 15, -32), fill: f.stem }, g);
    for (let k = 0; k < 6; k++) { const a = k * 60 * Math.PI / 180; E('path', { d: ellD(FC[0] + Math.sin(a) * 50, FC[1] - Math.cos(a) * 50, 27, 50, k * 60), fill: f.petal }, g); }
    E('circle', { cx: FC[0], cy: FC[1], r: 29, fill: f.centre }, g);
    return g;
  }
  // a pixel pattern: three stripes, lit by the given amounts of red, green and blue
  function pxPattern(id, r, g, b) {
    const p = E('pattern', { id, patternUnits: 'userSpaceOnUse', width: 9, height: 9 }, defs());
    E('rect', { width: 9, height: 9, fill: '#020304' }, p);
    [[0.5, COL.R, '#2A0C0C', r], [3.5, COL.G, '#0B2A12', g], [6.5, COL.B, '#0B1630', b]].forEach(([x, on, off, v]) => {
      E('rect', { x, y: 0.6, width: 2.2, height: 7.8, rx: 0.6, fill: off }, p);
      if (v > 0) E('rect', { x, y: 0.6, width: 2.2, height: 7.8, rx: 0.6, fill: on, opacity: v }, p);
    });
    return `url(#${id})`;
  }
  const PX = { yellow: pxPattern('ltmix-py', 1, 1, 0), orange: pxPattern('ltmix-po', 1, 0.5, 0), green: pxPattern('ltmix-pg', 0.12, 0.75, 0.12), bg: pxPattern('ltmix-pb', 0, 0.1, 0.38) };
  const phoneG = G(B);
  E('rect', { x: 176, y: 150, width: 290, height: 542, rx: 40, fill: '#1A242D', stroke: '#5C7080', 'stroke-width': 4 }, phoneG);
  E('rect', { x: 286, y: 170, width: 70, height: 10, rx: 5, fill: '#33424F' }, phoneG);
  flower(phoneG, { bg: '#0B1E3A', stem: '#3FA463', petal: '#FFE02E', centre: '#FF9A2E' });
  // the magnifier: inside its lens the same picture, magnified, drawn as pixels
  const LENSR = 118, ZOOM = 4.6;
  const lensCp = E('clipPath', { id: 'ltmix-lens' }, defs()); const lensClipC = E('circle', { r: LENSR }, lensCp);
  const magG = G(B, { 'clip-path': 'url(#ltmix-lens)' });
  const magInner = G(magG);
  flower(magInner, { bg: PX.bg, stem: PX.green, petal: PX.yellow, centre: PX.orange });
  const magFrame = G(B);
  E('line', { x1: LENSR * 0.72, y1: LENSR * 0.72, x2: LENSR * 0.72 + 96, y2: LENSR * 0.72 + 96, stroke: '#6B4A33', 'stroke-width': 24, 'stroke-linecap': 'round' }, magFrame);
  E('circle', { r: LENSR, fill: 'none', stroke: '#E4EDF2', 'stroke-width': 11 }, magFrame);
  E('path', { d: `M${-LENSR * 0.62},${-LENSR * 0.36} A${LENSR * 0.72},${LENSR * 0.72} 0 0 1 ${-LENSR * 0.2},${-LENSR * 0.7}`, stroke: '#FFFFFF', 'stroke-width': 6, fill: 'none', opacity: 0.45, 'stroke-linecap': 'round' }, magFrame);
  const noteNo = G(B); { const c = chip(noteNo, 'no yellow or white lights', { size: 28, fill: '#3A1820', stroke: C.bad, color: '#FFB0B8' }); tr(cross(noteNo, 11), -c.w / 2 - 26, 0); }
  const noteRGB = G(B); rich(noteRGB, 0, 0, [['just tiny '], ['red', COL.R], [', ', C.muted], ['green', COL.G], [' and ', C.muted], ['blue', '#6FA3FF'], [' dots']], { size: 30, anchor: 'middle' });
  // one pixel, close up, with sliders; and the colour you see
  const mixG = G(B);
  card(mixG, 560, 150, 590, 540, { fill: '#0E2633', stroke: C.line });
  T(mixG, 742, 196, 'one pixel, close up', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  const STR = KS.map((k, i) => {
    const x = 660 + i * 82;
    E('rect', { x, y: 222, width: 58, height: 238, rx: 8, fill: ['#2A0C0C', '#0B2A12', '#0B1630'][i], stroke: '#33424F', 'stroke-width': 2 }, mixG);
    const lit = E('rect', { x, y: 222, width: 58, height: 238, rx: 8, fill: COL[k] }, mixG);
    const lg = E('rect', { x: x - 14, y: 208, width: 86, height: 266, rx: 20, fill: glow(COL[k]) }, mixG);
    mixG.insertBefore(lg, lit);
    E('line', { x1: x + 29, y1: 500, x2: x + 29, y2: 640, stroke: '#33424F', 'stroke-width': 10, 'stroke-linecap': 'round' }, mixG);
    const fillBar = E('line', { x1: x + 29, y1: 640, x2: x + 29, y2: 640, stroke: COL[k], 'stroke-width': 10, 'stroke-linecap': 'round' }, mixG);
    const knob = E('circle', { cx: x + 29, cy: 640, r: 15, fill: '#E9F2F7', stroke: COL[k], 'stroke-width': 4 }, mixG);
    T(mixG, x + 29, 678, k, { size: 26, weight: 700, anchor: 'middle', fill: COL[k] });
    return { x, lit, lg, fillBar, knob };
  });
  const mixArrow = arrow(mixG, 920, 340, 966, 340, { color: C.muted, width: 5 });
  const swHalo = E('circle', { cx: 1056, cy: 340, r: 120, fill: glow('#FFFFFF') }, mixG);
  const swatch = E('circle', { cx: 1056, cy: 340, r: 70, fill: '#FFFF00', stroke: '#33424F', 'stroke-width': 3 }, mixG);
  T(mixG, 1056, 450, 'you see', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  const swName = T(mixG, 1056, 496, 'yellow', { size: 34, weight: 700, anchor: 'middle' });

  /* ================= C. three kinds of cone; the brain mixes their signals ================= */
  const Cg = G(root);
  const EYE = [360, 450];
  const eyeG = G(Cg); tr(eyeG, EYE[0], EYE[1]);
  const eye = eyeSection(eyeG, 140); eye.pupil(0.75);
  const flw = G(Cg); flower(flw, { bg: 'none', stem: '#3FA463', petal: '#FFE02E', centre: '#FF9A2E' }); tr(flw, 92 - FC[0] * 0.42, EYE[1] - FC[1] * 0.42 - 6, 0.42);
  const cRays = [0, 1, 2].map(() => rayPath(eyeG, [[0, 0], [1, 0], [2, 0], [3, 0]], { color: COL.Y, width: 5, heads: [0] }));
  const cRet = ltPt(0, 0, -8, eye.geo.retinaR);
  const call = G(Cg);
  const CALL = [640, 228], CRD = 104;
  E('line', { x1: EYE[0] + cRet[0], y1: EYE[1] + cRet[1] - 6, x2: CALL[0] - CRD * 0.87, y2: CALL[1] + CRD * 0.5, stroke: C.muted, 'stroke-width': 2.5, 'stroke-dasharray': '6 6' }, call);
  E('circle', { cx: CALL[0], cy: CALL[1], r: CRD, fill: '#2A1622', stroke: C.cell, 'stroke-width': 3.5 }, call);
  const cones = KS.map((k, i) => {
    const g = G(call); tr(g, CALL[0] + (i - 1) * 58, CALL[1] + 6);
    const halo = E('ellipse', { cx: 0, cy: -10, rx: 38, ry: 70, fill: glow(COL[k]) }, g);
    E('path', { d: 'M-17,46 L-17,8 Q-17,-6 -6,-14 L0,-58 L6,-14 Q17,-6 17,8 L17,46 Q0,56 -17,46 Z', fill: ['#7A2424', '#1E5A2C', '#1F3F7A'][i], stroke: COL[k], 'stroke-width': 3.5, 'stroke-linejoin': 'round' }, g);
    const lit = E('path', { d: 'M-17,46 L-17,8 Q-17,-6 -6,-14 L0,-58 L6,-14 Q17,-6 17,8 L17,46 Q0,56 -17,46 Z', fill: COL[k] }, g);
    return { g, halo, lit };
  });
  const coneLab = G(Cg); T(coneLab, CALL[0], CALL[1] + CRD + 40, 'cones: red, green, blue', { size: 28, weight: 700, anchor: 'middle', fill: '#FFC3DA' });
  const cBrainG = G(Cg);
  const cnb = ltPt(0, 0, 12, 140 - 6), nEnd = [EYE[0] + 140 + 125, EYE[1] + cnb[1] + 18];
  const CNX = [nEnd, [nEnd[0] + 120, nEnd[1]], [920, nEnd[1] + 20], [940, 498]];
  const cnD = `M${CNX[0]} C${CNX[1]} ${CNX[2]} ${CNX[3]}`;
  E('path', { d: cnD, fill: 'none', stroke: '#B8902F', 'stroke-width': 26, 'stroke-linecap': 'round' }, cBrainG);
  E('path', { d: cnD, fill: 'none', stroke: '#E9C46A', 'stroke-width': 20, 'stroke-linecap': 'round' }, cBrainG);
  const CBR = [930, 424];
  const cBrain = G(cBrainG); brainArt(cBrain); tr(cBrain, CBR[0], CBR[1], 0.95);
  const cBrainGlow = E('ellipse', { cx: 0, cy: -8, rx: 120, ry: 92, fill: glow(COL.Y) }, cBrain); cBrain.insertBefore(cBrainGlow, cBrain.firstChild);
  T(cBrainG, CBR[0], CBR[1] + 154, 'brain mixes the signals', { size: 26, weight: 700, anchor: 'middle', fill: '#FFC3DA' });
  const cBub = G(Cg);
  E('ellipse', { cx: 960, cy: 196, rx: 112, ry: 74, fill: C.card2, stroke: '#7FA6BA', 'stroke-width': 3 }, cBub);
  E('circle', { cx: 948, cy: 286, r: 10, fill: C.card2, stroke: '#7FA6BA', 'stroke-width': 3 }, cBub);
  E('circle', { cx: 940, cy: 308, r: 6, fill: C.card2, stroke: '#7FA6BA', 'stroke-width': 2.5 }, cBub);
  E('circle', { cx: 908, cy: 196, r: 40, fill: COL.Y, stroke: '#FFFFFF', 'stroke-width': 3 }, cBub);
  T(cBub, 1008, 206, 'yellow', { size: 30, weight: 700, anchor: 'middle', fill: COL.Y });
  // red and green signals (yellow light stirs the red and green cones; the blue cones stay quiet)
  const cRoute = [];
  for (let k = 0; k <= 4; k++) cRoute.push(ltPt(EYE[0], EYE[1], lerp(-8, 12, k / 4), 136));
  cRoute.push([EYE[0] + 140 + 60, EYE[1] + cnb[1] + 10]);
  for (let k = 0; k <= 8; k++) { const u = k / 8, v = 1 - u, b = [v * v * v, 3 * v * v * u, 3 * v * u * u, u * u * u]; cRoute.push([0, 1].map(j => b.reduce((s, w, i) => s + w * CNX[i][j], 0))); }
  const sigs = [];
  for (let k = 0; k < 8; k++) { const g = G(Cg); const c = k % 2 ? COL.G : COL.R; E('circle', { r: 15, fill: glow(c) }, g); E('circle', { r: 7, fill: c, stroke: '#FFFFFF', 'stroke-width': 2 }, g); sigs.push(g); }

  /* ================= D. paints subtract ================= */
  const Dg = G(root);
  const labAdd = G(Dg); rich(labAdd, 300, 640, [['lights '], ['add', C.energy], [' → brighter']], { size: 32, anchor: 'middle' });
  const pal = G(Dg); tr(pal, 880, 400);
  E('path', { d: 'M-190,10 C-200,-110 -60,-160 60,-140 C170,-122 216,-40 196,40 C180,104 120,92 90,120 C60,150 90,190 20,196 C-110,206 -184,130 -190,10 Z', fill: ball('#F0DDB0', '#C8A56A'), stroke: '#A8844C', 'stroke-width': 4 }, pal);
  E('ellipse', { cx: -110, cy: 64, rx: 26, ry: 20, fill: '#0F2C3A', stroke: '#A8844C', 'stroke-width': 3 }, pal);
  const PAINT = [['#D93B3B', '#8E1F1F', [-90, -70]], ['#2E9E4F', '#17602E', [30, -92]], ['#2F5FC4', '#173A80', [120, -10]]];
  const paints = PAINT.map(([f, s, p], i) => ({ el: blob(pal, 38, 30, 21 + i, f, s), p }));
  const mud = G(pal);
  blob(mud, 64, 48, 31, '#4E3B2C', '#2E2219');
  const swirl = E('path', { d: 'M-34,0 C-30,-26 14,-30 22,-6 C30,16 2,28 -12,14 C-22,4 -6,-10 6,-4', fill: 'none', stroke: '#7A6250', 'stroke-width': 5, 'stroke-linecap': 'round' }, mud);
  const brush = G(pal);
  E('rect', { x: -6, y: -160, width: 12, height: 120, rx: 6, fill: '#B5703C', stroke: '#7A4A24', 'stroke-width': 2 }, brush);
  E('rect', { x: -8, y: -44, width: 16, height: 22, rx: 3, fill: '#B9C6D2', stroke: '#7D8C99', 'stroke-width': 2 }, brush);
  const tipP = E('path', { d: 'M-8,-22 Q-10,-4 0,8 Q10,-4 8,-22 Z', fill: '#4E3B2C' }, brush);
  const labSub = G(Dg); rich(labSub, 880, 640, [['paints '], ['subtract', '#FF9A6B'], [' → darker']], { size: 32, anchor: 'middle' });
  const absorbG = G(Dg);
  const inArrow = arrow(absorbG, 760, 150, 846, 330, { color: '#FFFFFF', width: 7 });
  const outArrow = arrow(absorbG, 914, 330, 980, 196, { color: '#8A6E55', width: 5 });
  const absTxt = T(absorbG, 1052, 160, 'most light\nabsorbed', { size: 24, weight: 600, fill: C.muted, anchor: 'middle', lh: 30 });

  /* ---------- update ---------- */
  return t => {
    const beat = (a, b) => win(t, a, b, 0.45);
    const aA = Math.min(P(t, S.first - 0.4, 0.5, linear), 1 - P(t, at('screen') - 0.2, 0.5, linear)) + P(t, at('paint') - 0.1, 0.6, linear);
    const aB = beat(at('screen') - 0.1, at('cones') + 0.2), aC = beat(at('cones') - 0.1, at('paint') + 0.2), aD = P(t, at('paint') - 0.1, 0.6, linear);
    op(B, aB); op(Cg, aC); op(Dg, aD);
    op(A, clamp(aA));

    /* A: the spotlights */
    if (aA > 0) {
      // where each circle is: row -> pair -> cyan -> (green steps aside) -> magenta -> Venn
      const mv = [
        ['pair', P(t, mid('add', 0.08), 2.6)], ['cyan', P(t, mid('cyan', 0.02), 1.2)], ['gAway', P(t, mid('magenta', 0.0), 0.8)],
        ['mag', P(t, mid('magenta', 0.24), 1.1)], ['venn', P(t, at('white') - 0.1, 1.1)],
      ];
      const C0 = {}; KS.forEach(k => { let p = POS.row[k]; mv.forEach(([name, f]) => { p = [lerp(p[0], POS[name][k][0], f), lerp(p[1], POS[name][k][1], f)]; }); C0[k] = p; });
      // B is pushed aside first (so it never meets green while red and green come together)
      const on = { R: P(t, mid('primary', 0.24), 0.4, linear), G: P(t, mid('primary', 0.32), 0.4, linear), B: P(t, mid('primary', 0.4), 0.4, linear) };
      // in the paint beat the whole Venn shrinks to the left panel
      const pv = P(t, at('paint') - 0.1, 0.8);
      venn.setAttribute('transform', `translate(${lerp(0, 300 - VC[0] * 0.5, pv).toFixed(1)} ${lerp(0, 380 - VC[1] * 0.5, pv).toFixed(1)}) scale(${lerp(1, 0.5, pv).toFixed(4)})`);
      const fixed = 1 - pv;
      op(beamG, fixed); op(lampG, fixed); op(truss, fixed); op(A.firstChild, fixed);
      KS.forEach(k => {
        const [x, y] = C0[k], r = RAD * (0.86 + 0.14 * on[k]);
        [discs[k], clips[k]].forEach(e => { attr(e, 'cx', x); attr(e, 'cy', y); attr(e, 'r', r); });
        attr(halos[k], 'cx', x); attr(halos[k], 'cy', y); op(halos[k], on[k] * 0.5);
        op(discs[k], on[k]);
        // lamp aims at its circle; its beam spreads onto it
        const L = lamps[k], ang = Math.atan2(y - LAMPY, x - LAMPX[k]) * 180 / Math.PI;
        tr(L.head, 0, 0, 1, ang - 90); op(L.halo, on[k]); L.face.setAttribute('fill', on[k] > 0.5 ? COL[k] : '#3A4652');
        const a = (ang - 90) * Math.PI / 180, ca = Math.cos(a), sa = Math.sin(a);
        const fx = (lx, ly) => [LAMPX[k] + lx * ca - ly * sa, LAMPY + lx * sa + ly * ca];
        const f1 = fx(-22, 60), f2 = fx(22, 60), dx = Math.cos(ang * Math.PI / 180), dy = Math.sin(ang * Math.PI / 180);
        const c1 = [x + dy * r, y - dx * r], c2 = [x - dy * r, y + dx * r];
        beams[k].setAttribute('d', `M${f1[0].toFixed(1)},${f1[1].toFixed(1)} L${f2[0].toFixed(1)},${f2[1].toFixed(1)} L${c1[0].toFixed(1)},${c1[1].toFixed(1)} L${c2[0].toFixed(1)},${c2[1].toFixed(1)} Z`);
        op(beams[k], on[k] * 0.09);
      });
      const pos = (e, k) => { attr(e, 'cx', C0[k][0]); attr(e, 'cy', C0[k][1]); attr(e, 'r', RAD * (0.86 + 0.14 * on[k])); };
      pos(yel, 'G'); pos(cya, 'B'); pos(mag, 'B'); pos(whi, 'B');
      op(yel, Math.min(on.R, on.G)); op(cya, Math.min(on.G, on.B)); op(mag, Math.min(on.R, on.B)); op(whi, Math.min(on.R, on.G, on.B));
      attr(yGlow, 'cx', (C0.R[0] + C0.G[0]) / 2); attr(yGlow, 'cy', (C0.R[1] + C0.G[1]) / 2);
      op(yGlow, (win(t, mid('add', 0.55), mid('add', 0.88), 0.3) + win(t, at('yellow'), end('yellow') + 0.3, 0.3)) * 0.8 * fixed * (0.85 + 0.15 * wave(t, 0.9) * calm));
      // the white showpiece: a burst as the centre turns white
      const wb = P(t, at('white') + 0.7, 1.4, linear);
      op(burst, Math.sin(Math.PI * wb) * 0.95); attr(burst, 'r', 90 + 150 * easeOut(wb));
      sparks.forEach((o, i) => { const d = 40 + 150 * easeOut(wb); tr(o.s, VC[0] + Math.cos(o.a) * d, VC[1] + Math.sin(o.a) * d * 0.85, 0.6 + 0.6 * Math.sin(Math.PI * wb)); op(o.s, Math.sin(Math.PI * wb)); o.s.upd(t); });
      op(petalLab, win(t, mid('secondary', 0.25), at('screen') - 0.1, 0.4) * fixed);
      // the '+' floats in the gap between red and green until they meet; then the headers and the list of mixes
      const gap = C0.G[0] - C0.R[0] - 2 * RAD;
      attr(plus, 'x', (C0.R[0] + C0.G[0]) / 2); op(plus, P(t, mid('add', 0.02), 0.4, linear) * clamp((gap - 8) / 40) * (1 - P(t, at('yellow'), 0.3, linear)));
      op(hdrPrim, win(t, mid('primary', 0.06), at('add') + 0.2, 0.4));
      op(hdrPrim.lastChild, P(t, mid('primary', 0.62), 0.5, linear));
      op(hdrAdd, win(t, mid('add', 0.78), at('cyan') - 0.1, 0.4));
      op(hdrSec, win(t, mid('secondary', 0.5), at('screen') - 0.1, 0.4));
      const legAt = [mid('yellow', 0.1), mid('cyan', 0.35), mid('magenta', 0.5), mid('white', 0.5)];
      LEG.forEach((g, i) => {
        const p = P(t, legAt[i], 0.5, pop), hi = i < 3 ? 1 + 0.1 * Math.sin(Math.PI * P(t, mid('secondary', 0.3 + i * 0.12), 0.5, linear)) : 1;
        op(g, clamp(p * 2) * fixed); tr(g, 96 + (1 - clamp(p)) * -20, 300 + i * 66, hi);
      });
    }

    /* B: phone, magnifier, one pixel */
    if (aB > 0) {
      const ph = P(t, at('screen') - 0.1, 0.7, easeOut);
      tr(phoneG, 0, (1 - ph) * 30);
      const gl = P(t, mid('screen', 0.3), 1.8);
      const lc = [lerp(860, 330, gl), lerp(250, 372, gl) + Math.sin(gl * Math.PI) * -30];
      attr(lensClipC, 'cx', lc[0]); attr(lensClipC, 'cy', lc[1]);
      magInner.setAttribute('transform', `translate(${lc[0].toFixed(1)} ${lc[1].toFixed(1)}) scale(${ZOOM}) translate(${-lc[0].toFixed(1)} ${-lc[1].toFixed(1)})`);
      tr(magFrame, lc[0], lc[1]); op(magFrame, P(t, mid('screen', 0.25), 0.4, linear)); op(magG, P(t, mid('screen', 0.25), 0.4, linear));
      op(noteNo, win(t, mid('screen', 0.52), end('screen') + 0.25, 0.35)); tr(noteNo, 845, 330);
      op(noteRGB, win(t, mid('screen', 0.78), end('screen') + 0.25, 0.35)); tr(noteRGB, 812, 430);
      // one pixel: amounts of red, green and blue, and the colour they make
      const mxA = P(t, at('amounts') - 0.1, 0.5, linear);
      op(mixG, mxA);
      if (mxA > 0) {
        const keys = [[0, [1, 1, 0], 'yellow'], [0.24, [1, 0.5, 0], 'orange'], [0.5, [0.6, 0, 1], 'purple'], [0.76, [1, 1, 1], 'white']];
        let lv = keys[0][1], name = keys[0][2];
        keys.forEach(([f, v, n], i) => { if (!i) return; const p = P(t, mid('amounts', f), 0.55); lv = lv.map((q, j) => lerp(q, v[j], p)); if (p > 0.5) name = n; });
        STR.forEach((s, i) => {
          op(s.lit, lv[i]); op(s.lg, lv[i] * 0.55);
          const y = lerp(640, 500, lv[i]); attr(s.knob, 'cy', y); attr(s.fillBar, 'y1', y);
        });
        swatch.setAttribute('fill', rgb(lv[0], lv[1], lv[2]));
        swHalo.setAttribute('fill', glow(rgb(Math.max(0.3, lv[0]), Math.max(0.3, lv[1]), Math.max(0.3, lv[2]))));
        op(swHalo, 0.5 + 0.2 * wave(t, 1.2) * calm);
        setText(swName, name); swName.setAttribute('fill', name === 'purple' ? '#C08CFF' : rgb(Math.max(0.35, lv[0]), Math.max(0.35, lv[1]), Math.max(0.35, lv[2])));
        mixArrow.set(P(t, at('amounts') + 0.3, 0.5));
      }
      // the phone slides left a little to make room for the pixel
      const sl = P(t, at('amounts') - 0.1, 0.7);
      B.setAttribute('transform', `translate(${(-60 * sl).toFixed(1)} 0)`);
      mixG.setAttribute('transform', `translate(${(60 * sl).toFixed(1)} 0)`);
    }

    /* C: cones */
    if (aC > 0) {
      const src = [92 - EYE[0], 0];
      eye.rays(src[0], src[1], 3, 0).forEach((r, k) => { cRays[k].pts(r); cRays[k].set(P(t, at('cones') + 0.1, 1.2, easeOut)); });
      op(call, P(t, mid('cones', 0.3), 0.5, linear));
      tr(call, 0, (1 - P(t, mid('cones', 0.3), 0.6, easeOut)) * 14);
      op(coneLab, P(t, mid('cones', 0.52), 0.4, linear));
      const stir = P(t, mid('cones', 0.78), 0.5, linear);
      cones.forEach((c, i) => {
        const named = Math.sin(Math.PI * P(t, mid('cones', 0.6 + i * 0.06), 0.5, linear));
        const fired = i < 2 ? stir * (0.75 + 0.25 * wave(t, 0.7, i * 0.5) * calm) : 0;
        op(c.lit, Math.max(named * 0.85, fired)); op(c.halo, Math.max(named, fired) * 0.9);
        tr(c.g, CALL[0] + (i - 1) * 58, CALL[1] + 6, 1 + 0.12 * named);
      });
      op(cBrainG, P(t, mid('cones', 0.7), 0.5, linear));
      sigs.forEach((d, k) => { const u = ((t - mid('cones', 0.8)) / 1.4 + k / 8) % 1, q = along(cRoute, u); tr(d, q[0], q[1]); op(d, (t > mid('cones', 0.8) ? 1 : 0) * Math.min(1, u * 8, (1 - u) * 8)); });
      op(cBrainGlow, P(t, mid('cones', 0.86), 0.4, linear) * (0.7 + 0.3 * wave(t, 0.9) * calm));
      const bb = Math.max(0.01, P(t, mid('cones', 0.88), 0.5, pop));
      op(cBub, clamp(bb * 2)); tr(cBub, 960 * (1 - bb), 196 * (1 - bb), bb);
    }

    /* D: paints */
    if (aD > 0) {
      op(labAdd, P(t, mid('paint', 0.1), 0.4, linear));
      op(pal, P(t, mid('paint', 0.04), 0.5, linear)); tr(pal, 880, 400 + (1 - P(t, mid('paint', 0.04), 0.6, easeOut)) * 20);
      const mx = P(t, mid('paint', 0.5), 1.6);
      paints.forEach((p, i) => { tr(p.el, lerp(p.p[0], 0, mx), lerp(p.p[1], -20, mx), Math.max(0.01, 1 - 0.75 * mx)); op(p.el, 1 - P(t, mid('paint', 0.5) + 1.2, 0.4, linear)); });
      const mudIn = P(t, mid('paint', 0.5) + 0.6, 1.0, easeOut);
      tr(mud, 0, -20, Math.max(0.01, mudIn)); op(mud, mudIn);
      swirl.setAttribute('transform', `rotate(${(t * 90 * calm) % 360})`);
      const stirOn = win(t, mid('paint', 0.48), mid('paint', 0.86), 0.3), sa = t * 5 * calm;
      tr(brush, Math.cos(sa) * 26 * stirOn + 60 * (1 - stirOn), -20 + Math.sin(sa) * 14 * stirOn - 90 * (1 - stirOn), 1, 18);
      op(brush, win(t, mid('paint', 0.4), mid('paint', 0.9), 0.4));
      tipP.setAttribute('fill', mudIn > 0.3 ? '#4E3B2C' : '#8A6A4A');
      op(labSub, P(t, mid('paint', 0.82), 0.5, linear));
      inArrow.set(P(t, mid('paint', 0.3), 0.6)); op(absorbG, P(t, mid('paint', 0.28), 0.3, linear));
      outArrow.set(P(t, mid('paint', 0.42), 0.5)); op(absTxt, P(t, mid('paint', 0.46), 0.4, linear));
    }
  };
});
