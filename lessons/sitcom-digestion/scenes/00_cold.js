/* Scene 0: Cold open (no chapter card).
   Hawker centre: Kavya, 12, with chicken rice the day before her digestion test -> the camera dives into
   her mouth and down a dark pink tube -> the Alimentary Line map builds (seven stations, one direction,
   no refunds) -> an empty MOUTH platform, Percy rises into frame -> Percy's confessional (peristalsis)
   -> no trains: the tunnel is a muscle, and so is he -> side view: the squeeze pushes a bolus along, like
   toothpaste -> "the other end" (censored) -> twelve years of meals -> four curry puffs -> title card. */
scene('cold', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;

  /* ---------- local helpers ---------- */
  const on = (t, a, b) => (t >= a && t < b ? 1 : 0);          // hard sitcom cut
  const camBg = (el, k, cx, cy) => el.setAttribute('transform', `translate(${cx.toFixed(1)} ${cy.toFixed(1)}) scale(${k.toFixed(4)}) translate(${(-cx).toFixed(1)} ${(-cy).toFixed(1)})`);
  const place = (el, cam, x, y, s, r) => tr(el, cam.cx + cam.k * (x - cam.cx), cam.cy + cam.k * (y - cam.cy), s * cam.k, r);
  const popIn = (el, t, t0, x, y, s, r) => { const p = P(t, t0, 0.45, pop); op(el, clamp(p * 2.5)); tr(el, x, y, Math.max(0.01, (s || 1) * (0.6 + 0.4 * p)), r); return p; };
  const label = (parent, text, o) => { o = o || {};
    return chip(parent, text, { size: o.size || 30, fill: o.fill || 'rgba(10,27,39,0.88)', stroke: o.stroke || C.line, sw: 2, color: o.color || C.ink, weight: o.weight || 700 }); };
  function curryPuff(parent, s) {
    const g = G(parent); tr(g, 0, 0, s || 1);
    E('path', { d: 'M-60,18 A60,60 0 0 1 60,18 Z', fill: ball('#F7C766', '#C98A2A'), stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
    let cr = '';
    for (let i = 0; i <= 14; i++) { const a = Math.PI + i / 14 * Math.PI, r = i % 2 ? 54 : 62; cr += (i ? ' L' : 'M') + (Math.cos(a) * r).toFixed(1) + ',' + (18 + Math.sin(a) * r).toFixed(1); }
    E('path', { d: cr, fill: 'none', stroke: '#A8661A', 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
    return g;
  }

  /* layers: sets at the back, the cast, then props and labels, then the HUD */
  const Lbg = G(root), Lcast = G(root), Lfg = G(root), Lhud = G(root);

  /* ================= A: the hawker centre ================= */
  const hawkShot = G(Lbg), hawkWrap = G(hawkShot);
  const hawker = mgHawker(hawkWrap);
  const kav = cast(Lcast, 'kavya', { mood: 'annoyed' });
  const tableW = G(Lcast); mgTable(tableW, 820);
  const trayW = G(Lcast); const tray = mgTray(trayW);
  const aChips = G(Lfg);
  const cKav = label(aChips, 'Kavya, age 12', { size: 34 });
  const cTime = label(aChips, '1:00 PM', { size: 34, color: C.energy, stroke: C.energy });
  const cHot = label(aChips, '34 °C', { size: 34, color: '#FF8A6A', stroke: '#FF8A6A' });
  const cRice = label(aChips, 'chicken rice', { size: 32, color: C.glucoseLt, stroke: C.glucose });
  const ltKavya = scLowerThird(Lhud, ...MG_NAME.kavya);
  const note = G(Lfg);
  E('rect', { x: -170, y: -90, width: 340, height: 180, fill: '#FFF176', stroke: '#D9C24A', 'stroke-width': 3 }, note);
  E('rect', { x: -40, y: -102, width: 80, height: 22, fill: 'rgba(255,255,255,0.55)' }, note);
  T(note, 0, -30, 'SCIENCE TEST', { size: 38, weight: 800, anchor: 'middle', fill: '#C62828' });
  T(note, 0, 14, 'TOMORROW:', { size: 32, weight: 700, anchor: 'middle', fill: SC_INK });
  T(note, 0, 56, 'DIGESTION', { size: 38, weight: 800, anchor: 'middle', fill: '#3F5BD9' });
  const revStamp = G(Lfg);
  E('rect', { x: -150, y: -38, width: 300, height: 76, rx: 10, fill: 'none', stroke: C.good, 'stroke-width': 6 }, revStamp);
  T(revStamp, 0, 16, 'REVISION?', { size: 46, weight: 800, anchor: 'middle', fill: C.good });
  const KMOUTH = [600, 482];   // Kavya's mouth on screen in shot A (bust at 600,470, s 1.5)

  /* ================= B: down the tube ================= */
  const tunShot = G(Lbg);
  const tunnel = mgTunnel(tunShot);
  const cTube = label(Lfg, 'the long, dark tube', { size: 34, color: '#FFB3C8', stroke: '#FF7FA6' });

  /* ================= C: the line map ================= */
  const mapShot = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#0C1A26', '#14283A', true) }, mapShot);
  let gridD = '';
  for (let x = 0; x <= 1200; x += 60) gridD += `M${x},0 L${x},750 `;
  for (let y = 0; y <= 750; y += 60) gridD += `M0,${y} L1200,${y} `;
  E('path', { d: gridD, stroke: '#1E3A50', 'stroke-width': 1.5 }, mapShot);
  const mapHead = G(Lfg);
  E('rect', { x: -330, y: -46, width: 660, height: 92, rx: 46, fill: MG_LINE, stroke: '#FFFFFF', 'stroke-width': 5 }, mapHead);
  T(mapHead, 0, 17, 'THE ALIMENTARY LINE', { size: 48, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  const map = mgLineMap(Lfg);
  const mapBolus = mgBolus(Lfg, 22);
  const mChips = G(Lfg);
  const c7 = label(mChips, '7 stations', { size: 34 });
  const c1 = label(mChips, '1 direction →', { size: 34 });
  const cNo = G(mChips);
  E('rect', { x: -170, y: -44, width: 340, height: 88, rx: 12, fill: 'rgba(90,20,30,0.85)', stroke: C.bad, 'stroke-width': 6 }, cNo);
  T(cNo, 0, 17, 'NO REFUNDS', { size: 48, weight: 800, anchor: 'middle', fill: '#FFD0D6' });

  /* ================= D: the platform ================= */
  const platShot = G(Lbg), platWrap = G(platShot);
  const plat = mgPlatform(platWrap, 'MOUTH', 'AL1');
  const noTrain = G(Lfg);
  const trainIco = G(noTrain);
  E('rect', { x: -90, y: -44, width: 180, height: 88, rx: 26, fill: '#E9EEF2', stroke: SC_INK, 'stroke-width': 4 }, trainIco);
  E('rect', { x: -70, y: -28, width: 60, height: 34, rx: 6, fill: '#7FC8F0' }, trainIco); E('rect', { x: 10, y: -28, width: 60, height: 34, rx: 6, fill: '#7FC8F0' }, trainIco);
  E('rect', { x: -90, y: 14, width: 180, height: 10, fill: MG_LINE }, trainIco);
  const trainX = cross(noTrain, 46); tr(trainX, 0, 0);
  const cTrainTxt = label(noTrain, 'no trains', { size: 32 }); tr(cTrainTxt, 0, 86);
  const cMuscle = label(Lfg, 'the tunnel = a muscle', { size: 34, color: '#FFB3C8', stroke: '#FF7FA6' });
  const cMe = label(Lfg, 'the muscle = Percy', { size: 34, color: C.energy, stroke: C.energy });

  /* ================= E: confessional ================= */
  const conf = mgConf(Lbg, 'percy');
  const ltPercy = scLowerThird(Lhud, ...MG_NAME.percy);
  const kw = G(Lfg);
  chip(kw, 'peristalsis', { size: 56, fill: MG_LINE, color: '#FFFFFF', stroke: '#FFD0DC', sw: 4 });
  T(kw, 0, 82, 'waves of muscle that', { size: 30, weight: 600, anchor: 'middle', fill: '#FFD0DC' });
  T(kw, 0, 120, 'push food along the gut', { size: 30, weight: 600, anchor: 'middle', fill: '#FFD0DC' });
  // the other end, censored
  const other = G(Lfg);
  const oSign = mgSign(other, 'ANUS', 'AL7', 340);
  const bar = E('rect', { x: -96, y: -34, width: 0, height: 60, rx: 4, fill: '#0B0C0E' }, other);
  const barTxt = T(other, 36, 6, 'CENSORED', { size: 30, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  // four curry puffs, framed
  const photo = G(Lfg);
  E('rect', { x: -230, y: -150, width: 460, height: 300, rx: 10, fill: '#C9A24A', stroke: '#6B4E12', 'stroke-width': 6 }, photo);
  E('rect', { x: -204, y: -124, width: 408, height: 248, fill: linGrad('#FDF3DA', '#E9D3A4', true), stroke: '#8A6D35', 'stroke-width': 3 }, photo);
  [[-120, -30], [0, -40], [120, -30], [0, 46]].forEach(([x, y], i) => { const cp = curryPuff(photo, 0.95); tr(cp, x, y, 0.95, (i - 1.5) * 6); });
  const photoCap = label(Lfg, 'four. one recess.', { size: 32, color: C.glucoseLt, stroke: C.glucose });

  /* ================= F: the squeeze, side view ================= */
  const sqShot = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#1A0A12', '#2E1220', true) }, sqShot);
  const tubeW = G(Lfg); const peri = mgPeriTube(tubeW, 1040); tr(tubeW, 600, 300);
  const sqArrow = G(Lfg);
  const sqA = arrow(sqArrow, 0, -150, 0, -100, { color: C.energy, width: 6 });
  const sqLbl = label(sqArrow, 'muscle squeezes behind', { size: 30, color: C.energy, stroke: C.energy }); tr(sqLbl, 0, -186);
  const pushA = G(Lfg);
  const pA = arrow(pushA, 0, 0, 120, 0, { color: '#FFFFFF', width: 7 });
  const pushLbl = label(pushA, 'food pushed along', { size: 30 }); tr(pushLbl, 60, 132);
  const paste = G(Lfg);
  const pasteTube = G(paste);
  const ptBody = E('path', { d: '', fill: '#F2F7FA', stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, pasteTube);
  E('rect', { x: 150, y: -22, width: 34, height: 44, rx: 6, fill: '#3F5BD9', stroke: SC_INK, 'stroke-width': 4 }, pasteTube);
  const ptStripe = E('path', { d: '', fill: 'none', stroke: MG_LINE, 'stroke-width': 8 }, pasteTube);
  const ptPaste = E('path', { d: '', fill: 'none', stroke: '#7FD6F7', 'stroke-width': 18, 'stroke-linecap': 'round' }, paste);
  const cPaste = label(paste, 'like toothpaste', { size: 30 }); tr(cPaste, 40, 90);
  const toEnd = G(Lfg);
  const teA = arrow(toEnd, 0, 0, 230, 0, { color: '#FFB3C8', width: 7, bend: 0 });
  const teL = label(toEnd, 'to the other end', { size: 30, color: '#FFB3C8', stroke: '#FF7FA6' }); tr(teL, 110, 60);

  /* ================= G: twelve years of meals (platform) ================= */
  const log = G(Lfg);
  E('rect', { x: -230, y: -150, width: 460, height: 300, rx: 14, fill: '#0B0C0E', stroke: '#2B3138', 'stroke-width': 10 }, log);
  E('rect', { x: -230, y: -150, width: 460, height: 56, rx: 10, fill: MG_LINE }, log);
  T(log, 0, -110, 'SERVICE RECORD', { size: 32, weight: 800, anchor: 'middle', fill: '#FFFFFF', ls: 2 });
  const logRows = ['12 YEARS', 'EVERY MEAL', 'EVERY CURRY PUFF'].map((s, i) => T(log, -200, -40 + i * 62, s, { size: 36, weight: 800, fill: '#FFB000' }));
  const logTicks = [0, 1, 2].map(i => { const k = tick(log, 16, C.good); tr(k, 186, -52 + i * 62); return k; });
  const puffRide = curryPuff(Lfg, 1);

  /* ================= H: title card ================= */
  const titleShot = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#2A0A1E', '#5A1A3A', true) }, titleShot);
  let rays = '';
  for (let i = 0; i < 16; i++) { const a0 = i / 16 * TAU, a1 = a0 + TAU / 40; rays += `M0,0 L${(Math.cos(a0) * 1100).toFixed(0)},${(Math.sin(a0) * 1100).toFixed(0)} L${(Math.cos(a1) * 1100).toFixed(0)},${(Math.sin(a1) * 1100).toFixed(0)} Z `; }
  const rayP = E('path', { d: rays, fill: '#FF9FC4', opacity: 0.07 }, titleShot);
  E('ellipse', { cx: 600, cy: 590, rx: 560, ry: 170, fill: glow('#FF7FA6'), opacity: 0.3 }, titleShot);
  const logo = G(Lfg);
  E('rect', { x: -400, y: -78, width: 800, height: 156, rx: 78, fill: '#FFFFFF', stroke: MG_LINEDK, 'stroke-width': 8 }, logo);
  E('rect', { x: -400, y: 34, width: 800, height: 22, fill: MG_LINE }, logo);
  E('circle', { cx: -322, cy: -8, r: 52, fill: MG_LINE, stroke: '#FFFFFF', 'stroke-width': 5 }, logo);
  T(logo, -322, 4, 'AL', { size: 40, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  T(logo, 40, 14, 'MIND THE GUT', { size: 76, weight: 800, anchor: 'middle', fill: MG_NAVY });
  const epi = T(Lfg, 600, 330, 'Episode 4: The Chicken Rice Express', { size: 42, weight: 700, anchor: 'middle', fill: '#FFFFFF' });

  /* ================= the cast ================= */
  const percy = cast(Lcast, 'percy');
  const extras = [['amy', 'happy'], ['priya', 'smug'], ['lionel', 'neutral'], ['bill', 'deadpan'], ['phoebe', 'sad'], ['vinny', 'neutral']]
    .map(([k, mood]) => ({ c: cast(Lcast, k, { mood }), k, mood }));
  // title row: kavya, percy, amy, priya, lionel, bill, phoebe, vinny
  const ROW = { kavya: [140, 0], percy: [280, 1], amy: [420, 2], priya: [560, 3], lionel: [700, 4], bill: [840, 5], phoebe: [975, 6], vinny: [1090, 7] };

  const blackout = E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#000000' }, Lhud);
  const iris = E('circle', { cx: 600, cy: 482, r: 0, fill: '#12030A' }, Lhud);

  /* cut points */
  const cB = at('small') - 0.06, cC = at('line') - 0.06, cD = at('this') - 0.06, cE = at('thpercy') - 0.06,
    cF = at('trains') - 0.06, cG = at('squeeze') - 0.06, cH = at('otherend') - 0.06, cI = at('years') - 0.06,
    cJ = at('puff') - 0.06, cK = at('title') - 0.06;

  return t => {
    op(blackout, 1 - P(t, 0, 0.6, linear));
    const sA = on(t, -1, cB), sB = on(t, cB, cC), sC = on(t, cC, cD), sD = on(t, cD, cE), sE = on(t, cE, cF), sF = on(t, cF, cG),
      sG = on(t, cG, cH), sH = on(t, cH, cI), sI = on(t, cI, cJ), sJ = on(t, cJ, cK), sK = on(t, cK, 1e9);
    let kavOn = 0, percyOn = 0;

    /* ---------- A + B: hawker centre, then into the mouth ---------- */
    op(hawkShot, sA || (sB && t < mid('small', 0.62)) ? 1 : 0);
    let zk = 1;
    if (sA || sB) {
      hawker.upd(t);
      const tight = t >= at('test') - 0.1;
      zk = sB ? Math.pow(9, P(t, mid('small', 0.2), mid('small', 0.62) - mid('small', 0.2), easeIn)) : 1;
      const base = sA ? (tight ? 1.12 + 0.03 * P(t, at('test'), 4, linear) : 1 + 0.03 * P(t, 0, 6, linear)) : 1.15;
      const k = base * zk, cx = KMOUTH[0], cy = KMOUTH[1];
      camBg(hawkWrap, k, cx, cy - (sB ? 0 : 60));
      const cam = { k, cx, cy: cy - (sB ? 0 : 60) };
      kavOn = 1;
      place(kav, cam, 600, 470, 1.5);
      const mood = sB ? 'happy' : t > mid('test', 0.62) ? 'smug' : t > at('test') ? 'deadpan' : 'annoyed';
      kav.set({ t, talk: scTalk(S, t, 'kavya') || (sB ? 0.5 + 0.5 * Math.sin(t * 9) : 0), mood, look: sA && t > mid('kavya', 0.75) && t < at('test') ? -0.4 : 0 });
      place(tableW, cam, 600, 660, 1);
      const tp = P(t, mid('kavya', 0.66), 0.45, pop);
      op(trayW, clamp(tp * 2.5)); place(trayW, cam, 640, 640, Math.max(0.01, 0.95 * (0.7 + 0.3 * tp)));
      // A chips
      const fA = sA && !tight ? 1 : 0;
      op(aChips, sA ? 1 : 0);
      if (sA) {
        op(cKav, fA); if (fA) popIn(cKav, t, mid('kavya', 0.05), 280, 190);
        op(cTime, fA); if (fA) popIn(cTime, t, mid('kavya', 0.35), 880, 170);
        op(cHot, fA); if (fA) popIn(cHot, t, mid('kavya', 0.5), 1030, 170);
        op(cRice, fA); if (fA) popIn(cRice, t, mid('kavya', 0.78), 880, 470);
      }
      const np = tight && sA ? P(t, mid('test', 0.1), 0.45, pop) : 0;
      op(note, clamp(np * 2.5)); tr(note, 940, 250, Math.max(0.01, 0.7 + 0.3 * np), 4);
      const rp = sA && tight ? P(t, mid('test', 0.66), 0.35, pop) : 0;
      op(revStamp, clamp(rp * 2.5)); tr(revStamp, 260, 250, Math.max(0.01, 1.6 - 0.6 * rp), -8);
      ltKavya.set(sA && tight ? win(t, at('test') + 0.1, at('test') + 3.4, 0.3) : 0);
    } else { op(aChips, 0); op(note, 0); op(revStamp, 0); ltKavya.set(0); op(trayW, 0); op(tableW, 0); }
    if (!(sA || sB)) op(tableW, 0); else op(tableW, 1);
    // iris into the dark tube, then the tunnel
    attr(iris, 'r', sB ? 1100 * P(t, mid('small', 0.42), 0.35, easeIn) : 0);
    op(iris, sB ? 1 - P(t, mid('small', 0.62), 0.3, linear) : 0);
    op(tunShot, sB ? P(t, mid('small', 0.6), 0.3, linear) : 0);
    if (sB) tunnel.upd(t, 1 * AMP + (1 - AMP) * 0.3);
    op(cTube, sB ? P(t, mid('small', 0.68), 0.3, linear) : 0); tr(cTube, 600, 640);
    if (sB && t > mid('small', 0.62)) { kavOn = 0; op(trayW, 0); op(tableW, 0); }

    /* ---------- C: the line map ---------- */
    op(mapShot, sC); op(mapHead, sC); op(map, sC); op(mChips, sC); op(mapBolus, 0);
    if (sC) {
      popIn(mapHead, t, at('line') + 0.05, 600, 190);
      tr(map, 600, 440, 1);
      map.set(-1, 0);
      map.stations.forEach((s, i) => { const p = P(t, mid('line', 0.3) + i * 0.12, 0.35, pop); op(s, clamp(p * 2.5)); tr(s, map.x(i), 0, Math.max(0.01, 0.5 + 0.5 * p)); });
      popIn(c7, t, mid('line', 0.32), 300, 620);
      const p1 = popIn(c1, t, mid('line', 0.55), 620, 620);
      if (p1 > 0.01) {
        const bp = P(t, mid('line', 0.55), end('line') + 0.4 - mid('line', 0.55), linear);
        op(mapBolus, 1); tr(mapBolus, 600 + lerp(-480, 480, bp), 440);
      }
      popIn(cNo, t, mid('line', 0.8), 940, 620, 1, -6);
    }

    /* ---------- D, F, I: the platform ---------- */
    const platOn = Math.max(sD, sF, sI);
    op(platShot, platOn);
    if (platOn) camBg(platWrap, sF ? 1.04 : 1, 600, 400);
    setText(plat.led, sF && t > mid('trains', 0.15) ? 'NEXT TRAIN: THERE ARE NO TRAINS' : 'NEXT ARRIVAL: YOUR LUNCH');
    if (sD) {
      percyOn = 1;
      const rise = P(t, at('this') + 0.1, 0.7, easeOut);
      tr(percy, 780, lerp(900, 470, rise), 1.3);
      percy.set({ t, mood: t > mid('this', 0.8) ? 'deadpan' : 'neutral', look: t > mid('this', 0.8) ? 0 : -0.6 });
    }
    op(noTrain, 0); op(cMuscle, 0); op(cMe, 0);
    if (sF) {
      percyOn = 1;
      tr(percy, 330, 470, 1.25);
      const meBeat = t > mid('trains', 0.78);
      const sq = meBeat ? (0.5 + 0.5 * Math.sin((t - mid('trains', 0.78)) * 6 - Math.PI / 2)) : 0;
      percy.set({ t, talk: scTalk(S, t, 'percy'), mood: meBeat ? 'smug' : 'deadpan', look: t > mid('trains', 0.15) && t < mid('trains', 0.55) ? 0.8 : 0, squeeze: sq });
      const np = P(t, mid('trains', 0.22), 0.45, pop);
      op(noTrain, clamp(np * 2.5) * (1 - P(t, mid('trains', 0.55), 0.2, linear))); tr(noTrain, 840, 400, Math.max(0.01, 0.7 + 0.3 * np));
      op(trainX, P(t, mid('trains', 0.32), 0.2, linear));
      const mp = P(t, mid('trains', 0.55), 0.4, pop);
      op(cMuscle, clamp(mp * 2.5)); tr(cMuscle, 840, 330, Math.max(0.01, 0.7 + 0.3 * mp));
      const ep = P(t, mid('trains', 0.78), 0.4, pop);
      op(cMe, clamp(ep * 2.5)); tr(cMe, 840, 420, Math.max(0.01, 0.7 + 0.3 * ep));
    }
    op(log, 0); op(puffRide, 0);
    if (sI) {
      percyOn = 1;
      tr(percy, 300, 480, 1.2);
      percy.set({ t, mood: t > mid('years', 0.8) ? 'sad' : 'deadpan', look: 0.7 });
      const lp = P(t, at('years'), 0.4, pop);
      op(log, clamp(lp * 2.5)); tr(log, 820, 420, Math.max(0.01, 0.8 + 0.2 * lp));
      logRows.forEach((r, i) => { const p = P(t, mid('years', [0.05, 0.42, 0.72][i]), 0.3, linear); op(r, p); op(logTicks[i], P(t, mid('years', [0.05, 0.42, 0.72][i]) + 0.25, 0.25, linear)); });
      const pp = P(t, mid('years', 0.7), end('years') + 0.6 - mid('years', 0.7), linear);
      op(puffRide, pp > 0 && pp < 1 ? 1 : 0); tr(puffRide, lerp(1300, -100, pp), 640 + 8 * Math.sin(t * 8), 0.9, Math.sin(t * 6) * 8);
    }

    /* ---------- E, H, J: the confessional ---------- */
    const confOn = Math.max(sE, sH, sJ);
    conf.set(confOn, t);
    ltPercy.set(sE ? win(t, at('thpercy') + 0.05, at('thpercy') + 3.2, 0.3) : 0);
    op(kw, 0); op(other, 0); op(photo, 0); op(photoCap, 0);
    if (confOn) {
      percyOn = 1;
      let cam = { k: 1, cx: 430, cy: 400 };
      if (sH) cam = { k: 1.18 + 0.12 * P(t, cH, end('otherend') + 0.9 - cH, linear), cx: 430, cy: 380 };
      if (sJ) cam = { k: 1.05, cx: 430, cy: 400 };
      camBg(conf, cam.k, cam.cx, cam.cy);
      place(percy, cam, 430, 410, 1.5);
      let mood = 'deadpan', look = 0;
      if (sJ) mood = t < mid('puff', 0.55) ? 'shock' : t < end('puff') ? 'sad' : 'deadpan';
      if (sE) mood = 'neutral';
      percy.set({ t, talk: scTalk(S, t, 'percy'), mood, look });
      if (sE) { const p = P(t, mid('thpercy', 0.4), 0.45, pop); op(kw, clamp(p * 2.5)); tr(kw, 880, 300, Math.max(0.01, 0.75 + 0.25 * p)); }
      if (sH) {
        const p = P(t, at('otherend') + 0.1, 0.4, pop);
        op(other, clamp(p * 2.5)); tr(other, 840, 300, 1, 3);
        const bp = P(t, mid('otherend', 0.35), 0.25, easeOut);
        attr(bar, 'width', 264 * bp); op(barTxt, P(t, mid('otherend', 0.35) + 0.2, 0.15, linear));
      }
      if (sJ) {
        const p = P(t, mid('puff', 0.2), 0.45, pop);
        op(photo, clamp(p * 2.5)); tr(photo, 870, 300, Math.max(0.01, 0.7 + 0.3 * p), 3);
        op(photoCap, P(t, mid('puff', 0.45), 0.3, linear)); tr(photoCap, 870, 500);
      }
    }

    /* ---------- G: the squeeze, side view ---------- */
    op(sqShot, sG); op(tubeW, sG); op(sqArrow, sG); op(pushA, sG); op(paste, 0); op(toEnd, 0);
    if (sG) {
      const p = P(t, at('squeeze'), end('squeeze') + 0.3 - at('squeeze'), linear);
      peri.set(p);
      const xs = lerp(-560, 400, p) + 600;           // contraction ring on screen (tube centred at 600)
      tr(sqArrow, xs, 300); tr(sqLbl, clamp(xs, 210, 990) - xs, -186); sqA.set(P(t, at('squeeze') + 0.2, 0.4, linear));
      op(sqArrow, P(t, at('squeeze') + 0.1, 0.3, linear));
      tr(pushA, Math.min(1080, xs + 92 + 50), 300); pA.set(P(t, mid('squeeze', 0.15), 0.4, linear));
      op(pushA, P(t, mid('squeeze', 0.12), 0.3, linear) * (1 - P(t, mid('squeeze', 0.7), 0.3, linear)));
      // toothpaste inset
      const tp = P(t, mid('squeeze', 0.38), 0.4, pop);
      op(paste, clamp(tp * 2.5)); tr(paste, 360, 590, Math.max(0.01, 0.7 + 0.3 * tp));
      const sqz = clamp((t - mid('squeeze', 0.45)) / 1.4);
      const pinchY = 26 - 16 * sqz;
      attr(ptBody, 'd', `M-160,${-pinchY} L-140,-30 L150,-26 L150,26 L-140,30 L-160,${pinchY} Z`);
      attr(ptStripe, 'd', `M-120,0 L130,0`);
      let pd = 'M184,0';
      const pl = 120 * sqz;
      for (let x = 0; x <= pl; x += 12) pd += ` L${(184 + x).toFixed(0)},${(Math.sin(x * 0.08) * 10).toFixed(1)}`;
      attr(ptPaste, 'd', sqz > 0.01 ? pd : '');
      const ep = P(t, mid('squeeze', 0.7), 0.4, pop);
      op(toEnd, clamp(ep * 2.5)); tr(toEnd, 830, 590); teA.set(P(t, mid('squeeze', 0.7), 0.5, linear));
    }

    /* ---------- K: title card ---------- */
    op(titleShot, sK); op(logo, 0); op(epi, 0);
    if (sK) {
      tr(rayP, 600, 590, 1, (t * 6 * AMP) % 360);
      const lp = P(t, at('title') + 0.05, 0.6, pop);
      op(logo, clamp(lp * 2.5)); tr(logo, 600, 190, Math.max(0.01, 0.5 + 0.5 * lp));
      op(epi, P(t, mid('title', 0.45), 0.4, linear));
      const castT = i => mid('title', 0.55) + i * 0.12;
      const putRow = (c, k, mood) => { const [x, i] = ROW[k], p = P(t, castT(i), 0.45, pop); op(c, clamp(p * 3)); tr(c, x, 560 + 30 * (1 - clamp(p)), Math.max(0.01, 0.62 * p)); c.set({ t, mood, look: 0, wave: 1, sparkle: 1 }); };
      extras.forEach(e => putRow(e.c, e.k, e.mood));
      putRow(kav, 'kavya', 'annoyed'); kavOn = 1;
      putRow(percy, 'percy', 'deadpan'); percyOn = 1;
    } else extras.forEach(e => op(e.c, 0));

    if (!kavOn) op(kav, 0); else if (!sK) op(kav, 1);
    if (!percyOn) op(percy, 0); else if (!sK) op(percy, 1);
  };
});
