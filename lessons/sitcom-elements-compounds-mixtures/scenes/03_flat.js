/* Scene 3: Just flatmates (molecules, particle pictures, air, mixtures, alloys).
   Shots (hard sitcom cuts): Arthur's flat in the air -> the Nigels introduce themselves in sync ->
   Arthur's confessional (N2 = a molecule) -> MOLECULE card -> Kavya on a video call: "a compound,
   right?" -> 1.2 s of Arthur's deadpan -> "No." -> same atoms = still an ELEMENT (like O2) -> the
   Nigels nod -> three particle pictures, two questions, Same / Bonded / Free -> the air pie chart
   (78 / 21 / 1, Arthur in the 1 %) -> nobody's bonded to their flatmates -> sea water, brass, steel ->
   Kavya squints at the trumpet -> the trumpet in a moustache-and-glasses disguise -> COMPOUND vs
   MIXTURE, built row by row. */
scene('flat', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;
  const INK = SC_INK;
  const AMBER = '#FFC247', PINK = '#FF8FC8', CYAN = '#7FE3FF', NBLUE = '#86A2FF', ORED = '#FF6B5C';

  /* ---------- local helpers (prefixed fl) ---------- */
  const flCam = (el, k, cx, cy) => el.setAttribute('transform', `translate(${cx.toFixed(1)} ${cy.toFixed(1)}) scale(${k.toFixed(4)}) translate(${(-cx).toFixed(1)} ${(-cy).toFixed(1)})`);
  const flPlace = (el, cam, x, y, s, r) => tr(el, cam.cx + cam.k * (x - cam.cx), cam.cy + cam.k * (y - cam.cy), s * cam.k, r);
  const flPop = (el, x, y, p, s, r) => { op(el, clamp(p * 2.5)); tr(el, x, y, Math.max(0.01, (s || 1) * (0.6 + 0.4 * p)), r); };
  function flRich(parent, x, y, str, o) {
    o = o || {};
    const size = o.size || 32, sub = Math.round(size * 0.64), dy = Math.round(size * 0.24);
    const t = E('text', { x, y, 'font-size': size, 'font-weight': o.weight || 700, fill: o.fill || C.ink, 'text-anchor': o.anchor || 'middle', 'font-family': o.font || FD }, parent);
    if (!/\*\*|_\d/.test(str)) { t.textContent = str; return t; }
    let low = false;
    const push = (txt, isSub, bold) => {
      const ts = E('tspan', {}, t); ts.textContent = txt;
      if (bold) { ts.setAttribute('font-weight', 800); if (o.boldFill) ts.setAttribute('fill', o.boldFill); }
      if (isSub) { ts.setAttribute('font-size', sub); if (!low) { ts.setAttribute('dy', dy); low = true; } }
      else if (low) { ts.setAttribute('dy', -dy); low = false; }
    };
    String(str).split(/(\*\*[^*]+\*\*)/).forEach(seg => {
      if (!seg) return;
      const bold = seg.startsWith('**'), inner = bold ? seg.slice(2, -2) : seg;
      inner.split(/(_\d+)/).forEach(p => { if (!p) return; if (p[0] === '_') push(p.slice(1), true, bold); else push(p, false, bold); });
    });
    return t;
  }
  function flChip(parent, str, o) {
    o = o || {};
    const size = o.size || 30, g = G(parent), h = Math.round(size * 1.7);
    const box = E('rect', { y: -h / 2, height: h, rx: h / 2, fill: o.fill || 'rgba(14,26,36,0.93)', stroke: o.stroke || C.line, 'stroke-width': 3 }, g);
    flRich(g, 0, size * 0.35, str, { size, weight: o.weight || 700, fill: o.color || C.ink, boldFill: o.boldFill });
    const w = textWidth(str.replace(/\*\*|_/g, ''), size, FD, 700) + size * 1.3;
    attr(box, 'x', -w / 2); attr(box, 'width', w);
    return g;
  }
  const flCard = (parent, w, h, stroke) => card(parent, -w / 2, -h / 2, w, h, { fill: 'rgba(14,26,36,0.94)', stroke: stroke || C.line, sw: 4, rx: 22 });
  const XCOL = { Cu: ['#F2B48A', '#B0602E', '#3A1A08'], Zn: ['#C9D3DC', '#6B7A88', '#1E2A36'], Fe: EC_ATOM.Fe, C: EC_ATOM.C };
  function flBall(parent, sym, r, cols) {
    const [c, dk, lc] = cols || XCOL[sym] || EC_ATOM[sym] || EC_ATOM.C, g = G(parent);
    E('circle', { r, fill: ball(c, dk), stroke: dk, 'stroke-width': Math.max(1.5, r * 0.09) }, g);
    if (r >= 20) T(g, 0, 9, sym, { size: 26, weight: 800, fill: lc, anchor: 'middle' });
    return g;
  }
  // N≡N (or O=O) molecule drawing
  function flDiatomic(parent, sym, r, bonds) {
    const g = G(parent), d = r * 0.85;
    let bd = ''; const n = bonds || 3, gap = r * 0.28;
    for (let i = 0; i < n; i++) { const y = (i - (n - 1) / 2) * gap; bd += `M${-d},${y.toFixed(1)} L${d},${y.toFixed(1)} `; }
    g.bond = E('path', { d: bd, stroke: '#FFFFFF', 'stroke-width': Math.max(4, r * 0.12), 'stroke-linecap': 'round' }, g);
    const a = flBall(g, sym, r, EC_ATOM[sym]), b = flBall(g, sym, r, EC_ATOM[sym]);
    tr(a, -d - r * 0.35, 0); tr(b, d + r * 0.35, 0);
    g.a = a; g.b = b;
    g.appendChild(g.bond);
    return g;
  }
  // a light particle picture (same layout and colours as ecParticles, no per-atom groups): g.upd(t)
  function flParticles(parent, kind, seed) {
    const g = G(parent), W2 = 130, H2 = 105, r = 15, rr = rng(seed || 31), items = [];
    E('rect', { x: -W2 - 8, y: -H2 - 8, width: 2 * W2 + 16, height: 2 * H2 + 16, rx: 14, fill: 'rgba(10,27,39,0.88)', stroke: '#CFE7F5', 'stroke-width': 4 }, g);
    const add = (atoms, x, y) => { const m = G(g); atoms.forEach(([sym, dx, dy]) => { const [c, dk] = EC_ATOM[sym]; E('circle', { cx: dx, cy: dy, r: sym === 'H' ? r * 0.75 : r, fill: ball(c, dk), stroke: dk, 'stroke-width': 1.5 }, m); }); items.push({ m, x, y, a: rr() * 360, ph: rr() * TAU, sp: 0.6 + rr() * 0.8 }); };
    const N2 = [['N', -r * 0.8, 0], ['N', r * 0.8, 0]], O2 = [['O', -r * 0.8, 0], ['O', r * 0.8, 0]], AR = [['Ar', 0, 0]];
    const H2O = [['H', -r * 0.95, r * 0.6], ['H', r * 0.95, r * 0.6], ['O', 0, 0]];
    for (let j = 0; j < 3; j++) for (let i = 0; i < 4; i++) {
      const k = j * 4 + i, x = -W2 + 36 + i * 62 + (j % 2) * 12, y = -H2 + 36 + j * 68;
      if (kind === 'element') { if (k % 3 !== 2 || k < 6) add(N2, x, y); }
      else if (kind === 'compound') { if (k % 2 === 0 || k > 8) add(H2O, x, y); }
      else add([N2, AR, O2, N2, N2, AR, O2, N2, N2, O2, AR, N2][k], x, y);
    }
    g.upd = t => items.forEach(it => tr(it.m, it.x + 5 * Math.sin(t * it.sp + it.ph), it.y + 4 * Math.cos(t * it.sp * 1.3 + it.ph), 1, it.a + 14 * Math.sin(t * 0.7 + it.ph)));
    g.upd(0);
    return g;
  }
  function flTrumpet(parent) {
    const g = G(parent), gold = ball('#FFE07A', '#B8860B');
    E('path', { d: 'M40,-22 L170,-22 Q200,-22 200,-60 L200,-60 L250,-90 L250,40 L200,10 Q200,-6 170,-6 L40,-6 Z', fill: gold, stroke: '#7A5A10', 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);   // bell
    E('ellipse', { cx: 250, cy: -25, rx: 16, ry: 66, fill: '#FFE9A8', stroke: '#7A5A10', 'stroke-width': 4 }, g);
    E('path', { d: 'M-170,-14 L40,-14 M-120,-14 Q-150,-14 -150,20 Q-150,54 -110,54 L80,54 Q110,54 110,20 Q110,-6 90,-14', fill: 'none', stroke: '#B8860B', 'stroke-width': 16, 'stroke-linecap': 'round' }, g);
    E('path', { d: 'M-170,-14 L40,-14 M-120,-14 Q-150,-14 -150,20 Q-150,54 -110,54 L80,54 Q110,54 110,20 Q110,-6 90,-14', fill: 'none', stroke: '#FFE07A', 'stroke-width': 8, 'stroke-linecap': 'round' }, g);
    E('rect', { x: -196, y: -24, width: 30, height: 20, rx: 6, fill: '#C9D3DC', stroke: INK, 'stroke-width': 3 }, g);   // mouthpiece
    [-60, -20, 20].forEach(x => { E('rect', { x: x - 11, y: -60, width: 22, height: 52, rx: 4, fill: gold, stroke: '#7A5A10', 'stroke-width': 3 }, g); E('rect', { x: x - 15, y: -74, width: 30, height: 14, rx: 6, fill: '#FFF0B0', stroke: '#7A5A10', 'stroke-width': 3 }, g); });
    return g;
  }

  /* layers */
  const Lset = G(root), Lfg = G(root), Lcast = G(root), Ltop = G(root), Lhud = G(root);

  /* =================== the flat in the air (camera-moved) =================== */
  const AF = G(Lset), air = ecAirFlat(AF);
  const sofaMug = G(AF); tr(sofaMug, 1100, 548); ecMug(sofaMug, 0.42);
  const veil = E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#0A1B27' }, Lset);
  const flatChip = flChip(Lfg, 'Arthur’s flat: the AIR', { size: 34, color: '#2A5A8A', fill: '#FFFFFF', stroke: '#2A5A8A' });
  const litChip = flChip(Lfg, 'literally', { size: 28, color: '#2A5A8A', fill: '#FFFFFF', stroke: '#2A5A8A' });
  const ltNig = scLowerThird(Lhud, ...EC_LOWER.nigels);

  /* =================== confessional =================== */
  const CF = ecConfessional(Lset, 'arthur');
  const cN2 = G(Lfg); flCard(cN2, 380, 260, NBLUE);
  T(cN2, 0, -82, 'two nitrogen atoms', { size: 32, weight: 700, anchor: 'middle', fill: NBLUE });
  const cMol = flDiatomic(cN2, 'N', 46, 3); tr(cMol, 0, 30);
  const cJoin = T(cN2, 0, 108, 'joined', { size: 30, weight: 700, anchor: 'middle', fill: '#FFFFFF' });
  const cChip = flChip(Lfg, '**N_2** = a MOLECULE', { size: 40, color: CYAN, stroke: CYAN, boldFill: '#FFFFFF' });

  /* =================== MOLECULE card =================== */
  const DEF = G(Lfg); flCard(DEF, 860, 440, CYAN);
  T(DEF, 0, -140, 'MOLECULE', { size: 64, weight: 800, anchor: 'middle', fill: CYAN, ls: 2 });
  const dl1 = flRich(DEF, 0, -78, '**two or more atoms** joined', { size: 36, weight: 600, boldFill: AMBER });
  const dl2 = flRich(DEF, 0, -32, 'by **chemical bonds**', { size: 36, weight: 600, boldFill: AMBER });
  const dMol = flDiatomic(DEF, 'N', 54, 3); tr(dMol, -120, 92);
  const dLbl = G(DEF);
  E('line', { x1: -120, y1: 92, x2: 120, y2: 150, stroke: C.muted, 'stroke-width': 3 }, dLbl);
  E('circle', { cx: -120, cy: 92, r: 6, fill: AMBER }, dLbl);
  T(dLbl, 130, 160, 'chemical bond', { size: 30, weight: 700, fill: AMBER });
  const dN2 = flRich(DEF, 230, 92, 'N_2', { size: 64, weight: 800, fill: '#FFFFFF' });

  /* =================== video call (ask, brass) =================== */
  const VCbg = G(Lset);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#14243A', '#25446B', true) }, VCbg);
  const vc = scVideoCall(Lfg, 620, 420, 'Kavya: video call');
  const kavya = cast(vc.screen, 'kavya', { mood: 'neutral' }); tr(kavya, 0, 70, 1.25);
  const askChip = flChip(Lfg, 'bonded… so a COMPOUND?', { size: 32, color: AMBER, stroke: AMBER });

  /* =================== same atoms = element =================== */
  const nTags = [0, 1].map(() => flChip(Ltop, 'N', { size: 30, color: '#FFFFFF', fill: '#2F4BB5', stroke: '#FFFFFF' }));
  const sameChip = flChip(Lfg, 'same type of atom → still an **ELEMENT**', { size: 30, boldFill: AMBER });
  const stamp = G(Lfg);
  E('rect', { x: -150, y: -40, width: 300, height: 80, rx: 10, fill: 'none', stroke: PINK, 'stroke-width': 6 }, stamp);
  T(stamp, 0, 16, 'COMPOUND?', { size: 44, weight: 800, anchor: 'middle', fill: PINK });
  const stampX = cross(stamp, 46); tr(stampX, 0, 0);
  const o2 = flDiatomic(Lfg, 'O', 40, 2);
  const o2Chip = flChip(Lfg, '**O_2**: also an ELEMENT', { size: 30, color: ORED, stroke: ORED, boldFill: '#FFFFFF' });
  const needChip = flChip(Lfg, 'a COMPOUND needs **DIFFERENT** elements', { size: 32, color: PINK, stroke: PINK, boldFill: '#FFFFFF' });
  // synchronised blink for the Nigels: closed-eye lids drawn over both faces (inside the bobbing group)

  /* =================== particle pictures =================== */
  const PP = [['element', 230], ['compound', 600], ['mixture', 970]].map(([k, x], i) => ({ g: flParticles(Lfg, k, 31 + i * 7), x, k }));
  const ppChip1 = flChip(Lfg, 'each circle = an ATOM', { size: 32 });
  const ppChip2 = flChip(Lfg, 'colour = TYPE of atom', { size: 32, color: AMBER, stroke: AMBER });
  const q1 = flChip(Lfg, '1. Same atoms, or different?', { size: 34, color: CYAN, stroke: CYAN });
  const q2 = flChip(Lfg, '2. Joined, or just mixed?', { size: 34, color: PINK, stroke: PINK });
  const SBF = [['ELEMENT', ['all the same', 'type of atom'], 'SAME', AMBER, 0.05, 0.85], ['COMPOUND', ['different,', 'bonded'], 'BONDED', PINK, 0.27, 0.9], ['MIXTURE', ['different, not', 'bonded to each other'], 'FREE', CYAN, 0.54, 0.96]].map(([name, ls, word, col, f, fw], i) => {
    const g = G(Lfg); flCard(g, 310, 130, col);
    T(g, 0, -20, name, { size: 38, weight: 800, anchor: 'middle', fill: col });
    ls.forEach((s, j) => T(g, 0, 16 + j * 30, s, { size: 26, weight: 600, anchor: 'middle', fill: C.ink }));
    const w = T(Lfg, 0, 0, word, { size: 46, weight: 800, anchor: 'middle', fill: AMBER });
    return { g, w, f, fw, x: PP[i].x };
  });
  const sbfBig = flChip(Lfg, 'Same, Bonded, Free', { size: 50, color: AMBER, stroke: AMBER });

  /* =================== air pie chart =================== */
  const PIE = G(Lfg); tr(PIE, 330, 410);
  E('circle', { r: 202, fill: '#0E1A24', stroke: '#FFFFFF', 'stroke-width': 4 }, PIE);
  const slN = E('path', { d: '', fill: '#4F6FE0', stroke: '#FFFFFF', 'stroke-width': 3 }, PIE);
  const slO = E('path', { d: '', fill: '#E8524A', stroke: '#FFFFFF', 'stroke-width': 3 }, PIE);
  const slA = E('path', { d: '', fill: '#B48CFF', stroke: '#FFFFFF', 'stroke-width': 2 }, PIE);
  const pieTxtN = T(PIE, -40, 60, '78%', { size: 56, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  const pieTxtO = T(PIE, 110, -100, '21%', { size: 40, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  const sector = (a0, a1, r) => { if (a1 - a0 < 0.001) return ''; const x0 = Math.cos(a0) * r, y0 = Math.sin(a0) * r, x1 = Math.cos(a1) * r, y1 = Math.sin(a1) * r; return `M0,0 L${x0.toFixed(1)},${y0.toFixed(1)} A${r},${r} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${x1.toFixed(1)},${y1.toFixed(1)} Z`; };
  const A0 = -Math.PI / 2, AN = A0 + 0.78 * TAU, AO = AN + 0.21 * TAU, AA = A0 + TAU;
  const miniAr = G(PIE); tr(miniAr, Math.cos(AO + 0.03) * 250, Math.sin(AO + 0.03) * 250);
  E('line', { x1: 0, y1: 26, x2: -Math.cos(AO + 0.03) * 40, y2: -Math.sin(AO + 0.03) * 40 + 26, stroke: '#B48CFF', 'stroke-width': 3 }, miniAr);
  E('circle', { r: 30, fill: ball('#CDB2FF', '#7B52D6'), stroke: '#5B37B0', 'stroke-width': 3 }, miniAr);
  E('path', { d: 'M-14,-18 Q0,-30 16,-20', fill: 'none', stroke: '#EEEAF5', 'stroke-width': 4, 'stroke-linecap': 'round' }, miniAr);
  E('path', { d: 'M-12,0 L-4,0 M4,0 L12,0 M-6,12 L6,12', stroke: INK, 'stroke-width': 3, 'stroke-linecap': 'round' }, miniAr);
  const LEG = [['78% **nitrogen** (N_2)', '#4F6FE0', 0.13], ['21% **oxygen** (O_2)', '#E8524A', 0.33], ['about 1% **argon** (Ar): me', '#B48CFF', 0.5]].map(([s, c, f], i) => {
    const g = G(Lfg); tr(g, 640, 300 + i * 84);
    E('rect', { x: 0, y: -34, width: 44, height: 44, rx: 8, fill: c, stroke: '#FFFFFF', 'stroke-width': 3 }, g);
    flRich(g, 64, 0, s, { size: 34, weight: 600, anchor: 'start', boldFill: '#FFFFFF' });
    return { g, f };
  });
  const airChip = flChip(Lfg, 'AIR = a **MIXTURE**', { size: 44, color: AMBER, stroke: AMBER, boldFill: '#FFFFFF' });
  const shareChip = flChip(Lfg, 'nobody’s bonded to their flatmates', { size: 32 });
  const shareChip2 = flChip(Lfg, 'We just share.', { size: 34, color: AMBER, stroke: AMBER });
  const shareX = [0, 1].map(() => { const g = G(Ltop); E('path', { d: 'M0,-70 L0,70', stroke: '#E8424F', 'stroke-width': 4, 'stroke-dasharray': '10 8' }, g); const x = cross(g, 16); tr(x, 0, -92); return g; });
  const flO2 = flDiatomic(Lcast, 'O', 34, 2);

  /* =================== alloys =================== */
  const ALG = G(Lfg);
  const pan = [220, 600, 980].map((x, i) => { const g = G(ALG); tr(g, x, 350); flCard(g, 340, 320, [CYAN, AMBER, '#C9D3DC'][i]); return g; });
  // sea water
  { const g = pan[0];
    E('path', { d: 'M-150,-40 Q-112,-70 -75,-40 Q-38,-10 0,-40 Q38,-70 75,-40 Q112,-10 150,-40 L150,140 L-150,140 Z', fill: '#2E8BC0', opacity: 0.85 }, g);
    const r = rng(8); let a = '', b = '';
    for (let i = 0; i < 12; i++) { const na = i % 2 === 0, rad = na ? 9 : 12, x = -120 + r() * 240, y = -10 + r() * 130, c = `M${(x - rad).toFixed(0)},${y.toFixed(0)} a${rad},${rad} 0 1,0 ${2 * rad},0 a${rad},${rad} 0 1,0 ${-2 * rad},0 `; if (na) a += c; else b += c; }
    E('path', { d: a, fill: '#DCE3EA', stroke: '#8492A0', 'stroke-width': 2 }, g); E('path', { d: b, fill: '#C7EA7A', stroke: '#7FA83A', 'stroke-width': 2 }, g);
    T(g, 0, -88, 'salt dissolved', { size: 26, weight: 700, anchor: 'middle', fill: CYAN });
    T(g, 0, -60, 'in water', { size: 26, weight: 700, anchor: 'middle', fill: CYAN }); }
  // brass
  { const g = pan[1]; E('circle', { cx: 0, cy: 60, r: 82, fill: '#2A2210', stroke: AMBER, 'stroke-width': 4 }, g);
    [['Cu', -34, 34], ['Zn', 30, 24], ['Cu', 40, 88], ['Zn', -38, 96]].forEach(([s, x, y]) => tr(flBall(g, s, 28), x, y)); }
  // steel
  { const g = pan[2];
    E('path', { d: 'M-130,-110 L130,-110 L130,-90 L14,-90 L14,-50 L130,-50 L130,-30 L-130,-30 L-130,-50 L-14,-50 L-14,-90 L-130,-90 Z', fill: ball('#C9D3DC', '#6B7A88'), stroke: INK, 'stroke-width': 3 }, g);
    E('circle', { cx: 0, cy: 60, r: 82, fill: '#1E2A36', stroke: '#C9D3DC', 'stroke-width': 4 }, g);
    [[-32, 28], [32, 28], [-32, 92], [32, 92]].forEach(([x, y]) => tr(flBall(g, 'Fe', 28), x, y));
    tr(flBall(g, 'C', 14), 0, 60); tr(flBall(g, 'C', 14), 62, 60); }
  const alChips = [['SEA WATER: salt + water', 220, 0.02, CYAN], ['BRASS = copper + zinc', 600, 0.43, AMBER], ['STEEL = iron + carbon', 980, 0.72, '#C9D3DC']].map(([s, x, f, c]) => ({ g: flChip(Lfg, s, { size: 27, color: c, stroke: c }), x, f }));
  const alloyChip = flChip(Lfg, 'ALLOY: a metal mixed with other elements', { size: 30, color: AMBER, stroke: AMBER });

  /* =================== the trumpet in costume =================== */
  const TP = G(Lfg); const tpBig = flTrumpet(TP);
  const peek = G(TP);   // atoms peeking out from behind the bell
  const peekAtoms = [['Cu', 0, 0], ['Zn', 44, 20], ['Cu', 10, 46]].map(([s, x, y]) => { const b = flBall(peek, s, 26); tr(b, x, y); E('circle', { cx: -7, cy: -10, r: 3.5, fill: INK }, b); E('circle', { cx: 7, cy: -10, r: 3.5, fill: INK }, b); return b; });
  TP.insertBefore(peek, tpBig);
  const disguise = G(TP);
  const glasses = G(disguise); tr(glasses, 250, -50);
  E('circle', { cx: -22, r: 20, fill: 'rgba(255,255,255,0.25)', stroke: INK, 'stroke-width': 6 }, glasses);
  E('circle', { cx: 22, r: 20, fill: 'rgba(255,255,255,0.25)', stroke: INK, 'stroke-width': 6 }, glasses);
  E('path', { d: 'M-2,0 L2,0', stroke: INK, 'stroke-width': 6 }, glasses);
  E('path', { d: 'M-4,10 Q0,40 8,26', fill: '#F2B48A', stroke: INK, 'stroke-width': 3 }, glasses);   // nose
  const stache = E('path', { d: 'M0,0 C-14,-12 -40,-8 -52,10 C-36,4 -20,8 0,4 C20,8 36,4 52,10 C40,-8 14,-12 0,0 Z', fill: '#2A1A12', stroke: INK, 'stroke-width': 2 }, disguise);
  const costChip = flChip(Lfg, 'a MIXTURE in a convincing costume', { size: 32, color: AMBER, stroke: AMBER });

  /* =================== COMPOUND vs MIXTURE =================== */
  const VS = G(Lfg); tr(VS, 520, 400);
  flCard(VS, 940, 540, '#FFFFFF');
  E('path', { d: 'M-260,-210 L-260,250 M130,-210 L130,250 M-450,-170 L450,-170', stroke: '#3A5468', 'stroke-width': 3 }, VS);
  let rl = ''; for (let i = 1; i < 4; i++) rl += `M-450,${-170 + i * 105} L450,${-170 + i * 105} `;
  E('path', { d: rl, stroke: '#24384A', 'stroke-width': 2 }, VS);
  const hC = T(VS, -65, -194, 'COMPOUND', { size: 40, weight: 800, anchor: 'middle', fill: PINK });
  const hM = T(VS, 290, -194, 'MIXTURE', { size: 40, weight: 800, anchor: 'middle', fill: CYAN });
  const ROWS = [['joined?', '✓ bonded', 0.09, 'not bonded', 0.49], ['ratio', 'fixed ratio', 0.13, 'any ratio', 0.75], ['properties', 'new, different', 0.56, 'each keeps its own', 0.56], ['to separate', 'chemical reaction', 0.21, 'physical methods', 0.82]];
  const vsCells = ROWS.map(([lbl, c, fc, m, fm], i) => {
    const y = -170 + i * 105 + 64;
    const l = T(VS, -440, y, lbl, { size: 28, weight: 700, fill: C.muted });
    const ct = T(VS, -65, y, c, { size: 31, weight: 700, anchor: 'middle', fill: '#FFD6EA' });
    const mt = T(VS, 290, y, m, { size: 31, weight: 700, anchor: 'middle', fill: '#D6F6FF' });
    return { l, ct, mt, fc, fm };
  });

  /* =================== the cast =================== */
  const arthur = cast(Lcast, 'arthur');
  const nigels = cast(Lcast, 'nigels');
  // synchronised closed-eye lids, inside the Nigels' bobbing group
  const lids = G(nigels.firstChild);
  [-93, -51, 51, 93].forEach(x => {
    E('ellipse', { cx: x, cy: 2, rx: 16, ry: 18, fill: NBLUE, stroke: INK, 'stroke-width': 2.5 }, lids);
    E('path', { d: `M${x - 13},4 Q${x},12 ${x + 13},4`, fill: 'none', stroke: INK, 'stroke-width': 3, 'stroke-linecap': 'round' }, lids);
  });

  /* shots */
  const cut = id => at(id) - 0.06;
  const SH = [['flat', -1e9], ['hi', cut('hi')], ['thnigels', cut('thnigels')], ['def', cut('def')], ['ask', cut('ask')], ['no', end('ask') + 0.08],
    ['same', cut('same')], ['lot', cut('lot')], ['pictures', cut('pictures')], ['share', cut('share')], ['share2', mid('share', 0.67)],
    ['alloys', cut('alloys')], ['brass', cut('brass')], ['costume', cut('costume')], ['versus', cut('versus')]];
  const shotAt = t => { let s = SH[0]; for (const x of SH) if (t >= x[1]) s = x; return s; };
  const FG = [flatChip, litChip, cN2, cChip, DEF, vc, askChip, sameChip, stamp, o2, o2Chip, needChip, ppChip1, ppChip2, q1, q2, sbfBig, PIE, airChip, shareChip, shareChip2, ALG, alloyChip, TP, costChip, VS, flO2]
    .concat(nTags, shareX, PP.map(p => p.g), SBF.map(s => s.g), SBF.map(s => s.w), LEG.map(l => l.g), alChips.map(a => a.g));
  // the Nigels and Arthur on the sofa (flat coordinates)
  const SOFA_N = [850, 500, 0.55], SOFA_A = [1010, 492, 0.62];
  // camera that puts world point (wx, wy) at screen (sx, sy) at zoom k
  const flFrame = (k, wx, wy, sx, sy) => ({ k, cx: (sx - k * wx) / (1 - k), cy: (sy - k * wy) / (1 - k) });

  return t => {
    const sid = shotAt(t)[0];
    const airOn = ['flat', 'hi', 'def', 'no', 'same', 'lot', 'pictures', 'share', 'share2', 'alloys', 'costume', 'versus'].includes(sid);
    op(AF, airOn ? 1 : 0); CF.set(sid === 'thnigels' ? 1 : 0, t); op(VCbg, sid === 'ask' || sid === 'brass' ? 1 : 0);
    FG.forEach(g => op(g, 0));
    let cam = { k: 1, cx: 600, cy: 400 }, veilV = 0;
    let A = null, N = null, syncBlink = 0;
    if (airOn) air.upd(t, S.reduce ? 0.4 : 1);
    const talkN = scTalk(S, t, 'nigels');

    /* ---------- flat: wide ---------- */
    if (sid === 'flat') {
      cam = { k: 1.12, cx: lerp(380, 820, P(t, at('flat'), 4.5, ease)), cy: 430 };
      A = { w: 1, x: SOFA_A[0], y: SOFA_A[1], s: SOFA_A[2], mood: 'deadpan', look: 0 };
      N = { w: 1, x: SOFA_N[0], y: SOFA_N[1], s: SOFA_N[2], mood: 'neutral', look: 0.3 };
      flPop(flatChip, 600, 160, P(t, mid('flat', 0.22), 0.45, pop));
      flPop(litChip, 600, 228, P(t, mid('flat', 0.82), 0.45, pop), 1, -4);
    }
    /* ---------- hi / also: the Nigels in sync ---------- */
    if (sid === 'hi') {
      cam = flFrame(2.6, SOFA_N[0], SOFA_N[1], 470, 440);
      A = { w: 1, x: SOFA_A[0], y: SOFA_A[1], s: SOFA_A[2], mood: 'deadpan', look: -1 };
      N = { w: 1, x: SOFA_N[0], y: SOFA_N[1], s: SOFA_N[2], mood: 'neutral', look: 0, talkL: t < at('also') - 0.1 ? talkN : 0, talkR: t >= at('also') - 0.1 ? talkN : 0 };
      // they look at each other on "also", then back to camera in perfect sync
      if (t > at('also') && t < end('also')) { N.lookL = 1; N.lookR = 0; } else { N.lookL = 0; N.lookR = 0; }
      if (t > end('also') + 0.15 && t < end('also') + 0.5) N.lookL = N.lookR = 0;
      syncBlink = Math.max(win(t, end('hi') + 0.05, end('hi') + 0.2, 0.05), win(t, end('also') + 0.25, end('also') + 0.42, 0.05));
    }
    ltNig.set(sid === 'hi' ? win(t, at('hi') + 0.3, at('hi') + 3.8, 0.3) : 0);
    /* ---------- thnigels: confessional ---------- */
    if (sid === 'thnigels') {
      const k = 1 + 0.03 * P(t, at('thnigels'), 4, linear);
      flCam(CF, k, 430, 380); cam = { k, cx: 430, cy: 380 };
      A = { w: 1, x: 430, y: 390, s: 1.5, mood: t < mid('thnigels', 0.25) ? 'deadpan' : 'neutral', look: t > mid('thnigels', 0.3) && t < mid('thnigels', 0.7) ? 0.8 : 0 };
      flPop(cN2, 890, 290, P(t, mid('thnigels', 0.24), 0.45, pop));
      const jn = P(t, mid('thnigels', 0.62), 0.4, ease);
      tr(cMol.a, lerp(-110, -46 * 0.85 - 16, jn), 0); tr(cMol.b, lerp(110, 46 * 0.85 + 16, jn), 0);
      op(cMol.bond, jn); op(cJoin, P(t, mid('thnigels', 0.64), 0.3, linear));
      flPop(cChip, 890, 520, P(t, mid('thnigels', 0.78), 0.45, pop));
    } else flCam(CF, 1, 430, 380);
    /* ---------- def: MOLECULE ---------- */
    if (sid === 'def') {
      cam = { k: 1.1, cx: 600, cy: 420 }; veilV = 0.6;
      flPop(DEF, 600, 390, P(t, at('def') - 0.02, 0.45, pop));
      op(dl1, P(t, mid('def', 0.1), 0.3, linear)); op(dl2, P(t, mid('def', 0.45), 0.3, linear));
      op(dMol, P(t, mid('def', 0.15), 0.3, linear)); op(dMol.bond, P(t, mid('def', 0.5), 0.3, linear));
      op(dLbl, P(t, mid('def', 0.6), 0.3, linear)); op(dN2, P(t, mid('def', 0.7), 0.3, linear));
    }
    /* ---------- ask: Kavya on a video call ---------- */
    if (sid === 'ask') {
      op(vc, 1); tr(vc, 600, 400);
      kavya.set({ t, talk: scTalk(S, t, 'kavya'), mood: t < mid('ask', 0.5) ? 'neutral' : 'happy', look: t > mid('ask', 0.85) ? 0 : -0.3 });
      flPop(askChip, 600, 660, P(t, mid('ask', 0.38), 0.45, pop));
    }
    /* ---------- no: the long deadpan, then "No." ---------- */
    if (sid === 'no') {
      const k = 2.3 + 0.35 * P(t, end('ask') + 0.08, at('same') - end('ask'), linear);
      cam = flFrame(k, SOFA_A[0], SOFA_A[1], 640, 400);
      A = { w: 1, x: SOFA_A[0], y: SOFA_A[1], s: SOFA_A[2], mood: 'deadpan', look: 0 };
      N = { w: 1, x: SOFA_N[0], y: SOFA_N[1], s: SOFA_N[2], mood: 'neutral', lookL: 1, lookR: 1 };
    }
    /* ---------- same: still an element ---------- */
    if (sid === 'same') {
      cam = { k: 1.1, cx: 600, cy: 420 }; veilV = 0.62;
      N = { x: 370, y: 330, s: 1.1, mood: 'neutral', lookL: 0.5, lookR: 0.5 };
      nTags.forEach((g, i) => flPop(g, 370 + (i ? 1 : -1) * 79, 220, P(t, at('same') + 0.15 + i * 0.25, 0.4, pop)));
      flPop(sameChip, 350, 500, P(t, mid('same', 0.18), 0.45, pop));
      const sp = P(t, mid('same', 0.3), 0.35, pop);
      op(stamp, clamp(sp * 3)); tr(stamp, 880, 220, Math.max(0.01, 1.6 - 0.6 * sp), -8);
      op(stampX, P(t, mid('same', 0.38), 0.2, linear));
      const of = P(t, mid('same', 0.5), 0.8, easeOut);
      op(o2, clamp(of * 2)); tr(o2, lerp(1300, 900, of), 400 + 8 * Math.sin(t * 2), 1, 10 * Math.sin(t * 1.3) * AMP);
      flPop(o2Chip, 900, 500, P(t, mid('same', 0.56), 0.45, pop));
      flPop(needChip, 560, 640, P(t, mid('same', 0.68), 0.45, pop));
      A = { x: 1110, y: 650, s: 0.4, mood: 'deadpan', look: -1 };
    }
    /* ---------- lot: they nod, in sync ---------- */
    if (sid === 'lot') {
      cam = flFrame(2.6, SOFA_N[0], SOFA_N[1], 470, 440);
      const nod = Math.abs(Math.sin((t - at('lot')) * 6)) * 5 * AMP * (t < end('lot') + 0.2 ? 1 : 0);
      A = { w: 1, x: SOFA_A[0], y: SOFA_A[1], s: SOFA_A[2], mood: 'deadpan', look: -1 };
      N = { w: 1, x: SOFA_N[0], y: SOFA_N[1] + nod, s: SOFA_N[2], mood: t > end('lot') ? 'deadpan' : 'neutral', lookL: 0, lookR: 0, talkL: talkN, talkR: talkN };
      syncBlink = win(t, end('lot') + 0.2, end('lot') + 0.36, 0.05);
    }
    /* ---------- pictures / two / sbf ---------- */
    const inPP = t >= cut('pictures') && t < cut('share');
    if (inPP) {
      cam = { k: 1.1, cx: 600, cy: 420 }; veilV = 0.7;
      PP.forEach((p, i) => { p.g.upd(t); flPop(p.g, p.x, 310, P(t, at('pictures') + 0.1 + i * 0.25, 0.45, pop), 1.22); });
      if (t < cut('two')) {
        flPop(ppChip1, 600, 540, P(t, mid('pictures', 0.3), 0.45, pop));
        flPop(ppChip2, 600, 610, P(t, mid('pictures', 0.62), 0.45, pop));
      } else if (t < cut('sbf')) {
        flPop(q1, 600, 540, P(t, mid('two', 0.22), 0.45, pop));
        flPop(q2, 600, 610, P(t, mid('two', 0.64), 0.45, pop));
      } else {
        SBF.forEach(s => {
          flPop(s.g, s.x, 532, P(t, mid('sbf', s.f), 0.45, pop));
          flPop(s.w, s.x, 150, P(t, mid('sbf', s.fw), 0.4, pop));
        });
        flPop(sbfBig, 600, 662, P(t, mid('sbf', 0.86), 0.45, pop));
      }
      A = { x: 1120, y: 668, s: 0.36, mood: 'deadpan', look: -1, hide: t < cut('two') };
      if (A.hide) A = null;
    }
    /* ---------- share: the pie chart ---------- */
    if (sid === 'share') {
      veilV = 0.82; cam = { k: 1.1, cx: 600, cy: 420 }; op(AF, 1);
      flPop(PIE, 330, 410, P(t, at('share') + 0.05, 0.45, pop));
      const pN = P(t, mid('share', 0.13), 0.8, ease), pO = P(t, mid('share', 0.33), 0.6, ease), pA = P(t, mid('share', 0.5), 0.4, ease);
      attr(slN, 'd', sector(A0, lerp(A0, AN, pN), 200)); attr(slO, 'd', sector(AN, lerp(AN, AO, pO), 200)); attr(slA, 'd', sector(AO, lerp(AO, AA, pA), 200));
      op(pieTxtN, P(t, mid('share', 0.2), 0.3, linear)); op(pieTxtO, P(t, mid('share', 0.38), 0.3, linear));
      const ma = P(t, mid('share', 0.56), 0.4, pop); op(miniAr, clamp(ma * 2.5));
      LEG.forEach(l => op(l.g, P(t, mid('share', l.f), 0.3, linear)));
      flPop(airChip, 780, 170, P(t, mid('share', 0.04), 0.45, pop));
      A = { x: 1110, y: 640, s: 0.42, mood: t > mid('share', 0.6) ? 'smug' : 'deadpan', look: -1 };
    }
    /* ---------- share2: nobody's bonded to their flatmates ---------- */
    if (sid === 'share2') {
      cam = { k: 1.25, cx: 800, cy: 470 };
      A = { w: 1, x: SOFA_A[0] + 30, y: SOFA_A[1], s: SOFA_A[2], mood: 'deadpan', look: -0.6 };
      N = { w: 1, x: SOFA_N[0] - 20, y: SOFA_N[1], s: SOFA_N[2], mood: 'neutral', lookL: -0.5, lookR: 0.5 };
      op(flO2, 1); flPlace(flO2, cam, 640, 470 + 8 * Math.sin(t * 1.5), 1, 8 * Math.sin(t) * AMP);
      shareX.forEach((g, i) => { op(g, P(t, mid('share', 0.72 + i * 0.06), 0.3, linear)); flPlace(g, cam, i ? 945 : 725, 470, 1); });
      flPop(shareChip, 600, 170, P(t, mid('share', 0.69), 0.45, pop));
      flPop(shareChip2, 600, 240, P(t, mid('share', 0.91), 0.45, pop));
    }
    /* ---------- alloys ---------- */
    if (sid === 'alloys') {
      veilV = 0.82;
      op(ALG, 1);
      pan.forEach((g, i) => flPop(g, [220, 600, 980][i], 360, P(t, mid('alloys', [0.02, 0.43, 0.72][i]), 0.45, pop)));
      alChips.forEach(a => flPop(a.g, a.x, 572, P(t, mid('alloys', a.f + 0.04), 0.45, pop)));
      flPop(alloyChip, 640, 150, P(t, mid('alloys', 0.28), 0.45, pop));
      const bp = P(t, mid('alloys', 0.43), 0.45, pop);
      op(TP, clamp(bp * 2.5)); tr(TP, 590, 262, Math.max(0.01, 0.6 * (0.6 + 0.4 * bp))); op(disguise, 0); op(peek, 0);
    }
    /* ---------- brass: Kavya squints ---------- */
    if (sid === 'brass') {
      op(vc, 1); tr(vc, 880, 400, 0.62);
      kavya.set({ t, talk: scTalk(S, t, 'kavya'), mood: 'annoyed', look: -1 });
      op(TP, 1); tr(TP, 330, 400, 0.95); op(disguise, 0); op(peek, 0);
    }
    /* ---------- costume ---------- */
    if (sid === 'costume') {
      cam = { k: 1.1, cx: 600, cy: 420 }; veilV = 0.6;
      const k = 1 + 0.08 * P(t, end('costume') - 0.1, 0.9);
      op(TP, 1); tr(TP, 420 * k - 0 + (1 - k) * 420, 380, 1.15 * k);
      const dp = P(t, at('costume') + 0.05, 0.4, pop);
      op(disguise, clamp(dp * 2.5)); tr(disguise, 0, -8 * (1 - dp));
      stache.setAttribute('transform', `translate(250 0) rotate(${(4 * Math.sin(t * 9) * AMP).toFixed(2)})`);
      const pk = P(t, mid('costume', 0.35), 0.5, easeOut);
      op(peek, pk); tr(peek, 220, lerp(-10, -120, pk));
      flPop(costChip, 460, 600, P(t, mid('costume', 0.4), 0.45, pop));
      A = { x: 1020, y: 470, s: 0.85 * k, mood: 'deadpan', look: t > end('costume') ? 0 : -1 };
    }
    /* ---------- versus ---------- */
    if (sid === 'versus') {
      veilV = 0.85;
      flPop(VS, 520, 400, P(t, at('versus') - 0.02, 0.4, pop));
      op(hC, P(t, mid('versus', 0.02), 0.25, linear)); op(hM, P(t, mid('versus', 0.42), 0.25, linear));
      vsCells.forEach(c => {
        op(c.ct, P(t, mid('versus', c.fc), 0.3, linear)); op(c.mt, P(t, mid('versus', c.fm), 0.3, linear));
        op(c.l, P(t, mid('versus', Math.min(c.fc, c.fm)), 0.3, linear));
      });
      A = { x: 1100, y: 620, s: 0.5, mood: 'deadpan', look: -1 };
    }

    /* ---------- camera, veil, cast ---------- */
    if (airOn) flCam(AF, cam.k, cam.cx, cam.cy);
    op(veil, veilV);
    if (A) {
      op(arthur, 1);
      if (A.w) flPlace(arthur, cam, A.x, A.y, A.s); else tr(arthur, A.x, A.y, A.s);
      arthur.set({ t, talk: scTalk(S, t, 'arthur'), mood: A.mood, look: A.look });
    } else op(arthur, 0);
    if (N) {
      op(nigels, 1);
      if (N.w) flPlace(nigels, cam, N.x, N.y, N.s); else tr(nigels, N.x, N.y, N.s);
      nigels.set({ t, talk: N.talkL || 0, talkB: N.talkR || 0, mood: N.mood, moodB: N.mood, look: N.lookL ?? N.look ?? 0, lookB: N.lookR ?? N.look ?? 0 });
      op(lids, syncBlink);
    } else op(nigels, 0);
  };
});
