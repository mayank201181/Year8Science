/* Teeth and mechanical digestion.
   A head in profile with a glowing mouth -> zoom in to the lower jaw seen from above (16 teeth on the gum,
   the tongue inside) -> chewing chops a carrot into smaller pieces: no chemical change, more surface area
   -> the four types light up around the jaw -> one card each (incisors bite an apple, canines grip and tear
   meat, premolars crush a nut, molars grind the bits to pulp) while a bite of apple travels back along the
   jaw: cut, torn, crushed, ground (the showpiece) -> tongue and saliva roll it into a bolus -> the cracker
   test: a minute on the tongue, bland to sweet -> zoom into the cracker: amylase snips starch into sugar
   -> brush twice a day, cut down on sugar. */
scene('teeth', S => {
  const { at, end, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;

  /* ---------- colours ---------- */
  const IV = '#F5EEDC', IVD = '#C9BB98', IVL = '#FFFDF6';
  const GUM = '#EE93A8', GUMD = '#B8466A';
  const TY = [
    { id: 'inc', line: 'incisors', name: 'Incisors', col: '#6FA8FF', where: 'flat and chisel-shaped, at the front', acts: ['cut', 'bite'] },
    { id: 'can', line: 'canines', name: 'Canines', col: C.heat, where: 'pointed, just behind the incisors', acts: ['grip', 'tear'] },
    { id: 'pre', line: 'premolars', name: 'Premolars', col: C.good, where: 'broad, with bumpy tops', acts: ['crush', 'grind'] },
    { id: 'mol', line: 'molars', name: 'Molars', col: C.ethanol, where: 'the big teeth at the back', acts: ['grind', 'chew'] },
  ];
  const COL = {}; TY.forEach(o => { COL[o.id] = o.col; });

  /* ---------- helpers ---------- */
  function rich(parent, x, y, segs, o) {
    o = o || {};
    const t = E('text', { x, y, 'font-size': o.size || 30, 'font-weight': o.weight || 600, 'font-family': o.font || FD, 'text-anchor': o.anchor || 'start', fill: o.fill || C.ink }, parent);
    segs.forEach(s => { if (typeof s === 'string') s = [s]; E('tspan', { fill: s[1], 'font-weight': s[2] }, t).textContent = s[0]; });
    return t;
  }
  const rr = (w, h, r) => `M${-w / 2 + r},${-h / 2} H${w / 2 - r} Q${w / 2},${-h / 2} ${w / 2},${-h / 2 + r} V${h / 2 - r} Q${w / 2},${h / 2} ${w / 2 - r},${h / 2} H${-w / 2 + r} Q${-w / 2},${h / 2} ${-w / 2},${h / 2 - r} V${-h / 2 + r} Q${-w / 2},${-h / 2} ${-w / 2 + r},${-h / 2} Z`;
  const poly = pts => 'M' + pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join('L');
  const circ = (cx, cy, r) => `M${(cx + r).toFixed(1)},${cy.toFixed(1)} A${r.toFixed(1)},${r.toFixed(1)} 0 1 0 ${(cx - r).toFixed(1)},${cy.toFixed(1)} A${r.toFixed(1)},${r.toFixed(1)} 0 1 0 ${(cx + r).toFixed(1)},${cy.toFixed(1)} Z`;
  const rrAt = (x, y, w, h, r) => `M${x + r},${y} H${x + w - r} Q${x + w},${y} ${x + w},${y + r} V${y + h - r} Q${x + w},${y + h} ${x + w - r},${y + h} H${x + r} Q${x},${y + h} ${x},${y + h - r} V${y + r} Q${x},${y} ${x + r},${y} Z`;
  /* a tooth seen from above (the biting surface), long axis along the jaw; o.halo = parent for its coloured rim */
  function toothTop(parent, type, w, h, haloParent) {
    let d;
    if (type === 'inc') d = rr(w, h, h / 2);
    else if (type === 'can') d = closedPath([[-w / 2, 0], [-w * 0.2, -h / 2], [w * 0.2, -h / 2], [w / 2, 0], [w * 0.2, h / 2], [-w * 0.2, h / 2]]);
    else if (type === 'pre') { const p = []; for (let i = 0; i < 10; i++) { const a = i / 10 * TAU; p.push([Math.cos(a) * w / 2, Math.sin(a) * h / 2]); } d = closedPath(p); }
    else d = rr(w, h, 15);
    const halo = haloParent ? E('path', { d, fill: COL[type], stroke: COL[type], 'stroke-width': 13, 'stroke-linejoin': 'round' }, haloParent) : null;
    const g = G(parent);
    E('path', { d, fill: IV, stroke: IVD, 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, g);
    if (type === 'inc') E('path', { d: `M${-w / 2 + 8},0 H${w / 2 - 8}`, stroke: IVD, 'stroke-width': 3, 'stroke-linecap': 'round' }, g);
    if (type === 'can') { E('path', { d: `M${-w * 0.36},0 H${w * 0.36} M0,${-h * 0.3} V${h * 0.3}`, stroke: IVD, 'stroke-width': 2, 'stroke-linecap': 'round', opacity: 0.8 }, g); E('circle', { r: 4, fill: IVD }, g); }
    if (type === 'pre') E('path', { d: circ(0, -h * 0.22, h * 0.19) + circ(0, h * 0.22, h * 0.19), fill: IVL, stroke: IVD, 'stroke-width': 1.5 }, g);
    if (type === 'mol') {
      E('path', { d: [[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([a, b]) => circ(a * w * 0.22, b * h * 0.22, h * 0.19)).join(''), fill: IVL, stroke: IVD, 'stroke-width': 1.5 }, g);
      E('path', { d: `M${-w * 0.42},0 H${w * 0.42} M0,${-h * 0.42} V${h * 0.42}`, stroke: IVD, 'stroke-width': 2, 'stroke-linecap': 'round' }, g);
    }
    return { g, halo };
  }
  /* a tooth seen from the side, biting edge at y=0; upper teeth point down, lower ones point up. A strip of gum covers the root. */
  const SIDE = {
    inc: { d: 'M-5,0 L-20,-48 Q-23,-62 -22,-88 L22,-88 Q22,-64 21,-54 Q14,-22 5,0 Z', hl: 'M-14,-46 L-6,-12', w: 44 },
    can: { d: 'M0,3 C-6,-8 -16,-30 -24,-56 C-26,-68 -26,-78 -26,-88 L26,-88 C26,-78 26,-68 24,-56 C16,-30 6,-8 0,3 Z', hl: 'M-13,-52 C-9,-36 -5,-20 -1,-8', w: 52 },
    pre: { d: 'M-32,-88 L-32,-16 C-32,-2 -24,4 -14,4 C-6,4 -4,-7 0,-7 C4,-7 6,4 14,4 C24,4 32,-2 32,-16 L32,-88 Z', hl: 'M-22,-48 L-22,-20', w: 64 },
    mol: { d: 'M-54,-88 L-54,-16 C-54,-2 -46,4 -36,4 C-27,4 -25,-7 -18,-7 C-11,-7 -9,4 0,4 C9,4 11,-7 18,-7 C25,-7 27,4 36,4 C46,4 54,-2 54,-16 L54,-88 Z', hl: 'M-42,-48 L-42,-20', w: 108 },
  };
  function sideTooth(parent, type, lower) {
    const g = G(parent), inner = G(g), sp = SIDE[type];
    if (lower) inner.setAttribute('transform', 'scale(1 -1)');
    E('path', { d: sp.d, fill: IV, stroke: IVD, 'stroke-width': 3, 'stroke-linejoin': 'round' }, inner);
    E('path', { d: sp.hl, fill: 'none', stroke: '#FFFFFF', 'stroke-width': 4, 'stroke-linecap': 'round', opacity: 0.55 }, inner);
    E('rect', { x: -sp.w / 2 - 24, y: -90, width: sp.w + 48, height: 36, rx: 17, fill: GUM, stroke: GUMD, 'stroke-width': 3 }, inner);
    return g;
  }
  /* an enzyme (as drawn in the enzymes chapter): a rounded blob with its active site, a notch shaped for its
     molecule, at the top centre */
  const ENZ = { amy: [C.water, C.waterDk], pro: [C.lactic, C.lacticDk], lip: [C.heat, C.heatDk] };
  function enzyme(parent, kind, R) {
    const [c, dk] = ENZ[kind], g = G(parent), top = -0.55 * R, bot = 0.75 * R, n = 0.34 * R;
    let notch;
    if (kind === 'pro') notch = `A${n.toFixed(1)},${n.toFixed(1)} 0 0 0 ${n.toFixed(1)},${top.toFixed(1)}`;
    else if (kind === 'amy') { const s = n / 0.866; notch = `L${-n},${top + 0.5 * s} L0,${top + s} L${n},${top + 0.5 * s} L${n},${top}`; }
    else notch = `L${-n},${top + 0.9 * n} L${n},${top + 0.9 * n} L${n},${top}`;
    const d = `M${-n},${top} ${notch} C${0.62 * R},${top} ${R},${top + 0.1 * R} ${R},${0.1 * R} C${R},${0.55 * R} ${0.6 * R},${bot} 0,${bot} C${-0.6 * R},${bot} ${-R},${0.55 * R} ${-R},${0.1 * R} C${-R},${top + 0.1 * R} ${-0.62 * R},${top} ${-n},${top} Z`;
    E('path', { d, fill: ball(c, dk), stroke: dk, 'stroke-width': Math.max(2, R * 0.07), 'stroke-linejoin': 'round' }, g);
    E('ellipse', { cx: -0.45 * R, cy: 0.02 * R, rx: 0.22 * R, ry: 0.12 * R, fill: '#FFFFFF', opacity: 0.35, transform: `rotate(-24 ${-0.45 * R} ${0.02 * R})` }, g);
    return g;
  }
  const amylase = (parent, r) => enzyme(parent, 'amy', r);
  /* glucose, as in the molecule chapters: an amber hexagon with its ring oxygen */
  const hexPath = s => { let d = ''; for (let i = 0; i < 6; i++) { const a = -Math.PI / 2 + i * Math.PI / 3; d += (i ? 'L' : 'M') + (Math.cos(a) * s).toFixed(1) + ',' + (Math.sin(a) * s).toFixed(1); } return d + 'Z'; };
  function hexU(parent, s) {
    const g = G(parent);
    E('path', { d: hexPath(s), fill: ball(C.glucose, C.glucoseDk), stroke: C.glucoseDk, 'stroke-width': Math.max(1.5, s * 0.12), 'stroke-linejoin': 'round' }, g);
    E('circle', { cx: (s * 0.866).toFixed(1), cy: (-s * 0.5).toFixed(1), r: (s * 0.2).toFixed(1), fill: C.oxygen }, g);
    return g;
  }
  /* a starch chain: n glucose rings joined by short bonds, centred; g.hex[i], g.bond[i] (bond i joins ring i and i+1) */
  function starch(parent, n, s, gap) {
    const g = G(parent); g.hex = []; g.bond = []; g.x = [];
    const span = (n - 1) * gap;
    for (let i = 0; i < n; i++) g.x.push(-span / 2 + i * gap);
    for (let i = 0; i < n - 1; i++) g.bond.push(E('line', { x1: g.x[i] + s * 0.8, y1: 0, x2: g.x[i + 1] - s * 0.8, y2: 0, stroke: '#C98F22', 'stroke-width': Math.max(3, s * 0.34), 'stroke-linecap': 'round' }, g));
    for (let i = 0; i < n; i++) { const h = hexU(g, s); tr(h, g.x[i], 0); g.hex.push(h); }
    return g;
  }

  /* ================= the lower jaw, seen from above ================= */
  const ARCH = [[0, 205], [52, 196], [100, 170], [138, 128], [162, 72], [176, 8], [185, -60], [191, -130], [195, -200]];
  const CL = [];
  for (let i = 0; i < ARCH.length - 1; i++) {
    const p0 = ARCH[Math.max(0, i - 1)], p1 = ARCH[i], p2 = ARCH[i + 1], p3 = ARCH[Math.min(ARCH.length - 1, i + 2)];
    for (let k = 0; k < 10; k++) {
      const u = k / 10, u2 = u * u, u3 = u2 * u;
      const f = j => 0.5 * (2 * p1[j] + (-p0[j] + p2[j]) * u + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * u2 + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * u3);
      CL.push([f(0), f(1)]);
    }
  }
  CL.push(ARCH[ARCH.length - 1]);
  const CUM = [0];
  for (let i = 1; i < CL.length; i++) CUM.push(CUM[i - 1] + Math.hypot(CL[i][0] - CL[i - 1][0], CL[i][1] - CL[i - 1][1]));
  const LEN = CUM[CUM.length - 1];
  /* point [x, y, tangent angle] at arc length s along the right half of the jaw (s = 0 at the front) */
  function onArch(s) {
    s = clamp(s, 0, LEN);
    let i = 1; while (i < CL.length - 1 && CUM[i] < s) i++;
    const f = (s - CUM[i - 1]) / ((CUM[i] - CUM[i - 1]) || 1);
    return [lerp(CL[i - 1][0], CL[i][0], f), lerp(CL[i - 1][1], CL[i][1], f), Math.atan2(CL[i][1] - CL[i - 1][1], CL[i][0] - CL[i - 1][0])];
  }
  const offArch = (s, k) => { const [x, y, a] = onArch(s); return [x - Math.sin(a) * k, y + Math.cos(a) * k]; };   // k > 0: outwards

  const jaw = G(root);
  E('ellipse', { cx: 0, cy: -30, rx: 330, ry: 350, fill: glow('#7A2638') }, jaw);
  const BAND = 36, SEND = 474;
  const outerR = [], innerR = [];
  for (let s = 0; s <= SEND; s += 6) { outerR.push(offArch(s, BAND)); innerR.push(offArch(s, -BAND)); }
  const capR = [];
  { const [x, y, a] = onArch(SEND), tx = Math.cos(a), ty = Math.sin(a), nx = -ty, ny = tx; for (let k = 0; k <= 8; k++) { const th = k / 8 * Math.PI; capR.push([x + BAND * (nx * Math.cos(th) + tx * Math.sin(th)), y + BAND * (ny * Math.cos(th) + ty * Math.sin(th))]); } }
  const MIR = p => [-p[0], p[1]];
  const ringPts = [...outerR.slice().reverse().map(MIR), ...outerR, ...capR, ...innerR.slice().reverse(), ...innerR.map(MIR), ...capR.slice().reverse().map(MIR)];
  E('path', { d: poly(ringPts) + 'Z', fill: GUM, stroke: GUMD, 'stroke-width': 4, 'stroke-linejoin': 'round' }, jaw);
  const tongue = G(jaw);
  const TP = [[0, 146], [52, 134], [95, 102], [120, 48], [133, -30], [137, -120], [133, -210], [110, -262], [55, -284], [0, -288]];
  const tongueD = closedPath([...TP, ...TP.slice(1, -1).reverse().map(MIR)]);
  E('path', { d: tongueD, fill: linGrad('#E98AA0', '#C9617C', true), stroke: '#A83A5C', 'stroke-width': 4 }, tongue);
  E('path', { d: 'M0,118 C4,40 -4,-80 0,-230', fill: 'none', stroke: '#B14D69', 'stroke-width': 5, 'stroke-linecap': 'round', opacity: 0.7 }, tongue);
  const haloG = G(jaw), teethG = G(jaw);
  const SET = [['inc', 40, 18], ['inc', 42, 18], ['can', 50, 34], ['pre', 48, 40], ['pre', 48, 40], ['mol', 68, 54], ['mol', 66, 54], ['mol', 62, 52]];
  const teeth = [], SPOT = {};
  [1, -1].forEach(side => {
    let s = 2.5;
    SET.forEach(([type, w, h]) => {
      const c = s + w / 2; s += w + 5;
      const [x, y, a] = onArch(c), deg = a * 180 / Math.PI;
      const tt = toothTop(teethG, type, w, h, haloG);
      const tf = `translate(${(side * x).toFixed(1)} ${y.toFixed(1)}) rotate(${(side > 0 ? deg : 180 - deg).toFixed(1)})`;
      tt.g.setAttribute('transform', tf); tt.halo.setAttribute('transform', tf); op(tt.halo, 0);
      teeth.push({ type, halo: tt.halo });
      if (side > 0 && !SPOT[type]) SPOT[type] = c;
    });
  });
  // the bite of apple: positions along the right half of the jaw where it is cut, torn, crushed and ground
  const STOP = [SPOT.inc, SPOT.can, SPOT.pre + 26.5, SPOT.mol + 36.5];
  const trailPts = []; for (let s = 0; s <= STOP[3]; s += 6) trailPts.push(offArch(s, -BAND + 6));
  const trail = E('path', { d: poly(trailPts), fill: 'none', stroke: C.energy, 'stroke-width': 6, 'stroke-linecap': 'round', opacity: 0.75, pathLength: 1, 'stroke-dasharray': '1 1', 'stroke-dashoffset': 1 }, jaw);
  const food = G(jaw);
  const biteBit = (parent, x, y, r) => { const g = G(parent); tr(g, x, y); E('circle', { r, fill: '#E23B45' }, g); E('circle', { cx: r * 0.18, cy: r * 0.08, r: r * 0.8, fill: '#FFF0C8' }, g); return g; };
  const stChunk = G(food); biteBit(stChunk, 0, 0, 17);
  const stTorn = G(food); biteBit(stTorn, -9, -6, 12); biteBit(stTorn, 9, 6, 11);
  const stCrush = G(food); [[-9, -8], [8, -9], [-8, 8], [9, 7], [0, 0]].forEach(([x, y]) => E('circle', { cx: x, cy: y, r: 6.5, fill: '#FBE7B5', stroke: '#C9A060', 'stroke-width': 1.5 }, stCrush));
  const stPulp = G(food); const pulpPath = E('path', { fill: '#EFD9A0', stroke: '#C2A15E', 'stroke-width': 2.5 }, stPulp);
  const bolusG = G(food);
  E('circle', { r: 30, fill: ball('#F5BE62', '#B97A24'), stroke: '#FFE2A8', 'stroke-width': 2.5 }, bolusG);
  const bolusShine = E('ellipse', { rx: 9, ry: 6, fill: '#FFFFFF', opacity: 0.75 }, bolusG);
  const drops = [0, 1, 2, 3, 4, 5].map(() => E('path', { d: 'M0,-10 C5,-3 7,2 7,5 A7,7 0 0 1 -7,5 C-7,2 -5,-3 0,-10 Z', fill: '#A9DEF9', stroke: '#E4F5FD', 'stroke-width': 1.5 }, jaw));
  const swallow = arrow(jaw, 0, -64, 0, -214, { color: C.ink, width: 6 });
  const cracker = G(jaw);
  E('rect', { x: -40, y: -40, width: 80, height: 80, rx: 9, fill: '#E9BE67', stroke: '#A8772E', 'stroke-width': 3.5 }, cracker);
  E('rect', { x: -32, y: -32, width: 64, height: 64, rx: 6, fill: 'none', stroke: '#F6D894', 'stroke-width': 2, opacity: 0.7 }, cracker);
  for (let i = 0; i < 9; i++) E('circle', { cx: -20 + (i % 3) * 20, cy: -20 + Math.floor(i / 3) * 20, r: 3.6, fill: '#B98A3E' }, cracker);
  const crackRing = E('circle', { r: 66, fill: 'none', stroke: '#CFE7F5', 'stroke-width': 4, 'stroke-dasharray': '10 8' }, jaw);
  const POS_BIG = [560, 432, 1.12], POS_LEFT = [300, 405, 1];

  /* ================= begin: a head in profile, the mouth glowing ================= */
  const HX = 430, HY = 392, MX = HX + 124, MY = HY + 43;
  const head = G(root), headIn = G(head); tr(headIn, HX, HY);
  E('path', { d: 'M-20,-210 C60,-212 110,-170 116,-110 C118,-92 116,-80 120,-70 L152,-22 Q158,-8 140,-4 L128,-2 Q132,14 128,26 Q134,32 124,37 L112,42 L124,48 Q132,58 120,70 Q112,78 116,92 Q124,124 92,134 Q50,142 20,130 L14,172 Q14,196 18,215 L-96,215 Q-98,170 -110,140 C-170,110 -186,0 -168,-80 C-150,-160 -100,-208 -20,-210 Z', fill: 'rgba(164,188,203,0.12)', stroke: C.muted, 'stroke-width': 5, 'stroke-linejoin': 'round' }, headIn);
  E('path', { d: 'M-52,-58 C-30,-70 -14,-44 -24,-22 C-30,-8 -44,-2 -52,-12', fill: 'none', stroke: C.muted, 'stroke-width': 5, 'stroke-linecap': 'round' }, headIn);
  E('circle', { cx: 82, cy: -74, r: 8, fill: C.ink }, headIn);
  E('path', { d: 'M62,-98 Q84,-108 104,-98', fill: 'none', stroke: C.muted, 'stroke-width': 5, 'stroke-linecap': 'round' }, headIn);
  const mouthGlow = E('ellipse', { cx: 126, cy: 43, rx: 100, ry: 84, fill: glow('#FFB27A', '#FFE2C2') }, headIn);
  E('ellipse', { cx: 120, cy: 43, rx: 12, ry: 8, fill: '#4A1220' }, headIn);
  const begLab = G(root);
  labelLine(begLab, 700, 352, MX + 16, MY - 6, 'your mouth', { size: 40, weight: 700, fill: '#FFB08F', line: '#FFB08F' });
  T(begLab, 700, 396, 'where digestion begins', { size: 28, weight: 500, fill: C.muted });
  const mechLab = G(root);
  T(mechLab, 860, 344, 'your teeth do', { size: 30, weight: 500, fill: C.muted });
  T(mechLab, 860, 402, 'mechanical', { size: 50, weight: 700, fill: C.energy });
  T(mechLab, 860, 458, 'digestion', { size: 50, weight: 700, fill: C.energy });

  /* ================= physical: chewing chops a carrot ================= */
  const PH = G(root);
  const hdr = chip(PH, 'mechanical digestion', { size: 30, fill: C.card2, stroke: C.energy, color: C.energy }); tr(hdr, 885, 142);
  const CAR = '#F28C34', CARD = '#B5541A', CX0 = 885, CY0 = 330;
  const LV = [
    [],
    [[-49.5, 0, 85, 120], [49.5, 0, 85, 120]],
    [[-49.5, -37, 85, 60], [49.5, -37, 85, 60], [-49.5, 37, 85, 60], [49.5, 37, 85, 60]],
    [-84.75, -28.25, 28.25, 84.75].flatMap(x => [-37, 37].map(y => [x, y, 42.5, 60])),
  ].map((list, li) => {
    const g = G(PH);
    const pieces = list.map(([x, y, w, h]) => {
      const pg = G(g);
      const sg = li === 3 ? E('rect', { x: -w / 2 - 6, y: -h / 2 - 6, width: w + 12, height: h + 12, rx: 13, fill: 'none', stroke: C.energy, 'stroke-width': 4 }, pg) : null;
      E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: 9, fill: CAR, stroke: CARD, 'stroke-width': 3 }, pg);
      if (li < 3) E('path', { d: `M${-w * 0.22},${-h / 2 + 7} Q${-w * 0.3},0 ${-w * 0.22},${h / 2 - 7} M${w * 0.2},${-h / 2 + 7} Q${w * 0.27},0 ${w * 0.2},${h / 2 - 7}`, fill: 'none', stroke: CARD, 'stroke-width': 2.5, opacity: 0.45 }, pg);
      return { pg, sg, x, y };
    });
    return { g, pieces };
  });
  { const L0 = LV[0].g, c0 = G(L0); tr(c0, CX0, CY0);
    [[-30, -118, -20], [0, -126, 0], [30, -118, 20]].forEach(([r, x, y]) => E('ellipse', { cx: 0, cy: 0, rx: 36, ry: 11, fill: ball(C.plant, C.plantDk), stroke: C.plantDk, 'stroke-width': 2, transform: `translate(${x} ${y}) rotate(${r})` }, c0));
    E('path', { d: 'M-86,-58 Q-94,0 -86,58 L70,44 Q98,0 70,-44 Z', fill: CAR, stroke: CARD, 'stroke-width': 3.5, 'stroke-linejoin': 'round' }, c0);
    E('path', { d: 'M-44,-54 Q-50,0 -44,52 M6,-50 Q0,0 6,48 M48,-45 Q43,0 48,42', fill: 'none', stroke: CARD, 'stroke-width': 2.5, opacity: 0.45 }, c0); }
  function chompRow(parent, lower) {
    const g = G(parent), inner = G(g);
    if (lower) inner.setAttribute('transform', 'scale(1 -1)');
    E('path', { d: [0, 1, 2, 3, 4].map(i => rrAt(-97 + i * 40, -42, 34, 46, 12)).join(''), fill: IV, stroke: IVD, 'stroke-width': 2.5 }, inner);
    E('rect', { x: -112, y: -66, width: 224, height: 32, rx: 16, fill: GUM, stroke: GUMD, 'stroke-width': 3 }, inner);
    return g;
  }
  const chompU = chompRow(PH, false), chompL = chompRow(PH, true);
  const chemChip = chip(PH, 'chemically changed?', { size: 30, fill: C.card, stroke: C.line });
  const chemX = 885 - 36; tr(chemChip, chemX, 512);
  const chemCross = cross(PH, 18); tr(chemCross, chemX + chemChip.w / 2 + 38, 512);
  const saMeter = meter(PH, { w: 400, h: 28, color: C.energy, label: 'surface area', labelSize: 26 }); tr(saMeter, 685, 612);
  const tinyEnz = [[-122, -86], [122, -86], [-124, 86], [124, 86]].map(([x, y]) => { const g = G(PH); const e = amylase(g, 13); tr(e, 0, 0, 1, Math.atan2(-y, -x) * 180 / Math.PI + 90); return { g, x, y }; });
  const CHOMP = [0.34, 0.46, 0.58];

  /* ================= four: the four types ================= */
  const FO = G(root);
  T(FO, 640, 196, '4 types of teeth', { size: 46, weight: 700 });
  const foRows = TY.map((o, i) => {
    const g = G(FO), y = 284 + i * 88;
    const ic = G(g); tr(ic, 692, y - 12, 1.12);
    const w = { inc: 40, can: 50, pre: 48, mol: 68 }[o.id], h = { inc: 18, can: 34, pre: 40, mol: 54 }[o.id];
    toothTop(ic, o.id, w, h, null);
    T(g, 760, y, o.line, { size: 38, weight: 700, fill: o.col });
    return { g, y };
  });
  const foNote = T(FO, 640, 650, 'each shaped for a different job', { size: 28, weight: 500, fill: C.muted });

  /* ================= one card per type: a fixed frame, the contents swap ================= */
  const IX = 890, IY = 440, K = 1.4;
  const SX = lx => IX + K * lx, SY = ly => IY + K * ly;
  const cardFrame = G(root);
  card(cardFrame, 610, 118, 560, 582, { fill: C.card, stroke: C.line });
  const cards = TY.map((o, i) => {
    const g = G(root);
    E('rect', { x: 634, y: 118, width: 512, height: 8, rx: 4, fill: o.col }, g);
    T(g, 646, 194, o.name, { size: 52, weight: 700, fill: o.col });
    T(g, 646, 238, o.where, { size: 28, weight: 500, fill: C.muted });
    T(g, 1140, 190, `${i + 1} of 4`, { size: 24, weight: 600, fill: C.faint, anchor: 'end' });
    const ill = G(g); ill.setAttribute('transform', `translate(${IX} ${IY}) scale(${K})`);
    const lab = G(g);
    const chips = o.acts.map((a, k) => { const c = chip(g, a, { size: 30, fill: C.card2, stroke: o.col, w: 128 }); tr(c, 820 + k * 150, 650); return c; });
    return { g, ill, lab, o, chips };
  });

  // --- incisors: an apple is cut and a bite taken off ---
  const inc = (() => {
    const g = cards[0].ill;
    const appleG = G(g), AR = 58;
    E('circle', { r: AR, fill: ball('#FF6B6B', '#B3262E') }, appleG);
    E('path', { d: 'M0,-54 C-2,-66 2,-76 8,-84', fill: 'none', stroke: '#6B4A33', 'stroke-width': 6, 'stroke-linecap': 'round' }, appleG);
    E('path', { d: 'M7,-74 C18,-92 40,-90 46,-82 C34,-72 18,-68 7,-74 Z', fill: C.plant, stroke: C.plantDk, 'stroke-width': 2 }, appleG);
    const R4 = AR + 4, clip = _clipUrl(`M${-R4},0 A${R4},${R4} 0 1 0 ${R4},0 A${R4},${R4} 0 1 0 ${-R4},0 Z`);
    const notch = G(appleG, { 'clip-path': clip });
    [-26, 0, 26].forEach(y => E('circle', { cx: 62, cy: y, r: 31, fill: '#FFF0C8' }, notch));
    [-26, 0, 26].forEach(y => E('circle', { cx: 62, cy: y, r: 26, fill: C.card }, notch));
    const up = sideTooth(g, 'inc', false), lo = sideTooth(g, 'inc', true);
    const piece = G(g);
    E('path', { d: 'M-8,-30 Q8,-36 14,-20 Q20,0 14,20 Q8,36 -8,30 Q-2,0 -8,-30 Z', fill: '#E23B45' }, piece);
    E('path', { d: 'M-9,-26 Q4,-30 9,-16 Q14,0 9,16 Q4,30 -9,26 Q-4,0 -9,-26 Z', fill: '#FFF0C8' }, piece);
    labelLine(cards[0].lab, 1004, 318, SX(26), SY(-30), 'chisel edge', { size: 28, weight: 600, fill: COL.inc, line: COL.inc });
    return t => {
      const A = n => mid('incisors', n), tb = A(0.4) + 0.3;
      const ax = lerp(lerp(-120, -20, P(t, A(0.06), 1.0)), -104, P(t, A(0.6), 0.8));
      tr(appleG, ax, 0);
      const cl = P(t, A(0.4), 0.3, easeIn), bit = t >= tb ? 1 : 0;
      tr(up, 22, lerp(-34, 4, cl)); tr(lo, 40, lerp(34, -4, cl));
      op(notch, bit); op(piece, bit);
      const pv = P(t, tb + 0.15, 0.6, easeOut); tr(piece, lerp(30, 70, pv), lerp(0, -8, pv), 1, -12 * pv);
      op(cards[0].lab, P(t, A(0.14), 0.4, linear) * (1 - P(t, A(0.37), 0.3, linear)));
      return [P(t, A(0.42), 0.3, linear), P(t, A(0.62), 0.3, linear)];
    };
  })();

  // --- canines: grip a strip of meat, then tear it ---
  const can = (() => {
    const g = cards[1].ill;
    const top = x => -26 + 3.5 * Math.sin(x / 17), bot = x => 26 + 3.5 * Math.sin(x / 15 + 1);
    const JAG = [[-20, -26], [-12, -17], [-25, -8], [-13, 1], [-26, 10], [-15, 18], [-22, 26]];
    const run = (f, a, b) => { const p = [], st = a < b ? 10 : -10; for (let x = a; st > 0 ? x <= b : x >= b; x += st) p.push([x, f(x)]); return p; };
    const left = [...run(top, -146, -26), ...JAG, ...run(bot, -26, -146)];
    const right = [...JAG.slice().reverse(), ...run(bot, -16, 104), ...run(top, 104, -16)];
    const meatL = G(g), pull = G(g), meatR = G(pull);
    E('path', { d: poly(left) + ' Q-166,0 -146,' + top(-146).toFixed(1) + 'Z', fill: '#C24A3C', stroke: '#7A2620', 'stroke-width': 3, 'stroke-linejoin': 'round' }, meatL);
    E('path', { d: poly(right) + 'Z', fill: '#C24A3C', stroke: '#7A2620', 'stroke-width': 3, 'stroke-linejoin': 'round' }, meatR);
    E('path', { d: 'M104,' + bot(104).toFixed(1) + ' Q128,0 104,' + top(104).toFixed(1), fill: '#C24A3C', stroke: '#7A2620', 'stroke-width': 3 }, meatR);
    E('path', { d: 'M-134,-4 Q-110,-14 -86,-4 T-38,-4', fill: 'none', stroke: '#F3B2A6', 'stroke-width': 4, 'stroke-linecap': 'round', opacity: 0.75 }, meatL);
    E('path', { d: 'M2,6 Q26,-6 50,4 T98,0', fill: 'none', stroke: '#F3B2A6', 'stroke-width': 4, 'stroke-linecap': 'round', opacity: 0.75 }, meatR);
    // the strip in one piece, shown until it tears
    const whole = G(g);
    E('path', { d: poly([...run(top, -146, 104), ...run(bot, 104, -146)]) + ' Q-166,0 -146,' + top(-146).toFixed(1) + 'Z', fill: '#C24A3C', stroke: '#7A2620', 'stroke-width': 3, 'stroke-linejoin': 'round' }, whole);
    E('path', { d: 'M104,' + bot(104).toFixed(1) + ' Q128,0 104,' + top(104).toFixed(1), fill: '#C24A3C', stroke: '#7A2620', 'stroke-width': 3 }, whole);
    E('path', { d: 'M-134,-4 Q-110,-14 -86,-4 T-38,-4 M2,6 Q26,-6 50,4 T98,0', fill: 'none', stroke: '#F3B2A6', 'stroke-width': 4, 'stroke-linecap': 'round', opacity: 0.75 }, whole);
    g.insertBefore(whole, pull);
    const up = sideTooth(pull, 'can', false), lo = sideTooth(pull, 'can', true);
    labelLine(cards[1].lab, 1004, 312, SX(42), SY(-34), 'pointed tip', { size: 28, weight: 600, fill: COL.can, line: COL.can });
    return t => {
      const A = n => mid('canines', n);
      const gp = P(t, A(0.3), 0.35, easeIn);
      tr(up, 38, lerp(-36, 4, gp)); tr(lo, 76, lerp(36, -4, gp));
      const tp = P(t, A(0.56), 1.0, easeOut), torn = t >= A(0.56) ? 1 : 0;
      op(whole, 1 - torn); op(meatL, torn); op(meatR, torn);
      pull.setAttribute('transform', `translate(${(52 * tp).toFixed(1)} ${(-10 * tp).toFixed(1)}) rotate(${(-9 * tp).toFixed(2)} 50 0)`);
      tr(meatL, -6 * tp, 2 * tp);
      op(cards[1].lab, P(t, A(0.1), 0.4, linear) * (1 - P(t, A(0.29), 0.3, linear)));
      return [P(t, A(0.36), 0.3, linear), P(t, A(0.6), 0.3, linear)];
    };
  })();

  // --- premolars: crush a nut, then grind it ---
  const pre = (() => {
    const g = cards[2].ill;
    const nut = G(g);
    E('path', { d: 'M0,-30 C20,-27 29,-9 27,7 C25,23 13,29 0,29 C-13,29 -25,23 -27,7 C-29,-9 -20,-27 0,-30 Z', fill: ball('#C98B4B', '#7A4A1E'), stroke: '#5E3714', 'stroke-width': 2.5 }, nut);
    E('path', { d: 'M-20,-18 C-9,-27 9,-27 20,-18 C11,-11 -11,-11 -20,-18 Z', fill: '#E3B47A', opacity: 0.9 }, nut);
    const SH = [[-34, 2, 14, 0.3], [-14, -6, 12, 1.4], [4, 7, 13, 2.3], [22, -5, 12, 3.1], [38, 4, 10, 4.4]];
    const shards = SH.map(([x, y, r, ph], k) => {
      const s = G(g);
      const pts = []; for (let i = 0; i < 5; i++) { const a = ph + i * TAU / 5; pts.push([Math.cos(a) * r * (0.7 + 0.15 * ((i * 7 + k) % 3)), Math.sin(a) * r * 0.62]); }
      E('path', { d: poly(pts) + 'Z', fill: k % 2 ? '#F1DBAA' : '#A86C38', stroke: '#5E3714', 'stroke-width': 2, 'stroke-linejoin': 'round' }, s);
      return { s, x, y, ph };
    });
    const up = sideTooth(g, 'pre', false), lo = sideTooth(g, 'pre', true);
    labelLine(cards[2].lab, 1004, 312, SX(16), SY(-34), 'bumpy top', { size: 28, weight: 600, fill: COL.pre, line: COL.pre });
    return t => {
      const A = n => mid('premolars', n);
      const cr = P(t, A(0.28), 0.28, easeIn), broken = t >= A(0.28) + 0.28;
      const grind = win(t, A(0.52), end('premolars') + 0.4, 0.3);
      tr(up, 0, lerp(-36, -21, cr)); tr(lo, grind * 10 * Math.sin(t * 9 * calm), lerp(36, 21, cr));
      op(nut, broken ? 0 : 1);
      const fine = P(t, A(0.55), 1.4, linear);
      shards.forEach(o => { op(o.s, broken ? 1 : 0); tr(o.s, o.x * (1 + 0.12 * P(t, A(0.28) + 0.28, 0.3, easeOut)) + grind * 3 * Math.sin(t * 9 * calm + o.ph), o.y, 1 - 0.35 * fine, grind * 20 * Math.sin(t * 4 + o.ph)); });
      op(cards[2].lab, P(t, A(0.08), 0.4, linear) * (1 - P(t, A(0.27), 0.3, linear)));
      return [P(t, A(0.3), 0.3, linear), P(t, A(0.56), 0.3, linear)];
    };
  })();

  // --- molars: grind the bits into a soft pulp ---
  const mol = (() => {
    const g = cards[3].ill;
    const bits = [[-40, 2], [-22, -6], [-6, 5], [10, -5], [26, 4], [42, -3]].map(([x, y], k) => { const b = E('circle', { cx: 0, cy: 0, r: 8, fill: k % 2 ? '#F1DBAA' : '#A86C38', stroke: '#5E3714', 'stroke-width': 1.8 }, g); return { b, x, y, ph: k * 1.3 }; });
    const pulp = E('path', { fill: '#EFD9A0', stroke: '#C2A15E', 'stroke-width': 3 }, g);
    const up = sideTooth(g, 'mol', false), lo = sideTooth(g, 'mol', true);
    labelLine(cards[3].lab, 1010, 450, SX(52), SY(3), 'soft pulp', { size: 30, weight: 700, fill: '#F3DFA8', line: '#F3DFA8' });
    return t => {
      const A = n => mid('molars', n);
      const cl = P(t, A(0.18), 0.3, easeIn) * (1 - P(t, A(0.74), 0.4));
      const grind = win(t, A(0.28), A(0.76), 0.25);
      tr(up, 0, lerp(-36, -15, cl)); tr(lo, grind * 14 * Math.sin(t * 8 * calm), lerp(36, 15, cl));
      const m = P(t, A(0.34), 1.6, linear);
      bits.forEach(o => { tr(o.b, o.x * (1 - 0.4 * m) + grind * 4 * Math.sin(t * 8 * calm + o.ph), o.y); op(o.b, 1 - clamp((m - 0.5) / 0.4)); });
      op(pulp, clamp((m - 0.35) / 0.4));
      pulp.setAttribute('d', closedPath(blobPts(36 + 8 * m, 12, 12, t * calm, 0.12, 5)));
      op(cards[3].lab, P(t, A(0.82), 0.4, linear));
      return [P(t, A(0.32), 0.3, linear), P(t, A(0.52), 0.3, linear)];
    };
  })();
  const cardAnim = [inc, can, pre, mol];

  /* ================= bolus: tongue and saliva ================= */
  const BO = G(root);
  labelLine(BO, 640, 302, 352, 352, 'saliva', { size: 34, weight: 700, fill: '#A9DEF9', line: '#A9DEF9' });
  const boLab = G(BO);
  labelLine(boLab, 640, 420, 334, 392, 'bolus', { size: 44, weight: 700, fill: '#F5BE62', line: '#F5BE62' });
  T(boLab, 640, 462, 'a soft ball, easy to swallow', { size: 28, weight: 500, fill: C.muted });
  const tgLab = G(BO);
  labelLine(tgLab, 640, 560, 392, 478, 'tongue', { size: 34, weight: 700, fill: '#F4A6B8', line: '#F4A6B8' });
  T(tgLab, 640, 600, 'moves the food around', { size: 28, weight: 500, fill: C.muted });
  const bolusLabs = [BO.childNodes[0], boLab, tgLab];

  /* ================= cracker test ================= */
  const CR = G(root);
  const tryChip = chip(CR, 'Try this at home!', { size: 30, fill: C.card2, stroke: C.energy, color: C.energy }); tr(tryChip, 885, 152);
  const watch = G(CR); tr(watch, 720, 322);
  E('rect', { x: -10, y: -82, width: 20, height: 16, rx: 4, fill: C.muted }, watch);
  E('circle', { r: 64, fill: C.card, stroke: C.muted, 'stroke-width': 6 }, watch);
  E('path', { d: [...Array(12).keys()].map(k => { const a = k * TAU / 12; return `M${(Math.sin(a) * 50).toFixed(1)},${(-Math.cos(a) * 50).toFixed(1)} L${(Math.sin(a) * 57).toFixed(1)},${(-Math.cos(a) * 57).toFixed(1)}`; }).join(''), stroke: C.faint, 'stroke-width': 3 }, watch);
  const sweep = E('path', { fill: 'rgba(255,228,92,0.18)' }, watch);
  const hand = E('line', { x1: 0, y1: 0, x2: 0, y2: -46, stroke: C.energy, 'stroke-width': 6, 'stroke-linecap': 'round' }, watch);
  E('circle', { r: 6, fill: C.energy }, watch);
  const secs = T(CR, 720, 430, '0 s', { size: 34, weight: 700, anchor: 'middle' });
  T(CR, 820, 306, 'on your tongue', { size: 32, weight: 700 });
  T(CR, 820, 346, 'for 1 minute,', { size: 30, weight: 500, fill: C.muted });
  T(CR, 820, 384, 'no chewing', { size: 30, weight: 500, fill: C.muted });
  const taste = G(CR);
  const tMeter = meter(taste, { w: 440, h: 32, color: C.glucose, label: 'taste', labelSize: 28, labelFill: C.ink }); tr(tMeter, 665, 528);
  T(taste, 665, 600, 'bland', { size: 28, weight: 600, fill: C.muted });
  const sweetT = T(taste, 1105, 600, 'sweet', { size: 28, weight: 700, fill: C.muted, anchor: 'end' });

  /* ================= amylase: zoom into the cracker ================= */
  const LZ = G(root);
  const LX = 840, LY = 384, LR = 175;
  const conn = G(LZ);
  { const k = 66 * Math.SQRT1_2, cx = POS_LEFT[0], cy = POS_LEFT[1] - 10; [[cx + k, cy - k, LX - LR * 0.5, LY - LR * 0.866], [cx + k, cy + k, LX - LR * 0.5, LY + LR * 0.866]].forEach(([x1, y1, x2, y2]) => E('line', { x1, y1, x2, y2, stroke: '#CFE7F5', 'stroke-width': 3, 'stroke-dasharray': '8 8', opacity: 0.55 }, conn)); }
  const lensIn = G(LZ);
  E('circle', { cx: LX, cy: LY, r: LR, fill: '#0B2230', stroke: '#CFE7F5', 'stroke-width': 6 }, lensIn);
  const stLab = T(lensIn, LX, LY - 118, 'starch', { size: 30, weight: 700, anchor: 'middle', fill: C.glucose });
  const suLab = T(lensIn, LX, LY + 150, 'sugar', { size: 30, weight: 700, anchor: 'middle', fill: C.glucose });
  const CHN = [-62, 10, 82].map((dy, ci) => {
    const g = G(lensIn); tr(g, LX, LY + dy);
    const ch = starch(g, 6, 15, 35);
    const e = amylase(lensIn, 24);
    const flash = [0, 1].map(() => E('circle', { r: 10, fill: 'none', stroke: '#FFFFFF', 'stroke-width': 3 }, lensIn));
    return { g, ch, e, flash, y: LY + dy, t0: mid('amylase', 0.2) + ci * 0.32 };
  });
  const amyKey = G(LZ);
  const keyE = amylase(amyKey, 20); tr(keyE, 1095, 318);
  T(amyKey, 1095, 376, 'amylase', { size: 30, weight: 700, anchor: 'middle', fill: C.water });
  T(amyKey, 1095, 408, 'in saliva', { size: 24, weight: 500, anchor: 'middle', fill: C.muted });
  const proof = G(LZ);
  const proofChip = chip(proof, 'chemical digestion starts in your mouth', { size: 26, fill: C.card2, stroke: C.good });
  tr(proofChip, LX + 18, 636);
  const proofTick = tick(proof, 13); tr(proofTick, LX + 18 - proofChip.w / 2 - 30, 638);

  /* ================= care: brush twice a day, less sugar ================= */
  const CA = G(root);
  const bigTooth = G(CA); tr(bigTooth, 400, 404, 1.55);
  E('path', { d: 'M-50,66 C-48,110 -44,150 -30,172 C-24,178 -18,172 -16,160 C-14,130 -10,100 0,86 C10,100 14,130 16,160 C18,172 24,178 30,172 C44,150 48,110 50,66 Z', fill: '#E9DDBF', stroke: IVD, 'stroke-width': 3 }, bigTooth);
  E('path', { d: 'M-54,72 L-54,16 C-54,2 -46,-4 -36,-4 C-27,-4 -25,7 -18,7 C-11,7 -9,-4 0,-4 C9,-4 11,7 18,7 C25,7 27,-4 36,-4 C46,-4 54,2 54,16 L54,72 Q54,80 46,80 L-46,80 Q-54,80 -54,72 Z', fill: IV, stroke: IVD, 'stroke-width': 3, 'stroke-linejoin': 'round' }, bigTooth);
  E('path', { d: 'M-40,20 L-40,58', stroke: '#FFFFFF', 'stroke-width': 5, 'stroke-linecap': 'round', opacity: 0.6 }, bigTooth);
  const shine = G(CA);
  E('path', { d: 'M0,-18 Q3,-3 18,0 Q3,3 0,18 Q-3,3 -18,0 Q-3,-3 0,-18 Z', fill: '#FFFFFF' }, shine);
  const brush = G(CA);
  E('path', { d: 'M40,-28 L300,-118', stroke: '#3D8FE0', 'stroke-width': 24, 'stroke-linecap': 'round' }, brush);
  E('path', { d: 'M80,-46 L280,-116', stroke: '#9BD0FF', 'stroke-width': 6, 'stroke-linecap': 'round', opacity: 0.7 }, brush);
  E('rect', { x: -56, y: -44, width: 112, height: 24, rx: 9, fill: '#3D8FE0' }, brush);
  [0, 1].forEach(odd => E('path', { d: [0, 1, 2, 3].map(j => { const x = -46 + (2 * j + odd) * 13; return `M${x},-22 L${x},-2`; }).join(''), stroke: odd ? '#DDF1FF' : '#FFFFFF', 'stroke-width': 7, 'stroke-linecap': 'round' }, brush));
  const twice = G(CA);
  const twChip = chip(twice, 'twice a day', { size: 32, fill: C.card2, stroke: C.line });
  tr(twChip, 400, 184);
  const sunI = G(twice); tr(sunI, 400 - twChip.w / 2 - 44, 184);
  E('path', { d: [...Array(8).keys()].map(k => { const a = k * TAU / 8; return `M${(Math.cos(a) * 21).toFixed(1)},${(Math.sin(a) * 21).toFixed(1)} L${(Math.cos(a) * 29).toFixed(1)},${(Math.sin(a) * 29).toFixed(1)}`; }).join(''), stroke: C.energy, 'stroke-width': 4, 'stroke-linecap': 'round' }, sunI);
  E('circle', { r: 15, fill: ball(C.energy, '#E0A800') }, sunI);
  const moonI = G(twice); tr(moonI, 400 + twChip.w / 2 + 40, 184);
  E('path', { d: 'M10.5,-17.1 A20,20 0 1 0 10.5,17.1 A17,17 0 1 1 10.5,-17.1 Z', fill: '#E4ECF5' }, moonI);
  const drink = G(CA); tr(drink, 860, 420);
  const glassD = 'M-62,-110 L-48,110 Q-46,122 -34,122 L34,122 Q46,122 48,110 L62,-110 Z';
  E('path', { d: 'M-54,-62 L-47,110 Q-45,118 -34,118 L34,118 Q45,118 47,110 L54,-62 Z', fill: '#FF7A59', opacity: 0.9 }, drink);
  const fizz = bubbles(drink, -40, -50, 80, 160, { n: 9, r: 5, seed: 23, speed: 0.5, color: 'rgba(255,255,255,0.8)' });
  E('path', { d: 'M10,-170 L-14,60', stroke: '#F4F7FA', 'stroke-width': 11, 'stroke-linecap': 'round' }, drink);
  E('path', { d: 'M8,-152 L4,-116 M0,-80 L-4,-44 M-8,-8 L-12,28', stroke: C.bad, 'stroke-width': 11 }, drink);
  E('path', { d: glassD, fill: 'rgba(200,230,250,0.10)', stroke: '#CFE7F5', 'stroke-width': 4, 'stroke-linejoin': 'round' }, drink);
  const cubes = G(CA); tr(cubes, 1010, 500);
  [[-30, 16], [30, 16], [0, -40]].forEach(([x, y]) => { E('rect', { x: x - 26, y: y - 26, width: 52, height: 52, rx: 7, fill: '#FBFDFF', stroke: '#BFD0DC', 'stroke-width': 3 }, cubes); E('path', { d: `M${x - 18},${y - 14} L${x + 12},${y - 14}`, stroke: '#DCE6EE', 'stroke-width': 4, 'stroke-linecap': 'round' }, cubes); });
  const sugarX = cross(CA, 64); tr(sugarX, 920, 440);
  const sugarLab = T(CA, 920, 660, 'cut down on sugar', { size: 34, weight: 700, anchor: 'middle' });

  /* ================= update ================= */
  return t => {
    const tBeg = S.first;

    /* --- head and zoom --- */
    const zt = mid('begin', 0.45);
    const z = P(t, zt, 1.2, easeIn);
    const hA = P(t, tBeg - 0.6, 0.6, linear) * (1 - P(t, zt + 0.75, 0.45, linear));
    op(head, hA);
    if (hA > 0) {
      const s = 1 + 8 * z;
      head.setAttribute('transform', `translate(${MX} ${MY}) scale(${s.toFixed(3)}) translate(${-MX} ${-MY})`);
      mouthGlow.setAttribute('opacity', (0.65 + 0.35 * wave(t * calm, 1.6)).toFixed(3));
    }
    op(begLab, P(t, mid('begin', 0.14), 0.5, linear) * (1 - P(t, zt - 0.1, 0.35, linear)));

    /* --- the jaw: arrives big, slides left, leaves for the last line --- */
    const ja = P(t, zt + 0.6, 1.0, easeOut), jm = P(t, at('physical') - 0.2, 1.0);
    const jA = clamp(ja * 1.6) * (1 - P(t, at('care') - 0.2, 0.5, linear));
    op(jaw, jA);
    if (jA > 0) {
      const bx = lerp(MX, POS_BIG[0], ja), by = lerp(MY, POS_BIG[1], ja), bs = lerp(0.1, POS_BIG[2], ja);
      tr(jaw, lerp(bx, POS_LEFT[0], jm), lerp(by, POS_LEFT[1], jm), lerp(bs, POS_LEFT[2], jm));
      // halos: all four types light in "four"; then only the type being described
      const tCards = at('incisors') - 0.25, dim = P(t, tCards, 0.35, linear), off = 1 - P(t, at('bolus') - 0.2, 0.5, linear);
      const lvl = TY.map((o, i) => {
        const lit = P(t, mid('four', 0.1 + i * 0.17), 0.3, linear);
        const nx = i < 3 ? at(TY[i + 1].line) - 0.2 : at('bolus') - 0.2;
        const act = win(t, at(o.line) - 0.2, nx, 0.25);
        return Math.max(act, lit * lerp(1, 0.16, dim)) * off;
      });
      teeth.forEach(o => op(o.halo, 0.9 * lvl[{ inc: 0, can: 1, pre: 2, mol: 3 }[o.type]]));
      // tongue moves the food around while the bolus forms
      const sway = win(t, at('bolus'), mid('bolus', 0.62), 0.4) * calm;
      tongue.setAttribute('transform', `rotate(${(3.5 * sway * Math.sin(t * 5)).toFixed(2)} 0 -250) scale(${(1 + 0.03 * sway * Math.sin(t * 7)).toFixed(4)})`);

      // the bite of apple: cut at the incisors, torn, crushed, ground, then rolled into a bolus
      const tI = mid('incisors', 0.4) + 0.3;
      const legs = [
        [at('canines') + 0.15, STOP[0], STOP[1]],
        [at('premolars') + 0.05, STOP[1], STOP[2]],
        [at('molars') + 0.05, STOP[2], STOP[3]],
      ];
      let s = STOP[0];
      legs.forEach(([t0, a, b]) => { const p = P(t, t0, 0.8); if (p > 0) s = lerp(a, b, p); });
      const [fx0, fy0] = onArch(s);
      const toT = P(t, at('bolus') + 0.05, 1.3);
      const fx = lerp(fx0, 0, toT), fy = lerp(fy0, -14, toT);
      const tSw = end('bolus') - 0.2, sw = P(t, tSw, 0.9, easeIn);
      tr(food, fx, lerp(fy, -270, sw), 1 - 0.4 * sw);
      op(food, (t >= tI ? 1 : 0) * (1 - P(t, tSw + 0.6, 0.3, linear)));
      const tTorn = mid('canines', 0.6), tCrush = mid('premolars', 0.32), tGround = mid('molars', 0.5), tBall = mid('bolus', 0.55);
      op(stChunk, t < tTorn ? 1 : 0); op(stTorn, t >= tTorn && t < tCrush ? 1 : 0); op(stCrush, t >= tCrush && t < tGround ? 1 : 0);
      const ballP = P(t, tBall, 0.6, linear);
      op(stPulp, t >= tGround ? 1 - ballP : 0); op(bolusG, ballP);
      if (t >= tGround) stPulp.firstChild.setAttribute('d', closedPath(blobPts(19 + 5 * P(t, at('bolus'), 2, linear), 14 + 6 * P(t, at('bolus'), 2, linear), 10, t * calm, 0.12, 3)));
      if (ballP > 0) { const ra = t * 2.2 * calm; tr(bolusShine, -10 + 6 * Math.sin(ra), -11 + 4 * Math.cos(ra)); tr(bolusG, 0, 0, 0.7 + 0.3 * P(t, tBall, 0.6, pop)); }
      trail.setAttribute('stroke-dashoffset', (1 - clamp((s - STOP[0]) / (STOP[3] - STOP[0]) * (t >= tI ? 1 : 0))).toFixed(4));
      op(trail, P(t, tI, 0.3, linear) * (1 - P(t, at('bolus') - 0.1, 0.5, linear)));
      // saliva drops onto the food
      drops.forEach((d, k) => {
        const t0 = mid('bolus', 0.28) + k * 0.24, u = clamp((t - t0) / 0.6), side = k % 2 ? 1 : -1;
        if (u <= 0 || u >= 1) { op(d, 0); return; }
        tr(d, lerp(side * 116, side * 12, u), lerp(-80 + k * 6, -24, ease(u)));
        op(d, Math.min(1, u * 6, (1 - u) * 5));
      });
      const swA = win(t, mid('bolus', 0.8), at('cracker') + 0.1, 0.3); op(swallow, swA); swallow.set(P(t, mid('bolus', 0.8), 0.5));
      // cracker on the tongue, ringed while the lens looks inside it
      const cp = P(t, mid('cracker', 0.12), 0.55, pop);
      op(cracker, clamp(cp * 2)); tr(cracker, 0, -10, 1.35 - 0.35 * clamp(cp), 8);
      const rg = win(t, at('amylase') - 0.2, at('care'), 0.4); op(crackRing, rg); tr(crackRing, 0, -10, 1, (t * 12) % 360);
    }

    /* --- begin label: mechanical digestion --- */
    op(mechLab, P(t, mid('begin', 0.6), 0.5, linear) * (1 - P(t, at('physical') - 0.3, 0.4, linear)));

    /* --- physical: carrot chopped --- */
    const aPH = win(t, at('physical') - 0.15, at('four') - 0.05, 0.35);
    op(PH, aPH);
    if (aPH > 0) {
      const ck = CHOMP.map(f => mid('physical', f));
      let close = 0; ck.forEach(c => { const u = t - c; if (u > 0 && u < 0.16) close = Math.max(close, easeIn(u / 0.16)); else if (u >= 0.16 && u < 0.5) close = Math.max(close, 1 - ease((u - 0.16) / 0.34)); });
      const chA = P(t, mid('physical', 0.24), 0.3, linear) * (1 - P(t, ck[2] + 0.45, 0.3, linear));
      op(chompU, chA); op(chompL, chA);
      tr(chompU, CX0, lerp(252, 288, close)); tr(chompL, CX0, lerp(408, 372, close));
      const level = ck.filter(c => t >= c + 0.16).length;
      const glowS = P(t, mid('physical', 0.7), 0.5, linear);
      LV.forEach((L, li) => {
        op(L.g, li === level ? 1 : 0);
        if (li !== level) return;
        const sp = li ? lerp(0.78, 1, P(t, ck[li - 1] + 0.16, 0.35, easeOut)) : 1;
        L.pieces.forEach(p => { tr(p.pg, CX0 + p.x * sp, CY0 + p.y * sp); if (p.sg) op(p.sg, glowS * (0.55 + 0.45 * wave(t, 1.2))); });
      });
      op(LV[0].g, level === 0 ? P(t, at('physical') - 0.1, 0.4, linear) : 0);
      const cc = P(t, mid('physical', 0.02), 0.4, pop); op(chemChip, clamp(cc * 2));
      const cx = P(t, mid('physical', 0.15), 0.4, pop); op(chemCross, clamp(cx * 2)); tr(chemCross, chemX + chemChip.w / 2 + 38, 512, Math.max(0.01, cx));
      op(saMeter, P(t, mid('physical', 0.3), 0.4, linear));
      saMeter.set(0.18 + 0.2 * P(t, ck[0] + 0.16, 0.4) + 0.2 * P(t, ck[1] + 0.16, 0.4) + 0.32 * P(t, ck[2] + 0.16, 0.4) + 0.08 * glowS);
      tinyEnz.forEach((o, k) => { const p = P(t, mid('physical', 0.84) + k * 0.12, 0.6, easeOut); op(o.g, p); tr(o.g, CX0 + o.x * (1.5 - 0.5 * p), CY0 + o.y * (1.5 - 0.5 * p)); });
    }

    /* --- four types --- */
    const aFO = win(t, at('four') - 0.15, at('incisors') - 0.1, 0.3);
    op(FO, aFO);
    if (aFO > 0) {
      foRows.forEach((r, i) => { const p = P(t, mid('four', 0.1 + i * 0.17), 0.45, pop); op(r.g, clamp(p * 2)); tr(r.g, (1 - clamp(p)) * 30, 0); });
      op(foNote, P(t, mid('four', 0.78), 0.4, linear));
    }

    /* --- tooth cards: the frame stays, the contents swap --- */
    op(cardFrame, win(t, at('incisors') - 0.3, at('bolus') + 0.05, 0.3));
    cards.forEach((c, i) => {
      const t0 = at(c.o.line), nx = i < 3 ? at(cards[i + 1].o.line) : at('bolus');
      const v = Math.min(P(t, t0 - 0.2, 0.3, linear), 1 - P(t, i < 3 ? nx - 0.45 : nx - 0.25, i < 3 ? 0.25 : 0.3, linear));
      op(c.g, v);
      if (v <= 0) return;
      tr(c.g, (1 - P(t, t0 - 0.2, 0.45, easeOut)) * 24, 0);
      const lit = cardAnim[i](t);
      c.chips.forEach((ch, k) => {
        const on = lit[k];
        ch.box.setAttribute('fill', on > 0.5 ? c.o.col : C.card2);
        ch.label.setAttribute('fill', on > 0.5 ? C.bg0 : C.muted);
        tr(ch, 820 + k * 150, 650, 1 + 0.12 * Math.sin(Math.PI * clamp(on)));
      });
    });

    /* --- bolus labels --- */
    const aBO = win(t, at('bolus') - 0.1, at('cracker') - 0.15, 0.3);
    op(BO, aBO);
    if (aBO > 0) {
      op(bolusLabs[2], P(t, mid('bolus', 0.04), 0.4, linear));
      op(bolusLabs[0], P(t, mid('bolus', 0.3), 0.4, linear));
      op(bolusLabs[1], P(t, mid('bolus', 0.6), 0.4, linear));
    }

    /* --- cracker test --- */
    const aCR = win(t, at('cracker') - 0.1, at('amylase') - 0.1, 0.35);
    op(CR, aCR);
    if (aCR > 0) {
      op(watch, P(t, mid('cracker', 0.14), 0.4, linear)); op(secs, P(t, mid('cracker', 0.14), 0.4, linear));
      const run = P(t, mid('cracker', 0.24), (end('cracker') - mid('cracker', 0.24)) * 0.9, linear);
      const a = run * TAU;
      attr(hand, 'transform', `rotate(${(run * 360).toFixed(1)})`);
      sweep.setAttribute('d', run >= 0.999 ? 'M0,-50 A50,50 0 1 1 0,50 A50,50 0 1 1 0,-50 Z' : run > 0.001 ? `M0,0 L0,-50 A50,50 0 ${run > 0.5 ? 1 : 0} 1 ${(Math.sin(a) * 50).toFixed(1)},${(-Math.cos(a) * 50).toFixed(1)} Z` : 'M0,0');
      setText(secs, Math.round(run * 60) + ' s');
      op(taste, P(t, mid('cracker', 0.36), 0.4, linear));
      const sw = P(t, mid('cracker', 0.42), (end('cracker') - mid('cracker', 0.42)) * 0.95, easeIn);
      tMeter.set(0.05 + 0.95 * sw);
      sweetT.setAttribute('fill', sw > 0.75 ? C.glucose : C.muted);
    }

    /* --- amylase: inside the cracker --- */
    const aLZ = win(t, at('amylase') - 0.15, at('care') - 0.05, 0.35);
    op(LZ, aLZ);
    if (aLZ > 0) {
      const lp = P(t, at('amylase') - 0.15, 0.7, easeOut);
      const cxs = lerp(POS_LEFT[0], LX, lp), cys = lerp(POS_LEFT[1] - 10, LY, lp);
      lensIn.setAttribute('transform', `translate(${cxs.toFixed(1)} ${cys.toFixed(1)}) scale(${lerp(0.22, 1, lp).toFixed(4)}) translate(${-LX} ${-LY})`);
      op(conn, P(t, at('amylase') + 0.35, 0.4, linear));
      op(stLab, 1 - P(t, mid('amylase', 0.5), 0.5, linear));
      op(suLab, P(t, mid('amylase', 0.55), 0.5, linear));
      CHN.forEach((c, ci) => {
        const s1 = c.t0, s2 = c.t0 + 1.0;
        const bx1 = LX + (c.ch.x[1] + c.ch.x[2]) / 2, bx3 = LX + (c.ch.x[3] + c.ch.x[4]) / 2;
        // enzyme walks in, snips bond 1, then bond 3, then drifts off
        let ex;
        if (t < s1) ex = lerp(LX - 150, bx1, P(t, s1 - 0.9, 0.75));
        else if (t < s2) ex = lerp(bx1, bx3, P(t, s1 + 0.25, 0.5));
        else ex = lerp(bx3, LX + 150, P(t, s2 + 0.3, 0.9, easeIn));
        const bob = Math.sin(t * 6 + ci) * 2 * calm;
        tr(c.e, ex, c.y - 9 + bob, 1, 180);
        op(c.e, P(t, s1 - 0.9, 0.3, linear) * (1 - P(t, s2 + 0.85, 0.35, linear)));
        const cut1 = t >= s1, cut2 = t >= s2;
        op(c.ch.bond[1], cut1 ? 0 : 1); op(c.ch.bond[3], cut2 ? 0 : 1);
        const dA = 9 * P(t, s1, 0.5, easeOut), dC = 9 * P(t, s2, 0.5, easeOut);
        const drift = k => (cut1 ? Math.sin(t * 1.7 + k + ci) * 2.5 * calm : 0);
        [0, 1].forEach(k => tr(c.ch.hex[k], c.ch.x[k] - dA, drift(k)));
        [2, 3].forEach(k => tr(c.ch.hex[k], c.ch.x[k], drift(k) * 0.6));
        [4, 5].forEach(k => tr(c.ch.hex[k], c.ch.x[k] + dC, drift(k)));
        tr(c.ch.bond[0], -dA, drift(0)); tr(c.ch.bond[2], 0, drift(2) * 0.6); tr(c.ch.bond[4], dC, drift(4));
        [[s1, bx1], [s2, bx3]].forEach(([ts, bx], k) => { const u = clamp((t - ts) / 0.45); op(c.flash[k], u > 0 && u < 1 ? 1 - u : 0); attr(c.flash[k], 'cx', bx); attr(c.flash[k], 'cy', c.y); attr(c.flash[k], 'r', 6 + 16 * u); });
      });
      op(amyKey, P(t, mid('amylase', 0.12), 0.5, linear));
      const pp = P(t, mid('amylase', 0.6), 0.5, pop); op(proof, clamp(pp * 2)); tr(proof, 0, (1 - clamp(pp)) * 16);
    }

    /* --- care --- */
    const aCA = P(t, at('care') - 0.1, 0.5, linear);
    op(CA, aCA);
    if (aCA > 0) {
      const bA = P(t, at('care') + 0.1, 0.5, easeOut);
      const scrub = (1 - P(t, end('care') - 0.2, 0.4)) * calm;
      tr(brush, 400 + 48 * Math.sin(t * 7) * scrub, lerp(330, 392, bA));
      op(brush, bA);
      const tw = P(t, mid('care', 0.3), 0.5, pop); op(twice, clamp(tw * 2)); tr(twice, 0, (1 - clamp(tw)) * 14);
      const sh = P(t, mid('care', 0.45), 0.5, pop); op(shine, clamp(sh * 2) * (0.75 + 0.25 * wave(t, 1.3))); tr(shine, 344, 428, Math.max(0.01, sh) * (0.85 + 0.15 * wave(t, 1.3)), (t * 30) % 360);
      const dp = P(t, mid('care', 0.5), 0.5, pop); op(drink, clamp(dp * 2)); op(cubes, clamp(dp * 2));
      fizz.upd(t * calm);
      const xp = P(t, mid('care', 0.66), 0.45, pop); op(sugarX, clamp(xp * 2)); tr(sugarX, 920, 440, Math.max(0.01, xp));
      op(sugarLab, P(t, mid('care', 0.72), 0.4, linear));
    }
  };
});
