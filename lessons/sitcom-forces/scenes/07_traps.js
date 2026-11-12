/* Scene 7: The crew saves you some marks (exam traps) and the stinger.
   Beats: "6 EXAM TRAPS", the crew in a row -> six quick confessionals, each with its trap card:
   1 Graham (mass kg, weight N), 2 Pushpa (balanced = steady speed; Rex a dot beside a rolling trolley),
   3 Frieda (friction and drag oppose motion; drag grows with speed), 4 Rex (÷ not ×), 5 Tess, wonky
   (Hooke's law only up to the elastic limit; the uncle's photo), 6 Norm (flat = stationary, not backwards;
   "Like me. Forever.") -> the logo "will return" -> stinger: Piv's confessional, a long blinking silence,
   "...Everything revolves around me." (the room turns around his apex), Norm "He's not wrong", Rex
   "Don't encourage him." (the room snaps back) -> final frame: Piv on the logo, blinking. */
scene('traps', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;

  /* ---------- local helpers (prefixed trap) ---------- */
  const on = (t, a, b) => (t >= a && t < b ? 1 : 0);
  const trapPop = (el, t, t0, x, y, s, r) => { const p = P(t, t0, 0.4, pop); op(el, clamp(p * 2.5)); tr(el, x, y, Math.max(0.01, (s || 1) * (0.6 + 0.4 * p)), r); };
  const pill = (parent, text, o) => { o = o || {}; return chip(parent, text, { size: o.size || 30, fill: o.fill || 'rgba(10,27,39,0.9)', stroke: o.stroke || C.line, sw: o.sw || 2, color: o.color || C.ink, weight: o.weight || 700 }); };
  const seat = (ch, wrap) => { if (ch.parentNode !== wrap) wrap.appendChild(ch); };
  const pivT = (t, cues) => { for (const c of cues) if (Math.abs(t - c) < 0.065) return 0.065 + (t - c) - 20.59 + 45.8; return 2 - 20.59 + 45.8; };
  const txt = (parent, x, y, s, size, col, anchor) => T(parent, x, y, s, { size, weight: 800, anchor: anchor || 'middle', fill: col || C.ink });
  function trapFcam(parent) {
    const g = G(parent);
    E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#19E68C', opacity: 0.1 }, g);
    let scan = ''; for (let y = 3; y < 750; y += 7) scan += `M0,${y} L1200,${y} `;
    E('path', { d: scan, stroke: '#0A2A1A', 'stroke-width': 2, opacity: 0.18 }, g);
    E('path', { d: 'M40,150 L40,40 L150,40 M1050,40 L1160,40 L1160,150 M1160,600 L1160,710 L1050,710 M150,710 L40,710 L40,600', fill: 'none', stroke: '#7CFFC0', 'stroke-width': 5 }, g);
    E('rect', { x: 900, y: 58, width: 250, height: 56, rx: 12, fill: 'rgba(6,24,16,0.85)' }, g);
    g.dot = E('circle', { cx: 926, cy: 86, r: 10, fill: '#FF3B3B' }, g);
    T(g, 946, 98, 'FORCE-CAM', { size: 34, weight: 800, fill: '#7CFFC0' });
    g.set = (v, t) => { op(g, v); if (v) op(g.dot, Math.sin(t * TAU * 0.8) > 0 ? 1 : 0.2); };
    return g;
  }
  // a trap card: 540 x 440 panel with a numbered badge; g.body for the contents (origin at the card's centre)
  function trapCard(parent, n, col) {
    const g = G(parent);
    E('rect', { x: -270, y: -220, width: 540, height: 440, rx: 22, fill: 'rgba(10,27,39,0.93)', stroke: col, 'stroke-width': 4 }, g);
    const b = G(g); tr(b, -250, -206);
    E('circle', { r: 40, fill: col, stroke: '#FFFFFF', 'stroke-width': 4 }, b);
    T(b, 0, 16, String(n), { size: 46, weight: 800, anchor: 'middle', fill: '#0A1B27' });
    T(g, -190, -178, 'EXAM TRAP', { size: 26, weight: 800, fill: col, ls: 2 });
    g.body = G(g);
    return g;
  }
  function trapRow(parent, y, ok, s, col) {
    const g = G(parent); tr(g, 0, y);
    if (ok) tr(tick(g, 16), -200, -10); else tr(cross(g, 14), -200, -10);
    T(g, -170, 0, s, { size: 32, weight: 800, fill: col || (ok ? C.good : '#FF8A8A') });
    return g;
  }

  const Lbg = G(root), Lmid = G(root), Lcast = G(root), Lfg = G(root), Lhud = G(root);

  /* ================= intro: the crew in a row ================= */
  const introG = G(Lbg);
  ppNewFlat(introG);
  const introRow = G(introG);
  const head = chip(Lfg, '6 EXAM TRAPS', { size: 64, fill: '#E8424F', color: '#FFFFFF', stroke: '#FFFFFF', sw: 5 });
  const headSub = pill(Lfg, 'the crew would like to save you some marks', { size: 30 });

  /* ================= the six confessionals ================= */
  const WHO = ['graham', 'pushpa', 'frieda', 'rex', 'tess', 'norm'];
  const COL = [ppCol.weight, ppCol.push, ppCol.friction, ppCol.resultant, ppCol.tension, ppCol.normal];
  const confs = WHO.map(w => ppConf(Lbg, w));
  const cards = WHO.map((w, i) => trapCard(Lfg, i + 1, COL[i]));
  // 1 Graham: mass and weight
  {
    const b = cards[0].body;
    txt(b, -230, -110, 'MASS', 40, '#FFE45C', 'start'); txt(b, -100, -110, '→ kilograms (kg)', 34, C.ink, 'start');
    txt(b, -230, -30, 'WEIGHT', 40, ppCol.weight, 'start'); txt(b, -64, -30, 'is a force', 32, C.muted, 'start');
    txt(b, -100, 22, '→ newtons (N)', 34, C.ink, 'start');
    cards[0].rows = [trapRow(b, 112, false, '“my weight is 20 kg”'), trapRow(b, 172, true, '“my weight is 200 N”')];
  }
  // 2 Pushpa: balanced forces mean a steady speed
  const t2 = {};
  {
    const b = cards[1].body;
    txt(b, 0, -118, 'balanced forces', 36, '#FFE45C'); txt(b, 0, -72, '= STEADY SPEED', 40, C.ink);
    const floorDash = E('path', { d: '', stroke: '#62808F', 'stroke-width': 4, fill: 'none' }, b);
    E('line', { x1: -240, y1: 120, x2: 240, y2: 120, stroke: '#A4BCCB', 'stroke-width': 4 }, b);
    const trol = ppTrolley(b, { w: 220 }); tr(trol, 0, 120);
    E('rect', { x: -70, y: 120 - 40 - 70, width: 110, height: 70, rx: 6, fill: '#C99A5E', stroke: '#8C6235', 'stroke-width': 3 }, b);
    const fp = ppForce(b, { color: ppCol.push, dir: 'right', width: 14 }); tr(fp, -200, 64); fp.set(86);
    const ff = ppForce(b, { color: ppCol.friction, dir: 'left', width: 14 }); tr(ff, 200, 104); ff.set(86);
    t2.rexSeat = G(b); tr(t2.rexSeat, 150, -6);
    txt(b, 0, 186, 'no forward resultant needed', 28, C.muted);
    Object.assign(t2, { trol, floorDash });
  }
  // 3 Frieda: friction and drag oppose motion; drag grows with speed
  {
    const b = cards[2].body;
    E('rect', { x: -60, y: -150, width: 120, height: 70, rx: 8, fill: '#C99A5E', stroke: '#8C6235', 'stroke-width': 3 }, b);
    E('line', { x1: -240, y1: -80, x2: 240, y2: -80, stroke: '#A4BCCB', 'stroke-width': 4 }, b);
    arrow(b, 70, -126, 190, -126, { color: C.ink, width: 6 }); txt(b, 130, -146, 'motion', 26, C.ink);
    const fr = ppForce(b, { color: ppCol.friction, dir: 'left', width: 14 }); tr(fr, -70, -90); fr.set(110);
    txt(b, -130, -38, 'friction', 26, ppCol.friction);
    txt(b, 0, 16, 'friction & drag OPPOSE motion', 32, '#FFE45C');
    cards[2].drags = [['slow', 50], ['faster', 110], ['fastest', 180]].map(([s, L], i) => {
      const g = G(b); tr(g, -30, 78 + i * 46);
      txt(g, -110, 10, s, 28, C.ink, 'end');
      const a = ppForce(g, { color: ppCol.drag, dir: 'left', width: 14 }); tr(a, -80 + L + 10, 0); a.set(L);
      return g;
    });
    txt(b, 165, 90, 'drag grows', 28, ppCol.drag); txt(b, 165, 124, 'with speed', 28, ppCol.drag);
  }
  // 4 Rex: divide, don't multiply
  {
    const b = cards[3].body;
    txt(b, 0, -100, 'speed = distance ÷ time', 38, C.ink);
    txt(b, 0, -30, 'pressure = force ÷ area', 38, C.ink);
    const dv = G(b); tr(dv, 0, 80);
    txt(dv, -120, 30, '÷', 96, C.good); txt(dv, 10, 22, 'not', 36, C.muted); txt(dv, 120, 30, '×', 96, '#FF8A8A');
    cards[3].strike = strike(dv, 80, 2, 160);
    cards[3].stamp = G(b);
    const st = cards[3].stamp, w = textWidth("DON'T MULTIPLY!", 34, FD, 800) + 40;
    E('rect', { x: -w / 2, y: -30, width: w, height: 60, rx: 10, fill: '#2A0E12', stroke: '#FF5A5A', 'stroke-width': 5 }, st);
    txt(st, 0, 12, "DON'T MULTIPLY!", 34, '#FF5A5A');
  }
  // 5 Tess: Hooke's law, only up to the elastic limit
  {
    const b = cards[4].body;
    txt(b, 0, -124, "HOOKE'S LAW: extension ∝ force", 30, '#FFE45C');
    const gx = -170, gy = 112, gw = 330, gh = 180;
    arrow(b, gx, gy, gx + gw + 20, gy, { color: C.ink, width: 4 }); arrow(b, gx, gy, gx, gy - gh - 20, { color: C.ink, width: 4 });
    txt(b, gx + gw / 2, gy + 34, 'extension', 26, C.muted);
    const fl = txt(b, gx - 22, gy - gh / 2, 'force', 26, C.muted); fl.setAttribute('transform', `rotate(-90 ${gx - 22} ${gy - gh / 2})`);
    const lx = gx + 200, ly = gy - 150;
    E('line', { x1: gx, y1: gy, x2: lx, y2: ly, stroke: C.good, 'stroke-width': 6, 'stroke-linecap': 'round' }, b);
    E('path', { d: `M${lx},${ly} Q${lx + 60},${ly - 40} ${gx + gw},${ly - 30}`, fill: 'none', stroke: '#FF5A5A', 'stroke-width': 6, 'stroke-linecap': 'round' }, b);
    E('circle', { cx: lx, cy: ly, r: 10, fill: '#FFE45C', stroke: SC_INK, 'stroke-width': 3 }, b);
    txt(b, lx + 10, ly + 40, 'elastic limit', 26, '#FFE45C', 'start');
    txt(b, 0, 196, 'only works up to the elastic limit', 26, C.ink);
    // the uncle's photo
    const ph = G(Lfg); cards[4].photo = ph;
    E('rect', { x: -86, y: -100, width: 172, height: 200, rx: 6, fill: '#6B4A33', stroke: '#3A2616', 'stroke-width': 5 }, ph);
    E('rect', { x: -70, y: -84, width: 140, height: 140, fill: '#DCE8F0' }, ph);
    E('path', { d: 'M-60,-40 L60,-40 M-50,-40 L-44,30 M50,-40 L44,30', stroke: '#3F5BD9', 'stroke-width': 6, fill: 'none' }, ph);
    E('path', { d: 'M-30,-38 L-12,-22 L-34,-8 L-6,6 L-30,22 L-8,40 M20,-38 L34,-16 L14,0 L40,14 L22,34', stroke: '#9AA6B2', 'stroke-width': 4, fill: 'none' }, ph);
    E('path', { d: 'M40,-100 L86,-100 L86,-54 Z', fill: '#111111' }, ph);
    T(ph, 0, 84, 'Uncle Boing', { size: 26, weight: 800, anchor: 'middle', fill: '#FFE6B0' });
  }
  // 6 Norm: flat line = stationary
  {
    const b = cards[5].body;
    const gx = -180, gy = 56, gw = 300, gh = 160;
    arrow(b, gx, gy, gx + gw + 20, gy, { color: C.ink, width: 4 }); arrow(b, gx, gy, gx, gy - gh - 20, { color: C.ink, width: 4 });
    txt(b, gx + gw / 2, gy + 34, 'time', 26, C.muted);
    const dl = txt(b, gx - 22, gy - gh / 2, 'distance', 26, C.muted); dl.setAttribute('transform', `rotate(-90 ${gx - 22} ${gy - gh / 2})`);
    E('path', { d: `M${gx},${gy} L${gx + 100},${gy - 110} L${gx + 210},${gy - 110} L${gx + gw},${gy - 160}`, fill: 'none', stroke: ppCol.resultant, 'stroke-width': 6, 'stroke-linejoin': 'round' }, b);
    E('line', { x1: gx + 100, y1: gy - 110, x2: gx + 210, y2: gy - 110, stroke: '#FFE45C', 'stroke-width': 14, opacity: 0.5, 'stroke-linecap': 'round' }, b);
    txt(b, gx + 155, gy - 130, 'flat', 26, '#FFE45C');
    cards[5].rows = [trapRow(b, 130, true, 'flat = STATIONARY'), trapRow(b, 186, false, 'NOT backwards')];
  }

  /* ================= the logo: "will return" ================= */
  const titleG = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#14233A', '#3A1F33', true) }, titleG);
  let rays = '';
  for (let i = 0; i < 16; i++) { const a0 = i / 16 * TAU, a1 = a0 + TAU / 40; rays += `M0,0 L${(Math.cos(a0) * 1100).toFixed(0)},${(Math.sin(a0) * 1100).toFixed(0)} L${(Math.cos(a1) * 1100).toFixed(0)},${(Math.sin(a1) * 1100).toFixed(0)} Z `; }
  const rayP = E('path', { d: rays, fill: '#FFE45C', opacity: 0.06 }, titleG);
  E('ellipse', { cx: 600, cy: 590, rx: 600, ry: 180, fill: glow('#FF9F7A'), opacity: 0.3 }, titleG);
  const logo = ppLogo(Lfg);
  const willRet = T(Lfg, 600, 500, 'will return', { size: 52, weight: 700, anchor: 'middle', fill: '#FFFFFF' });
  const finSeat = G(Lfg);

  /* ================= stinger: Piv's confessional ================= */
  const stG = G(Lbg);
  const stCam = G(stG);
  const stRot = G(stCam);
  E('circle', { cx: 600, cy: 320, r: 900, fill: ppTint.piv[1] }, stRot);
  const pivConf = ppConf(stRot, 'piv');
  const stRays = E('path', { d: rays, fill: '#FFFFFF', opacity: 0 }, stRot);
  const stCast = G(stCam);
  const ltPiv = scLowerThird(Lhud, 'PIV', 'The pivot. Still doesn\'t talk.');
  const fcam = trapFcam(Lhud);

  /* ================= cast ================= */
  const crew = {};
  ['rex', 'pushpa', 'frieda', 'graham', 'norm', 'tess', 'piv'].forEach(k => { crew[k] = cast(Lcast, k); });
  const confSeat = G(Lcast);
  const ROW = ['graham', 'pushpa', 'frieda', 'rex', 'tess', 'norm', 'piv'];
  const MOOD = { rex: 'deadpan', pushpa: 'happy', frieda: 'annoyed', graham: 'happy', norm: 'sad', tess: 'shock', piv: 'neutral' };

  /* cut points */
  const cT = WHO.map((w, i) => at('t' + (i + 1)) - 0.06);
  const cRet = at('return') - 0.06, cAsk = at('ask') - 0.06, cFin = end('dont') + 0.45;
  const apex = [600, 440 - 92 * 1.3];

  return t => {
    const sIntro = on(t, -1, cT[0]), sRet = on(t, cRet, cAsk), sSt = on(t, cAsk, cFin), sFin = on(t, cFin, 1e9);
    let sT = -1; for (let i = 0; i < 6; i++) if (t >= cT[i] && t < (i < 5 ? cT[i + 1] : cRet)) sT = i;
    const shown = {};

    /* ---------- intro ---------- */
    op(introG, sIntro); op(head, 0); op(headSub, 0);
    fcam.set(sIntro ? 1 : 0, t);
    if (sIntro) {
      trapPop(head, t, at('intro') + 0.1, 600, 210, 1, -2);
      trapPop(headSub, t, mid('intro', 0.45), 600, 310);
      ROW.forEach((k, i) => {
        const c = crew[k]; seat(c, introRow); shown[k] = 1;
        const p = P(t, at('intro') + 0.3 + i * 0.12, 0.4, pop); op(c, clamp(p * 3));
        const s = (k === 'piv' ? 0.6 : k === 'tess' ? 0.6 : 0.55) * Math.max(0.01, p);
        tr(c, 170 + i * 143, (k === 'tess' ? 470 : 540) + 30 * (1 - clamp(p)), s);
        c.set({ t: k === 'piv' ? pivT(t, [mid('intro', 0.7)]) : t, mood: MOOD[k], look: 0, arms: 'up', len: 0, sweat: k === 'tess' ? 1 : 0 });
      });
    }

    /* ---------- the six confessionals ---------- */
    confs.forEach((c, i) => c.set(sT === i ? 1 : 0, t));
    cards.forEach((c, i) => op(c, sT === i ? 1 : 0));
    op(cards[4].photo, 0);
    if (sT >= 0) {
      const w = WHO[sT], c = crew[w], id = 't' + (sT + 1), t0 = cT[sT], t1 = sT < 5 ? cT[sT + 1] : cRet;
      seat(c, confSeat); shown[w] = 1; op(c, 1);
      const push = P(t, t0, t1 - t0, linear);
      const s = { graham: 1.35, pushpa: 1.35, frieda: 1.3, rex: 1.2, tess: 1.25, norm: 1.3 }[w] * (1 + 0.06 * push + (w === 'norm' ? 0.08 * P(t, end('t6'), 0.9, ease) : 0));
      const x = w === 'rex' ? 250 : 320, y = w === 'tess' ? 360 : 430;
      tr(c, x, y, s);
      let mood = MOOD[w], look = 0;
      if (w === 'pushpa') mood = t < mid(id, 0.5) ? 'happy' : 'smug';
      if (w === 'frieda') mood = t > mid(id, 0.6) ? 'smug' : 'annoyed';
      if (w === 'rex') mood = t > mid(id, 0.78) ? 'annoyed' : 'deadpan';
      if (w === 'norm') look = t > mid(id, 0.75) ? 0 : 0.3;
      c.set({ t, talk: scTalk(S, t, w), mood, look, arms: w === 'pushpa' ? 'up' : undefined, len: 0.6, hug: w === 'graham' ? 0.4 : 0, wonky: w === 'tess', stretch: 0.1, sweat: w === 'tess' ? 1 : 0 });
      const card = cards[sT], cp = P(t, at(id) + 0.05, 0.4, pop);
      op(card, clamp(cp * 2.5)); tr(card, 860, 380, Math.max(0.01, 0.85 + 0.15 * cp));
      // per-trap beats
      if (sT === 0) card.rows.forEach((r, i) => op(r, P(t, mid(id, 0.55 + i * 0.15), 0.3, linear)));
      if (sT === 1) {
        t2.trol.upd(t, 120);
        let d = ''; const off = (t * 120) % 60; for (let xx = -240 + 60 - off; xx < 240; xx += 60) d += `M${xx.toFixed(0)},134 L${(xx + 26).toFixed(0)},134 `;
        attr(t2.floorDash, 'd', d);
        seat(crew.rex, t2.rexSeat); shown.rex = 1; op(crew.rex, P(t, mid(id, 0.5), 0.3, linear));
        tr(crew.rex, 0, 0, 0.36);
        crew.rex.set({ t, mood: 'happy', len: 0 });
      }
      if (sT === 2) card.drags.forEach((g, i) => op(g, P(t, mid(id, 0.5 + i * 0.1), 0.25, linear)));
      if (sT === 3) {
        card.strike.set(P(t, mid(id, 0.75), 0.3, linear));
        const sp = P(t, mid(id, 0.82), 0.3, linear);
        op(card.stamp, clamp(sp * 4)); tr(card.stamp, 0, 176, lerp(1.6, 1, easeOut(sp)), -4);
      }
      if (sT === 4) trapPop(card.photo, t, mid(id, 0.72), 140, 220, 1, -6);
      if (sT === 5) { card.rows.forEach((r, i) => op(r, P(t, mid(id, 0.25 + i * 0.2), 0.3, linear))); op(card, (t > end(id) ? 1 - 0.35 * P(t, end(id), 0.5, linear) : 1) * clamp(cp * 2.5)); }
    }

    /* ---------- the logo ---------- */
    op(titleG, sRet || sFin); op(willRet, 0);
    if (sRet || sFin) {
      tr(rayP, 600, 590, 1, (t * 6 * AMP) % 360);
      logo.set(sRet ? P(t, at('return') + 0.05, 0.7, linear) : 1); tr(logo, 600, sFin ? 380 : 300);
      op(willRet, sRet ? P(t, mid('return', 0.5), 0.4, linear) : 1); tr(willRet, 0, sFin ? 120 : 0);
    } else logo.set(0);

    /* ---------- stinger ---------- */
    op(stG, sSt);
    if (sSt) {
      pivConf.set(1, t);
      const k = 1 + 0.16 * P(t, end('ask'), at('wrong') - end('ask'), ease);
      stCam.setAttribute('transform', `translate(${apex[0]} ${apex[1]}) scale(${k.toFixed(4)}) translate(${-apex[0]} ${-apex[1]})`);
      const spin = P(t, mid('me', 0.3), at('dont') + 0.3 - mid('me', 0.3), linear) * 26 * (S.reduce ? 0.5 : 1);
      const back = P(t, mid('dont', 0.55), 0.3, ease);
      const th = spin * (1 - back);
      stRot.setAttribute('transform', `rotate(${th.toFixed(2)} ${apex[0]} ${apex[1]})`);
      op(stRays, 0.07 * P(t, mid('me', 0.3), 0.6, linear) * (1 - back)); tr(stRays, apex[0], apex[1], 1, th * 3);
      // Piv
      const piv = crew.piv; seat(piv, stCast); shown.piv = 1; op(piv, 1);
      tr(piv, 600, 440, 1.3);
      piv.set({ t: pivT(t, [end('ask') + 0.45, end('ask') + 1.15, end('me') + 0.5, end('wrong') + 0.3]), talk: scTalk(S, t, 'piv'), mood: t > at('me') && t < at('dont') ? 'smug' : 'neutral', look: t > at('wrong') && t < at('dont') ? -0.4 : t > at('dont') ? 0.4 : 0 });
      // Rex peeks in from the right
      const rex = crew.rex; seat(rex, stCast); shown.rex = 1; op(rex, 1);
      const rIn = P(t, at('ask') - 0.3, 0.4, easeOut);
      tr(rex, lerp(1300, 1070, rIn), 360, 0.95);
      let rm = 'neutral';
      if (t > end('ask') + 0.3) rm = 'deadpan';
      if (t > mid('me', 0.5) && t < end('me') + 0.6) rm = 'shock';
      if (t > end('me') + 0.6) rm = 'deadpan';
      rex.set({ t, talk: scTalk(S, t, 'rex'), mood: rm, look: t > at('wrong') && t < at('dont') ? -1 : -0.7, len: 1 });
      // Norm from the left
      const norm = crew.norm, nIn = P(t, at('wrong') - 0.4, 0.4, easeOut);
      if (nIn > 0) {
        seat(norm, stCast); shown.norm = 1; op(norm, 1);
        const nod = t > mid('wrong', 0.5) && t < end('wrong') + 0.5 ? 10 * Math.abs(Math.sin((t - mid('wrong', 0.5)) * 7)) : 0;
        tr(norm, lerp(-140, 110, nIn), 590 + nod, 0.95);
        norm.set({ t, talk: scTalk(S, t, 'norm'), mood: 'sad', look: 0.8 });
      }
    }
    ltPiv.set(sSt ? win(t, at('ask') + 0.4, at('ask') + 3.6, 0.3) : 0);

    /* ---------- final frame: Piv on the logo ---------- */
    if (sFin) {
      const piv = crew.piv; seat(piv, finSeat); shown.piv = 1;
      const p = P(t, cFin + 0.15, 0.45, pop); op(piv, clamp(p * 3));
      tr(piv, 600, 222 + 20 * (1 - clamp(p)), 0.85 * Math.max(0.01, p));
      piv.set({ t: pivT(t, [cFin + 1.0, cFin + 1.35]), mood: 'neutral', look: 0 });
    }

    Object.keys(crew).forEach(k => { if (!shown[k]) op(crew[k], 0); });
  };
});
