/* Chapter: Molecules and particle pictures.
   Two atoms join into a molecule -> element molecules O2, H2, N2 ("element: same atoms")
   -> compound molecules H2O, CO2 -> particle pictures: three empty boxes and a key -> the two
   questions -> the element, compound and mixture boxes fill -> Same, Bonded, Free stamp down
   (showpiece) -> the trap: identical atoms in pairs are bonded, but still an element. */
scene('molecules', S => {
  const { at, end, mid } = S, root = S.root;
  const calm = S.reduce ? 0.25 : 1;

  /* ---------- local helpers ---------- */
  const EL = { N: '#5B8CFF' };
  const shade = (hex, k) => { const n = parseInt(hex.slice(1), 16), f = c => Math.round(c * (1 - k)); return '#' + ((1 << 24) + (f(n >> 16) << 16) + (f((n >> 8) & 255) << 8) + f(n & 255)).toString(16).slice(1); };
  /* an element lib.js has no atom for: a shaded sphere with its symbol in white */
  function elAtom(parent, sym, r, o) {
    o = o || {};
    const c = EL[sym], dk = shade(c, 0.42), g = G(parent);
    E('circle', { r, fill: ball(c, dk), stroke: dk, 'stroke-width': Math.max(1.5, r * 0.08) }, g);
    if (o.letter) {
      const two = sym.length > 1;
      const t = T(g, 0, r * (two ? 0.3 : 0.36), sym, { size: r * (two ? 0.82 : 1), weight: 700, fill: '#ffffff', anchor: 'middle' });
      t.setAttribute('stroke', dk); t.setAttribute('stroke-width', Math.max(1, r * 0.1)); t.setAttribute('paint-order', 'stroke'); t.setAttribute('stroke-linejoin', 'round');
    }
    return g;
  }
  const anyAtom = (parent, sym, r, o) => (ATOM[sym] ? atom(parent, sym, r, o) : elAtom(parent, sym, r, o));
  /* a short bond line across the joint of two touching atoms (centres a and b, radii ra and rb) */
  const BOND = '#F4FAFD';
  function bondLine(parent, ax, ay, ra, bx, by, rb, len) {
    const dx = bx - ax, dy = by - ay, d = Math.hypot(dx, dy) || 1, ux = dx / d, uy = dy / d;
    const s = (d * d + ra * ra - rb * rb) / (2 * d), L = (len || 0.6) * Math.min(ra, rb);
    return E('line', { x1: (ax + ux * (s - L / 2)).toFixed(1), y1: (ay + uy * (s - L / 2)).toFixed(1), x2: (ax + ux * (s + L / 2)).toFixed(1), y2: (ay + uy * (s + L / 2)).toFixed(1), stroke: BOND, 'stroke-width': Math.max(2.4, 0.2 * Math.min(ra, rb)).toFixed(1), 'stroke-linecap': 'round', opacity: 0.9 }, parent);
  }
  /* molecules with the same geometry as lib's molO2 / molH2O / molCO2, plus their bond lines.
     g.atoms[i] sits at g.pos[i]; g.bonds are the bond lines. */
  function place(g) { g.atoms.forEach((a, i) => tr(a, g.pos[i][0], g.pos[i][1])); }
  function diatomic(parent, sym, r, o) {
    const g = G(parent), k = 0.72 * r;
    g.atoms = [anyAtom(g, sym, r, o), anyAtom(g, sym, r, o)]; g.pos = [[-k, 0], [k, 0]]; place(g);
    g.bonds = [bondLine(g, -k, 0, r, k, 0, r)];
    return g;
  }
  function water(parent, r, o) {
    const g = G(parent), hr = r * 0.62, hx = r * 0.98, hy = r * 0.72;
    const h1 = atom(g, 'H', hr, o), h2 = atom(g, 'H', hr, o), ox = atom(g, 'O', r, o);
    g.atoms = [ox, h1, h2]; g.pos = [[0, 0], [-hx, hy], [hx, hy]]; place(g);
    g.bonds = [bondLine(g, 0, 0, r, -hx, hy, hr, 0.5), bondLine(g, 0, 0, r, hx, hy, hr, 0.5)];
    return g;
  }
  function co2(parent, r, o) {
    const g = G(parent), d = r * 1.6, orr = r * 0.9;
    const o1 = atom(g, 'O', orr, o), o2 = atom(g, 'O', orr, o), c = atom(g, 'C', r, o);
    g.atoms = [c, o1, o2]; g.pos = [[0, 0], [-d, 0], [d, 0]]; place(g);
    g.bonds = [bondLine(g, 0, 0, r, -d, 0, orr, 0.5), bondLine(g, 0, 0, r, d, 0, orr, 0.5)];
    return g;
  }
  /* swell some of a molecule's atoms: q[i] 0..1 */
  function swell(g, q) { g.atoms.forEach((a, i) => tr(a, g.pos[i][0], g.pos[i][1], 1 + 0.24 * (q[i] || 0))); }
  // chemical formula with real subscripts: 'H2O' -> H₂O (from respiration/scenes/02_aerobic.js)
  function formula(parent, x, y, str, o) {
    o = o || {};
    const size = o.size || 50, sub = Math.round(size * 0.62), dy = Math.round(size * 0.24);
    const t = E('text', { x, y, 'font-size': size, 'font-weight': o.weight || 600, fill: o.fill || C.ink, 'text-anchor': o.anchor || 'middle', 'font-family': FD }, parent);
    const m = str.match(/^(\d*)(.*)$/);
    let low = false;
    const push = (txt, isSub) => {
      const ts = E('tspan', {}, t); ts.textContent = txt;
      if (isSub) { ts.setAttribute('font-size', sub); if (!low) { ts.setAttribute('dy', dy); low = true; } }
      else if (low) { ts.setAttribute('dy', -dy); low = false; }
    };
    if (m[1]) push(m[1], false);
    m[2].replace(/([A-Za-z]+)|(\d+)/g, (all, letters, digits) => { push(letters || digits, !letters); return ''; });
    return t;
  }
  function rich(parent, x, y, segs, o) {
    o = o || {};
    const t = E('text', { x, y, 'font-size': o.size || 30, 'font-weight': o.weight || 600, 'font-family': o.font || FD, 'text-anchor': o.anchor || 'start', fill: o.fill || C.ink }, parent);
    segs.forEach(s => { if (typeof s === 'string') s = [s]; E('tspan', { fill: s[1], 'font-weight': s[2] }, t).textContent = s[0]; });
    return t;
  }
  const scaleAt = (el, x, y, s) => el.setAttribute('transform', `translate(${x} ${y}) scale(${Math.max(0.001, s).toFixed(4)}) translate(${-x} ${-y})`);
  const GOODBG = 'rgba(86,214,155,0.16)';

  /* ===================== A. molecules: elements and compounds ===================== */
  const A = G(root);
  const R1 = 34, ROW1 = 212, ROW2 = 516;
  const X1 = [200, 430, 660], X2 = [285, 578];
  const DEF = [600, 352], DEFS = 1.6;                 // the first molecule, big, in the middle
  const O2C = [600, 292], O2CS = 1.3;                 // ... then centre stage while oxygen is described

  // def: a title, the two atoms that join, and their bond
  const defT = T(A, 600, 186, 'molecule', { size: 64, weight: 700, anchor: 'middle' });
  const defSub = T(A, 600, 236, 'two or more atoms, joined', { size: 30, weight: 600, anchor: 'middle', fill: C.muted });
  const bondLbl = G(A);
  E('line', { x1: 600, y1: 452, x2: 600, y2: 364, stroke: C.energy, 'stroke-width': 3, 'stroke-linecap': 'round' }, bondLbl);
  E('circle', { cx: 600, cy: 362, r: 5, fill: C.energy }, bondLbl);
  T(bondLbl, 600, 490, 'chemical bond', { size: 32, weight: 700, anchor: 'middle', fill: C.energy });

  // row 1: element molecules (the first molecule becomes O2)
  const o2g = G(A);
  const flash = E('circle', { r: R1 * 1.7, fill: glow(C.energyLt) }, o2g);
  o2g.atoms = [atom(o2g, 'O', R1, { letter: true }), atom(o2g, 'O', R1, { letter: true })];
  o2g.pos = [[-0.72 * R1, 0], [0.72 * R1, 0]];
  const oBond = bondLine(o2g, -0.72 * R1, 0, R1, 0.72 * R1, 0, R1);
  o2g.bonds = [oBond];
  const h2g = diatomic(A, 'H', R1, { letter: true }), n2g = diatomic(A, 'N', R1, { letter: true });
  const row1 = [
    { g: o2g, f: 'O2', name: 'oxygen' }, { g: h2g, f: 'H2', name: 'hydrogen' }, { g: n2g, f: 'N2', name: 'nitrogen' },
  ].map((m, i) => {
    m.x = X1[i];
    m.lab = G(A);                                     // drawn around the molecule's centre, moves with it
    formula(m.lab, 0, 92, m.f, { size: 52 });
    T(m.lab, 0, 134, m.name, { size: 27, weight: 600, anchor: 'middle', fill: C.muted });
    tr(m.lab, m.x, ROW1);
    return m;
  });
  // row 1 summary: element, same atoms
  const sum1 = G(A);
  card(sum1, 840, 142, 320, 212, { fill: C.card, stroke: C.line });
  const sum1chip = chip(sum1, 'element', { size: 36, fill: GOODBG, stroke: C.good }); tr(sum1chip, 1000, 212);
  const sum1note = G(sum1);
  tr(tick(sum1note, 13), 906, 292);
  T(sum1note, 932, 302, 'same atoms', { size: 30, weight: 600 });

  // row 2: compound molecules
  const divider = E('line', { x1: 60, x2: 800, y1: 414, y2: 414, stroke: C.line, 'stroke-width': 2, 'stroke-dasharray': '8 8' }, A);
  const h2o = water(A, R1, { letter: true }), co2g = co2(A, 30, { letter: true });
  const row2 = [{ g: h2o, f: 'H2O', name: 'water', y: ROW2 - 8 }, { g: co2g, f: 'CO2', name: 'carbon dioxide', y: ROW2 + 4 }].map((m, i) => {
    m.x = X2[i];
    m.lab = G(A);
    formula(m.lab, m.x, ROW2 + 108, m.f, { size: 52 });
    T(m.lab, m.x, ROW2 + 150, m.name, { size: 27, weight: 600, anchor: 'middle', fill: C.muted });
    return m;
  });
  const sum2 = G(A);
  card(sum2, 840, 446, 320, 212, { fill: C.card, stroke: C.line });
  const sum2chip = chip(sum2, 'compound', { size: 36, fill: GOODBG, stroke: C.good }); tr(sum2chip, 1000, 516);
  const sum2note = G(sum2);
  tr(tick(sum2note, 13), 884, 596);
  T(sum2note, 910, 606, 'different atoms', { size: 30, weight: 600 });

  /* ===================== B. particle pictures ===================== */
  const B = G(root);
  const BX = [220, 600, 980], BY = 340, BW = 320, BH = 280, BR = 18;
  const ptitle = T(B, 600, 156, 'particle pictures', { size: 46, weight: 700, anchor: 'middle' });
  const boxes = BX.map((x, i) => {
    const g = G(B); tr(g, x, BY);
    const hl = E('rect', { x: -BW / 2 - 7, y: -BH / 2 - 7, width: BW + 14, height: BH + 14, rx: 24, fill: 'rgba(255,228,92,0.07)', stroke: C.energy, 'stroke-width': 5 }, g);
    E('rect', { x: -BW / 2, y: -BH / 2, width: BW, height: BH, rx: 18, fill: 'rgba(200,230,250,0.06)', stroke: GLASS.stroke, 'stroke-width': 3 }, g);
    const q = T(g, 0, 38, '?', { size: 110, weight: 700, anchor: 'middle', fill: C.faint });
    const inner = G(g);
    const name = ['element', 'compound', 'mixture'][i];
    const lab = G(B);
    const lw = textWidth(name, 38, FD, 700);
    T(lab, x - 20, BY + BH / 2 + 66, name, { size: 38, weight: 700, anchor: 'middle' });
    tr(tick(lab, 14), x - 20 + lw / 2 + 30, BY + BH / 2 + 54);
    return { g, hl, q, inner, lab, x };
  });

  // box 1, element: single atoms that pair up into identical molecules
  const r1 = rng(23), b1atoms = [], b1bonds = [];
  [[-82, -60, 20], [64, -70, -30], [-62, 62, -12], [84, 56, 38]].forEach(([cx, cy, ang], k) => {
    const a = ang * Math.PI / 180, ca = Math.cos(a), sa = Math.sin(a);
    const rot = (u, v) => [cx + u * ca - v * sa, cy + u * sa + v * ca];
    [-1, 1].forEach(j => {
      const el = elAtom(boxes[0].inner, 'N', BR);
      b1atoms.push({ el, s: rot(j * (32 + r1() * 8), (r1() - 0.5) * 30), e: rot(j * 0.72 * BR, 0), k, n: b1atoms.length });
    });
    b1bonds.push({ bond: bondLine(boxes[0].inner, ...rot(-0.72 * BR, 0), BR, ...rot(0.72 * BR, 0), BR), k });
  });
  // box 2, compound: identical water molecules
  const b2 = [[-95, -62, 12], [25, -80, -18], [100, -6, 24], [-45, 62, -8], [75, 80, 14]].map(([x, y, a], k) => ({ g: water(boxes[1].inner, 20), x, y, a, k }));
  // box 3, mixture: single atoms, oxygen molecules and a water molecule, none touching
  const b3 = [
    ...[[-104, -78], [96, -6], [-30, 88], [10, -4]].map(([x, y]) => ({ g: elAtom(boxes[2].inner, 'N', BR), x, y, a: 0 })),
    ...[[22, -82, 25], [-98, 26, -35]].map(([x, y, a]) => ({ g: diatomic(boxes[2].inner, 'O', 16), x, y, a })),
    { g: water(boxes[2].inner, 18), x: 90, y: 76, a: 10 },
  ].map((o, k) => Object.assign(o, { k, ph: k * 1.7 }));

  // the key, which then becomes the two questions
  function keyCard(cx, w) {
    const g = G(B); tr(g, cx, 140);
    E('rect', { x: -w / 2, y: -30, width: w, height: 60, rx: 30, fill: C.card, stroke: C.line, 'stroke-width': 2 }, g);
    const num = G(g); tr(num, -w / 2 + 30, 0);
    E('circle', { r: 19, fill: C.energy }, num);
    return { g, num, w, cx };
  }
  const k1 = keyCard(385, 420), k2 = keyCard(818, 380);
  T(k1.num, 0, 9, '1', { size: 26, weight: 700, anchor: 'middle', fill: C.bg0 });
  T(k2.num, 0, 9, '2', { size: 26, weight: 700, anchor: 'middle', fill: C.bg0 });
  const k1one = G(k1.g); E('circle', { cx: -138, r: 14, fill: ball('#C9D6DE', '#7D8C99'), stroke: '#7D8C99', 'stroke-width': 1.5 }, k1one);
  const k1oneT = T(k1.g, -112, 10, '= one atom', { size: 28, weight: 600 });
  const k1three = G(k1.g);
  [['N', -138], ['O', -108], ['H', -78]].forEach(([s, x]) => tr(anyAtom(k1three, s, 13), x, 0));
  const k1T = T(k1.g, -56, 10, 'colour = atom type', { size: 28, weight: 600 });
  const k1Q = T(k1.g, -56, 10, 'same or different?', { size: 28, weight: 700, fill: C.energy });
  const k2pair = G(k2.g); tr(k2pair, -112, 0);
  { const a = elAtom(k2pair, 'N', 13), b = atom(k2pair, 'O', 13); tr(a, -9.4, 0); tr(b, 9.4, 0); bondLine(k2pair, -9.4, 0, 13, 9.4, 0, 13); }
  const k2T = T(k2.g, -74, 10, 'joined = bonded', { size: 28, weight: 600 });
  const k2Q = T(k2.g, -74, 10, 'joined or mixed?', { size: 28, weight: 700, fill: C.energy });

  // Same, Bonded, Free stamps
  const stamps = ['Same', 'Bonded', 'Free'].map((w, i) => {
    const g = G(B), sw = textWidth(w, 56, FD, 700) + 44;
    E('rect', { x: -sw / 2, y: -38, width: sw, height: 76, rx: 14, fill: 'rgba(255,228,92,0.12)', stroke: C.energy, 'stroke-width': 4 }, g);
    T(g, 0, 20, w, { size: 56, weight: 700, anchor: 'middle', fill: C.energy });
    const ring = E('rect', { x: -sw / 2, y: -38, width: sw, height: 76, rx: 14, fill: 'none', stroke: C.energyLt, 'stroke-width': 3 }, g);
    return { g, ring, x: BX[i], y: 636, rot: [-5, 3, -3][i] };
  });

  /* ===================== C. the trap ===================== */
  const Cg = G(root);
  const trapHead = G(Cg);
  E('path', { d: 'M0,-30 L33,27 L-33,27 Z', fill: C.energy, stroke: '#FFF3A6', 'stroke-width': 4, 'stroke-linejoin': 'round', transform: 'translate(512 150)' }, trapHead);
  T(trapHead, 512, 172, '!', { size: 38, weight: 700, fill: C.bg0, anchor: 'middle' });
  T(trapHead, 562, 167, 'One trap', { size: 48, weight: 700 });
  const TB = [360, 400], TW = 420, TH = 290, TR = 19;
  const trapBox = G(Cg); tr(trapBox, TB[0], TB[1]);
  E('rect', { x: -TW / 2, y: -TH / 2, width: TW, height: TH, rx: 18, fill: 'rgba(200,230,250,0.06)', stroke: GLASS.stroke, 'stroke-width': 3 }, trapBox);
  const tPairs = [[-118, -66, 20], [26, -84, -28], [128, -8, 34], [-62, 44, -10], [64, 84, 14]].map(([x, y, a], k) => ({ g: diatomic(trapBox, 'N', TR), x, y, a, k }));
  const badge = G(Cg); tr(badge, TB[0] + TW / 2 - 6, TB[1] - TH / 2 + 6);
  const badgeQ = G(badge);
  E('circle', { r: 36, fill: C.energy, stroke: '#FFF3A6', 'stroke-width': 4 }, badgeQ);
  T(badgeQ, 0, 17, '?', { size: 48, weight: 700, anchor: 'middle', fill: C.bg0 });
  const badgeT = G(badge);
  E('circle', { r: 36, fill: C.good, stroke: '#C9F7DF', 'stroke-width': 4 }, badgeT);
  const bt = tick(badgeT, 16, C.bg0); tr(bt, 0, 2);
  const tNote = rich(Cg, TB[0], 598, ['joined in pairs: ', ['bonded', C.energy, 700]], { size: 31, anchor: 'middle' });
  const tChip = chip(Cg, 'still an element', { size: 34, fill: GOODBG, stroke: C.good }); tr(tChip, TB[0], 660);
  const rCard = G(Cg);
  card(rCard, 650, 255, 500, 350, { fill: C.card, stroke: C.line });
  const rChip = chip(rCard, 'compound', { size: 34, fill: C.card2, stroke: C.line }); tr(rChip, 900, 312);
  const rNeed = rich(rCard, 900, 386, ['needs ', ['different', C.energy, 700], ' elements'], { size: 32, anchor: 'middle' });
  const rSame = G(rCard), rDiff = G(rCard);
  { const m = diatomic(rSame, 'N', 22); tr(m, 778, 476); const x = cross(rSame, 22); tr(x, 778, 476); T(rSame, 778, 560, 'same atoms', { size: 25, weight: 600, anchor: 'middle', fill: C.muted, font: FB }); }
  { const m = water(rDiff, 24); tr(m, 1022, 466); const k = tick(rDiff, 16); tr(k, 1090, 440); T(rDiff, 1022, 560, 'different atoms', { size: 25, weight: 600, anchor: 'middle', fill: C.muted, font: FB }); }

  /* ===================== update ===================== */
  return t => {
    const tt = t * calm;
    const pulse = (t0, w) => Math.sin(Math.PI * P(t, t0, w || 0.5, linear));

    /* ---- A: molecules ---- */
    const aA = 1 - P(t, at('pictures') - 0.15, 0.5, linear);
    op(A, aA);
    if (aA > 0) {
      // def: two atoms fly together and join
      const fly = P(t, mid('def', 0.12), 2.2, easeOut);
      const join = P(t, mid('def', 0.62), 0.35, easeIn);
      const sep = lerp(lerp(310, 70, fly), 0.72 * R1, join);
      const fadeIn = P(t, at('def') - 0.05, 0.4, linear);
      const jf = clamp((t - mid('def', 0.62) - 0.35) / 0.9);
      op(flash, jf > 0 && jf < 1 ? Math.sin(jf * Math.PI) : 0); tr(flash, 0, 0, 0.6 + 0.8 * jf);
      op(oBond, P(t, mid('def', 0.62) + 0.3, 0.3, linear));
      oBond.setAttribute('stroke', pulse(mid('elem', 0.6), 0.6) > 0.02 ? C.energy : BOND);
      op(defT, win(t, mid('def', 0.06), at('elem') + 0.3, 0.4));
      scaleAt(defT, 600, 186, 0.85 + 0.15 * P(t, mid('def', 0.06), 0.5, pop));
      op(defSub, win(t, mid('def', 0.42), at('elem') + 0.3, 0.4));
      op(bondLbl, win(t, mid('def', 0.86), at('elem') + 0.3, 0.35));

      // elem: O2 stays centre stage while oxygen is described ("two oxygen atoms" light up in turn,
      // then the bond glows on "joined"), then moves to its slot as H2 and N2 slide in.
      // On "still", each molecule's two (identical) atoms swell together.
      const mvA = P(t, at('elem') + 0.05, 0.9), mvB = P(t, mid('elem', 0.63), 1.0);
      row1.forEach((m, i) => {
        const same = pulse(mid('still', 0.55) + i * 0.12, 0.6);
        if (i === 0) {
          const x = lerp(lerp(DEF[0], O2C[0], mvA), m.x, mvB), y = lerp(lerp(DEF[1], O2C[1], mvA), ROW1, mvB) + Math.sin(tt * 1.3) * 3 * mvA;
          const s = lerp(lerp(DEFS, O2CS, mvA), 1, mvB);
          tr(m.g, x, y, s); tr(m.lab, x, y, s);
          const wob = 6 * (1 - join);
          m.g.atoms.forEach((a, k) => {
            const q = Math.max(pulse(mid('elem', 0.46 + k * 0.05)), same);
            tr(a, (k ? 1 : -1) * sep, (k ? Math.cos(tt * 2.0) : Math.sin(tt * 2.2)) * wob, 1 + 0.24 * q);
            op(a, fadeIn);
          });
        } else {
          const p = P(t, mid('elem', i === 1 ? 0.66 : 0.84), 0.7, easeOut);
          op(m.g, clamp(p * 2));
          tr(m.g, m.x + (1 - p) * 90, ROW1 + Math.sin(tt * 1.3 + i) * 3);
          tr(m.lab, m.x + (1 - p) * 90, ROW1);
          swell(m.g, [same, same]);
        }
        op(m.lab, P(t, mid('elem', [0.27, 0.7, 0.88][i]), 0.45, linear));
      });
      // still: the element summary
      const c1 = P(t, mid('still', 0.08), 0.5, pop);
      op(sum1, clamp(c1 * 2)); tr(sum1, (1 - clamp(c1)) * 30, 0);
      op(sum1note, P(t, mid('still', 0.62), 0.4, linear));
      // comp: water and carbon dioxide; water's different atoms light up one by one
      op(divider, P(t, at('comp'), 0.5, linear));
      row2.forEach((m, i) => {
        const p = P(t, mid('comp', i ? 0.52 : 0.2), 0.7, easeOut);
        op(m.g, clamp(p * 2));
        tr(m.g, m.x + (1 - p) * -90, m.y + Math.sin(tt * 1.3 + i + 2) * 3);
        op(m.lab, P(t, mid('comp', i ? 0.62 : 0.45), 0.45, linear));
        swell(m.g, i ? [] : [pulse(mid('comp', 0.28), 0.5), pulse(mid('comp', 0.34), 0.5), pulse(mid('comp', 0.34), 0.5)]);
      });
      const c2 = P(t, mid('comp', 0.72), 0.5, pop);
      op(sum2, clamp(c2 * 2)); tr(sum2, (1 - clamp(c2)) * 30, 0);
      op(sum2note, P(t, mid('comp', 0.76), 0.4, linear));
      op(sum2chip, P(t, mid('comp', 0.86), 0.4, linear));
    }

    /* ---- B: particle pictures ---- */
    const aB = win(t, at('pictures') - 0.05, at('trap') + 0.1, 0.5);
    op(B, aB);
    if (aB > 0) {
      op(ptitle, win(t, mid('pictures', 0.02), mid('pictures', 0.3), 0.35));
      boxes.forEach((b, i) => { const p = P(t, mid('pictures', 0.04 + i * 0.06), 0.55, pop); op(b.g, clamp(p * 2)); tr(b.g, b.x, BY + (1 - clamp(p)) * 30, 0.9 + 0.1 * p); });
      // the key: "each circle is an atom" -> "colour = atom type"; then "joined = bonded"
      const kp1 = P(t, mid('pictures', 0.31), 0.5, pop), kp2 = P(t, mid('pictures', 0.72), 0.5, pop);
      const qa = P(t, at('sbf') - 0.3, 0.5, linear);
      op(k1.g, clamp(kp1 * 2) * (1 - qa)); tr(k1.g, k1.cx, 140 + (1 - clamp(kp1)) * 16);
      op(k2.g, clamp(kp2 * 2) * (1 - qa)); tr(k2.g, k2.cx, 140 + (1 - clamp(kp2)) * 16);
      const col = P(t, mid('pictures', 0.52), 0.4, linear);
      op(k1one, 1 - col); op(k1oneT, 1 - col); op(k1three, col);
      // ask: the key turns into the two questions
      const q1 = P(t, mid('ask', 0.44), 0.4, linear), q2 = P(t, mid('ask', 0.74), 0.4, linear);
      op(k1T, col * (1 - q1)); op(k1Q, q1); op(k2T, 1 - q2); op(k2Q, q2);
      [[k1, mid('ask', 0.2)], [k2, mid('ask', 0.3)]].forEach(([k, t0]) => { const p = P(t, t0, 0.45, pop); op(k.num, clamp(p * 2)); tr(k.num, -k.w / 2 + 30, 0, Math.max(0.01, p)); });
      ['element', 'compound', 'mixture'].forEach((id, i) => {
        op(boxes[i].q, win(t, mid('ask', 0.06), at(id) + 0.15, 0.4) * (0.55 + 0.45 * wave(tt, 1.8, i * 0.2)));
        const lp = P(t, mid(id, i === 0 ? 0.84 : 0.8), 0.5, pop);
        op(boxes[i].lab, clamp(lp * 2)); boxes[i].lab.setAttribute('transform', `translate(0 ${((1 - clamp(lp)) * 14).toFixed(1)})`);
      });
      // SBF: stamps land on the first "Same, Bonded, Free", then each box lights up as it is explained
      const stampAt = [mid('sbf', 0.12), mid('sbf', 0.21), mid('sbf', 0.3)];
      const explainAt = [mid('sbf', 0.42), mid('sbf', 0.62), mid('sbf', 0.85)];
      const hit = stampAt.map(s0 => Math.sin(Math.PI * P(t, s0 + 0.28, 0.6, linear)));
      const exp = explainAt.map(s0 => win(t, s0 - 0.1, s0 + 1.3, 0.3));
      boxes.forEach((b, i) => op(b.hl, Math.max(hit[i], exp[i] * 0.9)));
      stamps.forEach((s, i) => {
        const p = P(t, stampAt[i], 0.32, easeIn);
        op(s.g, p > 0 ? Math.min(1, p * 3) : 0);
        tr(s.g, s.x, s.y, lerp(1.9, 1, p) * (1 + 0.08 * exp[i]), s.rot);
        const rp = clamp((t - stampAt[i] - 0.32) / 0.6);
        op(s.ring, rp > 0 && rp < 1 ? 1 - rp : 0); s.ring.setAttribute('transform', `scale(${(1 + 0.35 * rp).toFixed(3)})`);
      });
      // box 1: single atoms drop in, then pair up into identical molecules; all swell for "Same"
      const same = Math.max(hit[0], exp[0]);
      b1atoms.forEach(o => {
        const ap = P(t, mid('element', 0.03 + o.n * 0.025), 0.45, pop);
        const pp = P(t, mid('element', 0.46) + o.k * 0.14, 0.55);
        const x = lerp(o.s[0], o.e[0], pp), y = lerp(o.s[1], o.e[1], pp) + (1 - clamp(ap)) * -30;
        op(o.el, clamp(ap * 2)); tr(o.el, x, y + Math.sin(tt * 1.4 + o.k * 1.3) * 3, Math.max(0.01, (0.7 + 0.3 * ap) * (1 + 0.22 * same)));
      });
      b1bonds.forEach(o => {
        op(o.bond, P(t, mid('element', 0.46) + o.k * 0.14 + 0.45, 0.3, linear));
        o.bond.setAttribute('transform', `translate(0 ${(Math.sin(tt * 1.4 + o.k * 1.3) * 3).toFixed(2)})`);
      });
      // box 2: identical water molecules; their bonds glow for "Bonded"
      const bonded = Math.max(hit[1], exp[1]);
      b2.forEach(o => {
        const p = P(t, mid('compound', 0.04 + o.k * 0.08), 0.5, pop);
        op(o.g, clamp(p * 2));
        tr(o.g, o.x, o.y + (1 - clamp(p)) * -30 + Math.sin(tt * 1.3 + o.k) * 3, Math.max(0.01, 0.7 + 0.3 * p), o.a + Math.sin(tt * 0.9 + o.k) * 4);
        o.g.bonds.forEach(bl => { bl.setAttribute('stroke', bonded > 0.05 ? C.energy : BOND); bl.setAttribute('stroke-width', (3.4 + 3 * bonded).toFixed(2)); });
      });
      // box 3: different particles drifting, never touching; they spread apart for "Free"
      const free = Math.max(hit[2], exp[2]);
      b3.forEach(o => {
        const p = P(t, mid('mixture', 0.03 + o.k * 0.05), 0.5, pop);
        const k = 1 + 0.08 * free;
        const x = (o.x + Math.sin(tt * 0.8 + o.ph) * 10) * k, y = (o.y + Math.cos(tt * 0.7 + o.ph * 1.3) * 10) * k;
        op(o.g, clamp(p * 2));
        tr(o.g, x, y + (1 - clamp(p)) * -30, Math.max(0.01, 0.7 + 0.3 * p), o.a + Math.sin(tt * 0.6 + o.ph) * 12 + free * 20 * Math.sin(tt * 5 + o.k));
      });
    }

    /* ---- C: the trap ---- */
    const aC = P(t, at('trap') - 0.05, 0.5, linear);
    op(Cg, aC);
    if (aC > 0) {
      op(trapHead, P(t, at('trap'), 0.4, linear));
      const bp = P(t, mid('trap', 0.06), 0.6, pop);
      op(trapBox, clamp(bp * 2)); tr(trapBox, TB[0], TB[1] + (1 - clamp(bp)) * 24, 0.92 + 0.08 * bp);
      const glowB = win(t, mid('trap', 0.38), mid('trap', 0.56), 0.25);
      tPairs.forEach(o => {
        const p = P(t, mid('trap', 0.12 + o.k * 0.04), 0.45, pop);
        op(o.g, clamp(p * 2));
        tr(o.g, o.x + Math.sin(tt * 0.8 + o.k * 1.9) * 6, o.y + Math.cos(tt * 0.7 + o.k) * 6, Math.max(0.01, 0.7 + 0.3 * p), o.a + Math.sin(tt * 0.6 + o.k) * 10);
        o.g.bonds[0].setAttribute('stroke', glowB > 0.05 ? C.energy : BOND); o.g.bonds[0].setAttribute('stroke-width', (3.8 + 3.5 * glowB).toFixed(2));
      });
      const qp = P(t, mid('trap', 0.2), 0.45, pop), tk = P(t, mid('trap', 0.56), 0.4, linear);
      op(badge, clamp(qp * 2)); tr(badge, TB[0] + TW / 2 - 6, TB[1] - TH / 2 + 6, Math.max(0.01, qp) * (1 + 0.15 * Math.sin(Math.PI * tk)));
      op(badgeQ, 1 - tk); op(badgeT, tk);
      op(tNote, P(t, mid('trap', 0.37), 0.4, linear));
      const cp = P(t, mid('trap', 0.6), 0.5, pop); op(tChip, clamp(cp * 2)); tr(tChip, TB[0], 660 + (1 - clamp(cp)) * 14, Math.max(0.01, 0.8 + 0.2 * cp));
      const rp = P(t, mid('trap', 0.74), 0.5, easeOut); op(rCard, rp); tr(rCard, (1 - rp) * 30, 0);
      op(rNeed, P(t, mid('trap', 0.8), 0.4, linear));
      const s1 = P(t, mid('trap', 0.86), 0.45, pop), s2 = P(t, mid('trap', 0.92), 0.45, pop);
      op(rSame, clamp(s1 * 2)); op(rDiff, clamp(s2 * 2));
    }
  };
});
