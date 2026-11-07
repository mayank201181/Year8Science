/* Pure substances and melting points.
   Beats: a "100% PURE" juice carton, zoomed: lots of different particles -> a pure substance, only H2O
   -> a pinch of salt makes it impure, a mixture -> measure its melting or boiling point -> the heating
   curve of pure water: sharp flat steps at exactly 0 and 100 degrees C -> showpiece: the impure curve,
   lower, higher, over a range -> a gritter melts the ice on a road at -5 degrees C -> a medicine's sharp
   melting point earns a tick -> is anything 100% pure? a magnifier finds a trace; "pure enough" depends
   on the job. */
scene('pure', S => {
  const { at, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.3 : 1;

  /* ---------- local helpers ---------- */
  let nid = 0;
  const uid = () => 'ecmPure' + (++nid);
  function clipCircle(cx, cy, r) { const id = uid(), cp = E('clipPath', { id }, defs()); return { url: `url(#${id})`, el: E('circle', { cx, cy, r }, cp) }; }
  function clipRect(x, y, w, h) { const id = uid(), cp = E('clipPath', { id }, defs()); return { url: `url(#${id})`, el: E('rect', { x, y, width: w, height: h }, cp) }; }
  /* chemical formula with real subscripts (from respiration/scenes/02_aerobic.js) */
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
  const scaleAt = (el, cx, cy, s) => el.setAttribute('transform', `translate(${cx} ${cy}) scale(${Math.max(0.001, s).toFixed(4)}) translate(${-cx} ${-cy})`);
  /* piecewise-linear keyframes [[t, v], ...] */
  function keys(t, kf) {
    if (t <= kf[0][0]) return kf[0][1];
    for (let i = 1; i < kf.length; i++) if (t < kf[i][0]) return lerp(kf[i - 1][1], kf[i][1], (t - kf[i - 1][0]) / (kf[i][0] - kf[i - 1][0]));
    return kf[kf.length - 1][1];
  }
  const fmtT = v => (Math.round(v) < 0 ? '−' : '') + Math.abs(Math.round(v)) + ' °C';
  const polyD = pts => 'M' + pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' L');
  /* table sugar: a glucose hexagon joined to a fructose pentagon, amber like glucose */
  function sugar(parent, s) {
    const g = G(parent), hex = [], pen = [];
    for (let i = 0; i < 6; i++) { const a = Math.PI / 6 + i * Math.PI / 3; hex.push([-s + Math.cos(a) * s, Math.sin(a) * s]); }
    for (let i = 0; i < 5; i++) { const a = Math.PI + i * TAU / 5; pen.push([s * 1.02 + Math.cos(a) * s * 0.86, Math.sin(a) * s * 0.86]); }
    E('path', { d: `M${(-s * 0.2).toFixed(1)},0 L${(s * 0.22).toFixed(1)},0`, stroke: C.glucoseDk, 'stroke-width': Math.max(2, s * 0.22), 'stroke-linecap': 'round' }, g);
    E('path', { d: polyD(hex) + 'Z' + polyD(pen) + 'Z', fill: ball(C.glucose, C.glucoseDk), stroke: C.glucoseDk, 'stroke-width': Math.max(1.4, s * 0.12), 'stroke-linejoin': 'round' }, g);
    return g;
  }
  /* other particles in orange juice: acids, vitamins, flavours */
  function juiceBit(parent, kind, s) {
    const g = G(parent);
    if (kind === 'acid') E('path', { d: `M0,${-s} L${s * 0.95},${s * 0.7} L${-s * 0.95},${s * 0.7} Z`, fill: ball('#D2EE72', '#86AE2C'), stroke: '#86AE2C', 'stroke-width': 2, 'stroke-linejoin': 'round' }, g);
    else if (kind === 'vit') { const p = []; for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + i * TAU / 5; p.push([Math.cos(a) * s, Math.sin(a) * s]); } E('path', { d: polyD(p) + 'Z', fill: ball('#FF9CC8', '#C2457E'), stroke: '#C2457E', 'stroke-width': 2, 'stroke-linejoin': 'round' }, g); }
    else { E('circle', { cx: -s * 0.55, r: s * 0.72, fill: ball('#FFAE5C', '#C9661C') }, g); E('circle', { cx: s * 0.55, r: s * 0.72, fill: ball('#FFAE5C', '#C9661C') }, g); }
    return g;
  }
  /* lib molH2O's exact look (same atoms, sizes and shading) in 4 elements instead of 7, for the crowded zoom */
  function water3(parent, r) {
    const g = G(parent), rh = r * 0.62;
    [-1, 1].forEach(sx => E('circle', { cx: sx * r * 0.98, cy: r * 0.72, r: rh, fill: ball(C.hydrogen, C.hydrogenDk), stroke: C.hydrogenDk, 'stroke-width': Math.max(1.5, rh * 0.08) }, g));
    E('circle', { r, fill: ball(C.oxygen, C.oxygenDk), stroke: C.oxygenDk, 'stroke-width': Math.max(1.5, r * 0.08) }, g);
    return g;
  }
  /* a salt particle: small white cube-ish square */
  function saltBit(parent, s) { return E('rect', { x: -s / 2, y: -s / 2, width: s, height: s, rx: s * 0.2, fill: ball('#FFFFFF', '#BFCAD3'), stroke: '#8FA1AF', 'stroke-width': 1.5 }, parent); }
  /* ice cube drawn in 3D, centred, 2s tall */
  function iceCube(parent, s) {
    const g = G(parent), k = s * 0.87;
    E('path', { d: `M${-k},${-s * 0.5} L0,0 L0,${s} L${-k},${s * 0.5} Z`, fill: '#A9DDF6', stroke: '#E8F7FF', 'stroke-width': 1.5, 'stroke-linejoin': 'round' }, g);
    E('path', { d: `M0,0 L${k},${-s * 0.5} L${k},${s * 0.5} L0,${s} Z`, fill: '#7FC4EA', stroke: '#E8F7FF', 'stroke-width': 1.5, 'stroke-linejoin': 'round' }, g);
    E('path', { d: `M0,${-s} L${k},${-s * 0.5} L0,0 L${-k},${-s * 0.5} Z`, fill: '#E4F6FF', stroke: '#FFFFFF', 'stroke-width': 1.5, 'stroke-linejoin': 'round' }, g);
    return g;
  }
  const DROP = 'M0,-17 C9,-5 12,2 12,7 A12,12 0 0 1 -12,7 C-12,2 -9,-5 0,-17 Z';
  function bracket(parent, x, y1, y2, dir, color) {
    return E('path', { d: `M${x + dir * 9},${y1} L${x},${y1} L${x},${y2} L${x + dir * 9},${y2}`, fill: 'none', stroke: color, 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, parent);
  }
  function carton(parent) {
    const g = G(parent);
    E('path', { d: 'M90,0 L128,-18 L128,-268 L90,-250 Z', fill: '#C25E10', stroke: '#9C4A0C', 'stroke-width': 2, 'stroke-linejoin': 'round' }, g);
    E('path', { d: 'M90,-250 L128,-268 L110,-302 Z', fill: '#D9741A', stroke: '#9C4A0C', 'stroke-width': 2, 'stroke-linejoin': 'round' }, g);
    E('path', { d: 'M-90,-250 L90,-250 L110,-302 L-70,-302 Z', fill: '#FFB85C', stroke: '#C9600E', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, g);
    E('rect', { x: -74, y: -318, width: 188, height: 16, rx: 4, fill: '#FFD08A', stroke: '#C9600E', 'stroke-width': 2 }, g);
    E('rect', { x: -90, y: -250, width: 180, height: 250, rx: 4, fill: linGrad('#FFA733', '#EF7412', true), stroke: '#C9600E', 'stroke-width': 2.5 }, g);
    E('ellipse', { cx: 34, cy: -277, rx: 19, ry: 9, fill: ball('#7BE0A6', '#2C8C4C'), stroke: '#2C8C4C', 'stroke-width': 2 }, g);
    T(g, 0, -184, '100%', { size: 50, weight: 700, anchor: 'middle', fill: '#FFFFFF' });
    T(g, 0, -140, 'PURE', { size: 36, weight: 700, anchor: 'middle', fill: '#FFF3DC', ls: 4 });
    E('circle', { cx: 0, cy: -66, r: 34, fill: ball('#FFC067', '#E0700C'), stroke: '#FFE0A8', 'stroke-width': 2.5 }, g);
    E('ellipse', { cx: 0, cy: 0, rx: 13, ry: 6, fill: C.plant, transform: 'translate(15 -103) rotate(-30)' }, g);
    return g;
  }
  function shaker(parent) {
    const g = G(parent);
    E('rect', { x: -30, y: -42, width: 60, height: 92, rx: 14, fill: linGrad('#F4F7FA', '#BCCAD4'), stroke: '#FFFFFF', 'stroke-width': 2 }, g);
    E('rect', { x: -30, y: 2, width: 60, height: 20, fill: '#4CC9F0', opacity: 0.8 }, g);
    E('rect', { x: -32, y: -70, width: 64, height: 30, rx: 10, fill: linGrad('#E1E8EE', '#8A9BA8'), stroke: '#EEF4F7', 'stroke-width': 2 }, g);
    [-13, 0, 13].forEach(x => E('circle', { cx: x, cy: -56, r: 3.2, fill: '#44525E' }, g));
    return g;
  }
  function capsule(parent, s) {
    const g = G(parent); tr(g, 0, 0, s || 1);
    const w = 62, r = 24;
    E('rect', { x: -w, y: -r, width: 2 * w, height: 2 * r, rx: r, fill: ball('#F4F7FA', '#AEBDC9') }, g);
    E('path', { d: `M0,${-r} L${-w + r},${-r} A${r},${r} 0 0 0 ${-w + r},${r} L0,${r} Z`, fill: ball('#FF7A93', '#B5374F') }, g);
    E('rect', { x: -w, y: -r, width: 2 * w, height: 2 * r, rx: r, fill: 'none', stroke: '#FFFFFF', 'stroke-width': 2.5, opacity: 0.8 }, g);
    E('path', { d: `M${-w + 16},${-r * 0.45} L${w - 16},${-r * 0.45}`, stroke: '#FFFFFF', 'stroke-width': 5, 'stroke-linecap': 'round', opacity: 0.45 }, g);
    return g;
  }

  /* ================= A. juice -> pure water -> impure (object on the left, zoom lens on the right) ================= */
  const A = G(root);
  const ZX = 850, ZY = 440, ZR = 170, SX = 300, SY = 540, SR = 30;
  const coneG = G(A);
  {
    const dx = ZX - SX, dy = ZY - SY, d = Math.hypot(dx, dy), th = Math.atan2(dy, dx), ph = Math.acos((SR - ZR) / d);
    const p = (cx, cy, r, a) => (cx + Math.cos(a) * r).toFixed(1) + ',' + (cy + Math.sin(a) * r).toFixed(1);
    const a1 = p(SX, SY, SR, th + ph), a2 = p(ZX, ZY, ZR, th + ph), b2 = p(ZX, ZY, ZR, th - ph), b1 = p(SX, SY, SR, th - ph);
    E('path', { d: `M${a1} L${a2} L${b2} L${b1} Z`, fill: 'rgba(228,237,242,0.07)' }, coneG);
    E('path', { d: `M${a1} L${a2} M${b1} L${b2}`, stroke: '#9FB7C6', 'stroke-width': 2.5, opacity: 0.75 }, coneG);
  }
  const cartonG = G(A); carton(cartonG);
  const beakG = G(A); tr(beakG, 300, 482);
  beaker(beakG, 210, 250, { level: 0.72, liquid: C.water });
  const speckG = G(beakG), specks = [];
  { const r = rng(19); for (let k = 0; k < 12; k++) specks.push(E('circle', { cx: ((r() - 0.5) * 150).toFixed(1), cy: (-22 + r() * 130).toFixed(1), r: (2.6 + r() * 1.6).toFixed(1), fill: '#FFFFFF' }, speckG)); }
  const srcRing = E('circle', { cx: SX, cy: SY, r: SR, fill: 'rgba(228,237,242,0.10)', stroke: '#E4EDF2', 'stroke-width': 4, 'stroke-dasharray': '7 5' }, A);
  // shaker and falling grains
  const shakeG = G(A), shakerArt = shaker(shakeG);
  const grains = []; { const r = rng(23); for (let k = 0; k < 9; k++) grains.push({ el: E('rect', { x: -2.5, y: -2.5, width: 5, height: 5, rx: 1, fill: '#FFFFFF' }, A), dx: (r() - 0.5) * 22, ph: k / 9 }); }

  // the zoom lens
  const lensG = G(A);
  E('circle', { cx: ZX, cy: ZY, r: ZR, fill: '#0B1D28' }, lensG);
  const lc = clipCircle(ZX, ZY, ZR - 5);
  const inLens = G(lensG, { 'clip-path': lc.url });
  E('circle', { cx: ZX, cy: ZY, r: ZR * 1.05, fill: glow('#2E6F8A'), opacity: 0.35 }, inLens);
  E('circle', { cx: ZX, cy: ZY, r: ZR, fill: 'none', stroke: '#9FB3C2', 'stroke-width': 12 }, lensG);
  E('circle', { cx: ZX, cy: ZY, r: ZR - 8, fill: 'none', stroke: '#5E7484', 'stroke-width': 3 }, lensG);
  const pts = [];
  { const r = rng(83);
    for (let j = -3; j <= 3; j++) for (let i = -4; i <= 4; i++) {
      const x = i * 50 + (j & 1 ? 25 : 0), y = j * 44;
      if (Math.hypot(x, y) > 135) continue;
      pts.push({ x: ZX + x + (r() - 0.5) * 10, y: ZY + y + (r() - 0.5) * 8, ph: r() * TAU, rot: (r() - 0.5) * 60 });
    } }
  const order = pts.map((p, i) => i);
  { const r = rng(5); for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); const tmp = order[i]; order[i] = order[j]; order[j] = tmp; } }
  const extraIdx = new Set(order.slice(0, 10));
  const KINDS = ['sugar', 'acid', 'vit', 'flav', 'sugar', 'acid', 'flav', 'vit', 'sugar', 'acid'];
  const waters = [], extras = [];
  pts.forEach((p, i) => {
    const late = extraIdx.has(i);
    waters.push({ el: water3(inLens, 10), p, late });
    if (late) { const kind = KINDS[extras.length]; extras.push({ el: kind === 'sugar' ? sugar(inLens, 10) : juiceBit(inLens, kind, 11), p }); }
  });
  const saltT = [];
  { const cands = [];
    for (let y = ZY - 112; y <= ZY + 112; y += 6) for (let x = ZX - 112; x <= ZX + 112; x += 6) {
      if (Math.hypot(x - ZX, y - ZY) > 114) continue;
      let m = 1e9; pts.forEach(p => { m = Math.min(m, Math.hypot(x - p.x, (y - p.y) * 1.3)); });
      cands.push([x, y, m]);
    }
    cands.sort((a, b) => b[2] - a[2]);
    for (const c of cands) { if (saltT.length >= 6) break; if (saltT.every(s => Math.hypot(s[0] - c[0], s[1] - c[1]) > 64)) saltT.push(c); }
  }
  const salts = saltT.map((s, k) => { const g = G(inLens); const halo = E('circle', { r: 21, fill: glow('#FFFFFF') }, g); saltBit(g, 18); return { el: g, halo, x: s[0], y: s[1], k }; });

  // words
  const chipNA = chip(A, 'pure = nothing added', { size: 28, fill: C.card2, stroke: '#FFB85C', sw: 2.5 }); tr(chipNA, 300, 674);
  const qBadge = G(A);
  E('circle', { r: 27, fill: C.energy, stroke: '#FFF7C2', 'stroke-width': 3 }, qBadge);
  T(qBadge, 0, 13, '?', { size: 40, weight: 700, anchor: 'middle', fill: '#3A3000' });
  const strictT = T(A, ZX, 238, 'in chemistry: much stricter', { size: 30, weight: 700, anchor: 'middle', fill: C.energy });
  const juiceNote = T(A, ZX, 664, 'water, sugars, acids, vitamins…', { size: 27, weight: 600, anchor: 'middle', fill: C.muted });
  const hdrPure = T(A, 600, 160, 'pure substance', { size: 50, weight: 700, anchor: 'middle', fill: C.good });
  const subPure = T(A, 600, 210, 'a single element or a single compound', { size: 32, weight: 600, anchor: 'middle' });
  const onlyG = G(A);
  { const w1 = textWidth('only', 32, FD, 700), w2 = textWidth('H2O', 34, FD, 700) * 0.88, x0 = ZX - (w1 + 12 + w2) / 2;
    T(onlyG, x0, 666, 'only', { size: 32, weight: 700, fill: C.water });
    formula(onlyG, x0 + w1 + 12, 666, 'H2O', { size: 34, weight: 700, anchor: 'start' }); }
  const plusG = G(A);
  { const w1 = textWidth('H2O', 34, FD, 700) * 0.88, w2 = textWidth('+ salt', 32, FD, 700), x0 = ZX - (w1 + 12 + w2) / 2;
    formula(plusG, x0, 666, 'H2O', { size: 34, weight: 700, anchor: 'start' });
    T(plusG, x0 + w1 + 12, 666, '+ salt', { size: 32, weight: 700, fill: '#E4EDF2' }); }
  const lblPure = T(A, 300, 664, 'pure water', { size: 30, weight: 700, anchor: 'middle', fill: C.water });
  const lblSalty = T(A, 300, 664, 'salty water', { size: 30, weight: 700, anchor: 'middle', fill: '#E4EDF2' });
  const impA = G(A), impB = G(A);
  { const s = 50, w1 = textWidth('impure', s, FD, 700), w2 = textWidth('= a mixture', s, FD, 700), x0 = 600 - (w1 + 20 + w2) / 2;
    T(impA, x0, 178, 'impure', { size: s, weight: 700, fill: '#FF8A80' });
    T(impB, x0 + w1 + 20, 178, '= a mixture', { size: s, weight: 700 }); }

  /* ================= B. melting and boiling points: thermometer + heating curve ================= */
  const B = G(root);
  const tellHdr = T(B, 600, 175, 'How can you tell?', { size: 52, weight: 700, anchor: 'middle' });
  const GX0 = 360, GX1 = 1120, GY0 = 692, GYT = 140;
  const yT = v => 582 - 3.6 * v;
  const axes = G(B);
  const axLine = E('path', { d: `M${GX0},${GYT} L${GX0},${GY0} L${GX1},${GY0}`, fill: 'none', stroke: C.muted, 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', pathLength: 1, 'stroke-dasharray': '1 1' }, axes);
  const axHeads = G(axes);
  E('path', { d: `M${GX0 - 9},${GYT + 15} L${GX0},${GYT} L${GX0 + 9},${GYT + 15} M${GX1 - 15},${GY0 - 9} L${GX1},${GY0} L${GX1 - 15},${GY0 + 9}`, fill: 'none', stroke: C.muted, 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, axHeads);
  T(axHeads, GX0 + 18, 132, 'temperature', { size: 28, weight: 600, fill: C.muted });
  T(axHeads, GX1 - 6, GY0 - 16, 'heating time', { size: 28, weight: 600, fill: C.muted, anchor: 'end' });
  const guides = G(axes);
  [0, 100].forEach(v => E('line', { x1: GX0, x2: 1070, y1: yT(v), y2: yT(v), stroke: C.faint, 'stroke-width': 2, 'stroke-dasharray': '7 9' }, guides));
  const lab0 = T(axes, GX0 - 14, yT(0) + 10, '0 °C', { size: 30, weight: 700, anchor: 'end' });
  const lab100 = T(axes, GX0 - 14, yT(100) + 10, '100 °C', { size: 30, weight: 700, anchor: 'end' });
  const PURE_T = [[375, -28], [412, 0], [620, 0], [800, 100], [975, 100], [1030, 108]];
  const IMP_T = [[375, -28], [392, -20], [650, -6], [820, 106], [1010, 118]];
  const tempAt = (ptsT, x) => { if (x <= ptsT[0][0]) return ptsT[0][1]; for (let i = 1; i < ptsT.length; i++) if (x <= ptsT[i][0]) { const a = ptsT[i - 1], b = ptsT[i]; return lerp(a[1], b[1], (x - a[0]) / (b[0] - a[0])); } return ptsT[ptsT.length - 1][1]; };
  const toXY = ptsT => ptsT.map(p => [p[0], yT(p[1])]);
  const clipG = clipRect(GX0, 100, 0, 620), clipR = clipRect(GX0, 100, 0, 620);
  const curves = G(B);
  const glowM = E('line', { x1: 412, x2: 620, y1: yT(0), y2: yT(0), stroke: C.good, 'stroke-width': 20, 'stroke-linecap': 'round', opacity: 0.28, 'clip-path': clipG.url }, curves);
  const glowBo = E('line', { x1: 800, x2: 975, y1: yT(100), y2: yT(100), stroke: C.good, 'stroke-width': 20, 'stroke-linecap': 'round', opacity: 0.28, 'clip-path': clipG.url }, curves);
  const lineG = E('path', { d: polyD(toXY(PURE_T)), fill: 'none', stroke: C.good, 'stroke-width': 7, 'stroke-linejoin': 'round', 'stroke-linecap': 'round', 'clip-path': clipG.url }, curves);
  const lineR = E('path', { d: polyD(toXY(IMP_T)), fill: 'none', stroke: '#FF6070', 'stroke-width': 6, 'stroke-dasharray': '16 10', 'stroke-linejoin': 'round', 'clip-path': clipR.url }, curves);
  // legend
  const legP = G(B); E('line', { x1: 422, x2: 474, y1: 197, y2: 197, stroke: C.good, 'stroke-width': 7, 'stroke-linecap': 'round' }, legP); T(legP, 488, 207, 'pure', { size: 28, weight: 700, fill: C.good });
  const legI = G(B); E('line', { x1: 422, x2: 474, y1: 243, y2: 243, stroke: '#FF6070', 'stroke-width': 6, 'stroke-dasharray': '14 8' }, legI); T(legI, 488, 253, 'impure', { size: 28, weight: 700, fill: '#FF8A94' });
  // the thermometer (centre stage while testing, then beside the graph)
  const thermG = G(B), th = thermometer(thermG, 360, C.bad);
  const readout = T(B, 150, 254, '', { size: 36, weight: 700, anchor: 'middle' });
  const chipM = chip(B, 'melting point', { size: 30, fill: C.card2, stroke: '#9FD8FF', sw: 2.5 });
  const chipBo = chip(B, 'boiling point', { size: 30, fill: C.card2, stroke: C.heat, sw: 2.5 });
  // things riding on the line's head: ice cube (melts), droplet (boils), steam
  const iceG = G(B), puddle = E('ellipse', { cx: 0, cy: 0, rx: 18, ry: 6, fill: C.water, opacity: 0.85 }, iceG), cube = G(iceG); iceCube(cube, 20);
  // icons beside the chips while testing
  const icoM = G(B); iceCube(icoM, 19);
  const icoB = G(B); E('path', { d: DROP, fill: ball(C.water, C.waterDk), stroke: '#BFEFFF', 'stroke-width': 2, transform: 'translate(0 8)' }, icoB);
  const icoSteam = heatWaves(icoB, { n: 3, h: 40, spacing: 13, color: '#DDEFF8', width: 4, speed: 0.8 }); tr(icoSteam, 0, -14);
  // the impure sample: salty ice
  const saltyG = G(B); tr(saltyG, 160, 455);
  iceCube(saltyG, 40);
  [[-22, -18], [8, -26], [-12, 8], [20, 2], [-26, 22], [14, 30], [-2, -6]].forEach(([x, y], k) => E('rect', { x: x - 3.5, y: y - 3.5, width: 7, height: 7, rx: 1.5, fill: '#FFFFFF', stroke: '#8FA1AF', 'stroke-width': 1, transform: `rotate(${k * 27} ${x} ${y})` }, saltyG));
  T(saltyG, 0, 92, 'salty ice', { size: 30, weight: 700, anchor: 'middle', fill: '#FF8A94' });
  const dropG = G(B), dropEl = E('path', { d: DROP, fill: ball(C.water, C.waterDk), stroke: '#BFEFFF', 'stroke-width': 2 }, dropG);
  const steam = heatWaves(dropG, { n: 3, h: 48, spacing: 15, color: '#DDEFF8', width: 4, speed: 0.8 }); tr(steam, 0, -22);
  // impurity annotations
  const IMPC = '#FF8A94';
  const lowerG = G(B), lowerA = arrow(lowerG, 515, 498, 515, yT(tempAt(IMP_T, 515)) - 7, { color: IMPC, width: 5 });
  T(lowerG, 515, 482, 'lower', { size: 32, weight: 700, anchor: 'middle', fill: IMPC });
  const higherG = G(B), higherA = arrow(higherG, 915, 272, 915, yT(tempAt(IMP_T, 915)) + 7, { color: IMPC, width: 5 });
  T(higherG, 915, 306, 'higher', { size: 32, weight: 700, anchor: 'middle', fill: IMPC });
  const rangeM = G(B); bracket(rangeM, 676, yT(-6), yT(-20), -1, IMPC); T(rangeM, 690, 640, 'range', { size: 30, weight: 700, fill: IMPC });
  const rangeBo = G(B); bracket(rangeBo, 796, yT(118), yT(106), 1, IMPC); T(rangeBo, 784, 190, 'range', { size: 30, weight: 700, fill: IMPC, anchor: 'end' });

  /* ================= C. gritting an icy road ================= */
  const Cr = G(root);
  const moon = G(Cr); tr(moon, 870, 168);
  E('circle', { r: 120, fill: glow('#C9DCEA'), opacity: 0.6 }, moon);
  E('circle', { r: 40, fill: ball('#F4F7FA', '#AFC0CD') }, moon);
  E('circle', { cx: -12, cy: 8, r: 7, fill: '#C9D6DE', opacity: 0.7 }, moon); E('circle', { cx: 13, cy: -10, r: 5, fill: '#C9D6DE', opacity: 0.7 }, moon);
  const stars = []; { const r = rng(31); for (let k = 0; k < 10; k++) stars.push({ el: E('circle', { cx: (80 + r() * 1040).toFixed(1), cy: (125 + r() * 230).toFixed(1), r: (1.6 + r() * 2).toFixed(1), fill: '#E4F1FA' }, Cr), ph: r() }); }
  const ROAD0 = 520, ROAD1 = 612;
  E('rect', { x: -20, y: ROAD1, width: 1240, height: 160, fill: '#0E2626' }, Cr);
  E('rect', { x: -20, y: ROAD0, width: 1240, height: ROAD1 - ROAD0, fill: '#2B3640' }, Cr);
  E('rect', { x: -20, y: ROAD0 - 5, width: 1240, height: 7, fill: '#8193A1' }, Cr);
  E('rect', { x: -20, y: ROAD1 - 2, width: 1240, height: 7, fill: '#8193A1' }, Cr);
  for (let i = 0; i < 14; i++) E('rect', { x: i * 92 + 12, y: 563, width: 52, height: 6, rx: 3, fill: '#E9EEF2', opacity: 0.6 }, Cr);
  const PATCH = [[150, 590], [340, 545], [545, 592], [745, 546], [930, 590]];
  const patches = PATCH.map(([x, y], i) => {
    const g = G(Cr); tr(g, x, y);
    const pud = G(g);
    E('ellipse', { rx: 86, ry: 13, fill: '#25628C', opacity: 0.9 }, pud);
    const rip = E('ellipse', { rx: 40, ry: 6, fill: 'none', stroke: '#7FC4EA', 'stroke-width': 2 }, pud);
    const ice = G(g);
    E('ellipse', { rx: 86, ry: 13, fill: '#CFEFFF', opacity: 0.8 }, ice);
    E('path', { d: 'M-50,-3 L-20,-6 M10,4 L44,0', stroke: '#FFFFFF', 'stroke-width': 3, 'stroke-linecap': 'round', opacity: 0.9 }, ice);
    return { g, ice, pud, rip, x, i };
  });
  const iceLbl = G(Cr); labelLine(iceLbl, 150, 690, 150, 600, 'ice', { size: 30, fill: '#CFEFFF', anchor: 'middle' });
  // the gritter lorry: origin on the road under its rear end, facing right
  const truck = G(Cr), truckIn = G(truck); tr(truckIn, 0, 0, 0.92);
  const beaconGlow = E('circle', { cx: 222, cy: -160, r: 40, fill: glow('#FFB13B') }, truckIn);
  E('rect', { x: 0, y: -68, width: 294, height: 20, rx: 5, fill: '#3A4752' }, truckIn);
  E('path', { d: 'M8,-68 L8,-150 L178,-150 L178,-68 Z', fill: ball('#FF9F2E', '#C9600E'), stroke: '#FFD08A', 'stroke-width': 3, 'stroke-linejoin': 'round' }, truckIn);
  E('path', { d: 'M16,-150 Q92,-180 170,-150 Z', fill: '#F4F7FA', stroke: '#C9D6DE', 'stroke-width': 2 }, truckIn);
  T(truckIn, 93, -98, 'GRITTER', { size: 27, weight: 700, anchor: 'middle', fill: '#3A2200' });
  E('path', { d: 'M186,-68 L186,-142 Q186,-150 194,-150 L250,-150 Q262,-150 268,-138 L294,-96 L294,-68 Z', fill: ball('#FFD84A', '#D9A21A'), stroke: '#FFF0A8', 'stroke-width': 3, 'stroke-linejoin': 'round' }, truckIn);
  E('path', { d: 'M232,-140 L253,-140 Q259,-140 263,-133 L282,-102 L232,-102 Z', fill: '#9FD8FF', stroke: '#E4F6FF', 'stroke-width': 2, 'stroke-linejoin': 'round' }, truckIn);
  E('path', { d: 'M212,-150 L212,-158 Q222,-172 232,-158 L232,-150 Z', fill: '#FFB13B', stroke: '#FFE07A', 'stroke-width': 2 }, truckIn);
  E('rect', { x: 282, y: -84, width: 14, height: 10, rx: 3, fill: '#FFF7C2' }, truckIn);
  const hubs = [60, 240].map(x => { const w = G(truckIn); tr(w, x, -28); E('circle', { r: 28, fill: '#1B232A', stroke: '#56636E', 'stroke-width': 4 }, w); const hub = G(w); E('circle', { r: 10, fill: '#9DB0BF' }, hub); E('path', { d: 'M-19,0 L19,0 M0,-19 L0,19', stroke: '#9DB0BF', 'stroke-width': 4, 'stroke-linecap': 'round' }, hub); return hub; });
  const spinner = G(truckIn); tr(spinner, -10, -52);
  const spinDisc = E('ellipse', { rx: 18, ry: 6, fill: '#8E9CA9', stroke: '#C9D6DE', 'stroke-width': 2 }, spinner);
  const spray = []; { const r = rng(47); for (let k = 0; k < 24; k++) { const vx = -(120 + r() * 170), vy = -(30 + r() * 110), land = 562 + r() * 44; spray.push({ el: E('rect', { x: -3, y: -3, width: 6, height: 6, rx: 1.5, fill: '#FFFFFF' }, Cr), k, vx, vy, land, tl: (-vy + Math.sqrt(vy * vy + 1680 * (land - 552))) / 840 }); } }
  const roadTh = G(Cr); tr(roadTh, 1112, 392);
  const rth = thermometer(roadTh, 170, '#5BB8F5'); rth.set(0.16);
  const roadRead = T(Cr, 1074, 300, '−5 °C', { size: 46, weight: 700, anchor: 'end', fill: '#9FD8FF' });
  const roadChip = chip(Cr, 'salt lowers the melting point of ice', { size: 30, fill: C.card2, stroke: '#E4EDF2', sw: 2.5 }); tr(roadChip, 520, 175);
  const roadNote = T(Cr, 640, 690, 'the ice melts, even below 0 °C', { size: 32, weight: 700, anchor: 'middle', fill: C.good });

  /* ================= D. checking a medicine ================= */
  const Dg = G(root);
  const capG = G(Dg); tr(capG, 190, 236, 1, -24); capsule(capG, 1);
  const capLbl = T(Dg, 190, 318, 'medicine', { size: 30, weight: 700, anchor: 'middle' });
  const app = G(Dg); tr(app, 410, 500);
  E('rect', { x: -6, y: -176, width: 12, height: 80, rx: 6, fill: 'rgba(200,230,250,0.25)', stroke: '#CFE7F5', 'stroke-width': 2.5 }, app);
  E('rect', { x: -130, y: -120, width: 260, height: 240, rx: 22, fill: linGrad('#8796A3', '#56636E', true), stroke: '#AFC0CD', 'stroke-width': 3 }, app);
  E('circle', { cx: 0, cy: -36, r: 62, fill: '#0B1E2A' }, app);
  const winClip = clipCircle(0, -36, 56);
  const winIn = G(app, { 'clip-path': winClip.url });
  E('rect', { x: -22, y: -110, width: 44, height: 120, rx: 22, fill: 'rgba(200,230,250,0.16)', stroke: '#CFE7F5', 'stroke-width': 3 }, winIn);
  const powder = G(winIn);
  { const r = rng(13); E('path', { d: 'M-18,-28 L18,-28 L18,-12 A18,18 0 0 1 -18,-12 Z', fill: '#EEF3F6' }, powder); for (let k = 0; k < 9; k++) E('circle', { cx: (-13 + r() * 26).toFixed(1), cy: (-30 + r() * 4).toFixed(1), r: (3 + r() * 2).toFixed(1), fill: '#FFFFFF' }, powder); }
  const melt = E('path', { d: 'M-18,-18 L18,-18 L18,-12 A18,18 0 0 1 -18,-12 Z', fill: 'rgba(200,236,255,0.6)', stroke: '#E4F6FF', 'stroke-width': 2 }, winIn);
  E('circle', { cx: 0, cy: -36, r: 62, fill: 'none', stroke: '#D3DEE5', 'stroke-width': 7 }, app);
  E('rect', { x: -96, y: 48, width: 192, height: 54, rx: 9, fill: '#0E2B1A', stroke: '#5E7A8C', 'stroke-width': 2 }, app);
  const lcd = T(app, 0, 88, '20 °C', { size: 34, weight: 700, anchor: 'middle', fill: '#7CFF9E' });
  const heatGlow = E('ellipse', { cx: 0, cy: 118, rx: 120, ry: 16, fill: glow(C.heat), opacity: 0 }, app);
  const appLbl = T(Dg, 410, 668, 'melting-point test', { size: 28, weight: 600, anchor: 'middle', fill: C.muted });
  const capArrow = arrow(Dg, 250, 286, 398, 318, { color: C.muted, width: 4, bend: -40 });
  const mg = G(Dg);
  const MX0 = 650, MX1 = 1120, MY0 = 610, MYT = 222, MEXP = 380;
  const mgAx = E('path', { d: `M${MX0},${MYT} L${MX0},${MY0} L${MX1},${MY0}`, fill: 'none', stroke: C.muted, 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', pathLength: 1, 'stroke-dasharray': '1 1' }, mg);
  const mgLab = G(mg);
  T(mgLab, MX0 + 14, MYT - 8, 'temperature', { size: 28, weight: 600, fill: C.muted });
  T(mgLab, MX1 - 4, MY0 - 14, 'time', { size: 28, weight: 600, fill: C.muted, anchor: 'end' });
  const expG = G(mg);
  E('line', { x1: MX0, x2: MX1 - 10, y1: MEXP, y2: MEXP, stroke: C.energy, 'stroke-width': 3, 'stroke-dasharray': '9 8' }, expG);
  const expLbl = T(expG, MX1 - 6, MEXP + 34, 'expected: 136 °C', { size: 28, weight: 700, anchor: 'end', fill: C.energy });
  const MC = [[660, 590], [820, MEXP], [960, MEXP], [1070, 318]];
  const mClip = clipRect(MX0, 200, 0, 420);
  const mGlow = E('line', { x1: 820, x2: 960, y1: MEXP, y2: MEXP, stroke: C.good, 'stroke-width': 20, 'stroke-linecap': 'round', opacity: 0.3, 'clip-path': mClip.url }, mg);
  const mLine = E('path', { d: polyD(MC), fill: 'none', stroke: C.good, 'stroke-width': 7, 'stroke-linejoin': 'round', 'stroke-linecap': 'round', 'clip-path': mClip.url }, mg);
  const sharpLbl = T(mg, 890, MEXP - 26, 'one sharp step', { size: 28, weight: 700, anchor: 'middle', fill: C.good });
  const verdict = G(mg);
  const vChip = chip(verdict, 'very likely pure', { size: 30, fill: '#163F2A', stroke: C.good, sw: 2.5 }); tr(vChip, 885, 508);
  const vTick = tick(verdict, 20); tr(vTick, 885 + vChip.w / 2 + 34, 506);
  const yAtM = x => { for (let i = 1; i < MC.length; i++) if (x <= MC[i][0]) { const a = MC[i - 1], b = MC[i]; return lerp(a[1], b[1], (x - a[0]) / (b[0] - a[0])); } return MC[MC.length - 1][1]; };
  const tempM = y => 136 - (y - MEXP) / 1.9;

  /* ================= E. is anything 100% pure? ================= */
  const Eg = G(root);
  const q1 = T(Eg, 0, 172, '100% pure?', { size: 60, weight: 700 });
  const q2 = T(Eg, 0, 172, 'Not quite.', { size: 44, weight: 700, fill: '#FF8A80' });
  const QW1 = textWidth('100% pure?', 60, FD, 700), QW2 = textWidth('Not quite.', 44, FD, 700);
  const FX = 160, FY = 205, FW = 880, FH = 176, FS = 22;
  const pid1 = uid(), pid2 = uid();
  const pat1 = E('pattern', { id: pid1, x: FX, y: FY, width: FS, height: FS, patternUnits: 'userSpaceOnUse' }, defs());
  E('circle', { cx: FS / 2, cy: FS / 2, r: 6.5, fill: ball('#A9DCFA', '#3C8DBF') }, pat1);
  const pat2 = E('pattern', { id: pid2, x: FX, y: FY, width: FS, height: FS, patternUnits: 'userSpaceOnUse' }, defs());
  E('circle', { cx: FS / 2, cy: FS / 2, r: 6.5, fill: ball('#A9DCFA', '#3C8DBF') }, pat2);
  const field = G(Eg);
  E('rect', { x: FX - 8, y: FY - 8, width: FW + 16, height: FH + 16, rx: 22, fill: '#0B2230', stroke: C.line, 'stroke-width': 2 }, field);
  E('rect', { x: FX, y: FY, width: FW, height: FH, fill: `url(#${pid1})` }, field);
  const ODD = [FX + FS * 31 + FS / 2, FY + FS * 4 + FS / 2], MAG = 2.4, LR = 58;
  E('circle', { cx: ODD[0], cy: ODD[1], r: 7, fill: ball('#FFB36B', '#C9661C') }, field);
  const mLens = G(Eg);
  const mlClip = clipCircle(0, 0, LR - 3);
  const mlIn = G(mLens, { 'clip-path': mlClip.url });
  E('circle', { r: LR, fill: '#0B2230' }, mlIn);
  const magRect = E('rect', { x: 0, y: 0, width: 2 * LR, height: 2 * LR, fill: `url(#${pid2})` }, mlIn);
  const magOdd = E('circle', { r: 7 * MAG, fill: ball('#FFB36B', '#C9661C') }, mlIn);
  const findRing = E('circle', { r: 7 * MAG + 9, fill: 'none', stroke: C.energy, 'stroke-width': 4, 'stroke-dasharray': '8 6' }, mlIn);
  const lensRim = E('circle', { r: LR, fill: 'none', stroke: '#E4EDF2', 'stroke-width': 8 }, mLens);
  const lensHandle = E('line', { stroke: '#C9D6DE', 'stroke-width': 16, 'stroke-linecap': 'round' }, mLens);
  mLens.insertBefore(lensHandle, mLens.firstChild);
  const traceChip = chip(Eg, 'a tiny trace', { size: 30, fill: C.card2, stroke: C.energy, sw: 2.5, color: C.energy });
  const jobLine = T(Eg, 600, 425, '“pure enough” depends on the job', { size: 30, weight: 700, anchor: 'middle', fill: C.energy });
  function tapIcon(p) {
    E('rect', { x: -58, y: -40, width: 20, height: 46, rx: 5, fill: '#8A9BA8' }, p);
    E('path', { d: 'M-40,-18 L16,-18 Q34,-18 34,0 L34,8', fill: 'none', stroke: linGrad('#E1E8EE', '#8A9BA8', true), 'stroke-width': 15, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, p);
    E('rect', { x: -12, y: -42, width: 14, height: 16, rx: 3, fill: '#C9D6DE' }, p);
    E('rect', { x: -26, y: -48, width: 42, height: 9, rx: 4.5, fill: '#E1E8EE' }, p);
    const d = E('path', { d: DROP, fill: ball(C.water, C.waterDk), stroke: '#BFEFFF', 'stroke-width': 2 }, p);
    return d;
  }
  function chipIcon(p) {
    let pins = '';
    for (let i = 0; i < 4; i++) { const o = -24 + i * 16; pins += `M${o},-46 L${o},-36 M${o},36 L${o},46 M-46,${o} L-36,${o} M36,${o} L46,${o} `; }
    E('path', { d: pins, stroke: '#C9D6DE', 'stroke-width': 6, 'stroke-linecap': 'round' }, p);
    E('rect', { x: -38, y: -38, width: 76, height: 76, rx: 8, fill: '#2A3A47', stroke: '#8FA3B3', 'stroke-width': 3 }, p);
    E('rect', { x: -22, y: -22, width: 44, height: 44, rx: 4, fill: '#1C2A35', stroke: C.good, 'stroke-width': 2.5 }, p);
    E('path', { d: 'M-22,-8 L-8,-8 L-8,8 L8,8 M8,-22 L8,-8 L22,-8', fill: 'none', stroke: C.good, 'stroke-width': 2, opacity: 0.8 }, p);
  }
  const JOBS = [
    { x: 300, name: 'tap water', val: 'safe to drink', level: 0.5, color: C.water, draw: p => { tapIcon(p); } },
    { x: 600, name: 'medicine', val: 'very pure', level: 0.84, color: '#FF8FAB', draw: p => { const c = G(p); tr(c, 0, 0, 0.62, -24); capsule(c, 1); } },
    { x: 900, name: 'computer chip', val: '99.9999999% pure', level: 1, color: C.energy, draw: p => { const c = G(p); tr(c, 0, 0, 0.86); chipIcon(c); } },
  ].map(j => {
    const g = G(Eg); tr(g, j.x, 0);
    card(g, -135, 448, 270, 242, { fill: C.card, stroke: C.line });
    const art = G(g); tr(art, 0, 500); j.draw(art);
    T(g, 0, 574, j.name, { size: 29, weight: 700, anchor: 'middle' });
    T(g, 0, 604, 'purity needed', { size: 24, weight: 600, anchor: 'middle', fill: C.muted, font: FB });
    const m = meter(g, { w: 200, h: 22, color: j.color }); tr(m, -100, 616);
    T(g, 0, 670, j.val, { size: 25, weight: 600, anchor: 'middle', fill: j.color, font: FB });
    return Object.assign(j, { g, m });
  });

  /* ================= update ================= */
  const KP = [[mid('sharp', 0.17), 375], [mid('sharp', 0.37), 412], [mid('sharp', 0.62), 620], [mid('sharp', 0.72), 800], [mid('sharp', 0.92), 975], [mid('sharp', 0.99), 1030]];
  const KR = [[mid('impurity', 0.03), 375], [mid('impurity', 0.08), 392], [mid('impurity', 0.33), 650], [mid('impurity', 0.43), 820], [mid('impurity', 0.62), 1010]];
  const KM = [[mid('check', 0.2), 660], [mid('check', 0.4), 820], [mid('check', 0.74), 960], [mid('check', 0.9), 1070]];
  const TR0 = at('roads') - 0.1, TR1 = at('check') - 0.5, TX0 = -330, TX1 = 1250, TV = (TX1 - TX0) / (TR1 - TR0);
  const truckX = tt => TX0 + TV * clamp(tt - TR0, 0, TR1 - TR0);

  return t => {
    /* ---- A ---- */
    const aA = Math.min(P(t, S.first - 0.6, 0.6, linear), 1 - P(t, at('test') - 0.15, 0.45, linear));
    op(A, aA);
    if (aA > 0) {
      const cIn = P(t, at('juice'), 0.6, pop), cOut = P(t, at('def') - 0.1, 0.5, linear);
      op(cartonG, clamp(cIn * 2) * (1 - cOut)); tr(cartonG, 300, 612 + (1 - clamp(cIn)) * 26);
      const qb = P(t, mid('juice', 0.58), 0.5, pop);
      op(qBadge, clamp(qb * 2) * (1 - cOut)); tr(qBadge, 386, 462, Math.max(0.01, qb), (1 - clamp(qb)) * -30 + 8 * Math.sin(t * 2.2) * AMP);
      op(chipNA, P(t, mid('juice', 0.16), 0.5, linear) * (1 - cOut));
      const bIn = P(t, at('def') + 0.05, 0.5, linear);
      op(beakG, bIn);
      const lensIn = P(t, mid('juice', 0.46), 0.7, pop);
      op(lensG, clamp(lensIn * 2)); scaleAt(lensG, ZX, ZY, 0.5 + 0.5 * lensIn);
      op(coneG, P(t, mid('juice', 0.46), 0.5, linear)); op(srcRing, P(t, mid('juice', 0.42), 0.4, linear));
      op(strictT, P(t, mid('juice', 0.6), 0.5, linear) * (1 - cOut));
      op(juiceNote, P(t, mid('juice', 0.74), 0.5, linear) * (1 - cOut));
      // lens contents: juice particles leave, water molecules take their place; then salt arrives
      const exOut = P(t, at('def') + 0.15, 0.8, linear);
      waters.forEach(w => {
        const a = w.late ? P(t, at('def') + 0.35, 0.7, linear) : 1;
        op(w.el, a);
        if (a > 0) tr(w.el, w.p.x + Math.sin(t * 0.9 + w.p.ph) * 3 * AMP, w.p.y + Math.cos(t * 0.75 + w.p.ph) * 2.5 * AMP, 1, w.p.rot + Math.sin(t * 0.6 + w.p.ph) * 12 * AMP);
      });
      extras.forEach(e => {
        op(e.el, 1 - exOut);
        if (exOut < 1) tr(e.el, e.p.x + Math.sin(t * 1.1 + e.p.ph) * 3 * AMP, e.p.y + Math.cos(t * 0.8 + e.p.ph) * 3 * AMP - exOut * 16, 1 - 0.5 * exOut, e.p.rot + t * 14 * AMP);
      });
      const s0 = at('impure') + 0.1, s1 = mid('impure', 0.62);
      salts.forEach(s => {
        const ts = mid('impure', 0.1) + s.k * 0.24, u = clamp((t - ts) / 0.9);
        op(s.el, u > 0 ? 1 : 0);
        if (u > 0) { const y0 = ZY - ZR - 20; tr(s.el, s.x + (1 - easeOut(u)) * 26 * Math.sin(s.k * 2.1), lerp(y0, s.y, easeOut(u)) + (u >= 1 ? Math.sin(t * 1.2 + s.k) * 2.5 * AMP : 0), 1, s.k * 23 + (1 - u) * 160); op(s.halo, 0.45 + 0.4 * Math.sin(Math.PI * P(t, ts + 0.8, 0.8, linear))); }
      });
      // headings and labels
      const impSwap = P(t, mid('impure', 0.28), 0.4, linear);
      op(hdrPure, P(t, at('def') + 0.1, 0.5, linear) * (1 - impSwap));
      op(subPure, P(t, mid('def', 0.2), 0.5, linear) * (1 - impSwap));
      op(lblPure, P(t, mid('def', 0.55), 0.4, linear) * (1 - P(t, mid('impure', 0.42), 0.4, linear)));
      op(onlyG, P(t, mid('def', 0.62), 0.5, linear) * (1 - P(t, mid('impure', 0.5), 0.4, linear)));
      op(plusG, P(t, mid('impure', 0.55), 0.4, linear));
      op(lblSalty, P(t, mid('impure', 0.46), 0.4, linear));
      const ia = P(t, mid('impure', 0.34), 0.5, pop);
      op(impA, clamp(ia * 2)); op(impB, P(t, mid('impure', 0.62), 0.4, linear));
      // shaker
      const shIn = P(t, at('impure') - 0.15, 0.45, easeOut), shOut = P(t, mid('impure', 0.7), 0.5, linear);
      op(shakeG, shIn * (1 - shOut));
      const shaking = t > s0 && t < s1 ? 1 : 0;
      tr(shakeG, 394 + (1 - shIn) * 40, 252 - (1 - shIn) * 30 + shaking * 5 * Math.sin(t * 24), 1, -155 + shaking * 6 * Math.sin(t * 24 + 0.6));
      grains.forEach(gr => {
        const u = ((t - s0) / 0.6 + gr.ph) % 1, te = t - u * 0.6;
        const on = t > s0 && te >= s0 && te <= s1;
        op(gr.el, on ? Math.min(1, u * 8, (1 - u) * 6) : 0);
        if (on) tr(gr.el, 364 + gr.dx * (0.4 + u), 312 + u * u * 132, 1, u * 300);
      });
      specks.forEach((sp, k) => op(sp, P(t, s0 + 0.3 + k * 0.13, 0.3, linear)));
    }

    /* ---- B ---- */
    const aB = win(t, at('test') - 0.1, at('roads') + 0.3, 0.45);
    op(B, aB);
    if (aB > 0) {
      const mv = P(t, at('sharp') - 0.15, 0.9);
      op(tellHdr, P(t, at('test'), 0.45, linear) * (1 - P(t, at('sharp') - 0.2, 0.4, linear)));
      const thIn = P(t, at('test') + 0.15, 0.55, pop), thOut = P(t, at('impurity') - 0.1, 0.45, linear);
      op(thermG, clamp(thIn * 2) * (1 - thOut));
      tr(thermG, lerp(470, 150, mv), lerp(636, 650, mv), 0.8 + 0.2 * clamp(thIn));
      const hx = keys(t, KP), Th = tempAt(PURE_T, hx);
      const vTest = lerp(0.15, 0.62, P(t, mid('test', 0.2), 1.8));
      th.set(lerp(vTest, (Th + 30) / 150, P(t, at('sharp') - 0.1, 0.8)));
      op(readout, P(t, at('sharp') + 0.4, 0.4, linear) * (1 - thOut)); setText(readout, fmtT(Th));
      // chips: beside the thermometer, then onto the graph
      const cOut = P(t, at('impurity') - 0.1, 0.4, linear);
      const pm = P(t, mid('test', 0.45), 0.5, pop), pb = P(t, mid('test', 0.76), 0.5, pop);
      op(chipM, clamp(pm * 2) * (1 - cOut)); tr(chipM, lerp(790, 515, mv), lerp(380, 470, mv), 0.85 + 0.15 * clamp(pm));
      op(chipBo, clamp(pb * 2) * (1 - cOut)); tr(chipBo, lerp(790, 915, mv), lerp(500, 285, mv), 0.85 + 0.15 * clamp(pb));
      const icoOut = 1 - P(t, at('sharp') - 0.25, 0.3, linear);
      op(icoM, clamp(pm * 2) * icoOut); tr(icoM, 790 - chipM.w / 2 - 40, 380, Math.max(0.01, 0.9 + 0.1 * pm));
      op(icoB, clamp(pb * 2) * icoOut); tr(icoB, 790 - chipBo.w / 2 - 40, 506); if (pb > 0) icoSteam.upd(t);
      op(saltyG, P(t, at('impurity') + 0.15, 0.5, linear)); tr(saltyG, 160, 455 + Math.sin(t * 1.3) * 3 * AMP);
      // axes
      const ax = P(t, at('sharp') + 0.05, 0.9);
      axLine.setAttribute('stroke-dashoffset', (1 - ax).toFixed(4));
      op(axHeads, P(t, at('sharp') + 0.8, 0.4, linear));
      op(guides, P(t, at('sharp') + 0.7, 0.5, linear) * 0.8);
      const onM = win(t, KP[1][0], KP[2][0] + 0.3, 0.3), onB = win(t, KP[3][0], KP[4][0] + 0.3, 0.3);
      op(lab0, P(t, at('sharp') + 0.7, 0.5, linear)); scaleAt(lab0, GX0 - 14, yT(0), 1 + 0.16 * onM);
      lab0.setAttribute('fill', onM > 0.5 ? C.good : C.ink);
      op(lab100, P(t, at('sharp') + 0.8, 0.5, linear)); scaleAt(lab100, GX0 - 14, yT(100), 1 + 0.16 * onB);
      lab100.setAttribute('fill', onB > 0.5 ? C.good : C.ink);
      op(legP, P(t, mid('sharp', 0.22), 0.5, linear));
      // the pure line draws itself
      attr(clipG.el, 'width', t < KP[0][0] ? 0 : hx - GX0 + 6);
      const gl = 1 - 0.75 * P(t, at('impurity') - 0.1, 0.5, linear);
      op(glowM, gl); op(glowBo, gl);
      const icons = P(t, KP[0][0] - 0.3, 0.4, linear) * (1 - P(t, at('impurity') - 0.1, 0.4, linear));
      const hy = yT(Th);
      const meltP = clamp((hx - 412) / (620 - 412)), boilP = clamp((hx - 800) / (975 - 800));
      op(iceG, icons * (hx < 620 ? 1 : 1 - clamp((hx - 620) / 30)));
      if (hx < 650) {
        tr(iceG, Math.min(hx, 620), hy - 3);
        cube.setAttribute('transform', `translate(0 ${(-20 * (1 - meltP) - 2).toFixed(1)}) scale(${(1 - 0.55 * meltP).toFixed(3)} ${(1 - 0.85 * meltP).toFixed(3)})`);
        op(cube, 1 - P(meltP, 0.8, 0.2, linear));
        attr(puddle, 'rx', 8 + 20 * meltP); op(puddle, meltP > 0.02 ? 1 : 0);
      }
      op(dropG, icons * clamp((hx - 600) / 30) * (hx < 975 ? 1 : 1 - clamp((hx - 975) / 40)));
      if (hx >= 600) {
        tr(dropG, Math.min(hx, 975), hy - 20);
        dropEl.setAttribute('transform', `scale(${(1 - 0.5 * boilP).toFixed(3)})`);
        steam.upd(t); op(steam, boilP > 0 ? 0.9 : 0);
      }
      // impurity: the dashed line, then lower / higher / range
      op(legI, P(t, at('impurity') + 0.1, 0.5, linear));
      const hr = keys(t, KR);
      attr(clipR.el, 'width', t < KR[0][0] ? 0 : hr - GX0 + 6);
      const lw = P(t, mid('impurity', 0.22), 0.5, linear), hw = P(t, mid('impurity', 0.5), 0.5, linear);
      op(lowerG, lw); lowerA.set(P(t, mid('impurity', 0.22), 0.6));
      op(higherG, hw); higherA.set(P(t, mid('impurity', 0.5), 0.6));
      op(rangeM, P(t, mid('impurity', 0.68), 0.5, linear)); op(rangeBo, P(t, mid('impurity', 0.78), 0.5, linear));
    }

    /* ---- C ---- */
    const aC = win(t, at('roads') - 0.1, at('check') + 0.3, 0.45);
    op(Cr, aC);
    if (aC > 0) {
      stars.forEach(s => op(s.el, 0.35 + 0.6 * wave(t, 2.6, s.ph)));
      const rx = truckX(t);
      tr(truck, rx, 600);
      hubs.forEach(h => h.setAttribute('transform', `rotate(${(((rx - TX0) / 28) * 180 / Math.PI % 360).toFixed(1)})`));
      beaconGlow.style.opacity = (0.35 + 0.65 * wave(t, 0.7)).toFixed(3);
      spinDisc.setAttribute('transform', `scale(${(0.8 + 0.2 * Math.sin(t * 30)).toFixed(3)} 1)`);
      const L = 0.8;
      spray.forEach(p => {
        const u = ((t - TR0) / L + p.k / spray.length) % 1, te = t - u * L, tau = u * L;
        const on = t > TR0 && te >= TR0 + 0.2 && te <= TR1;
        if (!on) { op(p.el, 0); return; }
        const xs = truckX(te) - 9, fl = Math.min(tau, p.tl);
        tr(p.el, xs + p.vx * fl, tau < p.tl ? 552 + p.vy * tau + 420 * tau * tau : p.land, 1, fl * 400);
        op(p.el, Math.min(1, u * 10) * (1 - P(u, 0.7, 0.3, linear)));
      });
      patches.forEach(pt => {
        const tPass = TR0 + (pt.x + 70 - TX0) / TV;
        const m = P(t, tPass, 1.3, ease);
        op(pt.ice, 1 - m); op(pt.pud, m);
        if (m > 0) { const q = (t * 0.6 + pt.i * 0.3) % 1; attr(pt.rip, 'rx', 20 + 50 * q); attr(pt.rip, 'ry', 3 + 7 * q); pt.rip.style.opacity = ((1 - q) * m).toFixed(3); }
      });
      op(iceLbl, P(t, at('roads') + 0.2, 0.4, linear) * (1 - P(t, mid('roads', 0.32), 0.4, linear)));
      op(roadTh, P(t, at('roads') + 0.3, 0.5, linear)); op(roadRead, P(t, at('roads') + 0.5, 0.5, linear));
      const pr = P(t, mid('roads', 0.82), 0.5, linear);
      scaleAt(roadRead, 1020, 288, 1 + 0.12 * Math.sin(Math.PI * pr));
      op(roadChip, P(t, mid('roads', 0.4), 0.5, linear));
      op(roadNote, P(t, mid('roads', 0.78), 0.5, linear));
    }

    /* ---- D ---- */
    const aD = win(t, at('check') - 0.1, at('today') + 0.3, 0.45);
    op(Dg, aD);
    if (aD > 0) {
      const pc = P(t, at('check') + 0.05, 0.55, pop);
      op(capG, clamp(pc * 2)); tr(capG, 190, 236 + (1 - clamp(pc)) * 20, 1, -24 + 4 * Math.sin(t * 1.4) * AMP);
      op(capLbl, P(t, at('check') + 0.3, 0.4, linear));
      const pa = P(t, at('check') + 0.35, 0.55, pop);
      op(app, clamp(pa * 2)); tr(app, 410, 500 + (1 - clamp(pa)) * 24);
      op(appLbl, P(t, at('check') + 0.6, 0.4, linear));
      capArrow.set(P(t, mid('check', 0.12), 0.6)); op(capArrow, P(t, mid('check', 0.12), 0.2, linear));
      const ax = P(t, mid('check', 0.14), 0.8);
      mgAx.setAttribute('stroke-dashoffset', (1 - ax).toFixed(4)); op(mgLab, P(t, mid('check', 0.2), 0.4, linear));
      op(expG, P(t, mid('check', 0.18), 0.5, linear));
      const ep = Math.sin(Math.PI * P(t, mid('check', 0.6), 0.7, linear));
      expLbl.setAttribute('transform', `translate(${MX1 - 6} ${MEXP + 34}) scale(${(1 + 0.12 * ep).toFixed(3)}) translate(${-(MX1 - 6)} ${-(MEXP + 34)})`);
      const mx = keys(t, KM);
      attr(mClip.el, 'width', t < KM[0][0] ? 0 : mx - MX0 + 6);
      const tc = tempM(yAtM(mx));
      setText(lcd, Math.round(t < KM[0][0] ? 25 : tc) + ' °C');
      const meltF = clamp((mx - 820) / (960 - 820));
      op(powder, 1 - meltF); op(melt, meltF);
      op(heatGlow, P(t, KM[0][0], 0.5, linear) * (0.5 + 0.3 * wave(t, 1.2)));
      op(sharpLbl, P(t, mid('check', 0.52), 0.5, linear));
      const vp = P(t, mid('check', 0.82), 0.5, pop);
      op(verdict, clamp(vp * 2)); tr(verdict, 0, (1 - clamp(vp)) * 16);
      tr(vTick, 885 + vChip.w / 2 + 34, 506, Math.max(0.01, vp));
    }

    /* ---- E ---- */
    const aE = P(t, at('today') - 0.1, 0.45, linear);
    op(Eg, aE);
    if (aE > 0) {
      const p1 = P(t, at('today'), 0.55, pop), p2 = P(t, mid('today', 0.3), 0.5, easeOut);
      const x1 = lerp(600 - QW1 / 2, 600 - (QW1 + 26 + QW2) / 2, p2);
      attr(q1, 'x', x1); op(q1, clamp(p1 * 2)); scaleAt(q1, x1 + QW1 / 2, 160, 0.85 + 0.15 * p1);
      attr(q2, 'x', x1 + QW1 + 26); op(q2, p2);
      op(field, P(t, mid('today', 0.14), 0.5, linear));
      const sw = P(t, mid('today', 0.3), mid('today', 0.56) - mid('today', 0.3));
      const lx = lerp(300, ODD[0], sw), ly = ODD[1] + Math.sin(sw * Math.PI * 2) * 26 * (1 - sw);
      op(mLens, P(t, mid('today', 0.27), 0.4, linear));
      tr(mLens, lx, ly);
      attr(lensHandle, 'x1', 40); attr(lensHandle, 'y1', 40); attr(lensHandle, 'x2', 92); attr(lensHandle, 'y2', 92);
      // magnified view: the field pattern scaled about the lens centre
      const ox = FX - lx, oy = FY - ly;
      pat2.setAttribute('patternTransform', `scale(${MAG})`);
      attr(pat2, 'x', ox); attr(pat2, 'y', oy);
      attr(magRect, 'x', -LR); attr(magRect, 'y', -LR);
      tr(magOdd, (ODD[0] - lx) * MAG, (ODD[1] - ly) * MAG);
      const found = P(t, mid('today', 0.57), 0.5, pop);
      op(findRing, clamp(found * 2)); tr(findRing, (ODD[0] - lx) * MAG, (ODD[1] - ly) * MAG, 1, (t * 40) % 360);
      op(traceChip, P(t, mid('today', 0.58), 0.4, linear)); tr(traceChip, ODD[0] - LR - 26 - traceChip.w / 2, ODD[1] - 4);
      op(jobLine, P(t, mid('today', 0.66), 0.5, linear));
      JOBS.forEach((j, i) => {
        const pj = P(t, mid('today', 0.7 + i * 0.08), 0.5, pop);
        op(j.g, clamp(pj * 2)); tr(j.g, j.x, (1 - clamp(pj)) * 24);
        j.m.set(j.level * P(t, mid('today', 0.72 + i * 0.08), 0.9, easeOut));
      });
    }
  };
});
