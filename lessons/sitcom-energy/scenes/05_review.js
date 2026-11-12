/* Scene 5: Effie's performance review (efficiency and the Sankey diagram).
   The review room and the nervous queue of appliances -> Effie (lower third), needle swings and settles ->
   confessional: the rice cooker cried -> the formula on the big screen -> Jules: Useful Over Total -> the fan:
   200 J supplied, 150 J useful -> 150 / 200 = 0.75 = 75% -> 50 J (25%) wasted, motor glows -> Theo: "Hello
   again" -> no real device is 100% efficient (needle strains, stops short) -> Jules' 110% sticky note ->
   Constance: DENIED -> the Sankey diagram grows (exact widths 200 / 150 / 50) -> useful carries on, wasted peels
   off downwards -> fat vs thin wasted branch -> Theo sits at the end of the wasted branch. */
scene('review', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;

  /* ---------- local helpers (prefixed rev) ---------- */
  const on = (t, a, b) => (t >= a && t < b ? 1 : 0);
  const view = (el, k, fx, fy, sx, sy) => el.setAttribute('transform', `translate(${sx.toFixed(1)} ${sy.toFixed(1)}) scale(${k.toFixed(4)}) translate(${(-fx).toFixed(1)} ${(-fy).toFixed(1)})`);
  const popIn = (el, t, t0, x, y, s, r) => { const p = P(t, t0, 0.45, pop); op(el, clamp(p * 2.5)); tr(el, x, y, Math.max(0.01, (s || 1) * (0.6 + 0.4 * p)), r); return p; };
  const popAt = (el, t, t0, cx, cy) => { const p = P(t, t0, 0.45, pop), k = Math.max(0.01, 0.7 + 0.3 * p); op(el, clamp(p * 2.5)); tr(el, cx * (1 - k), cy * (1 - k), k); return p; };
  const pill = (parent, text, o) => { o = o || {}; return chip(parent, text, { size: o.size || 30, fill: o.fill || 'rgba(10,7,24,0.92)', stroke: o.stroke || '#8E6CEF', sw: 3, color: o.color || C.ink, weight: 700 }); };
  const GREEN = '#56D69B', YEL = '#FFE45C', ORA = '#FF8A3D';
  // text with differently coloured parts: parts = [[str, fill, size?], ...]
  function revRich(parent, x, y, parts, o) {
    o = o || {};
    const t = E('text', { x, y, 'font-size': o.size || 40, 'font-weight': o.weight || 700, fill: o.fill || C.ink, 'text-anchor': o.anchor || 'middle', 'font-family': FD }, parent);
    parts.forEach(([s, f, sz, w]) => { const ts = E('tspan', { fill: f || undefined, 'font-size': sz || undefined, 'font-weight': w || undefined }, t); ts.textContent = s; });
    return t;
  }
  // nervous googly eyes (for the appliances in the queue)
  function revEyes(parent, x, y, s) {
    const g = G(parent); tr(g, x, y, s || 1);
    [-1, 1].forEach(sd => { E('ellipse', { cx: sd * 16, rx: 13, ry: 15, fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 3 }, g); E('circle', { cx: sd * 16 - 6, cy: 2, r: 6, fill: SC_INK }, g); });
    E('path', { d: 'M-12,26 Q0,20 12,26', fill: 'none', stroke: SC_INK, 'stroke-width': 3, 'stroke-linecap': 'round' }, g);
    return g;
  }
  // a rice cooker, base at (0,0), about 150 wide
  function revRice(parent) {
    const g = G(parent);
    E('path', { d: 'M-74,0 L-80,-90 Q-80,-104 -64,-104 L64,-104 Q80,-104 80,-90 L74,0 Z', fill: ball('#FFFFFF', '#C9D3DC'), stroke: SC_INK, 'stroke-width': 4 }, g);
    E('path', { d: 'M-76,-104 Q0,-150 76,-104 Z', fill: '#E8E2D2', stroke: SC_INK, 'stroke-width': 4 }, g);
    E('rect', { x: -18, y: -150, width: 36, height: 14, rx: 6, fill: '#5A606A', stroke: SC_INK, 'stroke-width': 3 }, g);
    E('rect', { x: -30, y: -34, width: 60, height: 22, rx: 5, fill: '#1A2A22', stroke: SC_INK, 'stroke-width': 2 }, g);
    E('circle', { cx: 46, cy: -22, r: 6, fill: '#E8424F' }, g);
    return g;
  }
  // a wall aircon unit standing on two little feet
  function revAircon(parent) {
    const g = G(parent);
    E('path', { d: 'M-40,0 L-40,-14 M40,0 L40,-14', stroke: SC_INK, 'stroke-width': 5, 'stroke-linecap': 'round' }, g);
    E('rect', { x: -84, y: -74, width: 168, height: 62, rx: 14, fill: '#FAFCFD', stroke: '#9AA6B2', 'stroke-width': 4 }, g);
    E('rect', { x: -76, y: -30, width: 152, height: 10, rx: 5, fill: '#DCE4EA' }, g);
    return g;
  }
  // a pom-pom
  function revPom(parent, col) { const g = G(parent); E('circle', { r: 22, fill: col, stroke: SC_INK, 'stroke-width': 2, 'stroke-dasharray': '3 3' }, g); E('circle', { r: 14, fill: col }, g); return g; }

  /* camera over everything but the HUD */
  const cam = G(root);
  const Lbg = G(cam), Lcast = G(cam), Lfg = G(cam), Lhud = G(root);

  /* ================= R: the review room ================= */
  const roomShot = G(Lbg), roomWrap = G(roomShot);
  const room = enReview(roomWrap);
  const queue = G(roomWrap);
  const qFan = G(queue); tr(enFan(qFan, 0.45), 0, 0); revEyes(qFan, 0, -104, 0.8);
  const qKet = G(queue); tr(enKettle(qKet, 0.6), 0, 0); revEyes(qKet, 0, -60, 0.8);
  const qRice = G(queue); revRice(qRice); revEyes(qRice, 0, -66, 0.8);
  const qAc = G(queue); revAircon(qAc); revEyes(qAc, 0, -50, 0.7);
  const QX = [650, 790, 940, 1090];
  const qDrops = [qFan, qKet, qRice, qAc].map((q, i) => { const d = E('path', { d: 'M0,-12 Q9,2 0,8 Q-9,2 0,-12 Z', fill: '#BFEAFF', stroke: '#5AB4E0', 'stroke-width': 2 }, q); return d; });
  const scrQ = G(Lfg);
  T(scrQ, 860, 230, 'YEARLY REVIEWS', { size: 46, weight: 800, anchor: 'middle', fill: YEL, ls: 3 });
  T(scrQ, 860, 300, 'NOW SERVING: everyone', { size: 32, weight: 700, anchor: 'middle', fill: '#CBB8FF' });
  const scrHi = G(Lfg);
  T(scrHi, 860, 270, 'EFFICIENCY', { size: 74, weight: 800, anchor: 'middle', fill: '#CBB8FF', ls: 4 });
  T(scrHi, 860, 340, 'how much of your energy', { size: 32, weight: 700, anchor: 'middle', fill: C.ink });
  T(scrHi, 860, 384, 'actually does the job', { size: 32, weight: 700, anchor: 'middle', fill: C.ink });
  const ltEffie = scLowerThird(Lhud, 'EFFIE', 'Efficiency. Reviews everything.');
  const neverC = pill(Lfg, 'no real device is 100% efficient', { size: 34, color: C.ink, stroke: '#FF6070' });
  const alwaysC = G(Lfg);
  card(alwaysC, -150, -60, 300, 120, { fill: 'rgba(10,7,24,0.92)', stroke: ORA, sw: 3 });
  T(alwaysC, 0, -10, 'always some waste', { size: 30, weight: 800, anchor: 'middle', fill: '#FFB27A' });
  T(alwaysC, 0, 34, '(usually heat)', { size: 28, weight: 700, anchor: 'middle', fill: C.ink });

  /* ================= EC: Effie's confessional ================= */
  const confE = enConf(Lbg, 'effie');
  const photo = G(Lfg);
  E('rect', { x: -170, y: -150, width: 340, height: 300, rx: 10, fill: '#F4EBD3', stroke: '#B8902C', 'stroke-width': 8 }, photo);
  E('rect', { x: -150, y: -130, width: 300, height: 220, fill: linGrad('#3A2A5A', '#22163D', true) }, photo);
  const pRice = G(photo); tr(pRice, 0, 70); revRice(pRice);
  const pFace = G(pRice); tr(pFace, 0, -66);
  [-1, 1].forEach(sd => { E('circle', { cx: sd * 18, r: 6, fill: SC_INK }, pFace); E('path', { d: `M${sd * 8},-14 L${sd * 28},-8`, stroke: SC_INK, 'stroke-width': 3, 'stroke-linecap': 'round' }, pFace); });
  E('path', { d: 'M-12,24 Q0,16 12,24', fill: 'none', stroke: SC_INK, 'stroke-width': 3, 'stroke-linecap': 'round' }, pFace);
  const tear = E('path', { d: 'M0,-10 Q8,2 0,8 Q-8,2 0,-10 Z', fill: '#7FD3FF', stroke: '#2E7DD8', 'stroke-width': 2 }, pFace);
  T(photo, 0, 128, 'REVIEWED', { size: 28, weight: 800, anchor: 'middle', fill: '#8A1A1A', ls: 3 });

  /* ================= SC: the big screen, close up ================= */
  const scr = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#0E0A1E' }, scr);
  E('rect', { x: 22, y: 22, width: 1156, height: 706, rx: 24, fill: linGrad('#120C2A', '#0A0718', true), stroke: '#8E6CEF', 'stroke-width': 10 }, scr);
  { let d = ''; for (let y = 40; y < 720; y += 14) d += `M30,${y} L1170,${y} `; E('path', { d, stroke: '#FFFFFF', 'stroke-width': 1, opacity: 0.03 }, scr); }
  // formula
  const fm = G(Lfg);
  const fm1 = T(fm, 600, 250, 'efficiency =', { size: 64, weight: 800, anchor: 'middle', fill: '#CBB8FF' });
  const fm2 = revRich(fm, 600, 350, [['useful', GREEN, 44, 800], [' energy transferred ', C.ink], ['÷', YEL, 48, 800], [' total', YEL, 44, 800], [' energy supplied', C.ink]], { size: 40 });
  // Useful Over Total
  const uot = G(Lfg);
  const uU = revRich(uot, 470, 500, [['U', GREEN, 96, 800], ['seful', GREEN, 54]], { size: 54 });
  const uBar = E('line', { x1: 290, y1: 528, x2: 650, y2: 528, stroke: '#FFFFFF', 'stroke-width': 8, 'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': '1 1' }, uot);
  const uO = revRich(uot, 760, 546, [['O', '#FFFFFF', 96, 800], ['ver', '#FFFFFF', 54]], { size: 54, anchor: 'start' });
  const uT = revRich(uot, 470, 620, [['T', YEL, 96, 800], ['otal', YEL, 54]], { size: 54 });
  // the fan: bars, the sum
  const fanS = G(Lfg);
  const fsHead = T(fanS, 820, 130, 'efficiency = useful ÷ total', { size: 30, weight: 700, anchor: 'middle', fill: '#CBB8FF' });
  const pod = G(fanS);
  E('ellipse', { cx: 220, cy: 604, rx: 130, ry: 26, fill: '#3E2690', stroke: '#8E6CEF', 'stroke-width': 4 }, pod);
  E('path', { d: 'M150,-10 L290,-10 L360,604 L80,604 Z', fill: '#FFF7C2', opacity: 0.07 }, pod);
  const sFan = enFan(fanS, 0.75); tr(sFan, 220, 600, 0.75);
  const sGlow = E('circle', { cx: 220, cy: 427, r: 64, fill: glow('#FF6A1A') }, fanS);
  const sHW = heatWaves(fanS, { n: 3, h: 70, spacing: 22, width: 6, color: '#FF6A1A' }); tr(sHW, 220, 360);
  const r1 = G(fanS), r2 = G(fanS), r3 = G(fanS);
  revRich(r1, 520, 200, [['supplied: ', C.ink], ['200 J', YEL, 36, 800]], { size: 32, anchor: 'start' });
  const b1 = E('rect', { x: 520, y: 216, width: 600, height: 46, rx: 10, fill: YEL, stroke: SC_INK, 'stroke-width': 3 }, r1);
  revRich(r2, 520, 312, [['useful (moving air): ', C.ink], ['150 J', GREEN, 36, 800]], { size: 32, anchor: 'start' });
  const b2 = E('rect', { x: 520, y: 328, width: 450, height: 46, rx: 10, fill: GREEN, stroke: SC_INK, 'stroke-width': 3 }, r2);
  const b2ghost = E('rect', { x: 970, y: 328, width: 150, height: 46, rx: 10, fill: 'none', stroke: '#8E6CEF', 'stroke-width': 3, 'stroke-dasharray': '8 6' }, r2);
  revRich(r3, 520, 424, [['wasted: ', C.ink], ['50 J', ORA, 36, 800], [' (', C.ink], ['25%', ORA, 36, 800], ['), mostly heat', C.ink]], { size: 32, anchor: 'start' });
  const b3 = E('rect', { x: 970, y: 440, width: 150, height: 46, rx: 10, fill: ORA, stroke: SC_INK, 'stroke-width': 3 }, r3);
  const sum1 = revRich(fanS, 820, 566, [['150 ÷ 200 = ', C.ink], ['0.75', '#CBB8FF', 52, 800]], { size: 48 });
  const sum2 = revRich(fanS, 820, 640, [['× 100 = ', C.ink], ['75%', GREEN, 64, 800]], { size: 48 });
  const note = G(Lfg);
  E('rect', { x: -86, y: -62, width: 172, height: 124, fill: '#FFE45C', stroke: '#B8A030', 'stroke-width': 3 }, note);
  E('rect', { x: -34, y: -72, width: 68, height: 20, fill: 'rgba(255,255,255,0.6)' }, note);
  T(note, 0, 22, '110%', { size: 58, weight: 800, anchor: 'middle', fill: '#C2453A' });
  const deniedS = enStamp(Lfg, 'DENIED');
  const outIn = pill(Lfg, 'energy out ≤ energy in', { size: 32, color: C.ink, stroke: '#FF6070' });
  // the Sankey
  const SKX = 230, SKY = 260;
  const skG = G(Lfg);
  const sk = enSankey(skG, { total: 200, frac: 0.75, len: 560, labels: { in: '200 J supplied', use: '150 J useful (moving air)', waste: '50 J wasted (heat)' } });
  tr(sk, SKX, SKY);
  const skPaths = sk.querySelectorAll('path');      // input, useful, wasted bands
  const skTitle = pill(Lfg, 'SANKEY DIAGRAM', { size: 34, color: YEL, stroke: YEL });
  const skWidth = G(Lfg);
  card(skWidth, -170, -62, 340, 124, { fill: 'rgba(10,7,24,0.92)', stroke: YEL, sw: 3 });
  revRich(skWidth, 0, -12, [['width', YEL, 34, 800], [' = ', C.ink], ['amount', YEL, 34, 800]], { size: 32 });
  T(skWidth, 0, 36, 'of energy', { size: 30, weight: 700, anchor: 'middle', fill: C.ink });
  const brUse = pill(Lfg, 'carries straight on', { size: 30, color: GREEN, stroke: GREEN });
  const brWaste = pill(Lfg, 'peels off, usually downwards', { size: 30, color: ORA, stroke: ORA });
  // fat vs thin
  const fat = G(Lfg);
  const skA = enSankey(fat, { total: 120, frac: 0.1, len: 300 }); tr(skA, 110, 300);
  const skB = enSankey(fat, { total: 120, frac: 0.9, len: 300 }); tr(skB, 660, 300);
  T(fat, 260, 200, 'inefficient', { size: 42, weight: 800, anchor: 'middle', fill: ORA });
  T(fat, 810, 200, 'efficient', { size: 42, weight: 800, anchor: 'middle', fill: GREEN });
  T(fat, 450, 610, '90% wasted', { size: 30, weight: 800, anchor: 'start', fill: ORA });
  T(fat, 900, 520, '10% wasted', { size: 30, weight: 800, anchor: 'start', fill: ORA });

  /* ================= the cast ================= */
  const effie = cast(Lcast, 'effie');
  const jul = cast(Lcast, 'jules');
  const theo = cast(Lcast, 'theo');
  const con = cast(Lcast, 'con');
  const poms = [revPom(jul.firstChild, '#FF5FA2'), revPom(jul.firstChild, '#4CC9F0')];
  const tArm = E('path', { d: 'M70,10 Q110,0 118,-40', fill: 'none', stroke: '#E0601E', 'stroke-width': 22, 'stroke-linecap': 'round' }, theo.firstChild);
  theo.firstChild.insertBefore(tArm, theo.firstChild.firstChild);

  /* ================= cut list ================= */
  const cEC = at('theffie') - 0.1, cSC = at('formula') - 0.1, cEZ = at('never') - 0.1, cSC2 = at('more') - 0.1, cSK = at('sankey') - 0.1, cFat = at('fat') - 0.1, cAl = at('always') - 0.1;

  return t => {
    const sR = on(t, -1, cEC), sEC = on(t, cEC, cSC), sSC = on(t, cSC, cEZ) || on(t, cSC2, cSK), sEZ = on(t, cEZ, cSC2),
      sSK = on(t, cSK, cFat) || on(t, cAl, 1e9), sFat = on(t, cFat, cAl);
    let effOn = 0, julOn = 0, theoOn = 0, conOn = 0;
    cam.removeAttribute('transform');

    /* ---------- R: the room (effie, hi) and the close-up on Effie (never) ---------- */
    op(roomShot, sR || sEZ); op(scrQ, 0); op(scrHi, 0); op(neverC, 0); op(alwaysC, 0); op(queue, sR);
    if (sR) {
      room.upd(t);
      view(roomWrap, 1, 600, 375, 600, 375);
      // the nervous queue
      [qFan, qKet, qRice, qAc].forEach((q, i) => {
        const jit = Math.sin(t * 38 + i * 2) * 1.6 * AMP;
        tr(q, QX[i] + jit, 682);
        const f = (t * 0.7 + i * 0.3) % 1; tr(qDrops[i], 34, -110 + f * 40 + (i === 3 ? 30 : 0)); qDrops[i].style.opacity = (1 - f).toFixed(2);
      });
      const qs = win(t, at('effie') + 0.4, at('hi') + 0.1, 0.25);
      op(scrQ, qs);
      const hs = P(t, mid('hi', 0.2), 0.4, linear);
      op(scrHi, hs);
      effOn = 1; op(effie, 1); tr(effie, 280, 420, 1.2);
      const dt = t - at('hi');
      const gauge = dt < 0 ? 0.05 : 0.75 - 0.7 * Math.exp(-2.2 * dt) * Math.cos(dt * 7);
      effie.set({ t, talk: scTalk(S, t, 'effie'), mood: 'smug', look: t < at('hi') ? 0.8 : 0, gauge });
      ltEffie.set(win(t, at('hi') + 0.1, at('hi') + 3.4, 0.3));
    } else ltEffie.set(0);
    if (sEZ) {
      room.upd(t);
      const push = P(t, cEZ, cSC2 - cEZ, linear);
      view(roomWrap, 1.6 + 0.08 * push, 280, 420, 600, 440);
      effOn = 1; op(effie, 1); tr(effie, 600, 440, 1.2 * (1.6 + 0.08 * push));
      const reach = P(t, mid('never', 0.35), 1.2, ease);
      const gauge = 0.75 + 0.22 * reach + (reach > 0.95 ? Math.sin(t * 45) * 0.012 * AMP : 0);
      effie.set({ t, talk: scTalk(S, t, 'effie'), mood: t < mid('never', 0.6) ? 'annoyed' : 'smug', look: 0, gauge });
      popIn(neverC, t, mid('never', 0.05), 600, 120);
      popIn(alwaysC, t, mid('never', 0.62), 1005, 470);
    }

    /* ---------- EC: Effie's confessional ---------- */
    confE.set(sEC, t); op(photo, 0);
    if (sEC) {
      const push = P(t, cEC, cSC - cEC, linear), k = 1 + 0.05 * push;
      confE.setAttribute('transform', `translate(430 400) scale(${k.toFixed(4)}) translate(-430 -400)`);
      effOn = 1; op(effie, 1); tr(effie, 400, 420, 1.5 * k);
      effie.set({ t, talk: scTalk(S, t, 'effie'), mood: 'smug', look: t > mid('theffie', 0.55) ? 0.6 : 0, gauge: 0.75 });
      popIn(photo, t, mid('theffie', 0.45), 880, 370, 1, 3);
      const f = (t * 0.9) % 1; tr(tear, 26, 8 + f * 40); tear.style.opacity = (1 - f).toFixed(2);
    }

    /* ---------- SC: the big screen ---------- */
    op(scr, sSC || sSK || sFat);
    op(fm, 0); op(uot, 0); op(fanS, 0); op(note, 0); op(deniedS, 0); op(outIn, 0);
    if (sSC) {
      // formula and Useful Over Total
      if (t < at('fan') - 0.1) {
        op(fm, 1);
        op(fm1, P(t, mid('formula', 0.0), 0.3, linear));
        const fp = P(t, mid('formula', 0.12), 0.45, pop);
        op(fm2, clamp(fp * 3)); tr(fm2, 600 * (1 - (0.85 + 0.15 * fp)), 350 * (1 - (0.85 + 0.15 * fp)), 0.85 + 0.15 * fp);
        const up = t >= at('uot') - 0.1 ? 1 : 0;
        tr(fm, 0, -70 * P(t, at('uot') - 0.1, 0.3, ease));
        op(uot, up);
        if (up) {
          popAt(uU, t, at('uot') + 0.05, 470, 480);
          uBar.setAttribute('stroke-dashoffset', (1 - P(t, mid('uot', 0.2), 0.4, ease)).toFixed(3));
          popAt(uO, t, mid('uot', 0.3), 840, 530);
          popAt(uT, t, mid('uot', 0.55), 470, 600);
          julOn = 1; op(jul, 1); tr(jul, 1070, 590, 0.85);
          jul.set({ t, talk: scTalk(S, t, 'jules'), mood: 'happy', look: -0.6, arms: 1 });
        }
      } else {
        // the fan's review
        op(fanS, 1);
        sFan.upd(t, AMP);
        op(fsHead, t < at('check') ? 1 : 1 - P(t, mid('check', 0.45), 0.25, linear));
        popAt(r1, t, mid('fan', 0.25), 820, 230);
        attr(b1, 'width', 600 * P(t, mid('fan', 0.3), 0.6, ease));
        popAt(r2, t, mid('fan', 0.62), 745, 340);
        attr(b2, 'width', Math.max(1, 450 * P(t, mid('fan', 0.68), 0.6, ease)));
        op(b2ghost, P(t, mid('fan', 0.85), 0.3, linear));
        popAt(sum1, t, mid('divide', 0.05), 820, 550);
        popAt(sum2, t, mid('divide', 0.62), 820, 620);
        const wp = P(t, mid('waste', 0.02), 0.4, linear);
        op(r3, wp); attr(b3, 'width', 150 * P(t, mid('waste', 0.05), 0.5, ease));
        const hot = P(t, mid('waste', 0.75), 0.6, linear);
        op(sGlow, hot * 0.9); op(sHW, hot); sHW.upd(t);
        // Effie, the judge, bottom left of the screen, until Jules and Constance turn up
        if (t < cSC2) {
          effOn = 1; op(effie, 1); tr(effie, 420, 600, 0.55);
          const gauge = t < mid('divide', 0.62) ? 0.05 + 0.4 * P(t, at('fan'), 3, ease) : lerp(0.45, 0.75, P(t, mid('divide', 0.62), 0.8, pop));
          effie.set({ t, talk: scTalk(S, t, 'effie'), mood: 'smug', look: 0.7, gauge });
        }
        // hello: Theo pokes up under the wasted bar, waves
        if (t >= at('hello') - 0.3 && t < cEZ) {
          theoOn = 1; op(theo, 1);
          const up = P(t, at('hello') - 0.3, 0.5, easeOut);
          tr(theo, 1095, lerp(860, 630, up), 0.62);
          theo.set({ t, talk: scTalk(S, t, 'theo'), mood: 'sad', look: -0.4 });
          op(tArm, 1); tArm.setAttribute('transform', `rotate(${(Math.sin(t * 6) * 14).toFixed(1)} 70 10)`);
        } else op(tArm, 0);
        // more: Jules slaps a 110% note over the 75%
        if (t >= cSC2) {
          julOn = 1; op(jul, 1); tr(jul, 1105, 600, 0.66);
          const told = t > mid('check', 0.12);
          jul.set({ t, talk: scTalk(S, t, 'jules'), mood: told ? 'shock' : 'happy', look: told ? -0.9 : -0.5, arms: told ? 0.2 : 1 });
          const np = P(t, mid('more', 0.62), 0.3, pop);
          op(note, clamp(np * 3)); tr(note, 900, 616, Math.max(0.01, lerp(1.6, 1, np)), -6);
          conOn = t >= at('check') - 0.3 ? 1 : 0;
          if (conOn) {
            const cu = P(t, at('check') - 0.3, 0.4, easeOut);
            op(con, 1); tr(con, 570, lerp(860, 630, cu), 0.58);
            con.set({ t, talk: scTalk(S, t, 'con'), mood: 'deadpan', look: 0.6 });
          }
          op(deniedS, t >= mid('check', 0.08) ? 1 : 0); deniedS.set(P(t, mid('check', 0.08), 0.35, linear)); tr(deniedS, 900, 616, 0.8);
          popIn(outIn, t, mid('check', 0.5), 820, 130);
          effOn = 1; op(effie, 1); tr(effie, 420, 600, 0.55);
          effie.set({ t, mood: t > mid('check', 0.1) ? 'smug' : 'annoyed', look: 0.8, gauge: 0.75 });
        }
      }
    }
    // pom-poms on Jules' hands (only for "Useful Over Total")
    const pomOn = sSC && t >= at('uot') - 0.1 && t < at('fan') - 0.1;
    poms.forEach((p, i) => {
      op(p, pomOn ? 1 : 0); if (!pomOn) return;
      const sd = i ? 1 : -1, k = 1, w = Math.sin(t * TAU * 2.2 + i * 1.7) * 26 * k;
      tr(p, sd * (108 + 6 * k), -14 - 40 * k + w);
    });

    /* ---------- Sankey: grow, branch, Theo at the end ---------- */
    op(skG, sSK); op(skTitle, 0); op(skWidth, 0); op(brUse, 0); op(brWaste, 0);
    skPaths.forEach(p => { p.setAttribute('stroke', SC_INK); p.setAttribute('stroke-width', 4); });
    if (sSK) {
      sk.set(P(t, mid('sankey', 0.1), 2.6, ease));
      sk.label(t < cAl ? P(t, mid('sankey', 0.55), 0.5, linear) : 1);
      popIn(skTitle, t, mid('sankey', 0.02), 990, 230);
      if (t >= cAl) op(skTitle, 0);
      const wv = t < at('branch') ? P(t, mid('sankey', 0.6), 0.45, pop) : 1 - P(t, at('branch'), 0.2, linear);
      op(skWidth, clamp(wv * 3)); if (wv > 0) tr(skWidth, 990, 470, Math.max(0.01, 0.7 + 0.3 * Math.min(1, wv)));
      if (t >= at('branch') && t < cFat) {
        const pu = win(t, mid('branch', 0.02), mid('branch', 0.5), 0.15), pw = win(t, mid('branch', 0.45), end('branch') + 0.4, 0.15);
        const pulse = 0.5 + 0.5 * Math.sin(t * 9);
        if (pu > 0.1) { skPaths[1].setAttribute('stroke', '#FFFFFF'); skPaths[1].setAttribute('stroke-width', 4 + 6 * pulse * pu); }
        if (pw > 0.1) { skPaths[2].setAttribute('stroke', '#FFFFFF'); skPaths[2].setAttribute('stroke-width', 4 + 6 * pulse * pw); }
        popIn(brUse, t, mid('branch', 0.08), 1000, 300);
        popIn(brWaste, t, mid('branch', 0.5), 930, 650);
      }
      if (t >= cAl) {
        const push = P(t, cAl, S.D - cAl, linear), k = 1 + 0.06 * push;   // slow push-in on Theo, tag area stays clear
        view(cam, k, 560, 600, 560, 600);
        theoOn = 1; op(theo, 1); tr(theo, 560, 638, 0.5);
        theo.set({ t, talk: scTalk(S, t, 'theo'), mood: t > end('always') ? 'deadpan' : 'sad', look: 0, glow: 1 });
        op(tArm, 0);
      }
    }
    op(fat, sFat);
    if (sFat) {
      skA.set(P(t, at('fat'), 1.0, ease)); skB.set(P(t, mid('fat', 0.3), 1.0, ease));
      effOn = 1; op(effie, 1); tr(effie, 1105, 625, 0.56);
      effie.set({ t, talk: scTalk(S, t, 'effie'), mood: 'smug', look: -0.6, gauge: 0.9 });
    }

    if (!effOn) op(effie, 0);
    if (!julOn) op(jul, 0);
    if (!theoOn) op(theo, 0);
    if (!conOn) op(con, 0);
  };
});
