/* Static electricity: a run of vignettes, each filling the stage.
   what: a charged balloon (charge stays put) beside a circuit (charge flows) -> rub: a balloon rubbed on
   hair, electrons hop across -> gain: balloon −, hair + -> rule: hanging balloons repel and attract
   -> hair: + strands lift and fan out -> neutral: paper scraps jump up, the balloon sticks to a wall
   -> induction: zoom into the wall, charges shift, big pull beats small push -> earthing: a − sphere and a
   + sphere are earthed until neutral -> lightning (showpiece): cloud, bolt, flash, 5 × the Sun's surface
   -> fuel: a tanker is earthed before refuelling -> useful: a printer drum picks up toner
   -> shock: walking on carpet, then a zap at the door handle. */
scene('static', S => {
  const { at, end, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;

  /* ---------- palette for this chapter ---------- */
  const BAL = '#B48CFF', BALDK = '#6A3FC0', BALLT = '#DCCBFF';      // balloons (violet: no charge colour)
  const HAIR = '#EBC06A';
  const METAL = '#C9D6DE', METALDK = '#6F8495';
  const COPPER = '#D9893F';

  /* ---------- local helpers ---------- */
  function rich(parent, x, y, segs, o) {
    o = o || {};
    const t = E('text', { x, y, 'font-size': o.size || 30, 'font-weight': o.weight || 600, 'font-family': o.font || FD, 'text-anchor': o.anchor || 'start', fill: o.fill || C.ink }, parent);
    segs.forEach(s => { if (typeof s === 'string') s = [s]; E('tspan', { fill: s[1], 'font-weight': s[2] }, t).textContent = s[0]; });
    return t;
  }
  /* an electron: blue dot with a white minus (one element: the white stroke is both rim and minus) */
  function electron(parent, r) {
    r = r || 11;
    const f = v => (+v).toFixed(1);
    return E('path', { d: `M${f(-r)},0 a${f(r)},${f(r)} 0 1,0 ${f(2 * r)},0 a${f(r)},${f(r)} 0 1,0 ${f(-2 * r)},0 Z M${f(-r * 0.48)},0 H${f(r * 0.48)}`, fill: ball(C.water, C.waterDk), stroke: '#F2FBFF', 'stroke-width': f(r * 0.27), 'stroke-linecap': 'round' }, parent);
  }
  /* a positive charge: red plus with a dark outline (one element) */
  function plusT(parent, s) {
    s = s || 10;
    const w = s * 0.32, f = v => (+v).toFixed(1);
    const d = `M${f(-s)},${f(-w)} H${f(-w)} V${f(-s)} H${f(w)} V${f(-w)} H${f(s)} V${f(w)} H${f(w)} V${f(s)} H${f(-w)} V${f(w)} H${f(-s)} Z`;
    return E('path', { d, fill: C.bad, stroke: C.bg0, 'stroke-width': f(s * 0.3), 'stroke-linejoin': 'round', 'paint-order': 'stroke' }, parent);
  }
  /* a bare charge sign (one element): '+' red or '−' blue */
  function sign(parent, plus, s, w) {
    s = s || 12;
    return E('path', { d: plus ? `M${-s},0 H${s} M0,${-s} V${s}` : `M${-s},0 H${s}`, stroke: plus ? C.bad : C.water, 'stroke-width': w || s * 0.42, 'stroke-linecap': 'round' }, parent);
  }
  /* balloon centred on (0,0), knot at the bottom (or the top when o.hang) */
  function balloon(parent, rx, ry, o) {
    o = o || {};
    const g = G(parent), k = o.hang ? -1 : 1, f = v => v.toFixed(1);
    if (o.string) E('path', { d: `M0,${f(k * (ry + 12))} q-12,${f(k * 34)} 3,${f(k * 66)} t-3,${f(k * 62)}`, fill: 'none', stroke: '#C9D6DE', 'stroke-width': 2.5, 'stroke-linecap': 'round' }, g);
    E('path', { d: `M-8,${f(k * (ry + 13))} L8,${f(k * (ry + 13))} L0,${f(k * (ry - 3))} Z`, fill: BALDK, stroke: BALLT, 'stroke-width': 1.5, 'stroke-linejoin': 'round' }, g);
    const d = `M0,${f(-k * ry)} C${f(1.28 * rx)},${f(-k * ry)} ${f(1.3 * rx)},${f(k * 0.38 * ry)} 0,${f(k * ry)} C${f(-1.3 * rx)},${f(k * 0.38 * ry)} ${f(-1.28 * rx)},${f(-k * ry)} 0,${f(-k * ry)} Z`;
    E('path', { d, fill: ball(BAL, BALDK), stroke: BALLT, 'stroke-width': 3 }, g);
    const hy = o.hang ? -0.2 * ry : -0.46 * ry;
    E('ellipse', { cx: f(-0.4 * rx), cy: f(hy), rx: f(0.16 * rx), ry: f(0.27 * ry), fill: '#ffffff', opacity: 0.32, transform: `rotate(24 ${f(-0.4 * rx)} ${f(hy)})` }, g);
    return g;
  }
  /* a point along a polyline, u in 0..1 */
  function along(pts, u) {
    const segs = []; let L = 0;
    for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); segs.push(l); L += l; }
    let d = clamp(u) * L;
    for (let i = 0; i < segs.length; i++) { if (d <= segs[i] || i === segs.length - 1) { const q = segs[i] ? d / segs[i] : 0; return [lerp(pts[i][0], pts[i + 1][0], q), lerp(pts[i][1], pts[i + 1][1], q)]; } d -= segs[i]; }
    return pts[pts.length - 1];
  }
  /* earth symbol: three bars of shrinking width, top bar centred on (0,0) */
  function earthSym(parent, color) {
    return E('path', { d: 'M-30,0 H30 M-19,13 H19 M-8,26 H8', stroke: color || WIRE, 'stroke-width': 5, 'stroke-linecap': 'round' }, parent);
  }
  /* a double-headed "push apart" arrow of half-length h along +x (one element) */
  function repelMark(parent, h, color) {
    return E('path', { d: `M${-h},0 H${h} M${-h + 7},-6 L${-h},0 L${-h + 7},6 M${h - 7},-6 L${h},0 L${h - 7},6`, fill: 'none', stroke: color || C.bad, 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, parent);
  }
  /* an arrow that can be moved: drawn from (0,0) to (len,0), placed with tr(g, x, y, 1, deg) */
  function mover(parent, len, o) { const g = G(parent); arrow(g, 0, 0, len, 0, o); return g; }
  const popIn = (t, t0, d) => P(t, t0, d || 0.5, pop);
  const fade = (t, t0, d) => P(t, t0, d || 0.4, linear);
  const vis = (t, a, b) => win(t, a, b, 0.45);
  const rot = (x, y, deg) => { const a = deg * Math.PI / 180, c = Math.cos(a), s = Math.sin(a); return [x * c - y * s, x * s + y * c]; };

  /* =================== 1. what: static charge stays put =================== */
  const V1 = G(root);
  // a small circuit for contrast: charge flows
  const loop = G(V1);
  const lw = wire(loop, [[231, 500], [140, 500], [140, 262], [440, 262], [440, 500], [349, 500]], { spacing: 44 });
  const lCell = cellSym(loop, { cells: 2 }); tr(lCell, 290, 500);                  // the lesson's 3 V battery: one bulb, full brightness, 60 px/s
  const lBulb = bulbSym(loop); lBulb.firstChild.style.display = 'none'; tr(lBulb, 290, 262); lBulb.set(1);   // the wire under it is its lead
  const lLab = rich(V1, 290, 610, [['current', C.energy, 700], ': charge ', ['flows', C.energy, 800]], { size: 32, anchor: 'middle' });
  // the balloon with charge sitting on it
  const b1 = G(V1);
  balloon(b1, 108, 132, { string: true });
  const B1E = [[-62, -78], [6, -104], [70, -62], [-84, -6], [84, 2], [-46, 54], [44, 64], [0, -30]].map(([x, y]) => { const e = electron(b1, 12); tr(e, x, y); return { e, x, y }; });
  const b1Lab = rich(V1, 800, 610, [['static', BALLT, 800], ': charge that ', ['stays put', BALLT, 800]], { size: 32, anchor: 'middle' });

  /* =================== 2. rub / gain / hair: the person and the balloon =================== */
  const V2 = G(root);
  const PX = 400, PY = 1152, PS = 4.4;                 // kit person (feet far below the stage), head and shoulders
  const HC = [0, -174], HR = 19;                       // kit head centre and radius, local units
  const toStage = (lx, ly) => [PX + lx * PS, PY + ly * PS];
  const HEAD = toStage(HC[0], HC[1]), HRS = HR * PS;
  const headG = G(V2); tr(headG, PX, PY, PS);
  const SKIN = '#C98E62';
  E('path', { d: 'M-42,-40 L-40,-118 Q-39,-144 -14,-150 L14,-150 Q39,-144 40,-118 L42,-40 Z', fill: '#5B8DEF' }, headG);
  E('path', { d: 'M-9,-150 Q0,-141 9,-150', fill: 'none', stroke: '#3D6BC9', 'stroke-width': 1.6, 'stroke-linecap': 'round' }, headG);
  E('rect', { x: -6, y: -162, width: 12, height: 13, fill: SKIN }, headG);
  E('circle', { cx: -19, cy: -172, r: 3.6, fill: SKIN }, headG); E('circle', { cx: 19, cy: -172, r: 3.6, fill: SKIN }, headG);
  E('circle', { cx: 0, cy: -174, r: 19, fill: SKIN }, headG);
  E('path', { d: 'M-19.6,-171 Q-21.5,-196 0,-196.5 Q21.5,-196 19.6,-171 Q13,-187 0,-188 Q-13,-187 -19.6,-171 Z', fill: HAIR }, headG);
  E('circle', { cx: -6.5, cy: -175, r: 1.8, fill: '#2A1D14' }, headG);
  E('circle', { cx: 6.5, cy: -175, r: 1.8, fill: '#2A1D14' }, headG);
  const smile = E('path', { d: 'M-5,-166.5 Q0,-162.5 5,-166.5', fill: 'none', stroke: '#5A2A22', 'stroke-width': 1.3, 'stroke-linecap': 'round' }, headG);
  const ohh = E('ellipse', { cx: 0, cy: -165.5, rx: 2.3, ry: 2.9, fill: '#5A2A22' }, headG);
  // hair strands: lie flat like a bob, or stand up and fan out
  const NS = 11, strands = [];
  for (let i = 0; i < NS; i++) {
    const a = -162 + i * 144 / (NS - 1), side = a < -90 ? -1 : 1, ar = a * Math.PI / 180;
    const root_ = [HC[0] + Math.cos(ar) * HR * 0.84, HC[1] + Math.sin(ar) * HR * 0.84];
    const at_ = (a + side * 62) * Math.PI / 180, ac = (a + side * 30) * Math.PI / 180;
    const flatTip = [HC[0] + Math.cos(at_) * HR * 1.1, HC[1] + Math.sin(at_) * HR * 1.1];
    const flatC = [HC[0] + Math.cos(ac) * HR * 1.32, HC[1] + Math.sin(ac) * HR * 1.32];
    const as = (a + (a + 90) * 0.42) * Math.PI / 180;
    const upTip = [HC[0] + Math.cos(as) * HR * 2.15, HC[1] + Math.sin(as) * HR * 2.15];
    const upC = [HC[0] + Math.cos(ar) * HR * 1.5 + (i % 2 ? 1.2 : -1.2), HC[1] + Math.sin(ar) * HR * 1.5];
    const el = E('path', { fill: 'none', stroke: HAIR, 'stroke-width': 2.3, 'stroke-linecap': 'round' }, headG);
    strands.push({ el, root: root_, flatTip, flatC, upTip, upC, ph: i * 0.7 });
  }
  const strandAt = (s, u, f, t) => {   // point at fraction f along strand s for rise u (local units)
    const w = Math.sin(t * 3.1 + s.ph) * 0.9 * u * calm;
    const c = [lerp(s.flatC[0], s.upC[0], u) + w, lerp(s.flatC[1], s.upC[1], u)], tp = [lerp(s.flatTip[0], s.upTip[0], u) + w * 1.6, lerp(s.flatTip[1], s.upTip[1], u)];
    const q = 1 - f;
    return { c, tp, p: [q * q * s.root[0] + 2 * q * f * c[0] + f * f * tp[0], q * q * s.root[1] + 2 * q * f * c[1] + f * f * tp[1]] };
  };
  const hairPlus = G(V2), HP = [];
  [1, 2, 3, 4, 5, 6, 7, 8, 9].forEach(i => { const a = (-150 + (i - 1) * 15) * Math.PI / 180; HP.push({ s: strands[i], g: plusT(hairPlus, 11), fx: HC[0] + Math.cos(a) * HR * 1.2, fy: HC[1] + Math.sin(a) * HR * 1.2 }); });
  const hairRepel = G(V2), HRm = [1, 3, 5, 7].map(() => repelMark(hairRepel, 16));
  // the balloon that is rubbed
  const b2 = G(V2);
  balloon(b2, 96, 116);
  const B2R = [96, 116];
  const B2E = [[-58, 64], [-80, 20], [-34, 88], [-70, 52], [-46, 32], [-90, -16], [-14, 70], [-60, -40]].map(([x, y], k) => ({ x, y, g: electron(V2, 11), k }));
  const H_EM = [-48, -30, -58, -36, -44, -24, -52, -40];      // contact angles (deg) where each electron leaves the hair
  // labels
  const rubChip = chip(V2, 'two insulators', { size: 28, fill: 'rgba(86,214,155,0.14)', stroke: C.good, sw: 2.5, color: C.good }); tr(rubChip, 1010, 150);
  const lbBal = labelLine(V2, 712, 196, 640, 226, 'balloon', { anchor: 'start', size: 28 });
  const lbHair = labelLine(V2, 236, 236, 326, 300, 'hair', { anchor: 'end', size: 28 });
  const rubArc = G(V2);
  E('path', { d: 'M-34,-12 Q0,-30 34,-12', fill: 'none', stroke: C.energyLt, 'stroke-width': 5, 'stroke-linecap': 'round' }, rubArc);
  E('path', { d: 'M-34,-12 l2,-13 M-34,-12 l12,5 M34,-12 l-2,-13 M34,-12 l-12,5', fill: 'none', stroke: C.energyLt, 'stroke-width': 5, 'stroke-linecap': 'round' }, rubArc);
  const rubLab = G(V2);
  rich(rubLab, 870, 520, [['friction', C.energy, 800], ' moves'], { size: 34 });
  rich(rubLab, 870, 564, [['electrons', C.water, 800]], { size: 34 });
  const legend = G(V2); tr(legend, 885, 640);
  electron(legend, 13);
  T(legend, 26, 10, '= electron (negative)', { size: 26, weight: 600, fill: C.muted });
  const gainB = G(V2);
  rich(gainB, 940, 262, [['gains', C.water, 800], ' electrons:'], { size: 30 });
  T(gainB, 940, 304, 'negative', { size: 34, weight: 800, fill: C.water });
  const gainH = G(V2);
  rich(gainH, 60, 196, [['loses', C.bad, 800], ' electrons:'], { size: 30 });
  T(gainH, 60, 238, 'positive', { size: 34, weight: 800, fill: C.bad });
  E('line', { x1: 250, y1: 248, x2: 304, y2: 286, stroke: C.muted, 'stroke-width': 2.5 }, gainH);
  E('circle', { cx: 304, cy: 286, r: 4.5, fill: C.muted }, gainH);
  const onlyChip = chip(V2, 'only the electrons move', { size: 28, fill: C.card2, stroke: C.water, sw: 2.5 }); tr(onlyChip, 900, 650);
  const hairLab = G(V2);
  rich(hairLab, 760, 250, ['every strand: ', ['+', C.bad, 800]], { size: 34 });
  rich(hairLab, 760, 300, [['same charge', C.ink, 700]], { size: 34 });
  const hairChip = chip(V2, 'like charges repel', { size: 30, fill: 'rgba(255,96,112,0.14)', stroke: C.bad, sw: 2.5, color: '#FF9AA5' }); tr(hairChip, 900, 650);

  /* =================== 3. rule: hanging balloons =================== */
  const V3 = G(root);
  const ruleChip = chip(V3, 'the same rule as magnetic poles', { size: 28, fill: C.card2, stroke: C.line, sw: 2 }); tr(ruleChip, 600, 140);
  E('rect', { x: 120, y: 206, width: 960, height: 12, rx: 6, fill: linGrad('#B98A5E', '#7A5534', true), stroke: '#D9B48A', 'stroke-width': 2 }, V3);
  const BAR = 212, THR = 150, HB = [64, 78];
  const hangs = [
    { px: 230, neg: true }, { px: 420, neg: true }, { px: 790, neg: true }, { px: 980, neg: false },
  ].map(h => {
    h.thread = E('line', { x1: h.px, y1: BAR, x2: h.px, y2: BAR + THR, stroke: '#C9D6DE', 'stroke-width': 2.5 }, V3);
    h.g = G(V3);
    balloon(h.g, HB[0], HB[1], { hang: true });
    [[-26, 6], [22, -12], [4, 36]].forEach(([x, y]) => { const c = h.neg ? electron(h.g, 11) : plusT(h.g, 11); tr(c, x, y); });
    E('circle', { cx: h.px, cy: BAR, r: 5, fill: '#D9B48A' }, V3);
    return h;
  });
  const ruleArrows = [
    mover(V3, 48, { color: C.bad, width: 6 }), mover(V3, 48, { color: C.bad, width: 6 }),
    mover(V3, 50, { color: C.good, width: 6 }), mover(V3, 50, { color: C.good, width: 6 }),
  ];
  const ruleL = rich(V3, 325, 652, ['like charges ', ['repel', C.bad, 800]], { size: 34, anchor: 'middle' });
  const ruleR = rich(V3, 885, 652, ['unlike charges ', ['attract', C.good, 800]], { size: 34, anchor: 'middle' });

  /* =================== 4. neutral + induction =================== */
  const V4 = G(root);
  const small = G(V4);                                  // paper, wall and balloon (zooms away)
  E('rect', { x: 110, y: 560, width: 540, height: 16, rx: 4, fill: '#8A5A3B', stroke: '#B07A55', 'stroke-width': 2 }, small);
  E('path', { d: 'M150,576 V706 M610,576 V706', stroke: '#7A4E33', 'stroke-width': 16, 'stroke-linecap': 'round' }, small);
  const WALLX = 930;
  E('rect', { x: WALLX, y: 112, width: 300, height: 528, fill: '#D8CDB5' }, small);
  E('rect', { x: WALLX, y: 606, width: 300, height: 34, fill: '#B9AD95' }, small);
  E('line', { x1: WALLX, y1: 112, x2: WALLX, y2: 640, stroke: '#F1E9D6', 'stroke-width': 4 }, small);
  E('line', { x1: 60, y1: 706, x2: 1200, y2: 706, stroke: C.line, 'stroke-width': 3 }, small);
  const pr = rng(23);
  const scraps = [0, 1, 2, 3, 4, 5, 6].map(k => {
    const g = G(small), w = 22 + pr() * 10, h = 13 + pr() * 6;
    E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: 2, fill: '#F4F7FA', stroke: '#B9C6D2', 'stroke-width': 1.5 }, g);
    return { g, x0: 210 + k * 52 + (pr() - 0.5) * 14, y0: 551, r0: (pr() - 0.5) * 50, dl: pr() * 0.5 };
  });
  const SA = [[-62, 50], [-36, 76], [-8, 92], [20, 88], [46, 68], [68, 40], [-82, 16]];   // stick points on the balloon (local)
  const b4 = G(small);
  balloon(b4, 92, 110);
  [[-50, -62], [10, -88], [62, -52], [76, 8], [44, 58], [-30, 66], [-78, 2], [0, 10]].forEach(([x, y]) => tr(electron(b4, 11), x, y));
  const lbPaper = rich(V4, 380, 668, ['paper: ', ['no charge', C.muted, 700]], { size: 30, anchor: 'middle' });
  const lbWall = rich(V4, 790, 668, ['wall: ', ['no charge', C.muted, 700]], { size: 30, anchor: 'middle' });
  // zoomed view of the wall surface beside the balloon
  const zoom = G(V4);
  const ZX0 = 80, ZY0 = 118, ZW = 1040, ZH = 430;
  const zClip = 'meStaticZoom';
  const cp = E('clipPath', { id: zClip }, defs()); E('rect', { x: ZX0, y: ZY0, width: ZW, height: ZH, rx: 24 }, cp);
  const zIn = G(zoom, { 'clip-path': `url(#${zClip})` });
  E('rect', { x: ZX0, y: ZY0, width: ZW, height: ZH, fill: '#E2D7BF' }, zIn);
  E('circle', { cx: -420, cy: 333, r: 680, fill: '#8E66D9', stroke: BALLT, 'stroke-width': 6 }, zIn);
  E('circle', { cx: -420, cy: 333, r: 640, fill: '#9A73E6', opacity: 0.6 }, zIn);
  [176, 262, 340, 418, 500].forEach((y, k) => tr(electron(zIn, 17), 222 - Math.abs(y - 333) * 0.09 - (k % 2) * 4, y));
  T(zIn, 112, 530, 'balloon', { size: 26, weight: 700, fill: '#EFE6FF' });
  T(zIn, 1092, 530, 'wall', { size: 26, weight: 700, fill: '#6F6450', anchor: 'end' });
  E('rect', { x: ZX0, y: ZY0, width: ZW, height: ZH, rx: 24, fill: 'none', stroke: C.muted, 'stroke-width': 4 }, zoom);
  const zr = rng(37), regions = [];
  [470, 710, 950].forEach(cx => [200, 333, 466].forEach(cy => {
    E('ellipse', { cx, cy, rx: 86, ry: 50, fill: '#EFE7D4', stroke: '#B8A985', 'stroke-width': 2.5 }, zIn);
    const ang = zr() * TAU;
    regions.push({ cx, cy, ang, p: sign(zIn, true, 14, 7), m: sign(zIn, false, 14, 7), d: zr() * 0.4 });
  }));
  const pullG = G(zoom), pushG = G(zoom);
  arrow(pullG, 640, 604, 300, 604, { color: C.good, width: 14 });
  rich(pullG, 470, 672, [['near side', C.good, 800], ': strong pull'], { size: 30, anchor: 'middle' });
  arrow(pushG, 840, 604, 930, 604, { color: C.bad, width: 6 });
  rich(pushG, 930, 672, [['far side', C.bad, 800], ': weak push'], { size: 30, anchor: 'middle' });
  const indChip = chip(zoom, 'induction', { size: 36, fill: C.energy, color: C.bg0 }); tr(indChip, 960, ZY0);

  /* =================== 5. earthing =================== */
  const V5 = G(root);
  const eChip = chip(V5, 'earthing removes charge', { size: 30, fill: C.card2, stroke: C.line, sw: 2 }); tr(eChip, 600, 140);
  const ER = 76;
  function station(cx, wireX) {
    const g = G(V5);
    E('rect', { x: cx - 9, y: 300 + ER - 6, width: 18, height: 190, rx: 5, fill: ball(C.good, '#2A8C5F'), stroke: '#A8F0CD', 'stroke-width': 2 }, g);
    E('rect', { x: cx - 66, y: 566, width: 132, height: 20, rx: 6, fill: '#55687A', stroke: '#8DA2B3', 'stroke-width': 2 }, g);
    const side = wireX > cx ? 1 : -1, wx0 = cx + side * ER;
    const path = [[wx0, 300], [wireX, 300], [wireX, 600]];
    E('path', { d: `M${wx0},300 L${wireX},300 L${wireX},600`, fill: 'none', stroke: COPPER, 'stroke-width': 6, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, g);
    tr(earthSym(g, COPPER), wireX, 606);
    E('circle', { cx, cy: 300, r: ER, fill: ball(METAL, METALDK), stroke: '#EEF4F7', 'stroke-width': 3 }, g);
    const tk = G(g); tick(tk, 14); tr(tk, cx - 58, 186);
    const nt = T(g, cx - 34, 198, 'neutral', { size: 30, weight: 700, fill: C.good });
    return { g, cx, path, tk, nt };
  }
  const stL = station(330, 470), stR = station(870, 730);
  const EA = [0, 1, 2, 3, 4, 5, 6, 7].map(k => { const a = (k * 45 - 90) * Math.PI / 180; return [Math.cos(a) * ER * 0.66, Math.sin(a) * ER * 0.66]; });
  const eLeft = EA.map(() => electron(V5, 11));
  const eRightP = EA.map(() => plusT(V5, 11));
  const eRightE = EA.map(() => electron(V5, 11));
  const lbAway = rich(V5, 330, 668, ['electrons flow ', ['away', C.water, 800]], { size: 30, anchor: 'middle' });
  const lbIn = rich(V5, 870, 668, ['electrons flow ', ['in', C.water, 800]], { size: 30, anchor: 'middle' });
  const lbCond = G(V5);
  T(lbCond, 600, 420, 'conductor', { size: 28, weight: 600, anchor: 'middle' });
  E('path', { d: 'M532,412 L476,412 M668,412 L724,412', stroke: C.muted, 'stroke-width': 2.5 }, lbCond);
  E('circle', { cx: 476, cy: 412, r: 4.5, fill: C.muted }, lbCond); E('circle', { cx: 724, cy: 412, r: 4.5, fill: C.muted }, lbCond);
  const lbEarth = G(V5);
  T(lbEarth, 600, 626, 'earth', { size: 28, weight: 600, anchor: 'middle' });
  E('path', { d: 'M560,618 L506,612 M640,618 L694,612', stroke: C.muted, 'stroke-width': 2.5 }, lbEarth);

  /* =================== 6. lightning (showpiece) =================== */
  const V6 = G(root);
  E('rect', { x: 0, y: 612, width: 1200, height: 138, fill: linGrad('#24533F', '#12301F', true) }, V6);
  E('path', { d: 'M0,614 C150,600 300,622 450,610 C600,598 750,620 900,608 C1020,600 1120,614 1200,606', fill: 'none', stroke: '#4F9A6F', 'stroke-width': 5 }, V6);
  const cloudPts = [[150, 250], [168, 196], [228, 168], [292, 182], [334, 140], [418, 128], [486, 152], [540, 132], [622, 150], [676, 196], [700, 252], [640, 296], [520, 304], [400, 300], [270, 304], [180, 292]];
  E('path', { d: closedPath(cloudPts), fill: linGrad('#7D8E9D', '#3A4855', true), stroke: '#8FA1B1', 'stroke-width': 4 }, V6);
  const cloudNeg = [210, 280, 350, 420, 490, 560, 630].map((x, k) => ({ x, y: 274 + (k % 2) * 8, el: sign(V6, false, 14, 7) }));
  const groundPos = [120, 210, 300, 390, 480, 570, 660, 750].map((x, k) => ({ x, y: 650 + (k % 2) * 10, el: sign(V6, true, 13, 6.5) }));
  const boltHalo = E('ellipse', { cx: 432, cy: 456, rx: 170, ry: 250, fill: glow(C.energyLt) }, V6);
  const boltG = G(V6); bolt(boltG, 1, '#FFFBE0');
  const flash = E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#FFFFFF' }, V6);
  const hot = G(V6);
  const sunI = sun(hot, 20); tr(sunI, 690, 368);
  const boltI = G(hot); bolt(boltI, 0.42, '#FFFBE0'); tr(boltI, 690, 462);
  const U = 82;
  E('rect', { x: 730, y: 352, width: 5 * U, height: 32, rx: 8, fill: '#0B2230', stroke: C.line, 'stroke-width': 2 }, hot);
  const sunBar = E('rect', { x: 730, y: 352, width: U, height: 32, rx: 8, fill: '#FFD24A' }, hot);
  E('rect', { x: 730, y: 446, width: 5 * U, height: 32, rx: 8, fill: '#0B2230', stroke: C.line, 'stroke-width': 2 }, hot);
  const boltBar = E('rect', { x: 730, y: 446, width: 0, height: 32, rx: 8, fill: C.energyLt }, hot);
  const divs = G(hot);
  for (let k = 1; k < 5; k++) E('line', { x1: 730 + k * U, y1: 446, x2: 730 + k * U, y2: 478, stroke: '#3A4A20', 'stroke-width': 3 }, divs);
  T(hot, 730, 336, "Sun's surface", { size: 28, weight: 600 });
  T(hot, 730, 430, 'lightning', { size: 28, weight: 700, fill: C.energyLt });
  const x5 = T(hot, 1140, 432, '× 5', { size: 34, weight: 800, fill: C.energy, anchor: 'end' });
  const hotChip = chip(V6, "about 5 × hotter than the Sun's surface", { size: 27, fill: 'rgba(10,27,39,0.8)', stroke: C.energy, sw: 2.5 }); tr(hotChip, 862, 556);
  const lbStrike = chip(V6, 'a giant static spark', { size: 28, fill: 'rgba(10,27,39,0.8)', stroke: C.line, sw: 2 }); tr(lbStrike, 935, 210);

  /* =================== 7. fuel tanker =================== */
  const V7 = G(root);
  E('rect', { x: 0, y: 600, width: 1200, height: 150, fill: '#2B3640' }, V7);
  E('path', { d: 'M40,668 H1160', stroke: '#D9C25C', 'stroke-width': 5, 'stroke-dasharray': '40 30', opacity: 0.6 }, V7);
  // aircraft (nose to the left)
  const plane = G(V7);
  E('path', { d: 'M1060,452 L1118,322 L1162,322 L1150,452 Z', fill: ball('#4CC9F0', '#1D84A6'), stroke: '#BDEBFA', 'stroke-width': 2 }, plane);
  E('line', { x1: 735, y1: 530, x2: 735, y2: 580, stroke: '#8DA2B3', 'stroke-width': 8 }, plane);
  E('line', { x1: 1015, y1: 530, x2: 1015, y2: 580, stroke: '#8DA2B3', 'stroke-width': 8 }, plane);
  E('circle', { cx: 735, cy: 584, r: 16, fill: '#1A2228', stroke: '#55687A', 'stroke-width': 4 }, plane);
  E('circle', { cx: 1015, cy: 584, r: 16, fill: '#1A2228', stroke: '#55687A', 'stroke-width': 4 }, plane);
  E('rect', { x: 660, y: 452, width: 500, height: 82, rx: 41, fill: ball('#F4F7FA', '#AFC0CC'), stroke: '#FFFFFF', 'stroke-width': 2 }, plane);
  E('path', { d: 'M686,474 L716,468 L716,488 L680,490 Z', fill: '#24435A' }, plane);
  E('path', { d: 'M752,478 H1110', stroke: '#5E7A8C', 'stroke-width': 9, 'stroke-linecap': 'round', 'stroke-dasharray': '0.1 22' }, plane);
  E('path', { d: 'M820,516 L980,516 L1040,548 L880,548 Z', fill: '#C9D6DE', stroke: '#EEF4F7', 'stroke-width': 2, 'stroke-linejoin': 'round' }, plane);
  E('rect', { x: 862, y: 540, width: 92, height: 34, rx: 17, fill: ball('#8DA2B3', '#55687A') }, plane);
  // tanker (cab left, tank right)
  const tank = G(V7);
  E('rect', { x: 112, y: 568, width: 460, height: 16, rx: 6, fill: '#3A4752' }, tank);
  E('path', { d: 'M108,586 L108,496 Q108,470 134,470 L196,470 Q214,470 220,490 L234,586 Z', fill: ball('#E8424F', '#A4232E'), stroke: '#FF9AA5', 'stroke-width': 2, 'stroke-linejoin': 'round' }, tank);
  E('path', { d: 'M126,482 L190,482 L204,524 L126,524 Z', fill: '#24435A', stroke: '#9FD8FF', 'stroke-width': 2 }, tank);
  E('rect', { x: 240, y: 452, width: 330, height: 116, rx: 50, fill: ball('#DDE6EC', '#8DA2B3'), stroke: '#FFFFFF', 'stroke-width': 2 }, tank);
  const fuelClip = 'meStaticFuel';
  const fc = E('clipPath', { id: fuelClip }, defs()); E('rect', { x: 282, y: 488, width: 250, height: 58, rx: 14 }, fc);
  E('rect', { x: 282, y: 488, width: 250, height: 58, rx: 14, fill: '#1C2A33', stroke: '#8DA2B3', 'stroke-width': 3 }, tank);
  const fuelSurf = E('path', { fill: ball('#FFC247', '#B57B12'), 'clip-path': `url(#${fuelClip})` }, tank);
  [170, 300, 500].forEach(x => E('circle', { cx: x, cy: 592, r: 22, fill: '#1A2228', stroke: '#55687A', 'stroke-width': 5 }, tank));
  const lbFuel = T(V7, 405, 708, 'fuel tanker', { size: 28, weight: 600, anchor: 'middle', fill: C.muted });
  const lbPlane = T(V7, 960, 708, 'aircraft', { size: 28, weight: 600, anchor: 'middle', fill: C.muted });
  // charge on the tank, the earthing cable, the hose
  const tankE = [[300, 470], [372, 466], [444, 466], [516, 470], [552, 520]].map(() => electron(V7, 12));
  const TE0 = [[300, 470], [372, 466], [444, 466], [516, 470], [552, 520]];
  const earthPt = [640, 612];
  tr(earthSym(V7, C.good), earthPt[0], earthPt[1] + 4);
  const cableD = 'M560,548 C600,548 628,560 640,606';
  const cablePts = [[560, 548], [600, 551], [626, 566], [640, 606]];
  const cable = E('path', { d: cableD, fill: 'none', stroke: C.good, 'stroke-width': 7, 'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': '1 1' }, V7);
  const clipJ = E('rect', { x: 630, y: 596, width: 20, height: 16, rx: 4, fill: '#A8F0CD', stroke: '#2A8C5F', 'stroke-width': 2 }, V7);
  const hoseD = 'M572,520 C660,600 820,610 900,575';
  const hoseBack = E('path', { d: hoseD, fill: 'none', stroke: '#0E161C', 'stroke-width': 17, 'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': '1 1' }, V7);
  const hose = E('path', { d: hoseD, fill: 'none', stroke: '#7D93A2', 'stroke-width': 11, 'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': '1 1' }, V7);
  const flow = E('path', { d: hoseD, fill: 'none', stroke: '#FFC247', 'stroke-width': 5, 'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': '0.03 0.05' }, V7);
  const fSpark = spark(V7, 24); tr(fSpark, 630, 470);
  const fRing = E('circle', { cx: 630, cy: 470, r: 46, fill: 'none', stroke: C.bad, 'stroke-width': 4 }, V7);
  const fCross = cross(V7, 26); tr(fCross, 630, 470);
  const fChip1 = chip(V7, 'a spark could ignite the fuel', { size: 28, fill: 'rgba(255,96,112,0.14)', stroke: C.bad, sw: 2.5 }); tr(fChip1, 600, 150);
  const fChip2 = chip(V7, 'earthed first, then refuel', { size: 28, fill: 'rgba(86,214,155,0.14)', stroke: C.good, sw: 2.5 }); tr(fChip2, 600, 150);
  const fTick = tick(V7, 15); tr(fTick, 600 + fChip2.w / 2 + 34, 150);
  const lbCable = labelLine(V7, 672, 652, 616, 580, 'earthing cable', { anchor: 'start', size: 28, fill: C.good });

  /* =================== 8. laser printer =================== */
  const V8 = G(root);
  E('rect', { x: 236, y: 150, width: 728, height: 340, rx: 34, fill: ball('#C9D3DB', '#8899A6'), stroke: '#E6EDF2', 'stroke-width': 3 }, V8);
  E('rect', { x: 276, y: 196, width: 648, height: 264, rx: 20, fill: '#2E4655', stroke: '#5E7A8C', 'stroke-width': 3 }, V8);
  const prChip = chip(V8, 'photocopiers and laser printers', { size: 26, fill: C.card2, stroke: C.line, sw: 2 }); tr(prChip, 600, 150);
  // toner hopper
  E('path', { d: 'M440,214 L760,214 L742,262 L458,262 Z', fill: '#1C252C', stroke: '#8DA2B3', 'stroke-width': 3, 'stroke-linejoin': 'round' }, V8);
  E('path', { d: 'M462,248 Q520,232 600,240 Q680,232 738,248 L732,258 L466,258 Z', fill: '#05080A' }, V8);
  // the drum: a cylinder seen from the front
  const dg = 'meStaticDrum';
  const lgd = E('linearGradient', { id: dg, x1: 0, y1: 0, x2: 0, y2: 1 }, defs());
  [['0', '#2F7A52'], ['0.35', '#7FE0A8'], ['0.55', '#56C487'], ['1', '#123C26']].forEach(([o, c]) => E('stop', { offset: o, 'stop-color': c }, lgd));
  const DCX = 600, DCY = 372, DR = 76, DX0 = 344, DX1 = 856;
  E('rect', { x: DX0, y: DCY - DR, width: DX1 - DX0, height: 2 * DR, rx: 14, fill: `url(#${dg})`, stroke: '#A8F0CD', 'stroke-width': 2 }, V8);
  const drumLines = [0, 1, 2, 3].map(() => E('line', { x1: DX0 + 6, x2: DX1 - 6, y1: 0, y2: 0, stroke: '#0E2E1D', 'stroke-width': 2, opacity: 0.5 }, V8));
  E('ellipse', { cx: DX0, cy: DCY, rx: 12, ry: DR, fill: '#1E5A3A', stroke: '#A8F0CD', 'stroke-width': 2 }, V8);
  E('ellipse', { cx: DX1, cy: DCY, rx: 12, ry: DR, fill: '#1E5A3A', stroke: '#A8F0CD', 'stroke-width': 2 }, V8);
  // the letter shape "Hi" (blocks in letter units, 0..132 x 0..80)
  const LET = [[0, 0, 22, 80], [60, 0, 22, 80], [0, 30, 82, 20], [108, 26, 22, 54], [108, 0, 22, 18]];
  const LW = 130, LH = 80;
  const drumLet = G(V8), drumLetIn = G(drumLet);
  const letCharged = LET.map(([x, y, w, h]) => E('rect', { x: x - LW / 2, y: y - LH / 2, width: w, height: h, rx: 4, fill: 'rgba(255,96,112,0.28)', stroke: C.bad, 'stroke-width': 3, 'stroke-dasharray': '6 4' }, drumLetIn));
  const letBlack = LET.map(([x, y, w, h]) => E('rect', { x: x - LW / 2, y: y - LH / 2, width: w, height: h, rx: 4, fill: '#0A0D10', stroke: '#2B3640', 'stroke-width': 2 }, drumLetIn));
  const letPlus = [[11, 14], [11, 64], [71, 14], [71, 64], [41, 40], [119, 52]].map(([x, y]) => { const s = sign(drumLetIn, true, 6, 3.5); tr(s, x - LW / 2, y - LH / 2); return s; });
  const tr_ = rng(51), toner = [];
  for (let k = 0; k < 16; k++) {
    const blk = LET[k % LET.length];
    toner.push({ el: E('circle', { r: 5.5, fill: '#0A0D10', stroke: '#5E7A8C', 'stroke-width': 1.2 }, V8), sx: 480 + tr_() * 240, tx: blk[0] + 4 + tr_() * (blk[2] - 8) - LW / 2, ty: blk[1] + 4 + tr_() * (blk[3] - 8) - LH / 2, dl: tr_() });
  }
  // paper coming out under the drum
  const papClip = 'meStaticPaper';
  const ppc = E('clipPath', { id: papClip }, defs()); E('rect', { x: 400, y: DCY + DR - 2, width: 400, height: 300 }, ppc);
  const papG = G(V8, { 'clip-path': `url(#${papClip})` });
  const paper = E('rect', { x: 430, y: DCY + DR - 10, width: 340, height: 0, fill: '#F4F7FA', stroke: '#C9D6DE', 'stroke-width': 2 }, papG);
  const papLet = G(papG);
  LET.forEach(([x, y, w, h]) => E('rect', { x: x - LW / 2, y: y - LH / 2, width: w, height: h, rx: 4, fill: '#0A0D10' }, papLet));
  const lbDrum = labelLine(V8, 1000, 384, 862, 380, 'charged drum', { anchor: 'start', size: 28 });
  const lbToner = labelLine(V8, 1000, 246, 766, 238, 'toner powder', { anchor: 'start', size: 28 });
  const lbPage = labelLine(V8, 1000, 610, 772, 600, 'onto the page', { anchor: 'start', size: 28 });

  /* =================== 9. shock at the door handle =================== */
  const V9 = G(root);
  E('line', { x1: 40, y1: 642, x2: 1160, y2: 642, stroke: C.line, 'stroke-width': 4 }, V9);
  E('rect', { x: 60, y: 630, width: 800, height: 14, rx: 4, fill: '#9C4A3B', stroke: '#C77A62', 'stroke-width': 2 }, V9);
  E('path', { d: 'M70,637 H850', stroke: '#E0A27F', 'stroke-width': 4, 'stroke-dasharray': '6 10', opacity: 0.7 }, V9);
  T(V9, 460, 690, 'carpet', { size: 26, weight: 600, fill: C.muted, anchor: 'middle' });
  E('rect', { x: 920, y: 170, width: 210, height: 472, rx: 6, fill: linGrad('#A9734E', '#7A4C2E'), stroke: '#D9A77F', 'stroke-width': 3 }, V9);
  E('rect', { x: 950, y: 206, width: 150, height: 160, rx: 6, fill: 'none', stroke: '#C98F66', 'stroke-width': 3 }, V9);
  E('rect', { x: 950, y: 430, width: 150, height: 170, rx: 6, fill: 'none', stroke: '#C98F66', 'stroke-width': 3 }, V9);
  const HX = 946, HY = 406;
  E('circle', { cx: HX + 12, cy: HY, r: 14, fill: ball(METAL, METALDK), stroke: '#EEF4F7', 'stroke-width': 2 }, V9);
  E('rect', { x: HX - 34, y: HY - 7, width: 50, height: 14, rx: 7, fill: ball(METAL, METALDK), stroke: '#EEF4F7', 'stroke-width': 2 }, V9);
  const lbHandle = labelLine(V9, 1000, 482, 950, 414, 'metal', { anchor: 'start', size: 26, fill: C.muted });
  const WS = 2.0, WY = 640;
  const walker = person(V9, { shirt: '#FF8A3D', shorts: '#3A4F66', hair: '#3B2A1E' });
  const wTok = G(V9);
  const WTL = [[-6, -138], [8, -122], [-8, -108], [6, -98], [-4, -70], [8, -48]];
  const wE = WTL.map(() => electron(wTok, 10));
  const qHandle = T(V9, 0, 0, '?', { size: 60, weight: 700, fill: C.energy, anchor: 'middle' });
  const zapSpark = spark(V9, 22); tr(zapSpark, HX - 52, HY);
  const zapTxt = T(V9, HX - 70, HY - 70, 'zap!', { size: 58, weight: 700, fill: C.energy, anchor: 'middle' });
  const sChip1 = chip(V9, 'walking on carpet charges you up', { size: 28, fill: C.card2, stroke: C.line, sw: 2 }); tr(sChip1, 600, 140);
  const sChip2 = chip(V9, 'the charge jumps to the metal', { size: 28, fill: 'rgba(255,228,92,0.12)', stroke: C.energy, sw: 2.5 }); tr(sChip2, 600, 140);

  /* =================== update =================== */
  return t => {
    const tR = at('rub'), tG = at('gain'), tRu = at('rule'), tH = at('hair'), tN = at('neutral'), tI = at('induction');
    const tE = at('earthing'), tL = at('lightning'), tF = at('fuel'), tU = at('useful'), tS = at('shock');

    /* ---- 1. what ---- */
    const a1 = Math.min(P(t, S.first - 0.4, 0.4, linear), 1 - P(t, tR - 0.25, 0.45, linear));
    op(V1, a1);
    if (a1 > 0) {
      const bp = popIn(t, at('what') + 0.05, 0.7);
      tr(b1, 800, 300 + (1 - clamp(bp)) * 40 + 6 * Math.sin(t * 1.4) * calm, Math.max(0.01, 0.7 + 0.3 * bp), 3 * Math.sin(t * 0.9) * calm);
      op(b1, clamp(bp * 2));
      B1E.forEach((o, k) => {
        const p = popIn(t, k < 3 ? mid('what', 0.06 + k * 0.04) : mid('what', 0.34 + (k - 3) * 0.055), 0.4);
        tr(o.e, o.x + Math.sin(t * 5 + k) * 1.2 * calm, o.y + Math.cos(t * 4 + k) * 1.2 * calm, Math.max(0.01, p));
        op(o.e, clamp(p * 2));
      });
      op(b1Lab, fade(t, mid('what', 0.3)));
      const lp = fade(t, mid('what', 0.7), 0.5);
      op(loop, lp); op(lLab, fade(t, mid('what', 0.76)));
      lw.upd(t, 60);
    }

    /* ---- 2. person: rub, gain (then hair) ---- */
    const a2 = Math.max(Math.min(fade(t, tR - 0.2, 0.45), 1 - fade(t, tRu - 0.25, 0.45)), Math.min(fade(t, tH - 0.25, 0.45), 1 - fade(t, tN - 0.25, 0.45)));
    op(V2, a2);
    if (a2 > 0) {
      const inHair = t > tRu;
      const slide = inHair ? 1 : P(t, tR - 0.2, 0.8, easeOut);
      const dy = (1 - slide) * 90;
      tr(headG, PX, PY + dy, PS);
      // balloon: in, rub back and forth on the hair, then pulled away
      const goIn = P(t, mid('rub', 0.04), 0.9), away = P(t, tG - 0.15, 0.9);
      const rubbing = clamp((t - mid('rub', 0.14)) / 0.3) * (1 - P(t, end('rub') + 0.1, 0.3, linear));
      const phi = -40 + 22 * Math.sin((t - mid('rub', 0.14)) * TAU / 0.8) * rubbing;
      const D = HRS * 1.22 + 96, pr_ = phi * Math.PI / 180;
      const cx = HEAD[0] + Math.cos(pr_) * D, cy = HEAD[1] + dy + Math.sin(pr_) * D;
      let bx = lerp(800, cx, goIn), by = lerp(300, cy, goIn), brot = lerp(0, (phi + 40) * 0.6 - 18, goIn);
      bx = lerp(bx, 812, away); by = lerp(by, 300, away); brot = lerp(brot, 0, away);
      tr(b2, bx, by, 1, brot);
      op(b2, inHair ? 0 : 1);
      // electrons hop from the hair onto the balloon
      B2E.forEach((o, k) => {
        const t0 = mid('rub', 0.44 + k * 0.064), u = clamp((t - t0) / 0.5);
        const [lx, ly] = rot(o.x, o.y, brot), dest = [bx + lx, by + ly];
        const ea = H_EM[k] * Math.PI / 180, src = [HEAD[0] + Math.cos(ea) * HRS * 1.12, HEAD[1] + dy + Math.sin(ea) * HRS * 1.12];
        if (inHair || t < t0 - 0.25) { op(o.g, 0); return; }
        const p = ease(u), arc = Math.sin(p * Math.PI) * 26;
        const x = lerp(src[0], dest[0], p), y = lerp(src[1], dest[1], p) - arc;
        tr(o.g, x, y, 1 + (k < 8 ? 0.25 * Math.sin(Math.PI * P(t, mid('gain', 0.06), 0.5, linear)) : 0));
        op(o.g, Math.min(1, (t - (t0 - 0.25)) / 0.25));
      });
      // hair: flat, then (in the hair line) standing and fanned
      const rise = inHair ? P(t, mid('hair', 0.08), 1.6, easeOut) : 0;
      strands.forEach(s => { const q = strandAt(s, rise, 1, t); s.el.setAttribute('d', `M${s.root[0].toFixed(2)},${s.root[1].toFixed(2)} Q${q.c[0].toFixed(2)},${q.c[1].toFixed(2)} ${q.tp[0].toFixed(2)},${q.tp[1].toFixed(2)}`); });
      const showPlus = inHair ? 1 : fade(t, mid('gain', 0.42), 0.3);
      op(hairPlus, showPlus);
      if (showPlus > 0) HP.forEach((h, k) => {
        const q = strandAt(h.s, rise, 0.9, t), [x, y] = toStage(lerp(h.fx, q.p[0], rise), lerp(h.fy, q.p[1], rise));
        const pp = inHair ? 1 : popIn(t, mid('gain', 0.42 + k * 0.025), 0.4);
        tr(h.g, x, y + dy, Math.max(0.01, pp)); op(h.g, clamp(pp * 2));
      });
      const rp = inHair ? fade(t, mid('hair', 0.66), 0.4) : 0;
      op(hairRepel, rp);
      if (rp > 0) HRm.forEach((m, k) => {
        const i = 1 + k * 2, A = strandAt(strands[i], rise, 1, t).tp, B = strandAt(strands[i + 1], rise, 1, t).tp;
        const [ax, ay] = toStage(A[0], A[1]), [bx2, by2] = toStage(B[0], B[1]);
        const ang = Math.atan2(by2 - ay, bx2 - ax) * 180 / Math.PI;
        tr(m, (ax + bx2) / 2, (ay + by2) / 2 - 18, 1 + 0.12 * wave(t, 0.8), ang);
      });
      op(smile, inHair ? 1 - fade(t, mid('hair', 0.2), 0.3) : 1); op(ohh, inHair ? fade(t, mid('hair', 0.2), 0.3) : 0);
      // labels
      const rl = inHair ? 0 : 1 - fade(t, tG - 0.2, 0.35);
      op(rubChip, rl * fade(t, mid('rub', 0.06)));
      lbBal.set(rl * fade(t, mid('rub', 0.12))); lbHair.set(rl * fade(t, mid('rub', 0.16)));
      const ra = rubbing * (inHair ? 0 : 1);
      op(rubArc, ra);
      if (ra > 0) tr(rubArc, bx + 20, by - B2R[1] - 30, 1, brot * 0.5);
      op(rubLab, rl * fade(t, mid('rub', 0.5)));
      op(legend, rl * fade(t, mid('rub', 0.6)));
      const gl = inHair ? 0 : 1;
      op(gainB, gl * fade(t, mid('gain', 0.06)));
      op(gainH, gl * fade(t, mid('gain', 0.45)));
      op(onlyChip, gl * fade(t, mid('gain', 0.76)));
      tr(onlyChip, 900, 650 + (1 - P(t, mid('gain', 0.76), 0.5, easeOut)) * 14);
      op(hairLab, inHair ? fade(t, mid('hair', 0.4)) : 0);
      op(hairChip, inHair ? fade(t, mid('hair', 0.76)) : 0);
      tr(hairChip, 900, 650 + (inHair ? 1 - P(t, mid('hair', 0.76), 0.5, easeOut) : 1) * 14);
    }

    /* ---- 3. rule ---- */
    const a3 = vis(t, tRu - 0.25, tH + 0.2);
    op(V3, a3);
    if (a3 > 0) {
      const ap = fade(t, tRu - 0.1, 0.5);
      op(ruleChip, ap);
      const rep = P(t, mid('rule', 0.46), 0.8, easeOut), att = P(t, mid('rule', 0.74), 0.7, easeOut);
      const sway = Math.sin(t * 1.7) * 0.8 * calm;
      const ang = [14 * rep + sway, -14 * rep + sway, -7.8 * att + sway * 0.5, 7.8 * att + sway * 0.5];
      const Lh = THR + 12 + HB[1];
      hangs.forEach((h, k) => {
        const a = ang[k] * Math.PI / 180;
        const kx = h.px - Math.sin(a) * THR, ky = BAR + Math.cos(a) * THR;
        attr(h.thread, 'x2', kx); attr(h.thread, 'y2', ky);
        tr(h.g, h.px - Math.sin(a) * Lh, BAR + Math.cos(a) * Lh, 1, ang[k]);
        h.cx = h.px - Math.sin(a) * Lh; h.cy = BAR + Math.cos(a) * Lh;
      });
      const rA = fade(t, mid('rule', 0.5), 0.3), gA = fade(t, mid('rule', 0.78), 0.3);
      tr(ruleArrows[0], hangs[0].cx - HB[0] - 14, hangs[0].cy, 1, 180); op(ruleArrows[0], rA);
      tr(ruleArrows[1], hangs[1].cx + HB[0] + 14, hangs[1].cy, 1, 0); op(ruleArrows[1], rA);
      tr(ruleArrows[2], hangs[2].cx - HB[0] - 64, hangs[2].cy, 1, 0); op(ruleArrows[2], gA);
      tr(ruleArrows[3], hangs[3].cx + HB[0] + 64, hangs[3].cy, 1, 180); op(ruleArrows[3], gA);
      op(ruleL, fade(t, mid('rule', 0.48))); op(ruleR, fade(t, mid('rule', 0.76)));
    }

    /* ---- 4. neutral + induction ---- */
    const a4 = vis(t, tN - 0.25, tE + 0.2);
    op(V4, a4);
    if (a4 > 0) {
      const zp = P(t, tI - 0.3, 1.0, easeIn);
      const sa = 1 - P(t, tI + 0.15, 0.5, linear);
      op(small, sa);
      if (sa > 0) {
        const zs = 1 + 5 * zp, fx = WALLX, fy = 300;
        small.setAttribute('transform', `translate(${fx} ${fy}) scale(${zs.toFixed(3)}) translate(${-fx} ${-fy})`);
        const dn = P(t, mid('neutral', 0.02), 0.9), mv = P(t, mid('neutral', 0.7), 1.0);
        const bx = lerp(380, WALLX - 90, mv), by = lerp(lerp(214, 352, dn), 318, mv) + Math.sin(t * 1.5) * 3 * calm * (1 - mv);
        tr(b4, bx, by);
        scraps.forEach((s, k) => {
          const t0 = mid('neutral', 0.34) + s.dl * 0.6, u = P(t, t0, 0.45, easeOut);
          const [ax, ay] = [bx + SA[k][0], by + SA[k][1]];
          const x = lerp(s.x0, ax, u), y = lerp(s.y0, ay, u) - Math.sin(u * Math.PI) * 10;
          tr(s.g, x, y, 1, lerp(s.r0, SA[k][0] * 0.5, u));
        });
      }
      op(lbPaper, fade(t, mid('neutral', 0.4)) * (1 - fade(t, tI - 0.4, 0.3)));
      op(lbWall, fade(t, mid('neutral', 0.84)) * (1 - fade(t, tI - 0.4, 0.3)));
      const za = fade(t, tI + 0.05, 0.5);
      op(zoom, za);
      if (za > 0) {
        zoom.setAttribute('transform', `translate(600 333) scale(${(0.82 + 0.18 * P(t, tI + 0.05, 0.7, easeOut)).toFixed(3)}) translate(-600 -333)`);
        regions.forEach(r => {
          const u = P(t, mid('induction', 0.06 + r.d * 0.3), 1.4);
          const half = lerp(13, 30, u), a = lerp(r.ang, Math.PI, u);
          const jx = Math.sin(t * 2.3 + r.ang * 3) * 1.4 * calm;
          tr(r.p, r.cx + Math.cos(a) * half + jx, r.cy + Math.sin(a) * half);
          tr(r.m, r.cx - Math.cos(a) * half + jx, r.cy - Math.sin(a) * half);
        });
        const pl = P(t, mid('induction', 0.44), 0.5, easeOut);
        op(pullG, pl); tr(pullG, (1 - pl) * 24, 0);
        const ps = P(t, mid('induction', 0.64), 0.5, easeOut);
        op(pushG, ps); tr(pushG, -(1 - ps) * 16, 0);
        const ip = popIn(t, mid('induction', 0.86), 0.5);
        op(indChip, clamp(ip * 2)); tr(indChip, 960, ZY0, Math.max(0.01, 0.7 + 0.3 * ip));
      }
    }

    /* ---- 5. earthing ---- */
    const a5 = vis(t, tE - 0.25, tL + 0.2);
    op(V5, a5);
    if (a5 > 0) {
      op(eChip, fade(t, tE - 0.1));
      // left: electrons stream down to earth
      eLeft.forEach((e, k) => {
        const t0 = mid('earthing', 0.12 + k * 0.045), u = clamp((t - t0) / 1.1);
        const start = [stL.cx + EA[k][0], 300 + EA[k][1]];
        if (u <= 0) { tr(e, start[0] + Math.sin(t * 4 + k) * calm, start[1]); op(e, fade(t, tE - 0.1)); return; }
        const pts = [start].concat(stL.path), p = along(pts, ease(u));
        tr(e, p[0], p[1]); op(e, 1 - P(u, 0.85, 0.15, linear));
      });
      const nL = popIn(t, mid('earthing', 0.6), 0.5); op(stL.tk, clamp(nL * 2)); op(stL.nt, clamp(nL * 2));
      // right: positive sphere, electrons flow up from earth
      eRightP.forEach((pg, k) => {
        const arrive = mid('earthing', 0.45 + k * 0.04) + 1.0;
        tr(pg, stR.cx + EA[k][0], 300 + EA[k][1]);
        op(pg, fade(t, tE - 0.1) * (1 - fade(t, arrive, 0.3)));
      });
      eRightE.forEach((e, k) => {
        const t0 = mid('earthing', 0.45 + k * 0.04), u = clamp((t - t0) / 1.0);
        if (u <= 0) { op(e, 0); return; }
        const pts = stR.path.slice().reverse().concat([[stR.cx + EA[k][0], 300 + EA[k][1]]]), p = along(pts, ease(u));
        tr(e, p[0], p[1]); op(e, Math.min(1, u * 6) * (1 - fade(t, t0 + 1.0, 0.3)));
      });
      const nR = popIn(t, mid('earthing', 0.45 + 7 * 0.04) + 1.3, 0.5); op(stR.tk, clamp(nR * 2)); op(stR.nt, clamp(nR * 2));
      op(lbAway, fade(t, mid('earthing', 0.2))); op(lbIn, fade(t, mid('earthing', 0.58)));
      op(lbCond, fade(t, mid('earthing', 0.3))); op(lbEarth, fade(t, mid('earthing', 0.34)));
    }

    /* ---- 6. lightning ---- */
    const a6 = vis(t, tL - 0.25, tF + 0.2);
    op(V6, a6);
    if (a6 > 0) {
      const tk = mid('lightning', 0.16);
      const build = fade(t, tL - 0.1, 0.6);
      cloudNeg.forEach((c, k) => { tr(c.el, c.x, c.y + Math.sin(t * 3 + k) * 1.5 * calm); op(c.el, build * (k >= 2 && k <= 4 ? 1 - fade(t, tk + 0.2, 0.4) * 0.85 : 1)); });
      groundPos.forEach((c, k) => { tr(c.el, c.x, c.y); op(c.el, build * (k >= 3 && k <= 5 ? 1 - fade(t, tk + 0.2, 0.4) * 0.85 : 1)); });
      const tk2 = mid('lightning', 0.46), since = t - tk, since2 = t - tk2;
      const grow = P(t, tk - 0.12, 0.12, easeIn);
      boltG.setAttribute('transform', `translate(432 304) scale(2.7 ${(3.05 * Math.max(0.01, grow)).toFixed(3)}) translate(0 50)`);
      const flick = s_ => (s_ < 0 ? 0 : s_ < 0.1 ? 1 : s_ < 0.18 ? 0.35 : s_ < 0.3 ? 1 : 0.82 + 0.18 * wave(t, 0.27));
      const bo = since < -0.12 ? 0 : since < 0 ? 1 : Math.min(1, since2 >= 0 && since2 < 0.3 ? flick(since2) : flick(since));
      op(boltG, bo);
      op(boltHalo, bo * 0.85);
      const fl = s_ => (s_ < 0 ? 0 : Math.max(0.78 * Math.exp(-s_ * 9), s_ > 0.18 ? 0.45 * Math.exp(-(s_ - 0.18) * 10) : 0));
      op(flash, Math.max(fl(since), 0.8 * fl(since2)));
      op(lbStrike, fade(t, tk + 0.4));
      const hp = fade(t, mid('lightning', 0.52), 0.4);
      op(hot, hp);
      if (hp > 0) {
        sunI.upd(t);
        const g5 = P(t, mid('lightning', 0.6), 1.0, easeOut);
        attr(boltBar, 'width', 5 * U * g5);
        op(divs, P(t, mid('lightning', 0.6) + 0.7, 0.3, linear)); op(x5, P(t, mid('lightning', 0.6) + 0.8, 0.3, linear));
      }
      const cp2 = P(t, mid('lightning', 0.8), 0.5, easeOut);
      op(hotChip, cp2); tr(hotChip, 862, 556 + (1 - cp2) * 14);
    }

    /* ---- 7. fuel tanker ---- */
    const a7 = vis(t, tF - 0.25, tU + 0.2);
    op(V7, a7);
    if (a7 > 0) {
      const slosh = [];
      for (let x = 282; x <= 532; x += 25) slosh.push([x, 508 + Math.sin(x * 0.03 + t * 3.2) * 6 * calm + Math.sin(t * 1.7) * 4 * calm * (x - 407) / 125]);
      fuelSurf.setAttribute('d', 'M282,560 L' + slosh.map(p => p[0] + ',' + p[1].toFixed(1)).join(' L') + ' L532,560 Z');
      const tCab = mid('fuel', 0.52), tHose = mid('fuel', 0.74);
      tankE.forEach((e, k) => {
        const p0 = popIn(t, mid('fuel', 0.04 + k * 0.05), 0.4), s0 = TE0[k];
        const t0 = tCab + 0.35 + k * 0.14, u = clamp((t - t0) / 0.8);
        if (u <= 0) { tr(e, s0[0] + Math.sin(t * 5 + k) * calm, s0[1], Math.max(0.01, p0)); op(e, clamp(p0 * 2)); return; }
        const p = along([s0].concat(cablePts), ease(u));
        tr(e, p[0], p[1]); op(e, 1 - P(u, 0.8, 0.2, linear));
      });
      const sp = win(t, mid('fuel', 0.3), tHose + 0.6, 0.3);
      op(fSpark, sp * (0.75 + 0.25 * wave(t, 0.5))); fSpark.upd(t);
      op(fRing, sp * fade(t, mid('fuel', 0.3)) * (1 - fade(t, tCab, 0.3)));
      const xp = popIn(t, tCab + 0.25, 0.4); op(fCross, clamp(xp * 2) * sp); tr(fCross, 630, 470, Math.max(0.01, xp));
      op(fChip1, win(t, mid('fuel', 0.3), tCab + 0.1, 0.3));
      cable.setAttribute('stroke-dashoffset', (1 - P(t, tCab - 0.1, 0.5)).toFixed(3));
      op(clipJ, fade(t, tCab + 0.35, 0.2));
      lbCable.set(fade(t, tCab + 0.3));
      const hd = (1 - P(t, tHose, 0.7)).toFixed(3); hose.setAttribute('stroke-dashoffset', hd); hoseBack.setAttribute('stroke-dashoffset', hd);
      const fon = fade(t, tHose + 0.6, 0.3);
      op(flow, fon); flow.setAttribute('stroke-dashoffset', (-(t * 0.25) % 1).toFixed(3));
      const c2 = fade(t, tCab + 0.15, 0.3); op(fChip2, c2);
      const tp = popIn(t, tHose + 0.7, 0.4); op(fTick, clamp(tp * 2)); tr(fTick, 600 + fChip2.w / 2 + 34, 150, Math.max(0.01, tp));
    }

    /* ---- 8. laser printer ---- */
    const a8 = vis(t, tU - 0.25, tS + 0.2);
    op(V8, a8);
    if (a8 > 0) {
      const tTon = mid('useful', 0.56), tTurn = mid('useful', 0.72);
      const spin = (t - tU) * 0.9 * calm;
      drumLines.forEach((l, k) => {
        const ph = ((k / 4 + spin * 0.25) % 1) * Math.PI - Math.PI / 2;
        attr(l, 'y1', DCY + DR * Math.sin(ph)); attr(l, 'y2', DCY + DR * Math.sin(ph)); l.style.opacity = (0.55 * Math.cos(ph)).toFixed(3);
      });
      const turn = P(t, tTurn, 1.4, linear), phi = lerp(-12, 96, turn) * Math.PI / 180;
      const ly = DCY + DR * Math.sin(phi), ls = Math.max(0.02, Math.cos(phi));
      drumLet.setAttribute('transform', `translate(${DCX} ${ly.toFixed(1)}) scale(1 ${ls.toFixed(3)})`);
      op(drumLet, fade(t, mid('useful', 0.3), 0.4) * (phi > Math.PI / 2 - 0.05 ? 0 : 1));
      const black = fade(t, tTon + 0.75, 0.4);
      letCharged.forEach(r => op(r, 1 - black)); letBlack.forEach(r => op(r, black));
      letPlus.forEach(s => op(s, 1 - black));
      toner.forEach(o => {
        const t0 = tTon + o.dl * 0.5, u = clamp((t - t0) / 0.4);
        if (u <= 0 || t > tTon + 1.3) { op(o.el, 0); return; }
        const x = lerp(o.sx, DCX + o.tx, ease(u)), y = lerp(262, DCY + DR * Math.sin(-12 * Math.PI / 180) + o.ty * Math.cos(-12 * Math.PI / 180), ease(u));
        attr(o.el, 'cx', x); attr(o.el, 'cy', y); op(o.el, Math.min(1, u * 4) * (1 - fade(t, tTon + 0.95, 0.3)));
      });
      const pl = P(t, tTurn + 0.4, 1.5, linear);
      attr(paper, 'height', 10 + 200 * pl);
      const tf = Math.max(0, pl * 200 - 70);
      tr(papLet, DCX, DCY + DR - 50 + tf);
      op(papLet, pl > 0.28 ? 1 : 0);
      lbDrum.set(fade(t, mid('useful', 0.5))); lbToner.set(fade(t, tTon - 0.1)); lbPage.set(fade(t, tTurn + 1.1));
      op(prChip, fade(t, tU - 0.1));
    }

    /* ---- 9. shock ---- */
    const a9 = P(t, tS - 0.25, 0.45, linear);
    op(V9, a9);
    if (a9 > 0) {
      const tStop = mid('shock', 0.6), tReach = mid('shock', 0.63), tZap = mid('shock', 0.8);
      const W0 = tS - 0.2, WT = tStop - W0, WX0 = 150, WX1 = 766;
      const cyc = Math.max(1, Math.round((WX1 - WX0) / 270)), spd = cyc / WT;
      const wx = lerp(WX0, WX1, clamp((t - W0) / WT));
      const reach = P(t, tReach, 0.6), settle = P(t, tStop, 0.3);
      const wp = walkPose(Math.min(t, tStop) - W0, spd);
      const stand = { lean: 0, armL: [8, 10], armR: [lerp(-8, 58, reach), lerp(10, 4, reach)], legL: [3, -3], legR: [-3, -3] };
      const mix = (a, b) => [lerp(a[0], b[0], settle), lerp(a[1], b[1], settle)];
      const pose = { lean: lerp(wp.lean, 0, settle), armL: mix(wp.armL, stand.armL), armR: settle < 1 ? mix(wp.armR, stand.armR) : stand.armR, legL: mix(wp.legL, stand.legL), legR: mix(wp.legR, stand.legR) };
      tr(walker, wx, WY, WS); walker.pose(pose);
      const a1r = pose.armR[0] * Math.PI / 180, a2r = (pose.armR[0] + pose.armR[1]) * Math.PI / 180;
      const hand = [wx + WS * (33 * Math.sin(a1r) + 33 * Math.sin(a2r)), WY + WS * (-146 + 33 * Math.cos(a1r) + 33 * Math.cos(a2r))];
      wE.forEach((e, k) => {
        const p = popIn(t, mid('shock', 0.26 + k * 0.06), 0.4);
        const run = clamp((t - (tZap - 0.35 + k * 0.03)) / 0.35);
        const home = [wx + WTL[k][0] * WS, WY + WTL[k][1] * WS];
        tr(e, lerp(home[0], hand[0], ease(run)), lerp(home[1], hand[1], ease(run)), Math.max(0.01, p));
        op(e, clamp(p * 2) * (1 - P(t, tZap, 0.12, linear)));
      });
      const z = t - tZap;
      const zs = z < 0 ? 0 : z < 0.35 ? 1 : Math.max(0.35, 1 - (z - 0.35) / 0.8);
      op(zapSpark, zs); zapSpark.upd(t);
      tr(zapSpark, HX - 42, HY + 4, z < 0 ? 0.01 : 0.6 + 0.6 * (z < 0.35 ? 1 - z : 0.6));
      const zt = popIn(t, tZap + 0.05, 0.45);
      op(zapTxt, clamp(zt * 2)); zapTxt.setAttribute('transform', `rotate(-10 ${HX - 70} ${HY - 70}) translate(${HX - 70} ${HY - 70}) scale(${Math.max(0.01, zt).toFixed(3)}) translate(${-(HX - 70)} ${-(HY - 70)})`);
      lbHandle.set(fade(t, mid('shock', 0.04)) * (1 - fade(t, tZap, 0.3)));
      op(qHandle, win(t, mid('shock', 0.02), mid('shock', 0.36), 0.3)); tr(qHandle, HX + 6, HY - 58, 1 + 0.12 * wave(t, 0.9));
      op(sChip1, win(t, mid('shock', 0.34), tZap - 0.1, 0.3));
      op(sChip2, fade(t, tZap + 0.1, 0.35));
    }
  };
});
