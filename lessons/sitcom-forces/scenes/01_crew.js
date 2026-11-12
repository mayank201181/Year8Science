/* Scene 1: The morning briefing.
   Shots (hard sitcom cuts): the old flat before dawn, FORCE-CAM on, the crew filing onto the coffee table,
   Rex at a site whiteboard -> RULE 1 (push or pull: Pushpa pushes a box, Tess pulls it) -> RULE 2 (FORCE-CAM
   off: the box slides by itself; on: Pushpa was pushing) -> board close-up: start, speed up, slow down,
   direction, shape -> Pushpa bursts in (her practice door) -> Rex's confessional (energy: different episode)
   -> newtons: an apple on a newtonmeter, 1 N -> force arrows 5 N and 10 N -> CONTACT | NON-CONTACT columns
   -> Frieda (friction), Norm under the table (normal force, at right angles), Tess holding a box (tension)
   -> non-contact: Graham (gravity, weight) at his remote desk, cousins magnetic and electrostatic
   -> Rex's confessional (towards the centre of the Earth; clingy) -> upthrust has the day off. */
scene('crew', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;
  const K = SC_INK;

  /* ---------- local helpers (prefixed crw) ---------- */
  const on = (t, a, b) => (t >= a && t < b ? 1 : 0);                       // hard sitcom cut
  // camera: world point (fx, fy) lands on screen point (sx, sy) at zoom k
  const crwFocus = (el, k, fx, fy, sx, sy) => el.setAttribute('transform', `translate(${(sx - k * fx).toFixed(1)} ${(sy - k * fy).toFixed(1)}) scale(${k.toFixed(4)})`);
  const crwPop = (el, t, t0, x, y, s, r) => { const p = P(t, t0, 0.4, pop); op(el, clamp(p * 2.5)); tr(el, x, y, Math.max(0.01, (s || 1) * (0.6 + 0.4 * p)), r); return p; };
  const crwPill = (parent, text, o) => { o = o || {}; return chip(parent, text, { size: o.size || 30, fill: o.fill || 'rgba(10,27,39,0.9)', stroke: o.stroke || C.line, sw: o.sw || 2, color: o.color || C.ink, weight: o.weight || 700 }); };
  const crwKey = (parent, text, col, ink) => chip(parent, text, { size: 46, fill: col, color: ink || '#1A1020', stroke: '#FFFFFF', sw: 4, weight: 800 });
  // a hop (or n little hops) from a to b
  const crwHop = (t, t0, dur, a, b, h, n) => {
    const p = clamp((t - t0) / dur), e = ease(p);
    return [lerp(a[0], b[0], e), lerp(a[1], b[1], e) - (h === undefined ? 50 : h) * Math.abs(Math.sin(Math.PI * p * (n || 1)))];
  };
  function crwForceCam(parent) {
    const g = G(parent), onG = G(g), offG = G(g);
    E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#19E68C', opacity: 0.1 }, onG);
    let scan = ''; for (let y = 3; y < 750; y += 7) scan += `M0,${y} L1200,${y} `;
    E('path', { d: scan, stroke: '#0A2A1A', 'stroke-width': 2, opacity: 0.18 }, onG);
    E('path', { d: 'M40,150 L40,40 L150,40 M1050,40 L1160,40 L1160,150 M1160,600 L1160,710 L1050,710 M150,710 L40,710 L40,600', fill: 'none', stroke: '#7CFFC0', 'stroke-width': 5 }, onG);
    E('rect', { x: 900, y: 58, width: 250, height: 56, rx: 12, fill: 'rgba(6,24,16,0.85)' }, onG);
    const dot = E('circle', { cx: 926, cy: 86, r: 10, fill: '#FF3B3B' }, onG);
    T(onG, 946, 98, 'FORCE-CAM', { size: 34, weight: 800, fill: '#7CFFC0' });
    E('rect', { x: 900, y: 58, width: 250, height: 56, rx: 12, fill: 'rgba(30,30,30,0.8)' }, offG);
    T(offG, 1025, 96, 'FORCE-CAM OFF', { size: 26, weight: 800, anchor: 'middle', fill: '#C9D3DC' });
    g.set = (state, t) => { op(onG, state > 0 ? 1 : 0); op(offG, state < 0 ? 1 : 0); if (state > 0) op(dot, Math.sin(t * TAU * 0.8) > 0 ? 1 : 0.2); };
    return g;
  }
  function crwFrame(parent, w, h) {                 // inset picture frame for the confessionals
    const g = G(parent);
    E('rect', { x: -w / 2 - 10, y: -h / 2 - 10, width: w + 20, height: h + 20, rx: 14, fill: '#F2F7FA' }, g);
    E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: 8, fill: linGrad('#1B2B3B', '#2D4256', true) }, g);
    E('rect', { x: -w / 2, y: h / 2 - 48, width: w, height: 48, fill: '#6B4A33' }, g);
    return g;
  }

  /* ---------- layers ---------- */
  const cam = G(root);            // everything filmed: the camera moves this group
  const Cbg = G(cam), Ubg = G(cam), conf = ppConf(cam, 'rex'), Wset = G(cam), Cprops = G(cam), Lcast = G(cam), Lfg = G(cam);
  const Lscr = G(root), Lhud = G(root);

  /* ================= close-up backdrop (night room, table edge) ================= */
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#1C2B3A', '#33485A', true) }, Cbg);
  { const rb = rng(7); for (let i = 0; i < 4; i++) E('circle', { cx: 80 + rb() * 1040, cy: 90 + rb() * 420, r: 30 + rb() * 60, fill: '#FFE2A8', opacity: 0.05 + rb() * 0.06 }, Cbg); }
  E('rect', { x: 0, y: 640, width: 1200, height: 110, fill: linGrad('#7A5236', '#4A2F1E', true) }, Cbg);
  E('rect', { x: 0, y: 640, width: 1200, height: 8, fill: '#9A6C48' }, Cbg);

  /* ================= under the coffee table (Norm) ================= */
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#141C26', '#26333F', true) }, Ubg);
  E('rect', { x: 0, y: 632, width: 1200, height: 118, fill: linGrad('#B9A27E', '#8E7856', true) }, Ubg);
  E('path', { d: 'M0,672 L1200,672 M0,716 L1200,716 M200,632 L120,750 M480,632 L450,750 M760,632 L780,750 M1040,632 L1110,750', stroke: '#7C6848', 'stroke-width': 3 }, Ubg);
  E('rect', { x: 190, y: 372, width: 36, height: 264, fill: '#4A2F1E', stroke: K, 'stroke-width': 4 }, Ubg);
  E('rect', { x: 974, y: 372, width: 36, height: 264, fill: '#4A2F1E', stroke: K, 'stroke-width': 4 }, Ubg);
  E('rect', { x: 150, y: 318, width: 900, height: 62, rx: 8, fill: linGrad('#6A4630', '#3C2616', true), stroke: K, 'stroke-width': 5 }, Ubg);
  T(Ubg, 1030, 359, 'COFFEE TABLE (underneath)', { size: 26, weight: 700, anchor: 'end', fill: '#B08A68', font: FB });

  /* ================= the wide: the old flat before dawn ================= */
  const flatG = G(Wset), flat = ppFlat(flatG);
  tr(flatG, -300, -230, 1.5); flat.night(0.8);
  E('ellipse', { cx: 760, cy: 380, rx: 640, ry: 360, fill: glow('#FFE2A8'), opacity: 0.3 }, Wset);   // work lamp
  const clockG = G(Wset); tr(clockG, 300, 240);
  E('circle', { r: 58, fill: '#F4F1EA', stroke: K, 'stroke-width': 5 }, clockG);
  E('path', { d: 'M0,-48 L0,-40 M48,0 L40,0 M0,48 L0,40 M-48,0 L-40,0 M0,0 L0,-40 M0,0 L-15,26', stroke: K, 'stroke-width': 5, 'stroke-linecap': 'round' }, clockG);   // 7:00
  const wbG = G(Wset), wb = ppWhiteboard(wbG, 600, 340); tr(wb, 860, 280);
  E('path', { d: 'M580,540 L567,604 M1140,540 L1153,604', stroke: '#9AA6B2', 'stroke-width': 8, 'stroke-linecap': 'round' }, wbG);
  E('rect', { x: 0, y: 596, width: 1200, height: 154, fill: linGrad('#7A5236', '#4A2F1E', true) }, Wset);   // coffee table top
  E('rect', { x: 0, y: 596, width: 1200, height: 8, fill: '#A87A52' }, Wset);
  E('path', { d: 'M0,640 Q300,630 600,646 T1200,640 M0,700 Q400,690 800,706 T1200,698', fill: 'none', stroke: '#5E3D27', 'stroke-width': 3, opacity: 0.6 }, Wset);

  // the board pages (board centre at world 860, 280; board spans -300..300 x -170..170)
  const B = G(wbG); tr(B, 860, 280);
  const under = (g, w, y) => E('line', { x1: -w, x2: w, y1: y, y2: y, stroke: '#E8424F', 'stroke-width': 5, 'stroke-linecap': 'round' }, g);
  // RULE 1
  const pR1 = G(B);
  T(pR1, 0, -105, 'RULE 1', { size: 46, weight: 800, anchor: 'middle', fill: K }); under(pR1, 80, -88);
  const r1a = T(pR1, -130, 10, 'PUSH', { size: 66, weight: 800, anchor: 'middle', fill: ppCol.pushDk });
  const r1b = T(pR1, 0, 10, 'or', { size: 40, weight: 700, anchor: 'middle', fill: K });
  const r1c = T(pR1, 130, 10, 'PULL', { size: 66, weight: 800, anchor: 'middle', fill: ppCol.tensionDk });
  const r1d = T(pR1, 0, 110, '= a FORCE', { size: 54, weight: 800, anchor: 'middle', fill: K });
  // RULE 2
  const pR2 = G(B);
  T(pR2, 0, -105, 'RULE 2', { size: 46, weight: 800, anchor: 'middle', fill: K }); under(pR2, 80, -88);
  const r2a = T(pR2, 0, -10, 'you can’t SEE a force,', { size: 40, weight: 700, anchor: 'middle', fill: K });
  const r2b = T(pR2, 0, 80, 'only what it **DOES**', { size: 46, weight: 700, anchor: 'middle', fill: K, boldFill: ppCol.pushDk });
  // WHAT FORCES DO (filmed in close-up, zoom 1.45)
  const pDo = G(B);
  T(pDo, 0, -122, 'A FORCE CAN MAKE THINGS…', { size: 26, weight: 800, anchor: 'middle', fill: K });
  const DO = ['START', 'SPEED UP', 'SLOW DOWN', 'DIRECTION', 'SHAPE'].map((lab, i) => {
    const g = G(pDo), x = -240 + i * 120; tr(g, x, -38);
    E('rect', { x: -54, y: -44, width: 108, height: 88, rx: 12, fill: '#EEF3F7', stroke: '#B9C6D2', 'stroke-width': 3 }, g);
    const art = G(g);
    T(g, 0, 74, lab, { size: 19, weight: 800, anchor: 'middle', fill: K });
    const ini = T(pDo, x, 108, lab[0], { size: 36, weight: 800, anchor: 'middle', fill: ['#E8424F', '#E8424F', '#E8424F', '#3F5BD9', '#E8424F'][i] });
    return { g, art, ini, x };
  });
  const doBox = E('rect', { x: -16, y: -12, width: 32, height: 24, rx: 4, fill: '#C99A5E', stroke: '#8C6235', 'stroke-width': 3 }, DO[0].art);
  const doLines = E('path', { d: 'M-30,-6 L-44,-6 M-30,6 L-48,6', stroke: '#7A8A99', 'stroke-width': 4, 'stroke-linecap': 'round' }, DO[0].art);
  E('path', { d: 'M-40,4 h0.1 M-28,4 h0.1 M-12,4 h0.1 M10,4 h0.1 M38,4 h0.1', stroke: ppCol.pushDk, 'stroke-width': 13, 'stroke-linecap': 'round' }, DO[1].art);
  E('path', { d: 'M-36,-18 L30,-18 M22,-25 L32,-18 L22,-11', fill: 'none', stroke: K, 'stroke-width': 3.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, DO[1].art);
  E('path', { d: 'M-40,4 h0.1 M-12,4 h0.1 M10,4 h0.1 M26,4 h0.1 M36,4 h0.1', stroke: ppCol.frictionDk, 'stroke-width': 13, 'stroke-linecap': 'round' }, DO[2].art);
  E('path', { d: 'M-34,24 L-4,24 M-30,30 L0,30', stroke: '#555', 'stroke-width': 3, 'stroke-linecap': 'round' }, DO[2].art);   // skid
  E('path', { d: 'M-36,22 Q-30,-26 20,-22', fill: 'none', stroke: '#3F5BD9', 'stroke-width': 7, 'stroke-linecap': 'round' }, DO[3].art);
  E('path', { d: 'M14,-34 L34,-21 L14,-8 Z', fill: '#3F5BD9' }, DO[3].art);
  const doCush = E('ellipse', { cx: 0, cy: 12, rx: 34, ry: 18, fill: '#FFC247', stroke: K, 'stroke-width': 3 }, DO[4].art);
  const doPress = E('path', { d: 'M0,-40 L0,-16 M-8,-24 L0,-14 L8,-24', fill: 'none', stroke: ppCol.pushDk, 'stroke-width': 5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, DO[4].art);
  const doUnder = E('line', { x1: -270, x2: -270, y1: 122, y2: 122, stroke: K, 'stroke-width': 5, 'stroke-linecap': 'round' }, pDo);
  // ARROWS: 24 px per newton, so 10 N is twice as long as 5 N
  const pAr = G(B);
  T(pAr, 0, -118, 'ON PAPER: ARROWS', { size: 40, weight: 800, anchor: 'middle', fill: K }); under(pAr, 150, -102);
  const a5 = ppForce(pAr, { color: ppCol.push, dir: 'right', label: '', width: 20 }); tr(a5, -230, -42);
  const a5t = T(pAr, -230 + 120 + 16, -30, '5 N', { size: 38, weight: 800, fill: K });
  const a10 = ppForce(pAr, { color: ppCol.push, dir: 'right', label: '', width: 20 }); tr(a10, -230, 38);
  const a10t = T(pAr, -230 + 240 + 16, 50, '10 N', { size: 38, weight: 800, fill: K });
  const a5ring = E('circle', { cx: -110 - 8, cy: -42, r: 34, fill: 'none', stroke: '#E8424F', 'stroke-width': 4 }, pAr);
  const arT1 = T(pAr, 0, 112, 'the arrow points the way the force acts', { size: 26, weight: 700, anchor: 'middle', fill: K });
  const arT2 = T(pAr, 0, 155, 'longer arrow = bigger force', { size: 34, weight: 800, anchor: 'middle', fill: ppCol.pushDk });
  // CONTACT | NON-CONTACT
  const pCo = G(B);
  const coHi = E('rect', { x: -292, y: -162, width: 286, height: 324, rx: 10, fill: '#FFE9B8' }, pCo);
  const ncHi = E('rect', { x: 6, y: -162, width: 286, height: 324, rx: 10, fill: '#DCE0FF' }, pCo);
  E('line', { x1: 0, x2: 0, y1: -160, y2: 160, stroke: K, 'stroke-width': 4 }, pCo);
  const coHead = G(pCo), ncHead = G(pCo);
  T(coHead, -150, -116, 'CONTACT', { size: 40, weight: 800, anchor: 'middle', fill: K });
  T(coHead, -150, -80, '(touching)', { size: 26, weight: 600, anchor: 'middle', fill: '#4A5560', font: FB });
  T(ncHead, 150, -116, 'NON-CONTACT', { size: 38, weight: 800, anchor: 'middle', fill: K });
  T(ncHead, 150, -80, '(at a distance)', { size: 26, weight: 600, anchor: 'middle', fill: '#4A5560', font: FB });
  const coChips = [['friction', ppCol.friction], ['normal force', ppCol.normal], ['tension', ppCol.tension]].map(([s, c], i) => {
    const ch = chip(pCo, s, { size: 28, fill: c, color: '#1A1020', stroke: K, sw: 2.5 }); tr(ch, -150, -36 + i * 48); return ch;
  });
  const ncChips = [['gravity → weight', ppCol.weight], ['magnetic', '#FF8A8A'], ['electrostatic', '#BFE6FF']].map(([s, c], i) => {
    const ch = chip(pCo, s, { size: 26, fill: c, color: '#1A1020', stroke: K, sw: 2.5 }); tr(ch, 150, -36 + i * 48); return ch;
  });
  const upMag = G(pCo);
  E('rect', { x: -130, y: -30, width: 260, height: 60, rx: 10, fill: C.water, stroke: K, 'stroke-width': 3 }, upMag);
  E('circle', { cx: -112, cy: -14, r: 6, fill: '#B9C2CB', stroke: K, 'stroke-width': 2 }, upMag);
  T(upMag, 6, 12, 'UPTHRUST', { size: 36, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  const dayOff = G(pCo);
  E('rect', { x: -70, y: -38, width: 140, height: 76, fill: '#FFE45C', stroke: '#C9A800', 'stroke-width': 2 }, dayOff);
  T(dayOff, 0, 12, 'DAY OFF', { size: 30, weight: 800, anchor: 'middle', fill: '#C62828' });

  // the demo box on the table, its string and arrows
  const dBox = ppBox(Wset, '', {});
  const dString = E('line', { stroke: '#E9E2D0', 'stroke-width': 4 }, Wset);
  const dPush = ppForce(Wset, { color: ppCol.push, dir: 'right', label: 'push', size: 28, width: 18 });
  const dPull = ppForce(Wset, { color: ppCol.tension, dir: 'right', label: 'pull', size: 28, width: 18 });

  /* ================= close-up props ================= */
  const inset = crwFrame(Cprops, 340, 250);
  const door = ppDoor(Cprops);
  const creak = T(Cprops, 0, 0, 'creak!', { size: 30, weight: 800, fill: '#FFE6B0', anchor: 'middle' });
  // newtonmeter with an apple
  const nmRope = E('line', { x1: 600, y1: 0, x2: 600, y2: 98, stroke: '#9AA6B2', 'stroke-width': 4 }, Cprops);
  const nm = ppNewtonmeter(Cprops, { max: 5, step: 1 });
  const apple = G(Cprops);
  E('path', { d: 'M0,-30 L0,-44', stroke: '#6B4A33', 'stroke-width': 5, 'stroke-linecap': 'round' }, apple);
  E('path', { d: 'M-2,-28 C-34,-40 -40,0 -24,20 C-12,34 12,34 24,20 C40,0 34,-40 2,-28 Z', fill: ball('#FF5C5C', '#B3202A'), stroke: K, 'stroke-width': 3 }, apple);
  E('path', { d: 'M2,-38 Q18,-50 26,-38 Q14,-32 2,-38 Z', fill: '#4CB866', stroke: K, 'stroke-width': 2 }, apple);
  // the MISC box: Frieda's scrub, Tess's load, Graham's remote pull, Graham's hug
  const mBox = ppBox(Cprops, 'MISC', { size: 30 });
  const mRope = E('line', { stroke: '#E9E2D0', 'stroke-width': 5 }, Cprops);
  const grit = G(Cprops);
  const grits = [0, 1, 2, 3].map(() => E('circle', { r: 6, fill: '#8A5A2B' }, grit));
  // Norm's normal force: at right angles to the table top
  const nArrow = ppForce(Cprops, { color: ppCol.normal, dir: 'up', label: '', width: 24 }); tr(nArrow, 600, 378);
  const nSquare = E('path', { d: 'M618,378 L618,352 L644,352', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 4 }, Cprops);
  // Tess: rope to the ceiling and the sun
  const tRope = E('line', { x1: 600, y1: 0, x2: 600, y2: 120, stroke: '#E9E2D0', 'stroke-width': 5 }, Cprops);
  const tArrow = ppForce(Cprops, { color: ppCol.tension, dir: 'up', label: 'tension', size: 30, side: 'right', width: 22 });
  const sunG = G(Cprops); tr(sunG, 960, 200);
  E('circle', { r: 86, fill: glow('#FFD24A') }, sunG);
  let rays = ''; for (let i = 0; i < 12; i++) { const a = i * TAU / 12; rays += `M${(Math.cos(a) * 46).toFixed(1)},${(Math.sin(a) * 46).toFixed(1)} L${(Math.cos(a) * 64).toFixed(1)},${(Math.sin(a) * 64).toFixed(1)} `; }
  const sunRays = E('path', { d: rays, stroke: '#FFD24A', 'stroke-width': 7, 'stroke-linecap': 'round' }, sunG);
  E('circle', { r: 38, fill: ball('#FFE066', '#F5A300') }, sunG);
  // Graham's remote desk
  const desk = G(Cprops);
  E('rect', { x: 240, y: 512, width: 380, height: 22, rx: 6, fill: '#B07A45', stroke: K, 'stroke-width': 4 }, desk);
  E('rect', { x: 258, y: 534, width: 344, height: 108, fill: '#8C5E33', stroke: K, 'stroke-width': 4 }, desk);
  T(desk, 430, 600, 'WORKING REMOTELY', { size: 26, weight: 800, anchor: 'middle', fill: '#FFE6B0' });
  E('path', { d: 'M248,512 L262,452 L372,452 L384,512 Z', fill: '#AEB8C2', stroke: K, 'stroke-width': 4, 'stroke-linejoin': 'round' }, desk);   // laptop lid (back)
  const pullLine = E('path', { d: 'M510,462 Q760,380 922,528', fill: 'none', stroke: ppCol.weight, 'stroke-width': 7, 'stroke-dasharray': '16 14', 'stroke-linecap': 'round' }, Cprops);
  const gWeight = ppForce(Cprops, { color: ppCol.weight, dir: 'down', label: 'weight', size: 28, side: 'right', width: 20 });
  // the cousins: a magnet and a static spark, both with eyes; neither touches anything
  const eyes = (parent, x, y, gap) => [-1, 1].map(sd => { E('circle', { cx: x + sd * gap / 2, cy: y, r: 11, fill: '#FFFFFF', stroke: K, 'stroke-width': 3 }, parent); return E('circle', { cx: x + sd * gap / 2, cy: y, r: 5, fill: K }, parent); });
  const cMag = G(Cprops); magnet(cMag, 150, 48); const magEyes = eyes(cMag, 0, -42, 30);
  const clip = E('path', { d: 'M-6,-16 L-6,12 Q-6,20 0,20 Q6,20 6,12 L6,-10 Q6,-14 2,-14 Q-2,-14 -2,-10 L-2,8', fill: 'none', stroke: '#C9D3DC', 'stroke-width': 3.5, 'stroke-linecap': 'round' }, Cprops);
  const cSpk = G(Cprops); const spk = spark(cSpk, 34, { color: '#BFE6FF' }); const spkEyes = eyes(cSpk, 0, -4, 26);
  const bits = [0, 1, 2].map(i => E('rect', { x: -7, y: -5, width: 14, height: 10, fill: ['#FFFFFF', '#FFE45C', '#FF9FC2'][i], stroke: K, 'stroke-width': 1.5 }, Cprops));
  // confessional insets
  const earth = G(Cprops);
  E('circle', { r: 104, fill: ball('#4CA3E8', '#1D5FA6'), stroke: K, 'stroke-width': 4 }, earth);
  E('path', { d: 'M-70,-40 Q-40,-80 0,-60 Q30,-40 10,-10 Q-20,10 -50,0 Q-80,-10 -70,-40 Z M20,30 Q60,10 80,40 Q70,80 30,74 Q10,60 20,30 Z', fill: '#4CB866', stroke: '#23763A', 'stroke-width': 3 }, earth);
  let sq = '', shafts = '', heads = '';
  for (let i = 0; i < 8; i++) {
    const a = i * TAU / 8 - Math.PI / 2, c = Math.cos(a), s = Math.sin(a), px = c * 120, py = s * 120, ux = -s, uy = c;
    sq += `M${(px - 12 * c + 10 * ux).toFixed(1)},${(py - 12 * s + 10 * uy).toFixed(1)} L${(px + 8 * c + 10 * ux).toFixed(1)},${(py + 8 * s + 10 * uy).toFixed(1)} L${(px + 8 * c - 10 * ux).toFixed(1)},${(py + 8 * s - 10 * uy).toFixed(1)} L${(px - 12 * c - 10 * ux).toFixed(1)},${(py - 12 * s - 10 * uy).toFixed(1)} Z `;
    shafts += `M${(c * 96).toFixed(1)},${(s * 96).toFixed(1)} L${(c * 40).toFixed(1)},${(s * 40).toFixed(1)} `;
    heads += `M${(c * 24).toFixed(1)},${(s * 24).toFixed(1)} L${(c * 42 + ux * 10).toFixed(1)},${(s * 42 + uy * 10).toFixed(1)} L${(c * 42 - ux * 10).toFixed(1)},${(s * 42 - uy * 10).toFixed(1)} Z `;
  }
  E('path', { d: sq, fill: '#C99A5E', stroke: K, 'stroke-width': 2.5 }, earth);
  const eShaft = E('path', { d: shafts, stroke: '#E6E7FF', 'stroke-width': 6, 'stroke-dasharray': '10 7', 'stroke-linecap': 'round' }, earth);
  E('path', { d: heads, fill: '#E6E7FF', stroke: ppCol.weightDk, 'stroke-width': 2 }, earth);
  E('circle', { r: 7, fill: '#FFE45C', stroke: K, 'stroke-width': 2 }, earth);

  /* ================= world-space foreground ================= */
  const sticky = G(Lfg);
  E('rect', { x: -140, y: -88, width: 280, height: 176, fill: '#FFE45C', stroke: '#C9A800', 'stroke-width': 2 }, sticky);
  T(sticky, 0, -26, 'ENERGY:', { size: 38, weight: 800, anchor: 'middle', fill: '#C62828' });
  T(sticky, 0, 20, 'different', { size: 34, weight: 700, anchor: 'middle', fill: K });
  T(sticky, 0, 60, 'episode', { size: 34, weight: 700, anchor: 'middle', fill: K });
  const zap = spark(Lfg, 30);
  const hearts = [0, 1, 2].map(() => E('path', { d: 'M0,8 C-14,-4 -12,-18 0,-10 C12,-18 14,-4 0,8 Z', fill: '#FF6FA5', stroke: K, 'stroke-width': 2 }, Lfg));
  const poolSign = G(Lfg);
  E('path', { d: 'M-60,-110 L-60,-60 M60,-110 L60,-60', stroke: '#9AA6B2', 'stroke-width': 3 }, poolSign);
  E('rect', { x: -90, y: -60, width: 180, height: 130, rx: 12, fill: '#F2F7FA', stroke: '#3F5BD9', 'stroke-width': 5 }, poolSign);
  E('path', { d: 'M-72,24 Q-54,12 -36,24 T0,24 T36,24 T72,24 M-72,46 Q-54,34 -36,46 T0,46 T36,46 T72,46', fill: 'none', stroke: C.water, 'stroke-width': 6 }, poolSign);
  E('circle', { cx: -10, cy: 0, r: 13, fill: '#E9B27A', stroke: K, 'stroke-width': 3 }, poolSign);
  E('path', { d: 'M8,-2 Q30,-30 44,-6', fill: 'none', stroke: '#E9B27A', 'stroke-width': 7, 'stroke-linecap': 'round' }, poolSign);
  E('path', { d: 'M-66,-44 L66,58 M66,-44 L-66,58', stroke: '#E8424F', 'stroke-width': 11, 'stroke-linecap': 'round' }, poolSign);
  T(poolSign, 0, 108, 'NO POOL', { size: 28, weight: 800, anchor: 'middle', fill: '#FFFFFF' });

  /* ================= screen-space chips ================= */
  const c700 = crwPill(Lscr, '7:00 AM', { size: 36, color: '#FFE6B0', stroke: '#FFE6B0' });
  const cPush = crwKey(Lscr, 'a PUSH', ppCol.push);
  const cApplied = crwKey(Lscr, 'APPLIED FORCE', ppCol.push);
  const cNewton = G(Lscr);
  chip(cNewton, 'unit: the newton, N', { size: 36, fill: 'rgba(10,27,39,0.9)', stroke: C.energy, sw: 3, color: C.energy, weight: 800 });
  const cApple = crwPill(Lscr, '1 small apple ≈ 1 N', { size: 34 });
  const cTagC = crwPill(Lscr, 'CONTACT FORCE', { size: 26, color: '#FFE6B0', stroke: '#FFE6B0' });
  const cFric = crwKey(Lscr, 'FRICTION', ppCol.friction);
  const cAgainst = crwPill(Lscr, 'always against the motion', { size: 28 });
  const cNorm = crwKey(Lscr, 'NORMAL FORCE', ppCol.normal);
  const cRight = crwPill(Lscr, 'at right angles to the surface', { size: 28 });
  const cTens = crwKey(Lscr, 'TENSION', ppCol.tension);
  const cRopes = crwPill(Lscr, 'a pull, in ropes and springs', { size: 28 });
  const c34 = crwPill(Lscr, '34 °C', { size: 34, color: '#FFE45C', stroke: '#FFE45C' });
  const cRemote = crwPill(Lscr, 'NON-CONTACT: acts at a distance', { size: 28, color: '#C9CBF5', stroke: ppCol.weight });
  const cMagC = crwPill(Lscr, 'magnetic force', { size: 26, color: '#FFB0B0', stroke: '#FF8A8A' });
  const cEleC = crwPill(Lscr, 'electrostatic force', { size: 26, color: '#BFE6FF', stroke: '#BFE6FF' });
  const cCentre = G(Lscr);
  card(cCentre, -230, -62, 460, 124, { fill: 'rgba(10,27,39,0.92)', stroke: ppCol.weight, sw: 3 });
  T(cCentre, 0, -10, 'weight acts towards', { size: 32, weight: 700, anchor: 'middle', fill: C.ink });
  T(cCentre, 0, 34, 'the **centre** of the Earth', { size: 32, weight: 700, anchor: 'middle', fill: C.ink, boldFill: '#C9CBF5' });
  const cUp = crwPill(Lscr, 'upthrust = upward push of water', { size: 28, color: '#BFEFFF', stroke: C.water });

  /* ================= the cast ================= */
  const rex = cast(Lcast, 'rex', { mood: 'neutral' });
  const cr = {
    piv: cast(Lcast, 'piv'), graham: cast(Lcast, 'graham'), frieda: cast(Lcast, 'frieda'),
    tess: cast(Lcast, 'tess'), pushpa: cast(Lcast, 'pushpa'), norm: cast(Lcast, 'norm'),
  };
  const tessY = (st, s) => 598 - (80 * (1 + st) + 44) * s;
  const ROW = { piv: [95, 562, 0.42], graham: [195, 545, 0.46], frieda: [300, 560, 0.44], tess: [395, tessY(0.15, 0.42), 0.42], pushpa: [480, 557, 0.48] };
  const COL = { frieda: [640, 560, 0.44], norm: [735, 556, 0.44], tess: [830, tessY(0.15, 0.42), 0.42], graham: [1080, 545, 0.46] };
  const MOOD = { pushpa: 'happy', frieda: 'annoyed', graham: 'happy', norm: 'sad', tess: 'shock', piv: 'neutral' };

  /* ================= HUD ================= */
  const fcam = crwForceCam(Lhud);
  const lt = {
    pushpa: scLowerThird(Lhud, 'PUSHPA', 'Applied force. Intern. Day one.'),
    frieda: scLowerThird(Lhud, 'FRIEDA', 'Friction. Against it.'),
    norm: scLowerThird(Lhud, 'NORM', 'Normal force. The floor.'),
    tess: scLowerThird(Lhud, 'TESS', 'Tension. Very tense.'),
    graham: scLowerThird(Lhud, 'GRAHAM', 'Gravity. Works remotely.'),
  };

  /* ---------- cut points ---------- */
  const cut = id => at(id) - 0.06;
  const tDeskCut = mid('graham', 0.74);                                // "I work remotely"
  const SHOTS = [
    ['W', -1e9], ['P', cut('pushpa')], ['C1', cut('thpushpa')], ['N', cut('newtons')], ['W', cut('arrows')],
    ['F', cut('frieda')], ['U', cut('norm')], ['T', cut('tess')], ['W', cut('noncontact')], ['D', tDeskCut],
    ['C2', cut('thgraham')], ['W', cut('upthrust')],
  ];
  const shotAt = t => { let s = SHOTS[0][0]; for (const [k, t0] of SHOTS) if (t >= t0) s = k; return s; };
  const camOff0 = mid('rule2', 0.36), camOff1 = camOff0 + 1.1;        // FORCE-CAM off: nobody sees us
  // the demo box: pushed 720 -> 800, pulled 800 -> 880, then slides 880 -> 980 by itself (FORCE-CAM off)
  const tPush = mid('rule1', 0.33), tPull = mid('rule1', 0.55);
  const boxX = t => 720 + 80 * P(t, tPush, 0.8, ease) + 80 * P(t, tPull, 0.8, ease) + 100 * P(t, camOff0 + 0.1, 0.9, ease);

  return t => {
    const shot = shotAt(t), who = scWho(S, t);
    const W = shot === 'W', shown = {};
    op(Cbg, shot === 'P' || shot === 'N' || shot === 'F' || shot === 'T' || shot === 'D' ? 1 : 0);
    op(Ubg, shot === 'U' ? 1 : 0); conf.set(shot === 'C1' || shot === 'C2' ? 1 : 0, t);
    op(Wset, W ? 1 : 0);
    // FORCE-CAM: on for every crew shot, off in the confessionals; RULE 2 switches it off for a second
    const camOffNow = W && t >= camOff0 && t < camOff1;
    const flick = (t0) => (t >= t0 && t < t0 + 0.14 ? Math.floor(t * 30) % 2 : 1);
    fcam.set(shot === 'C1' || shot === 'C2' ? 0 : camOffNow ? -1 * flick(camOff0) : flick(camOff1), t);
    op(Lcast, camOffNow ? 0 : 1); op(wbG, camOffNow ? 0 : 1);

    // put a character on stage this frame
    const put = (k, x, y, s, st, mirror) => {
      const c = k === 'rex' ? rex : cr[k]; shown[k] = 1; op(c, 1);
      tr(c, x, y, mirror ? `${(-s).toFixed(4)} ${s.toFixed(4)}` : s);
      c.set(Object.assign({ t, talk: scTalk(S, t, k), mood: MOOD[k] || 'neutral', look: 0 }, st || {}));
    };
    const lookAt = (x, sx) => clamp((sx - x) / 260, -1, 1) * 0.85;

    /* ================= W: the briefing (wide) ================= */
    if (W) {
      flat.upd(0);
      // camera: the wide, a close-up on the board for "do", a slow push-in on Rex at the end
      const zoomDo = t >= cut('do') && t < cut('pushpa');
      if (zoomDo) crwFocus(cam, 1.45, 860, 300, 640, 330);
      else if (t >= cut('upthrust')) { const k = P(t, mid('upthrust', 0.55), S.ch.end - S.ch.start - mid('upthrust', 0.55), linear); crwFocus(cam, 1 + 0.12 * k, 498, 455, lerp(498, 430, k), lerp(455, 500, k)); }
      else cam.removeAttribute('transform');

      // the wall clock: 7:00
      op(clockG, t < cut('rule1') ? 1 : 0);
      // who stands where
      const pos = {};
      const enter = (k, i) => { const [x, y] = ROW[k]; const t0 = at('seven') + 0.35 + i * 0.42; return t < t0 ? null : crwHop(t, t0, 1.1, [-110, y], [x, y], 26, 4); };
      ['pushpa', 'tess', 'frieda', 'graham', 'piv'].forEach((k, i) => { pos[k] = enter(k, i); });
      const tAfter = t >= cut('arrows');
      // RULE 1 / RULE 2 demos: Pushpa pushes, Tess pulls, Pushpa (unseen) pushes again
      const bx = boxX(t);
      const pRow = [ROW.pushpa[0], ROW.pushpa[1]], pDemo = [bx - 98, 557];
      if (t >= tPush - 0.6 && t < cut('do')) {
        if (t < tPush + 1.0) pos.pushpa = crwHop(t, tPush - 0.6, 0.55, pRow, [720 - 98, 557], 60);
        if (t >= tPush && t < tPush + 1.0) pos.pushpa = [bx - 98, 557];
        if (t >= tPush + 1.0 && t < camOff0) pos.pushpa = crwHop(t, tPush + 1.0, 0.55, [800 - 98, 557], pRow, 60);
        if (t >= camOff0) pos.pushpa = t < camOff1 + 0.7 ? pDemo : crwHop(t, camOff1 + 0.7, 0.6, [980 - 98, 557], pRow, 60);
      }
      const ts0 = 0.15, tRowY = tessY(ts0, 0.42);
      let tessSt = ts0;
      if (t >= tPull - 0.6 && t < cut('do')) {
        const tPos = [bx + 126, tessY(0.5, 0.42)];
        if (t < tPull) pos.tess = crwHop(t, tPull - 0.6, 0.55, [ROW.tess[0], tRowY], [800 + 126, tPos[1]], 70);
        else if (t < tPull + 1.0) { pos.tess = tPos; tessSt = 0.5 + 0.08 * Math.sin(t * 14) * AMP; }
        else pos.tess = crwHop(t, tPull + 1.0, 0.6, [880 + 126, tPos[1]], [ROW.tess[0], tRowY], 70);
      }
      // the contact crew step into their column (Norm climbs up from under the table)
      if (tAfter) {
        const tF = mid('contact', 0.18), tN = mid('contact', 0.42), tT = mid('contact', 0.66);
        pos.frieda = t < tF ? [ROW.frieda[0], ROW.frieda[1]] : crwHop(t, tF, 0.6, ROW.frieda, COL.frieda, 70);
        if (t >= tN) pos.norm = crwHop(t, tN, 0.6, [735, 760], COL.norm, 90);
        pos.tess = t < tT ? [ROW.tess[0], tRowY] : crwHop(t, tT, 0.6, [ROW.tess[0], tRowY], [COL.tess[0], tRowY], 70);
        const tG = at('graham') + 0.05;
        pos.graham = t < tG ? [ROW.graham[0], ROW.graham[1]] : crwHop(t, tG, 0.8, ROW.graham, COL.graham, 120);
      }
      // Rex: the pointer by the board
      const rx = 498, ry = 455;
      const rexIn = P(t, mid('seven', 0.5), 0.5, pop);
      const spk = { rex: rx, narr: 860, pushpa: (pos.pushpa || [480])[0], frieda: (pos.frieda || [300])[0], norm: 735, tess: (pos.tess || [395])[0], graham: (pos.graham || [195])[0] }[who] || 860;
      if (rexIn > 0.01) {
        let mood = 'neutral', look = 0.6;
        if (t >= camOff1 && t < at('do')) { mood = 'deadpan'; look = 0; }
        else if (t >= tPush - 0.6 && t < tPull + 1.2) look = 0.9;
        else if (who && who !== 'rex' && who !== 'narr') { look = lookAt(rx, spk); mood = 'deadpan'; }
        else if (t >= at('upthrust')) { mood = 'deadpan'; look = t > mid('upthrust', 0.5) ? 0 : 0.6; }
        put('rex', rx, ry - 60 * (1 - clamp(rexIn)), 0.55 * Math.max(0.01, rexIn), { mood, look, len: 0.6 * clamp(rexIn) });
      }
      ['pushpa', 'tess', 'frieda', 'graham', 'piv', 'norm'].forEach(k => {
        const p = pos[k]; if (!p || zoomDo) return;
        const s = (COL[k] || ROW[k])[2];
        const st = { look: lookAt(p[0], spk) };
        if (k === 'tess') { st.stretch = tessSt; st.sweat = 1; }
        if (k === 'pushpa') {
          const pushing = (t >= tPush && t < tPush + 1.0) || (t >= camOff0 && t < camOff1 + 0.7);
          st.arms = pushing ? 'push' : 'up';
          if (pushing) st.look = 0.6;
          if (t >= camOff1 && t < camOff1 + 0.7) st.mood = 'smug';
        }
        if (k === 'graham' && t >= at('graham') && t < tDeskCut) st.hug = 0.5 + 0.5 * Math.sin(t * 9 * AMP);
        if (k === 'piv') st.still = true;
        put(k, p[0], p[1], s, st);
      });
      // the demo box, string and arrows
      const boxOn = t < cut('do');
      op(dBox, boxOn ? 1 : 0); tr(dBox, bx, 572, 0.42);
      const pushNow = (t >= tPush && t < tPush + 1.0) || (t >= camOff1 && t < camOff1 + 0.7);
      dPush.set(pushNow && boxOn ? 70 : 0); tr(dPush, bx - 40, 518);
      const pullNow = t >= tPull && t < tPull + 1.0;
      dPull.set(pullNow ? 70 : 0); tr(dPull, bx + 10, 518);
      op(dString, pullNow ? 1 : 0);
      if (pullNow) { attr(dString, 'x1', bx + 36); attr(dString, 'y1', 575); attr(dString, 'x2', bx + 126 - 6); attr(dString, 'y2', tessY(0.5, 0.42) + (80 * 1.5 + 8 + 30) * 0.42); }

      // board pages
      op(pR1, win(t, at('rule1'), cut('rule2'), 0.12));
      op(r1a, P(t, tPush - 0.1, 0.25, linear)); op(r1b, P(t, tPull - 0.25, 0.25, linear)); op(r1c, P(t, tPull - 0.1, 0.25, linear));
      op(r1d, P(t, mid('rule1', 0.84), 0.3, linear));
      op(pR2, win(t, at('rule2'), cut('do'), 0.12));
      op(r2a, P(t, mid('rule2', 0.25), 0.3, linear)); op(r2b, P(t, mid('rule2', 0.66), 0.3, linear));
      op(pDo, zoomDo ? 1 : 0);
      if (zoomDo) {
        const TT = [0.2, 0.36, 0.52, 0.7, 0.9].map(f => mid('do', f));
        DO.forEach((d, i) => {
          const p = P(t, TT[i] - 0.15, 0.4, pop);
          op(d.g, clamp(p * 2.5)); tr(d.g, d.x, -38, Math.max(0.01, 0.6 + 0.4 * p));
          op(d.ini, P(t, TT[i] + 0.1, 0.3, linear));
        });
        // START: still, then off it goes; SHAPE: the cushion squashes
        const ph = ((t - TT[0]) * 0.7 % 1 + 1) % 1, mv = ph < 0.4 ? 0 : (ph - 0.4) / 0.6;
        attr(doBox, 'x', -30 + 44 * mv * mv); op(doLines, mv > 0.15 ? 1 : 0); tr(doLines, 44 * mv * mv - 14, 0);
        const sq = 0.5 - 0.5 * Math.cos((t - TT[4]) * 4 * AMP);
        attr(doCush, 'rx', 34 * (1 + 0.3 * sq)); attr(doCush, 'ry', 18 * (1 - 0.4 * sq)); attr(doCush, 'cy', 12 + 7 * sq); tr(doPress, 0, 7 * sq);
        const du = P(t, mid('do', 0.93), 0.4, ease); op(doUnder, du > 0.02 ? 1 : 0); attr(doUnder, 'x2', lerp(-270, 270, du));
      }
      const arOn = win(t, at('arrows'), cut('contact'), 0.12);
      op(pAr, arOn);
      if (arOn) {
        a5.set(120 * P(t, mid('arrows', 0.08), 0.5, ease)); op(a5t, P(t, mid('arrows', 0.2), 0.3, linear));
        op(a5ring, win(t, mid('arrows', 0.36), mid('arrows', 0.66), 0.15)); op(arT1, P(t, mid('arrows', 0.38), 0.3, linear));
        a10.set(240 * P(t, mid('arrows', 0.7), 0.6, ease)); op(a10t, P(t, mid('arrows', 0.78), 0.3, linear));
        op(arT2, P(t, mid('arrows', 0.74), 0.3, linear));
      }
      const coOn = t >= at('contact');
      op(pCo, coOn ? P(t, at('contact'), 0.2, linear) : 0);
      if (coOn) {
        const nc = t >= at('noncontact');
        op(coHi, nc ? 0.25 : 0.25 + 0.75 * P(t, at('contact') + 0.3, 0.4, linear)); op(coHead, 1);
        op(ncHi, nc ? P(t, at('noncontact') + 0.2, 0.4, linear) : 0); op(ncHead, nc ? 1 : 0.3);
        coChips.forEach(c => op(c, nc ? 1 : 0));
        op(ncChips[0], P(t, mid('graham', 0.4), 0.3, linear)); tr(ncChips[0], 150, -36, 1);
        op(ncChips[1], t >= at('upthrust') ? 1 : 0); op(ncChips[2], t >= at('upthrust') ? 1 : 0);
        const up = P(t, mid('upthrust', 0.04), 0.35, pop);
        op(upMag, clamp(up * 2.5)); tr(upMag, -20, 132, Math.max(0.01, 1.4 - 0.4 * up), -3);
        const dp = P(t, mid('upthrust', 0.42), 0.3, pop);
        op(dayOff, clamp(dp * 2.5)); tr(dayOff, 186, 128, Math.max(0.01, 1.5 - 0.5 * dp), 9);
      }
      // the pool sign drops in ("no swimming pool in this episode")
      const ps = P(t, mid('upthrust', 0.68), 0.5, pop);
      op(poolSign, t >= at('upthrust') ? clamp(ps * 3) : 0); tr(poolSign, 300, 300 - 120 * (1 - ps));
    } else {
      cam.removeAttribute('transform');
      op(pDo, 0); op(poolSign, 0);
    }
    op(c700, W && t < cut('rule1') ? P(t, mid('seven', 0.1), 0.3, linear) : 0); tr(c700, 300, 345);
    op(cUp, W && t >= at('upthrust') ? P(t, mid('upthrust', 0.12), 0.3, linear) : 0); tr(cUp, 300, 160);

    /* ================= P: Pushpa bursts in ================= */
    const sP = shot === 'P';
    op(door, sP ? 1 : 0); op(creak, 0);
    if (sP) {
      const bi = P(t, cut('pushpa'), 0.45, easeOut);
      const bob = Math.abs(Math.sin(t * 7)) * 16 * AMP;
      put('pushpa', lerp(-160, 400, bi), 440 - bob * bi - 90 * Math.sin(Math.PI * clamp(bi)), 1.25, { arms: 'up', mood: 'happy', look: t > mid('pushpa', 0.7) ? 0.8 : 0 });
      const wob = t > mid('pushpa', 0.72) ? 0.22 : 0.08;
      tr(door, 790, 646, 0.6); door.set(clamp(wob + wob * Math.sin(t * 11)) * (S.reduce ? 0.5 : 1));
      op(creak, t > mid('pushpa', 0.75) ? 0.6 + 0.4 * Math.sin(t * 11) : 0); tr(creak, 760, 360, 1, -8);
    }
    lt.pushpa.set(sP ? win(t, at('pushpa') + 0.1, at('pushpa') + 3.4, 0.3) : 0);
    const kp = sP ? P(t, mid('pushpa', 0.3), 0.4, pop) : 0;
    op(cPush, clamp(kp * 2.5)); tr(cPush, 860, 230, Math.max(0.01, 0.7 + 0.3 * kp), -3);

    /* ================= C1 / C2: Rex's confessionals ================= */
    const sC1 = shot === 'C1', sC2 = shot === 'C2';
    op(inset, sC1 || sC2 ? 1 : 0); op(earth, 0); op(sticky, 0); op(zap, 0); hearts.forEach(h => op(h, 0));
    if (sC1 || sC2) {
      const t0 = sC1 ? cut('thpushpa') : cut('thgraham'), t1 = sC1 ? cut('newtons') : cut('upthrust');
      const pi = P(t, t0, t1 - t0, linear);
      put('rex', 400, 430, 1.45 * (1 + 0.1 * pi), { mood: 'deadpan', look: 0, len: 0.55 });
      tr(inset, 910, 270);
    }
    if (sC1) {
      const hopY = Math.abs(Math.sin(t * 6)) * 26 * AMP;
      put('pushpa', 910, 296 - hopY, 0.66, { arms: 'up', mood: 'happy' });
      const zp = P(t, mid('thpushpa', 0.56), 0.3, pop);
      op(zap, clamp(zp * 2) * (1 - P(t, mid('thpushpa', 0.78), 0.1, linear))); tr(zap, 1010, 190, Math.max(0.01, zp)); zap.upd(t);
      const sp = P(t, mid('thpushpa', 0.8), 0.3, easeOut);
      op(sticky, clamp(sp * 3)); tr(sticky, 930, 270, 1.6 - 0.6 * sp, -6);
    }
    const ap = sC1 ? P(t, mid('thpushpa', 0.12), 0.4, pop) : 0;
    op(cApplied, clamp(ap * 2.5)); tr(cApplied, 910, 500, Math.max(0.01, 0.7 + 0.3 * ap));
    if (sC2) {
      const clingy = t >= mid('thgraham', 0.76);
      op(earth, clingy ? 0 : 1); tr(earth, 910, 262); attr(eShaft, 'stroke-dashoffset', ((t * 30) % 17).toFixed(1));
      if (clingy) {
        tr(mBox, 910, 335, 0.5);
        put('graham', 910, 252, 0.55, { hug: 1, mood: 'happy', look: 0 });
        hearts.forEach((h, i) => { const ph = ((t * 0.7 + i / 3) % 1); op(h, Math.sin(ph * Math.PI)); tr(h, 860 + i * 50, 230 - ph * 80, 1.3); });
      }
    }
    op(cCentre, sC2 && t < mid('thgraham', 0.76) ? P(t, mid('thgraham', 0.3), 0.35, linear) : 0); tr(cCentre, 910, 500);

    /* ================= N: newtons, an apple on a newtonmeter ================= */
    const sN = shot === 'N';
    op(nm, sN ? 1 : 0); op(nmRope, sN ? 1 : 0); op(apple, sN ? 1 : 0);
    if (sN) {
      const ta = mid('newtons', 0.48), hang = t >= ta;
      const F = hang ? 1 + 0.35 * Math.exp(-(t - ta) * 3) * Math.cos((t - ta) * 14) : 0;
      nm.set(F); tr(nm, 600, 112, 1.05);
      const ay = hang ? 112 + nm.hookY * 1.05 + 30 : lerp(-80, 526, P(t, ta - 0.5, 0.5, easeIn));
      tr(apple, 600, ay);
      put('rex', 940, 560, 0.75, { mood: t > mid('newtons', 0.85) ? 'deadpan' : 'neutral', look: -0.6, len: 0.6 }, true);
    }
    const n1 = sN ? P(t, mid('newtons', 0.06), 0.4, pop) : 0;
    op(cNewton, clamp(n1 * 2.5)); tr(cNewton, 900, 200, Math.max(0.01, 0.7 + 0.3 * n1));
    const n2 = sN ? P(t, mid('newtons', 0.7), 0.4, pop) : 0;
    op(cApple, clamp(n2 * 2.5)); tr(cApple, 900, 310, Math.max(0.01, 0.7 + 0.3 * n2));

    /* ================= F: Frieda (friction) ================= */
    const sF = shot === 'F', sT = shot === 'T', sD = shot === 'D';
    op(mBox, sF || sT || sD || (sC2 && t >= mid('thgraham', 0.76)) ? 1 : 0); op(grit, sF ? 1 : 0); op(mRope, sT ? 1 : 0);
    if (sF) {
      const pi = P(t, cut('frieda'), cut('norm') - cut('frieda'), linear);
      tr(mBox, 600, 600);
      const scrub = Math.sin(t * 7) * 46 * AMP;
      put('frieda', 600 + scrub, 535 - 94, 1.1 * (1 + 0.06 * pi), { mood: 'annoyed', look: 0 });
      grits.forEach((g, i) => {
        const ph = (t * 1.6 + i / 4) % 1, sd = i % 2 ? 1 : -1;
        op(g, 1 - ph); tr(g, 600 + scrub + sd * (90 + 140 * ph), 532 - 70 * ph + 120 * ph * ph);
      });
    }
    lt.frieda.set(sF ? win(t, at('frieda') + 0.1, at('frieda') + 3.3, 0.3) : 0);
    op(cTagC, sF || shot === 'U' || sT ? 1 : 0); tr(cTagC, shot === 'U' ? 300 : 940, 170);
    const f1 = sF ? P(t, mid('frieda', 0.22), 0.4, pop) : 0;
    op(cFric, clamp(f1 * 2.5)); tr(cFric, 940, 255, Math.max(0.01, 0.7 + 0.3 * f1));
    op(cAgainst, sF ? P(t, mid('frieda', 0.55), 0.3, linear) : 0); tr(cAgainst, 940, 345);

    /* ================= U: Norm under the coffee table ================= */
    const sU = shot === 'U';
    op(nArrow, sU ? 1 : 0); op(nSquare, 0);
    if (sU) {
      const pi = P(t, mid('norm', 0.78), cut('tess') - mid('norm', 0.78), linear);
      crwFocus(cam, 1 + 0.14 * pi, 600, 470, 600, 470 - 30 * pi);
      put('norm', 600, 525, 1.25, { mood: 'sad', look: t > mid('norm', 0.75) ? 0 : -0.2 });
      nArrow.set(130 * P(t, mid('norm', 0.3), 0.5, ease));
      op(nSquare, P(t, mid('norm', 0.5), 0.3, linear));
    }
    lt.norm.set(sU ? win(t, at('norm') + 0.1, at('norm') + 3.4, 0.3) : 0);
    const n3 = sU ? P(t, mid('norm', 0.1), 0.4, pop) : 0;
    op(cNorm, clamp(n3 * 2.5)); tr(cNorm, 900, 170, Math.max(0.01, 0.7 + 0.3 * n3));
    op(cRight, sU ? P(t, mid('norm', 0.48), 0.3, linear) : 0); tr(cRight, 900, 262);

    /* ================= T: Tess holding up a box ================= */
    op(tRope, sT ? 1 : 0); op(tArrow, sT ? 1 : 0); op(sunG, sT ? 1 : 0);
    if (sT) {
      const tense = 0.55 + (t > mid('tess', 0.7) ? 0.12 : 0.05) * Math.sin(t * 23) * AMP;
      const shake = (t > mid('tess', 0.7) ? 3 : 1.2) * Math.sin(t * 31) * AMP;
      put('tess', 600 + shake, 250, 1, { stretch: tense, mood: 'shock', sweat: 1, look: 0, still: true });
      const hy = 250 + 80 * (1 + tense) + 8 + 30;
      attr(tRope, 'x2', 600 + shake);
      attr(mRope, 'x1', 600 + shake - 14); attr(mRope, 'y1', hy); attr(mRope, 'x2', 600); attr(mRope, 'y2', hy + 34);
      tr(mBox, 600, hy + 34 + 49, 0.75);
      tArrow.set(100 * P(t, mid('tess', 0.3), 0.5, ease)); tr(tArrow, 700, hy + 40);
      tr(sunRays, 0, 0, 1, (t * 12 * AMP) % 360);
    }
    lt.tess.set(sT ? win(t, at('tess') + 0.1, at('tess') + 3.4, 0.3) : 0);
    op(c34, sT ? 1 : 0); tr(c34, 960, 312);
    const t1 = sT ? P(t, mid('tess', 0.12), 0.4, pop) : 0;
    op(cTens, clamp(t1 * 2.5)); tr(cTens, 990, 410, Math.max(0.01, 0.7 + 0.3 * t1));
    op(cRopes, sT ? P(t, mid('tess', 0.36), 0.3, linear) : 0); tr(cRopes, 940, 500);

    /* ================= W (graham) + D: Graham works remotely, and his cousins ================= */
    lt.graham.set(W && t >= at('graham') ? win(t, at('graham') + 0.1, Math.min(at('graham') + 3.4, tDeskCut), 0.3) : 0);
    op(desk, sD ? 1 : 0); op(pullLine, sD ? 1 : 0); op(gWeight, sD ? 1 : 0); op(cMag, 0); op(cSpk, 0); op(clip, 0); bits.forEach(b => op(b, 0));
    if (sD) {
      put('graham', 450, 440, 0.82, { mood: 'happy', look: t > at('cousins') ? 0.7 : 0.4, hug: 0.15 });
      tr(mBox, 930, 600, 0.8);
      attr(pullLine, 'stroke-dashoffset', ((t * 40) % 30).toFixed(1));
      gWeight.set(80 * P(t, tDeskCut + 0.4, 0.4, ease)); tr(gWeight, 930, 604);
      const pm = P(t, mid('cousins', 0.3), 0.4, pop), pe = P(t, mid('cousins', 0.52), 0.4, pop);
      op(cMag, clamp(pm * 2.5)); tr(cMag, 720, 330, Math.max(0.01, 0.6 + 0.4 * pm));
      op(clip, clamp(pm * 2.5)); tr(clip, 612 + 4 * Math.sin(t * 5) * AMP, 336, 1, 90);
      magEyes.forEach(e => tr(e, -4, 0)); spkEyes.forEach(e => tr(e, 0, 4));
      op(cSpk, clamp(pe * 2.5)); tr(cSpk, 1010, 320, Math.max(0.01, 0.6 + 0.4 * pe)); spk.upd(t);
      bits.forEach((b, i) => { op(b, clamp(pe * 2.5)); tr(b, 970 + i * 40, 384 - 10 * Math.sin(t * 3 + i * 2) * AMP, 1, i * 30 - 20 + 10 * Math.sin(t * 2 + i)); });
    }
    op(cRemote, sD ? P(t, tDeskCut + 0.2, 0.3, linear) : 0); tr(cRemote, 770, 180);
    op(cMagC, sD ? P(t, mid('cousins', 0.36), 0.3, linear) : 0); tr(cMagC, 720, 250);
    op(cEleC, sD ? P(t, mid('cousins', 0.58), 0.3, linear) : 0); tr(cEleC, 1010, 250);

    /* ---------- hide whoever is not in this shot ---------- */
    ['pushpa', 'frieda', 'graham', 'norm', 'tess', 'piv'].forEach(k => { if (!shown[k]) op(cr[k], 0); });
    if (!shown.rex) op(rex, 0);
  };
});
