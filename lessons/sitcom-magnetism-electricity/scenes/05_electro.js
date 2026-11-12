/* Scene 5: The magnet with an off switch (Friday).
   Drawer 8B with a floor circuit (Cecil, a switch, Sol) -> Sol limp, lower third, "a nail in a scarf"
   -> bench: field rings round a straight wire, then a coil with a bar-magnet field -> switch ON: Sol
   flexes, N/S, paper clips fly to his point -> Cecil's confessional with an ON | OFF inset -> the
   switch flicks on/off (clips up, down) -> off: "I'm a nail again" -> Cecil flipped: poles swap
   -> TIC card (turns, current, core) -> a flood of Eddies through the coil -> Cecil puffs up next to
   Nora & Stan: permanent magnets don't run on cells -> IRON (temporary) | STEEL (permanent) card
   -> domains inside Nora & Stan -> stroking a steel bar -> heat and a hammer jumble them, "DO NOT
   DROP" -> scrapyard crane: ON lifts a car, OFF drops it; bell, loudspeaker, motor -> Sol and his
   cousin. */
scene('electro', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;

  /* ---------- local helpers (prefixed el) ---------- */
  const elCam = (el, cx, cy, k, px, py) => el.setAttribute('transform', `translate(${(px ?? cx).toFixed(1)} ${(py ?? cy).toFixed(1)}) scale(${k.toFixed(4)}) translate(${(-cx).toFixed(1)} ${(-cy).toFixed(1)})`);
  const elPop = (el, t, t0, x, y, s, r) => { const p = P(t, t0, 0.45, pop); op(el, clamp(p * 2.5)); tr(el, x, y, Math.max(0.01, (s || 1) * (0.6 + 0.4 * p)), r); return p; };
  const elChip = (parent, text, o) => {
    o = o || {};
    return chip(parent, text, { size: o.size || 30, fill: o.fill || 'rgba(10,27,39,0.9)', stroke: o.stroke || C.line, sw: o.sw || 2, color: o.color || C.ink, weight: o.weight || 700 });
  };
  const elPaper = (parent, w, h, o) => {      // a card with a coloured header strip
    o = o || {};
    const g = G(parent);
    E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: 14, fill: o.fill || '#FFFFFF', stroke: o.stroke || SC_INK, 'stroke-width': 4 }, g);
    if (o.head) {
      E('path', { d: `M${-w / 2 + 14},${-h / 2} L${w / 2 - 14},${-h / 2} Q${w / 2},${-h / 2} ${w / 2},${-h / 2 + 14} L${w / 2},${-h / 2 + 50} L${-w / 2},${-h / 2 + 50} L${-w / 2},${-h / 2 + 14} Q${-w / 2},${-h / 2} ${-w / 2 + 14},${-h / 2} Z`, fill: o.headCol || DR_RED }, g);
      T(g, 0, -h / 2 + 36, o.head, { size: o.headSize || 28, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
    }
    return g;
  };
  const elClip = (parent) => {      // a paper clip, about 34 x 14
    const g = G(parent);
    E('path', { d: 'M-12,-5 L12,-5 Q17,-5 17,0 Q17,5 12,5 L-14,5 Q-19,5 -19,0 Q-19,-8 -12,-8 L10,-8', fill: 'none', stroke: '#C9D3DC', 'stroke-width': 3.5, 'stroke-linecap': 'round' }, g);
    return g;
  };
  // a plain iron nail, pointing down, about 44 x 280
  const elNail = (parent, col) => {
    const g = G(parent);
    E('rect', { x: -14, y: -110, width: 28, height: 210, fill: col || ball('#B9C4CF', '#6E7A86'), stroke: SC_INK, 'stroke-width': 4 }, g);
    E('path', { d: 'M-14,98 L0,136 L14,98 Z', fill: '#8E9BA8', stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
    E('ellipse', { cx: 0, cy: -112, rx: 40, ry: 11, fill: ball('#D3DBE3', '#7A8692'), stroke: SC_INK, 'stroke-width': 4 }, g);
    return g;
  };
  // a wire with moving current dots drawn as one dashed path (cheap: 3 elements); g.set(on), g.upd(t, speed)
  const elWire = (parent, pts, o) => {
    o = o || {};
    const g = G(parent), d = 'M' + pts.map(q => q[0].toFixed(1) + ',' + q[1].toFixed(1)).join(' L'), sp = o.spacing || 46;
    E('path', { d, fill: 'none', stroke: o.color || WIRE, 'stroke-width': o.width || 5, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, g);
    const dots = E('path', { d, fill: 'none', stroke: C.energy, 'stroke-width': (o.dot || 5.5) * 2, 'stroke-linecap': 'round', 'stroke-dasharray': `0 ${sp}` }, g);
    g.set = v => op(dots, v);
    g.upd = (t, speed) => attr(dots, 'stroke-dashoffset', -((t * (speed === undefined ? 60 : speed)) % sp));
    return g;
  };
  // a tiny Eddie for the coil (3 elements)
  const elEddie = (parent, r) => {
    const g = G(parent);
    E('circle', { r, fill: ball('#5EC8FF', '#1F6FB8'), stroke: '#1F5F9E', 'stroke-width': 1.5 }, g);
    E('path', { d: `M${-r * 0.34},${-r * 0.12} l0,0.1 M${r * 0.34},${-r * 0.12} l0,0.1`, stroke: '#FFFFFF', 'stroke-width': r * 0.5, 'stroke-linecap': 'round' }, g);
    return g;
  };
  // switch state from a list of [time, 0|1] toggles: { s, dt } (current state, seconds since it changed)
  const elState = (list, t) => { let s = 0, t0 = -99; for (const [tt, v] of list) if (t >= tt) { s = v; t0 = tt; } return { s, dt: t - t0 }; };

  /* ---------- layers ---------- */
  const world = G(root), Lbg = G(world), Lmid = G(world), Lcast = G(world), Lfg = G(world), hud = G(root);

  /* ================= sets ================= */
  const drawer = G(Lbg); drDrawer(drawer);
  const bench = G(Lbg); drBench(bench);
  const conf = drConf(Lbg, 'cecil');

  /* ---- the floor circuit in the drawer: Cecil (+ at the top) -> switch -> Sol's coil -> back to Cecil (-) ---- */
  const CEC = [190, 500, 0.75], SOL = [640, 400, 1];
  const circ = G(Lmid);
  const wA = elWire(circ, [[190, 392], [190, 350], [330, 350], [330, 650], [370, 650]], { spacing: 40 });
  const wB = elWire(circ, [[470, 650], [520, 650], [520, 470], [578, 470]], { spacing: 40 });
  const wC = elWire(circ, [[702, 470], [760, 470], [760, 706], [190, 706], [190, 592]], { spacing: 40 });
  const sw = switchSym(circ); tr(sw, 420, 650, 1.1);
  const clickT = T(circ, 420, 600, 'click', { size: 28, weight: 800, anchor: 'middle', fill: C.energy });
  // paper clips on the foam
  const CLIP_FLOOR = [[560, 640, 8], [604, 662, -14], [676, 650, 20], [722, 666, -6]];
  const CLIP_STUCK = [[624, 548, -60], [656, 548, 60], [612, 572, -75], [668, 572, 75]];   // relative to Sol at (640, 400)
  const clips = CLIP_FLOOR.map(() => elClip(Lfg));

  /* ---- the bench: field rings round a straight wire, then a coil ---- */
  const wireShot = G(Lmid);
  const wsA = G(wireShot), wsB = G(wireShot);
  const RING_Y = [270, 400, 530];
  const ringBack = RING_Y.map(y => E('path', { d: `M490,${y} A110,30 0 0 1 710,${y}`, fill: 'none', stroke: '#9FD8FF', 'stroke-width': 5, opacity: 0.55 }, wsA));
  const strW = elWire(wsA, [[600, 650], [600, 140]], { spacing: 44, width: 9, color: DR_COPPER, dot: 7 });
  const ringFront = RING_Y.map(y => {
    const g = G(wsA);
    E('path', { d: `M490,${y} A110,30 0 0 0 710,${y}`, fill: 'none', stroke: '#9FD8FF', 'stroke-width': 5 }, g);
    E('path', { d: `M-14,-10 L8,0 L-14,10 Z`, fill: '#9FD8FF', transform: `translate(600 ${y + 30})` }, g);
    return g;
  });
  const curLbl = G(wsA);
  arrow(curLbl, 650, 560, 650, 450, { color: C.energy, width: 6 });
  T(curLbl, 672, 520, 'current', { size: 30, weight: 800, fill: C.energy });
  const fieldLbl = elChip(wsA, 'magnetic field', { size: 32, color: '#9FD8FF', stroke: '#9FD8FF' });
  // the coil
  const COIL_X0 = 420, COIL_N = 8, PITCH = 50, CY = 410, RY = 82;
  let back = '', front = '';
  const helix = [[COIL_X0 - 120, CY + RY + 60], [COIL_X0 - 40, CY + RY]];
  for (let i = 0; i < COIL_N; i++) {
    const x = COIL_X0 + i * PITCH;
    front += `M${x},${CY + RY} C${x + 34},${CY + RY * 0.55} ${x + 34},${CY - RY * 0.55} ${x},${CY - RY} `;
    for (let k = 0; k <= 6; k++) { const a = Math.PI / 2 - k * Math.PI / 6; helix.push([x + 26 * Math.cos(a), CY + RY * Math.sin(a)]); }
    if (i < COIL_N - 1) back += `M${x},${CY - RY} C${x - 26},${CY - RY * 0.4} ${x + PITCH - 26},${CY + RY * 0.4} ${x + PITCH},${CY + RY} `;
  }
  const xEnd = COIL_X0 + (COIL_N - 1) * PITCH;
  helix.push([xEnd + 40, CY - RY], [xEnd + 120, CY - RY - 60]);
  const coilField = drField(wsB, xEnd - COIL_X0 + 60, { n: 3, color: '#9FD8FF' }); tr(coilField, (COIL_X0 + xEnd) / 2, CY);
  E('path', { d: back, fill: 'none', stroke: DR_COPPER_DK, 'stroke-width': 9, 'stroke-linecap': 'round' }, wsB);
  const coilW = elWire(wsB, helix, { spacing: 62, color: 'none', dot: 6 });
  E('path', { d: `M${helix[0][0]},${helix[0][1]} L${helix[1][0]},${helix[1][1]} L${COIL_X0},${CY + RY} M${xEnd},${CY - RY} L${helix[helix.length - 2][0]},${helix[helix.length - 2][1]} L${helix[helix.length - 1][0]},${helix[helix.length - 1][1]}`, fill: 'none', stroke: DR_COPPER, 'stroke-width': 9, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, wsB);
  const coilFront = E('path', { d: front, fill: 'none', stroke: DR_COPPER, 'stroke-width': 10, 'stroke-linecap': 'round' }, wsB);
  const coilN = elChip(wsB, 'N', { size: 40, fill: DR_RED, color: '#FFFFFF', stroke: '#FFFFFF' });
  const coilS = elChip(wsB, 'S', { size: 40, fill: DR_BLUE, color: '#FFFFFF', stroke: '#FFFFFF' });
  tr(coilN, COIL_X0 - 60, CY - 150); tr(coilS, xEnd + 60, CY - 150);

  /* ---- confessional inset: Sol ON | Sol OFF ---- */
  const inset = G(Lmid);
  E('rect', { x: 640, y: 170, width: 500, height: 400, rx: 18, fill: '#0E1A24', stroke: '#FFFFFF', 'stroke-width': 4, opacity: 0.94 }, inset);
  E('line', { x1: 890, y1: 190, x2: 890, y2: 550, stroke: '#FFFFFF', 'stroke-width': 3, opacity: 0.4 }, inset);
  const insOn = G(inset), insOff = G(inset);
  T(insOn, 765, 220, 'ON', { size: 34, weight: 800, anchor: 'middle', fill: C.good });
  T(insOn, 765, 540, 'unbearable', { size: 28, weight: 700, anchor: 'middle', fill: C.ink });
  T(insOff, 1015, 220, 'OFF', { size: 34, weight: 800, anchor: 'middle', fill: C.muted });
  const offNail = elNail(insOff); tr(offNail, 1015, 360, 0.8, 6);
  T(insOff, 1015, 540, 'a nail', { size: 28, weight: 700, anchor: 'middle', fill: C.ink });

  /* ---- comparison card stand-in props ---- */
  // the steel bar for "stroke" and "heat"
  const barG = G(Lmid);
  E('rect', { x: 350, y: 380, width: 500, height: 180, rx: 14, fill: linGrad('#C9D3DC', '#7E8B97', true), stroke: SC_INK, 'stroke-width': 5 }, barG);
  E('rect', { x: 362, y: 390, width: 476, height: 20, rx: 8, fill: '#FFFFFF', opacity: 0.25 }, barG);
  const barLbl = T(barG, 600, 600, 'a steel bar', { size: 28, weight: 700, anchor: 'middle', fill: C.muted });
  const barN = T(barG, 376, 482, 'N', { size: 40, weight: 800, anchor: 'middle', fill: DR_RED });
  const barS = T(barG, 824, 482, 'S', { size: 40, weight: 800, anchor: 'middle', fill: DR_BLUE });
  // the domains panel inside Nora & Stan
  const domPanel = G(Lmid);
  E('path', { d: 'M570,250 L390,410 M630,250 L810,410', stroke: '#FFFFFF', 'stroke-width': 3, opacity: 0.5, 'stroke-dasharray': '8 8' }, domPanel);
  E('rect', { x: 380, y: 410, width: 220, height: 200, rx: 16, fill: '#A4232E', opacity: 0.55 }, domPanel);
  E('rect', { x: 600, y: 410, width: 220, height: 200, rx: 16, fill: '#1E4FA8', opacity: 0.55 }, domPanel);
  E('rect', { x: 380, y: 410, width: 440, height: 200, rx: 16, fill: 'none', stroke: '#FFFFFF', 'stroke-width': 4 }, domPanel);
  T(domPanel, 352, 524, 'N', { size: 36, weight: 800, anchor: 'middle', fill: '#FF8A8E' });
  T(domPanel, 848, 524, 'S', { size: 36, weight: 800, anchor: 'middle', fill: '#8FB4FF' });
  const lens = E('circle', { cx: 600, cy: 230, r: 44, fill: 'none', stroke: '#FFFFFF', 'stroke-width': 4, opacity: 0.8 }, domPanel);
  // one grid of domains, moved between the panel and the steel bar
  const doms = drDomains(Lfg, 6, 3, 56);
  // stroking magnet (N at the bottom), bunsen and hammer
  const strokeMag = G(Lfg);
  E('rect', { x: -34, y: -90, width: 68, height: 90, rx: 8, fill: ball('#6FA0F0', '#1E4FA8'), stroke: SC_INK, 'stroke-width': 4 }, strokeMag);
  E('rect', { x: -34, y: 0, width: 68, height: 90, rx: 8, fill: ball('#F06A6F', '#A4232E'), stroke: SC_INK, 'stroke-width': 4 }, strokeMag);
  T(strokeMag, 0, -32, 'S', { size: 34, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  T(strokeMag, 0, 62, 'N', { size: 34, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  const strokeArrows = G(Lfg);
  E('path', { d: [430, 600, 770].map(x => `M${x - 60},660 L${x + 50},660 M${x + 34},648 L${x + 58},660 L${x + 34},672`).join(' '), fill: 'none', stroke: C.energy, 'stroke-width': 7, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, strokeArrows);
  const burner = bunsen(Lfg, 0.9);
  const hammer = G(Lfg), hamIn = G(hammer);
  E('rect', { x: -10, y: -250, width: 20, height: 250, rx: 8, fill: '#A87B4F', stroke: SC_INK, 'stroke-width': 4 }, hamIn);
  E('rect', { x: -60, y: -300, width: 120, height: 62, rx: 10, fill: ball('#9AA6B2', '#56636E'), stroke: SC_INK, 'stroke-width': 4 }, hamIn);
  const bonk = G(Lfg);
  { let d = ''; for (let i = 0; i < 18; i++) { const a = i / 18 * TAU, r = i % 2 ? 46 : 80; d += (i ? 'L' : 'M') + (Math.cos(a) * r * 1.3).toFixed(1) + ',' + (Math.sin(a) * r).toFixed(1); } E('path', { d: d + 'Z', fill: '#FFE45C', stroke: DR_RED, 'stroke-width': 5, 'stroke-linejoin': 'round' }, bonk); }
  T(bonk, 0, 13, 'BONK', { size: 36, weight: 800, anchor: 'middle', fill: DR_RED });

  /* ---- the scrapyard ---- */
  const yardWrap = G(Lbg), yard = G(yardWrap);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#8CCBEF', '#E4F2F8', true) }, yard);
  E('path', { d: 'M0,560 L0,420 L70,420 L70,360 L160,360 L160,440 L250,440 L250,330 L330,330 L330,560 Z M880,560 L880,380 L960,380 L960,300 L1060,300 L1060,400 L1200,400 L1200,560 Z', fill: '#B9CCD8' }, yard);
  E('rect', { x: 0, y: 560, width: 1200, height: 190, fill: '#8A7A62' }, yard);
  E('path', { d: 'M0,600 L1200,610 M0,680 L1200,670', stroke: '#76684F', 'stroke-width': 4 }, yard);
  // scrap pile on the right
  E('path', { d: 'M700,566 L760,500 L820,470 L880,452 L940,470 L1010,500 L1080,566 Z', fill: '#6B5E4E', stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, yard);
  E('path', { d: 'M770,520 l40,-14 l10,24 l-44,8 Z M880,490 l56,4 l-6,22 l-52,-6 Z M960,520 l34,-20 l20,26 Z M840,540 l50,-6 l4,20 l-50,4 Z', fill: '#C2453A', stroke: SC_INK, 'stroke-width': 3, 'stroke-linejoin': 'round' }, yard);
  E('path', { d: 'M800,500 l30,-6 M900,470 l40,8 M1000,536 l40,4', stroke: '#9AA6B2', 'stroke-width': 6, 'stroke-linecap': 'round' }, yard);
  // the crane: tower and a horizontal boom with a trolley
  E('rect', { x: 120, y: 150, width: 50, height: 410, fill: '#F2B632', stroke: SC_INK, 'stroke-width': 4 }, yard);
  let lat = ''; for (let y = 160; y < 550; y += 40) lat += `M124,${y} L166,${y + 40} M166,${y} L124,${y + 40} `;
  E('path', { d: lat, stroke: '#B88412', 'stroke-width': 3 }, yard);
  E('rect', { x: 100, y: 128, width: 1000, height: 34, fill: '#F2B632', stroke: SC_INK, 'stroke-width': 4 }, yard);
  let lb = ''; for (let x = 104; x < 1090; x += 34) lb += `M${x},132 L${x + 17},158 L${x + 34},132 `;
  E('path', { d: lb, fill: 'none', stroke: '#B88412', 'stroke-width': 3 }, yard);
  E('rect', { x: 170, y: 168, width: 90, height: 70, rx: 8, fill: '#E8EEF2', stroke: SC_INK, 'stroke-width': 4 }, yard);   // cab
  E('rect', { x: 184, y: 180, width: 62, height: 34, rx: 4, fill: '#7FC4EA' }, yard);
  const trolley = G(yard);
  E('rect', { x: -28, y: 156, width: 56, height: 22, rx: 4, fill: '#56636E', stroke: SC_INK, 'stroke-width': 3 }, trolley);
  const cable = E('line', { x1: 0, y1: 178, x2: 0, y2: 300, stroke: '#3A4048', 'stroke-width': 4 }, trolley);
  const disc = G(trolley);
  const discGlow = E('ellipse', { cx: 0, cy: 30, rx: 150, ry: 70, fill: glow('#6FD3FF') }, disc);
  E('path', { d: 'M-12,-10 L12,-10 L8,6 L-8,6 Z', fill: '#3A4048' }, disc);
  E('rect', { x: -80, y: 4, width: 160, height: 34, rx: 12, fill: ball('#6B7783', '#2A2F36'), stroke: SC_INK, 'stroke-width': 4 }, disc);
  const discFace = G(disc);
  E('circle', { cx: -18, cy: 20, r: 4, fill: '#FFFFFF' }, discFace); E('circle', { cx: 18, cy: 20, r: 4, fill: '#FFFFFF' }, discFace);
  E('path', { d: 'M-10,28 Q0,34 10,28', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 3, 'stroke-linecap': 'round' }, discFace);
  const car = G(yard);
  E('path', { d: 'M-110,0 L-110,-34 Q-108,-44 -96,-46 L-62,-50 L-36,-84 Q-30,-90 -20,-90 L44,-90 Q54,-90 60,-84 L84,-52 L104,-48 Q112,-46 112,-36 L112,0 Z', fill: '#3F7BE0', stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, car);
  E('path', { d: 'M-26,-80 L-6,-80 L-6,-54 L-48,-54 Z M6,-80 L42,-80 L64,-54 L6,-54 Z', fill: '#BFE7FA', stroke: SC_INK, 'stroke-width': 3, 'stroke-linejoin': 'round' }, car);
  E('circle', { cx: -62, cy: 2, r: 22, fill: '#2A2F36', stroke: SC_INK, 'stroke-width': 4 }, car);
  E('circle', { cx: 62, cy: 2, r: 22, fill: '#2A2F36', stroke: SC_INK, 'stroke-width': 4 }, car);
  const dust = G(yard);
  E('path', { d: [[-70, -10, 34], [-20, -26, 44], [40, -14, 38], [90, -4, 28], [-110, 0, 24]].map(([x, y, r]) => `M${x - r},${y} a${r},${r} 0 1 0 ${2 * r},0 a${r},${r} 0 1 0 ${-2 * r},0 Z`).join(' '), fill: '#D9CBB0', opacity: 0.85 }, dust);
  const crash = T(yard, 0, 0, 'CRASH!', { size: 56, weight: 800, anchor: 'middle', fill: DR_RED });
  // the yard as an inset (the "cousin" shot)
  const yardFrame = G(Lfg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: 'none', stroke: '#FFFFFF', 'stroke-width': 14 }, yardFrame);

  /* ================= the cast ================= */
  const cecil = cast(Lcast, 'cecil');
  const sol = cast(Lcast, 'sol');
  const mag = cast(Lcast, 'magnet');
  const eddie = cast(Lcast, 'eddie');
  // extras drawn inside Sol (so they follow his bob and droop): extra turns and Eddies under his face,
  // a gold outline on his iron nail under the coil
  const solIn = sol.firstChild;
  const solPatch = solIn.querySelector('ellipse[fill="#F6DEC4"]'), solCoilBack = solIn.querySelector(`rect[fill="${DR_COPPER_DK}"]`);
  const nailHi = G(solIn); solIn.insertBefore(nailHi, solCoilBack);
  E('path', { d: 'M-30,-128 L30,-128 L30,118 L0,164 L-30,118 Z', fill: 'none', stroke: C.energy, 'stroke-width': 7, 'stroke-linejoin': 'round' }, nailHi);
  E('ellipse', { cx: 0, cy: -118, rx: 66, ry: 22, fill: 'none', stroke: C.energy, 'stroke-width': 7 }, nailHi);
  const extraTurns = G(solIn); solIn.insertBefore(extraTurns, solPatch);
  { let d = ''; for (let y = -75; y <= 96; y += 15) d += `M-72,${y} Q0,${y + 14} 72,${y} `; E('path', { d, fill: 'none', stroke: '#FFB060', 'stroke-width': 6, 'stroke-linecap': 'round' }, extraTurns); }
  const solEd = G(solIn); solIn.insertBefore(solEd, solPatch);
  const EDS = []; for (let i = 0; i < 11; i++) EDS.push(elEddie(solEd, 13));
  // a bigger field round Sol for TIC
  const bigField = G(Lmid);
  E('ellipse', { rx: 230, ry: 270, fill: glow('#7FD4FF') }, bigField);
  [-1, 1].forEach(sd => E('path', { d: `M0,-200 C${sd * 360},-250 ${sd * 360},250 0,220`, fill: 'none', stroke: '#9FE3FF', 'stroke-width': 4, 'stroke-dasharray': '12 10', opacity: 0.8 }, bigField));
  // Cecil's dangling lead ("plugged into nothing")
  const dangle = G(Lmid);
  E('path', { d: 'M330,338 C330,250 600,230 660,360', fill: 'none', stroke: DR_RED, 'stroke-width': 6, 'stroke-linecap': 'round' }, dangle);
  const croc = G(dangle); tr(croc, 660, 360, 1, 64);
  E('path', { d: 'M0,-7 L40,-11 L40,11 L0,7 Z', fill: '#C9D3DC', stroke: SC_INK, 'stroke-width': 2 }, croc);
  E('path', { d: 'M40,-11 L62,-3 M40,11 L62,3', stroke: '#9AA6B2', 'stroke-width': 4 }, croc);
  const qm = T(dangle, 700, 330, '?', { size: 48, weight: 800, anchor: 'middle', fill: C.energy });
  // "DO NOT DROP" sticker for Nora & Stan
  const sticker = G(Lfg);
  E('rect', { x: -110, y: -24, width: 220, height: 48, rx: 6, fill: '#FFE45C', stroke: SC_INK, 'stroke-width': 3 }, sticker);
  T(sticker, 0, 10, 'DO NOT DROP', { size: 28, weight: 800, anchor: 'middle', fill: SC_INK });

  /* ================= HUD: chips, cards, lower third ================= */
  const fri = elChip(hud, 'FRIDAY', { size: 48, fill: DR_GOLD, color: SC_INK, stroke: '#FFF1C2', sw: 4 });
  const friSub = elChip(hud, 'the ELECTROMAGNET', { size: 34, color: '#9FD8FF', stroke: '#9FD8FF' });
  const ltSol = scLowerThird(hud, ...DR_LOWER.sol);
  const kwSol = elChip(hud, 'SOLENOID', { size: 50, fill: DR_COPPER, color: '#FFFFFF', stroke: '#FFD9AE', sw: 4 });
  const kwCoil = elChip(hud, '= a coil of wire', { size: 32 });
  const kwNail = elChip(hud, 'round an iron nail', { size: 32 });
  const scarf = elPaper(hud, 260, 290, { fill: '#FBF7EC' });
  { const n = elNail(scarf, '#B9C4CF'); tr(n, 0, -10, 0.62);
    const sc = G(scarf);
    [[-58, -40], [-58, -10], [-58, 20]].forEach(([x, y], i) => E('path', { d: `M${x},${y} L${-x},${y - 14} L${-x},${y + 10} L${x},${y + 24} Z`, fill: i % 2 ? '#FFFFFF' : '#E0474C', stroke: SC_INK, 'stroke-width': 3, 'stroke-linejoin': 'round' }, sc));
    E('path', { d: 'M40,6 L64,74 L44,80 L28,16 Z', fill: '#E0474C', stroke: SC_INK, 'stroke-width': 3, 'stroke-linejoin': 'round' }, sc);
    E('path', { d: 'M48,82 l-4,14 M56,80 l0,14 M64,78 l4,13', stroke: '#E0474C', 'stroke-width': 3 }, sc);
    T(scarf, 0, 128, 'a nail in a scarf', { size: 26, weight: 700, anchor: 'middle', fill: SC_INK, font: FB }); }
  // wire shot
  const kwAdd = elChip(hud, "coil it: the loops' fields ADD UP", { size: 32, color: C.energy, stroke: C.energy });
  const kwBar = elChip(hud, '= the field of a bar magnet', { size: 30 });
  // on
  const kwEM = elChip(hud, 'ELECTROMAGNET', { size: 46, fill: '#0E2A3A', color: '#7FD4FF', stroke: '#7FD4FF', sw: 4 });
  const kwCur = elChip(hud, 'current ON', { size: 30, color: C.energy, stroke: C.energy });
  // switch card
  const swCard = elPaper(hud, 440, 200, { head: 'BIG ADVANTAGE', headCol: '#2E7DD8' });
  T(swCard, -190, 18, 'switch it', { size: 32, weight: 700, fill: SC_INK });
  T(swCard, -190, 64, 'ON and OFF', { size: 38, weight: 800, fill: SC_INK });
  const rocker = G(swCard); tr(rocker, 140, 36);
  E('rect', { x: -46, y: -42, width: 92, height: 84, rx: 12, fill: '#E6EBF0', stroke: SC_INK, 'stroke-width': 4 }, rocker);
  const rockTop = E('rect', { x: -32, y: -32, width: 64, height: 32, rx: 6, fill: C.good, stroke: SC_INK, 'stroke-width': 3 }, rocker);
  const rockBot = E('rect', { x: -32, y: 0, width: 64, height: 32, rx: 6, fill: '#9AA6B2', stroke: SC_INK, 'stroke-width': 3 }, rocker);
  const rockTxt = T(rocker, 0, -50, 'ON', { size: 28, weight: 800, anchor: 'middle', fill: C.good });
  // reverse
  const kwRev = elChip(hud, 'reverse current → poles SWAP', { size: 32, color: C.energy, stroke: C.energy });
  const poleRings = G(Lfg);
  const ring1 = E('circle', { r: 34, fill: 'none', stroke: C.energy, 'stroke-width': 5 }, poleRings);
  const ring2 = E('circle', { r: 34, fill: 'none', stroke: C.energy, 'stroke-width': 5 }, poleRings);
  // TIC card
  const tic = elPaper(hud, 560, 520, { fill: '#FBF7EC' });
  const ticHead = G(tic);
  T(ticHead, 0, -170, 'TIC', { size: 84, weight: 800, anchor: 'middle', fill: DR_COPPER, ls: 10 });
  T(ticHead, 0, -126, 'a stronger electromagnet', { size: 28, weight: 700, anchor: 'middle', fill: '#5A6B7A', font: FB });
  const ticRows = [['T', 'more TURNS of wire'], ['I', 'INCREASE the current'], ['C', 'an iron CORE']].map(([L, txt], i) => {
    const g = G(tic), y = -60 + i * 92;
    E('circle', { cx: -228, cy: y, r: 32, fill: DR_COPPER, stroke: SC_INK, 'stroke-width': 3 }, g);
    T(g, -228, y + 14, L, { size: 40, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
    T(g, -180, y + 11, txt, { size: 32, weight: 800, fill: SC_INK });
    return g;
  });
  { const ic = G(ticRows[1]); tr(drSym(ic, 'battery', { w: 5 }), 190, 30, 0.5); }
  const ticMeterG = G(tic);
  T(ticMeterG, -228, 222, 'strength', { size: 28, weight: 700, fill: '#5A6B7A', font: FB });
  const ticMeter = meter(ticMeterG, { w: 300, h: 30, color: '#7FD4FF', track: '#DDE5EC' }); tr(ticMeter, -84, 198);
  // more
  const kwMore = elChip(hud, 'more current = more charge flowing', { size: 30, color: C.energy, stroke: C.energy });
  const woo = G(Lfg);
  const woo1 = elChip(woo, 'WOO!', { size: 30, fill: '#FFFFFF', color: '#1F6FB8', stroke: '#1F6FB8' });
  const woo2 = elChip(woo, 'YEAH!', { size: 30, fill: '#FFFFFF', color: '#1F6FB8', stroke: '#1F6FB8' });
  // bigger
  const kwIronNail = elChip(hud, 'iron nail', { size: 30, color: C.energy, stroke: C.energy });
  const kwBig = elChip(hud, 'a BIGGER cell?', { size: 34, color: C.energy, stroke: C.energy });
  const permCard = elPaper(hud, 540, 170, { head: 'PERMANENT MAGNETS', headCol: DR_RED });
  T(permCard, 0, 30, "don't need (or use)", { size: 32, weight: 700, anchor: 'middle', fill: SC_INK });
  T(permCard, 0, 70, 'a cell', { size: 34, weight: 800, anchor: 'middle', fill: SC_INK });
  // iron | steel card
  const isCard = elPaper(hud, 560, 470, { fill: '#FBF7EC' });
  E('line', { x1: 0, y1: -200, x2: 0, y2: 210, stroke: '#C9BFA6', 'stroke-width': 3 }, isCard);
  const colI = G(isCard), colS = G(isCard);
  const colIA = G(colI), colIB = G(colI), colIC = G(colI);
  T(colIA, -140, -170, 'PURE IRON', { size: 36, weight: 800, anchor: 'middle', fill: '#56636E' });
  T(colIB, -140, -100, 'TEMPORARY', { size: 34, weight: 800, anchor: 'middle', fill: '#D9822B' });
  T(colIB, -140, -62, '(soft) magnet', { size: 28, weight: 700, anchor: 'middle', fill: SC_INK, font: FB });
  T(colIC, -140, 6, 'loses its', { size: 28, weight: 700, anchor: 'middle', fill: SC_INK, font: FB });
  T(colIC, -140, 42, 'magnetism', { size: 28, weight: 700, anchor: 'middle', fill: SC_INK, font: FB });
  T(colIC, -140, 78, 'easily', { size: 30, weight: 800, anchor: 'middle', fill: '#D9822B' });
  const mI = meter(colIC, { w: 220, h: 26, color: '#7FD4FF', track: '#DDE5EC' }); tr(mI, -250, 128);
  T(colIC, -140, 196, 'magnetism', { size: 26, weight: 600, anchor: 'middle', fill: '#5A6B7A', font: FB });
  const colSA = G(colS), colSB = G(colS), colSC = G(colS);
  T(colSA, 140, -170, 'STEEL', { size: 36, weight: 800, anchor: 'middle', fill: '#24407A' });
  T(colSB, 140, -100, 'PERMANENT', { size: 34, weight: 800, anchor: 'middle', fill: '#2C9A62' });
  T(colSB, 140, -62, 'magnet', { size: 28, weight: 700, anchor: 'middle', fill: SC_INK, font: FB });
  T(colSC, 140, 6, 'keeps its', { size: 28, weight: 700, anchor: 'middle', fill: SC_INK, font: FB });
  T(colSC, 140, 42, 'magnetism', { size: 28, weight: 700, anchor: 'middle', fill: SC_INK, font: FB });
  T(colSC, 140, 78, 'for years', { size: 30, weight: 800, anchor: 'middle', fill: '#2C9A62' });
  const mS = meter(colSC, { w: 220, h: 26, color: '#7FD4FF', track: '#DDE5EC' }); tr(mS, 30, 128);
  T(colSC, 140, 196, 'magnetism', { size: 26, weight: 600, anchor: 'middle', fill: '#5A6B7A', font: FB });
  // domains
  const kwDom = elChip(hud, 'DOMAINS', { size: 46, fill: DR_GOLD, color: SC_INK, stroke: '#FFF1C2', sw: 4 });
  const kwDom2 = elChip(hud, 'tiny regions, all pointing the same way', { size: 28 });
  // stroke
  const kwMagz = elChip(hud, 'MAGNETISE', { size: 44, fill: DR_GOLD, color: SC_INK, stroke: '#FFF1C2', sw: 4 });
  const kwStroke = elChip(hud, 'stroke ×1', { size: 30 });
  const kwOneWay = elChip(hud, 'in ONE direction, again and again', { size: 30, color: C.energy, stroke: C.energy });
  // heat
  const kwHeat = elChip(hud, 'heat ✗', { size: 34, color: '#FF9A6A', stroke: '#FF9A6A' });
  const kwHam = elChip(hud, 'hammer ✗', { size: 34, color: '#FF9A6A', stroke: '#FF9A6A' });
  const demag = G(hud);
  E('rect', { x: -230, y: -44, width: 460, height: 88, rx: 10, fill: '#FFFFFF', 'fill-opacity': 0.94, stroke: DR_RED, 'stroke-width': 7 }, demag);
  T(demag, 0, 16, 'DEMAGNETISED', { size: 48, weight: 800, anchor: 'middle', fill: DR_RED });
  // crane
  const kwCraneEM = elChip(hud, 'electromagnet', { size: 30, color: '#7FD4FF', stroke: '#7FD4FF' });
  const kwOnOff = elChip(hud, 'ON', { size: 36, fill: C.good, color: SC_INK, stroke: '#FFFFFF' });
  const kwOff = elChip(hud, 'OFF', { size: 36, fill: '#9AA6B2', color: SC_INK, stroke: '#FFFFFF' });
  const uses = G(hud);
  E('rect', { x: 120, y: 540, width: 960, height: 170, rx: 20, fill: 'rgba(10,27,39,0.9)', stroke: C.line, 'stroke-width': 3 }, uses);
  const useBell = G(uses), useSpk = G(uses), useMot = G(uses);
  { const g = G(useBell); tr(g, 300, 600);
    E('path', { d: 'M-34,20 Q-34,-34 0,-36 Q34,-34 34,20 L44,30 L-44,30 Z', fill: DR_GOLD, stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
    E('circle', { cy: 38, r: 9, fill: DR_GOLD, stroke: SC_INK, 'stroke-width': 3 }, g);
    T(useBell, 300, 690, 'bells', { size: 32, weight: 800, anchor: 'middle' }); }
  { const g = G(useSpk); tr(g, 600, 600);
    E('path', { d: 'M-40,-16 L-16,-16 L14,-40 L14,40 L-16,16 L-40,16 Z', fill: '#C9D3DC', stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
    E('path', { d: 'M28,-20 Q42,0 28,20 M40,-32 Q62,0 40,32', fill: 'none', stroke: '#9FD8FF', 'stroke-width': 5, 'stroke-linecap': 'round' }, g);
    T(useSpk, 600, 690, 'loudspeakers', { size: 32, weight: 800, anchor: 'middle' }); }
  { const g = G(useMot); tr(g, 900, 600);
    E('circle', { r: 38, fill: '#E6EBF0', stroke: SC_INK, 'stroke-width': 4 }, g);
    T(g, 0, 13, 'M', { size: 38, weight: 800, anchor: 'middle', fill: SC_INK });
    E('rect', { x: 38, y: -6, width: 30, height: 12, rx: 4, fill: '#9AA6B2', stroke: SC_INK, 'stroke-width': 3 }, g);
    T(useMot, 900, 690, 'motors', { size: 32, weight: 800, anchor: 'middle' }); }
  // cousin
  const tagCousin = elChip(hud, "Sol's cousin, at work", { size: 30, fill: '#FFFFFF', color: SC_INK, stroke: SC_INK });

  /* ================= cut list ================= */
  const CUTS = [
    [-1, 'fri'],
    [at('sol') - 0.06, 'sol'],
    [at('wire') - 0.06, 'wire'],
    [at('on') - 0.06, 'on'],
    [at('thsol') - 0.06, 'thsol'],
    [at('switch') - 0.06, 'switch'],
    [at('off') - 0.06, 'off'],
    [at('reverse') - 0.06, 'reverse'],
    [at('tic') - 0.06, 'tic'],
    [at('more') - 0.06, 'more'],
    [at('bigger') - 0.06, 'bigger'],
    [at('iron') - 0.06, 'iron'],
    [at('steel') - 0.06, 'steel'],
    [at('domains') - 0.06, 'domains'],
    [at('stroke') - 0.06, 'stroke'],
    [at('heat') - 0.06, 'heat'],
    [mid('heat', 0.66), 'heatNS'],
    [at('crane') - 0.06, 'crane'],
    [at('cousin') - 0.06, 'cousin'],
  ];
  const shotAt = t => { let s = CUTS[0][1]; for (const [t0, k] of CUTS) if (t >= t0) s = k; return s; };
  const cutT = k => { for (const [t0, kk] of CUTS) if (kk === k) return t0; return 0; };

  // the switch in the drawer: [time, closed]
  const TOG = [[at('on') + 0.3, 1], [mid('switch', 0.6), 0], [mid('switch', 0.7), 1], [mid('switch', 0.82), 0], [mid('switch', 0.93), 1],
    [at('off') + 0.15, 0], [mid('reverse', 0.4), 1]];
  const FLIP = at('reverse') + 0.1;          // Cecil turns upside down

  const blackout = E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#000000' }, hud);
  const allHud = [fri, friSub, kwSol, kwCoil, kwNail, scarf, kwAdd, kwBar, kwEM, kwCur, swCard, kwRev, tic, kwMore, kwBig, permCard, isCard,
    kwIronNail, kwDom, kwDom2, kwMagz, kwStroke, kwOneWay, kwHeat, kwHam, demag, kwCraneEM, kwOnOff, kwOff, uses, tagCousin];

  return t => {
    const sh = shotAt(t), t0 = cutT(sh);
    op(blackout, 1 - P(t, at('friday') - 0.3, 0.5, linear));
    allHud.forEach(e => op(e, 0));
    ltSol.set(0);
    // backgrounds
    const DRAWER = { fri: 1, sol: 1, on: 1, switch: 1, off: 1, reverse: 1, tic: 1, more: 1, bigger: 1, iron: 1, steel: 1, heatNS: 1, cousin: 1 };
    op(drawer, DRAWER[sh] ? 1 : 0);
    op(bench, sh === 'wire' || sh === 'domains' || sh === 'stroke' || sh === 'heat' ? 1 : 0);
    conf.set(sh === 'thsol' ? 1 : 0, t);
    op(yardWrap, sh === 'crane' || sh === 'cousin' ? 1 : 0); op(yardFrame, sh === 'cousin' ? 1 : 0);
    const CIRC = sh === 'fri' || sh === 'sol' || sh === 'on' || sh === 'switch' || sh === 'off' || sh === 'reverse';
    op(circ, CIRC ? 1 : 0);
    op(wireShot, sh === 'wire' ? 1 : 0); op(inset, sh === 'thsol' ? 1 : 0);
    op(barG, sh === 'stroke' || sh === 'heat' ? 1 : 0); op(domPanel, sh === 'domains' ? 1 : 0);
    op(doms, sh === 'domains' || sh === 'stroke' || sh === 'heat' ? 1 : 0);
    [strokeMag, strokeArrows, burner, hammer, bonk, bigField, dangle, sticker, woo, poleRings].forEach(e => op(e, 0));
    clips.forEach(c => op(c, 0));
    [cecil, sol, mag, eddie].forEach(c => op(c, 0));
    op(nailHi, 0); op(extraTurns, 0); op(solEd, 0);
    let cam = [600, 375, 1, 600, 375];

    /* ---- the switch / Sol's state for the drawer circuit ---- */
    const st = elState(TOG, t);
    const solOn = st.s ? clamp(st.dt / 0.14) : 1 - clamp(st.dt / 0.12);
    const flipP = P(t, FLIP, 0.5, ease);
    const dir = t >= FLIP + 0.25 ? -1 : 1;
    if (CIRC) {
      sw.set(st.s ? P(st.dt, 0, 0.12, linear) : 1 - P(st.dt, 0, 0.1, linear));
      const flow = st.s && st.dt > 0.1 ? 1 : 0;
      [wA, wB, wC].forEach(w => { w.set(flow); w.upd(t, 70 * dir * AMP + (S.reduce ? 0 : 0)); });
      op(clickT, st.dt < 0.45 && t > TOG[0][0] - 0.01 ? 1 - P(st.dt, 0.15, 0.3, linear) : 0);
      // Cecil in the circuit
      op(cecil, 1); tr(cecil, CEC[0], CEC[1], CEC[2], 180 * flipP);
      const cMood = sh === 'reverse' ? (t > FLIP + 0.6 ? 'annoyed' : 'shock') : 'deadpan';
      cecil.set({ t, talk: scTalk(S, t, 'cecil'), mood: cMood, look: sh === 'reverse' && t > FLIP + 0.6 ? 0 : 0.8 });
      // Sol
      op(sol, 1); tr(sol, SOL[0], SOL[1], SOL[2]);
      let sMood = solOn > 0.5 ? 'smug' : 'sad';
      if (sh === 'on') sMood = solOn > 0.5 ? 'happy' : 'neutral';
      if (sh === 'switch' && t > mid('switch', 0.55)) sMood = solOn > 0.5 ? 'shock' : 'sad';
      if (sh === 'reverse') sMood = solOn > 0.5 ? 'shock' : 'sad';
      sol.set({ t, talk: scTalk(S, t, 'sol'), mood: sMood, look: sh === 'switch' && t < mid('switch', 0.55) ? -0.7 : 0, on: solOn, pole: sh === 'reverse' && t > FLIP + 0.25 ? -1 : 1 });
      // paper clips: fly up to his point when on, clatter down when off
      clips.forEach((c, i) => {
        const [fx, fy, fr] = CLIP_FLOOR[i], [sx, sy, sr] = CLIP_STUCK[i];
        const stg = i * 0.04;
        let q;
        if (st.s) q = t < TOG[0][0] ? 0 : easeOut(clamp((st.dt - stg) / 0.25));
        else q = st.dt > 50 ? 0 : 1 - easeIn(clamp((st.dt - stg * 0.5) / 0.22));
        const bounce = !st.s && st.dt < 50 ? Math.max(0, Math.sin(clamp((st.dt - 0.22 - stg * 0.5) / 0.3) * Math.PI)) * 14 : 0;
        op(c, 1);
        tr(c, lerp(fx, sx, q), lerp(fy, sy, q) - bounce, 1, lerp(fr, sr, q));
      });
    }

    /* ---------------- FRIDAY: the drawer, wide ---------------- */
    if (sh === 'fri') {
      elPop(fri, t, at('friday') + 0.05, 900, 330);
      elPop(friSub, t, mid('friday', 0.5), 900, 410);
      cam = [600, 400, 1 + 0.03 * P(t, 0, at('sol'), linear)];
    }

    /* ---------------- SOL: close on Sol, limp ---------------- */
    if (sh === 'sol') {
      const push = P(t, end('sol') - 0.2, 0.9, linear);
      cam = [640, 400, 1.3 + 0.12 * push, 400, 410];
      ltSol.set(win(t, at('sol') + 0.15, at('sol') + 3.3, 0.3));
      if (t < mid('sol', 0.74)) {
        elPop(kwSol, t, mid('sol', 0.16), 880, 330);
        elPop(kwCoil, t, mid('sol', 0.34), 880, 420);
        elPop(kwNail, t, mid('sol', 0.5), 880, 495);
      } else elPop(scarf, t, mid('sol', 0.76), 880, 420, 1, 4);
    }

    /* ---------------- WIRE: the bench ---------------- */
    if (sh === 'wire') {
      const split = mid('wire', 0.5);
      const a = 1 - P(t, split - 0.1, 0.25, linear), b = P(t, split, 0.3, linear);
      op(wsA, a); op(wsB, b);
      if (a > 0) {
        strW.upd(t, 90 * AMP);
        RING_Y.forEach((y, i) => {
          const p = P(t, mid('wire', 0.1) + i * 0.15, 0.5, pop);
          const s = Math.max(0.01, p);
          const tf = `translate(600 ${y}) scale(${s.toFixed(3)}) translate(-600 ${-y})`;
          ringBack[i].setAttribute('transform', tf); ringFront[i].setAttribute('transform', tf);
          op(ringBack[i], clamp(p * 3) * 0.55); op(ringFront[i], clamp(p * 3));
        });
        op(curLbl, P(t, at('wire'), 0.4, linear));
        elPop(fieldLbl, t, mid('wire', 0.24), 920, 300);
      }
      if (b > 0) {
        coilW.upd(t, 110 * AMP);
        coilField.set(P(t, mid('wire', 0.62), 1.4, linear));
        elPop(coilN, t, mid('wire', 0.86), COIL_X0 - 60, CY - 150);
        elPop(coilS, t, mid('wire', 0.88), xEnd + 60, CY - 150);
        elPop(kwAdd, t, mid('wire', 0.58), 600, 175);
        elPop(kwBar, t, mid('wire', 0.84), 600, 680);
      }
      cam = [600, 400, 1 + 0.03 * P(t, at('wire'), 6, linear)];
    }

    /* ---------------- ON ---------------- */
    if (sh === 'on') {
      elPop(kwCur, t, at('on') + 0.3, 420, 560);
      elPop(kwEM, t, mid('on', 0.66), 960, 330);
      cam = [600, 420, 1.06];
    }

    /* ---------------- THSOL: Cecil's confessional, ON | OFF inset ---------------- */
    if (sh === 'thsol') {
      const push = P(t, end('thsol'), 0.9, linear);
      cam = [380, 420, 1 + 0.12 * push];
      op(cecil, 1); tr(cecil, 380, 420, 1.4);
      cecil.set({ t, talk: scTalk(S, t, 'cecil'), mood: 'deadpan', look: t > mid('thsol', 0.1) && t < mid('thsol', 0.8) ? 0.6 : 0 });
      const pOn = P(t, mid('thsol', 0.08), 0.4, pop);
      op(inset, clamp(pOn * 2)); op(insOn, clamp(pOn * 2)); op(insOff, P(t, mid('thsol', 0.6), 0.3, linear));
      op(sol, clamp(pOn * 2)); tr(sol, 765, 375, 0.6 * Math.max(0.01, 0.6 + 0.4 * pOn));
      sol.set({ t, mood: 'smug', on: 1, look: 0.3 });
    }

    /* ---------------- SWITCH: on, off, on, off, on ---------------- */
    if (sh === 'switch') {
      elPop(swCard, t, mid('switch', 0.2), 900, 200);
      attr(rockTop, 'fill', st.s ? C.good : '#9AA6B2'); attr(rockBot, 'fill', st.s ? '#9AA6B2' : DR_RED);
      setText(rockTxt, st.s ? 'ON' : 'OFF'); attr(rockTxt, 'fill', st.s ? C.good : DR_RED);
      cam = [600, 420, 1.06];
    }

    /* ---------------- OFF: "I'm a nail again." ---------------- */
    if (sh === 'off') {
      const push = P(t, at('off') + 0.3, end('off') + 0.8 - at('off'), easeOut);
      cam = [640, 390, 1.06 + 0.4 * push, lerp(600, 600, push), lerp(395, 400, push)];
    }

    /* ---------------- REVERSE: Cecil upside down, poles swap ---------------- */
    if (sh === 'reverse') {
      elPop(kwRev, t, mid('reverse', 0.5), 935, 330);
      const rp = P(t, mid('reverse', 0.55), 0.4, pop);
      op(poleRings, clamp(rp * 2) * (0.7 + 0.3 * Math.sin(t * 8)));
      tr(ring1, 640, 400 + 196 * 1.05 - 14, Math.max(0.01, rp)); tr(ring2, 640, 400 - 150 * 1.05 - 14, Math.max(0.01, rp));
      cam = [600, 420, 1.06];
    }

    /* ---------------- TIC ---------------- */
    if (sh === 'tic') {
      const lvl = (t > mid('tic', 0.36) ? 1 : 0) + (t > mid('tic', 0.56) ? 1 : 0) + (t > mid('tic', 0.8) ? 1 : 0);
      const lvlS = P(t, mid('tic', 0.36), 0.4) + P(t, mid('tic', 0.56), 0.4) + P(t, mid('tic', 0.8), 0.4);
      op(bigField, clamp(lvlS) * (0.25 + 0.18 * lvlS)); tr(bigField, 320, 400, 0.8 + 0.15 * lvlS);
      op(sol, 1); tr(sol, 320, 400, 1);
      sol.set({ t, talk: scTalk(S, t, 'sol'), mood: lvl >= 2 ? 'happy' : 'smug', look: 0.5, on: 1 });
      op(extraTurns, P(t, mid('tic', 0.38), 0.3, linear));
      op(nailHi, P(t, mid('tic', 0.82), 0.3, linear) * (0.7 + 0.3 * Math.sin(t * 7)));
      elPop(tic, t, at('tic') + 0.1, 860, 380);
      op(ticHead, P(t, mid('tic', 0.22), 0.3, linear));
      [0.36, 0.56, 0.8].forEach((f, i) => { const p = P(t, mid('tic', f), 0.35, easeOut); op(ticRows[i], p); tr(ticRows[i], 30 * (1 - p), 0); });
      ticMeter.set(lvlS / 3);
    }

    /* ---------------- MORE: a flood of Eddies ---------------- */
    if (sh === 'more') {
      op(sol, 1); tr(sol, 400, 390, 1.2);
      sol.set({ t, mood: 'shock', look: 0.6, on: 1 });
      op(solEd, 1);
      // Eddies ride the front turns of the coil (behind his face patch)
      EDS.forEach((e, i) => {
        const u = ((t - at('more')) * 4.2 * (S.reduce ? 0.5 : 1) + i * 1.15) % 12.6;
        const k = Math.floor(u), f = u - k;
        const y0 = -82 + k * 15, x = -72 + 144 * f, y = y0 + 2 * f * (1 - f) * 14;
        op(e, k < 12 ? 1 : 0); tr(e, x, y, 1, Math.sin(t * 6 + i) * 10 * AMP);
      });
      op(eddie, 1); tr(eddie, 960, 470, 0.85);
      eddie.set({ t, talk: scTalk(S, t, 'eddie'), mood: 'happy', look: -0.8 });
      elPop(kwMore, t, mid('more', 0.2), 860, 170);
      op(woo, 1);
      elPop(woo1, t, mid('more', 0.5), 620 + Math.sin(t * 5) * 4, 300);
      elPop(woo2, t, mid('more', 0.8), 640, 520);
    }

    /* ---------------- BIGGER: Cecil puffs up next to Nora & Stan ---------------- */
    if (sh === 'bigger') {
      const puff = P(t, mid('bigger', 0.1), 0.35, pop) * (1 - P(t, mid('bigger', 0.34), 0.3, easeIn));
      op(cecil, 1); tr(cecil, 330, 470, 0.95 * (1 + 0.22 * puff));
      const cm = t > mid('bigger', 0.95) ? 'deadpan' : 'annoyed';
      cecil.set({ t, talk: scTalk(S, t, 'cecil'), mood: puff > 0.5 ? 'smug' : cm, look: t < end('bigger') ? 0.7 : 0, sweat: puff * 0.6 });
      op(mag, 1); tr(mag, 840, 490, 0.95);
      mag.set({ t, mood: t > mid('bigger', 0.4) ? 'annoyed' : 'neutral', moodB: 'deadpan', look: -0.8, lookB: -0.8 });
      op(dangle, P(t, at('bigger') + 0.1, 0.3, linear)); op(qm, P(t, mid('bigger', 0.62), 0.3, linear));
      tr(croc, 660, 360 + Math.sin(t * 2.2) * 4 * AMP, 1, 64 + Math.sin(t * 2.2) * 6 * AMP);
      if (t < mid('bigger', 0.48)) elPop(kwBig, t, mid('bigger', 0.12), 330, 200);
      elPop(permCard, t, mid('bigger', 0.52), 860, 290);
      const push = P(t, end('bigger'), 0.8, linear);
      cam = [lerp(600, 330, push), lerp(375, 430, push), 1 + 0.2 * push];
    }

    /* ---------------- IRON | STEEL ---------------- */
    if (sh === 'iron' || sh === 'steel') {
      const isI = sh === 'iron';
      elPop(isCard, t, t0 + 0.1, 880, 390);
      if (isI) {
        op(sol, 1); tr(sol, 320, 410, 1.05);
        sol.set({ t, mood: 'sad', look: 0.6, on: 0 });
        op(nailHi, P(t, mid('iron', 0.1), 0.3, linear) * (0.75 + 0.25 * Math.sin(t * 6)));
        elPop(kwIronNail, t, mid('iron', 0.12), 320, 190);
        op(colI, 1); op(colS, 0);
        op(colIA, P(t, mid('iron', 0.1), 0.3, linear)); op(colIB, P(t, mid('iron', 0.36), 0.3, linear)); op(colIC, P(t, mid('iron', 0.62), 0.3, linear));
        mI.set(1 - P(t, mid('iron', 0.78), 0.7, easeIn));
        [colSA, colSB, colSC].forEach(e => op(e, 1)); mS.set(1);
      } else {
        op(mag, 1); tr(mag, 320, 420, 1.1);
        mag.set({ t, talk: scTalk(S, t, 'nora'), talkB: scTalk(S, t, 'stan'), mood: 'happy', moodB: t > mid('steel', 0.4) ? 'smug' : 'happy', look: 0.6, lookB: 0.6 });
        op(colI, 0.4); op(colS, 1); mI.set(0);
        [colIA, colIB, colIC].forEach(e => op(e, 1));
        op(colSA, P(t, mid('steel', 0.12), 0.3, linear)); op(colSB, P(t, mid('steel', 0.34), 0.3, linear)); op(colSC, P(t, mid('steel', 0.62), 0.3, linear));
        mS.set(P(t, mid('steel', 0.66), 0.6, easeOut));
      }
    }

    /* ---------------- DOMAINS: inside Nora & Stan ---------------- */
    if (sh === 'domains') {
      op(mag, 1); tr(mag, 600, 230, 0.95);
      mag.set({ t, talk: scTalk(S, t, 'nora'), mood: 'happy', moodB: 'smug', look: 0.2, lookB: -0.3 });
      op(domPanel, P(t, at('domains'), 0.3, linear));
      tr(doms, 600, 510); doms.set(1, 180 + 6 * Math.sin(t * 3) * AMP * 0);
      elPop(kwDom, t, mid('domains', 0.42), 1010, 440);
      elPop(kwDom2, t, mid('domains', 0.66), 600, 680);
    }

    /* ---------------- STROKE: magnetise a steel bar ---------------- */
    if (sh === 'stroke') {
      const s0 = mid('stroke', 0.16), s1 = mid('stroke', 0.86), n = 4, per = (s1 - s0) / n;
      const u = clamp((t - s0) / (s1 - s0)) * n, k = Math.min(n - 1, Math.floor(u)), f = u >= n ? 1 : u - k;
      let mx = 400, my = 286;
      if (t < s0) { mx = 400; my = lerp(196, 286, P(t, at('stroke'), s0 - at('stroke'), ease)); }
      else if (u >= n) { mx = lerp(800, 960, P(t, s1, 0.6, ease)); my = lerp(286, 210, P(t, s1, 0.6, ease)); }
      else if (f < 0.62) { mx = lerp(400, 800, f / 0.62); my = 286; }
      else { const g = (f - 0.62) / 0.38; mx = lerp(800, 400, g); my = 286 - Math.sin(g * Math.PI) * 120 - 10 * (g > 0 ? 1 : 0) * Math.sin(g * Math.PI); }
      op(strokeMag, 1 - P(t, s1 + 0.2, 0.4, linear)); tr(strokeMag, mx, my);
      op(strokeArrows, P(t, mid('stroke', 0.4), 0.4, linear));
      tr(doms, 600, 470);
      const al = clamp((t - s0) / (s1 - s0 + 0.2));
      doms.set(al, 180);
      op(barN, P(t, s1 + 0.1, 0.3, linear)); op(barS, P(t, s1 + 0.1, 0.3, linear)); op(barLbl, 1);
      elPop(kwMagz, t, at('stroke') + 0.1, 1000, 170);
      op(kwStroke, t > s0 ? 1 : 0); tr(kwStroke, 1000, 250);
      setText(kwStroke.label, 'stroke ×' + Math.min(n, k + 1));
      elPop(kwOneWay, t, mid('stroke', 0.4), 600, 700);
    }

    /* ---------------- HEAT: flame, hammer, jumble ---------------- */
    if (sh === 'heat') {
      tr(doms, 600, 470);
      const jum = P(t, mid('heat', 0.12), 1.6, linear);
      doms.set(1 - jum, 180);
      op(barN, 1 - P(t, mid('heat', 0.4), 0.3, linear)); op(barS, 1 - P(t, mid('heat', 0.4), 0.3, linear)); op(barLbl, 0);
      const fOn = win(t, at('heat') + 0.05, mid('heat', 0.3), 0.2);
      op(burner, fOn); tr(burner, 600, 740); burner.set('blue'); burner.upd(t);
      // hammer: pivot at (930, 560), swings down twice
      const h1 = mid('heat', 0.24), h2 = mid('heat', 0.33);
      const sw1 = P(t, h1 - 0.2, 0.2, easeIn) * (1 - P(t, h1, 0.2, easeOut)), sw2 = P(t, h2 - 0.18, 0.18, easeIn);
      const hv = win(t, h1 - 0.35, mid('heat', 0.5), 0.15);
      op(hammer, hv); tr(hammer, 980, 560); tr(hamIn, 0, 0, 1, -15 - 33 * Math.max(sw1, sw2 * (1 - P(t, h2 + 0.1, 0.3, easeOut))));
      const bk = Math.max(win(t, h1, h1 + 0.35, 0.05), win(t, h2, h2 + 0.4, 0.05));
      op(bonk, bk); tr(bonk, 770, 320, 0.9);
      if (t < mid('heat', 0.5)) { elPop(kwHeat, t, mid('heat', 0.06), 250, 680); elPop(kwHam, t, mid('heat', 0.22), 950, 680); }
      else { op(kwHeat, 1); tr(kwHeat, 250, 680); op(kwHam, 1); tr(kwHam, 950, 680); }
      const dp = P(t, mid('heat', 0.48), 0.3, pop);
      op(demag, clamp(dp * 3)); tr(demag, 600, 300, Math.max(0.01, 1.7 - 0.7 * dp), -6);
      op(mag, 1); tr(mag, 960, 190, 0.55);
      mag.set({ t, talk: scTalk(S, t, 'nora'), mood: t < mid('heat', 0.45) ? 'shock' : 'sad', moodB: 'shock', look: -0.7, lookB: -0.7 });
    }
    if (sh === 'heatNS') {
      op(mag, 1); tr(mag, 600, 420, 1.45);
      mag.set({ t, talk: scTalk(S, t, 'nora'), mood: 'annoyed', moodB: 'deadpan', look: 0, lookB: 0 });
      const sp = P(t, mid('heat', 0.8), 0.3, pop);
      op(sticker, clamp(sp * 3)); tr(sticker, 600, 300, Math.max(0.01, 1.6 - 0.6 * sp), -5);
      const push = P(t, end('heat'), 0.8, linear);
      cam = [600, 420, 1 + 0.1 * push];
    }

    /* ---------------- CRANE: the scrapyard ---------------- */
    const yardPose = (tx, cy, on, carX, carY, carR, dp, cp) => {
      tr(trolley, tx, 0);
      attr(cable, 'y2', cy); tr(disc, 0, cy);
      op(discGlow, on * (0.75 + 0.25 * Math.sin(t * 9)));
      tr(car, carX, carY, 1, carR);
      op(dust, dp > 0 && dp < 1 ? 1 - dp : 0); tr(dust, carX, carY, 0.6 + 0.8 * dp);
      op(crash, cp > 0 ? clamp(cp * 3) * (1 - P(cp, 0.6, 0.4, linear)) : 0); tr(crash, carX, carY - 150, Math.max(0.01, 0.6 + 0.4 * clamp(cp * 2)));
    };
    if (sh === 'crane') {
      op(discFace, 0);
      tr(yard, 0, 0);
      const c0 = at('crane');
      const tOn = mid('crane', 0.14), tLiftE = mid('crane', 0.3), tMove = mid('crane', 0.42), tOff = mid('crane', 0.47);
      const lower = P(t, c0, tOn - c0 - 0.1, ease);
      const lift = P(t, tOn + 0.15, tLiftE - tOn - 0.15, ease);
      const move = P(t, tLiftE, tMove - tLiftE, ease);
      const tx = lerp(480, 860, move);
      const discY = lerp(lerp(300, 438, lower), 300, lift);
      const on = t >= tOn && t < tOff ? 1 : 0;
      const fall = P(t, tOff, 0.4, easeIn);
      let carX = 480, carY = 566, carR = 0;
      if (t >= tOn) { carX = tx; carY = discY + 38 + 92; carR = Math.sin(t * 3) * 2 * lift * AMP; }
      if (t >= tOff) { carX = 860; carY = lerp(300 + 130, 482, fall); carR = -9 * fall; }
      const dp = t >= tOff + 0.4 ? P(t, tOff + 0.4, 1.2, easeOut) : 0;
      yardPose(tx, discY, on, carX, carY, carR, dp, t >= tOff + 0.38 ? (t - tOff - 0.38) / 1.2 : 0);
      if (t < mid('crane', 0.58)) {
        if (t < tLiftE) elPop(kwCraneEM, t, mid('crane', 0.04), 720, 330);
        if (on) elPop(kwOnOff, t, tOn, tx - 170, discY + 30);
        else if (t >= tOff) elPop(kwOff, t, tOff, 860 - 170, 330);
      }
      const ub = P(t, mid('crane', 0.56), 0.4, linear);
      op(uses, ub);
      [[useBell, 0.6], [useSpk, 0.7], [useMot, 0.82]].forEach(([e, f]) => { const p = P(t, mid('crane', f), 0.4, pop); op(e, clamp(p * 2)); });
      cam = [600, 375, 1 + 0.02 * P(t, c0, 8, linear)];
    }

    /* ---------------- COUSIN: Sol, smug; the cousin drops a car ---------------- */
    if (sh === 'cousin') {
      op(sol, 1); tr(sol, 300, 410, 1.05);
      const sm = t > mid('cousin', 0.5) ? 'smug' : 'happy';
      sol.set({ t, talk: scTalk(S, t, 'sol'), mood: sm, look: t < mid('cousin', 0.45) ? 0.7 : 0, on: 1 });
      // the inset: the whole yard at 0.42 scale
      const ip = P(t, at('cousin') + 0.05, 0.4, pop);
      const s = 0.42 * Math.max(0.01, 0.6 + 0.4 * ip);
      tr(yardWrap, 860 - 600 * s, 330 - 375 * s, s); op(yardWrap, clamp(ip * 2));
      tr(yardFrame, 860 - 600 * s, 330 - 375 * s, s); op(yardFrame, clamp(ip * 2));
      op(discFace, 1);
      const tOff = mid('cousin', 0.3), fall = P(t, tOff, 0.4, easeIn);
      const on = t < tOff ? 1 : 0;
      const carY = t < tOff ? 300 + 130 : lerp(430, 482, fall);
      const dp = t >= tOff + 0.4 ? P(t, tOff + 0.4, 1.2, easeOut) : 0;
      yardPose(860, 300, on, 860, carY, t < tOff ? Math.sin(t * 3) * 2 * AMP : -9 * fall, dp, t >= tOff + 0.38 ? (t - tOff - 0.38) / 1.2 : 0);
      elPop(tagCousin, t, mid('cousin', 0.12), 860, 560);
      const push = P(t, end('cousin'), 1.2, linear);
      cam = [lerp(600, 300, push), lerp(375, 400, push), 1 + 0.08 * push];
    } else tr(yardWrap, 0, 0);

    elCam(world, cam[0], cam[1], cam[2], cam[3], cam[4]);
  };
});
