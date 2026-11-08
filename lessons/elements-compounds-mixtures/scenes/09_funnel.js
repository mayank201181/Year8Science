/* Chapter: Separating funnels and magnets.
   Beats: two more tools -> a shaken beaker of oil and water settles into layers (immiscible, oil on top)
   -> poured into a separating funnel on its stand -> showpiece: the tap opens, the water drains, the boundary
   sinks and the tap shuts just as it reaches the tap -> a dish of sand and iron filings -> a magnet lifts the iron
   -> only magnetic metals -> three questions -> FECD tiles -> the sand, iron and salt puzzle with a countdown
   -> the solution plays out step by step and ends with three neat piles. */
scene('funnel', S => {
  const { at, end, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;

  /* ---------- colours ---------- */
  const OIL = '#F2B84B', SAND = '#E2C48E', SANDDK = '#B98F55', SANDLT = '#F3DFB4', IRON = '#5E666F', IRONLT = '#B3BCC4';
  const SALT = '#F4F7FA', SALTDK = '#9FB2C1', SULF = '#FFD84A';
  const beat = (t, a, b) => win(t, a, b, 0.45);
  const popAt = (el, t, t0, x, y, s) => { const p = P(t, t0, 0.5, pop); op(el, clamp(p * 2)); tr(el, x, y, Math.max(0.01, (s || 1) * (0.6 + 0.4 * p))); return p; };
  const riseAt = (el, t, t0, x, y) => { const p = P(t, t0, 0.5, easeOut); op(el, p); tr(el, x, y + (1 - p) * 18); return p; };

  /* ---------- helpers ---------- */
  function title(parent, text, x) { return T(parent, x || 60, 150, text, { size: 44, weight: 700 }); }
  function card2(parent, w, l1, l2, stroke, size) {
    const g = G(parent), sz = size || 30, h = sz * 2.9;
    card(g, -w / 2, -h / 2, w, h, { fill: C.card2, stroke: stroke || C.line, sw: 3, rx: 20 });
    T(g, 0, -sz * 0.18, l1, { size: sz, weight: 600, anchor: 'middle' });
    T(g, 0, sz * 1.02, l2, { size: sz, weight: 700, anchor: 'middle', fill: stroke || C.ink });
    return g;
  }
  const dotsD = pts => pts.map(([x, y, r]) => `M${(x - r).toFixed(1)},${y.toFixed(1)} a${r},${r} 0 1,0 ${2 * r},0 a${r},${r} 0 1,0 ${-2 * r},0`).join('');
  const squaresD = pts => pts.map(([x, y, h, a]) => { const c = Math.cos(a || 0) * h, d = Math.sin(a || 0) * h; return `M${(x - c + d).toFixed(1)},${(y - d - c).toFixed(1)} L${(x + c + d).toFixed(1)},${(y + d - c).toFixed(1)} L${(x + c - d).toFixed(1)},${(y + d + c).toFixed(1)} L${(x - c - d).toFixed(1)},${(y - d + c).toFixed(1)} Z`; }).join('');
  // static iron filings (x, y, angle) as two stroked paths
  function filingsPath(parent, list, s) {
    const d = list.map(([x, y, a]) => { const c = Math.cos(a) * 6 * s, e = Math.sin(a) * 6 * s; return `M${(x - c).toFixed(1)},${(y - e).toFixed(1)} L${(x + c).toFixed(1)},${(y + e).toFixed(1)}`; }).join('');
    const g = G(parent);
    E('path', { d, stroke: IRONLT, 'stroke-width': 5.4 * s, 'stroke-linecap': 'round' }, g);
    E('path', { d, stroke: IRON, 'stroke-width': 3.2 * s, 'stroke-linecap': 'round' }, g);
    return g;
  }
  function saltCube(parent, s) { return E('rect', { x: -s / 2, y: -s / 2, width: s, height: s, rx: s * 0.2, fill: SALT, stroke: SALTDK, 'stroke-width': Math.max(1, s * 0.1) }, parent); }
  function filing(parent, s) { return E('rect', { x: -6.5 * s, y: -1.8 * s, width: 13 * s, height: 3.6 * s, rx: 1.6 * s, fill: IRON, stroke: IRONLT, 'stroke-width': 1 }, parent); }
  // black tripod with a wire gauze, drawn like the evaporating-basin rig's (07_filter); w = width of its top ring,
  // gauze top at y=0, feet at y=h. back: draw the back leg too (leave it out when a Bunsen burner stands in front of it)
  function tripod(parent, w, h, back) {
    const g = G(parent), k = w / 168, sw = Math.max(0.6, k), lt = 66 * k, lf = 88 * k, top = 26 * k;
    if (back) E('path', { d: `M0,${top} L0,${h - 8 * k}`, stroke: '#1C2126', 'stroke-width': 8 * sw, 'stroke-linecap': 'round' }, g);
    E('path', { d: `M${-lf},${h} L${-lt},${top} M${lf},${h} L${lt},${top}`, fill: 'none', stroke: '#1C2126', 'stroke-width': 9 * sw, 'stroke-linecap': 'round' }, g);
    E('path', { d: `M${-lf + 2 * k},${h - 6 * k} L${-lt},${top + 6 * k} M${lf - 2 * k},${h - 6 * k} L${lt},${top + 6 * k}`, fill: 'none', stroke: '#56626C', 'stroke-width': 2.5 * sw, 'stroke-linecap': 'round' }, g);
    E('rect', { x: -84 * k, y: 18 * k, width: 168 * k, height: 12 * k, rx: 5 * k, fill: '#1C2126', stroke: '#56626C', 'stroke-width': 2 * sw }, g);
    E('path', { d: `M${-106 * k},${16 * k} L${106 * k},${16 * k} L${86 * k},0 L${-86 * k},0 Z`, fill: '#76808A', stroke: '#C9D1D8', 'stroke-width': 2 * sw, 'stroke-linejoin': 'round' }, g);
    let mesh = '';
    for (let i = 1; i < 8; i++) mesh += `M${((-106 + i * 26.5) * k).toFixed(1)},${(16 * k).toFixed(1)} L${((-86 + i * 21.5) * k).toFixed(1)},0 `;
    for (let j = 1; j < 3; j++) { const y = 16 * k * (1 - j / 3), dx = 20 * k * j / 3; mesh += `M${(-106 * k + dx).toFixed(1)},${y.toFixed(1)} L${(106 * k - dx).toFixed(1)},${y.toFixed(1)} `; }
    E('path', { d: mesh, stroke: '#C9D1D8', 'stroke-width': 1.2 * sw, opacity: 0.7 }, g);
    return g;
  }
  // white porcelain evaporating basin, drawn like the evaporating-basin rig's (07_filter); rim centre at (0,0), w wide.
  // g.set(liquid 0..1); g.depth: rim to bottom
  function basin(parent, w) {
    const g = G(parent), k = w / 192, b = G(g); tr(b, 0, 0, k);
    E('path', { d: 'M-96,0 Q-92,51 0,54 Q92,51 96,0 Z', fill: ball('#FFFFFF', '#AEBAC4'), stroke: '#E9EEF2', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, b);
    E('ellipse', { cx: 0, cy: 0, rx: 96, ry: 17, fill: '#8E9AA5', stroke: '#FFFFFF', 'stroke-width': 3 }, b);
    const liq = E('ellipse', { cx: 0, cy: 2, rx: 88, ry: 13, fill: C.water, opacity: 0.9 }, b);
    g.set = lv => { lv = clamp(lv); attr(liq, 'rx', 26 + 62 * lv); attr(liq, 'ry', 4 + 9 * lv); attr(liq, 'cy', 13 - 11 * lv); op(liq, lv > 0.03 ? 0.9 : lv * 30); };
    g.set(0);
    g.depth = 54 * k;
    return g;
  }
  // glass filter funnel with a white filter-paper cone, drawn like 07_filter's at 0.58 scale: rim at y=-60, stem tip
  // at y=56 (unscaled); g.inside is clipped to the paper cone and uses 07's coordinates (paper apex at 0,112)
  function filterFunnel(parent) {
    const g = G(parent), f = G(g); tr(f, 0, -60, 0.58);
    const paperD = 'M-98,7 L0,112 L98,7 Z';
    E('path', { d: 'M-110,0 L-11,120 L11,120 L110,0 Z', fill: GLASS.fill }, f);
    E('rect', { x: -7, y: 120, width: 14, height: 76, fill: GLASS.fill }, f);
    E('path', { d: paperD, fill: '#F4F7FA', stroke: '#C9D3DC', 'stroke-width': 3, 'stroke-linejoin': 'round' }, f);
    E('path', { d: 'M-20,7 L0,112 M-62,7 L-34,37', stroke: '#C9D3DC', 'stroke-width': 3, fill: 'none', opacity: 0.85 }, f);
    g.inside = G(f, { 'clip-path': _clipUrl(paperD) });
    E('path', { d: 'M-110,0 L-11,120 L-7,126 L-7,192 L7,200 L7,126 L11,120 L110,0', fill: 'none', stroke: GLASS.stroke, 'stroke-width': 6, 'stroke-linejoin': 'round' }, f);
    E('ellipse', { cx: 0, cy: 0, rx: 110, ry: 8, fill: 'none', stroke: GLASS.stroke, 'stroke-width': 4.5 }, f);
    E('path', { d: 'M80,9 L22,84', stroke: GLASS.shine, 'stroke-width': 7, 'stroke-linecap': 'round' }, f);
    return g;
  }
  // Liebig condenser along +x (same look as the distillation chapter)
  function condenser(parent, L, j0, j1, jw) {
    const g = G(parent), a0 = j0 + 24, a1 = j1 - 24;
    [[a0, -1], [a1, 1]].forEach(([u, k]) => {
      const d = `M${u},${k * (jw - 6)} L${u},${k * (jw + 20)}`;
      E('path', { d, stroke: GLASS.stroke, 'stroke-width': 12, 'stroke-linecap': 'round' }, g);
      E('path', { d, stroke: '#1D5D78', 'stroke-width': 6, 'stroke-linecap': 'round' }, g);
    });
    E('rect', { x: j0, y: -jw, width: j1 - j0, height: 2 * jw, rx: 10, fill: 'rgba(76,201,240,0.34)', stroke: GLASS.stroke, 'stroke-width': 3 }, g);
    E('path', { d: `M0,0 L${L},0`, stroke: GLASS.stroke, 'stroke-width': 14, 'stroke-linecap': 'round' }, g);
    E('path', { d: `M0,0 L${L},0`, stroke: '#123848', 'stroke-width': 8, 'stroke-linecap': 'round' }, g);
    return g;
  }
  function crystals(parent, n, s, seed) {
    const g = G(parent), r = rng(seed || 3), list = [];
    for (let i = 0; i < n; i++) {
      const c = G(g), z = s * (0.6 + r() * 0.6), q = z * 0.55, k = q * 0.87;   // 07_filter's crystal: a small cube seen corner-on
      E('path', { d: `M0,${-q} L${k},${-q / 2} L${k},${q / 2} L0,${q} L${-k},${q / 2} L${-k},${-q / 2} Z`, fill: linGrad('#FFFFFF', '#B9D3E4', true), stroke: '#FFFFFF', 'stroke-width': Math.max(1.2, q * 0.08), 'stroke-linejoin': 'round' }, c);
      E('path', { d: `M${-k},${-q / 2} L0,0 L${k},${-q / 2} M0,0 L0,${q}`, fill: 'none', stroke: '#8FB2C8', 'stroke-width': Math.max(1, q * 0.07), 'stroke-linejoin': 'round' }, c);
      list.push({ g: c, x: (r() - 0.5) * s * 3.2, y: (r() - 0.5) * s * 1.1, rot: (r() * 40 - 20) * 0.3, d: r() });
    }
    list.forEach(o => tr(o.g, o.x, o.y, 1, o.rot));
    g.list = list;
    return g;
  }
  // a shallow glass dish, rim centre at (0,0)
  function dish(parent, rx) {
    const g = G(parent), ry = rx * 0.14, d = rx * 0.24;
    E('path', { d: `M${-rx},0 C${-rx},${d * 1.3} ${rx},${d * 1.3} ${rx},0 Z`, fill: 'rgba(200,230,250,0.14)' }, g);
    E('ellipse', { cx: 0, cy: 0, rx, ry, fill: 'rgba(200,230,250,0.08)', stroke: GLASS.stroke, 'stroke-width': 3 }, g);
    g.inside = G(g);
    E('path', { d: `M${-rx},0 C${-rx},${d * 1.3} ${rx},${d * 1.3} ${rx},0`, fill: 'none', stroke: GLASS.stroke, 'stroke-width': 4 }, g);
    E('path', { d: `M${-rx * 0.92},${ry * 0.7} Q0,${ry * 1.5} ${rx * 0.92},${ry * 0.7}`, fill: 'none', stroke: GLASS.shine, 'stroke-width': 3 }, g);
    g.ry = ry;
    return g;
  }
  // mound of sand in a dish: returns {g, top(x)}; speckles for texture
  function mound(parent, w, h, seed, nSpk) {
    const g = G(parent), hw = w / 2, r = rng(seed);
    E('path', { d: `M${-hw},6 Q${-hw * 0.55},${-h * 0.95} 0,${-h} Q${hw * 0.55},${-h * 0.95} ${hw},6 Z`, fill: ball(SANDLT, SAND), stroke: SANDDK, 'stroke-width': 1.5 }, g);
    const top = x => { const u = clamp((x + hw) / w); return lerp(6, -h, 1 - Math.pow(2 * u - 1, 2)) ; };
    const dk = [], lt = [];
    for (let i = 0; i < (nSpk || 0); i++) { const x = (r() - 0.5) * w * 0.86, y = lerp(top(x) + 5, 4, r()), rr = +(1.6 + r() * 1.8).toFixed(1); (r() > 0.5 ? dk : lt).push([x, y, rr]); }
    if (dk.length) E('path', { d: dotsD(dk), fill: SANDDK, opacity: 0.8 }, g);
    if (lt.length) E('path', { d: dotsD(lt), fill: '#FFF1D2', opacity: 0.8 }, g);
    return { g, top };
  }
  // separating funnel: pear-shaped bulb, tap at (0,0), stem to y=104 (unscaled). g.set(vw, vo) water / oil volumes
  // as fractions of a full fill; g.tap(open 0..1); g.stem(top y, on); g.yb / g.yt are the boundary / top levels
  function sepFunnel(parent) {
    const g = G(parent);
    const NT = -336, EY = -208, EA = 88, EB = 96, LB = -24, TUBE = 7;
    const rOut = y => {
      if (y <= -302.4) return 16;
      if (y <= EY) { const k = (y - EY) / EB; return Math.max(16, EA * Math.sqrt(Math.max(0, 1 - k * k))); }
      if (y <= LB) { const s = (y - EY) / (LB - EY); return TUBE + (EA - TUBE) * Math.pow(Math.cos(Math.PI / 2 * s), 1.25); }
      return TUBE;
    };
    const rIn = y => Math.max(2.5, rOut(y) - 3.5);
    const side = (f, k) => { const pts = []; for (let y = NT; y <= -10; y += 5) pts.push([k * f(y), y]); return pts; };
    const outR = side(rOut, 1), outL = side(rOut, -1).reverse();
    const outline = 'M' + outR.concat([[TUBE, -10], [-TUBE, -10]], outL).map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' L');
    const inR = side(rIn, 1), inL = side(rIn, -1).reverse();
    const inner = 'M' + inR.concat([[4, -6], [-4, -6]], inL).map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' L') + ' Z';
    // stem below the tap
    E('path', { d: 'M-6,8 L-6,100 L6,108 L6,8', fill: 'rgba(200,230,250,0.10)', stroke: GLASS.stroke, 'stroke-width': 3.5, 'stroke-linejoin': 'round' }, g);
    g.stemW = E('rect', { x: -3, y: 10, width: 6, height: 0, fill: C.water }, g);
    E('path', { d: outline + ' Z', fill: GLASS.fill }, g);
    const clip = _clipUrl(inner);
    const water = E('rect', { x: -100, y: 0, width: 200, height: 0, fill: C.water, opacity: 0.88, 'clip-path': clip }, g);
    const oil = E('rect', { x: -100, y: 0, width: 200, height: 0, fill: OIL, opacity: 0.92, 'clip-path': clip }, g);
    const bnd = E('line', { x1: 0, x2: 0, y1: 0, y2: 0, stroke: '#FFFFFF', 'stroke-width': 2.5, opacity: 0.75 }, g);
    const topL = E('line', { x1: 0, x2: 0, y1: 0, y2: 0, stroke: '#FFFFFF', 'stroke-width': 3, opacity: 0.4 }, g);
    E('path', { d: outline, fill: 'none', stroke: GLASS.stroke, 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
    E('path', { d: `M${-EA + 18},${EY - 20} Q${-EA + 12},${EY + 30} ${-EA + 34},${EY + 76}`, fill: 'none', stroke: GLASS.shine, 'stroke-width': 6, 'stroke-linecap': 'round' }, g);
    E('path', { d: `M-22,${NT} L22,${NT}`, stroke: GLASS.stroke, 'stroke-width': 5, 'stroke-linecap': 'round' }, g);
    // tap: a round stopcock with a handle (vertical = open, horizontal = closed)
    E('circle', { r: 12, fill: '#D9E4EA', stroke: '#8FA2B0', 'stroke-width': 2.5 }, g);
    g.handle = G(g);
    E('rect', { x: -27, y: -5, width: 54, height: 10, rx: 5, fill: '#4D5B66', stroke: '#B8C6D0', 'stroke-width': 2 }, g.handle);
    E('circle', { r: 4, fill: '#B8C6D0' }, g);
    // volume table: litres up from the tap, so levels move like a real funnel (fast in the narrow cone)
    const Y0 = -8, N = Math.round(Y0 - (NT + 4)), cum = [0];
    for (let i = 1; i <= N; i++) { const r = rIn(Y0 - i + 0.5); cum.push(cum[i - 1] + r * r); }
    const yAt = v => {
      if (v <= 0) return Y0;
      let lo = 0, hi = N;
      while (hi - lo > 1) { const m = (lo + hi) >> 1; if (cum[m] < v) lo = m; else hi = m; }
      return Y0 - (lo + clamp((v - cum[lo]) / Math.max(1e-6, cum[hi] - cum[lo])));
    };
    const VFULL = cum[Math.round(Y0 + 226)];
    g.set = (vw, vo) => {
      const yb = yAt(vw * VFULL), yt = yAt((vw + vo) * VFULL);
      attr(water, 'y', yb); attr(water, 'height', Math.max(0, Y0 + 2 - yb));
      attr(oil, 'y', yt); attr(oil, 'height', Math.max(0, yb - yt));
      const rb = rIn(yb), rt = rIn(yt);
      attr(bnd, 'x1', -rb); attr(bnd, 'x2', rb); attr(bnd, 'y1', yb); attr(bnd, 'y2', yb); op(bnd, vw > 0.002 && vo > 0.002 ? 0.75 : 0);
      attr(topL, 'x1', -rt); attr(topL, 'x2', rt); attr(topL, 'y1', yt); attr(topL, 'y2', yt); op(topL, vw + vo > 0.002 ? 0.4 : 0);
      g.yb = yb; g.yt = yt; g.rb = rb;
    };
    g.tap = p => tr(g.handle, 0, 0, 1, 90 * clamp(p));
    g.stem = (top, on) => { attr(g.stemW, 'y', top); attr(g.stemW, 'height', Math.max(0, 102 - top)); op(g.stemW, on); };
    g.yAt = yAt; g.VFULL = VFULL; g.rIn = rIn;
    g.set(0, 0); g.tap(0); g.stem(102, 0);
    return g;
  }

  /* ================= A. two more methods ================= */
  const Ag = G(root);
  const aTtl = title(Ag, 'Two more methods');
  const icons = [
    { x: 420, label: 'separating funnel', draw: g => { const f = sepFunnel(g); tr(f, 0, 64, 0.38); f.set(0.6, 0.4); } },
    { x: 780, label: 'magnet', draw: g => { tr(magnet(g, 190, 56), 0, -10); const r = rng(5), l = []; for (let i = 0; i < 9; i++) l.push([-80 + i * 20 + (r() - 0.5) * 6, 32 + r() * 10, (70 + r() * 40) * Math.PI / 180]); filingsPath(g, l, 1); } },
  ].map(o => {
    const g = G(Ag);
    card(g, -150, -150, 300, 300, { fill: C.card, stroke: C.line });
    const art = G(g); tr(art, 0, -24); o.draw(art);
    T(g, 0, 118, o.label, { size: 30, weight: 700, anchor: 'middle' });
    return { g, x: o.x };
  });

  /* ================= B. layers: a shaken beaker of oil and water settles ================= */
  const LBX = 600, LBY = 452, LW = 220, LH = 260;
  const Bg = G(root);
  const lbG = G(Bg);
  const lb = beaker(lbG, LW, LH, { level: 0, liquid: C.water });
  const lbClip = lb.liquid.getAttribute('clip-path');
  const lbIn = E('g', { 'clip-path': lbClip }); lb.insertBefore(lbIn, lb.liquid.nextSibling.nextSibling);
  const lbRot = G(lbIn);                    // counter-rotated so the liquid stays level when the beaker tilts
  const LBOT = LH / 2, LTOP = LBOT - (LH - 18) * 0.7, LBND = LBOT - (LH - 18) * 0.42;   // local: bottom, oil top, boundary
  const lbWater = E('rect', { x: -400, y: LTOP, width: 800, height: 600, fill: C.water, opacity: 0.85 }, lbRot);
  const lbOil = E('rect', { x: -400, y: LTOP, width: 800, height: 0, fill: OIL, opacity: 0.95 }, lbRot);
  const lbBnd = E('line', { x1: -400, x2: 400, y1: LBND, y2: LBND, stroke: '#FFFFFF', 'stroke-width': 2.5, opacity: 0 }, lbRot);
  const lbSurf = E('rect', { x: -400, y: LTOP, width: 800, height: 4, fill: '#FFFFFF', opacity: 0.35 }, lbRot);
  const dr = rng(42), drops = [];
  for (let i = 0; i < 26; i++) drops.push({ el: E('circle', { r: 5 + dr() * 7, fill: OIL, stroke: '#FFE1A6', 'stroke-width': 1.5, opacity: 0.95 }, lbRot), x: (dr() - 0.5) * (LW - 40), y: lerp(LTOP + 14, LBOT - 12, dr()), sp: 0.15 + dr() * 0.75, ph: dr() * TAU });
  const bTtl = title(Bg, 'Separating funnel');
  const bL = G(Bg);
  const immis = chip(bL, 'immiscible: they don’t mix', { size: 28, fill: C.card2, stroke: OIL, sw: 3 });
  const lblOil = labelLine(bL, 790, LBY + (LTOP + LBND) / 2 + 9, LBX + LW / 2 - 14, LBY + (LTOP + LBND) / 2, 'oil', { size: 30, fill: OIL });
  const lblWater = labelLine(bL, 790, LBY + (LBND + LBOT) / 2 + 9, LBX + LW / 2 - 14, LBY + (LBND + LBOT) / 2, 'water', { size: 30, fill: C.water });
  const lblDense = T(bL, 790, LBY + (LTOP + LBND) / 2 + 44, 'less dense, so it floats', { size: 24, weight: 600, fill: C.muted });

  /* ================= C. the separating funnel on its stand ================= */
  const FUX = 380, TAPY = 540, FUS = 0.85, PBX = 507.2, PBY = 213.9, PROT = -62, PSC = 0.5;   // rig, and the beaker's pouring pose
  const Cg = G(root);
  const rig = G(Cg);
  E('rect', { x: FUX - 226, y: 690, width: 150, height: 16, rx: 5, fill: ball('#6B7A88', '#46525C'), stroke: '#9DB0BF', 'stroke-width': 2 }, rig);
  E('rect', { x: FUX - 166, y: 196, width: 12, height: 498, rx: 5, fill: linGrad('#C9D4DC', '#7D8C99'), stroke: '#9DB0BF', 'stroke-width': 1.5 }, rig);
  const RINGY = TAPY - 116 * FUS;
  E('rect', { x: FUX - 160, y: RINGY - 5, width: 108, height: 10, rx: 4, fill: '#8E9CA9', stroke: '#B9C6D2', 'stroke-width': 1.5 }, rig);
  E('rect', { x: FUX - 174, y: RINGY - 13, width: 28, height: 26, rx: 5, fill: '#6B7A88', stroke: '#B9C6D2', 'stroke-width': 2 }, rig);
  E('ellipse', { cx: FUX, cy: RINGY, rx: 57, ry: 9, fill: 'none', stroke: '#8E9CA9', 'stroke-width': 5 }, rig);
  const sf = sepFunnel(rig); tr(sf, FUX, TAPY, FUS);
  E('path', { d: `M${FUX - 57},${RINGY} A57,9 0 0 0 ${FUX + 57},${RINGY}`, fill: 'none', stroke: '#B9C6D2', 'stroke-width': 5 }, rig);
  const rbk = beaker(rig, 140, 150, { level: 0, liquid: C.water }); tr(rbk, FUX, 630);
  const stream = E('rect', { x: FUX - 2.5, y: 628, width: 5, height: 0, fill: C.water }, rig);
  const pour = E('path', { fill: 'none', stroke: OIL, 'stroke-width': 9, 'stroke-linecap': 'round' }, Cg);
  const pour2 = E('path', { fill: 'none', stroke: '#FFFFFF', 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-dasharray': '8 18', opacity: 0.45 }, Cg);
  const lblSF = labelLine(Cg, 550, 330, FUX + 70, 352, 'separating funnel', { size: 28 });
  const lblTap = labelLine(Cg, 470, 556, FUX + 16, TAPY + 2, 'tap', { size: 30 });
  const chOpen = chip(Cg, 'open', { size: 26, fill: '#123D2C', stroke: C.good, color: C.good, sw: 2 });
  const chShut = chip(Cg, 'closed', { size: 26, fill: '#43171D', stroke: C.bad, color: '#FF9AA4', sw: 2 });
  const lblDrain = labelLine(Cg, 520, 612, FUX + 6, 642, 'water drains out first', { size: 28 });
  const bndG = G(Cg);
  const bndLine = E('line', { x1: 0, x2: 520, y1: 0, y2: 0, stroke: '#FFFFFF', 'stroke-width': 2.5, 'stroke-dasharray': '6 6' }, bndG);
  const bndTxt = T(bndG, 530, 9, 'boundary', { size: 28, weight: 600 });
  const lblStay = labelLine(Cg, 520, 404, FUX + 20, 452, 'the oil stays behind', { size: 28, fill: OIL });

  /* ================= D. magnetic separation ================= */
  const DX = 870, DY = 596;
  const Dg = G(root);
  const dTtl = title(Dg, 'Magnetic separation', 600);
  const dsh = dish(Dg, 190); tr(dsh, DX, DY);
  const md = mound(dsh.inside, 330, 52, 7, 34);
  const fr = rng(19), fil = [];
  for (let i = 0; i < 26; i++) {
    const x = (fr() - 0.5) * 290, y = lerp(md.top(x) + 7, 6, fr() * 0.85);
    const end = i < 10 ? -1 : i < 20 ? 1 : 0;
    const ax = end ? end * (62 + fr() * 54) : (fr() - 0.5) * 90, ay = 36 + fr() * (end ? 16 : 6), ar = 90 + (fr() - 0.5) * 60;
    fil.push({ el: filing(Dg, 1.05), x: DX + x, y: DY + y, r: fr() * 180, ax, ay, ar, k: fr() });
  }
  const mag = G(Dg); magnet(mag, 240, 64);
  const lblIron = G(Dg);
  labelLine(lblIron, 1004, 476, DX + 96, DY - 24, 'iron filings', { size: 28 });
  T(lblIron, 1004, 506, 'magnetic', { size: 24, weight: 700, fill: '#FF8A94' });
  const lblSand = G(Dg);
  labelLine(lblSand, 726, 476, DX - 70, DY - 30, 'sand', { size: 28, fill: SAND });
  T(lblSand, 726, 506, 'not magnetic', { size: 24, weight: 600, anchor: 'end', fill: C.muted });
  const sulf = G(Dg);
  chip(sulf, 'or with sulfur', { size: 26, fill: '#3D3412', stroke: SULF, color: SULF, sw: 2 });
  const lblPulled = T(Dg, DX, 262, 'the iron is pulled out', { size: 28, weight: 700, anchor: 'middle' });
  const lblLeft = T(Dg, DX, 690, 'the sand is left behind', { size: 28, weight: 600, anchor: 'middle', fill: SAND });

  /* ================= E. only magnetic metals ================= */
  const Eg = G(root);
  T(Eg, 70, 256, 'Only magnetic metals:', { size: 32, weight: 700 });
  const metals = ['iron', 'steel', 'nickel', 'cobalt'].map((m, i) => {
    const g = G(Eg);
    card(g, -100, -30, 200, 60, { fill: C.card2, stroke: C.good, sw: 2.5, rx: 30 });
    const tk = tick(g, 11); tr(tk, -66, 1);
    T(g, 14, 10, m, { size: 30, weight: 700, anchor: 'middle' });
    return { g, x: 175 + (i % 2) * 230, y: 330 + Math.floor(i / 2) * 86 };
  });
  const notRow = G(Eg);
  const nx = cross(notRow, 10); tr(nx, 84, 520);
  T(notRow, 106, 530, 'not copper or aluminium', { size: 26, weight: 600, fill: C.muted });

  /* ================= F. ask three questions ================= */
  const Fg = G(root);
  const fTtl = title(Fg, 'Choose a method: ask…');
  const qs = [
    { x: 230, l1: 'solid, liquid', l2: 'or dissolved?', draw: g => {
      const m = mound(g, 70, 30, 3, 6); tr(m.g, -70, 20);
      tr(E('path', { d: 'M0,-24 C8,-12 13,-4 13,4 A13,13 0 0 1 -13,4 C-13,-4 -8,-12 0,-24 Z', fill: C.water }, g), 0, 14);
      const bk = beaker(g, 56, 64, { level: 0.6, liquid: C.water, marks: false }); tr(bk, 74, 8);
      [[-10, 18], [6, 26], [12, 12], [-4, 30]].forEach(([x, y]) => { const s = saltCube(g, 6); tr(s, 74 + x, y - 10); s.style.opacity = 0.75; });
    } },
    { x: 600, l1: 'do they', l2: 'mix?', draw: g => {
      const bk = beaker(g, 96, 110, { level: 0.42, liquid: C.water }); tr(bk, 0, 0);
      const cl = bk.liquid.getAttribute('clip-path'), o = E('rect', { x: -60, y: -9.4, width: 120, height: 25.8, fill: OIL, 'clip-path': cl }, null); bk.insertBefore(o, bk.liquid.nextSibling);
    } },
    { x: 970, l1: 'is anything', l2: 'magnetic?', draw: g => { tr(magnet(g, 150, 44), 0, -14); const l = []; for (let i = 0; i < 7; i++) l.push([-60 + i * 20, 22 + (i % 2) * 6, (80 + i * 6) * Math.PI / 180]); filingsPath(g, l, 0.9); } },
  ].map((q, i) => {
    const g = G(Fg);
    card(g, -160, -150, 320, 300, { fill: C.card, stroke: C.line });
    const badge = G(g); tr(badge, -126, -116);
    E('circle', { r: 20, fill: C.energy }, badge);
    T(badge, 0, 9, String(i + 1), { size: 26, weight: 700, anchor: 'middle', fill: C.bg0 });
    const art = G(g); tr(art, 0, -42); q.draw(art);
    T(g, 0, 76, q.l1, { size: 32, weight: 600, anchor: 'middle' });
    T(g, 0, 116, q.l2, { size: 32, weight: 700, anchor: 'middle', fill: C.energy });
    return { g, x: q.x };
  });

  /* ================= G. FECD ================= */
  const Gg = G(root);
  const gTtl = title(Gg, 'Remember **FECD**');
  const TX = [195, 465, 735, 1005], TY = 420;
  const tiles = [
    { L: 'F', word: 'Filter', note: 'an insoluble solid', draw: g => { const k = flask(g, 0.42, { level: 0.35, liquid: C.water }); tr(k, 0, 34); const f = filterFunnel(g); tr(f, 0, -22, 0.5); } },
    { L: 'E', word: 'Evaporate', note: 'a dissolved solid', draw: g => { tr(tripod(g, 92, 40, true), 0, 34); const b = basin(g, 120); tr(b, 0, 37 - b.depth); b.set(0.4); const h = heatWaves(g, { n: 3, h: 34, spacing: 22, color: '#CFE7F5', width: 3.5 }); tr(h, 0, -10); g.anim = h; } },
    { L: 'C', word: 'Crystallise', note: 'a dissolved solid', draw: g => { crystals(g, 7, 27, 5); } },
    { L: 'D', word: 'Distil', note: 'keeps the liquid', draw: g => { const c = condenser(g, 170, 26, 144, 18); c.setAttribute('transform', 'translate(-82 -30) rotate(18)'); const b = beaker(g, 60, 64, { level: 0.4, liquid: C.water, marks: false }); tr(b, 76, 44); } },
  ].map((o, i) => {
    const g = G(Gg);
    const frame = card(g, -125, -170, 250, 340, { fill: C.card, stroke: C.line, sw: 3 });
    const disc = G(g); tr(disc, 0, -118);
    E('circle', { r: 36, fill: C.energy }, disc);
    T(disc, 0, 19, o.L, { size: 54, weight: 700, anchor: 'middle', fill: C.bg0 });
    const art = G(g); tr(art, 0, -4); o.draw(art);
    const word = T(g, 0, 104, o.word, { size: 32, weight: 700, anchor: 'middle' });
    const note = T(g, 0, 142, o.note, { size: 24, weight: 600, anchor: 'middle', fill: C.muted });
    return { g, frame, disc, art, word, note, x: TX[i] };
  });

  /* ================= H. the puzzle and its solution ================= */
  const Hg = G(root);
  const hTtl = title(Hg, 'Puzzle!');
  const sTtl = title(Hg, 'The solution');
  const PX = 600, PY = 500;
  const pz = G(Hg);                         // the jumbled dish (later shrinks into step 1)
  const pdsh = dish(pz, 220);
  const pmd = mound(pdsh.inside, 380, 64, 11, 26);
  const pr = rng(23), pFil = [], pSalt = [];
  for (let i = 0; i < 12; i++) { const x = (pr() - 0.5) * 330, y = lerp(pmd.top(x) + 8, 6, pr() * 0.8); const f = filing(pz, 1.1); pFil.push({ el: f, x, y, r: pr() * 180, ax: (i % 2 ? 1 : -1) * (40 + pr() * 60), ay: 34 + pr() * 12, ar: 90 + (pr() - 0.5) * 60 }); tr(f, x, y, 1, pFil[i].r); }
  for (let i = 0; i < 16; i++) { const x = (pr() - 0.5) * 330, y = lerp(pmd.top(x) + 8, 6, pr() * 0.8); pSalt.push([x, y, 4, pr() * 0.7]); }
  E('path', { d: squaresD(pSalt), fill: SALT, stroke: SALTDK, 'stroke-width': 0.9, 'stroke-linejoin': 'round' }, pz);
  const pLbl = G(Hg);
  const lpSand = labelLine(pLbl, 330, 420, PX - 120, PY - 30, 'sand', { size: 30, fill: SAND });
  const lpIron = labelLine(pLbl, 870, 400, PX + 60, PY - 52, 'iron filings', { size: 30 });
  const lpSalt = labelLine(pLbl, 870, 640, PX + 110, PY + 4, 'salt', { size: 30 });
  const pQ = T(Hg, PX, 270, 'How would you get all three back?', { size: 34, weight: 700, anchor: 'middle', fill: C.energy });
  const ringG = G(Hg); tr(ringG, 1060, 520);
  const rg = ring(ringG, 54, C.energy);
  T(ringG, 0, 20, '?', { size: 58, weight: 700, anchor: 'middle', fill: C.energy });

  // the four steps
  const SX = [210, 470, 730, 990], SY = 345;
  const steps = SX.map((x, i) => {
    const g = G(Hg);
    card(g, -115, -150, 230, 300, { fill: C.card, stroke: C.line });
    const badge = G(g); tr(badge, -86, -120);
    E('circle', { r: 19, fill: C.energy }, badge);
    T(badge, 0, 9, String(i + 1), { size: 26, weight: 700, anchor: 'middle', fill: C.bg0 });
    return { g, x };
  });
  const stepLbl = ['magnet', 'add water', 'filter', 'crystallise'].map((s, i) => { const t = T(steps[i].g, 14, -110, s, { size: 26, weight: 700, anchor: 'middle' }); return t; });
  const sArrows = [0, 1, 2].map(i => arrow(Hg, SX[i] + 122, SY, SX[i + 1] - 122, SY, { color: C.faint, width: 5 }));
  // step 1: a small magnet over the shrunken dish
  const s1mag = G(steps[0].g); magnet(s1mag, 150, 40);
  // step 2: beaker of water, the salt dissolves, the sand settles
  const s2 = G(steps[1].g);
  const s2bk = beaker(s2, 120, 140, { level: 0, liquid: C.water }); tr(s2bk, 0, 36);
  const s2clip = s2bk.liquid.getAttribute('clip-path'), s2in = E('g', { 'clip-path': s2clip }); s2bk.insertBefore(s2in, s2bk.liquid.nextSibling.nextSibling);
  const s2r = rng(31), s2sand = [], s2salt = [];
  for (let i = 0; i < 14; i++) s2sand.push([(s2r() - 0.5) * 96, 62 - s2r() * 12, +(4 + s2r() * 2).toFixed(1)]);
  E('path', { d: dotsD(s2sand), fill: SAND, stroke: SANDDK, 'stroke-width': 1 }, s2in);
  for (let i = 0; i < 7; i++) s2salt.push([(s2r() - 0.5) * 90, 52 - s2r() * 10, 3.5, s2r()]);
  const s2saltP = E('path', { d: squaresD(s2salt), fill: SALT, stroke: SALTDK, 'stroke-width': 0.8 }, s2in);
  const s2jug = G(s2); E('path', { d: 'M-22,-26 L22,-26 L26,26 Q26,32 20,32 L-20,32 Q-26,32 -26,26 Z', fill: 'rgba(200,230,250,0.12)', stroke: GLASS.stroke, 'stroke-width': 3 }, s2jug);
  E('rect', { x: -21, y: -4, width: 44, height: 33, rx: 4, fill: C.water, opacity: 0.8 }, s2jug);
  const s2pour = E('path', { d: 'M-18,-60 Q-8,-40 -6,-6', fill: 'none', stroke: C.water, 'stroke-width': 6, 'stroke-linecap': 'round' }, s2);
  // step 3: filter funnel in a flask, sand on the paper, salt water below
  const s3 = G(steps[2].g);
  const s3fl = flask(s3, 0.62, { level: 0, liquid: C.water }); tr(s3fl, 0, 70);
  const s3fu = filterFunnel(s3); tr(s3fu, 0, -20, 0.7);
  const s3sand = E('path', { d: 'M-41,52 Q0,17 41,52 L0,110 Z', fill: ball(SANDLT, SAND), stroke: SANDDK, 'stroke-width': 2 }, s3fu.inside);
  const s3drip = E('circle', { r: 3.5, fill: C.water }, s3);
  // step 4: evaporating basin on a tripod over a Bunsen; crystals form
  const s4 = G(steps[3].g);
  const s4b = bunsen(s4, 0.45); tr(s4b, 0, 120);
  tr(tripod(s4, 96, 128 - 28), 0, 28);                 // tall enough for the flame to show under the gauze, as in 07/08
  const s4bas = basin(s4, 130); tr(s4bas, 0, 31 - s4bas.depth);
  const s4cr = crystals(s4, 6, 12, 9); tr(s4cr, 0, 28 - 22);
  const s4heat = heatWaves(s4, { n: 3, h: 46, spacing: 22, color: '#CFE7F5', width: 3.5 }); tr(s4heat, 0, -26);
  // the three piles
  const PILY = 600;
  const piles = [
    { x: SX[0], name: 'iron', make: g => { E('path', { d: 'M-52,10 Q-24,-26 0,-28 Q24,-26 52,10 Z', fill: ball('#8A939C', '#3E454C'), stroke: '#A7B0B8', 'stroke-width': 1.5 }, g); const r = rng(61), l = []; for (let i = 0; i < 9; i++) l.push([(r() - 0.5) * 70, -4 - r() * 14, r() * Math.PI]); filingsPath(g, l, 0.9); } },
    { x: SX[2], name: 'sand', make: g => { const m = mound(g, 104, 36, 13, 10); tr(m.g, 0, 4); } },
    { x: SX[3], name: 'salt', make: g => { E('path', { d: 'M-50,10 Q-24,-22 0,-24 Q24,-22 50,10 Z', fill: ball('#FFFFFF', '#C9D6DE'), stroke: '#E9F2F7', 'stroke-width': 1.5 }, g); const c = crystals(g, 5, 10, 17); tr(c, 0, -8); } },
  ].map(p => {
    const g = G(Hg); const art = G(g); p.make(art);
    T(g, 0, 58, p.name, { size: 30, weight: 700, anchor: 'middle' });
    const a = arrow(Hg, p.x, SY + 160, p.x, PILY - 40, { color: C.faint, width: 4 });
    return { g, x: p.x, a };
  });

  Hg.appendChild(pz);                       // the dish sits above the step cards once it shrinks into step 1

  /* ================= update ================= */
  return t => {
    const tTwo = at('two'), tLay = at('layers'), tFun = at('funnel'), tTap = at('tap'), tMag = at('magnet'), tLift = at('lift');
    const tOnly = at('only'), tAsk = at('ask'), tF = at('fecd'), tPz = at('puzzle'), tSo = at('solve');

    /* ---- A. two more methods ---- */
    const aA = beat(t, tTwo - 0.3, tLay + 0.1);
    op(Ag, aA);
    if (aA > 0) {
      op(aTtl, P(t, tTwo - 0.1, 0.4, linear));
      icons.forEach((o, i) => popAt(o.g, t, tTwo + 0.05 + i * 0.45, o.x, 420));
    }

    // the layers beaker: shaken, then carried to the funnel and tipped (oil pours out first, then water)
    const shake = (1 - P(t, mid('layers', 0.3), 0.5, linear)) * P(t, tLay, 0.3, linear) * calm;
    const mv = P(t, tFun, 1.1, ease), back = P(t, tFun + 2.7, 0.5, easeIn);
    const rot = lerp(9 * Math.sin(t * 13) * shake, PROT, mv) + 25 * back, sc = lerp(1, PSC, mv);
    const bx = lerp(LBX, PBX, mv) + 40 * back, by = lerp(LBY, PBY, mv) - 20 * back;
    const th = rot * Math.PI / 180, sth = Math.sin(th), cth = Math.cos(th);
    const empty = P(t, tFun + 1.0, 1.7, linear);
    const pOil = 0.4 * clamp(empty / 0.4), pWat = 0.6 * clamp((empty - 0.4) / 0.6);

    /* ---- B. layers ---- */
    const bTitle = beat(t, tLay + 0.15, tMag + 0.1);
    op(bTtl, bTitle);
    const aB = Math.min(P(t, tLay + 0.05, 0.45, linear), 1 - P(t, tFun + 3.2, 0.4, linear));
    op(lbG, aB); op(bL, aB);
    if (aB > 0) {
      const settle = P(t, mid('layers', 0.34), 3.0, easeOut);
      tr(lbG, bx, by, sc, rot);
      tr(lbRot, 0, 0, 1, -rot);
      // the surface can't sit above the lip; while pouring it sinks towards the lowest corner
      const lipY = -110 * sth - 130 * cth, lowY = -110 * sth + 130 * cth;
      const ys = lerp(Math.max(LTOP, lipY), Math.max(lowY, lipY) + 6, empty);
      const oilT = (LBND - LTOP) * settle * (1 - clamp(empty / 0.4));
      attr(lbSurf, 'y', ys); attr(lbOil, 'y', ys); attr(lbOil, 'height', oilT); attr(lbWater, 'y', ys + oilT);
      attr(lbBnd, 'y1', ys + oilT); attr(lbBnd, 'y2', ys + oilT);
      op(lbBnd, P(settle, 0.85, 0.15, linear) * 0.75 * (oilT > 1 ? 1 : 0));
      op(lbSurf, empty < 0.99 ? 0.35 : 0);
      drops.forEach((d, i) => {
        const yLayer = LTOP + (LBND - LTOP) * settle;          // the bottom of the oil layer so far
        const rise = P(settle, d.sp * 0.6, 0.4, easeIn);
        const y = lerp(d.y, LTOP + 8, rise) + Math.sin(t * 7 + d.ph) * 4 * shake;
        attr(d.el, 'cx', d.x + Math.sin(t * 9 + d.ph) * 6 * shake); attr(d.el, 'cy', y);
        op(d.el, 0.95 * clamp((y - yLayer) / 8));
      });
      const lp = beat(t, mid('layers', 0.42), tFun + 0.1);
      op(immis, lp); tr(immis, 300, 250 + (1 - P(t, mid('layers', 0.42), 0.5, easeOut)) * 14);
      lblOil.set(beat(t, mid('layers', 0.62), tFun + 0.1)); lblWater.set(beat(t, mid('layers', 0.68), tFun + 0.1));
      op(lblDense, beat(t, mid('layers', 0.84), tFun + 0.1));
    }

    /* ---- C. separating funnel ---- */
    const aC = Math.min(P(t, tFun - 0.1, 0.45, linear), 1 - P(t, tOnly - 0.1, 0.45, linear));
    const dim = 1 - 0.68 * P(t, tMag - 0.1, 0.6, linear);
    op(Cg, aC * dim);
    if (aC > 0) {
      const rp = P(t, tFun - 0.1, 0.6, easeOut); tr(rig, (1 - rp) * -30, 0);
      // filling by pouring: the stream runs from the tipped beaker's lip into the funnel's neck
      const ps = P(t, tFun + 0.95, 0.15, linear) * (1 - P(t, tFun + 2.62, 0.12, linear));
      const lipX = bx + sc * (-110 * cth + 130 * sth), lipYs = by + sc * (-110 * sth - 130 * cth), mouth = [FUX + 2, TAPY - 336 * FUS + 8];
      const pd = `M${lipX.toFixed(1)},${lipYs.toFixed(1)} Q${(lipX - 14).toFixed(1)},${(lipYs + 6).toFixed(1)} ${mouth[0]},${mouth[1]}`;
      pour.setAttribute('d', pd); pour.setAttribute('stroke', empty < 0.4 ? OIL : C.water);
      pour2.setAttribute('d', pd); pour2.setAttribute('stroke-dashoffset', (-t * 90).toFixed(1));
      op(pour, ps); op(pour2, ps * 0.45);
      // draining through the tap
      const tOpen = mid('tap', 0.04), tShut = mid('tap', 0.72);
      const drain = P(t, mid('tap', 0.1), tShut - mid('tap', 0.1), ease);
      const vw = pWat * (1 - drain), vo = pOil;
      sf.set(vw, vo);
      const open = P(t, tOpen, 0.35, ease) * (1 - P(t, tShut - 0.1, 0.35, ease));
      sf.tap(open);
      const flowing = t > tOpen + 0.2 && t < tShut + 0.15;
      const emptyStem = P(t, tShut + 0.1, 0.35, linear);
      sf.stem(10 + 92 * emptyStem, t > tOpen + 0.2 && emptyStem < 1 ? 1 : 0);
      const lvl = 0.45 * drain;
      rbk.set(lvl);
      const surf = 630 + 75 - 132 * lvl;
      attr(stream, 'height', flowing || (emptyStem > 0 && emptyStem < 1) ? Math.max(0, surf - 628) : 0);
      lblSF.set(beat(t, mid('funnel', 0.22), tTap + 0.1));
      lblTap.set(beat(t, mid('funnel', 0.72), tTap + 0.1));
      const ch = win(t, tOpen, tShut, 0.25), cs = beat(t, tShut + 0.05, tMag);
      op(chOpen, ch); tr(chOpen, 286, 520); op(chShut, cs); tr(chShut, 286, 520);
      lblDrain.set(beat(t, mid('tap', 0.2), tMag));
      const bv = beat(t, mid('tap', 0.44), tShut + 0.4);
      op(bndG, bv);
      if (bv > 0) { const yb = TAPY + sf.yb * FUS; tr(bndG, 0, yb); attr(bndLine, 'x1', FUX + sf.rb * FUS + 6); }
      lblStay.set(beat(t, mid('tap', 0.82), tMag + 0.1));
    }

    /* ---- D. magnetic separation ---- */
    const aD = Math.min(P(t, tMag - 0.1, 0.45, linear), 1 - P(t, tAsk - 0.1, 0.45, linear));
    op(Dg, aD);
    if (aD > 0) {
      op(dTtl, P(t, tMag, 0.45, linear));
      const dp = P(t, tMag - 0.05, 0.6, easeOut); tr(dsh, DX, DY + (1 - dp) * 24);
      const down = P(t, tLift, 1.1, ease), up = P(t, mid('lift', 0.55), 1.3, ease);
      const my = lerp(lerp(250, 480, down), 330, up);
      op(mag, P(t, tLift - 0.1, 0.4, linear)); tr(mag, DX, my);
      fil.forEach((f, i) => {
        const j = P(t, tLift + 0.75 + f.k * 0.75, 0.45, easeOut);
        const sx = f.x, sy = f.y + (1 - dp) * 24, ex = DX + f.ax, ey = my + f.ay;
        const x = lerp(sx, ex, j), y = lerp(sy, ey, j) - Math.sin(j * Math.PI) * 24;
        tr(f.el, x, y, 1, lerp(f.r, f.ar, j));
        op(f.el, dp);
      });
      op(lblIron, beat(t, mid('magnet', 0.55), tLift + 0.4));
      op(lblSand, beat(t, mid('magnet', 0.75), tLift + 0.4));
      const sp = beat(t, mid('magnet', 0.9), tLift + 0.2); op(sulf, sp); tr(sulf, DX, 690 + (1 - P(t, mid('magnet', 0.9), 0.5, easeOut)) * 12);
      op(lblPulled, P(t, mid('lift', 0.7), 0.4, linear));
      op(lblLeft, P(t, mid('lift', 0.82), 0.4, linear));
    }

    /* ---- E. only magnetic metals ---- */
    const aE = beat(t, tOnly - 0.1, tAsk + 0.1);
    op(Eg, aE);
    if (aE > 0) {
      op(Eg.childNodes[0], P(t, tOnly + 0.1, 0.4, linear));
      const at4 = [0.42, 0.56, 0.7, 0.84];
      metals.forEach((m, i) => popAt(m.g, t, mid('only', at4[i]), m.x, m.y));
      op(notRow, P(t, mid('only', 0.2), 0.45, linear));
    }

    /* ---- F. questions ---- */
    const aF = beat(t, tAsk - 0.1, tF + 0.05);
    op(Fg, aF);
    if (aF > 0) {
      op(fTtl, P(t, tAsk, 0.4, linear));
      const qAt = [0.3, 0.66, 0.84];
      qs.forEach((q, i) => popAt(q.g, t, mid('ask', qAt[i]), q.x, 430));
    }

    /* ---- G. FECD ---- */
    const aG = beat(t, tF - 0.1, tPz + 0.05);
    op(Gg, aG);
    if (aG > 0) {
      op(gTtl, P(t, tF + 0.15, 0.4, linear));
      const lAt = [0.08, 0.13, 0.18, 0.23], wAt = [0.28, 0.48, 0.6, 0.83], nAt = [0.36, 0.7, 0.7, 0.92];
      const hiOn = [[0.28, 0.47], [0.48, 0.8], [0.6, 0.8], [0.83, 1.2]];
      tiles.forEach((o, i) => {
        popAt(o.g, t, mid('fecd', lAt[i]) - 0.05, o.x, TY);
        op(o.art, P(t, mid('fecd', wAt[i]), 0.45, linear));
        op(o.word, P(t, mid('fecd', wAt[i]), 0.4, linear));
        op(o.note, P(t, mid('fecd', nAt[i]), 0.4, linear));
        const hi = win(t, mid('fecd', hiOn[i][0]), mid('fecd', hiOn[i][1]), 0.3);
        o.frame.setAttribute('stroke', hi > 0.5 ? C.energy : C.line);
        o.frame.setAttribute('stroke-width', (3 + 2 * hi).toFixed(2));
        if (o.art.firstChild && o.art.anim) o.art.anim.upd(t);
      });
    }

    /* ---- H. puzzle and solution ---- */
    const aH = P(t, tPz - 0.1, 0.45, linear);
    op(Hg, aH);
    if (aH > 0) {
      const toS = P(t, tSo - 0.2, 0.9, ease);                 // the dish shrinks into step 1
      op(hTtl, P(t, tPz + 0.15, 0.4, linear) * (1 - P(t, tSo - 0.45, 0.4, linear)));
      op(sTtl, P(t, tSo + 0.05, 0.4, linear));
      const pp = P(t, tPz + 0.05, 0.6, easeOut);
      tr(pz, lerp(PX, SX[0], toS), lerp(PY + (1 - pp) * 24, SY + 70, toS), lerp(1, 0.44, toS));
      op(pz, pp);
      op(pLbl, 1 - P(t, tSo - 0.3, 0.4, linear));
      lpSand.set(P(t, mid('puzzle', 0.18), 0.4, linear)); lpIron.set(P(t, mid('puzzle', 0.28), 0.4, linear)); lpSalt.set(P(t, mid('puzzle', 0.42), 0.4, linear));
      op(pQ, P(t, mid('puzzle', 0.62), 0.45, linear) * (1 - P(t, tSo - 0.3, 0.4, linear)));
      const ringOn = P(t, end('puzzle') - 0.2, 0.3, linear) * (1 - P(t, tSo - 0.1, 0.3, linear));
      op(ringG, ringOn); rg.set(P(t, end('puzzle'), tSo - end('puzzle') - 0.1, linear));
      tr(ringG, 1060, 520, 1 + 0.05 * Math.sin(t * 6) * ringOn * calm);
      // steps
      const sAt = [0.0, 0.2, 0.5, 0.7];
      steps.forEach((s, i) => { const p = P(t, mid('solve', sAt[i]) - 0.1, 0.5, pop); op(s.g, clamp(p * 2)); tr(s.g, s.x, SY + (1 - clamp(p)) * 20); });
      sArrows.forEach((a, i) => { const p = P(t, mid('solve', sAt[i + 1]) - 0.25, 0.4); a.set(p); op(a, p > 0 ? 1 : 0); });
      // step 1: the magnet lifts the iron out of the shrunken dish
      const m1 = P(t, tSo + 0.25, 0.5, ease), m1up = P(t, tSo + 0.95, 0.5, ease);
      const m1y = lerp(lerp(-64, 14, m1), -40, m1up);
      tr(s1mag, 0, m1y); op(s1mag, P(t, tSo + 0.1, 0.3, linear));
      const pzS = lerp(1, 0.44, toS), pzX = lerp(PX, SX[0], toS), pzY = lerp(PY, SY + 70, toS);
      pFil.forEach((f, i) => {
        const j = P(t, tSo + 0.65 + (i % 6) * 0.04, 0.3, easeOut);
        const ex = (SX[0] + f.ax * 0.62 - pzX) / pzS, ey = (SY + m1y + 20 + f.ay * 0.2 - pzY) / pzS;   // magnet underside in dish coordinates
        tr(f.el, lerp(f.x, ex, j), lerp(f.y, ey, j) - Math.sin(j * Math.PI) * 10, 1, lerp(f.r, f.ar, j));
      });
      // step 2: water poured in, salt dissolves, sand settles
      const s2p = P(t, mid('solve', 0.22), 0.8, linear), s2d = P(t, mid('solve', 0.3), 1.0, linear);
      s2bk.set(0.62 * s2p);
      op(s2jug, P(t, mid('solve', 0.2), 0.3, linear) * (1 - P(t, mid('solve', 0.36), 0.3, linear)));
      tr(s2jug, -44, -96, 1, -40);
      op(s2pour, s2p > 0 && s2p < 1 ? 1 : 0);
      op(s2saltP, 1 - s2d);
      // step 3: filter
      const s3p = P(t, mid('solve', 0.52), 1.0, linear);
      s3fl.set(0.4 * s3p);
      op(s3sand, P(t, mid('solve', 0.54), 0.5, linear));
      const dq = ((t - mid('solve', 0.52)) / 0.6) % 1;
      attr(s3drip, 'cx', 0); attr(s3drip, 'cy', lerp(24, 70, dq)); op(s3drip, s3p > 0 && s3p < 1 ? 1 : 0);
      // step 4: crystallise
      s4b.set('blue'); s4b.upd(t); s4heat.upd(t);
      const s4p = P(t, mid('solve', 0.72), 1.3, linear);
      s4bas.set(0.55 * (1 - s4p));
      s4cr.list.forEach(o => { const g = P(t, mid('solve', 0.76) + o.d * 0.8, 0.5, easeOut); tr(o.g, o.x, o.y, Math.max(0.01, g), o.rot); op(o.g, g); });
      // piles
      const pAt = [0.18, 0.66, 0.9];
      piles.forEach((p, i) => { popAt(p.g, t, mid('solve', pAt[i]), p.x, PILY); p.a.set(P(t, mid('solve', pAt[i]) - 0.2, 0.4)); op(p.a, P(t, mid('solve', pAt[i]) - 0.2, 0.2, linear)); });
    }
  };
});
