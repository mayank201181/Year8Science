/* Filter, evaporate, crystallise.
   Beats: a toolbox of physical methods opens -> sandy water -> showpiece: it pours through filter paper in
   a funnel; clear drops fall while the sand stays, and a zoom shows grains too big for the paper's holes
   -> filtrate and residue -> salt water goes straight through: still salty -> an evaporating basin over a
   Bunsen: the water evaporates, salt is left -> crystallisation: heat gently until saturated (glass rod)
   -> heat off, cool slowly: crystals grow -> filter them off and pat dry -> the two-card summary -> try it
   at home: salty sand, a coffee filter, a dark plate, a day or two. */
scene('filter', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.3 : 1;

  /* ---------- local helpers ---------- */
  let nid = 0;
  const uid = () => 'ecmFil' + (++nid);
  function clipCircle(cx, cy, r) { const id = uid(), cp = E('clipPath', { id }, defs()); return { url: `url(#${id})`, el: E('circle', { cx, cy, r }, cp) }; }
  function clipPathD(d) { const id = uid(), cp = E('clipPath', { id }, defs()); E('path', { d }, cp); return `url(#${id})`; }
  const scaleAt = (el, cx, cy, s) => el.setAttribute('transform', `translate(${cx} ${cy}) scale(${Math.max(0.001, s).toFixed(4)}) translate(${-cx} ${-cy})`);
  function rich(parent, x, y, segs, o) {
    o = o || {};
    const t = E('text', { x, y, 'font-size': o.size || 30, 'font-weight': o.weight || 600, 'font-family': o.font || FD, 'text-anchor': o.anchor || 'start', fill: o.fill || C.ink }, parent);
    segs.forEach(s => { if (typeof s === 'string') s = [s]; E('tspan', { fill: s[1], 'font-weight': s[2] }, t).textContent = s[0]; });
    return t;
  }
  const SAND = '#D9B77E', SANDDK = '#9C7A45', MURKY = '#79B4C2';
  function grainPath(r, seed) { const q = rng(seed), p = []; for (let i = 0; i < 7; i++) { const a = i / 7 * TAU, k = r * (0.78 + q() * 0.3); p.push([Math.cos(a) * k, Math.sin(a) * k]); } return closedPath(p); }
  /* a crystal: a small cube seen corner-on (2 elements) */
  function crystal(parent, s) {
    const g = G(parent), k = s * 0.87;
    E('path', { d: `M0,${-s} L${k},${-s / 2} L${k},${s / 2} L0,${s} L${-k},${s / 2} L${-k},${-s / 2} Z`, fill: linGrad('#FFFFFF', '#B9D3E4', true), stroke: '#FFFFFF', 'stroke-width': Math.max(1.2, s * 0.08), 'stroke-linejoin': 'round' }, g);
    E('path', { d: `M${-k},${-s / 2} L0,0 L${k},${-s / 2} M0,0 L0,${s}`, fill: 'none', stroke: '#8FB2C8', 'stroke-width': Math.max(1, s * 0.07), 'stroke-linejoin': 'round' }, g);
    return g;
  }
  /* filter funnel (Shared conventions): glass cone, white filter-paper cone inside, short stem.
     Origin: centre of the rim. Rim half-width 110, cone 120 deep, stem tip at y = 200.
     g.inPaper is clipped to the paper cone (apex at y = 112). */
  function filterFunnel(parent, paperFill) {
    const g = G(parent);
    E('path', { d: 'M-110,0 L-11,120 L11,120 L110,0 Z', fill: GLASS.fill }, g);
    E('rect', { x: -7, y: 120, width: 14, height: 76, fill: GLASS.fill }, g);
    const paperD = 'M-98,7 L0,112 L98,7 Z';
    g.paper = E('path', { d: paperD, fill: paperFill || '#F4F7FA', stroke: '#C9D3DC', 'stroke-width': 2, 'stroke-linejoin': 'round' }, g);
    E('path', { d: 'M-20,7 L0,112 M-62,7 L-34,37', stroke: '#C9D3DC', 'stroke-width': 2, fill: 'none', opacity: 0.85 }, g);
    g.inPaper = G(g, { 'clip-path': clipPathD(paperD) });
    E('path', { d: 'M-110,0 L-11,120 L-7,126 L-7,192 L7,200 L7,126 L11,120 L110,0', fill: 'none', stroke: GLASS.stroke, 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
    E('ellipse', { cx: 0, cy: 0, rx: 110, ry: 8, fill: 'none', stroke: GLASS.stroke, 'stroke-width': 3 }, g);
    E('path', { d: 'M80,9 L22,84', stroke: GLASS.shine, 'stroke-width': 5, 'stroke-linecap': 'round' }, g);
    return g;
  }
  /* evaporating basin on a tripod and wire gauze over a Bunsen burner (Shared conventions). Origin: the floor
     under the burner. g.set(level 0..1) the liquid; g.crust(p) the solid left behind; g.burner the kit bunsen. */
  function basinRig(parent) {
    const g = G(parent);
    E('path', { d: 'M0,-8 L0,-226', stroke: '#1C2126', 'stroke-width': 8, 'stroke-linecap': 'round' }, g);   // back leg, behind the burner
    g.burner = bunsen(g);
    E('path', { d: 'M-88,0 L-66,-226 M88,0 L66,-226', stroke: '#1C2126', 'stroke-width': 9, 'stroke-linecap': 'round' }, g);
    E('path', { d: 'M-86,-6 L-66,-220 M86,-6 L66,-220', stroke: '#56626C', 'stroke-width': 2.5, 'stroke-linecap': 'round' }, g);
    E('rect', { x: -84, y: -234, width: 168, height: 12, rx: 5, fill: '#1C2126', stroke: '#56626C', 'stroke-width': 2 }, g);
    E('path', { d: 'M-106,-236 L106,-236 L86,-252 L-86,-252 Z', fill: '#76808A', stroke: '#C9D1D8', 'stroke-width': 2, 'stroke-linejoin': 'round' }, g);
    let mesh = '';
    for (let i = 1; i < 8; i++) mesh += `M${-106 + i * 26.5},-236 L${-86 + i * 21.5},-252 `;
    for (let j = 1; j < 3; j++) { const y = -236 - j * 16 / 3, dx = 20 * j / 3; mesh += `M${-106 + dx},${y.toFixed(1)} L${106 - dx},${y.toFixed(1)} `; }
    E('path', { d: mesh, stroke: '#C9D1D8', 'stroke-width': 1.2, opacity: 0.7 }, g);
    E('path', { d: 'M-96,-302 Q-92,-251 0,-248 Q92,-251 96,-302 Z', fill: ball('#FFFFFF', '#AEBAC4'), stroke: '#E9EEF2', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, g);
    E('ellipse', { cx: 0, cy: -302, rx: 96, ry: 17, fill: '#8E9AA5', stroke: '#FFFFFF', 'stroke-width': 3 }, g);
    const liq = E('ellipse', { cx: 0, cy: -300, rx: 88, ry: 13, fill: C.water, opacity: 0.9 }, g);
    const crust = G(g);
    E('ellipse', { cx: 0, cy: -292, rx: 66, ry: 9, fill: '#FFFFFF', stroke: '#E4EDF2', 'stroke-width': 2 }, crust);
    { const r = rng(9); let d = ''; for (let i = 0; i < 16; i++) { const a = r() * TAU, q = Math.sqrt(r()); d += `M${(Math.cos(a) * 58 * q).toFixed(1)},${(-292 + Math.sin(a) * 6 * q).toFixed(1)} h0.1 `; } E('path', { d, stroke: '#B5C3CE', 'stroke-width': 4, 'stroke-linecap': 'round' }, crust); }
    E('circle', { cx: 0, cy: -294, r: 46, fill: glow('#FFFFFF'), opacity: 0.6 }, crust);
    g.top = G(g);   // things that sit in the basin (crystals)
    g.set = lv => { lv = clamp(lv); attr(liq, 'rx', 26 + 62 * lv); attr(liq, 'ry', 4 + 9 * lv); attr(liq, 'cy', -289 - 11 * lv); op(liq, lv > 0.03 ? 0.9 : lv * 30); };
    g.crust = p => op(crust, p);
    g.set(1); g.crust(0);
    return g;
  }
  /* a beaker that can tilt to pour while its liquid stays level. g.pose(rot, s): rot in degrees,
     s = liquid surface (world-vertical offset from the beaker's centre). g.lvl holds world-aligned content. */
  function pourBeaker(parent, w, h, color) {
    const g = G(parent), r = 14, x0 = -w / 2, x1 = w / 2, y0 = -h / 2, y1 = h / 2;
    const body = `M${x0},${y0 + 4} L${x0},${y1 - r} Q${x0},${y1} ${x0 + r},${y1} L${x1 - r},${y1} Q${x1},${y1} ${x1},${y1 - r} L${x1},${y0 + 4} Z`;
    E('path', { d: body, fill: GLASS.fill }, g);
    const lq = G(g, { 'clip-path': clipPathD(body) });
    g.lvl = G(lq);
    g.liq = E('rect', { x: -300, y: 0, width: 600, height: 600, fill: color, opacity: 0.85 }, g.lvl);
    g.surf = E('rect', { x: -300, y: 0, width: 600, height: 4, fill: '#FFFFFF', opacity: 0.35 }, g.lvl);
    for (let i = 1; i <= 3; i++) E('line', { x1: x0 + 8, x2: x0 + 26, y1: y1 - i * h / 4.5, y2: y1 - i * h / 4.5, stroke: GLASS.stroke, 'stroke-width': 2.5, opacity: 0.7 }, g);
    E('path', { d: `M${x0 - 10},${y0} L${x0},${y0 + 6} L${x0},${y1 - r} Q${x0},${y1} ${x0 + r},${y1} L${x1 - r},${y1} Q${x1},${y1} ${x1},${y1 - r} L${x1},${y0 + 6} L${x1 + 4},${y0}`, fill: 'none', stroke: GLASS.stroke, 'stroke-width': 4, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, g);
    E('rect', { x: x1 - 22, y: y0 + 20, width: 7, height: h - 50, rx: 3.5, fill: GLASS.shine }, g);
    g.spout = [x0 - 10, y0];
    g.pose = (rot, s) => { g.lvl.setAttribute('transform', `rotate(${(-rot).toFixed(2)})`); attr(g.liq, 'y', s); attr(g.surf, 'y', s); };
    return g;
  }
  const rotPt = (p, deg) => { const a = deg * Math.PI / 180, c = Math.cos(a), s = Math.sin(a); return [p[0] * c - p[1] * s, p[0] * s + p[1] * c]; };

  /* ================= A. a toolbox of physical methods ================= */
  const A = G(root);
  const mixG = G(A), mixP = [];
  { const r = rng(5); for (let k = 0; k < 12; k++) { const sand = k % 2 === 0; mixP.push({ el: sand ? E('path', { d: grainPath(13, 40 + k), fill: ball(SAND, SANDDK) }, mixG) : E('circle', { r: 12, fill: ball(C.water, C.waterDk) }, mixG), x: 600 + (r() - 0.5) * 300, y: 330 + (r() - 0.5) * 120, ph: r() * TAU }); } }
  const mixLbl = rich(A, 600, 226, ['a mixture: ', ['not bonded', C.energy, 800]], { size: 34, anchor: 'middle' });
  function icoFunnel(p, s) {
    const g = G(p); tr(g, 0, 0, s || 1);
    E('path', { d: 'M-48,-44 L-6,10 L-6,46 L6,52 L6,10 L48,-44 Z', fill: 'rgba(200,230,250,0.14)', stroke: GLASS.stroke, 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
    E('path', { d: 'M-40,-40 L0,6 L40,-40 Z', fill: '#F4F7FA', stroke: '#C9D3DC', 'stroke-width': 2, 'stroke-linejoin': 'round' }, g);
    E('path', { d: 'M-16,-12 Q0,-22 16,-12 L0,6 Z', fill: SAND }, g);
    return g;
  }
  function icoBasin(p, s) {
    const g = G(p); tr(g, 0, 0, s || 1);
    E('path', { d: 'M-34,50 L-24,6 M34,50 L24,6', stroke: '#1C2126', 'stroke-width': 6, 'stroke-linecap': 'round' }, g);
    E('rect', { x: -40, y: 2, width: 80, height: 7, rx: 3, fill: '#76808A' }, g);
    E('path', { d: 'M-46,-18 Q-44,6 0,7 Q44,6 46,-18 Z', fill: ball('#FFFFFF', '#AEBAC4'), stroke: '#E9EEF2', 'stroke-width': 2 }, g);
    E('ellipse', { cx: 0, cy: -18, rx: 46, ry: 8, fill: '#8E9AA5', stroke: '#FFFFFF', 'stroke-width': 2 }, g);
    E('ellipse', { cx: 0, cy: -16, rx: 30, ry: 4.5, fill: '#FFFFFF' }, g);
    E('path', { d: 'M-14,-30 q-6,-10 0,-20 q6,-10 0,-20 M10,-30 q-6,-10 0,-20 q6,-10 0,-20', fill: 'none', stroke: '#DDEFF8', 'stroke-width': 4, 'stroke-linecap': 'round' }, g);
    return g;
  }
  /* Liebig condenser (08_distil's look): glass tube in a pale-blue water jacket; cold water in at the lower end, out at the top */
  function icoCondenser(p) {
    const g = G(p); tr(g, 0, 0, 1, 22);
    const arms = 'M-30,-15 L-30,-30 M30,15 L30,30';
    E('path', { d: arms, stroke: GLASS.stroke, 'stroke-width': 9, 'stroke-linecap': 'round' }, g);
    E('path', { d: arms, stroke: '#1D5D78', 'stroke-width': 4, 'stroke-linecap': 'round' }, g);
    E('rect', { x: -52, y: -17, width: 104, height: 34, rx: 13, fill: 'rgba(76,201,240,0.34)', stroke: GLASS.stroke, 'stroke-width': 3 }, g);
    E('line', { x1: -74, x2: 74, y1: 0, y2: 0, stroke: GLASS.stroke, 'stroke-width': 9, 'stroke-linecap': 'round' }, g);
    E('line', { x1: -74, x2: 74, y1: 0, y2: 0, stroke: '#123848', 'stroke-width': 4, 'stroke-linecap': 'round' }, g);
    E('path', { d: 'M-36,-36 L-30,-44 L-24,-36 M24,44 L30,36 L36,44', fill: 'none', stroke: C.water, 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    return g;
  }
  /* chromatography strip (08_distil's look): the ink has split into yellow, pink and blue, top to bottom */
  function icoChroma(p) {
    const g = G(p);
    E('rect', { x: -14, y: -52, width: 28, height: 92, rx: 2, fill: '#F6F3EC' }, g);
    E('line', { x1: -14, x2: 14, y1: 26, y2: 26, stroke: '#8A949C', 'stroke-width': 2 }, g);
    [[-18, '#FFD23F'], [-2, '#FF4FA0'], [12, '#3F7BFF']].forEach(([y, c]) => E('circle', { cx: 0, cy: y, r: 5.5, fill: c }, g));
    E('path', { d: 'M-36,6 L-36,46 Q-36,52 -30,52 L30,52 Q36,52 36,46 L36,6', fill: 'rgba(200,230,250,0.12)', stroke: GLASS.stroke, 'stroke-width': 3.5, 'stroke-linejoin': 'round' }, g);
    E('rect', { x: -33, y: 34, width: 66, height: 16, rx: 3, fill: C.water, opacity: 0.6 }, g);
    return g;
  }
  const TOOLS = [
    { x: 255, name: 'filtration', draw: p => icoFunnel(p, 1) },
    { x: 485, name: 'evaporation', draw: p => icoBasin(p, 1.05) },
    { x: 715, name: 'distillation', draw: p => icoCondenser(p) },
    { x: 945, name: 'chromatography', draw: p => icoChroma(p) },
  ].map(o => {
    const cardG = G(A); card(cardG, o.x - 110, 150, 220, 214, { fill: C.card, stroke: C.line });
    T(cardG, o.x, 336, o.name, { size: 26, weight: 700, anchor: 'middle' });
    const ico = G(A); o.draw(ico);
    return Object.assign(o, { cardG, ico });
  });
  const box = G(A); tr(box, 600, 595);
  E('rect', { x: -184, y: -74, width: 368, height: 20, fill: '#2A1416' }, box);
  const lidL = G(box), lidR = G(box);
  E('rect', { x: -194, y: -112, width: 194, height: 42, rx: 10, fill: ball('#F0645C', '#A8302A'), stroke: '#FF9A90', 'stroke-width': 2.5 }, lidL);
  E('rect', { x: -110, y: -124, width: 70, height: 14, rx: 7, fill: '#3A4752' }, lidL);
  E('rect', { x: 0, y: -112, width: 194, height: 42, rx: 10, fill: ball('#F0645C', '#A8302A'), stroke: '#FF9A90', 'stroke-width': 2.5 }, lidR);
  E('rect', { x: 40, y: -124, width: 70, height: 14, rx: 7, fill: '#3A4752' }, lidR);
  E('rect', { x: -190, y: -70, width: 380, height: 150, rx: 14, fill: ball('#E8524A', '#9C2A25'), stroke: '#FF9A90', 'stroke-width': 2.5 }, box);
  E('rect', { x: -26, y: -64, width: 52, height: 18, rx: 4, fill: '#C9D6DE' }, box);
  T(box, 0, 30, 'PHYSICAL METHODS', { size: 30, weight: 700, anchor: 'middle', fill: '#FFF3EE', ls: 1 });
  const chooseChip = chip(A, 'choose the right one', { size: 30, fill: C.card2, stroke: C.energy, sw: 2.5, color: C.energy }); tr(chooseChip, 995, 600);

  /* ================= B. filtration ================= */
  const B = G(root);
  const FX = 470, FY = 298;
  const filHdr = T(B, 600, 162, 'filtration', { size: 52, weight: 700, anchor: 'middle', fill: C.energy });
  const filSub = rich(B, 600, 210, ['separates an ', ['insoluble solid', SAND, 800], ' from a ', ['liquid', C.water, 800]], { size: 32, anchor: 'middle' });
  const flA = flask(B, 1.15, { level: 0, liquid: C.water }); tr(flA, FX, 560);
  const flB = flask(B, 1.15, { level: 0, liquid: C.water }); tr(flB, FX, 560);
  const flSpecks = G(B), flSp = [];
  { const r = rng(17); for (let k = 0; k < 14; k++) { const x = FX + (r() - 0.5) * 100, y = 658 - r() * 44; flSp.push({ el: E('rect', { x: x - 3, y: y - 3, width: 6, height: 6, rx: 1.5, fill: '#FFFFFF' }, flSpecks), x, y }); } }
  const fun = filterFunnel(B); tr(fun, FX, FY);
  const funLiq = E('rect', { x: -110, y: 112, width: 220, height: 0, fill: MURKY, opacity: 0.8 }, fun.inPaper);
  const residue = G(fun.inPaper);
  E('path', { d: 'M-44,112 Q-26,80 0,78 Q26,80 44,112 Z', fill: ball(SAND, SANDDK), stroke: '#B8955C', 'stroke-width': 2 }, residue);
  { const r = rng(27); let d = ''; for (let k = 0; k < 10; k++) { const gx = (r() - 0.5) * 60, gy = 96 + r() * 12; d += grainPath(6, 60 + k).replace(/(-?[\d.]+),(-?[\d.]+)/g, (m, a, b) => (+a + gx).toFixed(1) + ',' + (+b + gy).toFixed(1)); } E('path', { d, fill: '#B8955C', stroke: SAND, 'stroke-width': 1.5 }, residue); }
  const drops = [0, 1, 2].map(() => E('path', { d: 'M0,-7 C4,-2 5,1 5,3 A5,5 0 0 1 -5,3 C-5,1 -4,-2 0,-7 Z', fill: C.water }, B));
  // the beaker of sandy water (and later salt water)
  const pb = pourBeaker(B, 180, 210, C.water);
  const cloud = E('rect', { x: -300, y: 0, width: 600, height: 600, fill: '#C9A46A', opacity: 0.32 }, pb.lvl);
  const pbGrains = []; { const r = rng(33); for (let k = 0; k < 16; k++) pbGrains.push({ el: E('path', { d: grainPath(6.5, 80 + k), fill: k % 3 ? SAND : '#B8955C' }, pb.lvl), a: r() * TAU, rad: 20 + r() * 52, ph: r() * TAU, sp: 0.5 + r() * 0.6 }); }
  const pbSalt = []; { const r = rng(34); for (let k = 0; k < 10; k++) pbSalt.push({ el: E('rect', { x: -3, y: -3, width: 6, height: 6, rx: 1.5, fill: '#FFFFFF' }, pb.lvl), x: (r() - 0.5) * 120, y: 10 + r() * 70 }); }
  const sandyLbl = T(B, 880, 664, 'sand + water', { size: 30, weight: 700, anchor: 'middle', fill: SAND });
  const saltyChip = chip(B, 'salt water', { size: 30, fill: C.card2, stroke: '#E4EDF2', sw: 2.5 }); tr(saltyChip, 912, 318);
  const stream = E('path', { fill: 'none', stroke: MURKY, 'stroke-width': 12, 'stroke-linecap': 'round', opacity: 0.9 }, B);
  const strGrains = [0, 1, 2, 3, 4, 5].map(k => E('path', { d: grainPath(6, 90 + k), fill: SAND }, B));
  const strSalt = [0, 1, 2, 3, 4].map(() => E('rect', { x: -2.5, y: -2.5, width: 5, height: 5, fill: '#FFFFFF' }, B));
  // zoom on the paper's fibres
  const LX = 960, LY = 545, LR = 135;
  const zCone = G(B), zl = G(B);
  { const sx = FX, sy = FY + 64, sr = 24, dx = LX - sx, dy = LY - sy, d = Math.hypot(dx, dy), th = Math.atan2(dy, dx), ph = Math.acos((sr - LR) / d);
    const p = (cx, cy, r, a) => (cx + Math.cos(a) * r).toFixed(1) + ',' + (cy + Math.sin(a) * r).toFixed(1);
    E('path', { d: `M${p(sx, sy, sr, th + ph)} L${p(LX, LY, LR, th + ph)} L${p(LX, LY, LR, th - ph)} L${p(sx, sy, sr, th - ph)} Z`, fill: 'rgba(228,237,242,0.07)' }, zCone);
    E('path', { d: `M${p(sx, sy, sr, th + ph)} L${p(LX, LY, LR, th + ph)} M${p(sx, sy, sr, th - ph)} L${p(LX, LY, LR, th - ph)}`, stroke: '#9FB7C6', 'stroke-width': 2.5, opacity: 0.75 }, zCone);
    E('circle', { cx: sx, cy: sy, r: sr, fill: 'rgba(228,237,242,0.10)', stroke: '#E4EDF2', 'stroke-width': 3.5, 'stroke-dasharray': '7 5' }, zCone); }
  E('circle', { cx: LX, cy: LY, r: LR, fill: '#0B1D28' }, zl);
  const zc = clipCircle(LX, LY, LR - 5);
  const zIn = G(zl, { 'clip-path': zc.url });
  E('rect', { x: LX - LR, y: LY + 30, width: 2 * LR, height: LR, fill: C.water, opacity: 0.18 }, zIn);
  const zWater = []; { const r = rng(51); for (let k = 0; k < 14; k++) zWater.push({ el: E('circle', { r: 6, fill: ball(C.water, C.waterDk) }, zIn), x: LX - 110 + r() * 220, ph: k / 14, sp: 0.55 + r() * 0.3 }); }
  const zSalt = []; { const r = rng(52); for (let k = 0; k < 9; k++) zSalt.push({ el: E('rect', { x: -4.5, y: -4.5, width: 9, height: 9, rx: 2, fill: '#FFFFFF', stroke: '#8FA1AF', 'stroke-width': 1 }, zIn), x: LX - 100 + r() * 200, ph: k / 9 + r() * 0.05, sp: 0.5 + r() * 0.3 }); }
  { let dk = '', lt = '';
    for (let j = 0; j < 3; j++) { const y = LY - 24 + j * 24; let d = `M${LX - 150},${y}`; for (let x = LX - 150; x <= LX + 150; x += 30) d += ` Q${x + 15},${y + (j % 2 ? 7 : -7)} ${x + 30},${y}`; dk += d + ' '; lt += d + ' '; }
    for (let i = 0; i < 7; i++) { const x = LX - 120 + i * 40; dk += `M${x - 8},${LY - 44} Q${x + 8},${LY} ${x - 4},${LY + 44} `; lt += `M${x - 8},${LY - 44} Q${x + 8},${LY} ${x - 4},${LY + 44} `; }
    E('path', { d: dk, fill: 'none', stroke: '#A8987A', 'stroke-width': 12, 'stroke-linecap': 'round' }, zIn);
    E('path', { d: lt, fill: 'none', stroke: '#F1E8D4', 'stroke-width': 7, 'stroke-linecap': 'round' }, zIn); }
  const zGrains = [-84, -30, 26, 82].map((x, k) => ({ el: E('path', { d: grainPath(20, 120 + k), fill: ball(SAND, SANDDK), stroke: '#B8955C', 'stroke-width': 2 }, zIn), x, k }));
  E('circle', { cx: LX, cy: LY, r: LR, fill: 'none', stroke: '#9FB3C2', 'stroke-width': 12 }, zl);
  E('circle', { cx: LX, cy: LY, r: LR - 8, fill: 'none', stroke: '#5E7484', 'stroke-width': 3 }, zl);
  const holesLbl = T(B, LX, 386, 'tiny holes in the paper', { size: 28, weight: 700, anchor: 'middle' });
  const slipLbl = T(B, LX, 386, 'salt slips through the holes', { size: 28, weight: 700, anchor: 'middle' });
  const tooBig = T(B, LX, 712, 'sand grains: too big', { size: 28, weight: 700, anchor: 'middle', fill: SAND });
  // names
  const lblFiltrate = G(B); labelLine(lblFiltrate, 680, 636, FX + 30, 632, 'filtrate', { size: 38, fill: C.water, anchor: 'start', weight: 700 }); T(lblFiltrate, 680, 674, 'the liquid that passes through', { size: 27, weight: 600, fill: C.muted });
  const lblResidue = G(B); labelLine(lblResidue, 680, 404, FX + 22, FY + 98, 'residue', { size: 38, fill: SAND, anchor: 'start', weight: 700 }); T(lblResidue, 680, 442, 'the solid left on the paper', { size: 27, weight: 600, fill: C.muted });
  const lblSalty = G(B); labelLine(lblSalty, 350, 636, FX - 34, 632, 'still salty', { size: 38, fill: '#FF8A80', anchor: 'end', weight: 700 });
  const SALTYX = 350 - textWidth('still salty', 38, FD, 700) - 36;
  const saltyX = cross(lblSalty, 18); tr(saltyX, SALTYX, 622);

  /* ================= C. evaporate, crystallise, cool ================= */
  const Cv = G(root);
  const RX = 480, RY = 690;
  const rigG = G(Cv); tr(rigG, RX, RY); const rig = basinRig(rigG);
  const steam = heatWaves(rigG, { n: 4, h: 100, spacing: 34, color: '#DDEFF8', width: 5, speed: 0.6 }); tr(steam, 0, -326);
  const evHdr = T(Cv, 600, 162, 'evaporation', { size: 52, weight: 700, anchor: 'middle', fill: C.energy });
  const crHdr = T(Cv, 600, 162, 'crystallisation', { size: 52, weight: 700, anchor: 'middle', fill: C.energy });
  const crSub = T(Cv, 600, 208, 'purer, better-shaped crystals', { size: 30, weight: 600, anchor: 'middle' });
  const subIcons = [-1, 1].map(sgn => { const g = G(Cv); tr(g, 600 + sgn * (textWidth('purer, better-shaped crystals', 30, FD, 600) / 2 + 34), 198); return crystal(g, 13); });
  const lblBasin = G(Cv); labelLine(lblBasin, 700, 410, RX + 98, RY - 300, 'evaporating basin', { size: 32, anchor: 'start', weight: 700 });
  const lblEvap = G(Cv); { const a = arrow(lblEvap, 640, 330, 640, 268, { color: '#DDEFF8', width: 5 }); T(lblEvap, 664, 310, 'the water evaporates', { size: 30, weight: 700, fill: '#DDEFF8' }); lblEvap.arrowEl = a; }
  const lblSaltLeft = G(Cv); labelLine(lblSaltLeft, 700, 482, RX + 40, RY - 292, 'salt left behind', { size: 32, anchor: 'start', weight: 700, fill: '#FFFFFF' });
  const heatLbl = T(Cv, RX + 74, RY - 120, 'gentle heat', { size: 28, weight: 700, fill: '#8FC4FF' });
  const offLbl = T(Cv, RX + 74, RY - 120, 'heat off', { size: 28, weight: 700, fill: C.muted });
  // glass rod
  const rod = G(Cv);
  E('line', { x1: 0, y1: 0, x2: 190, y2: -150, stroke: '#DDEEF6', 'stroke-width': 9, 'stroke-linecap': 'round', opacity: 0.85 }, rod);
  E('line', { x1: 12, y1: -14, x2: 180, y2: -146, stroke: '#FFFFFF', 'stroke-width': 3, 'stroke-linecap': 'round', opacity: 0.6 }, rod);
  const rodXtal = G(rod); [[-2, 4, 5], [6, -4, 4], [-6, -6, 3.5], [4, 8, 3.5]].forEach(([x, y, s]) => tr(crystal(rodXtal, s), x, y));
  const satLbl = T(Cv, 0, 0, 'saturated', { size: 34, weight: 700, fill: C.energy });
  // crystals in the basin, and a zoom where they grow
  const bXtal = []; [[-46, -298, 7], [-14, -292, 9], [22, -300, 8], [52, -294, 7], [4, -306, 6], [-30, -306, 6]].forEach(([x, y, s], k) => bXtal.push({ g: crystal(rig.top, s), x, y, k }));
  const clock = G(Cv); tr(clock, 690, 268);
  E('circle', { r: 34, fill: C.card, stroke: C.muted, 'stroke-width': 4 }, clock);
  for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; E('line', { x1: Math.cos(a) * 26, y1: Math.sin(a) * 26, x2: Math.cos(a) * 30, y2: Math.sin(a) * 30, stroke: C.muted, 'stroke-width': 2 }, clock); }
  const hHand = E('line', { x1: 0, y1: 0, x2: 0, y2: -15, stroke: C.ink, 'stroke-width': 4, 'stroke-linecap': 'round' }, clock);
  const mHand = E('line', { x1: 0, y1: 0, x2: 0, y2: -24, stroke: C.energy, 'stroke-width': 3.5, 'stroke-linecap': 'round' }, clock);
  const coolLbl = T(Cv, 738, 280, 'cool slowly', { size: 32, weight: 700, fill: '#9FD8FF' });
  const CX2 = 930, CY2 = 470, CR2 = 135;
  const czCone = G(Cv), cz = G(Cv);
  { const sx = RX, sy = RY - 300, sr = 22, dx = CX2 - sx, dy = CY2 - sy, d = Math.hypot(dx, dy), th = Math.atan2(dy, dx), ph = Math.acos((sr - CR2) / d);
    const p = (cx, cy, r, a) => (cx + Math.cos(a) * r).toFixed(1) + ',' + (cy + Math.sin(a) * r).toFixed(1);
    E('path', { d: `M${p(sx, sy, sr, th + ph)} L${p(CX2, CY2, CR2, th + ph)} L${p(CX2, CY2, CR2, th - ph)} L${p(sx, sy, sr, th - ph)} Z`, fill: 'rgba(228,237,242,0.07)' }, czCone);
    E('path', { d: `M${p(sx, sy, sr, th + ph)} L${p(CX2, CY2, CR2, th + ph)} M${p(sx, sy, sr, th - ph)} L${p(CX2, CY2, CR2, th - ph)}`, stroke: '#9FB7C6', 'stroke-width': 2.5, opacity: 0.75 }, czCone);
    E('circle', { cx: sx, cy: sy, r: sr, fill: 'none', stroke: '#E4EDF2', 'stroke-width': 3.5, 'stroke-dasharray': '7 5' }, czCone); }
  E('circle', { cx: CX2, cy: CY2, r: CR2, fill: '#0F3244' }, cz);
  const czc = clipCircle(CX2, CY2, CR2 - 5);
  const czIn = G(cz, { 'clip-path': czc.url });
  E('circle', { cx: CX2, cy: CY2, r: CR2, fill: glow('#4CC9F0'), opacity: 0.3 }, czIn);
  const zX = [[-62, 34, 34], [10, -40, 28], [58, 46, 38], [-30, -58, 22], [70, -24, 24], [-8, 70, 26]].map(([x, y, s], k) => ({ g: crystal(czIn, s), x: CX2 + x, y: CY2 + y, s, k }));
  const zSol = []; { const r = rng(71); for (let k = 0; k < 12; k++) { const tgt = zX[k % zX.length]; zSol.push({ el: E('rect', { x: -4.5, y: -4.5, width: 9, height: 9, rx: 2, fill: '#FFFFFF', opacity: 0.9 }, czIn), tgt, a: r() * TAU, d: 70 + r() * 50, ph: r(), k }); } }
  E('circle', { cx: CX2, cy: CY2, r: CR2, fill: 'none', stroke: '#9FB3C2', 'stroke-width': 12 }, cz);
  E('circle', { cx: CX2, cy: CY2, r: CR2 - 8, fill: 'none', stroke: '#5E7484', 'stroke-width': 3 }, cz);
  const growLbl = T(Cv, CX2, CY2 + CR2 + 50, 'neat crystals grow', { size: 32, weight: 700, anchor: 'middle' });

  /* ================= D. filter off and dry ================= */
  const Dg = G(root);
  const dFl = flask(Dg, 0.9, { level: 0.42, liquid: C.water }); tr(dFl, 270, 572);
  const dFun = G(Dg); tr(dFun, 270, 356, 0.72); const dF = filterFunnel(dFun);
  const dX = []; [[-22, 92, 11], [8, 88, 12], [-4, 72, 10], [26, 72, 9], [-34, 74, 8]].forEach(([x, y, s]) => { const g = crystal(dF.inPaper, s); tr(g, x, y); dX.push(g); });
  const dDrop = E('path', { d: 'M0,-7 C4,-2 5,1 5,3 A5,5 0 0 1 -5,3 C-5,1 -4,-2 0,-7 Z', fill: C.water }, Dg);
  const sheetD = 'M-150,40 L150,40 L118,-30 L-118,-30 Z';
  const sheets = G(Dg); tr(sheets, 690, 540);
  E('path', { d: sheetD, fill: '#F4F7FA', stroke: '#C9D3DC', 'stroke-width': 2, 'stroke-linejoin': 'round' }, sheets);
  const wet = []; [[-60, 6], [-10, -6], [40, 10], [80, -8], [-90, -10]].forEach(([x, y]) => wet.push(E('ellipse', { cx: x, cy: y, rx: 20, ry: 8, fill: '#9FC6DC', opacity: 0.55 }, sheets)));
  const sX = []; [[-62, 2, 13], [-14, -8, 12], [32, 6, 14], [76, -10, 11], [-96, -8, 10]].forEach(([x, y, s]) => { const g = crystal(sheets, s); tr(g, x, y - s); sX.push(g); });
  const topSheet = E('path', { d: sheetD, fill: '#FFFFFF', stroke: '#C9D3DC', 'stroke-width': 2, 'stroke-linejoin': 'round', opacity: 0.96 }, sheets);
  const dampG = G(sheets); [[-60, 6], [-10, -6], [40, 10]].forEach(([x, y]) => E('ellipse', { cx: x, cy: y, rx: 18, ry: 7, fill: '#B8D3E3', opacity: 0.8 }, dampG));
  const warmG = G(Dg); tr(warmG, 1010, 0);
  const sunArt = sun(warmG, 40); tr(sunArt, 0, 290);
  const dish2 = G(warmG); tr(dish2, 0, 536);
  E('path', { d: 'M-70,0 Q-60,24 0,26 Q60,24 70,0 Z', fill: ball('#FFFFFF', '#BFC9D2'), stroke: '#E9EEF2', 'stroke-width': 2 }, dish2);
  E('ellipse', { cx: 0, cy: 0, rx: 70, ry: 12, fill: '#8E9AA5', stroke: '#FFFFFF', 'stroke-width': 2 }, dish2);
  [[-30, -4, 9], [0, 2, 11], [28, -6, 8]].forEach(([x, y, s]) => tr(crystal(dish2, s), x, y - s * 0.6));
  const warmWaves = heatWaves(warmG, { n: 3, h: 70, spacing: 26, color: C.heat, width: 4, speed: 0.5 }); tr(warmWaves, 0, 500);
  const dLbl1 = T(Dg, 270, 708, 'filter off the crystals', { size: 28, weight: 700, anchor: 'middle' });
  const dLbl2 = T(Dg, 690, 650, 'pat dry with filter paper', { size: 28, weight: 700, anchor: 'middle' });
  const dLbl3 = T(Dg, 1010, 640, 'or somewhere warm', { size: 28, weight: 700, anchor: 'middle', fill: '#FFC27A' });

  /* ================= E. the key idea ================= */
  const Kg = G(root);
  const kL = G(Kg), kR = G(Kg);
  card(kL, 90, 196, 480, 420, { fill: C.card, stroke: SAND });
  const kIcoL = G(kL); tr(kIcoL, 330, 300); icoFunnel(kIcoL, 1.5);
  T(kL, 330, 432, 'filtration', { size: 44, weight: 700, anchor: 'middle', fill: C.energy });
  rich(kL, 330, 500, ['traps an ', ['undissolved', SAND, 800], ' solid'], { size: 32, anchor: 'middle' });
  T(kL, 330, 556, 'like sand from water', { size: 27, weight: 600, anchor: 'middle', fill: C.muted });
  card(kR, 630, 196, 480, 420, { fill: C.card, stroke: '#E4EDF2' });
  const kIcoR = G(kR); tr(kIcoR, 870, 300); icoBasin(kIcoR, 1.5);
  T(kR, 870, 422, 'evaporation', { size: 44, weight: 700, anchor: 'middle', fill: C.energy });
  T(kR, 870, 460, 'or crystallisation', { size: 30, weight: 700, anchor: 'middle', fill: C.energy });
  rich(kR, 870, 510, ['recovers a ', ['dissolved', '#FFFFFF', 800], ' solid'], { size: 32, anchor: 'middle' });
  T(kR, 870, 562, 'like salt from salt water', { size: 27, weight: 600, anchor: 'middle', fill: C.muted });

  /* ================= F. try it at home ================= */
  const Hg = G(root);
  const homeChip = chip(Hg, 'Try it at home!', { size: 34, fill: C.energy, color: C.bg0 }); tr(homeChip, 600, 158);
  // 1. a mug of warm water with salty sand
  const mugG = G(Hg); tr(mugG, 220, 440);
  const mugD = 'M-70,-80 L70,-80 L64,80 Q62,94 48,94 L-48,94 Q-62,94 -64,80 Z';
  E('path', { d: 'M66,-44 Q118,-44 116,6 Q114,52 60,50', fill: 'none', stroke: '#E07A5F', 'stroke-width': 16, 'stroke-linecap': 'round' }, mugG);
  E('path', { d: mugD, fill: ball('#F28C6F', '#B54B32'), stroke: '#FFC1AE', 'stroke-width': 3, 'stroke-linejoin': 'round' }, mugG);
  E('ellipse', { cx: 0, cy: -80, rx: 70, ry: 14, fill: '#6E2E22', stroke: '#FFC1AE', 'stroke-width': 3 }, mugG);
  const mugLiq = E('ellipse', { cx: 0, cy: -74, rx: 62, ry: 10, fill: MURKY }, mugG);
  const mugGr = []; { const r = rng(81); for (let k = 0; k < 7; k++) mugGr.push({ el: E('path', { d: grainPath(5, 140 + k), fill: k % 2 ? SAND : '#FFFFFF' }, mugG), a: r() * TAU, rr: 12 + r() * 40 }); }
  const mugSpoon = G(mugG); E('path', { d: 'M0,0 L64,-92', stroke: linGrad('#E1E8EE', '#8A9BA8'), 'stroke-width': 9, 'stroke-linecap': 'round' }, mugSpoon);
  const mugSteam = heatWaves(mugG, { n: 3, h: 60, spacing: 28, color: '#DDEFF8', width: 4, speed: 0.6 }); tr(mugSteam, -6, -96);
  // 2. a coffee filter in a funnel over a jar
  const cfG = G(Hg); tr(cfG, 600, 0);
  E('path', { d: 'M-56,560 L-56,456 Q-56,446 -46,446 L46,446 Q56,446 56,456 L56,560 Q56,572 44,572 L-44,572 Q-56,572 -56,560 Z', fill: GLASS.fill, stroke: GLASS.stroke, 'stroke-width': 4 }, cfG);
  const jarLiq = E('rect', { x: -52, y: 540, width: 104, height: 30, rx: 8, fill: C.water, opacity: 0.8 }, cfG);
  E('path', { d: 'M-90,330 L-8,430 L-8,470 L8,470 L8,430 L90,330 Z', fill: GLASS.fill, stroke: GLASS.stroke, 'stroke-width': 4, 'stroke-linejoin': 'round' }, cfG);
  let wavy = 'M-80,336'; for (let i = 0; i < 8; i++) wavy += ` Q${-80 + i * 20 + 10},${i % 2 ? 330 : 342} ${-80 + (i + 1) * 20},336`;
  E('path', { d: wavy + ' L0,424 Z', fill: '#E8D3B0', stroke: '#C9AE84', 'stroke-width': 2, 'stroke-linejoin': 'round' }, cfG);
  E('path', { d: 'M-26,392 Q0,380 26,392 L0,422 Z', fill: SAND }, cfG);
  const cfDrop = E('path', { d: 'M0,-7 C4,-2 5,1 5,3 A5,5 0 0 1 -5,3 C-5,1 -4,-2 0,-7 Z', fill: C.water }, cfG);
  // 3. a dark plate, a day or two
  const plG = G(Hg); tr(plG, 980, 500);
  E('ellipse', { cx: 0, cy: 8, rx: 136, ry: 34, fill: '#0E151B', stroke: '#3A4752', 'stroke-width': 4 }, plG);
  E('ellipse', { cx: 0, cy: 6, rx: 96, ry: 22, fill: '#1B2730', stroke: '#2C3A45', 'stroke-width': 2 }, plG);
  const film = E('ellipse', { cx: 0, cy: 6, rx: 76, ry: 16, fill: C.water, opacity: 0.35 }, plG);
  const plX = []; { const r = rng(91); for (let k = 0; k < 7; k++) { const a = r() * TAU, q = Math.sqrt(r()), x = Math.cos(a) * 64 * q, y = 6 + Math.sin(a) * 13 * q; plX.push({ g: crystal(plG, 5.5 + r() * 4), k, x, y }); } }
  const dn = G(Hg); tr(dn, 980, 300);
  E('circle', { r: 44, fill: C.card, stroke: C.line, 'stroke-width': 3 }, dn);
  const dnSun = G(dn); const dnSunArt = sun(dnSun, 16);
  const dnMoon = G(dn); E('circle', { r: 21, fill: ball('#F4F7FA', '#AFC0CD') }, dnMoon); E('circle', { cx: 11, cy: -8, r: 17, fill: C.card }, dnMoon);
  const dnCount = T(Hg, 980, 384, '', { size: 28, weight: 700, anchor: 'middle', fill: C.energy });
  const homeArrows = [arrow(Hg, 340, 440, 470, 440, { color: C.faint, width: 6 }), arrow(Hg, 720, 440, 830, 440, { color: C.faint, width: 6 })];
  const steps = [
    { x: 220, a: 'stir salty sand', b: 'into warm water' },
    { x: 600, a: 'filter out', b: 'the sand' },
    { x: 980, a: 'leave on a', b: 'dark plate' },
  ].map((s, i) => {
    const g = G(Hg);
    E('circle', { cx: s.x - textWidth(s.a, 30, FD, 700) / 2 - 30, cy: 612, r: 20, fill: C.energy }, g);
    T(g, s.x - textWidth(s.a, 30, FD, 700) / 2 - 30, 621, String(i + 1), { size: 26, weight: 700, anchor: 'middle', fill: C.bg0 });
    T(g, s.x, 622, s.a, { size: 30, weight: 700, anchor: 'middle' });
    T(g, s.x, 660, s.b, { size: 28, weight: 600, anchor: 'middle', fill: C.muted });
    return g;
  });
  const xtalLbl = T(Hg, 980, 446, 'salt crystals!', { size: 30, weight: 700, anchor: 'middle', fill: '#FFFFFF' });

  /* ================= update ================= */
  const TP0 = at('pour'), TC0 = at('cant');
  return t => {
    /* ---- A ---- */
    const aA = Math.min(P(t, S.first - 0.6, 0.6, linear), 1 - P(t, at('filtration') - 0.15, 0.45, linear));
    op(A, aA);
    if (aA > 0) {
      const mixA = P(t, at('physical'), 0.5, linear) * (1 - P(t, mid('physical', 0.3), 0.4, linear));
      op(mixG, mixA); op(mixLbl, mixA);
      const suck = P(t, mid('physical', 0.24), 0.6, easeIn);
      mixP.forEach(m => tr(m.el, lerp(m.x + Math.sin(t * 0.9 + m.ph) * 14 * AMP, 600, suck), lerp(m.y + Math.cos(t * 0.7 + m.ph) * 10 * AMP, 560, suck), 1 - 0.6 * suck));
      const bIn = P(t, at('physical'), 0.6, pop);
      op(box, clamp(bIn * 2)); tr(box, 600, 595 + (1 - clamp(bIn)) * 30);
      const open = P(t, mid('physical', 0.3), 0.6, pop);
      lidL.setAttribute('transform', `rotate(${(-30 * open).toFixed(2)} -194 -70)`);
      lidR.setAttribute('transform', `rotate(${(30 * open).toFixed(2)} 194 -70)`);
      TOOLS.forEach((o, i) => {
        const t0 = mid('physical', 0.36 + i * 0.06), u = P(t, t0, 0.7, ease), sp = P(t, t0, 0.7, pop);
        op(o.ico, P(t, t0, 0.2, linear));
        tr(o.ico, lerp(600 + (i - 1.5) * 50, o.x, u), lerp(540, 246, u) - Math.sin(u * Math.PI) * 30, Math.max(0.01, lerp(0.4, 1, sp)));
        op(o.cardG, P(t, t0 + 0.45, 0.4, linear));
      });
      const ch = P(t, mid('physical', 0.68), 0.5, pop); op(chooseChip, clamp(ch * 2)); tr(chooseChip, 995, 600, Math.max(0.01, 0.85 + 0.15 * ch));
    }

    /* ---- B ---- */
    const aB = win(t, at('filtration') - 0.1, at('evap') + 0.3, 0.45);
    op(B, aB);
    if (aB > 0) {
      op(filHdr, P(t, at('filtration'), 0.5, linear) * (1 - P(t, TP0 - 0.2, 0.4, linear)));
      op(filSub, P(t, mid('filtration', 0.2), 0.5, linear) * (1 - P(t, TP0 - 0.2, 0.4, linear)));
      const rigIn = P(t, mid('filtration', 0.55), 0.6, easeOut);
      op(fun, rigIn); tr(fun, FX, FY - (1 - rigIn) * 30);
      // flask A gets the filtrate from the sandy water; flask B (fresh) the salty filtrate
      const swap = P(t, TC0, 0.5, linear);
      op(flA, rigIn * (1 - swap)); op(flB, swap);
      const lvA = 0.42 * P(t, TP0 + 1.1, at('names') + 1.6 - TP0 - 1.1, linear);
      flA.set(lvA);
      const lvB = 0.36 * P(t, TC0 + 1.6, 3.2, linear);
      flB.set(lvB);
      const surfB = 560 + 1.15 * (92 - 130 * lvB);
      flSp.forEach((s, k) => op(s.el, swap * (s.y > surfB + 6 ? 1 : 0)));
      // sandy water beaker: swirling grains, then lift, tilt and pour
      const bIn = P(t, at('filtration') + 0.1, 0.5, pop);
      const lift = P(t, TP0 + 0.05, 1.3), pour = P(t, TP0 + 1.35, 3.0, linear), bOut = P(t, end('pour') - 0.2, 0.5, linear);
      const cLift = P(t, TC0 + 0.1, 0.9), cPour = P(t, TC0 + 0.9, 2.8, linear), cOut = P(t, at('evap') - 0.6, 0.4, linear);
      const inCant = t >= TC0 - 0.3;
      const tilt = inCant ? cLift : lift, pp = inCant ? cPour : pour;
      const bx = inCant ? lerp(980, 716, cLift) : lerp(880, 716, lift), by = inCant ? lerp(160, 219, cLift) : lerp(500, 219, lift) - Math.sin(lift * Math.PI) * 40;
      const rot = -72 * tilt;
      tr(pb, bx, by, 1, rot);
      const sLvl = tilt < 1 ? lerp(-29.4, 56, tilt) : lerp(56, 120, pp);
      pb.pose(rot, sLvl); attr(cloud, 'y', sLvl);
      op(pb, inCant ? P(t, TC0 - 0.1, 0.4, linear) * (1 - cOut) : clamp(bIn * 2) * (1 - bOut));
      op(cloud, inCant ? 0 : 1); op(sandyLbl, clamp(bIn * 2) * (1 - P(t, TP0, 0.4, linear)));
      // the grains pool towards the lowest corner as the beaker tilts, and leave with the stream
      const gx = lerp(0, 52, tilt), gy = lerp(50, 96, tilt), gs = 1 - 0.55 * tilt;
      pbGrains.forEach(g => {
        const a = g.a + t * g.sp * (S.reduce ? 0.4 : 1.4);
        op(g.el, inCant ? 0 : 1 - pour);
        tr(g.el, gx + Math.cos(a) * g.rad * 0.9 * gs, gy + Math.sin(a) * g.rad * 0.45 * gs, 1, a * 40);
      });
      pbSalt.forEach(s => { op(s.el, inCant ? 1 - P(pp, 0.6, 0.3, linear) : 0); tr(s.el, gx + (s.x + Math.sin(t * 1.4 + s.y) * 6 * AMP) * gs, gy - 40 * (1 - tilt) + s.y * 0.5 * gs); });
      op(saltyChip, inCant ? P(t, TC0 + 0.2, 0.4, linear) * (1 - cOut) : 0);
      // the stream from the spout into the paper
      const sp = rotPt(pb.spout, rot), sx = bx + sp[0], sy = by + sp[1];
      const flowing = tilt >= 1 && pp > 0 && pp < 0.97;
      const flow = flowing ? Math.min(1, pp * 8, (1 - pp) * 6) : 0;
      const ex = FX + 22, ey = FY + 60;
      stream.setAttribute('d', `M${sx.toFixed(1)},${sy.toFixed(1)} Q${(sx - 14).toFixed(1)},${(sy + 30).toFixed(1)} ${ex},${ey}`);
      stream.setAttribute('stroke-width', (3 + 9 * flow).toFixed(2)); op(stream, flow > 0.02 ? 0.9 : 0);
      stream.setAttribute('stroke', inCant ? C.water : MURKY);
      const qb = (u) => { const v = 1 - u; return [v * v * sx + 2 * v * u * (sx - 14) + u * u * ex, v * v * sy + 2 * v * u * (sy + 30) + u * u * ey]; };
      strGrains.forEach((g, k) => { const u = ((t * 1.6) + k / strGrains.length) % 1; const q = qb(u); op(g, !inCant && flow > 0.3 ? 1 : 0); tr(g, q[0], q[1], 1, u * 200); });
      strSalt.forEach((g, k) => { const u = ((t * 1.8) + k / strSalt.length) % 1; const q = qb(u); op(g, inCant && flow > 0.3 ? 1 : 0); tr(g, q[0], q[1]); });
      // liquid in the paper, the residue, and drops from the stem
      const fillA = clamp(P(t, TP0 + 1.5, 1.6, linear) - P(t, TP0 + 4.4, 2.2, linear));
      const fillB = clamp(P(t, TC0 + 1.1, 1.4, linear) - P(t, TC0 + 3.7, 2.0, linear));
      const fl = inCant ? fillB : fillA;
      attr(funLiq, 'y', 112 - 70 * fl); attr(funLiq, 'height', 70 * fl + 2); op(funLiq, fl > 0.01 ? 0.8 : 0);
      funLiq.setAttribute('fill', inCant ? C.water : MURKY);
      const resA = P(t, TP0 + 1.7, 2.6, easeOut) * (1 - P(t, TC0, 0.5, linear));
      op(residue, resA > 0.01 ? Math.min(1, resA * 3) : 0); residue.setAttribute('transform', `translate(0 112) scale(${(0.5 + 0.5 * resA).toFixed(3)} ${(0.2 + 0.8 * resA).toFixed(3)}) translate(0 -112)`);
      const dripOn = (t > TP0 + 1.2 && t < at('names') + 1.6) || (t > TC0 + 1.4 && t < TC0 + 5.6);
      const surf = inCant ? surfB : 560 + 1.15 * (92 - 130 * lvA);
      drops.forEach((d, k) => { const u = ((t / 0.55) + k / 3) % 1; op(d, dripOn && rigIn > 0.9 ? Math.min(1, u * 8) : 0); tr(d, FX + 4, lerp(FY + 202, surf - 4, u * u)); });
      // zoom: fibres, sand grains stuck on top, water (and later salt) slipping through
      const zOn = Math.max(win(t, mid('pour', 0.42), at('names') + 0.2, 0.4), win(t, mid('cant', 0.3), at('evap') + 0.1, 0.4));
      op(zl, zOn); op(zCone, zOn); if (zOn > 0) scaleAt(zl, LX, LY, 0.85 + 0.15 * zOn);
      if (zOn > 0) {
        zWater.forEach(w => { const u = ((t * 0.32 * w.sp) + w.ph) % 1; tr(w.el, w.x + Math.sin(u * 9 + w.ph * 7) * 4, LY - 150 + u * 300); });
        zSalt.forEach(s => { const u = ((t * 0.3 * s.sp) + s.ph) % 1; op(s.el, inCant ? 1 : 0); tr(s.el, s.x + Math.sin(u * 8 + s.ph * 5) * 4, LY - 150 + u * 300, 1, u * 180); });
        zGrains.forEach(g => { const land = P(t, mid('pour', 0.46) + g.k * 0.35, 0.8, easeOut); op(g.el, inCant ? 1 - P(t, TC0, 0.4, linear) : 1); tr(g.el, LX + g.x, lerp(LY - 170, LY - 58, land) + Math.sin(t * 2 + g.k) * 1.2 * AMP, 1, g.k * 40); });
      }
      op(holesLbl, win(t, mid('pour', 0.5), at('names') + 0.1, 0.4));
      op(tooBig, win(t, mid('pour', 0.72), at('names') + 0.1, 0.4));
      op(slipLbl, win(t, mid('cant', 0.4), at('evap') + 0.1, 0.4));
      // names, then "still salty"
      op(lblFiltrate, P(t, mid('names', 0.05), 0.5, linear) * (1 - P(t, TC0 - 0.2, 0.4, linear)));
      op(lblResidue, P(t, mid('names', 0.5), 0.5, linear) * (1 - P(t, TC0 - 0.2, 0.4, linear)));
      const sx2 = P(t, mid('cant', 0.74), 0.5, pop);
      op(lblSalty, clamp(sx2 * 2)); tr(saltyX, SALTYX, 622, Math.max(0.01, sx2));
    }

    /* ---- C: evaporate, crystallise, cool ---- */
    const aC = win(t, at('evap') - 0.1, at('dry') + 0.3, 0.45);
    op(Cv, aC);
    if (aC > 0) {
      const flame = (t > mid('evap', 0.2) && t < at('cool') + 0.25);
      rig.burner.set(flame ? 'blue' : 'off'); rig.burner.upd(t);
      const ev = P(t, mid('evap', 0.38), mid('evap', 0.9) - mid('evap', 0.38), linear);
      const reset = P(t, at('cryst') - 0.1, 0.6, linear);
      const some = P(t, mid('cryst', 0.45), mid('cryst', 0.72) - mid('cryst', 0.45), linear);
      const level = reset > 0 ? lerp(1 - ev, 1 - 0.42 * some, reset) : 1 - ev;
      rig.set(level); rig.crust(P(ev, 0.6, 0.4, linear) * (1 - reset));
      steam.upd(t); op(steam, (t < at('cryst') ? (ev > 0 && ev < 1 ? 0.95 : 0) : (flame && some < 1 ? 0.5 : 0)));
      op(evHdr, P(t, at('evap'), 0.5, linear) * (1 - P(t, at('cryst') - 0.2, 0.4, linear)));
      op(lblBasin, P(t, mid('evap', 0.18), 0.5, linear) * (1 - P(t, at('cryst') - 0.2, 0.4, linear)));
      op(lblEvap, win(t, mid('evap', 0.52), at('cryst'), 0.4)); lblEvap.arrowEl.set(P(t, mid('evap', 0.52), 0.6));
      op(lblSaltLeft, win(t, mid('evap', 0.82), at('cryst'), 0.4));
      op(crHdr, P(t, at('cryst'), 0.5, linear));
      const subOut = 1 - P(t, mid('cryst', 0.68), 0.4, linear);
      op(crSub, P(t, mid('cryst', 0.14), 0.5, linear) * subOut);
      subIcons.forEach((g, i) => { const p = P(t, mid('cryst', 0.2 + i * 0.06), 0.5, pop); op(g, clamp(p * 2) * subOut); tr(g, 0, 0, Math.max(0.01, p), (1 - clamp(p)) * 40); });
      op(heatLbl, win(t, mid('cryst', 0.42), at('cool') + 0.3, 0.4));
      op(offLbl, P(t, at('cool') + 0.3, 0.4, linear) * (1 - P(t, at('dry') - 0.3, 0.3, linear)));
      // glass rod test: dip, lift, tiny crystals, "saturated"
      const dip = P(t, mid('cryst', 0.74), 0.6), up = P(t, mid('cryst', 0.84), 0.6);
      const tipX = lerp(lerp(640, 520, dip), 610, up), tipY = lerp(lerp(250, RY - 296, dip), 318, up);
      op(rod, P(t, mid('cryst', 0.72), 0.3, linear) * (1 - P(t, at('cool') + 0.5, 0.4, linear)));
      tr(rod, tipX, tipY);
      op(rodXtal, P(t, mid('cryst', 0.86), 0.4, linear));
      op(satLbl, P(t, mid('cryst', 0.9), 0.4, linear) * (1 - P(t, at('cool') + 0.5, 0.4, linear)));
      attr(satLbl, 'x', tipX + 30); attr(satLbl, 'y', tipY + 40);
      // cool slowly: clock, crystals grow in the basin and in the zoom
      const cOn = P(t, at('cool') + 0.2, 0.5, linear);
      op(clock, cOn * (1 - P(t, at('dry') - 0.3, 0.3, linear))); op(coolLbl, cOn * (1 - P(t, at('dry') - 0.3, 0.3, linear)));
      const ct = Math.max(0, t - at('cool'));
      hHand.setAttribute('transform', `rotate(${(ct * 30).toFixed(1)})`); mHand.setAttribute('transform', `rotate(${(ct * 360 / 1.6).toFixed(1)})`);
      const grow = P(t, mid('cool', 0.3), mid('cool', 1) + 0.4 - mid('cool', 0.3), easeOut);
      bXtal.forEach(x => { const gk = clamp(grow * 1.3 - x.k * 0.06); op(x.g, gk > 0.02 ? 1 : 0); tr(x.g, x.x, x.y, Math.max(0.01, gk)); });
      const czOn = P(t, mid('cool', 0.22), 0.5, linear);
      op(cz, czOn); op(czCone, czOn); if (czOn > 0) scaleAt(cz, CX2, CY2, 0.85 + 0.15 * czOn);
      zX.forEach(x => { const gk = clamp(grow * 1.25 - x.k * 0.05); op(x.g, gk > 0.02 ? 1 : 0); tr(x.g, x.x, x.y, Math.max(0.01, gk)); });
      zSol.forEach(s => {
        const u = ((t - mid('cool', 0.3)) * 0.45 + s.ph) % 1, on = t > mid('cool', 0.3) && grow < 1;
        const x = s.tgt.x + Math.cos(s.a) * s.d * (1 - u), y = s.tgt.y + Math.sin(s.a) * s.d * (1 - u);
        op(s.el, on ? Math.min(1, u * 5) * (1 - P(u, 0.8, 0.2, linear)) : 0); tr(s.el, x, y, 1, u * 90);
      });
      op(growLbl, P(t, mid('cool', 0.62), 0.5, linear));
    }

    /* ---- D: filter off, pat dry, somewhere warm ---- */
    const aD = win(t, at('dry') - 0.1, at('key') + 0.3, 0.45);
    op(Dg, aD);
    if (aD > 0) {
      const p1 = P(t, at('dry'), 0.5, pop);
      op(dFl, clamp(p1 * 2)); op(dFun, clamp(p1 * 2)); tr(dFun, 270, 356 - (1 - clamp(p1)) * 20, 0.72);
      const du = (t / 0.7) % 1; op(dDrop, t < mid('dry', 0.5) ? Math.min(1, du * 8) * clamp(p1 * 2) : 0); tr(dDrop, 274, lerp(356 + 144, 572 + 0.9 * (92 - 130 * 0.42) - 4, du * du));
      op(dLbl1, P(t, at('dry') + 0.3, 0.4, linear));
      const p2 = P(t, mid('dry', 0.3), 0.5, easeOut);
      op(sheets, p2); tr(sheets, 690, 540 + (1 - p2) * 20);
      const patT = [mid('dry', 0.44), mid('dry', 0.58)];
      const pat = Math.max(...patT.map(tp => Math.sin(Math.PI * P(t, tp, 0.55, linear))));
      const down = P(t, mid('dry', 0.38), 0.3, linear) * (1 - P(t, mid('dry', 0.7), 0.4, linear));
      op(topSheet, down); topSheet.setAttribute('transform', `translate(0 ${(-70 + 52 * pat).toFixed(1)})`);
      op(dampG, down * P(t, patT[0] + 0.3, 0.3, linear)); dampG.setAttribute('transform', `translate(0 ${(-70 + 52 * pat).toFixed(1)})`);
      const dry = P(t, patT[0] + 0.2, 1.4, linear);
      wet.forEach(w => op(w, 0.55 * (1 - dry)));
      op(dLbl2, P(t, mid('dry', 0.4), 0.4, linear));
      const p3 = P(t, mid('dry', 0.76), 0.5, easeOut);
      op(warmG, p3); sunArt.upd(t); warmWaves.upd(t); op(dLbl3, P(t, mid('dry', 0.8), 0.4, linear));
    }

    /* ---- E: key ---- */
    const aK = win(t, at('key') - 0.1, at('home') + 0.3, 0.45);
    op(Kg, aK);
    if (aK > 0) {
      const pl = P(t, at('key') + 0.05, 0.6, pop), pr = P(t, mid('key', 0.5), 0.6, pop);
      op(kL, clamp(pl * 2)); tr(kL, 0, (1 - clamp(pl)) * 24);
      op(kR, clamp(pr * 2)); tr(kR, 0, (1 - clamp(pr)) * 24);
    }

    /* ---- F: home ---- */
    const aH = P(t, at('home') - 0.1, 0.45, linear);
    op(Hg, aH);
    if (aH > 0) {
      op(homeChip, P(t, at('home'), 0.4, linear));
      const s1 = P(t, at('home') + 0.15, 0.5, pop), s2 = P(t, mid('home', 0.3), 0.5, pop), s3 = P(t, mid('home', 0.5), 0.5, pop);
      [[mugG, 220, 440, s1], [cfG, 600, 0, s2], [plG, 980, 500, s3]].forEach(([g, x, y, p]) => { op(g, clamp(p * 2)); tr(g, x, y + (1 - clamp(p)) * 20); });
      steps.forEach((g, i) => op(g, [s1, s2, s3][i] > 0 ? P(t, [at('home') + 0.3, mid('home', 0.32), mid('home', 0.52)][i], 0.4, linear) : 0));
      homeArrows[0].set(P(t, mid('home', 0.26), 0.5)); op(homeArrows[0], P(t, mid('home', 0.26), 0.2, linear));
      homeArrows[1].set(P(t, mid('home', 0.46), 0.5)); op(homeArrows[1], P(t, mid('home', 0.46), 0.2, linear));
      const st = t * (S.reduce ? 2 : 4.5);
      mugSpoon.setAttribute('transform', `translate(${(Math.sin(st) * 22).toFixed(1)} -70) rotate(${(Math.sin(st) * 6).toFixed(1)})`);
      mugGr.forEach((m, k) => { const a = m.a + st * 0.5; tr(m.el, Math.cos(a) * m.rr * 0.9, -74 + Math.sin(a) * 6, 1, a * 50); });
      mugSteam.upd(t);
      const cd = ((t - mid('home', 0.3)) / 0.8) % 1; op(cfDrop, t > mid('home', 0.34) ? Math.min(1, cd * 8) : 0); tr(cfDrop, 0, lerp(476, 540, cd * cd));
      attr(jarLiq, 'y', 540 - 20 * P(t, mid('home', 0.34), 3, linear)); attr(jarLiq, 'height', 30 + 20 * P(t, mid('home', 0.34), 3, linear));
      // a day or two: sun, moon, sun, moon
      const dOn = P(t, mid('home', 0.66), 0.4, linear); op(dn, dOn);
      // two days: sun, moon, sun, moon
      const cyc = Math.min(3.999, P(t, mid('home', 0.7), mid('home', 0.94) - mid('home', 0.7), linear) * 4);
      const unit = Math.floor(cyc), fx = clamp((cyc - unit) * 4), night = unit % 2 === 1;
      op(dnSun, unit === 0 ? 1 : night ? 1 - fx : fx); op(dnMoon, unit === 0 ? 0 : night ? fx : 1 - fx);
      dnSunArt.upd(t);
      setText(dnCount, unit < 2 ? 'day 1' : 'day 2');
      op(dnCount, dOn);
      const dry = P(t, mid('home', 0.72), mid('home', 0.96) - mid('home', 0.72), linear);
      op(film, 0.35 * (1 - dry));
      plX.forEach(x => { const gk = clamp(dry * 1.5 - x.k * 0.06); op(x.g, gk > 0.02 ? 1 : 0); tr(x.g, x.x, x.y, Math.max(0.01, gk)); });
      op(xtalLbl, P(t, mid('home', 0.93), 0.4, linear));
    }
  };
});
