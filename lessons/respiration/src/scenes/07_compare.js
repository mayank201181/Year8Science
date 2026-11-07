/* Compare: aerobic vs anaerobic. A table fills in step with the narration (oxygen, energy,
   products for each type), then two panels show why the energy differs: glucose fully broken
   down (aerobic) vs only partly, with most energy locked in lactic acid / ethanol (anaerobic).
   Ends on "anaerobic = a short-term backup". */
scene('compare', S => {
  const { at, end, mid } = S, root = S.root;
  const idle = t => (S.reduce ? 0 : t);
  const COLX = [415, 720, 1025], CW = 286, TOP = 112, BOT = 612;
  const LINES = ['aer', 'human', 'yeast'];
  const scaleAt = (el, x, y, s) => el.setAttribute('transform', `translate(${x} ${y}) scale(${Math.max(0.001, s).toFixed(4)}) translate(${-x} ${-y})`);
  const estW = (s, size) => Math.max(textWidth(s, size, FD, 700), s.replace(/\*\*/g, '').length * size * 0.54);

  function droplet(parent, color, dark) {
    const g = G(parent);
    E('path', { d: 'M0,-26 C10,-12 19,-1 19,10 C19,22 10,29 0,29 C-10,29 -19,22 -19,10 C-19,-1 -10,-12 0,-26 Z', fill: ball(color, dark), stroke: dark, 'stroke-width': 2.5 }, g);
    E('ellipse', { cx: -7, cy: 8, rx: 4, ry: 7, fill: '#fff', opacity: 0.35 }, g);
    return g;
  }
  function padlock(parent) {
    const g = G(parent);
    E('path', { d: 'M-9,-3 L-9,-11 A9,9 0 0 1 9,-11 L9,-3', fill: 'none', stroke: '#DCE6EE', 'stroke-width': 4.5, 'stroke-linecap': 'round' }, g);
    E('rect', { x: -14, y: -5, width: 28, height: 22, rx: 5, fill: ball(C.glucose, C.glucoseDk), stroke: C.glucoseDk, 'stroke-width': 2 }, g);
    E('circle', { cx: 0, cy: 4, r: 3.4, fill: '#5A3B05' }, g);
    E('rect', { x: -1.5, y: 5, width: 3, height: 7, rx: 1.5, fill: '#5A3B05' }, g);
    return g;
  }
  function miniBattery(parent, w, h) {
    const g = G(parent);
    E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: 5, fill: '#2A2210', stroke: C.energyLt, 'stroke-width': 2.5 }, g);
    E('rect', { x: w / 2 + 1, y: -h * 0.22, width: 5, height: h * 0.44, rx: 2, fill: C.energyLt }, g);
    const lv = E('rect', { x: -w / 2 + 3, y: -h / 2 + 3, width: 1, height: h - 6, rx: 3, fill: C.energy }, g);
    g.set = v => attr(lv, 'width', Math.max(0.01, (w - 6) * clamp(v)));
    g.set(0.72);
    return g;
  }

  /* ================= the table ================= */
  const table = G(root);
  const cols = COLX.map((cx, i) => {
    const g = G(table);
    card(g, cx - CW / 2, TOP, CW, BOT - TOP, { fill: C.card, stroke: C.line });
    const hl = E('rect', { x: cx - CW / 2, y: TOP, width: CW, height: BOT - TOP, rx: 22, fill: 'rgba(255,228,92,0.06)', stroke: C.energy, 'stroke-width': 4 }, g);
    const glu = molGlucose(g, 23);
    const sp = spark(g, 11, { seed: i * 3 + 1 });
    const title = T(g, cx, i === 0 ? 223 : 207, i === 0 ? 'Aerobic' : 'Anaerobic', { size: 34, weight: 700, anchor: 'middle' });
    const sub = i ? T(g, cx, 240, i === 1 ? 'in humans' : 'in yeast', { size: 25, weight: 600, anchor: 'middle', fill: C.muted }) : null;
    // oxygen cell
    const oxy = G(g);
    const o2 = molO2(oxy, 15); tr(o2, cx - 72, 307); if (i) o2.setAttribute('opacity', 0.45);
    const mark = i === 0 ? tick(oxy, 17) : cross(oxy, 17); tr(mark, cx - 8, 307);
    T(oxy, cx + 22, 318, i === 0 ? 'yes' : 'no', { size: 30, weight: 700, fill: i === 0 ? C.good : C.bad });
    // energy cell
    const en = G(g);
    const bar = meter(en, { w: 135, h: 26, color: C.energy }); tr(bar, cx - 122, 384);
    const elab = T(en, cx + 26, 406, i === 0 ? 'a lot' : 'a little', { size: 26, weight: 700, fill: C.energyLt });
    // products cell: one row per product (icon + label)
    const rows = [];
    const row = (y, mk, label, col) => {
      const rg = G(g); const ic = mk(rg); tr(ic, cx - 100, y);
      T(rg, cx - 64, y + 9, label, { size: 25, weight: 600, fill: col });
      rows.push({ g: rg, y });
    };
    if (i === 0) { row(494, p => molCO2(p, 11), 'carbon dioxide', C.co2); row(562, p => molH2O(p, 14), 'water', C.water); }
    else if (i === 1) row(528, p => droplet(p, C.lactic, C.lacticDk), 'lactic acid', C.lactic);
    else { row(494, p => droplet(p, C.ethanol, C.ethanolDk), 'ethanol', C.ethanol); row(562, p => molCO2(p, 11), 'carbon dioxide', C.co2); }
    return { g, hl, glu, sp, title, sub, oxy, en, bar, elab, rows, cx };
  });
  const seps = [262, 352, 444].map(y => E('line', { x1: 40, x2: 1168, y1: y, y2: y, stroke: C.line, 'stroke-width': 2 }, table));
  const rowLab = [['Oxygen?', 318], ['Energy', 407], ['Products', 538]].map(([s, y]) => T(table, 48, y, s, { size: 32, weight: 700, fill: C.ink }));
  // when each part of a column appears, as a fraction of its narration line
  const BEAT = {
    aer: { oxy: 0.16, en: 0.36, pr: [0.7, 0.87] },
    human: { oxy: 0.3, en: 0.47, pr: [0.78] },
    yeast: { oxy: 0.27, en: 0.42, pr: [0.68, 0.85] },
  };

  /* ================= why the energy differs ================= */
  const panels = G(root);
  const PL = G(panels), PR = G(panels);
  card(PL, 50, 118, 525, 507, { fill: C.card, stroke: C.line });
  T(PL, 312, 172, 'Aerobic', { size: 40, weight: 700, anchor: 'middle' });
  const LX = 312, LY = 345;
  const ringL = [-20, 20, 75, 105, 160, 200].map((a, k) => ({ m: k % 2 ? molH2O(PL, 14) : molCO2(PL, 12), a: a * Math.PI / 180, k }));
  const batL = glucoseBattery(PL, 76); tr(batL, LX, LY);
  const sparksL = [];
  // sparks fly out everywhere except down through the caption below
  for (let k = 0; k < 10; k++) sparksL.push({ s: spark(PL, 13, { seed: k + 5 }), a: (145 + k * 26) * Math.PI / 180, d: 100 + (k % 3) * 24, k });
  const txtL1 = T(PL, LX, 552, 'glucose **completely** broken down', { size: 28, weight: 600, anchor: 'middle', boldFill: C.energy });
  const txtL2 = T(PL, LX, 594, 'lots of energy released', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });

  card(PR, 625, 118, 525, 507, { fill: C.card, stroke: C.line });
  T(PR, 887, 172, 'Anaerobic', { size: 40, weight: 700, anchor: 'middle' });
  const RX = 887, RY = 312;
  const batR = glucoseBattery(PR, 70); tr(batR, RX, RY);
  const sparksR = [-2.3, -1.57, -0.84].map((a, k) => ({ s: spark(PR, 13, { seed: k + 21 }), a, k }));
  const drops = [[775, C.lactic, C.lacticDk, 'lactic acid'], [1000, C.ethanol, C.ethanolDk, 'ethanol']].map(([x, col, dk, lab], k) => {
    const g = G(PR);
    const d = droplet(g, col, dk); tr(d, 0, 0, 2.2);
    const b = miniBattery(g, 46, 22); tr(b, 0, 14);
    const lock = padlock(g);
    const label = T(PR, x, 506, lab, { size: 28, weight: 700, fill: col, anchor: 'middle' });
    return { g, x, lock, label, k };
  });
  const orTxt = T(PR, RX, 424, 'or', { size: 28, weight: 600, fill: C.muted, anchor: 'middle' });
  const txtR1 = T(PR, RX, 552, 'only **partly** broken down', { size: 28, weight: 600, anchor: 'middle', boldFill: C.lactic });
  const txtR2 = T(PR, RX, 594, 'most energy **locked inside**', { size: 26, weight: 600, anchor: 'middle', fill: C.muted, boldFill: C.ink });

  /* ================= banner ================= */
  const banner = G(root);
  card(banner, 150, 643, 900, 84, { fill: C.card2, stroke: C.energy, rx: 42 });
  const b1 = G(banner), b2 = G(banner);
  {
    const s1 = 'Not better just because it needs no oxygen', w1 = estW(s1, 30) + 50;
    const x0 = 600 - w1 / 2;
    tr(cross(b1, 14), x0 + 14, 685);
    T(b1, x0 + 50, 696, s1, { size: 30, weight: 600 });
    const s2 = 'Anaerobic = a **short-term backup**', w2 = estW(s2, 34) + 74;
    const x1 = 600 - w2 / 2;
    const bat = G(b2); tr(bat, x1 + 26, 685);
    E('rect', { x: -24, y: -14, width: 44, height: 28, rx: 6, fill: '#2A2210', stroke: C.energyLt, 'stroke-width': 3 }, bat);
    E('rect', { x: 21, y: -6, width: 5, height: 12, rx: 2, fill: C.energyLt }, bat);
    E('rect', { x: -20, y: -10, width: 12, height: 20, rx: 3, fill: C.energy }, bat);
    E('path', { d: 'M4,-9 L-4,2 L2,2 L-2,10', fill: 'none', stroke: C.energy, 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, bat);
    T(b2, x1 + 74, 697, s2, { size: 34, weight: 600, boldFill: C.energy });
  }

  return t => {
    const tt = idle(t);
    /* ---- table ---- */
    const tableA = 1 - P(t, at('why') - 0.35, 0.55, linear);
    op(table, tableA);
    if (tableA > 0) {
      cols.forEach((c, i) => {
        const L = LINES[i], B = BEAT[L];
        const pin = P(t, mid('side', 0.02 + i * 0.05), 0.7, easeOut);
        op(c.g, clamp(pin * 1.6));
        c.g.setAttribute('transform', `translate(0 ${((1 - pin) * 40).toFixed(1)})`);
        op(c.hl, win(t, at(L) - 0.15, end(L) + 0.35, 0.3));
        const pg = P(t, mid('side', 0.22 + i * 0.05), 0.5, pop);
        op(c.glu, clamp(pg * 2)); tr(c.glu, c.cx - 16, 153, Math.max(0.01, 0.3 + 0.7 * pg));
        op(c.sp, P(t, mid('side', 0.43 + i * 0.05), 0.4, linear)); tr(c.sp, c.cx + 30, 142, 0.85); c.sp.upd(tt + i);
        const po = P(t, mid(L, B.oxy), 0.45, pop);
        op(c.oxy, clamp(po * 2)); scaleAt(c.oxy, c.cx, 307, 0.4 + 0.6 * po);
        op(c.en, P(t, mid(L, B.en) - 0.1, 0.3, linear));
        c.bar.set(P(t, mid(L, B.en), 1.1) * (i ? 0.2 : 1));
        op(c.elab, P(t, mid(L, B.en) + 0.5, 0.4, linear));
        c.rows.forEach((r, k) => {
          const pr = P(t, mid(L, B.pr[k]), 0.5, easeOut);
          op(r.g, pr); r.g.setAttribute('transform', `translate(${((1 - pr) * -24).toFixed(1)} 0)`);
        });
      });
      [0.76, 0.85, 0.93].forEach((f, k) => {
        const p = P(t, mid('side', f), 0.45, easeOut);
        op(rowLab[k], p); rowLab[k].setAttribute('transform', `translate(${((1 - p) * -20).toFixed(1)} 0)`);
        op(seps[k], p);
      });
    }

    /* ---- panels: why aerobic releases more ---- */
    const panA = P(t, at('why') - 0.1, 0.6, linear);
    op(panels, panA);
    if (panA > 0) {
      // left: battery drains completely, sparks fly, glucose breaks into CO2 + water
      const d0 = mid('why', 0.48);
      batL.set(1 - P(t, d0, 2.0, linear));
      const gone = P(t, d0 + 1.5, 0.6, easeIn);
      op(batL, 1 - gone); tr(batL, LX + Math.sin(tt * 30) * 2 * win(t, d0, d0 + 1.8, 0.2), LY, 1 - 0.5 * gone);
      sparksL.forEach(o => {
        const v = (t - d0 - o.k * 0.19) / 1.1;
        if (v <= 0 || v >= 1) { op(o.s, 0); return; }
        const dd = 50 + easeOut(v) * o.d;
        op(o.s, Math.sin(v * Math.PI)); tr(o.s, LX + Math.cos(o.a) * dd, LY + Math.sin(o.a) * dd, 0.6 + 0.6 * Math.sin(v * Math.PI)); o.s.upd(tt);
      });
      ringL.forEach(o => {
        const p = P(t, d0 + 1.4 + o.k * 0.08, 0.8, easeOut);
        op(o.m, clamp(p * 3));
        tr(o.m, LX + Math.cos(o.a) * 130 * p, LY + Math.sin(o.a) * 130 * p + Math.sin(tt * 1.6 + o.k) * 3 * p);
      });
      op(txtL1, P(t, mid('why', 0.6), 0.5, linear));
      op(txtL2, P(t, d0 + 0.7, 0.5, linear));

      // right: drains only a little, then splits into lactic acid / ethanol with energy locked inside
      const r0 = mid('locked', 0.1), sp0 = mid('locked', 0.42);
      batR.set(1 - 0.28 * P(t, r0, 1.3, linear));
      const shrink = P(t, sp0, 0.5, easeIn);
      op(batR, 1 - shrink); tr(batR, RX, RY, 1 - 0.6 * shrink);
      sparksR.forEach(o => {
        const v = (t - r0 - o.k * 0.35) / 1.1;
        if (v <= 0 || v >= 1) { op(o.s, 0); return; }
        const dd = 50 + easeOut(v) * 90;
        op(o.s, Math.sin(v * Math.PI)); tr(o.s, RX + Math.cos(o.a) * dd, RY + Math.sin(o.a) * dd, 0.5 + 0.5 * Math.sin(v * Math.PI)); o.s.upd(tt);
      });
      drops.forEach(o => {
        const p = P(t, sp0 + 0.25 + o.k * 0.12, 0.8, pop);
        op(o.g, clamp(p * 2));
        tr(o.g, lerp(RX, o.x, clamp(p)), lerp(RY, 410, clamp(p)) + Math.sin(tt * 1.4 + o.k * 2) * 3 * clamp(p), Math.max(0.01, 0.35 + 0.65 * p));
        const pl = P(t, mid('locked', 0.6 + o.k * 0.08), 0.45, pop);
        op(o.lock, clamp(pl * 2)); tr(o.lock, 30, -30, Math.max(0.01, 1.15 * pl));
        op(o.label, P(t, mid('locked', o.k ? 0.9 : 0.8), 0.4, linear));
      });
      op(orTxt, P(t, mid('locked', 0.86), 0.4, linear));
      op(txtR1, P(t, mid('locked', 0.2), 0.5, linear));
      op(txtR2, P(t, mid('locked', 0.6), 0.5, linear));
    }

    /* ---- banner: a short-term backup, not "better" ---- */
    op(banner, P(t, mid('backup', 0.02), 0.4, linear));
    const sw = P(t, mid('backup', 0.58), 0.45, linear);
    op(b1, 1 - sw); op(b2, sw);
    b2.setAttribute('transform', `translate(0 ${((1 - sw) * 10).toFixed(1)})`);
  };
});
