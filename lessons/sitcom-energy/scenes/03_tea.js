/* Scene 3: The bubble tea incident (conservation of energy).
   4 p.m., A TRAGEDY -> the cup on the table edge, Kavya's elbow creeping in -> freeze: Constance explains the
   gravitational potential store (live store bars) -> slow-motion fall, bars swap in step, Jules commentates ->
   Kavya: "No no no" -> freeze 1 cm above the floor, nearly all kinetic -> SPLAT -> Theo in the basement (lower
   third) -> split screen: sound + a tiny bit of heating -> the ledger: total before = total after -> the energy
   flow diagram -> the wind-up toy -> Kavya and her one pearl -> Constance: EXHIBIT A. */
scene('tea', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;

  /* ---------- local helpers (prefixed tea) ---------- */
  const on = (t, a, b) => (t >= a && t < b ? 1 : 0);          // hard sitcom cut
  const view = (el, k, fx, fy, sx, sy) => el.setAttribute('transform', `translate(${sx.toFixed(1)} ${sy.toFixed(1)}) scale(${k.toFixed(4)}) translate(${(-fx).toFixed(1)} ${(-fy).toFixed(1)})`);
  const popIn = (el, t, t0, x, y, s, r) => { const p = P(t, t0, 0.45, pop); op(el, clamp(p * 2.5)); tr(el, x, y, Math.max(0.01, (s || 1) * (0.6 + 0.4 * p)), r); return p; };
  const pill = (parent, text, o) => { o = o || {}; return chip(parent, text, { size: o.size || 30, fill: o.fill || 'rgba(10,27,39,0.9)', stroke: o.stroke || C.line, sw: 3, color: o.color || C.ink, weight: 700 }); };
  const SCOL = {}; EN_STORES.forEach(s => { SCOL[s.k] = s.col; });
  // a store box (store colour), with the store's icon in a badge on its top edge
  function teaBox(parent, w, h, col, title, sub, icon) {
    const g = G(parent);
    E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: 16, fill: col, stroke: SC_INK, 'stroke-width': 5 }, g);
    const lines = title.split('\n').length;
    const ty = sub ? -h / 2 + 46 : (lines > 1 ? -8 : 11);
    T(g, 0, ty, title, { size: 32, weight: 800, anchor: 'middle', fill: SC_INK, lh: 34 });
    if (sub) T(g, 0, h / 2 - 22, sub, { size: 26, weight: 700, anchor: 'middle', fill: '#2A1A22', font: FB });
    if (icon) {
      const b = G(g); tr(b, -w / 2 + 6, -h / 2 + 2);
      E('circle', { r: 30, fill: '#F4EBD3', stroke: SC_INK, 'stroke-width': 4 }, b);
      if (icon === 'rad') enPathIcon(b, 'rad', 0.42); else enStoreIcon(b, icon, 0.5);
    }
    return g;
  }
  // an inset picture-in-picture disc (drawn in the background layer, above the sets)
  function teaDisc(parent) {
    const g = G(parent), fills = { con: linGrad(EN_TINT.con[0], EN_TINT.con[1], true), jules: linGrad(EN_TINT.jules[0], EN_TINT.jules[1], true) };
    E('circle', { r: 100, fill: '#000000', opacity: 0.3, cx: 6, cy: 8 }, g);
    const face = E('circle', { r: 100, fill: fills.con, stroke: '#E2B33C', 'stroke-width': 6 }, g);
    g.tint = who => face.setAttribute('fill', fills[who]);
    return g;
  }
  // two hands (palms) for Kavya: on her cheeks for the "No no no" shot
  function teaHands(parent) {
    const g = G(parent);
    [-1, 1].forEach(sd => {
      const h = G(g); tr(h, sd * 80, -6, 1, sd * 12);
      E('path', { d: 'M-22,40 L-24,-18 Q-24,-44 -12,-46 L-10,-58 Q-6,-66 0,-58 L2,-62 Q8,-68 12,-58 L14,-50 Q22,-52 22,-40 L22,40 Q0,52 -22,40 Z', fill: '#B9784E', stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, h);
      E('path', { d: 'M-8,-40 L-8,-20 M4,-44 L4,-22', stroke: '#8A5434', 'stroke-width': 3, 'stroke-linecap': 'round' }, h);
    });
    return g;
  }
  // Kavya's arm held up, a single pearl between her fingers
  function teaPearlArm(parent) {
    const g = G(parent);
    E('path', { d: 'M86,70 Q140,40 150,-10', fill: 'none', stroke: '#2E7DD8', 'stroke-width': 40, 'stroke-linecap': 'round' }, g);
    E('path', { d: 'M86,70 Q140,40 150,-10', fill: 'none', stroke: SC_INK, 'stroke-width': 4, opacity: 0.25 }, g);
    E('path', { d: 'M150,-10 L160,-56', fill: 'none', stroke: '#B9784E', 'stroke-width': 30, 'stroke-linecap': 'round' }, g);
    E('circle', { cx: 162, cy: -66, r: 22, fill: '#B9784E', stroke: SC_INK, 'stroke-width': 4 }, g);
    E('circle', { cx: 166, cy: -94, r: 15, fill: '#2A1A22', stroke: '#000000', 'stroke-width': 2 }, g);
    E('circle', { cx: 161, cy: -99, r: 4, fill: '#FFFFFF', opacity: 0.8 }, g);
    E('path', { d: 'M150,-82 Q156,-96 168,-100 M176,-80 Q180,-92 176,-100', fill: 'none', stroke: '#B9784E', 'stroke-width': 9, 'stroke-linecap': 'round' }, g);
    return g;
  }
  // wind-up toy (a little clockwork mouse with a key); g.upd(t, walking)
  function teaToy(parent) {
    const g = G(parent), body = G(g);
    const feet = [0, 1].map(i => E('rect', { x: -8, y: -6, width: 22, height: 12, rx: 5, fill: '#5A606A', stroke: SC_INK, 'stroke-width': 3 }, body));
    E('path', { d: 'M-70,-10 Q-70,-70 0,-74 Q60,-72 74,-20 Q78,-6 66,-4 L-62,-4 Q-70,-4 -70,-10 Z', fill: ball('#7FD3FF', '#2E7DD8'), stroke: SC_INK, 'stroke-width': 4 }, body);
    E('circle', { cx: 40, cy: -60, r: 14, fill: '#FF8FB0', stroke: SC_INK, 'stroke-width': 3 }, body);
    E('circle', { cx: 52, cy: -34, r: 6, fill: SC_INK }, body);
    E('path', { d: 'M-70,-20 Q-100,-20 -104,-44', fill: 'none', stroke: SC_INK, 'stroke-width': 4, 'stroke-linecap': 'round' }, body);
    const key = G(body); tr(key, -16, -74);
    E('rect', { x: -4, y: -26, width: 8, height: 26, fill: '#E2B33C', stroke: SC_INK, 'stroke-width': 2 }, key);
    const bow = G(key); tr(bow, 0, -36);
    E('path', { d: 'M0,0 C-30,-26 -38,14 0,0 C30,-26 38,14 0,0 Z', fill: '#FFE45C', stroke: SC_INK, 'stroke-width': 3 }, bow);
    g.upd = (t, w) => {
      const s = Math.sin(t * 14 * AMP);
      tr(feet[0], -30 + 10 * s * w, 0); tr(feet[1], 22 - 10 * s * w, 0);
      tr(body, 0, -Math.abs(s) * 3 * w);
      attr(bow, 'transform', `translate(0 -36) scale(${(Math.cos(t * 9 * w * AMP) || 0.05).toFixed(3)} 1)`);
    };
    g.upd(0, 0);
    return g;
  }

  /* layers: sets, cast, props/labels, HUD */
  const Lbg = G(root), Lcast = G(root), Lfg = G(root), Lhud = G(root);

  /* vignette gradient (transparent centre, red edges) */
  const vgId = 'teaVig';
  const vg = E('radialGradient', { id: vgId, cx: '50%', cy: '50%', r: '70%' }, defs());
  E('stop', { offset: '0.55', 'stop-color': '#8A0000', 'stop-opacity': 0 }, vg);
  E('stop', { offset: '1', 'stop-color': '#8A0000', 'stop-opacity': 0.75 }, vg);

  /* ================= A: the flat at 4 p.m. ================= */
  const flatShot = G(Lbg), flatWrap = G(flatShot);
  const flat = enFlat(flatWrap);
  const cupA = enBubbleTea(flatWrap, 0.55); tr(cupA, 900, 578, 0.55);
  const fourChip = pill(Lfg, '4:00 p.m.', { size: 34, color: C.energy, stroke: C.energy });
  const tragedy = T(Lfg, 0, 0, 'A TRAGEDY.', { size: 100, weight: 700, anchor: 'middle', fill: '#FFFFFF', font: "Georgia, 'DejaVu Serif', 'Times New Roman', serif", ls: 6 });
  enOutlineText(tragedy, '#5A0A0A', 14);
  const noTxt = T(Lfg, 0, 0, 'NO NO NO!', { size: 76, weight: 800, anchor: 'middle', fill: '#FFE45C' });
  enOutlineText(noTxt, '#8A1A1A', 12);
  const kHands = teaHands(G(Lcast)); // re-parented into Kavya below
  const kArm = teaPearlArm(G(Lcast));

  /* ================= B: close-up of the table edge (the fall) ================= */
  const bShot = G(Lbg), bWrap = G(bShot);
  E('rect', { x: -200, y: -200, width: 1600, height: 1150, fill: linGrad('#D7EEE8', '#B9DCD3', true) }, bWrap);
  E('rect', { x: -200, y: 640, width: 1600, height: 310, fill: '#E9DCC6' }, bWrap);
  { let d = ''; for (let x = -120; x <= 1320; x += 160) d += `M${x},640 L${x + (x - 600) * 0.35},950 `; for (let y = 690; y < 950; y += 60) d += `M-200,${y} L1400,${y} `; E('path', { d, stroke: '#CDBEA4', 'stroke-width': 3 }, bWrap); }
  E('rect', { x: -200, y: 628, width: 1600, height: 14, fill: '#A8C4BC' }, bWrap);
  const bClock = G(bWrap); tr(bClock, 140, 170);
  E('circle', { r: 46, fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 5 }, bClock);
  E('line', { x1: 0, y1: 0, x2: 18, y2: 10, stroke: SC_INK, 'stroke-width': 6, 'stroke-linecap': 'round' }, bClock);
  E('line', { x1: 0, y1: 0, x2: 0, y2: -34, stroke: SC_INK, 'stroke-width': 4, 'stroke-linecap': 'round' }, bClock);
  E('rect', { x: -60, y: 300, width: 740, height: 32, rx: 6, fill: '#9C6B3E', stroke: '#6B4423', 'stroke-width': 4 }, bWrap);
  E('rect', { x: 604, y: 332, width: 24, height: 300, fill: '#6B4423' }, bWrap);
  E('rect', { x: 40, y: 332, width: 24, height: 300, fill: '#6B4423' }, bWrap);
  const splat = enSplat(bWrap, 1.3); tr(splat, 720, 640);
  const speed = G(bWrap);
  const speedL = [-30, -8, 14, 34].map(x => E('line', { x1: x, y1: 0, x2: x, y2: 0, stroke: '#FFFFFF', 'stroke-width': 6, 'stroke-linecap': 'round' }, speed));
  const cupG = G(bWrap); tr(enBubbleTea(cupG, 1), 0, 75);       // origin at the cup's centre
  const elbow = G(bWrap);
  E('path', { d: 'M-420,-200 Q-160,-110 -24,-34', fill: 'none', stroke: '#2E7DD8', 'stroke-width': 76, 'stroke-linecap': 'round' }, elbow);
  E('path', { d: 'M-24,-30 L-420,-30', fill: 'none', stroke: '#B9784E', 'stroke-width': 54, 'stroke-linecap': 'round' }, elbow);
  E('path', { d: 'M-24,-30 L-420,-30', fill: 'none', stroke: SC_INK, 'stroke-width': 4, opacity: 0.2 }, elbow);
  E('circle', { cx: -26, cy: -32, r: 30, fill: '#A86A42', stroke: SC_INK, 'stroke-width': 4 }, elbow);
  E('path', { d: 'M-140,-96 L-50,-56', stroke: '#1E5FB0', 'stroke-width': 8, 'stroke-linecap': 'round' }, elbow);
  const vig = E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: `url(#${vgId})` }, bShot);
  const shake = (t, t0) => { const q = P(t, t0, 0.5, linear); return q > 0 && q < 1 ? Math.sin(t * 70) * 14 * (1 - q) * AMP : 0; };

  /* ================= basement (Theo) ================= */
  const basShot = G(Lbg), basWrap = G(basShot);
  const bas = enBasement(basWrap);

  /* ================= office (ledger, diagrams) ================= */
  const offShot = G(Lbg);
  enOffice(offShot);
  const offDim = E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#06110F', opacity: 0.55 }, offShot);

  /* ================= confessional ================= */
  const conf = enConf(Lbg, 'con');

  /* inset discs (above the sets) */
  const disc = teaDisc(Lbg);

  /* split-screen clip paths */
  const cpL = E('clipPath', { id: 'teaClipL' }, defs()); E('rect', { x: 0, y: 0, width: 597, height: 750 }, cpL);
  const cpR = E('clipPath', { id: 'teaClipR' }, defs()); E('rect', { x: 603, y: 0, width: 597, height: 750 }, cpR);
  const divider = E('rect', { x: 594, y: 0, width: 12, height: 750, fill: '#FFFFFF' }, Lhud);

  /* ================= the cast ================= */
  const kav = cast(Lcast, 'kavya');
  const con = cast(Lcast, 'con');
  const jul = cast(Lcast, 'jules');
  const theo = cast(Lcast, 'theo');
  kav.firstChild.appendChild(kHands); kav.firstChild.appendChild(kArm);
  const ltTheo = scLowerThird(Lhud, 'THEO', 'Thermal store. The basement.');

  /* ================= B labels: height, store bars, freeze/slow-mo tags ================= */
  const hArr = G(Lfg);
  const hUp = arrow(hArr, 730, 444, 730, 306, { color: '#2E5BB8', width: 6 });
  const hDn = arrow(hArr, 730, 496, 730, 634, { color: '#2E5BB8', width: 6 });
  const hChip = chip(hArr, 'high up', { size: 30, fill: '#5B8DEF', color: '#FFFFFF', stroke: SC_INK, sw: 3 }); tr(hChip, 730, 470);
  const bars = G(Lfg);
  card(bars, 810, 140, 360, 340, { fill: 'rgba(10,27,39,0.9)', stroke: C.line, sw: 3 });
  T(bars, 990, 184, "the cup's energy", { size: 28, weight: 700, anchor: 'middle', fill: C.muted });
  const ROWS = [['gravitational potential', SCOL.gravitational, 236], ['kinetic', SCOL.kinetic, 324], ['thermal + sound', SCOL.thermal, 412]];
  const rowG = [], barEl = [];
  ROWS.forEach(([lab, col, y]) => {
    const g = G(bars); rowG.push(g);
    T(g, 830, y, lab, { size: 27, weight: 800, fill: col });
    E('rect', { x: 830, y: y + 12, width: 320, height: 34, rx: 17, fill: '#0B2230', stroke: C.line, 'stroke-width': 2 }, g);
    barEl.push(E('rect', { x: 830, y: y + 12, width: 0, height: 34, rx: 17, fill: col }, g));
  });
  const setBar = (i, v) => { v = clamp(v); attr(barEl[i], 'width', v < 0.01 ? 0 : Math.max(34, 320 * v)); };
  const nearly = pill(Lfg, 'nearly all kinetic', { size: 30, color: SCOL.kinetic, stroke: SCOL.kinetic });
  const cm = pill(Lfg, '1 cm above the floor', { size: 28 });
  const tagFreeze = chip(Lhud, 'FREEZE FRAME', { size: 28, fill: '#FFFFFF', color: SC_INK, stroke: SC_INK, sw: 3 });
  const tagSlow = chip(Lhud, 'SLOW MOTION', { size: 28, fill: '#E8424F', color: '#FFFFFF', stroke: '#FFFFFF', sw: 3 });
  const edgeChip = pill(Lfg, 'the very edge', { size: 28, color: '#FF8A94', stroke: '#FF8A94' });
  const burst = G(Lfg);
  { let d = ''; for (let i = 0; i < 22; i++) { const a = i / 22 * TAU, r = i % 2 ? 78 : 132; d += (i ? 'L' : 'M') + (Math.cos(a) * r * 1.35).toFixed(1) + ',' + (Math.sin(a) * r).toFixed(1); } E('path', { d: d + 'Z', fill: '#FFE45C', stroke: '#C9935A', 'stroke-width': 7, 'stroke-linejoin': 'round' }, burst); }
  T(burst, 0, 22, 'SPLAT!', { size: 62, weight: 800, anchor: 'middle', fill: '#8A4A1A' });

  /* ================= theo: dots dropping in ================= */

  /* ================= split: sound + heating ================= */
  const spR = G(Lfg);
  const rings = [0, 1, 2].map(() => E('circle', { r: 50, fill: 'none', stroke: '#B48CFF', 'stroke-width': 7 }, spR));
  const spSound = chip(spR, 'sound', { size: 36, fill: '#B48CFF', color: SC_INK, stroke: SC_INK, sw: 3 });
  const spHeat = G(spR);
  const hws = [[800, 610], [900, 596], [1000, 610]].map(([x, y]) => { const h = heatWaves(spHeat, { n: 3, h: 90, spacing: 24, width: 6, color: '#FF8A3D' }); tr(h, x, y); return h; });
  const spTherm = chip(spR, 'thermal', { size: 36, fill: SCOL.thermal, color: SC_INK, stroke: SC_INK, sw: 3 });
  const spWhat = T(spR, 0, 0, 'floor, tea, pearls', { size: 28, weight: 700, anchor: 'middle', fill: '#5A2A10' });
  const spThm = G(spR); const thm = thermometer(spThm, 170, C.heat);
  const spTiny = pill(spR, 'a tiny bit warmer', { size: 28, color: '#FFB27A', stroke: '#FFB27A' });

  /* ================= total: the ledger ================= */
  const led = G(Lfg);
  enBoard(led, 860, 540, 'LEDGER: THE BUBBLE TEA');
  const ledHead = T(led, 0, -150, '**TOTAL BEFORE** = **TOTAL AFTER**', { size: 40, weight: 600, anchor: 'middle', fill: SC_INK, boldFill: '#1C5C4A' });
  const BW = 130, BH = 210, BY = -100;
  E('rect', { x: -230 - BW / 2, y: BY, width: BW, height: BH, rx: 8, fill: SCOL.gravitational, stroke: SC_INK, 'stroke-width': 4 }, led);
  const before1 = T(led, -230, BY + BH + 36, 'gravitational potential', { size: 26, weight: 800, anchor: 'middle', fill: '#2E5BB8' });
  T(led, -230, BY + BH / 2 + 14, '4 J', { size: 40, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  T(led, 0, BY + BH / 2 + 22, '=', { size: 90, weight: 800, anchor: 'middle', fill: '#1C5C4A' });
  const aftK = G(led);
  E('rect', { x: 230 - BW / 2, y: BY, width: BW, height: BH, rx: 8, fill: SCOL.kinetic, stroke: SC_INK, 'stroke-width': 4 }, aftK);
  T(aftK, 230, BY + BH + 36, 'kinetic (falling)', { size: 26, weight: 800, anchor: 'middle', fill: '#B5372D' });
  const aftT = G(led);
  E('rect', { x: 230 - BW / 2, y: BY, width: BW, height: BH, rx: 8, fill: SCOL.thermal, stroke: SC_INK, 'stroke-width': 4 }, aftT);
  E('rect', { x: 230 - BW / 2, y: BY, width: BW, height: 26, rx: 8, fill: '#B48CFF', stroke: SC_INK, 'stroke-width': 4 }, aftT);
  T(aftT, 230, BY + BH + 36, 'thermal + sound', { size: 26, weight: 800, anchor: 'middle', fill: '#C25516' });
  T(led, 230, BY + BH / 2 + 14, '4 J', { size: 40, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  const tally = T(led, 380, BY + 70, 'IIII', { size: 44, weight: 700, anchor: 'middle', fill: '#5A6A7A', ls: 4 });
  const tallyStrike = E('line', { x1: 344, y1: BY + 40, x2: 416, y2: BY + 66, stroke: '#5A6A7A', 'stroke-width': 5, 'stroke-linecap': 'round' }, led);
  const ledTick = G(led); tr(ledTick, 250, 214);
  tr(tick(ledTick, 22), -60, 0);
  T(ledTick, -26, 12, 'counted', { size: 34, weight: 800, fill: '#1E9E5A' });
  const pencil = G(led);
  E('path', { d: 'M0,0 L-14,-34 L60,-110 L84,-86 L10,-10 Z', fill: '#F2C14E', stroke: SC_INK, 'stroke-width': 3, 'stroke-linejoin': 'round' }, pencil);
  E('path', { d: 'M0,0 L-14,-34 L-4,-24 Z', fill: SC_INK }, pencil);

  /* ================= flow: the energy flow diagram ================= */
  const flow = G(Lfg);
  const flTitle = T(flow, 430, 196, 'ENERGY FLOW DIAGRAM', { size: 42, weight: 800, anchor: 'middle', fill: C.energy, ls: 2 });
  const fGP = teaBox(flow, 270, 140, SCOL.gravitational, 'gravitational\npotential', null, 'gravitational'); tr(fGP, 250, 380);
  const fK = teaBox(flow, 220, 110, SCOL.kinetic, 'kinetic', null, 'kinetic'); tr(fK, 600, 380);
  const fT = teaBox(flow, 270, 130, SCOL.thermal, 'thermal', 'floor, tea, pearls', 'thermal'); tr(fT, 970, 270);
  const fS = teaBox(flow, 270, 130, '#B48CFF', 'sound', 'carried by waves', 'rad'); tr(fS, 970, 520);
  const fA1 = arrow(flow, 392, 380, 482, 380, { color: '#FFFFFF', width: 8 });
  const fA2 = arrow(flow, 716, 350, 826, 290, { color: '#FFFFFF', width: 8 });
  const fA3 = arrow(flow, 716, 410, 826, 500, { color: '#FFFFFF', width: 8 });
  const fPlus = T(flow, 970, 410, '+', { size: 60, weight: 800, anchor: 'middle', fill: '#FFFFFF' });

  /* ================= toy: the wind-up toy ================= */
  const toyD = G(Lfg);
  const tyTitle = T(toyD, 300, 196, 'WIND-UP TOY', { size: 42, weight: 800, anchor: 'middle', fill: C.energy, ls: 2 });
  const yE = teaBox(toyD, 240, 130, SCOL.elastic, 'elastic', '(the spring)', 'elastic'); tr(yE, 220, 320);
  const yK = teaBox(toyD, 230, 100, SCOL.kinetic, 'kinetic', null, 'kinetic'); tr(yK, 620, 280);
  const yT = teaBox(toyD, 230, 110, SCOL.thermal, 'thermal', '(friction)', 'thermal'); tr(yT, 620, 430);
  const yA1 = arrow(toyD, 346, 300, 496, 280, { color: '#FFFFFF', width: 9 });
  const yA2 = arrow(toyD, 346, 345, 496, 425, { color: '#FFFFFF', width: 4 });
  const yBit = T(toyD, 440, 420, 'a bit', { size: 26, weight: 700, anchor: 'end', fill: '#FFB27A' });
  const toy = teaToy(Lfg);
  const floorLine = E('rect', { x: 60, y: 636, width: 1080, height: 8, rx: 4, fill: '#5A4A3A' }, toyD);

  /* ================= confessional: EXHIBIT A ================= */
  const exh = G(Lfg);
  E('path', { d: 'M-120,-140 L120,-140 L130,150 L-130,150 Z', fill: 'rgba(230,245,255,0.28)', stroke: '#DDEEFF', 'stroke-width': 5, 'stroke-linejoin': 'round' }, exh);
  E('rect', { x: -122, y: -140, width: 244, height: 22, fill: '#E8424F', stroke: '#9C1F2A', 'stroke-width': 3 }, exh);
  E('circle', { cx: 0, cy: 40, r: 30, fill: '#2A1A22', stroke: '#000000', 'stroke-width': 3 }, exh);
  E('circle', { cx: -9, cy: 30, r: 8, fill: '#FFFFFF', opacity: 0.7 }, exh);
  const exTag = G(exh); tr(exTag, 0, -70, 1, -4);
  E('rect', { x: -110, y: -32, width: 220, height: 64, rx: 6, fill: '#FFF7C2', stroke: '#8A6D00', 'stroke-width': 3 }, exTag);
  T(exTag, 0, 13, 'EXHIBIT A', { size: 38, weight: 800, anchor: 'middle', fill: '#8A1A1A', ls: 2 });
  const exNote = pill(Lfg, 'one pearl. energetically: fine.', { size: 28, color: C.good, stroke: C.good });

  /* ================= cut list ================= */
  const cB = at('cup') - 0.1, cK = at('no') - 0.12, cB2 = at('lands') - 0.12, cTh = at('theo') - 0.1, cSp = at('splat') - 0.1,
    cTo = at('total') - 0.1, cFl = at('flow') - 0.1, cTy = at('toy') - 0.1, cPe = at('pearls') - 0.1, cCf = at('thpearls') - 0.1;
  const tf0 = at('falling') + 0.1, tf1 = end('no') + 0.3;            // the slow-motion fall
  const sT = mid('lands', 0.84);                                        // SPLAT

  return t => {
    const sA = on(t, -1, cB), sB = on(t, cB, cK) || on(t, cB2, cTh), sK = on(t, cK, cB2), sTh = on(t, cTh, cSp), sSp = on(t, cSp, cTo),
      sTo = on(t, cTo, cFl), sFl = on(t, cFl, cTy), sTy = on(t, cTy, cPe), sPe = on(t, cPe, cCf), sCf = on(t, cCf, 1e9);
    let kavOn = 0, conOn = 0, julOn = 0, theoOn = 0;

    // fall state (pure function of t)
    const fp = clamp((t - tf0) / (tf1 - tf0)), hfrac = 1 - 0.97 * fp * fp, sp = P(t, sT, 0.5, linear);
    const gp = hfrac * (1 - sp), ke = (1 - hfrac) * (1 - sp), ts = sp;

    /* ---------- A: the flat, 4 p.m. ---------- */
    op(flatShot, sA || sK); op(fourChip, 0); op(tragedy, 0); op(noTxt, 0);
    if (sA) {
      flat.upd(t, 1); flat.clock(16 + t / 900);
      const push = P(t, at('four'), cB - at('four'), linear);
      view(flatWrap, 1 + 0.18 * push, 880, 520, 880 - 60 * push, 520 + 20 * push);
      op(cupA, 1);
      kavOn = 1; op(kav, 1); tr(kav, 420 - 40 * push, 470 + 10 * push, 1.0 + 0.18 * push);
      kav.set({ t, talk: 0, mood: 'happy', look: 0.6 });
      popIn(fourChip, t, at('four') + 0.05, 1000, 470);
      const tp = P(t, mid('four', 0.45), 0.6, easeOut);
      op(tragedy, tp); tr(tragedy, 600, 290, 0.92 + 0.12 * P(t, mid('four', 0.45), 3, linear));
    }
    /* ---------- K: Kavya close-up, slow motion "No no no" ---------- */
    if (sK) {
      flat.upd(t, 1); flat.clock(16);
      const push = P(t, cK, cB2 - cK, linear);
      view(flatWrap, 1.5 + 0.1 * push, 420, 470, 560, 430);
      op(cupA, 0);
      kavOn = 1; op(kav, 1); tr(kav, 520, 450, 1.6 + 0.1 * push, Math.sin(t * 3) * 2 * AMP);
      kav.set({ t, talk: scTalk(S, t, 'kavya') * 0.6, mood: 'shock', look: 0.7 });
      const np = P(t, at('no') + 0.05, 0.5, pop);
      op(noTxt, clamp(np * 3)); tr(noTxt, 920, 260, Math.max(0.01, (0.6 + 0.4 * np) * (1 + 0.15 * push)), -8 + 4 * Math.sin(t * 2));
    }
    op(kHands, sK); op(kArm, sPe);

    /* ---------- B: the table edge, the fall, the splat ---------- */
    op(bShot, sB || sPe ? 1 : sSp);
    op(bars, 0); op(hArr, 0); op(nearly, 0); op(cm, 0); op(tagFreeze, 0); op(tagSlow, 0); op(edgeChip, 0); op(burst, 0);
    op(disc, 0);
    bShot.removeAttribute('clip-path');
    if (sB) {
      const k0 = t < cK ? 1 + 0.05 * P(t, cB, at('before') - cB, linear) : 1.05;
      const sh = shake(t, sT);
      view(bWrap, k0, 600, 420, 600 + sh, 420 + sh * 0.6);
      // the cup
      let cx = 650, cy = 225, rot = 0;
      if (t < tf0) {
        const nudge = P(t, mid('cup', 0.82), 0.5, easeOut);
        rot = 7 * nudge + (t < at('before') ? Math.sin(t * 9) * 1.5 * nudge * AMP : 0);
        cx = 650 + 6 * nudge;
      } else {
        cx = lerp(656, 740, fp); rot = 7 + 23 * fp;
        cy = 640 - hfrac * 340 - 75 - 6 * fp;
      }
      op(cupG, t < sT ? 1 : 0); tr(cupG, cx, cy, 1, rot);
      // speed lines grow with speed
      const spd = t >= tf0 && t < sT ? fp : 0;
      op(speed, spd > 0.05 ? 1 : 0); tr(speed, cx, cy - 110);
      speedL.forEach((l, i) => { attr(l, 'y2', -(30 + 160 * spd) * (0.6 + 0.4 * ((i * 7) % 3) / 2)); l.style.opacity = (0.4 + 0.5 * spd).toFixed(2); });
      splat.set(P(t, sT, 0.45, easeOut)); op(splat, t >= sT ? 1 : 0);
      // the elbow creeps in
      const ep = P(t, at('cup') + 0.4, end('cup') - at('cup') - 0.2, ease);
      op(elbow, t < cB2 ? 1 : 0); tr(elbow, lerp(-160, 598, ep), 300);
      // ominous red vignette
      op(vig, t < cK ? 0.3 + 0.7 * P(t, at('cup'), 4, linear) : 0.5 * (1 - P(t, sT, 1.2, linear)));
      // the edge, then the height and the store bars
      const ec = win(t, mid('cup', 0.15), mid('cup', 0.75), 0.25);
      op(edgeChip, ec); if (ec) tr(edgeChip, 900, 250);
      const hp = t < tf0 ? P(t, mid('before', 0.55), 0.4, pop) : 0;
      op(hArr, clamp(hp * 3)); if (hp) { hUp.set(P(t, mid('before', 0.55), 0.5, ease)); hDn.set(P(t, mid('before', 0.55), 0.5, ease)); }
      const bp = P(t, mid('before', 0.08), 0.4, pop);
      op(bars, clamp(bp * 3)); tr(bars, 990 * (1 - Math.max(0.01, 0.9 + 0.1 * bp)), 300 * (1 - Math.max(0.01, 0.9 + 0.1 * bp)), Math.max(0.01, 0.9 + 0.1 * bp));
      op(rowG[0], 1); op(rowG[1], P(t, mid('before', 0.4), 0.3, linear)); op(rowG[2], t < cB2 ? 0.3 : 1);
      setBar(0, gp); setBar(1, ke); setBar(2, ts);
      // the third bar pulses when it fills
      // freeze / slow-mo tags
      const frozen = (t >= at('before') - 0.1 && t < tf0) || (t >= cB2 && t < sT);
      op(tagFreeze, frozen ? 1 : 0); tr(tagFreeze, 1060, 64);
      op(tagSlow, t >= tf0 && t < cK ? 1 : 0); tr(tagSlow, 1060, 64);
      // insets: Constance (before, lands), Jules (falling)
      const inCon = (t >= at('before') - 0.1 && t < at('falling') - 0.1) || (t >= cB2);
      const inJul = t >= at('falling') - 0.1 && t < cK;
      op(disc, inCon || inJul ? 1 : 0); tr(disc, 150, 520); disc.tint(inJul ? 'jules' : 'con');
      if (inCon) {
        conOn = 1; op(con, 1); tr(con, 152, 534, 0.56);
        const mood = t > sT + 0.3 ? 'deadpan' : (t > mid('lands', 0.4) && t < sT ? 'smug' : 'deadpan');
        con.set({ t, talk: scTalk(S, t, 'con'), mood, look: 0.6 });
      }
      if (inJul) {
        julOn = 1; op(jul, 1); tr(jul, 150, 528, 0.55);
        jul.set({ t, talk: scTalk(S, t, 'jules'), mood: t > mid('falling', 0.7) ? 'shock' : 'happy', look: 0.7, arms: 1 });
      }
      // lands: 1 cm, nearly all kinetic, SPLAT
      const cc = t >= cB2 ? win(t, cB2 + 0.2, sT, 0.2) : 0;
      op(cm, cc); if (cc) tr(cm, 440, 600);
      const nc = t >= cB2 ? P(t, mid('lands', 0.42), 0.4, pop) * (1 - P(t, sT, 0.2, linear)) : 0;
      op(nearly, clamp(nc * 3)); if (nc) tr(nearly, 990, 520, Math.max(0.01, 0.7 + 0.3 * nc));
      const bu = P(t, sT, 0.35, pop) * (1 - P(t, sT + 1.6, 0.3, linear));
      op(burst, clamp(bu * 3)); if (bu) tr(burst, 560, 470, Math.max(0.01, 0.4 + 0.6 * bu), -8);
    }

    /* ---------- pearls: Kavya on the floor by the splat ---------- */
    if (sPe) {
      view(bWrap, 1.06, 600, 420, 600, 420);
      op(cupG, 0); op(speed, 0); op(elbow, 0); op(vig, 0); splat.set(1); op(splat, 1);
      kavOn = 1; op(kav, 1); tr(kav, 400, 524, 1.2);
      kav.set({ t, talk: scTalk(S, t, 'kavya'), mood: 'sad', look: t < mid('pearls', 0.5) ? 0.8 : 0 });
    }

    /* ---------- theo: the basement ---------- */
    op(basShot, sTh || sSp);
    basShot.removeAttribute('clip-path');
    if (sTh) {
      bas.upd(t);
      view(basWrap, 1 + 0.03 * P(t, cTh, cSp - cTh, linear), 560, 420, 560, 420);
      theoOn = 1; op(theo, 1); tr(theo, 560, 440, 1.4);
      theo.set({ t, talk: scTalk(S, t, 'theo'), mood: t > mid('theo', 0.62) && t < mid('theo', 0.85) ? 'neutral' : 'sad', look: t < mid('theo', 0.25) ? 0 : 0.2, glow: 1 });
    }
    ltTheo.set(sTh ? win(t, at('theo') + 0.1, at('theo') + 3.4, 0.3) : 0);

    /* ---------- split screen: sound + heating ---------- */
    op(divider, sSp); op(spR, sSp);
    if (sSp) {
      bas.upd(t);
      basShot.setAttribute('clip-path', 'url(#teaClipL)');
      view(basWrap, 1, 560, 420, 720, 420);
      theoOn = 1; op(theo, 1); tr(theo, 300, 450, 1.1);
      theo.set({ t, talk: scTalk(S, t, 'theo'), mood: 'sad', look: 0.6, glow: 1 });
      bShot.setAttribute('clip-path', 'url(#teaClipR)');
      view(bWrap, 1, 720, 640, 900, 640);
      op(cupG, 0); op(speed, 0); op(elbow, 0); op(vig, 0); splat.set(1); op(splat, 1);
      // sound: rings travel out from the splat
      const s0 = at('splat') + 0.1;
      rings.forEach((r, i) => {
        const age = t - s0 - i * 0.55;
        if (age < 0 || t > mid('splat', 0.55)) { op(r, 0); return; }
        const f = (age * 0.7) % 1;
        op(r, 0.9 * (1 - f)); attr(r, 'cx', 900); attr(r, 'cy', 615); attr(r, 'r', 40 + f * 250);
      });
      popIn(spSound, t, mid('splat', 0.08), 780, 200);
      // heating: floor, tea, pearls
      const hp = P(t, mid('splat', 0.38), 0.6, linear);
      op(spHeat, hp); hws.forEach(h => h.upd(t));
      popIn(spTherm, t, mid('splat', 0.4), 1040, 300);
      op(spWhat, P(t, mid('splat', 0.5), 0.4, linear)); tr(spWhat, 1040, 362);
      const tp = P(t, mid('splat', 0.72), 0.4, pop);
      op(spThm, clamp(tp * 3)); tr(spThm, 1140, 560);
      thm.set(0.22 + 0.04 * P(t, mid('splat', 0.78), 1.2, ease));
      popIn(spTiny, t, mid('splat', 0.82), 960, 470);
    }

    /* ---------- office: total, flow, toy ---------- */
    op(offShot, sTo || sFl || sTy);
    op(led, 0); op(flow, 0); op(toyD, 0); op(toy, 0);
    if (sTo) {
      op(offDim, 0.45);
      const lp = P(t, at('total') - 0.05, 0.45, pop);
      op(led, clamp(lp * 2.5)); tr(led, 700, 400, Math.max(0.01, 0.85 + 0.15 * lp), -1);
      op(ledHead, P(t, mid('total', 0.05), 0.3, linear));
      const swap = P(t, mid('total', 0.42), 0.5, linear);
      op(aftK, P(t, mid('total', 0.25), 0.3, linear) * (1 - swap)); op(aftT, swap);
      op(tally, P(t, mid('total', 0.68), 0.2, linear)); op(tallyStrike, P(t, mid('total', 0.76), 0.2, linear));
      const tk = P(t, mid('total', 0.86), 0.35, pop);
      op(ledTick, clamp(tk * 3));
      // pencil follows the tally, then the tick
      const pp = P(t, mid('total', 0.62), 0.9, ease);
      op(pencil, win(t, mid('total', 0.6), end('total') + 0.3, 0.2));
      tr(pencil, lerp(350, 420, pp) + 6 * Math.sin(t * 20) * (pp < 1 ? AMP : 0), lerp(-40, 150, pp));
      conOn = 1; op(con, 1); tr(con, 140, 470, 0.9);
      con.set({ t, talk: scTalk(S, t, 'con'), mood: t > mid('total', 0.85) ? 'smug' : 'deadpan', look: 0.7 });
    }
    if (sFl) {
      op(offDim, 0.72);
      op(flow, 1);
      op(flTitle, P(t, at('flow') - 0.05, 0.3, linear));
      popIn(fGP, t, mid('flow', 0.32), 250, 380);
      fA1.set(P(t, mid('flow', 0.47), 0.35, ease));
      popIn(fK, t, mid('flow', 0.5), 600, 380);
      fA2.set(P(t, mid('flow', 0.64), 0.35, ease));
      popIn(fT, t, mid('flow', 0.66), 970, 270);
      op(fPlus, P(t, mid('flow', 0.8), 0.25, linear));
      fA3.set(P(t, mid('flow', 0.8), 0.35, ease));
      popIn(fS, t, mid('flow', 0.84), 970, 520);
      conOn = 1; op(con, 1); tr(con, 110, 600, 0.55);
      con.set({ t, talk: scTalk(S, t, 'con'), mood: 'deadpan', look: 0.8 });
    }
    if (sTy) {
      op(offDim, 0.72);
      op(toyD, 1); op(toy, 1);
      op(tyTitle, P(t, at('toy') - 0.05, 0.3, linear));
      popIn(yE, t, mid('toy', 0.28), 220, 320);
      yA1.set(P(t, mid('toy', 0.46), 0.35, ease));
      popIn(yK, t, mid('toy', 0.48), 620, 280);
      yA2.set(P(t, mid('toy', 0.68), 0.35, ease)); op(yBit, P(t, mid('toy', 0.72), 0.3, linear));
      popIn(yT, t, mid('toy', 0.7), 620, 430);
      const wp = P(t, at('toy') + 0.2, end('toy') - at('toy') + 0.2, linear);
      tr(toy, lerp(220, 820, wp), 652, 1.2);
      toy.upd(t, wp < 1 ? 1 : 0);
      julOn = 1; op(jul, 1); tr(jul, 990, 340, 1.0);
      jul.set({ t, talk: scTalk(S, t, 'jules'), mood: 'happy', look: t < mid('toy', 0.5) ? -0.5 : -0.9, arms: 1 });
    }

    /* ---------- confessional: EXHIBIT A ---------- */
    conf.set(sCf, t); op(exh, 0); op(exNote, 0);
    if (sCf) {
      const push = P(t, cCf, S.D - cCf, linear);
      const k = 1 + 0.06 * push;
      conf.setAttribute('transform', `translate(430 400) scale(${k.toFixed(4)}) translate(-430 -400)`);
      conOn = 1; op(con, 1); tr(con, 330, 410 + 6 * push, 1.5 * k);
      con.set({ t, talk: scTalk(S, t, 'con'), mood: 'deadpan', look: t > mid('thpearls', 0.3) && t < end('thpearls') ? 0.5 : 0 });
      popIn(exh, t, mid('thpearls', 0.1), 860, 380, 1, 4);
      popIn(exNote, t, mid('thpearls', 0.55), 860, 600);
    }

    if (!kavOn) op(kav, 0);
    if (!conOn) op(con, 0);
    if (!julOn) op(jul, 0);
    if (!theoOn) op(theo, 0);
  };
});
