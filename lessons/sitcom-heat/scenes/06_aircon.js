/* Scene 6: Nine p.m.: the aircon goes on (showpiece: the convection current loop).
   Beats: 8:59 in the evening living room, Kavya with the remote like a weapon -> "Three. Two. One." (9:00)
   -> the aircon goes on (DING) -> Cel: heated particles move faster, further apart, the block EXPANDS -> the
   balance: volume up, mass the SAME -> Gus: gas > liquid > solid -> the bridge's expansion gap -> warm air less
   dense rises, cold air denser sinks -> the loop around the room, Gus riding it -> CONVECTION CURRENT, only in
   fluids -> Zip wants in -> spoons are solid -> Zip shuffles off -> "heat rises" ... Cel's push-in -> correction
   card -> aircon high on the wall -> Cel's column finally drops to 25 °C. */
scene('aircon', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;

  /* ---------- local helpers (prefixed ac) ---------- */
  const acOn = (t, a, b) => (t >= a && t < b ? 1 : 0);
  const acCam = (el, cx, cy, k, px, py) => el.setAttribute('transform', `translate(${px.toFixed(1)} ${py.toFixed(1)}) scale(${k.toFixed(4)}) translate(${(-cx).toFixed(1)} ${(-cy).toFixed(1)})`);
  const acPop = (el, t, t0, x, y, s, r, mul) => { const p = P(t, t0, 0.45, pop); op(el, clamp(p * 2.5) * (mul === undefined ? 1 : mul)); tr(el, x, y, Math.max(0.01, (s || 1) * (0.6 + 0.4 * p)), r); return p; };
  const COOL = ball('#9FD8FF', '#2E7DD8'), WARM = ball('#FFB45C', '#C25516');
  // a block of cols x rows particles centred on its origin; g.set(spacing, jiggle, t, warm)
  function acGrid(parent, cols, rows, r) {
    const g = G(parent);
    const box = E('rect', { x: 0, y: 0, width: 0, height: 0, rx: 12, fill: 'rgba(255,255,255,0.05)', stroke: '#C9D6E2', 'stroke-width': 3, 'stroke-dasharray': '10 7' }, g);
    const ps = [];
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) ps.push({ el: E('circle', { r, fill: COOL, stroke: SC_INK, 'stroke-width': 2 }, g), i, j, ph: (i * 7 + j * 13) * 0.37 });
    g.set = (sp, jig, t, warm) => {
      const w = (cols - 1) * sp, h = (rows - 1) * sp;
      ps.forEach(p => {
        attr(p.el, 'cx', -w / 2 + p.i * sp + jig * Math.sin(t * 23 + p.ph));
        attr(p.el, 'cy', -h / 2 + p.j * sp + jig * Math.cos(t * 19 + p.ph * 1.3));
        attr(p.el, 'fill', warm > 0.5 ? WARM : COOL);
      });
      attr(box, 'x', -w / 2 - r - 10); attr(box, 'y', -h / 2 - r - 10); attr(box, 'width', w + 2 * r + 20); attr(box, 'height', h + 2 * r + 20);
    };
    return g;
  }
  // a row on a correction card: tick or cross, then text
  function acRow(parent, ok, text, size) {
    const g = G(parent);
    tr(ok ? tick(g, 20) : cross(g, 16), 0, 0);
    T(g, 40, size * 0.36, text, { size, weight: 600, fill: ok ? '#FFFFFF' : '#FFB3BA', boldFill: ok ? C.good : '#FF6070' });
    return g;
  }
  const lerpCol = (a, b, p) => { const h = s => [1, 3, 5].map(i => parseInt(s.slice(i, i + 2), 16)); const A = h(a), B = h(b); return 'rgb(' + A.map((v, i) => Math.round(lerp(v, B[i], clamp(p)))).join(',') + ')'; };

  /* layers */
  const Lbg = G(root), Lcast = G(root), Lfg = G(root), Lhud = G(root);

  /* ================= the living room, evening (one camera-moved world) ================= */
  const livShot = G(Lbg), world = G(livShot);
  const liv = bkLiving(world);
  // night outside the window
  const night = G(world);
  E('rect', { x: 70, y: 130, width: 380, height: 280, fill: linGrad('#0B1630', '#28305A', true) }, night);
  [[110, 170], [200, 150], [290, 200], [380, 160], [150, 260], [420, 240]].forEach(([x, y]) => E('circle', { cx: x, cy: y, r: 3, fill: '#FFFFFF', opacity: 0.85 }, night));
  E('circle', { cx: 360, cy: 210, r: 26, fill: '#FFF3C4' }, night);
  E('circle', { cx: 372, cy: 202, r: 24, fill: '#141E40' }, night);
  [[20, 90, 110, 190], [150, 50, 100, 230], [270, 110, 100, 170]].forEach(([x, y, w, h]) => {
    E('rect', { x: 70 + x, y: 130 + y, width: w, height: h, fill: '#1C2442' }, night);
    let wd = ''; for (let yy = y + 14; yy < y + h - 10; yy += 22) for (let xx = x + 12; xx < x + w - 12; xx += 22) if ((xx * 7 + yy * 3) % 5 < 2) wd += `M${70 + xx},${130 + yy} h10 v10 h-10 Z `;
    E('path', { d: wd, fill: '#FFD27A', opacity: 0.85 }, night);
  });
  let gr = ''; for (let x = 32; x < 380; x += 38) gr += `M${70 + x},130 L${70 + x},410 `;
  E('path', { d: gr + 'M70,270 L450,270', stroke: '#5E6B76', 'stroke-width': 6 }, night);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#1A1440', opacity: 0.22 }, world);   // evening tint
  // a warm lamp right of the sofa
  const lamp = G(world); tr(lamp, 1160, 560);
  E('ellipse', { cx: 0, cy: -260, rx: 170, ry: 150, fill: glow('#FFD27A'), opacity: 0.7 }, lamp);
  E('rect', { x: -5, y: -250, width: 10, height: 250, fill: '#6B5A48' }, lamp);
  E('path', { d: 'M-50,-250 L50,-250 L34,-320 L-34,-320 Z', fill: '#FFE6A8', stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, lamp);
  // the wall clock
  const clock = bkClock(world); tr(clock, 640, 250, 0.9);
  // Kavya on the sofa, the remote, the cushion in front of her
  // 'high': cold air sweeping down and across the room
  const sweep = G(world), sweepA = [];
  [[1060, 230, 1130, 600, -40], [960, 230, 640, 540, -120], [900, 230, 260, 560, -190]].forEach(([x1, y1, x2, y2, b]) => sweepA.push(arrow(sweep, x1, y1, x2, y2, { color: '#4FB3FF', width: 12, head: 34, bend: b })));
  const KX = 820, KY = 405, KS = 0.95;
  const kav = cast(world, 'kavya', { s: KS, mood: 'deadpan' });
  const remote = G(world);
  const rmt = bkRemote(remote, 0.62);
  E('circle', { cx: 0, cy: 40, r: 22, fill: '#B9784E', stroke: SC_INK, 'stroke-width': 3 }, remote);   // her hand
  E('rect', { x: 660, y: 490, width: 420, height: 60, rx: 16, fill: '#4F93A3', stroke: SC_INK, 'stroke-width': 5 }, world);   // seat cushion
  const signal = G(world);
  [26, 46, 66].forEach(r => E('path', { d: `M${-r * 0.7},${-r * 0.7} A${r},${r} 0 0 1 ${r * 0.7},${-r * 0.7}`, fill: 'none', stroke: '#FFE45C', 'stroke-width': 5, 'stroke-linecap': 'round' }, signal));
  const ding = G(world); tr(ding, 760, 120);
  E('circle', { r: 70, fill: glow('#56D69B') }, ding);
  const dingT = T(ding, 0, 12, 'DING!', { size: 40, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  dingT.setAttribute('stroke', '#1F7A4D'); dingT.setAttribute('stroke-width', 6); dingT.setAttribute('paint-order', 'stroke');
  // the loop (convection current): a dim overlay, chevrons, labels
  const loopG = G(world);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#0A1024', opacity: 0.5 }, loopG);
  const LC = [590, 345], LRX = 440, LRY = 195;
  const loopPt = a => { const c = Math.cos(a), s = Math.sin(a); return [LC[0] + LRX * Math.sign(c) * Math.pow(Math.abs(c), 0.45), LC[1] + LRY * Math.sign(s) * Math.pow(Math.abs(s), 0.45)]; };
  let lp = ''; for (let i = 0; i <= 120; i++) { const [x, y] = loopPt(i / 120 * TAU); lp += (i ? 'L' : 'M') + x.toFixed(1) + ',' + y.toFixed(1); }
  E('path', { d: lp + 'Z', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 26, opacity: 0.08 }, loopG);
  const NCH = 24, chev = [];
  for (let i = 0; i < NCH; i++) chev.push(E('path', { d: 'M-14,-14 L8,0 L-14,14', fill: 'none', stroke: '#4FB3FF', 'stroke-width': 9, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, loopG));
  // temperature of the air at loop angle a (0 cold .. 1 warm): cold sinking on the right, warms along the floor,
  // warm rising on the left, cools along the ceiling as it reaches the aircon
  const warmAt = a => { a = ((a % TAU) + TAU) % TAU; if (a < 1.3) return 0; if (a < 2.6) return (a - 1.3) / 1.3; if (a < 4.2) return 1; if (a < 5.6) return 1 - (a - 4.2) / 1.4; return 0; };

  /* ================= confessionals and diagram sets ================= */
  const confCel = bkConfessional(Lbg, 'cel');
  const panel = G(Lbg);
  E('rect', { x: 470, y: 120, width: 690, height: 540, rx: 24, fill: '#0B1A20', opacity: 0.82, stroke: '#3E6E62', 'stroke-width': 3 }, panel);
  const confGus = bkConfessional(Lbg, 'gus');
  // bridge
  const bridge = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#58BFFF', '#CDEFFF', true) }, bridge);
  const bSun = sun(bridge, 56); tr(bSun, 1050, 150);
  E('rect', { x: 0, y: 560, width: 1200, height: 190, fill: linGrad('#3FA3D8', '#1D6E9A', true) }, bridge);
  [[150, 400], [1050, 400]].forEach(([x, y]) => E('rect', { x: x - 30, y, width: 60, height: 200, fill: '#9AA6B2', stroke: SC_INK, 'stroke-width': 4 }, bridge));
  const deckL = G(bridge), deckR = G(bridge);
  const teeth = (g, sd) => {
    E('rect', { x: sd < 0 ? -700 : 0, y: 330, width: 700, height: 70, fill: '#B9C3CC', stroke: SC_INK, 'stroke-width': 4 }, g);
    E('rect', { x: sd < 0 ? -700 : 0, y: 318, width: 700, height: 14, fill: '#5B6670' }, g);
    let d = ''; for (let k = 0; k < 3; k++) { const y = 336 + k * 22 + (sd < 0 ? 0 : 11); d += `M0,${y} L${sd * -44},${y} L${sd * -44},${y + 11} L0,${y + 11} Z `; }
    E('path', { d, fill: '#5B6670', stroke: SC_INK, 'stroke-width': 2 }, g);
  };
  teeth(deckL, -1); teeth(deckR, 1);
  const gapRing = E('circle', { cx: 600, cy: 365, r: 90, fill: 'none', stroke: C.energy, 'stroke-width': 6, 'stroke-dasharray': '14 10' }, bridge);
  const bInset = G(bridge); tr(bInset, 960, 610);
  E('rect', { x: -170, y: -80, width: 340, height: 160, rx: 16, fill: 'rgba(10,27,39,0.9)', stroke: '#FF6070', 'stroke-width': 3 }, bInset);
  T(bInset, 0, -42, 'no gap?', { size: 30, weight: 800, anchor: 'middle', fill: '#FF6070' });
  E('path', { d: 'M-140,40 L-60,40 Q0,-30 60,40 L140,40', fill: 'none', stroke: '#B9C3CC', 'stroke-width': 14, 'stroke-linejoin': 'round' }, bInset);
  T(bInset, 0, 70, 'it buckles', { size: 26, weight: 700, anchor: 'middle', fill: '#FFFFFF' });
  // dense: two parcels of air
  const denseSet = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#0E1A24', '#18303F', true) }, denseSet);
  const parW = G(denseSet), parC = G(denseSet);
  const pbW = particleBox(parW, 260, 200, { n: 6, r: 12, color: '#FFB45C', dark: '#C25516', seed: 5 });
  const pbC = particleBox(parC, 260, 200, { n: 18, r: 12, color: '#9FD8FF', dark: '#2E7DD8', seed: 9 });
  const upA = arrow(denseSet, 330, 270, 330, 180, { color: C.heat, width: 10, head: 30 });
  const dnA = arrow(denseSet, 870, 545, 870, 640, { color: '#4FB3FF', width: 10, head: 30 });

  /* ================= the cast ================= */
  const cel = cast(Lcast, 'cel', { mood: 'deadpan' });
  const celTears = G(cel.firstChild);
  [-25, 25].forEach(x => E('path', { d: `M${x},64 Q${x + 7},76 ${x},82 Q${x - 7},76 ${x},64 Z`, fill: '#BFEAFF', stroke: '#5AB4E0', 'stroke-width': 2 }, celTears));
  const gus = cast(Lcast, 'gus', { mood: 'happy' });
  const ring_ = E('circle', { r: 150, fill: 'none', stroke: '#9FD8FF', 'stroke-width': 4, 'stroke-dasharray': '12 10' }, Lcast);
  const zip = cast(Lcast, 'zip', { mood: 'happy' });

  /* ================= props, labels ================= */
  const count = T(Lfg, 0, 0, '3', { size: 190, weight: 800, anchor: 'middle', fill: '#FFE45C' });
  count.setAttribute('stroke', '#5A2B07'); count.setAttribute('stroke-width', 14); count.setAttribute('paint-order', 'stroke');
  const onChip = chip(Lfg, '9:00 PM: AIRCON ON', { size: 36, fill: '#1F7A4D', color: '#FFFFFF', stroke: '#FFFFFF', sw: 3 });
  // expand
  const gExp = acGrid(Lfg, 4, 4, 15);
  const hot = G(Lfg);
  E('ellipse', { cx: 0, cy: -20, rx: 180, ry: 70, fill: glow(C.heat), opacity: 0.9 }, hot);
  E('rect', { x: -130, y: 0, width: 260, height: 26, rx: 8, fill: '#3A4B5C', stroke: SC_INK, 'stroke-width': 3 }, hot);
  E('path', { d: 'M-100,6 L100,6 M-100,18 L100,18', stroke: '#FF5A3D', 'stroke-width': 4 }, hot);
  const heatChip = bkChip(Lfg, 'heated', { size: 30, color: C.heat });
  const fastChip = chip(Lfg, 'faster', { size: 30, fill: 'rgba(10,27,39,0.9)', stroke: C.heat, sw: 3, color: '#FFFFFF' });
  const apartChip = chip(Lfg, 'further apart', { size: 30, fill: 'rgba(10,27,39,0.9)', stroke: C.heat, sw: 3, color: '#FFFFFF' });
  const expChip = chip(Lfg, 'EXPANDS', { size: 40, fill: C.heat, color: '#FFFFFF', stroke: '#FFFFFF', sw: 3 });
  // mass: the balance
  const bal = G(Lfg);
  E('path', { d: 'M850,470 L815,560 L885,560 Z', fill: '#8FA3B5', stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, bal);
  E('rect', { x: 620, y: 462, width: 460, height: 14, rx: 7, fill: '#C9D3DC', stroke: SC_INK, 'stroke-width': 3 }, bal);
  E('rect', { x: 620, y: 446, width: 160, height: 14, rx: 5, fill: '#8FA3B5', stroke: SC_INK, 'stroke-width': 3 }, bal);
  E('rect', { x: 920, y: 446, width: 160, height: 14, rx: 5, fill: '#8FA3B5', stroke: SC_INK, 'stroke-width': 3 }, bal);
  T(bal, 700, 610, 'before', { size: 28, weight: 700, anchor: 'middle', fill: C.muted });
  T(bal, 1000, 610, 'heated', { size: 28, weight: 700, anchor: 'middle', fill: C.heat });
  const gB = acGrid(bal, 4, 4, 12), gA = acGrid(bal, 4, 4, 12);
  const volChip = chip(Lfg, 'volume ↑', { size: 32, fill: 'rgba(10,27,39,0.9)', stroke: C.heat, sw: 3, color: C.heat });
  const massChip = chip(Lfg, 'mass: SAME', { size: 36, fill: '#1F7A4D', color: '#FFFFFF', stroke: '#FFFFFF', sw: 3 });
  const levelChip = bkChip(Lfg, 'still level', { size: 28, color: C.good });
  const spaceChip = bkChip(Lfg, 'same particles, more personal space', { size: 28, color: '#FFFFFF' });
  // order
  const bars = G(Lfg), barEls = [];
  T(bars, 330, 200, 'how much they expand', { size: 34, weight: 700, anchor: 'middle', fill: '#FFFFFF' });
  [['gas', 520, '#9FD8FF'], ['liquid', 300, '#4CC9F0'], ['solid', 140, '#8FA3B5']].forEach(([n, w, c], i) => {
    const y = 290 + i * 110;
    T(bars, 70, y + 12, n, { size: 34, weight: 700, fill: '#FFFFFF' });
    barEls.push({ el: E('rect', { x: 200, y: y - 26, width: 0, height: 52, rx: 14, fill: c, stroke: SC_INK, 'stroke-width': 3 }, bars), w });
  });
  const psChip = bkChip(Lfg, 'personal space', { size: 28, color: '#9FD8FF' });
  // bridge labels
  const gapChip = chip(Lfg, 'expansion gap: no buckling', { size: 36, fill: 'rgba(10,27,39,0.92)', stroke: C.energy, sw: 3, color: C.energy });
  const hotDay = chip(Lfg, 'hot day', { size: 30, fill: '#D32F2F', color: '#FFFFFF', stroke: '#FFFFFF', sw: 3 });
  // dense labels
  const wLbl = G(Lfg); T(wLbl, 0, 0, 'warm air', { size: 34, weight: 800, anchor: 'middle', fill: C.heat }); T(wLbl, 0, 44, '**less dense** → rises', { size: 30, weight: 600, anchor: 'middle', fill: '#FFFFFF', boldFill: C.heat });
  const cLbl = G(Lfg); T(cLbl, 0, 0, 'cold air', { size: 34, weight: 800, anchor: 'middle', fill: '#4FB3FF' }); T(cLbl, 0, 44, '**denser** → sinks', { size: 30, weight: 600, anchor: 'middle', fill: '#FFFFFF', boldFill: '#4FB3FF' });
  const sameBox = bkChip(Lfg, 'same-sized boxes of air', { size: 28, color: C.muted });
  // loop labels
  const lSink = chip(Lfg, 'cold air sinks', { size: 30, fill: 'rgba(10,27,39,0.9)', stroke: '#4FB3FF', sw: 3, color: '#9FD8FF' });
  const lWarm = chip(Lfg, 'gets warmed', { size: 30, fill: 'rgba(10,27,39,0.9)', stroke: C.heat, sw: 3, color: '#FFD0A8' });
  const lRise = chip(Lfg, 'warm air rises', { size: 30, fill: 'rgba(10,27,39,0.9)', stroke: C.heat, sw: 3, color: '#FFD0A8' });
  const lCool = chip(Lfg, 'cooled by the aircon', { size: 30, fill: 'rgba(10,27,39,0.9)', stroke: '#4FB3FF', sw: 3, color: '#9FD8FF' });
  const ccChip = chip(Lfg, 'CONVECTION CURRENT', { size: 52, fill: 'rgba(10,27,39,0.94)', stroke: C.energy, sw: 4, color: C.energy });
  const fluidChip = chip(Lfg, 'only in FLUIDS (liquids and gases): they can flow', { size: 30, fill: 'rgba(10,27,39,0.94)', stroke: '#9FD8FF', sw: 3, color: '#FFFFFF' });
  // nozip
  const spoon = bkSpoon(Lfg, 1);
  const solidChip = chip(Lfg, 'solid: can’t flow', { size: 32, fill: 'rgba(10,27,39,0.92)', stroke: '#FF6070', sw: 3, color: '#FFFFFF' });
  const noSwirl = G(Lfg);
  E('path', { d: 'M-40,10 C-40,-40 40,-44 44,0 C46,30 6,38 0,14 C-4,0 14,-6 18,4', fill: 'none', stroke: '#9FD8FF', 'stroke-width': 9, 'stroke-linecap': 'round' }, noSwirl);
  cross(noSwirl, 46);
  const sadly = T(Lfg, 0, 0, '(sadly)', { size: 30, weight: 700, anchor: 'middle', fill: C.muted, font: FB });
  // rises / warmair
  const quote = G(Lfg);
  E('rect', { x: -170, y: -50, width: 340, height: 100, rx: 22, fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 4 }, quote);
  E('path', { d: 'M90,48 L130,90 L50,48 Z', fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, quote);
  E('rect', { x: 46, y: 40, width: 50, height: 12, fill: '#FFFFFF' }, quote);
  T(quote, 0, 16, '“heat rises”', { size: 44, weight: 800, anchor: 'middle', fill: SC_INK });
  const corr = G(Lfg);
  E('rect', { x: 0, y: 0, width: 650, height: 430, rx: 24, fill: 'rgba(10,27,39,0.94)', stroke: C.energy, 'stroke-width': 3 }, corr);
  const r1 = acRow(corr, true, '**WARM AIR** rises', 40); tr(r1, 50, 70);
  const r1b = T(corr, 90, 130, 'because it is **LESS DENSE**', { size: 36, weight: 600, fill: '#FFFFFF', boldFill: C.good });
  const r2 = acRow(corr, false, '“heat rises”', 36); tr(r2, 50, 230);
  const r3 = acRow(corr, false, '“it’s lighter”', 36); tr(r3, 50, 310);
  const r1hi = E('rect', { x: 24, y: 24, width: 602, height: 136, rx: 18, fill: 'none', stroke: C.good, 'stroke-width': 5 }, corr);
  // high
  const highChip = chip(Lfg, 'aircon HIGH up', { size: 32, fill: 'rgba(10,27,39,0.92)', stroke: '#4FB3FF', sw: 3, color: '#FFFFFF' });
  const sinkChip = chip(Lfg, 'cold, dense air sinks through the whole room', { size: 30, fill: 'rgba(10,27,39,0.92)', stroke: '#4FB3FF', sw: 3, color: '#9FD8FF' });
  const ahh = T(Lfg, 0, 0, 'ahhh…', { size: 34, weight: 700, anchor: 'middle', fill: '#FFFFFF', font: FB });
  ahh.setAttribute('font-style', 'italic');
  // new
  const readout = G(Lfg);
  E('rect', { x: -190, y: -110, width: 380, height: 220, rx: 22, fill: '#0B1118', stroke: '#4FB3FF', 'stroke-width': 4 }, readout);
  const old34 = T(readout, 0, -36, '34 °C', { size: 54, weight: 800, anchor: 'middle', fill: '#FF4D4D' });
  const oldStrike = strike(readout, -90, -54, 90, '#FFFFFF');
  const new25 = T(readout, 0, 72, '25 °C', { size: 92, weight: 800, anchor: 'middle', fill: '#4FE0A0' });
  const newChip = bkChip(Lfg, 'a new number', { size: 30, color: C.energy });
  const celSparks = [0, 1, 2].map(i => spark(Lfg, 18, { seed: i + 5 }));

  /* cut points */
  const cExp = at('expand') - 0.06, cOrder = at('order') - 0.06, cBridge = at('bridge') - 0.06, cDense = at('dense') - 0.06;
  const cLoop = at('loop') - 0.06, cNoZip = at('nozip') - 0.06, cRises = at('rises') - 0.06, cPush = end('rises') + 0.12;
  const cHigh = at('high') - 0.06, cNew = at('new') - 0.06;

  return t => {
    const sA = acOn(t, -1, cExp), sB = acOn(t, cExp, cOrder), sC = acOn(t, cOrder, cBridge), sD = acOn(t, cBridge, cDense), sE = acOn(t, cDense, cLoop);
    const sF = acOn(t, cLoop, cNoZip), sG = acOn(t, cNoZip, cRises), sH = acOn(t, cRises, cPush), sI = acOn(t, cPush, cHigh), sJ = acOn(t, cHigh, cNew), sK = acOn(t, cNew, 1e9);
    const livOn = Math.max(sA, sF, sH, sJ);
    let celOn = 0, gusOn = 0, zipOn = 0;

    /* ---------- the living room ---------- */
    op(livShot, livOn);
    const acP = t < at('on') ? 0 : P(t, mid('on', 0.15), 0.5, linear);
    if (livOn) {
      liv.upd(t, { fan: acP > 0.5 ? 0 : 0.3 * AMP, ac: acP });
      clock.set(t < end('count') - 0.1 ? '8:59' : '9:00'); op(clock, sF || sH ? 0 : 1);
      if (sA && t < at('count') - 0.06) acCam(world, 600, 375, 1 + 0.05 * P(t, 0, at('count'), linear), 600, 375);
      else if (sA && t < at('on') - 0.06) acCam(world, 740, 330, 1.45 + 0.05 * P(t, at('count'), 2, linear), 700, 380);
      else if (sA) acCam(world, 600, 375, 1, 600, 375);
      else if (sF) acCam(world, 600, 375, 1, 600, 375);
      else if (sH) acCam(world, 820, 380, 1.55 + 0.05 * P(t, at('rises'), 2.4, linear), 640, 400);
      else acCam(world, 600, 375, 1.02 + 0.03 * P(t, cHigh, 6, linear), 600, 375);
      // Kavya, the remote
      const showKav = !sF;
      op(kav, showKav ? 1 : 0); op(remote, sA ? 1 : 0);
      if (showKav) {
        tr(kav, KX, KY, KS);
        let mood = 'deadpan', look = 0, sweat = 1;
        if (sA && t < at('count') - 0.06) { mood = 'annoyed'; look = -0.9; }
        if (sA && t >= at('on') - 0.06) { mood = t > mid('on', 0.25) ? 'happy' : 'deadpan'; look = 0.4; sweat = 1 - P(t, mid('on', 0.3), 1.5, linear); }
        if (sH) { mood = 'smug'; sweat = 0; }
        if (sJ) { mood = 'happy'; sweat = 0; look = 0.3; }
        kav.set({ t: sH && t > end('rises') ? end('rises') : t, talk: scTalk(S, t, 'kavya'), mood, look, sweat });
        const jab = sA && t > mid('on', 0.08) ? Math.sin(Math.PI * P(t, mid('on', 0.08), 0.35, linear)) : 0;
        tr(remote, 712 + 30 * jab, 450 - 14 * jab, 1, 38);
        tr(rmt, 0, 0, 0.62);
        op(signal, jab > 0.05 ? jab : 0); tr(signal, 790 + 30 * jab, 360, 1 + jab * 0.4, 38);
      }
      const dp = sA ? P(t, mid('on', 0.2), 0.45, pop) : 0;
      op(ding, sA ? clamp(dp * 2.5) * (1 - P(t, mid('on', 0.7), 0.3, linear)) : 0); tr(ding, 760, 140, Math.max(0.01, dp));
      // high: sweeping cold air
      op(sweep, sJ ? 1 : 0);
      if (sJ) sweepA.forEach((a, i) => a.set(P(t, at('high') + 0.3 + i * 0.5, 1, ease)));
      // the loop
      op(loopG, sF ? P(t, cLoop, 0.25, linear) : 0);
      if (sF) {
        chev.forEach((c, i) => {
          const a = i / NCH * TAU + (t - cLoop) * 0.9 * AMP, [x, y] = loopPt(a), [x2, y2] = loopPt(a + 0.02);
          c.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(Math.atan2(y2 - y, x2 - x) * 180 / Math.PI).toFixed(1)})`);
          attr(c, 'stroke', lerpCol('#4FB3FF', '#FF8A3D', warmAt(a)));
        });
      }
    }
    // living-room labels
    const ct = sA && t >= at('count') - 0.06 && t < at('on') - 0.06;
    if (ct) {
      const k = Math.min(2, Math.floor((t - at('count')) / ((end('count') - at('count')) / 3)));
      setText(count, String(3 - Math.max(0, k)));
      const p = P(t, at('count') + k * (end('count') - at('count')) / 3, 0.3, pop);
      op(count, 1); tr(count, 260, 470, Math.max(0.01, 0.6 + 0.4 * p));
    } else op(count, 0);
    if (sA && t >= at('on') - 0.06) acPop(onChip, t, mid('on', 0.35), 330, 650); else op(onChip, 0);
    const lpOn = sF && t < at('current') - 0.06;
    [[lSink, 0.04, 880, 330], [lWarm, 0.3, 600, 470], [lRise, 0.52, 320, 330], [lCool, 0.68, 600, 215]].forEach(([c, f, x, y]) => { if (lpOn) acPop(c, t, mid('loop', f), x, y); else op(c, 0); });
    if (sF && t >= at('current') - 0.06) { acPop(ccChip, t, mid('current', 0.15), 600, 340); acPop(fluidChip, t, mid('current', 0.55), 600, 680); } else { op(ccChip, 0); op(fluidChip, 0); }
    if (sH) { acPop(quote, t, mid('rises', 0.35), 470, 230); } else op(quote, 0);
    if (sJ) { acPop(highChip, t, mid('high', 0.15), 720, 135); acPop(sinkChip, t, mid('high', 0.45), 600, 690); op(ahh, P(t, mid('high', 0.7), 0.4, linear)); tr(ahh, 820, 250 - 6 * Math.sin(t * 2)); }
    else { op(highChip, 0); op(sinkChip, 0); op(ahh, 0); }

    // Gus rides the loop; Zip bounces into the room
    if (sF) {
      gusOn = 1;
      const a = -0.25 + TAU * clamp((t - at('loop') + 0.1) / (end('loop') - at('loop') + 0.4)) + Math.max(0, t - end('loop') - 0.3) * 0.6;
      const [gx, gy] = loopPt(a);
      tr(gus, gx, gy, 0.42, 14 * Math.sin(t * 5));
      gus.set({ t, talk: scTalk(S, t, 'gus'), mood: 'happy', look: 0 });
      op(gus, t > end('current') ? 1 - P(t, end('current'), 0.3, linear) : 1);
      if (t > at('zip') - 0.3) {
        zipOn = 1;
        const ep = P(t, at('zip') - 0.3, 0.5, easeOut);
        tr(zip, lerp(1300, 820, ep), 610 - 70 * Math.abs(Math.sin(t * 6)) * (ep > 0.99 ? 1 : 0), 0.62);
        zip.set({ t, talk: scTalk(S, t, 'zip'), mood: 'happy', look: -0.6, zoom: 1 - ep });
        op(zip, 1);
      }
    }

    /* ---------- Cel's confessional (B expand/mass, G nozip/sad, I push-in/warmair, K new) ---------- */
    const celConf = Math.max(sB, sG, sI, sK);
    confCel.set(celConf, t);
    op(panel, sB);
    if (celConf) {
      celOn = 1;
      let cx = 250, cy = 420, cs = 1.2, mood = 'neutral', look = 0, temp = 34;
      if (sB) { mood = t > at('mass') && t < end('mass') - 0.3 ? 'neutral' : 'deadpan'; if (t > end('mass')) mood = 'deadpan'; look = 0.5; }
      if (sG) { cx = 330; cy = 400; cs = 1.4; mood = 'deadpan'; look = t > at('sad') ? 0.8 : 0.5; }
      if (sI && t < at('warmair') - 0.06) {
        const push = P(t, cPush, at('warmair') - cPush, linear);
        cs = 1.7 + 0.6 * push; cx = 600; cy = 400 - 56 * cs; mood = 'deadpan';
      } else if (sI) { cx = 260; cy = 430; cs = 1.25; mood = t > mid('warmair', 0.4) ? 'annoyed' : 'deadpan'; look = 0.4; }
      if (sK) {
        cx = 400; cy = 390; cs = 1.5; temp = lerp(34, 25, P(t, mid('new', 0.05), 1.4, ease));
        mood = t < mid('new', 0.55) ? 'shock' : (t < end('new') + 0.1 ? 'sad' : 'happy');
      }
      tr(cel, cx, cy, cs);
      cel.set({ t, talk: scTalk(S, t, 'cel'), mood, look, temp });
      op(celTears, sK && t > mid('new', 0.5) ? 0.6 + 0.4 * wave(t, 0.7) : 0);
    }
    // B: expand
    const ex = sB && t < at('mass') - 0.06;
    op(gExp, ex ? 1 : 0); op(hot, ex ? P(t, mid('expand', 0.12), 0.4, linear) : 0);
    if (ex) {
      const hp = P(t, mid('expand', 0.2), 3.2, ease);
      tr(gExp, 815, 330); gExp.set(lerp(36, 56, hp), lerp(1, 7, hp) * AMP + 0.5, t, hp);
      tr(hot, 815, 520); op(hot, 0.3 + 0.7 * hp);
      acPop(heatChip, t, mid('expand', 0.15), 815, 590);
      acPop(fastChip, t, mid('expand', 0.35), 610, 180); acPop(apartChip, t, mid('expand', 0.55), 1010, 180);
      acPop(expChip, t, mid('expand', 0.85), 815, 590);
      op(heatChip, t < mid('expand', 0.82) ? 1 : 0);
    } else { op(heatChip, 0); op(fastChip, 0); op(apartChip, 0); op(expChip, 0); }
    // B: mass
    const ms = sB && t >= at('mass') - 0.06;
    op(bal, ms ? 1 : 0);
    if (ms) {
      tr(gB, 700, 446 - 60); gB.set(30, 1, t, 0);
      tr(gA, 1000, 446 - 88); gA.set(44, 4 * AMP, t, 1);
      acPop(volChip, t, mid('mass', 0.1), 1000, 230);
      acPop(massChip, t, mid('mass', 0.32), 700, 200);
      acPop(levelChip, t, mid('mass', 0.45), 850, 660);
      acPop(spaceChip, t, mid('mass', 0.68), 815, 660);
      op(levelChip, t < mid('mass', 0.66) ? P(t, mid('mass', 0.45), 0.3, linear) : 0);
    } else { op(volChip, 0); op(massChip, 0); op(levelChip, 0); op(spaceChip, 0); }

    /* ---------- C: Gus, gases expand the most ---------- */
    confGus.set(sC, t);
    op(bars, sC);
    if (sC) {
      gusOn = 1;
      const st = 1 + 0.1 * P(t, mid('order', 0.55), 0.6, ease) * (0.7 + 0.3 * Math.sin(t * 2.5));
      gus.setAttribute('transform', `translate(900 430) scale(${(1.15 * st).toFixed(3)} ${(1.15 / st).toFixed(3)})`);
      gus.set({ t, talk: scTalk(S, t, 'gus'), mood: t > mid('order', 0.6) ? 'happy' : 'smug', look: -0.5 });
      op(gus, 1);
      barEls.forEach((b, i) => attr(b.el, 'width', b.w * P(t, mid('order', [0.06, 0.2, 0.32][i]), 0.7, easeOut)));
      const rp = P(t, mid('order', 0.6), 1, easeOut);
      op(ring_, rp > 0 ? 0.8 : 0); tr(ring_, 900, 430, 0.9 + 0.5 * rp + 0.03 * Math.sin(t * 3));
      acPop(psChip, t, mid('order', 0.7), 900, 680);
    } else { op(ring_, 0); op(psChip, 0); }

    /* ---------- D: the bridge ---------- */
    op(bridge, sD);
    if (sD) {
      bSun.upd(t);
      const hp = P(t, mid('bridge', 0.3), 2.2, ease);
      tr(deckL, 600 - 26 + 18 * hp, 0); tr(deckR, 600 + 26 - 18 * hp, 0);
      op(gapRing, P(t, mid('bridge', 0.15), 0.3, linear));
      acPop(hotDay, t, mid('bridge', 0.25), 1050, 280);
      acPop(gapChip, t, mid('bridge', 0.45), 600, 200);
      op(bInset, P(t, mid('bridge', 0.7), 0.3, linear));
    } else { op(hotDay, 0); op(gapChip, 0); }

    /* ---------- E: dense ---------- */
    op(denseSet, sE);
    if (sE) {
      const mp = P(t, mid('dense', 0.25), 2.5, ease), mc = P(t, mid('dense', 0.65), 2, ease);
      tr(parW, 200, 360 - 70 * mp); tr(parC, 740, 220 + 80 * mc);
      pbW.set('gas', t, 1); pbC.set('gas', t, 0.08);
      upA.set(P(t, mid('dense', 0.3), 0.6, ease)); op(upA, P(t, mid('dense', 0.3), 0.1, linear));
      dnA.set(P(t, mid('dense', 0.7), 0.6, ease)); op(dnA, P(t, mid('dense', 0.7), 0.1, linear));
      acPop(wLbl, t, mid('dense', 0.12), 330, 592);
      acPop(cLbl, t, mid('dense', 0.55), 870, 150);
      acPop(sameBox, t, mid('dense', 0.05), 600, 700);
    } else { op(wLbl, 0); op(cLbl, 0); op(sameBox, 0); }

    /* ---------- G: nozip, sad ---------- */
    if (sG) {
      zipOn = 1;
      const out = P(t, at('sad'), end('sad') + 0.6 - at('sad'), linear);
      const sadNow = t >= at('sad') - 0.06;
      tr(zip, lerp(880, 1320, out), 470, 0.8);
      zip.set({ t, talk: scTalk(S, t, 'zip'), mood: sadNow ? 'sad' : (t > mid('nozip', 0.4) ? 'shock' : 'happy'), look: sadNow ? 0.6 : -0.7, still: sadNow, zoom: 0 });
      op(zip, 1);
      acPop(spoon, t, mid('nozip', 0.3), 760, 660, 1, -6);
      acPop(solidChip, t, mid('nozip', 0.55), 900, 180);
      acPop(noSwirl, t, mid('nozip', 0.75), 650, 270);
      op(sadly, P(t, mid('sad', 0.5), 0.3, linear)); tr(sadly, lerp(880, 1320, out), 340);
    } else { op(spoon, 0); op(solidChip, 0); op(noSwirl, 0); op(sadly, 0); }

    /* ---------- I: the correction card ---------- */
    const wa = sI && t >= at('warmair') - 0.06;
    if (wa) {
      acPop(corr, t, at('warmair') + 0.05, 500, 160);
      op(r1, P(t, mid('warmair', 0.04), 0.25, linear)); op(r1b, P(t, mid('warmair', 0.22), 0.25, linear));
      op(r2, P(t, mid('warmair', 0.45), 0.25, linear)); op(r3, P(t, mid('warmair', 0.66), 0.25, linear));
      op(r1hi, t > mid('warmair', 0.84) ? 0.5 + 0.5 * wave(t, 0.6) : 0);
    } else op(corr, 0);

    /* ---------- K: a new number ---------- */
    if (sK) {
      acPop(readout, t, mid('new', 0.1), 880, 330);
      oldStrike.set(P(t, mid('new', 0.15), 0.4, ease));
      op(new25, P(t, mid('new', 0.3), 0.3, linear));
      acPop(newChip, t, mid('new', 0.6), 880, 500);
      celSparks.forEach((s, i) => { op(s, P(t, end('new') + i * 0.2, 0.3, linear)); tr(s, [290, 520, 880][i], [210, 230, 150][i]); s.upd(t); });
    } else { op(readout, 0); op(newChip, 0); celSparks.forEach(s => op(s, 0)); }

    if (!celOn) op(cel, 0); else op(cel, 1);
    if (!gusOn) op(gus, 0);
    if (!zipOn) op(zip, 0);
  };
});
