/* Scene 4: Ray goes live (radiation).
   Beats: 4:00 PM, Kavya (black T-shirt) walks out past "SHELTER ENDS HERE" -> the Sun has her in its
   crosshairs -> whip-pan: Ray slides down a sunbeam, LIVE, hearts counting -> electromagnetic waves (can't see,
   can feel) -> Sun to Earth across a vacuum -> Cel's confessional: 150 million km, conduction and convection
   crossed out, Ray waving in the back -> infrared camera: everything glows, the hot road most -> "I'm giving off
   radiation?" -> "You're glowing, bestie" -> the black T-shirt (dun dun DUN) -> dark matt panel absorbs and emits
   -> shiny panel reflects ("so rude") -> the car's shiny sunshade -> "I'm wearing the wrong shirt" -> Ray's
   livestream: Dark Drinks, Shiny Reflects, LIKE & SUBSCRIBE. */
scene('ray', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;
  const RED = '#E0304A';          // infrared waves: Ray's deep red

  /* ---------- local helpers (prefixed ray) ---------- */
  const rayCam = (el, cx, cy, k, px, py) => el.setAttribute('transform', `translate(${(px ?? cx).toFixed(1)} ${(py ?? cy).toFixed(1)}) scale(${k.toFixed(4)}) translate(${(-cx).toFixed(1)} ${(-cy).toFixed(1)})`);
  const rayCamIn = (el, cx, cy, k) => { const hw = 600 / k, hh = 375 / k; rayCam(el, clamp(cx, hw, 1200 - hw), clamp(cy, hh, 750 - hh), k, 600, 375); };
  const rayPop = (el, t, t0, x, y, s, r, mul) => { const p = P(t, t0, 0.45, pop); op(el, clamp(p * 2.5) * (mul === undefined ? 1 : mul)); tr(el, x, y, Math.max(0.01, (s || 1) * (0.6 + 0.4 * p)), r); return p; };
  // Kavya's black T-shirt for this chapter: recolour the PE-shirt blue
  const rayBlack = g => g.querySelectorAll('[fill="#2E7DD8"],[stroke="#2E7DD8"]').forEach(e => { if (e.getAttribute('fill') === '#2E7DD8') e.setAttribute('fill', '#232323'); if (e.getAttribute('stroke') === '#2E7DD8') e.setAttribute('stroke', '#232323'); });
  // a wavy radiation arrow from (x1,y1) to (x2,y2); g.set(p, t) draws it up to p with a travelling wiggle
  function rayWave(parent, x1, y1, x2, y2, o) {
    o = o || {};
    const g = G(parent), col = o.color || RED, w = o.width || 6, amp = o.amp || 10, wl = o.wl || 46;
    const L = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / L, uy = (y2 - y1) / L;
    const path = E('path', { fill: 'none', stroke: col, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    const head = E('path', { d: `M0,0 L${-w * 3.2},${-w * 2} L${-w * 2.2},0 L${-w * 3.2},${w * 2} Z`, fill: col }, g);
    g.set = (p, t) => {
      p = clamp(p); const len = L * p; let d = '';
      for (let s = 0; s <= len; s += 6) {
        const taper = Math.min(1, (len - s) / 30);
        const off = amp * taper * Math.sin(TAU * (s / wl) - (t || 0) * 9 * AMP);
        d += (s ? 'L' : 'M') + (x1 + ux * s - uy * off).toFixed(1) + ',' + (y1 + uy * s + ux * off).toFixed(1);
      }
      attr(path, 'd', d || `M${x1},${y1}`);
      head.setAttribute('transform', `translate(${(x1 + ux * len).toFixed(1)} ${(y1 + uy * len).toFixed(1)}) rotate(${(Math.atan2(uy, ux) * 180 / Math.PI).toFixed(1)})`);
      op(head, p > 0.15 ? 1 : 0); op(path, p > 0.01 ? 1 : 0);
    };
    g.set(1, 0);
    return g;
  }
  // little rising infrared squiggles over a thing; g.upd(t, k) (k = how much it gives off)
  function rayIR(parent, n, w, h, seed) {
    const g = G(parent), ws = [];
    for (let i = 0; i < n; i++) ws.push({ el: E('path', { fill: 'none', stroke: '#FF4D6A', 'stroke-width': 5, 'stroke-linecap': 'round' }, g), x: (i - (n - 1) / 2) * w / Math.max(1, n - 1), ph: ((i * 37 + seed * 11) % 10) / 10 });
    g.upd = (t, k) => ws.forEach(o => {
      const u = (t * 0.55 * AMP + o.ph) % 1, y0 = -u * h;
      let d = ''; for (let j = 0; j <= 6; j++) d += (j ? 'L' : 'M') + (o.x + 7 * Math.sin(j * 1.3 + t * 5)).toFixed(1) + ',' + (y0 - j * 8).toFixed(1);
      attr(o.el, 'd', d); op(o.el, k * Math.sin(u * Math.PI));
    });
    return g;
  }
  const rayHeartD = 'M0,12 C-30,-6 -18,-30 0,-14 C18,-30 30,-6 0,12 Z';

  /* layers */
  const Lbg = G(root), Lcast = G(root), Lfg = G(root), Lhud = G(root);

  /* ---------- cut list ---------- */
  const CUTS = [
    [-1, 'street'],
    [at('attack') - 0.08, 'bust'],
    [at('ray') - 0.08, 'sky'],
    [at('waves') - 0.08, 'waves'],
    [at('vacuum') - 0.08, 'space'],
    [at('thray') - 0.08, 'conf'],
    [at('all') - 0.08, 'street'],
    [at('me') - 0.08, 'bust'],
    [at('dark') - 0.08, 'panels'],
    [at('shade') - 0.08, 'street'],
    [at('wrong') - 0.08, 'bust'],
    [at('drinks') - 0.08, 'phone'],
  ];
  const shotAt = t => { let c = CUTS[0][1]; for (const k of CUTS) if (t >= k[0]) c = k[1]; return c; };

  /* =====================================================================
     STREET (four, all, shade) and the backdrop of the bust shots
     ===================================================================== */
  const gStreet = G(Lbg), stW = G(gStreet);
  const street = bkStreet(stW);
  const BUSX = 120;
  const bus = G(stW);
  E('rect', { x: -170, y: -120, width: 340, height: 130, rx: 16, fill: '#F2F7FA', stroke: SC_INK, 'stroke-width': 5 }, bus);
  E('rect', { x: -170, y: -24, width: 340, height: 34, fill: '#7A4FB8' }, bus);
  for (let i = 0; i < 5; i++) E('rect', { x: -150 + i * 62, y: -104, width: 50, height: 52, rx: 6, fill: '#7FC7EE', stroke: SC_INK, 'stroke-width': 3 }, bus);
  [-104, 104].forEach(x => E('circle', { cx: x, cy: 12, r: 24, fill: '#1C2430', stroke: SC_INK, 'stroke-width': 4 }, bus));
  const kWalk = G(stW), kBody = scKavyaBody(kWalk); rayBlack(kBody);
  const kWSweat = scSweat(kWalk, [[-26, -200], [24, -206]]);
  // infrared camera overlay and glows (in the street's world, so the camera moves them too)
  const irG = G(stW);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#1A0614', opacity: 0.6 }, irG);
  const gRoad = E('rect', { x: 0, y: 540, width: 1200, height: 210, fill: '#FF3B4E' }, irG);
  const gBus = E('ellipse', { rx: 210, ry: 110, fill: glow('#FF4D6A') }, irG);
  const gKav = E('ellipse', { rx: 80, ry: 130, fill: glow('#FF4D6A') }, irG);
  const gCar = E('ellipse', { cx: 960, cy: 600, rx: 200, ry: 90, fill: glow('#FF4D6A') }, irG);
  const irRoad = rayIR(irG, 9, 1080, 120, 1); tr(irRoad, 600, 640);
  const irBus = rayIR(irG, 3, 200, 90, 2);
  const irKav = rayIR(irG, 2, 50, 80, 3);
  const irCar = rayIR(irG, 3, 220, 80, 4); tr(irCar, 960, 560);
  // street overlays (screen space)
  const stOv = G(gStreet);
  const glare = E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#FFF2A0', opacity: 0 }, stOv);
  const clock = bkClock(stOv);
  const mrt = chip(stOv, 'MRT  →', { size: 30, fill: '#FFFFFF', stroke: '#C62828', sw: 3, color: '#C62828' });
  const sunWarn = bkChip(stOv, 'no more shade', { size: 30, color: '#FFE45C' });
  const irTag = G(stOv);
  E('circle', { cx: 0, cy: 0, r: 10, fill: '#FF3B3B' }, irTag);
  T(irTag, 20, 10, 'INFRARED CAM', { size: 28, weight: 800, fill: '#FF9BB0' });
  const allChip = chip(stOv, 'EVERYTHING gives off infrared', { size: 36, fill: 'rgba(26,6,20,0.9)', stroke: '#FF4D6A', sw: 3, color: '#FFFFFF' });
  const hotChip = chip(stOv, 'hotter → MORE radiation', { size: 36, fill: '#FF4D6A', stroke: '#FFFFFF', sw: 3, color: '#FFFFFF' });
  const roadLbl = bkChip(stOv, 'hot road', { size: 28, color: '#FF9BB0' });
  // the sunshade close-up
  const shadeWaves = [0, 1, 2].map(i => ({ inn: rayWave(stOv, 1150 - i * 40, 60 + i * 30, 600 + i * 70, 400, { width: 8, amp: 12 }), out: rayWave(stOv, 600 + i * 70, 400, 260 + i * 60, 120 + i * 40, { width: 8, amp: 12 }) }));
  const glint = spark(stOv, 40, { seed: 7, color: '#FFFFFF' });
  const shadeChip = chip(stOv, 'shiny sunshade REFLECTS radiation', { size: 36, fill: 'rgba(10,27,39,0.92)', stroke: '#E9EFF2', sw: 3, color: '#FFFFFF' });

  /* =====================================================================
     BUST: Kavya close (attack, me, glow, shirt, wrong)
     ===================================================================== */
  const gBust = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#58BFFF', '#CDEFFF', true) }, gBust);
  const bBlocks = G(gBust);
  [[40, 260, 220, '#F2B880'], [300, 200, 200, '#A9D8CF'], [880, 280, 260, '#C9B6E8']].forEach(([x, y, w, c]) => {
    E('rect', { x, y, width: w, height: 750 - y, fill: c, stroke: '#8A7F72', 'stroke-width': 3 }, bBlocks);
    let wd = ''; for (let yy = y + 30; yy < 740; yy += 34) for (let xx = x + 18; xx < x + w - 20; xx += 34) wd += `M${xx},${yy} h16 v16 h-16 Z `;
    E('path', { d: wd, fill: '#FFFFFF', opacity: 0.7 }, bBlocks);
  });
  const bIR = E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#1A0614', opacity: 0.55 }, gBust);
  const angrySun = G(gBust);
  { const s_ = sun(angrySun, 90); angrySun.sunG = s_;
    E('path', { d: 'M-50,-34 L-14,-18 M50,-34 L14,-18', stroke: SC_INK, 'stroke-width': 8, 'stroke-linecap': 'round' }, angrySun);
    E('circle', { cx: -28, cy: -4, r: 9, fill: SC_INK }, angrySun); E('circle', { cx: 28, cy: -4, r: 9, fill: SC_INK }, angrySun);
    E('path', { d: 'M-30,40 Q0,22 30,40', fill: 'none', stroke: SC_INK, 'stroke-width': 7, 'stroke-linecap': 'round' }, angrySun); }
  const kGlow = E('ellipse', { rx: 190, ry: 230, fill: glow('#FF4D6A') }, gBust);
  const kav = cast(Lcast, 'kavya', { mood: 'annoyed' }); rayBlack(kav);
  const kIR = rayIR(Lcast, 4, 230, 110, 5);
  const xhair = G(Lfg);
  E('circle', { r: 120, fill: 'none', stroke: '#FF2A2A', 'stroke-width': 6 }, xhair);
  E('circle', { r: 60, fill: 'none', stroke: '#FF2A2A', 'stroke-width': 4 }, xhair);
  E('path', { d: 'M-160,0 L-80,0 M80,0 L160,0 M0,-160 L0,-80 M0,80 L0,160', stroke: '#FF2A2A', 'stroke-width': 6, 'stroke-linecap': 'round' }, xhair);
  const lockT = chip(Lfg, 'TARGET LOCKED', { size: 30, fill: '#FF2A2A', color: '#FFFFFF' });
  const radQ = chip(Lfg, 'me? radiation?!', { size: 40, fill: 'rgba(26,6,20,0.92)', stroke: '#FF4D6A', sw: 3, color: '#FFFFFF' });
  const glowHeart = E('path', { d: rayHeartD, fill: '#FF5FA2', stroke: SC_INK, 'stroke-width': 3 }, Lfg);
  const glowChip = bkChip(Lfg, 'glowing… in infrared', { size: 34, color: '#FF9BB0' });
  const vign = E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: glow('#000000'), opacity: 0 }, Lfg);
  const blackT = G(Lfg);
  { const c_ = chip(blackT, 'BLACK T-shirt', { size: 52, fill: '#111111', stroke: '#FF2A2A', sw: 4, color: '#FFFFFF' }); }
  const dun = T(Lfg, 0, 0, '♪ dun dun DUNNN', { size: 34, weight: 800, anchor: 'middle', fill: '#FF9BB0' });
  const tagG = G(Lfg);           // a price-tag on the shirt
  E('path', { d: 'M-20,-36 L150,-36 L150,36 L-20,36 L-46,0 Z', fill: '#FFF8C4', stroke: SC_INK, 'stroke-width': 3, 'stroke-linejoin': 'round' }, tagG);
  E('circle', { cx: -22, cy: 0, r: 7, fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 2 }, tagG);
  T(tagG, 62, -6, 'BEST', { size: 26, weight: 800, anchor: 'middle', fill: '#C62828' });
  T(tagG, 62, 24, 'ABSORBER', { size: 26, weight: 800, anchor: 'middle', fill: '#C62828' });
  const wDark = G(Lfg), wShiny = G(Lfg);
  chip(wDark, 'dark → ABSORBS', { size: 36, fill: '#232323', stroke: '#FF8A3D', sw: 3, color: '#FFFFFF' });
  chip(wShiny, 'shiny → REFLECTS', { size: 36, fill: linGrad('#F2F7FA', '#9AA6B2', true), stroke: '#FFFFFF', sw: 3, color: '#1C2430' });
  const stamp = G(Lfg);
  E('rect', { x: -170, y: -44, width: 340, height: 88, rx: 12, fill: 'rgba(24,8,12,0.85)', stroke: '#FF4D4D', 'stroke-width': 6 }, stamp);
  T(stamp, 0, 16, 'WRONG SHIRT', { size: 46, weight: 800, anchor: 'middle', fill: '#FF4D4D', ls: 2 });

  /* =====================================================================
     SKY: Ray slides down a sunbeam
     ===================================================================== */
  const gSky = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#3FA9F5', '#BDE6FF', true) }, gSky);
  const skySun = sun(gSky, 110); tr(skySun, 980, 180);
  E('path', { d: 'M930,240 L1040,250 L560,720 L330,720 Z', fill: '#FFF2A0', opacity: 0.45 }, gSky);
  const whip = G(gSky);
  for (let i = 0; i < 9; i++) E('line', { x1: 0, y1: 90 + i * 72, x2: 1200, y2: 90 + i * 72 + 20, stroke: '#FFFFFF', 'stroke-width': 26 + (i % 3) * 10, opacity: 0.55 }, whip);
  const phone = bkPhone(gSky, 1);
  const ltRay = scLowerThird(Lhud, 'RAY', 'Infrared radiation. Live from the Sun.');
  const irChip = chip(gSky, 'infrared radiation', { size: 40, fill: '#9E1F4F', stroke: '#FFFFFF', sw: 3, color: '#FFFFFF' });

  /* =====================================================================
     WAVES: electromagnetic waves, can't see, can feel
     ===================================================================== */
  const gWaves = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#2A6FB0', '#7CC4F0', true) }, gWaves);
  const wvSun = sun(gWaves, 70); tr(wvSun, 170, 250);
  const wvA = [170, 250], wvB = [930, 470];
  const wv = rayWave(gWaves, wvA[0] + 70, wvA[1] + 25, wvB[0], wvB[1], { width: 9, amp: 24, wl: 90 });
  const emChip = G(gWaves);
  E('rect', { x: -340, y: -64, width: 680, height: 128, rx: 20, fill: 'rgba(10,27,39,0.92)', stroke: RED, 'stroke-width': 3 }, emChip);
  T(emChip, 0, -12, 'infrared = **electromagnetic waves**', { size: 34, weight: 600, anchor: 'middle', fill: '#FFFFFF', boldFill: '#FF7A8E' });
  T(emChip, 0, 34, '(like light)', { size: 30, weight: 600, anchor: 'middle', fill: C.muted });
  const eye = G(gWaves);
  E('path', { d: 'M-60,0 Q0,-48 60,0 Q0,48 -60,0 Z', fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 5 }, eye);
  E('circle', { r: 20, fill: '#2A6FB0', stroke: SC_INK, 'stroke-width': 4 }, eye);
  E('line', { x1: -60, y1: 46, x2: 60, y2: -46, stroke: '#FF4D4D', 'stroke-width': 10, 'stroke-linecap': 'round' }, eye);
  T(eye, 0, 92, "can't SEE it", { size: 30, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  const hand = G(gWaves);
  E('circle', { r: 80, fill: glow(C.heat) }, hand);
  E('path', { d: 'M-34,40 L-34,-10 Q-34,-22 -24,-22 Q-14,-22 -14,-10 L-14,-40 Q-14,-52 -4,-52 Q6,-52 6,-40 L6,-46 Q6,-58 16,-58 Q26,-58 26,-46 L26,-36 Q26,-46 36,-46 Q46,-46 46,-34 L46,20 Q46,48 20,52 L-10,52 Q-34,50 -34,40 Z', fill: '#B9784E', stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, hand);
  T(hand, 6, 104, 'CAN feel it', { size: 30, weight: 800, anchor: 'middle', fill: '#FFE45C' });

  /* =====================================================================
     SPACE: Sun to Earth across a vacuum
     ===================================================================== */
  const gSpace = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#05070D' }, gSpace);
  { const r = rng(91); let d = ''; for (let i = 0; i < 90; i++) { const x = r() * 1200, y = 100 + r() * 650, s = 1 + r() * 2; d += `M${x.toFixed(0)},${y.toFixed(0)} h${s.toFixed(1)} v${s.toFixed(1)} h-${s.toFixed(1)} Z `; } E('path', { d, fill: '#FFFFFF', opacity: 0.8 }, gSpace); }
  const spSun = sun(gSpace, 90); tr(spSun, 150, 400);
  const earth = G(gSpace); tr(earth, 1060, 400);
  E('circle', { r: 120, fill: glow('#4CC9F0'), opacity: 0.5 }, earth);
  E('circle', { r: 70, fill: ball('#4CC9F0', '#1D5AA6'), stroke: '#9FD8FF', 'stroke-width': 3 }, earth);
  E('path', { d: 'M-40,-30 Q-10,-50 10,-30 Q20,-10 -10,0 Q-30,10 -40,-30 Z M10,20 Q40,10 50,30 Q30,56 10,40 Z', fill: '#5BD27A' }, earth);
  T(earth, 0, 116, 'Earth', { size: 30, weight: 700, anchor: 'middle', fill: '#9FD8FF' });
  const vacBox = G(gSpace);
  E('rect', { x: 290, y: 250, width: 600, height: 300, rx: 24, fill: 'none', stroke: '#8FA3B5', 'stroke-width': 4, 'stroke-dasharray': '18 14' }, vacBox);
  T(vacBox, 590, 300, 'VACUUM', { size: 48, weight: 800, anchor: 'middle', fill: '#E9EFF2' });
  T(vacBox, 590, 530, 'no particles. at all.', { size: 30, weight: 700, anchor: 'middle', fill: C.muted });
  const spWave = rayWave(gSpace, 250, 400, 980, 400, { width: 9, amp: 22, wl: 90 });
  const onlyChip = chip(gSpace, 'radiation: the ONLY way to cross a vacuum', { size: 36, fill: '#9E1F4F', stroke: '#FFFFFF', sw: 3, color: '#FFFFFF' });

  /* =====================================================================
     CONF: Cel, 150 million km
     ===================================================================== */
  const conf = bkConfessional(Lbg, 'cel');
  const cIn = G(conf);
  E('rect', { x: -260, y: -150, width: 520, height: 300, rx: 16, fill: '#05070D', stroke: '#FFFFFF', 'stroke-width': 6 }, cIn);
  { const s1 = sun(cIn, 38); tr(s1, -190, -30); }
  E('circle', { cx: 196, cy: -30, r: 30, fill: ball('#4CC9F0', '#1D5AA6') }, cIn);
  const kmAr = G(cIn);
  E('path', { d: 'M-130,40 L140,40', stroke: '#FFFFFF', 'stroke-width': 5 }, kmAr);
  E('path', { d: 'M-130,40 l18,-12 l0,24 Z M140,40 l-18,-12 l0,24 Z', fill: '#FFFFFF' }, kmAr);
  T(kmAr, 5, 98, '150 million km', { size: 38, weight: 800, anchor: 'middle', fill: '#FFE45C' });
  const cWave = rayWave(cIn, -140, -30, 150, -30, { width: 6, amp: 10, wl: 40 });
  const noRow = G(conf);
  const noA = G(noRow), noB = G(noRow);
  [0, 1, 2].forEach(i => E('circle', { cx: -36 + i * 36, cy: 0, r: 16, fill: '#A9B5C0', stroke: SC_INK, 'stroke-width': 3 }, noA));
  T(noA, 0, 56, 'conduction', { size: 28, weight: 700, anchor: 'middle', fill: '#FFFFFF' });
  E('path', { d: 'M-34,10 Q-40,-30 0,-30 Q36,-28 30,4 Q24,26 0,20 Q-14,16 -10,0 Q-6,-12 8,-8', fill: 'none', stroke: C.heat, 'stroke-width': 7, 'stroke-linecap': 'round' }, noB);
  T(noB, 0, 56, 'convection', { size: 28, weight: 700, anchor: 'middle', fill: '#FFFFFF' });
  const xA = cross(noA, 34), xB = cross(noB, 34);
  const noP = bkChip(conf, 'no particles to carry them', { size: 28, color: '#FF9BB0' });
  const celC = cast(Lcast, 'cel', { mood: 'deadpan' });

  /* =====================================================================
     PANELS: dark matt vs light shiny
     ===================================================================== */
  const gPan = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#14243A', '#25446B', true) }, gPan);
  const pnSun = sun(gPan, 52); tr(pnSun, 600, 180);
  const DK = [300, 440], SH = [920, 440];
  const pDark = G(gPan); tr(pDark, DK[0], DK[1]);
  E('rect', { x: -170, y: 0, width: 340, height: 90, rx: 8, fill: '#1E1E1E', stroke: '#000000', 'stroke-width': 4 }, pDark);
  const dkHot = E('rect', { x: -170, y: 0, width: 340, height: 90, rx: 8, fill: linGrad('#FFB45C', '#E8622A', true) }, pDark);
  const dkHalo = E('ellipse', { cx: 0, cy: 45, rx: 260, ry: 140, fill: glow(C.heat) }, pDark);
  pDark.insertBefore(dkHalo, pDark.firstChild);
  const pShiny = G(gPan); tr(pShiny, SH[0], SH[1]);
  E('rect', { x: -170, y: 0, width: 340, height: 90, rx: 8, fill: linGrad('#FFFFFF', '#9AA6B2', true), stroke: '#6B7B8A', 'stroke-width': 4 }, pShiny);
  E('path', { d: 'M-130,6 L-160,84 M-60,6 L-90,84 M60,6 L30,84 M130,6 L100,84', stroke: '#FFFFFF', 'stroke-width': 8, opacity: 0.9 }, pShiny);
  const shStar = spark(pShiny, 18, { seed: 5, color: '#FFFFFF' }); tr(shStar, 110, 20);
  const inD = [0, 1, 2].map(i => rayWave(gPan, 560 - i * 18, 220 + i * 10, DK[0] - 90 + i * 90, DK[1] - 4, { width: 7, amp: 10 }));
  const outD = [0, 1, 2].map(i => rayWave(gPan, DK[0] - 150 + i * 46, DK[1] - 8, DK[0] - 236 + i * 28, DK[1] - 150 - i * 34, { width: 6, amp: 8 }));
  const emitL = T(gPan, DK[0] - 196, DK[1] - 236, 'emits', { size: 30, weight: 800, anchor: 'middle', fill: C.heat });
  const inS = [0, 1, 2].map(i => rayWave(gPan, 640 + i * 18, 220 + i * 10, SH[0] - 90 + i * 90, SH[1] - 4, { width: 7, amp: 10 }));
  const outS = [0, 1, 2].map(i => rayWave(gPan, SH[0] - 90 + i * 90, SH[1] - 4, SH[0] + 70 + i * 50, 150 + i * 30, { width: 7, amp: 10 }));
  const lblD = G(gPan);
  E('rect', { x: -230, y: -40, width: 460, height: 132, rx: 18, fill: 'rgba(10,27,39,0.9)', stroke: C.heat, 'stroke-width': 3 }, lblD);
  T(lblD, 0, 2, '**dark, matt**', { size: 34, weight: 600, anchor: 'middle', fill: '#FFFFFF', boldFill: '#FFFFFF' });
  T(lblD, 0, 50, 'BEST absorber AND emitter', { size: 30, weight: 800, anchor: 'middle', fill: C.heat });
  const lblS = G(gPan);
  E('rect', { x: -230, y: -40, width: 460, height: 132, rx: 18, fill: 'rgba(10,27,39,0.9)', stroke: '#E9EFF2', 'stroke-width': 3 }, lblS);
  T(lblS, 0, 2, '**light, shiny**: poor absorber,', { size: 30, weight: 600, anchor: 'middle', fill: '#FFFFFF' });
  T(lblS, 0, 50, 'poor emitter → REFLECTS', { size: 30, weight: 800, anchor: 'middle', fill: '#9FD8FF' });
  const rude = T(gPan, 0, 0, 'so rude.', { size: 34, weight: 800, anchor: 'middle', fill: '#FF9BB0' });

  /* =====================================================================
     PHONE: the livestream
     ===================================================================== */
  const gPh = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#3A0F24', '#6E1E46', true) }, gPh);
  E('rect', { x: 230, y: 150, width: 840, height: 530, rx: 20, fill: linGrad('#FF9A7A', '#B32646', true) }, gPh);
  const phFr = G(Lfg);
  E('path', { d: 'M200,120 L1100,120 Q1130,120 1130,150 L1130,680 Q1130,710 1100,710 L200,710 Q170,710 170,680 L170,150 Q170,120 200,120 Z M230,150 L230,680 L1070,680 L1070,150 Z', fill: '#1C2430', 'fill-rule': 'evenodd', stroke: SC_INK, 'stroke-width': 5 }, phFr);
  E('circle', { cx: 1100, cy: 415, r: 8, fill: '#5A6B7A' }, phFr);
  const live = G(phFr); tr(live, 300, 196);
  E('rect', { x: -50, y: -22, width: 100, height: 44, rx: 8, fill: '#E8222E' }, live);
  T(live, 0, 12, 'LIVE', { size: 30, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  const viewers = T(phFr, 370, 208, '34K watching', { size: 28, weight: 800, fill: '#FFFFFF' });
  const capBar = G(phFr);
  E('rect', { x: -380, y: -46, width: 760, height: 92, rx: 16, fill: 'rgba(10,10,20,0.75)' }, capBar);
  T(capBar, 0, 16, '**Dark** Drinks, **Shiny** Reflects', { size: 48, weight: 700, anchor: 'middle', fill: '#FFFFFF', boldFill: '#FFE45C' });
  const subBtn = G(phFr);
  E('rect', { x: -150, y: -40, width: 300, height: 80, rx: 40, fill: '#E8222E', stroke: '#FFFFFF', 'stroke-width': 4 }, subBtn);
  T(subBtn, 0, 11, 'LIKE & SUBSCRIBE', { size: 30, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  const phHearts = [];
  for (let i = 0; i < 6; i++) phHearts.push(E('path', { d: rayHeartD, fill: ['#FF5FA2', '#FF4D4D', '#FFE45C'][i % 3], stroke: SC_INK, 'stroke-width': 2 }, phFr));

  /* the cast shared across shots */
  const ray = cast(Lcast, 'ray', { mood: 'smug' });

  const SHOTS = { street: gStreet, bust: gBust, sky: gSky, waves: gWaves, space: gSpace, conf, panels: gPan, phone: gPh };

  return t => {
    const shot = shotAt(t);
    for (const k in SHOTS) op(SHOTS[k], k === shot ? 1 : 0);
    let rayOn = 0, kavOn = 0, celOn = 0;
    const R = (x, y, s, mood, look, extra) => { rayOn = 1; tr(ray, x, y, s); ray.set(Object.assign({ t, talk: scTalk(S, t, 'ray'), mood, look }, extra || {})); };
    ltRay.set(shot === 'sky' ? win(t, at('ray') + 0.2, at('ray') + 3.5, 0.3) : 0);
    op(phFr, shot === 'phone' ? 1 : 0);

    /* ---------------- STREET ---------------- */
    if (shot === 'street') {
      street.upd(t);
      const isFour = t < at('attack'), isAll = !isFour && t < at('shade') - 0.1, isShade = t >= at('shade') - 0.1;
      // Kavya walks out of the shelter into the sun (stays where she stopped afterwards)
      const wk = P(t, at('four') + 0.2, end('four') - at('four'), linear);
      const kx = lerp(170, 760, wk);
      tr(kWalk, kx, 616, 1.2);
      kBody.pose(wk < 1 ? walkPose(t, 1.1) : { lean: 0, armL: [10, 10], armR: [-10, 10] });
      const inSun = clamp((kx - 560) / 80);
      kWSweat.set(inSun, t);
      op(bus, isFour ? 0 : 1); tr(bus, lerp(-260, BUSX + 160, P(t, at('all'), 2.2, easeOut)), 680);
      if (isFour) {
        rayCamIn(stW, lerp(500, 640, wk), 470, 1.3);
        op(glare, 0.22 * inSun * (0.85 + 0.15 * Math.sin(t * 3)));
        clock.set('4:00'); rayPop(clock, t, at('four') + 0.3, 960, 330, 0.9);
        rayPop(mrt, t, mid('four', 0.35), 1020, 440, 1);
        rayPop(sunWarn, t, mid('four', 0.8), 720, 230, 1, -3);
      } else { op(glare, 0); op(clock, 0); op(mrt, 0); op(sunWarn, 0); }
      // infrared camera
      op(irG, isAll ? P(t, at('all') - 0.05, 0.25, linear) : 0); op(irTag, isAll ? 1 : 0);
      if (isAll) {
        rayCamIn(stW, 600, 375, 1);
        const hot = P(t, mid('all', 0.68), 0.6);
        op(gRoad, 0.25 + 0.35 * hot + 0.05 * Math.sin(t * 4));
        const bx = lerp(-260, BUSX + 160, P(t, at('all'), 2.2, easeOut));
        tr(gBus, bx, 620); tr(irBus, bx, 540); tr(gKav, kx, 520); tr(irKav, kx, 400);
        op(gBus, 0.75); op(gKav, 0.85); op(gCar, 0.6);
        irRoad.upd(t, 0.3 + 0.7 * hot); irBus.upd(t, 0.6); irKav.upd(t, 0.7); irCar.upd(t + 1, 0.5);
        tr(irTag, 820, 60 + 70);
        rayPop(allChip, t, at('all') + 0.2, 600, 220, 1, 0, 1);
        rayPop(hotChip, t, mid('all', 0.68), 600, 300, 1);
        rayPop(roadLbl, t, mid('all', 0.72), 960, 712, 1);
        R(1070, 330, 0.55, 'happy', -0.5);
      } else { [allChip, hotChip, roadLbl].forEach(e => op(e, 0)); }
      // the sunshade
      if (isShade) {
        const push = P(t, at('shade') - 0.1, 0.9, ease);
        rayCam(stW, lerp(600, 905, push), lerp(375, 568, push), lerp(1, 3.4, push), 600, lerp(375, 400, push));
        const w0 = at('shade') + 0.7;
        shadeWaves.forEach((w, i) => {
          const pi = P(t, w0 + i * 0.25, 0.6, linear), po = P(t, w0 + 0.6 + i * 0.25, 0.7, linear);
          op(w.inn, push > 0.95 ? 1 : 0); op(w.out, push > 0.95 && po > 0 ? 1 : 0);
          w.inn.set(pi, t); w.out.set(po, t);
        });
        const gl = Math.max(0, 1 - Math.abs(((t - w0 - 0.6) % 1.4) - 0.2) * 3);
        op(glint, push > 0.95 ? gl : 0); tr(glint, 640, 400, 1.2); glint.upd(t);
        rayPop(shadeChip, t, mid('shade', 0.4), 600, 660, 1);
      } else { shadeWaves.forEach(w => { op(w.inn, 0); op(w.out, 0); }); op(glint, 0); op(shadeChip, 0); }
    } else { [glare, clock, mrt, sunWarn, irTag, allChip, hotChip, roadLbl, glint, shadeChip].forEach(e => op(e, 0)); shadeWaves.forEach(w => { op(w.inn, 0); op(w.out, 0); }); }

    /* ---------------- BUST ---------------- */
    [xhair, lockT, radQ, glowChip, glowHeart, vign, blackT, dun, tagG, wDark, wShiny, stamp].forEach(e => op(e, 0));
    if (shot === 'bust') {
      kavOn = 1;
      const isAttack = t < at('ray'), isWrong = t >= at('wrong') - 0.1;
      const isShirt = !isAttack && !isWrong && t >= at('shirt') - 0.1;
      const isGlow = !isAttack && !isShirt && !isWrong && t >= at('glow') - 0.1;
      const irOn = !isAttack && !isWrong;
      op(bIR, irOn ? 0.55 : 0); op(kGlow, irOn ? 0.8 : 0);
      op(angrySun, isAttack ? 1 : 0);
      let kx = 430, ky = 500, ks = 1.5, mood = 'annoyed', look = 0, rot = 0;
      if (isAttack) {
        angrySun.sunG.upd(t); tr(angrySun, 960, 200, 1 + 0.04 * Math.sin(t * 6));
        look = 0.8;
        const xp = P(t, mid('attack', 0.45), 0.35, easeOut);
        op(xhair, xp); tr(xhair, kx + 30 * (1 - xp) * Math.sin(t * 9), ky - 50, 1.5 - 0.5 * xp, t * 20);
        rayPop(lockT, t, mid('attack', 0.7), kx, ky - 260, 1);
      } else if (isWrong) {
        mood = 'deadpan'; look = t < mid('wrong', 0.6) ? 0.3 : 0; rot = t < mid('wrong', 0.6) ? 8 : 0;
        kx = 440; ky = 470; ks = 1.6;
        rayPop(tagG, t, at('wrong') + 0.1, kx + 90, ky + 150, 1, -8);
        rayPop(wDark, t, mid('wrong', 0.12), 880, 250, 1);
        rayPop(wShiny, t, mid('wrong', 0.38), 880, 340, 1);
        const sp = P(t, mid('wrong', 0.7), 0.35, easeOut);
        op(stamp, clamp(sp * 4)); tr(stamp, 880, 470, lerp(1.7, 1, sp), -6);
      } else if (isShirt) {
        mood = 'deadpan';
        const z = P(t, at('shirt'), 2.2, ease);
        kx = lerp(560, 600, z); ky = lerp(480, 120, z); ks = lerp(1.6, 3.4, z);
        op(vign, 0.6 * z);
        rayPop(blackT, t, mid('shirt', 0.5), 600, 560, 1);
        op(dun, P(t, end('shirt'), 0.3, linear)); tr(dun, 600, 660);
        R(1070, 610, 0.55, 'smug', -0.8);
      } else if (isGlow) {
        mood = 'deadpan'; kx = 820; ky = 500; ks = 1.4;
        R(330, 430, 0.95, 'happy', 0.8);
        rayPop(glowChip, t, mid('glow', 0.4), 600, 170, 1);
        const hp = P(t, mid('glow', 0.55), 0.5, pop); op(glowHeart, clamp(hp * 3)); tr(glowHeart, 462, 330 - 40 * clamp(hp), Math.max(0.01, 2 * hp));
      } else {   // me
        mood = 'shock'; look = 0; rot = 10; kx = 600; ky = 500; ks = 1.5;
        rayPop(radQ, t, mid('me', 0.3), 600, 170, 1);
      }
      tr(kav, kx, ky, ks, rot);
      kav.set({ t, talk: scTalk(S, t, 'kavya'), mood, look, sweat: isAttack ? 1 : 0.5 });
      tr(kGlow, kx, ky, ks / 1.5); op(kIR, irOn && !isShirt ? 1 : 0); tr(kIR, kx, ky - 60 * ks, ks / 1.5); kIR.upd(t, 1);
    } else { op(kIR, 0); }

    /* ---------------- SKY ---------------- */
    if (shot === 'sky') {
      skySun.upd(t);
      op(whip, 1 - P(t, at('ray') - 0.08, 0.25, linear)); tr(whip, -300 * P(t, at('ray') - 0.08, 0.25, linear), 0);
      const sp = P(t, at('ray') + 0.1, 0.9, easeOut);
      R(lerp(900, 520, sp), lerp(230, 430, sp), lerp(0.4, 1.2, sp), 'smug', 0.4);
      const n = Math.floor(34000 * P(t, mid('ray', 0.2), 3, linear));
      phone.set(n >= 1000 ? (n / 1000).toFixed(1) + 'K' : String(n));
      rayPop(phone, t, mid('ray', 0.25), 940, 470, 0.95, 6);
      rayPop(irChip, t, mid('ray', 0.5), 940, 690, 1);
    }

    /* ---------------- WAVES ---------------- */
    if (shot === 'waves') {
      wvSun.upd(t);
      const wp = P(t, at('waves') + 0.1, 1.4, linear);
      wv.set(wp, t);
      R(lerp(wvA[0] + 80, 560, wp), lerp(wvA[1] + 20, 380, wp), 0.55, 'smug', 0.5);
      kavOn = 1;
      tr(kav, 1010, 520, 1.15);
      kav.set({ t, mood: t > mid('waves', 0.7) ? 'happy' : 'annoyed', look: -0.7, sweat: 0.8 });
      rayPop(emChip, t, mid('waves', 0.22), 640, 170, 1);
      rayPop(eye, t, mid('waves', 0.6), 300, 520, 1);
      rayPop(hand, t, mid('waves', 0.82), 600, 540, 1);
    }

    /* ---------------- SPACE ---------------- */
    if (shot === 'space') {
      spSun.upd(t);
      op(vacBox, P(t, at('vacuum') + 0.3, 0.4, linear));
      spWave.set(P(t, mid('vacuum', 0.3), 1.6, linear), t);
      const wp = P(t, mid('vacuum', 0.3), 1.6, linear);
      R(lerp(250, 930, wp), 400 - 26 * Math.sin(t * 6), 0.42, 'smug', 0.6);
      rayPop(onlyChip, t, mid('vacuum', 0.62), 600, 660, 1);
    }

    /* ---------------- CONF ---------------- */
    conf.set(shot === 'conf' ? 1 : 0, t);
    if (shot === 'conf') {
      const push = P(t, mid('thray', 0.85), end('thray') + 0.7 - mid('thray', 0.85), linear);
      rayCam(conf, 430, 380, 1 + 0.06 * push);
      celOn = 1;
      tr(celC, 360, 400, 1.5 * (1 + 0.06 * push));
      const rayIn = t >= mid('thray', 0.8);
      celC.set({ t, talk: scTalk(S, t, 'cel'), mood: 'deadpan', look: rayIn ? 0.8 : 0, temp: 34 });
      const ip = P(t, at('thray') + 0.1, 0.3, pop);
      op(cIn, clamp(ip * 2.5)); tr(cIn, 870, 280, Math.max(0.01, 0.8 + 0.2 * ip));
      cWave.set(P(t, at('thray') + 0.3, 1.2, linear), t);
      op(kmAr, P(t, mid('thray', 0.12), 0.3, linear));
      const np = mid('thray', 0.42);
      rayPop(noA, t, np, 760, 560, 1, 0, rayIn ? 1 - P(t, mid('thray', 0.8), 0.2, linear) : 1);
      rayPop(noB, t, np + 0.35, 960, 560, 1, 0, rayIn ? 1 - P(t, mid('thray', 0.8), 0.2, linear) : 1);
      op(xA, P(t, np + 0.7, 0.2, linear)); op(xB, P(t, np + 0.9, 0.2, linear));
      rayPop(noP, t, mid('thray', 0.6), 860, 660, 1, 0, 1 - P(t, mid('thray', 0.8), 0.2, linear));
      if (rayIn) {
        const rp = P(t, mid('thray', 0.8), 0.5, easeOut);
        R(lerp(1300, 1010, rp), 590, 0.75, 'smug', -0.6, {});
        ray.setAttribute('transform', ray.getAttribute('transform') + ` rotate(${(10 * Math.sin(t * 7) * AMP).toFixed(1)})`);
      }
    }

    /* ---------------- PANELS ---------------- */
    if (shot === 'panels') {
      pnSun.upd(t);
      const isShiny = t >= at('shiny') - 0.1;
      // dark: absorbed, warms up, then emits
      const d0 = at('dark') + 0.2;
      inD.forEach((w, i) => w.set(P(t, d0 + i * 0.15, 0.9, linear), t));
      const warm = P(t, d0 + 0.9, 1.6, linear);
      op(dkHot, 0.95 * warm); op(dkHalo, 0.8 * warm);
      outD.forEach((w, i) => { const p = P(t, mid('dark', 0.55) + i * 0.15, 0.8, linear); w.set(p, t); op(w, p > 0 ? 1 : 0); });
      op(emitL, P(t, mid('dark', 0.6), 0.3, linear));
      rayPop(lblD, t, mid('dark', 0.25), DK[0], 640, 1);
      // shiny: bounces off
      const s0 = at('shiny') + 0.1;
      op(pShiny, P(t, at('shiny') - 0.1, 0.25, linear));
      inS.forEach((w, i) => { const p = P(t, s0 + i * 0.15, 0.8, linear); w.set(p, t); op(w, p > 0 ? 1 : 0); });
      outS.forEach((w, i) => { const p = P(t, s0 + 0.8 + i * 0.15, 0.7, linear); w.set(p, t); op(w, p > 0 ? 1 : 0); });
      op(shStar, isShiny ? wave(t, 0.8) : 0); shStar.upd(t);
      rayPop(lblS, t, mid('shiny', 0.3), SH[0] - 20, 640, 1, 0, isShiny ? 1 : 0);
      op(rude, P(t, mid('shiny', 0.85), 0.2, linear)); tr(rude, 600, 470);
      R(600, 600, 0.6, isShiny ? (t > mid('shiny', 0.75) ? 'annoyed' : 'neutral') : 'happy', isShiny ? 0.8 : -0.8);
    }

    /* ---------------- PHONE ---------------- */
    if (shot === 'phone') {
      R(470, 400, 1.05, 'happy', 0.3, { phone: 0 });
      rayPop(capBar, t, mid('drinks', 0.15), 650, 610, 1);
      const bp = P(t, mid('drinks', 0.5), 0.4, pop);
      op(subBtn, clamp(bp * 2.5)); tr(subBtn, 820, 300, Math.max(0.01, (0.6 + 0.4 * bp) * (1 + 0.05 * Math.sin(t * 8) * AMP)));
      phHearts.forEach((h, i) => { const u = ((t - at('drinks')) * 0.5 * AMP + i / 6) % 1; op(h, t > at('drinks') ? Math.sin(u * Math.PI) : 0); tr(h, 1022 + 14 * Math.sin(t * 2 + i), 640 - u * 440, 1.3); });
      setText(viewers, (34 + Math.max(0, Math.floor((t - at('drinks')) * 3))) + 'K watching');
    }

    if (!rayOn) op(ray, 0); else op(ray, 1);
    if (!kavOn) op(kav, 0); else op(kav, 1);
    op(celC, celOn ? 1 : 0);
  };
});
