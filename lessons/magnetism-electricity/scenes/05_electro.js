/* Electromagnets.
   The intro's nail flashes up; then a wire carrying current up through a card grows circular field
   lines that compasses follow. The wire curls into an 8-turn solenoid whose loop fields add up into
   a bar magnet's field (N on the right: current runs down the front of each turn). A switch stops
   and restarts it; turning the battery round swaps the poles. Three panels: more turns, more
   current, an iron core (TIC). A bigger battery only boosts an electromagnet. A scrapyard crane
   lifts and drops a car (showpiece). Five uses, then a home experiment and its safety card. */
scene('electro', S => {
  const { at, end, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;
  const COPPER = '#D9893F', COPPER_DK = '#8A5426', CLIPC = '#C3CEDA', FIELD = '#B9A6FF';
  const RED = '#E8424F', BLUE = '#3B82F6', INS = '#3FB87A', INS_DK = '#1F7A4C';

  /* ---------- helpers ---------- */
  // a polyline [[x, y, visibility 0..1], ...] that current dots ride, by arc length
  function track(pts) {
    const cum = [0];
    for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    return { pts, cum, L: cum[cum.length - 1] };
  }
  const TQ = [0, 0, 0];                      // trackAt's result, reused (read it straight away)
  function trackAt(tk, s) {
    s = ((s % tk.L) + tk.L) % tk.L;
    let lo = 0, hi = tk.cum.length - 1;
    while (hi - lo > 1) { const m = (lo + hi) >> 1; if (tk.cum[m] <= s) lo = m; else hi = m; }
    const a = tk.pts[lo], b = tk.pts[hi], f = (s - tk.cum[lo]) / ((tk.cum[hi] - tk.cum[lo]) || 1);
    TQ[0] = a[0] + (b[0] - a[0]) * f; TQ[1] = a[1] + (b[1] - a[1]) * f; TQ[2] = Math.min(a[2], b[2]);
    return TQ;
  }
  const bez = (p0, p1, p2, p3, u) => { const v = 1 - u; return [v * v * v * p0[0] + 3 * v * v * u * p1[0] + 3 * v * u * u * p2[0] + u * u * u * p3[0], v * v * v * p0[1] + 3 * v * v * u * p1[1] + 3 * v * u * u * p2[1] + u * u * u * p3[1]]; };
  const bezD = (p0, p1, p2, p3) => `M${p0[0].toFixed(1)},${p0[1].toFixed(1)} C${p1[0].toFixed(1)},${p1[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)} ${p3[0].toFixed(1)},${p3[1].toFixed(1)}`;
  const bezPts = (p0, p1, p2, p3, n) => { const out = []; for (let i = 0; i <= n; i++) { const q = bez(p0, p1, p2, p3, i / n); out.push([q[0], q[1], 1]); } return out; };
  const shift = (pts, dx, dy, s) => pts.map(p => [dx + (s || 1) * p[0], dy + (s || 1) * p[1], p[2]]);

  // steel paperclip, upright: top hook about (3,-32), bottom hook (0,35)
  const CLIP_D = 'M5,-18 L5,22 A5,5 0 0 1 -5,22 L-5,-26 A8,8 0 0 1 11,-26 L11,26 A11,11 0 0 1 -11,26 L-11,-10';
  function clip(parent) { const g = G(parent); E('path', { d: CLIP_D, fill: 'none', stroke: CLIPC, 'stroke-width': 3.6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g); return g; }
  // poses of a chain of n clips hanging from (px, py); s = clip scale
  function chain(px, py, n, sway, s) {
    const out = [];
    for (let i = 0; i < n; i++) {
      const r = -sway * (1 + 0.35 * i), rad = r * Math.PI / 180, co = Math.cos(rad), si = Math.sin(rad);
      const cx = px - s * (3 * co + 32 * si), cy = py - s * (3 * si - 32 * co);
      px = cx - s * 35 * si; py = cy + s * 35 * co;
      out.push([cx, cy, r]);
    }
    return out;
  }
  // a clip leaping from its heap pose to `pose` at tj and (optionally) clattering back at tf
  function leap(t, c, pose, tj, tf) {
    let x = c.hx, y = c.hy, r = c.hr;
    const u = P(t, tj, 0.42, linear), up = c.hr > 180 ? 360 : 0;
    if (u > 0) {
      const e = ease(u), qx = (c.hx + pose[0]) / 2 - 30, qy = Math.min(c.hy, pose[1]) - 60;
      x = (1 - e) * (1 - e) * c.hx + 2 * (1 - e) * e * qx + e * e * pose[0];
      y = (1 - e) * (1 - e) * c.hy + 2 * (1 - e) * e * qy + e * e * pose[1];
      r = lerp(c.hr, pose[2] + up, e);
    }
    if (tf !== undefined && u >= 1 && t > tf) {
      const f = clamp((t - tf) / 0.6), yb = f < 0.72 ? Math.pow(f / 0.72, 2) : 1 - 0.15 * Math.sin(Math.PI * (f - 0.72) / 0.28);
      x = lerp(pose[0], c.hx, ease(f)); y = lerp(pose[1], c.hy, yb); r = lerp(pose[2] + up, c.hr, ease(f));
    }
    return [x, y, r];
  }

  /* the nail electromagnet: an iron nail (point on the right) centred on (0,0), 420 x 26, wrapped in
     n turns between x = c0 and c1 (back halves dimmer, behind the nail). Current entering at the
     left end runs down the front of each turn, so the point is a north pole. */
  function nailRig(parent, o) {
    o = o || {};
    const n = o.turns || 10, c0 = o.c0 !== undefined ? o.c0 : -120, c1 = o.c1 !== undefined ? o.c1 : 110;
    const R = o.R || 21, yaw = o.yaw !== undefined ? o.yaw : 0.32, ww = o.wire || 5.5;
    const g = G(parent);
    const back = E('path', { fill: 'none', stroke: o.dark || COPPER_DK, 'stroke-width': ww, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    const nail = G(g), steel = linGrad('#DCE4EA', '#66737F', true);
    E('path', { d: 'M-200,-13 L168,-13 L212,0 L168,13 L-200,13 Z', fill: steel, stroke: '#EEF3F6', 'stroke-width': 2, 'stroke-linejoin': 'round' }, nail);
    E('rect', { x: -214, y: -27, width: 16, height: 54, rx: 5, fill: steel, stroke: '#EEF3F6', 'stroke-width': 2 }, nail);
    E('path', { d: 'M-194,-6 L160,-6', stroke: '#FFFFFF', 'stroke-width': 3, opacity: 0.4, 'stroke-linecap': 'round' }, nail);
    const front = E('path', { fill: 'none', stroke: o.color || COPPER, 'stroke-width': ww, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    const th0 = Math.PI, th1 = Math.PI + TAU * n;
    const X = th => c0 + (c1 - c0) * (th - th0) / (th1 - th0) + R * yaw * Math.sin(th), Y = th => -R * Math.cos(th);
    let db = '', df = '';
    for (let k = 0; k < 2 * n; k++) {
      const a = th0 + k * Math.PI; let d = '';
      for (let i = 0; i <= 8; i++) { const th = a + Math.PI * i / 8; d += (i ? 'L' : 'M') + X(th).toFixed(1) + ',' + Y(th).toFixed(1); }
      if (k % 2) df += d; else db += d;
    }
    back.setAttribute('d', db); front.setAttribute('d', df);
    // g.coil(thMax) wraps the turns on, left to right, by widening a clip rectangle
    const id = 'emNail' + (++nailIds), x0 = c0 - R - 12;
    const cp = E('clipPath', { id }, defs()), cr = E('rect', { x: x0, y: -R - 12, width: c1 - c0 + 2 * R + 24, height: 2 * R + 24 }, cp);
    back.setAttribute('clip-path', `url(#${id})`); front.setAttribute('clip-path', `url(#${id})`);
    let last = -1;
    g.coil = thMax => {
      const w = thMax >= th1 ? c1 - c0 + 2 * R + 24 : Math.max(0, c0 + (c1 - c0) * (thMax - th0) / (th1 - th0) + R * yaw - x0);
      if (w !== last) { last = w; attr(cr, 'width', w); }
    };
    g.th0 = th0; g.th1 = th1; g.n = n;
    g.start = [X(th0), Y(th0)]; g.end = [X(th1), Y(th1)];
    g.samples = () => { const out = []; for (let th = th0; th <= th1 + 1e-6; th += Math.PI / 10) out.push([X(th), Y(th), Math.sin(th) > 0.08 ? 1 : 0]); return out; };
    return g;
  }
  let nailIds = 0;
  // set a label's text only when it changes (a new text node every frame is wasteful)
  const setT = (el, s) => { if (el._s !== s) { el._s = s; el.textContent = s; } };
  // AA cell on its side, 150 x 52: the copper-coloured + end (with the nub) on the left
  function aaCell(parent) {
    const g = G(parent), w = 150, h = 52, x0 = -w / 2, y0 = -h / 2;
    E('rect', { x: x0, y: y0, width: w, height: h, rx: 9, fill: linGrad('#3E4D59', '#1A232B', true), stroke: '#7D8C99', 'stroke-width': 2 }, g);
    E('path', { d: `M${x0 + 9},${y0} L${x0 + 54},${y0} L${x0 + 54},${y0 + h} L${x0 + 9},${y0 + h} Q${x0},${y0 + h} ${x0},${y0 + h - 9} L${x0},${y0 + 9} Q${x0},${y0} ${x0 + 9},${y0} Z`, fill: linGrad('#F0B06A', '#9A5A22', true) }, g);
    E('rect', { x: x0 - 9, y: -10, width: 11, height: 20, rx: 3, fill: '#C9D3DC', stroke: '#EEF3F6', 'stroke-width': 1.5 }, g);
    E('rect', { x: x0 + 8, y: y0 + 6, width: w - 16, height: 6, rx: 3, fill: '#FFFFFF', opacity: 0.18 }, g);
    T(g, x0 + 27, 11, '+', { size: 32, weight: 700, anchor: 'middle', fill: '#3A2000' });
    T(g, x0 + w - 24, 10, '−', { size: 30, weight: 700, anchor: 'middle', fill: C.ink });
    return g;
  }
  /* a coil along x (x0..x1) around y0 with radius R: back halves into backG, front halves into
     frontG. Current from x0 to x1 runs down the front of each turn (so x1 is the north end).
     c.setR(R) redraws it (to curl a straight wire into a coil). */
  function solenoid(backG, frontG, o) {
    const n = o.turns, yaw = o.yaw !== undefined ? o.yaw : 0.3, steps = o.steps || 10;
    const back = E('path', { fill: 'none', stroke: o.dark || COPPER_DK, 'stroke-width': o.wire || 6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, backG);
    const front = E('path', { fill: 'none', stroke: o.color || COPPER, 'stroke-width': o.wire || 6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, frontG);
    const th0 = Math.PI, th1 = Math.PI + TAU * n;
    let R = o.R;
    const X = th => o.x0 + (o.x1 - o.x0) * (th - th0) / (th1 - th0) + R * yaw * Math.sin(th), Y = th => o.y0 - R * Math.cos(th);
    const draw = () => {
      let db = '', df = '';
      for (let k = 0; k < 2 * n; k++) { const a = th0 + k * Math.PI; let d = ''; for (let i = 0; i <= steps; i++) { const th = a + Math.PI * i / steps; d += (i ? 'L' : 'M') + X(th).toFixed(1) + ',' + Y(th).toFixed(1); } if (k % 2) df += d; else db += d; }
      back.setAttribute('d', db); front.setAttribute('d', df);
    };
    draw();
    return {
      back, front, X, Y,
      setR: r => { if (Math.abs(r - R) > 0.05) { R = r; draw(); } },
      samples: () => { const out = []; for (let th = th0; th <= th1 + 1e-6; th += Math.PI / 10) out.push([X(th), Y(th), Math.sin(th) > 0.08 ? 1 : 0]); return out; },
    };
  }
  // plotting compass: dial r, diamond needle (north half red); g.set(deg) points the red end
  function compass(parent, r) {
    const g = G(parent);
    E('circle', { r, fill: C.card, stroke: C.line, 'stroke-width': 3 }, g);
    const nd = G(g);
    E('path', { d: `M${r * 0.8},0 L0,${-r * 0.24} L0,${r * 0.24} Z`, fill: RED }, nd);
    E('path', { d: `M${-r * 0.8},0 L0,${-r * 0.24} L0,${r * 0.24} Z`, fill: C.ink }, nd);
    E('circle', { r: r * 0.13, fill: C.muted }, g);
    g.set = deg => nd.setAttribute('transform', `rotate(${deg.toFixed(1)})`);
    return g;
  }
  const head = (x, y, deg, s) => { const a = deg * Math.PI / 180, c = Math.cos(a), si = Math.sin(a), pt = (u, v) => `${(x + u * c - v * si).toFixed(1)},${(y + u * si + v * c).toFixed(1)}`; return `M${pt(9 * s, 0)} L${pt(-7 * s, -7 * s)} L${pt(-7 * s, 7 * s)} Z `; };
  function badge(parent, x, y, letter, fill) { const g = G(parent); tr(g, x, y); E('circle', { r: 26, fill, stroke: '#FFFFFF', 'stroke-width': 3 }, g); T(g, 0, 11, letter, { size: 32, weight: 700, anchor: 'middle', fill: '#FFFFFF' }); return g; }
  // time the circuit has been on before t, given on-intervals [[a, b], ...]
  const onTime = (t, iv) => iv.reduce((s, [a, b]) => s + Math.max(0, Math.min(t, b) - a), 0);
  // dots appear as a circuit closes and fade (already frozen) once it opens
  const onFade = (t, iv) => iv.reduce((m, [a, b]) => Math.max(m, P(t, a, 0.15, linear) * (1 - P(t, b, 0.3, linear))), 0);
  const dAng = (a, b) => ((((a - b) % 360) + 540) % 360) - 180;

  /* ================= A. the intro's nail, flashing up ================= */
  const Ag = G(root);
  const aRig0 = [560, 300];
  const aLeads = E('path', { fill: 'none', stroke: COPPER, 'stroke-width': 5.5, 'stroke-linecap': 'round' }, Ag);
  const aRig = nailRig(Ag); tr(aRig, aRig0[0], aRig0[1]);
  const aCell = aaCell(Ag); tr(aCell, 560, 486);
  const aCs = [aRig0[0] + aRig.start[0], aRig0[1] + aRig.start[1]], aCe = [aRig0[0] + aRig.end[0], aRig0[1] + aRig.end[1]];
  const aLA = [[476, 486], [410, 488], [aCs[0] - 4, aCs[1] + 96], aCs], aLB = [aCe, [aCe[0] + 2, aCe[1] + 96], [707, 488], [637, 486]];
  aLeads.setAttribute('d', bezD(...aLA) + ' ' + bezD(...aLB));
  const aTrack = track([...bezPts(...aLA, 16), ...shift(aRig.samples(), aRig0[0], aRig0[1]), ...bezPts(...aLB, 16)]);
  const aGlow = E('ellipse', { cx: 772, cy: 300, rx: 66, ry: 50, fill: glow(C.energy), opacity: 0.5 }, Ag);
  chain(772, 302, 3, 0, 1).forEach(p => tr(clip(Ag), p[0], p[1], 1, p[2]));

  /* ================= B. a straight wire through a card ================= */
  const Bg = G(root);
  const K = 0.42, WX = 600, CY = 430;
  E('line', { x1: WX, y1: 690, x2: WX, y2: CY, stroke: COPPER, 'stroke-width': 9, 'stroke-linecap': 'round' }, Bg);
  E('path', { d: `M180,${CY + 126} L1020,${CY + 126} L960,${CY - 126} L240,${CY - 126} Z`, fill: 'rgba(200,230,250,0.10)', stroke: '#9FB8C8', 'stroke-width': 3, 'stroke-linejoin': 'round' }, Bg);
  const rings = [125, 215].map(r => {
    let h = '';
    [55, 125, 235, 305].forEach(phd => { const ph = phd * Math.PI / 180; h += head(WX + r * Math.cos(ph), CY + r * K * Math.sin(ph), Math.atan2(-r * K * Math.cos(ph), r * Math.sin(ph)) * 180 / Math.PI, 1.2); });
    const g = G(Bg);
    g.ring = E('ellipse', { cx: WX, cy: CY, rx: r, ry: r * K, fill: 'none', stroke: FIELD, 'stroke-width': 4, pathLength: 1, 'stroke-dasharray': '1 1' }, g);
    g.heads = E('path', { d: h, fill: FIELD }, g);
    return g;
  });
  E('ellipse', { cx: WX, cy: CY, rx: 12, ry: 5, fill: C.bg0 }, Bg);
  E('line', { x1: WX, y1: CY, x2: WX, y2: 120, stroke: COPPER, 'stroke-width': 9, 'stroke-linecap': 'round' }, Bg);
  const bTrack = track([[WX, 690, 1], [WX, CY + 126, 1], [WX, CY + 126, 0.45], [WX, CY, 0.45], [WX, CY, 1], [WX, 120, 1]]);
  const COMP = [45, 135, 225, 315].map(phd => {
    const ph = phd * Math.PI / 180, c = compass(Bg, 34);
    tr(c, WX + 300 * Math.cos(ph), CY + 300 * K * Math.sin(ph));
    return { c, target: Math.atan2(-K * Math.cos(ph), Math.sin(ph)) * 180 / Math.PI };
  });
  const curArrow = arrow(Bg, 650, 262, 650, 168, { color: C.energy, width: 6 });
  const curLab = T(Bg, 674, 228, 'current', { size: 32, weight: 700, fill: C.energy });
  const fieldLab = labelLine(Bg, 836, 646, WX + 215 * Math.cos(1.25), CY + 215 * K * Math.sin(1.25), 'magnetic field', { size: 32, weight: 700, fill: FIELD, line: FIELD });

  /* ================= C. the solenoid on the 3 V battery ================= */
  const Cg = G(root);
  const XL = 330, XR = 870, Y0 = 330, RC = 78, BOT = 640, XM = 600;
  const cBack = G(Cg), cInner = G(Cg), cFront = G(Cg), cOuter = G(Cg), cCirc = G(Cg);
  const sol = solenoid(cBack, cFront, { turns: 8, x0: XL, x1: XR, y0: Y0, R: RC, yaw: 0.3, wire: 7, steps: 14 });
  // little loop fields around the top (current out of the page) and bottom (into the page) of each turn
  const small = G(cOuter);
  { let d = '', h = '';
    for (let k = 1; k <= 8; k++) { const x = XL + 540 * (2 * k - 1) / 16, y = Y0 - RC; d += `M${x + 24},${y} A24,24 0 1 0 ${x - 24},${y} A24,24 0 1 0 ${x + 24},${y} `; h += head(x, y + 24, 0, 1) + head(x, y - 24, 180, 1); }
    for (let k = 1; k <= 7; k++) { const x = XL + 540 * 2 * k / 16, y = Y0 + RC; d += `M${x + 24},${y} A24,24 0 1 0 ${x - 24},${y} A24,24 0 1 0 ${x + 24},${y} `; h += head(x, y - 24, 0, 1) + head(x, y + 24, 180, 1); }
    E('path', { d, fill: 'none', stroke: FIELD, 'stroke-width': 3 }, small); E('path', { d: h, fill: FIELD }, small); }
  // the field: straight inside (S to N), loops outside (N to S), straight lines out of each end
  const INS_H = [-62, -40, -18, 0, 18, 40, 62];
  const inner = G(cInner);
  E('path', { d: INS_H.map(h => `M${XL},${Y0 + h} L${XR},${Y0 + h}`).join(' '), fill: 'none', stroke: FIELD, 'stroke-width': 3.2, opacity: 0.9 }, inner);
  const innerHeads = [0, 180].map(a => E('path', { d: INS_H.map((h, i) => head(XM + (i % 2 ? 40 : -40), Y0 + h, a, 1.1)).join(''), fill: FIELD }, inner));
  const LOOPS = [[18, 205, 175], [40, 160, 125], [62, 118, 80]];
  const outer = G(cOuter), loopEls = [];
  LOOPS.forEach(([h, H, ex]) => [-1, 1].forEach(sg => {
    const y = v => Y0 + sg * v;
    loopEls.push(E('path', { d: `M${XR},${y(h)} C${XR + 1.3 * ex},${y(h)} ${XR + ex},${y(H)} ${XM},${y(H)} C${XL - ex},${y(H)} ${XL - 1.3 * ex},${y(h)} ${XL},${y(h)}`, fill: 'none', stroke: FIELD, 'stroke-width': 3.6, pathLength: 1, 'stroke-dasharray': '1 1' }, outer));
  }));
  loopEls.push(E('path', { d: `M${XR},${Y0} L${XR + 270},${Y0}`, fill: 'none', stroke: FIELD, 'stroke-width': 3.6, pathLength: 1, 'stroke-dasharray': '1 1' }, outer));
  loopEls.push(E('path', { d: `M${XL},${Y0} L${XL - 270},${Y0}`, fill: 'none', stroke: FIELD, 'stroke-width': 3.6, pathLength: 1, 'stroke-dasharray': '1 1' }, outer));
  const outerHeads = [0, 1].map(rev => {
    let h = '';
    LOOPS.forEach(([, H]) => [-1, 1].forEach(sg => { h += head(XM, Y0 + sg * H, rev ? 0 : 180, 1.3); }));
    h += head(XR + 205, Y0, rev ? 180 : 0, 1.3) + head(XL - 80, Y0, rev ? 180 : 0, 1.3);
    return E('path', { d: h, fill: FIELD }, outer);
  });
  // the circuit: switch and the 3 V battery on the bottom wire (+ on the left: current runs clockwise)
  const cWires = E('path', { fill: 'none', stroke: COPPER, 'stroke-width': 6, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, cCirc);
  const wiresD = R => `M541,${BOT} L480,${BOT} M380,${BOT} L${XL},${BOT} L${XL},${(Y0 + R).toFixed(1)} M${XR},${(Y0 + R).toFixed(1)} L${XR},${BOT} L659,${BOT}`;
  cWires.setAttribute('d', wiresD(RC));
  const cSw = switchSym(cCirc); tr(cSw, 430, BOT);
  const cBat = cellSym(cCirc, { cells: 2 }); tr(cBat, 600, BOT);
  const cTrack = track([[541, BOT, 1], [480, BOT, 1], [380, BOT, 1], [XL, BOT, 1], [XL, Y0 + RC, 1], ...sol.samples(), [XR, Y0 + RC, 1], [XR, BOT, 1], [659, BOT, 1]]);

  /* ================= D. three ways to make it stronger ================= */
  const Dg = G(root);
  const PX = [215, 600, 985], PY = 330, PR = 36, PB = 508;
  function miniField(parent, cx, loops, width) {
    const xl = cx - 100, xr = cx + 100;
    let d = '', h = '';
    loops.forEach(([e, H, ex]) => [-1, 1].forEach(sg => {
      const y = v => PY + sg * v;
      d += `M${xr},${y(e)} C${xr + 1.3 * ex},${y(e)} ${xr + ex},${y(H)} ${cx},${y(H)} C${xl - ex},${y(H)} ${xl - 1.3 * ex},${y(e)} ${xl},${y(e)} `;
      h += head(cx, y(H), 180, 0.9);
    }));
    d += `M${xr},${PY} L${xr + 62},${PY} M${xl - 62},${PY} L${xl},${PY}`;
    h += head(xr + 50, PY, 0, 0.9) + head(xl - 26, PY, 0, 0.9);
    const g = G(parent);
    E('path', { d, fill: 'none', stroke: FIELD, 'stroke-width': width }, g);
    E('path', { d: h, fill: FIELD }, g);
    return g;
  }
  const PANELS = ['more turns', 'more current', 'iron core'].map((title, i) => {
    const cx = PX[i], p = { cx };
    p.g = G(Dg);
    card(p.g, cx - 175, 150, 350, 458, { fill: C.card, stroke: C.line });
    p.ttl = T(p.g, cx, 200, title, { size: 32, weight: 700, anchor: 'middle' });
    p.back = G(p.g); p.core = G(p.g); p.front = G(p.g);
    p.c8 = solenoid(p.back, p.front, { turns: 8, x0: cx - 100, x1: cx + 100, y0: PY, R: PR, yaw: 0.3, wire: 4.5, steps: 8 });
    if (i === 0) { p.b16 = G(p.back); p.f16 = G(p.front); p.c16 = solenoid(p.b16, p.f16, { turns: 16, x0: cx - 100, x1: cx + 100, y0: PY, R: PR, yaw: 0.3, wire: 4, steps: 8 }); }
    if (i === 2) { p.bar = E('rect', { x: cx - 108, y: PY - 21, width: 216, height: 42, rx: 6, fill: linGrad('#B9C5D0', '#5E6B78', true), stroke: '#DCE4EA', 'stroke-width': 2 }, p.core); }
    p.weak = miniField(p.g, cx, [[8, 78, 46], [19, 60, 35], [30, 44, 25]], 2.6);
    p.strong = miniField(p.g, cx, [[5, 100, 58], [12, 88, 50], [19, 76, 42], [26, 64, 34], [32, 52, 26]], i === 2 ? 4.4 : 2.4);
    const bx = cx - 40, pe = bx - 59 * 0.6, ne = bx + 59 * 0.6, ax = cx + 52;
    let wd = `M${pe},${PB} L${cx - 100},${PB} L${cx - 100},${PY + PR} M${cx + 100},${PY + PR} L${cx + 100},${PB} L${i === 1 ? ax + 39 : ne},${PB}`;
    if (i === 1) wd += ` M${ax - 39},${PB} L${ne},${PB}`;
    E('path', { d: wd, fill: 'none', stroke: COPPER, 'stroke-width': 4.5, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, p.g);
    const bat = cellSym(p.g, { cells: 2, signs: false }); tr(bat, bx, PB, 0.6);
    const mk = coil => { const end = i === 1 ? [[ax + 39, PB, 1], [ax + 20, PB, 1], [ax + 20, PB, 0], [ax - 20, PB, 0], [ax - 20, PB, 1], [ax - 39, PB, 1]] : []; return track([[pe, PB, 1], [cx - 100, PB, 1], [cx - 100, PY + PR, 1], ...coil.samples(), [cx + 100, PY + PR, 1], [cx + 100, PB, 1], ...end, [ne, PB, 1]]); };
    p.t8 = mk(p.c8); if (p.c16) p.t16 = mk(p.c16);
    if (i === 1) { const am = meterSym(p.g, 'A'); tr(am, ax, PB, 0.85); p.read = T(p.g, ax, PB - 38, '0.4 A', { size: 28, weight: 700, anchor: 'middle', fill: C.energy }); }
    p.cnt = G(p.g); tr(p.cnt, cx, 568);
    E('rect', { x: -74, y: -25, width: 148, height: 50, rx: 25, fill: C.card2, stroke: C.line, 'stroke-width': 2 }, p.cnt);
    tr(clip(p.cnt), -44, 0, 0.5, 90);
    p.num = T(p.cnt, 20, 11, '× 4', { size: 30, weight: 700, anchor: 'middle' });
    p.bx = cx - textWidth(title, 32, FD, 700) / 2 - 34;
    p.badge = G(p.g); tr(p.badge, p.bx, 189);
    E('circle', { r: 25, fill: C.energy }, p.badge);
    T(p.badge, 0, 11, 'TIC'[i], { size: 32, weight: 700, anchor: 'middle', fill: C.bg0 });
    return p;
  });
  const ticCard = G(Dg);
  E('rect', { x: 230, y: 632, width: 740, height: 62, rx: 31, fill: C.card2, stroke: C.energy, 'stroke-width': 3 }, ticCard);
  T(ticCard, 600, 674, '**TIC**: **T**urns, **I**ncrease the current, **C**ore', { size: 32, weight: 600, anchor: 'middle', boldFill: C.energy });

  /* ================= E. a bigger battery boosts only an electromagnet ================= */
  const Eg = G(root);
  E('line', { x1: 600, y1: 140, x2: 600, y2: 680, stroke: C.line, 'stroke-width': 3, 'stroke-dasharray': '10 10' }, Eg);
  const eL = G(Eg), eR = G(Eg);
  T(eL, 300, 176, 'electromagnet', { size: 40, weight: 700, anchor: 'middle' });
  T(eR, 900, 176, 'permanent magnet', { size: 40, weight: 700, anchor: 'middle' });
  const E0 = [282, 300], ES = 0.92, EBY = 488;
  const eL0 = E0[0] + ES * -120, eL1 = E0[0] + ES * 110, eLY = E0[1] + ES * 21;
  E('path', { d: `M${E0[0] - 42},${EBY} L${eL0},${EBY} L${eL0},${eLY} M${eL1},${eLY} L${eL1},${EBY} L${E0[0] + 42},${EBY}`, fill: 'none', stroke: COPPER, 'stroke-width': 5, 'stroke-linejoin': 'round' }, eL);
  const eRig = nailRig(eL); tr(eRig, E0[0], E0[1], ES);
  const eB1 = cellSym(eL); tr(eB1, E0[0], EBY);
  const eB2 = cellSym(eL, { cells: 2 }); tr(eB2, E0[0], EBY);
  const eV1 = T(eL, E0[0], EBY + 74, '1.5 V', { size: 32, weight: 700, anchor: 'middle', fill: C.energy });
  const eV2 = T(eL, E0[0], EBY + 74, '3 V', { size: 32, weight: 700, anchor: 'middle', fill: C.energy });
  const eTrack = track([[E0[0] - 42, EBY, 1], [eL0, EBY, 1], [eL0, eLY, 1], ...shift(eRig.samples(), E0[0], E0[1], ES), [eL1, eLY, 1], [eL1, EBY, 1], [E0[0] + 42, EBY, 1]]);
  const eTip = [E0[0] + 212 * ES, E0[1] + 1], ecr = rng(8);
  const eClips = [0, 1, 2, 3, 4].map(i => ({ g: clip(eL), hx: 410 + i * 30 + (ecr() - 0.5) * 10, hy: 640 + (ecr() - 0.5) * 14, hr: 80 + ecr() * 40 + (i % 2 ? 180 : 0) }));
  const eMag = magnet(eR, 230, 66); tr(eMag, 900, 300);
  chain(995, 334, 2, 0, 0.8).forEach(p => tr(clip(eR), p[0], p[1], 0.8, p[2]));
  const eCell = aaCell(eR);
  const eX = cross(eR, 34); tr(eX, 900, 476);
  const eChip = chip(eR, 'no battery', { size: 30, fill: C.card2, stroke: C.line }); tr(eChip, 900, 574);

  /* ================= F. the scrapyard crane ================= */
  const Fg = G(root);
  E('rect', { x: 0, y: 662, width: W, height: 88, fill: '#112430' }, Fg);
  E('line', { x1: 0, y1: 662, x2: W, y2: 662, stroke: '#2C4A5A', 'stroke-width': 3 }, Fg);
  const YJ = 160, YEL = '#F2B33D';
  { let zz = 'M132,662'; for (let k = 0, y = 662; y > 200; k++, y -= 40) zz += ` L${k % 2 ? 132 : 168},${y - 40}`;
    E('path', { d: `M132,662 L132,${YJ + 22} M168,662 L168,${YJ + 22}`, stroke: YEL, 'stroke-width': 6 }, Fg);
    E('path', { d: zz, fill: 'none', stroke: YEL, 'stroke-width': 3.5, 'stroke-linejoin': 'round' }, Fg);
    let jz = `M60,${YJ + 22}`; for (let k = 0, x = 60; x < 1090; k++, x += 30) jz += ` L${x + 30},${k % 2 ? YJ + 22 : YJ}`;
    E('path', { d: `M60,${YJ} L1090,${YJ} M60,${YJ + 22} L1090,${YJ + 22}`, stroke: YEL, 'stroke-width': 6 }, Fg);
    E('path', { d: jz, fill: 'none', stroke: YEL, 'stroke-width': 3, 'stroke-linejoin': 'round' }, Fg);
    E('path', { d: `M132,${YJ} L150,${YJ - 42} L168,${YJ} M150,${YJ - 42} L60,${YJ} M150,${YJ - 42} L620,${YJ}`, fill: 'none', stroke: YEL, 'stroke-width': 3 }, Fg);
    E('rect', { x: 66, y: YJ + 24, width: 54, height: 46, rx: 4, fill: '#7D8A97', stroke: '#A9B6C2', 'stroke-width': 2 }, Fg);
    E('rect', { x: 172, y: YJ + 24, width: 58, height: 42, rx: 6, fill: YEL }, Fg);
    E('rect', { x: 182, y: YJ + 31, width: 38, height: 22, rx: 4, fill: '#BFE3FF' }, Fg); }
  const pile = G(Fg); tr(pile, 975, 662);
  E('path', { d: 'M-140,0 Q-118,-56 -56,-74 Q0,-92 56,-74 Q118,-56 140,0 Z', fill: '#3E3730', stroke: '#6E6052', 'stroke-width': 3 }, pile);
  E('path', { d: 'M-96,-30 L-40,-52 L-30,-36 L-86,-14 Z M18,-70 L76,-58 L70,-42 L14,-54 Z M60,-28 L112,-20 L104,-6 L56,-12 Z', fill: '#8F9CAB', stroke: '#C9D3DC', 'stroke-width': 2, 'stroke-linejoin': 'round' }, pile);
  E('circle', { cx: -30, cy: -66, r: 18, fill: 'none', stroke: '#22272C', 'stroke-width': 9 }, pile);
  E('path', { d: 'M-12,-26 L40,-34', stroke: '#B5653A', 'stroke-width': 9, 'stroke-linecap': 'round' }, pile);
  function carArt(parent) {
    const g = G(parent);
    E('path', { d: 'M-104,-26 L-104,-50 Q-103,-60 -90,-62 L-58,-64 L-34,-92 Q-28,-98 -18,-98 L42,-98 Q52,-98 58,-90 L80,-64 L96,-60 Q105,-57 105,-44 L105,-26 Q105,-18 97,-18 L-96,-18 Q-104,-18 -104,-26 Z', fill: ball('#D27A45', '#7E3E1C'), stroke: '#F0B48A', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, g);
    E('path', { d: 'M-28,-88 L-48,-64 L-6,-64 L-6,-88 Z M2,-88 L2,-64 L70,-64 L52,-88 Z', fill: '#BFE3FF', opacity: 0.9 }, g);
    [-60, 62].forEach(x => { E('circle', { cx: x, cy: -18, r: 18, fill: '#1E2730', stroke: '#8F9CAB', 'stroke-width': 4 }, g); E('circle', { cx: x, cy: -18, r: 6, fill: '#C9D3DC' }, g); });
    E('rect', { x: 93, y: -54, width: 10, height: 8, rx: 3, fill: '#FFE45C' }, g);
    return g;
  }
  const car = carArt(Fg);
  const trolley = G(Fg);
  E('rect', { x: -26, y: YJ + 22, width: 52, height: 16, rx: 4, fill: '#57636F', stroke: '#A9B6C2', 'stroke-width': 2 }, trolley);
  const cable = E('line', { stroke: '#C9D3DC', 'stroke-width': 4 }, Fg);
  const emag = G(Fg);
  const emGlow = E('ellipse', { cx: 0, cy: 34, rx: 150, ry: 66, fill: glow(C.energy) }, emag);
  E('path', { d: 'M0,-42 L0,-30', stroke: '#9FB2C0', 'stroke-width': 6 }, emag);
  E('rect', { x: -86, y: -26, width: 172, height: 46, rx: 10, fill: linGrad('#6B7884', '#36404A', true), stroke: '#9FB2C0', 'stroke-width': 2.5 }, emag);
  E('ellipse', { cx: 0, cy: -26, rx: 86, ry: 11, fill: '#7D8A97', stroke: '#9FB2C0', 'stroke-width': 2.5 }, emag);
  E('rect', { x: -86, y: -8, width: 172, height: 13, fill: COPPER }, emag);
  const inset = G(Fg);
  card(inset, 232, 236, 300, 236, { fill: C.card, stroke: C.line });
  T(inset, 382, 278, 'permanent magnet?', { size: 27, weight: 700, anchor: 'middle', fill: C.muted });
  E('line', { x1: 382, y1: 292, x2: 382, y2: 318, stroke: '#C9D3DC', 'stroke-width': 3 }, inset);
  const insMag = magnet(inset, 160, 48); tr(insMag, 382, 334);
  const insCar = carArt(inset);
  T(inset, 382, 454, 'would never let go!', { size: 27, weight: 700, anchor: 'middle', fill: '#FF9AA2' });

  /* ================= G. five uses ================= */
  const Gg = G(root);
  const TX = [210, 470, 730, 990];
  const tiles = ['bell', 'loudspeaker', 'motor', 'relay'].map((name, i) => {
    const g = G(Gg), cx = TX[i];
    const box = card(g, cx - 120, 130, 240, 250, { fill: C.card, stroke: C.line });
    const art = G(g); tr(art, cx - (i === 0 ? 14 : 0), 238);
    T(g, cx, 356, name, { size: 30, weight: 700, anchor: 'middle' });
    return { g, box, art, cx };
  });
  // bell: an electromagnet pulls the arm, the hammer strikes the gong, over and over
  const bellArm = G(tiles[0].art);
  { const a = tiles[0].art;
    E('path', { d: 'M-4,26 A50,50 0 0 1 96,26 Z', fill: ball('#FFD24A', '#B7860F'), stroke: '#FFE89A', 'stroke-width': 2 }, a);
    E('path', { d: 'M46,26 L46,62 M10,62 L82,62', stroke: '#8F9CAB', 'stroke-width': 6, 'stroke-linecap': 'round' }, a);
    E('rect', { x: -86, y: 18, width: 36, height: 44, rx: 5, fill: COPPER, stroke: '#F2B27A', 'stroke-width': 2 }, a);
    E('path', { d: 'M-86,28 L-50,28 M-86,40 L-50,40 M-86,52 L-50,52', stroke: COPPER_DK, 'stroke-width': 3 }, a);
    E('path', { d: 'M-96,62 L-96,2', stroke: '#8F9CAB', 'stroke-width': 6, 'stroke-linecap': 'round' }, a);
    E('path', { d: 'M0,0 L80,0', stroke: '#C9D3DC', 'stroke-width': 6, 'stroke-linecap': 'round' }, bellArm);
    E('circle', { cx: 86, cy: 0, r: 11, fill: ball('#C9D3DC', '#66737F') }, bellArm);
    tr(bellArm, -96, 2); }
  const bellArcs = E('path', { d: 'M104,-6 Q114,10 104,26 M116,-14 Q130,10 116,34', fill: 'none', stroke: C.ink, 'stroke-width': 4, 'stroke-linecap': 'round' }, tiles[0].art);
  // loudspeaker: coil and magnet behind a cone that pulses
  const cone = G(tiles[1].art), spArcs = [];
  { const a = tiles[1].art;
    E('rect', { x: -96, y: -28, width: 34, height: 56, rx: 5, fill: '#57636F', stroke: '#8F9CAB', 'stroke-width': 2 }, a);
    E('rect', { x: -64, y: -16, width: 14, height: 32, fill: COPPER }, cone);
    E('path', { d: 'M-52,-18 L12,-70 L12,70 L-52,18 Z', fill: '#2E3B47', stroke: '#9FB2C0', 'stroke-width': 3, 'stroke-linejoin': 'round' }, cone);
    E('ellipse', { cx: 12, cy: 0, rx: 9, ry: 70, fill: '#4A5561', stroke: '#9FB2C0', 'stroke-width': 3 }, cone);
    for (let k = 0; k < 3; k++) spArcs.push(E('path', { d: `M${36 + k * 22},${-28 - k * 10} Q${50 + k * 26},0 ${36 + k * 22},${28 + k * 10}`, fill: 'none', stroke: C.ink, 'stroke-width': 4, 'stroke-linecap': 'round' }, a)); }
  // motor: the motor symbol beside a rotor spinning between N and S
  const rotor = G(tiles[2].art);
  { const a = tiles[2].art;
    const m = meterSym(a, 'M'); tr(m, 0, -64, 0.9);
    E('rect', { x: -98, y: 2, width: 30, height: 62, rx: 5, fill: ball(RED, '#A4232E') }, a);
    E('rect', { x: 68, y: 2, width: 30, height: 62, rx: 5, fill: ball(BLUE, '#1E4FA8') }, a);
    T(a, -83, 44, 'N', { size: 26, weight: 700, anchor: 'middle', fill: '#FFFFFF' });
    T(a, 83, 44, 'S', { size: 26, weight: 700, anchor: 'middle', fill: '#FFFFFF' });
    E('rect', { x: -52, y: -9, width: 104, height: 18, rx: 6, fill: '#8F9CAB' }, rotor);
    E('rect', { x: -50, y: -14, width: 22, height: 28, rx: 4, fill: COPPER }, rotor);
    E('rect', { x: 28, y: -14, width: 22, height: 28, rx: 4, fill: COPPER }, rotor);
    E('circle', { r: 6, fill: '#DCE4EA' }, rotor); }
  // relay: a small coil pulls an iron lever down onto a contact, closing the big circuit of a lamp
  const relayGlow = E('ellipse', { cx: -61, cy: 18, rx: 44, ry: 44, fill: glow(C.energy) }, tiles[3].art);
  const relayLever = G(tiles[3].art);
  const rBulb = bulbSym(tiles[3].art);
  { const a = tiles[3].art;
    E('path', { d: 'M-102,-30 L-102,-72 L-23,-72 M23,-72 L96,-72 L96,58 L18,58 L18,-10', fill: 'none', stroke: WIRE, 'stroke-width': 4, 'stroke-linejoin': 'round' }, a);
    tr(rBulb, 0, -72, 0.5);
    E('circle', { cx: 18, cy: -10, r: 5, fill: WIRE }, a);
    E('rect', { x: -78, y: -6, width: 34, height: 46, rx: 5, fill: COPPER, stroke: '#F2B27A', 'stroke-width': 2 }, a);
    E('path', { d: 'M-78,4 L-44,4 M-78,16 L-44,16 M-78,28 L-44,28', stroke: COPPER_DK, 'stroke-width': 3 }, a);
    E('rect', { x: -68, y: -16, width: 14, height: 10, fill: '#8F9CAB' }, a);
    E('path', { d: 'M-102,58 L-102,-30', stroke: '#8F9CAB', 'stroke-width': 6, 'stroke-linecap': 'round' }, a);
    E('rect', { x: 0, y: -5, width: 122, height: 10, rx: 4, fill: '#B9C5D0' }, relayLever);
    tr(relayLever, -102, -30); }
  // maglev: a train floating over its track, with a visible gap
  const mag = G(Gg);
  card(mag, 90, 404, 1020, 262, { fill: C.card, stroke: C.line });
  T(mag, 130, 456, 'maglev train', { size: 32, weight: 700 });
  E('rect', { x: 130, y: 602, width: 940, height: 18, rx: 4, fill: '#8F9CAB' }, mag);
  E('rect', { x: 170, y: 620, width: 860, height: 22, fill: '#57636F' }, mag);
  { let d = ''; for (let x = 150; x < 1060; x += 46) d += `M${x},604 L${x + 30},604 L${x + 30},612 L${x},612 Z `; E('path', { d, fill: COPPER }, mag); }
  const train = G(mag);
  E('path', { d: 'M-320,-6 L-320,-70 Q-320,-86 -304,-86 L210,-86 Q300,-84 334,-24 Q340,-6 322,-6 Z', fill: linGrad('#F4F8FA', '#B9C7D2', true), stroke: '#FFFFFF', 'stroke-width': 2 }, train);
  E('path', { d: 'M-320,-34 L320,-34 L330,-22 L-320,-22 Z', fill: '#2EC4B6' }, train);
  { let d = ''; for (let x = -290; x < 200; x += 62) d += `M${x},-72 L${x + 40},-72 L${x + 40},-50 L${x},-50 Z `; E('path', { d: d + 'M232,-74 L282,-74 Q300,-60 304,-50 L232,-50 Z', fill: '#2C5468' }, train); }
  { let d = ''; for (let x = -300; x < 300; x += 46) d += `M${x},-6 L${x + 30},-6 L${x + 30},0 L${x},0 Z `; E('path', { d, fill: COPPER }, train); }
  const gapGlow = E('rect', { x: 300, y: 590, width: 620, height: 8, rx: 4, fill: C.energy }, mag);
  const gapLab = labelLine(mag, 206, 566, 304, 594, 'gap', { size: 30, weight: 700, fill: C.energy, line: C.energy, anchor: 'end' });

  /* ================= H. try it at home / I. stay safe ================= */
  const Hg = G(root);
  card(Hg, 70, 132, 1060, 576, { fill: 'rgba(20,54,70,0.55)', stroke: C.line });
  const tryChip = chip(Hg, 'Try it at home!', { size: 32, fill: C.energy, color: C.bg0 }); tr(tryChip, 600, 132);
  const safeChip = chip(Hg, 'Stay safe', { size: 32, fill: '#4A1E26', stroke: C.bad, color: '#FF9AA2' }); tr(safeChip, 600, 132);
  const world = G(Hg);                                     // nail, cell, leads, clips (moves aside for "safe")
  const H0 = [520, 330], hCellP = [520, 520];
  const hLeadL = E('path', { fill: 'none', stroke: INS, 'stroke-width': 5, 'stroke-linecap': 'round' }, world);
  const hLeadR = E('path', { fill: 'none', stroke: INS, 'stroke-width': 5, 'stroke-linecap': 'round' }, world);
  const hTipL = E('path', { fill: 'none', stroke: '#F2B27A', 'stroke-width': 4.5, 'stroke-linecap': 'round' }, world);
  const hTipR = E('path', { fill: 'none', stroke: '#F2B27A', 'stroke-width': 4.5, 'stroke-linecap': 'round' }, world);
  const hRig = nailRig(world, { turns: 30, c0: -150, c1: 120, R: 20, wire: 4.2, color: INS, dark: INS_DK }); tr(hRig, H0[0], H0[1]);
  const hCell = aaCell(world); tr(hCell, hCellP[0], hCellP[1]);
  const hCs = [H0[0] + hRig.start[0], H0[1] + hRig.start[1]], hCe = [H0[0] + hRig.end[0], H0[1] + hRig.end[1]];
  const hPlus = [hCellP[0] - 84, hCellP[1]], hMinus = [hCellP[0] + 77, hCellP[1]];
  const leadL = tip => [tip, [tip[0] - 70, tip[1] + 2], [hCs[0] - 6, hCs[1] + 110], hCs];
  const leadR = tip => [hCe, [hCe[0] + 4, hCe[1] + 110], [tip[0] + 70, tip[1] + 2], tip];
  // (thirty turns are too tight to show dots on; the current shows in the leads)
  const hTrack = track([...bezPts(...leadL(hPlus), 16), ...shift(hRig.samples(), H0[0], H0[1]).map(p => [p[0], p[1], 0]), ...bezPts(...leadR(hMinus), 16)]);
  const hWarm = E('ellipse', { cx: H0[0] - 15, cy: H0[1], rx: 190, ry: 60, fill: glow(C.heat) }, world);
  world.insertBefore(hWarm, world.firstChild);
  const hHeat = heatWaves(world, { n: 3, h: 110, spacing: 84, width: 7 }); tr(hHeat, H0[0] - 15, H0[1] - 36);
  const hcr = rng(23);
  const hClips = [0, 1, 2, 3, 4, 5].map(i => ({ g: clip(world), hx: 760 + i * 30 + (hcr() - 0.5) * 12, hy: 646 + (hcr() - 0.5) * 16, hr: 80 + hcr() * 40 + (i % 2 ? 180 : 0) }));
  const hTip = [H0[0] + 212, H0[1] + 2];
  const turnsLab = G(Hg);
  E('line', { x1: 318, y1: 248, x2: H0[0] - 120, y2: H0[1] - 24, stroke: C.muted, 'stroke-width': 2.5 }, turnsLab);
  E('circle', { cx: H0[0] - 120, cy: H0[1] - 24, r: 4.5, fill: C.muted }, turnsLab);
  const turnsTxt = T(turnsLab, 300, 238, '0 turns', { size: 32, weight: 700, anchor: 'middle', fill: C.ink });
  const voltLab = labelLine(Hg, 312, 612, hCellP[0] - 60, hCellP[1] + 22, '1.5 V AA', { size: 32, weight: 700 });
  const counter = G(Hg); tr(counter, 964, 330);
  E('rect', { x: -112, y: -30, width: 224, height: 60, rx: 30, fill: C.card2, stroke: C.energy, 'stroke-width': 3 }, counter);
  tr(clip(counter), -78, 0, 0.55, 90);
  const cntTxt = T(counter, 18, 12, 'lifted: 0', { size: 30, weight: 700, anchor: 'middle' });
  // stay safe: never the mains; lift the wire off between tries
  const plug = G(Hg); tr(plug, 270, 360);
  E('path', { d: 'M0,92 Q0,140 40,160', fill: 'none', stroke: '#E9EFF3', 'stroke-width': 16, 'stroke-linecap': 'round' }, plug);
  E('rect', { x: -74, y: -78, width: 148, height: 170, rx: 24, fill: linGrad('#F4F8FA', '#C5D2DC', true), stroke: '#9FB2C0', 'stroke-width': 3 }, plug);
  E('path', { d: 'M-9,-56 L9,-56 L9,-12 L-9,-12 Z M-56,20 L-20,20 L-20,38 L-56,38 Z M20,20 L56,20 L56,38 L20,38 Z', fill: '#8F9CAB', stroke: '#57636F', 'stroke-width': 2 }, plug);
  const plugX = cross(Hg, 64); tr(plugX, 270, 362);
  const mainsChip = chip(Hg, 'never the mains', { size: 30, fill: C.card2, stroke: C.bad }); tr(mainsChip, 270, 590);
  const discChip = chip(Hg, 'disconnect between tries', { size: 30, fill: C.card2, stroke: C.line }); tr(discChip, 820, 640);
  // a hand pinching at its origin: index finger above, thumb below, sleeve off to the right
  const hand = G(Hg);
  { const SK = '#E7B48A', SKD = '#B7845A';
    E('rect', { x: 104, y: -40, width: 130, height: 80, rx: 14, fill: '#5B8DEF' }, hand);
    E('ellipse', { cx: 76, cy: 0, rx: 46, ry: 38, fill: SK, stroke: SKD, 'stroke-width': 3 }, hand);
    E('rect', { x: -2, y: -21, width: 90, height: 20, rx: 10, fill: SK, stroke: SKD, 'stroke-width': 3 }, hand);
    E('rect', { x: 4, y: 3, width: 70, height: 19, rx: 9.5, fill: SK, stroke: SKD, 'stroke-width': 3 }, hand);
    E('path', { d: 'M58,-14 Q66,-6 58,2 M64,10 Q72,16 66,24', fill: 'none', stroke: SKD, 'stroke-width': 2.5, 'stroke-linecap': 'round' }, hand); }

  /* ================= shared current dots, then labels on top ================= */
  const poolG = G(root), POOL = [];
  for (let i = 0; i < 112; i++) POOL.push(E('circle', { r: 5.5, fill: C.energy }, poolG));
  let used = 0;
  // dots along a track; s0 = distance moved; m = [tx, ty, scale] maps the track into the stage
  function runDots(tk, s0, spacing, r, a, m) {
    if (a <= 0.002) return;
    const n = Math.max(2, Math.round(tk.L / spacing));
    for (let k = 0; k < n && used < POOL.length; k++) {
      const d = POOL[used++], q = trackAt(tk, k * tk.L / n + s0);
      const sc = m ? m[2] : 1;
      attr(d, 'cx', m ? m[0] + sc * q[0] : q[0]); attr(d, 'cy', m ? m[1] + sc * q[1] : q[1]); attr(d, 'r', r * sc);
      op(d, a * q[2]);
    }
  }
  const Lg = G(root);
  const bN = badge(Lg, XR + 4, Y0, 'N', RED), bS = badge(Lg, XL - 4, Y0, 'S', BLUE);
  const bN2 = badge(Lg, XL - 4, Y0, 'N', RED), bS2 = badge(Lg, XR + 4, Y0, 'S', BLUE);
  const emChip = chip(Lg, 'electromagnet', { size: 32, fill: C.card2, stroke: C.energy, color: C.energy }); tr(emChip, 846, 70);
  const solLab = labelLine(Lg, 940, 196, XR + 14, Y0 - RC + 34, 'solenoid', { size: 34, weight: 700, fill: C.ink, anchor: 'start' });
  const swOn = T(Lg, 430, 694, 'on', { size: 30, weight: 700, anchor: 'middle', fill: C.good });
  const swOff = T(Lg, 430, 694, 'off', { size: 30, weight: 700, anchor: 'middle', fill: '#FF9AA2' });

  // the solenoid's circuit: on from the coil line; the switch opens twice; the battery turns round
  const tOn0 = mid('coil', 0.42);
  const tO1 = mid('switch', 0.28), tC1 = mid('switch', 0.44), tO2 = mid('switch', 0.6), tC2 = end('switch') + 0.25;
  const tF0 = mid('reverse', 0.12), tF1 = tF0 + 0.7;
  const ON = [[tOn0, tO1], [tC1, tO2], [tC2, tF0], [tF1, 1e6]], ON_FWD = ON.slice(0, 3), ON_REV = ON.slice(3);
  let lastR = RC;

  return t => {
    used = 0;

    /* ---------- A + B: the nail flash, then the straight wire ---------- */
    const aA = win(t, S.first - 0.2, S.first + 1.0, 0.2);
    op(Ag, aA);
    if (aA > 0) { runDots(aTrack, t * 60, 30, 5.5, aA); op(aGlow, 0.5 * aA); }
    const aB = win(t, S.first + 0.75, at('coil') - 0.15, 0.35);
    op(Bg, aB);
    if (aB > 0) {
      const tI = mid('wire', 0.28), tF = mid('wire', 0.55);
      runDots(bTrack, Math.max(0, t - tI) * 60, 40, 6, aB * P(t, tI, 0.15, linear));
      curArrow.set(P(t, tI, 0.5)); op(curArrow, P(t, tI, 0.2, linear)); op(curLab, P(t, tI + 0.2, 0.4, linear));
      rings.forEach((g, i) => { const p = P(t, tF + i * 0.35, 0.7); g.ring.setAttribute('stroke-dashoffset', (1 - p).toFixed(3)); op(g.heads, P(t, tF + i * 0.35 + 0.5, 0.3, linear)); });
      COMP.forEach((o, i) => {
        const u = t - (tI + 0.25 + i * 0.08);
        const a = u <= 0 ? -90 : o.target + dAng(-90, o.target) * Math.exp(-4 * u) * Math.cos(9 * u * calm);
        o.c.set(a);
      });
      fieldLab.set(P(t, mid('wire', 0.82), 0.4, linear));
    }

    /* ---------- C. the solenoid ---------- */
    const aC = win(t, at('coil') - 0.25, at('stronger') - 0.1, 0.4);
    op(Cg, aC); op(Lg, 1);
    const rev = t >= tF1;
    let nsA = 0;
    if (aC > 0) {
      // curl the straight wire into the coil
      const cp = P(t, mid('coil', 0.04), 1.3);
      const R = lerp(0, RC, cp);
      if (R !== lastR) { lastR = R; sol.setR(R); cWires.setAttribute('d', wiresD(R)); }
      // switch and battery
      const closed = !(t >= tO1 && t < tC1) && !(t >= tO2 && t < tC2);
      cSw.set(closed ? 1 : 0);
      const fp = P(t, tF0, tF1 - tF0, linear), sx = Math.cos(Math.PI * fp);
      if (fp !== cBat._fp) { cBat._fp = fp; cBat.setAttribute('transform', `translate(600 ${BOT}) scale(${(Math.abs(sx) < 0.02 ? 0.02 : sx).toFixed(3)} 1)`); }
      // dots: everything starts and stops together; after the battery turns, they run the other way
      const s = 60 * (onTime(Math.min(t, tF0), ON_FWD) - onTime(t, ON_REV));
      if (t > tOn0) runDots(cTrack, s, 56, 6, aC * onFade(t, ON));
      // field strength follows the current
      let fOn = 0;
      for (const [a, b] of ON) fOn = Math.max(fOn, P(t, a, 0.35, linear) * (1 - P(t, b, 0.45, linear)));
      // little loop fields, then the straight field inside the coil
      op(small, win(t, mid('coil', 0.48), mid('coil', 0.86), 0.35) * fOn);
      op(inner, P(t, mid('coil', 0.7), 0.6, linear) * fOn);
      op(innerHeads[0], rev ? 0 : 1); op(innerHeads[1], rev ? 1 : 0);
      // the bar-magnet field outside
      loopEls.forEach((el, i) => el.setAttribute('stroke-dashoffset', (1 - P(t, mid('bar', 0.02) + i * 0.12, 0.9)).toFixed(3)));
      const oh = P(t, mid('bar', 0.32), 0.4, linear);
      op(outer, fOn); op(outerHeads[0], oh * (rev ? 0 : 1)); op(outerHeads[1], oh * (rev ? 1 : 0));
      nsA = fOn;
    }
    // pole badges: N right and S left; after the battery turns round, N left and S right
    const nP = P(t, mid('bar', 0.45), 0.5, pop), sP = P(t, mid('bar', 0.58), 0.5, pop);
    const swp = P(t, tF1 + 0.15, 0.5, pop);
    [[bN, XR + 4, nP, 1 - clamp(swp * 2)], [bS, XL - 4, sP, 1 - clamp(swp * 2)], [bN2, XL - 4, swp, clamp(swp * 2)], [bS2, XR + 4, swp, clamp(swp * 2)]].forEach(([b, x, p, k]) => { op(b, aC * nsA * clamp(p * 2) * k); tr(b, x, Y0, Math.max(0.01, p)); });
    op(emChip, aC * win(t, mid('bar', 0.8), at('stronger') - 0.2, 0.4));
    solLab.set(aC * win(t, mid('coil', 0.3), at('bar') + 0.1, 0.35));
    const sl = aC * win(t, at('switch'), at('stronger') - 0.2, 0.3);
    const closedNow = !(t >= tO1 && t < tC1) && !(t >= tO2 && t < tC2);
    op(swOn, sl * (closedNow ? 1 : 0)); op(swOff, sl * (closedNow ? 0 : 1));

    /* ---------- D. stronger: turns, current, core ---------- */
    const aD = win(t, at('stronger') - 0.15, at('battery') - 0.1, 0.4);
    op(Dg, aD);
    if (aD > 0) {
      const t1 = mid('stronger', 0.3), t2 = mid('stronger', 0.46), t3 = mid('stronger', 0.62), tOff3 = mid('stronger', 0.82), tBack3 = at('tic') + 0.2;
      PANELS.forEach((p, i) => { const pp = P(t, at('stronger') + i * 0.12, 0.5, pop); op(p.g, clamp(pp * 2)); tr(p.g, 0, (1 - clamp(pp)) * 22); });
      const tm = t - at('stronger');
      // 1: 8 turns -> 16 turns
      const p1 = P(t, t1, 0.5, linear), A1 = PANELS[0];
      op(A1.c8.back, 1 - p1); op(A1.c8.front, 1 - p1); op(A1.b16, p1); op(A1.f16, p1);
      op(A1.weak, 1 - p1); op(A1.strong, p1);
      setT(A1.num, '× ' + Math.round(lerp(4, 8, P(t, t1 + 0.2, 0.7, linear))));
      runDots(p1 < 0.5 ? A1.t8 : A1.t16, tm * 60, 64, 4.2, aD);
      // 2: more current: the reading doubles and the dots go twice as fast
      const p2 = P(t, t2, 0.5, linear), A2 = PANELS[1];
      op(A2.weak, 1 - p2); op(A2.strong, p2);
      setT(A2.read, p2 > 0.5 ? '0.8 A' : '0.4 A');
      setT(A2.num, '× ' + Math.round(lerp(4, 8, P(t, t2 + 0.2, 0.7, linear))));
      runDots(A2.t8, 60 * tm + 60 * Math.max(0, t - t2), 64, 4.2, aD);
      // 3: an iron core slides in; it switches off with the current, then back on for TIC
      const A3 = PANELS[2], pin = P(t, t3, 0.8);
      A3.bar.setAttribute('transform', `translate(${lerp(-140, 0, pin).toFixed(1)} 0)`); op(A3.bar, P(t, t3, 0.3, linear));
      const on3 = 1 - P(t, tOff3, 0.2, linear) + P(t, tBack3, 0.2, linear);
      const p3 = P(t, t3 + 0.4, 0.5, linear);
      op(A3.weak, (1 - p3) * on3); op(A3.strong, p3 * on3);
      const s3 = 60 * (onTime(t, [[at('stronger'), tOff3], [tBack3, 1e6]]));
      runDots(A3.t8, s3, 64, 4.2, aD * clamp(on3));
      const n3 = t < tOff3 ? lerp(4, 30, P(t, t3 + 0.25, 0.8, linear)) : t < tBack3 ? lerp(30, 0, P(t, tOff3, 0.3, linear)) : lerp(0, 30, P(t, tBack3, 0.5, linear));
      setT(A3.num, '× ' + Math.round(n3));
      // TIC
      PANELS.forEach((p, i) => { const bp = P(t, mid('tic', [0.36, 0.5, 0.84][i]), 0.45, pop); op(p.badge, clamp(bp * 2)); tr(p.badge, p.bx, 189, Math.max(0.01, bp)); });
      const tc = P(t, at('tic') + 0.05, 0.5, pop); op(ticCard, clamp(tc * 2)); tr(ticCard, 0, (1 - clamp(tc)) * 16);
    }

    /* ---------- E. a bigger battery ---------- */
    const aE = win(t, at('battery') - 0.15, at('crane') - 0.1, 0.4);
    op(Eg, aE);
    if (aE > 0) {
      const tB = mid('battery', 0.2);
      const bp = P(t, tB, 0.4, linear);
      op(eB1, 1 - bp); op(eB2, bp); op(eV1, 1 - bp); op(eV2, bp);
      runDots(eTrack, (t - at('battery')) * 60 + Math.max(0, t - tB) * 60, 30, 5, aE);
      const sway = calm * 2.5 * Math.sin(t * 2.1);
      const poses = chain(eTip[0], eTip[1], 4, sway, ES);
      eClips.forEach((c, i) => {
        let q = [c.hx, c.hy, c.hr];
        if (i < 2) q = poses[i];
        else if (i < 4) q = leap(t, c, poses[i], mid('battery', 0.26 + (i - 2) * 0.1));
        tr(c.g, q[0], q[1], ES, q[2]);
      });
      op(eR, P(t, mid('battery', 0.46), 0.5, linear));
      const cp = P(t, mid('battery', 0.58), 0.6, easeOut);
      tr(eCell, lerp(1080, 900, cp), 476, 0.9); op(eCell, cp);
      const xp = P(t, mid('battery', 0.7), 0.4, pop); op(eX, clamp(xp * 2)); tr(eX, 900, 476, Math.max(0.01, xp));
      op(eChip, P(t, mid('battery', 0.78), 0.4, linear));
    }

    /* ---------- F. the crane ---------- */
    const aF = win(t, at('crane') - 0.15, at('uses') - 0.1, 0.4);
    op(Fg, aF);
    if (aF > 0) {
      const tOn = mid('crane', 0.13), tL0 = mid('crane', 0.17), tL1 = mid('crane', 0.33), tM0 = mid('crane', 0.35), tM1 = mid('crane', 0.52), tOff = mid('crane', 0.57);
      const xt = lerp(520, 950, P(t, tM0, tM1 - tM0));
      const yDown = lerp(330, 544, P(t, at('crane') - 0.1, tOn - at('crane') - 0.05)), ym = t < tL0 ? yDown : lerp(544, 300, P(t, tL0, tL1 - tL0));
      const swing = calm * (16 * Math.sin(Math.PI * P(t, tM0, tM1 - tM0, linear)) + 9 * Math.sin((t - tM1) * 4.2) * Math.exp(-Math.max(0, t - tM1) * 1.4) * (t > tM1 ? 1 : 0));
      const xm = xt - swing;
      tr(trolley, xt, 0);
      attr(cable, 'x1', xt); attr(cable, 'y1', YJ + 38); attr(cable, 'x2', xm); attr(cable, 'y2', ym - 42);
      tr(emag, xm, ym, 1, swing * 0.25);
      const on = t >= tOn && t < tOff;
      op(emGlow, (P(t, tOn, 0.3, linear) * (1 - P(t, tOff, 0.25, linear))) * (0.75 + 0.25 * wave(t, 0.9)));
      if (on) runDots(track([[xt, YJ + 38, 1], [xm, ym - 42, 1]]), (t - tOn) * 60, 30, 5.5, aF);
      // the car: on the ground, carried, then dropped onto the pile with a bounce
      let cx = 520, cy = 662, cr = 0;
      if (t >= tOn && t < tOff) { cx = xm; cy = ym + 118; cr = swing * 0.25; }
      else if (t >= tOff) {
        const f = clamp((t - tOff) / 0.55), xd = xt - (calm * 9 * Math.sin((tOff - tM1) * 4.2) * Math.exp(-(tOff - tM1) * 1.4));
        const y0 = 300 + 118, y1 = 604, yb = f < 0.7 ? lerp(y0, y1, Math.pow(f / 0.7, 2)) : y1 - 22 * Math.sin(Math.PI * (f - 0.7) / 0.3);
        cx = lerp(xd, 950, f); cy = yb; cr = lerp(0, -7, ease(f));
      }
      tr(car, cx, cy, 1, cr);
      const ip = P(t, mid('crane', 0.7), 0.5, pop);
      op(inset, clamp(ip * 2)); tr(inset, 0, (1 - clamp(ip)) * 18);
      tr(insCar, 382, 408 + 1.5 * Math.sin(t * 9) * calm, 0.5, 3 * Math.sin(t * 7) * calm);
    }

    /* ---------- G. uses ---------- */
    const aG = win(t, at('uses') - 0.15, at('try') - 0.1, 0.4);
    op(Gg, aG);
    if (aG > 0) {
      const tt = [0.03, 0.17, 0.27, 0.36].map(f => mid('uses', f));
      tiles.forEach((o, i) => { const p = P(t, tt[i], 0.5, pop); op(o.g, clamp(p * 2)); tr(o.g, 0, (1 - clamp(p)) * 20); });
      // bell: strike about three times a second
      const ph = (t * 3) % 1, hit = ph < 0.18 ? 1 - ph / 0.18 : 0;
      tr(bellArm, -96, 2, 1, -12 * Math.pow(Math.sin(Math.PI * ph), 0.5) * calm);
      op(bellArcs, hit);
      // loudspeaker
      cone.setAttribute('transform', `translate(${(3 * Math.sin(t * 22) * calm).toFixed(2)} 0)`);
      spArcs.forEach((a, k) => op(a, 0.25 + 0.75 * wave(t * 1.6 - k * 0.22, 1)));
      // motor
      tr(rotor, 0, 33, 1, (t * 300 * Math.max(calm, 0.5)) % 360);
      // relay: switched by a small current, about once a second; highlighted while it is described
      const rOn = ((t - tt[3]) % 1.6 + 1.6) % 1.6 < 0.8;
      tr(relayLever, -102, -30, 1, rOn ? 9.5 : 0);
      rBulb.set(rOn ? 1 : 0); op(relayGlow, rOn ? 0.55 : 0);
      const hl = win(t, mid('uses', 0.42), mid('uses', 0.74), 0.3);
      tiles[3].box.setAttribute('stroke', hl > 0.5 ? C.energy : C.line); tiles[3].box.setAttribute('stroke-width', (2 + 2 * hl).toFixed(2));
      // maglev
      const mp = P(t, mid('uses', 0.78), 0.6, pop);
      op(mag, clamp(mp * 2)); tr(mag, 0, (1 - clamp(mp)) * 20);
      tr(train, 610 + 26 * Math.sin(t * 0.9) * calm, 584 + 2.2 * Math.sin(t * 2.6) * calm);
      op(gapGlow, 0.45 + 0.3 * wave(t, 1.4)); gapLab.set(P(t, mid('uses', 0.84), 0.4, linear));
    }

    /* ---------- H + I. try it, then stay safe ---------- */
    const aH = P(t, at('try') - 0.15, 0.4, linear);
    op(Hg, aH);
    if (aH > 0) {
      const sf = P(t, at('safe') - 0.1, 0.9);
      op(tryChip, 1 - P(t, at('safe') - 0.1, 0.3, linear)); op(safeChip, P(t, at('safe'), 0.3, linear));
      // the rig moves aside for the safety card
      const ws = lerp(1, 0.72, sf), wx = lerp(560, 835, sf), wy = lerp(470, 380, sf);
      const M = [wx - 560 * ws, wy - 470 * ws, ws];
      if (sf !== world._sf) { world._sf = sf; world.setAttribute('transform', `translate(${M[0].toFixed(1)} ${M[1].toFixed(1)}) scale(${ws.toFixed(4)})`); }
      // wrap thirty turns
      const wp = P(t, mid('try', 0.08), mid('try', 0.4) - mid('try', 0.08), linear);
      hRig.coil(wp >= 1 ? hRig.th1 : lerp(hRig.th0, hRig.th1, wp));
      setT(turnsTxt, Math.round(30 * wp) + ' turns');
      op(turnsLab, P(t, mid('try', 0.08), 0.4, linear) * (1 - sf));
      voltLab.set(P(t, mid('try', 0.45), 0.4, linear) * (1 - sf));
      // the bare ends: hovering, touching the cell, then the right one lifted off by a hand
      const tTouch = mid('try', 0.58), tLift = mid('safe', 0.46);
      const kIn = P(t, tTouch - 0.5, 0.5, easeIn), kUp = P(t, tLift, 0.6, easeOut);
      const tipL = [lerp(hPlus[0] - 30, hPlus[0], kIn), lerp(hPlus[1] - 26, hPlus[1], kIn)];
      const tipR = [lerp(hMinus[0] + 30, hMinus[0], kIn) + 40 * kUp, lerp(hMinus[1] - 26, hMinus[1], kIn) - 70 * kUp];
      if (kIn !== hLeadL._k || kUp !== hLeadR._k) {
        hLeadL._k = kIn; hLeadR._k = kUp;
        const LL = leadL(tipL), LR = leadR(tipR);
        hLeadL.setAttribute('d', bezD(...LL)); hLeadR.setAttribute('d', bezD(...LR));
        const qL = bez(...LL, 0.1), qR = bez(...LR, 0.9);
        hTipL.setAttribute('d', `M${tipL[0].toFixed(1)},${tipL[1].toFixed(1)} L${qL[0].toFixed(1)},${qL[1].toFixed(1)}`);
        hTipR.setAttribute('d', `M${qR[0].toFixed(1)},${qR[1].toFixed(1)} L${tipR[0].toFixed(1)},${tipR[1].toFixed(1)}`);
      }
      const leadsOn = P(t, mid('try', 0.36), 0.4, linear);
      op(hLeadL, leadsOn); op(hLeadR, leadsOn); op(hTipL, leadsOn); op(hTipR, leadsOn);
      const flowOn = P(t, tTouch, 0.12, linear) * (1 - P(t, tLift, 0.3, linear));
      runDots(hTrack, (clamp(t, tTouch, tLift) - tTouch) * 60, 30, 5, aH * flowOn, M);
      // clips cling one by one; they drop when the wire is lifted off
      const sway = calm * 2.4 * Math.sin(t * 2.2);
      const poses = chain(hTip[0], hTip[1], 4, sway, 1);
      let lifted = 0;
      hClips.forEach((c, i) => {
        let q = [c.hx, c.hy, c.hr];
        if (i < 4) { const tj = mid('try', 0.7 + i * 0.075); q = leap(t, c, poses[i], tj, tLift + 0.08); if (t > tj + 0.42 && t < tLift + 0.08) lifted++; }
        tr(c.g, q[0], q[1], 1, q[2]);
      });
      setT(cntTxt, 'lifted: ' + lifted);
      op(counter, P(t, mid('try', 0.66), 0.4, linear) * (1 - sf));
      // safety
      const pp = P(t, at('safe') + 0.05, 0.5, pop); op(plug, clamp(pp * 2)); tr(plug, 270, 360, Math.max(0.01, 0.9 + 0.1 * pp));
      const xp = P(t, mid('safe', 0.16), 0.4, pop); op(plugX, clamp(xp * 2)); tr(plugX, 270, 362, Math.max(0.01, xp));
      op(mainsChip, P(t, mid('safe', 0.22), 0.4, linear));
      op(discChip, P(t, mid('safe', 0.44), 0.4, linear));
      // the hand reaches in, pinches the bare end and lifts it
      const hp = P(t, mid('safe', 0.3), 0.7, easeOut), tipStage = [M[0] + M[2] * tipR[0], M[1] + M[2] * tipR[1]];
      op(hand, hp);
      tr(hand, lerp(1200, tipStage[0] - 2, hp), lerp(600, tipStage[1] - 1, hp), 0.8, -14);
      const hw = P(t, mid('safe', 0.66), 0.6, linear);
      op(hHeat, hw); hHeat.upd(t); op(hWarm, 0.7 * hw);
    }

    for (let i = used; i < POOL.length; i++) op(POOL[i], 0);
  };
});
