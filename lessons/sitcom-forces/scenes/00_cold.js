/* Scene 0: Cold open (no chapter card).
   The old flat on moving day: Kavya, annoyed, and the tower of boxes labelled MISC -> the documentary's
   FORCE-CAM switches on and reveals the invisible crew around the sofa -> things move, stop and turn ->
   the foreman, Rex, in a spotlight -> Rex's confessional (resultant force; adds everything up; decides what
   happens; "nothing" = he shrinks to a dot; since the Big Bang, never thanked) -> cutaway: "the sofa moved"
   vs FORCE-CAM: we moved the sofa -> title card with the cast. */
scene('cold', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;

  /* ---------- local helpers ---------- */
  const on = (t, a, b) => (t >= a && t < b ? 1 : 0);          // hard sitcom cut
  const camBg = (el, k, cx, cy) => el.setAttribute('transform', `translate(${cx.toFixed(1)} ${cy.toFixed(1)}) scale(${k.toFixed(4)}) translate(${(-cx).toFixed(1)} ${(-cy).toFixed(1)})`);
  const popIn = (el, t, t0, x, y, s, r) => { const p = P(t, t0, 0.45, pop); op(el, clamp(p * 2.5)); tr(el, x, y, Math.max(0.01, (s || 1) * (0.6 + 0.4 * p)), r); };
  const pill = (parent, text, o) => { o = o || {}; return chip(parent, text, { size: o.size || 30, fill: o.fill || 'rgba(10,27,39,0.88)', stroke: o.stroke || C.line, sw: 2, color: o.color || C.ink, weight: o.weight || 700 }); };

  const Lbg = G(root), Lmid = G(root), Lcast = G(root), Lfg = G(root), Lhud = G(root);

  /* ================= A: the old flat, Kavya and the boxes ================= */
  const flatShot = G(Lbg);
  const flatWrap = G(flatShot);
  const flat = ppFlat(flatWrap);
  // the tower of boxes (in the flat, so the camera moves it with the room)
  const stack = G(flatWrap);
  const BOXES = [[400, 560, 'MISC'], [580, 560, 'MISC'], [760, 560, 'SHOES'], [490, 420, 'MISC'], [670, 420, 'MISC'], [580, 280, 'MISC']];
  const flatDoor = ppDoor(flatWrap); tr(flatDoor, 138, 520, 0.82);
  BOXES.forEach(([x, y, l]) => tr(ppBox(stack, l, { size: 34 }), x, y));
  const cKav = pill(Lfg, 'Kavya, age 12', { size: 34 });
  const cDay = chip(Lfg, 'MOVING DAY', { size: 44, fill: '#E8424F', color: '#FFFFFF', stroke: '#FFFFFF', sw: 4 });
  const countC = G(Lfg);
  E('rect', { x: -250, y: -62, width: 500, height: 124, rx: 16, fill: '#FFF6D6', stroke: '#E0C878', 'stroke-width': 4 }, countC);
  T(countC, 0, -10, '47 boxes', { size: 40, weight: 800, anchor: 'middle', fill: SC_INK });
  T(countC, 0, 38, '46 of them say “MISC”', { size: 32, weight: 700, anchor: 'middle', fill: '#C62828', font: FB });
  const ltKavya = scLowerThird(Lhud, 'KAVYA, 12', 'Moving house. Not thrilled.');

  /* ================= B: FORCE-CAM, the crew around the sofa ================= */
  const roomShot = G(Lbg);
  const room = ppFlat(roomShot);
  const roomBoxes = G(roomShot);
  [[150, 650, 'MISC'], [1060, 650, 'MISC'], [1060, 520, 'MISC']].forEach(([x, y, l]) => tr(ppBox(roomBoxes, l, { size: 30 }), x, y, 0.8));
  const fallBox = ppBox(roomShot, 'MISC', { size: 30 });
  const roomDoor = ppDoor(roomShot); tr(roomDoor, 138, 520, 0.82);
  const sofa = ppSofa(roomShot);
  // hanging plant on Tess (ceiling hook at x 640)
  const rope = E('line', { x1: 860, y1: 0, x2: 860, y2: 92, stroke: '#7A6A55', 'stroke-width': 4 }, Lmid);
  const plant = G(Lmid);
  E('path', { d: 'M-34,0 L-26,46 L26,46 L34,0 Z', fill: '#C2643A', stroke: '#7E3A1E', 'stroke-width': 3 }, plant);
  for (let k = 0; k < 6; k++) E('ellipse', { cx: -24 + k * 10, cy: -6 + (k % 2) * 8, rx: 9, ry: 24, fill: k % 2 ? '#3FA463' : '#2C8C4C', transform: `rotate(${-50 + k * 20} ${-24 + k * 10} 0)` }, plant);
  E('path', { d: 'M-30,0 L0,-30 L30,0', fill: 'none', stroke: '#7A6A55', 'stroke-width': 3 }, plant);
  const fcam = G(Lhud);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#19E68C', opacity: 0.1 }, fcam);
  let scan = ''; for (let y = 3; y < 750; y += 7) scan += `M0,${y} L1200,${y} `;
  E('path', { d: scan, stroke: '#0A2A1A', 'stroke-width': 2, opacity: 0.18 }, fcam);
  E('path', { d: 'M40,150 L40,40 L150,40 M1050,40 L1160,40 L1160,150 M1160,600 L1160,710 L1050,710 M150,710 L40,710 L40,600', fill: 'none', stroke: '#7CFFC0', 'stroke-width': 5 }, fcam);
  E('rect', { x: 900, y: 58, width: 250, height: 56, rx: 12, fill: 'rgba(6,24,16,0.85)' }, fcam);
  const fcDot = E('circle', { cx: 926, cy: 86, r: 10, fill: '#FF3B3B' }, fcam);
  T(fcam, 946, 98, 'FORCE-CAM', { size: 34, weight: 800, fill: '#7CFFC0' });
  const crewLbl = pill(Lfg, 'the invisible crew', { size: 34, color: '#7CFFC0', stroke: '#7CFFC0' });
  const verbs = ['moves', 'stops', 'turns'].map(v => pill(Lfg, v, { size: 34, color: C.energy, stroke: C.energy }));
  const spot = E('ellipse', { cx: 0, cy: 0, rx: 190, ry: 230, fill: glow('#FFF3B0'), opacity: 0.9 }, Lmid);
  const foreC = pill(Lfg, 'the foreman', { size: 36, color: ppCol.resultant, stroke: ppCol.resultant });

  /* ================= C: Rex's confessional ================= */
  const conf = ppConf(Lbg, 'rex');
  const ltRex = scLowerThird(Lhud, 'REX', 'Resultant force. Foreman.');
  const kw = G(Lfg);
  const kwChip = chip(kw, 'RESULTANT FORCE', { size: 48, fill: ppCol.resultant, color: '#0B2A18', stroke: '#D7FBE4', sw: 4 });
  T(kw, 0, 78, 'all the forces, added up', { size: 30, weight: 600, anchor: 'middle', fill: '#C9F5DA', font: FB });
  // the sum card: push 300 N right + friction 200 N left = resultant 100 N right
  const sum = G(Lfg);
  card(sum, -225, -190, 450, 400, { fill: 'rgba(10,27,39,0.9)', stroke: C.line });
  const fPush = ppForce(sum, { color: ppCol.push, dir: 'right', label: '300 N' }); tr(fPush, -150, -110);
  const fFric = ppForce(sum, { color: ppCol.friction, dir: 'left', label: '200 N', side: 'below' }); tr(fFric, 50, -10);
  const eqLine = E('line', { x1: -200, x2: 200, y1: 50, y2: 50, stroke: C.ink, 'stroke-width': 4 }, sum);
  const fRes = ppForce(sum, { color: ppCol.resultant, dir: 'right', label: '100 N' }); tr(fRes, -100, 140);
  const sumTxt = T(sum, -150, 156, '=', { size: 44, weight: 800, fill: C.ink });
  // decide: four outcomes
  const outs = G(Lfg);
  const OUT = [['speed up', -120, -70], ['slow down', 120, -70], ['turn', -120, 30], ['nothing', 120, 30]].map(([s, x, y]) => {
    const c = pill(outs, s, { size: 34 }); return { c, x, y, s };
  });
  const zzz = T(Lfg, 0, 0, 'z z z', { size: 40, weight: 800, fill: '#C9F5DA', anchor: 'middle' });
  const zeroC = pill(Lfg, 'resultant = 0', { size: 34, color: ppCol.resultant, stroke: ppCol.resultant });
  // since the Big Bang
  const bang = G(Lfg);
  card(bang, -230, -170, 460, 340, { fill: '#100A1E', stroke: '#5B4A86' });
  let star = ''; for (let i = 0; i < 18; i++) { const a = i / 18 * TAU, rr = i % 2 ? 40 : 84; star += (i ? 'L' : 'M') + (Math.cos(a) * rr).toFixed(1) + ',' + (Math.sin(a) * rr).toFixed(1); }
  const burst = E('path', { d: star + 'Z', fill: '#FFB347', stroke: '#FFE45C', 'stroke-width': 4 }, bang);
  E('circle', { cx: 0, cy: -40, r: 40, fill: '#FFF3B0' }, bang);
  T(bang, 0, -30, 'BANG', { size: 34, weight: 800, anchor: 'middle', fill: '#C2453A' });
  T(bang, 0, 128, 'Thank-yous received: 0', { size: 30, weight: 700, anchor: 'middle', fill: '#FFE6B0', font: FB });

  /* ================= D: "the sofa moved" cutaway (reuses the room) ================= */
  const bubble = G(Lfg);
  E('path', { d: 'M-230,-60 L230,-60 Q250,-60 250,-40 L250,40 Q250,60 230,60 L-120,60 L-160,104 L-150,60 L-230,60 Q-250,60 -250,40 L-250,-40 Q-250,-60 -230,-60 Z', fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 4 }, bubble);
  T(bubble, 0, 14, '“The sofa moved!”', { size: 40, weight: 800, anchor: 'middle', fill: SC_INK });
  const weMoved = chip(Lfg, 'WE moved the sofa.', { size: 44, fill: ppCol.resultant, color: '#0B2A18', stroke: '#FFFFFF', sw: 4 });

  /* ================= E: title card ================= */
  const titleShot = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#14233A', '#3A1F33', true) }, titleShot);
  let rays = '';
  for (let i = 0; i < 16; i++) { const a0 = i / 16 * TAU, a1 = a0 + TAU / 40; rays += `M0,0 L${(Math.cos(a0) * 1100).toFixed(0)},${(Math.sin(a0) * 1100).toFixed(0)} L${(Math.cos(a1) * 1100).toFixed(0)},${(Math.sin(a1) * 1100).toFixed(0)} Z `; }
  const rayP = E('path', { d: rays, fill: '#FFE45C', opacity: 0.06 }, titleShot);
  E('ellipse', { cx: 600, cy: 590, rx: 600, ry: 180, fill: glow('#FF9F7A'), opacity: 0.3 }, titleShot);
  const logo = ppLogo(Lfg);
  const epi = T(Lfg, 600, 330, 'Episode 13: Moving Day', { size: 42, weight: 700, anchor: 'middle', fill: '#FFFFFF' });

  /* ================= the cast ================= */
  const kav = cast(Lcast, 'kavya', { mood: 'annoyed' });
  const rex = cast(Lcast, 'rex', { mood: 'deadpan' });
  const crew = {
    pushpa: cast(Lcast, 'pushpa'), frieda: cast(Lcast, 'frieda'), graham: cast(Lcast, 'graham'),
    norm: cast(Lcast, 'norm'), tess: cast(Lcast, 'tess'), piv: cast(Lcast, 'piv'),
  };
  const ROW = ['rex', 'pushpa', 'frieda', 'graham', 'norm', 'tess', 'piv', 'kavya'];
  const ROWX = k => 110 + ROW.indexOf(k) * 140;

  const blackout = E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#000000' }, Lhud);

  /* cut points */
  const cA2 = at('boxes') - 0.1, cB = at('small') - 0.06, cC = at('hi') - 0.06, cD = at('sofa') - 0.06, cE = at('title') - 0.06;
  const camOn = mid('small', 0.32);            // FORCE-CAM switches on
  const tFore = mid('every', 0.72);            // "This is the foreman."

  return t => {
    op(blackout, 1 - P(t, 0, 0.6, linear));
    const sA = on(t, -1, cB), sB = on(t, cB, cC), sC = on(t, cC, cD), sD = on(t, cD, cE), sE = on(t, cE, 1e9);
    const shown = {};

    /* ---------- A: Kavya and the boxes ---------- */
    op(flatShot, sA);
    if (sA) {
      flat.upd(t);
      const tight = t >= cA2;
      const push = tight ? P(t, cA2, end('boxes') + 0.6 - cA2, linear) : P(t, 0, at('boxes'), linear);
      camBg(flatWrap, tight ? 1.22 + 0.05 * push : 1 + 0.03 * push, tight ? 560 : 600, 420);
      shown.kav = 1; op(kav, 1);
      tr(kav, tight ? 960 : 930, tight ? 560 : 570, (tight ? 1.55 : 1.4) * (1 + 0.03 * push));
      const lookUp = tight && t > mid('boxes', 0.2) && t < mid('boxes', 0.7) ? -0.8 : 0;
      kav.set({ t, talk: scTalk(S, t, 'kavya'), mood: t > mid('boxes', 0.72) ? 'deadpan' : 'annoyed', look: lookUp });
      op(cKav, tight ? 0 : 1); op(cDay, tight ? 0 : 1);
      if (!tight) { popIn(cKav, t, mid('kavya', 0.05), 300, 200); popIn(cDay, t, mid('kavya', 0.45), 300, 290, 1, -4); }
      const cp = tight ? P(t, mid('boxes', 0.3), 0.45, pop) : 0;
      op(countC, clamp(cp * 2.5)); tr(countC, 330, 190, Math.max(0.01, 0.7 + 0.3 * cp), -2);
      ltKavya.set(tight ? win(t, at('boxes') + 0.1, at('boxes') + 3.4, 0.3) : 0);
    } else { op(cKav, 0); op(cDay, 0); op(countC, 0); ltKavya.set(0); }

    /* ---------- B: FORCE-CAM reveal (small, every) and D: the sofa cutaway ---------- */
    const roomOn = sB || sD;
    op(roomShot, roomOn); op(Lmid, roomOn);
    const fcOn = sB ? (t >= camOn ? 1 : 0) : sD ? (t >= mid('sofa', 0.42) ? 1 : 0) : 0;
    op(fcam, fcOn * (sB && t < camOn + 0.12 ? (Math.floor(t * 30) % 2) : 1));
    if (fcOn) op(fcDot, Math.sin(t * TAU * 0.8) > 0 ? 1 : 0.2);
    if (roomOn) {
      room.upd(t);
      // the sofa: nudged on "moves" (B) or sliding on "the sofa moved" (D)
      let sx = 600;
      if (sB) sx = 600 + 26 * ease(P(t, mid('every', 0.08), 0.5, linear));
      if (sD) sx = 626 + 70 * P(t, at('sofa') + 0.1, 1.6, ease);
      tr(sofa, sx, 610);
      // the box that topples off the stack, drops and stops ("stops")
      const fb = sB ? clamp((t - mid('every', 0.26)) / 0.5) : 1;
      tr(fallBox, lerp(1100, 1010, fb), lerp(408, 690, fb * fb), 0.8, lerp(16, -4, fb));
      // the door turning on its hinges ("turns")
      roomDoor.set(sB ? 0.75 * Math.sin(clamp((t - mid('every', 0.48)) / 0.9) * Math.PI) : 0);
      const fOn = fcOn;
      // crew placement (FORCE-CAM only)
      const crewIn = k => sB ? P(t, camOn + 0.15 + k * 0.16, 0.4, pop) : (sD && fcOn ? 1 : 0);
      const pushing = sB ? t > mid('every', 0.02) && t < mid('every', 0.3) : true;
      // Pushpa pushing the sofa's left arm
      const pp = crewIn(0); if (fOn && pp > 0.01) { shown.pushpa = 1; op(crew.pushpa, clamp(pp * 3)); tr(crew.pushpa, sx - 284, 520, 0.64 * Math.max(0.01, pp)); crew.pushpa.set({ t, arms: 'push', mood: sD ? 'smug' : pushing ? 'happy' : 'neutral', look: sB && t > tFore ? 0.4 : 0.6 }); }
      // Frieda at the floor under the right end, objecting
      const pf = crewIn(1); if (fOn && pf > 0.01) { shown.frieda = 1; op(crew.frieda, clamp(pf * 3)); tr(crew.frieda, sx + 258, 572, 0.56 * Math.max(0.01, pf)); crew.frieda.set({ t, mood: 'annoyed', look: -0.6 }); }
      // Graham clinging to the seat (pulling it down)
      const pg = crewIn(2); if (fOn && pg > 0.01) { shown.graham = 1; op(crew.graham, clamp(pg * 3)); tr(crew.graham, sx + 40, 482, 0.52 * Math.max(0.01, pg)); crew.graham.set({ t, hug: 1, mood: 'happy', look: sB && t > tFore ? 0.2 : -0.3 }); }
      // Norm under the floor line, palms up under the sofa
      const pn = crewIn(3); if (fOn && pn > 0.01) { shown.norm = 1; op(crew.norm, clamp(pn * 3)); tr(crew.norm, sx, 676, 0.56 * Math.max(0.01, pn)); crew.norm.set({ t, mood: 'sad', look: 0 }); }
      // Tess holding up the hanging plant from the ceiling
      const pt = crewIn(4), tessS = 0.45;
      if (fOn && pt > 0.01) {
        shown.tess = 1; op(crew.tess, clamp(pt * 3)); tr(crew.tess, 860, 92 + 136 * tessS, tessS * Math.max(0.01, pt));
        const strch = 0.35 + 0.05 * Math.sin(t * 2.2) * AMP;
        crew.tess.set({ t, stretch: strch, mood: 'shock', sweat: 1, still: true });
        attr(rope, 'y2', 92); tr(plant, 860, 92 + 136 * tessS + crew.tess.hookY(strch) * tessS + 24);
        op(rope, 1); op(plant, 1);
      } else { op(rope, 1); attr(rope, 'y2', 230); tr(plant, 860, 258); op(plant, 1); }
      // Piv at the door hinge
      const pv = crewIn(5); if (fOn && pv > 0.01) { shown.piv = 1; op(crew.piv, clamp(pv * 3)); const turn = sB ? Math.sin(clamp((t - mid('every', 0.5)) / 0.6) * Math.PI) * 14 * AMP : 0; tr(crew.piv, 150, 474, 0.5 * Math.max(0.01, pv), turn); crew.piv.set({ t, mood: 'neutral', look: 0.5 }); }
      op(crewLbl, sB ? win(t, camOn + 0.5, at('every') + 0.2, 0.25) : 0); tr(crewLbl, 300, 190);
      // "moves / stops / turns" beats
      [[mid('every', 0.04), 420, 380], [mid('every', 0.26), 860, 470], [mid('every', 0.48), 390, 250]].forEach(([t0, x, y], i) => {
        const p = sB ? P(t, t0, 0.35, pop) * (1 - P(t, tFore - 0.2, 0.2, linear)) : 0;
        op(verbs[i], clamp(p * 2.5)); tr(verbs[i], x, y, Math.max(0.01, 0.7 + 0.3 * p));
      });
      // the foreman in the spotlight
      const fp = sB ? P(t, tFore, 0.5, pop) : 0;
      op(spot, sB ? clamp(fp * 2) * 0.85 : 0); tr(spot, 600, 240);
      if (sB && fp > 0.01) {
        shown.rex = 1; op(rex, clamp(fp * 3)); tr(rex, 600, 250 + 40 * (1 - clamp(fp)), 0.8 * Math.max(0.01, fp));
        rex.set({ t, mood: 'deadpan', look: 0 });
      }
      op(foreC, sB ? P(t, tFore + 0.4, 0.3, linear) : 0); tr(foreC, 600, 385);
      // D: speech bubble, then WE moved the sofa; Rex small in the corner
      op(bubble, sD ? win(t, at('sofa') + 0.15, mid('sofa', 0.45), 0.2) : 0); tr(bubble, 470, 230);
      const wp = sD ? P(t, mid('sofa', 0.62), 0.4, pop) : 0;
      op(weMoved, clamp(wp * 2.5)); tr(weMoved, 520, 250, Math.max(0.01, 0.7 + 0.3 * wp), -3);
      if (sD) {
        shown.rex = 1; op(rex, 1); tr(rex, 1010, 250, 0.62);
        rex.set({ t, talk: scTalk(S, t, 'rex'), mood: t < mid('sofa', 0.45) ? 'annoyed' : 'smug', look: -0.7 });
      }
    } else { op(crewLbl, 0); verbs.forEach(v => op(v, 0)); op(spot, 0); op(foreC, 0); op(bubble, 0); op(weMoved, 0); }

    /* ---------- C: Rex's confessional ---------- */
    conf.set(sC, t);
    if (sC) {
      const push = P(t, cC, cD - cC, linear);
      camBg(conf, 1 + 0.05 * push, 430, 380);
      shown.rex = 1; op(rex, 1);
      // "nothing": Rex shrinks to a dot; "since": back to an arrow
      const shrink = P(t, at('nothing') - 0.15, 0.5, ease) * (1 - P(t, at('since') - 0.05, 0.45, pop));
      const len = Math.max(0, 1 - 1.02 * shrink);
      tr(rex, 360 - 20 * shrink, 400, 1.45 * (1 + 0.12 * push));
      let mood = 'deadpan', look = 0;
      if (t < at('job')) mood = t < mid('hi', 0.55) ? 'neutral' : 'smug';
      else if (t < at('decide')) { mood = 'annoyed'; look = t > mid('job', 0.5) ? 0.6 : 0; }
      else if (t < at('nothing')) { mood = 'neutral'; look = 0.6; }
      else if (t < at('since') - 0.05) mood = t < end('nothing') ? 'happy' : 'smug';
      else mood = t < mid('since', 0.6) ? 'deadpan' : 'sad';
      rex.set({ t, talk: scTalk(S, t, 'rex'), mood, look, len });
      ltRex.set(win(t, at('hi') + 0.1, at('hi') + 3.4, 0.3));
      const kp = P(t, mid('hi', 0.4), 0.45, pop) * (1 - P(t, at('job') + 0.1, 0.2, linear));
      op(kw, clamp(kp * 2.5)); tr(kw, 890, 320, Math.max(0.01, 0.8 + 0.2 * kp));
      // sum
      const sp = win(t, at('job'), at('decide') + 0.1, 0.25);
      op(sum, sp); tr(sum, 905, 330);
      if (sp) {
        fPush.set(300 * ease(P(t, at('job') + 0.2, 0.5, linear)));
        fFric.set(200 * ease(P(t, mid('job', 0.22), 0.5, linear)));
        const rp = ease(P(t, mid('job', 0.62), 0.5, linear));
        op(eqLine, rp); op(sumTxt, rp); fRes.set(100 * rp);
      }
      // outcomes
      const op_ = win(t, at('decide') + 0.05, at('since') - 0.1, 0.25);
      op(outs, op_); tr(outs, 905, 330);
      OUT.forEach((o, i) => {
        const p = P(t, at('decide') + 0.2 + i * 0.5, 0.35, pop);
        const nothingHi = o.s === 'nothing' && t >= at('nothing') - 0.15;
        const dim = t >= at('nothing') - 0.15 && o.s !== 'nothing' ? 0.25 : 1;
        o.c.box.setAttribute('stroke', nothingHi ? ppCol.resultant : C.line); o.c.box.setAttribute('stroke-width', nothingHi ? 5 : 2);
        op(o.c, clamp(p * 2.5) * dim); tr(o.c, o.x, o.y, Math.max(0.01, (0.7 + 0.3 * p) * (nothingHi ? 1.15 : 1)));
      });
      const zp = win(t, mid('nothing', 0.4), at('since') - 0.1, 0.25);
      op(zzz, zp); tr(zzz, 400 + 8 * Math.sin(t * 2), 230 - 10 * ((t * 0.8) % 1));
      op(zeroC, zp); tr(zeroC, 905, 500);
      const bp = P(t, mid('since', 0.3), 0.45, pop);
      op(bang, clamp(bp * 2.5) * (1 - P(t, cD - 0.2, 0.15, linear))); tr(bang, 900, 330, Math.max(0.01, 0.7 + 0.3 * bp), 2);
      burst.setAttribute('transform', `translate(0 -40) rotate(${((t * 10 * AMP) % 360).toFixed(1)}) scale(${(1 + 0.04 * Math.sin(t * 5) * AMP).toFixed(3)})`);
    } else { ltRex.set(0); op(kw, 0); op(sum, 0); op(outs, 0); op(zzz, 0); op(zeroC, 0); op(bang, 0); }

    /* ---------- E: title card ---------- */
    op(titleShot, sE); op(epi, 0);
    if (sE) {
      tr(rayP, 600, 590, 1, (t * 6 * AMP) % 360);
      logo.set(P(t, at('title') + 0.05, 0.7, linear)); tr(logo, 600, 205);
      op(epi, P(t, mid('title', 0.45), 0.4, linear));
      ROW.forEach((k, i) => {
        const p = P(t, mid('title', 0.5) + i * 0.12, 0.45, pop), c = k === 'rex' ? rex : k === 'kavya' ? kav : crew[k];
        shown[k] = 1; op(c, clamp(p * 3));
        const s = (k === 'kavya' ? 0.5 : k === 'piv' ? 0.6 : k === 'rex' ? 0.5 : 0.55) * Math.max(0.01, p);
        tr(c, ROWX(k) + (k === 'rex' ? -16 : 0), (k === 'kavya' ? 600 : 560) + 30 * (1 - clamp(p)), s);
        c.set({ t, mood: { rex: 'deadpan', pushpa: 'happy', frieda: 'annoyed', graham: 'happy', norm: 'sad', tess: 'shock', piv: 'neutral', kavya: 'annoyed' }[k], arms: 'up', len: 0.55 });
      });
    } else logo.set(0);

    ['pushpa', 'frieda', 'graham', 'norm', 'tess', 'piv'].forEach(k => { if (!shown[k]) op(crew[k], 0); });
    if (!shown.rex) op(rex, 0);
    if (!shown.kav && !shown.kavya) op(kav, 0);
  };
});
