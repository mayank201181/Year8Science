/* Scene 0: Cold open (no chapter card).
   Track: Kavya, 12, annoyed -> "I did not sign up for this" (sign-up sheet) -> documentary zoom into
   her thigh -> muscle cells dotted with mitochondria -> zoom into one: it is Mitch, unimpressed ->
   Mitch's confessional (mitochondrion, 'the powerhouse of the cell', the Year 7 note, the mug) ->
   the family photo (a bacterium, 2 billion years ago) -> the WORK calendar -> title card with the cast. */
scene('cold', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;

  /* ---------- local helpers ---------- */
  const on = (t, a, b) => (t >= a && t < b ? 1 : 0);          // hard sitcom cut
  const camBg = (el, k, cx, cy) => el.setAttribute('transform', `translate(${cx.toFixed(1)} ${cy.toFixed(1)}) scale(${k.toFixed(4)}) translate(${(-cx).toFixed(1)} ${(-cy).toFixed(1)})`);
  const place = (el, cam, x, y, s, r) => tr(el, cam.cx + cam.k * (x - cam.cx), cam.cy + cam.k * (y - cam.cy), s * cam.k, r);
  const popIn = (el, t, t0, x, y, s, r) => { const p = P(t, t0, 0.45, pop); op(el, clamp(p * 2.5)); tr(el, x, y, Math.max(0.01, (s || 1) * (0.6 + 0.4 * p)), r); };
  function coldLabel(parent, text, o) {         // dark pill label, readable over any background
    o = o || {};
    return chip(parent, text, { size: o.size || 30, fill: o.fill || 'rgba(10,27,39,0.86)', stroke: o.stroke || C.line, sw: 2, color: o.color || C.ink, weight: o.weight || 700 });
  }

  /* layers: sets at the back, the cast, then props and labels, then the HUD */
  const Lbg = G(root), Lcast = G(root), Lfg = G(root), Lhud = G(root);

  /* ================= A/B: the track ================= */
  const trackShot = G(Lbg);
  const trackWrap = G(trackShot);
  const track = scTrack(trackWrap);
  const kbW = G(trackWrap); const kBody = scKavyaBody(kbW); tr(kbW, 600, 690, 2.4);
  const THIGH = [600, 522];
  // A1 chips: Kavya, 12 / in 2 hours / 800 m
  const aChips = G(Lfg);
  const cKav = coldLabel(aChips, 'Kavya, age 12', { size: 34 });
  const clockG = G(aChips);
  E('circle', { r: 44, fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 5 }, clockG);
  for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; E('line', { x1: Math.cos(a) * 34, y1: Math.sin(a) * 34, x2: Math.cos(a) * 40, y2: Math.sin(a) * 40, stroke: SC_INK, 'stroke-width': 3 }, clockG); }
  const hHr = E('line', { x1: 0, y1: 0, x2: 0, y2: -20, stroke: SC_INK, 'stroke-width': 6, 'stroke-linecap': 'round' }, clockG);
  const hMin = E('line', { x1: 0, y1: 0, x2: 0, y2: -32, stroke: '#E8424F', 'stroke-width': 4, 'stroke-linecap': 'round' }, clockG);
  const clockTxt = coldLabel(aChips, 'Sports Day in 2 hours', { size: 30 });
  const c800 = chip(aChips, '800 m', { size: 64, fill: '#E8424F', color: '#FFFFFF', stroke: '#FFFFFF', sw: 4 });
  // A2: the sign-up sheet
  const sheet = G(Lfg);
  E('rect', { x: -190, y: -135, width: 380, height: 270, rx: 10, fill: '#FBF7EC', stroke: '#C9BFA6', 'stroke-width': 3 }, sheet);
  for (let i = 0; i < 4; i++) E('line', { x1: -160, y1: -40 + i * 50, x2: 160, y2: -40 + i * 50, stroke: '#BFD3E6', 'stroke-width': 2 }, sheet);
  T(sheet, 0, -88, '800 m SIGN-UP', { size: 34, weight: 800, anchor: 'middle', fill: SC_INK });
  const shName = T(sheet, -150, -2, '1. Kavya', { size: 44, weight: 700, fill: '#D32F2F', font: FB });
  shName.setAttribute('font-style', 'italic');
  T(sheet, -150, 100, 'signed: PE teacher', { size: 28, weight: 600, fill: '#5A6B7A', font: FB });
  const shTick = tick(sheet, 22, '#D32F2F'); tr(shTick, 120, -16);
  const ltKavya = scLowerThird(Lhud, 'KAVYA, 12', 'Did not sign up for this.');
  // B: zoom reticle and caption
  const reticle = G(Lfg);
  E('circle', { r: 62, fill: 'none', stroke: '#FFFFFF', 'stroke-width': 4, 'stroke-dasharray': '14 10' }, reticle);
  E('path', { d: 'M-84,0 L-66,0 M66,0 L84,0 M0,-84 L0,-66 M0,66 L0,84', stroke: '#FFFFFF', 'stroke-width': 4, 'stroke-linecap': 'round' }, reticle);
  const smallChip = coldLabel(Lfg, 'something much, much smaller', { size: 32, color: C.energy });

  /* ================= C: muscle cells, then one mitochondrion ================= */
  const mosShot = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#2A0B12' }, mosShot);
  const mos = G(mosShot);
  const FOC = [640, 354];                      // the mitochondrion we zoom into (mosaic coordinates)
  const mr = rng(808);
  for (let i = -4; i <= 11; i++) {
    const y = i * 100 + 30, h = 90, split = -400 + mr() * 1700 + (i % 2) * 300;
    const segs = [[-1000, split - 10], [split + 10, 2200]];
    let stripes = '', mitos = '', nuc = '';
    segs.forEach(([x0, x1]) => {
      E('rect', { x: x0, y: y - h / 2, width: x1 - x0, height: h, rx: h / 2, fill: '#B8414F', stroke: '#E8848E', 'stroke-width': 4 }, mos);
      for (let x = x0 + 40; x < x1 - 40; x += 18) stripes += `M${x},${y - h / 2 + 10} L${x},${y + h / 2 - 10} `;
      for (let x = x0 + 70; x < x1 - 70; x += 64 + mr() * 30) {
        [-22, 22].forEach(dy => {
          const cx = x + mr() * 20, cy = y + dy;
          if (Math.hypot(cx - FOC[0], cy - FOC[1]) < 50) return;
          mitos += `M${(cx - 14).toFixed(1)},${cy} a14,7 0 1,0 28,0 a14,7 0 1,0 -28,0 `;
        });
      }
      for (let x = x0 + 300 + mr() * 200; x < x1 - 200; x += 520 + mr() * 300) nuc += `M${(x - 24).toFixed(1)},${y - h / 2 + 12} a24,8 0 1,0 48,0 a24,8 0 1,0 -48,0 `;
    });
    E('path', { d: stripes, stroke: '#7E2533', 'stroke-width': 5, opacity: 0.55 }, mos);
    E('path', { d: nuc, fill: '#8C6FD6', stroke: '#C9B6FF', 'stroke-width': 2 }, mos);
    E('path', { d: mitos, fill: C.mito, stroke: C.mitoDk, 'stroke-width': 2.5 }, mos);
  }
  const focMito = E('ellipse', { cx: FOC[0], cy: FOC[1], rx: 14, ry: 7, fill: C.mito, stroke: C.mitoDk, 'stroke-width': 2.5 }, mos);
  const lbMus = G(Lfg), lbMusLine = E('line', { stroke: '#FFFFFF', 'stroke-width': 3 }, lbMus), lbMusDot = E('circle', { r: 6, fill: '#FFFFFF' }, lbMus);
  const lbMusChip = coldLabel(lbMus, 'muscle cells', { size: 34 }); tr(lbMusChip, 260, 170);
  const lbMit = G(Lfg), lbMitLine = E('line', { stroke: C.mito, 'stroke-width': 3 }, lbMit), lbMitDot = E('circle', { r: 6, fill: C.mito }, lbMit);
  const lbMitChip = coldLabel(lbMit, 'mitochondria', { size: 34, color: C.mito, stroke: C.mito }); tr(lbMitChip, 820, 560);
  const lbMitSub = coldLabel(lbMit, 'tiny power stations', { size: 28, color: C.energy }); tr(lbMitSub, 820, 622);
  // the documentary viewfinder over B and C
  const finder = G(Lhud);
  E('path', { d: 'M40,140 L40,40 L140,40 M1060,40 L1160,40 L1160,140 M1160,610 L1160,710 L1060,710 M140,710 L40,710 L40,610', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 5, opacity: 0.8 }, finder);
  const zoomTxt = T(finder, 1130, 690, 'ZOOM ×1', { size: 30, weight: 700, anchor: 'end', fill: '#FFFFFF' });

  /* ================= D/F: the confessional ================= */
  const conf = scConfessional(Lbg, 'mitch');
  const ltMitch = scLowerThird(Lhud, 'MITCH', 'Mitochondrion, left thigh');
  const kwMito = G(Lfg);
  const kwChip = chip(kwMito, 'mitochondrion', { size: 50, fill: C.mito, color: '#3A1406', stroke: '#FFD6BF', sw: 4 }); tr(kwChip, 0, 0);
  T(kwMito, 0, 76, 'plural: mitochondria', { size: 30, weight: 600, anchor: 'middle', fill: C.mitoIn });
  const quote = G(Lfg);
  E('rect', { x: -230, y: -110, width: 460, height: 220, rx: 14, fill: '#FFF6D6', stroke: '#E0C878', 'stroke-width': 4 }, quote);
  T(quote, 0, -22, '“the powerhouse', { size: 50, weight: 800, anchor: 'middle', fill: SC_INK });
  T(quote, 0, 42, 'of the cell”', { size: 50, weight: 800, anchor: 'middle', fill: SC_INK });
  const quoteBy = T(Lfg, 880, 490, '(everyone, always)', { size: 28, weight: 600, anchor: 'middle', fill: C.mitoIn, font: FB });
  const note = G(Lfg);
  E('rect', { x: -220, y: -150, width: 440, height: 300, rx: 8, fill: '#FFFFFF', stroke: '#BFD3E6', 'stroke-width': 3 }, note);
  for (let i = 0; i < 5; i++) E('line', { x1: -200, y1: -70 + i * 48, x2: 200, y2: -70 + i * 48, stroke: '#BFD3E6', 'stroke-width': 2 }, note);
  E('line', { x1: -170, y1: -150, x2: -170, y2: 150, stroke: '#F2A0A8', 'stroke-width': 3 }, note);
  T(note, 0, -100, 'YEAR 7 SCIENCE', { size: 32, weight: 800, anchor: 'middle', fill: '#3F5BD9' });
  E('rect', { x: -150, y: -42, width: 330, height: 40, fill: '#FFF176', opacity: 0.85 }, note);
  E('rect', { x: -150, y: 6, width: 330, height: 40, fill: '#FFF176', opacity: 0.85 }, note);
  T(note, -145, -12, 'Mitochondria = the', { size: 32, weight: 700, fill: SC_INK, font: FB });
  T(note, -145, 36, 'powerhouse of the cell!!', { size: 32, weight: 700, fill: SC_INK, font: FB });
  E('path', { d: 'M40,96 c-14,-18 -40,-4 -20,16 l20,18 l20,-18 c20,-20 -6,-34 -20,-16 Z', fill: '#FF6FB5' }, note);
  const mugW = G(Lfg); const mug = scMug(mugW, 1);
  const steam = mug.lastChild;
  // dayoff: the calendar and the birthday cake
  const cal = G(Lfg);
  E('rect', { x: 0, y: 0, width: 440, height: 420, rx: 14, fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 4 }, cal);
  E('path', { d: 'M14,0 L426,0 Q440,0 440,14 L440,64 L0,64 L0,14 Q0,0 14,0 Z', fill: '#E8424F' }, cal);
  T(cal, 220, 45, 'DAYS OFF: 0', { size: 36, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  let grid = '';
  for (let r = 1; r < 7; r++) grid += `M20,${70 + r * 49} L420,${70 + r * 49} `;
  E('path', { d: grid, stroke: '#C9D3DC', 'stroke-width': 2, fill: 'none' }, cal);
  const work = [];
  ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'].forEach((d, r) => {
    T(cal, 30, 70 + r * 49 + 36, d, { size: 28, weight: 700, fill: '#5A6B7A' });
    work.push(T(cal, 410, 70 + r * 49 + 36, 'WORK', { size: 30, weight: 800, anchor: 'end', fill: '#C62828' }));
  });
  const cake = G(Lfg);
  E('rect', { x: -66, y: -28, width: 132, height: 60, rx: 8, fill: '#F7B6CF', stroke: SC_INK, 'stroke-width': 3 }, cake);
  E('path', { d: 'M-66,-14 Q-55,4 -44,-14 Q-33,4 -22,-14 Q-11,4 0,-14 Q11,4 22,-14 Q33,4 44,-14 Q55,4 66,-14 L66,-20 Q66,-28 58,-28 L-58,-28 Q-66,-28 -66,-20 Z', fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 2 }, cake);
  E('rect', { x: -6, y: -72, width: 12, height: 44, fill: '#7FB6FF', stroke: SC_INK, 'stroke-width': 2 }, cake);
  const flame = E('path', { d: 'M0,-100 Q12,-84 0,-74 Q-12,-84 0,-100 Z', fill: '#FFC247', stroke: '#E8742A', 'stroke-width': 2 }, cake);
  const cakeQ = T(Lfg, 1010, 668, '?', { size: 96, weight: 800, anchor: 'middle', fill: C.energy });
  const birthTxt = coldLabel(Lfg, 'birthday: unknown', { size: 30, color: C.energy });

  /* ================= E: the office, the family photo ================= */
  const famShot = G(Lbg);
  scOffice(famShot);
  const frame = G(famShot); tr(frame, 500, 300);
  E('rect', { x: -240, y: -170, width: 480, height: 340, rx: 10, fill: '#C9A24A', stroke: '#6B4E12', 'stroke-width': 6 }, frame);
  E('rect', { x: -212, y: -142, width: 424, height: 284, fill: linGrad('#E9D8B0', '#C7A877', true), stroke: '#8A6D35', 'stroke-width': 3 }, frame);
  const bac = G(frame); tr(bac, 0, 10);
  const flag = E('path', { d: '', fill: 'none', stroke: '#6B5426', 'stroke-width': 4, 'stroke-linecap': 'round' }, bac);
  E('rect', { x: -120, y: -52, width: 240, height: 104, rx: 52, fill: '#B7A46A', stroke: '#5E4B1E', 'stroke-width': 5 }, bac);
  E('circle', { cx: -34, cy: -10, r: 9, fill: '#3A2A10' }, bac); E('circle', { cx: 34, cy: -10, r: 9, fill: '#3A2A10' }, bac);
  E('circle', { cx: 34, cy: -10, r: 20, fill: 'none', stroke: '#3A2A10', 'stroke-width': 3 }, bac);   // monocle
  E('path', { d: 'M-40,18 Q-20,8 0,16 Q20,8 40,18 Q20,30 0,22 Q-20,30 -40,18 Z', fill: '#5E4B1E' }, bac);   // moustache
  const plaque = G(famShot); tr(plaque, 500, 548);
  E('rect', { x: -250, y: -46, width: 500, height: 104, rx: 12, fill: '#2A1216', stroke: '#C9A24A', 'stroke-width': 3 }, plaque);
  T(plaque, 0, -6, 'Great-great-…-grandpa (a bacterium)', { size: 30, weight: 700, anchor: 'middle', fill: '#FFE6B0' });
  T(plaque, 0, 36, 'about 2 billion years ago', { size: 28, weight: 600, anchor: 'middle', fill: C.mitoIn, font: FB });

  /* ================= G: title card ================= */
  const titleShot = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#1B1030', '#4A1F33', true) }, titleShot);
  let rays = '';
  for (let i = 0; i < 16; i++) { const a0 = i / 16 * TAU, a1 = a0 + TAU / 40; rays += `M0,0 L${(Math.cos(a0) * 1100).toFixed(0)},${(Math.sin(a0) * 1100).toFixed(0)} L${(Math.cos(a1) * 1100).toFixed(0)},${(Math.sin(a1) * 1100).toFixed(0)} Z `; }
  const rayP = E('path', { d: rays, fill: '#FFE45C', opacity: 0.07 }, titleShot);
  E('ellipse', { cx: 600, cy: 560, rx: 560, ry: 190, fill: glow('#FFB27A'), opacity: 0.35 }, titleShot);
  const logo = G(Lfg);
  const logoT = T(logo, 0, 0, 'THE POWERHOUSE', { size: 92, weight: 800, anchor: 'middle', fill: C.energy });
  logoT.setAttribute('stroke', '#5A2B07'); logoT.setAttribute('stroke-width', 12); logoT.setAttribute('paint-order', 'stroke'); logoT.setAttribute('stroke-linejoin', 'round');
  const lb1 = bolt(logo, 0.62); tr(lb1, -450, -30, 0.62, -12);
  const lb2 = bolt(logo, 0.62); tr(lb2, 450, -30, 0.62, 12);
  const epi = T(Lfg, 600, 300, 'Episode 2: Sports Day', { size: 42, weight: 700, anchor: 'middle', fill: '#FFFFFF' });

  /* ================= the cast ================= */
  const kav = scChar(Lcast, 'kavya', { mood: 'annoyed' });
  const mitch = scChar(Lcast, 'mitch', { mood: 'deadpan' });
  const extras = [['gloria', 170, 478, 'happy'], ['twins', 385, 478, 'happy'], ['carl', 600, 478, 'sad'], ['wally', 815, 478, 'neutral'], ['larry', 1030, 478, 'happy'],
    ['fern', 710, 620, 'happy'], ['bao', 930, 620, 'neutral']].map(([k, x, y, mood]) => ({ c: scChar(Lcast, k, { mood }), k, x, y, mood }));
  const CAST_ORDER = { gloria: 0, twins: 1, carl: 2, wally: 3, larry: 4, kavya: 5, mitch: 6, fern: 7, bao: 8 };

  const blackout = E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#000000' }, Lhud);

  /* cut points */
  const cA2 = at('signed') - 0.12, cB = at('small') - 0.1, cD = at('hi') - 0.06, cD2 = at('havemug') - 0.06,
    cE = at('family') - 0.06, cF = at('dayoff') - 0.06, cG = at('title') - 0.06;

  return t => {
    op(blackout, 1 - P(t, 0, 0.6, linear));
    const sA = on(t, -1, cB), sB = on(t, cB, at('thigh') + 0.6), sC = on(t, end('small') - 0.5, cD);
    const sD = on(t, cD, cE), sE = on(t, cE, cF), sF = on(t, cF, cG), sG = on(t, cG, 1e9);

    /* ---------- track (A and B) ---------- */
    op(trackShot, Math.max(sA, sB));
    let kavShown = 0;
    if (sA || sB) {
      track.upd(t, 0);
      if (sA) {
        op(kbW, 0);
        const tight = t >= cA2;
        const push = tight ? P(t, cA2, 4.5, linear) : P(t, 0, 7, linear);
        camBg(trackWrap, tight ? 1.3 + 0.04 * push : 1 + 0.03 * push, 700, 420);
        const kx = tight ? 790 : 780, ky = tight ? 560 : 548, ks = (tight ? 2.0 : 1.5) * (1 + 0.04 * push);
        tr(kav, kx, ky, ks);
        const lookSheet = tight && t > mid('signed', 0.5) && t < end('signed') - 0.1 ? -0.7 : 0;
        kav.set({ t, talk: scTalk(S, t, 'kavya'), mood: t > end('signed') ? 'deadpan' : 'annoyed', look: lookSheet });
        kavShown = 1;
        // A1 chips
        const f1 = 1 - (tight ? 1 : 0);
        op(aChips, f1);
        if (f1) {
          popIn(cKav, t, mid('kavya', 0.05), 280, 190);
          const pc = P(t, mid('kavya', 0.3), 0.45, pop);
          op(clockG, clamp(pc * 2.5)); tr(clockG, 110, 320, Math.max(0.01, 0.6 + 0.4 * pc));
          const spin = clamp((t - mid('kavya', 0.3)) / 2.2) * 2;   // the clock races forward two hours
          tr(hMin, 0, 0, 1, spin * 360); tr(hHr, 0, 0, 1, 300 + spin * 30);
          op(clockTxt, clamp(pc * 2.5)); tr(clockTxt, 330, 320);
          popIn(c800, t, mid('kavya', 0.66), 270, 470, 1, -4);
        }
        // A2 sheet + lower third
        const sp = tight ? P(t, mid('signed', 0.42), 0.4, pop) : 0;
        op(sheet, clamp(sp * 2.5)); tr(sheet, 300, 300, Math.max(0.01, 0.7 + 0.3 * sp), -4);
        op(shTick, P(t, mid('signed', 0.62), 0.3, linear));
        ltKavya.set(tight ? win(t, at('signed') + 0.1, at('signed') + 3.4, 0.3) : 0);
      } else { op(aChips, 0); op(sheet, 0); ltKavya.set(0); }
      if (sB) {
        op(kbW, 1);
        const zp = P(t, mid('small', 0.55), end('small') + 0.3 - mid('small', 0.55), easeIn);
        const k = Math.pow(12, zp), sx = THIGH[0], sy = THIGH[1] + (400 - THIGH[1]) * (1 - 1 / k);
        trackWrap.setAttribute('transform', `translate(${sx} ${sy.toFixed(1)}) scale(${k.toFixed(4)}) translate(${-THIGH[0]} ${-THIGH[1]})`);
        kBody.pose({ lean: 0, armL: [10 + 4 * Math.sin(t * 2) * AMP, 14], armR: [-10, 16], legL: [4, -4], legR: [-4, -4] });
        const rp = P(t, mid('small', 0.42), 0.4, pop);
        op(reticle, clamp(rp * 2) * (1 - P(t, end('small') - 0.6, 0.3, linear))); tr(reticle, sx, sy, Math.max(0.01, (0.6 + 0.4 * rp) * (1 + zp * 0.4)), t * 30 * AMP);
        op(smallChip, win(t, mid('small', 0.55), end('small') - 0.3, 0.3)); tr(smallChip, 860, 230);
      } else { op(reticle, 0); op(smallChip, 0); }
    } else { op(aChips, 0); op(sheet, 0); ltKavya.set(0); op(reticle, 0); op(smallChip, 0); }

    /* ---------- C: muscle cells -> one mitochondrion -> Mitch ---------- */
    let mitchShown = 0;
    op(mosShot, sC ? P(t, end('small') - 0.5, 0.6, linear) : 0);
    op(finder, Math.max(sB, sC));
    if (sB || sC) {
      const zB = P(t, mid('small', 0.55), end('small') + 0.3 - mid('small', 0.55), easeIn);
      const zT = P(t, at('this') - 0.1, end('this') - at('this'), ease);
      const mag = t < at('thigh') ? Math.pow(1000, zB) : 1000 * Math.pow(10, zT);
      setText(zoomTxt, 'ZOOM ×' + (mag >= 9999.5 ? '10 000' : String(Math.round(mag / (mag > 100 ? 10 : 1)) * (mag > 100 ? 10 : 1))));
    }
    if (sC) {
      let k = lerp(0.55, 1, P(t, end('small') - 0.5, 1.4, easeOut));
      k *= 1 + 0.3 * P(t, at('thigh'), end('thigh') - at('thigh'), linear);
      const zT = P(t, at('this') - 0.1, end('this') - at('this'), ease);
      k *= Math.pow(14 / 1.3, zT);
      const sx = lerp(FOC[0], 600, zT), sy = lerp(FOC[1], 400, zT);
      mos.setAttribute('transform', `translate(${sx.toFixed(1)} ${sy.toFixed(1)}) scale(${k.toFixed(4)}) translate(${-FOC[0]} ${-FOC[1]})`);
      const scr = (x, y) => [sx + k * (x - FOC[0]), sy + k * (y - FOC[1])];
      // labels with leaders that follow the zoom
      const fm = win(t, mid('thigh', 0.08), at('this') - 0.1, 0.3), fi = win(t, mid('thigh', 0.55), at('this') + 0.2, 0.3);
      op(lbMus, fm); op(lbMit, fi);
      if (fm) { const [x, y] = scr(470, 230); attr(lbMusLine, 'x1', 260); attr(lbMusLine, 'y1', 200); attr(lbMusLine, 'x2', x); attr(lbMusLine, 'y2', y); attr(lbMusDot, 'cx', x); attr(lbMusDot, 'cy', y); }
      if (fi) { const [x, y] = scr(FOC[0], FOC[1]); attr(lbMitLine, 'x1', 820); attr(lbMitLine, 'y1', 540); attr(lbMitLine, 'x2', x); attr(lbMitLine, 'y2', y); attr(lbMitDot, 'cx', x); attr(lbMitDot, 'cy', y); }
      tr(lbMitChip, 820, 560); op(lbMitSub, P(t, mid('thigh', 0.72), 0.4, linear));
      op(focMito, 1 - clamp((k - 7) / 3));
      const mOp = clamp((k - 6) / 4);
      if (mOp > 0) {
        mitchShown = 1;
        op(mitch, mOp); tr(mitch, sx, sy, 0.112 * k);
        const up = t > end('this') + 0.05;
        mitch.set({ t, talk: 0, mood: up ? 'deadpan' : 'neutral', look: up ? 0 : -0.9, still: !up });
      }
      op(mos, 1 - 0.55 * zT);
    } else { op(lbMus, 0); op(lbMit, 0); }

    /* ---------- D: confessional (hi, before, mug), D2: close-up with the mug ---------- */
    const confOn = Math.max(sD, sF);
    conf.set(confOn, t);
    let cam = { k: 1, cx: 600, cy: 400 };
    const close = sD && t >= cD2;
    if (sD) {
      if (close) cam = { k: 1.32 * (1 + 0.07 * P(t, cD2, cE - cD2, linear)), cx: 470, cy: 420 };
      else {
        const push = P(t, end('before'), at('mug') - end('before') + 0.3, ease);
        cam = { k: 1 + 0.06 * push - 0.06 * P(t, at('mug') + 0.2, 0.01, linear), cx: 430, cy: 380 };
      }
      camBg(conf, cam.k, cam.cx, cam.cy);
      mitchShown = 1; op(mitch, 1);
      place(mitch, cam, 430, 400, 1.5);
      let mood = 'deadpan', look = 0;
      if (!close) {
        if (t < at('before')) mood = 'neutral';
        else if (t < mid('before', 0.4)) mood = 'annoyed';
        else if (t >= at('mug') && t < mid('mug', 0.75)) { mood = 'annoyed'; look = t > mid('mug', 0.35) ? 0.6 : 0; }
      }
      mitch.set({ t, talk: scTalk(S, t, 'mitch'), mood, look });
      ltMitch.set(win(t, at('hi') + 0.1, at('hi') + 3.4, 0.3));
      const kw = close ? 0 : win(t, mid('hi', 0.35), at('before') + 0.6, 0.2);
      op(kwMito, kw); if (kw) tr(kwMito, 880, 330, 0.85 + 0.15 * P(t, mid('hi', 0.35), 0.4, pop));
      const qp = close ? 0 : P(t, mid('before', 0.45), 0.45, pop) * (1 - P(t, mid('mug', 0.32), 0.15, linear));
      op(quote, clamp(qp * 2.5)); place(quote, cam, 880, 330, Math.max(0.01, 0.7 + 0.3 * qp), 3);
      op(quoteBy, close ? 0 : P(t, mid('before', 0.75), 0.4, linear) * (1 - P(t, mid('mug', 0.32), 0.15, linear))); 
      const np = close ? 0 : P(t, mid('mug', 0.34), 0.4, pop) * (1 - P(t, mid('mug', 0.8), 0.15, linear));
      op(note, clamp(np * 2.5)); tr(note, 880, 340, Math.max(0.01, 0.75 + 0.25 * np), -3);
      const mp = P(t, mid('mug', 0.8), 0.5, pop);
      op(mugW, clamp(mp * 3));
      if (close) place(mugW, cam, 760, 392 + Math.sin(t * 1.4) * 2 * AMP, 1.3);
      else place(mugW, cam, 730, 470 + 220 * (1 - mp), 1.25);
      op(steam, 0.4 + 0.3 * Math.sin(t * 3));
    } else { ltMitch.set(0); op(kwMito, 0); op(quote, 0); op(quoteBy, 0); op(note, 0); op(mugW, 0); }

    /* ---------- E: the family photo ---------- */
    op(famShot, sE);
    if (sE) {
      const push = P(t, cE, cF - cE, linear);
      camBg(famShot, 1 + 0.05 * push, 500, 320);
      let d = 'M120,0';
      for (let i = 1; i <= 8; i++) d += ` L${120 + i * 12},${(Math.sin(i * 1.3 - t * 6 * AMP) * 10).toFixed(1)}`;
      attr(flag, 'd', d);
      mitchShown = 1; op(mitch, 1);
      tr(mitch, 1010 + 0, 470, 0.95);
      mitch.set({ t, talk: 0, mood: t > mid('family', 0.45) ? 'happy' : 'neutral', look: -1 });
    }

    /* ---------- F: day off: the calendar ---------- */
    if (sF) {
      cam = { k: 1, cx: 600, cy: 400 };
      camBg(conf, 1.08, 380, 400);
      mitchShown = 1; op(mitch, 1);
      tr(mitch, 380, 410, 1.35);
      const sad = t > mid('dayoff', 0.72);
      mitch.set({ t, talk: scTalk(S, t, 'mitch'), mood: sad ? 'sad' : 'deadpan', look: !sad && t > mid('dayoff', 0.1) && t < mid('dayoff', 0.5) ? 0.8 : 0 });
      const cp = P(t, at('dayoff'), 0.35, pop);
      op(cal, clamp(cp * 3)); tr(cal, 700, 120 + 30 * (1 - cp));
      work.forEach((w, i) => { const p = P(t, at('dayoff') + 0.3 + i * 0.14, 0.25, pop); op(w, clamp(p * 3)); tr(w, 0, 0); });
      const kp = P(t, mid('dayoff', 0.5), 0.45, pop);
      op(cake, clamp(kp * 2.5)); tr(cake, 860, 650, Math.max(0.01, 0.6 + 0.4 * kp));
      tr(flame, 0, 0, 1, Math.sin(t * 9) * 6 * AMP);
      const qp = P(t, mid('dayoff', 0.72), 0.4, pop);
      op(cakeQ, clamp(qp * 2.5)); cakeQ.setAttribute('transform', `translate(1010 640) rotate(${(8 * Math.sin(t * 3) * AMP).toFixed(1)}) scale(${Math.max(0.01, qp).toFixed(3)}) translate(-1010 -640)`);
      op(birthTxt, P(t, mid('dayoff', 0.8), 0.3, linear)); tr(birthTxt, 590, 680);
    } else { op(cal, 0); op(cake, 0); op(cakeQ, 0); op(birthTxt, 0); }

    /* ---------- G: title card, the cast pops in ---------- */
    op(titleShot, sG); op(logo, 0); op(epi, 0);
    if (sG) {
      tr(rayP, 600, 560, 1, (t * 6 * AMP) % 360);
      const lp = P(t, at('title') + 0.05, 0.6, pop);
      op(logo, clamp(lp * 2.5)); tr(logo, 600, 205, Math.max(0.01, 0.5 + 0.5 * lp));
      op(epi, P(t, mid('title', 0.45), 0.4, linear));
      const castT = k => mid('title', 0.55) + CAST_ORDER[k] * 0.13;
      extras.forEach(e => { const p = P(t, castT(e.k), 0.45, pop); op(e.c, clamp(p * 3)); tr(e.c, e.x, e.y + 30 * (1 - clamp(p)), Math.max(0.01, 0.55 * p)); e.c.set({ t, mood: e.mood, look: 0 }); });
      const pk = P(t, castT('kavya'), 0.45, pop);
      op(kav, clamp(pk * 3)); tr(kav, 270, 610 + 30 * (1 - clamp(pk)), Math.max(0.01, 0.5 * pk)); kav.set({ t, mood: 'annoyed' });
      kavShown = 1;
      const pm = P(t, castT('mitch'), 0.45, pop);
      mitchShown = 1; op(mitch, clamp(pm * 3)); tr(mitch, 490, 620 + 30 * (1 - clamp(pm)), Math.max(0.01, 0.55 * pm)); mitch.set({ t, mood: 'deadpan' });
    } else extras.forEach(e => op(e.c, 0));

    if (!kavShown) op(kav, 0); else if (!sG) op(kav, 1);
    if (!mitchShown) op(mitch, 0);
  };
});
