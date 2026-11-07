/* Recap: a padlock clicks shut beside a face-down deck of four cards. Each memory hook is dealt from
   the deck and flips face up (Tall Brontosaurs Breathe Air, with the airway lighting T, B, B, A;
   Breathing IN, every i glowing beside a breathing chest; TIMS; Cigarettes Cause Trouble).
   Showpiece: the four cards fan out together into a grid, then sweep away for "5 exam traps", where
   each trap shows the wrong idea struck out, the right idea ticked, and a small picture. */
scene('recap', S => {
  const { at, end, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;

  /* ---------- local helpers ---------- */
  function rich(parent, x, y, segs, o) {
    o = o || {};
    const t = E('text', { x, y, 'font-size': o.size || 30, 'font-weight': o.weight || 600, 'font-family': o.font || FD, 'text-anchor': o.anchor || 'start', fill: o.fill || C.ink }, parent);
    segs.forEach(s => { if (typeof s === 'string') s = [s]; E('tspan', { fill: s[1], 'font-weight': s[2] }, t).textContent = s[0]; });
    return t;
  }
  const plain = segs => segs.map(s => (typeof s === 'string' ? s : s[0])).join('');
  const fit = (segs, size, maxW) => { const w = textWidth(plain(segs), size, FD, 700); return w > maxW ? Math.floor(size * maxW / w) : size; };
  /* "Tall Brontosaurs ..." with each first letter bold yellow */
  const initials = (str, col) => str.split(/(\s+|,\s*)/).filter(Boolean).flatMap(w => (/^[A-Za-z]/.test(w) ? [[w[0], C.energy, 800], [w.slice(1), col]] : [w]));
  const Y = C.energy, OUT = '#E9C7D2', LUM = '#4A2233', TARLT = '#D9A066', STEEL = '#C9D6DE';
  const circD = (x, y, r) => `M${(x - r).toFixed(1)},${y.toFixed(1)} a${r},${r} 0 1,0 ${(2 * r).toFixed(1)},0 a${r},${r} 0 1,0 ${(-2 * r).toFixed(1)},0 `;
  const LOBE = 'M-30,-70 C-70,-90 -128,-40 -132,40 C-136,110 -112,150 -70,152 C-40,154 -22,130 -20,90 C-18,40 -10,-20 -30,-70 Z';
  const LUNGS_D = LOBE + ' M30,-70 C70,-90 128,-40 132,40 C136,110 112,150 70,152 C40,154 22,130 20,90 C18,40 10,-20 30,-70 Z M-9,-150 L9,-150 L9,-64 L-9,-64 Z';
  function molCO(parent, r) { const g = G(parent); tr(atom(g, 'C', r), -r * 0.74, 0); tr(atom(g, 'O', r * 0.94), r * 0.74, 0); return g; }
  function tarDrop(parent, s) { const g = G(parent); E('path', { d: 'M0,-26 C10,-12 17,-2 17,8 A17,17 0 0 1 -17,8 C-17,-2 -10,-12 0,-26 Z', fill: ball('#A8703A', '#5A3410'), stroke: TARLT, 'stroke-width': 2.5, transform: `scale(${s})` }, g); return g; }
  function chainIcon(parent) {
    const g = G(parent);
    [-26, -12, 2].forEach((x, i) => E('rect', { x: x - 8, y: i % 2 ? -2 : -6, width: 16, height: i % 2 ? 4 : 12, rx: i % 2 ? 2 : 6, fill: i % 2 ? STEEL : 'none', stroke: STEEL, 'stroke-width': i % 2 ? 1.5 : 3 }, g));
    E('path', { d: 'M12,-4 L12,-10 A7,7 0 0 1 26,-10 L26,-4', fill: 'none', stroke: '#DDE6EC', 'stroke-width': 3.5 }, g);
    E('rect', { x: 8, y: -6, width: 22, height: 17, rx: 4, fill: ball('#B9C6D2', '#5E6F7E') }, g);
    return g;
  }

  /* ---------- padlock ---------- */
  const lockG = G(root); tr(lockG, 600, 300);
  const shackle = E('path', { d: 'M-52,0 L-52,-50 A52,52 0 0 1 52,-50 L52,0', fill: 'none', stroke: '#C9D6DE', 'stroke-width': 22, 'stroke-linecap': 'round' }, lockG);
  E('rect', { x: -86, y: -8, width: 172, height: 134, rx: 24, fill: ball(C.glucose, C.glucoseDk), stroke: C.glucoseLt, 'stroke-width': 4 }, lockG);
  E('circle', { cx: 0, cy: 42, r: 15, fill: '#3A2A08' }, lockG);
  E('path', { d: 'M-8,48 L8,48 L11,86 L-11,86 Z', fill: '#3A2A08' }, lockG);
  const clickRing = E('circle', { cx: 0, cy: 40, r: 120, fill: 'none', stroke: C.energy, 'stroke-width': 6 }, lockG);
  T(lockG, 0, 220, 'Lock it in', { size: 54, weight: 700, anchor: 'middle' });

  /* ---------- the deck of memory-hook cards ---------- */
  const CW = 520, CH = 255;
  const FOC = [600, 432, 1.3];
  const DECK = [1046, 640, 0.3, -8];
  const SLOT = [[310, 245, -1.6], [890, 245, 1.3], [310, 525, 1.1], [890, 525, -1.4]];
  const IDS = ['tbba', 'dips', 'tims', 'cct'];
  function backArt(parent) {
    const g = G(parent);
    E('rect', { x: -CW / 2, y: -CH / 2, width: CW, height: CH, rx: 22, fill: '#3B1F2C', stroke: '#F48FA6', 'stroke-width': 5 }, g);
    E('rect', { x: -CW / 2 + 22, y: -CH / 2 + 22, width: CW - 44, height: CH - 44, rx: 14, fill: 'none', stroke: 'rgba(244,143,166,0.45)', 'stroke-width': 4 }, g);
    E('path', { d: LUNGS_D, fill: ball('#F48FA6', '#B8466A'), stroke: '#FFD0DC', 'stroke-width': 5, transform: 'scale(0.62)' }, g);
    return g;
  }
  const deckG = G(root);
  const deckBacks = [0, 1, 2, 3].map(k => { const b = backArt(deckG); tr(b, DECK[0] - k * 4, DECK[1] - k * 5, DECK[2], DECK[3]); return b; });
  const cardsG = G(root);
  const HC = IDS.map(id => {
    const g = G(cardsG);
    E('rect', { x: -CW / 2 + 8, y: -CH / 2 + 12, width: CW, height: CH, rx: 22, fill: 'rgba(0,0,0,0.28)' }, g);
    const back = backArt(g);
    const front = G(g);
    card(front, -CW / 2, -CH / 2, CW, CH, { fill: C.card, stroke: C.line });
    const hl = E('rect', { x: -CW / 2, y: -CH / 2, width: CW, height: CH, rx: 22, fill: 'none', stroke: Y, 'stroke-width': 4 }, front);
    return { id, g, back, front, hl, rows: [] };
  });
  const title = (c, segs, maxW) => rich(c.front, -228, -70, segs, { size: fit(segs, 36, maxW || 456), weight: 700 });
  const ROWY = [-20, 20, 60, 100];

  // 1. Tall Brontosaurs Breathe Air, beside a little airway tree that lights T, B, B, A
  const k1 = HC[0];
  title(k1, initials('Tall Brontosaurs Breathe Air', C.ink));
  [['T', 'rachea'], ['B', 'ronchi'], ['B', 'ronchioles'], ['A', 'lveoli']].forEach(([a, b], i) => k1.rows.push(rich(k1.front, -228, ROWY[i] + 10, [[a, Y, 800], [b, C.ink, 700]], { size: 28 })));
  const mt = G(k1.front); tr(mt, 150, -28);
  const MT = {
    t: 'M0,-12 L0,40',
    b: 'M0,40 Q0,52 -30,62 M0,40 Q0,52 30,62',
    bl: 'M-30,62 Q-40,70 -56,74 M-30,62 Q-30,76 -36,92 M30,62 Q40,70 56,74 M30,62 Q30,76 36,92',
  };
  const mtParts = [
    E('path', { d: MT.t, fill: 'none', stroke: OUT, 'stroke-width': 12, 'stroke-linecap': 'round' }, mt),
    E('path', { d: MT.b, fill: 'none', stroke: OUT, 'stroke-width': 9, 'stroke-linecap': 'round' }, mt),
    E('path', { d: MT.bl, fill: 'none', stroke: OUT, 'stroke-width': 6, 'stroke-linecap': 'round' }, mt),
    E('path', { d: circD(-62, 76, 8) + circD(-56, 86, 7) + circD(-68, 86, 6) + circD(-40, 100, 8) + circD(-30, 100, 6) + circD(-38, 110, 6) + circD(62, 76, 8) + circD(56, 86, 7) + circD(68, 86, 6) + circD(40, 100, 8) + circD(30, 100, 6) + circD(38, 110, 6), fill: ball('#F7A1B5', '#C25A7A'), stroke: '#FFD0DC', 'stroke-width': 1.5 }, mt),
  ];
  E('path', { d: 'M-5,-6 L5,-6 M-5,6 L5,6 M-5,18 L5,18 M-5,30 L5,30', stroke: '#C99AAA', 'stroke-width': 3, 'stroke-linecap': 'round' }, mt);
  const mtTags = [[20, 12, 'T'], [44, 50, 'B'], [74, 70, 'B'], [86, 104, 'A']].map(([x, y, L]) => T(mt, x, y, L, { size: 26, weight: 800, fill: Y }));

  // 2. Breathing IN: every i glows, beside a chest that breathes in
  const k2 = HC[1];
  title(k2, ['Breathing ', ['IN', Y, 800], ': think of the letter ', ['I', Y, 800]], 456);
  const DIPS = [['the diaphragm d', 'i', 'ps'], ['the ribs r', 'i', 'se'], ['the volume r', 'i', 'ses'], ['the pressure d', 'i', 'ps']];
  const iGlows = DIPS.map(([a, b, c], i) => {
    const x = -228 + textWidth(a, 27, FD, 700) + textWidth(b, 27, FD, 800) / 2;
    const gl = E('circle', { cx: x, cy: ROWY[i] + 1, r: 20, fill: glow(Y) }, k2.front);
    k2.rows.push(rich(k2.front, -228, ROWY[i] + 10, [[a, C.ink, 700], [b, Y, 800], [c, C.ink, 700]], { size: 27 }));
    return gl;
  });
  const chestG = G(k2.front); tr(chestG, 172, 34);
  const ribL = E('path', { d: 'M-12,-48 Q-56,-44 -62,-6 M-12,-26 Q-56,-22 -62,14 M-12,-4 Q-54,0 -58,32', fill: 'none', stroke: '#E4ECF5', 'stroke-width': 4, 'stroke-linecap': 'round' }, chestG);
  const ribR = E('path', { d: 'M12,-48 Q56,-44 62,-6 M12,-26 Q56,-22 62,14 M12,-4 Q54,0 58,32', fill: 'none', stroke: '#E4ECF5', 'stroke-width': 4, 'stroke-linecap': 'round' }, chestG);
  const chLungs = E('path', { d: LUNGS_D, fill: ball('#F48FA6', '#B8466A'), stroke: '#FFD0DC', 'stroke-width': 6 }, chestG);
  const diaph = E('path', { fill: 'none', stroke: C.heat, 'stroke-width': 7, 'stroke-linecap': 'round' }, chestG);

  // 3. TIMS
  const k3 = HC[2];
  title(k3, [['T', Y, 800], ['I', Y, 800], ['M', Y, 800], ['S', Y, 800], [': built for fast diffusion', C.ink, 600]], 456);
  const TIMS = [
    [g => E('path', { d: 'M-10,-12 L-10,12 M-2,-12 L-2,12', stroke: '#F4A3B8', 'stroke-width': 3, 'stroke-linecap': 'round' }, g), [['T', Y, 800], ['hin walls', C.ink, 700]]],
    [g => { E('path', { d: 'M-16,0 L16,0', stroke: '#B83246', 'stroke-width': 12, 'stroke-linecap': 'round' }, g); E('path', { d: circD(-8, 0, 3.5) + circD(4, 0, 3.5), fill: '#FF8A94' }, g); }, ['lots of blood ', ['I', Y, 800], 'n the capillaries']],
    [g => E('path', { d: 'M0,-14 C6,-6 10,0 10,5 A10,10 0 0 1 -10,5 C-10,0 -6,-6 0,-14 Z', fill: C.water }, g), ['a ', ['M', Y, 800], 'oist lining']],
    [g => E('path', { d: 'M-15,8 Q-10,-12 -5,8 Q0,-12 5,8 Q10,-12 15,8', fill: 'none', stroke: Y, 'stroke-width': 3.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g), ['a big ', ['S', Y, 800], 'urface area']],
  ];
  TIMS.forEach(([icon, segs], i) => { const r = G(k3.front); const ic = G(r); tr(ic, -214, ROWY[i] + 1); icon(ic); rich(r, -188, ROWY[i] + 10, segs, { size: 27, weight: 700 }); k3.rows.push(r); });

  // 4. Cigarettes Cause Trouble
  const k4 = HC[3];
  title(k4, initials('Cigarettes Cause Trouble', C.ink));
  const CCT = [
    [g => molCO(g, 12), [['c', Y, 800], ['arbon monoxide', C.ink, 700]]],
    [g => tarDrop(g, 0.72), [['c', Y, 800], ['ancer-causing tar', C.ink, 700]]],
    [g => chainIcon(g), [['t', Y, 800], ['obacco’s nicotine', C.ink, 700]]],
  ];
  CCT.forEach(([icon, segs], i) => { const r = G(k4.front); const ic = G(r); tr(ic, -206, -14 + i * 46); icon(ic); rich(r, -168, -4 + i * 46, segs, { size: 28, weight: 700 }); k4.rows.push(r); });

  /* ---------- exam traps ---------- */
  const traps = G(root);
  const head = G(traps);
  E('path', { d: 'M0,-34 L36,30 L-36,30 Z', fill: C.energy, stroke: '#FFF3A6', 'stroke-width': 4, 'stroke-linejoin': 'round', transform: 'translate(88 150)' }, head);
  T(head, 88, 174, '!', { size: 44, weight: 700, fill: C.bg0, anchor: 'middle' });
  T(head, 140, 170, '5 exam traps', { size: 48, weight: 700 });
  const slotNames = ['≠ respiration', 'muscles contract', 'pressure falls', 'diffusion', 'still 16% oxygen'];
  const slots = slotNames.map((nm, i) => {
    const g = G(traps), y = 252 + i * 84;
    const box = E('rect', { x: 50, y: y - 32, width: 300, height: 64, rx: 32, fill: C.card, stroke: C.line, 'stroke-width': 3 }, g);
    const disc = E('circle', { cx: 86, cy: y, r: 21, fill: C.card2, stroke: C.muted, 'stroke-width': 2 }, g);
    const num = T(g, 86, y + 9, String(i + 1), { size: 26, weight: 700, anchor: 'middle' });
    T(g, 120, y + 9, nm, { size: Math.max(24, fit([nm], 25, 218)), weight: 600 });
    const tk = tick(g, 11); tr(tk, 86, y + 1);
    return { g, box, disc, num, tk };
  });
  const focus = G(traps);
  card(focus, 370, 215, 780, 420, { fill: C.card, stroke: C.line });
  const hint = T(focus, 760, 438, 'Spot the mistake, then fix it', { size: 30, weight: 600, fill: C.muted, anchor: 'middle' });
  function trapGroup(wrong, right, drawIllus) {
    const g = G(focus);
    const wx = cross(g, 14); tr(wx, 420, 302);
    const wt = T(g, 458, 313, wrong, { size: 32, weight: 600, fill: C.muted });
    const sw = textWidth(wrong, 32, FD, 600);
    const st = strike(g, 452, 302, 466 + sw, C.bad);
    const rg = G(g);
    const rt = tick(rg, 15); tr(rt, 420, 402);
    rich(rg, 458, 414, right, { size: fit(right, 36, 660), weight: 700 });
    const ill = G(g); tr(ill, 760, 540);
    const anim = drawIllus(ill) || (() => {});
    return { g, wt, st, rg, ill, anim };
  }
  const T5 = [
    trapGroup('Breathing is respiration', ['Breathing ', ['moves air', Y, 800], '; it isn’t respiration'], g => {
      const lg = lungs(g, 0.3); tr(lg, -170, -6);
      const aIn = arrow(g, -238, -64, -192, -40, { color: C.air, width: 4 }), aOut = arrow(g, -148, -40, -102, -64, { color: C.air, width: 4 });
      T(g, -170, 76, 'moves air', { size: 26, weight: 700, anchor: 'middle', fill: C.air });
      T(g, 0, 14, '≠', { size: 60, weight: 700, anchor: 'middle', fill: C.muted });
      const cell = animalCell(g, 58, 44, { sw: 4, nr: 12, nx: -24, ny: -8, seed: 5 }); tr(cell, 170, -8);
      const sp = spark(g, 18, { seed: 2 }); tr(sp, 186, 2);
      T(g, 170, 76, 'a reaction in cells', { size: 26, weight: 700, anchor: 'middle', fill: Y });
      return t => { lg.set(calm * wave(t, 2.4)); const b = wave(t, 2.4); op(aIn, 0.25 + 0.75 * b); op(aOut, 0.25 + 0.75 * (1 - b)); cell.upd(t); sp.upd(t); };
    }),
    trapGroup('The diaphragm relaxes to breathe in', ['Breathe in: muscles ', ['contract', Y, 800]], g => {
      const ch = G(g); tr(ch, -150, 0);
      E('path', { d: 'M-24,-58 Q-70,-54 -80,-6 M-24,-32 Q-68,-28 -78,20 M24,-58 Q70,-54 80,-6 M24,-32 Q68,-28 78,20', fill: 'none', stroke: '#E4ECF5', 'stroke-width': 4, 'stroke-linecap': 'round' }, ch);
      const lu = E('path', { d: LUNGS_D, fill: ball('#F48FA6', '#B8466A'), stroke: '#FFD0DC', 'stroke-width': 6 }, ch);
      const dm = E('path', { fill: 'none', stroke: C.heat, 'stroke-width': 8, 'stroke-linecap': 'round' }, ch);
      const dn = arrow(ch, 0, 54, 0, 88, { color: Y, width: 5 });
      const chipC = chip(g, 'contracts and flattens', { size: 26, fill: C.card2, stroke: Y }); tr(chipC, 150, -6);
      T(g, 150, 54, 'it relaxes when you breathe out', { size: 24, weight: 600, anchor: 'middle', fill: C.muted });
      return t => {
        const f = P(t, mid('t2', 0.42), 0.9, ease);
        dm.setAttribute('d', `M-74,44 Q0,${(44 - 46 * (1 - f)).toFixed(1)} 74,44`);
        lu.setAttribute('transform', `translate(0 ${(-24 + 6 * f).toFixed(1)}) scale(${(0.32 + 0.03 * f).toFixed(3)} ${(0.32 + 0.06 * f).toFixed(3)})`);
        dn.set(P(t, mid('t2', 0.48), 0.6)); op(dn, P(t, mid('t2', 0.48), 0.2, linear));
        op(chipC, P(t, mid('t2', 0.55), 0.4, linear));
      };
    }),
    trapGroup('The lungs pull air in', ['Air rushes in because ', ['pressure falls', Y, 800]], g => {
      const pm = meter(g, { w: 34, h: 150, vertical: true, color: C.air }); tr(pm, -250, -82);
      E('path', { d: 'M-262,-37 L-204,-37', stroke: C.ink, 'stroke-width': 3, 'stroke-dasharray': '7 5' }, g);
      T(g, -198, -30, 'air outside', { size: 26, weight: 600, fill: C.muted });
      T(g, -233, 100, 'pressure inside', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
      const lg = lungs(g, 0.32); tr(lg, 150, 10);
      const arrs = [arrow(g, 150, -112, 150, -66, { color: C.air, width: 6 }), arrow(g, 70, -100, 106, -62, { color: C.air, width: 5 }), arrow(g, 230, -100, 194, -62, { color: C.air, width: 5 })];
      T(g, 150, 92, 'the air outside pushes in', { size: 26, weight: 700, anchor: 'middle', fill: C.air });
      return t => {
        const f = P(t, mid('t3', 0.4), 1.2, ease);
        pm.set(lerp(0.7, 0.3, f)); lg.set(P(t, mid('t3', 0.5), 1.2, ease));
        arrs.forEach((a, k) => { const u = ((t * 1.1) + k / 3) % 1; a.set(1); op(a, P(t, mid('t3', 0.5), 0.3, linear) * (0.35 + 0.65 * Math.sin(u * Math.PI))); });
      };
    }),
    trapGroup('Oxygen is pumped into the blood', ['Oxygen gets in by ', ['diffusion', Y, 800], ', not pumping'], g => {
      const pump = G(g); tr(pump, -190, -6);
      E('rect', { x: -30, y: -18, width: 60, height: 66, rx: 8, fill: ball('#9DB0BF', '#5E6F7E') }, pump);
      E('path', { d: 'M0,-18 L0,-58 M-22,-58 L22,-58', stroke: '#C9D6DE', 'stroke-width': 8, 'stroke-linecap': 'round' }, pump);
      E('path', { d: 'M30,30 L50,30', stroke: '#C9D6DE', 'stroke-width': 8, 'stroke-linecap': 'round' }, pump);
      tr(cross(g, 34), -190, -6);
      E('rect', { x: 40, y: -70, width: 10, height: 140, rx: 5, fill: '#F4A3B8' }, g);
      T(g, -30, 92, 'high', { size: 26, weight: 700, anchor: 'middle', fill: C.muted }); T(g, 130, 92, 'low', { size: 26, weight: 700, anchor: 'middle', fill: C.muted });
      const dr = rng(31), dots = [];
      for (let k = 0; k < 14; k++) dots.push({ el: E('circle', { r: 7, fill: ball(C.oxygen, C.oxygenDk) }, g), x0: -60 + dr() * 80, y0: -60 + dr() * 120, cross: k % 2 === 0, x1: 70 + dr() * 90, y1: -60 + dr() * 120, ph: dr() });
      arrow(g, -10, -86, 120, -86, { color: Y, width: 5 });
      return t => {
        const go = P(t, mid('t4', 0.4), 1.6, ease);
        dots.forEach((d, k) => { const j = Math.sin(t * 2 + k) * 4 * calm; const x = d.cross ? lerp(d.x0, d.x1, go) : d.x0, y = d.cross ? lerp(d.y0, d.y1, go) : d.y0; attr(d.el, 'cx', x + j); attr(d.el, 'cy', y + Math.cos(t * 1.7 + k) * 4 * calm); });
      };
    }),
    trapGroup('You breathe out pure carbon dioxide', ['Breathed-out air: ', ['16% oxygen', '#FF9A8F', 800], ', only ', ['4% CO₂', C.co2, 800]], g => {
      T(g, -250, -62, 'air you breathe out', { size: 26, weight: 600, fill: C.muted });
      const bars = [['oxygen', 16, C.oxygen, -16], ['carbon dioxide', 4, C.co2, 34]].map(([nm, v, col, y]) => {
        T(g, -250, y + 8, nm, { size: 26, weight: 700, fill: col === C.co2 ? C.co2 : '#FF9A8F' });
        const m = meter(g, { w: 260, h: 26, color: col, track: '#0B2230' }); tr(m, -50, y - 13);
        const lb = T(g, 222, y + 9, v + '%', { size: 30, weight: 700, fill: col === C.co2 ? C.co2 : '#FF9A8F' });
        return { m, v };
      });
      T(g, -250, 84, 'the rest is mostly nitrogen (78%)', { size: 24, weight: 600, fill: C.muted });
      return t => bars.forEach((b, k) => b.m.set(b.v / 20 * P(t, mid('t5', 0.6) + k * 0.25, 0.8, easeOut)));
    }),
  ];

  /* ---------- update ---------- */
  const tDeal = i => at(IDS[i]) - 0.2;
  const tFan = mid('cct', 0.42), tSweep = at('traps') - 0.3;
  const rowAt = [[0.5, 0.62, 0.74, 0.86], [0.2, 0.42, 0.58, 0.76], [0.12, 0.3, 0.58, 0.76], [0.5, 0.66, 0.84]];
  return t => {
    // padlock: shackle drops shut, a ring pulses
    const la = win(t, S.first - 0.6, at('tbba') + 0.1, 0.4);
    op(lockG, la);
    if (la > 0) {
      const shut = P(t, mid('lock', 0.4), 0.35, easeIn);
      tr(shackle, 0, -32 * (1 - shut));
      const rp = clamp((t - mid('lock', 0.4) - 0.35) / 0.7);
      op(clickRing, rp > 0 && rp < 1 ? 1 - rp : 0); attr(clickRing, 'r', 90 + rp * 70);
      tr(lockG, 600, 300 - 30 * P(t, at('tbba') - 0.4, 0.5), 1 - 0.1 * P(t, at('tbba') - 0.4, 0.5));
    }

    // the deck: one face-down card leaves each time a hook is dealt
    op(deckG, P(t, S.first - 0.6, 0.5, linear) * (1 - P(t, tSweep, 0.3, linear)));
    let dealt = 0; IDS.forEach((id, i) => { if (t >= tDeal(i)) dealt = i + 1; });
    deckBacks.forEach((b, k) => op(b, k < 4 - dealt ? 1 : 0));

    // the hook cards: dealt and flipped, piled, fanned out, swept away
    HC.forEach((c, i) => {
      const t0 = tDeal(i);
      if (t < t0) { op(c.g, 0); return; }
      const pd = P(t, t0, 0.75, easeOut), k = 3 - i;
      const sx0 = DECK[0] - k * 4, sy0 = DECK[1] - k * 5;
      let x = lerp(sx0, FOC[0], pd), y = lerp(sy0, FOC[1], pd) - 90 * Math.sin(pd * Math.PI), s = lerp(DECK[2], FOC[2], pd), r = lerp(DECK[3], 0, pd) + 10 * Math.sin(pd * Math.PI);
      let depth = 0;
      for (let j = i + 1; j < 4; j++) depth += P(t, tDeal(j), 0.6);
      x -= 14 * depth; y += 10 * depth; r -= 2.4 * depth;
      const pf = P(t, tFan + i * 0.08, 0.85, easeOut);
      const sl = SLOT[i];
      x = lerp(x, sl[0], pf); y = lerp(y, sl[1], pf); s = lerp(s, 1, pf); r = lerp(r, sl[2], pf) + 8 * Math.sin(pf * Math.PI) * (i % 2 ? 1 : -1);
      const pw = P(t, tSweep + i * 0.06, 0.55, easeIn);
      x += 1300 * pw; r += 24 * pw;
      op(c.g, 1 - P(t, tSweep + i * 0.06 + 0.35, 0.2, linear));
      if (pw >= 1) return;
      const f = P(t, t0 + 0.08, 0.5, linear), face = f >= 0.5, sx = s * Math.max(0.001, Math.abs(1 - 2 * f));
      op(c.back, face ? 0 : 1); op(c.front, face ? 1 : 0);
      c.g.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${r.toFixed(2)}) scale(${sx.toFixed(4)} ${s.toFixed(4)})`);
      op(c.hl, (1 - clamp(depth)) * (1 - pf) * P(t, t0 + 0.6, 0.3, linear));
      c.rows.forEach((rw, j) => op(rw, 0.2 + 0.8 * P(t, mid(c.id, rowAt[i][j]) - 0.1, 0.35, linear)));
    });
    // card 1: the airway lights up from the top, T, B, B, A
    const onT = [0.5, 0.62, 0.74, 0.86].map(f => P(t, mid('tbba', f) - 0.1, 0.35, linear));
    mtParts.forEach((p, j) => p.setAttribute('opacity', (0.35 + 0.65 * onT[j]).toFixed(3)));
    mtTags.forEach((p, j) => op(p, onT[j]));
    // card 2: each i glows as it is said; the chest breathes in (diaphragm dips, ribs rise)
    iGlows.forEach((gl, j) => op(gl, P(t, mid('dips', rowAt[1][j]) - 0.1, 0.35, linear) * (0.6 + 0.4 * wave(t, 1.1, j * 0.25))));
    const br = t < tFan ? P(t, mid('dips', 0.2), 1.6, ease) : 1 - calm * 0.5 * (1 - Math.cos((t - tFan) * TAU / 3.6));
    diaph.setAttribute('d', `M-62,${(56 + 6 * br).toFixed(1)} Q0,${(56 - 34 * (1 - br) + 6 * br).toFixed(1)} 62,${(56 + 6 * br).toFixed(1)}`);
    ribL.setAttribute('transform', `rotate(${(8 * br).toFixed(2)} -12 -48)`); ribR.setAttribute('transform', `rotate(${(-8 * br).toFixed(2)} 12 -48)`);
    chLungs.setAttribute('transform', `translate(0 ${(-4 + 4 * br).toFixed(1)}) scale(${(0.3 + 0.03 * br).toFixed(3)} ${(0.3 + 0.05 * br).toFixed(3)})`);

    // traps
    const ta = P(t, at('traps') + 0.05, 0.5, linear);
    op(traps, ta);
    if (ta > 0) {
      op(hint, 1 - P(t, at('t1') - 0.3, 0.3, linear));
      slots.forEach((s, i) => {
        const k = i + 1, tk = at('t' + k), nx = k < 5 ? at('t' + (k + 1)) : 1e6;
        const appear = P(t, mid('traps', 0.2 + i * 0.12), 0.45, pop);
        const active = t >= tk - 0.15 && t < nx - 0.15, done = t >= nx - 0.15;
        op(s.g, clamp(appear * 2) * (active || done ? 1 : 0.6));
        tr(s.g, (1 - clamp(appear)) * -30, 0);
        s.box.setAttribute('stroke', active ? C.energy : C.line);
        s.box.setAttribute('fill', active ? C.card2 : C.card);
        s.disc.setAttribute('fill', done ? C.good : active ? C.energy : C.card2);
        s.num.setAttribute('fill', active ? C.bg0 : C.ink);
        op(s.num, done ? 0 : 1); op(s.tk, done ? 1 : 0);
        s.tk.firstChild.setAttribute('stroke', C.bg0);
      });
      T5.forEach((g, i) => {
        const k = 't' + (i + 1), t0 = at(k), nx = i < 4 ? at('t' + (i + 2)) : 1e6;
        const v = win(t, t0 - 0.2, nx + 0.05, 0.3);
        op(g.g, v);
        if (v <= 0) return;
        op(g.wt, P(t, t0 - 0.2, 0.4, linear));
        g.st.set(P(t, mid(k, 0.2), 0.5, easeOut));
        const rp = P(t, mid(k, 0.3), 0.55, pop); op(g.rg, clamp(rp * 2)); tr(g.rg, (1 - clamp(rp)) * 20, 0);
        const ip = P(t, mid(k, 0.4), 0.55, pop); op(g.ill, clamp(ip * 2)); tr(g.ill, 760, 540, 0.85 + 0.15 * clamp(ip));
        g.anim(t);
      });
    }
  };
});
