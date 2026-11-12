/* Scene 7: The cast saves you some marks.
   Shots: "6 EXAM TRAPS" with the cast lined up holding their numbers -> six snappy confessionals, one trap
   card each (Belle: vacuum; Archie: particles vibrate, energy travels; Freq then Amp on one card: pitch and
   frequency, loudness and amplitude; Nigel: 340 m/s vs 300,000,000 m/s; Coco: units; Archie: echo sums ÷ 2)
   -> "PASS IT ON will return" -> stinger in the hall: bar 47, Kavya raises the beater, the band falls silent,
   DING (rings and a wave of air particles across the hall), push-in on her satisfied face -> Echo: "...ding."
   -> everyone stares at the wall -> Kavya: "Nailed it." -> Echo: "...nailed it." under the logo. Hold. */
scene('traps', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;

  /* ---------- helpers (prefixed traps) ---------- */
  function trapsFit(parent, x, y, str, o, maxW) {      // text that shrinks (down to 26 px) to fit maxW
    let size = o.size;
    while (size > 26 && textWidth(str.replace(/\*\*/g, ''), size, o.font || FD, 800) > maxW) size -= 1;
    return T(parent, x, y, str, Object.assign({}, o, { size }));
  }
  function trapsPop(el, t, t0, x, y, r) { const p = P(t, t0, 0.45, pop); op(el, clamp(p * 2.5)); tr(el, x, y, Math.max(0.01, 0.6 + 0.4 * p), r); }
  function trapsPopAt(el, t, t0, cx, cy) { const p = P(t, t0, 0.45, pop), k = Math.max(0.01, 0.6 + 0.4 * p); op(el, clamp(p * 2.5)); el.setAttribute('transform', `translate(${cx} ${cy}) scale(${k.toFixed(3)}) translate(${-cx} ${-cy})`); }
  function trapsStamp(parent, text, o) {                // a rubber stamp: g.set(p, x, y, rot) thumps it down
    o = o || {};
    const size = o.size || 40, col = o.color || C.bad, g = G(parent);
    const w = textWidth(text, size, FD, 800) + size * 1.3, h = size * 1.7;
    E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: 12, fill: o.fill || 'rgba(24,8,12,0.9)', stroke: col, 'stroke-width': 6 }, g);
    T(g, 0, size * 0.36, text, { size, weight: 800, anchor: 'middle', fill: col, ls: 2 });
    g.set = (p, x, y, rot) => { op(g, clamp(p * 4)); tr(g, x, y, lerp(1.7, 1, easeOut(clamp(p))), rot); };
    return g;
  }
  function trapsEchoText(parent, text, size, col) {    // a caption with a fading, offset "echo" copy behind it
    const g = G(parent);
    const ghost = T(g, 14, 10, text, { size: size || 46, weight: 800, anchor: 'middle', fill: '#C9C2E6', opacity: 0.35 });
    const main = T(g, 0, 0, text, { size: size || 46, weight: 800, anchor: 'middle', fill: col || '#FFFFFF' });
    main.setAttribute('stroke', '#221C33'); main.setAttribute('stroke-width', 8); main.setAttribute('paint-order', 'stroke');
    g.set = (p, t) => { op(g, p); tr(ghost, 14 + 10 * Math.sin(t * 3), 10, 1); };
    return g;
  }
  function trapsLogo(parent, size) {
    const g = G(parent);
    const lt = T(g, 0, 0, 'PASS IT ON', { size, weight: 800, anchor: 'middle', fill: '#FFD23F' });
    lt.setAttribute('stroke', '#1A2852'); lt.setAttribute('stroke-width', size * 0.13); lt.setAttribute('paint-order', 'stroke'); lt.setAttribute('stroke-linejoin', 'round');
    return g;
  }
  function trapsNote(parent) {
    const g = G(parent);
    E('ellipse', { cx: 0, cy: 0, rx: 11, ry: 8, fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 2, transform: 'rotate(-20)' }, g);
    E('path', { d: 'M9,-2 L9,-40 Q22,-34 24,-22', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 4, 'stroke-linecap': 'round' }, g);
    return g;
  }

  /* ---------- layers ---------- */
  const world = G(root), bgL = G(world), castL = G(world), frontL = G(world), hud = G(root);
  function trapsCam(k, fx, fy, tx, ty) { world.setAttribute('transform', `translate(${tx.toFixed(1)} ${ty.toFixed(1)}) scale(${k.toFixed(4)}) translate(${(-fx).toFixed(1)} ${(-fy).toFixed(1)})`); }

  /* ---------- sets ---------- */
  const introBg = G(bgL);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#10233A', '#2B4C78', true) }, introBg);
  E('ellipse', { cx: 600, cy: 560, rx: 560, ry: 170, fill: glow('#7FB6FF'), opacity: 0.3 }, introBg);
  const confs = {};
  ['belle', 'archie', 'freq', 'amp', 'nigel', 'coco'].forEach(k => { confs[k] = pioConf(bgL, k); });
  const logoBg = G(bgL);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#10233A', '#2B4C78', true) }, logoBg);
  const rings = [0, 1, 2, 3].map(() => E('circle', { cx: 600, cy: 300, r: 100, fill: 'none', stroke: '#9FD8FF', 'stroke-width': 6 }, logoBg));
  // the hall, for the stinger
  const hallW = G(bgL); const hall = pioHall(hallW);
  const band = [[90, '#E8424F', '#C98E62'], [215, '#2E7DD8', '#E0B48A'], [340, '#56D69B', '#8C5A3C']].map(([x, shirt, skin]) => {
    const w = G(hallW); const p = person(w, { shirt, shorts: '#1E2A44', skin, hair: '#1E1410' }); tr(w, x, 426, 0.95); return { w, p, x };
  });
  const bangs = band.map(b => T(hallW, b.x + 36, 280, '!', { size: 54, weight: 800, anchor: 'middle', fill: '#E8424F' }));
  const notes = [0, 1, 2, 3, 4].map(() => trapsNote(hallW));
  const sheet = pioSheet(hallW, 800);
  const sheetGlow = E('ellipse', { cx: sheet.noteX, cy: 72, rx: 90, ry: 90, fill: glow('#FFE45C'), opacity: 0 }, sheet);
  sheet.insertBefore(sheetGlow, sheet.firstChild.nextSibling);
  const airW = G(hallW); const air = pioRow(airW, { w: 1100, h: 90, cols: 14, rows: 3, r: 10, color: '#BFE0FF' }); tr(airW, 50, 285);
  const dingRings = [0, 1, 2, 3].map(() => E('circle', { r: 50, fill: 'none', stroke: '#FFE45C', 'stroke-width': 8 }, hallW));
  // Echo's wall, close up
  const wallBg = G(bgL);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#B4AAD3', '#9C91C2', true) }, wallBg);
  { let wg = ''; for (let x = 0; x <= 1200; x += 75) wg += `M${x},0 L${x},640 `; for (let y = 25; y < 640; y += 75) wg += `M0,${y} L1200,${y} `;
    E('path', { d: wg, stroke: '#8B80B4', 'stroke-width': 6 }, wallBg); }
  E('ellipse', { cx: 600, cy: 420, rx: 420, ry: 300, fill: glow('#FFFFFF'), opacity: 0.35 }, wallBg);
  E('rect', { x: 0, y: 640, width: 1200, height: 110, fill: linGrad('#C99A5E', '#9A6B38', true) }, wallBg);
  E('rect', { x: 0, y: 626, width: 1200, height: 18, fill: '#8C7F5A' }, wallBg);

  /* ---------- the cast: one of each, moved between shots ---------- */
  const ch = {};
  ['echo', 'belle', 'archie', 'freq', 'amp', 'nigel', 'coco', 'kavya'].forEach(k => { ch[k] = cast(castL, k, {}); });
  const tri = pioTriangle(castL, 0.95);
  const fist = E('ellipse', { rx: 22, ry: 18, fill: '#B9784E', stroke: SC_INK, 'stroke-width': 3 }, castL);
  const MOOD = { belle: 'sad', archie: 'happy', freq: 'happy', amp: 'smug', nigel: 'deadpan', coco: 'neutral' };

  /* ===== intro ===== */
  const shI = G(frontL);
  const iHead = T(shI, 600, 220, '6 EXAM TRAPS', { size: 84, weight: 800, anchor: 'middle', fill: C.energy, ls: 2 });
  const iSub = T(shI, 600, 284, 'the cast saves you some marks', { size: 36, weight: 600, anchor: 'middle', fill: C.muted });
  const ROW = [['belle', '1'], ['archie', '2 & 6'], ['freq', '3'], ['amp', '3'], ['nigel', '4'], ['coco', '5']];
  const rowX = i => 130 + i * 188;
  const nums = ROW.map(([k, n]) => chip(shI, n, { size: 30, fill: '#FFE45C', color: SC_INK, stroke: '#FFFFFF', sw: 3 }));

  /* ===== trap cards ===== */
  const CX = 880;
  function trapsCard(n) {
    const g = G(frontL);
    card(g, 600, 140, 560, 450, { fill: C.card, stroke: C.line, opacity: 0.95 });
    const head = chip(g, 'TRAP ' + n, { size: 30, fill: C.bad, color: '#FFFFFF', weight: 800 }); tr(head, CX, 190);
    return g;
  }
  // 1 Belle: no sound in a vacuum
  const c1 = trapsCard(1);
  const c1a = T(c1, CX, 272, 'Sound **CANNOT** travel', { size: 42, weight: 600, anchor: 'middle', boldFill: '#FF9AA4' });
  const c1b = T(c1, CX, 326, 'through a **vacuum**', { size: 42, weight: 600, anchor: 'middle', boldFill: '#9FD8FF' });
  const c1c = G(c1);
  { const j = G(c1c); tr(j, 700, 450);
    E('rect', { x: -74, y: 50, width: 148, height: 16, rx: 5, fill: '#8A8F9A', stroke: SC_INK, 'stroke-width': 3 }, j);
    E('path', { d: 'M-60,50 L-60,-14 Q-60,-66 0,-68 Q60,-66 60,-14 L60,50', fill: 'rgba(200,230,250,0.12)', stroke: '#CFE7F5', 'stroke-width': 5 }, j);
    E('path', { d: 'M-26,14 Q-28,-24 0,-26 Q28,-24 26,14 Z', fill: '#E8424F', stroke: SC_INK, 'stroke-width': 3 }, j);
    [-1, 1].forEach(sd => E('path', { d: `M${sd * 76},-26 Q${sd * 90},0 ${sd * 76},26`, fill: 'none', stroke: '#FFE45C', 'stroke-width': 5, 'stroke-linecap': 'round', opacity: 0.6 }, j));
    tr(cross(j, 18), -96, -44);
    T(c1c, 796, 444, 'no particles', { size: 34, weight: 700 });
    T(c1c, 796, 492, '= no sound', { size: 34, weight: 800, fill: '#FF9AA4' }); }
  // 2 Archie: particles vibrate, the energy travels
  const c2 = trapsCard(2);
  const c2a = T(c2, CX, 268, 'Particles **DON’T** travel', { size: 40, weight: 600, anchor: 'middle', boldFill: '#FF9AA4' });
  const c2b = T(c2, CX, 318, 'with the wave', { size: 40, weight: 600, anchor: 'middle' });
  const rowW = G(c2); const row2 = pioRow(rowW, { w: 460, h: 64, cols: 12, rows: 3, r: 8 }); tr(rowW, 650, 360);
  const sp2 = spark(c2, 12, { seed: 2 });
  const c2c = T(c2, CX, 486, 'particles **VIBRATE** ↔', { size: 34, weight: 600, anchor: 'middle', boldFill: '#9FD8FF' });
  const c2d = T(c2, CX, 545, 'the **ENERGY** travels →', { size: 38, weight: 600, anchor: 'middle', boldFill: C.energy });
  // 3 Freq, then Amp: pitch and frequency, loudness and amplitude
  const c3 = trapsCard(3);
  function pair(a, b, col, txt) {
    const g = G(c3), p1 = chip(g, a, { size: 34, fill: col, color: txt, weight: 800 }), p2 = chip(g, b, { size: 34, fill: col, color: txt, weight: 800 });
    const tot = p1.w + 64 + p2.w, x0 = -tot / 2;
    tr(p1, x0 + p1.w / 2, 0); T(g, x0 + p1.w + 32, 14, '↔', { size: 44, weight: 800, anchor: 'middle', fill: C.ink }); tr(p2, x0 + tot - p2.w / 2, 0);
    return g;
  }
  const c3a = pair('PITCH', 'FREQUENCY', '#B6F06A', '#1C320F');
  const c3b = pair('LOUDNESS', 'AMPLITUDE', '#FF9A6C', '#3A1C10');
  const c3s = trapsStamp(c3, 'DON’T MIX US UP', { size: 38 });
  // 4 Nigel: sound vs light
  const c4 = trapsCard(4);
  const c4a = T(c4, CX, 270, 'Sound: about **340 m/s**', { size: 38, weight: 600, anchor: 'middle', boldFill: '#9FD8FF' });
  const c4b = trapsFit(c4, CX, 328, 'Light: about **300,000,000 m/s**', { size: 38, weight: 600, anchor: 'middle', boldFill: C.energy }, 510);
  const c4c = G(c4);
  T(c4c, 640, 420, 'sound', { size: 30, weight: 700, fill: '#9FD8FF' });
  E('circle', { cx: 770, cy: 410, r: 5, fill: '#9FD8FF' }, c4c);
  T(c4c, 640, 482, 'light', { size: 30, weight: 700, fill: C.energy });
  const lightBar = E('rect', { x: 766, y: 460, width: 10, height: 26, rx: 6, fill: C.energy }, c4c);
  const c4s = trapsStamp(c4, 'NOT SIMILAR.', { size: 38 });
  // 5 Coco: units
  const c5 = trapsCard(5);
  const c5a = G(c5); { const u = chip(c5a, 'Hz', { size: 46, fill: '#B6F06A', color: '#1C320F', weight: 800 }); tr(u, 690, 292); T(c5a, 690 + u.w / 2 + 24, 306, 'for **frequency**', { size: 36, weight: 600, boldFill: '#B6F06A' }); }
  const c5b = G(c5); { const u = chip(c5b, 'm/s', { size: 46, fill: '#9FD8FF', color: '#0A2A44', weight: 800 }); tr(u, 700, 400); T(c5b, 700 + u.w / 2 + 24, 414, 'for **speed**', { size: 36, weight: 600, boldFill: '#9FD8FF' }); }
  const c5s = trapsStamp(c5, 'UNITS MATTER', { size: 40, color: C.energy });
  // 6 Archie: echo sums
  const c6 = trapsCard(6);
  const c6a = T(c6, CX, 266, 'Echo sums', { size: 46, weight: 800, anchor: 'middle', fill: '#7FF0C2' });
  const c6b = G(c6);
  { E('path', { d: 'M650,322 L770,322 L756,342 L664,342 Z', fill: '#E8424F', stroke: SC_INK, 'stroke-width': 3, 'stroke-linejoin': 'round' }, c6b);
    E('rect', { x: 690, y: 300, width: 40, height: 22, rx: 4, fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 3 }, c6b);
    E('line', { x1: 620, y1: 344, x2: 800, y2: 344, stroke: '#4CC9F0', 'stroke-width': 4 }, c6b);
    E('line', { x1: 620, y1: 530, x2: 800, y2: 530, stroke: '#7A6448', 'stroke-width': 8 }, c6b); }
  const c6d = arrow(c6, 690, 356, 690, 520, { color: C.energy, width: 6 });
  const c6u = arrow(c6, 732, 520, 732, 356, { color: '#7FF0C2', width: 6 });
  const c6t = T(c6, 800, 420, 'there', { size: 34, weight: 700, fill: C.energy });
  const c6k = T(c6, 800, 470, 'and back', { size: 34, weight: 700, fill: '#7FF0C2' });
  const c6h = T(c6, 1060, 470, '÷ 2', { size: 76, weight: 800, anchor: 'middle', fill: C.energy });
  const c6s = T(c6, CX, 568, 'cut it in half', { size: 30, weight: 600, anchor: 'middle', fill: C.muted });

  /* ===== logo ===== */
  const shR = G(frontL);
  const rLogo = trapsLogo(shR, 110);
  const rSub = T(shR, 600, 420, 'will return', { size: 46, weight: 600, anchor: 'middle', fill: '#FFFFFF' });

  /* ===== stinger ===== */
  const shB = G(frontL);
  const dingT = T(shB, 0, 0, 'DING!', { size: 130, weight: 800, anchor: 'middle', fill: '#FFE45C' });
  dingT.setAttribute('stroke', '#5A3A00'); dingT.setAttribute('stroke-width', 12); dingT.setAttribute('paint-order', 'stroke'); dingT.setAttribute('stroke-linejoin', 'round');
  const hush = T(shB, 1000, 140, '(silence)', { size: 30, weight: 600, anchor: 'middle', fill: '#5A5040', font: FB });
  const shE = G(frontL);
  const eT1 = trapsEchoText(shE, '…ding.', 34, '#D9D2EE');
  const eT2 = trapsEchoText(shE, '…nailed it.', 46);
  const endLogo = trapsLogo(shE, 84);

  /* ---------- shots ---------- */
  const SHOTS = [['I', -9], ['1', at('t1') - 0.05], ['2', at('t2') - 0.05], ['3', at('t3a') - 0.05], ['4', at('t4') - 0.05], ['5', at('t5') - 0.05],
    ['6', at('t6') - 0.05], ['R', at('return') - 0.05], ['B', at('bar') - 0.05], ['E1', at('echo') - 0.05], ['K', end('echo') + 0.3], ['E2', at('last') - 0.05]];
  const shotAt = t => { let s = 'I'; for (const [k, t0] of SHOTS) if (t >= t0) s = k; return s; };
  const FRONT = { I: [shI], 1: [c1], 2: [c2], 3: [c3], 4: [c4], 5: [c5], 6: [c6], R: [shR], B: [shB], E1: [shE], E2: [shE] };
  const fronts = [shI, c1, c2, c3, c4, c5, c6, shR, shB, shE];
  const SPEAK = { 1: 'belle', 2: 'archie', 4: 'nigel', 5: 'coco', 6: 'archie' };

  return t => {
    const sh = shotAt(t);
    fronts.forEach(g => op(g, (FRONT[sh] || []).includes(g) ? 1 : 0));
    op(introBg, sh === 'I' ? 1 : 0); op(logoBg, sh === 'R' ? 1 : 0);
    const hallOn = sh === 'B' || sh === 'K'; op(hallW, hallOn ? 1 : 0);
    op(wallBg, sh === 'E1' || sh === 'E2' ? 1 : 0);
    let confK = SPEAK[sh] || (sh === '3' ? (t < at('t3b') - 0.05 ? 'freq' : 'amp') : '');
    for (const k in confs) confs[k].set(confK === k ? 1 : 0, t);
    for (const k in ch) op(ch[k], 0);
    op(tri, 0); op(fist, 0);
    let cam = [1, 600, 375, 600, 375];
    const show = (k, x, y, s, st) => { op(ch[k], 1); tr(ch[k], x, y, s); ch[k].set(Object.assign({ t, talk: scTalk(S, t, k) }, st)); };

    if (sh === 'I') {
      trapsPopAt(iHead, t, at('intro') + 0.05, 600, 196);
      op(iSub, P(t, mid('intro', 0.3), 0.4, linear));
      ROW.forEach(([k, n], i) => {
        const p = P(t, mid('intro', 0.4) + i * 0.14, 0.45, pop);
        op(ch[k], clamp(p * 3)); tr(ch[k], rowX(i), 500 + 30 * (1 - clamp(p)), Math.max(0.01, 0.6 * p));
        ch[k].set({ t, mood: MOOD[k], look: k === 'nigel' ? -0.4 : 0, bounce: k === 'archie' ? 0.6 : 0, buzz: k === 'freq' ? 0.5 : 0 });
        op(nums[i], clamp(p * 3)); tr(nums[i], rowX(i), 650);
      });
      cam = [1 + 0.03 * P(t, at('intro'), 4.5, linear), 600, 375, 600, 375];
    } else if (SPEAK[sh]) {
      const k = SPEAK[sh], line = 't' + sh;
      let mood = MOOD[k], extra = {};
      if (k === 'archie') extra = { bounce: t < mid(line, 0.25) ? 1 : 0.3 };
      if (sh === '1' && t > mid('t1', 0.78)) mood = 'deadpan';
      if (sh === '4' && t > mid('t4', 0.84)) mood = 'deadpan';
      if (sh === '6' && t > mid('t6', 0.75)) mood = 'smug';
      const sc = { belle: 1.15, archie: 1.25, nigel: 1.2, coco: 1.25 }[k];
      show(k, 320, 420, sc, Object.assign({ mood, look: t > end(line) ? 0 : 0.25 }, extra));
      if (sh === '1') {
        op(c1a, P(t, mid('t1', 0.08), 0.3, linear)); op(c1b, P(t, mid('t1', 0.25), 0.3, linear));
        trapsPopAt(c1c, t, mid('t1', 0.55), 880, 460);
        const push = P(t, mid('t1', 0.78), end('t1') + 0.3 - mid('t1', 0.78), linear);
        cam = [1 + 0.12 * ease(push), 320, 400, 320, 400];
      } else if (sh === '2') {
        op(c2a, P(t, mid('t2', 0.05), 0.3, linear)); op(c2b, P(t, mid('t2', 0.15), 0.3, linear));
        op(rowW, P(t, mid('t2', 0.3), 0.3, linear)); row2.set({ t, amp: 12, wl: 160, f: 0.8, hi: 5 });
        op(c2c, P(t, mid('t2', 0.5), 0.3, linear));
        const sp = P(t, mid('t2', 0.72), 0.3, linear); op(sp2, sp); sp2.upd(t); tr(sp2, 650 + ((t * 128) % 460), 392);
        op(c2d, sp);
        cam = [1 + 0.03 * P(t, at('t2'), 4, linear), 600, 375, 600, 375];
      } else if (sh === '4') {
        op(c4a, P(t, mid('t4', 0.12), 0.3, linear)); op(c4b, P(t, mid('t4', 0.42), 0.3, linear));
        op(c4c, P(t, mid('t4', 0.12), 0.3, linear));
        const lb = P(t, mid('t4', 0.48), 1.0, easeIn); attr(lightBar, 'width', 10 + 370 * lb); op(lightBar, mid('t4', 0.42) < t ? 1 : 0);
        c4s.set(P(t, mid('t4', 0.84), 0.25, linear), CX, 548, -5);
        const push = P(t, mid('t4', 0.82), end('t4') + 0.3 - mid('t4', 0.82), linear);
        cam = [1 + 0.1 * ease(push), 320, 420, 320, 420];
      } else if (sh === '5') {
        trapsPopAt(c5a, t, mid('t5', 0.18), 760, 292); trapsPopAt(c5b, t, mid('t5', 0.45), 760, 400);
        c5s.set(P(t, mid('t5', 0.78), 0.25, linear), CX, 522, -4);
        cam = [1 + 0.03 * P(t, at('t5'), 4.5, linear), 600, 375, 600, 375];
      } else if (sh === '6') {
        op(c6a, P(t, mid('t6', 0.12), 0.3, linear)); op(c6b, P(t, mid('t6', 0.12), 0.3, linear));
        c6d.set(P(t, mid('t6', 0.4), 0.4)); op(c6t, P(t, mid('t6', 0.42), 0.3, linear));
        c6u.set(P(t, mid('t6', 0.55), 0.4)); op(c6k, P(t, mid('t6', 0.57), 0.3, linear));
        trapsPopAt(c6h, t, mid('t6', 0.78), 1060, 450); op(c6s, P(t, mid('t6', 0.8), 0.3, linear));
        cam = [1 + 0.03 * P(t, at('t6'), 4, linear), 600, 375, 600, 375];
      }
    } else if (sh === '3') {
      const isAmp = t >= at('t3b') - 0.05;
      if (!isAmp) show('freq', 320, 410, 1.2, { mood: 'happy', buzz: 1, look: 0.3 });
      else show('amp', 330, 450, 1.05, { mood: t > mid('t3b', 0.6) ? 'annoyed' : 'neutral', big: 1, look: 0.2 });
      trapsPop(c3a, t, mid('t3a', 0.2), CX, 300);
      op(c3b, isAmp ? 1 : 0); if (isAmp) trapsPop(c3b, t, mid('t3b', 0.1), CX, 410);
      c3s.set(isAmp ? P(t, mid('t3b', 0.62), 0.25, linear) : 0, CX, 525, -6);
      const shake = isAmp && t < end('t3b') ? AMP : 0;
      cam = [1.02, 600 + Math.sin(t * 47) * 4 * shake, 375 + Math.cos(t * 53) * 3 * shake, 600, 375];
    } else if (sh === 'R') {
      rings.forEach((r, i) => { const f = ((t - at('return')) * 0.45 + i / 4 + 4) % 1; attr(r, 'r', 90 + f * 620); op(r, (1 - f) * 0.5); });
      const lp = P(t, at('return') + 0.05, 0.6, pop); op(rLogo, clamp(lp * 2.5)); tr(rLogo, 600, 330, Math.max(0.01, 0.5 + 0.5 * lp));
      op(rSub, P(t, mid('return', 0.55), 0.4, linear));
    } else if (hallOn) {
      /* ---------- the stinger in the hall ---------- */
      hall.upd(t);
      const tD = at('ding') + 0.02;
      const isK = sh === 'K';
      const playing = t < end('bar') + 0.1;                           // the band falls silent before the ding
      band.forEach((b, i) => {
        const s = Math.sin(t * 7 + i * 2) * AMP;
        b.p.pose(playing ? { armL: [40 + 15 * s, 50], armR: [-30 - 15 * s, 60] } : { lean: isK ? -12 : 0, armL: [10, 10], armR: [-10, 10] });
        op(bangs[i], isK ? P(t, end('echo') + 0.35 + i * 0.12, 0.2, linear) * (1 - P(t, at('nailed') + 0.3, 0.3, linear)) : 0);
      });
      notes.forEach((n, i) => { const f = (t * 0.35 + i / 5) % 1; op(n, playing ? Math.sin(f * Math.PI) * 0.9 : 0); tr(n, 70 + i * 70 + 20 * Math.sin(t + i), 330 - f * 190, 1, 10 * Math.sin(t * 2 + i)); });
      op(hush, !playing && t < tD ? P(t, end('bar') + 0.25, 0.3, linear) : 0);
      // sheet music: bar 47 glows
      const sp = sh === 'B' ? P(t, at('bar') + 0.1, 0.4, pop) * (1 - P(t, tD - 0.1, 0.2, linear)) : 0;
      op(sheet, clamp(sp * 2.5)); tr(sheet, 150, 112 - 30 * (1 - clamp(sp)));
      const gl = P(t, mid('bar', 0.3), 0.4, linear); op(sheetGlow, gl * (0.6 + 0.4 * Math.sin(t * 6))); attr(sheet.circle, 'stroke-width', 5 + 3 * gl * Math.abs(Math.sin(t * 6)));
      // Echo on the tiled wall, deadpan
      show('echo', 1080, 280, 0.8, { mood: 'deadpan', ghost: 0, look: -0.6 });
      // Kavya and her triangle
      let km = 'neutral', kl = 0;
      if (sh === 'B') {
        if (t < mid('bar', 0.15)) { km = 'shock'; kl = 0; }
        else if (t < mid('bar', 0.5)) { km = 'neutral'; kl = -0.4; }
        else if (t < tD) { km = 'annoyed'; kl = -0.8; }
        else km = t < tD + 0.35 ? 'shock' : 'happy';
      } else { km = t < at('nailed') - 0.1 ? 'annoyed' : 'smug'; kl = t < at('nailed') - 0.1 ? 1 : 0; }
      show('kavya', 860, 560, 1.4, { mood: km, look: kl, still: !isK && t > mid('bar', 0.55) && t < tD });
      const raise = P(t, mid('bar', 0.6), 0.5, ease);
      let hit = -raise;
      if (t >= tD) hit = t < tD + 0.08 ? lerp(-1, 1, (t - tD) / 0.08) : lerp(1, 0.2, P(t, tD + 0.08, 0.5, ease));
      if (isK) hit = 0.2;
      const ringV = t >= tD ? 1 - 0.5 * P(t, tD + 1.5, 2, linear) : 0;
      op(tri, 1); tr(tri, 620, 500, 0.95, -6 + 2 * Math.sin(t * 1.3) * AMP); tri.set({ t, ring: ringV, hit });
      op(fist, 1); tr(fist, 620, 500 - 104);
      // DING: rings and a wave of air particles across the hall
      const dp = P(t, tD, 0.4, pop);
      op(dingT, sh === 'B' ? clamp(dp * 3) * (1 - P(t, end('ding') + 0.45, 0.3, linear)) : 0); tr(dingT, 480, 250, Math.max(0.01, 0.5 + 0.5 * dp), -8);
      dingRings.forEach((r, i) => { const f = P(t, tD + i * 0.25, 1.6, easeOut); attr(r, 'r', 40 + f * 900); attr(r, 'cx', 620); attr(r, 'cy', 480); op(r, t > tD + i * 0.25 && !isK ? (1 - f) * 0.8 : 0); });
      const af = t > tD && !isK ? 1 - P(t, tD + 1.2, 0.6, linear) : 0;
      op(airW, af * 0.75); if (af) air.set({ t, amp: 14, wl: 180, f: 1.2, front: 620 + (t - tD) * 700 });
      // camera: slow push on Kavya in the hush, then on her satisfied face after the ding; React: a slight push
      if (sh === 'B') {
        const p1 = P(t, end('bar'), tD - end('bar'), linear), p2 = P(t, tD + 0.4, 1.4, ease);
        cam = [1.06 + 0.06 * p1 + 0.22 * p2, lerp(700, 860, p1 * 0.5 + p2 * 0.5), lerp(380, 470, p2), lerp(700, 860, p1 * 0.5 + p2 * 0.5), lerp(380, 470, p2)];
      } else {
        const p3 = P(t, at('nailed'), end('nailed') + 0.6 - at('nailed'), linear);
        cam = [1.06 + 0.12 * p3, lerp(760, 860, p3), lerp(380, 460, p3), lerp(760, 860, p3), lerp(380, 460, p3)];
      }
    } else {
      /* ---------- Echo steals the moment ---------- */
      const first = sh === 'E1';
      show('echo', 640, first ? 400 : 450, first ? 1.6 : 1.5, { mood: 'deadpan', ghost: scWho(S, t) === 'echo' ? 1 : 0.2 });
      eT1.set(first ? P(t, mid('echo', 0.2), 0.25, linear) : 0, t); tr(eT1, 640, 150);
      eT2.set(first ? 0 : P(t, mid('last', 0.2), 0.25, linear), t); tr(eT2, 960, 330);
      const lp = first ? 0 : P(t, end('last') + 0.3, 0.6, pop);
      op(endLogo, clamp(lp * 2.5)); tr(endLogo, 600, 175, Math.max(0.01, 0.6 + 0.4 * lp));
      cam = first ? [1 + 0.05 * P(t, at('echo'), 2, linear), 640, 400, 640, 400] : [1 + 0.04 * P(t, at('last'), 3.5, linear), 640, 400, 640, 400];
    }
    trapsCam(cam[0], cam[1], cam[2], cam[3], cam[4]);
  };
});
