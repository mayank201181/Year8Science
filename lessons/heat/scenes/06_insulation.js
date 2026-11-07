/* Insulation: trapping thermal energy.
   Beats: cooling fins get rid of a chip's heat; a house in winter leaks it -> loft insulation traps air
   -> cavity wall foam stops the convection current inside the wall -> double glazing thins the arrow
   -> trapped air in the wool, the foam and the window gap -> the vacuum flask: the particles in its gap
   drain away (showpiece), silvered walls reflect radiation, the stopper goes in, cold drinks stay cold,
   no flask is perfect -> a jumper only slows heat loss -> fur, feathers and blubber. */
scene('insulation', S => {
  const { at, end, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;
  const Y = C.energy, HOT = C.heat, COLD = C.water;

  /* ---------- local helpers ---------- */
  function rich(parent, x, y, segs, o) {
    o = o || {};
    const t = E('text', { x, y, 'font-size': o.size || 30, 'font-weight': o.weight || 600, 'font-family': o.font || FD, 'text-anchor': o.anchor || 'start', fill: o.fill || C.ink }, parent);
    segs.forEach(s => { if (typeof s === 'string') s = [s]; E('tspan', { fill: s[1], 'font-weight': s[2] }, t).textContent = s[0]; });
    return t;
  }
  const f1 = v => (+v).toFixed(1);
  /* a thermal-energy arrow whose ends, width and bend can change every frame; heat shimmer rides along it */
  function flow(parent, o) {
    o = o || {};
    const g = G(parent), col = o.color || HOT;
    const line = E('path', { fill: 'none', stroke: col, 'stroke-linecap': 'round' }, g);
    const head = E('path', { fill: col }, g);
    const hw = o.waves === false ? null : heatWaves(g, { n: 2, h: 40, spacing: 30, width: 4, color: o.wcol || '#FFC27A', speed: 0.7 });
    g.set = (x1, y1, x2, y2, w, t, bend) => {
      const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 1, hs = w * 2.5;
      let ang, d, mx = x1 + dx * 0.42, my = y1 + dy * 0.42;
      if (bend) {
        const cx = (x1 + x2) / 2 - dy / L * bend, cy = (y1 + y2) / 2 + dx / L * bend;
        ang = Math.atan2(y2 - cy, x2 - cx);
        d = `M${f1(x1)},${f1(y1)} Q${f1(cx)},${f1(cy)} ${f1(x2 - Math.cos(ang) * hs * 0.7)},${f1(y2 - Math.sin(ang) * hs * 0.7)}`;
        mx = 0.25 * x1 + 0.5 * cx + 0.25 * x2; my = 0.25 * y1 + 0.5 * cy + 0.25 * y2;
      } else {
        ang = Math.atan2(dy, dx);
        d = `M${f1(x1)},${f1(y1)} L${f1(x2 - Math.cos(ang) * hs * 0.7)},${f1(y2 - Math.sin(ang) * hs * 0.7)}`;
      }
      line.setAttribute('d', d); line.setAttribute('stroke-width', f1(w));
      head.setAttribute('d', `M0,0 L${f1(-hs)},${f1(-hs * 0.62)} L${f1(-hs * 0.72)},0 L${f1(-hs)},${f1(hs * 0.62)} Z`);
      head.setAttribute('transform', `translate(${f1(x2)} ${f1(y2)}) rotate(${f1(ang * 180 / Math.PI)})`);
      if (hw) { hw.upd(t); tr(hw, mx, my, Math.min(1, w / 9), ang * 180 / Math.PI + 90); }
    };
    return g;
  }
  /* infrared: a wavy arrow (the kit sineWave look, tapered); upd(time, front 0..1) */
  function irRay(parent, x1, y1, x2, y2, o) {
    o = o || {};
    const g = G(parent), L = Math.hypot(x2 - x1, y2 - y1);
    tr(g, x1, y1, 1, Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI);
    const col = o.color || HOT, wd = o.width || 5, wl = o.wl || 40, amp0 = o.amp || 8, sp = o.speed || 120, hs = o.hs || wd * 3;
    const under = o.under ? E('path', { fill: 'none', stroke: o.under, 'stroke-width': wd + 5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g) : null;
    const path = E('path', { fill: 'none', stroke: col, 'stroke-width': wd, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    const head = E('path', { d: `M0,0 L${-hs},${f1(-hs * 0.62)} L${f1(-hs * 0.72)},0 L${-hs},${f1(hs * 0.62)} Z`, fill: col, stroke: o.under || 'none', 'stroke-width': o.under ? 2 : 0 }, g);
    g.L = L; g.sp = sp;
    g.upd = (t, rv) => {
      rv = clamp(rv === undefined ? 1 : rv);
      const show = rv > 0.004;
      op(path, show ? 1 : 0); op(head, show ? 1 : 0); if (under) op(under, show ? 1 : 0);
      if (!show) return;
      const tip = rv * L, front = Math.max(2, tip - hs * 0.55), ph = t * sp / wl, tp = Math.min(wl * 0.55, front / 2);
      let d = 'M0,0';
      for (let x = 4; x < front + 4; x += 4) { const xx = Math.min(x, front), e = Math.min(1, xx / tp, (front - xx) / tp); d += 'L' + xx.toFixed(1) + ',' + (-amp0 * e * Math.sin(TAU * (xx / wl - ph))).toFixed(1); }
      path.setAttribute('d', d); if (under) under.setAttribute('d', d);
      tr(head, tip, 0);
    };
    g.upd(0, 1);
    return g;
  }
  const grow = (t, t0, r) => clamp((t - t0) * r.sp * calm / r.L);
  /* position along a polyline, u in 0..1 */
  function along(pts, u) {
    const segs = []; let L = 0;
    for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); segs.push(l); L += l; }
    let d = clamp(u) * L;
    for (let i = 0; i < segs.length; i++) { if (d <= segs[i] || i === segs.length - 1) { const f = segs[i] ? Math.min(1, d / segs[i]) : 0; return [lerp(pts[i][0], pts[i + 1][0], f), lerp(pts[i][1], pts[i + 1][1], f)]; } d -= segs[i]; }
    return pts[pts.length - 1];
  }
  function wayPill(parent, n, text, size) {
    const g = G(parent), h = Math.round(size * 1.8), w = Math.ceil(textWidth(text, size, FD, 700) + h * 1.05 + size * 0.8);
    g.box = E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: h / 2, fill: C.card, stroke: C.line, 'stroke-width': 2.5 }, g);
    E('circle', { cx: -w / 2 + h / 2, cy: 0, r: h * 0.33, fill: HOT }, g);
    T(g, -w / 2 + h / 2, size * 0.29, String(n), { size: Math.round(size * 0.78), weight: 700, fill: C.bg0, anchor: 'middle' });
    T(g, -w / 2 + h * 0.95, size * 0.35, text, { size, weight: 700 });
    g.w = w;
    return g;
  }
  /* small thermometer icon for temperature tags (bulb at 0,8); g.set(level 0..1) */
  function thermoIcon(parent) {
    const g = G(parent);
    E('rect', { x: -7, y: -40, width: 14, height: 46, rx: 7, fill: '#E9F2F7', stroke: '#8FB0C2', 'stroke-width': 2 }, g);
    E('circle', { cx: 0, cy: 8, r: 11, fill: C.bad, stroke: '#8FB0C2', 'stroke-width': 2 }, g);
    const col = E('rect', { x: -3.5, y: 0, width: 7, height: 4, rx: 3.5, fill: C.bad }, g);
    g.set = v => { const hh = 38 * (0.15 + 0.85 * clamp(v)); attr(col, 'y', 6 - hh); attr(col, 'height', hh); };
    return g;
  }
  function tempTag(parent, x, y) {
    const g = G(parent); tr(g, x, y);
    const th = thermoIcon(g); tr(th, -14, 4, 0.82);
    g.th = th; g.txt = T(g, 6, 14, '', { size: 34, weight: 700 });
    return g;
  }
  const beat = (t, a, b) => win(t, a, b, 0.45);
  const popIn = (t, t0) => P(t, t0, 0.5, pop);

  /* ================= A. cooling fins ================= */
  const gFins = G(root);
  const finHdr = chip(gFins, 'want it to escape', { size: 28, fill: 'rgba(86,214,155,0.14)', stroke: C.good, color: C.good, sw: 2.5 }); tr(finHdr, 320, 146);
  E('rect', { x: 110, y: 522, width: 420, height: 34, rx: 6, fill: '#1F6B4A', stroke: '#3FA06E', 'stroke-width': 3 }, gFins);
  E('path', { d: 'M126,539 L236,539 M404,539 L514,539 M146,548 L240,548 M400,548 L494,548', stroke: '#E8C15A', 'stroke-width': 3, opacity: 0.8 }, gFins);
  const chipGlow = E('ellipse', { cx: 320, cy: 500, rx: 150, ry: 70, fill: glow(HOT) }, gFins);
  E('rect', { x: 248, y: 494, width: 144, height: 28, rx: 4, fill: '#2B2F36', stroke: '#596270', 'stroke-width': 2 }, gFins);
  E('rect', { x: 222, y: 470, width: 196, height: 24, rx: 3, fill: linGrad('#D5DEE5', '#8D9BA7', true), stroke: '#EEF4F7', 'stroke-width': 2 }, gFins);
  { let d = ''; for (let i = 0; i < 9; i++) { const x = 230 + i * 22; d += `M${x},470 L${x},300 L${x + 9},300 L${x + 9},470 Z `; } E('path', { d, fill: linGrad('#E4EBF0', '#9AA8B4', false), stroke: '#F4F8FB', 'stroke-width': 1.5 }, gFins); }
  const finWaves = [262, 320, 378].map(x => { const h = heatWaves(gFins, { n: 2, h: 74, spacing: 18, width: 5 }); tr(h, x, 290); return h; });
  const lblFins = labelLine(gFins, 456, 352, 418, 372, 'cooling fins', { size: 28, anchor: 'start' });
  const lblChip = labelLine(gFins, 456, 620, 392, 512, 'computer chip', { size: 28, anchor: 'start' });

  /* ================= B. the house ================= */
  const gHouse = G(root);
  const flakes = G(gHouse), fr = rng(19), flakeList = [];
  for (let i = 0; i < 16; i++) flakeList.push({ el: E('circle', { r: (2 + fr() * 2.5).toFixed(1), fill: '#EAF4FA', opacity: (0.5 + fr() * 0.4).toFixed(2) }, flakes), x: -560 + fr() * 1120, ph: fr(), sp: 0.07 + fr() * 0.06, sw: fr() * TAU });
  const house = G(gHouse);
  E('rect', { x: -340, y: 0, width: 680, height: 16, rx: 6, fill: '#E6F0F6' }, house);
  E('rect', { x: -340, y: 14, width: 680, height: 26, fill: '#16303E' }, house);
  // the room
  E('rect', { x: -206, y: -270, width: 412, height: 270, fill: '#1B3443' }, house);
  const roomWarm = E('rect', { x: -206, y: -270, width: 412, height: 270, fill: '#FF9A50', opacity: 0.16 }, house);
  E('rect', { x: -206, y: -12, width: 412, height: 12, fill: '#6B4A33' }, house);
  E('rect', { x: -186, y: -104, width: 140, height: 44, rx: 14, fill: '#C9566B' }, house);
  E('rect', { x: -192, y: -66, width: 152, height: 50, rx: 12, fill: '#B5455A' }, house);
  E('path', { d: 'M150,-14 L150,-150 M120,-14 L180,-14', stroke: '#9DB0BF', 'stroke-width': 6, 'stroke-linecap': 'round' }, house);
  E('circle', { cx: 150, cy: -168, r: 46, fill: glow('#FFE29A') }, house);
  E('path', { d: 'M126,-150 L174,-150 L162,-190 L138,-190 Z', fill: '#FFE29A' }, house);
  E('rect', { x: -40, y: -222, width: 84, height: 60, rx: 4, fill: '#2F5872', stroke: '#B78358', 'stroke-width': 5 }, house);
  // walls: brick outer leaf, cavity, block inner leaf
  [[-250, -1], [234, 1]].forEach(([x]) => E('rect', { x, y: -270, width: 16, height: 270, fill: '#A0523D' }, house));
  [[-222], [206]].forEach(([x]) => E('rect', { x, y: -270, width: 16, height: 270, fill: '#8F9CAB' }, house));
  const cavL = E('rect', { x: -234, y: -270, width: 12, height: 270, fill: '#0E2230' }, house);
  const cavR = E('rect', { x: 222, y: -270, width: 12, height: 270, fill: '#0E2230' }, house);
  const foamR = E('rect', { x: 222, y: -270, width: 12, height: 270, fill: '#F1DDA0' }, house);
  const foamL = E('rect', { x: -234, y: -270, width: 12, height: 270, fill: '#F1DDA0' }, house);
  // the window in the right wall: two panes with a gap
  E('rect', { x: 204, y: -208, width: 48, height: 96, fill: '#16303E' }, house);
  E('rect', { x: 206, y: -205, width: 44, height: 90, fill: 'rgba(159,216,255,0.22)' }, house);
  E('path', { d: 'M213,-205 L213,-115 M243,-205 L243,-115', stroke: '#CFE7F5', 'stroke-width': 4 }, house);
  E('rect', { x: 200, y: -116, width: 58, height: 8, rx: 3, fill: '#E8EEF2' }, house);
  E('rect', { x: 202, y: -212, width: 54, height: 8, rx: 3, fill: '#E8EEF2' }, house);
  // ceiling, loft, roof
  E('rect', { x: -256, y: -284, width: 512, height: 14, fill: '#8A5A3A' }, house);
  E('path', { d: 'M-262,-284 L0,-430 L262,-284 Z', fill: '#10232F' }, house);
  E('clipPath', { id: 'insLoftClip' }, defs()).appendChild(E('path', { d: 'M-262,-284 L0,-430 L262,-284 Z' }));
  const wool = G(house, { 'clip-path': 'url(#insLoftClip)' });
  const woolIn = G(wool);
  { const pts = [[-270, 0]]; for (let i = 0; i <= 24; i++) pts.push([-270 + i * 22.5, -50 - 6 * Math.sin(i * 1.7) - 4 * Math.cos(i * 2.9)]); pts.push([270, 0]);
    E('path', { d: 'M' + pts.map(p => f1(p[0]) + ',' + f1(p[1])).join(' L') + ' Z', fill: '#F2C14E', stroke: '#FFE29A', 'stroke-width': 3, 'stroke-linejoin': 'round' }, woolIn);
    let d = ''; const r = rng(4); for (let i = 0; i < 40; i++) { const x = -250 + r() * 500, y = -8 - r() * 36; d += `M${f1(x)},${f1(y)} q${f1(6 + r() * 6)},${f1(-6 - r() * 4)} ${f1(14 + r() * 6)},0 `; }
    E('path', { d, fill: 'none', stroke: '#C9922E', 'stroke-width': 2.5, 'stroke-linecap': 'round' }, woolIn); }
  const woolAir = []; { const r = rng(9); for (let i = 0; i < 10; i++) woolAir.push(E('circle', { cx: f1(-184 + i * 40 + r() * 10), cy: f1(-14 - r() * 26), r: f1(4 + r() * 3), fill: '#9FD8FF', opacity: 0.75 }, woolIn)); }
  E('path', { d: 'M-292,-284 L0,-455 L292,-284 L262,-284 L0,-430 L-262,-284 Z', fill: '#6E3A30', stroke: '#9A5A45', 'stroke-width': 3, 'stroke-linejoin': 'round' }, house);
  E('path', { d: 'M-286,-292 L0,-461 L286,-292', fill: 'none', stroke: '#EEF5F9', 'stroke-width': 9, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, house);
  // where the heat leaks out
  const lkRoofL = flow(house), lkRoofR = flow(house), lkWall = flow(house), lkWin = flow(house);
  const tagIn = tempTag(house, -150, -228), tagOut = tempTag(house, 300, -30);
  setText(tagIn.txt, '20 °C'); tagIn.th.set(0.5); setText(tagOut.txt, '0 °C'); tagOut.th.set(0.12);
  const leakHdr = chip(gHouse, 'stop it escaping!', { size: 28, fill: 'rgba(255,96,112,0.14)', stroke: C.bad, color: '#FF9AA4', sw: 2.5 });
  // loft labels (stage coordinates, house at full size)
  const loftLbls = G(gHouse);
  const lbLoft = labelLine(loftLbls, 915, 338, 772, 352, 'loft insulation', { size: 30, anchor: 'start', weight: 700, fill: '#FFD98A' });
  const lbTraps = T(loftLbls, 925, 374, 'traps air', { size: 28, weight: 600, fill: C.muted });
  const lbCond = labelLine(loftLbls, 300, 250, 488, 362, 'conduction', { size: 28, anchor: 'end' });
  const lbConv = labelLine(loftLbls, 900, 250, 716, 362, 'convection', { size: 28, anchor: 'start' });

  /* ================= C. zoom: the cavity wall, then the window ================= */
  const HX = 230, HY = 560, HSc = 0.52;
  const hp = (x, y) => [HX + HSc * x, HY + HSc * y];
  const gZoom = G(root);
  const zc = card(gZoom, 470, 140, 670, 562, { fill: C.card, stroke: C.line });
  const zoomBox = G(gZoom), zoomLines = G(gZoom);
  const zb = E('rect', { fill: 'none', stroke: Y, 'stroke-width': 3, rx: 4 }, zoomBox);
  const zl1 = E('line', { stroke: Y, 'stroke-width': 2, 'stroke-dasharray': '6 6', opacity: 0.7 }, zoomLines);
  const zl2 = E('line', { stroke: Y, 'stroke-width': 2, 'stroke-dasharray': '6 6', opacity: 0.7 }, zoomLines);
  const setZoom = (y0, y1) => {
    const [ax, ay] = hp(198, y0), [bx, by] = hp(258, y1);
    attr(zb, 'x', ax); attr(zb, 'y', ay); attr(zb, 'width', bx - ax); attr(zb, 'height', by - ay);
    attr(zl1, 'x1', bx); attr(zl1, 'y1', ay); attr(zl1, 'x2', 470); attr(zl1, 'y2', 140);
    attr(zl2, 'x1', bx); attr(zl2, 'y1', by); attr(zl2, 'x2', 470); attr(zl2, 'y2', 702);
  };
  const zIn = T(gZoom, 552, 192, 'inside', { size: 28, weight: 700, anchor: 'middle', fill: '#FFB37A' });
  const zOut = T(gZoom, 1058, 192, 'outside', { size: 28, weight: 700, anchor: 'middle', fill: '#9FE0FF' });
  E('rect', { x: 482, y: 214, width: 150, height: 442, rx: 10, fill: 'rgba(255,140,60,0.3)' }, gZoom);
  const zTagIn = tempTag(gZoom, 540, 624), zTagOut = tempTag(gZoom, 1036, 624);
  setText(zTagIn.txt, '20 °C'); zTagIn.th.set(0.5); setText(zTagOut.txt, '0 °C'); zTagOut.th.set(0.12);
  E('rect', { x: 978, y: 214, width: 150, height: 442, rx: 10, fill: 'rgba(76,201,240,0.16)' }, gZoom);
  // --- cavity wall ---
  const gCav = G(gZoom);
  E('rect', { x: 635, y: 214, width: 90, height: 442, fill: '#8F9CAB' }, gCav);
  { let d = ''; for (let k = 1; k < 8; k++) { const y = 214 + k * 56; d += `M635,${y} L725,${y} `; } for (let k = 0; k < 8; k++) { const x = k % 2 ? 680 : 655; d += `M${x},${214 + k * 56} L${x},${270 + k * 56} `; } E('path', { d, stroke: '#6B7886', 'stroke-width': 3 }, gCav); }
  E('rect', { x: 725, y: 214, width: 160, height: 442, fill: '#0E2230' }, gCav);
  E('rect', { x: 885, y: 214, width: 90, height: 442, fill: '#A0523D' }, gCav);
  { let d = ''; for (let k = 1; k < 15; k++) { const y = 214 + k * 29.5; d += `M885,${f1(y)} L975,${f1(y)} `; } for (let k = 0; k < 15; k++) { const x = k % 2 ? 930 : 908; d += `M${x},${f1(214 + k * 29.5)} L${x},${f1(243.5 + k * 29.5)} `; } E('path', { d, stroke: '#6E3226', 'stroke-width': 3 }, gCav); }
  const cavLbl = T(gCav, 805, 196, 'cavity', { size: 30, weight: 700, anchor: 'middle' });
  const foamG = G(gCav);
  E('clipPath', { id: 'insFoamClip' }, defs()).appendChild(E('rect', { x: 725, y: 214, width: 160, height: 442 }));
  const foamIn = G(foamG, { 'clip-path': 'url(#insFoamClip)' });
  const foamRect = E('rect', { x: 725, y: 214, width: 160, height: 442, fill: '#F1DDA0' }, foamIn);
  const bubs = []; { const r = rng(31); for (let i = 0; i < 18; i++) { const x = 740 + (i % 3) * 44 + r() * 26, y = 232 + i * 23 + r() * 8; bubs.push({ el: E('circle', { cx: f1(x), cy: f1(y), r: f1(5 + r() * 8), fill: 'rgba(159,216,255,0.35)', stroke: '#D9B65E', 'stroke-width': 2 }, foamIn), y }); } }
  const LOOP = [[752, 600], [752, 262], [858, 262], [858, 600], [752, 600]];
  const loopUp = arrow(gCav, 752, 586, 752, 280, { color: HOT, width: 7, bend: 8 });
  const loopDown = arrow(gCav, 858, 280, 858, 586, { color: '#4FB6F0', width: 7, bend: 8 });
  const loopTop = arrow(gCav, 764, 252, 846, 252, { color: '#FFC27A', width: 5, bend: -14 });
  const loopBot = arrow(gCav, 846, 612, 764, 612, { color: '#4FB6F0', width: 5, bend: -14 });
  const loopDots = []; for (let i = 0; i < 8; i++) loopDots.push(E('circle', { r: 7, fill: C.ink }, gCav));
  const loopX = cross(gCav, 34); tr(loopX, 805, 430);
  const cavLbl2 = T(gCav, 805, 684, 'convection current', { size: 28, weight: 700, anchor: 'middle', fill: '#FFC27A' });
  const cavLbl3 = rich(gCav, 805, 684, [['foam', '#F1DDA0', 800], [': no convection current', C.ink]], { size: 28, anchor: 'middle' });
  // --- double glazing ---
  const gWin = G(gZoom);
  const winHdr = T(gWin, 805, 196, 'double glazing', { size: 30, weight: 700, anchor: 'middle' });
  E('rect', { x: 690, y: 214, width: 230, height: 38, rx: 4, fill: '#E8EEF2', stroke: '#B8C6D0', 'stroke-width': 2 }, gWin);
  E('path', { d: 'M676,590 L934,590 L948,628 L662,628 Z', fill: '#E8EEF2', stroke: '#B8C6D0', 'stroke-width': 2, 'stroke-linejoin': 'round' }, gWin);
  const gapAir = G(gWin);
  const gapGlow = E('rect', { x: 757, y: 252, width: 96, height: 338, fill: 'rgba(159,216,255,0.10)' }, gapAir);
  const airDots = []; { const r = rng(12); for (let i = 0; i < 7; i++) airDots.push({ el: E('circle', { r: 6, fill: ball(C.air, '#3D7DB0') }, gapAir), x: 772 + r() * 66, y: 280 + i * 42 + r() * 10, ph: r() * TAU }); }
  const paneA = E('rect', { x: -7, y: 252, width: 14, height: 338, fill: 'rgba(200,230,250,0.35)', stroke: '#CFE7F5', 'stroke-width': 3 }, gWin);
  const paneB = E('rect', { x: -7, y: 252, width: 14, height: 338, fill: 'rgba(200,230,250,0.35)', stroke: '#CFE7F5', 'stroke-width': 3 }, gWin);
  const winFlow = flow(gWin);
  const condLbl = T(gWin, 552, 392, 'conduction', { size: 26, weight: 700, anchor: 'middle', fill: '#FFC27A' });
  const gapLbl = rich(gWin, 805, 680, [['trapped air', C.air, 800], [', or a vacuum', C.ink]], { size: 28, anchor: 'middle' });

  /* ================= D. trapped air ================= */
  const gAir = G(root);
  const airHdr = rich(gAir, 600, 178, [['Trapped air', C.air, 800], [': a brilliant insulator', C.ink]], { size: 42, anchor: 'middle' });
  const pockets = [];
  const insets = [[250, 'loft wool'], [600, 'wall foam'], [950, 'window gap']].map(([x, name], i) => {
    const g = G(gAir); tr(g, x, 360);
    E('clipPath', { id: 'insAirClip' + i }, defs()).appendChild(E('circle', { r: 118 }));
    const inner = G(g, { 'clip-path': `url(#insAirClip${i})` });
    const r = rng(40 + i);
    if (i === 0) {
      E('rect', { x: -130, y: -130, width: 260, height: 260, fill: '#F2C14E' }, inner);
      let d = ''; for (let k = 0; k < 26; k++) { const y = -110 + k * 9; d += `M-130,${y} C-60,${y - 26 + r() * 20} 0,${y + 26 - r() * 20} 130,${y - 6 + r() * 12} `; }
      E('path', { d, fill: 'none', stroke: '#C9922E', 'stroke-width': 3 }, inner);
    } else if (i === 1) {
      E('rect', { x: -130, y: -130, width: 260, height: 260, fill: '#F1DDA0' }, inner);
    } else {
      E('rect', { x: -130, y: -130, width: 260, height: 260, fill: '#16303E' }, inner);
      E('rect', { x: -96, y: -130, width: 28, height: 260, fill: 'rgba(200,230,250,0.35)', stroke: '#CFE7F5', 'stroke-width': 3 }, inner);
      E('rect', { x: 68, y: -130, width: 28, height: 260, fill: 'rgba(200,230,250,0.35)', stroke: '#CFE7F5', 'stroke-width': 3 }, inner);
    }
    const spots = i === 2 ? [[-30, -70], [20, -20], [-16, 36], [28, 84], [-34, 100], [10, -100]] : [];
    if (i < 2) for (let tries = 0; spots.length < 7 && tries < 400; tries++) { const a = r() * TAU, rr = r() * 92, x0 = Math.cos(a) * rr, y0 = Math.sin(a) * rr; if (spots.every(s => Math.hypot(s[0] - x0, s[1] - y0) > 44)) spots.push([x0, y0]); }
    spots.forEach(([px, py], k) => {
      const big = i === 2 ? 9 : 14 + r() * 8;
      const halo = E('circle', { cx: f1(px), cy: f1(py), r: f1(big * 2.2), fill: glow(C.air) }, inner);
      const c = E('circle', { cx: f1(px), cy: f1(py), r: f1(big), fill: i === 2 ? ball(C.air, '#3D7DB0') : 'rgba(30,70,100,0.55)', stroke: i === 2 ? 'none' : (i === 0 ? '#A8741E' : '#D9B65E'), 'stroke-width': 2.5 }, inner);
      pockets.push({ halo, c, ph: r(), i, x: px, y: py });
    });
    E('circle', { r: 118, fill: 'none', stroke: C.line, 'stroke-width': 5 }, g);
    T(g, 0, 160, name, { size: 30, weight: 700, anchor: 'middle' });
    return g;
  });
  const airChip1 = chip(gAir, 'air conducts poorly', { size: 28, fill: C.card2, stroke: C.air, sw: 2.5 });
  const airChip2 = chip(gAir, 'trapped: no convection currents', { size: 28, fill: C.card2, stroke: C.air, sw: 2.5 });
  { const tot = airChip1.w + airChip2.w + 24; tr(airChip1, 600 - tot / 2 + airChip1.w / 2, 640); tr(airChip2, 600 + tot / 2 - airChip2.w / 2, 640); }

  /* ================= E. the vacuum flask ================= */
  const FX = 470, FY = 440;
  const gFlask = G(root);
  const flaskG = G(gFlask);
  const VO = 'M-58,-232 L-58,-200 C-58,-176 -118,-170 -118,-120 L-118,196 Q-118,232 -82,232 L82,232 Q118,232 118,196 L118,-120 C118,-170 58,-176 58,-200 L58,-232 Z';
  const VI = 'M-36,-232 L-36,-196 C-36,-160 -96,-156 -96,-110 L-96,178 Q-96,210 -64,210 L64,210 Q96,210 96,178 L96,-110 C96,-156 36,-160 36,-196 L36,-232 Z';
  E('rect', { x: -150, y: -214, width: 300, height: 476, rx: 36, fill: linGrad('#4F7C99', '#2B5068', false), stroke: '#8FB4CC', 'stroke-width': 3 }, flaskG);
  E('rect', { x: -134, y: -198, width: 268, height: 444, rx: 26, fill: '#0C1F2B' }, flaskG);
  const pad = E('rect', { x: -40, y: 232, width: 80, height: 14, rx: 4, fill: '#55606B' }, flaskG);
  E('rect', { x: -76, y: -214, width: 152, height: 16, rx: 4, fill: '#3E5568' }, flaskG);
  const gapFill = E('path', { d: VO, fill: '#1E4560' }, flaskG);
  const gapEmpty = E('path', { d: VO, fill: '#050E16' }, flaskG);
  const gapGlowF = E('path', { d: VO, fill: 'none', stroke: 'rgba(159,216,255,0.45)', 'stroke-width': 12 }, flaskG);
  const gapParts = []; { const r = rng(55); const ys = [-96, -48, 0, 48, 96, 144, 190];
    ys.forEach((y, k) => { [-107, 107].forEach(x => gapParts.push({ x, y: y + (r() - 0.5) * 6 })); });
    [-68, -24, 24, 68].forEach(x => gapParts.push({ x, y: 221 }));
    gapParts.forEach((p, k) => { p.el = E('circle', { r: 6.5, fill: ball(C.air, '#3D7DB0') }, flaskG); p.ph = r() * TAU; p.path = p.y > 205 ? [[p.x, 221], [0, 221], [0, 252]] : [[p.x, p.y], [p.x, 196], [Math.sign(p.x) * 70, 221], [0, 221], [0, 252]]; p.d = (p.y > 205 ? 0 : (196 - p.y) / 290) * 0.9 + k * 0.012; }); }
  E('path', { d: VI, fill: '#0A1822' }, flaskG);
  E('clipPath', { id: 'insDrinkClip' }, defs()).appendChild(E('path', { d: VI }));
  const drinkG = G(flaskG, { 'clip-path': 'url(#insDrinkClip)' });
  E('rect', { x: -100, y: -122, width: 200, height: 340, fill: '#D93A48' }, drinkG);
  const drinkCold = E('rect', { x: -100, y: -122, width: 200, height: 340, fill: '#2C8FC8' }, drinkG);
  E('rect', { x: -100, y: -124, width: 200, height: 5, fill: '#FFFFFF', opacity: 0.35 }, drinkG);
  const ice = [[-42, -112, 14], [18, -108, -10], [56, -86, 22]].map(([x, y, r]) => { const c = E('rect', { x: -22, y: -22, width: 44, height: 44, rx: 9, fill: 'rgba(232,246,255,0.85)', stroke: '#FFFFFF', 'stroke-width': 3 }, drinkG); c.setAttribute('transform', `translate(${x} ${y}) rotate(${r})`); return c; });
  const glassStroke = { fill: 'none', stroke: '#BFD9E6', 'stroke-width': 4, 'stroke-linejoin': 'round' };
  const VOline = 'M-58,-232 L-58,-200 C-58,-176 -118,-170 -118,-120 L-118,196 Q-118,232 -82,232 L82,232 Q118,232 118,196 L118,-120 C118,-170 58,-176 58,-200 L58,-232';
  const VIline = 'M-36,-232 L-36,-196 C-36,-160 -96,-156 -96,-110 L-96,178 Q-96,210 -64,210 L64,210 Q96,210 96,178 L96,-110 C96,-156 36,-160 36,-196 L36,-232';
  E('path', Object.assign({ d: VOline }, glassStroke), flaskG);
  E('path', Object.assign({ d: VIline }, glassStroke), flaskG);
  E('path', { d: 'M-58,-232 L-36,-232 M36,-232 L58,-232', stroke: '#BFD9E6', 'stroke-width': 5, 'stroke-linecap': 'round' }, flaskG);
  const silverG = G(flaskG);
  E('path', { d: VOline, fill: 'none', stroke: '#F4F8FB', 'stroke-width': 8, 'stroke-linejoin': 'round' }, silverG);
  E('path', { d: VIline, fill: 'none', stroke: '#F4F8FB', 'stroke-width': 8, 'stroke-linejoin': 'round' }, silverG);
  E('path', { d: 'M-118,-80 L-118,150 M118,-80 L118,150', stroke: '#FFFFFF', 'stroke-width': 4, opacity: 0.9, 'stroke-dasharray': '24 30' }, silverG);
  const glint = E('ellipse', { rx: 16, ry: 40, fill: glow('#FFFFFF') }, silverG);
  const steam = heatWaves(flaskG, { n: 2, h: 56, spacing: 96, width: 5 }); tr(steam, 0, -238);
  const steamDots = [0, 1, 2, 3].map(() => E('circle', { r: 5, fill: '#F2F7FA' }, flaskG));
  const stopper = G(flaskG);
  E('rect', { x: -38, y: -236, width: 76, height: 50, rx: 8, fill: linGrad('#9AA8B4', '#5E6C78', false), stroke: '#C9D6DE', 'stroke-width': 2.5 }, stopper);
  E('rect', { x: -54, y: -258, width: 108, height: 26, rx: 9, fill: linGrad('#B9C6D2', '#7D8C99', false), stroke: '#DCE6ED', 'stroke-width': 2.5 }, stopper);
  const leakTop = heatWaves(flaskG, { n: 2, h: 44, spacing: 16, width: 3.5 }); tr(leakTop, 0, -262);
  const leakBot = [flow(flaskG, { waves: false }), flow(flaskG, { waves: false })];
  // the vacuum beat: conduction and convection hit the empty gap
  const vacArrows = G(flaskG);
  const condA = flow(vacArrows, { waves: false }), convA = flow(vacArrows, { waves: false });
  const xCond = cross(vacArrows, 15), xConv = cross(vacArrows, 15); tr(xCond, -107, 60); tr(xConv, -107, 150);
  // silver: radiation from the drink reflects back in
  const RB = { amp: 6, wl: 22, width: 4.5, speed: 100, hs: 13, under: '#5A1018' };
  const silverRays = [[[-26, 90, -92, 40], [-92, 40, -30, -10]], [[26, 90, 92, 40], [92, 40, 30, -10]]]
    .map(pair => pair.map(([a, b, c, d]) => irRay(flaskG, a, b, c, d, RB)));
  // cold: warmth from outside is turned back at the walls
  const turnL = flow(flaskG, { waves: false }), turnR = flow(flaskG, { waves: false });
  // labels and scorecard (stage coordinates)
  const fl = G(gFlask);
  const lbVac = labelLine(fl, 300, 340, FX - 107, 330, 'vacuum', { size: 30, anchor: 'end', weight: 700, fill: C.air });
  const fCond = T(fl, 300, FY + 70, 'conduction', { size: 28, weight: 700, anchor: 'end', fill: '#FFC27A' });
  const fConv = T(fl, 300, FY + 160, 'convection', { size: 28, weight: 700, anchor: 'end', fill: '#FFC27A' });
  const lbSilver = labelLine(fl, 300, 430, FX - 118, 420, 'silvered walls', { size: 30, anchor: 'end', weight: 700, fill: '#F4F8FB' });
  const lbStop = labelLine(fl, 300, 222, FX - 40, 222, 'stopper', { size: 30, anchor: 'end', weight: 700 });
  const lbSup = labelLine(fl, 300, 690, FX - 40, FY + 240, 'supports', { size: 30, anchor: 'end', weight: 700 });
  const lbIn = T(fl, 60, FY + 52, 'energy flowing in', { size: 26, weight: 600, fill: '#FFC27A' });
  const tag = tempTag(gFlask, 676, 300);
  const clock = G(gFlask); tr(clock, 708, 380);
  E('circle', { r: 22, fill: C.card, stroke: C.muted, 'stroke-width': 4 }, clock);
  const clockHand = E('line', { x1: 0, y1: 0, x2: 0, y2: -15, stroke: Y, 'stroke-width': 4, 'stroke-linecap': 'round' }, clock);
  T(clock, 34, 10, 'hours', { size: 26, weight: 600, fill: C.muted });
  const scoreHdr = T(gFlask, 920, 232, 'beats all three:', { size: 30, weight: 700, anchor: 'middle', fill: C.muted });
  const score = [[1, 'Conduction', 300], [2, 'Convection', 380], [3, 'Radiation', 460]].map(([n, txt, y]) => {
    const g = wayPill(gFlask, n, txt, 28); tr(g, 920, y);
    const x = cross(g, 14); tr(x, g.w / 2 + 28, 0);
    return { g, x, y };
  });
  const topNote = G(gFlask);
  const tnA = rich(topNote, 580, 150, ['no ', ['convection', '#FFC27A', 800]], { size: 26 });
  const tnB = rich(topNote, 580, 186, ['no ', ['evaporation', '#FFC27A', 800]], { size: 26 });
  const leakNote = rich(gFlask, 646, 662, [['a little', '#FFC27A', 800], [' leaks out', C.ink]], { size: 28 });

  /* ================= F. the jumper ================= */
  const gJump = G(root);
  const PX = 400, PY = 660, PS = 2.3, POSE = { lean: 0, armL: [-18, 8], armR: [18, 8], legL: [3, -3], legR: [-3, -3] };
  const jArrows = [[-1, 352], [-1, 420], [1, 352], [1, 420]].map(([s, y]) => ({ s, y, f: flow(gJump) }));
  const wearer = person(gJump, { shirt: '#5B8DEF', shorts: '#3A4F66' }); tr(wearer, PX, PY, PS); wearer.pose(POSE);
  const jumper = G(wearer);
  const sleeve = (a, b) => { const up = G(jumper); up.setAttribute('transform', `translate(0 -146) rotate(${-a})`); E('line', { x1: 0, y1: 0, x2: 0, y2: 33, stroke: '#C0392B', 'stroke-width': 13.5, 'stroke-linecap': 'round' }, up); const lo = G(up); lo.setAttribute('transform', `translate(0 33) rotate(${-b})`); E('line', { x1: 0, y1: 0, x2: 0, y2: 24, stroke: '#C0392B', 'stroke-width': 12, 'stroke-linecap': 'round' }, lo); E('line', { x1: -6, y1: 22, x2: 6, y2: 22, stroke: '#F2E3D3', 'stroke-width': 3 }, lo); return up; };
  const slB = sleeve(-18, 8);
  E('path', { d: 'M-21,-154 Q0,-163 21,-154 L18,-89 Q0,-83 -18,-89 Z', fill: '#C0392B', stroke: '#E8665A', 'stroke-width': 1.5 }, jumper);
  E('path', { d: 'M-19,-124 L-13,-130 L-7,-124 L-1,-130 L5,-124 L11,-130 L17,-124 M-18,-112 L18,-112 M-17,-98 L17,-98', fill: 'none', stroke: '#F2E3D3', 'stroke-width': 2.2, 'stroke-linejoin': 'round' }, jumper);
  E('path', { d: 'M-8,-158 Q0,-152 8,-158', fill: 'none', stroke: '#F2E3D3', 'stroke-width': 2.5 }, jumper);
  const slF = sleeve(18, 8);
  const jAir = []; { const r = rng(27); for (let i = 0; i < 5; i++) jAir.push(E('circle', { cx: f1(-14 + (i % 4) * 9 + r() * 3), cy: f1(-146 + Math.floor(i / 4) * 30 + 8 + r() * 4), r: 2.6, fill: '#9FD8FF' }, jumper)); }
  const wrong = G(gJump);
  const wChip = chip(wrong, 'a jumper adds heat', { size: 30, fill: C.card2, stroke: C.line, color: C.muted, sw: 2.5 }); tr(wChip, 860, 230);
  const wStrike = strike(wrong, 860 - wChip.w / 2 + 18, 230, 860 + wChip.w / 2 - 18, C.bad);
  const wX = cross(wrong, 16); tr(wX, 860 - wChip.w / 2 - 34, 230);
  const right = G(gJump);
  const rChip = chip(right, 'it traps air: slows heat loss', { size: 30, fill: 'rgba(86,214,155,0.14)', stroke: C.good, sw: 2.5 }); tr(rChip, 860, 560);
  const rTick = tick(right, 16); tr(rTick, 860 - rChip.w / 2 - 34, 562);
  const lbAirJ = labelLine(gJump, 640, 300, PX + 18, PY - 128 * PS, 'woolly jumper traps air', { size: 28, anchor: 'start' });

  /* ================= G. animals ================= */
  const gAnim = G(root);
  const animHdr = T(gAnim, 600, 168, 'Animals insulate too', { size: 44, weight: 700, anchor: 'middle' });
  const animCards = [220, 600, 980].map(x => { const g = G(gAnim); card(g, x - 168, 200, 336, 420, { fill: C.card, stroke: C.line }); return g; });
  const animPockets = [];
  // fur
  { const g = animCards[0];
    E('rect', { x: 70, y: 500, width: 300, height: 56, rx: 10, fill: '#D9A07A' }, g);
    const r = rng(14); let d = '';
    for (let i = 0; i < 22; i++) { const x = 82 + i * 13, lean = (r() - 0.5) * 40; d += `M${x},504 Q${f1(x + lean)},${f1(400 + r() * 30)} ${f1(x + lean * 1.6 + 10)},${f1(272 + r() * 40)} `; }
    E('path', { d, fill: 'none', stroke: '#B07A4A', 'stroke-width': 5, 'stroke-linecap': 'round' }, g);
    [[118, 456], [170, 400], [226, 452], [276, 392], [320, 450], [148, 336], [250, 320], [200, 468]].forEach(([x, y], k) => {
      const halo = E('circle', { cx: x, cy: y, r: 22, fill: glow(C.air) }, g);
      const c = E('circle', { cx: x, cy: y, r: 9, fill: 'rgba(159,216,255,0.4)', stroke: C.air, 'stroke-width': 2 }, g);
      animPockets.push({ halo, c, ph: k * 0.13 });
    });
    T(g, 220, 594, 'fur traps air', { size: 30, weight: 700, anchor: 'middle' }); }
  // a bird fluffed up against the cold
  { const g = animCards[1];
    E('path', { d: 'M440,512 L760,500', stroke: '#6B4A33', 'stroke-width': 12, 'stroke-linecap': 'round' }, g);
    E('path', { d: 'M512,470 L470,500 L520,492 Z', fill: '#6E4E33' }, g);
    const fluff = []; for (let i = 0; i < 22; i++) { const a = i / 22 * TAU, rx = 96, ry = 84; fluff.push([600 + Math.cos(a) * rx * (1 + 0.07 * (i % 2)), 410 + Math.sin(a) * ry * (1 + 0.07 * (i % 2))]); }
    E('path', { d: closedPath(fluff), fill: linGrad('#A57A55', '#6A4A30', true), stroke: '#C9A27A', 'stroke-width': 3 }, g);
    E('path', { d: 'M622,378 C672,386 690,436 662,474 C636,496 594,488 590,450 C588,418 600,390 622,378 Z', fill: '#E8743A' }, g);
    E('path', { d: 'M520,392 C500,428 512,474 556,486 C592,480 596,436 578,404 C562,384 536,382 520,392 Z', fill: '#6E4E33', stroke: '#C9A27A', 'stroke-width': 2 }, g);
    E('path', { d: 'M528,420 q14,8 28,0 M530,444 q14,8 28,0 M536,466 q12,7 24,0', fill: 'none', stroke: '#B08A62', 'stroke-width': 3, 'stroke-linecap': 'round' }, g);
    E('circle', { cx: 642, cy: 360, r: 8, fill: '#1B1208' }, g); E('circle', { cx: 645, cy: 357, r: 2.5, fill: '#FFFFFF' }, g);
    E('path', { d: 'M684,366 L708,376 L684,386 Z', fill: '#E8C15A' }, g);
    E('path', { d: 'M570,494 L566,512 M600,496 L598,512', stroke: '#C98A3E', 'stroke-width': 4, 'stroke-linecap': 'round' }, g);
    [[530, 340], [668, 420], [560, 450], [640, 456], [520, 404]].forEach(([x, y], k) => {
      const halo = E('circle', { cx: x, cy: y, r: 20, fill: glow(C.air) }, g);
      const c = E('circle', { cx: x, cy: y, r: 7.5, fill: 'rgba(159,216,255,0.45)', stroke: C.air, 'stroke-width': 2 }, g);
      animPockets.push({ halo, c, ph: 0.3 + k * 0.17 });
    });
    const fl2 = rng(6); let sd = ''; for (let i = 0; i < 9; i++) sd += `M${f1(452 + fl2() * 300)},${f1(232 + fl2() * 80)} l0.1,0 `;
    E('path', { d: sd, stroke: '#EAF4FA', 'stroke-width': 6, 'stroke-linecap': 'round', opacity: 0.8 }, g);
    T(g, 600, 594, 'fluffed-up feathers', { size: 30, weight: 700, anchor: 'middle' }); }
  // a seal, cut away to show its blubber
  { const g = animCards[2];
    E('path', { d: 'M820,520 L1140,520', stroke: '#CFE7F5', 'stroke-width': 6, 'stroke-linecap': 'round' }, g);
    const BODY = 'M856,468 C840,410 880,352 950,350 C1030,348 1100,392 1112,450 C1118,480 1104,506 1070,510 L900,512 C874,510 862,492 856,468 Z';
    E('path', { d: BODY, fill: '#F4DDA0', stroke: '#5E6C78', 'stroke-width': 9, 'stroke-linejoin': 'round' }, g);
    E('path', { d: 'M890,464 C880,424 906,388 952,386 C1012,384 1066,412 1076,452 C1080,470 1070,482 1050,484 L912,486 C898,484 892,476 890,464 Z', fill: '#B5455A' }, g);
    E('path', { d: 'M1104,470 L1138,448 L1134,488 Z', fill: '#7D8C99' }, g);
    E('path', { d: 'M930,508 L904,530 L956,522 Z', fill: '#7D8C99' }, g);
    E('circle', { cx: 872, cy: 396, r: 48, fill: ball('#9AA8B4', '#5E6C78') }, g);
    E('circle', { cx: 858, cy: 386, r: 6, fill: '#101820' }, g);
    E('ellipse', { cx: 830, cy: 404, rx: 8, ry: 6, fill: '#2B2F36' }, g);
    E('path', { d: 'M836,412 L818,406 M836,416 L818,420 M840,420 L822,430', stroke: '#E8EEF2', 'stroke-width': 2, 'stroke-linecap': 'round' }, g);
    labelLine(g, 990, 290, 1010, 362, 'blubber', { size: 30, anchor: 'middle', weight: 700, fill: '#F4DDA0' });
    T(g, 980, 594, 'seals and whales', { size: 30, weight: 700, anchor: 'middle' }); }

  /* ================= update ================= */
  return t => {
    const tc = t * calm;
    const tFins = S.first - 0.6, tHouseOut = at('air') - 0.1, tAir = at('air') - 0.1, tFlask = at('flask') - 0.1, tJump = at('jumper') - 0.1, tAnim = at('animals') - 0.1;

    /* --- A: cooling fins --- */
    const aFins = beat(t, tFins, at('loft') + 0.25);
    op(gFins, aFins);
    if (aFins > 0) {
      op(finHdr, P(t, mid('fins', 0.06), 0.4, linear));
      op(chipGlow, 0.6 + 0.3 * wave(t, 1.6));
      finWaves.forEach((h, i) => { h.upd(tc + i * 0.4); op(h, P(t, mid('fins', 0.25) + i * 0.12, 0.5, linear)); });
      lblChip.set(P(t, mid('fins', 0.3), 0.4, linear)); lblFins.set(P(t, mid('fins', 0.46), 0.4, linear));
    }

    /* --- B: the house leaks; loft insulation --- */
    const aHouse = Math.min(P(t, mid('fins', 0.68), 0.5, linear), 1 - P(t, tHouseOut, 0.45, linear));
    op(gHouse, aHouse);
    if (aHouse > 0) {
      const p1 = P(t, at('loft') - 0.35, 1.0), p2 = P(t, at('cavity') - 0.25, 0.9);
      const hx = lerp(lerp(860, 600, p1), HX, p2), hy = lerp(lerp(640, 650, p1), HY, p2), hs = lerp(lerp(0.6, 1, p1), HSc, p2);
      tr(house, hx, hy, hs);
      flakeList.forEach(f => { const u = (tc * f.sp + f.ph) % 1; attr(f.el, 'cx', f.x + Math.sin(tc * 0.9 + f.sw) * 12); attr(f.el, 'cy', -530 + u * 530); });
      flakes.setAttribute('transform', house.getAttribute('transform'));
      op(flakes, 1 - p2);
      const pin = popIn(t, mid('fins', 0.7));
      tr(leakHdr, 860, 300 + (1 - clamp(pin)) * 12); op(leakHdr, clamp(pin * 2) * (1 - P(t, at('loft') - 0.4, 0.4, linear)));
      // leak arrows: on in the fins beat; the roof pair shrinks as the loft fills
      const lk = P(t, mid('fins', 0.74), 0.6, linear), wl = P(t, mid('loft', 0.18), 1.4, ease);
      [lkRoofL, lkRoofR, lkWall, lkWin].forEach(a => op(a, lk * (1 - p2)));
      const roofEnd = lerp(-480, -318, wl), roofW = lerp(11, 5, wl);
      lkRoofL.set(-110, -236, -110, lerp(-236, roofEnd, lk), roofW, tc);
      lkRoofR.set(110, -236, 110, lerp(-236, roofEnd, lk), roofW, tc + 0.3, lerp(26, 10, wl));
      lkWall.set(-150, -110, lerp(-150, -350, lk), -110, 11, tc + 0.6);
      lkWin.set(150, -160, lerp(150, 350, lk), -160, 11, tc + 0.9);
      woolIn.setAttribute('transform', `translate(0 -284) scale(1 ${Math.max(0.01, P(t, mid('loft', 0.08), 1.6, easeOut)).toFixed(3)})`);
      woolAir.forEach((c, i) => op(c, (0.35 + 0.5 * wave(t, 1.8, i * 0.13)) * P(t, mid('loft', 0.45), 0.5, linear)));
      op(tagIn, (1 - p2) * P(t, at('loft') + 0.4, 0.4, linear)); op(tagOut, (1 - p2) * P(t, at('loft') + 0.55, 0.4, linear));
      op(loftLbls, win(t, at('loft'), at('cavity') - 0.2, 0.4));
      lbLoft.set(P(t, mid('loft', 0.15), 0.4, linear)); op(lbTraps, P(t, mid('loft', 0.4), 0.4, linear));
      lbCond.set(P(t, mid('loft', 0.5), 0.4, linear)); lbConv.set(P(t, mid('loft', 0.6), 0.4, linear));
      op(roomWarm, 0.16 + 0.05 * wave(t, 2.2));
      // the cavity fills with foam in the zoom; the house's own cavities follow
      const foamH = P(t, mid('cavity', 0.3), 2.0, ease);
      [foamR, foamL].forEach(f => { attr(f, 'y', -foamH * 270); attr(f, 'height', foamH * 270); op(f, foamH > 0.005 ? 1 : 0); });
    }

    /* --- C: the zoom card: cavity wall, then double glazing --- */
    const aZoom = Math.min(P(t, at('cavity') + 0.2, 0.5, linear), 1 - P(t, tHouseOut, 0.45, linear));
    op(gZoom, aZoom);
    if (aZoom > 0) {
      const toWin = P(t, at('glazing') - 0.2, 0.6, ease);
      setZoom(lerp(-100, -212, toWin), lerp(-10, -108, toWin));
      const aCav = 1 - P(t, at('glazing') - 0.2, 0.4, linear), aWin = P(t, at('glazing') - 0.1, 0.4, linear);
      op(gCav, aCav); op(gWin, aWin);
      if (aCav > 0) {
        const foamH = P(t, mid('cavity', 0.3), 2.0, ease), still = P(t, mid('cavity', 0.3) + 1.4, 0.6, linear);
        attr(foamRect, 'y', 656 - foamH * 442); attr(foamRect, 'height', foamH * 442);
        const top = 656 - foamH * 442;
        bubs.forEach(b => op(b.el, clamp((b.y - top) / 20)));
        loopDots.forEach((d, i) => {
          const u = ((Math.min(t, mid('cavity', 0.3) + 1.6) * 0.16 * calm) + i / loopDots.length) % 1, [x, y] = along(LOOP, u);
          attr(d, 'cx', x); attr(d, 'cy', y); d.setAttribute('fill', x < 805 ? '#FFB37A' : '#9FE0FF'); op(d, 1 - still);
        });
        [loopUp, loopDown, loopTop, loopBot].forEach(a => op(a, (1 - 0.6 * still) * P(t, at('cavity') + 0.3, 0.5, linear)));
        const px = P(t, mid('cavity', 0.6), 0.4, pop); op(loopX, clamp(px * 2)); tr(loopX, 805, 430, Math.max(0.01, px));
        op(cavLbl2, P(t, at('cavity') + 0.6, 0.4, linear) * (1 - P(t, mid('cavity', 0.62), 0.3, linear)));
        op(cavLbl3, P(t, mid('cavity', 0.66), 0.4, linear));
      }
      if (aWin > 0) {
        const sp = P(t, mid('glazing', 0.22), 1.0, ease);
        attr(paneA, 'x', lerp(798, 744, sp)); attr(paneB, 'x', lerp(798, 852, sp));
        op(gapAir, P(t, mid('glazing', 0.35), 0.5, linear));
        airDots.forEach(a => { attr(a.el, 'cx', a.x + Math.sin(tc * 2.1 + a.ph) * 8); attr(a.el, 'cy', a.y + Math.cos(tc * 1.7 + a.ph) * 6); });
        const thin = P(t, mid('glazing', 0.55), 1.2, ease);
        winFlow.set(500, 430, 1110, 430, lerp(18, 6, thin), tc);
        op(condLbl, P(t, at('glazing') + 0.4, 0.4, linear));
        op(gapLbl, P(t, mid('glazing', 0.4), 0.4, linear));
      }
    }

    /* --- D: trapped air --- */
    const aAir = beat(t, tAir, tFlask + 0.35);
    op(gAir, aAir);
    if (aAir > 0) {
      op(airHdr, P(t, at('air'), 0.4, linear));
      insets.forEach((g, i) => { const p = popIn(t, at('air') + 0.1 + i * 0.25); op(g, clamp(p * 2)); tr(g, [250, 600, 950][i], 360, 0.8 + 0.2 * clamp(p)); });
      const glowOn = P(t, mid('air', 0.18), 0.6, linear);
      pockets.forEach(pk => { const w = wave(t, 1.6, pk.ph); op(pk.halo, glowOn * (0.35 + 0.55 * w)); if (pk.i === 2) { attr(pk.c, 'cx', pk.x + Math.sin(tc * 2 + pk.ph * 6) * 5); attr(pk.c, 'cy', pk.y + Math.cos(tc * 1.6 + pk.ph * 6) * 4); } });
      const c1 = popIn(t, mid('air', 0.36)), c2 = popIn(t, mid('air', 0.62));
      op(airChip1, clamp(c1 * 2)); op(airChip2, clamp(c2 * 2));
    }

    /* --- E: the vacuum flask --- */
    const aFl = beat(t, tFlask, tJump + 0.35);
    op(gFlask, aFl);
    if (aFl > 0) {
      const tf = at('flask'), tv = at('vacuum'), ts = at('silver'), tsp = at('stopper'), tco = at('cold'), tp = at('perfect');
      const slide = P(t, tf - 0.1, 0.9, easeOut);
      tr(flaskG, lerp(FX - 80, FX, slide), FY);
      // the gap: particles jiggle, then drain out through the bottom
      const drain0 = mid('vacuum', 0.04);
      gapParts.forEach(p => {
        const u = clamp((t - drain0 - p.d * 1.6) / 1.1);
        let x = p.x, y = p.y;
        if (u > 0) { const q = along(p.path, easeIn(u) * 0.6 + u * 0.4); x = q[0]; y = q[1]; }
        else { x += Math.sin(tc * 13 + p.ph) * 2.2; y += Math.cos(tc * 11 + p.ph) * 2.2; }
        attr(p.el, 'cx', x); attr(p.el, 'cy', y); op(p.el, 1 - P(u, 0.85, 0.15, linear));
      });
      const empty = P(t, mid('vacuum', 0.3), 0.6, linear);
      op(gapEmpty, empty); op(gapGlowF, empty * (0.35 + 0.25 * wave(t, 1.8)) * (1 - P(t, ts, 0.5, linear)));
      lbVac.set(P(t, mid('vacuum', 0.3), 0.4, linear));
      // conduction and convection arrows hit the empty gap and stop
      const va = win(t, mid('vacuum', 0.5), ts - 0.2, 0.3);
      op(vacArrows, va); op(fCond, va * P(t, mid('vacuum', 0.5), 0.3, linear)); op(fConv, va * P(t, mid('vacuum', 0.7), 0.3, linear));
      condA.set(-30, 60, lerp(-30, -96, P(t, mid('vacuum', 0.5), 0.5, easeOut)), 60, 8, tc);
      convA.set(-20, 190, lerp(-20, -96, P(t, mid('vacuum', 0.7), 0.5, easeOut)), lerp(190, 150, P(t, mid('vacuum', 0.7), 0.5, easeOut)), 8, tc, -18);
      const xc = popIn(t, mid('vacuum', 0.62)), xv = popIn(t, mid('vacuum', 0.82));
      op(xCond, clamp(xc * 2)); op(xConv, clamp(xv * 2)); tr(xCond, -107, 60, Math.max(0.01, xc)); tr(xConv, -107, 150, Math.max(0.01, xv));
      // silvered walls reflect radiation back in
      const sv = P(t, mid('silver', 0.04), 0.8, linear);
      op(silverG, sv); lbSilver.set(P(t, mid('silver', 0.12), 0.4, linear));
      const gl = P(t, mid('silver', 0.08), 1.4, linear); op(glint, Math.sin(gl * Math.PI)); tr(glint, -118, lerp(-110, 200, gl));
      const sr = win(t, mid('silver', 0.34), tco + 0.1, 0.3);
      silverRays.forEach((pair, i) => { op(pair[0], sr); op(pair[1], sr); const s0 = mid('silver', 0.34) + i * 0.1, s1 = s0 + pair[0].L / pair[0].sp / calm; pair[0].upd(tc, grow(t, s0, pair[0])); pair[1].upd(tc, grow(t, s1, pair[1])); });
      // the stopper: ajar with steam escaping, then pressed home
      const press = P(t, mid('stopper', 0.18), 0.6, easeOut);
      tr(stopper, 0, lerp(-52, 0, press) + 3 * Math.sin(Math.PI * P(t, mid('stopper', 0.18) + 0.6, 0.25, linear)));
      const stm = (1 - P(t, mid('stopper', 0.22), 0.5, linear));
      steam.upd(tc); op(steam, stm * P(t, tf, 0.6, linear));
      steamDots.forEach((d, i) => { const u = (tc * 0.5 + i / 4) % 1; attr(d, 'cx', (i % 2 ? 1 : -1) * (48 + Math.sin(u * 7 + i) * 8)); attr(d, 'cy', -250 - u * 80); op(d, stm * Math.sin(u * Math.PI) * 0.9 * P(t, tf, 0.6, linear)); });
      lbStop.set(P(t, mid('stopper', 0.12), 0.4, linear));
      op(topNote, win(t, mid('stopper', 0.62), tco + 0.1, 0.35));
      op(tnA, P(t, mid('stopper', 0.62), 0.4, linear)); op(tnB, P(t, mid('stopper', 0.8), 0.4, linear));
      // cold drink: blue, iced; warmth from outside is turned back
      const cold = win(t, mid('cold', 0.02), tp + 0.1, 0.5);
      op(drinkCold, cold);
      ice.forEach((c, i) => op(c, clamp(cold * 1.2 - i * 0.1)));
      const tn = win(t, mid('cold', 0.4), tp + 0.1, 0.35), tg = P(t, mid('cold', 0.4), 0.9, easeOut);
      op(turnL, tn); op(turnR, tn); op(lbIn, tn);
      turnL.set(-262, 70, -262, lerp(70, 190, tg), 7, tc, -280); turnR.set(262, 70, 262, lerp(70, 190, tg), 7, tc, 280);
      // no flask is perfect: wisps leak through the stopper and the supports
      const lkp = P(t, mid('perfect', 0.24), 0.6, linear);
      leakTop.upd(tc); op(leakTop, lkp);
      leakBot.forEach((a, i) => { op(a, lkp); a.set(i ? 30 : -30, 236, i ? 30 : -30, lerp(236, 276, lkp), 4.5, tc); });
      lbSup.set(P(t, mid('perfect', 0.4), 0.4, linear)); op(leakNote, P(t, mid('perfect', 0.3), 0.4, linear));
      // the drink's temperature
      op(tag, P(t, tf + 0.6, 0.4, linear));
      const cool = P(t, mid('perfect', 0.5), 3.0, linear);
      const temp = cold > 0.5 ? 5 : Math.round(80 - 22 * cool);
      setText(tag.txt, temp + ' °C'); tag.th.set(cold > 0.5 ? 0.1 : 0.82 - 0.3 * cool);
      op(clock, P(t, mid('perfect', 0.48), 0.4, linear)); clockHand.setAttribute('transform', `rotate(${(cool * 720).toFixed(1)})`);
      // scorecard: all three ways blocked
      op(scoreHdr, P(t, mid('flask', 0.3), 0.4, linear) * (1 - P(t, tco - 0.2, 0.4, linear)));
      score.forEach((s, i) => {
        const p = popIn(t, mid('flask', 0.36 + i * 0.1));
        op(s.g, clamp(p * 2) * (1 - P(t, tco - 0.2, 0.4, linear)));
        const tx = i === 0 ? mid('vacuum', 0.62) : i === 1 ? mid('vacuum', 0.82) : mid('silver', 0.55);
        const xp = popIn(t, tx); op(s.x, clamp(xp * 2)); tr(s.x, s.g.w / 2 + 28, 0, Math.max(0.01, xp));
        s.g.box.setAttribute('stroke', xp > 0.5 ? C.bad : C.line);
      });
    }

    /* --- F: the jumper --- */
    const aJ = beat(t, tJump, tAnim + 0.35);
    op(gJump, aJ);
    if (aJ > 0) {
      const on = P(t, mid('jumper', 0.42), 0.6, easeOut), slow = P(t, mid('jumper', 0.5), 1.4, ease);
      op(jumper, on); jumper.setAttribute('transform', `translate(0 ${((1 - on) * -20).toFixed(1)})`);
      jArrows.forEach((a, i) => {
        const x0 = PX + a.s * 74, len = lerp(170, 64, slow), w = lerp(10, 5, slow), tw = tc * lerp(1, 0.35, slow);
        op(a.f, P(t, at('jumper') - 0.1 + i * 0.08, 0.4, linear));
        a.f.set(x0, a.y, x0 + a.s * len, a.y + (a.y < 400 ? -18 : 18) * len / 170, w, tw + i * 0.3);
      });
      jAir.forEach((c, i) => op(c, P(t, mid('jumper', 0.52), 0.4, linear) * (0.5 + 0.5 * wave(t, 1.5, i * 0.14))));
      const pw = popIn(t, mid('jumper', 0.04)); op(wrong, clamp(pw * 2));
      wStrike.set(P(t, mid('jumper', 0.2), 0.5)); op(wX, P(t, mid('jumper', 0.24), 0.3, linear));
      lbAirJ.set(P(t, mid('jumper', 0.5), 0.4, linear));
      const pr = popIn(t, mid('jumper', 0.62)); op(right, clamp(pr * 2)); tr(right, 0, (1 - clamp(pr)) * 14);
    }

    /* --- G: animals --- */
    const aA = P(t, tAnim, 0.45, linear);
    op(gAnim, aA);
    if (aA > 0) {
      op(animHdr, P(t, at('animals'), 0.4, linear));
      animCards.forEach((g, i) => { const p = popIn(t, mid('animals', [0.14, 0.3, 0.56][i])); op(g, clamp(p * 2)); tr(g, 0, (1 - clamp(p)) * 24); });
      const gl = P(t, mid('animals', 0.36), 0.6, linear);
      animPockets.forEach(pk => op(pk.halo, gl * (0.35 + 0.55 * wave(t, 1.6, pk.ph))));
    }
  };
});
