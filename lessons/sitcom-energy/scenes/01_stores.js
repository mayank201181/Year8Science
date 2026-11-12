/* EVERY JOULE COUNTS, scene 1: "The eight departments".
   Shots (hard sitcom cuts): office (case file 1, Jules bursts in) -> Constance confessional (an apple lifted
   1 m = about 1 J) -> office two-shot (Jules's "BEST DAY" photo) -> Constance at the ledger (1 kJ = 1000 J)
   -> the crowded banana (400 kJ) -> Constance, deadpan -> the corridor of eight store departments (overview)
   -> the tour: doors open in pairs (kinetic, gravitational, Gerald on the high shelf, elastic, chemical,
   thermal, nuclear, electrostatic, magnetic) -> Jules's mnemonic -> Constance confessional (the gorillas photo)
   -> Kavya at home: "where's electricity? light? heat?" -> Constance: "Not stores." (stamp). */
scene('stores', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;
  const INK = SC_INK;

  /* ---------- local helpers (prefixed st) ---------- */
  const stPop = (el, x, y, p, s0, r) => { op(el, clamp(p * 2.5)); tr(el, x, y, Math.max(0.01, (s0 || 1) * (0.7 + 0.3 * p)), r); };
  // pill with **bold** segments (bold in o.boldFill), centred at (0,0)
  function stChip(parent, str, o) {
    o = o || {};
    const size = o.size || 30, h = Math.round(size * 1.75), g = G(parent);
    const w = Math.ceil(textWidth(str, size, FD, 800) * 1.04 + size * 1.4);
    E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: o.rx !== undefined ? o.rx : h / 2, fill: o.fill || 'rgba(10,27,39,0.9)', stroke: o.stroke || 'none', 'stroke-width': o.sw || 3 }, g);
    T(g, 0, size * 0.35, str, { size, weight: 700, anchor: 'middle', fill: o.color || C.ink, boldFill: o.boldFill });
    g.w = w; g.h = h;
    return g;
  }
  // a time value that makes a cast member blink only inside the windows [tb, tb + 0.13]
  function stBlinkT(t, seed, tbs, hold) {
    const period = 3.1 + (seed % 5) * 0.37, base = seed * 0.71, n = period * Math.ceil(base / period + 1);
    for (const tb of tbs) if (t >= tb && t < tb + 0.13) return (t - tb) - base + n;
    return (hold === undefined ? 1.5 : hold) - base + n;
  }
  const stCam = (g, fx, fy, k) => g.setAttribute('transform', Math.abs(k - 1) < 1e-4 && fx === 600 && fy === 375 ? '' : `translate(600 375) scale(${k.toFixed(4)}) translate(${(-fx).toFixed(1)} ${(-fy).toFixed(1)})`);
  const stPush = (g, k, fx, fy) => g.setAttribute('transform', Math.abs(k - 1) < 1e-4 ? '' : `translate(${fx} ${fy}) scale(${k.toFixed(4)}) translate(${-fx} ${-fy})`);
  // a tiny Jules face (coin with eyes and grin) for the crowded banana
  function stFace(parent, r) {
    const g = G(parent);
    E('circle', { r, fill: ball('#FFE45C', '#D49A12'), stroke: INK, 'stroke-width': 2 }, g);
    E('path', { d: `M${-r * 0.38},${-r * 0.2} l0,${r * 0.2} M${r * 0.38},${-r * 0.2} l0,${r * 0.2} M${-r * 0.45},${r * 0.25} Q0,${r * 0.75} ${r * 0.45},${r * 0.25}`, fill: 'none', stroke: INK, 'stroke-width': 2.4, 'stroke-linecap': 'round' }, g);
    return g;
  }
  // a store card: name (store colour), optional second line, description
  function stCard(parent, st, l2, desc) {
    const g = G(parent), W0 = 320;
    const nameSize = Math.min(36, Math.floor(36 * 280 / Math.max(1, textWidth(st.name, 36, FD, 800))));
    let y = -40;
    const rows = [[st.name, nameSize, st.col, 800]];
    if (l2) rows.push([l2, 30, st.col, 800]);
    rows.push([desc, 28, C.ink, 600]);
    const hgt = rows.length * 44 + 34;
    E('rect', { x: -W0 / 2, y: -hgt / 2, width: W0, height: hgt, rx: 16, fill: 'rgba(8,22,20,0.93)', stroke: st.col, 'stroke-width': 4 }, g);
    y = -hgt / 2 + 50;
    rows.forEach(([s, size, col, wt]) => { T(g, 0, y, s, { size, weight: wt, anchor: 'middle', fill: col, boldFill: st.col }); y += 44; });
    return g;
  }

  /* ---------- layers: one camera for the whole frame, HUD outside it ---------- */
  const CAM = G(root), Lbg = G(CAM), Lmid = G(CAM), Lcast = G(CAM), Lfg = G(CAM), Lhud = G(root);

  /* =================== SETS =================== */
  const OFF = G(Lbg); enOffice(OFF);
  const CONF = enConf(Lbg, 'con');
  const FLAT = G(Lbg); const flat = enFlat(FLAT);
  const DOORS = G(Lbg); const doors = enDoors(DOORS); const dIn = doors.inner;
  const MN = G(Lbg);     // mnemonic chant backdrop
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#3A2A08', '#1E1604', true) }, MN);
  let mnRays = ''; for (let i = 0; i < 14; i++) { const a0 = i / 14 * TAU, a1 = a0 + TAU / 34; mnRays += `M0,0 L${(Math.cos(a0) * 1300).toFixed(0)},${(Math.sin(a0) * 1300).toFixed(0)} L${(Math.cos(a1) * 1300).toFixed(0)},${(Math.sin(a1) * 1300).toFixed(0)} Z `; }
  const mnRayP = E('path', { d: mnRays, fill: '#FFE45C', opacity: 0.08 }, MN);
  const BAN = G(Lbg);    // banana close-up backdrop (a kitchen-counter close-up)
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#FFF1C9', '#F2D58A', true) }, BAN);
  E('rect', { x: 0, y: 560, width: 1200, height: 190, fill: '#C98E55' }, BAN);
  E('rect', { x: 0, y: 552, width: 1200, height: 14, fill: '#A86E3A' }, BAN);
  E('ellipse', { cx: 470, cy: 440, rx: 420, ry: 240, fill: glow('#FFFFFF'), opacity: 0.5 }, BAN);

  /* --- corridor additions: extend the floor past both ends, door interiors, Gerald --- */
  const dGroups = [...dIn.children].filter(e => e.tagName === 'g');
  { const ext = G(dIn); dIn.insertBefore(ext, dIn.firstChild);
    [[-900, 700], [2600, 700]].forEach(([x, w]) => { E('rect', { x, y: 0, width: w, height: 750, fill: linGrad('#1E4A48', '#123030', true) }, ext); E('rect', { x, y: 600, width: w, height: 150, fill: '#2A1F1A' }, ext); }); }
  const clipId = 'stDoorClip';
  { const cp = E('clipPath', { id: clipId }, defs()); E('rect', { x: -70, y: 258, width: 140, height: 352 }, cp); }
  const inside = dGroups.slice(0, 8).map(d => { const c = G(d, { 'clip-path': `url(#${clipId})` }); d.insertBefore(c, d.lastChild); return c; });
  // 0 kinetic: a ball whizzing across with speed lines
  const kBall = G(inside[0]);
  E('path', { d: 'M-40,-14 L-90,-14 M-46,0 L-110,0 M-40,14 L-90,14', stroke: '#FFFFFF', 'stroke-width': 5, 'stroke-linecap': 'round', opacity: 0.8 }, kBall);
  E('circle', { r: 22, fill: ball('#FF6B5C', '#B5372D'), stroke: INK, 'stroke-width': 3 }, kBall);
  // 1 gravitational: a book on a high shelf, a height arrow
  E('rect', { x: -66, y: 336, width: 92, height: 10, fill: '#8B5A2B', stroke: '#5A3A1A', 'stroke-width': 2 }, inside[1]);
  E('rect', { x: -52, y: 290, width: 44, height: 46, rx: 3, fill: ball('#5B8DEF', '#2E5BB8'), stroke: INK, 'stroke-width': 3 }, inside[1]);
  E('rect', { x: -52, y: 290, width: 9, height: 46, fill: '#2E5BB8' }, inside[1]);
  { const a = arrow(inside[1], 46, 596, 46, 350, { color: '#FFFFFF', width: 4 }); a.set(1); }
  E('line', { x1: 20, y1: 600, x2: 70, y2: 600, stroke: '#FFFFFF', 'stroke-width': 4 }, inside[1]);
  // 2 elastic: a spring squashing and stretching against a block
  E('rect', { x: -70, y: 380, width: 10, height: 100, fill: '#8F9CAB' }, inside[2]);
  const spr = E('path', { d: '', fill: 'none', stroke: '#2C8C4C', 'stroke-width': 6, 'stroke-linejoin': 'round' }, inside[2]);
  const sprB = E('rect', { x: 0, y: 404, width: 34, height: 52, rx: 4, fill: '#56D69B', stroke: INK, 'stroke-width': 3 }, inside[2]);
  // 3 chemical: food, a fuel can, a battery
  { const g = inside[3];
    E('circle', { cx: 0, cy: 330, r: 26, fill: ball('#FF6B5C', '#B5372D'), stroke: INK, 'stroke-width': 3 }, g);
    E('path', { d: 'M0,304 L4,292 M4,296 Q18,286 22,296 Q12,302 4,296 Z', fill: '#5BBF6A', stroke: INK, 'stroke-width': 2 }, g);
    E('path', { d: 'M-30,410 L22,410 L30,420 L30,476 L-30,476 Z', fill: '#E8424F', stroke: INK, 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
    E('path', { d: 'M18,410 L26,394 L36,398', fill: 'none', stroke: INK, 'stroke-width': 5 }, g);
    E('path', { d: 'M-18,424 L14,462 M14,424 L-18,462', stroke: '#FFC247', 'stroke-width': 4 }, g);
    E('rect', { x: -32, y: 520, width: 58, height: 34, rx: 5, fill: ball('#FFC247', '#B57B12'), stroke: INK, 'stroke-width': 3 }, g);
    E('rect', { x: 26, y: 530, width: 8, height: 14, fill: '#E6EEF4', stroke: INK, 'stroke-width': 2 }, g);
    T(g, -4, 547, '+', { size: 26, weight: 800, anchor: 'middle', fill: INK }); }
  // 4 thermal: a warm glow with jiggling particles
  E('ellipse', { cx: 0, cy: 440, rx: 110, ry: 190, fill: glow('#FF8A3D'), opacity: 0.85 }, inside[4]);
  const thDots = [];
  for (let i = 0; i < 9; i++) thDots.push({ e: E('circle', { r: 10, fill: ball('#FFB27A', '#E0601E') }, inside[4]), x: -42 + (i % 3) * 42, y: 320 + Math.floor(i / 3) * 70, ph: i * 1.7 });
  // 5 nuclear: an atom, the nucleus glows
  const nuc = G(inside[5]); tr(nuc, 0, 430);
  const nucGlow = E('circle', { r: 44, fill: glow('#FFE45C') }, nuc);
  const orb = G(nuc);
  [0, 60, 120].forEach(a => E('ellipse', { rx: 58, ry: 20, fill: 'none', stroke: '#B48CFF', 'stroke-width': 4, transform: `rotate(${a})` }, orb));
  [[-6, -5, '#FF6B5C'], [6, -4, '#8F9CAB'], [0, 6, '#FF6B5C'], [-7, 7, '#8F9CAB']].forEach(([x, y, c]) => E('circle', { cx: x, cy: y, r: 8, fill: c, stroke: INK, 'stroke-width': 2 }, nuc));
  const elec = E('circle', { r: 6, fill: '#4CC9F0', stroke: INK, 'stroke-width': 2 }, nuc);
  // 6 electrostatic: a charged balloon and a lifting hair strand
  { const g = inside[6];
    E('path', { d: 'M0,416 Q-8,440 4,470', fill: 'none', stroke: '#C9D3DC', 'stroke-width': 3 }, g);
    E('ellipse', { cx: 0, cy: 360, rx: 44, ry: 54, fill: ball('#4CC9F0', '#1D84A6'), stroke: INK, 'stroke-width': 3 }, g);
    E('path', { d: 'M-6,414 L6,414 L0,422 Z', fill: '#1D84A6' }, g);
    T(g, -14, 352, '+', { size: 30, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
    T(g, 16, 378, '+', { size: 30, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
    E('circle', { cx: 0, cy: 590, r: 40, fill: '#B9784E', stroke: INK, 'stroke-width': 3 }, g);
    E('path', { d: 'M-40,586 Q-38,546 0,546 Q38,546 40,586 Q20,566 0,566 Q-20,566 -40,586 Z', fill: '#1E1410' }, g); }
  const hair = E('path', { d: '', fill: 'none', stroke: '#1E1410', 'stroke-width': 4, 'stroke-linecap': 'round' }, inside[6]);
  const hairM = T(inside[6], 30, 528, '−', { size: 30, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  // 7 magnetic: two magnets pulling together
  const magA = magnet(inside[7], 60, 26), magB = magnet(inside[7], 60, 26);
  // Gerald on the high shelf beside GRAVITATIONAL
  const gerald = cast(dIn, 'gerald', { s: 0.42 }); tr(gerald, doors.shelf[0], doors.shelf[1] + 22, 0.46);

  /* =================== MID-LAYER PROPS (cards, photos, boards) =================== */
  // case file 1
  const folder = G(Lmid);
  E('rect', { x: -200, y: -120, width: 400, height: 240, rx: 10, fill: '#E8C77A', stroke: '#9C7A2E', 'stroke-width': 4 }, folder);
  E('path', { d: 'M-200,-110 L-200,-138 Q-200,-146 -192,-146 L-80,-146 Q-70,-146 -66,-136 L-60,-120 Z', fill: '#E8C77A', stroke: '#9C7A2E', 'stroke-width': 4 }, folder);
  T(folder, 0, -46, 'CASE FILE 1', { size: 44, weight: 800, anchor: 'middle', fill: '#5A3A1A', ls: 2 });
  T(folder, -160, 18, 'Case 14: the missing joules', { size: 26, weight: 600, fill: '#5A3A1A', font: FB });
  const fWit = T(folder, -160, 70, 'Witnesses: **1**', { size: 30, weight: 700, fill: '#8A2A1A', boldFill: '#C62828' });

  // confessional inset 1: an apple lifted 1 m
  const apIn = G(Lmid);
  card(apIn, 660, 120, 480, 470, { fill: 'rgba(8,22,20,0.92)', stroke: '#E2B33C', sw: 4 });
  T(apIn, 900, 172, 'ONE JOULE', { size: 36, weight: 800, anchor: 'middle', fill: '#FFE45C', ls: 2 });
  const apStick = G(apIn);
  E('rect', { x: 716, y: 220, width: 30, height: 320, fill: '#F2C14E', stroke: INK, 'stroke-width': 3 }, apStick);
  { let d = ''; for (let i = 0; i <= 10; i++) d += `M716,${220 + i * 32} l${i % 5 ? 10 : 18},0 `; E('path', { d, stroke: INK, 'stroke-width': 2.5 }, apStick); }
  T(apStick, 770, 390, '1 m', { size: 34, weight: 800, fill: '#FFFFFF' });
  E('path', { d: 'M762,226 L780,226 M771,226 L771,534 M762,534 L780,534', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 3 }, apStick);
  const apple = G(apIn);
  E('circle', { r: 24, fill: ball('#FF6B5C', '#B5372D'), stroke: INK, 'stroke-width': 3 }, apple);
  E('path', { d: 'M0,-24 L3,-34 M3,-30 Q15,-40 19,-30 Q9,-25 3,-30 Z', fill: '#5BBF6A', stroke: INK, 'stroke-width': 2 }, apple);
  const apArrow = arrow(apIn, 860, 520, 860, 250, { color: '#56D69B', width: 6 });
  const apJ = T(apIn, 990, 330, '≈ 1 J', { size: 64, weight: 800, anchor: 'middle', fill: '#FFE45C' });
  const apTiny = T(apIn, 990, 400, 'a small apple', { size: 28, weight: 600, anchor: 'middle', fill: C.ink });
  const apTiny2 = T(apIn, 990, 440, 'up by one metre', { size: 28, weight: 600, anchor: 'middle', fill: C.ink });
  const apSmall = stChip(apIn, 'a joule is **tiny**', { size: 30, boldFill: '#FFE45C' }); tr(apSmall, 990, 500);

  // "BEST DAY" photo of Jules lifting an apple
  const best = G(Lmid);
  { E('rect', { x: -140, y: -170, width: 280, height: 330, rx: 8, fill: '#C9963A', stroke: '#7A5A1E', 'stroke-width': 6 }, best);
    E('rect', { x: -120, y: -150, width: 240, height: 240, fill: linGrad('#9FD8FF', '#E9F6FF', true) }, best);
    E('rect', { x: -120, y: 50, width: 240, height: 40, fill: '#7FC77A' }, best);
    const mj = cast(best, 'jules', { s: 0.6 }); tr(mj, 0, 14, 0.6); best.mj = mj;
    const ap = G(best); tr(ap, 0, -116);
    E('circle', { r: 20, fill: ball('#FF6B5C', '#B5372D'), stroke: INK, 'stroke-width': 3 }, ap);
    E('path', { d: 'M0,-20 L2,-28', stroke: INK, 'stroke-width': 3 }, ap);
    E('rect', { x: -84, y: 104, width: 168, height: 44, rx: 6, fill: '#F4EBD3', stroke: '#7A5A1E', 'stroke-width': 3 }, best);
    T(best, 0, 136, 'BEST DAY', { size: 28, weight: 800, anchor: 'middle', fill: '#8A2A1A', ls: 2 }); }

  // kilojoules ledger
  const kb = G(Lmid);
  enBoard(kb, 560, 420, 'KILOJOULES');
  T(kb, 0, -60, '**1 kJ** = 1000 J', { size: 62, weight: 700, anchor: 'middle', fill: INK, boldFill: '#C48A0A' });
  const kBox = G(kb); tr(kBox, -70, 120);
  E('rect', { x: -95, y: -50, width: 190, height: 100, rx: 10, fill: '#FFE9A8', stroke: '#B8902C', 'stroke-width': 5 }, kBox);
  const kFill = E('rect', { x: -89, y: 44, width: 178, height: 0, rx: 6, fill: ball('#FFE45C', '#D49A12') }, kBox);
  T(kBox, 0, 14, 'kJ', { size: 44, weight: 800, anchor: 'middle', fill: '#8A6508' });
  const kCnt = T(kb, 150, 126, '0 J', { size: 40, weight: 800, anchor: 'middle', fill: '#8A6508' });
  T(kb, 150, 168, 'poured in', { size: 26, weight: 600, anchor: 'middle', fill: '#5A5446', font: FB });
  const kCoins = [];
  { const r = rng(14); for (let i = 0; i < 16; i++) kCoins.push({ e: E('circle', { r: 10, fill: ball('#FFE45C', '#D49A12'), stroke: '#8A6508', 'stroke-width': 2 }, kb), x: -140 + r() * 140, ph: r() }); }

  // the crowded banana
  const ban = G(Lmid); tr(ban, 470, 420);
  const banIn = G(ban);
  E('path', { d: 'M-330,-90 Q0,262 330,-110 Q0,40 -330,-90 Z', fill: ball('#FFE14D', '#E0B21C'), stroke: INK, 'stroke-width': 6, 'stroke-linejoin': 'round' }, banIn);
  E('path', { d: 'M-300,-70 Q0,190 300,-88', fill: 'none', stroke: '#C99A12', 'stroke-width': 4, opacity: 0.6 }, banIn);
  E('circle', { cx: -330, cy: -90, r: 12, fill: '#5A3A1A' }, banIn);
  E('path', { d: 'M330,-110 L356,-136 L366,-126 L340,-100 Z', fill: '#6B8E3A', stroke: INK, 'stroke-width': 3 }, banIn);
  const cutId = 'stBanCut';
  { const cp = E('clipPath', { id: cutId }, defs()); E('ellipse', { cx: 0, cy: 34, rx: 210, ry: 52 }, cp); }
  E('ellipse', { cx: 0, cy: 34, rx: 214, ry: 56, fill: '#FFF3C4', stroke: '#C99A12', 'stroke-width': 4 }, banIn);
  const banFaces = G(banIn, { 'clip-path': `url(#${cutId})` }), faces = [];
  for (let row = 0; row < 3; row++) for (let i = 0; i < 5; i++) { const f = stFace(banFaces, 17); faces.push({ f, x: -176 + i * 84 + (row % 2) * 40, y: 2 + row * 30, ph: row * 2.1 + i * 0.9 }); }
  const banJ = T(Lmid, 860, 200, '≈ 400 000 J', { size: 62, weight: 800, anchor: 'middle', fill: '#8A5A00' });
  const banK = T(Lmid, 860, 262, '(400 kJ)', { size: 44, weight: 800, anchor: 'middle', fill: '#C48A0A' });
  const banC = stChip(Lmid, 'a very crowded banana', { size: 30, fill: '#5A3A1A', color: '#FFF3C4' });

  // corridor overview titles
  const ovT = stChip(Lfg, '**8** ENERGY STORES', { size: 46, fill: 'rgba(8,22,20,0.94)', stroke: '#FFE45C', boldFill: '#FFE45C' });
  const ovT2 = stChip(Lfg, 'every joule is always in one of them', { size: 30, fill: 'rgba(8,22,20,0.9)', color: C.ink });
  const ovT3 = stChip(Lfg, 'a department for each', { size: 30, fill: 'rgba(8,22,20,0.9)', color: '#FFE45C' });
  // store cards beside the open doors
  const CARD = [
    ['', 'anything **moving**'], ['POTENTIAL', 'anything **high up**'], ['POTENTIAL', 'stretched or squashed'], ['', 'food, fuels, batteries'],
    ['', 'warm: particles **jiggle**'], ['', 'in the **nucleus**'], ['', 'charges attract or repel'], ['', 'magnets attract or repel'],
  ].map(([l2, d], i) => stCard(Lfg, EN_STORES[i], l2, d));
  const gChip = stChip(Lfg, 'lots of **gravitational potential**', { size: 32, fill: 'rgba(8,22,20,0.92)', stroke: '#5B8DEF', boldFill: '#8FB4FF' });

  // mnemonic: eight icons drop into a row, initials and the sentence build
  const mn = G(Lfg);
  const MNW = ['Kind', 'Gorillas', 'Eat', 'Chocolate,', 'Tigers', 'Never', 'Eat', 'Mango!'];
  const mnSlots = EN_STORES.map((st, i) => {
    const g = G(mn), ic = G(g);
    E('circle', { r: 50, fill: '#0B1F1A', stroke: st.col, 'stroke-width': 5 }, ic);
    enStoreIcon(ic, st.k, 0.72);
    const L = G(g); T(L, 0, 22, st.name[0], { size: 64, weight: 800, anchor: 'middle', fill: st.col });
    return { g, ic, L, x: 130 + i * 134 };
  });
  const mnWords = [];
  { const size = 46, sp = size * 0.3;
    [[0, 4, 470], [4, 8, 545]].forEach(([a, b, y]) => {
      const ws = MNW.slice(a, b).map(w => textWidth(w, size, FD, 700) + 2);
      let x = 470 - (ws.reduce((s, w) => s + w, 0) + sp * (ws.length - 1)) / 2;
      ws.forEach((w, j) => { const i = a + j; const word = MNW[i]; mnWords.push(T(mn, x, y, `**${word[0]}**${word.slice(1)}`, { size, weight: 700, fill: '#FFF7C2', boldFill: EN_STORES[i].col })); x += w + sp; });
    }); }

  // gorillas photo (Constance's confessional)
  const gor = G(Lmid);
  { const p = G(gor);
    E('rect', { x: -200, y: -180, width: 400, height: 360, rx: 6, fill: '#FBF8F0', stroke: '#C9C2B0', 'stroke-width': 3 }, p);
    const gid = 'stGorClip'; { const cp = E('clipPath', { id: gid }, defs()); E('rect', { x: -180, y: -160, width: 360, height: 250 }, cp); }
    const ph = G(p, { 'clip-path': `url(#${gid})` });
    E('rect', { x: -180, y: -160, width: 360, height: 250, fill: linGrad('#5BBF6A', '#2C6E3C', true) }, ph);
    E('path', { d: 'M-180,-60 Q-120,-120 -60,-70 Q0,-130 60,-70 Q120,-120 180,-60 L180,-160 L-180,-160 Z', fill: '#2C8C4C', opacity: 0.7 }, ph);
    E('rect', { x: -180, y: 60, width: 360, height: 40, fill: '#6B8E3A' }, ph);
    [-108, 108].forEach((gx, gi) => {
      const g = G(ph); tr(g, gx, 30, 1, gi ? 4 : -4);
      E('ellipse', { cx: 0, cy: 10, rx: 58, ry: 62, fill: '#3A3A42', stroke: INK, 'stroke-width': 3 }, g);
      E('circle', { cx: 0, cy: -58, r: 36, fill: '#3A3A42', stroke: INK, 'stroke-width': 3 }, g);
      E('ellipse', { cx: 0, cy: -50, rx: 25, ry: 20, fill: '#8A7F7A' }, g);
      E('path', { d: 'M-17,-64 L-5,-64 M5,-64 L17,-64 M-8,-40 L8,-40', stroke: INK, 'stroke-width': 4, 'stroke-linecap': 'round' }, g);
      const bar = G(g); tr(bar, gi ? -34 : 34, -20, 1, gi ? 20 : -20);
      E('rect', { x: -12, y: -26, width: 24, height: 46, rx: 3, fill: '#6B3A1E', stroke: INK, 'stroke-width': 2 }, bar);
      E('rect', { x: -12, y: -26, width: 24, height: 16, fill: '#C9D3DC', stroke: INK, 'stroke-width': 2 }, bar);
    });
    const mj = cast(ph, 'jules', { s: 0.55, mood: 'happy' }); tr(mj, 0, 40, 0.55); gor.mj = mj;
    const sign = G(ph); tr(sign, 0, -100);
    E('path', { d: 'M-40,26 L-40,60 M40,26 L40,60', stroke: '#8B5A2B', 'stroke-width': 5 }, sign);
    E('rect', { x: -112, y: -26, width: 224, height: 52, rx: 6, fill: '#FFFFFF', stroke: INK, 'stroke-width': 3 }, sign);
    T(sign, 0, 10, 'K G E C T N E M', { size: 26, weight: 800, anchor: 'middle', fill: INK });
    T(p, 0, 140, 'he told the gorillas', { size: 30, weight: 700, anchor: 'middle', fill: '#5A5446' }); }

  // Kavya's three questions, and the stamp
  const QS = [['electricity?', '#FFE45C'], ['light?', '#B48CFF'], ['heat?', '#FF8A3D']].map(([s, c]) => stChip(Lfg, s, { size: 40, fill: 'rgba(10,27,39,0.92)', stroke: c, color: c }));
  const stampNS = enStamp(Lfg, 'NOT STORES');

  /* =================== CAST =================== */
  const con = cast(Lcast, 'con');
  const jul = cast(Lcast, 'jules');
  const kav = cast(Lcast, 'kavya');
  const kArm = G(kav.firstChild);   // Kavya's raised hand
  E('path', { d: 'M-66,92 L-118,-6', stroke: '#2E7DD8', 'stroke-width': 34, 'stroke-linecap': 'round' }, kArm);
  E('path', { d: 'M-118,-6 L-146,-118', stroke: '#B9784E', 'stroke-width': 24, 'stroke-linecap': 'round' }, kArm);
  E('path', { d: 'M-160,-130 L-162,-170 M-150,-134 L-148,-178 M-140,-132 L-134,-172 M-132,-124 L-120,-156', stroke: '#B9784E', 'stroke-width': 11, 'stroke-linecap': 'round' }, kArm);
  E('circle', { cx: -147, cy: -130, r: 20, fill: '#B9784E' }, kArm);
  const sparks = [0, 1, 2, 3].map(i => spark(Lfg, 16, { seed: i + 2 }));
  const hiChip = stChip(Lfg, 'energy is measured in **joules (J)**', { size: 36, fill: 'rgba(10,27,39,0.92)', stroke: '#FFE45C', boldFill: '#FFE45C' });

  /* =================== HUD =================== */
  const ltJ = scLowerThird(Lhud, 'JULES', 'One joule. Unit of energy.');

  /* =================== SHOTS =================== */
  const SH = [
    ['office1', -1e9, 'office'],
    ['thjules', at('thjules') - 0.06, 'conf'],
    ['apple', at('apple') - 0.06, 'office'],
    ['kilo', end('apple') + 0.06, 'office'],
    ['banana', at('banana') - 0.06, 'banana'],
    ['bpause', end('banana') + 0.06, 'office'],
    ['over', at('stores') - 0.06, 'doors'],
    ['tour', at('tour') - 0.06, 'doors'],
    ['mnem', at('mnemonic') - 0.06, 'mnem'],
    ['thgor', at('thgorillas') - 0.06, 'conf'],
    ['where', at('where') - 0.06, 'flat'],
    ['not', at('not') - 0.06, 'office'],
  ];
  const shotAt = t => { let k = 0; for (let i = 0; i < SH.length; i++) if (t >= SH[i][1]) k = i; return SH[k]; };

  // corridor camera: sequential moves (t0, dur, target [fx, fy, k], walk?)
  const MOVES = [
    [at('tour'), 1.5, [300, 375, 1], 1],
    [mid('gerald', 0.12), 1.3, [390, 282, 1.9], 0],
    [at('elastic') - 0.32, 0.62, [900, 375, 1], 1],
    [at('thermal') - 0.32, 0.62, [1500, 375, 1], 1],
    [at('electro') - 0.32, 0.62, [2100, 375, 1], 1],
  ];
  const DOPEN = [at('kin') - 0.05, mid('kin', 0.42), at('elastic'), mid('elastic', 0.56), at('thermal'), mid('thermal', 0.52), at('electro'), mid('electro', 0.55)];
  const DHIDE = [mid('gerald', 0.1), mid('gerald', 0.1), at('thermal') - 0.3, at('thermal') - 0.3, at('electro') - 0.3, at('electro') - 0.3, 1e9, 1e9];
  const MNT = i => mid('mnemonic', 0.03 + i * 0.112);

  return t => {
    const shot = shotAt(t), sid = shot[0], set = shot[2];
    op(OFF, set === 'office' ? 1 : 0); op(FLAT, set === 'flat' ? 1 : 0); op(DOORS, set === 'doors' ? 1 : 0);
    op(MN, set === 'mnem' ? 1 : 0); op(BAN, set === 'banana' ? 1 : 0);
    CONF.set(set === 'conf' ? 1 : 0, t);
    let camK = 1, camX = 600, camY = 375;
    const talk = who => scTalk(S, t, who);
    let conOn = 0, julOn = 0, kavOn = 0;
    const show = new Set();

    /* ---------- office: case file, Jules bursts in ---------- */
    if (sid === 'office1') {
      conOn = 1;
      const jIn = P(t, at('hi') - 0.12, 0.45, easeOut);
      tr(con, 380, 410, 1.05);
      const surprised = t >= at('hi') - 0.1 && t < at('hi') + 0.5;
      con.set({ t, talk: talk('con'), mood: surprised ? 'shock' : 'deadpan', look: t > at('hi') - 0.2 ? 0.8 : (t > mid('file', 0.2) ? 0.6 : 0) });
      show.add('folder');
      const fp = P(t, mid('file', 0.05), 0.55, easeOut) * (1 - P(t, at('hi') - 0.12, 0.25, linear));
      op(folder, clamp(fp * 3)); tr(folder, lerp(1450, 850, fp), 330, 0.95, lerp(12, -4, fp));
      op(fWit, P(t, mid('file', 0.6), 0.3, linear));
      if (t >= at('hi') - 0.15) {
        julOn = 1;
        const hop = Math.abs(Math.sin(t * 6)) * 14 * AMP;
        tr(jul, lerp(1360, 810, jIn), 400 - hop - 60 * Math.sin(Math.PI * jIn), 1.25, lerp(-25, 0, jIn));
        jul.set({ t, talk: talk('jules'), mood: t < at('hi') + 0.35 ? 'shock' : 'happy', look: t < mid('hi', 0.4) ? -0.4 : -0.7, arms: 1 });
        sparks.forEach((s, i) => { const a = i / 4 * TAU + 0.6, q = P(t, at('hi'), 0.9, easeOut); op(s, Math.sin(Math.PI * q)); tr(s, 810 + Math.cos(a) * (110 + 70 * q), 400 + Math.sin(a) * (100 + 60 * q)); s.upd(t); });
        show.add('sparks');
        const cp = P(t, mid('hi', 0.5), 0.45, pop);
        show.add('hiChip'); stPop(hiChip, 790, 212, cp);
      }
    }
    ltJ.set(win(t, at('hi') + 0.35, at('hi') + 3.5, 0.3));

    /* ---------- confessional: a joule is tiny ---------- */
    if (sid === 'thjules') {
      conOn = 1;
      const push = P(t, at('thjules'), end('thjules') + 0.3 - at('thjules'), linear);
      tr(con, 330, 410, 1.5 * (1 + 0.03 * push));
      con.set({ t, talk: talk('con'), mood: 'deadpan', look: t > mid('thjules', 0.3) ? 0.5 : 0 });
      show.add('apIn');
      stPop(apIn, 0, 0, P(t, at('thjules') + 0.05, 0.4, pop));
      stPop(apSmall, 990, 500, P(t, mid('thjules', 0.1), 0.4, pop));
      const lift = P(t, mid('thjules', 0.4), 1.6, ease);
      tr(apple, 820, lerp(512, 238, lift));
      apArrow.set(lift); op(apArrow, lift > 0.02 ? 1 : 0);
      op(apJ, P(t, mid('thjules', 0.82), 0.3, linear));
      op(apTiny, P(t, mid('thjules', 0.4), 0.3, linear)); op(apTiny2, P(t, mid('thjules', 0.55), 0.3, linear));
    }

    /* ---------- office: "BEST DAY" ---------- */
    if (sid === 'apple') {
      conOn = 1; julOn = 1;
      tr(con, 290, 420, 1.0); con.set({ t, talk: 0, mood: 'deadpan', look: 0.8 });
      const bob = Math.sin(t * 2.4) * 6 * AMP;
      tr(jul, 640, 420 + bob, 1.15, 4 * Math.sin(t * 1.3) * AMP);
      const closed = t > at('apple') + 0.3;
      jul.set({ t: closed ? stBlinkT(t, 9, [], 0.065) : t, talk: talk('jules'), mood: 'happy', look: 0, arms: 0.7, still: true });
      show.add('best');
      stPop(best, 990, 330, P(t, mid('apple', 0.12), 0.45, pop), 1, 4);
      best.mj.set({ t, mood: 'happy', arms: 1 });
    }

    /* ---------- office: kilojoules ---------- */
    if (sid === 'kilo' || sid === 'bpause') {
      conOn = 1;
      if (sid === 'kilo') {
        const push = P(t, end('apple'), at('kilo') - end('apple'), linear);
        tr(con, 300, 430, 1.25 * (1 + 0.04 * push));
        con.set({ t, talk: talk('con'), mood: 'deadpan', look: t > at('kilo') + 0.4 ? 0.7 : 0 });
        show.add('kb');
        stPop(kb, 850, 380, P(t, at('kilo'), 0.4, pop));
        const pour = P(t, mid('kilo', 0.4), end('kilo') - mid('kilo', 0.4) - 0.1, linear);
        setText(kCnt, Math.round(1000 * pour) + ' J');
        attr(kFill, 'height', 84 * pour); attr(kFill, 'y', 44 - 84 * pour);
        kCoins.forEach((c, i) => {
          const q = (t * 1.1 * AMP + c.ph) % 1, on = pour > 0 && pour < 1;
          op(c.e, on ? Math.min(1, (1 - q) * 4) : 0);
          attr(c.e, 'cx', lerp(c.x, -70 + (c.x + 70) * 0.3, q)); attr(c.e, 'cy', lerp(-10, 110, q * q));
        });
      } else {
        const push = P(t, end('banana'), at('stores') - end('banana'), linear);
        camK = 1 + 0.08 * push; camX = 600; camY = 330;
        tr(con, 600, 410, 1.6);
        con.set({ t, talk: 0, mood: 'deadpan', look: 0 });
      }
    }

    /* ---------- banana close-up ---------- */
    if (sid === 'banana') {
      julOn = 1;
      tr(jul, 1010, 560 + Math.sin(t * 3) * 6 * AMP, 0.9);
      jul.set({ t, talk: talk('jules'), mood: 'happy', look: -0.8, arms: 0.9 });
      show.add('ban');
      const crowd = P(t, mid('banana', 0.55), 1.2, ease);
      const bul = 1 + (0.03 + 0.05 * crowd) * (0.5 + 0.5 * Math.sin(t * 7 * AMP));
      tr(banIn, 0, 0, `${(1 + 0.02 * crowd).toFixed(4)} ${bul.toFixed(4)}`);
      stPop(ban, 470, 420, P(t, at('banana') - 0.06, 0.35, pop));
      faces.forEach(({ f, x, y, ph }) => tr(f, x + Math.sin(t * 5 + ph) * (2 + 4 * crowd) * AMP, y + Math.cos(t * 6 + ph) * (2 + 3 * crowd) * AMP, 1, Math.sin(t * 4 + ph) * 12 * AMP));
      op(banJ, P(t, mid('banana', 0.25), 0.3, linear)); op(banK, P(t, mid('banana', 0.35), 0.3, linear));
      stPop(banC, 470, 640, P(t, mid('banana', 0.62), 0.4, pop));
    }

    /* ---------- the corridor of eight departments ---------- */
    if (set === 'doors') {
      // camera
      let cx = 150, cy = 375, ck = 1, walking = 0, pairFx = 150;
      if (sid === 'over') { cx = 1200; cy = 375; ck = 0.5; }
      else MOVES.forEach(([t0, dur, to, w]) => { const p = P(t, t0, dur, ease); if (p > 0) { cx = lerp(cx, to[0], p); cy = lerp(cy, to[1], p); ck = lerp(ck, to[2], p); if (w) pairFx = lerp(pairFx, to[0], p); } if (w && p > 0 && p < 1) walking = 1; });
      stCam(dIn, cx, cy, ck);
      // doors
      doors.doors.forEach((d, i) => d.open(sid === 'over' ? 0 : P(t, DOPEN[i], 0.4, easeOut)));
      // door interiors
      if (sid === 'tour') {
        const u = t * AMP;
        tr(kBall, -110 + ((u * 300) % 240), 430);
        { const bx = 6 + 26 * Math.sin(u * 4), x0 = -60, n = 9; let d = `M${x0},430`; for (let k = 1; k <= n; k++) d += ` L${(x0 + (bx - x0) * k / n).toFixed(1)},${k === n ? 430 : (k % 2 ? 402 : 458)}`; attr(spr, 'd', d); attr(sprB, 'x', bx); }
        thDots.forEach(({ e, x, y, ph }) => { attr(e, 'cx', x + Math.sin(u * 17 + ph) * 7); attr(e, 'cy', y + Math.cos(u * 21 + ph) * 7); });
        tr(nucGlow, 0, 0, 1 + 0.25 * Math.sin(u * 5)); tr(orb, 0, 0, 1, (u * 20) % 360);
        attr(elec, 'cx', Math.cos(u * 3) * 58); attr(elec, 'cy', Math.sin(u * 3) * 20);
        { const lift = 0.5 + 0.5 * Math.sin(u * 2.2); attr(hair, 'd', `M-10,548 Q${-24 + 8 * lift},${520 - 30 * lift} ${-6 + 10 * lift},${500 - 70 * lift} M4,548 Q${0 + 6 * lift},${518 - 34 * lift} ${10 + 4 * lift},${496 - 76 * lift} M16,550 Q${24 - 4 * lift},${524 - 26 * lift} ${26 - 2 * lift},${506 - 60 * lift}`); op(hairM, 0.4 + 0.6 * lift); }
        { const q = (u * 0.7) % 1, gap = q < 0.75 ? lerp(34, 0, easeIn(q / 0.75)) : 0; tr(magA, -32 - gap, 430); tr(magB, 32 + gap, 430); }
      }
      // Gerald: blinks once, in the pause
      gerald.set({ t: stBlinkT(t, 21, [end('gerald') + 0.4]), mood: 'deadpan', still: true });
      // characters, placed in corridor coordinates and seen through the camera
      if (sid === 'tour') {
        conOn = ck < 1.35 ? 1 : 0; julOn = conOn;
        const enter = P(t, at('tour') - 0.05, 1.6, ease);
        const Xc = t < at('tour') + 1.6 ? lerp(-80, 300, enter) : pairFx;
        const walk = (t < at('tour') + 1.6 && enter < 1) || walking;
        const step = walk ? Math.abs(Math.sin(t * 9)) * 8 : 0;
        const scr = (X, Y) => [600 + (X - cx) * ck, 375 + (Y - cy) * ck];
        const [sx, sy] = scr(Xc, 515 - step);
        tr(con, sx, sy, 0.75 * ck, walk ? 5 : 0);
        // Constance looks at the door she's naming
        let look = 0.3;
        const lines = ['kin', 'elastic', 'thermal', 'electro'], fr = [0.42, 0.56, 0.52, 0.55];
        lines.forEach((l, i) => { if (t >= at(l) && t < end(l) + 0.3) look = t < mid(l, fr[i]) ? -0.9 : 0.9; });
        if (t >= at('gerald') - 0.2 && t < at('elastic') - 0.3) look = -0.4;
        con.set({ t, talk: talk('con'), mood: 'deadpan', look });
        const lag = P(t, at('tour') + 0.25, 1.7, ease);
        const Xj = t < at('tour') + 2 ? lerp(-260, 300, lag) + 78 : Xc + 78;
        const jhop = Math.abs(Math.sin(t * 7)) * (walk || lag < 1 ? 14 : 5) * AMP;
        const [jx, jy] = scr(Xj, 636 - jhop);
        tr(jul, jx, jy, 0.5 * ck);
        const toldOff = t >= mid('tour', 0.55) && t < end('tour') + 0.4;
        jul.set({ t, talk: talk('jules'), mood: toldOff ? 'shock' : 'happy', look: scWho(S, t) === 'con' ? 0.7 : 0.4, arms: toldOff ? 1 : 0.6 });
        // store cards
        CARD.forEach((c, i) => {
          const v = Math.min(P(t, DOPEN[i] + 0.1, 0.4, pop), 1 - P(t, DHIDE[i], 0.2, linear));
          if (v > 0) { show.add('card' + i); stPop(c, i % 2 ? 1010 : 190, 330, v); }
        });
        // Gerald's chip
        const gv = win(t, mid('gerald', 0.72), at('elastic') - 0.35, 0.2);
        if (gv > 0) { show.add('gChip'); stPop(gChip, 600, 600, gv); }
      } else {
        // overview: title chips
        show.add('ov');
        stPop(ovT, 600, 140, P(t, mid('stores', 0.38), 0.45, pop));
        stPop(ovT2, 600, 612, P(t, mid('stores', 0.12), 0.45, pop) * (1 - P(t, mid('stores', 0.66), 0.2, linear)));
        stPop(ovT3, 600, 612, P(t, mid('stores', 0.7), 0.45, pop));
        // light the doors up one by one on "a department for each"
        doors.doors.forEach((d, i) => d.open(0.5 * win(t, mid('stores', 0.72 + i * 0.03), mid('stores', 0.72 + i * 0.03) + 0.6, 0.15)));
      }
    }

    /* ---------- mnemonic ---------- */
    if (sid === 'mnem') {
      julOn = 1; show.add('mn');
      tr(mnRayP, 600, 380, 1, (t * 8 * AMP) % 360);
      let beat = 0; for (let i = 0; i < 8; i++) if (t >= MNT(i)) beat = t - MNT(i);
      const jb = Math.max(0, 1 - beat / 0.3) * 22 * AMP;
      tr(jul, 1050, 580 - jb, 0.85, 6 * Math.sin(t * 5) * AMP);
      jul.set({ t, talk: talk('jules'), mood: 'happy', look: -0.6, arms: 1 });
      mnSlots.forEach(({ g, L, x }, i) => {
        const p = P(t, MNT(i), 0.45, easeOut), b = P(t, MNT(i) + 0.3, 0.35, pop);
        op(g, clamp(p * 4));
        tr(g, x, lerp(110, 200, p)); op(L, P(t, MNT(i) + 0.1, 0.25, linear));
        tr(L, 0, 110, 0.8 + 0.2 * b);
      });
      mnWords.forEach((w, i) => op(w, P(t, MNT(i) + 0.05, 0.25, linear)));
    }

    /* ---------- confessional: the gorillas ---------- */
    if (sid === 'thgor') {
      conOn = 1;
      const push = P(t, at('thgorillas'), end('thgorillas') + 0.9 - at('thgorillas'), linear);
      tr(con, 330, 410, 1.5 * (1 + 0.04 * push));
      con.set({ t, talk: talk('con'), mood: 'deadpan', look: t > mid('thgorillas', 0.3) && t < mid('thgorillas', 0.85) ? 0.6 : 0 });
      show.add('gor');
      stPop(gor, 860, 340, P(t, mid('thgorillas', 0.42), 0.45, pop), 1, 4);
      gor.mj.set({ t, mood: 'happy', arms: 1, talk: 0 });
    }

    /* ---------- Kavya at home ---------- */
    if (sid === 'where') {
      kavOn = 1;
      flat.upd(t, 1); flat.clock(13.5 + t / 600);
      tr(kav, 520, 500, 1.2);
      const arm = P(t, at('where') + 0.1, 0.35, easeOut);
      kArm.setAttribute('transform', `rotate(${(-80 * (1 - arm) + 3 * Math.sin(t * 3) * AMP).toFixed(1)} -66 92)`); op(kArm, clamp(arm * 3));
      kav.set({ t, talk: talk('kavya'), mood: 'neutral', look: 0.7 });
      const f = [0.32, 0.68, 0.86];
      QS.forEach((q, i) => { show.add('q' + i); stPop(q, 900, 250 + i * 110, P(t, mid('where', f[i]), 0.4, pop), 1, i % 2 ? 3 : -3); });
    } else op(kArm, 0);

    /* ---------- "Not stores." ---------- */
    if (sid === 'not') {
      conOn = 1;
      const push = P(t, at('not') - 0.06, 3.0, linear);
      camK = 1 + 0.1 * push; camX = 520; camY = 360;
      tr(con, 360, 420, 1.5);
      con.set({ t, talk: talk('con'), mood: 'deadpan', look: 0 });
      const sp = P(t, mid('not', 0.45), 0.3, linear);
      QS.forEach((q, i) => { show.add('q' + i); tr(q, 880, 240 + i * 110, 1, i % 2 ? 3 : -3); op(q, 1 - 0.7 * sp); });
      show.add('stamp'); tr(stampNS, 880, 350, 1.05); stampNS.set(sp);
    }

    // visibility of props
    if (!show.has('folder')) op(folder, 0);
    if (!show.has('sparks')) sparks.forEach(s => op(s, 0));
    if (!show.has('hiChip')) op(hiChip, 0);
    if (!show.has('apIn')) op(apIn, 0);
    if (!show.has('best')) op(best, 0);
    if (!show.has('kb')) op(kb, 0);
    if (!show.has('ban')) { op(ban, 0); op(banJ, 0); op(banK, 0); op(banC, 0); }
    if (!show.has('ov')) { op(ovT, 0); op(ovT2, 0); op(ovT3, 0); }
    CARD.forEach((c, i) => { if (!show.has('card' + i)) op(c, 0); });
    if (!show.has('gChip')) op(gChip, 0);
    op(mn, show.has('mn') ? 1 : 0);
    if (!show.has('gor')) op(gor, 0);
    QS.forEach((q, i) => { if (!show.has('q' + i)) op(q, 0); });
    if (!show.has('stamp')) op(stampNS, 0);
    op(con, conOn); op(jul, julOn); op(kav, kavOn);
    stPush(CAM, camK, camX, camY);
  };
});
