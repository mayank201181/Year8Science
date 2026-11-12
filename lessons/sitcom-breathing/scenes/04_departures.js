/* Scene 4: "Departures" (air in vs air out, the limewater test).
   Shots (hard sitcom cuts): the departures board "AIR IN vs AIR OUT" (oxygen 21% -> 16%, with bars; Nigel drifts
   behind) -> Colin by a plane window where the oxygen is still asleep in its seats (rescue breaths work)
   -> board: carbon dioxide 0.04% -> 4%, x100 stamp, Colin in a spotlight, TRENDING -> Kavya (inset): pure CO2?
   -> Colin, sunglasses down, beside a pie chart of breathed-out air (a thin 4% slice: Colin)
   -> board: water vapour (a cold window fogs up), temperature warmer, nitrogen 78% -> 78% UNCHANGED as Nigel walks
      straight through -> Dennis's confessional, Nigel drifting past the window -> limewater: clear -> cloudy
   -> Colin's red carpet between two cloudy test tubes -> breathed-out air vs room air, a stopwatch on each. */
scene('departures', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;
  const INK = SC_INK;

  /* ---------------- local helpers (prefixed dep) ---------------- */
  const depPop = (el, x, y, p, s0, r) => { op(el, clamp(p * 2.5)); tr(el, x, y, Math.max(0.01, (s0 || 1) * (0.72 + 0.28 * clamp(p, 0, 1.2))), r); };
  const depCam = (g, k, fx, fy) => g.setAttribute('transform', Math.abs(k - 1) < 1e-4 ? '' : `translate(${fx} ${fy}) scale(${k.toFixed(4)}) translate(${-fx} ${-fy})`);
  const depLabel = (parent, text, o) => { o = o || {}; return lhChip(parent, text, { size: o.size || 30, fill: o.fill || 'rgba(10,20,30,0.9)', stroke: o.stroke || 'rgba(255,255,255,0.35)', sw: 2, color: o.color || C.ink, boldFill: o.boldFill || LH.signTx, weight: o.weight || 700 }); };
  const depMix = (a, b, p) => { const h = s => [1, 3, 5].map(i => parseInt(s.slice(i, i + 2), 16)); const A = h(a), B = h(b); return '#' + A.map((v, i) => Math.round(lerp(v, B[i], clamp(p))).toString(16).padStart(2, '0')).join(''); };
  // a rubber stamp
  function depStamp(parent, text, col) {
    const g = G(parent), w = textWidth(text, 40, FD, 800) + 40;
    E('rect', { x: -w / 2, y: -34, width: w, height: 68, rx: 10, fill: 'rgba(255,255,255,0.08)', stroke: col, 'stroke-width': 6 }, g);
    T(g, 0, 15, text, { size: 40, weight: 800, anchor: 'middle', fill: col, ls: 2 });
    return g;
  }
  // a stopwatch; g.set(seconds) turns the hand
  function depWatch(parent) {
    const g = G(parent);
    E('rect', { x: -12, y: -72, width: 24, height: 18, rx: 4, fill: '#9AA6B2', stroke: INK, 'stroke-width': 3 }, g);
    E('circle', { r: 54, fill: '#F7FAFC', stroke: INK, 'stroke-width': 6 }, g);
    let d = ''; for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; d += `M${(Math.cos(a) * 40).toFixed(1)},${(Math.sin(a) * 40).toFixed(1)} L${(Math.cos(a) * 48).toFixed(1)},${(Math.sin(a) * 48).toFixed(1)} `; }
    E('path', { d, stroke: INK, 'stroke-width': 3 }, g);
    const hand = E('line', { x1: 0, y1: 6, x2: 0, y2: -42, stroke: '#D32F2F', 'stroke-width': 5, 'stroke-linecap': 'round' }, g);
    E('circle', { r: 6, fill: INK }, g);
    g.set = s => hand.setAttribute('transform', `rotate(${(s * 60).toFixed(1)})`);
    g.set(0);
    return g;
  }

  /* ---------------- shot list ---------------- */
  const SH = [['board', -1e9], ['plane', at('plane') - 0.06], ['boardB', at('me') - 0.06], ['pie', at('wish') - 0.06],
    ['boardC', at('vapour') - 0.06], ['conf', at('thnigel') - 0.06], ['lab', at('lime') - 0.06], ['carpet', at('carpet') - 0.06], ['proves', at('proves') - 0.06]];
  const shotAt = t => { let k = 0; for (let i = 0; i < SH.length; i++) if (t >= SH[i][1]) k = i; return SH[k][0]; };

  const kinCp = E('clipPath', { id: 'depKinCp' }, defs()); E('rect', { x: -146, y: -101, width: 292, height: 202, rx: 11 }, kinCp);
  const winCp = E('clipPath', { id: 'depWinCp' }, defs()); E('rect', { x: 712, y: 122, width: 306, height: 226, rx: 12 }, winCp);

  /* ---------------- layers ---------------- */
  const cam = G(root), BG = G(cam), PR = G(cam), CA = G(cam), FG = G(cam), HUD = G(root);
  const ALL = [];
  const M = el => { ALL.push(el); return el; };

  /* ---------------- sets ---------------- */
  const term = M(lhTerminal(BG));
  const termDim = M(E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#1A0810', opacity: 0.35 }, BG));
  const cabin = M(G(BG));
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#DCE3EA', '#AEB9C4', true) }, cabin);
  E('rect', { x: 0, y: 600, width: 1200, height: 150, fill: '#5A6573' }, cabin);
  E('path', { d: 'M0,120 L1200,120 M0,600 L1200,600', stroke: '#8A96A3', 'stroke-width': 6 }, cabin);
  const confD = M(lhConf(BG, 'dennis'));
  const lab = M(G(BG));
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#D5E6EE', '#B6CCD8', true) }, lab);
  { let d = ''; for (let x = 0; x <= 1200; x += 80) d += `M${x},0 L${x},560 `; for (let y = 0; y <= 560; y += 80) d += `M0,${y} L1200,${y} `; E('path', { d, stroke: '#FFFFFF', 'stroke-width': 3, opacity: 0.6 }, lab); }
  E('rect', { x: 0, y: 560, width: 1200, height: 190, fill: '#5E4A3A' }, lab);
  E('rect', { x: 0, y: 556, width: 1200, height: 16, fill: '#8A6A4A' }, lab);
  const gala = M(G(BG));
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#120A1C', '#2A1438', true) }, gala);
  E('path', { d: 'M560,300 L640,300 L940,750 L260,750 Z', fill: linGrad('#E23A4A', '#9E1626', true) }, gala);
  E('path', { d: 'M560,300 L260,750 M640,300 L940,750', stroke: '#FFD23F', 'stroke-width': 5 }, gala);
  const galaGlow = E('ellipse', { cx: 600, cy: 300, rx: 300, ry: 90, fill: glow('#FFE45C'), opacity: 0.4 }, gala);

  /* ---------------- the board ---------------- */
  const BX = 400, BW = 720, BT = 150, RH = 64, RY0 = BT + 128;
  const board = M(G(PR));
  E('rect', { x: BX - BW / 2, y: BT, width: BW, height: 128 + 5 * RH + 16, rx: 16, fill: '#11161C', stroke: '#3A4B5C', 'stroke-width': 5 }, board);
  E('rect', { x: BX - BW / 2, y: BT, width: BW, height: 76, rx: 16, fill: LH.signTx }, board);
  E('rect', { x: BX - BW / 2, y: BT + 56, width: BW, height: 20, fill: LH.signTx }, board);
  { const p = G(board); tr(p, BX - BW / 2 + 40, BT + 38); lhPlane(p, 0.6, '#11161C'); }
  T(board, BX - BW / 2 + 82, BT + 52, 'AIR IN vs AIR OUT', { size: 40, weight: 800, fill: '#11161C', ls: 2 });
  const CIN = BX + 110, COUT = BX + 262;
  T(board, CIN, BT + 112, 'IN', { size: 28, weight: 800, anchor: 'middle', fill: '#A4BCCB', ls: 2 });
  T(board, COUT, BT + 112, 'OUT', { size: 28, weight: 800, anchor: 'middle', fill: '#A4BCCB', ls: 2 });
  const ROWS = [['OXYGEN', '21%', '16% ↓', '#FF9A8F'], ['CARBON DIOXIDE', '0.04%', '4% ↑', LH.signTx], ['WATER VAPOUR', 'less', 'more ↑', C.water],
    ['TEMPERATURE', 'cooler', 'warmer ↑', C.heat], ['NITROGEN', '78%', '78% =', '#9FB0FF']].map(([n, a, b, col], i) => {
    const r = G(board), y = RY0 + i * RH, cy = y + (RH - 10) / 2;
    E('rect', { x: BX - BW / 2 + 16, y, width: BW - 32, height: RH - 10, rx: 6, fill: '#1C242E' }, r);
    T(r, BX - BW / 2 + 36, cy + 11, n, { size: 30, weight: 700, fill: '#F2F7FA' });
    T(r, CIN, cy + 11, a, { size: 30, weight: 700, anchor: 'middle', fill: '#C9D3DC' });
    T(r, COUT, cy + 11, b, { size: 30, weight: 800, anchor: 'middle', fill: col });
    return { r, cy };
  });
  const flipRow = (i, p) => { const { r, cy } = ROWS[i]; op(r, p > 0 ? 1 : 0); const f = p > 0 && p < 1 ? Math.abs(Math.cos(p * Math.PI * 3)) : 1; r.setAttribute('transform', `translate(0 ${cy}) scale(1 ${Math.max(0.05, f).toFixed(3)}) translate(0 ${-cy})`); };
  const st100 = M(depStamp(PR, '× 100', '#FF5050'));
  const stSame = M(depStamp(PR, 'UNCHANGED', C.good));
  // right panel props
  const rPanel = M(E('rect', { x: 780, y: 262, width: 400, height: 410, rx: 20, fill: 'rgba(17,22,28,0.82)', stroke: '#3A4B5C', 'stroke-width': 4 }, PR));
  const sDep = M(lhSign(PR, 'DEPARTURES', { size: 34, icon: 'plane' }));
  const bars = M(G(PR));
  T(bars, 800, 298, 'oxygen in the air', { size: 28, weight: 700, fill: '#FFFFFF' });
  const BAR = [['in', 21, '#FF6B5C', 340], ['out', 16, '#FF9A8F', 420]].map(([l, v, col, y]) => {
    T(bars, 800, y + 10, l, { size: 28, weight: 800, fill: '#FFFFFF' });
    E('rect', { x: 860, y: y - 20, width: 294, height: 40, rx: 8, fill: 'rgba(0,0,0,0.35)' }, bars);
    const b = E('rect', { x: 860, y: y - 20, width: 0, height: 40, rx: 8, fill: col, stroke: INK, 'stroke-width': 3 }, bars);
    const tx = T(bars, 870, y + 11, v + '%', { size: 30, weight: 800, fill: INK });
    return { b, tx, w: v * 14 };
  });
  const spot = M(E('path', { d: 'M930,0 L1040,0 L1150,640 L820,640 Z', fill: '#FFF6C2', opacity: 0.22 }, PR));
  const spotPool = M(E('ellipse', { cx: 985, cy: 600, rx: 170, ry: 34, fill: glow('#FFF6C2') }, PR));
  const fogWin = M(G(PR));
  E('rect', { x: -150, y: -100, width: 300, height: 200, rx: 12, fill: linGrad('#6FA8D8', '#CFE6F5', true), stroke: '#FFFFFF', 'stroke-width': 10 }, fogWin);
  E('path', { d: 'M0,-100 L0,100', stroke: '#FFFFFF', 'stroke-width': 8 }, fogWin);
  T(fogWin, -60, -50, '❄', { size: 34, weight: 700, anchor: 'middle', fill: '#FFFFFF' });
  const fog = E('ellipse', { cx: -10, cy: 10, rx: 120, ry: 80, fill: '#F2F7FA' }, fogWin);
  const puff = E('ellipse', { cx: -210, cy: 20, rx: 50, ry: 30, fill: '#FFFFFF', opacity: 0.5 }, fogWin);
  const smiley = E('path', { d: 'M-40,-10 L-40,0 M20,-10 L20,0 M-56,30 Q-10,64 36,30', fill: 'none', stroke: '#9CB8CC', 'stroke-width': 7, 'stroke-linecap': 'round' }, fogWin);
  const cFog = M(depLabel(PR, 'a breath fogs a cold window', { size: 26 }));
  const thermo = M(G(PR)); const thermoT = thermometer(thermo, 100, C.heat);
  T(thermo, 40, -30, 'warmer', { size: 28, weight: 800, fill: C.heat });
  // plane window with sleeping oxygen
  const pwin = M(G(PR));
  E('rect', { x: -210, y: -150, width: 420, height: 300, rx: 120, fill: '#5A6573', stroke: '#8A96A3', 'stroke-width': 10 }, pwin);
  E('rect', { x: -186, y: -126, width: 372, height: 252, rx: 104, fill: linGrad('#3E5470', '#22324A', true) }, pwin);
  const sleepers = [-110, 0, 110].map((x, i) => {
    const g = G(pwin); tr(g, x, 40);
    E('rect', { x: -44, y: -70, width: 88, height: 120, rx: 18, fill: '#3F5BD9', stroke: INK, 'stroke-width': 4 }, g);
    const m = G(g); molO2(m, 26); tr(m, 0, -8);
    E('path', { d: 'M-30,-12 Q-22,-6 -14,-12 M14,-12 Q22,-6 30,-12', fill: 'none', stroke: INK, 'stroke-width': 3.5, 'stroke-linecap': 'round' }, g);
    const z = T(g, 30, -50, 'z', { size: 30, weight: 800, fill: '#FFFFFF' });
    return { g, z, i };
  });
  // pie chart of breathed-out air
  const pie = M(G(PR));
  const PIE = [[0, 0.78, LH.nitro], [0.78, 0.94, C.oxygen], [0.94, 0.98, C.carbon], [0.98, 1, '#C9D3DC']];
  const arcD = (a0, a1, r) => { const A = f => -Math.PI / 2 + f * TAU; const big = a1 - a0 > 0.5 ? 1 : 0; return `M0,0 L${(Math.cos(A(a0)) * r).toFixed(1)},${(Math.sin(A(a0)) * r).toFixed(1)} A${r},${r} 0 ${big} 1 ${(Math.cos(A(a1)) * r).toFixed(1)},${(Math.sin(A(a1)) * r).toFixed(1)} Z`; };
  const slices = PIE.map(([a, b, col]) => E('path', { d: arcD(a, b, 170), fill: col, stroke: INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, pie));
  T(pie, 40, 70, 'nitrogen 78%', { size: 30, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  T(pie, -190, -110, 'oxygen 16%', { size: 30, weight: 800, anchor: 'end', fill: '#FF9A8F' });
  const colinLbl = G(pie);
  E('path', { d: 'M-34,-160 L-90,-222', stroke: LH.signTx, 'stroke-width': 4 }, colinLbl);
  lhRich(colinLbl, -96, -230, '4% CO_2: **Colin**', { size: 30, weight: 700, anchor: 'end', fill: LH.signTx });
  T(pie, 0, 222, 'breathed-out air', { size: 30, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  // lab
  const tubes = M(G(PR));
  E('rect', { x: 600, y: 520, width: 450, height: 36, rx: 6, fill: '#B07A45', stroke: INK, 'stroke-width': 4 }, tubes);
  const tA = testTube(tubes, 80, 300, { level: 0.75, liquid: '#DDF3FA' }); tr(tA, 720, 410);
  const tB = testTube(tubes, 80, 300, { level: 0.75, liquid: '#DDF3FA' }); tr(tB, 940, 410);
  E('path', { d: 'M720,520 L720,230 L570,230', fill: 'none', stroke: '#9FD8FF', 'stroke-width': 10, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: 0.85 }, tubes);
  T(tubes, 556, 240, 'breathed-out air', { size: 28, weight: 700, anchor: 'end', fill: '#1B2733' });
  const bubA = bubbles(tubes, 700, 350, 40, 190, { n: 9, r: 6, speed: 0.9, seed: 4 });
  const lblA = T(tubes, 720, 610, 'cloudy!', { size: 30, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  T(tubes, 940, 610, 'limewater', { size: 30, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  // red carpet tubes and flashes
  const carpetP = M(G(PR));
  const cT1 = testTube(carpetP, 110, 400, { level: 0.8, liquid: '#F4F4EE' }); tr(cT1, 170, 470);
  const cT2 = testTube(carpetP, 110, 400, { level: 0.8, liquid: '#F4F4EE' }); tr(cT2, 1030, 470);
  [cT1, cT2].forEach(tt => attr(tt.liquid, 'opacity', 0.95));
  const marquee = lhSign(carpetP, 'CLEAR → CLOUDY', { size: 34 }); tr(marquee, 600, 190);
  const flashes = [[300, 420], [900, 380], [380, 640], [820, 620], [470, 330], [760, 470]].map(([x, y], i) => { const f = E('circle', { cx: x, cy: y, r: 60, fill: glow('#FFFFFF') }, carpetP); return { f, i }; });
  // proves: two panels
  const proof = M(G(PR));
  const PANS = [[320, 'breathed-out air', 'cloudy FAST', '#FFD23F'], [880, 'room air', 'still clear…', '#9FD8FF']].map(([x, ti, res, col], i) => {
    const g = G(proof); tr(g, x, 0);
    E('rect', { x: -260, y: 140, width: 520, height: 470, rx: 20, fill: 'rgba(17,22,28,0.85)', stroke: '#FFFFFF', 'stroke-width': 3 }, g);
    T(g, 0, 196, ti, { size: 34, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
    const tube = testTube(g, 76, 280, { level: 0.75, liquid: '#DDF3FA' }); tr(tube, -70, 380);
    const bub = bubbles(g, -90, 330, 40, 170, { n: 7, r: 5, speed: 0.9, seed: 7 + i });
    const w = depWatch(g); tr(w, 110, 360);
    const r = T(g, 0, 580, res, { size: 32, weight: 800, anchor: 'middle', fill: col });
    return { g, tube, bub, w, r };
  });
  const cMore = M(depLabel(HUD, 'breathed-out air has far **more CO_2**', { size: 34 }));

  /* ---------------- cast ---------------- */
  const CAST = {};
  ['nigel', 'colin', 'dennis'].forEach(k => { CAST[k] = cast(CA, k); });
  const nigelWin = cast(G(PR, { 'clip-path': 'url(#depWinCp)' }), 'nigel');
  const winGlass = M(E('rect', { x: 712, y: 122, width: 306, height: 226, rx: 12, fill: linGrad('#FFB3C6', '#E86A8E', true), opacity: 0.55 }, PR));
  PR.insertBefore(winGlass, nigelWin.parentNode);
  M(nigelWin.parentNode);
  {
    const g = CAST.colin.firstChild, face = g.lastElementChild, orig = face.previousElementSibling;
    const down = G(g);
    E('path', { d: 'M-58,-24 L-6,-24 L-10,2 Q-30,14 -52,4 Z M6,-24 L58,-24 L52,4 Q30,14 10,2 Z', fill: '#1E2630', stroke: INK, 'stroke-width': 3.5, 'stroke-linejoin': 'round' }, down);
    E('path', { d: 'M-6,-20 L6,-20 M-58,-22 L-74,-28 M58,-22 L74,-28', stroke: INK, 'stroke-width': 4, 'stroke-linecap': 'round' }, down);
    E('path', { d: 'M-46,-16 L-32,-16 M18,-16 L32,-16', stroke: '#8FA3B8', 'stroke-width': 3, 'stroke-linecap': 'round' }, down);
    CAST.colin.shades = v => { op(down, v > 0.5 ? 1 : 0); op(orig, v > 0.5 ? 0 : 1); };
  }

  /* ---------------- HUD ---------------- */
  const hc = (text, o) => M(depLabel(HUD, text, o));
  const cNe = hc('air **out** ≠ air **in**', { size: 32 });
  const cRescue = M(G(HUD));
  { const a = depLabel(cRescue, 'breathed-out air still has ≈ **16% O_2**', { size: 28 }); tr(a, 0, 0); const b = depLabel(cRescue, '→ **rescue breaths** work', { size: 32 }); tr(b, 0, 64); }
  const cTrend = hc('TRENDING ↑', { size: 36, fill: '#D32F2F', color: '#FFFFFF', stroke: '#FFFFFF' });
  const cN2 = hc('the body doesn’t use **nitrogen**', { size: 30 });
  const cN2b = hc('N_2 in = N_2 out', { size: 30 });
  const cLime = hc('limewater: **clear** → **cloudy** (milky) = **CO_2**', { size: 32 });
  const kin = M(G(HUD));
  E('rect', { x: -150, y: -105, width: 300, height: 210, rx: 14, fill: linGrad('#F6DDB6', '#EBC795', true), stroke: '#FFFFFF', 'stroke-width': 5 }, kin);
  const kinClip = G(kin, { 'clip-path': 'url(#depKinCp)' });
  E('rect', { x: -150, y: 40, width: 300, height: 70, fill: '#2FA59A' }, kinClip);
  E('rect', { x: 58, y: -86, width: 78, height: 58, rx: 4, fill: linGrad('#6FC8FF', '#CFEFFF', true), stroke: '#FFFFFF', 'stroke-width': 4 }, kinClip);
  E('path', { d: 'M97,-86 L97,-28 M58,-57 L136,-57', stroke: '#FFFFFF', 'stroke-width': 3 }, kinClip);
  const kinK = cast(kinClip, 'kavya');
  { const s = lhSnack(kinClip, 0.38); tr(s, 92, 68); }
  { const c = lhChip(kin, 'LIVE · SOFA', { size: 22, fill: '#D32F2F', color: '#FFFFFF', h: 34 }); tr(c, -150 + c.w / 2 + 10, -105 + 26); }

  const RT = [mid('oxygen', 0.1), mid('me', 0.22), mid('vapour', 0.15), mid('vapour', 0.68), mid('nitrogen', 0.22)];

  /* ================= update ================= */
  return t => {
    ALL.forEach(e => op(e, 0));
    const sh = shotAt(t), pose = {};
    let k = 1, fx = 600, fy = 375;
    const breath = AMP * wave(t, 4);

    /* ---------- the board shots ---------- */
    if (sh === 'board' || sh === 'boardB' || sh === 'boardC') {
      op(term, 1); op(termDim, 1); termDim.setAttribute('opacity', 0.35); op(board, 1);
      ROWS.forEach((r, i) => flipRow(i, P(t, RT[i], 0.45, linear)));
      if (sh === 'board') {
        depPop(sDep, 985, 200, P(t, at('board') + 0.2, 0.45, pop));
        depPop(cNe, 985, 290, P(t, mid('board', 0.55), 0.45, pop) * (1 - P(t, at('oxygen') + 0.2, 0.25, linear)));
        op(bars, P(t, mid('oxygen', 0.25), 0.3, linear)); op(rPanel, P(t, mid('oxygen', 0.25), 0.3, linear)); attr(rPanel, 'height', 222);
        BAR.forEach((b, i) => { const p = P(t, mid('oxygen', i ? 0.72 : 0.38), 0.8, easeOut); attr(b.b, 'width', b.w * p); op(b.tx, p > 0.7 ? 1 : 0); attr(b.tx, 'x', 860 + b.w * p - 76); });
        pose.nigel = { x: lerp(1160, 860, clamp(t / 13)), y: 560, s: 0.55, mood: 'neutral', look: 0 };
      }
      if (sh === 'boardB') {
        const me = t < at('pure') - 0.1;
        op(spot, 1); op(spotPool, 1);
        depPop(st100, COUT - 10, ROWS[1].cy + 66, P(t, mid('me', 0.6), 0.35, pop), 1, -12);
        depPop(cTrend, 985, 250, me ? P(t, mid('me', 0.88), 0.4, pop) : 0, 1, -4);
        const pose_ = me && t > mid('me', 0.86) ? 6 * Math.sin(P(t, mid('me', 0.86), 0.5) * Math.PI) : 0;
        pose.colin = { x: 985, y: 480 - pose_, s: 0.95, r: pose_, mood: 'smug', look: me ? (t > mid('me', 0.86) ? 0 : -0.8) : 0.6 };
        if (!me) {
          depPop(kin, 1000, 230, P(t, at('pure') - 0.1, 0.4, pop));
          kinK.set({ t, talk: scTalk(S, t, 'kavya'), mood: 'neutral', look: -0.4 }); tr(kinK, -10, 48, 0.62);
        }
      }
      if (sh === 'boardC') {
        const vap = t < at('nitrogen') - 0.1;
        if (vap) {
          op(rPanel, 1); attr(rPanel, 'height', 410); op(fogWin, 1); tr(fogWin, 985, 370);
          const pf = P(t, mid('vapour', 0.15), 1.0, linear), fg = P(t, mid('vapour', 0.3), 1.3, ease);
          attr(puff, 'cx', lerp(-210, -40, pf)); op(puff, Math.sin(Math.PI * pf) * 0.8);
          op(fog, fg * 0.85); op(smiley, P(t, mid('vapour', 0.6), 0.5, linear));
          depPop(cFog, 985, 506, P(t, mid('vapour', 0.35), 0.4, pop));
          op(thermo, P(t, mid('vapour', 0.66), 0.3, linear)); tr(thermo, 860, 640); thermoT.set(0.3 + 0.5 * P(t, mid('vapour', 0.7), 0.8));
        } else {
          depPop(sDep, 985, 200, 1);
          const w = P(t, mid('nitrogen', 0.2), end('nitrogen') + 0.6 - mid('nitrogen', 0.2), linear);
          pose.nigel = { x: lerp(-120, 1320, w), y: 672 - Math.abs(Math.sin(t * 5)) * 6 * AMP, s: 0.5, mood: 'neutral', look: 0 };
          depPop(stSame, 985, ROWS[4].cy + 6, P(t, mid('nitrogen', 0.84), 0.35, pop), 1, -6);
        }
      }
    }

    /* ---------- Colin at the plane window ---------- */
    if (sh === 'plane') {
      op(cabin, 1); op(pwin, 1); tr(pwin, 860, 330);
      sleepers.forEach(({ g, z, i }) => { tr(g, -110 + i * 110, 40 + Math.sin(t * 1.5 + i) * 3 * AMP); const q = (t * 0.6 + i / 3) % 1; tr(z, 30 + q * 20, -50 - q * 50, 0.8 + 0.6 * q); op(z, Math.sin(Math.PI * q)); });
      pose.colin = { x: 320, y: 420, s: 1.2, mood: 'smug', look: t < mid('plane', 0.5) ? 1 : 0 };
      depPop(cRescue, 860, 590, P(t, mid('plane', 0.62), 0.45, pop));
      k = 1 + 0.04 * P(t, end('plane'), 0.8); fx = 320; fy = 400;
    }

    /* ---------- the pie chart ---------- */
    if (sh === 'pie') {
      op(term, 1); op(termDim, 1); termDim.setAttribute('opacity', 0.62); op(pie, 1);
      tr(pie, 860, 420, Math.max(0.01, P(t, at('wish') - 0.06, 0.4, pop)));
      const ex = P(t, mid('wish', 0.55), 0.4, pop);
      const a = (-Math.PI / 2 + 0.96 * TAU); tr(slices[2], Math.cos(a) * 26 * ex, Math.sin(a) * 26 * ex);
      op(colinLbl, P(t, mid('wish', 0.6), 0.3, linear));
      k = 1 + 0.06 * P(t, end('wish'), 1.0); fx = 300; fy = 400;
      pose.colin = { x: 300, y: 420, s: 1.3, mood: 'smug', look: t > mid('wish', 0.55) && t < end('wish') ? 1 : 0, shades: t > mid('wish', 0.05) ? 1 : 0 };
    }

    /* ---------- Dennis: Nigel just likes the trip ---------- */
    if (sh === 'conf') {
      op(confD, 1); confD.set(1, t); op(winGlass, 1); op(nigelWin.parentNode, 1);
      const u = clamp((t - at('thnigel')) / 5.2);
      tr(nigelWin, lerp(640, 1090, u), 250, 0.5); nigelWin.set({ t, mood: 'neutral' });
      pose.dennis = { x: 430, y: 420, s: 1.5, mood: 'deadpan', look: 0, flat: 0.55 * breath };
      k = 1 + 0.07 * P(t, end('thnigel'), 1.1); fx = 430; fy = 380;
      depPop(cN2, 900, 470, P(t, mid('thnigel', 0.15), 0.45, pop));
      depPop(cN2b, 900, 545, P(t, mid('thnigel', 0.3), 0.45, pop));
    }

    /* ---------- limewater ---------- */
    if (sh === 'lab') {
      op(lab, 1); op(tubes, 1);
      const cl = P(t, mid('lime', 0.55), 1.4, ease);
      attr(tA.liquid, 'fill', depMix('#DDF3FA', '#F4F4EE', cl)); attr(tA.liquid, 'opacity', lerp(0.45, 0.97, cl));
      attr(tB.liquid, 'opacity', 0.45);
      bubA.upd(t, P(t, mid('lime', 0.2), 0.3, linear));
      op(lblA, P(t, mid('lime', 0.75), 0.3, linear));
      pose.colin = { x: 300, y: 450, s: 0.95, mood: 'smug', look: 1 };
      depPop(cLime, 600, 684, P(t, mid('lime', 0.5), 0.45, pop));
    }

    /* ---------- the red carpet ---------- */
    if (sh === 'carpet') {
      op(gala, 1); op(carpetP, 1);
      op(galaGlow, 0.3 + 0.15 * wave(t, 1.3));
      flashes.forEach(({ f, i }) => { const q = ((t - at('carpet')) * 1.3 + i * 0.37) % 1; op(f, q < 0.12 ? 1 - q / 0.12 : 0); });
      const w = P(t, at('carpet') - 0.1, end('carpet') - at('carpet'), ease);
      const strut = Math.abs(Math.sin(t * 4)) * 8 * AMP * (1 - w);
      pose.colin = { x: 600, y: lerp(360, 500, w) - strut, s: lerp(0.45, 1.15, w), mood: 'smug', look: 0, shades: 1, r: 4 * Math.sin(t * 4) * AMP * (1 - w) };
      k = 1 + 0.05 * P(t, end('carpet'), 0.9); fx = 600; fy = 450;
    }

    /* ---------- breathed-out air vs room air ---------- */
    if (sh === 'proves') {
      op(lab, 1); op(proof, 1);
      const t0 = at('proves') + 0.2, tc = mid('proves', 0.3);
      PANS.forEach((p, i) => {
        const cl = i === 0 ? P(t, t0 + 0.4, tc - t0, ease) : 0;
        attr(p.tube.liquid, 'fill', depMix('#DDF3FA', '#F4F4EE', cl)); attr(p.tube.liquid, 'opacity', lerp(0.45, 0.97, cl));
        p.bub.upd(t, 1);
        const run = i === 0 ? Math.min(t, tc + 0.4) - t0 : t - t0;
        p.w.set(Math.max(0, run) * 1.2);
        op(p.r, i === 0 ? P(t, tc + 0.3, 0.3, linear) : P(t, mid('proves', 0.5), 0.3, linear));
      });
      depPop(cMore, 600, 676, P(t, mid('proves', 0.72), 0.45, pop));
    }

    /* ---------- apply the cast ---------- */
    depCam(cam, k, fx, fy);
    Object.keys(CAST).forEach(name => {
      const p = pose[name], c = CAST[name];
      if (!p) { op(c, 0); return; }
      op(c, 1); tr(c, p.x, p.y, p.s, p.r || 0);
      c.set({ t, talk: scTalk(S, t, name), mood: p.mood, look: p.look || 0, flat: p.flat || 0 });
    });
    CAST.colin.shades(pose.colin ? pose.colin.shades || 0 : 0);
  };
});
