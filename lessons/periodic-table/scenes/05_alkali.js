/* Chapter 5: Group 1, the alkali metals.
   Group 1 lights up in the table; lithium, sodium and potassium come forward and flip into atoms
   with one outer electron. A knife slices sodium; the metals float; they are kept under oil. One
   drops into a trough of universal indicator: hydrogen fizzes off, the water turns purple. Three
   troughs side by side: lithium fizzes, sodium zips around, potassium bursts into a lilac flame.
   The troughs stack into the column (reactivity increases down the group), the mnemonic, then why:
   bigger atoms, shielding, the outer electron lost. Group 2 next door, and calcium beside sodium. */
scene('alkali', S => {
  const { at, end, mid } = S, root = S.root;
  const calm = S.reduce ? 0.35 : 1;
  const ORANGE = PT_FAMILY_COL.alkali, AMB = PT_FAMILY_COL.alkaline, LILAC = '#C8A2F0';
  const UI_GREEN = '#4FBF6A', UI_PURPLE = '#7E56D2', PURPLE_LT = '#C9A5FF', WATER = '#3FA9D6';

  const wr = (el, k, v) => { const m = el._m || (el._m = {}); if (m[k] === v) return; m[k] = v; if (k === 'o') op(el, v); else el.setAttribute(k, v); };
  const label = (x, y, s, o) => { const e = T(root, x, y, s, Object.assign({ size: 30, weight: 700, anchor: 'middle' }, o)); op(e, 0); return e; };

  /* ================= the table (first line) ================= */
  const gridG = G(root), grid = ptGrid(gridG); tr(gridG, 62, 200);
  const g1Lab = G(root);
  const g1Arrow = arrow(g1Lab, 90, 706, 90, 632, { color: ORANGE, width: 5 });
  T(g1Lab, 116, 692, '**Group 1**: the alkali metals', { size: 34, weight: 600, boldFill: ORANGE });

  /* ================= Group 1 and Group 2 tiles ================= */
  const ROWY = i => 170 + i * 88;
  function tile(z, col) {
    const el = ptElement(z), g = G(root);
    E('rect', { x: -40, y: -40, width: 80, height: 80, rx: 10, fill: col, stroke: '#FFFFFF', 'stroke-opacity': 0.55, 'stroke-width': 2.5 }, g);
    T(g, 0, 10, el.sym, { size: 38, weight: 700, anchor: 'middle', fill: C.bg0 });
    const name = col === ORANGE && z <= 19 ? T(g, 0, 31, el.name, { size: 13, weight: 600, anchor: 'middle', fill: C.bg0 }) : null;
    op(g, 0);
    return { g, z, name };
  }
  const T1 = [3, 11, 19, 37, 55, 87].map(z => tile(z, ORANGE)), T2 = [4, 12, 20, 38, 56, 88].map(z => tile(z, AMB));
  const colHead = [label(110, 118, '1', { fill: C.muted }), label(200, 118, '2', { fill: C.muted })];

  /* ================= atoms ================= */
  const AX = [250, 560, 920], AY = 380, AS = 0.62;
  const ATM = [{ z: 3 }, { z: 11, max: 12 }, { z: 19, max: 20 }].map(a => { const g = G(root); const atom = shellAtom(g, { z: a.z, max: a.max, nucleus: 'dot' }); op(g, 0); return { g, atom }; });
  const CFG = [['lithium', '2, **1**'], ['sodium', '2, 8, **1**'], ['potassium', '2, 8, 8, **1**']].map(([n, c], i) => {
    const g = G(root); T(g, AX[i], 566, n, { size: 30, weight: 700, anchor: 'middle' }); T(g, AX[i], 602, c, { size: 30, weight: 600, anchor: 'middle', fill: C.muted, boldFill: C.energy }); op(g, 0); return g;
  });
  const badge = chip(root, 'some of the most reactive metals', { size: 30, fill: C.card2, stroke: ORANGE, color: ORANGE }); tr(badge, 600, 672); op(badge, 0);
  const distA = [0, 1, 2].map(i => { const R = [120, 170, 220][i] * AS; return arrow(root, AX[i], AY - 24, AX[i], AY - R + 16, { color: C.energy, width: 4, head: 14 }); });
  const why = label(600, 170, 'Why?', { size: 58, fill: C.energy });
  const why1 = label(600, 222, 'atoms get **bigger** going down', { size: 34, weight: 600, boldFill: C.energy });
  const why2 = label(600, 662, 'the outer electron is **further from the nucleus**', { size: 32, weight: 600, boldFill: C.energy });

  /* ================= soft: a knife slices sodium ================= */
  const softG = G(root);
  E('rect', { x: 150, y: 556, width: 340, height: 16, rx: 6, fill: '#D9CDB8', stroke: '#B8A98E', 'stroke-width': 2 }, softG);
  const CRUST = '#99A3AC', CRUST_T = '#B8C1C9', CRUST_S = '#7D8892', EDGE = '#D3DCE4';
  const halfL = G(softG), halfR = G(softG);
  E('path', { d: 'M190,446 L220,422 L330,422 L300,446 Z', fill: CRUST_T, stroke: EDGE, 'stroke-width': 1.5, 'stroke-linejoin': 'round' }, halfL);
  const cutFace = E('path', { d: 'M300,446 L330,422 L330,532 L300,556 Z', stroke: EDGE, 'stroke-width': 1.5, 'stroke-linejoin': 'round' }, halfL);
  const cutShine = E('path', { d: 'M305,456 L325,440 L325,478 L305,494 Z', fill: '#FFFFFF' }, halfL);
  E('rect', { x: 190, y: 446, width: 110, height: 110, fill: CRUST, stroke: EDGE, 'stroke-width': 1.5 }, halfL);
  E('path', { d: 'M300,446 L330,422 L440,422 L410,446 Z', fill: CRUST_T, stroke: EDGE, 'stroke-width': 1.5, 'stroke-linejoin': 'round' }, halfR);
  E('path', { d: 'M410,446 L440,422 L440,532 L410,556 Z', fill: CRUST_S, stroke: EDGE, 'stroke-width': 1.5, 'stroke-linejoin': 'round' }, halfR);
  E('rect', { x: 300, y: 446, width: 110, height: 110, fill: CRUST, stroke: EDGE, 'stroke-width': 1.5 }, halfR);
  T(halfR, 355, 512, 'Na', { size: 34, weight: 700, anchor: 'middle', fill: '#E3E9EE' });
  const knife = G(softG);
  E('rect', { x: -2, y: -206, width: 20, height: 92, rx: 7, fill: '#3B2A20', stroke: '#6B5444', 'stroke-width': 2 }, knife);
  E('path', { d: 'M0,0 L-1,-118 L17,-118 L17,-34 Q15,-10 0,0 Z', fill: linGrad('#F2F6F9', '#A9B5C0'), stroke: '#E3E9EE', 'stroke-width': 1.5, 'stroke-linejoin': 'round' }, knife);
  const labSoft = label(315, 622, 'soft enough to cut', { fill: ORANGE }), noteSoft = label(315, 656, 'the shiny cut face soon goes dull', { size: 24, weight: 600, fill: C.muted, font: FB });

  /* ================= troughs ================= */
  function makeTrough(w, h, o) {
    o = o || {};
    const g = G(root), bk = beaker(g, w, h, { level: 0.6, liquid: UI_GREEN, opacity: 0.8 });
    const tg = { g, bk, surf: h / 2 - (h - 18) * 0.6, h };
    if (o.flame) tg.flash = E('circle', { r: 170, fill: glow(LILAC) }, g);
    if (o.ca) {
      tg.lump = E('ellipse', { cx: 0, cy: h / 2 - 14, rx: 24, ry: 12, fill: ball('#EEF1F4', '#9AA6B0'), stroke: '#F4F7FA', 'stroke-width': 1.5 }, g);
      tg.caB = bubbles(g, -16, tg.surf + 6, 32, h / 2 - 28 - tg.surf, { n: 6, r: 5, seed: 41, speed: 0.55 });
    }
    const cg = G(g); tg.cg = cg;
    if (o.flame) {
      tg.glow = E('circle', { cy: -46, r: 96, fill: glow(LILAC) }, cg);
      tg.flame = E('path', { d: 'M0,-4 C-34,-18 -34,-66 -6,-104 C-4,-82 6,-76 8,-90 C26,-64 34,-22 0,-4 Z', fill: LILAC, opacity: 0.92 }, cg);
      tg.core = E('path', { d: 'M0,-8 C-14,-18 -14,-42 0,-66 C14,-42 14,-18 0,-8 Z', fill: '#F6EEFF' }, cg);
    }
    tg.fizz = bubbles(cg, -18, -60, 36, 50, { n: o.n || 6, r: 5, seed: o.seed || 3, speed: o.speed || 0.8 });
    tg.chunk = E('rect', { x: -18, y: -9, width: 36, height: 18, rx: 6, fill: ball('#C9D1D8', '#7D8A96'), stroke: '#E3E9EE', 'stroke-width': 1.5 }, cg);
    if (o.flame) tg.sparks = [0, 1, 2].map(i => spark(cg, 9, { color: LILAC, seed: i + 5 }));
    op(g, 0);
    return tg;
  }
  // the reaction in a trough, tau seconds after the metal was dropped in
  function react(tg, t, tau, metal) {
    const live = tau > 0;
    const dp = P(tau, 0, 0.4, easeIn), y = lerp(-170, tg.surf - 4, dp), amp = S.reduce ? 0.4 : 1;
    let x = 0, fizz = 0, purple = 0;
    if (metal === 'Li') { x = 34 * Math.sin(0.8 * tau) * amp; fizz = 0.5 * P(tau, 0.4, 0.5); purple = P(tau, 0.6, 4.5); }
    if (metal === 'Na') {
      const m = P(tau, 0.5, 0.6); x = m * amp * (106 * Math.sin(2.7 * tau) + 12 * Math.sin(7.3 * tau)); fizz = P(tau, 0.4, 0.3); purple = P(tau, 0.5, 2.6);
      attr(tg.chunk, 'width', lerp(36, 24, m)); attr(tg.chunk, 'height', lerp(18, 24, m)); attr(tg.chunk, 'x', lerp(-18, -12, m)); attr(tg.chunk, 'y', lerp(-9, -14, m)); attr(tg.chunk, 'rx', lerp(6, 12, m));
    }
    if (metal === 'K') {
      x = P(tau, 0.4, 0.3) * amp * 118 * Math.sin(3.6 * tau + 0.5 * Math.sin(8.1 * tau)); fizz = P(tau, 0.4, 0.3); purple = P(tau, 0.5, 2.2);
      const fl = P(tau, 0.75, 0.25), fk = 1 + 0.12 * Math.sin(t * 23) + 0.08 * Math.sin(t * 37);
      op(tg.flame, fl); op(tg.core, fl); op(tg.glow, fl * (0.8 + 0.2 * wave(t, 0.3)));
      tg.flame.setAttribute('transform', `scale(${(1 + 0.06 * Math.sin(t * 29)).toFixed(3)} ${fk.toFixed(3)})`);
      tg.core.setAttribute('transform', `scale(1 ${(2 - fk).toFixed(3)})`);
      op(tg.flash, Math.max(0, Math.sin(Math.PI * P(tau, 0.7, 0.6, linear))));
      tg.sparks.forEach((s, i) => { const q = ((tau - 0.8) * 1.2 * calm + i / 3) % 1; op(s, fl > 0 && tau > 0.8 ? Math.sin(q * Math.PI) : 0); tr(s, (i - 1) * 30 * q + (i - 1) * 8, -70 - 90 * q, 0.6 + 0.5 * (1 - q)); s.upd(t); });
    }
    if (metal === 'Ca') purple = P(tau, 0.8, 5);
    op(tg.cg, live && metal !== 'Ca' ? 1 : 0);
    if (tg.lump) { op(tg.lump, metal === 'Ca' ? 1 : 0); op(tg.caB, metal === 'Ca' ? 1 : 0); if (metal === 'Ca') tg.caB.upd(t * calm, P(tau, 0.3, 0.6)); }
    tr(tg.cg, x, y);
    tg.fizz.upd(t * calm, fizz);
    wr(tg.bk.liquid, 'fill', _ptMix(UI_GREEN, UI_PURPLE, purple));
  }
  const bigT = makeTrough(440, 190, { seed: 9 });
  const floats = ['Li', 'Na', 'K'].map((s, i) => { const g = G(bigT.g); E('rect', { x: -20, y: -9, width: 40, height: 18, rx: 6, fill: ball('#C9D1D8', '#7D8A96'), stroke: '#E3E9EE', 'stroke-width': 1.5 }, g); T(g, 0, -24, s, { size: 32, weight: 700, anchor: 'middle', fill: C.ink }); return g; });
  const TL = makeTrough(320, 150, { n: 4, speed: 0.35, seed: 4, ca: true }), TM = makeTrough(320, 150, { seed: 6 }), TR = makeTrough(320, 150, { flame: true, seed: 8 });
  const labFloat = label(880, 622, 'they float on water'), noteFloat = label(880, 656, 'less dense than water', { size: 24, weight: 600, fill: C.muted, font: FB });

  /* ================= stored under oil ================= */
  const oilG = G(root);
  E('rect', { x: 478, y: 300, width: 244, height: 272, rx: 26, fill: 'rgba(200,230,250,0.10)' }, oilG);
  E('rect', { x: 484, y: 372, width: 232, height: 194, rx: 20, fill: '#E2A93B', opacity: 0.62 }, oilG);
  E('rect', { x: 484, y: 368, width: 232, height: 6, rx: 3, fill: '#FFE6A8', opacity: 0.85 }, oilG);
  [[540, 548, -8], [600, 551, 4], [662, 547, 10]].forEach(([x, y, r]) => E('rect', { x: -20, y: -9, width: 40, height: 18, rx: 6, fill: ball('#C9D1D8', '#7D8A96'), stroke: '#E3E9EE', 'stroke-width': 1.5, transform: `translate(${x} ${y}) rotate(${r})` }, oilG));
  E('path', { d: 'M478,296 L478,546 Q478,572 504,572 L696,572 Q722,572 722,546 L722,296', fill: 'none', stroke: GLASS.stroke, 'stroke-width': 4, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, oilG);
  E('rect', { x: 700, y: 318, width: 8, height: 220, rx: 4, fill: GLASS.shine }, oilG);
  const MOL = [[molO2(oilG, 16), [300, 236], [548, 352], [420, 206], 0], [molO2(oilG, 16), [250, 340], [604, 352], [380, 250], 0.45], [molH2O(oilG, 16), [960, 256], [650, 352], [860, 226], 0.2]];
  const labOx = label(250, 170, 'oxygen', { fill: '#FF9A8F' }), labWv = label(950, 170, 'water vapour', { fill: C.water });
  const labOil = label(600, 628, 'stored under oil', { size: 34, fill: '#F2C14E' }), noteOil = label(600, 662, 'the oil keeps out the air', { size: 24, weight: 600, fill: C.muted, font: FB });

  /* ================= water: hydrogen and an alkaline solution ================= */
  const labUI = label(600, 590, 'water with universal indicator', { size: 26, weight: 600, fill: C.muted });
  const h2 = G(root); E('line', { x1: 770, y1: 322, x2: 636, y2: 384, stroke: C.muted, 'stroke-width': 2.5 }, h2); E('circle', { cx: 636, cy: 384, r: 4.5, fill: C.muted }, h2);
  T(h2, 780, 320, 'hydrogen gas', { size: 30, weight: 700, fill: C.ink }); op(h2, 0);
  const alkChip = chip(root, 'an alkaline solution', { size: 30, fill: UI_PURPLE, color: '#FFFFFF' }); tr(alkChip, 600, 600); op(alkChip, 0);
  const alkName = label(600, 232, '**alkali** metals', { size: 56, boldFill: PURPLE_LT });

  /* ================= three troughs ================= */
  const TX = [222, 600, 978], TY = 450, TS = 1.1;
  const nameL = ['lithium', 'sodium', 'potassium'].map((s, i) => label(TX[i], 588, s, { size: 32 }));
  const descL = [label(TX[0], 626, 'fizzes gently', { size: 28, weight: 600, fill: C.muted }), label(TX[1], 626, 'melts, whizzes around', { size: 28, weight: 600, fill: '#D3DCE4' }), label(TX[2], 628, 'lilac flame!', { fill: LILAC, size: 34 })];

  /* ================= the trend and the mnemonic ================= */
  const arT = arrow(root, 520, 130, 520, 392, { color: ORANGE, width: 9 }), arK = arrow(root, 520, 130, 520, 656, { color: ORANGE, width: 9 });
  const reLab = G(root); T(reLab, 492, 250, 'reactivity\nincreases', { size: 38, weight: 700, anchor: 'end', fill: ORANGE, lh: 44 }); op(reLab, 0);
  const KIDS = ['Little', 'Naughty', 'Kids', 'Run', 'Crazy', 'Fast'].map((w_, i) => label(676, ROWY(i) + 15, `**${w_[0]}**${w_.slice(1)}`, { size: 46, weight: 600, anchor: 'start', boldFill: C.energy }));

  /* ================= shielding and the lost electron ================= */
  const KC = [600, 420], KS = 0.86, KR = 220 * KS;
  const shG = G(root); tr(shG, KC[0], KC[1]);
  const curRect = E('rect', { x: -200, y: -200, width: 400, height: 0 }, E('clipPath', { id: 'alkCurtain' }, defs()));
  const ann = (a, b) => `M${b},0 A${b},${b} 0 1 0 ${-b},0 A${b},${b} 0 1 0 ${b},0 Z M${a},0 A${a},${a} 0 1 1 ${-a},0 A${a},${a} 0 1 1 ${a},0 Z`;
  E('path', { d: ann(27, 164), fill: 'rgba(150,185,215,0.38)', stroke: 'rgba(200,228,245,0.7)', 'stroke-width': 2.5, 'fill-rule': 'evenodd', 'clip-path': 'url(#alkCurtain)' }, shG);
  const pullL = E('line', { x1: 0, y1: -27, x2: 0, y2: -KR + 15, stroke: C.heat, 'stroke-width': 6, 'stroke-dasharray': '10 8', 'stroke-linecap': 'round' }, shG);
  op(shG, 0);
  const pullT = G(root); E('line', { x1: 752, y1: 232, x2: 606, y2: 250, stroke: C.heat, 'stroke-width': 2.5 }, pullT); E('circle', { cx: 606, cy: 250, r: 4.5, fill: C.heat }, pullT);
  T(pullT, 762, 240, 'the nucleus’s pull', { size: 28, weight: 700, fill: C.heat }); op(pullT, 0);
  const shTitle = label(600, 170, 'more **inner shells** in the way', { size: 34, weight: 600, boldFill: '#9FD8FF' });
  const shLab = G(root); E('line', { x1: 868, y1: 330, x2: 732, y2: 372, stroke: C.muted, 'stroke-width': 2.5 }, shLab); E('circle', { cx: 732, cy: 372, r: 4.5, fill: C.muted }, shLab);
  T(shLab, 880, 340, 'shielding', { size: 44, weight: 700, fill: '#9FD8FF' }); op(shLab, 0);
  const eOut = G(root);
  E('circle', { r: 26, fill: glow(C.energy) }, eOut);
  E('circle', { r: 10.8, fill: ball(C.energy, '#C9A800'), stroke: '#C9A800', 'stroke-width': 1.5 }, eOut); op(eOut, 0);
  const snap = spark(root, 16, { seed: 3 }); op(snap, 0);
  const lostLab = label(950, 238, 'lost more easily', { size: 40, fill: C.energy }), lostNote = label(950, 280, 'so the metal reacts faster', { size: 28, weight: 600, fill: C.ink });

  /* ================= Group 2 ================= */
  const g2Lab = label(290, 166, '**Group 2**: the alkaline earth metals', { size: 38, weight: 600, anchor: 'start', boldFill: AMB });
  const G2CFG = [['magnesium', '2, 8, **2**', 560], ['calcium', '2, 8, 8, **2**', 900]].map(([n, c, x]) => {
    const g = G(root); T(g, x, 498, n, { size: 30, weight: 700, anchor: 'middle' }); T(g, x, 534, c, { size: 30, weight: 600, anchor: 'middle', fill: C.muted, boldFill: C.energy }); op(g, 0); return g;
  });
  const barG = G(root);
  T(barG, 430, 594, 'reactivity', { size: 26, weight: 600, fill: C.muted });
  T(barG, 412, 636, 'Group 1', { size: 28, weight: 700, anchor: 'end', fill: ORANGE });
  T(barG, 412, 692, 'Group 2', { size: 28, weight: 700, anchor: 'end', fill: AMB });
  const bar1 = meter(barG, { w: 640, h: 30, color: ORANGE }); tr(bar1, 430, 612);
  const bar2 = meter(barG, { w: 640, h: 30, color: AMB }); tr(bar2, 430, 668);
  op(barG, 0);
  const caL = [label(330, 330, 'calcium', { size: 34 }), label(870, 330, 'sodium', { size: 34 })];
  const caD = [label(330, 604, 'reacts steadily'), label(870, 604, 'far more wildly', { fill: ORANGE })];

  /* ---------- fixed times ---------- */
  const T_CUT = mid('soft', 0.08);
  const placeTile = (tl, x, y, s, o) => { op(tl.g, o); if (o > 0) tr(tl.g, x, y, Math.max(0.01, s)); };

  return t => {
    /* ===== meet: the table, Group 1 lights up ===== */
    const gOut = P(t, mid('meet', 0.6), 0.6, linear);
    op(gridG, 1 - gOut);
    if (gOut < 1) grid.set({ hi: [{ group: 1, p: P(t, mid('meet', 0.1), 0.6) }], dim: P(t, mid('meet', 0.45), 0.6) });
    op(g1Lab, win(t, mid('meet', 0.16), mid('meet', 0.62), 0.4)); g1Arrow.set(P(t, mid('meet', 0.18), 0.5));

    /* Li, Na, K come forward as big tiles, then flip into atoms */
    const fly = P(t, mid('meet', 0.6), 1.1);
    T1.forEach((tl, i) => {
      if (i < 3 && t < at('trend') - 0.5) {
        const [gx, gy] = grid.xy(tl.z), x0 = 62 + gx, y0 = 200 + gy;
        const flip = P(t, mid('one', 0.04 + 0.1 * i), 0.25, easeIn);
        const o = t < mid('meet', 0.6) ? 0 : 1 - (flip >= 1 ? 1 : 0);
        op(tl.g, o);
        if (o > 0) tl.g.setAttribute('transform', `translate(${lerp(x0, AX[i], ease(fly)).toFixed(1)} ${lerp(y0, AY, ease(fly)).toFixed(1)}) scale(${(lerp(0.77, 2.6, fly) * (1 - flip)).toFixed(4)} ${lerp(0.77, 2.6, fly).toFixed(4)})`);
        if (tl.name) op(tl.name, P(t, mid('meet', 0.66), 0.4, linear));
      }
    });

    /* ===== atoms: one outer electron; bigger going down; then Mg and Ca ===== */
    ATM.forEach((a, i) => {
      const flipIn = P(t, mid('one', 0.04 + 0.1 * i) + 0.25, 0.25, easeOut);
      const back = P(t, mid('bigger', 0.04 + 0.12 * i), 0.5, pop);
      let o = 0, x = AX[i], y = AY, sx = AS, sy = AS, e;
      if (t < at('soft') + 0.2) { o = flipIn > 0 ? 1 - P(t, at('soft') - 0.2, 0.4, linear) : 0; sx = AS * flipIn; }
      else if (t < at('group2') - 0.1) {
        o = clamp(back * 2) * (i < 2 ? 1 - P(t, at('shield') - 0.2, 0.4, linear) : 1 - P(t, at('group2') - 0.3, 0.3, linear));
        sx = sy = AS * Math.max(0.01, 0.7 + 0.3 * back);
        if (i === 2) { const m = P(t, at('shield') - 0.1, 0.9); x = lerp(x, KC[0], m); y = lerp(y, KC[1], m); sx = sy = lerp(sx, KS, m); e = t > mid('lost', 0.2) ? 18 : 19; }
      } else if (i > 0) {
        const p = P(t, mid('group2', i === 1 ? 0.3 : 0.38), 0.5, pop);
        o = clamp(p * 2) * (1 - P(t, at('calcium') - 0.45, 0.35, linear)); x = i === 1 ? 560 : 900; y = 340; sx = sy = 0.55 * Math.max(0.01, 0.7 + 0.3 * p); e = i === 1 ? 12 : 20;
      }
      op(a.g, o);
      if (o <= 0) return;
      a.g.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${Math.max(0.001, sx).toFixed(4)} ${sy.toFixed(4)})`);
      const outer = e === 18 ? 0 : t < at('group2') ? P(t, mid('one', 0.3), 0.5) * (0.75 + 0.25 * wave(t, 1.2)) : P(t, mid('group2', 0.5), 0.5) * (0.75 + 0.25 * wave(t, 1.2));
      a.atom.set({ e, outer });
    });
    CFG.forEach((g, i) => op(g, Math.max(win(t, mid('one', 0.2 + 0.08 * i), at('soft') - 0.1, 0.4), win(t, mid('bigger', 0.1 + 0.12 * i), at('shield') - 0.1, 0.4))));
    const bp = P(t, mid('one', 0.55), 0.5, pop) * (1 - P(t, at('soft') - 0.2, 0.4, linear));
    op(badge, clamp(bp * 2)); tr(badge, 600, 672 + (1 - clamp(bp)) * 14);
    distA.forEach((a, i) => { const p = P(t, mid('bigger', 0.46 + 0.1 * i), 0.6); a.set(p); op(a, (p > 0 ? 1 : 0) * (1 - P(t, at('shield') - 0.2, 0.4, linear))); });
    op(why, win(t, at('bigger'), at('shield') - 0.1, 0.4)); op(why1, win(t, mid('bigger', 0.16), at('shield') - 0.1, 0.4)); op(why2, win(t, mid('bigger', 0.5), at('shield') - 0.1, 0.4));

    /* ===== soft: the knife, the cut face, floating ===== */
    const aSoft = win(t, at('soft') - 0.1, at('oil') - 0.05, 0.4);
    op(softG, aSoft);
    if (aSoft > 0) {
      const down = P(t, T_CUT, 0.8, easeIn), up = P(t, T_CUT + 1.0, 0.6);
      knife.setAttribute('transform', `translate(304 ${lerp(lerp(376, 556, down), 330, up).toFixed(1)})`); op(knife, 1 - up);
      const split = P(t, T_CUT + 0.85, 0.5, easeOut); tr(halfR, 42 * split, 0);
      const dull = P(t, T_CUT + 1.8, 2.8, linear);
      wr(cutFace, 'fill', _ptMix('#F4F8FB', CRUST, dull)); op(cutShine, 0.85 * (1 - dull));
    }
    op(labSoft, win(t, mid('soft', 0.14), at('oil') - 0.05, 0.4)); op(noteSoft, win(t, mid('soft', 0.3), at('oil') - 0.05, 0.4));

    /* the big trough: floating metals (soft), then the first reaction (water) */
    const aF = win(t, mid('soft', 0.5), at('oil') - 0.05, 0.4), aW = win(t, at('water') - 0.1, at('li') - 0.3, 0.4);
    op(bigT.g, Math.max(aF, aW));
    if (aF > 0) {
      tr(bigT.g, 880, 470, 0.85); wr(bigT.bk.liquid, 'fill', WATER); op(bigT.cg, 0);
      floats.forEach((f, i) => { const p = P(t, mid('soft', 0.56 + 0.06 * i), 0.5, easeOut); op(f, clamp(p * 3)); tr(f, -120 + 120 * i, lerp(-150, bigT.surf - 5, p) + 3 * Math.sin(t * 2.2 * calm + i * 1.7), 1, 5 * Math.sin(t * 1.7 * calm + i)); });
    } else if (aW > 0) {
      tr(bigT.g, 600, 450, 1); floats.forEach(f => op(f, 0));
      react(bigT, t, t - mid('water', 0.04), 'Li');
      const tau = t - mid('water', 0.04);
      tr(bigT.cg, 24 * Math.sin(1.3 * tau) * (S.reduce ? 0.4 : 1), lerp(-170, bigT.surf - 4, P(tau, 0, 0.4, easeIn)));
      bigT.fizz.upd(t * calm, P(tau, 0.4, 0.3));
      wr(bigT.bk.liquid, 'fill', _ptMix(UI_GREEN, UI_PURPLE, P(t, mid('water', 0.42), 2.2)));
    }
    op(labFloat, win(t, mid('soft', 0.62), at('oil') - 0.05, 0.4)); op(noteFloat, win(t, mid('soft', 0.72), at('oil') - 0.05, 0.4));

    /* ===== oil ===== */
    const aO = win(t, at('oil') - 0.1, at('water') - 0.05, 0.4);
    op(oilG, aO);
    if (aO > 0) MOL.forEach(([m, a, b, c, ph]) => {
      const u = ((t - at('oil')) / 2.4 * calm + ph) % 1, p = u < 0.5 ? ease(u * 2) : ease((u - 0.5) * 2);
      const x = u < 0.5 ? lerp(a[0], b[0], p) : lerp(b[0], c[0], p), y = u < 0.5 ? lerp(a[1], b[1], p) : lerp(b[1], c[1], p);
      tr(m, x, y, 1, t * 40 * calm + ph * 300); op(m, Math.min(1, u * 8, (1 - u) * 8));
    });
    op(labOx, win(t, mid('oil', 0.45), at('water') - 0.05, 0.4)); op(labWv, win(t, mid('oil', 0.55), at('water') - 0.05, 0.4));
    op(labOil, win(t, mid('oil', 0.05), at('water') - 0.05, 0.4)); op(noteOil, win(t, mid('oil', 0.6), at('water') - 0.05, 0.4));

    /* ===== water ===== */
    op(labUI, win(t, at('water'), mid('water', 0.56), 0.4));
    op(h2, win(t, mid('water', 0.24), at('li') - 0.3, 0.4));
    const ac = P(t, mid('water', 0.56), 0.5, pop) * (1 - P(t, at('li') - 0.3, 0.3, linear)); op(alkChip, clamp(ac * 2)); tr(alkChip, 600, 600, 0.85 + 0.15 * clamp(ac));
    op(alkName, win(t, mid('water', 0.78), at('li') - 0.3, 0.4));

    /* ===== li, na, k: three troughs; then they stack beside the column ===== */
    const TT = [TL, TM, TR], MET = ['Li', 'Na', 'K'], START = [at('li') + 0.25, at('na'), at('k')];
    const stack = P(t, at('trend') - 0.5, 1.0);
    const aThree = win(t, at('li') - 0.1, at('kids') + 0.3, 0.4);
    // spotlight: the trough being described stays bright, the others dim a little
    const foc = [win(t, at('li'), at('na') - 0.1, 0.3), win(t, at('na') - 0.1, at('k') - 0.1, 0.3), win(t, at('k') - 0.1, at('trend') - 0.4, 0.3)], anyF = Math.max(...foc);
    TT.forEach((tg, i) => {
      if (t > at('calcium') - 0.6) return;
      const p = P(t, at('li') - 0.1 + 0.1 * i, 0.5, pop), o = clamp(p * 2) * aThree * (1 - 0.35 * (anyF - foc[i]));
      op(tg.g, o);
      if (o <= 0) return;
      tr(tg.g, lerp(TX[i], 790, stack), lerp(TY, ROWY(i), stack) + (1 - clamp(p)) * 20, lerp(TS, 0.52, stack));
      react(tg, t, t - START[i], MET[i]);
    });
    nameL.forEach((e, i) => op(e, win(t, at('li') + 0.1 * i, at('trend') - 0.45, 0.35)));
    descL.forEach((e, i) => op(e, win(t, i === 0 ? mid('li', 0.3) : i === 1 ? mid('na', 0.3) : mid('k', 0.3), at('trend') - 0.45, 0.35)));

    /* ===== trend and kids: the column (the tiles arrive once the troughs have stacked) ===== */
    const aCol = win(t, at('trend') + 0.3, at('bigger') - 0.2, 0.4);
    T1.forEach((tl, i) => {
      if (t < at('trend') - 0.5) { if (i >= 3) op(tl.g, 0); return; }
      if (t < at('group2') - 0.3) {
        const p = i < 3 ? P(t, at('trend') + 0.4 + 0.1 * i, 0.5, pop) : P(t, mid('kids', [0.5, 0.57, 0.64][i - 3]), 0.5, easeOut);
        const flash = Math.sin(Math.PI * P(t, mid('kids', 0.72 + 0.045 * i), 0.4, linear));
        placeTile(tl, 600, ROWY(i) - (i < 3 ? 0 : (1 - p) * 120), (i < 3 ? 0.8 + 0.2 * p : 1) * (1 + 0.14 * flash), clamp(p * 2) * aCol);
        if (tl.name) op(tl.name, 0);
      } else {
        const p = P(t, mid('group2', 0.0) + 0.05 * i, 0.5, pop);
        placeTile(tl, 110, ROWY(i), 0.8 + 0.2 * p, clamp(p * 2) * (1 - P(t, at('calcium') - 0.45, 0.35, linear)));
      }
    });
    T2.forEach((tl, i) => { const p = P(t, mid('group2', 0.06) + 0.06 * i, 0.5, pop); placeTile(tl, lerp(110, 200, easeOut(clamp(p))), ROWY(i), 0.8 + 0.2 * p, clamp(p * 2) * (1 - P(t, at('calcium') - 0.45, 0.35, linear))); });
    colHead.forEach((e, i) => op(e, win(t, mid('group2', 0.04 + 0.1 * i), at('calcium') - 0.1, 0.35)));
    arT.set(P(t, at('trend') + 0.55, 0.6)); op(arT, win(t, at('trend') + 0.5, mid('kids', 0.5), 0.3));
    arK.set(P(t, mid('kids', 0.48), 0.6)); op(arK, P(t, mid('kids', 0.48), 0.2, linear) * (1 - P(t, at('bigger') - 0.2, 0.4, linear)));
    op(reLab, win(t, mid('trend', 0.3), at('bigger') - 0.2, 0.4));
    KIDS.forEach((k, i) => op(k, win(t, mid('kids', 0.33 + 0.065 * i), at('bigger') - 0.2, 0.3)));

    /* ===== shield and lost ===== */
    const aSh = win(t, mid('shield', 0.2), at('group2') - 0.2, 0.4);
    op(shG, aSh);
    if (aSh > 0) {
      attr(curRect, 'height', 400 * P(t, mid('shield', 0.42), 1.4, easeOut));
      const weak = P(t, mid('shield', 0.6), 0.8), sn = P(t, mid('lost', 0.2), 0.25, linear);
      attr(pullL, 'stroke-width', lerp(6, 2.5, weak)); op(pullL, (1 - 0.45 * weak) * (1 - sn));
    }
    op(pullT, win(t, mid('shield', 0.25), mid('lost', 0.2), 0.3));
    op(shTitle, win(t, at('shield') + 0.1, at('lost') + 0.2, 0.4));
    op(shLab, win(t, mid('shield', 0.55), mid('lost', 0.3), 0.4));
    const sp = win(t, mid('lost', 0.2), mid('lost', 0.2) + 0.6, 0.15); op(snap, sp); if (sp > 0) { tr(snap, KC[0], KC[1] - 110, 0.7 + 0.6 * P(t, mid('lost', 0.2), 0.5, easeOut)); snap.upd(t); }
    const eo = t > mid('lost', 0.2) ? 1 - P(t, at('group2') - 0.3, 0.3, linear) : 0;
    op(eOut, eo);
    if (eo > 0) { const d = P(t, mid('lost', 0.24), 2.4, easeOut); tr(eOut, lerp(KC[0], 920, d) + 8 * Math.sin(d * 9) * (1 - d), lerp(KC[1] - KR, 150, d)); }
    op(lostLab, win(t, mid('lost', 0.36), at('group2') - 0.2, 0.4)); op(lostNote, win(t, mid('lost', 0.62), at('group2') - 0.2, 0.4));

    /* ===== Group 2 ===== */
    op(g2Lab, win(t, mid('group2', 0.16), at('calcium') - 0.1, 0.35));
    G2CFG.forEach((g, i) => op(g, win(t, mid('group2', 0.34 + 0.08 * i), at('calcium') - 0.1, 0.35)));
    const bv = win(t, mid('group2', 0.56), at('calcium') - 0.1, 0.35);
    op(barG, bv);
    if (bv > 0) { bar1.set(0.92 * P(t, mid('group2', 0.58), 0.9, easeOut)); bar2.set(0.5 * P(t, mid('group2', 0.65), 0.9, easeOut)); }

    /* ===== calcium beside sodium ===== */
    const aCa = P(t, at('calcium') - 0.1, 0.4, linear);
    if (t > at('calcium') - 0.6) {
      op(TR.g, 0);
      [[TL, 330, 'Ca', t - at('calcium')], [TM, 870, 'Na', t - at('calcium') + 2.0]].forEach(([tg, x, m, tau], i) => {
        const p = P(t, at('calcium') - 0.1 + 0.15 * i, 0.5, pop);
        op(tg.g, clamp(p * 2) * aCa); tr(tg.g, x, 450 + (1 - clamp(p)) * 20, 1.1);
        react(tg, t, tau, m);
      });
    }
    caL.forEach((e, i) => op(e, P(t, at('calcium') + 0.1 + 0.15 * i, 0.4, linear)));
    caD.forEach((e, i) => op(e, P(t, mid('calcium', i ? 0.6 : 0.2), 0.4, linear)));
  };
});
