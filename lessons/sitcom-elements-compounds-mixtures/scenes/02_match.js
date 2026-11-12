/* Scene 2: The perfect match (compounds, properties, formulae).
   Shots (hard sitcom cuts): the agency: Nate beams, Arthur holds MATCH FOUND, Chloe drifts in ->
   close on Chloe and the hazard sign -> Arthur's confessional (explodes in water + poison gas: on paper
   a disaster, in chemistry perfect) -> the COMPOUND card -> the bonding ceremony arch, 3-2-1, white
   flash -> Sal -> salt on chicken rice -> Kavya suspicious of the salt shaker -> three-column
   DIFFERENT PROPERTIES -> zoom into Sal's lattice: 1 : 1, NaCl -> hydrogen + oxygen = water puts a
   fire out -> H2O, the little 2 -> CO2 loses its 2 and becomes CO -> DO NOT SEPARATE -> Nate's and
   Chloe's tiny faces wave from inside Sal's lattice. */
scene('match', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;
  const INK = SC_INK;
  const AMBER = '#FFC247', PINK = '#FF8FC8', GREEN = '#B8E86A', SILVER = '#C9D3DC';

  /* ---------- local helpers (prefixed mt) ---------- */
  const mtCam = (el, k, cx, cy) => el.setAttribute('transform', `translate(${cx.toFixed(1)} ${cy.toFixed(1)}) scale(${k.toFixed(4)}) translate(${(-cx).toFixed(1)} ${(-cy).toFixed(1)})`);
  const mtPlace = (el, cam, x, y, s, r) => tr(el, cam.cx + cam.k * (x - cam.cx), cam.cy + cam.k * (y - cam.cy), s * cam.k, r);
  const mtPop = (el, x, y, p, s, r) => { op(el, clamp(p * 2.5)); tr(el, x, y, Math.max(0.01, (s || 1) * (0.6 + 0.4 * p)), r); };
  // text with real subscripts: 'CO_2' -> CO₂ ; '**bold**' segments use o.boldFill
  function mtRich(parent, x, y, str, o) {
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
  function mtChip(parent, str, o) {
    o = o || {};
    const size = o.size || 30, g = G(parent), h = Math.round(size * 1.7);
    const box = E('rect', { y: -h / 2, height: h, rx: h / 2, fill: o.fill || 'rgba(14,26,36,0.93)', stroke: o.stroke || C.line, 'stroke-width': 3 }, g);
    const tx = mtRich(g, 0, size * 0.35, str, { size, weight: o.weight || 700, fill: o.color || C.ink, boldFill: o.boldFill });
    const w = textWidth(str.replace(/\*\*|_/g, ''), size, FD, 700) + size * 1.3;
    attr(box, 'x', -w / 2); attr(box, 'width', w);
    return g;
  }
  const mtCard = (parent, w, h, stroke) => card(parent, -w / 2, -h / 2, w, h, { fill: 'rgba(14,26,36,0.94)', stroke: stroke || C.line, sw: 4, rx: 22 });
  function mtBall(parent, sym, r, cols) {
    const [c, dk, lc] = cols || EC_ATOM[sym] || EC_ATOM.C, g = G(parent);
    E('circle', { r, fill: ball(c, dk), stroke: dk, 'stroke-width': Math.max(1.5, r * 0.09) }, g);
    if (r >= 24) T(g, 0, r * 0.36, sym, { size: Math.max(26, Math.round(r * (sym.length > 1 ? 0.8 : 0.95))), weight: 800, fill: lc, anchor: 'middle' });
    return g;
  }
  const mtHeart = (parent, s, fill) => E('path', { d: 'M0,14 C-26,-2 -20,-24 -7,-23 C-2,-22 0,-17 0,-13 C0,-17 2,-22 7,-23 C20,-24 26,-2 0,14 Z', fill: fill || '#FF5FA2', stroke: '#FFFFFF', 'stroke-width': 2, transform: `scale(${s || 1})` }, parent);
  function mtStar(parent, r, fill, text) {
    const g = G(parent); let d = '';
    for (let i = 0; i < 16; i++) { const a = i / 16 * TAU - Math.PI / 2, rr = i % 2 ? r * 0.55 : r; d += (i ? 'L' : 'M') + (Math.cos(a) * rr).toFixed(1) + ',' + (Math.sin(a) * rr).toFixed(1); }
    E('path', { d: d + 'Z', fill: fill || '#FFE45C', stroke: INK, 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
    if (text) T(g, 0, 9, text, { size: 26, weight: 800, anchor: 'middle', fill: INK });
    return g;
  }

  /* layers */
  const Lset = G(root), LcastB = G(root), Lfront = G(root), Lfg = G(root), LcastF = G(root), Lhud = G(root);

  /* =================== the agency =================== */
  const AG = G(Lset), agency = ecAgency(AG);
  const DF = G(Lfront);
  E('rect', { x: 640, y: 470, width: 520, height: 140, rx: 8, fill: '#7A3E6E', stroke: INK, 'stroke-width': 4 }, DF);
  E('rect', { x: 628, y: 458, width: 544, height: 22, rx: 6, fill: '#A05A90', stroke: INK, 'stroke-width': 4 }, DF);
  T(DF, 900, 560, 'RECEPTION', { size: 34, weight: 800, anchor: 'middle', fill: '#F7C8E4', ls: 4 });
  const file = G(DF); tr(file, 770, 432, 1, -8);
  E('path', { d: 'M-80,-56 L-30,-56 L-20,-66 L80,-66 L80,56 L-80,56 Z', fill: '#F2C14E', stroke: INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, file);
  T(file, 0, -12, 'MATCH', { size: 30, weight: 800, anchor: 'middle', fill: '#B3326F' });
  T(file, 0, 26, 'FOUND!', { size: 30, weight: 800, anchor: 'middle', fill: '#B3326F' });
  const fileHeart = mtHeart(file, 0.9); fileHeart.setAttribute('transform', 'translate(56 -40) scale(0.9)');
  const clChip = mtChip(Lfg, 'chlorine = **Cl**', { size: 32, color: GREEN, stroke: GREEN, boldFill: '#FFFFFF' });
  const gasChip = mtChip(Lfg, 'a **POISONOUS** green gas', { size: 30, boldFill: '#FF6070' });
  const ltChloe = scLowerThird(Lhud, ...EC_LOWER.chloe);
  // toxic: hazard sign + fact chip
  const haz = G(Lfg);
  E('rect', { x: -100, y: -100, width: 200, height: 200, rx: 14, fill: '#FFFFFF', stroke: '#E8424F', 'stroke-width': 16, transform: 'rotate(45)' }, haz);
  E('circle', { cy: -18, r: 44, fill: INK }, haz);
  E('rect', { x: -26, y: 14, width: 52, height: 30, rx: 8, fill: INK }, haz);
  E('circle', { cx: -16, cy: -22, r: 12, fill: '#FFFFFF' }, haz); E('circle', { cx: 16, cy: -22, r: 12, fill: '#FFFFFF' }, haz);
  E('path', { d: 'M-70,64 L70,104 M70,64 L-70,104', stroke: INK, 'stroke-width': 14, 'stroke-linecap': 'round' }, haz);
  const toxChip = mtChip(Lfg, 'TOXIC', { size: 40, color: '#FF6070', stroke: '#FF6070' });
  const factChip = mtChip(Lfg, 'FACT: chlorine is poisonous', { size: 30, color: GREEN, stroke: GREEN });

  /* =================== confessional =================== */
  const CF = ecConfessional(Lset, 'arthur');
  const inA = G(Lfg), inB = G(Lfg);
  mtCard(inA, 400, 190, '#9FD8FF');
  E('rect', { x: -180, y: 10, width: 220, height: 70, rx: 10, fill: '#4CC9F0' }, inA);
  const mini = G(inA); tr(mini, -70, 8);
  E('circle', { r: 34, fill: ball('#F3F6F9', '#8492A0'), stroke: '#56636F', 'stroke-width': 4 }, mini);
  T(mini, 0, 10, 'Na', { size: 28, weight: 800, anchor: 'middle', fill: INK });
  const bang = mtStar(inA, 58, '#FFB13D', 'BANG!'); tr(bang, 110, 0);
  T(inA, 0, -56, 'explodes in water', { size: 30, weight: 700, anchor: 'middle', fill: '#9FD8FF' });
  mtCard(inB, 400, 190, GREEN);
  const puffG = G(inB); tr(puffG, -80, 30);
  [[0, -6, 34], [-30, 8, 26], [30, 8, 28], [0, 22, 26]].forEach(([x, y, r]) => E('circle', { cx: x, cy: y, r, fill: ball('#DDF68E', '#93BE3E') }, puffG));
  T(inB, 80, 44, 'POISON', { size: 38, weight: 800, anchor: 'middle', fill: '#FF6070' });
  T(inB, 0, -56, 'poisonous gas', { size: 30, weight: 700, anchor: 'middle', fill: GREEN });
  const disaster = G(Lfg);
  E('rect', { x: -200, y: -40, width: 400, height: 80, rx: 10, fill: 'rgba(40,10,14,0.85)', stroke: '#FF4D5E', 'stroke-width': 6 }, disaster);
  T(disaster, 0, 14, 'ON PAPER: DISASTER', { size: 36, weight: 800, anchor: 'middle', fill: '#FF4D5E' });
  const perfect = G(Lfg);
  E('rect', { x: -230, y: -44, width: 460, height: 88, rx: 44, fill: '#3A1030', stroke: PINK, 'stroke-width': 5 }, perfect);
  const pfA = T(perfect, -10, 14, 'IN CHEMISTRY:', { size: 32, weight: 700, anchor: 'end', fill: '#FFFFFF' });
  const pfB = T(perfect, 0, 16, 'PERFECT', { size: 40, weight: 800, anchor: 'start', fill: PINK });
  const pfH = mtHeart(perfect, 1.1); pfH.setAttribute('transform', 'translate(196 -2) scale(1.1)');

  /* =================== the ceremony arch =================== */
  const CE = G(Lset);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#3A1236', '#6A2456', true) }, CE);
  E('ellipse', { cx: 600, cy: 420, rx: 420, ry: 330, fill: glow('#FFB3D9'), opacity: 0.35 }, CE);
  E('rect', { x: 0, y: 600, width: 1200, height: 150, fill: '#2A0E26' }, CE);
  E('path', { d: 'M480,750 L540,600 L660,600 L720,750 Z', fill: '#C2186B', opacity: 0.8 }, CE);   // the aisle carpet
  E('path', { d: 'M260,610 L260,470 A340,340 0 0 1 940,470 L940,610', fill: 'none', stroke: '#F7E3EE', 'stroke-width': 22 }, CE);
  { let fd = '', fd2 = '';
    for (let i = 0; i <= 26; i++) {
      const a = Math.PI + i / 26 * Math.PI, x = 600 + Math.cos(a) * 340, y = 470 + Math.sin(a) * 340, r = i % 2 ? 17 : 21;
      const s = `M${(x - r).toFixed(1)},${y.toFixed(1)} a${r},${r} 0 1,0 ${2 * r},0 a${r},${r} 0 1,0 ${-2 * r},0 `;
      if (i % 2) fd += s; else fd2 += s;
    }
    for (let y = 490; y <= 600; y += 36) [260, 940].forEach((x, j) => { const r = 17, s = `M${x - r},${y} a${r},${r} 0 1,0 ${2 * r},0 a${r},${r} 0 1,0 ${-2 * r},0 `; if ((y / 36 + j) % 2 < 1) fd += s; else fd2 += s; });
    E('path', { d: fd2, fill: '#FF6FB5', stroke: '#B3326F', 'stroke-width': 3 }, CE);
    E('path', { d: fd, fill: '#FFFFFF', stroke: '#F7A8C8', 'stroke-width': 3 }, CE);
  }
  const banner = G(CE); tr(banner, 600, 150);
  E('path', { d: 'M-250,-34 L250,-34 L230,0 L250,34 L-250,34 L-230,0 Z', fill: '#F7E3EE', stroke: '#B3326F', 'stroke-width': 4 }, banner);
  T(banner, 0, 13, 'BONDING CEREMONY', { size: 36, weight: 800, anchor: 'middle', fill: '#B3326F', ls: 2 });
  const count = T(Lfg, 600, 320, '3', { size: 170, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  count.setAttribute('stroke', '#C2186B'); count.setAttribute('stroke-width', 10); count.setAttribute('paint-order', 'stroke');
  const confetti = [], cr = rng(66);
  for (let i = 0; i < 12; i++) confetti.push({ el: E('rect', { x: -6, y: -3, width: 12, height: 6, fill: ['#FF6FB5', '#FFE45C', '#FFFFFF', '#7FE3FF'][i % 4] }, CE), x: 80 + cr() * 1040, v: 60 + cr() * 60, ph: cr() * 10, sp: cr() * 360 });
  const ltSal = scLowerThird(Lhud, ...EC_LOWER.sal);
  const salChip = mtChip(Lfg, 'sodium + chlorine → **sodium chloride**', { size: 30, boldFill: '#FFFFFF', stroke: PINK });
  const flash = E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#FFFFFF' }, Lhud);

  /* =================== COMPOUND definition card =================== */
  const DEF = G(Lfg);
  mtCard(DEF, 960, 470, PINK);
  const d1 = mtRich(DEF, 0, -150, 'atoms of **two or more DIFFERENT** elements', { size: 36, weight: 600, boldFill: AMBER });
  const d2 = mtRich(DEF, 0, -96, '**CHEMICALLY BONDED** together', { size: 36, weight: 600, boldFill: '#7FE3FF' });
  const dPic = G(DEF); tr(dPic, -200, 70);
  const dBonds = E('path', { d: '', stroke: '#FFFFFF', 'stroke-width': 5, opacity: 0.85 }, dPic);
  { let bd = ''; for (let i = 0; i < 4; i++) { bd += `M${-90},${-60 + i * 40} L${90},${-60 + i * 40} `; } for (let j = 0; j < 4; j++) bd += `M${-60 + j * 40},${-90} L${-60 + j * 40},${90} `; attr(dBonds, 'd', ''); dBonds.dataset.d = bd; }
  { let a = '', b = ''; for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { const na = (i + j) % 2 === 0, r = na ? 12 : 16, x = -60 + j * 40, y = -60 + i * 40, c = `M${x - r},${y} a${r},${r} 0 1,0 ${2 * r},0 a${r},${r} 0 1,0 ${-2 * r},0 `; if (na) a += c; else b += c; }
    E('path', { d: a, fill: '#DCE3EA', stroke: '#8492A0', 'stroke-width': 2.5 }, dPic); E('path', { d: b, fill: '#C7EA7A', stroke: '#7FA83A', 'stroke-width': 2.5 }, dPic); }
  T(DEF, -200, 200, 'e.g. sodium + chlorine', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  const dWat = G(DEF); tr(dWat, 0, 70);
  { const o = mtBall(dWat, 'O', 40); tr(o, 0, 0); const h1 = mtBall(dWat, 'H', 28); tr(h1, -46, 38); const h2 = mtBall(dWat, 'H', 28); tr(h2, 46, 38); dWat.insertBefore(o, null); }
  T(DEF, 0, 200, 'e.g. water', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  const d3 = G(DEF);
  T(d3, 280, 80, '= a', { size: 40, weight: 700, anchor: 'middle', fill: '#FFFFFF' });
  T(d3, 280, 140, 'COMPOUND', { size: 56, weight: 800, anchor: 'middle', fill: PINK });

  /* =================== kitchen (food, where) =================== */
  const KW = G(Lset), kit = ecKitchen(KW);
  const plate = G(KW); tr(plate, 520, 610);
  E('ellipse', { rx: 230, ry: 56, fill: '#F4F7FA', stroke: '#9AA9B6', 'stroke-width': 5 }, plate);
  E('ellipse', { rx: 170, ry: 36, fill: 'none', stroke: '#D6E0EA', 'stroke-width': 4 }, plate);
  E('path', { d: 'M-170,-6 Q-160,-70 -90,-74 Q-20,-70 -10,-6 Z', fill: '#FFFDF4', stroke: '#C9BFA6', 'stroke-width': 3 }, plate);     // rice dome
  [[30, -10], [70, -14], [110, -10]].forEach(([x, y], i) => { E('path', { d: `M${x - 26},${y + 8} Q${x},${y - 22} ${x + 26},${y + 8} Z`, fill: '#F7E2BE', stroke: '#C98B4E', 'stroke-width': 3 }, plate); });
  [[150, 4], [170, -14]].forEach(([x, y]) => E('ellipse', { cx: x, cy: y, rx: 18, ry: 9, fill: '#7FD07A', stroke: '#3F8A3A', 'stroke-width': 2 }, plate));
  const shaker = G(KW);
  E('path', { d: 'M-34,-70 L34,-70 L40,60 Q40,74 26,74 L-26,74 Q-40,74 -40,60 Z', fill: 'rgba(220,240,255,0.8)', stroke: '#6B7A88', 'stroke-width': 4 }, shaker);
  E('rect', { x: -38, y: 20, width: 76, height: 50, rx: 8, fill: '#FFFFFF' }, shaker);
  E('path', { d: 'M-36,-70 Q-36,-104 0,-104 Q36,-104 36,-70 Z', fill: '#C9D3DC', stroke: '#6B7A88', 'stroke-width': 4 }, shaker);
  const salt1 = T(shaker, 0, 0, 'SALT', { size: 26, weight: 800, anchor: 'middle', fill: '#2E5BD8' });
  const salt2 = T(shaker, 0, 0, 'SALT', { size: 26, weight: 800, anchor: 'middle', fill: '#2E5BD8' }); salt2.setAttribute('transform', 'translate(0 -9) rotate(180)');
  const grains = [0, 1, 2, 3, 4, 5, 6, 7].map(() => E('rect', { x: -5, y: -5, width: 10, height: 10, fill: '#FFFFFF', stroke: '#9AA9B6', 'stroke-width': 1.5 }, KW));
  const foodChip = mtChip(Lfg, 'table salt: on food', { size: 30 });
  const tableF = G(Lfront);
  E('rect', { x: -20, y: 600, width: 1240, height: 160, fill: '#8A5A3B' }, tableF);
  E('rect', { x: -20, y: 600, width: 1240, height: 18, fill: '#A8724D' }, tableF);
  const bub = G(Lfg);
  E('circle', { cx: -150, cy: 150, r: 12, fill: '#FFFFFF' }, bub); E('circle', { cx: -120, cy: 116, r: 18, fill: '#FFFFFF' }, bub);
  E('ellipse', { rx: 200, ry: 110, fill: '#FFFFFF', stroke: '#BFD3E6', 'stroke-width': 4 }, bub);
  const bNa = G(bub); tr(bNa, -100, 0);
  E('circle', { r: 36, fill: ball('#F3F6F9', '#8492A0'), stroke: '#56636F', 'stroke-width': 4 }, bNa);
  T(bNa, 0, 10, 'Na', { size: 28, weight: 800, anchor: 'middle', fill: INK });
  const bBoom = mtStar(bub, 26, '#FFB13D'); tr(bBoom, -62, -40);
  const bCl = G(bub); tr(bCl, 30, 0);
  [[0, -8, 30], [-24, 10, 22], [24, 10, 24]].forEach(([x, y, r]) => E('circle', { cx: x, cy: y, r, fill: ball('#DDF68E', '#93BE3E') }, bCl));
  T(bCl, 0, 14, 'Cl', { size: 28, weight: 800, anchor: 'middle', fill: '#2E4A10' });
  T(bub, 128, 26, '?', { size: 90, weight: 800, anchor: 'middle', fill: '#B3326F' });

  /* =================== different properties =================== */
  const PR = G(Lfg);
  const prCols = [[220, 'sodium', ['soft metal,', 'explodes in water'], '#C9D3DC'], [600, 'chlorine', ['poisonous', 'green gas'], GREEN], [980, 'sodium chloride', ['white crystals,', 'safe to eat'], '#FFFFFF']].map(([x, name, ls, col]) => {
    const g = G(PR); tr(g, x, 350);
    mtCard(g, 330, 390, col);
    T(g, 0, 70, name, { size: 34, weight: 800, anchor: 'middle', fill: col });
    ls.forEach((s, i) => T(g, 0, 114 + i * 36, s, { size: 28, weight: 600, anchor: 'middle', fill: C.ink }));
    return { g, x };
  });
  const prPlus = T(PR, 410, 372, '+', { size: 64, weight: 800, anchor: 'middle', fill: AMBER });
  const prArr = arrow(PR, 768, 352, 812, 352, { color: AMBER, width: 8 });
  const prBan = mtChip(Lfg, 'DIFFERENT PROPERTIES', { size: 44, color: AMBER, stroke: AMBER });

  /* =================== Sal's lattice (ratio, happy) =================== */
  const LAT = G(Lfg);
  const latClip = 'mtLatClip';
  { const cp = E('clipPath', { id: latClip }, defs()); E('circle', { r: 196 }, cp); }
  E('circle', { r: 200, fill: '#16283A', stroke: '#FFFFFF', 'stroke-width': 6 }, LAT);
  const latIn = G(LAT, { 'clip-path': `url(#${latClip})` });
  let lg = ''; for (let i = -4; i <= 4; i++) { lg += `M${-220},${i * 50} L220,${i * 50} M${i * 50},-220 L${i * 50},220 `; }
  E('path', { d: lg, stroke: '#3C6E86', 'stroke-width': 4 }, latIn);
  // the lattice dots as two merged paths (silver Na, green Cl); the two centre dots are separate
  // circles so they can make room for the tiny faces
  let pNa = '', pCl = '';
  const latDots = [];
  for (let i = -4; i <= 4; i++) for (let j = -4; j <= 4; j++) {
    if (i * i + j * j > 22) continue;
    const na = (i + j + 8) % 2 === 0, r = na ? 15 : 21, x = j * 50, y = i * 50;
    if (i === 0 && (j === 0 || j === -1)) { latDots.push({ el: E('circle', { cx: x, cy: y, r, fill: na ? '#DCE3EA' : '#C7EA7A', stroke: na ? '#8492A0' : '#7FA83A', 'stroke-width': 3 }, latIn), i, j }); continue; }
    const c = `M${x - r},${y} a${r},${r} 0 1,0 ${2 * r},0 a${r},${r} 0 1,0 ${-2 * r},0 `;
    if (na) pNa += c; else pCl += c;
  }
  E('path', { d: pNa, fill: '#DCE3EA', stroke: '#8492A0', 'stroke-width': 3 }, latIn);
  E('path', { d: pCl, fill: '#C7EA7A', stroke: '#7FA83A', 'stroke-width': 3 }, latIn);
  latIn.appendChild(latDots[0].el); latIn.appendChild(latDots[1].el);
  const pairBox = E('rect', { x: -40, y: -32, width: 130, height: 64, rx: 32, fill: 'none', stroke: '#FF5FA2', 'stroke-width': 6 }, latIn);
  // tiny Nate and Chloe faces inside the lattice (happy)
  function mtTiny(parent, kind) {
    const g = G(parent);
    if (kind === 'nate') {
      E('path', { d: 'M-22,-10 L-26,-34 L-12,-22 L-4,-42 L4,-24 L16,-38 L18,-16 L28,-24 L24,-6 Z', fill: '#B4C2D0', stroke: INK, 'stroke-width': 2 }, g);
      E('circle', { r: 24, fill: ball('#F3F6F9', '#8492A0'), stroke: '#56636F', 'stroke-width': 3 }, g);
    } else {
      E('circle', { r: 26, fill: ball('#DDF68E', '#93BE3E'), stroke: '#5E8A22', 'stroke-width': 3 }, g);
      E('ellipse', { cx: 8, cy: -26, rx: 20, ry: 7, fill: '#3A2348', stroke: INK, 'stroke-width': 2 }, g);
    }
    E('circle', { cx: -8, cy: -3, r: 3.5, fill: INK }, g); E('circle', { cx: 8, cy: -3, r: 3.5, fill: INK }, g);
    E('path', { d: 'M-8,7 Q0,15 8,7', fill: 'none', stroke: INK, 'stroke-width': 3, 'stroke-linecap': 'round' }, g);
    g.hand = E('ellipse', { cx: 0, cy: 0, rx: 7, ry: 9, fill: kind === 'nate' ? '#DDE3E9' : '#C9EE73', stroke: INK, 'stroke-width': 2 }, g);
    return g;
  }
  const tNate = mtTiny(latIn, 'nate'), tChloe = mtTiny(latIn, 'chloe');
  const zoomLines = E('path', { d: '', stroke: '#FFFFFF', 'stroke-width': 3, 'stroke-dasharray': '10 8', fill: 'none' }, Lfg);
  const legNa = mtChip(Lfg, 'Na', { size: 30, color: INK, fill: SILVER, stroke: '#FFFFFF' });
  const legCl = mtChip(Lfg, 'Cl', { size: 30, color: '#2E4A10', fill: GREEN, stroke: '#FFFFFF' });
  const ratioChip = mtChip(Lfg, '1 Na : 1 Cl  –  a FIXED RATIO', { size: 32, color: AMBER, stroke: AMBER });
  const fNaCl = G(Lfg);
  T(fNaCl, 0, 0, 'formula', { size: 28, weight: 600, anchor: 'middle', fill: C.muted });
  T(fNaCl, 0, 96, 'NaCl', { size: 104, weight: 800, anchor: 'middle', fill: '#FFFFFF' });

  /* =================== water (hydrogen + oxygen) =================== */
  const WS = G(Lset);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#16283A', '#24435E', true) }, WS);
  E('rect', { x: 0, y: 640, width: 1200, height: 110, fill: '#1A2430' }, WS);
  const wBond = E('path', { d: '', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 8, 'stroke-linecap': 'round' }, Lfg);
  const hA = mtBall(Lfg, 'H', 44), hB = mtBall(Lfg, 'H', 44), oA = mtBall(Lfg, 'O', 54);
  const hBoom = mtStar(Lfg, 44, '#FFB13D', 'BOOM');
  const oFlame = G(Lfg); E('path', { d: 'M0,40 C-34,34 -36,-4 -14,-24 C-12,-8 -4,-4 0,-6 C-4,-26 6,-44 18,-52 C14,-30 36,-14 32,12 C30,32 18,40 0,40 Z', fill: '#FF8A3D', stroke: '#FFE45C', 'stroke-width': 4 }, oFlame);
  const hChip = mtChip(Lfg, 'hydrogen: explosive gas', { size: 30, color: '#FFB13D', stroke: '#FFB13D' });
  const oChip = mtChip(Lfg, 'oxygen: helps things burn', { size: 30, color: '#FF8A3D', stroke: '#FF8A3D' });
  const wChip = mtChip(Lfg, 'bonded: **water** puts fires OUT', { size: 32, color: '#9FD8FF', stroke: '#9FD8FF', boldFill: '#FFFFFF' });
  const fire = G(Lfg); tr(fire, 600, 600);
  E('path', { d: 'M-70,24 L70,-4 M-70,-4 L70,24', stroke: '#7A4A2A', 'stroke-width': 18, 'stroke-linecap': 'round' }, fire);
  const flames = [[-24, 1.0], [22, 0.85], [0, 1.25]].map(([x, s]) => { const f = G(fire); E('path', { d: 'M0,10 C-34,4 -36,-34 -14,-54 C-12,-38 -4,-34 0,-36 C-4,-56 6,-74 18,-82 C14,-60 36,-44 32,-18 C30,2 18,10 0,10 Z', fill: '#FF8A3D', stroke: '#FFE45C', 'stroke-width': 4 }, f); return { f, x, s }; });
  const steam = [0, 1, 2].map(() => E('path', { d: 'M0,0 Q-14,-22 0,-44 Q14,-66 0,-88', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 8, 'stroke-linecap': 'round' }, fire));
  const hiss = T(fire, 110, -60, 'hssss…', { size: 34, weight: 700, fill: '#DDEEFF' });
  const wDrops = [0, 1, 2, 3].map(() => E('path', { d: 'M0,-12 Q9,2 0,8 Q-9,2 0,-12 Z', fill: '#4CC9F0' }, Lfg));

  /* =================== H2O and CO2 formula board =================== */
  const FB_ = G(Lfg);
  const fH = T(FB_, 520, 330, 'H', { size: 170, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  const f2 = T(FB_, 597, 372, '2', { size: 104, weight: 800, anchor: 'middle', fill: AMBER });
  const fO = T(FB_, 690, 330, 'O', { size: 170, weight: 800, anchor: 'middle', fill: '#FF6B5C' });
  const fArc = E('path', { d: 'M600,286 Q570,190 530,196', fill: 'none', stroke: AMBER, 'stroke-width': 6, 'stroke-dasharray': '10 8' }, FB_);
  const fArcHd = E('path', { d: 'M530,196 L552,182 L548,208 Z', fill: AMBER }, FB_);
  const fArcT = T(FB_, 640, 200, 'counts the atom BEFORE it', { size: 30, weight: 700, fill: AMBER });
  const fA1 = arrow(FB_, 590, 392, 420, 470, { color: AMBER, width: 6 });
  const fA2 = arrow(FB_, 700, 350, 830, 470, { color: '#FF6B5C', width: 6 });
  const fL1 = G(FB_); T(fL1, 330, 520, '2 hydrogen atoms', { size: 34, weight: 800, anchor: 'middle', fill: AMBER });
  [-30, 30].forEach(x => { const b = mtBall(fL1, 'H', 28); tr(b, 330 + x, 580); });
  const fL2 = G(FB_); T(fL2, 880, 520, 'no number = 1 oxygen', { size: 34, weight: 800, anchor: 'middle', fill: '#FF8A7A' });
  { const b = mtBall(fL2, 'O', 32); tr(b, 880, 582); }
  // CO2
  const CB = G(Lfg);
  const cC = T(CB, 500, 270, 'C', { size: 160, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  const cO = T(CB, 625, 270, 'O', { size: 160, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  const c2 = T(CB, 712, 306, '2', { size: 96, weight: 800, anchor: 'middle', fill: AMBER });
  const eraser = G(CB);
  E('rect', { x: -40, y: -24, width: 80, height: 48, rx: 8, fill: '#FF9FB8', stroke: INK, 'stroke-width': 3 }, eraser);
  E('rect', { x: -40, y: -24, width: 30, height: 48, rx: 8, fill: '#5A7FD8', stroke: INK, 'stroke-width': 3 }, eraser);
  const cmol = G(CB); tr(cmol, 600, 430);
  const cmB1 = E('path', { d: 'M-80,-8 L-30,-8 M-80,8 L-30,8 M30,-8 L80,-8 M30,8 L80,8', stroke: '#FFFFFF', 'stroke-width': 6 }, cmol);
  const cmB2 = E('path', { d: 'M-24,-12 L24,-12 M-24,0 L24,0 M-24,12 L24,12', stroke: '#FFFFFF', 'stroke-width': 5 }, cmol);
  const cmC = mtBall(cmol, 'C', 40), cmO1 = mtBall(cmol, 'O', 40), cmO2 = mtBall(cmol, 'O', 40);
  const cName = G(CB); const cNameT = mtRich(cName, 600, 546, '**CO_2** = carbon dioxide', { size: 36, weight: 700, fill: '#DDE6EE', boldFill: '#FFFFFF' });
  const cStrike = strike(CB, 470, 534, 740, C.bad);
  const cX = cross(CB, 18); tr(cX, 770, 534);
  const cNew = mtChip(Lfg, 'CO = carbon monoxide: a DIFFERENT compound!', { size: 30, color: '#FF8A7A', stroke: '#FF6070' });

  /* =================== split =================== */
  const sticker = G(Lhud);
  E('rect', { x: -96, y: -26, width: 192, height: 52, rx: 8, fill: '#FFE45C', stroke: INK, 'stroke-width': 3 }, sticker);
  T(sticker, 0, -2, 'DO NOT', { size: 20, weight: 800, anchor: 'middle', fill: '#C2453A' });
  T(sticker, 0, 19, 'SEPARATE', { size: 20, weight: 800, anchor: 'middle', fill: '#C2453A' });
  const SP = G(Lfg);
  mtCard(SP, 520, 270, '#7CFFB0');
  T(SP, 0, -64, 'to split a COMPOUND:', { size: 36, weight: 700, anchor: 'middle', fill: C.ink });
  T(SP, 0, 0, 'a CHEMICAL', { size: 48, weight: 800, anchor: 'middle', fill: '#7CFFB0' });
  T(SP, 0, 56, 'REACTION', { size: 48, weight: 800, anchor: 'middle', fill: '#7CFFB0' });
  const notEasy = mtChip(Lfg, 'not easy', { size: 32, color: '#FF8A7A', stroke: '#FF8A7A' });
  const hammer = G(Lhud);
  E('rect', { x: -7, y: -150, width: 14, height: 150, rx: 6, fill: '#B07A45', stroke: INK, 'stroke-width': 3 }, hammer);
  E('rect', { x: -44, y: -184, width: 88, height: 44, rx: 8, fill: ball('#C9D3DC', '#6B7A88'), stroke: INK, 'stroke-width': 4 }, hammer);
  const boing = T(Lhud, 0, 0, 'BOING!', { size: 34, weight: 800, anchor: 'middle', fill: '#FFE45C' });

  /* =================== the cast =================== */
  const arthur = cast(LcastB, 'arthur');
  const nate = cast(LcastF, 'nate'), chloe = cast(LcastF, 'chloe'), sal = cast(LcastF, 'sal');
  const kavya = cast(LcastF, 'kavya', { mood: 'annoyed' });

  /* shots */
  const cut = id => at(id) - 0.06;
  const SH = [['chloe', -1e9], ['toxic', cut('toxic')], ['thchloe', cut('thchloe')], ['def', cut('def')], ['bond', cut('bond')], ['sal', at('sal') - 0.4],
    ['food', cut('food')], ['where', cut('where')], ['props', cut('props')], ['ratio', cut('ratio')], ['water', cut('water')], ['h2o', cut('h2o')],
    ['co2', cut('co2')], ['split', cut('split')], ['happy', cut('happy')]];
  const shotAt = t => { let s = SH[0]; for (const x of SH) if (t >= x[1]) s = x; return s; };
  const FG = [clChip, gasChip, haz, toxChip, factChip, inA, inB, disaster, perfect, count, salChip, DEF, foodChip, bub, PR, prBan, LAT, zoomLines, legNa, legCl, ratioChip, fNaCl,
    hA, hB, oA, wBond, hBoom, oFlame, hChip, oChip, wChip, fire, FB_, CB, cNew, sticker, SP, notEasy, hammer, boing].concat(wDrops);
  const ARTHUR_HOME = [930, 398, 0.95];

  return t => {
    const sid = shotAt(t)[0];
    const agencyOn = sid === 'chloe' || sid === 'toxic';
    const ceremony = sid === 'def' || sid === 'bond' || sid === 'sal';
    const kitchen = sid === 'food' || sid === 'where';
    op(AG, agencyOn ? 1 : 0); op(DF, sid === 'chloe' ? 1 : 0);
    CF.set(sid === 'thchloe' ? 1 : 0, t);
    op(CE, ceremony ? 1 : 0); op(banner, sid === 'def' ? 0 : 1); op(KW, kitchen ? 1 : 0); op(tableF, sid === 'where' ? 1 : 0);
    op(WS, ['props', 'ratio', 'water', 'h2o', 'co2', 'split', 'happy'].includes(sid) ? 1 : 0);
    FG.forEach(g => op(g, 0));
    let cam = { k: 1, cx: 600, cy: 400 };
    const pose = {};
    if (agencyOn) agency.upd(t);

    /* ---------- chloe drifts in ---------- */
    if (sid === 'chloe') {
      const e = P(t, at('chloe') - 0.3, 1.4, easeOut);
      cam = { k: 1, cx: 600, cy: 400 };
      pose.chloe = { w: 1, x: lerp(-220, 220, e), y: 380 + 10 * Math.sin(t * 1.3) * AMP, s: 0.9, r: 4 * Math.sin(t * 0.9) * AMP, mood: t < mid('chloe', 0.5) ? 'neutral' : 'smug', look: 0.5 };
      const sh = t >= at('chloe') + 0.1 && t < mid('chloe', 0.5);
      pose.nate = { w: 1, x: 520, y: 420 - Math.abs(Math.sin(t * 4)) * 10 * AMP, s: 0.82, mood: sh ? 'shock' : 'happy', look: -1 };
      pose.arthur = { w: 1, x: ARTHUR_HOME[0], y: ARTHUR_HOME[1], s: ARTHUR_HOME[2], mood: 'deadpan', look: -1 };
      tr(file, 770, 432 - 6 * Math.abs(Math.sin(t * 2)) * AMP, 1, -8);
      mtPop(clChip, 270, 150, P(t, mid('chloe', 0.36), 0.45, pop));
      mtPop(gasChip, 330, 222, P(t, mid('chloe', 0.56), 0.45, pop));
    }
    ltChloe.set(sid === 'chloe' ? win(t, at('chloe') + 0.6, end('chloe') + 0.4, 0.3) : 0);
    /* ---------- toxic ---------- */
    if (sid === 'toxic') {
      cam = { k: 1.35 + 0.04 * P(t, at('toxic'), 5, linear), cx: 300, cy: 400 };
      pose.chloe = { x: 330, y: 410, s: 1.35, r: 3 * Math.sin(t * 0.9) * AMP, mood: 'deadpan', look: t > end('toxic') ? 0 : 0.2 };
      const camLook = t > end('toxic') + 0.05;
      pose.nate = { x: 1070, y: 500, s: 0.85, mood: t > mid('toxic', 0.2) ? (camLook ? 'neutral' : 'shock') : 'happy', look: camLook ? 0 : -1, sweat: P(t, mid('toxic', 0.3), 0.5, linear) };
      const hp = P(t, mid('toxic', 0.05), 0.45, pop);
      mtPop(haz, 740, 300, hp, 1, 6 * Math.sin(t * 5) * AMP);
      mtPop(toxChip, 740, 480, P(t, mid('toxic', 0.12), 0.45, pop));
      mtPop(factChip, 700, 640, P(t, mid('toxic', 0.74), 0.45, pop));
    }
    /* ---------- thchloe: Arthur's confessional ---------- */
    if (sid === 'thchloe') {
      const k = 1 + 0.03 * P(t, at('thchloe'), 6, linear) + 0.1 * P(t, end('thchloe'), 0.8);
      mtCam(CF, k, 430, 380); cam = { k, cx: 430, cy: 380 };
      const shrug = Math.sin(Math.PI * P(t, mid('thchloe', 0.9), 0.6, linear));
      pose.arthur = { w: 1, x: 430, y: 390 - 22 * shrug, s: 1.5, mood: t > mid('thchloe', 0.88) ? 'smug' : t > mid('thchloe', 0.52) && t < mid('thchloe', 0.75) ? 'annoyed' : 'deadpan', look: t < mid('thchloe', 0.5) ? 0.7 : 0, front: 1 };
      mtPop(inA, 895, 205, P(t, at('thchloe') + 0.05, 0.45, pop));
      tr(bang, 110, 0, 0.9 + 0.15 * Math.sin(t * 9) * AMP);
      mtPop(inB, 895, 420, P(t, mid('thchloe', 0.34), 0.45, pop));
      tr(puffG, -80 + 4 * Math.sin(t * 2), 30);
      const dp = P(t, mid('thchloe', 0.55), 0.35, pop);
      op(disaster, clamp(dp * 3) * (1 - 0.6 * P(t, mid('thchloe', 0.76), 0.3, linear))); tr(disaster, 895, 560, Math.max(0.01, 1.6 - 0.6 * dp), -8);
      mtPop(perfect, 870, 660, P(t, mid('thchloe', 0.76), 0.45, pop));
      op(pfA, 1); op(pfB, P(t, mid('thchloe', 0.91), 0.25, linear)); op(pfH, P(t, mid('thchloe', 0.94), 0.25, linear));
    } else mtCam(CF, 1, 430, 380);
    /* ---------- ceremony: def, bond, sal ---------- */
    if (ceremony) {
      confetti.forEach(c => { const on = sid === 'sal'; op(c.el, on ? 1 : 0); if (on) { const y = ((t - at('sal') + 0.4) * c.v + c.ph * 40) % 760 - 20; tr(c.el, c.x + 16 * Math.sin(t * 2 + c.ph), y, 1, c.sp + t * 200 * AMP); } });
    }
    if (sid === 'def') {
      mtPop(DEF, 600, 420, P(t, at('def') - 0.02, 0.45, pop));
      op(d1, P(t, mid('def', 0.06), 0.3, linear)); op(d2, P(t, mid('def', 0.42), 0.3, linear));
      const bp = P(t, mid('def', 0.48), 0.6, linear);
      attr(dBonds, 'd', bp > 0 ? dBonds.dataset.d : ''); op(dBonds, bp * 0.85);
      op(dWat, P(t, mid('def', 0.5), 0.3, linear));
      op(d3, P(t, mid('def', 0.78), 0.3, linear)); tr(d3, 0, 0, 1);
    }
    if (sid === 'bond') {
      const sl = P(t, mid('bond', 0.25), end('bond') - mid('bond', 0.25), ease);
      pose.nate = { x: lerp(360, 520, sl), y: 450 - Math.abs(Math.sin(t * 6)) * 10 * AMP, s: 0.85, mood: 'happy', look: 1 };
      pose.chloe = { x: lerp(850, 690, sl), y: 440, s: 0.85, mood: t > mid('bond', 0.7) ? 'shock' : 'smug', look: -1 };
      const n = t < mid('bond', 0.77) ? '3' : t < mid('bond', 0.9) ? '2' : '1';
      const ts = t < mid('bond', 0.77) ? mid('bond', 0.33) : t < mid('bond', 0.9) ? mid('bond', 0.77) : mid('bond', 0.9);
      setText(count, n);
      const cp = P(t, ts, 0.3, pop);
      op(count, t > mid('bond', 0.33) ? clamp(cp * 2.5) : 0);
      count.setAttribute('transform', `translate(600 250) scale(${Math.max(0.01, 0.5 + 0.5 * cp).toFixed(3)}) translate(-600 -250)`);
    }
    // white flash: end of 'bond' through the pause, clears on 'sal'
    const fl = Math.min(P(t, end('bond') - 0.05, 0.25, linear), 1 - P(t, at('sal') - 0.35, 0.6, linear));
    op(flash, fl);
    if (sid === 'sal') {
      pose.sal = { x: 600, y: 430, s: 1.15, mood: t < at('sal') ? 'neutral' : 'happy', look: 0 };
      mtPop(salChip, 600, 240, P(t, mid('sal', 0.35), 0.45, pop));
    }
    ltSal.set(sid === 'sal' ? win(t, at('sal') + 0.2, end('sal') + 0.4, 0.3) : 0);
    /* ---------- kitchen: food, where ---------- */
    if (kitchen) kit.upd(t);
    if (sid === 'food') {
      cam = { k: 1.3, cx: 600, cy: 720 };
      mtCam(KW, cam.k, cam.cx, cam.cy);
      op(plate, 1); op(shaker, 1);
      const sh = Math.sin(t * 18) * 8 * AMP;
      tr(shaker, 560 + sh, 380, 1, 170 + sh); op(salt1, 0); op(salt2, 1);
      grains.forEach((g, i) => { const q = ((t - at('food')) * 1.3 + i / 8) % 1; op(g, t > at('food') - 0.1 ? 1 : 0); tr(g, 552 + (i % 3 - 1) * 14 + sh * 0.5, 470 + q * 120, 1, q * 300 + i * 40); });
      pose.sal = { w: 1, x: 990, y: 520, s: 0.82, mood: 'happy', look: -0.8 };
      mtPop(foodChip, 330, 200, P(t, mid('food', 0.2), 0.45, pop));
    } else if (sid === 'where') {
      cam = { k: 1.12, cx: 640, cy: 520 }; mtCam(KW, cam.k, cam.cx, cam.cy); mtCam(tableF, cam.k, cam.cx, cam.cy);
      op(plate, 0); op(shaker, 1);
      tr(shaker, 760 + 3 * Math.sin(t * 2), 430, 1, -10); op(salt1, 1); op(salt2, 0);
      grains.forEach(g => op(g, 0));
      pose.kavya = { w: 1, x: 560, y: 480, s: 1.3, mood: t < mid('where', 0.1) ? 'shock' : 'annoyed', look: 1 };
      mtPop(bub, 930, 210, P(t, mid('where', 0.3), 0.45, pop));
    }
    /* ---------- props ---------- */
    if (sid === 'props') {
      op(PR, 1);
      prCols.forEach((c, i) => mtPop(c.g, c.x, 350, P(t, at('props') + 0.05 + i * 0.25, 0.45, pop)));
      op(prPlus, P(t, at('props') + 0.3, 0.3, linear)); prArr.set(P(t, at('props') + 0.5, 0.4));
      const pf = i => P(t, at('props') + 0.05 + i * 0.25, 0.45, pop);
      pose.nate = { x: 220, y: 290, s: 0.55 * Math.max(0.01, pf(0)), mood: 'happy', look: 1 };
      pose.chloe = { x: 600, y: 290, s: 0.55 * Math.max(0.01, pf(1)), mood: 'smug', look: 1 };
      pose.sal = { x: 975, y: 290, s: 0.55 * Math.max(0.01, pf(2)), mood: 'happy', look: -1 };
      mtPop(prBan, 560, 636, P(t, mid('props', 0.5), 0.45, pop));
      pose.arthur = { x: 1100, y: 650, s: 0.42, mood: 'deadpan', look: -1, front: 1 };
    }
    /* ---------- ratio: Sal's lattice ---------- */
    if (sid === 'ratio' || sid === 'happy') {
      latDots.forEach(d => op(d.el, 1));
    }
    if (sid === 'ratio') {
      const zp = P(t, at('ratio') - 0.05, 0.6, easeOut);
      pose.sal = { x: 240, y: 420, s: 1.15, mood: 'happy', look: 1 };
      const sx = 240 + 1.15 * 96, sy = 400;
      op(LAT, 1); tr(LAT, lerp(sx, 800, zp), lerp(sy, 340, zp), Math.max(0.01, lerp(0.12, 1, zp)));
      attr(zoomLines, 'd', `M${sx},${sy - 60} L${lerp(sx, 800, zp) - 60},${lerp(sy, 340, zp) - 190 * zp} M${sx},${sy + 60} L${lerp(sx, 800, zp) - 60},${lerp(sy, 340, zp) + 190 * zp}`);
      op(zoomLines, 0.6);
      op(tNate, 0); op(tChloe, 0);
      const step = Math.floor(clamp((t - mid('ratio', 0.05)) / (mid('ratio', 0.4) - mid('ratio', 0.05)), 0, 0.999) * 3);
      const pairs = [[-1, -1], [0, 0], [1, 1]];
      op(pairBox, t > mid('ratio', 0.05) && t < mid('ratio', 0.45) ? 1 : 0);
      tr(pairBox, pairs[step][1] * 50 - 0, pairs[step][0] * 50 + (pairs[step][0] % 2 ? 0 : 0));
      mtPop(legNa, 1080, 190, P(t, mid('ratio', 0.03), 0.4, pop));
      mtPop(legCl, 1080, 260, P(t, mid('ratio', 0.18), 0.4, pop));
      mtPop(ratioChip, 800, 600, P(t, mid('ratio', 0.45), 0.45, pop));
      mtPop(fNaCl, 240, 600, P(t, mid('ratio', 0.68), 0.45, pop));
    }
    /* ---------- water ---------- */
    if (sid === 'water') {
      const j = P(t, mid('water', 0.64), 0.6, ease);
      const ox = lerp(960, 600, j), oy = lerp(320, 300, j);
      const h1 = [lerp(240, 600 - 84, j), lerp(270, 300 + 62, j)], h2 = [lerp(240, 600 + 84, j), lerp(390, 300 + 62, j)];
      mtPop(hA, h1[0], h1[1], P(t, mid('water', 0.04), 0.4, pop)); mtPop(hB, h2[0], h2[1], P(t, mid('water', 0.08), 0.4, pop));
      mtPop(oA, ox, oy, P(t, mid('water', 0.4), 0.4, pop));
      op(wBond, j > 0.95 ? 1 : 0); attr(wBond, 'd', `M${h1[0]},${h1[1]} L${ox},${oy} L${h2[0]},${h2[1]}`);
      const bm = win(t, mid('water', 0.2), mid('water', 0.64), 0.2);
      op(hBoom, bm); tr(hBoom, 360, 230, 1 + 0.1 * Math.sin(t * 12) * AMP);
      const of = win(t, mid('water', 0.44), mid('water', 0.64), 0.2);
      op(oFlame, of); tr(oFlame, 1060, 250, 1 + 0.08 * Math.sin(t * 10) * AMP);
      op(hChip, win(t, mid('water', 0.18), mid('water', 0.64), 0.25)); tr(hChip, 260, 490);
      op(oChip, win(t, mid('water', 0.43), mid('water', 0.64), 0.25)); tr(oChip, 930, 490);
      mtPop(wChip, 600, 150, P(t, mid('water', 0.72), 0.45, pop));
      // the fire goes out
      op(fire, 1);
      const out = P(t, mid('water', 0.86), 0.7, ease);
      flames.forEach(({ f, x, s }, i) => tr(f, x, 0, Math.max(0.01, s * (1 - out) * (1 + 0.1 * Math.sin(t * 13 + i * 2) * AMP))));
      steam.forEach((st, i) => { const q = ((t - mid('water', 0.86)) * 0.8 + i / 3) % 1; op(st, out > 0.2 ? 0.7 * Math.sin(q * Math.PI) : 0); tr(st, -40 + i * 40, -30 - q * 60); });
      op(hiss, out > 0.3 ? 1 : 0);
      wDrops.forEach((d, i) => { const q = ((t - mid('water', 0.8)) * 1.6 + i / 4) % 1; op(d, t > mid('water', 0.8) && t < end('water') + 0.2 ? 1 : 0); tr(d, 570 + i * 20, 380 + q * 190); });
      pose.arthur = null;
    }
    /* ---------- h2o ---------- */
    if (sid === 'h2o') {
      op(FB_, 1);
      [fH, f2, fO].forEach((x, i) => op(x, P(t, at('h2o') + 0.4 + i * 0.25, 0.25, linear)));
      const arc = P(t, mid('h2o', 0.24), 0.4, linear);
      op(fArc, arc); op(fArcHd, arc); op(fArcT, P(t, mid('h2o', 0.3), 0.3, linear));
      fA1.set(P(t, mid('h2o', 0.56), 0.4)); op(fL1, P(t, mid('h2o', 0.6), 0.3, linear));
      fA2.set(P(t, mid('h2o', 0.74), 0.4)); op(fL2, P(t, mid('h2o', 0.77), 0.3, linear));
      pose.arthur = { x: 1100, y: 650, s: 0.42, mood: 'deadpan', look: -1, front: 1 };
    }
    /* ---------- co2 ---------- */
    if (sid === 'co2') {
      op(CB, 1);
      const er = P(t, mid('co2', 0.36), 0.8, linear);
      op(c2, 1 - P(t, mid('co2', 0.42), 0.5, linear));
      op(eraser, er > 0 && er < 1 ? 1 : 0); tr(eraser, 712 + 22 * Math.sin(er * 30), 290, 1, -20);
      const go = P(t, mid('co2', 0.5), 0.5, ease);
      tr(cmC, lerp(0, -50, go), 0);
      op(cmO1, 1 - go); tr(cmO1, lerp(-104, -220, go), lerp(0, -40, go));
      tr(cmO2, lerp(104, 50, go), 0);
      op(cmB1, 1 - P(t, mid('co2', 0.5), 0.2, linear)); op(cmB2, P(t, mid('co2', 0.6), 0.3, linear)); tr(cmB2, 0, 0);
      op(cName, 1); cStrike.set(P(t, mid('co2', 0.6), 0.35)); op(cX, P(t, mid('co2', 0.66), 0.2, linear));
      mtPop(cNew, 560, 640, P(t, mid('co2', 0.64), 0.45, pop));
      pose.arthur = { x: 1110, y: 640, s: 0.4, mood: 'deadpan', look: -1, front: 1 };
    }
    /* ---------- split ---------- */
    if (sid === 'split') {
      pose.sal = { x: 360, y: 430, s: 1.3, mood: t > mid('split', 0.86) ? 'smug' : 'neutral', look: 1 };
      mtPop(sticker, 344, 530, P(t, at('split') + 0.1, 0.4, pop), 1, -8);
      mtPop(SP, 860, 300, P(t, mid('split', 0.12), 0.45, pop));
      // a hammer bounces off Sal: not easy
      const hb = P(t, mid('split', 0.82), 0.7, linear);
      op(hammer, hb > 0 && hb < 1 ? 1 : 0);
      const hy = hb < 0.4 ? lerp(-60, 250, hb / 0.4) : 250 - 200 * Math.sin(Math.PI * (hb - 0.4) / 0.6);
      tr(hammer, 360 + (hb > 0.4 ? (hb - 0.4) * 500 : 0), hy + 150, 1, hb > 0.4 ? (hb - 0.4) * 600 : 180);
      op(boing, win(t, mid('split', 0.86), end('split') + 0.2, 0.15)); tr(boing, 560, 240);
      mtPop(notEasy, 860, 500, P(t, mid('split', 0.86), 0.45, pop));
      pose.arthur = { x: 1080, y: 630, s: 0.48, mood: 'deadpan', look: -1, front: 1 };
    }
    /* ---------- happy: tiny faces wave from inside the lattice ---------- */
    if (sid === 'happy') {
      pose.sal = { x: 330, y: 430, s: 1.5, mood: 'happy', look: t > end('happy') + 0.3 ? 0 : 0.6 };
      const zp = P(t, at('happy') + 0.1, 0.5, easeOut);
      const sx = 330 + 1.5 * 96, sy = 400;
      op(LAT, 1); tr(LAT, lerp(sx, 860, zp), lerp(sy, 360, zp), Math.max(0.01, lerp(0.1, 0.95, zp)));
      attr(zoomLines, 'd', `M${sx},${sy - 70} L${lerp(sx, 860, zp) - 50},${lerp(sy, 360, zp) - 185 * zp} M${sx},${sy + 70} L${lerp(sx, 860, zp) - 50},${lerp(sy, 360, zp) + 185 * zp}`);
      op(zoomLines, 0.6); op(pairBox, 0);
      latDots.forEach(d => op(d.el, (d.i === 0 && d.j === -1) || (d.i === 0 && d.j === 0) ? 0 : 1));
      const fp = P(t, mid('happy', 0.5), 0.4, pop);
      op(tNate, clamp(fp * 2.5)); tr(tNate, -50, 0, Math.max(0.01, 1.45 * fp));
      op(tChloe, clamp(fp * 2.5)); tr(tChloe, 8, 0, Math.max(0.01, 1.45 * fp));
      attr(tNate.hand, 'cx', -26 + 4 * Math.sin(t * 14)); attr(tNate.hand, 'cy', 14 - 10 * Math.abs(Math.sin(t * 7)));
      attr(tChloe.hand, 'cx', 28 + 4 * Math.sin(t * 14 + 1)); attr(tChloe.hand, 'cy', 14 - 10 * Math.abs(Math.sin(t * 7 + 1)));
    }

    /* ---------- camera + cast ---------- */
    if (agencyOn) { mtCam(AG, cam.k, cam.cx, cam.cy); mtCam(DF, cam.k, cam.cx, cam.cy); }
    const A = pose.arthur;
    const wantFront = A && A.front;
    if (wantFront && arthur.parentNode !== LcastF) LcastF.appendChild(arthur);
    if (!wantFront && arthur.parentNode !== LcastB) LcastB.appendChild(arthur);
    const apply = (ch, who, p) => {
      if (!p) { op(ch, 0); return; }
      op(ch, p.dim ? 0.35 : 1);
      if (p.w) mtPlace(ch, cam, p.x, p.y, p.s, p.r || 0); else tr(ch, p.x, p.y, p.s, p.r || 0);
      ch.set({ t, talk: scTalk(S, t, who), mood: p.mood, look: p.look, sweat: p.sweat || 0 });
    };
    apply(arthur, 'arthur', A); apply(nate, 'nate', pose.nate); apply(chloe, 'chloe', pose.chloe); apply(sal, 'sal', pose.sal); apply(kavya, 'kavya', pose.kavya);
  };
});
