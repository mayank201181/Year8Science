/* Friction and drag. A crate slides and slows: friction at the floor, against the motion -> a zoom bubble:
   rough surfaces whose bumps catch -> drag on a cyclist grows with speed and with area; water resistance on a
   swimmer -> friction is useful: walking, tyres, brakes -> a parachute's huge area -> a nuisance: gears heat up
   and wear, drag slows cars and cyclists -> reduce it: oil, rollers, streamlining -> increase it: treads and
   studs -> the feather on Earth: big area, tiny weight -> showpiece: on the Moon there is no drag, and the
   hammer and feather land together -> without air resistance, everything falls at the same rate. */
scene('friction', S => {
  const { at, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;
  /* No numbers appear in this chapter, so arrows carry names only. One scale (1 px per unit) throughout. */
  const fa = (parent, kind, x, y, n, dir, o) => fmArrow(parent, kind, x, y, n, dir, Object.assign({ scale: 1, value: false }, o));

  /* ---------- helpers ---------- */
  let nClip = 0;
  const clipUrl = d => { const id = 'fricclip' + (++nClip), cp = E('clipPath', { id }, defs()); E('path', { d }, cp); return `url(#${id})`; };
  const disc = (cx, cy, r) => `M${cx - r},${cy} A${r},${r} 0 1 0 ${cx + r},${cy} A${r},${r} 0 1 0 ${cx - r},${cy} Z`;
  const popIn = (el, p, x, y, fade) => { op(el, clamp(p * 2) * (fade === undefined ? 1 : fade)); tr(el, x, y, Math.max(0.01, p)); };
  const beat = (t, a, b) => win(t, a, b, 0.4);
  const scaleAbout = (el, cx, cy, k) => el.setAttribute('transform', `translate(${cx} ${cy}) scale(${Math.max(0.01, k).toFixed(3)}) translate(${-cx} ${-cy})`);
  function rich(parent, x, y, segs, o) {
    o = o || {};
    const t = E('text', { x, y, 'font-size': o.size || 30, 'font-weight': o.weight || 600, 'font-family': FD, 'text-anchor': o.anchor || 'middle', fill: o.fill || C.ink }, parent);
    segs.forEach(s => { if (typeof s === 'string') s = [s]; E('tspan', { fill: s[1], 'font-weight': s[2] }, t).textContent = s[0]; });
    return t;
  }
  const title = (parent, segs) => rich(parent, 600, 150, segs, { size: 44, weight: 600 });
  /* an arrow drawn over art: a dark outline round its head keeps it clear */
  function outlined(a) {
    const hd = a.childNodes[1]; hd.setAttribute('stroke', '#140C03'); hd.setAttribute('stroke-width', 4); hd.setAttribute('paint-order', 'stroke');
    return a;
  }
  /* a dashed "motion" arrow (not a force): white, thin, dashed */
  function motionArrow(parent, len, text) {
    const g = G(parent);
    E('line', { x1: 0, y1: 0, x2: len - 14, y2: 0, stroke: C.ink, 'stroke-width': 4, 'stroke-dasharray': '10 8', 'stroke-linecap': 'round' }, g);
    E('path', { d: `M${len},0 L${len - 18},-11 L${len - 14},0 L${len - 18},11 Z`, fill: C.ink }, g);
    if (text) T(g, len / 2, -16, text, { size: 26, weight: 600, anchor: 'middle' });
    return g;
  }
  function gear(parent, r, n) {
    const g = G(parent), dep = r * 0.2, da = TAU / n, pts = [];
    for (let i = 0; i < n; i++) {
      const a = i * da;
      [[-0.27, r - dep / 2], [-0.15, r + dep / 2], [0.15, r + dep / 2], [0.27, r - dep / 2]].forEach(([f, rr]) => pts.push([Math.cos(a + f * da) * rr, Math.sin(a + f * da) * rr]));
    }
    E('path', { d: 'M' + pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' L') + 'Z', fill: linGrad('#DCE6EE', '#7D8C99', true), stroke: '#4E5A64', 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
    for (let k = 0; k < 4; k++) { const a = k * TAU / 4 + 0.4; E('circle', { cx: Math.cos(a) * r * 0.5, cy: Math.sin(a) * r * 0.5, r: r * 0.17, fill: '#14303F', stroke: '#4E5A64', 'stroke-width': 2 }, g); }
    E('circle', { r: r * 0.18, fill: '#9AA8B4', stroke: '#4E5A64', 'stroke-width': 3 }, g);
    return g;
  }
  function dust(parent) {
    return E('path', { d: [[-1, -0.35], [-1, -0.9], [1, -0.35], [1, -0.9]].map(([sx, sy]) => `M${sx * 14},${sy * 10} L${sx * 38},${sy * 28}`).join(' '), stroke: '#D9E2E8', 'stroke-width': 4, 'stroke-linecap': 'round', fill: 'none' }, parent);
  }
  /* the ground exactly as fmFloor draws it (a line, hatched underneath), in two elements */
  function floorLine(parent, x1, x2, y) {
    const g = G(parent), col = '#8FA3B3';
    E('line', { x1, x2, y1: y, y2: y, stroke: col, 'stroke-width': 5, 'stroke-linecap': 'round' }, g);
    let d = ''; for (let x = x1 + 18; x < x2 - 4; x += 28) d += `M${x},${y + 5} L${x - 16},${y + 23} `;
    E('path', { d, fill: 'none', stroke: col, 'stroke-width': 3, opacity: 0.5, 'stroke-linecap': 'round' }, g);
    return g;
  }
  /* pedal an fmCyclist with any torso lean (fmCyclist fixes its lean when built): the same crank, pedal and
     reach geometry as its g.roll, so the feet stay on the pedals and the hands on the bars */
  function ride(bike, dist, lean) {
    bike.roll(dist);
    const rider = bike._rider || (bike._rider = Array.from(bike.childNodes).find(n => typeof n.pose === 'function'));
    const r = 36, bb = [0, -34], hip = [-20, -106], bar = [50, -108], crank = 15, Lr = lean * Math.PI / 180, th = dist / r / 2.2;
    const pF = [bb[0] + crank * Math.cos(th), bb[1] + crank * Math.sin(th)], pB = [bb[0] - crank * Math.cos(th), bb[1] - crank * Math.sin(th)];
    const toBody = v => [v[0] * Math.cos(Lr) + v[1] * Math.sin(Lr), -v[0] * Math.sin(Lr) + v[1] * Math.cos(Lr)];
    const sh = [hip[0] + 54 * Math.sin(Lr), hip[1] - 54 * Math.cos(Lr)], arm = _fmReach(toBody([bar[0] + 2 - sh[0], bar[1] - sh[1]]), 33, 31, true);
    rider.pose({ lean, legR: _fmReach(toBody([pF[0] - hip[0], pF[1] - 4 - hip[1]]), 45, 45), legL: _fmReach(toBody([pB[0] - hip[0], pB[1] - 4 - hip[1]]), 45, 45), armR: arm, armL: [arm[0] - 6, arm[1]] });
  }

  /* ================= 1. the crate slides and slows; 2. zoom on the bumps ================= */
  const B1 = G(root);
  const FY = 560, CW = 170, CH = 136;
  floorLine(B1, 40, 1160, FY);
  const streaks = [0.28, 0.52, 0.76].map(() => E('line', { stroke: C.ink, 'stroke-width': 4, 'stroke-linecap': 'round' }, B1));
  const crate = fmCrate(B1, CW, CH);
  const strip = E('rect', { height: 18, rx: 9, fill: 'rgba(255,228,92,0.35)', stroke: C.energy, 'stroke-width': 3 }, B1);
  const touch = G(B1);
  E('line', { x1: 0, y1: 12, x2: 0, y2: 52, stroke: C.energy, 'stroke-width': 3 }, touch);
  T(touch, 0, 90, 'two touching surfaces', { size: 30, weight: 700, anchor: 'middle', fill: C.energy });
  const fric = fa(B1, 'friction', 0, 0, 120, 'left', {});
  const motion = motionArrow(B1, 120, 'motion');
  const oppLbl = rich(B1, 0, 650, [['friction', C.oxygen, 800], ' acts against the motion'], { size: 30, weight: 600 });
  const speedG = G(B1); tr(speedG, 880, 196);
  const speedM = meter(speedG, { w: 240, h: 26, color: C.energy, label: 'speed', labelSize: 26 });
  const slowLbl = T(B1, 560, 170, 'so it slows things down', { size: 38, weight: 700, anchor: 'middle' });
  const X0 = 150, X1 = 820, tIn = at('friction') - 0.3, tStop = mid('friction', 0.84), TS = tStop - tIn;
  const crateX = t => X0 + (X1 - X0) * (1 - Math.pow(1 - clamp((t - tIn) / TS), 2));    // steady slowing
  const crateV = t => 1 - clamp((t - tIn) / TS);

  const B2 = G(root);
  const BC = [420, 316], BR = 190, CP = [778, FY];
  const conn = G(B2);
  E('circle', { cx: CP[0], cy: CP[1], r: 22, fill: 'none', stroke: '#C9D6DF', 'stroke-width': 3 }, conn);
  E('line', { x1: CP[0] - 14, y1: CP[1] - 17, x2: BC[0] + BR * 0.5, y2: BC[1] - BR * 0.87, stroke: '#C9D6DF', 'stroke-width': 2.5, opacity: 0.7 }, conn);
  E('line', { x1: CP[0] - 8, y1: CP[1] + 20, x2: BC[0] + BR * 0.71, y2: BC[1] + BR * 0.71, stroke: '#C9D6DF', 'stroke-width': 2.5, opacity: 0.7 }, conn);
  const bub = G(B2);
  E('circle', { cx: BC[0], cy: BC[1], r: BR + 9, fill: '#C9D6DF' }, bub);
  const zin = G(bub); zin.setAttribute('clip-path', clipUrl(disc(BC[0], BC[1], BR)));
  E('rect', { x: BC[0] - BR, y: BC[1] - BR, width: 2 * BR, height: 2 * BR, fill: '#0F2C3A' }, zin);
  const rr = rng(23), fl = [], wd = [];
  for (let x = BC[0] - BR - 30; x <= BC[0] + BR + 40; x += 17) { fl.push([x, BC[1] + 24 - rr() * 26]); wd.push([x + 8, BC[1] + 4 + rr() * 26]); }
  E('path', { d: `M${fl[0][0]},${BC[1] + BR + 10} L` + fl.map(p => p[0] + ',' + p[1].toFixed(1)).join(' L') + ` L${fl[fl.length - 1][0]},${BC[1] + BR + 10} Z`, fill: linGrad('#9DB0BF', '#4E5E6B', true), stroke: '#DCE6EE', 'stroke-width': 3, 'stroke-linejoin': 'round' }, zin);
  const wood = G(zin);
  E('path', { d: `M${wd[0][0]},${BC[1] - BR - 10} L` + wd.map(p => p[0] + ',' + p[1].toFixed(1)).join(' L') + ` L${wd[wd.length - 1][0]},${BC[1] - BR - 10} Z`, fill: linGrad(FM.wood[2], FM.wood[0], true), stroke: FM.wood[1], 'stroke-width': 3, 'stroke-linejoin': 'round' }, wood);
  E('path', { d: [0, 1, 2, 3].map(k => `M${BC[0] - BR},${BC[1] - 150 + k * 34} q120,${k % 2 ? 14 : -12} 240,0 t240,0`).join(' '), fill: 'none', stroke: FM.wood[1], 'stroke-width': 3, opacity: 0.35 }, wood);
  T(zin, BC[0], BC[1] - 92, 'crate', { size: 30, weight: 700, anchor: 'middle', fill: '#4A2E12' });
  T(zin, BC[0], BC[1] + 140, 'floor', { size: 30, weight: 700, anchor: 'middle', fill: '#1B2730' });
  const catches = [-120, -40, 52, 126].map(dx => { const g = G(zin); E('circle', { r: 20, fill: glow(C.oxygen) }, g); E('circle', { r: 6, fill: C.oxygen }, g); tr(g, BC[0] + dx, BC[1] + 17); return g; });
  const roughLbl = G(B2);
  rich(roughLbl, 860, 236, ['smooth-looking, but ', ['rough', C.energy, 800]], { size: 32 });
  T(roughLbl, 860, 276, 'up close', { size: 32, weight: 600, anchor: 'middle' });
  const catchLbl = rich(B2, BC[0], 646, ['tiny bumps ', ['catch', C.oxygen, 800], ' on each other'], { size: 32 });

  /* ================= 3. drag on a cyclist; water resistance ================= */
  const B3 = G(root);
  const ROAD = 640, CX = 560;
  E('rect', { x: 0, y: ROAD, width: W, height: H - ROAD, fill: '#22323D' }, B3);
  E('line', { x1: 0, y1: ROAD, x2: W, y2: ROAD, stroke: '#8FA3B3', 'stroke-width': 4 }, B3);
  const dashes = E('line', { x1: -160, x2: W + 160, y1: ROAD + 50, y2: ROAD + 50, stroke: '#C9D6DF', 'stroke-width': 8, 'stroke-linecap': 'round', 'stroke-dasharray': '72 88', opacity: 0.6 }, B3);
  const air = [430, 470, 520, 570, 610].map((y, k) => ({ el: E('line', { y1: y, y2: y, stroke: C.air, 'stroke-width': 3, 'stroke-linecap': 'round' }, B3), ph: k * 0.37 }));
  const drag3 = fa(B3, 'drag', CX - 96, ROAD - 120, 50, 'left', { label: 'air resistance' });
  const dChip = rich(B3, 600, 150, [['Drag', C.oxygen, 800], ': friction from a ', ['fluid', C.air, 800], ' (air or water)'], { size: 40, weight: 600 });
  const sp3G = G(B3); tr(sp3G, 70, 236);
  const sp3 = meter(sp3G, { w: 240, h: 26, color: C.energy, label: 'speed', labelSize: 26 });
  const fastLbl = rich(B3, 880, 440, ['faster: ', ['more drag', C.oxygen, 800]], { size: 30 });
  const areaLbl = rich(B3, 880, 440, ['sitting up: ', ['bigger area', C.oxygen, 800]], { size: 30 });
  const swim = G(B3);
  card(swim, 790, 214, 360, 170, { fill: C.card, stroke: C.line });
  const pool = G(swim); pool.setAttribute('clip-path', clipUrl('M792,216 L1148,216 L1148,382 L792,382 Z'));
  E('rect', { x: 790, y: 300, width: 360, height: 90, fill: 'rgba(76,201,240,0.45)' }, pool);
  const waveP = E('path', { fill: 'none', stroke: '#BFEFFF', 'stroke-width': 3 }, pool);
  const swimmer = G(pool);                                       // a small swimmer, front crawl, heading right
  E('path', { d: 'M-40,-2 L-80,4', stroke: '#C98E62', 'stroke-width': 9, 'stroke-linecap': 'round' }, swimmer);
  E('ellipse', { rx: 46, ry: 11, fill: '#E8424F' }, swimmer);
  E('circle', { cx: 58, cy: -5, r: 12, fill: '#C98E62' }, swimmer);
  const swArm = E('line', { x1: 0, y1: 0, x2: 50, y2: 0, stroke: '#C98E62', 'stroke-width': 8, 'stroke-linecap': 'round' }, swimmer);
  const drag3w = fa(swim, 'drag', 0, 0, 56, 'left', { label: 'water resistance', side: 'below', nudge: [84, 2] });

  /* ================= 4. friction is useful ================= */
  const B4 = G(root);
  title(B4, ['Friction can be ', ['useful', C.good, 800]]);
  const UX = [220, 600, 980];
  const useCards = UX.map(x => { const g = G(B4); card(g, x - 165, 210, 330, 380, { fill: C.card, stroke: C.line }); return g; });
  E('line', { x1: 95, y1: 470, x2: 345, y2: 470, stroke: '#8FA3B3', 'stroke-width': 5, 'stroke-linecap': 'round' }, useCards[0]);
  const footGlow = E('ellipse', { rx: 34, ry: 10, fill: glow(C.oxygen) }, useCards[0]);
  const walker = person(useCards[0], { shirt: '#5B8DEF' });
  E('line', { x1: 460, y1: 470, x2: 740, y2: 470, stroke: '#8FA3B3', 'stroke-width': 5, 'stroke-linecap': 'round' }, useCards[1]);
  const tyreGlow = E('ellipse', { cx: 600, cy: 468, rx: 46, ry: 10, fill: glow(C.oxygen) }, useCards[1]);
  const tyreSpin = G(useCards[1]);
  E('circle', { r: 86, fill: '#1C2329', stroke: '#3A4651', 'stroke-width': 4 }, tyreSpin);
  let td = ''; for (let k = 0; k < 20; k++) { const a = k * TAU / 20, a2 = a + 0.12; td += `M${(Math.cos(a) * 72).toFixed(1)},${(Math.sin(a) * 72).toFixed(1)} L${(Math.cos(a) * 86).toFixed(1)},${(Math.sin(a) * 86).toFixed(1)} L${(Math.cos(a2) * 86).toFixed(1)},${(Math.sin(a2) * 86).toFixed(1)} L${(Math.cos(a2) * 72).toFixed(1)},${(Math.sin(a2) * 72).toFixed(1)} Z `; }
  E('path', { d: td, fill: '#4A5560' }, tyreSpin);
  E('circle', { r: 44, fill: '#9AA8B4', stroke: '#5F6E7B', 'stroke-width': 3 }, tyreSpin);
  E('path', { d: [0, 1, 2, 3, 4].map(k => { const a = k * TAU / 5 - Math.PI / 2, x = Math.cos(a) * 24, y = Math.sin(a) * 24; return `M${(x - 6).toFixed(1)},${y.toFixed(1)} a6,6 0 1 0 12,0 a6,6 0 1 0 -12,0`; }).join(' '), fill: '#4E5A64' }, tyreSpin);
  const wheelSpin = G(useCards[2]);
  E('circle', { r: 92, fill: 'none', stroke: '#1C2329', 'stroke-width': 12 }, wheelSpin);
  E('circle', { r: 84, fill: 'none', stroke: '#9AA8B4', 'stroke-width': 5 }, wheelSpin);
  E('path', { d: [0, 1, 2, 3, 4, 5, 6, 7].map(k => { const a = k * Math.PI / 8; return `M${(Math.sin(a) * 82).toFixed(1)},${(-Math.cos(a) * 82).toFixed(1)} L${(-Math.sin(a) * 82).toFixed(1)},${(Math.cos(a) * 82).toFixed(1)}`; }).join(' '), stroke: '#8597A6', 'stroke-width': 2.5 }, wheelSpin);
  E('circle', { r: 9, fill: '#B9C6D2' }, wheelSpin);
  const brake = G(useCards[2]);                                   // a brake block pressed down onto the tyre
  E('path', { d: 'M0,-70 L0,-40', stroke: '#B9C6D2', 'stroke-width': 8, 'stroke-linecap': 'round' }, brake);
  E('rect', { x: -26, y: -40, width: 52, height: 22, rx: 5, fill: '#3A4651', stroke: '#B9C6D2', 'stroke-width': 2.5 }, brake);
  E('path', { d: 'M-40,-74 L40,-74', stroke: '#B9C6D2', 'stroke-width': 6, 'stroke-linecap': 'round' }, useCards[2]);
  const brakeGlow = E('ellipse', { cx: 980, cy: 288, rx: 34, ry: 12, fill: glow(C.oxygen) }, useCards[2]);
  const useLbls = [['walk without slipping', 0], ['tyres grip the road', 1], ['brakes work', 2]].map(([s, i]) => {
    const g = G(useCards[i]), x = UX[i];
    T(g, x + 16, 548, s, { size: 28, weight: 600, anchor: 'middle' });
    const tk = tick(g, 15); tr(tk, x - textWidth(s, 28, FD, 600) / 2 - 12, 540);
    return g;
  });

  /* ================= 5. the parachute ================= */
  const B5 = G(root);
  const clouds = [[180, 0.0, 120], [470, 0.37, 90], [860, 0.63, 140], [1060, 0.18, 100], [330, 0.82, 80]].map(([x, ph, w]) => ({ el: E('ellipse', { rx: w, ry: w * 0.3, fill: '#DDEBF3', opacity: 0.16 }, B5), x, ph }));
  const PJ = [600, 640], CYO = 330;                                // the parachutist's feet; the open canopy
  const canopy = G(B5);
  E('path', { d: 'M-190,0 C-190,-120 190,-120 190,0 Q166,18 142,0 Q118,18 95,0 Q71,18 47,0 Q24,18 0,0 Q-24,18 -47,0 Q-71,18 -95,0 Q-118,18 -142,0 Q-166,18 -190,0 Z', fill: '#F4A261', stroke: '#B8682A', 'stroke-width': 3 }, canopy);
  E('path', { d: 'M-95,0 C-90,-84 -40,-92 0,-92 C40,-92 90,-84 95,0 Q71,18 47,0 Q24,18 0,0 Q-24,18 -47,0 Q-71,18 -95,0 Z', fill: '#2A9D8F', stroke: '#1C6E64', 'stroke-width': 3 }, canopy);
  const cords = E('path', { fill: 'none', stroke: '#C9D6DF', 'stroke-width': 2 }, B5);
  const pack = E('rect', { x: -32, y: -152, width: 22, height: 44, rx: 6, fill: '#2A9D8F', stroke: '#1C6E64', 'stroke-width': 2 }, B5);
  const jumper = person(B5, { shirt: '#E8424F', shorts: '#2B3A55' }); tr(jumper, PJ[0], PJ[1]);
  const w5 = fa(B5, 'weight', PJ[0], PJ[1] - 100, 110, 'down', { side: 'right' });
  const dSmall = fa(B5, 'drag', PJ[0], PJ[1] - 200, 36, 'up', { side: 'right' });
  const dBig = fa(B5, 'drag', PJ[0], CYO - 104, 110, 'up', { side: 'right' });
  const sp5G = G(B5); tr(sp5G, 1030, 230);
  const sp5 = meter(sp5G, { w: 30, h: 260, vertical: true, color: C.energy, label: 'speed', labelSize: 26 });
  const chuteLbl = G(B5);
  T(chuteLbl, 220, 430, 'huge area', { size: 34, weight: 700, anchor: 'middle' });
  rich(chuteLbl, 220, 474, ['→ lots of ', ['drag', C.oxygen, 800]], { size: 34 });

  /* ================= 6, 7. a nuisance; reducing friction and drag ================= */
  const B6 = G(root);
  const t6 = title(B6, ['Friction can be a ', ['nuisance', C.bad, 800]]);
  const t7 = title(B6, [['Reduce', C.good, 800], ' friction and drag']);
  const GA = [250, 430], RA = 105, NA = 14, RB = 75, NB = 10, GBx = GA[0] + RA + RB, MESH = [GA[0] + RA, GA[1]];
  const gearA = gear(B6, RA, NA), gearB = gear(B6, RB, NB);
  const hotGlow = E('circle', { cx: MESH[0], cy: MESH[1], r: 46, fill: glow(C.heat) }, B6);
  const heat = heatWaves(B6, { n: 3, h: 86, spacing: 24 }); tr(heat, MESH[0], MESH[1] - 26);
  const flakes = [0, 1, 2, 3].map(() => E('rect', { width: 7, height: 5, rx: 1.5, fill: '#C9D6DF' }, B6));
  const heatLbl = rich(B6, 330, 622, ['wastes energy as ', ['heat', C.heat, 800]], { size: 30 });
  const wearLbl = T(B6, 330, 664, 'and wears parts out', { size: 30, weight: 600, anchor: 'middle' });
  const oilLbl = rich(B6, 330, 622, [['lubricant', C.good, 800], ': oil'], { size: 30 });
  const can = G(B6);
  E('path', { d: 'M-46,-30 L36,-30 L46,40 L-46,40 Z', fill: ball('#C9D6DF', '#6E7F8D'), stroke: '#4E5A64', 'stroke-width': 3, 'stroke-linejoin': 'round' }, can);
  E('path', { d: 'M36,-14 L120,-46 L124,-38 L44,4 Z', fill: '#9AA8B4', stroke: '#4E5A64', 'stroke-width': 3, 'stroke-linejoin': 'round' }, can);
  E('path', { d: 'M-34,-30 Q-30,-60 4,-58 L8,-30', fill: 'none', stroke: '#4E5A64', 'stroke-width': 7, 'stroke-linecap': 'round' }, can);
  E('rect', { x: -30, y: -6, width: 52, height: 26, rx: 5, fill: '#E9C46A' }, can);
  const drops = [0, 1, 2].map(() => E('path', { d: 'M0,-9 C5,-2 7,3 7,6 A7,7 0 0 1 -7,6 C-7,3 -5,-2 0,-9 Z', fill: '#E9C46A' }, B6));
  const vehicles = G(B6);
  E('line', { x1: 640, y1: 432, x2: 1160, y2: 432, stroke: '#8FA3B3', 'stroke-width': 4 }, vehicles);
  E('line', { x1: 640, y1: 652, x2: 1160, y2: 652, stroke: '#8FA3B3', 'stroke-width': 4 }, vehicles);
  const car6 = fmCar(vehicles); tr(car6, 920, 430, 0.8);
  const dCar = fa(vehicles, 'drag', 920 + 0.8 * car6.pt.back[0], 430 + 0.8 * car6.pt.back[1], 110, 'left', {});
  const dCyc = fa(vehicles, 'drag', 920 - 0.8 * 96, 650 - 0.8 * 120, 80, 'left', {});
  const vehLbl = rich(vehicles, 900, 268, [['drag', C.oxygen, 800], ' slows them down'], { size: 30 });
  const rollers = G(B6);
  E('line', { x1: 640, y1: 600, x2: 1160, y2: 600, stroke: '#8FA3B3', 'stroke-width': 5 }, rollers);
  const rolls = [-60, -20, 20, 60].map(rel => ({ g: E('path', { d: 'M-17,0 A17,17 0 1 0 17,0 A17,17 0 1 0 -17,0 Z M-11,0 L11,0', fill: ball('#C08A52', '#7A4E26'), stroke: '#5E3A1A', 'stroke-width': 2.5 }, rollers), rel }));
  const rCrate = fmCrate(rollers, 150, 110);
  const rollLbl = rich(rollers, 900, 300, [['rollers', C.good, 800], ' roll instead of sliding'], { size: 30 });

  const bike = fmCyclist(root);                                  // one cyclist for the drag and the nuisance beats

  /* streamlining: smooth airflow round a pointed car; swirls behind a boxy van */
  const B7 = G(root);
  title(B7, [['Streamlining', C.good, 800], ': air flows past easily']);
  const SLEEK = 'M-170,-12 C-170,-40 -150,-58 -110,-64 C-60,-104 20,-108 70,-82 C110,-64 150,-46 190,-24 C200,-18 196,-8 186,-6 L-160,-6 C-168,-6 -170,-8 -170,-12 Z';
  const BOXY = 'M-170,-8 L-170,-128 Q-170,-136 -162,-136 L150,-136 Q160,-136 160,-126 L160,-8 Q160,0 152,0 L-162,0 Q-170,0 -170,-8 Z';
  const VX = 560;
  const rows = [[350, SLEEK, 40, 'streamlined', 'smooth and pointed'], [606, BOXY, 150, 'boxy', 'big flat front']].map(([y, d, n, name, note], i) => {
    const g = G(B7), flow = G(g), body = G(g); tr(body, VX, y);
    E('path', { d, fill: linGrad(i ? '#B9C6D2' : '#E2EAF0', '#6E7F8D', true), stroke: '#4E5A64', 'stroke-width': 3, 'stroke-linejoin': 'round' }, body);
    if (!i) E('path', { d: 'M-70,-66 C-36,-92 20,-94 52,-76 L18,-64 Z', fill: '#0F2C3A', stroke: '#9FD8FF', 'stroke-width': 2 }, body);
    else E('rect', { x: 102, y: -118, width: 44, height: 46, rx: 5, fill: '#0F2C3A', stroke: '#9FD8FF', 'stroke-width': 2 }, body);
    [-110, 112].forEach(x => { E('circle', { cx: x, cy: i ? 4 : -2, r: 26, fill: '#1C2329', stroke: '#3A4651', 'stroke-width': 3 }, body); E('circle', { cx: x, cy: i ? 4 : -2, r: 11, fill: '#9AA8B4' }, body); });
    const dA = fa(g, 'drag', VX - 172, y - (i ? 68 : 30), n, 'left', {});
    const chp = chip(g, name, { size: 30, fill: i ? 'rgba(255,107,92,0.16)' : 'rgba(86,214,155,0.16)', stroke: i ? C.oxygen : C.good, color: i ? C.oxygen : C.good, sw: 2.5 }); tr(chp, 1040, y - 82);
    T(g, 1040, y - 30, note, { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
    return { g, flow, y, dA };
  });
  /* in the car's frame the air streams right to left */
  const flowLine = (parent, pts) => E('path', { d: openPath(pts), fill: 'none', stroke: C.air, 'stroke-width': 3, 'stroke-dasharray': '26 16', 'stroke-linecap': 'round', opacity: 0.8 }, parent);
  const sleekY = rows[0].y, boxY = rows[1].y, flows = [];
  [[-128, -18], [-94, -34], [34, 10]].forEach(([off, lift]) => {
    const pts = []; for (let x = 900; x >= 170; x -= 20) { const u = (x - (VX + 13)) / 200, b = Math.abs(u) < 1 ? Math.pow(Math.cos(u * Math.PI / 2), 2) : 0; pts.push([x, sleekY + off + lift * b]); }
    flows.push(flowLine(rows[0].flow, pts));
  });
  [[-170, -12, 300], [-104, 0, 400], [44, 8, 300]].forEach(([off, lift, xEnd], k) => {
    const pts = []; for (let x = 900; x >= xEnd; x -= 20) {
      let y = boxY + off;
      if (k === 1) y = x > 760 ? boxY + off : x > 720 ? lerp(boxY + off, boxY - 152, (760 - x) / 40) : boxY - 152;   // hits the flat front, forced over the top
      else y += lift * clamp((900 - x) / 160);
      pts.push([x, y]);
    }
    flows.push(flowLine(rows[1].flow, pts));
  });
  const swirls = [[350, 506, 30], [318, 566, 24], [360, 614, 20], [292, 520, 18]].map(([x, y, r]) => ({
    g: E('path', { d: `M${r},0 A${r},${r} 0 1 1 ${-r * 0.2},${-r * 0.98} A${r * 0.7},${r * 0.7} 0 1 1 ${r * 0.1},${r * 0.6}`, fill: 'none', stroke: C.air, 'stroke-width': 3, opacity: 0.85, 'stroke-linecap': 'round' }, rows[1].flow), x, y }));

  /* ================= 8. increase friction: treads and studs ================= */
  const B8 = G(root);
  title(B8, [['Increase', C.oxygen, 800], ' friction: rougher surfaces']);
  const tread = G(B8);
  card(tread, 80, 200, 500, 400, { fill: C.card, stroke: C.line });
  const tcl = G(tread); tcl.setAttribute('clip-path', clipUrl('M82,202 L578,202 L578,598 L82,598 Z'));
  E('rect', { x: 82, y: 470, width: 496, height: 130, fill: '#3A4651' }, tcl);
  E('line', { x1: 82, y1: 470, x2: 578, y2: 470, stroke: '#8FA3B3', 'stroke-width': 4 }, tcl);
  const tyreBig = G(tcl);
  E('circle', { r: 270, fill: '#1C2329', stroke: '#3A4651', 'stroke-width': 4 }, tyreBig);
  let td8 = ''; for (let k = 0; k < 44; k++) { const a = k * TAU / 44, a2 = a + TAU / 88; td8 += `M${(Math.cos(a) * 234).toFixed(1)},${(Math.sin(a) * 234).toFixed(1)} L${(Math.cos(a) * 272).toFixed(1)},${(Math.sin(a) * 272).toFixed(1)} L${(Math.cos(a2) * 272).toFixed(1)},${(Math.sin(a2) * 272).toFixed(1)} L${(Math.cos(a2) * 234).toFixed(1)},${(Math.sin(a2) * 234).toFixed(1)} Z `; }
  E('path', { d: td8, fill: '#566270' }, tyreBig);
  E('circle', { r: 150, fill: '#9AA8B4', stroke: '#5F6E7B', 'stroke-width': 4 }, tyreBig);
  const gripT = E('ellipse', { cx: 330, cy: 468, rx: 80, ry: 12, fill: glow(C.oxygen) }, tread);
  T(tread, 330, 562, 'treads on tyres', { size: 30, weight: 700, anchor: 'middle' });
  const boot = G(B8);
  card(boot, 620, 200, 500, 400, { fill: C.card, stroke: C.line });
  const tcl2 = G(boot); tcl2.setAttribute('clip-path', clipUrl('M622,202 L1118,202 L1118,598 L622,598 Z'));
  E('rect', { x: 622, y: 470, width: 496, height: 130, fill: linGrad('#3E8A4E', '#22512C', true) }, tcl2);
  let gd = ''; const gr = rng(31); for (let x = 630; x < 1112; x += 9) { const h = 10 + gr() * 18, lean = (gr() - 0.5) * 8; gd += `M${x},476 L${(x + lean).toFixed(1)},${(476 - h).toFixed(1)} `; }
  E('path', { d: gd, fill: 'none', stroke: '#78C27C', 'stroke-width': 3, 'stroke-linecap': 'round' }, tcl2);
  const shoe = G(tcl2);
  E('path', { d: 'M-150,-20 C-150,-60 -120,-96 -70,-100 L-30,-160 L40,-160 L50,-96 C90,-90 150,-70 160,-30 C164,-12 152,0 130,0 L-130,0 C-146,0 -150,-8 -150,-20 Z', fill: ball('#3A4F75', '#111A2A'), stroke: '#8FB6E8', 'stroke-width': 3, 'stroke-linejoin': 'round' }, shoe);
  E('path', { d: 'M-60,-96 L40,-62 M-50,-118 L44,-84', stroke: '#F2F7FA', 'stroke-width': 5, 'stroke-linecap': 'round' }, shoe);
  E('rect', { x: -152, y: -6, width: 314, height: 12, rx: 6, fill: '#E9EEF2' }, shoe);
  [-118, -70, -22, 62, 110].forEach(x => E('path', { d: `M${x - 13},6 L${x + 13},6 L${x + 7},40 L${x - 7},40 Z`, fill: '#E9EEF2', stroke: '#9AA8B4', 'stroke-width': 2 }, shoe));
  E('rect', { x: 622, y: 477, width: 496, height: 123, fill: linGrad('#3E8A4E', '#22512C', true) }, tcl2);    // turf in front: the studs dig in
  const gripB = E('ellipse', { cx: 860, cy: 482, rx: 150, ry: 12, fill: glow(C.oxygen) }, boot);
  T(boot, 870, 562, 'studs on football boots', { size: 30, weight: 700, anchor: 'middle' });

  /* ================= 9, 10. the feather on Earth; the hammer and feather on the Moon ================= */
  const SKY = G(root); fmSky(SKY, { ground: 590 });
  const MOON = G(root); fmMoon(MOON, { ground: 590, earthX: 1090, earthY: 268, earthR: 38, stars: 70, seed: 11 });
  {  // the intro's Moon exactly (its 70 stars and its craters); the stars are merged into four paths to save elements
    const mg = MOON.firstChild, stars = Array.from(mg.querySelectorAll('circle')).slice(0, 70), bins = [[], [], [], []];
    stars.forEach(c => bins[Math.min(3, Math.floor((+c.getAttribute('opacity') - 0.3) / 0.15))].push(c));
    bins.forEach((b, i) => {
      if (!b.length) return;
      const d = b.map(c => { const x = +c.getAttribute('cx'), y = +c.getAttribute('cy'), r = +c.getAttribute('r'); return `M${(x - r).toFixed(1)},${y} a${r},${r} 0 1 0 ${(2 * r).toFixed(2)},0 a${r},${r} 0 1 0 ${(-2 * r).toFixed(2)},0`; }).join(' ');
      mg.insertBefore(E('path', { d, fill: '#FFFFFF', opacity: (0.375 + 0.15 * i).toFixed(3) }), stars[0]);
    });
    stars.forEach(c => c.remove());
  }
  const B9 = G(root);
  const HS = 0.7, HX9 = 420, FX9 = 790, Y9 = 300, GND9 = 640;
  const ham9 = fmHammer(B9, HS), fea9 = fmFeather(B9, HS);
  const w9h = fa(B9, 'weight', 0, 0, 216, 'down', { side: 'right' });
  const d9h = fa(B9, 'drag', 0, 0, 6, 'up', { label: 'tiny drag', side: 'right', nudge: [0, -6] });
  const area9 = E('ellipse', { rx: 76, ry: 30, fill: 'rgba(255,255,255,0.10)', stroke: C.ink, 'stroke-width': 2.5, 'stroke-dasharray': '7 6' }, B9);
  const w9f = outlined(fa(B9, 'weight', 0, 0, 60, 'down', { label: 'tiny weight', side: 'right' }));
  const d9f = outlined(fa(B9, 'drag', 0, 0, 54, 'up', { side: 'right' }));
  const areaLbl9 = T(B9, 0, 0, 'big area', { size: 28, weight: 700, anchor: 'end' });
  const pause9 = G(B9); tr(pause9, 600, 140);
  const pw = textWidth('paused mid-fall', 28, FD, 700) + 86;
  E('rect', { x: -pw / 2, y: -25, width: pw, height: 50, rx: 25, fill: 'rgba(10,27,39,0.75)', stroke: C.line, 'stroke-width': 2 }, pause9);
  E('path', { d: `M${-pw / 2 + 26},-11 l0,22 M${-pw / 2 + 38},-11 l0,22`, stroke: C.ink, 'stroke-width': 7, 'stroke-linecap': 'round' }, pause9);
  T(pause9, 22, 10, 'paused mid-fall', { size: 28, weight: 700, anchor: 'middle' });
  const hold9 = rich(B9, 600, 150, [['drag', C.oxygen, 800], ' holds the feather back'], { size: 36, weight: 600 });

  const B10 = G(root);
  const FEET = 662, PX = 600, PS = 1.6, A120 = 120 * Math.PI / 180;
  const HX = 66 * Math.sin(A120) * PS, HY = FEET + (-146 + 66 * Math.cos(A120)) * PS;
  const HAM_UP = 38 * HS, HAM_DN = 80 * HS, FEA_DN = 92 * HS, FEA_UP = FEA_DN - (HAM_DN - HAM_UP);
  const BOT0 = HY - HAM_UP + HAM_DN, DROP = FEET - BOT0, TM = 0.85 * 2.5;
  const level = E('line', { stroke: C.energyLt, 'stroke-width': 3, 'stroke-dasharray': '10 8', opacity: 0.85 }, B10);
  const ham10 = fmHammer(B10, HS), fea10 = fmFeather(B10, HS);
  const ast = fmAstronaut(B10); tr(ast, PX, FEET, PS);
  const w10h = outlined(fa(B10, 'weight', 0, 0, 36, 'down', { side: 'right', nudge: [18, 0] }));
  const w10f = outlined(fa(B10, 'weight', 0, 0, 10, 'down', { side: 'left', nudge: [-18, 0] }));
  const noAir = chip(B10, 'no air → no drag', { size: 32, fill: 'rgba(10,27,39,0.75)', stroke: C.line, sw: 2 }); tr(noAir, 600, 140);
  const apollo = chip(B10, 'Apollo 15 · 1971', { size: 28, fill: C.glucose, color: '#3A2600' });
  const together = chip(B10, 'together!', { size: 32, fill: C.good, color: '#06281A' });
  const dustA = [dust(B10), dust(B10)];

  /* ================= 11. everything falls at the same rate ================= */
  const B11 = G(root);
  card(B11, 110, 150, 980, 470, { fill: C.card, stroke: C.line });
  rich(B11, 600, 222, ['Without air resistance, everything falls at the ', ['same rate', C.energy, 800]], { size: 36, weight: 600 });
  const trio = G(B11);
  const trioLine = E('line', { x1: 380, x2: 820, stroke: C.energyLt, 'stroke-width': 3, 'stroke-dasharray': '10 8' }, trio);
  const tH = fmHammer(trio, 0.55), tF = fmFeather(trio, 0.55), tB = E('circle', { r: 30, fill: ball('#8FB6E8', '#3D6FB0') }, trio);
  const q11 = T(B11, 600, 474, 'What makes the difference?', { size: 32, weight: 600, anchor: 'middle', fill: C.muted });
  const cW = G(B11), cD = G(B11);
  chip(cW, 'weight', { size: 36, fill: 'rgba(255,194,71,0.14)', stroke: C.glucose, color: C.glucose, sw: 2.5 });
  const xW = cross(cW, 16); tr(xW, 112, 0);
  const sW = strike(cW, -66, 0, 66);
  chip(cD, 'drag', { size: 36, fill: 'rgba(255,107,92,0.16)', stroke: C.oxygen, color: C.oxygen, sw: 2.5 });
  const tD = tick(cD, 17); tr(tD, 92, 0);

  /* ---------- update ---------- */
  return t => {
    /* --- 1, 2 --- */
    const a1 = beat(t, S.first - 0.1, at('drag') - 0.1);
    op(B1, a1);
    if (a1 > 0) {
      const x = crateX(t), v = crateV(t);
      crate.at(x, FY);
      streaks.forEach((s, k) => { const y = FY - CH * [0.28, 0.52, 0.76][k], L = 70 * v; attr(s, 'x1', x - CW / 2 - 18 - L - k * 14); attr(s, 'x2', x - CW / 2 - 18); attr(s, 'y1', y); attr(s, 'y2', y); op(s, v * 0.6); });
      const st = win(t, mid('friction', 0.08), mid('friction', 0.46), 0.3);
      op(strip, st); attr(strip, 'x', x - CW / 2 - 6); attr(strip, 'y', FY - 9); attr(strip, 'width', CW + 12);
      op(touch, st); tr(touch, x, FY);
      fric.move(crate.pt.bl[0], FY - 4); fric.set(P(t, mid('friction', 0.36), 0.5, easeOut)); op(fric, 1 - P(t, tStop - 0.05, 0.35, linear));
      op(motion, win(t, mid('friction', 0.5), tStop + 0.1, 0.3)); tr(motion, x - 60, FY - CH - 40);
      op(oppLbl, win(t, mid('friction', 0.56), at('bumps') - 0.2, 0.3)); attr(oppLbl, 'x', Math.min(x, 800));
      speedM.set(v); op(speedG, P(t, mid('friction', 0.62), 0.4, linear) * (1 - P(t, at('bumps') - 0.2, 0.3, linear)));
      op(slowLbl, win(t, mid('friction', 0.8), at('bumps') - 0.1, 0.3));
    }
    const a2 = beat(t, at('bumps') - 0.15, at('drag') - 0.1);
    op(B2, a2);
    if (a2 > 0) {
      const z = P(t, at('bumps') - 0.1, 0.9, easeOut);
      bub.setAttribute('transform', `translate(${lerp(CP[0], BC[0], z).toFixed(1)} ${lerp(CP[1], BC[1], z).toFixed(1)}) scale(${Math.max(0.02, z).toFixed(3)}) translate(${-BC[0]} ${-BC[1]})`);
      op(conn, P(t, at('bumps') + 0.5, 0.4, linear));
      /* stick-slip: the crate's surface strains, catches, jerks on */
      const ss = t - mid('bumps', 0.45), u = ((ss % 0.9) + 0.9) % 0.9 / 0.9, on = ss > 0 ? 1 : 0;
      tr(wood, on * calm * (u < 0.75 ? 5 * (u / 0.75) : 5 * (1 - (u - 0.75) / 0.25)), on * calm * -2.5 * Math.sin(Math.PI * clamp(u / 0.75)));
      catches.forEach((c, k) => op(c, on * (0.45 + 0.55 * wave(t, 0.9, k * 0.21))));
      op(roughLbl, P(t, mid('bumps', 0.22), 0.4, linear));
      op(catchLbl, P(t, mid('bumps', 0.5), 0.4, linear));
    }

    /* --- 3 --- */
    const a3 = beat(t, at('drag') - 0.15, at('useful') - 0.1);
    op(B3, a3);
    if (a3 > 0) {
      const tUp = mid('drag', 0.52), sp = lerp(0.42, 0.82, P(t, tUp, 1.6));
      const dist = (t - at('drag')) * 260 + 250 * Math.max(0, t - tUp - 0.8);            // the road scrolls faster as the rider speeds up
      dashes.setAttribute('stroke-dashoffset', (dist % 160).toFixed(1));
      air.forEach(a => { const u = (t * (0.9 + sp) + a.ph) % 1, x = W + 60 - u * (W + 200); attr(a.el, 'x1', x); attr(a.el, 'x2', x + 60 + 60 * sp); op(a.el, P(t, mid('drag', 0.05), 0.5, linear) * 0.55); });
      tr(bike, CX, ROAD); ride(bike, dist, lerp(56, 26, P(t, mid('drag', 0.8), 0.7)));
      const dn = 50 * Math.pow(sp / 0.42, 2) * lerp(1, 1.4, P(t, mid('drag', 0.8), 0.6));
      drag3.set(P(t, mid('drag', 0.2), 0.5, easeOut), dn);
      op(dChip, P(t, mid('drag', 0.02), 0.5, linear));
      sp3.set(sp); op(sp3G, P(t, mid('drag', 0.5), 0.4, linear));
      op(fastLbl, win(t, mid('drag', 0.56), mid('drag', 0.79), 0.3)); op(areaLbl, P(t, mid('drag', 0.82), 0.4, linear));
      const ps = P(t, mid('drag', 0.38), 0.5, pop);
      op(swim, clamp(ps * 2)); scaleAbout(swim, 970, 300, 0.85 + 0.15 * ps);
      const strokeT = t * 1.2 * (calm > 0.5 ? 1 : 0.5);
      tr(swimmer, 930, 322); swArm.setAttribute('transform', `translate(30 -4) rotate(${(200 + 360 * (strokeT % 1)).toFixed(1)})`);
      let wd2 = ''; for (let x = 792; x <= 1148; x += 8) wd2 += (x === 792 ? 'M' : 'L') + x + ',' + (300 + 4 * Math.sin(x * 0.05 - t * 3)).toFixed(1);
      waveP.setAttribute('d', wd2);
      drag3w.move(850, 324); drag3w.set(P(t, mid('drag', 0.42), 0.5, easeOut));
    }

    /* --- 4 --- */
    const a4 = beat(t, at('useful') - 0.15, at('chute') - 0.1);
    op(B4, a4);
    if (a4 > 0) {
      [0.2, 0.46, 0.72].forEach((f, i) => { const p = P(t, mid('useful', f), 0.55, pop); op(useCards[i], clamp(p * 2)); scaleAbout(useCards[i], UX[i], 400, 0.85 + 0.15 * p); op(useLbls[i], P(t, mid('useful', f) + 0.35, 0.4, linear)); });
      const wk = t * 1.1;
      tr(walker, 220, 470, 1.05); walker.pose(walkPose(wk, 0.9));
      tr(footGlow, 220 + 22 * Math.sin(wk * TAU * 0.9), 470); op(footGlow, 0.6 + 0.4 * wave(t, 1.1));
      tr(tyreSpin, 600, 382, 1, (t * 90 * calm) % 360); op(tyreGlow, 0.7 + 0.3 * wave(t, 0.8));
      const t0 = mid('useful', 0.72), tb = mid('useful', 0.82), xb = clamp(t - tb, 0, 1.2);
      tr(wheelSpin, 980, 382, 1, ((300 * (Math.min(t, tb) - t0) + 300 * (xb - xb * xb / 2.4)) * calm) % 360);
      const bk = P(t, tb, 0.35, easeIn);
      tr(brake, 980, 382 - 96 - 14 * (1 - bk)); op(brakeGlow, bk * (0.6 + 0.4 * wave(t, 0.6)));
    }

    /* --- 5 --- */
    const a5 = beat(t, at('chute') - 0.15, at('waste') - 0.1);
    op(B5, a5);
    if (a5 > 0) {
      const open = P(t, mid('chute', 0.18), 0.7, easeOut), sv = lerp(0.85, 0.25, P(t, mid('chute', 0.28), 1.3));
      clouds.forEach(c => { const u = (t * (0.15 + 0.9 * sv) + c.ph) % 1; tr(c.el, c.x, H + 80 - u * (H + 160)); });
      const cy = lerp(PJ[1] - 190, CYO, open);
      tr(canopy, PJ[0], cy, Math.max(0.05, open)); op(canopy, open > 0.02 ? 1 : 0);
      const shL = [PJ[0] - 14, PJ[1] - 146], shR = [PJ[0] + 10, PJ[1] - 146];
      cords.setAttribute('d', `M${PJ[0] - 186 * open},${cy} L${shL[0]},${shL[1]} M${PJ[0] - 70 * open},${cy + 8} L${shL[0]},${shL[1]} M${PJ[0] + 70 * open},${cy + 8} L${shR[0]},${shR[1]} M${PJ[0] + 186 * open},${cy} L${shR[0]},${shR[1]}`);
      op(cords, open > 0.02 ? 1 : 0);
      tr(pack, PJ[0], PJ[1]); op(pack, 1 - open);
      jumper.pose({ armR: [lerp(150, 168, open), 0], armL: [lerp(-150, -168, open), 0], legL: [10, -6], legR: [-6, -14] });
      w5.set(P(t, at('chute') - 0.1, 0.4, easeOut));
      dSmall.set(1, 36); op(dSmall, 1 - open);
      dBig.move(PJ[0], cy - 104 * open); dBig.set(P(t, mid('chute', 0.3), 0.4, easeOut), 110 * lerp(1.5, 1, P(t, mid('chute', 0.55), 1.0))); op(dBig, open);
      sp5.set(sv);
      op(chuteLbl, P(t, mid('chute', 0.42), 0.4, linear));
    }

    /* --- 6, 7 --- */
    const a6 = beat(t, at('waste') - 0.15, mid('reduce', 0.45));
    op(B6, a6);
    if (a6 > 0) {
      const toR = P(t, at('reduce') - 0.1, 0.4, linear);
      op(t6, 1 - toR); op(t7, toR);
      const rot = (t - at('waste')) * 40 * calm;
      tr(gearA, GA[0], GA[1], 1, rot); tr(gearB, GBx, GA[1], 1, 18 - rot * NA / NB);
      const hot = P(t, mid('waste', 0.18), 0.5, linear) * (1 - 0.85 * P(t, mid('reduce', 0.16), 1.2));
      heat.upd(t); op(heat, hot); op(hotGlow, hot * (0.7 + 0.3 * wave(t, 0.9)));
      flakes.forEach((f, k) => { const u = ((t - mid('waste', 0.42)) / 1.3 + k / 4) % 1, on = t > mid('waste', 0.42) ? 1 - toR : 0; attr(f, 'x', MESH[0] + 6 - 18 * u + k * 3); attr(f, 'y', MESH[1] + 16 + u * 110); op(f, on * Math.sin(Math.PI * u)); });
      op(heatLbl, P(t, mid('waste', 0.22), 0.4, linear) * (1 - toR)); op(wearLbl, P(t, mid('waste', 0.42), 0.4, linear) * (1 - toR));
      op(oilLbl, P(t, mid('reduce', 0.08), 0.4, linear));
      const pc = P(t, at('reduce') + 0.1, 0.7, easeOut);
      op(can, pc); tr(can, lerp(90, 196, pc), lerp(250, 288, pc), 1, lerp(0, 28, pc));
      drops.forEach((d, k) => { const u = ((t - mid('reduce', 0.1)) / 0.8 + k / 3) % 1, on = t > mid('reduce', 0.1) ? 1 : 0; tr(d, lerp(326, 350, u), lerp(314, 402, u)); op(d, on * Math.min(1, u * 6, (1 - u) * 6)); });
      const av = win(t, mid('waste', 0.7), at('reduce') + 0.5, 0.4);
      op(vehicles, av);
      if (av > 0) { const dd = (t - mid('waste', 0.7)) * 180; car6.roll(dd); dCar.set(P(t, mid('waste', 0.74), 0.5, easeOut)); dCyc.set(P(t, mid('waste', 0.8), 0.5, easeOut)); op(vehLbl, P(t, mid('waste', 0.76), 0.4, linear)); }
      const ar = win(t, mid('reduce', 0.27), mid('reduce', 0.45), 0.35);
      op(rollers, ar);
      if (ar > 0) {
        const d = 150 * P(t, mid('reduce', 0.29), 2.4, ease);       // the crate moves d; its rollers move d/2, rolling on the floor
        rCrate.at(800 + d, 566);
        rolls.forEach(r => tr(r.g, 800 + r.rel + d / 2, 583, 1, (d / 2) / 17 * 180 / Math.PI));
        op(rollLbl, P(t, mid('reduce', 0.3), 0.4, linear));
      }
    }
    const bv = a3 > 0 ? a3 : a6 * win(t, mid('waste', 0.7), at('reduce') + 0.5, 0.4);
    op(bike, bv);
    if (a3 <= 0 && bv > 0) { tr(bike, 920, 650, 0.8); ride(bike, (t - mid('waste', 0.7)) * 180, 38); }
    const a7 = beat(t, mid('reduce', 0.43), at('increase') - 0.1);
    op(B7, a7);
    if (a7 > 0) {
      rows.forEach((r, i) => { op(r.g, P(t, mid('reduce', i ? 0.58 : 0.47), 0.5, linear)); r.dA.set(P(t, mid('reduce', i ? 0.64 : 0.54), 0.5, easeOut)); });
      flows.forEach(l => l.setAttribute('stroke-dashoffset', ((t * 120 * calm) % 42).toFixed(1)));
      swirls.forEach((s, k) => tr(s.g, s.x - 8 * calm * Math.sin(t * 2 + k), s.y, 1, (-t * 220 * calm + k * 70) % 360));
    }

    /* --- 8 --- */
    const a8 = beat(t, at('increase') - 0.15, at('feather') - 0.1);
    op(B8, a8);
    if (a8 > 0) {
      const pl = P(t, at('increase') - 0.1, 0.5, linear), pr = P(t, mid('increase', 0.6), 0.5, linear);
      op(tread, pl); op(gripT, pl * (0.6 + 0.4 * wave(t, 0.8)));
      tr(tyreBig, 330, 196, 1, (t * 14 * calm) % 360);
      op(boot, pr);
      const st = Math.pow(Math.max(0, Math.sin((t - mid('increase', 0.6)) * 2.2)), 2);
      tr(shoe, 860 + 8 * st, 436 + 14 * st, 0.9); op(gripB, pr * st);
    }

    /* --- 9: the feather on Earth --- */
    const a9 = beat(t, at('feather') - 0.15, at('moon') + 0.3);
    op(SKY, a9); op(B9, a9);
    if (a9 > 0) {
      const tR = mid('feather', 0.6), go = clamp((t - tR) / 0.85), landed = t > tR + 0.85;
      const hy = Y9 + (GND9 - 56 - Y9) * go * go;
      const tp = clamp((t - tR - 0.85) / 0.34), ph = 84 * easeIn(tp), a = ph * Math.PI / 180;
      if (landed) tr(ham9, HX9 + 56 * Math.sin(a), GND9 - 56 * Math.cos(a) - 9 * Math.sin(a), 1, ph); else tr(ham9, HX9, hy, 1, 0);
      const fall = Math.max(0, t - tR), fy = Y9 + 40 * fall, sway = 22 * calm * Math.sin(TAU * fall / 1.9) * Math.min(1, fall), rock = 90 + 14 * calm * Math.cos(TAU * fall / 1.9) * Math.min(1, fall);
      tr(fea9, FX9 + sway, fy, 1, rock);
      const hA = 1 - P(t, tR + 0.2, 0.25, linear);
      w9h.move(HX9, hy); w9h.set(P(t, mid('feather', 0.08), 0.5, easeOut)); op(w9h, hA);
      d9h.move(HX9, hy - 45); d9h.set(P(t, mid('feather', 0.12), 0.4, easeOut)); op(d9h, hA);
      w9f.move(FX9 + sway, fy); w9f.set(P(t, mid('feather', 0.36), 0.5, easeOut));
      d9f.move(FX9 + sway, fy - 18); d9f.set(P(t, mid('feather', 0.28), 0.5, easeOut));
      const ar9 = win(t, mid('feather', 0.22), tR + 0.3, 0.3);
      tr(area9, FX9 + sway, fy, 1, rock - 90); op(area9, ar9);
      op(areaLbl9, ar9); attr(areaLbl9, 'x', FX9 + sway - 92); attr(areaLbl9, 'y', fy + 10);
      op(pause9, win(t, at('feather') - 0.1, tR, 0.3)); op(hold9, P(t, tR + 0.2, 0.4, linear));
    }

    /* --- 10: the Moon --- */
    const a10 = beat(t, at('moon') - 0.2, at('fall') - 0.1);
    op(MOON, a10); op(B10, a10);
    if (a10 > 0) {
      const tR = mid('moon', 0.55), tL = tR + TM;
      const arm = t < tL + 0.3 ? lerp(95, 120, P(t, at('moon') + 0.2, 1.0)) : lerp(120, 12, P(t, tL + 0.3, 1.0));
      ast.pose({ armR: [arm, arm > 60 ? 0 : 14 * (1 - arm / 60)], armL: [-arm, arm > 60 ? 0 : 14 * (1 - arm / 60)] });
      const hx0 = 66 * Math.sin(arm * Math.PI / 180) * PS, hy0 = FEET + (-146 + 66 * Math.cos(arm * Math.PI / 180)) * PS;
      const u = (t - tR) / TM, drop = u <= 0 ? 0 : DROP * Math.min(1, u) * Math.min(1, u);
      let hx = PX + hx0, hy = hy0 - HAM_UP, fx = PX - hx0, fy = hy0 - FEA_UP, hr = 0, fr = 0;
      if (t > tR) { hx = PX + HX; fx = PX - HX; hy = HY - HAM_UP + drop; fy = HY - FEA_UP + drop; }
      if (t > tL) {
        const p = clamp((t - tL) / 0.34), back = p >= 1 ? 5 * Math.sin(Math.PI * clamp((t - tL - 0.34) / 0.26)) : 0, ph = 84 * easeIn(p) - back, a = ph * Math.PI / 180;
        hx = PX + HX + HAM_DN * Math.sin(a); hy = FEET - HAM_DN * Math.cos(a) - 9 * Math.sin(a); hr = ph;
        fx = PX - HX - FEA_DN * Math.sin(a); fy = FEET - FEA_DN * Math.cos(a) - 9 * Math.sin(a); fr = -ph;
      }
      tr(ham10, hx, hy, 1, hr); tr(fea10, fx, fy, 1, fr);
      const wA = P(t, tR - 0.05, 0.4, easeOut);
      op(w10h, 1 - P(t, tL, 0.25, linear)); op(w10f, 1 - P(t, tL, 0.25, linear));
      w10h.move(hx, hy); w10h.set(wA); w10f.move(fx, fy); w10f.set(wA);
      const ly = BOT0 + drop;
      op(level, u > 0 ? Math.min(1, u * 8) * (1 - P(u, 1.02, 0.12, linear)) : 0);
      attr(level, 'x1', PX - HX - 26); attr(level, 'x2', PX + HX + 26); attr(level, 'y1', ly); attr(level, 'y2', ly);
      const dp = clamp((t - tL) / 0.6);
      dustA.forEach((d, k) => { op(d, dp > 0 && dp < 1 ? Math.sin(dp * Math.PI) : 0); tr(d, k ? PX + HX : PX - HX, FEET - 4, 0.6 + 0.7 * dp); });
      op(noAir, P(t, at('moon') + 0.1, 0.4, linear));
      popIn(apollo, P(t, mid('moon', 0.36), 0.5, pop), 900, 210);
      popIn(together, P(t, tL + 0.12, 0.5, pop), PX, 272);
    }

    /* --- 11 --- */
    const a11 = P(t, at('fall') - 0.15, 0.4, linear);
    op(B11, a11);
    if (a11 > 0) {
      const y = lerp(300, 372, P(t, mid('fall', 0.12), 1.4, easeIn));
      tr(tH, 460, y, 1); tr(tF, 600, y - 6, 1); attr(tB, 'cx', 740); attr(tB, 'cy', y + 14);
      attr(trioLine, 'y1', y + 44); attr(trioLine, 'y2', y + 44); op(trioLine, P(t, mid('fall', 0.12), 0.4, linear));
      op(q11, P(t, mid('fall', 0.52), 0.4, linear));
      popIn(cD, P(t, mid('fall', 0.56), 0.5, pop), 740, 548); popIn(cW, P(t, mid('fall', 0.6), 0.5, pop), 470, 548);
      sW.set(P(t, mid('fall', 0.72), 0.4)); op(xW, P(t, mid('fall', 0.74), 0.3, linear)); op(tD, P(t, mid('fall', 0.66), 0.3, linear));
    }
  };
});
