/* Scene 0: Cold open (no chapter card).
   Lab Three: Kavya, 12, practical test in a week (calendar, worksheet) -> her plan (tally card, "PLAN:
   confidence") -> whip-pan to the prep room's wall of drawers -> push in on drawer 8B, it slides open, eyes
   blink in the dark -> Cecil's confessional (a cell, 1.5 V; NOT a battery; in the drawer since 2015) ->
   inside the drawer, the whole cast, the "rubber band incident" photo -> title card with the cast. */
scene('cold', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;

  /* ---------- local helpers ---------- */
  const on = (t, a, b) => (t >= a && t < b ? 1 : 0);          // hard sitcom cut
  const camBg = (el, k, cx, cy) => el.setAttribute('transform', `translate(${cx.toFixed(1)} ${cy.toFixed(1)}) scale(${k.toFixed(4)}) translate(${(-cx).toFixed(1)} ${(-cy).toFixed(1)})`);
  const popIn = (el, t, t0, x, y, s, r) => { const p = P(t, t0, 0.45, pop); op(el, clamp(p * 2.5)); tr(el, x, y, Math.max(0.01, (s || 1) * (0.6 + 0.4 * p)), r); return p; };
  const label = (parent, text, o) => {
    o = o || {};
    return chip(parent, text, { size: o.size || 30, fill: o.fill || 'rgba(10,27,39,0.88)', stroke: o.stroke || C.line, sw: 2, color: o.color || C.ink, weight: o.weight || 700 });
  };
  const paper = (parent, w, h, o) => {      // white card with a coloured header strip
    o = o || {};
    const g = G(parent);
    E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: 12, fill: o.fill || '#FFFFFF', stroke: SC_INK, 'stroke-width': 4 }, g);
    if (o.head) {
      E('path', { d: `M${-w / 2 + 12},${-h / 2} L${w / 2 - 12},${-h / 2} Q${w / 2},${-h / 2} ${w / 2},${-h / 2 + 12} L${w / 2},${-h / 2 + 46} L${-w / 2},${-h / 2 + 46} L${-w / 2},${-h / 2 + 12} Q${-w / 2},${-h / 2} ${-w / 2 + 12},${-h / 2} Z`, fill: o.headCol || DR_RED }, g);
      T(g, 0, -h / 2 + 33, o.head, { size: 26, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
    }
    return g;
  };

  /* layers */
  const Lbg = G(root), Lcast = G(root), Lfg = G(root), Lhud = G(root);

  /* ================= A/B/C: the lab, the whip-pan, the cabinet ================= */
  const world = G(Lbg);
  const labCam = G(world);
  drLab(labCam);
  const kav = cast(labCam, 'kavya', { mood: 'annoyed' });
  const benchFront = G(labCam);                         // the bench again, in front of Kavya
  E('rect', { x: 0, y: 560, width: 1200, height: 26, fill: '#2A2F36' }, benchFront);
  E('rect', { x: 0, y: 586, width: 1200, height: 164, fill: '#C9B48E' }, benchFront);
  E('path', { d: 'M300,586 L300,750 M600,586 L600,750 M900,586 L900,750', stroke: '#A6926C', 'stroke-width': 4 }, benchFront);
  // the practice kit on the bench: a cell, a bulb in a holder, two leads
  const kit = G(benchFront); tr(kit, 790, 548);
  E('rect', { x: -40, y: -16, width: 80, height: 30, rx: 6, fill: DR_NAVY, stroke: SC_INK, 'stroke-width': 3 }, kit);
  E('rect', { x: -40, y: -16, width: 22, height: 30, rx: 4, fill: DR_GOLD, stroke: SC_INK, 'stroke-width': 3 }, kit);
  E('path', { d: 'M48,6 C90,-10 120,20 160,4', fill: 'none', stroke: DR_RED, 'stroke-width': 6, 'stroke-linecap': 'round' }, kit);
  E('path', { d: 'M-48,6 C-90,24 -120,-6 -160,8', fill: 'none', stroke: '#2A2F36', 'stroke-width': 6, 'stroke-linecap': 'round' }, kit);
  E('rect', { x: 180, y: -6, width: 50, height: 18, rx: 4, fill: '#8E9BA8', stroke: SC_INK, 'stroke-width': 3 }, kit);
  E('circle', { cx: 205, cy: -24, r: 18, fill: '#E6EEF2', stroke: '#7E93A6', 'stroke-width': 3 }, kit);

  const cabShot = G(world); tr(cabShot, 1200, 0);
  const cabCam = G(cabShot);
  const cab = drCabinet(cabCam);
  const D8 = cab.d8b;

  // A1: who and when
  const aChips = G(Lfg);
  const cKav = label(aChips, 'Kavya, age 12', { size: 34 });
  const calW = paper(aChips, 230, 180, { head: 'PRACTICAL TEST' });
  const calN = T(calW, 0, 44, '7 DAYS', { size: 46, weight: 800, anchor: 'middle', fill: SC_INK });
  E('ellipse', { cx: 0, cy: 28, rx: 96, ry: 44, fill: 'none', stroke: DR_RED, 'stroke-width': 5, transform: 'rotate(-6)' }, calW);
  const task = paper(aChips, 270, 190, { head: 'TASK', headCol: '#2E7DD8' });
  T(task, 0, 6, 'build a working', { size: 28, weight: 700, anchor: 'middle', fill: SC_INK, font: FB });
  T(task, 0, 40, 'circuit', { size: 28, weight: 700, anchor: 'middle', fill: SC_INK, font: FB });
  const doodle = G(task); tr(doodle, 0, 70, 0.5); E('circle', { r: 24, fill: '#FFF3A8', stroke: SC_INK, 'stroke-width': 4 }, doodle);
  E('path', { d: 'M-17,-17 L17,17 M17,-17 L-17,17', stroke: SC_INK, 'stroke-width': 4 }, doodle);
  // A2: the plan
  const ltKavya = scLowerThird(Lhud, ...DR_LOWER.kavya);
  const tally = paper(Lfg, 400, 230, { head: "KAVYA'S PREP", headCol: '#3A4752' });
  const tRow1 = G(tally), tRow2 = G(tally);
  T(tRow1, -170, -26, 'Videos watched:', { size: 30, weight: 700, fill: SC_INK, font: FB });
  T(tRow1, 150, -26, '4', { size: 40, weight: 800, anchor: 'end', fill: '#2E7DD8' });
  const tk1 = tick(tRow1, 14); tr(tk1, 172, -38);
  T(tRow2, -170, 40, 'Circuits built:', { size: 30, weight: 700, fill: SC_INK, font: FB });
  T(tRow2, 150, 48, '0', { size: 64, weight: 800, anchor: 'end', fill: DR_RED });
  const sticky = G(Lfg);
  E('rect', { x: -130, y: -70, width: 260, height: 140, fill: '#FFE45C', stroke: '#C9A92A', 'stroke-width': 3 }, sticky);
  E('path', { d: 'M-130,-70 L130,-70 L130,-50 L-130,-50 Z', fill: '#F2D23C' }, sticky);
  T(sticky, 0, -6, 'PLAN:', { size: 30, weight: 800, anchor: 'middle', fill: SC_INK });
  T(sticky, 0, 42, 'confidence', { size: 38, weight: 800, anchor: 'middle', fill: DR_RED });
  // B: whip-pan streaks and the "drawer" chip
  const streaks = G(Lhud), sr = rng(58);
  let sd = '';
  for (let i = 0; i < 14; i++) { const y = 40 + sr() * 680, x = sr() * 900; sd += `M${x.toFixed(0)},${y.toFixed(0)} L${(x + 260 + sr() * 300).toFixed(0)},${y.toFixed(0)} `; }
  E('path', { d: sd, stroke: '#FFFFFF', 'stroke-width': 5, 'stroke-linecap': 'round', opacity: 0.55 }, streaks);
  const drawerChip = label(Lfg, 'the subject of this documentary: a drawer', { size: 30, color: C.energy });
  const finder = G(Lhud);
  E('path', { d: 'M40,140 L40,40 L140,40 M1060,40 L1160,40 L1160,140 M1160,610 L1160,710 L1060,710 M140,710 L40,710 L40,610', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 5, opacity: 0.8 }, finder);
  E('rect', { x: 930, y: 652, width: 216, height: 52, rx: 10, fill: 'rgba(10,27,39,0.8)' }, finder);
  const zoomTxt = T(finder, 1130, 690, 'ZOOM ×1', { size: 30, weight: 700, anchor: 'end', fill: '#FFFFFF' });

  /* ================= D: Cecil's confessional ================= */
  const conf = drConf(Lbg, 'cecil');
  const ltCecil = scLowerThird(Lhud, ...DR_LOWER.cecil);
  const kwCell = chip(Lfg, 'cell', { size: 54, fill: DR_GOLD, color: SC_INK, stroke: '#FFF1C2', sw: 4 });
  const kwV = G(Lfg);
  E('rect', { x: -130, y: -60, width: 260, height: 120, rx: 18, fill: DR_NAVY, stroke: '#FFFFFF', 'stroke-width': 4 }, kwV);
  T(kwV, 0, 24, '1.5 V', { size: 72, weight: 800, anchor: 'middle', fill: DR_GOLD });
  T(kwV, 0, 92, 'volts', { size: 28, weight: 600, anchor: 'middle', fill: C.muted, font: FB });
  // battery card: one cell vs a battery
  const batCard = G(Lfg);
  E('rect', { x: -250, y: -150, width: 500, height: 300, rx: 22, fill: 'rgba(10,27,39,0.9)', stroke: C.line, 'stroke-width': 3 }, batCard);
  const bc1 = G(batCard), bc2 = G(batCard);
  tr(drSym(bc1, 'cell', { color: '#FFFFFF', w: 6 }), -110, -62);
  T(bc1, 40, -50, 'cell (Cecil)', { size: 32, weight: 800, fill: DR_GOLD });
  tr(drSym(bc2, 'battery', { color: '#FFFFFF', w: 6 }), -110, 62);
  T(bc2, 40, 52, 'battery =', { size: 32, weight: 800, fill: '#9FD8FF' });
  T(bc2, 40, 90, '2 or more cells', { size: 28, weight: 700, fill: C.ink, font: FB });
  const stamp = G(Lfg);
  E('rect', { x: -170, y: -40, width: 340, height: 80, rx: 8, fill: '#FFFFFF', 'fill-opacity': 0.92, stroke: DR_RED, 'stroke-width': 7 }, stamp);
  T(stamp, 0, 16, 'NOT A BATTERY', { size: 44, weight: 800, anchor: 'middle', fill: DR_RED });
  // since 2015
  const cal15 = paper(Lfg, 260, 220, { head: 'SINCE', headCol: '#3A4752' });
  T(cal15, 0, 58, '2015', { size: 80, weight: 800, anchor: 'middle', fill: SC_INK });
  const dr = rng(15); let dust = '';
  for (let i = 0; i < 26; i++) dust += `M${(-120 + dr() * 240).toFixed(0)},${(-60 + dr() * 160).toFixed(0)} h3 v3 h-3 Z `;
  E('path', { d: dust, fill: '#9AA6B2', opacity: 0.8 }, cal15);
  const lvl = G(Lfg);
  E('rect', { x: -130, y: -36, width: 240, height: 72, rx: 12, fill: 'rgba(10,27,39,0.9)', stroke: '#FFFFFF', 'stroke-width': 4 }, lvl);
  E('rect', { x: 110, y: -16, width: 16, height: 32, rx: 4, fill: '#FFFFFF' }, lvl);
  E('rect', { x: -120, y: -26, width: 220, height: 52, rx: 8, fill: C.good }, lvl);
  T(lvl, -10, 12, '1.5 V ✓', { size: 34, weight: 800, anchor: 'middle', fill: SC_INK });
  const lvlTxt = T(lvl, -10, 76, 'perfect, apparently', { size: 26, weight: 600, anchor: 'middle', fill: C.muted, font: FB });
  const web = G(Lfg); tr(web, 1200, 750);
  let wd = '';
  for (let k = 0; k < 6; k++) { const a = Math.PI + k * (Math.PI / 2) / 5; wd += `M0,0 L${(Math.cos(a) * 190).toFixed(0)},${(Math.sin(a) * 190).toFixed(0)} `; }
  for (let r = 50; r <= 170; r += 40) { let p = ''; for (let k = 0; k < 6; k++) { const a = Math.PI + k * (Math.PI / 2) / 5; p += (k ? ' Q' + (Math.cos(a - 0.157) * r * 0.86).toFixed(0) + ',' + (Math.sin(a - 0.157) * r * 0.86).toFixed(0) + ' ' : 'M') + (Math.cos(a) * r).toFixed(0) + ',' + (Math.sin(a) * r).toFixed(0); } wd += p + ' '; }
  E('path', { d: wd, fill: 'none', stroke: '#FFFFFF', 'stroke-width': 2, opacity: 0.6 }, web);

  /* ================= E: inside drawer 8B, the rubber band incident ================= */
  const inShot = G(Lbg);
  drDrawer(inShot);
  const photo = G(Lfg);
  E('rect', { x: -210, y: -150, width: 420, height: 300, rx: 8, fill: '#C9A24A', stroke: '#6B4E12', 'stroke-width': 6 }, photo);
  E('rect', { x: -186, y: -126, width: 372, height: 214, fill: '#22303A' }, photo);
  tr(drSym(photo, 'cell', { color: '#FFFFFF', w: 5 }), -90, -60, 0.9);
  tr(drSym(photo, 'lamp', { color: '#FFFFFF', w: 5 }), 90, -60, 0.9);
  E('path', { d: 'M-144,-60 Q-176,40 0,44 Q176,40 144,-60', fill: 'none', stroke: '#FF8FB0', 'stroke-width': 9, 'stroke-linecap': 'round' }, photo);   // the rubber band
  T(photo, 0, 26, 'rubber band', { size: 26, weight: 700, anchor: 'middle', fill: '#FF8FB0', font: FB });
  const pX = cross(photo, 70); tr(pX, 0, -20);
  T(photo, 0, 128, 'LAST YEAR', { size: 30, weight: 800, anchor: 'middle', fill: '#3A2A10' });

  /* ================= F: title card ================= */
  const titleShot = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#14182A', '#2E2A4A', true) }, titleShot);
  let rays = '';
  for (let i = 0; i < 16; i++) { const a0 = i / 16 * TAU, a1 = a0 + TAU / 40; rays += `M0,0 L${(Math.cos(a0) * 1100).toFixed(0)},${(Math.sin(a0) * 1100).toFixed(0)} L${(Math.cos(a1) * 1100).toFixed(0)},${(Math.sin(a1) * 1100).toFixed(0)} Z `; }
  const rayP = E('path', { d: rays, fill: '#9FD8FF', opacity: 0.07 }, titleShot);
  E('ellipse', { cx: 600, cy: 580, rx: 580, ry: 200, fill: glow('#FFE45C'), opacity: 0.25 }, titleShot);
  const logo = G(Lfg);
  E('rect', { x: -360, y: -96, width: 720, height: 180, rx: 16, fill: linGrad('#E4EAEE', '#AEBBC4', true), stroke: SC_INK, 'stroke-width': 6 }, logo);
  E('rect', { x: -320, y: -74, width: 640, height: 110, rx: 6, fill: '#FFFFFF', stroke: '#9AA6B2', 'stroke-width': 3 }, logo);
  const logoT = T(logo, 0, 14, 'DRAWER 8B', { size: 92, weight: 800, anchor: 'middle', fill: SC_INK, ls: 6 });
  logoT.setAttribute('stroke', '#FFFFFF'); logoT.setAttribute('stroke-width', 2);
  E('rect', { x: -60, y: 48, width: 120, height: 20, rx: 10, fill: '#56636E' }, logo);
  const lb1 = bolt(logo, 0.55); tr(lb1, -400, -10, 0.55, -12);
  const lb2 = bolt(logo, 0.55); tr(lb2, 400, -10, 0.55, 12);
  const epi = T(Lfg, 600, 345, 'Episode 12: The Practical', { size: 42, weight: 700, anchor: 'middle', fill: '#FFFFFF' });

  /* ================= the cast ================= */
  const cecil = cast(Lcast, 'cecil');
  const eddie = cast(Lcast, 'eddie'), dimitri = cast(Lcast, 'dimitri'), amy = cast(Lcast, 'amy'), vic = cast(Lcast, 'vic');
  const rez = cast(Lcast, 'rez'), mag = cast(Lcast, 'magnet'), sol = cast(Lcast, 'sol');
  const kavT = cast(Lcast, 'kavya');                    // Kavya on the title card
  // inside the drawer (E): [char, x, y, s]; title card (F): [x, y, s, order]
  const ROW = { cecil: [cecil, 125, 540, 0.5], eddie: [eddie, 245, 560, 0.5], dimitri: [dimitri, 365, 530, 0.5], amy: [amy, 488, 546, 0.5],
    vic: [vic, 605, 546, 0.5], rez: [rez, 752, 536, 0.5], mag: [mag, 925, 560, 0.5], sol: [sol, 1085, 528, 0.45] };
  const TITLE = { eddie: [190, 500, 0.5, 0], dimitri: [380, 486, 0.5, 1], amy: [575, 500, 0.5, 2], vic: [760, 500, 0.5, 3], rez: [975, 496, 0.48, 4],
    kavT: [200, 640, 0.62, 5], cecil: [430, 640, 0.52, 6], mag: [700, 670, 0.52, 7], sol: [975, 630, 0.4, 8] };
  const MOODS_E = { cecil: 'deadpan', eddie: 'shock', dimitri: 'sad', amy: 'annoyed', vic: 'deadpan', rez: 'annoyed', mag: ['shock', 'deadpan'], sol: 'sad' };
  const MOODS_F = { cecil: 'deadpan', eddie: 'happy', dimitri: 'smug', amy: 'smug', vic: 'deadpan', rez: 'smug', mag: ['happy', 'happy'], sol: 'smug', kavT: 'annoyed' };
  const all = { cecil, eddie, dimitri, amy, vic, rez, mag, sol, kavT };

  const blackout = E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#000000' }, Lhud);

  /* cut points */
  const cA2 = at('plan') - 0.1, cPan = mid('small', 0.32), PAN = 0.5, cD = at('hi') - 0.06,
    cE = at('rubber') - 0.06, cG = at('title') - 0.06;

  return t => {
    op(blackout, 1 - P(t, 0, 0.6, linear));
    const sAB = on(t, -1, cD), sD = on(t, cD, cE), sE = on(t, cE, cG), sG = on(t, cG, 1e9);
    const shown = {};

    /* ---------- A, B, C: lab -> pan -> cabinet ---------- */
    op(world, sAB);
    if (sAB) {
      const pan = P(t, cPan, PAN, ease);
      tr(world, -1200 * pan, 0);
      op(streaks, win(t, cPan + 0.05, cPan + PAN - 0.05, 0.12)); tr(streaks, (1 - P(t, cPan, PAN, linear)) * 200 - 100, 0);
      // lab camera: wide on the first line, a slow push on the second
      const tight = t >= cA2;
      const push = tight ? P(t, cA2, end('plan') - cA2 + 0.6, linear) : P(t, 0, at('plan'), linear);
      camBg(labCam, tight ? 1.28 + 0.06 * push : 1 + 0.04 * push, 430, 470);
      tr(kav, 430, 440, 1.3);
      const smug = tight && t > mid('plan', 0.74);
      const lookR = !tight && t > mid('kavya', 0.4) ? 0.7 : tight && t > mid('plan', 0.1) && t < mid('plan', 0.7) ? 0.6 : 0;
      kav.set({ t, talk: scTalk(S, t, 'kavya'), mood: smug ? 'smug' : tight ? 'deadpan' : 'annoyed', look: lookR });
      // A1 chips
      const a1 = (tight ? 0 : 1) * (pan > 0 ? 0 : 1);
      op(aChips, a1);
      if (a1) {
        popIn(cKav, t, mid('kavya', 0.06), 860, 150);
        popIn(calW, t, mid('kavya', 0.4), 760, 360, 1, -3);
        popIn(task, t, mid('kavya', 0.74), 1030, 380, 1, 3);
      }
      // A2: the plan
      const a2 = tight && pan === 0 ? 1 : 0;
      ltKavya.set(a2 ? win(t, at('plan') + 0.05, at('plan') + 3.3, 0.3) : 0);
      const tp = a2 ? P(t, mid('plan', 0.08), 0.4, pop) : 0;
      op(tally, clamp(tp * 2.5)); tr(tally, 880, 290, Math.max(0.01, 0.7 + 0.3 * tp), -2);
      op(tRow2, P(t, mid('plan', 0.42), 0.3, linear));
      const sp = a2 ? P(t, mid('plan', 0.72), 0.35, pop) : 0;
      op(sticky, clamp(sp * 3)); tr(sticky, 930, 530, Math.max(0.01, 1.6 - 0.6 * sp), 6 - 2 * sp);
      // C: cabinet camera, the drawer opens
      if (pan > 0) {
        const zp = P(t, at('drawer') - 0.2, end('drawer') - at('drawer') + 0.2, ease);
        const k = 1 + 0.85 * zp;
        cabCam.setAttribute('transform', `translate(${lerp(600, 600, zp).toFixed(1)} ${lerp(375, 400, zp).toFixed(1)}) scale(${k.toFixed(4)}) translate(${(-lerp(600, D8[0], zp)).toFixed(1)} ${(-lerp(375, D8[1] + 10, zp)).toFixed(1)})`);
        cab.open(P(t, mid('drawer', 0.72), 0.7, easeOut));
        cab.upd(t);
        setText(zoomTxt, 'ZOOM ×' + k.toFixed(1));
      }
      op(finder, pan >= 1 ? 1 : 0);
      op(drawerChip, pan >= 1 ? win(t, cPan + PAN + 0.1, at('drawer') + 0.4, 0.25) : 0); tr(drawerChip, 600, 700);
    } else { op(aChips, 0); ltKavya.set(0); op(tally, 0); op(sticky, 0); op(streaks, 0); op(finder, 0); op(drawerChip, 0); }

    /* ---------- D: Cecil's confessional ---------- */
    conf.set(sD, t);
    if (sD) {
      shown.cecil = 1; op(cecil, 1);
      const push = P(t, at('since'), end('since') - at('since') + 0.6, linear);
      const k = 1 + 0.06 * push;
      camBg(conf, k, 430, 400);
      tr(cecil, 600 + k * (420 - 600), 400 + k * (395 - 400), 1.65 * k);
      let mood = 'deadpan';
      if (t >= at('battery') && t < mid('battery', 0.25)) mood = 'annoyed';
      else if (t < at('hi') + 0.2) mood = 'neutral';
      const look = t >= at('battery') && t < mid('battery', 0.7) && t > mid('battery', 0.25) ? 0.7 : 0;
      cecil.set({ t, talk: scTalk(S, t, 'cecil'), mood, look });
      ltCecil.set(win(t, at('hi') + 0.1, at('hi') + 3.3, 0.3));
      const hiOn = t < at('battery');
      op(kwCell, hiOn ? 1 : 0); if (hiOn) popIn(kwCell, t, mid('hi', 0.3), 880, 230);
      op(kwV, hiOn ? 1 : 0); if (hiOn) popIn(kwV, t, mid('hi', 0.62), 880, 400);
      const bOn = t >= at('battery') && t < at('since');
      op(batCard, bOn ? 1 : 0);
      if (bOn) { popIn(batCard, t, at('battery') + 0.1, 870, 340); op(bc2, P(t, mid('battery', 0.4), 0.35, linear)); }
      const stp = bOn ? P(t, mid('battery', 0.82), 0.3, pop) : 0;
      op(stamp, clamp(stp * 3)); tr(stamp, 640, 560, Math.max(0.01, 1.8 - 0.8 * stp), -8);
      const sOn = t >= at('since');
      op(cal15, sOn ? 1 : 0); if (sOn) popIn(cal15, t, at('since') + 0.1, 760, 260, 1, -3);
      op(lvl, sOn ? 1 : 0); if (sOn) { popIn(lvl, t, mid('since', 0.42), 1000, 440); op(lvlTxt, P(t, mid('since', 0.6), 0.3, linear)); }
      op(web, sOn ? P(t, mid('since', 0.75), 0.5, linear) : 0);
    } else { ltCecil.set(0); op(kwCell, 0); op(kwV, 0); op(batCard, 0); op(stamp, 0); op(cal15, 0); op(lvl, 0); op(web, 0); }

    /* ---------- E: inside the drawer ---------- */
    op(inShot, sE);
    if (sE) {
      camBg(inShot, 1 + 0.03 * P(t, cE, cG - cE, linear), 600, 500);
      const away = t > mid('rubber', 0.72);
      Object.keys(ROW).forEach((k, i) => {
        const [c, x, y, s] = ROW[k];
        shown[k] = 1; op(c, 1); tr(c, x, y, s);
        const m = MOODS_E[k], lk = away ? (i % 2 ? 1 : -1) : 0;
        const st = { t, look: k === 'cecil' ? 0 : lk };
        if (k === 'mag') Object.assign(st, { mood: away ? m[0] : 'neutral', moodB: away ? m[1] : 'neutral', lookB: away ? 1 : 0 });
        else st.mood = k === 'cecil' ? 'deadpan' : away ? m : 'neutral';
        if (k === 'cecil') st.talk = scTalk(S, t, 'cecil');
        if (k === 'dimitri') st.glow = 0.15;
        c.set(st);
      });
      const pp = P(t, mid('rubber', 0.42), 0.45, pop);
      op(photo, clamp(pp * 2.5)); tr(photo, 430, 270, Math.max(0.01, 0.7 + 0.3 * pp), -3);
      op(pX, P(t, mid('rubber', 0.55), 0.25, linear));
    } else op(photo, 0);

    /* ---------- F: title card ---------- */
    op(titleShot, sG); op(logo, 0); op(epi, 0);
    if (sG) {
      tr(rayP, 600, 580, 1, (t * 6 * AMP) % 360);
      const lp = P(t, at('title') + 0.05, 0.6, pop);
      op(logo, clamp(lp * 2.5)); tr(logo, 600, 200, Math.max(0.01, 0.5 + 0.5 * lp));
      op(epi, P(t, mid('title', 0.45), 0.4, linear));
      Object.keys(TITLE).forEach(k => {
        const [x, y, s, ord] = TITLE[k], c = all[k];
        const p = P(t, mid('title', 0.5) + ord * 0.12, 0.45, pop);
        shown[k] = 1; op(c, clamp(p * 3)); tr(c, x, y + 30 * (1 - clamp(p)), Math.max(0.01, s * p));
        const m = MOODS_F[k];
        const st = { t, look: 0, glow: 1, on: 1 };
        if (k === 'mag') Object.assign(st, { mood: m[0], moodB: m[1] }); else st.mood = m;
        c.set(st);
      });
    }

    Object.keys(all).forEach(k => { if (!shown[k]) op(all[k], 0); });
  };
});
