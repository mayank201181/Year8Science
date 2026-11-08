/* The eight energy stores.
   stores: sparks move out of one jar and into another -> eight empty slots appear, then shrink into a 4 x 2 grid in
   the corner -> one vignette per store (kinetic: a runner and a car; gravitational: a book on a high shelf, a dam;
   elastic: a drawn bow, a squashed spring; chemical: food, fuel, a battery; thermal: a hot drink and its jiggling
   particles; nuclear: an atom, a power station, the Sun; electrostatic: charges, a balloon, a thundercloud;
   magnetic: two magnets held apart); each store's badge flies into the grid as its line ends
   -> gorillas (showpiece): the grid fills the stage, the badges flip to K G E C T N E M and the words of the
   mnemonic grow out of the letters -> list: each flips back and pulses as it is named -> groups: movement,
   inside matter, position or shape -> lightning: a bolt empties a thundercloud's electrostatic jar in a flash. */
scene('stores', S => {
  const { at, end, mid } = S, root = S.root, R = S.reduce;
  const AMP = R ? 0.3 : 1;
  const fade = (t, t0, d) => P(t, t0, d || 0.4, linear);
  const popIn = (t, t0, d) => P(t, t0, d || 0.5, pop);
  const vis = (t, a, b) => win(t, a, b, 0.45);
  const f1 = v => (+v).toFixed(1);
  const bez = (a, c, b, u) => { const q = 1 - u; return [q * q * a[0] + 2 * q * u * c[0] + u * u * b[0], q * q * a[1] + 2 * q * u * c[1] + u * u * b[1]]; };
  const arcPts = (a, c, b, n) => { const o = []; for (let i = 0; i <= n; i++) o.push(bez(a, c, b, i / n)); return o; };
  function rich(parent, x, y, segs, o) {
    o = o || {};
    const t = E('text', { x, y, 'font-size': o.size || 30, 'font-weight': o.weight || 600, 'font-family': o.font || FD, 'text-anchor': o.anchor || 'start', fill: o.fill || C.ink }, parent);
    segs.forEach(s => { if (typeof s === 'string') s = [s]; E('tspan', { fill: s[1], 'font-weight': s[2] }, t).textContent = s[0]; });
    return t;
  }
  const popAt = (el, t, t0, x, y, base) => { const p = popIn(t, t0, 0.5); op(el, clamp(p * 2)); tr(el, x, y + (1 - clamp(p)) * 18, Math.max(0.01, (base || 1) * (0.8 + 0.2 * p))); return p; };
  function charge(parent, plus, r) {
    const c = G(parent);
    E('circle', { r, fill: plus ? ball('#FF6070', '#B3202F') : ball('#4C9BF0', '#1E4FA8'), stroke: '#FFFFFF', 'stroke-width': 2.5 }, c);
    E('path', { d: plus ? `M${-r * 0.5},0 H${r * 0.5} M0,${-r * 0.5} V${r * 0.5}` : `M${-r * 0.5},0 H${r * 0.5}`, stroke: '#FFFFFF', 'stroke-width': r * 0.24, 'stroke-linecap': 'round' }, c);
    return c;
  }
  const minus = (parent, x, y, s, col) => E('path', { d: `M${x - s},${y} H${x + s}`, stroke: col, 'stroke-width': s * 0.55, 'stroke-linecap': 'round' }, parent);
  const minuses = (parent, pts, s, col) => E('path', { d: pts.map(([x, y]) => `M${x - s},${y} H${x + s}`).join(' '), stroke: col, 'stroke-width': s * 0.55, 'stroke-linecap': 'round' }, parent);

  /* ================= 1. stores: energy moves out of one store and into another ================= */
  const A = G(root);
  const headA = rich(A, 600, 190, ['Energy is held in ', ['stores', C.energy, 800]], { size: 50, anchor: 'middle' });
  const jA = enJar(A, 'chemical', { w: 150, h: 200, level: 0.85 }); tr(jA, 400, 452);
  const jB = enJar(A, 'kinetic', { w: 150, h: 200, level: 0.15 }); tr(jB, 800, 452);
  const flowA = enSparkFlow(A, arcPts([400, 344], [600, 160], [800, 344], 24), { n: 6, r: 12, seed: 4 });
  const outL = T(A, 312, 318, 'out of', { size: 32, weight: 700, anchor: 'end', fill: C.energy });
  const intoL = T(A, 888, 318, 'into', { size: 32, weight: 700, fill: C.energy });

  /* ================= 2. the vignettes, one per store ================= */
  const V = [];
  /* kinetic: a runner and a car */
  {
    const g = G(root);
    E('rect', { x: 40, y: 654, width: 1120, height: 32, rx: 6, fill: '#26323C' }, g);
    const dash = E('path', { d: 'M40,670 L1160,670', stroke: '#C9D6DE', 'stroke-width': 4, 'stroke-dasharray': '34 30', opacity: 0.7 }, g);
    const runner = G(g); const pr = person(runner, { shirt: C.water, shorts: '#2B3640' }); tr(runner, 240, 654, 1.25);
    const rLines = [0, 1, 2].map(k => E('path', { d: `M${112 + k * 6},${468 + k * 34} L${166 - k * 4},${468 + k * 34}`, stroke: '#BDEBFA', 'stroke-width': 5, 'stroke-linecap': 'round' }, g));
    const car = G(g);
    E('path', { d: 'M-145,-30 C-145,-52 -132,-62 -106,-64 L-64,-66 L-34,-108 C-28,-114 -20,-116 -12,-116 L56,-116 C68,-116 76,-112 84,-104 L116,-68 C140,-64 152,-54 152,-34 L152,-30 C152,-24 147,-20 140,-20 L-138,-20 C-143,-20 -145,-24 -145,-30 Z', fill: ball('#FF6B78', '#B3202F'), stroke: '#FFC2C8', 'stroke-width': 3 }, car);
    E('path', { d: 'M-22,-70 L4,-104 L48,-104 L48,-70 Z M60,-70 L60,-104 C68,-104 72,-102 78,-96 L102,-70 Z', fill: '#BFE3FF', stroke: '#FFFFFF', 'stroke-width': 2, opacity: 0.9 }, car);
    E('ellipse', { cx: 146, cy: -50, rx: 6, ry: 9, fill: C.energy }, car);
    const wheels = [-88, 98].map(x => { const w = G(car); E('circle', { r: 28, fill: '#1B2228', stroke: '#9AA6B2', 'stroke-width': 4 }, w); E('circle', { r: 12, fill: '#9AA6B2', stroke: '#C9D6DE', 'stroke-width': 2 }, w); E('path', { d: 'M0,-18 a3,3 0 1,0 0.01,0 M18,0 a3,3 0 1,0 0.01,0 M0,18 a3,3 0 1,0 0.01,0 M-18,0 a3,3 0 1,0 0.01,0', fill: 'none', stroke: '#C9D6DE', 'stroke-width': 5, 'stroke-linecap': 'round' }, w); return { w, x }; });
    const cLines = [0, 1, 2].map(() => E('path', { stroke: '#BDEBFA', 'stroke-width': 5, 'stroke-linecap': 'round' }, g));
    const jr = enJar(g, 'kinetic', { w: 74, h: 100, level: 0.22, label: false, badge: false });
    const jc = enJar(g, 'kinetic', { w: 74, h: 100, level: 0.6, label: false, badge: false });
    const more = chip(g, 'faster, heavier: more', { size: 32, fill: '#0E3646', stroke: C.water, color: C.water, sw: 3 });
    V.push({ g, upd: t => {
      const f = id => mid('kinetic', id);
      const fast = P(t, f(0.8), 1.2);
      dash.setAttribute('stroke-dashoffset', f1((t * (260 + 200 * fast) * AMP) % 64));
      const pR = popAt(runner, t, f(0.4), 240, 654, 1.25); pr.pose(runPose(t * AMP, 1.5));
      rLines.forEach((l, k) => { l.style.opacity = (clamp(pR * 2) * (0.5 + 0.4 * wave(t, 0.5, k * 0.3))).toFixed(3); });
      const pC = popAt(car, t, f(0.48), 785, 654);
      wheels.forEach(o => tr(o.w, o.x, -28, 1, (t * (300 + 380 * fast) * AMP) % 360));
      cLines.forEach((l, k) => {
        const y = 560 + k * 24, len = 34 + 46 * fast;
        l.setAttribute('d', `M${f1(622 - len - k * 8)},${y} L${622 - k * 8},${y}`);
        l.style.opacity = (clamp(pC * 2) * (0.45 + 0.45 * wave(t, 0.4, k * 0.3))).toFixed(3);
      });
      popAt(jr, t, f(0.74), 400, 584); popAt(jc, t, f(0.78), 1042, 584);
      jr.set(0.22); jc.set(0.6 + 0.32 * fast);
      popAt(more, t, f(0.68), 640, 330);
    } });
  }
  /* gravitational potential: a book on a high shelf, water behind a dam */
  {
    const g = G(root);
    const shelf = G(g);
    E('path', { d: 'M60,660 L560,660', stroke: '#6F8495', 'stroke-width': 5, 'stroke-linecap': 'round' }, shelf);
    E('rect', { x: 110, y: 340, width: 250, height: 16, rx: 3, fill: ball('#C8955F', '#7A5230'), stroke: '#5A3B22', 'stroke-width': 2 }, shelf);
    E('path', { d: 'M140,356 L140,384 L168,356 Z M330,356 L330,384 L302,356 Z', fill: '#7A5230' }, shelf);
    const bookGlow = E('ellipse', { cx: 246, cy: 298, rx: 74, ry: 74, fill: glow(C.good) }, shelf);
    E('rect', { x: 152, y: 270, width: 30, height: 70, rx: 3, fill: '#5B8DEF', stroke: '#9CC3FF', 'stroke-width': 2 }, shelf);
    E('rect', { x: 226, y: 254, width: 40, height: 86, rx: 4, fill: ball('#FF7B6B', '#B5372D'), stroke: '#FFC2BA', 'stroke-width': 2 }, shelf);
    E('path', { d: 'M232,270 L260,270 M232,322 L260,322', stroke: '#FFE0DA', 'stroke-width': 3 }, shelf);
    const ha = [arrow(shelf, 420, 500, 420, 348, { color: C.good, width: 5 }), arrow(shelf, 420, 500, 420, 652, { color: C.good, width: 5 })];
    const hl = T(shelf, 440, 512, 'height', { size: 30, weight: 700, fill: C.good });
    const dam = G(g);
    E('path', { d: 'M640,376 L858,376 L822,660 L712,660 Z', fill: C.water, opacity: 0.85 }, dam);
    const surf = E('path', { fill: 'none', stroke: '#BDEBFA', 'stroke-width': 3 }, dam);
    E('path', { d: 'M606,334 C650,344 676,392 716,660 L606,660 Z', fill: '#3F6B4A', stroke: '#5E9A6E', 'stroke-width': 2 }, dam);
    E('path', { d: 'M858,330 L900,330 L962,660 L820,660 Z', fill: linGrad('#C9D3DC', '#7D8C99'), stroke: '#E1E8EE', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, dam);
    E('path', { d: 'M962,630 L1150,630 L1150,660 L962,660 Z', fill: C.water, opacity: 0.85 }, dam);
    E('path', { d: 'M600,660 L1150,660', stroke: '#6F8495', 'stroke-width': 5, 'stroke-linecap': 'round' }, dam);
    const da = [arrow(dam, 1062, 500, 1062, 384, { color: C.good, width: 5 }), arrow(dam, 1062, 500, 1062, 624, { color: C.good, width: 5 })];
    const dl = T(dam, 1046, 512, 'height', { size: 30, weight: 700, fill: C.good, anchor: 'end' });
    const damL = T(dam, 760, 700, 'water behind a dam', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
    V.push({ g, upd: t => {
      const p1 = P(t, mid('grav', 0.26), 0.6, easeOut);
      op(shelf, p1); tr(shelf, 0, (1 - p1) * 16);
      op(bookGlow, 0.45 + 0.3 * wave(t, 1.6) + 0.5 * Math.sin(Math.PI * P(t, mid('grav', 0.6), 0.9, linear)));
      ha.forEach(a => a.set(P(t, mid('grav', 0.42), 0.6))); op(hl, fade(t, mid('grav', 0.46)));
      const p2 = P(t, mid('grav', 0.79), 0.6, easeOut);
      op(dam, p2); tr(dam, 0, (1 - p2) * 16);
      let d = 'M646,376'; for (let x = 646; x <= 852; x += 12) d += ` L${x},${f1(376 + 2.5 * Math.sin(x * 0.07 + t * 2.4) * AMP)}`;
      surf.setAttribute('d', d);
      da.forEach(a => a.set(P(t, mid('grav', 0.85), 0.5))); op(dl, fade(t, mid('grav', 0.88))); op(damL, fade(t, mid('grav', 0.83)));
    } });
  }
  /* elastic potential: a drawn bow, a squashed spring */
  {
    const g = G(root);
    const bowG = G(g);
    const limbGlow = E('path', { fill: 'none', stroke: C.lactic, 'stroke-width': 22, 'stroke-linecap': 'round', opacity: 0 }, bowG);
    const limb = E('path', { fill: 'none', stroke: '#C8955F', 'stroke-width': 11, 'stroke-linecap': 'round' }, bowG);
    const str = E('path', { fill: 'none', stroke: '#F2F7FA', 'stroke-width': 3 }, bowG);
    const shaft = G(bowG);
    E('path', { d: 'M0,0 L232,0', stroke: '#D9C7A0', 'stroke-width': 5, 'stroke-linecap': 'round' }, shaft);
    E('path', { d: 'M230,-10 L256,0 L230,10 Z', fill: '#C9D6DE' }, shaft);
    E('path', { d: 'M6,0 L-12,-12 L0,-12 L16,0 L0,12 L-12,12 Z', fill: C.lactic }, shaft);
    const grip = E('rect', { x: -8, y: -24, width: 16, height: 48, rx: 6, fill: '#6B4A33' }, bowG);
    const handB = G(bowG); _enHand(handB);
    const lblB = T(g, 330, 702, 'stretched', { size: 30, weight: 700, anchor: 'middle', fill: C.lactic });
    const spG = G(g);
    E('rect', { x: 740, y: 652, width: 170, height: 14, rx: 4, fill: '#6F8495', stroke: '#9DB0BF', 'stroke-width': 2 }, spG);
    const spGlow = E('path', { fill: 'none', stroke: C.lactic, 'stroke-width': 24, 'stroke-linejoin': 'round', opacity: 0 }, spG);
    const spring = E('path', { fill: 'none', stroke: '#E9EEF2', 'stroke-width': 7, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, spG);
    const plate = E('rect', { x: 750, width: 150, height: 16, rx: 4, fill: '#9DB0BF', stroke: '#E1E8EE', 'stroke-width': 2 }, spG);
    const handS = G(spG); _enHand(handS);
    const lblS = T(g, 825, 706, 'squashed', { size: 30, weight: 700, anchor: 'middle', fill: C.lactic });
    V.push({ g, upd: t => {
      const pB = P(t, mid('elastic', 0.2), 0.5, easeOut); op(bowG, pB);
      const k = P(t, mid('elastic', 0.36), 1.0) * (1 + (R ? 0 : 0.012 * Math.sin(t * 9)));
      const top = [330 - 22 * k, 300 + 16 * k], bot = [330 - 22 * k, 640 - 16 * k], c = [440 + 12 * k, 470], nx = 330 - 130 * k;
      const dl = `M${f1(top[0])},${f1(top[1])} Q${f1(c[0])},470 ${f1(bot[0])},${f1(bot[1])}`;
      limb.setAttribute('d', dl); limbGlow.setAttribute('d', dl); op(limbGlow, (0.4 + 0.45 * Math.sin(Math.PI * P(t, mid('elastic', 0.68), 0.8, linear))) * k);
      str.setAttribute('d', `M${f1(top[0])},${f1(top[1])} L${f1(nx)},470 L${f1(bot[0])},${f1(bot[1])}`);
      str.setAttribute('stroke', k > 0.05 ? '#FFC6DF' : '#F2F7FA');
      tr(shaft, nx, 470); tr(grip, 385 - 5 * k, 470); tr(handB, nx - 20, 470, 1.2); op(handB, fade(t, mid('elastic', 0.32), 0.3));
      op(lblB, fade(t, mid('elastic', 0.44)));
      const pS = P(t, mid('elastic', 0.3), 0.5, easeOut); op(spG, pS);
      const sq = P(t, mid('elastic', 0.5), 0.9), hS = lerp(210, 104, sq), topY = 652 - hS;
      let d = 'M825,652'; for (let i = 1; i <= 9; i++) d += ` L${i === 9 ? 825 : (i % 2 ? 774 : 876)},${f1(652 - hS * i / 9)}`;
      spring.setAttribute('d', d); spGlow.setAttribute('d', d); op(spGlow, (0.42 + 0.45 * Math.sin(Math.PI * P(t, mid('elastic', 0.85), 0.8, linear))) * sq);
      attr(plate, 'y', topY - 16);
      tr(handS, 825, topY - 38, 1.3, 90);
      op(lblS, fade(t, mid('elastic', 0.58)));
    } });
  }
  /* chemical: food, fuel, a battery */
  {
    const g = G(root);
    const food = G(g);
    E('path', { d: 'M-104,22 L104,22 L104,30 C104,36 100,40 94,40 L-94,40 C-100,40 -104,36 -104,30 Z', fill: ball('#E8B46A', '#A8722E'), stroke: '#8A5A26', 'stroke-width': 2.5 }, food);
    E('path', { d: 'M-108,22 C-90,4 -72,30 -54,12 C-36,30 -18,4 0,18 C18,4 36,30 54,12 C72,30 90,4 108,22 Z', fill: C.plant }, food);
    E('rect', { x: -98, y: -2, width: 196, height: 18, rx: 7, fill: '#FF6B5C' }, food);
    E('path', { d: 'M-104,-8 C-104,-54 -60,-68 0,-68 C60,-68 104,-54 104,-8 Z', fill: ball('#F0C27A', '#B07A34'), stroke: '#8A5A26', 'stroke-width': 2.5 }, food);
    const can = G(g);
    E('path', { d: 'M-56,-60 L40,-60 L58,-42 L58,70 C58,78 52,84 44,84 L-56,84 C-64,84 -70,78 -70,70 L-70,-46 C-70,-54 -64,-60 -56,-60 Z', fill: ball('#E8424F', '#A4232E'), stroke: '#FF9AA2', 'stroke-width': 3 }, can);
    E('path', { d: 'M-50,-36 L38,64 M38,-36 L-50,64', stroke: '#FF9AA2', 'stroke-width': 5, opacity: 0.55, 'stroke-linecap': 'round' }, can);
    E('path', { d: 'M-50,-60 L-50,-84 L10,-84 L10,-60', fill: 'none', stroke: '#C9D6DE', 'stroke-width': 7, 'stroke-linejoin': 'round' }, can);
    E('rect', { x: 30, y: -88, width: 22, height: 32, rx: 4, fill: '#C9D6DE', transform: 'rotate(30 41 -72)' }, can);
    const bat = G(g);
    E('rect', { x: -14, y: -104, width: 28, height: 18, rx: 4, fill: '#D9DEE3', stroke: '#9AA6B2', 'stroke-width': 2 }, bat);
    E('rect', { x: -40, y: -90, width: 80, height: 174, rx: 14, fill: ball('#3A4855', '#1B2228'), stroke: '#9AA6B2', 'stroke-width': 3 }, bat);
    E('rect', { x: -37, y: -87, width: 74, height: 70, rx: 12, fill: ball('#FFC247', '#9A630A') }, bat);
    T(bat, 0, -38, '+', { size: 46, weight: 800, anchor: 'middle', fill: '#3A2600' });
    const items = [[food, 270, 'food'], [can, 600, 'fuel'], [bat, 930, 'battery']].map(([el, x, w]) => ({ el, x, lab: T(g, x, 616, w, { size: 30, weight: 700, anchor: 'middle' }) }));
    const sps = [];
    items.forEach((it, i) => [0, 1].forEach(j => sps.push({ s: spark(g, 13, { seed: i * 2 + j + 3 }), x: it.x + (j ? 34 : -34), i })));
    V.push({ g, upd: t => {
      const F = [0.27, 0.35, 0.5];
      items.forEach((it, i) => { popAt(it.el, t, mid('chemical', F[i]), it.x, 470); op(it.lab, fade(t, mid('chemical', F[i]) + 0.1)); });
      sps.forEach((s, k) => {
        const u = P(t, mid('chemical', 0.74) + s.i * 0.12 + (k % 2) * 0.08, 0.9, easeOut);
        if (u <= 0) { op(s.s, 0); return; }
        tr(s.s, lerp(items[s.i].x, s.x, u), lerp(470, 336, u) + (R ? 0 : 3 * Math.sin(t * 2.2 + k)), 0.6 + 0.4 * u); s.s.upd(t); op(s.s, clamp(u * 3));
      });
    } });
  }
  /* thermal: a hot drink and its jiggling particles */
  {
    const g = G(root);
    const mug = G(g);
    E('path', { d: 'M58,-40 C110,-40 110,40 58,40', fill: 'none', stroke: '#E9EEF2', 'stroke-width': 14, 'stroke-linecap': 'round' }, mug);
    E('path', { d: 'M-70,-70 L70,-70 L62,60 C60,74 50,80 38,80 L-38,80 C-50,80 -60,74 -62,60 Z', fill: ball('#F4F7FA', '#A9B5C0'), stroke: '#FFFFFF', 'stroke-width': 2 }, mug);
    E('rect', { x: -66, y: -10, width: 131, height: 22, fill: C.heat, opacity: 0.85 }, mug);
    E('ellipse', { cx: 0, cy: -70, rx: 70, ry: 12, fill: '#7A5230', stroke: '#E9EEF2', 'stroke-width': 3 }, mug);
    const steam = heatWaves(mug, { n: 3, h: 80, spacing: 30, color: '#EAF2F7', width: 5, speed: 0.6 }); tr(steam, 0, -88);
    const BX = 810, BY = 455, BR = 160;
    const zoom = E('path', { d: `M366,442 L${BX - 126},${BY - 99} M366,462 L${BX - 126},${BY + 99}`, stroke: '#F2F7FA', 'stroke-width': 2.5, 'stroke-dasharray': '7 7', opacity: 0.6 }, g);
    const bub = G(g);
    E('circle', { cx: BX, cy: BY, r: BR, fill: '#0E2230' }, bub);
    const cid = 'storesThermalClip';
    { const cp = E('clipPath', { id: cid }, defs()); E('circle', { cx: BX, cy: BY, r: BR - 4 }, cp); }
    const inner = G(bub, { 'clip-path': `url(#${cid})` });
    E('rect', { x: BX - BR, y: BY - 40, width: 2 * BR, height: BR + 44, fill: '#4A2F1C' }, inner);
    E('path', { d: `M${BX - BR},${BY - 40} L${BX + BR},${BY - 40}`, stroke: '#9C6A45', 'stroke-width': 3 }, inner);
    const pb = particleBox(inner, 300, 300, { n: 22, r: 15, color: C.heat, dark: C.heatDk, box: false, seed: 9 }); tr(pb, BX - 150, BY - 178);
    E('circle', { cx: BX, cy: BY, r: BR, fill: 'none', stroke: '#F2F7FA', 'stroke-width': 4 }, bub);
    const lblP = T(g, BX, 660, 'jiggling particles', { size: 30, weight: 700, anchor: 'middle', fill: C.heat });
    const lblM = T(g, 330, 660, 'a hot drink', { size: 30, weight: 700, anchor: 'middle' });
    V.push({ g, upd: t => {
      popAt(mug, t, mid('thermal', 0.16), 330, 520); steam.upd(t);
      const pb_ = P(t, mid('thermal', 0.38), 0.6, easeOut);
      op(bub, pb_); bub.setAttribute('transform', `translate(${BX} ${BY}) scale(${(0.7 + 0.3 * pb_).toFixed(3)}) translate(${-BX} ${-BY})`);
      op(zoom, 0.6 * pb_);
      pb.set('liquid', t * AMP, 1);
      op(lblP, fade(t, mid('thermal', 0.5))); op(lblM, fade(t, mid('thermal', 0.82)));
    } });
  }
  /* nuclear: an atom's nucleus, a nuclear power station, the Sun */
  {
    const g = G(root);
    const AT = [300, 470];
    const atomG = G(g);
    const halo = E('circle', { cx: AT[0], cy: AT[1], r: 96, fill: glow(C.ethanol) }, atomG);
    [0, 60, 120].forEach(a => E('ellipse', { rx: 150, ry: 50, fill: 'none', stroke: '#9FD8FF', 'stroke-width': 2.5, opacity: 0.55, transform: `translate(${AT[0]} ${AT[1]}) rotate(${a})` }, atomG));
    const nuc = G(atomG); tr(nuc, AT[0], AT[1]);
    [[0, 0], [-15, -8], [14, -9], [-9, 13], [11, 12], [1, -20], [-22, 6], [22, 4], [-4, 23], [3, 8]].forEach(([x, y], i) => E('circle', { cx: x, cy: y, r: 10.5, fill: i % 2 ? ball('#FF6070', '#B3202F') : ball('#C9D3DC', '#6F8495'), stroke: '#2A1D3E', 'stroke-width': 1.2 }, nuc));
    const els = [0, 1, 2].map(() => E('circle', { r: 9, fill: ball(C.water, C.waterDk), stroke: '#E6F7FF', 'stroke-width': 2 }, atomG));
    const nLab = G(g);
    E('path', { d: `M${AT[0]},630 L${AT[0]},${AT[1] + 32}`, stroke: C.muted, 'stroke-width': 2.5 }, nLab);
    E('circle', { cx: AT[0], cy: AT[1] + 32, r: 4.5, fill: C.muted }, nLab);
    T(nLab, AT[0], 664, 'nucleus', { size: 30, weight: 700, anchor: 'middle', fill: C.ethanol });
    const plant = G(g);
    const tower = x => E('path', { d: `M${x - 50},640 C${x - 30},585 ${x - 30},535 ${x - 40},470 L${x + 40},470 C${x + 30},535 ${x + 30},585 ${x + 50},640 Z`, fill: linGrad('#D3DEE5', '#8DA2B3'), stroke: '#E9EEF2', 'stroke-width': 2 }, plant);
    const puffs = [];
    [700, 812].forEach(x => { for (let k = 0; k < 2; k++) puffs.push({ e: E('circle', { r: 14, fill: '#F2F7FA' }, plant), x, k }); tower(x); });
    E('path', { d: 'M620,640 L900,640', stroke: '#6F8495', 'stroke-width': 5, 'stroke-linecap': 'round' }, plant);
    T(plant, 756, 682, 'nuclear power station', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
    const sunG = G(g); const sn = sun(sunG, 54);
    const sunL = T(g, 1030, 590, 'the Sun', { size: 28, weight: 700, anchor: 'middle', fill: '#FFD24A' });
    V.push({ g, upd: t => {
      const pa = popIn(t, mid('nuclear', 0.04), 0.6);
      op(atomG, clamp(pa * 2)); atomG.setAttribute('transform', `translate(${AT[0]} ${AT[1]}) scale(${Math.max(0.01, 0.75 + 0.25 * pa).toFixed(3)}) translate(${-AT[0]} ${-AT[1]})`);
      op(halo, 0.55 + 0.4 * wave(t, 1.3));
      tr(nuc, AT[0], AT[1], 1 + 0.05 * wave(t, 0.9) * AMP);
      els.forEach((e, i) => {
        const a = i * Math.PI / 3, w = t * 1.6 * AMP + i * 2.1, ex = 150 * Math.cos(w), ey = 50 * Math.sin(w);
        attr(e, 'cx', AT[0] + ex * Math.cos(a) - ey * Math.sin(a)); attr(e, 'cy', AT[1] + ex * Math.sin(a) + ey * Math.cos(a));
      });
      op(nLab, fade(t, mid('nuclear', 0.26)));
      const pp = P(t, mid('nuclear', 0.55), 0.6, easeOut); op(plant, pp); tr(plant, 0, (1 - pp) * 16);
      puffs.forEach(o => { const q = ((t * 0.35 + o.k / 2) % 1 + 1) % 1; attr(o.e, 'cx', o.x + 10 * Math.sin(q * 4 + o.k)); attr(o.e, 'cy', 462 - q * 70); attr(o.e, 'r', 12 + q * 18); o.e.style.opacity = (0.85 * (1 - q)).toFixed(3); });
      const ps = popAt(sunG, t, mid('nuclear', 0.86), 1030, 430); sn.upd(t); op(sunL, fade(t, mid('nuclear', 0.9)));
    } });
  }
  /* electrostatic: charges that attract or repel, a charged balloon, a thundercloud */
  {
    const g = G(root);
    const pairs = G(g);
    const cA1 = charge(pairs, true, 26), cA2 = charge(pairs, false, 26), cR1 = charge(pairs, false, 26), cR2 = charge(pairs, false, 26);
    const arA = G(pairs); arrow(arA, 174, 370, 208, 370, { color: C.energy, width: 5 }); arrow(arA, 266, 370, 232, 370, { color: C.energy, width: 5 });
    const arR = G(pairs); arrow(arR, 106, 545, 66, 545, { color: C.energy, width: 5 }); arrow(arR, 334, 545, 374, 545, { color: C.energy, width: 5 });
    const lbA = T(pairs, 220, 430, 'attract', { size: 30, weight: 700, anchor: 'middle' });
    const lbR = T(pairs, 220, 606, 'repel', { size: 30, weight: 700, anchor: 'middle' });
    const balG = G(g);
    E('path', { d: 'M0,104 q-12,30 3,62 t-3,58', fill: 'none', stroke: '#C9D6DE', 'stroke-width': 2.5, 'stroke-linecap': 'round' }, balG);
    E('path', { d: 'M-8,112 L8,112 L0,96 Z', fill: '#2F6E9E' }, balG);
    E('path', { d: 'M0,-100 C106,-100 108,36 0,100 C-108,36 -106,-100 0,-100 Z', fill: ball(C.air, '#2F6E9E'), stroke: '#DDF1FF', 'stroke-width': 3 }, balG);
    E('ellipse', { cx: -34, cy: -50, rx: 12, ry: 26, fill: '#FFFFFF', opacity: 0.35, transform: 'rotate(24 -34 -50)' }, balG);
    minuses(balG, [[-30, -6], [18, -40], [34, 10], [-8, 34], [-44, 30], [4, -70], [46, -30], [16, 56]], 11, '#123A6B');
    const balL = T(g, 620, 700, 'charged balloon', { size: 28, weight: 700, anchor: 'middle' });
    const cloudG = G(g);
    const CL = [[-130, 8], [-118, -34], [-80, -52], [-46, -80], [4, -88], [44, -70], [86, -64], [124, -36], [132, 6], [96, 34], [36, 40], [-30, 38], [-94, 36]];
    const cFlick = E('ellipse', { cx: 0, cy: -10, rx: 110, ry: 60, fill: glow(C.energyLt) }, cloudG);
    E('path', { d: closedPath(CL), fill: linGrad('#7D8E9D', '#3A4855', true), stroke: '#9FB0BF', 'stroke-width': 3 }, cloudG);
    minuses(cloudG, [-84, -42, 0, 42, 84].map((x, k) => [x, 22 - (k % 2) * 8]), 11, '#DDF1FF');
    const cloudL = T(g, 965, 530, 'thundercloud', { size: 28, weight: 700, anchor: 'middle' });
    V.push({ g, upd: t => {
      const p1 = P(t, mid('electro', 0.18), 0.5, easeOut); op(pairs, p1);
      const ja = (R ? 0 : 4) * Math.max(0, Math.sin(t * 6)), jr = (R ? 0 : 4) * Math.max(0, Math.sin(t * 6 + 1.5));
      tr(cA1, 140 + ja, 370); tr(cA2, 300 - ja, 370); tr(cR1, 140 - jr, 545); tr(cR2, 300 + jr, 545);
      op(arA, fade(t, mid('electro', 0.52))); op(lbA, fade(t, mid('electro', 0.54)));
      op(arR, fade(t, mid('electro', 0.58))); op(lbR, fade(t, mid('electro', 0.6)));
      popAt(balG, t, mid('electro', 0.68), 620, 430 + (R ? 0 : 5 * Math.sin(t * 1.3))); op(balL, fade(t, mid('electro', 0.72)));
      popAt(cloudG, t, mid('electro', 0.87), 965, 420); op(cloudL, fade(t, mid('electro', 0.9)));
      const s = ((t % 2.3) + 2.3) % 2.3; op(cFlick, R ? 0.3 : (s < 0.08 ? 0.9 : s < 0.14 ? 0.2 : s < 0.3 ? 0.7 : 0.12));
    } });
  }
  /* magnetic: two magnets held apart, straining towards each other */
  {
    const g = G(root);
    const mA = G(g), mB = G(g);
    magnet(mA, 250, 72); magnet(mB, 250, 72);           // both N on the left: A's S faces B's N, so they attract
    const field = [-22, 0, 22].map(d => E('path', { d: `M675,${470 + d} C620,${470 + d * 1.9} 560,${470 + d * 1.9} 505,${470 + d}`, fill: 'none', stroke: '#C9D6DE', 'stroke-width': 3, 'stroke-dasharray': '9 8' }, g));
    const lbA = T(g, 590, 396, 'attract', { size: 30, weight: 700, anchor: 'middle', fill: C.energy });
    const hA = G(g), hB = G(g); _enHand(hA); _enHand(hB);
    const lbH = T(g, 590, 590, 'held apart', { size: 30, weight: 700, anchor: 'middle' });
    const strain = G(g); arrow(strain, 512, 556, 552, 556, { color: C.energy, width: 5 }); arrow(strain, 668, 556, 628, 556, { color: C.energy, width: 5 });
    op(strain, 0);
    V.push({ g, upd: t => {
      const pm = P(t, mid('magnetic', 0.16), 0.6, easeOut);
      const j = (R ? 0.5 : 4) * Math.max(0, Math.sin(t * 13)), j2 = (R ? 0.5 : 4) * Math.max(0, Math.sin(t * 13 + 1.1));
      tr(mA, 380 + j - (1 - pm) * 40, 470); tr(mB, 800 - j2 + (1 - pm) * 40, 470); op(mA, pm); op(mB, pm);
      const pf = fade(t, mid('magnetic', 0.44), 0.5);
      field.forEach(f => { f.style.opacity = (0.75 * pf).toFixed(3); f.setAttribute('stroke-dashoffset', f1((t * 30 * AMP) % 17)); });
      op(lbA, fade(t, mid('magnetic', 0.48)));
      const ph = fade(t, mid('magnetic', 0.73), 0.4);
      op(hA, ph); op(hB, ph); tr(hA, 312 + j, 412, 1.3, 90); tr(hB, 868 - j2, 412, 1.3, 90);
      op(lbH, fade(t, mid('magnetic', 0.82)));
    } });
  }
  const V_START = [mid('kinetic', 0.3), at('grav'), at('elastic'), at('chemical'), at('thermal'), at('nuclear'), at('electro'), at('magnetic')];
  const LINES = ['kinetic', 'grav', 'elastic', 'chemical', 'thermal', 'nuclear', 'electro', 'magnetic'];
  const V_END = LINES.map((id, i) => i < 7 ? at(LINES[i + 1]) : at('gorillas'));

  /* ================= 3. groups: three panels ================= */
  const GPan = [['movement', 60, 300], ['inside matter', 390, 300], ['position or shape', 720, 420]].map(([w, x, wd]) => {
    const g = G(root);
    card(g, x, 252, wd, 440, { fill: C.card, stroke: C.line });
    T(g, x + wd / 2, 306, w, { size: 32, weight: 700, anchor: 'middle', fill: C.energy });
    return g;
  });

  /* ================= 4. lightning: a bolt empties the cloud's electrostatic store ================= */
  const L = G(root);
  E('path', { d: 'M0,668 C200,650 400,676 600,660 C800,646 1000,672 1200,656 L1200,750 L0,750 Z', fill: linGrad('#24533F', '#12301F', true) }, L);
  const boltHalo = E('ellipse', { cx: 430, cy: 470, rx: 160, ry: 240, fill: glow(C.energyLt) }, L);
  const boltG = G(L); bolt(boltG, 1, '#FFFBE0');
  const BC = [[-190, 6], [-176, -40], [-130, -60], [-90, -96], [-30, -112], [26, -98], [70, -104], [126, -80], [172, -52], [196, -8], [164, 30], [90, 40], [10, 36], [-70, 40], [-150, 34]];
  const bigCloud = G(L); tr(bigCloud, 430, 262);
  E('path', { d: closedPath(BC), fill: linGrad('#7D8E9D', '#34424F', true), stroke: '#9FB0BF', 'stroke-width': 3.5 }, bigCloud);
  const cNeg = [-130, -80, -30, 20, 70, 120].map((x, k) => minus(bigCloud, x, 22 - (k % 2) * 8, 12, '#DDF1FF'));
  const link = E('path', { d: 'M628,262 C720,262 780,300 826,348', fill: 'none', stroke: C.air, 'stroke-width': 3, 'stroke-dasharray': '6 8', opacity: 0.7 }, L);
  const jE = enJar(L, 'electrostatic', { w: 140, h: 180, level: 0.95 }); tr(jE, 900, 450);
  const MOUTH = [900, 360];
  const burst = [], br = rng(41);
  for (let k = 0; k < 10; k++) burst.push({ s: spark(L, 11, { color: k % 5 < 2 ? EN.useful : EN.wasted, seed: k + 5 }), via: [420 + (br() - 0.5) * 60, 330 + br() * 300], e: [120 + br() * 960, 200 + br() * 440], d: br() * 0.18 });
  const flash = E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#FFFFFF' }, L);
  const gj = chip(L, 'about 1 billion J', { size: 38, fill: '#0E2A3A', stroke: C.air, color: C.ink, sw: 3 });
  const gjN = T(L, 900, 694, '1 000 000 000 J', { size: 28, weight: 700, anchor: 'middle', fill: C.air });

  /* ================= 5. the grid: slots, headers, mnemonic words, badges ================= */
  const MINI = i => [948 + (i % 4) * 64, 62 + Math.floor(i / 4) * 66];
  const BIGS = i => [345 + (i % 4) * 170, 345 + Math.floor(i / 4) * 170];
  const BIGP = i => [240 + (i % 4) * 240, 295 + Math.floor(i / 4) * 260];
  const WROW = i => [190 + i * 117, 178];
  const HEAD = [100, 192], MS = 26 / 44, BS = 1.25, WS = 0.7;
  const slotG = G(root);
  const slots = EN.order.map(() => E('circle', { r: 26, fill: 'rgba(10,27,39,0.55)', stroke: C.muted, 'stroke-width': 2.5, 'stroke-dasharray': '6 6', 'vector-effect': 'non-scaling-stroke' }, slotG));
  const eight = T(root, 600, 226, '8 stores', { size: 60, weight: 700, anchor: 'middle' });
  const HEADS = [
    ['kinetic', 'anything moving'], ['gravitational potential', 'because of its height'], ['elastic potential', 'stretched or squashed'],
    ['chemical', 'food, fuels and batteries'], ['thermal', 'warm, jiggling particles'], ['nuclear', 'locked in the nucleus'],
    ['electrostatic', 'charges attract or repel'], ['magnetic', 'magnets attract or repel'],
  ];
  const headG = G(root);
  const headN = T(headG, 165, 190, '', { size: 46, weight: 700 }), headK = T(headG, 165, 230, '', { size: 28, weight: 600, fill: C.muted });
  let headAt = -1;
  const WORDS = ['Kind', 'Gorillas', 'Eat', 'Chocolate,', 'Tigers', 'Never', 'Eat', 'Mango.'].map(w => {
    const g = G(root);
    rich(g, 0, 0, [[w[0], C.energy, 800], w.slice(1)], { size: 38, anchor: 'middle', weight: 600 });
    return g;
  });
  const badges = EN.order.map(k => enBadge(root, k, {}));

  /* ================= timing ================= */
  const tHead = LINES.map((id, i) => i === 0 ? mid('kinetic', 0.27) : at(id) + 0.05);
  const tFly = LINES.map(id => end(id) - 0.3), FLYD = 0.75;
  const tG = at('gorillas'), tGrp = at('groups'), tL = at('lightning');
  const WORD_F = [0.33, 0.37, 0.49, 0.53, 0.69, 0.77, 0.85, 0.89];
  const LIST_F = [0, 0.1, 0.27, 0.41, 0.52, 0.6, 0.71, 0.86];
  const GRP_POS = [[140, 470], [840, 400], [1020, 400], [470, 470], [280, 470], [610, 470], [840, 588], [1020, 588]];
  const GRP_F = [0.17, 0.75, 0.78, 0.42, 0.24, 0.48, 0.81, 0.84];
  const PAN_F = [0.15, 0.4, 0.72];
  function badgePose(i, t) {
    if (t < tHead[i]) return null;
    const pin = popIn(t, tHead[i], 0.55);
    let x = HEAD[0], y = HEAD[1], s = Math.max(0.01, 0.6 + 0.4 * pin), lab = 0, v = clamp(pin * 2);
    const pf = P(t, tFly[i], FLYD);
    if (pf > 0) { const m = MINI(i); x = lerp(HEAD[0], m[0], pf); y = lerp(HEAD[1], m[1], pf) - (i < 4 ? 62 : 100) * Math.sin(Math.PI * pf); s = lerp(1, MS, pf); }
    const pg = P(t, tG + 0.05 + i * 0.05, 1.0);
    if (pg > 0) { const m = MINI(i), b = BIGP(i); x = lerp(m[0], b[0], pg); y = lerp(m[1], b[1], pg); s = lerp(MS, BS, pg); lab = fade(t, tG + 0.8, 0.5); }
    const pw = P(t, tGrp + 0.1 + i * 0.04, 0.7);
    if (pw > 0) { const b = BIGP(i), w = WROW(i); x = lerp(b[0], w[0], pw); y = lerp(b[1], w[1], pw); s = lerp(BS, WS, pw); lab *= 1 - clamp(pw * 2); }
    const pd = P(t, mid('groups', GRP_F[i]), 0.7);
    if (pd > 0) { const w = WROW(i), q = GRP_POS[i]; x = lerp(w[0], q[0], pd); y = lerp(w[1], q[1], pd); s = lerp(WS, 1, pd); lab = clamp(pd * 1.5 - 0.5); }
    v *= 1 - fade(t, tL - 0.3, 0.4);
    return { x, y, s, lab, v };
  }

  return t => {
    /* ---- 1. two jars ---- */
    const aA = vis(t, S.first - 0.4, at('kinetic') - 0.05);
    op(A, aA);
    if (aA > 0) {
      op(headA, fade(t, at('stores') + 0.05, 0.5));
      const jp = P(t, at('stores') + 0.15, 0.6, easeOut);
      op(jA, jp); op(jB, jp); tr(jA, 400 - (1 - jp) * 40, 452); tr(jB, 800 + (1 - jp) * 40, 452);
      const bp = P(t, mid('stores', 0.56), 2.2, linear);
      flowA.batch(bp);
      let landed = 0; for (let k = 0; k < 6; k++) landed += P(bp, 0.5 + 0.5 * k / 6, 0.06, linear);
      jA.set(0.85 - 0.6 * landed / 6); jB.set(0.15 + 0.6 * landed / 6);
      op(outL, fade(t, mid('stores', 0.68))); op(intoL, fade(t, mid('stores', 0.87)));
    }

    /* ---- 2. vignettes ---- */
    V.forEach((v, i) => { const a = vis(t, V_START[i] - 0.2, V_END[i] - 0.05); op(v.g, a); if (a > 0) v.upd(t); });

    /* ---- slots: big "8 stores", then into the corner ---- */
    const sIn = fade(t, mid('kinetic', 0.01), 0.3), sOut = 1 - fade(t, tG + 0.3, 0.6);
    op(slotG, sIn * sOut);
    if (sIn * sOut > 0) {
      const sh = P(t, mid('kinetic', 0.2), 0.7);
      slots.forEach((c, i) => {
        const p = popIn(t, mid('kinetic', 0.02) + i * 0.07, 0.45), b = BIGS(i), m = MINI(i);
        tr(c, lerp(b[0], m[0], sh), lerp(b[1], m[1], sh), Math.max(0.01, lerp(60 / 26, 1, sh) * p));
      });
    }
    op(eight, fade(t, mid('kinetic', 0.03), 0.35) * (1 - fade(t, mid('kinetic', 0.2), 0.35)));

    /* ---- headers ---- */
    let hk = -1; for (let i = 0; i < 8; i++) if (t >= tHead[i]) hk = i;
    const ha = hk < 0 ? 0 : fade(t, tHead[hk] + 0.1, 0.4) * (1 - fade(t, tFly[hk] - 0.15, 0.3));
    op(headG, ha);
    if (ha > 0 && hk !== headAt) {
      headAt = hk; const st = EN.store[EN.order[hk]];
      setText(headN, HEADS[hk][0]); headN.setAttribute('fill', st.color2 ? '#FF7A85' : st.color); setText(headK, HEADS[hk][1]);
    }

    /* ---- badges ---- */
    badges.forEach((b, i) => {
      const ps = badgePose(i, t);
      if (!ps || ps.v <= 0) { op(b, 0); return; }
      op(b, ps.v);
      const lp = Math.sin(Math.PI * P(t, mid('list', LIST_F[i]), 0.55, linear));
      tr(b, ps.x, ps.y, ps.s * (1 + 0.14 * lp));
      const flip = P(t, mid('gorillas', WORD_F[i]) - 0.15, 0.35) - P(t, mid('list', LIST_F[i]) - 0.12, 0.35);
      const gl = Math.max(Math.sin(Math.PI * P(t, tFly[i] + FLYD - 0.1, 0.6, linear)), lp, Math.sin(Math.PI * P(t, mid('groups', GRP_F[i]) + 0.55, 0.6, linear)), 0.7 * Math.sin(Math.PI * P(t, tHead[i], 0.8, linear)));
      b.set({ flip, glow: gl, label: ps.lab });
    });

    /* ---- mnemonic words ---- */
    WORDS.forEach((w, i) => {
      const t0 = mid('gorillas', WORD_F[i]) - 0.05, p = popIn(t, t0, 0.5);
      const a = clamp(p * 2) * (1 - 0.55 * fade(t, mid('list', LIST_F[i]), 0.3)) * (1 - fade(t, tGrp, 0.4));
      op(w, a);
      if (a > 0) { const b = BIGP(i); tr(w, b[0], lerp(b[1], b[1] - 76, clamp(p)), Math.max(0.01, 0.3 + 0.7 * p)); }
    });

    /* ---- groups ---- */
    GPan.forEach((g, k) => { const p = P(t, mid('groups', PAN_F[k]), 0.5, easeOut); op(g, p * (1 - fade(t, tL - 0.3, 0.4))); tr(g, 0, (1 - p) * 20); });

    /* ---- lightning ---- */
    const aL = fade(t, tL - 0.15, 0.45);
    op(L, aL);
    if (aL > 0) {
      const tk = mid('lightning', 0.2), tk2 = mid('lightning', 0.58), since = t - tk, since2 = t - tk2;
      const grow = P(t, tk - 0.12, 0.12, easeIn);
      boltG.setAttribute('transform', `translate(430 474) scale(2.3 ${(3.5 * Math.max(0.01, grow)).toFixed(3)})`);
      const flick = s_ => (s_ < 0 ? 0 : s_ < 0.1 ? 1 : s_ < 0.16 ? 0.3 : s_ < 0.32 ? 1 : 1 - clamp((s_ - 0.32) / 0.5));
      const bo = since < -0.12 ? 0 : since < 0 ? 1 : Math.max(flick(since), since2 >= 0 ? flick(since2) : 0);
      op(boltG, bo); op(boltHalo, bo * 0.85);
      const fl = s_ => (s_ < 0 ? 0 : 0.75 * Math.exp(-s_ * 8));
      op(flash, Math.max(fl(since), 0.6 * fl(since2)));
      const em = P(t, tk, 0.35, easeOut);
      jE.set(0.95 - 0.92 * em);
      cNeg.forEach((m, k) => op(m, k === 1 || k === 4 ? 1 : 1 - em));
      op(link, 0.7 * (1 - 0.6 * em));
      burst.forEach(b => {
        const u = clamp((t - tk - b.d) / 1.6);
        if (u <= 0) { op(b.s, 0); return; }
        const q = u < 0.35 ? bez(MOUTH, [700, 260], b.via, ease(u / 0.35)) : bez(b.via, [(b.via[0] + b.e[0]) / 2, Math.min(b.via[1], b.e[1]) - 40], b.e, ease((u - 0.35) / 0.65));
        tr(b.s, q[0], q[1], lerp(1, 0.6, u)); b.s.upd(t); op(b.s, lerp(1, 0.45, ease(u)));
      });
      const cp = popIn(t, mid('lightning', 0.74), 0.5); op(gj, clamp(cp * 2)); tr(gj, 900, 622, Math.max(0.01, 0.8 + 0.2 * cp));
      op(gjN, fade(t, mid('lightning', 0.8)));
    }
  };
});
