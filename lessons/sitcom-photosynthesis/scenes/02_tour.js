/* Scene 2: The factory tour.
   A whole leaf (broad, flat, then side-on: thin) -> the leaf as a building, a small Clive with a tour flag:
   ROOF (waxy cuticle: light in, rain off) -> TOP FLOOR (palisade, VIP rope) -> DOWNSTAIRS (spongy, air spaces glow)
   -> DOORS (stomata, underside) -> the stoma door: the Guards open and close it (lower third), then do not talk
   (1 s of nothing) -> Cosmo drifts in through the pore -> diffusion, high to low concentration -> Cosmo on a pool
   float (no energy) -> Dewi bursts out of a pipe -> root hairs and the xylem (Dewi riding up it) -> Kavya: "UP?"
   -> split screen: Kavya's bubble tea straw / evaporation pulls water up the xylem -> Plant with a giant straw,
   TRANSPIRATION -> Clive deadpan -> the vein: xylem water in, phloem sugar out. */
scene('tour', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;

  /* ---------- local helpers (prefixed tour) ---------- */
  const tourCam = (el, c) => el.setAttribute('transform', `translate(${c[3].toFixed(1)} ${c[4].toFixed(1)}) scale(${c[0].toFixed(4)}) translate(${(-c[1]).toFixed(1)} ${(-c[2]).toFixed(1)})`);
  const tourPop = (el, p, x, y, s, r) => { op(el, clamp(p * 2.5)); tr(el, x, y, Math.max(0.01, (s || 1) * (0.6 + 0.4 * p)), r); };
  // rich text: '_2' subscripts, '**bold**' in o.boldFill; centred on x
  function tourRich(parent, x, y, str, o) {
    o = o || {};
    const size = o.size || 32, sub = size * 0.62, dy = size * 0.26, font = o.font || FD;
    const segs = [];
    String(str).split(/(\*\*[^*]+\*\*)/).forEach(seg => {
      if (!seg) return;
      const bold = seg.startsWith('**'), inner = bold ? seg.slice(2, -2) : seg;
      inner.split(/(_\d+)/).forEach(p => { if (p) segs.push({ s: p[0] === '_' ? p.slice(1) : p, sub: p[0] === '_', bold }); });
    });
    const w = segs.reduce((a, q) => a + textWidth(q.s, q.sub ? sub : size, font, q.bold ? 800 : (o.weight || 700)), 0);
    const tx = E('text', { x: o.anchor === 'start' ? x : x - w / 2, y, 'font-size': size, 'font-family': font, 'font-weight': o.weight || 700, fill: o.fill || C.ink }, parent);
    let low = false;
    if (segs.length === 1 && !segs[0].sub) { tx.textContent = segs[0].s; if (segs[0].bold) { tx.setAttribute('font-weight', 800); if (o.boldFill) tx.setAttribute('fill', o.boldFill); } tx.w = w; return tx; }
    segs.forEach(q => {
      const sp = E('tspan', {}, tx); sp.textContent = q.s;
      if (q.bold) { sp.setAttribute('font-weight', 800); if (o.boldFill) sp.setAttribute('fill', o.boldFill); }
      if (q.sub) { sp.setAttribute('font-size', sub.toFixed(1)); if (!low) { sp.setAttribute('dy', dy.toFixed(1)); low = true; } }
      else if (low) { sp.setAttribute('dy', (-dy).toFixed(1)); low = false; }
    });
    tx.w = w;
    return tx;
  }
  function tourChip(parent, str, o) {
    o = o || {};
    const size = o.size || 32, g = G(parent), h = Math.round(size * 1.75);
    const box = E('rect', { y: -h / 2, height: h, rx: h / 2, fill: o.fill || 'rgba(10,27,39,0.9)', stroke: o.stroke || C.line, 'stroke-width': 3 }, g);
    const tx = tourRich(g, 0, size * 0.35, str, { size, fill: o.color || C.ink, boldFill: o.boldFill || C.energy });
    const w = tx.w + size * 1.4;
    attr(box, 'x', -w / 2); attr(box, 'width', w);
    g.w = w;
    return g;
  }
  function tourSign(parent, a, b) {   // building directory sign
    const g = G(parent), size = 32;
    const w = textWidth(a + ' ', size, FD, 800) + textWidth(b, size, FD, 600) + 56;
    E('rect', { x: -w / 2, y: -34, width: w, height: 68, rx: 10, fill: '#1E6B3A', stroke: '#FFFFFF', 'stroke-width': 4 }, g);
    const tx = E('text', { x: -w / 2 + 28, y: 11, 'font-size': size, 'font-family': FD, 'font-weight': 800, fill: '#FFE45C' }, g);
    const s1 = E('tspan', {}, tx); s1.textContent = a + ' ';
    const s2 = E('tspan', { fill: '#FFFFFF', 'font-weight': 600 }, tx); s2.textContent = b;
    return g;
  }
  // cheap molecules (3 elements each): the two outer atoms share one path
  const tourRing = (x, y, r) => `M${(x - r).toFixed(1)},${y.toFixed(1)} a${r.toFixed(1)},${r.toFixed(1)} 0 1,0 ${(2 * r).toFixed(1)},0 a${r.toFixed(1)},${r.toFixed(1)} 0 1,0 ${(-2 * r).toFixed(1)},0 `;
  function tourCO2(parent, r) { const g = G(parent); E('path', { d: tourRing(-r * 1.5, 0, r * 0.85) + tourRing(r * 1.5, 0, r * 0.85), fill: C.oxygen, stroke: C.oxygenDk, 'stroke-width': 2 }, g); E('circle', { r, fill: ball(C.carbon, C.carbonDk) }, g); return g; }
  function tourH2O(parent, r) { const g = G(parent); E('path', { d: tourRing(-r * 0.95, r * 0.72, r * 0.6) + tourRing(r * 0.95, r * 0.72, r * 0.6), fill: C.hydrogen, stroke: C.hydrogenDk, 'stroke-width': 2 }, g); E('circle', { r, fill: ball(C.oxygen, C.oxygenDk) }, g); return g; }
  function tourO2(parent, r) { const g = G(parent); E('path', { d: tourRing(-r * 0.72, 0, r) + tourRing(r * 0.72, 0, r), fill: C.oxygen, stroke: C.oxygenDk, 'stroke-width': 2 }, g); return g; }
  // a xylem vessel h tall (origin at the bottom) with water rising; same look as phXylem, lighter molecules
  function tourXylem(parent, h) {
    const g = G(parent);
    E('rect', { x: -38, y: -h, width: 76, height: h, fill: 'rgba(160,220,255,0.18)' }, g);
    let rings = ''; for (let y = -h + 14; y < 0; y += 26) rings += `M-38,${y} Q0,${y + 10} 38,${y} `;
    E('path', { d: rings, fill: 'none', stroke: '#8C6B3A', 'stroke-width': 4, opacity: 0.55 }, g);
    E('path', { d: `M-38,${-h} L-38,0 M38,${-h} L38,0`, stroke: '#8C6B3A', 'stroke-width': 9 }, g);
    const ms = [0, 1, 2, 3, 4, 5, 6].map(() => tourH2O(g, 13));
    g.upd = (t, sp) => ms.forEach((m, i) => { const f = ((t * 0.16 * sp) + i / ms.length) % 1; tr(m, Math.sin(i * 2.1 + t) * 10, -f * h, 1, (i * 47 + t * 30 * sp) % 360); op(m, Math.min(1, f * 8, (1 - f) * 8)); });
    g.upd(0, 1);
    return g;
  }
  // bubble tea, the light version of phBubbleTea (same cup, straw and lid); origin at the bottom; g.set(level 0..1)
  function tourTea(parent, sc) {
    const g = G(parent), inner = G(g), ink = SC_INK; tr(inner, 0, 0, sc);
    const tea = E('path', { d: '', fill: '#D9A877' }, inner);
    let pd = ''; const r = rng(41); for (let i = 0; i < 14; i++) pd += tourRing(-36 + r() * 72, -12 - r() * 34, 9);
    E('path', { d: pd, fill: '#2A1A12' }, inner);
    E('path', { d: 'M10,-300 L24,-300 L6,-14 L-8,-14 Z', fill: '#FF6FB5', stroke: ink, 'stroke-width': 3 }, inner);
    E('path', { d: 'M-62,-190 L62,-190 L48,0 L-48,0 Z', fill: 'rgba(255,255,255,0.18)', stroke: ink, 'stroke-width': 4, 'stroke-linejoin': 'round' }, inner);
    E('path', { d: 'M-68,-190 Q0,-236 68,-190 Z', fill: 'rgba(255,255,255,0.5)', stroke: ink, 'stroke-width': 4 }, inner);
    E('rect', { x: -60, y: -120, width: 120, height: 34, fill: '#FFFFFF', opacity: 0.85 }, inner);
    g.set = level => { const y = -170 * clamp(level), xw = 48 + (62 - 48) * (-y / 190); attr(tea, 'd', `M${-xw},${y} L${xw},${y} L48,0 L-48,0 Z`); };
    g.set(0.8);
    return g;
  }
  // Kavya's bedroom, the light version (the full set is in scene 1): wall, window with the HDB blocks, sill, desk,
  // and Plant (same shape as phPlant: pot, sticky note, six leaves)
  function tourRoom(parent) {
    const g = G(parent), ink = SC_INK;
    E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#F2E4D2', '#E2CDB6', true) }, g);
    E('rect', { x: 110, y: 110, width: 640, height: 370, fill: linGrad('#6EC3F5', '#D2F0FF', true) }, g);
    E('circle', { cx: 640, cy: 175, r: 36, fill: '#FFE45C' }, g);
    E('path', { d: 'M140,210 h150 v270 h-150 Z M320,160 h170 v320 h-170 Z M520,240 h140 v240 h-140 Z', fill: '#F2EEE6', stroke: '#9C927C', 'stroke-width': 3 }, g);
    let w = ''; [[140, 210, 150], [320, 160, 170], [520, 240, 140]].forEach(([x, y, bw]) => { for (let yy = y + 30; yy < 470; yy += 30) for (let xx = x + 14; xx < x + bw - 20; xx += 28) w += `M${xx},${yy} h16 v14 h-16 Z `; });
    E('path', { d: w, fill: '#7FA6BF' }, g);
    E('rect', { x: 110, y: 110, width: 640, height: 370, fill: 'none', stroke: '#FFFFFF', 'stroke-width': 16 }, g);
    E('line', { x1: 430, y1: 110, x2: 430, y2: 480, stroke: '#FFFFFF', 'stroke-width': 12 }, g);
    E('rect', { x: 80, y: 480, width: 700, height: 24, rx: 4, fill: '#FAF7F2', stroke: ink, 'stroke-width': 3 }, g);
    E('path', { d: 'M800,500 h400 v26 h-400 Z M830,526 h30 v224 h-30 Z M1060,526 h140 v160 h-140 Z', fill: '#B07A45', stroke: ink, 'stroke-width': 4 }, g);
    E('rect', { x: 0, y: 690, width: 1200, height: 60, fill: '#C9A27A' }, g);
    const pl = G(g); tr(pl, 330, 480, 0.85);
    const leaves = G(pl);
    E('path', { d: 'M-4,-104 C-10,-150 8,-190 0,-236', fill: 'none', stroke: '#2E8A4A', 'stroke-width': 10, 'stroke-linecap': 'round' }, leaves);
    let ld = '', md = '';
    [[-2, -150, -152, 0.5], [2, -170, -30, 0.5], [0, -205, -128, 0.46], [0, -216, -58, 0.44], [0, -236, -92, 0.42], [4, -124, -14, 0.66]].forEach(([x, y, a, sc]) => {
      const c = Math.cos(a * Math.PI / 180), sn = Math.sin(a * Math.PI / 180);
      const q = (px, py) => `${(x + (px * c - py * sn) * sc).toFixed(1)},${(y + (px * sn + py * c) * sc).toFixed(1)}`;
      ld += `M${q(0, 0)} C${q(40, -60)} ${q(150, -70)} ${q(205, 0)} C${q(150, 70)} ${q(40, 60)} ${q(0, 0)} Z `;
      md += `M${q(-10, 0)} L${q(200, 0)} `;
    });
    E('path', { d: ld, fill: ball(C.plant, C.plantDk), stroke: C.plantDk, 'stroke-width': 3 }, leaves);
    E('path', { d: md, fill: 'none', stroke: '#C9F2D3', 'stroke-width': 4, 'stroke-linecap': 'round', opacity: 0.8 }, leaves);
    E('path', { d: 'M-66,-104 L66,-104 L54,0 L-54,0 Z', fill: ball('#D9774A', '#9C4A27'), stroke: ink, 'stroke-width': 4, 'stroke-linejoin': 'round' }, pl);
    E('rect', { x: -76, y: -118, width: 152, height: 22, rx: 6, fill: '#C9643A', stroke: ink, 'stroke-width': 4 }, pl);
    const note = G(pl); tr(note, 0, -54, 1, -5);
    E('rect', { x: -48, y: -24, width: 96, height: 48, fill: '#FFF176', stroke: '#C9B53A', 'stroke-width': 2 }, note);
    T(note, 0, 10, 'PLANT', { size: 26, weight: 700, anchor: 'middle', fill: '#2A3A8A', font: FB });
    g.plantAt = [330, 480];
    g.set = st => { const t = (st && st.t) || 0; leaves.setAttribute('transform', `rotate(${(1.2 * Math.sin(t * 1.1)).toFixed(2)} 0 -104)`); };
    return g;
  }
  function tourFlag(parent) {
    const g = G(parent);
    E('path', { d: 'M0,40 L0,-120', stroke: '#5A4A3A', 'stroke-width': 7, 'stroke-linecap': 'round' }, g);
    E('path', { d: 'M2,-118 L70,-98 L2,-78 Z', fill: '#FFC93C', stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
    return g;
  }

  /* layers */
  const Lbg = G(root), Lmid = G(root), Lcast = G(root), Lfg = G(root), Lhud = G(root);

  /* ================= A: the whole leaf ================= */
  const leafShot = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#7FCBF5', '#D6F2FF', true) }, leafShot);
  const sunA = G(leafShot); tr(sunA, 1080, 110); E('circle', { r: 120, fill: glow('#FFD24A') }, sunA); E('circle', { r: 44, fill: ball('#FFE066', '#F5A300') }, sunA);
  const raysA = [0, 1, 2].map(i => arrow(leafShot, 1010 - i * 150, 170 + i * 20, 880 - i * 170, 300 + i * 30, { color: '#FFC93C', width: 7 }));
  const leafG = G(leafShot), leafIn = G(leafG);
  E('path', { d: 'M-90,0 L0,0', stroke: C.plantDk, 'stroke-width': 10, 'stroke-linecap': 'round' }, leafIn);
  leaf(leafIn, 2.4);
  const thinMark = G(leafShot);
  E('path', { d: 'M960,370 L960,388 M960,412 L960,430 M944,372 L976,372 M944,428 L976,428', stroke: SC_INK, 'stroke-width': 4 }, thinMark);
  T(thinMark, 990, 412, 'thin', { size: 34, weight: 800, fill: SC_INK });
  const cBroad = tourChip(Lfg, '**broad + flat** = large surface area to catch light', { size: 30 });
  const cThin = tourChip(Lfg, '**thin** = gases don\'t travel far', { size: 30 });
  const flash = E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#FFFFFF' }, Lhud);

  /* ================= B: the leaf as a building ================= */
  const secShot = G(Lbg), secWrap = G(secShot);
  E('rect', { x: -800, y: -600, width: 2800, height: 2000, fill: '#DCE9F2' }, secWrap);   // more air around the section when the camera moves
  E('rect', { x: -800, y: -600, width: 2800, height: 710, fill: '#7FCBF5' }, secWrap);
  const sec = phLeafSection(secWrap);
  const airBlue = E('rect', { x: 0, y: 350, width: 1200, height: 170, fill: '#9FDCFF' }, null);
  sec.insertBefore(airBlue, sec.childNodes[5]);
  const ov = G(secWrap);   // overlays in section coordinates
  const lightIn = E('path', { d: 'M640,0 L700,0 L760,330 L700,330 Z M800,0 L850,0 L900,330 L850,330 Z', fill: '#FFF3A0' }, ov);
  const rain = E('path', { d: 'M0,-22 Q16,4 0,14 Q-16,4 0,-22 Z', fill: C.water, stroke: '#0E5A78', 'stroke-width': 3 }, ov);
  const twinkles = G(ov), tws = [];
  for (let i = 0; i < 6; i++) { const x = 90 + i * 200 + (i % 2) * 30, y = 200 + (i % 3) * 50; const s = E('path', { d: 'M0,-12 Q2,-2 12,0 Q2,2 0,12 Q-2,2 -12,0 Q-2,-2 0,-12 Z', fill: '#FFF7C2' }, twinkles); tws.push({ s, x, y }); }
  const vip = G(ov);
  E('path', { d: 'M236,342 Q290,372 344,342', fill: 'none', stroke: '#C2272D', 'stroke-width': 9, 'stroke-linecap': 'round' }, vip);
  [236, 344].forEach(x => { E('rect', { x: x - 5, y: 330, width: 10, height: 44, fill: '#E0B23A', stroke: SC_INK, 'stroke-width': 2 }, vip); E('circle', { cx: x, cy: 328, r: 9, fill: '#FFD45C', stroke: SC_INK, 'stroke-width': 2 }, vip); });
  const vipSign = chip(vip, 'VIP', { size: 26, fill: '#2A1A22', color: '#FFD45C', h: 40, rx: 8 }); tr(vipSign, 290, 306);
  const gases = G(ov), gasM = [];
  for (let i = 0; i < 4; i++) { const m = i % 2 ? tourCO2(gases, 7) : tourO2(gases, 7); gasM.push(m); }
  // diffusion: CO2 outside (lots) and inside (few)
  const diffG = G(ov), outM = [], inM = [], thruM = [];
  { const r = rng(21);
    for (let i = 0; i < 11; i++) outM.push({ m: tourCO2(diffG, 11), x: 140 + r() * 920, y: 600 + r() * 220, a: r() * 6 });
    [[420, 400], [760, 450], [300, 470]].forEach(([x, y], i) => inM.push({ m: tourCO2(diffG, 11), x, y, a: i * 2 }));
    for (let i = 0; i < 2; i++) thruM.push(tourCO2(diffG, 11)); }
  // veins: flows in and out
  const flowG = G(Lfg);
  const inArrow = arrow(flowG, 200, 330, 560, 360, { color: C.water, width: 12 });
  const outArrow = arrow(flowG, 840, 520, 1140, 580, { color: C.glucose, width: 12 });
  const wDots = [0, 1, 2].map(() => tourH2O(flowG, 10));
  const gDots = [0, 1, 2].map(() => molGlucose(flowG, 13));
  const cXy = tourChip(Lfg, '**xylem**: water IN', { size: 32, boldFill: '#7FDBFF' });
  const cPh = tourChip(Lfg, '**phloem**: sugar OUT', { size: 32, boldFill: C.glucose });
  const cVeins = chip(Lfg, 'veins', { size: 52, fill: '#1E6B3A', color: '#FFFFFF', stroke: '#B8F5BF', sw: 4 });
  const diffArrow = arrow(Lfg, 600, 700, 600, 220, { color: '#FFE45C', width: 12 });
  const cDiff = chip(Lfg, 'DIFFUSION', { size: 52, fill: '#FFE45C', color: '#3A2600', stroke: '#FFFFFF', sw: 4 });
  const cHiLo = tourChip(Lfg, '**high** → **low** concentration', { size: 30 });
  const cOut = tourChip(Lfg, 'outside: **lots** of CO_2', { size: 30, boldFill: '#FFE45C' });
  const cIn = tourChip(Lfg, 'inside: **less** CO_2', { size: 30, boldFill: '#FFE45C' });
  const cNoE = tourChip(Lfg, 'diffusion needs **no energy**', { size: 40 });
  const floatRing = G(Lmid);
  E('ellipse', { rx: 170, ry: 46, fill: 'none', stroke: SC_INK, 'stroke-width': 36 }, floatRing);
  E('ellipse', { rx: 170, ry: 46, fill: 'none', stroke: '#FF7FB5', 'stroke-width': 28 }, floatRing);
  E('path', { d: 'M-150,-18 A170,46 0 0 1 -60,-44', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 10, 'stroke-dasharray': '18 16', 'stroke-linecap': 'round' }, floatRing);
  // signs and chips for the floors
  const signs = {
    roof: tourSign(Lfg, 'ROOF:', 'waxy cuticle'), top: tourSign(Lfg, 'TOP FLOOR:', 'palisade cells'), spongy: tourSign(Lfg, 'DOWNSTAIRS:', 'spongy layer'),
    doors: tourSign(Lfg, 'DOORS:', 'stomata'), pipes: tourSign(Lfg, 'PIPES:', 'xylem'),
  };
  const ch = {
    clear: tourChip(Lfg, '**clear**: lets light in', { size: 32 }), wp: tourChip(Lfg, '**waterproof**: keeps water in', { size: 32, boldFill: '#7FDBFF' }),
    packed: tourChip(Lfg, 'packed with **chloroplasts**', { size: 30, boldFill: '#8FE59C' }), first: tourChip(Lfg, '**first** to get the light', { size: 30 }),
    most: tourChip(Lfg, '**most photosynthesis** happens here', { size: 30, boldFill: '#8FE59C' }),
    air: tourChip(Lfg, '**air spaces**: gases reach every cell', { size: 32, boldFill: '#9FDCFF' }),
    pores: tourChip(Lfg, '**stomata**: tiny pores', { size: 32 }), one: chip(Lfg, 'one: a stoma', { size: 30, fill: 'rgba(10,27,39,0.9)', stroke: C.line }),
    under: tourChip(Lfg, 'mostly on the **underside**', { size: 30 }),
  };

  /* ================= C: the stoma door ================= */
  const doorShot = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#BFE9C8', '#9FD8AE', true) }, doorShot);
  { let d = ''; const r = rng(8);
    for (let row = 0; row < 6; row++) for (let col = 0; col < 7; col++) {
      const x = col * 190 - 40 + (row % 2) * 95, y = row * 140 - 30, w = 190, h = 140, j = () => (r() - 0.5) * 30;
      d += `M${x},${y} C${x + 60},${y + j()} ${x + 130},${y + j()} ${x + w},${y} C${x + w + j()},${y + 50} ${x + w + j()},${y + 90} ${x + w},${y + h} `;
    }
    E('path', { d, fill: 'none', stroke: '#5FB474', 'stroke-width': 5, opacity: 0.8 }, doorShot); }
  E('ellipse', { cx: 600, cy: 400, rx: 330, ry: 260, fill: glow('#FFFFFF'), opacity: 0.4 }, doorShot);
  const cGc = tourChip(Lfg, '**guard cells**: open and close the stoma', { size: 30, boldFill: '#8FE59C' });
  const cCtl = tourChip(Lfg, 'control **gas exchange** + **water loss**', { size: 30 });
  const cCO2 = tourChip(Lfg, '**carbon dioxide** (CO_2), from the air', { size: 32, boldFill: '#C9D6E3' });

  /* ================= D: pipes (Dewi) and roots ================= */
  const pipeShot = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#DDF3E2', '#C3E8CC', true) }, pipeShot);
  E('path', { d: 'M0,140 Q300,110 600,150 T1200,130 M0,560 Q320,600 640,560 T1200,590', fill: 'none', stroke: '#8FCB9C', 'stroke-width': 10 }, pipeShot);
  const splash = [0, 1, 2, 3].map(() => E('path', { d: 'M0,-12 Q10,2 0,9 Q-10,2 0,-12 Z', fill: C.water, stroke: '#0E5A78', 'stroke-width': 2.5 }, Lfg));
  const cWater = tourChip(Lfg, '**water** (H_2O)', { size: 38, boldFill: '#7FDBFF' });
  const rootShot = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#BFE6FF', '#E6F6FF', true) }, rootShot);
  E('rect', { x: 0, y: 330, width: 1200, height: 420, fill: linGrad('#7A5236', '#4A301F', true) }, rootShot);
  E('rect', { x: 0, y: 320, width: 1200, height: 18, fill: '#5BBF6A' }, rootShot);
  E('rect', { x: 568, y: -10, width: 84, height: 345, fill: '#4CB86A', stroke: SC_INK, 'stroke-width': 4 }, rootShot);   // stem
  const HAIRS = 'M560,420 Q470,410 360,440 M560,500 Q450,520 330,500 M560,590 Q470,600 390,640 M660,440 Q760,420 860,450 M660,530 Q770,540 880,520 M660,630 Q740,640 820,680';
  E('path', { d: HAIRS, fill: 'none', stroke: SC_INK, 'stroke-width': 13, 'stroke-linecap': 'round' }, rootShot);
  E('path', { d: HAIRS, fill: 'none', stroke: '#F2E2C4', 'stroke-width': 7, 'stroke-linecap': 'round' }, rootShot);
  E('rect', { x: 556, y: 330, width: 108, height: 440, rx: 40, fill: '#F2E2C4', stroke: SC_INK, 'stroke-width': 4 }, rootShot);
  const soilW = [];
  { const r = rng(5); for (let i = 0; i < 6; i++) soilW.push({ m: tourH2O(rootShot, 12), x: i % 2 ? 900 + r() * 220 : 60 + r() * 240, y: 400 + r() * 300, ph: i / 6 }); }
  const xylem = tourXylem(Lmid, 460);
  const lbRoot = G(Lfg); E('line', { x1: 280, y1: 380, x2: 360, y2: 438, stroke: '#FFFFFF', 'stroke-width': 4 }, lbRoot); E('circle', { cx: 360, cy: 440, r: 7, fill: '#FFFFFF' }, lbRoot);
  const cRoot = tourChip(lbRoot, '**root hair cells**', { size: 32, boldFill: '#F2E2C4' }); tr(cRoot, 250, 360);
  const lbXy = G(Lfg); E('line', { x1: 830, y1: 220, x2: 640, y2: 240, stroke: SC_INK, 'stroke-width': 4 }, lbXy); E('circle', { cx: 640, cy: 240, r: 7, fill: SC_INK }, lbXy);
  const cXyl = tourChip(lbXy, '**xylem**: long, hollow tubes', { size: 32, boldFill: '#7FDBFF' }); tr(cXyl, 930, 200);

  /* ================= E: bedroom (Kavya, Plant with a straw) ================= */
  const bedShot = G(Lbg), bedWrap = G(bedShot);
  const bed = tourRoom(bedWrap);
  const [PX, PY] = bed.plantAt;
  const giant = G(bedWrap);
  E('path', { d: `M${PX + 18},${PY - 110} L${PX + 70},${PY - 330} L${PX + 70},${PY - 352} L${PX + 120},${PY - 380}`, fill: 'none', stroke: SC_INK, 'stroke-width': 34, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, giant);
  E('path', { d: `M${PX + 18},${PY - 110} L${PX + 70},${PY - 330} L${PX + 70},${PY - 352} L${PX + 120},${PY - 380}`, fill: 'none', stroke: '#FF6FB5', 'stroke-width': 24, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, giant);
  E('path', { d: `M${PX + 26},${PY - 150} L${PX + 34},${PY - 184} M${PX + 44},${PY - 226} L${PX + 52},${PY - 260}`, stroke: '#FFFFFF', 'stroke-width': 6, opacity: 0.7, 'stroke-linecap': 'round' }, giant);
  const vapour = [0, 1, 2].map(() => tourH2O(bedWrap, 11));
  const cUp = tourChip(Lfg, 'water goes **UP**?', { size: 42, boldFill: '#7FDBFF' });
  const cTr = chip(Lfg, 'TRANSPIRATION', { size: 56, fill: '#1E6B3A', color: '#FFFFFF', stroke: '#B8F5BF', sw: 4 });

  /* ================= F: split screen ================= */
  const splitL = G(Lbg), splitR = G(Lbg);
  const cpId = 'tourSplitL', cp = E('clipPath', { id: cpId }, defs()); E('rect', { x: 0, y: 0, width: 598, height: 750 }, cp);
  splitL.setAttribute('clip-path', `url(#${cpId})`);
  E('rect', { x: 0, y: 0, width: 600, height: 750, fill: linGrad('#F2E4D2', '#E2CDB6', true) }, splitL);
  E('rect', { x: 40, y: 110, width: 300, height: 250, fill: linGrad('#6EC3F5', '#D2F0FF', true), stroke: '#FFFFFF', 'stroke-width': 14 }, splitL);
  E('rect', { x: 600, y: 0, width: 600, height: 750, fill: linGrad('#CDEBFF', '#EAF7FF', true) }, splitR);
  E('rect', { x: 600, y: 640, width: 600, height: 110, fill: linGrad('#7A5236', '#4A301F', true) }, splitR);
  E('path', { d: 'M910,640 Q880,690 830,730 M910,640 Q920,700 900,745 M910,640 Q950,690 1010,720', fill: 'none', stroke: '#F2E2C4', 'stroke-width': 8, 'stroke-linecap': 'round' }, splitR);
  E('rect', { x: 872, y: 230, width: 76, height: 412, fill: '#4CB86A', stroke: SC_INK, 'stroke-width': 4 }, splitR);
  { const lf = G(splitR); leaf(lf, 1.5); tr(lf, 900, 220, 1, -18); const lf2 = G(splitR); leaf(lf2, 1.2); tr(lf2, 905, 260, 1, 200); }
  const stomaDot = E('ellipse', { cx: 1090, cy: 175, rx: 10, ry: 6, fill: '#0B2416', stroke: '#FFFFFF', 'stroke-width': 3 }, splitR);
  const evap = [0, 1, 2].map(() => tourH2O(Lfg, 11));
  const divider = E('rect', { x: 594, y: 0, width: 12, height: 750, fill: '#FFFFFF' }, Lhud);
  const tea = tourTea(Lcast, 0.75);
  const slurp = G(Lfg); [0, 1].forEach(i => E('path', { d: `M${20 + i * 18},${-20 - i * 12} q12,-10 24,0`, fill: 'none', stroke: SC_INK, 'stroke-width': 5, 'stroke-linecap': 'round' }, slurp));
  const cStraw = tourChip(Lfg, 'like sucking a **straw**', { size: 30 });
  const cEvap = tourChip(Lfg, '**evaporation** at the top', { size: 30, boldFill: '#7FDBFF' });
  const cPull = tourChip(Lfg, '**pulls** water **up**', { size: 30, boldFill: '#7FDBFF' });
  const upArr = arrow(Lfg, 1000, 620, 1000, 420, { color: C.water, width: 10 });

  /* ================= confessional ================= */
  const conf = phConf(Lbg, 'clive');
  const cTr2 = tourChip(Lfg, '**transpiration**', { size: 40, boldFill: '#8FE59C' });

  /* ================= the cast ================= */
  const guards = cast(Lcast, 'guards', { mood: 'deadpan' });
  const kav = cast(Lcast, 'kavya', { mood: 'annoyed' });
  const dewi = cast(Lcast, 'dewi', { mood: 'happy' });
  const cosmo = cast(Lcast, 'cosmo', { mood: 'smug' });
  const clive = cast(Lcast, 'clive', { mood: 'deadpan' });
  const flag = tourFlag(Lcast);
  Lcast.insertBefore(xylem, dewi);   // Dewi pops out in front of the pipe
  Lcast.appendChild(tea);
  const lt = { guards: phLower(Lhud, 'guards'), cosmo: phLower(Lhud, 'cosmo'), dewi: phLower(Lhud, 'dewi') };

  /* ================= cut points and the section camera ================= */
  const SH = [['leaf', -1e9], ['sec', end('shape') - 0.35], ['door', at('guards') - 0.1], ['diff', at('diffuse') - 0.1], ['effort', at('effort') - 0.1],
    ['pipe', at('dewi') - 0.1], ['roots', at('roots') - 0.1], ['up', at('up') - 0.1], ['straw', at('straw') - 0.1], ['transp', at('transp') - 0.1],
    ['tconf', mid('transp', 0.6)], ['veins', at('veins') - 0.1]];
  const shotAt = t => { let k = 0; for (let i = 0; i < SH.length; i++) if (t >= SH[i][1]) k = i; return SH[k]; };
  const KEYS = [[-1e9, 1, 600, 375, 600, 375], [at('roof') - 0.2, 1.6, 600, 119, 600, 250], [at('top') - 0.1, 1.3, 600, 262, 600, 330],
    [at('spongy') - 0.1, 1.3, 600, 432, 600, 400], [at('doors') - 0.1, 1.5, 600, 540, 600, 330]];
  const secCam = t => {
    let i = 0; for (let j = 0; j < KEYS.length; j++) if (t >= KEYS[j][0]) i = j;
    const a = KEYS[Math.max(0, i - 1)], b = KEYS[i], p = i === 0 ? 1 : P(t, b[0], 0.8);
    return [1, 2, 3, 4, 5].map(n => lerp(a[n], b[n], p));
  };
  const CLV = { sec: [150, 620], roof: [190, 520], top: [360, 600], spongy: [170, 640], doors: [190, 560] };

  return t => {
    const [sid, s0] = shotAt(t);
    op(leafShot, sid === 'leaf' ? 1 : 0);
    op(secShot, ['sec', 'diff', 'effort', 'veins'].includes(sid) ? 1 : 0);
    op(doorShot, sid === 'door' ? 1 : 0); op(pipeShot, sid === 'pipe' ? 1 : 0); op(rootShot, sid === 'roots' ? 1 : 0);
    op(bedShot, sid === 'up' || sid === 'transp' ? 1 : 0); op(splitL, sid === 'straw' ? 1 : 0); op(splitR, sid === 'straw' ? 1 : 0);
    conf.set(sid === 'tconf' ? 1 : 0, t);
    [cBroad, cThin, flash, lightIn, rain, twinkles, vip, gases, diffG, flowG, cXy, cPh, cVeins, diffArrow, cDiff, cHiLo, cOut, cIn, cNoE, floatRing,
      cGc, cCtl, cCO2, cWater, lbRoot, lbXy, giant, cUp, cTr, divider, slurp, cStraw, cEvap, cPull, upArr, cTr2, xylem, tea, flag,
      ...splash, ...vapour, ...evap, ...Object.values(signs), ...Object.values(ch)].forEach(e => op(e, 0));
    [guards, kav, dewi, cosmo, clive].forEach(c => op(c, 0));
    Object.values(lt).forEach(l => l.set(0));
    ['cuticle', 'palisade', 'spongy', 'stoma', 'lower', 'vein', 'xylem', 'phloem'].forEach(n => sec.hi(n, 0));
    op(airBlue, 0);
    const show = (c, x, y, s, st, r) => { op(c, 1); tr(c, x, y, s, r); c.set(Object.assign({ t }, st)); };
    const guide = (x, y, look) => {   // the tour guide: small Clive with a flag
      const walk = Math.abs(Math.sin(t * 6)) * 4 * AMP;
      show(clive, x, y - walk, 0.55, { talk: scTalk(S, t, 'clive'), mood: 'neutral', look: look || 0 });
      op(flag, 1); tr(flag, x + 66, y + 10, 0.75, 6 * Math.sin(t * 2.2) * AMP);
    };

    /* ---------- A: whole leaf ---------- */
    if (sid === 'leaf') {
      const flat = P(t, mid('shape', 0.56), 0.7);
      const sy = lerp(1, 0.05, flat);
      leafG.setAttribute('transform', `translate(360 400) scale(1 ${sy.toFixed(4)})`);
      raysA.forEach((a, i) => { a.set(P(t, mid('shape', 0.1 + i * 0.05), 0.5)); op(a, 1 - flat); });
      op(thinMark, P(t, mid('shape', 0.7), 0.3, linear));
      tourPop(cBroad, P(t, mid('shape', 0.22), 0.45, pop) * (1 - flat), 640, 170);
      tourPop(cThin, P(t, mid('shape', 0.68), 0.45, pop), 640, 590);
      guide(150, 620, 1);
      op(flash, Math.max(0, 1 - Math.abs(t - (end('shape') - 0.35)) / 0.18) * 0.9);
    }

    /* ---------- B: the section, floor by floor ---------- */
    if (sid === 'sec') {
      const cam = secCam(t);
      tourCam(secWrap, cam);
      sec.set({ t, sun: 1 });
      // which floor
      const fl = t < at('roof') - 0.2 ? 'sec' : t < at('top') - 0.1 ? 'roof' : t < at('spongy') - 0.1 ? 'top' : t < at('doors') - 0.1 ? 'spongy' : 'doors';
      const prevC = { roof: CLV.sec, top: CLV.roof, spongy: CLV.top, doors: CLV.spongy, sec: CLV.sec }[fl], cur = CLV[fl];
      const wp = fl === 'sec' ? 1 : P(t, { roof: at('roof') - 0.2, top: at('top') - 0.1, spongy: at('spongy') - 0.1, doors: at('doors') - 0.1 }[fl], 0.8);
      guide(lerp(prevC[0], cur[0], wp), lerp(prevC[1], cur[1], wp), fl === 'top' ? -0.6 : 0.6);
      op(flash, Math.max(0, 1 - Math.abs(t - (end('shape') - 0.35)) / 0.18) * 0.9);
      if (fl !== 'sec') { const sg = signs[fl]; tourPop(sg, P(t, { roof: at('roof'), top: at('top'), spongy: at('spongy'), doors: at('doors') }[fl] + 0.1, 0.45, pop), 880, 60); }
      if (fl === 'roof') {
        sec.hi('cuticle', P(t, at('roof') + 0.2, 0.4, linear) * (0.75 + 0.25 * wave(t, 0.8)));
        op(lightIn, 0.45 * P(t, mid('roof', 0.35), 0.4, linear));
        const rp = (t - mid('roof', 0.62));
        op(rain, rp > 0 && rp < 1.4 ? 1 : 0);
        if (rp > 0) { const fall = clamp(rp / 0.5); const bx = rp < 0.5 ? 380 : 380 - (rp - 0.5) * 120, by = rp < 0.5 ? lerp(-40, 98, fall * fall) : 98 - Math.sin(Math.PI * clamp((rp - 0.5) / 0.9)) * 70; tr(rain, bx, by, 1, rp > 0.5 ? -30 : 0); }
        tourPop(ch.clear, P(t, mid('roof', 0.38), 0.45, pop), 840, 440);
        tourPop(ch.wp, P(t, mid('roof', 0.66), 0.45, pop), 840, 520);
      }
      if (fl === 'top') {
        sec.hi('palisade', P(t, at('top') + 0.1, 0.4, linear) * (0.75 + 0.25 * wave(t, 0.8)));
        op(twinkles, 1); tws.forEach((w, i) => { const k = wave(t, 0.9, i * 0.31); tr(w.s, w.x, w.y, 0.4 + 0.8 * k, (t * 50) % 360); });
        op(vip, P(t, mid('top', 0.12), 0.4, linear));
        op(lightIn, 0.35);
        tourPop(ch.packed, P(t, mid('top', 0.3), 0.45, pop), 840, 520);
        tourPop(ch.first, P(t, mid('top', 0.5), 0.45, pop), 840, 595);
        tourPop(ch.most, P(t, mid('top', 0.74), 0.45, pop), 800, 670);
      }
      if (fl === 'spongy') {
        sec.hi('spongy', P(t, at('spongy') + 0.1, 0.4, linear) * (0.75 + 0.25 * wave(t, 0.8)));
        op(airBlue, P(t, mid('spongy', 0.4), 0.5, linear) * (0.75 + 0.25 * wave(t, 1.1)));
        op(gases, P(t, mid('spongy', 0.5), 0.4, linear));
        gasM.forEach((m, i) => { const q = ((t * 0.08 + i / 4) % 1); tr(m, 80 + q * 1040, 380 + 40 * Math.sin(q * 20 + i) + (i % 2) * 50, 1, t * 40 + i * 60); });
        tourPop(ch.air, P(t, mid('spongy', 0.45), 0.45, pop), 720, 660);
      }
      if (fl === 'doors') {
        const hp = P(t, at('doors') + 0.3, 0.4, linear) * (0.75 + 0.25 * wave(t, 0.8));
        sec.hi('lower', hp * (1 - P(t, mid('doors', 0.5), 0.3, linear))); sec.hi('stoma', P(t, mid('doors', 0.45), 0.3, linear) * (0.75 + 0.25 * wave(t, 0.8)));
        tourPop(ch.under, P(t, mid('doors', 0.12), 0.45, pop), 780, 690);
        tourPop(ch.pores, P(t, mid('doors', 0.5), 0.45, pop), 780, 530);
        tourPop(ch.one, P(t, mid('doors', 0.82), 0.45, pop), 780, 605);
      }
    }

    /* ---------- C: the stoma door ---------- */
    if (sid === 'door') {
      let k = 1;
      if (t >= at('talk') - 0.1) k = 1 + 0.14 * P(t, at('talk'), at('cosmo') - 0.1 - at('talk'), linear);
      if (t >= at('cosmo') - 0.1) k = 1.14 - 0.14 * P(t, at('cosmo') - 0.1, 0.6);
      tourCam(doorShot, [k, 600, 400, 600, 400]);
      const pl = (x, y) => [600 + k * (x - 600), 400 + k * (y - 400)];
      let open = 1;
      if (t < at('talk')) open = t < mid('guards', 0.42) ? 0.35 : t < mid('guards', 0.56) ? lerp(0.35, 1, P(t, mid('guards', 0.42), 0.4)) : t < mid('guards', 0.76) ? lerp(1, 0, P(t, mid('guards', 0.56), 0.4)) : P(t, mid('guards', 0.76), 0.5);
      const frozen = t >= at('talk') - 0.1 && t < at('cosmo') - 0.1;
      const [gx, gy] = pl(600, 380);
      op(guards, 1); tr(guards, gx, gy, 1.55 * k);
      guards.set({ t: frozen ? 0.5 : t, talk: 0, mood: 'deadpan', look: t > at('cosmo') ? 0 : 0.6, open, still: frozen });
      const [cx, cy] = pl(1040, 560);
      show(clive, cx, cy, 0.5 * k, { talk: scTalk(S, t, 'clive'), mood: frozen ? 'deadpan' : 'neutral', look: -1 });
      lt.guards.set(win(t, at('guards') + 0.15, at('guards') + 3.4, 0.3));
      const cv = t < at('cosmo') - 0.1 ? 1 : 1 - P(t, at('cosmo') - 0.1, 0.25, linear);
      tourPop(cGc, P(t, mid('guards', 0.4), 0.45, pop) * cv, 820, 112);
      tourPop(cCtl, P(t, mid('guards', 0.7), 0.45, pop) * cv, 820, 176);
      if (t >= at('cosmo') - 0.4) {
        const p = P(t, at('cosmo') - 0.4, 1.8, easeOut);
        show(cosmo, 600, lerp(390, 590, p), lerp(0.04, 0.95, p), { talk: scTalk(S, t, 'cosmo'), mood: 'smug', look: 0 }, 10 * Math.sin(t * 1.3) * AMP + 160 * (1 - p));
        lt.cosmo.set(win(t, at('cosmo') + 0.15, at('cosmo') + 3.4, 0.3));
        tourPop(cCO2, P(t, mid('cosmo', 0.45), 0.45, pop), 820, 112);
      }
    }

    /* ---------- D: diffusion ---------- */
    if (sid === 'diff') {
      const cam = [1.1, 600, 540, 600, 400];
      tourCam(secWrap, cam); sec.set({ t, sun: 1 });
      sec.hi('stoma', 0.6);
      op(diffG, 1);
      outM.forEach((o, i) => tr(o.m, o.x + 26 * Math.sin(t * 0.9 * AMP + o.a), o.y + 18 * Math.cos(t * 0.7 * AMP + o.a * 1.3), 1, (t * 30 + i * 40) % 360));
      inM.forEach((o, i) => tr(o.m, o.x + 22 * Math.sin(t * 0.8 * AMP + o.a), o.y + 12 * Math.cos(t * 0.6 * AMP + o.a), 1, (t * 30 + i * 70) % 360));
      thruM.forEach((m, i) => { const q = ((t - at('diffuse')) * 0.28 + i * 0.5) % 1; tr(m, 600 + 10 * Math.sin(q * 9), lerp(720, 380, q), 1, q * 200); op(m, t < at('diffuse') ? 0 : Math.min(1, Math.sin(Math.PI * q) * 3)); });
      op(diffArrow, P(t, mid('diffuse', 0.35), 0.2, linear)); diffArrow.set(P(t, mid('diffuse', 0.35), 0.8));
      const cp = P(t, at('diffuse') - 0.1, end('diffuse') - at('diffuse') + 0.4, linear);
      show(cosmo, 600 + 30 * Math.sin(t * 1.2) * AMP, lerp(680, 250, cp), 0.38, { talk: scTalk(S, t, 'cosmo'), mood: 'smug', look: 0 }, (t * 20) % 360 * (S.reduce ? 0.2 : 1));
      tourPop(cDiff, P(t, mid('diffuse', 0.12), 0.45, pop), 920, 200);
      tourPop(cOut, P(t, mid('diffuse', 0.45), 0.45, pop), 280, 690);
      tourPop(cIn, P(t, mid('diffuse', 0.72), 0.45, pop), 280, 150);
      tourPop(cHiLo, P(t, mid('diffuse', 0.8), 0.45, pop), 920, 280);
    }

    /* ---------- E: no energy (pool float) ---------- */
    if (sid === 'effort') {
      const push = P(t, end('effort') - 0.2, at('dewi') - end('effort'), linear);
      tourCam(secWrap, [2.0 * (1 + 0.08 * push), 330, 440, 600, 420]); sec.set({ t, sun: 1 });
      op(airBlue, 0.9);
      const dx = 40 * Math.sin(t * 0.5) * AMP, dy = 6 * Math.sin(t * 1.4) * AMP;
      op(floatRing, 1); tr(floatRing, 600 + dx, 490 + dy);
      show(cosmo, 600 + dx, 440 + dy, 0.85, { talk: scTalk(S, t, 'cosmo'), mood: 'smug', look: 0, still: true }, -14 + 3 * Math.sin(t * 0.9) * AMP);
      tourPop(cNoE, P(t, mid('effort', 0.2), 0.45, pop), 600, 170);
      show(clive, 1050, 610, 0.55 * (1 + 0.08 * push), { talk: 0, mood: 'deadpan', look: -1 });
    }

    /* ---------- F: Dewi out of the pipe ---------- */
    if (sid === 'pipe') {
      op(xylem, 1); tr(xylem, 600, 770); xylem.upd(t, 1.6);
      const p = P(t, at('dewi') - 0.1, 0.55, pop);
      const panic = t < mid('dewi', 0.35);
      show(dewi, 600 + (panic ? 4 * Math.sin(t * 40) * AMP : 0), lerp(430, 230, p), 0.85, { talk: scTalk(S, t, 'dewi'), mood: panic ? 'shock' : 'happy', look: panic ? 0 : -0.3, sweat: 1 });
      splash.forEach((d, i) => { const q = P(t, at('dewi') + 0.05, 0.8, easeOut), a = -Math.PI * (0.15 + 0.7 * i / 3); op(d, q > 0 && q < 1 ? 1 - q : 0); tr(d, 600 + Math.cos(a) * 170 * q, 300 + Math.sin(a) * 130 * q + 120 * q * q, 1, a * 57 + 90); });
      tourPop(signs.pipes, P(t, at('dewi') + 0.3, 0.45, pop), 880, 60);
      lt.dewi.set(win(t, at('dewi') + 0.15, at('dewi') + 3.4, 0.3));
      tourPop(cWater, P(t, mid('dewi', 0.3), 0.45, pop), 920, 250);
      show(clive, 1030, 590, 0.55, { talk: 0, mood: 'deadpan', look: -1 });
    }

    /* ---------- G: roots and xylem ---------- */
    if (sid === 'roots') {
      op(xylem, 1); tr(xylem, 610, 760); xylem.upd(t, 1.6);
      soilW.forEach((w, i) => {
        const q = ((t * 0.18) + w.ph) % 1, tx = 610, ty = w.y;
        tr(w.m, lerp(w.x, tx, q), lerp(w.y, ty - 40, q), 1, (t * 40 + i * 50) % 360); op(w.m, Math.min(1, (1 - q) * 5, q * 8));
      });
      const up = P(t, at('roots') - 0.1, end('roots') - at('roots') + 0.6, linear);
      show(dewi, 610, lerp(720, 120, up), 0.27, { talk: scTalk(S, t, 'dewi'), mood: 'happy', look: 0, sweat: 1 });
      op(lbRoot, P(t, mid('roots', 0.12), 0.35, linear));
      op(lbXy, P(t, mid('roots', 0.62), 0.35, linear));
    }

    /* ---------- H: bedroom ---------- */
    if (sid === 'up' || sid === 'transp') {
      bed.set({ t });
      if (sid === 'up') {
        const k = 1 + 0.06 * P(t, s0, at('straw') - s0, linear);
        tourCam(bedWrap, [k, 860, 520, 860, 520]);
        show(kav, 860 + k * 10, 520 + k * 50, 1.4 * k, { talk: scTalk(S, t, 'kavya'), mood: 'annoyed', look: -0.8 });
        tourPop(cUp, P(t, mid('up', 0.3), 0.45, pop), 360, 180, 1, -3);
      } else {
        const k = 1.45 + 0.08 * P(t, s0, 3, linear);
        tourCam(bedWrap, [k, PX + 40, PY - 170, 430, 400]);
        op(giant, P(t, mid('transp', 0.32), 0.25, linear));
        vapour.forEach((v, i) => { const q = ((t * 0.35) + i / 3) % 1; op(v, Math.sin(Math.PI * q)); tr(v, PX - 60 + i * 60 + 10 * Math.sin(q * 6), PY - 200 - q * 120); });
        tourPop(cTr, P(t, mid('transp', 0.08), 0.45, pop), 870, 200);
      }
    }

    /* ---------- I: split screen ---------- */
    if (sid === 'straw') {
      op(divider, 1);
      const k = 1.25;
      show(kav, 300, 500, k, { talk: 0, mood: 'happy', look: 0.5 });
      op(tea, 1); tr(tea, 287, 742); tea.set(lerp(0.9, 0.25, P(t, at('straw'), end('straw') - at('straw'), linear)));
      op(slurp, wave(t, 0.5)); tr(slurp, 330, 500);
      tourPop(cStraw, P(t, mid('straw', 0.72), 0.45, pop), 300, 150);
      op(xylem, 1); tr(xylem, 910, 640, 0.8); xylem.upd(t, 2.2);
      evap.forEach((v, i) => { const q = ((t * 0.4) + i / 3) % 1; op(v, Math.sin(Math.PI * q)); tr(v, 1090 + 20 * q + 8 * Math.sin(q * 8 + i), 175 - q * 120, 0.9); });
      tourPop(cEvap, P(t, mid('straw', 0.1), 0.45, pop), 900, 66);
      tourPop(cPull, P(t, mid('straw', 0.35), 0.45, pop), 1080, 360);
      op(upArr, P(t, mid('straw', 0.35), 0.2, linear)); upArr.set(P(t, mid('straw', 0.35), 0.7));
    }

    /* ---------- J: Clive deadpan ---------- */
    if (sid === 'tconf') {
      const k = 1.15 + 0.12 * P(t, s0, at('veins') - s0, linear);
      tourCam(conf, [k, 430, 380, 430, 380]);
      show(clive, 430, 380 + k * 20, 1.5 * k, { talk: scTalk(S, t, 'clive'), mood: 'deadpan', look: 0 });
      op(cTr2, 1); tr(cTr2, 900, 560);
    }

    /* ---------- K: the vein ---------- */
    if (sid === 'veins') {
      const kk = 1.6 + 0.4 * P(t, s0, 1.0);
      tourCam(secWrap, [kk, 880, 432, 700, 420]); sec.set({ t, sun: 1 });
      sec.hi('vein', P(t, at('veins'), 0.3, linear) * (1 - P(t, mid('veins', 0.1), 0.3, linear)) + 0.5 * P(t, mid('veins', 0.85), 0.3, linear));
      sec.hi('xylem', P(t, mid('veins', 0.1), 0.3, linear) * (0.75 + 0.25 * wave(t, 0.8)));
      sec.hi('phloem', P(t, mid('veins', 0.45), 0.3, linear) * (0.75 + 0.25 * wave(t, 0.8)));
      op(flowG, 1);
      const ip = P(t, mid('veins', 0.1), 0.6), opp = P(t, mid('veins', 0.45), 0.6);
      op(inArrow, ip > 0 ? 1 : 0); inArrow.set(ip); op(outArrow, opp > 0 ? 1 : 0); outArrow.set(opp);
      wDots.forEach((d, i) => { const q = ((t * 0.5) + i / 3) % 1; op(d, ip >= 1 ? Math.sin(Math.PI * q) : 0); tr(d, lerp(200, 540, q), lerp(300, 330, q)); });
      gDots.forEach((d, i) => { const q = ((t * 0.5) + i / 3) % 1; op(d, opp >= 1 ? Math.sin(Math.PI * q) : 0); tr(d, lerp(860, 1120, q), lerp(560, 615, q), 1, q * 90); });
      tourPop(cXy, P(t, mid('veins', 0.12), 0.45, pop), 330, 250);
      tourPop(cPh, P(t, mid('veins', 0.47), 0.45, pop), 960, 660);
      tourPop(cVeins, P(t, mid('veins', 0.78), 0.45, pop), 960, 200);
      guide(150, 620, 1);
    }
  };
});
