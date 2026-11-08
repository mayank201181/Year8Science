/* Intro: Where was the energy hiding?
   A match strikes on its box and flares, giving out light and heat: a big "?" asks where that energy was
   -> zoom into the match: its fuel atoms glow faintly, O2 drifts in from the air, "chemical reaction"
   -> showpiece: the atoms change partners into 3 CO2 + 3 H2O, and sparks of energy fly out
   -> three everyday reactions: an egg cooking, iron rusting, fuel burning
   -> the title and a four-stop roadmap: spot it, write it, weigh it, speed it up. */
scene('intro', S => {
  const { at, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;

  /* ---------- local art ---------- */
  // a matchstick with its head at (0,0) and the wooden stick down to (0,230); g.set(burn 0..1) chars it
  function matchStick(parent) {
    const g = G(parent);
    E('rect', { x: -7, y: 6, width: 14, height: 224, rx: 4, fill: linGrad('#F6DDAA', '#C59C61'), stroke: '#9C7743', 'stroke-width': 2 }, g);
    const charS = E('rect', { x: -7, y: 6, width: 14, height: 0, rx: 4, fill: '#2E2622' }, g);
    E('ellipse', { rx: 15, ry: 20, fill: ball('#E0503F', '#7E1F18'), stroke: '#5E1712', 'stroke-width': 2 }, g);
    const charH = E('ellipse', { rx: 15, ry: 20, fill: ball('#5A4A42', '#1C1512'), stroke: '#1C1512', 'stroke-width': 2 }, g);
    g.set = b => { b = clamp(b); op(charH, b); attr(charS, 'height', 30 * b); };
    g.set(0);
    return g;
  }
  // a matchbox lying flat, front face 300 x 100 centred on (0,0), striker strip along the bottom
  function matchbox(parent) {
    const g = G(parent);
    E('path', { d: 'M-150,-48 L-122,-74 L178,-74 L150,-48 Z', fill: '#EE8360', stroke: '#9E3324', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, g);
    E('path', { d: 'M150,-48 L178,-74 L178,26 L150,52 Z', fill: '#B8402F', stroke: '#9E3324', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, g);
    E('rect', { x: -150, y: -48, width: 300, height: 100, rx: 5, fill: '#D9483B', stroke: '#9E3324', 'stroke-width': 2.5 }, g);
    E('ellipse', { cx: 0, cy: -14, rx: 74, ry: 26, fill: '#FFE7B0', stroke: '#9E3324', 'stroke-width': 2 }, g);
    E('path', { d: 'M0,-36 C10,-24 14,-16 12,-8 C10,0 4,4 0,4 C-4,4 -11,0 -12,-8 C-14,-16 -6,-22 -3,-28 C-2,-20 1,-18 3,-17 C5,-23 3,-30 0,-36 Z', fill: '#E8762B' }, g);
    E('rect', { x: -140, y: 22, width: 280, height: 22, rx: 5, fill: '#4A2E22', stroke: '#2E1C14', 'stroke-width': 2 }, g);
    const rr = rng(8); let d = '';
    for (let i = 0; i < 42; i++) d += `M${(-134 + rr() * 268).toFixed(1)},${(27 + rr() * 12).toFixed(1)} h2.5 `;
    E('path', { d, stroke: '#8A6350', 'stroke-width': 2.5, 'stroke-linecap': 'round' }, g);
    return g;
  }
  // a frying pan with an egg; g.set(cooked 0..1) turns the clear white solid white
  function panEgg(parent) {
    const g = G(parent);
    E('rect', { x: 92, y: -12, width: 74, height: 20, rx: 10, fill: '#3C4650', stroke: '#6F7D89', 'stroke-width': 2.5, transform: 'rotate(-10)' }, g);
    E('ellipse', { rx: 106, ry: 60, fill: '#2A353E', stroke: '#71808C', 'stroke-width': 4 }, g);
    E('ellipse', { cx: 0, cy: 4, rx: 90, ry: 46, fill: '#1A232A' }, g);
    const pts = []; const rr = rng(12);
    for (let i = 0; i < 11; i++) { const a = i / 11 * TAU, k = 0.84 + rr() * 0.22; pts.push([Math.cos(a) * 66 * k - 4, Math.sin(a) * 36 * k + 4]); }
    const d = closedPath(pts);
    const white = E('path', { d, fill: '#F6F8FA', stroke: '#D9E2E8', 'stroke-width': 2 }, g);
    const raw = E('path', { d, fill: 'rgba(190,220,232,0.30)', stroke: 'rgba(225,240,247,0.75)', 'stroke-width': 2.5 }, g);
    E('ellipse', { cx: 8, cy: -2, rx: 22, ry: 17, fill: ball('#FFC93D', '#E08A00'), stroke: '#D98A12', 'stroke-width': 2 }, g);
    g.set = c => { op(white, c); op(raw, 1 - c); };
    g.set(0);
    return g;
  }
  // a camping stove: a gas canister with a burner on top; g.flame is an rxFlame
  function stove(parent) {
    const g = G(parent);
    E('rect', { x: -48, y: -4, width: 96, height: 96, rx: 18, fill: ball('#5D9BEA', '#1F4F96'), stroke: '#A9CBF5', 'stroke-width': 3 }, g);
    E('rect', { x: -48, y: 30, width: 96, height: 26, fill: '#F2F7FA', opacity: 0.85 }, g);
    E('path', { d: 'M-18,43 h36', stroke: '#1F4F96', 'stroke-width': 5, 'stroke-linecap': 'round' }, g);
    E('rect', { x: -12, y: -30, width: 24, height: 28, fill: linGrad('#B9C6D2', '#7D8C99'), stroke: '#9DB0BF', 'stroke-width': 2 }, g);
    E('rect', { x: -40, y: -40, width: 80, height: 12, rx: 5, fill: '#B9C6D2', stroke: '#E3EBF1', 'stroke-width': 2 }, g);
    g.flame = rxFlame(g, 0.62); tr(g.flame, 0, -40); g.flame.set('blue', 1);
    return g;
  }
  // a magnifying glass, lens radius r, handle to the bottom-right
  function magnifier(parent, r) {
    const g = G(parent);
    E('line', { x1: r * 0.7, y1: r * 0.7, x2: r * 1.6, y2: r * 1.6, stroke: '#C9D6DE', 'stroke-width': r * 0.28, 'stroke-linecap': 'round' }, g);
    E('circle', { r, fill: 'rgba(159,216,255,0.12)', stroke: '#E4EDF2', 'stroke-width': r * 0.16 }, g);
    E('path', { d: `M${-r * 0.62},${-r * 0.3} A${r * 0.7},${r * 0.7} 0 0 1 ${-r * 0.2},${-r * 0.66}`, stroke: '#ffffff', 'stroke-width': r * 0.08, fill: 'none', opacity: 0.55, 'stroke-linecap': 'round' }, g);
    return g;
  }
  // a speed dial: g.set(v 0..1) swings the needle from slow (left) to fast (right)
  function speedDial(parent, r) {
    const g = G(parent);
    const arcD = (a0, a1) => `M${(Math.cos(a0) * r).toFixed(1)},${(Math.sin(a0) * r).toFixed(1)} A${r},${r} 0 0 1 ${(Math.cos(a1) * r).toFixed(1)},${(Math.sin(a1) * r).toFixed(1)}`;
    E('path', { d: arcD(Math.PI, Math.PI * 1.36), fill: 'none', stroke: C.good, 'stroke-width': 12, 'stroke-linecap': 'round' }, g);
    E('path', { d: arcD(Math.PI * 1.36, Math.PI * 1.66), fill: 'none', stroke: C.energy, 'stroke-width': 12 }, g);
    E('path', { d: arcD(Math.PI * 1.66, Math.PI * 2), fill: 'none', stroke: C.bad, 'stroke-width': 12, 'stroke-linecap': 'round' }, g);
    const needle = G(g);
    E('path', { d: `M-5,0 L0,${-r * 0.84} L5,0 Z`, fill: C.ink }, needle);
    E('circle', { r: 9, fill: C.ink }, g);
    g.set = v => tr(needle, 0, 0, 1, -80 + 160 * clamp(v));
    g.set(0);
    return g;
  }

  /* ===== A. the match: strike, flare, light, heat and a big "?" ===== */
  const world = G(root);
  const boxG = G(world); matchbox(boxG); tr(boxG, 300, 612);
  const raysG = G(world), rays = [];
  [-30, -5, 20, 45, 70, 110, 135, 160, 185, 210].forEach((deg, k) => {
    const a = deg * Math.PI / 180, r2 = k % 2 ? 142 : 166;
    rays.push(E('line', { x1: Math.cos(a) * 104, y1: Math.sin(a) * 104, x2: Math.cos(a) * r2, y2: Math.sin(a) * r2, stroke: C.energy, 'stroke-width': 6, 'stroke-linecap': 'round', opacity: 0.8 }, raysG));
  });
  const fricG = G(world), fr = rng(4), fric = [];
  for (let k = 0; k < 12; k++) fric.push({ el: E('circle', { r: 2.5 + fr() * 2.5, fill: k % 3 ? C.energy : '#FFFFFF' }, fricG), a: Math.PI * (0.9 + fr() * 0.35), sp: 90 + fr() * 120, t0: 0.8 + fr() * 0.45 });
  const halo = E('circle', { r: 120, fill: glow('#FFC46B') }, world);
  const match = matchStick(world);
  const flash = E('circle', { r: 90, fill: glow('#FFF3B0') }, world);
  const ign = spark(world, 24, { seed: 3 });
  const flame = rxFlame(world, 0.95);
  const heat = heatWaves(world, { n: 3, h: 84, spacing: 24 });
  const lblLight = T(world, 360, 398, 'light', { size: 38, weight: 700, anchor: 'end', fill: C.energy });
  const lblHeat = T(world, 612, 240, 'heat', { size: 38, weight: 700, fill: C.heat });
  const qG = G(world);
  E('circle', { cx: 0, cy: -72, r: 130, fill: glow(C.energy), opacity: 0.4 }, qG);
  T(qG, 0, 0, '?', { size: 220, weight: 700, anchor: 'middle', fill: C.energy });
  const HX = 560, HY = 440;           // the burning match's head, where the camera zooms in
  const T_IGN = 1.25;
  function headAt(t) {
    const s = P(t, 0.7, 0.6), l = P(t, 1.6, 1.0);
    return [lerp(lerp(250, 430, s), HX, l), lerp(632, HY, l), lerp(125, 0, l)];
  }

  /* ===== B. inside the match: fuel + oxygen -> carbon dioxide + water ===== */
  const mol = G(root);
  const ghostG = G(mol), haloG = G(mol), bondG = G(mol), atomG = G(mol), popG = G(mol);
  const RAD = { C: 26, O: 24, H: 16 };
  const recs = [];
  const add = (kind, x, y, r) => { const a = { kind, x0: x, y0: y, r0: r || RAD[kind] }; recs.push(a); return a; };
  const FX = [165, 255, 345], FY = 400, ROWS = [300, 400, 500];
  const fuel = FX.map((x, i) => {
    const up = i % 2 ? 1 : -1;
    return { c: add('C', x, FY), o: add('O', x, FY + up * 82), ho: add('H', x + 36, FY + up * 116), hc: add('H', x, FY - up * 66) };
  });
  const BONDS = [[fuel[0].c, fuel[1].c], [fuel[1].c, fuel[2].c]];
  fuel.forEach(f => BONDS.push([f.c, f.o], [f.o, f.ho], [f.c, f.hc]));
  BONDS.forEach(([a, b]) => E('line', { x1: a.x0, y1: a.y0, x2: b.x0, y2: b.y0, stroke: '#7F96A8', 'stroke-width': 7, 'stroke-linecap': 'round' }, bondG));
  const oxy = [[495, 300], [515, 400], [495, 500]].map(([x, y], i) => ({ a: add('O', x - 16, y, 22), b: add('O', x + 16, y, 22), x, y, i }));
  oxy.forEach(o => { o.a.o2 = o; o.b.o2 = o; });
  // where every atom goes: CO2 in the column at x 790, H2O at x 1000
  const T0 = at('swap') + 0.8, FLY = 1.2, rr = rng(57);
  const dest = (a, x, y, r, st) => { a.x1 = x; a.y1 = y; a.s1 = r / a.r0; a.st = st + rr() * 0.1; a.bend = -(110 + rr() * 70); };
  fuel.forEach((f, i) => {
    const y = ROWS[i], s1 = T0 + i * 0.4, s2 = s1 + 0.2;
    dest(f.c, 790, y, 24, s1); dest(f.o, 752, y, 21.6, s1); dest(oxy[i].a, 828, y, 21.6, s1);
    dest(oxy[i].b, 1000, y - 6, 24, s2); dest(f.hc, 976.5, y + 11, 15, s2); dest(f.ho, 1023.5, y + 11, 15, s2);
  });
  ['H', 'O', 'C'].forEach(kind => recs.filter(r => r.kind === kind).forEach(r => {
    r.ghost = E('circle', { cx: r.x0, cy: r.y0, r: r.r0 - 1, fill: 'none', stroke: ATOM[kind][0], 'stroke-width': 2, 'stroke-dasharray': '4 4' }, ghostG);
    r.halo = E('circle', { r: r.r0 * 2.1, fill: glow(C.energy) }, haloG);
    r.el = atom(atomG, kind, r.r0, { letter: kind !== 'H' });
  }));
  recs.forEach((r, i) => { r.i = i; r.d = Math.hypot(r.x0 - 255, r.y0 - 400) / 900; });
  // energy released as each new molecule forms
  const pops = [];
  ROWS.forEach((y, i) => [[790, T0 + i * 0.4], [1000, T0 + i * 0.4 + 0.2]].forEach(([x, st], k) => pops.push({ sp: spark(popG, 15, { seed: i * 2 + k }), x, y: y - 50, t0: st + FLY + 0.12 })));
  const molArrow = arrow(mol, 584, 400, 664, 400, { color: C.ink, width: 7 });
  const rxChip = chip(mol, 'chemical reaction', { size: 30, fill: C.energy, color: C.bg0 }); tr(rxChip, 624, 170);
  const lbFuel = T(mol, 255, 604, 'the match', { size: 30, weight: 700, anchor: 'middle', fill: C.glucoseLt });
  const lbOxy = G(mol);
  T(lbOxy, 505, 592, 'oxygen', { size: 30, weight: 700, anchor: 'middle', fill: '#FF9A8F' });
  T(lbOxy, 505, 628, 'from the air', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  const lbCO2 = T(mol, 790, 600, 'carbon dioxide', { size: 30, weight: 700, anchor: 'middle', fill: C.co2 });
  const lbH2O = T(mol, 1000, 600, 'water', { size: 30, weight: 700, anchor: 'middle', fill: C.water });
  const newChip = chip(mol, 'brand-new substances', { size: 28, fill: 'rgba(86,214,155,0.16)', stroke: C.good, color: C.good }); tr(newChip, 895, 668);

  /* ===== C. everyday reactions ===== */
  const exG = G(root);
  const EXX = [255, 600, 945], EXY = 400;
  const exCards = [['cooking an egg', 0.6], ['rusting iron', 0.73], ['burning fuel', 0.85]].map(([label, f], i) => {
    const g = G(exG); tr(g, EXX[i], EXY);
    card(g, -150, -150, 300, 300, { fill: C.card, stroke: C.line });
    const art = G(g); tr(art, 0, -28);
    T(g, 0, 118, label, { size: 30, weight: 700, anchor: 'middle' });
    return { g, art, t0: mid('swap', f) - 0.15 };
  });
  const egg1 = panEgg(exCards[0].art); tr(egg1, -8, 0, 0.92);
  const sizzle = heatWaves(exCards[0].art, { n: 3, h: 50, spacing: 30, width: 4 }); tr(sizzle, -8, -48);
  const nail1 = rxNail(exCards[1].art, 220, { seed: 9 }); tr(nail1, 0, 0, 1, 90);
  const stove1 = stove(exCards[2].art); tr(stove1, 0, 8);

  /* ===== D. title and roadmap ===== */
  const plan = G(root);
  const title = T(plan, 600, 178, 'Chemical Reactions', { size: 76, weight: 700, anchor: 'middle' });
  const RX_ = [195, 465, 735, 1005], RY = 446;
  const stops = ['spot it', 'write it', 'weigh it', 'speed it up'].map((label, i) => {
    const g = G(plan); tr(g, RX_[i], RY);
    const bx = card(g, -120, -140, 240, 280, { fill: C.card, stroke: C.line });
    const lit = card(g, -120, -140, 240, 280, { fill: 'rgba(255,228,92,0.08)', stroke: C.energy, sw: 4 });
    const num = G(g); tr(num, 0, -140);
    E('circle', { r: 22, fill: C.energy, stroke: C.bg0, 'stroke-width': 4 }, num);
    T(num, 0, 9, String(i + 1), { size: 26, weight: 700, anchor: 'middle', fill: C.bg0 });
    const art = G(g); tr(art, 0, -26);
    T(g, 0, 106, label, { size: 30, weight: 700, anchor: 'middle' });
    return { g, bx, lit, art };
  });
  // 1. spot it: a fizzing test tube under a magnifier
  const tt1 = testTube(stops[0].art, 46, 150, { level: 0.62, liquid: '#7FD1AE' }); tr(tt1, -22, 4);
  const fizz1 = bubbles(stops[0].art, -36, -10, 28, 72, { n: 6, r: 5, seed: 4, speed: 0.6 });
  const mag1 = magnifier(stops[0].art, 34); tr(mag1, 30, -24);
  // 2. write it: the carbon equation with its molecules
  rxFormula(stops[1].art, 0, 52, 'C + O2 → CO2', { size: 38 });
  const eqAtoms = G(stops[1].art);
  tr(atom(eqAtoms, 'C', 13, { letter: true }), -88, -26); tr(molO2(eqAtoms, 11), -34, -26); tr(molCO2(eqAtoms, 11), 62, -26);
  // 3. weigh it: a sealed flask on a balance
  const balG = G(stops[2].art); tr(balG, 0, 22, 0.55);
  const bal1 = rxBalance(balG, { w: 300 }); bal1.set({ reading: 50 });
  const fl1 = flask(balG, 0.8, { level: 0.22, liquid: C.air }); tr(fl1, 0, -74); rxBung(fl1, 0.8);
  // 4. speed it up: a speed dial
  const dial = speedDial(stops[3].art, 70); tr(dial, 0, 30);
  const dialTxt = T(stops[3].art, 0, 66, 'fast!', { size: 26, weight: 700, anchor: 'middle', fill: C.bad });
  const chevrons = [330, 600, 870].map(x => { const a = arrow(plan, x - 10, RY, x + 12, RY, { color: C.faint, width: 5, head: 13 }); return a; });

  return t => {
    /* --- A. the match --- */
    const zoom = P(t, 6.55, 1.0, easeIn), wA = (t < 0.25 ? 0 : 1) * (1 - P(t, 7.05, 0.5, linear));
    op(world, wA);
    if (wA > 0) {
      const z = 1 + 8 * zoom;
      world.setAttribute('transform', `translate(${HX} ${HY}) scale(${z.toFixed(3)}) translate(${-HX} ${-HY})`);
      const [hx, hy, rot] = headAt(t);
      op(boxG, P(t, 0.3, 0.4, linear) * (1 - P(t, 2.5, 0.6, linear)));
      const sway = t > 2.6 ? Math.sin(t * 1.3) * 1.5 * calm : 0;
      tr(match, hx, hy, 1, rot + sway);
      op(match, P(t, 0.35, 0.35, linear));
      match.set(P(t, 2.4, 4, linear) * 0.85);
      // friction sparks while the head scrapes the striker
      fric.forEach(f => {
        const u = (t - f.t0) / 0.5;
        if (u <= 0 || u >= 1) { op(f.el, 0); return; }
        const [x0, y0] = headAt(f.t0);
        attr(f.el, 'cx', x0 + Math.cos(f.a) * f.sp * u); attr(f.el, 'cy', y0 - 8 + Math.sin(f.a) * f.sp * u * 0.6 + 60 * u * u);
        op(f.el, 1 - u);
      });
      // ignition: a flash, a spark, then the flame
      const fp = P(t, T_IGN, 0.45, pop), grow = P(t, 1.6, 1.2, easeOut);
      flame.set('yellow', fp > 0 ? Math.max(0.01, 0.7 * clamp(fp) + 0.3 * grow) : 0);
      tr(flame, hx, hy - 14);
      flame.upd(t);
      const fl = Math.sin(Math.PI * P(t, T_IGN - 0.05, 0.7, linear));
      op(flash, fl); tr(flash, hx, hy - 20, 0.5 + 1.2 * fl);
      const ig = P(t, T_IGN - 0.05, 0.9, linear);
      op(ign, Math.sin(Math.PI * ig)); tr(ign, hx, hy - 10, Math.max(0.01, 0.4 + 1.1 * Math.sin(Math.PI * ig))); ign.upd(t);
      op(halo, clamp(fp) * (0.55 + 0.1 * wave(t, 1.1))); tr(halo, hx, hy - 60, 0.8 + 0.4 * grow);
      // light and heat
      const lp = P(t, 2.75, 0.8, easeOut);
      op(raysG, lp * (0.75 + 0.25 * wave(t * calm, 1.6)));
      tr(raysG, hx, hy - 62, 0.7 + 0.3 * lp, Math.sin(t * 0.6) * 4 * calm);
      op(lblLight, P(t, mid('hook', 0.47), 0.4, linear));
      const hp = P(t, mid('hook', 0.5), 0.6, linear);
      op(heat, hp); tr(heat, hx, hy - 150); heat.upd(t);
      op(lblHeat, P(t, mid('hook', 0.56), 0.4, linear));
      // where was the energy hiding?
      const qp = P(t, mid('hook', 0.66), 0.7, pop);
      op(qG, clamp(qp * 2));
      tr(qG, 868, lerp(470, 412, clamp(qp)) - 7 * wave(t * calm, 2.2), Math.max(0.01, 0.6 + 0.4 * qp), -6 + 6 * wave(t * calm, 3.1));
    }

    /* --- B. molecules --- */
    const mA = P(t, 7.0, 0.5, linear) * (1 - P(t, mid('swap', 0.56), 0.45, linear));
    op(mol, mA);
    if (mA > 0) {
      const ms = lerp(0.3, 1, P(t, 7.0, 0.85, easeOut));
      mol.setAttribute('transform', `translate(${HX} ${HY}) scale(${ms.toFixed(3)}) translate(${-HX} ${-HY})`);
      op(bondG, P(t, 7.3, 0.5, linear) * (1 - P(t, at('swap') + 0.1, 0.6, linear)));
      const shake = P(t, at('swap'), 0.6, linear) * (1 - P(t, T0, 0.3, linear));
      recs.forEach(r => {
        let x = r.x0, y = r.y0, s = 1, vis = P(t, 7.15 + r.d * 2, 0.45, pop);
        if (r.o2) {                                            // O2 drifts in from the air
          const o = r.o2, u = P(t, mid('stored', 0.28) + o.i * 0.3, 1.7, easeOut);
          const off = r === o.a ? -16 : 16, ang = (1 - u) * (1.6 + o.i);
          x = o.x + (1 - u) * 760 + Math.cos(ang) * off; y = o.y - (1 - u) * 70 + Math.sin(ang) * off + Math.sin(u * Math.PI) * 26;
          vis = u > 0 ? 1 : 0;
        }
        const u = clamp((t - r.st) / FLY), p = ease(u);
        if (u > 0) {
          const cx = (r.x0 + r.x1) / 2, cy = Math.min(r.y0, r.y1) + r.bend, q = 1 - p;
          x = q * q * r.x0 + 2 * q * p * cx + p * p * r.x1; y = q * q * r.y0 + 2 * q * p * cy + p * p * r.y1; s = lerp(1, r.s1, p);
        } else if (shake > 0) { x += Math.sin(t * 23 + r.i * 2.1) * 3 * shake * calm; y += Math.cos(t * 19 + r.i) * 3 * shake * calm; }
        else if (!r.o2) { x += Math.sin(t * 1.9 + r.i * 1.7) * 1.4 * calm; }
        op(r.ghost, 0.32 * P(t, r.st + 0.15, 0.5, linear));
        const settle = u >= 1 ? 1 + 0.14 * Math.sin(Math.PI * P(t, r.st + FLY, 0.35, linear)) : 1;
        tr(r.el, x, y, Math.max(0.01, s * settle * vis));
        const h = vis * (0.32 + 0.14 * wave(t, 1.5, r.i * 0.07)) * (1 - P(t, r.st - 0.1, 0.4, linear)) * (1 + 0.8 * Math.sin(Math.PI * P(t, mid('stored', 0.8), 0.9, linear)));
        op(r.halo, h); if (h > 0) tr(r.halo, x, y, s);
      });
      pops.forEach(o => {
        const u = (t - o.t0) / 1.5;
        if (u <= 0 || u >= 1) { op(o.sp, 0); return; }
        op(o.sp, Math.sin(Math.PI * u)); tr(o.sp, o.x, o.y - 26 * u, 0.5 + 0.7 * Math.sin(Math.PI * Math.min(1, u * 1.4))); o.sp.upd(t);
      });
      op(lbFuel, P(t, mid('stored', 0.08), 0.4, linear) * (1 - P(t, T0 - 0.2, 0.4, linear)));
      op(lbOxy, P(t, mid('stored', 0.42), 0.4, linear) * (1 - P(t, T0 - 0.2, 0.4, linear)));
      const cp = P(t, mid('stored', 0.56), 0.5, pop);
      op(rxChip, clamp(cp * 2)); tr(rxChip, 624, 170 + (1 - clamp(cp)) * 14, 1 + 0.06 * Math.sin(Math.PI * P(t, mid('stored', 0.8), 0.6, linear)));
      molArrow.set(P(t, mid('stored', 0.6), 0.6)); op(molArrow, P(t, mid('stored', 0.6), 0.2, linear));
      op(lbCO2, P(t, T0 + 2.0, 0.4, linear)); op(lbH2O, P(t, T0 + 2.15, 0.4, linear));
      const np = P(t, mid('swap', 0.42), 0.5, pop); op(newChip, clamp(np * 2)); tr(newChip, 895, 668 + (1 - clamp(np)) * 14);
    }

    /* --- C. everyday reactions --- */
    const eA = win(t, mid('swap', 0.56), at('plan') + 0.2, 0.4);
    op(exG, eA);
    if (eA > 0) {
      exCards.forEach((c, i) => {
        const p = P(t, c.t0, 0.5, pop);
        op(c.g, clamp(p * 2)); tr(c.g, EXX[i], EXY + (1 - clamp(p)) * 26, 0.9 + 0.1 * p);
      });
      const t1 = exCards[0].t0, t2 = exCards[1].t0, t3 = exCards[2].t0;
      egg1.set(P(t, t1 + 0.3, 1.8, ease)); sizzle.upd(t); op(sizzle, P(t, t1 + 0.2, 0.4, linear) * 0.8);
      nail1.set({ rust: P(t, t2 + 0.3, 1.7, linear) });
      stove1.flame.set('blue', Math.max(0.01, P(t, t3 + 0.2, 0.5, pop))); stove1.flame.upd(t);
    }

    /* --- D. title and roadmap --- */
    const dA = P(t, at('plan') - 0.05, 0.5, linear);
    op(plan, dA);
    if (dA > 0) {
      const tp = P(t, at('plan'), 0.8, easeOut);
      op(title, tp); tr(title, 0, (1 - tp) * 18);
      const lightAt = [0.12, 0.32, 0.53, 0.76].map(f => mid('plan', f));
      stops.forEach((st, i) => {
        const p = P(t, at('plan') + 0.25 + i * 0.12, 0.5, pop), l = P(t, lightAt[i], 0.45, linear);
        op(st.g, clamp(p * 2) * (0.45 + 0.55 * l));
        op(st.lit, l);
        tr(st.g, RX_[i], RY + (1 - clamp(p)) * 24, 0.94 + 0.06 * clamp(p) + 0.05 * Math.sin(Math.PI * P(t, lightAt[i], 0.5, linear)));
      });
      fizz1.upd(t, P(t, lightAt[0], 0.4, linear));
      tr(mag1, 30 + 6 * Math.sin(t * 1.4 * calm), -24 + 4 * Math.cos(t * 1.1 * calm));
      bal1.set({ reading: 50, flash: 0.5 * Math.sin(Math.PI * P(t, lightAt[2], 0.8, linear)) });
      dial.set(0.08 + 0.84 * P(t, lightAt[3] + 0.1, 0.9, easeOut) - 0.04 * wave(t * calm, 0.7) * P(t, lightAt[3] + 1, 0.3, linear));
      op(dialTxt, P(t, lightAt[3] + 0.6, 0.4, linear));
      chevrons.forEach((a, i) => op(a, P(t, lightAt[i + 1] - 0.3, 0.4, linear)));
    }
  };
});
