/* Scene 7: The staff save you some marks.
   Shots: "7 EXAM TRAPS" over the line map (a warning sign pops at every station) -> seven snappy
   confessionals, one trap card each (Percy, Amy, Priya, Bill, Lionel, Phoebe, Kavya) -> logo "MIND THE GUT
   will return" -> stinger in Vinny's confessional: Percy asks, a long silence (Vinny waves and blinks),
   "...I'm a villus. Singular." (tiny mouth), Amy bursts in ("He TALKS!"), Percy: "Don't encourage him."
   -> final frame: Vinny waving under the logo. */
scene('traps', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;
  const talk = (t, who) => scTalk(S, t, who);

  /* ---------- helpers (prefixed traps) ---------- */
  function trapsFit(parent, x, y, str, o, maxW) {
    let size = o.size;
    while (size > 26 && textWidth(str.replace(/\*\*/g, ''), size, o.font || FD, o.weight || 600) > maxW) size -= 1;
    return T(parent, x, y, str, Object.assign({}, o, { size }));
  }
  function trapsCam(cx, cy, k) {
    cx = clamp(cx, 600 / k, 1200 - 600 / k); cy = clamp(cy, 375 / k, 750 - 375 / k);
    attr(world, 'transform', `translate(600 375) scale(${k.toFixed(4)}) translate(${(-cx).toFixed(1)} ${(-cy).toFixed(1)})`);
  }
  function trapsPop(el, t, t0, x, y, s) { const p = P(t, t0, 0.4, pop); op(el, clamp(p * 2.5)); tr(el, x, y, Math.max(0.01, (s || 1) * (0.7 + 0.3 * p))); return p; }
  function trapsPopAt(el, t, t0, cx, cy) { const p = P(t, t0, 0.4, pop), s = Math.max(0.01, 0.7 + 0.3 * p); op(el, clamp(p * 2.5)); el.setAttribute('transform', `translate(${cx} ${cy}) scale(${s.toFixed(3)}) translate(${-cx} ${-cy})`); }
  const CX = 880;
  function trapsCard(parent, n, col) {
    const g = G(parent);
    card(g, 600, 130, 560, 470, { fill: C.card, stroke: col || C.line, sw: 3, opacity: 0.95 });
    const head = chip(g, 'TRAP ' + n, { size: 30, fill: C.bad, color: '#FFFFFF', weight: 800 }); tr(head, CX, 180);
    return g;
  }
  // a row: tick or cross, then text
  function trapsRow(parent, y, good, str, o) {
    const g = G(parent);
    const ic = good ? tick(g, 16) : cross(g, 14); tr(ic, 650, y - 12);
    trapsFit(g, 684, y, str, Object.assign({ size: 34, weight: 600 }, o), 450);
    return g;
  }
  // text in coloured parts: [[text, fill], ...]
  function trapsRich(parent, x, y, segs, o) {
    o = o || {};
    const t = E('text', { x, y, 'font-size': o.size || 34, 'font-weight': 700, 'text-anchor': o.anchor || 'middle', 'font-family': FD, fill: C.ink }, parent);
    segs.forEach(([s, f, w]) => { const sp = E('tspan', { fill: f || C.ink, 'font-weight': w || 700 }, t); sp.textContent = s; });
    return t;
  }
  // blink exactly on a cue: shift the time passed to the face so its blink lands there (Vinny's seed is 29)
  const BLINK = 3.1 + (29 % 5) * 0.37, BOFF = 29 * 0.71;
  function trapsBlinkT(t, cues) {
    for (const b of cues) if (t < b + 0.2) { const s = ((0.065 - (b + BOFF)) % BLINK + BLINK) % BLINK; return t + s; }
    return t;
  }
  function trapsLogo(parent) {
    const g = G(parent);
    E('rect', { x: -400, y: -78, width: 800, height: 156, rx: 78, fill: '#FFFFFF', stroke: MG_LINEDK, 'stroke-width': 8 }, g);
    E('rect', { x: -400, y: 34, width: 800, height: 22, fill: MG_LINE }, g);
    E('circle', { cx: -322, cy: -8, r: 52, fill: MG_LINE, stroke: '#FFFFFF', 'stroke-width': 5 }, g);
    T(g, -322, 4, 'AL', { size: 40, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
    T(g, 40, 14, 'MIND THE GUT', { size: 76, weight: 800, anchor: 'middle', fill: MG_NAVY });
    return g;
  }

  /* ---------- layers ---------- */
  const world = G(root), bgL = G(world), charL = G(world), fx = G(root);

  /* ---------- sets ---------- */
  const introBg = G(bgL);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#0C1A26', '#14283A', true) }, introBg);
  { let d = ''; for (let x = 0; x <= 1200; x += 60) d += `M${x},0 L${x},750 `; for (let y = 0; y <= 750; y += 60) d += `M0,${y} L1200,${y} `; E('path', { d, stroke: '#1E3A50', 'stroke-width': 1.5 }, introBg); }
  const KINDS = ['percy', 'amy', 'priya', 'bill', 'lionel', 'phoebe', 'kavya', 'vinny'];
  const confs = {};
  KINDS.forEach(k => { confs[k] = mgConf(bgL, k); });
  const logoBg = G(bgL);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#2A0A1E', '#5A1A3A', true) }, logoBg);
  let rays = '';
  for (let i = 0; i < 16; i++) { const a0 = i / 16 * TAU, a1 = a0 + TAU / 40; rays += `M0,0 L${(Math.cos(a0) * 1100).toFixed(0)},${(Math.sin(a0) * 1100).toFixed(0)} L${(Math.cos(a1) * 1100).toFixed(0)},${(Math.sin(a1) * 1100).toFixed(0)} Z `; }
  const rayP = E('path', { d: rays, fill: '#FF9FC4', opacity: 0.07 }, logoBg);

  /* ---------- the cast: one of each ---------- */
  const ch = {};
  KINDS.forEach(k => { ch[k] = cast(charL, k, { s: 1 }); op(ch[k], 0); });
  const vWrap = G(charL); vWrap.appendChild(ch.vinny);

  /* ===== intro: 7 EXAM TRAPS ===== */
  const shI = G(fx);
  const iHead = T(shI, 600, 200, '7 EXAM TRAPS', { size: 80, weight: 800, anchor: 'middle', fill: C.energy, ls: 3 });
  const iSub = T(shI, 600, 258, 'the staff of the line save you some marks', { size: 34, weight: 600, anchor: 'middle', fill: C.muted });
  const imap = mgLineMap(shI); tr(imap, 600, 480, 0.92); imap.set(-1, 0);
  const warns = [0, 1, 2, 3, 4, 5, 6].map(i => {
    const g = G(shI), x = 600 + imap.x(i) * 0.92, y = 480 + (i % 2 === 0 ? -112 : 128);
    E('path', { d: 'M0,-30 L30,22 L-30,22 Z', fill: '#FFD23A', stroke: '#D7263D', 'stroke-width': 5, 'stroke-linejoin': 'round' }, g);
    T(g, 0, 16, '!', { size: 34, weight: 800, anchor: 'middle', fill: '#2A1A22' });
    g.mx = x; g.my = y; return g;
  });

  /* ===== trap cards ===== */
  const cards = {};
  // 1 Percy
  { const g = trapsCard(fx, 1, MG_LINE), c = { g };
    c.a = G(g); T(c.a, CX, 262, 'not just the stomach!', { size: 38, weight: 700, anchor: 'middle', fill: '#FF9AA4' }); c.aSt = strike(c.a, CX - 190, 250, CX + 190, C.bad);
    c.b = trapsRow(g, 350, true, 'STARTS in the **mouth**', { size: 38, boldFill: C.energy });
    c.c = trapsRow(g, 420, true, 'FINISHES in the **small intestine**', { size: 34, boldFill: C.energy });
    c.d = G(g);
    E('rect', { x: 650, y: 500, width: 460, height: 14, rx: 7, fill: MG_LINE }, c.d);
    [0, 1, 2, 3, 4, 5, 6].forEach(i => E('circle', { cx: 660 + i * 73, cy: 507, r: 9, fill: '#FFFFFF', stroke: MG_LINEDK, 'stroke-width': 4 }, c.d));
    E('path', { d: 'M660,540 L660,552 L879,552 L879,540', fill: 'none', stroke: C.energy, 'stroke-width': 5, 'stroke-linejoin': 'round' }, c.d);
    T(c.d, 770, 582, 'all digestion', { size: 26, weight: 700, anchor: 'middle', fill: C.energy });
    cards[1] = c; }
  // 2 Amy
  { const g = trapsCard(fx, 2, '#7FD6F7'), c = { g };
    c.a = G(g); T(c.a, CX - 30, 270, "Benedict's: **HEAT** it!", { size: 40, weight: 600, anchor: 'middle', boldFill: '#FF7A3A' });
    { const fl = G(c.a); tr(fl, 1100, 258); E('path', { d: 'M0,22 Q-22,6 -10,-14 Q-6,-2 0,-6 Q-4,-24 10,-34 Q8,-14 18,-4 Q22,14 0,22 Z', fill: '#FF7A3A', stroke: '#C2451A', 'stroke-width': 3 }, fl); E('path', { d: 'M0,16 Q-8,6 -2,-4 Q4,4 8,0 Q10,12 0,16 Z', fill: '#FFE45C' }, fl); }
    c.b = trapsRich(g, CX, 350, [['iodine: ', C.ink], ['orange-brown', '#F2A05A'], [' → ', C.ink], ['blue-black', '#9FA8FF']], { size: 30 });
    c.c = G(g);
    E('rect', { x: 720, y: 386, width: 110, height: 52, rx: 10, fill: '#C8701E', stroke: '#FFFFFF', 'stroke-width': 3 }, c.c);
    arrow(c.c, 846, 412, 914, 412, { color: C.ink, width: 6 });
    E('rect', { x: 930, y: 386, width: 110, height: 52, rx: 10, fill: '#1C1E46', stroke: '#FFFFFF', 'stroke-width': 3 }, c.c);
    c.d = G(g); T(c.d, CX, 500, 'NOT the other way round', { size: 32, weight: 700, anchor: 'middle', fill: '#FF9AA4' });
    T(c.d, CX, 548, 'blue-black → orange-brown', { size: 28, weight: 600, anchor: 'middle', fill: C.muted }); c.dSt = strike(c.d, CX - 175, 539, CX + 175, C.bad);
    cards[2] = c; }
  // 3 Priya
  { const g = trapsCard(fx, 3, '#C892F0'), c = { g };
    c.a = T(g, CX, 262, 'Enzymes are...', { size: 36, weight: 700, anchor: 'middle', fill: C.ink });
    c.b = trapsRow(g, 330, false, 'NOT alive (just molecules)', { size: 36 });
    c.c = trapsRow(g, 395, false, 'NOT used up', { size: 36 });
    c.d = T(g, CX, 470, "stomach acid doesn't digest food:", { size: 30, weight: 600, anchor: 'middle', fill: C.muted });
    c.e = T(g, CX, 540, '**protease** does', { size: 46, weight: 600, anchor: 'middle', boldFill: '#C892F0' });
    cards[3] = c; }
  // 4 Bill
  { const g = trapsCard(fx, 4, '#D2EC6A'), c = { g };
    c.a = T(g, CX, 262, 'Bile **EMULSIFIES** fat', { size: 40, weight: 600, anchor: 'middle', boldFill: '#D2EC6A' });
    c.b = T(g, CX, 312, "it does NOT digest it", { size: 32, weight: 700, anchor: 'middle', fill: '#FF9AA4' });
    c.c = G(g);
    const tag = chip(c.c, 'NOT ON THE LINE', { size: 26, fill: '#5A2030', stroke: '#FF6070', color: '#FFD0D6' }); tr(tag, CX, 372);
    E('path', { d: `M690,428 L${CX},500 M${CX},428 L${CX},500 M1070,428 L${CX},500`, fill: 'none', stroke: '#8A9AA6', 'stroke-width': 4, 'stroke-dasharray': '8 7' }, c.c);
    [['liver', 690], ['gall bladder', CX], ['pancreas', 1070]].forEach(([n, x]) => { const k = chip(c.c, n, { size: 26, fill: '#3A4652', stroke: '#8A9AA6', color: '#D5DEE4', padX: 12 }); tr(k, x, 428); });
    E('rect', { x: 640, y: 500, width: 480, height: 16, rx: 8, fill: MG_LINE }, c.c);
    [0, 1, 2, 3, 4, 5, 6].forEach(i => E('circle', { cx: 660 + i * 73.3, cy: 508, r: 9, fill: '#FFFFFF', stroke: MG_LINEDK, 'stroke-width': 4 }, c.c));
    T(c.c, CX, 560, 'joined only by ducts', { size: 28, weight: 600, anchor: 'middle', fill: C.muted });
    cards[4] = c; }
  // 5 Lionel
  { const g = trapsCard(fx, 5, '#7FE0D2'), c = { g };
    c.a = T(g, CX, 262, 'fat →', { size: 38, weight: 700, anchor: 'middle', fill: '#FFD25A' });
    c.b = T(g, CX, 322, 'fatty acids **AND** glycerol', { size: 42, weight: 700, anchor: 'middle', boldFill: C.bad });
    c.c = G(g); const f = mgFat(c.c, 0.62); tr(f, CX - 20, 418, 0.62); f.set(1);
    c.d = T(g, CX, 540, 'protein → **amino acids**', { size: 40, weight: 600, anchor: 'middle', boldFill: '#FFB3A8' });
    cards[5] = c; }
  // 6 Phoebe
  { const g = trapsCard(fx, 6, '#9BD77A'), c = { g };
    c.a = T(g, CX, 262, 'most leftover **water** is absorbed in the', { size: 28, weight: 600, anchor: 'middle', boldFill: C.water });
    c.b = T(g, CX, 330, 'LARGE intestine', { size: 52, weight: 800, anchor: 'middle', fill: C.water });
    c.c = trapsRow(g, 430, true, "fibre isn't useless", { size: 40, fill: '#C2EDA2' });
    c.d = T(g, CX, 520, '...apparently.', { size: 34, weight: 600, anchor: 'middle', fill: C.muted });
    cards[6] = c; }
  // 7 Kavya
  { const g = trapsCard(fx, 7, '#7FB0FF'), c = { g };
    c.a = T(g, CX, 262, 'deficiency diseases', { size: 40, weight: 700, anchor: 'middle', fill: C.ink });
    c.b = T(g, CX, 318, 'are **NOT** catching', { size: 40, weight: 600, anchor: 'middle', boldFill: C.bad });
    c.c = G(g); tr(c.c, CX, 425);
    { let d = ''; for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; d += `M${(Math.cos(a) * 40).toFixed(1)},${(Math.sin(a) * 40).toFixed(1)} L${(Math.cos(a) * 58).toFixed(1)},${(Math.sin(a) * 58).toFixed(1)} `; }
      E('path', { d, stroke: '#4E9A3A', 'stroke-width': 7, 'stroke-linecap': 'round' }, c.c);
      E('circle', { r: 42, fill: ball('#9BE07A', '#4E9A3A'), stroke: '#2E6B24', 'stroke-width': 4 }, c.c);
      E('circle', { cx: -12, cy: -6, r: 6, fill: '#2E6B24' }, c.c); E('circle', { cx: 14, cy: -6, r: 6, fill: '#2E6B24' }, c.c);
      const x = cross(c.c, 56); }
    c.d = T(g, CX, 540, 'caused by a LACK of a nutrient', { size: 30, weight: 600, anchor: 'middle', fill: C.muted });
    c.e = chip(g, 'I asked.', { size: 28, fill: '#0E1A24', color: C.ink, stroke: C.line });
    cards[7] = c; }

  /* ===== logo ===== */
  const shR = G(fx);
  const rLogo = trapsLogo(shR);
  const rSub = T(shR, 600, 470, 'will return', { size: 48, weight: 700, anchor: 'middle', fill: '#FFFFFF' });
  /* ===== stinger extras ===== */
  const vChip = G(fx);
  { const a = chip(vChip, 'villus = one', { size: 36, fill: '#0E1A24', color: C.energy, stroke: C.energy }); tr(a, 0, 0); const b = chip(vChip, 'villi = many', { size: 32, fill: '#0E1A24', color: '#FFD0DC', stroke: '#FF7FA6' }); tr(b, 0, 72); }
  const talksBurst = G(fx);
  { let d = ''; for (let i = 0; i < 20; i++) { const a = i / 20 * TAU, r = i % 2 ? 0.8 : 1.08; d += (i ? 'L' : 'M') + (Math.cos(a) * 150 * r).toFixed(1) + ',' + (Math.sin(a) * 58 * r).toFixed(1); }
    E('path', { d: d + 'Z', fill: '#FFE45C', stroke: '#D7263D', 'stroke-width': 5, 'stroke-linejoin': 'round' }, talksBurst);
    T(talksBurst, 0, 15, 'HE TALKS!', { size: 42, weight: 800, anchor: 'middle', fill: '#D7263D' }); }
  const endLogo = G(fx);
  { const l = trapsLogo(endLogo); tr(l, 600, 168, 0.68); T(endLogo, 600, 262, 'Episode 4: The Chicken Rice Express', { size: 32, weight: 700, anchor: 'middle', fill: '#FFFFFF' }); }

  /* ---------- shots ---------- */
  const SHOTS = [['I', -9], ['1', at('t1') - 0.06], ['2', at('t2') - 0.06], ['3', at('t3') - 0.06], ['4', at('t4') - 0.06], ['5', at('t5') - 0.06],
    ['6', at('t6') - 0.06], ['7', at('t7') - 0.06], ['R', at('return') - 0.06], ['W', at('vinny') - 0.06]];
  const shotAt = t => { let s = 'I'; for (const [k, t0] of SHOTS) if (t >= t0) s = k; return s; };
  const SPK = { 1: 'percy', 2: 'amy', 3: 'priya', 4: 'bill', 5: 'lionel', 6: 'phoebe', 7: 'kavya' };
  const SCALE = { percy: 1.3, amy: 1.4, priya: 1.35, bill: 1.3, lionel: 1.3, phoebe: 1.3, kavya: 1.45 };
  const VCUES = [end('vinny') + 0.35, end('vinny') + 1.1, end('singular') + 0.45, end('talks') + 0.2, end('encourage') + 0.6, end('encourage') + 1.9];

  return t => {
    const sh = shotAt(t);
    op(shI, sh === 'I' ? 1 : 0); op(introBg, sh === 'I' ? 1 : 0); op(logoBg, sh === 'R' ? 1 : 0); op(shR, sh === 'R' ? 1 : 0);
    const confK = SPK[sh] || (sh === 'W' ? 'vinny' : '');
    for (const k in confs) confs[k].set(k === confK ? 1 : 0, t);
    for (const k in cards) op(cards[k].g, String(k) === sh ? 1 : 0);
    for (const k in ch) op(ch[k], 0);
    op(vChip, 0); op(talksBurst, 0); op(endLogo, 0);
    let cam = [600, 375, 1];
    const show = (k, x, y, s, st) => { op(ch[k], 1); tr(ch[k], x, y, s); ch[k].set(Object.assign({ t }, st)); };

    if (sh === 'I') {
      trapsPopAt(iHead, t, at('intro') + 0.05, 600, 180);
      op(iSub, P(t, mid('intro', 0.3), 0.4, linear));
      warns.forEach((w, i) => { const p = P(t, mid('intro', 0.3) + i * 0.32, 0.35, pop); op(w, clamp(p * 2.5)); tr(w, w.mx, w.my + 3 * Math.sin(t * 6 + i) * AMP, Math.max(0.01, p), 6 * Math.sin(t * 5 + i) * AMP); });
      cam = [600, 400, 1];
    } else if (SPK[sh]) {
      const k = SPK[sh], line = 't' + sh, c = cards[sh];
      const f = (t - at(line)) / (end(line) - at(line));
      let mood = { percy: 'deadpan', amy: 'happy', priya: 'smug', bill: 'deadpan', lionel: 'annoyed', phoebe: 'sad', kavya: 'neutral' }[k];
      if (k === 'lionel' && f > 0.7) mood = 'happy';
      if (k === 'phoebe' && f > 0.82) mood = 'deadpan';
      if (k === 'kavya' && f > 0.72) mood = 'deadpan';
      let y = 410;
      if (k === 'amy') y = 410 - Math.abs(Math.sin(t * 6)) * 10 * AMP;
      if (k === 'phoebe') y = 400 - 18 * Math.max(0, Math.sin((t - mid('t6', 0.86)) * 9)) * on(t, mid('t6', 0.86), mid('t6', 0.86) + 0.7);
      show(k, 320, y, SCALE[k], { talk: talk(t, k), mood, look: 0, sparkle: 1, bubbles: k === 'bill' && f > 0.05 && f < 0.4 ? 1 : 0 });
      cam = [600, 375, 1 + 0.03 * P(t, at(line), 5, linear)];
      if (sh === '1') {
        trapsPopAt(c.a, t, mid('t1', 0.05), CX, 255); c.aSt.set(P(t, mid('t1', 0.3), 0.35));
        op(c.b, P(t, mid('t1', 0.45), 0.3, linear)); op(c.c, P(t, mid('t1', 0.68), 0.3, linear)); op(c.d, P(t, mid('t1', 0.8), 0.3, linear));
      } else if (sh === '2') {
        trapsPopAt(c.a, t, mid('t2', 0.05), CX, 262);
        op(c.b, P(t, mid('t2', 0.4), 0.3, linear)); op(c.c, P(t, mid('t2', 0.55), 0.3, linear));
        op(c.d, P(t, mid('t2', 0.78), 0.3, linear)); c.dSt.set(P(t, mid('t2', 0.86), 0.3));
      } else if (sh === '3') {
        op(c.a, P(t, mid('t3', 0.04), 0.3, linear)); trapsPopAt(c.b, t, mid('t3', 0.12), 650, 320); trapsPopAt(c.c, t, mid('t3', 0.33), 650, 385);
        op(c.d, P(t, mid('t3', 0.55), 0.3, linear)); trapsPopAt(c.e, t, mid('t3', 0.88), CX, 525);
      } else if (sh === '4') {
        trapsPopAt(c.a, t, mid('t4', 0.06), CX, 250); op(c.b, P(t, mid('t4', 0.25), 0.3, linear)); op(c.c, P(t, mid('t4', 0.5), 0.35, linear));
      } else if (sh === '5') {
        op(c.a, P(t, mid('t5', 0.05), 0.3, linear)); trapsPopAt(c.b, t, mid('t5', 0.15), CX, 310);
        op(c.c, P(t, mid('t5', 0.3), 0.3, linear)); trapsPopAt(c.d, t, mid('t5', 0.62), CX, 528);
      } else if (sh === '6') {
        op(c.a, P(t, mid('t6', 0.05), 0.3, linear)); trapsPopAt(c.b, t, mid('t6', 0.28), CX, 314);
        trapsPopAt(c.c, t, mid('t6', 0.55), 650, 418); op(c.d, P(t, mid('t6', 0.86), 0.3, linear));
      } else if (sh === '7') {
        op(c.a, P(t, mid('t7', 0.05), 0.3, linear)); trapsPopAt(c.b, t, mid('t7', 0.25), CX, 305);
        const gp = P(t, mid('t7', 0.35), 0.4, pop); op(c.c, clamp(gp * 2.5)); tr(c.c, CX, 425, Math.max(0.01, 0.7 + 0.3 * gp), 6 * Math.sin(t * 3) * AMP);
        op(c.d, P(t, mid('t7', 0.5), 0.3, linear));
        trapsPop(c.e, t, mid('t7', 0.78), 1090, 590);
        const push = P(t, mid('t7', 0.75), end('t7') + 0.6 - mid('t7', 0.75), linear);
        cam = [lerp(600, 380, push), lerp(375, 360, push), 1 + 0.2 * ease(push)];
        op(c.g, 1 - 0.0 * push);
      }
    } else if (sh === 'R') {
      tr(rayP, 600, 380, 1, (t * 6 * AMP) % 360);
      const lp = P(t, at('return') + 0.05, 0.55, pop); op(rLogo, clamp(lp * 2.5)); tr(rLogo, 600, 330, Math.max(0.01, 0.5 + 0.5 * lp));
      op(rSub, P(t, mid('return', 0.55), 0.4, linear));
    } else if (sh === 'W') {
      // Vinny's confessional
      const vt = trapsBlinkT(t, VCUES);
      const amyIn = t >= at('talks') - 0.15;
      const vx = 400, vy = 440;
      op(ch.vinny, 1); tr(vWrap, vx, vy, 1.6);
      vWrap.setAttribute('transform', `translate(${vx} ${vy}) scale(1.6) rotate(${(9 * Math.sin(t * 4.2) * AMP).toFixed(2)} 0 100)`);
      ch.vinny.set({ t: vt, still: true, talk: talk(t, 'vinny') * 0.35, mood: 'neutral', look: t < at('singular') - 0.3 ? 0.4 : 0 });
      const encouraged = t >= at('encourage') - 0.1;
      show('percy', 1010, 450, 1.0, { talk: talk(t, 'percy'), mood: 'deadpan', look: encouraged ? 0 : -1 });
      if (amyIn) {
        const ap = P(t, at('talks') - 0.15, 0.35, easeOut);
        show('amy', lerp(1350, 720, ap), 440 - 40 * Math.sin(Math.PI * ap) - (t > end('talks') ? Math.abs(Math.sin(t * 7)) * 10 * AMP : 0), 1.05,
          { talk: talk(t, 'amy'), mood: t < mid('talks', 0.55) ? 'shock' : 'happy', look: -1, sparkle: 1 });
        const bp = P(t, mid('talks', 0.3), 0.3, pop); op(talksBurst, clamp(bp * 2.5) * (1 - P(t, at('encourage') - 0.1, 0.2, linear)));
        tr(talksBurst, 760, 190, Math.max(0.01, 0.6 + 0.4 * bp), -5 + 3 * Math.sin(t * 20) * AMP);
      }
      if (t < at('singular') - 0.1) {
        const push = P(t, end('vinny') + 0.1, at('singular') - end('vinny') - 0.2, linear);
        cam = [lerp(600, 430, push), lerp(375, 400, push), 1 + 0.32 * ease(push)];
      } else if (!amyIn) {
        const push = P(t, at('singular'), end('singular') + 0.9 - at('singular'), linear);
        cam = [430, 400, 1.4 + 0.12 * push];
        const cp = P(t, mid('singular', 0.7), 0.4, pop); op(vChip, clamp(cp * 2.5)); tr(vChip, 880, 250, Math.max(0.01, 0.7 + 0.3 * cp));
      } else {
        const fin = P(t, end('encourage') + 0.2, 0.6, ease);
        cam = [600, 375, 1];
        op(endLogo, fin); tr(endLogo, 0, -16 * (1 - fin));
      }
    }
    trapsCam(cam[0], cam[1], cam[2]);
  };
  function on(t, a, b) { return t >= a && t < b ? 1 : 0; }
});
