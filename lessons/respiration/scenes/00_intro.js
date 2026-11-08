/* Intro: trillions of cells -> zoom into one -> toast feeds it glucose -> energy sparks.
   "No flames, no smoke" icons -> title -> a three-step roadmap. */
scene('intro', S => {
  const { at, end, mid } = S, root = S.root;

  /* --- trillions of cells: a mosaic that we zoom through --- */
  const mosaic = G(root), tiles = [];
  const rr = rng(21);
  for (let row = 0; row < 8; row++) for (let col = 0; col < 13; col++) {
    const x = col * 98 + (row % 2) * 49 - 10, y = row * 92 + 20;
    const c = animalCell(mosaic, 40, 36, { sw: 3, nr: 11, seed: row * 13 + col, amp: 0.04 });
    tr(c, x, y);
    tiles.push({ c, x, y, d: rr() * 0.9 + Math.hypot(x - 830, y - 420) / 1400 });
  }
  const zoomTo = [830, 420];

  /* --- the world: toast + one big cell with mitochondria --- */
  const world = G(root);
  const toast = G(world);
  E('path', { d: 'M-95,95 L-95,-20 C-132,-40 -126,-112 -60,-112 C-30,-138 30,-138 60,-112 C126,-112 132,-40 95,-20 L95,95 Q95,107 83,107 L-83,107 Q-95,107 -95,95 Z', fill: '#C8833A', stroke: '#8A5221', 'stroke-width': 7, 'stroke-linejoin': 'round' }, toast);
  E('path', { d: 'M-95,95 L-95,-20 C-132,-40 -126,-112 -60,-112 C-30,-138 30,-138 60,-112 C126,-112 132,-40 95,-20 L95,95 Q95,107 83,107 L-83,107 Q-95,107 -95,95 Z', fill: '#F2C46E', transform: 'translate(0 6) scale(0.8)' }, toast);
  E('path', { d: 'M-40,-20 l18,18 M10,-50 l18,18 M30,20 l18,18 M-50,40 l18,18', stroke: '#C98A3E', 'stroke-width': 7, 'stroke-linecap': 'round', opacity: 0.6 }, toast);
  T(toast, 0, 160, 'breakfast', { size: 30, weight: 600, fill: C.muted, anchor: 'middle' });
  const toastPos = [255, 410];

  const cellPos = [830, 420];
  const cellG = G(world);
  const cell = animalCell(cellG, 300, 250, { sw: 6, seed: 4, amp: 0.02 });
  const mitos = [[70, -95, 18], [140, 70, -28], [-40, 135, 8]].map(([x, y, r]) => {
    const m = mitochondrion(cell.inner, 130, 58, { glow: true });
    tr(m, x, y, 1, r);
    return { m, x, y };
  });
  T(cellG, 0, 300, 'one of your cells', { size: 30, weight: 600, fill: C.muted, anchor: 'middle' });

  // glucose stream and the sparks it releases
  const N = 30, stream = [];
  const sr = rng(9);
  const fly = G(world), pops = G(world);
  for (let k = 0; k < N; k++) {
    const g = molGlucose(fly, 30);
    const target = mitos[k % 3];
    const sp = spark(pops, 16, { seed: k });
    const ang = sr() * TAU;
    stream.push({ g, sp, t0: 3.6 + k * 0.46, bend: (sr() - 0.5) * 160, target, ang, dist: 90 + sr() * 70 });
  }

  /* --- "no flames, no smoke, not hot" --- */
  const icons = G(root);
  const flame = G(icons); tr(flame, 420, 112);
  E('path', { d: 'M0,-48 C26,-18 34,4 28,22 C22,40 8,48 0,48 C-8,48 -24,40 -28,22 C-32,6 -18,-8 -10,-24 C-8,-10 -2,-4 4,-2 C8,-16 4,-32 0,-48 Z', fill: '#FF8A3D', stroke: '#FFC27A', 'stroke-width': 3 }, flame);
  const smoke = G(icons); tr(smoke, 600, 112);
  E('path', { d: 'M-40,20 C-60,20 -60,-6 -40,-8 C-44,-30 -14,-38 -4,-22 C4,-40 34,-36 34,-14 C56,-14 56,20 34,20 Z', fill: '#8A9BAA', stroke: '#C4D0DA', 'stroke-width': 3 }, smoke);
  const thermo = G(icons); tr(thermo, 780, 150, 0.5);
  const th = thermometer(thermo, 150, C.good); th.set(0.35);
  const deg = T(icons, 830, 120, '37 °C', { size: 34, weight: 700, fill: C.good });
  const x1 = cross(icons, 30); tr(x1, 420, 112);
  const x2 = cross(icons, 30); tr(x2, 600, 112);
  const iconEls = [[flame, x1], [smoke, x2], [thermo]];

  /* --- title --- */
  const title = G(root);
  T(title, 0, 0, 'Respiration', { size: 112, weight: 700, anchor: 'middle', fill: C.ink });
  const sub = T(title, 0, 62, 'the chemical reaction that releases energy from food', { size: 32, weight: 500, anchor: 'middle', fill: C.muted });

  /* --- roadmap --- */
  const road = G(root);
  const stops = [
    { x: 240, text: 'Into a cell', draw: g => { tr(molGlucose(g, 34), -52, -10); const a = arrow(g, -10, -10, 30, -10, { color: C.muted, width: 5 }); const c = animalCell(g, 46, 40, { sw: 4, nr: 12 }); tr(c, 80, -10); return [a, c]; } },
    { x: 600, text: 'Where the energy goes', draw: g => { const s = spark(g, 40); tr(s, 0, -10); return [s]; } },
    { x: 960, text: 'When oxygen runs out', draw: g => { tr(molO2(g, 22), -50, -10); const m = meter(g, { w: 26, h: 110, vertical: true, color: C.oxygen }); tr(m, 40, -65); return [m]; } },
  ].map(st => {
    const g = G(road); tr(g, st.x, 440);
    card(g, -160, -130, 320, 270, { fill: C.card, stroke: C.line });
    const art = G(g); tr(art, 0, -20);
    const parts = st.draw(art);
    T(g, 0, 100, st.text, { size: 29, weight: 600, anchor: 'middle' });
    return { g, parts };
  });
  const roadArrows = [arrow(road, 404, 440, 436, 440, { color: C.faint, width: 5 }), arrow(road, 764, 440, 796, 440, { color: C.faint, width: 5 })];

  return t => {
    // mosaic: tiles fade in, then the camera dives into one cell
    const zoom = P(t, 2.3, 1.5, easeIn);
    op(mosaic, (t < 0.3 ? 0 : 1) * (1 - P(t, 2.8, 0.9, linear)));
    if (t < 4) {
      tiles.forEach(o => { op(o.c, P(t, 0.4 + o.d, 0.5, linear) * 0.9); o.c.upd(t + o.d * 3); });
      const s = 1 + zoom * 7;
      mosaic.setAttribute('transform', `translate(${zoomTo[0]} ${zoomTo[1]}) scale(${s.toFixed(3)}) translate(${-zoomTo[0]} ${-zoomTo[1]})`);
    }

    // world placement: normal, then lower and smaller to make room for the title
    const dp = P(t, at('def') - 0.2, 1.0);
    const ws = lerp(1, 0.84, dp), wy = lerp(0, 74, dp);
    world.setAttribute('transform', `translate(600 ${420 + wy}) scale(${ws.toFixed(3)}) translate(-600 -420)`);
    op(world, P(t, 2.7, 0.8, linear) * (1 - P(t, at('plan') + 0.1, 0.6, linear)));
    const cp = P(t, 2.7, 1.1, easeOut);
    tr(cellG, cellPos[0], cellPos[1], 0.55 + 0.45 * cp);
    cell.upd(t);
    mitos.forEach((o, i) => o.m.upd(t + i));
    const tp = P(t, 3.0, 0.7, pop);
    tr(toast, toastPos[0] - (1 - tp) * 60, toastPos[1], Math.max(0.01, tp));
    op(toast, P(t, 3.0, 0.3, linear));

    // glucose flies from the toast into a mitochondrion; a spark pops out
    const cs = 0.55 + 0.45 * cp;
    stream.forEach(o => {
      const u = (t - o.t0) / 1.7;
      if (u <= 0 || u >= 1) op(o.g, 0);
      else {
        const p = ease(u);
        const tx = cellPos[0] + o.target.x * cs, ty = cellPos[1] + o.target.y * cs;
        const x0 = toastPos[0] + 40, y0 = toastPos[1] - 30, cx = (x0 + tx) / 2, cy = Math.min(y0, ty) - 120 + o.bend;
        const x = (1 - p) * (1 - p) * x0 + 2 * (1 - p) * p * cx + p * p * tx;
        const y = (1 - p) * (1 - p) * y0 + 2 * (1 - p) * p * cy + p * p * ty;
        tr(o.g, x, y, 0.62 * (1 - 0.5 * P(u, 0.8, 0.2, linear)), u * 200);
        op(o.g, Math.min(1, u * 6) * (1 - P(u, 0.85, 0.15, linear)));
      }
      const v = (t - o.t0 - 1.7) / 1.4;
      if (v <= 0 || v >= 1) op(o.sp, 0);
      else {
        const tx = cellPos[0] + o.target.x * cs, ty = cellPos[1] + o.target.y * cs, d = easeOut(v) * o.dist;
        tr(o.sp, tx + Math.cos(o.ang) * d, ty + Math.sin(o.ang) * d, 0.5 + 0.7 * Math.sin(v * Math.PI));
        op(o.sp, Math.sin(v * Math.PI));
        o.sp.upd(t);
      }
    });

    // no flames / no smoke / body temperature
    const ia = 1 - P(t, at('def') - 0.1, 0.5, linear);
    op(icons, ia);
    iconEls.forEach((els, i) => {
      const p = P(t, mid('noflame', 0.05 + i * 0.3), 0.5, pop);
      els.forEach(e => op(e, clamp(p * 3)));
      if (els[1]) { const xp = P(t, mid('noflame', 0.05 + i * 0.3) + 0.35, 0.3, easeOut); op(els[1], xp); tr(els[1], i === 0 ? 420 : 600, 112, 0.4 + 0.6 * xp); }
    });
    op(deg, P(t, mid('noflame', 0.7), 0.4, linear));

    // title
    const tp2 = P(t, at('def') + 0.1, 0.9, easeOut), tq = P(t, at('plan') + 0.1, 0.9);
    op(title, tp2);
    tr(title, 600, lerp(lerp(205, 170, tp2), 150, tq), lerp(1, 0.72, tq));
    op(sub, P(t, mid('def', 0.25), 0.6, linear));

    // roadmap
    op(road, P(t, at('plan'), 0.4, linear));
    const showAt = [mid('plan', 0.02), mid('plan', 0.42), mid('plan', 0.7)];
    stops.forEach((st, i) => {
      const p = P(t, showAt[i], 0.6, pop);
      op(st.g, clamp(p * 2));
      tr(st.g, [240, 600, 960][i], 440 + (1 - clamp(p)) * 30, 0.9 + 0.1 * clamp(p));
    });
    const [a1, c1] = stops[0].parts; a1.set(P(t, showAt[0] + 0.4, 0.6)); c1.upd(t);
    stops[1].parts[0].upd(t);
    stops[2].parts[0].set(1 - P(t, showAt[2] + 0.5, 2.2));
    roadArrows.forEach((a, i) => { a.set(P(t, showAt[i + 1] - 0.2, 0.5)); op(a, P(t, showAt[i + 1] - 0.2, 0.2, linear)); });
  };
});
