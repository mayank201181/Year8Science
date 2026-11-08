/* Recap: a padlock clicks shut -> four memory-hook cards build a 2x2 grid (S, S, S, D, S with five mini panels;
   Mass is Matter, Weight is the Wrench, We Most Go; Steeper is Speedier, Flat is Frozen on a mini distance-time
   graph; Moments multiply, Pressure pares down) -> "5 exam traps": each trap shows the wrong idea struck out, the
   right idea ticked, and a picture. */
scene('recap', S => {
  const { at, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;

  /* ---------- local helpers ---------- */
  function rich(parent, x, y, segs, o) {
    o = o || {};
    const t = E('text', { x, y, 'font-size': o.size || 30, 'font-weight': o.weight || 600, 'font-family': o.font || FD, 'text-anchor': o.anchor || 'start', fill: o.fill || C.ink }, parent);
    segs.forEach(s => { if (typeof s === 'string') s = [s]; E('tspan', { fill: s[1], 'font-weight': s[2] }, t).textContent = s[0]; });
    return t;
  }
  const plain = segs => segs.map(s => (typeof s === 'string' ? s : s[0])).join('');
  const fit = (segs, size, maxW) => { const w = textWidth(plain(segs), size, FD, 700); return w > maxW ? Math.floor(size * maxW / w) : size; };
  /* "Steeper is Speedier" with each first letter bold yellow */
  const initials = (str, col) => str.split(/(\s+|,\s*)/).filter(Boolean).flatMap(w => (/^[A-Za-z]/.test(w) ? [[w[0], C.energy, 800], [w.slice(1), col]] : [w]));
  const Y = C.energy, AREA = C.air;
  let _cid = 0;
  /* a small rounded panel at (x, y), w x h; its art is clipped to it */
  function panel(parent, x, y, w, h) {
    const g = G(parent); tr(g, x, y);
    E('rect', { x: 0, y: 0, width: w, height: h, rx: 12, fill: C.card2, stroke: C.line, 'stroke-width': 2 }, g);
    const id = 'rclip' + (++_cid), cp = E('clipPath', { id }, defs()); E('rect', { x: 0, y: 0, width: w, height: h, rx: 12 }, cp);
    return { g, art: G(g, { 'clip-path': `url(#${id})` }) };
  }
  /* a drawing pin pointing down: its tip at (0, 0) */
  function pinDown(parent) {
    const g = G(parent);
    E('path', { d: 'M-2.6,-30 L0,0 L2.6,-30 Z', fill: '#E6EEF4', stroke: '#7F909E', 'stroke-width': 1.2, 'stroke-linejoin': 'round' }, g);
    E('rect', { x: -4, y: -34, width: 8, height: 6, rx: 2, fill: '#9DAEBB' }, g);
    E('ellipse', { cx: 0, cy: -37, rx: 17, ry: 5, fill: ball('#E3E9EE', '#7D8C99'), stroke: '#5F6E7B', 'stroke-width': 1.5 }, g);
    return g;
  }
  function snowflake(parent, r) {
    const g = G(parent);
    for (let k = 0; k < 3; k++) E('line', { x1: 0, y1: -r, x2: 0, y2: r, stroke: '#CFEFFF', 'stroke-width': 4, 'stroke-linecap': 'round', transform: `rotate(${k * 60})` }, g);
    for (let k = 0; k < 6; k++) E('path', { d: `M-${r * 0.32},-${r * 0.86} L0,-${r * 0.6} L${r * 0.32},-${r * 0.86}`, fill: 'none', stroke: '#CFEFFF', 'stroke-width': 3, 'stroke-linecap': 'round', transform: `rotate(${k * 60})` }, g);
    return g;
  }

  /* ---------- padlock ---------- */
  const lockG = G(root); tr(lockG, 600, 300);
  const shackle = E('path', { d: 'M-52,0 L-52,-50 A52,52 0 0 1 52,-50 L52,0', fill: 'none', stroke: '#C9D6DE', 'stroke-width': 22, 'stroke-linecap': 'round' }, lockG);
  E('rect', { x: -86, y: -8, width: 172, height: 134, rx: 24, fill: ball(C.good, '#2B8A5E'), stroke: '#B8F0D4', 'stroke-width': 4 }, lockG);
  E('circle', { cx: 0, cy: 42, r: 15, fill: '#0E3B26' }, lockG);
  E('path', { d: 'M-8,48 L8,48 L11,86 L-11,86 Z', fill: '#0E3B26' }, lockG);
  const clickRing = E('circle', { cx: 0, cy: 40, r: 120, fill: 'none', stroke: C.energy, 'stroke-width': 6 }, lockG);
  T(lockG, 0, 220, 'Lock it in', { size: 54, weight: 700, anchor: 'middle' });

  /* ---------- memory hooks: 2x2 cards ---------- */
  const hooks = G(root);
  const CW = 520, CH = 255;
  function hookCard(x, y) { const g = G(hooks); tr(g, x, y); card(g, 0, 0, CW, CH, { fill: C.card, stroke: C.line }); return g; }

  // 1. Start, Speed up, Slow down, Direction, Shape: five mini panels
  const h1 = hookCard(50, 115);
  rich(h1, 26, 50, initials('Start, Speed up, Slow down,', C.ink), { size: 30, weight: 700 });
  rich(h1, 26, 88, initials('Direction, Shape', C.ink), { size: 30, weight: 700 });
  const PW = 88, PH = 92, PY = 106, PX0 = 20, PGAP = 10;
  const mini = [];
  // start: a ball pushed from rest
  { const p = panel(h1, PX0, PY, PW, PH), a = p.art;
    E('line', { x1: 4, x2: 84, y1: 76, y2: 76, stroke: C.muted, 'stroke-width': 3 }, a);
    const ballG = G(a); E('circle', { r: 13, fill: ball('#F2F7FA', '#9AA8B4') }, ballG); E('path', { d: 'M-13,0 A13,13 0 0 0 13,0', fill: 'none', stroke: C.bad, 'stroke-width': 3 }, ballG);
    const push = fmArrow(a, 'push', 16, 63, 14, 'right', { scale: 1, width: 4, tip: true, label: '', value: false });
    mini.push(t => { const u = (t / 2.6) % 1, go = clamp((u - 0.35) / 0.5), x = 30 + 40 * easeOut(go); tr(ballG, x, 63, 1, (x - 30) / 13 * 57.3); push.set(1); op(push, u < 0.42 ? 1 : 0); }); }
  // speed up: a car with a forward force
  { const p = panel(h1, PX0 + (PW + PGAP), PY, PW, PH), a = p.art;
    E('line', { x1: 0, x2: 88, y1: 77, y2: 77, stroke: C.muted, 'stroke-width': 3 }, a);
    const carG = G(a), car = fmCar(carG); tr(car, 0, 0, 0.24);
    const lines = [0, 1, 2].map(k => E('line', { stroke: C.muted, 'stroke-width': 3, 'stroke-linecap': 'round' }, a));
    const drive = fmArrow(a, 'drive', 0, 0, 18, 'right', { scale: 1, width: 4, label: '', value: false });
    mini.push(t => { const u = (t / 2.4) % 1, x = 6 + 40 * u * u; tr(carG, x + 32, 77); car.roll(160 * u * u / 0.24); drive.move(x + 32 + 33, 65); lines.forEach((l, k) => { attr(l, 'x1', x - 2); attr(l, 'x2', x - 2 - (4 + 18 * u)); attr(l, 'y1', 58 + k * 7); attr(l, 'y2', 58 + k * 7); }); }); }
  // slow down: a cyclist coasting to a stop, drag pointing back
  { const p = panel(h1, PX0 + 2 * (PW + PGAP), PY, PW, PH), a = p.art;
    E('line', { x1: 0, x2: 88, y1: 80, y2: 80, stroke: C.muted, 'stroke-width': 3 }, a);
    const cg = G(a), cyc = fmCyclist(cg); tr(cyc, 0, 0, 0.3);
    const drag = fmArrow(a, 'drag', 0, 0, 18, 'left', { scale: 1, width: 4, label: '', value: false });
    mini.push(t => { const u = (t / 2.8) % 1, s = clamp(u / 0.8), x = 20 + 44 * (1 - (1 - s) * (1 - s)); tr(cg, x, 80); cyc.roll(x / 0.3 * 1.2); drag.move(x - 30, 44); op(drag, s < 1 ? 1 : 0); }); }
  // direction: a ball bounces off a bat
  { const p = panel(h1, PX0 + 3 * (PW + PGAP), PY, PW, PH), a = p.art;
    const bat = G(a); tr(bat, 74, 46, 1, -14);
    E('rect', { x: -6, y: -30, width: 12, height: 50, rx: 6, fill: FM.wood[0], stroke: FM.wood[1], 'stroke-width': 2 }, bat);
    E('rect', { x: -3, y: 18, width: 6, height: 18, rx: 3, fill: '#5A3A22' }, bat);
    E('path', { d: 'M8,78 L62,46 L10,16', fill: 'none', stroke: C.faint, 'stroke-width': 3, 'stroke-dasharray': '5 6' }, a);
    const bb = E('circle', { r: 9, fill: ball('#F2F7FA', '#9AA8B4') }, a);
    const hit = fmArrow(a, 'push', 60, 46, 20, 'left', { scale: 1, width: 4, label: '', value: false });
    mini.push(t => { const u = (t / 2.2) % 1, A = [8, 78], B = [60, 46], Cc = [10, 16]; const q = u < 0.5 ? [lerp(A[0], B[0], u * 2), lerp(A[1], B[1], u * 2)] : [lerp(B[0], Cc[0], (u - 0.5) * 2), lerp(B[1], Cc[1], (u - 0.5) * 2)]; attr(bb, 'cx', q[0]); attr(bb, 'cy', q[1]); op(hit, u > 0.46 && u < 0.7 ? 1 : 0); }); }
  // shape: a sponge squashed by a push
  { const p = panel(h1, PX0 + 4 * (PW + PGAP), PY, PW, PH), a = p.art;
    E('line', { x1: 0, x2: 88, y1: 80, y2: 80, stroke: C.muted, 'stroke-width': 3 }, a);
    const sp = E('rect', { x: 16, width: 56, rx: 7, fill: ball('#FFE07A', '#D9A520'), stroke: '#B5861A', 'stroke-width': 2 }, a);
    const holes = [0, 1, 2, 3].map(k => E('circle', { r: 3, fill: '#C7961E' }, a));
    const push = fmArrow(a, 'push', 44, 0, 22, 'down', { scale: 1, width: 4, tip: true, label: '', value: false });
    mini.push(t => { const u = (t / 2.2) % 1, sq = Math.sin(Math.PI * clamp((u - 0.2) / 0.6)), h = 32 - 16 * sq, w = 56 + 10 * sq; attr(sp, 'x', 44 - w / 2); attr(sp, 'width', w); attr(sp, 'y', 80 - h); attr(sp, 'height', h); holes.forEach((c, k) => { attr(c, 'cx', 44 - w / 2 + 10 + k * (w - 20) / 3); attr(c, 'cy', 80 - h / 2 + (k % 2 ? 4 : -4) * (h / 32)); }); push.move(44, 80 - h); }); }
  const letters = ['S', 'S', 'S', 'D', 'S'].map((L, i) => T(h1, PX0 + i * (PW + PGAP) + PW / 2, 236, L, { size: 32, weight: 700, fill: Y, anchor: 'middle' }));

  // 2. Mass is Matter, Weight is the Wrench, We Most Go
  const h2 = hookCard(630, 115);
  rich(h2, 26, 58, [['M', Y, 800], 'ass is ', ['M', Y, 800], 'atter', [' (kg)', C.muted]], { size: 30, weight: 700 });
  const r2b = G(h2);
  rich(r2b, 26, 106, [['W', Y, 800], 'eight is the ', ['W', Y, 800], 'rench'], { size: 30, weight: 700 });
  rich(r2b, 26, 144, ['of gravity', [' (N)', C.muted]], { size: 30, weight: 700 });
  const bagG = G(h2); tr(bagG, 440, 22);
  fmBag(bagG, ' ', { s: 0.52 });
  const br = rng(19); for (let k = 0; k < 9; k++) E('circle', { cx: ((br() - 0.5) * 36).toFixed(1), cy: (34 + br() * 36).toFixed(1), r: 4.5, fill: '#7A5A30' }, bagG);
  const w2 = fmArrow(h2, 'weight', 440, 74, 66, 'down', { scale: 1, label: 'weight', value: false, labelAt: 'tip' });
  const r2c = G(h2);
  E('rect', { x: 20, y: 176, width: 360, height: 56, rx: 28, fill: C.card2, stroke: C.line, 'stroke-width': 2 }, r2c);
  rich(r2c, 40, 214, [['W', Y, 800], 'e ', ['M', Y, 800], 'ost ', ['G', Y, 800], 'o:  ', ['W = m × g', C.ink, 800]], { size: 29, weight: 700 });

  // 3. Steeper is Speedier, Flat is Frozen
  const h3 = hookCard(50, 395);
  const ssSegs = initials('Steeper is Speedier, Flat is Frozen', C.ink);
  rich(h3, 26, 52, ssSegs, { size: fit(ssSegs, 32, 468), weight: 700 });
  const gx = 74, gy = 206, gw = 236, gh = 112;
  E('path', { d: `M${gx},${gy - gh - 14} L${gx},${gy} L${gx + gw + 14},${gy}`, fill: 'none', stroke: C.muted, 'stroke-width': 3.5, 'stroke-linejoin': 'round' }, h3);
  E('path', { d: `M${gx + gw + 24},${gy} L${gx + gw + 10},${gy - 7} L${gx + gw + 10},${gy + 7} Z M${gx},${gy - gh - 24} L${gx - 7},${gy - gh - 10} L${gx + 7},${gy - gh - 10} Z`, fill: C.muted }, h3);
  T(h3, gx + gw / 2, gy + 36, 'time', { size: 24, weight: 600, fill: C.muted, anchor: 'middle' });
  const yl = T(h3, 0, 0, 'distance', { size: 24, weight: 600, fill: C.muted, anchor: 'middle' }); yl.setAttribute('transform', `translate(${gx - 22} ${gy - gh / 2 + 4}) rotate(-90)`);
  const jLine = E('path', { d: `M${gx},${gy} L${gx + 64},${gy - 100} L${gx + 200},${gy - 100}`, fill: 'none', stroke: Y, 'stroke-width': 6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', pathLength: 1, 'stroke-dasharray': '1 1' }, h3);
  const flake = snowflake(h3, 13); tr(flake, gx + 134, gy - 128);
  const r3a = G(h3), r3b = G(h3);
  rich(r3a, 352, 136, [['steep', Y, 800], ' = fast'], { size: 27 });
  rich(r3b, 352, 186, [['flat', '#CFEFFF', 800], ' = stopped'], { size: 27 });

  // 4. Moments multiply, Pressure pares down
  const h4 = hookCard(630, 395);
  E('line', { x1: 260, y1: 24, x2: 260, y2: 232, stroke: C.line, 'stroke-width': 2.5 }, h4);
  const h4L = G(h4), h4R = G(h4);
  rich(h4L, 130, 50, [['M', Y, 800], 'oments'], { size: 32, weight: 700, anchor: 'middle' });
  rich(h4L, 130, 88, [['m', Y, 800], 'ultiply'], { size: 32, weight: 700, anchor: 'middle' });
  const ssw = fmSeesaw(h4L, { len: 196, pxPerM: 44, pivotH: 30, thick: 9, marks: false }); tr(ssw, 118, 168);
  fmArrow(h4L, 'push', 212, 159, 40, 'down', { scale: 1, width: 5, tip: true, label: '', value: false });
  fmDim(h4L, 118, 182, 212, 182, '', { tick: 7 });
  rich(h4L, 130, 234, ['force ', ['×', Y, 800], ' distance'], { size: 26, weight: 700, anchor: 'middle' });
  rich(h4R, 390, 50, [['P', Y, 800], 'ressure'], { size: 32, weight: 700, anchor: 'middle' });
  rich(h4R, 390, 88, [['p', Y, 800], 'ares down'], { size: 32, weight: 700, anchor: 'middle' });
  E('rect', { x: 316, y: 186, width: 148, height: 18, rx: 4, fill: '#B98A52', stroke: '#7A5530', 'stroke-width': 2 }, h4R);
  const pinG = G(h4R); tr(pinG, 390, 188, 1.25); pinDown(pinG);
  fmArrow(h4R, 'push', 390, 136, 30, 'down', { scale: 1, width: 5, tip: true, label: '', value: false });
  const tipGlow = E('circle', { cx: 390, cy: 188, r: 9, fill: glow(AREA) }, h4R);
  rich(h4R, 390, 234, ['force ', ['÷', Y, 800], [' area', AREA]], { size: 26, weight: 700, anchor: 'middle' });
  const hookCards = [[h1, 'sssds'], [h2, 'matter'], [h3, 'steeper'], [h4, 'moments']];

  /* ---------- exam traps ---------- */
  const traps = G(root);
  const head = G(traps);
  E('path', { d: 'M0,-34 L36,30 L-36,30 Z', fill: C.energy, stroke: '#FFF3A6', 'stroke-width': 4, 'stroke-linejoin': 'round', transform: 'translate(88 150)' }, head);
  T(head, 88, 174, '!', { size: 44, weight: 700, fill: C.bg0, anchor: 'middle' });
  T(head, 140, 170, '5 exam traps', { size: 48, weight: 700 });
  const slotNames = ['weight in N', 'steady speed', 'oppose motion', 'divide!', 'elastic limit'];
  const slots = slotNames.map((nm, i) => {
    const g = G(traps), y = 252 + i * 84;
    const box = E('rect', { x: 50, y: y - 32, width: 286, height: 64, rx: 32, fill: C.card, stroke: C.line, 'stroke-width': 3 }, g);
    const disc = E('circle', { cx: 86, cy: y, r: 21, fill: C.card2, stroke: C.muted, 'stroke-width': 2 }, g);
    const num = T(g, 86, y + 9, String(i + 1), { size: 26, weight: 700, anchor: 'middle' });
    T(g, 120, y + 9, nm, { size: fit([nm], 25, 205), weight: 600 });
    const tk = tick(g, 11); tr(tk, 86, y + 1);
    return { g, box, disc, num, tk };
  });
  const focus = G(traps);
  card(focus, 370, 215, 780, 420, { fill: C.card, stroke: C.line });
  const hint = T(focus, 760, 438, 'Spot the mistake, then fix it', { size: 30, weight: 600, fill: C.muted, anchor: 'middle' });
  /* o.rightW: room for the right idea; o.at: where the picture goes */
  function trapGroup(wrong, right, drawIllus, o) {
    o = o || {};
    const g = G(focus);
    const wx = cross(g, 14); tr(wx, 420, 302);
    const wt = T(g, 458, 313, wrong, { size: 32, weight: 600, fill: C.muted });
    const sw = textWidth(wrong, 32, FD, 600);
    const st = strike(g, 452, 302, 466 + sw, C.bad);
    const rg = G(g);
    const rt = tick(rg, 15); tr(rt, 420, 402);
    rich(rg, 458, 414, right, { size: fit(right, 36, o.rightW || 660), weight: 700 });
    const ill = G(g); const pos = o.at || [760, 540]; tr(ill, pos[0], pos[1]);
    const anim = drawIllus(ill) || (() => {});
    return { g, wt, st, rg, ill, anim, pos, sts: [st], wts: [wt] };
  }
  const T5 = [
    // 1. weight in newtons: a 2 kg bag on a newtonmeter reads 20 N
    trapGroup('Weight is measured in kg', ['Weight is a force, in ', ['newtons', Y, 800]], g => {
      const nm = fmNewtonmeter(g, { max: 20, len: 90, every: 10, minor: 2 }); tr(nm, 0, 0, 0.78); nm.set(20);
      const hk = nm.hook(), bag = G(g); tr(bag, hk[0] * 0.78, hk[1] * 0.78);
      fmBag(bag, '2 kg', { s: 0.66 });
      T(g, 84, (30 + 8 + 48 + 90) * 0.78 + 10, '20 N', { size: 34, weight: 700, fill: Y });
      const rows = G(g);
      rich(rows, -542, 250, [['mass', C.ink, 800], ' of the bag: ', ['2 kg', C.ink, 800], [' (kilograms)', C.muted]], { size: 30 });
      rich(rows, -542, 300, [['weight', C.glucose, 800], ' on Earth: ', ['20 N', Y, 800], [' (newtons)', C.muted]], { size: 30 });
      return t => op(rows, P(t, mid('t1', 0.66), 0.4, linear));
    }, { rightW: 450, at: [1000, 238] }),
    // 2. balanced forces: a car cruising at a steady speed
    trapGroup('Moving needs a forward force', ['Balanced forces: ', ['steady speed', Y, 800]], g => {
      const road = G(g);
      E('line', { x1: -340, x2: 340, y1: 44, y2: 44, stroke: C.muted, 'stroke-width': 4 }, road);
      const dashes = [0, 1, 2, 3, 4, 5, 6].map(() => E('line', { y1: 60, y2: 60, stroke: C.faint, 'stroke-width': 5, 'stroke-linecap': 'round' }, road));
      const carG = G(g), car = fmCar(carG); tr(car, 0, 0, 0.62); tr(carG, -40, 44);
      const sc = 0.62, drive = fmArrow(g, 'drive', -40 + car.pt.front[0] * sc, 44 + car.pt.front[1] * sc, 70, 'right', { scale: 1, value: false, labelAt: 'tip' });
      const dragA = fmArrow(g, 'drag', -40 + car.pt.back[0] * sc, 44 + car.pt.back[1] * sc, 70, 'left', { scale: 1, value: false, labelAt: 'tip', label: 'friction + drag' });
      const zero = chip(g, '0 N', { size: 28, fill: C.card2, stroke: Y, sw: 2.5, color: Y }); tr(zero, -40, -86);
      T(g, -40 + zero.w / 2 + 14, -77, 'resultant', { size: 24, weight: 600, fill: C.muted });
      void drive; void dragA;
      return t => { const d = t * 150 * calm; dashes.forEach((l, k) => { const x = -340 + ((k * 100 - d) % 700 + 700) % 700; attr(l, 'x1', x); attr(l, 'x2', x + 46); }); car.roll(d / sc); };
    }),
    // 3. friction and drag oppose motion, and drag grows with speed
    trapGroup('Friction can speed you up', ['Friction and drag ', ['oppose', Y, 800], ' motion'], g => {
      const cg = G(g), cyc = fmCyclist(cg); tr(cyc, 0, 0, 0.62); tr(cg, 120, 70);
      E('line', { x1: -340, x2: 340, y1: 70, y2: 70, stroke: C.muted, 'stroke-width': 4 }, g);
      const lines = [0, 1, 2].map(k => E('line', { stroke: C.faint, 'stroke-width': 4, 'stroke-linecap': 'round' }, g));
      const drag = fmArrow(g, 'drag', 120 + cyc.pt.back[0] * 0.62, 70 + cyc.pt.back[1] * 0.62, 30, 'left', { scale: 1, value: false, side: 'above' });
      const sp = meter(g, { w: 200, h: 24, color: C.muted, label: 'speed', labelSize: 26, labelFill: C.ink }); tr(sp, -320, -10);
      return t => {
        const v = 0.25 + 0.7 * P(t, mid('t3', 0.5), 1.8, easeOut);
        sp.set(v); drag.set(1, 22 + 110 * v * v);
        cyc.roll(t * 260 * v * calm);
        lines.forEach((l, k) => { const y = 0 + k * 20, L = 20 + 50 * v; attr(l, 'x1', 120 - 80 - k * 6); attr(l, 'x2', 120 - 80 - k * 6 - L); attr(l, 'y1', y); attr(l, 'y2', y); op(l, 0.3 + 0.7 * v); });
      };
    }),
    // 4. divide, don't multiply
    trapGroup('distance × time', [['speed', Y, 800], ' = distance ', ['÷', Y, 800], ' time'], g => {
      const disc = G(g); tr(disc, -250, 6);
      E('circle', { r: 46, fill: Y, stroke: '#FFF3A6', 'stroke-width': 4 }, disc);
      T(disc, 0, 22, '÷', { size: 72, weight: 700, fill: C.bg0, anchor: 'middle' });
      rich(g, -180, 20, [['Divide', Y, 800], ', don’t multiply!'], { size: 38, weight: 700 });
      return t => tr(disc, -250, 6, 1 + 0.08 * Math.sin(Math.PI * P(t, mid('t4', 0.78), 0.6, linear)));
    }),
    // 5. Hooke's law only up to the elastic limit
    trapGroup('Hooke’s law works for any stretch', ['Only up to the ', ['elastic limit', Y, 800]], g => {
      const ox = -190, oy = 76, sx = 13, sy = 18;           // cm and newtons to px
      E('path', { d: `M${ox},${oy - 6 * sy - 18} L${ox},${oy} L${ox + 26 * sx + 18},${oy}`, fill: 'none', stroke: C.muted, 'stroke-width': 3.5, 'stroke-linejoin': 'round' }, g);
      E('path', { d: `M${ox + 26 * sx + 28},${oy} L${ox + 26 * sx + 14},${oy - 7} L${ox + 26 * sx + 14},${oy + 7} Z M${ox},${oy - 6 * sy - 28} L${ox - 7},${oy - 6 * sy - 14} L${ox + 7},${oy - 6 * sy - 14} Z`, fill: C.muted }, g);
      T(g, ox + 13 * sx, oy + 34, 'extension', { size: 24, weight: 600, fill: C.muted, anchor: 'middle' });
      const fl = T(g, 0, 0, 'force', { size: 24, weight: 600, fill: C.muted, anchor: 'middle' }); fl.setAttribute('transform', `translate(${ox - 20} ${oy - 3 * sy}) rotate(-90)`);
      const pts = []; for (let n = 0; n <= 6.001; n += 0.25) pts.push([ox + fmExtension(n) * sx, oy - n * sy]);
      const d = 'M' + pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' L');
      E('line', { x1: ox + 12 * sx, y1: oy - 4 * sy, x2: ox + 18 * sx, y2: oy - 6 * sy, stroke: C.faint, 'stroke-width': 3, 'stroke-dasharray': '6 6' }, g);
      const line = E('path', { d, fill: 'none', stroke: Y, 'stroke-width': 6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', pathLength: 1, 'stroke-dasharray': '1 1' }, g);
      const lim = G(g); tr(lim, ox + 12 * sx, oy - 4 * sy);
      E('circle', { r: 9, fill: C.bad, stroke: '#FFFFFF', 'stroke-width': 2.5 }, lim);
      T(lim, -14, -14, 'elastic limit', { size: 26, weight: 700, fill: C.ink, anchor: 'end' });
      return t => { line.setAttribute('stroke-dashoffset', (1 - P(t, mid('t5', 0.5), 1.0, linear)).toFixed(4)); op(lim, P(t, mid('t5', 0.62), 0.4, linear)); };
    }, { at: [760, 510] }),
  ];
  // trap 4 also strikes out "force × area" and adds the pressure formula
  {
    const g4 = T5[3], g = g4.g;
    const x0 = 458 + textWidth('distance × time', 32, FD, 600) + 70;
    const wx2 = cross(g, 14); tr(wx2, x0 - 34, 302);
    const wt2 = T(g, x0, 313, 'force × area', { size: 32, weight: 600, fill: C.muted });
    const st2 = strike(g, x0 - 6, 302, x0 + 8 + textWidth('force × area', 32, FD, 600), C.bad);
    rich(g4.rg, 458, 466, [['pressure', Y, 800], ' = force ', ['÷', Y, 800], ' area'], { size: 36, weight: 700 });
    g4.sts.push(st2); g4.wts.push(wt2, wx2);
    g4.pos = [760, 568];
  }

  /* ---------- update ---------- */
  return t => {
    // padlock: the shackle drops shut, a ring pulses
    const la = win(t, S.first - 0.6, at('sssds') + 0.25, 0.4);
    op(lockG, la);
    if (la > 0) {
      const shut = P(t, mid('lock', 0.45), 0.35, easeIn);
      tr(shackle, 0, -32 * (1 - shut));
      const rp = clamp((t - mid('lock', 0.45) - 0.35) / 0.7);
      op(clickRing, rp > 0 && rp < 1 ? 1 - rp : 0); attr(clickRing, 'r', 90 + rp * 70);
      tr(lockG, 600, 300, 1 - 0.08 * P(t, at('sssds') - 0.3, 0.5));
    }

    // memory hooks build up, then clear for the traps
    const hookOut = 1 - P(t, at('traps') - 0.2, 0.5, linear);
    op(hooks, hookOut);
    if (hookOut > 0) {
      hookCards.forEach(([g, id], i) => {
        const p = P(t, at(id) - 0.15, 0.55, pop);
        op(g, clamp(p * 2));
        tr(g, i % 2 ? 630 : 50, (i < 2 ? 115 : 395) + (1 - clamp(p)) * 26);
      });
      // 1. the five panels play one after another, then keep looping; their letters light up in turn
      mini.forEach((f, i) => f(Math.max(0, t - mid('sssds', 0.05 + i * 0.16)) * calm));
      letters.forEach((L, i) => { const p = P(t, mid('sssds', 0.05 + i * 0.16), 0.4, pop); op(L, 0.25 + 0.75 * clamp(p * 2)); tr(L, 0, 0); L.setAttribute('transform', `translate(${PX0 + i * (PW + PGAP) + PW / 2} 236) scale(${(0.8 + 0.2 * p).toFixed(3)}) translate(${-(PX0 + i * (PW + PGAP) + PW / 2)} -236)`); });
      // 2.
      op(r2b, P(t, mid('matter', 0.22), 0.5, linear)); w2.set(P(t, mid('matter', 0.3), 0.6));
      op(r2c, P(t, mid('matter', 0.62), 0.5, linear));
      // 3.
      jLine.setAttribute('stroke-dashoffset', (1 - P(t, mid('steeper', 0.1), 2.0, linear)).toFixed(4));
      op(r3a, P(t, mid('steeper', 0.25), 0.4, linear)); op(r3b, P(t, mid('steeper', 0.55), 0.4, linear));
      op(flake, P(t, mid('steeper', 0.55), 0.4, linear)); tr(flake, gx + 134, gy - 128, 1, (t * 20 * calm) % 360);
      // 4.
      op(h4R, P(t, mid('moments', 0.45), 0.5, linear));
      tipGlow.setAttribute('r', (8 + 3 * wave(t, 1.1)).toFixed(2));
    }

    // traps
    const ta = P(t, at('traps') - 0.1, 0.5, linear);
    op(traps, ta);
    if (ta > 0) {
      op(head, P(t, at('traps') - 0.1, 0.5, linear));
      op(hint, 1 - P(t, at('t1') - 0.3, 0.3, linear));
      slots.forEach((s, i) => {
        const k = i + 1, tk = at('t' + k), nx = k < 5 ? at('t' + (k + 1)) : 1e6;
        const appear = P(t, mid('traps', 0.15 + i * 0.12), 0.45, pop);
        const active = t >= tk - 0.15 && t < nx - 0.15, done = t >= nx - 0.15;
        op(s.g, clamp(appear * 2) * (active || done ? 1 : 0.6));
        tr(s.g, (1 - clamp(appear)) * -30, 0);
        s.box.setAttribute('stroke', active ? C.energy : C.line);
        s.box.setAttribute('fill', active ? C.card2 : C.card);
        s.disc.setAttribute('fill', done ? C.good : active ? C.energy : C.card2);
        s.num.setAttribute('fill', active ? C.bg0 : C.ink);
        op(s.num, done ? 0 : 1); op(s.tk, done ? 1 : 0);
        s.tk.firstChild.setAttribute('stroke', C.bg0);
      });
      T5.forEach((g, i) => {
        const k = 't' + (i + 1), t0 = at(k), nx = i < 4 ? at('t' + (i + 2)) : 1e6;
        const v = win(t, t0 - 0.2, nx + 0.05, 0.3);
        op(g.g, v);
        if (v <= 0) return;
        g.wts.forEach(w => op(w, P(t, t0 - 0.2, 0.4, linear)));
        g.sts.forEach((s, j) => s.set(P(t, mid(k, 0.2 + j * 0.16), 0.5, easeOut)));
        const rp = P(t, mid(k, i === 3 ? 0.36 : 0.38), 0.55, pop); op(g.rg, clamp(rp * 2)); tr(g.rg, (1 - clamp(rp)) * 20, 0);
        const ip = P(t, mid(k, i === 3 ? 0.7 : 0.55), 0.55, pop); op(g.ill, clamp(ip * 2)); tr(g.ill, g.pos[0], g.pos[1], 0.85 + 0.15 * clamp(ip));
        g.anim(t);
      });
    }
  };
});
