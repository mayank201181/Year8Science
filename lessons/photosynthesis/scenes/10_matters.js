/* Why it matters: food, oxygen, respiration.
   Sun -> grass -> rabbit -> fox, energy sparks hopping along the chain -> a dinner plate traced back to a
   plant -> oxygen rising from land plants and ocean plankton (about half each) -> a big tree soaking up
   carbon dioxide (20+ kg a year) -> the two-way cycle: photosynthesis across the top, respiration back
   along the bottom. Showpiece: a potted plant by day (big photosynthesis arrows, small respiration ones),
   by night (respiration only: the gas arrows flip) and at dawn (they cancel: the compensation point)
   -> science today: only 1-2% of the light is stored, and scientists are engineering better crops. */
scene('matters', S => {
  const { at, end, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;
  const idle = t => t * calm;

  /* ---------- local helpers ---------- */
  function rich(parent, x, y, segs, o) {
    o = o || {};
    const t = E('text', { x, y, 'font-size': o.size || 30, 'font-weight': o.weight || 600, 'font-family': o.font || FD, 'text-anchor': o.anchor || 'start', fill: o.fill || C.ink }, parent);
    segs.forEach(s => { if (typeof s === 'string') s = [s]; E('tspan', { fill: s[1], 'font-weight': s[2] }, t).textContent = s[0]; });
    return t;
  }
  const scaleAt = (el, x, y, s) => el.setAttribute('transform', `translate(${x} ${y}) scale(${Math.max(0.001, s).toFixed(4)}) translate(${-x} ${-y})`);
  const popIn = (el, x, y, p, s0) => { op(el, clamp(p * 2)); tr(el, x, y, Math.max(0.01, (s0 === undefined ? 0.6 : s0) + (1 - (s0 === undefined ? 0.6 : s0)) * p)); };
  const ctrl = (x1, y1, x2, y2, bend) => { const L = Math.hypot(x2 - x1, y2 - y1) || 1; return [(x1 + x2) / 2 - (y2 - y1) / L * bend, (y1 + y2) / 2 + (x2 - x1) / L * bend]; };
  const qpt = (a, c, b, u) => [(1 - u) * (1 - u) * a[0] + 2 * (1 - u) * u * c[0] + u * u * b[0], (1 - u) * (1 - u) * a[1] + 2 * (1 - u) * u * c[1] + u * u * b[1]];
  const RED = C.bad, O2T = '#FF9A8F';
  /* the lib's CO2 and O2, drawn without a group per atom (same look, fewer elements) for the many moving ones */
  const atomAt = (g, kind, r, x) => { const [c, dk] = ATOM[kind]; E('circle', { cx: x.toFixed(1), r, fill: ball(c, dk), stroke: dk, 'stroke-width': Math.max(1.5, r * 0.08) }, g); };
  function co2m(parent, r) { const g = G(parent); atomAt(g, 'O', r * 0.9, -r * 1.6); atomAt(g, 'O', r * 0.9, r * 1.6); atomAt(g, 'C', r, 0); return g; }
  function o2m(parent, r) { const g = G(parent); atomAt(g, 'O', r, -r * 0.72); atomAt(g, 'O', r, r * 0.72); return g; }
  function pill(parent, text, size, stroke, o) {
    o = o || {};
    return chip(parent, text, { size, fill: o.fill || C.card2, stroke, sw: 3, color: o.color, w: Math.ceil(textWidth(text, size, FD, 800) + size * 1.6) });
  }
  /* a pill with a small picture on its left; g.anim(t) runs the picture */
  function iconPill(parent, text, size, stroke, drawIcon) {
    const iw = size * 1.25, tw = textWidth(text, size, FD, 700), pad = size * 0.62, h = Math.round(size * 1.75), w = Math.ceil(tw + iw + pad * 2.5);
    const g = G(parent);
    E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: h / 2, fill: C.card2, stroke, 'stroke-width': 3 }, g);
    const ic = G(g); tr(ic, -w / 2 + pad + iw / 2, 0);
    g.anim = drawIcon(ic) || (() => {});
    T(g, -w / 2 + pad * 1.5 + iw, size * 0.35, text, { size, weight: 700 });
    g.w = w;
    return g;
  }
  function sunIcon(parent, r) {
    const g = G(parent);
    let d = '';
    for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4; d += `M${(Math.cos(a) * r * 1.35).toFixed(1)},${(Math.sin(a) * r * 1.35).toFixed(1)} L${(Math.cos(a) * r * 1.85).toFixed(1)},${(Math.sin(a) * r * 1.85).toFixed(1)} `; }
    E('path', { d, stroke: C.energy, 'stroke-width': Math.max(2.5, r * 0.22), 'stroke-linecap': 'round' }, g);
    E('circle', { r, fill: ball(C.energy, '#E0A800') }, g);
    return g;
  }
  function moonIcon(parent, r) {
    const g = G(parent);
    E('path', { d: 'M14.67,-23.85 A28,28 0 1 0 14.67,23.85 A24,24 0 1 1 14.67,-23.85 Z', fill: '#E4ECF5', transform: `scale(${(r / 28).toFixed(3)})` }, g);
    return g;
  }
  /* a tuft of grass blades, base at (0,0) */
  function grassTuft(parent, k) {
    k = k || 1;
    let d = '';
    [[-48, 54, -16], [-32, 78, -9], [-16, 94, -4], [0, 106, 2], [16, 90, 8], [32, 72, 13], [48, 52, 18]].forEach(([bx, h, lean]) => {
      d += `M${(bx - 7) * k},0 Q${(bx - 2 + lean * 0.4) * k},${-h * 0.5 * k} ${(bx + lean) * k},${-h * k} Q${(bx + 4 + lean * 0.3) * k},${-h * 0.45 * k} ${(bx + 7) * k},0 Z `;
    });
    return E('path', { d, fill: linGrad('#86E89F', '#2C8C4C', true), stroke: '#2C8C4C', 'stroke-width': 1.5, 'stroke-linejoin': 'round' }, parent);
  }
  /* a broad tree, origin at the foot of the trunk; about 280 wide and 360 tall */
  function bigTree(parent) {
    const g = G(parent);
    E('path', { d: 'M-24,0 C-16,-60 -20,-120 -10,-176 L10,-176 C20,-120 16,-60 24,0 Z M-8,-110 C-36,-128 -56,-150 -74,-182 M6,-130 C34,-146 52,-168 66,-196', fill: '#8A5A36', stroke: '#8A5A36', 'stroke-width': 10, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    const pts = []; for (let i = 0; i < 18; i++) { const a = i / 18 * TAU, k = i % 2 ? 0.9 : 1.03; pts.push([Math.cos(a) * 140 * k, -252 + Math.sin(a) * 104 * k]); }
    E('path', { d: closedPath(pts), fill: linGrad('#6FDB8C', '#2B8A4A', true), stroke: '#9EF0B4', 'stroke-width': 3 }, g);
    E('path', { d: 'M-90,-290 q20,-22 44,-7 M-10,-320 q20,-22 44,-7 M60,-282 q18,-20 40,-6 M-60,-236 q20,-22 44,-7 M22,-228 q20,-22 44,-7 M-112,-214 q16,-18 36,-5', fill: 'none', stroke: '#B4F5C6', 'stroke-width': 6, 'stroke-linecap': 'round', opacity: 0.5 }, g);
    return g;
  }
  /* shared art: the potted plant (stem, kit leaves, terracotta pot, soil); origin at the bottom of the pot */
  function potPlant(parent) {
    const g = G(parent);
    E('path', { d: 'M0,-96 C-8,-170 10,-250 0,-330 C-3,-348 1,-362 0,-372', fill: 'none', stroke: C.stem, 'stroke-width': 11, 'stroke-linecap': 'round' }, g);
    [[-3, -160, 196, 0.62], [3, -208, -18, 0.62], [-1, -272, 208, 0.52], [1, -316, -32, 0.48]].forEach(([x, y, r, s]) => tr(leaf(g, s), x, y, 1, r));
    tr(leaf(g, 0.34), 0, -366, 1, -76);
    E('path', { d: 'M-50,0 L-62,-84 L62,-84 L50,0 Q49,6 42,6 L-42,6 Q-49,6 -50,0 Z', fill: ball('#D9824A', '#9A4E1E'), stroke: '#F0B48A', 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
    E('rect', { x: -72, y: -102, width: 144, height: 24, rx: 7, fill: ball('#E3925A', '#A4552A'), stroke: '#F0B48A', 'stroke-width': 3 }, g);
    E('rect', { x: -63, y: -108, width: 126, height: 10, rx: 5, fill: C.soil }, g);
    return g;
  }
  /* a gas-exchange arrow (quadratic) carrying molecules; g.width(w) sets its thickness, g.flow(t, speed, on) */
  function gasFlow(parent, a, b, bend, color, mk, n) {
    const g = G(parent), c = ctrl(a[0], a[1], b[0], b[1], bend);
    const line = E('path', { fill: 'none', stroke: color, 'stroke-linecap': 'round' }, g);
    const head = E('path', { fill: color }, g);
    const ang = Math.atan2(b[1] - c[1], b[0] - c[0]), ca = Math.cos(ang), sa = Math.sin(ang);
    const mols = []; for (let k = 0; k < n; k++) mols.push(mk(g));
    let lastW = -1;
    g.width = w => {
      if (Math.abs(w - lastW) < 0.05) return;
      lastW = w;
      const hs = 10 + w * 2.1, ex = b[0] - ca * hs * 0.7, ey = b[1] - sa * hs * 0.7;
      line.setAttribute('d', `M${a[0]},${a[1]} Q${c[0].toFixed(1)},${c[1].toFixed(1)} ${ex.toFixed(1)},${ey.toFixed(1)}`);
      line.setAttribute('stroke-width', w.toFixed(2));
      head.setAttribute('d', `M0,0 L${-hs},${(-hs * 0.62).toFixed(1)} L${(-hs * 0.72).toFixed(1)},0 L${-hs},${(hs * 0.62).toFixed(1)} Z`);
      head.setAttribute('transform', `translate(${b[0]} ${b[1]}) rotate(${(ang * 180 / Math.PI).toFixed(2)})`);
    };
    g.flow = (t, speed, on) => mols.forEach((m, k) => {
      const u = (t * speed + k / n) % 1, p = qpt(a, c, b, u * 0.9);
      tr(m, p[0], p[1], 1, u * 140);
      op(m, on * Math.min(1, u * 7, (1 - u) * 7));
    });
    g.width(8);
    return g;
  }

  /* ================= A. the food chain ================= */
  const A = G(root);
  const sunA = sun(root, 44);                                   // also the sun in "science today"
  const headA = pill(A, 'the start of nearly every food chain', 30, C.plant); tr(headA, 600, 214);
  const glowGrass = E('circle', { cx: 440, cy: 414, r: 120, fill: glow(C.energy) }, A);
  const grassA = G(A); grassTuft(grassA, 1);
  const foodA = molGlucose(A, 18);
  const rabbit = G(A);
  E('circle', { cx: -54, cy: -38, r: 12, fill: '#F7F4EF', stroke: '#D8CFC4', 'stroke-width': 2 }, rabbit);
  E('path', { d: 'M-56,-8 C-66,-52 -38,-82 -2,-78 C28,-74 42,-50 38,-24 C36,-8 28,0 14,0 L-44,0 C-52,0 -56,-3 -56,-8 Z', fill: ball('#DCD2C6', '#9C8F80'), stroke: '#F1E9DE', 'stroke-width': 2.5 }, rabbit);
  E('ellipse', { cx: 14, cy: -134, rx: 10, ry: 30, fill: ball('#DCD2C6', '#9C8F80'), stroke: '#F1E9DE', 'stroke-width': 2.5, transform: 'rotate(-16 14 -134)' }, rabbit);
  E('ellipse', { cx: 34, cy: -138, rx: 10, ry: 30, fill: ball('#DCD2C6', '#9C8F80'), stroke: '#F1E9DE', 'stroke-width': 2.5, transform: 'rotate(8 34 -138)' }, rabbit);
  E('path', { d: 'M10,-118 C6,-134 8,-150 14,-158 M34,-120 C33,-136 35,-152 38,-160', stroke: '#F6B6C8', 'stroke-width': 6, 'stroke-linecap': 'round', fill: 'none' }, rabbit);
  E('circle', { cx: 32, cy: -88, r: 26, fill: ball('#DCD2C6', '#9C8F80'), stroke: '#F1E9DE', 'stroke-width': 2.5 }, rabbit);
  E('circle', { cx: 42, cy: -93, r: 4, fill: '#1B1208' }, rabbit);
  E('circle', { cx: 57, cy: -83, r: 4, fill: '#F48FA6' }, rabbit);
  E('ellipse', { cx: 26, cy: -5, rx: 15, ry: 6.5, fill: '#F1E9DE' }, rabbit);
  const fox = G(A);
  E('path', { d: 'M-44,-54 C-84,-48 -118,-74 -116,-114 C-100,-92 -78,-84 -50,-80 Z', fill: ball('#F2913F', '#B5531A'), stroke: '#FFC08A', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, fox);
  E('path', { d: 'M-104,-90 C-112,-98 -116,-106 -116,-114 C-106,-104 -98,-100 -90,-98 Z', fill: '#F7F1E8' }, fox);
  E('path', { d: 'M-34,-28 L-38,0 M-16,-28 L-14,0 M24,-28 L22,0 M40,-28 L44,0', stroke: '#4A2A16', 'stroke-width': 9, 'stroke-linecap': 'round' }, fox);
  E('ellipse', { cx: 0, cy: -50, rx: 54, ry: 26, fill: ball('#F2913F', '#B5531A'), stroke: '#FFC08A', 'stroke-width': 2.5 }, fox);
  E('path', { d: 'M42,-102 L48,-132 L62,-104 Z M60,-98 L72,-126 L78,-96 Z', fill: '#E07A2E', stroke: '#FFC08A', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, fox);
  E('path', { d: 'M34,-74 C36,-96 52,-106 70,-100 C80,-96 84,-86 104,-72 Q108,-66 100,-62 L60,-50 Q38,-48 34,-74 Z', fill: ball('#F2913F', '#B5531A'), stroke: '#FFC08A', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, fox);
  E('path', { d: 'M60,-66 L102,-70 Q106,-66 100,-62 L60,-50 Q52,-56 60,-66 Z', fill: '#F7F1E8' }, fox);
  E('circle', { cx: 104, cy: -70, r: 4.5, fill: '#1B1208' }, fox);
  E('circle', { cx: 66, cy: -84, r: 4, fill: '#1B1208' }, fox);
  const POS = { sun: [160, 400], grass: [440, 474], rabbit: [735, 474], fox: [1030, 474] };
  const chainArrows = [[234, 404, 372], [522, 404, 648], [818, 404, 932]].map(([x1, y, x2]) => ({ a: arrow(A, x1, y, x2, y, { color: C.energy, width: 6 }), x1, x2, y }));
  const hops = [];
  chainArrows.forEach((ar, i) => { for (let k = 0; k < 2; k++) hops.push({ s: spark(A, 12, { seed: i * 3 + k }), i, k }); });
  const labA = [['Sun', 'light energy', C.energy], ['grass', 'producer', C.plant], ['rabbit', 'herbivore', C.glucose], ['fox', 'carnivore', C.heat]].map(([nm, role, col], i) => {
    const x = [160, 440, 735, 1030][i], g = G(A);
    T(g, x, 552, nm, { size: 32, weight: 700, anchor: 'middle' });
    T(g, x, 592, role, { size: 28, weight: 700, anchor: 'middle', fill: col });
    return { g };
  });

  /* ================= B. every meal traces back to a plant ================= */
  const B = G(root);
  const plantB = G(B); tr(plantB, 600, 300);
  E('circle', { cx: 0, cy: -46, r: 120, fill: glow(C.plant) }, plantB);
  E('path', { d: 'M0,0 C-2,-30 2,-60 0,-92', stroke: C.stem, 'stroke-width': 8, fill: 'none', 'stroke-linecap': 'round' }, plantB);
  tr(leaf(plantB, 0.46), 0, -44, 1, 204); tr(leaf(plantB, 0.46), 0, -58, 1, -24); tr(leaf(plantB, 0.3), 0, -90, 1, -80);
  const plantLbl = T(B, 600, 336, 'a plant', { size: 30, weight: 700, anchor: 'middle', fill: C.plant });
  const plate = G(B);
  E('ellipse', { cx: 600, cy: 560, rx: 236, ry: 58, fill: '#E9EEF2', stroke: '#B8C6D0', 'stroke-width': 4 }, plate);
  E('ellipse', { cx: 600, cy: 556, rx: 170, ry: 38, fill: '#F6F8FA', stroke: '#D5DEE5', 'stroke-width': 2 }, plate);
  const bread = G(B);
  E('path', { d: 'M-40,40 L-40,-8 C-56,-16 -54,-48 -26,-48 C-13,-58 13,-58 26,-48 C54,-48 56,-16 40,-8 L40,40 Q40,46 34,46 L-34,46 Q-40,46 -40,40 Z', fill: '#C8833A', stroke: '#8A5221', 'stroke-width': 4, 'stroke-linejoin': 'round' }, bread);
  E('path', { d: 'M-31,36 L-31,-4 C-44,-11 -42,-38 -20,-38 C-10,-46 10,-46 20,-38 C42,-38 44,-11 31,-4 L31,36 Z', fill: '#F2C46E' }, bread);
  const apple = G(B);
  E('path', { d: 'M0,-30 C20,-44 46,-28 42,2 C38,32 14,42 0,34 C-14,42 -38,32 -42,2 C-46,-28 -20,-44 0,-30 Z', fill: ball('#FF5A5F', '#B3262C'), stroke: '#FFB3B5', 'stroke-width': 2 }, apple);
  E('path', { d: 'M0,-30 C0,-40 3,-48 8,-54', stroke: '#6B4A33', 'stroke-width': 5, fill: 'none', 'stroke-linecap': 'round' }, apple);
  E('path', { d: 'M6,-46 C14,-58 30,-58 34,-50 C26,-42 14,-42 6,-46 Z', fill: C.plant, stroke: C.plantDk, 'stroke-width': 2 }, apple);
  const burger = G(B);
  E('path', { d: 'M-50,16 L50,16 Q52,34 34,36 L-34,36 Q-52,34 -50,16 Z', fill: '#E2A54E', stroke: '#B0742A', 'stroke-width': 3 }, burger);
  E('rect', { x: -52, y: -2, width: 104, height: 20, rx: 9, fill: '#7A4426', stroke: '#4E2A16', 'stroke-width': 3 }, burger);
  E('path', { d: 'M-54,-4 Q-44,-12 -34,-4 Q-24,-12 -14,-4 Q-4,-12 6,-4 Q16,-12 26,-4 Q36,-12 46,-4 Q52,-8 56,-4 L56,2 L-54,2 Z', fill: '#5BD27A', stroke: '#2C8C4C', 'stroke-width': 2 }, burger);
  E('path', { d: 'M-50,-6 C-50,-44 50,-44 50,-6 Z', fill: ball('#F0B55E', '#B9772A'), stroke: '#B0742A', 'stroke-width': 3 }, burger);
  E('path', { d: 'M-22,-26 l5,-2 M-4,-32 l5,-2 M16,-25 l5,-2 M-30,-14 l5,-2 M28,-14 l5,-2', stroke: '#FFF3D6', 'stroke-width': 4, 'stroke-linecap': 'round' }, burger);
  const FOODS = [[bread, 470, 506], [apple, 604, 508], [burger, 738, 516]];
  const DOT_START = [[470, 446], [604, 466], [738, 470]];
  const traces = DOT_START.map(([x0, y0], i) => {
    const end_ = [600 + (i - 1) * 44, 360], c = [lerp(x0, end_[0], 0.5) + (i - 1) * 50, lerp(y0, end_[1], 0.5)];
    const dots = [];
    for (let k = 0; k < 7; k++) { const p = qpt([x0, y0], c, end_, (k + 0.5) / 7); dots.push(E('circle', { cx: p[0].toFixed(1), cy: p[1].toFixed(1), r: 5, fill: C.plant }, B)); }
    return dots;
  });

  /* ================= C. oxygen from land and sea; a tree locks away carbon dioxide ================= */
  const Cg = G(root);
  E('path', { d: 'M60,602 C260,562 520,566 640,594 C760,618 1000,614 1140,608 L1140,655 Q1140,680 1115,680 L85,680 Q60,680 60,655 Z', fill: linGrad('#3E9B55', '#1C5530', true) }, Cg);
  const tuftsC = [[118, 598, 0.55], [500, 586, 0.62]].map(([x, y, s]) => { const g = G(Cg); grassTuft(g, 1); tr(g, x, y, s); return g; });
  const o2Land = [0, 1, 2, 3, 4].map(k => ({ m: o2m(Cg, 12), x: 214 + k * 40, ph: k / 5 }));
  const tree = bigTree(Cg);
  const sea = G(Cg);
  const seaBody = E('path', { fill: linGrad('#2A8FC7', '#0E4A72', true) }, sea);
  const seaWave = E('path', { fill: 'none', stroke: '#9FD8FF', 'stroke-width': 4, 'stroke-linecap': 'round', opacity: 0.8 }, sea);
  const pr = rng(19), plankton = [];
  for (let k = 0; k < 12; k++) plankton.push({ el: E('circle', { r: 4 + pr() * 2.5, fill: '#7CF29A', stroke: '#D4FFE0', 'stroke-width': 1.5 }, sea), x: 640 + pr() * 470, y: 618 + pr() * 46, ph: pr() * TAU });
  const o2Sea = [0, 1, 2, 3, 4].map(k => ({ m: o2m(sea, 12), x: 650 + k * 52, ph: (k / 5 + 0.1) % 1 }));
  const bar = G(sea);
  T(bar, 630, 164, "the world's oxygen", { size: 28, weight: 600, anchor: 'middle', fill: C.muted });
  E('rect', { x: 330, y: 180, width: 600, height: 48, rx: 24, fill: '#0B2230', stroke: C.line, 'stroke-width': 2 }, bar);
  const barL = E('rect', { x: 330, y: 180, width: 0, height: 48, rx: 24, fill: ball(C.plant, C.plantDk) }, bar);
  const barR = E('rect', { x: 630, y: 180, width: 0, height: 48, rx: 24, fill: ball(C.water, C.waterDk) }, bar);
  const barLt = T(bar, 480, 213, 'land plants', { size: 26, weight: 700, anchor: 'middle', fill: '#0C2A18' });
  const barRt = T(bar, 780, 213, '≈ half: ocean plankton', { size: 26, weight: 700, anchor: 'middle', fill: '#062338' });
  const zoom = G(sea);
  E('line', { x1: 952, y1: 466, x2: 922, y2: 622, stroke: '#9FD8FF', 'stroke-width': 3, 'stroke-dasharray': '6 6' }, zoom);
  E('circle', { cx: 922, cy: 626, r: 9, fill: 'none', stroke: '#9FD8FF', 'stroke-width': 3 }, zoom);
  E('circle', { cx: 1010, cy: 396, r: 80, fill: '#0E4A72', stroke: '#9FD8FF', 'stroke-width': 4 }, zoom);
  [[972, 372, 26, 18, -20], [1040, 366, 22, 22, 0], [1012, 430, 30, 16, 12]].forEach(([x, y, rx, ry, rot]) => {
    E('ellipse', { cx: x, cy: y, rx, ry, fill: 'rgba(124,242,154,0.35)', stroke: '#7CF29A', 'stroke-width': 3, transform: `rotate(${rot} ${x} ${y})` }, zoom);
    E('path', { d: `M${x - rx * 0.45},${y} a4,3 0 1,0 8,0 a4,3 0 1,0 -8,0 M${x + rx * 0.1},${y - ry * 0.3} a4,3 0 1,0 8,0 a4,3 0 1,0 -8,0`, fill: C.chloroDk }, zoom);
  });
  T(zoom, 1010, 512, 'plant-like plankton', { size: 26, weight: 700, anchor: 'middle', fill: '#9FFFC0' });
  const co2In = [];
  for (let k = 0; k < 8; k++) co2In.push({ m: co2m(Cg, 11), y0: 285 + (k % 4) * 46, ph: k / 8, bend: (k % 3 - 1) * 24 });
  const ghG = G(Cg); tr(ghG, 860, 200);
  const ghChip = iconPill(ghG, 'helps control the greenhouse effect', 27, C.co2, ic => {
    E('circle', { r: 17, fill: ball('#4CC9F0', '#1D6FA6') }, ic);
    E('path', { d: 'M-10,-8 C-4,-14 4,-10 2,-4 C0,2 -8,2 -12,-2 Z M4,6 C10,2 14,6 12,10 C8,14 2,12 4,6 Z', fill: '#5BD27A' }, ic);
    E('circle', { r: 22, fill: 'none', stroke: 'rgba(255,138,61,0.7)', 'stroke-width': 3, 'stroke-dasharray': '4 4' }, ic);
  });
  const counter = G(Cg);
  const kgT = T(counter, 860, 482, '0 kg', { size: 72, weight: 700, anchor: 'middle', fill: C.co2 });
  T(counter, 860, 524, 'of carbon dioxide, every year', { size: 27, weight: 600, anchor: 'middle', fill: C.muted });

  /* ================= D. the two-way cycle ================= */
  const D = G(root);
  const BL = [230, 400], BR = [970, 400];
  const boxL = G(D), boxR = G(D);
  card(boxL, BL[0] - 165, BL[1] - 85, 330, 170, { fill: C.card, stroke: C.line });
  tr(molCO2(boxL, 13), BL[0] - 68, BL[1] - 24);
  T(boxL, BL[0] - 12, BL[1] - 12, '+', { size: 36, weight: 700, anchor: 'middle', fill: C.muted });
  tr(molH2O(boxL, 16), BL[0] + 50, BL[1] - 28);
  T(boxL, BL[0], BL[1] + 52, 'carbon dioxide + water', { size: 27, weight: 600, anchor: 'middle' });
  card(boxR, BR[0] - 165, BR[1] - 85, 330, 170, { fill: C.card, stroke: C.line });
  tr(molGlucose(boxR, 26), BR[0] - 66, BR[1] - 22);
  T(boxR, BR[0] - 10, BR[1] - 12, '+', { size: 36, weight: 700, anchor: 'middle', fill: C.muted });
  tr(molO2(boxR, 16), BR[0] + 50, BR[1] - 22);
  T(boxR, BR[0], BR[1] + 52, 'glucose + oxygen', { size: 28, weight: 600, anchor: 'middle' });
  const arrTop = arrow(D, 405, 345, 795, 345, { color: C.plant, width: 8 });
  const arrBot = arrow(D, 795, 455, 405, 455, { color: RED, width: 8 });
  const lbTop = pill(D, 'photosynthesis', 30, C.plant); tr(lbTop, 600, 296);
  const lbBot = pill(D, 'respiration', 30, RED); tr(lbBot, 600, 504);
  const oppT = rich(D, 600, 205, ['almost exact ', ['opposites', C.energy, 800]], { size: 46, weight: 700, anchor: 'middle' });
  const topRide = [0, 1, 2].map(() => ({ a: co2m(D, 9), b: molGlucose(D, 13) }));
  const botRide = [0, 1, 2].map(() => ({ a: molGlucose(D, 13), b: co2m(D, 9) }));
  const sunD = sunIcon(D, 15); tr(sunD, 600, 345);
  const sparkD = spark(D, 17, { seed: 6 }); tr(sparkD, 600, 455);
  const eqTop = rich(D, 600, 170, [['carbon dioxide', C.co2, 700], ' + ', ['water', C.water, 700], ' → ', ['glucose', C.glucose, 700], ' + ', ['oxygen', O2T, 700]], { size: 34, weight: 600, anchor: 'middle', fill: C.muted });
  const eqBot = rich(D, 600, 640, [['glucose', C.glucose, 700], ' + ', ['oxygen', O2T, 700], ' → ', ['carbon dioxide', C.co2, 700], ' + ', ['water', C.water, 700]], { size: 34, weight: 600, anchor: 'middle', fill: C.muted });
  function pillRow(items, y) {
    const gap = 22, tot = items.reduce((a, p) => a + p.w, 0) + gap * (items.length - 1);
    let x = 600 - tot / 2;
    items.forEach(p => { p.cx = x + p.w / 2; p.cy = y; tr(p, p.cx, y); x += p.w + gap; });
    return items;
  }
  const chipsTop = pillRow([
    iconPill(D, 'stores energy', 28, C.glucose, ic => { const b = glucoseBattery(ic, 15); return t => b.set(0.35 + 0.65 * wave(t, 2.4)); }),
    iconPill(D, 'needs light', 28, C.energy, ic => { sunIcon(ic, 9); }),
  ], 230);
  const chipsBot = pillRow([
    iconPill(D, 'releases energy', 28, C.energy, ic => { const s = spark(ic, 12, { seed: 2 }); return t => s.upd(t); }),
    iconPill(D, 'all the time', 28, RED, ic => { tr(sunIcon(ic, 7), -9, -3); tr(moonIcon(ic, 9), 10, 4); }),
  ], 566);

  /* ================= E. a plant by day, by night and at dawn ================= */
  const Eg = G(root);
  const PX = 60, PY = 112, PW = 1080, PH = 543;
  const skyClip = E('clipPath', { id: 'ps-matters-sky' }, defs());
  E('rect', { x: PX, y: PY, width: PW, height: PH, rx: 26 }, skyClip);
  const skyG = G(Eg, { 'clip-path': 'url(#ps-matters-sky)' });
  const skyDay = E('rect', { x: PX, y: PY, width: PW, height: PH, fill: linGrad('#6FC0EE', '#CDEEFF', true) }, skyG);
  const skyNight = E('rect', { x: PX, y: PY, width: PW, height: PH, fill: linGrad('#081232', '#1B2A55', true) }, skyG);
  const skyDawn = E('rect', { x: PX, y: PY, width: PW, height: PH, fill: linGrad('#4B4F95', '#FFB37E', true) }, skyG);
  const starG = G(skyG), sr = rng(31), starPaths = [];
  for (let j = 0; j < 3; j++) {
    let d = '';
    for (let i = 0; i < 7; i++) {
      const x = 120 + sr() * 950, y = 135 + sr() * 270, s = 3 + sr() * 4;
      if (x < 420 && y < 290) continue;
      d += `M${x.toFixed(1)},${(y - s * 2).toFixed(1)} L${(x + s * 0.5).toFixed(1)},${(y - s * 0.5).toFixed(1)} L${(x + s * 2).toFixed(1)},${y.toFixed(1)} L${(x + s * 0.5).toFixed(1)},${(y + s * 0.5).toFixed(1)} L${x.toFixed(1)},${(y + s * 2).toFixed(1)} L${(x - s * 0.5).toFixed(1)},${(y + s * 0.5).toFixed(1)} L${(x - s * 2).toFixed(1)},${y.toFixed(1)} L${(x - s * 0.5).toFixed(1)},${(y - s * 0.5).toFixed(1)} Z `;
    }
    starPaths.push(E('path', { d, fill: '#EAF2FF' }, starG));
  }
  const moonG = G(skyG);
  E('circle', { r: 80, fill: glow('#BFD3FF') }, moonG);
  E('path', { d: 'M0,-36 A36,36 0 1 0 0,36 A24,36 0 0 1 0,-36 Z', fill: '#F3F0D8', stroke: '#FFFBE6', 'stroke-width': 2 }, moonG);
  const sunE = sun(skyG, 42);
  E('path', { d: `M${PX},588 H${PX + PW} V629 Q${PX + PW},655 ${PX + PW - 26},655 H${PX + 26} Q${PX},655 ${PX},629 Z`, fill: linGrad('#7A5538', '#4A3120', true) }, Eg);
  const plantE = potPlant(Eg); tr(plantE, 600, 606, 0.86);
  const psIn = gasFlow(Eg, [110, 352], [470, 420], -36, C.plant, g => co2m(g, 11), 3);
  const psOut = gasFlow(Eg, [730, 420], [1090, 352], -36, C.plant, g => o2m(g, 12), 3);
  const rIn = gasFlow(Eg, [130, 494], [478, 472], 22, RED, g => o2m(g, 11), 2);
  const rOut = gasFlow(Eg, [722, 472], [1070, 494], 22, RED, g => co2m(g, 10), 2);
  const gasLbl = [[150, 318, 'CO₂ in', C.co2, C.plant], [1050, 318, 'O₂ out', O2T, C.plant], [170, 542, 'O₂ in', O2T, RED], [1030, 542, 'CO₂ out', C.co2, RED]].map(([x, y, s, col, stroke]) => {
    const p = chip(Eg, s, { size: 26, fill: C.card, stroke, sw: 3, color: col });
    tr(p, x, y);
    return p;
  });
  const rates = G(Eg);
  card(rates, 84, 128, 324, 140, { fill: 'rgba(14,36,49,0.94)', stroke: C.line });
  T(rates, 104, 166, 'photosynthesis', { size: 26, weight: 700, fill: '#8FE8A8' });
  const mP = meter(rates, { w: 284, h: 22, color: C.plant }); tr(mP, 104, 178);
  T(rates, 104, 230, 'respiration', { size: 26, weight: 700, fill: '#FF9AA3' });
  const mR = meter(rates, { w: 284, h: 22, color: RED }); tr(mR, 104, 242);
  const stopTxt = T(rates, 388, 166, 'stops', { size: 26, weight: 700, fill: C.bad, anchor: 'end' });
  const eqlTxt = T(rates, 388, 166, 'equal', { size: 26, weight: 700, fill: C.energy, anchor: 'end' });
  const balance = G(Eg); tr(balance, 905, 160);
  E('path', { d: 'M0,0 L0,92 M-30,104 L30,104 L0,84 Z', stroke: '#E9DFC4', 'stroke-width': 6, fill: '#E9DFC4', 'stroke-linejoin': 'round' }, balance);
  const beam = G(balance);
  E('line', { x1: -150, y1: 0, x2: 150, y2: 0, stroke: '#E9DFC4', 'stroke-width': 8, 'stroke-linecap': 'round' }, beam);
  E('circle', { r: 8, fill: '#C9B98F' }, balance);
  const pans = [[-150, C.plant, 'photosynthesis'], [150, RED, 'respiration']].map(([x, col, nm]) => {
    const g = G(balance);
    E('path', { d: 'M0,0 L-28,34 M0,0 L28,34', stroke: '#E9DFC4', 'stroke-width': 3 }, g);
    E('path', { d: 'M-36,34 L36,34 Q30,50 0,50 Q-30,50 -36,34 Z', fill: col, stroke: '#FFFFFF', 'stroke-width': 2 }, g);
    const lab = chip(g, nm, { size: 24, fill: C.card, stroke: col, sw: 2.5 }); tr(lab, 0, 82);
    return { g, x };
  });
  const sumDay = chip(Eg, 'Overall: carbon dioxide **in**, oxygen **out**', { size: 30, fill: C.card2, stroke: C.plant, sw: 3, w: Math.ceil(textWidth('Overall: carbon dioxide in, oxygen out', 30, FD, 800) + 56) }); tr(sumDay, 600, 690);
  const sumNight = chip(Eg, 'At night: oxygen **in**, carbon dioxide **out**', { size: 30, fill: C.card2, stroke: RED, sw: 3, w: Math.ceil(textWidth('At night: oxygen in, carbon dioxide out', 30, FD, 800) + 56) }); tr(sumNight, 600, 690);
  const sumComp = chip(Eg, 'No overall gas exchange', { size: 30, fill: C.card2, stroke: C.energy, sw: 3 }); tr(sumComp, 600, 690);
  const sumComp2 = chip(Eg, '**Compensation point**: no overall gas exchange', { size: 30, fill: C.card2, stroke: C.energy, sw: 3, w: Math.ceil(textWidth('Compensation point: no overall gas exchange', 30, FD, 800) + 56) }); tr(sumComp2, 600, 690);

  /* ================= F. science today ================= */
  const F = G(root);
  const todayChip = pill(F, 'science today', 28, C.energy, { color: C.energy }); tr(todayChip, 600, 146);
  E('rect', { x: 80, y: 604, width: 1040, height: 62, rx: 22, fill: linGrad('#6B4A33', '#3F2A1C', true) }, F);
  // a rice field: two rows of plants that sway like a wave of wind (one path each for stems and grain)
  const field = [0, 1].map(row => {
    const g = G(F), Y0 = 606;
    let dS = '', dG = '';
    for (let k = row; k < 12; k += 2) {
      const x = 130 + k * 64, h = 92 + (k % 3) * 10, y = Y0;
      dS += `M${x},${y} C${x + 1},${y - h * 0.4} ${x + 2},${y - h * 0.75} ${x + 4},${y - h} M${x},${y} C${x - 6},${y - h * 0.3} ${x - 18},${y - h * 0.55} ${x - 34},${y - h * 0.7} M${x},${y} C${x + 6},${y - h * 0.28} ${x + 18},${y - h * 0.5} ${x + 32},${y - h * 0.62} M${x},${y} C${x - 3},${y - h * 0.35} ${x - 6},${y - h * 0.7} ${x - 14},${y - h * 0.95} `;
      dG += `M${x + 4},${y - h} C${x + 16},${y - h - 10} ${x + 26},${y - h - 2} ${x + 30},${y - h + 22} `;
    }
    E('path', { d: dS, fill: 'none', stroke: '#5FBF6E', 'stroke-width': 4, 'stroke-linecap': 'round' }, g);
    E('path', { d: dG, fill: 'none', stroke: '#E8C15A', 'stroke-width': 9, 'stroke-linecap': 'round', 'stroke-dasharray': '2 9' }, g);
    return { g, row, Y0 };
  });
  const tall = G(F);
  E('circle', { cx: 0, cy: -120, r: 110, fill: glow(C.plant) }, tall);
  E('path', { d: 'M0,0 C1,-70 3,-130 6,-176 M0,0 C-8,-52 -28,-96 -52,-120 M0,0 C8,-48 28,-88 50,-106 M0,0 C-4,-62 -10,-122 -22,-164', fill: 'none', stroke: '#6FE07E', 'stroke-width': 6, 'stroke-linecap': 'round' }, tall);
  E('path', { d: 'M6,-176 C26,-192 44,-178 50,-138', fill: 'none', stroke: '#F2CF66', 'stroke-width': 13, 'stroke-linecap': 'round', 'stroke-dasharray': '3 12' }, tall);
  const flaskG = G(F); tr(flaskG, 1052, 470);
  const fl = flask(flaskG, 0.6, { level: 0.55, liquid: C.chloro });
  const flBub = bubbles(flaskG, -26, -12, 52, 56, { n: 4, r: 5, seed: 7, speed: 0.5 });
  T(flaskG, 0, 94, 'engineered crops', { size: 26, weight: 700, anchor: 'middle', fill: C.chloro });
  const MX = 300, MW = 640, MY = 282;
  const mtr = G(F);
  T(mtr, MX, MY - 18, 'the light energy a plant gets', { size: 27, weight: 600, fill: C.muted });
  T(mtr, MX + MW, MY - 18, '100%', { size: 26, weight: 700, fill: C.energy, anchor: 'end' });
  E('rect', { x: MX, y: MY, width: MW, height: 36, rx: 18, fill: '#0B2230', stroke: C.line, 'stroke-width': 2 }, mtr);
  const lightFill = E('rect', { x: MX, y: MY, width: 0, height: 36, rx: 18, fill: 'rgba(255,228,92,0.32)' }, mtr);
  const storeGlow = E('circle', { cx: MX + 10, cy: MY + 18, r: 40, fill: glow(C.plant) }, mtr);
  const storeFill = E('rect', { x: MX, y: MY, width: 0, height: 36, rx: 8, fill: C.plant }, mtr);
  const callout = G(mtr);
  E('path', { d: `M${MX + 10},${MY + 42} L${MX + 10},${MY + 74}`, stroke: C.plant, 'stroke-width': 3 }, callout);
  rich(callout, MX - 4, MY + 108, ['only about ', ['1–2%', C.plant, 800], ' is stored as food'], { size: 32, weight: 700 });
  const better = T(mtr, MX + 34, MY + 27, '↑ better', { size: 24, weight: 700, fill: '#8FE8A8' });

  /* ================= update ================= */
  return t => {
    const tt = idle(t);

    /* ---- A. food chain ---- */
    const aA = win(t, S.first - 0.6, at('plate') + 0.1, 0.4);
    op(A, aA);
    // the sun: chain, then "science today"
    const sunA1 = aA, sunA2 = P(t, at('today') - 0.2, 0.6, linear);
    op(sunA, Math.max(sunA1, sunA2));
    if (sunA1 > 0 || sunA2 > 0) {
      sunA.upd(tt);
      if (sunA2 > 0) tr(sunA, 165, 250 + 40 * (1 - P(t, at('today') - 0.2, 1.0, easeOut)), 0.9);
      else { const p = P(t, at('chain') - 0.1, 0.7, pop); tr(sunA, POS.sun[0], POS.sun[1] + (1 - clamp(p)) * 40, Math.max(0.01, 0.4 + 0.6 * p)); }
    }
    if (aA > 0) {
      popIn(headA, 600, 214, P(t, mid('chain', 0.02), 0.5, pop));
      const pg = P(t, mid('chain', 0.14), 0.55, pop);
      op(grassA, clamp(pg * 2)); grassA.setAttribute('transform', `translate(440 474) scale(${Math.max(0.01, 1.16 * pg).toFixed(3)}) rotate(${(2 * Math.sin(tt * 1.4)).toFixed(2)})`);
      chainArrows[0].a.set(P(t, mid('chain', 0.22), 0.6)); op(chainArrows[0].a, t > mid('chain', 0.22) ? 1 : 0);
      chainArrows[1].a.set(P(t, mid('chain', 0.66), 0.5)); op(chainArrows[1].a, t > mid('chain', 0.66) ? 1 : 0);
      chainArrows[2].a.set(P(t, mid('chain', 0.85), 0.5)); op(chainArrows[2].a, t > mid('chain', 0.85) ? 1 : 0);
      const pr_ = P(t, mid('chain', 0.63), 0.55, pop), pf = P(t, mid('chain', 0.82), 0.55, pop);
      op(rabbit, clamp(pr_ * 2)); tr(rabbit, POS.rabbit[0], POS.rabbit[1] - 8 * Math.abs(Math.sin(tt * 2.2)) * P(t, mid('chain', 0.63), 0.5, linear), Math.max(0.01, 1.12 * (0.6 + 0.4 * pr_)));
      op(fox, clamp(pf * 2)); tr(fox, POS.fox[0], POS.fox[1], Math.max(0.01, 1.1 * (0.6 + 0.4 * pf)));
      // light energy trapped as food
      const trap = P(t, mid('chain', 0.42), 0.6, linear);
      op(glowGrass, trap * (0.55 + 0.25 * wave(tt, 1.6)));
      const pfood = P(t, mid('chain', 0.52), 0.5, pop);
      op(foodA, clamp(pfood * 2)); tr(foodA, 440, 320 + 4 * Math.sin(tt * 2), Math.max(0.01, 1.15 * pfood));
      hops.forEach(h => {
        const ar = chainArrows[h.i], on = P(t, mid('chain', [0.4, 0.72, 0.9][h.i]), 0.4, linear);
        const u = ((t - mid('chain', 0.4)) * 0.62 + h.k * 0.5) % 1;
        if (on <= 0 || u < 0) { op(h.s, 0); return; }
        tr(h.s, lerp(ar.x1 - 8, ar.x2 + 8, u), ar.y - 26 - 30 * Math.sin(u * Math.PI), 0.7 + 0.3 * Math.sin(u * Math.PI));
        op(h.s, on * Math.sin(u * Math.PI)); h.s.upd(tt + h.k);
      });
      labA.forEach((l, i) => {
        const t0 = mid('chain', [0.06, 0.44, 0.7, 0.88][i]);
        op(l.g, P(t, t0, 0.45, linear)); tr(l.g, 0, (1 - P(t, t0, 0.5, easeOut)) * 12);
      });
    }

    /* ---- B. the plate ---- */
    const aB = win(t, at('plate') - 0.2, at('oxygen') + 0.05, 0.35);
    op(B, aB);
    if (aB > 0) {
      const pp = P(t, at('plate') - 0.2, 0.5, pop);
      op(plate, clamp(pp * 2)); scaleAt(plate, 600, 560, 0.7 + 0.3 * pp);
      FOODS.forEach(([g, x, y], i) => popIn(g, x, y, P(t, at('plate') - 0.05 + i * 0.1, 0.45, pop), 0.4));
      const pl = P(t, mid('plate', 0.1), 0.5, pop);
      op(plantB, clamp(pl * 2)); tr(plantB, 600, 300, Math.max(0.01, 0.6 + 0.4 * pl));
      op(plantLbl, P(t, mid('plate', 0.3), 0.4, linear));
      traces.forEach((dots, i) => dots.forEach((d, k) => op(d, P(t, mid('plate', 0.2) + i * 0.12 + k * 0.1, 0.2, linear))));
    }

    /* ---- C. oxygen and carbon dioxide ---- */
    const aC = win(t, at('oxygen') - 0.2, at('opposite') + 0.05, 0.45);
    op(Cg, aC);
    if (aC > 0) {
      const sea_ = 1 - P(t, at('carbon') - 0.2, 0.6, linear);
      op(sea, sea_);
      const mv = P(t, at('carbon') - 0.1, 1.2);
      tr(tree, lerp(292, 372, mv), 596, lerp(0.7, 1.02, mv));
      tuftsC.forEach((g, i) => op(g, 1 - (i === 1 ? mv : 0)));
      if (sea_ > 0) {
        let d = 'M664,680 C640,650 628,620 606,598', w = '';
        for (let x = 610; x <= 1140; x += 15) { const y = 596 + 5 * Math.sin(x * 0.045 - tt * 2.2); d += ` L${x},${y.toFixed(1)}`; w += (w ? ' L' : 'M') + `${x},${(y + 1).toFixed(1)}`; }
        seaBody.setAttribute('d', d + ' L1140,655 Q1140,680 1115,680 Z');
        seaWave.setAttribute('d', w);
        const glowOn = P(t, mid('oxygen', 0.45), 0.6, linear);
        plankton.forEach(p => { attr(p.el, 'cx', p.x + 4 * Math.sin(tt * 0.9 + p.ph)); attr(p.el, 'cy', p.y + 3 * Math.cos(tt * 1.3 + p.ph)); op(p.el, 0.35 + 0.65 * glowOn); });
        const seaOn = P(t, mid('oxygen', 0.47), 0.5, linear);
        o2Sea.forEach(o => {
          const u = ((t - mid('oxygen', 0.47)) / 3.2 + o.ph) % 1;
          if (t < mid('oxygen', 0.47)) { op(o.m, 0); return; }
          tr(o.m, o.x + 14 * Math.sin(u * 5 + o.ph * 6), lerp(600, 270, u), 1, u * 90);
          op(o.m, seaOn * Math.min(1, u * 6, (1 - u) * 4));
        });
        const bOn = P(t, mid('oxygen', 0.28), 0.45, linear);
        op(bar, bOn);
        attr(barL, 'width', 300 * P(t, mid('oxygen', 0.33), 0.8));
        const rp = P(t, mid('oxygen', 0.55), 0.8);
        attr(barR, 'width', 300 * rp); attr(barR, 'x', 630);
        op(barLt, P(t, mid('oxygen', 0.4), 0.4, linear)); op(barRt, P(t, mid('oxygen', 0.62), 0.4, linear));
        const zp = P(t, mid('oxygen', 0.72), 0.55, pop);
        op(zoom, clamp(zp * 2)); scaleAt(zoom, 1010, 396, 0.6 + 0.4 * zp);
      }
      // oxygen rising from the land plants (stops once the tree's job changes)
      const landOn = win(t, mid('oxygen', 0.04), at('carbon') - 0.1, 0.5);
      o2Land.forEach(o => {
        const u = ((t - mid('oxygen', 0.04)) / 3.0 + o.ph) % 1;
        if (landOn <= 0 || u < 0) { op(o.m, 0); return; }
        tr(o.m, o.x + 12 * Math.sin(u * 5 + o.ph * 6), lerp(430, 250, u), 1, u * 90);
        op(o.m, landOn * Math.min(1, u * 6, (1 - u) * 4));
      });
      // carbon dioxide drawn into the big tree
      const cOn = P(t, mid('carbon', 0.02), 0.5, linear);
      co2In.forEach(o => {
        const u = ((t - mid('carbon', 0.02)) / 3.4 + o.ph) % 1;
        if (cOn <= 0 || u < 0) { op(o.m, 0); return; }
        const p = easeIn(u), x = lerp(1150, 470, p), y = lerp(o.y0, 330, p) + o.bend * Math.sin(p * Math.PI);
        tr(o.m, x, y, 1 - 0.5 * P(p, 0.7, 0.3, linear), u * 160);
        op(o.m, cOn * Math.min(1, u * 8) * (1 - P(p, 0.82, 0.18, linear)));
      });
      const pg = P(t, mid('carbon', 0.3), 0.55, pop);
      op(ghG, clamp(pg * 2)); tr(ghG, 860, 200, Math.max(0.01, 0.6 + 0.4 * pg));
      ghChip.anim(tt);
      const cp = P(t, mid('carbon', 0.6), 0.45, linear);
      op(counter, cp);
      const kg = Math.round(20 * P(t, mid('carbon', 0.62), 1.7, easeOut));
      setText(kgT, kg + (kg >= 20 && t > mid('carbon', 0.62) + 1.9 ? '+ kg' : ' kg'));
      scaleAt(kgT, 860, 460, 1 + 0.08 * Math.sin(Math.PI * P(t, mid('carbon', 0.62) + 1.85, 0.4, linear)));
    }

    /* ---- D. the cycle ---- */
    const aD = win(t, at('opposite') - 0.15, at('day') + 0.05, 0.45);
    op(D, aD);
    if (aD > 0) {
      const fP = win(t, at('photo') - 0.2, end('photo') + 0.3, 0.4), fR = P(t, at('resp') - 0.2, 0.4, linear);
      const dimTop = 1 - 0.6 * fR, dimBot = 1 - 0.6 * fP;
      op(boxL, clamp(P(t, mid('opposite', 0.02), 0.5, pop) * 2));
      op(boxR, clamp(P(t, mid('opposite', 0.12), 0.5, pop) * 2));
      const pulse = (g, x, y, t0) => scaleAt(g, x, y, 1 + 0.06 * Math.sin(clamp((t - t0) / 0.6) * Math.PI));
      pulse(boxL, BL[0], BL[1], t < at('resp') - 0.2 ? mid('photo', 0.15) : mid('resp', 0.44));
      pulse(boxR, BR[0], BR[1], t < at('resp') - 0.2 ? mid('photo', 0.42) : mid('resp', 0.16));
      arrTop.set(P(t, mid('opposite', 0.3), 0.7)); op(arrTop, (t > mid('opposite', 0.3) ? 1 : 0) * dimTop);
      arrBot.set(P(t, mid('opposite', 0.5), 0.7)); op(arrBot, (t > mid('opposite', 0.5) ? 1 : 0) * dimBot);
      op(lbTop, P(t, mid('opposite', 0.36), 0.4, linear) * dimTop);
      op(lbBot, P(t, mid('opposite', 0.56), 0.4, linear) * dimBot);
      const po = P(t, mid('opposite', 0.62), 0.5, pop);
      op(oppT, clamp(po * 2) * (1 - P(t, at('photo') - 0.25, 0.35, linear))); scaleAt(oppT, 600, 190, 0.7 + 0.3 * po);
      // things flowing along each arrow while it is described
      const ride = (parts, x0, x1, y, env, speed) => parts.forEach((o, k) => {
        const u = (tt * speed + k / parts.length) % 1, x = lerp(x0, x1, u), f = env * Math.min(1, u * 8, (1 - u) * 8);
        op(o.a, u < 0.5 ? f : 0); op(o.b, u >= 0.5 ? f : 0);
        tr(o.a, x, y, 1, u * 160); tr(o.b, x, y);
      });
      ride(topRide, 428, 772, 345, win(t, mid('photo', 0.12), end('photo') + 0.3, 0.4), 0.3);
      ride(botRide, 772, 428, 455, win(t, mid('resp', 0.12), 1e6, 0.4), 0.3);
      const su = P(t, mid('photo', 0.8), 0.5, pop);
      op(sunD, clamp(su * 2) * dimTop); tr(sunD, 600, 345, Math.max(0.01, su * (1 + 0.08 * wave(tt, 1.4))), (tt * 12) % 360);
      const sk = P(t, mid('resp', 0.62), 0.5, pop);
      op(sparkD, clamp(sk * 2)); tr(sparkD, 600, 455, Math.max(0.01, sk * (1 + 0.2 * wave(tt, 0.9)))); sparkD.upd(tt);
      op(eqTop, P(t, mid('photo', 0.14), 0.5, linear) * dimTop);
      op(eqBot, P(t, mid('resp', 0.14), 0.5, linear));
      const showPill = (p, t0, mul) => { const k = P(t, t0, 0.45, pop); op(p, clamp(k * 2) * mul); tr(p, p.cx, p.cy, Math.max(0.01, 0.6 + 0.4 * k)); p.anim(tt); };
      showPill(chipsTop[0], mid('photo', 0.62), dimTop); showPill(chipsTop[1], mid('photo', 0.82), dimTop);
      showPill(chipsBot[0], mid('resp', 0.62), 1); showPill(chipsBot[1], mid('resp', 0.84), 1);
    }

    /* ---- E. day, night, dawn ---- */
    const aE = win(t, at('day') - 0.15, at('today') + 0.1, 0.45);
    op(Eg, aE);
    if (aE > 0) {
      const toNight = P(t, at('night') - 0.1, 1.2, linear), toDawn = P(t, at('comp') - 0.1, 1.2, linear);
      op(skyDay, 1); op(skyNight, toNight); op(skyDawn, toDawn);
      op(starG, toNight * (1 - toDawn));
      starPaths.forEach((p, j) => p.setAttribute('opacity', (0.35 + 0.65 * wave(tt, 2.2, j * 0.33)).toFixed(3)));
      // the sun sets as night falls; the moon rises; a low sun at dawn
      const set = P(t, at('night') - 0.1, 1.4, easeIn), rise = P(t, at('comp'), 1.6, easeOut);
      sunE.upd(tt);
      if (t < at('comp') - 0.1) { tr(sunE, 1000, lerp(205, 640, set)); op(sunE, 1 - P(set, 0.75, 0.25, linear)); }
      else { tr(sunE, 880, lerp(700, 590, rise)); op(sunE, rise > 0 ? 1 : 0); }
      op(moonG, P(t, at('night') + 0.3, 0.8, linear) * (1 - P(t, at('comp') - 0.1, 0.6, linear)));
      tr(moonG, 1000, lerp(270, 205, P(t, at('night') + 0.3, 1.4, easeOut)));
      // rates
      op(rates, P(t, mid('day', 0.06), 0.5, linear));
      const pDay = 0.92 * P(t, mid('day', 0.12), 1.0), pNight = P(t, mid('night', 0.12), 0.9), pComp = P(t, mid('comp', 0.16), 1.0);
      const rateP = lerp(pDay * (1 - pNight), 0.3, pComp);
      mP.set(rateP); mR.set(0.3 * P(t, mid('day', 0.32), 0.8));
      op(stopTxt, P(t, mid('night', 0.22), 0.4, linear) * (1 - P(t, mid('comp', 0.12), 0.3, linear)));
      op(eqlTxt, P(t, mid('comp', 0.4), 0.4, linear));
      // gas exchange: photosynthesis (green) and respiration (red); thickness shows the rate
      const gOn = P(t, mid('day', 0.18), 0.5, linear) * (1 - pNight) + pNight * pComp;
      const gW = lerp(lerp(0, 14, P(t, mid('day', 0.18), 0.6)), 6, Math.max(pNight, pComp));
      const rOn = P(t, mid('day', 0.36), 0.5, linear);
      [psIn, psOut].forEach((f, i) => { op(f, gOn); if (gOn > 0) { f.width(Math.max(1, gW)); f.flow(tt, 0.34, 1); } });
      [rIn, rOut].forEach(f => { op(f, rOn); if (rOn > 0) { f.width(6 * (1 + 0.25 * Math.sin(Math.PI * P(t, mid('night', 0.55), 0.8, linear)))); f.flow(tt, 0.26, 1); } });
      op(gasLbl[0], gOn); op(gasLbl[1], gOn); op(gasLbl[2], rOn); op(gasLbl[3], rOn);
      // the balance levels at the compensation point
      const bp = P(t, mid('comp', 0.28), 0.5, pop);
      op(balance, clamp(bp * 2)); tr(balance, 905, 160, Math.max(0.01, 0.7 + 0.3 * bp));
      const tilt = 12 * (1 - P(t, mid('comp', 0.36), 1.2, ease)) + 1.5 * Math.sin(Math.PI * P(t, mid('comp', 0.36) + 1.1, 0.6, linear));
      beam.setAttribute('transform', `rotate(${tilt.toFixed(2)})`);
      const ra = tilt * Math.PI / 180;
      pans.forEach(p => tr(p.g, p.x * Math.cos(ra), p.x * Math.sin(ra)));
      // summaries
      op(sumDay, P(t, mid('day', 0.62), 0.45, linear) * (1 - P(t, at('night') - 0.1, 0.35, linear)));
      op(sumNight, P(t, mid('night', 0.62), 0.45, linear) * (1 - P(t, at('comp') - 0.1, 0.35, linear)));
      op(sumComp, P(t, mid('comp', 0.55), 0.45, linear) * (1 - P(t, mid('comp', 0.82), 0.35, linear)));
      op(sumComp2, P(t, mid('comp', 0.82), 0.45, linear));
    }

    /* ---- F. science today ---- */
    const aF = P(t, at('today') - 0.15, 0.5, linear);
    op(F, aF);
    if (aF > 0) {
      popIn(todayChip, 600, 146, P(t, at('today') - 0.05, 0.5, pop));
      field.forEach(f => f.g.setAttribute('transform', `translate(0 ${f.Y0}) skewX(${(4 * Math.sin(tt * 1.3 + f.row * 1.2)).toFixed(2)}) translate(0 ${-f.Y0})`));
      op(mtr, P(t, mid('today', 0.1), 0.45, linear));
      attr(lightFill, 'width', MW * P(t, mid('today', 0.12), 1.0, easeOut));
      const st = P(t, mid('today', 0.32), 0.5, easeOut), nudge = P(t, mid('today', 0.74), 1.0, easeOut);
      attr(storeFill, 'width', MW * (0.016 * st + 0.022 * nudge));
      op(storeGlow, st * (0.6 + 0.4 * wave(tt, 1.4))); attr(storeGlow, 'cx', MX + 5 + MW * (0.008 + 0.011 * nudge));
      op(callout, P(t, mid('today', 0.34), 0.45, linear));
      const pf_ = P(t, mid('today', 0.6), 0.55, pop);
      op(flaskG, clamp(pf_ * 2)); tr(flaskG, 1052, 470, Math.max(0.01, 0.6 + 0.4 * pf_));
      flBub.upd(tt);
      const gT = P(t, mid('today', 0.7), 1.4, easeOut);
      op(tall, clamp(gT * 3)); tr(tall, 930, 606, Math.max(0.01, 0.55 + 0.45 * gT), 2 * Math.sin(tt * 1.3));
      op(better, nudge); tr(better, MW * 0.022 * nudge, 0);
    }
  };
});
