/* Chapter 4, Conservation of energy.
   A balance: total before = total after -> a ball held high (gravitational jar full, a "total" bar) falls,
   speeding up, its energy moving into the kinetic jar while the total stays the same -> it hits the ground:
   sound rings out, warmth spreads, the kinetic jar empties into thermal -> the energy flow diagram
   -> a wind-up toy: elastic -> kinetic + a little thermal -> a roller coaster whose jars swap with its height
   (showpiece); later hills are lower as friction and air resistance fill a thermal jar -> a key on a string
   swings, gravitational and kinetic swapping, and slows to a stop as its energy spreads out as heat. */
scene('conservation', S => {
  const { at, end, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;
  const popIn = (t, t0, d) => P(t, t0, d || 0.5, pop);

  /* ---------- local helpers ---------- */
  function rich(parent, x, y, segs, o) {
    o = o || {};
    const t = E('text', { x, y, 'font-size': o.size || 30, 'font-weight': o.weight || 600, 'font-family': o.font || FD, 'text-anchor': o.anchor || 'start', fill: o.fill || C.ink }, parent);
    segs.forEach(s => { if (typeof s === 'string') s = [s]; E('tspan', { fill: s[1], 'font-weight': s[2] }, t).textContent = s[0]; });
    return t;
  }
  const tag = (parent, text, stroke, color) => chip(parent, text, { size: 26, fill: C.card, stroke, sw: 2.5, color: color || C.ink });
  const show = (el, p, x, y, s) => { op(el, clamp(p * 2)); tr(el, x, y + (1 - clamp(p)) * 14, (s || 1) * (0.85 + 0.15 * p)); };
  const rise = (el, p) => { op(el, clamp(p * 2)); tr(el, 0, (1 - clamp(p)) * 14); };
  /* segs: [{ a: beat opacity, p: pop 0..1, x, y, s, lv }]; the first visible one places the shared element */
  const place = (el, segs) => {
    for (const q of segs) if (q.a > 0) {
      op(el, q.a * clamp(q.p * 2)); tr(el, q.x, q.y + (1 - clamp(q.p)) * 14, (q.s || 1) * (0.85 + 0.15 * q.p));
      if (el.set && q.lv !== undefined) el.set(q.lv);
      return;
    }
    op(el, 0);
  };
  /* a damped settle towards 1 (for the balance beam) */
  const settle = u => (u <= 0 ? 0 : 1 - Math.exp(-3.2 * u) * Math.cos(6.5 * u));
  const GC = EN.store.gravitational.color, KC = EN.store.kinetic.color, TC = EN.store.thermal.color;

  /* ---------- shared store jars: each is on screen in one place at a time ---------- */
  const gJ = G(root);
  const J = {};
  ['gravitational', 'kinetic', 'thermal', 'elastic'].forEach(k => { J[k] = enJar(gJ, k, { w: 110, h: 140, level: 0 }); op(J[k], 0); });

  /* ================= A. total before = total after ================= */
  const gA = G(root);
  const hdr = G(gA);
  const HS = [['energy is never ', C.muted, 600], ['created', C.ink, 700], [' or ', C.muted, 600], ['destroyed', C.ink, 700]];
  const hw = HS.map(s => textWidth(s[0], 36, FD, s[2])), hx0 = 600 - hw.reduce((a, b) => a + b, 0) / 2;
  rich(hdr, hx0, 162, HS, { size: 36 });
  const BAL = G(gA); tr(BAL, 600, 262);
  const BH = 230;
  E('path', { d: 'M-84,252 L84,252 L62,228 L-62,228 Z', fill: '#8FA6B4', stroke: '#C9D6DE', 'stroke-width': 3, 'stroke-linejoin': 'round' }, BAL);
  E('rect', { x: -8, y: -6, width: 16, height: 236, rx: 5, fill: '#AFC1CC' }, BAL);
  const beam = G(BAL);
  E('rect', { x: -BH - 10, y: -8, width: 2 * BH + 20, height: 16, rx: 8, fill: '#C9D6DE', stroke: '#8FA6B4', 'stroke-width': 2 }, beam);
  E('circle', { r: 15, fill: C.energy, stroke: '#B59B12', 'stroke-width': 3 }, BAL);
  const mkPan = () => {
    const p = G(BAL);
    E('path', { d: 'M0,0 L-72,122 M0,0 L72,122', stroke: '#C9D6DE', 'stroke-width': 3 }, p);
    E('path', { d: 'M-92,122 L92,122 Q84,150 0,152 Q-84,150 -92,122 Z', fill: '#8FA6B4', stroke: '#C9D6DE', 'stroke-width': 3, 'stroke-linejoin': 'round' }, p);
    return p;
  };
  const panL = mkPan(), panR = mkPan();
  const mjG = enJar(panL, 'gravitational', { w: 64, h: 90, level: 1, label: false });
  const mjK = enJar(panR, 'kinetic', { w: 64, h: 90, level: 0.5, label: false });
  const mjT = enJar(panR, 'thermal', { w: 64, h: 90, level: 0.5, label: false });
  const labB = T(gA, 600 - BH, 226, 'total before', { size: 30, weight: 700, anchor: 'middle' });
  const labA = T(gA, 600 + BH, 226, 'total after', { size: 30, weight: 700, anchor: 'middle' });
  const eqA = T(gA, 600, 230, '=', { size: 64, weight: 700, anchor: 'middle', fill: C.good });
  const chgA = rich(gA, 600, 590, [['a change: ', C.muted], ['gravitational', GC, 700], [' → ', C.muted], ['kinetic', KC, 700], [' + ', C.muted], ['thermal', TC, 700]], { size: 28, anchor: 'middle' });

  /* ================= B. the falling ball ================= */
  const gB = G(root);
  const RX = 100, RT = 172, RB = 612;
  E('rect', { x: RX - 14, y: RT, width: 28, height: RB - RT, rx: 6, fill: '#E9DFC4', opacity: 0.92 }, gB);
  let ticks = '';
  for (let y = RB - 40, k = 1; y > RT + 6; y -= 40, k++) ticks += `M${RX - 14},${y} L${RX + (k % 2 ? -2 : 6)},${y} `;
  E('path', { d: ticks, stroke: '#5A4A2A', 'stroke-width': 3, 'stroke-linecap': 'round' }, gB);
  T(gB, RX, RT - 18, 'height', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  E('rect', { x: 50, y: 612, width: 420, height: 14, rx: 4, fill: '#2E6B4A' }, gB);
  let grassB = '';
  for (let x = 130; x < 460; x += 34) grassB += `M${x},613 l-5,-10 M${x + 6},613 l2,-12 M${x + 12},613 l6,-8 `;
  E('path', { d: grassB, stroke: '#3FA463', 'stroke-width': 3, 'stroke-linecap': 'round', fill: 'none' }, gB);
  const BX = 220, BTOP = 200, BR = 30, BGROUND = RB - BR, DROP = BGROUND - BTOP;
  const level = E('line', { x1: RX + 16, y1: BTOP, x2: BX - BR - 8, y2: BTOP, stroke: C.energy, 'stroke-width': 3, 'stroke-dasharray': '7 6' }, gB);
  const ghosts = [1, 2, 3, 4, 5, 6].map(() => E('circle', { r: BR, fill: 'none', stroke: '#FF9AA2', 'stroke-width': 2.5, 'stroke-dasharray': '6 5' }, gB));
  const glowB = E('ellipse', { cx: BX, cy: RB - 4, rx: 40, ry: 14, fill: glow(C.heat) }, gB); op(glowB, 0);
  const rings = [0, 1, 2].map(() => E('path', { fill: 'none', stroke: '#FFFFFF', 'stroke-width': 4, 'stroke-linecap': 'round' }, gB));
  const speedB = G(gB);
  [-13, 0, 13].forEach((x, i) => E('line', { x1: x, y1: -BR - 8, x2: x, y2: -BR - 8 - [26, 40, 26][i], stroke: '#DCE6EC', 'stroke-width': 4, 'stroke-linecap': 'round' }, speedB));
  const ballB = G(gB), ballK = G(ballB);
  E('circle', { r: BR, fill: ball('#FF6070', '#B5372D'), stroke: '#FFB3BB', 'stroke-width': 2 }, ballK);
  E('path', { d: `M${-BR + 6},-6 Q0,10 ${BR - 6},-6`, fill: 'none', stroke: '#FFD0D5', 'stroke-width': 3, opacity: 0.7 }, ballK);
  const warmBall = E('circle', { r: BR, fill: C.heat }, ballK); op(warmBall, 0);
  const handB = G(gB); tr(handB, BX, BTOP - BR - 17); tr(_enHand(handB), 0, 0, 1, 90);
  const snap = E('circle', { cx: BX, r: 52, fill: 'none', stroke: '#FFFFFF', 'stroke-width': 4 }, gB); op(snap, 0);
  const chipFast = tag(gB, 'speeding up', KC, KC);
  const chipLand = tag(gB, 'just before it lands', '#FFFFFF');
  const chipSound = tag(gB, 'sound', '#FFFFFF');
  const JBX = [630, 785, 940], JBY = 430;
  const fGK = enSparkFlow(gB, [[630, 400], [630, 352], [670, 318], [745, 318], [785, 352], [785, 420]], { n: 5, r: 10, speed: 200, seed: 4 });
  const fKT = enSparkFlow(gB, [[785, 400], [785, 352], [825, 318], [900, 318], [940, 352], [940, 420]], { n: 5, r: 10, speed: 200, color: EN.wasted, seed: 9 });
  const fKS = enSparkFlow(gB, [[785, 400], [785, 352], [815, 300], [870, 262], [950, 246], [1010, 242]], { n: 3, r: 9, speed: 190, color: '#FFFFFF', seed: 2 });
  const chipSoundJ = tag(gB, 'carried away as sound', '#FFFFFF'); tr(chipSoundJ, 880, 196);
  // the total bar: a stack of the store colours whose height never changes
  const TBX = 1052, TBY = 290, TBW = 56, TBH = 280;
  const totG = G(gB);
  E('rect', { x: TBX - 5, y: TBY - 5, width: TBW + 10, height: TBH + 10, rx: 10, fill: '#0B2230', stroke: C.line, 'stroke-width': 2.5 }, totG);
  const segCols = [GC, KC, TC, '#FFFFFF'];
  const segs = segCols.map(c => E('rect', { x: TBX, y: TBY + TBH, width: TBW, height: 0, fill: c }, totG));
  const topLine = E('line', { x1: TBX - 16, y1: TBY, x2: TBX + TBW + 16, y2: TBY, stroke: C.energy, 'stroke-width': 3, 'stroke-dasharray': '6 5' }, totG);
  T(totG, TBX + TBW / 2, TBY + TBH + 40, 'total', { size: 28, weight: 700, anchor: 'middle' });
  const sameT = T(totG, TBX + TBW / 2, TBY + TBH + 72, 'stays the same', { size: 24, weight: 600, anchor: 'middle', fill: C.muted });
  const setTotal = (vals, fillUp) => {
    let y = TBY + TBH;
    vals.forEach((v, i) => { const h = Math.max(0, v) * TBH * fillUp; attr(segs[i], 'y', y - h); attr(segs[i], 'height', h); y -= h; });
  };
  // the fall: let go, uniform acceleration, a freeze just before landing, then the impact
  const tLet = mid('falls', 0.04), tFz = mid('falls', 0.7), tHit = at('hits') + 0.12, FZ = 0.96, TF = tFz - tLet;
  const fallen = t => {
    if (t <= tLet) return 0;
    if (t < tFz) { const u = (t - tLet) / TF; return FZ * u * u; }
    if (t < tHit - 0.12) return FZ;
    if (t < tHit) return FZ + (1 - FZ) * (t - tHit + 0.12) / 0.12;
    return 1;
  };
  const speedAt = t => (t > tLet && t < tFz ? 2 * FZ * (t - tLet) / (TF * TF) : t >= tHit - 0.12 && t < tHit ? 2 * FZ / TF : 0);

  /* ================= C. the energy flow diagram ================= */
  const gC = G(root);
  const flowT = T(gC, 600, 200, 'energy flow diagram', { size: 44, weight: 700, anchor: 'middle' });
  const chain = enFlowChain(gC, [{ kind: 'gravitational' }, { kind: 'kinetic' }, { kind: 'thermal', text: 'thermal + sound' }], { size: 28, h: 74, gap: 88 });
  tr(chain, 600, 420);
  const cBadges = ['gravitational', 'kinetic', 'thermal'].map((k, i) => { const b = enBadge(gC, k, { r: 38, label: false }); return { b, x: 600 + chain.boxes[i].cx }; });
  const soundIcon = G(gC);
  [16, 28, 40].forEach(r => E('path', { d: `M${r * 0.6},${-r * 0.8} A${r},${r} 0 0 1 ${r * 0.6},${r * 0.8}`, fill: 'none', stroke: '#FFFFFF', 'stroke-width': 5, 'stroke-linecap': 'round' }, soundIcon));
  const flowSub = rich(gC, 600, 560, [['for the falling ball', C.muted]], { size: 28, anchor: 'middle' });

  /* ================= D. the wind-up toy ================= */
  const gD = G(root);
  E('rect', { x: 60, y: 640, width: 1080, height: 12, rx: 4, fill: '#7A5A3A' }, gD);
  E('rect', { x: 60, y: 640, width: 1080, height: 3, fill: '#A8825A' }, gD);
  const toy = G(gD);
  const legs = [-17, 15].map((x, i) => { const g = G(toy); E('rect', { x: x - 9, y: -40, width: 18, height: 40, rx: 6, fill: i ? '#9AA8B4' : '#6F7D88' }, g); E('rect', { x: x - 11, y: -8, width: 26, height: 10, rx: 4, fill: '#3A444E' }, g); return { g, x }; });
  E('rect', { x: -48, y: -124, width: 96, height: 86, rx: 16, fill: ball('#B5C0CA', '#5D6B78'), stroke: '#DCE6EC', 'stroke-width': 3 }, toy);
  E('rect', { x: -32, y: -112, width: 64, height: 60, rx: 10, fill: '#0B2230', stroke: '#8FA3B3', 'stroke-width': 2 }, toy);
  const spiral = E('path', { fill: 'none', stroke: C.lactic, 'stroke-width': 4, 'stroke-linecap': 'round' }, toy);
  E('rect', { x: -36, y: -176, width: 72, height: 52, rx: 14, fill: ball('#C9D3DC', '#6B7884'), stroke: '#DCE6EC', 'stroke-width': 3 }, toy);
  E('circle', { cx: 6, cy: -152, r: 7, fill: C.water }, toy); E('circle', { cx: 25, cy: -152, r: 7, fill: C.water }, toy);
  E('path', { d: 'M-4,-176 L-4,-192', stroke: '#DCE6EC', 'stroke-width': 4, 'stroke-linecap': 'round' }, toy);
  E('circle', { cx: -4, cy: -196, r: 6, fill: C.bad }, toy);
  const armT = G(toy); E('rect', { x: -7, y: 0, width: 14, height: 40, rx: 7, fill: '#9AA8B4' }, armT);
  const keyT = G(toy); tr(keyT, -48, -82);
  E('rect', { x: -18, y: -4, width: 18, height: 8, fill: '#C9A24A' }, keyT);
  const wings = G(keyT);
  E('path', { d: 'M0,0 C-8,-30 -28,-32 -28,-16 C-28,-5 -12,-2 0,0 C-12,2 -28,5 -28,16 C-28,32 -8,30 0,0 Z', fill: ball('#FFE29A', '#B57B12'), stroke: '#8A6A1E', 'stroke-width': 2 }, wings);
  const handD = G(gD); _enHand(handD);
  const fEK = enSparkFlow(gD, [[430, 310], [430, 206], [470, 176], [560, 176], [600, 206], [600, 300]], { n: 5, r: 10, speed: 200, seed: 6 });
  const fET = enSparkFlow(gD, [[430, 310], [430, 206], [480, 154], [720, 154], [770, 206], [770, 300]], { n: 3, r: 9, speed: 210, color: EN.wasted, seed: 8 });
  const feet = [0, 1, 2].map(k => spark(gD, 7, { color: EN.wasted, seed: k + 2 }));
  const fricT = T(gD, 770, 418, 'from friction', { size: 24, weight: 600, anchor: 'middle', fill: TC });
  const TOYX0 = 230, TOYX1 = 860, TOYY = 640;
  const tRun = mid('toy', 0.52), tRunEnd = end('toy') + 0.4;

  /* ================= E. the roller coaster (showpiece) ================= */
  const gE = G(root);
  const EXT = [[40, 620], [230, 300], [420, 650], [610, 380], [790, 650], [950, 470], [1100, 625], [1200, 625]];
  const FLOOR = 650;
  const yAt = x => {
    for (let i = 0; i < EXT.length - 1; i++) {
      const [xa, ya] = EXT[i], [xb, yb] = EXT[i + 1];
      if (x <= xb) { const u = (x - xa) / (xb - xa); return ya + (yb - ya) * (1 - Math.cos(Math.PI * u)) / 2; }
    }
    return EXT[EXT.length - 1][1];
  };
  let trkD = '', supD = '';
  for (let x = 40; x <= 1200; x += 5) trkD += (x === 40 ? 'M' : ' L') + x + ',' + yAt(x).toFixed(1);
  for (let x = 62; x < 1190; x += 46) supD += `M${x},${(yAt(x) + 8).toFixed(1)} L${x},700 `;
  E('path', { d: supD, stroke: '#2C5468', 'stroke-width': 4 }, gE);
  E('rect', { x: 30, y: 690, width: 1140, height: 10, rx: 4, fill: '#1B4457' }, gE);
  const trkBand = E('path', { d: trkD, fill: 'none', stroke: '#1B4457', 'stroke-width': 16, 'stroke-linejoin': 'round', 'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': '1 1' }, gE);
  const trkRail = E('path', { d: trkD, fill: 'none', stroke: '#DCE6EC', 'stroke-width': 5, 'stroke-linejoin': 'round', 'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': '1 1' }, gE);
  // physics from the first crest on: KE = (H1 - h) - friction losses (MU per px of track); TAU is the ride's own clock
  const MU = 0.03, V0 = 4, H1 = FLOOR - 300, ETOT = H1 + V0 * V0 / 2;
  const PH = [];
  { let s = 0, tau = 0, pv = null;
    for (let x = 230; x <= 1200; x += 2) {
      const y = yAt(x); if (pv) s += Math.hypot(x - pv.x, y - pv.y);
      const h = FLOOR - y, loss = MU * s, ke = V0 * V0 / 2 + (H1 - h) - loss, v = Math.sqrt(Math.max(1e-4, 2 * ke));
      if (pv) tau += (s - pv.s) / ((v + pv.v) / 2);
      pv = { x, y, s, v, tau, h, ke, loss }; PH.push(pv);
    } }
  const tauAtX = x => PH[Math.round((x - 230) / 2)].tau;
  const tDep = at('swap') + 0.1, tC2 = mid('swap', 0.94), K1 = tauAtX(610) / (tC2 - tDep), K2 = K1 * 0.72, KD = 1.6;
  const rideTau = t => {
    if (t <= tDep) return 0;
    if (t <= tC2) return K1 * (t - tDep);
    const x = t - tC2, y = Math.min(1, x / KD), Q = x < KD ? KD * (y * y * y - y * y * y * y / 2) : KD / 2 + (x - KD);
    return K1 * (tC2 - tDep) + K1 * x - (K1 - K2) * Q;
  };
  const rideAt = t => {
    const tau = rideTau(t);
    let lo = 0, hi = PH.length - 1;
    if (tau >= PH[hi].tau) { const p = PH[hi]; return { p, x: p.x + (tau - p.tau) * p.v, y: p.y, ang: 0 }; }
    while (hi - lo > 1) { const m = (lo + hi) >> 1; if (PH[m].tau <= tau) lo = m; else hi = m; }
    const a = PH[lo], b = PH[hi], f = (tau - a.tau) / (b.tau - a.tau || 1);
    return { p: { h: lerp(a.h, b.h, f), ke: lerp(a.ke, b.ke, f), loss: lerp(a.loss, b.loss, f), v: lerp(a.v, b.v, f) }, x: lerp(a.x, b.x, f), y: lerp(a.y, b.y, f), ang: Math.atan2(b.y - a.y, b.x - a.x) };
  };
  const VMAX = Math.sqrt(2 * ETOT);
  const CARS = 1.2;                                     // the car's scale
  const carPos = r => { const n = [Math.sin(r.ang), -Math.cos(r.ang)]; return [r.x + n[0] * 24 * CARS, r.y + n[1] * 24 * CARS]; };
  const car = G(gE), carBody = G(car);
  const streaks = G(carBody);
  [-10, 2, 14].forEach((y, i) => E('path', { d: `M-40,${y} q-18,-6 -${[36, 50, 36][i]},0`, fill: 'none', stroke: '#DCE6EC', 'stroke-width': 3, 'stroke-linecap': 'round', opacity: 0.8 }, streaks));
  E('circle', { cx: -9, cy: -24, r: 8, fill: ball('#F0C4A0', '#C98E62') }, carBody);
  E('circle', { cx: 13, cy: -24, r: 8, fill: ball('#8A5A3A', '#5A3A22') }, carBody);
  E('path', { d: 'M-34,-14 L26,-14 Q38,-14 38,-2 L38,6 Q38,12 32,12 L-30,12 Q-34,12 -34,6 Z', fill: ball('#FF6070', '#B5372D'), stroke: '#FFB3BB', 'stroke-width': 2 }, carBody);
  E('rect', { x: -26, y: -8, width: 46, height: 6, rx: 3, fill: '#FFD0D5', opacity: 0.6 }, carBody);
  [-20, 22].forEach(x => E('circle', { cx: x, cy: 15, r: 7, fill: '#22313B', stroke: '#9AA6B2', 'stroke-width': 2.5 }, carBody));
  const dash1 = E('line', { x1: 230, y1: 300, x2: 1160, y2: 300, stroke: C.energy, 'stroke-width': 3, 'stroke-dasharray': '10 8' }, gE);
  const dashLab = T(gE, 400, 288, 'height of the first hill', { size: 24, weight: 600, anchor: 'middle', fill: C.energy });
  const gaps = [[610, 380], [950, 470]].map(([x, y]) => {
    const g = G(gE);
    E('path', { d: `M${x},304 L${x},${y - 6} M${x - 10},304 L${x + 10},304 M${x - 10},${y - 6} L${x + 10},${y - 6}`, stroke: '#FF9AA2', 'stroke-width': 3.5, 'stroke-linecap': 'round' }, g);
    return g;
  });
  const chipFastE = tag(gE, 'fast!', KC, KC), chipSlowE = tag(gE, 'slow', GC, GC);
  const chipFric = tag(gE, 'friction', TC, TC), chipAir = tag(gE, 'air resistance', TC, TC);
  const trickle = [0, 1, 2, 3, 4, 5].map(k => spark(gE, 8, { color: EN.wasted, seed: k + 5 }));
  const JE = [[800, 170], [940, 170], [1080, 170]];
  const hiG = E('circle', { cx: 800, cy: 170, r: 92, fill: glow(GC) }, gJ); op(hiG, 0);
  gJ.insertBefore(hiG, gJ.firstChild);           // a halo behind the coaster's gravitational jar

  /* ================= F. a key on a string ================= */
  const gF = G(root);
  const PX = 400, PY = 190, LEN = 290, A0 = 38 * Math.PI / 180, PER = 2.2;
  const tSw0 = at('pendulum') - 0.2, tDec0 = at('slows') - 0.2, tDec1 = end('slows') - 0.3;
  const arcF = E('path', { d: `M${PX + (LEN + 26) * Math.sin(-A0 - 0.08)},${PY + (LEN + 26) * Math.cos(A0 + 0.08)} A${LEN + 26},${LEN + 26} 0 0 0 ${PX + (LEN + 26) * Math.sin(A0 + 0.08)},${PY + (LEN + 26) * Math.cos(A0 + 0.08)}`, fill: 'none', stroke: C.line, 'stroke-width': 3, 'stroke-dasharray': '6 9' }, gF);
  const gravL = tag(gF, 'gravitational', GC, GC), gravR = tag(gF, 'gravitational', GC, GC), kinB = tag(gF, 'kinetic', KC, KC);
  tr(gravL, 170, 320); tr(gravR, 630, 320); tr(kinB, 400, 644);
  const stringF = E('line', { x1: PX, y1: PY, x2: PX, y2: PY + LEN, stroke: '#E9DFC4', 'stroke-width': 3 }, gF);
  const fist = G(gF); tr(fist, PX, PY - 14);
  E('rect', { x: -16, y: -76, width: 32, height: 46, rx: 6, fill: C.air, stroke: '#5E9CC4', 'stroke-width': 2 }, fist);
  E('rect', { x: -23, y: -34, width: 46, height: 40, rx: 14, fill: ball('#F0C4A0', '#C98E62'), stroke: '#B5774C', 'stroke-width': 2 }, fist);
  E('path', { d: 'M-11,-10 L-11,4 M0,-10 L0,5 M11,-10 L11,4', stroke: '#B5774C', 'stroke-width': 2, 'stroke-linecap': 'round' }, fist);
  const keyF = G(gF);
  E('circle', { cy: 0, r: 13, fill: 'none', stroke: '#C9D3DC', 'stroke-width': 4 }, keyF);
  E('circle', { cy: 30, r: 21, fill: ball('#FFE29A', '#B57B12'), stroke: '#8A6A1E', 'stroke-width': 2.5 }, keyF);
  E('circle', { cy: 30, r: 7, fill: C.bg0 }, keyF);
  E('path', { d: 'M-6,50 L6,50 L6,104 L0,110 L-6,104 Z', fill: ball('#FFE29A', '#B57B12'), stroke: '#8A6A1E', 'stroke-width': 2 }, keyF);
  E('path', { d: 'M6,66 L14,66 L14,74 L6,74 M6,84 L12,84 L12,92 L6,92', fill: '#E0B84A', stroke: '#8A6A1E', 'stroke-width': 2, 'stroke-linejoin': 'round' }, keyF);
  const airF = G(gF);
  [-14, 0, 14].forEach((y, i) => E('path', { d: `M0,${y} q14,-5 ${[26, 38, 26][i]},0`, fill: 'none', stroke: '#DCE6EC', 'stroke-width': 3, 'stroke-linecap': 'round' }, airF));
  const puffs = [0, 1, 2, 3, 4, 5].map(k => spark(gF, 8, { color: EN.wasted, seed: k + 11 }));
  const home = G(gF); tr(home, 935, 228);
  const homeChip = chip(home, 'try it at home', { size: 26, fill: C.card2, stroke: C.good, sw: 2.5, padX: 26 });
  const house = G(home); tr(house, -homeChip.w / 2 - 34, 0);
  E('path', { d: 'M-20,2 L0,-18 L20,2 L14,2 L14,20 L-14,20 L-14,2 Z', fill: C.good, stroke: '#9EF0C4', 'stroke-width': 2, 'stroke-linejoin': 'round' }, house);
  E('rect', { x: -5, y: 8, width: 10, height: 12, fill: C.bg0 }, house);
  const chipAirF = tag(gF, 'air resistance', '#DCE6EC');
  const JF = [[790, 420], [930, 420], [1070, 420]];
  const ampAt = t => A0 * Math.pow(1 - clamp((t - tDec0) / (tDec1 - tDec0)), 1.6);
  const thetaAt = t => ampAt(t) * Math.cos(TAU * (t - tSw0) / PER);
  const keyPos = th => [PX + LEN * Math.sin(th), PY + LEN * Math.cos(th)];

  /* ================= update ================= */
  return t => {
    const aA = win(t, S.first - 0.5, at('ball') - 0.05, 0.35);
    const aB = win(t, at('ball') - 0.15, at('flow') - 0.05, 0.35);
    const aC = win(t, at('flow') - 0.15, at('toy') - 0.05, 0.35);
    const aD = win(t, at('toy') - 0.15, at('coaster') - 0.05, 0.35);
    const aE = win(t, at('coaster') - 0.15, at('pendulum') - 0.05, 0.35);
    const aF = P(t, at('pendulum') - 0.15, 0.4, linear);
    op(gA, aA); op(gB, aB); op(gC, aC); op(gD, aD); op(gE, aE); op(gF, aF);

    /* --- A: the balance --- */
    if (aA > 0) {
      rise(hdr, popIn(t, S.first - 0.2));
      const tIn = mid('before', 0.45), tOut = mid('before', 0.8);
      const ang = -11 * settle(t - tIn - 0.35) + 11 * settle(t - tOut - 0.35);
      beam.setAttribute('transform', `rotate(${ang.toFixed(2)})`);
      const c = Math.cos(ang * Math.PI / 180), s = Math.sin(ang * Math.PI / 180);
      tr(panL, -BH * c, -BH * s); tr(panR, BH * c, BH * s);
      op(BAL, P(t, mid('before', 0.36), 0.4, linear));
      const dl = P(t, tIn, 0.35, easeIn), dr = P(t, tOut, 0.35, easeIn);
      op(mjG, clamp(dl * 4)); tr(mjG, 0, 74 - 70 * (1 - dl));
      op(mjK, clamp(dr * 4)); tr(mjK, -38, 74 - 70 * (1 - dr));
      op(mjT, clamp(dr * 4)); tr(mjT, 38, 74 - 70 * (1 - dr));
      op(labB, P(t, mid('before', 0.42), 0.4, linear)); op(labA, P(t, mid('before', 0.8), 0.4, linear));
      const ep = popIn(t, mid('before', 0.85), 0.45); op(eqA, clamp(ep * 2));
      eqA.setAttribute('transform', `translate(600 214) scale(${Math.max(0.01, ep).toFixed(3)}) translate(-600 -214)`);
      op(chgA, P(t, tOut + 0.5, 0.5, linear));
    }

    /* --- B: the falling ball --- */
    const fB = fallen(t), kHit = 1 - P(t, mid('hits', 0.28), 2.8, linear);
    const gLv = P(t, mid('ball', 0.62), 1.2, linear) * (1 - fB);
    const kLv = t < tHit ? fB : kHit;
    const thLv = t < tHit ? 0 : 0.84 * (1 - kHit), sdLv = t < tHit ? 0 : 0.16 * (1 - kHit);
    if (aB > 0) {
      op(level, P(t, mid('ball', 0.45), 0.4, linear) * (1 - P(t, tLet, 0.4, linear)));
      // ball, hand, ghosts, speed lines
      const by = BTOP + DROP * fB, bump = Math.sin(Math.PI * clamp((t - tHit) / 0.22));
      const sy = 1 - 0.28 * bump, sx = 1 + 0.22 * bump;
      ballK.setAttribute('transform', `translate(0 ${(BR * (1 - sy)).toFixed(2)}) scale(${sx.toFixed(3)} ${sy.toFixed(3)})`);
      const bp = popIn(t, mid('ball', 0.36));
      op(ballB, clamp(bp * 2)); tr(ballB, BX, by);
      op(warmBall, 0.4 * P(t, tHit, 1.2, linear));
      op(handB, clamp(bp * 2) * (1 - P(t, tLet, 0.5, linear))); tr(handB, BX, BTOP - BR - 17 - 30 * P(t, tLet, 0.6, easeOut));
      const v = speedAt(t);
      op(speedB, clamp(v * 3.2) * 0.85); tr(speedB, BX, by, Math.max(0.3, clamp(v * 2.6)));
      ghosts.forEach((g, i) => {
        const u = (i + 1) / 7, tp = tLet + u * TF;
        attr(g, 'cx', BX); attr(g, 'cy', BTOP + DROP * FZ * u * u);
        op(g, 0.6 * P(t, tp, 0.25, linear) * (1 - P(t, mid('hits', 0.2), 0.6, linear)));
      });
      const fz = win(t, tFz - 0.05, tHit - 0.1, 0.25);
      op(snap, fz * (1 - P(t, tFz, 0.6, linear)) * 0.9); attr(snap, 'cy', BTOP + DROP * FZ); attr(snap, 'r', 40 + 20 * P(t, tFz, 0.6, easeOut));
      show(chipFast, popIn(t, mid('falls', 0.52)) * (1 - P(t, mid('falls', 0.68), 0.3, linear)), 400, 380);
      show(chipLand, fz * popIn(t, tFz), 428, 580);
      // the impact: warmth spreading, sound rings
      const sp = P(t, tHit, 1.8, easeOut);
      op(glowB, t < tHit ? 0 : (1 - sp) * 0.95 + 0.3); attr(glowB, 'rx', 40 + 190 * sp); attr(glowB, 'ry', 14 + 56 * sp);
      const sr = mid('hits', 0.45), EM = [tHit, tHit + 0.3, tHit + 0.6, sr, sr + 0.55, sr + 1.1, sr + 1.65];
      rings.forEach((r, i) => {
        let e = -1; for (let k = i; k < EM.length; k += 3) if (t >= EM[k]) e = EM[k];
        const u = (t - e) / 1.6;
        if (e < 0 || u >= 1) { op(r, 0); return; }
        const rad = 40 + 230 * u;
        r.setAttribute('d', `M${BX - rad},${RB} A${rad},${rad} 0 0 1 ${BX + rad},${RB}`);
        op(r, (1 - u) * 0.85);
      });
      show(chipSound, popIn(t, sr + 0.1), 400, 452);
      // jars, sparks and the total
      rise(totG, popIn(t, at('ball') + 0.2));
      setTotal([gLv, kLv, thLv, sdLv], 1);
      op(topLine, P(t, mid('ball', 0.7), 0.4, linear));
      op(sameT, P(t, mid('falls', 0.3), 0.5, linear));
      fGK.set(t, P(t, tLet + 0.3, 0.4, linear) * (1 - P(t, tFz - 0.2, 0.5, linear)));
      fKT.set(t, P(t, mid('hits', 0.28), 0.4, linear) * (1 - P(t, mid('hits', 0.28) + 2.4, 0.5, linear)));
      fKS.set(t, P(t, sr, 0.3, linear) * (1 - P(t, sr + 1.5, 0.4, linear)));
      show(chipSoundJ, popIn(t, sr + 0.2) * (1 - P(t, at('flow') - 0.6, 0.4, linear)), 880, 196);
    }

    /* --- C: the flow diagram --- */
    if (aC > 0) {
      rise(flowT, popIn(t, mid('flow', 0.18)));
      const cp = P(t, mid('flow', 0.44), 0.55) + P(t, mid('flow', 0.67), 0.55) + P(t, mid('flow', 0.82), 0.55);
      chain.set(cp);
      cBadges.forEach((c, i) => show(c.b, P(t, mid('flow', [0.46, 0.69, 0.84][i]), 0.5, pop), c.x - (i === 2 ? 26 : 0), 316));
      show(soundIcon, popIn(t, mid('flow', 0.9)), 600 + chain.boxes[2].cx + 40, 316);
      op(flowSub, P(t, end('flow') - 0.2, 0.5, linear));
    }

    /* --- D: the wind-up toy --- */
    const run = P(t, tRun, tRunEnd - tRun, linear), wind = P(t, mid('toy', 0.12), mid('toy', 0.42) - mid('toy', 0.12), linear);
    const eLv = wind * (1 - 0.78 * run), kLvD = 0.62 * run, thLvD = 0.16 * run;
    if (aD > 0) {
      const x = lerp(TOYX0, TOYX1, run), ph = (x - TOYX0) / 22, moving = run > 0 && run < 1 ? 1 : 0;
      tr(toy, x, TOYY - 3 * Math.abs(Math.sin(ph)) * moving);
      op(toy, P(t, at('toy') - 0.1, 0.4, linear));
      legs.forEach((l, i) => l.g.setAttribute('transform', `rotate(${(18 * Math.sin(ph + i * Math.PI) * moving).toFixed(1)} ${l.x} -40)`));
      armT.setAttribute('transform', `translate(40 -104) rotate(${(-25 * Math.sin(ph) * moving).toFixed(1)})`);
      const keyAng = 9 * (t - mid('toy', 0.12)) * (t > mid('toy', 0.12) && t < mid('toy', 0.42) ? 1 : 0) - 3 * Math.max(0, t - tRun);
      wings.setAttribute('transform', `translate(-18 0) scale(1 ${Math.cos(keyAng).toFixed(3)})`);
      // the spring: tighter coils hold more energy
      const turns = 1.6 + 2.6 * eLv, th1 = turns * TAU; let d = '';
      for (let a = 0; a <= th1; a += 0.32) { const r = 3 + 21 * a / th1; d += (a ? 'L' : 'M') + (r * Math.cos(a)).toFixed(1) + ',' + (-82 + r * Math.sin(a)).toFixed(1); }
      spiral.setAttribute('d', d);
      const hp = win(t, at('toy') + 0.1, tRun - 0.15, 0.3);
      op(handD, hp); tr(handD, x - 48 - 18 - 28 - 17 + 4 * Math.sin(t * 9), TOYY - 82);
      fEK.set(t, P(t, tRun, 0.4, linear)); fET.set(t, P(t, tRun + 0.3, 0.4, linear));
      feet.forEach((f, k) => {
        const q = ((ph / Math.PI + k / 3) % 1 + 1) % 1;
        tr(f, x - 6 - 36 * q, TOYY - 4 - 16 * q, 0.8 + 0.4 * (1 - q)); op(f, moving * Math.sin(q * Math.PI)); f.upd(t);
      });
      op(fricT, P(t, mid('toy', 0.88), 0.4, linear));
    }

    /* --- E: the roller coaster --- */
    const ride = rideAt(t);
    const gLvE = ride.p.h / ETOT, kLvE = (t <= tDep ? 0 : ride.p.ke) / ETOT, thLvE = ride.p.loss / ETOT;
    if (aE > 0) {
      const dp = P(t, at('coaster') - 0.1, 1.3, linear);
      trkBand.setAttribute('stroke-dashoffset', (1 - dp).toFixed(4)); trkRail.setAttribute('stroke-dashoffset', (1 - dp).toFixed(4));
      const [cx, cy] = carPos(ride), cpp = popIn(t, mid('coaster', 0.3));
      op(car, clamp(cpp * 2) * (1 - clamp((cx - 1130) / 40)));
      tr(car, cx, cy - (1 - clamp(cpp)) * 16, CARS, ride.ang * 180 / Math.PI);
      op(streaks, clamp((ride.p.v / VMAX - 0.45) * 2.5) * (t > tDep ? 1 : 0));
      op(hiG, win(t, mid('coaster', 0.75), at('swap') + 0.3, 0.3) * (0.6 + 0.4 * wave(t, 0.9)));
      show(chipFastE, popIn(t, mid('swap', 0.4)) * (1 - P(t, mid('swap', 0.66), 0.3, linear)), 300, 600);
      show(chipSlowE, popIn(t, mid('swap', 0.9)) * (1 - P(t, mid('lower', 0.3), 0.3, linear)), 700, 345);
      const dl = P(t, at('lower') + 0.1, 0.9);
      attr(dash1, 'x2', lerp(230, 1160, dl)); op(dash1, dl > 0 ? 1 : 0);
      op(dashLab, P(t, at('lower') + 0.5, 0.4, linear));
      gaps.forEach((g, i) => { const p = popIn(t, mid('lower', 0.18 + i * 0.12)); op(g, clamp(p * 2)); });
      show(chipFric, popIn(t, mid('lower', 0.5)), 845, 380);
      show(chipAir, popIn(t, mid('lower', 0.6)), 1065, 380);
      const tk = P(t, mid('lower', 0.45), 0.5, linear), base = t > tDep ? 0.35 : 0, PD = 2.4;
      trickle.forEach((sp, k) => {
        const a = (((t - tDep) / PD + k / 6) % 1 + 1) % 1, te = t - a * PD;
        if (te < tDep) { op(sp, 0); return; }
        const [sx, sy] = carPos(rideAt(te)), ex = 1080, ey = 140, q = ease(a);
        const mx = (sx + ex) / 2, my = Math.min(sy, ey) - 70;
        tr(sp, (1 - q) * (1 - q) * sx + 2 * (1 - q) * q * mx + q * q * ex, (1 - q) * (1 - q) * sy + 2 * (1 - q) * q * my + q * q * ey, 0.9 - 0.3 * q);
        op(sp, Math.max(base, tk) * Math.sin(a * Math.PI)); sp.upd(t);
      });
    }

    /* --- F: the swinging key --- */
    const thF = thetaAt(t), amp = ampAt(t), c0 = 1 - Math.cos(A0);
    const eMech = (1 - Math.cos(amp)) / c0, gLvF = (1 - Math.cos(thF)) / c0, kLvF = Math.max(0, eMech - gLvF), thLvF = 1 - eMech;
    if (aF > 0) {
      const [kx, ky] = keyPos(thF);
      attr(stringF, 'x2', kx); attr(stringF, 'y2', ky);
      tr(keyF, kx, ky, 1, -thF * 180 / Math.PI);
      op(keyF, 1); op(arcF, 0.8 * (1 - P(t, tDec1 - 1.5, 1.2, linear)));
      const rel = amp > 0.002 ? Math.abs(thF) / amp : 0;
      const gOn = P(t, mid('pendulum', 0.33), 0.4, linear), kOn = P(t, mid('pendulum', 0.54), 0.4, linear);
      const gHi = clamp((rel - 0.7) / 0.25) * clamp(amp / A0 * 3), kHi = clamp((0.3 - rel) / 0.3) * clamp(amp / A0 * 3);
      op(gravL, gOn * (0.4 + 0.6 * (thF < 0 ? gHi : 0))); op(gravR, gOn * (0.4 + 0.6 * (thF > 0 ? gHi : 0)));
      op(kinB, kOn * (0.4 + 0.6 * kHi));
      tr(gravL, 170, 320, 1 + 0.08 * (thF < 0 ? gHi : 0)); tr(gravR, 630, 320, 1 + 0.08 * (thF > 0 ? gHi : 0)); tr(kinB, 400, 644, 1 + 0.08 * kHi);
      show(home, popIn(t, at('pendulum') + 0.05), 935, 228);
      // air resistance and heat as it slows
      const omega = -ampAt(t) * Math.sin(TAU * (t - tSw0) / PER), dec = P(t, tDec0, 0.6, linear) * clamp(amp / A0 * 2.5);
      tr(airF, PX + (LEN + 50) * Math.sin(thF), PY + (LEN + 50) * Math.cos(thF), 1, (omega > 0 ? 180 : 0) - thF * 180 / Math.PI);
      op(airF, dec * clamp(Math.abs(omega) / A0 * 1.6) * 0.8);
      puffs.forEach((sp, k) => {
        const a = ((t / 2.1 + k / 6) % 1 + 1) % 1, te = t - a * 2.1, [px, py] = keyPos(thetaAt(te));
        const dx = px - PX, dy = py - PY, L = Math.hypot(dx, dy) || 1;
        tr(sp, px + dx / L * 70 * a, py + 30 + dy / L * 70 * a, 1 - 0.5 * a);
        op(sp, P(te, tDec0, 0.6, linear) * (te < tDec1 ? 1 : 0) * Math.sin(a * Math.PI) * 0.9); sp.upd(t);
      });
      show(chipAirF, popIn(t, mid('slows', 0.3)), 640, 646);
    }

    /* --- the shared jars --- */
    place(J.gravitational, [
      { a: aB, p: popIn(t, at('ball') + 0.1), x: JBX[0], y: JBY, lv: gLv },
      { a: aE, p: popIn(t, mid('coaster', 0.55)), x: JE[0][0], y: JE[0][1], lv: gLvE },
      { a: aF, p: popIn(t, mid('pendulum', 0.3)), x: JF[0][0], y: JF[0][1], lv: gLvF },
    ]);
    place(J.kinetic, [
      { a: aB, p: popIn(t, at('ball') + 0.2), x: JBX[1], y: JBY, lv: kLv },
      { a: aD, p: popIn(t, mid('toy', 0.5)), x: 600, y: 280, lv: kLvD },
      { a: aE, p: popIn(t, mid('coaster', 0.62)), x: JE[1][0], y: JE[1][1], lv: kLvE },
      { a: aF, p: popIn(t, mid('pendulum', 0.34)), x: JF[1][0], y: JF[1][1], lv: kLvF },
    ]);
    place(J.thermal, [
      { a: aB, p: popIn(t, mid('hits', 0.25)), x: JBX[2], y: JBY, lv: thLv },
      { a: aD, p: popIn(t, mid('toy', 0.56)), x: 770, y: 280, lv: thLvD },
      { a: aE, p: popIn(t, mid('coaster', 0.69)), x: JE[2][0], y: JE[2][1], lv: thLvE },
      { a: aF, p: popIn(t, mid('pendulum', 0.38)), x: JF[2][0], y: JF[2][1], lv: thLvF },
    ]);
    place(J.elastic, [{ a: aD, p: popIn(t, mid('toy', 0.25)), x: 430, y: 280, lv: eLv }]);
  };
});
