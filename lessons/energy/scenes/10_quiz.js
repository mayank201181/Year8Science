/* Quick-fire quiz: five question cards, each with a picture. A countdown ring runs through the silent
   thinking time, then the answer appears, the picture acts it out, and a progress dot fills.
   Pictures: a ball on a shelf over two mystery jars (gravitational empties into kinetic); "electricity"
   bouncing off a store jar onto a pathway; a motor (400 J in, 300 J useful) becoming a 75-square grid;
   a uranium rod dropping into the non-renewable column; a bulb's waste heat dissipating through a room.
   Outro: "Brilliant work!" with a burst of sparks. */
scene('quiz', S => {
  const { at, end, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;
  const Y = C.energy, O = EN.wasted, GR = EN.store.gravitational.color, KIN = EN.store.kinetic.color;

  /* ---------- local helpers ---------- */
  function rich(parent, x, y, segs, o) {
    o = o || {};
    const t = E('text', { x, y, 'font-size': o.size || 30, 'font-weight': o.weight || 600, 'font-family': o.font || FD, 'text-anchor': o.anchor || 'start', fill: o.fill || C.ink }, parent);
    segs.forEach(s => { if (typeof s === 'string') s = [s]; E('tspan', { fill: s[1], 'font-weight': s[2] }, t).textContent = s[0]; });
    return t;
  }
  const plain = segs => segs.map(s => (typeof s === 'string' ? s : s[0])).join('');
  const popIn = (t, t0) => P(t, t0, 0.5, pop);
  function show(el, p, x, y, rot) { op(el, clamp(p * 2)); tr(el, x, y + (1 - clamp(p)) * 12, Math.max(0.01, 0.8 + 0.2 * p), rot); }
  // a point on a quadratic arc from a to b, lifted by h at the middle
  const arcPt = (a, b, h, u) => [lerp(a[0], b[0], u), lerp(a[1], b[1], u) - h * 4 * u * (1 - u)];
  const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const mixC = (a, b, p) => { p = clamp(p); const x = hex(a), y = hex(b); return '#' + x.map((v, i) => Math.round(v + (y[i] - v) * p).toString(16).padStart(2, '0')).join(''); };
  /* a store jar that starts as a neutral mystery jar: kit beaker + the store's badge (as enJar draws it) */
  function mysteryJar(parent, kind, w, h, level) {
    const g = G(parent), st = EN.store[kind];
    const b = beaker(g, w, h, { marks: false, level, liquid: '#8FA3B3', opacity: 0.88 });
    const bd = enBadge(g, kind, { r: Math.round(w * 0.24), label: false }); tr(bd, 0, h * 0.16);
    g.set = (lv, reveal) => { b.set(lv, mixC('#8FA3B3', st.color, reveal)); };
    return g;
  }

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
  function picBall(g) {
    E('rect', { x: -246, y: -150, width: 10, height: 320, rx: 3, fill: '#3E5568' }, g);
    E('path', { d: 'M-236,-82 L-236,-36 L-196,-82 Z', fill: '#6B4A33', stroke: '#9A7154', 'stroke-width': 2 }, g);
    E('rect', { x: -238, y: -96, width: 128, height: 14, rx: 4, fill: ball('#C8955F', '#8A5E36'), stroke: '#5A3B22', 'stroke-width': 2 }, g);
    E('line', { x1: -236, y1: 172, x2: 240, y2: 172, stroke: '#5E7A8C', 'stroke-width': 4, 'stroke-linecap': 'round' }, g);
    const lines = G(g);
    [-10, 0, 10].forEach((dx, i) => E('line', { x1: dx, y1: -40 - (i % 2) * 8, x2: dx, y2: -78 + (i % 2) * 6, stroke: '#BDEBFA', 'stroke-width': 4, 'stroke-linecap': 'round' }, lines));
    const bl = G(g);
    E('circle', { r: 22, fill: ball('#5B8DEF', '#2F5DB8'), stroke: '#BFD4FF', 'stroke-width': 2 }, bl);
    E('path', { d: 'M-16,-6 Q0,6 16,-6', fill: 'none', stroke: '#BFD4FF', 'stroke-width': 2, opacity: 0.7 }, bl);
    const jL = mysteryJar(g, 'gravitational', 84, 112, 1); tr(jL, 30, 30);
    const jR = mysteryJar(g, 'kinetic', 84, 112, 0); tr(jR, 190, 30);
    const hide = [30, 190].map(x => {
      const c = G(g); tr(c, x, 48);
      E('circle', { r: 23, fill: C.card2, stroke: '#FFFFFF', 'stroke-width': 2.5 }, c);
      T(c, 0, 10, '?', { size: 30, weight: 700, anchor: 'middle' });
      return c;
    });
    const lbL = T(g, 30, 122, 'gravitational', { size: 26, weight: 700, anchor: 'middle', fill: GR });
    const lbR = T(g, 190, 122, 'kinetic', { size: 26, weight: 700, anchor: 'middle', fill: KIN });
    const flow = enSparkFlow(g, [[30, -30], [70, -96], [150, -96], [190, -30]], { n: 7, r: 10 });
    return (t, ta) => {
      const roll = P(t, ta + 0.4, 0.3, easeIn), fall = clamp((t - ta - 0.7) / 0.85), f = fall * fall;
      const x = lerp(-160, -94, roll), y = fall > 0 ? lerp(-118, 136, f) : -118;
      tr(bl, x, y, 1, roll * 160 + fall * 120);
      op(lines, fall > 0.25 ? 1 : 0); tr(lines, x, y);
      hide.forEach((c, i) => { const p = P(t, ta + 0.05 + i * 0.12, 0.3, linear); c.setAttribute('transform', `translate(${i ? 190 : 30} 48) scale(${Math.max(0.03, 1 - p).toFixed(3)} 1)`); op(c, 1 - p); });
      op(lbL, P(t, ta + 0.25, 0.3, linear)); op(lbR, P(t, ta + 0.35, 0.3, linear));
      const rv = P(t, ta + 0.05, 0.4, linear);
      jL.set(1 - f, rv); jR.set(f, rv);
      flow.batch(clamp((t - ta - 0.7) / 0.95));
    };
  }
  function picElec(g) {
    const jar = beaker(g, 110, 140, { level: 0, marks: false }); tr(jar, -100, 50);
    T(g, -100, 156, 'an energy store', { size: 26, weight: 700, anchor: 'middle', fill: C.muted });
    const pw = enPathway(g, 'elec', 10, 40, 226, 40, { label: false });
    const pwL = T(g, 118, 96, 'pathway', { size: 28, weight: 700, anchor: 'middle', fill: Y });
    const wd = chip(g, 'electricity', { size: 28, fill: C.card2, stroke: Y, color: Y, sw: 3 });
    const x_ = cross(g, 24), tk = tick(g, 16);
    return (t, ta) => {
      pw.set(P(t, ta + 0.1, 0.6)); pw.upd(t * calm); op(pw, P(t, ta + 0.05, 0.3, linear));
      op(pwL, P(t, ta + 1.1, 0.4, linear));
      let x = -100, y = -96 + 6 * Math.sin(t * 2.4) * calm;
      const d1 = P(t, ta + 0.1, 0.3, easeIn), b = P(t, ta + 0.4, 0.8, linear);
      if (d1 > 0) y = lerp(y, -42, d1);
      if (b > 0) [x, y] = arcPt([-100, -42], [118, 4], 120, ease(b));
      tr(wd, x, y);
      const xp = P(t, ta + 0.4, 0.4, pop); op(x_, clamp(xp * 2)); tr(x_, -100, 50, Math.max(0.01, xp));
      const kp = P(t, ta + 1.2, 0.4, pop); op(tk, clamp(kp * 2)); tr(tk, 242, 4, Math.max(0.01, kp));
    };
  }
  function picMotor(g) {
    const m = G(g);
    const sock = G(m); tr(sock, -222, 20);
    E('rect', { x: -20, y: -20, width: 40, height: 40, rx: 7, fill: '#E9EEF2', stroke: '#9AA6B2', 'stroke-width': 2.5 }, sock);
    E('rect', { x: -9, y: -10, width: 5, height: 11, rx: 2, fill: '#3A444E' }, sock); E('rect', { x: 4, y: -10, width: 5, height: 11, rx: 2, fill: '#3A444E' }, sock);
    E('path', { d: 'M-202,20 L-150,20', stroke: '#6F8797', 'stroke-width': 7, 'stroke-linecap': 'round' }, m);
    const mot = G(m); tr(mot, -70, 20, 0.75);
    E('path', { d: 'M-92,60 L-72,42 L68,42 L88,60 Z', fill: '#4B5865', stroke: '#7D8C99', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, mot);
    E('rect', { x: -105, y: -62, width: 190, height: 124, rx: 30, fill: ball('#9DB0BF', '#4B5E6E'), stroke: '#CFE0EA', 'stroke-width': 3 }, mot);
    for (let i = 0; i < 6; i++) E('line', { x1: -74 + i * 26, y1: -56, x2: -74 + i * 26, y2: 56, stroke: '#5E7282', 'stroke-width': 4, opacity: 0.7 }, mot);
    E('ellipse', { cx: 85, cy: 0, rx: 22, ry: 58, fill: ball('#B9C6D2', '#6E7F8E'), stroke: '#DCE6ED', 'stroke-width': 3 }, mot);
    E('rect', { x: -46, y: -84, width: 60, height: 24, rx: 5, fill: '#3E5568', stroke: '#8FB4CC', 'stroke-width': 2.5 }, mot);
    E('rect', { x: 106, y: -7, width: 58, height: 14, rx: 4, fill: ball('#DCE6ED', '#7D8C99') }, mot);
    const wh = G(m); tr(wh, -70 + 214 * 0.75, 20);
    const spin = G(wh);
    E('circle', { r: 42, fill: 'rgba(76,201,240,0.10)', stroke: KIN, 'stroke-width': 9 }, spin);
    for (let i = 0; i < 4; i++) { const a = i * Math.PI / 4; E('line', { x1: Math.cos(a) * 38, y1: Math.sin(a) * 38, x2: -Math.cos(a) * 38, y2: -Math.sin(a) * 38, stroke: '#BDEBFA', 'stroke-width': 3.5 }, spin); }
    E('circle', { r: 8, fill: ball('#DCE6ED', '#7D8C99') }, wh);
    const sp = [0, 1, 2].map(k => { const s = spark(g, 9, { seed: k + 2 }); return s; });
    const c1 = chip(m, '400 J supplied', { size: 28, fill: C.card, stroke: '#FFFFFF', color: C.ink, sw: 3 }); tr(c1, -132, -96);
    const c2 = chip(m, '300 J useful', { size: 28, fill: C.card, stroke: Y, color: Y, sw: 3 }); tr(c2, 120, -96);
    const lk = T(m, 90, 100, 'kinetic', { size: 26, weight: 700, anchor: 'middle', fill: KIN });
    const grid = enGrid100(g, { cell: 22, gap: 4 }); tr(grid, -128, -118);
    const gl = T(g, 0, 176, '75 of every 100 J are useful', { size: 26, weight: 700, anchor: 'middle', fill: Y });
    return (t, ta) => {
      const out = P(t, ta - 0.05, 0.45, linear);
      op(m, 1 - out);
      if (out < 1) {
        spin.setAttribute('transform', `rotate(${((t * 140 * calm) % 360).toFixed(1)})`);
        sp.forEach((s, k) => { const u = ((t * 0.7) + k / 3) % 1; tr(s, lerp(-198, -152, u), 20); op(s, (1 - out) * Math.sin(u * Math.PI)); s.upd(t); });
      } else sp.forEach(s => op(s, 0));
      const gin = P(t, ta + 0.25, 0.4, linear);
      op(grid, gin); tr(grid, -128, -118 + (1 - gin) * 14);
      grid.set({ useful: 75 * P(t, ta + 0.5, 1.6, linear), wasted: 25 * P(t, ta + 2.3, 0.8, linear) });
      op(gl, P(t, ta + 2.2, 0.4, linear));
    };
  }
  function picUranium(g) {
    const col = (x0, title, fill, stroke, tcol) => {
      const c = G(g);
      E('rect', { x: x0, y: -52, width: 206, height: 222, rx: 16, fill, stroke, 'stroke-width': 3 }, c);
      T(c, x0 + 103, -14, title, { size: 26, weight: 700, anchor: 'middle', fill: tcol });
      return c;
    };
    col(-236, 'non-renewable', '#2E2A27', '#8C7A6B', '#E6D6C4');
    const rcol = col(30, 'renewable', '#123526', C.good, C.good);
    [['coal', -184, 112], ['oil', -82, 112], ['wind', 82, 108], ['solar', 184, 116]].forEach(([k, x, y]) => { const r = enResource(g, k, { label: false }); tr(r, x, y, 0.58); });
    const rod = enResource(g, 'uranium', { label: false });
    const rl = T(g, 30, -98, 'uranium', { size: 26, weight: 700, fill: '#8CF5A8' });
    const xR = cross(g, 22), tkL = tick(g, 18);
    return (t, ta) => {
      const d = P(t, ta + 0.1, 0.8, linear);
      let x = 0, y = -112 + 5 * Math.sin(t * 2.2) * calm;
      if (d > 0) [x, y] = arcPt([0, y], [-133, 34], 40, ease(d));
      tr(rod, x, y, 0.62, -12 * Math.sin(Math.PI * d));
      op(rl, 1 - P(t, ta, 0.3, linear));
      const kp = P(t, ta + 0.9, 0.4, pop); op(tkL, clamp(kp * 2)); tr(tkL, -133, -58 - 28, Math.max(0.01, kp));
      const xp = P(t, ta + 1.15, 0.4, pop); op(xR, clamp(xp * 2)); tr(xR, 133, -86, Math.max(0.01, xp));
      op(rcol, 1 - 0.45 * P(t, ta + 1.15, 0.4, linear));
    };
  }
  function picRoom(g) {
    E('rect', { x: -224, y: -152, width: 448, height: 292, rx: 14, fill: '#15303C', stroke: '#2F5A6E', 'stroke-width': 3 }, g);
    E('rect', { x: -224, y: 140, width: 448, height: 34, rx: 6, fill: '#4A3B30', stroke: '#6B5546', 'stroke-width': 3 }, g);
    const tint = E('rect', { x: -224, y: -152, width: 448, height: 292, rx: 14, fill: '#FF7A30' }, g); op(tint, 0);
    E('rect', { x: -4, y: 56, width: 8, height: 80, fill: '#7D8C99' }, g);
    E('ellipse', { cx: 0, cy: 138, rx: 40, ry: 8, fill: '#5D6B78', stroke: '#8E9CA9', 'stroke-width': 2 }, g);
    const bulb = enBulb(g, 'filament', { s: 0.8, on: 1 }); tr(bulb, 0, 0);
    const shed = [0, 1, 2, 3, 4].map(k => ({ s: spark(g, 10, { color: O, seed: k + 4 }), a: -Math.PI / 2 + (k - 2) * 0.55 }));
    const dis = enDissipate(g, 448, 292, { n: 16, from: [224, 128], tint: 0, seed: 9, rx: 14 }); tr(dis, -224, -152);
    const th = enBadge(g, 'thermal', { r: 26, label: false }); tr(th, 178, -110);
    return (t, ta) => {
      const on = 1 - P(t, ta + 0.1, 0.6, linear);
      bulb.set(0.95 * on + 0.05);
      shed.forEach((q, k) => {
        const u = ((t / 1.6) + k / 5) % 1, d = 50 + u * 70;
        tr(q.s, Math.cos(q.a) * d, -24 + Math.sin(q.a) * d * 0.8); op(q.s, on * Math.sin(u * Math.PI)); q.s.upd(t);
      });
      const p = P(t, ta + 0.1, 3.0, linear);
      op(dis, p > 0 ? 1 : 0); dis.set(p, t);
      op(tint, 0.22 * ease(p));
      const tp = P(t, ta + 1.6, 0.5, pop); op(th, clamp(tp * 2)); tr(th, 178, -110, Math.max(0.01, 0.8 + 0.2 * tp));
    };
  }

  /* ---------- the five questions ---------- */
  const QS = [
    { q: ['A ball falls from a shelf.', 'Which store empties, and which store fills?'], pic: picBall,
      a: [[['The ', C.ink], ['gravitational potential', GR, 800]], [['store empties, and the', C.ink]], [['kinetic', KIN, 800], [' store fills.', C.ink]]] },
    { q: ['True or false: electricity is', 'one of the eight energy stores.'], pic: picElec,
      a: [[['False.', C.bad, 800], [' Electricity is a', C.ink]], [['pathway', Y, 800], [', not a store.', C.ink]]] },
    { q: ['A motor is supplied with 400 J, and 300 J', 'of it is useful. What’s its efficiency?'], pic: picMotor,
      a: [[['75%', Y, 800], [', because', C.ink]], [['300 ÷ 400 = 0.75', Y, 800]]] },
    { q: ['True or false: nuclear power is renewable.'], pic: picUranium,
      a: [[['False.', C.bad, 800], [' Uranium will', C.ink]], [['run out, so nuclear is', C.ink]], [['non-renewable', Y, 800], ['.', C.ink]]] },
    { q: ['Where does most wasted energy end up?'], pic: picRoom,
      a: [[['It spreads out, or ', C.ink], ['dissipates', O, 800], [',', C.ink]], [['into the ', C.ink], ['thermal store', O, 800]], [['of the surroundings.', C.ink]]] },
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
    const lines = d.a.map((line, k) => rich(ans, 584, 500 + k * 52, line, { size, weight: 700 }));
    return { g, qc, picG, anim, think, rg, num, ans, lines, k: i + 1 };
  });

  /* ---------- outro ---------- */
  const outro = G(root);
  const burst = G(outro);
  const sparks = [], br = rng(17);
  for (let k = 0; k < 14; k++) { const s = spark(burst, 12 + br() * 10, { seed: k }); sparks.push({ s, a: (k / 14) * TAU + br() * 0.3, d: 200 + br() * 120, dl: br() * 0.4 }); }
  T(outro, 600, 330, 'Brilliant work!', { size: 80, weight: 700, anchor: 'middle' });
  rich(outro, 600, 404, ['Now try the ', ['Energy quiz', Y, 800], ' in your Science Lab'], { size: 32, anchor: 'middle', fill: C.muted });
  const labChip = chip(outro, 'Science Lab  ›  Energy  ›  Quiz', { size: 26, fill: C.card2, stroke: C.line, sw: 2 });
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
    if (ia > 0) tr(bub, 600, 190 - 8 * wave(t * calm, 1.4), 0.6 + 0.4 * P(t, S.first - 0.5, 0.6, pop), -4 + 8 * wave(t * calm, 2.8));

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
      q.lines.forEach((l, j) => op(l, P(t, ta - 0.1 + j * 0.25, 0.35, linear)));
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
