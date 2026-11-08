/* Chapter 5: Balancing symbol equations.
   Beats: a level see-saw with the same atoms piled on each side -> big numbers in front are fine (tick);
   a pencil changing a subscript is not (cross) -> H2O is water, H2O2 is hydrogen peroxide, a bleach
   -> the method: count, add big numbers, count again (the steps shrink into a strip that lights up as
   each is used) -> H2 + O2 -> H2O on the see-saw with atom tallies -> the oxygen is 2 against 1, the
   see-saw tips -> a 2 before the water; a second water molecule -> now the hydrogen is 2 against 4,
   it tips the other way -> a 2 before the hydrogen -> showpiece: every tally turns green, the see-saw
   settles level, "Balanced!" -> your turn: Mg + O2 -> MgO with a countdown -> 2Mg + O2 -> 2MgO. */
scene('balance', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.3 : 1;

  /* ---------- helpers ---------- */
  const scaleAt = (el, x, y, s) => el.setAttribute('transform', `translate(${x} ${y}) scale(${Math.max(0.001, s).toFixed(4)}) translate(${-x} ${-y})`);
  const pulse = (t, t0, d) => Math.sin(Math.PI * P(t, t0, d || 0.5, linear));
  const len = el => { let w = 0; try { w = el.getComputedTextLength(); } catch (e) { w = 0; } return w; };
  const w1 = (el, k, v) => { const m = el._w1 || (el._w1 = {}); if (m[k] !== v) { m[k] = v; el.setAttribute(k, v); } };
  const popIn = (el, t, t0, x, y, d) => { const p = P(t, t0, d || 0.5, pop); op(el, clamp(p * 2)); scaleAt(el, x, y, 0.6 + 0.4 * p); return p; };

  /* ================= the see-saw (same atoms; the worked example; your turn) ================= */
  const PV = [600, 402], TOP = 386;
  const saw = G(root);
  E('path', { d: 'M600,402 L546,480 L654,480 Z', fill: linGrad('#9AA8B4', '#56626D', true), stroke: '#B9C6D2', 'stroke-width': 2, 'stroke-linejoin': 'round' }, saw);
  E('rect', { x: 500, y: 478, width: 200, height: 16, rx: 7, fill: '#5E6A75', stroke: '#9DB0BF', 'stroke-width': 2 }, saw);
  const plank = G(saw);
  E('rect', { x: 150, y: TOP, width: 900, height: 16, rx: 8, fill: linGrad('#E0AE74', '#8A5A2E', true), stroke: '#F0C896', 'stroke-width': 2 }, plank);
  [146, 1042].forEach(x => E('rect', { x, y: TOP - 14, width: 12, height: 18, rx: 3, fill: '#A86F3A', stroke: '#F0C896', 'stroke-width': 1.5 }, plank));
  E('circle', { cx: PV[0], cy: PV[1], r: 9, fill: '#C5D0D9', stroke: '#5E6A75', 'stroke-width': 3 }, saw);

  // identical piles of atoms (4 H and 2 O on each side)
  const pileG = G(plank);
  const PILE = [['O', -50, TOP - 30], ['O', 50, TOP - 30], ['H', 0, TOP - 18.6], ['H', -28, TOP - 72], ['H', 28, TOP - 72], ['H', 0, TOP - 110]];
  const DROP = [0, 0, 1, 2, 2, 3];
  const piles = [];
  [330, 870].forEach(cx => PILE.forEach(([s, x, y], i) => piles.push({ g: rxAtom(pileG, s, s === 'H' ? 18.6 : 30), x: cx + x, y, i, s })));
  const sameLab = T(root, 600, 214, 'same atoms on each side', { size: 40, weight: 700, anchor: 'middle', fill: C.energy });

  // molecules that sit on the plank; halos behind their atoms light up while they are counted
  const R = 30;
  const YS = { H2: TOP - 18.6, O2: TOP - 30, H2O: TOP - 35.1, Mg: TOP - 34.5, MgO: TOP - 34.5 };
  function plankMol(parent, kind) {
    const g = G(parent), hl = G(g);
    const atoms = kind === 'Mg' ? (rxAtom(g, 'Mg', R * 1.15), [{ sym: 'Mg', x: 0, y: 0, r: R * 1.15 }]) : rxMol(g, kind, { r: R }).atoms;
    const halos = atoms.map(a => ({ sym: a.sym, el: E('circle', { cx: a.x, cy: a.y, r: a.r * 2.1, fill: glow(a.sym === 'H' ? '#FFFFFF' : a.sym === 'O' ? C.oxygen : '#9FE3B0') }, hl) }));
    return { g, halos };
  }
  const molH = G(plank), molM = G(plank);
  const mH2 = [plankMol(molH, 'H2'), plankMol(molH, 'H2')], mO2 = plankMol(molH, 'O2'), mH2O = [plankMol(molH, 'H2O'), plankMol(molH, 'H2O')];
  const mMg = [plankMol(molM, 'Mg'), plankMol(molM, 'Mg')], mO2b = plankMol(molM, 'O2'), mMgO = [plankMol(molM, 'MgO'), plankMol(molM, 'MgO')];
  const glowSym = (ms, sym, v) => ms.forEach(m => m.halos.forEach(h => { if (h.sym === sym) op(h.el, v); }));
  /* one molecule drops in at tIn; from tSplit a second one slides out from behind it */
  function placePair(arr, x1, xs, y, t, tIn, tSplit) {
    const pin = P(t, tIn, 0.5, pop), drop = P(t, tIn, 0.55, easeOut);
    const sp = P(t, tSplit, 0.8, easeOut), sp2 = P(t, tSplit, 0.6, pop);
    tr(arr[0].g, lerp(x1, xs[0], sp), y - (1 - drop) * 110, Math.max(0.01, 0.6 + 0.4 * pin)); op(arr[0].g, clamp(pin * 2));
    tr(arr[1].g, lerp(x1, xs[1], sp), y, Math.max(0.01, 0.6 + 0.4 * sp2)); op(arr[1].g, clamp(sp * 3));
  }
  function placeOne(m, x, y, t, tIn) {
    const pin = P(t, tIn, 0.5, pop), drop = P(t, tIn, 0.55, easeOut);
    tr(m.g, x, y - (1 - drop) * 110, Math.max(0.01, 0.6 + 0.4 * pin)); op(m.g, clamp(pin * 2));
  }

  // atom tallies under each side, and the verdict stamps
  const tL = rxTally(root, ['H', 'O']), tR = rxTally(root, ['H', 'O']);
  const tLm = rxTally(root, ['Mg', 'O']), tRm = rxTally(root, ['Mg', 'O']);
  [tL, tLm].forEach(g => tr(g, 330, 560)); [tR, tRm].forEach(g => tr(g, 870, 560));
  function stamp(ok) {
    const g = G(root), txt = ok ? 'Balanced!' : 'Not balanced', size = ok ? 52 : 42, mk = ok ? 30 : 22;
    const total = mk * 2 + 18 + textWidth(txt, size, FD, 700), x0 = 600 - total / 2;
    tr(ok ? tick(g, mk) : cross(g, mk), x0 + mk, 612);
    T(g, x0 + mk * 2 + 18, 612 + size * 0.36, txt, { size, weight: 700, fill: ok ? C.good : C.bad });
    return g;
  }
  const stOK = stamp(true), stNo = stamp(false);

  /* ================= big numbers, never subscripts; water and hydrogen peroxide ================= */
  const S2 = G(root);
  [330, 870].forEach(x => card(S2, x - 220, 150, 440, 420, { fill: C.card, stroke: C.line, rx: 26 }));
  const RFY = 330, RFS = 96, SUB = Math.round(RFS * 0.62), SDY = Math.round(RFS * 0.24);
  const fL = G(S2), fR = G(S2);
  const lBody = rxFormula(fL, 0, RFY, 'H2O', { size: RFS, anchor: 'start' });
  const lbw = lBody.w || len(lBody) || RFS * 1.7;
  const lCoef = T(fL, 0, RFY, '2', { size: RFS, weight: 600, fill: RX.coef });
  const lcw = len(lCoef) || RFS * 0.55;
  const L_X0 = 330 - lbw / 2, L_CX = 330 - (lcw + 6 + lbw) / 2, L_X1 = L_CX + lcw + 6;
  const rBody = rxFormula(fR, 0, RFY, 'H2O', { size: RFS, anchor: 'start' });
  const rbw = rBody.w || len(rBody) || RFS * 1.7;
  const rSub = T(fR, 0, RFY + SDY, '2', { size: SUB, weight: 600, fill: C.bad });
  const rsw = len(rSub) || SUB * 0.55;
  const R_X0 = 870 - (rbw + rsw) / 2, SUBX = R_X0 + rbw + 1 + rsw / 2, SUBY = RFY + SDY - SUB * 0.36;
  attr(rBody, 'x', R_X0); attr(rSub, 'x', R_X0 + rbw + 1);
  const ringSub = E('circle', { cx: SUBX, cy: SUBY, r: 34, fill: 'none', stroke: C.bad, 'stroke-width': 4 }, fR);
  const okMark = G(S2); tr(tick(okMark, 28), 330, 436); T(okMark, 330, 512, 'big number in front', { size: 30, weight: 700, anchor: 'middle', fill: C.good });
  const noMark = G(S2); tr(cross(noMark, 24), 870, 436); T(noMark, 870, 512, 'never change a subscript', { size: 30, weight: 700, anchor: 'middle', fill: C.bad });
  // a pencil, tip at its origin
  const pencil = G(S2), pen = G(pencil);
  pen.setAttribute('transform', 'rotate(-55)');
  E('path', { d: 'M0,0 L24,-10 L24,10 Z', fill: '#E8C9A0' }, pen);
  E('path', { d: 'M0,0 L9,-3.8 L9,3.8 Z', fill: '#2A2A2A' }, pen);
  E('rect', { x: 24, y: -10, width: 118, height: 20, fill: '#FFC247', stroke: '#B57B12', 'stroke-width': 2 }, pen);
  E('rect', { x: 142, y: -10, width: 12, height: 20, fill: '#A9B8C8' }, pen);
  E('rect', { x: 154, y: -10, width: 20, height: 20, rx: 6, fill: '#FF8FA3' }, pen);
  // why: water beside hydrogen peroxide
  const wMol = rxMol(S2, 'H2O', { r: 36 }); tr(wMol, 330, 396);
  const pMol = rxMol(S2, 'H2O2', { r: 30 }); tr(pMol, 870, 396);
  const neq = T(S2, 600, 424, '≠', { size: 96, weight: 700, anchor: 'middle', fill: C.muted });
  const wLab = T(S2, 330, 512, 'water', { size: 36, weight: 700, anchor: 'middle', fill: C.water });
  const pLab = T(S2, 870, 504, 'hydrogen peroxide', { size: 32, weight: 700, anchor: 'middle' });
  const bLab = T(S2, 870, 544, 'a bleach', { size: 30, weight: 600, anchor: 'middle', fill: C.muted });
  const bottle = G(S2); tr(bottle, 1036, 404);
  E('rect', { x: -10, y: -54, width: 20, height: 14, rx: 3, fill: C.water }, bottle);
  E('path', { d: 'M-12,-40 L12,-40 L12,-32 Q26,-26 26,-10 L26,30 Q26,40 16,40 L-16,40 Q-26,40 -26,30 L-26,-10 Q-26,-26 -12,-32 Z', fill: '#F2F5F7', stroke: '#B9C6D2', 'stroke-width': 2.5 }, bottle);
  E('path', { d: 'M0,-6 L14,8 L0,22 L-14,8 Z', fill: '#FF8A3D', stroke: '#C25516', 'stroke-width': 2 }, bottle);

  /* ================= the method: three steps, then a strip that lights the step in use ================= */
  const S3 = G(root);
  const MC = [250, 600, 950], MCY = 380;
  const mCards = MC.map((x, i) => {
    const g = G(S3);
    card(g, x - 150, 270, 300, 220, { fill: C.card, stroke: C.line, rx: 24 });
    const b = G(g); tr(b, x - 150 + 20, 270 + 20);
    E('circle', { r: 24, fill: C.energy, stroke: C.bg0, 'stroke-width': 4 }, b);
    T(b, 0, 11, String(i + 1), { size: 32, weight: 700, anchor: 'middle', fill: C.bg0 });
    const icon = G(g); tr(icon, x, 366);
    if (i === 1) rxFormula(icon, 0, 20, '2H2O', { size: 60 });
    else {
      const tl = rxTally(icon, ['H', 'O'], { size: 28, r: 13 });
      tl.set(i === 0 ? { H: 2, O: 2 } : { H: 4, O: 2 }, i === 0 ? {} : { H: 1, O: 1 });
      if (i === 2) { tr(tl, -18, 0); tr(tick(icon, 13), 102, 0); }
    }
    T(g, x, 456, ['count', 'add big numbers', 'count again'][i], { size: 32, weight: 700, anchor: 'middle' });
    return g;
  });
  const mArrows = [425, 775].map(x => arrow(S3, x - 14, MCY, x + 16, MCY, { color: C.muted, width: 5 }));
  const strip = G(root), SY = 696;
  const sChips = ['1 count', '2 add big numbers', '3 count again'].map(s => chip(strip, s, { size: 26, fill: C.card, stroke: C.line, sw: 2.5 }));
  const SGAP = 56, sTot = sChips.reduce((a, c) => a + c.w, 0) + SGAP * 2;
  let sx = 600 - sTot / 2;
  const sPos = sChips.map(c => { const x = sx + c.w / 2; sx += c.w + SGAP; tr(c, x, SY); return x; });
  for (let i = 0; i < 2; i++) arrow(strip, sPos[i] + sChips[i].w / 2 + 12, SY, sPos[i + 1] - sChips[i + 1].w / 2 - 12, SY, { color: C.faint, width: 4, head: 12 });

  /* ================= the equations along the top ================= */
  const EQY = 172, EQS = 64;
  function eqRig(spec) {
    const g = G(root);
    g.toks = spec.map(sp => {
      const k = { g: G(g), x: sp.x };
      if (sp.op === '+') T(k.g, 0, 0, '+', { size: EQS, weight: 600, anchor: 'middle', fill: C.muted });
      else if (sp.op) arrow(k.g, -40, -EQS * 0.3, 40, -EQS * 0.3, { color: C.ink, width: 7 });
      else {
        k.halo = E('ellipse', { cx: 0, cy: -EQS * 0.32, rx: 70, ry: EQS * 0.8, fill: glow(C.energy) }, k.g);
        k.chalo = E('circle', { r: EQS * 0.7, fill: glow(C.energy) }, k.g);
        k.body = rxFormula(k.g, 0, 0, sp.f, { size: EQS });
        k.w = k.body.w || len(k.body) || EQS * sp.f.length * 0.5;
        attr(k.halo, 'rx', k.w * 0.8);
        k.coef = T(k.g, 0, 0, '2', { size: EQS, weight: 600, anchor: 'middle', fill: RX.coef });
        k.cx = -k.w / 2 - 8 - (len(k.coef) || EQS * 0.55) / 2;
        attr(k.chalo, 'cx', k.cx); attr(k.chalo, 'cy', -EQS * 0.32);
        op(k.coef, 0); op(k.chalo, 0); op(k.halo, 0);
      }
      tr(k.g, sp.x, EQY);
      return k;
    });
    return g;
  }
  const eqH = eqRig([{ f: 'H2', x: 250 }, { op: '+', x: 354 }, { f: 'O2', x: 450 }, { op: '>', x: 600 }, { f: 'H2O', x: 870 }]);
  const eqM = eqRig([{ f: 'Mg', x: 250 }, { op: '+', x: 354 }, { f: 'O2', x: 450 }, { op: '>', x: 600 }, { f: 'MgO', x: 870 }]);
  const tokIn = (k, t, t0) => { const p = P(t, t0, 0.45, pop); op(k.g, clamp(p * 2)); k.g.setAttribute('transform', `translate(${k.x} ${EQY}) translate(0 ${-EQS * 0.3}) scale(${Math.max(0.01, 0.7 + 0.3 * p).toFixed(3)}) translate(0 ${EQS * 0.3})`); };
  const coefIn = (k, t, t0) => { const p = P(t, t0, 0.6, pop), q = clamp(p); op(k.coef, clamp(p * 2)); tr(k.coef, k.cx - 46 * (1 - q), -44 * (1 - q), Math.max(0.01, 0.6 + 0.4 * p)); op(k.chalo, pulse(t, t0 + 0.15, 1.0) * 0.9); };
  const yourTurn = G(root);
  const ytChip = chip(yourTurn, 'Your turn!', { size: 36, fill: C.card2, stroke: C.energy, color: C.energy }); tr(ytChip, 620, 616);
  const cd = ring(yourTurn, 26); tr(cd, 620 - ytChip.w / 2 - 44, 616);

  /* ---------- the see-saw's angle: tips when a count shows a difference, levels when it matches ---------- */
  const KEYS = [[mid('counto', 0.74), -7, 0.6], [mid('fixo', 0.66), 0, 0.6], [mid('counth', 0.86), 7, 0.6], [mid('check', 0.6), 0, 0.7],
    [mid('ans', 0.12), -7, 0.6], [mid('ans', 0.34), 7, 0.6], [mid('ans', 0.56), 0, 0.7]];
  const SETTLE = [mid('fixo', 0.66), mid('check', 0.6), mid('ans', 0.56)];
  function angle(t) {
    let a = 0;
    KEYS.forEach(([t0, ang, d]) => { a = lerp(a, ang, P(t, t0, d, ease)); });
    SETTLE.forEach(t0 => { const u = t - t0 - 0.55; if (u > 0) a += 2.2 * Math.exp(-2.8 * u) * Math.sin(u * 8); });
    const idle = Math.max(win(t, at('start'), mid('counto', 0.72), 0.5), win(t, at('try'), mid('ans', 0.1), 0.5));
    return a + idle * 1.4 * AMP * Math.sin(t * 2.3);
  }

  /* ================= update ================= */
  return t => {
    const aS1 = P(t, at('same') - 0.1, 0.5, linear) * (1 - P(t, at('rule') - 0.25, 0.45, linear));
    const aH = P(t, at('start') - 0.3, 0.5, linear) * (1 - P(t, at('try') - 0.3, 0.45, linear));
    const aM = P(t, at('try') - 0.05, 0.45, linear);
    op(saw, Math.max(aS1, P(t, at('start') - 0.3, 0.6, linear)));
    plank.setAttribute('transform', `rotate(${angle(t).toFixed(2)} ${PV[0]} ${PV[1]})`);

    /* ---- same atoms on each side ---- */
    op(pileG, aS1); op(sameLab, P(t, mid('same', 0.42), 0.5, linear) * (1 - P(t, at('rule') - 0.25, 0.45, linear)));
    let landH = [0, 0], landO = [0, 0];
    if (aS1 > 0) {
      piles.forEach((p, n) => {
        const t0 = mid('same', 0.05) + DROP[p.i] * 0.34, side = n < PILE.length ? 0 : 1;
        const fall = P(t, t0, 0.5, easeIn), b = P(t, t0 + 0.5, 0.3, linear);
        tr(p.g, p.x, p.y - (1 - fall) * 170 - Math.sin(Math.PI * b) * 8);
        op(p.g, P(t, t0, 0.15, linear));
        if (t >= t0 + 0.5) { if (p.s === 'H') landH[side]++; else landO[side]++; }
      });
    }

    /* ---- tallies ---- */
    const aT1 = P(t, mid('same', 0.1), 0.4, linear) * (1 - P(t, at('rule') - 0.25, 0.45, linear));
    const aT4 = P(t, mid('start', 0.78), 0.4, linear) * (1 - P(t, at('try') - 0.3, 0.45, linear));
    op(tL, Math.max(aT1, aT4)); op(tR, Math.max(aT1, aT4));
    if (t < at('rule')) {
      const ok = t >= mid('same', 0.6) ? { H: 1, O: 1 } : {};
      tL.set({ H: landH[0], O: landO[0] }, ok); tR.set({ H: landH[1], O: landO[1] }, ok);
      const bump = 1 + 0.08 * pulse(t, mid('same', 0.6), 0.45);
      tr(tL, 330, 560, bump); tr(tR, 870, 560, bump);
    } else {
      const RO = t >= mid('fixo', 0.62) ? 2 : 1, RH = t >= mid('counth', 0.3) ? 4 : 2, LH = t >= mid('fixh', 0.36) ? 4 : 2;
      const mO = t >= mid('fixo', 0.62) ? 1 : t >= mid('counto', 0.74) ? -1 : 0;
      const mHh = t >= mid('check', 0.3) ? 1 : (t >= mid('counth', 0.86) && t < mid('fixh', 0.36)) ? -1 : 0;
      tL.set({ H: LH, O: 2 }, { H: mHh, O: mO }); tR.set({ H: RH, O: RO }, { H: mHh, O: mO });
      const bL = 0.1 * Math.max(pulse(t, mid('counto', 0.3), 0.5), pulse(t, mid('counth', 0.6), 0.5), pulse(t, mid('check', 0.3), 0.5), pulse(t, mid('check', 0.55), 0.5), pulse(t, mid('fixh', 0.36), 0.5));
      const bR = 0.1 * Math.max(pulse(t, mid('counto', 0.56), 0.5), pulse(t, mid('fixo', 0.62), 0.5), pulse(t, mid('counth', 0.3), 0.5), pulse(t, mid('counth', 0.86), 0.5), pulse(t, mid('check', 0.3), 0.5), pulse(t, mid('check', 0.55), 0.5));
      tr(tL, 330, 560, 1 + bL); tr(tR, 870, 560, 1 + bR);
    }
    const aTm = P(t, mid('try', 0.86), 0.4, linear);
    op(tLm, aTm); op(tRm, aTm);
    if (aTm > 0) {
      const RMg = t >= mid('ans', 0.32) ? 2 : 1, RO = t >= mid('ans', 0.32) ? 2 : 1, LMg = t >= mid('ans', 0.55) ? 2 : 1;
      const mO = t >= mid('ans', 0.32) ? 1 : t >= mid('ans', 0.12) ? -1 : 0;
      const mMgk = t >= mid('ans', 0.55) ? 1 : t >= mid('ans', 0.34) ? -1 : 0;
      tLm.set({ Mg: LMg, O: 2 }, { Mg: mMgk, O: mO }); tRm.set({ Mg: RMg, O: RO }, { Mg: mMgk, O: mO });
      const bL = 0.1 * Math.max(pulse(t, mid('ans', 0.06), 0.5), pulse(t, mid('ans', 0.55), 0.5), pulse(t, mid('ans', 0.8), 0.5));
      const bR = 0.1 * Math.max(pulse(t, mid('ans', 0.12), 0.5), pulse(t, mid('ans', 0.32), 0.5), pulse(t, mid('ans', 0.8), 0.5));
      tr(tLm, 330, 560, 1 + bL); tr(tRm, 870, 560, 1 + bR);
    }

    /* ---- stamps ---- */
    const sOK = Math.max(win(t, mid('same', 0.84), at('rule') - 0.1, 0.35), win(t, mid('check', 0.8), at('try') - 0.15, 0.35), P(t, mid('ans', 0.88), 0.35, linear));
    const tOK = t < at('rule') ? mid('same', 0.84) : t < at('try') ? mid('check', 0.8) : mid('ans', 0.88);
    op(stOK, sOK); scaleAt(stOK, 600, 612, 0.7 + 0.3 * P(t, tOK, 0.5, pop));
    op(stNo, win(t, mid('counto', 0.8), at('fixo') + 0.1, 0.35)); scaleAt(stNo, 600, 612, 0.7 + 0.3 * P(t, mid('counto', 0.8), 0.5, pop));

    /* ---- big numbers, never subscripts; water vs hydrogen peroxide ---- */
    const a2 = P(t, at('rule') - 0.1, 0.5, linear) * (1 - P(t, at('method') - 0.25, 0.45, linear));
    op(S2, a2);
    if (a2 > 0) {
      const up = P(t, at('why') - 0.1, 0.8);
      fL.setAttribute('transform', `translate(0 ${(-80 * up).toFixed(1)})`); fR.setAttribute('transform', `translate(0 ${(-80 * up).toFixed(1)})`);
      const pf = P(t, mid('rule', 0.02), 0.5, linear); op(lBody, pf); op(rBody, pf);
      // left: a 2 slides in front, then leaves again for "H2O is water"
      const ci = P(t, mid('rule', 0.16), 0.7, easeOut) * (1 - P(t, at('why') - 0.1, 0.6, ease));
      attr(lBody, 'x', lerp(L_X0, L_X1, ci).toFixed(1));
      op(lCoef, clamp(ci * 1.6)); attr(lCoef, 'x', lerp(L_CX - 120, L_CX, P(t, mid('rule', 0.16), 0.7, easeOut)).toFixed(1));
      const pk = P(t, mid('rule', 0.36), 0.45, pop), pxx = P(t, mid('rule', 0.84), 0.4, pop), fm = 1 - P(t, at('why') - 0.15, 0.4, linear);
      op(okMark, clamp(pk * 2) * fm); scaleAt(okMark, 330, 470, 0.6 + 0.4 * pk);
      op(noMark, clamp(pxx * 2) * fm); scaleAt(noMark, 870, 470, 0.6 + 0.4 * pxx);
      // right: the pencil tries to add a subscript
      const pin = P(t, mid('rule', 0.52), 0.6, easeOut), pout = P(t, mid('rule', 0.9), 0.5, easeIn);
      const scrib = t > mid('rule', 0.64) && t < mid('rule', 0.78) ? Math.sin(t * 40) * 3 : 0;
      tr(pencil, SUBX + 4 + 150 * (1 - pin) + 160 * pout + scrib, SUBY + 14 - 120 * (1 - pin) - 60 * pout);
      op(pencil, clamp(pin * 2) * (1 - pout));
      op(rSub, P(t, mid('rule', 0.66), 0.4, linear));
      op(ringSub, P(t, mid('why', 0.2), 0.4, linear)); scaleAt(ringSub, SUBX, SUBY, 0.7 + 0.3 * P(t, mid('why', 0.2), 0.5, pop));
      // why
      op(neq, P(t, mid('why', 0.12), 0.4, linear));
      const pw = P(t, mid('why', 0.34), 0.5, pop), pp = P(t, mid('why', 0.56), 0.5, pop);
      op(wMol, clamp(pw * 2)); tr(wMol, 330, 396 + Math.sin(t * 1.3) * 3 * AMP, Math.max(0.01, 0.6 + 0.4 * pw));
      op(pMol, clamp(pp * 2)); tr(pMol, 870, 396 + Math.sin(t * 1.3 + 1.5) * 3 * AMP, Math.max(0.01, 0.6 + 0.4 * pp));
      op(wLab, P(t, mid('why', 0.4), 0.4, linear)); op(pLab, P(t, mid('why', 0.62), 0.4, linear));
      op(bLab, P(t, mid('why', 0.82), 0.4, linear));
      const pbt = P(t, mid('why', 0.82), 0.5, pop); op(bottle, clamp(pbt * 2)); tr(bottle, 1036, 404, Math.max(0.01, 0.6 + 0.4 * pbt));
    }

    /* ---- the method: three cards, which fly into the strip ---- */
    const a3 = P(t, at('method') - 0.1, 0.5, linear);
    const fly = P(t, at('start') - 0.45, 0.9, ease);
    op(S3, a3 * (fly < 1 ? 1 : 0));
    if (a3 > 0 && fly < 1) {
      mCards.forEach((g, i) => {
        const p = P(t, mid('method', [0.1, 0.46, 0.78][i]), 0.5, pop);
        const cx = lerp(MC[i], sPos[i], fly), cy = lerp(MCY, SY, fly), s = (0.85 + 0.15 * p) * lerp(1, 0.3, fly);
        g.setAttribute('transform', `translate(${(cx - MC[i]).toFixed(1)} ${(cy - MCY).toFixed(1)}) translate(${MC[i]} ${MCY}) scale(${Math.max(0.01, s).toFixed(4)}) translate(${-MC[i]} ${-MCY})`);
        op(g, clamp(p * 2) * (1 - P(fly, 0.55, 0.45, linear)));
      });
      mArrows.forEach((a, i) => { a.set(P(t, mid('method', [0.4, 0.74][i]), 0.4)); op(a, 1 - fly * 3); });
    }
    const aStrip = P(fly, 0.55, 0.45, linear);
    op(strip, aStrip);
    if (aStrip > 0) {
      let act = 0;
      if (t >= at('ans')) act = t < mid('ans', 0.18) ? 1 : t < mid('ans', 0.6) ? 2 : 3;
      else if (t >= at('try')) act = 0;
      else if (t >= at('check')) act = 3;
      else if (t >= at('fixh')) act = 2;
      else if (t >= at('counth')) act = 3;
      else if (t >= at('fixo')) act = 2;
      else if (t >= at('counto')) act = 1;
      sChips.forEach((c, i) => {
        const on = act === i + 1;
        w1(c.box, 'stroke', on ? C.energy : C.line); w1(c.label, 'fill', on ? C.energy : C.muted);
        tr(c, sPos[i], SY, on ? 1.08 : 1);
      });
    }

    /* ---- the worked example: H2 + O2 -> H2O ---- */
    op(eqH, aH); op(molH, aH);
    if (aH > 0) {
      const K = eqH.toks;
      tokIn(K[0], t, mid('start', 0.12)); tokIn(K[1], t, mid('start', 0.42)); tokIn(K[2], t, mid('start', 0.48)); tokIn(K[3], t, mid('start', 0.57)); tokIn(K[4], t, mid('start', 0.65));
      coefIn(K[4], t, mid('fixo', 0.04)); coefIn(K[0], t, mid('fixh', 0.04));
      // reading the finished equation, and "Balanced!"
      [0.5, 0.6, 0.66, 0.74, 0.82].forEach((f, i) => { if (K[i].halo) op(K[i].halo, Math.max(pulse(t, mid('fixh', f), 0.7), pulse(t, mid('check', 0.84) + i * 0.08, 0.7)) * 0.8); });
      op(K[4].chalo, Math.max(pulse(t, mid('fixo', 0.19), 1.0), pulse(t, mid('counth', 0.04), 0.9)) * 0.9);
      placePair(mH2, 250, [206, 294], YS.H2, t, mid('start', 0.14), mid('fixh', 0.24));
      placeOne(mO2, 450, YS.O2, t, mid('start', 0.5));
      placePair(mH2O, 870, [800, 940], YS.H2O, t, mid('start', 0.67), mid('fixo', 0.26));
      // counting glows
      const gLO = Math.max(win(t, mid('counto', 0.02), mid('counto', 0.18), 0.25), win(t, mid('counto', 0.22), mid('counto', 0.46), 0.3), win(t, mid('fixo', 0.6), mid('fixo', 0.9), 0.3), win(t, mid('check', 0.44), mid('check', 0.7), 0.3));
      const gRO = Math.max(win(t, mid('counto', 0.02), mid('counto', 0.18), 0.25), win(t, mid('counto', 0.48), mid('counto', 0.72), 0.3), win(t, mid('fixo', 0.6), mid('fixo', 0.9), 0.3), win(t, mid('check', 0.44), mid('check', 0.7), 0.3));
      const gRH = Math.max(win(t, mid('counth', 0.1), mid('counth', 0.4), 0.3), win(t, mid('counth', 0.8), end('counth'), 0.3), win(t, mid('check', 0.16), mid('check', 0.42), 0.3));
      const gLH = Math.max(win(t, mid('counth', 0.48), mid('counth', 0.76), 0.3), win(t, mid('fixh', 0.3), mid('fixh', 0.5), 0.3), win(t, mid('check', 0.16), mid('check', 0.42), 0.3));
      glowSym(mH2, 'H', gLH * 0.95); glowSym([mO2], 'O', gLO * 0.9); glowSym(mH2O, 'O', gRO * 0.9); glowSym(mH2O, 'H', gRH * 0.95);
    }

    /* ---- your turn: Mg + O2 -> MgO ---- */
    op(eqM, aM); op(molM, aM);
    if (aM > 0) {
      const K = eqM.toks;
      tokIn(K[0], t, mid('try', 0.42)); tokIn(K[1], t, mid('try', 0.54)); tokIn(K[2], t, mid('try', 0.6)); tokIn(K[3], t, mid('try', 0.69)); tokIn(K[4], t, mid('try', 0.77));
      coefIn(K[4], t, mid('ans', 0.2)); coefIn(K[0], t, mid('ans', 0.42));
      [0.68, 0.74, 0.8, 0.86, 0.92].forEach((f, i) => { if (K[i].halo) op(K[i].halo, pulse(t, mid('ans', f), 0.7) * 0.8); });
      placePair(mMg, 250, [206, 294], YS.Mg, t, mid('try', 0.44), mid('ans', 0.45));
      placeOne(mO2b, 450, YS.O2, t, mid('try', 0.62));
      placePair(mMgO, 870, [800, 940], YS.MgO, t, mid('try', 0.78), mid('ans', 0.24));
      const gLO = win(t, mid('ans', 0.01), mid('ans', 0.18), 0.3), gRO = win(t, mid('ans', 0.26), mid('ans', 0.4), 0.3);
      const gMg = Math.max(win(t, mid('ans', 0.4), mid('ans', 0.6), 0.3));
      glowSym([mO2b], 'O', gLO * 0.9); glowSym(mMgO, 'O', gRO * 0.9); glowSym(mMgO, 'Mg', gMg * 0.8); glowSym(mMg, 'Mg', gMg * 0.8);
      const ay = win(t, mid('try', 0.04), at('ans') + 0.1, 0.35);
      op(yourTurn, ay); scaleAt(yourTurn, 620, 616, 0.8 + 0.2 * P(t, mid('try', 0.04), 0.5, pop));
      cd.set(P(t, end('try'), at('ans') - end('try'), linear));
    } else op(yourTurn, 0);
  };
});
