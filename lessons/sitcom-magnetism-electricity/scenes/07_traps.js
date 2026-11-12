/* Scene 7: The drawer saves you some marks.
   "7 EXAM TRAPS" on a drawer front (eyes in the gap) -> seven snappy confessionals, one trap card each
   (Nora, Stan, Amy, Dimitri, Sol, Eddie, Cecil) -> the cabinet: drawer 8B slides shut under the logo
   "DRAWER 8B will return" -> stinger in Vic's confessional: Cecil asks, long silence, Vic's leads creep
   over to Cecil's terminals, "...1.4 V" -> hard cut: Cecil wired up, shock, deadpan, "Turn the camera
   off." -> the REC dot goes out -> black. */
scene('traps', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;

  /* ---------- local helpers (prefixed tp) ---------- */
  const tpCam = (el, cx, cy, k, px, py) => el.setAttribute('transform', `translate(${(px ?? cx).toFixed(1)} ${(py ?? cy).toFixed(1)}) scale(${k.toFixed(4)}) translate(${(-cx).toFixed(1)} ${(-cy).toFixed(1)})`);
  const tpPop = (el, t, t0, x, y, s, r) => { const p = P(t, t0, 0.45, pop); op(el, clamp(p * 2.5)); tr(el, x, y, Math.max(0.01, (s || 1) * (0.6 + 0.4 * p)), r); return p; };
  // text that shrinks (down to 26 px) to fit maxW
  const tpFit = (parent, x, y, str, o, maxW) => {
    let size = o.size;
    while (size > 26 && textWidth(str, size, o.font || FD, o.weight || 600) > maxW) size -= 1;
    return T(parent, x, y, str, Object.assign({}, o, { size }));
  };
  const tpWire = (parent, pts, o) => {
    o = o || {};
    const g = G(parent), d = 'M' + pts.map(q => q[0] + ',' + q[1]).join(' L'), sp = o.spacing || 46;
    E('path', { d, fill: 'none', stroke: WIRE, 'stroke-width': 5, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, g);
    const dots = E('path', { d, fill: 'none', stroke: C.energy, 'stroke-width': 11, 'stroke-linecap': 'round', 'stroke-dasharray': `0 ${sp}` }, g);
    g.upd = (t, speed) => attr(dots, 'stroke-dashoffset', -((t * (speed === undefined ? 60 : speed)) % sp));
    return g;
  };
  const CX = 880;
  const tpCard = (parent, n) => {
    const g = G(parent);
    card(g, 600, 120, 560, 490, { fill: C.card, stroke: C.line, opacity: 0.95 });
    const h = chip(g, 'TRAP ' + n, { size: 30, fill: C.bad, color: '#FFFFFF', weight: 800 }); tr(h, CX, 165);
    return g;
  };
  const tpClip = (parent) => { const g = G(parent); E('path', { d: 'M-12,-5 L12,-5 Q17,-5 17,0 Q17,5 12,5 L-14,5 Q-19,5 -19,0 Q-19,-8 -12,-8 L10,-8', fill: 'none', stroke: '#C9D3DC', 'stroke-width': 3.5, 'stroke-linecap': 'round' }, g); return g; };

  /* ---------- layers ---------- */
  const fixedBg = G(root), world = G(root), Lbg = G(world), Lmid = G(world), Lcast = G(world), Lfg = G(world), hud = G(root);

  /* ================= sets ================= */
  // intro: the front of drawer 8B, open a crack, eyes in the gap
  const intro = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#AEBBC4', '#7A8894', true) }, intro);
  E('rect', { x: 150, y: 150, width: 900, height: 70, fill: '#14100C' }, intro);
  const gapEyes = [[300, 185], [330, 185], [560, 180], [590, 180], [860, 188], [890, 188]].map(([x, y]) => E('ellipse', { cx: x, cy: y, rx: 8, ry: 9, fill: '#FFF7C2' }, intro));
  E('rect', { x: 140, y: 210, width: 920, height: 420, rx: 16, fill: linGrad('#E4EAEE', '#C3CDD4', true), stroke: '#56636E', 'stroke-width': 6 }, intro);
  E('rect', { x: 220, y: 250, width: 760, height: 230, rx: 8, fill: '#FFFFFF', stroke: '#9AA6B2', 'stroke-width': 3 }, intro);
  E('rect', { x: 520, y: 540, width: 160, height: 34, rx: 17, fill: '#56636E' }, intro);
  const iHead = T(intro, 600, 360, '7 EXAM TRAPS', { size: 92, weight: 800, anchor: 'middle', fill: DR_RED, ls: 3 });
  const iSub = T(intro, 600, 435, 'the drawer saves you some marks', { size: 36, weight: 700, anchor: 'middle', fill: '#3A4752', font: FB });
  // one confessional, re-tinted for each speaker
  const conf = drConf(fixedBg, 'cecil');
  const TINT = {};
  Object.keys(DR_TINT).forEach(k => { TINT[k] = linGrad(DR_TINT[k][0], DR_TINT[k][1], true); });
  // return: the cabinet
  const cabWrap = G(Lbg), cab = drCabinet(cabWrap);
  const logo = G(Lfg);
  E('rect', { x: -330, y: -78, width: 660, height: 156, rx: 16, fill: linGrad('#E4EAEE', '#AEBBC4', true), stroke: SC_INK, 'stroke-width': 6 }, logo);
  E('rect', { x: -294, y: -58, width: 588, height: 96, rx: 6, fill: '#FFFFFF', stroke: '#9AA6B2', 'stroke-width': 3 }, logo);
  T(logo, 0, 14, 'DRAWER 8B', { size: 80, weight: 800, anchor: 'middle', fill: SC_INK, ls: 6 });
  const logoSub = T(Lfg, 600, 300, 'will return', { size: 46, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  const logoBack = E('rect', { x: 470, y: 256, width: 260, height: 60, rx: 30, fill: '#14243A', opacity: 0.85 }, Lfg);
  Lfg.insertBefore(logoBack, logoSub);

  /* ================= trap cards ================= */
  // 1 Nora: like poles repel, unlike attract
  const s1 = G(hud), c1 = tpCard(s1, 1);
  const c1a = G(c1), c1b = G(c1);
  const m1a = magnet(c1a, 150, 44, { flip: true }), m1b = magnet(c1a, 150, 44);
  const r1Arr = E('path', { d: '', fill: 'none', stroke: C.energy, 'stroke-width': 6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, c1a);
  T(c1a, CX, 330, '**LIKE** poles **REPEL**', { size: 40, weight: 600, anchor: 'middle', boldFill: C.energy });
  const m1c = magnet(c1b, 150, 44), m1d = magnet(c1b, 150, 44);
  const a1Arr = E('path', { d: '', fill: 'none', stroke: C.good, 'stroke-width': 6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, c1b);
  T(c1b, CX, 520, '**UNLIKE** poles **ATTRACT**', { size: 40, weight: 600, anchor: 'middle', boldFill: C.good });
  const arrPair = (x1, x2, y, out) => {
    const s = out ? 1 : -1, L = 34;
    const a = (x, dir) => `M${x - dir * L / 2},${y} L${x + dir * L / 2},${y} M${x + dir * L / 2 - dir * 12},${y - 10} L${x + dir * L / 2},${y} L${x + dir * L / 2 - dir * 12},${y + 10} `;
    return a(x1, -s) + a(x2, s);
  };
  // 2 Stan: field lines, Earth
  const s2 = G(hud), c2 = tpCard(s2, 2);
  const c2a = G(c2), c2b = G(c2), c2c = G(c2);
  const f2 = drField(c2a, 150, { n: 2, color: '#9FD8FF' }); tr(f2, CX, 290, 0.75);
  const m2 = magnet(c2a, 150, 44); tr(m2, CX, 290, 0.75);
  T(c2b, CX, 410, 'field lines: **N → S**, never cross', { size: 34, weight: 600, anchor: 'middle', boldFill: C.energy });
  const earthI = G(c2c); tr(earthI, 700, 510);
  E('circle', { r: 58, fill: ball('#4CC9F0', '#1D6FA6'), stroke: SC_INK, 'stroke-width': 3 }, earthI);
  E('path', { d: 'M-30,-30 Q-6,-44 10,-26 Q24,-10 6,4 Q-16,8 -24,-8 Z M10,20 Q30,14 36,30 Q26,44 12,38 Z', fill: '#5BD27A' }, earthI);
  E('rect', { x: -7, y: -40, width: 14, height: 80, rx: 4, fill: DR_BLUE, stroke: '#FFFFFF', 'stroke-width': 2, opacity: 0.85 }, earthI);
  T(earthI, 0, -14, 'S', { size: 24, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  T(c2c, 780, 500, "Earth's magnetic **SOUTH**", { size: 32, weight: 600, boldFill: '#8FB4FF' });
  T(c2c, 780, 545, 'pole is up north', { size: 32, weight: 600 });
  // 3 Amy: ammeter in series, voltmeter across
  const s3 = G(hud), c3 = tpCard(s3, 3);
  const c3d = G(c3), c3a = G(c3), c3b = G(c3);
  const w3 = tpWire(c3d, [[714, 400], [680, 400], [680, 250], [734, 250]], { spacing: 40 });
  const w3b = tpWire(c3d, [[826, 250], [934, 250]], { spacing: 40 });
  const w3c = tpWire(c3d, [[1026, 250], [1080, 250], [1080, 400], [846, 400]], { spacing: 40 });
  const am3 = meterSym(c3d, 'A'); tr(am3, 780, 250);
  const lp3 = bulbSym(c3d); tr(lp3, 980, 250); lp3.set(1);
  const cl3 = cellSym(c3d, { signs: false }); tr(cl3, 780, 400);
  E('path', { d: 'M934,250 L934,330 M1026,250 L1026,330', stroke: '#9FD8FF', 'stroke-width': 5, fill: 'none' }, c3d);
  const vm3 = meterSym(c3d, 'V'); tr(vm3, 980, 330);
  T(c3a, CX, 475, '**AMMETER**: in **SERIES**, amps (A)', { size: 32, weight: 600, anchor: 'middle', boldFill: '#FF9AA0' });
  T(c3b, CX, 525, '**VOLTMETER**: **ACROSS**', { size: 32, weight: 600, anchor: 'middle', boldFill: '#9FD8FF' });
  T(c3b, CX, 568, '(in parallel), volts (V)', { size: 30, weight: 600, anchor: 'middle', fill: C.muted });
  // 4 Dimitri: more lamps in series = dimmer
  const s4 = G(hud), c4 = tpCard(s4, 4);
  const rows4 = [1, 2, 3].map((n, r) => {
    const g = G(c4), y = 240 + r * 82, x0 = 680;
    E('path', { d: `M${x0 - 30},${y} L${x0 + (n - 1) * 100 + 30},${y}`, stroke: WIRE, 'stroke-width': 5 }, g);
    const bs = []; for (let i = 0; i < n; i++) { const b = bulbSym(g); tr(b, x0 + i * 100, y, 0.8); bs.push(b); }
    T(g, 1100, y + 11, n + (n === 1 ? ' lamp' : ' lamps'), { size: 30, weight: 700, anchor: 'end', fill: C.ink });
    g.bs = bs; return g;
  });
  const c4a = T(c4, CX, 510, 'more lamps in **SERIES** = **DIMMER**', { size: 34, weight: 600, anchor: 'middle', boldFill: C.energy });
  const c4b = G(c4); T(c4b, CX - 20, 565, 'never brighter', { size: 32, weight: 700, anchor: 'middle', fill: '#FF9AA0' }); tr(cross(c4b, 13), CX + 110, 555);
  // 5 Sol: no current, no electromagnet
  const s5 = G(hud), c5 = tpCard(s5, 5);
  const c5d = G(c5), c5a = G(c5), c5b = G(c5);
  const sw5 = switchSym(c5d); tr(sw5, 740, 290, 1.2);
  const coil5 = G(c5d); tr(coil5, 980, 280);
  E('rect', { x: -14, y: -70, width: 28, height: 150, fill: '#9AA6B2', stroke: SC_INK, 'stroke-width': 3 }, coil5);
  E('rect', { x: -44, y: -50, width: 88, height: 100, rx: 12, fill: DR_COPPER_DK, stroke: SC_INK, 'stroke-width': 3 }, coil5);
  { let d = ''; for (let y = -42; y <= 44; y += 12) d += `M-42,${y} Q0,${y + 9} 42,${y} `; E('path', { d, fill: 'none', stroke: DR_COPPER, 'stroke-width': 6, 'stroke-linecap': 'round' }, coil5); }
  E('path', { d: 'M790,290 L900,290 L936,290', stroke: WIRE, 'stroke-width': 5 }, c5d);
  const clips5 = [0, 1, 2].map(() => tpClip(c5d));
  T(c5a, CX, 450, 'current **OFF** →', { size: 38, weight: 600, anchor: 'middle', boldFill: '#FF9AA0' });
  T(c5b, CX, 510, 'magnetism **DISAPPEARS**', { size: 38, weight: 600, anchor: 'middle', boldFill: C.energy });
  T(c5b, CX, 560, '(an electromagnet needs current)', { size: 28, weight: 600, anchor: 'middle', fill: C.muted });
  // 6 Eddie: current is not used up
  const s6 = G(hud), c6 = tpCard(s6, 6);
  const c6d = G(c6), c6a = G(c6), c6b = G(c6);
  E('path', { d: 'M846,390 L680,390 L680,230 L1080,230 L1080,390 L914,390', fill: 'none', stroke: WIRE, 'stroke-width': 5, 'stroke-linejoin': 'round' }, c6d);
  const cl6 = cellSym(c6d); tr(cl6, 880, 390);
  const LOOP6 = [[914, 390], [1080, 390], [1080, 230], [680, 230], [680, 390], [846, 390]];
  let L6 = 0; const seg6 = []; for (let i = 0; i < LOOP6.length - 1; i++) { const l = Math.hypot(LOOP6[i + 1][0] - LOOP6[i][0], LOOP6[i + 1][1] - LOOP6[i][1]); seg6.push([L6, l, LOOP6[i], LOOP6[i + 1]]); L6 += l; }
  const at6 = s => { for (const [s0, l, a, b] of seg6) if (s <= s0 + l) { const p = (s - s0) / l; return [lerp(a[0], b[0], p), lerp(a[1], b[1], p)]; } return LOOP6[LOOP6.length - 1]; };
  const ed6 = []; for (let i = 0; i < 6; i++) ed6.push(drElectron(c6d, 15));
  const out6 = chip(c6a, 'OUT: 100', { size: 32, fill: '#123A6A', color: '#BFE0FF' }); tr(out6, 760, 460);
  T(c6a, CX, 472, '=', { size: 40, weight: 800, anchor: 'middle' });
  const back6 = chip(c6a, 'BACK: 100', { size: 32, fill: '#123A6A', color: '#BFE0FF' }); tr(back6, 1000, 460);
  T(c6b, CX, 550, 'current is **NOT** used up', { size: 38, weight: 600, anchor: 'middle', boldFill: C.energy });
  // 7 Cecil: conductors and insulators; the rubber band
  const s7 = G(hud), c7 = tpCard(s7, 7);
  const c7a = G(c7), c7b = G(c7), c7c = G(c7);
  T(c7a, 640, 250, 'Metals **CONDUCT**', { size: 36, weight: 600, boldFill: C.good });
  tr(tick(c7a, 16), 1060, 238);
  tpFit(c7b, 640, 315, 'Plastic, rubber **INSULATE**', { size: 36, weight: 600, boldFill: '#FF9AA0' }, 380);
  tr(cross(c7b, 14), 1060, 303);
  const photo = G(c7c); tr(photo, CX, 465);
  E('rect', { x: -170, y: -100, width: 340, height: 200, rx: 8, fill: '#C9A24A', stroke: '#6B4E12', 'stroke-width': 5 }, photo);
  E('rect', { x: -152, y: -82, width: 304, height: 144, fill: '#22303A' }, photo);
  tr(drSym(photo, 'cell', { color: '#FFFFFF', w: 5 }), -70, -40, 0.75);
  tr(drSym(photo, 'lamp', { color: '#FFFFFF', w: 5 }), 70, -40, 0.75);
  E('path', { d: 'M-115,-40 Q-140,40 0,44 Q140,40 115,-40', fill: 'none', stroke: '#FF8FB0', 'stroke-width': 8, 'stroke-linecap': 'round' }, photo);
  T(photo, 0, 90, 'not a wire', { size: 26, weight: 800, anchor: 'middle', fill: '#3A2A10' });
  const pX = cross(photo, 50); tr(pX, 0, -10);

  /* ================= cast ================= */
  const mag = cast(Lcast, 'magnet'), amy = cast(Lcast, 'amy'), dimitri = cast(Lcast, 'dimitri'), sol = cast(Lcast, 'sol');
  const eddie = cast(Lcast, 'eddie'), cecil = cast(Lcast, 'cecil'), vic = cast(Lcast, 'vic');
  // Vic's leads to Cecil's terminals (stinger)
  const leads = G(Lmid);
  const leadR = E('path', { d: 'M384,548 C380,660 900,668 978,600 L978,326 L1040,326', fill: 'none', stroke: DR_RED, 'stroke-width': 7, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', pathLength: 1, 'stroke-dasharray': '1 1' }, leads);
  const leadB = E('path', { d: 'M476,548 C482,630 880,640 1062,592', fill: 'none', stroke: '#2A2F36', 'stroke-width': 7, 'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': '1 1' }, leads);
  const clipR = E('circle', { cx: 1044, cy: 326, r: 9, fill: '#C9D3DC', stroke: SC_INK, 'stroke-width': 2 }, leads);
  const clipB = E('circle', { cx: 1062, cy: 592, r: 9, fill: '#C9D3DC', stroke: SC_INK, 'stroke-width': 2 }, leads);
  // HUD for the stinger
  const ltVic = scLowerThird(hud, 'VIC', 'Voltmeter. Silent since 2015.');
  const lvl = G(hud);
  E('rect', { x: -130, y: -36, width: 240, height: 72, rx: 12, fill: 'rgba(10,27,39,0.92)', stroke: '#FFFFFF', 'stroke-width': 4 }, lvl);
  E('rect', { x: 110, y: -16, width: 16, height: 32, rx: 4, fill: '#FFFFFF' }, lvl);
  E('rect', { x: -120, y: -26, width: 190, height: 52, rx: 8, fill: '#FFC247' }, lvl);
  T(lvl, -10, 12, '1.4 V', { size: 34, weight: 800, anchor: 'middle', fill: SC_INK });
  const blackout = E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#000000' }, hud);

  /* ================= shots ================= */
  const SHOTS = [['I', -9], ['1', at('t1') - 0.05], ['2', at('t2') - 0.05], ['3', at('t3') - 0.05], ['4', at('t4') - 0.05], ['5', at('t5') - 0.05],
    ['6', at('t6') - 0.05], ['7', at('t7') - 0.05], ['R', at('return') - 0.05], ['V', at('vic') - 0.05], ['C', end('volts') + 0.35]];
  const shotAt = t => { let s = 'I'; for (const [k, t0] of SHOTS) if (t >= t0) s = k; return s; };
  const CARD = { 1: s1, 2: s2, 3: s3, 4: s4, 5: s5, 6: s6, 7: s7 };
  const WHO = { 1: 'magnet', 2: 'magnet', 3: 'amy', 4: 'dimitri', 5: 'sol', 6: 'eddie', 7: 'cecil', V: 'vic', C: 'vic' };
  const CH = { magnet: mag, amy, dimitri, sol, eddie, cecil, vic };

  return t => {
    const sh = shotAt(t);
    op(blackout, Math.max(1 - P(t, at('intro') - 0.3, 0.5, linear), P(t, end('camera') + 0.75, 0.25, linear)));
    for (const k in CARD) op(CARD[k], k === sh ? 1 : 0);
    op(intro, sh === 'I' ? 1 : 0);
    const confOn = WHO[sh] ? 1 : 0;
    conf.set(confOn, t);
    if (confOn) attr(conf.firstChild, 'fill', TINT[WHO[sh]]);
    op(cabWrap, sh === 'R' ? 1 : 0); op(logo, sh === 'R' ? 1 : 0); op(logoSub, sh === 'R' ? 1 : 0); op(logoBack, sh === 'R' ? 1 : 0);
    op(leads, 0); op(lvl, 0); ltVic.set(0);
    for (const k in CH) op(CH[k], 0);
    let cam = [600, 375, 1];
    const show = (k, x, y, s, st) => { op(CH[k], 1); tr(CH[k], x, y, s); CH[k].set(Object.assign({ t }, st)); };

    if (sh === 'I') {
      const hp = P(t, at('intro') + 0.05, 0.5, pop); op(iHead, clamp(hp * 2));
      iHead.setAttribute('transform', `translate(600 330) scale(${(0.7 + 0.3 * hp).toFixed(3)}) translate(-600 -330)`);
      op(iSub, P(t, mid('intro', 0.5), 0.4, linear));
      gapEyes.forEach((e, i) => attr(e, 'ry', 9 * (1 - scBlink(t, i * 2 + 1)) + 0.6));
      cam = [600, 380, 1 + 0.04 * P(t, at('intro'), 5, linear)];
    } else if (+sh >= 1 && +sh <= 7) {
      const n = +sh, line = 't' + n;
      const f = x => mid(line, x);
      cam = [600, 375, 1 + 0.03 * P(t, at(line), 5, linear)];
      if (n === 1 || n === 2) {
        const nTalk = scTalk(S, t, 'nora'), sTalk = scTalk(S, t, 'stan');
        show('magnet', 320, 400, 1.05, { talk: nTalk, talkB: sTalk, mood: n === 1 ? 'happy' : 'neutral', moodB: n === 2 ? 'smug' : 'deadpan', look: n === 2 ? 1 : 0.2, lookB: n === 1 ? -1 : 0.2 });
      }
      if (n === 1) {
        op(c1a, P(t, f(0.18), 0.3, linear)); op(c1b, P(t, f(0.58), 0.3, linear));
        const ra = 26 * P(t, f(0.25), 0.7, easeOut);
        tr(m1a, 790 - ra, 255); tr(m1b, 970 + ra, 255);
        attr(r1Arr, 'd', arrPair(690 - ra, 1070 + ra, 255, true));
        const rb = 22 * (1 - P(t, f(0.65), 0.5, easeIn));
        tr(m1c, 798 - rb, 440); tr(m1d, 962 + rb, 440);
        attr(a1Arr, 'd', arrPair(700 - rb, 1060 + rb, 440, false));
      } else if (n === 2) {
        op(c2a, P(t, f(0.1), 0.3, linear)); f2.set(P(t, f(0.12), 1.4, linear));
        op(c2b, P(t, f(0.36), 0.3, linear)); op(c2c, P(t, f(0.6), 0.3, linear));
      } else if (n === 3) {
        show('amy', 320, 400, 1.25, { talk: scTalk(S, t, 'amy'), mood: t > f(0.5) ? 'smug' : 'neutral', needle: 0.4 + 0.05 * Math.sin(t * 3), look: 0.3 });
        op(c3d, P(t, f(0.05), 0.3, linear)); [w3, w3b, w3c].forEach(w => w.upd(t, 60 * AMP));
        am3.set(t > f(0.2) ? '0.2 A' : ''); vm3.set('');
        op(c3a, P(t, f(0.18), 0.3, linear)); op(c3b, P(t, f(0.56), 0.3, linear));
        const hiA = win(t, f(0.18), f(0.5), 0.15), hiV = P(t, f(0.56), 0.2, linear);
        am3.style.opacity = (0.5 + 0.5 * Math.max(hiA, 1 - hiV)).toFixed(2); vm3.style.opacity = (0.4 + 0.6 * hiV).toFixed(2);
      } else if (n === 4) {
        const dim = P(t, f(0.3), 1.2, linear);
        show('dimitri', 320, 400, 1.3, { talk: scTalk(S, t, 'dimitri'), mood: t > f(0.78) ? 'deadpan' : dim > 0.3 ? 'sad' : 'smug', glow: 1 - 0.7 * dim, look: 0 });
        rows4.forEach((g, r) => { op(g, P(t, f(0.06 + r * 0.12), 0.3, linear)); g.bs.forEach(b => b.set(1 / (r + 1))); });
        op(c4a, P(t, f(0.35), 0.3, linear)); op(c4b, P(t, f(0.62), 0.3, linear));
      } else if (n === 5) {
        const offT = f(0.18), on = 1 - P(t, offT, 0.25, linear);
        show('sol', 320, 410, 1.0, { talk: scTalk(S, t, 'sol'), mood: on > 0.5 ? 'smug' : 'sad', on, look: 0.3 });
        op(c5d, P(t, f(0.05), 0.3, linear)); sw5.set(on);
        clips5.forEach((c, i) => { const p = P(t, offT + 0.1 + i * 0.08, 0.4, easeIn); tr(c, 960 + i * 20, lerp(372, 396 - i * 3, p), 1, lerp(-70 + i * 50, i * 20, p)); });
        op(c5a, P(t, f(0.22), 0.3, linear)); op(c5b, P(t, f(0.5), 0.3, linear));
      } else if (n === 6) {
        show('eddie', 320, 410, 1.05, { talk: scTalk(S, t, 'eddie'), mood: 'happy', look: 0.4 });
        op(c6d, P(t, f(0.02), 0.3, linear));
        ed6.forEach((e, i) => { const q = at6(((t - at(line)) * 150 * (S.reduce ? 0.5 : 1) + i * L6 / 6) % L6); tr(e, q[0], q[1]); });
        op(c6a, P(t, f(0.4), 0.3, linear)); op(c6b, P(t, f(0.12), 0.3, linear));
      } else if (n === 7) {
        show('cecil', 320, 410, 1.35, { talk: scTalk(S, t, 'cecil'), mood: 'deadpan', look: t > f(0.6) && t < end('t7') ? 0.5 : 0 });
        op(c7a, P(t, f(0.08), 0.3, linear)); op(c7b, P(t, f(0.3), 0.3, linear));
        tpPop(c7c, t, f(0.62), 0, 0); op(pX, P(t, f(0.82), 0.25, linear));
        const push = P(t, end('t7'), 0.9, linear);
        cam = [lerp(600, 320, push), lerp(375, 400, push), 1 + 0.25 * push];
        op(s7, 1 - P(t, end('t7') + 0.05, 0.3, linear));
      }
    } else if (sh === 'R') {
      const close = P(t, at('return') + 0.4, 2.6, easeIn);
      cab.open(1 - close); cab.upd(t);
      tpCam(cabWrap, cab.d8b[0], cab.d8b[1] + 40, 1.8, 600, 520);
      const lp = P(t, at('return') + 0.05, 0.5, pop); op(logo, clamp(lp * 2)); tr(logo, 600, 165, Math.max(0.01, 0.7 + 0.3 * lp));
      const sp = P(t, mid('return', 0.5), 0.4, linear); op(logoSub, sp); op(logoBack, sp);
    } else {
      // the stinger, in Vic's confessional
      const vt = scTalk(S, t, 'vic') * 0.35;
      const sign = t > mid('volts', 0.45) ? '1.4 V' : '';
      show('vic', 430, 410, 1.35, { talk: vt, mood: 'deadpan', look: sh === 'V' && t < end('vic') ? 0.8 : 0, sign, needle: sign ? 0.62 : 0, still: true });
      show('cecil', 1060, 460, 0.95, {
        talk: scTalk(S, t, 'cecil'), look: sh === 'V' ? -1 : 0, sweat: sh === 'C' ? 0.6 : 0,
        mood: sh === 'V' ? 'neutral' : (t < end('volts') + 1.0 ? 'shock' : 'deadpan'),
      });
      op(leads, 1);
      const lr = P(t, end('vic') + 0.25, at('volts') - end('vic') - 0.3, linear);
      attr(leadR, 'stroke-dashoffset', (1 - lr).toFixed(4)); attr(leadB, 'stroke-dashoffset', (1 - P(t, end('vic') + 0.4, at('volts') - end('vic') - 0.4, linear)).toFixed(4));
      op(clipR, lr >= 1 ? 1 : 0); op(clipB, t > at('volts') ? 1 : 0);
      if (sh === 'V') {
        ltVic.set(win(t, at('vic') + 0.4, end('vic') + 0.9, 0.3));
        const push = P(t, end('vic'), at('volts') - end('vic') + 1.2, linear);
        cam = [lerp(600, 520, push), lerp(375, 380, push), 1 + 0.32 * push];
      } else {
        cam = [1000, 420, 1.55];
        tpPop(lvl, t, end('volts') + 0.55, 960, 560);
        const push = P(t, at('camera'), end('camera') - at('camera') + 0.8, linear);
        cam = [1060, 440 - 10 * push, 1.55 + 0.15 * push, 600, 390];
        // the REC dot goes out
        if (t > end('camera') + 0.35) op(conf.rec.firstChild, 0);
      }
    }
    tpCam(world, cam[0], cam[1], cam[2], cam[3], cam[4]);
  };
});
