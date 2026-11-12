/* Scene 3: The floor is the coolest (conduction).
   Beats: 3:00 PM, Kavya starfished on the floor tiles -> cheek on a tile, "I live here now" -> Cel's inset:
   tiles, table and sofa all read 34 °C -> "then why do the tiles feel colder?" -> CONDUCTION title
   -> skin particles jiggle into tile particles, Jules hops neighbour to neighbour -> hawker-centre gossip
   -> thick arrow into the tiles vs thin arrow into the wooden table -> the steel spoon: metals best
   -> Zip bursts out ("free electron") -> free electrons race through the lattice, vibrations crawl
   -> Cel's confessional, Zip on seven coffees -> "because they're shiny?" -> shine ✗, free electrons ✓
   -> the insulator shelf (wood, plastic, wool, air) -> the cupboard opens: Woolly. */
scene('floor', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;

  /* ---------- local helpers (prefixed floor) ---------- */
  const floorCam = (el, cx, cy, k, px, py) => el.setAttribute('transform', `translate(${(px ?? cx).toFixed(1)} ${(py ?? cy).toFixed(1)}) scale(${k.toFixed(4)}) translate(${(-cx).toFixed(1)} ${(-cy).toFixed(1)})`);
  // the same, but the camera never shows past the edges of a full-stage set
  const floorCamIn = (el, cx, cy, k) => { const hw = 600 / k, hh = 375 / k; floorCam(el, clamp(cx, hw, 1200 - hw), clamp(cy, hh, 750 - hh), k, 600, 375); };
  const floorPop = (el, t, t0, x, y, s, r, mul) => { const p = P(t, t0, 0.45, pop); op(el, clamp(p * 2.5) * (mul === undefined ? 1 : mul)); tr(el, x, y, Math.max(0.01, (s || 1) * (0.6 + 0.4 * p)), r); return p; };
  const floorMix = (a, b, p) => { const h = s => [1, 3, 5].map(i => parseInt(s.slice(i, i + 2), 16)); const A = h(a), B = h(b); return '#' + A.map((v, i) => Math.round(lerp(v, B[i], clamp(p))).toString(16).padStart(2, '0')).join(''); };
  // a little standing thermometer with its reading beside it
  function floorTherm(parent) {
    const g = G(parent);
    E('rect', { x: -9, y: -84, width: 18, height: 84, rx: 9, fill: '#EAF4FA', stroke: SC_INK, 'stroke-width': 3 }, g);
    E('rect', { x: -4, y: -56, width: 8, height: 56, rx: 4, fill: BK_RED }, g);
    E('circle', { cx: 0, cy: 4, r: 14, fill: BK_RED, stroke: SC_INK, 'stroke-width': 3 }, g);
    const c = bkChip(g, '34 °C', { size: 30, color: '#FF7276' }); tr(c, 74, -44);
    return g;
  }
  // a heart for "I live here now"
  const floorHeartD = 'M0,12 C-30,-6 -18,-30 0,-14 C18,-30 30,-6 0,12 Z';

  /* layers */
  const Lbg = G(root), Lfg = G(root), Lhud = G(root);
  /* one of each recurring character, seated (re-parented) into whichever shot is on screen */
  const castHold = G(root); op(castHold, 0);
  const ZIP = cast(castHold, 'zip', { mood: 'happy' }), JULES = cast(castHold, 'jules', { mood: 'happy' }), CEL = cast(castHold, 'cel', { mood: 'deadpan' });
  const floorSeat = (ch, seat) => { if (ch.parentNode !== seat) seat.appendChild(ch); };

  /* ---------- cut list: [start, shot] ---------- */
  const CUTS = [
    [-1, 'room'],
    [at('floor') - 0.08, 'tile'],
    [at('same') - 0.08, 'room'],
    [at('why') - 0.08, 'tile'],
    [at('cond') - 0.08, 'cond'],
    [at('pass') - 0.08, 'pass'],
    [at('gossip') - 0.08, 'hawk'],
    [at('better') - 0.08, 'room'],
    [at('metals') - 0.08, 'tile'],
    [at('free') - 0.08, 'spoon'],
    [at('thzip') - 0.08, 'conf'],
    [at('shiny') - 0.08, 'tile'],
    [at('insul') - 0.08, 'shelf'],
    [at('woolly') - 0.08, 'cup'],
  ];
  const shotAt = t => { let c = CUTS[0][1]; for (const k of CUTS) if (t >= k[0]) c = k[1]; return c; };

  /* =====================================================================
     ROOM: the living room, Kavya starfished on the tiles
     ===================================================================== */
  const gRoom = G(Lbg), roomW = G(gRoom);
  const liv = bkLiving(roomW);
  const kLie = G(roomW), kBody = scKavyaBody(kLie);
  const kSweat = scSweat(kLie, [[-14, -206], [14, -214]]);
  // 'same': thermometers on the table, the sofa and the tiles
  const thTable = floorTherm(roomW), thSofa = floorTherm(roomW), thTile = floorTherm(roomW);
  // 'better': energy leaving Kavya
  const flowG = G(roomW);
  const arTile = arrow(flowG, 300, 640, 190, 738, { color: C.heat, width: 30, head: 64 });
  const arWood = arrow(flowG, 478, 526, 350, 526, { color: C.heat, width: 7, head: 24 });
  const sparksT = [], sparksW = [];
  for (let i = 0; i < 6; i++) sparksT.push(E('circle', { r: 8, fill: '#FFE45C' }, flowG));
  for (let i = 0; i < 2; i++) sparksW.push(E('circle', { r: 5, fill: '#FFE45C' }, flowG));
  // room overlays (screen space)
  const roomOv = G(gRoom);
  const clock = bkClock(roomOv);
  const coolChip = bkChip(roomOv, 'the coolest place in the flat', { size: 32, color: C.water });
  const coolAr = arrow(roomOv, 760, 420, 640, 500, { color: C.water, width: 7 });
  const sameChip = chip(roomOv, 'SAME TEMPERATURE', { size: 40, fill: 'rgba(10,27,39,0.9)', stroke: '#FF7276', sw: 3, color: '#FF7276' });
  // Cel's inset (kitchen wall)
  const celIn = G(roomOv);
  E('rect', { x: -150, y: -130, width: 300, height: 260, rx: 16, fill: linGrad('#EAF0E4', '#D7E2CF', true), stroke: '#FFFFFF', 'stroke-width': 6 }, celIn);
  E('rect', { x: -150, y: 70, width: 300, height: 60, fill: '#F7FAFB' }, celIn);
  T(celIn, -134, -100, 'KITCHEN', { size: 22, weight: 800, fill: '#2E574D' });
  const celInW = G(celIn), celSmall = CEL;
  const tileLbl = bkChip(roomOv, 'tile: better conductor', { size: 30, color: C.heat });
  const woodLbl = bkChip(roomOv, 'wood: poor conductor', { size: 30, color: '#E0B080' });
  const fastT = chip(roomOv, 'FAST', { size: 30, fill: C.heat, color: '#FFFFFF', stroke: '#FFFFFF', sw: 2 });
  const slowT = chip(roomOv, 'slow', { size: 28, fill: '#7E4A22', color: '#FFFFFF', stroke: '#FFFFFF', sw: 2 });
  const chill = G(roomOv);
  E('rect', { x: -250, y: -70, width: 500, height: 140, rx: 20, fill: 'rgba(10,27,39,0.92)', stroke: C.heat, 'stroke-width': 3 }, chill);
  T(chill, 0, -14, 'that "chill" =', { size: 32, weight: 700, anchor: 'middle', fill: C.water });
  T(chill, 0, 36, 'your own **thermal energy** leaving', { size: 30, weight: 600, anchor: 'middle', fill: '#FFFFFF', boldFill: C.heat });

  /* =====================================================================
     TILE: close-up, cheek on the tiles, the spoon by her head
     ===================================================================== */
  const gTile = G(Lbg), tileW = G(gTile);
  E('rect', { x: -400, y: -400, width: 2000, height: 640, fill: linGrad('#F4E6C8', '#E6CFA2', true) }, tileW);
  E('rect', { x: -400, y: 222, width: 2000, height: 20, fill: '#C9A878' }, tileW);
  E('rect', { x: -400, y: 242, width: 2000, height: 900, fill: linGrad('#E4DED3', '#CFC7B9', true) }, tileW);
  { let d = ''; for (let xb = -900; xb <= 2300; xb += 300) d += `M${(600 + (xb - 600) * 0.4).toFixed(0)},242 L${xb},1100 `; [300, 400, 560, 800].forEach(y => d += `M-400,${y} L1600,${y} `); E('path', { d, stroke: '#B3AA9A', 'stroke-width': 5, fill: 'none' }, tileW); }
  E('rect', { x: 120, y: 60, width: 26, height: 184, fill: '#7E4A22', stroke: SC_INK, 'stroke-width': 3 }, tileW);     // table leg in the back
  E('rect', { x: 60, y: 30, width: 400, height: 34, rx: 6, fill: '#A86A38', stroke: SC_INK, 'stroke-width': 4 }, tileW);
  const kav = cast(tileW, 'kavya', { mood: 'happy' });
  const KX = 500, KY = 500, KS = 1.6;
  // her arm, pointing at the spoon ('shiny')
  const armG = G(tileW);
  E('path', { d: 'M350,384 L440,330', fill: 'none', stroke: '#2E7DD8', 'stroke-width': 36, 'stroke-linecap': 'round' }, armG);
  E('path', { d: 'M440,330 L600,306', fill: 'none', stroke: '#B9784E', 'stroke-width': 24, 'stroke-linecap': 'round' }, armG);
  E('circle', { cx: 612, cy: 308, r: 19, fill: '#B9784E', stroke: SC_INK, 'stroke-width': 3 }, armG);
  E('path', { d: 'M622,318 L646,360', stroke: '#B9784E', 'stroke-width': 11, 'stroke-linecap': 'round' }, armG);
  const spoon = bkSpoon(tileW, 1.25); tr(spoon, 800, 620, 1.25);
  const spoonStar = spark(tileW, 20, { seed: 2 });
  const sign = G(tileW);        // her new address
  E('rect', { x: -4, y: -100, width: 8, height: 100, fill: '#8C6239' }, sign);
  E('rect', { x: -86, y: -150, width: 172, height: 70, rx: 6, fill: '#FFF8C4', stroke: '#D9C36A', 'stroke-width': 3 }, sign);
  T(sign, 0, -122, 'KAVYA LIVES', { size: 26, weight: 800, anchor: 'middle', fill: '#C62828' });
  T(sign, 0, -94, 'HERE NOW', { size: 26, weight: 800, anchor: 'middle', fill: '#C62828' });
  const hearts = [0, 1, 2].map(() => E('path', { d: floorHeartD, fill: '#FF5FA2', stroke: SC_INK, 'stroke-width': 2 }, tileW));
  const zipTW = G(tileW), zipT = ZIP;
  const skid = G(tileW);
  E('path', { d: 'M-150,40 L-20,40 M-130,56 L-30,56', stroke: '#8FA3B5', 'stroke-width': 6, 'stroke-linecap': 'round' }, skid);
  [-30, -60, -90].forEach((x, i) => E('circle', { cx: x, cy: 34 - i * 6, r: 14 - i * 3, fill: '#FFFFFF', opacity: 0.7 }, skid));
  const skrrt = T(tileW, 0, 0, 'skrrrt!', { size: 30, weight: 800, anchor: 'middle', fill: '#1F6FD1' });
  const zipStars = [0, 1, 2].map(i => spark(tileW, 16, { seed: i + 4 }));
  // tile overlays (screen space)
  const tileOv = G(gTile);
  const coldQ = bkChip(tileOv, 'tiles = cold?', { size: 34, color: C.water });
  const qMark = T(tileOv, 0, 0, '?', { size: 110, weight: 800, anchor: 'middle', fill: '#FFE45C' });
  qMark.setAttribute('stroke', SC_INK); qMark.setAttribute('stroke-width', 6); qMark.setAttribute('paint-order', 'stroke');
  const whyA = G(tileOv);
  E('rect', { x: -230, y: -110, width: 460, height: 220, rx: 18, fill: 'rgba(10,27,39,0.92)', stroke: C.line, 'stroke-width': 2 }, whyA);
  T(whyA, -200, -50, 'tiles: 34 °C → feel **cold**', { size: 30, weight: 600, fill: '#FFFFFF', boldFill: C.water });
  T(whyA, -200, 6, 'table: 34 °C → feels **warm**', { size: 30, weight: 600, fill: '#FFFFFF', boldFill: '#E0B080' });
  T(whyA, 0, 74, 'WHY?', { size: 40, weight: 800, anchor: 'middle', fill: '#FFE45C' });
  const metChip = G(tileOv);
  chip(metChip, 'METALS: the best conductors', { size: 40, fill: 'rgba(10,27,39,0.92)', stroke: '#C9D3DC', sw: 3, color: '#E9EFF2' });
  const ltZip = scLowerThird(Lhud, 'ZIP', 'Free electron. Lives in a spoon.');
  const feChip = chip(tileOv, 'free electron', { size: 40, fill: '#1F6FD1', stroke: '#FFFFFF', sw: 3, color: '#FFFFFF' });
  const shinyQ = bkChip(tileOv, 'conduct because they\'re shiny?', { size: 32, color: '#E9EFF2' });
  const vShiny = G(tileOv), vFree = G(tileOv);
  chip(vShiny, 'shiny', { size: 38, fill: 'rgba(10,27,39,0.92)', stroke: C.line, sw: 2, color: '#E9EFF2' });
  const xShiny = cross(vShiny, 22); tr(xShiny, -100, 0);
  chip(vFree, 'free electrons', { size: 38, fill: 'rgba(10,27,39,0.92)', stroke: C.good, sw: 3, color: '#9FE3FF' });
  const tFree = tick(vFree, 24); tr(tFree, -170, 2);

  /* =====================================================================
     COND: title card
     ===================================================================== */
  const gCond = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#1A0E08', '#3A1C0A', true) }, gCond);
  const condT = T(gCond, 600, 330, 'CONDUCTION', { size: 108, weight: 800, anchor: 'middle', fill: C.heat });
  condT.setAttribute('stroke', '#5A2B07'); condT.setAttribute('stroke-width', 10); condT.setAttribute('paint-order', 'stroke');
  const condSub = T(gCond, 600, 410, 'the main way thermal energy travels through **SOLIDS**', { size: 34, weight: 600, anchor: 'middle', fill: '#FFFFFF', boldFill: '#FFE45C' });
  const condRow = [];
  for (let i = 0; i < 8; i++) condRow.push(E('circle', { r: 28, fill: '#A9B5C0', stroke: SC_INK, 'stroke-width': 3 }, gCond));
  const condAr = arrow(gCond, 360, 600, 840, 600, { color: C.heat, width: 10 });
  T(gCond, 330, 610, 'hot', { size: 30, weight: 700, anchor: 'end', fill: C.heat });
  T(gCond, 880, 610, 'cold', { size: 30, weight: 700, fill: C.water });

  /* =====================================================================
     PASS: skin particles against tile particles (showpiece)
     ===================================================================== */
  const gPass = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#141A22', '#24303C', true) }, gPass);
  const PX0 = 236, PY0 = 330, PSP = 62, PCOL = 13, PROW = 4, SKIN = 4;
  E('rect', { x: PX0 - 40, y: PY0 - 40, width: SKIN * PSP + 4, height: PROW * PSP + 18, rx: 18, fill: '#5A2E2A', opacity: 0.5 }, gPass);
  E('rect', { x: PX0 - 40 + SKIN * PSP + 8, y: PY0 - 40, width: (PCOL - SKIN) * PSP + 10, height: PROW * PSP + 18, rx: 18, fill: '#2E3A44', opacity: 0.7 }, gPass);
  E('line', { x1: PX0 - 31 + SKIN * PSP + 6, y1: PY0 - 52, x2: PX0 - 31 + SKIN * PSP + 6, y2: PY0 + PROW * PSP - 8, stroke: '#FFFFFF', 'stroke-width': 3, 'stroke-dasharray': '10 8', opacity: 0.6 }, gPass);
  const pts = [];
  for (let r = 0; r < PROW; r++) for (let c = 0; c < PCOL; c++) {
    const skin = c < SKIN;
    pts.push({ el: E('circle', { r: 27, fill: skin ? '#F49A9A' : '#A9B5C0', stroke: SC_INK, 'stroke-width': 3 }, gPass), r, c, skin, x: PX0 + c * PSP, y: PY0 + r * PSP, ph: (r * 7 + c * 3) % 11 });
  }
  const skinLbl = bkChip(gPass, 'skin (warm)', { size: 30, color: '#F49A9A' }); tr(skinLbl, PX0 + 1.5 * PSP, PY0 + PROW * PSP + 30);
  const tileLbl2 = bkChip(gPass, 'tile (cooler)', { size: 30, color: '#C9D3DC' }); tr(tileLbl2, PX0 + 8 * PSP, PY0 + PROW * PSP + 30);
  const passAr = arrow(gPass, 250, 160, 1000, 160, { color: C.heat, width: 12 });
  const passArT = T(gPass, 625, 136, 'thermal energy: hot → cold', { size: 30, weight: 700, anchor: 'middle', fill: C.heat });
  const julesPW = G(gPass), julesP = JULES;
  const nbChip = chip(gPass, 'particle to particle: NEIGHBOUR TO NEIGHBOUR', { size: 32, fill: 'rgba(10,27,39,0.92)', stroke: C.heat, sw: 3, color: '#FFFFFF' });
  const stayChip = bkChip(gPass, 'the particles stay in place: they just vibrate', { size: 28, color: C.muted });

  /* =====================================================================
     HAWK: hawker-centre gossip (seen from above)
     ===================================================================== */
  const gHawk = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#D8D0BF' }, gHawk);
  { let d = ''; for (let x = 0; x <= 1200; x += 80) d += `M${x},0 L${x},750 `; for (let y = 0; y <= 750; y += 80) d += `M0,${y} L1200,${y} `; E('path', { d, stroke: '#C4BAA6', 'stroke-width': 2 }, gHawk); }
  const STALLS = ['CHICKEN RICE', 'LAKSA', 'SATAY', 'DRINKS'];
  const stallG = [];
  STALLS.forEach((s, i) => {
    const g = G(gHawk); tr(g, 210 + i * 250, 150);
    E('rect', { x: -112, y: -42, width: 224, height: 84, rx: 10, fill: ['#E8424F', '#FFC247', '#3FA463', '#4CC9F0'][i], stroke: SC_INK, 'stroke-width': 4 }, g);
    T(g, 0, 10, s, { size: 26, weight: 800, anchor: 'middle', fill: i === 1 ? '#3A2A00' : '#FFFFFF' });
    const ex = T(g, 96, -40, '!!', { size: 40, weight: 800, anchor: 'middle', fill: '#C62828' });
    ex.setAttribute('stroke', '#FFFFFF'); ex.setAttribute('stroke-width', 6); ex.setAttribute('paint-order', 'stroke');
    stallG.push({ g, ex });
  });
  const TAB = [];
  const HAIR = ['#1E1410', '#3A2A1E', '#5A3A1E', '#C9C3B8', '#1E1410'];
  for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) {
    const cc = r % 2 ? 3 - c : c;            // snake order
    const x = 170 + cc * 210, y = 282 + r * 138, g = G(gHawk);
    tr(g, x, y);
    E('circle', { r: 44, fill: '#F2F7FA', stroke: '#8FA3B5', 'stroke-width': 4 }, g);
    E('path', { d: [[-66, 0], [66, 0], [0, -64], [0, 64]].map(([hx, hy]) => `M${hx - 19},${hy} a19,19 0 1,0 38,0 a19,19 0 1,0 -38,0 Z`).join(' '), fill: HAIR[(r * 4 + c) % 5], stroke: SC_INK, 'stroke-width': 2 }, g);
    const ex = T(g, 34, -40, '!', { size: 44, weight: 800, anchor: 'middle', fill: '#C62828' });
    ex.setAttribute('stroke', '#FFFFFF'); ex.setAttribute('stroke-width', 6); ex.setAttribute('paint-order', 'stroke');
    TAB.push({ x, y, ex, i: r * 4 + c });
  }
  const bubble = G(gHawk);
  E('path', { d: 'M-62,-34 Q-62,-60 -36,-60 L36,-60 Q62,-60 62,-34 L62,-6 Q62,20 36,20 L-6,20 L-26,40 L-22,20 L-36,20 Q-62,20 -62,-6 Z', fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, bubble);
  T(bubble, 0, -9, 'psst', { size: 32, weight: 800, anchor: 'middle', fill: '#1E1410' });
  const julesHW = G(gHawk), julesH = JULES;
  const hawkC1 = bkChip(gHawk, 'nobody leaves their table', { size: 30, color: '#FFFFFF' });
  const hawkC2 = bkChip(gHawk, 'the news still reaches every stall', { size: 30, color: C.heat });

  /* =====================================================================
     SPOON: inside the metal: free electrons vs vibrations
     ===================================================================== */
  const gSpoon = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#3A4652', '#1C2430', true) }, gSpoon);
  E('rect', { x: 0, y: 200, width: 260, height: 400, fill: glow('#FF6A2A'), opacity: 0.6 }, gSpoon);
  const SX0 = 190, SY0 = 270, SSP = 76, SCOL = 11, SROW = 4;
  const ions = [];
  for (let r = 0; r < SROW; r++) for (let c = 0; c < SCOL; c++) ions.push({ el: E('circle', { r: 22, fill: '#9AA6B2', stroke: '#4A5866', 'stroke-width': 3 }, gSpoon), r, c, x: SX0 + c * SSP, y: SY0 + r * SSP, ph: (r * 5 + c * 7) % 13 });
  const ELN = [];
  for (let i = 0; i < 9; i++) {
    const e = E('circle', { r: 10, fill: '#7FD4FF', stroke: '#FF8A3D', 'stroke-width': 5 }, gSpoon);   // orange rim: the energy it carries
    ELN.push({ e, lane: i % 3, ph: (i * 0.37) % 1, wob: i * 1.3 });
  }
  const spHot = chip(gSpoon, 'HOT end', { size: 30, fill: '#C25516', color: '#FFFFFF' }); tr(spHot, 150, 650);
  const spCold = chip(gSpoon, 'cool end', { size: 30, fill: '#1D84A6', color: '#FFFFFF' }); tr(spCold, 1060, 650);
  const spAr = arrow(gSpoon, 250, 190, 980, 190, { color: C.heat, width: 10 });
  T(gSpoon, 615, 166, 'thermal energy', { size: 30, weight: 700, anchor: 'middle', fill: C.heat });
  const eFast = chip(gSpoon, 'free electrons: FAST', { size: 32, fill: '#1F6FD1', stroke: '#9FE3FF', sw: 3, color: '#FFFFFF' });
  const vSlow = chip(gSpoon, 'vibrations: slow', { size: 30, fill: '#4A5866', stroke: '#C9D3DC', sw: 2, color: '#E9EFF2' });
  const zipSW = G(gSpoon), zipS = ZIP;

  /* =====================================================================
     CONF: Cel's confessional, Zip on seven coffees
     ===================================================================== */
  const conf = bkConfessional(Lbg, 'cel');
  const celCW = G(conf), celC = CEL;
  const zIn = G(conf);
  E('rect', { x: -210, y: -150, width: 420, height: 300, rx: 16, fill: linGrad('#0E1A3A', '#1E3A7A', true), stroke: '#FFFFFF', 'stroke-width': 6 }, zIn);
  T(zIn, -192, -116, 'ZIP-CAM', { size: 22, weight: 800, fill: '#9FE3FF' });
  const zipCW = G(zIn), zipC = ZIP;
  const cups = [];
  for (let i = 0; i < 7; i++) {
    const g = G(zIn);
    E('path', { d: 'M-14,-22 L14,-22 L10,20 L-10,20 Z', fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
    E('rect', { x: -12, y: -6, width: 24, height: 12, fill: '#8C5A2E' }, g);
    cups.push(g);
  }
  const cupN = chip(zIn, '× 7', { size: 34, fill: '#C25516', color: '#FFFFFF' });
  const noCoffee = bkChip(conf, '(electrons don\'t drink coffee)', { size: 28, color: C.muted });

  /* =====================================================================
     SHELF: the insulators
     ===================================================================== */
  const gShelf = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#2E1A12', '#4A2C1C', true) }, gShelf);
  E('rect', { x: 60, y: 500, width: 1080, height: 30, rx: 6, fill: '#B07A45', stroke: SC_INK, 'stroke-width': 4 }, gShelf);
  E('rect', { x: 60, y: 530, width: 1080, height: 12, fill: '#7E4A22' }, gShelf);
  const head = G(gShelf);
  T(head, 0, 0, 'INSULATORS', { size: 72, weight: 800, anchor: 'middle', fill: C.water });
  const headSub = T(gShelf, 600, 268, 'slow thermal energy **down**', { size: 36, weight: 600, anchor: 'middle', fill: '#FFFFFF', boldFill: C.water });
  const ITEMS = [];
  { // wooden spoon
    const g = G(gShelf);
    E('path', { d: 'M-12,-10 L-8,-160 Q0,-168 8,-160 L12,-10 Z', fill: '#C98F5A', stroke: SC_INK, 'stroke-width': 4 }, g);
    E('ellipse', { cx: 0, cy: -190, rx: 30, ry: 42, fill: '#D9A06A', stroke: SC_INK, 'stroke-width': 4 }, g);
    ITEMS.push({ g, x: 230, lbl: 'wood' });
  }
  { // plastic plate
    const g = G(gShelf);
    E('ellipse', { cx: 0, cy: -80, rx: 96, ry: 74, fill: '#4CC9F0', stroke: SC_INK, 'stroke-width': 4 }, g);
    E('ellipse', { cx: 0, cy: -80, rx: 62, ry: 46, fill: '#7FDDF7', stroke: '#1D84A6', 'stroke-width': 3 }, g);
    ITEMS.push({ g, x: 480, lbl: 'plastic' });
  }
  { // ball of wool
    const g = G(gShelf);
    E('circle', { cx: 0, cy: -76, r: 72, fill: '#C4553D', stroke: SC_INK, 'stroke-width': 4 }, g);
    E('path', { d: 'M-60,-110 Q0,-60 60,-120 M-70,-70 Q0,-20 66,-80 M-50,-30 Q10,-70 40,-140 M-20,-146 Q40,-80 20,-8', fill: 'none', stroke: '#8C3524', 'stroke-width': 4 }, g);
    E('path', { d: 'M60,-40 Q110,-10 90,0', fill: 'none', stroke: '#C4553D', 'stroke-width': 6 }, g);
    ITEMS.push({ g, x: 730, lbl: 'wool' });
  }
  { // air: an empty frame with a few lazy particles
    const g = G(gShelf);
    E('rect', { x: -84, y: -170, width: 168, height: 166, rx: 6, fill: 'rgba(200,230,250,0.08)', stroke: '#E0B080', 'stroke-width': 8 }, g);
    const dots = [[-40, -120], [30, -136], [44, -60], [-30, -44], [6, -92]].map(([x, y]) => E('circle', { cx: x, cy: y, r: 8, fill: '#9FD8FF' }, g));
    ITEMS.push({ g, x: 980, lbl: 'air', dots });
  }
  ITEMS.forEach(it => { it.c = chip(gShelf, it.lbl, { size: 34, fill: '#0E1A24', stroke: C.water, sw: 2, color: '#FFFFFF' }); });

  /* =====================================================================
     CUP: the dark cupboard, Woolly
     ===================================================================== */
  const gCup = G(Lbg), cupW = G(gCup);
  E('rect', { x: -200, y: -400, width: 1600, height: 1600, fill: '#E6CFA2' }, cupW);
  E('rect', { x: 230, y: 120, width: 740, height: 520, rx: 10, fill: '#7E4A22', stroke: SC_INK, 'stroke-width': 6 }, cupW);   // the cupboard
  E('rect', { x: 256, y: 146, width: 688, height: 468, fill: '#1A100A' }, cupW);
  E('rect', { x: 256, y: 470, width: 688, height: 22, fill: '#5A3A1E' }, cupW);    // shelf
  E('path', { d: 'M256,146 L340,146 M256,146 L256,230 M256,146 L330,220 M256,186 Q290,180 296,146 M256,214 Q318,206 322,146', fill: 'none', stroke: '#C9C3B8', 'stroke-width': 2, opacity: 0.8 }, cupW);   // cobweb
  const cal = G(cupW); tr(cal, 860, 250, 1, 6);
  E('rect', { x: -50, y: -50, width: 100, height: 100, rx: 6, fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 3 }, cal);
  E('rect', { x: -50, y: -50, width: 100, height: 30, rx: 6, fill: '#E8424F' }, cal);
  T(cal, 0, -26, 'JUNE', { size: 22, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  T(cal, 0, 30, '34 °C', { size: 24, weight: 800, anchor: 'middle', fill: '#E8424F' });
  const woolly = cast(cupW, 'woolly', { mood: 'sad' });
  const dust = [0, 1, 2, 3].map(() => E('circle', { r: 4, fill: '#E6D6B8', opacity: 0.6 }, cupW));
  const doorL = G(cupW), doorR = G(cupW);
  [[doorL, 256], [doorR, 600]].forEach(([d, x]) => {
    E('rect', { x: 0, y: 0, width: 344, height: 468, fill: '#A86A38', stroke: SC_INK, 'stroke-width': 5 }, d);
    E('rect', { x: 30, y: 30, width: 284, height: 408, rx: 8, fill: 'none', stroke: '#7E4A22', 'stroke-width': 5 }, d);
    d.x0 = x;
  });
  E('circle', { cx: 314, cy: 240, r: 10, fill: '#E0B080', stroke: SC_INK, 'stroke-width': 3 }, doorL);
  E('circle', { cx: 30, cy: 240, r: 10, fill: '#E0B080', stroke: SC_INK, 'stroke-width': 3 }, doorR);
  const creak = T(gCup, 960, 706, '*creeeak*', { size: 34, weight: 700, anchor: 'middle', fill: '#5A3A1E' });
  creak.setAttribute('font-style', 'italic');
  const ltWoolly = scLowerThird(Lhud, 'WOOLLY', 'Wool jumper. Insulator. Unwanted.');

  const SHOTS = { room: gRoom, tile: gTile, cond: gCond, pass: gPass, hawk: gHawk, spoon: gSpoon, conf, shelf: gShelf, cup: gCup };

  return t => {
    const shot = shotAt(t);
    for (const k in SHOTS) op(SHOTS[k], k === shot ? 1 : 0);
    if (shot === 'room') floorSeat(CEL, celInW);
    if (shot === 'conf') { floorSeat(CEL, celCW); floorSeat(ZIP, zipCW); }
    if (shot === 'tile') floorSeat(ZIP, zipTW);
    if (shot === 'spoon') floorSeat(ZIP, zipSW);
    if (shot === 'pass') floorSeat(JULES, julesPW);
    if (shot === 'hawk') floorSeat(JULES, julesHW);
    ltZip.set(shot === 'tile' ? win(t, at('zip') + 0.25, at('zip') + 3.4, 0.3) : 0);
    ltWoolly.set(shot === 'cup' ? win(t, at('woolly') + 0.3, at('woolly') + 3.6, 0.3) : 0);

    /* ---------------- ROOM ---------------- */
    if (shot === 'room') {
      liv.upd(t, { fan: 0.35 * AMP, ac: 0 });
      const isBetter = t >= at('better') - 0.1, isSame = !isBetter && t >= at('same') - 0.1;
      // Kavya, starfished; one hand flung onto the coffee table
      const breathe = Math.sin(t * 1.4) * 3 * AMP;
      kBody.pose({ lean: 0, armL: [128 + breathe, 6], armR: [-112, 8], legL: [24, -4], legR: [-26, -4] });
      tr(kLie, 262, 610, 1.3, 90);
      kSweat.set(1, t);
      if (!isSame && !isBetter) {   // three
        const push = P(t, at('three'), end('three') + 0.4 - at('three'), linear);
        floorCamIn(roomW, 400, 520, 1.4 + 0.1 * push);
        clock.set('3:00'); floorPop(clock, t, at('three') + 0.2, 1000, 200, 1);
        floorPop(coolChip, t, mid('three', 0.55), 860, 380, 1);
        op(coolAr, P(t, mid('three', 0.62), 0.3, linear)); coolAr.set(P(t, mid('three', 0.62), 0.4));
      } else { op(clock, 0); op(coolChip, 0); op(coolAr, 0); }
      if (isSame) {
        floorCam(roomW, 600, 400, 1, 600, 375);
        const tt = [[thTable, 330, 518, 0.15], [thSofa, 700, 486, 0.3], [thTile, 680, 712, 0.45]];
        tt.forEach(([g, x, y, f]) => floorPop(g, t, mid('same', f), x, y, 1));
        floorPop(sameChip, t, mid('same', 0.55), 560, 300, 1);
        const ip = P(t, at('same') + 0.05, 0.3, pop);
        op(celIn, clamp(ip * 2.5)); tr(celIn, 1010, 290, Math.max(0.01, 0.8 + 0.2 * ip));
        tr(celSmall, 0, -10, 0.82); celSmall.set({ t, talk: scTalk(S, t, 'cel'), mood: 'deadpan', look: -0.6, temp: 34 });
      } else { [thTable, thSofa, thTile, sameChip, celIn].forEach(e => op(e, 0)); }
      if (isBetter) {
        const push = P(t, at('better'), 1.2, ease);
        floorCamIn(roomW, 420, 520, lerp(1.3, 1.42, push));
        op(flowG, 1);
        const pT = P(t, mid('better', 0.12), 0.6), pW = P(t, mid('better', 0.2), 0.6);
        arTile.set(pT); arWood.set(pW); op(arWood, pW > 0 ? 1 : 0); op(arTile, pT > 0 ? 1 : 0);
        sparksT.forEach((s, i) => { const u = ((t - at('better')) * 1.6 * AMP + i / 6) % 1; attr(s, 'cx', lerp(296, 200, u)); attr(s, 'cy', lerp(642, 728, u)); op(s, pT > 0.9 ? Math.sin(u * Math.PI) : 0); });
        sparksW.forEach((s, i) => { const u = ((t - at('better')) * 0.22 * AMP + i / 2) % 1; attr(s, 'cx', lerp(474, 362, u)); attr(s, 'cy', 526); op(s, pW > 0.9 ? Math.sin(u * Math.PI) : 0); });
        floorPop(tileLbl, t, mid('better', 0.25), 560, 690, 1);
        floorPop(woodLbl, t, mid('better', 0.32), 430, 320, 1);
        op(fastT, P(t, mid('better', 0.3), 0.3, linear)); tr(fastT, 200, 590);
        op(slowT, P(t, mid('better', 0.36), 0.3, linear)); tr(slowT, 690, 380);
        floorPop(chill, t, mid('better', 0.62), 880, 220, 1);
      } else { [flowG, tileLbl, woodLbl, fastT, slowT, chill].forEach(e => op(e, 0)); }
    }

    /* ---------------- TILE ---------------- */
    if (shot === 'tile') {
      const isWhy = t < at('cond'), isFloor = t < at('same');
      // camera: wide on her face; from 'metals' it pans to the spoon
      if (t < at('metals') - 0.1) floorCam(tileW, 600, 400, 1, 600, 375);
      else { const pp = P(t, at('metals') + 0.2, 1.6, ease); floorCam(tileW, lerp(600, 760, pp), lerp(400, 520, pp), lerp(1, 1.2, pp), 600, lerp(375, 420, pp)); }
      let mood = 'happy', look = 0;
      if (isFloor) { mood = t > mid('floor', 0.3) ? 'happy' : 'neutral'; }
      else if (isWhy) { mood = 'annoyed'; look = Math.sin((t - at('why')) * 3.2) > 0 ? 0.8 : -0.8; }
      else if (t < at('shiny')) { mood = t > at('zip') ? 'shock' : 'neutral'; look = 0.6; }
      else { mood = t > mid('look', 0.3) ? 'deadpan' : 'neutral'; look = 0.6; }
      tr(kav, KX, KY, KS, 90);
      kav.set({ t, talk: scTalk(S, t, 'kavya'), mood, look, sweat: isFloor || isWhy ? 0.8 : 0.4 });
      // floor: hearts and her new address
      if (isFloor) {
        hearts.forEach((h, i) => { const hp = P(t, mid('floor', 0.65) + i * 0.18, 0.5, pop); op(h, clamp(hp * 2) * (1 - P(t, end('floor') + 0.3, 0.3, linear))); tr(h, 760 + i * 46, 380 - i * 30 - 30 * hp, Math.max(0.01, hp * 1.2)); });
        floorPop(sign, t, mid('floor', 0.72), 860, 600, 1, -4);
        floorPop(coldQ, t, mid('floor', 0.38), 860, 260, 1);
      } else { hearts.forEach(h => op(h, 0)); op(sign, 0); op(coldQ, 0); }
      // why
      if (isWhy && !isFloor) { floorPop(whyA, t, at('why') + 0.1, 900, 290, 1); floorPop(qMark, t, mid('why', 0.4), 560, 340, 1, Math.sin(t * 5) * 6 * AMP); }
      else { op(whyA, 0); op(qMark, 0); }
      // the spoon sparkles
      op(spoon, isFloor || isWhy ? 0 : 1);
      const starOn = !isWhy && ((t >= at('shiny') && t < mid('look', 0.3)) || (t >= at('metals') && t < at('zip')));
      op(spoonStar, starOn ? 0.5 + 0.5 * wave(t, 0.6) : 0); tr(spoonStar, 784, 604); spoonStar.upd(t);
      // metals
      if (!isWhy && t < at('zip') + 0.4) floorPop(metChip, t, mid('metals', 0.25), 600, 160, 1, 0, 1 - P(t, at('zip') + 0.1, 0.25, linear));
      else op(metChip, 0);
      // Zip bursts out of the spoon and skids to a halt
      const zOn = !isWhy && t >= at('zip') - 0.05;
      op(zipT, zOn ? 1 : 0); op(skid, 0); op(skrrt, 0);
      if (zOn) {
        let zx = 950, zy = 470, zs = 0.75, zoom = 0, zm = 'happy';
        if (t < at('shiny')) {
          const u = clamp((t - at('zip')) / 0.7);
          zx = lerp(800, 950, easeOut(u)) + (u < 1 ? 0 : 0); zy = lerp(610, 470, easeOut(u)); zoom = u < 1 ? 1 : 0;
          if (u >= 1) { op(skid, 1 - P(t, at('zip') + 1.6, 0.4, linear)); tr(skid, zx, zy + 30); op(skrrt, 1 - P(t, at('zip') + 1.6, 0.4, linear)); tr(skrrt, zx + 10, zy - 100); }
        } else if (t >= at('look') - 0.1) { zx = 930; zy = 520; zs = 0.8; zm = t < mid('look', 0.55) ? 'smug' : 'happy'; }
        else zm = t > mid('shiny', 0.45) ? 'annoyed' : 'shock';
        tr(zipT, zx, zy, zs);
        zipT.set({ t, talk: scTalk(S, t, 'zip'), mood: zm, look: -0.5, zoom });
        floorPop(feChip, t, mid('zip', 0.55), 950, 250, 1, 0, t < at('free') ? 1 : 0);
      } else op(feChip, 0);
      // shiny?
      const shinyOn = !isWhy && t >= at('shiny') - 0.1;
      op(armG, shinyOn ? P(t, at('shiny') + 0.1, 0.25, linear) : 0);
      if (shinyOn) {
        floorPop(shinyQ, t, mid('shiny', 0.4), 640, 150, 1, 0, 1 - P(t, at('look') + 0.1, 0.2, linear));
        const lOn = t >= at('look') - 0.05;
        floorPop(vShiny, t, at('look') + 0.1, 900, 170, 1, 0, lOn ? 1 : 0);
        op(xShiny, P(t, mid('look', 0.35), 0.25, linear)); tr(xShiny, -100, 0, 1 + 0.4 * (1 - P(t, mid('look', 0.35), 0.3, easeOut)));
        floorPop(vFree, t, mid('look', 0.62), 860, 260, 1, 0, lOn ? 1 : 0);
        op(tFree, P(t, mid('look', 0.75), 0.25, linear));
        zipStars.forEach((z, i) => { op(z, lOn ? P(t, at('look') + i * 0.12, 0.3, linear) * (t < mid('look', 0.55) ? 1 : 0.4) : 0); tr(z, 930 + [-80, 80, 0][i], 520 + [-60, -40, -120][i]); z.upd(t); });
      } else { [shinyQ, vShiny, vFree].forEach(e => op(e, 0)); zipStars.forEach(z => op(z, 0)); }
    }

    /* ---------------- COND ---------------- */
    if (shot === 'cond') {
      const p = P(t, at('cond') + 0.05, 0.5, pop);
      op(condT, clamp(p * 2)); tr(condT, 600 * (1 - Math.max(0.01, 0.7 + 0.3 * p)), 330 * (1 - Math.max(0.01, 0.7 + 0.3 * p)), Math.max(0.01, 0.7 + 0.3 * p));
      op(condSub, P(t, mid('cond', 0.45), 0.4, linear));
      const rp = P(t, mid('cond', 0.55), 0.4, linear);
      condRow.forEach((c, i) => {
        const x = 380 + i * 64, front = (t - mid('cond', 0.6)) * 3.2 * AMP, k = clamp(front - i + 1) * clamp(1 - (front - i - 1.5));
        const j = (2 + 6 * k) * AMP;
        attr(c, 'cx', x + Math.sin(t * 21 + i) * j); attr(c, 'cy', 500 + Math.cos(t * 17 + i * 2) * j);
        attr(c, 'fill', floorMix('#A9B5C0', '#FF8A3D', k)); op(c, rp);
      });
      op(condAr, rp); condAr.set(P(t, mid('cond', 0.6), 0.8));
    }

    /* ---------------- PASS ---------------- */
    if (shot === 'pass') {
      const t0 = at('pass') + 0.2, front = SKIN - 0.5 + (t - t0) * 2.0;
      pts.forEach(p => {
        let e;
        if (p.skin) e = 0.9;
        else e = 0.15 + 0.7 * clamp(front - p.c) * (1 - 0.04 * (p.c - SKIN));
        const pulse = Math.max(0, 1 - Math.abs(((t - t0) * 2.0 % 4.5) - (p.c - SKIN + 1)) * 0.9);
        const j = (1 + 5.5 * e) * AMP;
        attr(p.el, 'cx', p.x + Math.sin(t * 19 + p.ph) * j);
        attr(p.el, 'cy', p.y + Math.cos(t * 23 + p.ph * 2) * j);
        if (!p.skin) attr(p.el, 'fill', floorMix('#A9B5C0', '#FFB46A', clamp(e * 0.8 + pulse * 0.6 * (t > t0 ? 1 : 0))));
      });
      // Jules hops from particle to particle along the top row
      const hp = clamp((t - t0) * 1.6, 0, PCOL - 1 - 0.01), hc = Math.floor(hp), hf = hp - hc;
      const jx = PX0 + (hc + hf) * PSP, jy = PY0 - 66 - Math.sin(hf * Math.PI) * 46 * AMP;
      tr(julesP, jx, jy, 0.42);
      julesP.set({ t, talk: scTalk(S, t, 'jules'), mood: 'happy', look: 0.6, glow: 0.9 });
      op(passAr, P(t, at('pass') + 0.1, 0.3, linear)); passAr.set(P(t, at('pass') + 0.1, 1.2));
      op(passArT, P(t, at('pass') + 0.6, 0.3, linear));
      floorPop(nbChip, t, mid('pass', 0.5), 600, 680, 1);
      op(stayChip, 0);
    }

    /* ---------------- HAWK ---------------- */
    if (shot === 'hawk') {
      const t0 = mid('gossip', 0.1), t1 = end('gossip') - 0.3, n = TAB.length;
      const k = clamp((t - t0) / (t1 - t0)) * (n + 0.99);
      const ki = Math.floor(k);
      TAB.forEach(tb => { const p = P(t, t0 + (tb.i + 0.6) / (n + 0.99) * (t1 - t0), 0.35, pop); op(tb.ex, clamp(p * 2.5)); tr(tb.ex, 0, 0); });
      stallG.forEach((s, i) => { const p = P(t, t1 + i * 0.12, 0.35, pop); op(s.ex, clamp(p * 2.5)); });
      // the bubble hops along the tables (snake order), then up to the stalls
      let bx, by;
      if (ki < n) { const a = TAB[ki], b = TAB[Math.min(ki + 1, n - 1)], f = ease(k - ki); bx = lerp(a.x, b.x, f); by = lerp(a.y, b.y, f) - 60 - Math.sin(f * Math.PI) * 30; }
      else { bx = lerp(TAB[n - 1].x, 600, P(t, t1, 0.4)); by = lerp(TAB[n - 1].y - 60, 200, P(t, t1, 0.4)); }
      op(bubble, t >= t0 - 0.1 ? 1 - P(t, end('gossip') + 0.2, 0.2, linear) : 0); tr(bubble, bx, by, 0.9);
      tr(julesH, 1090, 610, 0.5); julesH.set({ t, talk: scTalk(S, t, 'jules'), mood: 'happy', look: -0.7 });
      floorPop(hawkC1, t, mid('gossip', 0.4), 520, 690, 1, 0, 1 - P(t, mid('gossip', 0.68), 0.2, linear));
      floorPop(hawkC2, t, mid('gossip', 0.72), 520, 690, 1);
    }

    /* ---------------- SPOON ---------------- */
    if (shot === 'spoon') {
      const t0 = at('free'), front = (t - t0) * 1.0 * AMP;   // the slow vibration front (columns)
      ions.forEach(p => {
        const e = 0.1 + 0.8 * clamp(front - p.c + 1.5) * (1 - p.c * 0.04);
        const j = (0.8 + 5 * e) * AMP;
        attr(p.el, 'cx', p.x + Math.sin(t * 19 + p.ph) * j); attr(p.el, 'cy', p.y + Math.cos(t * 23 + p.ph) * j);
        attr(p.el, 'fill', floorMix('#9AA6B2', '#FFA061', e * 0.8));
      });
      ELN.forEach(o => {
        const u = ((t - t0) * 0.75 * AMP + o.ph) % 1, x = lerp(120, 1080, u), y = SY0 + SSP * (o.lane + 0.5) + Math.sin(u * 30 + o.wob) * 10;
        attr(o.e, 'cx', x); attr(o.e, 'cy', y);
        op(o.e, Math.min(1, u * 8, (1 - u) * 8));
      });
      op(spAr, P(t, at('free') + 0.1, 0.3, linear)); spAr.set(P(t, at('free') + 0.1, 0.9));
      floorPop(eFast, t, mid('free', 0.35), 790, 580, 1);
      floorPop(vSlow, t, mid('free', 0.75), 440, 580, 1);
      tr(zipS, 1080, 470, 0.55); zipS.set({ t, talk: scTalk(S, t, 'zip'), mood: 'happy', look: -0.6, zoom: 1 });
    }

    /* ---------------- CONF ---------------- */
    conf.set(shot === 'conf' ? 1 : 0, t);
    if (shot === 'conf') {
      const push = P(t, mid('thzip', 0.85), end('thzip') + 0.9 - mid('thzip', 0.85), linear);
      floorCam(conf, 430, 380, 1 + 0.07 * push);
      tr(celC, 400, 400, 1.5);
      const lookZ = t > mid('thzip', 0.08) && t < mid('thzip', 0.4);
      celC.set({ t, talk: scTalk(S, t, 'cel'), mood: 'deadpan', look: lookZ ? 0.8 : 0, temp: 34 });
      const ip = P(t, mid('thzip', 0.06), 0.3, pop);
      op(zIn, clamp(ip * 2.5)); tr(zIn, 900, 330, Math.max(0.01, 0.8 + 0.2 * ip));
      tr(zipC, Math.sin(t * 53) * 6 * AMP, -30 + Math.cos(t * 47) * 5 * AMP, 0.62);
      zipC.set({ t, mood: 'happy', look: Math.sin(t * 9) > 0 ? 0.8 : -0.8, zoom: 0.5 });
      cups.forEach((c, i) => { const cp = P(t, mid('thzip', 0.12) + i * 0.1, 0.3, pop); op(c, clamp(cp * 2)); tr(c, -150 + i * 50, 104 + (i % 2) * 6, Math.max(0.01, cp)); });
      floorPop(cupN, t, mid('thzip', 0.32), 150, -96, 1);
      floorPop(noCoffee, t, mid('thzip', 0.45), 900, 560, 1, 0, 1 - P(t, mid('thzip', 0.85), 0.25, linear));
    }

    /* ---------------- SHELF ---------------- */
    if (shot === 'shelf') {
      tr(headSub, 0, 0); op(headSub, P(t, at('insul') + 0.2, 0.4, linear));
      floorPop(head, t, mid('insul', 0.45), 600, 200, 1);
      const F = [0.6, 0.7, 0.8, 0.9];
      ITEMS.forEach((it, i) => {
        floorPop(it.g, t, mid('insul', F[i]), it.x, 496, 1);
        floorPop(it.c, t, mid('insul', F[i]) + 0.1, it.x, 590, 1);
        if (it.dots) it.dots.forEach((d, j) => { attr(d, 'transform', `translate(${(Math.sin(t * 0.8 + j) * 6 * AMP).toFixed(1)} ${(Math.cos(t * 0.7 + j * 2) * 5 * AMP).toFixed(1)})`); });
      });
    }

    /* ---------------- CUP ---------------- */
    if (shot === 'cup') {
      // pan up to the cupboard, the doors creak open, then a slow push-in on his face
      const pan = P(t, at('woolly') - 0.1, 1.0, ease);
      const push = P(t, mid('woolly', 0.55), end('woolly') + 1.2 - mid('woolly', 0.55), linear);
      floorCam(cupW, 600, lerp(760, 380, pan), lerp(1.05, 1.05 + 0.25 * push, 1), 600, lerp(375, 400, push));
      const dp = P(t, at('woolly') + 0.7, 1.1, easeOut);
      [doorL, doorR].forEach((d, i) => {
        const k = Math.max(0.04, 1 - 0.96 * dp);
        if (i === 0) d.setAttribute('transform', `translate(${d.x0} 146) scale(${k.toFixed(3)} 1)`);
        else d.setAttribute('transform', `translate(${(d.x0 + 344).toFixed(1)} 146) scale(${k.toFixed(3)} 1) translate(-344 0)`);
      });
      op(creak, win(t, at('woolly') + 0.7, at('woolly') + 2.1, 0.25));
      tr(woolly, 600, 368, 1.15);
      woolly.set({ t, talk: scTalk(S, t, 'woolly'), mood: 'sad', look: t > end('woolly') ? 0 : -0.2 });
      dust.forEach((d, i) => { const u = ((t * 0.12 * AMP) + i * 0.25) % 1; attr(d, 'cx', 330 + i * 160 + Math.sin(t + i) * 20); attr(d, 'cy', 180 + u * 260); op(d, dp * 0.6 * Math.sin(u * Math.PI)); });
    }
  };
});
