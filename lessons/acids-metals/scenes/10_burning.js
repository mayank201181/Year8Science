/* Burning and tarnishing: metals react with oxygen.
   Beats: oxygen from the air drifts onto a metal; metal + oxygen -> metal oxide -> a shiny block and a
   dull white powder: a new substance -> showpiece: a magnesium ribbon in tongs over a Bunsen flares
   dazzling white (the room dims) and leaves a white powder; never look straight at it -> 2Mg + O2 -> 2MgO,
   the atoms rearranging -> a knife cuts sodium: the shiny face dulls in seconds; stored under oil -> iron
   filings sprinkled into a flame spark orange -> a nail rusts with oxygen and water; paint, oil, zinc
   -> a gold ring shrugs oxygen off -> the mini reactivity ladder: the higher, the fiercer. */
scene('burning', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.3 : 1;

  /* ---------- palette (STORYBOARD shared art) ---------- */
  const SW = { K: '#D8DEE6', Na: '#D8DEE6', Ca: '#E4E1D8', Mg: '#E3E8EE', Al: '#C7D0DA', Zn: '#A9B6C4', Fe: '#7A8590', Cu: '#D9824B', Ag: '#E8ECF0', Au: '#F5C542' };
  const BASE = '#3F8FE8', RUST = '#A84A2A', RUST_LT = '#CF6E3C', DARK = '#1E2328', O2TXT = '#FF9A8F';
  const CRUST = '#9AA3AD', CRUST_T = '#B8C1C9', CRUST_S = '#7D8892', EDGE = '#D3DCE4';

  /* ---------- local helpers ---------- */
  function rich(parent, x, y, segs, o) {
    o = o || {};
    const t = E('text', { x, y, 'font-size': o.size || 30, 'font-weight': o.weight || 600, 'font-family': o.font || FD, 'text-anchor': o.anchor || 'start', fill: o.fill || C.ink }, parent);
    segs.forEach(s => { if (typeof s === 'string') s = [s]; E('tspan', { fill: s[1], 'font-weight': s[2] }, t).textContent = s[0]; });
    return t;
  }
  /* chemical formula with real subscripts: '2MgO' -> 2MgO, 'O2' -> O₂ (leading digits stay full size) */
  function formula(parent, x, y, str, o) {
    o = o || {};
    const size = o.size || 50, sub = Math.round(size * 0.62), dy = Math.round(size * 0.24);
    const t = E('text', { x, y, 'font-size': size, 'font-weight': o.weight || 600, fill: o.fill || C.ink, 'text-anchor': o.anchor || 'middle', 'font-family': FD }, parent);
    const m = str.match(/^(\d*)(.*)$/);
    let low = false;
    const push = (txt, isSub) => {
      const ts = E('tspan', {}, t); ts.textContent = txt;
      if (isSub) { ts.setAttribute('font-size', sub); if (!low) { ts.setAttribute('dy', dy); low = true; } }
      else if (low) { ts.setAttribute('dy', -dy); low = false; }
    };
    if (m[1]) push(m[1], false);
    m[2].replace(/([A-Za-z]+)|(\d+)/g, (all, letters, digits) => { push(letters || digits, !letters); return ''; });
    return t;
  }
  /* a row of equation chips centred on cx: items {text, fill, color} or {op: '+' | '→'} */
  function eqRow(parent, items, cx, y, o) {
    o = o || {};
    const size = o.size || 32, gap = o.gap || 14;
    const parts = items.map(it => {
      const p = Object.assign({}, it);
      p.g = G(parent);
      if (it.op) {
        if (it.op === '+') T(p.g, 0, size * 0.44, '+', { size: size * 1.4, weight: 600, anchor: 'middle', fill: C.muted });
        else arrow(p.g, -size * 0.8, 0, size * 0.8, 0, { color: C.ink, width: 6 });
        p.w = it.op === '+' ? size * 1.1 : size * 1.9;
      } else { p.chip = chip(p.g, it.text, { size, fill: it.fill, color: it.color || '#FFFFFF', weight: 700 }); p.w = p.chip.w; }
      return p;
    });
    let total = 0; parts.forEach((p, i) => { total += p.w + (i ? gap : 0); });
    let x = cx - total / 2; parts.forEach((p, i) => { if (i) x += gap; p.x = x + p.w / 2; p.y = y; x += p.w; tr(p.g, p.x, y); op(p.g, 0); });
    return parts;
  }
  /* pop a row part in at time t0, with an optional pulse at time tp */
  function showPart(p, t, t0, tp) {
    const a = P(t, t0, 0.5, pop);
    let s = 0.7 + 0.3 * a;
    if (tp !== undefined) s += 0.14 * Math.sin(Math.PI * P(t, tp, 0.5, linear));
    op(p.g, clamp(a * 2)); tr(p.g, p.x, p.y, s);
  }
  const popAt = (el, x, y, p, s0) => { s0 = s0 === undefined ? 0.6 : s0; op(el, clamp(p * 2)); tr(el, x, y, Math.max(0.01, s0 + (1 - s0) * p)); };
  /* position along a polyline, u in 0..1 */
  function along(pts, u) {
    const segs = []; let L = 0;
    for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); segs.push(l); L += l; }
    let d = clamp(u) * L;
    for (let i = 0; i < segs.length; i++) { if (d <= segs[i] || i === segs.length - 1) { const f = segs[i] ? d / segs[i] : 0; return [lerp(pts[i][0], pts[i + 1][0], f), lerp(pts[i][1], pts[i + 1][1], f)]; } d -= segs[i]; }
    return pts[pts.length - 1];
  }
  const bez = (a, c, b, u) => { const v = 1 - u; return [v * v * a[0] + 2 * v * u * c[0] + u * u * b[0], v * v * a[1] + 2 * v * u * c[1] + u * u * b[1]]; };
  let nid = 0;
  const clipD = d => { const id = 'amBurn' + (++nid), cp = E('clipPath', { id }, defs()); E('path', { d }, cp); return `url(#${id})`; };

  /* ---------- art ---------- */
  /* an oblique metal block, front face w x h centred on the origin, top and right faces offset (dx, dy) */
  function metalBlock(parent, w, h, dx, dy) {
    const g = G(parent), x0 = -w / 2, x1 = w / 2, y0 = -h / 2, y1 = h / 2;
    E('path', { d: `M${x0},${y0} L${x0 + dx},${y0 + dy} L${x1 + dx},${y0 + dy} L${x1},${y0} Z`, fill: '#EEF2F5', stroke: '#9DAAB6', 'stroke-width': 2, 'stroke-linejoin': 'round' }, g);
    E('path', { d: `M${x1},${y0} L${x1 + dx},${y0 + dy} L${x1 + dx},${y1 + dy} L${x1},${y1} Z`, fill: '#8C99A6', stroke: '#9DAAB6', 'stroke-width': 2, 'stroke-linejoin': 'round' }, g);
    E('rect', { x: x0, y: y0, width: w, height: h, fill: linGrad('#F4F7FA', '#A9B5C0', true), stroke: '#9DAAB6', 'stroke-width': 2 }, g);
    E('path', { d: `M${x0 + 34},${y1} L${x0 + 84},${y0} L${x0 + 112},${y0} L${x0 + 62},${y1} Z M${x0 + 128},${y1} L${x0 + 160},${y0} L${x0 + 172},${y0} L${x0 + 140},${y1} Z`, fill: '#FFFFFF', opacity: 0.5 }, g);
    return g;
  }
  /* a heap of powder sitting on y = 0 */
  function powderHeap(parent, w, h, seed, fill, dark) {
    const g = G(parent), q = rng(seed), pts = [[-w / 2, 0]];
    for (let i = 1; i < 12; i++) { const u = i / 12; pts.push([(u - 0.5) * w, -Math.pow(Math.sin(u * Math.PI), 0.75) * h * (0.86 + q() * 0.22)]); }
    pts.push([w / 2, 0]);
    E('path', { d: openPath(pts) + ' Z', fill: ball(fill, dark), stroke: dark, 'stroke-width': 2, 'stroke-linejoin': 'round' }, g);
    let d = '';
    for (let i = 0; i < 9; i++) { const x = (q() - 0.5) * w * 1.1, r = 2.5 + q() * 3.5; d += `M${(x - r).toFixed(1)},-1 a${r.toFixed(1)},${r.toFixed(1)} 0 1,0 ${(2 * r).toFixed(1)},0 a${r.toFixed(1)},${r.toFixed(1)} 0 1,0 ${(-2 * r).toFixed(1)},0 `; }
    E('path', { d, fill: fill, stroke: dark, 'stroke-width': 1.5 }, g);
    return g;
  }
  /* crucible tongs: origin at the jaws; the arms run up and to the right */
  function tongs(parent) {
    const g = G(parent);
    ['M2,-5 L112,-44 L330,-106', 'M2,5 L112,-40 L330,-150'].forEach(d => {
      E('path', { d, fill: 'none', stroke: '#4E5A64', 'stroke-width': 12, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
      E('path', { d, fill: 'none', stroke: '#B7C2CC', 'stroke-width': 6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    });
    E('path', { d: 'M2,-5 Q-8,-15 -17,-7 M2,5 Q-8,15 -17,7', fill: 'none', stroke: '#B7C2CC', 'stroke-width': 5, 'stroke-linecap': 'round' }, g);
    E('circle', { cx: 112, cy: -42, r: 8, fill: '#8C99A6', stroke: '#4E5A64', 'stroke-width': 2.5 }, g);
    return g;
  }
  function eyeIcon(parent) {
    const g = G(parent);
    E('path', { d: 'M-60,0 Q0,-46 60,0 Q0,46 -60,0 Z', fill: '#F4F7FA', stroke: '#C9D6DE', 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
    E('circle', { r: 21, fill: ball('#4C9BE8', '#1E5FA8') }, g);
    E('circle', { r: 9, fill: '#0A1B27' }, g);
    E('circle', { cx: -7, cy: -7, r: 4.5, fill: '#FFFFFF', opacity: 0.9 }, g);
    return g;
  }
  function mgAtom(parent, r) {
    const g = G(parent);
    E('circle', { r, fill: ball('#DCE2E8', '#7D8A96'), stroke: '#6E7B87', 'stroke-width': 2 }, g);
    T(g, 0, r * 0.34, 'Mg', { size: r * 0.84, weight: 700, fill: DARK, anchor: 'middle' });
    return g;
  }
  function stopwatch(parent, r) {
    const g = G(parent);
    E('rect', { x: -7, y: -r - 15, width: 14, height: 12, rx: 3, fill: C.muted }, g);
    E('circle', { r, fill: C.card, stroke: C.muted, 'stroke-width': 5 }, g);
    let d = '';
    for (let k = 0; k < 12; k++) { const a = k / 12 * TAU; d += `M${(Math.cos(a) * r * 0.7).toFixed(1)},${(Math.sin(a) * r * 0.7).toFixed(1)} L${(Math.cos(a) * r * 0.86).toFixed(1)},${(Math.sin(a) * r * 0.86).toFixed(1)} `; }
    E('path', { d, stroke: C.faint, 'stroke-width': 2.5, 'stroke-linecap': 'round' }, g);
    g.hand = E('line', { x1: 0, y1: 0, x2: 0, y2: -r * 0.72, stroke: C.energy, 'stroke-width': 4, 'stroke-linecap': 'round' }, g);
    E('circle', { r: 4.5, fill: C.energy }, g);
    g.set = turns => g.hand.setAttribute('transform', `rotate(${(turns * 360).toFixed(1)})`);
    return g;
  }
  /* a spatula: origin at the tip of the blade, the handle runs off to +x */
  function spatula(parent) {
    const g = G(parent);
    E('rect', { x: 52, y: -5, width: 300, height: 10, rx: 5, fill: linGrad('#D5DEE6', '#8C99A6', true), stroke: '#6E7B87', 'stroke-width': 1.5 }, g);
    E('path', { d: 'M-4,-10 Q-12,0 -4,10 L60,7 L60,-7 Z', fill: linGrad('#E9EEF2', '#9AA6B1', true), stroke: '#6E7B87', 'stroke-width': 1.5, 'stroke-linejoin': 'round' }, g);
    return g;
  }
  /* a nail lying along +x: head at the origin, point at x = len */
  function nail(parent, len, th, o) {
    o = o || {};
    const g = G(parent), hw = th / 2;
    const shank = `M0,${-hw} L${len - th * 2},${-hw} L${len},0 L${len - th * 2},${hw} L0,${hw} Z`;
    if (o.coat) E('path', { d: shank, fill: 'none', stroke: o.coat, 'stroke-width': 12, 'stroke-linejoin': 'round' }, g);
    E('path', { d: shank, fill: linGrad('#AEB8C2', SW.Fe, true), stroke: '#4E5862', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, g);
    if (o.coat) E('path', { d: shank, fill: o.coat, opacity: 0.72 }, g);
    E('rect', { x: -th * 0.62, y: -th * 1.3, width: th * 0.7, height: th * 2.6, rx: 4, fill: linGrad('#AEB8C2', SW.Fe, true), stroke: o.coat || '#4E5862', 'stroke-width': o.coat ? 5 : 2.5 }, g);
    E('path', { d: `M6,${-hw + 4} L${len - th * 2.2},${-hw + 4}`, stroke: '#FFFFFF', 'stroke-width': 3, opacity: 0.4, 'stroke-linecap': 'round' }, g);
    g.shank = shank;
    return g;
  }
  function dropShape(parent, s, fill, stroke) {
    const g = G(parent);
    E('path', { d: `M0,${-s * 1.5} C${s * 0.8},${-s * 0.4} ${s},${s * 0.2} ${s},${s * 0.55} A${s},${s} 0 0 1 ${-s},${s * 0.55} C${-s},${s * 0.2} ${-s * 0.8},${-s * 0.4} 0,${-s * 1.5} Z`, fill, stroke: stroke || 'none', 'stroke-width': 2 }, g);
    E('path', { d: `M${-s * 0.45},${s * 0.2} Q${-s * 0.5},${-s * 0.25} ${-s * 0.2},${-s * 0.6}`, fill: 'none', stroke: '#FFFFFF', 'stroke-width': Math.max(2, s * 0.16), 'stroke-linecap': 'round', opacity: 0.55 }, g);
    return g;
  }
  function paintTin(parent) {
    const g = G(parent);
    E('path', { d: 'M-44,-34 Q-30,-84 0,-86 Q30,-84 44,-34', fill: 'none', stroke: '#9AA6B1', 'stroke-width': 4 }, g);
    E('path', { d: 'M-46,-34 L-46,36 Q0,52 46,36 L46,-34 Z', fill: linGrad('#D5DEE6', '#7D8C99'), stroke: '#E4EBF0', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, g);
    E('rect', { x: -36, y: -12, width: 72, height: 30, rx: 4, fill: '#4C9BE8' }, g);
    E('ellipse', { cx: 0, cy: -34, rx: 46, ry: 12, fill: '#3F8FE8', stroke: '#E4EBF0', 'stroke-width': 2.5 }, g);
    E('path', { d: 'M-46,-32 L-46,-4 Q-41,6 -36,-4 L-36,-27 Z', fill: '#3F8FE8' }, g);
    return g;
  }
  function goldRing(parent) {
    const g = G(parent);
    E('ellipse', { rx: 140, ry: 62, fill: 'none', stroke: '#8A5E0C', 'stroke-width': 38 }, g);
    E('ellipse', { rx: 140, ry: 62, fill: 'none', stroke: linGrad('#FFEDB0', '#C98F16', true), 'stroke-width': 30 }, g);
    E('ellipse', { rx: 140, ry: 62, fill: 'none', stroke: '#FFF6D8', 'stroke-width': 3, opacity: 0.5 }, g);
    E('path', { d: 'M-132,-16 Q-104,-58 -22,-64', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 7, 'stroke-linecap': 'round', opacity: 0.8 }, g);
    E('path', { d: 'M46,58 Q104,48 130,24', fill: 'none', stroke: '#FFF3C4', 'stroke-width': 5, 'stroke-linecap': 'round', opacity: 0.6 }, g);
    return g;
  }
  /* a four-point glint; g.set(p) */
  function glint(parent, r) {
    const g = G(parent);
    E('circle', { r: r * 1.6, fill: glow('#FFF7D6') }, g);
    const k = r * 0.2;
    E('path', { d: `M0,${-r} L${k},${-k} L${r},0 L${k},${k} L0,${r} L${-k},${k} L${-r},0 L${-k},${-k} Z`, fill: '#FFFFFF' }, g);
    return g;
  }
  function flameIcon(parent, outer, inner) {
    const g = G(parent);
    E('path', { d: 'M0,-48 C26,-18 34,4 28,22 C22,40 8,48 0,48 C-8,48 -24,40 -28,22 C-32,6 -18,-8 -10,-24 C-8,-10 -2,-4 4,-2 C8,-16 4,-32 0,-48 Z', fill: outer, stroke: inner, 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
    E('path', { d: 'M0,6 C10,16 12,26 8,33 C4,41 -4,41 -8,33 C-12,26 -6,16 0,6 Z', fill: inner }, g);
    return g;
  }
  /* the mini reactivity ladder (symbols only, 34 px rungs), centred on the origin */
  const LAD = [['K', SW.K], ['Na', SW.Na], ['Ca', SW.Ca], ['Mg', SW.Mg], ['Al', SW.Al], ['Zn', SW.Zn], ['Fe', SW.Fe], ['H', null], ['Cu', SW.Cu], ['Ag', SW.Ag], ['Au', SW.Au]];
  function miniLadder(parent) {
    const g = G(parent), rungs = {}, RW = 124, RH = 34, PITCH = 40, y0 = -(LAD.length - 1) * PITCH / 2;
    LAD.forEach(([s, c], i) => {
      const y = y0 + i * PITCH, rg = G(g); tr(rg, 0, y);
      if (!c) {
        E('rect', { x: -RW / 2, y: -RH / 2, width: RW, height: RH, rx: 9, fill: 'rgba(159,216,255,0.06)', stroke: C.air, 'stroke-width': 2.5, 'stroke-dasharray': '7 6' }, rg);
        T(rg, 0, 9, '(H)', { size: 26, weight: 700, anchor: 'middle', fill: C.air });
      } else {
        E('rect', { x: -RW / 2, y: -RH / 2, width: RW, height: RH, rx: 9, fill: c, stroke: '#0A1B27', 'stroke-width': 1.5 }, rg);
        T(rg, 0, 9, s, { size: 26, weight: 700, anchor: 'middle', fill: s === 'Fe' ? '#F4F7FA' : DARK });
      }
      rungs[s] = { g: rg, y };
    });
    g.rungs = rungs; g.RW = RW;
    return g;
  }

  /* ---------- cue times ---------- */
  const tEq = at('eq'), tNew = at('new'), tMg = at('mg'), tMgeq = at('mgeq'), tNa = at('na'), tFe = at('fe'), tRust = at('rust'), tGold = at('gold'), tLad = at('ladder');
  /* a beat's opacity: fades in as its line starts, out as the next one starts */
  const seg = (t, a, b) => Math.min(P(t, a - 0.2, 0.4, linear), b === null ? 1 : 1 - P(t, b - 0.45, 0.4, linear));

  /* ================= eq + new: oxygen meets a metal; metal + oxygen -> metal oxide ================= */
  const EQY = 186;
  const eqA = G(root);
  const row1 = eqRow(eqA, [
    { text: 'metal', fill: '#D5DCE3', color: DARK }, { op: '+' }, { text: 'oxygen', fill: C.oxygen }, { op: '→' }, { text: 'metal oxide', fill: BASE },
  ], 600, EQY, { size: 36 });
  const blockG = G(eqA);
  const block = metalBlock(blockG, 280, 120, 34, -26);
  const BX0 = 600, BY0 = 476, BX1 = 330, BS1 = 0.82;
  const o2lbl = T(eqA, 200, 300, 'oxygen in the air', { size: 30, weight: 700, anchor: 'middle', fill: O2TXT });
  const airG = G(eqA), ar = rng(12);
  const AIR = [[[-40, 400], [220, 340], [520, 404]], [[1240, 380], [1000, 320], [700, 402]], [[-40, 560], [190, 430], [462, 452]], [[1240, 560], [1000, 480], [772, 452]], [[-40, 660], [250, 590], [500, 520]], [[1240, 250], [960, 240], [626, 404]], [[1240, 680], [980, 610], [716, 512]]].map(([a, c, b], k) => {
    const m = molO2(airG, 16), fl = E('circle', { r: 30, fill: glow('#FFF3A0') }, airG);
    return { m, fl, a, b, c, t0: tEq + 0.15 + k * 0.42, rot: ar() * 360 };
  });
  const heap = G(eqA); powderHeap(heap, 190, 86, 5, '#F7F9FA', '#AEBAC4');
  const newArrow = arrow(eqA, 492, 476, 704, 476, { color: C.ink, width: 7 });
  const newLbl = T(eqA, 598, 446, 'a new substance', { size: 30, weight: 700, anchor: 'middle', fill: C.energy });
  const lblMetal = T(eqA, BX1, 600, 'shiny metal', { size: 30, weight: 700, anchor: 'middle' });
  const lblPowder = T(eqA, 880, 600, 'dull white powder', { size: 30, weight: 700, anchor: 'middle' });

  /* ================= mg: the magnesium flare ================= */
  const burnG = G(root);
  E('rect', { x: 150, y: 708, width: 640, height: 8, rx: 4, fill: C.line }, burnG);
  E('rect', { x: 240, y: 696, width: 200, height: 12, rx: 4, fill: '#33434F', stroke: '#4E6372', 'stroke-width': 2 }, burnG);
  const BUX = 340, BUY = 700, BUS = 1.2;
  const burner = bunsen(burnG, BUS); tr(burner, BUX, BUY);
  const tongG = G(burnG);
  tongs(tongG);
  const RP = [[506, 403], [474, 416], [442, 428], [410, 444], [378, 458], [348, 472]];
  const ribD = openPath(RP);
  const ribDk = E('path', { d: ribD, fill: 'none', stroke: '#6E7B87', 'stroke-width': 13, 'stroke-linecap': 'round', pathLength: 1 }, burnG);
  const ribLt = E('path', { d: ribD, fill: 'none', stroke: SW.Mg, 'stroke-width': 7, 'stroke-linecap': 'round', pathLength: 1 }, burnG);
  const dim = E('rect', { x: 0, y: 0, width: W, height: H, fill: '#01070C' }, burnG);
  const ash = E('path', { d: ribD, fill: 'none', stroke: '#F4F6F8', 'stroke-width': 15, 'stroke-linecap': 'round', pathLength: 1 }, burnG);
  const ashSpecks = G(burnG);
  { const q = rng(31); let d = ''; for (let k = 0; k < 16; k++) { const p = along(RP, k / 15), r = 2.5 + q() * 3; d += `M${(p[0] - r + (q() - 0.5) * 8).toFixed(1)},${(p[1] + 6 + q() * 7).toFixed(1)} a${r.toFixed(1)},${r.toFixed(1)} 0 1,0 ${(2 * r).toFixed(1)},0 a${r.toFixed(1)},${r.toFixed(1)} 0 1,0 ${(-2 * r).toFixed(1)},0 `; } E('path', { d, fill: '#E9EEF2', stroke: '#B5C1CB', 'stroke-width': 1 }, ashSpecks); }
  const flareG = G(burnG);
  const flBig = E('circle', { r: 360, fill: glow('#FFFFFF') }, flareG);
  const flRays = G(flareG);
  for (let k = 0; k < 14; k++) { const a = k / 14 * TAU, r1 = k % 2 ? 150 : 210; E('line', { x1: Math.cos(a) * 34, y1: Math.sin(a) * 34, x2: Math.cos(a) * r1, y2: Math.sin(a) * r1, stroke: '#FFFFFF', 'stroke-width': k % 2 ? 3 : 5, 'stroke-linecap': 'round', opacity: 0.55 }, flRays); }
  const flMid = E('circle', { r: 130, fill: glow('#FFFFFF', '#FFFFFF') }, flareG);
  const flCore = E('circle', { r: 20, fill: '#FFFFFF' }, flareG);
  const spit = []; { const q = rng(57); for (let k = 0; k < 12; k++) spit.push({ el: E('circle', { r: 3 + q() * 2.5, fill: '#FFFFFF' }, flareG), a: -Math.PI * 0.95 + q() * Math.PI * 1.3, v: 110 + q() * 120, ph: q() }); }
  const brightLbl = T(burnG, 1010, 452, 'bright white flame', { size: 34, weight: 700, anchor: 'middle', fill: '#FFFFFF' });
  const powderLbl = labelLine(burnG, 330, 352, 424, 428, 'white powder', { size: 30, weight: 700, line: '#E4EBF0' });
  const warnG = G(burnG);
  const eye = G(warnG); eyeIcon(eye); const eyeX = cross(warnG, 44); tr(eye, 1030, 196); tr(eyeX, 1030, 196);
  const warnT = T(warnG, 1030, 300, 'never look\nstraight at it', { size: 32, weight: 700, anchor: 'middle', fill: C.bad, lh: 40 });

  /* ================= mgeq: 2Mg + O2 -> 2MgO ================= */
  const mgeqG = G(root);
  const WY = 252;
  const row2 = eqRow(mgeqG, [
    { text: 'magnesium', fill: SW.Mg, color: DARK }, { op: '+' }, { text: 'oxygen', fill: C.oxygen }, { op: '→' }, { text: 'magnesium oxide', fill: BASE },
  ], 600, WY, { size: 32 });
  const icons2 = [G(mgeqG), G(mgeqG), G(mgeqG)];
  { const rp = [[-48, 10], [-26, -10], [-2, 7], [22, -12], [48, 4]], d = openPath(rp); E('path', { d, fill: 'none', stroke: '#6E7B87', 'stroke-width': 11, 'stroke-linecap': 'round' }, icons2[0]); E('path', { d, fill: 'none', stroke: SW.Mg, 'stroke-width': 6, 'stroke-linecap': 'round' }, icons2[0]); }
  molO2(icons2[1], 17);
  { const h = G(icons2[2]); powderHeap(h, 110, 50, 9, '#F7F9FA', '#AEBAC4'); tr(h, 0, 22); }
  [0, 2, 4].forEach((k, i) => { tr(icons2[i], row2[k].x, WY - 78); op(icons2[i], 0); });
  const SYM_Y = 356, ATY = 490;
  const symP = [['2Mg', row2[0].x], ['+', row2[1].x], ['O2', row2[2].x], ['→', row2[3].x], ['2MgO', row2[4].x]].map(([s, x]) => {
    const g = G(mgeqG); tr(g, x, SYM_Y);
    if (s === '+') T(g, 0, 16, '+', { size: 50, weight: 600, anchor: 'middle', fill: C.muted });
    else if (s === '→') arrow(g, -30, -2, 30, -2, { color: C.ink, width: 6 });
    else formula(g, 0, 16, s, { size: 54, weight: 700 });
    op(g, 0); return g;
  });
  const xMg = row2[0].x, xO = row2[2].x, xA = row2[3].x, xP = row2[4].x;
  const atomsG = G(mgeqG);
  const ghostG = G(atomsG), bondG = G(atomsG);
  const PX = 82;
  const prodBonds = [-1, 1].map(s => E('line', { x1: xP + s * PX - 28, y1: ATY, x2: xP + s * PX + 30, y2: ATY, stroke: '#9FB2C2', 'stroke-width': 8, 'stroke-linecap': 'round' }, bondG));
  const ATOMS = [
    { el: mgAtom(atomsG, 36), a: [xMg - 41, ATY], b: [xP - PX - 28, ATY], appear: 0.66, bend: -170 },
    { el: mgAtom(atomsG, 36), a: [xMg + 41, ATY], b: [xP + PX - 28, ATY], appear: 0.68, bend: -130 },
    { el: atom(atomsG, 'O', 27, { letter: true }), a: [xO - 19, ATY], b: [xP - PX + 32, ATY], appear: 0.76, bend: -210 },
    { el: atom(atomsG, 'O', 27, { letter: true }), a: [xO + 19, ATY], b: [xP + PX + 32, ATY], appear: 0.76, bend: -170 },
  ];
  ATOMS.forEach((A, k) => { A.ghost = E('circle', { cx: A.a[0], cy: A.a[1], r: k < 2 ? 35 : 26, fill: 'none', stroke: k < 2 ? '#B5C1CB' : C.oxygen, 'stroke-width': 2, 'stroke-dasharray': '5 5', opacity: 0.5 }, ghostG); A.st = 0; });
  const atArrow = arrow(atomsG, xA - 32, ATY, xA + 32, ATY, { color: C.muted, width: 6 });
  const atLblR = G(atomsG);
  T(atLblR, xMg, ATY + 84, '2 magnesium atoms', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  T(atLblR, xO, ATY + 84, '1 oxygen molecule', { size: 26, weight: 600, anchor: 'middle', fill: O2TXT });
  const atLblP = T(atomsG, xP, ATY + 84, '2 magnesium oxide', { size: 26, weight: 600, anchor: 'middle', fill: '#8FC0F5' });

  /* ================= na: sodium tarnishes in seconds; stored under oil ================= */
  const naG = G(root);
  const NB = 576;                                  // bench line
  E('rect', { x: 150, y: NB, width: 900, height: 8, rx: 4, fill: C.line }, naG);
  E('rect', { x: 170, y: NB - 16, width: 380, height: 16, rx: 5, fill: '#E9EEF2', stroke: '#AEBAC4', 'stroke-width': 2 }, naG);
  const LX = 230, LW = 130, LY = NB - 16, LH = 112, DX = 34, DY = -27;   // lump: two halves, front faces 110 x 100
  const halfL = G(naG), halfR = G(naG);
  const blockFaces = (g, x, withSide) => {
    E('path', { d: `M${x},${LY - LH} L${x + DX},${LY - LH + DY} L${x + LW + DX},${LY - LH + DY} L${x + LW},${LY - LH} Z`, fill: CRUST_T, stroke: EDGE, 'stroke-width': 1.5, 'stroke-linejoin': 'round' }, g);
    if (withSide) E('path', { d: `M${x + LW},${LY - LH} L${x + LW + DX},${LY - LH + DY} L${x + LW + DX},${LY + DY} L${x + LW},${LY} Z`, fill: CRUST_S, stroke: EDGE, 'stroke-width': 1.5, 'stroke-linejoin': 'round' }, g);
    E('rect', { x, y: LY - LH, width: LW, height: LH, fill: CRUST, stroke: EDGE, 'stroke-width': 1.5 }, g);
  };
  blockFaces(halfL, LX, false);
  const cutFace = E('path', { d: `M${LX + LW},${LY - LH} L${LX + LW + DX},${LY - LH + DY} L${LX + LW + DX},${LY + DY} L${LX + LW},${LY} Z`, fill: '#F4F8FB', stroke: EDGE, 'stroke-width': 1.5, 'stroke-linejoin': 'round' }, halfL);
  const cutShine = E('path', { d: `M${LX + LW + 5},${LY - LH + 8} L${LX + LW + DX - 5},${LY - LH + DY + 12} L${LX + LW + DX - 5},${LY - LH + DY + 52} L${LX + LW + 5},${LY - LH + 48} Z`, fill: '#FFFFFF' }, halfL);
  const film = G(halfL, { 'clip-path': clipD(`M${LX + LW},${LY - LH} L${LX + LW + DX},${LY - LH + DY} L${LX + LW + DX},${LY + DY} L${LX + LW},${LY} Z`) });
  { const q = rng(23); let d = ''; for (let k = 0; k < 30; k++) { const u = q(), v = q(), x = LX + LW + u * DX, y = LY - LH + u * DY + v * LH, r = 1.6 + q() * 1.8; d += `M${(x - r).toFixed(1)},${y.toFixed(1)} a${r.toFixed(1)},${r.toFixed(1)} 0 1,0 ${(2 * r).toFixed(1)},0 a${r.toFixed(1)},${r.toFixed(1)} 0 1,0 ${(-2 * r).toFixed(1)},0 `; } E('path', { d, fill: '#E4E9EE', opacity: 0.8 }, film); }
  const cutGlow = E('ellipse', { cx: LX + LW + DX / 2, cy: LY - LH / 2 + DY / 2, rx: 46, ry: 80, fill: glow('#FFFFFF') }, naG);
  blockFaces(halfR, LX + LW, true);
  T(halfR, LX + LW * 1.5, LY - 34, 'Na', { size: 36, weight: 700, anchor: 'middle', fill: '#E3E9EE' });
  const naLbl = T(naG, 204, 514, 'sodium', { size: 34, weight: 700, anchor: 'end', fill: SW.Na });
  const knife = G(naG);
  E('rect', { x: -2, y: -206, width: 20, height: 92, rx: 7, fill: '#3B2A20', stroke: '#6B5444', 'stroke-width': 2 }, knife);
  E('path', { d: 'M0,0 L-1,-118 L17,-118 L17,-34 Q15,-10 0,0 Z', fill: linGrad('#F2F6F9', '#A9B5C0'), stroke: '#E3E9EE', 'stroke-width': 1.5, 'stroke-linejoin': 'round' }, knife);
  const freshLbl = T(naG, LX + LW + 14, LY - LH - 64, 'shiny!', { size: 30, weight: 700, anchor: 'middle', fill: '#FFFFFF' });
  const watch = stopwatch(naG, 34); tr(watch, 150, 318);
  const watchT = T(naG, 150, 394, '0 s', { size: 30, weight: 700, anchor: 'middle' });
  const naO2 = [[560, 170], [690, 230], [430, 130]].map(([x, y], k) => ({ m: molO2(naG, 14), a: [x, y], b: [LX + LW + 14 + k * 4, LY - LH + 18 + k * 30], k }));
  const oxLbl = labelLine(naG, 432, 346, LX + LW + 18, LY - LH + 40, 'sodium oxide layer', { size: 30, weight: 700, anchor: 'start', line: '#C9D3DC' });
  const jar = G(naG); tr(jar, 870, NB);
  E('rect', { x: -110, y: -230, width: 220, height: 230, rx: 24, fill: 'rgba(200,230,250,0.10)' }, jar);
  const jarIn = G(jar);
  { const pc = G(jarIn); tr(pc, -40, -26, 1, -6); E('rect', { x: -34, y: -22, width: 68, height: 44, rx: 9, fill: ball('#C9D1D8', '#7D8A96'), stroke: EDGE, 'stroke-width': 1.5 }, pc); }
  const sunk = G(jarIn);
  E('rect', { x: -40, y: -26, width: 80, height: 52, rx: 10, fill: ball('#C9D1D8', '#7D8A96'), stroke: EDGE, 'stroke-width': 1.5 }, sunk);
  E('rect', { x: -104, y: -170, width: 208, height: 164, rx: 18, fill: '#E2A93B', opacity: 0.6 }, jar);
  E('rect', { x: -104, y: -174, width: 208, height: 6, rx: 3, fill: '#FFE6A8', opacity: 0.85 }, jar);
  const splash = E('ellipse', { cx: 0, cy: -171, rx: 30, ry: 7, fill: 'none', stroke: '#FFE6A8', 'stroke-width': 3 }, jar);
  E('path', { d: 'M-110,-238 L-110,-24 Q-110,0 -86,0 L86,0 Q110,0 110,-24 L110,-238', fill: 'none', stroke: GLASS.stroke, 'stroke-width': 4, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, jar);
  E('rect', { x: 86, y: -214, width: 8, height: 190, rx: 4, fill: GLASS.shine }, jar);
  const oilLbl = T(naG, 870, 630, 'stored under oil', { size: 34, weight: 700, anchor: 'middle', fill: '#F2C14E' });
  const oilNote = T(naG, 870, 666, 'keeps out air and water', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });

  /* ================= fe: iron filings spark in a flame ================= */
  const feG = G(root);
  E('rect', { x: 150, y: 708, width: 640, height: 8, rx: 4, fill: C.line }, feG);
  E('rect', { x: 240, y: 696, width: 200, height: 12, rx: 4, fill: '#33434F', stroke: '#4E6372', 'stroke-width': 2 }, feG);
  const burner2 = bunsen(feG, BUS); tr(burner2, BUX, BUY);
  const feGlow = E('circle', { cx: BUX, cy: 438, r: 110, fill: glow('#FF9A3D') }, feG);
  const sparkG = G(feG), sr = rng(77);
  const SPARK_O = [BUX, 436];
  const sparks = [];
  const SPC = ['#FF9A3D', '#FFB347', '#FFD27A'];
  for (let k = 0; k < 40; k++) {
    const a = -Math.PI / 2 + (sr() - 0.5) * 3.0, v = 150 + sr() * 170;
    sparks.push({ el: E('line', { stroke: SPC[k % 3], 'stroke-width': 3 + (k % 3), 'stroke-linecap': 'round' }, sparkG), a, v, life: 0.5 + sr() * 0.5, ph: sr(), star: k % 3 === 0 ? E('path', { d: 'M-11,0 L11,0 M0,-11 L0,11 M-7,-7 L7,7 M7,-7 L-7,7', stroke: '#FFE9A8', 'stroke-width': 3, 'stroke-linecap': 'round' }, sparkG) : null });
  }
  const spatG = G(feG); spatula(spatG);
  const filingsOn = G(spatG);
  { const q = rng(41); let d = ''; for (let k = 0; k < 16; k++) { const x = 6 + q() * 46, y = -8 - q() * 7, r = 1.8 + q() * 1.6; d += `M${(x - r).toFixed(1)},${y.toFixed(1)} a${r.toFixed(1)},${r.toFixed(1)} 0 1,0 ${(2 * r).toFixed(1)},0 a${r.toFixed(1)},${r.toFixed(1)} 0 1,0 ${(-2 * r).toFixed(1)},0 `; } E('path', { d, fill: '#5E6873', stroke: '#2E353C', 'stroke-width': 1 }, filingsOn); }
  const fall = []; { const q = rng(43); for (let k = 0; k < 14; k++) fall.push({ el: E('circle', { r: 2.2 + q() * 1.4, fill: '#5E6873' }, feG), dx: (q() - 0.5) * 14, ph: q() }); }
  const SPAT = [366, 396];                       // the blade tip, over the flame
  const feChip = chip(feG, 'iron reacts more slowly', { size: 30, fill: C.card2, stroke: SW.Fe, color: C.ink }); tr(feChip, 880, 236);
  const feSub = rich(feG, 880, 300, ['than magnesium'], { size: 26, anchor: 'middle', fill: C.muted });
  const feLbl = T(feG, 880, 470, 'orange sparks', { size: 38, weight: 700, anchor: 'middle', fill: '#FFB347' });
  const feNote = T(feG, 880, 512, 'burning iron filings', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });

  /* ================= rust: oxygen + water; paint, oil, zinc ================= */
  const rustG = G(root);
  const row3 = eqRow(rustG, [
    { text: 'iron', fill: SW.Fe }, { op: '+' }, { text: 'oxygen', fill: C.oxygen }, { op: '+' }, { text: 'water', fill: C.water, color: '#06283A' }, { op: '→' }, { text: 'rust', fill: RUST },
  ], 600, 176, { size: 32 });
  const NX = 360, NY = 346, NL = 470;
  const bigNail = G(rustG); tr(bigNail, NX, NY);
  const nl = nail(bigNail, NL, 28);
  const rustClip = G(bigNail, { 'clip-path': clipD(nl.shank) });
  const rq = rng(19);
  const patches = [[60, -2, 34, 16], [130, 6, 26, 14], [200, -6, 40, 18], [270, 4, 30, 15], [330, -4, 36, 17], [392, 3, 22, 12], [95, 10, 18, 10], [240, 12, 22, 9]].map(([x, y, rx, ry], k) => {
    const g = G(rustClip); tr(g, x, y);
    E('path', { d: closedPath(blobPts(rx, ry, 9, 0, 0.22, 30 + k)), fill: RUST, stroke: '#7A3018', 'stroke-width': 1.5 }, g);
    E('path', { d: closedPath(blobPts(rx * 0.5, ry * 0.45, 7, 0, 0.3, 50 + k)), fill: RUST_LT, opacity: 0.85, transform: `translate(${(rx * 0.15).toFixed(1)} ${(-ry * 0.2).toFixed(1)})` }, g);
    return { g, x, y, t0: 0.16 + rq() * 0.3 };
  });
  const drops = [[78, 10], [160, 8], [246, 11], [318, 8], [404, 9]].map(([x, s]) => { const g = G(rustG); dropShape(g, s, C.water, '#BDEBFA'); return { g, x: NX + x, y: NY - 14 - s * 0.55 }; });
  const rO2 = [[430, 248, 0], [720, 256, 1.4], [660, 436, 2.6], [860, 420, 3.7]].map(([x, y, ph]) => ({ m: molO2(rustG, 13), x, y, ph }));
  const clock = stopwatch(rustG, 34); tr(clock, 1010, 340);
  const clockT = T(rustG, 1010, 414, 'weeks pass', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  const rustLbl = labelLine(rustG, 446, 444, NX + 196, NY + 8, 'rust', { size: 34, weight: 700, fill: RUST_LT, line: RUST_LT });
  const protG = G(rustG);
  const PROT = [[330, 'paint'], [600, 'oil'], [870, 'a coat of zinc']].map(([x, name], k) => {
    const g = G(protG);
    card(g, -116, -82, 232, 168, { fill: C.card, stroke: C.line });
    const art = G(g); tr(art, 0, -14);
    if (k === 0) { const p = G(art); paintTin(p); tr(p, 0, 16, 0.72); }
    else if (k === 1) { const d = G(art); dropShape(d, 26, '#E2A93B', '#FFE6A8'); tr(d, 0, 10); }
    else { const n = G(art); nail(n, 150, 16, { coat: SW.Zn }); tr(n, -70, 8); T(art, 0, -24, 'Zn', { size: 28, weight: 700, anchor: 'middle', fill: SW.Zn }); }
    T(g, 0, 66, name, { size: 28, weight: 700, anchor: 'middle' });
    return { g, x };
  });
  const protHdr = T(rustG, 600, 500, 'protect it with:', { size: 28, weight: 600, anchor: 'middle', fill: C.muted });

  /* ================= gold: no reaction at all ================= */
  const goldG = G(root);
  const RX = 470, RY = 420;
  const ring_ = G(goldG); goldRing(ring_); tr(ring_, RX, RY);
  const goldLbl = T(goldG, RX, 300, 'gold', { size: 40, weight: 700, anchor: 'middle', fill: SW.Au });
  const bounce = [[[1000, 780], [RX + 112, RY + 44], [900, 800]], [[-40, 230], [RX - 120, RY - 36], [-40, 600]], [[760, 120], [RX + 60, RY - 62], [1000, -40]], [[-40, 700], [RX - 70, RY + 58], [300, 780]]].map((pts, k) => ({ m: molO2(goldG, 15), pts, t0: k * 0.13 + 0.14, ping: E('circle', { r: 26, fill: glow('#FFF7D6') }, goldG) }));
  const gl1 = glint(goldG, 22), gl2 = glint(goldG, 14);
  const goldChip = chip(goldG, 'no reaction: stays shiny', { size: 30, fill: '#3A2E0C', stroke: SW.Au, color: '#FFE38A' }); tr(goldChip, RX, 574);

  /* ================= ladder: the higher, the fiercer ================= */
  const ladG = G(root);
  const ladTitle = T(ladG, 0, -248, 'reactivity series', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  const lad = miniLadder(ladG);
  const auGlow = E('ellipse', { cx: 0, cy: lad.rungs.Au.y, rx: 110, ry: 40, fill: glow(SW.Au) }, ladG);
  ladG.insertBefore(auGlow, lad);
  const LADX0 = 1000, LADX1 = 520, LADY = 430;
  const fierce = G(root);
  const fArrow = arrow(fierce, LADX1 - 100, LADY + 206, LADX1 - 100, LADY - 196, { color: C.heat, width: 7 });
  const fTxt = T(fierce, LADX1 - 124, LADY - 30, 'more\nfiercely', { size: 30, weight: 700, anchor: 'end', fill: C.heat, lh: 36 });
  const NOTE_X = LADX1 + lad.RW / 2 + 70;
  const ANN = [
    { s: 'Mg', icon: g => { E('circle', { r: 46, fill: glow('#FFFFFF') }, g); tr(flameIcon(g, '#FFFFFF', '#FFE7A0'), 0, 0, 0.62); }, text: 'bright white flame', fill: '#FFFFFF' },
    { s: 'Fe', icon: g => { tr(flameIcon(g, '#FF8A3D', '#FFD27A'), 0, 4, 0.36); E('path', { d: 'M12,-14 L22,-24 M-12,-12 L-22,-20 M16,2 L28,0', stroke: '#FFB347', 'stroke-width': 3, 'stroke-linecap': 'round' }, g); }, text: 'orange sparks', fill: '#FFB347' },
    { s: 'Au', icon: g => { cross(g, 10, C.faint); }, text: 'no reaction', fill: C.muted },
  ].map(a => {
    const g = G(root); const y = LADY + lad.rungs[a.s].y;
    const ic = G(g); tr(ic, NOTE_X - 34, y); a.icon(ic);
    T(g, NOTE_X, y + 10, a.text, { size: 28, weight: 700, fill: a.fill });
    return { g, y };
  });

  return t => {
    /* ---------- eq + new ---------- */
    const aE = seg(t, tEq, tMg);
    op(eqA, aE);
    if (aE > 0) {
      showPart(row1[0], t, mid('eq', 0.5), mid('new', 0.74));
      showPart(row1[1], t, mid('eq', 0.6));
      showPart(row1[2], t, mid('eq', 0.63));
      showPart(row1[3], t, mid('eq', 0.74));
      showPart(row1[4], t, mid('eq', 0.8), mid('new', 0.06));
      const mv = P(t, tNew - 0.1, 0.9);
      tr(blockG, lerp(BX0, BX1, mv), BY0, lerp(1, BS1, mv));
      op(o2lbl, win(t, mid('eq', 0.08), tNew, 0.4));
      AIR.forEach(o => {
        const u = (t - o.t0) / 2.2;
        if (u <= 0 || u >= 1) op(o.m, 0);
        else { const p = bez(o.a, o.c, o.b, ease(u)); tr(o.m, p[0], p[1], 1, o.rot + u * 200 * AMP); op(o.m, Math.min(1, u * 6)); }
        const f = (t - o.t0 - 2.2) / 0.6;
        if (f <= 0 || f >= 1) op(o.fl, 0);
        else { tr(o.fl, o.b[0], o.b[1], 0.6 + 0.8 * f); op(o.fl, Math.sin(f * Math.PI)); }
      });
      const hp = P(t, mid('new', 0.06), 0.6, pop); popAt(heap, 880, 526, hp, 0.4);
      newArrow.set(P(t, mid('new', 0.1), 0.6)); op(newArrow, P(t, mid('new', 0.1), 0.2, linear));
      op(newLbl, P(t, mid('new', 0.22), 0.4, linear));
      op(lblPowder, P(t, mid('new', 0.46), 0.4, linear));
      op(lblMetal, P(t, mid('new', 0.72), 0.4, linear));
    }

    /* ---------- mg: the flare ---------- */
    const aB = seg(t, tMg, tMgeq);
    op(burnG, aB);
    if (aB > 0) {
      burner.upd(t);
      const tin = P(t, tMg - 0.1, 0.9, easeOut);
      const IGN = mid('mg', 0.17), BURN = 3.0;
      tr(tongG, RP[0][0] + (1 - tin) * 260, RP[0][1] - (1 - tin) * 90, 1.15, -2);
      const ribIn = (1 - tin);
      const b = P(t, IGN, BURN, linear);
      [ribDk, ribLt].forEach(p => { p.setAttribute('transform', `translate(${(ribIn * 260).toFixed(1)} ${(-ribIn * 90).toFixed(1)})`); p.setAttribute('stroke-dasharray', `${(1 - b).toFixed(4)} 3`); op(p, b < 0.997 ? 1 : 0); });
      ash.setAttribute('stroke-dasharray', `${b.toFixed(4)} 3`); ash.setAttribute('stroke-dashoffset', (-(1 - b)).toFixed(4)); op(ash, b > 0.004 ? 1 : 0);
      op(ashSpecks, P(t, IGN + BURN - 0.4, 0.8, linear));
      const fl = Math.min(P(t, IGN, 0.3, easeOut), 1 - P(t, IGN + BURN - 0.25, 0.7, linear));
      const flick = 1 + (0.07 * Math.sin(t * 31) + 0.05 * Math.sin(t * 53 + 1)) * AMP;
      const bp = along(RP, 1 - b);
      op(flareG, fl);
      if (fl > 0) {
        tr(flBig, bp[0], bp[1], flick); tr(flMid, bp[0], bp[1], 1 + 0.12 * Math.sin(t * 23) * AMP); tr(flCore, bp[0], bp[1]);
        tr(flRays, bp[0], bp[1], 0.85 + 0.2 * wave(t, 0.23) * AMP, (t * 14) % 360);
        spit.forEach(s => { const u = ((t - IGN) / 0.5 + s.ph) % 1, d = s.v * u * 0.5; attr(s.el, 'cx', bp[0] + Math.cos(s.a) * d); attr(s.el, 'cy', bp[1] + Math.sin(s.a) * d + 60 * u * u); op(s.el, (1 - u) * Math.min(1, u * 8)); });
      }
      op(dim, 0.72 * fl);
      op(brightLbl, win(t, IGN + 0.35, IGN + BURN + 0.3, 0.35));
      powderLbl.set(P(t, mid('mg', 0.62), 0.5, linear));
      const ep = P(t, mid('mg', 0.74), 0.6, pop);
      popAt(eye, 1030, 196, ep, 0.5);
      const xp = P(t, mid('mg', 0.74) + 0.35, 0.4, pop); popAt(eyeX, 1030, 196, xp, 0.3);
      op(warnT, P(t, mid('mg', 0.78), 0.5, linear));
    }

    /* ---------- mgeq ---------- */
    const aQ = Math.min(P(t, tMgeq - 0.2, 0.4, linear), 1 - P(t, tNa - 0.25, 0.35, linear));
    op(mgeqG, aQ);
    if (aQ > 0) {
      showPart(row2[0], t, mid('mgeq', 0.0) - 0.1);
      showPart(row2[1], t, mid('mgeq', 0.12));
      showPart(row2[2], t, mid('mgeq', 0.16));
      showPart(row2[3], t, mid('mgeq', 0.26));
      showPart(row2[4], t, mid('mgeq', 0.31));
      [0.01, 0.18, 0.33].forEach((f, i) => { const p = P(t, mid('mgeq', f), 0.5, pop); op(icons2[i], clamp(p * 2)); tr(icons2[i], row2[[0, 2, 4][i]].x, WY - 78 + (1 - clamp(p)) * 14, Math.max(0.01, 0.7 + 0.3 * p)); });
      [0.62, 0.71, 0.74, 0.82, 0.86].forEach((f, i) => { const p = P(t, mid('mgeq', f), 0.4, linear); op(symP[i], p); tr(symP[i], [xMg, row2[1].x, xO, xA, xP][i], SYM_Y + (1 - p) * 14); });
      const FLY = mid('mgeq', 0.84), FD_ = 1.0;
      ATOMS.forEach((A, k) => {
        const ap = P(t, mid('mgeq', A.appear), 0.45, pop);
        const u = clamp((t - FLY - k * 0.06) / FD_), p = ease(u);
        let x = A.a[0], y = A.a[1];
        if (u > 0) { const c = [(A.a[0] + A.b[0]) / 2, Math.min(A.a[1], A.b[1]) + A.bend]; [x, y] = bez(A.a, c, A.b, p); }
        const jig = u <= 0 || u >= 1 ? Math.sin(t * 2.3 + k * 1.9) * 1.6 * AMP : 0;
        tr(A.el, x + jig, y, Math.max(0.01, ap));
        op(A.el, clamp(ap * 2));
        op(A.ghost, P(t, FLY + 0.2, 0.5, linear) * 0.9);
      });
      prodBonds.forEach(l => op(l, P(t, FLY + FD_ - 0.1, 0.3, linear)));
      atArrow.set(P(t, mid('mgeq', 0.8), 0.5)); op(atArrow, P(t, mid('mgeq', 0.8), 0.2, linear));
      op(atLblR, P(t, mid('mgeq', 0.7), 0.4, linear) * (1 - P(t, FLY, 0.4, linear)));
      op(atLblP, P(t, FLY + FD_ - 0.2, 0.4, linear));
    }

    /* ---------- na ---------- */
    const aN = seg(t, tNa, tFe);
    op(naG, aN);
    if (aN > 0) {
      const tCut = mid('na', 0.2);
      const down = P(t, tCut, 0.6, easeIn), up = P(t, tCut + 0.75, 0.5);
      knife.setAttribute('transform', `translate(${LX + LW + 2} ${lerp(lerp(LY - LH - 92, LY, down), LY - LH - 160, up).toFixed(1)})`);
      op(knife, P(t, tNa - 0.1, 0.3, linear) * (1 - up));
      const split = P(t, tCut + 0.6, 0.5, easeOut);
      const fly = P(t, mid('na', 0.84), 1.0, linear), FAIR = 0.6;
      // the right half: slides away from the cut, then is lifted over into the oil
      const XC = LX + LW * 1.5, YC = LY - LH / 2;
      if (fly <= 0) { tr(halfR, 60 * split, 0); op(halfR, 1); }
      else {
        const u = clamp(fly / FAIR), q = bez([XC + 60, YC], [690, 170], [870, NB - 176], u * u * 0.4 + u * 0.6);
        halfR.setAttribute('transform', `translate(${q[0].toFixed(1)} ${q[1].toFixed(1)}) rotate(${(u * 120).toFixed(1)}) scale(${(1 - 0.3 * u).toFixed(3)}) translate(${-XC} ${-YC})`);
        op(halfR, u < 1 ? 1 : 0);
      }
      const fresh = split, dull = P(t, mid('na', 0.36), mid('na', 0.56) - mid('na', 0.36), linear);
      const mixc = (a, b2, p) => { const A = [1, 3, 5].map(i => parseInt(a.slice(i, i + 2), 16)), B = [1, 3, 5].map(i => parseInt(b2.slice(i, i + 2), 16)); return '#' + A.map((v, i) => Math.round(lerp(v, B[i], clamp(p))).toString(16).padStart(2, '0')).join(''); };
      cutFace.setAttribute('fill', mixc('#F4F8FB', '#AEB7C0', dull));
      op(cutFace, fresh > 0.02 ? 1 : 0); op(cutShine, fresh * 0.9 * (1 - dull)); op(film, dull);
      op(cutGlow, fresh * 0.75 * (1 - dull));
      op(freshLbl, win(t, tCut + 1.25, mid('na', 0.5), 0.3));
      op(naLbl, win(t, tNa, mid('na', 0.8), 0.4));
      const wOn = win(t, mid('na', 0.33), mid('na', 0.82), 0.3);
      op(watch, wOn); op(watchT, wOn);
      const secs = 5 * P(t, mid('na', 0.36), mid('na', 0.56) - mid('na', 0.36), linear);
      watch.set(secs / 10); setText(watchT, Math.round(secs) + ' s');
      naO2.forEach(o => {
        const u = (t - mid('na', 0.3) - o.k * 0.28) / 1.3;
        if (u <= 0 || u >= 1) op(o.m, 0);
        else { const p = ease(u); tr(o.m, lerp(o.a[0], o.b[0], p), lerp(o.a[1], o.b[1], p) - Math.sin(p * Math.PI) * 40, 1, u * 220); op(o.m, Math.min(1, u * 6, (1 - u) * 7)); }
      });
      oxLbl.set(win(t, mid('na', 0.5), mid('na', 0.84), 0.35));
      const jp = P(t, mid('na', 0.72), 0.6, easeOut);
      op(jar, jp); tr(jar, 870, NB + (1 - jp) * 30);
      op(sunk, fly >= FAIR ? 1 : 0);
      tr(sunk, 22, lerp(-150, -30, P(fly, FAIR, 1 - FAIR, easeOut)), 0.7 + 0.3 * P(fly, FAIR, 0.2, linear), 8);
      const sp = P(fly, FAIR - 0.02, 0.3, linear); op(splash, sp > 0 && sp < 1 ? 1 - sp : 0); tr(splash, 0, 0, 0.6 + 1.6 * sp);
      op(oilLbl, P(t, mid('na', 0.9), 0.4, linear));
      op(oilNote, P(t, mid('na', 0.96), 0.4, linear));
    }

    /* ---------- fe ---------- */
    const aF = seg(t, tFe, tRust);
    op(feG, aF);
    if (aF > 0) {
      burner2.upd(t);
      const sin = P(t, tFe - 0.2, 0.8, easeOut);
      const tip = mid('fe', 0.42), tilt = P(t, tip, 0.4);
      const shake = tilt > 0.5 ? Math.sin(t * 40) * 2.2 * AMP : 0;
      spatG.setAttribute('transform', `translate(${(SPAT[0] + (1 - sin) * 320).toFixed(1)} ${(SPAT[1] + shake).toFixed(1)}) rotate(${(-6 - 16 * tilt).toFixed(2)})`);
      const pour = P(t, tip + 0.25, 0.3, linear);
      op(filingsOn, 1 - 0.6 * P(t, tip + 0.2, 2.6, linear));
      fall.forEach(f => {
        const u = ((t - tip) / 0.55 + f.ph) % 1;
        op(f.el, pour * Math.min(1, u * 8, (1 - u) * 4));
        attr(f.el, 'cx', SPAT[0] - 4 + f.dx); attr(f.el, 'cy', SPAT[1] + 4 + u * u * 46);
      });
      const rate = P(t, tip + 0.4, 0.4, linear);
      sparks.forEach(s => {
        const L = s.life, tau = ((t - tip) / L + s.ph) % 1, life = tau * L;
        const vx = Math.cos(s.a) * s.v, vy = Math.sin(s.a) * s.v;
        const x = SPARK_O[0] + vx * life, y = SPARK_O[1] + vy * life + 260 * life * life;
        const tx = x - vx * 0.07, ty = y - (vy + 520 * life) * 0.07;
        attr(s.el, 'x1', tx); attr(s.el, 'y1', ty); attr(s.el, 'x2', x); attr(s.el, 'y2', y);
        const a = rate * Math.min(1, tau * 10) * (1 - tau);
        op(s.el, a);
        if (s.star) { const sb = clamp((tau - 0.6) / 0.32); op(s.star, rate * (sb > 0 && sb < 1 ? Math.sin(sb * Math.PI) : 0)); tr(s.star, x, y, 0.5 + sb); }
      });
      op(feGlow, rate * (0.55 + 0.3 * wave(t, 0.37) * AMP));
      op(feChip, P(t, mid('fe', 0.04), 0.4, linear)); tr(feChip, 880, 236 + (1 - P(t, mid('fe', 0.04), 0.5, easeOut)) * 12);
      op(feSub, P(t, mid('fe', 0.16), 0.4, linear));
      op(feLbl, P(t, mid('fe', 0.7), 0.4, linear));
      op(feNote, P(t, mid('fe', 0.8), 0.4, linear));
    }

    /* ---------- rust ---------- */
    const aR = seg(t, tRust, tGold);
    op(rustG, aR);
    if (aR > 0) {
      showPart(row3[0], t, mid('rust', 0.1));
      showPart(row3[1], t, mid('rust', 0.17)); showPart(row3[2], t, mid('rust', 0.2));
      showPart(row3[3], t, mid('rust', 0.26)); showPart(row3[4], t, mid('rust', 0.29));
      showPart(row3[5], t, mid('rust', 0.36)); showPart(row3[6], t, mid('rust', 0.4));
      const nIn = P(t, tRust - 0.1, 0.6, easeOut);
      op(bigNail, nIn);
      drops.forEach((d, k) => { const p = P(t, mid('rust', 0.17 + k * 0.03), 0.5, pop); popAt(d.g, d.x, d.y, p, 0.3); });
      rO2.forEach(o => { tr(o.m, o.x + Math.sin(t * 0.8 + o.ph) * 14 * AMP, o.y + Math.cos(t * 0.6 + o.ph) * 8 * AMP, 1, (t * 30 + o.ph * 60) % 360 * AMP); op(o.m, win(t, mid('rust', 0.12), mid('rust', 0.6), 0.5)); });
      const grow = (t - mid('rust', 0.1)) / (mid('rust', 0.52) - mid('rust', 0.1));
      patches.forEach(p => { const k = clamp((grow - p.t0) / 0.45); tr(p.g, p.x, p.y, Math.max(0.01, easeOut(k))); op(p.g, clamp(k * 3)); });
      const ck = win(t, mid('rust', 0.08), mid('rust', 0.6), 0.35);
      op(clock, ck); op(clockT, ck); clock.set(2.5 * P(t, mid('rust', 0.1), mid('rust', 0.52) - mid('rust', 0.1), linear));
      rustLbl.set(P(t, mid('rust', 0.44), 0.4, linear));
      op(protHdr, P(t, mid('rust', 0.56), 0.4, linear));
      PROT.forEach((o, k) => { const p = P(t, mid('rust', [0.6, 0.72, 0.82][k]), 0.55, pop); popAt(o.g, o.x, 610, p, 0.6); });
    }

    /* ---------- gold + ladder ---------- */
    const aG = seg(t, tGold, tLad + 0.5);
    op(goldG, aG);
    if (aG > 0) {
      const rp = P(t, tGold - 0.1, 0.7, pop);
      tr(ring_, RX, RY + Math.sin(t * 1.3) * 4 * AMP, Math.max(0.01, 0.7 + 0.3 * rp), -4 + Math.sin(t * 0.9) * 2 * AMP);
      op(ring_, clamp(rp * 2));
      op(goldLbl, P(t, mid('gold', 0.04), 0.4, linear));
      bounce.forEach(o => {
        const t0 = mid('gold', o.t0), u = (t - t0) / 1.7;
        if (u <= 0 || u >= 1) op(o.m, 0);
        else {
          const p = u < 0.5 ? along([o.pts[0], o.pts[1]], easeIn(u / 0.5) * 0.7 + (u / 0.5) * 0.3) : along([o.pts[1], o.pts[2]], easeOut((u - 0.5) / 0.5));
          tr(o.m, p[0], p[1], 1, u * 300 * AMP); op(o.m, Math.min(1, u * 6, (1 - u) * 6));
        }
        const f = (t - t0 - 0.85) / 0.45;
        if (f <= 0 || f >= 1) op(o.ping, 0); else { tr(o.ping, o.pts[1][0], o.pts[1][1], 0.5 + f); op(o.ping, Math.sin(f * Math.PI) * 0.8); }
      });
      const g1 = P(t, mid('gold', 0.62), 0.5, pop);
      op(gl1, clamp(g1 * 2) * (0.55 + 0.45 * wave(t, 1.3))); tr(gl1, RX - 92, RY - 52, Math.max(0.01, g1) * (0.8 + 0.3 * wave(t, 1.3)), (t * 30) % 360 * AMP);
      const g2 = P(t, mid('gold', 0.7), 0.5, pop);
      op(gl2, clamp(g2 * 2) * (0.5 + 0.5 * wave(t, 1.1, 0.4))); tr(gl2, RX + 118, RY + 30, Math.max(0.01, g2) * (0.8 + 0.3 * wave(t, 1.1, 0.4)));
      const cp = P(t, mid('gold', 0.74), 0.5, pop); popAt(goldChip, RX, 574, cp, 0.6);
    }
    const aL = P(t, mid('gold', 0.06), 0.5, linear);
    op(ladG, aL);
    if (aL > 0) {
      const lm = P(t, tLad - 0.1, 0.9);
      const lin = P(t, mid('gold', 0.06), 0.7, easeOut);
      tr(ladG, lerp(LADX0 + (1 - lin) * 60, LADX1, lm), LADY);
      op(auGlow, Math.max(win(t, mid('gold', 0.1), tLad + 0.3, 0.4) * (0.6 + 0.4 * wave(t, 1.2)), 0));
      tr(lad.rungs.Au.g, 0, lad.rungs.Au.y, 1 + 0.1 * Math.sin(Math.PI * P(t, mid('gold', 0.14), 0.6, linear)));
      op(ladTitle, P(t, mid('gold', 0.1), 0.4, linear));
    }
    const fa = P(t, mid('ladder', 0.16), 0.4, linear);
    op(fierce, fa);
    if (fa > 0) { fArrow.set(P(t, mid('ladder', 0.16), 1.0)); op(fTxt, P(t, mid('ladder', 0.4), 0.4, linear)); }
    ANN.forEach((a, k) => { const p = P(t, mid('ladder', [0.3, 0.48, 0.66][k]), 0.5, easeOut); op(a.g, p); tr(a.g, (1 - p) * 24, 0); });
  };
});
