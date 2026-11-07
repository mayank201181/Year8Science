/* Chapter 1: Sound is made by vibrations.
   "vibrating" with jittering letters, the sources orbiting it -> a dot vibrating back and forth about a
   fixed position, giving off energy -> a plucked guitar string -> a drum skin -> vocal cords (inset)
   and a hum you can feel -> a loudspeaker cone pushing on the air -> a twanged ruler blurring
   -> a ringing bell, stopped by a finger: marks and meter drop together -> all six sources in a ring:
   vibration is the source of all sound. Vibrations are drawn slowed down, with ghosted extremes. */
scene('vibrate', S => {
  const { at, mid } = S, root = S.root, R = S.reduce;
  const AMP = R ? 0.35 : 1;
  const f1 = v => (+v).toFixed(1);
  const SKIN = '#E8B48E', SKIN_DK = '#B9825A', SKIN_LT = '#F7D9C2';
  const skinFill = (() => { const id = 'sndSkin', g = E('radialGradient', { id, cx: '0.42', cy: '0.38', r: '0.7' }, defs()); E('stop', { offset: 0, 'stop-color': '#F6D2B4' }, g); E('stop', { offset: 0.55, 'stop-color': SKIN }, g); E('stop', { offset: 1, 'stop-color': SKIN_DK }, g); return `url(#${id})`; })();

  /* ---------- small helpers ---------- */
  const dash = (parent, x1, y1, x2, y2) => E('line', { x1, y1, x2, y2, stroke: C.muted, 'stroke-width': 3, 'stroke-dasharray': '10 9', opacity: 0.8 }, parent);
  // two-headed arrow centred on (x, y), total length len; g.set(p) grows it
  function twoWay(parent, x, y, len, color, vertical) {
    const g = G(parent), h = len / 2;
    const a1 = vertical ? arrow(g, x, y - 6, x, y - h, { color, width: 5 }) : arrow(g, x - 6, y, x - h, y, { color, width: 5 });
    const a2 = vertical ? arrow(g, x, y + 6, x, y + h, { color, width: 5 }) : arrow(g, x + 6, y, x + h, y, { color, width: 5 });
    g.set = p => { a1.set(p); a2.set(p); };
    return g;
  }
  // three little zigzag "buzz" marks; g.upd(t)
  function buzz(parent, n, spread) {
    const g = G(parent), zs = [];
    for (let i = 0; i < (n || 3); i++) zs.push(E('path', { d: 'M-12,0 l6,-7 l6,7 l6,-7 l6,7', fill: 'none', stroke: C.energy, 'stroke-width': 3.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g));
    const sp = spread || 34;
    g.upd = t => zs.forEach((z, i) => { const a = -0.9 + i * 0.9; tr(z, Math.cos(a) * sp + AMP * 2 * Math.sin(t * 43 + i * 2), Math.sin(a) * sp + AMP * 2 * Math.cos(t * 37 + i), 1, a * 57.3 + 90); });
    g.upd(0);
    return g;
  }
  // curved vibration marks beside an object: ") ) )" on the right (side 1) or left (side -1); g.upd(t, k)
  function marks(parent, side) {
    const g = G(parent), ms = [];
    for (let i = 0; i < 3; i++) ms.push(E('path', { d: `M0,${-18 - i * 8} Q${side * (10 + i * 3)},0 0,${18 + i * 8}`, fill: 'none', stroke: C.ink, 'stroke-width': 4, 'stroke-linecap': 'round' }, g));
    g.upd = (t, k) => ms.forEach((m, i) => { tr(m, side * (i * 16 + AMP * 3 * Math.sin(t * 40 + i * 1.3)), 0); op(m, k * (0.85 - i * 0.2)); });
    g.upd(0, 1);
    return g;
  }
  // the shared loudspeaker look: dark box, grey cone facing right; g.set(dx) moves the cone in and out
  function speaker(parent, s) {
    const g = G(parent), k = G(g); tr(k, 0, 0, s || 1);
    E('rect', { x: -46, y: -60, width: 56, height: 120, rx: 10, fill: ball('#36505F', '#16242D'), stroke: '#6F8B9B', 'stroke-width': 3 }, k);
    const cone = G(k);
    E('path', { d: 'M8,-24 L44,-58 L44,58 L8,24 Z', fill: linGrad('#7D8E9A', '#C9D5DD'), stroke: '#DCE6EC', 'stroke-width': 3, 'stroke-linejoin': 'round' }, cone);
    E('path', { d: 'M8,-24 Q20,0 8,24', fill: '#5D707C', stroke: '#DCE6EC', 'stroke-width': 2.5 }, cone);
    g.ghost = d => { const gh = E('path', { d: 'M8,-24 L44,-58 L44,58 L8,24', fill: 'none', stroke: '#DCE6EC', 'stroke-width': 2.5, opacity: 0.3, transform: `translate(${d} 0)` }, k); k.insertBefore(gh, cone); return gh; };
    g.set = dx => tr(cone, dx, 0);
    return g;
  }
  // a profile head and shoulders facing right, about 250 x 500, origin at the middle of the head
  const HEAD = closedPath([[0, -175], [60, -160], [98, -115], [108, -62], [103, -44], [128, -2], [106, 14], [112, 30], [103, 42], [110, 54], [100, 82], [76, 102], [56, 114], [60, 142], [54, 172], [56, 232], [-58, 232], [-62, 120], [-96, 66], [-122, -24], [-106, -122], [-60, -166]]);
  const HAIR = closedPath([[-124, -26], [-116, -122], [-62, -182], [22, -192], [88, -152], [106, -110], [76, -124], [30, -146], [-34, -132], [-76, -92], [-98, -24]]);
  function head(parent, s) {
    const g = G(parent), k = G(g); tr(k, 0, 0, s || 1);
    E('path', { d: HEAD, fill: skinFill, stroke: SKIN_LT, 'stroke-width': 3 }, k);
    E('path', { d: HAIR, fill: '#3B2A1E', stroke: '#5C4433', 'stroke-width': 2 }, k);
    E('ellipse', { cx: -30, cy: -16, rx: 15, ry: 25, fill: SKIN, stroke: SKIN_DK, 'stroke-width': 3 }, k);
    E('path', { d: 'M-24,-30 Q-38,-26 -36,-12 Q-34,-2 -26,0', fill: 'none', stroke: SKIN_DK, 'stroke-width': 3, 'stroke-linecap': 'round' }, k);
    E('circle', { cx: 80, cy: -50, r: 6, fill: '#2A1D14' }, k);
    E('path', { d: 'M-150,330 C-150,262 -110,236 -62,224 L62,224 C112,236 150,262 150,330 Z', fill: ball('#5B8DEF', '#2F5DB8'), stroke: '#9DBBF5', 'stroke-width': 3 }, k);
    return g;
  }
  // a classic bell, about 230 x 240, hanging from its crown at (0,-128); origin at the middle of the bell
  const BELL = 'M-30,-112 C-44,-112 -60,-98 -62,-60 C-64,-12 -72,38 -112,70 L112,70 C72,38 64,-12 62,-60 C60,-98 44,-112 30,-112 Z';
  function bell(parent, s) {
    const g = G(parent), k = G(g); tr(k, 0, 0, s || 1);
    E('circle', { cx: 0, cy: -132, r: 16, fill: 'none', stroke: '#B57B12', 'stroke-width': 8 }, k);
    g.clapper = G(k);
    E('line', { x1: 0, y1: -40, x2: 0, y2: 78, stroke: '#6E5520', 'stroke-width': 5 }, g.clapper);
    E('circle', { cx: 0, cy: 86, r: 15, fill: ball('#C9A24A', '#7A5A16') }, g.clapper);
    g.ghostA = E('path', { d: BELL, fill: 'none', stroke: C.glucoseLt, 'stroke-width': 3, opacity: 0.35, transform: 'scale(1.05 1)' }, k);
    g.ghostB = E('path', { d: BELL, fill: 'none', stroke: C.glucoseLt, 'stroke-width': 3, opacity: 0.35, transform: 'scale(0.95 1)' }, k);
    g.body = E('path', { d: BELL, fill: linGrad('#FFE29A', '#C98A1C'), stroke: '#FFE7A8', 'stroke-width': 3, 'stroke-linejoin': 'round' }, k);
    E('ellipse', { cx: 0, cy: 70, rx: 113, ry: 13, fill: '#B57B12', stroke: '#FFE7A8', 'stroke-width': 3 }, k);
    E('path', { d: 'M-40,-84 C-50,-50 -52,0 -70,44', fill: 'none', stroke: '#FFF6D8', 'stroke-width': 7, 'stroke-linecap': 'round', opacity: 0.55 }, k);
    E('path', { d: 'M-48,-20 C-16,-12 16,-12 48,-20', fill: 'none', stroke: '#B57B12', 'stroke-width': 4, opacity: 0.7 }, k);
    return g;
  }
  // a hand with the index finger pointing right; fingertip at (0,0)
  function pointingHand(parent) {
    const g = G(parent);
    E('rect', { x: -244, y: -36, width: 54, height: 98, rx: 12, fill: ball('#5B8DEF', '#2F5DB8') }, g);
    E('path', { d: 'M-200,-24 Q-200,-36 -188,-36 L-118,-30 Q-100,-28 -100,-10 L-100,48 Q-100,64 -116,64 L-188,60 Q-200,60 -200,48 Z', fill: skinFill, stroke: SKIN_LT, 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
    [[12, 30], [28, 46], [44, 62]].forEach(([y0, y1], i) => E('rect', { x: -116 - i * 3, y: y0, width: 44 - i * 4, height: y1 - y0, rx: (y1 - y0) / 2, fill: skinFill, stroke: SKIN_LT, 'stroke-width': 2.5 }, g));
    E('rect', { x: -130, y: -12, width: 130, height: 25, rx: 12.5, fill: skinFill, stroke: SKIN_LT, 'stroke-width': 3 }, g);
    E('path', { d: 'M-160,-34 Q-126,-46 -100,-28 Q-92,-22 -100,-14 L-160,-12 Z', fill: skinFill, stroke: SKIN_LT, 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, g);
    E('path', { d: 'M-20,-7 Q-6,-7 -5,0 Q-6,7 -20,7', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 2.5, opacity: 0.55, 'stroke-linecap': 'round' }, g);
    return g;
  }

  /* ---------- mini icons for the orbit and the ring (each about 150 x 120, centred) ---------- */
  function miniGuitar(parent) {
    const g = G(parent);
    E('ellipse', { cx: 34, cy: 0, rx: 38, ry: 34, fill: linGrad('#E0A257', '#9C5F28', true) }, g);
    E('ellipse', { cx: -4, cy: 0, rx: 28, ry: 25, fill: linGrad('#E0A257', '#9C5F28', true) }, g);
    E('circle', { cx: 12, cy: 0, r: 10, fill: '#2A1A10' }, g);
    E('rect', { x: -78, y: -6, width: 60, height: 12, rx: 3, fill: '#5B3A22' }, g);
    E('rect', { x: -92, y: -9, width: 16, height: 18, rx: 4, fill: '#7A4E2C' }, g);
    const s = E('path', { fill: 'none', stroke: '#F2F7FA', 'stroke-width': 2.5 }, g);
    g.upd = (t, k) => s.setAttribute('d', `M-78,0 Q-14,${f1(9 * k * Math.sin(t * 30))} 50,0`);
    return g;
  }
  function miniDrum(parent) {
    const g = G(parent);
    E('rect', { x: -52, y: -6, width: 104, height: 46, rx: 6, fill: linGrad('#E8424F', '#9C2C3A', true) }, g);
    E('rect', { x: -56, y: -10, width: 112, height: 9, rx: 4, fill: '#C9D6DE' }, g);
    E('rect', { x: -56, y: 36, width: 112, height: 9, rx: 4, fill: '#C9D6DE' }, g);
    E('path', { d: 'M-44,0 L-26,34 L-8,0 L10,34 L28,0 L46,34', fill: 'none', stroke: '#FFE2C8', 'stroke-width': 2.5 }, g);
    const skin = E('path', { fill: 'none', stroke: '#F4ECD8', 'stroke-width': 4, 'stroke-linecap': 'round' }, g);
    E('line', { x1: 8, y1: -16, x2: 64, y2: -58, stroke: '#C98A3E', 'stroke-width': 6, 'stroke-linecap': 'round' }, g);
    g.upd = (t, k) => skin.setAttribute('d', `M-52,-8 Q0,${f1(-8 + 12 * k * Math.sin(t * 34))} 52,-8`);
    return g;
  }
  function miniVoice(parent) {
    const g = G(parent), h = head(g, 0.28); tr(h, -14, -8);
    const bz = buzz(g, 3, 16); tr(bz, 22, 34, 0.7);
    g.upd = (t, k) => { bz.upd(t); op(bz, k); };
    return g;
  }
  function miniSpeaker(parent) {
    const g = G(parent), sp = speaker(g, 0.78); tr(sp, -10, 0);
    g.upd = (t, k) => sp.set(4 * k * Math.sin(t * 28));
    return g;
  }
  function miniRuler(parent) {
    const g = G(parent);
    E('rect', { x: -78, y: 6, width: 82, height: 16, rx: 3, fill: linGrad('#C98A4A', '#8A5A2E', true) }, g);
    E('rect', { x: -70, y: 22, width: 10, height: 38, fill: '#8A5A2E' }, g);
    const fan = [];
    for (let i = 0; i < 3; i++) fan.push(E('path', { fill: 'none', stroke: '#F4D35E', 'stroke-width': 6, 'stroke-linecap': 'round', opacity: 0.3 }, g));
    const rl = E('path', { fill: 'none', stroke: '#F4D35E', 'stroke-width': 7, 'stroke-linecap': 'round' }, g);
    E('rect', { x: -50, y: -1, width: 54, height: 7, rx: 2, fill: '#F4D35E' }, g);
    const shape = y => `M4,2 Q40,2 ${f1(76)},${f1(2 + y)}`;
    g.upd = (t, k) => { rl.setAttribute('d', shape(22 * k * Math.sin(t * 33))); fan.forEach((f, i) => { f.setAttribute('d', shape((i - 1) * 22 * k)); op(f, k * 0.35); }); };
    return g;
  }
  function miniBell(parent) {
    const g = G(parent), b = bell(g, 0.4); tr(b, 0, 6);
    const mL = marks(g, -1), mR = marks(g, 1); tr(mL, -56, 16, 0.6); tr(mR, 56, 16, 0.6);
    g.upd = (t, k) => { tr(b, 0, 6, 1, 3 * k * Math.sin(t * 7)); mL.upd(t, k); mR.upd(t, k); };
    return g;
  }

  /* ================= start: "vibrating", with the sources orbiting ================= */
  const bS = G(root);
  const orbitG = G(bS);
  const minis = [miniGuitar, miniBell, miniSpeaker, miniDrum, miniRuler, miniVoice].map(fn => { const g = G(orbitG); const art = fn(g); return { g, art }; });
  const wordGlow = E('ellipse', { cx: 600, cy: 400, rx: 330, ry: 110, fill: glow(C.energy), opacity: 0.35 }, bS);
  const WORD = 'vibrating', WS = 120, wTot = textWidth(WORD, WS, FD, 700);
  const letters = []; {
    const ws = WORD.split('').map(ch => textWidth(ch, WS, FD, 700)), k = wTot / ws.reduce((a, b) => a + b, 0);
    let x = 600 - wTot / 2;
    WORD.split('').forEach((ch, i) => { const w = ws[i] * k; letters.push({ el: T(bS, 0, 0, ch, { size: WS, weight: 700, anchor: 'middle', fill: C.ink }), x: x + w / 2 }); x += w; });
  }

  /* ================= vibrate: one dot, back and forth about a fixed position ================= */
  const bD = G(root);
  const DX = 600, DY = 420, DA = 82;
  const dRest = dash(bD, DX, DY - 64, DX, DY + 64);
  const dRestLbl = T(bD, DX, DY + 112, 'fixed position', { size: 30, weight: 600, anchor: 'middle', fill: C.muted });
  const dGhosts = [-1, 1].map(s => E('circle', { cx: DX + s * DA, cy: DY, r: 36, fill: 'none', stroke: C.air, 'stroke-width': 3, 'stroke-dasharray': '7 6', opacity: 0.45 }, bD));
  const dTrail = [0, 1, 2, 3].map(i => E('circle', { cx: DX, cy: DY, r: 36, fill: C.air, opacity: 0.1 + i * 0.05 }, bD));
  const dDot = E('circle', { cx: DX, cy: DY, r: 36, fill: ball(C.air, '#4E8FB8') }, bD);
  const dArrow = twoWay(bD, DX, DY - 112, 2 * DA + 90, C.ink);
  const dArrowLbl = T(bD, DX, DY - 140, 'back and forth', { size: 34, weight: 700, anchor: 'middle' });
  const dSparks = [0, 1, 2, 3, 4].map(i => ({ sp: spark(bD, 18, { seed: i + 2 }), ang: -0.34 + (i % 3) * 0.26 + (i > 2 ? 0.12 : 0), ph: i / 5 }));
  const dEnergy = T(bD, 1034, 432, 'energy', { size: 38, weight: 700, anchor: 'middle', fill: C.energy });
  const dChip = chip(bD, 'sound is a form of energy', { size: 30, fill: C.card2, stroke: C.energy });
  tr(dChip, 600, 650);
  // phase of a vibration whose rate ramps from f0 to f1 over `ramp` seconds (pure in t)
  const rampPhase = (u, f0, f1, ramp) => u <= 0 ? 0 : u < ramp ? TAU * (f0 * u + (f1 - f0) * u * u / (2 * ramp)) : TAU * (f0 * ramp + (f1 - f0) * ramp / 2 + f1 * (u - ramp));

  /* ================= string: a plucked guitar string ================= */
  const bG = G(root);
  const NUT = 206, BRIDGE = 960, SY = 420, SL = BRIDGE - NUT;
  E('path', { d: closedPath([[598, 360], [640, 318], [720, 303], [792, 322], [826, 342], [880, 294], [962, 280], [1040, 322], [1074, 420], [1040, 518], [962, 560], [880, 546], [826, 498], [792, 518], [720, 537], [640, 522], [598, 480], [586, 420]]), fill: linGrad('#E0A257', '#9C5F28', true), stroke: '#F2C48A', 'stroke-width': 3 }, bG);
  E('circle', { cx: 800, cy: SY, r: 50, fill: 'none', stroke: '#F2D3A0', 'stroke-width': 6, opacity: 0.7 }, bG);
  E('circle', { cx: 800, cy: SY, r: 40, fill: '#2A1A10' }, bG);
  E('rect', { x: 200, y: SY - 25, width: 410, height: 50, rx: 6, fill: linGrad('#6B4429', '#3E2616', true), stroke: '#8A5E3C', 'stroke-width': 2 }, bG);
  [236, 282, 326, 366, 404, 440, 474, 506, 536, 564, 590].forEach(x => E('line', { x1: x, y1: SY - 25, x2: x, y2: SY + 25, stroke: '#C9D6DE', 'stroke-width': 3, opacity: 0.8 }, bG));
  E('path', { d: `M206,${SY - 30} L140,${SY - 40} Q118,${SY - 40} 118,${SY - 18} L118,${SY + 18} Q118,${SY + 40} 140,${SY + 40} L206,${SY + 30} Z`, fill: linGrad('#7A4E2C', '#4A2E1A', true), stroke: '#8A5E3C', 'stroke-width': 2 }, bG);
  [140, 166, 190].forEach(x => { E('circle', { cx: x, cy: SY - 46, r: 8, fill: '#C9D6DE' }, bG); E('circle', { cx: x, cy: SY + 46, r: 8, fill: '#C9D6DE' }, bG); });
  E('rect', { x: NUT - 5, y: SY - 26, width: 10, height: 52, rx: 3, fill: '#F4ECD8' }, bG);
  E('rect', { x: BRIDGE - 8, y: SY - 30, width: 16, height: 60, rx: 4, fill: '#3E2616', stroke: '#F4ECD8', 'stroke-width': 2 }, bG);
  const gRest = dash(bG, NUT, SY, BRIDGE, SY);
  const gBlur = E('path', { fill: C.ink, opacity: 0.1 }, bG);
  const gGhostA = E('path', { fill: 'none', stroke: C.ink, 'stroke-width': 3, opacity: 0.38 }, bG);
  const gGhostB = E('path', { fill: 'none', stroke: C.ink, 'stroke-width': 3, opacity: 0.38 }, bG);
  const gStr = E('path', { fill: 'none', stroke: '#F8FBFD', 'stroke-width': 5, 'stroke-linecap': 'round' }, bG);
  const gPick = E('path', { d: 'M0,-4 C-16,-4 -18,-26 0,-40 C18,-26 16,-4 0,-4 Z', fill: C.energy, stroke: C.energyLt, 'stroke-width': 2 }, bG);
  const gLbl = labelLine(bG, 380, 268, 420, SY - 8, 'string', { size: 34, fill: C.ink });
  const gFixL = T(bG, NUT, SY + 92, 'fixed end', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  const gFixR = T(bG, BRIDGE, 612, 'fixed end', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  const gFixRl = E('line', { x1: BRIDGE, y1: SY + 36, x2: BRIDGE, y2: 586, stroke: C.muted, 'stroke-width': 2.5 }, bG);
  const strD = fn => { let d = ''; for (let i = 0; i <= 40; i++) { const x = NUT + SL * i / 40; d += (i ? 'L' : 'M') + f1(x) + ',' + f1(SY + fn(i / 40)); } return d; };

  /* ================= drum: a stick hits the skin ================= */
  const bR = G(root);
  const DRX = 600, DRY = 430, DRW = 210;          // skin line at y = DRY, half-width DRW
  E('rect', { x: DRX - DRW, y: DRY, width: 2 * DRW, height: 190, rx: 8, fill: linGrad('#E8424F', '#8E2432', true) }, bR);
  E('path', { d: (() => { let d = ''; for (let i = 0; i <= 8; i++) d += (i ? 'L' : 'M') + (DRX - DRW + 16 + i * (2 * DRW - 32) / 8) + ',' + (i % 2 ? DRY + 170 : DRY + 22); return d; })(), fill: 'none', stroke: '#FFE2C8', 'stroke-width': 4, 'stroke-linejoin': 'round' }, bR);
  E('rect', { x: DRX - DRW - 8, y: DRY - 4, width: 2 * DRW + 16, height: 20, rx: 6, fill: linGrad('#E9F0F5', '#8FA3B1', true) }, bR);
  E('rect', { x: DRX - DRW - 8, y: DRY + 176, width: 2 * DRW + 16, height: 20, rx: 6, fill: linGrad('#E9F0F5', '#8FA3B1', true) }, bR);
  const rRest = dash(bR, DRX - DRW, DRY - 4, DRX + DRW, DRY - 4);
  const rGhostA = E('path', { fill: 'none', stroke: '#F4ECD8', 'stroke-width': 4, opacity: 0.45 }, bR);
  const rGhostB = E('path', { fill: 'none', stroke: '#F4ECD8', 'stroke-width': 4, opacity: 0.45 }, bR);
  const rSkin = E('path', { fill: 'none', stroke: '#F4ECD8', 'stroke-width': 8, 'stroke-linecap': 'round' }, bR);
  const stickG = G(bR);
  const PIV = [930, 236], HIT = [DRX, DRY - 16], STICK = Math.hypot(HIT[0] - PIV[0], HIT[1] - PIV[1]);
  E('line', { x1: 0, y1: 0, x2: -STICK, y2: 0, stroke: '#C98A3E', 'stroke-width': 12, 'stroke-linecap': 'round' }, stickG);
  E('circle', { cx: -STICK, cy: 0, r: 9, fill: '#E9B872' }, stickG);
  E('rect', { x: 24, y: -24, width: 92, height: 48, rx: 12, fill: ball('#5B8DEF', '#2F5DB8') }, stickG);
  E('rect', { x: -28, y: -27, width: 58, height: 54, rx: 20, fill: skinFill, stroke: SKIN_LT, 'stroke-width': 3 }, stickG);
  E('path', { d: 'M-14,-27 L-14,-10 M2,-27 L2,-10 M17,-25 L17,-10', stroke: SKIN_DK, 'stroke-width': 2.5, 'stroke-linecap': 'round' }, stickG);
  const rLbl = labelLine(bR, 300, 330, DRX - 120, DRY - 6, 'skin', { size: 34, fill: C.ink });
  const rHit = G(bR);
  for (let i = 0; i < 6; i++) { const a = -Math.PI + i * Math.PI / 5; E('line', { x1: DRX + Math.cos(a) * 34, y1: DRY - 12 + Math.sin(a) * 24, x2: DRX + Math.cos(a) * 58, y2: DRY - 12 + Math.sin(a) * 40, stroke: C.energy, 'stroke-width': 4, 'stroke-linecap': 'round' }, rHit); }
  const skinD = d => `M${DRX - DRW},${DRY - 4} Q${DRX},${f1(DRY - 4 + 2 * d)} ${DRX + DRW},${DRY - 4}`;

  /* ================= voice: vocal cords, and a hum you can feel ================= */
  const bV = G(root);
  const HX = 300, HY = 372, HS = 0.86;
  const vHead = head(bV, HS); tr(vHead, HX, HY);
  const THX = HX + 58 * HS, THY = HY + 150 * HS;           // the throat (voice box)
  const vThroatGlow = E('circle', { cx: THX - 6, cy: THY, r: 46, fill: glow(C.energy) }, bV);
  const IX = 880, IY = 346, IR = 150;
  const vLead = G(bV);
  {
    const dx = IX - THX, dy = IY - THY, L = Math.hypot(dx, dy), a = Math.atan2(dy, dx), b = Math.asin(IR / L);
    [a + b, a - b].forEach(q => { const tl = Math.sqrt(L * L - IR * IR); E('line', { x1: THX, y1: THY, x2: THX + Math.cos(q) * tl, y2: THY + Math.sin(q) * tl, stroke: C.energy, 'stroke-width': 3, 'stroke-dasharray': '8 7', opacity: 0.8 }, vLead); });
  }
  const vInset = G(bV); tr(vInset, IX, IY);
  const clipId = 'sndInset';
  { const cp = E('clipPath', { id: clipId }, defs()); E('circle', { r: IR - 3 }, cp); }
  E('circle', { r: IR, fill: '#2A0F18' }, vInset);
  const vIn = G(vInset, { 'clip-path': `url(#${clipId})` });
  E('rect', { x: -IR, y: -IR, width: IR - 50, height: 2 * IR, fill: '#B94A62' }, vIn);
  E('rect', { x: 50, y: -IR, width: IR - 50, height: 2 * IR, fill: '#B94A62' }, vIn);
  E('line', { x1: -50, y1: -IR, x2: -50, y2: IR, stroke: '#E37A90', 'stroke-width': 5 }, vIn);
  E('line', { x1: 50, y1: -IR, x2: 50, y2: IR, stroke: '#E37A90', 'stroke-width': 5 }, vIn);
  const vAir = [0, 1, 2, 3, 4, 5].map(i => ({ el: E('circle', { r: 6, fill: C.air, opacity: 0.8 }, vIn), x: [-18, 14, -4, 20, -14, 6][i], ph: i / 6 }));
  const flapD = (side, gap) => { const tip = side * gap; return `M${side * 52},-30 Q${f1(side * 30)},-24 ${f1(tip + side * 4)},-4 Q${f1(tip)},2 ${f1(tip + side * 4)},8 Q${f1(side * 30)},24 ${side * 52},36 Z`; };
  const vGhost = [-1, 1].map(side => [E('path', { d: flapD(side, 6), fill: 'none', stroke: '#FFD0DA', 'stroke-width': 2.5, opacity: 0.4 }, vIn), E('path', { d: flapD(side, 26), fill: 'none', stroke: '#FFD0DA', 'stroke-width': 2.5, opacity: 0.4 }, vIn)]);
  const vFlaps = [-1, 1].map(side => E('path', { fill: ball('#FFC2CE', '#E0768E'), stroke: '#FFE0E6', 'stroke-width': 3, 'stroke-linejoin': 'round' }, vIn));
  E('circle', { r: IR, fill: 'none', stroke: C.energy, 'stroke-width': 5 }, vInset);
  const vLbl = T(bV, IX, IY + IR + 52, 'vocal cords', { size: 36, weight: 700, anchor: 'middle', fill: C.energy });
  const vNote = T(bV, IX, IY + IR + 92, 'two flaps of tissue', { size: 28, weight: 600, anchor: 'middle', fill: C.muted });
  const vHand = G(bV);
  const vHandArt = pointingHand(vHand); tr(vHandArt, 0, 0, '-0.62 0.62', 32);
  const vBuzz = buzz(bV, 3, 40); tr(vBuzz, THX + 4, THY);
  const vSpeak = G(bV);
  [0, 1, 2].forEach(i => E('path', { d: `M0,${-12 - i * 7} Q${8 + i * 3},0 0,${12 + i * 7}`, fill: 'none', stroke: C.air, 'stroke-width': 4, 'stroke-linecap': 'round', transform: `translate(${i * 15} 0)` }, vSpeak));
  tr(vSpeak, HX + 128 * HS, HY + 44 * HS);
  const vHum = T(bV, HX + 150 * HS, HY + 26 * HS, 'mmm', { size: 34, weight: 700, fill: C.ink, font: FD });
  const vFeel = T(bV, 400, 690, 'hum: feel the buzz', { size: 30, weight: 700, anchor: 'middle', fill: C.energy });

  /* ================= speaker: the cone pushes on the air ================= */
  const bK = G(root);
  const KX = 330, KY = 410, KS = 1.75;
  const kSpk = speaker(bK, KS); tr(kSpk, KX, KY);
  kSpk.ghost(-9); kSpk.ghost(9);
  const kParts = [];
  for (let r = 0; r < 5; r++) for (let c = 0; c < 10; c++) kParts.push({ el: E('circle', { cx: 0, cy: 0, r: 9, fill: ball(C.air, '#4E8FB8') }, bK), x: 434 + c * 34, y: KY - 68 + r * 34 });
  const kLbl = labelLine(bK, 470, 232, KX + 30 * KS, KY - 42 * KS, 'cone', { size: 34, fill: C.ink });
  const kArrow = twoWay(bK, KX + 26 * KS, KY + 150, 120, C.ink);
  const kArrowLbl = T(bK, KX + 26 * KS, KY + 200, 'in and out', { size: 30, weight: 700, anchor: 'middle' });
  const kAir = T(bK, 587, KY - 102, 'air', { size: 34, weight: 700, anchor: 'middle', fill: C.air });
  const kPush = arrow(bK, 820, KY, 940, KY, { color: C.air, width: 6 });
  const K_OM = TAU * 4, K_K = TAU / 420;

  /* ================= ruler: twanged over the edge of a desk ================= */
  const bL = G(root);
  const DESK = 610, TOP = 452, RY = TOP - 9, OVER = 350;
  E('rect', { x: 110, y: TOP, width: DESK - 110, height: 34, rx: 5, fill: linGrad('#C98A4A', '#8A5A2E', true), stroke: '#E0A86C', 'stroke-width': 2 }, bL);
  E('rect', { x: 150, y: TOP + 34, width: 30, height: 200, fill: '#7A4E2C' }, bL);
  E('rect', { x: DESK - 70, y: TOP + 34, width: 30, height: 200, fill: '#7A4E2C' }, bL);
  E('rect', { x: 300, y: RY - 9, width: DESK - 300, height: 18, rx: 3, fill: '#F4D35E', stroke: '#B8962A', 'stroke-width': 2 }, bL);
  for (let x = 312; x < DESK; x += 16) E('line', { x1: x, y1: RY - 9, x2: x, y2: RY - ((x - 312) % 80 ? 2 : -4), stroke: '#6B5410', 'stroke-width': 2 }, bL);
  const lFan = [-3, -2, -1, 1, 2, 3].map(k => ({ el: E('path', { fill: 'none', stroke: '#F4D35E', 'stroke-width': 18, 'stroke-linecap': 'round', opacity: 0.12 + Math.abs(k) * 0.04 }, bL), k }));
  const lRuler = E('path', { fill: 'none', stroke: '#F4D35E', 'stroke-width': 18, 'stroke-linecap': 'round' }, bL);
  const lTicks = E('path', { fill: 'none', stroke: '#6B5410', 'stroke-width': 7, 'stroke-dasharray': '2 14' }, bL);
  const lHand = G(bL);
  E('path', { d: 'M-70,0 Q-72,-46 -30,-56 L40,-58 Q74,-56 76,-24 L76,0 Z', fill: ball(SKIN, SKIN_DK), stroke: SKIN_LT, 'stroke-width': 3 }, lHand);
  E('rect', { x: -30, y: -122, width: 56, height: 70, rx: 12, fill: ball('#5B8DEF', '#2F5DB8') }, lHand);
  tr(lHand, 470, RY - 9);
  const lFlick = G(bL);
  E('rect', { x: -15, y: -110, width: 30, height: 112, rx: 15, fill: ball(SKIN, SKIN_DK), stroke: SKIN_LT, 'stroke-width': 3 }, lFlick);
  E('path', { d: 'M-8,-8 Q0,-2 8,-8', fill: 'none', stroke: SKIN_LT, 'stroke-width': 3, 'stroke-linecap': 'round' }, lFlick);
  const lBuzz = buzz(bL, 3, 46);
  const lEdge = labelLine(bL, 720, 640, DESK, TOP + 4, 'edge of the desk', { size: 30, fill: C.ink });
  const lBlur = T(bL, 1000, 290, 'the end blurs', { size: 34, weight: 700, anchor: 'middle', fill: C.energy });
  const rulerD = Y => { let d = `M${DESK},${RY}`; for (let i = 1; i <= 16; i++) { const s = i / 16; d += ` L${f1(DESK + OVER * s)},${f1(RY + Y * s * s * (3 - s) / 2)}`; } return d; };

  /* ================= stop: a ringing bell, stopped by a finger ================= */
  const bB = G(root);
  const BX = 470, BY = 420;
  E('rect', { x: BX - 150, y: BY - 172, width: 300, height: 22, rx: 8, fill: linGrad('#8A5A2E', '#5B3A22', true), stroke: '#B57B4A', 'stroke-width': 2 }, bB);
  const bPivot = G(bB); tr(bPivot, BX, BY - 150);
  const bBell = bell(bPivot, 1); tr(bBell, 0, 150);
  const bMarkL = marks(bB, -1), bMarkR = marks(bB, 1);
  tr(bMarkL, BX - 134, BY + 20); tr(bMarkR, BX + 134, BY + 20);
  const bFinger = G(bB);
  const bFingerArt = pointingHand(bFinger);
  const bTouch = [BX - 64, BY - 52];
  const bPanel = G(bB);
  card(bPanel, -135, -72, 270, 144, { fill: 'rgba(20,54,70,0.88)', stroke: C.line });
  const bpSpk = speaker(bPanel, 0.34); tr(bpSpk, -100, -30);
  T(bPanel, -70, -18, 'sound', { size: 32, weight: 700 });
  const bMeter = meter(bPanel, { w: 196, h: 26, color: C.air }); tr(bMeter, -110, 18);
  tr(bPanel, 920, BY - 10);
  const bChip = chip(bB, 'stop the vibration, and the sound stops', { size: 30, fill: C.card2, stroke: C.good });
  tr(bChip, 600, 676);

  /* ================= source: all six sources around one idea ================= */
  const bC = G(root);
  const cChip = chip(bC, 'vibration: the source of all sound', { size: 36, fill: C.card2, stroke: C.energy, color: C.ink });
  tr(cChip, 600, 404);
  const cNote = T(bC, 600, 486, "even when it's too small or too fast to see", { size: 28, weight: 600, anchor: 'middle', fill: C.muted });
  const RING = [[600, 196], [968, 296], [968, 540], [600, 636], [232, 540], [232, 296]];  // guitar, bell, speaker, drum, ruler, voice
  const lens = G(bC);
  const lensClip = 'sndLens';
  { const cp = E('clipPath', { id: lensClip }, defs()); E('circle', { r: 76 }, cp); }
  const lensIn = G(lens, { 'clip-path': `url(#${lensClip})` });
  E('circle', { r: 78, fill: '#0F2C3A' }, lensIn);
  const lensSpk = speaker(lensIn, 1.12); tr(lensSpk, -2, 0);
  [-9, -6, -3, 3, 6, 9].forEach(d => lensSpk.ghost(d));
  const lensMarks = marks(lensIn, 1); tr(lensMarks, 66, 0, 0.8);
  E('line', { x1: 56, y1: 56, x2: 106, y2: 106, stroke: '#C9D6DE', 'stroke-width': 15, 'stroke-linecap': 'round' }, lens);
  E('circle', { r: 78, fill: 'rgba(159,216,255,0.06)', stroke: '#E4EDF2', 'stroke-width': 8 }, lens);
  E('path', { d: 'M-50,-28 A58,58 0 0 1 -16,-58', stroke: '#ffffff', 'stroke-width': 5, fill: 'none', opacity: 0.5, 'stroke-linecap': 'round' }, lens);

  /* ================= update ================= */
  const beat = (t, a, b) => Math.min(P(t, a - 0.15, 0.35, linear), 1 - P(t, b - 0.35, 0.3, linear));
  return t => {
    t = Math.min(t, S.D);
    const A0 = at('start'), A1 = at('vibrate'), A2 = at('string'), A3 = at('drum'), A4 = at('voice'), A5 = at('speaker'), A6 = at('ruler'), A7 = at('stop'), A8 = at('source');

    /* --- start: the word jitters, the sources orbit --- */
    const aS = beat(t, A0, A1), aC = P(t, A8 - 0.15, 0.35, linear);
    op(bS, Math.max(aS, aC));
    op(wordGlow, aS * 0.35); letters.forEach(l => op(l.el, aS));
    if (aS > 0) {
      const jit = P(t, A0, 0.6, linear) * AMP;
      letters.forEach((l, i) => tr(l.el, l.x + jit * 3.2 * Math.sin(t * 41 + i * 1.9), 440 + jit * 3.2 * Math.cos(t * 37 + i * 2.7), 1, jit * 4 * Math.sin(t * 29 + i)));
      tr(wordGlow, 0, 0);
    }
    if (aS > 0 || aC > 0) {
      // orbit during "start"; a fixed ring for "source"
      const spin = (t - A0) * 0.22 * (R ? 0.3 : 1);
      minis.forEach((m, i) => {
        let x, y, s, o;
        if (aC > 0) {
          const p = P(t, A8 + i * 0.12, 0.5, pop);
          [x, y] = RING[i]; s = Math.max(0.01, 0.6 + 0.4 * p) * 1.05; o = clamp(p * 2);
        } else {
          const a = -Math.PI / 2 + i * TAU / 6 + spin;
          x = 600 + Math.cos(a) * 450; y = 418 + Math.sin(a) * 238; s = 0.9; o = 0.4 * P(t, A0 + 0.1 + i * 0.08, 0.5, linear);
        }
        tr(m.g, x, y, s); op(m.g, o);
        m.art.upd(t + i * 0.37, aC > 0 ? (i === 2 ? 0 : 1) : 0.7);
      });
    }

    /* --- vibrate: a dot, back and forth --- */
    const aD = beat(t, A1, A2);
    op(bD, aD);
    if (aD > 0) {
      const u = t - (A1 + 0.3);
      const ph = rampPhase(u, 1.6, 4.2, 1.8), env = clamp(u / 0.4);
      const xAt = du => { const ph2 = rampPhase(u - du, 1.6, 4.2, 1.8); return DX + DA * env * Math.sin(ph2); };
      attr(dDot, 'cx', DX + DA * env * Math.sin(ph));
      dTrail.forEach((c, i) => { attr(c, 'cx', xAt((4 - i) * 0.018)); op(c, u > 0.4 ? 1 : 0); });
      const pA = P(t, mid('vibrate', 0.27), 0.6);
      dArrow.set(pA); op(dArrow, P(t, mid('vibrate', 0.27), 0.2, linear)); op(dArrowLbl, P(t, mid('vibrate', 0.3), 0.4, linear));
      const pR = P(t, mid('vibrate', 0.47), 0.4, linear);
      op(dRest, pR); op(dRestLbl, pR);
      dGhosts.forEach(g => op(g, P(t, A1 + 0.9, 0.5, linear)));
      const eOn = P(t, mid('vibrate', 0.64), 0.5, linear);
      dSparks.forEach(s => {
        const q = ((t - mid('vibrate', 0.62)) / 1.6 + s.ph) % 1;
        if (eOn <= 0 || t < mid('vibrate', 0.62)) { op(s.sp, 0); return; }
        const d = 60 + easeOut(q) * 170, x0 = DX + DA * env * Math.sin(ph);
        tr(s.sp, x0 + Math.cos(s.ang) * d, DY + Math.sin(s.ang) * d * 0.9, 0.5 + 0.6 * Math.sin(q * Math.PI));
        op(s.sp, eOn * Math.sin(q * Math.PI)); s.sp.upd(t);
      });
      op(dEnergy, P(t, mid('vibrate', 0.72), 0.5, linear));
      const pc = P(t, mid('vibrate', 0.6), 0.6, easeOut); op(dChip, pc); tr(dChip, 600, 650 + (1 - pc) * 16);
    }

    /* --- string: pull, release, vibrate --- */
    const aG = beat(t, A2, A3);
    op(bG, aG);
    if (aG > 0) {
      const tPull = A2 + 0.05, tRel = mid('string', 0.18), PX = 800, sPx = (PX - NUT) / SL;
      let fn, env = 0;
      if (t < tRel) {
        const h = 46 * P(t, tPull, tRel - tPull, easeOut);
        fn = s => -h * (s < sPx ? s / sPx : (1 - s) / (1 - sPx));
        tr(gPick, PX, SY - h + 2, 1); op(gPick, P(t, tPull - 0.1, 0.2, linear));
      } else {
        const u = t - tRel; env = 40 * Math.exp(-u / 3.2);
        const y = -env * Math.cos(TAU * 5.5 * u * (R ? 0.5 : 1));
        fn = s => y * Math.sin(Math.PI * s);
        tr(gPick, PX + 30 * P(u, 0, 0.4, easeOut), SY - 46 - 50 * P(u, 0, 0.4, easeOut)); op(gPick, 1 - P(u, 0.1, 0.3, linear));
      }
      gStr.setAttribute('d', strD(fn));
      const up = strD(s => -env * Math.sin(Math.PI * s)), dn = strD(s => env * Math.sin(Math.PI * s));
      gGhostA.setAttribute('d', up); gGhostB.setAttribute('d', dn);
      gBlur.setAttribute('d', up + ' ' + strD(s => env * Math.sin(Math.PI * (1 - s))).replace('M', 'L') + 'Z');
      op(gGhostA, env > 1 ? 1 : 0); op(gGhostB, env > 1 ? 1 : 0); op(gBlur, env > 1 ? 1 : 0); op(gRest, 0.9);
      gLbl.set(P(t, mid('string', 0.5), 0.4, linear));
      const pf = P(t, mid('string', 0.7), 0.4, linear); op(gFixL, pf); op(gFixR, pf); op(gFixRl, pf);
    }

    /* --- drum: two hits, the skin flexes --- */
    const aR = beat(t, A3, A4);
    op(bR, aR);
    if (aR > 0) {
      const hits = [mid('drum', 0.1), mid('drum', 0.62)];
      let d = 0, env = 0, swing = 0;
      hits.forEach(h => {
        const u = t - h;
        if (u > 0) { const e = 32 * Math.exp(-u / 0.9); d += e * Math.sin(TAU * 6.5 * u * (R ? 0.5 : 1)); env += e; }
        // the stick swings down to the hit, then bounces back up
        swing = Math.max(swing, u < 0 ? (u > -0.22 ? 1 - Math.pow(-u / 0.22, 2) : 0) : Math.max(0, 1 - u / 0.3));
      });
      const ang = (Math.atan2(HIT[1] - PIV[1], HIT[0] - PIV[0]) * 180 / Math.PI) + 24 * (1 - swing);
      tr(stickG, PIV[0], PIV[1], 1, ang + 180);
      rSkin.setAttribute('d', skinD(d)); rGhostA.setAttribute('d', skinD(env)); rGhostB.setAttribute('d', skinD(-env));
      op(rGhostA, env > 1 ? 1 : 0); op(rGhostB, env > 1 ? 1 : 0);
      const hp = Math.max(...hits.map(h => (t > h ? Math.max(0, 1 - (t - h) / 0.3) : 0)));
      op(rHit, hp); tr(rHit, 0, 0);
      rLbl.set(P(t, mid('drum', 0.55), 0.4, linear));
    }

    /* --- voice: the vocal cords vibrate; a hum you can feel --- */
    const aV = beat(t, A4, A5);
    op(bV, aV);
    if (aV > 0) {
      const inset = P(t, mid('voice', 0.14), 0.6, easeOut);
      op(vLead, inset); op(vInset, inset); tr(vInset, IX, IY, Math.max(0.01, 0.7 + 0.3 * inset));
      op(vThroatGlow, 0.5 + 0.4 * wave(t, 0.9));
      const ph = (t - A4) * TAU * 7 * (R ? 0.4 : 1), gap = 6 + 20 * (0.5 + 0.5 * Math.sin(ph));
      vFlaps.forEach((f, k) => f.setAttribute('d', flapD(k ? 1 : -1, gap)));
      vAir.forEach(a => { const q = ((t * 0.55) + a.ph) % 1; attr(a.el, 'cx', a.x * (Math.abs(1 - 2 * q) * 0.8 + 0.2)); attr(a.el, 'cy', IR - q * 2 * IR); });
      op(vLbl, P(t, mid('voice', 0.24), 0.4, linear));
      op(vNote, P(t, mid('voice', 0.42), 0.4, linear));
      const hp = P(t, mid('voice', 0.66), 0.7, easeOut);
      op(vHand, clamp(hp * 3));
      tr(vHand, THX + 4 + (1 - hp) * 130, THY + 12 + (1 - hp) * 80);
      const touch = P(t, mid('voice', 0.66) + 0.6, 0.3, linear);
      vBuzz.upd(t); op(vBuzz, touch);
      op(vHum, P(t, mid('voice', 0.66), 0.4, linear)); tr(vHum, AMP * 1.5 * Math.sin(t * 40), 0);
      op(vSpeak, win(t, A4 + 0.1, mid('voice', 0.6), 0.3) * (0.55 + 0.45 * wave(t, 0.45)));
      op(vFeel, P(t, mid('voice', 0.86), 0.4, linear));
    }

    /* --- speaker: the cone moves in and out and pushes the air --- */
    const aK = beat(t, A5, A6);
    op(bK, aK);
    if (aK > 0) {
      const on = P(t, A5, 0.4, linear), w = t * (R ? 0.4 : 1);
      kSpk.set(9 * on * Math.sin(K_OM * w));
      kParts.forEach(p => { const u = 8 * on * Math.sin(K_OM * w - K_K * (p.x - (KX + 44 * KS))); attr(p.el, 'cx', p.x + u); attr(p.el, 'cy', p.y); });
      kLbl.set(P(t, mid('speaker', 0.12), 0.4, linear));
      kArrow.set(P(t, mid('speaker', 0.36), 0.5)); op(kArrow, P(t, mid('speaker', 0.36), 0.2, linear)); op(kArrowLbl, P(t, mid('speaker', 0.42), 0.4, linear));
      op(kAir, P(t, mid('speaker', 0.74), 0.4, linear));
      kPush.set(P(t, mid('speaker', 0.72), 0.6)); op(kPush, P(t, mid('speaker', 0.72), 0.2, linear));
    }

    /* --- ruler: flick, then the end blurs --- */
    const aL = beat(t, A6, A7);
    op(bL, aL);
    if (aL > 0) {
      const tDn = A6 + 0.1, tRel = mid('ruler', 0.16);
      let Y, env = 0;
      if (t < tRel) Y = 70 * P(t, tDn, tRel - tDn, easeOut);
      else { const u = t - tRel; env = 74 * Math.exp(-u / 5); Y = env * Math.cos(TAU * 6 * u * (R ? 0.5 : 1)); }
      lRuler.setAttribute('d', rulerD(Y)); lTicks.setAttribute('d', rulerD(Y));
      const fanOn = P(t, mid('ruler', 0.5), 0.8, linear);
      lFan.forEach(f => { f.el.setAttribute('d', rulerD(env * f.k / 3)); op(f.el, fanOn * (0.12 + Math.abs(f.k) * 0.05)); });
      const tipY = RY + Y;
      tr(lFlick, DESK + OVER - 16, tipY - 10, 1); op(lFlick, (t < tRel ? P(t, tDn - 0.2, 0.2, linear) : 1 - P(t, tRel, 0.25, linear)));
      tr(lBuzz, DESK + OVER + 40, RY); lBuzz.upd(t); op(lBuzz, fanOn);
      lEdge.set(P(t, mid('ruler', 0.24), 0.4, linear));
      op(lBlur, P(t, mid('ruler', 0.72), 0.4, linear));
    }

    /* --- stop: the bell rings; a finger presses it; marks and meter drop together --- */
    const aB = beat(t, A7, A8);
    op(bB, aB);
    if (aB > 0) {
      const tT = mid('stop', 0.44);
      const ring = t < tT ? 1 : Math.exp(-(t - tT) / 0.16);
      const sway = 5 * ring * Math.sin(TAU * 1.3 * t) * AMP;
      tr(bPivot, BX, BY - 150, 1, sway);
      bBell.clapper.setAttribute('transform', `rotate(${(-2.2 * sway).toFixed(2)} 0 -40)`);
      const vib = ring * (0.5 + 0.5 * Math.sin(t * 52));
      bBell.ghostA.setAttribute('transform', `scale(${(1 + 0.05 * ring).toFixed(3)} 1)`);
      bBell.ghostB.setAttribute('transform', `scale(${(1 - 0.05 * ring).toFixed(3)} 1)`);
      op(bBell.ghostA, ring > 0.03 ? 1 : 0); op(bBell.ghostB, ring > 0.03 ? 1 : 0);
      bBell.body.setAttribute('transform', `scale(${(1 + 0.025 * ring * Math.sin(t * 52)).toFixed(4)} 1)`);
      bMarkL.upd(t, ring); bMarkR.upd(t, ring);
      bMeter.set(ring < 0.02 ? 0 : ring * (0.84 + 0.06 * vib));
      // the finger comes in from the left and presses the bell's side
      const fp = P(t, mid('stop', 0.16), tT - mid('stop', 0.16), easeOut);
      const press = t > tT ? 6 * P(t, tT, 0.2, easeOut) : 0;
      const back = 1 - fp + 0, ca = Math.cos(0.38), sa = Math.sin(0.38);
      tr(bFinger, bTouch[0] - back * 330 * ca + press * ca, bTouch[1] - back * 330 * sa + press * sa, 1, 22);
      op(bFinger, P(t, mid('stop', 0.12), 0.3, linear));
      const pc = P(t, mid('stop', 0.72), 0.5, easeOut); op(bChip, pc); tr(bChip, 600, 676 + (1 - pc) * 14);
    }

    /* --- source: the ring, the idea, the magnifier --- */
    op(bC, aC);
    if (aC > 0) {
      const pc = P(t, mid('source', 0.2), 0.6, pop); op(cChip, clamp(pc * 2)); tr(cChip, 600, 404, Math.max(0.01, 0.85 + 0.15 * pc));
      op(cNote, P(t, mid('source', 0.58), 0.5, linear));
      const pl = P(t, mid('source', 0.56), 0.9, easeOut);
      op(lens, clamp(pl * 2));
      tr(lens, lerp(1100, RING[2][0] - 2, pl), lerp(720, RING[2][1], pl));
      lensSpk.set(8 * Math.sin(t * 50)); lensMarks.upd(t, 1);
    }
  };
});
