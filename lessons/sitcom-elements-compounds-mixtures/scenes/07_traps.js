/* Scene 7: The cast saves you some marks.
   Shots: "7 EXAM TRAPS" (seven warning signs pop in over the logo) -> seven snappy confessionals, one
   trap card each: Nate (Na not NA), Chloe (a compound has different properties), the Nigels (N₂ is
   still an element), Sal (mass is conserved), Sandy (you can't filter salt out of salt water), Arthur
   (evaporation keeps the solid, distillation the liquid), Inky (impurities lower the melting point,
   over a range) -> "HAPPILY EVER ATOM will return" -> stinger in Arthur's flat: the Nigels bring a
   second argon atom with a bow; "I'm a noble gas"; the two argons stare (they blink in sync);
   "...Fine. We'll be flatmates." -> final frame: the two at opposite ends of the sofa, the Nigels
   between, the logo. */
scene('traps', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;
  const talk = (t, who) => scTalk(S, t, who);

  /* ---------- helpers (prefixed traps) ---------- */
  // text with real subscripts: 'N_2' -> N₂
  function trapsRich(parent, x, y, str, o) {
    o = o || {};
    const size = o.size || 32, sub = Math.round(size * 0.62), dy = Math.round(size * 0.24);
    const t = E('text', { x, y, 'font-size': size, 'font-weight': o.weight || 800, fill: o.fill || C.ink, 'text-anchor': o.anchor || 'middle', 'font-family': FD }, parent);
    str.split(/_(\d+)/).forEach((seg, i) => {
      if (!seg) return;
      const ts = E('tspan', i % 2 ? { 'font-size': sub, dy } : (i > 0 ? { dy: -dy } : {}), t); ts.textContent = seg;
    });
    return t;
  }
  function trapsCam(cx, cy, k) {
    cx = clamp(cx, 600 / k, 1200 - 600 / k); cy = clamp(cy, 375 / k, 750 - 375 / k);
    attr(world, 'transform', `translate(600 375) scale(${k.toFixed(4)}) translate(${(-cx).toFixed(1)} ${(-cy).toFixed(1)})`);
  }
  function trapsPop(el, t, t0, x, y, s, r) { const p = P(t, t0, 0.45, pop); op(el, clamp(p * 2.5)); tr(el, x, y, Math.max(0.01, (s || 1) * (0.7 + 0.3 * p)), r); return p; }
  // pop art drawn at absolute stage coordinates: scale about (cx, cy)
  function trapsPopAt(el, t, t0, cx, cy) { const p = P(t, t0, 0.45, pop), s = Math.max(0.01, 0.7 + 0.3 * p); op(el, clamp(p * 2.5)); el.setAttribute('transform', `translate(${cx} ${cy}) scale(${s.toFixed(3)}) translate(${-cx} ${-cy})`); }
  const fade = (el, t, t0) => op(el, P(t, t0, 0.3, linear));
  const CX = 880;
  function trapsCard(parent, n) {
    const g = G(parent);
    card(g, 600, 140, 560, 450, { fill: 'rgba(10,27,39,0.93)', stroke: C.line, sw: 3 });
    const head = chip(g, 'TRAP ' + n, { size: 30, fill: C.bad, color: '#FFFFFF', weight: 800 }); tr(head, CX, 192);
    return g;
  }
  const txt = (p, y, s, o) => T(p, CX, y, s, Object.assign({ anchor: 'middle', weight: 700 }, o));

  /* ---------- layers ---------- */
  const world = G(root), bgL = G(world), charL = G(world), frontL = G(world), fx = G(root);

  /* ---------- sets ---------- */
  const introBg = G(bgL);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#2A1030', '#5A1F4A', true) }, introBg);
  E('ellipse', { cx: 600, cy: 560, rx: 520, ry: 200, fill: glow('#FF8FC8'), opacity: 0.3 }, introBg);
  const conf = scConfessional(bgL, EC_TINT.arthur[0], EC_TINT.arthur[1]);
  const CONF_FILL = {};
  ['nate', 'chloe', 'nigels', 'sal', 'sandy', 'arthur', 'inky'].forEach(k => { CONF_FILL[k] = linGrad(EC_TINT[k][0], EC_TINT[k][1], true); });
  const logoBg = G(bgL);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#2A1030', '#5A1F4A', true) }, logoBg);
  const flat = ecAirFlat(bgL);
  // a lighter sky: keep two in three of the drifting molecules (the element budget)
  [...flat.children[7].children].forEach((m, i) => { if (i % 3 === 1) m.remove(); });

  /* ---------- characters, one of each, moved between shots ---------- */
  const ch = {};
  ['nate', 'chloe', 'nigels', 'sal', 'sandy', 'arthur', 'inky'].forEach(k => { ch[k] = cast(charL, k); op(ch[k], 0); });
  const ar2 = cast(charL, 'arthur');                                       // the other argon atom
  const bow = G(ar2.firstChild); tr(bow, 30, -100, 1, 12);
  E('path', { d: 'M0,0 L-34,-20 L-34,20 Z M0,0 L34,-20 L34,20 Z', fill: '#FF6FB5', stroke: SC_INK, 'stroke-width': 3.5, 'stroke-linejoin': 'round' }, bow);
  E('circle', { r: 9, fill: '#E0408F', stroke: SC_INK, 'stroke-width': 3 }, bow);
  op(ar2, 0);

  /* ===== intro: 7 EXAM TRAPS ===== */
  const shI = G(fx);
  const iHead = T(shI, 600, 215, '7 EXAM TRAPS', { size: 84, weight: 800, anchor: 'middle', fill: C.energy, ls: 3 });
  const iSub = T(shI, 600, 275, 'the cast saves you some marks', { size: 36, weight: 600, anchor: 'middle', fill: '#FFD6EA' });
  const signs = [];
  for (let i = 0; i < 7; i++) {
    const g = G(shI);
    E('path', { d: 'M0,-44 L44,34 L-44,34 Z', fill: '#FFC247', stroke: SC_INK, 'stroke-width': 5, 'stroke-linejoin': 'round' }, g);
    T(g, 0, 26, String(i + 1), { size: 40, weight: 800, anchor: 'middle', fill: SC_INK });
    signs.push(g);
  }

  /* ===== trap cards ===== */
  // 1 Nate: symbols
  const s1 = G(fx), c1 = trapsCard(s1, 1);
  const c1a = txt(c1, 270, 'BIG then small', { size: 42, weight: 800, fill: C.energy });
  const c1b = G(c1);
  T(c1b, 760, 384, 'Na', { size: 76, weight: 800, anchor: 'middle', fill: '#FFFFFF' }); tr(tick(c1b, 18), 846, 362);
  const c1c = G(c1);
  T(c1c, 985, 380, 'NA', { size: 60, weight: 800, anchor: 'middle', fill: '#8FA3B2' });
  const c1s = strike(c1c, 940, 360, 1030, C.bad); tr(cross(c1c, 16), 1072, 362);
  const c1d = txt(c1, 452, 'two capitals = two elements', { size: 32 });
  const c1e = G(c1); txt(c1e, 512, 'CO = C + O', { size: 42, weight: 800, fill: '#FFFFFF' }); txt(c1e, 556, '(carbon monoxide)', { size: 28, weight: 600, fill: C.muted });
  // 2 Chloe: different properties
  const s2 = G(fx), c2 = trapsCard(s2, 2);
  const c2a = txt(c2, 258, 'A COMPOUND has', { size: 32 });
  const c2b = txt(c2, 312, 'DIFFERENT PROPERTIES', { size: 44, weight: 800, fill: C.energy });
  const c2c = txt(c2, 354, 'from its elements', { size: 30, weight: 600, fill: C.muted });
  const c2d = G(c2);
  [[-34, 6, 30], [0, -12, 38], [36, 4, 30], [0, 18, 28]].forEach(([x, y, r]) => E('circle', { cx: 730 + x, cy: 446 + y, r, fill: ball('#DDF68E', '#93BE3E'), stroke: '#5E8A22', 'stroke-width': 3 }, c2d));
  { const hz = G(c2d); tr(hz, 730, 444); E('rect', { x: -16, y: -16, width: 32, height: 32, fill: '#FFFFFF', stroke: C.bad, 'stroke-width': 4, transform: 'rotate(45)' }, hz); E('circle', { cy: -3, r: 7, fill: SC_INK }, hz); E('rect', { x: -5, y: 3, width: 10, height: 6, rx: 2, fill: SC_INK }, hz); }
  T(c2d, 730, 528, 'chlorine', { size: 28, weight: 700, anchor: 'middle', fill: '#C9EE73' });
  T(c2d, 730, 564, 'poison gas', { size: 28, weight: 600, anchor: 'middle', fill: '#FF9AA4' });
  const c2arr = arrow(c2, 800, 446, 905, 446, { color: '#FFFFFF', width: 6 });
  const c2e = G(c2);
  E('ellipse', { cx: 1030, cy: 470, rx: 86, ry: 20, fill: '#FFFFFF', stroke: '#9AA6B2', 'stroke-width': 3 }, c2e);
  [[-44, -8], [-26, 6], [-6, -18], [12, 4], [30, -12], [48, 2], [-14, -2]].forEach(([x, r], i) => E('rect', { x: 1030 + x - 7, y: 412 + (i % 3) * 6, width: 14, height: 54, rx: 3, fill: '#FFD45C', stroke: '#C98A1A', 'stroke-width': 2.5, transform: `rotate(${r} ${1030 + x} 450)` }, c2e));
  [[-30, 418], [4, 410], [26, 422], [-8, 428], [40, 412]].forEach(([x, y]) => E('rect', { x: 1030 + x, y, width: 6, height: 6, fill: '#FFFFFF', stroke: '#9AA6B2', 'stroke-width': 1 }, c2e));
  T(c2e, 1030, 528, 'sodium chloride', { size: 28, weight: 700, anchor: 'middle', fill: '#FFFFFF' });
  T(c2e, 1030, 564, 'on chips', { size: 28, weight: 600, anchor: 'middle', fill: C.energy });
  // 3 the Nigels: N2 is an element
  const s3 = G(fx), c3 = trapsCard(s3, 3);
  const c3a = txt(c3, 262, 'IDENTICAL atoms joined', { size: 36 });
  const c3b = txt(c3, 304, 'are still an', { size: 30, weight: 600, fill: C.muted });
  const c3c = txt(c3, 368, 'ELEMENT', { size: 58, weight: 800, fill: C.good });
  const c3d = G(c3);
  [[770, 'N'], [990, 'O']].forEach(([x, s]) => { tr(ecAtom(c3d, s, 28), x - 22, 448); tr(ecAtom(c3d, s, 28), x + 22, 448); trapsRich(c3d, x, 518, s + '_2', { size: 40 }); });
  const c3e = G(c3); txt(c3e, 568, 'not a compound', { size: 30, weight: 600, fill: '#8FA3B2' }); const c3s = strike(c3e, 772, 558, 988, C.bad);
  // 4 Sal: mass is conserved
  const s4 = G(fx), c4 = trapsCard(s4, 4);
  const c4a = txt(c4, 262, 'DISSOLVED ≠ DESTROYED', { size: 40, weight: 800, fill: C.energy });
  const c4b = txt(c4, 312, '10 g salt + 100 g water', { size: 32 });
  const c4c = G(c4);
  { const bk = beaker(c4c, 110, 96, { level: 0.65, liquid: C.water }); tr(bk, CX, 400);
    [[-30, 380], [-8, 410], [18, 388], [34, 418], [-26, 424], [6, 432], [26, 400]].forEach(([x, y]) => E('rect', { x: CX + x - 4, y: y - 4, width: 8, height: 8, fill: '#FFFFFF', stroke: '#9AA6B2', 'stroke-width': 1.5 }, c4c));
    E('rect', { x: CX - 120, y: 450, width: 240, height: 48, rx: 10, fill: '#5E6B78', stroke: '#C9D3DC', 'stroke-width': 3 }, c4c);
    E('rect', { x: CX - 70, y: 457, width: 140, height: 34, rx: 5, fill: '#16301C' }, c4c); }
  const c4disp = T(c4, CX, 484, '110 g', { size: 28, weight: 800, anchor: 'middle', fill: '#7CFF9E' });
  const c4d = txt(c4, 556, 'MASS IS CONSERVED', { size: 40, weight: 800, fill: C.good });
  // 5 Sandy: you can't filter salt out of salt water
  const s5 = G(fx), c5 = trapsCard(s5, 5);
  const c5a = txt(c5, 262, "You CAN'T filter salt", { size: 38, weight: 800, fill: C.energy });
  const c5b = txt(c5, 304, 'out of salt water', { size: 32 });
  const c5c = G(c5), FX = 740;
  E('path', { d: `M${FX - 74},372 L${FX + 74},372 L${FX + 10},446 L${FX + 10},480 L${FX - 10},480 L${FX - 10},446 Z`, fill: 'rgba(200,230,250,0.12)', stroke: GLASS.stroke, 'stroke-width': 4, 'stroke-linejoin': 'round' }, c5c);
  E('path', { d: `M${FX - 62},376 L${FX + 62},376 L${FX},440 Z`, fill: '#FBF7EC', stroke: '#C9BFA6', 'stroke-width': 2 }, c5c);
  const grain = G(c5c); tr(grain, FX, 396);
  E('path', { d: 'M-18,-4 L-10,-16 L6,-18 L18,-6 L16,10 L-2,16 L-16,10 Z', fill: ball('#EED39A', '#B08A46'), stroke: '#8A6A30', 'stroke-width': 2.5 }, grain);
  E('path', { d: 'M-12,-15 Q-12,-28 0,-28 Q12,-28 12,-15 Z M-22,-15 L22,-15', fill: '#F7A8C8', stroke: SC_INK, 'stroke-width': 2 }, grain);
  const bk5 = beaker(c5c, 96, 70, { level: 0.5, liquid: C.water }); tr(bk5, FX, 540);
  const drops5 = [0, 1].map(() => E('circle', { r: 5, fill: '#9FD8FF', stroke: '#FFFFFF', 'stroke-width': 1.5 }, c5c));
  const c5d = G(c5);
  T(c5d, 830, 420, 'dissolved salt', { size: 28, weight: 700, fill: '#9FD8FF' });
  T(c5d, 830, 456, 'passes through', { size: 28, weight: 600, fill: '#9FD8FF' });
  const c5e = G(c5);
  T(c5e, 830, 524, 'only sand', { size: 28, weight: 700, fill: '#EED39A' });
  T(c5e, 830, 560, 'gets STUCK', { size: 28, weight: 800, fill: C.energy });
  // 6 Arthur: evaporation keeps the solid, distillation keeps the liquid
  const s6 = G(fx), c6 = trapsCard(s6, 6);
  E('line', { x1: CX, y1: 236, x2: CX, y2: 572, stroke: C.line, 'stroke-width': 3 }, c6);
  const c6a = G(c6), L6 = 742, R6 = 1018;
  T(c6a, L6, 266, 'EVAPORATION', { size: 30, weight: 800, anchor: 'middle', fill: C.energy });
  E('path', { d: `M${L6 - 78},392 Q${L6},446 ${L6 + 78},392 Z`, fill: '#E3E8EE', stroke: '#9AA6B2', 'stroke-width': 4 }, c6a);
  E('path', { d: `M${L6 - 46},404 Q${L6 - 30},384 ${L6 - 14},402 Q${L6},380 ${L6 + 16},402 Q${L6 + 30},386 ${L6 + 46},404 Q${L6},424 ${L6 - 46},404 Z`, fill: '#FFFFFF', stroke: '#C9D3DC', 'stroke-width': 2 }, c6a);
  const steam6 = [0, 1, 2].map(i => E('path', { d: 'M0,0 Q-10,-14 0,-28 Q10,-42 0,-56', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 5, 'stroke-linecap': 'round' }, c6a));
  T(c6a, L6, 484, 'keeps the', { size: 28, weight: 600, anchor: 'middle', fill: C.muted });
  T(c6a, L6, 540, 'SOLID', { size: 46, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  const c6b = G(c6);
  T(c6b, R6, 266, 'DISTILLATION', { size: 30, weight: 800, anchor: 'middle', fill: '#9FD8FF' });
  const bk6 = beaker(c6b, 92, 100, { level: 0.7, liquid: C.water }); tr(bk6, R6, 390);
  const drop6 = E('path', { d: 'M0,-9 Q7,2 0,7 Q-7,2 0,-9 Z', fill: '#9FD8FF' }, c6b);
  T(c6b, R6, 484, 'keeps the', { size: 28, weight: 600, anchor: 'middle', fill: C.muted });
  T(c6b, R6, 540, 'LIQUID', { size: 46, weight: 800, anchor: 'middle', fill: '#9FD8FF' });
  // 7 Inky: impurities lower the melting point and spread it over a range
  const s7 = G(fx), c7 = trapsCard(s7, 7);
  const c7a = txt(c7, 258, 'IMPURITIES', { size: 44, weight: 800, fill: C.energy });
  const c7b = txt(c7, 300, 'LOWER the melting point', { size: 30 });
  const c7g = G(c7);
  E('path', { d: 'M650,330 L650,568 L1130,568', fill: 'none', stroke: C.muted, 'stroke-width': 4 }, c7g);
  T(c7g, 662, 352, 'temp', { size: 26, weight: 600, fill: C.muted });
  T(c7g, 1126, 556, 'time', { size: 26, weight: 600, anchor: 'end', fill: C.muted });
  const purePath = E('path', { d: 'M660,548 L760,450 L930,450 L1090,352', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 6, 'stroke-linejoin': 'round', 'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': '1 1' }, c7g);
  const impPath = E('path', { d: 'M660,562 L745,490 L950,464 L1100,384', fill: 'none', stroke: '#FF5FA2', 'stroke-width': 6, 'stroke-linejoin': 'round', 'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': '1 1' }, c7g);
  const c7p = T(c7g, 845, 434, 'pure: sharp', { size: 26, weight: 700, anchor: 'middle', fill: '#FFFFFF' });
  const c7i = T(c7g, 890, 546, 'impure: lower, a RANGE', { size: 26, weight: 700, anchor: 'middle', fill: '#FF8FC8' });

  /* ===== logo ===== */
  const sR = G(fx);
  const rSub = T(sR, 600, 520, 'will return', { size: 46, weight: 600, anchor: 'middle', fill: '#FFFFFF' });

  /* ===== stinger extras ===== */
  const sWheart = G(frontL);
  E('path', { d: 'M0,22 C-46,-6 -34,-42 -12,-40 C-4,-39 0,-31 0,-25 C0,-31 4,-39 12,-40 C34,-42 46,-6 0,22 Z', fill: '#FF5FA2', stroke: '#FFFFFF', 'stroke-width': 3 }, sWheart);
  const nobleChip = chip(fx, 'noble gas: does not bond', { size: 32, fill: 'rgba(42,22,80,0.9)', color: '#E3D4FF', stroke: '#CDB2FF', sw: 3 });
  const arChip = chip(fx, 'another argon (Ar)', { size: 32, fill: 'rgba(42,22,80,0.9)', color: '#E3D4FF', stroke: '#CDB2FF', sw: 3 });
  const logo = ecLogo(fx, 1);                                            // one logo: intro, return, final frame
  const endChip = chip(fx, 'still not bonded. just flatmates.', { size: 30, fill: 'rgba(10,27,39,0.85)', color: '#FFFFFF', stroke: '#CDB2FF', sw: 2 });

  /* ---------- shots ---------- */
  const SHOTS = [['I', -9], ['1', at('t1') - 0.05], ['2', at('t2') - 0.05], ['3', at('t3') - 0.05], ['4', at('t4') - 0.05], ['5', at('t5') - 0.05],
    ['6', at('t6') - 0.05], ['7', at('t7') - 0.05], ['R', at('return') - 0.05], ['F1', at('setup') - 0.05], ['F2', at('noble') - 0.05],
    ['F3', at('argon') - 0.05], ['F3b', end('argon') + 0.1], ['F4', at('flatmates') - 0.05]];
  const shotAt = t => { let s = 'I'; for (const [k, t0] of SHOTS) if (t >= t0) s = k; return s; };
  const groups = { I: shI, 1: s1, 2: s2, 3: s3, 4: s4, 5: s5, 6: s6, 7: s7, R: sR };
  const WHO = { 1: 'nate', 2: 'chloe', 3: 'nigels', 4: 'sal', 5: 'sandy', 6: 'arthur', 7: 'inky' };
  const SCALE = { nate: 1.15, chloe: 1.15, nigels: 1.0, sal: 1.15, sandy: 1.2, arthur: 1.3, inky: 1.15 };

  return t => {
    const sh = shotAt(t), F = sh[0] === 'F';
    for (const k in groups) op(groups[k], k === sh ? 1 : 0);
    op(introBg, sh === 'I' ? 1 : 0); op(logoBg, sh === 'R' ? 1 : 0); op(flat, F ? 1 : 0);
    conf.set(WHO[sh] ? 1 : 0, t);
    if (WHO[sh]) conf.firstChild.setAttribute('fill', CONF_FILL[WHO[sh]]);
    for (const k in ch) op(ch[k], 0);
    op(ar2, 0); op(sWheart, 0); op(nobleChip, 0); op(arChip, 0); op(logo, 0); op(endChip, 0);
    let cam = [600, 375, 1];
    const show = (c, x, y, s, st) => { op(c, 1); tr(c, x, y, s); c.set(Object.assign({ t }, st)); };

    if (sh === 'I') {
      logo.upd(t); op(logo, 1); tr(logo, 600, 600, 0.5);
      const hp = P(t, at('intro') - 0.1, 0.5, pop); op(iHead, clamp(hp * 2.5));
      iHead.setAttribute('transform', `translate(600 190) scale(${Math.max(0.01, 0.7 + 0.3 * hp).toFixed(3)}) translate(-600 -190)`);
      op(iSub, P(t, mid('intro', 0.4), 0.4, linear));
      signs.forEach((g, i) => trapsPop(g, t, mid('intro', 0.5) + i * 0.12, 240 + i * 120, 400 + 6 * Math.sin(t * 3 + i) * AMP, 1, 6 * Math.sin(t * 2.4 + i * 1.3) * AMP));
      cam = [600, 400, 1 + 0.04 * P(t, at('intro'), 4, linear)];
    } else if (WHO[sh]) {
      const k = WHO[sh], line = 't' + sh, m = f => mid(line, f);
      let mood = { nate: 'happy', chloe: 'smug', nigels: 'neutral', sal: 'happy', sandy: 'sad', arthur: 'deadpan', inky: 'happy' }[k];
      const st = { talk: talk(t, k), mood, look: 0 };
      if (k === 'chloe' && t > m(0.78)) st.mood = 'deadpan';
      if (k === 'nigels') {
        const both = t > m(0.7);
        st.talkB = both ? st.talk : 0; st.mood = st.moodB = 'neutral';
        st.look = both ? 1 : 0; st.lookB = both ? -1 : 0;
      }
      if (k === 'sandy' && t > m(0.7)) st.look = 0.6;
      show(ch[k], 320, 400, SCALE[k], st);
      cam = [600, 375, 1 + 0.03 * P(t, at(line), 4, linear)];
      if (sh === '1') {
        trapsPopAt(c1a, t, m(0.1), CX, 255);
        trapsPopAt(c1b, t, m(0.3), 790, 360);
        fade(c1c, t, m(0.44)); c1s.set(P(t, m(0.5), 0.35));
        fade(c1d, t, m(0.64)); trapsPopAt(c1e, t, m(0.8), CX, 520);
      } else if (sh === '2') {
        fade(c2a, t, m(0.08)); trapsPopAt(c2b, t, m(0.14), CX, 300); fade(c2c, t, m(0.3));
        trapsPopAt(c2d, t, m(0.55), 730, 470);
        op(c2arr, P(t, m(0.68), 0.2, linear)); c2arr.set(P(t, m(0.68), 0.4));
        trapsPopAt(c2e, t, m(0.76), 1030, 470);
      } else if (sh === '3') {
        fade(c3a, t, m(0.1)); fade(c3b, t, m(0.3)); trapsPopAt(c3c, t, m(0.4), CX, 350);
        fade(c3d, t, m(0.52)); fade(c3e, t, m(0.62)); c3s.set(P(t, m(0.68), 0.35));
      } else if (sh === '4') {
        trapsPopAt(c4a, t, m(0.08), CX, 250); fade(c4b, t, m(0.38)); fade(c4c, t, m(0.45));
        const dp = P(t, m(0.62), 0.4, pop); op(c4disp, clamp(dp * 2.5)); c4disp.setAttribute('transform', `translate(${CX} 474) scale(${Math.max(0.01, 0.6 + 0.4 * dp).toFixed(3)}) translate(${-CX} -474)`);
        trapsPopAt(c4d, t, m(0.78), CX, 545);
      } else if (sh === '5') {
        trapsPopAt(c5a, t, m(0.08), CX, 250); fade(c5b, t, m(0.2));
        fade(c5c, t, m(0.35)); fade(c5d, t, m(0.45)); trapsPopAt(c5e, t, m(0.72), 900, 540);
        drops5.forEach((d, i) => { const f = (t * 1.3 + i * 0.5) % 1; attr(d, 'cx', FX); attr(d, 'cy', 486 + f * 40); op(d, 1 - f); });
        tr(grain, FX + 2 * Math.sin(t * 5) * AMP * (t > m(0.72) ? 1 : 0), 396);
      } else if (sh === '6') {
        trapsPopAt(c6a, t, m(0.16), L6, 400);
        steam6.forEach((s, i) => { const f = (t * 0.6 + i / 3) % 1; tr(s, L6 - 26 + i * 26, 380 - f * 30); op(s, 0.6 * Math.sin(f * Math.PI)); });
        trapsPopAt(c6b, t, m(0.55), R6, 400);
        const f6 = (t * 1.1) % 1; tr(drop6, R6, 300 + f6 * 46); op(drop6, 1 - f6 * 0.6);
      } else if (sh === '7') {
        trapsPopAt(c7a, t, m(0.08), CX, 245); fade(c7b, t, m(0.24));
        fade(c7g, t, m(0.3));
        attr(purePath, 'stroke-dashoffset', (1 - P(t, m(0.3), 0.8)).toFixed(3));
        attr(impPath, 'stroke-dashoffset', (1 - P(t, m(0.5), 0.8)).toFixed(3));
        fade(c7p, t, m(0.45)); fade(c7i, t, m(0.72));
      }
    } else if (sh === 'R') {
      logo.upd(t);
      const lp = P(t, at('return') - 0.05, 0.6, pop); op(logo, clamp(lp * 2.5)); tr(logo, 590, 300, Math.max(0.01, 0.95 * (0.5 + 0.5 * lp)));
      op(rSub, P(t, mid('return', 0.5), 0.4, linear));
    } else {
      /* ---------- the stinger, in Arthur's flat ---------- */
      flat.upd(t, AMP);
      const aT = talk(t, 'arthur'), nT = talk(t, 'nigels');
      if (sh === 'F1') {
        show(ch.nigels, 470, 440, 0.78, { talk: nT, talkB: nT, mood: 'happy', look: 1, lookB: 1 });
        show(ar2, 680, 470, 0.62, { mood: 'deadpan', look: 1 });
        show(ch.arthur, 910, 470, 0.62, { mood: 'deadpan', look: -1 });
        const hp = P(t, mid('setup', 0.7), 0.4, pop); op(sWheart, clamp(hp * 2.5)); tr(sWheart, 680, 360 + 4 * Math.sin(t * 4) * AMP, Math.max(0.01, hp));
        cam = [760, 460, 1.3 + 0.04 * P(t, at('setup'), 3, linear)];
      } else if (sh === 'F2') {
        show(ch.arthur, 910, 470, 0.62, { talk: aT, mood: 'deadpan', look: t < mid('noble', 0.3) ? -1 : 0 });
        show(ar2, 680, 470, 0.62, { mood: 'deadpan', look: 1 });
        const push = P(t, at('noble'), end('noble') + 0.5 - at('noble'), linear);
        cam = [910, 450, 1.55 + 0.15 * push];
        const cp = P(t, mid('noble', 0.4), 0.4, pop); op(nobleChip, clamp(cp * 2.5)); tr(nobleChip, 860, 650, Math.max(0.01, 0.7 + 0.3 * cp));
      } else if (sh === 'F3') {
        show(ch.nigels, 470, 440, 0.78, { talk: nT, mood: 'neutral', look: 1, lookB: 1 });
        show(ar2, 680, 470, 0.62, { mood: 'deadpan', look: -1 });
        cam = [560, 440, 1.35];
        const cp = P(t, mid('argon', 0.55), 0.4, pop); op(arChip, clamp(cp * 2.5)); tr(arChip, 700, 650, Math.max(0.01, 0.7 + 0.3 * cp));
      } else if (sh === 'F3b') {
        // the stare: both argons, same seed, so they blink at exactly the same moment
        show(ar2, 680, 470, 0.62, { mood: 'deadpan', look: 1 });
        show(ch.arthur, 910, 470, 0.62, { mood: 'deadpan', look: -1 });
        const push = P(t, end('argon') + 0.1, at('flatmates') - end('argon'), linear);
        cam = [795, 460, 1.45 + 0.12 * push];
      } else {
        // flatmates: opposite ends of the sofa, the Nigels between, the logo
        show(ch.arthur, 1018, 505, 0.5, { talk: aT, mood: 'deadpan', look: t < end('flatmates') ? -0.6 : 0 });
        show(ar2, 802, 505, 0.5, { mood: 'deadpan', look: t < end('flatmates') ? 0.6 : 0 });
        show(ch.nigels, 910, 452, 0.46, { mood: 'happy', look: 0 });
        const lp = P(t, end('flatmates') + 0.05, 0.6, pop);
        logo.upd(t); op(logo, clamp(lp * 2.5)); tr(logo, 330, 230, Math.max(0.01, 0.48 * (0.6 + 0.4 * lp)));
        const cp = P(t, end('flatmates') + 0.35, 0.45, pop); op(endChip, clamp(cp * 2.5)); tr(endChip, 600, 690, Math.max(0.01, 0.7 + 0.3 * cp));
        cam = [800, 470, 1.5];
      }
    }
    trapsCam(cam[0], cam[1], cam[2]);
  };
});
