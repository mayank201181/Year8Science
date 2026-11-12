/* PASS IT ON, scene 1: "Something is always vibrating".
   Shots (hard sitcom cuts): VIBRATE card (back and forth about a fixed position) -> Nigel, sound inspector:
   the drum skin -> the guitar string -> the loudspeaker cone shoving the air (and Nigel. Rude.) -> Kavya hums
   -> cutaway: vocal cords, two flaps of tissue (talks, sings, complains) -> Kavya: "Mostly complains."
   -> Archie bursts in (argon, 1%, first day) -> Nigel's confessional (noble gas; inset: Archie reacting to a
   fly and a fan) -> the test: ding, then grab -> close-up: DING! then held, the sound STOPS -> vibration is the
   source of all sound, sound is energy -> Kavya's confessional: the ding count. */
scene('vibrate', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;
  const talk = (t, who) => scTalk(S, t, who);

  /* ---------- local helpers (prefixed vib) ---------- */
  function vibLabel(parent, text, o) {
    o = o || {};
    return chip(parent, text, { size: o.size || 32, fill: o.fill || 'rgba(10,27,39,0.9)', stroke: o.stroke || C.line, sw: o.sw || 2, color: o.color || C.ink, weight: o.weight || 700 });
  }
  function vibBig(parent, text, fill, color, size) {
    return chip(parent, text, { size: size || 44, fill, color: color || '#FFFFFF', stroke: '#FFFFFF', sw: 4 });
  }
  const vibPop = (el, p, x, y, s, r) => { op(el, clamp(p * 2.5)); tr(el, x, y, Math.max(0.01, (s || 1) * (0.6 + 0.4 * p)), r); };
  const vibCam = (g, k, fx, fy) => g.setAttribute('transform', Math.abs(k - 1) < 1e-4 ? '' : `translate(${fx} ${fy}) scale(${k.toFixed(4)}) translate(${-fx} ${-fy})`);
  function vibDouble(parent, x1, x2, y, col) {   // a double-headed arrow
    const g = G(parent);
    E('path', { d: `M${x1 + 14},${y} L${x2 - 14},${y}`, stroke: col, 'stroke-width': 7, 'stroke-linecap': 'round' }, g);
    E('path', { d: `M${x1},${y} L${x1 + 26},${y - 16} L${x1 + 26},${y + 16} Z M${x2},${y} L${x2 - 26},${y - 16} L${x2 - 26},${y + 16} Z`, fill: col, 'stroke-linejoin': 'round' }, g);
    return g;
  }
  function vibStop(parent, r) {   // a red stop sign
    const g = G(parent); let d = '';
    for (let i = 0; i < 8; i++) { const a = Math.PI / 8 + i * Math.PI / 4; d += (i ? 'L' : 'M') + (Math.cos(a) * r).toFixed(1) + ',' + (Math.sin(a) * r).toFixed(1); }
    E('path', { d: d + 'Z', fill: '#E53935', stroke: '#FFFFFF', 'stroke-width': 5 }, g);
    T(g, 0, r * 0.22, 'STOP', { size: r * 0.56, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
    return g;
  }
  // the drum, side on: g.set(t, flex) flexes the skin (flex 0..1), g.stick (the drumstick)
  function vibDrum(parent) {
    const g = G(parent);
    E('path', { d: 'M-150,-40 L-150,110 Q0,150 150,110 L150,-40 Z', fill: ball('#E8584D', '#9C2A22'), stroke: SC_INK, 'stroke-width': 6, 'stroke-linejoin': 'round' }, g);
    let zz = 'M-150,10'; for (let i = 1; i <= 10; i++) zz += ` L${-150 + i * 30},${i % 2 ? 60 : 10}`;
    E('path', { d: zz, fill: 'none', stroke: '#FFD23F', 'stroke-width': 5, 'stroke-linejoin': 'round' }, g);
    const skin = E('path', { d: '', fill: '#F6F1E4', stroke: SC_INK, 'stroke-width': 6 }, g);
    const dent = E('path', { d: '', fill: 'none', stroke: '#C9BFA6', 'stroke-width': 4 }, g);
    const arcs = G(g);
    [0, 1, 2].forEach(i => E('path', { d: `M${-90 + i * 0},${-80 - i * 26} Q0,${-110 - i * 26} ${90},${-80 - i * 26}`, fill: 'none', stroke: '#FFE45C', 'stroke-width': 6, 'stroke-linecap': 'round' }, arcs));
    g.stick = G(g);
    E('line', { x1: 0, y1: 0, x2: 150, y2: -40, stroke: '#C98A5A', 'stroke-width': 12, 'stroke-linecap': 'round' }, g.stick);
    E('circle', { cx: 0, cy: 0, r: 13, fill: '#F2DCC0', stroke: SC_INK, 'stroke-width': 3 }, g.stick);
    g.set = (t, flex) => {
      const d = flex * 26 * Math.sin(t * TAU * 6);
      attr(skin, 'd', `M-150,-40 A150,30 0 0 1 150,-40 A150,30 0 0 1 -150,-40 Z`);
      attr(dent, 'd', `M-130,-40 Q0,${(-40 + d * 1.6).toFixed(1)} 130,-40`);
      op(arcs, flex * (0.5 + 0.5 * Math.abs(Math.sin(t * 14))));
    };
    g.set(0, 0);
    return g;
  }
  // a guitar, lying across: g.set(t, a) the top string swings side to side (a 0..1)
  function vibGuitar(parent) {
    const g = G(parent);
    E('path', { d: 'M40,-110 Q120,-150 190,-96 Q230,-60 210,-30 Q260,-20 270,40 Q280,130 170,140 Q90,146 60,90 Q30,40 40,-110 Z', fill: ball('#F0A65A', '#A8632A'), stroke: SC_INK, 'stroke-width': 6, 'stroke-linejoin': 'round' }, g);
    E('circle', { cx: 150, cy: 10, r: 38, fill: '#3A2418', stroke: SC_INK, 'stroke-width': 4 }, g);
    E('rect', { x: -330, y: -14, width: 390, height: 40, rx: 6, fill: '#7A4B2A', stroke: SC_INK, 'stroke-width': 5 }, g);
    E('rect', { x: -400, y: -30, width: 78, height: 72, rx: 14, fill: '#5A3418', stroke: SC_INK, 'stroke-width': 5 }, g);
    for (let i = 0; i < 6; i++) E('line', { x1: -300 + i * 56, y1: -14, x2: -300 + i * 56, y2: 26, stroke: '#D9C9A8', 'stroke-width': 3 }, g);
    E('rect', { x: 210, y: -16, width: 16, height: 44, rx: 4, fill: '#3A2418' }, g);
    for (let i = 0; i < 3; i++) E('line', { x1: -322, y1: 8 + i * 9, x2: 218, y2: 8 + i * 9, stroke: '#E9E2D0', 'stroke-width': 2 }, g);
    const ghosts = [E('path', { d: '', fill: 'none', stroke: '#FFE45C', 'stroke-width': 4, opacity: 0.35 }, g), E('path', { d: '', fill: 'none', stroke: '#FFE45C', 'stroke-width': 4, opacity: 0.35 }, g)];
    const str = E('path', { d: '', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 5, 'stroke-linecap': 'round' }, g);
    const sd = (off) => `M-322,-2 Q-52,${(-2 + off).toFixed(1)} 218,-2`;
    g.set = (t, a) => {
      attr(str, 'd', sd(a * 46 * Math.sin(t * TAU * 7)));
      attr(ghosts[0], 'd', sd(a * 46)); attr(ghosts[1], 'd', sd(-a * 46));
      op(ghosts[0], a); op(ghosts[1], a);
    };
    g.set(0, 0);
    return g;
  }
  // a loudspeaker, side on, facing right: g.set(t, a) the cone pumps in and out
  function vibSpeaker(parent) {
    const g = G(parent);
    E('rect', { x: -150, y: -170, width: 150, height: 340, rx: 16, fill: '#2B3138', stroke: SC_INK, 'stroke-width': 6 }, g);
    E('rect', { x: -130, y: -150, width: 110, height: 300, rx: 10, fill: '#3A424B' }, g);
    const cone = G(g);
    E('path', { d: 'M-60,-36 L-6,-130 L-6,130 L-60,36 Z', fill: ball('#9AA6B2', '#4A525B'), stroke: SC_INK, 'stroke-width': 5, 'stroke-linejoin': 'round' }, cone);
    E('ellipse', { cx: -6, cy: 0, rx: 14, ry: 132, fill: '#5A626B', stroke: SC_INK, 'stroke-width': 5 }, cone);
    E('ellipse', { cx: 2, cy: 0, rx: 10, ry: 34, fill: '#2B3138', stroke: SC_INK, 'stroke-width': 4 }, cone);
    E('rect', { x: -96, y: -30, width: 36, height: 60, rx: 6, fill: '#6B737C', stroke: SC_INK, 'stroke-width': 4 }, g);   // magnet
    const lines = G(g);
    [0, 1].forEach(i => E('path', { d: `M${30 + i * 22},-70 Q${42 + i * 22},0 ${30 + i * 22},70`, fill: 'none', stroke: '#FFE45C', 'stroke-width': 5, 'stroke-linecap': 'round' }, lines));
    g.set = (t, a) => { const x = a * 14 * Math.sin(t * TAU * 5); tr(cone, x, 0); op(lines, a * (0.5 + 0.5 * Math.abs(Math.sin(t * 15)))); };
    g.set(0, 0);
    return g;
  }

  /* ---------- the shot list (hard cuts) ---------- */
  const SH = [
    ['card', -1e9], ['drum', at('drum') - 0.06], ['guitar', at('guitar') - 0.06], ['speaker', at('speaker') - 0.06],
    ['hum', at('hum') - 0.06], ['cords', at('cords') - 0.06], ['mostly', at('mostly') - 0.06], ['archie', at('archie') - 0.06],
    ['thnigel', at('thnigel') - 0.06], ['test', at('test') - 0.06], ['grab', at('grab') - 0.06], ['source', at('source') - 0.06],
    ['thkavya', at('thkavya') - 0.06],
  ];
  const shotAt = t => { let k = 0; for (let i = 0; i < SH.length; i++) if (t >= SH[i][1]) k = i; return SH[k][0]; };
  const t0Of = id => SH.find(s => s[0] === id)[1];

  /* ---------- layers ---------- */
  const Lbg = G(root), Lmid = G(root), Lcast = G(root), Lfg = G(root), Lhud = G(root);

  /* backgrounds */
  const hallG = G(Lbg); const hall = pioHall(hallG);
  const hallDim = E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#0A1520', opacity: 0.5 }, hallG);
  const airG = G(Lbg); const air = pioAir(airG);
  const throatBg = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#3A1424', '#6B2A44', true) }, throatBg);
  const confN = pioConf(Lbg, 'nigel'), confK = pioConf(Lbg, 'kavya');

  /* --- card: VIBRATE --- */
  const cardG = G(Lmid);
  card(cardG, 170, 130, 860, 520, { fill: 'rgba(14,30,44,0.94)', stroke: '#FFE45C', sw: 4 });
  const vTitle = T(cardG, 600, 236, 'VIBRATE', { size: 96, weight: 800, anchor: 'middle', fill: '#FFE45C' });
  const vSub = T(cardG, 600, 306, '= move quickly **back and forth**', { size: 44, weight: 600, anchor: 'middle', boldFill: '#FFE45C' });
  const vArrow = G(cardG); vibDouble(vArrow, 440, 760, 386, '#9FD8FF');
  const vArrowL = T(vArrow, 600, 366, 'back and forth', { size: 30, weight: 700, anchor: 'middle', fill: '#9FD8FF' });
  const vFixed = G(cardG);
  E('line', { x1: 600, y1: 412, x2: 600, y2: 560, stroke: '#FFFFFF', 'stroke-width': 4, 'stroke-dasharray': '12 10' }, vFixed);
  T(vFixed, 600, 604, 'about a fixed position', { size: 32, weight: 700, anchor: 'middle', fill: '#FFFFFF' });
  const vBallG = G(cardG);
  const vGhosts = [-1, 1].map(() => E('circle', { r: 40, fill: 'none', stroke: '#FF8FB0', 'stroke-width': 4, 'stroke-dasharray': '8 8', opacity: 0.7 }, vBallG));
  const vBall = E('circle', { r: 40, fill: ball('#FF8FB0', '#C2456E'), stroke: SC_INK, 'stroke-width': 4 }, vBallG);

  /* --- inspection: drum, guitar, speaker --- */
  const drum = vibDrum(Lmid); tr(drum, 830, 470);
  const guitar = vibGuitar(Lmid); tr(guitar, 800, 450, 0.95, -8);
  const plink = T(Lmid, 0, 0, 'plink!', { size: 40, weight: 800, anchor: 'middle', fill: '#FFE45C' });
  const boom = T(Lmid, 0, 0, 'BOM!', { size: 48, weight: 800, anchor: 'middle', fill: '#FFE45C' });
  const spk = vibSpeaker(Lmid); tr(spk, 260, 440);
  const spkRowW = G(Lmid); const spkRow = pioRow(spkRowW, { w: 380, h: 240, cols: 9, rows: 4, r: 12, seed: 5 }); tr(spkRowW, 340, 320);
  const clip = scClipboard(Lcast, 0.55);
  const inspChip = vibLabel(Lfg, 'SOUND INSPECTOR', { size: 28, color: '#FFE45C', stroke: '#FFE45C' });
  const cDrum = vibBig(Lfg, 'drum SKIN vibrates', '#C2453A');
  const cGuit = vibBig(Lfg, 'guitar STRING vibrates', '#A8632A');
  const cCone = vibBig(Lfg, 'speaker CONE vibrates in and out', '#3A424B', '#FFFFFF', 38);
  const rude = chip(Lfg, 'RUDE.', { size: 40, fill: '#E53935', color: '#FFFFFF', stroke: '#FFFFFF', sw: 4 });

  /* --- hum and vocal cords --- */
  const humLines = G(Lfg), humL = [];
  for (let i = 0; i < 3; i++) humL.push(E('path', { d: '', fill: 'none', stroke: '#FFE45C', 'stroke-width': 5, 'stroke-linecap': 'round' }, humLines));
  const notes = [0, 1, 2].map(i => T(Lfg, 0, 0, i % 2 ? '♫' : '♪', { size: 48, weight: 700, anchor: 'middle', fill: '#FFE45C' }));
  const humChip = vibLabel(Lfg, 'humming', { size: 30 });
  // vocal-cord window: the larynx seen from above
  const cordWin = G(Lmid); tr(cordWin, 790, 345);
  E('circle', { r: 200, fill: '#E58FA0', stroke: '#FFFFFF', 'stroke-width': 8 }, cordWin);
  E('circle', { r: 160, fill: '#D27084' }, cordWin);
  const glottis = E('path', { d: '', fill: '#2A0E18' }, cordWin);
  const foldL = E('path', { d: '', fill: '#FBE3E8', stroke: '#A4485E', 'stroke-width': 4, 'stroke-linejoin': 'round' }, cordWin);
  const foldR = E('path', { d: '', fill: '#FBE3E8', stroke: '#A4485E', 'stroke-width': 4, 'stroke-linejoin': 'round' }, cordWin);
  T(cordWin, 0, -168, 'front', { size: 24, weight: 700, anchor: 'middle', fill: '#5A1E2A', font: FB });
  const callout = E('path', { d: 'M270,530 L620,190 M270,530 L640,520', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 3, 'stroke-dasharray': '10 8', opacity: 0.7 }, Lmid);
  const throatRing = E('circle', { cx: 270, cy: 530, r: 26, fill: 'none', stroke: '#FFFFFF', 'stroke-width': 4 }, Lmid);
  const cordChip = vibBig(Lfg, 'vocal cords: two flaps of tissue', '#A4485E', '#FFFFFF', 36);
  const cordUses = ['talks', 'sings', 'complains'].map((w, i) => vibLabel(Lfg, w, { size: 32, color: i === 2 ? '#FF9A8F' : C.ink }));
  const grumble = G(Lfg);
  E('path', { d: 'M-70,-34 Q-70,-56 -46,-56 L46,-56 Q70,-56 70,-34 L70,-6 Q70,16 46,16 L-6,16 L-26,40 L-24,16 L-46,16 Q-70,16 -70,-6 Z', fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 4 }, grumble);
  T(grumble, 0, -10, 'ugh.', { size: 34, weight: 800, anchor: 'middle', fill: SC_INK });

  /* --- Archie arrives --- */
  const zoomL = E('path', { d: 'M0,-60 L180,-60 M30,-10 L240,-10 M0,40 L200,40 M40,90 L170,90', stroke: '#FFFFFF', 'stroke-width': 6, 'stroke-linecap': 'round', opacity: 0.7 }, Lmid);
  const cAr = vibBig(Lfg, 'argon (Ar)', '#17877A', '#FFFFFF', 40);
  const c1pc = vibLabel(Lfg, '1% of the air', { size: 32, color: '#7FF0E2', stroke: '#7FF0E2' });
  const cDay = chip(Lfg, 'FIRST DAY!', { size: 34, fill: '#FFE45C', color: SC_INK, stroke: SC_INK, sw: 3 });
  const ltArchie = scLowerThird(Lhud, 'ARCHIE', 'Argon. Trainee. First day.');

  /* --- Nigel's confessional inset: Archie reacts to everything --- */
  const inset = G(Lmid); tr(inset, 880, 300);
  E('rect', { x: -224, y: -164, width: 448, height: 318, rx: 16, fill: '#0E1A24', stroke: '#FFFFFF', 'stroke-width': 5 }, inset);
  { const cp = E('clipPath', { id: 'vibInsetClip' }, defs()); E('rect', { x: -210, y: -150, width: 420, height: 290, rx: 10 }, cp); }
  const insetIn = G(inset, { 'clip-path': 'url(#vibInsetClip)' });
  E('rect', { x: -210, y: -150, width: 420, height: 290, fill: linGrad('#1D4C70', '#0E2A44', true) }, insetIn);
  const iFan = G(insetIn); tr(iFan, -110, -120);
  const iFanBl = G(iFan);
  for (let i = 0; i < 3; i++) E('ellipse', { cx: 50, cy: 0, rx: 50, ry: 7, fill: '#F7F2E2', stroke: '#8C7F5A', 'stroke-width': 2, transform: `rotate(${i * 120})` }, iFanBl);
  E('circle', { r: 9, fill: '#8C7F5A' }, iFan);
  const iFly = G(insetIn);
  E('ellipse', { cx: -6, cy: -8, rx: 9, ry: 6, fill: '#DDEBFF', opacity: 0.8 }, iFly);
  E('ellipse', { cx: 6, cy: -8, rx: 9, ry: 6, fill: '#DDEBFF', opacity: 0.8 }, iFly);
  E('circle', { r: 7, fill: '#1A1A1A' }, iFly);
  const iArchie = cast(insetIn, 'archie', { s: 0.6 });
  const iWow = T(insetIn, 0, 0, '!!', { size: 44, weight: 800, anchor: 'middle', fill: '#FFE45C' });
  const insetTag = vibLabel(inset, 'Archie, this morning', { size: 26 }); tr(insetTag, 0, 194);
  const cNoble = vibLabel(Lfg, 'noble gas: reacts with nothing', { size: 32, color: '#7FF0E2', stroke: '#7FF0E2' });
  const cEmo = chip(Lfg, 'emotionally: EVERYTHING', { size: 36, fill: '#FF5FA2', color: '#FFFFFF', stroke: '#FFFFFF', sw: 3 });

  /* --- the test and the grab --- */
  const tri = pioTriangle(Lcast, 1.2);
  const step1 = vibBig(Lfg, '1. DING', '#2E7DD8', '#FFFFFF', 38), step2 = vibBig(Lfg, '2. GRAB', '#C2453A', '#FFFFFF', 38);
  const proof = vibLabel(Lfg, 'PROOF', { size: 34, color: '#FFE45C', stroke: '#FFE45C' });
  const dingT = T(Lfg, 0, 0, 'DING!', { size: 120, weight: 800, anchor: 'middle', fill: '#FFE45C' });
  dingT.setAttribute('stroke', '#1A2852'); dingT.setAttribute('stroke-width', 12); dingT.setAttribute('paint-order', 'stroke'); dingT.setAttribute('stroke-linejoin', 'round');
  const dingRings = [0, 1, 2].map(() => E('circle', { r: 100, fill: 'none', stroke: '#FFE45C', 'stroke-width': 6 }, Lmid));
  const stopG = G(Lfg); { const sg = vibStop(stopG, 56); tr(sg, -170, 0); const c = vibBig(stopG, 'sound STOPS', '#E53935', '#FFFFFF', 44); tr(c, 60, 0); }
  const silence = T(Lfg, 0, 0, '(silence)', { size: 34, weight: 600, anchor: 'middle', fill: C.muted, font: FB });

  /* --- source --- */
  const srcG = G(Lmid);
  card(srcG, 540, 150, 600, 470, { fill: 'rgba(14,30,44,0.94)', stroke: C.line, sw: 3 });
  const sRow1 = G(srcG); T(sRow1, 840, 230, 'stop the vibration', { size: 36, weight: 700, anchor: 'middle' }); T(sRow1, 840, 278, '= stop the sound', { size: 36, weight: 700, anchor: 'middle', fill: '#FF9A8F' });
  const sRow2 = G(srcG);
  T(sRow2, 840, 380, 'VIBRATION', { size: 64, weight: 800, anchor: 'middle', fill: '#FFE45C' });
  T(sRow2, 840, 432, 'is the source of ALL sound', { size: 38, weight: 700, anchor: 'middle' });
  const sRow3 = G(srcG);
  { const sp = spark(sRow3, 26, { seed: 3 }); tr(sp, 640, 538); sRow3.sp = sp; const c = chip(sRow3, 'sound is a form of ENERGY', { size: 34, fill: '#FFE45C', color: SC_INK }); tr(c, 870, 538); }

  /* --- Kavya's confessional: the ding count --- */
  const tally = G(Lmid); tr(tally, 880, 330);
  E('rect', { x: -230, y: -150, width: 460, height: 300, rx: 18, fill: '#FBF7EC', stroke: '#C9BFA6', 'stroke-width': 5 }, tally);
  T(tally, 0, -98, 'DING COUNT', { size: 40, weight: 800, anchor: 'middle', fill: '#2E7DD8', ls: 2 });
  const tRow1 = G(tally); T(tRow1, -200, -22, 'science demo', { size: 34, weight: 700, fill: SC_INK }); T(tRow1, 200, -22, '1', { size: 52, weight: 800, anchor: 'end', fill: '#2E7DD8' });
  const tRow2 = G(tally); T(tRow2, -200, 60, 'the actual song', { size: 34, weight: 700, fill: SC_INK }); T(tRow2, 200, 60, '1', { size: 52, weight: 800, anchor: 'end', fill: '#D32F2F' });
  const tNote = T(tally, 0, 124, '(bar 47)', { size: 28, weight: 600, anchor: 'middle', fill: '#7A6B55', font: FB });

  /* ---------- the cast ---------- */
  const nigel = cast(Lcast, 'nigel'), archie = cast(Lcast, 'archie'), kav = cast(Lcast, 'kavya', { mood: 'deadpan' });
  // Kavya's closed eyes (for the hum): drawn over her face, inside her bobbing group
  const kLids = G(kav.firstChild);
  [-25, 25].forEach(x => { E('ellipse', { cx: x, cy: -22, rx: 19, ry: 20, fill: '#B9784E' }, kLids); E('path', { d: `M${x - 14},-20 Q${x},-10 ${x + 14},-20`, fill: 'none', stroke: SC_INK, 'stroke-width': 4, 'stroke-linecap': 'round' }, kLids); });
  const nigelCorner = cast(Lcast, 'nigel', { s: 0.5 });

  const ALL = [hallG, airG, throatBg, confN, confK, cardG, drum, guitar, plink, boom, spk, spkRowW, clip, inspChip, cDrum, cGuit, cCone, rude,
    humLines, humChip, cordWin, callout, throatRing, cordChip, grumble, zoomL, cAr, c1pc, cDay, inset, cNoble, cEmo, tri, step1, step2, proof,
    dingT, stopG, silence, srcG, tally, nigel, archie, kav, nigelCorner, ...notes, ...cordUses, ...dingRings];

  return t => {
    const sid = shotAt(t), s0 = t0Of(sid);
    ALL.forEach(el => op(el, 0));
    ltArchie.set(0); confN.set(0, t); confK.set(0, t);
    op(kLids, 0);
    hall.upd(t);

    /* ---------- card: VIBRATE ---------- */
    if (sid === 'card') {
      op(hallG, 1); op(hallDim, 0.55); op(cardG, 1);
      const pc = P(t, at('start') - 0.2, 0.45, pop);
      tr(cardG, 600 * (1 - Math.max(0.01, 0.85 + 0.15 * pc)), 390 * (1 - Math.max(0.01, 0.85 + 0.15 * pc)), Math.max(0.01, 0.85 + 0.15 * pc));
      op(cardG, clamp(pc * 2));
      op(vTitle, P(t, at('start'), 0.3, linear));
      op(vSub, P(t, mid('start', 0.33), 0.3, linear));
      op(vBallG, P(t, mid('start', 0.33), 0.3, linear));
      op(vArrow, P(t, mid('start', 0.45), 0.3, linear));
      op(vFixed, P(t, mid('start', 0.72), 0.3, linear));
      const x = 600 + 120 * Math.sin(t * TAU * 2.2) * (S.reduce ? 0.6 : 1);
      attr(vBall, 'cx', x); attr(vBall, 'cy', 480);
      vGhosts.forEach((g, i) => { attr(g, 'cx', 600 + (i ? 120 : -120) * (S.reduce ? 0.6 : 1)); attr(g, 'cy', 480); });
      // Nigel peeks in from the corner, eyes on the ball
      op(nigelCorner, P(t, mid('start', 0.5), 0.4, linear)); tr(nigelCorner, 1090, 690 - 40 * P(t, mid('start', 0.5), 0.5, easeOut), 0.5);
      nigelCorner.set({ t, mood: 'deadpan', look: clamp((x - 1090) / 300, -1, 1) });
    }

    /* ---------- inspection: drum, guitar, speaker ---------- */
    if (sid === 'drum' || sid === 'guitar') {
      op(hallG, 1); op(hallDim, 0.25);
      op(nigel, 1); tr(nigel, 250, 470, 1.0);
      op(clip, 1); tr(clip, 380, 540, 0.55, 10);
      op(inspChip, 1); tr(inspChip, 250, 300);
      nigel.set({ t, talk: talk(t, 'nigel'), mood: 'deadpan', look: 0.8 });
      if (sid === 'drum') {
        op(drum, 1);
        const hit = mid('drum', 0.42), hp = P(t, hit - 0.25, 0.25, easeIn) * (1 - P(t, hit, 0.3, easeOut));
        tr(drum.stick, lerp(120, 40, hp), lerp(-210, -60, hp), 1, lerp(-30, 10, hp));
        const flex = t > hit ? Math.exp(-(t - hit) * 0.5) : 0;
        drum.set(t, flex * AMP + (t > hit ? 0.2 : 0));
        op(boom, flex > 0.4 ? 1 : 0); tr(boom, 1030, 300, 1, -8);
        vibPop(cDrum, P(t, mid('drum', 0.62), 0.4, pop), 830, 180);
      } else {
        op(guitar, 1);
        const pl = mid('guitar', 0.4), a = t > pl ? 0.3 + 0.7 * Math.exp(-(t - pl) * 0.6) : 0;
        guitar.set(t, a * (S.reduce ? 0.6 : 1));
        op(plink, win(t, pl, pl + 0.8, 0.1)); tr(plink, 1010, 300, 1, 6);
        vibPop(cGuit, P(t, mid('guitar', 0.6), 0.4, pop), 820, 180);
      }
    }
    if (sid === 'speaker') {
      op(hallG, 1); op(hallDim, 0.5);
      op(spk, 1); op(spkRowW, 1);
      const on = P(t, at('speaker') + 0.1, 0.3, linear);
      spk.set(t, on);
      const t1 = t - at('speaker') - 0.1, wl = 200, f = 1.4;
      spkRow.set({ t, amp: 18 * AMP, wl, f, front: Math.max(0, t1) * wl * f });
      // Nigel at the end of the row gets the shove too (his rest position x0 = 500 in row coordinates)
      const x0 = 520, reach = clamp((Math.max(0, t1) * wl * f - x0) / 80);
      const shove = 30 * AMP * Math.sin(TAU * (x0 / wl - f * t)) * reach;
      const isRude = t > mid('speaker', 0.55);
      op(nigel, 1); tr(nigel, 960 - shove, 440, 0.95, -shove * 0.25);
      nigel.set({ t, talk: talk(t, 'nigel'), mood: isRude ? 'annoyed' : 'deadpan', look: isRude ? -1 : -0.6, sweat: isRude ? 0.6 : 0, still: reach > 0.5 });
      vibPop(cCone, P(t, mid('speaker', 0.22), 0.4, pop), 660, 170);
      vibPop(rude, P(t, end('speaker') - 0.35, 0.35, pop), 1050, 270, 1, -6);
    }

    /* ---------- hum ---------- */
    if (sid === 'hum') {
      op(hallG, 1); op(hallDim, 0.3);
      const k = 1 + 0.05 * P(t, s0, 1.8, linear);
      op(kav, 1); tr(kav, 640, 470, 1.55 * k); op(kLids, 1);
      kav.set({ t, talk: talk(t, 'kavya') * 0.35, mood: 'happy' });
      op(humLines, 1);
      humL.forEach((p, i) => {
        const f = ((t * 1.2 + i / 3) % 1), x = 640 + (i - 1) * 46, y0 = 560 - f * 0, yy = 550;
        let d = ''; for (let k2 = 0; k2 <= 6; k2++) { const xx = 760 + f * 160 + k2 * 10; d += (k2 ? 'L' : 'M') + xx.toFixed(0) + ',' + (yy - 40 + i * 40 + Math.sin(k2 * 1.6 + t * 9) * 8).toFixed(0); }
        attr(p, 'd', d); op(p, (1 - f));
      });
      notes.forEach((n, i) => { const f = ((t * 0.6 + i / 3) % 1); op(n, Math.sin(f * Math.PI)); tr(n, 840 + i * 80 + f * 40, 380 - f * 160); });
      vibPop(humChip, P(t, at('hum') + 0.1, 0.4, pop), 300, 300);
    }

    /* ---------- cords ---------- */
    if (sid === 'cords') {
      op(throatBg, 1);
      op(kav, 1); tr(kav, 270, 470, 0.95);
      const comp = mid('cords', 0.82);
      kav.set({ t, mood: t > comp ? 'annoyed' : 'neutral', look: 0.5 });
      op(throatRing, P(t, at('cords') + 0.1, 0.3, linear)); op(callout, P(t, at('cords') + 0.2, 0.4, linear));
      const wp = P(t, at('cords') + 0.2, 0.45, pop);
      op(cordWin, clamp(wp * 2.5)); tr(cordWin, 790, 345, Math.max(0.01, 0.6 + 0.4 * wp));
      // the vocal folds open and close (faster and rougher when she complains)
      const rough = t > comp ? 1 : 0;
      const vib = t > mid('cords', 0.5) ? Math.abs(Math.sin(t * TAU * (5 + 3 * rough))) * (1 - 0.3 * rough * Math.abs(Math.sin(t * 13))) : 0.15;
      const gap = 6 + 46 * vib * (S.reduce ? 0.6 : 1);
      attr(glottis, 'd', `M0,-140 L${-gap},130 L${gap},130 Z`);
      attr(foldL, 'd', `M0,-140 L${-gap},130 L${-gap - 62},130 Q${-gap - 74},0 -22,-140 Z`);
      attr(foldR, 'd', `M0,-140 L${gap},130 L${gap + 62},130 Q${gap + 74},0 22,-140 Z`);
      vibPop(cordChip, P(t, mid('cords', 0.15), 0.4, pop), 790, 615);
      [0.6, 0.7, 0.8].forEach((f, i) => vibPop(cordUses[i], P(t, mid('cords', f), 0.35, pop), 270, 180 + i * 64));
      vibPop(grumble, P(t, comp + 0.15, 0.35, pop), 420, 360, 1, 4);
      op(nigelCorner, 1); tr(nigelCorner, 1110, 660, 0.5);
      nigelCorner.set({ t, talk: talk(t, 'nigel'), mood: 'deadpan', look: -0.8 });
    }

    /* ---------- mostly ---------- */
    if (sid === 'mostly') {
      op(hallG, 1); op(hallDim, 0.3);
      const k = 1 + 0.12 * P(t, s0, end('mostly') + 0.6 - s0, linear);
      op(kav, 1); tr(kav, 600, 470 + 30 * (k - 1), 1.7 * k);
      kav.set({ t, talk: talk(t, 'kavya'), mood: 'deadpan', look: 0 });
    }

    /* ---------- Archie bursts in ---------- */
    if (sid === 'archie') {
      op(airG, 1); air.upd(t);
      const e = P(t, at('archie') - 0.05, 0.4, easeOut);
      op(nigel, 1); tr(nigel, 320, 450, 1.0);
      nigel.set({ t, mood: t > at('archie') + 0.5 ? 'deadpan' : 'shock', look: 1, still: t < at('archie') + 0.5 });
      op(archie, 1); tr(archie, lerp(1350, 820, e), 450, 1.0, lerp(-20, 0, e));
      archie.set({ t, talk: talk(t, 'archie'), mood: 'happy', look: -0.6, bounce: e > 0.9 ? 1 * AMP : 0 });
      op(zoomL, 1 - P(t, at('archie') + 0.3, 0.3, linear)); tr(zoomL, lerp(1350, 820, e) + 110, 450);
      ltArchie.set(win(t, at('archie') + 0.3, at('archie') + 3.4, 0.3));
      vibPop(cAr, P(t, mid('archie', 0.3), 0.4, pop), 840, 170);
      vibPop(c1pc, P(t, mid('archie', 0.52), 0.4, pop), 840, 240);
      vibPop(cDay, P(t, mid('archie', 0.82), 0.4, pop), 1050, 320, 1, 8);
    }

    /* ---------- Nigel's confessional ---------- */
    if (sid === 'thnigel') {
      const k = 1 + 0.08 * P(t, end('thnigel'), 0.8, linear);
      confN.set(1, t); vibCam(confN, k, 400, 400);
      op(nigel, 1); tr(nigel, 380, 420 - 10 * (k - 1), 1.5 * k);
      nigel.set({ t, talk: talk(t, 'nigel'), mood: 'deadpan', look: t > mid('thnigel', 0.72) && t < end('thnigel') ? 0.5 : 0 });
      const ip = P(t, at('thnigel') + 0.2, 0.4, pop);
      op(inset, clamp(ip * 2.5)); tr(inset, 880, 300, Math.max(0.01, 0.7 + 0.3 * ip));
      const frantic = t > mid('thnigel', 0.74);
      iFanBl.setAttribute('transform', `scale(1 0.3) rotate(${((t * 300) % 360).toFixed(1)})`);
      const fx = 70 + 90 * Math.cos(t * 2.3), fy = -40 + 60 * Math.sin(t * 3.1);
      tr(iFly, fx, fy);
      tr(iArchie, -40, 70);
      const lookAt = clamp((Math.sin(t * 0.9) > 0 ? fx + 40 : -110 + 40) / 120, -1, 1);
      iArchie.set({ t, mood: frantic ? (Math.sin(t * 3) > 0 ? 'shock' : 'happy') : 'happy', look: lookAt, bounce: frantic ? 1 * AMP : 0.4 * AMP });
      op(iWow, frantic ? 1 : 0); tr(iWow, -40, -60 + (frantic ? -6 * Math.abs(Math.sin(t * 9)) : 0));
      vibPop(cNoble, P(t, mid('thnigel', 0.42), 0.4, pop), 880, 560);
      vibPop(cEmo, P(t, mid('thnigel', 0.76), 0.4, pop), 880, 640, 1, -3);
    }

    /* ---------- test ---------- */
    if (sid === 'test') {
      op(hallG, 1); op(hallDim, 0.2);
      op(kav, 1); tr(kav, 860, 500, 1.3);
      kav.set({ t, mood: t > mid('test', 0.75) ? 'annoyed' : 'deadpan', look: t > mid('test', 0.75) ? 0 : -0.7 });
      op(tri, 1); tr(tri, 600, 420, 1.2); tri.set({ t, ring: 0, hit: 0 });
      op(nigel, 1); tr(nigel, 230, 480, 0.9);
      nigel.set({ t, talk: talk(t, 'nigel'), mood: 'deadpan', look: 1 });
      vibPop(proof, P(t, at('test') + 0.05, 0.35, pop), 230, 300);
      vibPop(step1, P(t, mid('test', 0.4), 0.35, pop), 600, 180);
      vibPop(step2, P(t, mid('test', 0.78), 0.35, pop), 820, 180);
    }

    /* ---------- grab: DING!, then held ---------- */
    if (sid === 'grab') {
      op(hallG, 1); op(hallDim, 0.6);
      const hitT = at('grab') + 0.25, held = mid('grab', 0.6);
      const hit = P(t, hitT - 0.2, 0.2, easeIn) * (1 - P(t, hitT, 0.3, easeOut));
      const ringing = t > hitT && t < held;
      op(tri, 1); tr(tri, 470, 420, 2.0);
      tri.set({ t, ring: ringing ? AMP : 0, hit, held: t >= held });
      // DING! and rings while it vibrates; cut dead the moment it is held
      op(dingT, ringing ? 1 : 0); tr(dingT, 900, 300, Math.max(0.01, 0.7 + 0.3 * P(t, hitT, 0.3, pop)), -6);
      dingRings.forEach((r, i) => { const f = ((t - hitT) * 0.9 + i / 3) % 1; op(r, ringing ? (1 - f) * 0.6 : 0); attr(r, 'cx', 470); attr(r, 'cy', 420); attr(r, 'r', 160 + f * 420); });
      vibPop(stopG, P(t, held + 0.1, 0.35, pop), 880, 470);
      op(silence, P(t, held + 0.5, 0.3, linear)); tr(silence, 880, 300);
    }

    /* ---------- source ---------- */
    if (sid === 'source') {
      op(hallG, 1); op(hallDim, 0.5);
      op(nigel, 1); tr(nigel, 270, 470, 1.15);
      nigel.set({ t, talk: talk(t, 'nigel'), mood: t > mid('source', 0.7) ? 'smug' : 'deadpan', look: 0.6 });
      const pc = P(t, at('source') - 0.05, 0.4, pop);
      op(srcG, clamp(pc * 2.5));
      op(sRow1, P(t, at('source') + 0.1, 0.3, linear));
      const p2 = P(t, mid('source', 0.3), 0.45, pop); op(sRow2, clamp(p2 * 2.5));
      sRow2.setAttribute('transform', `translate(840 400) scale(${Math.max(0.01, 0.7 + 0.3 * p2).toFixed(3)}) translate(-840 -400)`);
      op(sRow3, P(t, mid('source', 0.66), 0.35, linear)); sRow3.sp.upd(t);
    }

    /* ---------- Kavya's confessional ---------- */
    if (sid === 'thkavya') {
      const k = 1 + 0.08 * P(t, end('thkavya'), 0.9, linear);
      confK.set(1, t); vibCam(confK, k, 420, 400);
      op(kav, 1); tr(kav, 410, 450 - 10 * (k - 1), 1.6 * k);
      const hope = t < mid('thkavya', 0.3);
      kav.set({ t, talk: talk(t, 'kavya'), mood: hope ? 'happy' : (t > end('thkavya') ? 'deadpan' : 'annoyed'), look: hope ? 0.4 : 0 });
      const tp = P(t, mid('thkavya', 0.25), 0.4, pop);
      op(tally, clamp(tp * 2.5)); tr(tally, 880, 330, Math.max(0.01, 0.7 + 0.3 * tp), 2);
      op(tRow1, P(t, mid('thkavya', 0.3), 0.3, linear));
      op(tRow2, P(t, mid('thkavya', 0.62), 0.3, linear)); op(tNote, P(t, mid('thkavya', 0.75), 0.3, linear));
    }
  };
});
