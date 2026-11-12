/* Scene 5: Woolly and the flask.
   Beats: the freezing MRT (5:00 PM, ARCTIC MODE) -> "freezing in here?" (teeth chattering) -> Mum's note on the
   bag, Woolly pops out -> "I'm needed" (glistening) -> Kavya wears Woolly -> "I'm not warm, actually" (no heat
   added) -> close-up of the fibres: trapped air, Jules inching through -> "very... slowly" (SLOW-MO) -> the vacuum
   flask, cutaway -> Vic in the gap (zoom bubble, lower third) -> Jules bounces off three times (no conduction, no
   convection) -> Ray on the phone: silvered walls reflect -> the stopper -> hot soup? -> both ways, split screen. */
scene('flask', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;

  /* ---------- local helpers (prefixed fk) ---------- */
  const fkOn = (t, a, b) => (t >= a && t < b ? 1 : 0);
  // camera: scale k about world point (cx, cy) and put that point at screen (px, py)
  const fkCam = (el, cx, cy, k, px, py) => el.setAttribute('transform', `translate(${px.toFixed(1)} ${py.toFixed(1)}) scale(${k.toFixed(4)}) translate(${(-cx).toFixed(1)} ${(-cy).toFixed(1)})`);
  const fkPop = (el, t, t0, x, y, s, r, mul) => { const p = P(t, t0, 0.45, pop); op(el, clamp(p * 2.5) * (mul === undefined ? 1 : mul)); tr(el, x, y, Math.max(0.01, (s || 1) * (0.6 + 0.4 * p)), r); return p; };
  const fkFade = (t, a, b) => win(t, a, b, 0.2);
  // a wavy radiation ray from (x1,y1) to (x2,y2) with an arrowhead; g.set(p, t) draws a fraction p, the wave moving
  function fkWave(parent, x1, y1, x2, y2, col) {
    const g = G(parent);
    const pth = E('path', { d: '', fill: 'none', stroke: col, 'stroke-width': 7, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    const head = E('path', { d: 'M0,0 L-24,-14 L-17,0 L-24,14 Z', fill: col }, g);
    const L = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / L, uy = (y2 - y1) / L;
    g.set = (p, t) => {
      p = clamp(p);
      let d = '';
      const n = Math.max(2, Math.round(40 * p));
      for (let i = 0; i <= n; i++) {
        const s = i / 40 * L, w = 13 * Math.sin(s / 26 - t * 9) * Math.min(1, s / 30, (L * p - s) / 30 + 0.2);
        d += (i ? 'L' : 'M') + (x1 + ux * s - uy * w).toFixed(1) + ',' + (y1 + uy * s + ux * w).toFixed(1);
      }
      attr(pth, 'd', d);
      head.setAttribute('transform', `translate(${(x1 + ux * L * p).toFixed(1)} ${(y1 + uy * L * p).toFixed(1)}) rotate(${(Math.atan2(uy, ux) * 180 / Math.PI).toFixed(1)})`);
      op(head, p > 0.15 ? 1 : 0); op(g, p > 0.01 ? 1 : 0);
    };
    return g;
  }
  // a card with a crossed-out flame: insulators add NO heat
  function fkNoHeat(parent) {
    const g = G(parent);
    E('rect', { x: -200, y: -140, width: 400, height: 280, rx: 22, fill: 'rgba(10,27,39,0.92)', stroke: C.heat, 'stroke-width': 3 }, g);
    const fl = G(g); tr(fl, 0, -48);
    E('path', { d: 'M0,-58 C30,-30 44,-6 34,24 C26,46 -26,46 -34,24 C-42,0 -24,-14 -14,-34 C-10,-18 -4,-12 4,-10 C8,-26 4,-42 0,-58 Z', fill: ball('#FFE45C', '#FF8A3D'), stroke: C.heatDk, 'stroke-width': 4 }, fl);
    cross(fl, 46);
    T(g, 0, 50, 'insulators add', { size: 34, weight: 700, anchor: 'middle' });
    T(g, 0, 104, '**NO** heat', { size: 46, weight: 600, anchor: 'middle', boldFill: '#FF6070' });
    return g;
  }
  // a dark chip with a red cross in front of it
  function fkNoChip(parent, text) {
    const g = G(parent);
    const c = chip(g, text, { size: 30, fill: 'rgba(10,27,39,0.9)', stroke: '#FF6070', sw: 3, color: C.ink, padX: 28 });
    tr(c, 26, 0);
    tr(cross(g, 14), -c.w / 2 + 2, 0);
    return g;
  }

  /* layers */
  const Lbg = G(root), Lcast = G(root), Lfg = G(root), Lhud = G(root);

  /* ================= A / C / E: the MRT carriage (one camera-moved world) ================= */
  const trainShot = G(Lbg), world = G(trainShot);
  const train = bkTrain(world);
  // ARCTIC MODE sign hanging under the right vent
  const arctic = G(world); tr(arctic, 980, 190);
  E('path', { d: 'M-90,-70 L-90,-40 M90,-70 L90,-40', stroke: '#8FA3B5', 'stroke-width': 3 }, arctic);
  const arcIn = G(arctic);
  E('rect', { x: -130, y: -42, width: 260, height: 84, rx: 12, fill: '#E8F6FF', stroke: '#2E7DD8', 'stroke-width': 4 }, arcIn);
  T(arcIn, 22, 12, 'ARCTIC MODE', { size: 28, weight: 800, anchor: 'middle', fill: '#1F5FB0' });
  E('path', { d: 'M-104,-16 L-104,16 M-118,-8 L-90,8 M-118,8 L-90,-8', stroke: '#2E7DD8', 'stroke-width': 4, 'stroke-linecap': 'round' }, arcIn);
  // the flask on the bench (outside view, for the 'flask' line)
  const benchFlask = bkFlask(world, 0.42); tr(benchFlask, 790, 420, 0.42);
  // Woolly hides in the bag
  const woolly = cast(world, 'woolly', { s: 0.62, mood: 'sad' });
  const tears = G(woolly.firstChild);
  [-26, 26].forEach(x => E('path', { d: `M${x},6 Q${x + 7},18 ${x},24 Q${x - 7},18 ${x},6 Z`, fill: '#BFEAFF', stroke: '#5AB4E0', 'stroke-width': 2 }, tears));
  const bag = G(world); tr(bag, 930, 505);
  E('path', { d: 'M-70,-104 Q-70,-150 0,-150 Q70,-150 70,-104', fill: 'none', stroke: '#4B2F86', 'stroke-width': 12 }, bag);   // handle
  E('rect', { x: -110, y: -104, width: 220, height: 200, rx: 30, fill: '#7A4FC4', stroke: SC_INK, 'stroke-width': 5 }, bag);
  E('rect', { x: -110, y: -104, width: 220, height: 30, rx: 14, fill: '#5E3AA6', stroke: SC_INK, 'stroke-width': 4 }, bag);
  const note = G(bag); tr(note, 0, 20, 1, -5);
  E('rect', { x: -92, y: -58, width: 184, height: 120, rx: 6, fill: '#FFF8C4', stroke: '#D9C36A', 'stroke-width': 3 }, note);
  E('rect', { x: -26, y: -68, width: 52, height: 18, fill: '#FFFFFF', opacity: 0.7 }, note);
  [T(note, 0, -18, 'Bring a', { size: 28, weight: 800, anchor: 'middle', fill: '#C62828' }),
    T(note, 0, 16, 'jumper!', { size: 28, weight: 800, anchor: 'middle', fill: '#C62828' }),
    T(note, 30, 48, '— Mum ♥', { size: 22, weight: 700, anchor: 'middle', fill: '#5A6B7A', font: FB })].forEach(n => n.setAttribute('font-style', 'italic'));
  // Kavya on the bench
  const KX = 600, KY = 432, KS = 1.25;
  const kav = cast(world, 'kavya', { s: KS, mood: 'annoyed' });
  const kIn = kav.firstChild;
  const frost = G(kIn);
  [[74, -46, 12], [60, -60, 8], [88, -34, 8], [-60, -96, 9], [20, -118, 8]].forEach(([x, y, r]) => E('path', { d: `M${x - r},${y} L${x + r},${y} M${x},${y - r} L${x},${y + r} M${x - r * 0.7},${y - r * 0.7} L${x + r * 0.7},${y + r * 0.7} M${x - r * 0.7},${y + r * 0.7} L${x + r * 0.7},${y - r * 0.7}`, stroke: '#FFFFFF', 'stroke-width': 3, 'stroke-linecap': 'round' }, frost));
  // Kavya wearing Woolly: a knitted jumper over her PE shirt, with Woolly's face on the chest
  const jumper = G(kIn);
  const K = '#C4553D', KD = '#8C3524', KL = '#F3E2C2';
  [-1, 1].forEach(sd => E('path', { d: `M${sd * 92},70 Q${sd * 134},92 ${sd * 128},144 L${sd * 100},144 Q${sd * 104},104 ${sd * 84},84 Z`, fill: K, stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, jumper));
  E('path', { d: 'M-106,144 Q-102,58 -44,46 L44,46 Q102,58 106,144 Z', fill: K, stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, jumper);
  let kn = ''; for (let y = 70; y < 116; y += 16) for (let x = -84; x < 86; x += 20) if (Math.abs(x) > 50 || y > 104) kn += `M${x},${y} l5,6 l5,-6 `;
  E('path', { d: kn, fill: 'none', stroke: KD, 'stroke-width': 2.5, opacity: 0.6 }, jumper);
  E('path', { d: 'M-104,122 L104,122 L105,138 L-105,138 Z', fill: KL, stroke: SC_INK, 'stroke-width': 2.5 }, jumper);
  E('path', { d: 'M-40,48 Q0,72 40,48 Q0,36 -40,48 Z', fill: KD, stroke: SC_INK, 'stroke-width': 3 }, jumper);
  const wFace = scFace(jumper, { eye: 12, gap: 42, mouthW: 26, mouthY: 20, lidCol: '#D9725A' }); tr(wFace, 0, 86);

  /* ================= B: inside the wool (fibres and trapped air) ================= */
  const fibShot = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#3A1A10', '#5A2A1A', true) }, fibShot);
  const fr = rng(34);
  const fibre = (parent, i) => {
    const y0 = 110 + i * 62 + fr() * 30, a = (fr() - 0.5) * 220, b = (fr() - 0.5) * 220, c = (fr() - 0.5) * 160;
    const d = `M-40,${y0.toFixed(0)} C300,${(y0 + a).toFixed(0)} 700,${(y0 + b).toFixed(0)} 1240,${(y0 + c).toFixed(0)}`;
    E('path', { d, fill: 'none', stroke: '#2A120A', 'stroke-width': 30, 'stroke-linecap': 'round', opacity: 0.8 }, parent);
    E('path', { d, fill: 'none', stroke: i % 3 ? K : '#D97A5C', 'stroke-width': 20, 'stroke-linecap': 'round' }, parent);
    E('path', { d, fill: 'none', stroke: '#F0A48A', 'stroke-width': 4, 'stroke-dasharray': '14 18', opacity: 0.6 }, parent);
  };
  for (let i = 0; i < 10; i++) if (i % 3 !== 1) fibre(fibShot, i);
  const airs = [];
  [[120, 330], [250, 470], [380, 300], [470, 560], [560, 380], [690, 300], [760, 520], [880, 400], [980, 560], [1080, 330], [330, 640], [640, 650], [900, 660], [180, 560], [820, 250], [1110, 470]].forEach(([x, y], i) => {
    const a = E('circle', { r: 12, fill: ball('#D8F1FF', '#7FBCE0'), stroke: '#2A120A', 'stroke-width': 2 }, fibShot);
    airs.push({ a, x, y, ph: i * 1.7 });
  });
  const fibFront = G(Lfg);
  fr(); for (let i = 0; i < 10; i++) if (i % 3 === 1) fibre(fibFront, i);
  const airChip = bkChip(Lfg, 'trapped air', { size: 30, color: '#BFEAFF' });
  const youChip = chip(Lfg, 'you: warm', { size: 30, fill: 'rgba(10,27,39,0.9)', stroke: C.heat, sw: 3, color: C.heat });
  const trainChip = chip(Lfg, 'train: cold', { size: 30, fill: 'rgba(10,27,39,0.9)', stroke: '#7FC7EE', sw: 3, color: '#BFEAFF' });
  const fibArrow = arrow(Lfg, 290, 190, 900, 190, { color: C.heat, width: 8 });
  const insChip = chip(Lfg, 'trapped air = great insulator', { size: 34, fill: 'rgba(10,27,39,0.92)', stroke: C.energy, sw: 3, color: C.energy });
  const slowChip = chip(Lfg, 'it SLOWS thermal energy down', { size: 34, fill: 'rgba(10,27,39,0.92)', stroke: C.heat, sw: 3, color: C.heat });
  // Woolly talking in a round inset
  const wIn = G(Lfg);
  E('circle', { r: 108, fill: '#2E1A12', stroke: '#F3E2C2', 'stroke-width': 6 }, wIn);
  const woolly2 = cast(wIn, 'woolly', { s: 0.52, mood: 'neutral' }); tr(woolly2, 0, 8, 0.52);
  // SLOW sign and slow-mo badge
  const slowSign = G(Lfg);
  E('rect', { x: -70, y: -70, width: 140, height: 140, rx: 14, fill: '#FFC21A', stroke: SC_INK, 'stroke-width': 5, transform: 'rotate(45)' }, slowSign);
  T(slowSign, 0, 12, 'SLOW', { size: 36, weight: 800, anchor: 'middle', fill: SC_INK });
  E('rect', { x: -6, y: 96, width: 12, height: 90, fill: '#8FA3B5' }, slowSign);
  const slowmo = chip(Lfg, 'SLOW-MO  ×0.25', { size: 30, fill: '#C62828', color: '#FFFFFF', stroke: '#FFFFFF', sw: 3 });
  const jSweat = scSweat(Lfg, [[-70, -70], [76, -60], [-90, 0]]);

  /* ================= D: the flask diagram ================= */
  const diag = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#0E1A24', '#18303F', true) }, diag);
  let grid = ''; for (let x = 0; x <= 1200; x += 60) grid += `M${x},0 L${x},750 `; for (let y = 0; y <= 750; y += 60) grid += `M0,${y} L1200,${y} `;
  E('path', { d: grid, stroke: '#FFFFFF', 'stroke-width': 1, opacity: 0.05 }, diag);
  // the zoom bubble with Vic
  const zoomG = G(diag);
  const zl1 = E('line', { x1: 0, y1: 0, x2: 0, y2: 0, stroke: '#C9D6E2', 'stroke-width': 3, 'stroke-dasharray': '8 8' }, zoomG);
  const zl2 = E('line', { x1: 0, y1: 0, x2: 0, y2: 0, stroke: '#C9D6E2', 'stroke-width': 3, 'stroke-dasharray': '8 8' }, zoomG);
  E('circle', { cx: 930, cy: 390, r: 172, fill: '#06090D', stroke: '#C9D6E2', 'stroke-width': 6 }, zoomG);
  T(zoomG, 930, 200, 'between the walls', { size: 26, weight: 700, anchor: 'middle', fill: C.muted, font: FB });
  // split-screen backdrop (F)
  const split = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#14243A', '#25446B', true) }, split);
  E('rect', { x: 0, y: 0, width: 600, height: 750, fill: '#FF8A3D', opacity: 0.12 }, split);
  E('rect', { x: 600, y: 0, width: 600, height: 750, fill: '#4CC9F0', opacity: 0.1 }, split);
  E('line', { x1: 600, y1: 110, x2: 600, y2: 750, stroke: '#FFFFFF', 'stroke-width': 4, opacity: 0.25 }, split);
  // the big flask (diagram, then the iced-water side of the split)
  const flaskD = bkFlask(Lbg, 1);
  const gapHi = E('rect', { x: -48, y: -106, width: 18, height: 242, rx: 9, fill: '#FFFFFF', 'fill-opacity': 0.1, stroke: '#FFE45C', 'stroke-width': 3, 'stroke-dasharray': '8 6' }, flaskD);
  const stopHi = G(flaskD);
  E('ellipse', { cx: 0, cy: -125, rx: 80, ry: 52, fill: glow('#FFE45C') }, stopHi);
  E('path', { d: 'M-40,-156 L40,-156 L33,-95 L-33,-95 Z', fill: 'none', stroke: '#FFE45C', 'stroke-width': 5, 'stroke-linejoin': 'round' }, stopHi);
  const silverHi = E('path', { d: 'M-46,-100 L-46,130 M46,-100 L46,130', stroke: '#FFFFFF', 'stroke-width': 5, 'stroke-dasharray': '10 8' }, flaskD);
  const swirls = [];
  for (let i = 0; i < 3; i++) { const s = G(Lfg); E('path', { d: 'M-18,0 C-18,-16 10,-18 12,-2 C14,10 -2,14 -4,4', fill: 'none', stroke: C.heat, 'stroke-width': 6, 'stroke-linecap': 'round' }, s); swirls.push(s); }
  const swCross = cross(Lfg, 20);

  /* ================= the cast ================= */
  const vic = cast(Lcast, 'vic', { mood: 'neutral' });
  const jules = cast(Lcast, 'jules', { mood: 'happy' });
  const dizzy = G(Lcast);
  for (let i = 0; i < 3; i++) { const st = G(dizzy); E('path', { d: 'M0,-12 L3,-3 L12,-3 L5,3 L8,12 L0,6 L-8,12 L-5,3 L-12,-3 L-3,-3 Z', fill: '#FFE45C', stroke: SC_INK, 'stroke-width': 2 }, st); }

  /* ================= props, labels ================= */
  const clock = bkClock(Lfg);
  const outChip = chip(Lfg, 'outside: 34 °C', { size: 32, fill: '#D32F2F', color: '#FFFFFF', stroke: '#FFFFFF', sw: 3 });
  const inChip = chip(Lfg, 'in here: freezing', { size: 32, fill: '#1F5FB0', color: '#FFFFFF', stroke: '#BFEAFF', sw: 3 });
  const brrr = T(Lfg, 0, 0, 'brrr…', { size: 34, weight: 700, anchor: 'middle', fill: '#1F5FB0', font: FB });
  brrr.setAttribute('font-style', 'italic');
  const sparks = [0, 1, 2, 3].map(i => spark(Lfg, 16, { seed: i + 2 }));
  const neededChip = bkChip(Lfg, 'finally needed', { size: 30, color: C.energy });
  const noHeat = fkNoHeat(Lfg);
  // D labels
  const vfChip = chip(Lfg, 'vacuum flask', { size: 36, fill: 'rgba(10,27,39,0.92)', stroke: C.energy, sw: 3, color: C.energy });
  const iceLbl = labelLine(Lfg, 840, 520, 640, 500, 'iced water', { size: 30, fill: '#BFEAFF', line: '#BFEAFF' });
  const vacChip = chip(Lfg, 'vacuum = NO particles', { size: 32, fill: 'rgba(10,27,39,0.92)', stroke: '#C9D6E2', sw: 3, color: '#FFFFFF' });
  const ltVic = scLowerThird(Lhud, 'VIC', 'A vacuum. Literally nothing.');
  const npChip = bkChip(Lfg, 'no particles, so…', { size: 30, color: '#C9D6E2' });
  const noCond = fkNoChip(Lfg, 'no conduction');
  const noConv = fkNoChip(Lfg, 'no convection');
  const triesChip = T(Lfg, 0, 0, '', { size: 30, weight: 800, anchor: 'middle', fill: C.energy });
  const phone = G(Lfg);
  const ph = bkPhone(phone, 1.15);
  const phClip = E('clipPath', { id: 'fkphone' }, defs()); E('rect', { x: -66, y: -124, width: 133, height: 246, rx: 12 }, phClip);
  const phIn = G(phone, { 'clip-path': 'url(#fkphone)' });
  const ray = cast(phIn, 'ray', { s: 0.52, mood: 'smug' });
  const wIn1 = fkWave(Lfg, 120, 220, 540, 340, '#FF5A6E');
  const wOut1 = fkWave(Lfg, 540, 340, 150, 470, '#FF5A6E');
  const wIn2 = fkWave(Lfg, 110, 560, 540, 520, '#FF5A6E');
  const wOut2 = fkWave(Lfg, 540, 520, 170, 680, '#FF5A6E');
  const silverChip = chip(Lfg, 'silvered walls REFLECT radiation', { size: 32, fill: 'rgba(10,27,39,0.92)', stroke: '#FF5A6E', sw: 3, color: '#FFFFFF' });
  const stopChip = chip(Lfg, 'stopper: stops warm air getting in (convection)', { size: 30, fill: 'rgba(10,27,39,0.92)', stroke: C.energy, sw: 3, color: C.energy });
  // E: thought bubble with hot soup
  const bubble = G(Lfg);
  [[575, 330, 14], [535, 300, 22]].forEach(([x, y, r]) => E('circle', { cx: x - 0, cy: y, r, fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 3 }, bubble));
  E('ellipse', { cx: 300, cy: 300, rx: 210, ry: 160, fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 4 }, bubble);
  T(bubble, 400, 290, 'hot', { size: 40, weight: 800, anchor: 'middle', fill: '#C25516' });
  T(bubble, 400, 336, 'soup!', { size: 40, weight: 800, anchor: 'middle', fill: '#C25516' });
  const flaskS = bkFlask(Lfg, 1);
  const soup = G(flaskS);
  E('rect', { x: -30, y: -96, width: 60, height: 220, rx: 14, fill: '#E39B3A', stroke: '#E9EFF2', 'stroke-width': 6 }, soup);
  E('rect', { x: -27, y: -60, width: 54, height: 180, rx: 12, fill: glow('#FFD27A'), opacity: 0.7 }, soup);
  [[-12, -40, '#6CC27A'], [10, -6, '#F07A3A'], [-8, 34, '#6CC27A'], [12, 70, '#F2D27A'], [-14, 92, '#F07A3A']].forEach(([x, y, c]) => E('circle', { cx: x, cy: y, r: 7, fill: c, stroke: '#8C4A1A', 'stroke-width': 2 }, soup));
  // F: both ways
  const bothChip = chip(Lfg, 'slows energy flow BOTH ways', { size: 36, fill: 'rgba(10,27,39,0.92)', stroke: C.heat, sw: 3, color: C.heat });
  const soupLbl = chip(Lfg, 'hot soup: stays hot', { size: 30, fill: 'rgba(10,27,39,0.9)', stroke: C.heat, sw: 3, color: '#FFFFFF' });
  const iceLbl2 = chip(Lfg, 'iced water: stays cold', { size: 30, fill: 'rgba(10,27,39,0.9)', stroke: '#7FC7EE', sw: 3, color: '#FFFFFF' });
  const FS = 1.45, SX = 300, IX = 900, FY = 420;
  const bothA = G(Lfg), bArr = [];
  [-1, 1].forEach(sd => [350, 500].forEach(y => {
    // soup: out (hot inside -> colder outside); thick inside, blocked at the gap, a thin trickle outside
    bArr.push({ a: arrow(bothA, SX + sd * 6, y, SX + sd * 40 * FS, y, { color: C.heat, width: 10, head: 28 }), d: 0 });
    bArr.push({ a: arrow(bothA, SX + sd * 70 * FS, y, SX + sd * 150, y, { color: C.heat, width: 4, head: 14 }), d: 0.35 });
    // iced water: in (warmer outside -> cold inside)
    bArr.push({ a: arrow(bothA, IX + sd * 200, y, IX + sd * 66 * FS, y, { color: C.heat, width: 10, head: 28 }), d: 0 });
    bArr.push({ a: arrow(bothA, IX + sd * 36 * FS, y, IX + sd * 4, y, { color: C.heat, width: 4, head: 14 }), d: 0.35 });
  }));
  const bonks = G(bothA);
  [-1, 1].forEach(sd => [350, 500].forEach(y => [SX + sd * 42 * FS, IX + sd * 62 * FS].forEach(x => E('path', { d: `M${x - 3},${y - 22} L${x + 3},${y + 22}`, stroke: '#FFFFFF', 'stroke-width': 5, 'stroke-linecap': 'round' }, bonks))));

  /* cut points */
  const cTrap = at('trap') - 0.06, cFlaskDiag = mid('flask', 0.38), cSoup = at('soup') - 0.06, cBoth = at('both') - 0.06;
  const cWarm = at('warm') - 0.06;
  // Jules bounce schedule (blocked): three tries
  const bT0 = at('blocked') + 0.1, bDur = (end('blocked') + 0.3 - bT0) / 3;

  return t => {
    const sA = fkOn(t, -1, cTrap), sB = fkOn(t, cTrap, at('flask') - 0.06), sC = fkOn(t, at('flask') - 0.06, cFlaskDiag);
    const sD = fkOn(t, cFlaskDiag, cSoup), sE = fkOn(t, cSoup, cBoth), sF = fkOn(t, cBoth, 1e9);
    const trainOn = Math.max(sA, sC, sE);
    const jTalk = scTalk(S, t, 'jules');

    /* ---------- the train ---------- */
    op(trainShot, trainOn);
    let julesOn = 0;
    if (trainOn) {
      train.upd(t);
      const worn = t >= cWarm;
      // camera per beat (hard cuts, slow drifts)
      if (sA && t < at('mum') - 0.06) {
        const k = t < at('freeze') - 0.06 ? 1 + 0.05 * P(t, 0, at('freeze'), linear) : 1.32 + 0.04 * P(t, at('freeze'), 3.5, linear);
        if (t < at('freeze') - 0.06) fkCam(world, 600, 375, k, 600, 375); else fkCam(world, 610, 400, k, 600, 380);
      } else if (sA && t < at('needed') - 0.06) {
        fkCam(world, 830, 430, 1.35 + 0.08 * P(t, at('mum'), 3.4, linear), 720, 400);
      } else if (sA && t < cWarm) {
        fkCam(world, 930, 330, 1.6 + 0.2 * P(t, at('needed'), 3.6, linear), 760, 440);
      } else if (sA && t < at('notwarm') - 0.06) {
        fkCam(world, 610, 430, 1.25, 600, 385);
      } else if (sA) {
        fkCam(world, 600, 545, 1.6 + 0.06 * P(t, at('notwarm'), 4.4, linear), 790, 420);
      } else if (sC) {
        fkCam(world, 700, 420, 1.15 + 0.35 * P(t, at('flask'), cFlaskDiag - at('flask'), easeIn), 680, 400);
      } else {
        fkCam(world, 700, 440, 1.2, 800, 420);
      }
      arcIn.setAttribute('transform', `scale(${(1 + 0.12 * Math.sin(Math.PI * P(t, mid('five', 0.62), 0.5, linear))).toFixed(3)})`);
      // Kavya
      const cold = !worn;
      const chatter = cold ? Math.sin(t * 58) * 3 * AMP * (t > at('freeze') - 0.2 ? 1.4 : 0.8) : 0;
      tr(kav, KX + chatter, KY, KS);
      let mood = 'annoyed', look = 0;
      if (t >= at('mum') - 0.06 && t < cWarm) { mood = 'neutral'; look = 0.8; }
      if (worn) mood = 'happy';
      if (t >= at('notwarm') && t < at('trap')) { mood = t > mid('notwarm', 0.4) ? 'deadpan' : 'shock'; }
      if (sC) { mood = 'happy'; look = 0.5; }
      if (sE) { mood = t < mid('soup', 0.45) ? 'shock' : 'happy'; look = -0.6; }
      kav.set({ t, talk: scTalk(S, t, 'kavya'), mood, look, sweat: 0 });
      op(frost, cold ? 1 : 1 - P(t, cWarm, 0.6, linear));
      op(jumper, worn ? 1 : 0);
      const wfMood = t < at('notwarm') ? 'happy' : 'neutral';
      wFace.set({ mood: wfMood, talk: scTalk(S, t, 'woolly'), look: t < at('notwarm') ? -0.4 : 0, blink: scBlink(t, 2) });
      // Woolly in the bag
      const wp = P(t, mid('mum', 0.78), 0.5, pop);
      const wOn = !worn && t > mid('mum', 0.7);
      op(woolly, wOn ? 1 : 0);
      if (wOn) {
        tr(woolly, 930, lerp(500, 322, clamp(wp)), 0.62);
        woolly.set({ t, talk: scTalk(S, t, 'woolly'), mood: t < at('needed') ? 'shock' : 'happy', look: t < at('needed') ? -0.5 : 0 });
        op(tears, t > mid('needed', 0.4) ? 0.5 + 0.5 * wave(t, 0.8) : 0);
      }
      // the bag's note
      op(benchFlask, sC ? 1 : 0);
      // chips
      if (sA && t < at('freeze')) { clock.set('5:00'); fkPop(clock, t, at('five') + 0.1, 250, 210, 0.85); } else op(clock, 0);
      const fz = sA && t >= at('freeze') - 0.06 && t < at('mum') - 0.06;
      if (fz) { fkPop(outChip, t, mid('freeze', 0.3), 250, 300); fkPop(inChip, t, mid('freeze', 0.55), 250, 390); } else { op(outChip, 0); op(inChip, 0); }
      op(brrr, sA && t < at('freeze') + 3.4 && t > at('five') + 1 ? 0.6 + 0.4 * wave(t, 0.5) : 0); tr(brrr, sA && t < at('freeze') ? 820 : 850, sA && t < at('freeze') ? 330 : 300);
      // needed: sparkles and a chip
      const nd = sA && t >= at('needed') - 0.06 && t < cWarm;
      sparks.forEach((s, i) => { op(s, nd ? P(t, at('needed') + 0.3 + i * 0.25, 0.3, linear) : 0); if (nd) { tr(s, [640, 890, 630, 900][i], [330, 300, 470, 480][i], 0.8 + 0.3 * wave(t, 0.7, i * 0.3)); s.upd(t); } });
      if (nd) fkPop(neededChip, t, mid('needed', 0.55), 1040, 380); else op(neededChip, 0);
      // notwarm: the card
      const nw = sA && t >= at('notwarm') - 0.06;
      if (nw) fkPop(noHeat, t, mid('notwarm', 0.42), 300, 390, 1, -2); else op(noHeat, 0);
    } else { op(clock, 0); op(outChip, 0); op(inChip, 0); op(brrr, 0); sparks.forEach(s => op(s, 0)); op(neededChip, 0); op(noHeat, 0); }

    /* ---------- B: the fibres ---------- */
    op(fibShot, sB); op(fibFront, sB);
    if (sB) {
      airs.forEach(o => attr(o.a, 'transform', `translate(${(o.x + 1.6 * Math.sin(t * 2.1 + o.ph)).toFixed(1)} ${(o.y + 1.6 * Math.cos(t * 1.7 + o.ph)).toFixed(1)})`));
      fkPop(youChip, t, at('trap') + 0.1, 150, 190); fkPop(trainChip, t, at('trap') + 0.1, 1045, 190);
      op(fibArrow, P(t, at('trap') + 0.3, 0.3, linear)); fibArrow.set(P(t, at('trap') + 0.3, 1.2, ease));
      op(airChip, win(t, mid('trap', 0.12), mid('trap', 0.5), 0.25)); tr(airChip, 560, 300);
      fkPop(insChip, t, mid('trap', 0.3), 560, 690, 1, 0, 1 - P(t, mid('trap', 0.68), 0.2, linear));
      fkPop(slowChip, t, mid('trap', 0.72), 560, 690);
      fkPop(wIn, t, at('trap'), 1065, 520, 1, 0, 1 - P(t, end('trap') + 0.1, 0.2, linear));
      woolly2.set({ t, talk: scTalk(S, t, 'woolly'), mood: 'neutral', look: -0.5 });
      // Jules inching through, slower and slower
      const jt = clamp((t - at('trap') - 0.3) / (end('slow') + 0.4 - at('trap') - 0.3));
      const jx = 170 + 560 * Math.pow(jt, 0.85) + (t > at('slow') ? 6 * Math.sin(t * 3) : 0);
      const jy = 440 + 14 * Math.sin(t * 1.3);
      julesOn = 1;
      op(jules, 1); tr(jules, jx, jy, 0.68, 6 * Math.sin(t * 2.2));
      jules.set({ t: t > at('slow') ? t * 0.35 : t, talk: jTalk, mood: t > at('slow') ? (t > end('slow') ? 'deadpan' : 'sad') : 'annoyed', look: 0.6, glow: 0.7 });
      const sl = t >= at('slow') - 0.06;
      if (sl) { fkPop(slowSign, t, at('slow') + 0.1, 260, 470, 0.9, -4); fkPop(slowmo, t, at('slow') + 0.3, 1000, 300); } else { op(slowSign, 0); op(slowmo, 0); }
      op(jSweat, sl ? 1 : 0); tr(jSweat, jx, jy, 0.6); jSweat.set(sl ? 1 : 0, t * 0.5);
    } else { op(youChip, 0); op(trainChip, 0); op(fibArrow, 0); op(airChip, 0); op(insChip, 0); op(slowChip, 0); op(wIn, 0); op(slowSign, 0); op(slowmo, 0); op(jSweat, 0); }

    /* ---------- D: the flask diagram ---------- */
    op(diag, sD); op(split, sF);
    const flaskOn = sD || sF;
    op(flaskD, flaskOn ? 1 : 0);
    let vicOn = 0;
    if (sD) {
      const push = P(t, cFlaskDiag, 1.2, easeOut);
      const fs = lerp(1.25, 1.45, push);
      tr(flaskD, 600, 420, fs);
      flaskD.set(P(t, mid('flask', 0.55), 0.7, ease));
      op(gapHi, t > at('vic') - 0.1 && t < end('blocked') ? 0.6 + 0.4 * wave(t, 1.2) : 0);
      op(stopHi, t > at('stopper') + 0.1 ? 0.65 + 0.35 * wave(t, 1) : 0);
      op(silverHi, t > at('silver') + 0.2 && t < at('stopper') ? 0.5 + 0.5 * wave(t, 0.6) : 0);
      fkPop(vfChip, t, mid('flask', 0.45), 600, 702, 1, 0, 1 - P(t, at('vic') - 0.2, 0.2, linear));
      op(iceLbl, win(t, mid('flask', 0.72), at('vic'), 0.25));
      // Vic in the zoom bubble
      const zp = t > at('vic') - 0.06 && t < at('silver') - 0.1;
      op(zoomG, zp ? P(t, at('vic'), 0.3, linear) : 0);
      if (zp) {
        const gx = 600 - 40 * 1.45, gTop = 420 - 60 * 1.45, gBot = 420 + 80 * 1.45;
        attr(zl1, 'x1', gx); attr(zl1, 'y1', gTop); attr(zl1, 'x2', 930 - 100); attr(zl1, 'y2', 390 - 140);
        attr(zl2, 'x1', gx); attr(zl2, 'y1', gBot); attr(zl2, 'x2', 930 - 100); attr(zl2, 'y2', 390 + 140);
        vicOn = 1;
        const vp = P(t, mid('vic', 0.12), 1.2, linear);
        op(vic, vp); tr(vic, 930, 400, 1.1);
        const vLook = t > at('blocked') ? -0.8 : 0;
        vic.set({ t, mood: t > at('blocked') ? 'deadpan' : 'neutral', look: vLook });
        fkPop(vacChip, t, mid('vic', 0.55), 930, 620, 1, 0, 1 - P(t, at('blocked') - 0.1, 0.2, linear));
        ltVic.set(win(t, mid('vic', 0.2), mid('vic', 0.2) + 3.2, 0.3));
      } else { op(vacChip, 0); ltVic.set(0); }
      // Jules: introduces Vic, then bounces off the flask three times
      if (t < at('silver') - 0.1 && t > at('vic') - 0.1) {
        julesOn = 1;
        let jx = 230, jy = 410, js = 0.62, rot = 0, mood = 'happy', look = 0.7, sq = 1;
        if (t >= at('blocked') - 0.06) {
          js = 0.45; mood = 'annoyed';
          const k = Math.min(2, Math.floor((t - bT0) / bDur)), u = clamp((t - bT0 - k * bDur) / bDur);
          const hitX = 600 - 64 * 1.45 - 46;
          if (t < bT0) { jx = 250; } else if (u < 0.45) { jx = lerp(250, hitX, easeIn(u / 0.45)); }
          else if (u < 0.55) { jx = hitX; sq = 1 - 0.25 * Math.sin(Math.PI * (u - 0.45) / 0.1); }
          else { const b = (u - 0.55) / 0.45; jx = lerp(hitX, 250, easeOut(b)); rot = -360 * easeOut(b); jy = 410 - 60 * Math.sin(Math.PI * b); }
          const dz = t > bT0 + bDur * 0.5;
          op(dizzy, dz ? 1 : 0);
          if (dz) [...dizzy.children].forEach((s, i) => tr(s, jx + 50 * Math.cos(t * 5 + i * TAU / 3), jy - 70 + 14 * Math.sin(t * 5 + i * TAU / 3), 1, t * 90));
          const tries = Math.min(3, 1 + Math.floor((t - bT0 + bDur * 0.5) / bDur));
          setText(triesChip, t > bT0 + bDur * 0.5 ? `attempt ${tries}` : ''); tr(triesChip, 250, 560);
          op(triesChip, t > bT0 + bDur * 0.5 ? 1 : 0);
        } else { op(dizzy, 0); op(triesChip, 0); }
        op(jules, 1);
        jules.set({ t, talk: jTalk, mood, look, glow: 0.7 });
        jules.setAttribute('transform', `translate(${jx.toFixed(1)} ${jy.toFixed(1)}) rotate(${rot.toFixed(1)}) scale(${(js / sq).toFixed(3)} ${(js * sq).toFixed(3)})`);
      } else { op(dizzy, 0); op(triesChip, 0); }
      const bl = t >= at('blocked') - 0.06 && t < at('silver') - 0.1;
      if (bl) { fkPop(npChip, t, mid('blocked', 0.08), 250, 160); fkPop(noCond, t, mid('blocked', 0.2), 250, 230); fkPop(noConv, t, mid('blocked', 0.34), 250, 300); }
      else { op(npChip, 0); op(noCond, 0); op(noConv, 0); }
      // Ray on the phone: silvered walls reflect
      const sv = t >= at('silver') - 0.1 && t < at('stopper') - 0.06;
      if (sv) {
        fkPop(phone, t, at('silver'), 960, 400, 1, 6);
        tr(ray, 8, -6, 0.52);
        ray.set({ t, talk: scTalk(S, t, 'ray'), mood: t > mid('silver', 0.6) ? 'happy' : 'smug', look: -0.6, phone: 0 });
        ph.set(Math.floor(120 + 37 * clamp(t - at('silver')) * 10));
        const w1 = P(t, mid('silver', 0.3), 0.6, linear), w2 = P(t, mid('silver', 0.3) + 0.6, 0.6, linear);
        wIn1.set(w1, t); wOut1.set(w2, t); wIn2.set(P(t, mid('silver', 0.45), 0.6, linear), t); wOut2.set(P(t, mid('silver', 0.45) + 0.6, 0.6, linear), t);
        fkPop(silverChip, t, mid('silver', 0.5), 600, 702);
      } else { op(phone, 0); [wIn1, wOut1, wIn2, wOut2].forEach(w => w.set(0, t)); op(silverChip, 0); }
      // the stopper
      const sp = t >= at('stopper') - 0.06;
      if (sp) {
        fkPop(stopChip, t, mid('stopper', 0.3), 600, 702);
        swirls.forEach((s, i) => { const u = (t * 0.7 + i / 3) % 1, bx = 600 + (i - 1) * 70, by = 120 + 50 * Math.sin(Math.PI * u); op(s, P(t, mid('stopper', 0.4), 0.3, linear)); tr(s, bx + 8 * Math.sin(t * 3 + i), by, 1.1, t * 120 + i * 90); });
        op(swCross, P(t, mid('stopper', 0.6), 0.3, linear)); tr(swCross, 720, 150);
      } else { op(stopChip, 0); swirls.forEach(s => op(s, 0)); op(swCross, 0); }
    } else {
      op(vfChip, 0); op(iceLbl, 0); op(zoomG, 0); op(vacChip, 0); ltVic.set(0); op(npChip, 0); op(noCond, 0); op(noConv, 0); op(triesChip, 0);
      op(phone, 0); [wIn1, wOut1, wIn2, wOut2].forEach(w => w.set(0, t)); op(silverChip, 0); op(stopChip, 0); swirls.forEach(s => op(s, 0)); op(swCross, 0); op(dizzy, 0);
      op(gapHi, 0); op(stopHi, 0); op(silverHi, 0);
    }

    /* ---------- E: hot soup? ---------- */
    if (sE) {
      fkPop(bubble, t, mid('soup', 0.35), 0, 0, 1);
      bubble.setAttribute('transform', `translate(300 300) scale(${Math.max(0.01, 0.6 + 0.4 * P(t, mid('soup', 0.35), 0.45, pop)).toFixed(3)}) translate(-300 -300)`);
      op(flaskS, clamp(P(t, mid('soup', 0.35), 0.45, pop) * 2.5)); tr(flaskS, 230, 300, 0.48); flaskS.set(1);
    } else op(bubble, 0);

    /* ---------- F: both ways ---------- */
    if (sF) {
      tr(flaskD, IX, FY, FS); flaskD.set(1);
      op(flaskS, 1); tr(flaskS, SX, FY, FS); flaskS.set(1);
      fkPop(bothChip, t, mid('both', 0.12), 600, 140);
      const pOut = P(t, mid('both', 0.3), 0.7, ease), pIn = P(t, mid('both', 0.62), 0.7, ease);
      bArr.forEach((b, i) => { const p = (i % 4 < 2 ? pOut : pIn); op(b.a, p > 0.01 ? 1 : 0); b.a.set(clamp((p - b.d) / (1 - b.d))); });
      op(bonks, P(t, mid('both', 0.4), 0.2, linear));
      fkPop(soupLbl, t, mid('both', 0.35), SX, 706); fkPop(iceLbl2, t, mid('both', 0.66), IX, 706);
      julesOn = 1;
      op(jules, 1); tr(jules, 600, 545 + 8 * Math.sin(t * 2), 0.64);
      jules.set({ t, talk: jTalk, mood: 'happy', look: t < mid('both', 0.55) ? -0.7 : 0.7, glow: 0.8 });
    } else { op(bothChip, 0); op(bArr[0].a.parentNode, 0); op(soupLbl, 0); op(iceLbl2, 0); if (!sE) op(flaskS, 0); }
    if (sF) op(bothA, 1);

    if (!julesOn) op(jules, 0);
    if (!vicOn) op(vic, 0);
  };
});
