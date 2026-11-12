/* Scene 6: The band breaks up (chromatography, separating funnel, magnets).
   Shots: A the kitchen crime scene (fridge open, an empty bubble tea, evidence marker, crime tape)
   -> B close-up of the note "Sorry." and three suspect mugshots (MUM, DAD, BROTHER + his bowls)
   -> C Inky leaps off the note (lower third INKY) -> D the case-file board: CHROMATOGRAPHY card,
   the paper with its pencil line above the solvent, the solvent rises and the dyes separate,
   Inky splits into three little dye Inkys -> E Arthur's confessional with a photo of the three
   -> F the evidence: NOTE spots level with BROTHER spots (MUM, DAD do not match)
   -> G Kavya points: GUILTY -> H the lab: oil on water in a separating funnel, the tap drains the
   lower layer -> I a magnet lifts iron filings out of sand, Sandy waves them off
   -> J Arthur's confessional: the magnetic metals (Co, small o), "Match the method to the mixture", a heart. */
scene('band', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;
  const talk = (t, who) => scTalk(S, t, who);

  /* ---------- helpers (prefixed band) ---------- */
  function bandPop(el, t, t0, x, y, s, r) { const p = P(t, t0, 0.45, pop); op(el, clamp(p * 2.5)); tr(el, x, y, Math.max(0.01, (s || 1) * (0.6 + 0.4 * p)), r); return p; }
  function bandChip(parent, text, o) {
    o = o || {};
    return chip(parent, text, { size: o.size || 30, fill: o.fill || 'rgba(10,27,39,0.9)', stroke: o.stroke || C.line, sw: o.sw || 2, color: o.color || C.ink, weight: o.weight || 700 });
  }
  // a chip at (x, y) with a leader line to the point (tx, ty)
  function bandTag(parent, text, x, y, tx, ty, o) {
    o = o || {};
    const g = G(parent), col = o.line || '#FFFFFF';
    const ln = E('line', { x2: tx, y2: ty, stroke: col, 'stroke-width': 3 }, g);
    E('circle', { cx: tx, cy: ty, r: 5, fill: col }, g);
    const c = bandChip(g, text, o); tr(c, x, y);
    attr(ln, 'x1', tx < x ? x - c.w / 2 : x + c.w / 2); attr(ln, 'y1', y);
    return g;
  }
  // a rubber stamp: g.set(p, x, y, rot) thumps it down
  function bandStamp(parent, text, o) {
    o = o || {};
    const size = o.size || 52, col = o.color || C.bad, g = G(parent);
    const w = textWidth(text, size, FD, 800) + size * 1.2, h = size * 1.7;
    E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: 12, fill: 'rgba(255,255,255,0.85)', stroke: col, 'stroke-width': 7 }, g);
    E('rect', { x: -w / 2 + 10, y: -h / 2 + 10, width: w - 20, height: h - 20, rx: 8, fill: 'none', stroke: col, 'stroke-width': 2.5 }, g);
    T(g, 0, size * 0.36, text, { size, weight: 800, anchor: 'middle', fill: col, ls: 3 });
    g.set = (p, x, y, rot) => { op(g, clamp(p * 4)); tr(g, x, y, lerp(1.8, 1, easeOut(clamp(p))), rot); };
    return g;
  }
  // camera: scale k about (cx, cy), clamped so the stage stays covered
  function bandCam(cx, cy, k) {
    cx = clamp(cx, 600 / k, 1200 - 600 / k); cy = clamp(cy, 375 / k, 750 - 375 / k);
    attr(world, 'transform', `translate(600 375) scale(${k.toFixed(4)}) translate(${(-cx).toFixed(1)} ${(-cy).toFixed(1)})`);
  }
  function bandHeart(parent, col) {
    return E('path', { d: 'M0,22 C-46,-6 -34,-42 -12,-40 C-4,-39 0,-31 0,-25 C0,-31 4,-39 12,-40 C34,-42 46,-6 0,22 Z', fill: col || '#FF5FA2', stroke: '#FFFFFF', 'stroke-width': 3 }, parent);
  }
  // a bubble tea cup (empty), base at (0, 0)
  function bandCup(parent) {
    const g = G(parent);
    E('path', { d: 'M-38,-120 L38,-120 L28,0 L-28,0 Z', fill: 'rgba(255,255,255,0.45)', stroke: '#8C99A6', 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
    E('path', { d: 'M-30,-18 L30,-18 L28,0 L-28,0 Z', fill: '#E9D7BC', opacity: 0.8 }, g);     // a sad milky puddle
    [[-16, -8], [-2, -10], [12, -7], [6, -16]].forEach(([x, y]) => E('circle', { cx: x, cy: y, r: 6, fill: '#3A2418' }, g));   // two pearls left, at most
    E('path', { d: 'M-42,-120 Q0,-158 42,-120 Z', fill: 'rgba(255,255,255,0.55)', stroke: '#8C99A6', 'stroke-width': 4 }, g);   // dome lid
    E('line', { x1: 8, y1: -196, x2: 0, y2: -30, stroke: '#FF8FC8', 'stroke-width': 12, 'stroke-linecap': 'round' }, g);         // fat straw
    E('path', { d: 'M-26,-92 L26,-92 L24,-60 L-24,-60 Z', fill: '#FF5FA2', opacity: 0.85 }, g);
    T(g, 0, -68, 'KAVYA', { size: 19, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
    return g;
  }
  // a mugshot card, centred; name strip below
  function bandSuspect(parent, name, kind) {
    const g = G(parent);
    if (kind === 'bro') {                                            // his tower of bowls, behind the card
      g.bowls = [];
      for (let i = 0; i < 5; i++) {
        const b = G(g);
        E('path', { d: 'M-46,-20 Q-42,4 0,6 Q42,4 46,-20 Z', fill: ['#F4F7FA', '#FFD6BF', '#BFE3F7', '#F7E3EE', '#FFE29A'][i], stroke: SC_INK, 'stroke-width': 3 }, b);
        g.bowls.push(b);
      }
    }
    E('rect', { x: -78, y: -104, width: 156, height: 208, rx: 8, fill: '#D8E0E8', stroke: SC_INK, 'stroke-width': 4 }, g);
    const sil = '#26323E';
    E('path', { d: 'M-62,104 Q-60,40 0,34 Q60,40 62,104 Z', fill: sil }, g);
    E('circle', { cy: -10, r: 40, fill: sil }, g);
    if (kind === 'mum') E('circle', { cx: 0, cy: -56, r: 20, fill: sil }, g);                     // a bun
    if (kind === 'dad') E('rect', { x: -44, y: -44, width: 88, height: 14, rx: 6, fill: sil }, g);   // flat top
    if (kind === 'bro') E('path', { d: 'M-40,-26 L-34,-66 L-18,-44 L-6,-74 L8,-46 L24,-70 L30,-42 L44,-56 L40,-20 Z', fill: sil }, g);   // messy hair
    const nm = bandChip(g, name, { size: 28, fill: '#FFFFFF', color: SC_INK, stroke: SC_INK, sw: 3 }); tr(nm, 0, 136);
    return g;
  }

  /* ---------- layers: a camera world, then the HUD ---------- */
  const world = G(root), Lbg = G(world), Lmid = G(world), Lcast = G(world), Ldesk = G(world), Lfg = G(world), Lhud = G(root);

  /* ================= A: the kitchen crime scene ================= */
  const shA = G(Lbg);
  const kit = ecKitchen(shA);
  const fridgeOpen = G(shA);
  E('ellipse', { cx: 150, cy: 470, rx: 200, ry: 170, fill: glow('#FFF3C2'), opacity: 0.55 }, fridgeOpen);
  E('rect', { x: 60, y: 306, width: 170, height: 304, rx: 6, fill: '#FFF8E2' }, fridgeOpen);
  E('path', { d: 'M62,384 L228,384 M62,464 L228,464 M62,544 L228,544', stroke: '#D9CFB4', 'stroke-width': 5 }, fridgeOpen);
  E('rect', { x: 78, y: 324, width: 34, height: 58, rx: 3, fill: '#FFFFFF', stroke: '#6FA8FF', 'stroke-width': 3 }, fridgeOpen);   // milk
  E('rect', { x: 126, y: 420, width: 66, height: 42, rx: 6, fill: '#FFD6BF', stroke: '#B8AE9A', 'stroke-width': 3 }, fridgeOpen);    // leftovers
  E('ellipse', { cx: 168, cy: 540, rx: 30, ry: 7, fill: 'none', stroke: '#C9A26A', 'stroke-width': 3, 'stroke-dasharray': '6 5' }, fridgeOpen);   // where the tea WAS
  E('path', { d: 'M240,302 L336,330 L336,596 L240,616 Z', fill: '#E3EAF0', stroke: '#9AA9B6', 'stroke-width': 4, 'stroke-linejoin': 'round' }, fridgeOpen);
  E('line', { x1: 318, y1: 400, x2: 318, y2: 520, stroke: '#B9C6D2', 'stroke-width': 10, 'stroke-linecap': 'round' }, fridgeOpen);
  const miniNote = G(shA); tr(miniNote, 140, 226, 1, -6);
  E('rect', { x: -34, y: -32, width: 68, height: 64, fill: '#FFE45C', stroke: '#C9A800', 'stroke-width': 2 }, miniNote);
  E('path', { d: 'M-22,-8 Q-10,-16 2,-8 T22,-8 M-22,10 L14,10', fill: 'none', stroke: '#1A1D2E', 'stroke-width': 4, 'stroke-linecap': 'round' }, miniNote);
  const noteRing = E('circle', { cx: 140, cy: 226, r: 58, fill: 'none', stroke: C.energy, 'stroke-width': 6 }, Lfg);
  const tableFront = G(Ldesk);
  E('rect', { x: -20, y: 600, width: 1240, height: 160, fill: '#8A5A3B' }, tableFront);
  E('rect', { x: -20, y: 600, width: 1240, height: 18, fill: '#A8724D' }, tableFront);
  const cup = bandCup(Lfg);
  const marker = G(Lfg);                                                  // CSI evidence marker
  E('path', { d: 'M-30,0 L-18,-58 L18,-58 L30,0 Z', fill: '#FFD400', stroke: SC_INK, 'stroke-width': 3, 'stroke-linejoin': 'round' }, marker);
  T(marker, 0, -16, '1', { size: 34, weight: 800, anchor: 'middle', fill: SC_INK });
  const tape = G(Ldesk), tapeIn = G(tape);
  E('rect', { x: -720, y: -26, width: 1440, height: 52, fill: '#FFD400', stroke: '#1B1B1B', 'stroke-width': 3 }, tapeIn);
  T(tapeIn, -700, 10, 'CRIME SCENE · DO NOT CROSS · CRIME SCENE · DO NOT CROSS · CRIME SCENE ·', { size: 28, weight: 800, fill: '#111111', ls: 1 });

  /* ================= B/C/G: the fridge door and the suspects ================= */
  const shB = G(Lbg);
  E('rect', { x: 0, y: 0, width: 640, height: 750, fill: linGrad('#F7FAFC', '#D5DEE6', true) }, shB);
  E('rect', { x: 640, y: 0, width: 560, height: 750, fill: '#CFE6DA' }, shB);
  let tl = ''; for (let x = 650; x <= 1200; x += 50) tl += `M${x},0 L${x},750 `; for (let y = 0; y <= 750; y += 50) tl += `M640,${y} L1200,${y} `;
  E('path', { d: tl, stroke: '#B5D2C2', 'stroke-width': 2 }, shB);
  E('rect', { x: 632, y: 0, width: 14, height: 750, fill: '#9AA9B6' }, shB);
  E('rect', { x: 584, y: 150, width: 24, height: 460, rx: 12, fill: '#B9C6D2', stroke: '#8C99A6', 'stroke-width': 3 }, shB);
  [[90, 640, '#FF6F91']].forEach(([x, y, c]) => E('circle', { cx: x, cy: y, r: 16, fill: c, stroke: SC_INK, 'stroke-width': 3 }, shB));
  const note = G(Lmid);
  E('rect', { x: -184, y: -160, width: 380, height: 340, fill: '#000000', opacity: 0.12 }, note);
  E('rect', { x: -190, y: -170, width: 380, height: 340, fill: '#FFE45C', stroke: '#C9A800', 'stroke-width': 3 }, note);
  E('rect', { x: -190, y: -170, width: 380, height: 46, fill: '#F2D23C' }, note);
  const noteInk = G(note);
  const sorry = T(noteInk, 0, 30, 'Sorry.', { size: 104, weight: 700, anchor: 'middle', fill: '#1A1D2E' });
  sorry.setAttribute('font-style', 'italic');
  E('path', { d: 'M-130,72 Q-60,58 0,74 T130,66', fill: 'none', stroke: '#1A1D2E', 'stroke-width': 6, 'stroke-linecap': 'round' }, noteInk);
  const inkChip = bandChip(Lfg, 'in BLACK INK', { size: 32, color: '#FFFFFF' });
  const susp = [['MUM', 'mum', 740], ['DAD', 'dad', 910], ['BROTHER', 'bro', 1080]].map(([n, k, x]) => ({ g: bandSuspect(Lmid, n, k), x }));
  const bro = susp[2].g;
  const broRing = E('rect', { x: -92, y: -118, width: 184, height: 290, rx: 14, fill: 'none', stroke: C.bad, 'stroke-width': 6 }, bro);
  const qMarks = [0, 1, 2].map(() => T(Lfg, 0, 0, '?', { size: 52, weight: 800, anchor: 'middle', fill: '#B48CFF' }));
  const oneChip = bandChip(Lfg, 'just one colour?', { size: 32, color: '#FFFFFF', stroke: '#B48CFF' });
  const guilty = bandStamp(Lhud, 'GUILTY');
  const matchChip = bandChip(Lfg, 'his pen: every spot level ✓', { size: 30, color: C.good, stroke: C.good });

  /* ================= D/F: the case-file board and the chromatography ================= */
  const shD = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#1D2A35', '#2E4354', true) }, shD);
  E('ellipse', { cx: 420, cy: 420, rx: 380, ry: 320, fill: glow('#FFE29A'), opacity: 0.2 }, shD);
  T(shD, 880, 150, 'CASE FILE: THE BUBBLE TEA', { size: 28, weight: 800, anchor: 'middle', fill: '#7F98AA', ls: 1 });
  const chromaCard = G(Lfg);
  card(chromaCard, -420, -145, 840, 290, { fill: 'rgba(10,27,39,0.92)', stroke: '#B48CFF', sw: 3 });
  T(chromaCard, 0, -54, 'CHROMATOGRAPHY', { size: 62, weight: 800, anchor: 'middle', fill: C.energy, ls: 2 });
  T(chromaCard, 0, 8, 'separates **COLOURED SUBSTANCES**', { size: 38, weight: 600, anchor: 'middle', boldFill: '#FFFFFF' });
  const dyeRow = G(chromaCard);
  T(dyeRow, -40, 76, 'like the dyes in an ink', { size: 30, weight: 600, anchor: 'middle', fill: C.muted });
  [['#3B82F6', 170], ['#FF5FA2', 210], ['#FFC247', 250]].forEach(([c, x]) => E('circle', { cx: x, cy: 66, r: 15, fill: c, stroke: '#FFFFFF', 'stroke-width': 2 }, dyeRow));
  const CH = [420, 410];
  const chroma = ecChroma(Lmid); tr(chroma, CH[0], CH[1]);
  const laneX = i => CH[0] + chroma.laneX(i), spotY = h => CH[1] + chroma.base - (chroma.base - chroma.top) * h;
  const tagPencil = bandTag(Lfg, 'pencil line', 850, 495, CH[0] + 236, CH[1] + chroma.base, { size: 30 });
  const pencilNote = T(Lfg, 850, 555, "(pencil doesn't dissolve)", { size: 26, weight: 600, anchor: 'middle', fill: C.muted, font: FB });
  const tagSolvent = bandTag(Lfg, 'solvent', 850, 615, CH[0] + 220, CH[1] + 192, { size: 30, color: '#BFE3F7', line: '#BFE3F7' });
  const aboveChip = bandChip(Lfg, 'spots start ABOVE the solvent', { size: 28, color: C.energy, stroke: C.energy });
  const upChip = bandChip(Lfg, 'the solvent soaks UP ↑', { size: 30, color: '#BFE3F7', stroke: '#BFE3F7' });
  const travelCard = G(Lfg);
  card(travelCard, -230, -118, 460, 236, { fill: 'rgba(10,27,39,0.92)', stroke: C.line, sw: 3 });
  const tv1 = T(travelCard, 0, -68, 'each dye travels a', { size: 28, weight: 600, anchor: 'middle' });
  const tv2 = T(travelCard, 0, -22, 'DIFFERENT DISTANCE', { size: 36, weight: 800, anchor: 'middle', fill: C.energy });
  const tv3 = T(travelCard, 0, 32, 'further = more soluble,', { size: 30, weight: 700, anchor: 'middle', fill: '#9FD8FF' });
  const tv4 = T(travelCard, 0, 74, 'sticks less to the paper', { size: 30, weight: 700, anchor: 'middle', fill: '#9FD8FF' });
  const furthest = E('ellipse', { rx: 30, ry: 26, fill: 'none', stroke: C.energy, 'stroke-width': 5 }, Lfg);
  const levelLines = [0.82, 0.55, 0.3].map(h => E('line', { x1: laneX(0) - 30, y1: spotY(h), x2: laneX(0) - 30, y2: spotY(h), stroke: '#FFFFFF', 'stroke-width': 3, 'stroke-dasharray': '9 7' }, Lfg));
  const idMarks = [cross(Lfg, 12), cross(Lfg, 12), tick(Lfg, 14)];
  const broTicks = [0.82, 0.55, 0.3].map(() => tick(Lfg, 11));
  const idCard = G(Lfg);
  card(idCard, -230, -100, 460, 200, { fill: 'rgba(10,27,39,0.92)', stroke: C.good, sw: 3 });
  T(idCard, 0, -42, 'spots LEVEL =', { size: 36, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  T(idCard, 0, 6, 'very likely the', { size: 30, weight: 600, anchor: 'middle', fill: C.muted });
  T(idCard, 0, 56, 'SAME SUBSTANCE', { size: 40, weight: 800, anchor: 'middle', fill: C.good });
  const dyeChips = [['blue!', '#3B82F6'], ['pink!', '#FF5FA2'], ['yellow?!', '#FFC247']].map(([s, c]) => bandChip(Lfg, s, { size: 30, color: c, stroke: c }));

  /* ================= E: Arthur's confessional ================= */
  const conf = ecConfessional(Lbg, 'arthur');
  const photo = G(Lmid);
  E('rect', { x: -175, y: -160, width: 350, height: 320, rx: 6, fill: '#FFFFFF', stroke: '#C9BFA6', 'stroke-width': 3 }, photo);
  E('rect', { x: -155, y: -140, width: 310, height: 230, fill: linGrad('#FFD6EA', '#B48CFF', true) }, photo);
  T(photo, 0, 136, 'the band, 3 dyes', { size: 28, weight: 700, anchor: 'middle', fill: SC_INK });
  const photoHeart = bandHeart(photo); tr(photoHeart, 0, -96, 0.8);
  const mixChip = bandChip(Lfg, 'black ink = a MIXTURE of dyes', { size: 32, color: C.energy, stroke: C.energy });
  const mugW = G(Lfg), mug = ecMug(mugW, 1);

  /* ================= H/I: the lab ================= */
  const shH = G(Lbg);
  const lab = ecLab(shH);
  // no shelf of bottles in this lab: it fought the funnel's stand (and the element budget)
  [...lab.children].slice(2, 24).forEach(el => el.remove());
  const coverI = E('rect', { x: 236, y: 136, width: 196, height: 196, fill: linGrad('#254454', '#28495A', true) }, Lbg);   // the goggles sign, out of the close-up
  const FN = [560, 305, 0.95];
  const funnel = ecSepFunnel(Lmid); tr(funnel, FN[0], FN[1], FN[2]);
  const oilFace = scFace(funnel, { eye: 9, gap: 26, mouthW: 18, mouthY: 15, lidCol: '#F2C94C' });
  const watFace = scFace(funnel, { eye: 9, gap: 26, mouthW: 18, mouthY: 15, lidCol: '#4CC9F0' });
  const fx = (lx) => FN[0] + lx * FN[2], fy = (ly) => FN[1] + ly * FN[2];
  const tagOil = bandTag(Lfg, 'OIL', 430, 196, fx(-58), fy(-86), { size: 32, color: '#F2C94C', line: '#F2C94C' });
  const tagWat = bandTag(Lfg, 'WATER', 380, 352, fx(-26), fy(4), { size: 32, color: '#4CC9F0', line: '#4CC9F0' });
  const tagTap = bandTag(Lfg, 'TAP', 400, 440, fx(-24), fy(80), { size: 32, color: '#FF9AA4', line: '#FF9AA4' });
  const immChip = G(Lfg);
  { const c = bandChip(immChip, 'IMMISCIBLE', { size: 44, color: C.energy, stroke: C.energy, sw: 3 }); T(immChip, 0, 62, "they don't mix: LAYERS", { size: 30, weight: 700, anchor: 'middle', fill: '#FFFFFF' }); immChip.c = c; }
  const denseChip = bandChip(Lfg, 'less dense oil floats on TOP', { size: 32, color: '#F2C94C', stroke: '#F2C94C' });
  const openChip = bandChip(Lfg, 'open the tap: the LOWER layer drains first', { size: 30, color: '#4CC9F0', stroke: '#4CC9F0' });
  const closeChip = bandChip(Lfg, 'close it at the BOUNDARY ✓', { size: 32, color: C.good, stroke: C.good });
  // the dish of sand and iron filings
  const dish = G(Lmid);
  E('ellipse', { cx: 600, cy: 548, rx: 262, ry: 44, fill: 'rgba(200,230,250,0.25)', stroke: GLASS.stroke, 'stroke-width': 4 }, dish);
  E('ellipse', { cx: 600, cy: 548, rx: 236, ry: 30, fill: ball('#EED39A', '#B08A46') }, dish);
  const dishFront = E('path', { d: 'M338,548 Q338,600 600,600 Q862,600 862,548', fill: 'rgba(200,230,250,0.25)', stroke: GLASS.stroke, 'stroke-width': 4 }, Ldesk);
  const filings = [], fr = rng(61);
  for (let i = 0; i < 18; i++) {
    const a = fr() * TAU, k = Math.sqrt(fr());
    const x0 = 600 + Math.cos(a) * 215 * k, y0 = 550 + Math.sin(a) * 22 * k;
    const el = E('line', { x1: -8, y1: 0, x2: 8, y2: 0, stroke: '#3A4048', 'stroke-width': 5, 'stroke-linecap': 'round' }, Lfg);
    filings.push({ el, x0: (Math.abs(x0 - 600) < 60 ? x0 + Math.sign(x0 - 600 || 1) * 70 : x0), y0, a0: fr() * 180, side: i % 2, dx: (i % 2 ? 1 : -1) * (88 + fr() * 58), dy: 4 + fr() * 20, d: fr() * 0.5 });
  }
  const mag = G(Lfg), magIn = magnet(mag, 300, 64);
  const tagFil = bandTag(Lfg, 'iron filings', 220, 660, 420, 556, { size: 30, color: '#C9D3DC' });
  const magChip = bandChip(Lfg, 'MAGNETIC: a magnet lifts it out', { size: 32, color: C.energy, stroke: C.energy });
  const sandy = cast(Lcast, 'sandy');
  const sArm = G(sandy.firstChild);
  E('path', { d: 'M0,0 L36,-40', stroke: '#8A6A30', 'stroke-width': 15, 'stroke-linecap': 'round' }, sArm);
  E('path', { d: 'M0,0 L36,-40', stroke: '#E2C27E', 'stroke-width': 9, 'stroke-linecap': 'round' }, sArm);
  E('circle', { cx: 40, cy: -45, r: 12, fill: '#E2C27E', stroke: '#8A6A30', 'stroke-width': 3 }, sArm);

  /* ================= J: back in Arthur's confessional ================= */
  // only: the magnetic metals
  const onlyCard = G(Lfg);
  card(onlyCard, 70, 130, 520, 360, { fill: 'rgba(10,27,39,0.94)', stroke: C.energy, sw: 3 });
  const oTitle = T(onlyCard, 330, 188, 'MAGNETIC METALS', { size: 40, weight: 800, anchor: 'middle', fill: C.energy });
  const metals = [['iron', '#C98B6B', 205, 262], ['steel', '#A9B5C0', 455, 262], ['nickel', '#C9D3DC', 205, 338], ['cobalt', '#7FA6C9', 455, 338]].map(([s, c, x, y]) => {
    const g = G(onlyCard); bandChip(g, s, { size: 34, fill: c, color: SC_INK, stroke: '#FFFFFF', sw: 3 }); g.x = x; g.y = y; return g;
  });
  const coRow = G(onlyCard);
  const coT = E('text', { x: 190, y: 446, 'font-size': 56, 'font-weight': 800, fill: '#FFFFFF', 'text-anchor': 'middle', 'font-family': FD }, coRow);
  E('tspan', {}, coT).textContent = 'C';
  const coO = E('tspan', { fill: C.energy }, coT); coO.textContent = 'o';
  const coTick = tick(coRow, 15); tr(coTick, 262, 428);
  const smallO = bandChip(coRow, 'small o!', { size: 28, color: C.energy, stroke: C.energy }); tr(smallO, 420, 430);
  // method: the decision card
  const methCard = G(Lfg);
  card(methCard, 40, 118, 720, 540, { fill: 'rgba(10,27,39,0.94)', stroke: '#FF8FC8', sw: 3 });
  const mTitle = T(methCard, 400, 172, 'MATCH THE METHOD TO THE MIXTURE', { size: 34, weight: 800, anchor: 'middle', fill: C.energy });
  // rows: [question, y, [[method, colour, x, y], ...]]
  const ROWS = [
    ['Solid, liquid or dissolved?', 226, [['filtration', '#F2D9A6', 0, 276], ['evaporation', '#FFFFFF', 0, 276], ['distillation', '#9FD8FF', 0, 276]]],
    ['Do they mix?', 346, [['no: separating funnel', '#F2C94C', 400, 396], ['yes: fractional distillation', '#9FD8FF', 400, 450]]],
    ['Anything magnetic?', 528, [['yes: a magnet', '#FF9AA4', 400, 578]]],
  ];
  const mRows = ROWS.map(([q, y, ms]) => {
    const row = G(methCard);
    const qT = T(row, 400, y, q, { size: 32, weight: 700, anchor: 'middle', fill: '#FFFFFF' });
    const chips = ms.map(([s, c, x, cy]) => { const ch = bandChip(row, s, { size: 27, color: c, stroke: c }); ch.x = x; ch.y = cy; return ch; });
    const same = chips.filter(c => c.x === 0);
    if (same.length) { const tot = same.reduce((a, c) => a + c.w, 0) + 18 * (same.length - 1); let x = 400 - tot / 2; same.forEach(c => { c.x = x + c.w / 2; x += c.w + 18; }); }
    return { row, qT, chips };
  });
  const jobHeart = bandHeart(Lfg);

  /* ================= the cast ================= */
  const kavya = cast(Lcast, 'kavya');
  const arm = G(Lcast);                                                    // Kavya's pointing arm (shot G)
  E('path', { d: 'M78,92 L124,62', stroke: '#2E7DD8', 'stroke-width': 34, 'stroke-linecap': 'round' }, arm);
  E('path', { d: 'M120,64 L156,40 L222,-8', fill: 'none', stroke: SC_INK, 'stroke-width': 28, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, arm);
  E('path', { d: 'M120,64 L156,40 L222,-8', fill: 'none', stroke: '#B9784E', 'stroke-width': 21, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, arm);
  const fist = G(arm); tr(fist, 230, -14, 1, -38);
  E('rect', { x: 10, y: -20, width: 44, height: 14, rx: 7, fill: '#B9784E', stroke: SC_INK, 'stroke-width': 3 }, fist);
  E('circle', { r: 22, fill: '#B9784E', stroke: SC_INK, 'stroke-width': 3 }, fist);
  const inky = cast(Lcast, 'inky');
  const dyes = [['#3B82F6', '#1E4FA8'], ['#FF5FA2', '#B3326F'], ['#FFC247', '#B57B12']].map(([col, dark]) => cast(Lcast, 'inky', { col, dark }));
  const arthur = cast(Lcast, 'arthur');
  const ltInky = scLowerThird(Lhud, ...EC_LOWER.inky);

  /* ---------- shots ---------- */
  const SHOTS = [['A', -9], ['B', at('note') - 0.06], ['C', at('inky') - 0.06], ['D', at('chroma') - 0.06], ['E', at('thinky') - 0.06], ['F', at('identify') - 0.06],
    ['G', at('knew') - 0.06], ['H', at('oil') - 0.06], ['I', at('magnet') - 0.06], ['J', at('only') - 0.06]];
  const shotAt = t => { let s = 'A'; for (const [k, t0] of SHOTS) if (t >= t0) s = k; return s; };
  const hideAll = [noteRing, cup, marker, tape, tableFront, note, inkChip, oneChip, matchChip, chromaCard, chroma, tagPencil, pencilNote, tagSolvent, aboveChip, upChip,
    travelCard, furthest, idCard, photo, mixChip, mugW, funnel, tagOil, tagWat, tagTap, immChip, denseChip, openChip, closeChip, dish, dishFront, mag, tagFil, magChip,
    onlyCard, methCard, jobHeart, kavya, arm, inky, arthur, sandy, ...dyes, ...qMarks, ...levelLines, ...idMarks, ...broTicks, ...dyeChips, ...susp.map(s => s.g)];

  return t => {
    const sh = shotAt(t);
    hideAll.forEach(el => op(el, 0));
    op(shA, sh === 'A' ? 1 : 0); op(shB, 'BCG'.includes(sh) ? 1 : 0); op(shD, 'DF'.includes(sh) ? 1 : 0);
    conf.set(sh === 'E' || sh === 'J' ? 1 : 0, t); op(shH, 'HI'.includes(sh) ? 1 : 0); op(coverI, sh === 'I' && t >= at('leaving') - 0.1 ? 1 : 0);
    ltInky.set(sh === 'C' ? win(t, at('inky') + 0.3, at('inky') + 3.4, 0.3) : 0);
    guilty.set(0, 0, 0);
    let cam = [600, 375, 1];
    const show = (c, x, y, s, st) => { op(c, 1); tr(c, x, y, s); c.set(Object.assign({ t }, st)); };

    if (sh === 'A') {
      /* ---------- the crime scene ---------- */
      kit.upd(t);
      op(tableFront, 1);
      let km = 'shock', kl = -0.7;
      if (t > mid('crime', 0.62)) { km = 'annoyed'; kl = t > mid('crime', 0.78) ? -1 : -0.5; }
      show(kavya, 900, 520, 1.25, { talk: talk(t, 'kavya'), mood: km, look: kl });
      op(cup, 1); tr(cup, 520, 604, 1.4);
      bandPop(marker, t, mid('crime', 0.3), 640, 604, 1);
      const tp = P(t, mid('crime', 0.22), 0.5, easeOut); op(tape, tp > 0 ? 1 : 0); tr(tape, lerp(-900, 600, tp), 700, 1, -3);
      tr(tapeIn, 0, 0);
      const rp = P(t, mid('crime', 0.72), 0.4, pop);
      op(noteRing, clamp(rp * 2.5)); attr(noteRing, 'r', Math.max(1, 58 * rp + 4 * Math.sin(t * 6) * AMP * rp));
      cam = [520, 420, 1 + 0.05 * P(t, at('crime'), 6, linear)];
    } else if (sh === 'B' || sh === 'C' || sh === 'G') {
      op(note, sh === 'G' ? 0 : 1); tr(note, 300, 370, 1, -4);
      op(noteInk, sh === 'B' ? 1 : 1 - P(t, at('inky') - 0.05, 0.3, linear));
      if (sh === 'B') {
        /* ---------- the note and the suspects ---------- */
        bandPop(inkChip, t, mid('note', 0.18), 300, 600);
        susp.forEach((s, i) => {
          bandPop(s.g, t, mid('note', 0.42) + i * 0.22, s.x, 300);
          if (s.g.bowls) s.g.bowls.forEach((b, j) => { const w = Math.sin(t * 2.6 + j * 0.7) * j * AMP * (t > mid('note', 0.75) ? 2.2 : 0.8); tr(b, w, -112 - j * 24, 1, w * 0.5); });
        });
        const br = P(t, mid('note', 0.78), 0.35, pop); op(broRing, clamp(br * 2));
        let km = 'annoyed', kl = -0.8;
        if (t > mid('note', 0.4)) kl = 0.3;
        if (t > mid('note', 0.75)) { kl = 0.9; }
        if (t > end('note') - 0.1) { km = 'deadpan'; kl = 0; }
        show(kavya, 900, 660, 0.95, { talk: talk(t, 'kavya'), mood: km, look: kl });
        cam = [600, 375, 1 + (t > end('note') ? 0.06 * P(t, end('note'), 0.6, ease) : 0)];
        if (t > end('note')) cam = [880, 470, cam[2]];
      } else if (sh === 'C') {
        /* ---------- Inky leaps out of the note ---------- */
        const lp = P(t, at('inky') - 0.05, 0.75, easeOut);
        const ix = lerp(300, 700, lp), iy = lerp(370, 380, lp) - 190 * Math.sin(Math.PI * Math.min(1, lp)) * (1 - 0.3 * lp);
        const pose = t > end('inky') ? P(t, end('inky'), 0.25, pop) : 0;
        show(inky, ix, iy, Math.max(0.05, lerp(0.15, 1.05, lp)), { talk: talk(t, 'inky'), mood: pose > 0 ? 'smug' : 'happy', look: 0 });
        tr(inky, ix, iy, Math.max(0.05, lerp(0.15, 1.05, lp)), lerp(-30, 0, lp) + 8 * pose);
        bandPop(oneChip, t, mid('inky', 0.6), 930, 170);
        qMarks.forEach((q, i) => { const p = P(t, mid('inky', 0.82) + i * 0.15, 0.4, pop); op(q, clamp(p * 2.5)); tr(q, [880, 960, 830][i], [250, 330, 420][i] + 6 * Math.sin(t * 3 + i) * AMP, Math.max(0.01, p), [-10, 12, -4][i]); });
        show(kavya, 1060, 650, 0.9, { mood: t < mid('inky', 0.6) ? 'shock' : 'deadpan', look: -1 });
        cam = [600, 375, 1 + 0.03 * P(t, at('inky'), 4, linear)];
      } else {
        /* ---------- G: I KNEW it ---------- */
        op(bro, 1); tr(bro, 900, 300, 1.45);
        bro.bowls.forEach((b, j) => { const w = Math.sin(t * 2.6 + j * 0.7) * j * AMP * 1.2; tr(b, w, -112 - j * 24, 1, w * 0.5); });
        op(broRing, 0);
        show(kavya, 400, 500, 1.45, { talk: talk(t, 'kavya'), mood: 'smug', look: t < mid('knew', 0.3) ? 0.8 : 0 });
        op(arm, 1); tr(arm, 400, 500 + Math.sin(t * TAU * 0.5 + 8) * 2, 1.45);
        bandPop(matchChip, t, mid('knew', 0.35), 900, 640);
        const gp = P(t, mid('knew', 0.62), 0.28, linear); guilty.set(gp, 900, 300, -12);
        cam = [600, 375, 1 + 0.04 * P(t, at('knew'), 3.5, linear)];
      }
    } else if (sh === 'D' || sh === 'F') {
      const SH = sh === 'F';
      /* ---------- the chromatography ---------- */
      let p = 0;
      if (SH) p = 1;
      else p = P(t, mid('travel', 0.06), mid('travel', 0.78) - mid('travel', 0.06), ease);
      const chOn = SH ? 1 : P(t, at('spot') - 0.1, 0.3, linear);
      op(chroma, chOn);
      if (chOn) {
        chroma.set(p);
        chroma.lanes.forEach(({ black, ds }) => {
          const sp = SH ? 1 : P(t, mid('spot', 0.18), 0.4, easeOut);
          op(black, sp * (1 - clamp(p * 4)));
          ds.forEach(({ el }) => op(el, 0.9 * clamp((p - 0.02) * 5)));
        });
      }
      tr(chroma, CH[0], CH[1]);
      if (!SH) {
        // chroma: the card, Inky watching
        const cOn = t < at('spot') - 0.05 ? 1 : 0;
        if (cOn) {
          bandPop(chromaCard, t, at('chroma') - 0.05, 600, 320);
          show(inky, 1050, 615, 0.62, { mood: t > mid('chroma', 0.7) ? 'shock' : 'neutral', look: -0.8 });
        }
        // spot: labels
        if (t >= at('spot') - 0.05 && t < at('travel')) {
          op(tagPencil, P(t, mid('spot', 0.22), 0.3, linear)); op(pencilNote, P(t, mid('spot', 0.36), 0.3, linear));
          op(tagSolvent, P(t, mid('spot', 0.62), 0.3, linear));
          bandPop(aboveChip, t, mid('spot', 0.82), 870, 685);
        }
        // travel: the solvent rises, the card explains
        if (t >= at('travel') - 0.05 && t < at('split') - 0.1) {
          bandPop(upChip, t, mid('travel', 0.06), 410, 150);
          op(travelCard, P(t, mid('travel', 0.3), 0.3, linear)); tr(travelCard, 945, 560);
          op(tv1, 1); op(tv2, 1); op(tv3, P(t, mid('travel', 0.55), 0.3, linear)); op(tv4, P(t, mid('travel', 0.7), 0.3, linear));
          const fp = P(t, mid('travel', 0.86), 0.35, pop); op(furthest, clamp(fp * 2.5));
          attr(furthest, 'cx', laneX(0)); attr(furthest, 'cy', spotY(0.82)); attr(furthest, 'rx', 30 * Math.max(0.01, fp)); attr(furthest, 'ry', 26 * Math.max(0.01, fp));
        }
        // Arthur presents (spot, travel)
        if (t >= at('spot') - 0.05 && t < at('split') - 0.1) {
          let am = 'deadpan', al = -0.9;
          if (t < end('spot')) al = t < mid('spot', 0.5) ? -0.9 : -0.4;
          show(arthur, 1000, 300, 0.68, { talk: talk(t, 'arthur'), mood: am, look: al });
        }
        // split: Inky arrives and splits into three dyes
        if (t >= at('split') - 0.1) {
          const ent = P(t, at('split') - 0.1, 0.35, easeOut), spl = P(t, mid('split', 0.3), 0.45, easeOut);
          if (spl < 1) { show(inky, lerp(1320, 965, ent), 470, 0.82 * (1 - 0.6 * spl), { talk: talk(t, 'inky') * (t < mid('split', 0.36) ? 1 : 0), mood: 'shock', look: -0.6 }); op(inky, 1 - spl); }
          const POS = [[830, 500], [965, 440], [1100, 500]], CUE = [[0.36, 0.56], [0.56, 0.74], [0.74, 1.01]];
          dyes.forEach((d, i) => {
            if (spl <= 0) return;
            const on = t >= mid('split', CUE[i][0]) && t < mid('split', CUE[i][1]) ? 1 : 0;
            const lookAt = t > end('split') ? (i === 0 ? 1 : i === 2 ? -1 : (Math.sin(t * 2) > 0 ? 1 : -1)) : 0;
            show(d, lerp(965, POS[i][0], spl), lerp(470, POS[i][1], spl), 0.44, { talk: talk(t, 'inky') * on, mood: 'shock', look: lookAt });
            op(d, spl);
            bandPop(dyeChips[i], t, mid('split', CUE[i][0]), POS[i][0], POS[i][1] + 92);
          });
          cam = [600, 375, 1];
        }
      } else {
        /* ---------- F: the evidence lines up ---------- */
        show(arthur, 1000, 300, 0.68, { talk: talk(t, 'arthur'), mood: 'deadpan', look: t < mid('identify', 0.7) ? -0.9 : 0 });
        [0.82, 0.55, 0.3].forEach((h, i) => {
          const lp = P(t, mid('identify', 0.22) + i * 0.15, 0.6, ease);
          op(levelLines[i], lp > 0 ? 1 : 0); attr(levelLines[i], 'x2', lerp(laneX(0) - 30, laneX(3) + 40, lp));
          const tp = P(t, mid('identify', 0.38) + i * 0.15, 0.35, pop); op(broTicks[i], clamp(tp * 2.5)); tr(broTicks[i], laneX(3) + 46, spotY(h) - 4, Math.max(0.01, tp));
        });
        [[1, 0.62], [2, 0.7], [3, 0.8]].forEach(([lane, f], i) => { const q = P(t, mid('identify', f), 0.35, pop); op(idMarks[i], clamp(q * 2.5)); tr(idMarks[i], laneX(lane), CH[1] - 118, Math.max(0.01, q)); });
        op(idCard, P(t, mid('identify', 0.52), 0.3, linear)); tr(idCard, 945, 560);
      }
    } else if (sh === 'E') {
      /* ---------- Arthur's confessional ---------- */
      const push = P(t, end('thinky') - 0.1, 0.9, linear), gone = 1 - P(t, end('thinky') - 0.1, 0.25, linear);
      cam = [lerp(600, 520, push), lerp(375, 400, push), 1 + 0.03 * P(t, at('thinky'), 3, linear) + 0.14 * ease(push)];
      show(arthur, 430, 390, 1.5, { talk: talk(t, 'arthur'), mood: 'deadpan', look: t > mid('thinky', 0.15) && t < mid('thinky', 0.55) ? 0.6 : 0 });
      bandPop(photo, t, mid('thinky', 0.05), 880, 290, 1, 3);
      const POS = [[808, 296], [880, 270], [952, 296]];
      const pp = P(t, mid('thinky', 0.05), 0.45, pop);
      dyes.forEach((d, i) => { if (pp <= 0) return; show(d, POS[i][0], POS[i][1], 0.36, { mood: 'happy', look: i === 0 ? 0.6 : i === 2 ? -0.6 : 0 }); op(d, clamp(pp * 2.5)); });
      bandPop(mixChip, t, mid('thinky', 0.4), 880, 500);
      if (gone < 1) { op(photo, gone); op(mixChip, gone); dyes.forEach(d => op(d, gone)); }
      // the pause: a sip from the mug
      const sip = P(t, end('thinky') + 0.05, 0.35, ease) * (1 - P(t, end('thinky') + 0.9, 0.3, ease));
      op(mugW, 1); tr(mugW, lerp(668, 482, sip), lerp(650, 512, sip) + Math.sin(t * 1.4) * 2 * AMP, 1.1, -32 * sip);
      op(mug.steam, 0.4 + 0.3 * Math.sin(t * 3));
    } else if (sh === 'H' || sh === 'I') {
      if (sh === 'H') {
        /* ---------- oil and water, the separating funnel ---------- */
        op(funnel, 1);
        const p = P(t, mid('funnel', 0.3), mid('funnel', 0.8) - mid('funnel', 0.3), linear);
        funnel.set(p);
        const wTop = lerp(-40, 48, p), oTop = wTop - 90;
        const oy = (oTop + wTop) / 2, wy = (wTop + 50) / 2;
        tr(oilFace, 0, oy - 6); oilFace.set({ mood: t > mid('funnel', 0.85) ? 'smug' : 'annoyed', look: 0.9, blink: scBlink(t, 4) });
        tr(watFace, 0, wy - 8, Math.max(0.01, clamp((50 - wTop) / 50) * 0.9 + 0.1)); op(watFace, clamp((44 - wTop) / 30));
        watFace.set({ mood: p > 0.05 ? 'shock' : 'annoyed', look: -0.9, blink: scBlink(t, 9) });
        op(tagOil, P(t, mid('oil', 0.42), 0.3, linear) * (t < at('funnel') ? 1 : 0));
        op(tagWat, P(t, mid('oil', 0.5), 0.3, linear) * (t < at('funnel') ? 1 : 0));
        bandPop(immChip, t, mid('oil', 0.22), 900, 318);
        if (t < at('funnel')) bandPop(denseChip, t, mid('oil', 0.68), 560, 672);
        else {
          op(tagTap, P(t, mid('funnel', 0.12), 0.3, linear));
          if (t < mid('funnel', 0.8)) bandPop(openChip, t, mid('funnel', 0.2), 560, 672);
          else bandPop(closeChip, t, mid('funnel', 0.8), 560, 672);
        }
        show(arthur, 1050, 478, 0.68, { talk: talk(t, 'arthur'), mood: 'deadpan', look: -0.9 });
        cam = [600, 375, 1 + 0.03 * P(t, at('oil'), 12, linear)];
      } else {
        /* ---------- iron filings, a magnet, and Sandy ---------- */
        op(dish, 1); op(dishFront, 1);
        const down = P(t, mid('magnet', 0.3), 0.8, easeOut), up = P(t, mid('magnet', 0.78), 0.9, ease), away = P(t, at('leaving') - 0.1, 1.4, easeIn);
        const mx = 600 + 700 * away, my = lerp(110, 310, down) - 150 * up - 260 * away;
        op(mag, 1); tr(mag, mx, my, 1, -6 * away);
        filings.forEach((f, i) => {
          const jump = P(t, mid('magnet', 0.52) + f.d, 0.32, easeIn);
          const x = lerp(f.x0, mx + f.dx, jump), y = lerp(f.y0, my + 34 + f.dy, jump);
          op(f.el, 1); tr(f.el, x, y, 1, lerp(f.a0, 80 + f.dx * 0.2, jump));
        });
        op(tagFil, P(t, mid('magnet', 0.12), 0.3, linear) * (1 - P(t, mid('magnet', 0.5), 0.2, linear)));
        bandPop(magChip, t, mid('magnet', 0.62), 600, 672);
        const leave = t >= at('leaving') - 0.1;
        show(sandy, 600, 470, 0.72, { talk: talk(t, 'sandy'), mood: 'sad', look: leave ? 0.8 : (down > 0.5 && up < 1 ? 0 : -0.3) });
        op(sArm, leave ? 1 : 0); tr(sArm, 70, -8, 1, leave ? -20 + 28 * Math.sin(t * 6) * AMP : 0);
        if (leave) { op(magChip, 0); const push = P(t, at('leaving'), end('leaving') + 0.6 - at('leaving'), linear); cam = [600, lerp(400, 480, push), 1 + 0.35 * ease(push)]; }
      }
    } else {
      /* ---------- J: Arthur's confessional ---------- */
      let al = -0.6, am = 'deadpan', shrug = 0;
      if (t > end('job') - 0.4) al = 0;
      if (t >= at('job')) shrug = Math.sin(Math.PI * P(t, mid('job', 0.75), 0.5, linear));
      show(arthur, 910, 410 - 12 * shrug, 1.2, { talk: talk(t, 'arthur'), mood: am, look: al });
      if (t < at('method') - 0.05) {
        op(onlyCard, 1);
        op(oTitle, P(t, at('only'), 0.3, linear));
        metals.forEach((m, i) => bandPop(m, t, mid('only', [0.18, 0.34, 0.5, 0.64][i]), m.x, m.y));
        op(coRow, P(t, mid('only', 0.74), 0.3, linear));
        const so = P(t, mid('only', 0.86), 0.35, pop);
        op(smallO, clamp(so * 2.5)); tr(smallO, 410, 430, Math.max(0.01, so));
        attr(coO, 'font-size', 56 * (1 + 0.25 * so * (0.5 + 0.5 * Math.sin(t * 6))));
        op(coTick, P(t, mid('only', 0.86), 0.3, linear));
      } else {
        op(methCard, 1);
        op(mTitle, P(t, at('method') - 0.05, 0.3, linear));
        mRows.forEach(({ qT, chips }, i) => {
          const q0 = mid('method', [0.02, 0.3, 0.52][i]);
          op(qT, P(t, q0, 0.3, linear));
          chips.forEach((c, j) => bandPop(c, t, q0 + 0.5 + j * 0.25, c.x, c.y));
        });
        const hp = P(t, end('job') - 0.15, 0.45, pop);
        op(jobHeart, clamp(hp * 2.5)); tr(jobHeart, 772, 132, Math.max(0.01, hp * (1 + 0.06 * Math.sin(t * 6))));
        if (t >= at('job') - 0.1) cam = [900, 360, 1 + 0.05 * P(t, at('job') - 0.1, end('job') + 0.8 - at('job'), linear)];
      }
    }
    bandCam(cam[0], cam[1], cam[2]);
  };
});
