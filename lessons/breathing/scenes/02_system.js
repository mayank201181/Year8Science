/* Chapter 2: The parts of the respiratory system.
   The airway tree on the left, inside a faint outline of the body; close-up insets on the right.
   Beats: branching tubes, like an upside-down tree -> the nose warms, moistens and filters -> the trachea
   -> its C-shaped rings of cartilage -> goblet cells make mucus -> cilia sweep it -> showpiece: the mucus
   escalator -> two bronchi -> bronchioles branch again and again -> alveoli at the tips -> 300 to 500
   million -> Tall Brontosaurs Breathe Air -> the chest builds round the airway: lungs, ribs, intercostal
   muscles, diaphragm -> the pleural membranes. */
scene('system', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;

  /* ---------- shared breathing art (same in every chapter of this lesson) ---------- */
  const SKIN = '#C98E62', SKINDK = '#9C6B45', HAIR = '#2B1D14';
  const TUBE = '#E9C7D2', TUBEDK = '#C99AAA', MUSCLE = '#D24B63', MUSCLELT = '#F59AAE', BONE = '#EFE6D2';
  const ALV = '#BFE6FF', ALVDK = '#5FA8D8', CART = '#EEF4F8', MUCUS = '#D6E58A', MUCUSDK = '#9FB447';

  /* The chest, front view, in "lungs units" (lib lungs at s=1 centred on 0,0). g.set(v): 0 relaxed, 1 in. */
  function chestArt(parent) {
    const g = G(parent);
    const lw = g.lw = G(g);
    g.lungs = lungs(lw, 1);
    g.bands = G(g); g.ribs = G(g); g.dia = G(g);
    const R = [], B = [];
    for (const sg of [-1, 1]) for (let i = 0; i < 4; i++) B.push({ sg, i, el: E('path', { fill: MUSCLE, opacity: 0.5 }, g.bands) });
    for (const sg of [-1, 1]) for (let i = 0; i < 5; i++) R.push({ sg, i, el: E('path', { fill: 'none', stroke: BONE, 'stroke-width': 9, 'stroke-linecap': 'round' }, g.ribs) });
    g.ribEls = R.map(r => r.el);
    g.diaBody = E('path', { fill: 'none', stroke: MUSCLE, 'stroke-width': 16, 'stroke-linecap': 'round' }, g.dia);
    g.diaHi = E('path', { fill: 'none', stroke: MUSCLELT, 'stroke-width': 4, 'stroke-linecap': 'round', opacity: 0.85, transform: 'translate(0 -4)' }, g.dia);
    const rib = (sg, i, v) => { const y0 = -88 + 46 * i; return [[sg * 30, y0], [sg * (150 + 8 * i + 8 * v), y0 - 28 - 10 * v], [sg * (178 + 6 * i + 12 * v), y0 + 46 - 16 * v]]; };
    const f = n => n.toFixed(1);
    const q = r => `M${f(r[0][0])},${f(r[0][1])} Q${f(r[1][0])},${f(r[1][1])} ${f(r[2][0])},${f(r[2][1])}`;
    g.domeD = v => `M${f(-190 - 6 * v)},${f(205 - 4 * v)} C-120,${f(132 + 52 * v)} 120,${f(132 + 52 * v)} ${f(190 + 6 * v)},${f(205 - 4 * v)}`;
    g.set = v => {
      v = clamp(v);
      g.lungs.set(v);
      lw.setAttribute('transform', `translate(0 -150) scale(1 ${(1 + 0.1 * v).toFixed(4)}) translate(0 150)`);
      R.forEach(r => r.el.setAttribute('d', q(rib(r.sg, r.i, v))));
      B.forEach(b => { const a = rib(b.sg, b.i, v), c = rib(b.sg, b.i + 1, v); b.el.setAttribute('d', `${q(a)} L${f(c[2][0])},${f(c[2][1])} Q${f(c[1][0])},${f(c[1][1])} ${f(c[0][0])},${f(c[0][1])} Z`); });
      const d = g.domeD(v); g.diaBody.setAttribute('d', d); g.diaHi.setAttribute('d', d);
    };
    g.set(0);
    return g;
  }

  /* ---------- local helpers ---------- */
  const hex = c => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16));
  const mix = (a, b, p) => { const A = hex(a), B = hex(b); return `rgb(${A.map((v, i) => Math.round(lerp(v, B[i], clamp(p)))).join(',')})`; };
  function along(pts, u) {
    let L = 0; const seg = [];
    for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(l); L += l; }
    let d = clamp(u) * L;
    for (let i = 0; i < seg.length; i++) { if (d <= seg[i] || i === seg.length - 1) { const k = seg[i] ? clamp(d / seg[i]) : 0; return [lerp(pts[i][0], pts[i + 1][0], k), lerp(pts[i][1], pts[i + 1][1], k)]; } d -= seg[i]; }
    return pts[pts.length - 1];
  }
  function rich(parent, x, y, segs, o) {
    o = o || {};
    const t = E('text', { x, y, 'font-size': o.size || 30, 'font-weight': o.weight || 600, 'font-family': o.font || FD, 'text-anchor': o.anchor || 'start', fill: o.fill || C.ink }, parent);
    segs.forEach(s => { if (typeof s === 'string') s = [s]; E('tspan', { fill: s[1], 'font-weight': s[2] }, t).textContent = s[0]; });
    return t;
  }
  function leader(parent, x1, y1, x2, y2, color) {
    const g = G(parent);
    E('line', { x1, y1, x2, y2, stroke: color || C.muted, 'stroke-width': 2.5, 'stroke-linecap': 'round' }, g);
    E('circle', { cx: x2, cy: y2, r: 4.5, fill: color || C.muted }, g);
    return g;
  }
  const circ = (x, y, r) => `M${(x + r).toFixed(1)},${y.toFixed(1)} A${r},${r} 0 1 0 ${(x - r).toFixed(1)},${y.toFixed(1)} A${r},${r} 0 1 0 ${(x + r).toFixed(1)},${y.toFixed(1)}Z`;
  function frame(parent, x, y, w, h, id) {
    card(parent, x, y, w, h, { fill: C.card, stroke: C.line, sw: 2.5 });
    const cp = E('clipPath', { id }, defs()); E('rect', { x: x + 2, y: y + 2, width: w - 4, height: h - 4, rx: 20 }, cp);
    return G(parent, { 'clip-path': `url(#${id})` });
  }
  const popIn = (el, t, t0, x, y, s0) => { const p = P(t, t0, 0.5, pop); op(el, clamp(p * 2)); tr(el, x, y, Math.max(0.01, (s0 === undefined ? 0.6 : s0) + (1 - (s0 === undefined ? 0.6 : s0)) * p)); return p; };
  const dash = (el, p) => el.setAttribute('stroke-dashoffset', (1 - clamp(p)).toFixed(4));

  /* ================= the body and its airway tree (left half) ================= */
  const BX = 300, BY = 468, LS = 1.37;
  const toS = (x, y) => [BX + x * LS, BY + y * LS];
  // the view pulls back to 0.8 as the chest builds, so the ribs and diaphragm fit: ZP() maps to that view
  const ZC = [300, 168], ZF = 0.8;
  const ZP = p => [ZC[0] + (p[0] - ZC[0]) * ZF, ZC[1] + (p[1] - ZC[1]) * ZF];
  const world = G(root);
  const body = G(world);
  const bodyLine = { fill: 'rgba(159,216,255,0.05)', stroke: '#3E6678', 'stroke-width': 3 };
  E('path', Object.assign({ d: 'M272,226 L272,284 C232,290 142,298 108,328 C86,348 80,398 78,460 L74,780 L526,780 L522,460 C520,398 514,348 492,328 C458,298 368,290 328,284 L328,226' }, bodyLine), body);
  E('ellipse', Object.assign({ cx: 300, cy: 168, rx: 56, ry: 62 }, bodyLine), body);
  const face = G(body);
  [282, 318].forEach(x => E('circle', { cx: x, cy: 160, r: 4.5, fill: '#5E8597' }, face));
  const noseL = E('path', { d: 'M296,170 Q292,186 300,188 Q308,186 304,170', fill: 'none', stroke: '#5E8597', 'stroke-width': 3, 'stroke-linecap': 'round' }, face);
  const mouthL = E('path', { d: 'M286,204 Q300,212 314,204', fill: 'none', stroke: '#5E8597', 'stroke-width': 3, 'stroke-linecap': 'round' }, face);
  const faceGlow = [E('circle', { cx: 300, cy: 184, r: 26, fill: glow(C.air) }, face), E('circle', { cx: 300, cy: 206, r: 24, fill: glow(C.air) }, face)];

  const treeG = G(world); tr(treeG, BX, BY, LS);
  const ch = chestArt(treeG);
  ch.bandEls = [...ch.bands.children]; ch.bandEls.forEach(e => e.setAttribute('opacity', 0.4));
  // the lib lungs draw their own windpipe and bronchi: this chapter draws a fuller airway on top
  { const inner = ch.lungs.firstChild, kids = [...inner.children]; kids.slice(0, 6).forEach(e => op(e, 0)); op(kids[6].children[1], 0); op(kids[7].children[1], 0);
    // the pleural membrane round each lung, used on the last line
    const LOBE = 'M-30,-70 C-70,-90 -128,-40 -132,40 C-136,110 -112,150 -70,152 C-40,154 -22,130 -20,90 C-18,40 -10,-20 -30,-70 Z';
    ch.pleura = [kids[6], kids[7]].map((side, i) => E('path', { d: LOBE, fill: 'none', stroke: '#CFEFFF', 'stroke-width': 3.5, transform: (i ? 'scale(-1 1) ' : '') + 'translate(-76 40) scale(1.045) translate(76 -40)' }, side)); }
  const air = G(); ch.insertBefore(air, ch.bands);     // airway layers sit between the lungs and the ribs

  // branches, left half in lungs units (mirrored for the right): [generation, points]
  const HALF = [
    [1, [[0, -60], [-20, -44], [-46, -22]]],
    [2, [[-46, -22], [-56, -30], [-62, -36]]], [2, [[-46, -22], [-64, -4], [-78, 12]]], [2, [[-46, -22], [-50, 14], [-54, 46]]],
    [3, [[-62, -36], [-54, -50]]], [3, [[-62, -36], [-88, -30]]], [3, [[-78, 12], [-104, 12]]], [3, [[-78, 12], [-94, 58]]], [3, [[-54, 46], [-74, 92]]], [3, [[-54, 46], [-44, 82]]],
    [4, [[-54, -50], [-44, -58]]], [4, [[-54, -50], [-62, -56]]], [4, [[-88, -30], [-88, -41]]], [4, [[-88, -30], [-103, -17]]],
    [4, [[-104, 12], [-112, 2]]], [4, [[-104, 12], [-116, 30]]], [4, [[-94, 58], [-112, 70]]], [4, [[-94, 58], [-100, 94]]],
    [4, [[-74, 92], [-88, 118]]], [4, [[-74, 92], [-66, 128]]], [4, [[-44, 82], [-36, 108]]], [4, [[-44, 82], [-33, 77]]],
  ];
  const BR = [[0, [[0, -161], [0, -60]]]];
  [-1, 1].forEach(sg => HALF.forEach(([gN, pts]) => BR.push([gN, pts.map(p => [p[0] * -sg, p[1]])])));
  const TIPS = BR.filter(b => b[0] === 4).map(b => { const p = b[1], a = p[p.length - 2], e = p[p.length - 1], L = Math.hypot(e[0] - a[0], e[1] - a[1]); return [e[0] + (e[0] - a[0]) / L * 4, e[1] + (e[1] - a[1]) / L * 4]; });
  const WIDE = [26, 18, 12, 8, 5];
  const pathOf = pts => pts.length > 2 ? openPath(pts) : `M${pts[0][0]},${pts[0][1]} L${pts[1][0]},${pts[1][1]}`;
  // ghost outline, one path per generation (it also morphs into an upside-down tree)
  const ghost = [0, 1, 2, 3, 4].map(gN => E('path', { d: BR.filter(b => b[0] === gN).map(b => pathOf(b[1])).join(' '), fill: 'none', stroke: '#5E8597', 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, air));
  const ghostTips = E('path', { d: TIPS.map(p => circ(p[0], p[1], 6)).join(' '), fill: 'none', stroke: '#5E8597', 'stroke-width': 2.2 }, air);
  const leaves = E('path', { d: TIPS.map((p, i) => circ(p[0] + (i % 3 - 1) * 3, p[1] + 4, 15)).join(' '), fill: C.plant, stroke: C.plantDk, 'stroke-width': 2 }, air);
  // the inked airway, drawn in by generation: every outline first, then every fill, so joints are seamless
  const glowB = [-1, 1].map(sg => E('path', { d: pathOf([[0, -60], [sg * 20, -44], [sg * 46, -22]]), fill: 'none', stroke: C.energy, 'stroke-width': 30, 'stroke-linecap': 'round', opacity: 0.35 }, air));
  const inkO = G(air), inkI = G(air);
  const ink = BR.map(([gN, pts]) => {
    const d = pathOf(pts), w = WIDE[gN];
    const o = E('path', { d, fill: 'none', stroke: TUBEDK, 'stroke-width': w + 5, 'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': '1 1' }, inkO);
    const i = E('path', { d, fill: 'none', stroke: TUBE, 'stroke-width': w, 'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': '1 1' }, inkI);
    return { gN, o, i };
  });
  // C-shaped cartilage rings along the trachea
  const rings = [];
  for (let k = 0; k < 7; k++) { const y = -146 + k * 13.5; rings.push(E('path', { d: `M-12.5,${y - 2} Q0,${y + 4} 12.5,${y - 2}`, fill: 'none', stroke: CART, 'stroke-width': 4.5, 'stroke-linecap': 'round' }, air)); }
  // alveoli: grape clusters at the tips, and more that bud along the branches for "300 to 500 million"
  const grape = (x, y, r) => [[0, 0], [-1, 0.8], [1, 0.8], [0, 1.6], [-0.9, -0.85], [0.9, -0.85]].map(([dx, dy]) => circ(x + dx * r * 1.25, y + dy * r * 1.15, r)).join(' ');
  const clusters = TIPS.map(([x, y]) => ({ g: E('path', { d: grape(0, 0, 4.2), fill: ALV, stroke: ALVDK, 'stroke-width': 1.3 }, air), x, y }));
  const buds = [];
  BR.filter(b => b[0] === 4 || b[0] === 3).forEach(([gN, pts], k) => {
    const a = pts[0], e = pts[pts.length - 1], m = [lerp(a[0], e[0], 0.55), lerp(a[1], e[1], 0.55)], L = Math.hypot(e[0] - a[0], e[1] - a[1]) || 1, side = k % 2 ? 1 : -1;
    const x = m[0] - (e[1] - a[1]) / L * 7 * side, y = m[1] + (e[0] - a[0]) / L * 7 * side;
    const g = E('path', { d: [[0, 0], [-0.9, 0.9], [0.9, 0.9]].map(([dx, dy]) => circ(dx * 4.2, dy * 4, 3.6)).join(' '), fill: ALV, stroke: ALVDK, 'stroke-width': 1.1 }, air);
    buds.push({ g, x, y, d: rng(k + 3)() });
  });
  // air reaching deep into the chest: dots that run down the airway to the tips
  const AIRWAY = [[[0, -175], [0, -60], [-20, -44], [-46, -22], [-64, -4], [-78, 12], [-104, 12], [-116, 30]],
    [[0, -175], [0, -60], [20, -44], [46, -22], [50, 14], [54, 46], [74, 92], [88, 118]],
    [[0, -175], [0, -60], [-20, -44], [-46, -22], [-50, 14], [-54, 46], [-44, 82], [-36, 108]],
    [[0, -175], [0, -60], [20, -44], [46, -22], [56, -30], [62, -36], [88, -30], [103, -17]]];
  const airRun = [0, 1, 2, 3, 4, 5, 6, 7].map(() => E('circle', { r: 4.2, fill: C.air, stroke: '#FFFFFF', 'stroke-width': 1.2 }, air));
  // the chest parts get pathLength so the ribs can wrap round from the breastbone
  ch.ribEls.forEach(e => { e.setAttribute('pathLength', 1); e.setAttribute('stroke-dasharray', '1 1'); });

  /* ================= tree: an upright tree that turns upside down ================= */
  const treeIcon = G(root);
  E('ellipse', { cx: 0, cy: 118, rx: 90, ry: 12, fill: C.soil, opacity: 0.8 }, treeIcon);
  E('path', { d: 'M-12,118 L-9,10 L9,10 L12,118 Z', fill: '#9C6B45', stroke: '#C49470', 'stroke-width': 2 }, treeIcon);
  E('path', { d: 'M-4,40 L-40,0 M4,56 L42,16 M0,20 L0,-30', stroke: '#8A5A3C', 'stroke-width': 8, 'stroke-linecap': 'round' }, treeIcon);
  [[-50, -24, 46], [50, -20, 46], [0, -64, 58], [-22, 6, 36], [26, 8, 36]].forEach(([x, y, r]) => E('circle', { cx: x, cy: y, r, fill: ball(C.plant, C.plantDk), stroke: '#9EF0B4', 'stroke-width': 2 }, treeIcon));

  /* ================= nose: the head in profile ================= */
  const noseG = G(root);
  const nIn = frame(noseG, 620, 118, 530, 352, 'br-sys-nose');
  const O = [792, 318];
  const head = G(nIn); tr(head, O[0], O[1], 1.2);
  E('path', { d: 'M-20,190 L-28,104 C-68,92 -92,50 -90,0 C-88,-86 -40,-136 26,-140 C86,-144 122,-104 124,-54 C125,-42 132,-32 142,-16 Q152,-2 136,4 C130,6 126,8 124,14 C124,22 120,26 118,32 L113,36 C120,40 122,46 120,52 C120,66 122,76 108,88 C96,98 82,102 72,108 L72,190 Z', fill: SKIN, stroke: SKINDK, 'stroke-width': 3, 'stroke-linejoin': 'round' }, head);
  E('path', { d: 'M-90,0 C-88,-86 -40,-136 26,-140 C86,-144 122,-104 124,-62 C102,-92 62,-108 22,-104 C-28,-100 -58,-66 -64,-24 C-68,-4 -78,8 -90,0 Z', fill: HAIR }, head);
  E('path', { d: 'M-40,-26 C-58,-28 -60,10 -42,12', fill: 'none', stroke: SKINDK, 'stroke-width': 5, 'stroke-linecap': 'round' }, head);
  E('circle', { cx: 92, cy: -48, r: 7, fill: '#2A1D14' }, head);
  E('circle', { cx: 94.5, cy: -50.5, r: 2.2, fill: '#FFFFFF' }, head);
  E('path', { d: 'M80,-66 Q94,-72 108,-64', fill: 'none', stroke: HAIR, 'stroke-width': 4, 'stroke-linecap': 'round' }, head);
  E('path', { d: 'M124,15 C123,24 120,29 115,34 C121,40 122,46 120,51', fill: 'none', stroke: '#A8584C', 'stroke-width': 5, 'stroke-linecap': 'round' }, head);
  E('path', { d: 'M100,37 L115,35', fill: 'none', stroke: '#6E2E28', 'stroke-width': 3, 'stroke-linecap': 'round' }, head);
  E('ellipse', { cx: 92, cy: 8, rx: 15, ry: 10, fill: '#E8848A', opacity: 0.35 }, head);
  const NASAL = [[136, 0], [104, -10], [60, -14], [22, -6], [6, 24], [6, 80], [12, 190]];
  const ORAL = [[114, 38], [80, 42], [40, 44], [8, 46]];
  E('path', { d: openPath(NASAL), fill: 'none', stroke: TUBEDK, 'stroke-width': 26, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, head);
  const mouthWay = G(head);
  E('path', { d: openPath(ORAL), fill: 'none', stroke: TUBEDK, 'stroke-width': 18, 'stroke-linecap': 'round' }, mouthWay);
  E('path', { d: openPath(ORAL), fill: 'none', stroke: TUBE, 'stroke-width': 12, 'stroke-linecap': 'round' }, mouthWay);
  E('path', { d: openPath(NASAL), fill: 'none', stroke: TUBE, 'stroke-width': 20, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, head);
  const warmGlow = E('ellipse', { cx: 70, cy: -10, rx: 70, ry: 30, fill: glow(C.heat) }, head);
  const drops = [[96, -16], [66, -20], [38, -12]].map(([x, y]) => E('path', { d: `M${x},${y - 7} C${x + 4},${y - 1} ${x + 6},${y + 3} ${x + 6},${y + 5} A6,6 0 0 1 ${x - 6},${y + 5} C${x - 6},${y + 3} ${x - 4},${y - 1} ${x},${y - 7} Z`, fill: C.water, stroke: '#BFEFFF', 'stroke-width': 1.5 }, head));
  const hairs = E('path', { d: 'M128,-8 L120,-2 M132,-6 L126,2 M128,10 L122,4 M134,8 L126,6 M124,-10 L118,-4', stroke: '#3A2A20', 'stroke-width': 2.5, 'stroke-linecap': 'round' }, head);
  const dusts = [[121, -2], [127, 6], [117, 8]].map(([x, y]) => E('circle', { cx: x, cy: y, r: 4, fill: '#8C96A0', stroke: '#C9D1D8', 'stroke-width': 1.2 }, head));
  const AIRIN = [[260, -6], [180, -2], ...NASAL];
  const airDots = [0, 1, 2, 3, 4, 5].map(() => E('circle', { r: 5.5, fill: C.air, stroke: '#FFFFFF', 'stroke-width': 1.5 }, head));
  const orArrow = arrow(head, 196, 46, 128, 40, { color: C.air, width: 5 });
  const best = G(head); E('circle', { r: 20, fill: C.good }, best); tick(best, 10, C.bg0); tr(best, 150, -40);
  const bestLab = T(head, 176, -32, 'best', { size: 26, weight: 700, fill: C.good });
  const NICON = [[720, 'warms', C.heat], [885, 'moistens', C.water], [1050, 'filters', '#C9D1D8']].map(([x, label, col], i) => {
    const g = G(noseG); tr(g, x, 532);
    E('circle', { r: 36, fill: C.card2, stroke: C.line, 'stroke-width': 2.5 }, g);
    let anim = null;
    if (i === 0) { anim = heatWaves(g, { n: 3, h: 44, spacing: 14, width: 4.5 }); tr(anim, 0, 20); }
    else if (i === 1) [[-14, 4], [0, -8], [14, 6]].forEach(([dx, dy]) => E('path', { d: `M${dx},${dy - 10} C${dx + 5},${dy - 2} ${dx + 8},${dy + 3} ${dx + 8},${dy + 6} A8,8 0 0 1 ${dx - 8},${dy + 6} C${dx - 8},${dy + 3} ${dx - 5},${dy - 2} ${dx},${dy - 10} Z`, fill: C.water, stroke: '#BFEFFF', 'stroke-width': 1.5 }, g));
    else { E('path', { d: 'M-18,14 L-10,-14 M-6,16 L-2,-16 M6,16 L4,-16 M18,14 L12,-14', stroke: '#C9B79C', 'stroke-width': 3.5, 'stroke-linecap': 'round' }, g); [[-9, -2], [3, 6], [11, -6]].forEach(([dx, dy]) => E('circle', { cx: dx, cy: dy, r: 4.5, fill: '#8C96A0', stroke: '#E2E7EC', 'stroke-width': 1.2 }, g)); }
    T(g, 0, 70, label, { size: 28, weight: 700, anchor: 'middle', fill: col });
    return { g, anim, x };
  });

  /* ================= trachea label ================= */
  const trLab = G(root);
  leader(trLab, 612, 300, 322, 300);
  T(trLab, 622, 310, 'trachea', { size: 38, weight: 700, fill: '#F4D8E1' });
  T(trLab, 622, 348, '(windpipe)', { size: 30, weight: 600, fill: C.muted });

  /* ================= cartilage: a cross-section of the trachea ================= */
  const cartG = G(root);
  const cIn = frame(cartG, 620, 118, 530, 400, 'br-sys-cart');
  const RC = [800, 300];
  const arcD = (c, r, a0, a1) => { const p0 = [c[0] + r * Math.cos(a0 * Math.PI / 180), c[1] + r * Math.sin(a0 * Math.PI / 180)], p1 = [c[0] + r * Math.cos(a1 * Math.PI / 180), c[1] + r * Math.sin(a1 * Math.PI / 180)]; return `M${p0[0].toFixed(1)},${p0[1].toFixed(1)} A${r},${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${p1[0].toFixed(1)},${p1[1].toFixed(1)}`; };
  E('circle', { cx: RC[0], cy: RC[1], r: 104, fill: 'rgba(233,199,210,0.16)', stroke: TUBEDK, 'stroke-width': 2.5 }, cIn);
  E('circle', { cx: RC[0], cy: RC[1], r: 70, fill: TUBE, stroke: TUBEDK, 'stroke-width': 2.5 }, cIn);
  E('circle', { cx: RC[0], cy: RC[1], r: 54, fill: '#0D2330' }, cIn);
  E('path', { d: arcD(RC, 86, -38, 38), fill: 'none', stroke: MUSCLE, 'stroke-width': 10, 'stroke-linecap': 'round' }, cIn);
  E('path', { d: arcD(RC, 86, 40, 320), fill: 'none', stroke: '#9FB2C0', 'stroke-width': 28, 'stroke-linecap': 'round' }, cIn);
  E('path', { d: arcD(RC, 86, 40, 320), fill: 'none', stroke: CART, 'stroke-width': 22, 'stroke-linecap': 'round' }, cIn);
  const cAir = [0, 1, 2, 3, 4].map(() => E('circle', { r: 6, fill: C.air }, cIn));
  const cLab = G(cIn);
  T(cLab, RC[0], 448, 'C-shaped ring', { size: 30, weight: 700, anchor: 'middle', fill: CART });
  T(cLab, RC[0], 484, 'of cartilage', { size: 28, weight: 600, anchor: 'middle', fill: C.muted });
  const soft = G(cIn); tr(soft, 1036, 300);
  const softOuter = E('ellipse', { rx: 62, ry: 62, fill: TUBE, stroke: TUBEDK, 'stroke-width': 2.5 }, soft);
  const softIn = E('ellipse', { rx: 44, ry: 44, fill: '#0D2330' }, soft);
  const sLab = G(cIn);
  T(sLab, 1036, 448, 'with no ring', { size: 28, weight: 700, anchor: 'middle', fill: C.ink });
  T(sLab, 1036, 484, 'it would collapse', { size: 28, weight: 600, anchor: 'middle', fill: C.muted });
  const sCross = cross(cIn, 16); const cTick = tick(cIn, 16);
  const squeeze = G(cIn);
  [[RC, 128], [[1036, 300], 92]].forEach(([c, r]) => [45, 135, 225, 315].forEach(a => { const k = Math.PI / 180, x = c[0] + Math.cos(a * k) * r, y = c[1] + Math.sin(a * k) * r, x2 = c[0] + Math.cos(a * k) * (r - 22), y2 = c[1] + Math.sin(a * k) * (r - 22); arrow(squeeze, x, y, x2, y2, { color: C.muted, width: 4 }); }));

  /* ================= the airway lining: goblet cells, cilia, the mucus escalator ================= */
  const linG = G(root);
  const callout = G(linG);
  E('circle', { cx: 318, cy: 330, r: 18, fill: 'none', stroke: C.energy, 'stroke-width': 3 }, callout);
  E('path', { d: 'M332,320 L640,124 M332,340 L640,626', stroke: C.energy, 'stroke-width': 2, 'stroke-dasharray': '7 7', opacity: 0.6 }, callout);
  const lIn = frame(linG, 640, 120, 260, 510, 'br-sys-lining');
  E('rect', { x: 640, y: 120, width: 24, height: 510, fill: '#7A3E52', opacity: 0.6 }, lIn);
  const KIND = ['c', 'g', 'c', 'c', 'g', 'c', 'c'];
  const cilia = [], gobCups = [];
  KIND.forEach((kd, k) => {
    const y = 126 + 72 * k;
    E('rect', { x: 664, y: y + 1, width: 86, height: 69, rx: 14, fill: kd === 'g' ? '#EBC5CF' : '#F2B6C6', stroke: '#C9788F', 'stroke-width': 2.5 }, lIn);
    if (kd === 'g') {
      E('ellipse', { cx: 678, cy: y + 36, rx: 8, ry: 13, fill: '#9B7FD6', opacity: 0.85 }, lIn);
      gobCups.push(E('path', { d: `M690,${y + 36} C690,${y + 14} 724,${y + 10} 738,${y + 24} L752,${y + 27} L752,${y + 45} L738,${y + 48} C724,${y + 62} 690,${y + 58} 690,${y + 36} Z`, fill: MUCUS, stroke: MUCUSDK, 'stroke-width': 2 }, lIn));
    } else {
      E('ellipse', { cx: 702, cy: y + 36, rx: 15, ry: 11, fill: '#9B7FD6', opacity: 0.85 }, lIn);
      for (let j = 0; j < 6; j++) cilia.push({ el: E('line', { x1: 751, y1: y + 10 + j * 10.4, stroke: '#F7DCE5', 'stroke-width': 3, 'stroke-linecap': 'round' }, lIn), y: y + 10 + j * 10.4 });
    }
  });
  const MX0 = 778, MW = 30;
  const mucA = E('rect', { x: MX0, width: MW, rx: 12, fill: MUCUS, opacity: 0.75 }, lIn), mucB = E('rect', { x: MX0, width: MW, rx: 12, fill: MUCUS, opacity: 0.75 }, lIn);
  const streaks = [0, 1, 2, 3, 4, 5, 6].map(() => E('ellipse', { rx: 5, ry: 22, fill: '#F1F8C8', opacity: 0.55 }, lIn));
  const GOBY = [126 + 72 + 36, 126 + 288 + 36];
  const dr = rng(52);
  const dirt = [];
  for (let k = 0; k < 16; k++) {
    const germ = k % 3 === 1;
    const el = germ ? E('rect', { x: -8, y: -3.5, width: 16, height: 7, rx: 3.5, fill: '#7CCB6B', stroke: '#3F8F2F', 'stroke-width': 1.5 }, lIn) : E('circle', { r: 5, fill: '#8C96A0', stroke: '#C9D1D8', 'stroke-width': 1.2 }, lIn);
    const early = k < 8;
    dirt.push({ el, x0: 840 + dr() * 46, y0: 150 + dr() * 440, ys: early ? 170 + k * 56 + dr() * 20 : 420 + dr() * 190, ts: early ? mid('goblet', 0.55 + k * 0.05) : mid('escalator', -0.4 + (k - 8) * 0.17), ph: dr() * TAU, rot: dr() * 180 });
  }
  const upArrow = arrow(lIn, 862, 600, 862, 150, { color: C.energy, width: 7 });
  const labGob = G(linG);
  leader(labGob, 918, 226, 752, GOBY[0]); leader(labGob, 918, 238, 752, GOBY[1]);
  T(labGob, 926, 232, 'goblet cells', { size: 30, weight: 700, fill: MUCUS });
  T(labGob, 926, 268, 'make sticky mucus', { size: 26, weight: 600, fill: C.muted });
  const labCil = G(linG);
  leader(labCil, 918, 372, 772, 372);
  T(labCil, 926, 380, 'cilia', { size: 30, weight: 700, fill: '#F7DCE5' });
  T(labCil, 926, 414, 'tiny hairs that', { size: 26, weight: 600, fill: C.muted });
  T(labCil, 926, 446, 'sweep it upwards', { size: 26, weight: 600, fill: C.muted });
  const labThroat = G(linG);
  T(labThroat, 926, 150, 'up to the throat,', { size: 26, weight: 600, fill: C.ink });
  T(labThroat, 926, 182, 'then swallowed', { size: 26, weight: 600, fill: C.ink });
  const labEsc = G(linG);
  T(labEsc, 926, 548, 'mucus', { size: 36, weight: 700, fill: C.energy });
  T(labEsc, 926, 590, 'escalator', { size: 36, weight: 700, fill: C.energy });

  /* ================= bronchi and bronchioles labels ================= */
  const brLab = G(root);
  leader(brLab, 612, 404, 340, 414);
  T(brLab, 622, 414, 'bronchi', { size: 38, weight: 700, fill: '#F4D8E1' });
  const brOne = rich(brLab, 622, 454, ['just one: a ', ['bronchus', '#F4D8E1', 700]], { size: 28, fill: C.muted });
  const bioLab = G(root);
  leader(bioLab, 612, 494, 392, 470);
  T(bioLab, 622, 504, 'bronchioles', { size: 38, weight: 700, fill: '#F4D8E1' });
  T(bioLab, 622, 540, 'smaller and smaller', { size: 28, weight: 600, fill: C.muted });

  /* ================= alveoli: a magnified cluster ================= */
  const alvG = G(root);
  const MC = [905, 300], MR = 158;
  const tipR = toS(116, 30);
  const alvCall = G(alvG);
  E('circle', { cx: tipR[0], cy: tipR[1], r: 20, fill: 'none', stroke: C.energy, 'stroke-width': 3 }, alvCall);
  E('path', { d: `M${tipR[0] + 14},${tipR[1] - 14} L${MC[0] - MR * 0.78},${MC[1] - MR * 0.62} M${tipR[0] + 16},${tipR[1] + 10} L${MC[0] - MR * 0.86},${MC[1] + MR * 0.5}`, stroke: C.energy, 'stroke-width': 2, 'stroke-dasharray': '7 7', opacity: 0.6 }, alvCall);
  const mag = G(alvG);
  E('circle', { cx: MC[0], cy: MC[1], r: MR + 6, fill: C.card, stroke: C.energy, 'stroke-width': 4 }, mag);
  const mcp = E('clipPath', { id: 'br-sys-mag' }, defs()); E('circle', { cx: MC[0], cy: MC[1], r: MR }, mcp);
  const mIn = G(mag, { 'clip-path': 'url(#br-sys-mag)' });
  E('path', { d: 'M760,160 C800,200 830,232 862,262', fill: 'none', stroke: TUBEDK, 'stroke-width': 40, 'stroke-linecap': 'round' }, mIn);
  E('path', { d: 'M760,160 C800,200 830,232 862,262', fill: 'none', stroke: TUBE, 'stroke-width': 32, 'stroke-linecap': 'round' }, mIn);
  const SACS = [[900, 300], [948, 278], [878, 352], [930, 348], [980, 322], [956, 394], [904, 404], [994, 368], [858, 300]];
  const sacEls = SACS.map(([x, y]) => E('circle', { cx: x, cy: y, r: 34, fill: ball('#D7F0FF', ALVDK), stroke: '#EAF8FF', 'stroke-width': 2.5 }, mIn));
  const capNet = E('path', { d: 'M842,262 C880,250 906,262 930,240 C960,214 1000,250 1020,296 M834,330 C870,326 896,322 916,312 C944,300 970,296 1026,340 M846,392 C880,380 904,372 930,380 C958,388 984,378 1012,400 M880,436 C900,410 900,376 914,346 C930,312 950,300 960,270 M960,440 C968,410 972,380 980,350 C988,320 1002,300 1012,280', fill: 'none', stroke: '#E8424F', 'stroke-width': 5, 'stroke-linecap': 'round', opacity: 0.85 }, mIn);
  const oneRing = E('circle', { cx: SACS[4][0], cy: SACS[4][1], r: 38, fill: 'none', stroke: C.energy, 'stroke-width': 4, 'stroke-dasharray': '9 6' }, mIn);
  const alvLab = G(alvG);
  T(alvLab, MC[0], 508, 'alveoli', { size: 38, weight: 700, anchor: 'middle', fill: ALV });
  T(alvLab, MC[0], 544, 'gas exchange happens here', { size: 28, weight: 600, anchor: 'middle', fill: C.muted });
  const alvOne = rich(alvG, MC[0], 588, ['just one: an ', ['alveolus', ALV, 700]], { size: 28, anchor: 'middle', fill: C.muted });
  const countG = G(root);
  const countT = T(countG, MC[0], 672, '', { size: 48, weight: 700, anchor: 'middle', fill: C.energy });

  /* ================= Tall Brontosaurs Breathe Air ================= */
  const tbG = G(root);
  const ROWS = [['T', 'Tall', 'trachea', 300, [320, 316]], ['B', 'Brontosaurs', 'bronchi', 392, [340, 414]], ['B', 'Breathe', 'bronchioles', 470, [392, 470]], ['A', 'Air', 'alveoli', 548, toS(116, 30)]].map(([L, word, term, y, to]) => {
    const g = G(tbG);
    const ld = leader(g, 616, y - 10, to[0] + 6, to[1]);
    const bd = G(g); tr(bd, 640, y - 10);
    E('circle', { r: 22, fill: C.energy }, bd); T(bd, 0, 9, L, { size: 26, weight: 700, anchor: 'middle', fill: C.bg0 });
    const w = T(g, 674, y, word, { size: 36, weight: 700, fill: C.ink });
    const tm = T(g, 924, y, term, { size: 30, weight: 600, fill: '#F4D8E1' });
    return { g, ld, bd, w, tm };
  });
  const dino = G(tbG); tr(dino, 990, 178);
  E('path', { d: 'M-96,40 C-130,46 -150,30 -164,14 C-140,30 -116,30 -96,22 Z', fill: ball('#7FD99A', '#2C8C4C'), stroke: '#2C8C4C', 'stroke-width': 2 }, dino);
  [[-60, 40], [-34, 44], [30, 44], [56, 40]].forEach(([x, y]) => E('rect', { x: x - 9, y, width: 18, height: 34, rx: 8, fill: '#4FBF73', stroke: '#2C8C4C', 'stroke-width': 2 }, dino));
  E('ellipse', { cx: 0, cy: 30, rx: 100, ry: 40, fill: ball('#8FE3A8', '#2C8C4C'), stroke: '#2C8C4C', 'stroke-width': 2.5 }, dino);
  const neck = G(dino);
  E('path', { d: 'M70,14 C100,-10 112,-60 112,-92 L134,-92 C134,-52 120,4 92,34 Z', fill: ball('#8FE3A8', '#2C8C4C'), stroke: '#2C8C4C', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, neck);
  E('ellipse', { cx: 134, cy: -100, rx: 28, ry: 18, fill: '#8FE3A8', stroke: '#2C8C4C', 'stroke-width': 2.5 }, neck);
  E('circle', { cx: 142, cy: -106, r: 4, fill: '#173D24' }, neck);
  E('path', { d: 'M146,-94 Q154,-92 160,-96', fill: 'none', stroke: '#173D24', 'stroke-width': 2.5, 'stroke-linecap': 'round' }, neck);
  [[-30, 8], [6, 2], [40, 10]].forEach(([x, y]) => E('circle', { cx: x, cy: y, r: 9, fill: '#5BC97E', opacity: 0.7 }, dino));

  /* ================= chest labels ================= */
  const chLab = G(root);
  const CL = [[322, 'ribs', BONE, [152.9, -77.2]], [404, 'intercostal muscles', '#FF8C9C', [167.8, -3.6]], [545, 'lungs', '#FFC2D0', [110, 120]], [604, 'diaphragm', '#FF8C9C', [130, 170]]].map(([y, text, col, to]) => {
    const g = G(chLab), p = ZP(toS(to[0], to[1])); leader(g, 612, y - 9, p[0], p[1]); T(g, 622, y, text, { size: 32, weight: 700, fill: col }); return g;
  });
  const domeNote = T(CL[3], 622, 638, 'a dome of muscle', { size: 26, weight: 600, fill: C.muted });

  /* ================= pleural membranes: the edge of one lung ================= */
  const plG = G(root);
  const edgeR = ZP(toS(132, 46));
  const plCall = G(plG);
  E('circle', { cx: edgeR[0], cy: edgeR[1], r: 20, fill: 'none', stroke: C.energy, 'stroke-width': 3 }, plCall);
  E('path', { d: `M${edgeR[0] + 16},${edgeR[1] - 12} L622,172 M${edgeR[0] + 16},${edgeR[1] + 12} L622,452`, stroke: C.energy, 'stroke-width': 2, 'stroke-dasharray': '7 7', opacity: 0.6 }, plCall);
  const pIn = frame(plG, 620, 166, 530, 290, 'br-sys-pleura');
  const lungSl = G(pIn);
  E('rect', { x: 620, y: 100, width: 262, height: 430, fill: '#E98FA6' }, lungSl);
  const pr = rng(91);
  for (let i = 0; i < 30; i++) { const x = 640 + (i % 6) * 42 + (pr() - 0.5) * 10, y = 120 + Math.floor(i / 6) * 84 + (i % 2) * 30 + (pr() - 0.5) * 10; E('circle', { cx: x, cy: y, r: 15 + pr() * 6, fill: '#F7C1CF', stroke: '#C9607E', 'stroke-width': 2 }, lungSl); }
  E('rect', { x: 880, y: 100, width: 6, height: 430, fill: '#F4F8FB' }, lungSl);
  E('rect', { x: 886, y: 166, width: 24, height: 290, fill: C.water, opacity: 0.45 }, pIn);
  E('rect', { x: 910, y: 166, width: 6, height: 290, fill: '#F4F8FB' }, pIn);
  E('rect', { x: 916, y: 166, width: 234, height: 290, fill: '#B9556C', opacity: 0.75 }, pIn);
  [[1032, 214], [1032, 324], [1032, 434]].forEach(([x, y]) => E('ellipse', { cx: x, cy: y, rx: 58, ry: 36, fill: ball(BONE, '#B7A98A'), stroke: '#FFF8E8', 'stroke-width': 2.5 }, pIn));
  const slideAr = G(pIn);
  arrow(slideAr, 760, 300, 760, 230, { color: C.ink, width: 6 }); arrow(slideAr, 760, 322, 760, 392, { color: C.ink, width: 6 });
  const plLab = G(plG);
  T(plLab, 751, 148, 'lung', { size: 30, weight: 700, anchor: 'middle', fill: '#FFC2D0' });
  T(plLab, 1033, 148, 'chest wall', { size: 30, weight: 700, anchor: 'middle', fill: BONE });
  const fluidLab = G(plG);
  leader(fluidLab, 898, 122, 898, 186, C.water);
  T(fluidLab, 898, 112, 'fluid', { size: 30, weight: 700, anchor: 'middle', fill: C.water });
  const memLab = G(plG);
  E('path', { d: 'M880,470 L880,480 L916,480 L916,470 M898,480 L898,492', fill: 'none', stroke: '#F4F8FB', 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, memLab);
  rich(memLab, 898, 526, ['two ', ['pleural membranes', '#F4F8FB', 700]], { size: 30, anchor: 'middle', fill: C.muted });
  const slideLab = T(plG, 898, 590, 'the lung slides smoothly', { size: 28, weight: 600, anchor: 'middle', fill: C.ink });
  const stickLab = T(plG, 898, 632, 'but stays stuck to the chest wall', { size: 28, weight: 600, anchor: 'middle', fill: C.ink });

  return t => {
    /* --- body and tree --- */
    const z = lerp(1, ZF, P(t, at('chest') - 0.2, 1.1));
    world.setAttribute('transform', `translate(${ZC[0]} ${ZC[1]}) scale(${z.toFixed(4)}) translate(${-ZC[0]} ${-ZC[1]})`);
    op(body, P(t, S.first - 0.3, 0.6, linear) * (1 - P(t, at('chest') - 0.2, 0.9, linear)));
    const tG = [0, 1, 2, 3, 4].map(g => mid('tree', 0.04 + g * 0.1));
    const morph = P(t, mid('tree', 0.68), 0.7) * (1 - P(t, at('nose') - 0.1, 0.7));
    ghost.forEach((e, g) => {
      const show = P(t, tG[g], 0.45, linear), w = lerp(3, [30, 22, 15, 10, 6][g], morph);
      op(e, show * lerp(0.75, 1, morph)); e.setAttribute('stroke', mix('#5E8597', '#8A5A3C', morph)); attr(e, 'stroke-width', w);
    });
    const runOn = Math.min(P(t, mid('tree', 0.12), 0.5, linear), 1 - P(t, mid('tree', 0.66), 0.4, linear)) + win(t, at('trachea'), at('cartilage'), 0.4);
    airRun.forEach((d, k) => {
      const u = ((t - mid('tree', 0.1)) * 0.42 + k / 8) % 1, [x, y] = along(AIRWAY[k % 4], ease(u));
      attr(d, 'cx', x); attr(d, 'cy', y); op(d, runOn * Math.min(1, u * 10, (1 - u) * 6));
    });
    const tipShow = P(t, mid('tree', 0.55), 0.45, linear);
    op(ghostTips, tipShow * (1 - morph)); op(leaves, morph);
    // tree icon: upright, then upside down
    const ti = win(t, mid('tree', 0.6), at('nose') + 0.1, 0.4);
    op(treeIcon, ti);
    if (ti > 0) tr(treeIcon, 900, 390, 0.95, 180 * P(t, mid('tree', 0.74), 0.9));
    // inked airway, top down
    const inkAt = [mid('trachea', 0.05), mid('bronchi', 0.04), mid('bronchioles', 0.04), mid('bronchioles', 0.26), mid('bronchioles', 0.46)];
    ink.forEach(b => { const p = P(t, inkAt[b.gN], b.gN === 0 ? 1.4 : 0.7, b.gN === 0 ? linear : easeOut); dash(b.o, p); dash(b.i, p); op(b.o, p > 0 ? 1 : 0); op(b.i, p > 0 ? 1 : 0); });
    const bGlow = win(t, mid('bronchi', 0.2), at('bronchioles'), 0.4) * (0.6 + 0.4 * wave(t, 1.4));
    glowB.forEach((e, i) => op(e, bGlow * (i === 0 ? 1 - 0.7 * P(t, mid('bronchi', 0.68), 0.4, linear) : 1)));
    rings.forEach((e, k) => { const p = P(t, mid('cartilage', 0.02 + k * 0.035), 0.35, linear); op(e, p); });
    clusters.forEach((c, k) => { const p = P(t, mid('alveoli', 0.02 + (k % 12) * 0.012), 0.45, pop); op(c.g, clamp(p * 2)); tr(c.g, c.x, c.y, Math.max(0.01, p)); });
    buds.forEach(b => { const p = P(t, mid('count', 0.08 + b.d * 0.55), 0.4, pop); op(b.g, clamp(p * 2)); tr(b.g, b.x, b.y, Math.max(0.01, p)); });
    // face: air comes in through the nose and mouth
    const fg = win(t, at('nose'), mid('nose', 0.5), 0.4);
    op(faceGlow[0], fg * (0.5 + 0.5 * wave(t, 1.4))); op(faceGlow[1], win(t, mid('nose', 0.2), mid('nose', 0.42), 0.3) * (0.5 + 0.5 * wave(t, 1.4)));
    // the chest builds round the airway
    const lungA = Math.max(0.22 * P(t, mid('bronchi', 0.3), 0.6, linear), P(t, mid('chest', 0.06), 0.7, linear));
    op(ch.lw, lungA);
    ch.ribEls.forEach((e, k) => dash(e, P(t, mid('chest', 0.24 + (k % 5) * 0.03), 0.7, easeOut)));
    op(ch.ribs, P(t, mid('chest', 0.24), 0.1, linear));
    op(ch.bands, P(t, mid('chest', 0.42), 0.6, linear));
    const dp = P(t, mid('chest', 0.68), 0.7, easeOut); op(ch.dia, dp); tr(ch.dia, 0, (1 - dp) * 30);
    if (t > at('chest')) ch.set(0.2 * wave(t - at('chest'), 4.2) * AMP * P(t, mid('chest', 0.9), 1.0, linear)); else ch.set(0);
    ch.pleura.forEach(e => op(e, P(t, mid('pleura', 0.04), 0.5, linear) * (0.6 + 0.4 * wave(t, 1.6))));

    /* --- nose --- */
    const fN = win(t, at('nose') - 0.1, at('trachea'), 0.45);
    op(noseG, fN);
    if (fN > 0) {
      airDots.forEach((d, k) => { const u = ((t - at('nose')) * 0.32 + k / 6) % 1, [x, y] = along(AIRIN, u); attr(d, 'cx', x); attr(d, 'cy', y); op(d, Math.min(1, u * 10, (1 - u) * 6)); });
      const om = win(t, mid('nose', 0.22), mid('nose', 0.5), 0.3);
      orArrow.set(P(t, mid('nose', 0.22), 0.5)); op(orArrow, om); op(mouthWay, 0.55 + 0.45 * om);
      popIn(best, t, mid('nose', 0.36), 150, -40); op(bestLab, P(t, mid('nose', 0.38), 0.4, linear));
      op(warmGlow, P(t, mid('nose', 0.55), 0.6, linear) * (0.55 + 0.45 * wave(t, 1.6)));
      drops.forEach((e, k) => op(e, P(t, mid('nose', 0.72 + k * 0.03), 0.4, linear)));
      dusts.forEach((e, k) => op(e, P(t, mid('nose', 0.86 + k * 0.03), 0.3, linear)));
      NICON.forEach((ic, i) => { popIn(ic.g, t, mid('nose', [0.54, 0.72, 0.86][i]), ic.x, 532); if (ic.anim) ic.anim.upd(t); });
    }

    /* --- trachea label --- */
    op(trLab, win(t, mid('trachea', 0.3), at('cartilage') + 0.1, 0.4));

    /* --- cartilage cross-section --- */
    const fC = win(t, at('cartilage'), at('goblet'), 0.45);
    op(cartG, fC);
    if (fC > 0) {
      const suck = P(t, mid('cartilage', 0.62), 0.8);
      op(squeeze, win(t, mid('cartilage', 0.6), end('cartilage') + 0.3, 0.3));
      attr(softOuter, 'ry', lerp(62, 24, suck)); attr(softIn, 'ry', lerp(44, 6, suck)); attr(softOuter, 'rx', lerp(62, 70, suck)); attr(softIn, 'rx', lerp(44, 50, suck));
      popIn(sCross, t, mid('cartilage', 0.8), 1036, 380); popIn(cTick, t, mid('cartilage', 0.8), RC[0], 160);
      cAir.forEach((d, k) => { const u = ((t * 0.6) + k / 5) % 1, a = k * 2.4 + Math.floor(t * 0.6 + k / 5) * 1.7, r = 30 * Math.sqrt((k * 0.37) % 1); attr(d, 'cx', RC[0] + Math.cos(a) * r); attr(d, 'cy', RC[1] + Math.sin(a) * r); attr(d, 'r', 8 * (1 - u) + 1); op(d, Math.sin(u * Math.PI)); });
      op(sLab, P(t, mid('cartilage', 0.7), 0.4, linear));
    }

    /* --- lining: goblet cells, cilia, escalator --- */
    const fL = win(t, at('goblet') - 0.1, at('bronchi') - 0.2, 0.45);
    op(linG, fL);
    if (fL > 0) {
      const ooze = P(t, mid('goblet', 0.38), 2.2, easeOut) * 260;
      [[mucA, GOBY[0]], [mucB, GOBY[1]]].forEach(([e, y]) => { attr(e, 'y', y - ooze); attr(e, 'height', Math.max(0.1, ooze * 2)); });
      gobCups.forEach(e => op(e, 0.75 + 0.25 * wave(t, 1.2)));
      // the mucus moves up once the cilia start sweeping: Dm(t) is how far it has travelled by time t
      const t0 = mid('cilia', 0.42), vm = 62;
      const Dm = s => (s < t0 ? 0 : s < t0 + 1 ? vm * (s - t0) * (s - t0) / 2 : vm * (0.5 + (s - t0 - 1))) * AMP;
      const D = Dm(t);
      const beat = P(t, at('cilia') - 0.2, 0.6, linear);
      cilia.forEach(c => { const ph = t * 7 * AMP + c.y / 34, a = (0.5 * Math.sin(ph) + 0.18 * Math.sin(2 * ph)) * beat - 0.12; attr(c.el, 'x2', 751 + Math.cos(a) * 26); attr(c.el, 'y2', c.y - Math.sin(a) * 26); });
      streaks.forEach((e, k) => { const y = 640 - (((k / 7) * 560 + D) % 560); tr(e, MX0 + MW / 2 + (k % 2 ? 4 : -4), y); op(e, P(t, mid('goblet', 0.6), 0.6, linear) * 0.8); });
      dirt.forEach(d => {
        const dt = t - d.ts, fx = s => d.x0 + Math.sin(s * 0.9 + d.ph) * 8, fy = s => d.y0 + Math.cos(s * 0.7 + d.ph) * 10;
        let x, y;
        if (dt < 0) { x = fx(t); y = fy(t); op(d.el, d.ts > end('goblet') ? P(t, d.ts - 1.2, 0.4, linear) : 1); }
        else if (dt < 0.8) { const p = ease(dt / 0.8); x = lerp(fx(d.ts), MX0 + 18, p); y = lerp(fy(d.ts), d.ys, p); op(d.el, 1); }
        else { x = MX0 + 18; y = d.ys - (D - Dm(d.ts + 0.8)); op(d.el, 1); }
        tr(d.el, x, y, 1, d.rot + (dt < 0.8 ? t * 20 : 0));
      });
      upArrow.set(P(t, at('escalator'), 0.9)); op(upArrow, win(t, at('escalator') - 0.1, at('bronchi') - 0.2, 0.3) * (0.7 + 0.3 * wave(t, 1)));
      op(labGob, win(t, mid('goblet', 0.5), at('escalator') + 0.2, 0.4));
      op(labCil, win(t, mid('cilia', 0.14), at('escalator') + 0.2, 0.4));
      op(labThroat, win(t, mid('cilia', 0.6), at('bronchi') - 0.2, 0.4));
      op(labEsc, P(t, at('escalator') + 0.2, 0.5, linear));
      tr(labEsc, 0, (1 - P(t, at('escalator') + 0.2, 0.6, easeOut)) * 14);
    }

    /* --- bronchi, bronchioles --- */
    op(brLab, win(t, mid('bronchi', 0.3), at('bronchioles') + 0.1, 0.4));
    op(brOne, P(t, mid('bronchi', 0.7), 0.4, linear));
    op(bioLab, win(t, mid('bronchioles', 0.62), at('alveoli') + 0.1, 0.4));

    /* --- alveoli, count --- */
    const fA = win(t, mid('alveoli', 0.12), at('tbba') - 0.1, 0.45);
    op(alvG, fA);
    if (fA > 0) {
      const mp = P(t, mid('alveoli', 0.12), 0.7, easeOut);
      mag.setAttribute('transform', `translate(${MC[0]} ${MC[1]}) scale(${(0.4 + 0.6 * mp).toFixed(3)}) translate(${-MC[0]} ${-MC[1]})`);
      op(alvCall, P(t, mid('alveoli', 0.1), 0.4, linear));
      sacEls.forEach((e, k) => attr(e, 'r', 34 + Math.sin(t * 1.4 + k) * 1.2 * AMP));
      op(capNet, 0.7 + 0.15 * wave(t, 1.8));
      op(alvLab, P(t, mid('alveoli', 0.36), 0.5, linear));
      op(alvOne, P(t, mid('alveoli', 0.82), 0.4, linear));
      op(oneRing, P(t, mid('alveoli', 0.8), 0.4, linear)); oneRing.setAttribute('stroke-dashoffset', (-t * 14).toFixed(1));
    }
    const fK = win(t, at('count') - 0.1, at('tbba') - 0.1, 0.4);
    op(countG, fK);
    if (fK > 0) {
      const n = Math.round(300 * P(t, at('count') + 0.2, 1.4, easeOut));
      setText(countT, P(t, mid('count', 0.72), 0.01, linear) >= 1 ? '300–500 million' : n + ' million');
    }

    /* --- Tall Brontosaurs Breathe Air --- */
    const fT = win(t, at('tbba') - 0.1, at('chest') - 0.1, 0.45);
    op(tbG, fT);
    if (fT > 0) {
      const wAt = [0.25, 0.3, 0.38, 0.42], tAt = [0.51, 0.64, 0.74, 0.87];
      ROWS.forEach((r, i) => {
        popIn(r.bd, t, mid('tbba', wAt[i]), 640, [300, 392, 470, 548][i] - 10);
        op(r.w, P(t, mid('tbba', wAt[i]), 0.4, linear));
        op(r.tm, P(t, mid('tbba', tAt[i]), 0.4, linear));
        op(r.ld, P(t, mid('tbba', tAt[i]), 0.4, linear));
      });
      const dp2 = P(t, at('tbba'), 0.7, easeOut);
      op(dino, dp2); tr(dino, 990 + (1 - dp2) * 60, 178);
      neck.setAttribute('transform', `rotate(${(Math.sin(t * 2.2) * 4 * AMP).toFixed(2)} 80 20)`);
    }
    // the matching part of the airway glows as each term is said
    const tGlow = [mid('tbba', 0.51), mid('tbba', 0.64), mid('tbba', 0.74), mid('tbba', 0.87)];
    ink.forEach(b => { const k = b.gN === 0 ? 0 : b.gN === 1 ? 1 : 2; const h = win(t, tGlow[k], tGlow[k] + 0.9, 0.25); b.i.setAttribute('stroke', h > 0 ? mix(TUBE, '#FFF3B0', h) : TUBE); });
    const hA = win(t, tGlow[3], tGlow[3] + 1.0, 0.25), fA2 = hA > 0 ? mix(ALV, '#FFF3B0', hA) : ALV;
    clusters.forEach(c => c.g.setAttribute('fill', fA2));

    /* --- chest labels --- */
    op(chLab, win(t, mid('chest', 0.1), at('pleura') - 0.1, 0.4));
    [0.3, 0.46, 0.12, 0.7].forEach((f, i) => op(CL[i], P(t, mid('chest', f), 0.4, linear)));
    op(domeNote, P(t, mid('chest', 0.82), 0.4, linear));

    /* --- pleural membranes --- */
    const fP = P(t, at('pleura') - 0.05, 0.6, linear);
    op(plG, fP);
    if (fP > 0) {
      const slide = P(t, mid('pleura', 0.54), 0.8, linear);
      tr(lungSl, 0, Math.sin((t - mid('pleura', 0.54)) * 1.6) * 34 * slide * AMP);
      op(slideAr, slide);
      op(plLab, P(t, mid('pleura', 0.06), 0.4, linear));
      op(memLab, P(t, mid('pleura', 0.2), 0.4, linear));
      op(fluidLab, P(t, mid('pleura', 0.4), 0.4, linear));
      op(slideLab, P(t, mid('pleura', 0.58), 0.4, linear));
      op(stickLab, P(t, mid('pleura', 0.78), 0.4, linear));
    }
  };
});
