/* EVERY JOULE COUNTS, scene 2: "Pat is not a store".
   Shots (hard sitcom cuts): office (stores linked by a transfer pathway; the door bursts, Pat zooms in and
   brakes) -> Pat close (keep x / move v, lower third) -> Constance confessional (Jules tries to file a box with
   Pat) -> the four routes panel (mechanically: push, pull, stretch; the kick; electrically: phone charging;
   by heating: hot pan, cold egg; by radiation: sunshine and a speaker) -> Jules offers a "light energy" parcel
   -> "I'm. Not. A. Store." -> Constance's rule card -> Dad's kettle at 34 °C -> the flow chain builds
   (electrically, then by heating) -> Kavya counts two pathways -> "Correct. Annoyingly." -> Kavya's confessional. */
scene('pat', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;
  const INK = SC_INK;
  const PC = {}; EN_PATHS.forEach(p => PC[p.k] = p.col);
  const SC = {}; EN_STORES.forEach(s => SC[s.k] = s.col);

  /* ---------- local helpers (prefixed pt) ---------- */
  const ptPop = (el, x, y, p, s0, r) => { op(el, clamp(p * 2.5)); tr(el, x, y, Math.max(0.01, (s0 || 1) * (0.7 + 0.3 * p)), r); };
  function ptChip(parent, str, o) {
    o = o || {};
    const size = o.size || 30, h = Math.round(size * 1.75), g = G(parent);
    const w = o.w || Math.ceil(textWidth(str, size, FD, 800) * 1.04 + size * 1.4);
    E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: o.rx !== undefined ? o.rx : h / 2, fill: o.fill || 'rgba(10,27,39,0.92)', stroke: o.stroke || 'none', 'stroke-width': o.sw || 3 }, g);
    T(g, 0, size * 0.35, str, { size, weight: 700, anchor: 'middle', fill: o.color || C.ink, boldFill: o.boldFill });
    g.w = w; g.h = h;
    return g;
  }
  const ptPush = (g, k, fx, fy) => g.setAttribute('transform', Math.abs(k - 1) < 1e-4 ? '' : `translate(${fx} ${fy}) scale(${k.toFixed(4)}) translate(${-fx} ${-fy})`);
  // a store box for flow diagrams: label lines, fill colour
  function ptBox(parent, w, h, lines, fill, ink) {
    const g = G(parent);
    E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: 14, fill, stroke: INK, 'stroke-width': 4 }, g);
    const n = lines.length;
    lines.forEach(([s, size], i) => T(g, 0, (i - (n - 1) / 2) * (size + 6) + size * 0.35, s, { size, weight: 800, anchor: 'middle', fill: ink || INK }));
    return g;
  }
  // a skin-coloured arm (shoulder -> elbow -> hand) to hang on Kavya
  function ptArm(parent, pts, sleeve) {
    const g = G(parent);
    E('path', { d: `M${pts[0][0]},${pts[0][1]} L${pts[1][0]},${pts[1][1]}`, stroke: sleeve || '#2E7DD8', 'stroke-width': 32, 'stroke-linecap': 'round' }, g);
    E('path', { d: `M${pts[1][0]},${pts[1][1]} L${pts[2][0]},${pts[2][1]}`, stroke: '#B9784E', 'stroke-width': 23, 'stroke-linecap': 'round' }, g);
    E('circle', { cx: pts[2][0], cy: pts[2][1], r: 19, fill: '#B9784E' }, g);
    return g;
  }

  /* ---------- layers ---------- */
  const CAM = G(root), Lbg = G(CAM), Lmid = G(CAM), Lcast = G(CAM), Lfg = G(CAM), Lhud = G(root);

  /* =================== SETS =================== */
  const OFF = G(Lbg); enOffice(OFF);
  const offDim = E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#06120F', opacity: 0.55 }, OFF);
  const CONFc = enConf(Lbg, 'con'), CONFk = enConf(Lbg, 'kavya');
  const FLAT = G(Lbg); const flat = enFlat(FLAT);
  // Dad's kitchen corner
  const KIT = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#E4F1EC', '#C9E2D9', true) }, KIT);
  { let d = ''; for (let y = 120; y < 600; y += 50) d += `M0,${y} L1200,${y} `; for (let x = 0; x < 1200; x += 60) d += `M${x},100 L${x},600 `; E('path', { d, stroke: '#B6D2C8', 'stroke-width': 2 }, KIT); }
  E('rect', { x: 0, y: 600, width: 1200, height: 150, fill: linGrad('#8B5A2B', '#5A3A1A', true) }, KIT);
  E('rect', { x: 0, y: 588, width: 1200, height: 18, rx: 4, fill: '#E9DCC6', stroke: '#9C8A6E', 'stroke-width': 3 }, KIT);
  const kWin = G(KIT); tr(kWin, 880, 130);
  E('rect', { x: 0, y: 0, width: 260, height: 200, fill: linGrad('#6EC6FF', '#CDEBFF', true), stroke: '#FFFFFF', 'stroke-width': 10 }, kWin);
  const kSun = sun(kWin, 30); tr(kSun, 180, 70);
  const kSweat = [0, 1, 2].map(i => E('path', { d: 'M0,-10 Q8,2 0,7 Q-8,2 0,-10 Z', fill: '#BFEAFF', stroke: '#5AB4E0', 'stroke-width': 2 }, kWin));
  E('path', { d: 'M130,0 L130,200', stroke: '#FFFFFF', 'stroke-width': 8 }, kWin);
  // wall socket and the kettle cable
  E('rect', { x: 160, y: 430, width: 64, height: 64, rx: 8, fill: '#F4F7FA', stroke: '#8F9CAB', 'stroke-width': 4 }, KIT);
  E('rect', { x: 178, y: 446, width: 10, height: 18, fill: '#3A4B5C' }, KIT); E('rect', { x: 196, y: 446, width: 10, height: 18, fill: '#3A4B5C' }, KIT);
  const CABLE = [[192, 480], [192, 574], [470, 574]];
  const cable = wire(KIT, CABLE, { color: '#3A4B5C', width: 7, dotColor: '#FFE45C', dot: 6, spacing: 40 });
  const kettle = enKettle(KIT, 1.25); tr(kettle, 560, 590);
  const kBub = [0, 1, 2, 3].map(() => E('circle', { r: 4, fill: '#FFFFFF', opacity: 0.8 }, kettle.firstChild));
  const kHeat = heatWaves(kettle.firstChild, { n: 3, h: 46, spacing: 22, width: 4, color: '#FF6B5C' }); tr(kHeat, 0, -44);
  const mug = G(KIT); tr(mug, 330, 590);
  E('path', { d: 'M40,-70 Q72,-66 70,-38 Q68,-16 40,-20', fill: 'none', stroke: INK, 'stroke-width': 7 }, mug);
  E('path', { d: 'M-44,-90 L44,-90 L38,0 L-38,0 Z', fill: '#FFFFFF', stroke: INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, mug);
  T(mug, 0, -36, 'KOPI', { size: 26, weight: 800, anchor: 'middle', fill: '#8A4A1E' });

  /* =================== PROPS =================== */
  // arrival: two stores joined by a transfer pathway, the office door
  const arr = G(Lmid);
  { const a = ptBox(arr, 200, 80, [['store', 30]], '#FFC247'); tr(a, 760, 260);
    const b = ptBox(arr, 200, 80, [['store', 30]], '#5B8DEF'); tr(b, 1030, 260); }
  const arrA = arrow(arr, 862, 260, 928, 260, { color: '#FF9F43', width: 8 });
  const arrChip = ptChip(Lfg, '**TRANSFER PATHWAYS**', { size: 38, fill: 'rgba(10,27,39,0.94)', stroke: '#FF9F43', boldFill: '#FFB866' });
  const door = G(Lmid);
  E('rect', { x: 14, y: 222, width: 168, height: 346, fill: '#0A1714', stroke: '#5A3A1A', 'stroke-width': 8 }, door);
  const leaf = G(door);
  E('rect', { x: 22, y: 230, width: 152, height: 330, fill: linGrad('#C99A5C', '#9C6B3E', false), stroke: INK, 'stroke-width': 4 }, leaf);
  E('circle', { cx: 150, cy: 400, r: 8, fill: '#E2B33C', stroke: INK, 'stroke-width': 2 }, leaf);
  T(leaf, 98, 300, 'POST', { size: 26, weight: 800, anchor: 'middle', fill: '#3A2600' });
  const bam = G(Lfg);
  { let d = ''; for (let i = 0; i < 12; i++) { const a = i / 12 * TAU, r = i % 2 ? 46 : 80; d += (i ? 'L' : 'M') + (Math.cos(a) * r).toFixed(1) + ',' + (Math.sin(a) * r).toFixed(1); } E('path', { d: d + 'Z', fill: '#FFE45C', stroke: INK, 'stroke-width': 4 }, bam); T(bam, 0, 12, 'BAM!', { size: 34, weight: 800, anchor: 'middle', fill: '#C62828' }); }
  const speed = E('path', { d: 'M-150,-40 L-330,-40 M-170,0 L-400,0 M-150,40 L-330,40', stroke: '#FFE0B0', 'stroke-width': 8, 'stroke-linecap': 'round' }, Lmid);
  const dust = [0, 1, 2].map(() => E('circle', { r: 20, fill: '#C9B98E', opacity: 0.6 }, Lmid));

  // hi: keep / move
  const cKeep = G(Lfg); { const c = ptChip(cKeep, 'I don\'t **keep** energy', { size: 36, stroke: C.bad, boldFill: '#FF9AA2' }); const x = cross(cKeep, 16); tr(x, c.w / 2 + 34, 0); }
  const cMove = G(Lfg); { const c = ptChip(cMove, 'I **move** it', { size: 36, stroke: C.good, boldFill: C.good }); const k = tick(cMove, 18); tr(k, c.w / 2 + 36, 4); }

  // confessional inset: Jules tries to file a box with Pat
  const inset = G(Lmid);
  card(inset, 640, 150, 480, 400, { fill: 'rgba(30,20,8,0.92)', stroke: '#FF9F43', sw: 4 });
  T(inset, 880, 200, 'Tuesday. Again.', { size: 30, weight: 700, anchor: 'middle', fill: '#FFB866' });
  const fbox = G(Lfg);
  E('rect', { x: -50, y: -36, width: 100, height: 72, rx: 6, fill: '#C99A5C', stroke: INK, 'stroke-width': 4 }, fbox);
  E('rect', { x: -30, y: -12, width: 60, height: 26, rx: 4, fill: '#F4EBD3', stroke: INK, 'stroke-width': 2 }, fbox);
  T(fbox, 0, 8, 'FILE', { size: 20, weight: 800, anchor: 'middle', fill: INK });
  const fboxL = T(Lfg, 0, 0, 'please keep this?', { size: 26, weight: 700, anchor: 'middle', fill: '#FFE45C' });

  // routes panel
  const RP = G(Lmid);
  card(RP, 470, 110, 700, 560, { fill: 'rgba(8,22,20,0.94)', stroke: '#FF9F43', sw: 4 });
  const slots = EN_PATHS.map((p, i) => {
    const g = G(RP); tr(g, 575 + i * 160, 180);
    const ring_ = E('circle', { r: 46, fill: '#0B1F1A', stroke: p.col, 'stroke-width': 5 }, g);
    enPathIcon(g, p.k, 0.62);
    const n = T(g, -40, -30, String(i + 1), { size: 26, weight: 800, anchor: 'middle', fill: p.col });
    return { g, ring_ };
  });
  const RT = [
    ['1  MECHANICALLY', 'a **force** pushes, pulls or stretches'],
    ['2  ELECTRICALLY', 'an **electric current** in a circuit'],
    ['3  BY HEATING', 'from **hotter** to **colder**'],
    ['4  BY RADIATION', 'carried by **waves**'],
  ].map(([a, b], i) => { const g = G(RP); T(g, 820, 290, a, { size: 48, weight: 800, anchor: 'middle', fill: EN_PATHS[i].col }); T(g, 820, 340, b, { size: 32, weight: 600, anchor: 'middle', fill: C.ink, boldFill: EN_PATHS[i].col }); return g; });
  // demo 1: push, pull, stretch
  const dMech = G(RP), mechParts = [];
  { const mk = (x, lab, draw) => { const g = G(dMech); tr(g, x, 480); draw(g); T(g, 0, 100, lab, { size: 30, weight: 700, anchor: 'middle', fill: '#FFB866' }); mechParts.push(g); return g; };
    mk(600, 'push', g => { E('rect', { x: 0, y: -34, width: 68, height: 68, rx: 6, fill: '#B07A45', stroke: INK, 'stroke-width': 4 }, g); arrow(g, -76, 0, -6, 0, { color: '#FF9F43', width: 9 }); });
    mk(820, 'pull', g => { E('rect', { x: -78, y: -34, width: 68, height: 68, rx: 6, fill: '#B07A45', stroke: INK, 'stroke-width': 4 }, g); arrow(g, -6, 0, 70, 0, { color: '#FF9F43', width: 9 }); });
    mk(1040, 'stretch', g => { let d = 'M-34,0'; for (let k = 0; k < 7; k++) d += ` L${-28 + k * 9.3},${k % 2 ? 16 : -16}`; d += ' L34,0'; E('path', { d, fill: 'none', stroke: '#56D69B', 'stroke-width': 6, 'stroke-linejoin': 'round' }, g); arrow(g, -40, 0, -84, 0, { color: '#FF9F43', width: 8 }); arrow(g, 40, 0, 84, 0, { color: '#FF9F43', width: 8 }); }); }
  // demo 1b: the kick
  const dKick = G(RP);
  const leg = G(dKick); tr(leg, 560, 400);
  E('path', { d: 'M0,0 L0,120', stroke: '#1E2A44', 'stroke-width': 34, 'stroke-linecap': 'round' }, leg);
  E('path', { d: 'M-6,118 Q-4,142 22,142 L54,142 Q62,128 46,120 L10,116 Z', fill: '#FF5FA2', stroke: INK, 'stroke-width': 3 }, leg);
  const kBall = G(dKick);
  E('path', { d: 'M-40,-12 L-90,-12 M-44,0 L-110,0 M-40,12 L-90,12', stroke: '#FFFFFF', 'stroke-width': 5, 'stroke-linecap': 'round' }, kBall);
  const kbSpeed = kBall.lastChild;
  E('circle', { r: 28, fill: '#F4F7FA', stroke: INK, 'stroke-width': 4 }, kBall);
  E('path', { d: 'M0,-10 L10,-3 L6,9 L-6,9 L-10,-3 Z', fill: INK }, kBall);
  const kBar = G(dKick); tr(kBar, 900, 410);
  T(kBar, 0, -22, "ball's **kinetic** store", { size: 28, weight: 700, anchor: 'middle', fill: C.ink, boldFill: SC.kinetic });
  E('rect', { x: -130, y: -6, width: 260, height: 32, rx: 10, fill: '#0B1F1A', stroke: SC.kinetic, 'stroke-width': 3 }, kBar);
  const kBarF = E('rect', { x: -126, y: -2, width: 0, height: 24, rx: 8, fill: SC.kinetic }, kBar);
  const kFlow = G(dKick);
  { const a = ptBox(kFlow, 150, 60, [['force', 30]], '#FF9F43'); tr(a, 680, 622); const b = ptBox(kFlow, 210, 60, [['kinetic', 30]], SC.kinetic); tr(b, 960, 622); arrow(kFlow, 760, 622, 850, 622, { color: C.ink, width: 6 }); }
  // demo 2: phone charging
  const dElec = G(RP);
  E('rect', { x: 520, y: 430, width: 60, height: 60, rx: 8, fill: '#F4F7FA', stroke: '#8F9CAB', 'stroke-width': 4 }, dElec);
  const pCable = wire(dElec, [[550, 490], [550, 600], [930, 600], [930, 560]], { color: '#C9D3DC', width: 7, dotColor: '#FFE45C', dot: 6, spacing: 36 });
  const phone = G(dElec); tr(phone, 980, 480);
  E('rect', { x: -50, y: -90, width: 100, height: 180, rx: 14, fill: '#1B2733', stroke: INK, 'stroke-width': 4 }, phone);
  E('rect', { x: -40, y: -76, width: 80, height: 146, rx: 6, fill: '#2E4A7D' }, phone);
  E('rect', { x: -24, y: -40, width: 48, height: 80, rx: 6, fill: 'none', stroke: '#FFFFFF', 'stroke-width': 4 }, phone);
  E('rect', { x: -8, y: -48, width: 16, height: 8, fill: '#FFFFFF' }, phone);
  const batt = E('rect', { x: -18, y: 34, width: 36, height: 0, fill: '#56D69B' }, phone);
  const eLab = T(dElec, 740, 650, 'current flows in the cable', { size: 28, weight: 700, anchor: 'middle', fill: '#FFE45C' });
  // demo 3: hot pan, cold egg
  const dHeat = G(RP);
  E('ellipse', { cx: 800, cy: 600, rx: 150, ry: 30, fill: glow('#FF3B2F'), opacity: 0.9 }, dHeat);
  E('path', { d: 'M660,560 L940,560 L920,600 L680,600 Z', fill: '#3A4B5C', stroke: INK, 'stroke-width': 4 }, dHeat);
  E('path', { d: 'M940,570 L1060,560', stroke: INK, 'stroke-width': 12, 'stroke-linecap': 'round' }, dHeat);
  const egg = G(dHeat); tr(egg, 800, 548);
  E('path', { d: 'M-80,4 Q-90,-20 -50,-24 Q-30,-40 10,-30 Q60,-36 74,-14 Q90,6 60,10 Z', fill: '#FFFFFF', stroke: '#C9D3DC', 'stroke-width': 3 }, egg);
  E('circle', { cx: 0, cy: -14, r: 20, fill: ball('#FFC247', '#E89A12') }, egg);
  const sizz = heatWaves(dHeat, { n: 3, h: 60, spacing: 40, width: 5, color: '#FF8A3D' }); tr(sizz, 800, 520);
  const hArr = arrow(dHeat, 700, 600, 760, 530, { color: '#FF6B5C', width: 7, bend: -30 });
  const hHot = T(dHeat, 600, 640, 'hotter', { size: 32, weight: 800, anchor: 'middle', fill: '#FF6B5C' });
  const hCold = T(dHeat, 1000, 470, 'colder', { size: 32, weight: 800, anchor: 'middle', fill: '#7FD3FF' });
  // demo 4: sunshine and a speaker
  const dRad = G(RP);
  const rSun = sun(dRad, 34); tr(rSun, 560, 450);
  const rWaves = [0, 1].map(i => { const w = sineWave(dRad, { w: 400, amp: 16, wl: 80, color: '#FFE45C', width: 5 }); tr(w, 630, 430 + i * 40); return w; });
  T(dRad, 1060, 470, 'light,', { size: 28, weight: 700, anchor: 'start', fill: '#FFE45C' });
  T(dRad, 1060, 504, 'infrared', { size: 28, weight: 700, anchor: 'start', fill: '#FF8A3D' });
  const spk = G(dRad); tr(spk, 560, 590);
  E('rect', { x: -30, y: -42, width: 60, height: 84, rx: 8, fill: '#3A4B5C', stroke: INK, 'stroke-width': 4 }, spk);
  E('circle', { cy: 8, r: 20, fill: '#1B2733', stroke: '#8F9CAB', 'stroke-width': 3 }, spk);
  const sArcs = [0, 1, 2, 3, 4].map(() => E('path', { d: 'M0,-34 Q22,0 0,34', fill: 'none', stroke: '#B48CFF', 'stroke-width': 6, 'stroke-linecap': 'round' }, dRad));
  T(dRad, 1060, 600, 'sound', { size: 28, weight: 700, anchor: 'start', fill: '#B48CFF' });
  // tiny Pat who rides the routes
  const mini = cast(Lfg, 'pat', { s: 0.24 });

  // parcel of light energy
  const parcel = G(Lfg);
  E('circle', { r: 90, fill: glow('#FFE45C') }, parcel);
  E('rect', { x: -56, y: -44, width: 112, height: 88, rx: 8, fill: '#FFF2A8', stroke: INK, 'stroke-width': 4 }, parcel);
  E('path', { d: 'M0,-44 L0,44 M-56,0 L56,0', stroke: '#E8424F', 'stroke-width': 8 }, parcel);
  E('path', { d: 'M0,-44 Q-26,-70 -30,-50 Q-24,-40 0,-44 Q26,-70 30,-50 Q24,-40 0,-44 Z', fill: '#E8424F', stroke: INK, 'stroke-width': 2 }, parcel);
  const parcelL = ptChip(Lfg, 'light energy', { size: 28, fill: '#FFE45C', color: INK });

  // I'M. NOT. A. STORE.
  const NO = ["I'M.", 'NOT.', 'A.', 'STORE.'].map((w, i) => ptChip(Lfg, w, { size: 66, fill: i === 3 ? '#E8424F' : '#FF9F43', color: i === 3 ? '#FFFFFF' : INK, stroke: INK, sw: 5, rx: 18 }));

  // the rule card
  const RC = G(Lmid);
  card(RC, 330, 112, 840, 560, { fill: 'rgba(8,22,20,0.95)', stroke: '#E2B33C', sw: 4 });
  E('line', { x1: 750, y1: 140, x2: 750, y2: 480, stroke: '#3A5A50', 'stroke-width': 3 }, RC);
  const rcL = G(RC), rcR = G(RC);
  T(rcL, 540, 190, 'STORES', { size: 52, weight: 800, anchor: 'middle', fill: '#E2B33C', ls: 2 });
  T(rcL, 540, 238, '= **where** energy is held', { size: 30, weight: 600, anchor: 'middle', fill: C.ink, boldFill: '#E2B33C' });
  EN_STORES.forEach((st, i) => { const ic = enStoreIcon(rcL, st.k, 0.5); tr(ic, 405 + (i % 4) * 90, 315 + Math.floor(i / 4) * 92); });
  T(rcR, 960, 190, 'PATHWAYS', { size: 52, weight: 800, anchor: 'middle', fill: '#FF9F43', ls: 2 });
  T(rcR, 960, 238, '= **how** it moves', { size: 30, weight: 600, anchor: 'middle', fill: C.ink, boldFill: '#FF9F43' });
  EN_PATHS.forEach((p, i) => { const ic = enPathIcon(rcR, p.k, 0.6); tr(ic, 890 + (i % 2) * 140, 315 + Math.floor(i / 2) * 92); });
  const RW = ['heat', 'light', 'sound', 'electricity'].map((w, i) => { const c = ptChip(RC, w, { size: 32, fill: '#2A1F14', stroke: '#FF9F43', color: '#FFB866' }); return c; });
  { let x = 0; const gap = 18, tot = RW.reduce((s, c) => s + c.w, 0) + gap * 3; x = 750 - tot / 2; RW.forEach(c => { c.cx = x + c.w / 2; x += c.w + gap; }); }
  const rcV = G(RC);
  { const a = T(rcV, 600, 625, '**pathways**', { size: 36, weight: 700, anchor: 'middle', fill: C.ink, boldFill: C.good }); const k = tick(rcV, 16); tr(k, 722, 612);
    T(rcV, 900, 625, '**stores**', { size: 36, weight: 700, anchor: 'middle', fill: C.ink, boldFill: C.bad }); const x = cross(rcV, 14); tr(x, 980, 612); }

  // the kettle's flow chain (stays across the cut to Kavya)
  const CH = G(Lfg);
  E('rect', { x: 30, y: 116, width: 1140, height: 220, rx: 18, fill: 'rgba(8,22,20,0.93)', stroke: '#3A5A50', 'stroke-width': 3 }, CH);
  const chB1 = ptBox(CH, 230, 96, [['MAINS', 34], ['socket', 26]], '#E6EEF4'); tr(chB1, 190, 220);
  const chB2 = ptBox(CH, 250, 96, [['HEATING', 32], ['ELEMENT', 32]], '#FF9A8F'); tr(chB2, 600, 220);
  const chB3 = ptBox(CH, 250, 96, [['WATER', 32], ['thermal store', 26]], SC.thermal); tr(chB3, 1010, 220);
  const chA1 = arrow(CH, 314, 220, 468, 220, { color: PC.elec, width: 9 });
  const chA2 = arrow(CH, 734, 220, 878, 220, { color: PC.heat, width: 9 });
  const chI1 = enPathIcon(CH, 'elec', 0.42); tr(chI1, 391, 168);
  const chI2 = enPathIcon(CH, 'heat', 0.42); tr(chI2, 806, 168);
  const chL1 = T(CH, 391, 296, 'electrically', { size: 28, weight: 800, anchor: 'middle', fill: PC.elec });
  const chL2 = T(CH, 806, 296, 'by heating', { size: 28, weight: 800, anchor: 'middle', fill: '#FF9A8F' });
  const two = ptChip(Lfg, '**2 pathways**, 1 kettle', { size: 36, fill: 'rgba(8,22,20,0.94)', stroke: '#FF9F43', boldFill: '#FFB866' });
  const hot = G(Lfg); { const c = ptChip(hot, '34 °C', { size: 38, fill: '#E8424F', color: '#FFFFFF', stroke: '#FFFFFF' }); }
  const careC = ptChip(Lfg, 'Dad: does not care', { size: 30, fill: 'rgba(10,27,39,0.9)', color: '#FFE45C' });

  // correct
  const okTick = tick(Lfg, 16);
  const okTxt = T(Lfg, 0, 0, 'correct', { size: 28, weight: 700, anchor: 'middle', fill: C.good });
  // Kavya's phone
  const phn = G(Lmid); tr(phn, 900, 360);
  E('rect', { x: -150, y: -230, width: 300, height: 460, rx: 30, fill: '#1B2733', stroke: INK, 'stroke-width': 5 }, phn);
  E('rect', { x: -132, y: -200, width: 264, height: 400, rx: 12, fill: '#F2F7FA' }, phn);
  E('rect', { x: -132, y: -200, width: 264, height: 56, fill: '#2E7DD8' }, phn);
  T(phn, 0, -162, 'EVERYONE (43)', { size: 26, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  const msg = G(phn);
  E('rect', { x: -112, y: -120, width: 228, height: 112, rx: 16, fill: '#56D69B' }, msg);
  T(msg, 2, -80, 'She said I was', { size: 26, weight: 700, anchor: 'middle', fill: INK });
  T(msg, 2, -40, 'CORRECT!!!', { size: 32, weight: 800, anchor: 'middle', fill: INK });
  const typing = G(phn);
  E('rect', { x: -112, y: 20, width: 110, height: 52, rx: 16, fill: '#C9D3DC' }, typing);
  const tdots = [0, 1, 2].map(i => E('circle', { cx: -84 + i * 26, cy: 46, r: 7, fill: '#5A6B7A' }, typing));
  const tLab = T(phn, 0, 150, 'telling everyone', { size: 26, weight: 700, anchor: 'middle', fill: '#5A6B7A' });

  /* =================== CAST =================== */
  const con = cast(Lcast, 'con'), jul = cast(Lcast, 'jules'), pat = cast(Lcast, 'pat'), kav = cast(Lcast, 'kavya');
  const armCount = ptArm(kav.firstChild, [[70, 90], [128, 10], [150, -70]]);
  const fingers = [E('path', { d: 'M146,-84 L144,-128', stroke: '#B9784E', 'stroke-width': 11, 'stroke-linecap': 'round' }, armCount), E('path', { d: 'M160,-82 L166,-124', stroke: '#B9784E', 'stroke-width': 11, 'stroke-linecap': 'round' }, armCount)];
  const armsUp = G(kav.firstChild);
  ptArm(armsUp, [[-66, 92], [-124, 0], [-150, -110]]); ptArm(armsUp, [[66, 92], [124, 0], [150, -110]]);

  /* =================== HUD =================== */
  const ltP = scLowerThird(Lhud, 'PAT', 'Courier. A pathway. NOT a store.');

  /* =================== SHOTS =================== */
  const SH = [
    ['arrive', -1e9, 'office'],
    ['hi', at('hi') - 0.06, 'office'],
    ['thpat', at('thpat') - 0.06, 'confc'],
    ['routes', at('mech') - 0.06, 'office'],
    ['leave', at('leave') - 0.06, 'office'],
    ['no', at('no') - 0.06, 'office'],
    ['rule', at('rule') - 0.06, 'office'],
    ['kettle', at('kettle') - 0.06, 'kitchen'],
    ['so', at('so') - 0.06, 'flat'],
    ['correct', at('correct') - 0.06, 'office'],
    ['thcorrect', at('thcorrect') - 0.06, 'confk'],
  ];
  const shotAt = t => { let k = 0; for (let i = 0; i < SH.length; i++) if (t >= SH[i][1]) k = i; return SH[k]; };
  const tPat = mid('pat', 0.66);            // Pat bursts in on "that means Pat"
  const ROUTES = ['mech', 'elec', 'heat', 'rad'];
  // a point along the kettle cable (0..1) and its direction
  const cablePt = q => { const L1 = 94, L2 = 278, s = q * (L1 + L2); return s < L1 ? [192, 480 + s, 90] : [192 + (s - L1), 574, 0]; };

  return t => {
    const shot = shotAt(t), sid = shot[0], set = shot[2];
    op(OFF, set === 'office' ? 1 : 0); op(FLAT, set === 'flat' ? 1 : 0); op(KIT, set === 'kitchen' ? 1 : 0);
    CONFc.set(set === 'confc' ? 1 : 0, t); CONFk.set(set === 'confk' ? 1 : 0, t);
    op(offDim, sid === 'routes' || sid === 'rule' ? 1 : 0);
    const talk = who => scTalk(S, t, who);
    let camK = 1, camX = 600, camY = 375;
    let conOn = 0, julOn = 0, patOn = 0, kavOn = 0;
    const show = new Set();

    /* ---------- arrival ---------- */
    if (sid === 'arrive') {
      conOn = 1; show.add('arr'); show.add('door');
      tr(con, 470, 410, 1.0);
      const startled = t >= tPat - 0.2 && t < tPat + 0.6;
      con.set({ t, talk: 0, mood: startled ? 'shock' : 'deadpan', look: t < tPat - 0.2 ? 0.7 : (t < tPat + 0.25 ? -0.9 : 0.8) });
      const dv = 1 - P(t, tPat - 0.05, 0.25, linear);
      op(arr, P(t, at('pat') + 0.1, 0.4, linear) * dv); arrA.set(P(t, mid('pat', 0.15), 0.5));
      ptPop(arrChip, 895, 380, P(t, mid('pat', 0.3), 0.45, pop) * dv); show.add('arrChip');
      const open = P(t, tPat - 0.2, 0.15, linear);
      leaf.setAttribute('transform', `translate(22 0) scale(${(1 - 0.85 * open).toFixed(3)} 1) translate(-22 0)`);
      const bp = win(t, tPat - 0.18, tPat + 0.5, 0.12); if (bp > 0) { show.add('bam'); tr(bam, 150, 250, 0.7 + 0.3 * P(t, tPat - 0.18, 0.2, pop), -10); op(bam, bp); }
      if (t >= tPat - 0.15) {
        patOn = 1;
        const z = P(t, tPat - 0.15, 0.55, easeOut), brake = P(t, tPat + 0.2, 0.6, linear);
        const px = lerp(-180, 880, z), tilt = -14 * Math.sin(Math.PI * brake) * (z > 0.5 ? 1 : 0);
        tr(pat, px, 420, 1.0, tilt);
        pat.set({ t, talk: 0, mood: z < 1 ? 'neutral' : 'neutral', look: 0.3 });
        show.add('speed'); tr(speed, px, 420); op(speed, 1 - P(t, tPat + 0.25, 0.3, linear));
        dust.forEach((d, i) => { const q = P(t, tPat + 0.15 + i * 0.08, 0.7, easeOut); attr(d, 'cx', px - 70 - 60 * q - i * 20); attr(d, 'cy', 520 - 20 * q); attr(d, 'r', 14 + 22 * q); op(d, 0.6 * Math.sin(Math.PI * q)); });
        show.add('dust');
      }
    }

    /* ---------- Pat: "I don't keep energy. I move it." ---------- */
    if (sid === 'hi') {
      patOn = 1;
      const push = P(t, at('hi'), end('hi') + 0.6 - at('hi'), linear);
      tr(pat, 420, 400, 1.35 * (1 + 0.04 * push));
      pat.set({ t, talk: talk('pat'), mood: t > mid('hi', 0.85) ? 'smug' : 'neutral', look: 0.4 });
      show.add('km');
      ptPop(cKeep, 870, 280, P(t, mid('hi', 0.3), 0.4, pop), 1, -2);
      ptPop(cMove, 870, 400, P(t, mid('hi', 0.6), 0.4, pop), 1, 2);
    }
    ltP.set(win(t, at('hi') + 0.1, at('hi') + 3.4, 0.3));

    /* ---------- confessional: people keep trying to file things with Pat ---------- */
    if (sid === 'thpat') {
      conOn = 1; julOn = 1; patOn = 1;
      const push = P(t, at('thpat'), end('thpat') + 0.8 - at('thpat'), linear);
      tr(con, 320, 410, 1.5 * (1 + 0.03 * push));
      con.set({ t, talk: talk('con'), mood: 'deadpan', look: t > mid('thpat', 0.3) && t < mid('thpat', 0.8) ? 0.6 : 0 });
      const ip = P(t, mid('thpat', 0.2), 0.4, pop);
      show.add('inset'); ptPop(inset, 0, 0, ip);
      const offer = P(t, mid('thpat', 0.35), 0.6, ease), refuse = P(t, mid('thpat', 0.75), 0.4, ease);
      tr(jul, 740, 420, 0.6 * Math.max(0.01, ip)); jul.set({ t, mood: refuse > 0.5 ? 'sad' : 'happy', look: 1, arms: 0.8 });
      tr(pat, 1010, 420 + 6 * Math.sin(t * 9) * refuse * AMP, 0.62 * Math.max(0.01, ip), refuse * -6); pat.set({ t, mood: offer > 0.5 ? 'annoyed' : 'neutral', look: -1 });
      show.add('fbox'); op(fbox, clamp(ip * 3)); tr(fbox, lerp(800, 885, offer) - 70 * refuse, 450 - 30 * Math.sin(Math.PI * offer));
      op(fboxL, P(t, mid('thpat', 0.4), 0.3, linear)); tr(fboxL, 880, 520);
    }

    /* ---------- the four routes ---------- */
    if (sid === 'routes') {
      patOn = 1; show.add('rp');
      let cur = 0; ROUTES.forEach((r, i) => { if (t >= at(r) - 0.1) cur = i; });
      if (t >= at('kick') - 0.1 && t < at('elec') - 0.1) cur = 0;
      tr(pat, 250, 470, 1.05);
      pat.set({ t, talk: talk('pat'), mood: 'neutral', look: 0.6, route: ROUTES[cur] });
      ptPop(RP, 0, 0, P(t, at('mech') - 0.06, 0.3, pop));
      slots.forEach(({ g, ring_ }, i) => {
        const on = i === cur, done = i < cur;
        const lit = on ? P(t, at(ROUTES[i]) - 0.1, 0.35, pop) : 0;
        op(g, on ? 0.4 + 0.6 * clamp(lit) : done ? 0.85 : 0.3);
        tr(g, 575 + i * 160, 180, on ? 1 + 0.15 * lit : 0.9);
      });
      RT.forEach((g, i) => op(g, i === cur ? P(t, at(ROUTES[i]) + 0.1, 0.3, linear) : 0));
      // demos
      const inKick = t >= at('kick') - 0.1 && t < at('elec') - 0.1;
      op(dMech, cur === 0 && !inKick ? 1 : 0); op(dKick, inKick ? 1 : 0);
      op(dElec, cur === 1 ? 1 : 0); op(dHeat, cur === 2 ? 1 : 0); op(dRad, cur === 3 ? 1 : 0);
      let miniOn = 0;
      if (cur === 0 && !inKick) mechParts.forEach((g, i) => ptPop(g, [600, 820, 1040][i], 480, P(t, mid('mech', [0.5, 0.62, 0.74][i]), 0.4, pop)));
      if (inKick) {
        const k0 = mid('kick', 0.12), sw = P(t, k0 - 0.35, 0.35, easeIn), fly = P(t, k0, 1.3, easeOut);
        leg.setAttribute('transform', `translate(560 400) rotate(${(lerp(40, -50, sw) + 20 * P(t, k0 + 0.2, 0.5)).toFixed(1)})`);
        tr(kBall, lerp(640, 1080, fly), 520 - 60 * Math.sin(Math.PI * fly * 0.9));
        op(kbSpeed, fly > 0 && fly < 0.98 ? 1 : 0);
        attr(kBarF, 'width', 252 * P(t, k0, 1.0, easeOut));
        op(kFlow, P(t, mid('kick', 0.55), 0.35, linear));
        if (fly > 0 && fly < 1) { miniOn = 1; tr(mini, lerp(640, 1080, fly) - 76, 500 - 60 * Math.sin(Math.PI * fly * 0.9), 0.24, 0); mini.set({ t, mood: 'happy', route: 'mech', look: 1 }); }
      }
      if (cur === 1) {
        pCable.upd(t * AMP, 70); pCable.set(P(t, mid('elec', 0.3), 0.3, linear));
        const ch = P(t, mid('elec', 0.35), 2.5, linear); attr(batt, 'height', 70 * ch); attr(batt, 'y', 34 - 70 * ch);
        op(eLab, P(t, mid('elec', 0.4), 0.3, linear));
      }
      if (cur === 2) {
        sizz.upd(t); op(sizz, P(t, mid('heat', 0.6), 0.4, linear));
        hArr.set(P(t, mid('heat', 0.4), 0.5)); op(hArr, P(t, mid('heat', 0.38), 0.1, linear));
        op(hHot, P(t, mid('heat', 0.35), 0.3, linear)); op(hCold, P(t, mid('heat', 0.55), 0.3, linear));
        tr(egg, 800, 548 + Math.sin(t * 20) * 1.5 * AMP);
      }
      if (cur === 3) {
        rSun.upd(t);
        rWaves.forEach((w, i) => w.set({ phase: t * 1.2 * AMP + i * 0.3 }));
        sArcs.forEach((a, i) => { const q = (t * 0.6 * AMP + i / 5) % 1; tr(a, 610 + q * 430, 590); a.style.opacity = (Math.sin(Math.PI * q) * P(t, mid('rad', 0.75), 0.3, linear)).toFixed(3); });
        op(spk, P(t, mid('rad', 0.75), 0.3, linear));
      }
      op(mini, miniOn);
    } else op(mini, 0);

    /* ---------- Jules offers a parcel ---------- */
    if (sid === 'leave') {
      julOn = 1; patOn = 1; show.add('parcel');
      tr(jul, 360, 440, 1.1); jul.set({ t, talk: talk('jules'), mood: 'happy', look: 1, arms: 0.4 });
      tr(pat, 870, 430, 1.15); pat.set({ t, talk: 0, mood: t > end('leave') - 0.2 ? 'annoyed' : 'neutral', look: -0.9 });
      const hold = P(t, at('leave') + 0.3, 0.6, ease);
      tr(parcel, lerp(430, 560, hold), 420 - 8 * Math.sin(t * 3) * AMP, 0.9); op(parcel, 1);
      ptPop(parcelL, lerp(430, 560, hold), 330, P(t, mid('leave', 0.55), 0.4, pop));
    }

    /* ---------- I'm. Not. A. Store. ---------- */
    if (sid === 'no') {
      patOn = 1; julOn = 1; show.add('parcel');
      const push = P(t, end('no'), at('rule') - end('no'), linear);
      camK = 1 + 0.1 * push; camX = 380; camY = 400;
      tr(pat, 380, 410, 1.6); pat.set({ t, talk: talk('pat'), mood: 'annoyed', look: 0.2 });
      const wd = [0.04, 0.3, 0.55, 0.72];
      NO.forEach((c, i) => { show.add('no' + i); ptPop(c, 860, 205 + i * 112, P(t, mid('no', wd[i]), 0.3, pop), 1, [-4, 3, -2, 4][i]); });
      const back = P(t, end('no') - 0.2, 1.2, ease);
      tr(jul, lerp(1150, 1270, back), 645, 0.7); jul.set({ t, mood: t > mid('no', 0.5) ? 'sad' : 'happy', look: -1, arms: 0.2 });
      tr(parcel, lerp(1080, 1260, back), 610, 0.6); op(parcel, 1);
    }

    /* ---------- the rule ---------- */
    if (sid === 'rule') {
      conOn = 1; show.add('rc');
      tr(con, 165, 480, 0.85); con.set({ t, talk: talk('con'), mood: 'deadpan', look: 0.8 });
      ptPop(RC, 0, 0, P(t, at('rule') - 0.06, 0.3, pop));
      op(rcL, P(t, mid('rule', 0.02), 0.3, linear)); op(rcR, P(t, mid('rule', 0.27), 0.3, linear));
      RW.forEach((c, i) => ptPop(c, c.cx, 535, P(t, mid('rule', 0.56 + i * 0.07), 0.35, pop)));
      op(rcV, P(t, mid('rule', 0.86), 0.3, linear));
    }

    /* ---------- the kettle ---------- */
    if (set === 'kitchen') {
      const boil = P(t, at('kettle') + 0.5, 4, linear);
      kettle.upd(t, boil); kSun.upd(t);
      kSweat.forEach((d, i) => { const f = (t * 0.8 + i * 0.33) % 1; tr(d, 150 + i * 24, 108 + f * 30); op(d, 1 - f); });
      show.add('hot'); ptPop(hot, 1010, 380, P(t, mid('kettle', 0.6), 0.4, pop), 1, -4);
      if (t < at('first') - 0.1) { show.add('care'); ptPop(careC, 860, 470, P(t, mid('kettle', 0.85), 0.4, pop), 1, 3); }
      // the chain builds
      const glowE = P(t, mid('first', 0.55), 0.6, linear);
      kettle.element.setAttribute('stroke', glowE > 0.5 ? '#FF3B2F' : '#8F9CAB');
      kettle.element.setAttribute('stroke-width', 6 + 4 * glowE);
      cable.upd(t * AMP, 80); cable.set(P(t, at('first'), 0.4, linear));
      kHeat.upd(t); op(kHeat, P(t, at('then') + 0.2, 0.4, linear));
      kBub.forEach((b, i) => { const f = (t * 0.9 + i / 4) % 1; attr(b, 'cx', -22 + (i % 2) * 10); attr(b, 'cy', -48 - f * 86); op(b, P(t, mid('then', 0.5), 0.4, linear) * (1 - f)); });
      // Pat rides the cable on "electrically"
      const ride = P(t, mid('first', 0.08), 1.6, ease);
      if (ride > 0 && ride < 1) { const [x, y, r] = cablePt(ride); tr(mini, x, y - 26, 0.24, 0); op(mini, 1); mini.set({ t, mood: 'happy', route: 'elec', look: r ? 0 : 1 }); }
    }
    if (t >= at('first') - 0.1 && (set === 'kitchen' || sid === 'so')) {
      show.add('chain'); op(CH, 1);
      ptPop(chB1, 190, 220, P(t, at('first'), 0.35, pop));
      chA1.set(P(t, mid('first', 0.15), 0.5)); op(chA1, P(t, mid('first', 0.12), 0.1, linear));
      ptPop(chI1, 391, 168, P(t, mid('first', 0.2), 0.35, pop), 0.42); op(chL1, P(t, mid('first', 0.2), 0.3, linear));
      ptPop(chB2, 600, 220, P(t, mid('first', 0.6), 0.35, pop));
      chA2.set(P(t, mid('then', 0.1), 0.5)); op(chA2, P(t, mid('then', 0.08), 0.1, linear));
      ptPop(chI2, 806, 168, P(t, mid('then', 0.12), 0.35, pop), 0.42); op(chL2, P(t, mid('then', 0.12), 0.3, linear));
      ptPop(chB3, 1010, 220, P(t, mid('then', 0.5), 0.35, pop));
      if (sid === 'so') {
        const pl1 = win(t, mid('so', 0.2), mid('so', 0.42), 0.12), pl2 = win(t, mid('so', 0.42), mid('so', 0.62), 0.12);
        tr(chA1, 0, 0, 1); chA1.style.opacity = (1 - 0.5 * pl2).toFixed(2); chA2.style.opacity = (1 - 0.5 * pl1).toFixed(2);
        tr(chL1, 0, 0); chL1.setAttribute('font-size', 28 + 6 * pl1); chL2.setAttribute('font-size', 28 + 6 * pl2);
      } else { chL1.setAttribute('font-size', 28); chL2.setAttribute('font-size', 28); chA1.style.opacity = ''; chA2.style.opacity = ''; }
    }

    /* ---------- Kavya counts the pathways ---------- */
    if (sid === 'so') {
      kavOn = 1;
      flat.upd(t, 1); flat.clock(13.6 + t / 600);
      tr(kav, 560, 560, 1.05);
      kav.set({ t, talk: talk('kavya'), mood: t < mid('so', 0.7) ? 'deadpan' : 'smug', look: 0.3 });
      op(armCount, 1);
      op(fingers[0], P(t, mid('so', 0.2), 0.15, linear)); op(fingers[1], P(t, mid('so', 0.42), 0.15, linear));
      show.add('two'); ptPop(two, 600, 388, P(t, mid('so', 0.68), 0.4, pop));
    } else op(armCount, 0);

    /* ---------- "Correct. Annoyingly." ---------- */
    if (sid === 'correct') {
      conOn = 1; show.add('ok');
      const push = P(t, end('correct'), at('thcorrect') - end('correct'), linear);
      camK = 1 + 0.08 * push; camX = 600; camY = 360;
      tr(con, 600, 410, 1.6);
      const away = t > mid('correct', 0.45);
      con.set({ t, talk: talk('con'), mood: away ? 'annoyed' : 'deadpan', look: away ? -0.95 : 0 });
      const tp = P(t, mid('correct', 0.08), 0.3, pop);
      op(okTick, clamp(tp * 3)); tr(okTick, 790, 290, Math.max(0.01, tp)); op(okTxt, clamp(tp * 3)); tr(okTxt, 790, 340);
    }

    /* ---------- Kavya's confessional ---------- */
    if (sid === 'thcorrect') {
      kavOn = 1; show.add('phone');
      tr(kav, 380, 470 - Math.abs(Math.sin(t * 5)) * 8 * AMP, 1.45);
      kav.set({ t, talk: talk('kavya'), mood: 'happy', look: 0.4 });
      op(armsUp, 1); armsUp.setAttribute('transform', `rotate(${(4 * Math.sin(t * 6) * AMP).toFixed(1)} 0 90)`);
      ptPop(phn, 900, 360, P(t, at('thcorrect') + 0.05, 0.4, pop), 1, 4);
      op(msg, P(t, mid('thcorrect', 0.35), 0.3, linear));
      tdots.forEach((d, i) => attr(d, 'cy', 46 - 6 * Math.max(0, Math.sin(t * 8 - i * 0.9))));
    } else op(armsUp, 0);

    // visibility
    const vis = (k, els) => { if (!show.has(k)) els.forEach(e => op(e, 0)); };
    vis('arr', [arr]); vis('arrChip', [arrChip]); vis('door', [door]); vis('bam', [bam]); vis('speed', [speed]); vis('dust', dust);
    vis('km', [cKeep, cMove]); vis('inset', [inset]); vis('fbox', [fbox, fboxL]); vis('rp', [RP]);
    vis('parcel', [parcel, parcelL]); if (sid !== 'leave') op(parcelL, 0);
    NO.forEach((c, i) => vis('no' + i, [c]));
    vis('rc', [RC]); vis('chain', [CH]); vis('two', [two]); vis('hot', [hot]); vis('care', [careC]);
    vis('ok', [okTick, okTxt]); vis('phone', [phn]);
    if (set !== 'kitchen' && sid !== 'routes') op(mini, 0);
    if (set === 'kitchen' && !(P(t, mid('first', 0.08), 1.6, ease) > 0 && P(t, mid('first', 0.08), 1.6, ease) < 1)) op(mini, 0);
    op(con, conOn); op(jul, julOn); op(pat, patOn); op(kav, kavOn);
    ptPush(CAM, camK, camX, camY);
  };
});
