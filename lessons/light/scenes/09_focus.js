/* Chapter 10, Focusing the eye: a close-up of the lens with the ciliary muscles above and below it, the
   suspensory ligaments, and the retina on the right; then the whole eye again.
   Beats: near book / far tree, the lens changes shape (accommodation) -> a ring of ciliary muscles -> the
   suspensory ligaments -> near: muscles contract, ligaments slack, lens fatter, bends more (showpiece) -> far:
   muscles relax, ligaments tight, lens thinner, bends less -> zoom out: the sclera, the white of the eye -> the
   optic nerve carries signals to the brain -> the blind spot, where a star's image vanishes. */
scene('focus', S => {
  const { at, end, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;
  const LX = 560, LY = 400, LH = 240, RV = 400;              // close-up: lens centre and height; lens to retina
  const NEAR_X = 250, U_NEAR = LX - NEAR_X;                   // the book's distance from the lens
  const P_FAR = 1 / RV, P_NEAR = (U_NEAR + RV) / (U_NEAR * RV); // lens power (1/f) that focuses far / near light on the retina
  const HS = [-104, -52, 0, 52, 104];                         // ray heights at the lens
  const EX = 700, EY = 400, R = 220;                          // the whole eye, as in the eye chapter

  /* ---------- local art ---------- */
  function treeArt(parent) {
    const g = G(parent);
    E('path', { d: 'M-12,2 L-9,-84 L9,-84 L12,2 Z', fill: ball('#A9713C', '#6B4423'), stroke: '#5A3A1C', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, g);
    const pts = [];
    for (let i = 0; i < 14; i++) { const a = i / 14 * TAU, k = 1 + 0.07 * Math.cos(a * 5 + 0.6); pts.push([Math.cos(a) * 74 * k, -118 + Math.sin(a) * 72 * k]); }
    E('path', { d: closedPath(pts), fill: ball(C.plant, C.plantDk), stroke: C.plantDk, 'stroke-width': 3 }, g);
    E('path', { d: 'M-38,-150 Q-20,-170 4,-168', fill: 'none', stroke: '#C9F2D3', 'stroke-width': 5, 'stroke-linecap': 'round', opacity: 0.55 }, g);
    return g;
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
  function bookArt(parent) {
    const g = G(parent);
    E('rect', { x: -22, y: -40, width: 50, height: 82, rx: 4, fill: '#F4EFE2', stroke: '#C9C2AE', 'stroke-width': 2 }, g);
    E('rect', { x: -30, y: -44, width: 52, height: 86, rx: 5, fill: ball('#5B95F7', '#2A5BC2'), stroke: '#9CC0FF', 'stroke-width': 2.5 }, g);
    E('rect', { x: -30, y: -44, width: 11, height: 86, rx: 4, fill: '#2A5BC2' }, g);
    E('rect', { x: -13, y: -26, width: 28, height: 10, rx: 3, fill: C.energy }, g);
    E('rect', { x: -13, y: -10, width: 20, height: 6, rx: 3, fill: '#CFE0FF', opacity: 0.8 }, g);
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
  const tagChip = (parent, text, col, fill) => chip(parent, text, { size: 28, fill, stroke: col, color: col });

  /* ================= A. the close-up ================= */
  const A = G(root);
  // the eye wall the muscles hang from, and the retina (an arc round the lens, RV away on the axis)
  const WALL = '#EEF3F6';
  E('path', { d: 'M462,130 Q560,116 664,130', fill: 'none', stroke: WALL, 'stroke-width': 11, 'stroke-linecap': 'round' }, A);
  E('path', { d: 'M462,670 Q560,684 664,670', fill: 'none', stroke: WALL, 'stroke-width': 11, 'stroke-linecap': 'round' }, A);
  const rTop = ltPt(LX, LY, -31, RV), rBot = ltPt(LX, LY, 31, RV);
  const retArc = `M${rTop[0].toFixed(1)},${rTop[1].toFixed(1)} A${RV},${RV} 0 0 1 ${rBot[0].toFixed(1)},${rBot[1].toFixed(1)}`;
  E('path', { d: retArc, fill: 'none', stroke: C.cell, 'stroke-width': 8, 'stroke-linecap': 'round' }, A);
  T(A, rTop[0] + 6, rTop[1] - 20, 'retina', { size: 26, weight: 600, fill: '#FFB3CF', anchor: 'middle' });

  // ciliary muscles (top and bottom cross-sections of one ring) with their glow
  const musG = [-1, 1].map(sg => {
    const g = G(A);
    const halo = E('ellipse', { rx: 92, ry: 64, fill: glow('#FF8FA6') }, g);
    const body = G(g);
    E('ellipse', { rx: 58, ry: 36, fill: ball('#E57A8A', '#9E3B4B'), stroke: '#F7B5BF', 'stroke-width': 2.5 }, body);
    let d = '';
    for (let i = -2; i <= 2; i++) { const x = i * 19, hh = 36 * Math.sqrt(1 - (x / 58) * (x / 58)) - 6; d += `M${x - 4},${-hh} Q${x + 5},0 ${x - 4},${hh} `; }
    E('path', { d, fill: 'none', stroke: '#9E3B4B', 'stroke-width': 2.5, 'stroke-linecap': 'round', opacity: 0.8 }, body);
    return { g, halo, body, sg };
  });
  // suspensory ligaments: five fibres from each muscle to the rim of the lens
  const fibG = G(A), fibHalo = G(fibG);
  const fibres = [];
  [-1, 1].forEach(sg => { for (let j = 0; j < 5; j++) fibres.push({ sg, j, halo: E('path', { fill: 'none', stroke: '#FFFFFF', 'stroke-width': 9, 'stroke-linecap': 'round', opacity: 0.22 }, fibHalo), el: E('path', { fill: 'none', stroke: '#F2F7FA', 'stroke-width': 2.5, 'stroke-linecap': 'round' }, fibG) }); });
  // the lens
  const lensG = G(A);
  const lensHalo = E('ellipse', { rx: 110, ry: 160, fill: glow(C.energy) }, lensG);
  const lens = convexLens(lensG, LH, { fill: 'rgba(225,242,255,0.30)', thin: 18, thick: 62 });

  // objects: a near book and a far tree
  const book = G(A); bookArt(book);
  const lbNear = T(A, 222, 486, 'near', { size: 26, weight: 700, anchor: 'middle', fill: C.muted });
  const farTree = G(A); tr(treeArt(farTree), 0, 44, 0.46);
  const lbFar = T(A, 104, 486, 'far away', { size: 26, weight: 700, anchor: 'middle', fill: C.muted });
  // rays: from the book (spreading) and from the far tree (almost parallel)
  const dummy = n => Array.from({ length: n }, (_, i) => [i, 0]);     // placeholder points: every arrowhead is made now
  const nearR = HS.map(() => rayPath(A, dummy(3), { width: 5, heads: [0, 1], at: 0.45 }));
  const farR = HS.map(() => rayPath(A, dummy(3), { width: 5, heads: [0, 1], at: 0.45 }));
  const focusDot = G(A); E('circle', { r: 28, fill: glow(C.energy) }, focusDot); E('circle', { r: 7, fill: C.energyLt }, focusDot);
  const blurPatch = E('ellipse', { rx: 16, ry: 40, fill: glow(C.energy) }, A);
  const okChip = G(A); { const c = chip(okChip, 'sharp', { size: 28, fill: '#123A2C', stroke: C.good, color: C.good }); tr(tick(okChip, 12), c.w / 2 + 26, 0); }
  const badChip = G(A); { const c = chip(badChip, 'blurry', { size: 28, fill: '#3A1820', stroke: C.bad, color: '#FF9AA6' }); tr(cross(badChip, 11), c.w / 2 + 24, 0); }

  // labels and tags
  const labCil = G(A); labelLine(labCil, 632, 168, 600, 158, 'ciliary muscles', { size: 30, weight: 700, anchor: 'start' });
  const labLig = G(A); labelLine(labLig, 632, 244, 577, 232, 'suspensory\nligaments', { size: 30, weight: 700, anchor: 'start' });
  const accG = G(A);
  const accChip = chip(accG, 'accommodation', { size: 34, fill: C.card2, stroke: C.energy, color: C.energy }); tr(accChip, 220, 632);
  T(accG, 220, 690, 'the lens changes shape', { size: 24, weight: 600, anchor: 'middle', fill: C.muted });
  const NEARC = '#FFB65C', FARC = '#7FD8F7', NEARF = '#3A2A10', FARF = '#10303D';
  const tags = {
    contract: tagChip(A, 'contract', NEARC, NEARF), slack: tagChip(A, 'slack', NEARC, NEARF), fatter: tagChip(A, 'fatter', NEARC, NEARF), more: tagChip(A, 'bends more', NEARC, NEARF),
    relax: tagChip(A, 'relax', FARC, FARF), tight: tagChip(A, 'tight', FARC, FARF), thinner: tagChip(A, 'thinner', FARC, FARF), less: tagChip(A, 'bends less', FARC, FARF),
  };
  const SLOT = { mus: [632, 158], lig: [632, 236], lens: [636, 572], ray: [790, 572] };
  const putTag = (c, slot, v) => { op(c, v); tr(c, SLOT[slot][0] + c.w / 2, SLOT[slot][1] + (1 - clamp(v)) * 10, 0.9 + 0.1 * clamp(v)); };

  // front view of the ring: lens in the middle, muscle ring round it, ligaments like spokes
  const ringG = G(A);
  card(ringG, 64, 112, 296, 168, { fill: '#0E2633', stroke: C.line });
  T(ringG, 84, 146, 'front view', { size: 24, weight: 600, fill: C.muted });
  const RC = [264, 198];
  const ringGlow = E('circle', { cx: RC[0], cy: RC[1], r: 84, fill: glow('#FF8FA6') }, ringG);
  E('circle', { cx: RC[0], cy: RC[1], r: 54, fill: 'none', stroke: '#C95A6C', 'stroke-width': 18 }, ringG);
  E('circle', { cx: RC[0], cy: RC[1], r: 54, fill: 'none', stroke: '#F7B5BF', 'stroke-width': 2, 'stroke-dasharray': '3 6', opacity: 0.8 }, ringG);
  const spokeHalo = G(ringG), spokes = G(ringG);
  for (let k = 0; k < 12; k++) {
    const a = k / 12 * TAU, p0 = [RC[0] + Math.cos(a) * 45, RC[1] + Math.sin(a) * 45], p1 = [RC[0] + Math.cos(a) * 25, RC[1] + Math.sin(a) * 25];
    E('line', { x1: p0[0], y1: p0[1], x2: p1[0], y2: p1[1], stroke: '#FFFFFF', 'stroke-width': 8, 'stroke-linecap': 'round', opacity: 0.25 }, spokeHalo);
    E('line', { x1: p0[0], y1: p0[1], x2: p1[0], y2: p1[1], stroke: '#F2F7FA', 'stroke-width': 2.5, 'stroke-linecap': 'round' }, spokes);
  }
  E('circle', { cx: RC[0], cy: RC[1], r: 24, fill: 'rgba(225,242,255,0.35)', stroke: LT.glassStroke, 'stroke-width': 3 }, ringG);
  T(ringG, 84, 222, 'ring of', { size: 24, weight: 600, fill: '#FFB3C0' });
  T(ringG, 84, 252, 'muscle', { size: 24, weight: 600, fill: '#FFB3C0' });

  /* ================= B. the whole eye ================= */
  const B = G(root);
  const eyeG = G(B); tr(eyeG, EX, EY);
  const hlG = G(eyeG);
  const eye = eyeSection(eyeG, R);
  eye.focus(0); eye.pupil(0.7);
  const geo = eye.geo, Ac = geo.anchors, Rr = geo.retinaR, lensX = geo.lensX, irisX = geo.irisX, [cx0, cy0, cCtl] = geo.cornea;
  const s0 = ltPt(0, 0, 215, R), s1 = ltPt(0, 0, 145, R);
  const sclD = `M${s0[0].toFixed(1)},${s0[1].toFixed(1)} A${R},${R} 0 1 1 ${s1[0].toFixed(1)},${s1[1].toFixed(1)}`;
  const hlSclera = G(hlG);
  E('path', { d: sclD, fill: 'none', stroke: '#DFF3FF', 'stroke-width': 46, opacity: 0.12 }, hlSclera);
  E('path', { d: sclD, fill: 'none', stroke: '#FFFFFF', 'stroke-width': 26, opacity: 0.3 }, hlSclera);
  const nb = ltPt(0, 0, 12, R - 6);
  const hlNerve = E('path', { d: `M${nb[0] - 4},${nb[1] - 17} L${R + 125},${nb[1] + 2} L${R + 125},${nb[1] + 34} L${nb[0] - 4},${nb[1] + 17} Z`, fill: 'none', stroke: C.energy, 'stroke-width': 18, 'stroke-linejoin': 'round', opacity: 0.45 }, hlG);
  const bp = Ac.blind;
  const blindRing = G(eyeG);
  E('circle', { cx: bp[0], cy: bp[1], r: 18, fill: 'none', stroke: '#0B0B0D', 'stroke-width': 7 }, blindRing);
  const blindDash = E('circle', { cx: bp[0], cy: bp[1], r: 27, fill: 'none', stroke: C.energy, 'stroke-width': 3, 'stroke-dasharray': '6 6' }, blindRing);

  // rays into the whole eye, chosen by where they cross the pupil (as in the eye chapter)
  const corneaX = y => { const u = (y / cy0 + 1) / 2; return cx0 + 2 * u * (1 - u) * (cCtl - cx0); };
  const retinaHit = (p, d) => { d = unit(d); const b = p[0] * d[0] + p[1] * d[1], c = p[0] * p[0] + p[1] * p[1] - Rr * Rr, k = -b + Math.sqrt(Math.max(0, b * b - c)); return [p[0] + d[0] * k, p[1] + d[1] * k]; };
  function eyeRays(sx, sy, n) {
    const I = eye.image(sx, sy), ax = unit([I[0] - lensX, I[1]]), Q = [I[0] + ax[0] * 2.4 * R, I[1] + ax[1] * 2.4 * R];
    const half = eye.pupilHalf() * 0.78, out = [];
    for (let k = 0; k < n; k++) {
      const Pp = [irisX, lerp(-half, half, k / (n - 1))], d = unit([Pp[0] - Q[0], Pp[1] - Q[1]]);
      let lo = 0, hi = 260;
      for (let it = 0; it < 24; it++) { const m = (lo + hi) / 2; if (Pp[0] + d[0] * m > corneaX(Pp[1] + d[1] * m)) lo = m; else hi = m; }
      const Cp = [Pp[0] + d[0] * hi, Pp[1] + d[1] * hi], u = (lensX - Pp[0]) / (Q[0] - Pp[0]), Lp = [lensX, lerp(Pp[1], Q[1], u)];
      out.push({ pts: [[sx, sy], Cp, Lp, retinaHit(Lp, [I[0] - Lp[0], I[1] - Lp[1]])], I });
    }
    return out;
  }
  const rayG = G(eyeG);
  const eyeR = [0, 1, 2].map(() => rayPath(rayG, dummy(4), { width: 5, heads: [0, 2] }));
  const land = G(rayG); E('circle', { r: 30, fill: glow(C.energy) }, land); E('circle', { r: 7, fill: C.energy, stroke: '#FFFFFF', 'stroke-width': 2 }, land);
  const noSig = G(rayG); { const c = chip(noSig, 'no signal', { size: 26, fill: '#3A1820', stroke: C.bad, color: '#FF9AA6' }); tr(cross(noSig, 10), -c.w / 2 - 22, 0); }
  // the tree, then a star whose image slides on to the blind spot
  const tree2 = G(B); tr(treeArt(tree2), 0, 0, 0.62);
  const star = G(B); const starArt = spark(star, 20);
  // labels
  const labScl = G(B); labelLine(labScl, 560, 140, 640, 192, 'sclera', { size: 30, weight: 700, anchor: 'end' });
  T(labScl, 560, 173, 'tough, white outer coat', { size: 24, weight: 600, fill: C.energy, anchor: 'end' });
  const labOpt = G(B); labelLine(labOpt, 934, 540, Ac.nerve[0] + EX - 30, Ac.nerve[1] + EY + 4, 'optic nerve', { size: 30, weight: 700, anchor: 'start' });
  T(labOpt, 934, 573, 'signals to the brain', { size: 24, weight: 600, fill: C.energy });
  const labBlind = G(B); labelLine(labBlind, 862, 640, bp[0] + EX - 14, bp[1] + EY + 16, 'blind spot', { size: 30, weight: 700, anchor: 'start' });
  T(labBlind, 862, 673, 'no light-sensitive cells', { size: 24, weight: 600, fill: C.energy });
  // front view: the white of your eye
  const inset = G(B);
  card(inset, 905, 104, 265, 186, { fill: '#0E2633', stroke: C.line });
  T(inset, 925, 140, 'front view', { size: 24, weight: 600, fill: C.muted });
  const front = irisFront(inset, 42); tr(front, 1030, 214); front.pupil(0.45);
  const whiteHalo = E('path', { d: `M${1030 - 42 * 1.9},214 Q1030,${214 - 42 * 1.55} ${1030 + 42 * 1.9},214 Q1030,${214 + 42 * 1.55} ${1030 - 42 * 1.9},214 Z`, fill: 'none', stroke: '#FFFFFF', 'stroke-width': 12, opacity: 0.35 }, inset);
  inset.insertBefore(whiteHalo, front);
  const whiteLab = G(inset); labelLine(whiteLab, 930, 334, 966, 220, 'the white of your eye', { size: 26, weight: 600, anchor: 'start', fill: C.ink });
  // brain, nerve on to it, thought bubble with the picture you see
  const brainG = G(B);
  const NX = [[1036, 462], [1090, 462], [1110, 436], [1105, 374]];
  const nxD = `M${NX[0]} C${NX[1]} ${NX[2]} ${NX[3]}`;
  const nerveExt = G(brainG);
  E('path', { d: nxD, fill: 'none', stroke: '#B8902F', 'stroke-width': 30, 'stroke-linecap': 'round' }, nerveExt);
  E('path', { d: nxD, fill: 'none', stroke: '#E9C46A', 'stroke-width': 24, 'stroke-linecap': 'round' }, nerveExt);
  const BRAIN = [1098, 312];
  const brainArtG = G(brainG); brainArt(brainArtG);
  const brainGlow = E('ellipse', { cx: 0, cy: -8, rx: 120, ry: 92, fill: glow(C.energy) }, brainArtG); brainArtG.insertBefore(brainGlow, brainArtG.firstChild);
  tr(brainArtG, BRAIN[0], BRAIN[1], 0.8);
  const lbBrain = T(brainG, 1026, 322, 'brain', { size: 28, weight: 700, anchor: 'end', fill: '#FFC3DA' });
  const BUB = [1030, 152];
  const bub = G(brainG);
  E('ellipse', { cx: BUB[0], cy: BUB[1], rx: 108, ry: 70, fill: C.card2, stroke: '#7FA6BA', 'stroke-width': 3 }, bub);
  E('circle', { cx: 1062, cy: 232, r: 10, fill: C.card2, stroke: '#7FA6BA', 'stroke-width': 3 }, bub);
  E('circle', { cx: 1076, cy: 251, r: 6, fill: C.card2, stroke: '#7FA6BA', 'stroke-width': 2.5 }, bub);
  const bubTree = G(bub); tr(treeArt(bubTree), BUB[0], BUB[1] + 48, 0.5);
  const bubStar = G(bub); const bubStarArt = spark(bubStar, 22); tr(bubStar, BUB[0], BUB[1]);
  const cantSee = T(bub, BUB[0], BUB[1] + 10, 'can’t see it!', { size: 28, weight: 700, anchor: 'middle', fill: '#FF9AA6' });
  const sigDots = [];
  for (let k = 0; k < 6; k++) { const g = G(B); E('circle', { r: 16, fill: glow(C.energy) }, g); E('circle', { r: 6.5, fill: '#FFFFFF', stroke: '#FF9A3C', 'stroke-width': 2.5 }, g); sigDots.push(g); }
  const routeFrom = a0 => {   // along the retina from angle a0 to where the nerve leaves, then along the nerve to the brain
    const pts = [];
    for (let k = 0; k <= 6; k++) pts.push(ltPt(EX, EY, lerp(a0, 12, k / 6), Rr - 2));
    pts.push([EX + 260, EY + 50], [EX + 336, EY + 62]);
    for (let k = 1; k <= 8; k++) { const u = k / 8, v = 1 - u, b = [v * v * v, 3 * v * v * u, 3 * v * u * u, u * u * u]; pts.push([0, 1].map(j => b.reduce((s, w, i) => s + w * NX[i][j], 0))); }
    pts.push([BRAIN[0], BRAIN[1] + 10]);
    return pts;
  };

  /* ---------- update ---------- */
  return t => {
    /* close-up state: object (0 book, 1 tree), muscle contraction, ligament slack, lens fatness */
    const toFar1 = P(t, mid('shape', 0.3), 0.9), toNear = P(t, at('near') - 0.1, 0.9), toFar2 = P(t, at('far') - 0.1, 0.9);
    const farObj = clamp(toFar1 - toNear + toFar2);
    const con = clamp(1 - P(t, mid('shape', 0.34), 1.1) + P(t, mid('near', 0.24), 1.3) - P(t, mid('far', 0.3), 1.3));
    const slack = clamp(1 - P(t, mid('shape', 0.36), 1.1) + P(t, mid('near', 0.4), 1.1) - P(t, mid('far', 0.47), 1.1));
    const fat = clamp(1 - P(t, mid('shape', 0.38), 1.2) + P(t, mid('near', 0.52), 2.0) - P(t, mid('far', 0.6), 2.0));
    const zoom = P(t, at('sclera') - 0.2, 1.1);

    /* A: close-up */
    const aA = P(t, S.first - 0.4, 0.5, linear) * (1 - P(t, at('sclera') - 0.1, 0.8, linear));
    op(A, aA);
    if (aA > 0) {
      const zs = lerp(1, 0.62, zoom);
      A.setAttribute('transform', `translate(${lerp(LX, lensX + EX, zoom).toFixed(1)} ${LY}) scale(${zs.toFixed(4)}) translate(${-LX} ${-LY})`);
      const ky = lerp(1, 0.93, fat), half = LH / 2 * ky, lw = lerp(18, 62, fat);
      lens.set(fat); tr(lens, 0, 0, `1 ${ky.toFixed(4)}`); tr(lensG, LX, LY);
      // muscles: still fixed to the eye wall; contracting, each one bulges in towards the lens
      const inner = lerp(188, 226, con), mcy = (129 + inner) / 2, msx = lerp(1, 0.84, con), msy = (inner - 129) / 72;
      musG.forEach(m => {
        tr(m.g, LX, m.sg < 0 ? mcy : 2 * LY - mcy); tr(m.body, 0, 0, `${msx.toFixed(4)} ${msy.toFixed(4)}`);
        op(m.halo, (win(t, mid('ciliary', 0.05), end('ciliary') + 0.3, 0.35) + win(t, mid('near', 0.22), mid('near', 0.42), 0.3) + win(t, mid('far', 0.28), mid('far', 0.46), 0.3)) * (0.8 + 0.2 * wave(t, 1.2) * calm));
      });
      // ligaments: straight when pulled tight, wavy when slack
      fibres.forEach(f => {
        const a = [LX + (f.j - 2) * 19 * msx, LY + f.sg * (LY - inner + 4)], b = [LX + (f.j - 2) * lw * 0.16, LY + f.sg * (half - 5)];
        const n = unit([-(b[1] - a[1]), b[0] - a[0]]), pts = [];
        for (let k = 0; k <= 10; k++) { const u = k / 10, w = slack * Math.sin(u * Math.PI) * (6 * Math.sin(u * TAU * 2 + f.j) + 7); pts.push([lerp(a[0], b[0], u) + n[0] * w, lerp(a[1], b[1], u) + n[1] * w]); }
        const d = openPath(pts); f.el.setAttribute('d', d); f.halo.setAttribute('d', d);
      });
      op(fibHalo, win(t, mid('ligaments', 0.05), end('ligaments') + 0.3, 0.35) + win(t, mid('near', 0.38), mid('near', 0.58), 0.3) + win(t, mid('far', 0.45), mid('far', 0.64), 0.3));
      op(lensHalo, (win(t, mid('shape', 0.5), mid('shape', 0.78), 0.35) + win(t, mid('near', 0.55), mid('near', 0.8), 0.3) + win(t, mid('far', 0.62), mid('far', 0.86), 0.3)) * 0.8);

      // objects
      const bIn = 1 - farObj;
      tr(book, lerp(222, 150, farObj), LY, 1); op(book, clamp(bIn * 1.6 - 0.3)); op(lbNear, clamp(bIn * 1.6 - 0.3));
      tr(farTree, lerp(160, 104, farObj), LY, 1); op(farTree, clamp(farObj * 1.6 - 0.3)); op(lbFar, clamp(farObj * 1.6 - 0.3));
      // rays: thin-lens bending at the lens, ending on the retina arc
      const pw = lerp(P_FAR, P_NEAR, fat);
      let edgeY = 0;
      const trace = (h, near) => {
        const x0 = near ? NEAR_X + 4 : 150, y0 = near ? LY : LY + h, sIn = near ? h / U_NEAR : 0, sOut = sIn - h * pw;
        const d = unit([1, sOut]), bb = h * d[1], k = -bb + Math.sqrt(bb * bb - (h * h - RV * RV));
        return [[x0, y0], [LX, LY + h], [LX + d[0] * k, LY + h + d[1] * k]];
      };
      HS.forEach((h, i) => {
        const pn = trace(h, true), pf = trace(h, false);
        nearR[i].pts(pn); op(nearR[i], clamp(bIn * 1.6 - 0.3));
        farR[i].pts(pf); op(farR[i], clamp(farObj * 1.6 - 0.3));
        if (i === 4) edgeY = lerp(pn[2][1], pf[2][1], farObj) - LY;
      });
      const draw = P(t, S.first + 0.1, 1.2, easeOut);
      nearR.forEach(r => r.set(draw)); farR.forEach(r => r.set(draw));
      const sharp = 1 - clamp((Math.abs(edgeY) - 6) / 26);
      const fy = LY, fx = LX + RV;
      tr(focusDot, fx, fy, 0.7 + 0.3 * sharp); op(focusDot, sharp * draw);
      attr(blurPatch, 'cx', fx - 4); attr(blurPatch, 'cy', fy); attr(blurPatch, 'ry', 12 + Math.abs(edgeY)); op(blurPatch, (1 - sharp) * 0.8 * draw);
      const showState = win(t, at('near') + 0.6, at('sclera') - 0.2, 0.3);
      op(okChip, showState * sharp); tr(okChip, 1066, 400);
      op(badChip, showState * (1 - sharp)); tr(badChip, 1066, 400);

      // labels, chip and the front view of the ring
      op(labCil, win(t, mid('ciliary', 0.18), at('near') + 0.2, 0.35));
      op(labLig, win(t, mid('ligaments', 0.16), at('near') + 0.2, 0.35));
      const ac = P(t, mid('shape', 0.72), 0.5, pop);
      op(accG, clamp(ac * 2) * (1 - P(t, at('ciliary') + 0.2, 0.5, linear))); tr(accChip, 220, 632, 0.85 + 0.15 * clamp(ac));
      const rg = win(t, mid('ciliary', 0.25), at('near') + 0.2, 0.4);
      op(ringG, rg); op(ringGlow, win(t, mid('ciliary', 0.25), end('ciliary') + 0.3, 0.35) * 0.9); op(spokeHalo, win(t, mid('ligaments', 0.1), end('ligaments') + 0.3, 0.35));
      // the tags follow the words: contract, slack, fatter, bends more / relax, tight, thinner, bends less
      const nearTag = f => win(t, mid('near', f), at('far') - 0.1, 0.3), farTag = f => win(t, mid('far', f), at('sclera') - 0.1, 0.3);
      putTag(tags.contract, 'mus', nearTag(0.34)); putTag(tags.slack, 'lig', nearTag(0.52)); putTag(tags.fatter, 'lens', nearTag(0.68)); putTag(tags.more, 'ray', nearTag(0.86));
      putTag(tags.relax, 'mus', farTag(0.4)); putTag(tags.tight, 'lig', farTag(0.58)); putTag(tags.thinner, 'lens', farTag(0.74)); putTag(tags.less, 'ray', farTag(0.9));
    }

    /* B: the whole eye */
    const aB = P(t, at('sclera') - 0.05, 0.8, linear);
    op(B, aB);
    if (aB > 0) {
      const zs = lerp(1.6, 1, zoom), lx = lensX + EX;
      eyeG.setAttribute('transform', `translate(${lx} ${EY}) scale(${zs.toFixed(4)}) translate(${-lx} ${-EY}) translate(${EX} ${EY})`);
      const pulse = 0.8 + 0.2 * wave(t, 1.3) * calm;
      op(hlSclera, win(t, mid('sclera', 0.14), end('sclera') + 0.2, 0.4) * pulse);
      op(hlNerve, win(t, mid('optic', 0.08), end('optic') + 0.2, 0.4) * 0.45 * pulse);
      op(labScl, P(t, mid('sclera', 0.2), 0.4, linear) * (1 - 0.45 * P(t, at('optic'), 0.5, linear)));
      const insA = win(t, mid('sclera', 0.55), at('optic') + 0.1, 0.4);
      op(inset, insA); op(whiteHalo, 0.35 * (0.7 + 0.3 * wave(t, 1.1) * calm)); op(whiteLab, P(t, mid('sclera', 0.7), 0.4, linear));
      op(labOpt, P(t, mid('optic', 0.12), 0.4, linear) * (1 - 0.45 * P(t, at('blind'), 0.5, linear)));
      // the brain and the picture you see
      op(brainG, P(t, mid('optic', 0.3), 0.5, linear));
      const bg = win(t, mid('optic', 0.55), mid('optic', 0.85), 0.3);
      op(brainGlow, bg * 0.9); op(lbBrain, P(t, mid('optic', 0.5), 0.4, linear));
      const bubIn = Math.max(0.01, P(t, mid('optic', 0.74), 0.5, pop));
      op(bub, clamp(bubIn * 2)); tr(bub, BUB[0] * (1 - bubIn), BUB[1] * (1 - bubIn), bubIn);

      // the source: the tree for the optic nerve; a star for the blind spot
      const toStar = P(t, at('blind') - 0.2, 0.6, linear);
      const sy = lerp(400, 341, P(t, mid('blind', 0.3), 1.6));           // the star's image slides on to the blind spot
      const src = toStar < 0.5 ? [150 - EX, 395 - EY] : [150 - EX, sy - EY];
      tr(tree2, 150, 395 + 195 * 0.62); op(tree2, P(t, mid('optic', 0.0), 0.4, linear) * (1 - toStar));
      tr(star, 150, sy); op(star, toStar); starArt.upd(t);
      op(bubTree, 1 - toStar); bubStarArt.upd(t);
      const rays = eyeRays(src[0], src[1], 3), rp = P(t, mid('optic', 0.0), 0.9);
      const onBlind = clamp((352 - sy) / 7);                             // 1 once the image is on the blind spot
      rays.forEach((r, k) => { eyeR[k].pts(r.pts); eyeR[k].set(rp); op(eyeR[k], rp > 0 ? Math.min(1, Math.abs(toStar - 0.5) * 2.2) : 0); });
      const I = rays[0].I;
      tr(land, I[0], I[1], 0.8 + 0.25 * wave(t, 1.1) * calm); op(land, P(t, mid('optic', 0.12), 0.4, linear) * Math.min(1, Math.abs(toStar - 0.5) * 2.2) * (1 - onBlind));
      tr(noSig, I[0] - 92, I[1] + 56); op(noSig, onBlind * toStar);
      op(bubStar, toStar * (1 - onBlind)); op(cantSee, toStar * onBlind);
      // signals: from where the image lands, along the nerve to the brain (none from the blind spot)
      const route = routeFrom(Math.atan2(I[1], I[0]) * 180 / Math.PI);
      const sig = P(t, mid('optic', 0.2), 0.4, linear) * (1 - onBlind) * Math.min(1, Math.abs(toStar - 0.5) * 2.2);
      sigDots.forEach((d, k) => { const u = ((t - mid('optic', 0.2)) / 1.6 + k / 6) % 1, q = along(route, u); tr(d, q[0], q[1]); op(d, sig * Math.min(1, u * 8, (1 - u) * 8)); });
      // blind spot
      op(blindRing, P(t, mid('blind', 0.06), 0.5, linear)); blindDash.setAttribute('stroke-dashoffset', (-t * 14 * calm).toFixed(1));
      op(labBlind, P(t, mid('blind', 0.12), 0.4, linear));
    }
  };
});
