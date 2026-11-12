/* Scene 2: "Station one: the mouth".
   Shots (hard sitcom cuts): the line map, station 1 ringed -> MOUTH platform: digestion BEGINS here
   -> mouth cam: teeth chop the food into smaller pieces (mechanical digestion) -> the four kinds of teeth
   -> one cube into eight: bigger surface area -> Amy (amylase) bursts onto the platform -> Percy's confessional,
   Amy bouncing in the window -> whiteboard: Amy's active site fits the end glucose of a starch chain;
   Snip! Snip! Snip! -> Percy: chemical digestion -> Kavya and the cracker; Amy on the mouth cam: "YES!"
   -> the gut wall: big molecules bounce off; small soluble ones slip through into the blood
   -> mouth cam: the tongue rolls a bolus -> platform: doors closing, next station: oesophagus. */
scene('mouth', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;
  const INK = SC_INK, SKIN = '#B9784E';

  /* ---------- local helpers (prefixed mth) ---------- */
  const mthCam = (el, c) => el.setAttribute('transform', `translate(${c.cx.toFixed(1)} ${c.cy.toFixed(1)}) scale(${c.k.toFixed(4)}) translate(${(-c.cx).toFixed(1)} ${(-c.cy).toFixed(1)})`);
  const mthPin = (el, t, t0, t1, x, y, s, r) => {
    if (t < t0 || t >= t1) { op(el, 0); return 0; }
    const p = P(t, t0, 0.42, pop); op(el, clamp(p * 2.5)); tr(el, x, y, Math.max(0.01, (s || 1) * (0.6 + 0.4 * p)), r); return p;
  };
  function mthChip(parent, text, o) {
    o = o || {};
    const size = o.size || 30, h = Math.round(size * 1.72), w = Math.ceil(textWidth(text, size, FD, 700) + size * 1.4);
    const g = G(parent);
    E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: o.rx !== undefined ? o.rx : h / 2, fill: o.fill || 'rgba(10,27,39,0.9)', stroke: o.stroke || C.line, 'stroke-width': o.sw || 3 }, g);
    T(g, 0, size * 0.35, text, { size, weight: o.weight || 700, fill: o.color || C.ink, anchor: 'middle', boldFill: o.bold || C.energy });
    g.w = w; return g;
  }
  function mthArm(parent) {
    const g = G(parent);
    E('path', { d: 'M0,0 L150,0', stroke: INK, 'stroke-width': 40, 'stroke-linecap': 'round' }, g);
    E('path', { d: 'M0,0 L150,0', stroke: SKIN, 'stroke-width': 32, 'stroke-linecap': 'round' }, g);
    E('path', { d: 'M-6,-22 L56,-22 L56,22 L-6,22 Z', fill: '#2E7DD8', stroke: INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
    E('circle', { cx: 160, cy: 0, r: 22, fill: SKIN, stroke: INK, 'stroke-width': 4 }, g);
    return g;
  }
  function mthPA(parent) {
    const g = G(parent);
    E('rect', { x: -102, y: -100, width: 204, height: 206, rx: 14, fill: '#0E1A24', stroke: '#FFB000', 'stroke-width': 4 }, g);
    E('rect', { x: -102, y: -100, width: 204, height: 40, rx: 12, fill: '#FFB000' }, g);
    T(g, -10, -70, 'PA', { size: 28, weight: 800, anchor: 'middle', fill: '#0E1A24' });
    E('path', { d: 'M20,-86 L30,-86 L40,-94 L40,-66 L30,-74 L20,-74 Z M48,-88 Q56,-80 48,-72', fill: '#0E1A24', stroke: '#0E1A24', 'stroke-width': 2, 'stroke-linejoin': 'round' }, g);
    const cp = E('clipPath', { id: 'mthPAclip' }, defs()); E('rect', { x: -92, y: -58, width: 184, height: 156, rx: 8 }, cp);
    const win = G(g, { 'clip-path': 'url(#mthPAclip)' });
    E('rect', { x: -92, y: -58, width: 184, height: 156, fill: linGrad('#5A1A2A', '#8E3348', true) }, win);
    g.inner = G(win);
    const mic = mgMic(win, 0.5); tr(mic, 52, 64, 0.5, -12);
    return g;
  }
  function mthGrid(parent) {
    const g = G(parent);
    E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#0C1A26', '#14283A', true) }, g);
    let d = '';
    for (let x = 0; x <= 1200; x += 60) d += `M${x},0 L${x},750 `;
    for (let y = 0; y <= 750; y += 60) d += `M0,${y} L1200,${y} `;
    E('path', { d, stroke: '#1E3A50', 'stroke-width': 1.5 }, g);
    return g;
  }
  // a scissor flash: two blades and a burst; g.set(p 0..1)
  function mthScissors(parent) {
    const g = G(parent);
    const burst = E('path', { d: 'M0,-44 L8,-12 L40,-24 L14,0 L40,24 L8,12 L0,44 L-8,12 L-40,24 L-14,0 L-40,-24 L-8,-12 Z', fill: '#FFF7C2', stroke: '#FFB000', 'stroke-width': 3 }, g);
    const bl = G(g);
    E('path', { d: 'M0,0 L-34,-40 M0,0 L34,-40', stroke: '#C9D3DC', 'stroke-width': 9, 'stroke-linecap': 'round' }, bl);
    E('circle', { cx: -16, cy: 22, r: 12, fill: 'none', stroke: '#D7263D', 'stroke-width': 7 }, bl);
    E('circle', { cx: 16, cy: 22, r: 12, fill: 'none', stroke: '#D7263D', 'stroke-width': 7 }, bl);
    g.set = p => { op(g, p > 0 && p < 1 ? 1 : 0); tr(burst, 0, 0, 0.4 + 0.9 * p, p * 40); op(burst, 1 - p); bl.setAttribute('transform', `translate(0 -40)`); };
    return g;
  }

  /* layers: world (zoomed by the camera) then screen UI and HUD */
  const Lbg = G(root), Lcast = G(root), Lprop = G(root), Lui = G(root), Lhud = G(root);

  /* ================= sets ================= */
  const gridShot = mthGrid(Lbg);
  const platShot = G(Lbg); const plat = mgPlatform(platShot, 'MOUTH', 'AL1');
  const hawkShot = G(Lbg); const hawker = mgHawker(hawkShot);
  const confShot = mgConf(Lbg, 'percy');
  // mouth cam: skin, lips, dark mouth, teeth rows, tongue (everything inside clipped to the mouth)
  const MC = [600, 420, 470, 200];
  const camShot = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#C98A5E', '#A9683F', true) }, camShot);
  const mcCp = E('clipPath', { id: 'mthMouthClip' }, defs()); E('ellipse', { cx: MC[0], cy: MC[1], rx: MC[2], ry: MC[3] }, mcCp);
  const mIn = G(camShot, { 'clip-path': 'url(#mthMouthClip)' });
  E('ellipse', { cx: MC[0], cy: MC[1], rx: MC[2], ry: MC[3], fill: glow('#7A1E30', '#2A0610') }, mIn);
  const tongue = E('path', { d: '', fill: ball('#F08CA0', '#C85068'), stroke: '#9E3450', 'stroke-width': 5 }, mIn);
  const foodG = G(mIn);
  const teethTop = G(mIn), teethBot = G(mIn);
  {
    // one path per row of teeth (rounded boxes)
    const box = (x, y) => `M${x - 16},${y} L${x + 16},${y} Q${x + 34},${y} ${x + 34},${y + 18} L${x + 34},${y + 78} Q${x + 34},${y + 96} ${x + 16},${y + 96} L${x - 16},${y + 96} Q${x - 34},${y + 96} ${x - 34},${y + 78} L${x - 34},${y + 18} Q${x - 34},${y} ${x - 16},${y} Z `;
    let dT = '', dB = '';
    for (let i = 0; i < 8; i++) { const x = 278 + i * 92, dy = Math.pow((x - 600) / 470, 2) * 150; dT += box(x, 160 + dy); dB += box(x, 584 - dy); }
    E('path', { d: dT, fill: '#FAF7EE', stroke: '#9A9480', 'stroke-width': 4 }, teethTop);
    E('path', { d: dB, fill: '#FAF7EE', stroke: '#9A9480', 'stroke-width': 4 }, teethBot);
  }
  E('ellipse', { cx: MC[0], cy: MC[1], rx: MC[2] + 8, ry: MC[3] + 8, fill: 'none', stroke: '#C0505E', 'stroke-width': 30 }, camShot);   // lips
  E('path', { d: `M${MC[0] - 120},${MC[1] - MC[3] - 18} Q${MC[0]},${MC[1] - MC[3] + 6} ${MC[0] + 120},${MC[1] - MC[3] - 18}`, fill: 'none', stroke: '#E07A8A', 'stroke-width': 6, opacity: 0.6 }, camShot);
  const mcTag = mthChip(camShot, '● MOUTH CAM', { size: 26, color: '#FF8A8A', stroke: '#FF6070' }); tr(mcTag, 190, 662);
  // food pieces: 16 small pieces that start as one lump
  const PIECES = [];
  for (let i = 0; i < 16; i++) {
    const chick = [2, 5, 7, 10, 13, 14].includes(i);
    PIECES.push(E('rect', { x: -15, y: -11, width: 30, height: 22, rx: 6, fill: chick ? '#F2D2A0' : '#FBF3DE', stroke: chick ? '#C9A88A' : '#D9C79C', 'stroke-width': 3 }, foodG));
  }
  const mBolus = mgBolus(foodG, 74);
  // the gut wall diagram
  const wallShot = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#5A1A2A', '#8E3348', true) }, wallShot);
  E('rect', { x: 0, y: 520, width: 1200, height: 230, fill: '#6E2434' }, wallShot);
  {
    let dc = '', dn = '';
    for (let i = 0; i < 9; i++) { const x = -40 + i * 150; dc += `M${x + 16},440 L${x + 130},440 Q${x + 146},440 ${x + 146},456 L${x + 146},506 Q${x + 146},522 ${x + 130},522 L${x + 16},522 Q${x},522 ${x},506 L${x},456 Q${x},440 ${x + 16},440 Z `; if (i !== 7) dn += `M${x + 62},482 a11,11 0 1,0 22,0 a11,11 0 1,0 -22,0 `; }
    E('path', { d: dc, fill: linGrad('#FBD0DE', '#E890AE', true), stroke: '#9E3450', 'stroke-width': 4 }, wallShot);
    E('path', { d: dn, fill: '#A0476E' }, wallShot);
  }
  E('rect', { x: -10, y: 572, width: 1220, height: 72, rx: 36, fill: '#B5303D', stroke: '#7A1020', 'stroke-width': 5 }, wallShot);
  const rbcs = [0, 1, 2, 3, 4].map(i => E('ellipse', { rx: 30, ry: 13, fill: ball('#FF6B6B', '#B32635'), opacity: 0.8 }, wallShot));

  /* ================= cast ================= */
  const kav = cast(Lcast, 'kavya', { mood: 'neutral' });
  const tableW = G(Lcast); mgTable(tableW, 1150);
  const percy = cast(Lcast, 'percy');
  const amy = cast(Lcast, 'amy');
  const micMain = mgMic(Lprop, 0.75);

  /* ================= props ================= */
  // the line map
  const map = mgLineMap(Lprop);
  map.off.remove();   // the helper organs are not needed here
  const cHere = mthChip(Lui, 'YOU ARE HERE', { size: 30, fill: C.energy, color: '#0E1A24', stroke: '#FFFFFF' });
  const cStation = mthChip(Lui, 'Station 1: **MOUTH**', { size: 44, stroke: MG_LINE });
  const cBegins = mthChip(Lui, 'digestion **BEGINS** here', { size: 46, stroke: C.energy });
  // mouth cam chips
  const cMech = mthChip(Lui, 'mechanical digestion', { size: 42, color: C.energy, stroke: C.energy });
  const cNoChem = mthChip(Lui, 'smaller pieces, **NO** chemical change', { size: 30, bold: '#FF9AA6' });
  const cBolus = mthChip(Lui, 'bolus', { size: 56, color: '#F2DFB6', stroke: '#C9A86A' });
  const cBolusSub = mthChip(Lui, 'tongue + saliva: a soft, slippery ball', { size: 30 });
  const drops = [0, 1, 2].map(() => { const d = G(mIn); E('path', { d: 'M0,-14 Q10,2 0,10 Q-10,2 0,-14 Z', fill: '#BFEAFF', stroke: '#5AB4E0', 'stroke-width': 2.5 }, d); return d; });
  // the four teeth
  const teethDiag = G(Lprop);
  const teeth = mgTeeth(teethDiag);
  const TX = [-195, -65, 65, 195].map(x => 600 + x * 1.45);
  const tCol = ['#7FD6F7', '#FF9FB0', C.glucose, C.glucose];
  const tNames = ['incisors', 'canines', 'premolars', 'molars'].map((n, i) => T(Lui, 0, 11, n, { size: 32, weight: 800, anchor: 'middle', fill: tCol[i] }));
  const tActs = [['cut', TX[0]], ['grip and tear', TX[1]], ['crush and grind', (TX[2] + TX[3]) / 2]].map(([n]) => T(Lui, 0, 11, n, { size: 32, weight: 700, anchor: 'middle', fill: '#FFFFFF' }));
  const actX = [TX[0], TX[1], (TX[2] + TX[3]) / 2];
  const bracket = E('path', { d: `M${TX[2] - 40},586 L${TX[2] - 40},600 L${TX[3] + 50},600 L${TX[3] + 50},586`, fill: 'none', stroke: C.glucose, 'stroke-width': 5, 'stroke-linejoin': 'round' }, Lui);
  const cFour = mthChip(Lui, '4 kinds of teeth', { size: 40 });
  // one cube into eight
  const cubeG = G(Lprop);
  const U = 74;
  const proj = (x, y, z) => [(x - y) * 0.866 * U, (x + y) * 0.5 * U - z * U];
  const facePath = pts => 'M' + pts.map(p => { const q = proj(...p); return q[0].toFixed(1) + ',' + q[1].toFixed(1); }).join(' L') + ' Z';
  const mkFaces = () => [0, 1, 2].map(() => E('path', { d: '', stroke: '#5A4630', 'stroke-width': 3, 'stroke-linejoin': 'round' }, cubeG));
  const bigFaces = mkFaces();
  const small = [];
  for (let ix = 0; ix < 2; ix++) for (let iy = 0; iy < 2; iy++) for (let iz = 0; iz < 2; iz++) small.push({ ix, iy, iz, k: ix + iy + iz });
  small.sort((a, b) => a.k - b.k || a.iz - b.iz);
  small.forEach(c => { c.f = mkFaces(); });
  const BEIGE = ['#F7E8DA', '#E2C9A8', '#CDB08A'], YEL = ['#FFF2A0', '#FFE45C', '#E8C830'];
  const mixC = (a, b, p) => { const h = s => [1, 3, 5].map(i => parseInt(s.slice(i, i + 2), 16)); const A = h(a), B = h(b); return '#' + A.map((v, i) => Math.round(lerp(v, B[i], p)).toString(16).padStart(2, '0')).join(''); };
  function cubeFaces(f, o, s, col) {
    // o: min corner (centred coordinates), s: size
    const [x, y, z] = o;
    attr(f[0], 'd', facePath([[x, y, z + s], [x + s, y, z + s], [x + s, y + s, z + s], [x, y + s, z + s]]));
    attr(f[1], 'd', facePath([[x + s, y, z], [x + s, y + s, z], [x + s, y + s, z + s], [x + s, y, z + s]]));
    attr(f[2], 'd', facePath([[x, y + s, z], [x + s, y + s, z], [x + s, y + s, z + s], [x, y + s, z + s]]));
    f.forEach((e, i) => attr(e, 'fill', col[i]));
  }
  const cArea = mthChip(Lui, 'surface area', { size: 40 });
  const saT = G(Lui); const saTxt = T(saT, 0, 0, '', { size: 34, weight: 800, anchor: 'middle', fill: C.ink });
  const cFaster = mthChip(Lui, 'bigger **surface area** → **faster** chemical digestion', { size: 30 });
  // Amy's entrance
  const saliva = G(Lprop);
  E('path', { d: 'M0,-170 Q120,-10 112,60 Q100,160 0,160 Q-100,160 -112,60 Q-120,-10 0,-170 Z', fill: '#BFEAFF', opacity: 0.3, stroke: '#7FD6F7', 'stroke-width': 6 }, saliva);
  const whoosh = E('path', { d: 'M0,-40 L-180,-40 M20,0 L-220,0 M0,40 L-170,40', stroke: '#FFFFFF', 'stroke-width': 8, 'stroke-linecap': 'round', opacity: 0.7 }, Lprop);
  const ltAmy = scLowerThird(Lhud, ...MG_NAME.amy);
  const cAmylase = mthChip(Lui, '**amylase**: an enzyme', { size: 34, stroke: '#7FD6F7', bold: '#7FD6F7' });
  const cSaliva = mthChip(Lui, 'lives in **saliva**', { size: 30, stroke: '#7FD6F7', bold: '#BFEAFF' });
  // confessional window with Amy bouncing in it
  const winG = G(Lprop);
  E('rect', { x: -175, y: -135, width: 350, height: 270, rx: 14, fill: '#E9EEF2', stroke: '#2B3138', 'stroke-width': 6 }, winG);
  const wCp = E('clipPath', { id: 'mthWinClip' }, defs()); E('rect', { x: -160, y: -120, width: 320, height: 240, rx: 8 }, wCp);
  const winIn = G(winG, { 'clip-path': 'url(#mthWinClip)' });
  E('rect', { x: -160, y: -120, width: 320, height: 240, fill: linGrad('#8FD3F4', '#D8F1FC', true) }, winIn);
  const amySlotWin = G(winIn);
  E('path', { d: 'M0,-120 L0,120 M-160,0 L160,0', stroke: '#2B3138', 'stroke-width': 6 }, winG);
  const cOneJob = mthChip(Lui, 'jobs: **1**', { size: 32 });
  const cExcite = mthChip(Lui, 'excitement: **110%**', { size: 32, stroke: '#FF6FB5', bold: '#FF6FB5' });
  // whiteboard: starch into sugars
  const wb = G(Lprop);
  E('rect', { x: -450, y: -140, width: 900, height: 280, rx: 18, fill: '#FBFCFD', stroke: '#9AA6AE', 'stroke-width': 8 }, wb);
  const wbTitle = T(wb, -60, -78, 'STARCH', { size: 52, weight: 800, anchor: 'middle', fill: MG_NAVY });
  const wbLong = T(wb, -60, 100, 'a long chain of glucose', { size: 30, weight: 700, anchor: 'middle', fill: '#5A6B7A' });
  const wbArrow = G(wb); arrow(wbArrow, 230, 0, 300, 0, { color: MG_NAVY, width: 7 });
  T(wbArrow, 318, 13, 'sugars', { size: 40, weight: 800, fill: C.glucoseDk });
  const WB = [640, 380];
  const chain = mgChain(Lprop, 'starch', 7);
  const CH = [570, 380, 1.3];
  const scis = mthScissors(Lprop);
  const cSugars = mthChip(Lui, 'sugars ✓', { size: 34, color: C.glucoseDk, fill: '#FFF7DE', stroke: C.glucose });
  // chemical digestion card
  const chemCard = G(Lui);
  E('rect', { x: -320, y: -150, width: 640, height: 300, rx: 22, fill: 'rgba(10,27,39,0.93)', stroke: C.energy, 'stroke-width': 4 }, chemCard);
  T(chemCard, 0, -88, 'chemical digestion', { size: 46, weight: 800, anchor: 'middle', fill: C.energy });
  T(chemCard, 0, -34, 'enzymes break the **bonds**', { size: 34, weight: 700, anchor: 'middle', boldFill: C.energy });
  T(chemCard, 0, 10, 'inside molecules', { size: 34, weight: 700, anchor: 'middle' });
  const chemMini = G(chemCard); tr(chemMini, 0, 86);
  const hexA = molGlucose(chemMini, 24), hexB = molGlucose(chemMini, 24);
  const chemBond = E('line', { x1: -36, y1: 0, x2: 36, y2: 0, stroke: C.glucoseLt, 'stroke-width': 7, 'stroke-linecap': 'round' }, chemMini);
  const cStartsToo = G(Lui); { const c = mthChip(cStartsToo, 'starts in the **mouth** too', { size: 34, stroke: C.good, bold: C.good }); tr(tick(cStartsToo, 18), -c.w / 2 - 36, 0); }
  // Kavya's cracker
  const arm = mthArm(Lprop);
  const cracker = G(Lprop);
  E('rect', { x: -52, y: -52, width: 104, height: 104, rx: 10, fill: '#F2C46A', stroke: '#B07A2A', 'stroke-width': 5 }, cracker);
  let dots = ''; for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) dots += `M${-26 + i * 26},${-26 + j * 26} l0,0.1 `;
  E('path', { d: dots, stroke: '#B07A2A', 'stroke-width': 9, 'stroke-linecap': 'round' }, cracker);
  const crSpark = [0, 1, 2].map(i => { const s = G(Lprop); E('path', { d: 'M0,-18 L5,-5 L18,0 L5,5 L0,18 L-5,5 L-18,0 L-5,-5 Z', fill: '#FFF7C2', stroke: '#FFB000', 'stroke-width': 2.5 }, s); return s; });
  const cCracker = mthChip(Lui, 'plain cracker = starch', { size: 30, color: C.glucoseLt, stroke: C.glucose });
  const cSweet = mthChip(Lui, 'sweet!', { size: 44, color: '#FF6FB5', stroke: '#FF6FB5', fill: '#FFF0F7' });
  const cSugar = mthChip(Lui, 'starch → **sugar**', { size: 32, stroke: C.glucose, bold: C.glucose });
  const call = scVideoCall(Lui, 300, 220, 'MOUTH CAM');
  // the gut wall: large molecules, then small ones
  const molStarch = chain, molProt = mgChain(Lprop, 'protein', 5), molFat = mgFat(Lprop, 1);
  const MOL = [[205, 290, 0.82], [540, 290, 1.1], [820, 290, 1.1]];
  const mLabs = ['starch', 'protein', 'fat'].map(n => T(Lui, 0, 11, n, { size: 32, weight: 800, anchor: 'middle', fill: '#FFFFFF' }));
  const pLabs = ['glucose', 'amino acids', 'fatty acids + glycerol'].map(n => mthChip(Lui, n, { size: 28, color: C.glucoseLt, stroke: C.glucose }));
  const mCross = [0, 1, 2].map(() => cross(Lui, 26));
  const cTooBig = mthChip(Lui, '**large, insoluble**: too big to pass through', { size: 32, bold: '#FF9AA6' });
  const cSmall = mthChip(Lui, '**small, soluble** → absorbed into the blood', { size: 32, bold: C.good });
  const smallTick = tick(Lui, 18);
  const cWall = T(Lui, 0, 10, 'gut wall', { size: 30, weight: 800, anchor: 'middle', fill: '#5A1028' });
  const cBlood = T(Lui, 0, 10, 'blood', { size: 30, weight: 800, anchor: 'middle', fill: '#FFD0D6' });
  // the doors: one pair of screen-door leaves at door 2, and the bolus behind them
  const DOOR = [419.4, 262, 174, 300];
  const dCp = E('clipPath', { id: 'mthDoorClip' }, defs()); E('rect', { x: DOOR[0], y: DOOR[1], width: DOOR[2], height: DOOR[3] }, dCp);
  const doorG = G(Lprop, { 'clip-path': 'url(#mthDoorClip)' });
  E('rect', { x: DOOR[0], y: DOOR[1], width: DOOR[2], height: DOOR[3], fill: '#1A0408' }, doorG);
  const dBolus = mgBolus(doorG, 50);
  const leaves = [0, 1].map(i => {
    const l = G(doorG);
    E('rect', { x: 0, y: 0, width: 87, height: 300, fill: 'rgba(190,225,240,0.32)', stroke: '#C9D3DC', 'stroke-width': 6 }, l);
    E('rect', { x: 3, y: 150, width: 81, height: 14, fill: '#FFB000', opacity: 0.85 }, l);
    return l;
  });
  const chime = T(Lprop, 600, 222, '♪ ♫', { size: 40, weight: 700, anchor: 'middle', fill: '#FFB000' });
  const cNext = mthChip(Lui, 'next station: **oesophagus**', { size: 30, stroke: MG_LINE, bold: '#FFB3C8' });

  /* ================= HUD ================= */
  const pa = mthPA(Lhud);

  /* ================= cut list ================= */
  const CUTS = [
    [-1, 'map', ''],
    [mid('first', 0.5), 'plat', 'first'],
    [at('teeth') - 0.06, 'cam', 'teeth'],
    [at('four') - 0.06, 'grid', 'four'],
    [at('area') - 0.06, 'grid', 'area'],
    [at('amy') - 0.06, 'plat', 'amy'],
    [at('thamy') - 0.06, 'conf', 'thamy'],
    [at('starch') - 0.06, 'plat', 'starch'],
    [at('chem') - 0.06, 'plat', 'chem'],
    [at('cracker') - 0.06, 'hawk', 'cracker'],
    [at('why') - 0.06, 'wall', 'why'],
    [at('bolus') - 0.06, 'cam', 'bolus'],
    [at('doors') - 0.06, 'plat', 'doors'],
  ];
  const cutAt = t => { let c = CUTS[0]; for (const k of CUTS) if (t >= k[0]) c = k; return c; };
  const FLAT = { k: 1, cx: 600, cy: 375 };
  const uiAll = [cHere, cStation, cBegins, cMech, cNoChem, cBolus, cBolusSub, ...tNames, ...tActs, bracket, cFour, cArea, saT, cFaster, cAmylase, cSaliva,
    cOneJob, cExcite, cSugars, chemCard, cStartsToo, cCracker, cSweet, cSugar, call, ...mLabs, ...pLabs, ...mCross, cTooBig, cSmall, smallTick, cWall, cBlood, cNext];
  const propAll = [micMain, map, teethDiag, cubeG, saliva, whoosh, winG, wb, chain, scis, arm, cracker, ...crSpark, molProt, molFat, doorG, chime];

  // food piece layout: level L (0..4): 2^L clusters; pieces packed tightly inside each cluster
  function piecePos(i, L) {
    const n = 1 << L, s = 16 / n, c = Math.floor(i / s), m = i % s, cols = Math.ceil(Math.sqrt(s));
    const rows = Math.ceil(s / cols), gx = (m % cols - (cols - 1) / 2) * 30, gy = (Math.floor(m / cols) - (rows - 1) / 2) * 22;
    let cx, cy;
    if (n <= 4) { cx = 600 + (c - (n - 1) / 2) * 170; cy = 418; }
    else { const per = n / 2, r = c % 2, k = Math.floor(c / 2); cx = 600 + (k - (per - 1) / 2) * (600 / per); cy = 418 + (r ? 34 : -34); }
    return [cx + gx * (1 + 0.15 * L), cy + gy * (1 + 0.15 * L)];
  }

  return t => {
    const [c0, shot, setup] = cutAt(t);
    op(gridShot, shot === 'map' || shot === 'grid' ? 1 : 0);
    op(platShot, shot === 'plat' ? 1 : 0);
    op(hawkShot, shot === 'hawk' ? 1 : 0);
    op(camShot, shot === 'cam' ? 1 : 0);
    op(wallShot, shot === 'wall' ? 1 : 0);
    confShot.set(shot === 'conf' ? 1 : 0, t);
    uiAll.forEach(e => op(e, 0)); propAll.forEach(e => op(e, 0));
    ltAmy.set(setup === 'amy' ? win(t, at('amy') + 0.5, at('amy') + 3.6, 0.3) : 0);
    let kavOn = 0, percyOn = 0, amyOn = 0, paOn = 0, cam = FLAT;
    const pTalk = scTalk(S, t, 'percy'), aTalk = scTalk(S, t, 'amy');
    const seat = (ch, parent) => { if (ch.parentNode !== parent) parent.appendChild(ch); };

    /* =============== the line map =============== */
    if (shot === 'map') {
      op(map, 1); tr(map, 600, 430); map.set(0, 0);
      const rp = 0.5 + 0.5 * Math.sin(t * 6);
      map.stations[0].ring.style.opacity = (0.5 + 0.5 * rp).toFixed(3);
      mthPin(cStation, t, at('first') + 0.05, 1e9, 640, 200);
      mthPin(cHere, t, at('first') + 0.4, 1e9, 230, 330 + 6 * Math.sin(t * 4 * AMP));
    }

    /* =============== the platform =============== */
    if (shot === 'plat') {
      seat(percy, Lcast); if (setup !== 'starch') seat(amy, Lcast);
      percyOn = 1;
      setText(plat.led, setup === 'doors' ? (t > mid('doors', 0.35) ? 'NEXT STATION: OESOPHAGUS' : 'DOORS CLOSING') : 'NOW SERVING: CHICKEN RICE');
      if (setup === 'first') {
        tr(percy, 250, 470, 1.2);
        percy.set({ t, mood: 'neutral', look: 0.4 });
        mthPin(cBegins, t, mid('first', 0.55), 1e9, 790, 400);
      }
      if (setup === 'amy') {
        tr(percy, 240, 470, 1.15);
        const inP = P(t, at('amy') - 0.02, 0.5, pop);
        percy.set({ t, mood: t > at('amy') + 0.35 ? 'deadpan' : 'shock', look: 1 });
        amyOn = 1;
        const bounce = Math.abs(Math.sin(t * 5.5)) * 26 * AMP;
        tr(amy, lerp(1400, 780, inP), 430 - bounce, 1.35, (1 - clamp(inP)) * -20);
        amy.set({ t, talk: aTalk, mood: 'happy', look: -0.3, sparkle: 1 });
        op(whoosh, (1 - P(t, at('amy') + 0.35, 0.3, linear)) * (t > at('amy') - 0.02 ? 1 : 0)); tr(whoosh, lerp(1600, 1010, inP), 430);
        const sp = P(t, mid('amy', 0.55), 0.45, pop);
        op(saliva, clamp(sp * 2.5)); tr(saliva, 1010, 380, Math.max(0.01, 0.6 + 0.4 * sp));
        mthPin(cAmylase, t, mid('amy', 0.35), 1e9, 790, 640);
        mthPin(cSaliva, t, mid('amy', 0.78), 1e9, 1010, 215);
        cam = { k: 1 + 0.05 * P(t, end('amy'), 0.6, linear), cx: 240, cy: 420 };
      }
      if (setup === 'starch') {
        // whiteboard; Amy fits her active site onto the end glucose; Snip! Snip! Snip!
        const sn = t >= at('snip') - 0.06;
        tr(percy, 130, 480, 0.95);
        percy.set({ t, mood: 'deadpan', look: 0.8 });
        op(wb, 1); tr(wb, WB[0], WB[1]);
        op(wbTitle, P(t, at('starch'), 0.3, linear));
        op(wbArrow, sn ? 0 : P(t, mid('starch', 0.18), 0.3, linear));
        op(wbLong, sn ? 0 : P(t, mid('starch', 0.45), 0.3, linear));
        op(chain, 1); tr(chain, CH[0], CH[1], CH[2]);
        // bead layout: bonds 1, 3, 5 break on each snip (pairs of glucose = sugars)
        const tS = [mid('snip', 0.08), mid('snip', 0.42), mid('snip', 0.78)];
        const brk = [1, 3, 5], gap = 34;
        const bp = tS.map(x => P(t, x, 0.3, easeOut));
        const pos = [];
        for (let i = 0; i < 7; i++) {
          let x = (i - 3) * 56;
          brk.forEach((b, k) => { if (i > b) x += gap * bp[k]; });
          let y = 0;
          brk.forEach((b, k) => { if (i === b || i === b + 1) y += (i === b ? -1 : 1) * 10 * Math.sin(bp[k] * Math.PI); });
          pos.push([x, y]);
        }
        chain.beads.forEach((b, i) => tr(b, pos[i][0], pos[i][1]));
        chain.bonds.forEach((l, i) => {
          attr(l, 'x1', pos[i][0]); attr(l, 'y1', pos[i][1]); attr(l, 'x2', pos[i + 1][0]); attr(l, 'y2', pos[i + 1][1]);
          const k = brk.indexOf(i); l.style.opacity = k < 0 ? '1' : (1 - clamp(bp[k] * 3)).toFixed(3);
        });
        let sx = -1;
        tS.forEach((x, k) => { if (t >= x - 0.05 && t < x + 0.35) sx = k; });
        if (sx >= 0) { op(scis, 1); const b = brk[sx]; tr(scis, CH[0] + CH[2] * (pos[b][0] + pos[b + 1][0]) / 2, CH[1] - 6); scis.set(clamp((t - tS[sx] + 0.05) / 0.4)); }
        if (sn) mthPin(cSugars, t, tS[2] + 0.25, 1e9, 800, 470);
        // Amy: comes in from below, then her notch sits on the end glucose
        amyOn = 1;
        const b0 = [CH[0] + CH[2] * pos[0][0], CH[1] + CH[2] * pos[0][1]];
        const fit = P(t, mid('starch', 0.62), 0.6, easeOut);
        const AS = 1.2, home = [b0[0] - 47, b0[1] + 80];
        if (amy.parentNode !== Lprop || amy.nextSibling !== chain) Lprop.insertBefore(amy, chain);
        const hop = sn ? Math.abs(Math.sin(t * 7)) * 10 * AMP : 0;
        tr(amy, lerp(250, home[0], fit), lerp(940, home[1], fit) - hop, AS);
        amy.set({ t, talk: aTalk, mood: 'happy', look: 0.6, sparkle: sn ? 1 : 0.4 });
      }
      if (setup === 'chem') {
        tr(percy, 230, 470, 1.15);
        percy.set({ t, talk: pTalk, mood: t < mid('chem', 0.7) ? 'neutral' : 'deadpan', look: 0.3 });
        mthPin(chemCard, t, at('chem') + 0.05, 1e9, 790, 372);
        const cp = P(t, mid('chem', 0.35), 0.5, easeOut);
        tr(hexA, -48 - 26 * cp, 0); tr(hexB, 48 + 26 * cp, 0); op(chemBond, 1 - clamp(cp * 3));
        mthPin(cStartsToo, t, mid('chem', 0.72), 1e9, 820, 580);
      }
      if (setup === 'doors') {
        // a close shot of one door: the bolus waits in the doorway; the doors close; the bolus leaves
        cam = { k: 1.5 + 0.06 * P(t, end('doors'), 0.8, linear), cx: 158, cy: 436 };
        tr(percy, 206, 459, 0.8);
        percy.set({ t, talk: pTalk, mood: 'deadpan', look: 0 });
        op(micMain, 1); tr(micMain, 206 + 50, 459 + 20, 0.6, -14);
        op(doorG, 1);
        const close = P(t, mid('doors', 0.05), 0.55, easeOut);
        tr(leaves[0], DOOR[0] - 80 * (1 - close), DOOR[1]); tr(leaves[1], DOOR[0] + 87 + 80 * (1 - close), DOOR[1]);
        const go = P(t, mid('doors', 0.55), 1.0, easeIn);
        tr(dBolus, lerp(506, 700, go), 470, 1, go * 160);
        op(chime, t > mid('doors', 0.3) && t < mid('doors', 0.3) + 1.2 ? 1 : 0); tr(chime, 600, 226 - 10 * P(t, mid('doors', 0.3), 1.2, linear));
        mthPin(cNext, t, mid('doors', 0.45), 1e9, 680, 655);
        amyOn = 1;
        const gone = t > mid('doors', 0.75);
        amy.set({ t, mood: gone ? 'sad' : 'happy', look: -0.6, sparkle: gone ? 0 : 1 });
        const wv = gone ? 0 : Math.sin(t * 10) * 8 * AMP;
        amy.setAttribute('transform', `translate(720 520) rotate(${wv.toFixed(2)}) scale(0.72)`);
      }
    }

    /* =============== mouth cam =============== */
    if (shot === 'cam') {
      paOn = 1;
      if (setup === 'teeth') {
        // four chomps; after each the pieces split (one lump -> 16 small pieces)
        const tc = [0.12, 0.32, 0.52, 0.72].map(f => mid('teeth', f));
        let shut = 0, L = 0;
        tc.forEach((c, k) => { const d = t - c; if (d > -0.18 && d < 0.18) shut = Math.max(shut, 1 - Math.abs(d) / 0.18); L += P(t, c, 0.35, easeOut); });
        tr(teethTop, 0, shut * 112); tr(teethBot, 0, -shut * 112);
        const Li = Math.floor(L), Lf = L - Li;
        PIECES.forEach((p, i) => { op(p, 1); const a = piecePos(i, Math.min(4, Li)), b = piecePos(i, Math.min(4, Li + 1)); tr(p, lerp(a[0], b[0], Lf), lerp(a[1], b[1], Lf), 1, (i * 37 % 20 - 10) * L / 4); });
        op(mBolus, 0);
        attr(tongue, 'd', 'M140,640 Q600,520 1060,640 L1060,760 L140,760 Z');
        mthPin(cMech, t, mid('teeth', 0.05), 1e9, 600, 140);
        mthPin(cNoChem, t, mid('teeth', 0.5), 1e9, 600, 570);
        drops.forEach(d => op(d, 0));
      } else {
        // bolus: the tongue rolls the pieces into one soft ball
        tr(teethTop, 0, 0); tr(teethBot, 0, 0);
        const rp = P(t, mid('bolus', 0.05), 1.6, ease);
        const lift = Math.sin(clamp((t - mid('bolus', 0.05)) / 1.6) * Math.PI);
        attr(tongue, 'd', `M140,640 Q600,${(520 - 90 * lift * AMP).toFixed(1)} 1060,640 L1060,760 L140,760 Z`);
        PIECES.forEach((p, i) => { const a = piecePos(i, 4), c = [600 + Math.cos(i) * 30, 418 + Math.sin(i * 2) * 24]; op(p, 1 - clamp((rp - 0.6) / 0.3)); tr(p, lerp(a[0], c[0], rp), lerp(a[1], c[1], rp), 1, i * 30 * rp); });
        const bp = clamp((rp - 0.5) / 0.4);
        op(mBolus, bp); tr(mBolus, 600, 418, Math.max(0.01, 0.5 + 0.5 * bp), (t - at('bolus')) * 90 * AMP);
        drops.forEach((d, i) => { const f = ((t * 0.9 + i / 3) % 1); op(d, t < mid('bolus', 0.8) ? Math.sin(f * Math.PI) : 0); tr(d, 470 + i * 130, lerp(250, 400, f)); });
        mthPin(cBolus, t, mid('bolus', 0.75), 1e9, 600, 140);
        mthPin(cBolusSub, t, mid('bolus', 0.35), 1e9, 600, 570);
      }
    }

    /* =============== teeth and cubes (dark grid) =============== */
    if (shot === 'grid') {
      paOn = 1;
      if (setup === 'four') {
        op(teethDiag, 1); tr(teethDiag, 600, 430, 1.45);
        mthPin(cFour, t, at('four') + 0.05, 1e9, 600, 140);
        const tn = [0.02, 0.24, 0.5, 0.62], ta = [0.1, 0.34, 0.74];
        teeth.teeth.forEach((th, i) => { const k = mid('four', tn[i]); const b = Math.sin(clamp((t - k) / 0.4) * Math.PI); tr(th, -195 + i * 130, -14 * b); });
        tNames.forEach((c, i) => mthPin(c, t, mid('four', tn[i]), 1e9, TX[i], 236));
        tActs.forEach((c, i) => mthPin(c, t, mid('four', ta[i]), 1e9, actX[i], 640));
        op(bracket, P(t, mid('four', ta[2]), 0.3, linear));
      } else {
        op(cubeG, 1); tr(cubeG, 600, 368);
        const split = mid('area', 0.25), sp = P(t, split, 0.7, easeOut), lit = P(t, mid('area', 0.5), 0.4, linear);
        bigFaces.forEach(f => op(f, t < split ? 1 : 0));
        cubeFaces(bigFaces, [-1, -1, -1], 2, BEIGE);
        const e = 0.55 * sp;
        small.forEach(c => {
          c.f.forEach(f => op(f, t < split ? 0 : 1));
          const o = [c.ix, c.iy, c.iz].map(v => (v - 0.5) * (1 + e) - 0.5);
          cubeFaces(c.f, o, 1, [0, 1, 2].map(i => mixC(BEIGE[i], YEL[i], lit)));
        });
        mthPin(cArea, t, at('area') + 0.05, 1e9, 600, 140);
        op(saT, 1); tr(saT, 600, 606);
        setText(saTxt, t < split + 0.3 ? 'surface: 24 squares' : lit < 0.5 ? 'surface: …' : 'surface: 48 squares (doubled!)');
        attr(saTxt, 'fill', lit > 0.5 ? C.energy : C.ink);
        mthPin(cFaster, t, mid('area', 0.72), 1e9, 600, 652);
      }
    }

    /* =============== Percy's confessional =============== */
    if (shot === 'conf') {
      seat(percy, Lcast); percyOn = 1;
      tr(percy, 430, 410, 1.5);
      percy.set({ t, talk: pTalk, mood: 'deadpan', look: 0 });
      op(winG, 1); tr(winG, 880, 250);
      seat(amy, amySlotWin); amyOn = 1;
      const bounce = Math.abs(Math.sin(t * 6)) * 60 * AMP;
      tr(amy, 0, 70 - bounce, 0.75);
      amy.set({ t, mood: 'happy', look: 0, sparkle: 1 });
      mthPin(cOneJob, t, mid('thamy', 0.12), 1e9, 880, 440);
      mthPin(cExcite, t, mid('thamy', 0.6), 1e9, 880, 510, 1, -3);
      cam = { k: 1 + 0.1 * P(t, end('thamy') - 0.2, 1.0, linear), cx: 430, cy: 380 };
    }

    /* =============== the hawker centre: the cracker =============== */
    if (shot === 'hawk') {
      hawker.upd(t);
      kavOn = 1;
      tr(kav, 600, 470, 1.5); tr(tableW, 600, 718, 0.9);
      const yes = t >= at('yes') - 0.06;
      kav.set({ t, talk: scTalk(S, t, 'kavya'), mood: yes ? (t < mid('yes', 0.5) ? 'shock' : 'happy') : 'neutral', look: yes ? -1 : 0.7 });
      op(arm, 1); tr(arm, 690, 566, 1.05, -62);
      op(cracker, 1); tr(cracker, 786, 372, 1, -8);
      mthPin(cCracker, t, mid('cracker', 0.3), yes ? at('yes') : 1e9, 930, 230);
      if (yes) {
        op(call, 1); tr(call, 290, 330);
        seat(amy, call.screen); amyOn = 1;
        tr(amy, 0, 30 - Math.abs(Math.sin(t * 7)) * 30 * AMP, 0.85);
        amy.set({ t, talk: aTalk, mood: 'happy', look: 0.4, sparkle: 1 });
        crSpark.forEach((s, i) => { const a = t * 2 + i * 2.1; op(s, 0.6 + 0.4 * Math.sin(t * 8 + i)); tr(s, 786 + Math.cos(a) * 80, 372 + Math.sin(a) * 80, 0.8 + 0.3 * Math.sin(t * 6 + i)); });
        mthPin(cSweet, t, mid('yes', 0.2), 1e9, 960, 230, 1, 6);
        mthPin(cSugar, t, mid('yes', 0.55), 1e9, 930, 490);
        cam = { k: 1 + 0.05 * P(t, end('yes'), 0.6, linear), cx: 600, cy: 420 };
      }
    }

    /* =============== the gut wall =============== */
    if (shot === 'wall') {
      rbcs.forEach((r, i) => tr(r, ((i * 260 + t * 70 * AMP) % 1350) - 75, 608 + 6 * Math.sin(t * 2 + i)));
      mthPin(cWall, t, at('why') + 0.2, 1e9, 1083, 482);
      mthPin(cBlood, t, at('why') + 0.2, 1e9, 1110, 608);
      const sol = t >= at('soluble') - 0.06;
      [molStarch, molProt, molFat].forEach(m => op(m, 1));
      if (!sol) {
        mthPin(cTooBig, t, mid('why', 0.42), 1e9, 640, 135);
        // the large molecules bump into the wall and bounce off
        MOL.forEach(([x, y, s], i) => {
          const ph = (t - at('why') - 0.4 - i * 0.25) / 1.5, f = ph - Math.floor(ph);
          const bump = ph > 0 ? Math.pow(Math.sin(f * Math.PI), 2) : 0;
          const m = [molStarch, molProt, molFat][i];
          tr(m, x, y + 110 * bump, s);
          mthPin(mLabs[i], t, at('why') + 0.1 + i * 0.25, 1e9, x, 205);
          op(mCross[i], ph > 0 && bump > 0.8 ? 1 : 0); tr(mCross[i], x + 90, y + 100);
        });
        molStarch.set(0); molProt.set(0); molFat.set(0);
      } else {
        paOn = 1;
        mthPin(cSmall, t, mid('soluble', 0.35), 1e9, 590, 135);
        op(smallTick, P(t, mid('soluble', 0.5), 0.2, linear)); tr(smallTick, 590 - cSmall.w / 2 - 34, 135);
        const sh = P(t, at('soluble') + 0.1, 0.5, easeOut);
        // shatter: chains into single units, the fat into 3 fatty acids + glycerol, then down into the blood
        const goT = i => mid('soluble', 0.3) + i * 0.11;
        const place = (m, s, x0, y0, wx, wy) => [(wx - x0) / s, (wy - y0) / s];
        const route = (i, sx, sy) => {
          const p = clamp((t - goT(i)) / 1.3);
          const y = p < 0.75 ? lerp(sy, 608, ease(p / 0.75)) : 608;
          const x = sx + (p >= 0.75 ? (t - goT(i) - 0.975) * 60 : 0) + 20 * Math.sin(p * 3);
          return [x, y];
        };
        [[molStarch, 0], [molProt, 1]].forEach(([m, k]) => {
          const [x0, y0, s] = MOL[k];
          tr(m, x0, y0, s);
          m.bonds.forEach(b => { b.style.opacity = (1 - clamp(sh * 3)).toFixed(3); });
          m.beads.forEach((b, i) => {
            const sx = x0 + (i - (m.beads.length - 1) / 2) * (56 + 30 * sh) * s, sy = y0 + (i % 2 ? 14 : -14) * sh;
            const [wx, wy] = route(k * 7 + i, sx, sy);
            const [lx, ly] = place(m, s, x0, y0, wx, wy);
            tr(b, lx, ly);
          });
        });
        {
          const [x0, y0, s] = MOL[2];
          tr(molFat, x0, y0, s);
          // local start positions: glycerol drifts left, the three fatty acids slide off to the right
          const st = [[-36 * sh, 0], ...[-40, 0, 40].map((ay, j) => [-44 + 34 * sh, ay + (j - 1) * 30 * sh])];
          [molFat.glycerol, ...molFat.acids].forEach((pt, j) => {
            const [wx, wy] = route(14 + j, x0 + s * st[j][0], y0 + s * st[j][1]);
            tr(pt, (wx - x0) / s, (wy - y0) / s);
          });
        }
        pLabs.forEach((c, i) => mthPin(c, t, at('soluble') + 0.3 + i * 0.15, mid('soluble', 0.7), [205, 505, 812][i], 205));
      }
    }

    // Percy on the PA inset
    if (paOn) {
      seat(percy, pa.inner); percyOn = 1;
      tr(percy, 0, 52, 0.7);
      percy.set({ t, talk: pTalk, mood: setup === 'bolus' || shot === 'wall' ? 'deadpan' : 'neutral', look: 0 });
    }
    op(pa, paOn); if (paOn) tr(pa, 1075, 205);

    [Lbg, Lcast, Lprop].forEach(l => mthCam(l, cam));
    op(kav, kavOn); op(tableW, kavOn); op(percy, percyOn); op(amy, amyOn);
  };
});
