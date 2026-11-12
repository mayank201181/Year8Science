/* Scene 2: The sofa will not move.  Arrow scale: 1 px per newton.
   Shots (hard sitcom cuts): the old flat, 9:00, Kavya pushing the sofa -> FORCE-CAM: Pushpa pushes 100 N,
   Frieda (friction) answers 100 N back, "Objection." -> Kavya cut-in: it won't move -> balanced: equal and
   opposite, Rex is a dot (resultant 0) on his break in a deckchair -> zoom: Graham (weight) down, Norm (normal
   force) up, same size -> Norm, unthanked, push-in -> Dad joins: 300 N; Frieda maxes out at 200 N; freeze-frame
   while Rex subtracts: 100 N forwards, he's up -> unbalanced: the sofa speeds up -> the corridor, a trolley at
   steady speed -> Pushpa pushes harder (it speeds up) -> Rex: "No." -> push = friction on the wheels: balanced,
   steady speed in a straight line -> three panels: a resultant force only CHANGES motion. */
scene('sofa', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;
  const K = SC_INK;

  /* ---------- local helpers (prefixed sof) ---------- */
  const sofFocus = (el, k, fx, fy, sx, sy) => el.setAttribute('transform', `translate(${(sx - k * fx).toFixed(1)} ${(sy - k * fy).toFixed(1)}) scale(${k.toFixed(4)})`);
  const sofPill = (parent, text, o) => { o = o || {}; return chip(parent, text, { size: o.size || 30, fill: o.fill || 'rgba(10,27,39,0.9)', stroke: o.stroke || C.line, sw: o.sw || 2, color: o.color || C.ink, weight: o.weight || 700 }); };
  const sofKey = (parent, text, col, ink, size) => chip(parent, text, { size: size || 44, fill: col, color: ink || '#1A1020', stroke: '#FFFFFF', sw: 4, weight: 800 });
  const sofShow = (el, t, t0, x, y, r) => { const p = P(t, t0, 0.4, pop); op(el, clamp(p * 2.5)); tr(el, x, y, Math.max(0.01, 0.7 + 0.3 * p), r); };
  function sofForceCam(parent) {
    const g = G(parent);
    E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#19E68C', opacity: 0.1 }, g);
    let scan = ''; for (let y = 3; y < 750; y += 7) scan += `M0,${y} L1200,${y} `;
    E('path', { d: scan, stroke: '#0A2A1A', 'stroke-width': 2, opacity: 0.18 }, g);
    E('path', { d: 'M40,150 L40,40 L150,40 M1050,40 L1160,40 L1160,150 M1160,600 L1160,710 L1050,710 M150,710 L40,710 L40,600', fill: 'none', stroke: '#7CFFC0', 'stroke-width': 5 }, g);
    E('rect', { x: 900, y: 58, width: 250, height: 56, rx: 12, fill: 'rgba(6,24,16,0.85)' }, g);
    const dot = E('circle', { cx: 926, cy: 86, r: 10, fill: '#FF3B3B' }, g);
    T(g, 946, 98, 'FORCE-CAM', { size: 34, weight: 800, fill: '#7CFFC0' });
    g.set = (v, t) => { op(g, v); if (v) op(dot, Math.sin(t * TAU * 0.8) > 0 ? 1 : 0.2); };
    return g;
  }
  // a speedometer: g.set(v in m/s)
  function sofGauge(parent) {
    const g = G(parent);
    E('rect', { x: -120, y: -96, width: 240, height: 168, rx: 18, fill: 'rgba(10,27,39,0.92)', stroke: C.line, 'stroke-width': 2 }, g);
    E('path', { d: 'M-80,20 A80,80 0 0 1 80,20', fill: 'none', stroke: '#2C5468', 'stroke-width': 14, 'stroke-linecap': 'round' }, g);
    const arc = E('path', { d: '', fill: 'none', stroke: ppCol.resultant, 'stroke-width': 14, 'stroke-linecap': 'round' }, g);
    const needle = E('path', { d: 'M0,0 L0,-70', stroke: '#FFFFFF', 'stroke-width': 6, 'stroke-linecap': 'round' }, g);
    E('circle', { cx: 0, cy: 20, r: 9, fill: '#FFFFFF' }, g);
    const val = T(g, 0, 60, '', { size: 34, weight: 800, anchor: 'middle', fill: C.ink });
    T(g, 0, -64, 'speed', { size: 26, weight: 700, anchor: 'middle', fill: C.muted, font: FB });
    g.set = v => {
      const f = clamp(v / 2), a = Math.PI * (1 - f);   // 0..2 m/s across the dial
      tr(needle, 0, 20, 1, (-90 + 180 * f));
      const ex = 80 * Math.cos(a), ey = 20 - 80 * Math.sin(a);
      attr(arc, 'd', f > 0.01 ? `M-80,20 A80,80 0 0 1 ${ex.toFixed(1)},${ey.toFixed(1)}` : '');
      setText(val, v.toFixed(1) + ' m/s');
    };
    g.set(0);
    return g;
  }
  // a mini Rex for the diagram panels: a green resultant arrow with his face and hard hat at its tail
  function sofMini(parent, dir) {
    const g = G(parent);
    const ar = ppForce(g, { color: ppCol.resultant, dir, label: '', width: 26 });
    E('circle', { r: 30, fill: ball(ppCol.resultant, ppCol.resultantDk), stroke: K, 'stroke-width': 4 }, g);
    E('path', { d: 'M-25,-22 Q-25,-56 0,-56 Q25,-56 25,-22 Z', fill: ppCol.hat, stroke: K, 'stroke-width': 3 }, g);
    E('rect', { x: -34, y: -26, width: 68, height: 9, rx: 4, fill: ppCol.hat, stroke: K, 'stroke-width': 3 }, g);
    [-11, 11].forEach(x => { E('circle', { cx: x, cy: -2, r: 8, fill: '#FFFFFF', stroke: K, 'stroke-width': 2 }, g); E('circle', { cx: x, cy: -2, r: 4, fill: K }, g); });
    const m = E('ellipse', { cx: 0, cy: 15, rx: 9, ry: 2, fill: '#5A1E2A', stroke: K, 'stroke-width': 2 }, g);
    g.set = (len, talk) => { ar.set(len); attr(m, 'ry', 2 + 7 * talk); };
    return g;
  }

  /* ---------- layers ---------- */
  const cam = G(root);
  const flatW = G(cam), corrW = G(cam), conf = ppConf(cam, 'rex'), Lprop = G(cam), Lcast = G(cam), Lfg = G(cam);
  const Lbust = G(root), Lpan = G(root), Lscr = G(root), Lhud = G(root);

  /* ================= the old flat (daylight) ================= */
  const flat = ppFlat(flatW);
  const clockG = G(flatW); tr(clockG, 640, 130);
  E('circle', { r: 44, fill: '#F4F1EA', stroke: K, 'stroke-width': 5 }, clockG);
  E('path', { d: 'M0,-36 L0,-30 M36,0 L30,0 M0,36 L0,30 M-36,0 L-30,0', stroke: K, 'stroke-width': 4 }, clockG);
  E('path', { d: 'M0,0 L0,-30 M0,0 L-22,0', stroke: K, 'stroke-width': 5, 'stroke-linecap': 'round' }, clockG);   // 9:00
  const sofa = ppSofa(flatW);
  const dust = [0, 1, 2].map(() => E('circle', { r: 10, fill: '#E9DCC4' }, flatW));
  // Rex's deckchair and ON BREAK sign (they ride on the sofa)
  const chair = G(flatW);
  E('path', { d: 'M-34,26 L18,-30 M30,26 L-6,-10', stroke: '#8C6235', 'stroke-width': 6, 'stroke-linecap': 'round' }, chair);
  E('path', { d: 'M-28,-4 Q-2,24 24,-34 L34,-26 Q8,34 -30,8 Z', fill: '#FF7A59', stroke: K, 'stroke-width': 3 }, chair);
  E('path', { d: 'M-20,6 Q0,22 22,-22', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 5, opacity: 0.8 }, chair);
  const sign = G(flatW);
  E('line', { x1: 0, y1: 0, x2: 0, y2: 70, stroke: '#8C6235', 'stroke-width': 6 }, sign);
  E('rect', { x: -78, y: -26, width: 156, height: 48, rx: 8, fill: '#FFE45C', stroke: K, 'stroke-width': 3 }, sign);
  T(sign, 0, 9, 'ON BREAK', { size: 28, weight: 800, anchor: 'middle', fill: '#C62828' });
  // forces on the sofa (1 px per newton)
  const fPush = ppForce(flatW, { color: ppCol.push, dir: 'right', label: '100 N', side: 'below' });
  const fFric = ppForce(flatW, { color: ppCol.friction, dir: 'left', label: '100 N', side: 'below' });
  const fW = ppForce(Lfg, { color: ppCol.weight, dir: 'down', label: 'weight', side: 'right' });
  const fN = ppForce(Lfg, { color: ppCol.normal, dir: 'up', label: 'normal force', side: 'right' });

  /* ================= the corridor ================= */
  const corr = ppCorridor(corrW);
  const trolley = ppTrolley(corrW);
  const sofa2 = ppSofa(corrW);
  const tPushA = ppForce(Lfg, { color: ppCol.push, dir: 'right', label: '80 N' });
  const tFricA = ppForce(Lfg, { color: ppCol.friction, dir: 'left', label: '80 N', side: 'below' });

  /* ================= the humans ================= */
  const dad = person(Lprop, { skin: '#A86B45', shirt: '#8E99A4', shorts: '#2E3B4E', hair: '#1E1410', shoes: '#2B2B2B' });
  const kav = scKavyaBody(Lprop);
  const bust = scKavya(Lbust, { mood: 'annoyed' });

  /* ================= the crew ================= */
  const rex = cast(Lcast, 'rex');
  const cr = { pushpa: cast(Lcast, 'pushpa'), frieda: cast(Lcast, 'frieda'), graham: cast(Lcast, 'graham'), norm: cast(Lcast, 'norm') };
  const MOOD = { pushpa: 'happy', frieda: 'annoyed', graham: 'happy', norm: 'sad' };

  /* ================= diagram panels ("change") ================= */
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#0F2C3A', '#14394A', true) }, Lpan);
  const PAN = [['speeds up', 210], ['slows down', 600], ['turns', 990]].map(([title, cx], i) => {
    const g = G(Lpan);
    card(g, cx - 180, 140, 360, 420, { fill: '#143646', stroke: C.line, sw: 3 });
    T(g, cx, 196, title, { size: 38, weight: 800, anchor: 'middle', fill: C.ink });
    E('rect', { x: cx - 45, y: 375, width: 90, height: 70, rx: 6, fill: '#C99A5E', stroke: '#8C6235', 'stroke-width': 4 }, g);
    return { g, cx };
  });
  // speeds up: 120 N push, 60 N friction; slows down: 40 N push, 100 N friction; turns: 80 N push from the side
  const pA = [
    [ppForce(PAN[0].g, { color: ppCol.push, dir: 'right', label: '120 N' }), 210 - 45 - 120, 400, 120],
    [ppForce(PAN[0].g, { color: ppCol.friction, dir: 'left', label: '60 N', side: 'below' }), 210 + 45, 456, 60],
    [ppForce(PAN[1].g, { color: ppCol.push, dir: 'right', label: '40 N' }), 600 - 45 - 40, 400, 40],
    [ppForce(PAN[1].g, { color: ppCol.friction, dir: 'left', label: '100 N', side: 'below' }), 600 + 45, 456, 100],
    [ppForce(PAN[2].g, { color: ppCol.push, dir: 'up', label: '80 N', side: 'right' }), 990, 525, 80],
  ];
  const motion = E('path', { d: 'M1036,410 L1090,410', fill: 'none', stroke: '#9AA6B2', 'stroke-width': 5, 'stroke-dasharray': '9 7' }, PAN[2].g);
  const turnPath = E('path', { d: 'M1036,380 Q1110,370 1130,290', fill: 'none', stroke: C.energy, 'stroke-width': 5, 'stroke-dasharray': '10 8', 'stroke-linecap': 'round' }, PAN[2].g);
  const minis = [sofMini(PAN[0].g, 'right'), sofMini(PAN[1].g, 'left'), sofMini(PAN[2].g, 'up')];
  const MINI = [[150, 300, 90], [660, 300, 90], [880, 420, 110]];
  const cChange = sofKey(Lpan, 'resultant force = CHANGE in motion', ppCol.resultant, '#0B2A18', 40);

  /* ================= screen chips and cards ================= */
  const c900 = sofPill(Lscr, '9:00 AM', { size: 34, color: '#FFE6B0', stroke: '#FFE6B0' });
  const cObj = sofPill(Lscr, '“Objection.”', { size: 34, fill: '#FFFFFF', color: K, stroke: K, sw: 3 });
  const tweet = G(Lscr);
  E('path', { d: 'M-50,-30 L-80,-50 M-40,-46 L-50,-82 M-58,-8 L-96,-10', stroke: '#FFFFFF', 'stroke-width': 5, 'stroke-linecap': 'round' }, tweet);
  T(tweet, 10, 0, 'TWEET!', { size: 36, weight: 800, anchor: 'middle', fill: '#FFE45C' });
  const cMoved = sofPill(Lscr, 'sofa moved: 0 cm', { size: 34 });
  const cBal = sofKey(Lscr, 'BALANCED', '#FFFFFF');
  const cBal2 = sofPill(Lscr, 'equal size, opposite directions', { size: 30 });
  const cZero = sofKey(Lscr, 'resultant force = 0', ppCol.resultant, '#0B2A18', 40);
  const cStill = sofPill(Lscr, 'balanced → a still object stays still', { size: 30 });
  const chirp = T(Lscr, 1080, 640, '…chirp …chirp', { size: 30, weight: 700, anchor: 'end', fill: '#C9F5DA', font: FB });
  const cMax = sofPill(Lscr, 'friction: 200 N max (here)', { size: 32, color: ppCol.friction, stroke: ppCol.friction });
  const paused = G(Lscr);
  E('rect', { x: -110, y: -28, width: 220, height: 56, rx: 12, fill: 'rgba(10,27,39,0.9)', stroke: '#FFFFFF', 'stroke-width': 2 }, paused);
  E('path', { d: 'M-84,-14 L-84,14 M-68,-14 L-68,14', stroke: '#FFFFFF', 'stroke-width': 9 }, paused);
  T(paused, 12, 11, 'PAUSED', { size: 30, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  // the sum card
  const sum = G(Lscr);
  card(sum, -240, -125, 480, 250, { fill: 'rgba(10,27,39,0.94)', stroke: ppCol.resultant, sw: 3 });
  T(sum, 0, -88, '**SUBTRACT** opposite forces', { size: 30, weight: 600, anchor: 'middle', fill: C.ink, boldFill: C.energy });
  const s1 = ppForce(sum, { color: ppCol.push, dir: 'right', label: '' }); tr(s1, -215, -40);
  const s1t = T(sum, 100, -29, '300 N', { size: 30, weight: 800, fill: ppCol.push });
  const s2 = ppForce(sum, { color: ppCol.friction, dir: 'left', label: '' }); tr(s2, 85, 18);
  const s2t = T(sum, 100, 29, '200 N', { size: 30, weight: 800, fill: ppCol.friction });
  const sLine = E('line', { x1: -215, x2: 215, y1: 52, y2: 52, stroke: C.ink, 'stroke-width': 4 }, sum);
  const s3 = ppForce(sum, { color: ppCol.resultant, dir: 'right', label: '' }); tr(s3, -215, 88);
  const s3t = T(sum, -100, 99, '= **100 N** forwards', { size: 30, weight: 600, fill: C.ink, boldFill: ppCol.resultant });
  // unbalanced card
  const unb = G(Lscr);
  card(unb, -235, -100, 470, 200, { fill: 'rgba(10,27,39,0.94)', stroke: C.energy, sw: 3 });
  T(unb, 0, -44, 'UNBALANCED', { size: 44, weight: 800, anchor: 'middle', fill: C.energy });
  const u2 = T(unb, -205, 10, '→ a **resultant force**', { size: 30, weight: 600, fill: C.ink, boldFill: ppCol.resultant });
  const u3 = T(unb, -205, 60, '→ motion changes: **speeds up**', { size: 30, weight: 600, fill: C.ink, boldFill: C.energy });
  const gauge = sofGauge(Lscr);
  const cSteady = sofKey(Lscr, 'balanced → steady speed in a straight line', '#FFFFFF', '#1A1020', 32);

  /* ================= HUD ================= */
  const fcam = sofForceCam(Lhud);

  /* ---------- timing ---------- */
  const cut = id => at(id) - 0.06;
  const SHOTS = [['A', -1e9], ['B', cut('stuck')], ['A', cut('balanced')], ['Cu', cut('up')], ['Ct', cut('thanks')], ['A', cut('dad')],
    ['D', cut('trolley')], ['E', cut('no')], ['D', cut('steady')], ['F', cut('change')]];
  const shotAt = t => { let s = SHOTS[0][0]; for (const [k, t0] of SHOTS) if (t >= t0) s = k; return s; };
  const tGo = at('go') + 0.3;                                  // push and friction grow together (static friction answers)
  const t3 = at('three') + 0.25, tFreeze = t3 + 0.62;          // push 100 -> 300; friction caps at 200; freeze-frame
  const tUp = mid('subtract', 0.72);                           // "That's me. I'm up."
  const tU = at('unbalanced') + 0.1, ACC = 13;                 // the sofa speeds up (px/s^2)
  const SX = t => 640 + (t > tU ? 0.5 * ACC * (t - tU) * (t - tU) : 0);
  const sofV = t => (t > tU ? ACC * (t - tU) : 0);
  // corridor: 1 m = 100 px. 1.0 m/s, then Pushpa pushes harder (60 N extra) until she eases off at "steady"
  const T0 = cut('trolley'), ta = mid('harder', 0.15), tc = at('steady') + 0.5, V0 = 100, V1 = 150;
  const vAt = t => V0 + (V1 - V0) * clamp((t - ta) / (tc - ta));
  const posAt = t => {
    let p = V0 * (t - T0);
    if (t > ta) { const u = Math.min(t, tc) - ta; p += (V1 - V0) * u * u / (2 * (tc - ta)); }
    if (t > tc) p += (V1 - V0) * (t - tc);
    return p;
  };
  const extraPush = t => 60 * P(t, ta, 1.4, ease) * (1 - P(t, at('steady') + 0.1, 0.6, ease));
  const PUSHPOSE = { lean: 18, armL: [82, 6], armR: [76, 10], legL: [-28, -4], legR: [24, -22] };
  const DADPOSE = { lean: 22, armL: [70, 16], armR: [64, 20], legL: [-30, -4], legR: [22, -24] };
  const blendLegs = (pose, w, k) => Object.assign({}, pose, { legL: [lerp(pose.legL[0], w.legL[0], k), lerp(pose.legL[1], w.legL[1], k)], legR: [lerp(pose.legR[0], w.legR[0], k), lerp(pose.legR[1], w.legR[1], k)] });

  return t => {
    const shot = shotAt(t), shown = {};
    const A = shot === 'A', Cu = shot === 'Cu', Ct = shot === 'Ct', Dc = shot === 'D', Ec = shot === 'E', Fc = shot === 'F';
    const inFlat = A || Cu || Ct || shot === 'B';
    op(flatW, inFlat ? 1 : 0); op(corrW, Dc ? 1 : 0); conf.set(Ec ? 1 : 0, t); op(Lpan, Fc ? 1 : 0);
    op(Lbust, shot === 'B' ? 1 : 0);
    // FORCE-CAM
    const flick = t0 => (t >= t0 && t < t0 + 0.14 ? Math.floor(t * 30) % 2 : 1);
    let fc = 0;
    if (A) fc = t >= at('go') ? flick(at('go')) : 0;
    if (Cu || Ct) fc = 1;
    if (Dc) fc = t >= at('harder') - 0.1 ? flick(at('harder') - 0.1) : 0;
    fcam.set(fc, t);
    const put = (k, x, y, s, st) => {
      const c = k === 'rex' ? rex : cr[k]; shown[k] = 1; op(c, 1); tr(c, x, y, s);
      c.set(Object.assign({ t, talk: scTalk(S, t, k), mood: MOOD[k] || 'neutral', look: 0 }, st || {}));
    };

    /* ================= the flat: A (wide), Cu / Ct (zooms) ================= */
    const sx = SX(t);
    if (inFlat) {
      flat.upd(t);
      if (Cu) sofFocus(cam, 1.35, 640, 560, 600, 420);
      else if (Ct) { const k = P(t, cut('thanks'), cut('dad') - cut('thanks'), linear); sofFocus(cam, 1.9 + 0.25 * k, 520, 640, 600, 470); }
      else if (shot === 'B') sofFocus(cam, 1.6, 700, 520, 820, 430);
      else cam.removeAttribute('transform');
      tr(sofa, sx, 612);
      const frozen = t >= tFreeze && t < tU;
      // Kavya pushing (walks along once the sofa moves); Dad from "dad"
      const walking = t > tU;
      const wph = (sx - 640) / 120;
      tr(kav, sx - 282, 614);
      kav.pose(walking ? blendLegs(PUSHPOSE, walkPose(wph, 1), 0.8) : PUSHPOSE);
      const tDad = at('dad') + 0.15, dIn = P(t, tDad, 1.7, linear);
      op(dad, t >= tDad ? 1 : 0);
      if (t >= tDad) {
        const dx = t < tDad + 1.7 ? lerp(-120, sx - 348, dIn) : sx - 348;
        tr(dad, dx, 618, 1.15);
        dad.pose(t < tDad + 1.7 ? walkPose(t * 1.1, 1) : walking ? blendLegs(DADPOSE, walkPose(wph, 1), 0.8) : DADPOSE);
      }
      // dust puffs at the legs while it slides
      dust.forEach((d, i) => { const ph = (t * 1.5 + i / 3) % 1; op(d, walking ? (1 - ph) * 0.8 : 0); tr(d, sx - 170 - ph * 60, 606 - ph * 20, 0.6 + ph); });
      // the 9:00 clock (wall)
      op(clockG, 1);

      // forces (FORCE-CAM only)
      const camOn = fc > 0 || Cu || Ct;
      const pushN = t < t3 ? 100 * P(t, tGo, 0.6, ease) : 100 + 200 * P(t, t3, 1.0, ease);
      const fricN = Math.min(pushN, 200);
      const showH = camOn && !Ct && !Cu;
      fPush.set(showH ? pushN : 0, Math.round(pushN / 10) * 10 + ' N'); tr(fPush, sx - 195, 545);
      fFric.set(showH ? fricN : 0, Math.round(fricN / 10) * 10 + ' N'); tr(fFric, sx + 150, 634);
      fW.set(Cu ? 150 * P(t, mid('up', 0.12), 0.5, ease) : 0); tr(fW, sx + 60, 548);
      fN.set(Cu ? 150 * P(t, mid('up', 0.42), 0.5, ease) : 0); tr(fN, sx - 130, 612);
      if (camOn) {
        const whistle = t >= mid('objection', 0.8) && t < at('stuck');
        const strain = t >= t3 + 0.4 && t < tU ? Math.sin(t * 40) * 2 * AMP : 0;
        // Pushpa: pushing the sofa's left side
        let pm = 'happy', pl = 0.3;
        if (t >= at('objection') && t < at('stuck')) { pl = 0.9; pm = whistle ? 'shock' : 'happy'; }
        if (t >= at('balanced') && t < at('up')) { pm = 'shock'; pl = 0.8; }
        if (t >= at('three') && t < at('limit')) { pm = 'happy'; pl = 0; }
        if (t >= at('limit')) pl = 0.8;
        put('pushpa', sx - 258, 528, 0.45, { arms: 'push', mood: pm, look: pl, sweat: t >= at('three') && t < tU ? 0.6 : 0 });
        // Frieda at the floor by the right feet
        let fm = 'annoyed';
        if (t >= at('balanced') && t < at('up')) fm = 'smug';
        put('frieda', sx + 245 + strain, 577, 0.42, { mood: fm, look: t >= at('balanced') && t < at('up') ? -0.3 : -0.8 });
        // Graham hugging the seat, Norm under the floor holding it up
        put('graham', sx - 40, 484, 0.42, { hug: 1, mood: 'happy', look: Cu ? 0.4 : 0 });
        put('norm', sx - 120, 670, 0.5, { mood: 'sad', look: Cu && scWho(S, t) === 'norm' ? 0 : -0.2 });
        // Rex: a dot on his break while balanced; up as a 100 N arrow at "I'm up"
        if (t >= at('balanced') - 0.1) {
          const ri = P(t, at('balanced') - 0.1, 0.4, pop);
          const upP = P(t, tUp, 0.5, ease);
          const rxp = lerp(sx + 110, sx + 30, upP), ryp = lerp(496, 428, upP) - 70 * Math.sin(Math.PI * clamp((t - tUp) / 0.5));
          let rm = 'neutral', rl = 0;
          if (t >= at('zero')) rm = 'happy';
          if (t >= at('up') && t < at('three')) { rm = 'happy'; rl = -0.4; }
          if (t >= at('three') && t < tUp) { rm = 'shock'; rl = -0.8; }
          if (t >= tUp) { rm = 'smug'; rl = 0; }
          if (t >= at('balanced') && t < at('zero')) { rm = 'deadpan'; }
          put('rex', rxp, ryp, 0.55 * Math.max(0.01, ri) * lerp(1, 1.1, upP), { mood: rm, look: rl, len: 0.6 * upP });
        }
      }
      op(chair, camOn && t >= at('zero') ? P(t, mid('zero', 0.55), 0.3, linear) : 0); tr(chair, sx + 118, 512);
      const sp = camOn && t >= at('zero') && t < tUp ? P(t, mid('zero', 0.6), 0.4, pop) : 0;
      op(sign, clamp(sp * 2.5)); tr(sign, sx + 220, 420, Math.max(0.01, 0.7 + 0.3 * sp), 4);
      op(paused, A && frozen ? (Math.floor(t * 2) % 2 ? 1 : 0.55) : 0); tr(paused, 190, 170);
      if (frozen) op(paused, 1);
    } else { op(chair, 0); op(sign, 0); op(paused, 0); op(dad, 0); dust.forEach(d => op(d, 0)); }
    if (!inFlat) { fPush.set(0); fFric.set(0); fW.set(0); fN.set(0); }
    op(kav, inFlat || Dc ? 1 : 0);

    // flat chips
    op(c900, A && t < cut('go') ? P(t, mid('nine', 0.1), 0.3, linear) : 0); tr(c900, 640, 214);
    const ob = A && t >= at('objection') && t < cut('stuck') ? P(t, mid('objection', 0.78), 0.35, pop) : 0;
    op(cObj, clamp(ob * 2.5)); tr(cObj, 880, 400, Math.max(0.01, 0.7 + 0.3 * ob), -3);
    op(tweet, ob > 0.01 ? 1 : 0); tr(tweet, 1010, 500, 1 + 0.06 * Math.sin(t * 30) * AMP, -6);
    const bp = A && t >= at('balanced') && t < at('zero') ? 1 : 0;
    if (bp) { sofShow(cBal, t, mid('balanced', 0.12), 860, 200); op(cBal2, P(t, mid('balanced', 0.42), 0.3, linear)); tr(cBal2, 860, 285); } else { op(cBal, 0); op(cBal2, 0); }
    const zp = A && t >= at('zero') && t < cut('up') ? 1 : 0;
    if (zp) { sofShow(cZero, t, mid('zero', 0.08), 860, 200); op(cStill, P(t, mid('zero', 0.35), 0.3, linear)); tr(cStill, 860, 285); } else { op(cZero, 0); op(cStill, 0); }
    op(chirp, Ct && t > end('thanks') - 0.6 ? P(t, end('thanks') - 0.6, 0.3, linear) : 0);
    const mp = A && t >= at('limit') && t < at('subtract') ? 1 : 0;
    if (mp) sofShow(cMax, t, mid('limit', 0.2), 860, 200); else op(cMax, 0);
    const smp = A && t >= at('subtract') && t < at('unbalanced') + 0.3 ? 1 : 0;
    op(sum, smp ? P(t, at('subtract'), 0.25, linear) * (1 - P(t, at('unbalanced'), 0.3, linear)) : 0); tr(sum, 880, 242);
    if (smp) {
      s1.set(300); s2.set(200 * P(t, mid('subtract', 0.18), 0.4, ease)); op(s2t, P(t, mid('subtract', 0.2), 0.3, linear));
      const r3 = P(t, mid('subtract', 0.42), 0.5, ease); op(sLine, r3); s3.set(100 * r3); op(s3t, r3);
    }
    const ub = A && t >= at('unbalanced') ? 1 : 0;
    if (ub) { sofShow(unb, t, at('unbalanced') + 0.05, 300, 230); op(u2, P(t, mid('unbalanced', 0.3), 0.3, linear)); op(u3, P(t, mid('unbalanced', 0.62), 0.3, linear)); } else op(unb, 0);

    /* ================= B: Kavya cut-in ================= */
    if (shot === 'B') {
      tr(bust, 380, 480, 1.5);
      bust.set({ t, talk: scTalk(S, t, 'kavya'), mood: 'annoyed', look: 0.5, sweat: 1 });
      op(kav, 0); op(dad, 0);
    }
    const mv = shot === 'B' ? P(t, mid('stuck', 0.45), 0.4, pop) : 0;
    op(cMoved, clamp(mv * 2.5)); tr(cMoved, 880, 210, Math.max(0.01, 0.7 + 0.3 * mv), 2);

    /* ================= D: the corridor ================= */
    if (Dc) {
      cam.removeAttribute('transform');
      const pos = posAt(t), v = vAt(t);
      corr.upd(pos, 1);
      tr(trolley, 600, 650, '-1 1'); trolley.upd(pos, 1);
      tr(sofa2, 600, 606, 0.78);
      tr(kav, 330, 652);
      const fast = (v - V0) / (V1 - V0);
      kav.pose(Object.assign(walkPose(pos / 130, 1), { lean: 10 + 8 * fast, armL: [80, 8], armR: [74, 12] }));
      const on = fc > 0;
      const extra = extraPush(t), pushN = 80 + extra;
      tPushA.set(on ? pushN : 0, Math.round(pushN / 10) * 10 + ' N'); tr(tPushA, 440, 572);
      tFricA.set(on ? 80 : 0); tr(tFricA, 722, 668);
      if (on) {
        const harderNow = t < at('steady');
        put('pushpa', 364 + Math.sin(t * 30) * extra / 60 * 2 * AMP, 515, 0.42, { arms: 'push', mood: harderNow ? (t > mid('harder', 0.6) ? 'shock' : 'happy') : (t < mid('steady', 0.35) ? 'shock' : 'neutral'), look: harderNow ? 0.8 : 0.8, sweat: extra / 60 });
        put('frieda', 795, 625, 0.32, { mood: 'annoyed', look: -0.8 });
        const len = 0.3 * extra / 60;
        put('rex', 600, 400, 0.5, { mood: 'deadpan', look: harderNow ? -0.5 : -0.7, len });
      }
    } else { tPushA.set(0); tFricA.set(0); }
    const gOn = (A && t >= at('unbalanced')) || Dc;
    op(gauge, gOn ? 1 : 0);
    if (gOn) { if (Dc) { gauge.set(vAt(t) / 100); tr(gauge, 1040, 250); } else { gauge.set(sofV(t) / 100); tr(gauge, 900, 240); } }
    const stp = Dc && t >= at('steady') ? P(t, mid('steady', 0.5), 0.4, pop) : 0;
    op(cSteady, clamp(stp * 2.5)); tr(cSteady, 560, 172, Math.max(0.01, 0.7 + 0.3 * stp));

    /* ================= E: "No." ================= */
    if (Ec) {
      cam.removeAttribute('transform');
      const k = P(t, cut('no'), cut('steady') - cut('no'), linear);
      put('rex', 470, 410, 1.6 * (1 + 0.14 * k), { mood: 'deadpan', look: 0, len: 0.3 });
    }

    /* ================= F: what a resultant force does ================= */
    if (Fc) {
      cam.removeAttribute('transform');
      PAN.forEach((p, i) => { const q = P(t, at('change') + i * 0.25, 0.4, pop); op(p.g, clamp(q * 2.5)); });
      pA.forEach(([f, x, y, n], i) => { f.set(n * P(t, at('change') + 0.25 + Math.floor(i / 2) * 0.25, 0.5, ease)); tr(f, x, y); });
      op(motion, 1); attr(turnPath, 'stroke-dashoffset', (-(t * 30) % 18).toFixed(1));
      minis.forEach((m, i) => {
        const [x, y, L] = MINI[i];
        tr(m, x, y); m.set(30 + (L - 30) * P(t, mid('change', 0.3) + i * 0.12, 0.5, ease), scTalk(S, t, 'rex'));
      });
      sofShow(cChange, t, mid('change', 0.55), 600, 650);
    } else op(cChange, 0);

    /* ---------- hide whoever is not in this shot ---------- */
    Object.keys(cr).forEach(k => { if (!shown[k]) op(cr[k], 0); });
    if (!shown.rex) op(rex, 0);
  };
});
