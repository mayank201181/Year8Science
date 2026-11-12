/* Scene 7: The staff save you some marks (exam traps) + the stinger.
   Beats: Lung International at night, a "6 EXAM TRAPS" board, Nigel drifting -> six quick confessionals, one trap
   card each (Dennis: breathing is not respiration; Iggy: breathing IN = contract; Kavya: lungs don't suck, pressure
   falls, gold star; Alvi: diffusion, not pumped; Colin: out-air still ~16% O2, only ~4% CO2; Ozzie: limewater clear ->
   cloudy) -> Ozzie on a video call from a muscle cell, now two water molecules each wearing half his bucket hat;
   Mitch busy -> "LUNG HAUL will return… in about 4 seconds", next-breath countdown -> Dennis asks Nigel (two-shot in
   Nigel's first confessional) -> Nigel close-up: blink, blink, "No." -> Dennis: "Unchanged." -> logo, Nigel drifting. */
scene('traps', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;
  const talk = (t, who) => scTalk(S, t, who);

  /* ---------- local helpers (prefixed traps) ---------- */
  function trapsCam(el, k, cx, cy) { el.setAttribute('transform', `translate(${cx.toFixed(1)} ${cy.toFixed(1)}) scale(${k.toFixed(4)}) translate(${(-cx).toFixed(1)} ${(-cy).toFixed(1)})`); }
  function trapsPop(el, t, t0, x, y, s, r) { const p = P(t, t0, 0.45, pop); op(el, clamp(p * 2.5)); tr(el, x, y, Math.max(0.01, (s || 1) * (0.6 + 0.4 * p)), r); return p; }
  // remap time for Nigel so that he blinks exactly at the given moments (scBlink with his seed 22)
  function trapsBlinkT(t, times) {
    const per = 3.1 + (22 % 5) * 0.37, off = 22 * 0.71, base = per * 6 - off;
    for (const b of times) if (Math.abs(t - b) < 0.065) return base + 0.065 + (t - b);
    return base + 1.5;
  }
  // a trap card: number pill, title, body lines (lhRich); g.lines for staged reveals
  function trapsCard(parent, n, title, lines, col) {
    const g = G(parent);
    E('rect', { x: -260, y: -200, width: 520, height: 420, rx: 24, fill: 'rgba(10,20,28,0.94)', stroke: col, 'stroke-width': 5 }, g);
    const pill = lhChip(g, 'TRAP ' + n, { size: 30, fill: col, color: '#11161C', stroke: '#FFFFFF', sw: 3 }); tr(pill, -150, -200);
    lhRich(g, 0, -110, title, { size: 38, weight: 800, anchor: 'middle', fill: '#FFFFFF', boldFill: col });
    E('path', { d: 'M-220,-84 L220,-84', stroke: '#3A4B5C', 'stroke-width': 3 }, g);
    g.lines = lines.map(([s, y, size]) => lhRich(g, 0, y, s, { size: size || 32, weight: 700, anchor: 'middle', fill: '#E6EEF3', boldFill: col }));
    return g;
  }
  function trapsStar(parent, r) {
    const g = G(parent);
    let d = '';
    for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r; d += (i ? 'L' : 'M') + (Math.cos(a) * rr).toFixed(1) + ',' + (Math.sin(a) * rr).toFixed(1); }
    E('circle', { r: r * 1.8, fill: glow('#FFD23F') }, g);
    E('path', { d: d + 'Z', fill: ball('#FFE45C', '#D9A400'), stroke: '#8A6400', 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
    return g;
  }

  /* ---------- shared cast ---------- */
  const hold = G(root); op(hold, 0);
  function trapsSeat(ch, wrap) { if (ch.parentNode !== wrap) wrap.appendChild(ch); op(ch, 1); }

  const TRAPS = ['t1', 't2', 't3', 't4', 't5', 't6'];
  const WHO = { t1: 'dennis', t2: 'iggy', t3: 'kavya', t4: 'alvi', t5: 'colin', t6: 'ozzie' };
  const CLOSE = end('unchanged') + 0.5;
  const CUTS = [[-1, 'intro']];
  TRAPS.forEach(id => CUTS.push([at(id) - 0.08, id]));
  CUTS.push([at('water') - 0.08, 'call'], [at('return') - 0.08, 'logo'], [at('anything') - 0.08, 'two'],
    [end('anything') + 0.12, 'nigel'], [at('unchanged') - 0.08, 'dclose'], [CLOSE, 'final']);
  const cutAt = t => { let c = CUTS[0]; for (const k of CUTS) if (t >= k[0]) c = k; return c[1]; };

  /* =================== INTRO: the terminal at night =================== */
  const gIntro = G(root), inCam = G(gIntro);
  lhTerminal(inCam);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#0A0A28', opacity: 0.5 }, inCam);
  const lamps = [[300, 520], [900, 520]].map(([x, y]) => E('ellipse', { cx: x, cy: y + 40, rx: 160, ry: 40, fill: glow('#FFE9A8'), opacity: 0.5 }, inCam));
  const inNig = G(inCam);
  const board = lhBoard(inCam, '6 EXAM TRAPS', [['FREE MARKS', 'BOARDING'], ['STAFF', 'ON DUTY'], ['LUNG INTERNATIONAL', 'OPEN 24/7']], { w: 760 });
  tr(board, 600, 190);

  /* =================== CONFESSIONALS (the six traps; also Dennis's close-up) =================== */
  const gConf = G(root), cfCam = G(gConf);
  const conf = lhConf(cfCam, 'dennis');
  const confFill = {};
  for (const k in LH_TINT) confFill[k] = linGrad(LH_TINT[k][0], LH_TINT[k][1], true);
  const cfChar = G(cfCam);
  const CARD_COL = { t1: '#FF8A8A', t2: '#FFD23F', t3: '#56D69B', t4: '#FF9BB4', t5: '#B9C9D8', t6: '#9FD8FF' };
  const cards = {
    t1: trapsCard(cfCam, 1, 'breathing ≠ respiration', [['**breathing**: muscles move air', -30], ['**respiration**: a chemical', 40], ['reaction in your **cells**', 84]], CARD_COL.t1),
    t2: trapsCard(cfCam, 2, 'breathing IN = **CONTRACT**', [['diaphragm + intercostals', -30], ['IN: they **contract**', 30, 36], ['OUT: they **relax**', 90, 36]], CARD_COL.t2),
    t3: trapsCard(cfCam, 3, "lungs **don't** suck", [['chest **pressure** falls', -30, 34], ['→ outside air is', 30], ['**pushed in**', 76, 38]], CARD_COL.t3),
    t4: trapsCard(cfCam, 4, '**diffusion**, not pumping', [['O_2 gets into the blood', -30], ['by **diffusion**', 26, 36], ['nobody pumps it', 90]], CARD_COL.t4),
    t5: trapsCard(cfCam, 5, 'breathed-out air', [['still ≈ **16%** O_2', -20, 42], ['only ≈ **4%** CO_2', 46, 42], ['not pure CO_2!', 108, 30]], CARD_COL.t5),
    t6: trapsCard(cfCam, 6, 'limewater + CO_2', [['clear → **cloudy**', 150, 36]], CARD_COL.t6),
  };
  const star = trapsStar(cards.t3, 42); tr(star, 196, -170);
  const listened = T(cards.t3, 0, 166, 'she listened ★', { size: 28, weight: 800, anchor: 'middle', fill: '#FFD23F' });
  const tubeA = testTube(cards.t6, 46, 170, { level: 0.6, liquid: '#DDF3FF', opacity: 0.55 }); tr(tubeA, -110, -10);
  const tubeB = testTube(cards.t6, 46, 170, { level: 0.6, liquid: '#DDF3FF', opacity: 0.55 }); tr(tubeB, 110, -10);
  const tubeArrow = arrow(cards.t6, -60, -10, 60, -10, { color: '#9FD8FF', width: 7, head: 22 });
  const tBub = bubbles(cards.t6, 92, -60, 36, 90, { n: 6, r: 5, seed: 4 });
  const tubeLbls = [T(cards.t6, -110, 104, 'clear', { size: 26, weight: 700, anchor: 'middle', fill: '#A4BCCB' }), T(cards.t6, 110, 104, 'cloudy', { size: 26, weight: 700, anchor: 'middle', fill: '#FFFFFF' })];
  const cfOv = G(gConf);
  const unchStamp = (() => {
    const g = G(cfOv), w = textWidth('UNCHANGED', 52, FD, 800) + 70;
    E('rect', { x: -w / 2, y: -46, width: w, height: 92, rx: 12, fill: 'rgba(14,20,40,0.9)', stroke: LH.nitro, 'stroke-width': 6 }, g);
    T(g, 0, 18, 'UNCHANGED', { size: 52, weight: 800, anchor: 'middle', fill: LH.nitro, ls: 3 });
    return g;
  })();

  /* =================== VIDEO CALL: Ozzie, respired =================== */
  const gCall = G(root), clCam = G(gCall);
  const clConf = lhConf(clCam, 'ozzie');
  const call = scVideoCall(clCam, 720, 400, 'Video call · a muscle cell');
  tr(call, 600, 360);
  E('rect', { x: -360, y: -200, width: 720, height: 400, fill: linGrad('#F7B6C4', '#E88AA0', true) }, call.screen);
  E('ellipse', { cx: -250, cy: 150, rx: 120, ry: 60, fill: '#B07AC9', opacity: 0.35 }, call.screen);
  const clOz = G(call.screen);
  const waters = [-1, 1].map(side => {
    const g = G(call.screen);
    molH2O(g, 62);
    const f = scFace(g, { eye: 12, gap: 36, mouthW: 26, mouthY: 22, lidCol: C.oxygen, brow: false }); tr(f, 0, -6);
    const hat = G(g); tr(hat, side * 4, -56, 1, side * -8);
    const half = G(hat); if (side > 0) half.setAttribute('transform', 'scale(-1 1)');
    E('path', { d: 'M-46,0 Q-44,-42 0,-44 L0,0 Z', fill: '#F2D27A', stroke: SC_INK, 'stroke-width': 4.5, 'stroke-linejoin': 'round' }, half);
    E('path', { d: 'M-68,4 Q-34,-6 0,-6 L0,8 Q-30,8 -60,16 Q-72,14 -68,4 Z', fill: '#E6BF55', stroke: SC_INK, 'stroke-width': 4.5, 'stroke-linejoin': 'round' }, half);
    E('path', { d: 'M-44,-8 Q-22,-14 0,-16', fill: 'none', stroke: '#E8424F', 'stroke-width': 6 }, half);
    g.face = f;
    return g;
  });
  const halfLbl = waters.map(() => lhRich(call.screen, 0, 0, 'H_2O', { size: 32, weight: 800, anchor: 'middle', fill: '#2B3440' }));
  const mitch = G(call.screen);
  mitochondrion(mitch, 170, 92, { folds: 4 });
  E('path', { d: 'M-8,44 L8,44 L5,52 L12,90 L0,102 L-12,90 L-5,52 Z', fill: '#3F5BD9', stroke: SC_INK, 'stroke-width': 3, 'stroke-linejoin': 'round' }, mitch);
  T(mitch, 0, -64, 'MITCH (busy)', { size: 26, weight: 800, anchor: 'middle', fill: '#5A1E2A' });
  const clOv = G(gCall);
  const cWater = lhChip(clOv, 'respiration: the oxygen ends up in **water** (H_2O)', { size: 30, fill: 'rgba(10,20,28,0.94)', color: '#FFFFFF', stroke: C.water, sw: 3, boldFill: C.water });

  /* =================== LOGO (return, final) =================== */
  const gLogo = G(root);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#2A0E1C', '#5A1F33', true) }, gLogo);
  let rays = '';
  for (let i = 0; i < 16; i++) { const a0 = i / 16 * TAU, a1 = a0 + TAU / 40; rays += `M0,0 L${(Math.cos(a0) * 1100).toFixed(0)},${(Math.sin(a0) * 1100).toFixed(0)} L${(Math.cos(a1) * 1100).toFixed(0)},${(Math.sin(a1) * 1100).toFixed(0)} Z `; }
  const rayP = E('path', { d: rays, fill: '#FFD23F', opacity: 0.07 }, gLogo);
  const logo = T(gLogo, 600, 250, 'LUNG HAUL', { size: 118, weight: 800, anchor: 'middle', fill: LH.signTx, ls: 4 });
  logo.setAttribute('stroke', '#5A1F33'); logo.setAttribute('stroke-width', 14); logo.setAttribute('paint-order', 'stroke'); logo.setAttribute('stroke-linejoin', 'round');
  const lgPlane = lhPlane(gLogo, 1.3, '#FFFFFF');
  const sub1 = T(gLogo, 600, 330, 'will return… in about 4 seconds', { size: 42, weight: 700, anchor: 'middle', fill: '#FFFFFF' });
  const sub2 = T(gLogo, 600, 330, 'Same time next breath.', { size: 42, weight: 700, anchor: 'middle', fill: '#FFFFFF' });
  const cd = G(gLogo); tr(cd, 600, 520);
  E('circle', { r: 104, fill: '#11161C', stroke: '#3A4B5C', 'stroke-width': 6 }, cd);
  const cdRing = ring(cd, 86, LH.signTx);
  const cdNum = T(cd, 0, 26, '4', { size: 84, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  const cdLbl = T(cd, 0, 150, 'next breath in…', { size: 30, weight: 700, anchor: 'middle', fill: '#F2B8C6' });
  const cdGo = lhChip(gLogo, 'BREATHE IN ✓', { size: 40, fill: '#56D69B', color: '#0B2A1A', stroke: '#FFFFFF', sw: 4 });
  const lgNig = G(gLogo);

  /* =================== NIGEL's confessional (two-shot + close-up) =================== */
  const gNig = G(root), ngCam = G(gNig);
  lhConf(ngCam, 'nigel');
  const ngDen = G(ngCam), ngNig = G(ngCam);

  // the cast (after the shots that hold them so seating order stays right)
  const DEN = cast(hold, 'dennis', { mood: 'deadpan' });
  const NIG = cast(hold, 'nigel', { mood: 'neutral' });
  const OZ = cast(hold, 'ozzie', { mood: 'happy' });
  const C_ = { t2: cast(hold, 'iggy', { mood: 'happy' }), t3: cast(hold, 'kavya', { mood: 'deadpan' }), t4: cast(hold, 'alvi', { mood: 'happy' }), t5: cast(hold, 'colin', { mood: 'smug' }) };
  C_.t1 = DEN; C_.t6 = OZ;
  const CS = { t1: 1.45, t2: 1.35, t3: 1.45, t4: 1.45, t5: 1.25, t6: 1.3 };

  const SHOTS = { intro: gIntro, conf: gConf, call: gCall, logo: gLogo, nig: gNig };
  const shotOf = c => (TRAPS.includes(c) || c === 'dclose') ? 'conf' : c === 'two' || c === 'nigel' ? 'nig' : c === 'final' ? 'logo' : c;

  return t => {
    const cut = cutAt(t), shot = shotOf(cut);
    for (const k in SHOTS) op(SHOTS[k], 0);
    op(SHOTS[shot], 1);
    const breath = wave(t, 4) * AMP;

    /* ---------- INTRO ---------- */
    if (shot === 'intro') {
      trapsCam(inCam, 1.06 - 0.06 * P(t, 0, at('t1'), easeOut), 600, 380);
      board.set(P(t, mid('intro', 0.1), 2.6, linear));
      trapsSeat(NIG, inNig);
      tr(NIG, lerp(1260, 760, clamp(t / 8)), 590, 0.6);
      NIG.set({ t, talk: 0, mood: 'neutral', look: 0 });
      lamps.forEach((l, i) => op(l, 0.35 + 0.15 * wave(t, 3, i * 0.5) * AMP));
    }

    /* ---------- CONFESSIONALS ---------- */
    if (shot === 'conf') {
      const kind = cut === 'dclose' ? 'dennis' : WHO[cut];
      conf.firstChild.setAttribute('fill', confFill[kind]);
      conf.set(1, t);
      for (const id of TRAPS) op(cards[id], 0);
      op(unchStamp, 0);
      const ch = cut === 'dclose' ? DEN : C_[cut];
      trapsSeat(ch, cfChar);
      // hide the other cast members that may still sit in the character slot
      [...cfChar.children].forEach(c => op(c, c === ch ? 1 : 0));
      if (cut === 'dclose') {
        const k = 1 + 0.06 * P(t, at('unchanged'), CLOSE - at('unchanged'), linear);
        trapsCam(cfCam, k, 430, 420);
        tr(DEN, 430, 430, 1.55);
        DEN.set({ t, talk: talk(t, 'dennis'), mood: 'deadpan', look: 0, flat: 0.5 * breath });
        const sp = P(t, mid('unchanged', 0.5), 0.3, linear);
        op(unchStamp, clamp(sp * 4)); tr(unchStamp, 880, 400, lerp(1.6, 1, easeOut(sp)), -6);
      } else {
        const id = cut, card = cards[id], who = WHO[id];
        const k = 1 + 0.03 * P(t, at(id), end(id) + 0.4 - at(id), linear);
        trapsCam(cfCam, k, 430, 420);
        trapsPop(card, t, at(id) + 0.05, 880, 390, 1, 0);
        card.lines.forEach((l, i) => op(l, P(t, mid(id, 0.2 + i * 0.22), 0.25, linear)));
        tr(ch, 380, 420, CS[id]);
        const st = { t, talk: talk(t, who), mood: who === 'colin' ? 'smug' : who === 'kavya' ? 'deadpan' : who === 'dennis' ? 'deadpan' : 'happy', look: 0 };
        if (who === 'dennis') st.flat = 0.5 * breath;
        if (who === 'iggy') { const ph = (t - at(id)) / (end(id) - at(id)); st.lift = ph < 0.5 ? P(t, mid(id, 0.25), 0.3) : 1 - P(t, mid(id, 0.65), 0.3); }
        if (who === 'kavya') { st.mood = t > mid(id, 0.8) ? 'smug' : 'deadpan'; }
        ch.set(st);
        if (id === 't3') {
          const sp = P(t, mid('t3', 0.82), 0.45, pop);
          op(star, clamp(sp * 3)); tr(star, 196, -170, Math.max(0.01, sp), (t * 30 * AMP) % 360 * 0.1);
          op(listened, P(t, mid('t3', 0.86), 0.25, linear));
        }
        if (id === 't6') {
          const cl = P(t, mid('t6', 0.3), 1.2, ease);
          tubeB.set(0.6, cl > 0.5 ? '#F2F2EE' : '#DDF3FF');
          tubeB.liquid.setAttribute('opacity', (0.55 + 0.4 * cl).toFixed(2));
          tubeArrow.set(P(t, mid('t6', 0.15), 0.4, linear));
          tBub.upd(t, 1 - cl * 0.5);
          op(card.lines[0], P(t, mid('t6', 0.45), 0.25, linear));
        }
      }
    }

    /* ---------- VIDEO CALL ---------- */
    if (shot === 'call') {
      clConf.set(1, t);
      const k = 1 + 0.04 * P(t, mid('water', 0.85), end('water') + 0.7 - mid('water', 0.85), linear);
      trapsCam(clCam, k, 600, 360);
      const split = mid('water', 0.42);
      trapsSeat(OZ, clOz);
      op(OZ, t < split ? 1 : 0);
      tr(OZ, 0, 30, 0.95);
      OZ.set({ t, talk: talk(t, 'ozzie'), mood: 'happy', look: 0 });
      const sp = P(t, split, 0.45, pop);
      waters.forEach((w, i) => {
        op(w, clamp(sp * 3));
        const side = i ? 1 : -1, bob = Math.sin(t * 3 + i * 2) * 5 * AMP;
        tr(w, side * 130 * clamp(sp) + side * 10, 10 + bob, Math.max(0.01, 0.4 + 0.6 * sp));
        w.face.set({ mood: 'happy', talk: talk(t, 'ozzie'), look: -side * 0.5, blink: scBlink(t, 5 + i * 2) });
        op(halfLbl[i], clamp(sp * 3) * P(t, split + 0.5, 0.3, linear)); tr(halfLbl[i], side * 140, 140);
      });
      trapsPop(mitch, t, mid('water', 0.82), 272, -118, 0.72);
      trapsPop(cWater, t, mid('water', 0.55), 600, 650);
    }

    /* ---------- LOGO (return, final) ---------- */
    if (shot === 'logo') {
      const fin = cut === 'final';
      tr(rayP, 600, 560, 1, (t * 6 * AMP) % 360);
      const t0 = fin ? CLOSE : at('return') - 0.08;
      const lp = P(t, t0 + 0.05, 0.5, pop);
      op(logo, clamp(lp * 2.5)); logo.setAttribute('transform', `translate(600 250) scale(${Math.max(0.01, 0.5 + 0.5 * lp).toFixed(3)}) translate(-600 -250)`);
      const a = (t - t0) * 1.6 * AMP;
      op(lgPlane, clamp(lp * 2)); tr(lgPlane, 600 + Math.cos(a) * 380, 210 + Math.sin(a) * 70, 1.1 * (0.85 + 0.15 * Math.sin(a)), Math.atan2(Math.cos(a) * 70, -Math.sin(a) * 380) * 180 / Math.PI);
      op(sub1, fin ? 0 : P(t, mid('return', 0.3), 0.3, linear));
      op(sub2, fin ? P(t, CLOSE + 0.3, 0.4, linear) : 0);
      // the next-breath countdown
      const c0 = at('return') + 0.1, el = t - c0;
      op(cd, fin ? 0 : P(t, c0, 0.3, linear));
      cdRing.set(clamp(el / 4));
      setText(cdNum, String(Math.max(1, 4 - Math.floor(Math.max(0, el)))));
      op(cdNum, el < 4 ? 1 : 0); op(cdLbl, 1);
      const go = !fin && el >= 4 ? P(t, c0 + 4, 0.3, pop) : 0;
      op(cdGo, clamp(go * 3)); tr(cdGo, 600, 520, Math.max(0.01, 0.6 + 0.4 * go));
      if (fin) {
        trapsSeat(NIG, lgNig); op(lgNig, 1);
        const D = S.D || CLOSE + 2.2;
        tr(NIG, lerp(560, 1010, clamp((t - CLOSE) / (D - CLOSE))), 560, 0.85);
        NIG.set({ t, talk: 0, mood: 'neutral', look: 0 });
      } else op(lgNig, 0);
    }

    /* ---------- NIGEL (two-shot, close-up) ---------- */
    if (shot === 'nig') {
      if (cut === 'two') {
        trapsCam(ngCam, 1, 600, 400);
        trapsSeat(DEN, ngDen); trapsSeat(NIG, ngNig); op(ngDen, 1);
        tr(DEN, 290, 470, 1.15);
        DEN.set({ t, talk: talk(t, 'dennis'), mood: 'deadpan', look: 0.85, flat: 0.5 * breath });
        tr(NIG, 790, 420, 1.35);
        NIG.set({ t, talk: 0, mood: 'neutral', look: 0 });
      } else {
        op(ngDen, 0);
        trapsSeat(NIG, ngNig);
        const e = end('anything');
        const k = 1 + 0.07 * P(t, e, CLOSE - e, linear);
        trapsCam(ngCam, k, 600, 420);
        tr(NIG, 600, 420, 2.0);
        const tb = trapsBlinkT(t, [e + 0.55, e + 1.05, end('no') + 0.45]);
        NIG.set({ t: tb, talk: talk(t, 'nigel'), mood: 'neutral', look: 0 });
      }
    }
  };
});
