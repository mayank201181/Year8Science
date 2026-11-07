/* Chapter 2, Magnetic fields and field lines.
   A paperclip on a thread is pulled without touching: the magnetic field -> the field-line set draws on,
   N to S -> lines never cross -> close together = strong -> iron filings swing into the pattern (showpiece)
   -> filings show shape, not direction -> a plotting compass glides along a line -> try it at home:
   dot, hop, dot ... join the dots into a field line. */
scene('fields', S => {
  const { at, end, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;
  const FIELD = '#C4B5FD', FIELD_HI = '#F1ECFF';                  // field lines on the dark stage
  const PAPER = '#E4EBEF', GRAPH = '#34404A', FILING = '#2E3A44';  // paper, pencil graphite, iron filings
  const NRED = '#E8424F', NLT = '#FF8F98', SLT = '#8DB9FF';
  const MX = 600, MY = 420, HL = 160, HH = 40;                     // the magnet: 320 x 80, N on the left
  const NP = [MX - HL, MY], SP = [MX + HL, MY];

  /* ---------- local helpers ---------- */
  function rich(parent, x, y, segs, o) {
    o = o || {};
    const t = E('text', { x, y, 'font-size': o.size || 30, 'font-weight': o.weight || 600, 'font-family': o.font || FD, 'text-anchor': o.anchor || 'start', fill: o.fill || C.ink }, parent);
    segs.forEach(s => { if (typeof s === 'string') s = [s]; E('tspan', { fill: s[1], 'font-weight': s[2] }, t).textContent = s[0]; });
    return t;
  }
  /* "label: N -> S" with a drawn arrow (no arrow glyph needed) */
  function nsLabel(parent, x, y, lead, o) {
    o = o || {};
    const g = G(parent), size = o.size || 32;
    const wl = textWidth(lead, size, FD, 700), wn = textWidth('N', size, FD, 700), ws = textWidth('S', size, FD, 700), AW = 54, gap = 12;
    const total = wl + gap + wn + gap + AW + gap + ws;
    let x0 = x - total / 2;
    T(g, x0, y, lead, { size, weight: 700, fill: o.fill || C.ink }); x0 += wl + gap;
    T(g, x0, y, 'N', { size, weight: 700, fill: o.nFill || NLT }); x0 += wn + gap;
    arrow(g, x0, y - size * 0.32, x0 + AW, y - size * 0.32, { color: o.arrow || o.fill || C.ink, width: 4.5 }); x0 += AW + gap;
    T(g, x0, y, 'S', { size, weight: 700, fill: o.sFill || SLT });
    return g;
  }
  function bez(a, b, c, d, n) {
    const out = [];
    for (let i = 0; i <= n; i++) { const u = i / n, v = 1 - u; out.push([v * v * v * a[0] + 3 * v * v * u * b[0] + 3 * v * u * u * c[0] + u * u * u * d[0], v * v * v * a[1] + 3 * v * v * u * b[1] + 3 * v * u * u * c[1] + u * u * u * d[1]]); }
    return out;
  }
  /* a polyline with arc-length lookup: L.at(s) -> [x, y, angle in degrees] */
  function polyline(pts) {
    const cum = [0];
    for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    const L = cum[cum.length - 1];
    const at = s => {
      s = clamp(s, 0, L);
      let lo = 0, hi = cum.length - 1;
      while (hi - lo > 1) { const m = (lo + hi) >> 1; if (cum[m] <= s) lo = m; else hi = m; }
      const f = (s - cum[lo]) / ((cum[hi] - cum[lo]) || 1), a = pts[lo], b = pts[hi];
      return [lerp(a[0], b[0], f), lerp(a[1], b[1], f), Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI];
    };
    const d = 'M' + pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join('L');
    const sub = (s0, s1) => { const out = [at(s0)]; for (let i = 0; i < pts.length; i++) if (cum[i] > s0 && cum[i] < s1) out.push(pts[i]); out.push(at(s1)); return out.map(p => [p[0], p[1]]); };
    return { pts, cum, L, at, d, sub };
  }
  /* compass: dial (C.card, C.line rim), diamond needle (north half red), pivot. g.set(deg) points the red end */
  function compass(parent, r, o) {
    o = o || {};
    const g = G(parent);
    E('circle', { r, fill: C.card, stroke: o.rim || C.line, 'stroke-width': Math.max(3, r * 0.09) }, g);
    const nd = G(g), L = r * 0.78, w = Math.max(5, r * 0.2);
    E('path', { d: `M${L},0 L0,${-w} L0,${w} Z`, fill: NRED, stroke: '#FFB3B9', 'stroke-width': 1.2, 'stroke-linejoin': 'round' }, nd);
    E('path', { d: `M${-L},0 L0,${-w} L0,${w} Z`, fill: C.ink, stroke: '#ffffff', 'stroke-width': 1.2, 'stroke-linejoin': 'round' }, nd);
    E('circle', { r: Math.max(3, r * 0.11), fill: C.bg0, stroke: C.ink, 'stroke-width': 2 }, g);
    E('path', { d: `M${(-r * 0.62).toFixed(1)},${(-r * 0.5).toFixed(1)} A${(r * 0.8).toFixed(1)},${(r * 0.8).toFixed(1)} 0 0 1 ${(r * 0.1).toFixed(1)},${(-r * 0.8).toFixed(1)}`, fill: 'none', stroke: '#ffffff', 'stroke-width': Math.max(2, r * 0.06), opacity: 0.22, 'stroke-linecap': 'round' }, g);
    g.L = L;
    g.set = deg => nd.setAttribute('transform', `rotate(${deg.toFixed(2)})`);
    g.set(0);
    return g;
  }
  function paperclip(parent, s) {
    const g = G(parent), inner = G(g);
    inner.setAttribute('transform', `scale(${s || 1})`);
    E('path', { d: 'M5,-18 L5,22 A5,5 0 0 1 -5,22 L-5,-26 A8,8 0 0 1 11,-26 L11,26 A11,11 0 0 1 -11,26 L-11,-10', fill: 'none', stroke: '#C3CEDA', 'stroke-width': 3.6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, inner);
    return g;
  }
  /* a yellow pencil, tip at (0,0), body up and to the right */
  function pencil(parent) {
    const g = G(parent), b = G(g);
    b.setAttribute('transform', 'rotate(-55)');
    E('path', { d: 'M0,0 L-7,-20 L7,-20 Z', fill: '#E9C9A0', stroke: '#B99467', 'stroke-width': 1.5, 'stroke-linejoin': 'round' }, b);
    E('path', { d: 'M0,0 L-2.6,-7.5 L2.6,-7.5 Z', fill: GRAPH }, b);
    E('rect', { x: -7, y: -104, width: 14, height: 84, fill: '#F5C542', stroke: '#C99A1C', 'stroke-width': 1.5 }, b);
    E('line', { x1: -2.3, y1: -100, x2: -2.3, y2: -22, stroke: '#FFE08A', 'stroke-width': 2 }, b);
    E('rect', { x: -7, y: -114, width: 14, height: 11, fill: '#B9C3CB', stroke: '#8A97A2', 'stroke-width': 1.5 }, b);
    E('rect', { x: -7, y: -128, width: 14, height: 15, rx: 4, fill: '#F09CA6', stroke: '#C76E7A', 'stroke-width': 1.5 }, b);
    return g;
  }
  function headPath(parent, color, s) {
    s = s || 1;
    return E('path', { d: `M${8 * s},0 L${-7 * s},${-7 * s} L${-3.5 * s},0 L${-7 * s},${7 * s} Z`, fill: color, 'stroke-linejoin': 'round' }, parent);
  }

  /* ---------- the field-line set: the corrected guide diagram, scaled up ---------- */
  const MAP = ([x, y]) => [MX + (x - 120) * 6.4, MY + (y - 65) * 4];
  const TOPCP = [
    [[95, 56], [78, 52], [82, 40], [120, 40], [158, 40], [162, 52], [145, 56]],     // inner: leaves near the corner
    [[95, 58], [65, 54], [70, 24], [120, 24], [170, 24], [175, 54], [145, 58]],     // middle
    [[95, 61], [50, 58], [58, 8], [120, 8], [182, 8], [190, 58], [145, 61]],        // outer: leaves nearest the axis
  ];
  const LINES = [];
  TOPCP.forEach((cp, k) => {
    const q = cp.map(MAP);
    const pts = bez(q[0], q[1], q[2], q[3], 70).concat(bez(q[3], q[4], q[5], q[6], 70).slice(1));
    LINES.push({ pl: polyline(pts), ring: k, top: true });
    LINES.push({ pl: polyline(pts.map(([x, y]) => [x, 2 * MY - y])), ring: k, top: false });
  });
  LINES.push({ pl: polyline([[MX - HL, MY], [70, MY]]), ring: 3, straight: 'L' });      // out of N, away from it
  LINES.push({ pl: polyline([[1130, MY], [MX + HL, MY]]), ring: 3, straight: 'R' });    // into S
  const INNER = LINES[0].pl, MIDDLE = LINES[2].pl;

  /* ===== layers ===== */
  const glowG = G(root);
  const fieldGlow = E('ellipse', { cx: MX, cy: MY, rx: 360, ry: 230, fill: glow('#8F7BEA') }, glowG);
  const poleGlows = [NP, SP].map(p => E('ellipse', { cx: p[0], cy: p[1], rx: 96, ry: 118, fill: glow('#B9A6FF') }, glowG));

  const setG = G(root);
  LINES.forEach(l => {
    l.path = E('path', { d: l.pl.d, fill: 'none', stroke: FIELD, 'stroke-width': 3.6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', pathLength: 1, 'stroke-dasharray': '1 1' }, setG);
    const da = l.straight === 'L' ? '0.26 0.74' : l.straight === 'R' ? '0 0.74 0.26' : '0.22 0.56 0.22';
    l.hi = E('path', { d: l.pl.d, fill: 'none', stroke: FIELD_HI, 'stroke-width': 5.5, 'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': da }, setG);
    l.head = headPath(setG, FIELD, 1.25);
    l.rest = l.straight === 'L' ? l.pl.L - 190 : l.straight === 'R' ? 180 : l.pl.L / 2;
  });
  // the draw-on order: inner pair, middle pair, outer pair, the two straight lines
  const DRAW = [[0.06, 1.0], [0.2, 1.1], [0.34, 1.2], [0.5, 0.9]];

  /* paperclip on a thread */
  const hang = G(root);
  const ANCH = [318, 128];
  E('rect', { x: 236, y: 116, width: 150, height: 14, rx: 6, fill: '#56636F', stroke: '#8395A3', 'stroke-width': 2 }, hang);
  const thread = E('line', { x1: ANCH[0], y1: ANCH[1], stroke: '#D9E2E8', 'stroke-width': 2 }, hang);
  const hClip = paperclip(hang, 1);

  /* the magnet (drawn over the line ends) */
  const magG = G(root); magnet(magG, 2 * HL, 2 * HH); tr(magG, MX, MY);

  /* cross: a ghost line that tries to cross two lines */
  const crossG = G(root);
  const GH0 = [420, 222], GH1 = [566, 352];
  const ghost = E('path', { d: `M${GH0[0]},${GH0[1]} L${GH1[0]},${GH1[1]}`, stroke: C.bad, 'stroke-width': 5, 'stroke-dasharray': '12 9', 'stroke-linecap': 'round', fill: 'none', opacity: 0.85 }, crossG);
  const ghostX = cross(crossG, 22); tr(ghostX, 493, 287);
  const tinyC = compass(crossG, 22);
  const tinyAt = (() => { let best = null; for (let s = 0; s < INNER.L; s += 2) { const p = INNER.at(s); if (p[0] > 500 && p[0] < 560 && (!best || Math.abs(p[0] - 531) < Math.abs(best[0] - 531))) best = p; } return best; })();
  tr(tinyC, tinyAt[0], tinyAt[1]); tinyC.set(tinyAt[2]);

  /* strong / weak brackets */
  const brG = G(root);
  const tight = E('path', { d: 'M434,376 L422,376 L422,464 L434,464', fill: 'none', stroke: C.energy, 'stroke-width': 4.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, brG);
  const tightT = G(brG);
  T(tightT, 205, 398, 'close together', { size: 28, weight: 700, anchor: 'middle', fill: C.energy });
  T(tightT, 205, 459, '= strong', { size: 28, weight: 700, anchor: 'middle', fill: C.energy });
  const wideX = 712, wTop = (() => { let y = 0; for (let s = 0; s < LINES[4].pl.L; s += 2) { const p = LINES[4].pl.at(s); if (Math.abs(p[0] - wideX) < 2 && p[1] < MY) y = p[1]; } return y; })();
  const wBot = (() => { let y = 0; for (let s = 0; s < MIDDLE.L; s += 2) { const p = MIDDLE.at(s); if (Math.abs(p[0] - wideX) < 2 && p[1] < MY) y = p[1]; } return y; })();
  const wide = E('path', { d: `M${wideX - 12},${wTop} L${wideX},${wTop} L${wideX},${wBot} L${wideX - 12},${wBot}`, fill: 'none', stroke: C.muted, 'stroke-width': 4.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, brG);
  const wideT = T(brG, 760, 154, 'far apart = weak', { size: 28, weight: 700, anchor: 'middle', fill: C.muted });

  /* ===== the paper: filings, compass plotting ===== */
  const paperG = G(root);
  E('rect', { x: 96, y: 172, width: 1020, height: 540, rx: 6, fill: '#000', opacity: 0.25 }, paperG);
  const paper = E('rect', { x: 90, y: 165, width: 1020, height: 540, rx: 6, fill: PAPER }, paperG);
  const ghostMag = G(paperG); magnet(ghostMag, 2 * HL, 2 * HH); tr(ghostMag, MX, MY); ghostMag.setAttribute('opacity', 0.3);
  // filings: one path for the falling ones, one for the landed ones
  const fallP = E('path', { fill: 'none', stroke: FILING, 'stroke-width': 2.6, 'stroke-linecap': 'round', opacity: 0.45 }, paperG);
  const landP = E('path', { fill: 'none', stroke: FILING, 'stroke-width': 2.6, 'stroke-linecap': 'round' }, paperG);
  /* filings: they settle in chains along a nested family of field lines, interpolated (and extended)
     from the drawn set, so the pattern they reveal is the shape the field lines showed */
  const FIL = [];
  {
    const fr = rng(2024);
    const onPaper = (x, y) => x > 112 && x < 1088 && y > 188 && y < 684 && !(x > MX - HL - 10 && x < MX + HL + 10 && y > MY - HH - 10 && y < MY + HH + 10);
    const famLines = [];
    [-0.5, 0, 0.5, 1, 1.5, 2, 2.5, 3].forEach(k => {
      const cp = TOPCP[0].map((p, j) => {
        const a = TOPCP[0][j], b = TOPCP[1][j], c = TOPCP[2][j];
        if (k <= 1) return [lerp(a[0], b[0], k), lerp(a[1], b[1], k)];
        return [lerp(b[0], c[0], k - 1), lerp(b[1], c[1], k - 1)];
      }).map(MAP);
      const pts = bez(cp[0], cp[1], cp[2], cp[3], 60).concat(bez(cp[3], cp[4], cp[5], cp[6], 60).slice(1));
      famLines.push(polyline(pts), polyline(pts.map(([x, y]) => [x, 2 * MY - y])));
    });
    famLines.push(polyline([[MX - HL, MY], [100, MY]]), polyline([[1100, MY], [MX + HL, MY]]));
    const near = [];
    famLines.forEach(pl => { for (let s = 0; s < pl.L; s += 9) near.push(pl.at(s)); });
    const add = (x, y, ang) => {
      if (!onPaper(x, y) || FIL.some(q => Math.abs(q.x - x) < 13 && Math.abs(q.y - y) < 13)) return;
      const a0 = fr() * Math.PI;
      let da = ((ang - a0) % Math.PI + Math.PI) % Math.PI; if (da > Math.PI / 2) da -= Math.PI;
      const dp = Math.min(Math.hypot(x - NP[0], y - NP[1]), Math.hypot(x - SP[0], y - SP[1]));
      FIL.push({ x, y, a0, da, len: 11 + 7 * fr(), land: fr() * 1.7, delay: 0.95 * clamp((dp - 50) / 420) + 0.3 * fr() });
    };
    famLines.forEach(pl => {
      for (let s = 6 + fr() * 20; s < pl.L; s += 30 + fr() * 22) {
        const q = pl.at(s), n = (fr() - 0.5) * 9, rad = q[2] * Math.PI / 180;
        add(q[0] - Math.sin(rad) * n, q[1] + Math.cos(rad) * n, rad + (fr() - 0.5) * 0.22);
      }
    });
    for (let i = 0; i < 400 && FIL.length < 340; i++) {           // a light scatter between the chains
      const x = 112 + fr() * 976, y = 188 + fr() * 496;
      let best = null, bd = 1e9;
      near.forEach(p => { const d = (p[0] - x) * (p[0] - x) + (p[1] - y) * (p[1] - y); if (d < bd) { bd = d; best = p; } });
      if (bd > 18 * 18) add(x, y, best[2] * Math.PI / 180 + (fr() - 0.5) * 0.3);
    }
  }
  const segD = (q, ang, dy) => { const c = Math.cos(ang) * q.len / 2, s = Math.sin(ang) * q.len / 2, y = q.y + (dy || 0); return `M${(q.x - c).toFixed(1)},${(y - s).toFixed(1)}L${(q.x + c).toFixed(1)},${(y + s).toFixed(1)}`; };
  const D_RANDOM = FIL.map(q => segD(q, q.a0)).join(''), D_FINAL = FIL.map(q => segD(q, q.a0 + q.da)).join('');
  const maxDelay = Math.max(...FIL.map(q => q.delay));

  const guide = E('path', { d: MIDDLE.d, fill: 'none', stroke: GRAPH, 'stroke-width': 3, 'stroke-dasharray': '10 10', opacity: 0.55 }, paperG);
  // plotting: dots just beyond each end of the needle, at the edge of the case, so one compass-width apart
  const PR = 34, PC = compass(paperG, PR);
  const NL = PR + 4;
  const dotsS = [];
  {
    let s = 0;
    const clear = s0 => { const p = INNER.at(s0); return Math.hypot(Math.max(0, MX - HL - p[0], p[0] - (MX + HL)), Math.max(0, MY - HH - p[1], p[1] - (MY + HH))); };
    while (clear(s + NL) < PR + 10) s += 2;          // start where the dial sits clear of the magnet
    dotsS.push(s);
    for (;;) {
      const p = INNER.at(s);
      let s2 = s + 2;
      while (s2 < INNER.L && Math.hypot(INNER.at(s2)[0] - p[0], INNER.at(s2)[1] - p[1]) < 2 * NL) s2 += 0.5;
      if (s2 >= INNER.L || clear(s2 - NL) < PR + 10) break;
      dotsS.push(s2); s = s2;
    }
  }
  const DOTS = dotsS.map(s => INNER.at(s));
  const dotEls = DOTS.map(p => E('circle', { cx: p[0].toFixed(1), cy: p[1].toFixed(1), r: 5.5, fill: GRAPH }, paperG));
  // joining the dots: a smooth line from the N face, through every dot, into the S face
  const traced = E('path', { d: INNER.d, fill: 'none', stroke: GRAPH, 'stroke-width': 3.6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', pathLength: 1, 'stroke-dasharray': '1 1' }, paperG);
  const tracedHead = headPath(paperG, GRAPH, 1.5);
  { const p = INNER.at(INNER.L / 2); tracedHead.setAttribute('transform', `translate(${p[0].toFixed(1)} ${p[1].toFixed(1)}) rotate(${p[2].toFixed(1)})`); }
  paperG.appendChild(PC);
  const pen = pencil(paperG);

  /* ===== labels ===== */
  const labG = G(root);
  const lblField = G(labG);
  T(lblField, 935, 214, 'magnetic field', { size: 36, weight: 700, anchor: 'middle', fill: FIELD });
  T(lblField, 935, 254, 'where magnetic materials', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  T(lblField, 935, 286, 'feel a force', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  const lblLines = nsLabel(labG, 600, 150, 'field lines:', { size: 32, fill: FIELD });
  const lblOne = T(labG, 600, 704, 'one direction at each point', { size: 30, weight: 700, anchor: 'middle' });
  const chipShape = G(labG), chipDir = G(labG);
  { const c = chip(chipShape, 'shape', { size: 30, fill: C.card2, stroke: C.good, w: 190 }); c.label.setAttribute('x', -18); const tk = tick(chipShape, 12, C.good); tr(tk, 52, -1); }
  { const c = chip(chipDir, 'direction', { size: 30, fill: C.card2, stroke: C.bad, w: 236 }); c.label.setAttribute('x', -16); T(chipDir, 80, 11, '?', { size: 34, weight: 700, anchor: 'middle', fill: C.bad }); }
  tr(chipShape, 470, 126); tr(chipDir, 734, 126);
  const lblNorth = G(labG);
  { const sw = compass(lblNorth, 20); sw.set(0); tr(sw, -232, -10);
    T(lblNorth, 18, 0, 'north end points along the field', { size: 30, weight: 700, anchor: 'middle' }); }
  tr(lblNorth, 616, 138);
  const chipHome = chip(labG, 'try it at home', { size: 28, fill: C.card2, stroke: C.energy, color: C.energy }); tr(chipHome, 600, 128);
  const lblTraced = nsLabel(labG, 600, 140, 'a field line,', { size: 32 });

  return t => {
    /* --- field: the clip is pulled without touching; the field glows --- */
    const aHang = P(t, S.first - 0.2, 0.5, linear) * (1 - P(t, at('lines') - 0.1, 0.5, linear));
    op(hang, aHang);
    if (aHang > 0) {
      const sw = P(t, mid('field', 0.1), 1.3, ease);
      const th = lerp(0, 24, sw) + (S.reduce ? 0 : 1.5 * Math.sin(t * 2.3) * sw), L = 178;
      const rad = th * Math.PI / 180, ex = ANCH[0] + Math.sin(rad) * L, ey = ANCH[1] + Math.cos(rad) * L;
      attr(thread, 'x2', ex); attr(thread, 'y2', ey);
      const ca = lerp(0, 34, sw), cr = ca * Math.PI / 180;
      tr(hClip, ex + Math.sin(cr) * 36, ey + Math.cos(cr) * 36, 1, -ca);
    }
    const glowA = P(t, mid('field', 0.36), 0.8, linear) * (1 - 0.55 * P(t, at('lines'), 0.6, linear)) * (1 - P(t, at('cross') - 0.2, 0.5, linear));
    op(fieldGlow, glowA * (0.85 + 0.15 * calm * wave(t, 2.6)));
    op(lblField, P(t, mid('field', 0.42), 0.5, linear) * (1 - P(t, at('lines') - 0.1, 0.4, linear)));

    /* --- the field-line set --- */
    const setA = P(t, at('lines') - 0.2, 0.3, linear) * (1 - P(t, at('filings') - 0.1, 0.6, linear));
    op(setG, setA);
    if (setA > 0) {
      LINES.forEach(l => {
        const [f, dur] = DRAW[l.ring], p = P(t, mid('lines', f), dur, easeOut);
        l.path.setAttribute('stroke-dashoffset', (1 - p).toFixed(4));
        const s = Math.min(p * l.pl.L, l.rest), q = l.pl.at(s);
        l.head.setAttribute('transform', `translate(${q[0].toFixed(1)} ${q[1].toFixed(1)}) rotate(${q[2].toFixed(1)})`);
        op(l.head, clamp(p * 8));
        op(l.hi, P(t, mid('strong', 0.06), 0.5, linear) * (0.75 + 0.25 * wave(t, 1.4)));
      });
    }
    const pg = P(t, mid('strong', 0.06), 0.5, linear) * (1 - P(t, at('filings') - 0.1, 0.5, linear));
    poleGlows.forEach(e => op(e, pg * (0.7 + 0.3 * calm * wave(t, 1.4))));

    /* --- cross --- */
    const cA = win(t, at('cross') - 0.05, at('strong') + 0.1, 0.35);
    op(crossG, cA);
    if (cA > 0) {
      const gp = P(t, mid('cross', 0.06), 0.8, easeOut);
      ghost.setAttribute('d', `M${GH0[0]},${GH0[1]} L${lerp(GH0[0], GH1[0], gp).toFixed(1)},${lerp(GH0[1], GH1[1], gp).toFixed(1)}`);
      const xp = P(t, mid('cross', 0.28), 0.45, pop); op(ghostX, clamp(xp * 2)); tr(ghostX, 493, 287, Math.max(0.01, xp));
      op(ghost, 0.85 * (1 - 0.5 * P(t, mid('cross', 0.5), 0.5, linear)));
      const cp = P(t, mid('cross', 0.42), 0.5, pop); op(tinyC, clamp(cp * 2)); tr(tinyC, tinyAt[0], tinyAt[1], Math.max(0.01, cp));
      tinyC.set(tinyAt[2] + (1 - P(t, mid('cross', 0.42), 1.2, easeOut)) * 70 * Math.cos(t * 6));
    }
    op(lblOne, win(t, mid('cross', 0.5), at('strong') + 0.2, 0.4));

    /* --- strong / weak --- */
    const bA = win(t, mid('strong', 0.2), at('filings') + 0.1, 0.4);
    op(brG, bA);
    if (bA > 0) {
      op(tight, P(t, mid('strong', 0.2), 0.4, linear)); op(tightT, P(t, mid('strong', 0.28), 0.4, linear));
      op(wide, P(t, mid('strong', 0.56), 0.4, linear)); op(wideT, P(t, mid('strong', 0.6), 0.4, linear));
    }
    op(lblLines, win(t, mid('lines', 0.5), at('strong') + 0.1, 0.4));

    /* --- paper and filings --- */
    const pA = P(t, at('filings') + 0.05, 0.7, linear);
    op(paperG, pA);
    tr(paperG, 0, (1 - P(t, at('filings') + 0.05, 0.8, easeOut)) * 40);
    if (pA > 0) {
      const tS0 = mid('filings', 0.16), tA0 = mid('filings', 0.48), fOut = 1 - P(t, at('compass') - 0.1, 0.6, linear);
      let fall = '', land = '';
      if (t < tS0) { land = ''; }
      else if (t < tS0 + 2.1) {
        FIL.forEach(q => { const u = (t - tS0 - q.land) / 0.35; if (u <= 0) return; if (u < 1) fall += segD(q, q.a0 + u * 1.2, -60 * (1 - easeIn(u))); else land += segD(q, q.a0); });
      } else if (t < tA0) land = D_RANDOM;
      else if (t < tA0 + maxDelay + 0.6) {
        FIL.forEach(q => { const u = clamp((t - tA0 - q.delay) / 0.6); land += segD(q, q.a0 + q.da * (u <= 0 ? 0 : pop(u))); });
      } else land = D_FINAL;
      fallP.setAttribute('d', fall || 'M0,0'); op(fallP, fall ? fOut : 0);
      landP.setAttribute('d', land || 'M0,0'); op(landP, land ? fOut : 0);

      // compass glides along one line
      const gA = win(t, at('compass') + 0.1, at('plot') + 0.2, 0.4);
      op(guide, gA * 0.55);
      const tG0 = at('compass') + 0.6, tG1 = end('compass') + 0.35;
      const tP0 = at('plot') + 0.1, tP1 = tP0 + 1.1;
      // hop schedule (join): the first hop slow, then brisk
      const tJ0 = at('join') + 0.15, HOP = [], nHop = DOTS.length - 2;
      const step = clamp((mid('join', 0.44) - tJ0 - 1.05) / Math.max(1, nHop - 2), 0.38, 0.7);
      for (let k = 1; k <= nHop; k++) HOP.push(tJ0 + (k === 1 ? 0 : 1.05 + (k - 2) * step));
      const hopDur = k => (k === 0 ? 0.8 : 0.28);
      const taps = [mid('plot', 0.6), mid('plot', 0.8)];
      HOP.forEach((h, k) => taps.push(h + hopDur(k) + 0.08));
      const tT0 = Math.max(mid('join', 0.52), taps[taps.length - 1] + 0.7), tT1 = tT0 + 1.6, tAside = taps[taps.length - 1] + 0.25;
      const pcA = P(t, at('compass') + 0.3, 0.4, linear);
      op(PC, pcA);
      if (pcA > 0) {
        let x, y, a;
        const g1 = MIDDLE.at(MIDDLE.L - 70);
        if (t < tP0) {
          const s = lerp(70, MIDDLE.L - 70, P(t, tG0, tG1 - tG0, ease)), q = MIDDLE.at(s);
          x = q[0]; y = q[1]; a = q[2];
          if (t < tG0) a = q[2] + (1 - P(t, at('compass') + 0.3, 0.6, easeOut)) * 60;
        } else {
          // placement k: tail on dot k, tip on dot k+1
          const place = k => { const A = DOTS[k], B = DOTS[k + 1]; return [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2, Math.atan2(B[1] - A[1], B[0] - A[0]) * 180 / Math.PI]; };
          let cur = [g1[0], g1[1], g1[2]], nxt = place(0), u = P(t, tP0, tP1 - tP0);
          for (let k = 0; k < HOP.length; k++) { if (t >= HOP[k]) { cur = place(k); nxt = place(k + 1); u = P(t, HOP[k], hopDur(k)); } }
          x = lerp(cur[0], nxt[0], u); y = lerp(cur[1], nxt[1], u) - 14 * Math.sin(Math.PI * u);
          let da = nxt[2] - cur[2]; while (da > 180) da -= 360; while (da < -180) da += 360;
          a = cur[2] + da * u;
          // once every dot is marked, the compass slides aside so the whole line shows
          const aside = P(t, tAside, 0.7);
          x = lerp(x, 1000, aside); y = lerp(y, 262, aside);
        }
        tr(PC, x, y); PC.set(a);
      }
      // pencil taps: dot 0 and 1 in "plot", then the front dot after each hop, then it traces the line
      dotEls.forEach((d, i) => { const tp = taps[i] !== undefined ? taps[i] : 1e6, p = P(t, tp, 0.25, pop); op(d, clamp(p * 3)); attr(d, 'r', 5.5 * Math.max(0.01, p)); });
      const penA = P(t, mid('plot', 0.45), 0.35, linear) * (1 - P(t, tT1 + 0.1, 0.4, linear));
      op(pen, penA);
      if (penA > 0) {
        let px, py, hover = 0;
        if (t < tT0) {
          // keyframes: the tip touches each dot at its tap time and hovers in between
          const keys = [[mid('plot', 0.45), DOTS[0][0] + 120, DOTS[0][1] - 90]];
          taps.forEach((tp, i) => { if (DOTS[i]) keys.push([tp, DOTS[i][0], DOTS[i][1]]); });
          keys.push([tT0, INNER.pts[0][0], INNER.pts[0][1]]);
          let k = 0; while (k < keys.length - 2 && t >= keys[k + 1][0]) k++;
          const A = keys[k], B = keys[k + 1];
          const mv = Math.min(0.5, (B[0] - A[0]) * 0.7), u = P(t, B[0] - mv, mv, ease);
          px = lerp(A[1], B[1], u); py = lerp(A[2], B[2], u);
          const touch = Math.max(0, 1 - Math.abs(t - B[0]) / 0.1, 1 - Math.abs(t - A[0]) / 0.1);
          hover = 10 * (1 - touch) + 16 * Math.sin(Math.PI * u);
        } else {
          const q = INNER.at(INNER.L * P(t, tT0, tT1 - tT0, linear)); px = q[0]; py = q[1];
        }
        tr(pen, px, py - hover);
      }
      traced.setAttribute('stroke-dashoffset', (1 - P(t, tT0, tT1 - tT0, linear)).toFixed(4));
      op(traced, t > tT0 ? 1 : 0);
      const hp = P(t, tT1 + 0.1, 0.4, pop); op(tracedHead, clamp(hp * 2));
    }

    /* --- top labels on the paper beats --- */
    op(chipShape, win(t, mid('shape', 0.08), at('compass') + 0.1, 0.35));
    op(chipDir, win(t, mid('shape', 0.45), at('compass') + 0.1, 0.35));
    op(lblNorth, win(t, mid('compass', 0.5), at('plot') + 0.05, 0.4));
    op(chipHome, win(t, at('plot') + 0.1, mid('join', 0.62), 0.4));
    op(lblTraced, P(t, mid('join', 0.68), 0.5, linear));
  };
});
