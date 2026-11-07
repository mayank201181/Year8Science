/* Making a soluble salt: copper sulfate from copper oxide and sulfuric acid.
   Beats: salts are useful (a fungicide spray over a vine, a sack of fertiliser) -> the goal and the word
   equation; three step badges appear -> 1 react: warm acid over a Bunsen, black copper oxide stirred in a
   little at a time, the acid particles used up as the liquid turns blue -> excess: a black layer is left,
   the acid chip turns to "all acid used up" -> 2 filter: the beaker tips into a funnel; black residue on
   the paper, blue filtrate drips through -> 3 heat the filtrate in an evaporating basin until saturated
   -> showpiece: the Bunsen goes off and blue crystals grow -> filtered off, patted dry: pure copper
   sulfate -> a metal or a carbonate works too: add it until the fizzing stops. */
scene('salts', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.3 : 1;

  /* ---------- palette ---------- */
  const ACID = '#E8424F', BASE = '#3F8FE8', SALT = C.good, CUSO4 = '#1FA2D6', CUSO4_DEEP = '#1270B5', CLEAR = '#CFE7F5';
  const CUO = '#1E2328', CUO_LT = '#4A525B', ZN = '#A9B6C4', CUCO3 = '#3FA88A', DARK = '#1E2328', SOFT_BLUE = '#5CC0F2';

  /* ---------- local helpers ---------- */
  function rich(parent, x, y, segs, o) {
    o = o || {};
    const t = E('text', { x, y, 'font-size': o.size || 30, 'font-weight': o.weight || 600, 'font-family': o.font || FD, 'text-anchor': o.anchor || 'start', fill: o.fill || C.ink }, parent);
    segs.forEach(s => { if (typeof s === 'string') s = [s]; E('tspan', { fill: s[1], 'font-weight': s[2] }, t).textContent = s[0]; });
    return t;
  }
  const hx = c => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16));
  const mix = (a, b, p) => { const A = hx(a), B = hx(b); p = clamp(p); return '#' + A.map((v, i) => Math.round(lerp(v, B[i], p)).toString(16).padStart(2, '0')).join(''); };
  const popAt = (el, x, y, p, s0) => { s0 = s0 === undefined ? 0.6 : s0; op(el, clamp(p * 2)); tr(el, x, y, Math.max(0.01, s0 + (1 - s0) * p)); };
  const bez = (a, c, b, u) => { const v = 1 - u; return [v * v * a[0] + 2 * v * u * c[0] + u * u * b[0], v * v * a[1] + 2 * v * u * c[1] + u * u * b[1]]; };
  const rot = (p, deg) => { const a = deg * Math.PI / 180, c = Math.cos(a), s = Math.sin(a); return [p[0] * c - p[1] * s, p[0] * s + p[1] * c]; };
  let nid = 0;
  const clipD = d => { const id = 'amSalt' + (++nid), cp = E('clipPath', { id }, defs()); E('path', { d }, cp); return `url(#${id})`; };
  const dotsPath = (pts) => pts.map(([x, y, r]) => `M${(x - r).toFixed(1)},${y.toFixed(1)} a${r.toFixed(1)},${r.toFixed(1)} 0 1,0 ${(2 * r).toFixed(1)},0 a${r.toFixed(1)},${r.toFixed(1)} 0 1,0 ${(-2 * r).toFixed(1)},0 `).join('');
  /* a label centred above (or below) its target, with a leader line; g.set(p) */
  function tag(parent, x, y, tx, ty, text, o) {
    o = o || {};
    const g = G(parent), size = o.size || 28;
    const y0 = ty > y ? y + 10 : y - size * 0.95;
    E('line', { x1: x, y1: y0, x2: tx, y2: ty, stroke: o.line || C.muted, 'stroke-width': 2.5 }, g);
    E('circle', { cx: tx, cy: ty, r: 4.5, fill: o.line || C.muted }, g);
    T(g, x, y, text, { size, weight: o.weight || 700, fill: o.fill || C.ink, anchor: 'middle' });
    g.set = p => op(g, p);
    return g;
  }
  /* a row of equation chips centred on cx: items {text, fill, color} or {op: '+' | '→'} */
  function eqRow(parent, items, cx, y, o) {
    o = o || {};
    const size = o.size || 30, gap = o.gap || 12;
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

  /* ---------- art ---------- */
  /* a copper sulfate crystal: a blue rhombic prism */
  function crystal(parent, s) {
    const g = G(parent);
    E('path', { d: `M0,${-s} L${s * 0.64},${-s * 0.08} L0,${s} L${-s * 0.64},${s * 0.08} Z`, fill: linGrad('#6CCBF5', '#1664B5', true), stroke: '#CFEFFF', 'stroke-width': Math.max(1.2, s * 0.08), 'stroke-linejoin': 'round' }, g);
    E('path', { d: `M0,${-s} L${s * 0.64},${-s * 0.08} L${s * 0.08},${-s * 0.18} Z`, fill: '#BDE8FC', opacity: 0.8 }, g);
    return g;
  }
  /* a heap of black powder sitting on y = 0 */
  function powder(parent, w, h, seed, fill, dark) {
    const g = G(parent), q = rng(seed), pts = [[-w / 2, 0]];
    for (let i = 1; i < 10; i++) { const u = i / 10; pts.push([(u - 0.5) * w, -Math.pow(Math.sin(u * Math.PI), 0.8) * h * (0.85 + q() * 0.25)]); }
    pts.push([w / 2, 0]);
    E('path', { d: openPath(pts) + ' Z', fill: ball(fill, dark), stroke: dark, 'stroke-width': 1.5, 'stroke-linejoin': 'round' }, g);
    return g;
  }
  /* tripod, gauze and a Bunsen; origin: the bench under the burner. The gauze top is at y = -252. */
  function tripod(parent) {
    const g = G(parent);
    E('path', { d: 'M0,-8 L0,-226', stroke: '#1C2126', 'stroke-width': 8, 'stroke-linecap': 'round' }, g);
    g.burner = bunsen(g); tr(g.burner, 0, -18);
    E('path', { d: 'M-88,0 L-66,-226 M88,0 L66,-226', stroke: '#1C2126', 'stroke-width': 9, 'stroke-linecap': 'round' }, g);
    E('path', { d: 'M-86,-6 L-66,-220 M86,-6 L66,-220', stroke: '#56626C', 'stroke-width': 2.5, 'stroke-linecap': 'round' }, g);
    E('rect', { x: -84, y: -234, width: 168, height: 12, rx: 5, fill: '#1C2126', stroke: '#56626C', 'stroke-width': 2 }, g);
    E('path', { d: 'M-106,-236 L106,-236 L86,-252 L-86,-252 Z', fill: '#76808A', stroke: '#C9D1D8', 'stroke-width': 2, 'stroke-linejoin': 'round' }, g);
    let mesh = '';
    for (let i = 1; i < 8; i++) mesh += `M${-106 + i * 26.5},-236 L${-86 + i * 21.5},-252 `;
    for (let j = 1; j < 3; j++) { const y = -236 - j * 16 / 3, dx = 20 * j / 3; mesh += `M${-106 + dx},${y.toFixed(1)} L${106 - dx},${y.toFixed(1)} `; }
    E('path', { d: mesh, stroke: '#C9D1D8', 'stroke-width': 1.2, opacity: 0.7 }, g);
    return g;
  }
  /* a beaker that tilts to pour while its contents stay level (as in Elements' filter chapter).
     g.pose(rot, s): rot in degrees, s = liquid surface (world-vertical offset from the centre). g.lvl is
     world-aligned and clipped to the glass. */
  function pourBeaker(parent, w, h) {
    const g = G(parent), r = 14, x0 = -w / 2, x1 = w / 2, y0 = -h / 2, y1 = h / 2;
    const body = `M${x0},${y0 + 4} L${x0},${y1 - r} Q${x0},${y1} ${x0 + r},${y1} L${x1 - r},${y1} Q${x1},${y1} ${x1},${y1 - r} L${x1},${y0 + 4} Z`;
    E('path', { d: body, fill: GLASS.fill }, g);
    const lq = G(g, { 'clip-path': clipD(body) });
    g.lvl = G(lq);
    g.liq = E('rect', { x: -300, y: 0, width: 600, height: 600, fill: CLEAR, opacity: 0.3 }, g.lvl);
    g.surf = E('rect', { x: -300, y: 0, width: 600, height: 4, fill: '#FFFFFF', opacity: 0.35 }, g.lvl);
    g.sed = E('path', { fill: CUO }, g.lvl);
    g.inner = G(lq);                       // beaker-frame contents (acid particles)
    for (let i = 1; i <= 3; i++) E('line', { x1: x0 + 8, x2: x0 + 26, y1: y1 - i * h / 4.5, y2: y1 - i * h / 4.5, stroke: GLASS.stroke, 'stroke-width': 2.5, opacity: 0.7 }, g);
    E('path', { d: `M${x0 - 10},${y0} L${x0},${y0 + 6} L${x0},${y1 - r} Q${x0},${y1} ${x0 + r},${y1} L${x1 - r},${y1} Q${x1},${y1} ${x1},${y1 - r} L${x1},${y0 + 6} L${x1 + 4},${y0}`, fill: 'none', stroke: GLASS.stroke, 'stroke-width': 4, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, g);
    E('rect', { x: x1 - 22, y: y0 + 20, width: 7, height: h - 50, rx: 3.5, fill: GLASS.shine }, g);
    g.spout = [x0 - 10, y0];
    g.pose = (deg, s, sedTop, sedOn) => {
      g.lvl.setAttribute('transform', `rotate(${(-deg).toFixed(2)})`);
      attr(g.liq, 'y', s); attr(g.surf, 'y', s);
      // the black layer: a bumpy band from sedTop down to the lowest point
      const q = []; for (let i = 0; i <= 10; i++) q.push([-300 + i * 60, sedTop + Math.sin(i * 1.9) * 2.5]);
      g.sed.setAttribute('d', 'M-300,600 L' + q.map(p => p[0] + ',' + p[1].toFixed(1)).join(' L') + ' L300,600 Z');
      op(g.sed, sedOn);
    };
    return g;
  }
  /* filter funnel: glass cone with a white filter-paper cone; origin at the centre of the rim; stem tip at y = 200.
     g.inPaper is clipped to the paper cone (apex at y = 112). */
  function filterFunnel(parent) {
    const g = G(parent);
    E('path', { d: 'M-110,0 L-11,120 L11,120 L110,0 Z', fill: GLASS.fill }, g);
    E('rect', { x: -7, y: 120, width: 14, height: 76, fill: GLASS.fill }, g);
    const paperD = 'M-98,7 L0,112 L98,7 Z';
    E('path', { d: paperD, fill: '#F4F7FA', stroke: '#C9D3DC', 'stroke-width': 2, 'stroke-linejoin': 'round' }, g);
    g.inPaper = G(g, { 'clip-path': clipD(paperD) });
    E('path', { d: 'M-20,7 L0,112 M-62,7 L-34,37', stroke: '#C9D3DC', 'stroke-width': 2, fill: 'none', opacity: 0.85 }, g);
    E('path', { d: 'M-110,0 L-11,120 L-7,126 L-7,192 L7,200 L7,126 L11,120 L110,0', fill: 'none', stroke: GLASS.stroke, 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
    E('ellipse', { cx: 0, cy: 0, rx: 110, ry: 8, fill: 'none', stroke: GLASS.stroke, 'stroke-width': 3 }, g);
    E('path', { d: 'M80,9 L22,84', stroke: GLASS.shine, 'stroke-width': 5, 'stroke-linecap': 'round' }, g);
    return g;
  }
  /* evaporating basin on a tripod over a Bunsen; origin: the bench. g.set(level 0..1, colour); g.top for crystals */
  function basinRig(parent) {
    const g = G(parent);
    const tp = tripod(g); g.burner = tp.burner;
    E('path', { d: 'M-96,-302 Q-92,-251 0,-248 Q92,-251 96,-302 Z', fill: ball('#FFFFFF', '#AEBAC4'), stroke: '#E9EEF2', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, g);
    E('ellipse', { cx: 0, cy: -302, rx: 96, ry: 17, fill: '#8E9AA5', stroke: '#FFFFFF', 'stroke-width': 3 }, g);
    const liq = E('ellipse', { cx: 0, cy: -300, rx: 88, ry: 13, fill: CUSO4, opacity: 0.92 }, g);
    g.top = G(g);
    g.set = (lv, col) => { lv = clamp(lv); attr(liq, 'rx', 26 + 62 * lv); attr(liq, 'ry', 4 + 9 * lv); attr(liq, 'cy', -289 - 11 * lv); if (col) liq.setAttribute('fill', col); };
    g.set(1);
    return g;
  }
  function spatula(parent, load, loadDk) {
    const g = G(parent);
    E('rect', { x: 52, y: -5, width: 230, height: 10, rx: 5, fill: linGrad('#D5DEE6', '#8C99A6', true), stroke: '#6E7B87', 'stroke-width': 1.5 }, g);
    E('path', { d: 'M-4,-10 Q-12,0 -4,10 L60,7 L60,-7 Z', fill: linGrad('#E9EEF2', '#9AA6B1', true), stroke: '#6E7B87', 'stroke-width': 1.5, 'stroke-linejoin': 'round' }, g);
    g.load = G(g); const h = powder(g.load, 50, 14, 3, load, loadDk); tr(h, 26, -8);
    return g;
  }
  function stopwatch(parent, r) {
    const g = G(parent);
    E('rect', { x: -7, y: -r - 15, width: 14, height: 12, rx: 3, fill: C.muted }, g);
    E('circle', { r, fill: C.card, stroke: C.muted, 'stroke-width': 5 }, g);
    let d = '';
    for (let k = 0; k < 12; k++) { const a = k / 12 * TAU; d += `M${(Math.cos(a) * r * 0.7).toFixed(1)},${(Math.sin(a) * r * 0.7).toFixed(1)} L${(Math.cos(a) * r * 0.86).toFixed(1)},${(Math.sin(a) * r * 0.86).toFixed(1)} `; }
    E('path', { d, stroke: C.faint, 'stroke-width': 2.5, 'stroke-linecap': 'round' }, g);
    const hand = E('line', { x1: 0, y1: 0, x2: 0, y2: -r * 0.72, stroke: C.energy, 'stroke-width': 4, 'stroke-linecap': 'round' }, g);
    E('circle', { r: 4.5, fill: C.energy }, g);
    g.set = turns => hand.setAttribute('transform', `rotate(${(turns * 360).toFixed(1)})`);
    return g;
  }
  function glint(parent, r) {
    const g = G(parent);
    E('circle', { r: r * 1.6, fill: glow('#E6F7FF') }, g);
    const k = r * 0.2;
    E('path', { d: `M0,${-r} L${k},${-k} L${r},0 L${k},${k} L0,${r} L${-k},${k} L${-r},0 L${-k},${-k} Z`, fill: '#FFFFFF' }, g);
    return g;
  }

  /* ---------- cue times ---------- */
  const tU = at('useful'), tH = at('how'), tR = at('react'), tX = at('excess'), tF = at('filter'), tE = at('heat'), tC = at('cool'), tD = at('dry'), tO = at('other');
  const seg = (t, a, b) => Math.min(P(t, a - 0.1, 0.35, linear), b === null ? 1 : 1 - P(t, b - 0.45, 0.35, linear));

  /* ================= useful: a fungicide and a fertiliser ================= */
  const U = G(root);
  const uTitle = rich(U, 600, 168, [['Salts', SALT, 800], [' are useful', C.ink]], { size: 46, weight: 700, anchor: 'middle' });
  // a grape vine
  const vine = G(U);
  E('path', { d: 'M232,606 C224,540 286,500 266,430 C252,382 280,330 316,300', fill: 'none', stroke: '#7A5236', 'stroke-width': 11, 'stroke-linecap': 'round' }, vine);
  E('path', { d: 'M266,430 C300,420 330,410 352,388', fill: 'none', stroke: '#7A5236', 'stroke-width': 6, 'stroke-linecap': 'round' }, vine);
  [[270, 436, -158, 0.5], [312, 304, -40, 0.44], [246, 520, 168, 0.42], [348, 392, -22, 0.36]].forEach(([x, y, r, s]) => tr(leaf(vine, s, { color: '#4FBF6A' }), x, y, 1, r));
  { const pts = []; [[0, 0], [-15, 0], [15, 0], [30, 0], [-7, 24], [8, 24], [23, 24], [0, 48], [15, 48], [8, 70]].forEach(([x, y]) => pts.push([344 + x, 436 + y, 13])); E('path', { d: dotsPath(pts), fill: ball('#8E5CC2', '#4F2C7A'), stroke: '#C9A8EC', 'stroke-width': 1.5 }, vine); }
  const spray = G(U);
  E('rect', { x: -34, y: -8, width: 68, height: 128, rx: 16, fill: 'rgba(200,230,250,0.22)', stroke: '#CFE7F5', 'stroke-width': 3 }, spray);
  E('rect', { x: -29, y: 30, width: 58, height: 86, rx: 12, fill: CUSO4, opacity: 0.8 }, spray);
  E('rect', { x: -22, y: 46, width: 44, height: 34, rx: 5, fill: '#F4F7FA' }, spray);
  E('path', { d: 'M-10,72 Q0,52 10,62 Q4,74 -10,72 Z', fill: C.plant }, spray);
  E('rect', { x: -15, y: -28, width: 30, height: 22, rx: 4, fill: '#2B3A45' }, spray);
  E('path', { d: 'M-30,-64 L34,-64 L34,-30 L-22,-30 Z', fill: '#3E4E5A', stroke: '#5E7180', 'stroke-width': 2, 'stroke-linejoin': 'round' }, spray);
  E('rect', { x: -50, y: -58, width: 22, height: 12, rx: 3, fill: '#2B3A45' }, spray);
  E('path', { d: 'M-20,-30 Q-34,-12 -26,6 L-16,4 Q-22,-12 -10,-30 Z', fill: '#3E4E5A' }, spray);
  const mist = []; { const q = rng(15); for (let k = 0; k < 12; k++) mist.push({ el: E('circle', { r: 3 + q() * 3, fill: SOFT_BLUE }, U), a: Math.PI + (q() - 0.5) * 0.7, ph: q(), d: 120 + q() * 70 }); }
  const SPX = 480, SPY = 384, NOZ = [SPX - 50, SPY - 52];
  const cuChip = chip(U, 'copper sulfate', { size: 32, fill: CUSO4, color: '#FFFFFF' }); tr(cuChip, 320, 646);
  const cuNote = T(U, 320, 700, 'in fungicides', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  // a sack of fertiliser
  const sack = G(U);
  E('path', { d: 'M-84,96 Q-96,0 -78,-86 Q-60,-104 -30,-96 Q0,-110 30,-96 Q60,-104 78,-86 Q96,0 84,96 Q0,110 -84,96 Z', fill: ball('#D9B77E', '#9C7A45'), stroke: '#7A5A2E', 'stroke-width': 3, 'stroke-linejoin': 'round' }, sack);
  E('path', { d: 'M-70,-82 Q0,-60 70,-82', fill: 'none', stroke: '#7A5A2E', 'stroke-width': 3 }, sack);
  E('rect', { x: -52, y: -36, width: 104, height: 86, rx: 10, fill: '#F4F7FA', stroke: '#C9D3DC', 'stroke-width': 2 }, sack);
  tr(leaf(sack, 0.22, { color: C.plant }), -20, -4, 1, -40);
  T(sack, 0, 38, 'N', { size: 30, weight: 700, anchor: 'middle', fill: '#22844A' });
  E('path', { d: dotsPath((() => { const q = rng(8), a = []; for (let k = 0; k < 18; k++) a.push([60 + q() * 90, 104 - q() * 14, 3 + q() * 2.5]); return a; })()), fill: '#F7F9FA', stroke: '#C9D3DC', 'stroke-width': 1 }, sack);
  const SKX = 790, SKY = 486;
  const soil = G(U);
  E('path', { d: 'M900,598 Q1000,580 1100,598 L1100,612 L900,612 Z', fill: ball('#8A6040', C.soil), stroke: '#4E3524', 'stroke-width': 2 }, soil);
  const sprouts = [[940, 0.9], [1000, 1.1], [1060, 0.85]].map(([x, s]) => {
    const g = G(U), inner = G(g);
    E('path', { d: 'M0,0 C2,-22 -2,-40 0,-58', fill: 'none', stroke: C.stem, 'stroke-width': 5, 'stroke-linecap': 'round' }, inner);
    tr(leaf(inner, 0.2, { color: '#5BD27A' }), 0, -46, 1, -150);
    tr(leaf(inner, 0.2, { color: '#5BD27A' }), 0, -52, 1, -30);
    return { g, inner, x, s };
  });
  const nChip = chip(U, 'ammonium nitrate', { size: 32, fill: '#F4F7FA', color: DARK }); tr(nChip, 880, 646);
  const nNote = T(U, 880, 700, 'a fertiliser', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });

  /* ================= how: the goal, then the word equation ================= */
  const HG = G(root);
  const goal = G(HG);
  rich(goal, 600, 200, [['Goal: a pure, dry ', C.ink], ['soluble salt', SALT, 800]], { size: 40, weight: 700, anchor: 'middle' });
  const dish = G(goal); tr(dish, 600, 410);
  E('path', { d: 'M-150,-10 Q-120,40 0,44 Q120,40 150,-10 Z', fill: 'rgba(200,230,250,0.16)', stroke: GLASS.stroke, 'stroke-width': 3 }, dish);
  E('ellipse', { cx: 0, cy: -10, rx: 150, ry: 20, fill: 'rgba(200,230,250,0.10)', stroke: GLASS.stroke, 'stroke-width': 3 }, dish);
  const goalX = [[-80, -8, 20], [-38, -18, 26], [6, -6, 22], [48, -20, 28], [88, -6, 19], [-56, 10, 16], [28, 12, 17]].map(([x, y, s]) => { const c = crystal(dish, s); tr(c, x, y - s * 0.4, 1, (x % 3) * 8 - 8); return c; });
  const goalGl = glint(goal, 20); tr(goalGl, 648, 370);
  const goalName = T(goal, 600, 528, 'copper sulfate', { size: 44, weight: 700, anchor: 'middle', fill: SOFT_BLUE });
  const goalNote = T(goal, 600, 576, 'soluble: it dissolves in water', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  const EQY = 420;
  const row = eqRow(HG, [
    { text: 'copper oxide', fill: BASE }, { op: '+' }, { text: 'sulfuric acid', fill: ACID }, { op: '→' }, { text: 'copper sulfate', fill: SALT, color: '#0B2A1C' }, { op: '+' }, { text: 'water', fill: C.water, color: '#06283A' },
  ], 600, EQY, { size: 28 });
  const icons = [0, 2, 4, 6].map(k => { const g = G(HG); tr(g, row[k].x, EQY - 92); op(g, 0); return g; });
  { const h = powder(icons[0], 92, 40, 5, CUO, '#000000'); tr(h, 0, 26); }
  { const b = beaker(icons[1], 64, 70, { level: 0.6, liquid: CLEAR, opacity: 0.3, marks: false }); }
  { const b = beaker(icons[2], 64, 70, { level: 0.6, liquid: CUSO4, opacity: 0.85, marks: false }); }
  molH2O(icons[3], 18);
  const eqNotes = [[0, 'black powder'], [2, 'colourless'], [4, 'blue solution']].map(([k, s]) => { const t = T(HG, row[k].x, EQY + 62, s, { size: 24, weight: 600, anchor: 'middle', fill: C.muted }); op(t, 0); return t; });

  /* ================= the step badges (top right) ================= */
  const stepsG = G(root);
  const STEPS = [['1', 'react'], ['2', 'filter'], ['3', 'crystallise']];
  let sx = 1170;
  const pills = STEPS.map(([n, s]) => ({ n, s, w: textWidth(s, 26, FD, 700) + 72 })).reverse().map(p => { p.x = sx - p.w / 2; sx -= p.w + 30; return p; }).reverse().map((p, i) => {
    const g = G(stepsG); tr(g, p.x, 60);
    const box = E('rect', { x: -p.w / 2, y: -24, width: p.w, height: 48, rx: 24, fill: 'rgba(10,27,39,0.78)', stroke: C.line, 'stroke-width': 2.5 }, g);
    const disc = E('circle', { cx: -p.w / 2 + 25, cy: 0, r: 17, fill: C.card2 }, g);
    const num = T(g, -p.w / 2 + 25, 9, p.n, { size: 24, weight: 700, anchor: 'middle', fill: C.muted });
    const lab = T(g, -p.w / 2 + 50, 9, p.s, { size: 26, weight: 700, fill: C.muted });
    return { g, box, disc, num, lab, x: p.x };
  });
  const PW = STEPS.map(([, s2]) => textWidth(s2, 26, FD, 700) + 72);
  [0, 1].forEach(i => T(stepsG, (pills[i].x + PW[i] / 2 + pills[i + 1].x - PW[i + 1] / 2) / 2, 70, '›', { size: 32, weight: 700, anchor: 'middle', fill: C.faint }));
  const ACT = [[tR - 0.1, tF - 0.1, 0], [tF - 0.1, tE - 0.1, 1], [tE - 0.1, tO - 0.1, 2], [tO - 0.1, 1e6, 0]];

  /* ================= 1. react + excess ================= */
  const R1 = G(root);
  const FLOOR = 708, RX = 470;
  E('rect', { x: 150, y: FLOOR, width: 760, height: 8, rx: 4, fill: C.line }, R1);
  const rig1 = tripod(R1); tr(rig1, RX, FLOOR);
  const BKW = 220, BKH = 210, BKY = FLOOR - 252 - BKH / 2;      // beaker centre, sitting on the gauze
  const SURF0 = 2;                                               // liquid surface (beaker frame) when upright
  const CORNERS = [[-BKW / 2, -BKH / 2], [BKW / 2, -BKH / 2], [BKW / 2, BKH / 2], [-BKW / 2, BKH / 2]];
  const bk = pourBeaker(root, BKW, BKH);
  // acid particles: drifting red balls in the liquid (beaker frame)
  const acid = []; { const q = rng(29); for (let k = 0; k < 12; k++) acid.push({ el: E('circle', { r: 9, fill: ball(ACID, '#9E1F2B') }, bk.inner), x0: -90 + q() * 180, y0: 14 + q() * 80, vx: (q() - 0.5) * 2, vy: (q() - 0.5) * 2, ph: q() }); }
  const KILL = [0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 3];               // which addition uses up each particle
  const bounce1 = (u, a, b) => { const L = b - a, m = ((u - a) % (2 * L) + 2 * L) % (2 * L); return a + (m < L ? m : 2 * L - m); };
  // the spatula with black copper oxide, and the specks it drops
  const spat = spatula(root, CUO, '#000000');
  const SPT = [RX + 66, BKY - BKH / 2 - 12];                       // spatula tip over the beaker mouth
  const ADD = [mid('react', 0.42), mid('react', 0.58), mid('react', 0.74), mid('excess', 0.06), mid('excess', 0.2)];
  const specks = []; { const q = rng(33); ADD.forEach((t0, a) => { for (let k = 0; k < 7; k++) specks.push({ el: E('circle', { r: 3 + q() * 2.5, fill: k % 3 ? CUO : CUO_LT }, root), a, t0, dx: (q() - 0.5) * 26, sink: 0.4 + q() * 0.6, wob: q() * TAU, stay: a >= 2 && (a > 2 || k < 3) }); }); }
  const rod = E('line', { x1: 0, y1: 0, x2: 0, y2: 270, stroke: '#DDEFF8', 'stroke-width': 7, 'stroke-linecap': 'round', opacity: 0.85 }, root);
  const lblAcid = labelLine(root, 640, 404, RX + 70, BKY + 36, 'warm dilute\nsulfuric acid', { size: 28, weight: 700, anchor: 'start' });
  const lblCuO = tag(root, 590, 150, SPT[0] + 28, SPT[1] - 14, 'black copper oxide', { size: 28 });
  const acidChip = chip(root, 'acid still there', { size: 28, fill: ACID, color: '#FFFFFF' });
  const usedChip = G(root);
  { const tw = textWidth('all acid used up', 28, FD, 700), w = tw + 92; E('rect', { x: -w / 2, y: -25, width: w, height: 50, rx: 25, fill: '#163F2A', stroke: SALT, 'stroke-width': 3 }, usedChip); const tk = tick(usedChip, 11, SALT); tr(tk, -w / 2 + 32, 2); T(usedChip, -w / 2 + 56, 10, 'all acid used up', { size: 28, weight: 700, fill: SALT }); }
  const pureNote = T(root, 900, 322, 'no acid left to spoil the salt', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  const excessLbl = labelLine(root, 668, 470, RX + 60, BKY + BKH / 2 - 8, 'excess: some left over', { size: 28, weight: 700, anchor: 'start', fill: '#C9D3DC' });

  /* ================= 2. filter ================= */
  const F2 = G(root);
  const FX = 560, FY = 392;                                       // funnel rim centre
  const LIP = [FX + 58, FY - 50];                                 // where the beaker's lip pours
  const flaskG = G(F2); const fl = flask(flaskG, 1, { level: 0, liquid: CUSO4, opacity: 0.85 }); tr(flaskG, FX, FLOOR - 92);
  E('rect', { x: 330, y: FLOOR, width: 480, height: 8, rx: 4, fill: C.line }, F2);
  const funnel = filterFunnel(F2); tr(funnel, FX, FY);
  const fLiq = E('rect', { x: -110, y: 112, width: 220, height: 10, fill: CUSO4, opacity: 0.9 }, funnel.inPaper);
  const fRes = E('path', { fill: CUO }, funnel.inPaper);
  const drips = [0, 1, 2].map(() => E('path', { d: 'M0,-8 C5,-2 6,2 6,5 A6,6 0 0 1 -6,5 C-6,2 -5,-2 0,-8 Z', fill: CUSO4 }, F2));
  const stream = E('path', { fill: 'none', stroke: CUSO4, 'stroke-width': 10, 'stroke-linecap': 'round', opacity: 0.9 }, root);
  const sFlecks = [0, 1, 2, 3, 4].map(() => E('circle', { r: 3.5, fill: CUO }, root));
  const lblRes = labelLine(F2, 760, 478, FX + 18, FY + 92, 'residue', { size: 34, weight: 700, anchor: 'start' });
  const subRes = T(F2, 760, 512, 'copper oxide left on the paper', { size: 26, weight: 600, fill: C.muted });
  const lblFil = labelLine(F2, 760, 652, FX + 44, FLOOR - 22, 'filtrate', { size: 34, weight: 700, anchor: 'start', fill: '#7FD0F5' });
  const subFil = T(F2, 760, 686, 'copper sulfate solution', { size: 26, weight: 600, fill: C.muted });

  /* ================= 3. heat, cool, crystals ================= */
  const H3 = G(root);
  const EX = 470;
  E('rect', { x: 150, y: FLOOR, width: 640, height: 8, rx: 4, fill: C.line }, H3);
  const rig3 = basinRig(H3); tr(rig3, EX, FLOOR);
  const steam = heatWaves(H3, { n: 4, h: 110, spacing: 30, color: '#DDEFF8', width: 5, speed: 0.55 }); tr(steam, EX, FLOOR - 316);
  const evapLbl = G(H3);
  { const a = arrow(evapLbl, 620, 330, 620, 250, { color: '#DDEFF8', width: 5 }); evapLbl.arr = a; T(evapLbl, 644, 296, 'water evaporates', { size: 30, weight: 700, fill: '#DDEFF8' }); }
  const filLbl = labelLine(H3, 700, 470, EX + 70, FLOOR - 300, 'the filtrate', { size: 28, weight: 700, anchor: 'start', fill: '#7FD0F5' });
  const satChip = chip(H3, 'saturated', { size: 34, fill: CUSO4_DEEP, color: '#FFFFFF', stroke: '#7FD0F5' }); tr(satChip, 900, 420);
  const satNote = T(H3, 900, 478, 'holding all the salt it can', { size: 28, weight: 600, anchor: 'middle', fill: C.ink });
  // crystals in the basin (they grow when it cools)
  const bX = []; { const q = rng(61); for (let k = 0; k < 9; k++) { const a = (k / 9) * TAU + q() * 0.3, rr = k < 7 ? 0.78 : 0.3; bX.push({ g: crystal(rig3.top, 6 + q() * 4), x: Math.cos(a) * 64 * rr, y: -293 + Math.sin(a) * 8 * rr, d: q() * 0.5, r: (q() - 0.5) * 40 }); } }
  const coolLbl = G(H3);
  const th = thermometer(coolLbl, 110, C.bad); tr(th, 250, 470);
  T(coolLbl, 250, 300, 'cool slowly', { size: 32, weight: 700, anchor: 'middle', fill: '#9FD8FF' });
  const zoom = G(H3);
  const ZX = 900, ZY = 360, ZR = 128;
  E('path', { d: `M${EX + 96},${FLOOR - 300} L${ZX - ZR + 4},${ZY + 10}`, stroke: C.muted, 'stroke-width': 3, 'stroke-dasharray': '8 7' }, zoom);
  E('circle', { cx: ZX, cy: ZY, r: ZR, fill: CUSO4_DEEP, opacity: 0.75 }, zoom);
  const zIn = G(zoom, { 'clip-path': (() => { const id = 'amSaltZ', cp = E('clipPath', { id }, defs()); E('circle', { cx: ZX, cy: ZY, r: ZR - 3 }, cp); return `url(#${id})`; })() });
  const zX = [[-58, 40, 34, -14], [12, -42, 30, 20], [62, 46, 40, 8], [-34, -60, 22, -30], [74, -24, 24, 34], [-8, 74, 26, -6], [-80, -12, 20, 12], [-100, 52, 16, 26], [36, 8, 18, -16], [96, 82, 18, 18]].map(([x, y, s, r], k) => ({ g: crystal(zIn, s), x: ZX + x, y: ZY + y, r, k }));
  E('circle', { cx: ZX, cy: ZY, r: ZR, fill: 'none', stroke: '#CFEFFF', 'stroke-width': 5 }, zoom);
  const growLbl = T(zoom, ZX, ZY + ZR + 52, 'blue crystals grow', { size: 32, weight: 700, anchor: 'middle', fill: SOFT_BLUE });
  const clockC = stopwatch(H3, 30); tr(clockC, ZX + ZR - 6, ZY - ZR + 6);

  /* ================= dry: filtered off, patted dry ================= */
  const DG = G(root);
  E('rect', { x: 220, y: 612, width: 760, height: 8, rx: 4, fill: C.line }, DG);
  E('ellipse', { cx: 600, cy: 586, rx: 250, ry: 34, fill: '#F4F7FA', stroke: '#C9D3DC', 'stroke-width': 2.5 }, DG);
  const dX = [[-150, 2, 20], [-96, -6, 24], [-40, 4, 22], [16, -8, 26], [70, 2, 23], [122, -4, 20], [-120, 18, 15], [44, 18, 17], [160, 14, 15]].map(([x, y, s], k) => ({ g: crystal(DG, s), x: 600 + x, y: 586 + y - s * 0.6, k, r: (k % 3 - 1) * 12 }));
  const patG = G(DG);
  E('path', { d: 'M-150,-12 L150,-24 L160,8 L-140,20 Z', fill: '#E9EEF2', stroke: '#C9D3DC', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, patG);
  const dGl = [glint(DG, 22), glint(DG, 16)];
  const dTitle = T(DG, 600, 400, 'pure copper sulfate', { size: 52, weight: 700, anchor: 'middle', fill: SOFT_BLUE });
  const dTick = tick(DG, 18, SALT);
  const dSub = T(DG, 600, 456, 'filtered off and dried', { size: 28, weight: 600, anchor: 'middle', fill: C.muted });

  /* ================= other: a metal or a carbonate ================= */
  const OG = G(root);
  E('rect', { x: 150, y: 600, width: 900, height: 8, rx: 4, fill: C.line }, OG);
  const OBX = [380, 820], OBY = 488;
  const oBk = OBX.map(x => { const g = G(OG); tr(g, x, OBY); return beaker(g, 200, 220, { level: 0.55, liquid: CLEAR, opacity: 0.3 }); });
  const oSurf = OBY + 110 - (220 - 18) * 0.55;                    // liquid surface (stage y)
  const oFizz = OBX.map((x, i) => bubbles(OG, x - 70, oSurf + 6, 140, OBY + 100 - oSurf - 14, { n: 14, r: 6, speed: 0.75, seed: 3 + i * 5 }));
  function zinc(parent, s, seed) { const g = G(parent); E('path', { d: closedPath(blobPts(14 * s, 10 * s, 8, 0, 0.25, seed)), fill: ball('#C9D3DC', '#6E7B87'), stroke: '#5E6B76', 'stroke-width': 1.5 }, g); return g; }
  function cuco3(parent, s, seed) { const g = G(parent); E('path', { d: closedPath(blobPts(15 * s, 10 * s, 9, 0, 0.3, seed)), fill: ball('#5CC9A6', '#237A62'), stroke: '#1E6352', 'stroke-width': 1.5 }, g); return g; }
  const BOT = OBY + 100;
  const oSol = [
    [zinc(OG, 1.2, 4), 0, mid('other', 0.12), -30], [zinc(OG, 1, 6), 0, mid('other', 0.44), 24], [zinc(OG, 1.4, 9), 0, mid('other', 0.62), -2],
    [cuco3(OG, 1.2, 5), 1, mid('other', 0.24), 28], [cuco3(OG, 1, 7), 1, mid('other', 0.5), -26], [cuco3(OG, 1.4, 11), 1, mid('other', 0.66), 4],
  ].map(([g, b, t0, dx]) => ({ g, b, t0, dx }));
  const oName = [['a metal', 'e.g. zinc', ZN], ['a carbonate', 'e.g. copper carbonate', '#6FD3B2']].map(([n, e, c], i) => { const g = G(OG); T(g, OBX[i], 300, n, { size: 36, weight: 700, anchor: 'middle', fill: c }); T(g, OBX[i], 338, e, { size: 26, weight: 600, anchor: 'middle', fill: C.muted }); return g; });
  const stopChip = chip(OG, 'until the fizzing stops', { size: 32, fill: C.card2, stroke: C.energy, color: C.energy }); tr(stopChip, 600, 664);
  const leftG = G(OG);
  T(leftG, 600, 444, 'some solid\nleft over', { size: 28, weight: 700, anchor: 'middle', lh: 34 });
  [[530, 478, OBX[0] + 14, BOT - 16], [670, 478, OBX[1] - 10, BOT - 16]].forEach(([x1, y1, x2, y2]) => { E('line', { x1, y1, x2, y2, stroke: C.muted, 'stroke-width': 2.5 }, leftG); E('circle', { cx: x2, cy: y2, r: 4.5, fill: C.muted }, leftG); });

  return t => {
    /* ---------- the step badges ---------- */
    const sA = P(t, mid('how', 0.93), 0.5, linear);
    op(stepsG, sA);
    if (sA > 0) pills.forEach((p, k) => {
      let a = 0; ACT.forEach(([t0, t1, s]) => { if (s === k) a = Math.max(a, win(t, t0, t1, 0.3)); });
      const appear = P(t, mid('how', 0.93) + k * 0.15, 0.4, pop);
      tr(p.g, p.x, 60, Math.max(0.01, (0.7 + 0.3 * appear) * (1 + 0.1 * a)));
      op(p.g, clamp(appear * 2) * (0.5 + 0.5 * a));
      p.box.setAttribute('stroke', a > 0.5 ? C.energy : C.line);
      p.disc.setAttribute('fill', a > 0.5 ? C.energy : C.card2);
      p.num.setAttribute('fill', a > 0.5 ? C.bg0 : C.muted);
      p.lab.setAttribute('fill', a > 0.5 ? C.ink : C.muted);
    });

    /* ---------- useful ---------- */
    const aU = seg(t, tU, tH);
    op(U, aU);
    if (aU > 0) {
      const tp = P(t, tU - 0.1, 0.6, easeOut); op(uTitle, tp); tr(uTitle, 0, (1 - tp) * 14);
      const vp = P(t, mid('useful', 0.12), 0.6, pop); op(vine, clamp(vp * 2)); vine.setAttribute('transform', `translate(300 606) scale(${Math.max(0.01, 0.7 + 0.3 * vp).toFixed(3)}) translate(-300 -606)`);
      const sp = P(t, mid('useful', 0.2), 0.6, pop); popAt(spray, SPX, SPY, sp, 0.6);
      const mOn = P(t, mid('useful', 0.26), 0.3, linear) * (1 - P(t, mid('useful', 0.7), 0.6, linear));
      mist.forEach(m => { const u = ((t - tU) / 0.9 + m.ph) % 1; attr(m.el, 'cx', NOZ[0] + Math.cos(m.a) * m.d * u); attr(m.el, 'cy', NOZ[1] + Math.sin(m.a) * m.d * u + 30 * u * u); op(m.el, mOn * Math.min(1, u * 6) * (1 - u)); });
      popAt(cuChip, 320, 646, P(t, mid('useful', 0.3), 0.5, pop), 0.6);
      op(cuNote, P(t, mid('useful', 0.4), 0.4, linear));
      popAt(sack, SKX, SKY, P(t, mid('useful', 0.56), 0.6, pop), 0.6);
      op(soil, P(t, mid('useful', 0.6), 0.4, linear));
      sprouts.forEach((s, k) => { const g = P(t, mid('useful', 0.62 + k * 0.06), 0.8, easeOut); op(s.g, clamp(g * 3)); tr(s.g, s.x, 600); s.inner.setAttribute('transform', `scale(${(Math.max(0.01, g) * s.s).toFixed(3)}) rotate(${(Math.sin(t * 1.4 + k) * 3 * AMP).toFixed(2)})`); });
      popAt(nChip, 880, 646, P(t, mid('useful', 0.66), 0.5, pop), 0.6);
      op(nNote, P(t, mid('useful', 0.8), 0.4, linear));
    }

    /* ---------- how ---------- */
    const aH = seg(t, tH, tR);
    op(HG, aH);
    if (aH > 0) {
      const gA = win(t, tH - 0.2, mid('how', 0.47), 0.35);
      op(goal, gA);
      if (gA > 0) {
        goalX.forEach((c, k) => { const p = P(t, mid('how', 0.08) + k * 0.06, 0.5, pop); op(c, clamp(p * 2)); });
        op(dish, P(t, tH - 0.1, 0.5, linear));
        const gp = P(t, mid('how', 0.22), 0.5, pop); op(goalGl, clamp(gp * 2) * (0.6 + 0.4 * wave(t, 1.2))); tr(goalGl, 648, 370, Math.max(0.01, gp) * (0.8 + 0.3 * wave(t, 1.2)), (t * 40) % 360 * AMP);
        op(goalName, P(t, mid('how', 0.36), 0.4, linear));
        op(goalNote, P(t, mid('how', 0.3), 0.4, linear));
      }
      const RT = [0.49, 0.56, 0.59, 0.7, 0.74, 0.86, 0.89];
      row.forEach((p, i) => { const a = P(t, mid('how', RT[i]), 0.5, pop); op(p.g, clamp(a * 2)); tr(p.g, p.x, p.y, 0.7 + 0.3 * a); });
      icons.forEach((g, i) => { const a = P(t, mid('how', RT[i * 2]) + 0.05, 0.5, pop); op(g, clamp(a * 2)); tr(g, row[i * 2].x, EQY - 92 + (1 - clamp(a)) * 14, Math.max(0.01, 0.7 + 0.3 * a)); });
      eqNotes.forEach((n, i) => op(n, P(t, mid('how', RT[i * 2]) + 0.35, 0.4, linear)));
    }

    /* ---------- 1. react + excess (the beaker carries on into the filter step) ---------- */
    const aR = seg(t, tR, tF);
    op(R1, aR);
    if (aR > 0) { rig1.burner.set('blue'); rig1.burner.upd(t); }
    // beaker pose: on the gauze; lifted and tipped over the funnel; tipped further as it empties, its lip held still
    const POUR0 = tF + 0.95, POUR1 = tF + 3.1;
    const rise = P(t, tF - 0.35, 0.55), lift = P(t, tF + 0.2, 0.75), pour = P(t, POUR0, POUR1 - POUR0, linear), away = P(t, POUR1 + 0.15, 0.7, easeIn);
    const bkA = Math.min(P(t, tR - 0.1, 0.35, linear), 1 - away);
    op(bk, bkA);
    const deg = pour > 0 ? lerp(-50, -88, ease(pour)) : -50 * lift;
    const lipRel = rot(bk.spout, deg), pcen = [LIP[0] - lipRel[0], LIP[1] - lipRel[1]];
    const bx = lerp(RX, pcen[0], lift) + away * 260, by = lerp(lerp(BKY, 226, rise), pcen[1], lift) + away * 30;
    // the black layer that the excess leaves behind
    const layer = 16 * P(t, ADD[2] + 1.0, 1.0, linear) + 14 * P(t, ADD[3] + 1.0, 1.0, linear) + 12 * P(t, ADD[4] + 1.0, 1.0, linear);
    const tiltF = clamp(-deg / 50), lowY = Math.max(...CORNERS.map(c => rot(c, deg)[1]));
    const sedTop = lerp(BKH / 2 - 2 - layer, lowY - 2 - layer * 0.7, tiltF);
    const surf = pour >= 1 ? lipRel[1] + 40 : lerp(lerp(SURF0, lipRel[1] + 8, tiltF), lipRel[1] - 2, P(t, POUR0, 0.2, linear));
    if (bkA > 0) {
      tr(bk, bx, by, 1, deg);
      bk.pose(deg, surf, sedTop, layer > 0.5 ? 1 - P(t, POUR0 + 0.2, 0.8, linear) : 0);
      // blue appears as the copper oxide dissolves
      const blue = (P(t, ADD[0] + 0.5, 1.2, linear) + P(t, ADD[1] + 0.5, 1.2, linear) + P(t, ADD[2] + 0.5, 1.2, linear)) / 3;
      bk.liq.setAttribute('fill', mix(CLEAR, CUSO4, blue)); bk.liq.setAttribute('opacity', lerp(0.3, 0.85, blue).toFixed(3));
      op(bk.inner, 1 - lift);
      acid.forEach((p, k) => {
        const tk = KILL[k] < 3 ? ADD[KILL[k]] + 0.7 + (k % 3) * 0.25 : mid('excess', 0.42) + (k % 3) * 0.35;
        const x = bounce1(p.x0 + p.vx * t * 22 * AMP, -96, 96), y = bounce1(p.y0 + p.vy * t * 16 * AMP, 12, BKH / 2 - 14 - layer);
        attr(p.el, 'cx', x); attr(p.el, 'cy', y);
        op(p.el, 1 - P(t, tk, 0.4, linear));
      });
    }
    // the spatula: slides in, tips at each addition, then leaves
    const spIn = P(t, mid('react', 0.3), 0.6, easeOut), spOut = P(t, ADD[4] + 0.9, 0.6, easeIn);
    op(spat, Math.min(spIn, 1 - spOut) * aR);
    if (spIn > 0 && spOut < 1) {
      let tip = 0; ADD.forEach(t0 => { tip = Math.max(tip, win(t, t0 - 0.25, t0 + 0.4, 0.2)); });
      spat.setAttribute('transform', `translate(${(SPT[0] + (1 - spIn) * 360 + spOut * 360).toFixed(1)} ${SPT[1]}) rotate(${(-6 - 18 * tip).toFixed(2)})`);
      const refill = ADD.reduce((n, t0) => n + (t > t0 + 0.1 ? 1 : 0), 0);
      op(spat.load, tip > 0.6 ? 0.3 : refill < ADD.length ? 1 : 0);
    }
    specks.forEach(s => {
      const u = t - s.t0 - 0.05;
      if (u <= 0 || aR <= 0) { op(s.el, 0); return; }
      const fallT = 0.32, x = SPT[0] - 8 + s.dx + (u > fallT ? Math.sin(u * 3 + s.wob) * 6 * AMP : 0);
      let y, a = 1;
      if (u < fallT) y = lerp(SPT[1] + 6, BKY + SURF0, (u / fallT) * (u / fallT));
      else { const v = clamp((u - fallT) / (1.6 * s.sink + 0.6)); y = lerp(BKY + SURF0, BKY + BKH / 2 - 8 - layer * 0.5, ease(v)); if (!s.stay) a = 1 - v; }
      attr(s.el, 'cx', x); attr(s.el, 'cy', y); op(s.el, a * (1 - lift) * (s.stay && u > 2.6 ? 1 - P(u, 2.6, 0.4, linear) : 1));
    });
    const rodA = win(t, mid('react', 0.46), tF - 0.1, 0.4) * aR;
    op(rod, rodA);
    if (rodA > 0) { const sw = Math.sin(t * 3.2) * 7 * AMP; rod.setAttribute('transform', `translate(${(RX + 40 + sw).toFixed(1)} ${BKY - 160}) rotate(${(12 + sw * 0.8).toFixed(2)})`); }
    lblAcid.set(win(t, mid('react', 0.16), tX + 0.2, 0.4) * aR);
    lblCuO.set(win(t, mid('react', 0.36), tX + 0.2, 0.4) * aR);
    const xc = P(t, mid('excess', 0.5), 0.4, linear);
    op(acidChip, win(t, tX - 0.1, tF, 0.35) * (1 - xc)); tr(acidChip, 900, 262);
    op(usedChip, xc * (1 - P(t, tF - 0.45, 0.4, linear))); tr(usedChip, 900, 262, 0.9 + 0.1 * P(t, mid('excess', 0.5), 0.5, pop));
    op(pureNote, P(t, mid('excess', 0.72), 0.4, linear) * (1 - P(t, tF - 0.45, 0.4, linear)));
    excessLbl.set(P(t, mid('excess', 0.2), 0.4, linear) * (1 - P(t, tF - 0.45, 0.4, linear)));

    /* ---------- 2. filter ---------- */
    const aF = Math.min(P(t, tF + 0.1, 0.35, linear), 1 - P(t, tE - 0.45, 0.35, linear));
    op(F2, aF);
    const spout = [bx + lipRel[0], by + lipRel[1]];
    const sOn = pour > 0 && pour < 1 ? Math.min(1, pour * 12, (1 - pour) * 8) : 0;
    op(stream, sOn * aF);
    if (sOn > 0) {
      const tgt = [FX + 30, FY + 46];
      stream.setAttribute('d', `M${spout[0].toFixed(1)},${spout[1].toFixed(1)} Q${(spout[0] - 6).toFixed(1)},${((spout[1] + tgt[1]) / 2).toFixed(1)} ${tgt[0]},${tgt[1]}`);
      stream.setAttribute('stroke-width', (4 + 8 * Math.min(1, (1 - pour) * 3)).toFixed(1));
      sFlecks.forEach((f, k) => { const u = ((t - POUR0) / 0.5 + k / 5) % 1, p = bez(spout, [spout[0] - 6, (spout[1] + tgt[1]) / 2], tgt, u); attr(f, 'cx', p[0]); attr(f, 'cy', p[1]); op(f, sOn * (pour < 0.6 ? 1 : 0)); });
    } else sFlecks.forEach(f => op(f, 0));
    if (aF > 0) {
      const fillP = P(t, POUR0 + 0.2, POUR1 - POUR0, linear), drain = P(t, POUR1, end('filter') - POUR1, linear);
      const lv = clamp(0.75 * fillP - 0.55 * drain);
      attr(fLiq, 'y', (112 - 105 * lv).toFixed(1)); attr(fLiq, 'height', (105 * lv + 4).toFixed(1));
      const rh = 46 * P(t, POUR0 + 0.3, 1.4, easeOut);
      fRes.setAttribute('d', `M-100,112 L-100,${(112 - rh).toFixed(1)} Q-40,${(112 - rh - 4).toFixed(1)} 0,${(112 - rh + 2).toFixed(1)} Q40,${(112 - rh - 4).toFixed(1)} 100,${(112 - rh).toFixed(1)} L100,112 Z`);
      const dOn = P(t, POUR0 + 0.6, 0.3, linear) * (1 - P(t, end('filter') + 0.4, 0.4, linear));
      drips.forEach((d, k) => { const u = ((t - POUR0) / 0.5 + k / 3) % 1; tr(d, FX, FY + 204 + u * u * 64); op(d, dOn * (u < 0.9 ? 1 : 0)); });
      fl.set(0.46 * P(t, POUR0 + 0.9, end('filter') - POUR0 - 0.5, linear), CUSO4);
      lblRes.set(P(t, mid('filter', 0.42), 0.4, linear)); op(subRes, P(t, mid('filter', 0.5), 0.4, linear));
      lblFil.set(P(t, mid('filter', 0.82), 0.4, linear)); op(subFil, P(t, mid('filter', 0.9), 0.4, linear));
    }

    /* ---------- 3. heat, cool ---------- */
    const aE = seg(t, tE, tD);
    op(H3, aE);
    if (aE > 0) {
      const off = P(t, mid('cool', 0.06), 0.1, linear);
      rig3.burner.set(off > 0.5 ? 'off' : 'blue'); rig3.burner.upd(t);
      const ev = P(t, mid('heat', 0.12), end('heat') - mid('heat', 0.12), linear);
      rig3.set(lerp(1, 0.55, ev), mix(CUSO4, CUSO4_DEEP, ev));
      steam.upd(t); op(steam, P(t, mid('heat', 0.14), 0.5, linear) * (1 - P(t, mid('cool', 0.1), 1.0, linear)));
      op(evapLbl, win(t, mid('heat', 0.34), tC + 0.2, 0.4)); evapLbl.arr.set(P(t, mid('heat', 0.34), 0.6));
      filLbl.set(win(t, tE + 0.1, mid('heat', 0.5), 0.35));
      const sp = P(t, mid('heat', 0.64), 0.5, pop); popAt(satChip, 900, 420, sp, 0.6);
      op(satNote, P(t, mid('heat', 0.78), 0.4, linear));
      op(satChip, clamp(sp * 2) * (1 - P(t, tC - 0.1, 0.4, linear))); op(satNote, P(t, mid('heat', 0.78), 0.4, linear) * (1 - P(t, tC - 0.1, 0.4, linear)));
      // cooling: thermometer falls, crystals grow in the basin and in the zoom
      const cA = P(t, tC - 0.1, 0.5, linear);
      op(coolLbl, cA); th.set(0.8 - 0.6 * P(t, tC, 3.6, linear));
      const GROW0 = mid('cool', 0.22), GROW1 = tD - 0.2;
      const gp = clamp((t - GROW0) / (GROW1 - GROW0));
      bX.forEach(c => { const k = clamp((gp - c.d) / 0.5); tr(c.g, c.x, c.y, Math.max(0.01, easeOut(k)), c.r); op(c.g, clamp(k * 4)); });
      op(zoom, P(t, mid('cool', 0.12), 0.5, linear));
      zX.forEach(c => { const k = clamp((gp - c.k * 0.05) / 0.55); tr(c.g, c.x, c.y, Math.max(0.01, easeOut(k)), c.r); op(c.g, clamp(k * 4)); });
      op(growLbl, P(t, mid('cool', 0.62), 0.4, linear));
      op(clockC, P(t, mid('cool', 0.12), 0.4, linear)); clockC.set(2 * gp);
    }

    /* ---------- dry ---------- */
    const aD = seg(t, tD, tO);
    op(DG, aD);
    if (aD > 0) {
      dX.forEach(c => {
        const u = P(t, tD - 0.1 + c.k * 0.06, 0.6, easeOut);
        const p = bez([EX + (c.k - 4) * 8, FLOOR - 296], [(EX + c.x) / 2, 300], [c.x, c.y], u);
        tr(c.g, p[0], p[1], 1, c.r * u); op(c.g, clamp(u * 4));
      });
      const down = P(t, mid('dry', 0.3), 0.35, easeIn), up = P(t, mid('dry', 0.52), 0.4, easeOut);
      op(patG, win(t, mid('dry', 0.22), mid('dry', 0.62), 0.25));
      tr(patG, 600, lerp(lerp(520, 566, down), 520, up));
      [[540, 560, 0.62], [690, 556, 0.7]].forEach(([x, y, f], k) => { const g = P(t, mid('dry', f), 0.5, pop); op(dGl[k], clamp(g * 2) * (0.6 + 0.4 * wave(t, 1.3, k * 0.4))); tr(dGl[k], x, y, Math.max(0.01, g) * (0.8 + 0.3 * wave(t, 1.3, k * 0.4)), (t * 40) % 360 * AMP); });
      const tp = P(t, mid('dry', 0.62), 0.6, easeOut); op(dTitle, tp); tr(dTitle, 0, (1 - tp) * 14);
      const kp = P(t, mid('dry', 0.8), 0.4, pop); popAt(dTick, 600 + textWidth('pure copper sulfate', 52, FD, 700) / 2 + 40, 382, kp, 0.3);
      op(dSub, P(t, mid('dry', 0.4), 0.4, linear));
    }

    /* ---------- other: a metal or a carbonate ---------- */
    const aO = seg(t, tO, null);
    op(OG, aO);
    if (aO > 0) {
      oName.forEach((g, i) => op(g, P(t, tO + i * 0.4, 0.4, linear)));
      oSol.forEach(s => {
        const u = P(t, s.t0, 0.55, easeIn);
        const react = P(t, s.t0 + 0.6, mid('other', 0.78) - s.t0 - 0.6, linear);
        const last = s.t0 >= mid('other', 0.6);
        const sc = last ? 1 - 0.15 * react : 1 - react;
        const x = OBX[s.b] + s.dx, y = lerp(OBY - 118, BOT - 12, u);
        tr(s.g, x, y, Math.max(0.01, sc), u * 40);
        op(s.g, clamp(u * 8) * clamp(sc * 3));
      });
      const fz = OBX.map((x, i) => P(t, mid('other', i ? 0.27 : 0.15), 0.4, linear) * (1 - P(t, mid('other', 0.6), mid('other', 0.82) - mid('other', 0.6), linear)));
      oFizz.forEach((b, i) => b.upd(t, fz[i]));
      oBk[1].set(0.55, mix(CLEAR, CUSO4, P(t, mid('other', 0.3), 2.4, linear)));
      oBk[1].liquid.setAttribute('opacity', lerp(0.3, 0.8, P(t, mid('other', 0.3), 2.4, linear)).toFixed(3));
      popAt(stopChip, 600, 664, P(t, mid('other', 0.5), 0.5, pop), 0.6);
      op(leftG, P(t, mid('other', 0.84), 0.4, linear));
    }
  };
});
