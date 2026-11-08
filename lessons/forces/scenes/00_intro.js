/* Intro: on Earth a hammer and a feather are dropped together and the hammer wins; on the airless Moon an
   astronaut drops both and they land together -> the two scenes slide into a split screen, with a "?" over
   the Earth feather -> "Forces": a push and a pull move a crate -> a roadmap of seven chapters. */
scene('intro', S => {
  const { at, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;

  /* ---------- the drop: one person (Earth) or astronaut (Moon), arms up, hammer right, feather left ---------- */
  const GY = 590, FEET = 662, PX = 600, PS = 1.6, HS = 0.7;
  const hand = deg => [66 * Math.sin(deg * Math.PI / 180) * PS, FEET + (-146 + 66 * Math.cos(deg * Math.PI / 180)) * PS];
  const [HX, HY] = hand(120);                                 // the hands at the drop: (PX +- HX, HY)
  const HAMX = PX + HX, FEAX = PX - HX;
  const HAM_UP = 38 * HS, HAM_DN = 80 * HS, FEA_DN = 92 * HS, FEA_UP = FEA_DN - (HAM_DN - HAM_UP);  // grip -> centre -> bottom
  const HAMY0 = HY - HAM_UP, FEAY0 = HY - FEA_UP, BOT0 = HAMY0 + HAM_DN;   // both bottoms start level
  const DROP = FEET - BOT0;
  const TE = 0.85, TM = TE * 2.5;            // fall times; the Moon's g is about 1/6 of Earth's, so about 2.5x longer
  const tRE = mid('hook', 0.36), tRM = mid('moon', 0.45);
  /* arms: raised from 95 to 120 degrees (ready...), then lowered after the drop */
  const armAt = (t, tUp, tDown) => t < tDown ? lerp(95, 120, P(t, tUp, 1.0)) : lerp(120, 12, P(t, tDown, 1.0));
  const pose = a => ({ armR: [a, a > 60 ? 0 : 14 * (1 - a / 60)], armL: [-a, a > 60 ? 0 : 14 * (1 - a / 60)] });
  /* held positions follow the hands: [hammer centre, feather centre] for arm angle a */
  const held = a => { const [hx, hy] = hand(a); return [[PX + hx, hy - HAM_UP], [PX - hx, hy - FEA_UP]]; };

  /* an object held at x (centre y0, bottom BOT0), released at t0, falls for T s, then topples outwards (dir +-1) */
  function drop(t, x, y0, dn, t0, T, dir, arm) {
    if (t <= t0) { const q = held(arm)[dir > 0 ? 0 : 1]; return [q[0], q[1], 0]; }
    const u = (t - t0) / T;
    if (u < 1) return [x, y0 + DROP * u * u, 0];
    const p = clamp((t - t0 - T) / 0.34), back = p >= 1 ? 5 * Math.sin(Math.PI * clamp((t - t0 - T - 0.34) / 0.26)) : 0;
    const ph = 84 * easeIn(p) - back, a = ph * Math.PI / 180;
    return [x + dir * dn * Math.sin(a), FEET - dn * Math.cos(a) - 9 * Math.sin(a), dir * ph];
  }
  /* the Earth feather: tips flat and drifts down slowly, rocking; in the split screen it hangs mid-fall */
  function featherEarth(t, a) {
    if (t <= tRE) { const q = held(a)[1]; return [q[0], q[1], 0]; }
    if (t > at('moon') + 1.5) { const ph = TAU * t / 2.1; return [FEAX - 46 + 22 * calm * Math.sin(ph), 470 + 5 * calm * Math.sin(ph * 2), -72 + 16 * calm * Math.cos(ph)]; }
    const tau = t - tRE, sw = Math.min(1, tau / 0.9), ph = TAU * tau / 1.9;
    const fall = 44 * (tau - 0.35 * (1 - Math.exp(-tau / 0.35)));
    return [FEAX - 46 * easeOut(clamp(tau / 1.4)) + 30 * sw * calm * Math.sin(ph), FEAY0 + fall, -70 * easeOut(clamp(tau / 0.8)) + 18 * sw * calm * Math.cos(ph)];
  }
  function dust(parent) {
    const g = G(parent);
    [[-1, -0.35], [-1, -0.9], [1, -0.35], [1, -0.9]].forEach(([sx, sy]) => E('line', { x1: sx * 14, y1: sy * 10, x2: sx * 38, y2: sy * 28, stroke: '#D9E2E8', 'stroke-width': 4, 'stroke-linecap': 'round' }, g));
    return g;
  }
  function clipRect() {
    const id = 'introclip' + (++clipRect.n), cp = E('clipPath', { id }, defs());
    return { url: `url(#${id})`, r: E('rect', { x: 0, y: 0, width: W, height: H }, cp) };
  }
  clipRect.n = 0;

  /* ===== Earth ===== */
  const earth = G(root), eClip = clipRect();
  earth.setAttribute('clip-path', eClip.url);
  fmSky(earth, { ground: GY });
  const eC = G(earth);
  const eFea = fmFeather(eC, HS), eHam = fmHammer(eC, HS);
  const eMan = person(eC, { shirt: '#5B8DEF' }); tr(eMan, PX, FEET, PS);
  const eDust = dust(eC);
  const first = chip(eC, '1st', { size: 30, fill: C.glucose, color: '#3A2600' });
  const eTag = chip(eC, 'Earth', { size: 30, fill: 'rgba(10,27,39,0.7)', stroke: C.line, sw: 2 }); tr(eTag, PX, 150);
  const qm = T(eC, 0, 0, '?', { size: 96, weight: 700, anchor: 'middle', fill: C.energy });

  /* ===== the Moon ===== */
  const moon = G(root), mClip = clipRect();
  moon.setAttribute('clip-path', mClip.url);
  fmMoon(moon, { ground: GY, earthX: 1090, earthY: 268, earthR: 38 });
  const mC = G(moon);
  const level = E('line', { stroke: C.energyLt, 'stroke-width': 3, 'stroke-dasharray': '10 8', opacity: 0.85 }, mC);
  const mFea = fmFeather(mC, HS), mHam = fmHammer(mC, HS);
  const mAst = fmAstronaut(mC); tr(mAst, PX, FEET, PS);
  const mDust = [dust(mC), dust(mC)];
  const mTag = chip(mC, 'Moon: no air', { size: 30, fill: 'rgba(10,27,39,0.7)', stroke: C.line, sw: 2 }); tr(mTag, PX, 150);
  const together = chip(mC, 'together!', { size: 32, fill: C.good, color: '#06281A' }); tr(together, PX, 272);
  const divider = E('line', { x1: 0, y1: 0, x2: 0, y2: H, stroke: C.ink, 'stroke-width': 5 }, root);

  /* ===== "Forces": a push and a pull ===== */
  const ttl = G(root);
  T(ttl, 0, 0, 'Forces', { size: 128, weight: 700, anchor: 'middle' });
  const sub = T(root, 600, 0, 'the pushes and pulls behind every movement', { size: 32, weight: 500, anchor: 'middle', fill: C.muted });
  const PB = G(root);
  fmFloor(PB, 250, 1080, 590);
  const crate = fmCrate(PB, 150, 120);
  const push = fmArrow(PB, 'push', 0, 0, 120, 'right', { scale: 1, tip: true, value: false });
  const pull = fmArrow(PB, 'pull', 0, 0, 120, 'right', { scale: 1, value: false });

  /* ===== roadmap: seven chapters ===== */
  const ICONS = [
    ['balance', g => {
      fmCrate(g, 58, 50).at(0, 28);
      fmArrow(g, 'push', -29, 3, 26, 'right', { scale: 1, tip: true, label: '', value: false, width: 6 });
      fmArrow(g, 'push', 29, 3, 26, 'left', { scale: 1, tip: true, label: '', value: false, width: 6 });
    }],
    ['weight', g => {
      E('circle', { r: 46, fill: glow('#C9D0D6'), opacity: 0.35 }, g);
      E('circle', { r: 40, fill: ball('#D2D8DD', '#6E767E') }, g);
      [[-13, -11, 10], [15, 9, 12], [-9, 21, 6], [20, -18, 5]].forEach(([x, y, r]) => E('circle', { cx: x, cy: y, r, fill: '#8C949B', opacity: 0.85 }, g));
    }],
    ['friction', g => {
      const sp = G(g);
      for (let k = 0; k < 16; k++) E('rect', { x: -6, y: -49, width: 12, height: 13, rx: 2, fill: '#4A5560', transform: `rotate(${k * 22.5})` }, sp);
      E('circle', { r: 40, fill: '#1C2329', stroke: '#3A4651', 'stroke-width': 3 }, sp);
      E('circle', { r: 19, fill: '#9AA8B4' }, sp);
      for (let k = 0; k < 5; k++) E('circle', { cx: 0, cy: -11, r: 3, fill: '#4E5A64', transform: `rotate(${k * 72})` }, sp);
      return t => tr(sp, 0, 0, 1, (t * 40 * calm) % 360);
    }],
    ['speed', g => {
      const w = G(g); tr(w, -26, -2);
      // the Speed chapter's stopwatch: grey case, white face, red hand
      E('rect', { x: -6, y: -40, width: 12, height: 9, rx: 2, fill: '#8FA2B0' }, w);
      E('circle', { r: 28, fill: '#F7FAFC', stroke: '#8FA2B0', 'stroke-width': 4 }, w);
      E('path', { d: 'M0,-23 L0,-17 M23,0 L17,0 M0,23 L0,17 M-23,0 L-17,0', stroke: '#3A4A56', 'stroke-width': 3, 'stroke-linecap': 'round' }, w);
      const hand = E('line', { x1: 0, y1: 0, x2: 0, y2: -19, stroke: C.bad, 'stroke-width': 4, 'stroke-linecap': 'round' }, w);
      E('circle', { r: 4, fill: C.bad }, w);
      E('path', { d: 'M14,-32 L14,30 L58,30', fill: 'none', stroke: C.muted, 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
      E('path', { d: 'M14,30 L28,8 L40,8 L56,-22', fill: 'none', stroke: C.energy, 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
      return t => hand.setAttribute('transform', `rotate(${(Math.floor(t * 2) * 30) % 360})`);
    }],
    ['springs', g => {
      E('line', { x1: -26, y1: -48, x2: 26, y2: -48, stroke: FM.metal[2], 'stroke-width': 6, 'stroke-linecap': 'round' }, g);
      const sp = fmSpring(g, { r: 15, coils: 7, lead: 6, width: 4, len: 66 }); tr(sp, 0, -48);
      return t => sp.set(66 + 9 * calm * Math.sin(t * 3.2));
    }],
    ['turning', g => {
      E('path', { d: 'M0,12 L-22,46 L22,46 Z', fill: linGrad('#9DB0BF', '#5F6E7B', true), stroke: FM.metal[2], 'stroke-width': 2, 'stroke-linejoin': 'round' }, g);
      const beam = G(g);
      E('rect', { x: -60, y: -9, width: 120, height: 11, rx: 5, fill: linGrad(FM.wood[2], FM.wood[0], true), stroke: FM.wood[1], 'stroke-width': 2 }, beam);
      E('rect', { x: -56, y: -33, width: 24, height: 24, rx: 4, fill: ball('#8FB6E8', '#3D6FB0') }, beam);
      E('rect', { x: 34, y: -25, width: 16, height: 16, rx: 3, fill: ball('#8FB6E8', '#3D6FB0') }, beam);
      return t => beam.setAttribute('transform', `translate(0 10) rotate(${(-9 + 5 * calm * Math.sin(t * 1.6)).toFixed(2)})`);
    }],
    ['pressure', g => {
      const pin = G(g);
      E('line', { x1: 0, y1: -14, x2: 0, y2: 34, stroke: '#DCE6EE', 'stroke-width': 4, 'stroke-linecap': 'round' }, pin);
      E('path', { d: 'M-12,-26 L12,-26 L6,-12 L-6,-12 Z', fill: '#B9C6D2', stroke: '#8597A6', 'stroke-width': 2, 'stroke-linejoin': 'round' }, pin);
      E('rect', { x: -38, y: -40, width: 76, height: 15, rx: 7, fill: linGrad('#F0D27A', '#B88A2E', true), stroke: '#8A6A2A', 'stroke-width': 2 }, pin);
      E('rect', { x: -56, y: 22, width: 112, height: 22, rx: 4, fill: linGrad(FM.wood[2], FM.wood[0], true), stroke: FM.wood[1], 'stroke-width': 2 }, g);
      return t => tr(pin, 0, 3 * calm * Math.max(0, Math.sin(t * 2.4)));
    }],
  ];
  const road = G(root);
  const CW = 150, CX0 = 600 - 3 * 158;
  const stops = ICONS.map(([label, draw], i) => {
    const g = G(road);
    card(g, -CW / 2, -138, CW, 276, { fill: C.card, stroke: C.line, rx: 20 });
    const art = G(g), inner = G(art); tr(art, 0, -36); tr(inner, 0, 0, 1.2);
    const upd = draw(inner);
    T(g, 0, 100, label, { size: 28, weight: 600, anchor: 'middle' });
    return { g, upd, x: CX0 + i * 158 };
  });
  const popAt = [0.03, 0.19, 0.36, 0.48, 0.62, 0.86, 0.94];

  return t => {
    /* --- Earth: the drop, then (hidden) the split-screen layout --- */
    const tS0 = at('why') - 0.1, sp = P(t, tS0, 1.1), tF0 = mid('why', 0.46), split = t > tS0 - 0.5;
    const fadeSplit = 1 - P(t, tF0, 0.55, linear);
    const eVis = split ? fadeSplit : 1 - P(t, at('moon') + 0.2, 0.3, linear);
    op(earth, eVis);
    if (eVis > 0) {
      attr(eClip.r, 'width', split ? 600 : W);
      tr(eC, split ? -300 - 600 * (1 - sp) : 0, 0);
      const aE = armAt(t, 0.25, tRE + 0.7);
      const h = drop(t, HAMX, HAMY0, HAM_DN, tRE, TE, 1, aE);
      tr(eHam, h[0], h[1], 1, h[2]);
      const f = featherEarth(t, aE);
      tr(eFea, f[0], f[1], 1, f[2]);
      eMan.pose(pose(aE));
      const tl = tRE + TE, dp = clamp((t - tl) / 0.45);
      op(eDust, dp > 0 && dp < 1 ? Math.sin(dp * Math.PI) : 0); tr(eDust, HAMX, FEET - 4, 0.6 + 0.6 * dp);
      const fp = P(t, tl + 0.15, 0.5, pop);
      op(first, clamp(fp * 2)); tr(first, HAMX + 56, FEET - 104, Math.max(0.01, fp));
      op(eTag, P(t, mid('hook', 0.04), 0.4, linear));
      const qp = P(t, mid('why', 0.13), 0.5, pop);
      op(qm, split ? clamp(qp * 2) : 0); tr(qm, f[0], f[1] - 74 + 6 * calm * Math.sin(t * 2.6), Math.max(0.01, qp));
    }

    /* --- the Moon: the drop, then it slides into the right half --- */
    const mVis = P(t, at('moon') - 0.25, 0.5, linear) * fadeSplit;
    op(moon, mVis);
    if (mVis > 0) {
      attr(mClip.r, 'x', 600 * sp); attr(mClip.r, 'width', W - 600 * sp);
      tr(mC, 300 * sp, 0);
      const aM = armAt(t, at('moon') + 0.3, tRM + TM + 0.3);
      const h = drop(t, HAMX, HAMY0, HAM_DN, tRM, TM, 1, aM), f = drop(t, FEAX, FEAY0, FEA_DN, tRM, TM, -1, aM);
      tr(mHam, h[0], h[1], 1, h[2]); tr(mFea, f[0], f[1], 1, f[2]);
      mAst.pose(pose(aM));
      const u = (t - tRM) / TM, ly = BOT0 + DROP * clamp(u) * clamp(u);
      op(level, u > 0 ? Math.min(1, u * 8) * (1 - P(u, 1.02, 0.12, linear)) : 0);
      attr(level, 'x1', FEAX - 26); attr(level, 'x2', HAMX + 26); attr(level, 'y1', ly); attr(level, 'y2', ly);
      const dp = clamp((t - tRM - TM) / 0.6);
      mDust.forEach((d, k) => { op(d, dp > 0 && dp < 1 ? Math.sin(dp * Math.PI) : 0); tr(d, k ? HAMX : FEAX, FEET - 4, 0.6 + 0.7 * dp); });
      op(mTag, P(t, mid('moon', 0.12), 0.4, linear));
      const gp = P(t, tRM + TM + 0.12, 0.5, pop);
      op(together, clamp(gp * 2) * (1 - P(t, tS0, 0.4, linear))); tr(together, PX, 272, Math.max(0.01, gp));
    }
    op(divider, P(t, tS0 + 0.2, 0.5, linear) * fadeSplit); tr(divider, 600 * sp, 0);

    /* --- "Forces" and a push and a pull --- */
    const tT0 = mid('why', 0.49), tP0 = at('plan');
    const tp = P(t, tT0, 0.7, pop), q = P(t, tP0 - 0.1, 0.9);
    op(ttl, clamp(tp * 2)); tr(ttl, 600, lerp(262, 196, q), Math.max(0.01, lerp(0.85 + 0.15 * tp, 0.66, q)));
    op(sub, P(t, mid('why', 0.66), 0.5, linear)); attr(sub, 'y', lerp(332, 252, q));
    const pbA = P(t, mid('why', 0.7), 0.5, linear) * (1 - P(t, tP0 - 0.1, 0.4, linear));
    op(PB, pbA);
    if (pbA > 0) {
      const cx = lerp(560, 720, P(t, mid('why', 0.88), 1.8, ease));
      crate.at(cx, 590);
      push.move(crate.pt.left[0], crate.pt.left[1]); push.set(P(t, mid('why', 0.75), 0.5, easeOut));
      pull.move(crate.pt.right[0], crate.pt.right[1]); pull.set(P(t, mid('why', 0.81), 0.5, easeOut));
    }

    /* --- the roadmap --- */
    op(road, P(t, tP0 - 0.1, 0.3, linear));
    stops.forEach((st, i) => {
      const p = P(t, mid('plan', popAt[i]), 0.55, pop);
      op(st.g, clamp(p * 2)); tr(st.g, st.x, 466 + (1 - clamp(p)) * 26, Math.max(0.01, 0.86 + 0.14 * p));
      if (st.upd) st.upd(t);
    });
  };
});
