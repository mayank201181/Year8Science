/* Chapter 3: Reflection and the law of reflection.
   Beats: a ray bounces off a mirror -> the normal, at 90° to the surface -> measure from the normal, never
   from the surface -> incident and reflected rays -> angle of incidence i -> angle of reflection r
   -> the law: i = r -> ★ the ray box sweeps 40° -> 60° -> 30° and the reflected ray mirrors it
   -> a checklist for drawing it -> regular reflection (parallel rays stay parallel, a clear image)
   -> diffuse reflection (each bump has its own normal, so the rays scatter)
   -> a wall is not a mirror, yet eyes on opposite sides both see the paper. */
scene('reflection', S => {
  const { at, end, mid } = S, root = S.root;
  const rad = d => d * Math.PI / 180;
  const zoomAt = (el, x, y, k) => el.setAttribute('transform', `translate(${x} ${y}) scale(${k.toFixed(4)}) translate(${-x} ${-y})`);
  const bump = (t, t0, dur) => Math.sin(Math.PI * P(t, t0, dur || 0.5, linear));
  const ray = (r, p, a) => { p = clamp(p); r.set(p); op(r, p > 0.002 ? (a === undefined ? 1 : a) : 0); };   // a ray at 0 would leave a dot
  function rich(parent, x, y, segs, o) {
    o = o || {};
    const el = E('text', { x, y, 'font-size': o.size || 30, 'font-weight': o.weight || 700, 'font-family': FD, 'text-anchor': o.anchor || 'start', fill: o.fill || C.ink }, parent);
    segs.forEach(s => { if (typeof s === 'string') s = [s]; E('tspan', { fill: s[1], 'font-weight': s[2] }, el).textContent = s[0]; });
    return el;
  }

  /* ================= A. the ray diagram: mirror at y = 560, hit point O = (600, 560), rays 330 px ================= */
  const OX = 600, OY = 560, LEN = 330, SLIDE = -170;
  const dia = G(root);
  const nGlow = E('line', { x1: OX, y1: OY, x2: OX, y2: OY - 320, stroke: '#FFFFFF', 'stroke-width': 16, 'stroke-linecap': 'round' }, dia);
  const mirror = planeMirror(dia, 600); tr(mirror, OX, OY);
  T(dia, 914, 570, 'mirror', { size: 26, weight: 600, fill: C.muted });
  const nrm = normalLine(dia, OX, OY, -90, 320, { back: 0, label: 'normal' });
  const sq = E('path', { d: `M${OX},${OY - 24} L${OX + 24},${OY - 24} L${OX + 24},${OY}`, fill: 'none', stroke: C.ink, 'stroke-width': 3 }, dia);
  const sqLab = labelLine(dia, 714, 528, OX + 24, OY - 24, '90°', { size: 30 });

  // incidence angle th (from the normal): ray start a, reflected end b, ray box centre and heading
  const geo = th => { const s = Math.sin(rad(th)), c = Math.cos(rad(th)); return { a: [OX - LEN * s, OY - LEN * c], b: [OX + LEN * s, OY - LEN * c], bx: OX - 388 * s, by: OY - 388 * c, rot: 90 - th }; };
  const g40 = geo(40);
  const inc = lightRay(dia, g40.a[0], g40.a[1], OX, OY);
  const refl = lightRay(dia, OX, OY, g40.b[0], g40.b[1]);
  const box = rayBox(dia);
  const flash = E('circle', { cx: OX, cy: OY, r: 40, fill: glow(C.energy) }, dia);
  const ringO = E('circle', { cx: OX, cy: OY, r: 12, fill: 'none', stroke: C.energy, 'stroke-width': 4 }, dia);
  const dot = G(dia); E('circle', { r: 26, fill: glow('#FFFFFF') }, dot); E('circle', { r: 8, fill: '#FFFFFF' }, dot);

  // rule: measure from the normal (tick), never from the surface (cross)
  const arcGood = angleArc(dia, OX, OY, 270, 230, 92, { color: C.good, wedge: 0.16 });
  const tkGood = tick(dia, 17);
  const arcBad = angleArc(dia, OX, OY, 180, 230, 92, { color: C.bad, wedge: 0.16 });
  const xBad = cross(dia, 15);

  // names of the rays
  const labInc = labelLine(dia, 432, 488, 494, 433, 'incident ray', { size: 28 });
  const labRef = labelLine(dia, 768, 488, 706, 433, 'reflected ray', { size: 28 });

  // The two angles. Their labels are placed here with the lib's own rule (pushed out along the middle line until
  // they clear both edges), but with the text width measured once: re-measuring every frame of the sweep is slow.
  const arcI = arcFromNormal(dia, OX, OY, -90, -40, 80, { color: LT.angI });
  const arcR = arcFromNormal(dia, OX, OY, -90, 40, 80, { color: LT.angR });
  const ALW = textWidth('i = 40°', 30, FD, 700);
  const arcLab = (arc, col) => T(arc, 0, 0, '', { size: 30, weight: 700, anchor: 'middle', fill: col });
  const labI = arcLab(arcI, LT.angI), labR = arcLab(arcR, LT.angR);
  const placeLab = (lab, s, midDeg, th, prog) => {
    const half = th * Math.PI / 360, u = ltDir(midDeg);
    const need = (Math.abs(u[1]) * ALW / 2 + Math.abs(u[0]) * 30 * 0.45 + 16) / Math.max(0.05, Math.sin(half));
    const m = ltPt(OX, OY, midDeg, Math.min(80 + 140, Math.max(80 + 30, need)));
    attr(lab, 'x', m[0]); attr(lab, 'y', m[1] + 30 * 0.35); setText(lab, `${s} = ${Math.round(th)}°`); op(lab, clamp(prog * 4 - 3));
  };

  // arrowhead highlight rings for the drawing checklist
  const headRings = [0, 1].map(() => E('circle', { r: 22, fill: 'none', stroke: '#FFFFFF', 'stroke-width': 4 }, dia));

  /* ---------- side panel (stays put while the diagram slides left) ---------- */
  const side = G(root);
  const bounceChip = chip(side, 'it bounces off', { size: 30, fill: C.card2, stroke: C.energy, color: C.energy });
  tr(bounceChip, 930, 190);
  const ruleChip = chip(side, 'measure from the normal', { size: 30, fill: 'rgba(86,214,155,0.14)', stroke: C.good, color: C.ink });
  tr(ruleChip, 930, 160);
  const defI = chip(side, 'angle of incidence, i', { size: 28, fill: 'rgba(255,194,71,0.13)', stroke: LT.angI, color: C.glucoseLt });
  const defR = chip(side, 'angle of reflection, r', { size: 28, fill: 'rgba(76,201,240,0.13)', stroke: LT.angR, color: '#BDEBFA' });
  tr(defI, 935, 150); tr(defR, 935, 222);

  const PX = 1006;                                 // centre of the right-hand panel once the diagram slides left
  const lawG = G(side);
  card(lawG, 850, 126, 312, 190, { fill: C.card, stroke: C.line });
  T(lawG, PX, 178, 'angle of incidence', { size: 30, weight: 700, anchor: 'middle', fill: LT.angI });
  T(lawG, PX, 226, '=', { size: 36, weight: 700, anchor: 'middle', fill: C.muted });
  T(lawG, PX, 274, 'angle of reflection', { size: 30, weight: 700, anchor: 'middle', fill: LT.angR });
  const eqG = G(side);
  rich(eqG, 0, 0, [['i', LT.angI], [' = ', C.ink], ['r', LT.angR]], { size: 84, anchor: 'middle' });
  const rdG = G(side);
  card(rdG, 870, 452, 272, 150, { fill: C.card, stroke: C.line });
  const rdI = T(rdG, PX, 512, 'i = 40°', { size: 42, weight: 700, anchor: 'middle', fill: LT.angI });
  const rdR = T(rdG, PX, 574, 'r = 40°', { size: 42, weight: 700, anchor: 'middle', fill: LT.angR });

  const chk = G(side);
  card(chk, 838, 150, 326, 330, { fill: C.card, stroke: C.line });
  T(chk, 864, 206, 'To draw it:', { size: 32, weight: 700, fill: C.energy });
  const items = [
    { y: 278, segs: [['dashed normal']] },
    { y: 348, segs: [['arrows on rays']] },
    { y: 418, segs: [['i', LT.angI], [', '], ['r', LT.angR], [' from normal']] },
  ].map(it => {
    const g = G(chk);
    E('rect', { x: 864, y: it.y - 30, width: 38, height: 38, rx: 9, fill: '#0D2330', stroke: C.muted, 'stroke-width': 3 }, g);
    const tk = tick(g, 13); tr(tk, 883, it.y - 11);
    rich(g, 918, it.y, it.segs, { size: 29, weight: 600 });
    return { g, tk };
  });

  /* ================= B. regular and diffuse reflection: a parallel beam at 45° ================= */
  const pan = G(root);
  const SY = 560, HX = [420, 490, 560, 630, 700];
  const LIN = HX.map((x, k) => 300 + 49.5 * k);                     // incident lengths: their starts make a straight wavefront
  const STARTS = HX.map((x, k) => [x - 0.7071 * LIN[k], SY - 0.7071 * LIN[k]]);
  const RREG = LIN.map(L => 720 - L);                               // regular: every path is 720 px, so the beam leaves as one front
  const ENDREG = HX.map((x, k) => [x + 0.7071 * RREG[k], SY - 0.7071 * RREG[k]]);
  const DIR = [-155, -110, -82, -55, -22];                           // diffuse: each bump sends its ray a different way
  const TILT = DIR.map(r => (r + 45) / 2);                           // the bump tilt that does it (i = r about its own normal)
  const DLEN = [240, 185, 185, 185, 230];
  const ENDDIF = HX.map((x, k) => ltPt(x, SY, DIR[k], DLEN[k]));

  const mirB = planeMirror(pan, 520); tr(mirB, 560, SY);
  // the rough surface as a polyline: flat (y = 560) when m = 0, jagged when m = 1. Each ray lands mid-facet;
  // the bumps beyond the end rays only dip down, so the shallow scattered rays there leave cleanly.
  const FH = 24, jag = [[300, SY]], jr = rng(23), facets = [];
  const bumpPt = (x0, x1, n, downOnly) => { for (let i = 1; i <= n; i++) jag.push([lerp(x0, x1, i / (n + 1)), SY + (downOnly ? jr() * 14 : (jr() * 2 - 1) * 13)]); };
  bumpPt(300, HX[0] - FH, 3, true);
  HX.forEach((x, k) => {
    const d = ltDir(TILT[k]), a = [x - d[0] * FH, SY - d[1] * FH], b = [x + d[0] * FH, SY + d[1] * FH];
    jag.push(a, b); facets.push([a, b]);
    if (k < HX.length - 1) bumpPt(b[0], HX[k + 1] - FH, 1, false);
  });
  bumpPt(HX[4] + FH, 820, 3, true);
  jag.push([820, SY]);
  const surfD = m => 'M' + jag.map(q => q[0].toFixed(1) + ',' + lerp(SY, q[1], m).toFixed(1)).join(' L') + ` L820,${SY + 56} L300,${SY + 56} Z`;
  const paper = E('path', { d: surfD(0), fill: '#3A5568', stroke: '#C9D6DF', 'stroke-width': 4, 'stroke-linejoin': 'round' }, pan);
  const facetHi = facets.map(([a, b]) => E('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke: '#FFFFFF', 'stroke-width': 7, 'stroke-linecap': 'round' }, pan));
  const tinyN = HX.map((x, k) => normalLine(pan, x, SY, -90 + TILT[k], 74, { back: 0, dash: '7 6', width: 3 }));
  const rin = HX.map((x, k) => lightRay(pan, STARTS[k][0], STARTS[k][1], x, SY));
  const rout = HX.map((x, k) => lightRay(pan, x, SY, ENDREG[k][0], ENDREG[k][1]));
  const hitF = HX.map(x => E('circle', { cx: x, cy: SY, r: 24, fill: glow(C.energy) }, pan));

  const ttlReg = T(pan, 560, 662, 'regular reflection', { size: 44, weight: 700, anchor: 'middle', fill: C.energy });
  const subReg = T(pan, 560, 702, 'a smooth, shiny mirror', { size: 27, weight: 600, anchor: 'middle', fill: C.muted });
  const ttlDif = T(pan, 560, 662, 'diffuse reflection', { size: 44, weight: 700, anchor: 'middle', fill: C.energy });
  const subDif = T(pan, 560, 702, 'a rough surface like paper, zoomed in', { size: 27, weight: 600, anchor: 'middle', fill: C.muted });
  const parChip = chip(pan, 'parallel in, parallel out', { size: 28, fill: C.card2, stroke: C.line });
  tr(parChip, 690, 160);

  // what you see in the mirror: a crisp face
  const ins = G(pan); tr(ins, 1010, 300);
  E('rect', { x: -100, y: -120, width: 200, height: 240, rx: 28, fill: linGrad('#6A8296', '#2A3F50', true), stroke: LT.mirror, 'stroke-width': 8 }, ins);
  E('path', { d: 'M-70,-90 L-40,-90 L-84,-20 Z', fill: '#FFFFFF', opacity: 0.18 }, ins);
  E('circle', { cx: 0, cy: -4, r: 56, fill: ball('#FFD27A', '#D9962E'), stroke: '#FFE7B0', 'stroke-width': 3 }, ins);
  E('circle', { cx: -19, cy: -18, r: 7, fill: '#2B1D14' }, ins);
  E('circle', { cx: 19, cy: -18, r: 7, fill: '#2B1D14' }, ins);
  E('path', { d: 'M-26,14 Q0,40 26,14', fill: 'none', stroke: '#2B1D14', 'stroke-width': 6, 'stroke-linecap': 'round' }, ins);
  T(ins, 0, 162, 'a clear image', { size: 28, weight: 700, anchor: 'middle', fill: C.ink });

  // a wall is not a mirror
  const wall = G(pan); tr(wall, 1030, 214);
  for (let row = 0; row < 4; row++) for (let k = -1; k < 4; k++) {
    const x = -96 + k * 50 + (row % 2 ? 25 : 0), x0 = Math.max(-96, x), x1 = Math.min(96, x + 46);
    if (x1 - x0 < 10) continue;
    E('rect', { x: x0, y: -52 + row * 26, width: x1 - x0, height: 22, rx: 3, fill: ball('#C8603F', '#86331F'), stroke: '#4A2216', 'stroke-width': 1.5 }, wall);
  }
  const wallChip = chip(pan, 'not a mirror', { size: 28, fill: 'rgba(255,96,112,0.16)', stroke: C.bad });
  tr(wallChip, 1030, 300);
  // two eyes on opposite sides, each catching scattered light
  const eyePos = [ltPt(HX[0], SY, DIR[0], 290), ltPt(HX[4], SY, DIR[4], 286)];
  const eyeL = eyeIcon(pan, 1.3, { right: true }); tr(eyeL, eyePos[0][0], eyePos[0][1], 1, DIR[0] + 180);
  const eyeR = eyeIcon(pan, 1.3); tr(eyeR, eyePos[1][0], eyePos[1][1], 1, DIR[4]);
  const tkL = tick(pan, 16), tkR = tick(pan, 16);
  const anyChip = chip(pan, 'seen from any angle', { size: 30, fill: 'rgba(86,214,155,0.14)', stroke: C.good });
  tr(anyChip, 640, 200);

  return t => {
    /* ================= A ================= */
    const tReg = at('regular');
    const aA = Math.min(P(t, S.first - 0.5, 0.5, linear), 1 - P(t, tReg - 0.3, 0.5, linear));
    op(dia, aA); op(side, aA);
    if (aA > 0) {
      tr(dia, SLIDE * P(t, at('law') - 0.15, 1.1), 0);
      // the sweep: 40° -> 60° -> 30°
      const sw1 = P(t, at('sweep') + 0.15, mid('sweep', 0.38) - at('sweep') - 0.15);
      const sw2 = P(t, mid('sweep', 0.42), mid('sweep', 0.78) - mid('sweep', 0.42));
      const th = 40 + 20 * sw1 - 30 * sw2, g = geo(th);
      tr(box, g.bx, g.by, 1, g.rot);
      inc.pts([g.a, [OX, OY]]); refl.pts([[OX, OY], g.b]);

      // bounce: out of the box, a flash at O, then off the mirror
      const tB = at('bounce') + 0.2;
      const dim = 1 - 0.68 * win(t, at('normal') + 0.05, at('rule') + 0.25, 0.4);
      ray(inc, P(t, tB, 0.9, linear), dim); ray(refl, P(t, tB + 0.9, 0.9, linear), dim);
      const fl = P(t, tB + 0.85, 0.15, linear) * (1 - P(t, tB + 1.05, 0.7, linear));
      op(flash, fl); attr(flash, 'r', 18 + 40 * fl);
      op(bounceChip, win(t, mid('bounce', 0.62), at('normal') + 0.1, 0.35));

      // the normal: 90° to the surface, right where the ray hits
      nrm.set(P(t, mid('normal', 0.1), 1.1));
      const sqA = win(t, mid('normal', 0.4), at('rule') + 0.15, 0.35);
      op(sq, sqA); sqLab.set(sqA);
      const rp = clamp((t - mid('normal', 0.78)) / 0.9);
      op(ringO, rp > 0 && rp < 1 ? 1 - rp : 0); attr(ringO, 'r', 10 + 38 * rp);

      // rule: from the normal (tick) ... never from the surface (cross)
      const ruleOut = 1 - P(t, at('rays') - 0.1, 0.4, linear);
      arcGood.set(P(t, mid('rule', 0.06), 0.55)); op(arcGood, P(t, mid('rule', 0.04), 0.15, linear) * ruleOut);
      const tg = P(t, mid('rule', 0.24), 0.45, pop); op(tkGood, clamp(tg * 2) * ruleOut); tr(tkGood, 551, 420, Math.max(0.01, tg));
      op(ruleChip, win(t, mid('rule', 0.18), at('rays') + 0.3, 0.35));
      const flick = 0.55 + 0.45 * Math.abs(Math.cos((t - mid('rule', 0.56)) * 9));
      arcBad.set(P(t, mid('rule', 0.56), 0.4)); op(arcBad, P(t, mid('rule', 0.54), 0.15, linear) * ruleOut * (t < mid('rule', 0.82) ? flick : 0.7));
      const xb = P(t, mid('rule', 0.76), 0.4, pop); op(xBad, clamp(xb * 2) * ruleOut); tr(xBad, 466, 498, Math.max(0.01, xb));

      // the incident ray and the reflected ray, each named as a pulse of light runs along it
      const labOut = 1 - P(t, at('law') - 0.2, 0.4, linear);
      labInc.set(P(t, mid('rays', 0.1), 0.4, linear) * labOut);
      labRef.set(P(t, mid('rays', 0.56), 0.4, linear) * labOut);
      const u1 = clamp((t - mid('rays', 0.04)) / 1.3), u2 = clamp((t - mid('rays', 0.5)) / 1.3);
      if (u1 > 0 && u1 < 1) { tr(dot, lerp(g.a[0], OX, u1), lerp(g.a[1], OY, u1)); op(dot, Math.sin(u1 * Math.PI) * 1.4); }
      else if (u2 > 0 && u2 < 1) { tr(dot, lerp(OX, g.b[0], u2), lerp(OY, g.b[1], u2)); op(dot, Math.sin(u2 * Math.PI) * 1.4); }
      else op(dot, 0);

      // i and r, measured from the normal; they follow the sweep
      const pI = P(t, mid('inc', 0.3), 0.8), pR = P(t, mid('ref', 0.3), 0.8);
      arcI.to(OX, OY, -90, -90 - th); arcR.to(OX, OY, -90, -90 + th);
      arcI.set(pI); arcR.set(pR);
      placeLab(labI, 'i', -90 - th / 2, th, pI); placeLab(labR, 'r', -90 + th / 2, th, pR);
      const pA = 1 + 0.16 * (bump(t, mid('law', 0.5), 0.6) + bump(t, mid('draw', 0.78), 0.7));
      zoomAt(arcI, OX, OY, pA); zoomAt(arcR, OX, OY, pA);
      const defOut = 1 - P(t, at('law') - 0.2, 0.4, linear);
      const di = P(t, mid('inc', 0.52), 0.5, easeOut), dr = P(t, mid('ref', 0.52), 0.5, easeOut);
      op(defI, di * defOut); tr(defI, 935 + (1 - di) * 30, 150);
      op(defR, dr * defOut); tr(defR, 935 + (1 - dr) * 30, 222);

      // the law, then live readouts during the sweep
      const panelOut = 1 - P(t, at('draw') - 0.25, 0.4, linear);
      const lp = P(t, mid('law', 0.06), 0.6, easeOut);
      op(lawG, lp * panelOut); tr(lawG, (1 - lp) * 40, 0);
      const ep = P(t, mid('law', 0.74), 0.55, pop);
      op(eqG, clamp(ep * 2) * panelOut); tr(eqG, PX, 384 - (1 - clamp(ep)) * 50, Math.max(0.01, 0.7 + 0.3 * ep));
      op(rdG, P(t, at('sweep') + 0.05, 0.4, linear) * panelOut);
      setText(rdI, `i = ${Math.round(th)}°`); setText(rdR, `r = ${Math.round(th)}°`);
      const rk = 1 + 0.12 * (bump(t, mid('sweep', 0.8), 0.45) + bump(t, mid('sweep', 0.92), 0.45));
      zoomAt(rdI, PX, 498, rk); zoomAt(rdR, PX, 560, rk);

      // how to draw it: each item ticks as its part of the diagram pulses
      op(chk, P(t, at('draw') - 0.1, 0.45, linear));
      const tks = [0.16, 0.42, 0.72];
      items.forEach((it, k) => { const q = P(t, mid('draw', tks[k]) + 0.25, 0.45, pop); op(it.tk, clamp(q * 2)); tr(it.tk, 883, [267, 337, 407][k], Math.max(0.01, q)); });
      op(nGlow, 0.3 * bump(t, mid('draw', 0.16), 0.8));
      const hp = bump(t, mid('draw', 0.42), 0.8);
      [[g.a, [OX, OY]], [[OX, OY], g.b]].forEach(([a, b], k) => { const f = 0.574; attr(headRings[k], 'cx', lerp(a[0], b[0], f)); attr(headRings[k], 'cy', lerp(a[1], b[1], f)); attr(headRings[k], 'r', 14 + 14 * hp); op(headRings[k], hp); });
    }

    /* ================= B ================= */
    const aB = P(t, tReg - 0.25, 0.5, linear);
    op(pan, aB);
    if (aB > 0) {
      const tD = at('diffuse');
      // regular: a straight wavefront of light from the upper left, every path the same length
      const s = (t - mid('regular', 0.1)) * (720 / 2.7);
      const outFade = 1 - P(t, tD - 0.05, 0.4, linear), tSwap = tD + 0.4;
      HX.forEach((x, k) => {
        ray(rin[k], s / LIN[k]);
        if (t < tSwap) { rout[k].pts([[x, SY], ENDREG[k]]); ray(rout[k], (s - LIN[k]) / RREG[k], outFade); }
        else {
          const t0 = mid('diffuse', 0.6) + k * 0.12;
          rout[k].pts([[x, SY], ENDDIF[k]]); ray(rout[k], P(t, t0, 1.0, linear));
        }
        const hf = Math.max(bump(t, mid('regular', 0.1) + LIN[k] / (720 / 2.7) - 0.1, 0.5), bump(t, mid('diffuse', 0.6) + k * 0.12 - 0.15, 0.5));
        op(hitF[k], hf); attr(hitF[k], 'r', 14 + 16 * hf);
        const tn = mid('diffuse', 0.42) + k * 0.1;
        tinyN[k].set(P(t, tn, 0.6)); op(tinyN[k], P(t, tn - 0.05, 0.2, linear));
        op(facetHi[k], 0.85 * bump(t, tn - 0.1, 0.9));
      });
      // the mirror turns into a rough, bumpy surface (zoomed in)
      const m = P(t, tD + 0.2, 1.5);
      op(mirB, 1 - P(t, tD + 0.1, 0.5, linear));
      paper.setAttribute('d', surfD(m)); op(paper, P(t, tD + 0.1, 0.5, linear));
      const ttlA = P(t, mid('regular', 0.3), 0.5, linear) * (1 - P(t, tD - 0.05, 0.4, linear));
      op(ttlReg, ttlA); op(subReg, P(t, mid('regular', 0.04), 0.5, linear) * (1 - P(t, tD - 0.05, 0.4, linear)));
      op(ttlDif, P(t, mid('diffuse', 0.26), 0.5, linear)); op(subDif, P(t, mid('diffuse', 0.06), 0.5, linear));
      const pc = P(t, mid('regular', 0.55), 0.5, easeOut);
      op(parChip, pc * (1 - P(t, tD - 0.05, 0.4, linear))); tr(parChip, 690, 160 + (1 - pc) * 14);
      const ip = P(t, mid('regular', 0.74), 0.6, pop);
      op(ins, clamp(ip * 2) * (1 - P(t, tD - 0.05, 0.45, linear))); tr(ins, 1010, 300, Math.max(0.01, 0.6 + 0.4 * ip));

      // any angle: a wall is not a mirror, but both eyes see the paper
      const wp = P(t, mid('any', 0.04), 0.55, pop);
      op(wall, clamp(wp * 2)); tr(wall, 1030, 214, Math.max(0.01, 0.6 + 0.4 * wp));
      const wc = P(t, mid('any', 0.16), 0.45, easeOut); op(wallChip, wc); tr(wallChip, 1030, 300 + (1 - wc) * 12);
      [[eyeL, tkL, 0.48, 0.66, 0], [eyeR, tkR, 0.56, 0.74, 1]].forEach(([ey, tk, f0, f1, k]) => {
        const e = P(t, mid('any', f0), 0.5, pop); op(ey, clamp(e * 2));
        tr(ey, eyePos[k][0], eyePos[k][1], Math.max(0.01, e), k ? DIR[4] : DIR[0] + 180);
        const q = P(t, mid('any', f1), 0.45, pop); op(tk, clamp(q * 2)); tr(tk, eyePos[k][0], eyePos[k][1] - 58, Math.max(0.01, q));
      });
      const ac = P(t, mid('any', 0.82), 0.5, easeOut); op(anyChip, ac); tr(anyChip, 640, 200 + (1 - ac) * 12);
    }
  };
});
