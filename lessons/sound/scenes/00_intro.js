/* Intro: the silent explosion.
   A star swells and bursts in total silence (a "sound" meter stays at zero, no sound arcs anywhere)
   -> the loudest event vs total silence, with a big "?" -> the title "Sound": a vibration passed
   from particle to particle (a tuning fork sets a row of air particles going, the nudge runs to an ear)
   -> a four-card roadmap: how it travels, high or low, loud or quiet, sounds we can't hear. */
scene('intro', S => {
  const { at, mid } = S, root = S.root, R = S.reduce;
  const AMP = R ? 0.3 : 1;
  const f1 = v => (+v).toFixed(1);

  /* ---------- local art ---------- */
  // the shared loudspeaker look: dark box, grey cone facing right; g.set(dx) moves the cone in and out
  function speaker(parent, s) {
    const g = G(parent), k = G(g); tr(k, 0, 0, s || 1);
    E('rect', { x: -46, y: -60, width: 56, height: 120, rx: 10, fill: ball('#36505F', '#16242D'), stroke: '#6F8B9B', 'stroke-width': 3 }, k);
    const cone = G(k);
    E('path', { d: 'M8,-24 L44,-58 L44,58 L8,24 Z', fill: linGrad('#7D8E9A', '#C9D5DD'), stroke: '#DCE6EC', 'stroke-width': 3, 'stroke-linejoin': 'round' }, cone);
    E('path', { d: 'M8,-24 Q20,0 8,24', fill: '#5D707C', stroke: '#DCE6EC', 'stroke-width': 2.5 }, cone);
    g.set = dx => tr(cone, dx, 0);
    return g;
  }
  // an ear seen from the side, opening to the left; about 90 x 130, centred
  function ear(parent) {
    const g = G(parent);
    g.halo = E('circle', { cx: -6, cy: 0, r: 92, fill: glow(C.energy) }, g);
    E('path', { d: 'M-30,-34 C-28,-66 2,-78 26,-70 C52,-61 60,-30 50,-6 C42,14 26,20 22,38 C18,56 4,70 -14,64 C-28,59 -30,46 -24,36 C-18,26 -10,22 -12,6 C-14,-8 -32,-12 -30,-34 Z', fill: ball('#F2C29C', '#C98E62'), stroke: '#FFE2C8', 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
    E('path', { d: 'M-12,-42 C0,-56 26,-52 32,-30 C37,-12 24,-2 14,6', fill: 'none', stroke: '#B97A52', 'stroke-width': 5, 'stroke-linecap': 'round' }, g);
    E('ellipse', { cx: -6, cy: 4, rx: 9, ry: 12, fill: '#6E3A26' }, g);
    return g;
  }
  // a tuning fork standing on its stem, tines up; origin = bottom of the U. g.set(d) bends the tines
  function fork(parent) {
    const g = G(parent);
    const shape = d => `M${f1(-23 - d)},-150 Q${f1(-23 - d * 0.4)},-60 -23,0 A23,23 0 0 0 23,0 Q${f1(23 + d * 0.4)},-60 ${f1(23 + d)},-150`;
    const ghostA = E('path', { fill: 'none', stroke: '#C9D6DE', 'stroke-width': 14, 'stroke-linecap': 'round', opacity: 0.16 }, g);
    const ghostB = E('path', { fill: 'none', stroke: '#C9D6DE', 'stroke-width': 14, 'stroke-linecap': 'round', opacity: 0.16 }, g);
    E('line', { x1: 0, y1: 20, x2: 0, y2: 104, stroke: '#9DB0BF', 'stroke-width': 13, 'stroke-linecap': 'round' }, g);
    E('circle', { cx: 0, cy: 112, r: 13, fill: ball('#D7E2E9', '#7D8E9A') }, g);
    const body = E('path', { fill: 'none', stroke: '#D7E2E9', 'stroke-width': 14, 'stroke-linecap': 'round' }, g);
    const shine = E('path', { fill: 'none', stroke: '#FFFFFF', 'stroke-width': 3, 'stroke-linecap': 'round', opacity: 0.55 }, g);
    g.set = (d, ghost) => {
      body.setAttribute('d', shape(d));
      shine.setAttribute('d', `M${f1(-26 - d)},-140 Q${f1(-26 - d * 0.4)},-60 -26,-6`);
      ghostA.setAttribute('d', shape(ghost)); ghostB.setAttribute('d', shape(-ghost));
      op(ghostA, ghost > 0.5 ? 1 : 0); op(ghostB, ghost > 0.5 ? 1 : 0);
    };
    g.set(0, 0);
    return g;
  }
  // a bat, wings out, about 120 wide, centred
  function bat(parent) {
    const g = G(parent);
    E('path', { d: 'M0,-6 C-10,-20 -30,-26 -58,-18 C-50,-10 -50,0 -44,6 C-36,0 -28,2 -24,10 C-18,4 -10,6 -6,12 Z M0,-6 C10,-20 30,-26 58,-18 C50,-10 50,0 44,6 C36,0 28,2 24,10 C18,4 10,6 6,12 Z', fill: '#4A3B6B', stroke: '#9C86D8', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, g);
    E('ellipse', { cx: 0, cy: 2, rx: 10, ry: 14, fill: '#5B4A82', stroke: '#9C86D8', 'stroke-width': 2.5 }, g);
    E('path', { d: 'M-7,-10 L-9,-22 L-2,-13 M7,-10 L9,-22 L2,-13', fill: '#5B4A82', stroke: '#9C86D8', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, g);
    E('circle', { cx: 4, cy: -4, r: 2, fill: '#FFE45C' }, g);
    return g;
  }

  /* ---------- starfield (full stage) ---------- */
  const sky = G(root), stars = [];
  const sr = rng(808);
  for (let i = 0; i < 130; i++) {
    const x = 20 + sr() * 1160, y = 16 + sr() * 718, r = 0.7 + Math.pow(sr(), 2.2) * 2.3, c = sr();
    stars.push({ el: E('circle', { cx: f1(x), cy: f1(y), r: r.toFixed(2), fill: c < 0.16 ? '#FFE9B8' : c < 0.3 ? '#BFDFFF' : '#F2F7FA' }, sky), base: 0.3 + sr() * 0.6, per: 1.4 + sr() * 2.6, ph: sr() });
  }
  [[120, 130], [1080, 120], [1010, 660], [180, 620], [820, 70], [380, 92], [690, 700]].forEach(([x, y], i) => {
    const g = G(sky); tr(g, x, y);
    E('circle', { r: 12, fill: glow('#CFE8FF') }, g);
    E('path', { d: 'M-11,0 L11,0 M0,-11 L0,11', stroke: '#EAF5FF', 'stroke-width': 1.6, 'stroke-linecap': 'round' }, g);
    E('circle', { r: 2.3, fill: '#FFFFFF' }, g);
    stars.push({ el: g, base: 0.85, per: 2.1 + i * 0.37, ph: i * 0.21 });
  });

  /* ---------- the star and its silent explosion ---------- */
  const EX = 500, EY = 365;
  const boom = G(root);
  const nebula = G(boom);
  [[-10, 6, 230, 160, 18, '#FF8A3D', 0.55], [-60, 40, 150, 110, -30, '#FF6B5C', 0.5], [60, -40, 160, 100, 40, '#B48CFF', 0.45], [20, 10, 100, 80, 0, '#FFE45C', 0.4]]
    .forEach(([x, y, rx, ry, rot, c, o]) => E('ellipse', { cx: 0, cy: 0, rx, ry, fill: glow(c), opacity: o, transform: `translate(${x} ${y}) rotate(${rot})` }, nebula));
  const flash = E('circle', { r: 100, fill: glow('#FFF6D0') }, boom);
  const bubble = E('circle', { r: 100, fill: glow('#FF8A3D') }, boom);
  // the shell: a limb-brightened glowing bubble (brightest at its edge)
  const shellFill = (() => {
    const id = 'sndShell', g = E('radialGradient', { id }, defs());
    [[0, '#FF8A3D', 0.04], [0.55, '#FF8A3D', 0.1], [0.78, '#FF9A3D', 0.26], [0.9, '#FFB13B', 0.55], [0.96, '#FFE45C', 0.6], [1, '#FFE45C', 0]]
      .forEach(([o, c, a]) => E('stop', { offset: o, 'stop-color': c, 'stop-opacity': a }, g));
    return `url(#${id})`;
  })();
  const shell = E('circle', { r: 100, fill: shellFill }, boom);
  const debris = [], dr = rng(42);
  for (let i = 0; i < 84; i++) {
    const outer = i < 58;
    const a = outer ? (i / 58) * TAU + (dr() - 0.5) * 0.1 : dr() * TAU;
    const s = outer ? 0.84 + dr() * 0.22 : 0.28 + dr() * 0.52, r = outer ? 2.5 + dr() * 5 : 1.6 + dr() * 3;
    const col = outer ? (s > 1.0 ? '#FFF1A8' : s > 0.93 ? C.energy : s > 0.88 ? '#FFB13B' : C.heat) : (dr() < 0.5 ? '#FFB13B' : '#FF6B5C');
    const streak = E('line', { stroke: col, 'stroke-width': f1(r * 0.85), 'stroke-linecap': 'round', opacity: 0.45 }, boom);
    const blob = E('circle', { r: f1(r), fill: col }, boom);
    debris.push({ streak, blob, s, outer, ca: Math.cos(a), sa: Math.sin(a), wob: dr() * TAU });
  }
  const halo = E('circle', { r: 70, fill: glow('#FFE9A0') }, boom);
  const spikes = E('path', { d: 'M-80,0 L80,0 M0,-80 L0,80', stroke: '#FFF6D8', 'stroke-width': 3, 'stroke-linecap': 'round' }, boom);
  const core = E('circle', { r: 16, fill: ball('#FFF6D0', '#FFB13B') }, boom);
  const tBurst = mid('hook', 0.36);

  /* ---------- the "sound" meter panel: it stays at zero ---------- */
  const panel = G(root);
  card(panel, -135, -72, 270, 144, { fill: 'rgba(20,54,70,0.88)', stroke: C.line });
  const pSpk = speaker(panel, 0.34); tr(pSpk, -100, -30);
  T(panel, -70, -18, 'sound', { size: 32, weight: 700 });
  const pMeter = meter(panel, { w: 170, h: 26, color: C.air }); tr(pMeter, -110, 18); pMeter.set(0);
  const pZero = T(panel, 96, 42, '0', { size: 44, weight: 700, anchor: 'middle', fill: C.ink });
  const pRing = E('rect', { x: -135, y: -72, width: 270, height: 144, rx: 22, fill: 'none', stroke: C.energy, 'stroke-width': 4 }, panel);

  /* ---------- why: the loudest event vs total silence ---------- */
  const whyG = G(root);
  const chLoud = chip(whyG, 'the loudest event', { size: 32, fill: '#4A2A1E', stroke: C.heat, color: '#FFD2B0' });
  const chQuiet = chip(whyG, 'total silence', { size: 32, fill: C.card2, stroke: C.air, color: C.air });
  const qMark = T(whyG, 0, 0, '?', { size: 170, weight: 700, anchor: 'middle', fill: C.energy });

  /* ---------- def: title, a fork, a row of air particles, an ear ---------- */
  const title = G(root);
  T(title, 0, 0, 'Sound', { size: 116, weight: 700, anchor: 'middle', fill: C.air });
  const sub = T(root, 600, 262, 'a vibration, passed from particle to particle', { size: 34, weight: 600, anchor: 'middle', fill: C.muted });
  const defG = G(root);
  const ROW_Y = 478, X0 = 230, NP = 22, SP = 34, A = 10, V = 240, WL = 9 * SP, OM = TAU * V / WL;
  const fk = fork(defG); tr(fk, 184, ROW_Y + 112);
  const glows = [], parts = [];
  for (let i = 0; i < NP; i++) glows.push(E('circle', { cx: X0 + i * SP, cy: ROW_Y, r: 26, fill: glow(C.energy) }, defG));
  for (let i = 0; i < NP; i++) parts.push(E('circle', { cx: X0 + i * SP, cy: ROW_Y, r: 9, fill: ball(C.air, '#4E8FB8') }, defG));
  const earG = ear(defG); tr(earG, 1040, ROW_Y);
  const tWave = at('def') + 0.5;

  /* ---------- plan: four cards ---------- */
  const road = G(root);
  const CW = 256, CH = 300, CY = 462, CX = [180, 460, 740, 1020];
  const cards = [
    { text: 'how it travels', draw: g => {
      const gl = E('circle', { r: 24, fill: glow(C.energy) }, g), ps = [];
      for (let i = 0; i < 8; i++) ps.push(E('circle', { cx: -84 + i * 24, cy: -10, r: 7.5, fill: ball(C.air, '#4E8FB8') }, g));
      const ar = arrow(g, -72, 36, 76, 36, { color: C.energy, width: 5 });
      return { ar, upd: t => {
        const q = ((t * 0.55) % 1) * 1.5 - 0.25;
        ps.forEach((p, i) => attr(p, 'cx', -84 + i * 24 + 9 * Math.exp(-Math.pow((i / 7 - q) / 0.1, 2))));
        tr(gl, -84 + q * 168, -10); op(gl, 0.8 * Math.sin(Math.PI * clamp((q + 0.25) / 1.5)));
      } };
    } },
    { text: 'high or low', draw: g => {
      const hi = sineWave(g, { w: 180, amp: 15, wl: 30, color: C.air, width: 4 }); tr(hi, -90, -36);
      const lo = sineWave(g, { w: 180, amp: 15, wl: 90, color: C.air, width: 4 }); tr(lo, -90, 28);
      return { upd: t => { hi.set({ phase: t * 0.8 }); lo.set({ phase: t * 0.27 }); } };
    } },
    { text: 'loud or quiet', draw: g => {
      const big = sineWave(g, { w: 180, amp: 28, wl: 60, color: C.air, width: 4 }); tr(big, -90, -30);
      const sm = sineWave(g, { w: 180, amp: 8, wl: 60, color: C.air, width: 4 }); tr(sm, -90, 42);
      return { upd: t => { big.set({ phase: t * 0.5 }); sm.set({ phase: t * 0.5 }); } };
    } },
    { text: "sounds we can't hear", draw: g => {
      const b = bat(g); tr(b, -36, 0, 0.98);
      const arcs = [];
      for (let k = 0; k < 4; k++) arcs.push(E('path', { d: 'M0,-26 Q14,0 0,26', fill: 'none', stroke: C.ethanol, 'stroke-width': 5, 'stroke-linecap': 'round' }, g));
      return { upd: t => arcs.forEach((a, k) => { const u = ((t * 0.7) + k / 4) % 1; tr(a, 16 + u * 66, 0, 0.6 + 0.55 * u); op(a, Math.sin(u * Math.PI)); }) };
    } },
  ].map((c, i) => {
    const g = G(road);
    card(g, -CW / 2, -CH / 2, CW, CH, { fill: C.card, stroke: C.line });
    const art = G(g); tr(art, 0, -42, 1.22);
    const parts2 = c.draw(art);
    const two = textWidth(c.text, 28, FD, 600) > CW - 28, lines = two ? c.text.replace(/ (?=\S+ \S+$)/, '\n') : c.text;
    T(g, 0, two ? 86 : 104, lines, { size: 28, weight: 600, anchor: 'middle', lh: 34 });
    return Object.assign({ g, x: CX[i] }, parts2);
  });

  /* ---------- update ---------- */
  return t => {
    t = Math.min(t, S.D);

    /* stars: fade in, twinkle, dim for the title */
    const sOn = P(t, 0, 0.6, linear) * lerp(1, 0.3, P(t, at('def') - 0.3, 0.8, linear));
    op(sky, sOn);
    stars.forEach(s => op(s.el, s.base * (1 - 0.45 * AMP * wave(t, s.per, s.ph))));

    /* the star swells, bursts, and the shell expands; later it settles into a nebula on the left */
    const bOn = 1 - P(t, at('def') - 0.4, 0.45, linear);
    op(boom, bOn);
    if (bOn > 0) {
      const pre = P(t, at('hook'), tBurst - at('hook'), easeIn), u = t - tBurst;
      const neb = P(t, at('why') - 0.4, 1.2, linear);
      const mv = P(t, at('why') - 0.4, 1.0);
      tr(boom, lerp(EX, 300, mv), lerp(EY, 330, mv), lerp(1, 0.62, mv));
      // the star before it blows
      const shiver = u < 0 ? (1 + 0.12 * pre * Math.sin(t * (8 + 26 * pre))) : 1;
      const coreR = u < 0 ? lerp(15, 36, pre) * shiver : lerp(36, 6, P(u, 0, 0.35, easeOut));
      attr(core, 'r', coreR);
      tr(halo, 0, 0, u < 0 ? (0.8 + 1.0 * pre) * shiver : lerp(1.8, 0.45, P(u, 0, 0.6, easeOut)));
      op(halo, u < 0 ? 0.75 + 0.25 * pre : 0.9 - 0.4 * neb);
      tr(spikes, 0, 0, u < 0 ? 0.55 + 0.6 * pre : lerp(1.6, 0.3, P(u, 0, 0.5, easeOut)), 0);
      op(spikes, u < 0 ? 0.55 + 0.4 * pre : 0.9 * (1 - P(u, 0.1, 0.7, linear)) + 0.25 * P(u, 0.8, 0.5, linear));
      // the burst: a flash, then an expanding shell of glowing debris
      const fl = u > 0 ? Math.max(0, 1 - u / 1.0) : 0;
      tr(flash, 0, 0, 0.6 + 4.6 * easeOut(clamp(u / 0.8)));
      op(flash, fl * fl);
      const Rs = u > 0 ? 250 * easeOut(clamp(u / 4.4)) + 10 * clamp((u - 4.4) / 5) : 0;
      const sh = u > 0 ? 1 : 0, fade = 1 - 0.65 * neb;
      attr(bubble, 'r', Math.max(1, 60 + Rs * 0.9)); op(bubble, sh * (0.75 - 0.5 * clamp(u / 2.5)) * fade);
      attr(shell, 'r', Math.max(1, Rs * 1.07)); op(shell, sh * fade * clamp(u / 0.25));
      const vel = u > 0 ? 250 * 3 * Math.pow(1 - clamp(u / 4.4), 2) / 4.4 : 0;
      debris.forEach(d => {
        if (u <= 0) { op(d.blob, 0); op(d.streak, 0); return; }
        const rr = Rs * d.s + 2 * Math.sin(t * 1.3 + d.wob) * AMP, L = (14 + vel * 0.38) * d.s;
        const x = d.ca * rr, y = d.sa * rr;
        attr(d.blob, 'cx', x); attr(d.blob, 'cy', y);
        const k = (d.outer ? 1 : 0.7) * clamp(u / 0.15);
        op(d.blob, (0.95 - 0.4 * neb) * k); op(d.streak, (1 - neb) * k);
        if (neb < 1) { attr(d.streak, 'x1', d.ca * Math.max(0, rr - L)); attr(d.streak, 'y1', d.sa * Math.max(0, rr - L)); attr(d.streak, 'x2', x); attr(d.streak, 'y2', y); }
      });
      op(nebula, neb);
      if (neb > 0) tr(nebula, 0, 0, 0.92 + 0.08 * wave(t, 5.2) * AMP, 6 * Math.sin(t * 0.25) * AMP);
    }

    /* the meter panel: always at zero; it flashes on "nothing", then moves right for "why" */
    const pIn = P(t, mid('hook', 0.12), 0.6, easeOut), pOut = 1 - P(t, at('def') - 0.4, 0.45, linear);
    op(panel, pIn * pOut);
    if (pIn * pOut > 0) {
      const mv = P(t, at('why') - 0.4, 1.0);
      tr(panel, lerp(1000, 900, mv) + (1 - pIn) * 30, lerp(372, 318, mv), lerp(1, 1.12, mv));
      const nothing = Math.sin(Math.PI * P(t, mid('hook', 0.84), 0.9, linear));
      pZero.setAttribute('transform', `translate(96 28) scale(${(1 + 0.35 * nothing).toFixed(3)}) translate(-96 -28)`);
      op(pRing, nothing);
    }

    /* why */
    const wOn = P(t, at('why'), 0.4, linear) * (1 - P(t, at('def') - 0.4, 0.45, linear));
    op(whyG, wOn);
    if (wOn > 0) {
      const pq = P(t, mid('why', 0.1), 0.6, pop);
      op(qMark, clamp(pq * 2));
      qMark.setAttribute('transform', `translate(600 452) scale(${Math.max(0.01, 0.6 + 0.4 * pq).toFixed(3)}) rotate(${(7 * Math.sin(t * 2.2) * AMP).toFixed(2)})`);
      const pl = P(t, mid('why', 0.36), 0.5, pop), pr = P(t, mid('why', 0.74), 0.5, pop);
      op(chLoud, clamp(pl * 2)); tr(chLoud, 300, 560 + (1 - clamp(pl)) * 18, Math.max(0.01, 0.8 + 0.2 * pl));
      op(chQuiet, clamp(pr * 2)); tr(chQuiet, 900, 560 + (1 - clamp(pr)) * 18, Math.max(0.01, 0.8 + 0.2 * pr));
    }

    /* the title, rising for the roadmap */
    const pT = P(t, at('def') + 0.05, 0.7, pop), pM = P(t, at('plan') - 0.1, 1.0);
    op(title, clamp(pT * 2));
    tr(title, 600, lerp(196, 168, pM), Math.max(0.01, (0.8 + 0.2 * clamp(pT)) * lerp(1, 0.66, pM)));
    op(sub, P(t, mid('def', 0.2), 0.5, linear) * (1 - P(t, at('plan') - 0.4, 0.4, linear)));

    /* a vibration, passed from particle to particle */
    const dOn = P(t, at('def'), 0.45, linear) * (1 - P(t, at('plan') - 0.4, 0.4, linear));
    op(defG, dOn);
    if (dOn > 0) {
      const tf = t - tWave, env = clamp(tf / 0.25);
      const d = tf > 0 ? env * (A / 0.73) * Math.sin(OM * tf) : 0;
      fk.set(d, tf > 0 ? A / 0.73 : 0);
      for (let i = 0; i < NP; i++) {
        const tau = tf - i * SP / V;
        const u = tau > 0 ? A * Math.sin(OM * tau) : 0;
        attr(parts[i], 'cx', X0 + i * SP + u);
        attr(glows[i], 'cx', X0 + i * SP + u);
        op(glows[i], tau > 0 ? 0.95 * Math.exp(-tau / 0.55) : 0);
      }
      const tauE = tf - (1000 - X0) / V;
      op(earG.halo, tauE > 0 ? clamp(tauE / 0.4) * (0.55 + 0.3 * wave(tauE, WL / V)) : 0);
    }

    /* the roadmap */
    op(road, P(t, at('plan'), 0.4, linear));
    const showAt = [mid('plan', 0.04), mid('plan', 0.33), mid('plan', 0.5), mid('plan', 0.73)];
    cards.forEach((c, i) => {
      const p = P(t, showAt[i], 0.6, pop);
      op(c.g, clamp(p * 2));
      tr(c.g, c.x, CY + (1 - clamp(p)) * 30, Math.max(0.01, 0.9 + 0.1 * p));
      if (p > 0) c.upd(t - showAt[i]);
      if (c.ar) c.ar.set(P(t, showAt[i] + 0.3, 0.6));
    });
  };
});
