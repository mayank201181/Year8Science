/* Chapter 7: The ear and hearing range.
   Beats: a sound arrives at a cross-section of the ear -> the pinna funnels it into the ear canal
   -> the ear drum vibrates -> three tiny bones rock in turn and pass it to the coiled, fluid-filled
   cochlea -> sensitive cells make nerve signals that run to the brain (showpiece: one travelling
   highlight, pinna to brain) -> the shared frequency line: the hearing range, 20 Hz to 20,000 Hz
   -> "20 to 20k" -> a dog whistle at 25,000 Hz: the dog hears it, you don't -> the top of the range
   drops with age -> very loud sounds damage the cells in the cochlea -> ear defenders, and
   headphones turned down. */
scene('ear', S => {
  const { at, end, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;
  const ID = S.ch.id;

  /* ---------- local helpers ---------- */
  let gid = 0;
  /* horizontal gradient of one colour; stops [[offset, opacity], ...] */
  function hgrad(color, stops) {
    const id = `${ID}-hg${++gid}`;
    const lg = E('linearGradient', { id, x1: 0, y1: 0, x2: 1, y2: 0 }, defs());
    stops.forEach(([o, a]) => E('stop', { offset: o, 'stop-color': color, 'stop-opacity': a }, lg));
    return `url(#${id})`;
  }
  function leader(parent, x1, y1, x2, y2, color) {
    const g = G(parent);
    E('line', { x1, y1, x2, y2, stroke: color || C.muted, 'stroke-width': 3, 'stroke-linecap': 'round' }, g);
    E('circle', { cx: x2, cy: y2, r: 5, fill: color || C.muted }, g);
    return g;
  }
  const cubic = (a, b, c, d, u) => { const v = 1 - u; return [v * v * v * a[0] + 3 * v * v * u * b[0] + 3 * v * u * u * c[0] + u * u * u * d[0], v * v * v * a[1] + 3 * v * v * u * b[1] + 3 * v * u * u * c[1] + u * u * u * d[1]]; };
  /* circular arc, centre (cx, cy), radius r, from angle a0 to a1 (radians, a1 > a0) */
  const arcD = (cx, cy, r, a0, a1) => `M${(cx + r * Math.cos(a0)).toFixed(1)},${(cy + r * Math.sin(a0)).toFixed(1)} A${r.toFixed(1)},${r.toFixed(1)} 0 0 1 ${(cx + r * Math.cos(a1)).toFixed(1)},${(cy + r * Math.sin(a1)).toFixed(1)}`;
  /* position along a polyline, u in 0..1 */
  function along(pts, u) {
    let L = 0; const seg = [];
    for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(l); L += l; }
    let d = clamp(u) * L;
    for (let i = 0; i < seg.length; i++) { if (d <= seg[i] || i === seg.length - 1) { const f = seg[i] ? clamp(d / seg[i]) : 0; return [lerp(pts[i][0], pts[i + 1][0], f), lerp(pts[i][1], pts[i + 1][1], f)]; } d -= seg[i]; }
    return pts[pts.length - 1];
  }
  const hex = c => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16));
  const mix = (a, b, p) => { const A = hex(a), B = hex(b); return `rgb(${A.map((v, i) => Math.round(lerp(v, B[i], clamp(p)))).join(',')})`; };
  const popIn = (el, t, t0, x, y, s0) => { const p = P(t, t0, 0.5, pop); op(el, clamp(p * 2)); tr(el, x, y, Math.max(0.01, (s0 === undefined ? 0.6 : s0) + (1 - (s0 === undefined ? 0.6 : s0)) * p)); return p; };

  /* ---------- the shared frequency line (same proportions in every chapter) ----------
     log axis, one decade every 186 px: 2, 20, 200, 2,000, 20,000, 200,000 Hz.
     infrasound < 20 Hz orange, hearing range 20-20,000 Hz green, ultrasound > 20,000 Hz violet. */
  const FL = { x0: 135, D: 186, y: 590, h: 28 };
  const fx = f => FL.x0 + FL.D * Math.log10(f / 2);
  function freqLine(parent) {
    const g = G(parent), h = FL.h, top = FL.y - h / 2, xL = fx(2) - 60, xR = fx(200000) + 60;
    const wT = xR - xL, wI = fx(20) - xL, wU = xR - fx(20000);
    g.track = E('rect', { x: xL, y: top, width: wT, height: h, fill: hgrad('#24485A', [[0, 0], [60 / wT, 1], [1 - 60 / wT, 1], [1, 0]]) }, g);
    g.inf = E('rect', { x: xL, y: top, width: wI, height: h, fill: hgrad(C.heat, [[0, 0], [60 / wI, 1], [1, 1]]) }, g);
    g.hear = E('rect', { x: fx(20), y: top, width: fx(20000) - fx(20), height: h, fill: C.good }, g);
    g.ult = E('rect', { x: fx(20000), y: top, width: wU, height: h, fill: hgrad(C.ethanol, [[0, 1], [1 - 60 / wU, 1], [1, 0]]) }, g);
    g.ticks = G(g); g.tl = {};
    [[2, '2'], [20, '20'], [200, '200'], [2000, '2,000'], [20000, '20,000'], [200000, '200,000']].forEach(([f, s]) => {
      E('line', { x1: fx(f), x2: fx(f), y1: top + h + 2, y2: top + h + 14, stroke: C.muted, 'stroke-width': 3, 'stroke-linecap': 'round' }, g.ticks);
      g.tl[f] = T(g.ticks, fx(f), top + h + 44, s, { size: 26, weight: 600, anchor: 'middle' });
    });
    g.axis = T(g, 600, top + h + 86, 'frequency (Hz)', { size: 24, weight: 600, anchor: 'middle', fill: C.muted });
    const ly = top - 14;
    g.lInf = T(g, (fx(2) + fx(20)) / 2, ly, 'infrasound', { size: 28, weight: 700, anchor: 'middle', fill: C.heat });
    g.lHear = T(g, (fx(20) + fx(20000)) / 2, ly, 'hearing range', { size: 28, weight: 700, anchor: 'middle', fill: C.good });
    g.lUlt = T(g, (fx(20000) + fx(200000)) / 2, ly, 'ultrasound', { size: 28, weight: 700, anchor: 'middle', fill: C.ethanol });
    g.setHear = (f0, f1) => { attr(g.hear, 'x', fx(f0)); attr(g.hear, 'width', Math.max(0, fx(f1) - fx(f0))); };
    return g;
  }

  /* ---------- art ---------- */
  const SKIN = '#E8B48E', SKINDK = '#B9825A', SKINLT = '#F7D9C2', AIRDK = '#0D2230';
  const BONE = '#F2E6C8', BONEDK = '#A8976B';
  /* a curved flap of skin along an ellipse arc (degrees a0 -> a1), half-width w0 -> wm -> w1 */
  function flap(cx, cy, rx, ry, a0, a1, w0, wm, w1, n) {
    const out = [], inn = [], ctr = [];
    for (let i = 0; i <= n; i++) {
      const u = i / n, a = (a0 + (a1 - a0) * u) * Math.PI / 180;
      const x = cx + rx * Math.cos(a), y = cy + ry * Math.sin(a);
      let nx = ry * Math.cos(a), ny = rx * Math.sin(a); const L = Math.hypot(nx, ny); nx /= L; ny /= L;
      const base = lerp(w0, w1, u), w = base + (wm - base) * Math.sin(u * Math.PI);
      out.push([x + nx * w, y + ny * w]); inn.push([x - nx * w, y - ny * w]); ctr.push([x, y, nx, ny, w]);
    }
    return { d: closedPath(out.concat(inn.reverse())), ctr };
  }
  /* a dog, side view facing right, feet at (0,0), about 180 wide and 160 tall.
     g.setEars(0 droopy .. 1 pricked up), g.wag(t, amount) */
  function dog(parent) {
    const g = G(parent), FUR = '#C98E52', DK = '#8E5B2E', LT = '#E8B987';
    const tail = E('path', { fill: 'none', stroke: FUR, 'stroke-width': 10, 'stroke-linecap': 'round' }, g);
    [-50, 30].forEach(x => E('rect', { x: x - 7, y: -56, width: 14, height: 56, rx: 7, fill: DK }, g));
    E('ellipse', { cx: 0, cy: -76, rx: 66, ry: 31, fill: ball(LT, FUR), stroke: DK, 'stroke-width': 2.5 }, g);
    [-36, 46].forEach(x => E('rect', { x: x - 8, y: -60, width: 16, height: 60, rx: 8, fill: FUR, stroke: DK, 'stroke-width': 2 }, g));
    E('path', { d: 'M38,-96 L62,-128 L84,-112 L62,-78 Z', fill: FUR }, g);
    E('path', { d: 'M48,-92 L72,-104', stroke: C.bad, 'stroke-width': 7, 'stroke-linecap': 'round' }, g);
    const head = G(g); tr(head, 76, -128);
    E('ellipse', { rx: 25, ry: 22, fill: ball(LT, FUR), stroke: DK, 'stroke-width': 2.5 }, head);
    E('path', { d: 'M12,-7 L44,-3 Q51,4 44,11 L12,15 Z', fill: LT, stroke: DK, 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, head);
    E('circle', { cx: 46, cy: 2, r: 5.5, fill: '#2A1D14' }, head);
    E('circle', { cx: 9, cy: -7, r: 3.8, fill: '#2A1D14' }, head);
    const ear = G(head);
    E('path', { d: 'M-8,0 Q-15,24 -3,36 Q8,25 8,0 Z', fill: DK, stroke: '#6A4220', 'stroke-width': 2 }, ear);
    g.setEars = p => ear.setAttribute('transform', `translate(-8 -14) rotate(${lerp(22, 160, clamp(p)).toFixed(1)})`);
    g.wag = (t, k) => { const a = (0.35 + 0.5 * k * Math.sin(t * TAU * 2.2)); tail.setAttribute('d', `M-62,-84 Q${(-84 - 8 * a).toFixed(1)},-98 ${(-80 - 30 * a).toFixed(1)},${(-122 + 12 * Math.abs(a)).toFixed(1)}`); };
    g.setEars(0); g.wag(0, 0);
    return g;
  }
  /* loudspeaker: dark box with a grey cone facing right; g.set(push -1..1) moves the cone horizontally */
  function speaker(parent, s) {
    const g = G(parent), k = s || 1;
    E('rect', { x: -40 * k, y: -60 * k, width: 52 * k, height: 120 * k, rx: 10 * k, fill: '#22313D', stroke: '#5E7A8C', 'stroke-width': 3 }, g);
    const cone = G(g);
    E('path', { d: `M${12 * k},${-22 * k} L${34 * k},${-50 * k} L${34 * k},${50 * k} L${12 * k},${22 * k} Z`, fill: '#8FA4B3', stroke: '#C9D6DE', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, cone);
    E('ellipse', { cx: 34 * k, cy: 0, rx: 6 * k, ry: 50 * k, fill: '#6E8494', stroke: '#C9D6DE', 'stroke-width': 2 }, cone);
    g.set = v => tr(cone, 5 * k * v, 0);
    return g;
  }
  /* yellow warning triangle with "!" */
  function warnSign(parent, s) {
    const g = G(parent);
    E('path', { d: `M0,${-s} L${s * 1.05},${s * 0.78} L${-s * 1.05},${s * 0.78} Z`, fill: C.energy, stroke: '#B59A12', 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
    E('line', { x1: 0, y1: -s * 0.42, x2: 0, y2: s * 0.22, stroke: C.bg0, 'stroke-width': s * 0.16, 'stroke-linecap': 'round' }, g);
    E('circle', { cx: 0, cy: s * 0.5, r: s * 0.09, fill: C.bg0 }, g);
    return g;
  }

  /* ================= A. the ear, in cross-section ================= */
  const A = G(root);
  // flesh of the head (fades out to the right), and the skull bone around the middle and inner ear
  const fleshG = E('radialGradient', { id: ID + '-flesh', gradientUnits: 'userSpaceOnUse', cx: 590, cy: 400, r: 400, gradientTransform: 'translate(590 400) scale(1 0.76) translate(-590 -400)' }, defs());
  [[0, 0.52], [0.5, 0.48], [0.8, 0.3], [1, 0]].forEach(([o, a]) => E('stop', { offset: o, 'stop-color': '#B97F6A', 'stop-opacity': a }, fleshG));
  E('path', { d: 'M358,100 C352,160 348,206 348,206 C344,280 340,330 340,372 L340,428 C340,470 344,520 348,594 C348,594 352,640 358,700 L1000,700 L1000,100 Z', fill: `url(#${ID}-flesh)` }, A);
  E('path', { d: closedPath([[505, 312], [590, 268], [740, 252], [860, 290], [905, 400], [860, 512], [740, 548], [590, 536], [505, 492]]), fill: 'rgba(233,223,196,0.12)', stroke: 'rgba(233,223,196,0.32)', 'stroke-width': 3 }, A);
  // ear canal and middle-ear cavity (air)
  E('path', { d: 'M338,372 C400,365 470,367 526,370 L526,430 C470,433 400,435 338,428 Z', fill: AIRDK }, A);
  E('path', { d: 'M528,352 C528,322 560,312 596,314 C636,316 662,330 662,362 L662,440 C662,462 636,472 596,470 C560,468 528,460 528,440 Z', fill: AIRDK, stroke: 'rgba(233,223,196,0.5)', 'stroke-width': 3 }, A);
  // glows (behind the parts they light)
  const gPinna = E('ellipse', { cx: 236, cy: 400, rx: 150, ry: 230, fill: glow(C.energy) }, A);
  const gDrum = E('ellipse', { cx: 528, cy: 400, rx: 44, ry: 70, fill: glow(C.energy) }, A);
  const gBones = [[548, 380, 40, 56], [596, 372, 36, 52], [630, 405, 40, 30]].map(([cx, cy, rx, ry]) => E('ellipse', { cx, cy, rx, ry, fill: glow(C.energy) }, A));
  const gCoch = E('circle', { cx: 765, cy: 395, r: 150, fill: glow(C.energy) }, A);
  // incoming sound: arcs (drawn behind the pinna, so the flap gathers them into the canal)
  const arcsG = G(A), ARCS = [];
  for (let i = 0; i < 34; i++) ARCS.push(E('path', { fill: 'none', stroke: C.air, 'stroke-width': 4.5, 'stroke-linecap': 'round' }, arcsG));
  // pinna
  const PIN = flap(325, 400, 135, 190, -81, -279, 21, 25, 30, 44);
  E('path', { d: PIN.d, fill: ball(SKIN, SKINDK), stroke: SKINLT, 'stroke-width': 2.5 }, A);
  E('path', { d: openPath(PIN.ctr.slice(5, 38).map(([x, y, nx, ny, w]) => [x - nx * w * 0.32, y - ny * w * 0.32])), fill: 'none', stroke: '#C08460', 'stroke-width': 5, 'stroke-linecap': 'round', opacity: 0.85 }, A);
  const pinOutline = E('path', { d: PIN.d, fill: 'none', stroke: C.energy, 'stroke-width': 4 }, A);
  // skin surface of the head, and the canal walls
  const skinG = E('linearGradient', { id: ID + '-skin', x1: 0, y1: 0, x2: 0, y2: 1 }, defs());
  [[0, 0], [0.16, 1], [0.84, 1], [1, 0]].forEach(([o, a]) => E('stop', { offset: o, 'stop-color': SKIN, 'stop-opacity': a }, skinG));
  E('path', { d: 'M357,140 C352,180 349,206 349,206 C345,280 341,330 341,372 M341,428 C341,470 345,520 349,594 C349,594 352,624 357,660', fill: 'none', stroke: `url(#${ID}-skin)`, 'stroke-width': 16, 'stroke-linecap': 'butt' }, A);
  E('path', { d: 'M338,372 C400,365 470,367 526,370', fill: 'none', stroke: SKIN, 'stroke-width': 5, 'stroke-linecap': 'round' }, A);
  E('path', { d: 'M338,428 C400,435 470,433 526,430', fill: 'none', stroke: SKIN, 'stroke-width': 5, 'stroke-linecap': 'round' }, A);
  // ear drum (flexes)
  const drumGhost = [-1, 1].map(s => E('path', { d: `M524,362 Q${536 + 9 * s},399 524,436`, fill: 'none', stroke: '#FFD0DC', 'stroke-width': 3, 'stroke-dasharray': '4 5', opacity: 0.55 }, A));
  const drum = E('path', { fill: 'none', stroke: '#FFD0DC', 'stroke-width': 7, 'stroke-linecap': 'round' }, A);
  // the three tiny bones: hammer (on the drum), anvil, stirrup (into the cochlea's window)
  const hammer = G(A), anvil = G(A), stirrup = G(A);
  [[12, BONEDK], [8, BONE]].forEach(([w, c]) => E('path', { d: 'M532,412 L556,356', stroke: c, 'stroke-width': w, 'stroke-linecap': 'round' }, hammer));
  E('ellipse', { cx: 563, cy: 343, rx: 13, ry: 16, fill: BONE, stroke: BONEDK, 'stroke-width': 2.5 }, hammer);
  [[11, BONEDK], [7, BONE]].forEach(([w, c]) => E('path', { d: 'M592,350 L601,401', stroke: c, 'stroke-width': w, 'stroke-linecap': 'round' }, anvil));
  E('ellipse', { cx: 590, cy: 343, rx: 15, ry: 14, fill: BONE, stroke: BONEDK, 'stroke-width': 2.5 }, anvil);
  E('path', { d: 'M607,405 Q628,385 650,391 M607,405 Q628,425 650,419', fill: 'none', stroke: BONEDK, 'stroke-width': 7, 'stroke-linecap': 'round' }, stirrup);
  E('path', { d: 'M607,405 Q628,385 650,391 M607,405 Q628,425 650,419', fill: 'none', stroke: BONE, 'stroke-width': 4, 'stroke-linecap': 'round' }, stirrup);
  E('line', { x1: 652, y1: 386, x2: 652, y2: 424, stroke: BONE, 'stroke-width': 7, 'stroke-linecap': 'round' }, stirrup);
  E('circle', { cx: 605, cy: 405, r: 6, fill: BONE, stroke: BONEDK, 'stroke-width': 2 }, stirrup);
  // cochlea: a coiled tube (2.25 turns) of fluid; base at the stirrup, nerve from the centre
  const CO = [765, 400], SP = [];
  for (let i = 0; i <= 140; i++) { const u = i / 140, th = u * 2.25 * TAU, r = lerp(96, 30, u), a = Math.PI + th; SP.push([CO[0] + r * Math.cos(a), CO[1] + r * Math.sin(a)]); }
  const spD = 'M' + SP.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join('L');
  E('path', { d: spD, fill: 'none', stroke: '#A8466E', 'stroke-width': 21, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, A);
  E('path', { d: spD, fill: 'none', stroke: '#F29BBF', 'stroke-width': 16, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, A);
  E('path', { d: spD, fill: 'none', stroke: C.water, 'stroke-width': 9, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: 0.8 }, A);
  const ripple = E('path', { d: spD, fill: 'none', stroke: '#E4FAFF', 'stroke-width': 5, 'stroke-linecap': 'round', 'stroke-dasharray': '9 21' }, A);
  const hairs = [];
  for (let i = 8; i < 136; i += 9) { const h = E('circle', { cx: SP[i][0], cy: SP[i][1], r: 4.2, fill: C.energy }, A); hairs.push({ h, i }); }
  // nerve to the brain
  const N0 = [770, 398], N1 = [836, 392], N2 = [900, 330], N3 = [968, 262];
  const nerveD = `M${N0} C${N1} ${N2} ${N3}`;
  E('path', { d: nerveD, fill: 'none', stroke: '#B88E3C', 'stroke-width': 15, 'stroke-linecap': 'round' }, A);
  E('path', { d: nerveD, fill: 'none', stroke: '#F0CF72', 'stroke-width': 9, 'stroke-linecap': 'round' }, A);
  const pulses = [];
  for (let i = 0; i < 4; i++) { const g = G(A); E('circle', { r: 20, fill: glow(C.energy) }, g); E('circle', { r: 6.5, fill: C.energyLt }, g); pulses.push(g); }
  // brain icon
  const brain = G(A); tr(brain, 1050, 230);
  const gBrain = E('ellipse', { rx: 190, ry: 160, fill: glow(C.energy) }, brain);
  const bp = []; for (let i = 0; i < 40; i++) { const a = i / 40 * TAU, k = 1 + 0.045 * Math.sin(a * 11); bp.push([Math.cos(a) * 100 * k, Math.sin(a) * 74 * k - (Math.sin(a) > 0 ? 0 : 6 * Math.sin(a))]); }
  E('path', { d: closedPath(bp), fill: ball('#F6AFC6', '#B8466A'), stroke: '#FFD6E2', 'stroke-width': 3 }, brain);
  E('path', { d: 'M-70,-20 Q-52,-46 -26,-30 T22,-36 T66,-16 M-80,18 Q-58,-4 -34,14 T12,8 T60,22 M-40,50 Q-18,30 6,46 T52,48 M0,-70 Q8,-50 -4,-34', fill: 'none', stroke: '#C9628A', 'stroke-width': 4.5, 'stroke-linecap': 'round' }, brain);
  const brainLit = E('path', { d: closedPath(bp), fill: C.energyLt, opacity: 0 }, brain);
  // the travelling highlight
  const orb = E('circle', { r: 46, fill: glow(C.energyLt) }, A);
  // labels
  const lPinna = G(A);
  T(lPinna, 40, 242, 'pinna', { size: 34, weight: 700, fill: C.energy });
  T(lPinna, 40, 274, 'the flap', { size: 24, weight: 600, fill: C.muted, font: FB });
  T(lPinna, 40, 302, 'you can see', { size: 24, weight: 600, fill: C.muted, font: FB });
  leader(lPinna, 142, 236, 206, 286, C.energy);
  const lCanal = G(A);
  T(lCanal, 440, 524, 'ear canal', { size: 30, weight: 700, anchor: 'middle' });
  leader(lCanal, 440, 496, 440, 434);
  const lDrum = labelLine(A, 506, 290, 526, 362, 'ear drum', { size: 30, weight: 700, fill: '#FFD0DC', line: '#FFD0DC' });
  const lBones = labelLine(A, 604, 236, 592, 330, 'three tiny bones', { size: 30, weight: 700, fill: BONE, line: BONE });
  const lCoch = G(A);
  T(lCoch, 765, 566, 'cochlea', { size: 32, weight: 700, anchor: 'middle', fill: '#F6AFC6' });
  T(lCoch, 765, 598, 'a coiled, fluid-filled tube', { size: 24, weight: 600, anchor: 'middle', fill: C.muted, font: FB });
  leader(lCoch, 765, 538, 765, 488, '#F6AFC6');
  const lCells = labelLine(A, 900, 520, 824, 458, 'sensitive cells', { size: 28, weight: 700, fill: C.energy, line: C.energy });
  const lNerve = T(A, 918, 404, 'nerve signals', { size: 28, weight: 700, fill: '#F0CF72' });
  const lBrain = T(A, 1050, 354, 'brain', { size: 32, weight: 700, anchor: 'middle', fill: '#F6AFC6' });
  // outer / middle / inner ear ribbon
  const ribbon = [[160, 524, 'outer ear'], [528, 662, 'middle ear'], [664, 900, 'inner ear']].map(([x0, x1, s]) => {
    const g = G(A);
    E('path', { d: `M${x0 + 4},640 L${x0 + 4},652 L${x1 - 4},652 L${x1 - 4},640`, fill: 'none', stroke: C.faint, 'stroke-width': 3, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, g);
    T(g, (x0 + x1) / 2, 686, s, { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
    return g;
  });

  /* the sound's journey: arcs travel in from the left at the wave speed (4 waves a second, slowed
     right down); the front enters on "let's follow a sound in" and reaches the pinna, the canal and
     the ear drum on their own lines */
  const LAM = 21, VEL = 84, X0 = -240, XDRUM = 522;
  const T_IN = S.first;
  const tArrive = T_IN + (XDRUM - X0) / VEL;         // the front reaches the ear drum
  const phase = (t, x) => TAU * ((X0 + VEL * (t - T_IN) - x) / LAM);   // 0 mod 2pi: a compression at x
  const ROUTE = [[[-30, 400], [190, 400]], [[190, 400], [336, 400], [516, 400]], [[528, 400], [540, 396]],
    [[540, 396], [556, 356], [590, 343], [601, 401], [652, 405], [668, 402]], SP.slice(0, 141), null];
  const nerveAt = u => cubic(N0, N1, N2, N3, u);

  /* ================= B. the frequency line ================= */
  const B = G(root);
  const fl = freqLine(B);
  op(fl.inf, 0); op(fl.ult, 0); op(fl.lInf, 0); op(fl.lUlt, 0);
  const outside = G(B);
  [[fx(2) - 50, fx(20)], [fx(20000), fx(200000) + 50]].forEach(([x0, x1]) => E('rect', { x: x0, y: FL.y - 20, width: x1 - x0, height: 40, rx: 12, fill: 'none', stroke: C.ink, 'stroke-width': 3, 'stroke-dasharray': '9 7' }, outside));
  const ghost = E('rect', { y: FL.y - FL.h / 2, height: FL.h, fill: 'none', stroke: C.good, 'stroke-width': 3, 'stroke-dasharray': '7 6' }, B);
  const ageArrow = arrow(B, fx(20000) + 4, FL.y - 38, fx(12000) + 2, FL.y - 38, { color: C.ink, width: 4 });
  const chip20 = chip(B, '20', { size: 38, fill: C.good, color: C.bg0 });
  const chip20k = chip(B, '20k', { size: 38, fill: C.good, color: C.bg0 });
  const kNote = T(B, 940, 518, 'k = thousand', { size: 30, weight: 700, fill: C.good });
  const dots20 = [fx(20), fx(20000)].map(x => E('line', { x1: x, x2: x, y1: 532, y2: FL.y - FL.h / 2 - 2, stroke: C.good, 'stroke-width': 3, 'stroke-dasharray': '5 5' }, B));
  // you, a whistle, and a dog
  const youG = G(B);
  const you = person(youG, { shirt: '#5B8DEF', hair: '#2B1D14', shorts: '#3E4F66' });
  const grey = E('path', { d: 'M-19,-178 Q-16,-198 2,-196 Q18,-195 19,-180 Q8,-188 -19,-178 Z', fill: '#DDE3E7' }, you);
  const whistle = G(you);
  E('rect', { x: 14, y: -172, width: 22, height: 9, rx: 3, fill: '#C9D6DE', stroke: '#7D8C99', 'stroke-width': 2 }, whistle);
  E('circle', { cx: 37, cy: -165, r: 7, fill: '#C9D6DE', stroke: '#7D8C99', 'stroke-width': 2 }, whistle);
  const YOU = [420, 518, 1.15];
  const pupG = G(B);
  const pup = dog(pupG);
  const PUP = [930, 518, 1.1];
  const blast = G(B), BL = [];
  for (let i = 0; i < 22; i++) BL.push(E('path', { fill: 'none', stroke: C.ethanol, 'stroke-width': 4, 'stroke-linecap': 'round' }, blast));
  const W0 = [YOU[0] + 44 * YOU[2], YOU[1] - 166 * YOU[2]], W1 = [PUP[0] - 70 * PUP[2], PUP[1] - 140 * PUP[2]];
  const marker = G(B);
  E('path', { d: `M${fx(25000)},${FL.y - FL.h / 2 - 2} l-11,-18 l22,0 Z`, fill: C.ethanol, stroke: '#E4D6FF', 'stroke-width': 2, 'stroke-linejoin': 'round' }, marker);
  E('line', { x1: fx(25000), x2: fx(25000), y1: FL.y - FL.h / 2, y2: FL.y + FL.h / 2, stroke: '#E4D6FF', 'stroke-width': 4 }, marker);
  T(marker, fx(25000) + 18, FL.y - 26, '25,000 Hz', { size: 28, weight: 700, fill: C.ethanol });
  const dogTick = tick(B, 20); const youCross = cross(B, 16);
  const realChip = chip(B, 'outside the range: still real sound', { size: 28, fill: C.card2, stroke: C.line });
  const ageChip = chip(B, 'age 10', { size: 30, fill: C.card2, stroke: C.line });
  const normal = chip(B, 'normal', { size: 30, fill: 'rgba(86,214,155,0.16)', stroke: C.good, color: C.good });

  /* ================= C. damage inside the cochlea ================= */
  const Dg = G(root);
  T(Dg, 170, 206, 'very loud', { size: 36, weight: 700, anchor: 'middle', fill: C.bad });
  const dEnergy = G(Dg);
  T(dEnergy, 186, 244, 'lots of energy', { size: 26, weight: 700, anchor: 'middle', fill: C.energy });
  const dSpark = spark(dEnergy, 13, { seed: 4 }); tr(dSpark, 68, 236);
  const loudSpk = speaker(Dg, 1); tr(loudSpk, 92, 360);
  const loudArcs = G(Dg), LA = [];
  for (let i = 0; i < 5; i++) LA.push(E('path', { fill: 'none', stroke: C.air, 'stroke-width': 6, 'stroke-linecap': 'round' }, loudArcs));
  const loudMeter = meter(Dg, { w: 230, h: 28, color: C.bad, label: 'loudness', labelSize: 26 }); tr(loudMeter, 55, 492);
  card(Dg, 330, 150, 820, 420, { fill: '#0E2633', stroke: C.line });
  T(Dg, 362, 200, 'delicate cells in the cochlea', { size: 30, weight: 700, fill: '#F6AFC6' });
  E('rect', { x: 332, y: 222, width: 816, height: 236, fill: 'rgba(76,201,240,0.09)' }, Dg);
  E('line', { x1: 350, x2: 1130, y1: 330, y2: 330, stroke: C.faint, 'stroke-width': 3, 'stroke-dasharray': '10 8' }, Dg);
  const dWave = sineWave(Dg, { w: 780, amp: 16, wl: 150, color: C.air, width: 5 }); tr(dWave, 350, 330);
  E('rect', { x: 350, y: 532, width: 780, height: 18, rx: 9, fill: '#8C4A66', stroke: '#C26A8E', 'stroke-width': 2 }, Dg);
  const CELLS = [];
  for (let i = 0; i < 8; i++) {
    const x = 400 + i * 97, g = G(Dg);
    const body = E('ellipse', { cx: x, cy: 497, rx: 27, ry: 35, fill: ball(C.cell, C.cellDk), stroke: '#FFD0DC', 'stroke-width': 2 }, g);
    const nuc = E('circle', { cx: x, cy: 506, r: 9, fill: 'rgba(150,120,220,0.65)' }, g);
    const hs = [0, 1, 2, 3, 4].map(k => ({ el: E('path', { fill: 'none', stroke: '#FFE29A', 'stroke-width': 4.5, 'stroke-linecap': 'round' }, g), bx: x - 14 + k * 7, h: 26 + k * 6 }));
    CELLS.push({ x, g, body, nuc, hs, hurt: [1, 2, 4, 6].indexOf(i) >= 0 });
  }
  const dWarn = G(Dg);
  warnSign(dWarn, 34);
  const dPerm = T(Dg, 740, 640, 'the damage can be **permanent**', { size: 32, weight: 600, anchor: 'middle', boldFill: C.bad });

  /* ================= D. protect your hearing ================= */
  const Pg = G(root);
  E('line', { x1: 40, x2: 600, y1: 640, y2: 640, stroke: C.line, 'stroke-width': 4, 'stroke-linecap': 'round' }, Pg);
  const workerG = G(Pg); tr(workerG, 215, 640, 1.75);
  const worker = person(workerG, { shirt: '#FF8A3D', shorts: '#3E4F66', hair: '#2B1D14' });
  worker.pose({ armL: [14, 12], armR: [-6, 10] });
  const muffs = G(worker);
  E('path', { d: 'M-4,-186 C-5,-199 -2,-203 3,-203', fill: 'none', stroke: '#3B4A57', 'stroke-width': 7, 'stroke-linecap': 'round' }, muffs);
  E('ellipse', { cx: -3, cy: -173, rx: 10, ry: 14, fill: ball('#E8424F', '#9C1F2B'), stroke: '#FFB3BA', 'stroke-width': 2 }, muffs);
  const jack = G(Pg), jackBody = G(jack); tr(jack, 430, 640);
  E('rect', { x: -6, y: -42, width: 12, height: 44, fill: '#B9C6D2', stroke: '#7D8C99', 'stroke-width': 2 }, jackBody);
  E('rect', { x: -27, y: -196, width: 54, height: 156, rx: 12, fill: ball('#FFC247', '#B57B12'), stroke: '#FFE29A', 'stroke-width': 2.5 }, jackBody);
  [-150, -120].forEach(y => E('rect', { x: -27, y, width: 54, height: 10, fill: '#3A2A10', opacity: 0.35 }, jackBody));
  E('rect', { x: -8, y: -214, width: 16, height: 20, fill: '#5E6A76' }, jackBody);
  E('path', { d: 'M-50,-214 L50,-214', stroke: '#5E6A76', 'stroke-width': 12, 'stroke-linecap': 'round' }, jackBody);
  E('path', { d: 'M27,-120 C70,-110 84,-36 120,0', fill: 'none', stroke: '#3B3B3B', 'stroke-width': 8, 'stroke-linecap': 'round' }, jack);
  const noise = G(Pg), NZ = [];
  [[-1, -170], [-1, -110], [1, -180], [1, -120], [1, -60]].forEach(([s, y], i) => NZ.push({ el: E('path', { fill: 'none', stroke: C.air, 'stroke-width': 4.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, noise), s, y, i }));
  const lMuffs = G(Pg);
  T(lMuffs, 40, 250, 'ear defenders', { size: 30, weight: 700, fill: '#FF9AA2' });
  leader(lMuffs, 132, 264, 200, 330, '#FF9AA2');
  const tkMuffs = tick(Pg, 18); tr(tkMuffs, 262, 238);
  const lDrill = T(Pg, 455, 694, 'loud machinery', { size: 28, weight: 700, anchor: 'middle', fill: C.muted });
  const phones = G(Pg); tr(phones, 880, 300);
  E('path', { d: 'M-84,14 C-84,-104 84,-104 84,14', fill: 'none', stroke: '#C9D6DE', 'stroke-width': 13, 'stroke-linecap': 'round' }, phones);
  [-1, 1].forEach(s => E('rect', { x: s * 84 - 24, y: -6, width: 48, height: 80, rx: 20, fill: ball('#5B8DEF', '#2B4FA8'), stroke: '#BFD6FF', 'stroke-width': 3 }, phones));
  const phArcs = G(phones), PA = [];
  [-1, 1].forEach(s => [0, 1].forEach(k => PA.push({ el: E('path', { fill: 'none', stroke: C.air, 'stroke-width': 5, 'stroke-linecap': 'round' }, phArcs), s, k })));
  const slider = G(Pg); tr(slider, 760, 470);
  E('rect', { x: 0, y: -8, width: 240, height: 16, rx: 8, fill: '#0B2230', stroke: C.line, 'stroke-width': 2 }, slider);
  const slFill = E('rect', { x: 0, y: -8, height: 16, rx: 8 }, slider);
  const knob = E('circle', { r: 18, fill: '#F2F7FA', stroke: '#8FA4B3', 'stroke-width': 3 }, slider);
  T(slider, 120, 58, 'volume', { size: 28, weight: 700, anchor: 'middle', fill: C.muted });
  const lDown = T(Pg, 880, 612, 'keep it **turned down**', { size: 30, weight: 600, anchor: 'middle', boldFill: C.good });
  const tkVol = tick(Pg, 18); tr(tkVol, 1040, 470);

  /* ================= update ================= */
  return t => {
    const tR = at('range'), tD = at('damage'), tP = at('protect');
    const aA = Math.min(P(t, T_IN - 0.15, 0.5, linear), 1 - P(t, tR - 0.25, 0.5, linear));
    const aB = Math.min(P(t, tR - 0.05, 0.5, linear), 1 - P(t, tD - 0.2, 0.5, linear));
    const aD = Math.min(P(t, tD - 0.05, 0.5, linear), 1 - P(t, tP - 0.2, 0.5, linear));
    const aP = P(t, tP - 0.05, 0.5, linear);
    op(A, aA); op(B, aB); op(Dg, aD); op(Pg, aP);

    /* ---- A: the journey in ---- */
    if (aA > 0) {
      const front = X0 + VEL * (t - T_IN);
      const dimArcs = 1 - 0.45 * P(t, at('bones'), 1.2, linear);
      const m0 = Math.max(0, Math.ceil((front - XDRUM) / LAM));
      let k = 0;
      for (let m = m0; k < ARCS.length; m++) {
        const x = front - m * LAM;
        if (x < X0) break;
        const fun = ease(clamp((x - 196) / 140)), h = lerp(76, 22, fun), rho = lerp(150, 46, fun);
        const al = Math.asin(Math.min(0.97, h / rho));
        ARCS[k].setAttribute('d', arcD(x - rho, 400, rho, -al, al));
        op(ARCS[k], dimArcs * 0.9 * Math.min(clamp((x + 50) / 40), clamp((XDRUM + 2 - x) / 10)));
        k++;
      }
      for (; k < ARCS.length; k++) op(ARCS[k], 0);

      // vibration chain, driven by the arriving wave (one push in for each compression)
      const run = P(t, tArrive - 0.2, 0.8, linear);
      const vD = run * Math.cos(phase(t, XDRUM));
      const flex = 9 * vD * (0.4 + 0.6 * calm);
      drum.setAttribute('d', `M524,362 Q${(536 + flex).toFixed(1)},399 524,436`);
      drumGhost.forEach(g => op(g, 0.6 * run * P(t, at('drum'), 0.5, linear)));
      const kB = (0.25 + 0.75 * P(t, mid('bones', 0.04), 0.5, linear));
      const vH = run * kB * Math.cos(phase(t, XDRUM) - 0.5), vA = run * kB * Math.cos(phase(t, XDRUM) - 0.9), vS = run * kB * Math.cos(phase(t, XDRUM) - 1.3);
      const amp = 0.4 + 0.6 * calm;
      hammer.setAttribute('transform', `rotate(${(-4 * vH * amp).toFixed(2)} 563 343)`);
      anvil.setAttribute('transform', `rotate(${(-4 * vA * amp).toFixed(2)} 590 343)`);
      tr(stirrup, 3.5 * vS * amp, 0);
      const flow = P(t, mid('bones', 0.5), 0.8, linear);
      op(ripple, flow);
      if (flow > 0) ripple.setAttribute('stroke-dashoffset', (-(t - mid('bones', 0.5)) * 46 * (0.4 + 0.6 * calm)).toFixed(1));
      const cellsOn = P(t, mid('nerve', 0.05), 0.5, linear);
      hairs.forEach((o, i) => op(o.h, cellsOn * (0.35 + 0.65 * wave(t, 0.7, i * 0.17))));
      const sig = P(t, mid('nerve', 0.52), 0.4, linear);
      pulses.forEach((g, i) => {
        const u = ((t - mid('nerve', 0.52)) * 0.62 + i / 4) % 1;
        if (sig <= 0 || t < mid('nerve', 0.52)) { op(g, 0); return; }
        const p = nerveAt(u); tr(g, p[0], p[1], 0.8 + 0.3 * Math.sin(u * Math.PI));
        op(g, sig * Math.min(1, u * 6, (1 - u) * 6));
      });

      // part glows: each lights as the sound reaches it, then settles to a lower glow
      const lit = (t0, f) => Math.max(0.28 * P(t, t0, 0.6, linear), (f || 1) * win(t, t0, t0 + 2.4, 0.5));
      op(gPinna, 0.55 * lit(at('pinna') + 0.1));
      op(pinOutline, 0.9 * win(t, at('pinna') + 0.1, at('drum') + 0.2, 0.4));
      op(gDrum, 0.8 * lit(Math.max(at('drum'), tArrive)));
      gBones.forEach((g, i) => op(g, 0.75 * lit(mid('bones', 0.04 + i * 0.12))));
      op(gCoch, 0.5 * lit(mid('bones', 0.5)));
      const bl = P(t, mid('nerve', 0.86), 0.5, linear);
      op(gBrain, 0.25 + 0.6 * bl); op(brainLit, 0.35 * bl * (0.7 + 0.3 * wave(t, 0.9)));

      // the travelling highlight: the front of the sound, then the vibration, then the nerve signal
      let ox = null, oy = 400, oa = 0;
      if (t < tArrive) { ox = Math.max(-30, front); oa = 0.5 * clamp((front + 40) / 80); }
      else if (t < mid('bones', 0.06)) { ox = 528; oa = 0.55; }
      else if (t < mid('bones', 0.42)) { [ox, oy] = along(ROUTE[3], P(t, mid('bones', 0.06), mid('bones', 0.42) - mid('bones', 0.06), ease)); oa = 0.55; }
      else if (t < mid('bones', 0.95)) { [ox, oy] = along(ROUTE[4], P(t, mid('bones', 0.42), mid('bones', 0.95) - mid('bones', 0.42), ease)); oa = 0.5; }
      else if (t < mid('nerve', 0.52)) { [ox, oy] = SP[140]; oa = 0.5; }
      else { [ox, oy] = nerveAt(P(t, mid('nerve', 0.52), mid('nerve', 0.9) - mid('nerve', 0.52), ease)); oa = 0.55 * (1 - P(t, mid('nerve', 0.9), 0.4, linear)); }
      op(orb, oa); if (oa > 0) tr(orb, ox, oy, 0.9 + 0.12 * wave(t, 0.8));

      // labels, in the order the sound meets the parts
      op(lPinna, P(t, mid('pinna', 0.05), 0.4, linear));
      op(lCanal, P(t, mid('pinna', 0.62), 0.4, linear));
      op(lDrum, P(t, mid('drum', 0.1), 0.4, linear));
      op(lBones, P(t, mid('bones', 0.06), 0.4, linear));
      op(lCoch, P(t, mid('bones', 0.55), 0.4, linear));
      op(lCells, P(t, mid('nerve', 0.06), 0.4, linear));
      op(lNerve, P(t, mid('nerve', 0.5), 0.4, linear));
      op(lBrain, 0.5 + 0.5 * P(t, mid('nerve', 0.8), 0.4, linear));
      op(ribbon[0], P(t, mid('pinna', 0.3), 0.5, linear));
      op(ribbon[1], P(t, mid('bones', 0.14), 0.5, linear));
      op(ribbon[2], P(t, mid('bones', 0.74), 0.5, linear));
    }

    /* ---- B: the hearing range ---- */
    if (aB > 0) {
      const sl = P(t, tR - 0.05, 0.8, easeOut);
      tr(fl, 0, (1 - sl) * 40);
      const g0 = mid('range', 0.55), grow = P(t, g0, 1.3, ease);
      const tA = at('age'), ag = P(t, mid('age', 0.12), (end('age') - at('age')) * 0.7, ease);
      const top = 20000 * Math.pow(12000 / 20000, ag);
      const f1 = grow < 1 ? 20 * Math.pow(1000, grow) : top;
      fl.setHear(20, f1); op(fl.hear, grow > 0 ? 1 : 0);
      op(fl.lHear, P(t, mid('range', 0.4), 0.4, linear));
      // you
      const yp = P(t, mid('range', 0.08), 0.6, pop);
      op(youG, clamp(yp * 2)); tr(youG, YOU[0], YOU[1] + (1 - clamp(yp)) * 20, YOU[2]);
      const blow = win(t, at('whistle') + 0.2, tA + 0.3, 0.5);
      you.pose({ armL: [8, 10], armR: [lerp(-8, 58, blow), lerp(10, 122, blow)] });
      op(whistle, P(blow, 0.85, 0.15, linear));
      op(grey, ag);
      // 20 to 20k
      const outC = 1 - P(t, at('whistle') + 0.1, 0.4, linear);
      popIn(chip20, t, mid('twenty', 0.14), fx(20), 512); op(chip20, Math.min(clamp(P(t, mid('twenty', 0.14), 0.25, linear)), outC));
      popIn(chip20k, t, mid('twenty', 0.32), fx(20000), 512); op(chip20k, Math.min(clamp(P(t, mid('twenty', 0.32), 0.25, linear)), outC));
      op(kNote, Math.min(P(t, mid('twenty', 0.6), 0.4, linear), outC));
      dots20.forEach((d, i) => op(d, Math.min(P(t, mid('twenty', 0.14 + i * 0.18), 0.4, linear), outC)));
      // outside the range: still real sound
      op(outside, win(t, mid('whistle', 0.04), mid('whistle', 0.4), 0.35) * (0.6 + 0.4 * wave(t, 0.8)));
      const rc = P(t, mid('whistle', 0.05), 0.5, pop);
      op(realChip, clamp(rc * 2) * (1 - P(t, tA - 0.1, 0.4, linear))); tr(realChip, 640, 190, 0.9 + 0.1 * rc);
      // the dog and the whistle's ultrasound
      const dIn = P(t, mid('whistle', 0.32), 0.6, easeOut), dOut = P(t, tA + 0.1, 0.5, linear);
      op(pupG, dIn * (1 - dOut)); tr(pupG, PUP[0] + (1 - dIn) * 90, PUP[1], `${-PUP[2]} ${PUP[2]}`);
      const tB0 = mid('whistle', 0.4), bOn = win(t, tB0, tA + 0.3, 0.3), VB = 260, LB = 17, dist = Math.hypot(W1[0] - W0[0], W1[1] - W0[1]);
      const ang = Math.atan2(W1[1] - W0[1], W1[0] - W0[0]), reach = (t - tB0) * VB;
      const hearsIt = P(t, tB0 + dist / VB, 0.35, easeOut);
      pup.setEars(hearsIt * (1 - dOut)); pup.wag(t, hearsIt * calm);
      const j0 = Math.max(0, Math.ceil((reach - dist) / LB));   // arcs leave the whistle every LB / VB seconds
      BL.forEach((el, i) => {
        const d = reach - (j0 + i) * LB;
        if (bOn <= 0 || d < 4 || d > dist) { op(el, 0); return; }
        const cx = W0[0] + Math.cos(ang) * (d - 30), cy = W0[1] + Math.sin(ang) * (d - 30), al = 0.5 + 0.25 * d / dist;
        el.setAttribute('d', arcD(cx, cy, 30, ang - al, ang + al));
        op(el, bOn * Math.min(1, d / 30, (dist - d) / 30) * 0.95);
      });
      const mk = P(t, mid('whistle', 0.5), 0.5, pop);
      op(marker, clamp(mk * 2) * (1 - dOut));
      popIn(dogTick, t, tB0 + dist / VB + 0.3, PUP[0] - 40, PUP[1] - 205, 0.4); op(dogTick, Math.min(clamp(P(t, tB0 + dist / VB + 0.3, 0.25, linear)), 1 - dOut));
      popIn(youCross, t, mid('whistle', 0.72), YOU[0] - 46, YOU[1] - 238, 0.4); op(youCross, Math.min(clamp(P(t, mid('whistle', 0.72), 0.25, linear)), 1 - dOut));
      // growing older
      const ac = P(t, tA - 0.1, 0.4, linear);
      op(ageChip, ac); tr(ageChip, YOU[0], YOU[1] - 290);
      setText(ageChip.label, 'age ' + Math.round(lerp(10, 60, ag) / 5) * 5);
      attr(ghost, 'x', fx(top)); attr(ghost, 'width', Math.max(0, fx(20000) - fx(top))); op(ghost, ag > 0.02 ? 1 : 0);
      ageArrow.set(P(t, mid('age', 0.2), 1.2)); op(ageArrow, P(t, mid('age', 0.2), 0.3, linear));
      const np = P(t, mid('age', 0.52), 0.5, pop); op(normal, clamp(np * 2)); tr(normal, fx(16000), FL.y - 92, 0.8 + 0.2 * np);
    }

    /* ---- C: very loud sound damages the cells ---- */
    if (aD > 0) {
      const t0 = mid('damage', 0.08), t1 = mid('damage', 0.48), calmDown = P(t, mid('damage', 0.66), 1.2, ease);
      const loud = P(t, t0 - 0.3, 0.8, easeOut) * (1 - 0.75 * calmDown);
      loudMeter.set(0.12 + 0.83 * loud);
      loudSpk.set(Math.sin(t * TAU * 5) * (0.2 + loud) * calm);
      LA.forEach((el, i) => {
        const u = ((t * 0.9) + i / LA.length) % 1, r = 20 + u * 150, al = 0.7 - 0.25 * u;
        el.setAttribute('d', arcD(118, 360, r, -al, al));
        op(el, (0.3 + 0.7 * loud) * Math.sin(u * Math.PI) * (0.4 + 0.6 * loud));
        el.setAttribute('stroke-width', (3 + 5 * loud).toFixed(1));
      });
      op(dEnergy, P(t, mid('damage', 0.18), 0.4, linear)); dSpark.upd(t);
      // the wave: big crests sweep in from the left over the cells, then the sound stops being so loud
      const frontX = lerp(300, 1180, P(t, t0, t1 - t0, linear));
      const ph = t * 1.1 * calm;
      const ampAt = x => lerp(16, 92, clamp((frontX - x) / 140)) * (1 - 0.8 * calmDown);
      let d = '';
      for (let x = 0; x <= 780; x += 6) { const X = 350 + x, y = -ampAt(X) * Math.sin(TAU * (x / 150 - ph)); d += (x ? 'L' : 'M') + x + ',' + y.toFixed(1); }
      dWave.firstChild.setAttribute('d', d);
      CELLS.forEach(c => {
        const disp = Math.sin(TAU * ((c.x - 350) / 150 - ph)), big = clamp((frontX - c.x) / 140) * (1 - 0.8 * calmDown);
        const sway = (0.12 + 0.5 * big) * disp * (0.4 + 0.6 * calm);
        const hurt = c.hurt ? P(t, t0 + (c.x - 300) / 880 * (t1 - t0) + 0.25, 0.7, ease) : 0;
        const bend = lerp(sway, 1.25, hurt);
        const col = mix('#FFE29A', '#6F7C86', hurt);
        c.hs.forEach(hh => {
          const tipX = hh.bx + hh.h * Math.sin(bend), tipY = 462 - hh.h * Math.cos(bend);
          hh.el.setAttribute('d', `M${hh.bx},462 Q${(hh.bx + hh.h * 0.45 * Math.sin(bend * 0.6)).toFixed(1)},${(462 - hh.h * 0.6).toFixed(1)} ${tipX.toFixed(1)},${tipY.toFixed(1)}`);
          hh.el.setAttribute('stroke', col);
        });
        c.body.setAttribute('fill', hurt > 0.01 ? mix('#F7A8C8', '#7E8A93', hurt * 0.85) : ball(C.cell, C.cellDk));
      });
      const wp = P(t, mid('damage', 0.6), 0.5, pop);
      op(dWarn, clamp(wp * 2)); tr(dWarn, 170, 615, Math.max(0.01, 0.6 + 0.4 * wp) * (1 + 0.05 * Math.sin(t * 5) * calm));
      op(dPerm, P(t, mid('damage', 0.7), 0.5, linear));
    }

    /* ---- D: protect your hearing ---- */
    if (aP > 0) {
      const mf = P(t, mid('protect', 0.06), 0.9, easeOut);
      tr(muffs, 0, -70 * (1 - mf)); op(muffs, P(t, mid('protect', 0.02), 0.3, linear));
      const shake = 2.2 * calm;
      tr(jackBody, Math.sin(t * 61) * shake, Math.cos(t * 47) * shake);
      NZ.forEach(n => {
        const x0 = 430 + n.s * 52, j = (Math.floor(t * 9 + n.i) % 2) ? 1 : -1, pts = [];
        for (let q = 0; q < 4; q++) pts.push(`${(x0 + n.s * q * 13).toFixed(1)},${(640 + n.y + (q % 2 ? 9 : -9) * j).toFixed(1)}`);
        n.el.setAttribute('d', 'M' + pts.join(' L'));
        op(n.el, 0.55 + 0.45 * wave(t, 0.3, n.i * 0.2));
      });
      op(lMuffs, P(t, mid('protect', 0.12), 0.4, linear));
      popIn(tkMuffs, t, mid('protect', 0.32), 262, 238, 0.4);
      op(lDrill, P(t, mid('protect', 0.2), 0.4, linear));
      const ph2 = P(t, mid('protect', 0.42), 0.5, pop);
      op(phones, clamp(ph2 * 2)); op(slider, clamp(ph2 * 2));
      const vol = lerp(0.92, 0.38, P(t, mid('protect', 0.58), 1.0, ease));
      attr(slFill, 'width', 240 * vol); slFill.setAttribute('fill', mix(C.bad, C.good, (0.92 - vol) / 0.54));
      attr(knob, 'cx', 240 * vol);
      PA.forEach(a => {
        const r = 22 + a.k * 22 + 18 * vol, al = 0.75;
        const cx = a.s * 84;
        a.el.setAttribute('d', a.s > 0 ? arcD(cx + 6, 34, r, -al, al) : arcD(cx - 6, 34, r, Math.PI - al, Math.PI + al));
        op(a.el, (0.25 + 0.75 * vol) * (0.5 + 0.5 * wave(t, 0.5, a.k * 0.5)));
        a.el.setAttribute('stroke-width', (2.5 + 5 * vol).toFixed(1));
      });
      op(lDown, P(t, mid('protect', 0.66), 0.4, linear));
      popIn(tkVol, t, mid('protect', 0.82), 1040, 470, 0.4);
    }
  };
});
