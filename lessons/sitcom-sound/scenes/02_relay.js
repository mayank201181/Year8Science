/* PASS IT ON, scene 2: "Pass it on (but don't go anywhere)".
   Shots (hard cuts): the hall, triangle to ear, "?" -> Archie grabs the DING! and runs -> "No." (Archie frozen
   mid-run, push-in on Nigel) -> the knock: a row of particles, each bumping the next -> the showpiece: the
   red-ringed particle and Nigel each vibrate about a START mark and end where they began -> the energy rides
   the wave, the particles stay -> Nigel's confessional (inset: hair blown off by a drum solo) -> LONGITUDINAL
   (same direction) -> compressions and rarefactions (Archie squashed and spread, delighted) -> Archie imagines
   a stadium -> the stadium wave: TRANSVERSE (across) -> split screen light vs sound -> MEDIUM: solid, liquid,
   gas ... "Here, it's Nigel". */
scene('relay', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.4 : 1;
  const talk = (t, who) => scTalk(S, t, who);

  /* ---------- local helpers (prefixed rel) ---------- */
  function relLabel(parent, text, o) {
    o = o || {};
    return chip(parent, text, { size: o.size || 32, fill: o.fill || 'rgba(10,27,39,0.9)', stroke: o.stroke || C.line, sw: o.sw || 2, color: o.color || C.ink, weight: o.weight || 700 });
  }
  function relBig(parent, text, fill, color, size) { return chip(parent, text, { size: size || 44, fill, color: color || '#FFFFFF', stroke: '#FFFFFF', sw: 4 }); }
  const relPop = (el, p, x, y, s, r) => { op(el, clamp(p * 2.5)); tr(el, x, y, Math.max(0.01, (s || 1) * (0.6 + 0.4 * p)), r); };
  const relCam = (g, k, fx, fy) => g.setAttribute('transform', Math.abs(k - 1) < 1e-4 ? '' : `translate(${fx} ${fy}) scale(${k.toFixed(4)}) translate(${-fx} ${-fy})`);
  function relDouble(parent, x1, y1, x2, y2, col, w) {   // double-headed arrow
    const g = G(parent), a = Math.atan2(y2 - y1, x2 - x1), c = Math.cos(a), s = Math.sin(a), h = 22, hw = 14;
    E('path', { d: `M${x1 + c * h},${y1 + s * h} L${x2 - c * h},${y2 - s * h}`, stroke: col, 'stroke-width': w || 6, 'stroke-linecap': 'round' }, g);
    const head = (x, y, d) => `M${x},${y} L${x - d * c * h - s * hw},${y - d * s * h + c * hw} L${x - d * c * h + s * hw},${y - d * s * h - c * hw} Z `;
    E('path', { d: head(x2, y2, 1) + head(x1, y1, -1), fill: col }, g);
    return g;
  }
  function relTitle(parent, text, col, size) {
    const t = T(parent, 0, 0, text, { size: size || 64, weight: 800, anchor: 'middle', fill: col || '#FFE45C' });
    t.setAttribute('stroke', '#0E1A24'); t.setAttribute('stroke-width', 10); t.setAttribute('paint-order', 'stroke'); t.setAttribute('stroke-linejoin', 'round');
    return t;
  }
  function relParcel(parent) {
    const g = G(parent);
    E('rect', { x: -56, y: -38, width: 112, height: 76, rx: 8, fill: '#D9A35E', stroke: SC_INK, 'stroke-width': 4 }, g);
    E('path', { d: 'M0,-38 L0,38', stroke: '#9C6B2E', 'stroke-width': 8 }, g);
    T(g, 0, 12, 'DING!', { size: 30, weight: 800, anchor: 'middle', fill: SC_INK });
    return g;
  }

  /* ---------- the shot list (hard cuts) ---------- */
  const SH = [
    ['how', -1e9], ['run', at('run') - 0.06], ['no', at('no') - 0.06], ['knock', at('knock') - 0.06], ['back', at('back') - 0.06],
    ['wave', at('wave') - 0.06], ['thnigel', at('thnigel') - 0.06], ['long', at('long') - 0.06], ['squash', at('squash') - 0.06],
    ['stadium', at('stadium') - 0.06], ['across', at('across') - 0.06], ['light', at('light') - 0.06], ['medium', at('medium') - 0.06],
  ];
  const shotAt = t => { let k = 0; for (let i = 0; i < SH.length; i++) if (t >= SH[i][1]) k = i; return SH[k][0]; };
  const t0Of = id => SH.find(s => s[0] === id)[1];

  const Lbg = G(root), Lmid = G(root), Lcast = G(root), Lfg = G(root);

  /* ---------- backgrounds ---------- */
  const hallG = G(Lbg); const hall = pioHall(hallG);
  const airG = G(Lbg); const air = pioAir(airG);
  const confN = pioConf(Lbg, 'nigel');
  const stadBg = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#5EC4FF', '#BDE9FF', true) }, stadBg);
  for (let i = 0; i < 4; i++) E('rect', { x: 0, y: 330 + i * 100, width: 1200, height: 100, fill: i % 2 ? '#3A6E9A' : '#4A82B0' }, stadBg);
  E('rect', { x: 0, y: 600, width: 1200, height: 150, fill: '#2E5A80' }, stadBg);
  const splitBg = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#10233A', '#1D3B5E', true) }, splitBg);
  card(splitBg, 40, 120, 545, 560, { fill: 'rgba(255,255,255,0.05)', stroke: '#FFE45C', sw: 3 });
  card(splitBg, 615, 120, 545, 560, { fill: 'rgba(255,255,255,0.05)', stroke: '#9FD8FF', sw: 3 });

  /* ---------- how: the hall, triangle to ear ---------- */
  const howG = G(Lmid);
  const kbW = G(howG); const kBody = scKavyaBody(kbW); tr(kbW, 260, 668, 1.2); kBody.pose({ armL: [10, 14], armR: [60, 70] });
  const howTri = pioTriangle(howG, 0.5); tr(howTri, 360, 420);
  const lisW = G(howG); const lis = person(lisW, { shirt: '#9B6BD6', shorts: '#2A2A3A', skin: '#E0B48A', hair: '#3A2418' }); tr(lisW, 930, 668, 1.2); lis.pose({ armL: [8, 10], armR: [-8, 10] });
  const earRing = E('circle', { cx: 930, cy: 455, r: 30, fill: 'none', stroke: '#FFE45C', 'stroke-width': 5 }, howG);
  const howPath = E('path', { d: 'M430,420 Q660,300 900,450', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 6, 'stroke-dasharray': '2 16', 'stroke-linecap': 'round' }, howG);
  const howQ = chip(howG, '?', { size: 72, fill: '#FFE45C', color: SC_INK, stroke: SC_INK, sw: 4 });
  const howLabs = G(howG);
  { const a = relLabel(howLabs, 'one ding', { size: 30 }); tr(a, 360, 300); const b = relLabel(howLabs, 'an ear', { size: 30 }); tr(b, 930, 330); }

  /* ---------- run / no ---------- */
  const zoomL = E('path', { d: 'M0,-60 L-200,-60 M-30,-10 L-260,-10 M0,40 L-220,40 M-40,90 L-170,90', stroke: '#FFFFFF', 'stroke-width': 6, 'stroke-linecap': 'round', opacity: 0.7 }, Lmid);
  const parcel = relParcel(Lfg);
  const runChip = relBig(Lfg, 'RUN IT OVER THERE!', '#17877A', '#FFFFFF', 36);
  const freeze = G(Lfg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: 'none', stroke: '#FFFFFF', 'stroke-width': 14, opacity: 0.5 }, freeze);
  { const c = relLabel(freeze, '❚❚ FROZEN', { size: 28 }); tr(c, 1040, 160); }

  /* ---------- the particle row (knock, back, wave, long, squash) ---------- */
  const RX = 110, RW = 980, COLS = 22, DX = RW / COLS;
  const rowW = G(Lmid); const row = pioRow(rowW, { w: RW, h: 180, cols: COLS, rows: 4, r: 11, seed: 9 });
  const HI = 11, HX = (HI + 0.5) * DX;   // the red-ringed particle's rest x (row coordinates)
  const knockTri = pioTriangle(Lmid, 0.55);
  const hiMark = G(Lmid);
  E('line', { x1: 0, y1: -30, x2: 0, y2: 210, stroke: '#FFFFFF', 'stroke-width': 4, 'stroke-dasharray': '10 8' }, hiMark);
  hiMark.lab = relLabel(hiMark, 'start', { size: 26, color: '#FF9A8F', stroke: '#FF9A8F' }); tr(hiMark.lab, 0, 246);
  const bumpChip = relLabel(Lfg, 'bump →', { size: 32, color: '#FFE45C', stroke: '#FFE45C' });
  const knockChip = relBig(Lfg, 'knock!', '#2E7DD8', '#FFFFFF', 34);
  const passTitle = relTitle(Lfg, 'neighbour bumps neighbour', '#9FD8FF', 46);
  const nigMark = G(Lmid);
  E('line', { x1: 0, y1: -110, x2: 0, y2: 110, stroke: '#FFFFFF', 'stroke-width': 4, 'stroke-dasharray': '10 8' }, nigMark);
  T(nigMark, 0, 144, 'START', { size: 28, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  const backChip = chip(Lfg, 'we vibrate, we DON’T travel with the wave', { size: 36, fill: '#FFD23F', color: SC_INK, stroke: '#FFFFFF', sw: 4 });
  const backArrow = G(Lfg); relDouble(backArrow, -70, 0, 70, 0, '#FF9A8F', 6);
  const waveSpark = spark(Lfg, 30, { seed: 4 });
  const waveChip = relBig(Lfg, 'sound wave →', '#2E7DD8', '#FFFFFF', 36);
  const energyChip = chip(Lfg, 'ENERGY travels, particles stay', { size: 40, fill: '#FFE45C', color: SC_INK, stroke: '#FFFFFF', sw: 4 });
  // long
  const longTitle = relTitle(Lfg, 'LONGITUDINAL', '#FFE45C', 72);
  const longA = G(Lfg); arrow(longA, 0, 0, 420, 0, { color: '#FFFFFF', width: 7 }); T(longA, 210, -24, 'wave travels', { size: 32, weight: 700, anchor: 'middle' });
  const longB = G(Lfg); relDouble(longB, -80, 0, 80, 0, '#FF9A8F', 7); T(longB, 0, 52, 'particles vibrate', { size: 30, weight: 700, anchor: 'middle', fill: '#FF9A8F' });
  const sameChip = relBig(Lfg, 'SAME direction', '#C2453A', '#FFFFFF', 38);
  // squash: compression / rarefaction labels (a small pool that follows the moving wave)
  const compL = [0, 1, 2, 3].map(() => { const g = G(Lfg); E('path', { d: 'M-50,14 L-50,0 L50,0 L50,14', fill: 'none', stroke: '#FFE45C', 'stroke-width': 5, 'stroke-linejoin': 'round' }, g); const c = chip(g, 'compression', { size: 28, fill: '#FFE45C', color: SC_INK }); tr(c, 0, -30); return g; });
  const rareL = [0, 1, 2, 3].map(() => { const g = G(Lfg); E('path', { d: 'M-70,-14 L-70,0 L70,0 L70,-14', fill: 'none', stroke: '#9FD8FF', 'stroke-width': 5, 'stroke-linejoin': 'round' }, g); const c = chip(g, 'rarefaction', { size: 28, fill: '#9FD8FF', color: SC_INK }); tr(c, 0, 32); return g; });
  const sqTitle = T(Lfg, 600, 160, '**bunched up** and **spread out**', { size: 44, weight: 600, anchor: 'middle', boldFill: '#FFE45C' });
  const archWrap = G(Lcast); const archRow = cast(archWrap, 'archie', { s: 0.62 });
  const wheeT = T(Lfg, 0, 0, 'wheee!', { size: 34, weight: 800, anchor: 'middle', fill: '#7FF0E2' });

  /* ---------- thnigel inset: a drum solo ---------- */
  const inset = G(Lmid); tr(inset, 880, 310);
  E('rect', { x: -230, y: -170, width: 460, height: 330, rx: 16, fill: '#0E1A24', stroke: '#FFFFFF', 'stroke-width': 5 }, inset);
  { const cp = E('clipPath', { id: 'relInsetClip' }, defs()); E('rect', { x: -216, y: -156, width: 432, height: 302, rx: 10 }, cp); }
  const iIn = G(inset, { 'clip-path': 'url(#relInsetClip)' });
  E('rect', { x: -216, y: -156, width: 432, height: 302, fill: linGrad('#3A1D1D', '#5A2A2A', true) }, iIn);
  E('rect', { x: -216, y: 90, width: 432, height: 60, fill: '#8A5A33' }, iIn);
  const iDrum = G(iIn); tr(iDrum, -130, 60);
  E('path', { d: 'M-60,-20 L-60,40 Q0,56 60,40 L60,-20 Z', fill: '#E8584D', stroke: SC_INK, 'stroke-width': 4 }, iDrum);
  E('ellipse', { cx: 0, cy: -20, rx: 60, ry: 14, fill: '#F6F1E4', stroke: SC_INK, 'stroke-width': 4 }, iDrum);
  E('ellipse', { cx: 30, cy: -90, rx: 46, ry: 8, fill: '#FFD23F', stroke: SC_INK, 'stroke-width': 3 }, iDrum);
  E('line', { x1: 30, y1: -82, x2: 30, y2: 40, stroke: '#9AA6B2', 'stroke-width': 4 }, iDrum);
  const iWind = E('path', { d: '', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 5, 'stroke-linecap': 'round', opacity: 0.8 }, iIn);
  const iFanW = G(iIn); const iFan = person(iFanW, { shirt: '#56D69B', shorts: '#2A2A3A', skin: '#E0B48A', hair: '#3A2418' }); tr(iFanW, 120, 140, 0.95);
  const iHair = E('path', { d: '', fill: '#3A2418', stroke: SC_INK, 'stroke-width': 2 }, iFanW);
  const iFace = G(iFanW);
  E('circle', { cx: -8, cy: -178, r: 4, fill: SC_INK }, iFace); E('circle', { cx: 6, cy: -178, r: 4, fill: SC_INK }, iFace); E('ellipse', { cx: -1, cy: -164, rx: 5, ry: 7, fill: '#5A1E2A' }, iFace);
  const iSolo = T(iIn, -130, -110, 'DRUM SOLO!', { size: 30, weight: 800, anchor: 'middle', fill: '#FFE45C' });
  const insetTag = relLabel(inset, 'if the air really travelled…', { size: 26 }); tr(insetTag, 0, 204);
  const notHow = chip(Lfg, '(it doesn’t)', { size: 34, fill: '#56D69B', color: SC_INK });

  /* ---------- stadium ---------- */
  const bubble = G(Lmid); tr(bubble, 790, 330);
  E('circle', { cx: -330, cy: 120, r: 14, fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 3 }, bubble);
  E('circle', { cx: -290, cy: 80, r: 22, fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 3 }, bubble);
  E('ellipse', { cx: 0, cy: -20, rx: 300, ry: 190, fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 4 }, bubble);
  const bCrowd = G(bubble), bHeads = [];
  const HC = ['#C98E62', '#E0B48A', '#8C5A3C', '#F2C9A0'], SHC = ['#E8424F', '#2E7DD8', '#56D69B', '#FFC247', '#9B6BD6'];
  for (let r = 0; r < 2; r++) for (let i = 0; i < 7; i++) {
    const g = G(bCrowd); const x = -175 + i * 55 + (r % 2) * 25, y = -50 + r * 85;
    E('path', { d: 'M-18,30 Q-18,6 0,6 Q18,6 18,30 Z', fill: SHC[(i + r) % 5] }, g);
    E('circle', { cy: -6, r: 13, fill: HC[(i * 3 + r) % 4] }, g);
    bHeads.push({ g, x, y, i });
  }
  const bQ = T(bubble, 0, 128, 'stadium wave?', { size: 34, weight: 800, anchor: 'middle', fill: '#2E7DD8' });

  /* ---------- across: the stadium wave ---------- */
  const crowd = [], NP = 7;
  for (let i = 0; i < NP; i++) {
    const w = G(Lmid); const p = person(w, { shirt: SHC[i % 5], shorts: '#1E2A44', skin: HC[i % 4], hair: '#1E1410' });
    crowd.push({ w, p, x: 160 + i * 147 });
  }
  const seats = E('path', { d: '', fill: 'none' }, Lmid);
  { let d = ''; for (let i = 0; i < NP; i++) d += `M${160 + i * 147 - 40},610 h80 v40 h-80 Z `; attr(seats, 'd', d); attr(seats, 'fill', '#C2453A'); attr(seats, 'stroke', SC_INK); attr(seats, 'stroke-width', 3); }
  const transTitle = relTitle(Lfg, 'TRANSVERSE (across)', '#FFE45C', 60);
  const acrA = G(Lfg); arrow(acrA, 0, 0, 360, 0, { color: '#FFFFFF', width: 7 }); { const c = relLabel(acrA, 'wave travels', { size: 30 }); tr(c, 180, -40); }
  const acrB = G(Lfg); relDouble(acrB, 0, -70, 0, 70, '#FF9A8F', 7); { const c = relLabel(acrB, 'people move', { size: 30, color: '#FF9A8F', stroke: '#FF9A8F' }); tr(c, 0, -110); }
  const acrRing = E('circle', { r: 70, fill: 'none', stroke: '#FF9A8F', 'stroke-width': 5, 'stroke-dasharray': '10 8' }, Lfg);

  /* ---------- light: split screen ---------- */
  const lightG = G(Lmid);
  const lT1 = relTitle(lightG, 'TRANSVERSE', '#FFE45C', 50); tr(lT1, 312, 200);
  T(lightG, 312, 250, 'light, water ripples', { size: 32, weight: 700, anchor: 'middle', fill: '#FFFFFF' });
  const sine = sineWave(lightG, { w: 440, amp: 60, wl: 160, color: '#FFE45C', width: 7 }); tr(sine, 92, 380);
  const ripG = G(lightG); tr(ripG, 312, 570);
  const rips = [0, 1, 2, 3].map(() => E('ellipse', { rx: 40, ry: 12, fill: 'none', stroke: '#4CC9F0', 'stroke-width': 5 }, ripG));
  E('circle', { r: 8, fill: '#4CC9F0' }, ripG);
  const lT2 = relTitle(lightG, 'LONGITUDINAL', '#9FD8FF', 50); tr(lT2, 887, 200);
  T(lightG, 887, 250, 'sound', { size: 32, weight: 700, anchor: 'middle', fill: '#FFFFFF' });
  const miniW = G(lightG); const mini = pioRow(miniW, { w: 460, h: 120, cols: 11, rows: 3, r: 10, seed: 13 }); tr(miniW, 657, 330);
  const goAlong = G(Lfg); arrow(goAlong, 0, 0, 300, 0, { color: '#9FD8FF', width: 7 }); { const c = relBig(goAlong, 'we go ALONG', '#2E7DD8', '#FFFFFF', 34); tr(c, 150, 52); }

  /* ---------- medium ---------- */
  const medG = G(Lmid);
  const medT = relTitle(medG, 'MEDIUM', '#FFE45C', 80); tr(medT, 600, 170);
  T(medG, 600, 222, 'the material sound travels through', { size: 34, weight: 600, anchor: 'middle', fill: '#FFFFFF' });
  const BOX = [['solid', 'solid', 120, '#B48CFF', '#7550C4'], ['liquid', 'liquid', 470, C.water, C.waterDk], ['gas', 'gas', 820, '#8FB8FF', '#2F56C2']];
  const boxes = BOX.map(([st, lab, x, col, dk]) => {
    const g = G(medG); const b = particleBox(g, 260, 210, { n: st === 'gas' ? 9 : 20, r: 13, color: col, dark: dk, seed: x }); tr(b, 0, 0);
    const c = relLabel(g, lab, { size: 34 }); tr(c, 130, 270);
    return { g, b, st, x, lab: c };
  });
  const medNig = cast(Lfg, 'nigel', { s: 0.42 });
  const medChip = relBig(Lfg, 'here: AIR (a gas)', '#2F56C2', '#FFFFFF', 34);

  /* ---------- the cast ---------- */
  const nigel = cast(Lcast, 'nigel'), archie = cast(Lcast, 'archie'), nigCorner = cast(Lfg, 'nigel', { s: 0.5 });

  const ALL = [hallG, airG, confN, stadBg, splitBg, howG, zoomL, parcel, runChip, freeze, rowW, knockTri, hiMark, bumpChip, knockChip, passTitle, nigMark,
    backChip, backArrow, waveSpark, waveChip, energyChip, longTitle, longA, longB, sameChip, ...compL, ...rareL, sqTitle, archWrap, wheeT, inset, notHow,
    bubble, ...crowd.map(c => c.w), seats, transTitle, acrA, acrB, acrRing, lightG, goAlong, medG, medNig, medChip, nigel, archie, nigCorner];

  // displacement of a row particle with rest x0 (row coordinates), as pioRow draws it
  const relDisp = (x0, t, amp, wl, f, front) => { const live = x0 < front ? clamp((front - x0) / (wl * 0.3)) : 0; return -amp * Math.sin(TAU * (x0 / wl - f * t)) * live; };

  return t => {
    const sid = shotAt(t), s0 = t0Of(sid);
    ALL.forEach(el => op(el, 0));
    confN.set(0, t); op(hiMark.lab, 1);
    hall.upd(t); air.upd(t);
    const corner = (x, y, look) => { op(nigCorner, 1); tr(nigCorner, x, y, 0.5); nigCorner.set({ t, talk: talk(t, 'nigel'), mood: 'deadpan', look }); };

    /* ---------- how ---------- */
    if (sid === 'how') {
      op(hallG, 1); op(howG, 1);
      howTri.set({ t, ring: t > at('how') ? 0.7 * AMP : 0, beater: false });
      const pp = P(t, at('how') + 0.2, 1.2, linear);
      attr(howPath, 'stroke-dashoffset', (-t * 30).toFixed(1)); op(howPath, pp);
      relPop(howQ, P(t, mid('how', 0.55), 0.4, pop), 660, 320, 1, 6 * Math.sin(t * 3) * AMP);
      op(howLabs, P(t, at('how') + 0.1, 0.4, linear)); op(earRing, P(t, at('how') + 0.4, 0.3, linear));
    }

    /* ---------- run ---------- */
    if (sid === 'run') {
      op(airG, 1);
      const e = P(t, mid('run', 0.35), end('run') - mid('run', 0.35) + 0.3, easeIn);
      const ax = lerp(560, 1000, e);
      op(nigel, 1); tr(nigel, 270, 460, 1.0); nigel.set({ t, mood: 'deadpan', look: 1 });
      op(archie, 1); tr(archie, ax, 470, 1.0, 12 * e);
      archie.set({ t, talk: talk(t, 'archie'), mood: 'happy', look: 0.6, bounce: AMP });
      op(parcel, 1); tr(parcel, ax + 20, 330 - (t < mid('run', 0.25) ? 0 : 10 * Math.abs(Math.sin(t * 9)) * AMP), 1, -6);
      op(zoomL, e > 0.02 ? 1 : 0); tr(zoomL, ax - 90, 470);
      relPop(runChip, P(t, mid('run', 0.4), 0.35, pop), 760, 180, 1, -3);
    }

    /* ---------- no ---------- */
    if (sid === 'no') {
      op(airG, 1); op(freeze, 1);
      // Archie frozen mid-run in the background
      op(archie, 1); tr(archie, 1000, 380, 0.75, 12); archie.set({ t: at('no'), mood: 'shock', look: -1, still: true, sweat: 0.6 });
      op(parcel, 1); tr(parcel, 1015, 270, 0.75, -6);
      const k = 1 + 0.18 * P(t, at('no'), at('knock') - at('no'), linear);
      op(nigel, 1); tr(nigel, 470, 430 + 20 * (k - 1), 2.1 * k);
      nigel.set({ t, talk: talk(t, 'nigel'), mood: 'deadpan', look: 0 });
    }

    /* ---------- the row shots ---------- */
    const rowShot = sid === 'knock' || sid === 'back' || sid === 'wave' || sid === 'long' || sid === 'squash';
    if (rowShot) op(airG, 1);
    if (sid === 'knock') {
      const RY = 280, wl = 240, f = 0.8, t1 = Math.max(0, t - at('knock') - 0.2), front = t1 * wl * f;
      op(rowW, 1); tr(rowW, RX, RY);
      row.set({ t, amp: 16 * AMP, wl, f, front });
      op(knockTri, 1); tr(knockTri, 62, RY + 90, 0.55); knockTri.set({ t, ring: AMP, beater: false });
      relPop(knockChip, P(t, at('knock') + 0.2, 0.35, pop), 150, 210);
      op(bumpChip, front > 120 && front < RW ? 1 : 0); tr(bumpChip, RX + Math.min(front, RW - 40), RY + 240);
      relPop(passTitle, P(t, mid('knock', 0.4), 0.4, pop), 650, 170);
      corner(1110, 650, -0.6);
    }
    if (sid === 'back') {
      const RY = 210, wl = 240, f = 0.8, t1 = t - at('back') + 1.5, front = t1 * wl * f;
      const amp = 18 * AMP * (1 - P(t, mid('back', 0.7), 1.6, ease));
      op(rowW, 1); tr(rowW, RX, RY);
      row.set({ t, amp, wl, f, front, hi: HI });
      op(hiMark, 1); op(hiMark.lab, 0); tr(hiMark, RX + HX, RY);
      // Nigel copies the ringed particle, magnified, on his own START mark
      const d = relDisp(HX, t, 1, wl, f, front) * 2.6 * amp;
      op(nigMark, 1); tr(nigMark, RX + HX, 570);
      op(nigel, 1); tr(nigel, RX + HX + d, 570, 0.8, d * 0.15);
      const settled = t > mid('back', 0.7) + 1.4;
      nigel.set({ t, talk: talk(t, 'nigel'), mood: settled ? 'smug' : 'deadpan', look: 0, still: true });
      relPop(backChip, P(t, mid('back', 0.6), 0.4, pop), 600, 150);
    }
    if (sid === 'wave') {
      const RY = 260, wl = 240, f = 0.8, t1 = Math.max(0, t - at('wave') + 0.1), front = Math.min(t1 * wl * f, RW + 60);
      op(rowW, 1); tr(rowW, RX, RY);
      row.set({ t, amp: 16 * AMP, wl, f, front, hi: HI });
      op(hiMark, 1); tr(hiMark, RX + HX, RY);
      op(waveSpark, front < RW + 40 ? 1 : 0); tr(waveSpark, RX + front, RY - 40); waveSpark.upd(t);
      relPop(waveChip, P(t, mid('wave', 0.1), 0.35, pop), Math.min(RX + front, 900), 170);
      relPop(energyChip, P(t, mid('wave', 0.6), 0.4, pop), 600, 620);
    }
    if (sid === 'long') {
      const RY = 300, wl = 240, f = 0.8;
      op(rowW, 1); tr(rowW, RX, RY);
      row.set({ t, amp: 18 * AMP, wl, f, hi: HI });
      op(hiMark, 1); tr(hiMark, RX + HX, RY);
      relPop(longTitle, P(t, at('long') + 0.1, 0.45, pop), 600, 150);
      op(longA, P(t, mid('long', 0.45), 0.3, linear)); tr(longA, 390, 245);
      const d = relDisp(HX, t, 18 * AMP, wl, f, 1e9);
      op(longB, P(t, mid('long', 0.6), 0.3, linear)); tr(longB, RX + HX + d, 560);
      relPop(sameChip, P(t, mid('long', 0.78), 0.4, pop), 950, 620, 1, -3);
    }
    if (sid === 'squash') {
      const RY = 300, wl = 300, f = 0.22, amp = 36 * (S.reduce ? 0.7 : 1);
      op(rowW, 1); tr(rowW, RX, RY);
      row.set({ t, amp, wl, f });
      op(sqTitle, P(t, at('squash') + 0.1, 0.3, linear));
      const cp = P(t, mid('squash', 0.45), 0.35, linear), rp = P(t, mid('squash', 0.72), 0.35, linear);
      const ph0 = ((f * t) % 1 + 1) % 1, cs = [-1, 0, 1, 2, 3, 4].map(n => (n + ph0) * wl).filter(x => x > 60 && x < RW - 60);
      compL.forEach((g, i) => { const x = cs[i]; if (x === undefined || x < 60 || x > RW - 60) return; op(g, cp); tr(g, RX + x, RY - 26); });
      const rs = [-1, 0, 1, 2, 3, 4].map(n => (n + ph0 + 0.5) * wl).filter(x => x > 70 && x < RW - 70);
      rareL.forEach((g, i) => { const x = rs[i]; if (x === undefined || x < 70 || x > RW - 70) return; op(g, rp); tr(g, RX + x, RY + 206); });
      // Archie rides inside the row: displaced like a particle and squashed where it bunches
      const xA = 450, ph = TAU * (xA / wl - f * t), dx = -amp * Math.sin(ph), sx = 1 - 0.3 * Math.cos(ph) * (S.reduce ? 0.6 : 1);
      op(archWrap, 1); archWrap.setAttribute('transform', `translate(${(RX + xA + dx).toFixed(1)} ${RY + 90}) scale(${sx.toFixed(3)} ${(1 / Math.sqrt(sx)).toFixed(3)})`);
      archRow.set({ t, mood: 'happy', look: 0, still: true });
      op(wheeT, P(t, mid('squash', 0.2), 0.3, linear)); tr(wheeT, RX + xA + dx, RY - 90 + 8 * Math.sin(t * 6));
      corner(1110, 655, -0.8);
    }

    /* ---------- thnigel ---------- */
    if (sid === 'thnigel') {
      const k = 1 + 0.08 * P(t, end('thnigel'), 0.8, linear);
      confN.set(1, t); relCam(confN, k, 400, 400);
      op(nigel, 1); tr(nigel, 370, 420 - 10 * (k - 1), 1.5 * k);
      nigel.set({ t, talk: talk(t, 'nigel'), mood: t > end('thnigel') ? 'deadpan' : 'annoyed', look: t > mid('thnigel', 0.5) && t < end('thnigel') ? 0.5 : 0 });
      const ip = P(t, at('thnigel') + 0.2, 0.4, pop);
      op(inset, clamp(ip * 2.5)); tr(inset, 880, 310, Math.max(0.01, 0.7 + 0.3 * ip));
      const blow = P(t, mid('thnigel', 0.5), 0.4, easeOut);
      const sh = blow * (S.reduce ? 0.5 : 1);
      iFan.pose({ lean: -16 * sh, armL: [10 + 40 * sh, 30], armR: [-10 + 40 * sh, 30] });
      let wd = ''; for (let i = 0; i < 4; i++) { const f = ((t * 1.8 + i / 4) % 1); const x = -60 + f * 170, y = -60 + i * 40; wd += `M${x.toFixed(0)},${y} q20,-10 40,0 t40,0 `; }
      attr(iWind, 'd', wd); op(iWind, blow);
      // hair streams back (to the right, away from the drum)
      const hl = 10 + 70 * blow, wob = Math.sin(t * 20) * 5 * blow * AMP;
      attr(iHair, 'd', `M-18,-190 Q${10 + hl * 0.4},${-200 + wob} ${18 + hl},${-186 + wob} Q${10 + hl * 0.5},${-176 + wob} 16,-170 Q0,-196 -18,-190 Z`);
      tr(iDrum, -130 + Math.sin(t * 30) * 2 * AMP, 60);
      op(iSolo, 0.6 + 0.4 * Math.abs(Math.sin(t * 6)));
      relPop(notHow, P(t, end('thnigel') + 0.05, 0.35, pop), 880, 590, 1, -3);
    }

    /* ---------- stadium ---------- */
    if (sid === 'stadium') {
      op(airG, 1);
      op(archie, 1); tr(archie, 270, 500, 1.1);
      archie.set({ t, talk: talk(t, 'archie'), mood: t < mid('stadium', 0.25) ? 'shock' : 'happy', look: 0.6, bounce: t > mid('stadium', 0.25) ? AMP : 0 });
      const bp = P(t, at('stadium') + 0.05, 0.4, pop);
      op(bubble, clamp(bp * 2.5)); tr(bubble, 790, 330, Math.max(0.01, 0.6 + 0.4 * bp));
      bHeads.forEach(h => { const wv = Math.exp(-Math.pow((h.x - (-260 + ((t - s0) * 260) % 560)) / 50, 2)); tr(h.g, h.x, h.y - 26 * wv * AMP); });
    }

    /* ---------- across: the stadium wave ---------- */
    if (sid === 'across') {
      op(stadBg, 1); op(seats, 1);
      const xf = -100 + ((t - s0) * 330) % 1400;
      crowd.forEach(c => {
        const h = Math.exp(-Math.pow((c.x - xf) / 110, 2)) * (S.reduce ? 0.7 : 1);
        op(c.w, 1); tr(c.w, c.x, lerp(640, 610, h) - 50 * h, 0.85);
        c.p.pose({ armL: [lerp(10, 165, h), lerp(30, 0, h)], armR: [lerp(-10, 165, h), lerp(30, 0, h)], legL: [lerp(90, 0, h), lerp(-90, 0, h)], legR: [lerp(85, 0, h), lerp(-90, 0, h)] });
      });
      relPop(transTitle, P(t, mid('across', 0.6), 0.45, pop), 600, 150);
      op(acrA, P(t, mid('across', 0.3), 0.3, linear)); tr(acrA, 640, 260);
      const near = crowd.reduce((b, c) => (Math.abs(c.x - xf) < Math.abs(b.x - xf) ? c : b), crowd[0]);
      op(acrB, P(t, mid('across', 0.2), 0.3, linear)); tr(acrB, 300, 320);
      op(acrRing, P(t, mid('across', 0.2), 0.3, linear) * (xf > 60 && xf < 1140 ? 1 : 0)); attr(acrRing, 'cx', clamp(xf, 140, 1060)); attr(acrRing, 'cy', 450);
      corner(1100, 175, -0.6);
    }

    /* ---------- light: split screen ---------- */
    if (sid === 'light') {
      op(splitBg, 1); op(lightG, 1);
      sine.set({ phase: t * 0.8 * (S.reduce ? 0.5 : 1) });
      rips.forEach((r, i) => { const f = ((t * 0.5 + i / 4) % 1); attr(r, 'rx', 20 + f * 200); attr(r, 'ry', 6 + f * 60); op(r, 1 - f); });
      mini.set({ t, amp: 14 * AMP, wl: 160, f: 0.9 });
      op(nigel, 1); tr(nigel, 1085, 615, 0.55);
      const pt = t > mid('light', 0.6);
      nigel.set({ t, talk: talk(t, 'nigel'), mood: pt ? 'smug' : 'deadpan', look: pt ? -0.7 : -1 });
      op(goAlong, P(t, mid('light', 0.62), 0.3, linear)); tr(goAlong, 680, 530);
    }

    /* ---------- medium ---------- */
    if (sid === 'medium') {
      op(airG, 1); op(medG, 1);
      const nig = mid('medium', 0.78), z = P(t, nig - 0.2, 0.5, ease);
      boxes.forEach((b, i) => {
        const p = P(t, mid('medium', 0.3 + i * 0.13), 0.4, pop);
        const gas = b.st === 'gas';
        const sc = gas ? 1 + 0.35 * z : 1;
        if (gas) op(b.lab, 1 - z);
        op(b.g, clamp(p * 2.5) * (gas ? 1 : 1 - 0.65 * z));
        b.g.setAttribute('transform', `translate(${(b.x + 130 - 130 * sc * (0.6 + 0.4 * p) + (gas ? -30 * z : 0)).toFixed(1)} ${(300 + 105 - 105 * sc * (0.6 + 0.4 * p) + (gas ? 10 * z : 0)).toFixed(1)}) scale(${(sc * (0.6 + 0.4 * p)).toFixed(3)})`);
        b.b.set(b.st, t, 0.5);
      });
      op(medNig, z); tr(medNig, 830 + 90 * z, 400 + 10 * z, 0.42 + 0.14 * z, 10 * Math.sin(t * 5) * AMP * z);
      medNig.set({ t, mood: 'deadpan', look: 0 });
      relPop(medChip, P(t, nig + 0.4, 0.4, pop), 920, 670);
    }
  };
});
