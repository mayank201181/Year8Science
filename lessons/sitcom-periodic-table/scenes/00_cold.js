/* Scene 0: Cold open (no chapter card).
   Kavya's bedroom at 11 pm, cramming in front of the periodic-table poster -> close-up: Na? K? ->
   push into the poster, which turns into a block of flats (BLK 118) -> Silas's confessional (silicon,
   the caretaker; his phone rings: Sonny) -> Sonny bursts in about the water -> "No, Sonny." -> title card with the cast. */
scene('cold', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;

  /* ---------- local helpers ---------- */
  const on = (t, a, b) => (t >= a && t < b ? 1 : 0);          // hard sitcom cut
  const camBg = (el, k, cx, cy) => el.setAttribute('transform', `translate(${cx.toFixed(1)} ${cy.toFixed(1)}) scale(${k.toFixed(4)}) translate(${(-cx).toFixed(1)} ${(-cy).toFixed(1)})`);
  const popIn = (el, t, t0, x, y, s, r) => { const p = P(t, t0, 0.45, pop); op(el, clamp(p * 2.5)); tr(el, x, y, Math.max(0.01, (s || 1) * (0.6 + 0.4 * p)), r); };
  const label = (parent, text, o) => { o = o || {}; return chip(parent, text, { size: o.size || 30, fill: o.fill || 'rgba(10,27,39,0.88)', stroke: o.stroke || C.line, sw: 2, color: o.color || C.ink, weight: 700 }); };

  /* layers: sets at the back, the cast, then props and labels, then the HUD */
  const Lbg = G(root), Lcast = G(root), Lfg = G(root), Lhud = G(root);

  /* ================= A: the bedroom (wide) ================= */
  const bedShot = G(Lbg);
  const bed = bkBedroom(bedShot);
  // B: the plain wall behind the poster close-ups, and the sky that replaces it
  const wallShot = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#2A2340', '#3C3158', true) }, wallShot);
  const sky = G(wallShot);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#4FB6F5', '#BFE8FF', true) }, sky);
  E('path', { d: 'M90,150 q30,-40 70,-10 q30,-30 60,0 q30,0 20,24 l-150,0 q-20,-6 0,-14 Z M960,110 q30,-40 70,-10 q30,-30 60,0 q30,0 20,24 l-150,0 q-20,-6 0,-14 Z', fill: '#FFFFFF', opacity: 0.85 }, sky);
  E('rect', { x: 0, y: 690, width: 1200, height: 60, fill: '#5BBF6A' }, sky);
  // G: title background (below the block, so the block can sit faintly behind the logo)
  const titleShot = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#0B1430', '#2A2350', true) }, titleShot);
  const tsky = rng(55); let stars = '';
  for (let i = 0; i < 60; i++) stars += `M${(tsky() * 1200).toFixed(0)},${(tsky() * 420).toFixed(0)} h3 v3 h-3 Z `;
  E('path', { d: stars, fill: '#FFFFFF', opacity: 0.7 }, titleShot);
  // the poster / the building: one bkBlock for the whole scene (poster look, then building look, then the title)
  const blockWrap = G(Lbg);
  const block = bkBlock(blockWrap, { look: 0, numbers: false });
  // desk edge in front of Kavya (wide shot)
  const deskFront = E('rect', { x: 0, y: 690, width: 1200, height: 60, fill: linGrad('#7A4E31', '#4E301C', true) }, Lfg);
  const cKav = label(Lfg, 'Kavya, age 12', { size: 32 });
  const note = G(Lfg);
  E('rect', { x: -84, y: -64, width: 168, height: 128, fill: '#FFF176', stroke: '#C9B13A', 'stroke-width': 2 }, note);
  T(note, 0, -14, 'SCIENCE TEST', { size: 24, weight: 800, anchor: 'middle', fill: '#C62828' });
  T(note, 0, 24, 'TOMORROW!!', { size: 28, weight: 800, anchor: 'middle', fill: '#C62828' });
  // A2 close-up marks
  const ringNa = E('ellipse', { rx: 64, ry: 54, fill: 'none', stroke: '#E8424F', 'stroke-width': 7 }, Lfg);
  const ringK = E('ellipse', { rx: 64, ry: 54, fill: 'none', stroke: '#E8424F', 'stroke-width': 7 }, Lfg);
  const qNa = label(Lfg, 'Na = sodium?!', { color: '#FFD0D0', stroke: '#E8424F' });
  const qK = label(Lfg, 'K = potassium?!', { color: '#FFD0D0', stroke: '#E8424F' });
  const ltKavya = scLowerThird(Lhud, ...BK_LT.kavya); tr(ltKavya, 600, 600);
  // B: the reveal
  const c118 = label(Lfg, '118 flats · one element in each', { size: 34, color: C.energy, stroke: C.energy });
  const finder = G(Lhud);
  E('path', { d: 'M40,140 L40,40 L140,40 M1060,40 L1160,40 L1160,140 M1160,610 L1160,710 L1060,710 M140,710 L40,710 L40,610', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 5, opacity: 0.8 }, finder);
  const recDot = E('circle', { cx: 1080, cy: 90, r: 10, fill: '#FF3B3B' }, finder);
  T(finder, 1100, 100, 'REC', { size: 28, weight: 700, fill: '#FFFFFF' });

  /* ================= C: Silas's confessional ================= */
  const conf = bkConf(Lbg, 'silas');
  const ltSilas = scLowerThird(Lhud, ...BK_LT.silas);
  const cSi = chip(Lfg, 'silicon (Si)', { size: 40, fill: '#3A4F7A', color: '#FFFFFF', stroke: '#DCE6FA', sw: 3 });
  const phone = G(Lfg);
  E('rect', { x: -78, y: -140, width: 156, height: 280, rx: 22, fill: '#2A2F3A', stroke: SC_INK, 'stroke-width': 5 }, phone);
  E('rect', { x: -64, y: -112, width: 128, height: 214, rx: 8, fill: '#E9F4FF' }, phone);
  T(phone, 0, -76, 'INCOMING', { size: 22, weight: 800, anchor: 'middle', fill: '#5A6B7A' });
  const pb = bkBadge(phone, 'Na', { r: 34, fill: '#E3E8EE' }); tr(pb, 0, -14);
  T(phone, 0, 50, 'SONNY', { size: 28, weight: 800, anchor: 'middle', fill: '#24324F' });
  E('circle', { cx: -34, cy: 86, r: 13, fill: '#56D69B' }, phone); E('circle', { cx: 34, cy: 86, r: 13, fill: '#FF6060' }, phone);
  const cup = G(Lfg);
  E('path', { d: 'M-30,-36 L30,-36 L22,36 L-22,36 Z', fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, cup);
  E('path', { d: 'M-26,-14 L26,-14 L22,36 L-22,36 Z', fill: C.water, opacity: 0.85 }, cup);
  T(cup, 56, 0, '?!', { size: 54, weight: 800, fill: C.energy });
  const warn = G(Lfg);
  E('path', { d: 'M0,-110 L110,80 L-110,80 Z', fill: '#FFC247', stroke: SC_INK, 'stroke-width': 6, 'stroke-linejoin': 'round' }, warn);
  T(warn, 0, 52, 'Na', { size: 80, weight: 800, anchor: 'middle', fill: SC_INK });
  T(warn, 0, 132, 'CAUTION', { size: 34, weight: 800, anchor: 'middle', fill: '#FFC247' });

  /* ================= G: title card ================= */
  const logo = G(Lfg);
  const logoT = T(logo, 0, 0, 'BLOCK 118', { size: 104, weight: 800, anchor: 'middle', fill: C.energy });
  logoT.setAttribute('stroke', '#1B2A55'); logoT.setAttribute('stroke-width', 14); logoT.setAttribute('paint-order', 'stroke'); logoT.setAttribute('stroke-linejoin', 'round');
  const epi = T(Lfg, 600, 268, 'Episode 5: Mind the Gap', { size: 44, weight: 700, anchor: 'middle', fill: '#FFFFFF' });

  /* ================= the cast ================= */
  const kav = cast(Lcast, 'kavya', { home: true, mood: 'annoyed' });
  const silas = cast(Lcast, 'silas');
  const sonny = cast(Lcast, 'sonny', { speed: 2.2 });
  const ORDER = ['kavya', 'silas', 'sonny', 'chloe', 'helena', 'harold', 'gemma', 'ahgong'];
  const MOOD = { kavya: 'annoyed', silas: 'deadpan', sonny: 'happy', chloe: 'happy', helena: 'smug', harold: 'sad', gemma: 'happy', ahgong: 'deadpan' };
  const extras = ['chloe', 'helena', 'harold', 'gemma', 'ahgong'].map(k => ({ k, c: cast(Lcast, k) }));

  const blackout = E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#000000' }, Lhud);

  /* cut points */
  const cA2 = at('letters') - 0.1, cB = at('poster') - 0.06, cC = at('hi') - 0.06, cG = at('title') - 0.06;
  const MP = mid('block', 0.22);          // the poster starts turning into the building

  return t => {
    op(blackout, 1 - P(t, 0, 0.6, linear));
    const sA = on(t, -1, cA2), sA2 = on(t, cA2, cB), sB = on(t, cB, cC), sC = on(t, cC, cG), sG = on(t, cG, 1e9);
    let kavOn = 0, silOn = 0, sonOn = 0;

    /* ---------- A: wide bedroom ---------- */
    op(bedShot, sA); op(deskFront, sA);
    op(wallShot, Math.max(sA2, sB));
    op(blockWrap, sA + sA2 + sB + 0.2 * sG);
    if (sA) {
      const push = P(t, 0, cA2, linear);
      camBg(bedShot, 1 + 0.04 * push, 600, 420);
      tr(block, BK_POSTER.x, BK_POSTER.y, BK_POSTER.s); blockWrap.setAttribute('transform', bedShot.getAttribute('transform'));
      block.look(0);
      const mins = Math.round(40 * P(t, mid('late', 0.35), 1.6, linear));
      setText(bed.clock, `11:${String(mins).padStart(2, '0')} PM`);
      const sink = P(t, mid('late', 0.35), 2.2, ease);
      kavOn = 1;
      tr(kav, 300, 548 + 34 * sink, 1.3, -7 * sink);
      kav.set({ t, talk: scTalk(S, t, 'kavya'), mood: t < at('late') ? 'annoyed' : (sink > 0.5 ? 'sad' : 'deadpan'), look: t < at('late') + 0.4 ? 0.7 : 0.2 });
      popIn(cKav, t, mid('kavya', 0.12), 220, 170);
      const np = P(t, mid('kavya', 0.72), 0.45, pop);
      op(note, clamp(np * 2.5)); tr(note, 548, 480, Math.max(0.01, 0.6 + 0.4 * np), -8);
    } else { op(cKav, 0); op(note, 0); }

    /* ---------- A2: close-up on Na and K ---------- */
    if (sA2) {
      const k = 1.62 * (1 + 0.04 * P(t, cA2, cB - cA2, linear));
      const [nx, ny] = block.pt(11), [kx, ky] = block.pt(19);
      const ox = 660 - k * nx, oy = 300 - k * ny;
      blockWrap.removeAttribute('transform'); tr(block, ox, oy, k); block.look(0);
      const pNa = P(t, mid('letters', 0.08), 0.4, pop), pK = P(t, mid('letters', 0.32), 0.4, pop);
      op(ringNa, clamp(pNa * 3)); tr(ringNa, ox + k * nx, oy + k * ny, Math.max(0.01, 0.7 + 0.3 * pNa));
      op(ringK, clamp(pK * 3)); tr(ringK, ox + k * kx, oy + k * ky, Math.max(0.01, 0.7 + 0.3 * pK));
      popIn(qNa, t, mid('letters', 0.12), ox + k * nx + 230, oy + k * ny);
      popIn(qK, t, mid('letters', 0.36), ox + k * kx + 250, oy + k * ky);
      kavOn = 1;
      tr(kav, 250, 575, 1.25);
      const done = t > end('letters') - 0.05;
      kav.set({ t, talk: scTalk(S, t, 'kavya'), mood: done ? 'deadpan' : 'annoyed', look: done ? 0 : 0.85 });
      ltKavya.set(win(t, at('letters') + 0.1, at('letters') + 3.2, 0.3));
    } else { op(ringNa, 0); op(ringK, 0); op(qNa, 0); op(qK, 0); ltKavya.set(0); }

    /* ---------- B: into the poster; it becomes a building ---------- */
    op(finder, sB);
    if (sB) {
      blockWrap.removeAttribute('transform');
      const push = P(t, cB, cC - cB, linear);
      const k = 0.95 * (1 + 0.06 * push) * (1 - 0.06 * P(t, MP, 1.6, ease));
      tr(block, 600, 410 - 20 * P(t, MP, 1.6, ease), k);
      const m = P(t, MP, 1.3, ease);
      block.look(m); op(sky, m);
      op(recDot, Math.sin(t * TAU * 0.8) > 0 ? 1 : 0.2);
      popIn(c118, t, mid('block', 0.68), 600, 165);
    } else { op(sky, 0); op(c118, 0); }

    /* ---------- C: Silas's confessional ---------- */
    conf.set(sC, t);
    if (sC) {
      silOn = 1;
      const close = t >= at('thsonny') - 0.06;
      const k = close ? 1.12 : 1 + 0.04 * P(t, cC, at('water') - cC, linear);
      camBg(conf, k, 430, 390);
      tr(silas, 430 + (k - 1) * 0, 400, 1.5 * k);
      const lookS = t > mid('hi', 0.85) && t < at('water') + 0.3 ? 0.7 : 0;
      silas.set({ t, talk: scTalk(S, t, 'silas'), mood: t < at('hi') + 0.6 ? 'neutral' : 'deadpan', look: lookS });
      ltSilas.set(win(t, at('hi') + 0.1, at('hi') + 3.3, 0.3));
      const si = win(t, mid('hi', 0.45), end('hi') + 0.3, 0.2);
      op(cSi, si); if (si) tr(cSi, 870, 250, 0.85 + 0.15 * P(t, mid('hi', 0.45), 0.4, pop));
      // the phone rings as he finishes introducing himself: it's Sonny
      const pp = P(t, mid('hi', 0.8), 0.45, pop) * (1 - P(t, mid('water', 0.3), 0.2, linear));
      const buzz = t > mid('hi', 0.85) && t < mid('water', 0.3) ? Math.sin(t * 90) * 5 * AMP : 0;
      op(phone, clamp(pp * 3)); tr(phone, 740 + buzz, 400, Math.max(0.01, 0.7 + 0.3 * pp), -6);
      if (pp > 0.02) op(cSi, 0);
      // Sonny bursts in, then slinks out
      const inP = P(t, at('water') - 0.05, 0.35, easeOut), outP = P(t, at('thsonny') - 0.1, 0.35, easeIn);
      if (inP > 0 && outP < 1) {
        sonOn = 1;
        tr(sonny, 1360 - 420 * inP + 520 * outP, 430, 1.15);
        sonny.set({ t, talk: scTalk(S, t, 'sonny'), mood: t < at('no') + 0.25 ? 'shock' : 'sad', look: -0.8 });
      }
      const cp = t < at('no') ? P(t, mid('water', 0.35), 0.4, pop) : 1 - P(t, at('no'), 0.2, linear);
      op(cup, clamp(cp * 3)); tr(cup, 900 - 520 * outP, 200, Math.max(0.01, 0.6 + 0.4 * cp));
      const wp = close ? P(t, mid('thsonny', 0.2), 0.45, pop) : 0;
      op(warn, clamp(wp * 3)); tr(warn, 880, 330, Math.max(0.01, 0.6 + 0.4 * wp), 4 * Math.sin(t * 2) * AMP);
    } else { ltSilas.set(0); op(cSi, 0); op(phone, 0); op(cup, 0); op(warn, 0); }

    /* ---------- G: title card ---------- */
    op(titleShot, sG); op(logo, 0); op(epi, 0);
    if (sG) {
      blockWrap.removeAttribute('transform'); block.look(1); tr(block, 600, 330, 0.62);
      const lp = P(t, at('title') + 0.05, 0.6, pop);
      op(logo, clamp(lp * 2.5)); tr(logo, 600, 190, Math.max(0.01, 0.5 + 0.5 * lp));
      op(epi, P(t, mid('title', 0.45), 0.4, linear));
      const castT = k => mid('title', 0.5) + ORDER.indexOf(k) * 0.12;
      const X = k => 120 + ORDER.indexOf(k) * 137;
      const put = (c, k) => { const p = P(t, castT(k), 0.45, pop); op(c, clamp(p * 3)); tr(c, X(k), 590 + 30 * (1 - clamp(p)), Math.max(0.01, (k === 'kavya' ? 0.5 : k === 'ahgong' ? 0.68 : 0.55) * p)); c.set({ t, mood: MOOD[k] }); };
      extras.forEach(e => put(e.c, e.k));
      put(kav, 'kavya'); put(silas, 'silas'); put(sonny, 'sonny');
      kavOn = silOn = sonOn = 1;
    } else {
      extras.forEach(e => op(e.c, 0));
      if (kavOn) op(kav, 1); if (silOn) op(silas, 1); if (sonOn) op(sonny, 1);
    }
    if (!kavOn) op(kav, 0);
    if (!silOn) op(silas, 0);
    if (!sonOn) op(sonny, 0);
  };
});
