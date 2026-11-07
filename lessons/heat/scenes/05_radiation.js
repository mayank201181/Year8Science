/* Radiation: heat that travels as waves.
   Beats: infrared waves roll across the stage -> electromagnetic, like light; they cross an empty
   vacuum box -> the Sun's waves cross 150 million km of space to warm the Earth (showpiece) -> a fire
   warms a face across the room -> everything gives out waves, hotter things more -> a dark matt panel
   absorbs and emits best -> a shiny panel reflects -> Dark Drinks, Shiny Reflects -> a black solar
   panel -> white houses -> a marathon runner's foil blanket -> the three ways -> Cats Can't Radiate. */
scene('radiation', S => {
  const { at, end, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;
  const Y = C.energy, HOT = C.heat;

  /* ---------- local helpers ---------- */
  function rich(parent, x, y, segs, o) {
    o = o || {};
    const t = E('text', { x, y, 'font-size': o.size || 30, 'font-weight': o.weight || 600, 'font-family': o.font || FD, 'text-anchor': o.anchor || 'start', fill: o.fill || C.ink }, parent);
    segs.forEach(s => { if (typeof s === 'string') s = [s]; E('tspan', { fill: s[1], 'font-weight': s[2] }, t).textContent = s[0]; });
    return t;
  }
  /* Infrared radiation: the kit sineWave look as a wavy arrow from (x1,y1) to (x2,y2), tapered at both
     ends. r.upd(time, front 0..1, amp scale): crests travel towards the head; the front grows from the source. */
  function irRay(parent, x1, y1, x2, y2, o) {
    o = o || {};
    const g = G(parent), L = Math.hypot(x2 - x1, y2 - y1);
    tr(g, x1, y1, 1, Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI);
    const col = o.color || HOT, wd = o.width || 5, wl = o.wl || 50, amp0 = o.amp || 12, sp = o.speed || 160;
    const hs = o.head === false ? 0 : (o.hs || wd * 3.2);
    const path = E('path', { fill: 'none', stroke: col, 'stroke-width': wd, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    const head = hs ? E('path', { d: `M0,0 L${-hs},${(-hs * 0.62).toFixed(1)} L${(-hs * 0.72).toFixed(1)},0 L${-hs},${(hs * 0.62).toFixed(1)} Z`, fill: col }, g) : null;
    g.L = L; g.sp = sp;
    g.upd = (t, rv, k) => {
      rv = rv === undefined ? 1 : clamp(rv);
      const show = rv > 0.004;
      op(path, show ? 1 : 0); if (head) op(head, show ? 1 : 0);
      if (!show) return;
      const tip = rv * L, front = Math.max(2, tip - hs * 0.55), amp = amp0 * (k === undefined ? 1 : k), ph = t * sp / wl;
      const tp = Math.min(wl * 0.55, front / 2);
      let d = 'M0,0';
      for (let x = 4; x < front + 4; x += 4) {
        const xx = Math.min(x, front), e = Math.min(1, xx / tp, (front - xx) / tp);
        d += 'L' + xx.toFixed(1) + ',' + (-amp * e * Math.sin(TAU * (xx / wl - ph))).toFixed(1);
      }
      path.setAttribute('d', d);
      if (head) tr(head, tip, 0);
    };
    g.upd(0, 1);
    return g;
  }
  /* a ray's front, moving at the crests' own speed, starting at t0 */
  const grow = (t, t0, r) => clamp((t - t0) * r.sp * calm / r.L);
  /* time warped by a speed factor ramping f0 -> f1 over [t0, t0 + d], so crests never jump */
  function warp(t, t0, d, f0, f1) {
    const q = t < t0 ? 0 : t < t0 + d ? (t - t0) * (t - t0) / (2 * d) : d / 2 + (t - t0 - d);
    return f0 * t + (f1 - f0) * q;
  }
  function earth(parent, r) {
    const g = G(parent);
    const halo = E('circle', { cx: -r * 0.6, cy: 0, r: r * 1.55, fill: glow(HOT) }, g);
    E('circle', { r, fill: ball('#3FA0E8', '#174C86') }, g);
    const cp = E('clipPath', { id: 'radEarthClip' }, defs()); E('circle', { r: r - 1 }, cp);
    const land = G(g, { 'clip-path': 'url(#radEarthClip)' });
    [[-20, -24, 26, 17, 3], [22, 14, 26, 20, 5], [-30, 30, 16, 12, 8], [28, -36, 18, 10, 9]].forEach(([x, y, rx, ry, s]) =>
      E('path', { d: closedPath(blobPts(rx, ry, 9, 0, 0.25, s)), fill: ball('#5BD27A', '#2C8C4C'), transform: `translate(${x} ${y})` }, land));
    const day = E('path', { d: `M0,${-r} A${r},${r} 0 0 0 0,${r} Z`, fill: HOT }, g);
    E('path', { d: `M0,${-r} A${r},${r} 0 0 1 0,${r} Z`, fill: '#04101A', opacity: 0.55 }, g);
    E('circle', { r, fill: 'none', stroke: '#A8DCFF', 'stroke-width': 3, opacity: 0.6 }, g);
    g.set = w => { op(halo, 0.9 * w); op(day, 0.45 * w); };
    g.set(0);
    return g;
  }
  /* brick fireplace with a log fire; bottom centre at (0,0); g.upd(t) flickers the flames */
  function fireplace(parent) {
    const g = G(parent);
    E('rect', { x: -150, y: -330, width: 300, height: 330, fill: '#6E3B2E', stroke: '#9A5A45', 'stroke-width': 3 }, g);
    let d = '';
    for (let row = 1; row < 11; row++) { const y = -330 + row * 30; d += `M-150,${y} L150,${y} `; for (let k = 0; k < 6; k++) { const x = -150 + k * 60 + (row % 2) * 30; if (x > -150 && x < 150) d += `M${x},${y} L${x},${y - 30} `; } }
    E('path', { d, stroke: '#4A251C', 'stroke-width': 3, fill: 'none', opacity: 0.85 }, g);
    E('rect', { x: -176, y: -350, width: 352, height: 28, rx: 7, fill: '#8A5A3A', stroke: '#B78358', 'stroke-width': 3 }, g);
    E('path', { d: 'M-98,0 L-98,-140 Q-98,-200 0,-200 Q98,-200 98,-140 L98,0 Z', fill: '#140A07', stroke: '#3A1C14', 'stroke-width': 6 }, g);
    const halo = E('ellipse', { cx: 0, cy: -70, rx: 160, ry: 120, fill: glow('#FFB347') }, g);
    E('rect', { x: -72, y: -30, width: 144, height: 22, rx: 11, fill: '#5A3A22', transform: 'rotate(-7)' }, g);
    E('rect', { x: -72, y: -30, width: 144, height: 22, rx: 11, fill: '#7A5236', transform: 'rotate(7)' }, g);
    const FLAME = 'M0,0 C-30,-18 -36,-66 0,-122 C36,-66 30,-18 0,0 Z';
    const fl = [[-34, 0.72, '#FF6A2B'], [30, 0.8, '#FF6A2B'], [0, 1, '#FF8A3D'], [-12, 0.62, '#FFB13B'], [14, 0.55, '#FFE07A']].map(([x, s, c]) => ({ el: E('path', { d: FLAME, fill: c }, g), x, s }));
    g.upd = t => {
      fl.forEach((f, i) => { const sy = f.s * (1 + 0.12 * Math.sin(t * 11 + i * 1.7)), sx = f.s * (1 + 0.07 * Math.sin(t * 7 + i)); f.el.setAttribute('transform', `translate(${f.x} -22) scale(${sx.toFixed(3)} ${sy.toFixed(3)})`); });
      op(halo, 0.8 + 0.2 * Math.sin(t * 9));
    };
    g.upd(0);
    return g;
  }
  /* head and shoulders in profile, facing left, head centre at (0,0); g.set(warm 0..1) glows the cheek */
  function faceBust(parent) {
    const g = G(parent);
    E('path', { d: 'M-150,420 L-150,215 Q-142,140 -40,128 L70,128 Q170,140 178,215 L178,420 Z', fill: linGrad('#6A9AF2', '#2F5DB8', true) }, g);
    E('rect', { x: -22, y: 50, width: 60, height: 92, rx: 20, fill: '#C98E62' }, g);
    E('ellipse', { rx: 72, ry: 86, fill: ball('#EDBB94', '#B9825A') }, g);
    E('path', { d: 'M-68,-14 Q-98,22 -66,32 Z', fill: '#E2A982' }, g);
    E('ellipse', { cx: 30, cy: 6, rx: 13, ry: 21, fill: '#D99B70', stroke: '#B9825A', 'stroke-width': 3 }, g);
    E('path', { d: 'M-64,-44 Q-60,-100 6,-96 Q72,-92 78,-20 Q76,32 58,52 Q54,4 34,-28 Q-8,-56 -64,-44 Z', fill: '#2B1D14' }, g);
    E('path', { d: 'M-50,-14 Q-40,-22 -30,-14', fill: 'none', stroke: '#2A1D14', 'stroke-width': 5, 'stroke-linecap': 'round' }, g);
    E('path', { d: 'M-60,50 Q-48,58 -34,51', stroke: '#8A4A3A', 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round' }, g);
    const warmHalo = E('circle', { cx: -36, cy: 22, r: 80, fill: glow(HOT) }, g);
    const cheek = E('ellipse', { cx: -26, cy: 24, rx: 24, ry: 16, fill: '#FF6F5E' }, g);
    g.set = w => { op(cheek, 0.12 + 0.75 * w); op(warmHalo, 0.75 * w); };
    g.set(0);
    return g;
  }
  function radiator(parent) {
    const g = G(parent);
    g.glow = E('ellipse', { cx: 0, cy: -110, rx: 190, ry: 130, fill: glow(HOT) }, g);
    E('rect', { x: -112, y: -34, width: 14, height: 34, rx: 3, fill: '#9DB0BF' }, g);
    E('rect', { x: 98, y: -34, width: 14, height: 34, rx: 3, fill: '#9DB0BF' }, g);
    E('rect', { x: -130, y: -196, width: 260, height: 168, rx: 14, fill: linGrad('#EEF3F6', '#B8C6D0', true), stroke: '#F7FAFC', 'stroke-width': 3 }, g);
    let d = ''; for (let i = 1; i < 9; i++) { const x = (-130 + i * 260 / 9).toFixed(1); d += `M${x},-184 L${x},-40 `; }
    E('path', { d, stroke: '#A3B4C1', 'stroke-width': 4, 'stroke-linecap': 'round' }, g);
    E('rect', { x: 128, y: -66, width: 24, height: 16, rx: 5, fill: '#D0D8DE' }, g);
    return g;
  }
  /* mug, bottom centre at (0,0) */
  function mug(parent, body, dark, drink, matt) {
    const g = G(parent);
    E('path', { d: 'M52,-96 C98,-96 98,-30 50,-30', fill: 'none', stroke: dark, 'stroke-width': 15, 'stroke-linecap': 'round' }, g);
    E('rect', { x: -58, y: -124, width: 116, height: 124, rx: 16, fill: matt ? linGrad(body, dark, false) : ball(body, dark) }, g);
    E('ellipse', { cx: 0, cy: -122, rx: 52, ry: 11, fill: drink }, g);
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
  function tempTag(parent, x, y, text, lvl) {
    const g = G(parent); tr(g, x, y);
    const th = thermoIcon(g); tr(th, -42, 2, 0.8); th.set(lvl);
    T(g, -24, 12, text, { size: 32, weight: 700 });
    return g;
  }
  const STAND = { lean: 0, armL: [8, 10], armR: [-8, 10], legL: [3, -3], legR: [-3, -3] };
  const blendPose = (a, b, k) => {
    const L = (u, v) => [lerp(u[0], v[0], k), lerp(u[1], v[1], k)];
    return { lean: lerp(a.lean || 0, b.lean || 0, k), armL: L(a.armL, b.armL), armR: L(a.armR, b.armR), legL: L(a.legL, b.legL), legR: L(a.legR, b.legR) };
  };
  const beat = (t, a, b) => win(t, a, b, 0.45);
  const popIn = (t, t0) => P(t, t0, 0.5, pop);

  /* ================= title: the three ways, Radiation lit (as in conduction and convection) ================= */
  const top = G(root);
  const WAYS = ['Conduction', 'Convection', 'Radiation'], WX = [330, 600, 870], WY = 190, ME = 2;
  const ways = WAYS.map(w => {
    const g = G(top);
    const dim = chip(g, w, { size: 30, fill: C.card, stroke: C.line, color: C.muted });
    const lit = chip(g, w, { size: 30, fill: C.card2, stroke: C.energy, color: C.energy });
    return { g, dim, lit, w: lit.w };
  });

  /* ================= A. waves, and the vacuum ================= */
  const gA = G(root);
  const RY = [350, 420, 490];
  const raysA = RY.map(y => irRay(gA, 70, y, 1130, y, { amp: 18, wl: 76, width: 6, speed: 280 }));
  const lightRay = irRay(gA, 70, 262, 1130, 262, { amp: 10, wl: 36, width: 5, color: Y, speed: 280 });
  const lblLight = T(gA, 70, 234, 'light', { size: 28, weight: 700, fill: Y });
  const lblIR = T(gA, 70, 318, 'infrared', { size: 28, weight: 700, fill: HOT });
  const chTh = chip(gA, 'thermal radiation', { size: 30, fill: C.card2, stroke: HOT, sw: 2.5 }); tr(chTh, 360, 600);
  const alsoT = T(gA, 600, 609, 'also called', { size: 26, weight: 600, fill: C.muted, anchor: 'middle' });
  const chIR = chip(gA, 'infrared radiation', { size: 30, fill: C.card2, stroke: HOT, sw: 2.5 }); tr(chIR, 840, 600);
  const emChip = rich(gA, 600, 610, [['electromagnetic waves', Y, 800], [', like light', C.ink]], { size: 32, anchor: 'middle' });
  const boxG = G(gA);
  E('rect', { x: 440, y: 300, width: 320, height: 240, rx: 12, fill: 'rgba(200,230,250,0.07)', stroke: '#CFE7F5', 'stroke-width': 4 }, boxG);
  E('rect', { x: 454, y: 314, width: 8, height: 206, rx: 4, fill: 'rgba(255,255,255,0.22)' }, boxG);
  const gasG = G(boxG); tr(gasG, 450, 310);
  const gas = particleBox(gasG, 300, 220, { n: 12, r: 10, box: false, color: C.air, dark: '#3D7DB0', seed: 23 });
  const gasDots = Array.from(gas.childNodes);
  const vacLbl = rich(gA, 600, 590, [['vacuum', C.air, 800], [': no particles', C.ink]], { size: 32, anchor: 'middle' });
  const onlyChip = chip(gA, 'the only way across', { size: 30, fill: 'rgba(255,138,61,0.16)', stroke: HOT, color: HOT, sw: 2.5 }); tr(onlyChip, 600, 656);

  /* ================= B. Sun to Earth ================= */
  const gB = G(root);
  const stars = G(gB), sr = rng(71), starList = [];
  for (let k = 0; starList.length < 30 && k < 600; k++) {
    const x = 280 + sr() * 700, y = 130 + sr() * 560;
    if (y > 330 && y < 470) continue;                          // the waves' path
    if (y > 560 && y < 690 && x > 280 && x < 940) continue;    // the distance label
    if (y > 196 && y < 250 && x > 460 && x < 740) continue;    // "empty space"
    starList.push({ el: E('circle', { cx: x.toFixed(1), cy: y.toFixed(1), r: (1.2 + sr() * 1.8).toFixed(2), fill: '#DCEBFF' }, stars), ph: sr(), per: 1.6 + sr() * 2.4 });
  }
  const sunB = sun(gB, 70); tr(sunB, 170, 400);
  const earthB = earth(gB, 62); tr(earthB, 1045, 400);
  const raysB = [[292, 352, 1006, 362], [296, 400, 979, 400], [292, 448, 1006, 438]].map(([a, b, c, d]) => irRay(gB, a, b, c, d, { amp: 14, wl: 62, width: 6, speed: 300 }));
  const sunLbl = T(gB, 170, 552, 'Sun', { size: 30, weight: 700, anchor: 'middle', fill: '#FFD24A' });
  const earthLbl = T(gB, 1045, 512, 'Earth', { size: 30, weight: 700, anchor: 'middle', fill: '#A8DCFF' });
  const spaceLbl = T(gB, 600, 232, 'empty space', { size: 30, weight: 600, fill: C.muted, anchor: 'middle' });
  const distG = G(gB);
  E('path', { d: 'M170,604 L1045,604 M170,588 L170,620 M1045,588 L1045,620', stroke: C.muted, 'stroke-width': 3, 'stroke-linecap': 'round' }, distG);
  rich(distG, 607, 662, [['about ', C.muted, 600], ['150 million km', Y, 800]], { size: 38, anchor: 'middle' });

  /* ================= C. the fire across the room ================= */
  const gFloor = G(root);
  E('rect', { x: 0, y: 630, width: 1200, height: 120, fill: '#10283A' }, gFloor);
  E('line', { x1: 0, y1: 630, x2: 1200, y2: 630, stroke: C.line, 'stroke-width': 4 }, gFloor);
  const gFire = G(root);
  const fire = fireplace(gFire); tr(fire, 230, 630);
  const face = faceBust(gFire); tr(face, 960, 368);
  const raysC = [[318, 500, 872, 372], [322, 545, 868, 404], [318, 590, 872, 436]].map(([a, b, c, d]) => irRay(gFire, a, b, c, d, { amp: 12, wl: 56, width: 6, speed: 300 }));
  const acrossG = G(gFire);
  const acA = arrow(acrossG, 560, 700, 350, 700, { color: C.muted, width: 4 }), acB = arrow(acrossG, 560, 700, 770, 700, { color: C.muted, width: 4 });
  T(acrossG, 560, 682, 'across the room', { size: 28, weight: 600, anchor: 'middle', fill: C.muted });

  /* ================= D. everything gives out infrared ================= */
  const gAll = G(root);
  const tableG = G(gAll); tr(tableG, 960, 630);
  E('rect', { x: -100, y: -132, width: 200, height: 16, rx: 6, fill: '#8A5A3A', stroke: '#B78358', 'stroke-width': 2 }, tableG);
  E('path', { d: 'M-80,-116 L-88,0 M80,-116 L88,0', stroke: '#8A5A3A', 'stroke-width': 10, 'stroke-linecap': 'round' }, tableG);
  const OBJ = [
    { x: 220, base: 630, temp: '37 °C', lvl: 0.32, k: 0, make: g => { const p = person(g, { shirt: '#5B8DEF' }); tr(p, 0, 0, 1.5); p.pose(STAND); return p; },
      rays: [[-34, -205, -150, -262], [0, -318, 0, -440], [34, -205, 150, -262]] },
    { x: 590, base: 630, temp: '60 °C', lvl: 0.6, k: 0.55, make: radiator,
      rays: [[-96, -206, -190, -330], [0, -206, 0, -366], [96, -206, 190, -330]] },
    { x: 960, base: 498, temp: '80 °C', lvl: 0.82, k: 1, make: g => mug(g, '#E9F0F4', '#9DB0BF', '#9A5A2E'),
      rays: [[-50, -132, -150, -250], [0, -142, 0, -300], [50, -132, 150, -250]] },
  ].map(o => {
    const g = G(gAll); tr(g, o.x, o.base);
    o.art = o.make(g);
    const rg = G(gAll);
    o.irs = o.rays.map(([a, b, c, d]) => irRay(rg, o.x + a, o.base + b, o.x + c, o.base + d, { amp: 14, wl: 34, width: 5.5, speed: 150, hs: 15 }));
    o.g = g; o.rg = rg;
    o.tag = tempTag(gAll, o.x - 30, 694, o.temp, o.lvl);
    return o;
  });
    const evenYou = T(gAll, 350, 300, 'even you!', { size: 30, weight: 700, anchor: 'middle', fill: Y });
  const hotArrow = arrow(gAll, 300, 176, 900, 176, { color: HOT, width: 7 });
  const hotLbl = rich(gAll, 600, 152, [['hotter', HOT, 800], [' → gives out ', C.ink], ['more', HOT, 800]], { size: 30, anchor: 'middle' });

  /* ================= E. dark matt vs light shiny surfaces ================= */
  const gSurf = G(root);
  const sunE = sun(gSurf, 40); tr(sunE, 600, 205);
  const darkG = G(gSurf), shinyG = G(gSurf);
  const darkGlow = E('ellipse', { cx: 330, cy: 528, rx: 240, ry: 96, fill: glow(HOT) }, darkG);
  E('rect', { x: 170, y: 500, width: 320, height: 56, rx: 8, fill: '#1B2027', stroke: '#3A434E', 'stroke-width': 3 }, darkG);
  const darkHot = E('rect', { x: 170, y: 500, width: 320, height: 56, rx: 8, fill: '#7A3214' }, darkG);
  { const r = rng(5); let d = ''; for (let i = 0; i < 70; i++) d += `M${(178 + r() * 304).toFixed(1)},${(508 + r() * 40).toFixed(1)} l0.1,0 `; E('path', { d, stroke: '#4A525C', 'stroke-width': 3.5, 'stroke-linecap': 'round' }, darkG); }
  T(darkG, 330, 604, 'dark, matt', { size: 32, weight: 700, anchor: 'middle' });
  E('rect', { x: 710, y: 500, width: 320, height: 56, rx: 8, fill: linGrad('#FAFCFD', '#8D9BA7', true), stroke: '#FFFFFF', 'stroke-width': 3 }, shinyG);
  E('path', { d: 'M742,548 L770,508 M760,548 L780,520 M884,548 L912,508 M984,548 L1012,508', stroke: '#FFFFFF', 'stroke-width': 5, 'stroke-linecap': 'round', opacity: 0.85 }, shinyG);
  T(shinyG, 870, 604, 'light, shiny', { size: 32, weight: 700, anchor: 'middle' });
  function chipPair(parent, cx, y, a, b, stroke, color) {
    const c1 = chip(parent, a, { size: 26, fill: C.card2, stroke, color, sw: 2.5 }), c2 = chip(parent, b, { size: 26, fill: C.card2, stroke, color, sw: 2.5 });
    const tot = c1.w + c2.w + 12; tr(c1, cx - tot / 2 + c1.w / 2, y); tr(c2, cx + tot / 2 - c2.w / 2, y);
    return [c1, c2];
  }
  const [cBestE, cBestA] = chipPair(darkG, 330, 656, 'best emitter', 'best absorber', HOT, C.ink);
  const [cPoorE, cPoorA] = chipPair(shinyG, 870, 656, 'poor emitter', 'poor absorber', C.faint, C.muted);
  const RAY_IN = { amp: 11, wl: 44, width: 5.5, speed: 220 };
  const inDark = [[570, 257, 430, 498], [584, 263, 474, 498]].map(([a, b, c, d]) => irRay(darkG, a, b, c, d, RAY_IN));
  const outDark = [[214, 494, 120, 320], [268, 494, 228, 300], [322, 494, 336, 310]].map(([a, b, c, d]) => irRay(darkG, a, b, c, d, { amp: 13, wl: 40, width: 6, speed: 200 }));
  const inShiny = [[630, 257, 770, 498], [616, 263, 726, 498]].map(([a, b, c, d]) => irRay(shinyG, a, b, c, d, RAY_IN));
  const outShiny = [[770, 498, 910, 256], [726, 498, 868, 252]].map(([a, b, c, d]) => irRay(shinyG, a, b, c, d, RAY_IN));
  const weakShiny = [[990, 494, 1034, 426]].map(([a, b, c, d]) => irRay(shinyG, a, b, c, d, { amp: 4, wl: 30, width: 3.5, speed: 90, hs: 10 }));
  const reflLbl = T(shinyG, 928, 252, 'reflects', { size: 32, weight: 700, fill: C.ink });

  /* ================= F. Dark Drinks, Shiny Reflects ================= */
  const gMnem = G(root);
  card(gMnem, 170, 140, 860, 490, { fill: C.card, stroke: C.line });
  rich(gMnem, 600, 222, [['D', Y, 800], ['ark ', C.ink], ['D', Y, 800], ['rinks, ', C.ink], ['S', Y, 800], ['hiny ', C.ink], ['R', Y, 800], ['eflects', C.ink]], { size: 54, weight: 700, anchor: 'middle' });
  const cupG = G(gMnem); tr(cupG, 400, 540);
  const cupGlow = E('ellipse', { cx: 0, cy: -60, rx: 120, ry: 100, fill: glow(HOT) }, cupG);
  mug(cupG, '#2A3038', '#14181D', '#1A1410', true);
  const cupIn = [[236, 292, 382, 410], [270, 280, 410, 408]].map(([a, b, c, d]) => irRay(gMnem, a, b, c, d, { amp: 10, wl: 40, width: 5.5, speed: 200 }));
  T(gMnem, 400, 596, 'drinks it in', { size: 28, weight: 600, anchor: 'middle', fill: C.muted });
  const mirG = G(gMnem); tr(mirG, 858, 404, 1, -10);
  E('rect', { x: -12, y: 76, width: 24, height: 72, rx: 10, fill: '#C9A34A', stroke: '#F0D68A', 'stroke-width': 2 }, mirG);
  E('ellipse', { rx: 54, ry: 84, fill: '#C9A34A', stroke: '#F0D68A', 'stroke-width': 3 }, mirG);
  E('ellipse', { rx: 44, ry: 73, fill: linGrad('#FFFFFF', '#9DAFBD', false) }, mirG);
  E('path', { d: 'M-24,-34 L8,-58 M-28,-8 L18,-44', stroke: '#FFFFFF', 'stroke-width': 6, 'stroke-linecap': 'round', opacity: 0.9 }, mirG);
  const mirIn = irRay(gMnem, 636, 290, 806, 392, { amp: 10, wl: 40, width: 5.5, speed: 200 });
  const mirOut = irRay(gMnem, 806, 392, 650, 488, { amp: 10, wl: 40, width: 5.5, speed: 200 });
  T(gMnem, 850, 596, 'bounces it off', { size: 28, weight: 600, anchor: 'middle', fill: C.muted });

  /* ================= H. black solar panels, white houses ================= */
  const gUse = G(root);
  const sunH = sun(gUse, 44); tr(sunH, 600, 205);
  E('rect', { x: 0, y: 640, width: 1200, height: 110, fill: '#1A3A30' }, gUse);
  E('line', { x1: 0, y1: 640, x2: 1200, y2: 640, stroke: '#2E5848', 'stroke-width': 4 }, gUse);
  const houseL = G(gUse);
  E('rect', { x: 180, y: 500, width: 240, height: 140, fill: '#B9A58C', stroke: '#E0CCB0', 'stroke-width': 3 }, houseL);
  E('rect', { x: 278, y: 560, width: 44, height: 80, rx: 4, fill: '#6B4A33' }, houseL);
  E('rect', { x: 204, y: 532, width: 52, height: 44, rx: 4, fill: '#2F5872', stroke: '#E0CCB0', 'stroke-width': 3 }, houseL);
  E('rect', { x: 344, y: 532, width: 52, height: 44, rx: 4, fill: '#2F5872', stroke: '#E0CCB0', 'stroke-width': 3 }, houseL);
  E('path', { d: 'M156,504 L300,384 L444,504 Z', fill: '#8E4B3A', stroke: '#C27A62', 'stroke-width': 4, 'stroke-linejoin': 'round' }, houseL);
  // the panel lies on the right-hand roof slope, which faces the Sun
  const SL = [[300, 384], [444, 504]], sx = (SL[1][0] - SL[0][0]) / 188, sy = (SL[1][1] - SL[0][1]) / 188, nx = sy, ny = -sx;
  const onSlope = (f, h) => [SL[0][0] + (SL[1][0] - SL[0][0]) * f + nx * h, SL[0][1] + (SL[1][1] - SL[0][1]) * f + ny * h];
  const pq = [onSlope(0.14, 3), onSlope(0.86, 3), onSlope(0.86, 22), onSlope(0.14, 22)];
  const panelGlow = E('ellipse', { cx: 376, cy: 432, rx: 120, ry: 90, fill: glow(HOT) }, houseL);
  E('path', { d: 'M' + pq.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' L') + ' Z', fill: '#121826', stroke: '#5A6E8C', 'stroke-width': 3, 'stroke-linejoin': 'round' }, houseL);
  { let d = ''; for (let i = 1; i < 6; i++) { const a = onSlope(0.14 + i * 0.12, 3), b = onSlope(0.14 + i * 0.12, 22); d += `M${a[0].toFixed(1)},${a[1].toFixed(1)} L${b[0].toFixed(1)},${b[1].toFixed(1)} `; } const a = onSlope(0.14, 12.5), b = onSlope(0.86, 12.5); d += `M${a[0].toFixed(1)},${a[1].toFixed(1)} L${b[0].toFixed(1)},${b[1].toFixed(1)}`; E('path', { d, stroke: '#3A4A66', 'stroke-width': 2.5 }, houseL); }
  const inPanel = [[566, 244, 396, 424], [578, 256, 430, 452]].map(([a, b, c, d]) => irRay(houseL, a, b, c, d, { amp: 11, wl: 44, width: 5.5, speed: 220 }));
  const lblPanel = rich(gUse, 300, 700, [['black', Y, 800], [': soaks it up', C.ink]], { size: 32, anchor: 'middle' });
  const housesR = G(gUse);
  E('rect', { x: 660, y: 642, width: 540, height: 108, fill: '#5A4A30' }, housesR);
  [[760, 530, 110, 110], [884, 488, 130, 152], [1028, 548, 104, 92]].forEach(([x, y, w, h], i) => {
    E('rect', { x, y, width: w, height: h, fill: '#F4F7FA', stroke: '#C9D6DE', 'stroke-width': 2 }, housesR);
    E('rect', { x: x + w - 16, y, width: 16, height: h, fill: '#D5DEE5' }, housesR);
    E('rect', { x: x + w / 2 - 15, y: y + h - 50, width: 30, height: 50, rx: 14, fill: '#3B82F6' }, housesR);
    if (h > 100) E('rect', { x: x + 16, y: y + 22, width: 26, height: 26, rx: 4, fill: '#3B82F6' }, housesR);
  });
  E('path', { d: 'M904,488 A45,40 0 0 1 994,488 Z', fill: '#3B82F6' }, housesR);
  const inWhite = [[630, 244, 812, 528], [640, 236, 938, 484]].map(([a, b, c, d]) => irRay(housesR, a, b, c, d, { amp: 11, wl: 44, width: 5.5, speed: 220 }));
  const outWhite = [[812, 528, 930, 344], [938, 484, 1090, 372]].map(([a, b, c, d]) => irRay(housesR, a, b, c, d, { amp: 11, wl: 44, width: 5.5, speed: 220 }));
  const lblWhite = rich(gUse, 930, 700, [['white', C.ink, 800], [': reflects it', C.ink]], { size: 32, anchor: 'middle' });

  /* ================= I. the foil blanket ================= */
  const gFoil = G(root);
  E('rect', { x: 0, y: 640, width: 1200, height: 110, fill: '#7A3A2E' }, gFoil);
  E('path', { d: 'M0,672 L1200,672 M0,712 L1200,712', stroke: '#F2E3D3', 'stroke-width': 3, opacity: 0.6 }, gFoil);
  E('path', { d: 'M420,640 L420,150 M780,640 L780,150', stroke: '#9DB0BF', 'stroke-width': 8, 'stroke-linecap': 'round' }, gFoil);
  E('rect', { x: 430, y: 150, width: 340, height: 62, rx: 8, fill: '#E8424F', stroke: '#FFB3BA', 'stroke-width': 3 }, gFoil);
  T(gFoil, 600, 194, 'FINISH', { size: 40, weight: 700, anchor: 'middle', fill: '#FFFFFF', ls: 4 });
  const escRays = [[578, 440, 452, 408], [578, 506, 452, 534], [622, 440, 748, 408], [622, 506, 748, 534]].map(([a, b, c, d]) => irRay(gFoil, a, b, c, d, { amp: 8, wl: 30, width: 5, speed: 140, hs: 14 }));
  const runner = person(gFoil, { shirt: '#E8424F', shorts: '#22303C' });
  const blanket = G(gFoil);
  E('path', { d: 'M560,372 Q600,360 640,372 Q702,398 708,470 L716,588 Q658,604 600,596 Q542,604 484,588 L492,470 Q498,398 560,372 Z', fill: linGrad('#F5F8FA', '#97A5B1', false), opacity: 0.5 }, blanket);
  E('path', { d: 'M560,372 Q600,360 640,372 Q702,398 708,470 L716,588 Q658,604 600,596 Q542,604 484,588 L492,470 Q498,398 560,372 Z', fill: 'none', stroke: '#EEF3F6', 'stroke-width': 6, 'stroke-linejoin': 'round' }, blanket);
  E('path', { d: 'M512,420 L530,470 L516,520 M688,420 L670,470 L684,520 M540,560 L560,586 M660,560 L640,586', stroke: '#FFFFFF', 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: 0.75 }, blanket);
  const BK = { amp: 6, wl: 22, width: 4.5, speed: 110, hs: 12 };
  const backRays = [[[580, 432, 504, 452], [504, 452, 576, 478]], [[580, 508, 500, 524], [500, 524, 574, 550]], [[620, 432, 696, 452], [696, 452, 624, 478]], [[620, 508, 700, 524], [700, 524, 626, 550]]]
    .map(pair => pair.map(([a, b, c, d]) => irRay(gFoil, a, b, c, d, BK)));
  const foilLbl = G(gFoil);
  E('path', { d: 'M842,400 L712,446', stroke: C.muted, 'stroke-width': 2.5 }, foilLbl); E('circle', { cx: 712, cy: 446, r: 4.5, fill: C.muted }, foilLbl);
  T(foilLbl, 852, 396, 'shiny foil', { size: 30, weight: 700 }); T(foilLbl, 852, 432, 'blanket', { size: 30, weight: 700 });
  const backLbl = G(gFoil);
  T(backLbl, 852, 520, 'reflects the body’s', { size: 28, weight: 600, fill: C.ink });
  rich(backLbl, 852, 556, [['radiation ', HOT, 800], ['back', C.ink, 700]], { size: 28 });

  /* ================= J. the three ways ================= */
  const gThree = G(root);
  const head3 = T(gThree, 600, 178, 'All three ways', { size: 46, weight: 700, anchor: 'middle' });
  const cards = [
    { x: 240, title: 'Conduction', sub: 'through solids' },
    { x: 600, title: 'Convection', sub: 'in fluids' },
    { x: 960, title: 'Radiation', sub: 'even across empty space' },
  ].map(c => {
    const g = G(gThree);
    card(g, c.x - 165, 236, 330, 380, { fill: C.card, stroke: C.line });
    const tw = textWidth(c.title, 40, FD, 700), x0 = c.x - tw / 2;
    T(g, x0, 298, c.title, { size: 40, weight: 700 });
    const lit = G(g);
    E('circle', { cx: x0 + textWidth(c.title[0], 40, FD, 700) / 2, cy: 284, r: 36, fill: glow(Y) }, lit);
    T(lit, x0, 298, c.title[0], { size: 40, weight: 700, fill: Y });
    T(g, c.x, 596, c.sub, { size: 26, weight: 600, fill: C.muted, anchor: 'middle' });
    return Object.assign(c, { g, lit, art: G(g) });
  });
  // conduction: a bar heated at one end, its particles passing the vibration along
  const cBar = cards[0].art;
  E('rect', { x: 120, y: 410, width: 240, height: 44, rx: 8, fill: linGrad(HOT, C.carbonDk, false), stroke: '#B9C6D2', 'stroke-width': 3 }, cBar);
  const barDots = []; for (let i = 0; i < 8; i++) barDots.push(E('circle', { r: 9, fill: ball(i < 3 ? '#FFB37A' : C.carbon, i < 3 ? C.heatDk : C.carbonDk) }, cBar));
  E('path', { d: 'M0,0 C-16,-10 -18,-34 0,-60 C18,-34 16,-10 0,0 Z', fill: '#FF8A3D', transform: 'translate(150 516)' }, cBar);
  E('path', { d: 'M0,0 C-8,-6 -9,-18 0,-32 C9,-18 8,-6 0,0 Z', fill: '#FFE07A', transform: 'translate(150 514)' }, cBar);
  const cArrow = arrow(cBar, 150, 378, 340, 378, { color: HOT, width: 6 });
  // convection: a beaker heated under its left side, with a loop of moving water
  const cConv = cards[1].art;
  const bk = beaker(cConv, 180, 150, { level: 0.82, liquid: '#2C7FB0' }); tr(bk, 600, 430);
  E('path', { d: 'M0,0 C-16,-10 -18,-34 0,-60 C18,-34 16,-10 0,0 Z', fill: '#FF8A3D', transform: 'translate(560 568)' }, cConv);
  E('path', { d: 'M0,0 C-8,-6 -9,-18 0,-32 C9,-18 8,-6 0,0 Z', fill: '#FFE07A', transform: 'translate(560 566)' }, cConv);
  const upA = arrow(cConv, 560, 488, 560, 410, { color: C.bad, width: 5, bend: -10 }), downA = arrow(cConv, 640, 410, 640, 488, { color: '#7FD3FF', width: 5, bend: -10 });
  const loopDots = []; for (let i = 0; i < 6; i++) loopDots.push(E('circle', { r: 6, fill: C.ink }, cConv));
  // radiation: the Sun's waves cross empty space
  const cRad = cards[2].art;
  const sunJ = sun(cRad, 30); tr(sunJ, 862, 432);
  { const r = rng(8); let d = ''; for (let i = 0; i < 12; i++) d += `M${(918 + r() * 180).toFixed(1)},${(352 + r() * 160).toFixed(1)} l0.1,0 `; E('path', { d, stroke: '#DCEBFF', 'stroke-width': 3.5, 'stroke-linecap': 'round', opacity: 0.6 }, cRad); }
  const radRays = [[910, 400, 1092, 396], [912, 432, 1096, 432], [910, 464, 1092, 468]].map(([a, b, c, d]) => irRay(cRad, a, b, c, d, { amp: 9, wl: 36, width: 5, speed: 200, hs: 14 }));
  // the mnemonic
  const catG = G(gThree);
  const catChip = G(catG);
  const catSegs = [['C', Y, 800], ['ats ', C.ink], ['C', Y, 800], ['an’t ', C.ink], ['R', Y, 800], ['adiate', C.ink]];
  const catW = textWidth('Cats Can’t Radiate', 44, FD, 700) + 70;
  E('rect', { x: 640 - catW / 2, y: 132, width: catW, height: 76, rx: 38, fill: C.card2, stroke: Y, 'stroke-width': 3 }, catChip);
  rich(catChip, 640, 186, catSegs, { size: 44, weight: 700, anchor: 'middle' });
  const cat = G(catG); tr(cat, 640 - catW / 2 - 66, 172);
  E('path', { d: 'M-34,-12 L-30,-48 L-8,-28 Z M34,-12 L30,-48 L8,-28 Z', fill: '#F2A65A', stroke: '#FFD3A1', 'stroke-width': 3, 'stroke-linejoin': 'round' }, cat);
  E('ellipse', { rx: 40, ry: 33, fill: ball('#F2A65A', '#B8692A'), stroke: '#FFD3A1', 'stroke-width': 3 }, cat);
  const catEyes = [E('ellipse', { cx: -14, cy: -4, rx: 5, ry: 8, fill: '#1B2A1B' }, cat), E('ellipse', { cx: 14, cy: -4, rx: 5, ry: 8, fill: '#1B2A1B' }, cat)];
  E('path', { d: 'M-5,8 L5,8 L0,14 Z', fill: '#E8697A' }, cat);
  E('path', { d: 'M-9,12 L-38,5 M-9,16 L-38,19 M9,12 L38,5 M9,16 L38,19', stroke: '#FFE9D2', 'stroke-width': 2, 'stroke-linecap': 'round' }, cat);

  /* ================= update ================= */
  return t => {
    const tA0 = S.first - 0.6, tB0 = at('sun') - 0.1, tC0 = at('fire') - 0.1, tD0 = at('all') - 0.1, tE0 = at('dark') - 0.1;
    const tF0 = at('drinks') - 0.1, tH0 = at('panels') - 0.1, tI0 = at('foil') - 0.1, tJ0 = at('three') - 0.1;
    const aA = beat(t, tA0, tB0 + 0.35), aB = beat(t, tB0, tC0 + 0.35), aC = beat(t, tC0, tD0 + 0.35), aD = beat(t, tD0, tE0 + 0.35);
    const aE = beat(t, tE0, tF0 + 0.35), aF = beat(t, tF0, tH0 + 0.35), aH = beat(t, tH0, tI0 + 0.35), aI = beat(t, tI0, tJ0 + 0.35), aJ = P(t, tJ0, 0.45, linear);
    op(gA, aA); op(gB, aB); op(gFire, aC); op(gAll, aD); op(gFloor, beat(t, tC0, tE0 + 0.35)); op(gSurf, aE); op(gMnem, aF); op(gUse, aH); op(gFoil, aI); op(gThree, aJ);
    const tc = t * calm;

    /* --- title chips: the three ways, Radiation lit, then parked top right --- */
    ways.forEach((o, i) => {
      const p = P(t, mid('third', 0.02 + i * 0.07), 0.45, pop);
      if (i !== ME) {
        op(o.lit, 0);
        op(o.g, clamp(p * 2) * (1 - P(t, mid('third', 0.38), 0.5, linear)));
        tr(o.g, WX[i], WY, 0.85 + 0.15 * clamp(p));
        return;
      }
      const lit = P(t, mid('third', 0.2), 0.4, linear);
      op(o.g, clamp(p * 2)); op(o.lit, lit); op(o.dim, 1 - lit);
      const c = P(t, mid('third', 0.36), 0.8), h = P(t, at('waves') - 0.7, 0.8);
      tr(o.g, lerp(lerp(WX[i], 600, c), 1160 - o.w * 0.45, h), lerp(WY, 60, h), lerp(lerp(1, 1.5, c), 0.9, h) * (0.85 + 0.15 * clamp(p)));
    });

    /* --- A: infrared waves; electromagnetic like light; across a vacuum --- */
    if (aA > 0) {
      const t0 = at('third');
      raysA.forEach((r, i) => r.upd(tc, grow(t, t0 + 0.35 + i * 0.2, r)));
      op(chTh, P(t, mid('third', 0.3), 0.4, linear) * (1 - P(t, at('waves') - 0.1, 0.4, linear)));
      op(alsoT, P(t, mid('third', 0.47), 0.4, linear) * (1 - P(t, at('waves') - 0.1, 0.4, linear)));
      op(chIR, P(t, mid('third', 0.52), 0.4, linear) * (1 - P(t, at('waves') - 0.1, 0.4, linear)));
      const lw = win(t, at('waves') + 0.1, mid('waves', 0.4), 0.4);
      op(lightRay, lw); op(lblLight, lw); op(lblIR, lw); op(emChip, lw);
      if (lw > 0) lightRay.upd(tc, grow(t, at('waves'), lightRay));
      op(boxG, P(t, mid('waves', 0.36), 0.6, linear));
      gas.set('gas', tc, 0.5);
      gasDots.forEach((c, i) => op(c, 1 - P(t, mid('waves', 0.4) + i * 0.06, 0.35, linear)));
      op(vacLbl, P(t, mid('waves', 0.5), 0.5, linear));
      const oc = P(t, mid('waves', 0.62), 0.5, pop); op(onlyChip, clamp(oc * 2)); tr(onlyChip, 600, 656, 0.85 + 0.15 * oc);
    }

    /* --- B: the Sun's waves cross space and warm the Earth --- */
    if (aB > 0) {
      const t0 = at('sun');
      starList.forEach(s => op(s.el, 0.3 + 0.6 * wave(t, s.per, s.ph)));
      sunB.upd(tc);
      const ps = P(t, t0 - 0.1, 0.7, easeOut); tr(sunB, 170, 400, 0.7 + 0.3 * ps);
      let arrive = 1;
      raysB.forEach((r, i) => { const rv = grow(t, t0 + 0.3 + i * 0.15, r); r.upd(tc, rv); arrive = Math.min(arrive, rv); });
      earthB.set(P(t, t0 + 0.3 + 715 / 300 / calm * 0.85, 1.6, ease));
      op(sunLbl, P(t, t0, 0.5, linear)); op(earthLbl, P(t, t0 + 0.3, 0.5, linear));
      op(spaceLbl, P(t, mid('sun', 0.3), 0.5, linear));
      const dp = P(t, mid('sun', 0.45), 0.6, easeOut); op(distG, dp); tr(distG, 0, (1 - dp) * 14);
    }

    /* --- C: a fire warms your face from across the room --- */
    if (aC > 0) {
      const t0 = at('fire');
      fire.upd(tc);
      let arrive = 1;
      raysC.forEach((r, i) => { const rv = grow(t, t0 + 0.15 + i * 0.12, r); r.upd(tc, rv); arrive = Math.min(arrive, rv); });
      face.set(P(t, t0 + 0.15 + 560 / 300 / calm * 0.9, 1.0, ease));
      const ac = P(t, mid('fire', 0.45), 0.6, easeOut); op(acrossG, ac); acA.set(ac); acB.set(ac);
    }

    /* --- D: everything gives out infrared; the hotter, the more --- */
    if (aD > 0) {
      const t0 = at('all'), tH = mid('all', 0.56);
      OBJ.forEach((o, i) => {
        const p = popIn(t, t0 - 0.05 + i * 0.25);
        op(o.g, clamp(p * 2)); tr(o.g, o.x, o.base + (1 - clamp(p)) * 20);
        const kk = lerp(0.4, o.k, P(t, tH, 1.2, ease));
        const tw = warp(tc, tH, 1.2, 0.75, 0.45 + 1.0 * o.k);
        o.irs.forEach((r, j) => r.upd(tw, P(t, t0 + 0.25 + i * 0.25 + j * 0.08, 0.6, linear) * (0.42 + 0.58 * kk), 0.45 + 0.75 * kk));
        op(o.tag, P(t, tH - 0.2 + i * 0.12, 0.4, linear));
        if (o.art.glow) op(o.art.glow, 0.35 + 0.4 * P(t, tH, 1.2, linear));
      });
      op(evenYou, P(t, mid('all', 0.3), 0.4, linear));
      hotArrow.set(P(t, mid('all', 0.54), 0.9)); op(hotArrow, P(t, mid('all', 0.52), 0.3, linear));
      op(hotLbl, P(t, mid('all', 0.58), 0.5, linear));
    }

    /* --- E: dark matt surfaces absorb and emit best; light shiny ones reflect --- */
    if (aE > 0) {
      const t0 = at('dark'), ts = at('shiny');
      sunE.upd(tc);
      const pD = popIn(t, t0 + 0.1), pS = popIn(t, t0 + 0.35);
      const focusS = P(t, ts - 0.1, 0.5, linear);
      op(darkG, clamp(pD * 2) * (1 - 0.35 * focusS * (1 - P(t, mid('shiny', 0.75), 0.6, linear))));
      op(shinyG, clamp(pS * 2) * lerp(0.4, 1, focusS));
      tr(darkG, 0, (1 - clamp(pD)) * 20); tr(shinyG, 0, (1 - clamp(pS)) * 20);
      // dark: waves sink in, it warms up, then it gives out strong waves
      inDark.forEach((r, i) => r.upd(tc, grow(t, mid('dark', 0.16) + i * 0.15, r)));
      const warm = P(t, mid('dark', 0.32), 1.6, ease);
      op(darkGlow, warm * 0.9); op(darkHot, warm * 0.55);
      outDark.forEach((r, i) => r.upd(tc, grow(t, mid('dark', 0.5) + i * 0.12, r)));
      const ce = popIn(t, mid('dark', 0.58)), ca = popIn(t, mid('dark', 0.8));
      op(cBestE, clamp(ce * 2)); op(cBestA, clamp(ca * 2));
      // shiny: waves bounce straight off; it gives out only weak waves
      const s0 = ts + 0.05;
      inShiny.forEach((r, i) => r.upd(tc, grow(t, s0 + i * 0.15, r)));
      outShiny.forEach((r, i) => r.upd(tc, grow(t, s0 + i * 0.15 + inShiny[i].L / inShiny[i].sp / calm, r)));
      weakShiny.forEach((r, i) => { r.upd(tc, grow(t, mid('shiny', 0.38) + i * 0.15, r)); op(r, 0.6); });
      const pe = popIn(t, mid('shiny', 0.42)), pa = popIn(t, mid('shiny', 0.62));
      op(cPoorE, clamp(pe * 2)); op(cPoorA, clamp(pa * 2));
      op(reflLbl, P(t, mid('shiny', 0.66), 0.4, linear));
    }

    /* --- F: Dark Drinks, Shiny Reflects --- */
    if (aF > 0) {
      const t0 = at('drinks'), pc = P(t, t0 - 0.1, 0.5, pop);
      tr(gMnem, 600 * (1 - Math.max(0.01, 0.9 + 0.1 * pc)), 380 * (1 - Math.max(0.01, 0.9 + 0.1 * pc)), Math.max(0.01, 0.9 + 0.1 * pc));
      cupIn.forEach((r, i) => r.upd(tc, grow(t, t0 + 0.2 + i * 0.15, r)));
      op(cupGlow, 0.3 + 0.6 * P(t, t0 + 0.8, 1.2, ease));
      mirIn.upd(tc, grow(t, t0 + 0.3, mirIn)); mirOut.upd(tc, grow(t, t0 + 0.3 + mirIn.L / mirIn.sp / calm, mirOut));
    }

    /* --- H: black solar panels soak it up; white houses reflect it --- */
    if (aH > 0) {
      const t0 = at('panels'), tw0 = at('white');
      sunH.upd(tc);
      const pl = popIn(t, t0); op(houseL, clamp(pl * 2)); tr(houseL, 0, (1 - clamp(pl)) * 20);
      inPanel.forEach((r, i) => r.upd(tc, grow(t, t0 + 0.3 + i * 0.15, r)));
      op(panelGlow, 0.9 * P(t, mid('panels', 0.45), 1.0, ease));
      op(lblPanel, P(t, mid('panels', 0.5), 0.4, linear));
      const pr = popIn(t, tw0 - 0.05); op(housesR, clamp(pr * 2)); tr(housesR, 0, (1 - clamp(pr)) * 20);
      inWhite.forEach((r, i) => r.upd(tc, grow(t, tw0 + 0.25 + i * 0.15, r)));
      outWhite.forEach((r, i) => r.upd(tc, grow(t, tw0 + 0.25 + i * 0.15 + inWhite[i].L / inWhite[i].sp / calm, r)));
      op(lblWhite, P(t, mid('white', 0.55), 0.4, linear));
    }

    /* --- I: a foil blanket reflects the runner's radiation back --- */
    if (aI > 0) {
      const t0 = at('foil'), stop = t0 + 1.5;
      const run = P(t, t0 - 0.2, 1.7, easeOut), k = P(t, stop - 0.4, 0.6, ease);
      tr(runner, lerp(250, 600, run), 640, 1.75);
      runner.pose(blendPose(runPose(tc, 1.5), STAND, k));
      const wrap = P(t, mid('foil', 0.3), 0.8, easeOut);
      op(blanket, clamp(wrap * 1.5));
      blanket.setAttribute('transform', `translate(600 366) scale(1 ${Math.max(0.05, wrap).toFixed(3)}) translate(-600 -366)`);
      const esc = P(t, stop - 0.2, 0.4, linear) * (1 - P(t, mid('foil', 0.36), 0.5, linear));
      escRays.forEach((r, i) => { r.upd(tc, grow(t, stop - 0.2 + i * 0.1, r)); op(r, esc); });
      backRays.forEach((pair, i) => {
        const s0 = mid('foil', 0.48) + i * 0.15, s1 = s0 + pair[0].L / pair[0].sp / calm;
        pair[0].upd(tc, grow(t, s0, pair[0])); pair[1].upd(tc, grow(t, s1, pair[1]));
      });
      op(foilLbl, P(t, mid('foil', 0.42), 0.4, linear));
      op(backLbl, P(t, mid('foil', 0.68), 0.4, linear));
    }

    /* --- J: conduction, convection, radiation; Cats Can't Radiate --- */
    if (aJ > 0) {
      const tc0 = at('cats');
      op(head3, P(t, at('three'), 0.4, linear) * (1 - P(t, tc0 - 0.2, 0.4, linear)));
      cards.forEach((c, i) => {
        const p = popIn(t, mid('three', [0.22, 0.44, 0.64][i]));
        op(c.g, clamp(p * 2)); tr(c.g, 0, (1 - clamp(p)) * 24);
        const lit = P(t, mid('cats', [0.58, 0.72, 0.86][i]), 0.35, linear);
        op(c.lit, lit);
      });
      barDots.forEach((d, i) => { const a = Math.max(0.6, 6 - i * 0.7) * calm; attr(d, 'cx', 135 + i * 30 + Math.sin(t * 17 + i) * a); attr(d, 'cy', 432 + Math.cos(t * 21 + i * 1.3) * a * 0.6); });
      cArrow.set(P(t, mid('three', 0.27), 0.8));
      loopDots.forEach((d, i) => {
        const th = (t * 0.9 * calm + i / 6) * TAU, x = 600 + Math.cos(th) * 52, y = 450 + Math.sin(th) * 30;   // up over the flame, down the far side
        attr(d, 'cx', x); attr(d, 'cy', y); d.setAttribute('fill', Math.cos(th) < 0 ? '#FF9A6A' : '#9FE0FF');
      });
      sunJ.upd(tc);
      radRays.forEach((r, i) => r.upd(tc, grow(t, mid('three', 0.66) + i * 0.1, r)));
      const pc = popIn(t, mid('cats', 0.18));
      op(catG, clamp(pc * 2)); tr(catG, 0, (1 - clamp(pc)) * -16);
      const blink = (t % 3.7) < 0.12 ? 0.15 : 1;
      catEyes.forEach(e => e.setAttribute('ry', (8 * blink).toFixed(2)));
    }
  };
});
