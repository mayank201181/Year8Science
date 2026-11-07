/* Solutions: solute, solvent, solubility.
   Beats: showpiece: a sugar cube vanishes into stirred tea while, in the zoom, its particles break away and
   spread out between the water particles -> solute + solvent = solution -> salt dissolves (soluble), sand
   settles (insoluble) -> spoonful after spoonful until the tea is saturated -> solubility rises with
   temperature: cold and hot tea -> dilute and concentrated particle squares -> squash: + squash, + water
   -> the zoom again: the sugar is still there -> 10 g + 100 g = 110 g on a balance; evaporating gets the
   salt back. */
scene('solutions', S => {
  const { at, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.3 : 1;

  /* ---------- local helpers ---------- */
  let nid = 0;
  const uid = () => 'ecmSol' + (++nid);
  function clipCircle(cx, cy, r) { const id = uid(), cp = E('clipPath', { id }, defs()); return { url: `url(#${id})`, el: E('circle', { cx, cy, r }, cp) }; }
  function clipPathD(d) { const id = uid(), cp = E('clipPath', { id }, defs()); E('path', { d }, cp); return `url(#${id})`; }
  const scaleAt = (el, cx, cy, s) => el.setAttribute('transform', `translate(${cx} ${cy}) scale(${Math.max(0.001, s).toFixed(4)}) translate(${-cx} ${-cy})`);
  const polyD = pts => 'M' + pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' L');
  function rich(parent, x, y, segs, o) {
    o = o || {};
    const t = E('text', { x, y, 'font-size': o.size || 30, 'font-weight': o.weight || 600, 'font-family': o.font || FD, 'text-anchor': o.anchor || 'start', fill: o.fill || C.ink }, parent);
    segs.forEach(s => { if (typeof s === 'string') s = [s]; E('tspan', { fill: s[1], 'font-weight': s[2] }, t).textContent = s[0]; });
    return t;
  }
  const hex2 = c => [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)];
  const mixC = (a, b, p) => { const x = hex2(a), y = hex2(b); return `rgb(${x.map((v, i) => Math.round(lerp(v, y[i], clamp(p)))).join(',')})`; };
  /* table sugar: a glucose hexagon joined to a fructose pentagon, amber like glucose. One element:
     the two rings and the short link between them are subpaths of a single path. */
  function sugar(parent, s) {
    const hex = [], pen = [];
    for (let i = 0; i < 6; i++) { const a = Math.PI / 6 + i * Math.PI / 3; hex.push([-s + Math.cos(a) * s, Math.sin(a) * s]); }
    for (let i = 0; i < 5; i++) { const a = Math.PI + i * TAU / 5; pen.push([s * 1.02 + Math.cos(a) * s * 0.86, Math.sin(a) * s * 0.86]); }
    const x0 = -s * 0.134, x1 = s * 0.17, hy = s * 0.12;
    const link = `M${x0.toFixed(1)},${(-hy).toFixed(1)} L${x1.toFixed(1)},${(-hy).toFixed(1)} L${x1.toFixed(1)},${hy.toFixed(1)} L${x0.toFixed(1)},${hy.toFixed(1)} Z`;
    return E('path', { d: polyD(hex) + 'Z' + polyD(pen) + 'Z' + link, fill: ball(C.glucose, C.glucoseDk), stroke: C.glucoseDk, 'stroke-width': Math.max(1.4, s * 0.12), 'stroke-linejoin': 'round' }, parent);
  }
  const waterBall = (parent, r) => E('circle', { r: r || 11, fill: ball(C.water, C.waterDk) }, parent);
  /* a sugar cube in 3D, centred, about 2s tall */
  function sugarCube(parent, s) {
    const g = G(parent), k = s * 0.87;
    E('path', { d: `M${-k},${-s * 0.5} L0,0 L0,${s} L${-k},${s * 0.5} Z`, fill: '#E6EBEF', stroke: '#FFFFFF', 'stroke-width': 1.5, 'stroke-linejoin': 'round' }, g);
    E('path', { d: `M0,0 L${k},${-s * 0.5} L${k},${s * 0.5} L0,${s} Z`, fill: '#C9D3DC', stroke: '#FFFFFF', 'stroke-width': 1.5, 'stroke-linejoin': 'round' }, g);
    E('path', { d: `M0,${-s} L${k},${-s * 0.5} L0,0 L${-k},${-s * 0.5} Z`, fill: '#FFFFFF', stroke: '#FFFFFF', 'stroke-width': 1.5, 'stroke-linejoin': 'round' }, g);
    let dots = ''; const r = rng(3);
    for (let i = 0; i < 14; i++) { const x = (r() - 0.5) * k * 1.7, y = (r() - 0.2) * s; dots += `M${x.toFixed(1)},${y.toFixed(1)} h0.1 `; }
    E('path', { d: dots, stroke: '#AEBBC6', 'stroke-width': 3, 'stroke-linecap': 'round', opacity: 0.7 }, g);
    return g;
  }
  /* a teaspoon: bowl at (0,0), handle up and to the right; heap: colour of what's in it */
  function spoon(parent, heap, len) {
    const g = G(parent), L = len || 126;
    E('path', { d: `M14,-6 L${(14 + L * 0.84).toFixed(1)},${(-6 - L * 0.54).toFixed(1)}`, stroke: linGrad('#E1E8EE', '#8A9BA8'), 'stroke-width': 9, 'stroke-linecap': 'round' }, g);
    E('ellipse', { cx: 0, cy: 0, rx: 26, ry: 13, fill: ball('#E9EEF2', '#8A9BA8'), stroke: '#F4F7FA', 'stroke-width': 2 }, g);
    g.heap = heap ? E('path', { d: 'M-21,-3 Q-12,-17 0,-17 Q12,-17 21,-3 Z', fill: heap, stroke: '#FFFFFF', 'stroke-width': 1.5 }, g) : null;
    return g;
  }
  /* beaker with things drawn between its glass and its liquid: returns { g, b, back } */
  function beakerWith(parent, w, h, o) {
    const g = G(parent), b = beaker(g, w, h, o), back = G(b);
    b.insertBefore(back, b.liquid);
    return { g, b, back };
  }
  /* evaporating basin on a tripod and gauze over a Bunsen burner. Origin: the floor under the burner.
     g.set(level 0..1) the liquid in the basin; g.crust(p) the solid left behind; g.burner is the kit bunsen. */
  function basinRig(parent) {
    const g = G(parent);
    g.burner = bunsen(g);
    E('path', { d: 'M0,-8 L0,-226', stroke: '#1C2126', 'stroke-width': 8, 'stroke-linecap': 'round' }, g);
    E('path', { d: 'M-88,0 L-66,-226 M88,0 L66,-226', stroke: '#1C2126', 'stroke-width': 9, 'stroke-linecap': 'round' }, g);
    E('path', { d: 'M-86,-6 L-66,-220 M86,-6 L66,-220', stroke: '#56626C', 'stroke-width': 2.5, 'stroke-linecap': 'round' }, g);
    E('rect', { x: -84, y: -234, width: 168, height: 12, rx: 5, fill: '#1C2126', stroke: '#56626C', 'stroke-width': 2 }, g);
    E('path', { d: 'M-106,-236 L106,-236 L86,-252 L-86,-252 Z', fill: '#76808A', stroke: '#C9D1D8', 'stroke-width': 2, 'stroke-linejoin': 'round' }, g);
    let mesh = '';
    for (let i = 1; i < 8; i++) mesh += `M${-106 + i * 26.5},-236 L${-86 + i * 21.5},-252 `;
    for (let j = 1; j < 3; j++) { const y = -236 - j * 16 / 3, dx = 20 * j / 3; mesh += `M${-106 + dx},${y.toFixed(1)} L${106 - dx},${y.toFixed(1)} `; }
    E('path', { d: mesh, stroke: '#C9D1D8', 'stroke-width': 1.2, opacity: 0.7 }, g);
    E('path', { d: 'M-96,-302 Q-92,-251 0,-248 Q92,-251 96,-302 Z', fill: ball('#FFFFFF', '#AEBAC4'), stroke: '#E9EEF2', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, g);
    E('ellipse', { cx: 0, cy: -302, rx: 96, ry: 17, fill: '#8E9AA5', stroke: '#FFFFFF', 'stroke-width': 3 }, g);
    const liq = E('ellipse', { cx: 0, cy: -300, rx: 88, ry: 13, fill: C.water, opacity: 0.9 }, g);
    const crust = G(g);
    E('ellipse', { cx: 0, cy: -292, rx: 66, ry: 9, fill: '#FFFFFF', stroke: '#E4EDF2', 'stroke-width': 2 }, crust);
    { const r = rng(9); let d = ''; for (let i = 0; i < 16; i++) { const a = r() * TAU, q = Math.sqrt(r()); d += `M${(Math.cos(a) * 58 * q).toFixed(1)},${(-292 + Math.sin(a) * 6 * q).toFixed(1)} h0.1 `; } E('path', { d, stroke: '#B5C3CE', 'stroke-width': 4, 'stroke-linecap': 'round' }, crust); }
    E('circle', { cx: 0, cy: -294, r: 46, fill: glow('#FFFFFF'), opacity: 0.6 }, crust);
    g.set = lv => { lv = clamp(lv); attr(liq, 'rx', 26 + 62 * lv); attr(liq, 'ry', 4 + 9 * lv); attr(liq, 'cy', -289 - 11 * lv); op(liq, lv > 0.03 ? 0.9 : lv * 30); };
    g.crust = p => op(crust, p);
    g.set(1); g.crust(0);
    return g;
  }
  /* top-pan balance: origin = centre of the pan's top; g.read is its display text */
  function balance(parent) {
    const g = G(parent);
    E('rect', { x: -160, y: 20, width: 320, height: 96, rx: 18, fill: linGrad('#9AA8B4', '#5E6B76', true), stroke: '#C2CDD6', 'stroke-width': 3 }, g);
    E('rect', { x: -14, y: 4, width: 28, height: 18, fill: '#56636E' }, g);
    E('rect', { x: -130, y: -6, width: 260, height: 12, rx: 6, fill: linGrad('#EEF4F7', '#9DB0BF', true), stroke: '#FFFFFF', 'stroke-width': 1.5 }, g);
    E('rect', { x: -86, y: 40, width: 172, height: 56, rx: 9, fill: '#0E2B1A', stroke: '#2F4A3A', 'stroke-width': 2 }, g);
    g.read = T(g, 66, 81, '0 g', { size: 38, weight: 700, anchor: 'end', fill: '#7CFF9E' });
    E('circle', { cx: 122, cy: 68, r: 9, fill: '#3A4752', stroke: '#9DB0BF', 'stroke-width': 2 }, g);
    return g;
  }
  /* a squash tumbler: g.set(level, colour) */
  function tumbler(parent) {
    const g = G(parent);
    const d = 'M-72,-120 L72,-120 L60,112 Q58,126 44,126 L-44,126 Q-58,126 -60,112 Z';
    const cl = clipPathD(d);
    E('path', { d, fill: 'rgba(200,230,250,0.08)' }, g);
    const inG = G(g, { 'clip-path': cl });
    const liq = E('rect', { x: -80, y: 0, width: 160, height: 140, fill: '#F59A2E', opacity: 0.92 }, inG);
    const surf = E('rect', { x: -80, y: 0, width: 160, height: 7, fill: '#FFFFFF', opacity: 0.3 }, inG);
    E('path', { d, fill: 'none', stroke: '#DDEEF6', 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
    E('path', { d: 'M-52,-102 L-44,98', stroke: '#FFFFFF', 'stroke-width': 6, opacity: 0.2, 'stroke-linecap': 'round' }, g);
    g.set = (level, color) => { const y = 126 - 246 * clamp(level); attr(liq, 'y', y); attr(liq, 'height', 140 - y); attr(surf, 'y', y); if (color) liq.setAttribute('fill', color); };
    return g;
  }
  /* falling grains during a pour window [t0, t1] from (x0, y0) to y1; o: n, color, size, life */
  function pourGrains(parent, n, color, size, seed) {
    const r = rng(seed), gs = [];
    for (let k = 0; k < n; k++) gs.push({ el: E('rect', { x: -size / 2, y: -size / 2, width: size, height: size, rx: size * 0.25, fill: color }, parent), dx: (r() - 0.5) * 24, ph: k / n });
    return (t, t0, t1, x0, y0, y1, life) => gs.forEach(gr => {
      const u = ((t - t0) / life + gr.ph) % 1, te = t - u * life, on = t > t0 && te >= t0 && te <= t1;
      op(gr.el, on ? Math.min(1, u * 8, (1 - u) * 6) : 0);
      if (on) tr(gr.el, x0 + gr.dx * (0.3 + u), y0 + u * u * (y1 - y0), 1, u * 280);
    });
  }

  /* ================= A. tea: dissolving (also used again for "not destroyed") ================= */
  const A = G(root);
  const ZX = 800, ZY = 425, ZR = 175, SX = 300, SY = 528, SR = 32, BX = 280, BY = 470;
  const coneG = G(A);
  {
    const dx = ZX - SX, dy = ZY - SY, d = Math.hypot(dx, dy), th = Math.atan2(dy, dx), ph = Math.acos((SR - ZR) / d);
    const p = (cx, cy, r, a) => (cx + Math.cos(a) * r).toFixed(1) + ',' + (cy + Math.sin(a) * r).toFixed(1);
    const a1 = p(SX, SY, SR, th + ph), a2 = p(ZX, ZY, ZR, th + ph), b2 = p(ZX, ZY, ZR, th - ph), b1 = p(SX, SY, SR, th - ph);
    E('path', { d: `M${a1} L${a2} L${b2} L${b1} Z`, fill: 'rgba(228,237,242,0.07)' }, coneG);
    E('path', { d: `M${a1} L${a2} M${b1} L${b2}`, stroke: '#9FB7C6', 'stroke-width': 2.5, opacity: 0.75 }, coneG);
  }
  const teaB = beakerWith(A, 230, 270, { level: 0.68, liquid: '#9A5B2E' }); tr(teaB.g, BX, BY);
  const cubeG = G(teaB.back); sugarCube(cubeG, 24);
  const stirG = G(teaB.back), stirSpoon = spoon(stirG, null, 215);
  const swirl = E('path', { d: 'M-70,0 A70,9 0 0 0 40,7', fill: 'none', stroke: '#E8C9A8', 'stroke-width': 3, 'stroke-linecap': 'round', opacity: 0.5 }, teaB.g);
  const splash = E('ellipse', { cx: 0, cy: -36, rx: 30, ry: 6, fill: 'none', stroke: '#F2D7B8', 'stroke-width': 3 }, teaB.g);
  const srcRing = E('circle', { cx: SX, cy: SY, r: SR, fill: 'rgba(228,237,242,0.10)', stroke: '#E4EDF2', 'stroke-width': 4, 'stroke-dasharray': '7 5' }, A);
  const lensG = G(A);
  E('circle', { cx: ZX, cy: ZY, r: ZR, fill: '#0B1D28' }, lensG);
  const lc = clipCircle(ZX, ZY, ZR - 5);
  const inLens = G(lensG, { 'clip-path': lc.url });
  E('circle', { cx: ZX, cy: ZY, r: ZR * 1.05, fill: glow('#5E3A1E'), opacity: 0.45 }, inLens);
  const W_PTS = [];
  { const r = rng(61), dx = 46, dy = 40;
    for (let j = -5; j <= 5; j++) for (let i = -5; i <= 5; i++) {
      const x = i * dx + (j & 1 ? dx / 2 : 0), y = j * dy;
      if (Math.hypot(x, y) > 168) continue;
      W_PTS.push({ x: ZX + x + (r() - 0.5) * 8, y: ZY + y + (r() - 0.5) * 8, ph: r() * TAU });
    } }
  const waterG = G(inLens), waters = W_PTS.map(p => ({ el: waterBall(waterG, 11), p }));
  // the sugar cube's crystal in the zoom, and where each of its particles ends up
  const BLK = { x0: ZX - 64, x1: ZX + 64, y1: ZY + 132, rows: 3, cols: 4 };
  const blockBack = E('rect', { x: BLK.x0 - 6, y: BLK.y1 - 60, width: BLK.x1 - BLK.x0 + 12, height: 62, rx: 8, fill: '#FFF6E0', stroke: '#FFE29A', 'stroke-width': 2 }, inLens);
  const targets = [];
  { const cands = [];
    for (let y = ZY - 140; y <= ZY + 140; y += 5) for (let x = ZX - 140; x <= ZX + 140; x += 5) {
      if (Math.hypot(x - ZX, y - ZY) > 138) continue;
      if (y > BLK.y1 - 72 && Math.abs(x - ZX) < 90) continue;
      let m = 1e9; W_PTS.forEach(p => { m = Math.min(m, Math.hypot((x - p.x) * 0.8, y - p.y)); });
      cands.push([x, y, m]);
    }
    cands.sort((a, b) => b[2] - a[2]);
    for (let sep = 70; sep > 30 && targets.length < 12; sep -= 4) {
      targets.length = 0;
      for (const c of cands) { if (targets.length >= 12) break; if (targets.every(s => Math.hypot(s[0] - c[0], s[1] - c[1]) > sep)) targets.push(c); }
    }
    targets.sort((a, b) => b[1] - a[1]);
  }
  const sugars = [];
  for (let k = 0; k < 12; k++) {
    const row = Math.floor(k / 4), col = k % 4;
    const g = G(inLens);
    const halo = E('circle', { r: 26, fill: glow(C.glucose) }, g);
    sugar(g, 8.5);
    const tg = targets[(k * 5) % 12];
    sugars.push({ g, halo, bx: BLK.x0 + 16 + col * 32, by: BLK.y1 - 50 + row * 19, tx: tg[0], ty: tg[1], k, rot: (k * 37) % 50 - 25, t0: 0 });
  }
  E('circle', { cx: ZX, cy: ZY, r: ZR, fill: 'none', stroke: '#9FB3C2', 'stroke-width': 12 }, lensG);
  E('circle', { cx: ZX, cy: ZY, r: ZR - 8, fill: 'none', stroke: '#5E7484', 'stroke-width': 3 }, lensG);
  // words for tea / words / notgone
  const cubeLbl = T(A, 360, 236, 'sugar cube', { size: 30, weight: 700, fill: '#FFF6E0' });
  const hdrDiss = T(A, 600, 168, 'dissolved', { size: 54, weight: 700, anchor: 'middle', fill: C.glucose });
  const solnLbl = rich(A, BX, 664, ['a ', ['solution', '#F2C79A', 800]], { size: 36, anchor: 'middle' });
  const solU = sugars.reduce((b, s) => (s.ty < ZY && (!b || s.tx > b.tx) ? s : b), null);
  const watU = waters.reduce((b, w) => (w.p.y > ZY + 30 && w.p.y < ZY + 110 && (!b || w.p.x > b.p.x) ? w : b), null);
  const lblSolute = G(A);
  E('line', { x1: 1004, y1: 288, x2: solU.tx + 14, y2: solU.ty, stroke: C.muted, 'stroke-width': 2.5 }, lblSolute);
  E('circle', { cx: solU.tx + 14, cy: solU.ty, r: 5, fill: C.muted }, lblSolute);
  T(lblSolute, 1014, 300, 'solute', { size: 40, weight: 700, fill: C.glucose });
  T(lblSolute, 1014, 338, 'the sugar', { size: 27, weight: 600, fill: C.muted });
  const lblSolvent = G(A);
  E('line', { x1: 1004, y1: 508, x2: watU.p.x + 10, y2: watU.p.y, stroke: C.muted, 'stroke-width': 2.5 }, lblSolvent);
  E('circle', { cx: watU.p.x + 10, cy: watU.p.y, r: 5, fill: C.muted }, lblSolvent);
  T(lblSolvent, 1014, 520, 'solvent', { size: 40, weight: 700, fill: C.water });
  T(lblSolvent, 1014, 558, 'the water', { size: 27, weight: 600, fill: C.muted });
  const eqRow = G(A), eqParts = [];
  {
    const spec = [{ chip: 'solute', fill: C.glucose, color: '#3A2600' }, { op: '+' }, { chip: 'solvent', fill: C.water, color: '#06283A' }, { op: '=' }, { chip: 'solution', fill: '#9A5B2E', color: '#FFF3E3' }];
    let tot = 0; spec.forEach(s => { s.g = G(eqRow); if (s.op) { T(s.g, 0, 15, s.op, { size: 46, weight: 700, anchor: 'middle', fill: C.muted }); s.w = 40; } else { const c = chip(s.g, s.chip, { size: 32, fill: s.fill, color: s.color }); s.w = c.w; } tot += s.w; });
    tot += (spec.length - 1) * 14; let x = 600 - tot / 2;
    spec.forEach(s => { s.x = x + s.w / 2; x += s.w + 14; eqParts.push(s); });
  }
  const hdrNot = rich(A, 600, 168, [['dissolved', C.glucose], [' ≠ ', C.muted], ['destroyed', '#FF8A80']], { size: 50, weight: 700, anchor: 'middle' });
  const stillG = G(A);
  T(stillG, 1004, 330, 'still', { size: 40, weight: 700, fill: C.glucose });
  T(stillG, 1004, 376, 'there!', { size: 40, weight: 700, fill: C.glucose });
  const spreadT = T(A, ZX, 666, 'just spread out between the water particles', { size: 28, weight: 600, anchor: 'middle', fill: C.muted });

  /* ================= B. soluble salt, insoluble sand ================= */
  const Bg = G(root);
  const salB = beakerWith(Bg, 220, 250, { level: 0.66, liquid: C.water }); tr(salB.g, 330, 450);
  const sanB = beakerWith(Bg, 220, 250, { level: 0.66, liquid: C.water }); tr(sanB.g, 870, 450);
  const salSpoon = G(Bg), salSp = spoon(salSpoon, '#FFFFFF');
  const sanSpoon = G(Bg), sanSp = spoon(sanSpoon, '#D9B77E');
  const salFall = pourGrains(Bg, 9, '#FFFFFF', 6, 11);
  const sanFall = pourGrains(Bg, 9, '#D9B77E', 7, 12);
  const salIn = [], sanIn = [];
  { const r = rng(14); for (let k = 0; k < 10; k++) salIn.push({ el: E('rect', { x: -3, y: -3, width: 6, height: 6, rx: 1.5, fill: '#FFFFFF' }, salB.g), x: (r() - 0.5) * 120, y: -30 + r() * 40, d: 40 + r() * 60, k }); }
  const sandLayer = E('path', { d: 'M-96,122 Q-60,96 -10,100 Q50,94 96,110 L96,122 Z', fill: ball('#D9B77E', '#9C7A45'), stroke: '#B8955C', 'stroke-width': 2 }, sanB.g);
  { const r = rng(15); for (let k = 0; k < 16; k++) sanIn.push({ el: E('ellipse', { rx: 4.5, ry: 3.2, fill: k % 3 ? '#D9B77E' : '#B8955C' }, sanB.g), x: (r() - 0.5) * 170, y: -34 + r() * 40, fy: 104 + r() * 14, k }); }
  const sanCloud = E('rect', { x: -104, y: -40, width: 208, height: 165, fill: '#C9A46A', opacity: 0 }, sanB.g);
  sanB.g.insertBefore(sanCloud, sandLayer);
  const salName = T(Bg, 330, 628, 'salt', { size: 32, weight: 700, anchor: 'middle' });
  const sanName = T(Bg, 870, 628, 'sand', { size: 32, weight: 700, anchor: 'middle', fill: '#E8CC9A' });
  const salRes = G(Bg); { const c = chip(salRes, 'soluble', { size: 32, fill: '#163F2A', stroke: C.good, sw: 2.5 }); tr(c, 0, 0); const tk = tick(salRes, 16); tr(tk, c.w / 2 + 28, 0); }
  const sanRes = G(Bg); { const c = chip(sanRes, 'insoluble', { size: 32, fill: '#3E2F1A', stroke: '#D9B77E', sw: 2.5 }); tr(c, 0, 0); const cr = cross(sanRes, 13); tr(cr, c.w / 2 + 26, 0); }
  const salNote = T(Bg, 330, 248, 'dissolves', { size: 28, weight: 600, anchor: 'middle', fill: C.muted });
  const sanNote = T(Bg, 870, 248, 'doesn’t dissolve', { size: 28, weight: 600, anchor: 'middle', fill: C.muted });

  /* ================= C. saturated, then solubility vs temperature ================= */
  const Cg = G(root);
  function teaPair(parent, withPile) {
    const g = G(parent);
    const bk = beakerWith(g, 240, 280, { level: 0.64, liquid: '#9A5B2E' });
    const out = { g, bk };
    if (withPile) {
      out.pile = G(bk.g);
      E('path', { d: 'M-70,138 Q-40,104 0,100 Q40,104 70,138 Z', fill: '#FFFFFF', stroke: '#E4EDF2', 'stroke-width': 2 }, out.pile);
      const r = rng(21); let d = ''; for (let i = 0; i < 14; i++) d += `M${((r() - 0.5) * 110).toFixed(1)},${(118 + r() * 16).toFixed(1)} h0.1 `;
      E('path', { d, stroke: '#C9D6DE', 'stroke-width': 4, 'stroke-linecap': 'round' }, out.pile);
    }
    const mg = G(g); tr(mg, 160, -130);
    out.meter = meter(mg, { w: 36, h: 260, vertical: true, color: C.glucose });
    out.mg = mg;
    return out;
  }
  const cold = teaPair(Cg, true);
  const satSpoon = G(Cg), satSp = spoon(satSpoon, '#FFFFFF');
  const satFall = pourGrains(Cg, 8, '#FFFFFF', 6, 31);
  const limitG = G(cold.mg);
  E('line', { x1: -12, x2: 48, y1: 260 * 0.4, y2: 260 * 0.4, stroke: C.energy, 'stroke-width': 4, 'stroke-dasharray': '8 6' }, limitG);
  const limitLbl = T(cold.mg, 62, 260 * 0.4 + 10, 'full', { size: 28, weight: 700, fill: C.energy });
  const dissLbl = T(cold.mg, 18, 300, 'sugar dissolved', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  const satHdr = T(Cg, 900, 318, 'saturated', { size: 54, weight: 700, anchor: 'middle', fill: C.energy });
  const satNote = T(Cg, 900, 366, 'no more will dissolve', { size: 30, weight: 600, anchor: 'middle' });
  const satTemp = chip(Cg, 'at this temperature', { size: 28, fill: C.card2, stroke: C.water, sw: 2 }); tr(satTemp, 900, 428);
  const spoons = [];
  for (let i = 0; i < 5; i++) {
    const g = G(Cg); tr(g, 760 + i * 70, 520);
    E('path', { d: 'M7,-4 L46,-30', stroke: '#C9D6DE', 'stroke-width': 6, 'stroke-linecap': 'round' }, g);
    E('ellipse', { rx: 15, ry: 8, fill: ball('#E9EEF2', '#8A9BA8'), stroke: '#F4F7FA', 'stroke-width': 1.5 }, g);
    const ok = tick(g, 13); tr(ok, 4, 46);
    const no = T(g, 4, 56, 'stays', { size: 24, weight: 700, anchor: 'middle', fill: '#FF8A80', font: FB });
    spoons.push({ g, ok, no });
  }
  // solubility: heading, graph, hot tea
  const solHdr = G(Cg);
  rich(solHdr, 600, 164, [['solubility', C.energy, 800], ': the most that can dissolve'], { size: 36, anchor: 'middle' });
  T(solHdr, 600, 206, 'in a fixed amount of solvent', { size: 28, weight: 600, anchor: 'middle', fill: C.muted });
  const graph = G(Cg);
  const GX0 = 110, GY0 = 560, GX1 = 480, GYT = 250;
  E('path', { d: `M${GX0},${GYT} L${GX0},${GY0} L${GX1},${GY0}`, fill: 'none', stroke: C.muted, 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, graph);
  T(graph, GX0 + 14, GYT - 6, 'solubility', { size: 28, weight: 600, fill: C.muted });
  T(graph, GX1, GY0 + 40, 'temperature', { size: 28, weight: 600, fill: C.muted, anchor: 'end' });
  const curveY = x => 525 - Math.pow((x - 130) / 330, 2) * 240;
  const cPts = []; for (let x = 130; x <= 460; x += 15) cPts.push([x, curveY(x)]);
  const curve = E('path', { d: polyD(cPts), fill: 'none', stroke: C.glucose, 'stroke-width': 7, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', pathLength: 1, 'stroke-dasharray': '1 1' }, graph);
  const dotC = G(graph), dotH = G(graph);
  [[dotC, 190, C.water, 'cold', 0, -22, 'middle'], [dotH, 420, C.heat, 'hot', -22, 4, 'end']].forEach(([g, x, col, txt, lx, ly, anc]) => {
    E('line', { x1: x, x2: x, y1: curveY(x), y2: GY0, stroke: col, 'stroke-width': 3, 'stroke-dasharray': '6 6' }, g);
    E('circle', { cx: x, cy: curveY(x), r: 11, fill: col, stroke: '#FFFFFF', 'stroke-width': 3 }, g);
    T(g, x + lx, curveY(x) + ly, txt, { size: 28, weight: 700, anchor: anc, fill: col });
  });
  const hot = teaPair(Cg, false);
  const hotSteam = heatWaves(hot.g, { n: 3, h: 80, spacing: 30, color: '#E8D2BE', width: 5, speed: 0.5 }); tr(hotSteam, -10, -150);
  const coldLbl = T(Cg, 0, 0, 'cold tea', { size: 32, weight: 700, anchor: 'middle', fill: C.water });
  const hotLbl = T(Cg, 0, 0, 'hot tea', { size: 32, weight: 700, anchor: 'middle', fill: C.heat });
  const moreLbl = T(Cg, 1010, 270, 'dissolves more', { size: 28, weight: 700, anchor: 'middle', fill: C.glucose });

  /* ================= D. concentration: dilute and concentrated ================= */
  const Dg = G(root);
  const SQ = 300;
  function square(parent, nSugar, seed) {
    const g = G(parent);
    E('rect', { x: -SQ / 2, y: -SQ / 2, width: SQ, height: SQ, rx: 22, fill: 'rgba(76,201,240,0.07)', stroke: '#9FD8FF', 'stroke-width': 3 }, g);
    const pts = [], r = rng(seed);
    for (let j = 0; j < 6; j++) for (let i = 0; i < 7; i++) pts.push([-SQ / 2 + 30 + i * 40 + (j & 1 ? 10 : -6) + (r() - 0.5) * 8, -SQ / 2 + 36 + j * 46 + (r() - 0.5) * 8, r() * TAU]);
    const order = pts.map((p, i) => i); for (let i = order.length - 1; i > 0; i--) { const k = Math.floor(r() * (i + 1)); const tmp = order[i]; order[i] = order[k]; order[k] = tmp; }
    const sIdx = new Set(order.slice(0, nSugar));
    const ws = [], ss = [];
    pts.forEach((p, i) => {
      const w = { el: waterBall(g, 11), p, s: null };
      ws.push(w);
      if (sIdx.has(i)) { const sg = sugar(g, 8); w.s = { el: sg, p, k: ss.length }; ss.push(w.s); }
    });
    return { g, ws, ss };
  }
  const sqL = square(Dg, 4, 71), sqR = square(Dg, 16, 72);
  tr(sqL.g, 330, 420); tr(sqR.g, 870, 420);
  const concHdr = G(Dg);
  rich(concHdr, 600, 166, [['concentration', C.energy, 800], ': how much solute in a given volume'], { size: 34, anchor: 'middle' });
  const sameG = G(Dg);
  T(sameG, 600, 412, 'same', { size: 30, weight: 700, anchor: 'middle', fill: C.muted });
  T(sameG, 600, 446, 'volume', { size: 30, weight: 700, anchor: 'middle', fill: C.muted });
  arrow(sameG, 540, 470, 494, 470, { color: C.muted, width: 4 }); arrow(sameG, 660, 470, 706, 470, { color: C.muted, width: 4 });
  const dilG = G(Dg); T(dilG, 330, 626, 'dilute', { size: 40, weight: 700, anchor: 'middle', fill: '#FFE29A' }); T(dilG, 330, 666, 'few solute particles', { size: 27, weight: 600, anchor: 'middle', fill: C.muted });
  const conG = G(Dg); T(conG, 870, 626, 'concentrated', { size: 40, weight: 700, anchor: 'middle', fill: C.glucose }); T(conG, 870, 666, 'many solute particles', { size: 27, weight: 600, anchor: 'middle', fill: C.muted });

  /* ================= E. squash ================= */
  const Eq = G(root);
  const SQ_MID = '#F59A2E', SQ_DEEP = '#D2500A', SQ_PALE = '#FFDCA6';
  const glM = tumbler(Eq), glR = tumbler(Eq), glL = tumbler(Eq);
  tr(glM, 600, 450); tr(glR, 950, 450); tr(glL, 250, 450);
  const arR = arrow(Eq, 690, 450, 852, 450, { color: SQ_MID, width: 7 }), arL = arrow(Eq, 510, 450, 348, 450, { color: C.water, width: 7 });
  const plusSq = T(Eq, 771, 418, '+ squash', { size: 32, weight: 700, anchor: 'middle', fill: '#FFB36B' });
  const plusW = T(Eq, 429, 418, '+ water', { size: 32, weight: 700, anchor: 'middle', fill: C.water });
  const streamR = E('rect', { x: 942, y: 214, width: 12, height: 0, rx: 6, fill: SQ_DEEP }, Eq);
  const streamL = E('rect', { x: 242, y: 226, width: 12, height: 0, rx: 6, fill: C.water, opacity: 0.85 }, Eq);
  const bottle = G(Eq); tr(bottle, 1004, 176, 1, -125);
  E('rect', { x: -26, y: -50, width: 52, height: 92, rx: 14, fill: ball('#FF9F2E', '#C9600E'), stroke: '#FFD08A', 'stroke-width': 2 }, bottle);
  E('rect', { x: -10, y: -72, width: 20, height: 24, rx: 4, fill: '#FFB85C', stroke: '#FFD08A', 'stroke-width': 2 }, bottle);
  E('rect', { x: -20, y: -18, width: 40, height: 32, rx: 5, fill: '#FFF3DC' }, bottle);
  const jug = G(Eq); tr(jug, 220, 159, 1, 120);
  E('path', { d: 'M-32,-30 Q-62,-26 -60,2 Q-58,28 -32,30', fill: 'none', stroke: '#BFEFFF', 'stroke-width': 7, 'stroke-linecap': 'round' }, jug);
  E('path', { d: 'M-32,-48 L28,-48 L44,-58 L34,46 Q33,56 23,56 L-23,56 Q-33,56 -34,46 Z', fill: 'rgba(76,201,240,0.5)', stroke: '#BFEFFF', 'stroke-width': 3.5, 'stroke-linejoin': 'round' }, jug);
  const lblM = T(Eq, 600, 640, 'squash', { size: 32, weight: 700, anchor: 'middle', fill: '#FFB36B' });
  const lblR = T(Eq, 950, 640, 'more concentrated', { size: 32, weight: 700, anchor: 'middle', fill: '#FF8A3D' });
  const lblL = T(Eq, 250, 640, 'more dilute', { size: 32, weight: 700, anchor: 'middle', fill: '#FFDCA6' });

  /* ================= F. mass is conserved; evaporating gets the salt back ================= */
  const Fg = G(root);
  const bench = E('rect', { x: 60, y: 616, width: 620, height: 14, rx: 7, fill: '#2C5468' }, Fg);
  const bal = balance(Fg); tr(bal, 400, 500);
  const massB = beakerWith(Fg, 170, 200, { level: 0.7, liquid: C.water });
  const dish = G(Fg);
  E('path', { d: 'M-46,0 Q-40,20 0,22 Q40,20 46,0 Z', fill: ball('#FFFFFF', '#BFC9D2'), stroke: '#E9EEF2', 'stroke-width': 2 }, dish);
  E('ellipse', { cx: 0, cy: 0, rx: 46, ry: 9, fill: '#D5DDE3', stroke: '#FFFFFF', 'stroke-width': 2 }, dish);
  const dishSalt = E('path', { d: 'M-30,2 Q-14,-22 2,-22 Q18,-20 30,2 Z', fill: '#FFFFFF', stroke: '#E4EDF2', 'stroke-width': 1.5 }, dish);
  const massFall = pourGrains(Fg, 8, '#FFFFFF', 6, 41);
  const mSalt = [];
  { const r = rng(42); for (let k = 0; k < 7; k++) mSalt.push({ el: E('rect', { x: -3, y: -3, width: 6, height: 6, rx: 1.5, fill: '#FFFFFF' }, massB.g), x: (r() - 0.5) * 100, y: -10 + r() * 30, d: 30 + r() * 40 }); }
  const mStir = G(massB.back), mSp = spoon(mStir, null, 170);
  const eqM = G(Fg), eqM2 = [];
  {
    const spec = [{ chip: '10 g salt', fill: C.card2, stroke: '#E4EDF2' }, { op: '+' }, { chip: '100 g water', fill: C.card2, stroke: C.water }, { op: '=' }, { chip: '110 g solution', fill: '#163F2A', stroke: C.good }];
    let tot = 0; spec.forEach(s => { s.g = G(eqM); if (s.op) { T(s.g, 0, 15, s.op, { size: 44, weight: 700, anchor: 'middle', fill: C.muted }); s.w = 34; } else { const c = chip(s.g, s.chip, { size: 30, fill: s.fill, stroke: s.stroke, sw: 2.5 }); s.w = c.w; } tot += s.w; });
    tot += (spec.length - 1) * 14; let x = 600 - tot / 2;
    spec.forEach(s => { s.x = x + s.w / 2; x += s.w + 14; tr(s.g, s.x, 168); eqM2.push(s); });
  }
  const lostG = G(Fg); { const c = chip(lostG, 'nothing is lost', { size: 30, fill: '#163F2A', stroke: C.good, sw: 2.5 }); const tk = tick(lostG, 15); tr(tk, -c.w / 2 - 30, 0); }
  const inset = G(Fg);
  card(inset, 740, 250, 380, 440, { fill: C.card, stroke: C.line });
  T(inset, 930, 298, 'evaporate the water', { size: 30, weight: 700, anchor: 'middle' });
  const rigG = G(inset); tr(rigG, 930, 668, 0.78); const rig = basinRig(rigG);
  const rigSteam = heatWaves(rigG, { n: 4, h: 80, spacing: 30, color: '#DDEFF8', width: 5, speed: 0.6 }); tr(rigSteam, 0, -322);
  const backLbl = T(inset, 930, 372, 'salt back!', { size: 34, weight: 700, anchor: 'middle', fill: C.good });
  const backArrow = arrow(inset, 930, 384, 930, 412, { color: C.good, width: 4 });

  /* ================= update ================= */
  return t => {
    /* ---- A: tea, words, and later "not destroyed" ---- */
    const aA = Math.max(Math.min(P(t, S.first - 0.6, 0.6, linear), 1 - P(t, at('soluble') - 0.15, 0.45, linear)), win(t, at('notgone') - 0.1, at('mass') + 0.3, 0.45));
    op(A, aA);
    if (aA > 0) {
      const lensIn = P(t, at('tea') + 0.1, 0.7, pop);
      op(lensG, clamp(lensIn * 2)); scaleAt(lensG, ZX, ZY, 0.55 + 0.45 * lensIn);
      op(coneG, P(t, at('tea') + 0.1, 0.5, linear)); op(srcRing, P(t, at('tea') + 0.05, 0.4, linear));
      // the cube drops in, sinks and dissolves; a spoon stirs
      const drop = P(t, mid('tea', 0.06), 0.55, easeIn), sink = P(t, mid('tea', 0.18), 1.4, easeOut), dis = P(t, mid('tea', 0.3), mid('tea', 0.88) - mid('tea', 0.3), linear);
      const cy = t < mid('tea', 0.18) ? lerp(-250, -40, drop) : lerp(-40, 96, sink);
      op(cubeG, P(t, mid('tea', 0.02), 0.3, linear) * (1 - P(dis, 0.85, 0.15, linear)));
      tr(cubeG, 20 + Math.sin(t * 2) * 3 * (1 - dis), cy, Math.max(0.01, 1 - 0.75 * dis), drop * 30 + sink * 20);
      const spl = P(t, mid('tea', 0.18), 0.7, linear);
      op(splash, (spl > 0 && spl < 1) ? 1 - spl : 0); attr(splash, 'rx', 22 + 50 * spl); attr(splash, 'ry', 4 + 6 * spl);
      op(cubeLbl, P(t, mid('tea', 0.02), 0.3, linear) * (1 - P(t, mid('tea', 0.2), 0.4, linear)));
      const stirOn = P(t, mid('tea', 0.24), 0.4, linear) * (1 - P(t, at('words') - 0.2, 0.4, linear));
      op(stirG, stirOn);
      const st = Math.max(0, t - mid('tea', 0.24)) * (S.reduce ? 2.5 : 5.5);
      tr(stirG, -6 + Math.sin(st) * 40, 22 + Math.cos(st) * 6, 1, -28 + Math.sin(st) * 8);
      op(swirl, stirOn * 0.7); tr(swirl, Math.sin(st) * 18, -36);
      // zoom: water jiggles; sugar particles break away from the crystal and spread out
      waters.forEach(w => tr(w.el, w.p.x + Math.sin(t * 1.1 + w.p.ph) * 3.5 * AMP, w.p.y + Math.cos(t * 0.9 + w.p.ph) * 3.5 * AMP));
      const blockIn = P(t, mid('tea', 0.18), 0.6, easeOut);
      let left = 0;
      sugars.forEach(s => {
        const t0 = mid('tea', 0.32) + s.k * 0.24, u = P(t, t0, 1.1, ease);
        left += 1 - u;
        const wig = Math.sin(u * Math.PI) * 22 * Math.sin(s.k * 1.7 + 1);
        const dx = s.tx - s.bx, dy = s.ty - s.by, L = Math.hypot(dx, dy) || 1;
        const x = lerp(s.bx, s.tx, u) - dy / L * wig, y = lerp(s.by - (1 - blockIn) * 200, s.ty, u) + dx / L * wig;
        const j = u >= 1 ? 1 : 0;
        tr(s.g, x + j * Math.sin(t * 1.3 + s.k) * 3 * AMP, y + j * Math.cos(t * 1.1 + s.k) * 3 * AMP, 1, s.rot * u + (u > 0 && u < 1 ? u * 180 : 0));
        op(s.g, blockIn > 0 ? 1 : 0);
      });
      const frac = left / 12;
      op(blockBack, blockIn * (frac > 0.02 ? 1 : 0));
      attr(blockBack, 'height', 62 * frac + 2); attr(blockBack, 'y', BLK.y1 - 60 * frac - 2 - (1 - blockIn) * 200);
      // tea words
      const hd = P(t, mid('tea', 0.45), 0.5, pop);
      op(hdrDiss, clamp(hd * 2) * (1 - P(t, at('words'), 0.4, linear))); scaleAt(hdrDiss, 600, 150, 0.85 + 0.15 * hd);
      op(solnLbl, P(t, mid('tea', 0.74), 0.5, linear) * (1 - P(t, at('words') - 0.1, 0.4, linear)));
      // words: solute, solvent, then solute + solvent = solution
      const wOut = 1 - P(t, at('soluble') - 0.15, 0.4, linear);
      op(lblSolute, P(t, mid('words', 0.04), 0.5, linear) * wOut);
      op(lblSolvent, P(t, mid('words', 0.4), 0.5, linear) * wOut);
      eqParts.forEach((s, i) => { const p = P(t, mid('words', 0.7 + i * 0.05), 0.45, pop); op(s.g, clamp(p * 2) * wOut); tr(s.g, s.x, 680 + (1 - clamp(p)) * 16, 0.8 + 0.2 * clamp(p)); });
      // not destroyed: the particles glow, still there
      const ng = P(t, at('notgone') + 0.05, 0.5, linear);
      op(hdrNot, ng);
      const glowOn = P(t, mid('notgone', 0.36), 0.6, linear);
      sugars.forEach(s => op(s.halo, glowOn * (0.65 + 0.35 * wave(t, 1.4, s.k * 0.13))));
      op(stillG, P(t, mid('notgone', 0.44), 0.5, linear));
      op(spreadT, P(t, mid('notgone', 0.7), 0.5, linear));
    }

    /* ---- B: soluble / insoluble ---- */
    const aB = win(t, at('soluble') - 0.1, at('saturated') + 0.3, 0.45);
    op(Bg, aB);
    if (aB > 0) {
      const sp1 = P(t, at('soluble') + 0.05, 0.4, easeOut), tilt1 = P(t, mid('soluble', 0.08), 0.4);
      op(salSpoon, sp1 * (1 - P(t, mid('soluble', 0.42), 0.4, linear)));
      tr(salSpoon, 400 + (1 - sp1) * 40, 268, 1, -8 - 46 * tilt1);
      salFall(t, mid('soluble', 0.12), mid('soluble', 0.3), 384, 290, 412, 0.45);
      if (salSp.heap) op(salSp.heap, 1 - P(t, mid('soluble', 0.12), mid('soluble', 0.3) - mid('soluble', 0.12), linear));
      salIn.forEach(g => {
        const t0 = mid('soluble', 0.14) + g.k * 0.07, u = P(t, t0, 1.1, linear);
        op(g.el, u > 0 && u < 1 ? Math.min(1, u * 6) * (1 - u) : 0);
        tr(g.el, g.x * 0.6 + 30, -32 + u * g.d, 1, u * 200);
      });
      op(salNote, P(t, mid('soluble', 0.3), 0.4, linear));
      const r1 = P(t, mid('soluble', 0.34), 0.5, pop); op(salRes, clamp(r1 * 2)); tr(salRes, 330, 684, Math.max(0.01, 0.8 + 0.2 * r1));
      const sp2 = P(t, mid('soluble', 0.46), 0.4, easeOut), tilt2 = P(t, mid('soluble', 0.54), 0.4);
      op(sanSpoon, sp2 * (1 - P(t, mid('soluble', 0.9), 0.4, linear)));
      tr(sanSpoon, 940 + (1 - sp2) * 40, 268, 1, -8 - 46 * tilt2);
      sanFall(t, mid('soluble', 0.58), mid('soluble', 0.74), 924, 290, 412, 0.45);
      if (sanSp.heap) op(sanSp.heap, 1 - P(t, mid('soluble', 0.58), mid('soluble', 0.74) - mid('soluble', 0.58), linear));
      sanIn.forEach(g => {
        const t0 = mid('soluble', 0.6) + g.k * 0.03, u = P(t, t0, 1.0, easeOut);
        op(g.el, u > 0 ? 1 : 0);
        tr(g.el, lerp(40 + g.x * 0.2, g.x, u), lerp(-34 + g.y * 0.2, g.fy, u), 1, u * 90);
      });
      op(sandLayer, P(t, mid('soluble', 0.75), 0.6, linear));
      op(sanCloud, 0.28 * Math.sin(Math.PI * P(t, mid('soluble', 0.62), 1.6, linear)));
      op(sanNote, P(t, mid('soluble', 0.78), 0.4, linear));
      const r2 = P(t, mid('soluble', 0.82), 0.5, pop); op(sanRes, clamp(r2 * 2)); tr(sanRes, 870, 684, Math.max(0.01, 0.8 + 0.2 * r2));
      op(salName, P(t, at('soluble'), 0.4, linear)); op(sanName, P(t, mid('soluble', 0.46), 0.4, linear));
    }

    /* ---- C: saturated, then solubility ---- */
    const aC = win(t, at('saturated') - 0.1, at('conc') + 0.3, 0.45);
    op(Cg, aC);
    if (aC > 0) {
      const mv = P(t, at('solubility') - 0.1, 0.9);
      tr(cold.g, lerp(400, 660, mv), lerp(470, 480, mv), lerp(1, 0.72, mv));
      // five spoonfuls: three dissolve, two stay at the bottom
      const POUR = i => mid('saturated', 0.04 + i * 0.13);
      let level = 0, piled = 0;
      for (let i = 0; i < 5; i++) {
        const p = P(t, POUR(i) + 0.35, 0.8, ease);
        if (i < 2) level += 0.2 * p; else if (i === 2) level += 0.2 * p; else piled += p * 0.5;
      }
      cold.meter.set(level);
      op(cold.pile, P(piled, 0.02, 0.3, linear)); cold.pile.setAttribute('transform', `translate(0 138) scale(1 ${(0.2 + 0.8 * Math.min(1, piled)).toFixed(3)}) translate(0 -138)`);
      const pi = clamp(Math.floor((t - POUR(0)) / (POUR(1) - POUR(0))), 0, 4), pu = clamp((t - POUR(pi)) / (POUR(1) - POUR(0)));
      const spIn = P(t, at('saturated'), 0.4, easeOut) * (1 - P(t, mid('saturated', 0.8), 0.4, linear));
      op(satSpoon, spIn); tr(satSpoon, 470, 262 - Math.sin(Math.min(1, pu * 2.2) * Math.PI) * 10, 1, -8 - 44 * Math.sin(Math.PI * clamp(pu * 1.6)));
      if (satSp.heap) op(satSp.heap, pu < 0.12 ? 1 : pu > 0.6 ? clamp((pu - 0.6) * 4) : 1 - clamp((pu - 0.12) * 3));
      for (let i = 0; i < 5; i++) satFall(t, POUR(i) + 0.15, POUR(i) + 0.45, 452, 284, 440, 0.42);
      const fullOn = P(t, POUR(2) + 1.0, 0.4, linear);
      op(limitG, P(t, at('saturated') + 0.3, 0.4, linear)); op(limitLbl, fullOn * (1 - mv)); op(dissLbl, P(t, at('saturated') + 0.3, 0.4, linear) * (1 - mv));
      spoons.forEach((s, i) => {
        const a = P(t, POUR(i), 0.3, linear) * (1 - P(t, at('solubility') - 0.2, 0.4, linear));
        op(s.g, a);
        op(s.ok, i < 3 ? P(t, POUR(i) + 1.0, 0.3, linear) : 0); op(s.no, i >= 3 ? P(t, POUR(i) + 1.0, 0.3, linear) : 0);
      });
      const satOut = 1 - P(t, at('solubility') - 0.2, 0.4, linear);
      const sh = P(t, mid('saturated', 0.7), 0.5, pop);
      op(satHdr, clamp(sh * 2) * satOut); scaleAt(satHdr, 900, 300, 0.85 + 0.15 * sh);
      op(satNote, P(t, mid('saturated', 0.76), 0.4, linear) * satOut);
      op(satTemp, P(t, mid('saturated', 0.62), 0.4, linear) * satOut);
      // solubility
      op(solHdr, P(t, at('solubility') + 0.2, 0.5, linear));
      op(graph, P(t, mid('solubility', 0.4), 0.5, linear));
      curve.setAttribute('stroke-dashoffset', (1 - P(t, mid('solubility', 0.46), 2.2)).toFixed(4));
      op(dotC, P(t, mid('solubility', 0.76), 0.4, linear)); op(dotH, P(t, mid('solubility', 0.84), 0.4, linear));
      const hp = P(t, mid('solubility', 0.68), 0.6, pop);
      op(hot.g, clamp(hp * 2)); tr(hot.g, 960, 480 + (1 - clamp(hp)) * 20, 0.72);
      hot.meter.set(P(t, mid('solubility', 0.74), 1.8, easeOut) * 0.92);
      hotSteam.upd(t); op(hotSteam, 0.9);
      op(coldLbl, P(t, mid('solubility', 0.7), 0.4, linear)); attr(coldLbl, 'x', 690); attr(coldLbl, 'y', 650);
      op(hotLbl, P(t, mid('solubility', 0.72), 0.4, linear)); attr(hotLbl, 'x', 990); attr(hotLbl, 'y', 650);
      op(moreLbl, P(t, mid('solubility', 0.86), 0.4, linear));
    }

    /* ---- D: dilute and concentrated ---- */
    const aD = win(t, at('conc') - 0.1, at('squash') + 0.3, 0.45);
    op(Dg, aD);
    if (aD > 0) {
      op(concHdr, P(t, at('conc') + 0.05, 0.5, linear));
      [sqL, sqR].forEach((q, qi) => {
        const pin = P(t, at('conc') + 0.1 + qi * 0.25, 0.55, pop);
        op(q.g, clamp(pin * 2)); tr(q.g, qi ? 870 : 330, 420 + (1 - clamp(pin)) * 20);
        q.ws.forEach(w => {
          const x = w.p[0] + Math.sin(t * 1.2 + w.p[2]) * 3 * AMP, y = w.p[1] + Math.cos(t * 1.0 + w.p[2]) * 3 * AMP;
          if (!w.s) { tr(w.el, x, y); return; }
          // a solute particle takes this place: same volume, more solute
          const ps = P(t, mid('conc', qi ? 0.74 : 0.52) + w.s.k * (qi ? 0.07 : 0.12), 0.45, pop);
          op(w.el, 1 - clamp(ps * 2)); tr(w.el, x, y, Math.max(0.01, 1 - clamp(ps)));
          op(w.s.el, clamp(ps * 2)); tr(w.s.el, x, y, Math.max(0.01, ps), (w.p[2] * 30) % 60 - 30);
        });
      });
      op(sameG, P(t, mid('conc', 0.3), 0.5, linear));
      op(dilG, P(t, mid('conc', 0.56), 0.5, linear)); op(conG, P(t, mid('conc', 0.8), 0.5, linear));
    }

    /* ---- E: squash ---- */
    const aE = win(t, at('squash') - 0.1, at('notgone') + 0.3, 0.45);
    op(Eq, aE);
    if (aE > 0) {
      const pm = P(t, at('squash') + 0.05, 0.5, pop);
      op(glM, clamp(pm * 2)); tr(glM, 600, 450 + (1 - clamp(pm)) * 20); glM.set(0.62, SQ_MID); op(lblM, P(t, at('squash') + 0.25, 0.4, linear));
      // + squash: the right glass darkens
      const r0 = mid('squash', 0.26), pr = P(t, r0, 0.5, pop);
      arR.set(P(t, r0, 0.5)); op(arR, P(t, r0, 0.15, linear)); op(plusSq, P(t, r0 + 0.2, 0.4, linear));
      op(glR, clamp(pr * 2)); tr(glR, 950, 450 + (1 - clamp(pr)) * 20);
      const fr = P(t, r0 + 0.5, 1.4, ease); glR.set(0.62 + 0.14 * fr, mixC(SQ_MID, SQ_DEEP, fr));
      const bt = P(t, r0 + 0.3, 0.35, easeOut) * (1 - P(t, r0 + 1.8, 0.35, linear));
      op(bottle, bt); tr(bottle, 1004, 176 - (1 - bt) * 30, 1, -125);
      const sOn = t > r0 + 0.5 && t < r0 + 1.8 ? 1 : 0; attr(streamR, 'height', sOn * (450 + 126 - 246 * (0.62 + 0.14 * fr) - 214)); op(streamR, sOn);
      op(lblR, P(t, r0 + 1.1, 0.4, linear));
      // + water: the left glass pales
      const l0 = mid('squash', 0.6), pl = P(t, l0, 0.5, pop);
      arL.set(P(t, l0, 0.5)); op(arL, P(t, l0, 0.15, linear)); op(plusW, P(t, l0 + 0.2, 0.4, linear));
      op(glL, clamp(pl * 2)); tr(glL, 250, 450 + (1 - clamp(pl)) * 20);
      const fl = P(t, l0 + 0.5, 1.4, ease); glL.set(0.62 + 0.14 * fl, mixC(SQ_MID, SQ_PALE, fl));
      const jt = P(t, l0 + 0.3, 0.35, easeOut) * (1 - P(t, l0 + 1.8, 0.35, linear));
      op(jug, jt); tr(jug, 220, 159 - (1 - jt) * 30, 1, 120);
      const wOn = t > l0 + 0.5 && t < l0 + 1.8 ? 1 : 0; attr(streamL, 'height', wOn * (450 + 126 - 246 * (0.62 + 0.14 * fl) - 226)); op(streamL, wOn * 0.85);
      op(lblL, P(t, l0 + 1.1, 0.4, linear));
    }

    /* ---- F: mass ---- */
    const aF = P(t, at('mass') - 0.1, 0.45, linear);
    op(Fg, aF);
    if (aF > 0) {
      const m0 = at('mass');
      const pb = P(t, m0, 0.5, pop); op(bal, clamp(pb * 2)); tr(bal, 400, 500 + (1 - clamp(pb)) * 20); op(bench, clamp(pb * 2));
      // 1) the dish of salt on the pan: 10 g
      const dishOn = P(t, m0 + 0.2, 0.5, easeOut), dishOff = P(t, mid('mass', 0.2), 0.7);
      const pour = P(t, mid('mass', 0.36), 0.6), back = P(t, mid('mass', 0.56), 0.6);
      let dx = 400, dy = 472 - (1 - dishOn) * 60, dr = 0;
      dx = lerp(dx, 170, dishOff); dy = lerp(dy, 594, dishOff);
      dx = lerp(dx, 300, pour); dy = lerp(dy, 250, pour); dr = lerp(0, 58, pour);
      dx = lerp(dx, 170, back); dy = lerp(dy, 594, back); dr = lerp(dr, 0, back);
      op(dish, dishOn); tr(dish, dx, dy, 1, dr);
      const pourWin = [mid('mass', 0.4), mid('mass', 0.54)];
      op(dishSalt, 1 - P(t, pourWin[0], pourWin[1] - pourWin[0], linear));
      massFall(t, pourWin[0], pourWin[1], 336, 292, 366, 0.36);
      // 2) a beaker of water replaces it: 100 g
      const bkOn = P(t, mid('mass', 0.24), 0.6, easeOut);
      op(massB.g, bkOn); tr(massB.g, 400, 394 - (1 - bkOn) * 50);
      mSalt.forEach((g, k) => { const u = P(t, pourWin[0] + 0.25 + k * 0.08, 1.2, linear); op(g.el, u > 0 && u < 1 ? Math.min(1, u * 6) * (1 - u) : 0); tr(g.el, g.x, -24 + g.y + u * g.d, 1, u * 160); });
      const stir = P(t, mid('mass', 0.52), 0.3, linear) * (1 - P(t, mid('mass', 0.7), 0.4, linear));
      op(mStir, stir); const ss = Math.max(0, t - mid('mass', 0.52)) * (S.reduce ? 2.5 : 5); tr(mStir, -4 + Math.sin(ss) * 26, 30, 1, -28 + Math.sin(ss) * 6);
      // the reading
      let g = 0;
      if (dishOn > 0.5 && dishOff < 0.5) g = 10;
      if (bkOn > 0.5) g = 100;
      if (t > pourWin[0]) g = 100 + Math.round(10 * P(t, pourWin[0], pourWin[1] - pourWin[0] + 0.2, linear));
      setText(bal.read, (t < m0 + 0.4 ? 0 : g) + ' g');
      // the equation
      const eqAt = [mid('mass', 0.12), mid('mass', 0.24), mid('mass', 0.3), mid('mass', 0.5), mid('mass', 0.52)];
      eqM2.forEach((s, i) => { const p = P(t, eqAt[i], 0.45, pop); op(s.g, clamp(p * 2)); tr(s.g, s.x, 168 + (1 - clamp(p)) * 14, 0.85 + 0.15 * clamp(p)); });
      const lp = P(t, mid('mass', 0.6), 0.5, pop); op(lostG, clamp(lp * 2)); tr(lostG, 420, 676, Math.max(0.01, 0.85 + 0.15 * lp));
      // inset: evaporate the solution and the salt is left
      const ip = P(t, mid('mass', 0.7), 0.5, easeOut); op(inset, ip); tr(inset, (1 - ip) * 30, 0);
      rig.burner.set('blue'); rig.burner.upd(t);
      const ev = P(t, mid('mass', 0.74), 2.0, linear);
      rig.set(1 - ev); rig.crust(P(ev, 0.55, 0.45, linear));
      rigSteam.upd(t); op(rigSteam, ev > 0 && ev < 1 ? 0.95 * Math.min(1, (1 - ev) * 5) : 0);
      const bl = P(t, mid('mass', 0.93), 0.4, linear); op(backLbl, bl); op(backArrow, bl); backArrow.set(bl);
    }
  };
});
