/* Chapter 5, Convection: currents in fluids.
   The three ways, Convection lit -> fluids: liquids and gases flow -> the warm fluid itself moves
   -> a pan on a Bunsen: the bottom water warms, spreads out, expands, rises; cool water sinks;
   the top cools and sinks -> the full convection current (showpiece) -> Hot Air Lifts (less dense,
   not 'lighter') -> no convection in solids -> radiator room -> sea breeze -> spinning paper spiral. */
scene('convection', S => {
  const { at, end, mid } = S, root = S.root;
  const calm = S.reduce ? 0.45 : 1;

  /* ---------- local helpers ---------- */
  function rich(parent, x, y, segs, o) {
    o = o || {};
    const t = E('text', { x, y, 'font-size': o.size || 30, 'font-weight': o.weight || 600, 'font-family': o.font || FD, 'text-anchor': o.anchor || 'start', fill: o.fill || C.ink }, parent);
    segs.forEach(s => { if (typeof s === 'string') s = [s]; E('tspan', { fill: s[1], 'font-weight': s[2] }, t).textContent = s[0]; });
    return t;
  }
  const smooth = x => { x = clamp(x); return x * x * (3 - 2 * x); };
  const hex = c => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16));
  const CB = hex(C.water), CO = hex(C.heat);
  const mixHeat = f => `rgb(${CB.map((v, i) => Math.round(lerp(v, CO[i], clamp(f)))).join(',')})`;
  const BLUE = ball(C.water, C.waterDk), ORANGE = ball(C.heat, C.heatDk);
  /* a particle of water or air tinted blue (cool) -> orange (warm): g.set(h 0..1) */
  function heatBall(parent, r) {
    const g = G(parent);
    E('circle', { r, fill: BLUE }, g);
    const o = E('circle', { r, fill: ORANGE }, g);
    g.set = h => op(o, clamp(h / 0.55));
    g.set(0);
    return g;
  }
  /* a flow of thermal energy: orange arrow (head travels with the tip) with heat shimmer. g.draw(t, p) */
  function flowArrow(parent, x1, y1, x2, y2, o) {
    o = o || {};
    const g = G(parent), w = o.width || 9, col = o.color || C.heat, hs = o.head || w * 3.4;
    const L = Math.hypot(x2 - x1, y2 - y1), ang = Math.atan2(y2 - y1, x2 - x1), ca = Math.cos(ang), sa = Math.sin(ang);
    const line = E('path', { fill: 'none', stroke: col, 'stroke-width': w, 'stroke-linecap': 'round' }, g);
    const head = E('path', { d: `M0,0 L${-hs},${-hs * 0.62} L${-hs * 0.72},0 L${-hs},${hs * 0.62} Z`, fill: col, 'stroke-linejoin': 'round' }, g);
    const off = (o.side || 1) * (w / 2 + 13), nx = Math.sin(ang), ny = -Math.cos(ang);
    const n = o.waves === false ? 0 : Math.max(1, Math.round(L / 210)), seg = L / n, hh = Math.min(seg * 0.5, 80), ws = [];
    for (let k = 0; k < n; k++) {
      const f = (k * seg + seg * 0.18) / L;
      const hw = heatWaves(g, { n: 2, h: hh, spacing: 11, width: 4.5, color: o.wcol || '#FFB47A', speed: 0.75 });
      hw.setAttribute('transform', `translate(${(x1 + ca * L * f + nx * off).toFixed(1)} ${(y1 + sa * L * f + ny * off).toFixed(1)}) rotate(${(ang * 180 / Math.PI + 90).toFixed(1)})`);
      ws.push({ hw, f: f + hh * 1.2 / L });
    }
    g.draw = (t, p) => {
      p = clamp(p);
      const d = Math.max(hs * 0.9, L * p), ex = x1 + ca * d, ey = y1 + sa * d;
      line.setAttribute('d', `M${x1},${y1} L${(ex - ca * hs * 0.7).toFixed(1)},${(ey - sa * hs * 0.7).toFixed(1)}`);
      head.setAttribute('transform', `translate(${ex.toFixed(1)} ${ey.toFixed(1)}) rotate(${(ang * 180 / Math.PI).toFixed(2)})`);
      op(line, p > 0.01 ? 1 : 0); op(head, clamp(p * 12));
      ws.forEach((q, k) => { const v = clamp((p - q.f) / 0.12); op(q.hw, v); if (v > 0) q.hw.upd(t + k * 0.37); });
    };
    g.draw(0, 1);
    return g;
  }
  /* colour the **bold** words of a chip */
  const hiBold = (c, col) => c.label.querySelectorAll('tspan[font-weight="800"]').forEach(s => s.setAttribute('fill', col));
  /* a convection current around the box x0..x1, y0..y1 (rounded corners), rising on the `rise` side.
     Chevrons and tracer particles circulate, orange where warm and blue where cool. g.set(t, reveal) */
  function convLoop(parent, x0, y0, x1, y1, o) {
    o = o || {};
    const g = G(parent), rc = o.rc || 50, pts = [], marks = [];
    const line = (ax, ay, bx, by) => { const n = Math.max(2, Math.ceil(Math.hypot(bx - ax, by - ay) / 10)); for (let i = 0; i < n; i++) pts.push([lerp(ax, bx, i / n), lerp(ay, by, i / n)]); };
    const arc = (cx, cy, a0, a1) => { for (let i = 0; i < 8; i++) { const a = lerp(a0, a1, i / 8); pts.push([cx + rc * Math.cos(a), cy + rc * Math.sin(a)]); } };
    const H = Math.PI / 2;
    if (o.rise === 'left') {
      line(x0, y1 - rc, x0, y0 + rc); arc(x0 + rc, y0 + rc, Math.PI, 3 * H);
      marks.push(pts.length); line(x0 + rc, y0, x1 - rc, y0); arc(x1 - rc, y0 + rc, -H, 0);
      marks.push(pts.length); line(x1, y0 + rc, x1, y1 - rc); arc(x1 - rc, y1 - rc, 0, H);
      marks.push(pts.length); line(x1 - rc, y1, x0 + rc, y1); arc(x0 + rc, y1 - rc, H, Math.PI);
    } else {
      line(x1, y1 - rc, x1, y0 + rc); arc(x1 - rc, y0 + rc, 0, -H);
      marks.push(pts.length); line(x1 - rc, y0, x0 + rc, y0); arc(x0 + rc, y0 + rc, -H, -Math.PI);
      marks.push(pts.length); line(x0, y0 + rc, x0, y1 - rc); arc(x0 + rc, y1 - rc, Math.PI, H);
      marks.push(pts.length); line(x0 + rc, y1, x1 - rc, y1); arc(x1 - rc, y1 - rc, H, 0);
    }
    const cum = [0];
    for (let i = 1; i <= pts.length; i++) { const a = pts[i - 1], b = pts[i % pts.length]; cum.push(cum[i - 1] + Math.hypot(b[0] - a[0], b[1] - a[1])); }
    const L = cum[pts.length], [fa, fb, fc] = marks.map(i => cum[i] / L);
    const NT = 240, tab = [];
    for (let k = 0, i = 0; k < NT; k++) {
      const s = k / NT * L;
      while (cum[i + 1] < s) i++;
      const a = pts[i], b = pts[(i + 1) % pts.length], f = (s - cum[i]) / ((cum[i + 1] - cum[i]) || 1);
      tab.push([lerp(a[0], b[0], f), lerp(a[1], b[1], f), Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI]);
    }
    const warmth = u => u < fa ? 1 : u < fb ? lerp(1, 0.3, (u - fa) / (fb - fa)) : u < fc ? lerp(0.3, 0, (u - fb) / (fc - fb)) : 0.9 * Math.pow((u - fc) / (1 - fc), 2.2);
    const track = E('path', { d: 'M' + pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' L') + 'Z', fill: 'none', stroke: 'rgba(159,216,255,0.09)', 'stroke-width': o.track || 30, 'stroke-linejoin': 'round', pathLength: 1, 'stroke-dasharray': '1 1' }, g);
    const n = o.n || 6, cs = o.chev || 1.35, chevs = [], balls = [];
    for (let k = 0; k < n; k++) {
      chevs.push(E('path', { d: `M${11 * cs},0 L${-8 * cs},${-12 * cs} L${-3 * cs},0 L${-8 * cs},${12 * cs} Z`, 'stroke-linejoin': 'round' }, g));
      balls.push(heatBall(g, o.r || 9));
    }
    const sp = o.speed || 90;
    g.set = (t, rv) => {
      rv = rv === undefined ? 1 : rv;
      track.setAttribute('stroke-dashoffset', (1 - clamp(rv)).toFixed(4));
      const base = t * sp / L;
      for (let k = 0; k < n; k++) {
        const u1 = (((k / n + base) % 1) + 1) % 1, u2 = (((k + 0.5) / n + base) % 1 + 1) % 1;
        const q1 = tab[Math.floor(u1 * NT) % NT], q2 = tab[Math.floor(u2 * NT) % NT];
        const c = chevs[k], b = balls[k];
        op(c, u1 <= rv ? 1 : 0);
        if (u1 <= rv) { c.setAttribute('transform', `translate(${q1[0].toFixed(1)} ${q1[1].toFixed(1)}) rotate(${q1[2].toFixed(1)})`); c.setAttribute('fill', mixHeat(smooth((warmth(u1) - 0.3) / 0.4))); }
        op(b, u2 <= rv ? 1 : 0);
        if (u2 <= rv) { tr(b, q2[0], q2[1]); b.set(warmth(u2)); }
      }
    };
    g.set(0, 0);
    return g;
  }
  /* a parcel of water: a wobbly outline round 7 particles. g.set(t, heat, spread) */
  function parcel(parent, seed) {
    const g = G(parent);
    const blob = E('path', { 'fill-opacity': 0.26, 'stroke-width': 3, 'stroke-dasharray': '7 6' }, g);
    const ps = [];
    for (let k = 0; k < 7; k++) ps.push({ b: heatBall(g, 9), a: k ? (k - 1) * TAU / 6 + 0.3 : 0, ph: k * 1.7 });
    g.set = (t, heat, spread) => {
      const R = spread + 23, col = mixHeat(smooth((heat - 0.15) / 0.5));
      blob.setAttribute('d', closedPath(blobPts(R, R * 0.92, 12, t, 0.05, seed)));
      blob.setAttribute('fill', col); blob.setAttribute('stroke', col);
      const jig = (1 + 3.5 * heat) * calm;
      ps.forEach(p => {
        const r = p.a === 0 && p.ph === 0 ? 0 : spread;
        tr(p.b, Math.cos(p.a + t * 0.3) * r + jig * Math.sin(t * 7 + p.ph), Math.sin(p.a + t * 0.3) * r + jig * Math.cos(t * 6 + p.ph));
        p.b.set(heat);
      });
    };
    g.set(0, 0, 18);
    return g;
  }
  function radiatorArt(parent, w, h) {               // front view, bottom centre at (0,0)
    const g = G(parent), n = Math.max(3, Math.round(w / 24));
    g.glow = E('ellipse', { cx: 0, cy: -h, rx: w * 0.75, ry: 34, fill: glow(C.heat) }, g);
    E('rect', { x: -w / 2 + 8, y: 0, width: 10, height: 12, rx: 3, fill: '#8C9BA8' }, g);
    E('rect', { x: w / 2 - 18, y: 0, width: 10, height: 12, rx: 3, fill: '#8C9BA8' }, g);
    E('rect', { x: -w / 2, y: -h, width: w, height: h, rx: 10, fill: linGrad('#F4F7FA', '#B5C3CF', true), stroke: '#FFFFFF', 'stroke-width': 2 }, g);
    let d = ''; for (let k = 1; k < n; k++) { const x = -w / 2 + k * w / n; d += `M${x.toFixed(1)},${-h + 10} L${x.toFixed(1)},-10 `; }
    E('path', { d, stroke: '#95A5B3', 'stroke-width': 3, 'stroke-linecap': 'round' }, g);
    return g;
  }

  /* ================= title: the three ways, Convection lit ================= */
  const top = G(root);
  const WAYS = ['Conduction', 'Convection', 'Radiation'], WX = [330, 600, 870], WY = 190, ME = 1;
  const ways = WAYS.map(w => {
    const g = G(top);
    const dim = chip(g, w, { size: 30, fill: C.card, stroke: C.line, color: C.muted });
    const lit = chip(g, w, { size: 30, fill: C.card2, stroke: C.energy, color: C.energy });
    return { g, dim, lit, w: lit.w };
  });

  /* ================= A1. fluids flow ================= */
  const A1 = G(root);
  const fluidChip = chip(A1, '**fluids**: they can flow', { size: 30, fill: C.card2, stroke: C.line });
  tr(fluidChip, 600, 278); hiBold(fluidChip, C.energy);
  const bkG = G(A1);
  const bk = beaker(bkG, 170, 190, { level: 0.72 }); tr(bk, 420, 430);
  const liq = particleBox(bkG, 140, 100, { n: 30, r: 9, box: false, state: 'liquid', seed: 5 }); tr(liq, 350, 412);
  const airG = G(A1);
  E('path', { d: closedPath(blobPts(132, 86, 14, 0, 0.13, 9)), fill: 'rgba(159,216,255,0.07)', stroke: C.air, 'stroke-width': 3, 'stroke-dasharray': '10 8', transform: 'translate(780 430)' }, airG);
  const gas = particleBox(airG, 200, 120, { n: 9, r: 9, box: false, state: 'gas', color: C.air, dark: '#4C94C8', seed: 8 }); tr(gas, 680, 370);
  const flowL = arrow(A1, 352, 574, 488, 574, { bend: -16, color: C.water, width: 5 });
  const flowR = arrow(A1, 712, 574, 848, 574, { bend: -16, color: C.air, width: 5 });
  const lbLiq = T(A1, 420, 628, 'liquids', { size: 30, anchor: 'middle' });
  const lbGas = T(A1, 780, 628, 'gases', { size: 30, anchor: 'middle' });

  /* ================= A2. the warm fluid itself moves ================= */
  const A2 = G(root);
  const tall = beaker(A2, 200, 320, { level: 0.85 }); tr(tall, 400, 445);
  const pM = parcel(A2, 4);
  const pMspark = spark(A2, 18, { seed: 3 });
  const upArrow = flowArrow(A2, 470, 578, 470, 378, { width: 8, side: -1 });
  const movesLbl = rich(A2, 400, 668, ['the warm fluid itself ', ['moves', C.heat, 800]], { size: 30, anchor: 'middle' });
  const inset = G(A2);
  card(inset, 690, 300, 420, 270, { fill: C.card, stroke: C.line });
  T(inset, 900, 350, 'Conduction', { size: 28, weight: 700, anchor: 'middle', fill: C.muted });
  const inBalls = [];
  for (let k = 0; k < 6; k++) inBalls.push(heatBall(inset, 15));
  T(inset, 900, 528, 'particles stay put', { size: 28, anchor: 'middle', fill: C.muted });

  /* ================= B. the pan ================= */
  const B = G(root);
  const PX0 = 200, PX1 = 720, PS = 258, PB = 500, PCX = 460;
  const bunB = bunsen(B, 0.7); tr(bunB, PCX, 682);
  E('rect', { x: 92, y: 243, width: 100, height: 18, rx: 9, fill: '#39424B', stroke: '#5C6873', 'stroke-width': 2 }, B);
  E('rect', { x: PX0, y: PS, width: PX1 - PX0, height: PB - PS, fill: 'rgba(76,201,240,0.26)' }, B);
  const botGlow = E('ellipse', { cx: PCX, cy: PB - 6, rx: 150, ry: 50, fill: glow(C.heat) }, B);
  E('line', { x1: PX0, y1: PS, x2: PX1, y2: PS, stroke: '#BFEAFA', 'stroke-width': 3, opacity: 0.6 }, B);
  E('path', { d: `M${PX0 - 7},232 L${PX0 - 7},${PB + 7} L${PX1 + 7},${PB + 7} L${PX1 + 7},232`, fill: 'none', stroke: linGrad('#A9B5C1', '#6A7784', false), 'stroke-width': 14, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, B);
  const warmCol = E('ellipse', { cx: PCX, cy: 390, rx: 70, ry: 150, fill: glow(C.heat) }, B);
  const pW = parcel(B, 3), pC = parcel(B, 5);
  const loopL = convLoop(B, 222, 292, 440, 470, { rise: 'right', rc: 52, n: 6, speed: 85 });
  const loopR = convLoop(B, 480, 292, 698, 470, { rise: 'left', rc: 52, n: 6, speed: 85 });
  const expLbl = T(B, 530, 452, 'expands', { size: 30, fill: C.heat });
  const riseLbl = T(B, 530, 336, 'rises', { size: 30, fill: C.heat });
  const sinkLbl = T(B, 332, 404, 'sinks', { size: 30, fill: C.water });
  const coolLbl = T(B, 610, 222, 'cools, then sinks', { size: 30, anchor: 'middle', fill: C.water });
  // density inset: the same space, fewer particles when warm
  const den = G(B);
  T(den, 950, 280, 'the same space', { size: 26, anchor: 'middle', fill: C.muted });
  E('rect', { x: 790, y: 300, width: 150, height: 150, rx: 14, fill: 'rgba(76,201,240,0.10)', stroke: C.water, 'stroke-width': 3 }, den);
  E('rect', { x: 960, y: 300, width: 150, height: 150, rx: 14, fill: 'rgba(255,138,61,0.10)', stroke: C.heat, 'stroke-width': 3 }, den);
  const coolPs = [], warmPs = [], dr = rng(51);
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) coolPs.push({ el: E('circle', { r: 14, fill: BLUE }, den), x: 814 + c * 34, y: 324 + r * 34, ph: dr() * TAU });
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) warmPs.push({ el: E('circle', { r: 14, fill: ORANGE }, den), x: 990 + c * 45, y: 330 + r * 45, ph: dr() * TAU });
  T(den, 865, 488, 'cool water', { size: 26, anchor: 'middle', fill: C.muted });
  T(den, 1035, 488, 'warm water', { size: 26, anchor: 'middle', fill: C.muted });
  const denserLbl = T(den, 865, 530, 'denser', { size: 30, weight: 700, anchor: 'middle', fill: C.water });
  const lessLbl = T(den, 1035, 530, 'less dense', { size: 30, weight: 700, anchor: 'middle', fill: C.heat });
  const curLbl = G(B);
  T(curLbl, 945, 352, 'convection', { size: 40, weight: 700, anchor: 'middle' });
  T(curLbl, 945, 398, 'current', { size: 40, weight: 700, anchor: 'middle' });
  const legend = G(curLbl);
  [[C.heat, 'warm water rises', 466], [C.water, 'cool water sinks', 516]].forEach(([col, txt, y]) => {
    E('path', { d: 'M11,0 L-8,-12 L-3,0 L-8,12 Z', fill: col, transform: `translate(812 ${y - 9}) rotate(${col === C.heat ? -90 : 90})` }, legend);
    T(legend, 840, y, txt, { size: 28, fill: col });
  });

  /* ================= C1. Hot Air Lifts ================= */
  const C1 = G(root);
  const halChip = chip(C1, '**H**ot **A**ir **L**ifts', { size: 34, fill: C.card2, stroke: C.energy });
  tr(halChip, 600, 172); hiBold(halChip, C.energy);
  const sky = G(C1), ar = rng(88), outside = [];
  for (let k = 0; k < 50; k++) outside.push({ el: E('circle', { r: 8, fill: BLUE }, sky), x: 70 + ar() * 520, y: 236 + ar() * 470, ph: ar() * TAU });
  const bal = G(C1);
  const ENV = 'M0,-282 C72,-282 118,-232 118,-170 C118,-112 74,-72 34,-42 L-34,-42 C-74,-72 -118,-112 -118,-170 C-118,-232 -72,-282 0,-282 Z';
  E('path', { d: ENV, fill: 'rgba(255,107,92,0.22)', stroke: '#FF8A7A', 'stroke-width': 4 }, bal);
  E('path', { d: 'M0,-282 C-44,-250 -52,-120 -16,-42 M0,-282 C44,-250 52,-120 16,-42', fill: 'none', stroke: '#FFC247', 'stroke-width': 4, opacity: 0.8 }, bal);
  const balGlow = E('ellipse', { cx: 0, cy: -150, rx: 100, ry: 110, fill: glow('#FFB347') }, bal);
  const inside = [[-55, -200], [40, -225], [-10, -150], [62, -140], [-62, -112], [18, -96]].map(([x, y], k) => ({ el: E('circle', { r: 8, fill: ORANGE }, bal), x, y, ph: k * 1.3 }));
  E('path', { d: 'M-34,-42 L-22,-2 M34,-42 L22,-2 M-12,-42 L-9,-2 M12,-42 L9,-2', stroke: '#D9C49A', 'stroke-width': 2.5 }, bal);
  const burner = E('path', { d: 'M0,-10 C-9,-20 -7,-34 0,-48 C7,-34 9,-20 0,-10 Z', fill: '#FFB13B', stroke: '#FFE07A', 'stroke-width': 2 }, bal);
  E('rect', { x: -27, y: -4, width: 54, height: 42, rx: 6, fill: '#A8743F', stroke: '#E0B07A', 'stroke-width': 2.5 }, bal);
  E('path', { d: 'M-27,10 L27,10 M-27,23 L27,23 M-13,-4 L-13,38 M0,-4 L0,38 M13,-4 L13,38', stroke: '#7E5228', 'stroke-width': 2 }, bal);
  const exam = G(C1);
  card(exam, 640, 300, 510, 280, { fill: C.card, stroke: C.line });
  T(exam, 672, 352, 'In an exam, say:', { size: 28, fill: C.muted });
  const row1 = G(exam), row2 = G(exam);
  const tk1 = tick(row1, 16); tr(tk1, 694, 414);
  rich(row1, 728, 426, ['warm fluid is ', ['less dense', C.good, 800]], { size: 32 });
  const cx2 = cross(row2, 14); tr(cx2, 694, 500);
  const lightT = T(row2, 728, 512, 'just ‘lighter’', { size: 32, fill: C.muted });
  const lightS = strike(row2, 722, 500, 734 + textWidth('just ‘lighter’', 32, FD, 600), C.bad);

  /* ================= C2. no convection in solids ================= */
  const C2 = G(root);
  const conW = T(C2, 600, 262, 'convection', { size: 52, weight: 700, anchor: 'middle' });
  const conS = strike(C2, 600 - textWidth('convection', 52, FD, 700) / 2 - 14, 244, 600 + textWidth('convection', 52, FD, 700) / 2 + 14, C.bad);
  const sol = particleBox(C2, 300, 190, { n: 24, r: 15, state: 'solid', seed: 21 }); tr(sol, 450, 326);
  const noLoop = G(C2); tr(noLoop, 600, 421);
  E('path', { d: 'M-48,-46 A66,66 0 1 1 -66,8', fill: 'none', stroke: C.ink, 'stroke-width': 7, 'stroke-linecap': 'round', opacity: 0.9 }, noLoop);
  E('path', { d: 'M-80,-6 L-66,22 L-48,-2 Z', fill: C.ink, opacity: 0.9 }, noLoop);
  const noX = cross(noLoop, 30);
  const solLbl = rich(C2, 600, 600, ['particles locked in place: ', ['solids can’t flow', C.bad, 800]], { size: 30, anchor: 'middle' });

  /* ================= D. radiator room ================= */
  const D = G(root);
  E('rect', { x: 190, y: 170, width: 820, height: 440, rx: 6, fill: 'rgba(255,255,255,0.03)', stroke: '#5C7487', 'stroke-width': 14, 'stroke-linejoin': 'round' }, D);
  E('rect', { x: 197, y: 586, width: 806, height: 17, fill: '#8A5629' }, D);
  const win_ = G(D);
  E('rect', { x: 750, y: 270, width: 110, height: 120, rx: 6, fill: 'rgba(159,216,255,0.16)', stroke: '#BFD9E6', 'stroke-width': 5 }, win_);
  E('path', { d: 'M805,272 L805,388 M752,330 L858,330', stroke: '#BFD9E6', 'stroke-width': 4 }, win_);
  const rad = radiatorArt(D, 120, 92); tr(rad, 275, 584);
  const radWaves = heatWaves(D, { n: 3, h: 70, spacing: 18, color: '#FFB47A' }); tr(radWaves, 258, 484);
  const loopRoom = convLoop(D, 300, 228, 930, 562, { rise: 'left', rc: 80, n: 10, speed: 150, track: 34 });
  const radLbl = T(D, 275, 660, 'radiator', { size: 28, anchor: 'middle' });
  const roomUp = T(D, 330, 318, 'warm air rises', { size: 28, fill: C.heat });
  const roomDn = T(D, 904, 512, 'cool air sinks', { size: 28, anchor: 'end', fill: C.water });
  const roomCur = T(D, 600, 432, 'convection current', { size: 36, weight: 700, anchor: 'middle' });

  /* ================= E. the coast: a sea breeze ================= */
  const Ec = G(root);
  const landGlow = E('ellipse', { cx: 300, cy: 540, rx: 330, ry: 90, fill: glow(C.heat) }, Ec);
  E('path', { d: 'M0,520 L590,520 C615,522 628,540 640,560 L640,750 L0,750 Z', fill: linGrad('#E9C98B', '#C29659', true) }, Ec);
  E('rect', { x: 618, y: 538, width: 582, height: 212, fill: linGrad('#2F8FC0', '#14527A', true) }, Ec);
  const surf = sineWave(Ec, { w: 580, amp: 4, wl: 60, color: '#A8E6F8', width: 3 }); tr(surf, 620, 538);
  const sunG = sun(Ec, 46); tr(sunG, 680, 165);
  const rayL = G(Ec), rayS = G(Ec);
  const wL = sineWave(rayL, { w: 300, amp: 9, wl: 42, color: C.heat, width: 4 }); rayL.setAttribute('transform', `translate(626 216) rotate(${(Math.atan2(240, -250) * 180 / Math.PI).toFixed(1)})`);
  const wS = sineWave(rayS, { w: 270, amp: 9, wl: 42, color: C.heat, width: 4 }); rayS.setAttribute('transform', `translate(730 216) rotate(${(Math.atan2(260, 160) * 180 / Math.PI).toFixed(1)})`);
  const thLand = thermometer(Ec, 160, C.bad); tr(thLand, 150, 552);
  const thSea = thermometer(Ec, 160, C.bad); tr(thSea, 1050, 576);
  const landFast = T(Ec, 150, 366, 'warms faster', { size: 28, anchor: 'middle', fill: C.heat });
  const seaSlow = T(Ec, 1050, 390, 'warms slower', { size: 28, anchor: 'middle', fill: C.water });
  T(Ec, 300, 652, 'land', { size: 34, weight: 700, anchor: 'middle', fill: '#4A3210' });
  T(Ec, 900, 662, 'sea', { size: 34, weight: 700, anchor: 'middle' });
  const flagG = G(Ec);
  E('line', { x1: 500, y1: 524, x2: 500, y2: 392, stroke: '#E9EEF2', 'stroke-width': 5, 'stroke-linecap': 'round' }, flagG);
  const pennant = G(flagG);
  const penPath = E('path', { fill: C.bad, stroke: '#FFC2C8', 'stroke-width': 2, 'stroke-linejoin': 'round' }, pennant);
  const loopSea = convLoop(Ec, 330, 268, 880, 494, { rise: 'left', rc: 70, n: 8, speed: 130, track: 32 });
  const airUp = T(Ec, 366, 352, 'warm air rises', { size: 28, fill: C.heat });
  const breezeLbl = T(Ec, 652, 462, 'sea breeze', { size: 40, weight: 700, anchor: 'middle', fill: C.air });

  /* ================= F. try it at home: the spinning spiral ================= */
  const F = G(root);
  const homeChip = chip(F, 'Try it at home', { size: 30, fill: C.card2, stroke: C.energy, color: C.energy });
  tr(homeChip, 600, 160);
  const radF = radiatorArt(F, 320, 116); tr(radF, 600, 612);
  const fWaves = heatWaves(F, { n: 3, h: 48, spacing: 30, color: '#FFB47A' }); tr(fWaves, 600, 486);
  const fArrows = [520, 680].map(x => flowArrow(F, x, 484, x, 430, { width: 8, waves: false }));
  E('line', { x1: 600, y1: 200, x2: 600, y2: 242, stroke: '#E9EEF2', 'stroke-width': 2.5 }, F);
  E('circle', { cx: 600, cy: 200, r: 5, fill: '#E9EEF2' }, F);
  const spG = G(F);
  const spEdge = E('path', { fill: 'none', stroke: '#B98F4A', 'stroke-width': 14, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, spG);
  const spBody = E('path', { fill: 'none', stroke: '#FFE7B3', 'stroke-width': 9, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, spG);
  const snakeHead = G(spG);
  E('ellipse', { rx: 14, ry: 10, fill: '#FFE7B3', stroke: '#B98F4A', 'stroke-width': 3 }, snakeHead);
  E('circle', { cx: 4, cy: -2, r: 3, fill: C.bg0 }, snakeHead);
  const SPX = 600, SPY = 242, TURNS = 3.2, NSP = 84;
  const spiralPts = phi => { const p = []; for (let i = 0; i <= NSP; i++) { const f = i / NSP, a = f * TURNS * TAU + phi, r = 6 + 80 * f; p.push([SPX + r * Math.cos(a), SPY + 128 * f + 0.3 * r * Math.sin(a)]); } return p; };
  const spinLbl = T(F, 360, 330, 'it spins!', { size: 34, weight: 700, anchor: 'middle', fill: C.energy });
  const radFLbl = T(F, 600, 666, 'warm radiator', { size: 28, anchor: 'middle' });
  const never = G(F);
  const flameIc = G(never); tr(flameIc, 960, 372);
  E('path', { d: 'M0,-48 C26,-18 34,4 28,22 C22,40 8,48 0,48 C-8,48 -24,40 -28,22 C-32,6 -18,-8 -10,-24 C-8,-10 -2,-4 4,-2 C8,-16 4,-32 0,-48 Z', fill: C.heat, stroke: '#FFC27A', 'stroke-width': 3 }, flameIc);
  const nX = cross(never, 34); tr(nX, 960, 372);
  const neverChip = chip(never, 'never over a flame', { size: 28, fill: C.card2, stroke: C.bad }); tr(neverChip, 960, 470);

  /* ================= update ================= */
  return t => {
    /* ---- title chips ---- */
    ways.forEach((o, i) => {
      const p = P(t, mid('second', 0.02 + i * 0.07), 0.45, pop);
      if (i !== ME) {
        op(o.lit, 0);
        op(o.g, clamp(p * 2) * (1 - P(t, mid('second', 0.38), 0.5, linear)));
        tr(o.g, WX[i], WY, 0.85 + 0.15 * clamp(p));
        return;
      }
      const lit = P(t, mid('second', 0.2), 0.4, linear);
      op(o.g, clamp(p * 2)); op(o.lit, lit); op(o.dim, 1 - lit);
      const c = P(t, mid('second', 0.36), 0.8), h = P(t, at('moves') - 0.7, 0.8);
      tr(o.g, lerp(WX[i], 1160 - o.w * 0.45, h), lerp(WY, 60, h), lerp(lerp(1, 1.5, c), 0.9, h) * (0.85 + 0.15 * clamp(p)));
    });

    /* ---- A1. fluids ---- */
    const a1 = win(t, S.first - 0.5, at('moves') - 0.05, 0.45);
    op(A1, a1);
    if (a1 > 0) {
      const pc = P(t, mid('second', 0.45), 0.5, pop); op(fluidChip, clamp(pc * 2)); tr(fluidChip, 600, 278, 0.85 + 0.15 * clamp(pc));
      const pb = P(t, mid('second', 0.5), 0.5, pop), pa = P(t, mid('second', 0.6), 0.5, pop);
      op(bkG, clamp(pb * 2)); tr(bkG, 0, (1 - clamp(pb)) * 24); op(lbLiq, clamp(pb * 2));
      op(airG, clamp(pa * 2)); tr(airG, 0, (1 - clamp(pa)) * 24); op(lbGas, clamp(pa * 2));
      liq.set('liquid', t * calm, 0.5); gas.set('gas', t * calm, 0.35);
      flowL.set(P(t, mid('second', 0.82), 0.6)); op(flowL, P(t, mid('second', 0.82), 0.2, linear));
      flowR.set(P(t, mid('second', 0.86), 0.6)); op(flowR, P(t, mid('second', 0.86), 0.2, linear));
    }

    /* ---- A2. the warm fluid moves ---- */
    const a2 = win(t, at('moves') - 0.2, at('pan') - 0.05, 0.45);
    op(A2, a2);
    if (a2 > 0) {
      const up = P(t, mid('moves', 0.12), end('moves') - mid('moves', 0.12) + 0.2);
      const py = lerp(552, 405, up);
      tr(pM, 400, py); pM.set(t, 0.9, 24);
      op(pM, P(t, at('moves') - 0.1, 0.4, linear));
      tr(pMspark, 432, py - 40, 0.9 + 0.15 * wave(t, 0.9)); pMspark.upd(t); op(pMspark, P(t, at('moves'), 0.4, linear));
      upArrow.draw(t, P(t, mid('moves', 0.15), 1.4, easeOut));
      op(movesLbl, P(t, mid('moves', 0.4), 0.5, linear));
      op(inset, P(t, mid('moves', 0.2), 0.5, linear));
      const F0 = ((t * 0.45) % 1.4) * 6;          // a repeating vibration wave along the inset's fixed row
      inBalls.forEach((b, k) => {
        const h = smooth((F0 - k) / 1.2) * (1 - smooth((F0 - 6.5) / 1.5));
        b.set(h);
        tr(b, 735 + k * 66 + (1 + 5 * h) * calm * Math.sin(t * 18 + k * 1.9), 432 + (1 + 3 * h) * calm * Math.cos(t * 21 + k));
      });
    }

    /* ---- B. the pan ---- */
    const aB = win(t, at('pan') - 0.2, at('lifts') - 0.05, 0.45);
    op(B, aB);
    if (aB > 0) {
      bunB.set(t >= mid('pan', 0.12) ? 'blue' : 'off'); bunB.upd(t);
      op(botGlow, 0.9 * P(t, mid('pan', 0.2), 1.0, linear));
      const loopOn = P(t, at('loop') - 0.1, 0.6, linear);
      // the warm parcel: forms, spreads, swells; rises; cools at the top and sinks down the right side
      const form = P(t, mid('pan', 0.28), 0.6, linear), spread = P(t, mid('pan', 0.45), 1.6), swell = P(t, mid('pan', 0.7), 0.9);
      const rise = P(t, mid('dense', 0.3), end('dense') + 0.3 - mid('dense', 0.3));
      const across = P(t, at('cools') + 0.1, 1.5), cool = P(t, mid('cools', 0.15), 1.3), sink = P(t, mid('cools', 0.55), end('cools') + 0.3 - mid('cools', 0.55));
      const wx = lerp(PCX, 640, across), wy = lerp(lerp(446, 318, rise), 446, sink);
      tr(pW, wx, wy);
      pW.set(t, lerp(0.9 * form, 0, cool), lerp(lerp(17, 26, spread) + 4 * swell, 17, cool));
      op(pW, form * (1 - loopOn));
      // the cool parcel: slides down the left side, along the bottom, and is heated in turn
      const show = P(t, at('sinks') - 0.1, 0.4, linear), down = P(t, mid('sinks', 0.08), 1.8), inw = P(t, mid('sinks', 0.5), 1.3), heat = P(t, mid('sinks', 0.8), 1.2);
      tr(pC, lerp(280, PCX, inw), lerp(318, 446, down));
      pC.set(t + 2, 0.85 * heat, lerp(17, 27, heat));
      op(pC, show * (1 - loopOn));
      op(expLbl, win(t, mid('pan', 0.74), at('dense') + 0.1, 0.35));
      op(riseLbl, win(t, mid('dense', 0.3), at('sinks') + 0.1, 0.35));
      op(sinkLbl, win(t, mid('sinks', 0.15), at('cools') + 0.1, 0.35));
      op(coolLbl, win(t, mid('cools', 0.12), at('loop') + 0.1, 0.35));
      // density inset
      const dIn = win(t, at('dense') - 0.1, at('loop') + 0.1, 0.45);
      op(den, dIn);
      if (dIn > 0) {
        coolPs.forEach(p => { attr(p.el, 'cx', p.x + 1.5 * calm * Math.sin(t * 9 + p.ph)); attr(p.el, 'cy', p.y + 1.5 * calm * Math.cos(t * 8 + p.ph)); });
        warmPs.forEach(p => { attr(p.el, 'cx', p.x + 5 * calm * Math.sin(t * 5 + p.ph)); attr(p.el, 'cy', p.y + 5 * calm * Math.cos(t * 4.3 + p.ph)); });
        op(lessLbl, P(t, mid('dense', 0.15), 0.4, linear));
        op(denserLbl, P(t, mid('sinks', 0.2), 0.4, linear));
      }
      // the full convection current
      const rv = P(t, at('loop'), 1.6, linear);
      op(loopL, loopOn); op(loopR, loopOn); op(warmCol, 0.5 * loopOn * (0.8 + 0.2 * wave(t, 1.6)));
      if (loopOn > 0) { loopL.set(t, rv); loopR.set(t, rv); }
      op(curLbl, P(t, mid('loop', 0.5), 0.5, linear));
      op(legend, P(t, mid('loop', 0.75), 0.5, linear));
    }

    /* ---- C1. Hot Air Lifts ---- */
    const c1 = win(t, at('lifts') - 0.2, at('solids') - 0.05, 0.45);
    op(C1, c1);
    if (c1 > 0) {
      const pc = P(t, at('lifts') - 0.1, 0.5, pop); op(halChip, clamp(pc * 2)); tr(halChip, 600, 172, 0.85 + 0.15 * clamp(pc));
      const bp = P(t, mid('lifts', 0.12), 0.6, linear), lift = P(t, mid('lifts', 0.15), end('lifts') - mid('lifts', 0.15), ease);
      const bx = 330, by = lerp(642, 508, lift) + 4 * calm * Math.sin(t * 1.4);
      tr(bal, bx, by); op(bal, bp);
      op(balGlow, 0.65 + 0.3 * wave(t, 0.8)); tr(burner, 0, 0, 1 + 0.12 * Math.sin(t * 11));
      inside.forEach(q => tr(q.el, q.x + 9 * calm * Math.sin(t * 4.1 + q.ph), q.y + 8 * calm * Math.cos(t * 3.6 + q.ph)));
      op(sky, P(t, mid('lifts', 0.16), 0.6, linear));
      outside.forEach(q => {
        const x = q.x + 2 * calm * Math.sin(t * 2.3 + q.ph), y = q.y + 2 * calm * Math.cos(t * 2 + q.ph);
        const ex = (x - bx) / 132, ey = (y - (by - 162)) / 138, inBal = ex * ex + ey * ey < 1 || (Math.abs(x - bx) < 44 && y > by - 50 && y < by + 52);
        attr(q.el, 'cx', x); attr(q.el, 'cy', y); op(q.el, inBal ? 0 : 1);
      });
      const pe = P(t, mid('lifts', 0.42), 0.5, linear); op(exam, pe); tr(exam, (1 - pe) * 30, 0);
      const r1 = P(t, mid('lifts', 0.55), 0.5, pop); op(row1, clamp(r1 * 2)); tr(tk1, 694, 414, Math.max(0.01, r1));
      const r2 = P(t, mid('lifts', 0.82), 0.4, linear); op(row2, r2);
      lightS.set(P(t, mid('lifts', 0.86), 0.5, easeOut));
    }

    /* ---- C2. no convection in solids ---- */
    const c2 = win(t, at('solids') - 0.2, at('radiator') - 0.05, 0.45);
    op(C2, c2);
    if (c2 > 0) {
      op(conW, P(t, at('solids') - 0.1, 0.4, linear));
      conS.set(P(t, mid('solids', 0.2), 0.5, easeOut));
      const sp = P(t, at('solids'), 0.6, pop); op(sol, clamp(sp * 2)); tr(sol, 450, 326 + (1 - clamp(sp)) * 20);
      sol.set('solid', t, 0.55 * calm + 0.1);
      const nl = P(t, mid('solids', 0.35), 0.5, linear); op(noLoop, nl * 0.95);
      const nx = P(t, mid('solids', 0.45), 0.4, pop); op(noX, clamp(nx * 2)); tr(noX, 0, 0, Math.max(0.01, nx));
      op(solLbl, P(t, mid('solids', 0.6), 0.5, linear));
    }

    /* ---- D. radiator room ---- */
    const aD = win(t, at('radiator') - 0.2, at('land') - 0.05, 0.45);
    op(D, aD);
    if (aD > 0) {
      const warmR = P(t, mid('radiator', 0.08), 0.8, linear);
      op(rad.glow, 0.85 * warmR); radWaves.upd(t); op(radWaves, warmR);
      op(radLbl, P(t, at('radiator'), 0.4, linear));
      const rvR = P(t, mid('radiator', 0.35), mid('radiator', 0.85) - mid('radiator', 0.35), linear);
      loopRoom.set(t, rvR); op(loopRoom, P(t, mid('radiator', 0.33), 0.2, linear));
      op(roomUp, P(t, mid('radiator', 0.42), 0.4, linear));
      op(roomDn, P(t, mid('radiator', 0.7), 0.4, linear));
      op(roomCur, P(t, mid('radiator', 0.78), 0.5, linear));
    }

    /* ---- E. the coast ---- */
    const aE = win(t, at('land') - 0.2, at('snake') - 0.05, 0.45);
    op(Ec, aE);
    if (aE > 0) {
      sunG.upd(t); surf.set({ phase: -t * 0.4 });
      const rays = win(t, mid('land', 0.4), at('breeze') + 0.3, 0.4);
      op(rayL, rays); op(rayS, rays); wL.set({ phase: -t * 1.2 }); wS.set({ phase: -t * 1.2 });
      const warm = P(t, mid('land', 0.5), end('land') - mid('land', 0.5) + 0.3, linear);
      thLand.set(0.25 + 0.55 * warm); thSea.set(0.25 + 0.12 * warm);
      op(landGlow, 0.45 * warm);
      op(landFast, P(t, mid('land', 0.58), 0.4, linear)); op(seaSlow, P(t, mid('land', 0.66), 0.4, linear));
      const rvS = P(t, at('breeze'), mid('breeze', 0.65) - at('breeze'), linear);
      loopSea.set(t, rvS); op(loopSea, P(t, at('breeze') - 0.05, 0.2, linear));
      op(airUp, P(t, mid('breeze', 0.12), 0.4, linear) * (1 - P(t, mid('breeze', 0.7), 0.4, linear)));
      op(breezeLbl, P(t, mid('breeze', 0.75), 0.5, linear));
      // the beach flag: limp, then streaming towards the land in the sea breeze
      const stream = P(t, mid('breeze', 0.45), 1.2);
      const fl = Math.sin(t * 9) * (2 + 4 * stream) * calm, pts = [];
      for (let k = 0; k <= 6; k++) { const f = k / 6; pts.push([-86 * f, 4 + 10 * f + fl * f * Math.sin(k * 1.3 + t * 7)]); }
      for (let k = 6; k >= 0; k--) { const f = k / 6; pts.push([-86 * f, 34 - 10 * f + fl * f * Math.sin(k * 1.3 + t * 7)]); }
      penPath.setAttribute('d', 'M' + pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' L') + 'Z');
      pennant.setAttribute('transform', `translate(500 394) rotate(${lerp(-78, 0, stream).toFixed(1)})`);
    }

    /* ---- F. the spinning spiral ---- */
    const aF = P(t, at('snake') - 0.2, 0.45, linear);
    op(F, aF);
    if (aF > 0) {
      op(homeChip, P(t, at('snake') - 0.1, 0.4, linear));
      const hot = P(t, mid('snake', 0.1), 0.8, linear);
      op(radF.glow, 0.85 * hot); op(radFLbl, P(t, mid('snake', 0.2), 0.4, linear));
      op(spG, P(t, mid('snake', 0.18), 0.5, linear));
      const air = P(t, mid('snake', 0.62), 0.6, linear);
      fWaves.upd(t); op(fWaves, air);
      fArrows.forEach((a, k) => { a.draw(t, P(t, mid('snake', 0.62) + k * 0.1, 0.6, easeOut)); op(a, air); });
      const t0 = mid('snake', 0.7), s = Math.max(0, t - t0), Tu = 1.2, phi = 2.2 * calm * (s < Tu ? s * s / (2 * Tu) : s - Tu / 2);
      const pts = spiralPts(-phi), d = openPath(pts);
      spBody.setAttribute('d', d); spEdge.setAttribute('d', d);
      const a = pts[NSP], b = pts[NSP - 2];
      snakeHead.setAttribute('transform', `translate(${a[0].toFixed(1)} ${a[1].toFixed(1)}) rotate(${(Math.atan2(a[1] - b[1], a[0] - b[0]) * 180 / Math.PI).toFixed(1)})`);
      const pn = P(t, mid('snake', 0.42), 0.5, pop); op(never, clamp(pn * 2)); tr(never, 0, (1 - clamp(pn)) * 16);
      op(spinLbl, P(t, mid('snake', 0.86), 0.4, linear));
    }
  };
});
