/* Scene 5: The fitness test (exercise and breathing).
   Beats: Monday, the 2.4 km run at 34 °C -> Kavya to camera with a clipboard ("I want names") -> she runs; cutaway
   to her leg muscle: cells respire faster -> more oxygen needed, more carbon dioxide made (two bars) -> the brain's
   CO2 gauge climbs into the red and signals Dennis and Iggy: faster and deeper -> Colin's confessional (the brain
   watches HIM: magazine cover) -> control room alarm: Dennis, breathing rate up -> Iggy, breathing depth up (lhChest
   inflating big) -> heart rate monitor climbing -> Kavya flat on the grass, panting -> the oxygen-debt invoice
   (lactic acid broken down) -> Larry's headband on the control-room floor -> recovery-rate graph (fitter = faster)
   -> Dennis's confessional, Iggy doing star jumps behind him: "We cannot." */
scene('run', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;
  const talk = (t, who) => scTalk(S, t, who);

  /* ---------- local helpers (prefixed run) ---------- */
  const runOn = (t, a, b) => (t >= a && t < b ? 1 : 0);
  function runCam(el, k, cx, cy, px, py) { el.setAttribute('transform', `translate(${(px ?? cx).toFixed(1)} ${(py ?? cy).toFixed(1)}) scale(${k.toFixed(4)}) translate(${(-cx).toFixed(1)} ${(-cy).toFixed(1)})`); }
  function runPop(el, t, t0, x, y, s, r) { const p = P(t, t0, 0.45, pop); op(el, clamp(p * 2.5)); tr(el, x, y, Math.max(0.01, (s || 1) * (0.6 + 0.4 * p)), r); return p; }
  function runLabel(parent, text, o) { o = o || {}; return lhChip(parent, text, { size: o.size || 30, fill: o.fill || 'rgba(10,27,39,0.9)', stroke: o.stroke || C.line, sw: o.sw || 2, color: o.color || C.ink, boldFill: o.boldFill }); }
  // a rubber stamp; g.set(p, x, y, rot)
  function runStamp(parent, text, o) {
    o = o || {};
    const size = o.size || 44, col = o.color || C.bad, g = G(parent);
    const w = textWidth(text, size, FD, 800) + size * 1.3, h = size * 1.7;
    E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: 12, fill: 'rgba(24,8,12,0.9)', stroke: col, 'stroke-width': 6 }, g);
    T(g, 0, size * 0.36, text, { size, weight: 800, anchor: 'middle', fill: col, ls: 2 });
    g.set = (p, x, y, rot) => { op(g, clamp(p * 4)); tr(g, x, y, lerp(1.7, 1, easeOut(clamp(p))), rot); };
    return g;
  }
  // control room under the lungs: dark red walls, pipes, warning-striped floor
  function runCtrl(parent) {
    const g = G(parent);
    E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#2A0A12', '#561A26', true) }, g);
    E('path', { d: 'M0,170 L1200,170 M0,196 L1200,196', stroke: '#7A2B3A', 'stroke-width': 14, opacity: 0.7 }, g);
    [[640, 230], [900, 250], [1080, 220]].forEach(([x, y]) => E('rect', { x: x - 70, y, width: 140, height: 90, rx: 10, fill: '#1A0A10', stroke: '#7A2B3A', 'stroke-width': 4 }, g));
    E('rect', { x: 0, y: 560, width: 1200, height: 190, fill: '#2A1418' }, g);
    let st = '';
    for (let x = -40; x < 1240; x += 60) st += `M${x},560 L${x + 30},560 L${x + 10},590 L${x - 20},590 Z `;
    E('rect', { x: 0, y: 560, width: 1200, height: 30, fill: '#1A1A1A' }, g);
    E('path', { d: st, fill: '#FFD23F' }, g);
    return g;
  }
  // an analogue dial: g.set(v 0..1)
  function runDial(parent, r, title) {
    const g = G(parent);
    E('circle', { r: r + 18, fill: '#11161C', stroke: '#3A4B5C', 'stroke-width': 6 }, g);
    E('path', { d: `M${-r},0 A${r},${r} 0 0 1 ${r * 0.31},${-r * 0.95}`, fill: 'none', stroke: C.good, 'stroke-width': 18 }, g);
    E('path', { d: `M${r * 0.31},${-r * 0.95} A${r},${r} 0 0 1 ${r},0`, fill: 'none', stroke: C.bad, 'stroke-width': 18 }, g);
    let tk = '';
    for (let i = 0; i <= 10; i++) { const a = Math.PI + i / 10 * Math.PI; tk += `M${(Math.cos(a) * (r - 22)).toFixed(1)},${(Math.sin(a) * (r - 22)).toFixed(1)} L${(Math.cos(a) * (r - 38)).toFixed(1)},${(Math.sin(a) * (r - 38)).toFixed(1)} `; }
    E('path', { d: tk, stroke: '#A4BCCB', 'stroke-width': 4 }, g);
    const needle = E('path', { d: `M0,0 L0,${-(r - 30)}`, stroke: '#FFD23F', 'stroke-width': 8, 'stroke-linecap': 'round' }, g);
    E('circle', { r: 14, fill: '#FFD23F', stroke: SC_INK, 'stroke-width': 3 }, g);
    g.num = T(g, 0, 70, '12', { size: 56, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
    T(g, 0, 112, title, { size: 28, weight: 700, anchor: 'middle', fill: '#A4BCCB' });
    g.set = v => attr(needle, 'transform', `rotate(${(-90 + 180 * clamp(v)).toFixed(1)})`);
    g.set(0.2);
    return g;
  }
  // flat molecules (fewer elements than the lib art): O2 red pair, CO2 red-grey-red
  function runMol(parent, kind, r) {
    const g = G(parent), o = ball(C.oxygen, C.oxygenDk);
    if (kind === 'O2') { E('circle', { cx: -r * 0.72, r, fill: o, stroke: C.oxygenDk, 'stroke-width': 1.5 }, g); E('circle', { cx: r * 0.72, r, fill: o, stroke: C.oxygenDk, 'stroke-width': 1.5 }, g); }
    else { E('circle', { cx: -r * 1.6, r: r * 0.9, fill: o, stroke: C.oxygenDk, 'stroke-width': 1.5 }, g); E('circle', { cx: r * 1.6, r: r * 0.9, fill: o, stroke: C.oxygenDk, 'stroke-width': 1.5 }, g); E('circle', { r, fill: ball(C.carbon, C.carbonDk), stroke: C.carbonDk, 'stroke-width': 1.5 }, g); }
    return g;
  }
  const RUN_HEART = 'M0,34 C-70,-8 -58,-66 0,-34 C58,-66 70,-8 0,34 Z';

  /* ---------- shared cast (re-seated in whichever shot is on screen) ---------- */
  const hold = G(root); op(hold, 0);
  const DEN = cast(hold, 'dennis', { mood: 'deadpan' });
  const IGG = cast(hold, 'iggy', { mood: 'happy' });
  const KAV = cast(hold, 'kavya', { mood: 'annoyed' });
  function runSeat(ch, wrap) { if (ch.parentNode !== wrap) wrap.appendChild(ch); }
  // one control-room set and one confessional, moved into whichever shot needs them (keeps the element count down)
  const CTRL = runCtrl(hold), CONF = lhConf(hold, 'colin');
  const CONF_FILL = { colin: linGrad(LH_TINT.colin[0], LH_TINT.colin[1], true), dennis: linGrad(LH_TINT.dennis[0], LH_TINT.dennis[1], true) };
  function runConf(slot, kind, t) { runSeat(CONF, slot); CONF.firstChild.setAttribute('fill', CONF_FILL[kind]); CONF.set(1, t); }

  /* ---------- cut list ---------- */
  const CUTS = [
    [-1, 'track'],
    [at('names') - 0.08, 'kclose'],
    [at('faster') - 0.08, 'running'],
    [mid('faster', 0.4), 'muscle'],
    [at('brain') - 0.08, 'brain'],
    [at('thcolin') - 0.08, 'colin'],
    [at('rate') - 0.08, 'rate'],
    [at('depth') - 0.08, 'depth'],
    [at('heart') - 0.08, 'heart'],
    [at('done') - 0.08, 'grass'],
    [at('larry') - 0.08, 'larry'],
    [at('recovery') - 0.08, 'graph'],
    [at('thagain') - 0.08, 'again'],
  ];
  const cutAt = t => { let c = CUTS[0]; for (const k of CUTS) if (t >= k[0]) c = k; return c[1]; };

  /* =================== TRACK (monday, names, running) =================== */
  const gTrack = G(root), trCam = G(gTrack);
  const track = scTrack(trCam);
  // cover "SPORTS DAY" on the school block: today it is the fitness test
  const ban = G(trCam); tr(ban, 330, 362);
  E('rect', { x: -200, y: -30, width: 400, height: 54, rx: 8, fill: '#C2453A', stroke: '#FFFFFF', 'stroke-width': 3 }, ban);
  T(ban, 0, 8, 'FITNESS TEST · 2.4 km', { size: 28, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  // cones on the grass (they scroll past while she runs)
  const cones = G(trCam), coneEls = [];
  for (let i = 0; i < 2; i++) { const c = G(cones); E('path', { d: 'M-14,0 L0,-36 L14,0 Z', fill: '#FF8A3D', stroke: SC_INK, 'stroke-width': 3, 'stroke-linejoin': 'round' }, c); E('rect', { x: -18, y: -2, width: 36, height: 6, rx: 2, fill: '#FF8A3D', stroke: SC_INK, 'stroke-width': 2 }, c); coneEls.push(c); }
  const startLine = E('rect', { x: 706, y: 460, width: 14, height: 290, fill: '#FFFFFF' }, trCam);
  const kbW = G(trCam), kBody = scKavyaBody(kbW);
  const kHeat = heatWaves(kbW, { n: 3, h: 60, spacing: 24, color: '#FF8A3D' }); tr(kHeat, 0, -230);
  const kDrop = scSweat(kbW, [[-26, -200], [24, -206]]);
  const trOv = G(gTrack);
  const cMon = runLabel(trOv, 'MONDAY', { size: 40, color: LH.signTx, stroke: LH.signTx });
  const cKm = lhChip(trOv, '2.4 km', { size: 60, fill: '#FFE45C', color: '#3A3000', stroke: '#FFFFFF', sw: 4 });
  const cHot = runLabel(trOv, '34 °C', { size: 40, color: '#FFB27A', stroke: '#FFB27A' });
  const cLap = runLabel(trOv, 'LAP 1 of 6', { size: 34, color: '#FFFFFF', stroke: '#FFFFFF' });
  const cNerv = T(trOv, 0, 0, 'gulp.', { size: 34, weight: 700, anchor: 'middle', fill: '#14243A' });
  // close-up: Kavya and the clipboard
  const kClose = G(gTrack);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#0A1B27', opacity: 0.35 }, kClose);
  const kcW = G(kClose);
  const clip = G(kClose); tr(clip, 870, 400);
  E('rect', { x: -154, y: -202, width: 308, height: 405, rx: 22, fill: '#B07A45', stroke: SC_INK, 'stroke-width': 6 }, clip);
  E('rect', { x: -128, y: -163, width: 256, height: 339, fill: '#FFFFFF' }, clip);
  E('rect', { x: -62, y: -224, width: 124, height: 48, rx: 12, fill: '#9AA6B2', stroke: SC_INK, 'stroke-width': 5 }, clip);
  E('path', { d: [0, 1, 2, 3, 4, 5].map(i => `M-97,${-106 + i * 48} L97,${-106 + i * 48}`).join(' '), stroke: '#C9D3DC', 'stroke-width': 5 }, clip);
  const NOTES = [['FITNESS TEST', 290, SC_INK, 800], ['2.4 km', 338, SC_INK, 700], ['34 °C', 387, SC_INK, 700], ['who designed', 435, '#D32F2F', 700], ['this?!', 484, '#D32F2F', 700], ['I WANT NAMES', 532, '#D32F2F', 800]];
  const notes = NOTES.map(([s, y, col, w]) => T(kClose, 870, y, s, { size: 28, weight: w, anchor: 'middle', fill: col, font: FB }));
  const nameLine = E('path', { d: 'M780,544 Q870,552 960,540', fill: 'none', stroke: '#D32F2F', 'stroke-width': 4, 'stroke-linecap': 'round' }, kClose);

  /* =================== MUSCLE cutaway (faster, need) =================== */
  const gMus = G(root), musCam = G(gMus);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#2A0A10', '#4A1018', true) }, musCam);
  const FIB = [180, 300, 420];
  FIB.forEach((y, i) => {
    E('rect', { x: 40 + i * 30, y: y - 50, width: 1120 - i * 30, height: 100, rx: 50, fill: ball(LH.muscle, LH.muscleDk), stroke: SC_INK, 'stroke-width': 4 }, musCam);
    let d = '';
    for (let x = 110 + i * 30; x < 1120; x += 34) d += `M${x},${y - 40} L${x},${y + 40} `;
    E('path', { d, stroke: LH.muscleLt, 'stroke-width': 3, opacity: 0.35 }, musCam);
  });
  const MITO = [[260, 180], [860, 180], [520, 300], [1000, 300], [380, 420], [780, 420]];
  MITO.forEach(([x, y]) => tr(mitochondrion(musCam, 96, 46, { folds: 4 }), x, y));
  const sparks = [0, 3, 4, 1].map((i, j) => { const sp = spark(musCam, 20, { seed: i }); return { sp, i, j }; });
  const musOv = G(gMus);
  const cZoom = runLabel(musOv, 'inside her leg muscle', { size: 30, color: LH.signTx, stroke: LH.signTx });
  const cResp = runLabel(musOv, 'muscle cells **respire faster**', { size: 40, color: '#FFFFFF', stroke: '#FFFFFF', boldFill: LH.signTx });
  const cEnergy = runLabel(musOv, '→ more **energy** released', { size: 34, color: C.energy, stroke: C.energy });
  const resp = G(musOv); tr(resp, 1030, 640);
  // the need: two bars
  const need = G(musOv);
  E('rect', { x: 60, y: 520, width: 1080, height: 200, rx: 22, fill: 'rgba(10,20,28,0.92)', stroke: '#3A4B5C', 'stroke-width': 3 }, need);
  const bO = meter(need, { w: 420, h: 40, color: C.oxygen }); tr(bO, 640, 552);
  const bC = meter(need, { w: 420, h: 40, color: C.co2 }); tr(bC, 640, 642);
  lhRich(need, 600, 584, 'more **oxygen** needed', { size: 34, anchor: 'end', fill: '#FFFFFF', boldFill: '#FF9A8E' });
  lhRich(need, 600, 674, 'more **carbon dioxide** made', { size: 34, anchor: 'end', fill: '#FFFFFF', boldFill: C.co2 });
  const molsIn = [], molsOut = [];
  for (let i = 0; i < 3; i++) molsIn.push(runMol(musOv, 'O2', 16));
  for (let i = 0; i < 3; i++) molsOut.push(runMol(musOv, 'CO2', 14));

  /* =================== BRAIN (control room) =================== */
  const gBrain = G(root), brCam = G(gBrain);
  const brBg = G(brCam);
  const brain = lhBrain(brCam, 1); tr(brain, 420, 270);
  const brDen = G(brCam), brIgg = G(brCam);
  const sigD = arrow(brCam, 380, 400, 320, 520, { color: '#FFD23F', width: 6, head: 22, bend: 20 });
  const sigI = arrow(brCam, 470, 400, 840, 520, { color: '#FFD23F', width: 6, head: 22, bend: -40 });
  [sigD, sigI].forEach(a => a.firstChild.setAttribute('stroke-dasharray', '0.04 0.03'));
  const brOv = G(gBrain);
  const cMon2 = runLabel(brOv, 'the brain monitors **CO_2** in the blood', { size: 32, boldFill: C.co2 });
  const cRise = runLabel(brOv, '**CO_2** rising!', { size: 34, color: C.bad, stroke: C.bad, boldFill: C.bad });
  const cFD = lhChip(brOv, 'breathe **FASTER** and **DEEPER**', { size: 40, fill: '#FFD23F', color: '#3A2A00', stroke: '#FFFFFF', sw: 4 });

  /* =================== COLIN's confessional =================== */
  const gCol = G(root), colCam = G(gCol);
  const colBg = G(colCam);
  const colW = G(colCam);
  const mag = G(colCam); tr(mag, 920, 380);
  E('rect', { x: -150, y: -210, width: 300, height: 420, rx: 6, fill: linGrad('#8E5BD9', '#3A2470', true), stroke: '#FFFFFF', 'stroke-width': 5 }, mag);
  T(mag, 0, -150, 'AIRTIME', { size: 54, weight: 800, anchor: 'middle', fill: '#FFD23F', ls: 2 });
  const magMol = runMol(mag, 'CO2', 34); tr(magMol, 0, -30);
  E('path', { d: 'M-50,-62 L50,-62 M-52,-66 L-12,-66 L-16,-50 Q-32,-42 -48,-50 Z M12,-66 L52,-66 L48,-50 Q32,-42 16,-50 Z', fill: '#1E2630', stroke: '#1E2630', 'stroke-width': 4 }, mag);
  T(mag, 0, 60, "BRAIN'S MOST", { size: 30, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  T(mag, 0, 98, 'WATCHED', { size: 40, weight: 800, anchor: 'middle', fill: '#FFD23F' });
  lhRich(mag, 0, 160, 'CO_2 tells all', { size: 28, anchor: 'middle', fill: '#FFFFFF' });
  const colOv = G(gCol);
  const cNotO = runLabel(colOv, 'the trigger: rising **CO_2** (not low O_2)', { size: 30, boldFill: C.co2 });
  const flashes = [[760, 200], [1080, 560]].map(([x, y]) => { const f = G(colOv); tr(f, x, y); E('circle', { r: 70, fill: glow('#FFFFFF') }, f); E('circle', { r: 18, fill: '#FFFFFF' }, f); return f; });

  /* =================== RATE (Dennis, alarm) =================== */
  const gRate = G(root), rtCam = G(gRate);
  const rtBg = G(rtCam);
  const alarm = E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#FF2020' }, rtCam);
  const beacon = G(rtCam); tr(beacon, 660, 150);
  const beam = G(beacon);
  E('path', { d: 'M0,0 L460,-60 L460,60 Z M0,0 L-460,-60 L-460,60 Z', fill: '#FF5A5A', opacity: 0.22 }, beam);
  E('rect', { x: -40, y: 14, width: 80, height: 18, rx: 6, fill: '#4A4A55', stroke: SC_INK, 'stroke-width': 3 }, beacon);
  E('path', { d: 'M-30,16 L-30,-6 Q-30,-36 0,-36 Q30,-36 30,-6 L30,16 Z', fill: ball('#FF4A4A', '#A51C1C'), stroke: SC_INK, 'stroke-width': 3 }, beacon);
  const rtDen = G(rtCam);
  const dialR = runDial(rtCam, 150, 'breaths per minute'); tr(dialR, 880, 360);
  const rtOv = G(gRate);
  const cRate = lhChip(rtOv, '**breathing rate** ↑', { size: 44, fill: LH.muscle, color: '#FFFFFF', stroke: '#FFFFFF', sw: 4 });

  /* =================== DEPTH (Iggy, the chest) =================== */
  const gDep = G(root), dpCam = G(gDep);
  const dpBg = G(dpCam);
  const dpIgg = G(dpCam);
  const chW = G(dpCam); tr(chW, 840, 400, 0.58);
  const chest = lhChest(chW);
  const depthBar = G(dpCam); tr(depthBar, 1070, 190);
  const dMeter = meter(depthBar, { w: 34, h: 300, vertical: true, color: C.air });
  T(depthBar, 17, 340, 'depth', { size: 26, weight: 700, anchor: 'middle', fill: C.air });
  const dpOv = G(gDep);
  const cDepth = lhChip(dpOv, '**breathing depth** ↑ · bigger breaths', { size: 36, fill: '#3F7FD9', color: '#FFFFFF', stroke: '#FFFFFF', sw: 4 });
  const cBest = lhChip(dpOv, 'BEST DAY EVER', { size: 34, fill: '#FFD23F', color: '#3A2A00', stroke: '#FFFFFF', sw: 3 });

  /* =================== HEART =================== */
  const gHeart = G(root);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#1A0810', '#3A0E1A', true) }, gHeart);
  E('ellipse', { cx: 330, cy: 360, rx: 260, ry: 220, fill: glow('#FF4A5A'), opacity: 0.4 }, gHeart);
  const artery = 'M330,470 C380,560 600,520 760,540 S1040,560 1150,520';
  E('path', { d: artery, fill: 'none', stroke: SC_INK, 'stroke-width': 40, 'stroke-linecap': 'round' }, gHeart);
  const artP = E('path', { d: artery, fill: 'none', stroke: LH.artery, 'stroke-width': 30, 'stroke-linecap': 'round' }, gHeart);
  const cells = [0, 1, 2, 3].map(() => E('ellipse', { rx: 16, ry: 8, fill: '#FF9A9A', stroke: '#B32635', 'stroke-width': 2 }, gHeart));
  const heartG = G(gHeart); tr(heartG, 330, 360);
  const heartS = G(heartG);
  E('path', { d: RUN_HEART, fill: ball('#FF4A5A', '#A51C2A'), stroke: SC_INK, 'stroke-width': 3, transform: 'scale(2.6)' }, heartS);
  E('path', { d: 'M-40,-80 Q-60,-120 -30,-140 M20,-90 Q24,-130 50,-140', fill: 'none', stroke: LH.artery, 'stroke-width': 18, 'stroke-linecap': 'round' }, heartS);
  const mon = G(gHeart); tr(mon, 860, 290);
  E('rect', { x: -230, y: -150, width: 460, height: 300, rx: 22, fill: '#0B1410', stroke: '#3A4B5C', 'stroke-width': 6 }, mon);
  T(mon, -200, -100, 'HEART RATE', { size: 30, weight: 800, fill: '#56D69B' });
  const ecg = E('path', { d: '', fill: 'none', stroke: '#56D69B', 'stroke-width': 4, 'stroke-linejoin': 'round' }, mon);
  const bpm = T(mon, 120, 110, '80', { size: 72, weight: 800, anchor: 'end', fill: '#FFFFFF' });
  T(mon, 134, 110, 'bpm', { size: 32, weight: 700, fill: '#56D69B' });
  const hOv = G(gHeart);
  const cHR = lhChip(hOv, '**heart rate** ↑', { size: 44, fill: '#E8424F', color: '#FFFFFF', stroke: '#FFFFFF', sw: 4 });
  const cBlood = runLabel(hOv, 'more **oxygen-rich blood** to the muscles, faster', { size: 32, boldFill: '#FF8A8A' });
  // sample the artery once at build time (no layout queries per frame)
  const ARTPTS = [];
  { const L = artP.getTotalLength ? artP.getTotalLength() : 0; for (let i = 0; i <= 60; i++) { const q = L ? artP.getPointAtLength(L * i / 60) : { x: 330 + i * 13, y: 520 }; ARTPTS.push([q.x, q.y]); } }

  /* =================== GRASS (done, debt) =================== */
  const gGrass = G(root), grCam = G(gGrass);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#6BCB6A', '#3E9A4A', true) }, grCam);
  let blades = '';
  const gr = rng(52);
  for (let i = 0; i < 90; i++) { const x = gr() * 1200, y = gr() * 750; blades += `M${x.toFixed(0)},${y.toFixed(0)} l-4,-16 M${(x + 6).toFixed(0)},${y.toFixed(0)} l4,-18 `; }
  E('path', { d: blades, stroke: '#2F7A3A', 'stroke-width': 3, 'stroke-linecap': 'round', opacity: 0.6 }, grCam);
  E('rect', { x: 0, y: 690, width: 1200, height: 14, fill: '#FFFFFF', opacity: 0.85 }, grCam);   // the finish line
  const lie = G(grCam);
  // legs and shorts in the body's own frame (they rotate with her)
  E('rect', { x: -70, y: 132, width: 140, height: 74, rx: 16, fill: '#1E2A44', stroke: SC_INK, 'stroke-width': 4 }, lie);
  E('path', { d: 'M-36,200 L-52,350 M36,200 L60,350', stroke: '#B9784E', 'stroke-width': 30, 'stroke-linecap': 'round' }, lie);
  E('path', { d: 'M-66,350 L-30,358 M48,354 L86,352', stroke: '#F2F7FA', 'stroke-width': 26, 'stroke-linecap': 'round' }, lie);
  const lieK = G(lie);
  const puffs = [0, 1, 2].map(() => E('circle', { r: 26, fill: '#FFFFFF', stroke: '#CFE7F5', 'stroke-width': 3 }, grCam));
  const grOv = G(gGrass);
  const cFin = runLabel(grOv, '2.4 km ✓ finished', { size: 34, color: C.good, stroke: C.good });
  const inv = G(grOv); tr(inv, 330, 300);
  E('rect', { x: -220, y: -170, width: 440, height: 330, rx: 10, fill: '#FFFDF5', stroke: SC_INK, 'stroke-width': 4 }, inv);
  E('rect', { x: -220, y: -170, width: 440, height: 56, rx: 10, fill: '#D32F2F' }, inv);
  T(inv, 0, -130, 'INVOICE', { size: 32, weight: 800, anchor: 'middle', fill: '#FFFFFF', ls: 4 });
  T(inv, 0, -66, 'OXYGEN DEBT', { size: 44, weight: 800, anchor: 'middle', fill: '#D32F2F' });
  T(inv, -190, -14, 'extra oxygen needed', { size: 28, weight: 700, fill: SC_INK, font: FB });
  T(inv, -190, 24, 'to break down', { size: 28, weight: 700, fill: SC_INK, font: FB });
  T(inv, -190, 64, 'lactic acid', { size: 34, weight: 800, fill: C.lacticDk });
  E('path', { d: 'M-190,92 L190,92', stroke: '#C9D3DC', 'stroke-width': 3 }, inv);
  T(inv, -190, 134, 'pay by: panting', { size: 28, weight: 700, fill: '#5A6B7A', font: FB });
  const musP = G(grOv); tr(musP, 870, 300);
  E('rect', { x: -220, y: -170, width: 440, height: 330, rx: 22, fill: linGrad('#5A1420', '#8E1F2A', true), stroke: SC_INK, 'stroke-width': 4 }, musP);
  T(musP, 0, -126, 'leg muscle', { size: 30, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  const LA = [], lr = rng(9);
  for (let i = 0; i < 9; i++) LA.push({ el: E('circle', { r: 11, fill: C.lactic, stroke: C.lacticDk, 'stroke-width': 3 }, musP), x: -150 + lr() * 300, y: -70 + lr() * 140, k: i / 9 });
  const oxIn = [0, 1, 2].map(() => runMol(musP, 'O2', 15));
  const laLbl = lhRich(musP, 0, 132, '**lactic acid** broken down', { size: 28, anchor: 'middle', fill: '#FFFFFF', boldFill: '#FF9BC8' });

  /* =================== LARRY (control room floor) =================== */
  const gLar = G(root), lrCam = G(gLar);
  const lrBg = G(lrCam);
  let fp = '';
  for (let i = 0; i < 6; i++) { const x = 1180 - i * 70, y = 650 + (i % 2) * 26; fp += `M${x},${y} m-14,0 a14,10 0 1,0 28,0 a14,10 0 1,0 -28,0 `; }
  E('path', { d: fp, fill: C.lactic, opacity: 0.55 }, lrCam);
  const lrDen = G(lrCam);
  const band = G(lrCam); tr(band, 800, 660);
  E('ellipse', { rx: 74, ry: 22, fill: 'none', stroke: SC_INK, 'stroke-width': 22 }, band);
  E('ellipse', { rx: 74, ry: 22, fill: 'none', stroke: '#FFFFFF', 'stroke-width': 14 }, band);
  E('path', { d: 'M-10,-28 L12,-28 L2,-16 Z', fill: '#FF3E3E' }, band);
  E('ellipse', { cx: 40, cy: 14, rx: 12, ry: 6, fill: C.lactic, opacity: 0.8 }, band);
  const lrOv = G(gLar);
  const cLarry = runLabel(lrOv, "Larry's headband (lactic acid, Ep 2)", { size: 28, color: '#FF9BC8', stroke: C.lactic });

  /* =================== GRAPH (recovery rate) =================== */
  const gGraph = G(root);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#0A1B27', '#0F2C3A', true) }, gGraph);
  const OX = 180, OY = 590, XE = 1120, Y_REST = 520, Y_PEAK = 250, X_EX = 340, X_STOP = 620;
  E('path', { d: `M${OX},170 L${OX},${OY} L${XE},${OY}`, fill: 'none', stroke: '#A4BCCB', 'stroke-width': 5, 'stroke-linecap': 'round' }, gGraph);
  E('path', { d: `M${X_EX},180 L${X_EX},${OY} M${X_STOP},180 L${X_STOP},${OY}`, stroke: '#2C5468', 'stroke-width': 3, 'stroke-dasharray': '10 8' }, gGraph);
  E('path', { d: `M${OX},${Y_REST} L${XE},${Y_REST}`, stroke: '#2C5468', 'stroke-width': 2, 'stroke-dasharray': '4 8' }, gGraph);
  T(gGraph, 0, 0, 'breaths per minute', { size: 28, weight: 700, anchor: 'middle', fill: '#A4BCCB' }).setAttribute('transform', `translate(130 ${(170 + OY) / 2}) rotate(-90)`);
  T(gGraph, (OX + X_EX) / 2, 632, 'rest', { size: 28, weight: 700, anchor: 'middle', fill: '#A4BCCB' });
  T(gGraph, (X_EX + X_STOP) / 2, 632, 'exercise', { size: 28, weight: 700, anchor: 'middle', fill: '#FF8A3D' });
  T(gGraph, (X_STOP + XE) / 2, 632, 'recovery', { size: 28, weight: 700, anchor: 'middle', fill: '#56D69B' });
  T(gGraph, 650, 690, 'time →', { size: 28, weight: 700, anchor: 'middle', fill: '#A4BCCB' });
  const curve = tau => {   // tau = recovery time constant (px)
    const pts = [];
    for (let x = OX; x <= XE; x += 10) {
      let y;
      if (x < X_EX) y = Y_REST;
      else if (x < X_STOP) y = Y_REST - (Y_REST - Y_PEAK) * (1 - Math.exp(-(x - X_EX) / 50));
      else { const top = Y_REST - (Y_REST - Y_PEAK) * (1 - Math.exp(-(X_STOP - X_EX) / 50)); y = Y_REST - (Y_REST - top) * Math.exp(-(x - X_STOP) / tau); }
      pts.push([x, y]);
    }
    return 'M' + pts.map(p => p[0] + ',' + p[1].toFixed(1)).join(' L');
  };
  const cvSlow = E('path', { d: curve(170), fill: 'none', stroke: '#FF8A3D', 'stroke-width': 8, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', pathLength: 1, 'stroke-dasharray': '1 1' }, gGraph);
  const cvFast = E('path', { d: curve(55), fill: 'none', stroke: '#56D69B', 'stroke-width': 8, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', pathLength: 1, 'stroke-dasharray': '1 1' }, gGraph);
  const lFit = T(gGraph, 740, 574, 'fitter: back to normal fast', { size: 28, weight: 800, fill: '#56D69B' });
  const lSlow = T(gGraph, 820, 370, 'less fit: slower', { size: 28, weight: 800, fill: '#FF8A3D' });
  const cRec = lhChip(gGraph, '**recovery rate**: how fast breathing gets back to normal', { size: 30, fill: 'rgba(10,27,39,0.95)', stroke: '#56D69B', sw: 3, boldFill: '#56D69B' });
  tr(cRec, 660, 140);

  /* =================== AGAIN (Dennis's confessional, Iggy's star jumps) =================== */
  const gAg = G(root), agCam = G(gAg);
  const agBg = G(agCam);
  const agIgg = G(agCam), agDen = G(agCam);
  const agOv = G(gAg);
  const denied = runStamp(agOv, 'REQUEST DENIED', { size: 40, color: C.bad });

  const SHOTS = { track: gTrack, kclose: gTrack, running: gTrack, muscle: gMus, brain: gBrain, colin: gCol, rate: gRate, depth: gDep, heart: gHeart, grass: gGrass, larry: gLar, graph: gGraph, again: gAg };
  const COLIN = cast(colW, 'colin', { mood: 'smug' });

  // heartbeats: bpm climbs 80 -> 165 over 3 s from the start of "heart"; beats(t) = integral of bpm / 60
  const H0 = at('heart') + 0.3, HT = 3;
  const beats = t => { const u = Math.max(0, t - H0); return (80 * u + 85 * (u < HT ? u * u / (2 * HT) : HT / 2 + (u - HT))) / 60; };
  const beatPulse = b => { const f = b - Math.floor(b); return Math.exp(-f * 9); };
  const ecgAt = b => { const f = b - Math.floor(b); return f < 0.06 ? -Math.sin(f / 0.06 * Math.PI) * 70 : f < 0.1 ? Math.sin((f - 0.06) / 0.04 * Math.PI) * 22 : f > 0.4 && f < 0.55 ? -Math.sin((f - 0.4) / 0.15 * Math.PI) * 14 : 0; };

  return t => {
    const shot = cutAt(t);
    for (const k in SHOTS) op(SHOTS[k], 0);
    op(SHOTS[shot], 1);
    const fast = wave(t, 1.5) * AMP;   // the "run" breathing rhythm for Dennis and Iggy

    /* ---------- TRACK ---------- */
    if (shot === 'track' || shot === 'kclose' || shot === 'running') {
      const running = shot === 'running';
      track.upd(t, running ? 520 : 0);
      op(kClose, shot === 'kclose' ? 1 : 0);
      op(kbW, shot === 'kclose' ? 0 : 1);
      [cMon, cKm, cHot, cLap, cNerv].forEach(e => op(e, 0));
      if (shot === 'track') {
        runCam(trCam, 1 + 0.04 * P(t, 0, at('names'), linear), 660, 520);
        const shiver = Math.sin(t * 40) * 1.5 * AMP;
        tr(kbW, 660 + shiver, 640, 1.35);
        kBody.pose({ lean: -2, armL: [10, 30], armR: [-10, 30], legL: [4, -2], legR: [-4, -2] });
        kHeat.upd(t); kDrop.set(0.8, t); op(kHeat, 1);
        coneEls.forEach((c, i) => tr(c, 160 + i * 130, 450));
        op(startLine, 1);
        runPop(cMon, t, mid('monday', 0.04), 900, 200);
        runPop(cKm, t, mid('monday', 0.55), 900, 300);
        runPop(cHot, t, mid('monday', 0.92), 900, 400);
        op(cHot, P(t, mid('monday', 0.92), 0.2, linear));
        op(cNerv, P(t, mid('monday', 0.7), 0.3, linear)); tr(cNerv, 548, 395, 1);
      } else if (shot === 'kclose') {
        runCam(trCam, 1.6, 420, 470);
        runSeat(KAV, kcW);
        const push = t > end('names') ? 1 + 0.06 * P(t, end('names'), 0.6, ease) : 1;
        tr(KAV, 400, 440 + (push - 1) * 40, 1.5 * push);
        KAV.set({ t, talk: talk(t, 'kavya'), mood: t < mid('names', 0.5) ? 'annoyed' : 'annoyed', look: t > mid('names', 0.5) && t < mid('names', 0.75) ? 0.7 : 0, sweat: 1 });
        const reveal = [mid('names', 0.0), mid('names', 0.12), mid('names', 0.33), mid('names', 0.52), mid('names', 0.62), mid('names', 0.82)];
        notes.forEach((n, i) => op(n, P(t, reveal[i], 0.25, linear)));
        op(nameLine, P(t, reveal[5] + 0.3, 0.2, linear));
      } else {   // running
        runCam(trCam, 1, 600, 400);
        op(startLine, 0);
        tr(kbW, 560, 690, 1.35);
        kBody.pose(runPose(t, 1.7));
        kHeat.upd(t); kDrop.set(1, t);
        coneEls.forEach((c, i) => tr(c, ((1300 + i * 660 - (t - at('faster')) * 520) % 1320 + 1320) % 1320 - 60, 450));
        runPop(cLap, t, at('faster') + 0.1, 980, 200);
      }
    }

    /* ---------- MUSCLE ---------- */
    if (shot === 'muscle') {
      const lc = t - mid('faster', 0.4);
      runCam(musCam, 1.12 - 0.12 * P(t, mid('faster', 0.4), 0.8, easeOut), 600, 300);
      const rate = 1 + 1.5 * P(t, mid('faster', 0.5), 1.5, linear);
      sparks.forEach(({ sp, i, j }) => {
        const ph = (lc * rate * 1.1 + j * 0.27) % 1;
        op(sp, ph < 0.45 ? 1 - ph / 0.45 : 0); sp.upd(t);
        tr(sp, MITO[i][0] + 40, MITO[i][1] - 30, 0.6 + 0.8 * (ph < 0.45 ? ph / 0.45 : 0));
      });
      const isNeed = t >= at('need') - 0.08;
      runPop(cZoom, t, mid('faster', 0.42), 860, 100);   // right of the chapter tag
      op(cZoom, isNeed ? 0 : 1);
      runPop(cResp, t, mid('faster', 0.5), 600, 580); op(cResp, isNeed ? 0 : P(t, mid('faster', 0.5), 0.2, linear));
      runPop(cEnergy, t, mid('faster', 0.75), 600, 660); op(cEnergy, isNeed ? 0 : P(t, mid('faster', 0.75), 0.2, linear));
      op(need, isNeed ? 1 : 0);
      bO.set(isNeed ? 0.3 + 0.62 * P(t, mid('need', 0.15), 1.2, ease) : 0);
      bC.set(isNeed ? 0.3 + 0.62 * P(t, mid('need', 0.55), 1.2, ease) : 0);
      molsIn.forEach((m, i) => {
        const f = ((t - at('need')) * 0.35 + i / 3) % 1;
        op(m, isNeed && t > mid('need', 0.1) ? Math.min(1, f * 6, (1 - f) * 6) : 0);
        tr(m, lerp(-30, 700, f), 240 + (i % 3) * 60 + Math.sin(t * 3 + i) * 6);
      });
      molsOut.forEach((m, i) => {
        const f = ((t - at('need')) * 0.35 + i / 3 + 0.1) % 1;
        op(m, isNeed && t > mid('need', 0.5) ? Math.min(1, f * 6, (1 - f) * 6) : 0);
        tr(m, lerp(560, 1230, f), 270 + (i % 2) * 120 + Math.sin(t * 3 + i) * 6);
      });
    }

    /* ---------- BRAIN ---------- */
    if (shot === 'brain') {
      runSeat(CTRL, brBg);
      runCam(brCam, 1.04 - 0.04 * P(t, at('brain') - 0.08, 0.6, easeOut), 600, 400);
      const g = 0.3 + 0.6 * P(t, mid('brain', 0.15), 2.2, ease) + 0.03 * Math.sin(t * 20) * P(t, mid('brain', 0.5), 0.3, linear);
      brain.set(g);
      runSeat(DEN, brDen); runSeat(IGG, brIgg);
      const sig = P(t, mid('brain', 0.6), 0.5, linear);
      sigD.set(sig); sigI.set(sig);
      [sigD, sigI].forEach(a => a.firstChild.setAttribute('stroke-dashoffset', (sig >= 1 ? -(t * 0.3) % 1 : 1 - sig).toFixed(3)));
      const hit = t > mid('brain', 0.68);
      const go = hit ? fast : wave(t, 4) * AMP;
      tr(DEN, 320, 620, 0.75);
      DEN.set({ t, talk: 0, mood: hit ? 'shock' : 'deadpan', look: -0.4, flat: go, sweat: hit ? 1 : 0 });
      tr(IGG, 880, 620, 0.7);
      IGG.set({ t, talk: 0, mood: 'happy', look: -0.8, lift: go, sweat: hit ? 1 : 0 });
      runPop(cMon2, t, mid('brain', 0.05), 860, 190);
      op(cRise, 0);
      if (t > mid('brain', 0.4)) { runPop(cRise, t, mid('brain', 0.42), 860, 290); }
      runPop(cFD, t, mid('brain', 0.66), 860, 400);
      op(cFD, P(t, mid('brain', 0.66), 0.2, linear));
    }

    /* ---------- COLIN ---------- */
    if (shot === 'colin') {
      runConf(colBg, 'colin', t);
      const k = 1 + 0.06 * P(t, mid('thcolin', 0.75), end('thcolin') + 0.6 - mid('thcolin', 0.75), linear);
      runCam(colCam, k, 430, 400);
      tr(COLIN, 430, 410, 1.5);
      COLIN.set({ t, talk: talk(t, 'colin'), mood: 'smug', look: t > mid('thcolin', 0.45) && t < mid('thcolin', 0.7) ? 0.8 : 0 });
      runPop(mag, t, mid('thcolin', 0.62), 920, 380, 1, 4);
      runPop(cNotO, t, mid('thcolin', 0.12), 640, 670);
      op(cNotO, P(t, mid('thcolin', 0.12), 0.2, linear));
      flashes.forEach((f, i) => { const t0 = mid('thcolin', 0.8) + i * 0.13; op(f, t > t0 && t < t0 + 0.16 ? 1 - (t - t0) / 0.16 : 0); });
    }

    /* ---------- RATE ---------- */
    if (shot === 'rate') {
      runSeat(CTRL, rtBg);
      runSeat(DEN, rtDen);
      const shake = Math.sin(t * 50) * 3 * AMP;
      runCam(rtCam, 1.02, 600, 400, 600 + shake, 400);
      op(alarm, 0.08 + 0.14 * wave(t, 0.6) * AMP);
      tr(beam, 0, 0, 1, (t * 240 * AMP) % 360);
      const flat = wave(t, 1.2) * AMP;
      tr(DEN, 380, 470, 1.35);
      DEN.set({ t, talk: talk(t, 'dennis'), mood: 'shock', look: 0, flat, sweat: 1 });
      const v = P(t, at('rate') + 0.2, 2.6, ease);
      dialR.set(0.18 + 0.68 * v + 0.02 * Math.sin(t * 17));
      setText(dialR.num, String(Math.round(12 + 18 * v)));
      runPop(cRate, t, mid('rate', 0.12), 880, 620);
    }

    /* ---------- DEPTH ---------- */
    if (shot === 'depth') {
      runSeat(CTRL, dpBg);
      runSeat(IGG, dpIgg);
      runCam(dpCam, 1, 600, 400);
      const big = 0.45 + 0.55 * P(t, at('depth') + 0.2, 1.5, ease);
      const b = wave(t, 1.5) * big;
      tr(IGG, 380, 450, 1.35);
      IGG.set({ t, talk: talk(t, 'iggy'), mood: 'happy', look: t < mid('depth', 0.4) ? 0.5 : 0, lift: b, sweat: 1 });
      chest.set(b, Math.cos(TAU * t / 1.5) < 0 ? 0.4 : -0.4);
      dMeter.set(b);
      runPop(cDepth, t, mid('depth', 0.12), 640, 670);
      const best = mid('depth', 0.55);
      runPop(cBest, t, best, 380, 200, 1 + 0.06 * Math.sin(t * 9) * AMP, -4); op(cBest, P(t, best, 0.2, linear));
    }

    /* ---------- HEART ---------- */
    if (shot === 'heart') {
      const b = beats(t), pl = beatPulse(b);
      tr(heartS, 0, 0, 1 + 0.1 * pl * (S.reduce ? 0.5 : 1));
      let d = '';
      for (let i = 0; i <= 60; i++) { const tt = t - (60 - i) * 0.04; d += (i ? 'L' : 'M') + (-200 + i * 6.6).toFixed(1) + ',' + (10 + ecgAt(beats(tt))).toFixed(1) + ' '; }
      attr(ecg, 'd', d);
      const v = clamp((t - H0) / HT);
      setText(bpm, String(Math.round(80 + 85 * v)));
      const speed = 0.25 + 0.35 * v;
      cells.forEach((c, i) => { const f = ((t * speed) + i / 4) % 1, k = f * 60, a = ARTPTS[Math.floor(k)], b = ARTPTS[Math.min(60, Math.floor(k) + 1)], u = k - Math.floor(k); tr(c, lerp(a[0], b[0], u), lerp(a[1], b[1], u)); op(c, Math.min(1, f * 8, (1 - f) * 8)); });
      runPop(cHR, t, mid('heart', 0.12), 860, 510);
      runPop(cBlood, t, mid('heart', 0.5), 620, 660);
      op(cBlood, P(t, mid('heart', 0.5), 0.2, linear));
    }

    /* ---------- GRASS ---------- */
    if (shot === 'grass') {
      const isDebt = t >= at('debt') - 0.08;
      const k = isDebt ? 1 : 1.25 + 0.04 * P(t, at('done'), 2.6, linear);
      runCam(grCam, k, 560, 560);
      runSeat(KAV, lieK);
      tr(lie, 520, 600, 1, -80);
      tr(KAV, 0, 0, 1);
      const pant = wave(t, 0.7) * AMP;
      KAV.set({ t, talk: talk(t, 'kavya'), mood: isDebt ? 'sad' : 'sad', look: 0, sweat: 1, still: true });
      lieK.setAttribute('transform', `translate(0 ${(-4 * pant).toFixed(1)})`);
      puffs.forEach((p, i) => { const f = (t * 1.2 + i / 3) % 1; tr(p, 440 - f * 40, 560 - f * 110, 0.4 + f * 0.8); op(p, (1 - f) * 0.85); });
      op(cFin, isDebt ? 0 : 1); if (!isDebt) runPop(cFin, t, mid('done', 0.15), 900, 180);
      op(inv, 0); op(musP, 0);
      if (isDebt) {
        runPop(inv, t, mid('debt', 0.05), 330, 290);
        runPop(musP, t, mid('debt', 0.45), 870, 290);
        const fade = P(t, mid('debt', 0.6), 2.0, linear);
        LA.forEach(a => { op(a.el, 1 - clamp(fade * 1.6 - a.k * 0.6)); attr(a.el, 'cx', a.x); attr(a.el, 'cy', a.y + Math.sin(t * 2 + a.k * 9) * 3); });
        oxIn.forEach((m, i) => { const f = ((t - mid('debt', 0.5)) * 0.4 + i / 3) % 1; op(m, t > mid('debt', 0.55) ? Math.min(1, f * 5, (1 - f) * 5) : 0); tr(m, lerp(-200, 170, f), -60 + i * 40); });
        op(laLbl, P(t, mid('debt', 0.75), 0.3, linear));
      }
    }

    /* ---------- LARRY ---------- */
    if (shot === 'larry') {
      runSeat(CTRL, lrBg);
      runSeat(DEN, lrDen);
      const k = 1 + 0.06 * P(t, end('larry'), 0.7, linear);
      runCam(lrCam, k, 470, 470);
      tr(DEN, 450, 450, 1.35);
      DEN.set({ t, talk: talk(t, 'dennis'), mood: 'deadpan', look: t < mid('larry', 0.55) ? 0.9 : 0, flat: wave(t, 2.4) * 0.6 * AMP, sweat: 0.6 });
      tr(band, 800, 660, 1, Math.sin(t * 1.3) * 2 * AMP);
      runPop(cLarry, t, mid('larry', 0.25), 850, 515);
      op(cLarry, P(t, mid('larry', 0.25), 0.2, linear));
    }

    /* ---------- GRAPH ---------- */
    if (shot === 'graph') {
      const drawn = P(t, at('recovery') + 0.1, 2.6, linear);
      const recov = P(t, mid('recovery', 0.45), 2.2, linear);
      // both lines share the rest + exercise part; then split in the recovery
      const shared = (X_STOP - OX) / (XE - OX);
      const pS = Math.min(drawn, shared) + (drawn >= shared ? recov * (1 - shared) : 0);
      cvSlow.setAttribute('stroke-dashoffset', (1 - pS).toFixed(4));
      cvFast.setAttribute('stroke-dashoffset', (1 - pS).toFixed(4));
      op(lFit, P(t, mid('recovery', 0.55), 0.3, linear));
      op(lSlow, P(t, mid('recovery', 0.62), 0.3, linear));
      op(cRec, P(t, mid('recovery', 0.72), 0.3, linear));
    }

    /* ---------- AGAIN ---------- */
    if (shot === 'again') {
      runConf(agBg, 'dennis', t);
      runSeat(IGG, agIgg); runSeat(DEN, agDen);
      const k = 1 + 0.06 * P(t, mid('thagain', 0.8), end('thagain') + 0.8 - mid('thagain', 0.8), linear);
      runCam(agCam, k, 430, 420);
      const no = mid('thagain', 0.72), sulk = t > no && t < no + 0.9;
      const jump = sulk ? 0 : Math.abs(Math.sin((t - at('thagain')) * Math.PI * 1.4)) * AMP;
      tr(IGG, 900, 430 - 70 * jump, 0.8);
      IGG.set({ t, talk: 0, mood: sulk ? 'sad' : 'happy', look: sulk ? -0.8 : 0, lift: jump, sweat: 1 });
      tr(DEN, 420, 440, 1.5);
      DEN.set({ t, talk: talk(t, 'dennis'), mood: 'deadpan', look: t > mid('thagain', 0.1) && t < mid('thagain', 0.4) ? 0.8 : 0, flat: wave(t, 2) * 0.7 * AMP, sweat: 1 });
      denied.set(P(t, no, 0.35, linear), 900, 640, -6);
    }
  };
});
