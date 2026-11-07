/* Chapter 6: inhaled vs exhaled air, and the limewater test.
   A classic exam table fills in row by row: oxygen 21 % -> 16 % (so a rescue breath still carries oxygen),
   carbon dioxide 0.04 % -> 4 % (magnified: about 100 times more), nitrogen 78 % and unchanged, water vapour
   low -> high (a breath fogs a cold window), and breathed-out air is warmer. Then limewater: clear -> milky
   with carbon dioxide, and the showpiece: breathed-out air turns it milky far faster than room air. */
scene('air', S => {
  const { at, end, mid } = S, root = S.root;
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
  function rich(parent, x, y, segs, o) {
    o = o || {};
    const t = E('text', { x, y, 'font-size': o.size || 30, 'font-weight': o.weight || 600, 'font-family': o.font || FD, 'text-anchor': o.anchor || 'start', fill: o.fill || C.ink }, parent);
    segs.forEach(s => { if (typeof s === 'string') s = [s]; E('tspan', { fill: s[1], 'font-weight': s[2] }, t).textContent = s[0]; });
    return t;
  }
  /* hollow glass delivery tube through points */
  function glassTube(parent, pts, wide) {
    const d = 'M' + pts.map(p => p.join(',')).join(' L'), g = G(parent), w = wide || 12;
    E('path', { d, fill: 'none', stroke: '#9DB7C6', 'stroke-width': w, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, g);
    E('path', { d, fill: 'none', stroke: '#11303D', 'stroke-width': w - 6, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, g);
    return g;
  }
  /* position along a polyline, u in 0..1 */
  function along(pts, u) {
    const segs = []; let L = 0;
    for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); segs.push(l); L += l; }
    let d = clamp(u) * L;
    for (let i = 0; i < segs.length; i++) { if (d <= segs[i] || i === segs.length - 1) { const f = segs[i] ? d / segs[i] : 0; return [lerp(pts[i][0], pts[i + 1][0], f), lerp(pts[i][1], pts[i + 1][1], f)]; } d -= segs[i]; }
    return pts[pts.length - 1];
  }
  /* a point on a quadratic curve */
  const quad = (a, c, b, u) => { const v = 1 - u; return [v * v * a[0] + 2 * v * u * c[0] + u * u * b[0], v * v * a[1] + 2 * v * u * c[1] + u * u * b[1]]; };
  /* nitrogen: two blue atoms (no N in lib's ATOM table) */
  const N2C = '#8E9BFF', N2D = '#4B57C9';
  function molN2(parent, r) {
    r = r || 15; const g = G(parent);
    [-1, 1].forEach(k => E('circle', { cx: k * r * 0.72, r, fill: ball(N2C, N2D), stroke: N2D, 'stroke-width': Math.max(1.5, r * 0.08) }, g));
    return g;
  }
  const SKIN = '#C98E62', SKINDK = '#9C6A48', HAIR = '#2B1D14';
  /* a face seen from the front (radius r); g.mouth can open */
  function faceFront(parent, r) {
    const g = G(parent);
    E('circle', { r, fill: ball('#DDA57C', SKINDK), stroke: '#F0C9A8', 'stroke-width': 3 }, g);
    E('path', { d: `M${-r},${-r * 0.08} Q${-r * 1.02},${-r * 1.12} 0,${-r * 1.06} Q${r * 1.02},${-r * 1.12} ${r},${-r * 0.08} Q${r * 0.78},${-r * 0.62} 0,${-r * 0.64} Q${-r * 0.78},${-r * 0.62} ${-r},${-r * 0.08} Z`, fill: HAIR }, g);
    [-1, 1].forEach(k => E('circle', { cx: k * r * 0.34, cy: -r * 0.1, r: r * 0.11, fill: '#2A1D14' }, g));
    g.mouth = E('ellipse', { cx: 0, cy: r * 0.44, rx: r * 0.2, ry: r * 0.14, fill: '#5A2A22' }, g);
    return g;
  }
  /* a head and shoulders in profile, facing right (head radius r, centred on the head) */
  function headSide(parent, r) {
    const g = G(parent);
    E('path', { d: `M${-r * 1.35},${r * 2.15} Q${-r * 1.3},${r * 1.3} ${-r * 0.2},${r * 1.22} Q${r * 0.9},${r * 1.25} ${r},${r * 2.15} Z`, fill: '#5B8DEF' }, g);
    E('path', { d: `M${-r * 0.42},${r * 0.7} L${-r * 0.5},${r * 1.32} L${r * 0.28},${r * 1.32} L${r * 0.26},${r * 0.7} Z`, fill: SKINDK }, g);
    E('circle', { r, fill: ball('#DDA57C', SKINDK), stroke: '#F0C9A8', 'stroke-width': 3 }, g);
    E('path', { d: `M${r * 0.9},${-r * 0.12} Q${r * 1.28},${r * 0.14} ${r * 0.92},${r * 0.24}`, fill: '#DDA57C', stroke: '#F0C9A8', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, g);
    E('path', { d: `M${-r * 0.98},${r * 0.25} Q${-r * 1.12},${-r * 0.9} ${r * 0.05},${-r * 1.02} Q${r * 0.78},${-r * 0.98} ${r * 0.92},${-r * 0.42} Q${r * 0.3},${-r * 0.62} ${-r * 0.2},${-r * 0.4} Q${-r * 0.5},${-r * 0.02} ${-r * 0.98},${r * 0.25} Z`, fill: HAIR }, g);
    E('circle', { cx: r * 0.52, cy: -r * 0.2, r: r * 0.1, fill: '#2A1D14' }, g);
    g.mouth = E('ellipse', { cx: r * 0.8, cy: r * 0.5, rx: r * 0.1, ry: r * 0.1, fill: '#5A2A22' }, g);
    g.mouthAt = [r * 0.92, r * 0.5];
    return g;
  }
  function stopwatch(parent) {
    const g = G(parent);
    E('rect', { x: -7, y: -50, width: 14, height: 12, rx: 3, fill: C.muted }, g);
    E('circle', { r: 36, fill: C.card, stroke: C.muted, 'stroke-width': 5 }, g);
    for (let i = 0; i < 12; i++) { const a = i * TAU / 12; E('line', { x1: Math.sin(a) * 27, y1: -Math.cos(a) * 27, x2: Math.sin(a) * 31, y2: -Math.cos(a) * 31, stroke: C.faint, 'stroke-width': 2.5 }, g); }
    const hand = E('line', { x1: 0, y1: 4, x2: 0, y2: -26, stroke: C.energy, 'stroke-width': 4.5, 'stroke-linecap': 'round' }, g);
    E('circle', { r: 4.5, fill: C.energy }, g);
    const txt = T(g, 0, 80, '0 s', { size: 30, weight: 700, anchor: 'middle' });
    g.set = s => { attr(hand, 'transform', `rotate(${(s * 6).toFixed(1)})`); setText(txt, Math.floor(s) + ' s'); };
    g.txt = txt;
    g.set(0);
    return g;
  }
  function bung(parent, w) {
    const g = G(parent);
    E('path', { d: `M${-w / 2 - 8},-17 L${w / 2 + 8},-17 L${w / 2 - 3},17 L${-w / 2 + 3},17 Z`, fill: ball('#A9483A', '#6E2A21'), stroke: '#C86A58', 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
    return g;
  }
  /* limewater: clear and pale, to milky white */
  const limeCol = m => `rgba(${Math.round(lerp(165, 241, m))},${Math.round(lerp(218, 245, m))},${Math.round(lerp(240, 248, m))},${lerp(0.3, 0.97, m).toFixed(3)})`;
  const BUB = { fill: 'rgba(255,255,255,0.12)', color: 'rgba(150,196,224,0.95)' };

  /* =====================================================================
     A. the exam table (table -> warm). Chart group slides left at "cpr"
     ===================================================================== */
  const BX = 390, SC = 4.8, BH = 28, OFF = 19, ROWY = [318, 418, 518, 618];
  const chart = G(root);
  const GAS = [
    { name: 'oxygen', col: C.oxygen, lt: '#FF9A8F', vin: 21, vout: 16, icon: g => molO2(g, 11) },
    { name: 'carbon dioxide', col: C.co2, lt: '#D3DEE8', vin: 0.04, vout: 4, icon: g => molCO2(g, 9) },
    { name: 'nitrogen', col: N2C, lt: '#BCC4FF', vin: 78, vout: 78, icon: g => molN2(g, 11) },
    { name: 'water vapour', col: C.water, lt: '#9DE3F8', vin: 1.2, vout: 5.5, txtIn: 'low', txtOut: 'high', icon: g => molH2O(g, 11) },
  ];
  // header: "breathed in" -> you -> "breathed out"
  const head = G(chart);
  const chipIn = chip(head, 'breathed in', { size: 30, fill: '#12384A', stroke: C.air, color: C.air, sw: 2.5 }); tr(chipIn, 250, 172);
  const chipOut = chip(head, 'breathed out', { size: 30, fill: C.air, color: C.bg0 }); tr(chipOut, 640, 172);
  const PX = 440, PY = 258, PS = 0.72;
  const you = person(head, { shirt: '#5B8DEF' }); tr(you, PX, PY, PS); you.pose();
  const youHead = you.firstChild.lastChild;
  [-1, 1].forEach(k => E('circle', { cx: k * 6.5, cy: -177, r: 2.4, fill: '#2A1D14' }, youHead));
  const youMouth = E('ellipse', { cx: 0, cy: -166, rx: 4.5, ry: 2, fill: '#5A2A22' }, youHead);
  const MOUTH = [PX, PY - 166 * PS];
  const inA = [358, 166], inB = [MOUTH[0] - 14, MOUTH[1] + 2], outA = [MOUTH[0] + 14, MOUTH[1] + 2], outB = [522, 166];
  const arrIn = arrow(head, inA[0], inA[1], inB[0], inB[1], { color: C.air, width: 5, bend: -26 });
  const arrOut = arrow(head, outA[0], outA[1], outB[0], outB[1], { color: C.air, width: 5, bend: -26 });
  const ctrl = (a, b, bend) => { const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1; return [mx - dy / L * bend, my + dx / L * bend]; };
  const inC = ctrl(inA, inB, -26), outC = ctrl(outA, outB, -26);
  const n2Flow = G(head), n2s = [0, 1, 2, 3, 4].map(() => molN2(n2Flow, 8));
  const flowIn = G(head), flowOut = G(head);
  const dotsIn = [C.air, C.oxygen, C.air, C.air, C.oxygen, C.air].map(c => E('circle', { r: 5, fill: c }, flowIn));
  const dotsOut = [C.air, C.co2, C.air, C.oxygen, C.air, C.co2].map(c => E('circle', { r: 5, fill: c, stroke: c === C.co2 ? '#57636F' : 'none', 'stroke-width': 1.5 }, flowOut));
  const rule = E('line', { x1: 40, y1: 268, x2: 840, y2: 268, stroke: C.line, 'stroke-width': 3, 'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': '1 1' }, chart);
  const base = E('line', { x1: BX, y1: 276, x2: BX, y2: 652, stroke: C.line, 'stroke-width': 3, 'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': '1 1' }, chart);
  const rows = GAS.map((gs, i) => {
    const y = ROWY[i], g = G(chart);
    const lab = G(g);
    const ic = G(lab); gs.icon(ic); tr(ic, 64, y);
    T(lab, 96, y + 10, gs.name, { size: 30, weight: 700 });
    const tags = G(g);
    T(tags, BX - 12, y - OFF + 9, 'in', { size: 26, weight: 600, fill: C.muted, anchor: 'end' });
    T(tags, BX - 12, y + OFF + 9, 'out', { size: 26, weight: 600, fill: C.muted, anchor: 'end' });
    const bIn = E('rect', { x: BX, y: y - OFF - BH / 2, width: 0, height: BH, rx: 7, fill: gs.col, 'fill-opacity': 0.32, stroke: gs.col, 'stroke-width': 2.5 }, g);
    const bOut = E('rect', { x: BX, y: y + OFF - BH / 2, width: 0, height: BH, rx: 7, fill: gs.col }, g);
    const vIn = T(g, BX, y - OFF + 10, '', { size: 28, weight: 700, fill: gs.lt });
    const vOut = T(g, BX, y + OFF + 10, '', { size: 28, weight: 700, fill: gs.lt });
    return Object.assign({ y, g, lab, ic, tags, bIn, bOut, vIn, vOut }, gs);
  });
  const halo16 = E('rect', { x: BX - 8, y: ROWY[0] + OFF - BH / 2 - 8, width: GAS[0].vout * SC + 16, height: BH + 16, rx: 12, fill: 'none', stroke: C.energy, 'stroke-width': 4 }, chart);
  // set one bar's length (px) and its value label
  function setBar(bar, val, len, txt) {
    const w = Math.max(len > 0.01 ? 3 : 0, len);
    attr(bar, 'width', w); attr(bar, 'rx', Math.min(7, w / 2));
    op(bar, len > 0.01 ? 1 : 0);
    attr(val, 'x', BX + w + 12);
    setText(val, txt);
  }
  const pct = (v, p) => (v >= 1 ? String(Math.round(v * p)) : (v * p).toFixed(2)) + '%';

  /* ---------- the rescue breath (right zone) ---------- */
  const cpr = G(root);
  E('line', { x1: 852, y1: 602, x2: 1162, y2: 602, stroke: '#3C6478', 'stroke-width': 4, 'stroke-linecap': 'round' }, cpr);
  const cprChip = chip(cpr, 'rescue breaths', { size: 28, fill: C.card2, stroke: C.oxygen, color: '#FFD0CA' }); tr(cprChip, 1005, 380);
  const cprNote = G(cpr);
  tr(molO2(cprNote, 10), 0, -9);
  T(cprNote, 22, 0, 'still 16% oxygen', { size: 28, weight: 600, fill: '#FF9A8F' });
  const PAT = { x: 1150, y: 582, s: 1 };
  const patient = person(cpr, { shirt: '#FF8A3D', shorts: '#3A4F66', hair: '#6B4A33' });
  tr(patient, PAT.x, PAT.y, PAT.s, -90); patient.pose();
  const patGlow = E('ellipse', { cx: PAT.x - 100, cy: PAT.y, rx: 96, ry: 30, fill: glow(C.oxygen) }, cpr);
  cpr.insertBefore(patGlow, patient);
  const RES = { hip: [909, 549], s: 1, lean: 66 };
  const rescuer = person(cpr, { shirt: '#56D69B', shorts: '#1F5C3E', hair: '#3B2A1E' });
  const resPose = { lean: RES.lean, armL: [RES.lean + 26, 12], armR: [RES.lean + 8, 30], legL: [RES.lean, -92], legR: [RES.lean - 4, -88] };
  tr(rescuer, RES.hip[0], RES.hip[1] + 92 * RES.s, RES.s); rescuer.pose(resPose);
  const la = RES.lean * Math.PI / 180, hx = 82 * Math.sin(la), hy = -82 * Math.cos(la);
  const resMouth = [RES.hip[0] + (hx + 12 * Math.cos(la) - 7 * Math.sin(la)) * RES.s, RES.hip[1] + (hy + 12 * Math.sin(la) + 7 * Math.cos(la)) * RES.s];
  const patMouth = [PAT.x - 168 * PAT.s, PAT.y - 16 * PAT.s], patChest = [PAT.x - 112 * PAT.s, PAT.y - 2];
  const breathPath = [resMouth, [patMouth[0], patMouth[1] - 4], [patMouth[0] + 10, patMouth[1] + 8], patChest];
  const BODY = [995, 1018, 1060, 1085, 1110, 1130, 1040];       // where each dot spreads to along the body
  const o2dots = BODY.map(() => E('circle', { r: 5.5, fill: ball(C.oxygen, C.oxygenDk) }, cpr));
  // "until help arrives": an ambulance on its way
  const amb = G(cpr), ambIn = G(amb, { transform: 'scale(-1 1)' });          // drawn facing right, mirrored to drive left
  const ambLight = E('ellipse', { cx: -6, cy: -34, rx: 30, ry: 22, fill: glow('#5AA8FF') }, ambIn);
  E('rect', { x: -58, y: -26, width: 80, height: 46, rx: 6, fill: '#F2F7FA' }, ambIn);
  E('path', { d: 'M20,-14 L40,-14 L54,2 L54,20 L20,20 Z', fill: '#F2F7FA', 'stroke-linejoin': 'round' }, ambIn);
  E('path', { d: 'M25,-9 L38,-9 L47,2 L25,2 Z', fill: '#7FB3D5' }, ambIn);
  E('rect', { x: -58, y: 4, width: 112, height: 6, fill: C.bad }, ambIn);
  E('path', { d: 'M-24,-19 v18 M-33,-10 h18', stroke: C.bad, 'stroke-width': 6, 'stroke-linecap': 'round' }, ambIn);
  E('rect', { x: -14, y: -35, width: 16, height: 9, rx: 3, fill: '#3B82F6' }, ambIn);
  [-36, 34].forEach(x => E('circle', { cx: x, cy: 21, r: 9.5, fill: '#2B3A47', stroke: '#9DB0BF', 'stroke-width': 3 }, ambIn));
  const dotPath = BODY.map((bx, k) => breathPath.concat([[bx, PAT.y + (k % 2 ? -7 : 7)]]));

  /* ---------- carbon dioxide, magnified ---------- */
  const lensG = G(root);
  const LX = 1005, LY = 446, LR = 158, LZ = 9;       // lens centre, radius and zoom
  const src = [BX + 48, ROWY[1]], SR = 54;
  {
    const vx = LX - src[0], vy = LY - src[1], L = Math.hypot(vx, vy), nx = -vy / L, ny = vx / L;
    E('path', { d: `M${(src[0] + nx * SR).toFixed(1)},${(src[1] + ny * SR).toFixed(1)} L${(LX + nx * LR).toFixed(1)},${(LY + ny * LR).toFixed(1)} L${(LX - nx * LR).toFixed(1)},${(LY - ny * LR).toFixed(1)} L${(src[0] - nx * SR).toFixed(1)},${(src[1] - ny * SR).toFixed(1)} Z`, fill: 'rgba(207,227,238,0.07)', stroke: 'rgba(207,227,238,0.28)', 'stroke-width': 2 }, lensG);
  }
  E('circle', { cx: src[0], cy: src[1], r: SR, fill: 'none', stroke: '#CFE3EE', 'stroke-width': 4 }, lensG);
  const lens = G(lensG); tr(lens, LX, LY);
  E('line', { x1: LR * 0.72, y1: LR * 0.72, x2: LR * 0.99, y2: LR * 0.99, stroke: '#C9D6DE', 'stroke-width': 18, 'stroke-linecap': 'round' }, lens);
  E('circle', { r: LR, fill: '#0E2633' }, lens);
  const LB = -92;                                     // bar start inside the lens
  T(lens, LB - 10, -38 + 9, 'in', { size: 26, weight: 600, fill: C.muted, anchor: 'end' });
  T(lens, LB - 10, 12 + 9, 'out', { size: 26, weight: 600, fill: C.muted, anchor: 'end' });
  const zIn = E('rect', { x: LB, y: -38 - BH / 2, width: 3, height: BH, rx: 1.5, fill: C.co2, 'fill-opacity': 0.32, stroke: C.co2, 'stroke-width': 2.5 }, lens);
  const zOut = E('rect', { x: LB, y: 12 - BH / 2, width: 0, height: BH, rx: 7, fill: C.co2 }, lens);
  const zvIn = T(lens, LB + 14, -38 + 10, '0.04%', { size: 28, weight: 700, fill: '#D3DEE8' });
  const zvOut = T(lens, LB, 12 + 10, '4%', { size: 28, weight: 700, fill: '#D3DEE8' });
  const x100 = G(lens); tr(x100, 0, 92);
  chip(x100, '× 100', { size: 34, fill: C.energy, color: C.bg0 });
  const zArc = arrow(lens, -40, -60, 108, -8, { color: C.energy, width: 4, bend: -30 });
  T(lens, 0, -104, 'magnified', { size: 24, weight: 600, fill: C.muted, anchor: 'middle' });
  E('circle', { r: LR, fill: 'none', stroke: '#CFE3EE', 'stroke-width': 8 }, lens);

  /* ---------- nitrogen: unchanged ---------- */
  const same = G(root);
  chip(same, '= unchanged', { size: 28, fill: '#1E2A57', stroke: N2C, color: '#D5DAFF' });

  /* ---------- water vapour: a breath fogs a cold window ---------- */
  const side = G(root);                       // the breather, shared by water and warm
  const HX = 896, HY = 440;
  const headS = headSide(side, 40); tr(headS, HX, HY);
  const sMouth = [HX + headS.mouthAt[0] + 4, HY + headS.mouthAt[1]];
  const puffs = [0, 1, 2].map(() => E('ellipse', { rx: 26, ry: 18, fill: glow('#F2F8FC') }, side));
  const puffsW = [0, 1, 2].map(() => E('ellipse', { rx: 26, ry: 18, fill: glow('#FFB27A') }, side));
  const winG = G(root);
  const WX = 1086, WY = 430, GW = 70, GH = 100;      // window centre and glass half-size
  E('rect', { x: WX - GW - 12, y: WY - GH - 12, width: 2 * GW + 24, height: 2 * GH + 24, rx: 8, fill: '#DDE6EC', stroke: '#F4F8FA', 'stroke-width': 2 }, winG);
  E('rect', { x: WX - GW, y: WY - GH, width: 2 * GW, height: 2 * GH, rx: 3, fill: linGrad('#5D97B8', '#24506A', true) }, winG);
  const winClip = E('clipPath', { id: 'airWinGlass' }, defs()); E('rect', { x: WX - GW, y: WY - GH, width: 2 * GW, height: 2 * GH }, winClip);
  const fogG = G(winG, { 'clip-path': 'url(#airWinGlass)' });
  const fog = E('ellipse', { cx: WX - 34, cy: WY + 14, rx: 92, ry: 104, fill: glow('#FFFFFF', '#FFFFFF') }, fogG);
  const dr = rng(19), drops = [];
  for (let k = 0; k < 10; k++) drops.push(E('circle', { cx: (WX - GW + 8 + dr() * 90).toFixed(1), cy: (WY - 46 + dr() * 120).toFixed(1), r: (2 + dr() * 2.5).toFixed(1), fill: '#F4FAFF', opacity: 0.85 }, fogG));
  E('path', { d: `M${WX},${WY - GH} L${WX},${WY + GH} M${WX - GW},${WY} L${WX + GW},${WY}`, stroke: '#DDE6EC', 'stroke-width': 9 }, winG);
  E('path', { d: `M${WX + 16},${WY - 74} l26,0 M${WX + 29},${WY - 87} l0,26 M${WX + 20},${WY - 83} l18,18 M${WX + 38},${WY - 83} l-18,18`, stroke: '#FFFFFF', 'stroke-width': 3, 'stroke-linecap': 'round', opacity: 0.85 }, winG);
  T(winG, WX, WY - GH - 30, 'cold window', { size: 26, weight: 600, fill: C.muted, anchor: 'middle' });

  /* ---------- warmer: the same breath on a thermometer ---------- */
  const thG = G(root);
  const TX = 1072, TYB = 600;
  const th = thermometer(thG, 220, C.bad); tr(th, TX, TYB);
  const thHot = heatWaves(thG, { n: 3, h: 46, spacing: 16, width: 4 }); tr(thHot, TX - 62, TYB - 18);
  const thLab = T(thG, TX, TYB - 252, 'warmer', { size: 32, weight: 700, fill: C.heat, anchor: 'middle' });

  /* =====================================================================
     B. limewater: clear -> milky
     ===================================================================== */
  const lime = G(root);
  T(lime, 600, 168, 'The test for carbon dioxide', { size: 44, weight: 700, anchor: 'middle' });
  const LT = { x: 600, y: 470, w: 120, h: 360 };
  const limePath = [[290, 250], [582, 250], [582, 610]];
  const ltube = testTube(lime, LT.w, LT.h, { level: 0.6, liquid: limeCol(0) });
  tr(ltube, LT.x, LT.y);
  glassTube(lime, limePath);
  const lBub = bubbles(lime, 568, 448, 28, 160, Object.assign({ n: 10, r: 7, seed: 4, speed: 0.5 }, BUB));
  T(lime, 290, 218, 'carbon dioxide', { size: 28, weight: 600, fill: C.co2 });
  const lCO2 = [0, 1, 2].map(() => molCO2(lime, 8));
  const limeLab = G(lime);
  E('line', { x1: 770, y1: 520, x2: 652, y2: 520, stroke: C.muted, 'stroke-width': 3, 'stroke-linecap': 'round' }, limeLab);
  E('circle', { cx: 652, cy: 520, r: 5, fill: C.muted }, limeLab);
  T(limeLab, 784, 531, 'limewater', { size: 32, weight: 700 });
  const stClear = chip(lime, 'clear', { size: 30, fill: 'rgba(140,205,240,0.18)', stroke: '#8CCDF0', color: '#BFE6FA', sw: 2.5 });
  const stMilky = chip(lime, 'cloudy, or milky', { size: 30, fill: '#EEF3F6', color: C.bg0 });
  const ST = [784, 594];

  /* =====================================================================
     C. the showpiece: breathed-out air vs room air
     ===================================================================== */
  const test = G(root);
  const TT = { lx: 392, rx: 808, y: 458, w: 96, h: 288 };
  const rimY = TT.y - TT.h / 2;
  const tubeL = testTube(test, TT.w, TT.h, { level: 0.6, liquid: limeCol(0) }); tr(tubeL, TT.lx, TT.y);
  const tubeR = testTube(test, TT.w, TT.h, { level: 0.6, liquid: limeCol(0) }); tr(tubeR, TT.rx, TT.y);
  const J = [600, 256];                                         // the T-piece under the mouthpiece
  const blowP = [J, [TT.lx + 14, J[1]], [TT.lx + 14, TT.y + 120]];
  const exhP = [[TT.lx - 18, rimY + 6], [TT.lx - 18, rimY - 46], [TT.lx - 74, rimY - 46]];
  const drawP = [[TT.rx - 14, rimY + 26], [TT.rx - 14, J[1]], J];
  const inletP = [[TT.rx + 70, rimY - 46], [TT.rx + 18, rimY - 46], [TT.rx + 18, TT.y + 120]];
  [blowP, exhP, drawP, inletP].forEach(p => glassTube(test, p, 11));
  const bubL = bubbles(test, TT.lx + 3, TT.y - 18, 24, 136, Object.assign({ n: 9, r: 6, seed: 7, speed: 0.55 }, BUB));
  const bubR = bubbles(test, TT.rx + 7, TT.y - 18, 24, 136, Object.assign({ n: 9, r: 6, seed: 8, speed: 0.55 }, BUB));
  [TT.lx, TT.rx].forEach(x => { const b = bung(test, TT.w); tr(b, x, rimY + 4); });
  const faceT = faceFront(test, 46); tr(faceT, 600, 158);
  glassTube(test, [[600, 184], J], 13);
  const airDots = []; for (let k = 0; k < 8; k++) airDots.push(E('circle', { r: 6, fill: C.air }, test));
  const brOut = G(test), brIn = G(test);
  T(brOut, 486, 222, 'breathe out', { size: 26, weight: 700, fill: C.air, anchor: 'middle' });
  arrow(brOut, 548, 238, 428, 238, { color: C.air, width: 4 });
  T(brIn, 714, 222, 'breathe in', { size: 26, weight: 700, fill: C.air, anchor: 'middle' });
  arrow(brIn, 772, 238, 652, 238, { color: C.air, width: 4 });
  const swL = stopwatch(test); tr(swL, 214, 430);
  const swR = stopwatch(test); tr(swR, 986, 430);
  const labL = rich(test, TT.lx, 662, [['breathed-out', C.air, 700], ' air'], { size: 30, anchor: 'middle' });
  const labR = rich(test, TT.rx, 662, [['room', C.air, 700], ' air'], { size: 30, anchor: 'middle' });
  const doneL = chip(test, 'cloudy!', { size: 28, fill: '#EEF3F6', color: C.bg0 }); tr(doneL, 214, 566);
  const waitR = chip(test, 'still clear', { size: 28, fill: 'rgba(140,205,240,0.18)', stroke: '#8CCDF0', color: '#BFE6FA', sw: 2.5 }); tr(waitR, 986, 566);
  const swRing = E('circle', { cx: 214, cy: 430, r: 46, fill: 'none', stroke: C.good, 'stroke-width': 5 }, test);
  // conclusion card, between the tubes
  const proof = G(test);
  card(proof, -150, -70, 300, 140, { fill: '#123B30', stroke: C.good, sw: 3 });
  const ptk = tick(proof, 17); tr(ptk, -112, -26);
  T(proof, -82, -16, 'breathed-out air', { size: 28, weight: 700, fill: C.air });
  T(proof, 0, 26, 'far more', { size: 28, weight: 600, anchor: 'middle' });
  T(proof, 0, 58, 'carbon dioxide', { size: 30, weight: 700, anchor: 'middle', fill: C.co2 });

  return t => {
    /* ================= A. the table ================= */
    const aA = vis(t, S.first - 0.2, at('lime') - 0.15, 0.5);
    op(chart, aA);
    if (aA > 0) {
      const sl = P(t, at('cpr') - 0.05, 0.9);
      tr(chart, lerp(160, 0, sl), 0);
      // you, breathing in and out: big and central first, then shrinking into the table's header
      const sh = P(t, mid('table', 0.58), 0.8);
      head.setAttribute('transform', `translate(440 ${lerp(372, 190, sh).toFixed(1)}) scale(${lerp(1.55, 1, sh).toFixed(4)}) translate(-440 -190)`);
      const pp = P(t, at('table') + 0.05, 0.6, pop);
      op(you, clamp(pp * 2)); tr(you, PX, PY + (1 - clamp(pp)) * 14, PS);
      const bph = ((t - at('table')) / 3.6 % 1 + 1) % 1, inhale = bph < 0.5;
      const swell = Math.sin((inhale ? bph : bph - 0.5) / 0.5 * Math.PI);
      attr(youMouth, 'ry', inhale ? 2 : 2 + 2.5 * swell);
      const arA = P(t, mid('table', 0.06), 0.7);
      arrIn.set(arA); arrOut.set(P(t, mid('table', 0.12), 0.7));
      op(arrIn, arA > 0 ? 0.45 + 0.55 * (inhale ? swell : 0) : 0);
      op(arrOut, arA > 0 ? 0.45 + 0.55 * (inhale ? 0 : swell) : 0);
      // "breathing changes the air": oxygen goes in, some carbon dioxide comes out
      const fl = P(t, mid('table', 0.08), 0.5, linear) * (1 - P(t, mid('table', 0.6), 0.5, linear));
      op(flowIn, fl); op(flowOut, fl);
      if (fl > 0) {
        const uIn = inhale ? bph / 0.5 : -1, uOut = inhale ? -1 : (bph - 0.5) / 0.5;
        const run = (dots, u0, a, c, b) => dots.forEach((d, k) => {
          const u = u0 * 1.5 - k * 0.1;
          if (u0 < 0 || u <= 0 || u >= 1) { op(d, 0); return; }
          const q = quad(a, c, b, u); attr(d, 'cx', q[0]); attr(d, 'cy', q[1]); op(d, Math.min(1, u * 6, (1 - u) * 6));
        });
        run(dotsIn, uIn, inA, inC, inB); run(dotsOut, uOut, outA, outC, outB);
      }
      popAt(chipIn, 250, 172, t, mid('table', 0.28));
      popAt(chipOut, 640, 172, t, mid('table', 0.46));
      rule.setAttribute('stroke-dashoffset', (1 - P(t, mid('table', 0.64), 0.8)).toFixed(4));
      base.setAttribute('stroke-dashoffset', (1 - P(t, mid('table', 0.68), 0.8)).toFixed(4));
      // nitrogen passes straight through you
      const nOn = vis(t, mid('nitrogen', 0.6), at('water') + 0.2, 0.35);
      op(n2Flow, nOn);
      if (nOn > 0) n2s.forEach((m, k) => {
        const u = ((t - mid('nitrogen', 0.6)) / 2.4 + k / 2.5) % 2;
        const q = u < 1 ? quad(inA, inC, inB, u) : quad(outA, outC, outB, u - 1);
        tr(m, q[0], q[1] - 2); op(m, Math.min(1, u * 6, (2 - u) * 6, Math.abs(u - 1) * 8 + 0.15));
      });

      // rows: dim skeleton at "table", lit on their own beat
      const lit = ['oxygen', 'cotwo', 'nitrogen', 'water'].map(id => at(id));
      rows.forEach((r, i) => {
        const sk = P(t, mid('table', 0.68 + i * 0.05), 0.5, linear);
        const on = P(t, lit[i] - 0.1, 0.5, linear);
        op(r.lab, sk * (0.32 + 0.68 * on)); op(r.tags, sk * (0.32 + 0.68 * on));
        const ip = P(t, lit[i] - 0.05, 0.5, pop);
        tr(r.ic, 64, r.y, 1 + 0.25 * Math.sin(Math.PI * clamp(ip)));
      });
      // oxygen 21 -> 16
      { const r = rows[0], p1 = P(t, mid('oxygen', 0.14), 1.0, easeOut), p2 = P(t, mid('oxygen', 0.56), 1.0, easeOut);
        setBar(r.bIn, r.vIn, r.vin * SC * p1, p1 > 0 ? pct(r.vin, p1) : ''); setBar(r.bOut, r.vOut, r.vout * SC * p2, p2 > 0 ? pct(r.vout, p2) : ''); }
      // carbon dioxide 0.04 -> 4
      { const r = rows[1], p1 = P(t, mid('cotwo', 0.1), 0.6, easeOut), p2 = P(t, mid('cotwo', 0.4), 0.9, easeOut);
        setBar(r.bIn, r.vIn, p1 > 0 ? 0.04 : 0, p1 > 0 ? '0.04%' : ''); op(r.vIn, p1);
        setBar(r.bOut, r.vOut, r.vout * SC * p2, p2 > 0 ? pct(r.vout, p2) : ''); }
      // nitrogen 78 = 78
      { const r = rows[2], p1 = P(t, mid('nitrogen', 0.12), 1.3, easeOut), p2 = P(t, mid('nitrogen', 0.3), 1.3, easeOut);
        setBar(r.bIn, r.vIn, r.vin * SC * p1, p1 > 0 ? pct(r.vin, p1) : ''); setBar(r.bOut, r.vOut, r.vout * SC * p2, p2 > 0 ? pct(r.vout, p2) : ''); }
      // water vapour low -> high
      { const r = rows[3], p1 = P(t, mid('water', 0.05), 0.6, easeOut), p2 = P(t, mid('water', 0.2), 0.8, easeOut);
        setBar(r.bIn, r.vIn, r.vin * SC * p1, 'low'); op(r.vIn, p1); setBar(r.bOut, r.vOut, r.vout * SC * p2, 'high'); op(r.vOut, p2); }
      // "still holds plenty of oxygen": the 16 % bar glows
      op(halo16, win(t, at('cpr') - 0.1, mid('cpr', 0.36), 0.3) * (1 - 0.45 * calm * wave(t, 0.8)));
    }

    /* --- rescue breaths --- */
    const aC = vis(t, mid('cpr', 0.2), at('cotwo') - 0.1, 0.45);
    op(cpr, aC);
    if (aC > 0) {
      popAt(cprChip, 1005, 380, t, mid('cpr', 0.24));
      riseAt(cprNote, 896, 446, t, mid('cpr', 0.62));
      const b0 = mid('cpr', 0.42), per = 2.1;
      const nb = t < b0 ? -1 : Math.min(2, Math.floor((t - b0) / per));
      o2dots.forEach((d, k) => {
        let best = -1;
        for (let j = 0; j <= Math.max(0, nb); j++) { const u = (t - b0 - j * per) / 1.7 - k * 0.07; if (u > 0 && u < 1) best = u; }
        if (best < 0 || t < b0) { op(d, 0); return; }
        const q = along(dotPath[k], ease(best)); attr(d, 'cx', q[0]); attr(d, 'cy', q[1]);
        op(d, Math.min(1, best * 6, (1 - best) * 5));
      });
      const ap = P(t, mid('cpr', 0.8), 1.0, easeOut);
      op(amb, ap); tr(amb, lerp(1230, 1092, ap), 296);
      op(ambLight, ap * (wave(t, 0.5) > 0.5 ? 1 : 0.15));
      const fed = P(t, b0 + 1.1, 3.5, linear);
      op(patGlow, fed * (0.8 - 0.25 * calm * wave(t, 2.1)));
    }

    /* --- carbon dioxide, magnified --- */
    const aL = vis(t, mid('cotwo', 0.14), at('nitrogen') + 0.1, 0.45);
    op(lensG, aL);
    if (aL > 0) {
      const lp = P(t, mid('cotwo', 0.14), 0.6, easeOut);
      tr(lens, LX, LY, 0.7 + 0.3 * lp);
      op(zIn, P(t, mid('cotwo', 0.1), 0.4, linear)); op(zvIn, P(t, mid('cotwo', 0.14), 0.4, linear));
      const p2 = P(t, mid('cotwo', 0.4), 0.9, easeOut), w2 = 4 * SC * LZ * p2;
      attr(zOut, 'width', w2); attr(zvOut, 'x', LB + w2 + 12); op(zvOut, p2); setText(zvOut, pct(4, p2));
      zArc.set(P(t, mid('cotwo', 0.62), 0.6)); op(zArc, P(t, mid('cotwo', 0.62), 0.2, linear));
      popAt(x100, 0, 92, t, mid('cotwo', 0.66));
    }

    /* --- nitrogen: unchanged --- */
    { const p = clamp((t - mid('nitrogen', 0.55)) / 0.5), a = clamp(p * 2.5) * (1 - P(t, at('water') - 0.1, 0.4, linear));
      op(same, a); if (a > 0) tr(same, 990, ROWY[2], Math.max(0.01, pop(p))); }

    /* --- water vapour and warmth: one breather --- */
    const aS = vis(t, at('water') - 0.05, at('lime') - 0.15, 0.45);
    op(side, aS);
    const aW = vis(t, at('water') - 0.05, at('warm') - 0.1, 0.45), aT = vis(t, at('warm') - 0.1, at('lime') - 0.15, 0.45);
    op(winG, aW); op(thG, aT);
    if (aS > 0) {
      const pf0 = mid('water', 0.45), pf1 = mid('warm', 0.18);
      const breathing = (t > pf0 && t < end('water') + 0.2) || t > pf1;
      const warmNow = t > pf1, tb = warmNow ? pf1 : pf0, target = warmNow ? [TX - 24, TYB - 4] : [WX - GW + 8, WY + 12];
      [puffs, puffsW].forEach((set, si) => set.forEach((pf, k) => {
        const u = ((t - tb) / 1.5 + k / 3) % 1;
        if (!breathing || t < tb || (si === 1) !== warmNow) { op(pf, 0); return; }
        const x = lerp(sMouth[0], target[0], u), y = lerp(sMouth[1], target[1], u) - Math.sin(u * Math.PI) * 10;
        tr(pf, x, y, 0.5 + 0.8 * u); op(pf, Math.min(1, u * 5) * (1 - u * 0.7));
      }));
      attr(headS.mouth, 'ry', breathing ? 40 * 0.15 : 40 * 0.05);
      if (aW > 0) {
        const f = P(t, pf0 + 0.6, 1.8, easeOut);
        op(fog, f * 0.95); fog.setAttribute('transform', `translate(${WX - 34} ${WY + 14}) scale(${(0.35 + 0.65 * f).toFixed(3)}) translate(${-(WX - 34)} ${-(WY + 14)})`);
        drops.forEach((d, k) => op(d, P(t, pf0 + 1.6 + k * 0.08, 0.4, linear) * 0.85));
      }
      if (aT > 0) {
        th.set(lerp(0.32, 0.56, P(t, pf1 + 0.5, 1.4, ease)));
        thHot.upd(t); op(thHot, P(t, pf1 + 0.3, 0.5, linear) * 0.9);
        op(thLab, P(t, mid('warm', 0.45), 0.4, linear));
      }
    }

    /* ================= B. limewater ================= */
    const aB = vis(t, at('lime') - 0.1, at('test') - 0.1, 0.5);
    op(lime, aB);
    if (aB > 0) {
      const flowOn = mid('lime', 0.38);
      lCO2.forEach((m, k) => {
        const u = ((t - flowOn) / 2.2 + k / 3) % 1;
        if (t < flowOn) { op(m, 0); return; }
        const q = along(limePath, u); tr(m, q[0], q[1]); op(m, Math.min(1, u * 8, (1 - u) * 8));
      });
      lBub.upd(t, P(t, flowOn + 0.6, 0.5, linear));
      const milk = P(t, mid('lime', 0.5), 2.6, ease);
      ltube.set(0.6, limeCol(milk));
      op(limeLab, P(t, mid('lime', 0.12), 0.5, linear));
      const ac = P(t, mid('lime', 0.28), 0.5, pop);
      op(stClear, clamp(ac * 2) * (1 - clamp((milk - 0.5) / 0.2))); tr(stClear, ST[0] + stClear.w / 2, ST[1], Math.max(0.01, ac));
      op(stMilky, clamp((milk - 0.5) / 0.2)); tr(stMilky, ST[0] + stMilky.w / 2, ST[1]);
    }

    /* ================= C. breathed-out air vs room air ================= */
    const aT2 = P(t, at('test') - 0.1, 0.5, linear);
    op(test, aT2);
    if (aT2 > 0) {
      const t0 = mid('test', 0.06), per = 2.6;
      const ph = t < t0 ? -1 : ((t - t0) / per) % 1;
      const out = ph >= 0 && ph < 0.5, inn = ph >= 0.5;
      const env = ph < 0 ? 0 : Math.sin((ph % 0.5) / 0.5 * Math.PI);
      bubL.upd(t, out ? env : 0); bubR.upd(t, inn ? env * P(t, mid('test', 0.28), 0.4, linear) : 0);
      attr(faceT.mouth, 'ry', 46 * (0.1 + (out ? 0.1 * env : 0)));
      const sOut = P(t, mid('test', 0.02), 0.4, linear), sIn = P(t, mid('test', 0.28), 0.4, linear);
      op(brOut, sOut * (0.35 + 0.65 * (out ? env : 0))); op(brIn, sIn * (0.35 + 0.65 * (inn ? env : 0)));
      airDots.forEach((d, k) => {
        if (ph < 0) { op(d, 0); return; }
        const local = (ph % 0.5) / 0.5, u = (local + k / 8 * 0.5) % 1;
        if (out) { const q = k < 5 ? along(blowP, u) : along(exhP, u); attr(d, 'cx', q[0]); attr(d, 'cy', q[1]); op(d, env * 0.9 * (k < 5 ? 1 : 0.8)); }
        else { const q = k < 5 ? along(inletP, u) : along(drawP, u); attr(d, 'cx', q[0]); attr(d, 'cy', q[1]); op(d, env * 0.9 * P(t, mid('test', 0.28), 0.4, linear)); }
      });
      // milkiness: breathed-out air fast, room air hardly at all
      const mL = P(t, mid('test', 0.36), 3.0, ease), mR = 0.1 * P(t, mid('test', 0.36), 8, linear);
      tubeL.set(0.6, limeCol(mL)); tubeR.set(0.6, limeCol(mR));
      // timers start together; the left one stops when its limewater is milky
      const k4 = 4, tStop = mid('test', 0.36) + 3.0;
      swL.set(Math.max(0, (Math.min(t, tStop) - t0) * k4)); swR.set(Math.max(0, (t - t0) * k4));
      op(swL, P(t, at('test'), 0.4, linear)); op(swR, P(t, mid('test', 0.25), 0.4, linear));
      op(labL, P(t, mid('test', 0.04), 0.4, linear)); op(labR, P(t, mid('test', 0.3), 0.4, linear));
      const dl = P(t, tStop - 0.05, 0.5, pop);
      op(doneL, clamp(dl * 2)); tr(doneL, 214, 566, Math.max(0.01, dl));
      op(swRing, clamp(dl * 2) * (1 - 0.4 * calm * wave(t, 1.1)));
      riseAt(waitR, 986, 566, t, tStop + 0.3);
      // "That proves..."
      const pr = P(t, at('proves') - 0.05, 0.55, pop);
      op(proof, clamp(pr * 2)); tr(proof, 600, 470, Math.max(0.01, 0.85 + 0.15 * pr));
      const tk = P(t, at('proves') + 0.35, 0.4, pop); op(ptk, clamp(tk * 2)); tr(ptk, -112, -26, Math.max(0.01, tk));
    }
  };
});
