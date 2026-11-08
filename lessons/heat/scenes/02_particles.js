/* Particles and thermal energy.
   Beats: zoom from a glass of water into a lens of moving particles -> one particle's kinetic energy
   -> sparks from every particle fill a "thermal energy = total" meter -> a thermometer reads the average
   -> a Bunsen flame speeds the particles up (blue -> orange) -> solid, liquid and gas boxes, each heated
   -> a cup and a bucket at the same temperature -> the bucket holds far more thermal energy
   -> memory hook: Joules Jiggle, Celsius Counts hotness. */
scene('particles', S => {
  const { at, end, mid } = S, root = S.root, R = S.reduce;
  const AMP = R ? 0.3 : 1;

  /* ---------- local helpers ---------- */
  const f1 = v => (+v).toFixed(1);
  const STAR = 'M0,-10 L2.4,-2.4 L10,0 L2.4,2.4 L0,10 L-2.4,2.4 L-10,0 L-2.4,-2.4 Z';
  const popIn = (el, p, x, y, s0) => { s0 = s0 === undefined ? 0.75 : s0; op(el, clamp(p * 2)); tr(el, x, y + (1 - clamp(p)) * 16, Math.max(0.01, s0 + (1 - s0) * p)); };
  // ∫ rate dt: rate r0 until t0, ramps linearly to r1 over d seconds, then stays r1 (smooth speed-ups)
  function warp(t, t0, d, r0, r1) {
    if (t <= t0) return r0 * t;
    if (t <= t0 + d) { const u = t - t0; return r0 * t0 + r0 * u + (r1 - r0) * u * u / (2 * d); }
    return r0 * t0 + (r0 + r1) / 2 * d + r1 * (t - t0 - d);
  }
  // where kit particleBox puts particle i of a 'liquid' box (same maths and the same seeded order)
  function liquidPos(w, h, o) {
    const n = o.n, r = o.r, rr = rng(o.seed);
    const cols = Math.ceil(Math.sqrt(n * w / h)), ps = [];
    for (let i = 0; i < n; i++) {
      const c = i % cols, rw = Math.floor(i / cols);
      const jx = (c + 0.5 + (rr() - 0.5) * 0.6) * Math.min(w / cols, 2.3 * r), jy = h - (rw + 0.5 + (rr() - 0.5) * 0.5) * 2.05 * r;
      rr(); rr(); rr(); rr();
      ps.push({ jx, jy, ph: rr() * TAU });
    }
    const offx = (w - Math.min(w / cols, 2.3 * r) * cols) / 2;
    return (i, t, e) => { const p = ps[i]; return [offx + p.jx + Math.sin(t * 1.3 + p.ph) * (3 + 5 * e) + Math.sin(t * 0.35 + p.ph) * 10, p.jy + Math.cos(t * 1.7 + p.ph) * (2 + 3 * e)]; };
  }
  // a pair of identical kit particle boxes, blue and orange, cross-faded by tint (slow blue -> fast orange)
  function tintBox(parent, w, h, o) {
    const g = G(parent);
    const blue = particleBox(g, w, h, Object.assign({}, o, { color: C.water, dark: C.waterDk }));
    const warm = particleBox(g, w, h, Object.assign({}, o, { color: C.heat, dark: C.heatDk, box: false }));
    // each particle warms on its own (seeded order), quickly, so the box never turns a muddy mix
    const wr = rng((o.seed || 1) * 7 + 3), dots = Array.from(warm.querySelectorAll('circle')).map(el => ({ el, o: wr() }));
    g.set = (state, t, e, tint) => {
      blue.set(state, t, e);
      op(warm, tint > 0 ? 1 : 0);
      if (tint > 0) { warm.set(state, t, e); dots.forEach(d => op(d.el, (tint - d.o * 0.75) / 0.25)); }
    };
    return g;
  }
  function clipRect(id, x, y, w, h, rx) { const cp = E('clipPath', { id }, defs()); return E('rect', { x, y, width: w, height: h, rx }, cp); }

  /* ================= A. zoom in: particles, kinetic energy, total and average ================= */
  const gA = G(root);
  // the glass of water we zoom into
  const cupG = G(gA);
  const glass = beaker(cupG, 230, 270, { level: 0.74 }); tr(glass, 600, 440);
  const ZX = 600, ZY = 500;                                     // zoom focus, inside the water
  // the lens (later the box): its outline, a tinted backdrop and the clipped particles
  const FW = 440, FH = 480, FN = 72, FR = 26, FSEED = 31, FCX = 220, FCY = 270;
  const lensBack = E('rect', { fill: 'rgba(76,201,240,0.10)' }, gA);
  const lensClip = clipRect('heatPartLens', 0, 0, 10, 10, 5);
  const fieldWrap = G(gA, { 'clip-path': 'url(#heatPartLens)' });
  const field = tintBox(fieldWrap, FW, FH, { n: FN, r: FR, seed: FSEED, state: 'liquid', box: false });
  const fpos = liquidPos(FW, FH, { n: FN, r: FR, seed: FSEED });
  const lensRim = E('rect', { fill: 'none', stroke: GLASS.stroke, 'stroke-width': 6 }, gA);
  // labels for the zoom
  const labPart = G(gA);
  T(labPart, 195, 330, 'tiny **particles**', { size: 42, weight: 600, anchor: 'middle', boldFill: C.water });
  const labAtoms = T(gA, 195, 378, 'atoms and molecules', { size: 28, weight: 500, anchor: 'middle', fill: C.muted });
  const labMove = G(gA);
  T(labMove, 1005, 372, 'always moving', { size: 36, weight: 700, anchor: 'middle', fill: C.energy });
  // one particle's kinetic energy
  const KI = (() => { let best = 0, bd = 1e9; for (let i = 0; i < FN; i++) { const p = fpos(i, 0, 0.4), d = Math.hypot(p[0] - 330, p[1] - 236); if (d < bd) { bd = d; best = i; } } return best; })();
  const hiG = G(gA);
  const trail = [0.42, 0.25, 0.12].map((o, k) => E('circle', { r: FR * (0.92 - k * 0.1), fill: C.energy, opacity: o }, hiG));
  E('circle', { r: 50, fill: glow(C.energy) }, hiG);
  E('circle', { r: FR, fill: ball(C.energy, '#B98A10') }, hiG);
  E('circle', { r: FR + 8, fill: 'none', stroke: C.energy, 'stroke-width': 4 }, hiG);
  const speedArr = G(hiG); arrow(speedArr, 0, 0, 74, 0, { color: C.energy, width: 7 });
  const DIR = -24 * Math.PI / 180;
  const kinLab = G(gA);
  T(kinLab, 1000, 330, 'kinetic energy', { size: 42, weight: 700, anchor: 'middle', fill: C.energy });
  T(kinLab, 1000, 372, 'the energy of movement', { size: 27, weight: 500, anchor: 'middle', fill: C.muted });
  const kinLead = E('line', { x1: 838, y1: 318, x2: 838, y2: 318, stroke: C.muted, 'stroke-width': 2.5 }, kinLab);
  // the box, meter and thermometer
  const BXC = 330, BYC = 350, BW = 400, BH = 320;
  const MX = 720, MTOP = 190, MH = 300;
  const mG = G(gA);
  const mTot = meter(mG, { w: 60, h: MH, vertical: true, color: C.energy }); tr(mTot, MX - 30, MTOP);
  T(mG, MX, 540, 'thermal energy', { size: 28, weight: 700, anchor: 'middle', fill: C.energy });
  T(mG, MX, 578, '= **total**', { size: 32, weight: 500, anchor: 'middle', boldFill: C.energy });
  const thG = G(gA);
  const thAvg = thermometer(thG, 290, C.bad);
  const thLab = G(gA);
  T(thLab, 950, 540, 'temperature', { size: 28, weight: 700, anchor: 'middle', fill: '#FF9A8F' });
  T(thLab, 950, 578, '= **average**', { size: 32, weight: 500, anchor: 'middle', boldFill: '#FF9A8F' });
  const AI = (() => { let best = 0, bd = 1e9; for (let i = 0; i < FN; i++) { const p = fpos(i, 0, 0.4), d = Math.hypot(p[0] - 200, p[1] - 290); if (d < bd && i !== KI) { bd = d; best = i; } } return best; })();
  const avgRing = E('circle', { r: FR + 9, fill: 'none', stroke: '#FF9A8F', 'stroke-width': 4, 'stroke-dasharray': '9 7' }, gA);
  // sparks: one lifts off every particle in the box and flies into the meter
  const fieldOrigin = m => [lerp(600 - FCX, BXC - FCX, m), lerp(395 - FCY, BYC - FCY, m)];
  const sparkG = G(gA), sparks = [];
  {
    const sr = rng(57), t0 = mid('total', 0.22), span = mid('total', 0.62) - t0;
    const order = []; for (let i = 0; i < FN; i++) order.push([sr(), i]); order.sort((a, b) => a[0] - b[0]);
    const [ox, oy] = fieldOrigin(1);
    // the particles inside the box (checked half-way through the launch window), at most 40, launched in a steady stream
    const inBox = order.map(([, i]) => i).filter(i => { const p = fpos(i, t0 + span / 2, 0.4), x = ox + p[0], y = oy + p[1]; return x > BXC - BW / 2 + 16 && x < BXC + BW / 2 - 16 && y > BYC - BH / 2 + 16 && y < BYC + BH / 2 - 16; }).slice(0, 32);
    inBox.forEach((i, k) => {
      const tl = t0 + span * k / inBox.length, p = fpos(i, tl, 0.4);
      sparks.push({ el: E('path', { d: STAR, fill: C.energy, stroke: C.energyLt, 'stroke-width': 1 }, sparkG), x: ox + p[0], y: oy + p[1], tl, bend: -60 - sr() * 90 });
    });
  }
  const FLY = 1.0;
  // faster: a Bunsen burner under the box
  const bunA = bunsen(gA, 0.72); tr(bunA, BXC, 690);
  const moreKE = T(gA, BXC, 160, 'more kinetic energy', { size: 32, weight: 700, anchor: 'middle', fill: C.energy });
  const fasterChip = G(gA);
  chip(fasterChip, 'faster', { size: 30, fill: C.card2, stroke: C.heat, color: '#FFC08A' });
  [[-6, -30], [-14, 0], [-6, 30]].forEach(([x, y]) => E('path', { d: `M${x - 80},${y} L${x - 64},${y}`, stroke: '#FFC08A', 'stroke-width': 4, 'stroke-linecap': 'round' }, fasterChip));

  /* ================= B. solid, liquid, gas ================= */
  const gB = G(root);
  const BOXW = 250, BOXH = 200, BOXY = 236;
  const STATES = [
    { id: 'solid', x: 220, note: 'vibrate in place', e0: 0.15, e1: 1.0, r1: 2.2, hf: 0.55 },
    { id: 'liquid', x: 600, note: 'slide past each other', e0: 0.3, e1: 0.9, r1: 2.4, hf: 0.62 },
    { id: 'gas', x: 980, note: 'far apart, moving freely', e0: 0.25, e1: 0.95, r1: 1, hf: 0.58 },
  ].map((st, i) => {
    st.g = G(gB);
    st.chip = chip(st.g, st.id, { size: 32, fill: C.card2, stroke: C.line }); tr(st.chip, st.x, 192);
    st.boxG = G(st.g); tr(st.boxG, st.x - BOXW / 2, BOXY);
    st.box = tintBox(st.boxG, BOXW, BOXH, { n: 20, r: 14, seed: 40 + i, state: st.id });
    st.bun = bunsen(st.g, 0.55); tr(st.bun, st.x, 573);
    st.noteT = T(st.g, st.x, 634, st.note, { size: 27, weight: 600, anchor: 'middle', fill: C.muted });
    return st;
  });

  /* ================= C. a cup and a bucket at the same temperature ================= */
  const gC = G(root);
  // the cup (kit beaker) with its particles
  const CUPX = 200, CUPY = 476;
  const cupPG = G(gC, { 'clip-path': 'url(#heatPartCup)' });
  clipRect('heatPartCup', CUPX - 57, CUPY - 21, 114, 96, 13);
  const cupBk = beaker(gC, 120, 150, { level: 0.72 }); tr(cupBk, CUPX, CUPY);
  gC.appendChild(cupPG);                                         // particles drawn over the water
  const cupP = particleBox(cupPG, 112, 96, { n: 12, r: 14, seed: 5, state: 'liquid', box: false }); tr(cupP, CUPX - 56, CUPY - 21);
  // the bucket: a wide glass tub with a handle
  const BUX = 700, BUY = 468, BUWT = 420, BUWB = 350, BUH = 220, BULV = 0.78;
  const buG = G(gC); tr(buG, BUX, BUY);
  const bx0 = -BUWT / 2, bx1 = BUWT / 2, bb0 = -BUWB / 2, bb1 = BUWB / 2, by0 = -BUH / 2, by1 = BUH / 2, brr = 18;
  const BODY = `M${bx0},${by0} L${bb0},${by1 - brr} Q${bb0},${by1} ${bb0 + brr},${by1} L${bb1 - brr},${by1} Q${bb1},${by1} ${bb1},${by1 - brr} L${bx1},${by0} Z`;
  { const cp = E('clipPath', { id: 'heatPartBucket' }, defs()); E('path', { d: BODY }, cp); }
  E('path', { d: `M${bx0 + 22},${by0 + 2} Q0,${by0 - 108} ${bx1 - 22},${by0 + 2}`, fill: 'none', stroke: '#9DB0BF', 'stroke-width': 6, 'stroke-linecap': 'round' }, buG);
  E('path', { d: BODY, fill: GLASS.fill }, buG);
  const BLY = by1 - (BUH - 14) * BULV;
  E('rect', { x: bx0, y: BLY, width: BUWT, height: by1 - BLY + 2, fill: C.water, opacity: 0.85, 'clip-path': 'url(#heatPartBucket)' }, buG);
  E('rect', { x: bx0, y: BLY, width: BUWT, height: 4, fill: '#ffffff', opacity: 0.35, 'clip-path': 'url(#heatPartBucket)' }, buG);
  const buPG = G(buG, { 'clip-path': 'url(#heatPartBucket)' });
  const buP = particleBox(buPG, 400, by1 - BLY, { n: 60, r: 14, seed: 6, state: 'liquid', box: false }); tr(buP, -200, BLY);
  E('path', { d: `M${bx0 - 8},${by0} L${bx0},${by0 + 6} L${bb0},${by1 - brr} Q${bb0},${by1} ${bb0 + brr},${by1} L${bb1 - brr},${by1} Q${bb1},${by1} ${bb1},${by1 - brr} L${bx1},${by0 + 6} L${bx1 + 8},${by0}`, fill: 'none', stroke: GLASS.stroke, 'stroke-width': 4, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, buG);
  [[bx0 + 7, 'start'], [bx1 - 7, 'end']].forEach(([x]) => E('circle', { cx: x, cy: by0 + 6, r: 6, fill: '#9DB0BF' }, buG));
  // thermometers, readings and "same temperature"
  const tCupG = G(gC), tBuG = G(gC);
  const thCup = thermometer(tCupG, 210, C.bad), thBu = thermometer(tBuG, 260, C.bad);
  tr(tCupG, CUPX + 22, 532, 0.72); tr(tBuG, BUX - 140, 534, 0.72);
  thCup.set(0.5); thBu.set(0.5);
  const rdCup = chip(gC, '40 °C', { size: 28, fill: C.card2, stroke: C.bad }), rdBu = chip(gC, '40 °C', { size: 28, fill: C.card2, stroke: C.bad });
  tr(rdCup, CUPX + 22, 348); tr(rdBu, BUX - 140, 290);
  const sameG = G(gC);
  const same = chip(sameG, 'same temperature', { size: 32, fill: C.card2, stroke: C.energy, color: C.energy }); tr(same, 560, 188);
  E('path', { d: `M${560 - same.w / 2 - 6},196 Q${CUPX + 30},206 ${CUPX + 22},322`, fill: 'none', stroke: C.energy, 'stroke-width': 3, 'stroke-dasharray': '7 7', opacity: 0.8 }, sameG);
  E('path', { d: `M${560 + 40},${188 + 24} L${BUX - 140},264`, fill: 'none', stroke: C.energy, 'stroke-width': 3, 'stroke-dasharray': '7 7', opacity: 0.8 }, sameG);
  // each container's thermal-energy meter, filled by sparks
  const CMX = 340, BMX = 1062, MT2 = 330, MH2 = 220;
  const mCupG = G(gC), mBuG = G(gC);
  const mCup = meter(mCupG, { w: 40, h: MH2, vertical: true, color: C.energy }); tr(mCup, CMX - 20, MT2);
  const mBu = meter(mBuG, { w: 40, h: MH2, vertical: true, color: C.energy }); tr(mBu, BMX - 20, MT2);
  T(mCupG, CMX, MT2 + MH2 + 38, 'thermal energy', { size: 26, weight: 600, anchor: 'middle', fill: C.energy });
  T(mBuG, BMX, MT2 + MH2 + 38, 'thermal energy', { size: 26, weight: 600, anchor: 'middle', fill: C.energy });
  const pour = [], pr = rng(91);
  for (let k = 0; k < 18; k++) {
    const inCup = k < 4;
    const x = inCup ? CUPX - 40 + pr() * 80 : BUX - 170 + pr() * 300, y = inCup ? CUPY + pr() * 60 : BUY + pr() * 80;
    pour.push({ el: E('path', { d: STAR, fill: C.energy, stroke: C.energyLt, 'stroke-width': 1 }, gC), x, y, tx: inCup ? CMX : BMX, k: inCup ? k / 4 : (k - 4) / 14, bend: -80 - pr() * 80 });
  }
  const moreTE = chip(gC, 'more thermal energy', { size: 28, fill: C.card2, stroke: C.good, color: C.good });
  const buTick = tick(gC, 16);

  /* ================= D. memory hook ================= */
  const gD = G(root);
  card(gD, 110, 150, 980, 480, { fill: C.card, stroke: C.line });
  const toRem = T(gD, 600, 208, 'To remember it:', { size: 28, weight: 600, anchor: 'middle', fill: C.muted });
  const row1 = G(gD), row2 = G(gD);
  const jChip = G(row1); tr(jChip, 222, 304);
  const jGlow = E('circle', { r: 76, fill: glow(C.energy) }, jChip);
  E('rect', { x: -46, y: -46, width: 92, height: 92, rx: 22, fill: C.energy }, jChip);
  T(jChip, 0, 21, 'J', { size: 60, weight: 700, anchor: 'middle', fill: C.bg0 });
  T(row1, 300, 322, '**J**oules **J**iggle', { size: 56, weight: 600, boldFill: C.energy });
  const note1 = T(row1, 302, 368, 'Heat, in joules, is all that jiggling.', { size: 28, weight: 500, fill: C.muted });
  const jigG = G(row1); tr(jigG, 884, 250);
  const jig = particleBox(jigG, 150, 100, { n: 15, r: 11, seed: 77, state: 'solid', color: C.heat, dark: C.heatDk });
  const cChip = G(row2); tr(cChip, 222, 500);
  E('rect', { x: -46, y: -46, width: 92, height: 92, rx: 22, fill: '#FF8C96' }, cChip);
  T(cChip, 0, 18, '°C', { size: 48, weight: 700, anchor: 'middle', fill: C.bg0 });
  T(row2, 300, 518, '**C**elsius **C**ounts hotness', { size: 56, weight: 600, boldFill: '#FF8C96' });
  const note2 = T(row2, 302, 564, 'Celsius counts how hot.', { size: 28, weight: 500, fill: C.muted });
  const thJG = G(row2); tr(thJG, 960, 578);
  const thJ = thermometer(thJG, 170, C.bad);

  /* ================= update ================= */
  return t => {
    /* ----- A ----- */
    const aA = 1 - P(t, at('solid') - 0.15, 0.5, linear);
    op(gA, aA);
    if (aA > 0) {
      // zoom: the glass grows and fades while the lens opens
      const zp = P(t, mid('zoom', 0.06), 1.7, ease);
      const cs = 1 + 4 * P(t, mid('zoom', 0.06), 1.7, easeIn);
      cupG.setAttribute('transform', `translate(${ZX} ${ZY}) scale(${cs.toFixed(4)}) translate(${-ZX} ${-ZY})`);
      op(cupG, P(t, S.first - 0.3, 0.5, linear) * (1 - P(t, mid('zoom', 0.12), 1.2, linear)));
      const m = P(t, at('total') - 0.45, 1.1, ease);
      const lcx = lerp(ZX, 600, zp), lcy = lerp(ZY, 395, zp), rad = lerp(24, 220, zp);
      const cx = lerp(lcx, BXC, m), cy = lerp(lcy, BYC, m), w = lerp(2 * rad, BW, m), h = lerp(2 * rad, BH, m), rx = lerp(rad, 14, m);
      [lensClip, lensRim, lensBack].forEach(el => { attr(el, 'x', cx - w / 2); attr(el, 'y', cy - h / 2); attr(el, 'width', w); attr(el, 'height', h); attr(el, 'rx', rx); });
      attr(lensRim, 'stroke-width', lerp(6, 3, m));
      const lensOn = P(t, mid('zoom', 0.06), 0.3, linear);
      op(lensRim, lensOn); op(lensBack, lensOn); op(fieldWrap, lensOn);
      const fs = lerp(0.12, 1, zp);
      const [ox, oy] = [cx - FCX * fs, cy - FCY * fs];
      field.setAttribute('transform', `translate(${f1(ox)} ${f1(oy)}) scale(${fs.toFixed(4)})`);
      // particle motion: speeds up when heated
      const h0 = mid('faster', 0.2), hd = 2.2;
      const tw = warp(t, h0, hd, 1, 2.4), e = lerp(0.4, 0.95, P(t, h0, hd, linear)), tint = P(t, h0, 1.6, linear);
      field.set('liquid', tw, e, tint);
      // labels
      op(labPart, P(t, mid('zoom', 0.38), 0.5, linear) * (1 - P(t, at('kinetic'), 0.4, linear)));
      op(labAtoms, P(t, mid('zoom', 0.56), 0.5, linear) * (1 - P(t, at('kinetic'), 0.4, linear)));
      op(labMove, P(t, mid('zoom', 0.76), 0.5, linear) * (1 - P(t, at('kinetic') - 0.1, 0.4, linear)));
      // kinetic energy of one particle
      const kOn = P(t, at('kinetic') - 0.05, 0.4, linear) * (1 - P(t, at('total') - 0.5, 0.4, linear));
      op(hiG, kOn);
      if (kOn > 0) {
        const p = fpos(KI, tw, e), px = ox + p[0] * fs, py = oy + p[1] * fs;
        hiG.setAttribute('transform', `translate(${f1(px)} ${f1(py)})`);
        trail.forEach((c, k) => { attr(c, 'cx', -Math.cos(DIR) * (k + 1) * 15); attr(c, 'cy', -Math.sin(DIR) * (k + 1) * 15); });
        const sa = P(t, mid('kinetic', 0.15), 0.6);
        speedArr.setAttribute('transform', `rotate(${(DIR * 180 / Math.PI).toFixed(1)}) translate(${FR + 14} 0) scale(${Math.max(0.01, sa).toFixed(3)} 1)`);
        attr(kinLead, 'x2', px + 34); attr(kinLead, 'y2', py - 10);
      }
      op(kinLab, P(t, mid('kinetic', 0.22), 0.4, linear) * (1 - P(t, at('total') - 0.5, 0.4, linear)));
      // total: sparks fly into the meter
      const mOn = P(t, at('total') + 0.3, 0.5, linear);
      op(mG, mOn);
      let arrived = 0;
      sparks.forEach(s => {
        const u = (t - s.tl) / FLY;
        if (u >= 1) arrived++;
        if (u <= 0 || u >= 1) { op(s.el, 0); return; }
        const q = ease(u), tx = MX, ty = MTOP + 14, c1x = (s.x + tx) / 2, c1y = Math.min(s.y, ty) + s.bend;
        const x = (1 - q) * (1 - q) * s.x + 2 * (1 - q) * q * c1x + q * q * tx, y = (1 - q) * (1 - q) * s.y + 2 * (1 - q) * q * c1y + q * q * ty;
        tr(s.el, x, y, 0.8 + 0.5 * Math.sin(u * Math.PI), u * 240);
        op(s.el, Math.min(1, u * 8, (1 - u) * 6));
      });
      const totLvl = 0.55 * arrived / Math.max(1, sparks.length);
      mTot.set(totLvl + 0.37 * P(t, h0 + 0.2, hd + 0.4, ease));
      // average: thermometer, one typical particle ringed
      const pth = P(t, at('average') - 0.05, 0.6, pop);
      popIn(thG, pth, 950, 490, 0.8);
      thAvg.set(lerp(0.05, 0.42, P(t, mid('average', 0.12), 1.4, ease)) + 0.4 * P(t, h0 + 0.2, hd + 0.4, ease));
      op(thLab, P(t, mid('average', 0.24), 0.5, linear));
      const rOn = P(t, mid('average', 0.48), 0.4, linear) * (1 - P(t, at('faster') + 0.2, 0.5, linear));
      op(avgRing, rOn);
      if (rOn > 0) { const p = fpos(AI, tw, e); attr(avgRing, 'cx', ox + p[0] * fs); attr(avgRing, 'cy', oy + p[1] * fs); avgRing.setAttribute('stroke-dashoffset', f1(-t * 20)); }
      // faster: the flame
      const bOn = P(t, at('faster') - 0.3, 0.5, linear);
      op(bunA, bOn); tr(bunA, BXC, 690 + (1 - bOn) * 20);
      bunA.set(t > mid('faster', 0.06) ? 'blue' : 'off'); bunA.upd(t);
      op(moreKE, P(t, mid('faster', 0.3), 0.5, linear));
      popIn(fasterChip, P(t, mid('faster', 0.62), 0.5, pop), 640, 262);
    }

    /* ----- B ----- */
    const aB = P(t, at('solid') - 0.15, 0.5, linear) * (1 - P(t, at('cups') - 0.15, 0.5, linear));
    op(gB, aB);
    if (aB > 0) {
      STATES.forEach(st => {
        const p = P(t, at(st.id) - 0.05, 0.6, pop);
        op(st.g, clamp(p * 2)); tr(st.g, 0, (1 - clamp(p)) * 20);
        const h0 = mid(st.id, st.hf), hd = 2.0;
        const hp = P(t, h0, hd, linear), e = lerp(st.e0, st.e1, hp), tint = P(t, h0, 1.1, linear);
        let tw;
        if (st.id === 'gas') { const r0 = (60 + 140 * st.e0) / 60, r1 = (60 + 140 * st.e1) / 60; tw = warp(t, h0, hd, r0, r1); st.box.set('gas', tw, 0, tint); }
        else { tw = warp(t, h0, hd, 1, st.r1); st.box.set(st.id, tw, e, tint); }
        st.bun.set(t > h0 - 0.2 ? 'blue' : 'off'); st.bun.upd(t);
        op(st.noteT, P(t, mid(st.id, 0.12), 0.5, linear));
      });
    }

    /* ----- C ----- */
    const aC = P(t, at('cups') - 0.15, 0.5, linear) * (1 - P(t, at('jiggle') - 0.15, 0.5, linear));
    op(gC, aC);
    if (aC > 0) {
      const pc = P(t, at('cups'), 0.6, pop), pb = P(t, at('cups') + 0.3, 0.6, pop);
      [cupBk, cupPG].forEach(el => op(el, clamp(pc * 2)));
      op(buG, clamp(pb * 2)); tr(buG, BUX, BUY + (1 - clamp(pb)) * 20);
      cupP.set('liquid', t, 0.5); buP.set('liquid', t, 0.5);
      const pt = P(t, mid('cups', 0.2), 0.5, linear);
      op(tCupG, pt); op(tBuG, pt);
      const lv = lerp(0.1, 0.5, P(t, mid('cups', 0.22), 1.2, ease)); thCup.set(lv); thBu.set(lv);
      popIn(rdCup, P(t, mid('cups', 0.42), 0.5, pop), CUPX + 22, 348); popIn(rdBu, P(t, mid('cups', 0.46), 0.5, pop), BUX - 140, 290);
      op(sameG, P(t, mid('cups', 0.5), 0.5, linear));
      // the bucket line: each pours sparks into its own meter
      const mOn = P(t, at('bucket') - 0.1, 0.5, linear);
      op(mCupG, mOn); op(mBuG, mOn);
      const p0 = mid('bucket', 0.12), pspan = mid('bucket', 0.55) - p0;
      let nCup = 0, nBu = 0;
      pour.forEach((s, k) => {
        const tl = p0 + s.k * pspan * (k < 4 ? 0.8 : 1), u = (t - tl) / 0.9;
        if (u >= 1) { if (k < 4) nCup++; else nBu++; }
        if (u <= 0 || u >= 1) { op(s.el, 0); return; }
        const q = ease(u), tx = s.tx, ty = MT2 + 10, c1x = (s.x + tx) / 2, c1y = Math.min(s.y, ty) + s.bend;
        tr(s.el, (1 - q) * (1 - q) * s.x + 2 * (1 - q) * q * c1x + q * q * tx, (1 - q) * (1 - q) * s.y + 2 * (1 - q) * q * c1y + q * q * ty, 0.8 + 0.5 * Math.sin(u * Math.PI), u * 240);
        op(s.el, Math.min(1, u * 8, (1 - u) * 6));
      });
      mCup.set(0.14 * nCup / 4); mBu.set(0.9 * nBu / 14);
      popIn(moreTE, P(t, mid('bucket', 0.6), 0.5, pop), 952, 252);
      const pk = P(t, mid('bucket', 0.56), 0.45, pop); op(buTick, clamp(pk * 2)); tr(buTick, 1108, MT2 + 30, Math.max(0.01, pk));
    }

    /* ----- D ----- */
    const aD = P(t, at('jiggle') - 0.15, 0.5, linear);
    op(gD, aD);
    if (aD > 0) {
      op(toRem, P(t, at('jiggle'), 0.4, linear));
      const p1 = P(t, mid('jiggle', 0.08), 0.5, pop), p2 = P(t, mid('jiggle', 0.3), 0.5, pop);
      op(row1, clamp(p1 * 2)); tr(row1, (1 - clamp(p1)) * 30, 0);
      op(row2, clamp(p2 * 2)); tr(row2, (1 - clamp(p2)) * 30, 0);
      const hj = P(t, mid('jiggle', 0.5), 0.6, linear);
      op(note1, hj); op(jGlow, hj * (0.6 + 0.4 * wave(t, 0.9)));
      jig.set('solid', warp(t, mid('jiggle', 0.5), 0.8, 1, 2.2), 0.55 + 0.45 * hj);
      const hc = P(t, mid('jiggle', 0.8), 0.6, linear);
      op(note2, hc);
      thJ.set(lerp(0.25, 0.7, P(t, mid('jiggle', 0.8), 1.2, ease)));
    }
  };
});
