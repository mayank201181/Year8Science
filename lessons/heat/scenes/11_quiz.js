/* Quick-fire quiz: five question cards, each with a picture. A countdown ring runs through the silent
   thinking time, then the answer appears, the picture acts it out, and a progress dot fills.
   Outro: "Brilliant work!" with a burst of sparks. */
scene('quiz', S => {
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
  const plain = segs => segs.map(s => (typeof s === 'string' ? s : s[0])).join('');
  const f1 = v => (+v).toFixed(1);
  /* infrared: a wavy arrow (the kit sineWave look, tapered); upd(time, front 0..1) */
  function irRay(parent, x1, y1, x2, y2, o) {
    o = o || {};
    const g = G(parent), L = Math.hypot(x2 - x1, y2 - y1);
    tr(g, x1, y1, 1, Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI);
    const wd = o.width || 5, wl = o.wl || 36, amp = o.amp || 8, sp = o.speed || 160, hs = wd * 3;
    const path = E('path', { fill: 'none', stroke: HOT, 'stroke-width': wd, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    const head = E('path', { d: `M0,0 L${-hs},${f1(-hs * 0.62)} L${f1(-hs * 0.72)},0 L${-hs},${f1(hs * 0.62)} Z`, fill: HOT }, g);
    g.L = L; g.sp = sp;
    g.upd = (t, rv) => {
      rv = clamp(rv === undefined ? 1 : rv);
      op(path, rv > 0.004 ? 1 : 0); op(head, rv > 0.004 ? 1 : 0);
      if (rv <= 0.004) return;
      const tip = rv * L, front = Math.max(2, tip - hs * 0.55), ph = t * sp / wl, tp = Math.min(wl * 0.55, front / 2);
      let d = 'M0,0';
      for (let x = 4; x < front + 4; x += 4) { const xx = Math.min(x, front), e = Math.min(1, xx / tp, (front - xx) / tp); d += 'L' + xx.toFixed(1) + ',' + (-amp * e * Math.sin(TAU * (xx / wl - ph))).toFixed(1); }
      path.setAttribute('d', d); tr(head, tip, 0);
    };
    g.upd(0, 0);
    return g;
  }
  const grow = (t, t0, r) => clamp((t - t0) * r.sp * calm / r.L);
  const popIn = (t, t0) => P(t, t0, 0.5, pop);

  /* ---------- progress dots (top right) ---------- */
  const dotsG = G(root);
  const dots = [0, 1, 2, 3, 4].map(k => {
    const g = G(dotsG); tr(g, 984 + k * 42, 58);
    const ring_ = E('circle', { r: 14, fill: 'rgba(10,27,39,0.6)', stroke: C.muted, 'stroke-width': 3 }, g);
    const fill = E('circle', { r: 14, fill: Y }, g);
    const tk = tick(g, 7, C.bg0);
    return { g, ring_, fill, tk };
  });

  /* ---------- intro ---------- */
  const intro = G(root);
  const bub = G(intro); tr(bub, 600, 190);
  E('path', { d: 'M-70,-52 H70 Q92,-52 92,-30 V22 Q92,44 70,44 H-6 L-34,72 L-30,44 H-70 Q-92,44 -92,22 V-30 Q-92,-52 -70,-52 Z', fill: Y, stroke: '#FFF3A6', 'stroke-width': 4, 'stroke-linejoin': 'round' }, bub);
  T(bub, 0, 22, '?', { size: 76, weight: 700, fill: C.bg0, anchor: 'middle' });
  T(intro, 600, 350, 'Quick-fire quiz!', { size: 76, weight: 700, anchor: 'middle' });
  rich(intro, 600, 414, ['Say each answer ', ['out loud', Y, 800], ' before it appears'], { size: 32, anchor: 'middle', fill: C.muted });

  /* ---------- pictures: each draws around (0,0) and returns (t, tAnswer) => update ---------- */
  function picUnits(g) {
    const th = thermometer(g, 170, C.bad); tr(th, -110, 20); th.set(0.55);
    const sp = spark(g, 42, { seed: 2 }); tr(sp, 100, -50);
    T(g, -110, 92, 'temperature', { size: 28, weight: 700, anchor: 'middle' });
    T(g, 100, 92, 'heat', { size: 28, weight: 700, anchor: 'middle' });
    const cC = chip(g, '°C', { size: 34, fill: C.card2, stroke: Y, color: Y, sw: 3 });
    const cJ = chip(g, 'J', { size: 34, fill: C.card2, stroke: Y, color: Y, sw: 3, w: 84 });
    return (t, ta) => {
      sp.upd(t);
      const p1 = P(t, ta + 0.25, 0.55, pop), p2 = P(t, mid('a1', 0.62), 0.55, pop);
      op(cC, clamp(p1 * 3)); tr(cC, -110, lerp(40, 148, clamp(p1)) + (p1 > 1 ? (p1 - 1) * 10 : 0));
      op(cJ, clamp(p2 * 3)); tr(cJ, 100, lerp(40, 148, clamp(p2)) + (p2 > 1 ? (p2 - 1) * 10 : 0));
    };
  }
  function picMetal(g) {
    // the conduction chapter's metal bar: a row of particles, warmest over the Bunsen, and free electrons
    // drifting in two channels above and below them
    const BW = 420, BH = 70, NP = 7, SP = BW / NP, PR = 18;
    const bn = bunsen(g, 0.5); tr(bn, -160, 162);
    E('rect', { x: -BW / 2, y: -BH / 2, width: BW, height: BH, rx: 12, fill: linGrad('#B3BEC8', '#5A6672', true), stroke: '#D3DBE2', 'stroke-width': 3 }, g);
    E('rect', { x: -BW / 2 + 12, y: -BH / 2 + 5, width: BW - 24, height: 5, rx: 2.5, fill: '#FFFFFF', opacity: 0.3 }, g);
    const pr = rng(404), parts = [];
    [1, 0.7, 0.4, 0.15, 0, 0, 0].forEach((h, i) => {
      const pg = G(g);
      E('path', { d: `M${-PR - 5},-9 Q${-PR - 10},0 ${-PR - 5},9 M${PR + 5},-9 Q${PR + 10},0 ${PR + 5},9`, fill: 'none', stroke: '#FFE2B8', 'stroke-width': 3, 'stroke-linecap': 'round', opacity: clamp((h - 0.15) * 1.6) }, pg);
      E('circle', { r: PR, fill: ball(C.water, C.waterDk) }, pg);
      E('circle', { r: PR, fill: ball(C.heat, C.heatDk), opacity: clamp(h / 0.55) }, pg);
      E('circle', { r: PR, fill: ball(C.bad, '#B8323F'), opacity: 0.85 * clamp((h - 0.72) / 0.28) }, pg);
      parts.push({ pg, h, x: -BW / 2 + SP * (i + 0.5), w1: 17 + pr() * 5, w2: 19 + pr() * 6, ph1: pr() * TAU, ph2: pr() * TAU });
    });
    const rr = rng(5), es = [];
    for (let i = 0; i < 10; i++) {
      const sp = i < 5 ? spark(g, 13, { seed: i }) : null;
      es.push({ sp, el: E('circle', { r: 5.5, fill: C.air, stroke: '#0A1B27', 'stroke-width': 1.5 }, g), x0: -195 + rr() * 390, y0: i % 2 ? 26 : -26, off: i / 10, ph: rr() * TAU });
    }
    const lb = labelLine(g, 60, -100, 18, -30, 'free electrons', { size: 28, anchor: 'start', fill: C.air, line: C.air });
    T(g, 0, 96, 'metal', { size: 28, weight: 700, anchor: 'middle', fill: C.muted });
    return (t, ta) => {
      bn.upd(t);
      parts.forEach(p => { const a = (1.2 + 7.5 * p.h) * calm; tr(p.pg, p.x + a * Math.sin(t * p.w1 + p.ph1), a * 0.45 * Math.cos(t * p.w2 + p.ph2)); });
      const z = P(t, ta + 0.1, 0.6, linear), tz = Math.max(0, t - ta - 0.1);
      es.forEach(e => {
        const wx = e.x0 + Math.sin(t * 0.9 * calm + e.ph) * 14, zx = -195 + ((tz * 300 * calm + e.off * 390) % 390);
        const x = lerp(wx, zx, z), y = e.y0 + 3 * Math.sin(t * 3 + e.ph);
        attr(e.el, 'cx', x); attr(e.el, 'cy', y);
        const edge = Math.min(1, (x + BW / 2) / 40, (BW / 2 - x) / 40);
        op(e.el, z > 0 ? lerp(1, Math.max(0.15, edge), z) : 1);
        if (e.sp) { tr(e.sp, x, y - 1); op(e.sp, z * clamp((x + 195) / 40) * clamp((195 - x) / 40)); e.sp.upd(t); }
      });
      lb.set(P(t, ta + 0.3, 0.4, linear));
    };
  }
  function picFire(g) {
    const fp = G(g); tr(fp, -150, 118, 0.5);
    E('rect', { x: -150, y: -330, width: 300, height: 330, fill: '#6E3B2E', stroke: '#9A5A45', 'stroke-width': 4 }, fp);
    let d = ''; for (let row = 1; row < 11; row++) { const y = -330 + row * 30; d += `M-150,${y} L150,${y} `; for (let k = 1; k < 6; k++) { const x = -150 + k * 60 - (row % 2) * 30; d += `M${x},${y} L${x},${y - 30} `; } }
    E('path', { d, stroke: '#4A251C', 'stroke-width': 4, fill: 'none', opacity: 0.85 }, fp);
    E('rect', { x: -176, y: -350, width: 352, height: 28, rx: 7, fill: '#8A5A3A', stroke: '#B78358', 'stroke-width': 3 }, fp);
    E('path', { d: 'M-98,0 L-98,-140 Q-98,-200 0,-200 Q98,-200 98,-140 L98,0 Z', fill: '#140A07' }, fp);
    const halo = E('ellipse', { cx: 0, cy: -70, rx: 170, ry: 130, fill: glow('#FFB347') }, fp);
    const FL = 'M0,0 C-30,-18 -36,-66 0,-122 C36,-66 30,-18 0,0 Z';
    const fls = [[-30, 0.72, '#FF6A2B'], [28, 0.78, '#FF6A2B'], [0, 1, '#FF8A3D'], [-8, 0.6, '#FFB13B'], [10, 0.52, '#FFE07A']].map(([x, s, c]) => ({ el: E('path', { d: FL, fill: c }, fp), x, s }));
    E('path', { d: 'M-250,118 L250,118', stroke: C.line, 'stroke-width': 4 }, g);
    const face = G(g); tr(face, 150, -10, 0.62);
    E('path', { d: 'M-150,250 L-150,215 Q-142,140 -40,128 L70,128 Q170,140 178,215 L178,250 Z', fill: linGrad('#6A9AF2', '#2F5DB8', true) }, face);
    E('rect', { x: -22, y: 50, width: 60, height: 92, rx: 20, fill: '#C98E62' }, face);
    E('ellipse', { rx: 72, ry: 86, fill: ball('#EDBB94', '#B9825A') }, face);
    E('path', { d: 'M-68,-14 Q-98,22 -66,32 Z', fill: '#E2A982' }, face);
    E('ellipse', { cx: 30, cy: 6, rx: 13, ry: 21, fill: '#D99B70', stroke: '#B9825A', 'stroke-width': 3 }, face);
    E('path', { d: 'M-64,-44 Q-60,-100 6,-96 Q72,-92 78,-20 Q76,32 58,52 Q54,4 34,-28 Q-8,-56 -64,-44 Z', fill: '#2B1D14' }, face);
    E('path', { d: 'M-50,-14 Q-40,-22 -30,-14', fill: 'none', stroke: '#2A1D14', 'stroke-width': 5, 'stroke-linecap': 'round' }, face);
    E('path', { d: 'M-60,50 Q-48,58 -34,51', stroke: '#8A4A3A', 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round' }, face);
    const warm = E('circle', { cx: -36, cy: 22, r: 84, fill: glow(HOT) }, face);
    const cheek = E('ellipse', { cx: -26, cy: 24, rx: 24, ry: 16, fill: '#FF6F5E' }, face);
    const rays = [[-96, 30, 92, -14], [-92, 62, 88, 6], [-96, 94, 92, 26]].map(([a, b, c, d2]) => irRay(g, a, b, c, d2, { amp: 8, wl: 34, width: 5, speed: 180 }));
    const lbl = T(g, 0, 160, 'radiation', { size: 32, weight: 700, anchor: 'middle', fill: HOT });
    return (t, ta) => {
      fls.forEach((f, i) => f.el.setAttribute('transform', `translate(${f.x} -22) scale(${(f.s * (1 + 0.07 * Math.sin(t * 7 + i))).toFixed(3)} ${(f.s * (1 + 0.12 * Math.sin(t * 11 + i * 1.7))).toFixed(3)})`));
      op(halo, 0.8 + 0.2 * Math.sin(t * 9));
      rays.forEach((r, i) => r.upd(t * calm, grow(t, ta + 0.1 + i * 0.12, r)));
      const w = P(t, ta + 0.1 + 188 / 180 / calm, 0.8, ease);
      op(warm, 0.75 * w); op(cheek, 0.15 + 0.75 * w);
      op(lbl, P(t, ta + 0.4, 0.4, linear));
    };
  }
  function picFlask(g) {
    const halo = E('ellipse', { cx: -40, cy: 0, rx: 150, ry: 200, fill: glow(C.air) }, g);
    const f = G(g); tr(f, -40, 0, 0.62);
    // the insulation chapter's flask, in its vacuum-and-silvered state: case with collar and support pad,
    // the empty gap between silvered double walls, the red drink, the stopper
    const VO = 'M-58,-232 L-58,-200 C-58,-176 -118,-170 -118,-120 L-118,196 Q-118,232 -82,232 L82,232 Q118,232 118,196 L118,-120 C118,-170 58,-176 58,-200 L58,-232 Z';
    const VI = 'M-36,-232 L-36,-196 C-36,-160 -96,-156 -96,-110 L-96,178 Q-96,210 -64,210 L64,210 Q96,210 96,178 L96,-110 C96,-156 36,-160 36,-196 L36,-232 Z';
    const VOline = VO.slice(0, -2), VIline = VI.slice(0, -2);
    E('rect', { x: -150, y: -214, width: 300, height: 476, rx: 36, fill: linGrad('#4F7C99', '#2B5068', false), stroke: '#8FB4CC', 'stroke-width': 3 }, f);
    E('rect', { x: -134, y: -198, width: 268, height: 444, rx: 26, fill: '#0C1F2B' }, f);
    E('rect', { x: -40, y: 232, width: 80, height: 14, rx: 4, fill: '#55606B' }, f);
    E('rect', { x: -76, y: -214, width: 152, height: 16, rx: 4, fill: '#3E5568' }, f);
    E('path', { d: VO, fill: '#050E16' }, f);
    const gapGlow = E('path', { d: VO, fill: '#9FD8FF' }, f);
    E('path', { d: VI, fill: '#0A1822' }, f);
    E('clipPath', { id: 'quizDrinkClip' }, defs()).appendChild(E('path', { d: VI }));
    const drink = G(f, { 'clip-path': 'url(#quizDrinkClip)' });
    E('rect', { x: -100, y: -122, width: 200, height: 340, fill: '#D93A48' }, drink);
    E('rect', { x: -100, y: -124, width: 200, height: 5, fill: '#FFFFFF', opacity: 0.35 }, drink);
    E('path', { d: 'M-58,-232 L-36,-232 M36,-232 L58,-232', stroke: '#BFD9E6', 'stroke-width': 5, 'stroke-linecap': 'round' }, f);
    E('path', { d: VOline, fill: 'none', stroke: '#F4F8FB', 'stroke-width': 8, 'stroke-linejoin': 'round' }, f);
    E('path', { d: VIline, fill: 'none', stroke: '#F4F8FB', 'stroke-width': 8, 'stroke-linejoin': 'round' }, f);
    E('path', { d: 'M-118,-80 L-118,150 M118,-80 L118,150', stroke: '#FFFFFF', 'stroke-width': 4, opacity: 0.9, 'stroke-dasharray': '24 30' }, f);
    E('rect', { x: -38, y: -236, width: 76, height: 50, rx: 8, fill: linGrad('#9AA8B4', '#5E6C78', false), stroke: '#C9D6DE', 'stroke-width': 2.5 }, f);
    E('rect', { x: -54, y: -258, width: 108, height: 26, rx: 9, fill: linGrad('#B9C6D2', '#7D8C99', false), stroke: '#DCE6ED', 'stroke-width': 2.5 }, f);
    // conduction and convection arrows hit the empty gap and stop, as in the insulation chapter
    const arr = G(f);
    const aC = arrow(arr, -30, 60, -96, 60, { color: HOT, width: 12 }), aV = arrow(arr, -20, 190, -96, 150, { color: HOT, width: 12, bend: -18 });
    const xC = cross(arr, 22), xV = cross(arr, 22);
    const lb = G(g);
    E('path', { d: 'M60,-98 L27,-62', stroke: C.air, 'stroke-width': 3 }, lb);
    E('circle', { cx: 27, cy: -62, r: 5, fill: C.air }, lb);
    const nc = chip(lb, 'no particles', { size: 28, fill: C.card2, stroke: C.air, color: C.air, sw: 3 }); tr(nc, 60 + nc.w / 2 - 10, -118);
    return (t, ta) => {
      const on = P(t, ta, 0.6, linear);
      op(gapGlow, on * (0.5 + 0.35 * wave(t, 1.2))); op(halo, on * (0.25 + 0.25 * wave(t, 1.2)));
      const pl = popIn(t, ta + 0.2); op(lb, clamp(pl * 2)); tr(lb, 0, (1 - clamp(pl)) * 14);
      const p1 = P(t, ta + 0.6, 0.5, easeOut), p2 = P(t, mid('a4', 0.55), 0.5, easeOut);
      op(arr, P(t, ta + 0.5, 0.3, linear));
      aC.set(p1); aV.set(p2);
      const x1 = popIn(t, ta + 1.1), x2 = popIn(t, mid('a4', 0.55) + 0.5);
      op(xC, clamp(x1 * 2)); tr(xC, -107, 60, Math.max(0.01, x1)); op(xV, clamp(x2 * 2)); tr(xV, -107, 150, Math.max(0.01, x2));
    };
  }
  function picSweat(g) {
    const head = G(g); tr(head, -60, 20);
    E('path', { d: 'M-118,150 Q-110,96 -60,86 L60,86 Q110,96 118,150 Z', fill: linGrad('#6A9AF2', '#2F5DB8', true) }, head);
    E('rect', { x: -26, y: 50, width: 52, height: 50, rx: 16, fill: '#C98E62' }, head);
    E('circle', { r: 100, fill: ball('#EDBB94', '#B9825A') }, head);
    E('path', { d: 'M-98,-26 Q-96,-104 0,-104 Q96,-104 98,-26 Q70,-70 0,-70 Q-70,-70 -98,-26 Z', fill: '#2B1D14' }, head);
    E('path', { d: 'M-52,4 Q-38,-6 -24,4 M24,4 Q38,-6 52,4', fill: 'none', stroke: '#2A1D14', 'stroke-width': 6, 'stroke-linecap': 'round' }, head);
    E('path', { d: 'M-58,-16 L-22,-20 M22,-20 L58,-16', stroke: '#3A2A1E', 'stroke-width': 5, 'stroke-linecap': 'round' }, head);
    E('path', { d: 'M-26,52 Q0,64 26,52', fill: 'none', stroke: '#8A4A3A', 'stroke-width': 5, 'stroke-linecap': 'round' }, head);
    const DROP = 'M0,-14 C7,-4 10,2 10,6 A10,10 0 0 1 -10,6 C-10,2 -7,-4 0,-14 Z';
    const drops = [[-44, -42], [-6, -50], [34, -40], [62, -22]].map(([x, y]) => { const d = E('path', { d: DROP, fill: '#8FD8F7', stroke: '#E6F7FF', 'stroke-width': 2 }, head); return { d, x, y }; });
    const fast = []; const fr = rng(3);
    for (let i = 0; i < 8; i++) fast.push({ tail: E('line', { stroke: '#FF9A8F', 'stroke-width': 3, 'stroke-linecap': 'round' }, g), el: E('circle', { r: 8, fill: ball('#FF6B5C', '#B5372D') }, g), k: i % 4, ang: -Math.PI / 2 + (fr() - 0.5) * 1.3, ph: fr() });
    const th = thermometer(g, 170, C.bad); tr(th, 150, 92);
    const cool = T(g, 150, 150, 'cooler', { size: 28, weight: 700, anchor: 'middle', fill: C.water });
    return (t, ta) => {
      const ev = P(t, ta, 0.4, linear);
      drops.forEach((o, i) => { const s = 1 - 0.45 * P(t, ta + 0.3, 2.5, linear); o.d.setAttribute('transform', `translate(${o.x} ${o.y + 2 * Math.sin(t * 2 + i)}) scale(${s.toFixed(3)})`); });
      fast.forEach(p => {
        const o = drops[p.k], u = ((t - ta) * 0.75 * calm + p.ph) % 1, d = u * 150;
        const x = -60 + o.x + Math.cos(p.ang) * d, y = 20 + o.y + Math.sin(p.ang) * d;
        attr(p.el, 'cx', x); attr(p.el, 'cy', y); const a = ev * (t >= ta ? 1 : 0) * Math.min(1, u * 6, (1 - u) * 3); op(p.el, a);
        attr(p.tail, 'x1', x - Math.cos(p.ang) * 26); attr(p.tail, 'y1', y - Math.sin(p.ang) * 26); attr(p.tail, 'x2', x - Math.cos(p.ang) * 13); attr(p.tail, 'y2', y - Math.sin(p.ang) * 13); op(p.tail, a * 0.55);
      });
      th.set(0.72 - 0.36 * P(t, ta + 0.4, 2.2, ease));
      op(cool, P(t, ta + 1.4, 0.4, linear));
    };
  }

  /* ---------- the five questions ---------- */
  const QS = [
    { q: ['What is temperature measured in?', 'And what is heat measured in?'], pic: picUnits,
      a: [[['Temperature: ', C.ink], ['degrees Celsius', Y, 800]], [['Heat: ', C.ink], ['joules', Y, 800]]] },
    { q: ['Why are metals the best conductors?'], pic: picMetal,
      a: [[['They have ', C.ink], ['free electrons', Y, 800], [',', C.ink]], [['which carry energy quickly', C.ink]], [['through the metal.', C.ink]]] },
    { q: ['A fire warms your face from across the room.', 'How does the energy reach you?'], pic: picFire,
      a: [[['By ', C.ink], ['radiation', Y, 800], [':', C.ink]], [['infrared waves, which', C.ink]], [['need no particles.', C.ink]]] },
    { q: ['How does the vacuum in a vacuum flask', 'keep a drink hot?'], pic: picFlask,
      a: [[['It has ', C.ink], ['no particles', Y, 800], [',', C.ink]], [['so there’s no ', C.ink], ['conduction', Y, 800]], [['and no ', C.ink], ['convection', Y, 800], ['.', C.ink]]] },
    { q: ['Why does sweating cool you down?'], pic: picSweat,
      a: [[['As sweat ', C.ink], ['evaporates', Y, 800], [',', C.ink]], [['the fastest particles escape,', C.ink]], [['so your skin is left ', C.ink], ['cooler', Y, 800], ['.', C.ink]]] },
  ].map((d, i) => {
    const g = G(root);
    const qc = G(g);
    card(qc, 120, 118, 960, 226, { fill: C.card, stroke: C.line });
    T(qc, 600, 166, `QUESTION ${i + 1} OF 5`, { size: 24, weight: 700, fill: C.muted, anchor: 'middle', font: FB, ls: 2 });
    const qs = Math.min(40, ...d.q.map(l => Math.floor(40 * 890 / Math.max(890, textWidth(l, 40, FD, 700)))));
    d.q.forEach((l, k) => T(qc, 600, (d.q.length > 1 ? 232 : 256) + k * 54, l, { size: qs, weight: 700, anchor: 'middle' }));
    const picG = G(g); tr(picG, 300, 530);
    const anim = d.pic(picG);
    const think = G(g); tr(think, 850, 520);
    const rg = ring(think, 54, Y);
    const num = T(think, 0, 16, '4', { size: 46, weight: 700, anchor: 'middle' });
    T(think, 0, 102, 'think…', { size: 28, weight: 600, fill: C.muted, anchor: 'middle' });
    const ans = G(g);
    const tk = tick(ans, 12, C.good); tr(tk, 596, 428);
    T(ans, 618, 439, 'Answer', { size: 26, weight: 700, fill: C.good });
    const size = Math.min(38, ...d.a.map(l => Math.floor(38 * 560 / Math.max(560, textWidth(plain(l), 38, FD, 700)))));
    d.a.forEach((line, k) => rich(ans, 584, 500 + k * 52, line, { size, weight: 700 }));
    return { g, qc, picG, anim, think, rg, num, ans, k: i + 1 };
  });

  /* ---------- outro ---------- */
  const outro = G(root);
  const burst = G(outro);
  const sparks = [], br = rng(17);
  for (let k = 0; k < 14; k++) { const s = spark(burst, 12 + br() * 10, { seed: k }); sparks.push({ s, a: (k / 14) * TAU + br() * 0.3, d: 200 + br() * 120, dl: br() * 0.4 }); }
  T(outro, 600, 330, 'Brilliant work!', { size: 80, weight: 700, anchor: 'middle' });
  rich(outro, 600, 404, ['Now try the ', ['Heat & Temperature quiz', Y, 800], ' in your Science Lab'], { size: 32, anchor: 'middle', fill: C.muted });
  const labChip = chip(outro, 'Science Lab  ›  Heat & Temperature  ›  Quiz', { size: 26, fill: C.card2, stroke: C.line, sw: 2 });
  tr(labChip, 600, 490);

  /* ---------- update ---------- */
  return t => {
    // progress dots
    op(dotsG, P(t, S.first - 0.4, 0.5, linear));
    dots.forEach((d, i) => {
      const k = i + 1, ans = at('a' + k), cur = t >= at('q' + k) - 0.15 && t < ans;
      const pf = P(t, ans - 0.05, 0.4, pop);
      op(d.fill, clamp(pf * 2)); op(d.tk, clamp(pf * 2));
      tr(d.g, 984 + i * 42, 58, cur ? 1.18 + 0.06 * wave(t, 1) : 1);
      d.ring_.setAttribute('stroke', cur ? Y : C.muted);
      op(d.g, clamp(P(t, mid('intro', 0.45 + i * 0.08), 0.4, pop) * 2));
    });

    // intro
    const ia = win(t, S.first - 0.6, at('q1') - 0.05, 0.35);
    op(intro, ia);
    if (ia > 0) {
      tr(bub, 600, 190 - 8 * wave(t * calm, 1.4), 0.6 + 0.4 * P(t, S.first - 0.5, 0.6, pop), -4 + 8 * wave(t * calm, 2.8));
    }

    // questions
    QS.forEach(q => {
      const k = q.k, tq = at('q' + k), ta = at('a' + k), nx = k < 5 ? at('q' + (k + 1)) : at('outro');
      const v = win(t, tq - 0.2, nx + 0.05, 0.3);
      op(q.g, v);
      if (v <= 0) return;
      const cp = P(t, tq - 0.2, 0.5, pop);
      tr(q.qc, 0, (1 - clamp(cp)) * 24);
      const pp = P(t, tq + 0.1, 0.5, pop);
      op(q.picG, clamp(pp * 2)); tr(q.picG, 300, 530 + (1 - clamp(pp)) * 20);
      q.anim(t, ta);
      const a = end('q' + k) + 0.1, b = ta - 0.05;
      const tv = win(t, a - 0.25, b + 0.05, 0.2);
      op(q.think, tv);
      if (tv > 0) { q.rg.set((t - a) / (b - a)); setText(q.num, String(clamp(Math.ceil((b - t) / ((b - a) / 4)), 1, 4))); }
      const ap = P(t, ta - 0.1, 0.5, pop);
      op(q.ans, clamp(ap * 2)); tr(q.ans, 0, (1 - clamp(ap)) * 22);
    });

    // outro
    const oa = P(t, at('outro') - 0.15, 0.5, linear);
    op(outro, oa);
    if (oa > 0) {
      const t0 = at('outro');
      sparks.forEach(o => {
        const u = clamp((t - t0 - o.dl) / 2.4), d = easeOut(u) * o.d;
        tr(o.s, 600 + Math.cos(o.a) * d * 1.5, 300 + Math.sin(o.a) * d * 0.85, 0.4 + 0.8 * Math.sin(Math.min(1, u * 1.2) * Math.PI));
        op(o.s, u > 0 && u < 1 ? Math.sin(u * Math.PI) * 0.95 : 0);
        o.s.upd(t);
      });
      op(labChip, P(t, mid('outro', 0.5), 0.5, linear));
    }
  };
});
