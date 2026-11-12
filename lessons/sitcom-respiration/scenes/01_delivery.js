/* THE POWERHOUSE, scene 1: "The breakfast delivery".
   Shots (hard sitcom cuts): blood (Gloria arrives) -> office (Gloria bursts in) -> Mitch confessional
   -> office (stored energy, "need oxygen", the twins arrive by red-blood-cell taxi, O2)
   -> Mitch confessional (oxygen's route) -> aerobic = with oxygen -> word equation on the board
   -> disco -> Mitch + atoms swap partners -> Carl (CO2) is thrown out -> Kavya breathes out -> "Rude."
   -> Wally (water) waves, silence -> symbol equation -> counting 18 oxygen atoms each side
   -> balance scale -> Gloria "MAKE energy" -> Mitch "No." -> made x / released v -> exam confessional. */
scene('delivery', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;
  const INK = '#2A1A22';

  /* ---------- local helpers (prefixed dlv) ---------- */
  // text with real subscripts: 'CO_2' -> CO₂ ; '**bold**' segments use o.boldFill
  function dlvRich(parent, x, y, str, o) {
    o = o || {};
    const size = o.size || 32, sub = Math.round(size * 0.62), dy = Math.round(size * 0.26);
    const t = E('text', { x, y, 'font-size': size, 'font-weight': o.weight || 600, fill: o.fill || C.ink, 'text-anchor': o.anchor || 'start', 'font-family': o.font || FD }, parent);
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
  // chemical formula: '6CO2' -> amber coefficient, real subscripts
  function dlvFormula(parent, x, y, str, o) {
    o = o || {};
    const size = o.size || 56, sub = Math.round(size * 0.62), dy = Math.round(size * 0.24);
    const t = E('text', { x, y, 'font-size': size, 'font-weight': 700, fill: o.fill || C.ink, 'text-anchor': o.anchor || 'middle', 'font-family': FD }, parent);
    const m = str.match(/^(\d*)(.*)$/);
    let low = false;
    const push = (txt, isSub, fill) => {
      const ts = E('tspan', {}, t); ts.textContent = txt;
      if (fill) ts.setAttribute('fill', fill);
      if (isSub) { ts.setAttribute('font-size', sub); if (!low) { ts.setAttribute('dy', dy); low = true; } }
      else if (low) { ts.setAttribute('dy', -dy); low = false; }
    };
    if (m[1]) push(m[1], false, o.coef || C.glucose);
    m[2].replace(/([A-Za-z]+)|(\d+)/g, (all, letters, digits) => { push(letters || digits, !letters); return ''; });
    return t;
  }
  const dlvW = el => { let w = 0; try { w = el.getComputedTextLength(); } catch (e) { w = 0; } return w; };
  // pill with rich text centred at (0,0)
  function dlvChip(parent, str, o) {
    o = o || {};
    const size = o.size || 32, g = G(parent), h = Math.round(size * 1.7);
    const box = E('rect', { y: -h / 2, height: h, rx: o.rx !== undefined ? o.rx : h / 2, fill: o.fill || '#0E1A24', stroke: o.stroke || 'none', 'stroke-width': 3, opacity: o.opacity }, g);
    const tx = dlvRich(g, 0, size * 0.35, str, { size, weight: o.weight || 700, fill: o.color || C.ink, anchor: 'middle', boldFill: o.boldFill });
    const w = (dlvW(tx) || String(str).length * size * 0.55) + size * 1.3;
    attr(box, 'x', -w / 2); attr(box, 'width', w);
    g.w = w; g.h = h;
    return g;
  }
  const dlvPop = (el, x, y, p, s0) => { op(el, clamp(p * 2.5)); tr(el, x, y, (s0 || 1) * (0.72 + 0.28 * p)); };
  const dlvCam = (g, fx, fy, k) => g.setAttribute('transform', Math.abs(k - 1) < 1e-4 ? '' : `translate(${fx} ${fy}) scale(${k.toFixed(4)}) translate(${-fx} ${-fy})`);
  // a time value that makes scChar blink at tb (the blink lasts 0.13 s)
  function dlvBlinkT(t, seed, tbs) {
    const period = 3.1 + (seed % 5) * 0.37;
    for (const tb of tbs) if (t >= tb && t < tb + 0.13) { const n = Math.ceil((tb + seed * 0.71) / period) + 1; return t - tb + n * period - seed * 0.71; }
    return t;
  }
  function dlvHeart(parent) { return E('path', { d: 'M0,10 C-22,-6 -16,-26 0,-14 C16,-26 22,-6 0,10 Z', fill: '#FF6FB5', stroke: INK, 'stroke-width': 3 }, parent); }
  function dlvLower(name, role) { return scLowerThird(LT, name, role); }

  /* ---------- the shot list (hard cuts) ---------- */
  const SH = [
    ['blood', -1e9, 'blood'],
    ['offA', at('gloria') - 0.15, 'office'],
    ['conf1', at('th_gloria') - 0.1, 'conf'],
    ['offB', at('stored') - 0.1, 'office'],
    ['conf2', at('th_twins') - 0.1, 'conf'],
    ['aer', at('aerobic') - 0.1, 'office'],
    ['word', at('word') - 0.1, 'office'],
    ['party', at('party') - 0.1, 'office'],
    ['fine', at('fine') - 0.1, 'office'],
    ['carl', at('carl') - 0.1, 'office'],
    ['kav', at('breath') - 0.1, 'track'],
    ['rude', mid('breath', 0.84), 'office'],
    ['wally', at('wally') - 0.1, 'office'],
    ['sym', at('symbol') - 0.1, 'office'],
    ['bal', at('balance') - 0.1, 'office'],
    ['make', at('make') - 0.1, 'office'],
    ['no', end('make') + 0.12, 'office'],
    ['cant', at('cant') - 0.1, 'office'],
    ['exam', at('th_exam') - 0.1, 'conf'],
  ];
  const shotAt = t => { let k = 0; for (let i = 0; i < SH.length; i++) if (t >= SH[i][1]) k = i; return SH[k]; };

  /* =================== BLOOD =================== */
  const STG = G(root), cam = G(STG);
  const BL = G(cam), OF = G(cam), CFb = G(cam), TK = G(cam), cast = G(cam), OFf = G(cam);
  const blood = scBlood(BL);
  const clock = G(BL); tr(clock, 1040, 122);
  E('circle', { r: 58, fill: '#FFF6E8', stroke: INK, 'stroke-width': 6 }, clock);
  { let d = ''; for (let i = 0; i < 12; i++) { const a = i / 12 * TAU, r0 = i % 3 ? 46 : 40; d += `M${(Math.cos(a) * r0).toFixed(1)},${(Math.sin(a) * r0).toFixed(1)} L${(Math.cos(a) * 52).toFixed(1)},${(Math.sin(a) * 52).toFixed(1)} `; } E('path', { d, stroke: INK, 'stroke-width': 3 }, clock); }
  E('line', { x1: 0, y1: 0, x2: -30, y2: 0, stroke: INK, 'stroke-width': 7, 'stroke-linecap': 'round' }, clock);   // hour hand on 9
  const clockMin = E('line', { x1: 0, y1: 0, x2: 0, y2: -42, stroke: INK, 'stroke-width': 4, 'stroke-linecap': 'round' }, clock);
  E('circle', { r: 6, fill: '#E8424F' }, clock);
  const clockLbl = chip(BL, '9:00 AM', { size: 32, fill: '#0E1A24' }); tr(clockLbl, 1040, 222);
  const blC1 = chip(BL, 'breakfast: digested', { size: 30, fill: '#0E1A24' });
  const blC2 = chip(BL, 'delivery: by blood', { size: 30, fill: '#0E1A24', color: '#FF9A8F' });

  /* =================== OFFICE =================== */
  scOffice(OF);
  function dlvDoor(parent, x, label, signFill, signInk, hingeRight) {
    const g = G(parent);
    E('rect', { x: x - 8, y: 212, width: 166, height: 404, rx: 8, fill: '#2A1216', stroke: '#C98A5A', 'stroke-width': 6 }, g);
    E('rect', { x, y: 220, width: 150, height: 390, fill: '#14080A' }, g);   // dark doorway behind the panel
    const panel = G(g);
    E('rect', { x, y: 220, width: 150, height: 390, fill: linGrad('#9A5A44', '#7A4232', true), stroke: INK, 'stroke-width': 4 }, panel);
    E('rect', { x: x + 22, y: 250, width: 106, height: 140, rx: 6, fill: 'none', stroke: '#5E2F22', 'stroke-width': 4 }, panel);
    E('circle', { cx: hingeRight ? x + 22 : x + 128, cy: 420, r: 9, fill: '#FFD27A', stroke: INK, 'stroke-width': 3 }, panel);
    const sign = chip(g, label, { size: 26, fill: signFill, color: signInk, h: 42, rx: 8 }); tr(sign, x + 75, 186);
    const hx = hingeRight ? x + 150 : x;
    g.open = p => panel.setAttribute('transform', p < 0.01 ? '' : `translate(${hx} 0) scale(${(1 - 0.82 * clamp(p)).toFixed(3)} 1) translate(${-hx} 0)`);
    return g;
  }
  const doorL = dlvDoor(OF, 40, 'DELIVERIES', '#FFC247', '#3A2600', false);
  const doorR = dlvDoor(OF, 1010, 'EXIT', '#2FBF71', '#FFFFFF', true);
  const dim = E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#0B0710', opacity: 0 }, OF);

  // disco
  const disco = G(OF), beams = [], spots = [];
  const DCOL = ['#FF5FA2', '#4CC9F0', '#FFE45C', '#56D69B', '#B48CFF'];
  DCOL.forEach((c, i) => beams.push(E('path', { d: 'M0,0 L-70,620 L70,620 Z', fill: c, opacity: 0.16 }, disco)));
  DCOL.forEach((c, i) => spots.push(E('ellipse', { rx: 90, ry: 26, fill: c, opacity: 0.35 }, disco)));
  const dball = G(disco); tr(dball, 600, 150);
  E('line', { x1: 0, y1: -60, x2: 0, y2: -36, stroke: '#C9D3DC', 'stroke-width': 4 }, dball);
  E('circle', { r: 36, fill: ball('#E9F2F7', '#7F96A8'), stroke: '#FFFFFF', 'stroke-width': 3 }, dball);
  E('path', { d: 'M-36,0 L36,0 M-31,-18 L31,-18 M-31,18 L31,18 M0,-36 L0,36 M-18,-31 Q-26,0 -18,31 M18,-31 Q26,0 18,31', stroke: '#8FA3B5', 'stroke-width': 2, fill: 'none' }, dball);

  // board (a dark glass board on the office wall)
  const board = G(OF);
  E('rect', { x: 70, y: 115, width: 1060, height: 392, rx: 18, fill: '#13303D', stroke: '#C98A5A', 'stroke-width': 10 }, board);
  E('rect', { x: 420, y: 502, width: 360, height: 14, rx: 6, fill: '#8A5A3A' }, board);

  /* --- board: word equation --- */
  const bWord = G(board);
  const WSPEC = [
    { text: 'glucose', fill: C.glucose, color: '#3A2600', icon: g => molGlucose(g, 26), f: 0.02 },
    { op: '+', f: 0.12 },
    { text: 'oxygen', fill: C.oxygen, color: '#FFFFFF', icon: g => molO2(g, 16), f: 0.17 },
    { op: '→', f: 0.27 },
    { text: 'carbon dioxide', fill: C.co2, color: '#10202B', icon: g => molCO2(g, 13), f: 0.35 },
    { op: '+', f: 0.52 },
    { text: 'water', fill: C.water, color: '#06283A', icon: g => molH2O(g, 18), f: 0.57 },
  ];
  const wParts = WSPEC.map(sp => {
    const p = Object.assign({}, sp);
    p.g = G(bWord);
    if (sp.op) { if (sp.op === '+') T(p.g, 0, 15, '+', { size: 48, weight: 700, anchor: 'middle', fill: C.muted }); else arrow(p.g, -26, 0, 26, 0, { color: C.ink, width: 6 }); p.w = sp.op === '+' ? 40 : 62; }
    else { const c = chip(p.g, sp.text, { size: 34, fill: sp.fill, color: sp.color }); p.w = c.w; p.icon = G(p.g); sp.icon(p.icon); tr(p.icon, 0, -88); }
    return p;
  });
  { let tot = 0; wParts.forEach((p, i) => tot += p.w + (i ? 14 : 0)); let x = 600 - tot / 2; wParts.forEach((p, i) => { if (i) x += 14; p.x = x + p.w / 2; x += p.w; }); }
  const wEn = G(bWord);
  const wSpark = spark(wEn, 34, { seed: 1 }); tr(wSpark, 0, -14);
  T(wEn, 56, 0, 'energy is **released**', { size: 44, weight: 600, boldFill: C.energy });
  const wEnW = 56 + textWidth('energy is released', 44, FD, 700);
  const wEnX = 600 - wEnW / 2 + 17;

  /* --- board: symbol equation and oxygen count --- */
  const bSym = G(board);
  const symHead = T(bSym, 600, 172, 'SYMBOL EQUATION', { size: 32, weight: 700, anchor: 'middle', fill: C.muted, ls: 3 });
  const SYM = [
    { sym: 'C6H12O6', word: 'glucose', wf: C.glucoseLt, f: 0.02 }, { op: '+', f: 0.28 }, { sym: '6O2', word: 'oxygen', wf: '#FF9A8F', f: 0.33 },
    { op: '→', f: 0.47 }, { sym: '6CO2', word: 'carbon dioxide', wf: C.co2, f: 0.53 }, { op: '+', f: 0.72 }, { sym: '6H2O', word: 'water', wf: C.water, f: 0.77 },
  ];
  const symRow = G(bSym), wordRow = G(bSym);
  const sParts = SYM.map(sp => {
    const p = Object.assign({}, sp);
    p.g = G(symRow);
    if (sp.op) {
      if (sp.op === '+') T(p.g, 0, 18, '+', { size: 56, weight: 700, anchor: 'middle', fill: C.muted }); else arrow(p.g, -30, 0, 30, 0, { color: C.ink, width: 7 });
      p.w = sp.op === '+' ? 44 : 70;
      p.wg = G(wordRow); T(p.wg, 0, 0, sp.op === '+' ? '+' : '→', { size: 30, weight: 700, anchor: 'middle', fill: C.muted });
    } else {
      const te = dlvFormula(p.g, 0, 20, sp.sym, { size: 62 });
      p.wg = G(wordRow); T(p.wg, 0, 0, sp.word, { size: 30, weight: 700, anchor: 'middle', fill: sp.wf });
      p.w = Math.max(dlvW(te) || sp.sym.length * 30, textWidth(sp.word, 30, FD, 700)) + 8;
    }
    return p;
  });
  { let tot = 0; sParts.forEach((p, i) => tot += p.w + (i ? 16 : 0)); let x = 600 - tot / 2; sParts.forEach((p, i) => { if (i) x += 16; p.x = x + p.w / 2; x += p.w; tr(p.g, p.x, 0); tr(p.wg, p.x, 250); }); }

  const cnt = G(bSym);
  const cLblL = T(cnt, 360, 262, 'oxygen atoms, left', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  const cLblR = T(cnt, 840, 262, 'oxygen atoms, right', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  const dotX = (cx, c) => cx + (c - 2.5) * 40 + (Math.floor(c / 2) - 1) * 16;
  const ROWY = [300, 344, 388];
  const dotsL = [], dotsR = [];
  for (let r = 0; r < 3; r++) for (let c = 0; c < 6; c++) {
    const g = E('circle', { r: 16, fill: ball(C.oxygen, C.oxygenDk), stroke: r === 2 ? C.glucose : C.oxygenDk, 'stroke-width': r === 2 ? 5 : 2 }, cnt);
    dotsL.push({ g, x: dotX(360, c), y: ROWY[r], r, c });
  }
  // right side: each oxygen dot, plus a carbon between each CO2 pair and two hydrogens on each water
  for (let r = 0; r < 3; r++) for (let c = 0; c < 6; c++) {
    const x = dotX(840, c), y = ROWY[r], i = dotsR.length;
    if (r < 2 && c % 2 === 0) dotsR.push({ g: E('circle', { r: 11, fill: ball(C.carbon, C.carbonDk) }, cnt), x: x + 28, y, i });
    if (r === 2) { dotsR.push({ g: E('circle', { r: 8, fill: ball(C.hydrogen, C.hydrogenDk) }, cnt), x: x - 13, y: y + 14, i }); dotsR.push({ g: E('circle', { r: 8, fill: ball(C.hydrogen, C.hydrogenDk) }, cnt), x: x + 13, y: y + 14, i }); }
    dotsR.push({ g: E('circle', { r: 16, fill: ball(C.oxygen, C.oxygenDk), stroke: C.oxygenDk, 'stroke-width': 2 }, cnt), x, y, i: r * 6 + c });
  }
  dotsR.forEach(d => { if (d.i === undefined) d.i = 0; });
  const cTagL1 = dlvRich(cnt, 196, 330, 'in O_2', { size: 26, anchor: 'end', fill: '#FF9A8F' });
  const cTagL2 = T(cnt, 196, 397, 'in glucose', { size: 26, weight: 600, anchor: 'end', fill: C.glucoseLt });
  const cTagR1 = dlvRich(cnt, 1012, 330, 'in CO_2', { size: 26, fill: C.co2 });
  const cTagR2 = dlvRich(cnt, 1012, 397, 'in H_2O', { size: 26, fill: C.water });
  const numL = T(cnt, 360, 466, '12', { size: 46, weight: 700, anchor: 'middle' });
  const numL2 = T(cnt, 360, 466, '12 + **6** = **18**', { size: 46, weight: 700, anchor: 'middle', boldFill: C.glucose });
  const numR = T(cnt, 840, 466, '12 + 6 = **18**', { size: 46, weight: 700, anchor: 'middle', boldFill: C.glucose });
  const cEq = G(cnt); T(cEq, 0, 28, '=', { size: 84, weight: 700, anchor: 'middle', fill: C.good });

  /* --- board: balance scale --- */
  const bBal = G(board);
  const balTop1 = T(bBal, 600, 170, 'No atoms made. None destroyed.', { size: 36, weight: 700, anchor: 'middle' });
  const balTop2 = G(bBal); T(balTop2, 0, 14, 'the equation **balances**', { size: 40, weight: 600, anchor: 'middle', boldFill: C.good });
  { const tk = tick(balTop2, 16); tr(tk, textWidth('the equation balances', 40, FD, 700) / 2 + 34, 0); }
  E('path', { d: 'M520,486 L680,486 L640,456 L560,456 Z', fill: '#8A5A3A', stroke: INK, 'stroke-width': 3 }, bBal);
  E('rect', { x: 592, y: 236, width: 16, height: 222, fill: '#B07A45', stroke: INK, 'stroke-width': 3 }, bBal);
  const beam = G(bBal);
  E('rect', { x: -280, y: -8, width: 560, height: 16, rx: 8, fill: '#D9A35F', stroke: INK, 'stroke-width': 3 }, beam);
  const pivotC = E('circle', { cx: 600, cy: 230, r: 13, fill: '#FFD27A', stroke: INK, 'stroke-width': 3 }, bBal);
  function dlvPan(parent, label, fill, fillArt) {
    const g = G(parent);
    E('path', { d: 'M0,0 L-72,96 M0,0 L72,96', stroke: '#C9D3DC', 'stroke-width': 3 }, g);
    const stuff = G(g); tr(stuff, 0, 72); fillArt(stuff);
    E('path', { d: 'M-90,96 Q0,138 90,96 Z', fill: '#C9D3DC', stroke: INK, 'stroke-width': 3 }, g);
    T(g, 0, 160, label, { size: 26, weight: 700, anchor: 'middle', fill });
    return g;
  }
  const panL = dlvPan(bBal, 'glucose + oxygen', C.glucoseLt, s => { tr(molGlucose(s, 26), -36, -4); tr(molO2(s, 13), 44, 6); });
  const panR = dlvPan(bBal, 'carbon dioxide + water', C.co2, s => { tr(molCO2(s, 11), -40, 4); tr(molH2O(s, 16), 52, 0); });
  const balNew = chip(bBal, 'same atoms, new partners', { size: 32, fill: '#0E1A24', color: C.energy, stroke: C.energy });

  // aerobic title (over a dimmed office)
  const aerG = G(OF);
  const aerT = chip(aerG, 'AEROBIC RESPIRATION', { size: 50, fill: C.glucose, color: '#3A2600' });
  const aerM = T(aerG, 600, 300, 'aerobic = **with oxygen**', { size: 48, weight: 600, anchor: 'middle', boldFill: '#FF9A8F' });
  const aerPlus = T(aerG, 432, 536, '+', { size: 56, weight: 700, anchor: 'middle', fill: C.ink });
  const aerArr = arrow(aerG, 714, 520, 820, 520, { color: C.ink, width: 7 });
  const aerL = [[260, 'glucose', C.glucoseLt], [600, 'oxygen', '#FF9A8F'], [970, 'inside a mitochondrion', C.mito]].map(([x, s, f]) => T(aerG, x, 668, s, { size: 30, weight: 700, anchor: 'middle', fill: f }));

  // atoms swap partners (panel beside Mitch)
  const fineG = G(OF);
  card(fineG, 600, 120, 552, 520, { fill: '#0E1A24', stroke: '#3A4B5C', opacity: 0.92 });
  const fineChip = chip(fineG, 'a chemical reaction', { size: 32, fill: C.card2 }); tr(fineChip, 876, 172);
  const FA = [
    { k: 'C', a: [760, 302], b: [780, 506] }, { k: 'O', a: [812, 302], b: [732, 506] },
    { k: 'H', a: [722, 274], b: [978, 528] }, { k: 'H', a: [722, 330], b: [1048, 528] },
    { k: 'O', a: [990, 302], b: [828, 506] }, { k: 'O', a: [1040, 302], b: [1013, 500] },
  ];
  const fBondA = G(fineG), fBondB = G(fineG);
  [[0, 1], [0, 2], [0, 3]].forEach(([i, j]) => E('line', { x1: FA[i].a[0], y1: FA[i].a[1], x2: FA[j].a[0], y2: FA[j].a[1], stroke: '#7F96A8', 'stroke-width': 7, 'stroke-linecap': 'round' }, fBondA));
  E('line', { x1: 990, y1: 302, x2: 1040, y2: 302, stroke: '#7F96A8', 'stroke-width': 7 }, fBondA);
  [[0, 1], [0, 4]].forEach(([i, j]) => { E('line', { x1: FA[i].b[0], y1: FA[i].b[1] - 5, x2: FA[j].b[0], y2: FA[j].b[1] - 5, stroke: '#7F96A8', 'stroke-width': 5 }, fBondB); E('line', { x1: FA[i].b[0], y1: FA[i].b[1] + 5, x2: FA[j].b[0], y2: FA[j].b[1] + 5, stroke: '#7F96A8', 'stroke-width': 5 }, fBondB); });
  [[5, 2], [5, 3]].forEach(([i, j]) => E('line', { x1: FA[i].b[0], y1: FA[i].b[1], x2: FA[j].b[0], y2: FA[j].b[1], stroke: '#7F96A8', 'stroke-width': 7 }, fBondB));
  const fAtoms = FA.map((q, i) => ({ q, el: atom(fineG, q.k, q.k === 'H' ? 14 : 22, { letter: true }), d: i * 0.08 }));
  const fLblA = [T(fineG, 766, 380, 'from glucose', { size: 26, weight: 700, anchor: 'middle', fill: C.glucoseLt }), T(fineG, 1015, 380, 'oxygen', { size: 26, weight: 700, anchor: 'middle', fill: '#FF9A8F' })];
  const fLblB = [T(fineG, 780, 590, 'carbon dioxide', { size: 26, weight: 700, anchor: 'middle', fill: C.co2 }), T(fineG, 1013, 590, 'water', { size: 26, weight: 700, anchor: 'middle', fill: C.water })];
  const fArr = arrow(fineG, 876, 396, 876, 448, { color: C.energy, width: 6 });

  /* --- cast --- */
  const taxi = G(cast);
  E('ellipse', { rx: 150, ry: 54, fill: ball('#FF6B6B', '#B32635'), stroke: '#7A1420', 'stroke-width': 5 }, taxi);
  E('ellipse', { cy: -6, rx: 92, ry: 22, fill: '#B32635', opacity: 0.55 }, taxi);
  E('rect', { x: -66, y: 8, width: 132, height: 34, rx: 6, fill: '#FFD23F', stroke: INK, 'stroke-width': 3 }, taxi);
  T(taxi, 0, 35, 'TAXI', { size: 27, weight: 800, anchor: 'middle', fill: INK });
  const taxiLbl = T(taxi, 0, 96, 'a red blood cell', { size: 28, weight: 700, anchor: 'middle', fill: '#FF9A8F' });
  function dlvMk(kind) { const w = G(cast); const back = G(w); const c = scChar(w, kind); const front = G(w); return { w, back, c, front }; }
  const M = dlvMk('mitch'), GL = dlvMk('gloria'), TW = dlvMk('twins'), CA = dlvMk('carl'), WA = dlvMk('wally');
  // Mitch's pointing arm
  const mArm = G(M.back);
  E('path', { d: 'M-80,20 L-218,-24', stroke: C.mitoDk, 'stroke-width': 18, 'stroke-linecap': 'round' }, mArm);
  E('path', { d: 'M-80,20 L-218,-24', stroke: C.mito, 'stroke-width': 11, 'stroke-linecap': 'round' }, mArm);
  E('circle', { cx: -222, cy: -26, r: 15, fill: C.mito, stroke: INK, 'stroke-width': 3 }, mArm);
  E('path', { d: 'M-232,-30 L-258,-38', stroke: INK, 'stroke-width': 9, 'stroke-linecap': 'round' }, mArm);
  // Gloria: glow behind, sparks inside, hearts
  const gBTag = T(GL.front, 0, 132, 'glucose', { size: 30, weight: 700, anchor: 'middle', fill: C.glucoseLt });
  const gGlow = E('ellipse', { rx: 160, ry: 160, fill: glow(C.energy) }, GL.back);
  const gSparks = G(GL.front), gSp = [];
  [[-62, -34], [62, -34], [-62, 38], [62, 40]].forEach(([x, y], i) => { const s = spark(gSparks, 11, { seed: i }); tr(s, x, y); gSp.push(s); });
  const gHearts = G(GL.front), hearts = [];
  for (let i = 0; i < 3; i++) hearts.push(dlvHeart(gHearts));
  // Wally's waving hand
  const wHand = G(WA.back);
  E('path', { d: 'M40,30 Q90,20 104,-14', fill: 'none', stroke: C.waterDk, 'stroke-width': 14, 'stroke-linecap': 'round' }, wHand);
  E('path', { d: 'M40,30 Q90,20 104,-14', fill: 'none', stroke: C.water, 'stroke-width': 8, 'stroke-linecap': 'round' }, wHand);
  E('circle', { cx: 106, cy: -22, r: 15, fill: C.water, stroke: C.waterDk, 'stroke-width': 3 }, wHand);
  const wRipple = E('ellipse', { rx: 120, ry: 30, fill: 'none', stroke: C.water, 'stroke-width': 5 }, WA.back);
  // grey puff for Carl
  const puff = G(OFf), puffs = [];
  for (let i = 0; i < 6; i++) puffs.push({ el: E('circle', { r: 40, fill: '#9AA6B2', opacity: 0.8 }, puff), a: i / 6 * TAU });
  // energy sparks that fly Gloria -> Mitch ("I release it")
  const flyG = G(OFf), fly = [];
  for (let i = 0; i < 3; i++) fly.push(spark(flyG, 16, { seed: i + 3 }));

  // desk (in front of Mitch)
  const desk = G(OFf);
  E('rect', { x: 680, y: 516, width: 340, height: 130, rx: 8, fill: linGrad('#8A5A3A', '#5E3A24', true), stroke: INK, 'stroke-width': 4 }, desk);
  E('rect', { x: 672, y: 506, width: 356, height: 22, rx: 6, fill: '#B07A45', stroke: INK, 'stroke-width': 4 }, desk);
  const plate = chip(desk, 'MITCH', { size: 26, fill: '#F2E2B8', color: INK, h: 40, rx: 6 }); tr(plate, 850, 586);
  const dMug = scMug(desk, 0.45); tr(dMug, 975, 480, 0.45);

  // office chips (overlay, inside the camera)
  const ov = G(OFf);
  const cGlu = chip(ov, 'GLUCOSE', { size: 44, fill: C.glucose, color: '#3A2600' });
  const cSugar = T(ov, 690, 252, 'a sugar (from the toast)', { size: 32, weight: 600, anchor: 'middle', fill: C.glucoseLt });
  const cStored = G(ov); { const c = chip(cStored, 'energy stored in **chemical bonds**', { size: 32, fill: '#0E1A24', boldFill: C.energy }); const sp = spark(cStored, 13, { seed: 5 }); tr(sp, -c.w / 2 - 26, 0); cStored.sp = sp; }
  const cNeed = chip(ov, 'first: I need **oxygen**', { size: 34, fill: '#0E1A24', boldFill: '#FF9A8F' });
  const cOxy = chip(ov, 'oxygen', { size: 34, fill: C.oxygen, color: '#FFFFFF' });
  const cPair = T(ov, 250, 628, 'always a pair', { size: 30, weight: 700, anchor: 'middle', fill: '#FF9A8F' });
  const cO2 = dlvChip(ov, 'O_2', { size: 70, fill: C.oxygen, color: '#FFFFFF', stroke: '#FFE1DC' });
  const cO2n = T(ov, 500, 150, 'one molecule = two O atoms', { size: 26, weight: 600, anchor: 'middle', fill: '#FFD0CB' });
  const cCarl = dlvChip(ov, 'carbon dioxide (CO_2)', { size: 36, fill: C.carbon, color: '#10202B' });
  const cWaste = chip(ov, 'waste product', { size: 30, fill: '#0E1A24', color: C.co2, stroke: C.carbon });
  const route = G(ov), routeParts = [];
  {
    const RT = [['blood', '#E8424F', '#FFFFFF'], ['lungs', '#F48FA6', '#3A0A18'], ['out of the mouth', C.air, '#0A2A3A']];
    const cs = RT.map(([s, f, c]) => chip(route, s, { size: 32, fill: f, color: c }));
    const GAP = 84; let x = 600 - (cs.reduce((a, c) => a + c.w, 0) + GAP * 2) / 2;
    cs.forEach((c, i) => {
      if (i) { routeParts.push(arrow(route, x - GAP + 12, 168, x - 12, 168, { color: C.ink, width: 5 })); }
      tr(c, x + c.w / 2, 168); routeParts.push(c); x += c.w + GAP;
    });
  }
  const cWater = dlvChip(ov, 'water (H_2O)', { size: 40, fill: C.water, color: '#06283A' });
  const cMade = G(ov); { const c = chip(cMade, 'energy is made', { size: 38, fill: '#0E1A24', color: C.ink, stroke: C.bad }); const s = strike(cMade, -c.w / 2 + 22, 2, c.w / 2 - 22, C.bad); cMade.sk = s; const x = cross(cMade, 16); tr(x, c.w / 2 + 34, 0); cMade.x = x; }
  const cRel = G(ov); { const c = chip(cRel, 'energy is **released**', { size: 38, fill: '#0E1A24', boldFill: C.good, stroke: C.good }); const k = tick(cRel, 18); tr(k, c.w / 2 + 36, 4); }
  const burst = G(ov), bursts = [];
  for (let i = 0; i < 6; i++) bursts.push({ el: spark(burst, 13, { seed: i }), a: i / 6 * TAU + 0.3 });

  /* =================== CONFESSIONAL =================== */
  const ccam = CFb, CF = G(root);
  const conf = scConfessional(ccam, 'mitch');
  E('rect', { x: 0, y: 640, width: 1200, height: 110, fill: '#2A1216' }, ccam);
  E('rect', { x: 0, y: 632, width: 1200, height: 14, fill: '#6B3A2A' }, ccam);
  const cMug = scMug(ccam, 0.9); tr(cMug, 150, 586, 0.9);
  // card 1: Gloria = glucose = the fuel
  const k1 = G(CF);
  card(k1, 740, 150, 400, 300, { fill: '#0E1A24', stroke: '#6B4A12', opacity: 0.94 });
  const k1a = G(k1); { const gm = molGlucose(k1a, 44); tr(gm, 940, 250); }
  const k1b = T(k1, 940, 346, 'glucose', { size: 44, weight: 700, anchor: 'middle', fill: C.glucose });
  const k1c = T(k1, 940, 410, '= the **fuel**', { size: 40, weight: 600, anchor: 'middle', boldFill: C.energy });
  // card 2: oxygen's route
  const k2 = G(CF);
  card(k2, 740, 130, 410, 380, { fill: '#0E1A24', stroke: '#6E2323', opacity: 0.94 });
  T(k2, 945, 176, "the twins' commute", { size: 30, weight: 700, anchor: 'middle', fill: '#FF9A8F' });
  const k2r = [];
  { const g = G(k2); E('path', { d: 'M820,214 L820,232 M820,232 Q806,240 800,246 M820,232 Q834,240 840,246', stroke: '#E9C7D2', 'stroke-width': 5, fill: 'none' }, g); E('path', { d: 'M812,238 C792,232 780,252 780,268 C780,282 796,284 812,276 Z M828,238 C848,232 860,252 860,268 C860,282 844,284 828,276 Z', fill: '#F48FA6', stroke: '#FFD0DC', 'stroke-width': 2 }, g); T(g, 890, 256, 'lungs', { size: 32, weight: 700 }); k2r.push(g); }
  { const g = G(k2); const a = arrow(g, 820, 296, 820, 326, { color: C.ink, width: 5 }); k2r.push(g); }
  { const g = G(k2); E('ellipse', { cx: 820, cy: 362, rx: 44, ry: 18, fill: ball('#FF6B6B', '#B32635'), stroke: '#7A1420', 'stroke-width': 3 }, g); tr(molO2(g, 11), 820, 340); T(g, 890, 372, 'blood', { size: 32, weight: 700 }); k2r.push(g); }
  { const g = G(k2); arrow(g, 820, 400, 820, 430, { color: C.ink, width: 5 }); k2r.push(g); }
  { const g = G(k2); const mm = mitochondrion(g, 84, 40); tr(mm, 820, 464); T(g, 890, 476, 'me. Every time.', { size: 30, weight: 700, fill: C.mito }); k2r.push(g); }
  // card 3: the exam
  const k3 = G(CF);
  card(k3, 720, 130, 430, 300, { fill: '#0E1A24', stroke: '#3A4B5C', opacity: 0.95 });
  const k3a = G(k3);
  T(k3a, 750, 178, 'WRITE THIS:', { size: 26, weight: 700, fill: C.muted, ls: 2 });
  T(k3a, 750, 228, 'respiration', { size: 38, weight: 700 });
  T(k3a, 750, 280, '**releases** energy', { size: 40, weight: 600, boldFill: C.good });
  { const k = tick(k3a, 18); tr(k, 1110, 266); }
  const k3b = G(k3);
  E('line', { x1: 750, y1: 312, x2: 1120, y2: 312, stroke: '#3A4B5C', 'stroke-width': 3 }, k3b);
  T(k3b, 750, 352, 'NOT THIS:', { size: 26, weight: 700, fill: C.muted, ls: 2 });
  T(k3b, 750, 402, 'makes energy', { size: 38, weight: 700 });
  const k3s = strike(k3b, 744, 390, 750 + textWidth('makes energy', 38, FD, 700) + 6, C.bad);
  const k3x = cross(k3b, 16); tr(k3x, 1110, 390);
  // the examiner, crying into their tea
  const ex = G(CF); tr(ex, 935, 548);
  E('circle', { r: 92, fill: '#F4E9D8', stroke: '#FFFFFF', 'stroke-width': 5 }, ex);
  E('path', { d: 'M-56,70 Q-52,30 0,28 Q52,30 56,70 Q30,86 0,88 Q-30,86 -56,70 Z', fill: '#5B6B8A' }, ex);
  E('circle', { cy: -18, r: 40, fill: '#E8B48E', stroke: INK, 'stroke-width': 3 }, ex);
  E('path', { d: 'M-40,-26 Q-38,-64 0,-62 Q38,-64 40,-26 Q30,-46 0,-48 Q-30,-46 -40,-26 Z', fill: '#9AA6B2', stroke: INK, 'stroke-width': 2 }, ex);
  E('circle', { cx: -16, cy: -20, r: 12, fill: 'none', stroke: INK, 'stroke-width': 3 }, ex);
  E('circle', { cx: 16, cy: -20, r: 12, fill: 'none', stroke: INK, 'stroke-width': 3 }, ex);
  E('path', { d: 'M-22,-20 Q-16,-15 -10,-20 M10,-20 Q16,-15 22,-20 M-12,6 Q0,-2 12,6', fill: 'none', stroke: INK, 'stroke-width': 3, 'stroke-linecap': 'round' }, ex);
  const tears = [E('path', { d: '', fill: 'none', stroke: '#5AB4E0', 'stroke-width': 5, 'stroke-linecap': 'round' }, ex), E('path', { d: '', fill: 'none', stroke: '#5AB4E0', 'stroke-width': 5, 'stroke-linecap': 'round' }, ex)];
  E('path', { d: 'M-34,34 L34,34 L28,66 Q0,74 -28,66 Z', fill: '#FFFFFF', stroke: INK, 'stroke-width': 3 }, ex);
  E('path', { d: 'M33,42 Q50,44 44,58 Q40,62 30,60', fill: 'none', stroke: INK, 'stroke-width': 3 }, ex);
  E('ellipse', { cy: 36, rx: 32, ry: 6, fill: '#B07A45' }, ex);
  const exRip = E('ellipse', { cy: 36, rx: 10, ry: 2, fill: 'none', stroke: '#F2D9B8', 'stroke-width': 2 }, ex);
  const exLbl = T(CF, 935, 690, '(an examiner, somewhere)', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });

  /* =================== TRACK (Kavya breathes out) =================== */
  const track = scTrack(TK);
  const KW = G(TK), KV = scChar(KW, 'kavya'); tr(KW, 400, 470, 1.3);
  const kBreath = E('path', { d: 'M0,0 C-30,-26 -80,-20 -96,6 C-110,30 -60,44 -30,30 C-14,22 -4,12 0,0 Z', fill: '#FFFFFF', opacity: 0.6 }, TK);
  const kCO2 = []; for (let i = 0; i < 4; i++) { const g = G(TK); E('circle', { cx: -17, r: 10, fill: C.oxygen }, g); E('circle', { cx: 17, r: 10, fill: C.oxygen }, g); E('circle', { r: 12, fill: C.carbon, stroke: C.carbonDk, 'stroke-width': 2 }, g); kCO2.push(g); }
  const kChip = dlvChip(TK, 'breathing out: CO_2 leaves', { size: 32, fill: '#0E1A24', color: '#FFFFFF' }); tr(kChip, 860, 190);
  const kBub = G(TK); tr(kBub, 900, 470);
  E('circle', { r: 128, fill: linGrad('#3A1A1E', '#5A2626', true), stroke: '#FFFFFF', 'stroke-width': 6 }, kBub);
  { const c = chip(kBub, 'Carl, live', { size: 26, fill: '#0E1A24' }); tr(c, 0, 160); }

  /* =================== lower thirds =================== */
  const LT = G(root);
  const ltG = dlvLower('GLORIA', 'Glucose. The fuel.');
  const ltT = dlvLower('OTTO & OSCAR', 'Oxygen. Always a pair.');
  const ltC = dlvLower('CARL', 'Carbon dioxide. Waste product.');
  const ltW = dlvLower('WALLY', "Water. Doesn't talk.");
  const LTS = [[ltG, at('gloria') + 0.4], [ltT, at('otto2') - 0.1], [ltC, mid('carl', 0.3)], [ltW, at('wally') + 0.5]];


  return t => {
    const shot = shotAt(t), sid = shot[0], set = shot[2];
    const s1 = SH.findIndex(s => s[0] === sid), sEnd = s1 < SH.length - 1 ? SH[s1 + 1][1] : 1e9;
    op(BL, set === 'blood' ? 1 : 0); op(OF, set === 'office' ? 1 : 0); op(OFf, set === 'office' ? 1 : 0); op(CFb, set === 'conf' ? 1 : 0); op(CF, set === 'conf' ? 1 : 0); op(TK, set === 'track' ? 1 : 0);
    const pose = {}, ovOn = new Set();
    op(taxi, 0);
    let k = 1, fx = 600, fy = 400;
    LTS.forEach(([g, t0]) => g.set(shotAt(t0)[0] === sid ? win(t, t0, t0 + 3.2, 0.35) : 0));
    const talk = who => scTalk(S, t, who);

    /* ---------- blood ---------- */
    if (set === 'blood') {
      blood.upd(t);
      const u = P(t, at('time') - 0.2, end('time') - at('time') + 0.8, linear);
      pose.gloria = { x: lerp(-150, 600, easeOut(u)), y: 380 + 16 * Math.sin(t * 1.7) * AMP, s: 0.8, r: 7 * Math.sin(t * 1.3) * AMP, mood: 'happy', look: 0.6, tag: 1 };
      dlvPop(clock, 1040, 122, P(t, at('time') + 0.1, 0.5, pop));
      attr(clockMin, 'transform', `rotate(${(-8 * (1 - P(t, at('time') + 0.2, 0.8))).toFixed(2)})`);
      op(clockLbl, P(t, at('time') + 0.3, 0.4, linear));
      dlvPop(blC1, 380, 675, P(t, mid('time', 0.3), 0.5, pop));
      dlvPop(blC2, 820, 675, P(t, mid('time', 0.72), 0.5, pop));
    }

    /* ---------- office ---------- */
    if (set === 'office') {
      let dimV = 0, showDesk = false, showBoard = false, showDisco = false, showAer = false, showFine = false, showTaxi = false;
      let dlOpen = 0, drOpen = 0;
      const lookAt = (fromX, toX) => clamp((toX - fromX) / 200, -1, 1);
      if (sid === 'offA') {
        showDesk = true;
        dlOpen = P(t, at('gloria') - 0.12, 0.2);
        const e = P(t, at('gloria') - 0.05, 0.55, easeOut);
        pose.gloria = { x: lerp(110, 400, e), y: 400 - 50 * Math.sin(Math.PI * e), s: 1.1 * (0.6 + 0.4 * e), r: 5 * Math.sin(t * 5) * AMP, mood: 'happy', look: 0.4 };
        pose.mitch = { x: 850, y: 430, s: 0.95, mood: t < at('gloria') + 0.6 ? 'neutral' : 'deadpan', look: -1 };
        ovOn.add('glu'); ovOn.add('hearts'); ovOn.add('burstEntry');
      } else if (sid === 'offB') {
        showDesk = true;
        const move = P(t, at('otto1') - 0.4, 0.45);
        const sad = t >= mid('needox', 0.1) && t < at('otto1');
        const lean = 8 * win(t, mid('stored', 0.78), at('needox') + 0.1, 0.25);
        pose.gloria = { x: lerp(420, 600, move), y: lerp(400, 410, move), s: lerp(1.15, 1.0, move), r: lean, mood: sad ? 'sad' : 'happy', look: t < at('otto1') - 0.3 ? 1 : -1, glow: win(t, mid('stored', 0.2), at('needox') + 0.2, 0.4), sparks: win(t, mid('stored', 0.25), at('needox') + 0.2, 0.4) };
        const mMood = (t >= at('needox') - 0.1 && t < at('otto1')) ? 'annoyed' : 'deadpan';
        pose.mitch = { x: 850, y: 430, s: 0.95, mood: mMood, look: -1, arm: win(t, at('needox') + 0.15, at('otto1') + 0.1, 0.25) };
        if (t >= at('otto1') - 0.6) {
          showTaxi = true;
          const e = P(t, at('otto1') - 0.5, 0.85, easeOut);
          const tx = lerp(-260, 250, e), skid = -8 * Math.sin(Math.PI * P(t, at('otto1') + 0.2, 0.6, linear));
          tr(taxi, tx, 520, 1, skid);
          op(taxiLbl, win(t, at('otto1') + 0.3, at('otto2') - 0.1, 0.3));
          pose.twins = { x: tx, y: 392, s: 0.85, r: skid, mood: 'happy', look: 1, lookB: t >= at('oscar1') - 0.1 ? 1 : -0.6, glowBond: win(t, mid('oscar2', 0.68), at('otto3'), 0.3) };
          dlOpen = Math.max(P(t, at('otto1') - 0.7, 0.2), 0) * (1 - P(t, at('otto2'), 0.5));
        }
        ovOn.add('stored'); ovOn.add('need'); ovOn.add('oxy'); ovOn.add('o2');
      } else if (sid === 'aer') {
        dimV = 0.55; showAer = true;
        const pg = P(t, mid('aerobic', 0.05), 0.5, pop), pt = P(t, mid('aerobic', 0.16), 0.5, pop), pm = P(t, mid('aerobic', 0.3), 0.5, pop);
        pose.gloria = { x: 260, y: 520, s: 0.8 * Math.max(0.01, pg), mood: 'happy', look: 1 };
        pose.twins = { x: 600, y: 520, s: 0.6 * Math.max(0.01, pt), mood: 'happy', look: 1 };
        pose.mitch = { x: 970, y: 520, s: 0.75 * Math.max(0.01, pm), mood: 'deadpan', look: -1 };
      } else if (sid === 'word' || sid === 'sym' || sid === 'bal') {
        showBoard = true; dimV = 0.3;
        const sp = sid === 'word' ? 'mitch' : (scWho(S, t) || 'mitch');
        const X = { gloria: 170, wally: 380, twins: 600, carl: 800, mitch: 1010 };
        const tgt = sp === 'otto' || sp === 'oscar' ? X.twins : X[sp] || X.mitch;
        const ln = (x) => lookAt(x, tgt);
        pose.mitch = { x: 1010, y: 610, s: 0.66, mood: 'deadpan', look: sp === 'mitch' ? 0 : ln(1010) };
        pose.gloria = { x: 170, y: 618, s: 0.58, mood: 'happy', look: ln(170) };
        const hop = (id) => (sid === 'sym' && (scWho(S, t) === 'otto' || scWho(S, t) === 'oscar')) ? Math.abs(Math.sin(t * 5)) * 10 * AMP : 0;
        pose.twins = { x: 600, y: 618 - hop(), s: 0.55, mood: 'happy', look: sp === 'oscar' ? 1 : ln(600), lookB: sp === 'otto' ? -1 : ln(600) };
        if (sid !== 'word') {
          pose.wally = { x: 380, y: 622, s: 0.5, mood: 'neutral', look: ln(380) };
          pose.carl = { x: 800, y: 630, s: 0.42, mood: 'sad', look: ln(800) };
        }
      } else if (sid === 'party') {
        dimV = 0.62; showDisco = true;
        const b1 = Math.abs(Math.sin(t * Math.PI * 2.2)), b2 = Math.abs(Math.sin(t * Math.PI * 2.2 + 1.2));
        pose.gloria = { x: 420 + 20 * Math.sin(t * 2.2) * AMP, y: 430 - 26 * b1 * AMP, s: 1.0, r: 12 * Math.sin(t * Math.PI * 1.1) * AMP, mood: 'happy', look: 1 };
        pose.twins = { x: 790 - 20 * Math.sin(t * 2.2) * AMP, y: 430 - 26 * b2 * AMP, s: 0.85, r: -12 * Math.sin(t * Math.PI * 1.1) * AMP, mood: 'happy', look: -1 };
        pose.mitch = { x: 1092, y: 586, s: 0.5, mood: 'deadpan', look: -1 };
      } else if (sid === 'fine') {
        showFine = true; dimV = 0.2;
        pose.mitch = { x: 300, y: 430, s: 1.3, mood: 'deadpan', look: t > mid('fine', 0.62) ? 1 : 0 };
      } else if (sid === 'carl') {
        const thrown = P(t, mid('thrown', 0.3), 0.55, easeIn);
        drOpen = P(t, mid('thrown', 0.25), 0.25);
        const cx = lerp(660, 1085, thrown), cs = lerp(1.1, 0.75, thrown), cr = lerp(0, 90, P(t, mid('thrown', 0.3), 0.35));
        const appear = P(t, mid('carl', 0.2), 0.5, pop);
        pose.carl = { x: cx, y: lerp(420, 410, thrown), s: cs * Math.max(0.01, appear), r: cr, mood: t >= mid('thrown', 0.28) && t < mid('thrown', 0.5) ? 'shock' : t >= mid('thrown', 0.5) ? 'annoyed' : 'sad', look: t >= mid('thrown', 0.5) ? -1 : 0, puff: P(t, mid('carl', 0.1), 1.1, linear) };
        const bye = t >= mid('thrown', 0.3);
        pose.gloria = { x: 170, y: 480, s: 0.75, mood: bye ? 'happy' : 'neutral', look: 1, wave: bye };
        pose.twins = { x: 400, y: 494, s: 0.6, mood: bye ? 'happy' : 'neutral', look: 1 };
        ovOn.add('carl'); ovOn.add('route');
      } else if (sid === 'rude') {
        k = 1 + 0.12 * P(t, mid('breath', 0.88), 1.2); fx = 600; fy = 400;
        pose.carl = { x: 600, y: 410, s: 1.5, mood: 'annoyed', look: 0 };
      } else if (sid === 'wally') {
        const pw = P(t, at('wally') + 0.15, 0.5, pop);
        k = 1 + 0.24 * P(t, end('wally') + 0.05, 1.0); fx = 640; fy = 420;
        const stare = t > end('wally') - 0.1;
        pose.mitch = { x: 180, y: 432, s: 0.8, mood: 'deadpan', look: 1 };
        pose.gloria = { x: 384, y: 440, s: 0.75, mood: stare ? 'neutral' : 'happy', look: 1 };
        pose.wally = { x: 640, y: 432, s: 1.1 * Math.max(0.01, pw), mood: 'neutral', look: 0, wave: P(t, at('wally') + 0.4, 0.3, linear) * (1 - P(t, end('wally') + 0.1, 0.3, linear)), ripple: P(t, at('wally') + 0.1, 0.8, linear) };
        pose.twins = { x: 880, y: 440, s: 0.65, mood: 'neutral', look: -1 };
        pose.carl = { x: 1072, y: 444, s: 0.55, mood: 'sad', look: -1 };
        ovOn.add('water');
      } else if (sid === 'make') {
        pose.gloria = { x: 600, y: 410, s: 1.6, r: 6 * Math.sin(t * 7) * AMP, mood: 'happy', look: 0, glow: 1, sparks: 1 };
        ovOn.add('burstMake');
      } else if (sid === 'no') {
        k = 1 + 0.26 * P(t, end('make') + 0.2, at('cant') - end('make') - 0.3); fx = 600; fy = 390;
        pose.mitch = { x: 600, y: 420, s: 1.7, mood: 'deadpan', look: 0 };
      } else if (sid === 'cant') {
        const rel = P(t, mid('cant', 0.84), 0.9, linear);
        pose.mitch = { x: 300, y: 452, s: 1.1, mood: 'neutral', look: 1, glow: rel };
        pose.gloria = { x: 900, y: 452, s: 1.0, mood: t < mid('cant', 0.4) ? 'sad' : 'happy', look: -1, glow: win(t, mid('cant', 0.42), 1e9, 0.4) * (1 - 0.6 * rel), sparks: win(t, mid('cant', 0.42), 1e9, 0.4) };
        ovOn.add('made'); ovOn.add('rel');
      }

      op(dim, 1); dim.setAttribute('opacity', dimV.toFixed(3));
      doorL.open(dlOpen); doorR.open(drOpen);
      op(desk, showDesk ? 1 : 0); op(board, showBoard ? 1 : 0); op(disco, showDisco ? 1 : 0); op(aerG, showAer ? 1 : 0); op(fineG, showFine ? 1 : 0);
      op(taxi, showTaxi ? 1 : 0);

      // energy sparks Gloria -> Mitch
      const flyOn = sid === 'cant' ? P(t, mid('cant', 0.84), 0.2, linear) : 0;
      op(flyG, flyOn);
      if (flyOn > 0) fly.forEach((f, i) => {
        const u = clamp((t - mid('cant', 0.84) - i * 0.18) / 0.9), e = ease(u);
        tr(f, lerp(870, 330, e), 440 - Math.sin(Math.PI * e) * 150 + i * 6, 1 - 0.3 * e); op(f, u > 0 && u < 1 ? 1 : 0); f.upd(t);
      });

      // board content
      if (showBoard) {
        op(bWord, sid === 'word' ? 1 : 0); op(bSym, sid === 'sym' ? 1 : 0); op(bBal, sid === 'bal' ? 1 : 0);
        if (sid === 'word') {
          wParts.forEach(p => { const a = P(t, mid('word', p.f), 0.45, pop); dlvPop(p.g, p.x, 262, a); });
          const ea = P(t, mid('word', 0.7), 0.5, pop); dlvPop(wEn, wEnX, 418, ea); wSpark.upd(t);
        }
        if (sid === 'sym') {
          const up = P(t, at('six') - 0.3, 0.6);
          op(symHead, 1 - up); op(wordRow, P(t, at('symbol') + 0.6, 0.5, linear) * (1 - up));
          sParts.forEach(p => { const a = P(t, at('eq') > t ? -1 : mid('eq', p.f), 0.4, pop); op(p.g, at('eq') > t ? 0 : clamp(a * 2)); });
          const y = lerp(340, 196, up), s = lerp(1, 0.74, up);
          symRow.setAttribute('transform', `translate(600 ${y.toFixed(1)}) scale(${s.toFixed(3)}) translate(-600 0)`);
          op(cnt, P(t, at('six') - 0.1, 0.4, linear));
          op(cLblL, P(t, at('six'), 0.3, linear)); op(cLblR, P(t, at('count'), 0.3, linear));
          dotsL.forEach((d, i) => {
            const t0 = d.r < 2 ? mid('six', 0.12 + (i / 12) * 0.5) : mid('plus', 0.12 + (d.c / 6) * 0.45);
            dlvPop(d.g, d.x, d.y, P(t, t0, 0.3, pop));
          });
          dotsR.forEach(d => { dlvPop(d.g, d.x, d.y, P(t, mid('count', 0.08 + (d.i / 18) * 0.62), 0.3, pop)); });
          op(cTagL1, P(t, mid('six', 0.5), 0.3, linear)); op(cTagL2, P(t, mid('plus', 0.25), 0.3, linear));
          op(cTagR1, P(t, mid('count', 0.45), 0.3, linear)); op(cTagR2, P(t, mid('count', 0.7), 0.3, linear));
          op(numL, P(t, mid('six', 0.7), 0.3, linear) * (1 - P(t, mid('plus', 0.6), 0.2, linear)));
          op(numL2, P(t, mid('plus', 0.6), 0.3, linear));
          op(numR, P(t, end('count') - 0.1, 0.3, linear));
          dlvPop(cEq, 600, 344, P(t, end('count'), 0.4, pop));
        }
        if (sid === 'bal') {
          const u = (t - mid('balance', 0.05));
          const ang = u < 0 ? -12 : -12 * Math.exp(-u * 0.9) * Math.cos(u * 3.2 * (S.reduce ? 0.5 : 1));
          const ar = ang * Math.PI / 180, ex2 = 270 * Math.cos(ar), ey2 = 270 * Math.sin(ar);
          tr(beam, 600, 230, 1, ang);
          tr(panL, 600 - ex2, 230 - ey2); tr(panR, 600 + ex2, 230 + ey2);
          const top2 = P(t, mid('balance', 0.86), 0.35, linear);
          op(balTop1, P(t, mid('balance', 0.05), 0.4, linear) * (1 - top2));
          dlvPop(balTop2, 600, 156, P(t, mid('balance', 0.86), 0.45, pop));
          dlvPop(balNew, 600, 452, P(t, mid('balance', 0.5), 0.45, pop));
        }
      }
      // disco
      if (showDisco) {
        beams.forEach((b, i) => { const a = 34 * Math.sin(t * (0.9 + i * 0.17) * AMP + i * 1.3); b.setAttribute('transform', `translate(600 150) rotate(${a.toFixed(1)})`); });
        spots.forEach((s, i) => { attr(s, 'cx', 600 + 420 * Math.sin(t * (0.7 + i * 0.13) * AMP + i * 2)); attr(s, 'cy', 640 + 30 * Math.sin(i)); });
        tr(dball, 600, 150, 1, (t * 40) % 360);
      }
      // aerobic title
      if (showAer) {
        dlvPop(aerT, 600, 186, P(t, mid('aerobic', 0.5), 0.5, pop));
        op(aerM, P(t, mid('aerobic', 0.8), 0.5, linear));
        op(aerPlus, P(t, mid('aerobic', 0.16), 0.3, linear)); aerArr.set(P(t, mid('aerobic', 0.28), 0.5)); op(aerArr, P(t, mid('aerobic', 0.27), 0.2, linear));
        aerL.forEach((l, i) => op(l, P(t, mid('aerobic', [0.07, 0.18, 0.32][i]), 0.4, linear)));
      }
      // atoms swap partners
      if (showFine) {
        dlvPop(fineChip, 876, 172, P(t, mid('fine', 0.04), 0.4, pop));
        const sw0 = mid('fine', 0.68);
        op(fBondA, 1 - P(t, sw0, 0.3, linear)); op(fBondB, P(t, sw0 + 1.2, 0.4, linear));
        fLblA.forEach(l => op(l, 1 - P(t, sw0, 0.3, linear)));
        fLblB.forEach(l => op(l, P(t, sw0 + 1.2, 0.4, linear)));
        fArr.set(P(t, sw0 + 0.1, 0.5)); op(fArr, P(t, sw0, 0.2, linear));
        fAtoms.forEach(({ q, el, d }, i) => {
          const u = P(t, sw0 + d, 1.0), cx = (q.a[0] + q.b[0]) / 2 + (i % 2 ? 60 : -60), cy = (q.a[1] + q.b[1]) / 2;
          const v = 1 - u, x = v * v * q.a[0] + 2 * v * u * cx + u * u * q.b[0], y = v * v * q.a[1] + 2 * v * u * cy + u * u * q.b[1];
          const jig = (u <= 0 || u >= 1) ? Math.sin(t * 2.3 + i) * 1.5 * AMP : 0;
          tr(el, x + jig, y, 1, u > 0 && u < 1 ? u * 360 * (i % 2 ? 1 : -1) : 0);
        });
      }

      // office overlay chips
      const vis = (key, t0, t1) => (ovOn.has(key) ? win(t, t0, t1, 0.2) : 0);
      { const p = ovOn.has('glu') ? P(t, mid('gloria', 0.24), 0.45, pop) : 0; dlvPop(cGlu, 690, 172, p); op(cSugar, ovOn.has('glu') ? P(t, mid('gloria', 0.4), 0.4, linear) : 0); }
      { const v = vis('stored', mid('stored', 0.5), at('needox') + 0.1); dlvPop(cStored, 600, 168, v); if (v > 0) cStored.sp.upd(t); }
      { const v = vis('need', mid('needox', 0.45), at('otto1') - 0.2); dlvPop(cNeed, 600, 168, v); }
      { const v = vis('oxy', mid('oscar2', 0.35), 1e9); dlvPop(cOxy, 330, 200, v); op(cPair, vis('oxy', mid('oscar2', 0.68), 1e9)); }
      { const v = ovOn.has('o2') ? P(t, at('otto3') + 0.05, 0.45, pop) : 0; dlvPop(cO2, 500, 240, v); op(cO2n, ovOn.has('o2') ? P(t, at('otto3') + 0.5, 0.4, linear) : 0); }
      { dlvPop(cCarl, 760, 160, ovOn.has('carl') ? P(t, mid('carl', 0.55), 0.45, pop) * (1 - P(t, at('thrown') + 0.2, 0.25, linear)) : 0);
        dlvPop(cWaste, 760, 238, ovOn.has('carl') ? P(t, mid('carl', 0.8), 0.45, pop) * (1 - P(t, at('thrown') + 0.2, 0.25, linear)) : 0); }
      { const on = ovOn.has('route'); op(route, on ? 1 : 0);
        if (on) { const f = [0.55, 0.62, 0.68, 0.76, 0.84]; routeParts.forEach((g, i) => { const tt = mid('thrown', f[i]); if (g.set) { g.set(P(t, tt, 0.4)); op(g, P(t, tt, 0.1, linear)); } else op(g, P(t, tt, 0.3, linear)); }); } }
      { const p = ovOn.has('water') ? P(t, mid('wally', 0.12), 0.45, pop) : 0; dlvPop(cWater, 640, 172, p); }
      { const on = ovOn.has('made'); dlvPop(cMade, 600, 176, on ? P(t, mid('cant', 0.1), 0.45, pop) : 0); if (on) { cMade.sk.set(P(t, mid('cant', 0.26), 0.35)); op(cMade.x, P(t, mid('cant', 0.3), 0.2, linear)); }
        dlvPop(cRel, 600, 270, ovOn.has('rel') ? P(t, mid('cant', 0.82), 0.45, pop) : 0); }
      { const entry = ovOn.has('burstEntry'), mk = ovOn.has('burstMake');
        const t0 = entry ? at('gloria') + 0.2 : at('make');
        const on = entry || mk; op(burst, on ? 1 : 0);
        if (on) {
          const cx = entry ? 400 : 600, cy = entry ? 400 : 410, R0 = entry ? 110 : 170;
          bursts.forEach((b, i) => {
            const q = mk ? ((t - t0) * 0.6 + i / 6) % 1 : clamp((t - t0) / 0.9);
            const d = R0 + (mk ? 90 : 120) * easeOut(q);
            tr(b.el, cx + Math.cos(b.a) * d, cy + Math.sin(b.a) * d * 0.85, 0.6 + 0.6 * (1 - q)); op(b.el, t < t0 ? 0 : Math.sin(Math.PI * q)); b.el.upd(t);
          });
        }
      }
    }

    /* ---------- confessional ---------- */
    if (set === 'conf') {
      conf.set(1, t);
      let mood = 'deadpan', sweat = 0; fx = 430; fy = 360;
      if (sid === 'conf1') k = 1 + 0.16 * P(t, end('th_gloria') - 0.4, 1.0);
      if (sid === 'conf2') { k = 1 + 0.14 * P(t, end('th_twins') - 0.3, 1.0); mood = 'annoyed'; sweat = P(t, mid('th_twins', 0.8), 0.5, linear); }
      if (sid === 'exam') k = 1 + 0.1 * P(t, end('th_exam') - 0.2, 1.0);
      pose.mitch = { x: 430, y: 380, s: 1.5, mood, look: 0, sweat };
      op(k1, sid === 'conf1' ? 1 : 0); op(k2, sid === 'conf2' ? 1 : 0); op(k3, sid === 'exam' ? 1 : 0);
      op(ex, sid === 'exam' ? 1 : 0); op(exLbl, sid === 'exam' ? 1 : 0);
      if (sid === 'conf1') {
        op(k1, P(t, at('th_gloria'), 0.3, linear));
        op(k1a, 1); op(k1b, P(t, mid('th_gloria', 0.12), 0.4, linear)); op(k1c, P(t, mid('th_gloria', 0.4), 0.4, linear));
      }
      if (sid === 'conf2') {
        op(k2, P(t, at('th_twins'), 0.3, linear));
        k2r.forEach((g, i) => op(g, P(t, mid('th_twins', [0.08, 0.16, 0.2, 0.3, 0.36][i]), 0.35, linear)));
      }
      if (sid === 'exam') {
        op(k3, P(t, at('th_exam'), 0.3, linear));
        op(k3a, P(t, mid('th_exam', 0.04), 0.4, linear)); op(k3b, P(t, mid('th_exam', 0.36), 0.4, linear));
        k3s.set(P(t, mid('th_exam', 0.5), 0.35)); op(k3x, P(t, mid('th_exam', 0.54), 0.2, linear));
        const pe = P(t, mid('th_exam', 0.6), 0.5, pop); dlvPop(ex, 935, 548, pe); op(exLbl, P(t, mid('th_exam', 0.66), 0.4, linear));
        tears.forEach((tw, i) => { const sd = i ? 1 : -1, q = (t * 1.4) % 1; attr(tw, 'd', `M${sd * 16},-8 Q${sd * 30},${10 + 6 * Math.sin(t * 6 + i)} ${sd * 18},34`); tw.style.opacity = (0.6 + 0.4 * Math.sin(t * 9 + i)).toFixed(3); });
        const rq = (t * 1.2) % 1; attr(exRip, 'rx', 6 + 22 * rq); attr(exRip, 'ry', 1.5 + 4 * rq); exRip.style.opacity = (1 - rq).toFixed(3);
      }
    }

    /* ---------- track: Kavya breathes out ---------- */
    if (set === 'track') {
      track.upd(t, 0);
      const br = wave(t - at('breath'), 1.6);
      KV.set({ t, mood: 'annoyed', look: -0.3 });
      const b0 = at('breath') + 0.3;
      op(kBreath, t > b0 ? 0.25 + 0.5 * br : 0);
      kBreath.setAttribute('transform', `translate(374 486) scale(${(0.7 + 0.5 * br).toFixed(3)})`);
      kCO2.forEach((m, i) => { const q = ((t - b0) * 0.42 + i / 4) % 1; if (t < b0) { op(m, 0); return; } tr(m, 360 - q * 250, 492 - q * 120 + Math.sin(q * 7 + i) * 12, 0.8 + 0.5 * q, q * 120); op(m, Math.sin(q * Math.PI)); });
      dlvPop(kChip, 860, 190, P(t, mid('breath', 0.3), 0.45, pop));
      dlvPop(kBub, 900, 470, P(t, at('breath') + 0.05, 0.4, pop));
      const pc = P(t, at('breath') + 0.05, 0.4, pop);
      pose.carl = { x: 900, y: 470, s: 0.6 * Math.max(0.01, pc), mood: 'sad', look: -1 };
    }

    dlvCam(cam, fx, fy, k);
    // cast (shared by every set)
    const apply = (ch, name, p) => {
      if (!p) { op(ch.w, 0); return; }
      op(ch.w, 1); tr(ch.w, p.x, p.y, p.s, p.r || 0);
      const sw = p.sweat || 0;
      if (name === 'twins') ch.c.set({ t, talk: talk('otto'), talkB: talk('oscar'), mood: p.mood, look: p.look, lookB: p.lookB ?? p.look });
      else if (name === 'wally') ch.c.set({ t: dlvBlinkT(t, 11, [end('wally') + 0.35, end('wally') + 0.75]), talk: 0, mood: p.mood, look: p.look });
      else ch.c.set({ t, talk: talk(name), mood: p.mood, look: p.look, sweat: sw });
    };
    apply(M, 'mitch', pose.mitch); apply(GL, 'gloria', pose.gloria); apply(TW, 'twins', pose.twins); apply(CA, 'carl', pose.carl); apply(WA, 'wally', pose.wally);
    if (pose.mitch) { op(mArm, pose.mitch.arm || 0); if (pose.mitch.arm) tr(mArm, 0, 0, 1, 14 * (1 - pose.mitch.arm)); }
    if (pose.gloria) {
      const gp = pose.gloria;
      op(gBTag, gp.tag || 0);
      op(gGlow, (gp.glow || 0) * 0.85); if (gp.glow) tr(gGlow, 0, 0, 0.9 + 0.12 * wave(t, 1.1));
      op(gSparks, gp.sparks || 0); if (gp.sparks) gSp.forEach(s => s.upd(t));
      const hOn = ovOn.has('hearts') ? P(t, mid('gloria', 0.78), 0.3, linear) : 0;
      op(gHearts, hOn);
      if (hOn > 0) hearts.forEach((h, i) => { const q = ((t - mid('gloria', 0.78)) * 0.55 + i / 3) % 1; tr(h, -70 + i * 70 + 10 * Math.sin(q * 6 + i), -110 - q * 110, 0.9 + 0.3 * q); op(h, Math.sin(q * Math.PI)); });
    }
    op(puff, 0);
    if (pose.carl) {
      const pf = pose.carl.puff || 0;
      op(puff, pf > 0 && pf < 1 ? 1 : 0);
      if (pf > 0 && pf < 1) puffs.forEach((q, i) => { const d = 40 + 140 * easeOut(pf); attr(q.el, 'cx', 660 + Math.cos(q.a) * d); attr(q.el, 'cy', 420 + Math.sin(q.a) * d * 0.7); attr(q.el, 'r', 46 + 30 * pf); q.el.style.opacity = (0.85 * (1 - pf)).toFixed(3); });
    }
    if (pose.wally) {
      const wv = pose.wally.wave || 0;
      op(wHand, wv); if (wv > 0) wHand.setAttribute('transform', `rotate(${(18 * Math.sin(t * TAU * 1.6)).toFixed(2)} 40 30)`);
      const rp = pose.wally.ripple || 0; op(wRipple, rp > 0 && rp < 1 ? 1 - rp : 0); tr(wRipple, 0, 80, 0.4 + 0.9 * rp);
    }
  };
});
