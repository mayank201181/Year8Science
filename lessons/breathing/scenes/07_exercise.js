/* Chapter 7: exercise, breathing rate and depth.
   A runner's muscles respire faster (a lens on the thigh: more sparks, more oxygen in, more carbon dioxide out);
   a breathing monitor shows the rate, then the depth, going up (the showpiece); the brain tracks carbon dioxide
   and signals the chest; it isn't "wanting oxygen"; holding your breath until you gasp; the heart rate rises;
   the oxygen debt after you stop; counting breaths after star jumps; and the recovery-rate graph. */
scene('exercise', S => {
  const { at, end, mid } = S, root = S.root, D = S.D;
  const calm = S.reduce ? 0.3 : 1;

  /* ---------- local helpers ---------- */
  const vis = (t, t0, t1, f) => { f = f || 0.45; return Math.min(P(t, t0, f, linear), 1 - P(t, t1, f, linear)); };
  function popAt(el, x, y, t, t0, k) {
    const p = clamp((t - t0) / 0.5), a = clamp(p * 2.5);
    op(el, a);
    if (a > 0) tr(el, x, y, (k || 1) * Math.max(0.01, pop(p)));
  }
  function riseAt(el, x, y, t, t0) {
    const p = P(t, t0, 0.55, easeOut);
    op(el, p);
    if (p > 0) tr(el, x, y + (1 - p) * 18);
  }
  /* pop an element drawn at absolute coordinates, scaling about (cx, cy); fades out from t1 */
  function popXY(el, cx, cy, t, t0, t1) {
    const p = clamp((t - t0) / 0.5), a = clamp(p * 2.5) * (t1 === undefined ? 1 : 1 - P(t, t1, 0.4, linear));
    op(el, a);
    if (a > 0) el.setAttribute('transform', `translate(${cx} ${cy}) scale(${Math.max(0.01, pop(p)).toFixed(4)}) translate(${-cx} ${-cy})`);
  }
  /* pop a group in at (x, y) at t0, fade it out from t1 */
  function popWin(el, x, y, t, t0, t1) {
    const p = clamp((t - t0) / 0.5), a = clamp(p * 2.5) * (1 - P(t, t1, 0.4, linear));
    op(el, a);
    if (a > 0) tr(el, x, y, Math.max(0.01, pop(p)));
  }
  /* rise a group in at t0, fade it out from t1 */
  function riseWin(el, t, t0, t1) {
    const p = P(t, t0, 0.55, easeOut), a = p * (1 - P(t, t1, 0.45, linear));
    op(el, a);
    if (a > 0) tr(el, 0, (1 - p) * 18);
  }
  function along(pts, u) {
    let L = 0; const seg = [];
    for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(l); L += l; }
    let d = clamp(u) * L;
    for (let i = 0; i < seg.length; i++) { if (d <= seg[i] || i === seg.length - 1) { const f = seg[i] ? d / seg[i] : 0; return [lerp(pts[i][0], pts[i + 1][0], f), lerp(pts[i][1], pts[i + 1][1], f)]; } d -= seg[i]; }
    return pts[pts.length - 1];
  }
  const R2D = Math.PI / 180;
  /* a point in a kit person's body coordinates -> stage, for a person at (ox, oy), scale s, leaning `lean` */
  function kitPt(px, py, lean, ox, oy, s) {
    const a = (lean || 0) * R2D, dy = py + 92;
    return [ox + s * (px * Math.cos(a) - dy * Math.sin(a)), oy + s * (-92 + px * Math.sin(a) + dy * Math.cos(a))];
  }
  /* middle of a thigh, for leg angle a (degrees, as in person().pose) */
  const thighPt = (a, lean, ox, oy, s) => kitPt(22 * Math.sin(a * R2D), -92 + 22 * Math.cos(a * R2D), lean, ox, oy, s);
  /* lowest sole of a pose, in body coordinates (feet at 0 when standing straight) */
  function footLow(p) {
    const L = (p.lean || 0) * R2D, f = leg => -92 + 45 * Math.cos(leg[0] * R2D - L) + 52 * Math.cos((leg[0] + leg[1]) * R2D - L);
    return Math.max(f(p.legL), f(p.legR));
  }
  const mix = (a, b, k) => [lerp(a[0], b[0], k), lerp(a[1], b[1], k)];
  const blendPose = (a, b, k) => ({ lean: lerp(a.lean || 0, b.lean || 0, k), armL: mix(a.armL, b.armL, k), armR: mix(a.armR, b.armR, k), legL: mix(a.legL, b.legL, k), legR: mix(a.legR, b.legR, k) });
  const STAND = { lean: 0, armL: [8, 10], armR: [-8, 10], legL: [3, -3], legR: [-3, -3] };
  const STAR = { lean: 0, armL: [152, 6], armR: [-152, -6], legL: [22, 0], legR: [-22, 0] };

  /* chest, front view: ribs with intercostal muscles, lungs, diaphragm. g.set(in 0..1): diaphragm flat, ribs up and out */
  function chestArt(parent, s) {
    const g = G(parent), inner = G(g); tr(inner, 0, 0, s);
    const icL = G(inner), icR = G(inner), lw = G(inner);
    const lg = lungs(lw, 0.42);
    const ribL = G(inner), ribR = G(inner);
    for (let i = 0; i < 4; i++) {
      const y = -44 + i * 27, rib = `M-10,${y} C-36,${y - 16} -76,${y - 8} -86,${y + 20}`;
      [ribL, ribR].forEach((gr, k) => E('path', { d: rib, fill: 'none', stroke: '#EDF2F5', 'stroke-width': 7, 'stroke-linecap': 'round', opacity: 0.92, transform: k ? 'scale(-1 1)' : undefined }, gr));
      if (i < 3) {
        const y2 = y + 13.5, band = `M-12,${y2} C-38,${y2 - 16} -78,${y2 - 8} -88,${y2 + 20}`;
        [icL, icR].forEach((gr, k) => E('path', { d: band, fill: 'none', stroke: '#D9606E', 'stroke-width': 8, 'stroke-linecap': 'round', opacity: 0.8, transform: k ? 'scale(-1 1)' : undefined }, gr));
      }
    }
    E('rect', { x: -6, y: -52, width: 12, height: 92, rx: 6, fill: '#DDE6EC', opacity: 0.85 }, inner);
    const dia = E('path', { fill: 'none', stroke: '#D9606E', 'stroke-width': 11, 'stroke-linecap': 'round' }, inner);
    g.set = v => {
      v = clamp(v);
      lg.set(v);
      lw.setAttribute('transform', `translate(0 -63) scale(${(1 + 0.03 * v).toFixed(4)} ${(1 + 0.13 * v).toFixed(4)}) translate(0 63)`);
      const a = (7 * v).toFixed(2), sx = (1 + 0.07 * v).toFixed(4);
      [ribL, icL].forEach(e => e.setAttribute('transform', `rotate(${a} -10 -50) scale(${sx} 1)`));
      [ribR, icR].forEach(e => e.setAttribute('transform', `rotate(${-a} 10 -50) scale(${sx} 1)`));
      dia.setAttribute('d', `M-88,88 Q0,${lerp(36, 84, v).toFixed(1)} 88,88`);
    };
    g.set(0);
    return g;
  }
  /* a brain seen from the side, front to the right; the stem ends at (-14, 78) */
  function brainArt(parent) {
    const g = G(parent);
    E('path', { d: 'M-12,30 Q-6,56 -14,78', fill: 'none', stroke: '#E68FB0', 'stroke-width': 15, 'stroke-linecap': 'round' }, g);
    E('ellipse', { cx: -44, cy: 38, rx: 28, ry: 17, fill: ball('#EFA0BE', '#A84870'), stroke: '#FFD9E6', 'stroke-width': 2.5 }, g);
    const pts = [[-74, 8], [-74, -22], [-56, -50], [-26, -64], [10, -66], [44, -56], [68, -36], [76, -8], [70, 18], [50, 32], [18, 36], [-14, 34], [-44, 26], [-64, 22]];
    E('path', { d: closedPath(pts), fill: ball('#F7B6CE', '#C25A88'), stroke: '#FFD9E6', 'stroke-width': 3 }, g);
    E('path', { d: 'M-52,-30 q12,-14 26,-2 q12,10 24,-4 q12,-12 28,0 M-60,-2 q14,-12 28,0 q14,12 28,0 q14,-12 32,2 M-40,18 q12,-10 24,0 q12,10 28,-2', fill: 'none', stroke: '#B84F7C', 'stroke-width': 3.5, 'stroke-linecap': 'round', opacity: 0.75 }, g);
    return g;
  }
  /* a big face, front view, for holding your breath (head radius 100, centred on the head) */
  function bigFace(parent) {
    const g = G(parent);
    E('path', { d: 'M-160,215 Q-150,122 -40,108 L40,108 Q150,122 160,215 Z', fill: '#5B8DEF' }, g);
    E('rect', { x: -34, y: 70, width: 68, height: 48, fill: '#9C6A48' }, g);
    [-1, 1].forEach(k => E('ellipse', { cx: k * 98, cy: 4, rx: 16, ry: 24, fill: '#C98E62', stroke: '#F0C9A8', 'stroke-width': 3 }, g));
    E('circle', { r: 100, fill: ball('#DDA57C', '#9C6A48'), stroke: '#F0C9A8', 'stroke-width': 4 }, g);
    g.flush = E('circle', { r: 97, fill: '#FF3D55' }, g);
    E('path', { d: 'M-100,-8 Q-104,-112 0,-108 Q104,-112 100,-8 Q84,-62 0,-66 Q-84,-62 -100,-8 Z', fill: '#2B1D14' }, g);
    g.cheeks = [-1, 1].map(k => E('circle', { cx: k * 72, cy: 40, r: 36, fill: ball('#F2A592', '#C0705A'), stroke: '#F0C9A8', 'stroke-width': 3 }, g));
    g.eyesOpen = G(g); [-1, 1].forEach(k => { E('circle', { cx: k * 36, cy: -14, r: 12, fill: '#FFFFFF' }, g.eyesOpen); E('circle', { cx: k * 36, cy: -12, r: 7, fill: '#2A1D14' }, g.eyesOpen); });
    g.eyesShut = E('path', { d: 'M-52,-14 Q-36,-26 -20,-14 M20,-14 Q36,-26 52,-14', fill: 'none', stroke: '#2A1D14', 'stroke-width': 6, 'stroke-linecap': 'round' }, g);
    g.brows = E('path', { d: 'M-56,-40 L-22,-32 M56,-40 L22,-32', stroke: '#2B1D14', 'stroke-width': 7, 'stroke-linecap': 'round' }, g);
    g.lips = E('path', { d: 'M-17,54 L17,54', fill: 'none', stroke: '#5A2A22', 'stroke-width': 8, 'stroke-linecap': 'round' }, g);
    g.mouth = E('ellipse', { cx: 0, cy: 52, rx: 24, ry: 30, fill: '#5A2A22' }, g);
    g.effort = [-1, 1].map(k => frag(g, `<path d="M${k * 120},-46 l${k * 18},-12 M${k * 128},-6 l${k * 22},0 M${k * 120},34 l${k * 18},12" stroke="#FFE45C" stroke-width="5" stroke-linecap="round" fill="none"/>`));
    return g;
  }
  /* tally marks in fives; show(n) reveals the first n (the upright strokes through one clip rect) */
  let tallyId = 0;
  function tally(parent, x, y, n) {
    const id = 'exTally' + (++tallyId), cp = E('clipPath', { id }, defs());
    const rect = E('rect', { x: x - 8, y: y - 20, width: 0, height: 40 }, cp);
    const ups = G(parent, { 'clip-path': `url(#${id})` }), diags = [], edge = [0];
    for (let i = 0; i < n; i++) {
      const gx = x + Math.floor(i / 5) * 42, k = i % 5;
      if (k < 4) { E('line', { x1: gx + k * 7, y1: y - 13, x2: gx + k * 7, y2: y + 13, stroke: C.ink, 'stroke-width': 3.5, 'stroke-linecap': 'round' }, ups); edge.push(gx + k * 7 + 4 - (x - 8)); }
      else { diags.push({ i, el: E('line', { x1: gx - 5, y1: y + 9, x2: gx + 26, y2: y - 9, stroke: C.energy, 'stroke-width': 3.5, 'stroke-linecap': 'round' }, parent) }); edge.push(edge[edge.length - 1]); }
    }
    return { show: k => { k = Math.max(0, Math.min(n, k)); attr(rect, 'width', edge[k]); diags.forEach(d => op(d.el, d.i < k ? 1 : 0)); } };
  }

  /* ---------- the clocks: integrate cadence, speed, breathing rate and heart rate ---------- */
  const T_RUN = at('harder') + 0.15, T_WALK = at('debt'), T_STOP = at('debt') + 0.9;
  const cadF = t => 1.5 * P(t, T_RUN, 1.0, linear) * (1 - 0.4 * P(t, T_WALK, 0.7, linear)) * (1 - P(t, T_STOP, 0.8, linear));
  const spdF = t => 320 * P(t, T_RUN, 1.0, linear) * (1 - 0.72 * P(t, T_WALK, 0.7, linear)) * (1 - P(t, T_STOP, 0.8, linear));
  const T_GASP = mid('hold', 0.86);
  const holdK = t => P(t, at('hold') + 0.1, 0.6) * (1 - P(t, T_GASP, 0.3));
  const rateF = t => {                                           // breaths per minute
    let r = lerp(15, 32, P(t, mid('rate', 0.25), 1.8));
    r = lerp(r, 40, P(t, mid('rising', 0.62), 1.6));
    r = lerp(r, 0, P(t, at('hold') + 0.1, 0.6));
    r = lerp(r, 46, P(t, T_GASP, 0.3));
    r = lerp(r, 40, P(t, at('heart') - 0.2, 0.6));
    r = lerp(r, 24, P(t, mid('debt', 0.55), end('debt') - mid('debt', 0.55)));
    r = lerp(r, 14, P(t, at('count') - 0.2, 0.8));
    r = lerp(r, 34, P(t, mid('count', 0.42), 1.2));
    return lerp(r, 22, P(t, mid('count', 0.75), end('count') - mid('count', 0.75)));
  };
  const ampF = t => {                                            // trace amplitude (px): breathing depth
    let a = lerp(26, 64, P(t, mid('depth', 0.12), 2.2));
    a = lerp(a, 76, P(t, mid('rising', 0.62), 1.6));
    a = lerp(a, 0, P(t, at('hold') + 0.1, 0.6));
    a = lerp(a, 88, P(t, T_GASP, 0.3));
    a = lerp(a, 76, P(t, at('heart') - 0.2, 0.6));
    a = lerp(a, 46, P(t, mid('debt', 0.55), end('debt') - mid('debt', 0.55)));
    a = lerp(a, 28, P(t, at('count') - 0.2, 0.8));
    a = lerp(a, 72, P(t, mid('count', 0.42), 1.2));
    return lerp(a, 50, P(t, mid('count', 0.75), end('count') - mid('count', 0.75)));
  };
  const bpmF = t => lerp(lerp(72, 155, P(t, mid('heart', 0.05), 2.4)), 125, P(t, at('debt'), end('debt') - at('debt')));
  const DT = 0.02, NT = Math.ceil((D + 4) / DT) + 2;
  const cycT = new Float32Array(NT), disT = new Float32Array(NT), brT = new Float32Array(NT), hbT = new Float32Array(NT);
  for (let i = 1; i < NT; i++) {
    const tt = (i - 0.5) * DT;
    cycT[i] = cycT[i - 1] + cadF(tt) * DT; disT[i] = disT[i - 1] + spdF(tt) * DT;
    brT[i] = brT[i - 1] + rateF(tt) / 60 * DT; hbT[i] = hbT[i - 1] + bpmF(tt) / 60 * DT;
  }
  const look = (arr, t) => { const x = clamp(t, 0, (NT - 2) * DT) / DT, i = Math.floor(x), f = x - i; return arr[i] + (arr[i + 1] - arr[i]) * f; };
  const T_SJ = mid('count', 0.36), T_SJ1 = mid('count', 0.62);
  function bodyPose(t) {
    const cyc = look(cycT, t);
    let p = blendPose(STAND, runPose(cyc, 1), P(t, T_RUN, 1.0));
    p = blendPose(p, walkPose(cyc, 1), P(t, T_WALK, 0.7));
    p = blendPose(p, STAND, P(t, T_STOP, 0.8));
    const sj = P(t, T_SJ, 0.3, linear) * (1 - P(t, T_SJ1, 0.3, linear));
    if (sj > 0) p = blendPose(p, blendPose(STAND, STAR, 0.5 - 0.5 * Math.cos(TAU * 1.5 * (t - T_SJ))), sj);
    return { p, hop: sj * 16 * Math.abs(Math.sin(TAU * 1.5 * (t - T_SJ))) };
  }

  /* ================= the runner, on a track ================= */
  const GX = 250, GY = 640, RS = 1.7;
  const track = G(root);
  const tg = E('linearGradient', { id: 'exTrackFade', x1: 0, y1: 0, x2: 1, y2: 0 }, defs());
  [[0, 0], [0.14, 1], [0.82, 1], [1, 0]].forEach(([o, a]) => E('stop', { offset: o, 'stop-color': '#7E3328', 'stop-opacity': a }, tg));
  const tl = E('linearGradient', { id: 'exTrackEdge', x1: 0, y1: 0, x2: 1, y2: 0 }, defs());
  [[0, 0], [0.14, 0.85], [0.82, 0.85], [1, 0]].forEach(([o, a]) => E('stop', { offset: o, 'stop-color': '#F4E9E4', 'stop-opacity': a }, tl));
  E('rect', { x: 0, y: GY + 4, width: 520, height: 66, fill: 'url(#exTrackFade)' }, track);
  E('rect', { x: 0, y: GY + 2, width: 520, height: 5, fill: 'url(#exTrackEdge)' }, track);
  const lanes = [GY + 32, GY + 56].map((y, k) => E('line', { x1: 80, y1: y, x2: 440, y2: y, stroke: '#F4E9E4', 'stroke-width': 4, 'stroke-dasharray': '56 40', opacity: k ? 0.32 : 0.5 }, track));
  const runner = person(root, { shirt: '#5B8DEF', shorts: '#22303C' });
  const rHead = runner.firstChild.lastChild, faceSide = G(rHead), faceFront = G(rHead);
  E('circle', { cx: 9, cy: -178, r: 2.6, fill: '#2A1D14' }, faceSide);
  const mSide = E('ellipse', { cx: 15.5, cy: -166, rx: 2.6, ry: 1.8, fill: '#5A2A22' }, faceSide);
  [-1, 1].forEach(k => E('circle', { cx: k * 6.5, cy: -177, r: 2.4, fill: '#2A1D14' }, faceFront));
  const mFront = E('ellipse', { cx: 0, cy: -166, rx: 4.2, ry: 1.8, fill: '#5A2A22' }, faceFront);
  const legSparks = [0, 1].map(k => spark(root, 11, { seed: k + 4 }));

  /* ================= the muscle lens (harder, needs; and debt) ================= */
  const lensG = G(root);
  const cone = E('path', { fill: 'rgba(207,227,238,0.08)', stroke: 'rgba(207,227,238,0.3)', 'stroke-width': 2 }, lensG);
  const ringSm = E('circle', { r: 30, fill: 'none', stroke: '#CFE3EE', 'stroke-width': 4 }, lensG);
  const LR = 140;
  const lens = G(lensG);
  E('circle', { r: LR, fill: '#10293A' }, lens);
  const lcp = E('clipPath', { id: 'exLensClip' }, defs()); E('circle', { r: LR - 5 }, lcp);
  const inL = G(lens, { 'clip-path': 'url(#exLensClip)' });
  E('rect', { x: -170, y: -122, width: 340, height: 64, fill: '#5E1A26' }, inL);
  E('rect', { x: -170, y: -114, width: 340, height: 48, fill: '#9C2238' }, inL);
  const rbcs = []; for (let i = 0; i < 7; i++) rbcs.push(E('ellipse', { rx: 15, ry: 8, fill: ball('#FF6B78', '#B3263A'), stroke: '#FFC2C8', 'stroke-width': 1.5 }, inL));
  const mus = G(inL);
  E('rect', { x: -170, y: -36, width: 340, height: 200, rx: 30, fill: '#B83D55', stroke: '#F08FA2', 'stroke-width': 5 }, mus);
  for (let i = -9; i <= 9; i++) E('line', { x1: i * 18, y1: -30, x2: i * 18, y2: 160, stroke: '#8E2A40', 'stroke-width': 4, opacity: 0.5 }, mus);
  const MP = [[-66, 34, 8], [16, 74, -6], [80, 20, 12]];
  MP.forEach(([x, y, r]) => tr(mitochondrion(mus, 72, 32), x, y, 1, r));
  const partA = G(inL), partB = G(inL);                        // A: harder + needs; B: the oxygen debt
  T(partA, 0, 122, 'muscle cell', { size: 24, weight: 600, fill: '#FFD0DC', anchor: 'middle' });
  const mSparks = []; { const sr = rng(23); for (let j = 0; j < 9; j++) mSparks.push({ el: spark(partA, 10, { seed: j }), k: j % 3, ang: sr() * TAU, ph: sr(), d: 26 + sr() * 18, on: j }); }
  const o2d = [], co2d = [];
  for (let k = 0; k < 6; k++) { o2d.push(E('circle', { r: 7, fill: ball(C.oxygen, C.oxygenDk) }, partA)); co2d.push(E('circle', { r: 7, fill: ball(C.carbon, C.carbonDk) }, partA)); }
  const LAC = [[-96, 8], [-30, 92], [40, 18], [100, 86], [-100, 100], [60, 120], [-20, 30], [118, 42]];
  const lacs = LAC.map(([x, y]) => E('circle', { cx: x, cy: y, r: 10, fill: ball(C.lactic, C.lacticDk), stroke: '#FFC6DF', 'stroke-width': 1.5 }, partB));
  const lacO2 = LAC.map(() => E('circle', { r: 6.5, fill: ball(C.oxygen, C.oxygenDk) }, partB));
  const arIn = arrow(partA, -104, -62, -104, -4, { color: C.oxygen, width: 7 });
  const arOut = arrow(partA, 116, -4, 116, -62, { color: '#DDE6EE', width: 7 });
  E('circle', { r: LR, fill: 'none', stroke: '#CFE3EE', 'stroke-width': 8 }, lens);
  // labels around the lens
  const hHarder = T(root, 820, 196, 'Muscles work harder', { size: 40, weight: 700, anchor: 'middle' });
  const cResp = chip(root, 'respire faster', { size: 28, fill: '#3A3000', stroke: C.energy, color: C.energyLt });
  const cMore = G(root), cMoreC = chip(cMore, 'more energy', { size: 28, fill: C.energy, color: C.bg0 }), cMoreS = spark(cMore, 13, { seed: 9 });
  tr(cMoreS, cMoreC.w / 2 + 26, 0);
  const cO2 = chip(root, 'more oxygen in', { size: 26, fill: '#3A1A18', stroke: C.oxygen, color: '#FFC4BC' });
  const cCO2 = chip(root, 'more carbon dioxide out', { size: 26, fill: '#22303B', stroke: C.co2, color: '#DDE6EE' });

  /* ================= the breathing monitor (rate -> debt, count) ================= */
  const mon = G(root);
  card(mon, 575, 404, 585, 292, { fill: '#0E2633', stroke: C.line });
  T(mon, 600, 446, 'breathing', { size: 26, weight: 600, fill: C.muted });
  const rdN = T(mon, 905, 449, '15', { size: 38, weight: 700, fill: C.air, anchor: 'end' });
  T(mon, 1138, 448, 'breaths per minute', { size: 26, weight: 600, fill: C.muted, anchor: 'end' });
  const CHX = 660, CHY = 584;
  const chestFlash = E('ellipse', { cx: CHX, cy: CHY + 10, rx: 96, ry: 86, fill: glow(C.energy) }, mon);
  const chest = chestArt(mon, 0.9); tr(chest, CHX, CHY);
  const airIn = arrow(mon, CHX - 12, 482, CHX - 12, 518, { color: C.air, width: 5 });
  const airOut = arrow(mon, CHX + 12, 518, CHX + 12, 482, { color: C.air, width: 5 });
  const TW = 360, TX0 = 770, TY0 = 584, PXS = 45;              // trace: width, left end, midline, px per second
  E('line', { x1: TX0, y1: TY0, x2: TX0 + TW, y2: TY0, stroke: C.line, 'stroke-width': 2, 'stroke-dasharray': '6 8' }, mon);
  const trace = sineWave(mon, { w: TW, amp: 26, wl: 180, color: C.air, width: 5 }); tr(trace, TX0, TY0);
  const pen = E('circle', { r: 8, fill: C.energy, stroke: '#FFF7C2', 'stroke-width': 2 }, mon);

  /* rate up, depth up */
  const rLab = G(root), dLab = G(root);
  [[rLab, 186, 'breathing **rate**', 'more breaths per minute'], [dLab, 300, 'breathing **depth**', 'bigger breaths: more air in and out']].forEach(([g, y, a, b]) => {
    arrow(g, 610, y + 40, 610, y - 28, { color: C.good, width: 9 });
    T(g, 648, y + 14, a, { size: 42, weight: 600, boldFill: C.good });
    T(g, 648, y + 52, b, { size: 26, weight: 600, fill: C.muted });
  });

  /* ================= the brain and the carbon dioxide meter (trigger -> hold) ================= */
  const qMark = T(root, 690, 296, '?', { size: 120, weight: 700, fill: C.faint, anchor: 'middle' });
  const brainG = G(root);
  const BRX = 690, BRY = 228;
  const bHalo = E('ellipse', { cx: BRX, cy: BRY - 8, rx: 128, ry: 108, fill: glow(C.energy) }, brainG);
  const bUrge = E('ellipse', { cx: BRX, cy: BRY - 8, rx: 128, ry: 108, fill: glow(C.bad) }, brainG);
  const brain = brainArt(brainG); tr(brain, BRX, BRY);
  const NERVE = [[BRX - 14, BRY + 80], [BRX - 14, 380], [748, 440], [748, 556]];
  const nerve = E('path', { d: 'M' + NERVE.map(p => p.join(',')).join(' L'), fill: 'none', stroke: C.energy, 'stroke-width': 3, 'stroke-dasharray': '5 7', 'stroke-linecap': 'round' }, brainG);
  const pulses = [0, 1, 2, 3].map(() => E('circle', { r: 7, fill: C.energy, stroke: '#FFF7C2', 'stroke-width': 2 }, brainG));
  const link = E('path', { fill: 'none', stroke: '#CFE3EE', 'stroke-width': 3, 'stroke-dasharray': '4 8' }, root);
  const co2G = G(root);
  const MX = 818, MY = 140, MH = 180;
  const co2m = meter(co2G, { w: 36, h: MH, vertical: true, color: C.co2 }); tr(co2m, MX, MY);
  const redZone = E('rect', { x: MX + 44, y: MY, width: 8, height: MH * 0.24, rx: 4, fill: C.bad }, co2G);
  T(co2G, MX + 70, 222, 'carbon dioxide', { size: 30, weight: 700, fill: C.co2 });
  T(co2G, MX + 70, 256, 'in your blood', { size: 26, weight: 600, fill: C.muted });
  const riseLab = G(co2G);
  arrow(riseLab, MX + 82, 310, MX + 82, 274, { color: C.co2, width: 5 });
  T(riseLab, MX + 102, 304, 'rising', { size: 30, weight: 700, fill: '#DDE6EE' });
  const urgeLab = T(co2G, MX + 70, MY + 28, 'urge to breathe!', { size: 30, weight: 700, fill: '#FF8A94' });
  const yes = G(root);
  { const w = 352; E('rect', { x: -w / 2, y: -28, width: w, height: 56, rx: 28, fill: '#123B30', stroke: C.good, 'stroke-width': 3 }, yes);
    tr(tick(yes, 12), -w / 2 + 32, 0); T(yes, 18, 9, 'carbon dioxide is rising', { size: 26, weight: 700, anchor: 'middle', fill: '#C9F5DD' }); }
  // the misconception: a thought bubble
  const bubble = G(root);
  [[300, 300, 7], [322, 272, 10], [346, 246, 13]].forEach(([x, y, r]) => E('circle', { cx: x, cy: y, r, fill: '#F2F7FA' }, bubble));
  [[-112, 4, 40], [-60, -18, 46], [0, -24, 50], [62, -16, 46], [112, 4, 40], [64, 22, 40], [-2, 26, 44], [-66, 22, 40]].forEach(([x, y, r]) => E('circle', { cx: 410 + x, cy: 190 + y, r, fill: '#F2F7FA' }, bubble));
  T(bubble, 410, 199, 'I want more oxygen', { size: 28, weight: 700, fill: '#10202B', anchor: 'middle' });
  const bStrike = strike(bubble, 282, 189, 538, C.bad);

  /* ================= holding your breath ================= */
  const face = bigFace(root);
  const FX = 270, FY = 392;
  const gaspIn = [arrow(root, 118, 470, 224, 452, { color: C.air, width: 6, bend: 18 }), arrow(root, 422, 470, 316, 452, { color: C.air, width: 6, bend: -18 })];
  const gaspTxt = T(root, FX, 256, 'gasp!', { size: 40, weight: 700, fill: C.air, anchor: 'middle' });
  const holdChip = chip(root, 'holding your breath', { size: 28, fill: C.card2, stroke: C.line });

  /* ================= heart rate ================= */
  const heartG = G(root);
  const HRX = 690, HRY = 246;
  const loopD = `M${HRX + 112},${HRY} A112,92 0 1 1 ${HRX - 112},${HRY} A112,92 0 1 1 ${HRX + 112},${HRY}`;
  E('path', { d: loopD, fill: 'none', stroke: '#5E1A26', 'stroke-width': 14 }, heartG);
  E('path', { d: loopD, fill: 'none', stroke: '#9C2238', 'stroke-width': 8 }, heartG);
  const hCells = []; for (let i = 0; i < 9; i++) hCells.push(E('ellipse', { rx: 9, ry: 6, fill: ball('#FF6B78', '#B3263A') }, heartG));
  const hp = G(heartG); tr(hp, HRX, HRY);
  E('path', { d: 'M0,26 C-34,2 -40,-20 -26,-32 C-14,-42 -2,-36 0,-24 C2,-36 14,-42 26,-32 C40,-20 34,2 0,26 Z', fill: ball('#FF5C6C', '#B3263A'), stroke: '#FFC2C8', 'stroke-width': 1.6, transform: 'scale(2.1) translate(0 4)' }, hp);
  T(heartG, 852, 196, 'heart rate', { size: 30, weight: 700, fill: '#FF9AA6' });
  const bpmT = T(heartG, 852, 270, '72', { size: 68, weight: 700 });
  T(heartG, 852, 310, 'beats per minute', { size: 28, weight: 600, fill: C.muted });
  T(heartG, HRX, 372, 'oxygen-rich blood, pumped faster', { size: 24, weight: 600, fill: '#FF9AA6', anchor: 'middle' });

  /* ================= the oxygen debt ================= */
  const hard = chip(root, 'still breathing hard', { size: 28, fill: C.card2, stroke: C.air, color: C.air });
  const debtG = G(root);
  T(debtG, 878, 236, 'oxygen debt', { size: 46, weight: 700, fill: '#FF8A7D' });
  T(debtG, 878, 280, 'extra oxygen to break', { size: 28, weight: 600 });
  T(debtG, 878, 316, 'down **lactic acid**', { size: 28, weight: 600, boldFill: C.lactic });

  /* ================= counting breaths ================= */
  const cnt = G(root);
  card(cnt, 575, 118, 585, 262, { fill: C.card, stroke: C.line });
  const swG = G(cnt); tr(swG, 612, 162);
  E('rect', { x: -5, y: -27, width: 10, height: 8, rx: 2, fill: C.muted }, swG);
  E('circle', { r: 19, fill: '#0E2633', stroke: C.muted, 'stroke-width': 4 }, swG);
  const swHand = E('line', { x1: 0, y1: 2, x2: 0, y2: -13, stroke: C.energy, 'stroke-width': 3.5, 'stroke-linecap': 'round' }, swG);
  T(cnt, 644, 172, 'breaths per minute', { size: 30, weight: 700 });
  const ROWS = [{ y: 228, lab: 'at rest', n: 14 }, { y: 288, lab: 'after star jumps', n: 32 }, { y: 348, lab: 'as it settles' }].map(r => {
    const g = G(cnt);
    T(g, 598, r.y + 10, r.lab, { size: 28, weight: 600, fill: C.muted });
    if (r.n) { r.marks = tally(g, 822, r.y, r.n); r.num = T(g, 1140, r.y + 12, String(r.n), { size: 34, weight: 700, anchor: 'end', fill: C.energy }); }
    r.g = g; return r;
  });
  const settle = ['26', '20', '16', '14'].map((s, i) => T(ROWS[2].g, 822 + i * 78, ROWS[2].y + 11, s, { size: 32, weight: 700, fill: i === 3 ? C.good : C.ink }));
  const settleArr = [0, 1, 2].map(i => T(ROWS[2].g, 822 + i * 78 + 52, ROWS[2].y + 9, '→', { size: 26, weight: 600, fill: C.faint }));

  /* ================= recovery rate ================= */
  const rec = G(root);
  card(rec, 575, 404, 585, 292, { fill: '#0E2633', stroke: C.line });
  const AX = 640, AY = 650, XS = 90, YS = 7.0;                  // axes origin, px per minute, px per breath/min
  const gx = m => AX + 10 + m * XS, gy = r => AY - (r - 10) * YS;
  E('path', { d: `M${AX},468 L${AX},${AY} L${AX + 490},${AY}`, fill: 'none', stroke: C.muted, 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, rec);
  T(rec, AX + 14, 484, 'breaths per minute', { size: 26, weight: 600, fill: C.muted });
  T(rec, AX + 490, AY + 34, 'minutes after exercise', { size: 26, weight: 600, fill: C.muted, anchor: 'end' });
  E('line', { x1: AX, y1: gy(14), x2: AX + 480, y2: gy(14), stroke: C.faint, 'stroke-width': 3, 'stroke-dasharray': '8 8' }, rec);
  T(rec, AX + 16, gy(14) - 10, 'resting', { size: 26, weight: 600, fill: C.muted });
  const curve = (pts, col) => E('path', { d: openPath(pts.map(([m, r]) => [gx(m), gy(r)])), fill: 'none', stroke: col, 'stroke-width': 6, 'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': '1 1' }, rec);
  const cYou = curve([[0, 32], [1, 26.5], [2, 21.5], [3, 17.5], [4, 15], [5, 14]], C.heat);
  const cFit = curve([[0, 30], [0.8, 21], [1.6, 16], [2.4, 14.3], [3.2, 14], [5, 14]], C.good);
  const legend = (y, col, txt) => { const g = G(rec); E('line', { x1: 930, y1: y - 8, x2: 956, y2: y - 8, stroke: col, 'stroke-width': 6, 'stroke-linecap': 'round' }, g); T(g, 966, y, txt, { size: 26, weight: 700, fill: col }); return g; };
  const lYou = legend(498, C.heat, 'you'), lFit = legend(530, C.good, 'a fitter person');
  const recChip = chip(rec, 'back to normal faster: a better recovery rate', { size: 26, fill: '#123B30', stroke: C.good, color: '#C9F5DD' });
  const dotFit = E('circle', { cx: gx(2.6), cy: gy(14), r: 8, fill: C.good, stroke: '#C9F5DD', 'stroke-width': 2 }, rec);
  const dotYou = E('circle', { cx: gx(4.8), cy: gy(14), r: 8, fill: C.heat, stroke: '#FFD2B0', 'stroke-width': 2 }, rec);

  return t => {
    const { p: pose, hop } = bodyPose(t);
    const B = look(brT, t), rate = rateF(t), amp = ampF(t);

    /* ---- the runner (fades out while the face holds its breath) ---- */
    const aRun = 1 - vis(t, at('hold') - 0.1, at('heart') - 0.05, 0.4);
    op(runner, aRun); op(track, aRun);
    const oy = GY - RS * footLow(pose) - hop;
    if (aRun > 0) {
      const heave = P(t, T_STOP, 0.8) * (1 - P(t, at('recovery'), 2.0)) * 2.5 * calm * Math.sin(TAU * B);
      tr(runner, GX, oy - heave, RS); runner.pose(pose);
      const front = t > at('count') - 0.2;
      op(faceFront, front ? 1 : 0); op(faceSide, front ? 0 : 1);
      const pant = clamp(amp / 70) * clamp(Math.sin(TAU * B) * 0.5 + 0.6);
      attr(mSide, 'ry', (1.8 + 2.2 * pant).toFixed(2)); attr(mFront, 'ry', (1.8 + 2.4 * pant).toFixed(2));
      const dist = look(disT, t);
      lanes.forEach((l, k) => l.setAttribute('stroke-dashoffset', ((dist + k * 48) % 96).toFixed(1)));
      const glowOn = vis(t, mid('harder', 0.2), at('rate') - 0.1, 0.4) * aRun;
      [pose.legL[0], pose.legR[0]].forEach((a, k) => {
        const q = thighPt(a, pose.lean, GX, oy, RS);
        tr(legSparks[k], q[0], q[1], 0.9 + 0.2 * wave(t, 0.7, k * 0.3)); op(legSparks[k], glowOn * (k ? 1 : 0.8)); legSparks[k].upd(t);
      });
    } else legSparks.forEach(s => op(s, 0));

    /* ---- the muscle lens: harder + needs (big), then debt (smaller) ---- */
    const aL1 = vis(t, mid('harder', 0.28), at('rate') - 0.15, 0.45), aL2 = vis(t, mid('debt', 0.48), at('count') - 0.15, 0.45);
    const aLens = Math.max(aL1, aL2);
    op(lensG, aLens);
    if (aLens > 0) {
      const first = t < at('rate'), t0 = first ? mid('harder', 0.28) : mid('debt', 0.48);
      const lp = P(t, t0, 0.7, easeOut), base = first ? 1 : 0.78;
      const lx = first ? 820 : 742, ly = first ? 418 : 252, ls = base * (0.6 + 0.4 * lp), R = LR * ls;
      tr(lens, lx, ly, ls);
      const th = thighPt(pose.legR[0], pose.lean, GX, oy, RS);
      attr(ringSm, 'cx', th[0]); attr(ringSm, 'cy', th[1]);
      const vx = lx - th[0], vy = ly - th[1], L = Math.hypot(vx, vy) || 1, nx = -vy / L, ny = vx / L;
      cone.setAttribute('d', `M${(th[0] + nx * 30).toFixed(1)},${(th[1] + ny * 30).toFixed(1)} L${(lx + nx * R).toFixed(1)},${(ly + ny * R).toFixed(1)} L${(lx - nx * R).toFixed(1)},${(ly - ny * R).toFixed(1)} L${(th[0] - nx * 30).toFixed(1)},${(th[1] - ny * 30).toFixed(1)} Z`);
      const flow = t * (first ? 0.12 : 0.07);
      rbcs.forEach((e, i) => { attr(e, 'cx', -170 + (((flow + i / 7) % 1) * 340)); attr(e, 'cy', -90 + (i % 2 ? 7 : -7)); });
      op(partA, first ? 1 : 0); op(partB, first ? 0 : 1);
      if (first) {
      // harder: mitochondria release energy, more and more often
      mSparks.forEach(sp => {
        const on = first ? P(t, mid('harder', 0.42 + sp.on * 0.035), 0.3, linear) : 0;
        if (on <= 0) { op(sp.el, 0); return; }
        const u = ((t * 0.9 + sp.ph) % 1), m = MP[sp.k], d = sp.d * easeOut(u);
        tr(sp.el, m[0] + Math.cos(sp.ang) * d, m[1] + Math.sin(sp.ang) * d, 0.5 + 0.7 * Math.sin(u * Math.PI));
        op(sp.el, on * Math.sin(u * Math.PI)); sp.el.upd(t);
      });
      // needs: oxygen in from the blood, carbon dioxide out and carried away
      const oOn = first ? P(t, mid('needs', 0.05), 0.5, linear) : 0, cOn = first ? P(t, mid('needs', 0.45), 0.5, linear) : 0;
      const grow = P(t, mid('needs', 0.05), 4.5, linear);
      o2d.forEach((e, k) => {
        const u = ((t - mid('needs', 0.05)) / (1.6 - 0.5 * grow) + k / 6) % 1, m = MP[k % 3];
        if (oOn <= 0 || t < mid('needs', 0.05)) { op(e, 0); return; }
        attr(e, 'cx', lerp(-120 + k * 22, m[0] - 20, ease(u))); attr(e, 'cy', lerp(-90, m[1], ease(u)));
        op(e, oOn * Math.min(1, u * 6, (1 - u) * 6));
      });
      co2d.forEach((e, k) => {
        const u = ((t - mid('needs', 0.45)) / 2.0 + k / 6) % 1, m = MP[k % 3];
        if (cOn <= 0 || t < mid('needs', 0.45)) { op(e, 0); return; }
        const up = clamp(u / 0.55), along_ = clamp((u - 0.55) / 0.45);
        attr(e, 'cx', lerp(m[0] + 18, 40 + k * 14, ease(up)) + along_ * 160); attr(e, 'cy', lerp(m[1], -88, ease(up)));
        op(e, cOn * Math.min(1, u * 6, (1 - u) * 5));
      });
      arIn.set(oOn); op(arIn, oOn); arOut.set(cOn); op(arOut, cOn);
      const aw = 0.85 + 0.35 * grow;
      arIn.setAttribute('transform', `translate(-104 -33) scale(${aw.toFixed(3)}) translate(104 33)`);
      arOut.setAttribute('transform', `translate(116 -33) scale(${(0.85 + 0.35 * P(t, mid('needs', 0.45), 2.5, linear)).toFixed(3)}) translate(-116 33)`);
      } else {
      // debt: oxygen arrives and the lactic acid is broken down
      lacs.forEach((e, k) => {
        const tk = mid('debt', 0.6) + k * 0.42;
        const left = 1 - P(t, tk + 1.0, 0.6, easeIn);
        op(e, left); attr(e, 'r', (10 * (0.3 + 0.7 * left)).toFixed(2));
        const o = lacO2[k], u = clamp((t - tk) / 1.0);
        if (u <= 0 || u >= 1) { op(o, 0); return; }
        attr(o, 'cx', lerp(-60 + k * 16, LAC[k][0], ease(u))); attr(o, 'cy', lerp(-90, LAC[k][1], ease(u))); op(o, Math.min(1, u * 5, (1 - u) * 4 + 0.2));
      });
      }
    }
    const aH = vis(t, mid('harder', 0.12), at('rate') - 0.15, 0.45);
    op(hHarder, aH);
    popWin(cResp, 716, 616, t, mid('harder', 0.46), at('needs') - 0.1);
    popWin(cMore, 948, 616, t, mid('harder', 0.66), at('needs') - 0.1); cMoreS.upd(t);
    popWin(cO2, 677, 616, t, mid('needs', 0.08), at('rate') - 0.15);
    popWin(cCO2, 959, 616, t, mid('needs', 0.48), at('rate') - 0.15);

    /* ---- the breathing monitor ---- */
    const aM = vis(t, at('rate') - 0.2, at('recovery') - 0.2, 0.5);
    op(mon, aM);
    if (aM > 0) {
      const wl = PXS * 60 / Math.max(rate, 3);
      trace.set({ amp, wl, phase: TW / wl - B });
      attr(pen, 'cx', TX0 + TW); attr(pen, 'cy', TY0 - amp * Math.sin(TAU * B));
      setText(rdN, String(Math.round(rate)));
      const hk = holdK(t), v = lerp((amp / 90) * (0.5 + 0.5 * Math.sin(TAU * B)), 0.8, hk);
      chest.set(v);
      const flowK = amp / 90, cs = Math.cos(TAU * B);
      op(airIn, clamp(cs) * flowK * 1.3); op(airOut, clamp(-cs) * flowK * 1.3);
      const fl = win(t, mid('rising', 0.55), mid('rising', 0.95), 0.3);
      op(chestFlash, fl * (0.5 + 0.5 * wave(t, 0.5)));
    }
    riseWin(rLab, t, mid('rate', 0.05), end('depth') + 0.25);
    riseWin(dLab, t, mid('depth', 0.08), end('depth') + 0.25);

    /* ---- the brain and the CO2 meter ---- */
    popXY(qMark, 690, 250, t, at('trigger') + 0.05, mid('trigger', 0.34));
    const aB = vis(t, mid('trigger', 0.36), end('hold') + 0.05, 0.4);
    op(brainG, aB); op(co2G, aB);
    if (aB > 0) {
      const bp = P(t, mid('trigger', 0.36), 0.6, pop);
      tr(brain, BRX, BRY, Math.max(0.01, 0.7 + 0.3 * bp));
      op(co2m, P(t, mid('trigger', 0.62), 0.4, linear)); op(redZone, P(t, mid('trigger', 0.62), 0.4, linear));
      let lvl = lerp(0.38, 0.72, P(t, mid('rising', 0.05), 2.0));
      lvl = lerp(lvl, 0.3, P(t, at('hold') - 0.1, 0.4));
      lvl = lerp(lvl, 0.95, P(t, mid('hold', 0.2), T_GASP - mid('hold', 0.2), linear));
      lvl = lerp(lvl, 0.5, P(t, T_GASP + 0.1, 0.8));
      co2m.set(lvl);
      co2m.childNodes[1].setAttribute('fill', lvl > 0.76 ? C.bad : C.co2);
      op(riseLab, vis(t, mid('rising', 0.1), at('notwant') + 0.1, 0.4));
      op(urgeLab, vis(t, mid('hold', 0.6), end('hold'), 0.3) * (0.7 + 0.3 * wave(t, 0.6)));
      op(bHalo, vis(t, mid('rising', 0.3), end('notwant'), 0.4) * (0.45 + 0.35 * wave(t, 1.2)));
      op(bUrge, vis(t, mid('hold', 0.5), T_GASP + 0.2, 0.4) * (0.5 + 0.5 * wave(t, 0.5)));
      // signals run down from the brain to the chest
      const sOn = Math.max(vis(t, mid('rising', 0.42), end('notwant'), 0.4), 0.8 * vis(t, mid('hold', 0.55), T_GASP + 0.1, 0.3));
      op(nerve, sOn * 0.5);
      pulses.forEach((d, k) => {
        const u = ((t - mid('rising', 0.42)) / 1.1 + k / 4) % 1;
        if (sOn <= 0 || t < mid('rising', 0.42)) { op(d, 0); return; }
        const q = along(NERVE, u);
        attr(d, 'cx', q[0]); attr(d, 'cy', q[1]); op(d, sOn * Math.min(1, u * 6, (1 - u) * 6));
      });
    }
    // "your brain": a dashed link from the runner's head to the brain
    const aLk = vis(t, mid('trigger', 0.42), at('notwant'), 0.4) * aRun;
    op(link, aLk * 0.6);
    if (aLk > 0) { const hd = kitPt(0, -174, pose.lean, GX, oy, RS); link.setAttribute('d', `M${(hd[0] + 40).toFixed(1)},${(hd[1] - 20).toFixed(1)} Q${(hd[0] + 200).toFixed(1)},${(hd[1] - 120).toFixed(1)} ${BRX - 90},${BRY - 10}`); }
    // not 'wanting oxygen'
    const yp = P(t, mid('notwant', 0.1), 0.5, pop);
    op(yes, clamp(yp * 2) * (1 - P(t, at('hold') - 0.1, 0.4, linear))); tr(yes, 874, 356, Math.max(0.01, 0.8 + 0.2 * yp));
    const bb = P(t, mid('notwant', 0.5), 0.5, pop);
    op(bubble, clamp(bb * 2) * (1 - P(t, at('hold') - 0.15, 0.4, linear)));
    bubble.setAttribute('transform', `translate(410 200) scale(${Math.max(0.01, 0.6 + 0.4 * bb).toFixed(3)}) translate(-410 -200)`);
    bStrike.set(P(t, mid('notwant', 0.86), 0.45));

    /* ---- holding your breath ---- */
    const aF = vis(t, at('hold') - 0.05, end('hold') + 0.05, 0.4);
    op(face, aF); op(holdChip, aF * (1 - P(t, T_GASP, 0.3, linear)));
    if (aF > 0) {
      tr(face, FX, FY); tr(holdChip, FX, 664);
      const puff = P(t, at('hold') + 0.2, 0.5) * (1 - P(t, T_GASP, 0.25));
      const strain = P(t, mid('hold', 0.3), T_GASP - mid('hold', 0.3), linear) * (1 - P(t, T_GASP, 0.3));
      face.cheeks.forEach((c, k) => { op(c, puff); c.setAttribute('transform', `translate(${(k ? 1 : -1) * 72} 40) scale(${(0.8 + 0.22 * puff + 0.03 * calm * strain * Math.sin(t * 9)).toFixed(3)}) translate(${(k ? -1 : 1) * 72} -40)`); });
      op(face.flush, strain * 0.32);
      op(face.eyesShut, strain > 0.25 ? 1 : 0); op(face.eyesOpen, strain > 0.25 ? 0 : 1);
      op(face.brows, clamp((strain - 0.2) * 3));
      const gasp = P(t, T_GASP, 0.25);
      op(face.lips, 1 - gasp); op(face.mouth, gasp); attr(face.mouth, 'ry', (30 * (0.6 + 0.4 * wave(t, 0.7))).toFixed(1));
      face.effort.forEach((e, k) => { op(e, clamp((strain - 0.35) * 2.5)); e.setAttribute('transform', `translate(${((k ? 1 : -1) * 4 * calm * Math.sin(t * 14)).toFixed(1)} 0)`); });
      gaspIn.forEach((a, k) => { a.set(P(t, T_GASP + 0.05, 0.4)); op(a, gasp * (0.6 + 0.4 * wave(t, 0.5, k * 0.5))); });
      popXY(gaspTxt, FX, 244, t, T_GASP + 0.05, end('hold'));
    } else { gaspIn.forEach(a => op(a, 0)); op(gaspTxt, 0); }

    /* ---- heart rate ---- */
    const aHr = vis(t, at('heart') - 0.05, at('debt') + 0.2, 0.45);
    op(heartG, aHr);
    if (aHr > 0) {
      const beats = look(hbT, t), q = beats % 1, pulse = Math.exp(-q * 9) + 0.5 * Math.exp(-Math.abs(q - 0.22) * 14);
      tr(hp, HRX, HRY, 0.95 + 0.14 * clamp(pulse));
      setText(bpmT, String(Math.round(bpmF(t))));
      hCells.forEach((e, i) => { const u = (beats * 0.11 + i / 9) % 1, a = -u * TAU; attr(e, 'cx', HRX + 112 * Math.cos(a)); attr(e, 'cy', HRY + 92 * Math.sin(a)); });
    }

    /* ---- the oxygen debt ---- */
    popWin(hard, 868, 250, t, mid('debt', 0.1), mid('debt', 0.3));
    const aDb = vis(t, mid('debt', 0.36), at('count') - 0.15, 0.45);
    op(debtG, aDb);
    if (aDb > 0) { op(debtG.childNodes[0], P(t, mid('debt', 0.36), 0.5, linear)); op(debtG.childNodes[1], P(t, mid('debt', 0.58), 0.5, linear)); op(debtG.childNodes[2], P(t, mid('debt', 0.66), 0.5, linear)); }

    /* ---- counting breaths ---- */
    const aCt = P(t, at('count') - 0.1, 0.5, linear);
    op(cnt, aCt);
    if (aCt > 0) {
      const counting = (t > mid('count', 0.08) && t < mid('count', 0.34)) || (t > mid('count', 0.62) && t < mid('count', 0.78));
      attr(swHand, 'transform', `rotate(${((counting ? 1 : 0) * ((t * 240) % 360)).toFixed(1)})`);
      ROWS.forEach((r, i) => op(r.g, P(t, mid('count', [0.05, 0.38, 0.78][i]), 0.4, linear)));
      const fills = [[mid('count', 0.1), mid('count', 0.32)], [mid('count', 0.63), mid('count', 0.76)]];
      [0, 1].forEach(i => {
        const r = ROWS[i], [a, b] = fills[i], n = Math.floor(r.n * clamp((t - a) / (b - a)) + 1e-6);
        r.marks.show(n);
        popXY(r.num, 1122, r.y, t, b + 0.05);
      });
      settle.forEach((s, i) => op(s, P(t, mid('count', 0.8 + i * 0.055), 0.3, linear)));
      settleArr.forEach((s, i) => op(s, P(t, mid('count', 0.82 + i * 0.055), 0.3, linear)));
    }

    /* ---- the recovery graph ---- */
    const aR = P(t, at('recovery') - 0.15, 0.5, linear);
    op(rec, aR);
    if (aR > 0) {
      cYou.setAttribute('stroke-dashoffset', (1 - P(t, mid('recovery', 0.04), 1.6)).toFixed(4));
      cFit.setAttribute('stroke-dashoffset', (1 - P(t, mid('recovery', 0.3), 1.3)).toFixed(4));
      op(lYou, P(t, mid('recovery', 0.08), 0.4, linear)); op(lFit, P(t, mid('recovery', 0.34), 0.4, linear));
      popXY(dotYou, gx(4.8), gy(14), t, mid('recovery', 0.42));
      popXY(dotFit, gx(2.6), gy(14), t, mid('recovery', 0.5));
      popAt(recChip, 868, 436, t, mid('recovery', 0.6));
    }
  };
});
