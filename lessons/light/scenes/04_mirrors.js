/* Chapter 4: Images in a plane mirror.
   Beats: a flat mirror and a lit candle: where is the image? -> two rays from the flame tip reflect with equal
   angles into an eye -> ★ extend them backwards: they meet behind the mirror, where a ghostly candle appears
   -> no light gets there: a screen stays blank, the image is virtual -> as far behind as in front
   -> upright and the same size -> laterally inverted: your right hand, its left -> AMBULANCE written backwards
   -> up and down are not swapped, front and back are -> VUSL. */
scene('mirrors', S => {
  const { at, end, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;
  const bump = (t, t0, dur) => Math.sin(Math.PI * P(t, t0, dur || 0.5, linear));
  const ray = (r, p, a) => { p = clamp(p); r.set(p); op(r, p > 0.002 ? (a === undefined ? 1 : a) : 0); };   // a ray at 0 would leave a dot
  const zoomAt = (el, x, y, k) => el.setAttribute('transform', `translate(${x} ${y}) scale(${k.toFixed(4)}) translate(${-x} ${-y})`);
  const popIn = (el, t, t0, x, y, s0) => { const p = P(t, t0, 0.5, pop); op(el, clamp(p * 2)); tr(el, x, y, Math.max(0.01, (s0 === undefined ? 0.6 : s0) + (1 - (s0 === undefined ? 0.6 : s0)) * p)); return p; };

  /* ---------- local art ---------- */
  // a candle with its flame tip at (0, 0) and its base (dish) at y = 185; g.upd(t) flickers, g.lit(v) lights it
  function candle(parent) {
    const g = G(parent);
    const halo = E('ellipse', { cx: 0, cy: 30, rx: 64, ry: 78, fill: glow('#FFB347') }, g);
    E('ellipse', { cx: 0, cy: 176, rx: 44, ry: 9, fill: ball('#C9D6DF', '#7D8C99'), stroke: '#E2EAF0', 'stroke-width': 2 }, g);
    E('rect', { x: -18, y: 58, width: 36, height: 118, rx: 5, fill: linGrad('#FFF7E6', '#DCC6A0'), stroke: '#CDB892', 'stroke-width': 2 }, g);
    E('ellipse', { cx: 0, cy: 58, rx: 18, ry: 5, fill: '#FFF9EE' }, g);
    E('path', { d: 'M-18,60 Q-19,82 -13,86 Q-9,82 -9,61 Z', fill: '#FFF9EE' }, g);
    E('line', { x1: 0, y1: 42, x2: 0, y2: 58, stroke: '#3A2A1A', 'stroke-width': 3, 'stroke-linecap': 'round' }, g);
    const fl = G(g);
    E('path', { d: 'M0,0 C-6,14 -15,26 -14,38 C-13,48 -7,54 0,54 C7,54 13,48 14,38 C15,26 6,14 0,0 Z', fill: '#FFB13B' }, fl);
    E('path', { d: 'M0,18 C-4,28 -8,34 -7,41 C-6,47 -3,50 0,50 C3,50 6,47 7,41 C8,34 4,28 0,18 Z', fill: '#FFF1B8' }, fl);
    g.lit = v => { op(halo, v * 0.9); op(fl, v); };
    g.upd = t => fl.setAttribute('transform', `translate(0 54) scale(${(1 + 0.05 * calm * Math.sin(t * 9)).toFixed(3)} ${(1 + 0.07 * calm * Math.sin(t * 13 + 1)).toFixed(3)}) translate(0 -54)`);
    g.lit(1); g.upd(0);
    return g;
  }
  // a person seen from the front or from behind, about 196 tall, feet at (0, 0); g.raise(p) lifts the arm on
  // the right of the picture (0 down .. 1 up)
  function figure(parent, back) {
    const g = G(parent), skin = '#C98E62', shirt = '#5B8DEF', shorts = '#A9BCD4', hair = '#2B1D14';
    const seg = (col, w) => E('line', { stroke: col, 'stroke-width': w, 'stroke-linecap': 'round' }, g);
    const put = (l, a, b) => { attr(l, 'x1', a[0]); attr(l, 'y1', a[1]); attr(l, 'x2', b[0]); attr(l, 'y2', b[1]); };
    [-1, 1].forEach(sd => {
      put(seg(shorts, 15), [sd * 9, -92], [sd * 10, -50]); put(seg(skin, 12.5), [sd * 10, -50], [sd * 11, -9]);
      E('ellipse', { cx: sd * 12, cy: -4, rx: 10, ry: 6, fill: '#F2F7FA' }, g);
    });
    E('path', { d: 'M-24,-150 Q0,-158 24,-150 L19,-90 Q0,-84 -19,-90 Z', fill: shirt }, g);
    const arms = [-1, 1].map(sd => ({ sd, up: seg(shirt, 11), lo: seg(skin, 9.5), hand: E('circle', { r: 6.5, fill: skin }, g) }));
    const pose = (A, au, af) => {
      const s = [A.sd * 22, -146], el = [s[0] + A.sd * 33 * Math.sin(au), s[1] + 33 * Math.cos(au)], h = [el[0] + A.sd * 31 * Math.sin(af), el[1] + 31 * Math.cos(af)];
      put(A.up, s, el); put(A.lo, el, h); attr(A.hand, 'cx', h[0]); attr(A.hand, 'cy', h[1]);
      return h;
    };
    E('rect', { x: -6, y: -160, width: 12, height: 10, fill: skin }, g);
    E('circle', { cx: 0, cy: -174, r: 19, fill: skin }, g);
    if (back) {
      E('circle', { cx: -19, cy: -172, r: 5, fill: skin }, g); E('circle', { cx: 19, cy: -172, r: 5, fill: skin }, g);
      E('path', { d: 'M-19,-172 Q-21,-196 0,-196 Q21,-196 19,-172 Q18,-158 10,-155 L-10,-155 Q-18,-158 -19,-172 Z', fill: hair }, g);
    } else {
      E('path', { d: 'M-19,-178 Q-16,-198 2,-196 Q18,-195 19,-180 Q8,-188 -19,-178 Z', fill: hair }, g);
      E('circle', { cx: -7, cy: -175, r: 2.6, fill: '#2B1D14' }, g); E('circle', { cx: 7, cy: -175, r: 2.6, fill: '#2B1D14' }, g);
      E('path', { d: 'M-7,-165 Q0,-160 7,-165', fill: 'none', stroke: '#7A3B2A', 'stroke-width': 2.2, 'stroke-linecap': 'round' }, g);
    }
    pose(arms[0], 0.14, 0.07);
    g.raise = p => { p = clamp(p); return pose(arms[1], lerp(0.14, 2.62, p), lerp(0.07, 3.0, p)); };
    g.raise(0);
    return g;
  }
  // ambulance front, about 370 x 320, centred on (0, 0); the word is mirror-written
  function ambulance(parent) {
    const g = G(parent);
    const lights = [-1, 1].map(sd => { const h = E('circle', { cx: sd * 70, cy: -156, r: 46, fill: glow('#3B82F6') }, g); return h; });
    E('rect', { x: -110, y: -170, width: 220, height: 26, rx: 10, fill: '#2A3644', stroke: '#9DB0BF', 'stroke-width': 2 }, g);
    [-1, 1].forEach(sd => E('rect', { x: sd * 70 - 30, y: -167, width: 60, height: 20, rx: 6, fill: '#5BA3FF' }, g));
    E('rect', { x: -180, y: -146, width: 360, height: 276, rx: 26, fill: ball('#F2EE5C', '#B8B228'), stroke: '#8C8720', 'stroke-width': 3 }, g);
    E('path', { d: 'M-146,-122 L146,-122 Q156,-122 154,-110 L140,-36 Q138,-28 128,-28 L-128,-28 Q-138,-28 -140,-36 L-154,-110 Q-156,-122 -146,-122 Z', fill: linGrad('#5E7C93', '#22394A', true), stroke: '#1C2A36', 'stroke-width': 3 }, g);
    E('path', { d: 'M-118,-110 L-70,-110 L-104,-40 L-128,-40 Z', fill: '#FFFFFF', opacity: 0.16 }, g);
    const word = T(g, 0, 10, 'AMBULANCE', { size: 40, weight: 700, anchor: 'middle', fill: '#1F7A44' });
    word.setAttribute('transform', 'scale(-1 1)');
    for (let i = 0; i < 9; i++) E('rect', { x: -180 + i * 40, y: 34, width: 40, height: 30, fill: i % 2 ? '#F2EE5C' : '#1F8F4E' }, g);
    for (let i = 0; i < 9; i++) E('rect', { x: -180 + i * 40, y: 64, width: 40, height: 30, fill: i % 2 ? '#1F8F4E' : '#F2EE5C' }, g);
    E('rect', { x: -60, y: 100, width: 120, height: 24, rx: 6, fill: '#2A3644' }, g);
    [-1, 1].forEach(sd => { E('circle', { cx: sd * 128, cy: 112, r: 32, fill: glow('#FFF7C2') }, g); E('circle', { cx: sd * 128, cy: 112, r: 15, fill: '#FFFBE6', stroke: '#C9C26A', 'stroke-width': 3 }, g); });
    [-1, 1].forEach(sd => E('rect', { x: sd * 140 - 26, y: 128, width: 52, height: 28, rx: 8, fill: '#1B2229' }, g));
    g.upd = t => {
      if (S.reduce) { op(lights[0], 0.6); op(lights[1], 0.6); return; }          // no flashing for reduced motion
      const k = (t * 2.2) % 1; op(lights[0], k < 0.5 ? 0.9 : 0.15); op(lights[1], k < 0.5 ? 0.15 : 0.9);
    };
    return g;
  }
  function dimLine(parent, x1, x2, y, col) {
    const g = G(parent), mx = (x1 + x2) / 2;
    const a = arrow(g, mx, y, x1, y, { color: col, width: 4, head: 15 }), b = arrow(g, mx, y, x2, y, { color: col, width: 4, head: 15 });
    g.set = p => { a.set(p); b.set(p); };
    g.set(0);
    return g;
  }
  function rich(parent, x, y, segs, o) {
    o = o || {};
    const el = E('text', { x, y, 'font-size': o.size || 30, 'font-weight': o.weight || 700, 'font-family': FD, 'text-anchor': o.anchor || 'start', fill: o.fill || C.ink }, parent);
    segs.forEach(s => { if (typeof s === 'string') s = [s]; E('tspan', { fill: s[1], 'font-weight': s[2] }, el).textContent = s[0]; });
    return el;
  }

  /* ================= A. the candle and its image ================= */
  const MX = 640, PX = 400, PY = 330, QX = 880;                  // mirror line, flame tip P, image P' = (880, 330)
  const A = G(root);
  const opt = G(A);                                                // mirror, rays, normals and arcs, under the candle
  const mir = planeMirror(opt, 470); tr(mir, MX, 405, 1, -90);
  const planeChip = chip(A, 'a plane mirror is flat', { size: 28, fill: C.card2, stroke: C.line });
  const qm = T(A, QX, 478, '?', { size: 110, weight: 700, anchor: 'middle', fill: C.faint });
  const cdl = candle(A); tr(cdl, PX, PY);
  const ghost = candle(A); tr(ghost, QX, PY);
  const labObj = T(A, PX, 300, 'object', { size: 28, weight: 600, anchor: 'middle', fill: C.muted });
  const labImg = T(A, QX, 300, 'image', { size: 28, weight: 700, anchor: 'middle', fill: C.energy });
  const tipRing = E('circle', { cx: PX, cy: PY, r: 10, fill: 'none', stroke: '#FFFFFF', 'stroke-width': 3.5 }, A);

  // the observer's eye and where the two rays enter it; each ray's mirror point lies on the line from P' to the eye
  const EYE = [470, 615], ES = 2.4, ER = -24, er = ER * Math.PI / 180;
  const onEye = (lx, ly) => [EYE[0] + lx * Math.cos(er) - ly * Math.sin(er), EYE[1] + lx * Math.sin(er) + ly * Math.cos(er)];
  const EP = [onEye(22 * ES, -10 * ES), onEye(22 * ES, 10 * ES)];
  const MY = EP.map(e => PY + (e[1] - PY) * (QX - MX) / (QX - e[0]));
  const TH = MY.map(y => Math.atan2(y - PY, MX - PX) * 180 / Math.PI);     // angle of incidence = angle of reflection
  const spreadHi = MY.map((y, k) => E('line', { x1: MX, y1: y, x2: EP[k][0], y2: EP[k][1], stroke: '#FFFFFF', 'stroke-width': 16, 'stroke-linecap': 'round' }, opt));
  const rays = MY.map((y, k) => rayPath(opt, [[PX, PY], [MX, y], EP[k]], {}));
  const backs = MY.map(y => rayPath(A, [[MX, y], [QX, PY]], { dash: '10 8', heads: false, glow: false, width: 4, opacity: 0.9 }));
  // normals and equal arcs sit on top of the rays so they stay visible
  const nrms = MY.map(y => normalLine(opt, MX, y, 180, 62, { back: 0 }));
  const arcsI = MY.map((y, k) => arcFromNormal(opt, MX, y, 180, TH[k], 27, { color: LT.angI, wedge: 0.4, width: 5 }));
  const arcsR = MY.map((y, k) => arcFromNormal(opt, MX, y, 180, -TH[k], 27, { color: LT.angR, wedge: 0.4, width: 5 }));
  const meet = E('circle', { cx: QX, cy: PY, r: 30, fill: glow(C.energy) }, A);
  const eye = eyeIcon(A, ES, { right: true }); tr(eye, EYE[0], EYE[1], 1, ER);
  // a close-up of the two mirror points: each ray meets the mirror with equal angles, i = r
  const ZK = 2.4, ZS = [622, (MY[0] + MY[1]) / 2], ZR = 105, ZB = [985, 215];
  const zp = q => [ZB[0] + ZK * (q[0] - ZS[0]), ZB[1] + ZK * (q[1] - ZS[1])];
  const zoom = G(A);
  E('circle', { cx: ZS[0], cy: ZS[1], r: ZR / ZK, fill: 'none', stroke: '#DCE6EE', 'stroke-width': 3 }, zoom);
  { const a = Math.atan2(ZB[1] - ZS[1], ZB[0] - ZS[0]), c = Math.cos(a), s = Math.sin(a);
    E('line', { x1: ZS[0] + c * ZR / ZK, y1: ZS[1] + s * ZR / ZK, x2: ZB[0] - c * ZR, y2: ZB[1] - s * ZR, stroke: '#DCE6EE', 'stroke-width': 3, 'stroke-dasharray': '6 6' }, zoom); }
  const zIn = G(zoom);
  E('circle', { cx: ZB[0], cy: ZB[1], r: ZR, fill: '#0B1E2A' }, zIn);
  const zMx = zp([MX, 0])[0];
  for (let y = ZB[1] - 88; y < ZB[1] + 84; y += 16) E('line', { x1: zMx + 6, y1: y, x2: zMx + 18, y2: y + 13, stroke: LT.hatch, 'stroke-width': 2.5, 'stroke-linecap': 'round' }, zIn);
  E('line', { x1: zMx, y1: ZB[1] - 94, x2: zMx, y2: ZB[1] + 94, stroke: LT.mirror, 'stroke-width': 8 }, zIn);
  const zArcs = [], zLetters = [];
  MY.forEach((y, k) => {
    const H = zp([MX, y]), ui = ltDir(180 + TH[k]), ur = ltDir(180 - TH[k]), L = 70;      // stubs stop short of where the rays cross
    E('line', { x1: H[0], y1: H[1], x2: H[0] - 84, y2: H[1], stroke: LT.normal, 'stroke-width': 3, 'stroke-dasharray': '10 8' }, zIn);
    lightRay(zIn, H[0] + ui[0] * L, H[1] + ui[1] * L, H[0], H[1], { width: 5, at: 0.35 });
    lightRay(zIn, H[0], H[1], H[0] + ur[0] * L, H[1] + ur[1] * L, { width: 5, at: 0.45 });
    zArcs.push(arcFromNormal(zIn, H[0], H[1], 180, TH[k], 38, { color: LT.angI, wedge: 0.3, width: 5 }), arcFromNormal(zIn, H[0], H[1], 180, -TH[k], 38, { color: LT.angR, wedge: 0.3, width: 5 }));
    [[TH[k] / 2, 'i', LT.angI], [-TH[k] / 2, 'r', LT.angR]].forEach(([a, s, col]) => { const q = ltPt(H[0], H[1], 180 + a, 62); zLetters.push(T(zIn, q[0], q[1] + 10, s, { size: 28, weight: 700, anchor: 'middle', fill: col })); });
  });
  E('circle', { cx: ZB[0], cy: ZB[1], r: ZR, fill: 'none', stroke: '#DCE6EE', 'stroke-width': 5 }, zIn);
  const eqChip = G(zoom);
  const eqc = chip(eqChip, '', { size: 30, w: Math.ceil(textWidth('equal angles: i = r', 28, FD, 700) + 44), fill: C.card2, stroke: C.line }); tr(eqc, ZB[0], ZB[1] + ZR + 42);
  rich(eqChip, ZB[0], ZB[1] + ZR + 52, [['equal angles: ', C.ink], ['i', LT.angI], [' = ', C.ink], ['r', LT.angR]], { size: 28, anchor: 'middle' });

  // virtual: no light behind the mirror; a screen there stays blank
  const noLight = labelLine(A, 684, 590, 704, MY[1] - (704 - MX) * (MY[1] - PY) / (QX - MX), 'no light here', { size: 27, anchor: 'start', fill: C.ink });
  const virChip = chip(A, 'virtual', { size: 36, fill: 'rgba(255,228,92,0.14)', stroke: C.energy, color: C.energy });
  const scr = G(A);
  E('line', { x1: 0, y1: 118, x2: 0, y2: 180, stroke: '#9DB0BF', 'stroke-width': 6, 'stroke-linecap': 'round' }, scr);
  E('rect', { x: -34, y: 178, width: 68, height: 10, rx: 5, fill: '#9DB0BF' }, scr);
  E('rect', { x: -74, y: -124, width: 148, height: 244, rx: 8, fill: '#EEF3F6', stroke: '#B9C9D4', 'stroke-width': 3 }, scr);
  const blank = T(scr, 0, 8, 'blank', { size: 26, weight: 600, anchor: 'middle', fill: '#8FA3B3' });
  T(scr, 0, -96, 'screen', { size: 24, weight: 600, anchor: 'middle', fill: '#8FA3B3' });

  // as far behind as in front
  const BASE = PY + 185;
  const dimA = dimLine(A, PX, MX - 4, 585, C.energy), dimB = dimLine(A, MX + 4, QX, 585, C.energy);
  const guides = G(A);
  [PX, QX].forEach(x => E('line', { x1: x, y1: BASE + 4, x2: x, y2: 600, stroke: C.muted, 'stroke-width': 2.5, 'stroke-dasharray': '6 6' }, guides));
  const dL = T(A, (PX + MX) / 2, 628, 'd', { size: 36, weight: 700, anchor: 'middle', fill: C.energy });
  const dR = T(A, (MX + QX) / 2, 628, 'd', { size: 36, weight: 700, anchor: 'middle', fill: C.energy });
  const sameD = chip(A, 'same distance', { size: 30, fill: C.card2, stroke: C.energy });

  // upright, same size
  const hbL = arrow(A, 322, BASE, 322, PY, { color: C.good, width: 6 }), hbR = arrow(A, 958, BASE, 958, PY, { color: C.good, width: 6 });
  const hGuide = G(A);
  [PY, BASE].forEach(y => E('line', { x1: 300, y1: y, x2: 980, y2: y, stroke: C.good, 'stroke-width': 2.5, 'stroke-dasharray': '8 8', opacity: 0.7 }, hGuide));
  const upChip = chip(A, 'upright', { size: 30, fill: 'rgba(86,214,155,0.14)', stroke: C.good });
  const ssChip = chip(A, 'same size', { size: 30, fill: 'rgba(86,214,155,0.14)', stroke: C.good });

  /* ================= B. laterally inverted: you (from behind) and your reflection ================= */
  const B = G(root);
  const FS = 1.95;
  const frame = G(B);
  E('rect', { x: 660, y: 150, width: 340, height: 508, rx: 22, fill: linGrad('#3E5A6E', '#1C2C38', true), stroke: LT.mirror, 'stroke-width': 10 }, frame);
  E('path', { d: 'M700,190 L760,190 L690,330 Z', fill: '#FFFFFF', opacity: 0.08 }, frame);
  const refl = figure(B, false); tr(refl, 830, 624, FS); refl.setAttribute('opacity', 0.92);
  const you = figure(B, true); tr(you, 400, 640, FS);
  const latChip = chip(B, 'laterally inverted', { size: 32, fill: 'rgba(255,228,92,0.14)', stroke: C.energy, color: C.energy });
  tr(latChip, 830, 108);
  T(B, 400, 700, 'you, from behind', { size: 27, weight: 600, anchor: 'middle', fill: C.muted });
  T(B, 830, 700, 'your reflection', { size: 27, weight: 600, anchor: 'middle', fill: C.muted });
  const hUp = you.raise(1); you.raise(0);                          // where the raised hand ends up (local)
  const hYou = [400 + FS * hUp[0], 640 + FS * hUp[1]], hRef = [830 + FS * hUp[0], 624 + FS * hUp[1]];
  const labR = G(B);
  T(labR, hYou[0], hYou[1] - 58, 'your right', { size: 30, weight: 700, anchor: 'middle', fill: C.energy });
  E('line', { x1: hYou[0], y1: hYou[1] - 48, x2: hYou[0], y2: hYou[1] - 18, stroke: C.energy, 'stroke-width': 3, 'stroke-linecap': 'round' }, labR);
  const labL = labelLine(B, 1044, hRef[1] + 34, hRef[0] + 12, hRef[1] + 4, 'its left', { size: 30, fill: C.energy, line: C.energy, anchor: 'start' });

  /* ================= C. AMBULANCE ================= */
  const Cg = G(root);
  const amb = ambulance(Cg); tr(amb, 330, 420);
  T(Cg, 330, 650, 'written back-to-front', { size: 28, weight: 600, anchor: 'middle', fill: C.muted });
  const rvm = G(Cg);
  E('rect', { x: -10, y: -170, width: 20, height: 110, rx: 6, fill: '#2A3644' }, rvm);
  E('rect', { x: -196, y: -86, width: 392, height: 172, rx: 34, fill: '#1B2430', stroke: '#3A4856', 'stroke-width': 3 }, rvm);
  const clipId = 'lt-mir-rvm';
  const cp = E('clipPath', { id: clipId }, defs());
  E('rect', { x: -180, y: -72, width: 360, height: 144, rx: 26 }, cp);
  const glass = G(rvm, { 'clip-path': `url(#${clipId})` });
  E('rect', { x: -180, y: -72, width: 360, height: 144, fill: linGrad('#4B6578', '#22323F', true) }, glass);
  const ambR = ambulance(glass); ambR.setAttribute('transform', 'translate(0 4) scale(-0.72 0.72)');
  E('path', { d: 'M-150,-60 L-110,-60 L-150,10 Z', fill: '#FFFFFF', opacity: 0.12 }, glass);
  tr(rvm, 880, 330);
  const rvmLab = G(Cg);
  T(rvmLab, 880, 466, "in the driver's mirror", { size: 28, weight: 600, anchor: 'middle', fill: C.muted });
  const okChip = chip(rvmLab, 'reads correctly', { size: 30, fill: 'rgba(86,214,155,0.14)', stroke: C.good });
  tr(okChip, 880, 530);
  const okTick = tick(rvmLab, 14); tr(okTick, 880 + okChip.w / 2 + 30, 532);
  const ambArrow = arrow(Cg, 540, 300, 676, 316, { color: C.muted, width: 5, bend: -30 });

  /* ================= D. up stays up, front and back swap ================= */
  const D = G(root);
  const mirD = planeMirror(D, 460); tr(mirD, 600, 410, 1, -90);
  const PS = 1.6;
  const prof = [380, 820].map((x, k) => {
    const g = G(D), p = person(g);
    E('circle', { cx: 9, cy: -177, r: 2.8, fill: '#2B1D14' }, g);
    E('path', { d: 'M18,-176 L24,-168 L17,-166', fill: 'none', stroke: '#A8704A', 'stroke-width': 2.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    g.setAttribute('transform', `translate(${x} 612) scale(${k ? -PS : PS} ${PS})`);
    if (k) g.setAttribute('opacity', 0.92);
    return { g, p, x };
  });
  const HEAD = 612 - PS * 196;
  const upA = [380, 820].map(x => arrow(D, x, HEAD - 14, x, HEAD - 104, { color: C.ink, width: 6 }));
  const upTicks = [380, 820].map(() => tick(D, 14));
  const upChip2 = chip(D, 'up stays up', { size: 30, fill: 'rgba(86,214,155,0.14)', stroke: C.good });
  tr(upChip2, 600, 140);
  const CHEST = 612 - PS * 122;
  const fwA = [arrow(D, 404, CHEST, 556, CHEST, { color: C.energy, width: 6 }), arrow(D, 796, CHEST, 644, CHEST, { color: C.energy, width: 6 })];
  const fwL = [T(D, 480, CHEST - 22, 'front', { size: 27, weight: 700, anchor: 'middle', fill: C.energy }), T(D, 720, CHEST - 22, 'front', { size: 27, weight: 700, anchor: 'middle', fill: C.energy })];
  const fbNote = G(D);
  rich(fbNote, 600, 690, [['front ↔ back', C.energy], [', not up ↔ down', C.ink]], { size: 32, anchor: 'middle' });

  /* ================= E. VUSL ================= */
  const Eg = G(root);
  const vusl = rich(Eg, 600, 168, [['V', C.energy], ['U', C.energy], ['S', C.energy], ['L', C.energy]], { size: 84, anchor: 'middle' });
  vusl.setAttribute('letter-spacing', 14);
  const phrase = rich(Eg, 600, 236, [['V', C.energy], ['ery '], ['U', C.energy], ['seful '], ['S', C.energy], ['mooth '], ['L', C.energy], ['ooking-glass']], { size: 38, weight: 600, anchor: 'middle' });
  const CARDS = [
    { x: 195, L: 'V', w: 'Virtual', icon: g => { E('line', { x1: 0, y1: -56, x2: 0, y2: 56, stroke: LT.mirror, 'stroke-width': 6, 'stroke-linecap': 'round' }, g); const c1 = candle(g); tr(c1, -48, -46, 0.5); const c2 = candle(g); tr(c2, 48, -46, 0.5); c2.setAttribute('opacity', 0.4); E('line', { x1: 6, y1: -20, x2: 44, y2: -44, stroke: LT.ray, 'stroke-width': 3, 'stroke-dasharray': '6 5' }, g); return [c1, c2]; } },
    { x: 455, L: 'U', w: 'Upright', icon: g => { const c = candle(g); tr(c, -18, -46, 0.5); arrow(g, 34, 46, 34, -46, { color: C.good, width: 5 }); return [c]; } },
    { x: 715, L: 'S', w: 'Same size', icon: g => { const c1 = candle(g); tr(c1, -42, -46, 0.5); const c2 = candle(g); tr(c2, 42, -46, 0.5); c2.setAttribute('opacity', 0.4); [-46, 46].forEach(y => E('line', { x1: -80, y1: y, x2: 80, y2: y, stroke: C.good, 'stroke-width': 2.5, 'stroke-dasharray': '6 6' }, g)); return [c1, c2]; } },
    { x: 975, L: 'L', w: 'Laterally\ninverted', icon: g => { T(g, -44, 26, 'R', { size: 76, weight: 700, anchor: 'middle', fill: C.ink }); E('line', { x1: 0, y1: -56, x2: 0, y2: 56, stroke: LT.mirror, 'stroke-width': 6, 'stroke-linecap': 'round' }, g); const r2 = T(g, 44, 26, 'R', { size: 76, weight: 700, anchor: 'middle', fill: C.ink, opacity: 0.55 }); r2.setAttribute('transform', 'translate(88 0) scale(-1 1)'); return []; } },
  ].map(c => {
    const g = G(Eg);
    card(g, -118, -150, 236, 320, { fill: C.card, stroke: C.line });
    T(g, 0, -86, c.L, { size: 64, weight: 700, anchor: 'middle', fill: C.energy });
    const art = G(g); tr(art, 0, 20); c.anim = c.icon(art);
    T(g, 0, c.w.indexOf('\n') > 0 ? 116 : 134, c.w, { size: 30, weight: 700, anchor: 'middle', lh: 34 });
    c.g = g;
    return c;
  });

  return t => {
    /* ================= A ================= */
    const tB = at('lateral') - 0.3;
    const aA = Math.min(P(t, S.first - 0.5, 0.5, linear), 1 - P(t, tB, 0.5, linear));
    op(A, aA);
    if (aA > 0) {
      // plane: the mirror slides in, the candle lights, a faint "?" behind the mirror
      const mp = P(t, at('plane') - 0.1, 0.8, easeOut);
      tr(mir, MX + (1 - mp) * 60, 405, 1, -90); op(mir, mp);
      const pc = P(t, mid('plane', 0.12), 0.5, easeOut);
      op(planeChip, pc * (1 - P(t, at('two') - 0.1, 0.4, linear))); tr(planeChip, 860, 140 + (1 - pc) * 12);
      cdl.lit(P(t, mid('plane', 0.3), 0.5, linear)); cdl.upd(t); ghost.upd(t);
      op(qm, P(t, mid('plane', 0.6), 0.5, linear) * (0.55 + 0.45 * wave(t, 1.6)) * (1 - P(t, mid('back', 0.6), 0.4, linear)));
      op(labObj, P(t, mid('plane', 0.4), 0.5, linear) * (1 - P(t, at('lateral') - 0.6, 0.3, linear)));

      // two rays from the flame tip, each reflecting with equal angles into the eye
      const rp = clamp((t - mid('two', 0.22)) / 0.8);
      op(tipRing, rp > 0 && rp < 1 ? 1 - rp : 0); attr(tipRing, 'r', 8 + 26 * rp);
      const raysOut = 1 - P(t, at('distance') - 0.25, 0.45, linear);
      rays.forEach((r, k) => ray(r, P(t, mid('two', 0.12 + k * 0.17), 1.5, linear), raysOut));
      op(eye, P(t, mid('two', 0.05), 0.5, linear) * raysOut);
      const angOut = 1 - P(t, mid('back', 0.12), 0.5, linear);
      nrms.forEach((n, k) => { n.set(P(t, mid('two', 0.5 + k * 0.08), 0.5)); op(n, angOut * raysOut); });
      arcsI.forEach((a, k) => { a.set(P(t, mid('two', 0.62 + k * 0.14), 0.5)); op(a, angOut); });
      arcsR.forEach((a, k) => { a.set(P(t, mid('two', 0.69 + k * 0.14), 0.5)); op(a, angOut); });
      // the magnifier: on for "equal angles", gone as the rays are extended backwards
      const zq = P(t, mid('two', 0.54), 0.55, pop);
      op(zoom, clamp(zq * 2) * (1 - P(t, mid('back', 0.06), 0.45, linear)));
      zoomAt(zIn, ZB[0], ZB[1], Math.max(0.01, 0.6 + 0.4 * zq));
      zArcs.forEach((a, j) => a.set(P(t, mid('two', 0.62 + (j >> 1) * 0.14 + (j & 1) * 0.07), 0.5)));
      zLetters.forEach((l, j) => op(l, P(t, mid('two', 0.66 + (j >> 1) * 0.14 + (j & 1) * 0.07), 0.3, linear)));
      op(eqChip, P(t, mid('two', 0.86), 0.4, linear));

      // back: dashed lines grow back from the mirror and meet at P'; the image appears there
      const spread = bump(t, mid('back', 0.02), 1.3);
      spreadHi.forEach(h => op(h, 0.28 * spread));
      backs.forEach((b, k) => ray(b, P(t, mid('back', 0.3 + k * 0.06), 1.3, easeOut), raysOut));
      const mt = clamp((t - mid('back', 0.62)) / 0.9);
      op(meet, mt > 0 && mt < 1 ? Math.sin(mt * Math.PI) : 0); attr(meet, 'r', 16 + 30 * mt);
      // the ghost candle: hidden while the screen stands in its place
      const scrIn = P(t, mid('virtual', 0.66), 0.6, easeOut), scrOut = P(t, at('distance') - 0.3, 0.5, easeIn);
      const scrP = scrIn * (1 - scrOut);
      op(ghost, 0.45 * P(t, mid('back', 0.66), 0.9, linear) * (1 - clamp(scrP * 1.8)));
      op(labImg, P(t, mid('back', 0.8), 0.5, linear) * (1 - P(t, at('lateral') - 0.6, 0.3, linear)) * (1 - win(t, mid('virtual', 0.6), at('distance') + 0.5, 0.3)));

      // virtual
      noLight.set(win(t, mid('virtual', 0.08), at('distance') - 0.1, 0.4));
      const vc = P(t, mid('virtual', 0.42), 0.5, pop);
      op(virChip, clamp(vc * 2) * (1 - P(t, at('distance') - 0.1, 0.4, linear))); tr(virChip, 1060, 220, Math.max(0.01, 0.7 + 0.3 * vc));
      op(scr, scrP > 0.001 ? 1 : 0); tr(scr, lerp(1130, QX, scrP), 420);
      op(blank, P(t, mid('virtual', 0.82), 0.4, linear));

      // as far behind as in front
      const dOut = 1 - P(t, at('upright') - 0.15, 0.4, linear);
      // "as far behind the mirror" (the image side first) "as the object is in front"
      const pb = P(t, mid('distance', 0.06), 0.7), pa = P(t, mid('distance', 0.42), 0.7);
      dimA.set(pa); dimB.set(pb); op(dimA, pa > 0.002 ? dOut : 0); op(dimB, pb > 0.002 ? dOut : 0); op(guides, P(t, mid('distance', 0.02), 0.4, linear) * dOut);
      op(dR, P(t, mid('distance', 0.2), 0.3, linear) * dOut); op(dL, P(t, mid('distance', 0.56), 0.3, linear) * dOut);
      const sd = P(t, mid('distance', 0.62), 0.45, easeOut); op(sameD, sd * dOut); tr(sameD, 640, 684 + (1 - sd) * 10);

      // upright and the same size
      hbL.set(P(t, mid('upright', 0.04), 0.7)); hbR.set(P(t, mid('upright', 0.08), 0.7));
      op(hbL, P(t, mid('upright', 0.02), 0.2, linear)); op(hbR, P(t, mid('upright', 0.06), 0.2, linear));
      op(hGuide, P(t, mid('upright', 0.5), 0.5, linear));
      popIn(upChip, t, mid('upright', 0.16), 500, 652);
      popIn(ssChip, t, mid('upright', 0.6), 780, 652);
    }

    /* ================= B ================= */
    const aB = win(t, tB, at('ambulance') - 0.25, 0.45);
    op(B, aB);
    if (aB > 0) {
      const rz = P(t, mid('lateral', 0.52), 0.8);
      you.raise(rz); refl.raise(rz);
      const lc = P(t, mid('lateral', 0.04), 0.5, easeOut); op(latChip, lc); tr(latChip, 830, 108 + (1 - lc) * 10);
      op(labR, P(t, mid('lateral', 0.62), 0.4, linear));
      labL.set(P(t, mid('lateral', 0.82), 0.4, linear));
    }

    /* ================= C ================= */
    const aC = win(t, at('ambulance') - 0.3, at('updown') - 0.25, 0.45);
    op(Cg, aC);
    if (aC > 0) {
      amb.upd(t); ambR.upd(t);
      const ap = P(t, at('ambulance') - 0.2, 0.7, easeOut); tr(amb, 330 - (1 - ap) * 50, 420);
      const rp = P(t, mid('ambulance', 0.55), 0.6, pop);
      op(rvm, clamp(rp * 2)); tr(rvm, 880, 330 + (1 - clamp(rp)) * 30, Math.max(0.01, 0.7 + 0.3 * rp));
      ambArrow.set(P(t, mid('ambulance', 0.5), 0.6)); op(ambArrow, P(t, mid('ambulance', 0.5), 0.2, linear));
      op(rvmLab, P(t, mid('ambulance', 0.72), 0.5, linear));
      const tk = P(t, mid('ambulance', 0.84), 0.45, pop); op(okTick, clamp(tk * 2)); tr(okTick, 880 + okChip.w / 2 + 30, 532, Math.max(0.01, tk));
    }

    /* ================= D ================= */
    const aD = win(t, at('updown') - 0.3, at('vusl') - 0.25, 0.45);
    op(D, aD);
    if (aD > 0) {
      upA.forEach((a, k) => { a.set(P(t, mid('updown', 0.1 + k * 0.1), 0.6)); op(a, P(t, mid('updown', 0.08 + k * 0.1), 0.2, linear)); });
      upTicks.forEach((tk, k) => { const q = P(t, mid('updown', 0.3 + k * 0.06), 0.4, pop); op(tk, clamp(q * 2)); tr(tk, [380, 820][k] + 42, HEAD - 70, Math.max(0.01, q)); });
      const uc = P(t, mid('updown', 0.34), 0.45, easeOut); op(upChip2, uc); tr(upChip2, 600, 140 + (1 - uc) * 10);
      fwA.forEach((a, k) => { a.set(P(t, mid('updown', 0.44 + k * 0.12), 0.6)); op(a, P(t, mid('updown', 0.42 + k * 0.12), 0.2, linear)); op(fwL[k], P(t, mid('updown', 0.5 + k * 0.12), 0.3, linear)); });
      op(fbNote, P(t, mid('updown', 0.72), 0.5, linear));
    }

    /* ================= E ================= */
    const aE = P(t, at('vusl') - 0.3, 0.5, linear);
    op(Eg, aE);
    if (aE > 0) {
      const vp = P(t, mid('vusl', 0.02), 0.6, pop); op(vusl, clamp(vp * 2)); zoomAt(vusl, 600, 140, Math.max(0.01, 0.7 + 0.3 * vp));
      op(phrase, P(t, mid('vusl', 0.2), 0.6, linear));
      CARDS.forEach((c, i) => {
        const q = P(t, mid('vusl', [0.47, 0.6, 0.72, 0.85][i]), 0.55, pop);
        op(c.g, clamp(q * 2)); tr(c.g, c.x, 470 + (1 - clamp(q)) * 30, Math.max(0.01, 0.8 + 0.2 * q));
        c.anim.forEach(a => a.upd(t));
      });
    }
  };
});
