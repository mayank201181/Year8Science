/* Chapter 5, Refraction: light changes speed and bends.
   Beats: light races down three lanes, slower in water and slowest in glass -> a ray crosses from air into glass
   and bends, its wavefronts marching in and turning as each one slows (refraction) -> not a 'shortcut': its speed
   changes -> the normal and the angles: it slows and bends towards the normal (50° -> 31°) -> reversed, it speeds
   up and bends away -> SloTo and FastAway side by side -> along the normal it only slows -> the snapped pencil:
   light from the tip bends away at the surface and the eye traces it back to a higher tip (showpiece) -> a pool
   looks shallower; a star twinkles through moving air -> a rectangular block: two refractions, towards then away,
   and the ray leaves parallel to how it went in, shifted sideways (lateral displacement). */
scene('refraction', S => {
  const { at, end, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;
  const NG = LT.nGlass, NW = LT.nWater;

  /* ---------- local helpers ---------- */
  function rich(parent, x, y, segs, o) {
    o = o || {};
    const t = E('text', { x, y, 'font-size': o.size || 30, 'font-weight': o.weight || 600, 'font-family': o.font || FD, 'text-anchor': o.anchor || 'start', fill: o.fill || C.ink }, parent);
    segs.forEach(s => { if (typeof s === 'string') s = [s]; E('tspan', { fill: s[1], 'font-weight': s[2] }, t).textContent = s[0]; });
    return t;
  }
  const popIn = (el, p, x, y, s0) => { s0 = s0 === undefined ? 0.75 : s0; op(el, clamp(p * 2)); tr(el, x, y + (1 - clamp(p)) * 16, Math.max(0.01, s0 + (1 - s0) * p)); };
  const slideIn = (el, p, dx, dy) => { op(el, clamp(p * 2)); tr(el, (1 - clamp(p)) * (dx || 0), (1 - clamp(p)) * (dy === undefined ? 14 : dy)); };
  const setP = (g, p) => { if (g._p !== p) { g._p = p; g.set(p); } };        // arcs measure their labels on each redraw
  // a ray drawn to p (0..1) at opacity a; hidden at 0, where its round cap would still paint a dot
  const drawRay = (g, p, a) => { setP(g, p); op(g, p > 0.001 ? (a === undefined ? 1 : a) : 0); };
  const pt = (a, d, k) => [a[0] + d[0] * k, a[1] + d[1] * k];
  const polyD = pts => 'M' + pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' L');
  const flashAt = (parent, p, r) => E('circle', { cx: p[0], cy: p[1], r: r || 54, fill: glow(C.energy) }, parent);
  const pulse = (t, t0, d) => Math.sin(Math.PI * P(t, t0, d || 0.6, linear));
  /* dots streaming along a -> b, sp apart: g.upd(front, phase) shows those up to `front` px from a, with one at
     `phase` px. Dots leave a at a steady rate, so faster light spaces them further apart. */
  function dotLine(parent, a, b, sp, o) {
    o = o || {};
    const g = G(parent), L = Math.hypot(b[0] - a[0], b[1] - a[1]), u = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], r = o.r || 6;
    const dash = `0.01 ${(sp - 0.01).toFixed(2)}`;
    const paths = [[r * 4.2, 0.22], [r * 2, 1]].map(([w, a_]) => E('path', { fill: 'none', stroke: o.color || '#FFFBE0', 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-dasharray': dash, opacity: a_ }, g));
    g.upd = (front, ph) => {
      front = Math.min(L, front);
      const on = front > 0.5;
      paths.forEach(p => { p.style.display = on ? '' : 'none'; });
      if (!on) return;
      const e = pt(a, u, front), d = `M${a[0].toFixed(1)},${a[1].toFixed(1)} L${e[0].toFixed(1)},${e[1].toFixed(1)}`, off = (-(((ph % sp) + sp) % sp)).toFixed(2);
      paths.forEach(p => { p.setAttribute('d', d); p.setAttribute('stroke-dashoffset', off); });
    };
    g.upd(0, 0);
    return g;
  }
  /* the observer eye (light lib eyeIcon) with its pupil at `pupil`, looking at `target` */
  function lookEye(parent, pupil, target, s) {
    s = s || 1;
    const ang = ltAng([target[0] - pupil[0], target[1] - pupil[1]]), right = Math.abs(ang) < 90;
    const e = eyeIcon(parent, s, { right }), c = ltPt(pupil[0], pupil[1], ang, -21 * s);
    tr(e, c[0], c[1], 1, right ? ang : ang - 180 * Math.sign(ang || 1));
    return e;
  }
  /* where light from src, under water of index n, crosses the surface y = y0 to reach eye; img: where the eye sees
     src (on the straight-back extension of the ray in the air, directly above src) */
  function surfacePoint(src, eye, y0, n) {
    let lo = Math.min(src[0], eye[0]), hi = Math.max(src[0], eye[0]);
    const f = x => n * Math.sin(Math.atan2(Math.abs(src[0] - x), src[1] - y0)) - Math.sin(Math.atan2(Math.abs(x - eye[0]), y0 - eye[1]));
    const neg = f(lo) < 0;
    for (let k = 0; k < 60; k++) { const m = (lo + hi) / 2; if ((f(m) < 0) === neg) lo = m; else hi = m; }
    const x = (lo + hi) / 2, tha = Math.atan2(Math.abs(x - eye[0]), y0 - eye[1]);
    return { p: [x, y0], img: [src[0], y0 + Math.abs(src[0] - x) / Math.tan(tha)] };
  }
  /* a yellow hexagonal pencil along +x from 0 to len, w wide; o.tip: sharpened at x = len; o.rubber: pink rubber at 0 */
  function pencilArt(parent, len, o) {
    o = o || {};
    const g = G(parent), w = o.w || 22, h = w / 2, cone = o.tip ? w * 1.9 : 0, rub = o.rubber ? w * 1.75 : 0, x0 = rub, x1 = len - cone;
    if (o.rubber) {
      E('rect', { x: 0, y: -h + 1, width: rub - w * 0.5 + 6, height: w - 2, rx: 7, fill: ball('#FF9CBB', '#D25D86'), stroke: '#B8436D', 'stroke-width': 2 }, g);
      E('rect', { x: rub - w * 0.6, y: -h - 1.5, width: w * 0.6, height: w + 3, rx: 2, fill: linGrad('#EEF2F5', '#8E9BA7', true), stroke: '#6F7C88', 'stroke-width': 1.5 }, g);
    }
    E('rect', { x: x0, y: -h, width: x1 - x0, height: w, fill: '#E3A20C' }, g);
    E('rect', { x: x0, y: -h * 0.42, width: x1 - x0, height: h * 0.84, fill: '#FFC93C' }, g);
    E('line', { x1: x0, y1: -h * 0.42, x2: x1, y2: -h * 0.42, stroke: '#FFE7A3', 'stroke-width': 2 }, g);
    E('rect', { x: x0, y: -h, width: x1 - x0, height: w, fill: 'none', stroke: '#9C6B08', 'stroke-width': 2 }, g);
    if (o.tip) {
      E('path', { d: `M${x1},${-h} L${len},0 L${x1},${h} Z`, fill: '#F2D3A3', stroke: '#B88A55', 'stroke-width': 2, 'stroke-linejoin': 'round' }, g);
      const gx = len - cone * 0.34;
      E('path', { d: `M${gx},${-h * 0.34} L${len},0 L${gx},${h * 0.34} Z`, fill: '#3C424A' }, g);
    }
    return g;
  }
  /* parallel marks (two chevrons) at p, along direction ang */
  function chevrons(parent, p, ang, col) {
    const g = G(parent);
    E('path', { d: 'M-15,-9 L-5,0 L-15,9 M-1,-9 L9,0 L-1,9', fill: 'none', stroke: col || C.ink, 'stroke-width': 3.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    tr(g, p[0], p[1], 1, ang);
    return g;
  }

  /* ================= A. three lanes: light is slower in water, and slowest in glass ================= */
  const A = G(root);
  const LX0 = 150, LX1 = 900, DX0 = 292, DX1 = 884, V0 = 300, SP0 = 72;
  const LANES = [
    { name: 'air', n: 1, y: 250, speed: '300,000 km/s', sub: 'fastest', fill: 'rgba(159,216,255,0.06)', stroke: C.line },
    { name: 'water', n: NW, y: 380, speed: '225,000 km/s', sub: 'slower', fill: LT.waterFill, stroke: C.water },
    { name: 'glass', n: NG, y: 510, speed: '200,000 km/s', sub: 'slowest', fill: LT.glassFill, stroke: LT.glassStroke },
  ].map(ln => {
    ln.g = G(A);
    E('rect', { x: LX0, y: ln.y - 50, width: LX1 - LX0, height: 100, rx: 20, fill: ln.fill, stroke: ln.stroke, 'stroke-width': 3 }, ln.g);
    T(ln.g, LX0 + 28, ln.y + 11, ln.name, { size: 32, weight: 700 });
    ln.dots = dotLine(ln.g, [DX0, ln.y], [DX1, ln.y], SP0 / ln.n, { r: 7 });
    ln.v = V0 / ln.n;
    ln.read = G(A);
    T(ln.read, 930, ln.y + 2, ln.speed, { size: 30, weight: 700 });
    T(ln.read, 930, ln.y + 34, ln.sub, { size: 24, weight: 600, fill: C.muted });
    return ln;
  });

  /* ================= B. air over glass: the ray bends ================= */
  const B = G(root);
  const O = [600, 400], BY = 400, IA = 50, RA = snellAngle(IA, 1, NG), LR = 260;
  const d1 = ltDir(90 - IA), d2 = ltDir(90 - RA);              // directions down into the glass: incident, refracted
  const P1 = pt(O, d1, -LR), P2 = pt(O, d2, LR);                 // (401, 233) and (733, 624)
  E('path', { d: 'M60,400 L1140,400 L1140,684 Q1140,702 1122,702 L78,702 Q60,702 60,684 Z', fill: LT.glassFill }, B);
  E('line', { x1: 60, y1: BY, x2: 1140, y2: BY, stroke: LT.glassStroke, 'stroke-width': 4 }, B);
  E('line', { x1: 84, y1: BY + 14, x2: 330, y2: BY + 14, stroke: '#FFFFFF', 'stroke-width': 3, opacity: 0.25, 'stroke-linecap': 'round' }, B);
  T(B, 1112, 378, 'air', { size: 26, weight: 600, fill: C.muted, anchor: 'end' });
  T(B, 1112, 440, 'glass', { size: 26, weight: 600, fill: C.muted, anchor: 'end' });
  const tagLess = T(B, 1112, 346, 'less dense', { size: 24, weight: 600, fill: C.muted, anchor: 'end' });
  const tagDense = T(B, 1112, 472, 'denser', { size: 24, weight: 600, fill: C.muted, anchor: 'end' });
  const nrm = normalLine(B, O[0], O[1], -90, 228, { back: 228, square: true, label: 'normal' }), nrmLab = nrm.lastChild;
  // the beam's wavefronts: each slows as it crosses, the side that enters first slowing first, so the beam turns
  const waveG = G(B);
  const HW = 62, WSP = 60, WS0 = -LR + 20, WS1 = LR * NG - 10, NWF = 13, VW = 120;
  const n1 = [d1[1], -d1[0]], tanI = Math.tan(IA * Math.PI / 180), cosI = Math.cos(IA * Math.PI / 180);
  const wfPt = (u, s) => { const su = u * tanI; return s <= su ? [O[0] + u * n1[0] + s * d1[0], O[1] + u * n1[1] + s * d1[1]] : [O[0] + u / cosI + (s - su) / NG * d2[0], BY + (s - su) / NG * d2[1]]; };
  const wfPts = s => { const us = s / tanI, q = [wfPt(-HW, s)]; if (us > -HW && us < HW) q.push(wfPt(us, s)); q.push(wfPt(HW, s)); return q; };
  E('path', { d: polyD([wfPt(-HW, WS0), [O[0] - HW / cosI, BY], wfPt(-HW, WS1), wfPt(HW, WS1), [O[0] + HW / cosI, BY], wfPt(HW, WS0)]) + 'Z', fill: C.energy, opacity: 0.08 }, waveG);
  const wfs = []; for (let k = 0; k < NWF; k++) wfs.push(E('path', { fill: 'none', stroke: C.energyLt, 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, waveG));
  // 'no bend' guides and turn arrows
  const gT = pt(O, d1, 150), gA = pt(O, d2, -150);
  const guideT = lightRay(B, O[0], O[1], gT[0], gT[1], { dash: '10 8', heads: false, glow: false, width: 3, color: C.energyLt });
  const guideA = lightRay(B, O[0], O[1], gA[0], gA[1], { dash: '10 8', heads: false, glow: false, width: 3, color: C.energyLt });
  const tT0 = pt(O, d1, 136), tT1 = pt(O, d2, 136), tA0 = pt(O, d2, -136), tA1 = pt(O, d1, -136);
  const turnT = arrow(B, tT0[0], tT0[1], tT1[0], tT1[1], { color: C.ink, width: 4, bend: -15, head: 13 });
  const turnA = arrow(B, tA0[0], tA0[1], tA1[0], tA1[1], { color: C.ink, width: 4, bend: 15, head: 13 });
  // angles: towards (air -> glass) and away (glass -> air)
  const arcIT = arcFromNormal(B, O[0], O[1], -90, -IA, 76, { color: LT.angI, text: 'i = {deg}°' });
  const arcRT = arcFromNormal(B, O[0], O[1], 90, -RA, 76, { color: LT.angR, text: 'r = {deg}°' });
  const arcIA = arcFromNormal(B, O[0], O[1], 90, -RA, 76, { color: LT.angI, text: 'i = {deg}°' });
  const arcRA = arcFromNormal(B, O[0], O[1], -90, -IA, 76, { color: LT.angR, text: 'r = {deg}°', lr: 205 });   // beyond the 'no bend' guide
  // rays
  const rayT = rayPath(B, [P1, O, P2]), rayA = rayPath(B, [P2, O, P1]);
  const srcA = flashAt(B, P2, 34);
  const flashO = flashAt(B, O, 56);
  const boxG = G(B), box = rayBox(boxG); { const c = pt(P1, d1, -50); tr(boxG, c[0], c[1], 1, 90 - IA); }
  const chRefr = chip(B, 'refraction', { size: 36, fill: C.card2, stroke: C.energy });
  // why: not a shortcut, a change of speed
  const bubG = G(B);
  {
    const n = 14, pts = [];
    for (let i = 0; i < n; i++) { const a = i / n * TAU; pts.push([Math.cos(a) * 196, Math.sin(a) * 56]); }
    let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
    for (let i = 0; i < n; i++) { const a = pts[i], b = pts[(i + 1) % n], r = Math.hypot(b[0] - a[0], b[1] - a[1]) * 0.6; d += ` A${r.toFixed(1)},${r.toFixed(1)} 0 0 1 ${b[0].toFixed(1)},${b[1].toFixed(1)}`; }
    E('path', { d: d + 'Z', fill: C.card, stroke: C.muted, 'stroke-width': 3, 'stroke-linejoin': 'round' }, bubG);
    [[-186, 92, 11], [-214, 122, 8], [-236, 146, 5.5]].forEach(([x, y, r]) => E('circle', { cx: x, cy: y, r, fill: C.card, stroke: C.muted, 'stroke-width': 3 }, bubG));
  }
  const BUBT = 'it ‘wants’ a shortcut', bubW = textWidth(BUBT, 30, FD, 600);
  T(bubG, 0, 10, BUBT, { size: 30, weight: 600, anchor: 'middle' });
  const bubStrike = strike(bubG, -bubW / 2 - 8, 0, bubW / 2 + 8);
  const bubX = cross(bubG, 15); tr(bubX, 232, -40);
  const chSpeed = chip(B, 'its speed changes', { size: 32, fill: C.card2, stroke: C.good });
  const tkSpeed = tick(chSpeed, 16); tr(tkSpeed, -chSpeed.w / 2 - 34, 2);
  // notes
  const noteT = G(B);
  rich(noteT, 0, 0, [['slows down', C.energy, 800]], { size: 32, anchor: 'middle' });
  rich(noteT, 0, 42, ['→ bends ', ['towards', C.energy, 800], ' the normal'], { size: 28, anchor: 'middle' });
  const noteA = G(B);
  rich(noteA, 0, 0, [['speeds up', C.energy, 800]], { size: 32, anchor: 'middle' });
  rich(noteA, 0, 42, ['→ bends ', ['away', C.energy, 800], ' from the normal'], { size: 28, anchor: 'middle' });
  // zero: a ray straight down the normal
  const zG = G(B);
  const zA = [600, 198], zB = [600, 682];
  const zBoxG = G(zG), zBox = rayBox(zBoxG); tr(zBoxG, 600, 148, 1, 90);
  const zRay = rayPath(zG, [zA, O, zB]);
  const zDotA = dotLine(zG, zA, O, 54), zDotG = dotLine(zG, O, zB, 36);
  const zI = T(zG, 530, 300, 'i = 0°', { size: 28, weight: 700, fill: LT.angI, anchor: 'middle' });
  const zChip = chip(zG, 'no bend, just slower', { size: 32, fill: C.card2, stroke: C.energy });
  const zNote = T(zG, 880, 600, 'closer dots: slower light', { size: 26, weight: 600, fill: C.muted, anchor: 'middle' });

  /* ================= SloTo, FastAway: the two cases side by side ================= */
  const SL = G(root);
  function miniPanel(cx, away, title, sub) {
    const g = G(SL), Y = 410, o = [cx, Y];
    card(g, cx - 250, 140, 500, 520, { fill: C.card, stroke: C.line });
    E('rect', { x: cx - 228, y: Y, width: 456, height: 150, rx: 10, fill: LT.glassFill }, g);
    E('line', { x1: cx - 228, y1: Y, x2: cx + 228, y2: Y, stroke: LT.glassStroke, 'stroke-width': 4 }, g);
    T(g, cx + 220, Y - 18, 'air', { size: 26, weight: 600, fill: C.muted, anchor: 'end' });
    T(g, cx + 220, Y + 36, 'glass', { size: 26, weight: 600, fill: C.muted, anchor: 'end' });
    const nl = normalLine(g, cx, Y, -90, 132, { back: 132 });
    const aAir = arcFromNormal(g, cx, Y, -90, -IA, 50, { color: away ? LT.angR : LT.angI });
    const aGl = arcFromNormal(g, cx, Y, 90, -RA, 50, { color: away ? LT.angI : LT.angR });
    const pa = pt(o, d1, -160), pb = pt(o, d2, 132);
    const ray = rayPath(g, away ? [pb, o, pa] : [pa, o, pb]);
    const ch = chip(g, title, { size: 44, fill: C.card2, stroke: C.energy, color: C.energy });
    const st = rich(g, cx, 622, sub, { size: 30, anchor: 'middle' });
    return { g, ray, nl, aAir, aGl, ch, st, cx };
  }
  const panL = miniPanel(320, false, 'SloTo', [['Slo', C.energy, 800], 'w down, bend ', ['to', C.energy, 800], 'wards']);
  const panR = miniPanel(880, true, 'FastAway', ['Go ', ['fast', C.energy, 800], 'er, bend ', ['away', C.energy, 800]]);

  /* ================= C. the 'snapped' pencil (showpiece) ================= */
  const Cg = G(root);
  const WY = 350, PT = [610, 540], PE = [705, 350], PQ = [300, 160];       // surface, real tip, entry point, eye
  const spc = surfacePoint(PT, PQ, WY, NW), PS = spc.p, PI = spc.img, KAPP = (PI[1] - WY) / (PT[1] - WY);
  const pdir = (() => { const v = [PT[0] - PE[0], PT[1] - PE[1]], L = Math.hypot(v[0], v[1]); return [v[0] / L, v[1] / L]; })();   // rubber -> tip
  const PL = Math.hypot(PT[0] - PE[0], PT[1] - PE[1]), PTOP = pt(PE, pdir, -205), PANG = ltAng(pdir), PW = 22;
  const penG = G(Cg);
  const pTop = pencilArt(penG, 205, { rubber: true, w: PW }); tr(pTop, PTOP[0], PTOP[1], 1, PANG);
  const perp = [-pdir[1], pdir[0]], cb = pt(PE, pdir, PL - PW * 1.9);
  const pGhost = E('path', { d: polyD([pt(PE, perp, PW / 2), pt(cb, perp, PW / 2), PT, pt(cb, perp, -PW / 2), pt(PE, perp, -PW / 2)]), fill: 'rgba(255,201,60,0.12)', stroke: '#FFE7A3', 'stroke-width': 2.5, 'stroke-dasharray': '8 6', 'stroke-linejoin': 'round' }, penG);
  const squash = G(penG);
  const pUnder = pencilArt(squash, PL, { tip: true, w: PW }); tr(pUnder, PE[0], PE[1], 1, PANG);
  const bk = beaker(Cg, 360, 340, { level: (640 - WY) / (640 - 318), opacity: 0.3 }); tr(bk, 580, 470);
  E('line', { x1: 404, y1: WY, x2: 756, y2: WY, stroke: C.water, 'stroke-width': 3 }, Cg);
  const pNrm = normalLine(Cg, PS[0], WY, -90, 66, { back: 66 });
  const pExt = lightRay(Cg, PS[0], PS[1], PI[0], PI[1], { dash: '10 8', heads: false, glow: false, width: 4, color: C.energyLt });
  const pTip = flashAt(Cg, PT, 34), pFlash = flashAt(Cg, PS, 44);
  const pRay = rayPath(Cg, [PT, PS, PQ]);
  const pRing = E('circle', { cx: PI[0], cy: PI[1], r: 12, fill: 'none', stroke: C.energyLt, 'stroke-width': 3 }, Cg);
  lookEye(Cg, PQ, PS, 1.25);
  const pLabReal = G(Cg); T(pLabReal, PT[0] + 24, PT[1] + 40, 'real tip', { size: 26, weight: 600, fill: C.muted });
  const pLabSeen = G(Cg);
  E('line', { x1: 786, y1: PI[1] - 8, x2: PI[0] + 16, y2: PI[1], stroke: C.muted, 'stroke-width': 2.5 }, pLabSeen);
  E('circle', { cx: PI[0] + 16, cy: PI[1], r: 4, fill: C.muted }, pLabSeen);
  T(pLabSeen, 796, PI[1], 'looks like it’s here', { size: 26, weight: 600 });
  const pChip = chip(Cg, 'Try it at home!', { size: 34, fill: C.card2, stroke: C.energy, color: C.energy });

  /* ================= D. a pool looks shallower; stars twinkle ================= */
  const Dg = G(root);
  const poolG = G(Dg);
  card(poolG, 50, 130, 610, 560, { fill: C.card, stroke: C.line });
  const PY = 330, PF = 600, PX0 = 84, PX1 = 520, FPT = [300, PF], QP = [575, 255];
  E('rect', { x: 70, y: PY, width: 570, height: 342, rx: 10, fill: '#2A3A46' }, poolG);
  E('rect', { x: 70, y: PY - 8, width: 14, height: 10, fill: '#8DA2B0' }, poolG);
  E('rect', { x: PX1 + 12, y: PY - 8, width: 640 - PX1 - 12, height: 10, rx: 3, fill: '#8DA2B0' }, poolG);
  E('rect', { x: PX0, y: PY, width: PX1 - PX0, height: PF - PY, fill: '#0E3042' }, poolG);
  E('rect', { x: PX0, y: PY, width: PX1 - PX0, height: PF - PY, fill: C.water, opacity: 0.3 }, poolG);
  E('rect', { x: PX0 - 12, y: PY, width: 12, height: PF - PY + 12, fill: '#9FD3E8' }, poolG);
  E('rect', { x: PX1, y: PY, width: 12, height: PF - PY + 12, fill: '#9FD3E8' }, poolG);
  E('rect', { x: PX0, y: PF, width: PX1 - PX0, height: 12, fill: '#BFE6F5' }, poolG);
  for (let x = PX0 + 36; x < PX1; x += 36) E('line', { x1: x, y1: PF, x2: x, y2: PF + 12, stroke: '#6FA9C2', 'stroke-width': 2 }, poolG);
  for (let y = PY + 36; y < PF; y += 36) [PX0 - 12, PX1].forEach(x => E('line', { x1: x, y1: y, x2: x + 12, y2: y, stroke: '#6FA9C2', 'stroke-width': 2 }, poolG));
  E('line', { x1: PX0, y1: PY, x2: PX1, y2: PY, stroke: C.water, 'stroke-width': 3 }, poolG);
  const spp = surfacePoint(FPT, QP, PY, NW), SPP = spp.p, FIMG = spp.img;
  const apparent = G(poolG);
  E('line', { x1: PX0 + 4, y1: FIMG[1], x2: PX1 - 4, y2: FIMG[1], stroke: '#DDF6FF', 'stroke-width': 3.5, 'stroke-dasharray': '12 9', 'stroke-linecap': 'round' }, apparent);
  T(apparent, 100, FIMG[1] - 12, 'looks this deep', { size: 26, weight: 700, fill: '#BDEBFA' });
  T(poolG, 100, PF - 12, 'real floor', { size: 26, weight: 600, fill: C.ink });
  const poolN = normalLine(poolG, SPP[0], PY, -90, 58, { back: 58 });
  const poolExt = lightRay(poolG, SPP[0], SPP[1], FIMG[0], FIMG[1], { dash: '10 8', heads: false, glow: false, width: 4, color: C.energyLt });
  const poolRay = rayPath(poolG, [FPT, SPP, QP]);
  const poolSrc = flashAt(poolG, FPT, 30);
  lookEye(poolG, QP, SPP, 1.1);
  const poolChip = chip(Dg, 'looks shallower', { size: 32, fill: C.card2, stroke: C.energy });
  const starG = G(Dg);
  card(starG, 690, 130, 460, 560, { fill: linGrad('#071420', '#173652', true), stroke: C.line });
  { const r = rng(57); for (let k = 0; k < 14; k++) E('circle', { cx: (712 + r() * 416).toFixed(1), cy: (150 + r() * 210).toFixed(1), r: (1.2 + r() * 1.8).toFixed(1), fill: '#DCEBF5', opacity: (0.25 + r() * 0.4).toFixed(2) }, starG); }
  E('path', { d: 'M690,626 Q920,594 1150,630 L1150,668 Q1150,690 1128,690 L712,690 Q690,690 690,668 Z', fill: '#10261B' }, starG);
  const SX = 920, SY0 = 270, BAND0 = 382, BAND1 = 476, EYEY = 566;
  const air = heatWaves(starG, { n: 6, h: 92, spacing: 68, color: C.air, width: 4, speed: 0.45 }); tr(air, SX, BAND1 + 4);
  T(starG, 1128, BAND1 + 48, 'moving air', { size: 26, weight: 600, fill: C.muted, anchor: 'end' });
  const starRay = rayPath(starG, [[SX, SY0 + 24], [SX, EYEY]], { width: 5 });
  const star = spark(starG, 22, { seed: 5 }); tr(star, SX, SY0);
  const gazer = person(starG, { shirt: '#5B8DEF' }); tr(gazer, SX - 6, 672, 0.62);      // a stargazer; the light reaches their eye
  const starChip = chip(Dg, 'stars twinkle', { size: 32, fill: C.card2, stroke: C.energy });

  /* ================= E. a rectangular glass block: two refractions ================= */
  const Eg = G(root);
  const blk = glassBlock(Eg, 400, 240).at(600, 410);                             // x 400..800, y 290..530
  T(Eg, 416, 514, 'glass', { size: 26, weight: 600, fill: C.muted });            // bottom left: clear of every ray
  const BS = pt([480, 290], d1, -150);
  const bPath = blk.trace(BS, 90 - IA, NG, 230), BA = bPath[1], BB = bPath[2];   // [slit, A, B, out]
  const faceHi = G(Eg);
  [290, 530].forEach(y => E('line', { x1: 402, y1: y, x2: 798, y2: y, stroke: '#FFFFFF', 'stroke-width': 7, 'stroke-linecap': 'round', opacity: 0.8 }, faceHi));
  const cvFaces = [chevrons(Eg, [720, 290], 0), chevrons(Eg, [720, 530], 0)];
  T(Eg, 330, 430, 'air', { size: 26, weight: 600, fill: C.muted, anchor: 'middle' });
  const bBoxG = G(Eg), bBox = rayBox(bBoxG); { const c = pt(BS, d1, -50); tr(bBoxG, c[0], c[1], 1, 90 - IA); }
  const bNA = normalLine(Eg, BA[0], BA[1], -90, 104, { back: 104 });
  const bNB = normalLine(Eg, BB[0], BB[1], 90, 104, { back: 104 });
  const bArcIA = arcFromNormal(Eg, BA[0], BA[1], -90, -IA, 56, { color: LT.angI, text: '{deg}°' });
  // the two 31° labels sit close to their own arcs (pushed further along the narrow wedges they would swap places)
  const bArcRA = arcFromNormal(Eg, BA[0], BA[1], 90, -RA, 56, { color: LT.angR, text: '{deg}°', lr: 116 });
  const bArcIB = arcFromNormal(Eg, BB[0], BB[1], -90, -RA, 56, { color: LT.angI, text: '{deg}°', lr: 116 });
  const bArcRB = arcFromNormal(Eg, BB[0], BB[1], 90, -IA, 56, { color: LT.angR, text: '{deg}°' });
  const bGEnd = pt(BA, d1, 500);
  const bGhost = lightRay(Eg, BA[0], BA[1], bGEnd[0], bGEnd[1], { dash: '10 8', heads: false, glow: false, width: 4, color: C.energyLt });
  const bGhostLab = T(Eg, bGEnd[0] + 4, bGEnd[1] + 40, 'no block', { size: 26, weight: 600, fill: C.muted, anchor: 'middle' });
  const bRay = rayPath(Eg, bPath);
  const bFlA = flashAt(Eg, BA), bFlB = flashAt(Eg, BB);
  const cvRays = [chevrons(Eg, pt(BA, d1, 415), 90 - IA, C.energyLt), chevrons(Eg, pt(BB, d1, 150), 90 - IA, C.energyLt)];
  function badge(parent, n, label, anchor) {
    const g = G(parent);
    E('circle', { r: 21, fill: C.card2, stroke: C.energy, 'stroke-width': 3 }, g);
    T(g, 0, 10, String(n), { size: 28, weight: 700, anchor: 'middle', fill: C.energy });
    g.lab = T(g, anchor === 'end' ? -34 : 34, 10, label, { size: 30, weight: 700, anchor: anchor || 'start' });
    return g;
  }
  const bdg1 = badge(Eg, 1, 'towards'), bdg2 = badge(Eg, 2, 'away', 'end');
  const chSame = chip(Eg, '50° in, 50° out', { size: 30, fill: C.card2, stroke: C.energy });
  const chEq = chip(Eg, 'equal and opposite', { size: 30, fill: C.card2, stroke: C.energy });
  // lateral displacement: perpendicular from the 'no block' line to the emerging ray
  const nPerp = [-d1[1], d1[0]], LDP = pt(BA, d1, 465), LDF = (() => { const k = (BB[0] - LDP[0]) * nPerp[0] + (BB[1] - LDP[1]) * nPerp[1]; return pt(LDP, nPerp, k); })();
  const LDM = [(LDP[0] + LDF[0]) / 2, (LDP[1] + LDF[1]) / 2];
  const ldA = arrow(Eg, LDM[0], LDM[1], LDP[0] - nPerp[0] * 3, LDP[1] - nPerp[1] * 3, { color: C.ink, width: 4.5, head: 15 });
  const ldB = arrow(Eg, LDM[0], LDM[1], LDF[0] + nPerp[0] * 3, LDF[1] + nPerp[1] * 3, { color: C.ink, width: 4.5, head: 15 });
  const ldChip = chip(Eg, 'lateral displacement', { size: 30, fill: C.card2, stroke: C.energy });

  /* ================= update ================= */
  return t => {
    /* ---- A: the lanes ---- */
    const aA = Math.min(P(t, S.first - 0.4, 0.5, linear), 1 - P(t, at('bend') - 0.1, 0.5, linear));
    op(A, aA);
    if (aA > 0) {
      const t0 = S.first + 0.35;
      LANES.forEach((ln, k) => {
        slideIn(ln.g, P(t, S.first - 0.3 + k * 0.16, 0.5, easeOut), -30, 0);
        const run = Math.max(0, (t - t0) * ln.v);
        ln.dots.upd(run, run);
        slideIn(ln.read, P(t, t0 + (DX1 - DX0) / ln.v, 0.5, easeOut), -20, 0);
      });
    }

    /* ---- B: air over glass ---- */
    const aB = Math.max(win(t, at('bend') - 0.2, at('sloto') + 0.15, 0.45), win(t, at('zero') - 0.1, at('pencil') + 0.05, 0.45));
    op(B, aB);
    if (aB > 0) {
      // the towards ray (bend, why, towards) and its ray box
      const fT = win(t, at('bend') - 0.1, at('away') + 0.1, 0.4);
      op(boxG, fT); box.set(P(t, mid('bend', 0.04), 0.4, linear));
      const r0 = mid('bend', 0.1), r1 = mid('bend', 0.5), tHit = (r0 + r1) / 2;
      drawRay(rayT, P(t, r0, r1 - r0, linear), fT);
      // the away ray
      const fA = win(t, at('away') + 0.05, at('sloto') + 0.3, 0.4);
      const a0 = mid('away', 0.08), a1 = mid('away', 0.5), aHit = (a0 + a1) / 2;
      drawRay(rayA, P(t, a0, a1 - a0, linear), fA);
      op(srcA, fA * (0.65 + 0.35 * wave(t, 1.2)));
      // the zero ray
      const fZ = P(t, at('zero') - 0.05, 0.45, linear);
      op(zG, fZ);
      const z0 = mid('zero', 0.08), zHitF = (O[1] - zA[1]) / (zB[1] - zA[1]), z1 = mid('zero', 0.42), zHit = lerp(z0, z1, zHitF);
      op(flashO, Math.max(pulse(t, tHit - 0.3), pulse(t, aHit - 0.3), pulse(t, zHit - 0.3)));
      if (fZ > 0) {
        zBox.set(P(t, at('zero'), 0.4, linear));
        drawRay(zRay, P(t, z0, z1 - z0, linear));
        // dots stream down behind the ray: wider apart in the air, closer together in the glass
        const vz = 200, tD = z0 + 0.6, ra = Math.max(0, (t - tD) * vz), rg = Math.max(0, (t - tD - (O[1] - zA[1]) / vz) * vz / NG);
        zDotA.upd(ra, ra); zDotG.upd(rg, rg);
        op(zI, P(t, mid('zero', 0.3), 0.4, linear));
        popIn(zChip, P(t, mid('zero', 0.5), 0.5, pop), 905, 290);
        op(zNote, P(t, mid('zero', 0.72), 0.5, linear));
      }
      // the normal: drawn for 'towards', stays until the pencil (its label makes way for the zero ray box)
      const nOn = P(t, at('towards') + 0.05, 0.9);
      nrm.set(nOn); op(nrm, nOn > 0 ? 1 : 0);
      op(nrmLab, (nOn >= 1 ? 1 : 0) * (1 - P(t, at('zero') - 0.2, 0.3, linear)));
      // wavefronts march in during 'bend' and 'why'
      const tw0 = mid('bend', 0.38), wA = win(t, tw0, at('towards') + 0.3, 0.6);
      op(waveG, wA);
      if (wA > 0) {
        const run = Math.max(0, (t - tw0) * VW), kmax = Math.floor(run / WSP), kmin = Math.max(0, Math.ceil((run - (WS1 - WS0)) / WSP));
        wfs.forEach(w => { w.style.display = 'none'; });
        for (let k = kmin; k <= kmax; k++) {
          const s = WS0 + run - k * WSP, w = wfs[k % NWF];
          w.setAttribute('d', polyD(wfPts(s)));
          w.style.display = '';
          w.style.opacity = (clamp((s - WS0) / 40) * clamp((WS1 - s) / 60) * 0.85).toFixed(3);
        }
      }
      popIn(chRefr, P(t, mid('bend', 0.78), 0.5, pop) * (1 - P(t, at('why') - 0.1, 0.4, linear)), 900, 196);
      // why
      const fW = win(t, at('why') - 0.05, at('towards') + 0.1, 0.4);
      popIn(bubG, P(t, mid('why', 0.02), 0.5, pop) * fW, 900, 192);
      bubStrike.set(P(t, mid('why', 0.36), 0.5));
      op(bubX, P(t, mid('why', 0.42), 0.3, linear));
      popIn(chSpeed, P(t, mid('why', 0.56), 0.5, pop) * fW, 912, 330);
      const tk = P(t, mid('why', 0.76), 0.45, pop); op(tkSpeed, clamp(tk * 2)); tr(tkSpeed, -chSpeed.w / 2 - 34, 2, Math.max(0.01, tk));
      // towards: the angles, the 'no bend' guide, the note
      const fTw = win(t, at('towards') + 0.1, at('away') + 0.1, 0.4);
      setP(arcIT, P(t, mid('towards', 0.22), 0.6)); op(arcIT, fTw);
      setP(arcRT, P(t, mid('towards', 0.36), 0.6)); op(arcRT, fTw);
      drawRay(guideT, P(t, mid('towards', 0.5), 0.6, linear), fTw * 0.7);
      const tnT = P(t, mid('towards', 0.62), 0.5); turnT.set(tnT); op(turnT, tnT > 0.001 ? fTw : 0);
      op(tagDense, fTw); op(noteT, fTw * P(t, mid('towards', 0.55), 0.5, linear)); tr(noteT, 958, 528);
      // away
      const fAw = win(t, at('away') + 0.15, at('sloto') + 0.1, 0.4);
      setP(arcIA, P(t, mid('away', 0.3), 0.6)); op(arcIA, fAw);
      setP(arcRA, P(t, mid('away', 0.5), 0.6)); op(arcRA, fAw);
      drawRay(guideA, P(t, mid('away', 0.5), 0.6, linear), fAw * 0.7);
      const tnA = P(t, mid('away', 0.62), 0.5); turnA.set(tnA); op(turnA, tnA > 0.001 ? fAw : 0);
      op(tagLess, fAw); op(noteA, fAw * P(t, mid('away', 0.6), 0.5, linear)); tr(noteA, 958, 236);
    }

    /* ---- SloTo, FastAway ---- */
    const aSL = win(t, at('sloto') - 0.1, at('zero') + 0.05, 0.45);
    op(SL, aSL);
    if (aSL > 0) {
      [[panL, 0.0, 0.12, 0.46], [panR, 0.18, 0.3, 0.74]].forEach(([pn, fIn, fCh, fSt]) => {
        slideIn(pn.g, P(t, mid('sloto', fIn), 0.5, easeOut), 0, 24);
        pn.nl.set(1);
        drawRay(pn.ray, P(t, mid('sloto', fIn) + 0.2, 1.3, linear));
        setP(pn.aAir, P(t, mid('sloto', fIn) + 0.9, 0.5)); setP(pn.aGl, P(t, mid('sloto', fIn) + 1.1, 0.5));
        popIn(pn.ch, P(t, mid('sloto', fCh), 0.5, pop), pn.cx, 210);
        op(pn.st, P(t, mid('sloto', fSt), 0.4, linear));
      });
    }

    /* ---- C: the pencil ---- */
    const aC = win(t, at('pencil') - 0.15, at('pool') + 0.05, 0.45);
    op(Cg, aC);
    if (aC > 0) {
      const p0 = mid('pencil', 0.22), p1 = mid('pencil', 0.6), lenW = Math.hypot(PS[0] - PT[0], PS[1] - PT[1]), lenA = Math.hypot(PQ[0] - PS[0], PQ[1] - PS[1]);
      const fS = lenW / (lenW + lenA), tS = lerp(p0, p1, fS);
      op(pTip, Math.min(P(t, p0 - 0.5, 0.5, linear), 1 - P(t, p1 + 0.5, 0.6, linear)) * (0.7 + 0.3 * wave(t, 0.9)));
      drawRay(pRay, P(t, p0, p1 - p0, linear));
      op(pFlash, pulse(t, tS - 0.25, 0.6));
      setP(pNrm, P(t, tS - 0.1, 0.5)); op(pNrm, P(t, tS - 0.1, 0.2, linear));
      drawRay(pExt, P(t, mid('pencil', 0.62), 0.7, linear));
      op(pRing, P(t, mid('pencil', 0.62) + 0.6, 0.3, linear));
      // the snap: the underwater part rises into where the eye sees it; its real place stays as a dashed ghost
      const sn = P(t, mid('pencil', 0.68), 1.2);
      squash.setAttribute('transform', `translate(0 ${WY}) scale(1 ${lerp(1, KAPP, sn).toFixed(4)}) translate(0 ${-WY})`);
      op(pGhost, sn);
      slideIn(pLabReal, P(t, mid('pencil', 0.76), 0.5, easeOut), 0, 10);
      slideIn(pLabSeen, P(t, mid('pencil', 0.8), 0.5, easeOut), 16, 0);
      popIn(pChip, P(t, mid('pencil', 0.88), 0.5, pop), 990, 210);
    }

    /* ---- D: the pool, then a twinkling star ---- */
    const aD = win(t, at('pool') - 0.15, at('block') + 0.05, 0.45);
    op(Dg, aD);
    if (aD > 0) {
      slideIn(poolG, P(t, at('pool') - 0.1, 0.5, easeOut), 0, 20);
      popIn(poolChip, P(t, mid('pool', 0.08), 0.5, pop), 355, 190);
      const q0 = mid('pool', 0.1), q1 = mid('pool', 0.36);
      op(poolSrc, win(t, q0 - 0.4, q1 + 0.4, 0.4) * (0.7 + 0.3 * wave(t, 0.9)));
      drawRay(poolRay, P(t, q0, q1 - q0, linear));
      const tq = lerp(q0, q1, 0.66);
      setP(poolN, P(t, tq - 0.1, 0.5)); op(poolN, P(t, tq - 0.1, 0.2, linear));
      drawRay(poolExt, P(t, q1 + 0.05, 0.6, linear));
      slideIn(apparent, P(t, q1 + 0.45, 0.5, easeOut), 0, 30);
      const sIn = P(t, mid('pool', 0.5), 0.5, easeOut);
      slideIn(starG, sIn, 30, 0);
      popIn(starChip, P(t, mid('pool', 0.56), 0.5, pop), 920, 186);
      if (sIn > 0) {
        air.upd(t * calm);
        // the moving air bends the starlight by a changing amount, so it wanders on and off the eye: the star twinkles
        const tt = t * (0.35 + 0.65 * calm), phi = 0.07 * Math.sin(tt * 2.9) + 0.045 * Math.sin(tt * 5.3 + 1.1), pts = [[SX, SY0 + 24], [SX, BAND0]];
        for (let k = 1; k <= 9; k++) { const y = BAND0 + (BAND1 - BAND0) * k / 9, dy = y - BAND0; pts.push([SX + phi * dy * dy / (2 * (BAND1 - BAND0)), y]); }
        const last = pts[pts.length - 1], off = last[0] - SX + phi * (EYEY - BAND1);
        pts.push([SX + off, EYEY]);
        starRay.pts(pts); drawRay(starRay, P(t, mid('pool', 0.6), 0.9, linear));
        const hitEye = clamp(1 - Math.abs(off) / 22);
        const tw = P(t, mid('pool', 0.6) + 0.9, 0.3, linear);
        op(star, lerp(1, 0.3 + 0.7 * hitEye, tw)); tr(star, SX, SY0, lerp(1, 0.75 + 0.45 * hitEye, tw)); star.upd(t);
      }
    }

    /* ---- E: the glass block ---- */
    const aE = P(t, at('block') - 0.15, 0.45, linear);
    op(Eg, aE);
    if (aE > 0) {
      bBox.set(P(t, mid('block', 0.05), 0.4, linear));
      const L0 = Math.hypot(BA[0] - BS[0], BA[1] - BS[1]), L1 = Math.hypot(BB[0] - BA[0], BB[1] - BA[1]), LT_ = L0 + L1 + 230;
      const b0 = mid('block', 0.12), b1 = mid('block', 0.82), tA = lerp(b0, b1, L0 / LT_), tB = lerp(b0, b1, (L0 + L1) / LT_);
      drawRay(bRay, P(t, b0, b1 - b0, linear));
      op(bFlA, Math.max(pulse(t, tA - 0.25, 0.6), 0.8 * pulse(t, mid('parallel', 0.3), 0.8)));
      op(bFlB, Math.max(pulse(t, tB - 0.25, 0.6), 0.8 * pulse(t, mid('parallel', 0.42), 0.8)));
      // the two refractions: numbered, then labelled towards / away
      const lbOff = 1 - P(t, at('parallel') + 0.1, 0.5, linear);
      popIn(bdg1, P(t, tA + 0.1, 0.45, pop) * lbOff, 528, 244);
      popIn(bdg2, P(t, tB + 0.1, 0.45, pop) * lbOff, 566, 588);
      op(bdg1.lab, P(t, mid('inout', 0.3), 0.4, linear)); op(bdg2.lab, P(t, mid('inout', 0.68), 0.4, linear));
      setP(bNA, P(t, mid('inout', 0.02), 0.5)); op(bNA, P(t, mid('inout', 0.02), 0.2, linear));
      setP(bArcIA, P(t, mid('inout', 0.1), 0.5)); setP(bArcRA, P(t, mid('inout', 0.2), 0.5));
      setP(bNB, P(t, mid('inout', 0.46), 0.5)); op(bNB, P(t, mid('inout', 0.46), 0.2, linear));
      setP(bArcIB, P(t, mid('inout', 0.54), 0.5)); setP(bArcRB, P(t, mid('inout', 0.62), 0.5));
      // by exactly the same amount: both 50° angles pulse
      const same = pulse(t, mid('inout', 0.8), 0.9) + pulse(t, mid('parallel', 0.36), 0.9);
      [bArcIA, bArcRB].forEach(a => a.firstChild.setAttribute('opacity', (0.18 + 0.45 * same).toFixed(3)));
      [bArcRA, bArcIB].forEach(a => a.firstChild.setAttribute('opacity', (0.18 + 0.45 * pulse(t, mid('parallel', 0.36), 0.9)).toFixed(3)));
      popIn(chSame, P(t, mid('inout', 0.8), 0.5, pop) * (1 - P(t, at('parallel') + 0.1, 0.4, linear)), 990, 400);
      // parallel faces, equal and opposite bends, the ray leaves parallel
      op(faceHi, 0.9 * win(t, mid('parallel', 0.02), mid('parallel', 0.3), 0.35) * (0.6 + 0.4 * wave(t, 0.8)));
      cvFaces.forEach((c, k) => op(c, win(t, mid('parallel', 0.08 + k * 0.05), mid('parallel', 0.32), 0.3)));
      popIn(chEq, P(t, mid('parallel', 0.34), 0.5, pop) * (1 - P(t, at('shift') - 0.1, 0.4, linear)), 990, 400);
      drawRay(bGhost, P(t, mid('parallel', 0.58), 0.9, linear));
      op(bGhostLab, P(t, mid('parallel', 0.58) + 0.7, 0.4, linear) * (1 - P(t, at('shift') - 0.1, 0.4, linear)));
      bRay.firstChild.setAttribute('opacity', (0.16 + 0.3 * win(t, mid('parallel', 0.6), end('parallel') + 0.4, 0.4) * (0.6 + 0.4 * wave(t, 1.0))).toFixed(3));
      cvRays.forEach((c, k) => { const p = P(t, mid('parallel', 0.78 + k * 0.06), 0.45, pop); op(c, clamp(p * 2)); });
      // shifted sideways
      const sp = P(t, mid('shift', 0.08), 0.7); ldA.set(sp); ldB.set(sp); op(ldA, sp > 0 ? 1 : 0); op(ldB, sp > 0 ? 1 : 0);
      popIn(ldChip, P(t, mid('shift', 0.42), 0.5, pop), 990, 668);
    }
  };
});
