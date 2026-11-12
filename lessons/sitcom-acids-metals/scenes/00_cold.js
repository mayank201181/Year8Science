/* Scene 0: Cold open (no chapter card).
   Lab: Kavya, 12, in goggles -> "they smell like other people's faces" -> the task card (neutralise an acid,
   add alkali until the indicator turns green) -> documentary zoom into her beaker -> inside: Neutral Ground,
   a wedding venue in red (acidic) liquid -> Indi's confessional (universal indicator, wedding planner,
   colour = pH; the rainbow "moody" flicker; thirty beakers a lesson) -> the Giant's goggled eye at the glass ->
   title card with the cast. */
scene('cold', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;

  /* ---------- local helpers ---------- */
  const on = (t, a, b) => (t >= a && t < b ? 1 : 0);          // hard sitcom cut
  const camBg = (el, k, cx, cy) => el.setAttribute('transform', `translate(${cx.toFixed(1)} ${cy.toFixed(1)}) scale(${k.toFixed(4)}) translate(${(-cx).toFixed(1)} ${(-cy).toFixed(1)})`);
  const popIn = (el, t, t0, x, y, s, r) => { const p = P(t, t0, 0.45, pop); op(el, clamp(p * 2.5)); tr(el, x, y, Math.max(0.01, (s || 1) * (0.6 + 0.4 * p)), r); return p; };
  const label = (parent, text, o) => { o = o || {}; return chip(parent, text, { size: o.size || 30, fill: o.fill || 'rgba(10,27,39,0.88)', stroke: o.stroke || C.line, sw: 2, color: o.color || C.ink, weight: 700 }); };

  const Lbg = G(root), Lcast = G(root), Lfg = G(root), Lhud = G(root);

  /* ================= A: the lab ================= */
  const labShot = G(Lbg), labWrap = G(labShot);
  const lab = ngLab(labWrap);
  const kavW = G(labWrap);
  const kavya = cast(kavW, 'kavya', { goggles: 'on', mood: 'annoyed' });
  const stink = G(kavW);
  const stinkEls = [0, 1, 2].map(() => E('path', { d: '', fill: 'none', stroke: '#8BC34A', 'stroke-width': 6, 'stroke-linecap': 'round', opacity: 0.8 }, stink));
  ngBench(labWrap, 560);
  // the bench props: the beaker (red: acid + universal indicator) and the alkali bottle with its dropper
  const BEAK = [800, 470];
  const bk = beaker(labWrap, 170, 190, { level: 0.62, liquid: ngPH(1) }); tr(bk, BEAK[0], BEAK[1]);
  const bottle = G(labWrap); tr(bottle, 1010, 482);
  E('rect', { x: -62, y: -70, width: 124, height: 148, rx: 16, fill: '#6C4A2E', stroke: SC_INK, 'stroke-width': 4 }, bottle);
  E('rect', { x: -58, y: -18, width: 116, height: 50, rx: 6, fill: '#FFFFFF' }, bottle);
  T(bottle, 0, 16, 'ALKALI', { size: 28, weight: 800, anchor: 'middle', fill: '#5A2A9E' });
  const drp = ngDropper(bottle, 0.42); tr(drp, 0, -20);
  // A1 chips
  const cKav = label(Lfg, 'Kavya, age 12', { size: 34 });
  const cSci = label(Lfg, 'Double Science', { size: 30, color: C.energy });
  const ltKavya = scLowerThird(Lhud, 'KAVYA, 12', 'Wearing the goggles.');
  // A3: the task card
  const task = G(Lfg);
  E('rect', { x: -230, y: -150, width: 460, height: 300, rx: 12, fill: '#FBF7EC', stroke: '#C9BFA6', 'stroke-width': 4 }, task);
  E('rect', { x: -230, y: -150, width: 460, height: 64, rx: 12, fill: '#3F5BD9' }, task);
  E('rect', { x: -230, y: -100, width: 460, height: 14, fill: '#3F5BD9' }, task);
  T(task, 0, -106, 'TODAY’S TASK', { size: 34, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  T(task, -200, -36, '**Neutralise** an acid.', { size: 32, weight: 600, fill: SC_INK, font: FB });
  T(task, -200, 10, 'Add alkali, drop by drop,', { size: 30, weight: 600, fill: SC_INK, font: FB });
  T(task, -200, 54, 'until the indicator', { size: 30, weight: 600, fill: SC_INK, font: FB });
  T(task, -200, 100, 'turns', { size: 30, weight: 600, fill: SC_INK, font: FB });
  const greenChip = chip(task, 'GREEN', { size: 30, fill: ngPH(7), color: '#FFFFFF', stroke: SC_INK, sw: 3 }); tr(greenChip, 10, 90);
  // A4: zoom HUD
  const finder = G(Lhud);
  E('path', { d: 'M40,150 L40,50 L140,50 M1060,50 L1160,50 L1160,150 M1160,610 L1160,710 L1060,710 M140,710 L40,710 L40,610', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 5, opacity: 0.8 }, finder);
  const zoomTxt = T(finder, 1130, 690, 'ZOOM ×1', { size: 30, weight: 700, anchor: 'end', fill: '#FFFFFF' });
  const reticle = G(Lfg);
  E('circle', { r: 70, fill: 'none', stroke: '#FFFFFF', 'stroke-width': 4, 'stroke-dasharray': '14 10' }, reticle);
  E('path', { d: 'M-92,0 L-74,0 M74,0 L92,0 M0,-92 L0,-74 M0,74 L0,92', stroke: '#FFFFFF', 'stroke-width': 4, 'stroke-linecap': 'round' }, reticle);
  const inChip = label(Lfg, 'inside the beaker', { size: 32, color: C.energy });

  /* ================= B: the venue (inside the beaker) ================= */
  const venShot = G(Lbg), venWrap = G(venShot);
  const venue = ngVenue(venWrap);
  const plaque = G(venWrap); tr(plaque, 600, 236);
  E('path', { d: 'M-120,-36 L-110,-66 M120,-36 L110,-66', stroke: '#D9C9A0', 'stroke-width': 4 }, plaque);
  E('rect', { x: -190, y: -36, width: 380, height: 72, rx: 12, fill: '#6B4A2E', stroke: '#3E2A18', 'stroke-width': 5 }, plaque);
  T(plaque, 0, 12, 'NEUTRAL GROUND', { size: 36, weight: 800, anchor: 'middle', fill: '#FFE6B0' });
  const subChip = label(Lfg, 'weddings for acids & alkalis', { size: 30, color: '#FFE6B0' });

  /* ================= C: Indi's confessional ================= */
  const conf = ngConf(Lbg, 'indi');
  const ltIndi = scLowerThird(Lhud, 'INDI', 'Universal indicator. Wedding planner.');
  const kwUI = G(Lfg);
  const kwChip = chip(kwUI, 'universal indicator', { size: 44, fill: ngPH(7), color: '#FFFFFF', stroke: '#FFFFFF', sw: 4 });
  T(kwUI, 0, 70, 'changes colour with pH', { size: 30, weight: 700, anchor: 'middle', fill: C.ink });
  const scaleG = G(Lfg); const phs = ngPhScale(scaleG, 600);
  const redChip = chip(Lfg, 'red = very ACIDIC', { size: 32, fill: ngPH(1), color: '#FFFFFF', stroke: '#FFFFFF', sw: 3 });
  const moody = G(Lfg);
  T(moody, 0, 0, 'MOODY?', { size: 54, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  const moodyStrike = E('path', { d: 'M-130,-14 L130,-14', stroke: '#FF6070', 'stroke-width': 10, 'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': '1 1' }, moody);
  const phChip = chip(Lfg, 'pH 1', { size: 54, fill: ngPH(1), color: '#FFFFFF', stroke: '#FFFFFF', sw: 4 });
  // busy: thirty beakers, acid and alkali, a tissue box
  const grid = G(Lfg); tr(grid, 880, 300);
  const minis = [];
  for (let r = 0; r < 5; r++) for (let c = 0; c < 6; c++) {
    const m = G(grid); m.px = (c - 2.5) * 62; m.py = (r - 2) * 62;
    E('path', { d: 'M-20,-24 L-20,20 Q-20,26 -14,26 L14,26 Q20,26 20,20 L20,-24', fill: 'rgba(220,240,255,0.15)', stroke: '#CFE7F5', 'stroke-width': 3 }, m);
    E('rect', { x: -17, y: -6, width: 34, height: 29, rx: 4, fill: ngPH(1), opacity: 0.9 }, m);
    minis.push(m);
  }
  const x30 = label(Lfg, '× 30 a lesson', { size: 32 });
  const coup = G(Lfg);
  const chAcid = chip(coup, 'ACID', { size: 34, fill: ngPH(1), color: '#FFFFFF', stroke: '#FFFFFF', sw: 3 }); tr(chAcid, -110, 0);
  const chAlk = chip(coup, 'ALKALI', { size: 34, fill: ngPH(13), color: '#FFFFFF', stroke: '#FFFFFF', sw: 3 }); tr(chAlk, 110, 0);
  const tissue = G(Lfg);
  E('rect', { x: -70, y: -34, width: 140, height: 68, rx: 10, fill: '#9FD8FF', stroke: SC_INK, 'stroke-width': 4 }, tissue);
  E('path', { d: 'M-40,-34 Q-20,-50 0,-34 Q20,-50 40,-34', fill: 'none', stroke: SC_INK, 'stroke-width': 3 }, tissue);
  E('path', { d: 'M-10,-36 Q-30,-90 4,-96 Q30,-80 14,-36 Z', fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 3, 'stroke-linejoin': 'round' }, tissue);
  T(tissue, 0, 14, 'TISSUES', { size: 26, weight: 800, anchor: 'middle', fill: SC_INK });

  /* ================= D: the Giant ================= */
  const giant = ngGiant(Lcast);
  const giantChip = label(Lfg, 'the Giant', { size: 34, color: C.energy });

  /* ================= E: title card ================= */
  const titleShot = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#0E2A1A', '#1F5A36', true) }, titleShot);
  let rays = '';
  for (let i = 0; i < 16; i++) { const a0 = i / 16 * TAU, a1 = a0 + TAU / 40; rays += `M0,0 L${(Math.cos(a0) * 1100).toFixed(0)},${(Math.sin(a0) * 1100).toFixed(0)} L${(Math.cos(a1) * 1100).toFixed(0)},${(Math.sin(a1) * 1100).toFixed(0)} Z `; }
  const rayP = E('path', { d: rays, fill: '#7CE38F', opacity: 0.08 }, titleShot);
  E('ellipse', { cx: 600, cy: 590, rx: 580, ry: 170, fill: glow('#7CE38F'), opacity: 0.3 }, titleShot);
  const logo = G(Lfg); ngLogo(logo);
  const epi = T(Lfg, 600, 372, 'Episode 8: The Wedding Crasher', { size: 42, weight: 700, anchor: 'middle', fill: '#FFFFFF' });

  /* ================= the cast ================= */
  const indi = cast(Lcast, 'indi', { mood: 'deadpan' });
  const ROW = ['indi', 'hal', 'natalie', 'henry', 'maggie', 'goldie', 'potassium', 'kavya'];
  const MOOD = { indi: 'deadpan', hal: 'happy', natalie: 'smug', henry: 'shock', maggie: 'happy', goldie: 'smug', potassium: 'deadpan', kavya: 'annoyed' };
  const row = ROW.map((k, i) => {
    const w = G(Lcast);
    let c;
    if (k === 'potassium') { const j = ngJar(w, 1); c = cast(j.inner, 'potassium', {}); tr(c, 0, 0, 0.9); }
    else c = cast(w, k, k === 'kavya' ? { goggles: 'up' } : {});
    return { w, c, k, x: 105 + i * 141, y: k === 'henry' ? 600 : 580 };
  });

  const blackout = E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#000000' }, Lhud);

  /* cut points */
  const cB = mid('small', 0.98), cC = at('hi') - 0.06, cE = at('giant') - 0.06, cF = at('title') - 0.06;

  return t => {
    op(blackout, 1 - P(t, 0, 0.6, linear));
    const sA = on(t, -1, cB), sB = on(t, cB, cC), sC = on(t, cC, cE), sD = on(t, cE, cF), sF = on(t, cF, 1e9);
    let indiShown = 0;

    /* ---------- A: the lab ---------- */
    op(labShot, sA);
    if (sA) {
      lab.upd(t * AMP);
      // camera: wide on 'kavya', push on Kavya for 'goggles', wide for 'task', then the zoom into the beaker
      let k = 1, cx = 600, cy = 400;
      const tight = t >= at('goggles') - 0.1 && t < at('task') - 0.1;
      if (tight) { k = 1.32 + 0.05 * P(t, at('goggles'), end('goggles') - at('goggles'), linear); cx = 330; cy = 300; }
      else if (t < at('goggles')) k = 1 + 0.03 * P(t, 0, 6, linear);
      if (t >= at('small')) {
        const zp = P(t, mid('small', 0.25), cB - mid('small', 0.25), p => p * p);
        k = Math.pow(9, zp); cx = BEAK[0]; cy = BEAK[1] + 10;
      }
      camBg(labWrap, k, cx, cy);
      tr(kavW, 330, 400, 1.55);
      const lookDown = t > mid('task', 0.3) && t < end('task');
      kavya.set({ t, talk: scTalk(S, t, 'kavya'), mood: t < at('goggles') ? 'annoyed' : t < mid('goggles', 0.55) ? 'annoyed' : 'deadpan', look: lookDown ? 0.8 : 0 });
      // stink lines from the goggles on "other people's faces"
      const sp = tight ? P(t, mid('goggles', 0.55), 0.5, linear) : 0;
      op(stink, sp);
      if (sp) stinkEls.forEach((el, i) => {
        const x = [-50, 0, 50][i], ph = t * 2 * AMP + i;
        let d = `M${x},-60`;
        for (let j = 1; j <= 5; j++) d += ` Q${(x + (j % 2 ? 14 : -14) * Math.sin(ph)).toFixed(1)},${-60 - j * 18 + 9} ${x},${-60 - j * 18}`;
        attr(el, 'd', d);
      });
      bk.set(0.62, ngPH(1));
      // chips
      const a1 = t < at('goggles') - 0.1 ? 1 : 0;
      op(cKav, 0); op(cSci, 0);
      if (a1) { popIn(cKav, t, mid('kavya', 0.08), 950, 170); popIn(cSci, t, mid('kavya', 0.5), 950, 240); }
      ltKavya.set(tight ? win(t, at('goggles') + 0.1, at('goggles') + 3.2, 0.3) : 0);
      const tp = t >= at('task') - 0.1 && t < at('small') + 0.3 ? P(t, at('task'), 0.45, pop) * (1 - P(t, at('small'), 0.3, linear)) : 0;
      op(task, clamp(tp * 2.5)); tr(task, 640, 270, Math.max(0.01, 0.75 + 0.25 * tp), -3);
      op(greenChip, P(t, mid('task', 0.7), 0.3, linear));
      tr(greenChip, 10, 90, 1 + 0.08 * wave(t, 0.8) * AMP);
      // zoom HUD
      const zOn = t >= at('small') ? 1 : 0;
      op(finder, zOn);
      if (zOn) {
        const zp = P(t, mid('small', 0.25), cB - mid('small', 0.25), p => p * p);
        setText(zoomTxt, 'ZOOM ×' + Math.max(1, Math.round(Math.pow(200, zp))));
        const rp = P(t, at('small') + 0.2, 0.4, pop);
        op(reticle, clamp(rp * 2) * (1 - P(t, mid('small', 0.75), 0.3, linear))); tr(reticle, BEAK[0], BEAK[1] + 10, Math.max(0.01, 0.6 + 0.4 * rp), t * 30 * AMP);
        op(inChip, win(t, mid('small', 0.2), mid('small', 0.85), 0.25)); tr(inChip, BEAK[0], BEAK[1] - 170);
      } else { op(reticle, 0); op(inChip, 0); }
    } else { op(cKav, 0); op(cSci, 0); ltKavya.set(0); op(task, 0); op(reticle, 0); op(inChip, 0); op(finder, 0); }

    /* ---------- B: the venue ---------- */
    op(venShot, Math.max(sB, sD));
    if (sB || sD) venue.set(1, t * AMP);
    if (sB) {
      const k = 1.5 - 0.5 * P(t, cB, 1.4, easeOut) + 0.04 * P(t, cB + 1.4, cC - cB, linear);
      camBg(venWrap, k, 600, 330);
      op(finder, 1 - P(t, cB, 0.8, linear)); setText(zoomTxt, 'ZOOM ×200');
      op(plaque, 1);
      op(subChip, P(t, mid('venue', 0.55), 0.35, linear)); tr(subChip, 600, 310);
      // Indi slides in on "weddings", clipboard ready
      const ip = P(t, mid('venue', 0.5), 0.8, easeOut);
      if (ip > 0) {
        indiShown = 1; op(indi, 1);
        tr(indi, lerp(1300, 900, ip), 520, 0.95);
        indi.set({ t, ph: 1, mood: 'neutral', look: -0.6 });
      }
    } else op(subChip, 0);

    /* ---------- C: Indi's confessional ---------- */
    conf.set(sC, t);
    if (sC) {
      indiShown = 1; op(indi, 1);
      let k = 1, ph = 1, mood = 'deadpan', look = 0;
      // hi / colour: neutral-ish; moods: rainbow flicker, then snaps back to red, deadpan push-in
      if (t < at('colour')) mood = 'neutral';
      if (t >= at('moods') && t < at('busy')) {
        const a = mid('moods', 0.05), b = mid('moods', 0.55);
        if (t >= a && t < b) { const q = (t - a) / (b - a); ph = 7 - 6 * Math.cos(q * TAU * 1.5); mood = 'annoyed'; }
        k = 1 + 0.12 * P(t, mid('moods', 0.7), end('moods') + 0.6 - mid('moods', 0.7), ease);
      }
      if (t >= at('busy')) { mood = t > mid('busy', 0.7) ? 'sad' : 'deadpan'; look = t > mid('busy', 0.2) && t < mid('busy', 0.65) ? 0.7 : 0; }
      camBg(conf, k, 430, 380);
      tr(indi, 430, 410, 1.5 * k);
      indi.set({ t, talk: scTalk(S, t, 'indi'), mood, look, ph });
      ltIndi.set(win(t, at('hi') + 0.1, at('hi') + 3.4, 0.3));
      const kw = win(t, mid('hi', 0.4), at('colour') + 0.3, 0.2);
      op(kwUI, kw); if (kw) tr(kwUI, 880, 300, 0.85 + 0.15 * P(t, mid('hi', 0.4), 0.4, pop));
      const sc = win(t, at('colour') + 0.2, at('moods') + 0.1, 0.25);
      op(scaleG, sc); if (sc) { tr(scaleG, 870, 330, 1); phs.set(1, P(t, mid('colour', 0.55), 0.3, linear)); }
      const rc = sc ? P(t, mid('colour', 0.62), 0.4, pop) : 0;
      op(redChip, clamp(rc * 2.5)); tr(redChip, 870, 470, Math.max(0.01, 0.7 + 0.3 * rc));
      const mo = t >= at('moods') && t < at('busy') ? P(t, mid('moods', 0.08), 0.4, pop) : 0;
      op(moody, clamp(mo * 2.5)); tr(moody, 870, 290, Math.max(0.01, 0.7 + 0.3 * mo));
      moodyStrike.setAttribute('stroke-dashoffset', (1 - P(t, mid('moods', 0.5), 0.3, linear)).toFixed(3));
      const pc = t >= at('moods') && t < at('busy') ? P(t, mid('moods', 0.6), 0.4, pop) : 0;
      op(phChip, clamp(pc * 2.5)); tr(phChip, 870, 420, Math.max(0.01, 0.6 + 0.4 * pc));
      // busy
      const bOn = t >= at('busy');
      op(grid, bOn ? 1 : 0);
      minis.forEach((m, i) => { const p = bOn ? P(t, at('busy') + 0.1 + i * 0.035, 0.3, pop) : 0; op(m, clamp(p * 3)); tr(m, m.px, m.py, Math.max(0.01, p)); });
      op(x30, bOn ? P(t, mid('busy', 0.15), 0.3, linear) * (1 - P(t, mid('busy', 0.42), 0.2, linear)) : 0); tr(x30, 880, 490);
      const cp = bOn ? P(t, mid('busy', 0.45), 0.4, pop) : 0;
      op(coup, clamp(cp * 2.5) * (1 - P(t, mid('busy', 0.72), 0.2, linear))); tr(coup, 880, 490, Math.max(0.01, 0.7 + 0.3 * cp));
      const tp = bOn ? P(t, mid('busy', 0.75), 0.4, pop) : 0;
      op(tissue, clamp(tp * 2.5)); tr(tissue, 880, 520, Math.max(0.01, 0.6 + 0.4 * tp), -6);
    } else { ltIndi.set(0); op(kwUI, 0); op(scaleG, 0); op(redChip, 0); op(moody, 0); op(phChip, 0); op(grid, 0); op(x30, 0); op(coup, 0); op(tissue, 0); }

    /* ---------- D: the Giant ---------- */
    op(giant, sD);
    if (sD) {
      camBg(venWrap, 1.12 + 0.05 * P(t, cE, cF - cE, linear), 600, 420);
      op(plaque, 1);
      indiShown = 1; op(indi, 1);
      tr(indi, 330, 520, 1.1);
      const gp = P(t, mid('giant', 0.35), 0.9, easeOut);
      tr(giant, lerp(1650, 930, gp), 330, 0.95);
      const giantIn = gp > 0.6;
      giant.set({ t, look: giantIn ? -0.8 : 0, lookY: 0.4 });
      indi.set({ t, talk: scTalk(S, t, 'indi'), ph: 1, mood: t > end('giant') + 0.15 ? 'deadpan' : giantIn ? 'annoyed' : 'neutral', look: t > mid('giant', 0.3) ? 0.9 : 0 });
      op(giantChip, P(t, mid('giant', 0.75), 0.3, linear)); tr(giantChip, 930, 690);
    } else op(giantChip, 0);

    /* ---------- F: title card ---------- */
    op(titleShot, sF); op(logo, 0); op(epi, 0);
    if (sF) {
      tr(rayP, 600, 590, 1, (t * 6 * AMP) % 360);
      const lp = P(t, at('title') + 0.05, 0.6, pop);
      op(logo, clamp(lp * 2.5)); tr(logo, 600, 250, Math.max(0.01, 0.5 + 0.5 * lp));
      op(epi, P(t, mid('title', 0.4), 0.4, linear));
      row.forEach((r, i) => {
        const p = P(t, mid('title', 0.5) + i * 0.12, 0.45, pop);
        op(r.w, clamp(p * 3)); tr(r.w, r.x, r.y + 30 * (1 - clamp(p)), Math.max(0.01, 0.55 * p));
        r.c.set({ t, mood: MOOD[r.k], ph: 7 });
      });
    } else row.forEach(r => op(r.w, 0));

    if (!indiShown) op(indi, 0);
  };
});
