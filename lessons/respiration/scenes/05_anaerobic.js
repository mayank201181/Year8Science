/* Chapter 5: anaerobic respiration in humans.
   A sprint outruns the oxygen supply; muscle cells switch to anaerobic respiration
   (glucose -> lactic acid + a little energy); lactic acid builds up (fatigue); the
   oxygen debt is repaid while you pant; sprinter vs marathon; the exam answer. */
scene('anaerobic', S => {
  const { at, end, mid } = S, root = S.root, D = S.D;
  const GROUND = 600;

  /* ---------- local helpers ---------- */
  const SUB = {
    glucose: { fill: '#3A2C0E', stroke: C.glucose, color: C.glucoseLt },
    lactic: { fill: '#3D1630', stroke: C.lactic, color: '#FFC6DF' },
    co2: { fill: '#22303B', stroke: C.co2, color: C.co2 },
    water: { fill: '#0E3343', stroke: C.water, color: '#BDEFFF' },
    oxygen: { fill: '#3A1A18', stroke: C.oxygen, color: '#FFC4BC' },
    heat: { fill: '#3A2412', stroke: C.heat, color: '#FFD2B0' },
  };
  const sub = (parent, text, kind, w, size) => {
    const st = SUB[kind];
    return chip(parent, text, { size: size || 34, w, fill: st.fill, stroke: st.stroke, color: st.color, sw: 3 });
  };
  const vis = (t, t0, t1, f) => { f = f || 0.45; return Math.min(P(t, t0, f, linear), 1 - P(t, t1, f, linear)); };
  function popAt(el, x, y, t, t0, k) {
    const p = clamp((t - t0) / 0.5), a = clamp(p * 2.5);
    op(el, a);
    if (a > 0) tr(el, x, y, (k || 1) * Math.max(0.01, pop(p)));
  }
  function riseAt(el, x, y, t, t0, k) {
    const p = P(t, t0, 0.55, easeOut);
    op(el, p);
    if (p > 0) tr(el, x, y + (1 - p) * 20, k || 1);
  }

  /* A runner made of rounded strokes; pose(phase, run 0..1, extras) moves every joint. */
  function makeRunner(parent, o) {
    o = o || {};
    const skin = o.skin || '#E7B38C', skinDk = o.skinDk || '#B98462';
    const shirt = o.shirt || '#6C8CFF', shirtDk = o.shirtDk || '#4A64C9';
    const shorts = o.shorts || '#E8EEF6', shortsDk = o.shortsDk || '#AEB9C6';
    const g = G(parent);
    const glowA = E('ellipse', { rx: 48, ry: 60, fill: glow(C.lactic) }, g);
    const glowB = E('ellipse', { rx: 48, ry: 60, fill: glow(C.lactic) }, g);
    const line = (col, w) => E('path', { fill: 'none', stroke: col, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    const armB = line(skinDk, 15), sleeveB = line(shirtDk, 22);
    const legB = line(skinDk, 19), shortB = line(shortsDk, 27), shoeB = line('#8A97A8', 13);
    const torso = line(shirt, 46);
    const bib = G(g);
    E('rect', { x: -15, y: -13, width: 30, height: 26, rx: 4, fill: '#F4F7FA' }, bib);
    T(bib, 0, 8, o.bib || '8', { size: 21, weight: 700, fill: '#2B3A55', anchor: 'middle' });
    const head = G(g);
    E('circle', { r: 24, fill: skin }, head);
    E('path', { d: 'M-24,-2 C-25,-22 -8,-31 6,-29 C19,-27 27,-16 24,-5 C16,-13 2,-16 -10,-12 C-16,-10 -20,-6 -24,-2 Z', fill: o.hair || '#2B2320' }, head);
    E('circle', { cx: 13, cy: -3, r: 2.6, fill: '#2B2320' }, head);
    const legF = line(skin, 19), shortF = line(shorts, 27), shoeF = line('#F4F7FA', 13);
    const armF = line(skin, 15), sleeveF = line(shirt, 22);
    const R2D = Math.PI / 180;
    const pth = pts => 'M' + pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' L');
    function leg(H, p, run) {
      const hip = run * 34 * Math.sin(p);
      const bend = run * (14 + 62 * Math.max(0, Math.cos(p))) + (1 - run) * 6;
      const a1 = hip * R2D, a2 = (hip - bend) * R2D, a3 = a2 + Math.PI / 2;
      const K = [H[0] + 64 * Math.sin(a1), H[1] + 64 * Math.cos(a1)];
      const A = [K[0] + 62 * Math.sin(a2), K[1] + 62 * Math.cos(a2)];
      return {
        K, A, F: [A[0] + 20 * Math.sin(a3), A[1] + 20 * Math.cos(a3)],
        Sx: [H[0] + 30 * Math.sin(a1), H[1] + 30 * Math.cos(a1)],
        mid: [H[0] + 36 * Math.sin(a1), H[1] + 36 * Math.cos(a1)],
      };
    }
    function arm(Sh, p, run) {
      const sh = run * 42 * Math.sin(p) + (1 - run) * -4;
      const bend = run * 88 + (1 - run) * 14;
      const a1 = sh * R2D, a2 = (sh + bend) * R2D;
      const El = [Sh[0] + 46 * Math.sin(a1), Sh[1] + 46 * Math.cos(a1)];
      return { El, Wr: [El[0] + 42 * Math.sin(a2), El[1] + 42 * Math.cos(a2)], Sl: [Sh[0] + 20 * Math.sin(a1), Sh[1] + 20 * Math.cos(a1)] };
    }
    g.pose = (ph, run, x) => {
      x = x || {};
      const bob = run * 7 * Math.abs(Math.sin(ph)) + (x.breath || 0);
      const lean = (lerp(3, 13, run) + (x.lean || 0)) * R2D;
      const H = [0, -128 - bob];
      const Sh = [H[0] + 96 * Math.sin(lean), H[1] - 96 * Math.cos(lean)];
      const Hd = [Sh[0] + 36 * Math.sin(lean + 0.08), Sh[1] - 36 * Math.cos(lean + 0.08)];
      const lf = leg(H, ph, run), lb = leg(H, ph + Math.PI, run);
      const af = arm(Sh, ph + Math.PI, run), ab = arm(Sh, ph, run);
      legF.setAttribute('d', pth([H, lf.K, lf.A])); shortF.setAttribute('d', pth([H, lf.Sx])); shoeF.setAttribute('d', pth([lf.A, lf.F]));
      legB.setAttribute('d', pth([H, lb.K, lb.A])); shortB.setAttribute('d', pth([H, lb.Sx])); shoeB.setAttribute('d', pth([lb.A, lb.F]));
      armF.setAttribute('d', pth([Sh, af.El, af.Wr])); sleeveF.setAttribute('d', pth([Sh, af.Sl]));
      armB.setAttribute('d', pth([Sh, ab.El, ab.Wr])); sleeveB.setAttribute('d', pth([Sh, ab.Sl]));
      const T0 = [H[0] + 8 * Math.sin(lean), H[1] - 8 * Math.cos(lean)], T1 = [Sh[0] - 4 * Math.sin(lean), Sh[1] + 4 * Math.cos(lean)];
      torso.setAttribute('d', pth([T0, T1]));
      tr(bib, (H[0] + Sh[0]) / 2 + 4, (H[1] + Sh[1]) / 2 - 4, 1, lean / R2D);
      tr(head, Hd[0], Hd[1], 1, lean / R2D * 0.6);
      tr(glowA, lf.mid[0], lf.mid[1]); tr(glowB, lb.mid[0], lb.mid[1]);
      return { H, Sh, Hd, thigh: lf.mid, chest: [(H[0] + 2 * Sh[0]) / 3, (H[1] + 2 * Sh[1]) / 3], mouth: [Hd[0] + 22, Hd[1] + 9] };
    };
    g.glow = v => { op(glowA, v); op(glowB, v); };
    g.glow(0);
    return g;
  }

  /* ---------- the running clock: phase and distance integrated from cadence ---------- */
  const cad = t => {
    if (t < at('fatigue')) return 1.75;
    if (t < end('fatigue')) return lerp(1.7, 0.9, (t - at('fatigue')) / (end('fatigue') - at('fatigue')));
    if (t < at('sprinter')) return 0.9;
    return 1.85;
  };
  const runF = t => {
    if (t < at('debt')) return 1;
    if (t < at('sprinter')) return 1 - P(t, at('debt') + 0.2, 1.4, easeOut);
    return P(t, at('sprinter') + 0.2, 0.8);
  };
  const DT = 0.05, NT = Math.ceil((D + 3) / DT) + 2;
  const phT = new Float32Array(NT), dsT = new Float32Array(NT);
  for (let i = 1; i < NT; i++) {
    const tt = (i - 0.5) * DT, c = cad(tt), r = runF(tt);
    phT[i] = phT[i - 1] + c * DT * TAU * (0.35 + 0.65 * r);
    dsT[i] = dsT[i - 1] + c * r * DT * 250;
  }
  const look = (arr, t) => { const x = clamp(t, 0, (NT - 2) * DT) / DT, i = Math.floor(x), f = x - i; return arr[i] + (arr[i + 1] - arr[i]) * f; };
  const lacLevel = t => {
    if (t < at('fatigue')) return 0.12;
    if (t < end('fatigue')) return lerp(0.12, 0.9, ease((t - at('fatigue')) / (end('fatigue') - at('fatigue'))));
    if (t < at('pant')) return lerp(0.9, 0.5, ease(clamp((t - at('debt')) / (end('debt') - at('debt')))));
    return lerp(0.5, 0.25, ease(clamp((t - at('pant')) / (end('pant') - at('pant') + 1))));
  };

  /* ---------- track and runner ---------- */
  const track = G(root);
  E('rect', { x: 0, y: GROUND - 2, width: W, height: 80, fill: '#7E3328' }, track);
  E('rect', { x: 0, y: GROUND - 2, width: W, height: 5, fill: '#F4E9E4', opacity: 0.85 }, track);
  const lane1 = E('line', { x1: -200, y1: GROUND + 36, x2: W + 200, y2: GROUND + 36, stroke: '#F4E9E4', 'stroke-width': 4, 'stroke-dasharray': '70 50', opacity: 0.6 }, track);
  const lane2 = E('line', { x1: -200, y1: GROUND + 66, x2: W + 200, y2: GROUND + 66, stroke: '#F4E9E4', 'stroke-width': 4, 'stroke-dasharray': '70 50', opacity: 0.4 }, track);
  const marathon = makeRunner(root, { shirt: '#FFA94D', shirtDk: '#C77A26', skin: '#C68B62', skinDk: '#9C6A48', hair: '#4A3426', bib: '42' });
  const runner = makeRunner(root);

  /* ---------- beat 1: demand outruns supply ---------- */
  const gauges = G(root);
  const gsp = spark(gauges, 13); tr(gsp, 628, 236);
  T(gauges, 650, 246, 'energy demand', { size: 30, weight: 600, fill: C.energy });
  const gDemand = meter(gauges, { w: 480, h: 34, color: C.energy }); tr(gDemand, 650, 262);
  tr(molO2(gauges, 11), 626, 346);
  T(gauges, 650, 356, 'oxygen supply', { size: 30, weight: 600, fill: C.oxygen });
  const gSupply = meter(gauges, { w: 480, h: 34, color: C.oxygen }); tr(gSupply, 650, 372);
  const warn = chip(gauges, 'not enough oxygen!', { size: 30, w: 330, fill: '#3A1518', stroke: C.bad, color: '#FFC9CE' });

  /* ---------- beat 2: zoom into a muscle cell; AN-aerobic ---------- */
  const sw = G(root);
  const cone = E('path', { fill: 'rgba(207,227,238,0.09)', stroke: 'rgba(207,227,238,0.32)', 'stroke-width': 2 }, sw);
  const ringSm = E('circle', { r: 30, fill: 'none', stroke: '#CFE3EE', 'stroke-width': 5 }, sw);
  const lensC = [870, 485], LR = 132;
  const lens = G(sw);
  E('circle', { r: LR, fill: '#10293A' }, lens);
  const cp = E('clipPath', { id: 'anaLensClip' }, defs());
  E('circle', { r: LR - 6 }, cp);
  const inLens = G(lens, { 'clip-path': 'url(#anaLensClip)' });
  E('rect', { x: -200, y: -52, width: 400, height: 104, rx: 52, fill: '#B83D55', stroke: '#F08FA2', 'stroke-width': 5 }, inLens);
  for (let i = -12; i <= 12; i++) E('line', { x1: i * 16, y1: -46, x2: i * 16, y2: 46, stroke: '#8E2A40', 'stroke-width': 5, opacity: 0.7 }, inLens);
  [[-62, -16, 8], [34, 20, -6], [96, -18, 4]].forEach(([x, y, r]) => tr(mitochondrion(inLens, 54, 24), x, y, 1, r));
  const o2s = [0, 1, 2].map(() => molO2(inLens, 12));
  T(inLens, 0, 92, 'muscle cell', { size: 26, weight: 600, fill: C.muted, anchor: 'middle' });
  E('circle', { r: LR, fill: 'none', stroke: '#CFE3EE', 'stroke-width': 8 }, lens);
  const word = G(sw);
  T(word, 870, 196, '**AN**AEROBIC', { size: 66, weight: 700, anchor: 'middle', boldFill: C.energy, ls: 2 });
  const prefix = T(sw, 0, 0, 'prefix **an-** = **absent**', { size: 32, weight: 600, anchor: 'middle', boldFill: C.energy });
  const noO2 = G(sw);
  tr(molO2(noO2, 15), 0, -10);
  const noX = cross(noO2, 20); tr(noX, 0, -10);
  T(noO2, 36, 1, 'no oxygen', { size: 32, weight: 700 });

  /* ---------- beat 3-5: the equation, less energy, no CO2 ---------- */
  const eqG = G(root);
  const eqHead = T(eqG, 0, -120, 'in a muscle cell, without enough oxygen:', { size: 30, weight: 600, fill: C.muted, anchor: 'middle' });
  const cGlu = sub(eqG, 'glucose', 'glucose', 210);
  const eqArrow = arrow(eqG, -120, 0, -14, 0, { color: C.ink, width: 6 });
  const cLac = sub(eqG, 'lactic acid', 'lactic', 250);
  const eqEn = G(eqG);
  const eqSp = spark(eqEn, 14); tr(eqSp, 46, 84);
  T(eqEn, 70, 96, '+ a little energy', { size: 32, weight: 600, fill: C.energyLt });

  const lessG = G(root);
  T(lessG, 140, 340, 'aerobic', { size: 32, weight: 600 });
  const barA = meter(lessG, { w: 600, h: 36, color: C.energy }); tr(barA, 340, 312);
  const lotA = T(lessG, 958, 341, 'a lot', { size: 30, weight: 700, fill: C.energy });
  T(lessG, 140, 420, 'anaerobic', { size: 32, weight: 600 });
  const barN = meter(lessG, { w: 600, h: 36, color: C.energy }); tr(barN, 340, 392);
  const litN = T(lessG, 400, 421, 'a little', { size: 30, weight: 700, fill: C.energy });
  const split = G(lessG); tr(split, 600, 548);
  const hs = 50, c30 = Math.cos(Math.PI / 6) * hs;
  const pcs = [`M0,${-hs} L${-c30},${-hs / 2} L${-c30},${hs / 2} L0,${hs} Z`, `M0,${-hs} L${c30},${-hs / 2} L${c30},${hs / 2} L0,${hs} Z`].map(d => {
    const g = G(split);
    const a = E('path', { d, fill: ball(C.glucose, C.glucoseDk), stroke: C.glucoseDk, 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
    const b = E('path', { d, fill: ball(C.lactic, C.lacticDk), stroke: C.lacticDk, 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
    return { g, a, b };
  });
  const crack = E('path', { d: `M0,${-hs} L7,-22 L-7,0 L7,22 L0,${hs}`, fill: 'none', stroke: '#FFF6D6', 'stroke-width': 4, 'stroke-linejoin': 'round' }, split);
  const lacL = T(lessG, 498, 642, 'lactic acid', { size: 24, weight: 600, fill: C.lactic, anchor: 'middle' });
  const lacR = T(lessG, 702, 642, 'lactic acid', { size: 24, weight: 600, fill: C.lactic, anchor: 'middle' });
  const partly = T(lessG, 600, 698, 'glucose only **partly** broken down', { size: 30, weight: 600, anchor: 'middle', boldFill: C.energy });

  const nc = G(root);
  const mC = G(nc); molCO2(mC, 26); T(mC, 0, 82, 'carbon dioxide', { size: 30, weight: 600, fill: C.co2, anchor: 'middle' });
  const mW = G(nc); molH2O(mW, 30); T(mW, 0, 82, 'water', { size: 30, weight: 600, fill: C.water, anchor: 'middle' });
  const xC = cross(nc, 50), xW = cross(nc, 50);
  const just = sub(nc, 'just lactic acid', 'lactic', 310, 36);

  /* ---------- beats 6-8: fatigue, oxygen debt, panting ---------- */
  const lacMeterG = G(root);
  T(lacMeterG, 1080, 182, 'lactic acid', { size: 26, weight: 600, fill: C.lactic, anchor: 'middle' });
  const lacMeter = meter(lacMeterG, { w: 40, h: 320, vertical: true, color: C.lactic }); tr(lacMeter, 1060, 200);
  const fat = G(root);
  const f1 = T(fat, 0, 0, 'Lactic acid builds up', { size: 34, weight: 700, fill: '#FFC6DF' });
  const f2 = G(fat);
  const hw = heatWaves(f2, { n: 3, h: 40, spacing: 13, width: 4 }); tr(hw, 16, 8);
  T(f2, 50, 0, 'a burning feeling', { size: 32, weight: 600 });
  const f3 = T(fat, 0, 0, 'muscle fatigue', { size: 50, weight: 700, fill: C.lactic });
  const f4 = T(fat, 0, 0, 'tired, aching muscles', { size: 28, weight: 600, fill: C.muted });

  const debt = G(root);
  const dT = T(debt, 640, 300, 'oxygen debt', { size: 58, weight: 700, fill: C.oxygen });
  const dE = T(debt, 640, 372, 'extra oxygen needed to\nbreak down the lactic acid', { size: 30, weight: 600, lh: 40 });
  const o2Stream = G(root), o2Arr = [], rr = rng(55);
  for (let k = 0; k < 16; k++) o2Arr.push({ g: molO2(o2Stream, 14), t0: k * 0.55, y0: 300 + rr() * 170 });
  const puffs = G(root);
  const puffArr = [0, 1].map(() => E('ellipse', { rx: 18, ry: 12, fill: 'rgba(232,242,250,0.75)', stroke: '#FFFFFF', 'stroke-width': 2.5 }, puffs));
  const heart = G(root); tr(heart, 680, 560);
  const hp = G(heart);
  E('path', { d: 'M0,26 C-34,2 -40,-20 -26,-32 C-14,-42 -2,-36 0,-24 C2,-36 14,-42 26,-32 C40,-20 34,2 0,26 Z', fill: ball('#FF5C6C', '#B3263A'), stroke: '#FFC2C8', 'stroke-width': 3 }, hp);
  const bpm = T(heart, 56, 14, '175', { size: 44, weight: 700 });
  T(heart, 140, 12, 'beats per minute', { size: 26, weight: 600, fill: C.muted });

  /* ---------- beat 9: sprinter vs marathon ---------- */
  const spL = G(root), spR = G(root);
  T(spL, 300, 150, '100 m sprint', { size: 40, weight: 700, anchor: 'middle' });
  const bS = meter(spL, { w: 320, h: 30, color: C.lactic }); tr(bS, 140, 176);
  T(spL, 300, 244, 'relies **a lot** on anaerobic', { size: 26, weight: 600, anchor: 'middle', fill: C.muted, boldFill: C.lactic });
  T(spR, 880, 150, 'marathon', { size: 40, weight: 700, anchor: 'middle' });
  const bM = meter(spR, { w: 320, h: 30, color: C.lactic }); tr(bM, 720, 176);
  T(spR, 880, 244, 'mostly **aerobic**', { size: 26, weight: 600, anchor: 'middle', fill: C.muted, boldFill: C.energy });
  const never = T(root, 600, 716, 'No one can sprint flat out for very long.', { size: 30, weight: 600, anchor: 'middle' });

  /* ---------- beat 10: science today + the exam answer ---------- */
  const mod = G(root);
  const modCard = G(mod);
  card(modCard, 150, 128, 900, 250, { fill: C.card, stroke: C.line });
  const flask = G(modCard); tr(flask, 202, 176);
  E('path', { d: 'M-7,-18 L7,-18 M-4,-18 L-4,-4 L-16,16 Q-18,20 -13,20 L13,20 Q18,20 16,16 L4,-4 L4,-18', fill: 'rgba(76,201,240,0.25)', stroke: C.water, 'stroke-width': 3.5, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, flask);
  T(modCard, 232, 190, 'Science today', { size: 36, weight: 700, fill: C.energy });
  const m1 = T(mod, 196, 256, '• The burn involves other chemicals too.', { size: 30, weight: 600 });
  const m2 = T(mod, 196, 316, '• Next-day soreness is mostly tiny muscle damage.', { size: 30, weight: 600 });
  const exam = T(mod, 600, 472, 'For your exam:', { size: 42, weight: 700, anchor: 'middle' });
  const ex1 = sub(mod, 'lactic acid', 'lactic', 230), ex2 = sub(mod, 'fatigue', 'heat', 180), ex3 = sub(mod, 'oxygen debt', 'oxygen', 250);

  return t => {
    const ph = look(phT, t), dist = look(dsT, t), run = runF(t);

    /* runner + track */
    const ra = Math.max(vis(t, -1, end('switch') + 0.05, 0.4), vis(t, at('fatigue') - 0.02, at('modern')));
    op(track, ra); op(runner, ra);
    const rx = t < at('eq') ? 300 : t < at('sprinter') ? 330 : lerp(330, 300, P(t, at('sprinter'), 1));
    const rs = t < at('sprinter') ? 1 : lerp(1, 0.85, P(t, at('sprinter'), 1));
    let J = null;
    if (ra > 0) {
      lane1.setAttribute('stroke-dashoffset', (dist % 120).toFixed(1));
      lane2.setAttribute('stroke-dashoffset', ((dist + 60) % 120).toFixed(1));
      const breath = (1 - run) * 4 * wave(t, 0.62);
      J = runner.pose(ph, run, { breath, lean: (1 - run) * 6 });
      tr(runner, rx, GROUND, rs);
      runner.glow(clamp(lacLevel(t) * 1.1) * vis(t, at('fatigue'), at('sprinter') - 0.3) * (0.72 + 0.28 * wave(t, 0.7)));
    }

    /* beat 1: gauges */
    const ga = vis(t, -1, at('switch') - 0.2);
    op(gauges, ga);
    if (ga > 0) {
      gDemand.set(lerp(0.32, 0.96, P(t, at('sprint') + 0.4, 4.2)));
      gSupply.set(lerp(0.3, 0.55, P(t, at('sprint') + 0.4, 2.2)));
      gsp.upd(t);
      popAt(warn, 890, 470, t, mid('sprint', 0.55));
    }

    /* beat 2: magnify the muscle */
    const sa = vis(t, at('switch') + 0.1, end('switch') + 0.05, 0.4);
    op(sw, sa);
    if (sa > 0 && J) {
      const th = [rx + J.thigh[0] * rs, GROUND + J.thigh[1] * rs];
      attr(ringSm, 'cx', th[0]); attr(ringSm, 'cy', th[1]);
      const lp = P(t, at('switch') + 0.1, 0.7, easeOut), R = LR * (0.6 + 0.4 * lp);
      tr(lens, lensC[0], lensC[1], 0.6 + 0.4 * lp);
      const vx = lensC[0] - th[0], vy = lensC[1] - th[1], L = Math.hypot(vx, vy) || 1, nx = -vy / L, ny = vx / L;
      cone.setAttribute('d', `M${(th[0] + nx * 30).toFixed(1)},${(th[1] + ny * 30).toFixed(1)} L${(lensC[0] + nx * R).toFixed(1)},${(lensC[1] + ny * R).toFixed(1)} L${(lensC[0] - nx * R).toFixed(1)},${(lensC[1] - ny * R).toFixed(1)} L${(th[0] - nx * 30).toFixed(1)},${(th[1] - ny * 30).toFixed(1)} Z`);
      o2s.forEach((m, i) => {
        const q = ((((t - at('switch')) * 0.3 + i / 3) % 1) + 1) % 1;
        tr(m, lerp(170, 72, q), lerp(-118 + i * 12, -74 + i * 8, q), 1, q * 90);
        op(m, Math.sin(q * Math.PI) * 0.8);
      });
      riseAt(word, 0, 0, t, mid('switch', 0.33));
      riseAt(prefix, 870, 258, t, mid('switch', 0.6));
      riseAt(noO2, 770, 316, t, mid('switch', 0.84));
      const xp = P(t, mid('switch', 0.84) + 0.35, 0.35, pop);
      op(noX, clamp(xp * 2)); tr(noX, 0, -10, Math.max(0.01, xp));
    }

    /* beat 3: equation; it slides up for beats 4-5 */
    const ea = vis(t, at('eq') + 0.02, end('noco2') + 0.02, 0.42);
    op(eqG, ea);
    if (ea > 0) {
      const mv = P(t, at('less') - 0.1, 0.9);
      tr(eqG, 600, lerp(330, 172, mv), lerp(1, 0.78, mv));
      op(eqHead, P(t, at('eq'), 0.5, linear) * (1 - P(t, at('less') - 0.2, 0.4, linear)));
      popAt(cGlu, -240, 0, t, mid('eq', 0.36));
      eqArrow.set(P(t, mid('eq', 0.44), 0.5)); op(eqArrow, P(t, mid('eq', 0.44), 0.15, linear));
      popAt(cLac, 150, 0, t, mid('eq', 0.52));
      riseAt(eqEn, 0, 0, t, mid('eq', 0.76));
      eqSp.upd(t);
    }

    /* beat 4: much less energy; glucose only partly broken down */
    const la = vis(t, at('less'), at('noco2') - 0.1);
    op(lessG, la);
    if (la > 0) {
      barA.set(P(t, mid('less', 0.08), 1.6, easeOut));
      barN.set(0.07 * P(t, mid('less', 0.24), 0.8, easeOut));
      op(lotA, P(t, mid('less', 0.08) + 1.2, 0.4, linear));
      op(litN, P(t, mid('less', 0.24) + 0.6, 0.4, linear));
      const sp = P(t, mid('less', 0.6), 1.0);
      op(split, P(t, mid('less', 0.46), 0.4, linear));
      pcs.forEach((pc, i) => { const dir = i ? 1 : -1; tr(pc.g, dir * 80 * sp, 6 * sp, 1, dir * 12 * sp); op(pc.b, sp); });
      op(crack, P(t, mid('less', 0.54), 0.2, linear) * (1 - sp));
      op(lacL, P(t, mid('less', 0.6) + 0.7, 0.4, linear)); op(lacR, P(t, mid('less', 0.6) + 0.7, 0.4, linear));
      riseAt(partly, 0, 0, t, mid('less', 0.72));
    }

    /* beat 5: no carbon dioxide, no water */
    const na = vis(t, at('noco2'), end('noco2') + 0.02, 0.42);
    op(nc, na);
    if (na > 0) {
      popAt(mC, 420, 380, t, at('noco2') + 0.05);
      popAt(xC, 420, 380, t, mid('noco2', 0.3));
      popAt(mW, 780, 380, t, mid('noco2', 0.38));
      popAt(xW, 780, 380, t, mid('noco2', 0.56));
      popAt(just, 600, 572, t, mid('noco2', 0.74));
    }

    /* beat 6: lactic acid builds up -> fatigue */
    const fa = vis(t, at('fatigue'), at('debt') + 0.1);
    op(fat, fa);
    if (fa > 0) {
      riseAt(f1, 640, 250, t, at('fatigue') + 0.1);
      riseAt(f2, 640, 338, t, mid('fatigue', 0.4)); hw.upd(t);
      riseAt(f3, 640, 442, t, mid('fatigue', 0.6));
      riseAt(f4, 640, 490, t, mid('fatigue', 0.8));
    }
    const ma = vis(t, at('fatigue') + 0.1, at('sprinter') - 0.1);
    op(lacMeterG, ma);
    if (ma > 0) lacMeter.set(lacLevel(t));

    /* beat 7: oxygen debt */
    const da = vis(t, at('debt'), at('sprinter') - 0.1);
    op(debt, da);
    if (da > 0) { riseAt(dE, 0, 0, t, mid('debt', 0.12)); riseAt(dT, 0, 0, t, mid('debt', 0.62)); }
    const oa = vis(t, at('debt') + 0.3, end('pant') + 0.2);
    op(o2Stream, oa);
    if (oa > 0 && J) {
      const cx = rx + J.chest[0] * rs, cy = GROUND + J.chest[1] * rs;
      o2Arr.forEach(o => {
        const u = (t - (at('debt') + 0.5 + o.t0)) / 1.6;
        if (u <= 0 || u >= 1) { op(o.g, 0); return; }
        const p = ease(u);
        tr(o.g, lerp(-30, cx, p), lerp(o.y0, cy, p) - Math.sin(p * Math.PI) * 50, 1 - 0.4 * p, u * 160);
        op(o.g, Math.min(1, u * 5) * (1 - P(u, 0.8, 0.2, linear)));
      });
    }

    /* beat 8: panting and a pounding heart */
    const pa = vis(t, at('debt') + 1.3, end('pant') + 0.5);
    if (pa > 0 && J) {
      const mx = rx + J.mouth[0] * rs, my = GROUND + J.mouth[1] * rs;
      const t0 = at('debt') + 1.3, per = 0.62, n = Math.floor((t - t0) / per);
      puffArr.forEach((pf, j) => {
        const age = t - (t0 + (n - j) * per);
        if (n - j < 0 || age < 0 || age > 1.1) { op(pf, 0); return; }
        tr(pf, mx + age * 60, my - age * 26, 0.6 + age * 0.9);
        op(pf, pa * (1 - age / 1.1));
      });
    } else puffArr.forEach(pf => op(pf, 0));
    const hA = vis(t, mid('pant', 0.3), at('sprinter') - 0.1);
    op(heart, hA);
    if (hA > 0) {
      const t0 = at('debt'), t1 = end('pant') + 1, b0 = 175, b1 = 135;
      const u = clamp(t - t0, 0, t1 - t0), beats = (b0 * u + (b1 - b0) * u * u / (2 * (t1 - t0))) / 60;
      const q = beats % 1, pulse = Math.exp(-q * 9) + 0.5 * Math.exp(-Math.abs(q - 0.22) * 14);
      tr(hp, 0, 0, 1 + 0.14 * clamp(pulse));
      setText(bpm, String(Math.round(lerp(b0, b1, u / (t1 - t0)))));
    }

    /* beat 9: sprinter vs marathon runner */
    const spA = vis(t, at('sprinter') + 0.1, at('modern'));
    op(marathon, Math.min(spA, ra));
    if (spA > 0) {
      marathon.pose(TAU * 1.05 * (t - at('sprinter')), 0.75);
      tr(marathon, 880, GROUND, 0.85);
    }
    op(spL, spA); op(spR, Math.min(spA, P(t, mid('sprinter', 0.36), 0.45, linear)));
    if (spA > 0) {
      bS.set(0.88 * P(t, mid('sprinter', 0.1), 1.0, easeOut));
      bM.set(0.12 * P(t, mid('sprinter', 0.42), 0.8, easeOut));
    }
    op(never, P(t, mid('sprinter', 0.62), 0.5, linear) * (1 - P(t, at('modern'), 0.4, linear)));

    /* beat 10: science today + the exam answer */
    const mA = vis(t, at('modern'), D + 10);
    op(mod, mA);
    if (mA > 0) {
      riseAt(modCard, 0, 0, t, at('modern'));
      riseAt(m1, 0, 0, t, mid('modern', 0.04));
      riseAt(m2, 0, 0, t, mid('modern', 0.3));
      riseAt(exam, 0, 0, t, mid('modern', 0.6));
      popAt(ex1, 330, 570, t, mid('modern', 0.7));
      popAt(ex2, 600, 570, t, mid('modern', 0.8));
      popAt(ex3, 870, 570, t, mid('modern', 0.9));
    }
  };
});
