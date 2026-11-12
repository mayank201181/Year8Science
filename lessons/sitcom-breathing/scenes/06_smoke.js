/* Scene 6: Security training video (smoking). The whole chapter plays through the lhVHS overlay.
   Beats: Dennis at a pull-down screen ("Kavya: 12 · does not smoke"; WANTED poster) -> Smokey slides up to security
   with a suitcase and three luggage tags (TAR, CARBON MONOXIDE, NICOTINE) -> tar coats the airway lining -> carcinogen
   hazard sticker -> cilia droop and stop, dust piles up: smoker's cough -> "OUT OF ORDER" on the mucus escalator ->
   carbon monoxide takes the haemoglobin seats in the red-blood-cell taxis -> Ozzie left at the kerb, oxygen carried
   falls -> Smokey leans into the lens: nicotine, addictive (chain and padlock) -> Dennis deadpan, the three tags
   ("Cigarettes Cause Trouble") -> emphysema: healthy alveoli vs fewer, bigger sacs -> Alvi, sad, surface area bar
   shrinking -> stamps: lung cancer, bronchitis -> two O2 guards carry Smokey out; the tape ejects (overlay off). */
scene('smoke', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;
  const talk = (t, who) => scTalk(S, t, who);

  /* ---------- local helpers (prefixed smoke) ---------- */
  function smokeCam(el, k, cx, cy) { el.setAttribute('transform', `translate(${cx.toFixed(1)} ${cy.toFixed(1)}) scale(${k.toFixed(4)}) translate(${(-cx).toFixed(1)} ${(-cy).toFixed(1)})`); }
  function smokePop(el, t, t0, x, y, s, r) { const p = P(t, t0, 0.45, pop); op(el, clamp(p * 2.5)); tr(el, x, y, Math.max(0.01, (s || 1) * (0.6 + 0.4 * p)), r); return p; }
  function smokeLabel(parent, text, o) { o = o || {}; return lhChip(parent, text, { size: o.size || 30, fill: o.fill || 'rgba(10,27,39,0.92)', stroke: o.stroke || C.line, sw: o.sw || 2, color: o.color || C.ink, boldFill: o.boldFill }); }
  function smokeStamp(parent, text, o) {
    o = o || {};
    const size = o.size || 44, col = o.color || C.bad, g = G(parent);
    const w = textWidth(text, size, FD, 800) + size * 1.3, h = size * 1.7;
    E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: 12, fill: 'rgba(24,8,12,0.9)', stroke: col, 'stroke-width': 6 }, g);
    T(g, 0, size * 0.36, text, { size, weight: 800, anchor: 'middle', fill: col, ls: 2 });
    g.set = (p, x, y, rot) => { op(g, clamp(p * 4)); tr(g, x, y, lerp(1.7, 1, easeOut(clamp(p))), rot); };
    return g;
  }
  // a luggage tag (centred), coloured strip on the left with a hole
  function smokeTag(parent, text, col, o) {
    o = o || {};
    const size = o.size || 28, g = G(parent);
    const w = textWidth(text, size, FD, 800) + size * 2.2, h = size * 1.9;
    E('path', { d: `M${-w / 2 + 22},${-h / 2} L${w / 2},${-h / 2} L${w / 2},${h / 2} L${-w / 2 + 22},${h / 2} L${-w / 2},0 Z`, fill: '#FFF6DE', stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
    E('rect', { x: -w / 2 + 22, y: -h / 2, width: 14, height: h, fill: col }, g);
    E('circle', { cx: -w / 2 + 12, cy: 0, r: 6, fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 3 }, g);
    if (o.rich) lhRich(g, 14, size * 0.36, text, { size, weight: 800, anchor: 'middle', fill: SC_INK, boldFill: o.boldFill });
    else T(g, 14, size * 0.36, text, { size, weight: 800, anchor: 'middle', fill: SC_INK });
    g.w = w;
    return g;
  }
  // flat molecules (fewer elements than the lib art): O2 red pair, CO grey C + red O
  function smokeMol(parent, kind, r) {
    const g = G(parent), o = ball(C.oxygen, C.oxygenDk);
    if (kind === 'O2') { E('circle', { cx: -r * 0.72, r, fill: o, stroke: C.oxygenDk, 'stroke-width': 1.5 }, g); E('circle', { cx: r * 0.72, r, fill: o, stroke: C.oxygenDk, 'stroke-width': 1.5 }, g); }
    else { E('circle', { cx: r * 0.8, r: r * 0.9, fill: o, stroke: C.oxygenDk, 'stroke-width': 1.5 }, g); E('circle', { cx: -r * 0.75, r, fill: ball(C.carbon, C.carbonDk), stroke: C.carbonDk, 'stroke-width': 1.5 }, g); }
    return g;
  }
  // padlock icon
  function smokeLock(parent) {
    const g = G(parent);
    E('path', { d: 'M-30,-10 L-30,-44 Q-30,-76 0,-76 Q30,-76 30,-44 L30,-10', fill: 'none', stroke: '#9AA6B2', 'stroke-width': 14, 'stroke-linecap': 'round' }, g);
    E('rect', { x: -48, y: -14, width: 96, height: 80, rx: 12, fill: ball('#FFD23F', '#B5870A'), stroke: SC_INK, 'stroke-width': 5 }, g);
    E('path', { d: 'M0,12 L0,40', stroke: SC_INK, 'stroke-width': 10, 'stroke-linecap': 'round' }, g);
    E('circle', { cy: 12, r: 10, fill: SC_INK }, g);
    return g;
  }

  /* ---------- shared cast ---------- */
  const hold = G(root); op(hold, 0);
  const DEN = cast(hold, 'dennis', { mood: 'deadpan' });
  const SMK = cast(hold, 'smokey', { mood: 'smug' });
  function smokeSeat(ch, wrap) { if (ch.parentNode !== wrap) wrap.appendChild(ch); }
  // one confessional set, moved into whichever shot needs it (keeps the element count down)
  const CONF = lhConf(hold, 'smokey');
  const CONF_FILL = { smokey: linGrad(LH_TINT.smokey[0], LH_TINT.smokey[1], true), alvi: linGrad(LH_TINT.alvi[0], LH_TINT.alvi[1], true) };
  function smokeConf(slot, kind, t) { smokeSeat(CONF, slot); CONF.firstChild.setAttribute('fill', CONF_FILL[kind]); CONF.set(1, t); op(CONF.rec, 0); }
  // a simple blood vessel with drifting red cells; g.upd(t)
  function smokeBlood(parent) {
    const g = G(parent);
    E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#3C0D14', '#6A1620', true) }, g);
    E('rect', { x: 0, y: 150, width: 1200, height: 450, fill: '#8E1F2A', opacity: 0.55 }, g);
    E('path', { d: 'M0,150 L1200,150', stroke: '#C2454F', 'stroke-width': 14, opacity: 0.7 }, g);
    const cs = [[0, 210, 50], [400, 470, 40], [800, 250, 60], [1000, 440, 45]].map(([x, y, v]) => ({ el: E('ellipse', { rx: 34, ry: 15, fill: '#FF6B6B', opacity: 0.4 }, g), x, y, v }));
    g.upd = t => cs.forEach(c => tr(c.el, ((c.x + t * c.v) % 1350) - 75, c.y + 10 * Math.sin(t + c.x), 1, c.x + t * 20));
    return g;
  }

  const EJECT = end('escort') + 0.35;
  const CUTS = [
    [-1, 'brief'],
    [at('smokey') - 0.08, 'sec'],
    [at('tar') - 0.08, 'lining'],
    [at('order') - 0.08, 'brief'],
    [at('co') - 0.08, 'taxi'],
    [at('nicotine') - 0.08, 'nic'],
    [at('selling') - 0.08, 'brief'],
    [at('emph') - 0.08, 'emph'],
    [at('area') - 0.08, 'alvi'],
    [at('cancers') - 0.08, 'brief'],
    [at('escort') - 0.08, 'sec'],
  ];
  const cutAt = t => { let c = CUTS[0]; for (const k of CUTS) if (t >= k[0]) c = k; return c[1]; };

  /* =================== BRIEFING ROOM (drill, order, selling, cancers) =================== */
  const gBrief = G(root), bfCam = G(gBrief);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#1C2430', '#34404E', true) }, bfCam);
  E('rect', { x: 0, y: 600, width: 1200, height: 150, fill: '#232A33' }, bfCam);
  E('rect', { x: 0, y: 596, width: 1200, height: 8, fill: '#4A5664' }, bfCam);
  const scr = G(bfCam); tr(scr, 810, 340);
  E('rect', { x: -310, y: -232, width: 620, height: 22, rx: 10, fill: '#5A6470', stroke: SC_INK, 'stroke-width': 3 }, scr);
  E('rect', { x: -290, y: -212, width: 580, height: 410, fill: '#F2EFE6', stroke: '#9AA6B2', 'stroke-width': 4 }, scr);
  E('path', { d: 'M230,198 L230,236', stroke: '#9AA6B2', 'stroke-width': 3 }, scr);
  E('circle', { cx: 230, cy: 242, r: 7, fill: '#9AA6B2' }, scr);
  // screen 1: the drill (WANTED poster)
  const sDrill = G(scr);
  T(sDrill, 0, -150, 'KNOW THIS FACE', { size: 40, weight: 800, anchor: 'middle', fill: '#2B3440', ls: 2 });
  const poster = G(sDrill);
  E('rect', { x: -140, y: -110, width: 280, height: 290, rx: 6, fill: '#E8D3A0', stroke: '#8A6D35', 'stroke-width': 5 }, poster);
  T(poster, 0, -66, 'WANTED', { size: 48, weight: 800, anchor: 'middle', fill: '#8E2234', ls: 3 });
  const posterSmk = G(poster); tr(posterSmk, 0, 40);
  T(poster, 0, 160, 'for lung damage', { size: 26, weight: 700, anchor: 'middle', fill: '#5A3A1E', font: FB });
  // screen 2: the escalator, out of order
  const sOrder = G(scr);
  let steps = 'M-230,150 ';
  for (let i = 0; i < 8; i++) steps += `l50,0 l0,-36 `;
  E('path', { d: steps + 'L170,150 Z', fill: '#E8F2A0', stroke: '#9AA83A', 'stroke-width': 5, 'stroke-linejoin': 'round' }, sOrder);
  E('path', { d: 'M-250,170 L190,-140', stroke: '#2B3440', 'stroke-width': 10, 'stroke-linecap': 'round' }, sOrder);
  T(sOrder, -60, -150, 'MUCUS ESCALATOR', { size: 34, weight: 800, anchor: 'middle', fill: '#2B3440' });
  const ooo = G(sOrder);
  E('path', { d: 'M-40,-60 L0,-100 L40,-60', fill: 'none', stroke: '#2B3440', 'stroke-width': 4 }, ooo);
  E('rect', { x: -130, y: -60, width: 260, height: 110, rx: 10, fill: '#FFFFFF', stroke: '#D32F2F', 'stroke-width': 8 }, ooo);
  T(ooo, 0, -14, 'OUT OF', { size: 36, weight: 800, anchor: 'middle', fill: '#D32F2F' });
  T(ooo, 0, 30, 'ORDER', { size: 40, weight: 800, anchor: 'middle', fill: '#D32F2F' });
  // screen 3: the three tags (Cigarettes Cause Trouble)
  const sTags = G(scr);
  T(sTags, 0, -150, "SMOKEY'S LUGGAGE", { size: 36, weight: 800, anchor: 'middle', fill: '#2B3440' });
  const TG = [['**C**arbon monoxide', '#9AA6B2'], ['**C**ancer-causing tar', LH.tar], ["**T**obacco's nicotine", '#8E5BD9']].map(([s, col], i) => { const tg = smokeTag(sTags, s, col, { size: 32, rich: true, boldFill: '#C2453A' }); tr(tg, 0, -70 + i * 84); return tg; });
  T(sTags, 0, 176, 'Cigarettes Cause Trouble', { size: 30, weight: 700, anchor: 'middle', fill: '#C2453A', font: FB });
  // screen 4: lungs, stamped
  const sLungs = G(scr);
  const lgs = lungs(sLungs, 1.05); tr(lgs, 0, 10);
  [[-60, 30], [70, 50], [50, 100]].forEach(([x, y]) => E('circle', { cx: x, cy: y, r: 12, fill: '#4A3A2A', opacity: 0.55 }, sLungs));
  const stCancer = smokeStamp(sLungs, 'LUNG CANCER', { size: 40, color: '#D32F2F' });
  const stBron = smokeStamp(sLungs, 'BRONCHITIS', { size: 40, color: '#D32F2F' });
  // Dennis and his pointer
  const bfDen = G(bfCam);
  const pointer = E('path', { d: 'M420,500 L560,300', stroke: '#8A5A3A', 'stroke-width': 9, 'stroke-linecap': 'round' }, bfCam);
  const bfOv = G(gBrief);
  const cKav = smokeLabel(bfOv, 'Kavya: 12 · does not smoke ✓', { size: 30, color: C.good, stroke: C.good });

  /* =================== SECURITY (smokey, escort) =================== */
  const gSec = G(root), scCam = G(gSec);
  lhTerminal(scCam);
  const secNigel = cast(scCam, 'nigel', { mood: 'neutral' });
  const arch = G(scCam); tr(arch, 760, 560);
  E('path', { d: 'M-130,0 L-130,-300 L130,-300 L130,0', fill: 'none', stroke: SC_INK, 'stroke-width': 40, 'stroke-linejoin': 'round' }, arch);
  E('path', { d: 'M-130,0 L-130,-300 L130,-300 L130,0', fill: 'none', stroke: '#C9D3DC', 'stroke-width': 30, 'stroke-linejoin': 'round' }, arch);
  const archLight = E('circle', { cx: 0, cy: -300, r: 12, fill: '#56D69B', stroke: SC_INK, 'stroke-width': 3 }, arch);
  const secSign = lhSign(scCam, 'SECURITY', { size: 30 }); tr(secSign, 760, 205);
  const noSmoke = G(scCam); tr(noSmoke, 1040, 330);
  E('circle', { r: 62, fill: '#FFFFFF', stroke: '#D32F2F', 'stroke-width': 12 }, noSmoke);
  E('rect', { x: -40, y: -8, width: 66, height: 16, fill: '#2B3440' }, noSmoke);
  E('rect', { x: 26, y: -8, width: 14, height: 16, fill: '#FF8A3D' }, noSmoke);
  E('path', { d: 'M-44,-44 L44,44', stroke: '#D32F2F', 'stroke-width': 12 }, noSmoke);
  const nsTxt = lhChip(scCam, 'NO SMOKING', { size: 28, fill: '#11161C', color: '#FFFFFF', stroke: '#D32F2F', sw: 3 }); tr(nsTxt, 1040, 420);
  const scSmk = G(scCam);
  const suit = G(scCam);
  E('rect', { x: -90, y: -70, width: 180, height: 130, rx: 16, fill: ball('#8A5A3A', '#5A3A1E'), stroke: SC_INK, 'stroke-width': 5 }, suit);
  E('path', { d: 'M-30,-70 L-30,-92 L30,-92 L30,-70', fill: 'none', stroke: SC_INK, 'stroke-width': 8 }, suit);
  E('path', { d: 'M-90,-10 L90,-10', stroke: '#3A2414', 'stroke-width': 4 }, suit);
  const TAGS = [['TAR', LH.tar], ['CARBON MONOXIDE', '#9AA6B2'], ['NICOTINE', '#8E5BD9']];
  const sTagEls = TAGS.map(([s, col]) => smokeTag(scCam, s, col, { size: 28 }));
  const tagStr = E('path', { d: '', fill: 'none', stroke: SC_INK, 'stroke-width': 2.5 }, scCam);
  const scDen = G(scCam);
  const guards = [0, 1].map(() => {
    const g = G(scCam);
    smokeMol(g, 'O2', 34);
    E('path', { d: 'M-46,-22 Q-44,-56 0,-58 Q44,-56 46,-22 Z', fill: '#2B3A66', stroke: SC_INK, 'stroke-width': 4 }, g);
    E('path', { d: 'M-50,-22 L60,-22', stroke: SC_INK, 'stroke-width': 7, 'stroke-linecap': 'round' }, g);
    E('circle', { cx: 0, cy: -42, r: 7, fill: '#FFD23F' }, g);
    E('path', { d: 'M-22,0 L-8,-4 M8,-4 L22,0', stroke: SC_INK, 'stroke-width': 5, 'stroke-linecap': 'round' }, g);
    return g;
  });
  const scOv = G(gSec);
  const ltSmk = scLowerThird(scOv, ...LH_LOWER.smokey);
  const cGuard = smokeLabel(scOv, 'SECURITY (2 × O_2)', { size: 28, color: C.air, stroke: C.air });

  /* =================== AIRWAY LINING (tar, cancer, cilia) =================== */
  const gLin = G(root), lnCam = G(gLin);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#3A1828', '#5A2438', true) }, lnCam);
  const linW = G(lnCam); tr(linW, 60, 240);
  const lining = lhLining(linW, 1080);
  const blobs = [], br = rng(31);
  for (let i = 0; i < 5; i++) blobs.push({ el: E('ellipse', { rx: 22, ry: 16, fill: LH.tar, stroke: '#2E1C0E', 'stroke-width': 3 }, lnCam), x: 120 + br() * 960, d: br() * 0.6 });
  const piles = [], pr = rng(77);
  for (let i = 0; i < 7; i++) piles.push({ el: E('circle', { r: 7 + pr() * 5, fill: '#6B5A4A', stroke: '#3A2E24', 'stroke-width': 2 }, lnCam), x: 100 + pr() * 1000, y: 268 + pr() * 30, k: i / 7 });
  const lnOv = G(gLin);
  const cWhere = smokeLabel(lnOv, 'the airway lining', { size: 30, color: LH.signTx, stroke: LH.signTx });
  const cTar = smokeLabel(lnOv, '**tar**: sticky, brown, coats the airways', { size: 34, boldFill: '#D9A066' });
  const haz = G(lnOv);
  E('path', { d: 'M0,-70 L72,56 L-72,56 Z', fill: '#FFD23F', stroke: SC_INK, 'stroke-width': 6, 'stroke-linejoin': 'round' }, haz);
  T(haz, 0, 40, '!', { size: 80, weight: 800, anchor: 'middle', fill: SC_INK });
  const cCarc = lhChip(lnOv, '**carcinogen** = causes **cancer**', { size: 38, fill: '#FFD23F', color: SC_INK, stroke: SC_INK, sw: 4 });
  const cPara = smokeLabel(lnOv, 'cilia **paralysed**: the escalator stops', { size: 34, boldFill: C.bad });
  const cCough = smokeLabel(lnOv, "→ **smoker's cough** + chest infections", { size: 34, boldFill: '#FFB27A' });
  const cough = G(lnOv);
  { let d = ''; for (let i = 0; i < 20; i++) { const a = i / 20 * TAU, r = i % 2 ? 56 : 96; d += (i ? 'L' : 'M') + (Math.cos(a) * r * 1.4).toFixed(1) + ',' + (Math.sin(a) * r).toFixed(1); } E('path', { d: d + 'Z', fill: '#FFFFFF', stroke: '#9AA6B2', 'stroke-width': 5, 'stroke-linejoin': 'round' }, cough); }
  T(cough, 0, 16, 'COUGH!', { size: 48, weight: 800, anchor: 'middle', fill: '#8E2234' });

  /* =================== TAXI RANK (co, seats) =================== */
  const gTaxi = G(root), txCam = G(gTaxi);
  const bloodBg = smokeBlood(txCam);
  const kerb = G(txCam);
  E('rect', { x: 0, y: 560, width: 1200, height: 190, fill: '#6A6E78' }, kerb);
  E('rect', { x: 0, y: 548, width: 1200, height: 18, fill: '#C9D3DC', stroke: SC_INK, 'stroke-width': 3 }, kerb);
  const rank = lhSign(txCam, 'TAXI RANK', { size: 28, arrow: 'right' }); tr(rank, 160, 655);
  const TX = [[350, 330], [800, 330]], TS = 1.4;
  const taxis = TX.map(([x, y]) => { const tx = lhRBC(txCam, TS); tr(tx, x, y, TS); return tx; });
  const SEATS = [];
  TX.forEach(([x, y], k) => taxis[k].seats.forEach(([sx, sy]) => SEATS.push([x + sx * TS, y + sy * TS - 12])));
  const COs = SEATS.map(() => smokeMol(txCam, 'CO', 16));
  const txOz = G(txCam);
  const queue = [0, 1].map(() => smokeMol(txCam, 'O2', 22));
  const gauge = G(txCam); tr(gauge, 720, 615);
  E('rect', { x: -10, y: -56, width: 400, height: 92, rx: 14, fill: 'rgba(10,20,28,0.92)', stroke: '#3A4B5C', 'stroke-width': 3 }, gauge);
  lhRich(gauge, 10, -18, 'oxygen carried', { size: 28, fill: '#FFFFFF' });
  const oxBar = meter(gauge, { w: 300, h: 26, color: C.oxygen }); tr(oxBar, 10, 0);
  const oxArrow = arrow(gauge, 350, -40, 350, 22, { color: C.bad, width: 7, head: 20 });
  const txOv = G(gTaxi);
  const cCO = smokeLabel(txOv, '**carbon monoxide** (CO): a poisonous gas', { size: 32, boldFill: '#C9D3DC' });
  const cGrab = smokeLabel(txOv, 'grabs **haemoglobin** more strongly than O_2', { size: 32, boldFill: '#FF8A8A' });
  const cLess = smokeLabel(txOv, 'blood carries **less oxygen**', { size: 34, boldFill: C.oxygen });

  /* =================== NICOTINE close-up =================== */
  const gNic = G(root), ncCam = G(gNic);
  const ncBg = G(ncCam);
  const ncSmk = G(ncCam);
  const ncOv = G(gNic);
  const nTag = smokeTag(ncOv, 'NICOTINE', '#8E5BD9', { size: 40 });
  const cAdd = lhChip(ncOv, '**nicotine** = **addictive**', { size: 40, fill: '#8E5BD9', color: '#FFFFFF', stroke: '#FFFFFF', sw: 4 });
  const chain = G(ncOv);
  for (let i = 0; i < 6; i++) E('ellipse', { cx: i * 46, cy: 0, rx: 30, ry: i % 2 ? 6 : 16, fill: 'none', stroke: '#9AA6B2', 'stroke-width': 8 }, chain);
  const lock = smokeLock(ncOv);
  const cHard = smokeLabel(ncOv, 'hard to stop', { size: 30, color: '#FFB27A', stroke: '#FFB27A' });

  /* =================== EMPHYSEMA =================== */
  const gEmph = G(root);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#2A1630', '#4A2240', true) }, gEmph);
  E('ellipse', { cx: 600, cy: 400, rx: 560, ry: 300, fill: glow('#FFB3C6'), opacity: 0.2 }, gEmph);
  const cluL = lhCluster(gEmph); tr(cluL, 330, 400); cluL.setAttribute('id', 'smokeCluL');
  const cluR = E('use', { href: '#smokeCluL' }, gEmph);   // the same healthy cluster, drawn again on the right
  const cluE = lhCluster(gEmph, { emph: true }); tr(cluE, 870, 400);
  const lHealthy = smokeLabel(gEmph, 'healthy', { size: 32, color: C.good, stroke: C.good });
  const lEmph = smokeLabel(gEmph, 'emphysema', { size: 32, color: C.bad, stroke: C.bad });
  const cracks = E('path', { d: 'M820,360 L840,380 L828,396 M910,420 L894,440 L906,452 M860,470 L874,488', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 5, 'stroke-linecap': 'round' }, gEmph);
  const cEmph = smokeLabel(gEmph, 'walls between alveoli break down → **fewer, bigger sacs**', { size: 30, boldFill: '#FF9BB4' });
  const vs = T(gEmph, 600, 410, '→', { size: 64, weight: 800, anchor: 'middle', fill: '#FFFFFF' });

  /* =================== ALVI (surface area) =================== */
  const gAlvi = G(root), alCam = G(gAlvi);
  const alBg = G(alCam);
  const ALVI = cast(alCam, 'alvi', { mood: 'sad' });
  const sa = G(alCam); tr(sa, 900, 120);
  E('rect', { x: -70, y: 0, width: 140, height: 400, rx: 18, fill: 'rgba(10,20,28,0.85)', stroke: '#FFFFFF', 'stroke-width': 4 }, sa);
  const saBar = E('rect', { x: -50, y: 20, width: 100, height: 360, rx: 10, fill: C.good }, sa);
  T(sa, 0, 450, 'surface area', { size: 30, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  const saArrow = arrow(sa, 120, 60, 120, 340, { color: C.bad, width: 8, head: 24 });
  const alOv = G(gAlvi);
  const cBreath = smokeLabel(alOv, 'less O_2 gets in → **breathless**, even at rest', { size: 32, boldFill: '#FFB27A' });

  /* =================== VHS overlay, static, eject =================== */
  const vhs = lhVHS(root);
  const stat = G(root);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#BFC6CC' }, stat);
  { let d = ''; const r = rng(13); for (let i = 0; i < 60; i++) { const y = r() * 750, x = r() * 1200; d += `M${x.toFixed(0)},${y.toFixed(0)} l${(40 + r() * 260).toFixed(0)},0 `; } E('path', { d, stroke: '#2B3440', 'stroke-width': 5, opacity: 0.7 }, stat); }
  const ejectChip = lhChip(root, '⏏ EJECT', { size: 40, fill: '#11161C', color: '#FFFFFF', stroke: '#FFFFFF', sw: 3 });

  const SHOTS = { brief: gBrief, sec: gSec, lining: gLin, taxi: gTaxi, nic: gNic, emph: gEmph, alvi: gAlvi };
  const SCREENS = [sDrill, sOrder, sTags, sLungs];
  const OZ = cast(txOz, 'ozzie', { mood: 'happy' });

  return t => {
    const shot = cutAt(t);
    for (const k in SHOTS) op(SHOTS[k], 0);
    op(SHOTS[shot], 1);
    const vOn = t < EJECT ? 1 : 0;
    vhs.set(vOn, t);
    const sP = t >= EJECT - 0.05 && t < EJECT + 0.3;
    op(stat, sP ? 1 : 0); if (sP) tr(stat, 0, ((t * 997) % 40) - 20);
    op(ejectChip, t >= EJECT - 0.05 && t < EJECT + 1.0 ? 1 : 0); tr(ejectChip, 1010, 70);
    const breath = wave(t, 4) * AMP;

    /* ---------- BRIEFING ROOM ---------- */
    if (shot === 'brief') {
      smokeSeat(DEN, bfDen);
      SCREENS.forEach(s => op(s, 0));
      let k = 1, look = 0, mood = 'deadpan', ptr = [560, 300];
      if (t < at('smokey')) {
        op(sDrill, 1);
        const pp = P(t, mid('drill', 0.68), 0.4, pop);
        op(poster, clamp(pp * 2.5)); tr(poster, 0, 0, Math.max(0.01, 0.6 + 0.4 * pp));
        smokeSeat(SMK, posterSmk); tr(SMK, 0, 0, 0.6); SMK.set({ t, talk: 0, mood: 'smug', look: 0, still: false });
        smokePop(cKav, t, mid('drill', 0.36), 300, 240);
        look = t > mid('drill', 0.62) && t < mid('drill', 0.85) ? 0.8 : 0;
        ptr = [lerp(520, 600, P(t, mid('drill', 0.65), 0.4)), lerp(330, 300, P(t, mid('drill', 0.65), 0.4))];
        k = 1 + 0.03 * P(t, at('drill'), end('drill') + 0.4 - at('drill'), linear);
      } else if (t < at('co')) {
        op(cKav, 0);
        op(sOrder, 1);
        const drop = P(t, at('order') + 0.15, 0.5, pop);
        tr(ooo, 70, lerp(-260, 10, drop), 1, Math.sin((t - at('order')) * 4) * 8 * Math.exp(-(t - at('order')) * 1.2) * AMP);
        look = t < mid('order', 0.5) ? 0.8 : 0;
        ptr = [640, 330];
        k = 1 + 0.06 * P(t, mid('order', 0.6), end('order') + 0.5 - mid('order', 0.6), linear);
      } else if (t < at('cancers')) {
        op(cKav, 0);
        op(sTags, 1);
        TG.forEach((tg, i) => smokePop(tg, t, at('selling') + i * 0.12, 0, -70 + i * 84));
        ptr = [480, 300];
        k = 1 + 0.06 * P(t, mid('selling', 0.5), end('selling') + 0.5 - mid('selling', 0.5), linear);
      } else {
        op(cKav, 0);
        op(sLungs, 1);
        lgs.set(0.4 * breath);
        stCancer.set(P(t, mid('cancers', 0.35), 0.3, linear), 0, -130, -8);
        stBron.set(P(t, mid('cancers', 0.7), 0.3, linear), 0, 160, 6);
        look = 0.6; mood = 'sad';
        ptr = [600, 300];
      }
      smokeCam(bfCam, k, 330, 440);
      tr(DEN, 290, 500, 1.25);
      DEN.set({ t, talk: talk(t, 'dennis'), mood, look, flat: 0.55 * breath, sweat: 0 });
      attr(pointer, 'd', `M410,500 L${ptr[0].toFixed(0)},${ptr[1].toFixed(0)}`);
    }

    /* ---------- SECURITY ---------- */
    if (shot === 'sec') {
      const esc = t >= at('escort') - 0.08;
      smokeCam(scCam, 1, 600, 400);
      tr(secNigel, esc ? lerp(420, 560, clamp((t - at('escort')) / 6)) : lerp(80, 620, clamp((t - at('smokey')) / 9)), 540, 0.5);
      secNigel.set({ t, mood: 'neutral', look: 0 });
      smokeSeat(SMK, scSmk);
      let sx, sy = 420, smood = 'smug', slook = 0;
      if (!esc) {
        sx = lerp(1300, 700, P(t, at('smokey') - 0.08, 0.7, easeOut));
        slook = 0;
        ltSmk.set(win(t, at('smokey') + 0.4, at('smokey') + 3.6, 0.3));
        op(scDen, 0); guards.forEach(g => op(g, 0)); op(cGuard, 0);
        op(noSmoke, 0); op(nsTxt, 0);
      } else {
        ltSmk.set(0);
        const carry = P(t, mid('escort', 0.45), end('escort') - mid('escort', 0.45), easeIn);
        sx = lerp(700, 1450, carry); sy = 420 - 40 * P(t, mid('escort', 0.3), 0.4, ease);
        smood = 'annoyed'; slook = -0.6;
        smokeSeat(DEN, scDen); op(scDen, 1);
        tr(DEN, 230, 520, 0.95);
        const afterE = t >= EJECT;
        DEN.set({ t, talk: talk(t, 'dennis'), mood: 'deadpan', look: afterE ? 0 : 0.7, flat: 0.55 * breath });
        guards.forEach((g, i) => { const gp = P(t, mid('escort', 0.2) + i * 0.1, 0.35, pop); op(g, clamp(gp * 3)); tr(g, sx + (i ? 80 : -80), sy + 120 - 6 * Math.abs(Math.sin(t * 8 + i)) * AMP, 1); });
        smokePop(cGuard, t, mid('escort', 0.3), 400, 200); op(cGuard, carry > 0.6 ? 0 : P(t, mid('escort', 0.3), 0.2, linear));
        const ns = P(t, EJECT + 0.3, 0.45, pop);
        op(noSmoke, clamp(ns * 2.5)); tr(noSmoke, 1040, 330, Math.max(0.01, 0.6 + 0.4 * ns));
        op(nsTxt, clamp(ns * 2.5));
      }
      tr(SMK, sx, sy, 1.05);
      SMK.set({ t, talk: talk(t, 'smokey'), mood: smood, look: slook });
      // suitcase follows him (dragged), tags hang from the handle
      const cx = sx + 210, cy = esc ? sy + 150 : 540;
      tr(suit, cx, cy, 1, esc ? -10 : 0);
      let d = '';
      sTagEls.forEach((tg, i) => {
        const tp = P(t, mid('smokey', 0.72) + i * 0.15, 0.35, pop), shown = !esc ? tp : 1;
        const tx = cx + 10, ty = cy - 330 + i * 70;
        const tgx = esc ? Math.min(920 + tg.w / 2 - 20, 1160 - tg.w / 2) + (sx - 700) : Math.min(tx + tg.w / 2 - 20, 1160 - tg.w / 2);
        op(tg, clamp(shown * 2.5) * (tgx - tg.w / 2 > 1200 ? 0 : 1)); tr(tg, tgx, ty, Math.max(0.01, 0.6 + 0.4 * clamp(shown)), Math.sin(t * 2 + i) * 3 * AMP);
        if (shown > 0.3) d += `M${cx},${cy - 92} L${(tgx - tg.w / 2 + 12).toFixed(0)},${ty} `;
      });
      attr(tagStr, 'd', d);
      attr(archLight, 'fill', !esc && t > at('smokey') + 0.5 && Math.sin(t * 14) > 0 ? '#FF4A4A' : '#56D69B');
    } else ltSmk.set(0);

    /* ---------- LINING ---------- */
    if (shot === 'lining') {
      const ts = at('cilia') + 0.3, dd = Math.max(0, t - ts);
      const teff = Math.min(t, ts) + (dd < 1 ? dd - dd * dd / 2 : 0.5);
      const rate = 1 - clamp(dd);
      const tar = 0.15 + 0.85 * P(t, mid('tar', 0.15), 2.2, ease);
      lining.upd(teff, rate, tar);
      smokeCam(lnCam, 1.04 - 0.04 * P(t, at('tar'), 1, easeOut), 600, 340);
      blobs.forEach((b, i) => {
        const f = clamp((t - at('tar') - b.d * 2) / 1.2);
        const y = lerp(100, 290, easeIn(f));
        tr(b.el, b.x, y, 1); attr(b.el, 'ry', f < 1 ? 16 + 10 * f : 8); attr(b.el, 'rx', f < 1 ? 22 : 40);
        op(b.el, t < at('tar') ? 0 : 0.95);
      });
      piles.forEach(p => { op(p.el, t > ts + 0.4 + p.k * 2.4 ? 1 : 0); attr(p.el, 'cx', p.x); attr(p.el, 'cy', p.y - p.k * 6); });
      smokePop(cWhere, t, at('tar'), 860, 160);
      const tarOn = t < at('cilia') - 0.08;
      op(cTar, 0); op(cCarc, 0); op(cPara, 0); op(cCough, 0); op(haz, 0); op(cough, 0);
      if (tarOn) {
        smokePop(cTar, t, mid('tar', 0.3), 600, 530);
        if (t > at('cancer') - 0.1) {
          smokePop(haz, t, mid('cancer', 0.1), 1020, 520, 1, -8);
          smokePop(cCarc, t, mid('cancer', 0.45), 560, 620);
          op(cTar, 1); tr(cTar, 560, 530);
        }
      } else {
        op(haz, 1); tr(haz, 1020, 520, 1, -8);
        smokePop(cPara, t, mid('cilia', 0.1), 560, 530);
        smokePop(cCough, t, mid('cilia', 0.55), 560, 620);
        const cp = t > mid('cilia', 0.7) && t < mid('cilia', 0.7) + 0.9 ? P(t, mid('cilia', 0.7), 0.3, pop) : 0;
        op(cough, clamp(cp * 3)); tr(cough, 900, 150, Math.max(0.01, 0.6 + 0.4 * cp), -6);
      }
    }

    /* ---------- TAXI RANK ---------- */
    if (shot === 'taxi') {
      bloodBg.upd(t);
      smokeCam(txCam, 1, 600, 400);
      const seats = t >= at('seats') - 0.08;
      COs.forEach((m, i) => {
        const t0 = mid('co', 0.3) + i * 0.32, f = clamp((t - t0) / 0.5);
        const [sx, sy] = SEATS[i], x0 = -60, y0 = 200 + (i % 3) * 30;
        op(m, t > t0 - 0.6 ? 1 : 0);
        if (f <= 0) tr(m, lerp(x0, sx - 100, clamp((t - t0 + 0.6) / 0.6)), y0);
        else tr(m, lerp(sx - 100, sx, f), lerp(y0, sy, f) - Math.sin(f * Math.PI) * 60);
      });
      // Ozzie and the O2 queue at the kerb
      const shocked = seats || t > mid('co', 0.55);
      tr(OZ, 210, 470, 0.75);
      OZ.set({ t, talk: talk(t, 'ozzie'), mood: shocked ? (seats && t > mid('seats', 0.4) ? 'annoyed' : 'shock') : 'happy', look: shocked ? 0.7 : 0.4 });
      queue.forEach((q, i) => tr(q, 410 + i * 70, 500 + Math.sin(t * 2 + i) * 3, 1));
      op(cCO, seats ? 0 : 1); smokePop(cCO, t, mid('co', 0.08), 600, 150);
      op(cGrab, 0); if (!seats && t > mid('co', 0.45)) smokePop(cGrab, t, mid('co', 0.45), 600, 150);
      if (t > mid('co', 0.45)) op(cCO, 0);
      op(cLess, 0); op(gauge, 0);
      if (seats) {
        smokePop(cLess, t, mid('seats', 0.4), 600, 150);
        smokePop(gauge, t, at('seats'), 720, 615);
        oxBar.set(0.95 - 0.6 * P(t, mid('seats', 0.3), 1.2, ease));
        oxArrow.set(P(t, mid('seats', 0.4), 0.4, linear));
      }
    }

    /* ---------- NICOTINE ---------- */
    if (shot === 'nic') {
      smokeConf(ncBg, 'smokey', t);
      smokeSeat(SMK, ncSmk);
      const lean = P(t, at('nicotine'), 1.4, ease);
      smokeCam(ncCam, 1, 600, 400);
      tr(SMK, lerp(420, 400, lean), lerp(420, 450, lean), lerp(1.4, 2.0, lean));
      SMK.set({ t, talk: talk(t, 'smokey'), mood: 'smug', look: 0 });
      smokePop(nTag, t, mid('nicotine', 0.05), 900, 200, 1, -6);
      smokePop(cAdd, t, mid('nicotine', 0.3), 880, 330);
      const cp = P(t, mid('nicotine', 0.6), 0.6, ease);
      op(chain, cp); tr(chain, 700, 500); chain.setAttribute('clip-path', '');
      [...chain.children].forEach((l, i) => op(l, clamp(cp * 6 - i)));
      smokePop(lock, t, mid('nicotine', 0.75), 1010, 500);
      smokePop(cHard, t, mid('nicotine', 0.82), 1010, 610);
    }

    /* ---------- EMPHYSEMA ---------- */
    if (shot === 'emph') {
      cluL.upd(t); cluE.upd(t);
      const br = P(t, mid('emph', 0.4), 1.2, ease);
      op(cluR, 1 - br); op(cluE, br);
      tr(cluR, 540 + Math.sin(t * 30) * 4 * (br > 0 && br < 1 ? 1 : 0) * AMP, 0);
      op(cracks, t > mid('emph', 0.3) && br < 0.7 ? 1 : 0);
      smokePop(lHealthy, t, mid('emph', 0.05), 330, 170);
      smokePop(lEmph, t, mid('emph', 0.15), 870, 170);
      op(lEmph, P(t, mid('emph', 0.15), 0.2, linear));
      op(vs, P(t, mid('emph', 0.15), 0.3, linear));
      smokePop(cEmph, t, mid('emph', 0.6), 600, 630);
      op(cEmph, P(t, mid('emph', 0.6), 0.2, linear));
    }

    /* ---------- ALVI ---------- */
    if (shot === 'alvi') {
      smokeConf(alBg, 'alvi', t);
      const k = 1 + 0.05 * P(t, mid('area', 0.7), end('area') + 0.4 - mid('area', 0.7), linear);
      smokeCam(alCam, k, 430, 420);
      tr(ALVI, 430, 420, 1.45);
      ALVI.set({ t, talk: talk(t, 'alvi'), mood: 'sad', look: t > mid('area', 0.1) && t < mid('area', 0.4) ? 0.7 : 0, sweat: t > mid('area', 0.6) ? 1 : 0 });
      const v = 1 - 0.7 * P(t, mid('area', 0.15), 1.6, ease);
      attr(saBar, 'height', 360 * v); attr(saBar, 'y', 20 + 360 * (1 - v));
      attr(saBar, 'fill', v > 0.6 ? C.good : v > 0.4 ? '#FFD23F' : C.bad);
      saArrow.set(P(t, mid('area', 0.15), 1.2, linear));
      smokePop(cBreath, t, mid('area', 0.55), 560, 630);
      op(cBreath, P(t, mid('area', 0.55), 0.2, linear));
    }
  };
});
