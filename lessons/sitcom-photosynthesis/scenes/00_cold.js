/* Scene 0: Cold open (no chapter card).
   Bedroom: Kavya, 12, and her project plant ("It's called Plant.") -> documentary zoom into the big leaf ->
   palisade cells packed with chloroplasts -> zoom into one: it is Clive, unimpressed -> Clive's confessional
   (chloroPLAST vs chloroPHYLL, the exam answer) -> the factory floor (solar powered for a billion years) ->
   Clive's deadpan "And she says we don't do anything." -> title card with the cast. */
scene('cold', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;

  /* ---------- local helpers ---------- */
  const on = (t, a, b) => (t >= a && t < b ? 1 : 0);          // hard sitcom cut
  const camBg = (el, k, cx, cy) => el.setAttribute('transform', `translate(${cx.toFixed(1)} ${cy.toFixed(1)}) scale(${k.toFixed(4)}) translate(${(-cx).toFixed(1)} ${(-cy).toFixed(1)})`);
  // put the point (fx, fy) of el at screen (sx, sy), scaled by k
  const camTo = (el, k, fx, fy, sx, sy) => el.setAttribute('transform', `translate(${(sx === undefined ? 600 : sx).toFixed(1)} ${(sy === undefined ? 375 : sy).toFixed(1)}) scale(${k.toFixed(4)}) translate(${(-fx).toFixed(1)} ${(-fy).toFixed(1)})`);
  const place = (el, cam, x, y, s, r) => tr(el, cam.cx + cam.k * (x - cam.cx), cam.cy + cam.k * (y - cam.cy), s * cam.k, r);
  const popIn = (el, t, t0, x, y, s, r) => { const p = P(t, t0, 0.45, pop); op(el, clamp(p * 2.5)); tr(el, x, y, Math.max(0.01, (s || 1) * (0.6 + 0.4 * p)), r); };
  function coldLabel(parent, text, o) {         // dark pill label, readable over any background
    o = o || {};
    return chip(parent, text, { size: o.size || 30, fill: o.fill || 'rgba(10,27,39,0.86)', stroke: o.stroke || C.line, sw: 2, color: o.color || C.ink, weight: o.weight || 700 });
  }

  /* layers: sets at the back, the cast, then props and labels, then the HUD */
  const Lbg = G(root), Lcast = G(root), Lfg = G(root), Lhud = G(root);

  /* ================= A/B: the bedroom ================= */
  const bedShot = G(Lbg);
  const bedWrap = G(bedShot);
  const bed = phBedroom(bedWrap);
  const [PX, PY] = bed.plantAt;                                   // pot base on the sill
  const PS = 0.85;
  const NOTE = [PX, PY - 54 * PS];                                // the "PLANT" sticky note
  const LEAF = [PX + bed.plant.leafAt[0] * PS + 20, PY + bed.plant.leafAt[1] * PS - 12];   // the big right leaf
  // A chips: Kavya, 12 / the project sheet / week 6
  const aChips = G(Lfg);
  const cKav = coldLabel(aChips, 'Kavya, age 12', { size: 34 });
  const sheet = G(aChips);
  E('rect', { x: -200, y: -86, width: 400, height: 172, rx: 6, fill: '#FFF8C4', stroke: '#C9B53A', 'stroke-width': 3 }, sheet);
  T(sheet, 0, -36, 'PLANT PROJECT', { size: 34, weight: 800, anchor: 'middle', fill: '#2A3A8A' });
  T(sheet, 0, 8, 'Keep it alive', { size: 30, weight: 600, anchor: 'middle', fill: SC_INK, font: FB });
  T(sheet, 0, 46, 'for one whole term.', { size: 30, weight: 600, anchor: 'middle', fill: SC_INK, font: FB });
  const cWeek = chip(aChips, 'WEEK 6', { size: 30, fill: '#E8424F', color: '#FFFFFF', stroke: '#FFFFFF', sw: 3 });
  const ltKavya = phLower(Lhud, 'kavya');
  const greenChip = coldLabel(Lfg, '(being green)', { size: 28, color: C.plant, stroke: C.plant });
  // C: zoom reticle, viewfinder, caption
  const reticle = G(Lfg);
  E('circle', { r: 70, fill: 'none', stroke: '#FFFFFF', 'stroke-width': 4, 'stroke-dasharray': '14 10' }, reticle);
  E('path', { d: 'M-92,0 L-74,0 M74,0 L92,0 M0,-92 L0,-74 M0,74 L0,92', stroke: '#FFFFFF', 'stroke-width': 4, 'stroke-linecap': 'round' }, reticle);
  const smallChip = coldLabel(Lfg, 'what Plant does all day', { size: 32, color: C.energy });
  const finder = G(Lhud);
  E('path', { d: 'M40,140 L40,40 L140,40 M1060,40 L1160,40 L1160,140 M1160,610 L1160,710 L1060,710 M140,710 L40,710 L40,610', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 5, opacity: 0.8 }, finder);
  const recDot = E('circle', { cx: 1090, cy: 72, r: 9, fill: '#FF3B3B' }, finder);
  T(finder, 1106, 82, 'REC', { size: 26, weight: 700, fill: '#FFFFFF' });
  const zoomTxt = T(finder, 1130, 690, 'ZOOM ×1', { size: 30, weight: 700, anchor: 'end', fill: '#FFFFFF' });

  /* ================= D/E: inside the leaf: palisade cells, then one chloroplast ================= */
  const mosShot = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#D9F2DC' }, mosShot);
  const mos = G(mosShot);
  const FOC = [640, 354];                                         // the chloroplast we zoom into
  const mr = rng(512);
  let walls = '', chl = '';
  for (let row = -2; row < 6; row++) {
    const y0 = row * 230 - 60, off = (row % 2) * 34;
    for (let x = -700 + off; x < 1900; x += 68) {
      const h = 210;
      walls += `M${x + 30},${y0} a30,30 0 0 1 30,30 v${h - 60} a30,30 0 0 1 -30,30 a30,30 0 0 1 -30,-30 v${-(h - 60)} a30,30 0 0 1 30,-30 Z `;
      for (let k = 0; k < 7; k++) {
        const cx = x + (k % 2 ? 44 : 16) + mr() * 4, cy = y0 + 22 + k * 25 + mr() * 4;
        if (Math.hypot(cx - FOC[0], cy - FOC[1]) < 30) continue;
        chl += `M${(cx - 12).toFixed(1)},${cy.toFixed(1)} a12,7 0 1,0 24,0 a12,7 0 1,0 -24,0 `;
      }
    }
  }
  E('path', { d: walls, fill: '#BDEDC5', stroke: '#3E9E58', 'stroke-width': 5 }, mos);
  E('path', { d: chl, fill: C.chloro, stroke: C.chloroDk, 'stroke-width': 2.5 }, mos);
  const focChl = E('ellipse', { cx: FOC[0], cy: FOC[1], rx: 12, ry: 7, fill: C.chloro, stroke: C.chloroDk, 'stroke-width': 2.5 }, mos);
  const lbCell = G(Lfg), lbCellLine = E('line', { stroke: '#1E5A32', 'stroke-width': 3 }, lbCell), lbCellDot = E('circle', { r: 6, fill: '#1E5A32' }, lbCell);
  const lbCellChip = coldLabel(lbCell, 'leaf cells', { size: 34 }); tr(lbCellChip, 250, 170);
  const lbChl = G(Lfg), lbChlLine = E('line', { stroke: '#1E5A32', 'stroke-width': 3 }, lbChl), lbChlDot = E('circle', { r: 6, fill: '#1E5A32' }, lbChl);
  const lbChlChip = coldLabel(lbChl, 'chloroplasts', { size: 34, color: '#8FE59C', stroke: '#8FE59C' }); tr(lbChlChip, 860, 560);
  const lbChlSub = coldLabel(lbChl, 'tiny green factories', { size: 28, color: C.energy }); tr(lbChlSub, 860, 622);

  /* ================= F/H: the confessional ================= */
  const conf = phConf(Lbg, 'clive');
  const ltClive = phLower(Lhud, 'clive');
  const kw = G(Lfg);
  chip(kw, 'chloroplast', { size: 52, fill: C.chloro, color: '#0E3A22', stroke: '#C9F2D3', sw: 4 });
  // not: the two names, two panels
  const names = G(Lfg);
  const panel = (y, big, small, col, sub, icon) => {
    const p = G(names); tr(p, 0, y);
    E('rect', { x: -250, y: -95, width: 500, height: 190, rx: 18, fill: 'rgba(10,27,39,0.9)', stroke: col, 'stroke-width': 4 }, p);
    const tx = E('text', { x: -40, y: -14, 'font-size': 56, 'font-weight': 800, 'text-anchor': 'middle', 'font-family': FD, fill: C.ink }, p);
    const a = E('tspan', {}, tx); a.textContent = 'chloro';
    const b = E('tspan', { fill: col }, tx); b.textContent = big;
    T(p, -40, 34, small, { size: 28, weight: 700, anchor: 'middle', fill: C.ink, font: FB });
    T(p, -40, 70, sub, { size: 26, weight: 600, anchor: 'middle', fill: C.muted, font: FB });
    const ic = G(p); tr(ic, 186, 0); icon(ic);
    return p;
  };
  const pPlast = panel(-110, 'PLAST', '= the structure', C.glucose, '(the building: me)', ic => {
    E('rect', { x: -40, y: -30, width: 80, height: 70, fill: '#8FE59C', stroke: SC_INK, 'stroke-width': 3 }, ic);
    for (let i = 0; i < 3; i++) E('rect', { x: -28 + i * 22, y: -14, width: 12, height: 14, fill: '#1E5A32' }, ic);
    E('path', { d: 'M-34,-30 Q-32,-72 0,-74 Q32,-72 34,-30 Z', fill: '#FFC93C', stroke: SC_INK, 'stroke-width': 3 }, ic);
    E('rect', { x: -46, y: -36, width: 92, height: 10, rx: 5, fill: '#FFB000', stroke: SC_INK, 'stroke-width': 3 }, ic);
  });
  const pPhyll = panel(110, 'PHYLL', '= the green pigment', C.plant, '(inside it: Phyllis)', ic => {
    E('path', { d: 'M0,-56 C26,-20 40,0 40,20 C40,44 22,58 0,58 C-22,58 -40,44 -40,20 C-40,0 -26,-20 0,-56 Z', fill: ball('#7BE08A', '#23874A'), stroke: SC_INK, 'stroke-width': 3 }, ic);
    E('path', { d: 'M-16,8 Q-14,-8 -4,-16', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 5, opacity: 0.6, 'stroke-linecap': 'round' }, ic);
  });
  // exams: a pupil's answer, marked
  const paper = G(Lfg);
  E('rect', { x: -230, y: -150, width: 460, height: 300, rx: 8, fill: '#FFFFFF', stroke: '#BFD3E6', 'stroke-width': 3 }, paper);
  for (let i = 0; i < 4; i++) E('line', { x1: -205, y1: -22 + i * 50, x2: 205, y2: -22 + i * 50, stroke: '#D6E4F0', 'stroke-width': 2 }, paper);
  T(paper, -205, -104, 'Q3. Where does', { size: 28, weight: 700, fill: '#3A4A57', font: FB });
  T(paper, -205, -68, 'photosynthesis happen?', { size: 28, weight: 700, fill: '#3A4A57', font: FB });
  const ans = T(paper, -205, 18, 'In the chlorophyll.', { size: 36, weight: 700, fill: '#2F55C8', font: FB });
  ans.setAttribute('font-style', 'italic');
  E('line', { x1: -60, y1: 30, x2: 150, y2: 30, stroke: '#E8424F', 'stroke-width': 4 }, paper);
  const pCross = cross(paper, 30, '#E8424F'); tr(pCross, 150, 86);
  const minus = T(paper, -120, 100, '−1 mark', { size: 40, weight: 800, fill: '#E8424F' });

  /* ================= G: the factory floor ================= */
  const facShot = G(Lbg);
  const facWrap = G(facShot);
  const fac = phFactory(facWrap);
  const plaque = G(facWrap); tr(plaque, 330, 200);
  E('rect', { x: -230, y: -62, width: 460, height: 124, rx: 12, fill: '#2A1A10', stroke: '#C9A24A', 'stroke-width': 4 }, plaque);
  T(plaque, 0, -12, 'SOLAR POWERED', { size: 40, weight: 800, anchor: 'middle', fill: '#FFE45C' });
  T(plaque, 0, 34, 'since over a billion years ago', { size: 27, weight: 600, anchor: 'middle', fill: '#FFE6B0', font: FB });
  const clip = scClipboard(Lfg, 0.8);
  const facGus = [0, 1, 2].map(i => { const m = molGlucose(Lfg, 26); return m; });   // little glucose riding the belt

  /* ================= I: title card ================= */
  const titleShot = G(Lbg);
  const title = phTitle(titleShot);
  const logo = phLogo(Lfg);
  const epi = T(Lfg, 600, 300, 'Episode 1: The Plant That Does Nothing', { size: 40, weight: 700, anchor: 'middle', fill: '#FFFFFF' });

  /* ================= the cast ================= */
  const kav = cast(Lcast, 'kavya', { mood: 'annoyed' });
  const clive = cast(Lcast, 'clive', { mood: 'deadpan' });
  const extras = [['phyllis', 175, 470, 0.6, 'smug'], ['cosmo', 405, 476, 0.56, 'smug'], ['dewi', 625, 470, 0.6, 'happy'], ['gus', 825, 470, 0.6, 'happy'],
    ['olive', 1030, 476, 0.58, 'deadpan'], ['guards', 370, 640, 0.6, 'deadpan']].map(([k, x, y, s, mood]) => ({ c: cast(Lcast, k, { mood }), k, x, y, s, mood }));
  const CAST_ORDER = { phyllis: 0, cosmo: 1, dewi: 2, gus: 3, olive: 4, guards: 5, kavya: 6, clive: 7 };

  const blackout = E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#000000' }, Lhud);

  /* cut points */
  const cA1 = at('nothing') - 0.1, cB = at('name') - 0.08, cB2 = at('plant') - 0.08, cB3 = end('plant') + 0.08,
    cC = at('small') - 0.06, cD = end('small') - 0.4, cF = at('hi') - 0.06, cG = at('billion') - 0.06, cH = at('does') - 0.06, cI = at('title') - 0.06;

  return t => {
    op(blackout, 1 - P(t, 0, 0.6, linear));
    const sA = on(t, -1, cB), sB = on(t, cB, cB2), sB2 = on(t, cB2, cB3), sB3 = on(t, cB3, cC), sC = on(t, cC, cD + 0.5);
    const sD = on(t, cD, cF), sF = on(t, cF, cG), sG = on(t, cG, cH), sH = on(t, cH, cI), sI = on(t, cI, 1e9);

    /* ---------- bedroom (A, B, C) ---------- */
    const bedOn = Math.max(sA, sB, sB2, sB3, sC);
    op(bedShot, bedOn);
    let kavShown = 0;
    if (bedOn) {
      bed.set({ t, night: 0, lamp: 0 });
      bed.plant.set({ t, droop: sB3 ? 0.25 : 0 });
      const tight = sA ? t >= cA1 : sB2;
      if (sA || sB2) {
        if (tight) camBg(bedWrap, 1.2 + 0.04 * P(t, sA ? cA1 : cB2, 5, linear), 700, 420);
        else camBg(bedWrap, 1 + 0.03 * P(t, 0, 7, linear), 700, 420);
        const ks = tight ? 2.0 : 1.4;
        tr(kav, tight ? 870 : 850, tight ? 600 : 570, ks * (1 + 0.03 * P(t, 0, 20, linear)));
        let mood = 'annoyed', look = 0;
        if (sA && tight && t > mid('nothing', 0.45) && t < mid('nothing', 0.8)) look = -0.8;
        if (sB2) mood = 'deadpan';
        kav.set({ t, talk: scTalk(S, t, 'kavya'), mood, look });
        kavShown = 1;
      }
      // A0 chips
      const f0 = sA && !tight ? 1 : 0;
      op(aChips, f0);
      if (f0) {
        popIn(cKav, t, mid('kavya', 0.08), 290, 190);
        popIn(sheet, t, mid('kavya', 0.4), 1000, 190, 0.85, 3);
        popIn(cWeek, t, mid('kavya', 0.72), 1090, 300, 1, -4);
      }
      ltKavya.set(sA && tight ? win(t, at('nothing') + 0.1, at('nothing') + 3.4, 0.3) : 0);
      const gp = sA && tight ? P(t, mid('nothing', 0.82), 0.4, pop) : 0;
      op(greenChip, clamp(gp * 2.5)); tr(greenChip, 270, 200, Math.max(0.01, 0.7 + 0.3 * gp), -4);
      // B: Plant close-up, then the sticky note
      if (sB) camTo(bedWrap, 2.3 + 0.25 * P(t, cB, cB2 - cB, linear), PX, PY - 110, 600, 400);
      if (sB3) camTo(bedWrap, 5.2 + 0.4 * P(t, cB3, cC - cB3, linear), NOTE[0], NOTE[1], 600, 380);
      // C: zoom into the big leaf
      if (sC) {
        const zp = P(t, mid('small', 0.35), cD + 0.5 - mid('small', 0.35), easeIn);
        const k = 2.3 * Math.pow(26, zp);
        const fp = P(t, at('small'), 0.9, ease);
        camTo(bedWrap, k, lerp(PX, LEAF[0], fp), lerp(PY - 110, LEAF[1], fp), 600, 380);
        const rp = P(t, mid('small', 0.2), 0.4, pop);
        op(reticle, clamp(rp * 2) * (1 - P(t, cD - 0.2, 0.3, linear)));
        tr(reticle, 600, 380, Math.max(0.01, (0.6 + 0.4 * rp) * (1 + zp * 0.5)), t * 30 * AMP);
        op(smallChip, win(t, mid('small', 0.45), cD, 0.3)); tr(smallChip, 860, 200);
      } else { op(reticle, 0); op(smallChip, 0); }
    } else { op(aChips, 0); ltKavya.set(0); op(greenChip, 0); op(reticle, 0); op(smallChip, 0); }

    /* ---------- viewfinder over the zoom (C, D, E) ---------- */
    op(finder, Math.max(sC, sD));
    if (sC || sD) {
      op(recDot, Math.sin(t * TAU * 0.8) > 0 ? 1 : 0.15);
      const zp = P(t, mid('small', 0.35), cD + 0.5 - mid('small', 0.35), easeIn);
      const zT = P(t, at('this') - 0.1, end('this') - at('this') + 0.1, ease);
      const mag = sC ? Math.pow(1000, zp) : 1000 * Math.pow(10, zT);
      const r10 = mag > 100 ? 10 : 1;
      setText(zoomTxt, 'ZOOM ×' + (mag >= 9999.5 ? '10 000' : String(Math.round(mag / r10) * r10)));
    }

    /* ---------- D/E: leaf cells -> one chloroplast -> Clive ---------- */
    op(mosShot, sD ? P(t, cD, 0.5, linear) : 0);
    let cliveShown = 0;
    if (sD) {
      let k = lerp(0.6, 1, P(t, cD, 1.4, easeOut));
      k *= 1 + 0.25 * P(t, at('leaf'), end('leaf') - at('leaf'), linear);
      const zT = P(t, at('this') - 0.1, end('this') - at('this') + 0.1, ease);
      k *= Math.pow(16 / 1.25, zT);
      const sx = lerp(FOC[0], 600, zT), sy = lerp(FOC[1], 400, zT);
      mos.setAttribute('transform', `translate(${sx.toFixed(1)} ${sy.toFixed(1)}) scale(${k.toFixed(4)}) translate(${-FOC[0]} ${-FOC[1]})`);
      const scr = (x, y) => [sx + k * (x - FOC[0]), sy + k * (y - FOC[1])];
      const fc = win(t, mid('leaf', 0.05), at('this') - 0.1, 0.3), fl = win(t, mid('leaf', 0.4), at('this') + 0.2, 0.3);
      op(lbCell, fc); op(lbChl, fl);
      if (fc) { const [x, y] = scr(FOC[0] - 4 * 68 + 30, FOC[1] - 120); attr(lbCellLine, 'x1', 250); attr(lbCellLine, 'y1', 200); attr(lbCellLine, 'x2', x); attr(lbCellLine, 'y2', y); attr(lbCellDot, 'cx', x); attr(lbCellDot, 'cy', y); }
      if (fl) { const [x, y] = scr(FOC[0], FOC[1]); attr(lbChlLine, 'x1', 860); attr(lbChlLine, 'y1', 530); attr(lbChlLine, 'x2', x); attr(lbChlLine, 'y2', y); attr(lbChlDot, 'cx', x); attr(lbChlDot, 'cy', y); }
      op(lbChlSub, P(t, mid('leaf', 0.7), 0.4, linear));
      op(focChl, 1 - clamp((k - 7) / 3));
      const cOp = clamp((k - 6) / 4);
      if (cOp > 0) {
        cliveShown = 1;
        op(clive, cOp); tr(clive, sx, sy, 0.1 * k);
        const up = t > end('this') + 0.05;
        clive.set({ t, talk: 0, mood: up ? 'deadpan' : 'neutral', look: up ? 0 : -0.9, still: !up });
      }
      op(mos, 1 - 0.5 * zT);
    } else { op(lbCell, 0); op(lbChl, 0); }

    /* ---------- F: confessional (hi, not, exams) and H: close (does) ---------- */
    const confOn = Math.max(sF, sH);
    conf.set(confOn, t);
    if (confOn) {
      let cam = { k: 1, cx: 430, cy: 390 };
      if (sF) cam.k = 1 + 0.05 * P(t, at('exams'), end('exams') - at('exams') + 0.6, ease);
      else cam = { k: 1.3 * (1 + 0.1 * P(t, cH, cI - cH, linear)), cx: 430, cy: 380 };
      camBg(conf, cam.k, cam.cx, cam.cy);
      cliveShown = 1; op(clive, 1);
      place(clive, cam, 430, 400, 1.5);
      let mood = 'deadpan', look = 0;
      if (sF) {
        if (t < at('not')) mood = 'neutral';
        else if (t < mid('not', 0.55)) { mood = 'annoyed'; look = t > mid('not', 0.25) ? 0.7 : 0; }
        else if (t < at('exams')) look = 0.5;
        else if (t < mid('exams', 0.6)) { mood = 'annoyed'; look = 0.6; }
      }
      clive.set({ t, talk: scTalk(S, t, 'clive'), mood, look });
      ltClive.set(sF ? win(t, at('hi') + 0.1, at('hi') + 3.4, 0.3) : 0);
      const kp = sF ? P(t, mid('hi', 0.4), 0.4, pop) * (1 - P(t, at('not') - 0.1, 0.15, linear)) : 0;
      op(kw, clamp(kp * 2.5)); tr(kw, 880, 330, Math.max(0.01, 0.7 + 0.3 * kp));
      const np = sF ? P(t, mid('not', 0.08), 0.4, pop) * (1 - P(t, at('exams') - 0.05, 0.15, linear)) : 0;
      op(names, clamp(np * 2.5)); tr(names, 880, 360);
      op(pPlast, clamp(np * 2.5)); tr(pPlast, 0, -110, Math.max(0.01, 0.7 + 0.3 * np));
      const pp = sF ? P(t, mid('not', 0.45), 0.4, pop) : 0;
      op(pPhyll, clamp(pp * 2.5)); tr(pPhyll, 0, 110, Math.max(0.01, 0.7 + 0.3 * pp));
      const ep = sF ? P(t, at('exams') + 0.05, 0.45, pop) : 0;
      op(paper, clamp(ep * 2.5)); tr(paper, 880, 370, Math.max(0.01, 0.75 + 0.25 * ep), -3);
      const xp = P(t, mid('exams', 0.62), 0.35, pop);
      op(pCross, clamp(xp * 2.5)); tr(pCross, 150, 86, Math.max(0.01, xp));
      op(minus, P(t, mid('exams', 0.75), 0.3, linear));
    } else { ltClive.set(0); op(kw, 0); op(names, 0); op(paper, 0); }

    /* ---------- G: the factory floor ---------- */
    op(facShot, sG);
    op(clip, sG);
    facGus.forEach(m => op(m, sG));
    if (sG) {
      fac.set({ t, light: 1, belt: 70 });
      camBg(facWrap, 1 + 0.05 * P(t, cG, cH - cG, linear), 600, 400);
      cliveShown = 1; op(clive, 1);
      tr(clive, 600, 470, 1.05);
      const up = t > mid('billion', 0.55);
      clive.set({ t, talk: 0, mood: up ? 'smug' : 'neutral', look: up ? 0 : 0.8 });
      tr(clip, 760, 500, 0.8, 12);
      facGus.forEach((m, i) => tr(m, 80 + ((t * 70 + i * 380) % 1040), 620, 1, (t * 40) % 360));
    }

    /* ---------- I: title card, the cast pops in ---------- */
    op(titleShot, sI); op(logo, 0); op(epi, 0);
    if (sI) {
      title.set(t * AMP);
      const lp = P(t, at('title') + 0.05, 0.6, pop);
      op(logo, clamp(lp * 2.5)); tr(logo, 600, 200, Math.max(0.01, 0.5 + 0.5 * lp));
      tr(logo.sun, -330, -26, 1, (t * 20 * AMP) % 360);
      op(epi, P(t, mid('title', 0.45), 0.4, linear));
      const castT = k => mid('title', 0.55) + CAST_ORDER[k] * 0.12;
      extras.forEach(e => { const p = P(t, castT(e.k), 0.45, pop); op(e.c, clamp(p * 3)); tr(e.c, e.x, e.y + 30 * (1 - clamp(p)), Math.max(0.01, e.s * p)); e.c.set({ t, mood: e.mood, look: 0 }); });
      const pk = P(t, castT('kavya'), 0.45, pop);
      op(kav, clamp(pk * 3)); tr(kav, 600, 650 + 30 * (1 - clamp(pk)), Math.max(0.01, 0.55 * pk)); kav.set({ t, mood: 'annoyed' });
      kavShown = 1;
      const pc = P(t, castT('clive'), 0.45, pop);
      cliveShown = 1; op(clive, clamp(pc * 3)); tr(clive, 830, 640 + 30 * (1 - clamp(pc)), Math.max(0.01, 0.62 * pc)); clive.set({ t, mood: 'deadpan' });
    } else extras.forEach(e => op(e.c, 0));

    if (!kavShown) op(kav, 0); else if (!sI) op(kav, 1);
    if (!cliveShown) op(clive, 0);
  };
});
