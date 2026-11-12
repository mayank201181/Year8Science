/* Scene 6: Test day, bad hair day.
   Kavya's flat, Monday morning: combing (×31) -> hair stands on end -> zoom: Eddies hop from hair to
   comb (friction) -> STATIC ELECTRICITY card -> comb NEGATIVE, hair POSITIVE -> only electrons move
   (bored + charges) -> LIKE repel / UNLIKE attract -> her strands, all +, repelling -> Nora on a video
   call, smug -> the comb picks up paper bits -> earthing (a dome, then a fuel tanker) -> afternoon storm
   over HDB blocks -> lightning = a giant static spark (Cecil inset) -> 10:00, the test circuit (Amy in
   series, Vic across the lamp, it lights) -> FULL MARKS -> Dimitri thanks himself. */
scene('static', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;

  /* ---------- local helpers (prefixed st) ---------- */
  const stCam = (el, cx, cy, k, px, py) => el.setAttribute('transform', `translate(${(px ?? cx).toFixed(1)} ${(py ?? cy).toFixed(1)}) scale(${k.toFixed(4)}) translate(${(-cx).toFixed(1)} ${(-cy).toFixed(1)})`);
  const stPop = (el, t, t0, x, y, s, r) => { const p = P(t, t0, 0.45, pop); op(el, clamp(p * 2.5)); tr(el, x, y, Math.max(0.01, (s || 1) * (0.6 + 0.4 * p)), r); return p; };
  const stChip = (parent, text, o) => {
    o = o || {};
    return chip(parent, text, { size: o.size || 30, fill: o.fill || 'rgba(10,27,39,0.9)', stroke: o.stroke || C.line, sw: o.sw || 2, color: o.color || C.ink, weight: o.weight || 700 });
  };
  const stPaper = (parent, w, h, o) => {
    o = o || {};
    const g = G(parent);
    E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: 14, fill: o.fill || '#FFFFFF', stroke: SC_INK, 'stroke-width': 4 }, g);
    if (o.head) {
      E('path', { d: `M${-w / 2 + 14},${-h / 2} L${w / 2 - 14},${-h / 2} Q${w / 2},${-h / 2} ${w / 2},${-h / 2 + 14} L${w / 2},${-h / 2 + 50} L${-w / 2},${-h / 2 + 50} L${-w / 2},${-h / 2 + 14} Q${-w / 2},${-h / 2} ${-w / 2 + 14},${-h / 2} Z`, fill: o.headCol || DR_RED }, g);
      T(g, 0, -h / 2 + 36, o.head, { size: 28, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
    }
    return g;
  };
  // a wire with moving current dots drawn as one dashed path (cheap); g.set(on), g.upd(t, speed)
  const stWire = (parent, pts, o) => {
    o = o || {};
    const g = G(parent), d = 'M' + pts.map(q => q[0] + ',' + q[1]).join(' L'), sp = o.spacing || 46;
    E('path', { d, fill: 'none', stroke: WIRE, 'stroke-width': 5, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, g);
    const dots = E('path', { d, fill: 'none', stroke: C.energy, 'stroke-width': 11, 'stroke-linecap': 'round', 'stroke-dasharray': `0 ${sp}` }, g);
    g.set = v => op(dots, v);
    g.upd = (t, speed) => attr(dots, 'stroke-dashoffset', -((t * (speed === undefined ? 60 : speed)) % sp));
    return g;
  };
  // a charge ball: '+' red or '−' blue
  const stCharge = (parent, sign, r) => {
    r = r || 30;
    const g = G(parent), pos = sign === '+';
    E('circle', { r, fill: ball(pos ? '#FF7A80' : '#6FB4FF', pos ? '#B32635' : '#1F5FB8'), stroke: SC_INK, 'stroke-width': 3 }, g);
    T(g, 0, r * 0.42, pos ? '+' : '−', { size: r * 1.3, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
    return g;
  };
  // a bored + charge: half-closed eyes, flat mouth; g.set(blink)
  const stBored = (parent) => {
    const g = G(parent);
    E('circle', { r: 26, fill: ball('#FF7A80', '#B32635'), stroke: SC_INK, 'stroke-width': 3 }, g);
    T(g, 0, 22, '+', { size: 26, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
    const eyes = E('path', { d: 'M-15,-6 L-5,-6 M5,-6 L15,-6', stroke: SC_INK, 'stroke-width': 4, 'stroke-linecap': 'round' }, g);
    E('path', { d: 'M-8,6 L8,6', stroke: SC_INK, 'stroke-width': 3, 'stroke-linecap': 'round' }, g);
    g.set = b => attr(eyes, 'd', b > 0.5 ? 'M-15,-5 L-5,-5 M5,-5 L15,-5' : 'M-15,-8 Q-10,-3 -5,-8 M5,-8 Q10,-3 15,-8');
    return g;
  };
  // a hop of an electron from (x0,y0) to (x1,y1), arcing up by h, over [t0, t0 + d]
  const stHop = (e, t, t0, d, x0, y0, x1, y1, h) => { const p = P(t, t0, d, ease); tr(e, lerp(x0, x1, p), lerp(y0, y1, p) - Math.sin(p * Math.PI) * h); return p; };

  /* ---------- layers ---------- */
  const world = G(root), Lbg = G(world), Lmid = G(world), Lcast = G(world), Lfg = G(world), hud = G(root);

  /* ================= sets ================= */
  const flat = drFlat(Lbg);
  const morning = G(Lbg);              // the flat's window, in the morning
  E('rect', { x: 145, y: 155, width: 350, height: 250, fill: linGrad('#8FD0F4', '#FFE9C2', true) }, morning);
  E('circle', { cx: 420, cy: 220, r: 34, fill: '#FFE066' }, morning);
  E('path', { d: 'M170,405 L170,250 L250,250 L250,405 Z M280,405 L280,210 L370,210 L370,405 Z M390,405 L390,280 L470,280 L470,405 Z', fill: '#E9D6B6', stroke: '#B8A07A', 'stroke-width': 2 }, morning);
  let mw = ''; for (const [x, y, w, h] of [[170, 250, 80, 155], [280, 210, 90, 195], [390, 280, 80, 125]]) for (let yy = y + 14; yy < y + h - 8; yy += 22) mw += `M${x + 10},${yy} L${x + w - 10},${yy} `;
  E('path', { d: mw, stroke: '#B8A07A', 'stroke-width': 4, opacity: 0.6 }, morning);
  E('path', { d: 'M320,150 L320,410', stroke: '#FFFFFF', 'stroke-width': 6 }, morning);
  const benchBg = G(Lbg); drBench(benchBg);
  const lab = G(Lbg); drLab(lab);
  const drawer = G(Lbg); drDrawer(drawer);
  // desk (paper bits)
  const desk = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#E8D9BE', '#D6C29E', true) }, desk);
  E('rect', { x: 0, y: 470, width: 1200, height: 280, fill: linGrad('#B7834E', '#8A5A30', true) }, desk);
  E('path', { d: 'M0,520 C300,530 700,510 1200,525 M0,610 C400,600 800,625 1200,610 M0,690 C300,700 900,680 1200,695', fill: 'none', stroke: '#7A4E28', 'stroke-width': 3, opacity: 0.5 }, desk);
  // storm over the HDB blocks, seen through Kavya's window
  const storm = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#2A3346', '#56627A', true) }, storm);
  const flashBg = E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#DCE6FF' }, storm);
  E('path', { d: 'M60,620 L60,330 L200,330 L200,620 Z M260,620 L260,250 L420,250 L420,620 Z M690,620 L690,300 L840,300 L840,620 Z M900,620 L900,360 L1060,360 L1060,620 Z', fill: '#3A4458', stroke: '#2A3040', 'stroke-width': 3 }, storm);
  { let d = ''; const r = rng(31); for (const [x, y, w, h] of [[60, 330, 140, 290], [260, 250, 160, 370], [690, 300, 150, 320], [900, 360, 160, 260]]) for (let yy = y + 16; yy < y + h - 10; yy += 26) for (let xx = x + 14; xx < x + w - 14; xx += 30) if (r() > 0.5) d += `M${xx},${yy} h14 v10 h-14 Z `; E('path', { d, fill: '#FFE6A0', opacity: 0.85 }, storm); }
  E('rect', { x: 0, y: 620, width: 1200, height: 130, fill: '#2F3A2E' }, storm);
  const cloud = G(storm);
  E('path', { d: 'M80,200 Q60,120 160,110 Q200,40 320,70 Q420,20 520,80 Q640,40 720,100 Q840,70 900,140 Q1020,130 1040,200 Q1100,240 1000,250 L120,250 Q20,250 80,200 Z', fill: '#4B5468', stroke: '#2A3040', 'stroke-width': 4 }, cloud);
  const cloudMinus = G(cloud);
  T(cloudMinus, 590, 238, '−'.repeat(9), { size: 40, weight: 800, anchor: 'middle', fill: '#8FC4FF', ls: 64 });
  const groundPlus = G(storm);
  T(groundPlus, 590, 650, '+'.repeat(9), { size: 36, weight: 800, anchor: 'middle', fill: '#FF9A9F', ls: 64 });
  const rain = E('path', { d: '', stroke: '#9FB6D8', 'stroke-width': 3, opacity: 0.7, 'stroke-linecap': 'round' }, storm);
  const RAIN = []; { const r = rng(7); for (let i = 0; i < 70; i++) RAIN.push([r() * 1260, r() * 750, 0.7 + r() * 0.6]); }
  const bigBolt = E('path', { d: 'M560,250 L520,340 L575,350 L510,470 L560,478 L470,620', fill: 'none', stroke: '#FFFBD0', 'stroke-width': 12, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, storm);
  const boltGlow = E('ellipse', { cx: 520, cy: 430, rx: 200, ry: 260, fill: glow('#FFFBD0') }, storm);
  const winFrame = G(storm);
  E('path', { d: 'M0,0 L1200,0 L1200,750 L0,750 Z M60,50 L1140,50 L1140,700 L60,700 Z', fill: '#E9E2D0', 'fill-rule': 'evenodd', stroke: '#B8A98A', 'stroke-width': 4 }, winFrame);
  E('path', { d: 'M600,50 L600,700 M60,375 L1140,375', stroke: '#E9E2D0', 'stroke-width': 18 }, winFrame);

  /* ================= props ================= */
  // hair strands, drawn inside Kavya (follows her bob)
  const kav = cast(Lcast, 'kavya', { mood: 'neutral' });
  const kIn = kav.firstChild;
  const strandP = E('path', { d: '', fill: 'none', stroke: '#1E1410', 'stroke-width': 6, 'stroke-linecap': 'round' }, kIn);
  const plusG = G(kIn), PLUS = [];
  for (let i = 0; i < 6; i++) PLUS.push(T(plusG, 0, 0, '+', { size: 30, weight: 800, anchor: 'middle', fill: '#FF5A60' }));
  const repelP = E('path', { d: '', fill: 'none', stroke: C.energy, 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, kIn);
  const NS = 21, SA = [];
  for (let i = 0; i < NS; i++) SA.push(-160 + i * (140 / (NS - 1)));
  function stHair(frizz, t, plus, rep) {
    let d = '', tips = [];
    SA.forEach((a, i) => {
      const r = a * Math.PI / 180, cx = 0, cy = -34;
      const x0 = cx + 70 * Math.cos(r), y0 = cy + 78 * Math.sin(r);
      const L = 6 + 74 * frizz + 8 * Math.sin(i * 1.7) * frizz;
      const wob = (1 - frizz) * 0.9 + Math.sin(t * 3 + i) * 0.04 * AMP;
      const dx = Math.cos(r + wob * (i % 2 ? 1 : -1) * 0.6), dy = Math.sin(r);
      const x1 = x0 + dx * L, y1 = y0 + dy * L;
      d += `M${x0.toFixed(1)},${y0.toFixed(1)} Q${(x0 + dx * L * 0.5 + Math.sin(i) * 6).toFixed(1)},${(y0 + dy * L * 0.5).toFixed(1)} ${x1.toFixed(1)},${y1.toFixed(1)} `;
      tips.push([x1, y1, r]);
    });
    attr(strandP, 'd', frizz < 0.01 ? '' : d);
    PLUS.forEach((p, k) => { const [x, y, r] = tips[2 + k * 3]; attr(p, 'x', x + Math.cos(r) * 18); attr(p, 'y', y + Math.sin(r) * 18 + 10); });
    op(plusG, plus);
    let rd = '';
    if (rep > 0) for (let k = 0; k < 5; k++) {
      const [x, y, r] = tips[3 + k * 3], rr = r + 0.11;
      const ex = x + Math.cos(rr) * 34, ey = y + Math.sin(rr) * 34, tx = -Math.sin(rr), ty = Math.cos(rr), h = 13 + 4 * Math.sin(t * 6 + k) * AMP;
      rd += `M${(ex - tx * h).toFixed(1)},${(ey - ty * h).toFixed(1)} L${(ex + tx * h).toFixed(1)},${(ey + ty * h).toFixed(1)} `;
      rd += `M${(ex - tx * h + tx * 8 - ty * 6).toFixed(1)},${(ey - ty * h + ty * 8 + tx * 6).toFixed(1)} L${(ex - tx * h).toFixed(1)},${(ey - ty * h).toFixed(1)} L${(ex - tx * h + tx * 8 + ty * 6).toFixed(1)},${(ey - ty * h + ty * 8 - tx * 6).toFixed(1)} `;
      rd += `M${(ex + tx * h - tx * 8 - ty * 6).toFixed(1)},${(ey + ty * h - ty * 8 + tx * 6).toFixed(1)} L${(ex + tx * h).toFixed(1)},${(ey + ty * h).toFixed(1)} L${(ex + tx * h - tx * 8 + ty * 6).toFixed(1)},${(ey + ty * h - ty * 8 - tx * 6).toFixed(1)} `;
    }
    attr(repelP, 'd', rd); op(repelP, rep);
  }
  const comb = drComb(Lfg);
  // the zoom circle: comb teeth and hair strands
  const zoom = G(Lmid);
  const zid = 'stZoomClip';
  { const cp = E('clipPath', { id: zid }, defs()); E('circle', { cx: 420, cy: 400, r: 250 }, cp); }
  const zIn = G(zoom, { 'clip-path': `url(#${zid})` });
  E('circle', { cx: 420, cy: 400, r: 250, fill: '#F3E3C8' }, zIn);
  const zComb = drComb(zIn); tr(zComb, 420, 230, 2.6);
  { let d = ''; for (let i = 0; i < 8; i++) { const x = 220 + i * 56; d += `M${x},660 C${x - 30},560 ${x + 34},480 ${x + 4},${380 + (i % 3) * 14} `; } E('path', { d, fill: 'none', stroke: '#2B1D14', 'stroke-width': 14, 'stroke-linecap': 'round' }, zIn); }
  E('circle', { cx: 420, cy: 400, r: 250, fill: 'none', stroke: '#FFFFFF', 'stroke-width': 8 }, zoom);
  const zLblC = stChip(zoom, 'plastic comb', { size: 28, color: '#D9C4FF', stroke: '#7E57C2' }); tr(zLblC, 300, 140);
  const zLblH = stChip(zoom, 'hair', { size: 28 }); tr(zLblH, 230, 640);
  // pool of electrons (tiny Eddies)
  const EL = []; for (let i = 0; i < 7; i++) EL.push(drElectron(Lfg, 17));
  // static card: a comb with Eddies sitting still vs a wire loop with flowing dots
  const stCard = G(Lmid);
  const stTitle = T(stCard, 600, 200, 'STATIC ELECTRICITY', { size: 62, weight: 800, anchor: 'middle', fill: C.energy, ls: 2 });
  const stDef = T(stCard, 600, 262, 'charge that builds up and **STAYS PUT**', { size: 36, weight: 600, anchor: 'middle', boldFill: '#9FD8FF' });
  const stL = G(stCard), stR = G(stCard);
  card(stL, 140, 330, 440, 300, { fill: C.card, stroke: '#9FD8FF' });
  const stComb = drComb(stL); tr(stComb, 360, 470, 1.5);
  T(stL, 360, 600, 'static: stays put', { size: 32, weight: 800, anchor: 'middle', fill: '#9FD8FF' });
  const zzz = T(stL, 520, 400, 'z z z', { size: 30, weight: 700, anchor: 'middle', fill: C.muted });
  card(stR, 620, 330, 440, 300, { fill: C.card, stroke: C.line });
  const loopW = stWire(stR, [[700, 380], [980, 380], [980, 540], [700, 540], [700, 380]], { spacing: 40 });
  T(stR, 840, 600, 'current: flows round', { size: 32, weight: 800, anchor: 'middle', fill: C.muted });
  // gained / lost card
  const gnG = G(Lmid);
  const gnComb = G(gnG); const gc = drComb(gnComb); tr(gc, 0, 0, 1.8);
  T(gnComb, 14, -76, '−'.repeat(6), { size: 54, weight: 800, anchor: 'middle', fill: '#6FB4FF', ls: 28 });
  const gnHair = G(gnG);
  { let d = ''; for (let i = 0; i < 6; i++) { const x = -110 + i * 44; d += `M${x},120 C${x - 24},40 ${x + 28},-20 ${x + 4},-90 `; } E('path', { d, fill: 'none', stroke: '#2B1D14', 'stroke-width': 12, 'stroke-linecap': 'round' }, gnHair); }
  for (let i = 0; i < 5; i++) T(gnHair, -96 + i * 48, i % 2 ? -20 : 40, '+', { size: 50, weight: 800, anchor: 'middle', fill: '#FF6B70' });
  const gnArrow = G(gnG);
  arrow(gnArrow, 820, 200, 420, 200, { color: '#6FB4FF', width: 7, bend: -60 });
  T(gnArrow, 620, 150, 'electrons', { size: 30, weight: 800, anchor: 'middle', fill: '#6FB4FF' });
  // only electrons move: bored + charges in the hair
  const onlyG = G(Lmid);
  const onlyHair = G(onlyG);
  { let d = ''; for (let i = 0; i < 6; i++) { const x = 220 + i * 60; d += `M${x},680 C${x - 26},600 ${x + 30},540 ${x + 4},470 `; } E('path', { d, fill: 'none', stroke: '#2B1D14', 'stroke-width': 13, 'stroke-linecap': 'round' }, onlyHair); }
  const onlyComb = drComb(onlyG); tr(onlyComb, 380, 240, 1.9);
  const BORED = [[250, 600], [340, 560], [430, 610], [520, 570]].map(([x, y]) => { const b = stBored(onlyG); tr(b, x, y); return b; });
  // like / unlike card
  const likeG = G(Lmid);
  const likeA = G(likeG), likeB = G(likeG);
  card(likeA, 150, 140, 900, 230, { fill: C.card, stroke: C.line });
  T(likeA, 600, 200, '**LIKE** charges **REPEL**', { size: 44, weight: 600, anchor: 'middle', boldFill: C.energy });
  const lA1 = stCharge(likeA, '+'), lA2 = stCharge(likeA, '+'), lA3 = stCharge(likeA, '−'), lA4 = stCharge(likeA, '−');
  const likeArr = E('path', { d: '', fill: 'none', stroke: C.energy, 'stroke-width': 6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, likeA);
  card(likeB, 150, 400, 900, 230, { fill: C.card, stroke: C.line });
  T(likeB, 600, 460, '**UNLIKE** charges **ATTRACT**', { size: 44, weight: 600, anchor: 'middle', boldFill: C.good });
  const lB1 = stCharge(likeB, '+'), lB2 = stCharge(likeB, '−');
  const unlikeArr = E('path', { d: '', fill: 'none', stroke: C.good, 'stroke-width': 6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, likeB);
  const twoArrows = (x1, x2, y, out) => {      // a pair of arrows at x1 and x2, pointing apart (out) or together
    const s = out ? 1 : -1, L = 34;
    const a = (x, dir) => `M${x - dir * L / 2},${y} L${x + dir * L / 2},${y} M${x + dir * L / 2 - dir * 12},${y - 10} L${x + dir * L / 2},${y} L${x + dir * L / 2 - dir * 12},${y + 10} `;
    return a(x1, -s) + a(x2, s);
  };
  // video call (Thursday)
  const call = scVideoCall(Lmid, 380, 230, 'Thursday'); tr(call, 330, 300);
  // paper bits
  const BITS = [[430, 600, 12], [500, 625, -20], [560, 590, 40], [620, 630, 8], [690, 605, -32], [760, 625, 18], [820, 598, -8]];
  const bitG = G(Lfg), bits = BITS.map(() => { const b = E('path', { d: 'M-12,-8 L10,-10 L14,6 L-6,10 Z', fill: '#FFFFFF', stroke: '#9AA6B2', 'stroke-width': 2 }, bitG); return b; });
  const combMinus = T(Lfg, 0, 0, '−  −  −  −  −', { size: 40, weight: 800, anchor: 'middle', fill: '#3F7BE0' });
  // earthing: a charged dome, then a fuel tanker
  const earthA = G(Lmid);
  E('path', { d: 'M350,390 L350,600', stroke: '#C9D3DC', 'stroke-width': 8 }, earthA);
  E('path', { d: 'M300,600 L400,600 M318,618 L382,618 M336,636 L364,636', stroke: '#C9D3DC', 'stroke-width': 7, 'stroke-linecap': 'round' }, earthA);
  E('rect', { x: 330, y: 380, width: 40, height: 30, fill: '#8E9BA8' }, earthA);
  E('circle', { cx: 350, cy: 300, r: 92, fill: ball('#E6EBF0', '#7A8794'), stroke: SC_INK, 'stroke-width': 4 }, earthA);
  const eaWire = T(earthA, 380, 520, 'metal wire', { size: 28, weight: 700, fill: C.ink });
  const eaGround = T(earthA, 430, 630, 'the ground (earth)', { size: 28, weight: 700, fill: '#9FE3B0' });
  const earthB = G(Lmid);
  E('rect', { x: 0, y: 610, width: 1200, height: 140, fill: '#3A4752' }, earthB);
  E('rect', { x: 330, y: 400, width: 520, height: 170, rx: 70, fill: ball('#F2F7FA', '#A9B5C0'), stroke: SC_INK, 'stroke-width': 5 }, earthB);
  T(earthB, 590, 500, 'FUEL', { size: 54, weight: 800, anchor: 'middle', fill: DR_RED });
  E('path', { d: 'M850,570 L850,440 Q850,420 870,420 L960,420 L1010,480 L1010,570 Z', fill: '#E0474C', stroke: SC_INK, 'stroke-width': 5, 'stroke-linejoin': 'round' }, earthB);
  E('path', { d: 'M880,440 L950,440 L985,480 L880,480 Z', fill: '#BFE7FA', stroke: SC_INK, 'stroke-width': 3 }, earthB);
  E('rect', { x: 320, y: 560, width: 700, height: 22, fill: '#56636E' }, earthB);
  [[400, 600], [520, 600], [760, 600], [950, 600]].forEach(([x, y]) => E('circle', { cx: x, cy: y, r: 30, fill: '#2A2F36', stroke: SC_INK, 'stroke-width': 4 }, earthB));
  const ecable = E('path', { d: 'M360,570 C330,640 250,610 220,660', fill: 'none', stroke: '#56D69B', 'stroke-width': 7, 'stroke-dasharray': '16 10', 'stroke-linecap': 'round' }, earthB);
  E('path', { d: 'M220,660 L220,700 M190,700 L250,700 M200,714 L240,714 M210,728 L230,728', stroke: '#C9D3DC', 'stroke-width': 6, 'stroke-linecap': 'round' }, earthB);
  const ecLbl = T(earthB, 130, 560, 'earthing cable', { size: 28, weight: 800, fill: '#56D69B' });
  // the test circuit (Cecil, Amy in series, Dimitri, Vic across Dimitri)
  const tc = G(Lmid);
  const tw1 = stWire(tc, [[200, 300], [200, 230], [505, 230]], { spacing: 40 });
  const tw2 = stWire(tc, [[595, 230], [900, 230], [900, 312]], { spacing: 40 });
  const tw3 = stWire(tc, [[900, 446], [900, 540], [200, 540], [200, 442]], { spacing: 40 });
  const vw = G(tc);
  E('path', { d: 'M900,270 L700,270 L700,318 M700,440 L700,500 L900,500', fill: 'none', stroke: '#9FD8FF', 'stroke-width': 5, 'stroke-linejoin': 'round' }, vw);
  E('circle', { cx: 900, cy: 270, r: 8, fill: '#9FD8FF' }, vw); E('circle', { cx: 900, cy: 500, r: 8, fill: '#9FD8FF' }, vw);
  const clockG = G(Lmid);
  E('circle', { r: 70, fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 6 }, clockG);
  { let d = ''; for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; d += `M${(Math.cos(a) * 54).toFixed(1)},${(Math.sin(a) * 54).toFixed(1)} L${(Math.cos(a) * 62).toFixed(1)},${(Math.sin(a) * 62).toFixed(1)} `; } E('path', { d, stroke: SC_INK, 'stroke-width': 4 }, clockG); }
  E('line', { x1: 0, y1: 0, x2: -34, y2: -20, stroke: SC_INK, 'stroke-width': 7, 'stroke-linecap': 'round' }, clockG);   // hour hand at 10
  const minHand = E('line', { x1: 0, y1: 0, x2: 0, y2: -50, stroke: SC_INK, 'stroke-width': 4, 'stroke-linecap': 'round' }, clockG);
  // marks sheet
  const sheet = stPaper(Lfg, 330, 380, { head: 'PRACTICAL TEST', headCol: '#2E7DD8' });
  T(sheet, 0, -40, 'FULL', { size: 64, weight: 800, anchor: 'middle', fill: DR_RED });
  T(sheet, 0, 30, 'MARKS', { size: 64, weight: 800, anchor: 'middle', fill: DR_RED });
  const sheetTick = tick(sheet, 40); tr(sheetTick, 0, 110);
  // Dimitri's spotlight and confetti
  const spot = E('path', { d: 'M520,0 L680,0 L860,640 L340,640 Z', fill: '#FFF3B0', opacity: 0.18 }, Lmid);
  const CONF_COL = ['#FF6070', '#FFE45C', '#56D69B', '#9FD8FF'];
  const confP = CONF_COL.map(c => E('path', { d: '', fill: c }, Lfg));
  const CONF = []; { const r = rng(91); for (let i = 0; i < 64; i++) CONF.push([r() * 1200, r() * 900, 60 + r() * 80, r() * 6, i % 4]); }

  /* ================= cast ================= */
  const eddie = cast(Lcast, 'eddie');
  const mag = cast(Lcast, 'magnet');
  const cecil = cast(Lcast, 'cecil');
  const amy = cast(Lcast, 'amy'), vic = cast(Lcast, 'vic'), dimitri = cast(Lcast, 'dimitri');
  // Cecil's inset box for "sky"
  const cBox = G(Lmid);
  E('rect', { x: 880, y: 380, width: 270, height: 310, rx: 20, fill: linGrad('#101A33', '#23365E', true), stroke: '#FFFFFF', 'stroke-width': 5 }, cBox);
  // Kavya and the tanker etc. must sit above Lmid -> the cast layer already is

  /* ================= HUD ================= */
  const kwMon = stChip(hud, 'MONDAY: TEST DAY', { size: 38, fill: DR_GOLD, color: SC_INK, stroke: '#FFF1C2', sw: 4 });
  const kwCount = stChip(hud, 'comb ×31', { size: 36 });
  const kwIns = stChip(hud, 'comb + hair: two INSULATORS', { size: 30 });
  const kwFric = stChip(hud, 'FRICTION moves electrons', { size: 34, color: C.energy, stroke: C.energy });
  const kwNeg = stChip(hud, 'gained electrons → NEGATIVE', { size: 32, fill: '#123A6A', color: '#BFE0FF', stroke: '#6FB4FF' });
  const kwPos = stChip(hud, 'lost electrons → POSITIVE', { size: 32, fill: '#5A1A22', color: '#FFD0D3', stroke: '#FF6B70' });
  const kwOnly = stChip(hud, 'ONLY electrons move', { size: 36, color: C.energy, stroke: C.energy });
  const kwSit = stChip(hud, '+ charges stay put', { size: 30, color: '#FFB0B4', stroke: '#FF6B70' });
  const kwSame = stChip(hud, 'all +, so they REPEL', { size: 34, color: C.energy, stroke: C.energy });
  const kwPaper = stChip(hud, 'tiny bits of UNCHARGED paper', { size: 32 });
  const kwPaper2 = stChip(hud, 'attracted to the charged comb', { size: 30, color: C.energy, stroke: C.energy });
  const kwEarth = stChip(hud, 'EARTHING removes charge', { size: 36, color: '#9FE3B0', stroke: '#56D69B' });
  const kwTank = stChip(hud, 'fuel tankers are earthed: no sparks', { size: 32, color: '#9FE3B0', stroke: '#56D69B' });
  const kwPM = stChip(hud, '4 P.M., most afternoons', { size: 30 });
  const kwLight = stChip(hud, 'LIGHTNING = a giant static spark', { size: 34, color: C.energy, stroke: C.energy });
  const kwTen = stChip(hud, '10:00 a.m. THE TEST', { size: 38, fill: DR_GOLD, color: SC_INK, stroke: '#FFF1C2', sw: 4 });
  const kwSer = stChip(hud, 'Amy: IN SERIES (in the loop)', { size: 30, color: '#FFB0B4', stroke: DR_RED });
  const kwAcr = stChip(hud, 'Vic: ACROSS the lamp', { size: 30, color: '#9FD8FF', stroke: DR_BLUE });
  const kwLit = stChip(hud, 'it lights ✓', { size: 36, fill: C.good, color: SC_INK, stroke: '#FFFFFF' });
  const allHud = [kwMon, kwCount, kwIns, kwFric, kwNeg, kwPos, kwOnly, kwSit, kwSame, kwPaper, kwPaper2, kwEarth, kwTank, kwPM, kwLight, kwTen, kwSer, kwAcr, kwLit];

  /* ================= cut list ================= */
  const CUTS = [
    [-1, 'monday'], [at('hair') - 0.06, 'hair'], [at('friction') - 0.06, 'friction'], [at('static') - 0.06, 'static'],
    [at('gained') - 0.06, 'gained'], [at('only') - 0.06, 'only'], [at('like') - 0.06, 'like'], [at('strands') - 0.06, 'strands'],
    [at('same') - 0.06, 'same'], [at('paper') - 0.06, 'paper'], [at('earth') - 0.06, 'earthA'], [mid('earth', 0.56), 'earthB'],
    [at('lightning') - 0.06, 'lightning'], [at('sky') - 0.06, 'sky'], [at('test') - 0.06, 'clock'], [mid('test', 0.2), 'test'],
    [at('marks') - 0.06, 'marks'], [at('thanks') - 0.06, 'thanks'],
  ];
  const shotAt = t => { let s = CUTS[0][1]; for (const [t0, k] of CUTS) if (t >= t0) s = k; return s; };
  const blackout = E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#000000' }, hud);

  return t => {
    const sh = shotAt(t);
    op(blackout, 1 - P(t, at('monday') - 0.3, 0.5, linear));
    allHud.forEach(e => op(e, 0));
    const FLAT = sh === 'monday' || sh === 'hair' || sh === 'strands' || sh === 'same';
    op(flat, FLAT ? 1 : 0); op(morning, FLAT ? 1 : 0); flat.upd(t);
    const BENCH = { friction: 1, static: 1, gained: 1, only: 1, like: 1, earthA: 1, earthB: 1, test: 1 };
    op(benchBg, BENCH[sh] ? 1 : 0);
    op(lab, sh === 'clock' || sh === 'marks' ? 1 : 0);
    op(drawer, sh === 'thanks' ? 1 : 0); op(desk, sh === 'paper' ? 1 : 0);
    op(storm, sh === 'lightning' || sh === 'sky' ? 1 : 0);
    [zoom, stCard, gnG, onlyG, likeG, call, earthA, earthB, tc, clockG, sheet, spot, cBox, comb, combMinus, bitG].forEach(e => op(e, 0));
    confP.forEach(p => op(p, 0));
    EL.forEach(e => op(e, 0));
    [kav, eddie, mag, cecil, amy, vic, dimitri].forEach(c => op(c, 0));
    let cam = [600, 375, 1];

    /* ---------------- Kavya's flat ---------------- */
    if (FLAT) {
      op(kav, 1); tr(kav, 700, 480, 1.25);
      let mood = 'neutral', look = 0, sweat = 0, frizz = 0, plus = 0, rep = 0;
      if (sh === 'monday') {
        frizz = 0.35 * P(t, at('monday'), end('monday') - at('monday'), linear);
        mood = t > mid('monday', 0.85) ? 'deadpan' : 'neutral';
        // combing
        const cp = P(t, at('monday') + 0.2, 0.3, linear);
        const sp = S.reduce ? 1.2 : 2.6, ph = Math.sin((t - at('monday')) * TAU * sp);
        op(comb, cp * (1 - P(t, end('monday') + 0.1, 0.2, linear)));
        tr(comb, 700 + ph * 60, 480 - 1.25 * 122 + Math.abs(ph) * 6, 0.62, -8 + ph * 6);
        stPop(kwMon, t, at('monday') + 0.05, 290, 470);
        const n = Math.max(1, Math.min(31, Math.round(31 * P(t, at('monday') + 0.3, mid('monday', 0.9) - at('monday') - 0.3, linear))));
        op(kwCount, P(t, mid('monday', 0.2), 0.3, linear)); tr(kwCount, 1000, 330);
        setText(kwCount.label, 'comb ×' + n);
        cam = [600, 375, 1 + 0.03 * P(t, 0, at('hair'), linear)];
      } else if (sh === 'hair') {
        frizz = 0.35 + 0.65 * P(t, at('hair'), 0.35, pop);
        mood = 'shock'; sweat = 1;
        cam = [700, 380, 1.45 + 0.1 * P(t, at('hair'), end('hair') + 0.4 - at('hair'), linear)];
      } else if (sh === 'strands') {
        frizz = 1; mood = 'deadpan'; plus = P(t, mid('strands', 0.3), 0.3, linear); rep = P(t, mid('strands', 0.62), 0.3, linear);
        stPop(kwSame, t, mid('strands', 0.62), 1000, 640);
        cam = [700, 360, 1.4];
      } else if (sh === 'same') {
        frizz = 1; mood = 'deadpan'; plus = 1; rep = 0; look = -0.8;
        op(call, P(t, at('same'), 0.3, linear));
        op(mag, P(t, at('same') + 0.1, 0.3, linear)); tr(mag, 330, 318, 0.75);
        mag.set({ t, talk: scTalk(S, t, 'nora'), mood: 'smug', moodB: t > mid('same', 0.5) ? 'deadpan' : 'smug', look: 0.6, lookB: 0.6 });
        const push = P(t, end('same'), 0.7, linear);
        cam = [lerp(600, 700, push), lerp(375, 400, push), 1 + 0.25 * push];
      }
      kav.set({ t, talk: scTalk(S, t, 'kavya'), mood, look, sweat });
      stHair(frizz, t, plus, rep);
    }

    /* ---------------- FRICTION: the zoom ---------------- */
    if (sh === 'friction') {
      op(zoom, 1);
      const HOPS = [[260, 600], [330, 560], [400, 610], [470, 570], [540, 600], [600, 560]];
      HOPS.forEach(([x, y], i) => {
        const t0 = at('friction') + 0.3 + i * 0.55;
        const e = EL[i]; op(e, 1);
        if (t < t0) tr(e, x, y + Math.sin(t * 4 + i) * 4 * AMP);
        else stHop(e, t, t0, 0.55, x, y, 300 + i * 50, 300, 90);
      });
      op(eddie, 1); tr(eddie, 960, 480, 0.85);
      eddie.set({ t, talk: scTalk(S, t, 'eddie'), mood: 'happy', look: -0.8 });
      stPop(kwIns, t, mid('friction', 0.3), 900, 190);
      stPop(kwFric, t, mid('friction', 0.62), 900, 270);
    }

    /* ---------------- STATIC: definition ---------------- */
    if (sh === 'static') {
      op(stCard, 1);
      const tp = P(t, at('static') + 0.05, 0.5, pop);
      stTitle.setAttribute('transform', `translate(600 180) scale(${(0.6 + 0.4 * tp).toFixed(3)}) translate(-600 -180)`); op(stTitle, clamp(tp * 2));
      op(stDef, P(t, mid('static', 0.35), 0.4, linear));
      op(stL, P(t, mid('static', 0.55), 0.3, linear)); op(stR, P(t, mid('static', 0.72), 0.3, linear));
      loopW.upd(t, 90 * AMP);
      for (let i = 0; i < 5; i++) { const e = EL[i]; op(e, P(t, mid('static', 0.55), 0.3, linear)); tr(e, 270 + i * 45, 432 + Math.sin(t * 1.5 + i) * 1.5 * AMP); }
      op(zzz, 0.5 + 0.5 * Math.sin(t * 2));
    }

    /* ---------------- GAINED / LOST ---------------- */
    if (sh === 'gained') {
      op(gnG, 1);
      const a = P(t, at('gained') + 0.05, 0.4, pop), b = P(t, mid('gained', 0.52), 0.4, pop);
      op(gnComb, clamp(a * 2)); tr(gnComb, 330, 330, Math.max(0.01, 0.7 + 0.3 * a));
      op(gnHair, clamp(b * 2)); tr(gnHair, 880, 380, Math.max(0.01, 0.7 + 0.3 * b));
      op(gnArrow, P(t, mid('gained', 0.62), 0.4, linear));
      stPop(kwNeg, t, mid('gained', 0.25), 330, 560);
      stPop(kwPos, t, mid('gained', 0.78), 880, 600);
    }

    /* ---------------- ONLY electrons move ---------------- */
    if (sh === 'only') {
      op(onlyG, 1);
      BORED.forEach((b, i) => { b.set(scBlink(t, i * 3 + 1) > 0.3 || t > end('only') + 0.1 ? 1 : 0); tr(b, [250, 340, 430, 520][i], [600, 560, 610, 570][i]); });
      for (let i = 0; i < 6; i++) {
        const e = EL[i]; op(e, 1);
        const per = 1.3, ph = ((t - at('only')) / per + i / 6) % 1, k = Math.floor((t - at('only')) / per + i / 6);
        const x0 = 230 + ((i * 2 + k) % 6) * 60, y0 = 520 + (i % 2) * 40;
        const p = ease(clamp(ph * 1.6));
        tr(e, lerp(x0, 260 + i * 46, p), lerp(y0, 290, p) - Math.sin(p * Math.PI) * 50);
      }
      op(eddie, 1); tr(eddie, 960, 480, 0.85);
      eddie.set({ t, talk: scTalk(S, t, 'eddie'), mood: t > end('only') ? 'smug' : 'happy', look: -0.8 });
      stPop(kwOnly, t, mid('only', 0.08), 880, 180);
      stPop(kwSit, t, mid('only', 0.55), 380, 700);
    }

    /* ---------------- LIKE / UNLIKE ---------------- */
    if (sh === 'like') {
      op(likeG, 1);
      const a = P(t, at('like') + 0.05, 0.35, linear), b = P(t, mid('like', 0.5), 0.35, linear);
      op(likeA, a); op(likeB, b);
      const ra = 30 * P(t, at('like') + 0.3, 0.8, easeOut) + 4 * Math.sin(t * 5) * AMP;
      tr(lA1, 360 - ra, 300); tr(lA2, 440 + ra, 300); tr(lA3, 760 - ra, 300); tr(lA4, 840 + ra, 300);
      attr(likeArr, 'd', twoArrows(290 - ra, 510 + ra, 300, true) + twoArrows(690 - ra, 910 + ra, 300, true));
      const rb = 50 - 26 * P(t, mid('like', 0.6), 0.6, easeIn);
      tr(lB1, 600 - rb, 565); tr(lB2, 600 + rb, 565);
      attr(unlikeArr, 'd', twoArrows(600 - rb - 70, 600 + rb + 70, 565, false));
    }

    /* ---------------- PAPER ---------------- */
    if (sh === 'paper') {
      op(bitG, 1); op(comb, 1); op(combMinus, 1);
      const down = P(t, at('paper') + 0.1, mid('paper', 0.32) - at('paper'), ease);
      const cy = lerp(200, 460, down);
      tr(comb, 620, cy, 2.4); tr(combMinus, 620, cy - 96);
      BITS.forEach(([x, y, r], i) => {
        const t0 = mid('paper', 0.36) + i * 0.09, p = P(t, t0, 0.3, easeOut);
        const tx = 440 + i * 60, ty = cy + 74 + (i % 2) * 8;
        tr(bits[i], lerp(x, tx, p), lerp(y, ty, p) + Math.sin(t * 3 + i) * 1.5 * p * AMP, 1.4, r * (1 - p) + 10 * Math.sin(i));
      });
      stPop(kwPaper, t, mid('paper', 0.6), 600, 150);
      stPop(kwPaper2, t, mid('paper', 0.8), 600, 680);
    }

    /* ---------------- EARTHING ---------------- */
    if (sh === 'earthA') {
      op(earthA, 1);
      for (let i = 0; i < 7; i++) {
        const e = EL[i], t0 = at('earth') + 0.8 + i * 0.32, p = P(t, t0, 1.1, easeIn);
        const ang = i / 7 * TAU, sx = 350 + Math.cos(ang) * 55, sy = 300 + Math.sin(ang) * 50;
        let x = sx, y = sy;
        if (p > 0) { const q = clamp(p * 1.5); x = lerp(sx, 350, clamp(q * 3)); y = q < 0.33 ? lerp(sy, 395, q * 3) : lerp(395, 640, (q - 0.33) / 0.67); }
        op(e, 1 - P(t, t0 + 0.7, 0.25, linear)); tr(e, x, y, 1);
      }
      op(eaWire, P(t, mid('earth', 0.15), 0.3, linear)); op(eaGround, P(t, mid('earth', 0.25), 0.3, linear));
      stPop(kwEarth, t, at('earth') + 0.1, 840, 260);
    }
    if (sh === 'earthB') {
      op(earthB, 1);
      attr(ecable, 'stroke-dashoffset', (-t * 30 * AMP).toFixed(1));
      op(ecLbl, P(t, mid('earth', 0.62), 0.3, linear));
      stPop(kwTank, t, mid('earth', 0.7), 600, 230);
    }

    /* ---------------- STORM ---------------- */
    if (sh === 'lightning' || sh === 'sky') {
      let d = '';
      RAIN.forEach(([x, y, v]) => { const yy = (y + t * 520 * v * (S.reduce ? 0.4 : 1)) % 760, xx = x - yy * 0.18; d += `M${xx.toFixed(0)},${yy.toFixed(0)} l-6,26 `; });
      attr(rain, 'd', d);
      const win1 = sh === 'lightning';
      op(winFrame, win1 ? 1 : 0);
      const f1 = win1 ? mid('lightning', 0.62) : at('sky') + 0.15, f2 = win1 ? 1e9 : mid('sky', 0.55);
      const fl = Math.max(win(t, f1, f1 + 0.35, 0.05), win(t, f2, f2 + 0.35, 0.05));
      op(flashBg, fl * 0.5);
      const boltOn = win1 ? fl : Math.max(fl, P(t, at('sky') + 0.15, 0.1, linear) * (0.6 + 0.4 * Math.sin(t * 30)) * (t < mid('sky', 0.9) ? 1 : 0.5));
      op(bigBolt, boltOn); op(boltGlow, boltOn * 0.6);
      op(cloudMinus, win1 ? 0 : P(t, at('sky') + 0.4, 0.4, linear)); op(groundPlus, win1 ? 0 : P(t, mid('sky', 0.3), 0.4, linear));
      if (win1) {
        tr(cloud, 0, 0); tr(bigBolt, 280, 0); tr(boltGlow, 280, 0);
        op(kav, 1); tr(kav, 330, 560, 1.15);
        kav.set({ t, talk: scTalk(S, t, 'kavya'), mood: t > mid('lightning', 0.65) ? 'shock' : 'neutral', look: 0.7 });
        stHair(0, t, 0, 0);
        stPop(kwPM, t, mid('lightning', 0.3), 880, 650);
      } else {
        tr(cloud, 0, 0); tr(bigBolt, 0, 0); tr(boltGlow, 0, 0);
        op(cBox, 1); op(cecil, 1); tr(cecil, 1015, 545, 0.88);
        cecil.set({ t, talk: scTalk(S, t, 'cecil'), mood: 'deadpan', look: t < mid('sky', 0.3) ? -0.7 : 0 });
        stPop(kwLight, t, mid('sky', 0.2), 470, 700);
        const push = P(t, end('sky'), 0.6, linear);
        cam = [lerp(600, 1015, push), lerp(375, 520, push), 1 + 0.25 * push];
      }
    }

    /* ---------------- 10:00, the test ---------------- */
    if (sh === 'clock') {
      op(clockG, 1); tr(clockG, 330, 250);
      attr(minHand, 'transform', `rotate(${(-6 + 6 * P(t, at('test'), 0.6, easeOut)).toFixed(1)})`);
      op(kav, 1); tr(kav, 760, 450, 1.25);
      kav.set({ t, mood: 'shock', look: 0, sweat: 1 }); stHair(0.3, t, 0, 0);
      stPop(kwTen, t, at('test') + 0.05, 330, 400);
    }
    if (sh === 'test') {
      op(tc, 1);
      const lit = P(t, mid('test', 0.84), 0.25, linear);
      [tw1, tw2, tw3].forEach(w => { w.set(lit); w.upd(t, 70 * AMP); });
      const vOn = P(t, mid('test', 0.5), 0.3, linear);
      op(vw, vOn);
      op(cecil, 1); tr(cecil, 200, 370, 0.55);
      cecil.set({ t, mood: 'deadpan', look: 0.5 });
      op(amy, 1); tr(amy, 550, 230, 0.5);
      amy.set({ t, mood: lit > 0.5 ? 'smug' : 'neutral', needle: 0.1 + 0.45 * lit, look: 0.4 });
      op(dimitri, 1); tr(dimitri, 900, 380, 0.5);
      dimitri.set({ t, mood: lit > 0.5 ? 'smug' : 'neutral', glow: lit, look: -0.5 });
      op(vic, vOn); tr(vic, 700, 380, 0.55);
      vic.set({ t, mood: 'deadpan', sign: t > mid('test', 0.62) ? '1.5 V' : '', needle: t > mid('test', 0.62) ? 0.5 : 0, look: 0.5 });
      stPop(kwSer, t, mid('test', 0.26), 560, 140);
      stPop(kwAcr, t, mid('test', 0.52), 560, 620);
      stPop(kwLit, t, mid('test', 0.86), 1010, 650);
      cam = [600, 375, 1 + 0.04 * P(t, mid('test', 0.2), 4, linear)];
    }

    /* ---------------- FULL MARKS ---------------- */
    if (sh === 'marks') {
      op(kav, 1); tr(kav, 420, 450, 1.3);
      const dead = t > mid('marks', 0.66);
      kav.set({ t, talk: scTalk(S, t, 'kavya'), mood: dead ? 'deadpan' : 'smug', look: dead ? 0 : 0.2 });
      stHair(0.3, t, 0, 0);
      stPop(sheet, t, at('marks') + 0.05, 840, 360, 1, 4);
      const push = P(t, end('marks'), 0.6, linear);
      cam = [lerp(600, 430, push), lerp(375, 400, push), 1 + 0.2 * push];
    }

    /* ---------------- Dimitri thanks himself ---------------- */
    if (sh === 'thanks') {
      op(spot, 1);
      const bow = P(t, mid('thanks', 0.55), 0.35, ease) * (1 - P(t, end('thanks') + 0.4, 0.4, ease));
      op(dimitri, 1); tr(dimitri, 600, 420 + 20 * bow, 1.3, 22 * bow);
      dimitri.set({ t, talk: scTalk(S, t, 'dimitri'), mood: t > end('thanks') ? 'happy' : 'smug', glow: 1, look: 0 });
      const cf = P(t, mid('thanks', 0.5), 0.3, linear);
      CONF_COL.forEach((c, k) => {
        let d = '';
        CONF.forEach(([x, y, v, ph, ck]) => {
          if (ck !== k) return;
          const yy = ((y + (t - at('thanks')) * v * (S.reduce ? 0.5 : 1)) % 900) - 100, xx = x + Math.sin(t * 2 + ph) * 20 * AMP;
          d += `M${xx.toFixed(0)},${yy.toFixed(0)} l12,4 l-3,9 l-12,-4 Z `;
        });
        attr(confP[k], 'd', d); op(confP[k], cf);
      });
      cam = [600, 400, 1 + 0.06 * P(t, at('thanks'), 4, linear)];
    }

    stCam(world, cam[0], cam[1], cam[2], cam[3], cam[4]);
  };
});
