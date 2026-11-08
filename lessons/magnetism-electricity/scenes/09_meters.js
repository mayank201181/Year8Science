/* Chapter: Measuring current and voltage.
   Beats: an ammeter drops into the series loop and reads 0.2 A -> two more read the same
   -> the parallel circuit: 0.4 A + 0.4 A = 0.8 A -> the voltmeter -> voltage is the push
   (the dots carry energy into the bulbs) -> a voltmeter swings in across a bulb
   -> 1.5 V + 1.5 V = 3 V -> the mnemonic card -> a voltmeter in series nearly stops the current. */
scene('meters', S => {
  const { at, end, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;

  /* ---------- local helpers ---------- */
  // a polyline measured exactly like kit wire(), so extra art can ride on its current dots
  function track(pts) {
    const segs = []; let L = 0;
    for (let i = 0; i < pts.length - 1; i++) {
      const l = Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]);
      segs.push([L, l, pts[i], pts[i + 1]]); L += l;
    }
    const pos = s => {
      s = ((s % L) + L) % L;
      for (const [s0, l, a, b] of segs) if (s <= s0 + l) { const p = (s - s0) / (l || 1); return [a[0] + (b[0] - a[0]) * p, a[1] + (b[1] - a[1]) * p]; }
      return pts[pts.length - 1];
    };
    return { L, pos, n: Math.max(2, Math.round(L / 46)) };
  }
  // distance the current dots have moved by time t, from speed keys [[t, px/s], ...] (linear between keys)
  function travel(keys) {
    return t => {
      if (t <= keys[0][0]) return keys[0][1] * t;
      let d = keys[0][1] * keys[0][0];
      for (let i = 0; i < keys.length - 1; i++) {
        const [ta, va] = keys[i], [tb, vb] = keys[i + 1];
        if (t <= tb && tb > ta) { const v = va + (vb - va) * (t - ta) / (tb - ta); return d + (va + v) / 2 * (t - ta); }
        d += (va + vb) / 2 * (tb - ta);
      }
      const [tl, vl] = keys[keys.length - 1];
      return d + vl * (t - tl);
    };
  }
  const noLead = g => { g.firstChild.style.display = 'none'; return g; };      // the wire under it is its lead
  function meterAt(parent, letter, x, y, onWire) {
    const g = meterSym(parent, letter); if (onWire) noLead(g); tr(g, x, y);
    g.rd = g.lastChild; g.rc = [0, -47];                                          // reading text and its centre
    return g;
  }
  function bulbAt(parent, x, y) { const g = noLead(bulbSym(parent)); tr(g, x, y); return g; }
  function batteryAt(parent, x, y) { const g = noLead(cellSym(parent, { cells: 2 })); tr(g, x, y); return g; }
  const junction = (parent, x, y) => E('circle', { cx: x, cy: y, r: 7, fill: C.ink }, parent);
  const pathD = pts => 'M' + pts.map(p => p[0] + ',' + p[1]).join(' L');
  const lead = (parent, pts) => E('path', { d: pathD(pts), fill: 'none', stroke: WIRE, 'stroke-width': 5, 'stroke-linejoin': 'round', 'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': '1 1' }, parent);
  const draw = (el, p) => el.setAttribute('stroke-dashoffset', (1 - clamp(p)).toFixed(4));
  const rdScale = (g, k) => g.rd.setAttribute('transform', `translate(${g.rc[0]} ${g.rc[1]}) scale(${Math.max(0.01, k).toFixed(3)}) translate(${-g.rc[0]} ${-g.rc[1]})`);
  // a reading that pops up at t1
  function reading(g, t, t1, str, flash) {
    if (t < t1) { g.set(''); return; }
    g.set(str); rdScale(g, P(t, t1, 0.4, pop) * (1 + 0.32 * (flash || 0)));
  }
  // a meter falls onto its spot on the wire with a little bounce
  function dropIn(g, t, t0, x, y) {
    if (t < t0) { op(g, 0); return; }
    const p = P(t, t0, 0.55, pop);
    op(g, clamp((t - t0) / 0.15)); tr(g, x, y - (1 - p) * 190);
  }
  // a voltmeter on its own little branch: it swings in, then its leads reach out and clip on
  function vBranch(parent, xm, ym, xa, xb, yw, from) {
    const g = G(parent);
    const l1 = lead(g, [[xm - 46, ym], [xa, ym], [xa, yw]]), l2 = lead(g, [[xm + 46, ym], [xb, ym], [xb, yw]]);
    const m = meterAt(g, 'V', xm, ym, false);
    const j1 = junction(g, xa, yw), j2 = junction(g, xb, yw);
    return { g, l1, l2, m, j1, j2, xm, ym, from };
  }
  function swingIn(V, t, t0) {
    if (t < t0) { op(V.g, 0); return; }
    op(V.g, 1);
    const p = P(t, t0, 0.85, easeOut), q = 1 - p;
    tr(V.m, V.xm + V.from[0] * q, V.ym + V.from[1] * q - Math.sin(p * Math.PI) * 26 * Math.sign(V.from[1]), 1, 24 * q * q);
    op(V.m, clamp((t - t0) / 0.2));
    const ta = t0 + 0.85;
    draw(V.l1, P(t, ta, 0.35, linear)); draw(V.l2, P(t, ta, 0.35, linear));
    const jp = P(t, ta + 0.3, 0.3, pop); attr(V.j1, 'r', 7 * jp); attr(V.j2, 'r', 7 * jp);
  }
  const lab = (parent, str, y, size, o) => T(parent, 600, y, str, Object.assign({ size, weight: 600, anchor: 'middle', boldFill: C.energy }, o || {}));

  /* ================= the series loop: 3 V battery, two bulbs ================= */
  const SL = 230, SR = 970, ST = 280, SB = 480, CX = 600, BX = [470, 730], AX = [340, 600, 860];
  const SG = G(root);
  const loopPts = [[CX - 25, SB], [SL, SB], [SL, ST], [SR, ST], [SR, SB], [CX + 25, SB]];
  const loopT = track(loopPts);
  // a glow that runs once round the loop, through the ammeter ("in the loop")
  const comet = E('path', { d: pathD(loopPts), fill: 'none', stroke: C.energy, 'stroke-width': 18, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', pathLength: 1, 'stroke-dasharray': '0.12 2' }, SG);
  // the voltmeter's branch lights up to show "across"
  const vHi = E('path', { d: pathD([[405, ST], [405, 175], [535, 175], [535, ST]]), fill: 'none', stroke: C.air, 'stroke-width': 18, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', pathLength: 1, 'stroke-dasharray': '1 1' }, SG);
  const sWire = wire(SG, loopPts);
  const haloG = G(SG), halos = [];
  for (let k = 0; k < loopT.n; k++) halos.push(E('circle', { r: 18, fill: glow(C.energy) }, haloG));
  const sB1 = (CX - 25 - SL) + (SB - ST) + (BX[0] - SL), sB2 = sB1 + (BX[1] - BX[0]);   // where the bulbs sit along the loop
  const batGlow = E('ellipse', { cx: CX, cy: SB, rx: 110, ry: 72, fill: glow(C.energy) }, SG);
  batteryAt(SG, CX, SB);
  const rays = BX.map(x => {
    const g = G(SG); tr(g, x, ST);
    for (let i = 0; i < 8; i++) { const a = i / 8 * TAU + 0.39; E('line', { x1: Math.cos(a) * 38, y1: Math.sin(a) * 38, x2: Math.cos(a) * 52, y2: Math.sin(a) * 52, stroke: C.energy, 'stroke-width': 4, 'stroke-linecap': 'round' }, g); }
    return g;
  });
  const bulbs = BX.map(x => bulbAt(SG, x, ST));
  const flashG = AX.map(x => E('circle', { cx: x, cy: ST - 47, r: 44, fill: glow(C.energy) }, SG));
  const ams = AX.map(x => meterAt(SG, 'A', x, ST, true));
  const vw = meterAt(SG, 'V', AX[0], ST, true);
  const wRing = E('circle', { cx: AX[0], cy: ST, r: 44, fill: 'none', stroke: C.bad, 'stroke-width': 5, 'stroke-dasharray': '11 8' }, SG);
  const V1 = vBranch(SG, BX[0], 175, 405, 535, ST, [250, -150]);
  const V2 = vBranch(SG, BX[1], 175, 665, 795, ST, [250, -150]);
  const V3 = vBranch(SG, CX, 595, 515, 685, SB, [260, 110]);       // its reading sits inside its branch, under the battery

  // labels for the series beats
  const lAm = G(root);
  lab(lAm, 'An **ammeter** measures **current**', 652, 38);
  const lAm2 = lab(root, 'in **amps (A)**, connected **in series**: in the loop', 702, 31, { boldFill: C.ink, fill: C.muted });
  const cSame = chip(root, 'the same current all the way round', { size: 32, fill: C.card2, stroke: C.energy }); tr(cSame, 600, 670);
  const lPush = T(root, CX, 556, '**push** from the cell', { size: 29, weight: 600, anchor: 'middle', boldFill: C.energy });
  const lEn = T(root, CX, 196, '**energy** transferred', { size: 29, weight: 600, anchor: 'middle', boldFill: C.energy });
  const lAcross = lab(root, '**in parallel**: across the bulb, on its own branch', 668, 33, { boldFill: C.air });
  const cSum = chip(root, '1.5 V + 1.5 V = 3 V', { size: 34, fill: C.card2, stroke: C.energy }); tr(cSum, 600, 686);
  const lWrong = G(root);
  const wTxt = 'a voltmeter **in series**', wW = textWidth(wTxt, 36, FD, 600);
  T(lWrong, 600 - 26, 656, wTxt, { size: 36, weight: 600, anchor: 'middle', boldFill: C.bad });
  const wX = cross(lWrong, 15); tr(wX, 600 - 26 + wW / 2 + 34, 644);
  lab(lWrong, 'almost no current gets through it', 704, 29, { weight: 500, fill: C.muted });

  /* ================= the parallel circuit ================= */
  const PT = 200, PM = 340, PB = 480;
  const PG = G(root);
  const pS1 = wire(PG, [[CX - 25, PB], [SL, PB], [SL, PM]]);
  const pBa = wire(PG, [[SL, PM], [SR, PM]]);
  const pBb = wire(PG, [[SL, PM], [SL, PT], [SR, PT], [SR, PM]]);
  const pS2 = wire(PG, [[SR, PM], [SR, PB], [CX + 25, PB]]);
  batteryAt(PG, CX, PB);
  [PT, PM].forEach(y => bulbAt(PG, 700, y).set(1));
  const pAms = [[400, PT], [400, PM], [400, PB]].map(([x, y]) => meterAt(PG, 'A', x, y, true));
  junction(PG, SL, PM); junction(PG, SR, PM);
  const cPar = chip(root, '0.4 A + 0.4 A = 0.8 A', { size: 34, fill: C.card2, stroke: C.energy }); tr(cPar, 600, 600);
  const lPar = lab(root, 'the branches add up to the total', 664, 29, { weight: 500, fill: C.muted });

  /* ================= the voltmeter ================= */
  const VG = G(root);
  const bigV = meterSym(VG, 'V');
  const vName = T(VG, 600, 462, 'voltmeter', { size: 56, weight: 700, anchor: 'middle' });
  const vWhat = lab(VG, 'measures **voltage**', 532, 38);
  const vPd = lab(VG, 'also called **potential difference**', 580, 31, { boldFill: C.ink, fill: C.muted });
  const vUnit = chip(VG, 'reads in volts (V)', { size: 32, fill: C.card2, stroke: C.energy }); tr(vUnit, 600, 656);

  /* ================= the mnemonic card ================= */
  const MG = G(root);
  card(MG, 130, 160, 940, 440, { fill: C.card, stroke: C.line });
  T(MG, 600, 222, 'Remember', { size: 30, weight: 600, anchor: 'middle', fill: C.muted });
  const mRow1 = G(MG), mRow2 = G(MG);
  const mW1 = wire(mRow1, [[190, 322], [450, 322]]);
  meterAt(mRow1, 'A', 320, 322, true);
  T(mRow1, 496, 336, '**A**mmeter: **A**lways in a line', { size: 40, weight: 600, boldFill: C.energy });
  const mW2 = wire(mRow2, [[190, 512], [450, 512]]);
  bulbAt(mRow2, 320, 512).set(0.7);
  lead(mRow2, [[255, 512], [255, 428], [274, 428]]); lead(mRow2, [[366, 428], [385, 428], [385, 512]]);
  meterAt(mRow2, 'V', 320, 428, false);
  junction(mRow2, 255, 512); junction(mRow2, 385, 512);
  T(mRow2, 496, 484, '**V**oltmeter: **V**erily across', { size: 40, weight: 600, boldFill: C.energy });

  /* ================= timing ================= */
  const tSlow = mid('wrong', 0.36);
  const dS = travel([[0, 30], [tSlow, 30], [tSlow + 1.1, 2]]);
  const tA1 = mid('ammeter', 0.12), tA2 = mid('anywhere', 0.04), tA3 = mid('anywhere', 0.17);
  const tFlash = mid('anywhere', 0.5);
  const tV1 = mid('across', 0.06), tV2 = mid('readings', 0.0), tV3 = mid('readings', 0.17);

  return t => {
    /* ----- series loop: three appearances ----- */
    const ph1 = t < at('branches'), ph3 = t >= at('wrong') - 0.3, ph2 = !ph1 && !ph3;
    const sOp = ph1 ? 1 - P(t, at('branches') - 0.45, 0.4, linear)
      : ph2 ? P(t, at('push') - 0.3, 0.4, linear) * (1 - P(t, at('mnemonic') - 0.3, 0.4, linear))
      : P(t, at('wrong') - 0.3, 0.4, linear);
    op(SG, sOp);
    if (sOp > 0) {
      const d = dS(t);
      sWire.upd(d, 1);
      const bright = 0.4 * (1 - 0.95 * P(t, tSlow, 0.9, linear));
      bulbs.forEach(b => b.set(bright));

      // ammeters: one, then three, all reading the same; in the last beat the first one lifts out
      const fl = Math.max(Math.sin(Math.PI * P(t, tFlash, 0.5, linear)), Math.sin(Math.PI * P(t, tFlash + 0.75, 0.5, linear)));
      if (ph1) {
        [tA1, tA2, tA3].forEach((t0, i) => { dropIn(ams[i], t, t0, AX[i], ST); reading(ams[i], t, t0 + 0.5, '0.2 A', fl); op(flashG[i], fl * 0.9); });
      } else {
        ams.forEach((a, i) => { if (i || ph2) op(a, 0); op(flashG[i], 0); });
        if (ph3) {
          const up = P(t, mid('wrong', 0.07), 0.55, easeIn);
          tr(ams[0], AX[0], ST - 210 * up); op(ams[0], 1 - P(t, mid('wrong', 0.07) + 0.3, 0.25, linear));
          reading(ams[0], t, 0, '0.2 A');
        }
      }
      // the comet runs round the loop once: the current flows through the ammeter
      const c0 = mid('ammeter', 0.66), cp = P(t, c0, 2.3, linear);
      op(comet, ph1 ? 0.5 * win(t, c0, c0 + 2.3, 0.3) : 0);
      if (ph1) comet.setAttribute('stroke-dashoffset', (0.12 - 1.12 * cp).toFixed(4));

      // voltage as a push: dots leave the cell glowing and hand their energy to the bulbs
      const hOn = ph2 ? win(t, mid('push', 0.04), at('across') + 0.3, 0.45) : 0;
      op(haloG, hOn); op(batGlow, hOn * (0.55 + 0.3 * wave(t, 1.1) * calm));
      rays.forEach((g, i) => { op(g, hOn * (0.45 + 0.4 * wave(t, 0.9, i * 0.4) * calm)); });
      if (hOn > 0) {
        halos.forEach((h, k) => {
          const s = ((k * loopT.L / loopT.n + d) % loopT.L + loopT.L) % loopT.L;
          const e = 1 - 0.5 * clamp((s - sB1 + 22) / 44) - 0.5 * clamp((s - sB2 + 22) / 44);
          const q = loopT.pos(s);
          attr(h, 'cx', q[0]); attr(h, 'cy', q[1]); attr(h, 'r', 8 + 12 * e); h.style.opacity = Math.pow(e, 0.6).toFixed(3);
        });
      }

      // voltmeters, each on its own branch
      if (ph2) {
        swingIn(V1, t, tV1); swingIn(V2, t, tV2); swingIn(V3, t, tV3);
        reading(V1.m, t, mid('readings', 0.5), '1.5 V'); reading(V2.m, t, mid('readings', 0.5), '1.5 V');
        reading(V3.m, t, mid('readings', 0.36), '3 V');
        const hp = P(t, mid('across', 0.48), 0.9, linear);
        op(vHi, hp > 0 ? 0.5 * (1 - P(t, at('readings') + 0.2, 0.5, linear)) : 0); draw(vHi, hp);
      } else { op(V1.g, 0); op(V2.g, 0); op(V3.g, 0); op(vHi, 0); }

      // a voltmeter dropped into the loop by mistake
      if (ph3) {
        dropIn(vw, t, mid('wrong', 0.2), AX[0], ST); vw.set('');
        const rp = P(t, mid('wrong', 0.46), 0.4, pop);
        op(wRing, clamp(rp * 2)); attr(wRing, 'r', 44 * Math.max(0.01, rp)); wRing.setAttribute('stroke-dashoffset', (-t * 12 * calm).toFixed(1));
      } else { op(vw, 0); op(wRing, 0); }
    }

    /* ----- series labels ----- */
    op(lAm, win(t, mid('ammeter', 0.22), at('anywhere') - 0.05, 0.4));
    op(lAm2, win(t, mid('ammeter', 0.48), at('anywhere') - 0.05, 0.4));
    op(cSame, win(t, mid('anywhere', 0.58), at('branches') - 0.3, 0.4));
    op(lPush, win(t, mid('push', 0.12), at('across') - 0.05, 0.4));
    op(lEn, win(t, mid('push', 0.56), at('across') - 0.05, 0.4));
    op(lAcross, win(t, mid('across', 0.56), at('readings') - 0.05, 0.4));
    op(cSum, win(t, mid('readings', 0.78), at('mnemonic') - 0.15, 0.4));
    op(lWrong, P(t, mid('wrong', 0.5), 0.45, linear));

    /* ----- parallel circuit ----- */
    const pOp = win(t, at('branches') - 0.25, at('voltmeter') - 0.05, 0.45);
    op(PG, pOp);
    if (pOp > 0) {
      pS1.upd(120 * t, 1); pS2.upd(120 * t, 1); pBa.upd(60 * t, 1); pBb.upd(60 * t, 1);
      const pt0 = [mid('branches', 0.06), mid('branches', 0.16), mid('branches', 0.3)];
      const pg = Math.sin(Math.PI * P(t, mid('branches', 0.62), 0.6, linear));
      pAms.forEach((a, i) => { dropIn(a, t, pt0[i], 400, [PT, PM, PB][i]); reading(a, t, pt0[i] + 0.5, i < 2 ? '0.4 A' : '0.8 A', pg); });
    }
    op(cPar, win(t, mid('branches', 0.55), at('voltmeter') - 0.1, 0.4));
    op(lPar, win(t, mid('branches', 0.7), at('voltmeter') - 0.1, 0.4));

    /* ----- the voltmeter ----- */
    const vOp = win(t, at('voltmeter') - 0.3, at('push') - 0.05, 0.4);
    op(VG, vOp);
    if (vOp > 0) {
      const bp = P(t, at('voltmeter') - 0.2, 0.7, pop);
      tr(bigV, 600, 300, 2.4 * (0.7 + 0.3 * bp));
      op(vName, P(t, at('voltmeter') + 0.1, 0.5, linear));
      op(vWhat, P(t, mid('voltmeter', 0.08), 0.45, linear));
      op(vPd, P(t, mid('voltmeter', 0.3), 0.45, linear));
      const up = P(t, mid('voltmeter', 0.62), 0.5, pop); op(vUnit, clamp(up * 2)); tr(vUnit, 600, 656, 0.8 + 0.2 * up);
    }

    /* ----- the mnemonic ----- */
    const mOp = win(t, at('mnemonic') - 0.2, at('wrong') + 0.05, 0.4);
    op(MG, mOp);
    if (mOp > 0) {
      const r1 = P(t, at('mnemonic') - 0.1, 0.5, easeOut), r2 = P(t, mid('mnemonic', 0.46), 0.5, easeOut);
      op(mRow1, r1); tr(mRow1, (1 - r1) * 24, 0);
      op(mRow2, r2); tr(mRow2, (1 - r2) * 24, 0);
      mW1.upd(30 * t, 1); mW2.upd(30 * t, 1);
    }
  };
});
