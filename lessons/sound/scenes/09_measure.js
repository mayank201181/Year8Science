/* Chapter: Wavelength, frequency and speed.
   Beats: recap chips (frequency, amplitude) over a travelling wave: an air-particle strip lined up with
   its pressure graph (compressions sit under the crests) -> the pattern pauses: one wavelength,
   compression to compression and crest to crest, in metres -> its symbol λ -> a marker post and a
   stopwatch: one complete wave passes in one time period T -> at 5 Hz five waves pass in one (slowed-down)
   second, so each takes 1/5 s -> T = 1 ÷ f -> the wave equation, its words colour-matched -> 340 waves
   fill 340 m in one second, so each is 1 m -> showpiece: a low and a high note travel side by side at the
   same speed, but the high note's waves are packed closer. */
scene('measure', S => {
  const { at, mid } = S, root = S.root;
  const calm = S.reduce ? 0.35 : 1;
  const CF = C.good, CA = C.heat, CL = C.energy, CT = C.lactic, CV = C.air;   // frequency, amplitude, wavelength, period, speed
  const f1 = v => (+v).toFixed(1);
  const tenths = v => (Math.floor(clamp(v) * 10 + 1e-6) / 10).toFixed(1);   // a stopwatch never rounds up

  /* ---------- local helpers ---------- */
  function rich(parent, x, y, segs, o) {
    o = o || {};
    const t = E('text', { x, y, 'font-size': o.size || 30, 'font-weight': o.weight || 600, 'font-family': o.font || FD, 'text-anchor': o.anchor || 'start', fill: o.fill || C.ink }, parent);
    segs.forEach(s => { if (typeof s === 'string') s = [s]; E('tspan', { fill: s[1], 'font-weight': s[2] }, t).textContent = s[0]; });
    return t;
  }
  /* pop a group in at t0 (fade, rise, slight overshoot); returns the eased progress */
  function popIn(el, t, t0, x, y, s) { const p = P(t, t0, 0.5, pop); op(el, clamp(p * 2)); tr(el, x, y + (1 - clamp(p)) * 14, (s || 1) * (0.85 + 0.15 * p)); return p; }
  /* a row of words or symbols centred on cx; each piece [text, colour] sits in its own <g> at (x, y) */
  function row(parent, cx, y, pieces, size, gap) {
    const ws = pieces.map(p => textWidth(p[0], size, FD, 700));
    let x = cx - (ws.reduce((a, b) => a + b, 0) + gap * (pieces.length - 1)) / 2;
    return pieces.map((p, i) => {
      const g = G(parent), xc = x + ws[i] / 2;
      T(g, 0, 0, p[0], { size, weight: 700, fill: p[1], anchor: 'middle' });
      tr(g, xc, y); x += ws[i] + gap;
      return { g, x: xc, y, w: ws[i] };
    });
  }
  /* the Greek letter lambda drawn as strokes (the stage fonts have no Greek), h tall, centred */
  function lambda(parent, h, color) {
    const g = G(parent), k = h;
    E('path', { d: `M${f1(-0.3 * k)},${f1(-0.5 * k)} Q${f1(-0.1 * k)},${f1(-0.53 * k)} ${f1(-0.02 * k)},${f1(-0.3 * k)} L${f1(0.34 * k)},${f1(0.5 * k)} M${f1(0.105 * k)},${f1(0.0)} L${f1(-0.32 * k)},${f1(0.5 * k)}`, fill: 'none', stroke: color, 'stroke-width': f1(k * 0.14), 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    return g;
  }
  /* dimension line |<---->| from x1 to x2 at y; g.set(p) grows it from the middle */
  function dim(parent, x1, x2, y, color, o) {
    o = o || {};
    const g = G(parent), w = o.w || 4, hs = o.head || 12, bar = o.bar === undefined ? 12 : o.bar;
    if (bar) E('path', { d: `M${x1},${y - bar} L${x1},${y + bar} M${x2},${y - bar} L${x2},${y + bar}`, stroke: color, 'stroke-width': w, 'stroke-linecap': 'round' }, g);
    E('line', { x1: x1 + hs * 0.6, x2: x2 - hs * 0.6, y1: y, y2: y, stroke: color, 'stroke-width': w, 'stroke-linecap': 'round' }, g);
    E('path', { d: `M${x1 + 1},${y} l${hs},${f1(-hs * 0.62)} l0,${f1(hs * 1.24)} Z`, fill: color }, g);
    E('path', { d: `M${x2 - 1},${y} l${-hs},${f1(-hs * 0.62)} l0,${f1(hs * 1.24)} Z`, fill: color }, g);
    const xm = (x1 + x2) / 2;
    g.set = p => { p = clamp(p); op(g, clamp(p * 4)); g.setAttribute('transform', `translate(${xm} 0) scale(${Math.max(0.001, ease(p)).toFixed(3)} 1) translate(${-xm} 0)`); };
    g.set(0);
    return g;
  }
  /* loudspeaker: the lesson's shared look (chapters 0-2: dark box, grey cone facing right) at 1.27s,
     cone mouth at x = 58*s; g.set(dx) */
  function speaker(parent, s) {
    const g = G(parent), k = G(g), K = 'translate(2 0) scale(1.27)'; tr(k, 0, 0, s || 1);
    E('rect', { x: -46, y: -60, width: 56, height: 120, rx: 10, fill: ball('#36505F', '#16242D'), stroke: '#6F8B9B', 'stroke-width': 3 }, G(k, { transform: K }));
    const cone = G(k), kc = G(cone, { transform: K });
    E('path', { d: 'M8,-24 L44,-58 L44,58 L8,24 Z', fill: linGrad('#7D8E9A', '#C9D5DD'), stroke: '#DCE6EC', 'stroke-width': 3, 'stroke-linejoin': 'round' }, kc);
    E('path', { d: 'M8,-24 Q20,0 8,24', fill: '#5D707C', stroke: '#DCE6EC', 'stroke-width': 2.5 }, kc);
    g.set = dx => tr(cone, dx, 0);
    return g;
  }
  /* stopwatch of radius r, its dial split into fifths; g.set(turn, fills[5]) */
  function stopwatch(parent, r, color) {
    const g = G(parent);
    E('rect', { x: -9, y: -r - 17, width: 18, height: 12, rx: 3, fill: '#C9D6DE' }, g);
    E('line', { x1: 0, y1: -r - 6, x2: 0, y2: -r + 2, stroke: '#C9D6DE', 'stroke-width': 7 }, g);
    E('line', { x1: r * 0.64, y1: -r * 0.84, x2: r * 0.82, y2: -r * 1.04, stroke: '#C9D6DE', 'stroke-width': 6, 'stroke-linecap': 'round' }, g);
    E('circle', { r, fill: '#0D2330', stroke: '#C9D6DE', 'stroke-width': 5 }, g);
    const rr = r - 5, secs = [0, 1, 2, 3, 4].map(k => E('path', { fill: color, opacity: k % 2 ? 0.5 : 0.85 }, g));
    for (let k = 0; k < 5; k++) { const a = -Math.PI / 2 + k * TAU / 5; E('line', { x1: f1(Math.cos(a) * (r - 13)), y1: f1(Math.sin(a) * (r - 13)), x2: f1(Math.cos(a) * (r - 3)), y2: f1(Math.sin(a) * (r - 3)), stroke: C.muted, 'stroke-width': 3, 'stroke-linecap': 'round' }, g); }
    const hand = E('line', { x1: 0, y1: 5, x2: 0, y2: -(r - 9), stroke: C.ink, 'stroke-width': 4, 'stroke-linecap': 'round' }, g);
    E('circle', { r: 5, fill: C.ink }, g);
    g.set = (turn, fills) => {
      hand.setAttribute('transform', `rotate(${(clamp(turn) * 360).toFixed(1)})`);
      secs.forEach((el, k) => {
        const f = clamp(fills ? fills[k] : 0);
        if (f <= 0.002) { el.setAttribute('d', ''); return; }
        const a0 = -Math.PI / 2 + k * TAU / 5, a1 = a0 + f * TAU / 5;
        el.setAttribute('d', `M0,0 L${f1(Math.cos(a0) * rr)},${f1(Math.sin(a0) * rr)} A${rr},${rr} 0 0 1 ${f1(Math.cos(a1) * rr)},${f1(Math.sin(a1) * rr)} Z`);
      });
    };
    g.set(0, null);
    return g;
  }
  /* rate keys [[t, cycles per second], ...] -> the phase in cycles at time t (rates linear between keys) */
  function integ(keys) {
    const cum = [0];
    for (let i = 1; i < keys.length; i++) cum.push(cum[i - 1] + (keys[i][0] - keys[i - 1][0]) * (keys[i][1] + keys[i - 1][1]) / 2);
    return t => {
      if (t <= keys[0][0]) return keys[0][1] * (t - keys[0][0]);
      for (let i = 1; i < keys.length; i++) if (t <= keys[i][0]) {
        const [ta, ra] = keys[i - 1], [tb, rb] = keys[i], u = t - ta;
        return cum[i - 1] + ra * u + 0.5 * ((rb - ra) / ((tb - ta) || 1)) * u * u;
      }
      const n = keys.length - 1; return cum[n] + keys[n][1] * (t - keys[n][0]);
    };
  }

  /* ---------- the travelling wave: one phase drives the strip and its graph ----------
     Particle rest x0: x = x0 + A sin(2π((x0 - X0)/λ - c)). Compressions sit where (x0 - X0)/λ - c = 0.5 + n,
     and the pressure graph -cos(...) has its crests exactly there. c = 0.5 puts compressions at 430 and 770;
     a crest is at the post (x = 600) whenever c is a whole number. */
  const X0 = 90, LAM = 340, NCOL = 31, ROWS = [236, 268, 300], AX = 10, GY = 506, GAMP = 70, POST = 600;
  const tF1 = mid('measure', 0.66), tF2 = tF1 + 0.9, tR1 = at('period') + 0.05, tR2 = tR1 + 0.7;
  const rawC = integ([[0, 0.6], [tF1, 0.6], [tF2, 0], [tR1, 0], [tR2, 1]]), C0 = 0.5 - rawC(tF2);
  const cyc = t => rawC(t) + C0;
  const tCyc = k => tR2 + (k - cyc(tR2));          // when crest k reaches the post (rate is 1 cycle/s after tR2)
  const KP = 3, KF = 8;                            // the wave timed in "period"; the first of the five counted in "five"

  const back = G(root);                            // guides, glows and the post sit behind the particles
  const strip = G(root), parts = [];
  ROWS.forEach(y => { for (let i = 0; i < NCOL; i++) parts.push({ el: E('circle', { cx: X0 + i * 34, cy: y, r: 9, fill: ball(C.air, '#4E8FB8') }, strip), x0: X0 + i * 34 }); });
  const graph = G(root);
  E('line', { x1: X0, x2: X0 + 1020, y1: GY, y2: GY, stroke: C.muted, 'stroke-width': 3, 'stroke-dasharray': '10 9', opacity: 0.7 }, graph);
  const trace = sineWave(graph, { w: 1020, amp: GAMP, wl: LAM, color: CV, width: 6 }); tr(trace, X0, GY);
  const hiWave = E('path', { fill: 'none', stroke: CT, 'stroke-width': 9, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, graph);
  const axis = G(graph);
  arrow(axis, 62, 588, 62, 428, { color: C.muted, width: 3, head: 11 });
  T(axis, X0, 414, 'air pressure', { size: 26, weight: 600, fill: C.muted });

  /* ===== A. recap chips, amplitude, one wavelength, λ ===== */
  const chipF = chip(root, 'frequency (Hz)', { size: 30, fill: '#12392B', stroke: CF, color: CF, sw: 2.5 });
  const chipA = chip(root, 'amplitude', { size: 30, fill: '#3E2414', stroke: CA, color: CA, sw: 2.5 });
  const ampG = G(root);
  arrow(ampG, 770, GY - 2, 770, GY - GAMP + 3, { color: CA, width: 5, head: 15 });
  T(ampG, 770, 416, 'amplitude', { size: 28, weight: 700, fill: CA, anchor: 'middle' });
  const glowsC = [430, 770].map(x => E('ellipse', { cx: x, cy: 268, rx: 58, ry: 70, fill: glow(C.air), opacity: 0.55 }, back));
  const guides = G(back);
  [430, 770].forEach(x => E('line', { x1: x, x2: x, y1: 222, y2: 424, stroke: CL, 'stroke-width': 2.5, 'stroke-dasharray': '6 8', opacity: 0.7 }, guides));
  const dimStrip = dim(root, 430, 770, 334, CL);
  const dimGraph = dim(root, 430, 770, 412, CL);
  const wlLab = T(root, 600, 384, 'one wavelength', { size: 34, weight: 700, fill: CL, anchor: 'middle' });
  const lamG = G(root);
  const lamGlyph = lambda(lamG, 52, CL); tr(lamGlyph, 0, 0);
  T(lamG, 34, 11, 'lambda', { size: 28, weight: 600, fill: C.muted });
  const unitChip = G(root);
  { const c = chip(unitChip, '', { size: 30, w: 520, fill: C.card2, stroke: C.line, sw: 2 }); c.label.remove(); rich(unitChip, 0, 11, [['a distance, so in ', C.ink], ['metres (m)', CL, 800]], { size: 30, anchor: 'middle' }); }

  /* ===== B. marker post, stopwatch, five waves in a second ===== */
  const post = G(back);
  E('line', { x1: POST, x2: POST, y1: 198, y2: 594, stroke: '#C9D6DE', 'stroke-width': 5, 'stroke-linecap': 'round' }, post);
  const flag = E('path', { d: `M${POST},199 L${POST + 40},210 L${POST},221 Z`, fill: C.bad, stroke: '#FFB3BA', 'stroke-width': 2, 'stroke-linejoin': 'round' }, root);
  const pulse = E('circle', { cx: POST, cy: GY - GAMP, r: 34, fill: glow('#FFFFFF') }, root);
  const sign = G(root);
  T(sign, 0, -44, 'waves passed', { size: 26, weight: 600, fill: C.muted, anchor: 'middle' });
  E('rect', { x: -50, y: -28, width: 100, height: 56, rx: 12, fill: '#0D2330', stroke: CF, 'stroke-width': 3 }, sign);
  const signNum = G(sign); const signTxt = T(signNum, 0, 15, '0', { size: 42, weight: 700, fill: CF, anchor: 'middle' });
  const watch = stopwatch(root, 42, CT); tr(watch, 850, 170);
  const readG = G(root);
  const readT = T(readG, 908, 180, '', { size: 40, weight: 700, fill: CT });
  const slowT = T(readG, 908, 208, 'slowed down', { size: 24, weight: 600, fill: C.muted });
  const chip5 = chip(root, '5 Hz', { size: 32, fill: '#12392B', stroke: CF, color: CF, sw: 2.5 });
  const stP1 = rich(root, 600, 652, [['time period, T', CT, 800], [' = time for one wave to pass', C.ink]], { size: 32, anchor: 'middle' });
  const stP2 = rich(root, 600, 704, [['measured in ', C.muted], ['seconds (s)', C.ink, 800]], { size: 30, anchor: 'middle' });
  const stO1 = rich(root, 600, 652, [['frequency', CF, 800], [' = waves per second', C.ink]], { size: 32, anchor: 'middle' });
  const stO2 = rich(root, 600, 704, [['time period', CT, 800], [' = seconds per wave', C.ink]], { size: 32, anchor: 'middle' });
  const stF1 = rich(root, 600, 652, [['5 Hz', CF, 800], [': five waves pass each second', C.ink]], { size: 32, anchor: 'middle' });
  const stF2 = rich(root, 600, 704, [['so each wave takes ', C.ink], ['1/5 s = 0.2 s', CT, 800]], { size: 32, anchor: 'middle' });

  /* ===== C. T = 1 ÷ f ===== */
  const fC = G(root);
  card(fC, 290, 196, 620, 330, { fill: C.card, stroke: C.line });
  const fPieces = row(fC, 600, 336, [['T', CT], ['=', C.ink], ['1', C.ink], ['÷', C.ink], ['f', CF]], 96, 26);
  const fWords = rich(fC, 600, 408, [['time period', CT, 700], [' = 1 ÷ ', C.ink], ['frequency', CF, 700]], { size: 32, anchor: 'middle' });
  const fEx = G(fC);
  E('line', { x1: 350, x2: 850, y1: 438, y2: 438, stroke: C.line, 'stroke-width': 2 }, fEx);
  rich(fEx, 600, 486, [['f = 5 Hz', CF, 800], ['   →   ', C.muted], ['T = 1/5 s', CT, 800]], { size: 34, anchor: 'middle' });

  /* ===== D. the wave equation (later a row across the top) ===== */
  const eqCard = G(root);
  card(eqCard, 90, 214, 1020, 250, { fill: C.card, stroke: C.line });
  const eqTitle = T(eqCard, 600, 272, 'the wave equation', { size: 32, weight: 600, fill: C.muted, anchor: 'middle' });
  const EQY = 380, ROWY = 150, ROWS_K = 0.7;
  const eqRow = G(root);
  const eqP = row(eqRow, 600, EQY, [['speed', CV], ['=', C.ink], ['frequency', CF], ['×', C.ink], ['wavelength', CL]], 58, 24);
  const eqStart = { 0: [eqP[0].x - 46, EQY - 46], 2: [eqP[2].x, EQY + 34], 4: [eqP[4].x + 46, EQY - 46] };   // loose, then linked in a row
  const rowX = i => 600 + (eqP[i].x - 600) * ROWS_K;
  const valG = [0, 2, 4].map(i => G(root));
  const VALS = [['340 m/s', CV], ['340 Hz', CF], ['1 m', CL]];
  valG.forEach((g, k) => { T(g, 0, 0, VALS[k][0], { size: 32, weight: 700, fill: VALS[k][1], anchor: 'middle' }); });
  const noteG = [0, 2, 4].map(i => G(root));
  [['the same', CV], ['higher', CF], ['shorter', CL]].forEach(([s, c], k) => T(noteG[k], 0, 0, s, { size: 30, weight: 700, fill: c, anchor: 'middle' }));
  const noteArr = [null, arrow(noteG[1], 62, 4, 62, -22, { color: CF, width: 4, head: 11 }), arrow(noteG[2], 70, -24, 70, 2, { color: CL, width: 4, head: 11 })];

  /* ===== E. 340 waves fill 340 m in one second ===== */
  const Eg = G(root);
  const SPX = 120, SPY = 440, TX0 = 190, TX1 = 1080, TY0 = 388, TY1 = 492, NW = 340, SP = (TX1 - TX0) / NW;
  const spk = speaker(Eg, 1); tr(spk, SPX, SPY);
  const clipId = 'measureTrainClip';
  const clipRect = E('rect', { x: TX0 - 4, y: TY0 - 10, width: 0, height: TY1 - TY0 + 20 }, E('clipPath', { id: clipId }, defs()));
  let dTrain = '';
  for (let i = 0; i < NW; i++) dTrain += `M${f1(TX0 + (i + 0.5) * SP)},${TY0}V${TY1}`;
  const train = G(Eg, { 'clip-path': `url(#${clipId})` });
  E('path', { d: dTrain, stroke: CV, 'stroke-width': 1.3, opacity: 0.9 }, train);
  const front = G(Eg);
  E('ellipse', { cx: 0, cy: (TY0 + TY1) / 2, rx: 26, ry: 70, fill: glow(CV), opacity: 0.8 }, front);
  E('line', { x1: 0, x2: 0, y1: TY0 - 6, y2: TY1 + 6, stroke: '#E6F5FF', 'stroke-width': 4, 'stroke-linecap': 'round' }, front);
  const ePost = G(Eg);
  E('line', { x1: TX1, x2: TX1, y1: 362, y2: 524, stroke: '#C9D6DE', 'stroke-width': 5, 'stroke-linecap': 'round' }, ePost);
  const eFlag = E('path', { d: `M${TX1},363 L${TX1 + 38},374 L${TX1},385 Z`, fill: C.bad, stroke: '#FFB3BA', 'stroke-width': 2, 'stroke-linejoin': 'round' }, ePost);
  const eDim = dim(Eg, TX0, TX1, 562, C.muted, { w: 3, head: 11 });
  T(Eg, (TX0 + TX1) / 2, 606, '340 m', { size: 32, weight: 700, fill: C.ink, anchor: 'middle' });
  const eWatch = stopwatch(Eg, 38, CV); tr(eWatch, TX1, 286);
  const eRead = T(Eg, TX1 - 54, 298, '0.0 s', { size: 36, weight: 700, fill: CV, anchor: 'end' });
  T(Eg, TX1 - 54, 328, 'slowed down', { size: 24, weight: 600, fill: C.muted, anchor: 'end' });
  T(Eg, SPX, 300, 'waves sent', { size: 26, weight: 600, fill: C.muted, anchor: 'middle' });
  const eCount = T(Eg, SPX, 348, '0', { size: 44, weight: 700, fill: CF, anchor: 'middle' });
  const lensClip = 'measureLensClip';
  E('circle', { cx: 0, cy: 0, r: 64 }, E('clipPath', { id: lensClip }, defs()));
  const lens = G(Eg);
  E('line', { x1: 50, y1: 50, x2: 92, y2: 92, stroke: '#C9D6DE', 'stroke-width': 18, 'stroke-linecap': 'round' }, lens);
  E('circle', { r: 68, fill: '#0B2230' }, lens);
  const lensIn = G(lens, { 'clip-path': `url(#${lensClip})` });
  [-126, -42, 42, 126].forEach(x => E('line', { x1: x, x2: x, y1: -70, y2: 70, stroke: CV, 'stroke-width': 6 }, lensIn));
  dim(lensIn, -42, 42, -12, CL, { w: 4, head: 10, bar: 0 }).set(1);
  T(lensIn, 0, 36, '1 m', { size: 32, weight: 700, fill: CL, anchor: 'middle' });
  E('circle', { r: 68, fill: 'none', stroke: '#E4EDF2', 'stroke-width': 9 }, lens);
  E('path', { d: 'M-46,-24 A52,52 0 0 1 -12,-52', stroke: '#ffffff', 'stroke-width': 5, fill: 'none', opacity: 0.45, 'stroke-linecap': 'round' }, lens);
  const lensLab = T(Eg, 640, 352, 'one wave', { size: 28, weight: 700, fill: CL, anchor: 'middle' });

  /* ===== F. showpiece: same speed, so higher frequency = shorter wavelength ===== */
  const Fg = G(root);
  const LX0 = 160, LX1 = 1130, V = 190, LANES = [{ y: 332, f: 1.25, n: 8, name: 'low note', pair: 3 }, { y: 562, f: 3.2, n: 18, name: 'high note', pair: 9 }];
  const tL = mid('shorter', 0.04), tS = tL + 5.25, DEC = 0.8;
  const tau = t => { if (t <= tL) return 0; if (t <= tS) return t - tL; const u = Math.min(t - tS, DEC); return (tS - tL) + u - u * u / (2 * DEC); };
  LANES.forEach(L => {
    L.g = G(Fg);
    E('rect', { x: 150, y: L.y - 64, width: 1000, height: 128, rx: 20, fill: 'rgba(159,216,255,0.05)', stroke: C.line, 'stroke-width': 2 }, L.g);
    L.spk = speaker(L.g, 0.72); tr(L.spk, 100, L.y);
    T(L.g, 100, L.y - 80, L.name, { size: 28, weight: 700, fill: C.ink, anchor: 'middle' });
    L.arcs = []; for (let k = 0; k < L.n; k++) L.arcs.push(E('path', { fill: 'none', stroke: CV, 'stroke-width': 4.5, 'stroke-linecap': 'round' }, L.g));
    L.lam = V / L.f;
    L.br = G(L.g);
    dim(L.br, 7, L.lam - 1, 0, CL, { w: 4, head: 10, bar: 0 }).set(1);
    const lg = lambda(L.br, 28, CL); tr(lg, L.lam / 2 + 2, -24);
  });
  const fronts = G(Fg);
  E('line', { x1: 0, x2: 0, y1: 268, y2: 626, stroke: C.ink, 'stroke-width': 3, 'stroke-dasharray': '8 8', opacity: 0.75 }, fronts);
  const sameChip = chip(fronts, 'same speed', { size: 28, fill: '#0F2C3A', stroke: CV, color: CV, sw: 2.5 }); tr(sameChip, 0, 447);
  const bottomLab = rich(Fg, 600, 700, [['higher frequency', CF, 800], ['  →  ', C.muted], ['shorter wavelength', CL, 800]], { size: 36, anchor: 'middle' });

  /* ================= update ================= */
  return t => {
    t = Math.min(t, S.D);                       // hold the final frame beyond the chapter's end
    const c = cyc(t);

    /* --- strip and graph: from the start until the formula --- */
    const aW = P(t, S.first - 0.6, 0.6, linear) * (1 - P(t, at('formula') - 0.2, 0.5, linear));
    op(strip, aW); op(graph, P(t, mid('measure', 0.2), 0.6, linear) * aW);
    if (aW > 0) {
      parts.forEach(p => attr(p.el, 'cx', p.x0 + AX * Math.sin(TAU * ((p.x0 - X0) / LAM - c))));
      trace.set({ phase: c + 0.25 });
      op(axis, P(t, mid('measure', 0.3), 0.5, linear));
      // one complete wave, highlighted as it passes the post during "period"
      const hv = win(t, tCyc(KP - 0.45), tCyc(KP + 1.3), 0.3);
      op(hiWave, hv);
      if (hv > 0) {
        const xa = clamp(POST + LAM * (c - KP - 1) - X0, 0, 1020), xb = clamp(POST + LAM * (c - KP) - X0, 0, 1020);
        let d = '';
        for (let x = xa; x <= xb + 0.01; x += 4) d += (d ? 'L' : 'M') + f1(X0 + x) + ',' + f1(GY - GAMP * Math.sin(TAU * (x / LAM - c - 0.25)));
        hiWave.setAttribute('d', d || 'M0,0');
      }
    }

    /* --- A: chips, amplitude, wavelength --- */
    const outA = 1 - P(t, at('length') + 0.1, 0.45, linear);
    const pF = popIn(chipF, t, mid('measure', 0.74), 440, 150); op(chipF, clamp(pF * 2) * outA);
    const pA = popIn(chipA, t, mid('measure', 0.87), 770, 150); op(chipA, clamp(pA * 2) * outA);
    op(ampG, P(t, mid('measure', 0.88), 0.4, linear) * outA);
    const outL = 1 - P(t, at('period'), 0.45, linear);
    glowsC.forEach((g, i) => op(g, P(t, mid('length', 0.42), 0.5, linear) * outL * (0.7 + 0.3 * wave(t, 1.6, i * 0.5))));
    dimGraph.set(P(t, mid('length', 0.2), 0.7)); op(dimGraph, P(t, mid('length', 0.2), 0.3, linear) * outL);
    dimStrip.set(P(t, mid('length', 0.46), 0.7)); op(dimStrip, P(t, mid('length', 0.46), 0.3, linear) * outL);
    op(guides, P(t, mid('length', 0.6), 0.5, linear) * outL);
    const lamIn = P(t, at('lambda') + 0.15, 0.4, linear);
    op(wlLab, P(t, mid('length', 0.08), 0.4, linear) * (1 - lamIn));
    const pl = P(t, at('lambda') + 0.2, 0.55, pop);
    op(lamG, clamp(pl * 2) * outL); tr(lamG, 586, 372, 0.6 + 0.4 * pl);
    const pu = P(t, mid('length', 0.8), 0.5, pop);
    op(unitChip, clamp(pu * 2) * outL); tr(unitChip, 600, 664 + (1 - clamp(pu)) * 14);

    /* --- B: post, stopwatch, five waves --- */
    const aB = P(t, at('period') + 0.2, 0.5, linear) * (1 - P(t, at('formula') - 0.2, 0.5, linear));
    op(post, aB); op(flag, aB * (1 - P(t, at('five'), 0.4, linear)));
    const ws = popIn(watch, t, at('period') + 0.6, 850, 170); op(watch, clamp(ws * 2) * aB);
    // stopwatch: one wave in "period" (one fifth of a turn), then five waves in one second in "five"
    const inFive = t >= at('five') - 0.05;
    if (!inFive) watch.set(0.2 * clamp(c - KP), [c - KP, 0, 0, 0, 0]);
    else {
      const reset = P(t, at('five') - 0.05, 0.5, linear), u = clamp((c - KF) / 5);
      if (t < tCyc(KF)) watch.set(0.2 * (1 - reset), [1 - reset, 0, 0, 0, 0]);
      else watch.set(u, [0, 1, 2, 3, 4].map(k => c - KF - k));
    }
    op(readG, aB);
    if (!inFive) { setText(readT, c >= KP + 1 ? 'T' : ''); op(readT, P(t, tCyc(KP + 1), 0.3, linear)); op(slowT, 0); }
    else { setText(readT, tenths((c - KF) / 5) + ' s'); op(readT, P(t, at('five') + 0.3, 0.4, linear)); op(slowT, P(t, at('five') + 0.5, 0.4, linear)); }
    // a ring pulses where each timed crest meets the post
    let pr = 0;
    [KP, KP + 1, KF, KF + 1, KF + 2, KF + 3, KF + 4, KF + 5].forEach(k => { const u = (t - tCyc(k)) / 0.4; if (u >= 0 && u < 1) pr = Math.max(pr, 1 - u); });
    op(pulse, pr * aB * 0.9);
    const sp = popIn(sign, t, at('five') + 0.1, POST, 178); op(sign, clamp(sp * 2) * aB);
    const nPassed = clamp(Math.floor(c - KF + 1e-6), 0, 5);
    setText(signTxt, String(nPassed));
    const bump = nPassed > 0 ? 1 - P(t, tCyc(KF + nPassed), 0.3, linear) : 0;
    tr(signNum, 0, 0, 1 + 0.25 * bump);
    const c5 = popIn(chip5, t, mid('five', 0.25), 418, 178); op(chip5, clamp(c5 * 2) * aB);
    op(stP1, P(t, mid('period', 0.14), 0.4, linear) * (1 - P(t, at('five') - 0.1, 0.35, linear)));
    op(stP2, P(t, mid('period', 0.84), 0.4, linear) * (1 - P(t, at('five') - 0.1, 0.35, linear)));
    op(stO1, win(t, at('five') + 0.15, mid('five', 0.36), 0.35) * aB);
    op(stO2, win(t, at('five') + 0.45, mid('five', 0.82), 0.35) * aB);
    op(stF1, P(t, mid('five', 0.36), 0.4, linear) * aB);
    op(stF2, P(t, mid('five', 0.82), 0.4, linear) * aB);

    /* --- C: T = 1 ÷ f --- */
    const aC = P(t, at('formula') - 0.1, 0.45, linear) * (1 - P(t, at('equation') - 0.15, 0.45, linear));
    op(fC, aC);
    if (aC > 0) {
      fPieces.forEach((q, i) => popIn(q.g, t, mid('formula', [0.04, 0.14, 0.22, 0.3, 0.4][i]), q.x, q.y));
      op(fWords, P(t, mid('formula', 0.55), 0.45, linear));
      op(fEx, P(t, mid('formula', 0.8), 0.45, linear));
    }

    /* --- D: the wave equation gathers, then becomes a row across the top --- */
    const mv = P(t, at('metre') + 0.05, 0.9);
    op(eqCard, P(t, at('equation') - 0.1, 0.45, linear) * (1 - P(t, at('metre') - 0.05, 0.5, linear)));
    op(eqTitle, P(t, mid('equation', 0.38), 0.4, linear));
    const ry = lerp(EQY, ROWY, mv), rs = lerp(1, ROWS_K, mv);
    eqRow.setAttribute('transform', `translate(600 ${f1(ry)}) scale(${rs.toFixed(3)}) translate(-600 ${-EQY})`);
    op(eqRow, P(t, at('equation') - 0.1, 0.3, linear));
    const spoken = [0.6, 0.68, 0.74, 0.83, 0.88];
    eqP.forEach((q, i) => {
      if (eqStart[i]) {
        const a = P(t, mid('equation', [0.04, 0, 0.12, 0, 0.2][i]), 0.45, pop), g = P(t, mid('equation', spoken[i]) - 0.25, 0.6);
        const [sx, sy] = eqStart[i];
        op(q.g, clamp(a * 2)); tr(q.g, lerp(sx, q.x, g), lerp(sy, q.y, g), lerp(0.8, 1, g) * (0.85 + 0.15 * a));
      } else popIn(q.g, t, mid('equation', spoken[i]), q.x, q.y);
    });
    const valOut = 1 - P(t, at('shorter') - 0.45, 0.4, linear);
    valG.forEach((g, k) => { const p = popIn(g, t, mid('metre', [0.62, 0.3, 0.92][k]), rowX(k * 2), 206); op(g, clamp(p * 2) * valOut); });
    noteG.forEach((g, k) => { const p = popIn(g, t, mid('shorter', [0.2, 0.58, 0.8][k]), rowX(k * 2) - (k ? 14 : 0), 206); op(g, clamp(p * 2)); if (noteArr[k]) noteArr[k].set(P(t, mid('shorter', [0.2, 0.58, 0.8][k]) + 0.2, 0.4)); });

    /* --- E: one second of a 340 Hz note --- */
    const aE = P(t, at('metre') + 0.35, 0.5, linear) * (1 - P(t, at('shorter') - 0.45, 0.4, linear));
    op(Eg, aE);
    if (aE > 0) {
      const tE0 = mid('metre', 0.13), tE1 = mid('metre', 0.72), pe = clamp((t - tE0) / (tE1 - tE0));
      const xf = TX0 + (TX1 - TX0) * pe;
      attr(clipRect, 'width', xf - TX0 + 4);
      tr(front, xf, 0); op(front, (t > tE0 ? 1 : 0) * (1 - P(t, tE1, 0.4, linear)));
      spk.set(t > tE0 && t < tE1 + 0.6 ? 5 * calm * Math.sin(TAU * 6 * (t - tE0)) : 0);
      eWatch.set(pe, [0, 1, 2, 3, 4].map(k => pe * 5 - k));
      setText(eRead, tenths(pe) + ' s');
      setText(eCount, String(Math.round(NW * pe)));
      eDim.set(P(t, at('metre') + 0.3, 0.7));
      const arrive = P(t, tE1, 0.5, linear) * (1 - P(t, tE1 + 0.5, 0.6, linear));
      eFlag.setAttribute('fill', arrive > 0.05 ? C.energy : C.bad);
      const lp = P(t, mid('metre', 0.8), 0.55, pop);
      op(lens, clamp(lp * 2)); tr(lens, 640, 440, 0.6 + 0.4 * lp);
      op(lensLab, P(t, mid('metre', 0.84), 0.4, linear));
    }

    /* --- F: two notes, same speed --- */
    const aF = P(t, at('shorter') - 0.05, 0.45, linear);
    op(Fg, aF);
    if (aF > 0) {
      const tu = tau(t), on = P(t, tL - 0.3, 0.3, linear);
      LANES.forEach(L => {
        L.spk.set(5 * calm * on * Math.cos(TAU * L.f * tu));
        const nMax = Math.floor(tu * L.f + 1e-9);
        L.arcs.forEach((el, k) => {
          const n = nMax - k, x = LX0 + V * (tu - n / L.f);
          if (t < tL || n < 0 || x > LX1) { op(el, 0); return; }
          el.setAttribute('d', `M${f1(x - 7)},${L.y - 48} Q${f1(x + 13)},${L.y} ${f1(x - 7)},${L.y + 48}`);
          op(el, Math.min(1, (x - LX0) / 24 + 0.15, (LX1 - x) / 40));
        });
        const xb = LX0 + V * (tu - (L.pair + 1) / L.f);
        op(L.br, P(t, mid('shorter', 0.7), 0.4, linear) * (xb > LX0 ? 1 : 0)); tr(L.br, xb, L.y);
      });
      const xf = LX0 + V * tau(t);
      tr(fronts, Math.min(xf, LX1), 0);
      op(fronts, P(t, mid('shorter', 0.12), 0.4, linear) * (1 - P(t, tL + (LX1 - LX0) / V - 0.3, 0.4, linear)));
      op(bottomLab, P(t, mid('shorter', 0.62), 0.45, linear));
    }
  };
});
