/* Chapter 3, Balanced and unbalanced forces. Scale: 10 N = 40 px (FM.scale) for every arrow.
   Beats: four forces on the crate -> they add head to tail into one yellow resultant -> balanced: 20 N each way
   cancel to 0 N -> a still crate stays still; a moving crate glides at a steady speed -> a cruising car: driving
   force = friction and drag -> unbalanced: a resultant changes the motion -> speeds up, slows down, changes
   direction -> on a number line: add the same way, subtract the opposite way -> 30 N - 12 N = 18 N, and the box
   speeds up -> showpiece: the skydiver's drag grows until it matches their weight (terminal velocity). */
scene('balanced', S => {
  const { at, end, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;
  const SC = FM.scale;                                    // 4 px per newton
  const beat = (t, a, b) => win(t, a, b, 0.4);
  let nClip = 0;
  function clipRect(x, y, w, h, rx) { const id = 'fbBalClip' + (++nClip); const cp = E('clipPath', { id }, defs()); E('rect', { x, y, width: w, height: h, rx: rx || 0 }, cp); return `url(#${id})`; }
  /* a row of differently coloured words, laid out from (x, y) (anchor: 'middle' centres the whole row) */
  function words(parent, x, y, segs, o) {
    o = o || {};
    const size = o.size || 40, gap = size * 0.28, els = [];
    const ws = segs.map(s => textWidth(s[0], size, FD, 700));
    let cx = o.anchor === 'middle' ? x - (ws.reduce((a, b) => a + b, 0) + gap * (segs.length - 1)) / 2 : x;
    segs.forEach((s, i) => { els.push(T(parent, cx, y, s[0], { size, weight: 700, fill: s[1] || C.ink })); cx += ws[i] + gap; });
    return els;
  }
  const ghostCrate = (parent, w, h) => E('rect', { x: -w / 2, y: -h, width: w, height: h, rx: 6, fill: 'none', stroke: FM.wood[2], 'stroke-width': 3, 'stroke-dasharray': '8 7', opacity: 0.45 }, parent);

  /* ================= the floor, shared by every crate beat ================= */
  const ground = G(root);
  fmFloor(ground, 20, 1180, 560);
  const scaleBar = G(root);
  T(scaleBar, 990, 700, 'scale', { size: 26, weight: 600, fill: C.muted, anchor: 'end' });
  fmScaleBar(scaleBar, 1006, 694, 10, { scale: SC });

  /* ================= A. many forces -> one resultant -> balanced -> stays still ================= */
  const A = G(root);
  fmCrate(A, 180, 140).at(600, 560);                                   // x 510..690, centre (600, 490)
  const pushA = fmArrow(A, 'push', 510, 490, 40, 'right', { tip: true, scale: SC, value: false });
  const fricA = fmArrow(A, 'friction', 510, 560, 15, 'left', { scale: SC, value: false, labelAt: 'tip', nudge: [0, -20] });
  const wtA = fmArrow(A, 'weight', 600, 490, 40, 'down', { scale: SC, value: false, labelAt: 'tip' });
  const nrA = fmArrow(A, 'normal', 616, 560, 40, 'up', { scale: SC, value: false, labelAt: 'tip' });
  // the sum row: the sideways forces head to tail, and the resultant under them
  const SY = 262;
  const sumPush = fmArrow(A, 'push', 0, 0, 40, 'right', { scale: SC, label: '', value: false });
  const sumFric = fmArrow(A, 'friction', 0, 0, 15, 'left', { scale: SC, label: '', value: false });
  const resA = fmArrow(A, 'resultant', 430, SY + 40, 25, 'right', { scale: SC, label: 'resultant force', value: false, labelAt: 'tip', size: 30 });
  const cancelV = G(A); T(cancelV, 800, 404, 'up and down', { size: 26, weight: 600, fill: C.muted }); T(cancelV, 800, 436, 'cancel out', { size: 26, weight: 700, fill: C.muted });
  // balanced: 20 N each way
  const balL = fmArrow(A, 'push', 510, 490, 20, 'right', { tip: true, scale: SC, nudge: [-36, 0] });
  const balR = fmArrow(A, 'push', 690, 490, 20, 'left', { tip: true, scale: SC, nudge: [36, 0] });
  const sumL = fmArrow(A, 'push', 0, 0, 20, 'right', { scale: SC, label: '', value: false });
  const sumR = fmArrow(A, 'push', 0, 0, 20, 'left', { scale: SC, label: '', value: false });
  const zeroA = G(A); tr(zeroA, 600, SY + 10);
  chip(zeroA, 'resultant force: 0 N', { size: 32, fill: C.card2, stroke: C.energy, color: C.energy });
  const eqTxt = T(A, 600, 380, 'equal in size, opposite in direction', { size: 30, weight: 600, anchor: 'middle', fill: C.muted });
  const stillBadge = G(A); tr(stillBadge, 940, 490);
  chip(stillBadge, 'stays still', { size: 32, fill: C.card2, stroke: C.good, color: C.good });

  /* ================= A2. a moving crate glides at a steady speed ================= */
  const A2 = G(root);
  // a mark on the floor every second, under the crate's middle: equal gaps mean a steady speed
  const ticks2 = [1, 2, 3, 4].map(k => { const g = G(A2); E('line', { x1: 0, x2: 0, y1: 548, y2: 576, stroke: C.energy, 'stroke-width': 4, 'stroke-linecap': 'round' }, g); T(g, 0, 616, k + ' s', { size: 26, weight: 700, anchor: 'middle', fill: C.energy }); return g; });
  const cr2 = fmCrate(A2, 180, 140);
  const push2 = fmArrow(A2, 'push', 0, 0, 20, 'right', { tip: true, scale: SC, nudge: [-40, 0] });
  const fric2 = fmArrow(A2, 'friction', 0, 0, 20, 'left', { scale: SC, side: 'above', nudge: [-40, 0] });
  const gauge2 = meter(A2, { w: 240, h: 26, color: C.energy, label: 'speed' }); tr(gauge2, 880, 176);
  const steady2 = G(A2); tr(steady2, 1000, 252); chip(steady2, 'steady speed', { size: 28, fill: C.card2, stroke: C.line });
  const zero2 = G(A2); tr(zero2, 600, 262); chip(zero2, 'resultant force: 0 N', { size: 32, fill: C.card2, stroke: C.energy, color: C.energy });
  const line2 = T(A2, 600, 352, 'same distance every second, in a straight line', { size: 28, weight: 600, anchor: 'middle', fill: C.muted });
  const V2 = 150, T2 = mid('still', 0.47), X2 = -70;                  // px per second, start time, start x

  /* ================= B. a cruising car ================= */
  const B = G(root);
  E('rect', { x: 0, y: 560, width: W, height: 56, fill: '#26323B' }, B);
  E('line', { x1: 0, x2: W, y1: 560, y2: 560, stroke: '#8FA3B3', 'stroke-width': 4 }, B);
  const lane = E('line', { x1: 0, x2: W, y1: 590, y2: 590, stroke: '#E9F2F7', 'stroke-width': 5, 'stroke-dasharray': '46 54', opacity: 0.7 }, B);
  const posts = G(B); const postEls = [0, 1, 2, 3].map(() => { const g = G(posts); E('rect', { x: -5, y: -86, width: 10, height: 86, fill: '#5F6E7B' }, g); E('circle', { cx: 0, cy: -92, r: 12, fill: '#56B4A0' }, g); return g; });
  const car = fmCar(B); tr(car, 560, 560);
  const drive = fmArrow(B, 'drive', 560 + car.pt.front[0], 560 + car.pt.front[1], 30, 'right', { scale: SC, value: false, labelAt: 'tip' });
  const dragB = fmArrow(B, 'drag', 560 + car.pt.back[0], 560 + car.pt.back[1], 30, 'left', { scale: SC, value: false, labelAt: 'tip', label: 'friction and drag' });
  const gaugeB = meter(B, { w: 240, h: 26, color: C.energy, label: 'speed' }); tr(gaugeB, 880, 176);
  const noNeed = G(B); tr(noNeed, 540, 186); chip(noNeed, 'no resultant force needed to keep moving', { size: 30, fill: C.card2, stroke: C.good });
  const onlyChange = T(B, 540, 254, 'a resultant force only changes the motion', { size: 28, weight: 600, anchor: 'middle', fill: C.muted });
  const zeroB = G(B); tr(zeroB, 560, 378); chip(zeroB, 'balanced: resultant 0 N', { size: 30, fill: C.card2, stroke: C.energy, color: C.energy });

  /* ================= C. unbalanced: a resultant changes the motion ================= */
  const Cu = G(root);
  const crC = fmCrate(Cu, 180, 140);
  const pushC = fmArrow(Cu, 'push', 0, 0, 35, 'right', { tip: true, scale: SC, value: false });
  const fricC = fmArrow(Cu, 'friction', 0, 0, 15, 'left', { scale: SC, value: false, labelAt: 'tip', nudge: [0, -20] });
  const resC = fmArrow(Cu, 'resultant', 0, 0, 20, 'right', { scale: SC, label: 'resultant force', value: false, size: 30 });
  const gaugeC = meter(Cu, { w: 240, h: 26, color: C.energy, label: 'speed' }); tr(gaugeC, 880, 176);
  const noCancel = T(Cu, 600, 262, 'unequal: they don’t cancel', { size: 34, weight: 700, anchor: 'middle', fill: C.muted });
  const XC = 430;

  /* ================= D. speeds up, slows down, changes direction ================= */
  const D = G(root);
  const PX = [210, 600, 990], PY = 370, PW = 340, PH = 280;
  const PNAME = ['speeds up', 'slows down', 'changes direction'];
  const panels = PX.map((x, i) => {
    const g = G(D); tr(g, x, PY);
    card(g, -PW / 2, -PH / 2, PW, PH, { fill: C.card, stroke: C.line });
    const inner = G(g, { 'clip-path': clipRect(-PW / 2 + 2, -PH / 2 + 2, PW - 4, PH - 4, 20) });
    const name = T(D, x, PY + PH / 2 + 50, PNAME[i], { size: 32, weight: 700, anchor: 'middle' });
    return { g, inner, name, x };
  });
  // where the crate is at equal steps of time: dots on the floor that spread out (speeding up) or bunch up
  const mkCratePanel = (p, decel) => {
    const a = p.inner;
    E('line', { x1: -PW / 2, x2: PW / 2, y1: 76, y2: 76, stroke: '#8FA3B3', 'stroke-width': 4 }, a);
    const gh = [0, 1, 2, 3, 4].map(() => E('circle', { r: 7, fill: C.energy, stroke: C.bg0, 'stroke-width': 2 }, a));
    const cr = fmCrate(a, 92, 72);
    const rs = fmArrow(a, 'resultant', 0, 0, 12, decel ? 'left' : 'right', { scale: SC, label: '', value: false });
    const gg = meter(a, { w: 130, h: 20, color: C.energy }); tr(gg, 10, -104);
    T(a, -2, -87, 'speed', { size: 26, weight: 600, fill: C.muted, anchor: 'end' });
    const xs = u => decel ? -116 + 230 * (1 - (1 - u) * (1 - u)) : -116 + 230 * u * u;
    return { gh, cr, rs, gg, xs, decel };
  };
  const pd1 = mkCratePanel(panels[0], false), pd2 = mkCratePanel(panels[1], true);
  const p3 = panels[2].inner;
  E('line', { x1: -140, y1: -70, x2: 150, y2: -70, stroke: C.faint, 'stroke-width': 3, 'stroke-dasharray': '8 8' }, p3);
  T(p3, 150, -86, 'without the force', { size: 26, weight: 600, fill: C.muted, anchor: 'end' });
  const path3 = E('path', { fill: 'none', stroke: C.muted, 'stroke-width': 3, 'stroke-dasharray': '3 7', 'stroke-linecap': 'round' }, p3);
  const dots3 = [0, 1, 2, 3, 4].map(() => E('circle', { r: 16, fill: 'none', stroke: C.muted, 'stroke-width': 2.5, opacity: 0.6 }, p3));
  const ball3 = G(p3); E('circle', { r: 18, fill: ball('#FFFFFF', '#B9C6D2'), stroke: '#8597A6', 'stroke-width': 2 }, ball3);
  const rs3 = fmArrow(p3, 'resultant', 0, 0, 12, 'down', { scale: SC, label: '', value: false });
  const P3 = u => [-126 + 250 * u, -70 + 150 * u * u];

  /* ================= E. along a line: add the same way, subtract the opposite way ================= */
  const Ea = G(root);
  const NX = 300, R1 = 232, R2 = 476;
  const numLine = (y) => {
    const g = G(Ea);
    E('line', { x1: NX, x2: NX + 130 * SC, y1: y, y2: y, stroke: C.muted, 'stroke-width': 3 }, g);
    E('path', { d: [0, 20, 40, 60, 80, 100, 120].map(v => `M${NX + v * SC},${y - 8} L${NX + v * SC},${y + 8}`).join(' '), stroke: C.muted, 'stroke-width': 3 }, g);
    [0, 20, 40, 60, 80, 100, 120].forEach(v => T(g, NX + v * SC, y + 32, String(v), { size: 24, weight: 600, fill: C.muted, anchor: 'middle' }));
    T(g, NX + 130 * SC + 12, y + 8, 'N', { size: 24, weight: 700, fill: C.muted });
    return g;
  };
  const nl1 = numLine(R1 + 104), nl2 = numLine(R2 + 134);
  const h1 = G(Ea); T(h1, 60, R1 + 6, 'Same way:', { size: 30, weight: 600, fill: C.muted }); T(h1, 60, R1 + 56, 'add', { size: 48, weight: 700, fill: C.energy });
  const h2 = G(Ea); T(h2, 60, R2 + 6, 'Opposite ways:', { size: 30, weight: 600, fill: C.muted }); T(h2, 60, R2 + 56, 'subtract', { size: 48, weight: 700, fill: C.energy });
  const a1 = fmArrow(Ea, 'push', NX, R1, 80, 'right', { scale: SC, label: '' });
  const b1 = fmArrow(Ea, 'push', 0, R1, 40, 'right', { scale: SC, label: '' });
  const r1 = fmArrow(Ea, 'resultant', NX, R1 + 50, 120, 'right', { scale: SC, label: '', labelAt: 'tip' });
  const s1 = words(Ea, 1160, R1 + 8, [['80', C.good], ['+', C.muted], ['40', C.good], ['=', C.muted], ['120 N', C.energy]], { size: 36 });
  const a2 = fmArrow(Ea, 'push', NX, R2, 80, 'right', { scale: SC, label: '' });
  const b2 = fmArrow(Ea, 'friction', 0, 0, 40, 'left', { scale: SC, label: '', side: 'below' });
  const band2 = E('rect', { x: NX + 40 * SC, y: R2 - 14, width: 40 * SC, height: 58, rx: 10, fill: 'rgba(255,255,255,0.07)', stroke: C.muted, 'stroke-width': 2, 'stroke-dasharray': '6 6' }, Ea);
  const r2 = fmArrow(Ea, 'resultant', NX, R2 + 84, 40, 'right', { scale: SC, label: '', labelAt: 'tip' });
  const s2 = words(Ea, 1160, R2 + 8, [['80', C.good], ['−', C.muted], ['40', C.oxygen], ['=', C.muted], ['40 N', C.energy]], { size: 36 });
  // right-align the two sums
  [s1, s2].forEach(row => { const last = row[row.length - 1], dx = 1160 - (+last.getAttribute('x') + textWidth(last.textContent, 36, FD, 700)); row.forEach(el => attr(el, 'x', +el.getAttribute('x') + dx)); });

  /* ================= F. the worked example: 30 N - 12 N = 18 N ================= */
  const Fx = G(root);
  const crF = fmCrate(Fx, 180, 140);
  const pushF = fmArrow(Fx, 'push', 0, 0, 30, 'right', { tip: true, scale: SC });
  const fricF = fmArrow(Fx, 'friction', 0, 0, 12, 'left', { scale: SC, labelAt: 'tip', nudge: [0, -20] });
  const FXS = 300, FSY = 330;                                          // the sum row
  const sumPF = fmArrow(Fx, 'push', FXS, FSY, 30, 'right', { scale: SC, label: '', value: false });
  const sumFF = fmArrow(Fx, 'friction', FXS + 30 * SC, FSY - 20, 12, 'left', { scale: SC, label: '', value: false });
  const resF = fmArrow(Fx, 'resultant', FXS, FSY + 34, 18, 'right', { scale: SC, label: 'resultant', labelAt: 'tip', size: 30 });
  const fWords = words(Fx, 600, 196, [['30 N', C.good], ['−', C.muted], ['12 N', C.oxygen], ['=', C.muted], ['18 N', C.energy]], { size: 50, anchor: 'middle' });
  const fwd = T(Fx, 600, 250, 'forwards, so the box speeds up', { size: 30, weight: 600, anchor: 'middle', fill: C.muted });
  const gaugeF = meter(Fx, { w: 240, h: 26, color: C.energy, label: 'speed' }); tr(gaugeF, 880, 330);
  const XF = 400;

  /* ================= G. the skydiver and terminal velocity ================= */
  const Gs = G(root);
  E('rect', { x: 0, y: 0, width: W, height: H, fill: linGrad('#16405A', '#3C7FA0', true) }, Gs);
  const cr_ = rng(31), clouds = [];
  for (let i = 0; i < 7; i++) clouds.push({ el: E('ellipse', { rx: 90 + cr_() * 80, ry: 22 + cr_() * 14, fill: '#DDEBF3', opacity: (0.12 + cr_() * 0.1).toFixed(2) }, Gs), x: 60 + cr_() * 1080, y: cr_() * 900 });
  const SKX = 560, SKY = 404, WN = 50, DS = 1.3;                        // the skydiver's centre; weight 50 N on this scale = 200 px
  const diver = person(Gs, { shirt: '#E8424F', shorts: '#E8424F', shoes: '#2B3A44' });
  {
    const body = diver.firstChild;                                     // the kit person's body group (as fmAstronaut adds its pack)
    body.insertBefore(E('rect', { x: -34, y: -158, width: 24, height: 60, rx: 8, fill: '#2B3A44', stroke: '#5F6E7B', 'stroke-width': 2 }), body.firstChild);
    E('path', { d: 'M-21,-170 Q-22,-197 0,-198 Q22,-198 22,-174 Z', fill: '#F2F7FA', stroke: '#B9C6D2', 'stroke-width': 2 }, body);
    E('rect', { x: 3, y: -184, width: 19, height: 10, rx: 5, fill: '#2B3A44', stroke: C.water, 'stroke-width': 2 }, body);
  }
  diver.pose({ lean: 0, armL: [-150, 62], armR: [-138, 56], legL: [-14, -74], legR: [-26, -82] });
  tr(diver, SKX - 100 * DS, SKY, DS, 90);
  const wtG = fmArrow(Gs, 'weight', SKX, SKY, WN, 'down', { scale: SC, value: false, labelAt: 'tip', size: 30 });
  const DRY = SKY - 24;
  const ghostD = G(Gs);
  { const tipY = DRY - WN * SC, hs = 8 * 3.1; E('path', { d: `M${SKX - 4},${DRY} L${SKX - 4},${tipY + hs * 0.72} L${SKX - hs * 0.62},${tipY + hs} L${SKX},${tipY} L${SKX + hs * 0.62},${tipY + hs} L${SKX + 4},${tipY + hs * 0.72} L${SKX + 4},${DRY} Z`, fill: 'none', stroke: C.glucose, 'stroke-width': 2.5, 'stroke-dasharray': '7 6', 'stroke-linejoin': 'round' }, ghostD); }
  T(ghostD, SKX - 46, DRY - WN * SC + 34, 'as big as the weight', { size: 26, weight: 600, fill: C.glucoseLt, anchor: 'end' });
  const drG = fmArrow(Gs, 'drag', SKX, DRY, 0, 'up', { scale: SC, value: false, labelAt: 'tip', size: 30 });
  const gaugeG = meter(Gs, { w: 240, h: 26, color: C.energy, label: 'speed' }); tr(gaugeG, 880, 176);
  const sdA = G(Gs); tr(sdA, 230, 300); chip(sdA, 'weight > drag', { size: 34, fill: 'rgba(10,27,39,0.75)', stroke: C.glucose });
  const sdB = T(Gs, 230, 370, 'so they speed up', { size: 30, weight: 700, anchor: 'middle', fill: C.ink });
  const tvA = G(Gs); tr(tvA, 230, 300); chip(tvA, 'drag = weight', { size: 34, fill: 'rgba(10,27,39,0.75)', stroke: C.energy, color: C.energy });
  const tvB = T(Gs, 230, 370, 'a steady speed', { size: 30, weight: 700, anchor: 'middle', fill: C.ink });
  const tvZero = G(Gs); tr(tvZero, 1000, 256); chip(tvZero, 'resultant 0 N', { size: 28, fill: 'rgba(10,27,39,0.75)', stroke: C.energy, color: C.energy });
  const tvTitle = T(Gs, 600, 706, 'terminal velocity', { size: 52, weight: 700, anchor: 'middle', fill: C.energy });
  // the speed rises fast at first, then levels off as the drag catches up with the weight
  const tF0 = at('skydiver') + 0.5, tF1 = mid('terminal', 0.46), NPOW = 1.5;
  const vRel = t => { const u = clamp((t - tF0) / (tF1 - tF0)); return 1 - Math.pow(1 - u, NPOW); };
  const fallDist = t => { const u = (t - tF0) / (tF1 - tF0); if (u <= 0) return 0; if (u <= 1) return u - (1 - Math.pow(1 - u, NPOW + 1)) / (NPOW + 1); return u - 1 / (NPOW + 1); };

  /* ================= update ================= */
  return t => {
    const tA1 = mid('still', 0.47), tA2e = at('cruise') - 0.1, tB0 = at('cruise') - 0.2, tB1 = at('unbalanced') - 0.1;
    const tC0 = at('unbalanced') - 0.2, tC1 = at('speeds') - 0.1, tD0 = at('speeds') - 0.2, tD1 = at('add') - 0.1;
    const tE0 = at('add') - 0.2, tE1 = at('example') + 0.15, tF0_ = at('example') + 0.05, tF1_ = at('skydiver') - 0.1, tG0 = at('skydiver') - 0.2;
    const aA = 1 - P(t, tA1, 0.5, linear), aA2 = beat(t, tA1 - 0.2, tA2e + 0.4), aB = beat(t, tB0, tB1 + 0.4), aC = beat(t, tC0, tC1 + 0.4);
    const aD = beat(t, tD0, tD1 + 0.4), aE = beat(t, tE0, tE1 + 0.4), aF = beat(t, tF0_, tF1_ + 0.4), aG = P(t, tG0, 0.5, linear);
    op(A, aA); op(A2, aA2); op(B, aB); op(Cu, aC); op(D, aD); op(Ea, aE); op(Fx, aF); op(Gs, aG);
    op(ground, Math.max(aA, aA2, aC, aF));
    op(scaleBar, Math.max(win(t, at('balanced') + 0.2, tA2e, 0.4) * Math.max(aA, aA2), aE * P(t, mid('add', 0.3), 0.4, linear), aF));

    /* --- A --- */
    if (aA > 0) {
      const fourOut = 1 - P(t, at('balanced') - 0.1, 0.5, linear);
      [[pushA, 0.04], [fricA, 0.14], [wtA, 0.24], [nrA, 0.32]].forEach(([a, f]) => { a.set(P(t, mid('many', f), 0.5)); op(a, fourOut); });
      // add them up: the sideways pair rises to the sum row and joins head to tail
      const rise = P(t, mid('many', 0.64), 0.9), dock = P(t, mid('many', 0.78), 0.7);
      sumPush.move(lerp(350, 430, rise), lerp(490, SY, rise)); sumPush.set(1); op(sumPush, rise > 0 ? fourOut * (1 - 0.5 * P(t, mid('resultant', 0.8), 0.4, linear)) : 0);
      sumFric.move(lerp(510, 430 + 40 * SC, Math.max(rise * 0.4, dock)), lerp(560, SY - 20, rise)); sumFric.set(1); op(sumFric, rise > 0 ? fourOut * (1 - 0.5 * P(t, mid('resultant', 0.8), 0.4, linear)) : 0);
      // up and down cancel
      const dimV = P(t, mid('many', 0.86), 0.5, linear);
      op(wtA, fourOut * (1 - 0.6 * dimV)); op(nrA, fourOut * (1 - 0.6 * dimV));
      op(cancelV, win(t, mid('many', 0.88), at('balanced') - 0.1, 0.4));
      resA.set(P(t, at('resultant') + 0.2, 0.7)); op(resA, fourOut);
      // balanced: 20 N each way, cancelling to 0 N
      const bIn = P(t, mid('balanced', 0.04), 0.6);
      balL.set(bIn); balR.set(bIn);
      op(eqTxt, win(t, mid('balanced', 0.2), mid('balanced', 0.56), 0.35));
      const sIn = P(t, mid('balanced', 0.56), 0.8), out = P(t, mid('balanced', 0.74), 0.4, linear);
      sumL.move(lerp(430, 560, sIn), lerp(490, SY - 10, sIn)); sumL.set(1); op(sumL, sIn > 0 ? 1 - out : 0);
      sumR.move(lerp(770, 560 + 20 * SC, sIn), lerp(490, SY - 28, sIn)); sumR.set(1); op(sumR, sIn > 0 ? 1 - out : 0);
      const zp = P(t, mid('balanced', 0.78), 0.5, pop); op(zeroA, clamp(zp * 2)); tr(zeroA, 600, SY - 18, 0.8 + 0.2 * zp);
      const sb = P(t, mid('still', 0.24), 0.5, pop); op(stillBadge, clamp(sb * 2)); tr(stillBadge, 940, 490, 0.8 + 0.2 * sb);

    }

    /* --- A2: a moving crate, balanced forces, a steady speed --- */
    if (aA2 > 0) {
      const x = X2 + V2 * Math.max(0, t - (T2 - 0.6));
      cr2.at(x, 560);
      push2.move(x - 90, 490); push2.set(1); fric2.move(x - 90, 560); fric2.set(1);
      ticks2.forEach((g, k) => { const tk = T2 - 0.6 + (k + 1), xk = X2 + V2 * (k + 1); tr(g, xk, 0); op(g, P(t, tk, 0.25, linear)); });
      gauge2.set(0.5); op(steady2, P(t, mid('still', 0.66), 0.4, linear));
      op(zero2, P(t, mid('still', 0.55), 0.4, linear));
      op(line2, P(t, mid('still', 0.8), 0.4, linear));
    }

    /* --- B: the cruising car --- */
    if (aB > 0) {
      const d = (t - tB0) * 330 * calm;
      car.roll(d); attr(lane, 'stroke-dashoffset', d % 100);
      postEls.forEach((p, k) => tr(p, 1260 - ((d * 0.9 + k * 340) % 1360), 560));
      gaugeB.set(0.62);
      const np = P(t, mid('cruise', 0.04), 0.5, pop); op(noNeed, clamp(np * 2)); tr(noNeed, 540, 186, 0.85 + 0.15 * np);
      op(onlyChange, P(t, mid('cruise', 0.34), 0.5, linear));
      drive.set(P(t, mid('cruise', 0.55), 0.6)); dragB.set(P(t, mid('cruise', 0.74), 0.6));
      const zp = P(t, mid('cruise', 0.86), 0.5, pop); op(zeroB, clamp(zp * 2)); tr(zeroB, 560, 378, 0.85 + 0.15 * zp);
    }

    /* --- C: unbalanced --- */
    if (aC > 0) {
      const tGo = mid('unbalanced', 0.76), dt = Math.max(0, t - tGo), x = XC + 0.5 * 120 * dt * dt;
      crC.at(x, 560);
      pushC.move(x - 90, 490); pushC.set(P(t, mid('unbalanced', 0.02), 0.5));
      fricC.move(x - 90, 560); fricC.set(P(t, mid('unbalanced', 0.1), 0.5));
      op(noCancel, P(t, mid('unbalanced', 0.2), 0.4, linear));
      resC.move(x - 40, 372); resC.set(P(t, mid('unbalanced', 0.45), 0.6));
      gaugeC.set(clamp(dt * 0.35));
    }

    /* --- D: three ways a resultant changes the motion --- */
    if (aD > 0) {
      const starts = [mid('speeds', 0.03), mid('speeds', 0.44), mid('speeds', 0.79)], dur = [2.8, 2.6, 2.3];
      panels.forEach((p, i) => {
        const pp = P(t, starts[i] - 0.25, 0.5, pop);
        op(p.g, clamp(pp * 2)); tr(p.g, p.x, PY + (1 - clamp(pp)) * 18, 0.9 + 0.1 * pp);
        op(p.name, P(t, starts[i] + [1.4, 1.4, 0.6][i], 0.4, linear));
      });
      [pd1, pd2].forEach((pd, i) => {
        const u = P(t, starts[i] + 0.2, dur[i], linear), x = pd.xs(u);
        pd.cr.at(x, 76);
        pd.rs.move(x, 40); pd.rs.set(P(t, starts[i], 0.4));
        pd.gh.forEach((g, k) => { const uk = k / 4; attr(g, 'cx', pd.xs(uk)); attr(g, 'cy', 96); op(g, u >= uk - 0.001 ? 1 : 0); });
        pd.gg.set(pd.decel ? 1 - u : u);
      });
      {
        const u = P(t, starts[2] + 0.2, dur[2], linear), q = P3(u);
        tr(ball3, q[0], q[1]); rs3.move(q[0], q[1]); rs3.set(P(t, starts[2], 0.4));
        let d = ''; for (let k = 0; k <= 24; k++) { const w_ = P3(u * k / 24); d += (k ? ' L' : 'M') + w_[0].toFixed(1) + ',' + w_[1].toFixed(1); }
        path3.setAttribute('d', d); op(path3, u > 0.01 ? 1 : 0);
        dots3.forEach((c, k) => { const w_ = P3(k / 4); attr(c, 'cx', w_[0]); attr(c, 'cy', w_[1]); op(c, u >= k / 4 + 0.001 && k < 4 ? 0.6 : 0); });
      }
    }

    /* --- E: add and subtract along a line --- */
    if (aE > 0) {
      op(nl1, P(t, mid('add', 0.06), 0.5, linear)); op(nl2, P(t, mid('add', 0.12), 0.5, linear));
      op(h1, P(t, mid('add', 0.33), 0.4, linear)); op(h2, P(t, mid('add', 0.64), 0.4, linear));
      a1.set(P(t, mid('add', 0.34), 0.5));
      const j1 = P(t, mid('add', 0.44), 0.7);
      b1.move(lerp(NX + 80 * SC + 50, NX + 80 * SC, j1), R1); b1.set(P(t, mid('add', 0.38), 0.5));
      r1.set(P(t, mid('add', 0.53), 0.6)); s1.forEach((el, k) => op(el, P(t, mid('add', 0.56) + k * 0.12, 0.3, linear)));
      a2.set(P(t, mid('add', 0.62), 0.5));
      const j2 = P(t, mid('add', 0.7), 0.7);
      b2.move(lerp(NX + 80 * SC + 50 + 40 * SC, NX + 80 * SC, j2), lerp(R2, R2 + 30, j2)); b2.set(P(t, mid('add', 0.65), 0.5));
      op(band2, P(t, mid('add', 0.78), 0.4, linear));
      r2.set(P(t, mid('add', 0.8), 0.6)); s2.forEach((el, k) => op(el, P(t, mid('add', 0.82) + k * 0.1, 0.3, linear)));
    }

    /* --- F: 30 N - 12 N = 18 N, and the box speeds up --- */
    if (aF > 0) {
      const tGo = mid('example', 0.86), dt = Math.max(0, t - tGo), x = XF + 0.5 * 18 * SC * 1.6 * dt * dt;
      crF.at(x, 560);
      pushF.move(x - 90, 490); pushF.set(P(t, mid('example', 0.04), 0.5));
      fricF.move(x - 90, 560); fricF.set(P(t, mid('example', 0.18), 0.5));
      sumPF.set(P(t, mid('example', 0.38), 0.5)); sumFF.set(P(t, mid('example', 0.46), 0.5));
      resF.set(P(t, mid('example', 0.6), 0.6));
      [0.08, 0.38, 0.44, 0.58, 0.62].forEach((f, k) => op(fWords[k], P(t, mid('example', f), 0.35, linear)));
      op(fwd, P(t, mid('example', 0.8), 0.4, linear));
      gaugeF.set(clamp(dt * 0.4)); op(gaugeF, P(t, mid('example', 0.84), 0.4, linear));
    }

    /* --- G: the skydiver --- */
    if (aG > 0) {
      const v = vRel(t), dist = fallDist(t) * (tF1 - tF0) * 300 * calm;
      clouds.forEach(c => { const y = ((c.y - dist) % 900 + 900) % 900 - 75; attr(c.el, 'cx', c.x); attr(c.el, 'cy', y); });
      wtG.set(P(t, mid('skydiver', 0.1), 0.6));
      drG.set(1, WN * v * v); op(drG, v > 0.05 ? 1 : 0);
      gaugeG.set(0.85 * v);
      op(sdA, win(t, mid('skydiver', 0.5), at('terminal') + 0.2, 0.35)); op(sdB, win(t, mid('skydiver', 0.82), at('terminal') + 0.2, 0.35));
      op(ghostD, P(t, at('terminal') + 0.1, 0.5, linear) * (1 - P(t, tF1 + 0.6, 0.6, linear)));
      const tv = P(t, mid('terminal', 0.4), 0.5, pop); op(tvA, clamp(tv * 2)); tr(tvA, 230, 300, 0.85 + 0.15 * tv);
      op(tvB, P(t, mid('terminal', 0.58), 0.4, linear));
      op(tvZero, P(t, mid('terminal', 0.5), 0.4, linear));
      const tt = P(t, mid('terminal', 0.8), 0.6, pop); op(tvTitle, clamp(tt * 2)); tvTitle.setAttribute('transform', `translate(600 690) scale(${(0.8 + 0.2 * tt).toFixed(3)}) translate(-600 -690)`);
    }
  };
});
