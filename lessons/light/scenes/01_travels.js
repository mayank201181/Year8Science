/* Chapter 1, How light travels and how we see.
   Beats: a lamp switches on and straight rays shoot out in every direction -> one ray redrawn as an arrow, then a
   beam of six parallel rays -> a counter rolls up to 300,000 km/s = 3 × 10⁸ m/s -> a pulse of light laps the Earth
   7½ times while a timer runs to 1 second -> a firework's flash reaches a person at once, its bang arrives late
   -> luminous: the Sun, a lamp, a flame, a glowing screen -> non-luminous: a book, an apple, you, in flat grey
   -> lamp → apple → eye: the apple lights up red as the ray lands (showpiece) -> light goes source → object → eye;
   the wrong idea (eyes send light out) is crossed out -> the Moon, lit on its Sun-facing side, reflects sunlight to
   a person on Earth. */
scene('travels', S => {
  const { at, end, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;

  /* ---------- local helpers ---------- */
  function rich(parent, x, y, segs, o) {
    o = o || {};
    const t = E('text', { x, y, 'font-size': o.size || 30, 'font-weight': o.weight || 600, 'font-family': o.font || FD, 'text-anchor': o.anchor || 'start', fill: o.fill || C.ink }, parent);
    segs.forEach(s => { if (typeof s === 'string') s = [s]; E('tspan', { fill: s[1], 'font-weight': s[2] }, t).textContent = s[0]; });
    return t;
  }
  const appleD = r => `M0,${-r * 0.62} C${r * 0.5},${-r * 1.05} ${r * 1.12},${-r * 0.72} ${r * 1.02},${r * 0.05} C${r * 0.95},${r * 0.75} ${r * 0.45},${r * 1.05} 0,${r * 0.88} C${-r * 0.45},${r * 1.05} ${-r * 0.95},${r * 0.75} ${-r * 1.02},${r * 0.05} C${-r * 1.12},${-r * 0.72} ${-r * 0.5},${-r * 1.05} 0,${-r * 0.62} Z`;
  // a red apple about 2r across, centred; g.lit(v): 0 flat unlit grey .. 1 red
  function appleArt(parent, r) {
    const g = G(parent);
    const parts = (body, shine, stem, leaf, leafDk) => {
      const q = G(g);
      E('path', { d: appleD(r), fill: body, stroke: shine ? '#FFB3B5' : '#8C96A0', 'stroke-width': 2.5 }, q);
      if (shine) E('path', { d: `M${-r * 0.55},${-r * 0.35} Q${-r * 0.7},${-r * 0.05} ${-r * 0.58},${r * 0.2}`, fill: 'none', stroke: '#FFFFFF', 'stroke-width': r * 0.09, 'stroke-linecap': 'round', opacity: 0.55 }, q);
      E('path', { d: `M0,${-r * 0.6} Q${r * 0.04},${-r * 0.85} ${-r * 0.1},${-r * 1.05}`, fill: 'none', stroke: stem, 'stroke-width': r * 0.11, 'stroke-linecap': 'round' }, q);
      E('path', { d: `M${-r * 0.04},${-r * 0.86} C${-r * 0.22},${-r * 1.12} ${-r * 0.54},${-r * 1.08} ${-r * 0.64},${-r * 0.94} C${-r * 0.42},${-r * 0.78} ${-r * 0.16},${-r * 0.76} ${-r * 0.04},${-r * 0.86} Z`, fill: leaf, stroke: leafDk, 'stroke-width': 1.5 }, q);
      return q;
    };
    parts(ball('#FF5A5F', '#9E1C2A'), true, '#6B4423', ball(C.plant, C.plantDk), C.plantDk);
    const grey = parts('#6E7883', false, '#59626B', '#7D8790', '#5E6770');
    g.lit = v => op(grey, 1 - clamp(v));
    g.lit(1);
    return g;
  }
  // the Earth, radius r: oceans, land, a thin atmosphere
  function earthArt(parent, r, id) {
    const g = G(parent);
    E('circle', { r: r * 1.25, fill: glow('#7FC8FF'), opacity: 0.45 }, g);
    E('circle', { r, fill: ball('#4A90E2', '#173E8C') }, g);
    const cp = E('clipPath', { id }, defs()); E('circle', { r: r - 1 }, cp);
    const land = G(g, { 'clip-path': `url(#${id})` });
    [[-0.38, -0.28, 0.42, 0.3, 3], [0.4, 0.08, 0.3, 0.42, 5], [-0.12, 0.56, 0.34, 0.18, 8], [0.22, -0.62, 0.24, 0.12, 11]].forEach(([x, y, rx, ry, seed]) => {
      E('path', { d: closedPath(blobPts(rx * r, ry * r, 12, 0, 0.22, seed)), fill: ball('#5BD27A', '#2C8C4C'), transform: `translate(${(x * r).toFixed(1)} ${(y * r).toFixed(1)})` }, land);
    });
    E('path', { d: closedPath(blobPts(r * 0.32, r * 0.08, 10, 0, 0.2, 13)), fill: '#FFFFFF', opacity: 0.75, transform: `translate(${(-r * 0.05).toFixed(1)} ${(-r * 0.93).toFixed(1)})` }, land);
    E('circle', { r, fill: 'none', stroke: '#BFE3FF', 'stroke-width': 2.5, opacity: 0.6 }, g);
    return g;
  }
  // the Moon, radius r, lit on the half that faces litDeg (screen degrees); g.halo glows when it "looks bright"
  function moonArt(parent, r, litDeg) {
    const g = G(parent);
    g.halo = E('circle', { r: r * 2, fill: glow('#DCE6F5'), opacity: 0.6 }, g);
    E('circle', { r, fill: '#3A4652' }, g);
    const lit = G(g, { transform: `rotate(${(litDeg - 180).toFixed(1)})` });
    E('path', { d: `M0,${-r} A${r},${r} 0 0 0 0,${r} Z`, fill: ball('#E4ECF5', '#9AA8B6') }, lit);
    [[-0.42, -0.32, 0.16], [-0.6, 0.24, 0.11], [-0.24, 0.48, 0.09], [-0.2, -0.05, 0.07]].forEach(([x, y, s]) => E('circle', { cx: x * r, cy: y * r, r: s * r, fill: '#B9C5D0' }, lit));
    [[0.4, -0.3, 0.13], [0.3, 0.38, 0.1]].forEach(([x, y, s]) => E('circle', { cx: x * r, cy: y * r, r: s * r, fill: '#323C47' }, lit));
    return g;
  }
  // a lamp: the kit circuit lamp in a big glow (without its wire stubs); g.set(on 0..1)
  function lampArt(parent, s) {
    const g = G(parent), inner = G(g); tr(inner, 0, 0, s);
    const big = E('circle', { r: 118, fill: glow(C.energy) }, inner);
    const b = bulbSym(inner); b.firstChild.style.display = 'none';
    g.set = v => { b.set(v); op(big, v * 0.6); };
    g.set(0);
    return g;
  }
  // a candle standing on (0,0), flame tip at (0,-h): the plane-mirror chapter's candle, scaled.
  // g.glow is its halo; g.upd(t, k) flickers the flame (k: 0 still .. 1 full)
  function candleArt(parent, h) {
    const g = G(parent), c = G(g); tr(c, 0, -h, h / 185);
    g.glow = E('ellipse', { cx: 0, cy: 30, rx: 64, ry: 78, fill: glow('#FFB347') }, c);
    E('ellipse', { cx: 0, cy: 176, rx: 44, ry: 9, fill: ball('#C9D6DF', '#7D8C99'), stroke: '#E2EAF0', 'stroke-width': 2 }, c);
    E('rect', { x: -18, y: 58, width: 36, height: 118, rx: 5, fill: linGrad('#FFF7E6', '#DCC6A0'), stroke: '#CDB892', 'stroke-width': 2 }, c);
    E('ellipse', { cx: 0, cy: 58, rx: 18, ry: 5, fill: '#FFF9EE' }, c);
    E('path', { d: 'M-18,60 Q-19,82 -13,86 Q-9,82 -9,61 Z', fill: '#FFF9EE' }, c);
    E('line', { x1: 0, y1: 42, x2: 0, y2: 58, stroke: '#3A2A1A', 'stroke-width': 3, 'stroke-linecap': 'round' }, c);
    const fl = G(c);
    E('path', { d: 'M0,0 C-6,14 -15,26 -14,38 C-13,48 -7,54 0,54 C7,54 13,48 14,38 C15,26 6,14 0,0 Z', fill: '#FFB13B' }, fl);
    E('path', { d: 'M0,18 C-4,28 -8,34 -7,41 C-6,47 -3,50 0,50 C3,50 6,47 7,41 C8,34 4,28 0,18 Z', fill: '#FFF1B8' }, fl);
    g.upd = (t, k) => fl.setAttribute('transform', `translate(0 54) scale(${(1 + 0.05 * k * Math.sin(t * 9)).toFixed(3)} ${(1 + 0.07 * k * Math.sin(t * 13 + 1)).toFixed(3)}) translate(0 -54)`);
    g.upd(0, 0);
    return g;
  }
  // a phone with a glowing screen, about 96 x 172, centred
  function phoneArt(parent) {
    const g = G(parent);
    g.glow = E('ellipse', { rx: 112, ry: 150, fill: glow('#9FD8FF') }, g);
    E('rect', { x: -48, y: -86, width: 96, height: 172, rx: 16, fill: '#1A222B', stroke: '#8FA3B3', 'stroke-width': 3 }, g);
    E('rect', { x: -40, y: -72, width: 80, height: 140, rx: 8, fill: linGrad('#D6F1FF', '#4C8DF0', true) }, g);
    for (let i = 0; i < 6; i++) E('rect', { x: -30 + (i % 3) * 22, y: -58 + Math.floor(i / 3) * 24, width: 16, height: 16, rx: 4, fill: '#FFFFFF', opacity: 0.8 }, g);
    E('rect', { x: -14, y: 74, width: 28, height: 4, rx: 2, fill: '#8FA3B3' }, g);
    return g;
  }
  // a closed book, front cover, in flat unlit grey: the colour chapter's book (about 108 x 140)
  function bookArt(parent) {
    const g = G(parent), b = G(g); tr(b, 0, 0, 0.68);
    E('rect', { x: -70, y: -100, width: 150, height: 200, rx: 8, fill: '#8F99A3', stroke: '#7C8894', 'stroke-width': 3 }, b);
    E('rect', { x: -80, y: -104, width: 150, height: 208, rx: 8, fill: '#5E6A76', stroke: '#7C8894', 'stroke-width': 4.4 }, b);
    E('rect', { x: -80, y: -104, width: 22, height: 208, rx: 6, fill: '#505B66' }, b);
    [-58, -36].forEach(y => E('rect', { x: -40, y, width: 90, height: 10, rx: 5, fill: '#7C8894' }, b));
    return g;
  }
  // a firework burst of radius R; g.set(p): 0 not yet .. 1 faded away
  function fireworkArt(parent, R) {
    const g = G(parent), rr = rng(77), cols = ['#FFE45C', '#FF7AB6', '#4CC9F0', '#FF9A3C', '#B48CFF'];
    const flash = E('circle', { r: R * 1.2, fill: glow('#FFF3B0') }, g);
    const spokes = [];
    for (let k = 0; k < 20; k++) {
      const a = k / 20 * TAU + rr() * 0.15, col = cols[k % cols.length], len = 0.72 + rr() * 0.28;
      spokes.push({ a, len, ln: E('line', { stroke: col, 'stroke-width': 4, 'stroke-linecap': 'round' }, g), dot: E('circle', { r: 5, fill: col }, g) });
    }
    g.set = p => {
      const e = easeOut(clamp(p * 1.7)), o = p <= 0 ? 0 : clamp(1.2 - p * 0.8);
      op(flash, p <= 0 ? 0 : clamp(1 - p * 2.5));
      spokes.forEach(s => {
        const r1 = R * s.len * e, r0 = r1 * (0.3 + 0.45 * p), c = Math.cos(s.a), sn = Math.sin(s.a), drop = 30 * p * p;
        attr(s.ln, 'x1', c * r0); attr(s.ln, 'y1', sn * r0 + drop * 0.5); attr(s.ln, 'x2', c * r1); attr(s.ln, 'y2', sn * r1 + drop);
        attr(s.dot, 'cx', c * r1); attr(s.dot, 'cy', sn * r1 + drop);
        op(s.ln, o); op(s.dot, o);
      });
    };
    g.set(0);
    return g;
  }
  // draw a ray to p (0..1); hidden at 0 (a zero-length ray would still show its round end cap as a dot)
  const rset = (r, p, o) => { r.set(p); op(r, p > 0.002 ? (o === undefined ? 1 : o) : 0); };
  const greyKid = { shirt: '#6E7A86', skin: '#8E98A2', hair: '#4A535C', shorts: '#5A6470', shoes: '#9AA4AE' };

  /* ===== A. a lamp, straight lines, a ray and a beam ===== */
  const A = G(root);
  const LP = [360, 392];
  const lampG = G(A);
  const burst = [];
  for (let k = 0; k < 16; k++) {
    const deg = k * 22.5, d = ltDir(deg);
    let L = 330;
    if (d[0] > 0) L = Math.min(L, (1150 - LP[0]) / d[0]); if (d[0] < 0) L = Math.min(L, (40 - LP[0]) / d[0]);
    if (d[1] > 0) L = Math.min(L, (705 - LP[1]) / d[1]); if (d[1] < 0) L = Math.min(L, (120 - LP[1]) / d[1]);
    const a = ltPt(LP[0], LP[1], deg, 64), b = ltPt(LP[0], LP[1], deg, L);
    burst.push(lightRay(lampG, a[0], a[1], b[0], b[1], { width: 5, head: 15 }));
  }
  const lamp = lampArt(lampG, 1.35); tr(lamp, LP[0], LP[1]);
  const one = lightRay(lampG, LP[0] + 64, LP[1], 1062, LP[1], { width: 7, head: 20 });
  const rayChip = chip(lampG, 'a ray', { size: 32, fill: C.card2, stroke: C.energy, color: C.energy }); tr(rayChip, 812, LP[1] - 52);
  const chEnergy = G(A);
  { const c = chip(chEnergy, 'a form of **energy**', { size: 32, fill: C.card2, stroke: C.line }); tr(c, 930, 300);
    const sp = spark(chEnergy, 18, { seed: 4 }); tr(sp, 930 - c.w / 2 - 36, 300); chEnergy.sp = sp; }
  const chStraight = chip(A, 'travels in **straight lines**', { size: 32, fill: C.card2, stroke: C.energy, color: C.ink }); tr(chStraight, 930, 486);
  const callG = G(lampG);
  [[560, 494, 560, LP[1] + 14, 'a straight line'], [900, 494, 792, LP[1] + 16, 'an arrow shows which way it goes']].forEach(([x, y, tx, ty, txt]) => {
    E('line', { x1: x, y1: y - 34, x2: tx, y2: ty, stroke: C.muted, 'stroke-width': 2.5 }, callG);
    E('circle', { cx: tx, cy: ty, r: 4.5, fill: C.muted }, callG);
    T(callG, x, y, txt, { size: 28, weight: 600, anchor: 'middle' });
  });
  const beam = [], BY0 = 432;
  for (let k = 0; k < 6; k++) beam.push(lightRay(A, 200, BY0 + k * 34, 1062, BY0 + k * 34, { width: 5, head: 15, at: 0.5 + (k % 2) * 0.08 }));
  const beamLab = G(A);
  E('path', { d: `M178,${BY0 - 8} Q162,${BY0 - 8} 162,${BY0 + 8} L162,${BY0 + 77} Q162,${BY0 + 85} 152,${BY0 + 85} Q162,${BY0 + 85} 162,${BY0 + 93} L162,${BY0 + 162} Q162,${BY0 + 178} 178,${BY0 + 178}`, fill: 'none', stroke: C.energy, 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, beamLab);
  rich(beamLab, 612, 672, ['a ', ['beam', C.energy, 800], ' is just lots of rays'], { size: 34, anchor: 'middle' });

  /* ===== B. the speed of light ===== */
  const B = G(root);
  const streaks = [150, 612, 662].map((y, k) => ({ el: E('rect', { x: 0, y: y - 3, width: 170, height: 6, rx: 3, fill: linGrad('rgba(255,228,92,0)', C.energy) }, B), ph: k * 0.37, y }));
  T(B, 600, 262, 'light travels at about', { size: 38, weight: 600, anchor: 'middle', fill: C.muted });
  const num = T(B, 752, 400, '0', { size: 124, weight: 700, anchor: 'end', fill: C.energy });
  const unit = T(B, 772, 400, 'km/s', { size: 60, weight: 700, fill: C.ink });
  const kmNote = T(B, 600, 450, 'kilometres every second', { size: 28, weight: 600, anchor: 'middle', fill: C.muted });
  const sci = E('text', { x: 600, y: 552, 'font-size': 58, 'font-weight': 700, 'font-family': FD, 'text-anchor': 'middle', fill: C.ink }, B);
  E('tspan', {}, sci).textContent = '= 3 × 10';
  E('tspan', { dy: -26, 'font-size': 36 }, sci).textContent = '8';
  E('tspan', { dy: 26 }, sci).textContent = ' m/s';

  /* ===== C. 7½ times round the Earth in one second ===== */
  const Cg = G(root);
  const EC = [450, 410], ER = 128, ORX = 196, ORY = 56, OTILT = -13;
  const orbitPt = ph => { const x = ORX * Math.cos(ph), y = ORY * Math.sin(ph), c = Math.cos(OTILT * Math.PI / 180), s = Math.sin(OTILT * Math.PI / 180); return [EC[0] + x * c - y * s, EC[1] + x * s + y * c]; };
  const orbitD = (a0, a1) => { let d = ''; for (let i = 0; i <= 40; i++) { const p = orbitPt(lerp(a0, a1, i / 40)); d += (i ? 'L' : 'M') + p[0].toFixed(1) + ',' + p[1].toFixed(1); } return d; };
  const backG = G(Cg);
  E('path', { d: orbitD(Math.PI, TAU), fill: 'none', stroke: C.energy, 'stroke-width': 2.5, 'stroke-dasharray': '6 8', opacity: 0.45 }, backG);
  const earthG = G(Cg); tr(earthG, EC[0], EC[1]); earthArt(earthG, ER, 'light-travels-earthA');
  const frontG = G(Cg);
  E('path', { d: orbitD(0, Math.PI), fill: 'none', stroke: C.energy, 'stroke-width': 2.5, 'stroke-dasharray': '6 8', opacity: 0.6 }, frontG);
  const NTR = 9, trail = [];
  for (let j = 0; j < NTR; j++) {
    const mk = parent => { const g = G(parent); if (j === 0) E('circle', { r: 26, fill: glow(C.energy) }, g); E('circle', { r: j === 0 ? 8 : 6.5 - j * 0.5, fill: j === 0 ? C.energyLt : C.energy }, g); return g; };
    trail.push({ back: mk(backG), front: mk(frontG) });
  }
  T(Cg, EC[0], EC[1] + ER + 62, 'Earth', { size: 30, weight: 600, anchor: 'middle', fill: C.muted });
  const watch = G(Cg); tr(watch, 905, 290);
  E('circle', { r: 64, fill: C.card, stroke: C.muted, 'stroke-width': 6 }, watch);
  E('rect', { x: -12, y: -88, width: 24, height: 18, rx: 4, fill: C.muted }, watch);
  for (let i = 0; i < 12; i++) { const a = i / 12 * TAU, p0 = [Math.sin(a) * 50, -Math.cos(a) * 50], p1 = [Math.sin(a) * 57, -Math.cos(a) * 57]; E('line', { x1: p0[0], y1: p0[1], x2: p1[0], y2: p1[1], stroke: C.muted, 'stroke-width': 3 }, watch); }
  const hand = E('line', { x1: 0, y1: 0, x2: 0, y2: -46, stroke: C.energy, 'stroke-width': 6, 'stroke-linecap': 'round' }, watch);
  E('circle', { r: 7, fill: C.energy }, watch);
  const secTxt = T(Cg, 905, 418, '0.00 s', { size: 44, weight: 700, anchor: 'middle' });
  const lapTxt = T(Cg, 905, 512, '', { size: 56, weight: 700, anchor: 'middle', fill: C.energy });
  T(Cg, 905, 556, 'times round', { size: 28, weight: 600, anchor: 'middle', fill: C.muted });
  T(Cg, 905, 630, 'shown slowed down', { size: 24, weight: 600, anchor: 'middle', fill: C.muted });

  /* ===== D. the firework: see the flash now, hear the bang later ===== */
  const Dg = G(root);
  E('rect', { x: -20, y: 652, width: 1240, height: 120, fill: '#0B1A24' }, Dg);
  E('line', { x1: -20, y1: 652, x2: 1220, y2: 652, stroke: C.line, 'stroke-width': 3 }, Dg);
  const FW = [880, 268], kid = person(Dg, { shirt: '#5B8DEF' }); tr(kid, 240, 652);
  const HEAD = [252, 474];
  const fw = fireworkArt(Dg, 116); tr(fw, FW[0], FW[1]);
  const flashRay = lightRay(Dg, FW[0] - 30, FW[1] + 12, HEAD[0] + 26, HEAD[1] - 6, { width: 5, head: 16 });
  const sndDir = ltAng([HEAD[0] - FW[0], HEAD[1] - FW[1]]), sndLen = Math.hypot(HEAD[0] - FW[0], HEAD[1] - FW[1]) - 40;
  const sndG = G(Dg), snd = sineWave(sndG, { w: 170, amp: 22, wl: 40, color: C.water, width: 6 });
  const seeLab = G(Dg); rich(seeLab, 112, 318, [['see', C.energy, 800], ' the flash: at once'], { size: 30 });
  const hearLab = G(Dg); rich(hearLab, 112, 364, [['hear', C.water, 800], ' the bang: later'], { size: 30 });
  const bang = T(Dg, 372, 420, 'BANG!', { size: 44, weight: 700, anchor: 'middle', fill: C.water });
  const eyeFlash = E('circle', { cx: HEAD[0] + 10, cy: HEAD[1] - 6, r: 30, fill: glow(C.energy) }, Dg);
  const fast = chip(Dg, 'light: about **1,000,000 ×** faster than sound', { size: 30, fill: C.card2, stroke: C.energy }); tr(fast, 700, 590);

  /* ===== E/F. luminous and non-luminous ===== */
  const EF = G(root);
  const lumG = G(EF);
  rich(lumG, 600, 176, [['LUMINOUS', C.energy, 800], ': makes its own light'], { size: 50, anchor: 'middle' });
  const LX = [210, 470, 730, 990], LY = 392;
  const icSun = G(lumG); const sunArt = sun(icSun, 50);
  const icLamp = G(lumG); const lamp2 = lampArt(icLamp, 1.25);
  const icFlame = G(lumG); const cand = candleArt(icFlame, 150); tr(cand, 0, 74);
  const icPhone = G(lumG); const ph = phoneArt(icPhone);
  const lumIcons = [icSun, icLamp, icFlame, icPhone];
  const lumLabs = ['the Sun', 'a lamp', 'a flame', 'a glowing screen'].map((s, i) => T(lumG, LX[i], 536, s, { size: 30, weight: 600, anchor: 'middle' }));
  const nonG = G(EF);
  rich(nonG, 600, 398, [['NON-LUMINOUS', '#B7C4CF', 800], ': no light of its own'], { size: 44, anchor: 'middle' });
  const NX = [340, 600, 860], NY = 536;
  const book = G(nonG); bookArt(book);
  const kid2 = G(nonG); person(kid2, greyKid);
  const nonLabs = ['a book', 'an apple', 'even you'].map((s, i) => T(nonG, NX[i], 672, s, { size: 30, weight: 600, anchor: 'middle', fill: '#B7C4CF' }));
  const appleG = G(root); const apple = appleArt(appleG, 56);       // shared with G/H: it flies to the centre

  /* ===== G/H. how we see: lamp -> apple -> eye ===== */
  const GH = G(root);
  const LP2 = [470, 172], AP = [600, 470], AR = 72, EYP = [1000, 360];
  const CP = (() => { const r = AR, u = 0.5, v = 1 - u; const P0 = [0, -0.62 * r], C1 = [0.5 * r, -1.05 * r], C2 = [1.12 * r, -0.72 * r], P3 = [1.02 * r, 0.05 * r];
    return [AP[0] + v * v * v * P0[0] + 3 * v * v * u * C1[0] + 3 * v * u * u * C2[0] + u * u * u * P3[0], AP[1] + v * v * v * P0[1] + 3 * v * v * u * C1[1] + 3 * v * u * u * C2[1] + u * u * u * P3[1]]; })();
  const lamp3 = lampArt(GH, 1.25); tr(lamp3, LP2[0], LP2[1]);
  const inS = ltPt(LP2[0], LP2[1], ltAng([CP[0] - LP2[0], CP[1] - LP2[1]]), 52);
  const rayIn = lightRay(GH, inS[0], inS[1], CP[0], CP[1], { width: 6, head: 18 });
  const eyeIn = [EYP[0] - 42, EYP[1] + 2];
  const rayOut = lightRay(GH, CP[0], CP[1], eyeIn[0], eyeIn[1], { width: 6, head: 18 });
  const landGlow = E('circle', { cx: CP[0], cy: CP[1], r: 46, fill: glow('#FF8A8A') }, GH);
  const eyeG = G(GH); const eye = eyeIcon(eyeG, 1.75); tr(eye, EYP[0], EYP[1]);
  const pupilGlow = E('circle', { cx: EYP[0] - 38, cy: EYP[1], r: 30, fill: glow(C.energy) }, GH);
  const qSee = chip(GH, '?', { size: 40, w: 64, h: 64, fill: C.card2, stroke: C.energy, color: C.energy }); tr(qSee, EYP[0] + 10, EYP[1] - 100);
  const keyCard = G(GH);
  E('rect', { x: 120, y: 604, width: 960, height: 74, rx: 37, fill: C.card2, stroke: C.energy, 'stroke-width': 3 }, keyCard);
  rich(keyCard, 600, 652, ['We see an object when light ', ['reflects', C.energy, 800], ' off it and ', ['enters our eye', C.energy, 800], '.'], { size: 30, anchor: 'middle' });
  const labSrc = T(GH, LP2[0] - 74, LP2[1] + 10, 'source', { size: 30, weight: 700, anchor: 'end', fill: C.energy });
  const labObj = T(GH, AP[0] - AR - 24, AP[1] + 14, 'object', { size: 30, weight: 700, anchor: 'end', fill: '#FF8A8A' });
  const labEye = T(GH, EYP[0] + 28, EYP[1] - 58, 'eye', { size: 30, weight: 700, anchor: 'start', fill: C.ink });
  const nums = [[LP2[0] - 74 - textWidth('source', 30, FD, 700) - 30, LP2[1]], [AP[0] - AR - 24 - textWidth('object', 30, FD, 700) - 30, AP[1] + 4], [EYP[0], EYP[1] - 68]].map(([x, y], i) => {
    const g = G(GH); tr(g, x, y);
    E('circle', { r: 20, fill: C.energy }, g); T(g, 0, 9, String(i + 1), { size: 26, weight: 700, anchor: 'middle', fill: C.bg0 });
    return g;
  });
  const wrongG = G(GH);
  const wA = [EYP[0] - 48, EYP[1] + 40], wB = [AP[0] + AR + 18, AP[1] + 18];
  const wAng = ltAng([wB[0] - wA[0], wB[1] - wA[1]]);
  const wLine = E('line', { x1: wA[0], y1: wA[1], x2: wA[0], y2: wA[1], stroke: C.bad, 'stroke-width': 5, 'stroke-dasharray': '13 10', 'stroke-linecap': 'round' }, wrongG);
  const wHead = E('path', { d: 'M0,0 L-18,-11 L-13,0 L-18,11 Z', fill: C.bad, transform: `translate(${wB[0]} ${wB[1]}) rotate(${wAng.toFixed(1)})` }, wrongG);
  const wrong = { set: p => { const e = ltPt(wA[0], wA[1], wAng, Math.hypot(wB[0] - wA[0], wB[1] - wA[1]) * clamp(p) - 12); attr(wLine, 'x2', e[0]); attr(wLine, 'y2', e[1]); op(wLine, p > 0.02 ? 1 : 0); op(wHead, clamp((p - 0.85) / 0.15)); } };
  const wX = cross(wrongG, 22); tr(wX, (wA[0] + wB[0]) / 2, (wA[1] + wB[1]) / 2);
  const wLab = T(wrongG, (wA[0] + wB[0]) / 2 + 30, (wA[1] + wB[1]) / 2 + 62, 'eyes send light out?', { size: 26, weight: 600, anchor: 'middle', fill: C.bad });
  const okChip = G(GH);
  { const c = chip(okChip, 'eyes only **receive** light', { size: 32, fill: C.card2, stroke: C.good }); tr(c, 600, 642);
    const tk = tick(okChip, 16); tr(tk, 600 - c.w / 2 - 34, 642); okChip.tk = tk; }

  /* ===== I. the Moon reflects sunlight ===== */
  const Ig = G(root);
  const SUNP = [190, 330], MP = [930, 236], MR = 62, EAP = [560, 628], EAR = 104;     // the Earth sits whole on stage
  const litDeg = ltAng([SUNP[0] - MP[0], SUNP[1] - MP[1]]);
  const sunI = sun(Ig, 50); tr(sunI, SUNP[0], SUNP[1]);
  const moon = moonArt(Ig, MR, litDeg); tr(moon, MP[0], MP[1]);
  const earth2 = G(Ig); tr(earth2, EAP[0], EAP[1]); earthArt(earth2, EAR, 'light-travels-earthB');
  const tiny = person(Ig, { shirt: '#5B8DEF' }); tr(tiny, EAP[0] - 6, EAP[1] - EAR + 2, 0.42);
  const MCP = ltPt(MP[0], MP[1], ltAng([-0.923, 0.385]), MR + 1);
  const sunRay = lightRay(Ig, SUNP[0] + 66, SUNP[1] - 4, MCP[0] - 4, MCP[1], { width: 5, head: 16 });
  const moonRay = lightRay(Ig, MCP[0], MCP[1] + 2, EAP[0] + 8, EAP[1] - EAR - 66, { width: 5, head: 16 });
  const qMoon = chip(Ig, '?', { size: 40, w: 64, h: 64, fill: C.card2, stroke: C.energy, color: C.energy }); tr(qMoon, MP[0] + 108, MP[1] - 40);
  const sunLab = T(Ig, SUNP[0], SUNP[1] + 128, 'luminous', { size: 30, weight: 700, anchor: 'middle', fill: C.energy });
  const moonChip = chip(Ig, 'non-luminous', { size: 30, fill: C.card2, stroke: '#B7C4CF', color: C.ink }); tr(moonChip, MP[0], MP[1] + 116);
  const moonLab = T(Ig, MP[0], MP[1] + 172, 'it reflects sunlight', { size: 28, weight: 600, anchor: 'middle', fill: C.muted });
  const moonName = T(Ig, MP[0] - 100, MP[1] - 76, 'Moon', { size: 30, weight: 700, anchor: 'end', fill: '#DCE6F5' });

  /* ===== update ===== */
  return t => {
    /* A: lamp, straight lines, a ray, a beam */
    const aA = 1 - P(t, at('speed') - 0.15, 0.5, linear);
    op(A, aA);
    if (aA > 0) {
      lamp.set(P(t, at('straight') + 0.1, 0.45, linear) * (0.92 + 0.08 * wave(t, 1.4) * calm));
      const dim = P(t, at('rays') + 0.05, 0.5, linear), bye = P(t, mid('rays', 0.56), 0.45, linear);
      burst.forEach((r, k) => rset(r, P(t, mid('straight', 0.42) + (k % 4) * 0.06, 0.55, linear), k === 0 ? 1 - P(t, at('rays') + 0.1, 0.25, linear) : (1 - 0.88 * dim) * (1 - bye)));
      const up = P(t, mid('rays', 0.56), 0.8);
      tr(lampG, 0, -150 * up);
      rset(one, P(t, at('rays') + 0.1, 0.9, linear));
      op(rayChip, P(t, mid('rays', 0.16), 0.4, linear));
      op(callG, win(t, mid('rays', 0.3), mid('rays', 0.56), 0.35));
      op(chEnergy, win(t, mid('straight', 0.05), at('rays') + 0.2, 0.35)); chEnergy.sp.upd(t);
      op(chStraight, win(t, mid('straight', 0.68), at('rays') + 0.2, 0.35));
      beam.forEach((b, k) => rset(b, P(t, mid('rays', 0.62) + k * 0.09, 0.8, linear)));
      op(beamLab, P(t, mid('rays', 0.7), 0.45, linear));
    }

    /* B: the speed of light */
    const aB = win(t, at('speed') - 0.05, at('earth') - 0.05, 0.4);
    op(B, aB);
    if (aB > 0) {
      const roll = P(t, mid('speed', 0.22), 2.4, easeOut);
      setText(num, Math.round(300000 * roll).toLocaleString('en-GB'));
      op(unit, P(t, mid('speed', 0.22), 0.4, linear)); op(num, P(t, mid('speed', 0.2), 0.3, linear));
      op(kmNote, P(t, mid('speed', 0.42), 0.5, linear));
      op(sci, P(t, mid('speed', 0.6), 0.5, linear));
      tr(sci, 0, (1 - P(t, mid('speed', 0.6), 0.6, easeOut)) * 18);
      streaks.forEach(s => { const q = ((t - at('speed')) * 0.62 * (0.4 + 0.6 * calm) + s.ph) % 1; attr(s.el, 'x', -220 + q * 1640); op(s.el, Math.sin(q * Math.PI) * 0.85); });
    }

    /* C: round the Earth */
    const aC = win(t, at('earth') - 0.2, at('sound') - 0.05, 0.35);
    op(Cg, aC);
    if (aC > 0) {
      const t0 = mid('earth', 0.1), t1 = mid('earth', 0.86), run = P(t, t0, t1 - t0, linear);
      const laps = 7.5 * run, ph0 = Math.PI + laps * TAU;
      trail.forEach((o, j) => {
        const ph = ph0 - j * 0.11, front = Math.sin(ph) > 0, p = orbitPt(ph), vis = run > 0 ? (j === 0 ? 1 : (1 - j / NTR) * 0.9) * (j * 0.11 <= laps * TAU ? 1 : 0) : 0;
        tr(o.front, p[0], p[1]); tr(o.back, p[0], p[1]);
        op(o.front, front ? vis : 0); op(o.back, front ? 0 : vis * 0.55);
      });
      setText(secTxt, run.toFixed(2) + ' s');
      hand.setAttribute('transform', `rotate(${(run * 360).toFixed(1)})`);
      setText(lapTxt, run >= 1 ? '7½' : String(Math.floor(laps)));
      op(lapTxt, P(t, t0, 0.3, linear));
    }

    /* D: the firework */
    const aD = win(t, at('sound') - 0.05, at('luminous') - 0.05, 0.4);
    op(Dg, aD);
    if (aD > 0) {
      const tb = mid('sound', 0.4), tArr = mid('sound', 0.86);
      fw.set(P(t, tb, 2.6, linear));
      rset(flashRay, P(t, tb + 0.05, 0.18, linear), 1 - 0.45 * P(t, tb + 0.8, 0.5, linear) - 0.55 * P(t, tArr + 0.6, 0.5, linear));
      op(eyeFlash, win(t, tb + 0.2, tb + 1.4, 0.2));
      const sp = P(t, tb + 0.15, tArr - tb - 0.15, linear), s = sp * sndLen;
      const o = ltPt(FW[0], FW[1], sndDir, s - 170 + 40);
      sndG.setAttribute('transform', `translate(${o[0].toFixed(1)} ${o[1].toFixed(1)}) rotate(${sndDir.toFixed(2)})`);
      snd.set({ phase: -t * 2.2 * calm });
      op(sndG, sp <= 0 || sp >= 1 ? 0 : Math.min(1, sp * 8));
      op(seeLab, P(t, tb + 0.25, 0.35, linear)); op(hearLab, P(t, tArr, 0.35, linear));
      const bp = P(t, tArr - 0.05, 0.5, pop); op(bang, clamp(bp * 2) * (1 - P(t, tArr + 1.2, 0.4, linear)));
      bang.setAttribute('transform', `translate(372 410) scale(${Math.max(0.01, 0.6 + 0.4 * bp).toFixed(3)}) translate(-372 -410)`);
      op(fast, P(t, mid('sound', 0.06), 0.45, linear));
    }

    /* E/F: luminous, then non-luminous */
    const aEF = win(t, at('luminous') - 0.05, at('see') + 0.1, 0.4);
    op(EF, aEF);
    if (aEF > 0) {
      const toTop = P(t, at('nonlum') - 0.05, 0.9);
      lumG.setAttribute('transform', `translate(600 ${lerp(176, 129, toTop).toFixed(1)}) scale(${lerp(1, 0.56, toTop).toFixed(4)}) translate(-600 -176)`);
      const showL = [0.47, 0.59, 0.7, 0.81].map(f => mid('luminous', f));
      const dimL = 1 - 0.45 * P(t, at('nonlum') + 0.2, 0.8, linear);
      lumIcons.forEach((ic, i) => { const p = P(t, showL[i], 0.5, pop); op(ic, clamp(p * 2)); tr(ic, LX[i], LY + (1 - clamp(p)) * 26, Math.max(0.01, 0.8 + 0.2 * p)); });
      sunArt.upd(t * calm);
      lamp2.set(dimL * (0.92 + 0.08 * wave(t, 1.3) * calm));
      cand.upd(t, calm);
      op(cand.glow, dimL); op(ph.glow, dimL * (0.85 + 0.15 * wave(t, 2.1)));
      lumLabs.forEach((l, i) => op(l, P(t, showL[i] + 0.15, 0.35, linear) * (1 - toTop)));
      op(nonG, P(t, at('nonlum') + 0.2, 0.4, linear));
      const showN = [0.55, 0.67, 0.79].map(f => mid('nonlum', f));
      const pb = P(t, showN[0], 0.5, pop), pk = P(t, showN[2], 0.5, pop);
      op(book, clamp(pb * 2)); tr(book, NX[0], NY + (1 - clamp(pb)) * 24, Math.max(0.01, 0.85 + 0.15 * pb));
      op(kid2, clamp(pk * 2)); tr(kid2, NX[2], NY + 86 + (1 - clamp(pk)) * 24, Math.max(0.01, 0.78 * (0.85 + 0.15 * pk)));
      nonLabs.forEach((l, i) => op(l, P(t, showN[i] + 0.15, 0.35, linear)));
    }

    /* the apple: grey in the non-luminous row, then to the centre, lit by the lamp */
    const pa = P(t, mid('nonlum', 0.67), 0.5, pop), aOut = P(t, at('moon') - 0.15, 0.5, linear);
    op(appleG, clamp(pa * 2) * (1 - aOut));
    if (pa > 0 && aOut < 1) {
      const mv = P(t, at('see') - 0.1, 0.9);
      tr(appleG, lerp(NX[1], AP[0], mv), lerp(NY, AP[1], mv) + (1 - clamp(pa)) * 24, Math.max(0.01, lerp(0.85 + 0.15 * pa, AR / 56, mv)));
      const land = mid('see', 0.48);
      apple.lit(P(t, land, 0.35, linear));
    }

    /* G/H: how we see; eyes only receive light */
    const aG = win(t, at('see') - 0.05, at('moon') - 0.1, 0.45);
    op(GH, aG);
    if (aG > 0) {
      const land = mid('see', 0.48);
      lamp3.set(P(t, at('see') + 0.2, 0.4, linear) * (0.92 + 0.08 * wave(t, 1.4) * calm));
      op(eyeG, P(t, at('see') + 0.25, 0.4, linear));
      op(qSee, win(t, mid('see', 0.05), mid('see', 0.4), 0.3));
      const replay = t >= at('eyes');                                               // the path replays in "eyes"
      rset(rayIn, replay ? P(t, mid('eyes', 0.05), 0.8, linear) : P(t, mid('see', 0.3), land - mid('see', 0.3), linear));
      rset(rayOut, replay ? P(t, mid('eyes', 0.22), 0.8, linear) : P(t, land + 0.25, 0.65, linear));
      op(landGlow, Math.sin(Math.PI * P(t, land, 0.7, linear)) + 0.8 * Math.sin(Math.PI * P(t, mid('eyes', 0.05) + 0.8, 0.6, linear)));
      op(pupilGlow, Math.sin(Math.PI * P(t, land + 0.9, 0.8, linear)) + 0.9 * Math.sin(Math.PI * P(t, mid('eyes', 0.22) + 0.8, 0.8, linear)));
      op(keyCard, win(t, mid('see', 0.3), mid('eyes', 0.5), 0.4));
      [labSrc, labObj, labEye].forEach((l, i) => { const f = P(t, mid('eyes', [0.04, 0.2, 0.36][i]), 0.35, linear); op(l, f); op(nums[i], f); });
      const wp = P(t, mid('eyes', 0.54), 0.6, linear);
      op(wrongG, wp > 0 ? 1 : 0);
      wrong.set(wp);
      const xp = P(t, mid('eyes', 0.68), 0.4, pop); op(wX, clamp(xp * 2)); tr(wX, (wA[0] + wB[0]) / 2, (wA[1] + wB[1]) / 2, Math.max(0.01, xp));
      op(wLab, P(t, mid('eyes', 0.58), 0.35, linear));
      op(okChip, P(t, mid('eyes', 0.8), 0.4, linear));
      const tp = P(t, mid('eyes', 0.8) + 0.3, 0.4, pop); op(okChip.tk, clamp(tp * 2));
    }

    /* I: the Moon */
    const aI = P(t, at('moon') - 0.15, 0.5, linear);
    op(Ig, aI);
    if (aI > 0) {
      sunI.upd(t * calm);
      const pm = P(t, at('moon'), 0.6, pop);
      tr(moon, MP[0], MP[1], Math.max(0.01, 0.85 + 0.15 * pm));
      op(moon.halo, 0.25 + 0.75 * win(t, mid('moon', 0.18), mid('moon', 0.5), 0.4));
      op(qMoon, win(t, at('moon') + 0.15, mid('moon', 0.42), 0.3));
      op(moonName, P(t, at('moon') + 0.2, 0.4, linear));
      const pc = P(t, mid('moon', 0.42), 0.5, pop); op(moonChip, clamp(pc * 2)); tr(moonChip, MP[0], MP[1] + 116, Math.max(0.01, 0.8 + 0.2 * pc));
      op(sunLab, P(t, mid('moon', 0.3), 0.4, linear));
      rset(sunRay, P(t, mid('moon', 0.5), 0.6, linear));
      rset(moonRay, P(t, mid('moon', 0.5) + 0.62, 0.55, linear));
      op(moonLab, P(t, mid('moon', 0.72), 0.4, linear));
    }
  };
});
