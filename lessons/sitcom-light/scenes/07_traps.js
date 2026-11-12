/* Scene 7: The cast saves you some marks.
   Shots: "7 EXAM TRAPS" chalked on a blackboard, the cast lined up (Indigo small at the end of the row) ->
   seven snappy confessionals, one trap card each: Norman (angles from the normal), Mirabel (virtual, it hurts),
   Dennis (towards the normal only when slowing), Violet (violet most, red least), Ray (a prism separates),
   Rosie (the apple reflects red), Kavya (eyes only receive) -> the logo, "LIGHT WORK will return" ->
   stinger: Indigo alone in his confessional, "Did anyone notice I was here?" -> Ray leans in, "Course we did,
   Blue." -> Indigo, deadpan, "...Indigo." ("blue?" crossed out), long hold, final frame Indigo under the logo. */
scene('traps', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;

  /* ---------- helpers (prefixed traps) ---------- */
  function trapsCam(el, cx, cy, k) {
    cx = clamp(cx, 600 / k, 1200 - 600 / k); cy = clamp(cy, 375 / k, 750 - 375 / k);
    const v = `translate(600 375) scale(${k.toFixed(4)}) translate(${(-cx).toFixed(1)} ${(-cy).toFixed(1)})`;
    if (el.trapsCamV === v) return; el.trapsCamV = v;
    el.setAttribute('transform', `translate(600 375) scale(${k.toFixed(4)}) translate(${(-cx).toFixed(1)} ${(-cy).toFixed(1)})`);
  }
  function trapsPop(el, t, t0, x, y, s, r) { const p = P(t, t0, 0.45, pop); op(el, clamp(p * 2.5)); tr(el, x, y, Math.max(0.01, (s || 1) * (0.7 + 0.3 * p)), r); }
  // fade in a piece drawn at absolute card coordinates
  const trapsIn = (el, t, t0) => op(el, P(t, t0, 0.3, linear));
  function trapsRich(parent, x, y, parts, o) {
    o = o || {};
    const t = E('text', { x, y, 'font-size': o.size || 36, 'font-weight': 700, fill: C.ink, 'text-anchor': o.anchor || 'middle', 'font-family': FD }, parent);
    parts.forEach(([s, c, w]) => { const sp = E('tspan', { fill: c || C.ink }, t); if (w) sp.setAttribute('font-weight', w); sp.textContent = s; });
    return t;
  }
  const CX = 880;
  function trapsCard(parent, n) {
    const g = G(parent);
    card(g, 600, 140, 560, 460, { fill: C.card, stroke: C.line, opacity: 0.95 });
    const head = chip(g, 'TRAP ' + n, { size: 30, fill: C.bad, color: '#FFFFFF', weight: 800 }); tr(head, CX, 188);
    return g;
  }

  /* ---------- layers ---------- */
  const world = G(root), bgL = G(world), charL = G(world), fx = G(world), hud = G(root);

  /* ---------- sets ---------- */
  const introBg = G(bgL);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#1C1626', '#0A1B27', true) }, introBg);
  E('rect', { x: 0, y: 600, width: 1200, height: 150, fill: '#2A2236' }, introBg);
  E('rect', { x: 206, y: 112, width: 788, height: 252, rx: 12, fill: '#8A5A3A', stroke: '#5E3B22', 'stroke-width': 4 }, introBg);
  E('rect', { x: 222, y: 128, width: 756, height: 220, rx: 6, fill: '#1F3B2E' }, introBg);
  E('path', { d: 'M260,320 Q320,300 380,322 M820,170 Q880,160 930,176', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 3, opacity: 0.12 }, introBg);
  const KINDS = ['norman', 'mirabel', 'dennis', 'violet', 'ray', 'rosie', 'kavya', 'indigo'];
  // one confessional set, recoloured per speaker (saves seven copies)
  const conf = lwConf(bgL, 'indigo'), confFill = {};
  KINDS.forEach(k => { confFill[k] = linGrad(LW_TINT[k][0], LW_TINT[k][1], true); });
  const logoBg = G(bgL);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#0E1430', '#2A1F4A', true) }, logoBg);
  let rp = '';
  for (let i = 0; i < 16; i++) { const a0 = i / 16 * TAU, a1 = a0 + TAU / 40; rp += `M0,0 L${(Math.cos(a0) * 1100).toFixed(0)},${(Math.sin(a0) * 1100).toFixed(0)} L${(Math.cos(a1) * 1100).toFixed(0)},${(Math.sin(a1) * 1100).toFixed(0)} Z `; }
  const logoRays = E('path', { d: rp, fill: '#FFE45C', opacity: 0.07 }, logoBg);

  /* ---------- the cast: one of each, moved between shots ---------- */
  const ch = {};
  KINDS.forEach(k => { ch[k] = cast(charL, k, k === 'kavya' ? { outfit: 'pe' } : {}); op(ch[k], 0); });

  /* ===== intro ===== */
  const shI = G(fx);
  const iHead = T(shI, 600, 232, '7 EXAM TRAPS', { size: 80, weight: 800, anchor: 'middle', fill: '#F2F7FA', ls: 3 });
  const iSub = T(shI, 600, 300, 'the cast saves you some marks', { size: 34, weight: 600, anchor: 'middle', fill: '#CFE7D8' });
  const LINE = { norman: [110, 0.5], mirabel: [250, 0.5], dennis: [400, 0.5], violet: [545, 0.58], ray: [690, 0.52], rosie: [840, 0.52], kavya: [990, 0.52], indigo: [1120, 0.42] };
  const LMOOD = { norman: 'neutral', mirabel: 'smug', dennis: 'happy', violet: 'happy', ray: 'deadpan', rosie: 'deadpan', kavya: 'annoyed', indigo: 'sad' };

  /* ===== trap cards ===== */
  const cards = [];
  // 1 Norman: angles from the normal
  { const g = trapsCard(fx, 1), p = {};
    p.a = trapsRich(g, CX, 262, [['angles from the ', C.ink], ['NORMAL', C.glucose, 800]], { size: 38 });
    p.d = G(g);
    E('line', { x1: 720, y1: 470, x2: 1040, y2: 470, stroke: '#C9D6DF', 'stroke-width': 6, 'stroke-linecap': 'round' }, p.d);
    lwNormal(p.d, 880, 470, -90, 150, { back: 0, square: true });
    const s0 = lwPt(880, 470, -130, 190); lwLightRay(p.d, s0[0], s0[1], 880, 470, { width: 5, head: 16 });
    p.ok = G(g); lwArc(p.ok, 880, 470, -90, -130, 70, { text: 'i = {deg}° ✓', size: 28, lr: 112 });
    p.no = G(g); lwArc(p.no, 880, 470, 180, 230, 110, { color: C.bad, text: '{deg}° ✗', size: 28, lr: 150 });
    p.b = T(g, CX, 560, 'never from the surface', { size: 34, weight: 700, anchor: 'middle', fill: '#FF9AA4' });
    cards.push({ g, p });
  }
  // 2 Mirabel: virtual, not real
  { const g = trapsCard(fx, 2), p = {};
    p.a = T(g, CX, 258, 'A plane mirror image is', { size: 34, weight: 600, anchor: 'middle' });
    p.v = G(g); T(p.v, -20, 20, 'VIRTUAL', { size: 60, weight: 800, anchor: 'middle', fill: C.good }); tr(tick(p.v, 18), 150, 0);
    p.r = G(g); T(p.r, 0, 14, 'real', { size: 44, weight: 700, anchor: 'middle', fill: '#FF9AA4' }); p.r.st = strike(p.r, -60, 0, 60, C.bad); tr(cross(p.r, 15), 100, 0);
    p.d = G(g);
    const m = lwPlaneMirror(p.d, 110); tr(m, CX, 492, 1, 90);
    E('path', { d: `M${CX - 90},535 L${CX - 90},455 M${CX - 104},470 L${CX - 90},452 L${CX - 76},470`, fill: 'none', stroke: C.glucose, 'stroke-width': 6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, p.d);
    E('path', { d: `M${CX + 90},535 L${CX + 90},455 M${CX + 76},470 L${CX + 90},452 L${CX + 104},470`, fill: 'none', stroke: C.glucose, 'stroke-width': 5, 'stroke-dasharray': '9 7', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: 0.8 }, p.d);
    T(p.d, CX - 150, 500, 'you', { size: 26, weight: 600, anchor: 'end', fill: C.muted }); T(p.d, CX + 150, 500, 'image', { size: 26, weight: 600, anchor: 'start', fill: C.muted });
    p.b = T(g, CX, 572, "can't be caught on a screen", { size: 28, weight: 600, anchor: 'middle', fill: C.muted, font: FB });
    cards.push({ g, p });
  }
  // 3 Dennis: towards the normal only when slowing
  { const g = trapsCard(fx, 3), p = {};
    p.a = trapsRich(g, CX, 258, [['bends ', C.ink], ['TOWARDS', C.water, 800], [' the normal', C.ink]], { size: 36 });
    p.d = G(g);
    E('rect', { x: 700, y: 430, width: 360, height: 100, fill: LW_OPT.waterFill }, p.d);
    E('line', { x1: 700, y1: 430, x2: 1060, y2: 430, stroke: C.water, 'stroke-width': 4 }, p.d);
    lwNormal(p.d, 880, 430, -90, 110, { back: 95 });
    const s0 = lwPt(880, 430, -130, 150), r = lwSnell(40, 1, 1.33), e = lwPt(880, 430, 90 - r, 115);
    lwRayPath(p.d, [s0, [880, 430], e], { width: 5, head: 16 });
    lwArc(p.d, 880, 430, -90, -130, 55, { text: '40°', size: 26, lr: 90 });
    lwArc(p.d, 880, 430, 90, 90 - r, 55, { color: LW_OPT.angR, text: '{deg}°', size: 26, lr: 90 });
    T(p.d, 1045, 410, 'air: fast', { size: 26, weight: 700, fill: '#9FD8FF', anchor: 'end' });
    T(p.d, 716, 515, 'water: slow', { size: 26, weight: 700, fill: '#BDEBFF' });
    p.b = trapsRich(g, CX, 572, [['ONLY', C.energy, 800], [' when it slows, into a ', C.ink], ['denser', C.energy, 800], [' medium', C.ink]], { size: 28 });
    cards.push({ g, p });
  }
  // 4 Violet: violet bends most, red least
  { const g = trapsCard(fx, 4), p = {};
    p.a = trapsRich(g, CX, 252, [['VIOLET', '#C49BFF', 800], [' bends the MOST', C.ink]], { size: 34 });
    p.a2 = trapsRich(g, CX, 296, [['RED', '#FF6B6B', 800], [' bends the LEAST', C.ink]], { size: 34 });
    p.d = G(g);
    const pr = lwPrism(p.d, 170); pr.at(850, 420);
    const st = [700, 450], deg = lwAng([835 - 700, 405 - 450]);
    ['red', 'violet'].forEach(n => { const h = LW_SPECTRUM.find(q => q.name === n); lwRayPath(p.d, pr.trace(st, deg, h.n, 150), { color: h.color, width: 5, glow: false, head: 15, heads: [2] }); });
    lwLightRay(p.d, st[0], st[1], 835, 405, { color: LW_OPT.white, width: 5, head: 16 });
    p.lab = G(g);
    const er = pr.trace(st, deg, 1.47, 150), ev = pr.trace(st, deg, 1.63, 150);
    T(p.lab, er[er.length - 1][0] + 6, er[er.length - 1][1] - 4, 'least', { size: 26, weight: 700, fill: '#FF6B6B' });
    T(p.lab, ev[ev.length - 1][0] - 4, ev[ev.length - 1][1] + 30, 'most', { size: 26, weight: 700, fill: '#C49BFF', anchor: 'end' });
    p.b = T(g, CX, 572, 'not the other way round!', { size: 30, weight: 700, anchor: 'middle', fill: C.energy });
    cards.push({ g, p });
  }
  // 5 Ray: a prism separates, it does not add
  { const g = trapsCard(fx, 5), p = {};
    p.a = trapsRich(g, CX, 258, [['a prism ', C.ink], ['SEPARATES', C.good, 800], [' colours', C.ink]], { size: 36 });
    p.d = G(g);
    const pr = lwPrism(p.d, 170); pr.at(850, 410);
    const st = [700, 440], deg = lwAng([835 - 700, 395 - 440]);
    LW_SPECTRUM.forEach(h => lwRayPath(p.d, pr.trace(st, deg, h.n, 150), { color: h.color, width: 4, glow: false, head: 13, heads: [2] }));
    lwLightRay(p.d, st[0], st[1], 835, 395, { color: LW_OPT.white, width: 5, head: 16 });
    T(p.d, 690, 372, 'white light', { size: 26, weight: 600, fill: C.muted });
    p.no = G(g); T(p.no, CX - 20, 564, 'it ADDS colour', { size: 34, weight: 700, anchor: 'middle', fill: '#FF9AA4' }); p.no.st = strike(p.no, CX - 140, 552, CX + 100, C.bad); tr(cross(p.no, 14), CX + 140, 552);
    cards.push({ g, p });
  }
  // 6 Rosie: the apple reflects red, absorbs the rest
  { const g = trapsCard(fx, 6), p = {};
    p.a = T(g, CX, 252, 'A red apple...', { size: 34, weight: 600, anchor: 'middle' });
    p.no = G(g); T(p.no, CX - 20, 304, 'turns light red', { size: 32, weight: 700, anchor: 'middle', fill: '#FF9AA4' }); p.no.st = strike(p.no, CX - 140, 293, CX + 100, C.bad); tr(cross(p.no, 13), CX + 136, 293);
    p.d = G(g);
    const ap = lwApple(p.d, 0.85); tr(ap, 780, 450, 0.85);
    LW_SPECTRUM.forEach((h, i) => {
      const a = (-110 - i * 9) * Math.PI / 180, e = [780 + Math.cos(a) * 50, 450 + Math.sin(a) * 50];
      lwRayPath(p.d, [[650 + i * 4, 340], e], { color: h.color, width: 3, glow: false, head: 11, at: 0.45 });
    });
    lwRayPath(p.d, [[790, 402], [1010, 372]], { color: '#FF4D4D', width: 5, head: 16 });
    const ey = lwEyeIcon(p.d, 1.1); tr(ey, 1050, 372);
    p.b = trapsRich(g, CX, 568, [['REFLECTS', '#FF6B6B', 800], [' red, ', C.ink], ['ABSORBS', C.muted, 800], [' the rest', C.ink]], { size: 32 });
    cards.push({ g, p });
  }
  // 7 Kavya: eyes only receive
  { const g = trapsCard(fx, 7), p = {};
    p.a = trapsRich(g, CX, 258, [['eyes only ', C.ink], ['RECEIVE', C.energy, 800], [' light', C.ink]], { size: 38 });
    p.no = G(g);
    const e2 = lwEyeIcon(p.no, 1.5); tr(e2, 1000, 370);
    E('path', { d: 'M950,362 L700,330 M950,378 L700,410', stroke: '#FF3B3B', 'stroke-width': 7, 'stroke-linecap': 'round', opacity: 0.85 }, p.no);
    tr(cross(p.no, 18), 820, 370);
    T(p.no, 700, 450, 'nothing comes OUT', { size: 28, weight: 700, fill: '#FF9AA4' });
    p.d = G(g);
    const e1 = lwEyeIcon(p.d, 1.5); tr(e1, 1000, 520);
    lwLightRay(p.d, 680, 520, 940, 520, { width: 6, head: 18 });
    tr(tick(p.d, 15, C.good), 1090, 520);
    T(p.d, 680, 568, 'light comes IN', { size: 28, weight: 700, fill: C.energyLt });
    cards.push({ g, p });
  }

  /* ===== logo ===== */
  const shR = G(fx);
  const rLogo = T(shR, 0, 0, 'LIGHT WORK', { size: 104, weight: 800, anchor: 'middle', fill: '#FFF3B0', ls: 4 });
  rLogo.setAttribute('stroke', '#5A4A10'); rLogo.setAttribute('stroke-width', 12); rLogo.setAttribute('paint-order', 'stroke'); rLogo.setAttribute('stroke-linejoin', 'round');
  const rBeam = lwLightRay(shR, 260, 392, 940, 392, { width: 8, at: 0.92 });
  const rSub = T(shR, 600, 470, 'will return', { size: 46, weight: 700, anchor: 'middle', fill: '#FFFFFF' });

  /* ===== stinger ===== */
  const swatch = G(hud);
  { const c = chip(swatch, 'blue?', { size: 34, fill: '#3B82F6', color: '#FFFFFF', stroke: '#FFFFFF', sw: 3 }); tr(c, 0, 0); swatch.st = strike(swatch, -60, 0, 60, C.bad); }
  const swatch2 = G(hud); { const c = chip(swatch2, 'INDIGO', { size: 38, fill: '#5B5BD6', color: '#FFFFFF', stroke: '#FFFFFF', sw: 3, weight: 800 }); tr(c, 0, 0); }
  const endLogo = G(hud);
  { const l = T(endLogo, 600, 150, 'LIGHT WORK', { size: 64, weight: 800, anchor: 'middle', fill: '#FFF3B0', ls: 3 });
    l.setAttribute('stroke', '#2A2050'); l.setAttribute('stroke-width', 8); l.setAttribute('paint-order', 'stroke'); l.setAttribute('stroke-linejoin', 'round'); }

  /* ---------- shots ---------- */
  const SPK = ['norman', 'mirabel', 'dennis', 'violet', 'ray', 'rosie', 'kavya'];
  const SHOTS = [['I', -9]].concat(SPK.map((k, i) => [String(i + 1), at('t' + (i + 1)) - 0.05]), [['R', at('return') - 0.05], ['W', at('anyone') - 0.05]]);
  const shotAt = t => { let s = 'I'; for (const [k, t0] of SHOTS) if (t >= t0) s = k; return s; };
  const SCALE = { norman: 1.15, mirabel: 1.25, dennis: 1.25, violet: 1.6, ray: 1.2, rosie: 1.3, kavya: 1.2 };

  return t => {
    const sh = shotAt(t);
    op(introBg, sh === 'I' ? 1 : 0); op(logoBg, sh === 'R' ? 1 : 0); op(shI, sh === 'I' ? 1 : 0); op(shR, sh === 'R' ? 1 : 0);
    cards.forEach((c, i) => op(c.g, sh === String(i + 1) ? 1 : 0));
    const confK = sh === 'W' ? 'indigo' : (SPK[+sh - 1] || '');
    conf.set(confK ? 1 : 0, t); if (confK && conf.firstChild.getAttribute('fill') !== confFill[confK]) conf.firstChild.setAttribute('fill', confFill[confK]);
    const shown = {};
    op(swatch, 0); op(swatch2, 0); op(endLogo, 0);
    let cam = [600, 375, 1];
    const show = (k, x, y, s, st, r) => { shown[k] = 1; op(ch[k], 1); tr(ch[k], x, y, s, r); ch[k].set(Object.assign({ t, talk: scTalk(S, t, k) }, st)); };

    if (sh === 'I') {
      const hp = P(t, at('intro') + 0.05, 0.5, pop); op(iHead, clamp(hp * 2));
      iHead.setAttribute('transform', `translate(600 205) scale(${(0.7 + 0.3 * hp).toFixed(3)}) translate(-600 -205)`);
      op(iSub, P(t, mid('intro', 0.4), 0.4, linear));
      KINDS.forEach((k, i) => {
        const [x, s] = LINE[k], p = P(t, mid('intro', 0.3) + i * 0.1, 0.45, pop);
        shown[k] = 1; op(ch[k], clamp(p * 3)); tr(ch[k], x, 545 + 30 * (1 - clamp(p)), Math.max(0.01, s * p));
        ch[k].set({ t, mood: LMOOD[k], look: k === 'indigo' ? -0.5 : 0 });
      });
      cam = [600, 375, 1];
    } else if (sh === 'R') {
      tr(logoRays, 600, 600, 1, (t * 6 * AMP) % 360);
      const lp = P(t, at('return') + 0.05, 0.6, pop); op(rLogo, clamp(lp * 2.5)); tr(rLogo, 600, 330, Math.max(0.01, 0.5 + 0.5 * lp));
      rBeam.set(P(t, at('return') + 0.35, 0.6, easeOut));
      op(rSub, P(t, mid('return', 0.5), 0.4, linear));
    } else if (sh === 'W') {
      // the stinger: Indigo alone in an empty confessional
      const rayIn = P(t, at('course') - 0.15, 0.35, easeOut);
      const rayOut = P(t, end('indigo') + 0.5, 0.4, easeIn);
      let iMood = 'neutral', iLook = 0;
      if (t > at('course') - 0.1) { iMood = 'happy'; iLook = 0.8; }
      if (t > mid('course', 0.85)) { iMood = 'deadpan'; iLook = 0.8; }
      if (t > end('course') + 0.5) iLook = 0;
      if (t > end('indigo') + 0.4) iLook = 0;
      const ix = 600, iy = 460;
      show('indigo', ix, iy, 0.95, { mood: iMood, look: iLook });
      if (rayIn > 0 && rayOut < 1) {
        const rx = lerp(1380, 1060, rayIn) + 340 * rayOut;
        show('ray', rx, 440, 1.25, { mood: t < end('course') ? 'happy' : 'deadpan', look: -0.9 }, -16);
      }
      // "blue?" flickers, gets crossed out, INDIGO stamps in
      const sw0 = end('course') + 0.15;
      if (t > sw0) {
        const flick = t < sw0 + 0.6 ? (Math.sin(t * 40) > 0 ? 1 : 0.3) : 1;
        op(swatch, flick * (1 - P(t, end('indigo') + 0.9, 0.3, linear))); tr(swatch, 800, 330, 1, -6);
        swatch.st.set(P(t, at('indigo') + 0.2, 0.3));
      }
      const ip = P(t, mid('indigo', 0.8), 0.45, pop); op(swatch2, clamp(ip * 2.5)); tr(swatch2, 800, 400, Math.max(0.01, 0.6 + 0.4 * ip), -3);
      op(endLogo, P(t, end('indigo') + 0.9, 0.6, linear));
      // camera: wide and empty, then a long slow push on Indigo's face
      const push = P(t, end('course') + 0.1, end('indigo') + 1.2 - end('course'), linear);
      cam = [lerp(600, 640, push), lerp(375, 420, push), 1 + 0.32 * ease(push)];
      if (t > end('indigo') + 0.9) { const back = P(t, end('indigo') + 0.9, 0.8, ease); cam = [lerp(640, 600, back), lerp(420, 375, back), lerp(1.32, 1, back)]; }
    } else {
      const i = +sh - 1, k = SPK[i], line = 't' + (i + 1), c = cards[i].p;
      let mood = { norman: 'neutral', mirabel: 'smug', dennis: 'neutral', violet: 'happy', ray: 'deadpan', rosie: 'deadpan', kavya: 'annoyed' }[k];
      let y = 400;
      if (k === 'norman' && t > mid(line, 0.62)) mood = 'annoyed';
      if (k === 'mirabel' && t > mid(line, 0.6)) mood = 'sad';
      if (k === 'dennis' && t > end(line)) mood = 'happy';
      if (k === 'rosie' && t > mid(line, 0.75)) mood = 'smug';
      if (k === 'violet') y = 410 - Math.abs(Math.sin(t * 5)) * 18 * AMP;
      show(k, 320, y, SCALE[k], { mood, look: 0 });
      const a = at(line);
      if (k === 'norman') { trapsIn(c.a, t, a + 0.15); trapsIn(c.d, t, mid(line, 0.2)); trapsIn(c.ok, t, mid(line, 0.3)); trapsIn(c.no, t, mid(line, 0.55)); trapsIn(c.b, t, mid(line, 0.55)); }
      if (k === 'mirabel') { trapsIn(c.a, t, a + 0.1); trapsPop(c.v, t, mid(line, 0.3), CX, 325); trapsIn(c.r, t, mid(line, 0.45)); c.r.st.set(P(t, mid(line, 0.52), 0.3)); trapsIn(c.d, t, mid(line, 0.6)); trapsIn(c.b, t, mid(line, 0.7)); tr(c.r, CX, 392); }
      if (k === 'dennis') { trapsIn(c.a, t, a + 0.15); trapsIn(c.d, t, mid(line, 0.25)); trapsIn(c.b, t, mid(line, 0.6)); }
      if (k === 'violet') { trapsIn(c.a, t, a + 0.1); trapsIn(c.d, t, mid(line, 0.2)); trapsIn(c.a2, t, mid(line, 0.45)); trapsIn(c.lab, t, mid(line, 0.5)); trapsIn(c.b, t, mid(line, 0.75)); }
      if (k === 'ray') { trapsIn(c.a, t, mid(line, 0.45)); trapsIn(c.d, t, mid(line, 0.5)); trapsIn(c.no, t, mid(line, 0.15)); c.no.st.set(P(t, mid(line, 0.32), 0.3)); }
      if (k === 'rosie') { trapsIn(c.a, t, a + 0.1); trapsIn(c.no, t, mid(line, 0.2)); c.no.st.set(P(t, mid(line, 0.36), 0.3)); trapsIn(c.d, t, mid(line, 0.5)); trapsIn(c.b, t, mid(line, 0.6)); }
      if (k === 'kavya') { trapsIn(c.no, t, mid(line, 0.15)); trapsIn(c.a, t, mid(line, 0.55)); trapsIn(c.d, t, mid(line, 0.6)); }
      cam = [600, 375, 1];
    }
    for (const k in ch) if (!shown[k]) op(ch[k], 0);
    trapsCam(world, cam[0], cam[1], cam[2]);
  };
});
