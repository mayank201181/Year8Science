/* Scene 6: Where the joules come from.
   Shots: the corridor at dusk, a cable running off from the meter ("?") -> Colin the coal lump in a strata cutaway
   (lower third, 300 million years, fossil fuel) -> family photos (Oil, Natural Gas), a match: chemical store released
   -> power station, then a cutaway (furnace with Colin in it, boiler, steam, turbine, generator, wires)
   -> Constance files the store chain above it: chemical -> thermal -> kinetic -ELECTRICALLY (Pat)-> the meter
   -> Jules: wind / falling water / solar panels -> Colin smug at the plant (reliable) -> Constance: CO2 cloud,
   non-renewable -> Colin's confessional (300 000 000 years vs 20 minutes) -> office: Jules "so nuclear is renewable?"
   -> DENIED: uranium runs out -> non-renewable vs renewable columns (seven icons as named) -> Six Wild Horses
   -> unreliable: solar at night, wind on a calm day -> Singapore's mix -> Kavya at the open front door, thinking of Theo
   -> CASE CLOSED (destroyed 0 J, wasted lots; Theo peeks) -> saving energy = wasting less -> insulate, efficient
   appliances, switch off standby -> Kavya: "Mum, you were right", aircon off -> Mum: "Who are you talking to?",
   Kavya slowly looks at the camera. */
scene('supply', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;
  const talk = (t, who) => scTalk(S, t, who);

  /* ---------- helpers (prefixed supply) ---------- */
  // text with **bold** and real subscripts: 'CO_2' -> CO₂
  function supplyRich(parent, x, y, str, o) {
    o = o || {};
    const size = o.size || 32, sub = Math.round(size * 0.62), dy = Math.round(size * 0.24);
    const t = E('text', { x, y, 'font-size': size, 'font-weight': o.weight || 700, fill: o.fill || C.ink, 'text-anchor': o.anchor || 'middle', 'font-family': o.font || FD }, parent);
    const parts = [];
    String(str).split(/(\*\*[^*]+\*\*)/).forEach(seg => {
      if (!seg) return;
      const b = seg.startsWith('**');
      (b ? seg.slice(2, -2) : seg).split(/(_\d+)/).forEach(p => { if (p) parts.push({ b, sub: /^_\d+$/.test(p), s: p.replace(/^_/, '') }); });
    });
    let down = false;
    parts.forEach(p => {
      const a = {};
      if (p.sub) { a['font-size'] = sub; a.dy = dy; down = true; } else if (down) { a.dy = -dy; down = false; }
      if (p.b) { a['font-weight'] = 800; if (o.boldFill) a.fill = o.boldFill; }
      E('tspan', a, t).textContent = p.s;
    });
    return t;
  }
  const supplyPlain = str => String(str).replace(/\*\*/g, '').replace(/_(\d+)/g, '$1');
  // pill with rich text
  function supplyChip(parent, str, o) {
    o = o || {};
    const size = o.size || 30, h = Math.round(size * 1.75);
    const w = Math.ceil(textWidth(supplyPlain(str), size, FD, 800) + size * 1.4);
    const g = G(parent);
    E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: h / 2, fill: o.fill || 'rgba(10,27,39,0.9)', stroke: o.stroke || C.line, 'stroke-width': o.sw || 3 }, g);
    supplyRich(g, 0, size * 0.35, str, { size, weight: o.weight || 700, fill: o.color || C.ink, boldFill: o.boldFill });
    g.w = w; g.h = h;
    return g;
  }
  function supplyPop(el, t, t0, x, y, s, r) { const p = P(t, t0, 0.45, pop); op(el, clamp(p * 2.5)); tr(el, x, y, Math.max(0.01, (s || 1) * (0.6 + 0.4 * p)), r); return p; }
  // the same for art drawn at absolute stage coordinates: scale about (cx, cy)
  function supplyPopAt(el, t, t0, cx, cy) { const p = P(t, t0, 0.45, pop), k = Math.max(0.01, 0.6 + 0.4 * p); op(el, clamp(p * 2.5)); el.setAttribute('transform', `translate(${cx} ${cy}) scale(${k.toFixed(3)}) translate(${-cx} ${-cy})`); return p; }
  // camera: scale k about the pivot (px, py)
  function supplyCam(el, px, py, k) { el.setAttribute('transform', Math.abs(k - 1) < 1e-4 ? '' : `translate(${px.toFixed(1)} ${py.toFixed(1)}) scale(${k.toFixed(4)}) translate(${(-px).toFixed(1)} ${(-py).toFixed(1)})`); }
  // a store box for the energy chain
  function supplyBox(parent, name, sub, col) {
    const g = G(parent);
    E('rect', { x: -85, y: -46, width: 170, height: 92, rx: 14, fill: col, stroke: SC_INK, 'stroke-width': 4 }, g);
    T(g, 0, -6, name, { size: 27, weight: 800, anchor: 'middle', fill: SC_INK });
    T(g, 0, 28, sub, { size: 26, weight: 600, anchor: 'middle', fill: SC_INK });
    return g;
  }
  // flickering flames: g.upd(t, on)
  function supplyFlames(parent, n, w, h) {
    const g = G(parent), fl = [];
    for (let k = 0; k < n; k++) fl.push(E('path', { d: `M0,0 C${-w * 0.6},0 ${-w * 0.6},${-h * 0.5} 0,${-h} C${w * 0.6},${-h * 0.5} ${w * 0.6},0 0,0 Z`, fill: k % 2 ? '#FFC247' : '#FF8A3D', stroke: '#E8424F', 'stroke-width': 2 }, g));
    g.upd = (t, on) => fl.forEach((i, k) => tr(i, (k - (n - 1) / 2) * w, 0, Math.max(0.01, on * (0.75 + 0.25 * Math.sin(t * 13 + k * 2.1) * AMP))));
    return g;
  }
  // simple galloping horse silhouette facing right; g.upd(t, phase)
  function supplyHorse(parent, col) {
    const g = G(parent), body = G(g), legs = [];
    [[-29, 0], [33, 1]].forEach(([x, k]) => legs.push({ e: E('path', { d: 'M-7,0 L-7,44 M7,0 L7,44', stroke: col, 'stroke-width': 9, 'stroke-linecap': 'round' }, body), x, k }));
    E('path', { d: 'M-50,-14 Q-76,-14 -80,18', fill: 'none', stroke: col, 'stroke-width': 9, 'stroke-linecap': 'round' }, body);
    E('path', { d: 'M-52,-8 Q-52,-34 -22,-34 L24,-34 Q36,-36 42,-50 L56,-74 Q62,-82 70,-76 L86,-58 Q90,-50 82,-48 L66,-50 Q58,-30 50,-10 Q42,10 20,12 L-36,12 Q-54,10 -52,-8 Z', fill: col }, body);
    g.upd = (t, ph) => {
      const w = t * TAU * 2.4 + ph;
      legs.forEach(({ e, x, k }) => e.setAttribute('transform', `translate(${x} 6) rotate(${(Math.sin(w + k * Math.PI) * 30 * AMP).toFixed(1)})`));
      tr(body, 0, -Math.abs(Math.sin(w)) * 8 * AMP, 1, Math.sin(w + 1) * 3 * AMP);
    };
    return g;
  }

  /* ---------- layers ---------- */
  const world = G(root), bgL = G(world), castL = G(world), fgL = G(world), hudL = G(root);
  const shot = () => ({ bg: G(bgL), fg: G(fgL), hud: G(hudL) });
  const dark = '#1C2A33';

  /* ---------- shared sets ---------- */
  // the HDB corridor at dusk, with a cable running off from the meter
  const setCor = G(bgL);
  const cor = enCorridor(setCor);
  const cable = wire(setCor, [[-20, 150], [240, 150], [240, 256]], { color: '#2E2A30', width: 11, dotColor: C.energy, dot: 6, spacing: 44 });
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#FF9A52', '#3A2A6B', true), opacity: 0.3 }, setCor);   // dusk tint
  const doorOpen = G(setCor);
  E('rect', { x: 408, y: 234, width: 214, height: 404, fill: linGrad('#FBEBCB', '#E3CFA8', true) }, doorOpen);
  E('rect', { x: 430, y: 300, width: 110, height: 70, fill: '#FAFCFD', stroke: '#9AA6B2', 'stroke-width': 3 }, doorOpen);   // the aircon, far inside
  E('path', { d: 'M622,232 L668,262 L668,612 L622,640 Z', fill: linGrad('#C99A5C', '#8B5A2B', false), stroke: '#5A3A1A', 'stroke-width': 5, 'stroke-linejoin': 'round' }, doorOpen);
  const coldL = [];
  for (let k = 0; k < 4; k++) coldL.push(E('path', { d: '', fill: 'none', stroke: '#9FE0FF', 'stroke-width': 5, 'stroke-linecap': 'round' }, doorOpen));
  // the power station
  const setPlant = G(bgL);
  const plant = enPlant(setPlant);
  // the office inside the meter
  const setOff = G(bgL);
  enOffice(setOff);

  /* ===== A: where (corridor) ===== */
  const sA = shot();
  const qMark = G(sA.hud);
  E('circle', { r: 42, fill: '#FFE45C', stroke: SC_INK, 'stroke-width': 5 }, qMark);
  T(qMark, 0, 18, '?', { size: 54, weight: 800, anchor: 'middle', fill: SC_INK });
  const qChip = supplyChip(sA.hud, 'where do the joules come from?', { size: 32, color: C.energy, stroke: C.energy });

  /* ===== B: Colin in the rocks (hi, family) ===== */
  const sB = shot();
  {
    const bands = [[0, '#3E2C20'], [150, '#5A3E2A'], [270, '#7A5A3C'], [390, '#5E4A3A'], [500, '#262120']];
    bands.forEach(([y, col], k) => {
      let d = `M0,${y}`;
      for (let x = 0; x <= 1200; x += 100) d += ` L${x},${(y + (k ? 14 * Math.sin(x / 140 + k * 1.7) : 0)).toFixed(0)}`;
      E('path', { d: d + ' L1200,750 L0,750 Z', fill: col }, sB.bg);
    });
    const fp = leaf(sB.bg, 0.7, { color: '#3A3430' }); tr(fp, 760, 650, 1, -18); op(fp, 0.5);
    T(sB.bg, 1130, 660, 'COAL SEAM', { size: 26, weight: 800, anchor: 'end', fill: '#8A7F72', ls: 3 });
  }
  const depth = arrow(sB.hud, 1140, 130, 1140, 560, { color: '#FFE6B0', width: 6 });
  const cYears = supplyChip(sB.hud, '**300 million** years underground', { size: 30, color: '#FFE6B0', stroke: '#FFE6B0', boldFill: '#FFC247' });
  const cFossil = supplyChip(sB.hud, '**FOSSIL FUEL**', { size: 44, fill: '#1E2126', color: '#FFFFFF', stroke: '#FFC247', sw: 4, boldFill: '#FFC247' });
  const ltColin = scLowerThird(sB.hud, 'COLIN', 'Coal. Fossil fuel. Non-renewable.');
  // the family photos
  function supplyFrame(parent, rel, name, drawIn) {
    const g = G(parent);
    E('rect', { x: -100, y: -100, width: 200, height: 200, rx: 8, fill: '#B07A45', stroke: SC_INK, 'stroke-width': 5 }, g);
    E('rect', { x: -84, y: -84, width: 168, height: 168, fill: '#F4EBD3' }, g);
    drawIn(g);
    T(g, 0, 136, rel, { size: 26, weight: 600, anchor: 'middle', fill: '#E6D7B0', font: FB });
    T(g, 0, 172, name, { size: 32, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
    return g;
  }
  const fOil = supplyFrame(sB.hud, 'my brother', 'OIL', g => {
    E('path', { d: 'M0,-62 C26,-24 46,4 46,26 C46,52 26,66 0,66 C-26,66 -46,52 -46,26 C-46,4 -26,-24 0,-62 Z', fill: ball('#4A4458', '#121016'), stroke: SC_INK, 'stroke-width': 4 }, g);
    E('circle', { cx: -14, cy: 20, r: 6, fill: '#FFFFFF' }, g); E('circle', { cx: 14, cy: 20, r: 6, fill: '#FFFFFF' }, g);
    E('path', { d: 'M-14,42 Q0,50 14,42', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 4, 'stroke-linecap': 'round' }, g);
  });
  const fGas = supplyFrame(sB.hud, 'my cousin', 'NATURAL GAS', g => {
    E('path', { d: 'M0,66 C-40,66 -48,30 -30,4 C-20,-12 -16,-30 -18,-60 C4,-44 18,-26 14,-6 C22,-14 24,-26 22,-34 C46,-8 48,22 38,42 C30,58 16,66 0,66 Z', fill: ball('#8FD3FF', '#2F6FE0'), stroke: SC_INK, 'stroke-width': 4 }, g);
    E('circle', { cx: -12, cy: 24, r: 6, fill: '#FFFFFF' }, g); E('circle', { cx: 14, cy: 24, r: 6, fill: '#FFFFFF' }, g);
    E('path', { d: 'M-12,44 Q1,52 14,44', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 4, 'stroke-linecap': 'round' }, g);
  });
  const cFam = supplyChip(sB.hud, 'fossil fuels: **coal, oil, natural gas**', { size: 30, boldFill: '#FFC247' });
  const match = G(sB.fg);
  E('rect', { x: -6, y: -2, width: 110, height: 12, rx: 4, fill: '#E3B272', stroke: SC_INK, 'stroke-width': 3 }, match);
  E('ellipse', { cx: -6, cy: 4, rx: 12, ry: 10, fill: '#D32F2F', stroke: SC_INK, 'stroke-width': 3 }, match);
  const matchF = supplyFlames(match, 1, 30, 46); tr(matchF, -10, -4);
  const colinFire = supplyFlames(sB.fg, 4, 46, 70);
  const burnRow = G(sB.hud);
  { const ic = enStoreIcon(burnRow, 'chemical', 0.8); tr(ic, 0, 0);
    T(burnRow, 56, -8, 'burn: **chemical store**', { size: 34, weight: 700, fill: C.ink, boldFill: '#FFC247' });
    T(burnRow, 56, 32, 'energy is released', { size: 30, weight: 600, fill: C.ink }); }

  /* ===== C: power station (establishing) ===== */
  const sC = shot();
  const cPlant = supplyChip(sC.hud, 'POWER STATION', { size: 36, color: '#FFFFFF', stroke: '#FFFFFF' });

  /* ===== D: cutaway (station, chain) ===== */
  const sD = shot();
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#16283A', '#0B1520', true) }, sD.bg);
  E('rect', { x: 0, y: 600, width: 1200, height: 150, fill: '#0A1118' }, sD.bg);
  // furnace with Colin inside it, boiler on top
  const furn = G(sD.bg); tr(furn, 170, 520);
  E('rect', { x: -100, y: -80, width: 200, height: 160, rx: 8, fill: '#4A3A32', stroke: SC_INK, 'stroke-width': 5 }, furn);
  E('rect', { x: -80, y: -50, width: 160, height: 120, rx: 6, fill: '#1A0E0A', stroke: SC_INK, 'stroke-width': 3 }, furn);
  const furnFire = supplyFlames(sD.fg, 4, 36, 44); tr(furnFire, 170, 590);
  const boil = G(sD.bg); tr(boil, 170, 370);
  E('rect', { x: -90, y: -70, width: 180, height: 140, rx: 24, fill: ball('#C9D3DC', '#6E7C8A'), stroke: SC_INK, 'stroke-width': 5 }, boil);
  E('rect', { x: -66, y: -40, width: 132, height: 86, rx: 10, fill: '#0F2030', stroke: SC_INK, 'stroke-width': 3 }, boil);
  const water = E('rect', { x: -62, y: 0, width: 124, height: 42, rx: 6, fill: '#4CC9F0', opacity: 0.85 }, boil);
  const bubs = []; for (let k = 0; k < 3; k++) bubs.push(E('circle', { r: 5, fill: '#E6F7FF' }, boil));
  // steam pipe to the turbine
  E('path', { d: 'M200,300 L200,252 L520,252 L520,334', fill: 'none', stroke: '#6E7C8A', 'stroke-width': 26, 'stroke-linejoin': 'round' }, sD.bg);
  E('path', { d: 'M200,300 L200,252 L520,252 L520,334', fill: 'none', stroke: '#2A3B4A', 'stroke-width': 16, 'stroke-linejoin': 'round' }, sD.bg);
  const steam = []; for (let k = 0; k < 4; k++) steam.push(E('circle', { r: 8, fill: '#FFFFFF' }, sD.bg));
  const STEAM = [[200, 300], [200, 252], [520, 252], [520, 334]];
  const turb = enTurbine(sD.bg, 0.8); tr(turb, 520, 392);
  E('rect', { x: 580, y: 384, width: 100, height: 16, fill: '#8F9CAB', stroke: SC_INK, 'stroke-width': 3 }, sD.bg);
  const gen = G(sD.bg); tr(gen, 770, 392);
  E('rect', { x: -90, y: -66, width: 180, height: 132, rx: 14, fill: '#3A4B5C', stroke: SC_INK, 'stroke-width': 5 }, gen);
  E('rect', { x: -78, y: -40, width: 24, height: 80, rx: 4, fill: '#E8424F', stroke: SC_INK, 'stroke-width': 3 }, gen);
  E('rect', { x: 54, y: -40, width: 24, height: 80, rx: 4, fill: '#3B82F6', stroke: SC_INK, 'stroke-width': 3 }, gen);
  let coil = 'M-44,0'; for (let k = 0; k < 8; k++) coil += ` Q${-38 + k * 11},${k % 2 ? 30 : -30} ${-33 + k * 11},0`;
  const coilP = E('path', { d: coil, fill: 'none', stroke: '#E8742A', 'stroke-width': 7, 'stroke-linecap': 'round' }, gen);
  const wires = wire(sD.bg, [[860, 382], [1170, 382]], { color: '#E6EEF4', width: 6, dotColor: C.energy, spacing: 40 });
  // labels
  const lFurn = T(sD.hud, 170, 650, 'furnace', { size: 30, weight: 700, anchor: 'middle', fill: '#FFB27A' });
  const lSteam = supplyRich(sD.hud, 340, 222, 'water → **steam**', { size: 32, fill: C.ink, boldFill: '#FFFFFF' });
  const lTurb = T(sD.hud, 520, 500, '**turbine**', { size: 34, weight: 600, anchor: 'middle', fill: '#C9D3DC' });
  const lGen = T(sD.hud, 770, 500, '**generator**', { size: 34, weight: 600, anchor: 'middle', fill: '#FFC247' });
  const lWire = T(sD.hud, 1015, 432, 'to the wires', { size: 28, weight: 600, anchor: 'middle', fill: C.energy });
  // the store chain, filed above the cutaway
  const chain = G(sD.hud);
  const bxC = supplyBox(chain, 'CHEMICAL', '(fuel)', '#FFC247'); tr(bxC, 165, 150);
  const bxT = supplyBox(chain, 'THERMAL', '(steam)', '#FF8A3D'); tr(bxT, 395, 150);
  const bxK = supplyBox(chain, 'KINETIC', '(turbine)', '#FF6B5C'); tr(bxK, 625, 150);
  const ar1 = arrow(chain, 252, 150, 308, 150, { color: '#FFFFFF', width: 6 });
  const ar2 = arrow(chain, 482, 150, 538, 150, { color: '#FFFFFF', width: 6 });
  const ar3 = arrow(chain, 714, 150, 978, 150, { color: '#FFE45C', width: 9 });
  const lElec = T(chain, 846, 205, 'ELECTRICALLY', { size: 28, weight: 800, anchor: 'middle', fill: '#FFE45C', ls: 1 });
  const chMeter = enMeter(chain, 0.42); tr(chMeter, 1060, 150);
  const lHere = T(chain, 1060, 242, 'here!', { size: 30, weight: 800, anchor: 'middle', fill: '#7CFFB2' });

  /* ===== E: skip the steam (wind, falling water, solar) ===== */
  const sE = shot();
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#0F2C3A', '#0A1B27', true) }, sE.bg);
  const PX = [220, 600, 980];
  const panels = PX.map((x, k) => {
    const g = G(sE.hud);
    E('rect', { x: x - 175, y: 120, width: 350, height: 360, rx: 18, fill: k === 0 ? linGrad('#7CCBFF', '#D9F1FF', true) : k === 1 ? linGrad('#8FD3A8', '#4A8A5E', true) : linGrad('#5EC4FF', '#BDE9FF', true), stroke: C.line, 'stroke-width': 4 }, g);
    return g;
  });
  // wind
  const pWind = enWind(panels[0], 0.68); tr(pWind, 250, 470);
  const swirls = []; for (let k = 0; k < 3; k++) swirls.push(E('path', { d: 'M0,0 q24,-12 48,0 q24,12 48,0', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 5, 'stroke-linecap': 'round' }, panels[0]));
  T(panels[0], 70, 160, 'WIND', { size: 30, weight: 800, fill: '#1E3560' });
  // falling water: reservoir, dam, pipe, a small turbine
  { const g = panels[1];
    E('rect', { x: 432, y: 200, width: 110, height: 200, fill: '#4CC9F0', stroke: '#1D84A6', 'stroke-width': 3 }, g);
    E('path', { d: 'M542,180 L590,180 L630,470 L542,470 Z', fill: '#B9B4AA', stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
    E('path', { d: 'M560,380 Q640,380 660,440', fill: 'none', stroke: '#1D84A6', 'stroke-width': 18, 'stroke-linecap': 'round' }, g);
    T(g, 450, 160, 'FALLING WATER', { size: 28, weight: 800, fill: '#103A22' }); }
  const fall = E('path', { d: 'M560,380 Q640,380 660,440', fill: 'none', stroke: '#BDEBFF', 'stroke-width': 8, 'stroke-linecap': 'round', 'stroke-dasharray': '14 14' }, panels[1]);
  const wTurb = enTurbine(panels[1], 0.42); tr(wTurb, 690, 430);
  // solar
  { const g = panels[2];
    T(g, 830, 160, 'SOLAR CELLS', { size: 28, weight: 800, fill: '#1E3560' }); }
  const pSun = G(panels[2]); E('circle', { r: 70, fill: glow('#FFD24A') }, pSun); E('circle', { r: 30, fill: ball('#FFE066', '#F5A300') }, pSun); tr(pSun, 1100, 190); pSun.upd = t => tr(pSun, 1100, 190, 1 + 0.04 * Math.sin(t * 2) * AMP);
  const rays = []; for (let k = 0; k < 3; k++) rays.push(E('line', { x1: 0, y1: 0, x2: 0, y2: 0, stroke: '#FFE45C', 'stroke-width': 6, 'stroke-linecap': 'round', 'stroke-dasharray': '16 12' }, panels[2]));
  const pSol = enSolar(panels[2], 1.0); tr(pSol, 950, 380);
  const noTurb = G(panels[2]); { E('circle', { r: 24, fill: '#2A3B4A', stroke: SC_INK, 'stroke-width': 3 }, noTurb); E('path', { d: 'M0,-18 L0,18 M-18,0 L18,0 M-13,-13 L13,13 M13,-13 L-13,13', stroke: '#C9D3DC', 'stroke-width': 4 }, noTurb); const x = cross(noTurb, 26); tr(x, 0, 0); } tr(noTurb, 870, 270);
  const eLab = [
    [supplyRich(sE.hud, 220, 522, '**kinetic** store (air)', { size: 30, boldFill: '#FF6B5C' }), T(sE.hud, 220, 560, '→ spins a turbine', { size: 28, weight: 600, anchor: 'middle', fill: C.muted })],
    [supplyRich(sE.hud, 600, 522, '**gravitational** store', { size: 30, boldFill: '#5B8DEF' }), T(sE.hud, 600, 560, '→ spins a turbine', { size: 28, weight: 600, anchor: 'middle', fill: C.muted })],
    [supplyRich(sE.hud, 980, 522, 'light → **electricity**', { size: 30, boldFill: C.energy }), T(sE.hud, 980, 560, 'no turbine at all!', { size: 28, weight: 600, anchor: 'middle', fill: C.good })],
  ];

  /* ===== F: at the plant (reliable, but) ===== */
  const sF = shot();
  const cRel1 = supplyChip(sF.hud, '**reliable**: day or night ✓', { size: 32, stroke: C.good, boldFill: C.good });
  const cRel2 = supplyChip(sF.hud, 'a little fuel, **a lot of energy** ✓', { size: 32, stroke: C.good, boldFill: C.good });
  const cBut1 = supplyChip(sF.hud, 'releases **carbon dioxide** ✗', { size: 32, stroke: C.bad, boldFill: '#B9C9D8' });
  const cBut2 = supplyChip(sF.hud, 'a greenhouse gas → **climate change**', { size: 30, stroke: C.bad, boldFill: '#FF9AA4' });
  const cBut3 = supplyChip(sF.hud, '**non-renewable**: will run out ✗', { size: 32, stroke: C.bad, boldFill: '#FF9AA4' });
  const cloud = G(sF.fg), cloudIn = G(cloud);
  [[-62, 10, 40], [-14, -16, 52], [42, -4, 44], [78, 16, 30], [0, 22, 40]].forEach(([x, y, r]) => E('circle', { cx: x, cy: y, r, fill: '#8F9CAB', stroke: '#57636F', 'stroke-width': 3 }, cloudIn));
  E('rect', { x: -90, y: 6, width: 180, height: 40, rx: 20, fill: '#8F9CAB' }, cloudIn);
  supplyRich(cloudIn, 0, 24, 'CO_2', { size: 44, weight: 800, fill: '#22303A' });

  /* ===== G: Colin's confessional ===== */
  const sG = shot();
  const confC = enConf(sG.bg, 'colin');
  card(sG.hud, 610, 150, 550, 440, { fill: C.card, stroke: C.line, opacity: 0.95 });
  T(sG.hud, 640, 215, 'TO MAKE ME:', { size: 30, weight: 700, fill: C.muted });
  const barMake = E('rect', { x: 640, y: 236, width: 0, height: 46, rx: 6, fill: ball('#5A606A', '#1E2126'), stroke: SC_INK, 'stroke-width': 3 }, sG.hud);
  const lMake = T(sG.hud, 885, 330, '300 000 000 years', { size: 40, weight: 800, anchor: 'middle', fill: '#FFC247' });
  const lBurnH = T(sG.hud, 640, 405, 'TO BURN ME:', { size: 30, weight: 700, fill: C.muted });
  const barBurn = E('rect', { x: 640, y: 426, width: 3, height: 46, fill: C.bad }, sG.hud);
  const lBurn = T(sG.hud, 664, 462, '← 20 minutes', { size: 40, weight: 800, fill: C.bad });
  const lScale = T(sG.hud, 885, 548, '(to scale, you could not even see it)', { size: 26, weight: 600, anchor: 'middle', fill: C.muted, font: FB });

  /* ===== H/I: the office (nuclear, uranium) ===== */
  const sH = shot();
  const atom = enStoreIcon(sH.fg, 'nuclear', 0.9);
  const n1 = supplyRich(sH.fg, 890, 240, 'nuclear: hardly any **CO_2** ✓', { size: 32, fill: dark, boldFill: '#1E7A4A' });
  const n2 = supplyRich(sH.fg, 890, 320, 'so... **renewable?**', { size: 42, fill: dark, boldFill: '#1E9E5A' });
  const stDen = enStamp(sH.fg, 'DENIED'); tr(stDen, 890, 300, 0.78, 0);
  const u1 = supplyRich(sH.fg, 890, 232, 'nuclear fuel = **uranium**', { size: 36, fill: dark, boldFill: '#7550C4' });
  const u2 = T(sH.fg, 890, 296, 'mined → it will run out', { size: 32, weight: 600, anchor: 'middle', fill: dark });
  const u3 = supplyChip(sH.fg, '**NON-RENEWABLE**', { size: 36, fill: '#D32F2F', color: '#FFFFFF', stroke: SC_INK });

  /* ===== J: non-renewable vs renewable ===== */
  const sJ = shot();
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#0F2C3A', '#0A1B27', true) }, sJ.bg);
  E('line', { x1: 420, y1: 130, x2: 420, y2: 620, stroke: C.line, 'stroke-width': 4 }, sJ.bg);
  const jL = G(sJ.hud);
  T(jL, 225, 162, 'NON-RENEWABLE', { size: 36, weight: 800, anchor: 'middle', fill: C.bad });
  T(jL, 225, 202, 'will run out', { size: 28, weight: 600, anchor: 'middle', fill: '#FF9AA4' });
  const nonR = ['coal', 'oil', 'natural gas', 'nuclear (uranium)'].map(s => chip(jL, s, { size: 30, fill: 'rgba(255,96,112,0.16)', stroke: C.bad, sw: 3 }));
  const jR = G(sJ.hud);
  T(jR, 805, 162, 'RENEWABLE', { size: 36, weight: 800, anchor: 'middle', fill: C.good });
  const jSub = supplyChip(jR, 'constantly replaced: **won\'t run out**', { size: 28, stroke: C.good, boldFill: C.good });
  const RCOL = ['#FFE45C', '#9FD8FF', '#4CC9F0', '#8FB8FF', '#3FA9F5', '#FF6B5C', '#5BD27A'];
  const RN = ['solar', 'wind', 'hydroelectric', 'tidal', 'wave', 'geothermal', 'biomass'];
  const RXY = [[550, 300], [720, 300], [890, 300], [1060, 300], [635, 480], [805, 480], [975, 480]];
  const rIcons = RN.map((n, k) => {
    const g = G(jR), i = G(g);
    if (k === 0) { const sl = enSolar(i, 0.5); tr(sl, 0, 12); E('circle', { cx: 34, cy: -36, r: 14, fill: '#FFE45C', stroke: '#F5A300', 'stroke-width': 3 }, i); }
    else if (k === 1) { const w = enWind(i, 0.3); tr(w, 0, 50); g.wind = w; }
    else if (k === 2) {
      E('rect', { x: -52, y: -30, width: 44, height: 76, fill: '#4CC9F0' }, i);
      E('path', { d: 'M-10,-44 L12,-44 L30,46 L-10,46 Z', fill: '#B9B4AA', stroke: SC_INK, 'stroke-width': 3, 'stroke-linejoin': 'round' }, i);
      E('path', { d: 'M16,18 Q40,18 50,44', fill: 'none', stroke: '#4CC9F0', 'stroke-width': 9, 'stroke-linecap': 'round' }, i);
    } else if (k === 3) {
      E('path', { d: 'M-20,-50 A22,22 0 1 0 -20,-6 A17,17 0 1 1 -20,-50 Z', fill: '#E9F2F7' }, i);
      E('rect', { x: -52, y: 10, width: 104, height: 36, rx: 6, fill: '#5B8DEF' }, i);
      E('path', { d: 'M30,-40 L30,0 M20,-30 L30,-42 L40,-30 M20,-10 L30,2 L40,-10', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, i);
    } else if (k === 4) {
      E('path', { d: 'M-52,44 Q-46,-6 -6,-34 Q30,-52 48,-22 Q34,-34 18,-22 Q8,-10 24,0 Q36,8 50,0 Q46,30 52,44 Z', fill: ball('#3FA9F5', '#1D5FA6'), stroke: '#E6F7FF', 'stroke-width': 3, 'stroke-linejoin': 'round' }, i);
    } else if (k === 5) {
      E('rect', { x: -52, y: 0, width: 104, height: 46, rx: 6, fill: '#6B4A33' }, i);
      E('ellipse', { cx: 0, cy: 34, rx: 34, ry: 10, fill: '#FF6B5C' }, i);
      E('path', { d: 'M-14,0 q-10,-14 0,-26 q10,-12 0,-26 M14,0 q-10,-14 0,-26 q10,-12 0,-26', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 5, 'stroke-linecap': 'round' }, i);
    } else {
      const lf = leaf(i, 0.32); tr(lf, -46, -10, 1, -30);
      E('rect', { x: -20, y: 14, width: 70, height: 28, rx: 14, fill: '#8B5A2B', stroke: SC_INK, 'stroke-width': 3 }, i);
      E('ellipse', { cx: 50, cy: 28, rx: 9, ry: 14, fill: '#E3B272', stroke: SC_INK, 'stroke-width': 3 }, i);
    }
    T(g, 0, 86, n, { size: 26, weight: 700, anchor: 'middle', fill: RCOL[k] });
    return g;
  });

  /* ===== K: Six Wild Horses ===== */
  const sK = shot();
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#FFB27A', '#FFE6B0', true) }, sK.bg);
  E('rect', { x: 0, y: 470, width: 1200, height: 280, fill: '#6FBF5E' }, sK.bg);
  const tufts = E('path', { d: '', stroke: '#3F8C3A', 'stroke-width': 5, 'stroke-linecap': 'round' }, sK.bg);
  const HX = k => 105 + k * 165;
  const horses = RN.map((n, k) => { const h = supplyHorse(sK.bg, ['#6B4423', '#8B5A2B', '#5A3A1A', '#7A4A26', '#6B4423', '#8B5A2B', '#5A3A1A'][k]); return h; });
  const WORDS = ['Six', 'Wild', 'Horses', 'Took', 'Wet', 'Grass', 'Back'];
  const hInit = WORDS.map((w, k) => enOutlineText(T(sK.hud, HX(k), 250, w[0], { size: 72, weight: 800, anchor: 'middle', fill: RCOL[k] }), '#2A1A10', 8));
  E('rect', { x: 0, y: 512, width: 1200, height: 136, fill: '#0A1B27', opacity: 0.55 }, sK.bg);
  const hWord = WORDS.map((w, k) => { const tx = T(sK.hud, HX(k), 552, `**${w[0]}**${w.slice(1)}`, { size: 38, weight: 700, anchor: 'middle', fill: '#FFFFFF' }); tx.firstChild.setAttribute('fill', RCOL[k]); return tx; });
  const hName = RN.map((n, k) => T(sK.hud, HX(k), k % 2 ? 628 : 598, n, { size: 26, weight: 600, anchor: 'middle', fill: '#C9D3DC', font: FB }));

  /* ===== L: unreliable ===== */
  const sL = shot();
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#0F2C3A', '#0A1B27', true) }, sL.bg);
  const cU1 = supplyChip(sL.hud, 'most release little **CO_2** ✓', { size: 32, stroke: C.good, boldFill: '#B9C9D8' });
  const cU2 = supplyChip(sL.hud, 'but many are **unreliable** ✗', { size: 32, stroke: C.bad, boldFill: '#FF9AA4' });
  const night = G(sL.hud);
  E('rect', { x: 50, y: 290, width: 450, height: 270, rx: 18, fill: linGrad('#0B1030', '#1E2A5A', true), stroke: C.line, 'stroke-width': 4 }, night);
  E('path', { d: [[110, 330], [190, 360], [300, 320], [420, 350], [460, 410], [150, 420]].map(([x, y]) => `M${x},${y} l0.1,0`).join(' '), stroke: '#FFFFFF', 'stroke-width': 7, 'stroke-linecap': 'round' }, night);
  E('path', { d: 'M400,312 A30,30 0 1 0 400,372 A23,23 0 1 1 400,312 Z', fill: '#F4F1E6' }, night);
  const nSol = enSolar(night, 1.0); tr(nSol, 260, 470);
  E('path', { d: 'M-90,-10 L70,-50 L90,10 L-70,50 Z', fill: '#000000', opacity: 0.45, transform: 'translate(260 470)' }, night);
  const nLab = T(night, 275, 606, 'no solar at night', { size: 30, weight: 700, anchor: 'middle', fill: '#C9D3DC' });
  const calm = G(sL.hud);
  E('rect', { x: 700, y: 290, width: 450, height: 270, rx: 18, fill: linGrad('#7CCBFF', '#D9F1FF', true), stroke: C.line, 'stroke-width': 4 }, calm);
  const cSun = G(calm); E('circle', { r: 50, fill: glow('#FFD24A') }, cSun); E('circle', { r: 22, fill: ball('#FFE066', '#F5A300') }, cSun); tr(cSun, 1090, 340); cSun.upd = () => {};
  const cWind = enWind(calm, 0.64); tr(cWind, 880, 558);
  E('path', { d: 'M1040,558 L1040,420', stroke: '#5A5446', 'stroke-width': 5 }, calm);
  E('path', { d: 'M1040,424 Q1050,450 1044,480 L1040,480 Z', fill: '#E8424F' }, calm);   // limp flag
  const cLab = T(calm, 925, 606, 'no wind on a calm day', { size: 30, weight: 700, anchor: 'middle', fill: '#C9D3DC' });

  /* ===== M: the mix ===== */
  const sM = shot();
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#7CCBFF', '#E3F4FF', true) }, sM.bg);
  E('rect', { x: 0, y: 610, width: 1200, height: 140, fill: '#7FB86E' }, sM.bg);
  const BLK = [[50, 300, '#F2C6A0'], [165, 380, '#BFD9F2'], [280, 260, '#F7E3A1'], [395, 340, '#C9E7C3'], [510, 290, '#F2C6A0']];
  const roofs = BLK.map(([x, h, col]) => {
    E('rect', { x, y: 610 - h, width: 100, height: h, fill: col, stroke: '#8C9AA6', 'stroke-width': 3 }, sM.bg);
    let d = ''; for (let y = 610 - h + 22; y < 600; y += 24) d += `M${x + 10},${y} L${x + 90},${y} `;
    E('path', { d, stroke: '#8C9AA6', 'stroke-width': 4, 'stroke-dasharray': '10 7' }, sM.bg);
    const r = G(sM.bg); tr(r, x + 50, 610 - h);
    E('path', { d: 'M-40,-2 L-30,-22 L40,-22 L30,-2 Z', fill: '#1E3A8A', stroke: '#7FB6FF', 'stroke-width': 3, 'stroke-linejoin': 'round' }, r);
    return r;
  });
  const mixW = enOutlineText(T(sM.hud, 880, 172, 'MIX', { size: 84, weight: 800, anchor: 'middle', fill: '#FFE45C', ls: 6 }), '#5A3A07', 10);
  const sgT = T(sM.hud, 880, 232, 'Singapore’s electricity', { size: 30, weight: 700, anchor: 'middle', fill: '#1E3560' });
  const pie = G(sM.hud); tr(pie, 880, 370);
  E('circle', { r: 112, fill: '#5B8DEF', stroke: SC_INK, 'stroke-width': 5 }, pie);
  const wedge = E('path', { d: '', fill: '#FFE45C', stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, pie);
  const pieCov = E('path', { d: '', fill: '#BFE3FF' }, pie);
  T(pie, -10, 2, 'natural', { size: 32, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  T(pie, -10, 38, 'gas', { size: 32, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  const cMix1 = supplyChip(sM.hud, 'mostly **natural gas**', { size: 32, stroke: '#5B8DEF', boldFill: '#9FC0FF' });
  const cMix2 = supplyChip(sM.hud, '+ **solar** panels on HDB roofs', { size: 30, stroke: '#FFE45C', boldFill: '#FFE45C' });

  /* ===== N: Kavya at the open front door (so) ===== */
  const sN = shot();
  const think = G(sN.bg);
  [[600, 392, 9], [632, 360, 13], [672, 326, 18]].forEach(([x, y, r]) => E('circle', { cx: x, cy: y, r, fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 3 }, think));
  E('ellipse', { cx: 890, cy: 228, rx: 250, ry: 96, fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 4 }, think);
  const th1 = T(think, 850, 214, 'nothing used up?', { size: 32, weight: 700, anchor: 'middle', fill: SC_INK });
  const th2 = T(think, 850, 262, '...in Theo’s basement?', { size: 30, weight: 700, anchor: 'middle', fill: '#C2451A' });

  /* ===== O: CASE CLOSED, saving energy (office) ===== */
  const sO = shot();
  const fileO = G(sO.fg);
  E('rect', { x: -290, y: -160, width: 580, height: 320, rx: 10, fill: '#E8C77A', stroke: '#9C7A2E', 'stroke-width': 4 }, fileO);
  E('path', { d: 'M-290,-150 L-290,-178 Q-290,-186 -282,-186 L-150,-186 Q-140,-186 -136,-176 L-130,-160 Z', fill: '#E8C77A', stroke: '#9C7A2E', 'stroke-width': 4 }, fileO);
  T(fileO, 0, -104, 'CASE 14: THE MISSING JOULES', { size: 32, weight: 800, anchor: 'middle', fill: '#5A3A1A' });
  const fl1 = T(fileO, -250, -34, 'Destroyed: **0 J**', { size: 36, weight: 700, fill: '#5A3A1A', boldFill: '#1E7A4A' });
  const fl2 = T(fileO, -250, 22, 'Wasted (dissipated as heat): **lots**', { size: 28, weight: 700, fill: '#5A3A1A', boldFill: '#C2451A' });
  const stClosed = enStamp(fileO, 'CASE CLOSED'); tr(stClosed, 10, 100, 0.66, -5);
  const board = G(sO.fg);
  enBoard(board, 620, 380, 'SAVING ENERGY');
  const sv1 = T(board, 0, -40, '≠ stopping joules vanishing', { size: 34, weight: 600, anchor: 'middle', fill: SC_INK });
  const svS = strike(board, -232, -52, 232, '#D32F2F');
  const sv2 = T(board, 0, 44, '= **wasting less**', { size: 52, weight: 700, anchor: 'middle', fill: SC_INK, boldFill: '#1E9E5A' });
  const sv3 = T(board, 0, 112, 'of what we pay for', { size: 30, weight: 600, anchor: 'middle', fill: '#5A5446' });

  /* ===== P: how to waste less ===== */
  const sP = shot();
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#0F2C3A', '#0A1B27', true) }, sP.bg);
  const pHead = T(sP.hud, 600, 140, 'HOW TO WASTE LESS', { size: 46, weight: 800, anchor: 'middle', fill: C.good, ls: 2 });
  const CXS = [220, 600, 980];
  const hCards = CXS.map(x => { const g = G(sP.hud); card(g, x - 160, 180, 320, 430, { fill: C.card, stroke: C.line }); return g; });
  const hTicks = CXS.map((x, k) => { const tk = tick(hCards[k], 20); tr(tk, x + 118, 222); return tk; });
  // 1 insulate: a house with loft insulation and double glazing
  { const g = G(hCards[0]); tr(g, 220, 350);
    E('rect', { x: -90, y: -10, width: 180, height: 110, fill: '#F2C6A0', stroke: SC_INK, 'stroke-width': 4 }, g);
    E('path', { d: 'M-112,-6 L0,-104 L112,-6 Z', fill: '#C2453A', stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
    E('path', { d: 'M-80,-14 L0,-84 L80,-14 Z', fill: '#FFE29A' }, g);
    let z = 'M-66,-20'; for (let k = 1; k <= 12; k++) z += ` L${-66 + k * 11},${k % 2 ? -34 : -20}`;
    E('path', { d: z, fill: 'none', stroke: '#E0A800', 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
    E('rect', { x: -70, y: 14, width: 60, height: 50, fill: '#BFE3FF', stroke: SC_INK, 'stroke-width': 4 }, g);
    E('rect', { x: -63, y: 21, width: 46, height: 36, fill: 'none', stroke: '#4A88B8', 'stroke-width': 3 }, g);
    E('rect', { x: 26, y: 26, width: 40, height: 74, fill: '#8B5A2B', stroke: SC_INK, 'stroke-width': 3 }, g);
    supplyRich(hCards[0], 220, 520, '**insulate** homes', { size: 34, boldFill: C.good });
    T(hCards[0], 220, 560, 'loft insulation,', { size: 26, weight: 600, anchor: 'middle', fill: C.muted, font: FB });
    T(hCards[0], 220, 592, 'double glazing', { size: 26, weight: 600, anchor: 'middle', fill: C.muted, font: FB }); }
  // 2 efficient appliances: an LED bulb and a high efficiency gauge
  { const g = G(hCards[1]); tr(g, 600, 340);
    E('circle', { cx: -60, cy: 0, r: 120 * 0.5, fill: glow('#FFF7C2'), opacity: 0.9 }, g);
    E('path', { d: 'M-60,-52 C-26,-52 -18,-20 -26,0 C-32,14 -40,22 -40,34 L-80,34 C-80,22 -88,14 -94,0 C-102,-20 -94,-52 -60,-52 Z', fill: '#FFF7C2', stroke: SC_INK, 'stroke-width': 4 }, g);
    E('rect', { x: -82, y: 34, width: 44, height: 30, rx: 5, fill: '#8F9CAB', stroke: SC_INK, 'stroke-width': 3 }, g);
    T(g, -60, 0, 'LED', { size: 26, weight: 800, anchor: 'middle', fill: '#B57B12' });
    const ga = G(g); tr(ga, 64, 30);
    E('path', { d: 'M-58,0 A58,58 0 0 1 58,0 Z', fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 4 }, ga);
    E('path', { d: 'M-44,0 A44,44 0 0 1 -13.6,-41.8', fill: 'none', stroke: '#FF6070', 'stroke-width': 10 }, ga);
    E('path', { d: 'M-13.6,-41.8 A44,44 0 0 1 35.6,-25.9', fill: 'none', stroke: '#FFC247', 'stroke-width': 10 }, ga);
    E('path', { d: 'M35.6,-25.9 A44,44 0 0 1 44,0', fill: 'none', stroke: '#56D69B', 'stroke-width': 10 }, ga);
    g.needle = E('path', { d: 'M0,-4 L46,0 L0,4 Z', fill: '#E8424F', stroke: SC_INK, 'stroke-width': 2 }, ga);
    E('circle', { r: 6, fill: SC_INK }, ga);
    hCards[1].needle = g.needle;
    supplyRich(hCards[1], 600, 520, '**efficient** appliances', { size: 30, boldFill: C.good });
    T(hCards[1], 600, 560, 'less wasted as heat', { size: 26, weight: 600, anchor: 'middle', fill: C.muted, font: FB }); }
  // 3 switch off: a TV with a red standby light
  const tvDot = (() => { const g = G(hCards[2]); tr(g, 980, 330);
    E('rect', { x: -110, y: -76, width: 220, height: 144, rx: 12, fill: '#1A2A33', stroke: SC_INK, 'stroke-width': 5 }, g);
    E('rect', { x: -96, y: -62, width: 192, height: 116, rx: 6, fill: '#0A1218' }, g);
    E('path', { d: 'M-30,68 L-44,96 L44,96 L30,68', fill: 'none', stroke: '#8F9CAB', 'stroke-width': 6, 'stroke-linejoin': 'round' }, g);
    const d = E('circle', { cx: 88, cy: 58, r: 8, fill: '#FF3B3B' }, g);
    hCards[2].glowDot = E('circle', { cx: 88, cy: 58, r: 22, fill: glow('#FF3B3B') }, g);
    supplyRich(hCards[2], 980, 520, '**switch off**', { size: 34, boldFill: C.good });
    T(hCards[2], 980, 560, 'don’t leave things', { size: 26, weight: 600, anchor: 'middle', fill: C.muted, font: FB });
    T(hCards[2], 980, 592, 'on standby', { size: 26, weight: 600, anchor: 'middle', fill: C.muted, font: FB });
    return d; })();
  const offT = T(hCards[2], 980, 300, 'OFF', { size: 40, weight: 800, anchor: 'middle', fill: '#56D69B' });

  /* ===== Q: Kavya at the door (mum, who) ===== */
  const sQ = shot();
  const beep = supplyChip(sQ.hud, '*beep*  aircon **OFF**', { size: 30, stroke: '#7FD3FF', boldFill: '#7FD3FF' });
  const mumB = enBubble(sQ.hud, 'Who are you talking to?', { size: 32, tail: 'left' });

  /* ---------- the cast ---------- */
  const colin = cast(castL, 'colin'), con = cast(castL, 'con'), jules = cast(castL, 'jules');
  const pat = cast(castL, 'pat'), kav = cast(castL, 'kavya'), theo = cast(castL, 'theo');
  const CAST = [colin, con, jules, pat, kav, theo];
  // the cutaway's furnace front sits in front of Colin
  const furnFront = G(fgL);
  E('path', { d: 'M70,440 L270,440 L270,600 L70,600 Z M90,470 L90,590 L250,590 L250,470 Z', 'fill-rule': 'evenodd', fill: '#4A3A32', stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, furnFront);

  /* ---------- shots ---------- */
  const cut = id => at(id) - 0.06;
  const SHOTS = [['A', -9], ['B', cut('hi')], ['C', cut('station')], ['D', mid('station', 0.2)], ['E', cut('skip')], ['F', cut('reliable')],
    ['G', cut('thcolin')], ['H', cut('nuclear')], ['J', cut('renew')], ['K', cut('horses')], ['L', cut('unreliable')], ['M', cut('mix')],
    ['N', cut('so')], ['O', cut('closed')], ['P', cut('how')], ['Q', cut('mum')]];
  const shotAt = t => { let s = 'A'; for (const [k, t0] of SHOTS) if (t >= t0) s = k; return s; };
  const GR = { A: sA, B: sB, C: sC, D: sD, E: sE, F: sF, G: sG, H: sH, J: sJ, K: sK, L: sL, M: sM, N: sN, O: sO, P: sP, Q: sQ };
  const SET = { A: setCor, N: setCor, Q: setCor, C: setPlant, F: setPlant, H: setOff, O: setOff };

  return t => {
    const sh = shotAt(t);
    for (const k in GR) { const v = k === sh ? 1 : 0; op(GR[k].bg, v); op(GR[k].fg, v); op(GR[k].hud, v); }
    [setCor, setPlant, setOff].forEach(s => op(s, SET[sh] === s ? 1 : 0));
    CAST.forEach(c => op(c, 0));
    op(furnFront, sh === 'D' ? 1 : 0);
    supplyCam(world, 600, 375, 1);
    const show = (c, x, y, s, st) => { op(c, 1); tr(c, x, y, s); c.set(Object.assign({ t }, st)); };

    /* ---------- A: where do the joules come from? ---------- */
    if (sh === 'A' || sh === 'N' || sh === 'Q') { cor.upd(t); cable.upd(t, 70); }
    if (sh === 'A') {
      op(doorOpen, 0);
      supplyCam(world, 240, 330, 1 + 0.08 * P(t, at('where'), end('where') + 0.5 - at('where'), linear));
      supplyPop(qMark, t, mid('where', 0.25), 90, 250, 1, 8 * Math.sin(t * 3) * AMP);
      supplyPop(qChip, t, mid('where', 0.4), 860, 170);
    }

    /* ---------- B: Colin, coal (hi, family) ---------- */
    if (sh === 'B') {
      const fam = t >= at('family') - 0.1;
      const lit = P(t, mid('family', 0.56), 0.2, linear);
      let mood = 'annoyed', look = 0;
      if (fam) { look = t > mid('family', 0.08) && t < mid('family', 0.45) ? 0.75 : 0; if (t > mid('family', 0.56) && t < mid('family', 0.7)) mood = 'shock'; }
      show(colin, 360, 400, 1.4, { talk: talk(t, 'colin'), mood, look, sweat: lit });
      ltColin.set(win(t, at('hi') + 0.1, at('hi') + 3.4, 0.3));
      // hi: 300 million years, fossil fuel
      const hiOut = 1 - P(t, at('family') - 0.1, 0.25, linear);
      depth.set(P(t, mid('hi', 0.32), 0.8, ease)); op(depth, hiOut);
      const yp = supplyPop(cYears, t, mid('hi', 0.35), 870, 230); op(cYears, clamp(yp * 2.5) * hiOut);
      const fp = supplyPop(cFossil, t, mid('hi', 0.74), 870, 380, 1, -3); op(cFossil, clamp(fp * 2.5) * hiOut);
      // family: photos, match, burn
      supplyPop(fOil, t, mid('family', 0.1), 760, 220, 0.82, -3); if (!fam) op(fOil, 0);
      supplyPop(fGas, t, mid('family', 0.26), 1010, 220, 0.82, 3); if (!fam) op(fGas, 0);
      supplyPop(cFam, t, mid('family', 0.4), 885, 440); if (!fam) op(cFam, 0);
      const mIn = P(t, mid('family', 0.44), 0.4, easeOut), mOut = P(t, mid('family', 0.62), 0.4, easeIn);
      op(match, fam ? clamp(mIn * 3) * (1 - mOut) : 0);
      tr(match, lerp(700, 470, mIn) + 200 * mOut, lerp(660, 560, mIn) + 60 * mOut, 1, lerp(-10, -30, mIn));
      matchF.upd(t, 1);
      op(colinFire, fam ? lit : 0); tr(colinFire, 360, 548); colinFire.upd(t, lit);
      supplyPop(burnRow, t, mid('family', 0.66), 680, 560); if (!fam) op(burnRow, 0);
    }

    /* ---------- C/F: the power station ---------- */
    if (sh === 'C' || sh === 'F') plant.upd(t);
    if (sh === 'C') {
      supplyCam(world, 760, 420, 1.12 - 0.08 * P(t, cut('station'), 1.6, easeOut));
      supplyPop(cPlant, t, at('station') + 0.15, 860, 650);
    }

    /* ---------- D: the cutaway (station), then the chain (chain) ---------- */
    if (sh === 'D') {
      const chainOn = t >= at('chain') - 0.1;
      show(colin, 170, 532, 0.42, { talk: talk(t, 'colin'), mood: 'annoyed', sweat: 1, smoke: 0, look: chainOn && t > mid('chain', 0.2) ? 0.9 : 0 });
      furnFire.upd(t, 1);
      const hot = P(t, mid('station', 0.25), 1.2, linear);
      bubs.forEach((b, k) => { const f = (t * 1.2 + k / 5) % 1; attr(b, 'cx', -40 + k * 40); attr(b, 'cy', 40 - f * 40); op(b, hot * (1 - f)); });
      const stOn = P(t, mid('station', 0.34), 0.6, linear);
      steam.forEach((c, k) => {
        const f = (t * 0.5 + k / 4) % 1, L = 48 + 320 + 82, s = f * L;
        let x, y; if (s < 48) { x = 200; y = 300 - s; } else if (s < 368) { x = 200 + (s - 48); y = 252; } else { x = 520; y = 252 + (s - 368); }
        attr(c, 'cx', x); attr(c, 'cy', y); op(c, stOn * 0.9);
      });
      const spin = P(t, mid('station', 0.52), 1.4, easeIn);
      tr(turb.firstChild.childNodes[1], 0, 0, 1, (spin * (t - mid('station', 0.52)) * 300 * AMP) % 360);
      const gOn = P(t, mid('station', 0.78), 0.6, linear);
      attr(coilP, 'stroke', gOn > 0.5 && Math.sin(t * 20) > -0.3 ? '#FFC247' : '#E8742A');
      wires.set(P(t, mid('station', 0.86), 0.4, linear)); wires.upd(t, 90);
      op(lFurn, P(t, mid('station', 0.22), 0.3, linear));
      supplyPopAt(lSteam, t, mid('station', 0.36), 340, 212); if (chainOn) op(lSteam, 1 - P(t, mid('chain', 0.12), 0.25, linear));
      supplyPopAt(lTurb, t, mid('station', 0.56), 520, 490);
      supplyPopAt(lGen, t, mid('station', 0.82), 770, 490);
      op(lWire, P(t, mid('station', 0.9), 0.3, linear));
      // the chain
      op(chain, chainOn ? 1 : 0);
      if (chainOn) {
        supplyPop(bxC, t, mid('chain', 0.04), 165, 150);
        ar1.set(P(t, mid('chain', 0.16), 0.3)); supplyPop(bxT, t, mid('chain', 0.2), 395, 150);
        ar2.set(P(t, mid('chain', 0.4), 0.3)); supplyPop(bxK, t, mid('chain', 0.44), 625, 150);
        const pe = P(t, mid('chain', 0.64), 1.1, ease);
        ar3.set(pe); op(lElec, P(t, mid('chain', 0.66), 0.3, linear));
        if (pe > 0) show(pat, lerp(740, 920, pe), 102, 0.4, { route: 'elec', mood: 'neutral', look: 0.6 });
        chMeter.upd(t); supplyPop(chMeter, t, mid('chain', 0.86), 1060, 150, 1);
        op(lHere, P(t, mid('chain', 0.88), 0.3, linear));
        const cp = P(t, at('chain') - 0.05, 0.45, pop);
        show(con, 1072, 600 + 30 * (1 - clamp(cp)), 0.72, { talk: talk(t, 'con'), mood: 'deadpan', look: -0.5 });
        op(con, clamp(cp * 3));
      }
    }

    /* ---------- E: skip the steam ---------- */
    if (sh === 'E') {
      show(jules, 600, 636, 0.55, { talk: talk(t, 'jules'), mood: 'happy', arms: 1 });
      const p1 = P(t, at('skip') - 0.05, 0.4, pop), p2 = P(t, mid('skip', 0.16), 0.4, pop), p3 = P(t, mid('skip', 0.5), 0.4, pop);
      [p1, p2, p3].forEach((p, k) => { op(panels[k], clamp(p * 2.5)); panels[k].setAttribute('transform', `translate(${PX[k]} 300) scale(${Math.max(0.01, 0.75 + 0.25 * p).toFixed(3)}) translate(${-PX[k]} -300)`); op(eLab[k][0], P(t, [at('skip'), mid('skip', 0.2), mid('skip', 0.55)][k] + 0.3, 0.3, linear)); op(eLab[k][1], P(t, [mid('skip', 0.1), mid('skip', 0.3), mid('skip', 0.8)][k], 0.3, linear)); });
      pWind.upd(t, 1.6 * AMP);
      swirls.forEach((s, k) => { const f = (t * 0.6 + k / 3) % 1; tr(s, 64 + f * 70, 250 + k * 44); op(s, Math.sin(f * Math.PI) * 0.9); });
      attr(fall, 'stroke-dashoffset', (-t * 60 * AMP).toFixed(1)); wTurb.upd(t, 1.4 * AMP);
      pSun.upd(t);
      rays.forEach((r, k) => { attr(r, 'x1', 1080 - k * 26); attr(r, 'y1', 220 + k * 18); attr(r, 'x2', 980 - k * 30); attr(r, 'y2', 350 + k * 10); attr(r, 'stroke-dashoffset', (-t * 50 * AMP).toFixed(1)); });
      op(noTurb, P(t, mid('skip', 0.78), 0.3, linear));
    }

    /* ---------- F: at the plant (reliable, but) ---------- */
    if (sh === 'F') {
      const but = t >= at('but') - 0.1;
      const mood = but ? (t > mid('but', 0.25) ? 'annoyed' : 'neutral') : (t > mid('reliable', 0.12) ? 'smug' : 'neutral');
      show(colin, 300, 470, 1.2, { talk: talk(t, 'colin'), mood, look: but ? 0.8 : 0, smoke: 1 });
      const rOut = 1 - P(t, at('but') - 0.1, 0.25, linear);
      const r1 = supplyPop(cRel1, t, mid('reliable', 0.12), 800, 200); op(cRel1, clamp(r1 * 2.5) * rOut);
      const r2 = supplyPop(cRel2, t, mid('reliable', 0.55), 800, 285); op(cRel2, clamp(r2 * 2.5) * rOut);
      if (but) {
        const cp = P(t, at('but') - 0.06, 0.4, pop);
        show(con, 1010, 500 + 30 * (1 - clamp(cp)), 0.95, { talk: talk(t, 'con'), mood: 'deadpan', look: -0.8 });
        op(con, clamp(cp * 3));
        supplyPop(cBut1, t, mid('but', 0.22), 720, 170);
        supplyPop(cBut2, t, mid('but', 0.42), 720, 245);
        supplyPop(cBut3, t, mid('but', 0.7), 720, 320);
        const cl = P(t, mid('but', 0.26), 1.2, easeOut);
        op(cloud, clamp(cl * 2)); tr(cloud, 310 + 6 * Math.sin(t * 0.8) * AMP, 200 - 30 * (1 - cl), Math.max(0.01, 0.5 + 0.5 * cl));
      } else { [cBut1, cBut2, cBut3, cloud].forEach(e => op(e, 0)); }
    }

    /* ---------- G: Colin's confessional ---------- */
    confC.set(sh === 'G' ? 1 : 0, t);
    if (sh === 'G') {
      const push = P(t, mid('thcolin', 0.62), end('thcolin') + 0.6 - mid('thcolin', 0.62), linear);
      supplyCam(world, 330, 400, 1 + 0.12 * push);
      show(colin, 330, 410, 1.45, { talk: talk(t, 'colin'), mood: t > mid('thcolin', 0.62) && t < mid('thcolin', 0.75) ? 'sad' : 'annoyed', smoke: 0.8 });
      attr(barMake, 'width', 500 * P(t, mid('thcolin', 0.04), 1.6, ease));
      op(lMake, P(t, mid('thcolin', 0.2), 0.3, linear));
      const bp = P(t, mid('thcolin', 0.38), 0.3, linear);
      op(lBurnH, bp); op(barBurn, bp); op(lBurn, P(t, mid('thcolin', 0.42), 0.3, linear));
      op(lScale, P(t, mid('thcolin', 0.55), 0.4, linear));
    }

    /* ---------- H: the office (nuclear, uranium) ---------- */
    if (sh === 'H') {
      const ur = t >= at('uranium') - 0.1;
      supplyCam(world, 600, 375, 1 + 0.03 * P(t, cut('nuclear'), 12, linear));
      const den = P(t, mid('uranium', 0.05), 0.35, linear);
      let jm = 'happy'; if (ur) jm = t < mid('uranium', 0.3) ? 'shock' : 'sad';
      show(con, 290, 440, 1.1, { talk: talk(t, 'con'), mood: 'deadpan', look: ur && t > mid('uranium', 0.3) ? 0.6 : 0.85 });
      show(jules, 1010, 545, 0.85, { talk: talk(t, 'jules'), mood: jm, look: ur ? -0.9 : -0.3, arms: ur ? 0.15 : 1 });
      op(atom, ur ? 1 - P(t, mid('uranium', 0.2), 0.3, linear) : P(t, at('nuclear'), 0.3, linear));
      tr(atom, 880, 455 + 6 * Math.sin(t * 4) * AMP, 1, t * 30 * AMP % 360);
      const clear = 1 - P(t, mid('uranium', 0.3), 0.25, linear);
      op(n1, P(t, mid('nuclear', 0.3), 0.3, linear) * clear);
      supplyPopAt(n2, t, mid('nuclear', 0.66), 890, 306); op(n2, clamp(P(t, mid('nuclear', 0.66), 0.45, pop) * 2.5) * clear);
      stDen.set(den); op(stDen, den > 0 ? clear : 0);
      op(u1, P(t, mid('uranium', 0.34), 0.3, linear));
      op(u2, P(t, mid('uranium', 0.55), 0.3, linear));
      supplyPop(u3, t, mid('uranium', 0.78), 880, 385, 1, -2); if (!ur) op(u3, 0);
    }

    /* ---------- J: non-renewable vs renewable ---------- */
    if (sh === 'J') {
      op(jL, P(t, at('renew'), 0.3, linear));
      nonR.forEach((c, k) => supplyPop(c, t, at('renew') + 0.1 + k * 0.12, 225, 275 + k * 74));
      supplyPop(jSub, t, mid('renew', 0.12), 805, 214);
      const RT = [0.48, 0.54, 0.6, 0.71, 0.76, 0.81, 0.9];
      rIcons.forEach((g, k) => supplyPop(g, t, mid('renew', RT[k]), RXY[k][0], RXY[k][1]));
      rIcons[1].wind.upd(t, 1.5 * AMP);
    }

    /* ---------- K: Six Wild Horses ---------- */
    if (sh === 'K') {
      let d = ''; for (let k = 0; k < 16; k++) { const x = ((k * 97 - t * 260 * AMP) % 1300 + 1300) % 1300 - 50; d += `M${x.toFixed(0)},${500 + (k % 3) * 40} l8,-16 M${(x + 10).toFixed(0)},${500 + (k % 3) * 40} l4,-18 `; }
      attr(tufts, 'd', d);
      horses.forEach((h, k) => { tr(h, HX(k), 440, 0.85); h.upd(t, k * 1.3); });
      const jy = 440 - 34 * 0.85 - 22 - Math.abs(Math.sin(t * TAU * 2.4 + 3 * 1.3)) * 8 * AMP;
      show(jules, HX(3) - 6, jy, 0.42, { talk: talk(t, 'jules'), mood: 'happy', arms: 1 });
      WORDS.forEach((w, k) => {
        const t0 = mid('horses', 0.04 + k * 0.125);
        supplyPop(hInit[k], t, t0, 0, 0);
        hInit[k].setAttribute('transform', `translate(${HX(k)} 230) scale(${Math.max(0.01, 0.6 + 0.4 * P(t, t0, 0.45, pop)).toFixed(3)}) translate(${-HX(k)} -230)`);
        op(hWord[k], P(t, t0, 0.25, linear));
        op(hName[k], P(t, t0 + 0.15, 0.3, linear));
      });
    }

    /* ---------- L: unreliable ---------- */
    if (sh === 'L') {
      show(con, 600, 455, 0.8, { talk: talk(t, 'con'), mood: 'deadpan', look: t > mid('unreliable', 0.72) ? 0.7 : t > mid('unreliable', 0.52) ? -0.7 : 0 });
      supplyPop(cU1, t, mid('unreliable', 0.06), 600, 160);
      supplyPop(cU2, t, mid('unreliable', 0.32), 600, 236);
      supplyPop(night, t, mid('unreliable', 0.52), 0, 0); night.setAttribute('transform', `translate(275 425) scale(${Math.max(0.01, 0.8 + 0.2 * P(t, mid('unreliable', 0.52), 0.45, pop)).toFixed(3)}) translate(-275 -425)`);
      supplyPop(calm, t, mid('unreliable', 0.74), 0, 0); calm.setAttribute('transform', `translate(925 425) scale(${Math.max(0.01, 0.8 + 0.2 * P(t, mid('unreliable', 0.74), 0.45, pop)).toFixed(3)}) translate(-925 -425)`);
      cSun.upd(t); cWind.upd(0, 0); tr(cWind.firstChild.childNodes[1].firstChild, 0, 0, 1, 18);
    }

    /* ---------- M: the mix ---------- */
    if (sh === 'M') {
      const mp = supplyPop(mixW, t, mid('mix', 0.04), 0, 0);
      mixW.setAttribute('transform', `translate(880 150) scale(${Math.max(0.01, 0.6 + 0.4 * mp).toFixed(3)}) translate(-880 -150)`);
      op(sgT, P(t, mid('mix', 0.24), 0.3, linear));
      const pp = P(t, mid('mix', 0.26), 0.4, pop); op(pie, clamp(pp * 2.5)); tr(pie, 880, 370, Math.max(0.01, 0.7 + 0.3 * pp));
      // the pie sweeps round, then the small slice (solar and other sources) is drawn
      const sw = P(t, mid('mix', 0.28), 1.0, ease), a = -Math.PI / 2 + sw * TAU;
      attr(pieCov, 'd', sw >= 0.999 ? '' : `M0,0 L${(112 * Math.cos(a)).toFixed(1)},${(112 * Math.sin(a)).toFixed(1)} A112,112 0 ${sw < 0.5 ? 1 : 0} 1 0,-112 Z`);
      const wp = P(t, mid('mix', 0.66), 0.5, ease), wa = -Math.PI / 2 + 0.06 * TAU * wp;
      attr(wedge, 'd', wp < 0.01 ? '' : `M0,0 L0,-112 A112,112 0 0 1 ${(112 * Math.cos(wa)).toFixed(1)},${(112 * Math.sin(wa)).toFixed(1)} Z`);
      supplyPop(cMix1, t, mid('mix', 0.44), 880, 548);
      supplyPop(cMix2, t, mid('mix', 0.68), 880, 618);
      roofs.forEach((r, k) => { const p = P(t, mid('mix', 0.7) + k * 0.1, 0.4, pop); op(r, clamp(p * 3)); tr(r, BLK[k][0] + 50, 610 - BLK[k][1] - 4 * (1 - clamp(p)), Math.max(0.01, p)); });
    }

    /* ---------- N/Q: Kavya at the open front door ---------- */
    if (sh === 'N' || sh === 'Q') {
      op(doorOpen, 1);
      const off = P(t, mid('mum', 0.84), 0.5, linear);
      coldL.forEach((e, k) => { const f = (t * 0.5 + k / 4) % 1, y = 280 + k * 34; e.setAttribute('d', `M${(600 + f * 150).toFixed(0)},${y} q14,-10 28,0 q14,10 28,0`); e.style.opacity = ((1 - off) * 0.85 * Math.sin(f * Math.PI)).toFixed(3); });
    }
    if (sh === 'N') {
      show(kav, 515, 515, 0.92, { talk: talk(t, 'kavya'), mood: 'neutral', look: t < mid('so', 0.55) ? -0.9 : 0.5 });
      const tp = P(t, mid('so', 0.08), 0.4, easeOut); op(think, tp);
      op(th1, P(t, mid('so', 0.1), 0.3, linear)); op(th2, P(t, mid('so', 0.55), 0.3, linear));
      const tq = P(t, mid('so', 0.55), 0.45, pop);
      show(theo, 1052, 236, 0.36 * Math.max(0.01, tq), { mood: 'sad', glow: 1, look: -0.5 }); op(theo, clamp(tq * 3));
    }
    if (sh === 'Q') {
      const who = t >= at('who') - 0.05;
      const turn = P(t, end('who') + 0.15, 1.0, ease);
      const look = who ? lerp(-0.9, 0, turn) : -0.9;
      const mood = who ? (t > end('who') + 0.75 ? 'deadpan' : 'shock') : 'neutral';
      supplyCam(world, 515, 430, 1 + (who ? 0.14 * P(t, at('who'), end('who') + 1.0 - at('who'), linear) : 0));
      show(kav, 515, 515, 0.92, { t: who ? Math.min(t, at('who') + 0.1) : t, talk: talk(t, 'kavya'), mood, look, still: who, sweat: who ? P(t, at('who') + 0.2, 0.4, linear) : 0 });
      const bp = win(t, mid('mum', 0.84), at('who') - 0.05, 0.2);
      op(beep, bp); if (bp) tr(beep, 760, 190, 1);
      const mb = P(t, at('who') - 0.05, 0.3, pop);
      op(mumB, clamp(mb * 3)); if (mb) tr(mumB, 868 + (t < at('who') + 0.4 ? 3 * Math.sin(t * 40) * AMP : 0), 250, Math.max(0.01, 0.85 + 0.15 * mb));
    }

    /* ---------- O: CASE CLOSED, saving energy ---------- */
    if (sh === 'O') {
      const save = t >= at('save') - 0.06;
      show(con, 290, 430, 1.25, { talk: talk(t, 'con'), mood: save && t > mid('save', 0.6) ? 'smug' : 'deadpan', look: 0.7 });
      const fp = P(t, cut('closed'), 0.45, easeOut);
      op(fileO, save ? 0 : 1); tr(fileO, lerp(1400, 850, fp), 330, 1, lerp(10, -2, fp));
      stClosed.set(P(t, mid('closed', 0.12), 0.35, linear));
      op(fl1, P(t, mid('closed', 0.3), 0.3, linear)); op(fl2, P(t, mid('closed', 0.52), 0.3, linear));
      // Theo peeks from behind the file: the waste ended up with him
      const tp = save ? 0 : P(t, mid('closed', 0.66), 0.5, easeOut);
      if (tp > 0) { show(theo, 1072, 600 - 80 * tp, 0.55, { mood: 'sad', glow: 1, look: -0.6 }); op(theo, tp); }
      op(board, save ? 1 : 0);
      if (save) {
        const bp = P(t, at('save') - 0.06, 0.35, pop);
        tr(board, 840, 350, Math.max(0.01, 0.85 + 0.15 * bp)); op(board, clamp(bp * 3));
        op(sv1, P(t, mid('save', 0.1), 0.3, linear)); svS.set(P(t, mid('save', 0.42), 0.4));
        op(sv2, P(t, mid('save', 0.58), 0.3, linear)); op(sv3, P(t, mid('save', 0.8), 0.3, linear));
      }
    }

    /* ---------- P: how to waste less ---------- */
    if (sh === 'P') {
      op(pHead, P(t, cut('how'), 0.3, linear));
      const HT = [0.06, 0.3, 0.56];
      hCards.forEach((g, k) => { const p = P(t, mid('how', HT[k]), 0.45, pop); op(g, clamp(p * 2.5)); g.setAttribute('transform', `translate(${CXS[k]} 395) scale(${Math.max(0.01, 0.8 + 0.2 * p).toFixed(3)}) translate(${-CXS[k]} -395)`); });
      hTicks.forEach((tk, k) => op(tk, P(t, mid('how', HT[k] + 0.12), 0.25, linear)));
      hCards[1].needle.setAttribute('transform', `rotate(${(180 + 0.88 * 180 + Math.sin(t * 6) * 1.5 * AMP).toFixed(1)})`);
      const dOff = P(t, end('how') - 0.25, 0.15, linear);
      attr(tvDot, 'fill', dOff > 0.5 ? '#3A3A3A' : '#FF3B3B'); op(hCards[2].glowDot, (1 - dOff) * (0.6 + 0.4 * Math.sin(t * 5)));
      op(offT, dOff);
    }
  };
});
