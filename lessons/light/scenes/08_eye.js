/* Chapter 9, The human eye: a big cross-section (light lib eyeSection) looking left at a tree.
   Beats: the eye draws in -> the cornea does most of the bending -> the rays pass the pupil, a gap -> the iris,
   with a front-view inset -> a small pupil in bright light, a wide one in dim light -> walking into a dark cinema
   -> the lens -> the retina -> rays from the top and the base of the tree cross: a real, inverted image
   (showpiece) -> signals to the brain, which turns it the right way up -> focus in front of or behind the retina
   is blurry, and a glasses lens fixes it. */
scene('eye', S => {
  const { at, end, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;
  const EX = 700, EY = 400, R = 220;            // eyeball centre and radius (stage)
  const TREE = [150, 590];                      // base of the tree (stage); its top is 195 px higher
  // rays are yellow outside the colour chapters, so the base's rays are a paler yellow (as in the shadows chapter);
  // the dots that mark the tree's top and base, and where their light lands, stay yellow and cyan
  const TOPC = C.energy, BASEC = C.water, BASER = '#FFF0A0';

  /* ---------- local art ---------- */
  // a tree, base at (0,0), top at (0,-195)
  function treeArt(parent) {
    const g = G(parent);
    E('path', { d: 'M-12,2 L-9,-84 L9,-84 L12,2 Z', fill: ball('#A9713C', '#6B4423'), stroke: '#5A3A1C', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, g);
    const pts = [];
    for (let i = 0; i < 14; i++) { const a = i / 14 * TAU, k = 1 + 0.07 * Math.cos(a * 5 + 0.6); pts.push([Math.cos(a) * 74 * k, -118 + Math.sin(a) * 72 * k]); }
    E('path', { d: closedPath(pts), fill: ball(C.plant, C.plantDk), stroke: C.plantDk, 'stroke-width': 3 }, g);
    E('path', { d: 'M-38,-150 Q-20,-170 4,-168', fill: 'none', stroke: '#C9F2D3', 'stroke-width': 5, 'stroke-linecap': 'round', opacity: 0.55 }, g);
    return g;
  }
  // a brain, side view facing left, about 150 x 130, centred
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
  const unit = v => { const L = Math.hypot(v[0], v[1]) || 1; return [v[0] / L, v[1] / L]; };
  const along = (pts, u) => {
    let L = 0; const seg = [];
    for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(l); L += l; }
    let d = clamp(u) * L;
    for (let i = 0; i < seg.length; i++) { if (d <= seg[i] || i === seg.length - 1) { const f = seg[i] ? d / seg[i] : 0; return [lerp(pts[i][0], pts[i + 1][0], f), lerp(pts[i][1], pts[i + 1][1], f)]; } d -= seg[i]; }
    return pts[pts.length - 1];
  };
  // fraction of a polyline's length reached f of the way along segment k
  const fracAt = (pts, k, f) => {
    let L = 0, upto = 0;
    for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); if (i - 1 < k) upto += l; else if (i - 1 === k) upto += l * f; L += l; }
    return L ? upto / L : 0;
  };

  /* ---------- the eye (local coordinates: centre at the origin) ---------- */
  const world = G(root);
  const eyeG = G(world); tr(eyeG, EX, EY);
  const hlG = G(eyeG);                                   // part highlights, behind the eye art
  const eye = eyeSection(eyeG, R);
  const geo = eye.geo, lensX = geo.lensX, irisX = geo.irisX, Rr = geo.retinaR, [cx0, cy0, cCtl] = geo.cornea;
  const P_ = eye.parts;
  const vitreous = eye.firstChild;
  const sclPath = P_.sclera.firstChild; sclPath.setAttribute('pathLength', 1); sclPath.setAttribute('stroke-dasharray', '1 1');
  const corneaD = `M${cx0.toFixed(1)},${(-cy0).toFixed(1)} Q${cCtl},0 ${cx0.toFixed(1)},${cy0.toFixed(1)}`;
  const hlCornea = E('path', { d: corneaD, fill: 'none', stroke: C.energy, 'stroke-width': 28, 'stroke-linecap': 'round', opacity: 0.42 }, hlG);
  const hlPupil = E('ellipse', { cx: irisX, cy: 0, rx: 34, ry: 50, fill: glow(C.energy) }, hlG);
  const hlIris = [-1, 1].map(() => E('line', { x1: irisX, x2: irisX, stroke: '#FFB65C', 'stroke-width': 32, 'stroke-linecap': 'round', opacity: 0.5 }, hlG));
  const hlLens = E('ellipse', { cx: lensX, cy: 0, rx: 52, ry: 104, fill: glow(C.energy) }, hlG);
  const rA = ltPt(0, 0, -112, Rr), rB = ltPt(0, 0, 112, Rr);
  const hlRetina = E('path', { d: `M${rA[0].toFixed(1)},${rA[1].toFixed(1)} A${Rr},${Rr} 0 1 1 ${rB[0].toFixed(1)},${rB[1].toFixed(1)}`, fill: 'none', stroke: '#FF9CC4', 'stroke-width': 28, 'stroke-linecap': 'round', opacity: 0.45 }, hlG);

  /* rays: chosen by where they cross the pupil, so none passes through the iris. After the cornea each ray
     heads for Q (where the cornea alone would focus, far behind), then the lens bends it on to M. */
  const corneaX = y => { const u = (y / cy0 + 1) / 2; return cx0 + 2 * u * (1 - u) * (cCtl - cx0); };
  const retinaHit = (p, d) => { d = unit(d); const b = p[0] * d[0] + p[1] * d[1], c = p[0] * p[0] + p[1] * p[1] - Rr * Rr, k = -b + Math.sqrt(Math.max(0, b * b - c)); return [p[0] + d[0] * k, p[1] + d[1] * k]; };
  function eyeRays(sx, sy, n, shift) {
    const I = eye.image(sx, sy), ax = unit([I[0] - lensX, I[1]]);
    const M = [I[0] + ax[0] * shift * R, I[1] + ax[1] * shift * R], Q = [M[0] + ax[0] * 2.4 * R, M[1] + ax[1] * 2.4 * R];
    const half = eye.pupilHalf() * 0.78, out = [];
    for (let k = 0; k < n; k++) {
      const Pp = [irisX, n === 1 ? 0 : lerp(-half, half, k / (n - 1))], d = unit([Pp[0] - Q[0], Pp[1] - Q[1]]);
      let lo = 0, hi = 260;
      for (let it = 0; it < 24; it++) { const m = (lo + hi) / 2; if (Pp[0] + d[0] * m > corneaX(Pp[1] + d[1] * m)) lo = m; else hi = m; }
      const Cp = [Pp[0] + d[0] * hi, Pp[1] + d[1] * hi], u = (lensX - Pp[0]) / (Q[0] - Pp[0]), Lp = [lensX, lerp(Pp[1], Q[1], u)];
      out.push({ pts: [[sx, sy], Cp, Lp, retinaHit(Lp, [M[0] - Lp[0], M[1] - Lp[1]])], M, I });
    }
    return out;
  }
  const ST = [TREE[0] - EX, TREE[1] - 195 - EY], SB = [TREE[0] - EX, TREE[1] - EY];   // tree top / base, local
  const GX = 365 - EX;                                   // glasses lens plane, local x

  const rayG = G(eyeG);
  const dummy = n => Array.from({ length: n }, (_, i) => [i, 0]);     // placeholder points: every arrowhead is made now
  const topR = [0, 1, 2].map(() => rayPath(rayG, dummy(4), { color: TOPC, width: 5, heads: [0, 2] }));
  const baseR = [0, 1, 2].map(() => rayPath(rayG, dummy(4), { color: BASER, width: 5, heads: [0, 2] }));
  const fixR = [0, 1, 2].map(() => rayPath(rayG, dummy(5), { color: TOPC, width: 5, heads: [0, 3], at: 0.36 }));
  const dashR = [0, 1, 2].map(() => E('line', { stroke: TOPC, 'stroke-width': 3, 'stroke-dasharray': '7 7', opacity: 0.75 }, rayG));
  const meetDot = G(rayG); E('circle', { r: 26, fill: glow(C.energy) }, meetDot); E('circle', { r: 6, fill: C.energyLt }, meetDot);
  const blurSpot = E('ellipse', { rx: 14, ry: 30, fill: glow(C.energy) }, rayG);
  const imgTree = G(rayG); treeArt(imgTree);              // the image: a slim, upside-down tree on the retina
  const landTop = G(rayG); E('circle', { r: 30, fill: glow(C.energy) }, landTop); E('circle', { r: 7, fill: TOPC, stroke: '#FFFFFF', 'stroke-width': 2 }, landTop);
  const landBase = G(rayG); E('circle', { r: 30, fill: glow(BASER) }, landBase); E('circle', { r: 7, fill: BASEC, stroke: '#FFFFFF', 'stroke-width': 2 }, landBase);

  /* ---------- the tree, with dots marking its top and base ---------- */
  const treeG = G(world); tr(treeG, TREE[0], TREE[1]);
  treeArt(treeG);
  const dotTop = E('circle', { cx: 0, cy: -195, r: 8, fill: TOPC, stroke: '#FFFFFF', 'stroke-width': 2.5 }, treeG);
  const dotBase = E('circle', { cx: 0, cy: 0, r: 8, fill: BASEC, stroke: '#FFFFFF', 'stroke-width': 2.5 }, treeG);
  const ground = E('line', { x1: 60, y1: TREE[1] + 4, x2: 250, y2: TREE[1] + 4, stroke: C.faint, 'stroke-width': 4, 'stroke-linecap': 'round' }, world);
  const lbTop = T(world, 128, 386, 'top', { size: 26, weight: 700, fill: TOPC, anchor: 'end' });
  const lbBase = T(world, TREE[0], 636, 'base', { size: 26, weight: 700, fill: BASEC, anchor: 'middle' });

  /* ---------- part labels (stage coordinates) ---------- */
  function partLabel(x, y, tx, ty, text, sub, anchor) {
    const g = G(world);
    labelLine(g, x, y, tx, ty, text, { size: 30, weight: 700, anchor });
    const s = sub ? T(g, x, y + 33, sub, { size: 24, weight: 600, fill: C.energy, anchor: anchor || (tx < x ? 'start' : 'end') }) : null;
    return { g, s };
  }
  const Ac = geo.anchors;
  const labCornea = partLabel(400, 238, Ac.cornea[0] + EX, Ac.cornea[1] + EY, 'cornea', 'does most of the bending');
  const subCornea = T(labCornea.g, 400, 304, 'clear, curved front layer', { size: 24, weight: 600, fill: C.muted, anchor: 'end' });
  const labPupil = partLabel(420, 664, irisX - 4 + EX, EY + 22, 'pupil', 'a gap that lets light in');
  const labIris = partLabel(470, 134, Ac.iris[0] + EX, Ac.iris[1] + EY, 'iris', 'coloured ring of muscle');
  const labLens = partLabel(642, 140, Ac.lens[0] + EX, Ac.lens[1] + EY, 'lens', 'fine-tunes the focus', 'start');
  const labRetina = partLabel(948, 206, Ac.retina[0] + EX, Ac.retina[1] + EY, 'retina', 'light-sensitive layer', 'start');

  const chipInstr = chip(world, 'focuses light → forms an image', { size: 28, fill: C.card2, stroke: C.line, color: C.ink });
  tr(chipInstr, 905, 128);
  // magnified callout of the image on the retina
  const CALL = [1068, 306], CRAD = 86;
  const callG = G(world);
  const callLines = [0, 1].map(() => E('line', { stroke: C.muted, 'stroke-width': 2.5, 'stroke-dasharray': '6 6' }, callG));
  E('circle', { cx: CALL[0], cy: CALL[1], r: CRAD, fill: '#2A1622', stroke: C.cell, 'stroke-width': 3.5 }, callG);
  const callTree = G(callG); treeArt(callTree);
  E('circle', { cx: 0, cy: -195, r: 13, fill: TOPC, stroke: '#FFFFFF', 'stroke-width': 3 }, callTree);
  E('circle', { cx: 0, cy: 0, r: 13, fill: BASEC, stroke: '#FFFFFF', 'stroke-width': 3 }, callTree);
  tr(callTree, CALL[0], CALL[1] - 60, 0.62, 180);
  T(callG, CALL[0], CALL[1] + CRAD + 32, 'on the retina', { size: 24, weight: 600, anchor: 'middle', fill: '#FFC3DA' });
  const chipReal = chip(world, 'real, inverted', { size: 30, fill: C.card2, stroke: C.energy, color: C.energy });

  /* ---------- glasses ---------- */
  const glassesG = G(world);
  const gLens = convexLens(glassesG, 168, { fat: 0.5, fill: 'rgba(200,230,250,0.28)' });
  const gFrame = E('path', { d: gLens.firstChild.getAttribute('d'), fill: 'none', stroke: '#E07A3E', 'stroke-width': 8 }, glassesG);
  glassesG.insertBefore(gFrame, gLens);
  T(glassesG, 0, -104, 'glasses', { size: 26, weight: 700, anchor: 'middle', fill: '#FFB37A' });
  const statusG = G(world), STAT = [];
  [['focus in front of the retina: blurry', false], ['focus behind the retina: blurry', false], ['focus on the retina: sharp', true]].forEach(([txt, ok]) => {
    const g = G(statusG);
    const c = chip(g, txt, { size: 28, fill: C.card2, stroke: ok ? C.good : C.bad, color: C.ink });
    const ic = ok ? tick(g, 15) : cross(g, 13); tr(ic, -c.w / 2 - 34, 0);
    STAT.push(g);
  });

  /* ---------- front-view inset (iris, bright and dim light, cinema) ---------- */
  const inset = G(root);
  card(inset, 905, 104, 265, 186, { fill: '#0E2633', stroke: C.line });
  const wash = E('rect', { x: 905, y: 104, width: 265, height: 186, rx: 22, fill: '#FFE7A0' }, inset);
  T(inset, 925, 140, 'front view', { size: 24, weight: 600, fill: C.muted });
  const front = irisFront(inset, 42); tr(front, 1030, 214);
  const insetSun = sun(inset, 15); tr(insetSun, 1128, 142);
  const moon = G(inset); tr(moon, 1130, 140);
  E('circle', { r: 14, fill: '#E6ECF7' }, moon); E('circle', { cx: 7, cy: -5, r: 12, fill: '#0E2633' }, moon);
  const chipBright = chip(inset, 'bright light: small pupil', { size: 26, fill: '#4A3A12', stroke: C.energy, color: C.energyLt });
  tr(chipBright, 1037, 324);
  const chipDim = chip(inset, 'dim light: wide pupil', { size: 26, fill: '#16233A', stroke: '#8FA8FF', color: '#DCE4FF' });
  tr(chipDim, 1037, 324);
  const chipWiden = chip(inset, 'pupils widen…', { size: 26, fill: '#16233A', stroke: '#8FA8FF', color: '#DCE4FF' });
  tr(chipWiden, 1037, 324);

  /* ---------- the cinema ---------- */
  const cine = G(root);
  card(cine, 60, 110, 820, 600, { fill: '#03080C', stroke: C.line });
  const spill = E('path', { d: 'M100,640 L235,640 L470,700 L100,700 Z', fill: '#FFE9B0', opacity: 0.16 }, cine);
  E('ellipse', { cx: 165, cy: 470, rx: 150, ry: 220, fill: glow('#FFE3A0') }, cine);
  E('rect', { x: 100, y: 300, width: 135, height: 340, rx: 6, fill: '#FFF1C9', stroke: '#FFD98A', 'stroke-width': 4 }, cine);
  const screenG = G(cine);
  E('rect', { x: 360, y: 150, width: 470, height: 150, rx: 8, fill: linGrad('#1D3442', '#121F28', true), stroke: '#2C4250', 'stroke-width': 3 }, screenG);
  T(screenG, 595, 236, 'screen', { size: 26, weight: 600, anchor: 'middle', fill: '#3E5A6B' });
  const seats = G(cine);
  [[440, 456, 850], [516, 436, 850], [592, 416, 850]].forEach(([y, x0, x1]) => {
    let d = '';
    for (let x = x0; x + 58 <= x1; x += 70) d += `M${x},${y + 54} L${x},${y + 14} Q${x},${y} ${x + 14},${y} L${x + 44},${y} Q${x + 58},${y} ${x + 58},${y + 14} L${x + 58},${y + 54} Z `;
    E('path', { d, fill: '#7A2E3C', stroke: '#B85566', 'stroke-width': 2.5 }, seats);
  });
  const walker = person(cine, { shirt: '#5B8DEF' });
  const pitch = T(cine, 630, 400, 'pitch black!', { size: 34, weight: 700, anchor: 'middle', fill: C.muted });

  /* ---------- brain and thought bubble ---------- */
  const brainG = G(root);
  const nerveExt = G(brainG);
  const NX = [[1036, 462], [1090, 462], [1110, 436], [1105, 374]];      // optic nerve, on from the eye to the brain
  const nxD = `M${NX[0]} C${NX[1]} ${NX[2]} ${NX[3]}`;
  E('path', { d: nxD, fill: 'none', stroke: '#B8902F', 'stroke-width': 30, 'stroke-linecap': 'round' }, nerveExt);
  E('path', { d: nxD, fill: 'none', stroke: '#E9C46A', 'stroke-width': 24, 'stroke-linecap': 'round' }, nerveExt);
  const brainArtG = G(brainG); brainArt(brainArtG);
  const brainGlow = E('ellipse', { cx: 0, cy: -8, rx: 120, ry: 92, fill: glow(C.energy) }, brainArtG); brainArtG.insertBefore(brainGlow, brainArtG.firstChild);
  const BRAIN = [1098, 312];
  tr(brainArtG, BRAIN[0], BRAIN[1], 0.8);
  const lbBrain = T(brainG, 1026, 322, 'brain', { size: 28, weight: 700, anchor: 'end', fill: '#FFC3DA' });
  const BUB = [1030, 152];
  const bub = G(brainG);
  E('ellipse', { cx: BUB[0], cy: BUB[1], rx: 108, ry: 70, fill: C.card2, stroke: '#7FA6BA', 'stroke-width': 3 }, bub);
  E('circle', { cx: 1062, cy: 232, r: 10, fill: C.card2, stroke: '#7FA6BA', 'stroke-width': 3 }, bub);
  E('circle', { cx: 1076, cy: 251, r: 6, fill: C.card2, stroke: '#7FA6BA', 'stroke-width': 2.5 }, bub);
  const bubTree = G(bub), bubCopies = [];
  for (let k = 0; k < 9; k++) { const c = G(bubTree); tr(treeArt(c), 0, 97); bubCopies.push(c); }
  const sigDots = [];
  for (let k = 0; k < 6; k++) { const g = G(brainG); E('circle', { r: 16, fill: glow(C.energy) }, g); E('circle', { r: 6.5, fill: '#FFFFFF', stroke: '#FF9A3C', 'stroke-width': 2.5 }, g); sigDots.push(g); }
  // signal route: along the retina from the image to where the nerve leaves, along the nerve, up to the brain
  const route = [];
  for (let a = -18; a <= 12; a += 3) route.push(ltPt(EX, EY, a, Rr - 2));
  route.push([EX + 260, EY + 50], [EX + 336, EY + 62]);
  for (let k = 1; k <= 8; k++) { const u = k / 8, v = 1 - u, b = [v * v * v, 3 * v * v * u, 3 * v * u * u, u * u * u]; route.push([0, 1].map(j => b.reduce((s, w, i) => s + w * NX[i][j], 0))); }
  route.push([BRAIN[0], BRAIN[1] + 10]);

  /* ---------- update ---------- */
  return t => {
    /* pupil size: demo in `iris`, small then wide in `bright`, small then slowly widening in `cinema` */
    let pup = 0.6;
    pup = lerp(pup, 0.18, P(t, mid('iris', 0.62), 0.8));
    pup = lerp(pup, 0.6, P(t, mid('iris', 0.84), 0.8));
    pup = lerp(pup, 0.0, P(t, mid('bright', 0.1), 0.9));
    pup = lerp(pup, 1.0, P(t, mid('bright', 0.58), 1.1));
    pup = lerp(pup, 0.04, P(t, at('cinema') - 0.35, 0.5));
    pup = lerp(pup, 1.0, P(t, mid('cinema', 0.25), end('cinema') + 0.2 - mid('cinema', 0.25)));
    pup = lerp(pup, 0.78, P(t, at('lens') - 0.2, 0.7));
    eye.pupil(pup); front.pupil(pup);
    const half = eye.pupilHalf();

    /* the diagram fades out for the cinema and back for the lens */
    const cineA = win(t, at('cinema') - 0.2, at('lens') + 0.05, 0.45);
    op(world, P(t, S.first - 0.35, 0.45, linear) * (1 - cineA));
    op(cine, cineA);

    /* eye draws in, tree appears */
    sclPath.setAttribute('stroke-dashoffset', (1 - P(t, S.first - 0.25, 1.5, easeOut)).toFixed(4));
    op(vitreous, P(t, S.first + 0.2, 0.8, linear));
    [['cornea', 0.35], ['iris', 0.6], ['lens', 0.75], ['retina', 0.9], ['nerve', 1.1], ['blind', 1.1], ['ciliary', 1.0], ['ligaments', 1.0]].forEach(([k, d]) => op(P_[k], P(t, S.first + d, 0.5, linear)));
    const tp = P(t, S.first + 0.7, 0.6, pop);
    tr(treeG, TREE[0], TREE[1] + (1 - clamp(tp)) * 30, 1); op(treeG, clamp(tp * 2)); op(ground, clamp(tp * 2));
    op(chipInstr, P(t, mid('instrument', 0.45), 0.5, linear) * (1 - P(t, at('cornea') - 0.1, 0.4, linear)));

    /* highlights */
    const pulse = 0.82 + 0.18 * wave(t, 1.3) * calm;
    op(hlCornea, (win(t, mid('cornea', 0.18), end('cornea') + 0.2, 0.4) + win(t, at('inverted'), mid('inverted', 0.3), 0.3)) * 0.42 * pulse);
    attr(hlPupil, 'ry', half + 12);
    op(hlPupil, win(t, mid('pupil', 0.3), end('pupil') + 0.2, 0.4) * pulse);
    const top = cy0 * 0.98;
    hlIris.forEach((l, k) => { const sg = k ? 1 : -1; attr(l, 'y1', sg * top); attr(l, 'y2', sg * half); op(l, win(t, mid('iris', 0.08), end('bright') + 0.4, 0.4) * 0.5 * pulse); });
    op(hlLens, (win(t, mid('lens', 0.05), end('lens') + 0.2, 0.4) + win(t, mid('inverted', 0.02), mid('inverted', 0.32), 0.3)) * pulse);
    op(hlRetina, win(t, mid('retina', 0.12), end('retina') + 0.2, 0.4) * 0.45 * pulse);

    /* labels: bright in their own line, dimmed after, gone for the showpiece */
    const gone = 1 - P(t, at('inverted') - 0.3, 0.5, linear);
    const lab = (o, t0, tEnd, subFrom) => {
      op(o.g, P(t, t0, 0.45, linear) * (1 - 0.45 * P(t, tEnd, 0.5, linear)) * gone);
      if (o.s) op(o.s, win(t, subFrom, tEnd + 0.25, 0.35));
    };
    lab(labCornea, mid('cornea', 0.24), end('cornea'), mid('cornea', 0.7));
    op(subCornea, win(t, mid('cornea', 0.38), end('cornea') + 0.25, 0.35));
    lab(labPupil, mid('pupil', 0.32), end('pupil'), mid('pupil', 0.66));
    lab(labIris, mid('iris', 0.12), end('bright'), mid('iris', 0.3));
    lab(labLens, mid('lens', 0.1), end('lens'), mid('lens', 0.42));
    lab(labRetina, mid('retina', 0.22), end('retina'), mid('retina', 0.45));

    /* rays from the top of the tree travel one part further each line: cornea, pupil, lens, retina */
    const inGl = P(t, at('glasses') - 0.1, 0.2, linear);
    const tops = eyeRays(ST[0], ST[1], 3, 0);
    const b1 = P(t, mid('cornea', 0.04), 1.3, easeOut), b2 = P(t, mid('pupil', 0.06), 1.1), b3 = P(t, mid('lens', 0.2), 0.9), b4 = P(t, mid('retina', 0.02), 0.9);
    const rayOn = (0.4 + 0.6 * clamp(pup / 0.6)) * (1 - inGl);       // a smaller pupil lets in less light
    tops.forEach((r, k) => {
      const F1 = fracAt(r.pts, 1, 0.3), F2 = fracAt(r.pts, 2, 0), F3 = fracAt(r.pts, 2, 0.55);
      topR[k].pts(r.pts); topR[k].set(b1 * F1 + b2 * (F2 - F1) + b3 * (F3 - F2) + b4 * (1 - F3));
      op(topR[k], b1 > 0 ? rayOn : 0);
    });
    const I0 = tops[0].I;

    /* the showpiece: rays from the base land high, so the image on the retina is upside down */
    const bases = eyeRays(SB[0], SB[1], 3, 0), bp = P(t, mid('inverted', 0.1), 1.7, ease);
    bases.forEach((r, k) => { baseR[k].pts(r.pts); baseR[k].set(bp); op(baseR[k], bp > 0 ? 1 - inGl : 0); });
    const IB = bases[0].I;
    tr(landBase, IB[0], IB[1], 0.8 + 0.25 * wave(t, 1.1, 0.5) * calm); op(landBase, P(t, mid('inverted', 0.1) + 1.6, 0.3, linear) * (1 - inGl));
    op(dotTop, P(t, at('inverted') - 0.2, 0.4, linear)); op(dotBase, P(t, at('inverted') - 0.2, 0.4, linear));
    op(lbTop, win(t, at('inverted'), at('brain'), 0.4)); op(lbBase, win(t, at('inverted'), at('brain'), 0.4));
    const ip = P(t, mid('inverted', 0.56), 0.7, pop);
    { // a slim tree from the base's image (high) to the top's image (low), just inside the retina
      const v = [I0[0] - IB[0], I0[1] - IB[1]], L = Math.hypot(v[0], v[1]), rot = Math.atan2(v[1], v[0]) * 180 / Math.PI + 90, s = (L / 195) * Math.max(0.01, clamp(ip));
      const n = unit([-v[1], v[0]]), side = n[0] * (IB[0] + I0[0]) + n[1] * (IB[1] + I0[1]) > 0 ? -7 : 7;
      tr(imgTree, IB[0] + n[0] * side, IB[1] + n[1] * side, `${(s * 0.34).toFixed(4)} ${s.toFixed(4)}`, rot);
    }
    op(imgTree, clamp(ip * 2) * (1 - inGl));
    const callOut = 1 - P(t, end('inverted') + 0.3, 0.4, linear);
    const cp = P(t, mid('inverted', 0.6), 0.6, pop);
    op(callG, clamp(cp * 2) * callOut);
    [[IB, -1], [I0, 1]].forEach(([q, sg], k) => { attr(callLines[k], 'x1', q[0] + EX); attr(callLines[k], 'y1', q[1] + EY); attr(callLines[k], 'x2', CALL[0] - CRAD * 0.5); attr(callLines[k], 'y2', CALL[1] + sg * CRAD * 0.87); });
    tr(callTree, CALL[0], CALL[1] - 60 + (1 - clamp(cp)) * 20, 0.62, 180);
    const cr = P(t, mid('inverted', 0.72), 0.5, pop);
    op(chipReal, clamp(cr * 2) * callOut);
    tr(chipReal, CALL[0], 180, (0.85 + 0.15 * clamp(cr)) * (1 + 0.08 * Math.sin(Math.PI * P(t, mid('inverted', 0.93), 0.5, linear))));

    /* brain: a signal runs from the retina along the optic nerve; the brain turns the image the right way up */
    const bIn = P(t, at('brain'), 0.5, linear);
    op(brainG, bIn);
    op(nerveExt, 1 - P(t, at('glasses'), 0.5, linear));
    const sig = win(t, mid('brain', 0.02), mid('brain', 0.62), 0.3);
    sigDots.forEach((d, k) => { const u = ((t - mid('brain', 0.02)) / 1.5 + k / 6) % 1, q = along(route, u); tr(d, q[0], q[1]); op(d, sig * Math.min(1, u * 8, (1 - u) * 8)); });
    const bg = win(t, mid('brain', 0.4), mid('brain', 0.75), 0.3);
    op(brainGlow, bg * 0.9); tr(brainArtG, BRAIN[0], BRAIN[1], 0.8 * (1 + 0.05 * bg * wave(t, 0.8) * calm));
    op(lbBrain, P(t, mid('brain', 0.45), 0.4, linear));
    const bubIn = Math.max(0.01, P(t, mid('brain', 0.5), 0.5, pop));
    op(bub, clamp(bubIn * 2)); tr(bub, BUB[0] * (1 - bubIn), BUB[1] * (1 - bubIn), bubIn);
    const flip = P(t, mid('brain', 0.7), 0.9, ease);
    tr(bubTree, BUB[0], BUB[1] + 2, 0.5, 180 * (1 - flip));

    /* glasses: focus in front of the retina, then behind it (blurry); a glasses lens bends the light to fix it */
    const shiftAt = P(t, mid('glasses', 0.07), 0.8) * -0.55 + P(t, mid('glasses', 0.36), 0.9) * 1.15 - P(t, mid('glasses', 0.74), 0.9) * 0.6;
    const blur = clamp(Math.abs(shiftAt) / 0.55) * (1 - P(t, mid('glasses', 0.8), 0.6, linear));
    bubCopies.forEach((c, k) => {
      if (k === 0) { tr(c, 0, 0); op(c, 1 - 0.75 * blur); return; }
      const a = k / 8 * TAU; tr(c, Math.cos(a) * 16 * blur, Math.sin(a) * 16 * blur); op(c, 0.22 * blur);
    });
    const gIn = P(t, mid('glasses', 0.62), 0.8, easeOut);
    tr(glassesG, GX + EX, lerp(-140, EY, gIn)); op(glassesG, clamp(gIn * 3));
    const kink = lerp(1, 1.45, P(t, mid('glasses', 0.74), 0.9));
    const fixes = eyeRays(ST[0], ST[1], 3, shiftAt);
    const yLine = r => lerp(r.pts[0][1], r.pts[1][1], (GX - r.pts[0][0]) / (r.pts[1][0] - r.pts[0][0]));
    const ym = yLine(fixes[1]);
    fixes.forEach((r, k) => {
      fixR[k].pts([r.pts[0], [GX, ym + (yLine(r) - ym) * kink], r.pts[1], r.pts[2], r.pts[3]]); fixR[k].set(1); op(fixR[k], inGl);
      attr(dashR[k], 'x1', r.pts[3][0]); attr(dashR[k], 'y1', r.pts[3][1]); attr(dashR[k], 'x2', r.M[0]); attr(dashR[k], 'y2', r.M[1]);
      op(dashR[k], inGl * clamp((shiftAt - 0.05) / 0.25) * 0.8);
    });
    const M = fixes[0].M, Ic = fixes[1].pts[3], spread = Math.hypot(fixes[0].pts[3][0] - fixes[2].pts[3][0], fixes[0].pts[3][1] - fixes[2].pts[3][1]);
    tr(meetDot, M[0], M[1], 0.7); op(meetDot, inGl * clamp((-shiftAt - 0.08) / 0.2));
    attr(blurSpot, 'cx', Ic[0]); attr(blurSpot, 'cy', Ic[1]); attr(blurSpot, 'ry', 10 + spread * 0.7);
    op(blurSpot, inGl * clamp(spread / 18) * 0.9);
    // where the top's rays land: on the retina from `retina`; in the glasses beat only once they are sharp
    const L0 = inGl > 0 ? Ic : I0;
    tr(landTop, L0[0], L0[1], 0.8 + 0.25 * wave(t, 1.1) * calm);
    op(landTop, P(t, mid('retina', 0.2), 0.4, linear) * (1 - inGl) + inGl * P(t, mid('glasses', 0.84), 0.4, linear));
    const sA = win(t, mid('glasses', 0.1), mid('glasses', 0.38), 0.3), sB = win(t, mid('glasses', 0.38), mid('glasses', 0.72), 0.3), sC = P(t, mid('glasses', 0.86), 0.4, linear);
    [sA, sB, sC].forEach((v, k) => { op(STAT[k], v); tr(STAT[k], 724, 690 + (1 - v) * 10); });

    /* front-view inset */
    const insA = win(t, mid('iris', 0.3), at('lens') + 0.1, 0.45);
    op(inset, insA);
    if (insA > 0) {
      const sunA = win(t, mid('bright', 0.04), mid('bright', 0.55), 0.35);
      op(insetSun, sunA); insetSun.upd(t);
      op(moon, win(t, mid('bright', 0.62), at('cinema') - 0.2, 0.35));
      op(wash, sunA * 0.32 + win(t, at('cinema') - 0.3, at('cinema') + 0.3, 0.25) * 0.3);
      op(chipBright, win(t, mid('bright', 0.22), mid('bright', 0.58), 0.3));
      op(chipDim, win(t, mid('bright', 0.62), at('cinema') - 0.1, 0.3));
      op(chipWiden, P(t, mid('cinema', 0.4), 0.4, linear));
    }

    /* cinema: walk in from the bright doorway; the seats appear only as the pupils widen */
    if (cineA > 0) {
      const w = P(t, at('cinema') - 0.3, end('cinema') - at('cinema'), linear);
      walker.pose(walkPose(t, 0.9)); tr(walker, lerp(168, 350, w), 680, 1.15);
      const see = clamp((pup - 0.15) / 0.85);
      op(seats, 0.04 + 0.9 * see); op(screenG, 0.15 + 0.85 * see);
      op(pitch, win(t, at('cinema') + 0.1, mid('cinema', 0.62), 0.4) * (1 - see));
      op(spill, 1);
    }
  };
});
