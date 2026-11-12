/* Scene 0: Cold open (no chapter card).
   The flat, 34 °C, aircon on: Kavya, 12 -> Mum's off-screen "using up all the energy!" -> Kavya: "can't be
   used up" -> HALF RIGHT x2 -> the electricity meter in the corridor -> documentary zoom through its digit window
   into the office of Constance & Co. -> Constance's confessional (the law, on a ledger page) -> the shelf of
   failed free-energy machines -> case file 14 opened -> title card with the cast. */
scene('cold', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;

  /* ---------- local helpers ---------- */
  const on = (t, a, b) => (t >= a && t < b ? 1 : 0);          // hard sitcom cut
  const view = (el, k, fx, fy, sx, sy) => el.setAttribute('transform', `translate(${sx.toFixed(1)} ${sy.toFixed(1)}) scale(${k.toFixed(4)}) translate(${(-fx).toFixed(1)} ${(-fy).toFixed(1)})`);
  const popIn = (el, t, t0, x, y, s, r) => { const p = P(t, t0, 0.45, pop); op(el, clamp(p * 2.5)); tr(el, x, y, Math.max(0.01, (s || 1) * (0.6 + 0.4 * p)), r); };
  const pill = (parent, text, o) => { o = o || {}; return chip(parent, text, { size: o.size || 30, fill: o.fill || 'rgba(10,27,39,0.88)', stroke: o.stroke || C.line, sw: 2, color: o.color || C.ink, weight: 700 }); };

  /* layers: sets, cast, props/labels, HUD */
  const Lbg = G(root), Lcast = G(root), Lfg = G(root), Lhud = G(root);

  /* ================= A: the flat ================= */
  const flatShot = G(Lbg), flatWrap = G(flatShot);
  const flat = enFlat(flatWrap);
  const aChips = G(Lfg);
  const cKav = pill(aChips, 'Kavya, age 12', { size: 34 });
  const cSat = pill(aChips, 'Saturday', { size: 30 });
  const thermo = G(aChips); const thm = thermometer(thermo, 150, C.bad);
  const c34 = chip(aChips, '34 °C outside', { size: 36, fill: '#E8424F', color: '#FFFFFF', stroke: '#FFFFFF', sw: 3 });
  const cAc = pill(aChips, 'aircon: ON since breakfast', { size: 28, color: '#7FD3FF', stroke: '#7FD3FF' });
  const mumB = enBubble(Lfg, "Kavya! Switch off the aircon!\nYou're using up all the energy!", { size: 30, tail: 'left' });
  const cCant = pill(Lfg, "energy can't be destroyed ✓", { size: 30, color: C.good, stroke: C.good });
  const halfK = chip(Lfg, 'HALF RIGHT', { size: 34, fill: '#FFE45C', color: SC_INK, stroke: SC_INK, sw: 4 });
  const halfM = chip(Lfg, 'HALF RIGHT', { size: 34, fill: '#FFE45C', color: SC_INK, stroke: SC_INK, sw: 4 });
  const ltKavya = scLowerThird(Lhud, 'KAVYA, 12', 'Half right.');

  /* ================= B: the corridor and the meter, zoom into it ================= */
  const corShot = G(Lbg), corWrap = G(corShot);
  const cor = enCorridor(corWrap);
  const WIN = [240, 305];                       // the meter's digit window (corridor coordinates)
  const meterChip = pill(Lfg, 'the electricity meter', { size: 32, color: C.energy, stroke: C.energy });
  const finder = G(Lhud);
  E('path', { d: 'M40,140 L40,40 L140,40 M1060,40 L1160,40 L1160,140 M1160,610 L1160,710 L1060,710 M140,710 L40,710 L40,610', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 5, opacity: 0.8 }, finder);
  const zoomTxt = T(finder, 1130, 690, 'ZOOM ×1', { size: 30, weight: 700, anchor: 'end', fill: '#FFFFFF' });
  const reticle = G(Lfg);
  E('rect', { x: -70, y: -40, width: 140, height: 80, rx: 8, fill: 'none', stroke: '#FFFFFF', 'stroke-width': 4, 'stroke-dasharray': '14 10' }, reticle);

  /* ================= C/F: the office ================= */
  const offShot = G(Lbg), offWrap = G(offShot);
  const office = enOffice(offWrap);
  const caseF = G(Lfg);
  E('rect', { x: -230, y: -150, width: 460, height: 300, rx: 10, fill: '#E8C77A', stroke: '#9C7A2E', 'stroke-width': 4 }, caseF);
  E('path', { d: 'M-230,-140 L-230,-168 Q-230,-176 -222,-176 L-90,-176 Q-80,-176 -76,-166 L-70,-150 Z', fill: '#E8C77A', stroke: '#9C7A2E', 'stroke-width': 4 }, caseF);
  T(caseF, 0, -86, 'CASE 14', { size: 50, weight: 800, anchor: 'middle', fill: '#5A3A1A', ls: 3 });
  T(caseF, 0, -32, 'THE MISSING JOULES', { size: 36, weight: 800, anchor: 'middle', fill: '#8A2A1A' });
  T(caseF, -196, 30, "Complaint: energy 'used up'", { size: 28, weight: 600, fill: '#5A3A1A', font: FB });
  T(caseF, -196, 70, 'Location: flat #08-34', { size: 28, weight: 600, fill: '#5A3A1A', font: FB });
  const stOpen = enStamp(caseF, 'OPEN', '#1E9E5A'); tr(stOpen, 110, 108, 0.7);

  /* ================= D: the confessional ================= */
  const conf = enConf(Lbg, 'con');
  const ltCon = scLowerThird(Lhud, 'CONSTANCE', 'Law of Conservation of Energy. Senior auditor.');
  const plaque = G(Lfg);
  E('rect', { x: -250, y: -95, width: 500, height: 190, rx: 16, fill: '#0B1F1A', stroke: '#E2B33C', 'stroke-width': 5 }, plaque);
  T(plaque, 0, -38, 'THE LAW OF', { size: 32, weight: 700, anchor: 'middle', fill: '#CFE7DF' });
  T(plaque, 0, 22, 'CONSERVATION', { size: 54, weight: 800, anchor: 'middle', fill: '#E2B33C', ls: 2 });
  T(plaque, 0, 68, 'OF ENERGY', { size: 32, weight: 700, anchor: 'middle', fill: '#CFE7DF' });
  // the law, on a ledger page
  const law = G(Lfg);
  enBoard(law, 520, 360, 'THE LAW');
  const lawRows = [
    T(law, -186, -42, 'Energy cannot be **created**', { size: 32, weight: 600, fill: SC_INK, boldFill: '#C62828' }),
    T(law, -186, 4, 'or **destroyed**.', { size: 32, weight: 600, fill: SC_INK, boldFill: '#C62828' }),
    T(law, -186, 50, 'It can only be **transferred**', { size: 32, weight: 600, fill: SC_INK, boldFill: '#1E9E5A' }),
  ];
  const lawX1 = cross(law, 14); tr(lawX1, 220, -54);
  const lawX2 = cross(law, 14); tr(lawX2, 60, -8);
  const lawFlow = G(law);
  const bx = (x, lab, col) => { const b = G(lawFlow); tr(b, x, 120); E('rect', { x: -78, y: -28, width: 156, height: 56, rx: 12, fill: col, stroke: SC_INK, 'stroke-width': 3 }, b); T(b, 0, 10, lab, { size: 26, weight: 800, anchor: 'middle', fill: SC_INK }); return b; };
  bx(-130, 'store A', '#FFC247'); bx(150, 'store B', '#5B8DEF');
  const lawArrow = arrow(lawFlow, -44, 120, 64, 120, { color: '#1E9E5A', width: 7 });
  const lawTick = tick(law, 16); tr(lawTick, 230, 40);
  // never: the shelf of failed free-energy machines
  const fail = G(Lfg);
  E('rect', { x: -260, y: 90, width: 520, height: 18, fill: '#8B5A2B', stroke: '#5A3A1A', 'stroke-width': 3 }, fail);
  const fTitle = T(fail, 0, -170, 'FREE ENERGY MACHINES', { size: 30, weight: 800, anchor: 'middle', fill: '#FFE6B0' });
  const m1 = G(fail); tr(m1, -170, 20);       // overbalanced wheel
  E('circle', { r: 62, fill: 'none', stroke: '#C9D3DC', 'stroke-width': 6 }, m1);
  const m1s = G(m1);
  for (let k = 0; k < 8; k++) { const a = k / 8 * TAU; E('line', { x1: 0, y1: 0, x2: Math.cos(a) * 62, y2: Math.sin(a) * 62, stroke: '#C9D3DC', 'stroke-width': 3 }, m1s); E('circle', { cx: Math.cos(a) * 62, cy: Math.sin(a) * 62, r: 9, fill: '#8F9CAB', stroke: SC_INK, 'stroke-width': 2 }, m1s); }
  E('path', { d: 'M0,0 L-20,70 M0,0 L20,70', stroke: '#8B5A2B', 'stroke-width': 6 }, m1);
  const m2 = G(fail); tr(m2, 10, 50);         // magnet car
  E('rect', { x: -60, y: -30, width: 120, height: 40, rx: 8, fill: '#5B8DEF', stroke: SC_INK, 'stroke-width': 3 }, m2);
  E('circle', { cx: -36, cy: 16, r: 14, fill: '#2A3B44' }, m2); E('circle', { cx: 36, cy: 16, r: 14, fill: '#2A3B44' }, m2);
  E('path', { d: 'M40,-30 L40,-70 L100,-70', fill: 'none', stroke: '#C9D3DC', 'stroke-width': 4 }, m2);
  const mag = magnet(m2, 60, 24); tr(mag, 110, -70, 1, 90);
  const m3 = G(fail); tr(m3, 180, 30);        // a box with a crank and a bulb
  E('rect', { x: -50, y: -40, width: 100, height: 100, rx: 8, fill: '#B07A45', stroke: SC_INK, 'stroke-width': 3 }, m3);
  T(m3, 0, 20, '?!', { size: 40, weight: 800, anchor: 'middle', fill: '#FFE6B0' });
  E('circle', { cx: 0, cy: -66, r: 22, fill: '#FFF7C2', stroke: SC_INK, 'stroke-width': 3 }, m3);
  E('path', { d: 'M50,0 L76,0 L76,26', fill: 'none', stroke: SC_INK, 'stroke-width': 5 }, m3);
  const fx = [[-170, -60], [10, -70], [180, -100]].map(([x, y]) => { const c = cross(fail, 22); tr(c, x + 50, y); return c; });
  const cnt1 = pill(Lfg, 'Times broken: 0', { size: 34, color: C.good, stroke: C.good });
  const cnt2 = pill(Lfg, 'in 13.8 billion years', { size: 30, color: '#E2B33C', stroke: '#E2B33C' });

  /* ================= G: title card ================= */
  const titleShot = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#0E2A24', '#1D4F42', true) }, titleShot);
  let rays = '';
  for (let i = 0; i < 16; i++) { const a0 = i / 16 * TAU, a1 = a0 + TAU / 40; rays += `M0,0 L${(Math.cos(a0) * 1100).toFixed(0)},${(Math.sin(a0) * 1100).toFixed(0)} L${(Math.cos(a1) * 1100).toFixed(0)},${(Math.sin(a1) * 1100).toFixed(0)} Z `; }
  const rayP = E('path', { d: rays, fill: '#FFE45C', opacity: 0.07 }, titleShot);
  E('ellipse', { cx: 600, cy: 560, rx: 560, ry: 190, fill: glow('#E2B33C'), opacity: 0.3 }, titleShot);
  const logo = G(Lfg);
  const logoT = T(logo, 0, 0, 'EVERY JOULE COUNTS', { size: 76, weight: 800, anchor: 'middle', fill: '#FFE45C' });
  enOutlineText(logoT, '#5A3A07', 12);
  const coins = [-1, 1].map(sd => { const c = G(logo); tr(c, sd * 480, -26); E('circle', { r: 36, fill: ball('#FFE45C', '#D49A12'), stroke: SC_INK, 'stroke-width': 4 }, c); T(c, 0, 12, 'J', { size: 36, weight: 800, anchor: 'middle', fill: '#8A6508' }); return c; });
  const epi = T(Lfg, 600, 300, 'Episode 14: The Case of the Missing Joules', { size: 40, weight: 700, anchor: 'middle', fill: '#FFFFFF' });

  /* ================= the cast ================= */
  const kav = cast(Lcast, 'kavya', { mood: 'deadpan' });
  const con = cast(Lcast, 'con');
  const ROW = [['jules', 'happy'], ['pat', 'neutral'], ['theo', 'sad'], ['effie', 'smug'], ['colin', 'annoyed'], ['gerald', 'deadpan']];
  const extras = ROW.map(([k, mood], i) => ({ c: cast(Lcast, k, { mood }), k, mood, i }));

  const blackout = E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#000000' }, Lhud);

  /* cut points */
  const cB = at('meter') - 0.08, cC = mid('inside', 0.38), cD = at('hi') - 0.06, cDn = at('never') - 0.06,
    cE = at('case') - 0.06, cG = at('title') - 0.06;

  return t => {
    op(blackout, 1 - P(t, 0, 0.6, linear));
    const sA = on(t, -1, cB), sB = on(t, cB, cC + 0.7), sC = on(t, cC, cD), sD = on(t, cD, cE), sE = on(t, cE, cG), sG = on(t, cG, 1e9);
    let kavShown = 0, conShown = 0;

    /* ---------- A: the flat ---------- */
    op(flatShot, sA);
    if (sA) {
      flat.upd(t, 1); flat.clock(13 + t / 600);
      const push = P(t, 0, cB, linear);
      view(flatWrap, 1 + 0.05 * push, 520, 420, 520, 420);
      const frozen = t >= at('half') - 0.05;
      kavShown = 1; op(kav, 1);
      tr(kav, 560, 505, 1.25 * (1 + 0.05 * push));
      let mood = 'deadpan', look = 0;
      if (t >= at('mum') && t < at('actually')) { mood = t < mid('mum', 0.3) ? 'shock' : 'annoyed'; look = -0.9; }
      else if (t >= at('actually') && t < at('half')) { mood = t < mid('actually', 0.2) ? 'neutral' : 'smug'; look = 0; }
      else if (frozen) { mood = t < mid('half', 0.55) ? 'smug' : 'deadpan'; look = t > mid('half', 0.55) ? -0.85 : 0; }
      kav.set({ t: frozen ? at('half') : t, talk: scTalk(S, t, 'kavya'), mood, look, still: frozen });
      // A1 chips (kavya line)
      const f1 = 1 - P(t, end('kavya') + 0.1, 0.25, linear);
      op(aChips, f1);
      if (f1) {
        popIn(cKav, t, mid('kavya', 0.05), 900, 470);
        popIn(cSat, t, mid('kavya', 0.3), 900, 540);
        const pt = P(t, mid('kavya', 0.45), 0.45, pop);
        op(thermo, clamp(pt * 2.5)); tr(thermo, 1110, 400, Math.max(0.01, 0.7 + 0.3 * pt)); thm.set(0.25 + 0.65 * P(t, mid('kavya', 0.45), 1.4, ease));
        popIn(c34, t, mid('kavya', 0.5), 960, 250, 1, -3);
        popIn(cAc, t, mid('kavya', 0.75), 440, 250);
      }
      // Mum's off-screen bubble from the kitchen doorway
      const mb = win(t, at('mum') - 0.05, end('mum') + 0.5, 0.15) * (t < at('mum') ? 0 : 1);
      op(mumB, mb); if (mb) tr(mumB, 455 + 4 * Math.sin(t * 40) * (t < mid('mum', 0.4) ? AMP : 0), 300, 0.9 + 0.1 * P(t, at('mum'), 0.3, pop));
      // actually
      ltKavya.set(win(t, at('actually') + 0.1, at('actually') + 3.2, 0.3));
      const cc = win(t, mid('actually', 0.45), end('half') + 0.5, 0.25);
      op(cCant, cc); if (cc) tr(cCant, 900, 300);
      // half: two HALF RIGHT tags
      const hk = P(t, at('half') + 0.15, 0.4, pop), hm = P(t, mid('half', 0.42), 0.4, pop);
      op(halfK, clamp(hk * 3)); tr(halfK, 560, 320, Math.max(0.01, 0.5 + 0.5 * hk), -8);
      op(halfM, clamp(hm * 3)); tr(halfM, 140, 300, Math.max(0.01, 0.5 + 0.5 * hm), 7);
    } else { op(aChips, 0); op(mumB, 0); op(cCant, 0); op(halfK, 0); op(halfM, 0); ltKavya.set(0); }

    /* ---------- B: corridor, push in, zoom through the digit window ---------- */
    op(corShot, sB ? 1 - P(t, cC + 0.1, 0.6, linear) : 0);
    op(finder, sB); op(reticle, 0); op(meterChip, 0);
    if (sB) {
      cor.upd(t);
      const p1 = P(t, cB, end('meter') - cB, ease);                      // meter line: slow push
      const p2 = P(t, at('inside') - 0.1, cC + 0.6 - at('inside'), easeIn); // inside line: the big zoom
      const k = (1 + 0.9 * p1) * Math.pow(16, p2);
      const sx0 = Math.min(lerp(WIN[0], 420, p1), k * WIN[0]), sy0 = lerp(WIN[1], 340, p1);
      view(corWrap, k, WIN[0], WIN[1], sx0 + (600 - sx0) * p2, sy0 + (375 - sy0) * p2);
      setText(zoomTxt, 'ZOOM ×' + (k >= 10 ? String(Math.round(k)) : k.toFixed(1)));
      const mc = win(t, mid('meter', 0.5), at('inside') + 0.3, 0.25);
      op(meterChip, mc); if (mc) tr(meterChip, 860, 560);
      const rt = win(t, mid('meter', 0.6), mid('inside', 0.3), 0.2);
      op(reticle, rt); if (rt) tr(reticle, sx0 + (600 - sx0) * p2, sy0 + (375 - sy0) * p2, (1 + 0.9 * p1) * 0.9 * (1 + p2 * 3), 0);
    }

    /* ---------- C: the office appears through the window; E: the case ---------- */
    op(offShot, sC ? P(t, cC, 0.6, linear) : sE);
    op(caseF, 0);
    if (sC) {
      const k = lerp(0.25, 1, P(t, cC, 1.0, easeOut));
      view(offWrap, k * (1 + 0.04 * P(t, cC + 1, 4, linear)), 600, 375, 600, 375);
      conShown = 1; op(con, P(t, cC + 0.3, 0.4, linear));
      const up = t > end('inside') - 0.05;
      tr(con, lerp(600, 440, P(t, cC, 1.0, easeOut)), lerp(375, 400, P(t, cC, 1.0, easeOut)), lerp(0.25, 1.05, P(t, cC, 1.0, easeOut)));
      con.set({ t, talk: 0, mood: up ? 'deadpan' : 'neutral', look: up ? 0 : 0.8, still: !up });
    }
    if (sE) {
      view(offWrap, 1 + 0.04 * P(t, cE, cG - cE, linear), 600, 375, 600, 375);
      conShown = 1; op(con, 1);
      tr(con, 330, 410, 1.3);
      const shut = t > mid('case', 0.65);
      con.set({ t, talk: scTalk(S, t, 'con'), mood: t < mid('case', 0.3) ? 'annoyed' : 'deadpan', look: t > mid('case', 0.55) ? 0.7 : 0 });
      const fp = P(t, mid('case', 0.42), 0.5, easeOut);
      op(caseF, clamp(fp * 3)); tr(caseF, lerp(1400, 860, fp), 330, 0.95, lerp(14, -3, fp));
      stOpen.set(P(t, mid('case', 0.75), 0.35, linear)); if (!shut) op(stOpen, 0);
    }

    /* ---------- D: confessional: hi, law, never ---------- */
    conf.set(sD, t);
    op(plaque, 0); op(law, 0); op(fail, 0); op(cnt1, 0); op(cnt2, 0);
    if (sD) {
      const close = t >= cDn;
      const push = close ? P(t, cDn, cE - cDn, linear) : P(t, cD, cDn - cD, linear);
      const k = close ? 1.0 : 1 + 0.04 * push;
      conf.setAttribute('transform', `translate(430 400) scale(${k.toFixed(4)}) translate(-430 -400)`);
      conShown = 1; op(con, 1);
      tr(con, 330, 400, 1.5 * k);
      let mood = 'deadpan', look = 0;
      if (t < at('law')) mood = t < mid('hi', 0.5) ? 'neutral' : 'smug';
      else if (t < at('never')) look = t > mid('law', 0.2) ? 0.55 : 0;
      else { mood = t < mid('never', 0.55) ? 'deadpan' : 'smug'; look = t > mid('never', 0.25) && t < mid('never', 0.6) ? 0.6 : 0; }
      con.set({ t, talk: scTalk(S, t, 'con'), mood, look });
      ltCon.set(win(t, at('hi') + 0.1, at('hi') + 3.4, 0.3));
      // plaque on "law of conservation of energy"
      const pp = P(t, mid('hi', 0.45), 0.45, pop) * (1 - P(t, at('law') - 0.1, 0.2, linear));
      op(plaque, clamp(pp * 2.5)); tr(plaque, 860, 330, Math.max(0.01, 0.7 + 0.3 * pp));
      // the law, row by row
      const lp = P(t, at('law') - 0.05, 0.4, pop) * (1 - P(t, cDn, 0.15, linear));
      op(law, clamp(lp * 2.5)); tr(law, 860, 340, Math.max(0.01, 0.8 + 0.2 * lp), -1.5);
      if (lp > 0) {
        op(lawRows[0], P(t, mid('law', 0.08), 0.3, linear)); op(lawX1, P(t, mid('law', 0.22), 0.25, linear));
        op(lawRows[1], P(t, mid('law', 0.3), 0.3, linear)); op(lawX2, P(t, mid('law', 0.4), 0.25, linear));
        op(lawRows[2], P(t, mid('law', 0.5), 0.3, linear));
        op(lawFlow, P(t, mid('law', 0.62), 0.3, linear)); lawArrow.set(P(t, mid('law', 0.7), 0.5, ease));
        op(lawTick, P(t, mid('law', 0.85), 0.25, linear));
      }
      // never: failed machines, crossed out one by one, and the counters
      const np = close ? P(t, at('never'), 0.4, pop) : 0;
      op(fail, clamp(np * 2.5)); if (np) tr(fail, 860, 360, Math.max(0.01, 0.85 + 0.15 * np));
      tr(m1s, 0, 0, 1, (t * 40 * AMP) % 360);
      fx.forEach((c, i) => { const q = P(t, mid('never', 0.62 + i * 0.1), 0.3, pop); op(c, clamp(q * 3)); });
      op(fTitle, 1);
      const c1 = close ? P(t, mid('never', 0.08), 0.4, pop) : 0, c2 = close ? P(t, mid('never', 0.3), 0.4, pop) : 0;
      op(cnt1, clamp(c1 * 3)); tr(cnt1, 860, 120, Math.max(0.01, 0.7 + 0.3 * c1));
      op(cnt2, clamp(c2 * 3)); tr(cnt2, 860, 610, Math.max(0.01, 0.7 + 0.3 * c2));
    } else ltCon.set(0);

    /* ---------- G: title card, the cast pops in ---------- */
    op(titleShot, sG); op(logo, 0); op(epi, 0);
    if (sG) {
      tr(rayP, 600, 560, 1, (t * 6 * AMP) % 360);
      const lp = P(t, at('title') + 0.05, 0.6, pop);
      op(logo, clamp(lp * 2.5)); tr(logo, 600, 200, Math.max(0.01, 0.5 + 0.5 * lp));
      coins.forEach((c, i) => tr(c, (i ? 1 : -1) * 480, -26, 1, (i ? 1 : -1) * Math.sin(t * 2) * 12 * AMP));
      op(epi, P(t, mid('title', 0.45), 0.4, linear));
      const castT = i => mid('title', 0.5) + i * 0.12;
      const xs = [120, 260, 410, 560, 705, 850, 990, 1110];
      // order: Constance, Jules, Pat, Theo, Effie, Colin, Gerald, Kavya
      const pc = P(t, castT(0), 0.45, pop);
      conShown = 1; op(con, clamp(pc * 3)); tr(con, xs[0], 520 + 30 * (1 - clamp(pc)), Math.max(0.01, 0.66 * pc)); con.set({ t, mood: 'deadpan' });
      extras.forEach(e => { const p = P(t, castT(e.i + 1), 0.45, pop); op(e.c, clamp(p * 3)); tr(e.c, xs[e.i + 1], 520 + 30 * (1 - clamp(p)), Math.max(0.01, (e.k === 'pat' ? 0.6 : 0.68) * p)); e.c.set({ t, mood: e.mood, look: 0 }); });
      const pk = P(t, castT(7), 0.45, pop);
      kavShown = 1; op(kav, clamp(pk * 3)); tr(kav, xs[7], 520 + 30 * (1 - clamp(pk)), Math.max(0.01, 0.55 * pk)); kav.set({ t, mood: 'deadpan' });
    } else extras.forEach(e => op(e.c, 0));

    if (!kavShown) op(kav, 0);
    if (!conShown) op(con, 0);
  };
});
