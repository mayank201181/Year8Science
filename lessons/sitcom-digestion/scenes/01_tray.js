/* Scene 1: "The passenger check" (the tray).
   Shots (hard sitcom cuts):
   MOUTH platform: Percy with his mic, seven fare gates; the seven nutrient groups tap in as the mnemonic builds
   -> hawker table: Kavya points at the tray, "no fish" -> platform: the fish is a memory trick -> Kavya, annoyed
   -> tray close-up (Percy on the PA inset): rice = carbohydrates, chicken = protein, the chicken-fat shine = fats
   -> table: "Isn't fat bad?" -> platform: energy-in vs energy-used balance -> close-up: cucumber = vitamins +
   minerals, and Phoebe rises from behind the plate -> table: Phoebe (fibre) -> Percy confessional: soup = water;
   water and fibre: no energy, essential -> platform: the SERVICE DISRUPTION board (deficiency diseases: scurvy,
   rickets, anaemia, constipation with Phoebe) -> no germ, not catching -> Kavya: energy needs vary -> "Upsize?"
   -> the upsize is one giant cucumber slice: VARIETY. */
scene('tray', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;
  const INK = SC_INK, SKIN = '#B9784E';

  /* ---------- local helpers (prefixed tray) ---------- */
  const trayCam = (el, c) => el.setAttribute('transform', `translate(${c.cx.toFixed(1)} ${c.cy.toFixed(1)}) scale(${c.k.toFixed(4)}) translate(${(-c.cx).toFixed(1)} ${(-c.cy).toFixed(1)})`);
  // pop an element in at t0 (overshoot), shown until t1 (hard cut)
  const trayPin = (el, t, t0, t1, x, y, s, r) => {
    if (t < t0 || t >= t1) { op(el, 0); return 0; }
    const p = P(t, t0, 0.42, pop); op(el, clamp(p * 2.5)); tr(el, x, y, Math.max(0.01, (s || 1) * (0.6 + 0.4 * p)), r); return p;
  };
  // rounded pill with **bold** segments in a highlight colour
  function trayChip(parent, text, o) {
    o = o || {};
    const size = o.size || 30, h = Math.round(size * 1.72), w = Math.ceil(textWidth(text, size, FD, 700) + size * 1.4);
    const g = G(parent);
    E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: o.rx !== undefined ? o.rx : h / 2, fill: o.fill || 'rgba(10,27,39,0.9)', stroke: o.stroke || C.line, 'stroke-width': o.sw || 3 }, g);
    T(g, 0, size * 0.35, text, { size, weight: o.weight || 700, fill: o.color || C.ink, anchor: 'middle', boldFill: o.bold || C.energy });
    g.w = w; return g;
  }
  // a card: icon slot on top (g.icon), a title and a sub line
  function trayCard(parent, title, sub, o) {
    o = o || {};
    const ts = o.ts || 38, ss = o.ss || 28;
    const w = o.w || Math.ceil(Math.max(textWidth(title, ts, FD, 800), textWidth(sub || '', ss, FD, 600)) + 56);
    const ih = o.ih || 0, h = o.h || (ih + ts * 1.3 + (sub ? ss * 1.4 : 0) + 34);
    const g = G(parent);
    E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: 18, fill: o.fill || 'rgba(10,27,39,0.92)', stroke: o.col || C.line, 'stroke-width': 4 }, g);
    g.icon = G(g); tr(g.icon, 0, -h / 2 + 16 + ih / 2);
    T(g, 0, -h / 2 + 16 + ih + ts * 0.95, title, { size: ts, weight: 800, anchor: 'middle', fill: o.col || C.ink });
    if (sub) T(g, 0, -h / 2 + 16 + ih + ts * 1.3 + ss * 1.05, sub, { size: ss, weight: 600, anchor: 'middle', fill: o.subCol || C.ink });
    g.w = w; g.h = h; return g;
  }
  // Kavya's arm (sleeve + forearm + hand); shoulder at (0,0), pointing along +x before rotation. o.finger: index finger out
  function trayArm(parent, o) {
    o = o || {};
    const g = G(parent);
    E('path', { d: 'M0,0 L150,0', stroke: INK, 'stroke-width': 40, 'stroke-linecap': 'round' }, g);
    E('path', { d: 'M0,0 L150,0', stroke: SKIN, 'stroke-width': 32, 'stroke-linecap': 'round' }, g);
    E('path', { d: 'M-6,-22 L56,-22 L56,22 L-6,22 Z', fill: '#2E7DD8', stroke: INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);   // sleeve
    E('circle', { cx: 160, cy: 0, r: 22, fill: SKIN, stroke: INK, 'stroke-width': 4 }, g);   // hand
    const fin = 'M168,-6 L206,-8', fist = 'M150,-20 L146,-40 M162,-22 L162,-44 M174,-18 L180,-38';
    g.digits = E('path', { d: fin, stroke: INK, 'stroke-width': 15, 'stroke-linecap': 'round' }, g);
    g.digitsIn = E('path', { d: fin, stroke: SKIN, 'stroke-width': 8, 'stroke-linecap': 'round' }, g);
    g.point = on => { attr(g.digits, 'd', on ? fin : fist); attr(g.digitsIn, 'd', on ? fin : fist); attr(g.digits, 'stroke-width', on ? 15 : 13); attr(g.digitsIn, 'stroke-width', on ? 8 : 7); };
    return g;
  }
  // the station PA inset: a small window with Percy and his mic (top right, HUD)
  function trayPA(parent) {
    const g = G(parent);
    E('rect', { x: -102, y: -100, width: 204, height: 206, rx: 14, fill: '#0E1A24', stroke: '#FFB000', 'stroke-width': 4 }, g);
    E('rect', { x: -102, y: -100, width: 204, height: 40, rx: 12, fill: '#FFB000' }, g);
    T(g, -10, -70, 'PA', { size: 28, weight: 800, anchor: 'middle', fill: '#0E1A24' });
    E('path', { d: 'M20,-86 L30,-86 L40,-94 L40,-66 L30,-74 L20,-74 Z M48,-88 Q56,-80 48,-72', fill: '#0E1A24', stroke: '#0E1A24', 'stroke-width': 2, 'stroke-linejoin': 'round' }, g);
    const cp = E('clipPath', { id: 'trayPAclip' }, defs()); E('rect', { x: -92, y: -58, width: 184, height: 156, rx: 8 }, cp);
    const win = G(g, { 'clip-path': 'url(#trayPAclip)' });
    E('rect', { x: -92, y: -58, width: 184, height: 156, fill: linGrad('#5A1A2A', '#8E3348', true) }, win);
    E('path', { d: 'M-92,-30 Q0,-56 92,-30 M-92,0 Q0,-26 92,0', fill: 'none', stroke: '#B04A62', 'stroke-width': 8, opacity: 0.5 }, win);
    g.inner = G(win);
    g.mic = mgMic(win, 0.5); tr(g.mic, 52, 64, 0.5, -12);
    return g;
  }
  // the seven fare gates: 8 cabinets, 7 lanes with a light and two flaps each; g.lane(i, open 0..1)
  function trayGates(parent, xs) {
    const g = G(parent), lanes = [];
    const cab = x => {
      bodyD += `M${x - 20},470 L${x + 20},470 L${x + 20},562 L${x - 20},562 Z `; capD += `M${x - 20},470 L${x + 20},470 L${x + 20},486 L${x - 20},486 Z `;
    };
    let bodyD = '', capD = '';
    xs.forEach((x, i) => cab(x - 65));
    cab(xs[xs.length - 1] + 65);
    E('path', { d: bodyD, fill: linGrad('#DDE4E8', '#9AA6AE', true), stroke: '#4A5660', 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
    E('path', { d: capD, fill: '#2B3138' }, g);
    xs.forEach(x => {
      const fl = E('path', { d: 'M0,-8 L44,-8 L44,8 L0,8 Z', fill: '#D7263D', stroke: '#7A1020', 'stroke-width': 2 }, g);
      const fr = E('path', { d: 'M0,-8 L-44,-8 L-44,8 L0,8 Z', fill: '#D7263D', stroke: '#7A1020', 'stroke-width': 2 }, g);
      const light = E('circle', { cx: x - 65, cy: 500, r: 8, fill: '#FF4040', stroke: '#2B3138', 'stroke-width': 2 }, g);
      lanes.push({ x, fl, fr, light });
    });
    g.lane = (i, o) => {
      const L = lanes[i], sx = (1 - 0.82 * clamp(o)).toFixed(3);
      L.fl.setAttribute('transform', `translate(${L.x - 45} 516) scale(${sx} 1)`);
      L.fr.setAttribute('transform', `translate(${L.x + 45} 516) scale(${sx} 1)`);
      attr(L.light, 'fill', o > 0.05 ? '#3BE07A' : '#FF4040');
    };
    xs.forEach((x, i) => g.lane(i, 0));
    return g;
  }
  // balance scale: pivot at (0,0); g.set(tilt deg, nIn bowls 1..4)
  function trayScale(parent) {
    const g = G(parent);
    E('path', { d: 'M-70,190 L70,190 L40,170 L-40,170 Z', fill: '#5A6B7A', stroke: INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
    E('rect', { x: -9, y: 0, width: 18, height: 172, fill: '#8A9AA6', stroke: INK, 'stroke-width': 3 }, g);
    const beam = G(g);
    E('rect', { x: -210, y: -9, width: 420, height: 18, rx: 9, fill: '#C9D3DC', stroke: INK, 'stroke-width': 4 }, beam);
    E('circle', { r: 14, fill: '#FFB000', stroke: INK, 'stroke-width': 4 }, g);
    const pans = [-200, 200].map(x => {
      const p = G(g);
      E('path', { d: 'M0,0 L-60,70 M0,0 L60,70', stroke: '#5A6B7A', 'stroke-width': 3 }, p);
      E('path', { d: 'M-80,70 L80,70 Q70,100 0,102 Q-70,100 -80,70 Z', fill: '#C9D3DC', stroke: INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, p);
      return p;
    });
    // energy in: bowls of rice stacking up; energy used: one running shoe
    const bowls = [0, 1, 2].map(i => { const b = G(pans[0]); tr(b, 0, 52 - i * 30);
      E('path', { d: 'M-38,0 Q-34,26 0,28 Q34,26 38,0 Z', fill: '#FFFFFF', stroke: INK, 'stroke-width': 3 }, b);
      E('path', { d: 'M-34,0 Q0,-26 34,0 Z', fill: '#FBF3DE', stroke: '#D9C79C', 'stroke-width': 3 }, b); return b; });
    const shoe = G(pans[1]); tr(shoe, 0, 50);
    E('path', { d: 'M-44,14 L-40,-14 Q-24,-14 -16,-6 Q6,0 30,2 Q46,6 46,14 Z', fill: '#FF6070', stroke: INK, 'stroke-width': 3.5, 'stroke-linejoin': 'round' }, shoe);
    E('rect', { x: -46, y: 12, width: 94, height: 8, rx: 4, fill: '#FFFFFF', stroke: INK, 'stroke-width': 3 }, shoe);
    g.set = (deg, n) => {
      beam.setAttribute('transform', `rotate(${deg.toFixed(2)})`);
      const a = deg * Math.PI / 180;
      tr(pans[0], -200 * Math.cos(a), -200 * Math.sin(a)); tr(pans[1], 200 * Math.cos(a), 200 * Math.sin(a));
      bowls.forEach((b, i) => op(b, n > i ? clamp(n - i) : 0));
    };
    g.set(0, 1);
    return g;
  }
  // small icons (about 70 px)
  const icon = {
    battery: p => { const g = G(p); E('rect', { x: -40, y: -22, width: 74, height: 44, rx: 8, fill: '#0E1A24', stroke: C.ink, 'stroke-width': 4 }, g); E('rect', { x: 36, y: -9, width: 8, height: 18, rx: 3, fill: C.ink }, g); E('rect', { x: -33, y: -15, width: 46, height: 30, rx: 4, fill: C.good }, g); bolt(g, 0.36); return g; },
    scarf: p => { const g = G(p); E('path', { d: 'M-40,-22 Q0,-6 40,-22 L40,-4 Q0,12 -40,-4 Z M14,-6 L30,36 L12,40 L-2,-2 Z', fill: '#E8424F', stroke: INK, 'stroke-width': 3.5, 'stroke-linejoin': 'round' }, g); E('path', { d: 'M-22,-12 L-22,6 M-4,-8 L-4,10 M20,22 L8,25 M15,32 L30,30', stroke: '#FFE45C', 'stroke-width': 4 }, g); E('path', { d: 'M14,40 L12,50 M20,39 L19,50 M26,38 L27,48', stroke: '#E8424F', 'stroke-width': 3 }, g); return g; },
    shield: p => { const g = G(p); E('path', { d: 'M0,-36 L32,-24 Q32,18 0,38 Q-32,18 -32,-24 Z', fill: '#4C7FE0', stroke: INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, g); E('path', { d: 'M0,16 C-22,2 -18,-18 0,-8 C18,-18 22,2 0,16 Z', fill: '#FF8FB0', stroke: INK, 'stroke-width': 3 }, g); return g; },
    cake: p => { const g = G(p); E('rect', { x: -36, y: -6, width: 72, height: 38, rx: 6, fill: '#FFB3DA', stroke: INK, 'stroke-width': 3.5 }, g); E('path', { d: 'M-36,2 Q-27,12 -18,2 Q-9,12 0,2 Q9,12 18,2 Q27,12 36,2', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 5 }, g); E('rect', { x: -4, y: -32, width: 8, height: 26, fill: '#7FD6F7', stroke: INK, 'stroke-width': 2.5 }, g); E('path', { d: 'M0,-48 Q8,-38 0,-32 Q-8,-38 0,-48 Z', fill: '#FFB000' }, g); return g; },
    shoe: p => { const g = G(p); E('path', { d: 'M-44,14 L-40,-18 Q-24,-18 -16,-8 Q6,-2 30,0 Q46,4 46,14 Z', fill: '#56D69B', stroke: INK, 'stroke-width': 3.5, 'stroke-linejoin': 'round' }, g); E('rect', { x: -46, y: 12, width: 94, height: 10, rx: 5, fill: '#FFFFFF', stroke: INK, 'stroke-width': 3 }, g); E('path', { d: 'M-26,-8 L-18,-14 M-18,-4 L-10,-10 M-56,-10 L-70,-10 M-56,2 L-74,2', stroke: INK, 'stroke-width': 3, 'stroke-linecap': 'round' }, g); return g; },
    ruler: p => { const g = G(p); tr(g, 0, 0, 1, -20); E('rect', { x: -46, y: -14, width: 92, height: 28, rx: 4, fill: '#FFD25A', stroke: INK, 'stroke-width': 3.5 }, g); let d = ''; for (let i = 0; i < 9; i++) d += `M${-38 + i * 9.5},-14 l0,${i % 2 ? 8 : 14} `; E('path', { d, stroke: INK, 'stroke-width': 2.5 }, g); return g; },
    sex: p => { const g = G(p); E('path', { d: 'M-24,-10 m-15,0 a15,15 0 1,0 30,0 a15,15 0 1,0 -30,0 M-24,5 L-24,30 M-34,20 L-14,20', fill: 'none', stroke: '#FF8FB0', 'stroke-width': 5, 'stroke-linecap': 'round' }, g); E('path', { d: 'M20,4 m-15,0 a15,15 0 1,0 30,0 a15,15 0 1,0 -30,0 M31,-7 L44,-20 M32,-20 L44,-20 L44,-8', fill: 'none', stroke: '#7FD6F7', 'stroke-width': 5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g); return g; },
    pram: p => { const g = G(p); E('path', { d: 'M-40,-4 L36,-4 Q36,22 0,24 Q-40,22 -40,-4 Z', fill: '#B48CFF', stroke: INK, 'stroke-width': 3.5 }, g); E('path', { d: 'M-40,-4 Q-40,-38 -4,-38 L-4,-4 Z', fill: '#7550C4', stroke: INK, 'stroke-width': 3.5 }, g); E('path', { d: 'M36,-4 L50,-24', stroke: INK, 'stroke-width': 4, 'stroke-linecap': 'round' }, g); E('circle', { cx: -24, cy: 32, r: 9, fill: '#3A4652', stroke: INK, 'stroke-width': 3 }, g); E('circle', { cx: 22, cy: 32, r: 9, fill: '#3A4652', stroke: INK, 'stroke-width': 3 }, g); return g; },
    orange: p => { const g = G(p); E('circle', { r: 40, fill: '#FF9A2A', stroke: '#B85E10', 'stroke-width': 5 }, g); E('circle', { r: 32, fill: '#FFD08A' }, g); let d = ''; for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; d += `M0,0 L${(Math.cos(a) * 30).toFixed(1)},${(Math.sin(a) * 30).toFixed(1)} `; } E('path', { d, stroke: '#FF9A2A', 'stroke-width': 3 }, g); return g; },
    bone: p => { const g = G(p); E('path', { d: 'M-50,-20 Q0,30 50,-20', fill: 'none', stroke: INK, 'stroke-width': 26, 'stroke-linecap': 'round' }, g); E('path', { d: 'M-50,-20 Q0,30 50,-20', fill: 'none', stroke: '#F5EBD6', 'stroke-width': 18, 'stroke-linecap': 'round' }, g); E('path', { d: [[-56, -26], [-44, -32], [56, -26], [44, -32]].map(([x, y]) => `M${x - 11},${y} a11,11 0 1,0 22,0 a11,11 0 1,0 -22,0 `).join(''), fill: '#F5EBD6', stroke: INK, 'stroke-width': 3.5 }, g); return g; },
    rbc: p => { const g = G(p), C3 = [[-40, 6], [8, -10], [44, 14]], el = (rx, ry) => C3.map(([x, y]) => `M${x - rx},${y} a${rx},${ry} 0 1,0 ${2 * rx},0 a${rx},${ry} 0 1,0 ${-2 * rx},0 `).join(''); E('path', { d: el(24, 15), fill: '#F2A0A6', stroke: '#C2454F', 'stroke-width': 3 }, g); E('path', { d: el(10, 5), fill: '#E57A82' }, g); return g; },
    fish: p => { const g = G(p); E('path', { d: 'M-36,0 Q-10,-26 22,-6 L40,-20 L36,0 L40,20 L22,6 Q-10,26 -36,0 Z', fill: '#7FD6F7', stroke: INK, 'stroke-width': 3.5, 'stroke-linejoin': 'round' }, g); E('circle', { cx: -20, cy: -3, r: 4, fill: INK }, g); return g; },
    germ: p => { const g = G(p); let d = ''; for (let i = 0; i < 10; i++) { const a = i / 10 * TAU; d += `M${(Math.cos(a) * 46).toFixed(1)},${(Math.sin(a) * 46).toFixed(1)} L${(Math.cos(a) * 66).toFixed(1)},${(Math.sin(a) * 66).toFixed(1)} `; } E('path', { d, stroke: '#3E8E2A', 'stroke-width': 8, 'stroke-linecap': 'round' }, g); E('circle', { r: 52, fill: ball('#9BE36A', '#3E8E2A'), stroke: INK, 'stroke-width': 4 }, g); E('path', { d: 'M-26,-18 L-8,-10 M26,-18 L8,-10 M-18,20 Q0,8 18,20', fill: 'none', stroke: INK, 'stroke-width': 5, 'stroke-linecap': 'round' }, g); E('circle', { cx: -16, cy: -2, r: 5, fill: INK }, g); E('circle', { cx: 16, cy: -2, r: 5, fill: INK }, g); return g; },
    drop: p => { const g = G(p); E('path', { d: 'M0,-34 Q24,0 22,12 Q20,32 0,32 Q-20,32 -22,12 Q-24,0 0,-34 Z', fill: C.water, stroke: C.waterDk, 'stroke-width': 4 }, g); E('path', { d: 'M-10,6 Q-10,18 -2,22', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 4, 'stroke-linecap': 'round' }, g); return g; },
    celery: p => { const g = G(p); E('rect', { x: -12, y: -26, width: 24, height: 60, rx: 10, fill: '#B0E290', stroke: '#3E8E2A', 'stroke-width': 3.5 }, g); E('path', { d: 'M-12,-26 Q-26,-46 -12,-48 Q-4,-40 0,-28 Q6,-46 16,-44 Q22,-34 12,-26', fill: '#6CC24A', stroke: '#3E8E2A', 'stroke-width': 3 }, g); E('path', { d: 'M-4,-16 L-4,26 M5,-16 L5,26', stroke: '#5FA843', 'stroke-width': 2.5 }, g); return g; },
  };
  function trayBowl(parent) {
    const g = G(parent);
    E('path', { d: 'M-62,0 Q-58,52 0,56 Q58,52 62,0 Z', fill: '#FFFFFF', stroke: '#9AA6AE', 'stroke-width': 4 }, g);
    E('ellipse', { cx: 0, cy: 0, rx: 62, ry: 18, fill: '#E2B56A', stroke: '#9AA6AE', 'stroke-width': 4 }, g);
    E('ellipse', { cx: -16, cy: -2, rx: 10, ry: 4, fill: '#7FB04A' }, g); E('ellipse', { cx: 18, cy: 3, rx: 8, ry: 3, fill: '#7FB04A' }, g);
    g.steam = heatWaves(g, { n: 3, h: 60, spacing: 26, color: '#FFFFFF', width: 4 }); tr(g.steam, 0, -24);
    return g;
  }
  function trayBubble(parent, text, w, h, tail) {
    const g = G(parent);
    E('path', { d: `M${-w / 2 + 24},${-h / 2} L${w / 2 - 24},${-h / 2} Q${w / 2},${-h / 2} ${w / 2},${-h / 2 + 24} L${w / 2},${h / 2 - 24} Q${w / 2},${h / 2} ${w / 2 - 24},${h / 2} L${tail[0] + 30},${h / 2} L${tail[1]},${tail[2]} L${tail[0]},${h / 2} L${-w / 2 + 24},${h / 2} Q${-w / 2},${h / 2} ${-w / 2},${h / 2 - 24} L${-w / 2},${-h / 2 + 24} Q${-w / 2},${-h / 2} ${-w / 2 + 24},${-h / 2} Z`, fill: '#FFFFFF', stroke: INK, 'stroke-width': 5, 'stroke-linejoin': 'round' }, g);
    T(g, 0, 15, text, { size: 42, weight: 800, anchor: 'middle', fill: '#D7263D' });
    return g;
  }

  /* layers: world (zoomed by the camera): sets, cast, props. Screen (not zoomed): UI chips and cards, HUD */
  const Lbg = G(root), Lcast = G(root), Lprop = G(root), Lui = G(root), Lhud = G(root);

  /* ================= sets ================= */
  const platShot = G(Lbg); const plat = mgPlatform(platShot, 'MOUTH', 'AL1');
  const tabShot = G(Lbg); const hawker = mgHawker(tabShot);
  const confShot = mgConf(Lbg, 'percy');

  /* ================= cast ================= */
  const kav = cast(Lcast, 'kavya', { mood: 'neutral' });
  const phWrap = G(Lcast);
  const phCp = E('clipPath', { id: 'trayPhClip' }, defs()); E('rect', { x: -200, y: -500, width: 400, height: 520 }, phCp);
  const phClip = G(phWrap, { 'clip-path': 'url(#trayPhClip)' });
  const phoebe = cast(phClip, 'phoebe', { mood: 'sad' });
  const percy = cast(Lcast, 'percy');
  const tableW = G(Lcast); mgTable(tableW, 1150);
  const trayW = G(Lcast); const tray = mgTray(trayW);
  // highlight rings on the tray (tray coordinates)
  const ring = (cx, cy, rx, ry, col) => E('ellipse', { cx, cy, rx, ry, fill: 'none', stroke: col, 'stroke-width': 6, 'stroke-dasharray': '14 9' }, tray);
  const rRice = ring(-76, -12, 96, 62, C.glucose), rChick = ring(82, -2, 84, 50, '#FF9FB0'), rCuke = ring(0, 54, 80, 26, C.good);
  const fatStars = [[-110, -38], [-56, -40], [-84, -22]].map(([x, y]) => { const s = G(tray); tr(s, x, y); E('path', { d: 'M0,-14 L4,-4 L14,0 L4,4 L0,14 L-4,4 L-14,0 L-4,-4 Z', fill: '#FFF7C2', stroke: '#FFB000', 'stroke-width': 2 }, s); return s; });
  const giantCuke = G(Lcast);
  E('ellipse', { rx: 120, ry: 58, fill: '#4E9A3A', stroke: '#2E6B24', 'stroke-width': 6 }, giantCuke);
  E('ellipse', { rx: 98, ry: 44, fill: '#D8F0B8' }, giantCuke);
  E('path', { d: 'M-30,0 l10,0 M20,-12 l10,0 M0,14 l10,0 M-50,-14 l8,0 M44,10 l8,0', stroke: '#9BC97A', 'stroke-width': 6, 'stroke-linecap': 'round' }, giantCuke);
  const kArm = trayArm(Lprop, {});

  /* ================= platform props ================= */
  const LANE = [330, 460, 590, 720, 850, 980, 1110];
  const NUT = ['**C**arbohydrates', '**P**roteins', '**F**ats', '**V**itamins', '**M**inerals', '**F**ibre', '**W**ater'];
  const ROWY = [616, 664];
  const paxBack = G(Lprop);
  const gates = trayGates(Lprop, LANE);
  const paxFront = G(Lprop);
  const pax = NUT.map(n => trayChip(paxBack, n, { size: 26, fill: '#F2F7FA', stroke: MG_NAVY, color: MG_NAVY, bold: '#E08A00' }));
  const micMain = mgMic(Lprop, 0.75);
  // the mnemonic card
  const mnem = G(Lprop);
  const WORDS = ['Crazy', 'People', 'Find', 'Very', 'Many', 'Fish', 'Wet'];
  const wsp = textWidth(' ', 44, FD, 700), wws = WORDS.map(w => textWidth(w, 44, FD, 700));
  const totW = wws.reduce((a, b) => a + b, 0) + wsp * 6;
  E('rect', { x: -totW / 2 - 34, y: -44, width: totW + 68, height: 88, rx: 16, fill: 'rgba(10,27,39,0.92)', stroke: '#FFB000', 'stroke-width': 4 }, mnem);
  let wx = -totW / 2;
  const wordT = WORDS.map((w, i) => { const t = T(mnem, wx, 15, `**${w[0]}**${w.slice(1)}`, { size: 44, weight: 700, fill: C.ink, boldFill: C.energy }); const cx = wx + wws[i] / 2; wx += wws[i] + wsp; t.cx = cx; return t; });
  const MNEM = [700, 330];
  const fishX = MNEM[0] + wordT[5].cx;
  const cTrick = trayChip(Lui, 'memory trick', { size: 28, color: '#7FD6F7', stroke: '#7FD6F7' });
  const cBalanced = trayChip(Lui, '**balanced diet** = all 7 groups, in the **right amounts**', { size: 30 });
  // the balance scale
  const scale = trayScale(Lprop);
  const cNotBad = trayChip(Lui, 'fat is **NOT** bad', { size: 38, color: C.ink, stroke: C.good, bold: C.good });
  const lIn = trayChip(Lui, 'energy in', { size: 28, color: C.glucoseLt, stroke: C.glucose });
  const lUsed = trayChip(Lui, 'energy used', { size: 28, color: C.good, stroke: C.good });
  const cProblem = trayChip(Lui, 'far more in than used = **the problem**', { size: 30, fill: 'rgba(90,20,30,0.92)', stroke: C.bad, bold: '#FF9AA6' });
  // the SERVICE DISRUPTION board
  const board = mgBoard(Lprop, 660, 190);
  const BOARD = [790, 368];
  const disIcons = { scurvy: icon.orange(Lprop), rickets: icon.bone(Lprop), anaemia: icon.rbc(Lprop) };
  const disX = cross(disIcons.scurvy, 30);
  const germ = G(Lprop); icon.germ(germ); const germX = cross(germ, 70);
  const cLack = trayChip(Lui, 'caused by a **LACK**, not a germ', { size: 32 });
  const cCatch = trayChip(Lui, "you can't catch it", { size: 32, color: '#FF9AA6', stroke: C.bad });

  /* ================= table / close-up UI ================= */
  const fishNo = G(Lui); icon.fish(fishNo); tr(fishNo.firstChild, 0, 0); const fishNoX = cross(fishNo, 34);
  const cNoFish = trayChip(Lui, 'fish: 0', { size: 30, color: '#FF9AA6', stroke: C.bad });
  const cdRice = trayCard(Lui, 'carbohydrates', 'main energy source', { col: C.glucose, ts: 38, ss: 30 });
  const cdChick = trayCard(Lui, 'protein', 'growth and repair', { col: '#FF9FB0', ts: 38, ss: 30 });
  const cFats = trayChip(Lui, '**fats**: chicken fat on the rice', { size: 32, bold: C.glucoseLt });
  const fatCards = [['store of energy', 'battery'], ['keeps you warm', 'scarf'], ['protects organs', 'shield']].map(([s, k]) => {
    const c = trayCard(Lui, s, '', { ts: 28, ih: 76, w: 236, col: C.glucoseLt }); icon[k](c.icon); return c; });
  const cFatQ = trayChip(Lui, 'fat = bad?', { size: 34, color: '#FF9AA6', stroke: C.bad });
  const cdVit = trayCard(Lui, 'vitamins', 'e.g. vitamin C, D', { col: C.good, ts: 38, ss: 28 });
  const cdMin = trayCard(Lui, 'minerals', 'e.g. calcium, iron', { col: '#7FD6F7', ts: 38, ss: 28 });
  const cTiny = trayChip(Lui, 'needed in **tiny amounts**', { size: 30, bold: C.good });
  const cdFibre = trayCard(Lui, 'fibre', 'not digested', { col: '#9BE36A', ts: 44, ss: 30, ih: 70 }); icon.celery(cdFibre.icon);
  const cGoes = trayChip(Lui, 'goes all the way through →', { size: 28, color: '#C2EDA2', stroke: '#6CC24A' });
  const ltPhoebe = scLowerThird(Lhud, ...MG_NAME.phoebe);
  // energy needs
  const cNeeds = trayChip(Lui, 'energy needs **vary**', { size: 40, stroke: C.energy });
  const NEEDS = [['age', 'cake', 215, 255], ['how active', 'shoe', 205, 470], ['size', 'ruler', 990, 255], ['sex', 'sex', 1000, 435], ['pregnancy', 'pram', 975, 600]];
  const needCards = NEEDS.map(([s, k]) => { const c = trayCard(Lui, s, '', { ts: 30, ih: 70, w: 210, col: C.energy }); icon[k](c.icon); return c; });
  const bubble = trayBubble(Lui, 'Uncle! UPSIZE?', 380, 104, [60, 170, 118]);
  const cNoSingle = trayChip(Lui, 'no single food has everything', { size: 32 });
  const cVariety = trayChip(Lui, 'VARIETY', { size: 60, fill: C.good, stroke: '#FFFFFF', color: '#0B2A1A', sw: 5 });

  /* ================= confessional props ================= */
  const bowl = trayBowl(Lprop);
  const cWater = trayCard(Lui, 'water', 'the solvent for your reactions', { col: C.water, ts: 44, ss: 28 });
  const twoCards = [['water', 'drop', C.water], ['fibre', 'celery', '#9BE36A']].map(([n, k, col]) => {
    const g = G(Lui);
    E('rect', { x: -125, y: -150, width: 250, height: 300, rx: 20, fill: 'rgba(10,27,39,0.92)', stroke: col, 'stroke-width': 4 }, g);
    const ic = icon[k](g); tr(ic, 0, -92);
    T(g, 0, -20, n, { size: 44, weight: 800, anchor: 'middle', fill: col });
    g.r1 = G(g); T(g.r1, -18, 50, 'no energy', { size: 28, weight: 700, anchor: 'middle' }); tr(cross(g.r1, 13), 88, 41);
    g.r2 = G(g); T(g.r2, -18, 112, 'essential', { size: 28, weight: 700, anchor: 'middle' }); tr(tick(g.r2, 16), 88, 102);
    return g;
  });

  /* ================= HUD ================= */
  const pa = trayPA(Lhud);
  const PA_XY = [1075, 205];

  /* ================= cut list: [start, shot, setup] ================= */
  const CUTS = [
    [-1, 'plat', 'gates'],
    [at('fish') - 0.06, 'table', 'fish'],
    [at('keepup') - 0.06, 'plat', 'keepup'],
    [end('keepup') + 0.12, 'table', 'annoyed'],
    [at('rice') - 0.06, 'close', 'rice'],
    [at('fatbad') - 0.06, 'table', 'fatbad'],
    [at('notbad') - 0.06, 'plat', 'scale'],
    [at('cucumber') - 0.06, 'close', 'cucumber'],
    [at('phoebe') - 0.06, 'table', 'phoebe'],
    [at('thpercy') - 0.06, 'conf', 'water'],
    [at('missing') - 0.06, 'plat', 'board'],
    [at('germ') - 0.06, 'plat', 'germ'],
    [at('energy') - 0.06, 'kavc', 'energy'],
    [at('variety') - 0.06, 'table', 'variety'],
  ];
  const cutAt = t => { let c = CUTS[0]; for (const k of CUTS) if (t >= k[0]) c = k; return c; };
  const CLOSE = { k: 1.2, cx: 1120, cy: 720 }, FLAT = { k: 1, cx: 600, cy: 375 };
  // world positions in the table shots
  const KAV_T = [230, 432, 1.4], PH_T = [760, 522], TABLE_T = [660, 625], TRAY_T = [720, 570, 1.5];
  const uiAll = [cTrick, cBalanced, cNotBad, lIn, lUsed, cProblem, cLack, cCatch, fishNo, cNoFish,
    cdRice, cdChick, cFats, cFatQ, cdVit, cdMin, cTiny, cdFibre, cGoes, cNeeds, bubble, cNoSingle, cVariety, cWater, ...fatCards, ...needCards, ...twoCards];

  return t => {
    const [c0, shot, setup] = cutAt(t);
    op(platShot, shot === 'plat' ? 1 : 0);
    op(tabShot, shot === 'table' || shot === 'close' || shot === 'kavc' ? 1 : 0);
    confShot.set(shot === 'conf' ? 1 : 0, t);
    uiAll.forEach(e => op(e, 0));
    [paxBack, paxFront, gates, micMain, mnem, scale, board, germ, bowl, kArm, giantCuke].forEach(e => op(e, 0));
    Object.values(disIcons).forEach(e => op(e, 0));
    [rRice, rChick, rCuke, ...fatStars].forEach(e => op(e, 0));
    let kavOn = 0, phOn = 0, percyOn = 0, paOn = 0, tabOn = 0;
    let cam = FLAT;

    /* =============== PLATFORM =============== */
    if (shot === 'plat') {
      percyOn = 1;
      if (percy.parentNode !== Lcast) Lcast.insertBefore(percy, tableW);
      const talk = scTalk(S, t, 'percy');
      if (setup === 'gates' || setup === 'keepup') {
        const PX = [135, 470, 1];
        tr(percy, PX[0], PX[1], PX[2]);
        const kp = setup === 'keepup';
        percy.set({ t, talk, mood: kp ? 'deadpan' : 'neutral', look: kp ? 0 : 0.5 });
        op(micMain, 1); tr(micMain, PX[0] + 64, PX[1] + 24, 0.75, -14);
        // gates pop in on "seven nutrient groups"
        const gp = P(t, mid('balanced', 0.45), 0.4, pop);
        op(gates, clamp(gp * 2.5)); op(paxBack, 1); op(paxFront, 1);
        const balP = trayPin(cBalanced, t, mid('balanced', 0.32), at('crazy') - 0.05, 700, 330);
        // the mnemonic, word by word, then the passengers tap in one by one
        const mp = P(t, at('crazy') - 0.05, 0.3, linear);
        op(mnem, mp); tr(mnem, MNEM[0], MNEM[1]);
        wordT.forEach((w, i) => op(w, kp ? 1 : P(t, mid('crazy', 0.02 + i * 0.062), 0.18, linear)));
        NUT.forEach((n, i) => {
          const t0 = kp ? -10 : mid('crazy', 0.45 + i * 0.072);
          const p = clamp((t - t0) / 0.75), y0 = 425, y1 = ROWY[i % 2];
          const y = p < 0.5 ? lerp(y0, 515, ease(p * 2)) : lerp(515, y1, ease((p - 0.5) * 2));
          const c = pax[i];
          const want = y > 505 ? paxFront : paxBack;
          if (c.parentNode !== want) want.appendChild(c);
          op(c, t < t0 ? 0 : clamp((t - t0) / 0.15));
          tr(c, LANE[i], y, lerp(0.6, 1, ease(p)));
          gates.lane(i, p > 0.2 && p < 0.85 ? 1 : 0);
        });
        if (kp) {
          trayPin(fishNo, t, mid('keepup', 0.25), 1e9, fishX, 412 + 4 * Math.sin(t * 5 * AMP), 0.9, 6 * Math.sin(t * 4 * AMP)); op(fishNoX, 0);
          trayPin(cTrick, t, mid('keepup', 0.35), 1e9, fishX - 175, 412);
          cam = { k: 1 + 0.08 * P(t, end('keepup') - 0.6, 1.2, linear), cx: 135, cy: 440 };
        }
      }
      if (setup === 'scale') {
        tr(percy, 220, 470, 1.15);
        percy.set({ t, talk, mood: 'deadpan', look: t > mid('notbad', 0.3) ? 0.6 : 0 });
        trayPin(cNotBad, t, at('notbad') + 0.05, 1e9, 800, 300);
        const sp = P(t, mid('notbad', 0.22), 0.4, pop);
        op(scale, clamp(sp * 2.5));
        const tip = P(t, mid('notbad', 0.45), 0.9, ease);
        const wob = Math.sin((t - mid('notbad', 0.45)) * 9) * 2.5 * (1 - P(t, mid('notbad', 0.45) + 0.9, 0.8, linear)) * (tip > 0 ? 1 : 0) * AMP;
        scale.set(-20 * tip + wob, 1 + 3 * P(t, mid('notbad', 0.35), 0.9, linear));
        tr(scale, 800, 400, Math.max(0.01, 0.8 + 0.2 * sp));
        trayPin(lIn, t, mid('notbad', 0.3), 1e9, 600, 600);
        trayPin(lUsed, t, mid('notbad', 0.3), 1e9, 1000, 600);
        trayPin(cProblem, t, mid('notbad', 0.72), 1e9, 790, 658);
        cam = { k: 1 + 0.05 * P(t, end('notbad'), 0.8, linear), cx: 220, cy: 430 };
      }
      if (setup === 'board') {
        const PX = [210, 470, 1.15];
        tr(percy, PX[0], PX[1], PX[2]);
        op(micMain, 1); tr(micMain, PX[0] + 64 * 1.15, PX[1] + 26, 0.85, -14);
        const ph = t >= at('constip') - 0.06;
        percy.set({ t, talk, mood: ph && t > end('constip') ? 'deadpan' : 'neutral', look: ph ? 1 : 0.55 });
        // the board flips on, then flips to each new disruption
        const keys = ['missing', 'scurvy', 'rickets', 'anaemia', 'constip'];
        let ki = 0; keys.forEach((k, i) => { if (t >= at(k) - 0.06) ki = i; });
        const MSG = [['DEFICIENCY DISEASE', 'a nutrient missing for a long time'], ['NO VITAMIN C', 'SCURVY: bleeding gums, slow healing'],
          ['NO VITAMIN D OR CALCIUM', 'RICKETS: soft, bent bones'], ['NO IRON', 'ANAEMIA: too few red blood cells'], ['NO FIBRE', 'CONSTIPATION']];
        board.msg(...MSG[ki]);
        const t0 = ki === 0 ? mid('missing', 0.12) : at(keys[ki]) - 0.06;
        const flip = P(t, t0, 0.28, easeOut);
        op(board, ki === 0 ? clamp(flip * 3) : 1);
        board.setAttribute('transform', `translate(${BOARD[0]} ${BOARD[1]}) scale(1 ${Math.max(0.02, flip).toFixed(3)})`);
        const dk = keys[ki];
        if (disIcons[dk]) {
          const ip = P(t, mid(dk, 0.35), 0.4, pop);
          op(disIcons[dk], clamp(ip * 2.5)); tr(disIcons[dk], 790, 556, Math.max(0.01, 1.3 * (0.6 + 0.4 * ip)));
          if (dk === 'anaemia') { const ws = 0.75 + 0.1 * Math.sin(t * 2); tr(disIcons[dk], 790, 556, Math.max(0.01, 1.3 * ip * ws)); }
        }
        if (ph) {
          phOn = 1;
          if (phoebe.parentNode !== Lprop) Lprop.appendChild(phoebe);
          const pp = P(t, at('constip') - 0.06, 0.45, pop);
          tr(phoebe, 1060, lerp(760, 568, pp), 0.9);
          phoebe.set({ t, talk: scTalk(S, t, 'phoebe'), mood: 'sad', look: t > end('constip') ? -0.7 : 0 });
          cam = { k: 1 + 0.07 * P(t, end('constip'), 0.9, linear), cx: 1060, cy: 470 };
        }
      }
      if (setup === 'germ') {
        tr(percy, 215, 470, 1.15);
        percy.set({ t, talk, mood: 'deadpan', look: t < mid('germ', 0.55) ? 0.6 : 0 });
        const gp = P(t, at('germ') + 0.1, 0.45, pop);
        op(germ, clamp(gp * 2.5)); tr(germ, 800, 340, Math.max(0.01, (0.7 + 0.3 * gp)), 6 * Math.sin(t * 3 * AMP));
        op(germX, P(t, mid('germ', 0.22), 0.2, linear));
        trayPin(cLack, t, mid('germ', 0.12), 1e9, 790, 500);
        trayPin(cCatch, t, mid('germ', 0.48), 1e9, 790, 572);
        cam = { k: 1 + 0.09 * P(t, mid('germ', 0.8), end('germ') + 0.6 - mid('germ', 0.8), linear), cx: 215, cy: 420 };
      }
      setText(plat.led, setup === 'board' ? '' : setup === 'germ' ? 'NOTICE: NOT CATCHING' : 'PASSENGER CHECK IN PROGRESS');
    }
    if (!(shot === 'plat' && setup === 'board') && phoebe.parentNode !== phClip) phClip.appendChild(phoebe);

    /* =============== HAWKER TABLE (wide), TRAY CLOSE-UP, KAVYA CENTRED =============== */
    if (shot === 'table' || shot === 'close' || shot === 'kavc') {
      kavOn = shot === 'close' ? 0 : 1; tabOn = 1;
      hawker.upd(t);
      const kc = shot === 'kavc';
      if (kc) { tr(kav, 600, 470, 1.5); tr(tableW, 600, 718, 0.9); tr(trayW, 640, 680, 0.95); }
      else { tr(kav, KAV_T[0], KAV_T[1], KAV_T[2]); tr(tableW, TABLE_T[0], TABLE_T[1]); tr(trayW, TRAY_T[0], TRAY_T[1], TRAY_T[2]); }
      if (shot === 'close') cam = CLOSE;
      const kTalk = scTalk(S, t, 'kavya');
      let kMood = 'neutral', kLook = 0.6;
      // Phoebe, behind the plate
      tr(phWrap, PH_T[0], PH_T[1]);
      let phRise = 0;
      if (setup === 'cucumber') phRise = P(t, mid('cucumber', 0.82), 0.5, pop);
      if (setup === 'phoebe') phRise = 1;
      if (!kc && phRise > 0) {
        phOn = 1;
        tr(phoebe, 0, lerp(340, -112, phRise));
        phoebe.set({ t, talk: scTalk(S, t, 'phoebe'), mood: setup === 'cucumber' ? 'neutral' : 'sad', look: setup === 'phoebe' && t > end('phoebe') ? -0.8 : setup === 'variety' ? 0.6 : 0 });
      }
      if (setup === 'fish') {
        kMood = 'deadpan'; kLook = 0;
        op(kArm, 1); kArm.point(true); tr(kArm, KAV_T[0] + 92, KAV_T[1] + 118, 1, -6);
        trayPin(fishNo, t, mid('fish', 0.35), 1e9, 730, 320, 1.6);
        op(fishNoX, P(t, mid('fish', 0.55), 0.2, linear));
        trayPin(cNoFish, t, mid('fish', 0.55), 1e9, 730, 410);
        cam = { k: 1 + 0.05 * P(t, end('fish') - 0.2, 0.8, linear), cx: 230, cy: 400 };
      }
      if (setup === 'annoyed') { kMood = 'annoyed'; kLook = 0; cam = { k: 1.06, cx: 230, cy: 400 }; }
      if (setup === 'rice') {
        paOn = 1;
        const ricePh = t < mid('rice', 0.5);
        op(rRice, ricePh ? 0.6 + 0.4 * Math.sin(t * 6) : 0.25);
        if (!ricePh) op(rChick, 0.6 + 0.4 * Math.sin(t * 6));
        trayPin(cdRice, t, mid('rice', 0.08), at('fat') - 0.06, 340, 230);
        trayPin(cdChick, t, mid('rice', 0.55), at('fat') - 0.06, 760, 230);
        if (t >= at('fat') - 0.06) {
          // the fat shine sparkles, then the three jobs of fat
          [rRice, rChick].forEach(e => op(e, 0));
          fatStars.forEach((s, i) => { op(s, 0.5 + 0.5 * Math.sin(t * 7 + i * 2)); tr(s, [-110, -56, -84][i], [-38, -40, -22][i], 0.8 + 0.4 * Math.abs(Math.sin(t * 4 + i)), t * 60 * AMP); });
          trayPin(cFats, t, at('fat') + 0.05, 1e9, 520, 140);
          fatCards.forEach((c, i) => trayPin(c, t, mid('fat', 0.42 + i * 0.18), 1e9, 250 + i * 262, 285));
        }
        kMood = 'happy'; kLook = 0.4;
      }
      if (setup === 'fatbad') {
        paOn = 1;
        kMood = t < end('fatbad') ? 'annoyed' : 'deadpan'; kLook = 0;
        trayPin(cFatQ, t, mid('fatbad', 0.3), 1e9, 470, 250, 1, -4);
        cam = { k: 1 + 0.06 * P(t, at('fatbad'), 2.5, linear), cx: 230, cy: 420 };
      }
      if (setup === 'cucumber') {
        paOn = 1;
        op(rCuke, t < mid('cucumber', 0.8) ? 0.6 + 0.4 * Math.sin(t * 6) : 0);
        trayPin(cdVit, t, mid('cucumber', 0.12), mid('cucumber', 0.8), 330, 245);
        trayPin(cdMin, t, mid('cucumber', 0.24), mid('cucumber', 0.8), 690, 245);
        trayPin(cTiny, t, mid('cucumber', 0.45), mid('cucumber', 0.8), 510, 370);
        const wob = t > mid('cucumber', 0.76) && t < mid('cucumber', 0.76) + 0.6 ? Math.sin((t - mid('cucumber', 0.76)) * 30) * 6 * AMP : 0;
        tray.parts.cucumber.setAttribute('transform', `rotate(${wob.toFixed(2)} 0 54)`);
        kMood = t > mid('cucumber', 0.85) ? 'shock' : 'neutral';
      } else tray.parts.cucumber.removeAttribute('transform');
      if (setup === 'phoebe') {
        paOn = 1;
        kMood = t < end('phoebe') ? 'shock' : 'deadpan'; kLook = 1;
        trayPin(cdFibre, t, mid('phoebe', 0.38), 1e9, 990, 425);
        trayPin(cGoes, t, mid('phoebe', 0.72), 1e9, 640, 160);
        cam = { k: 1 + 0.08 * P(t, end('phoebe') - 0.1, 0.9, linear), cx: 760, cy: 400 };
      }
      if (shot === 'kavc') {
        const up = t >= at('upsize') - 0.06;
        if (!up) {
          kMood = 'neutral'; kLook = 0;
          trayPin(cNeeds, t, at('energy') + 0.05, 1e9, 600, 150);
          const W = ['age', 'active', 'size', 'sex', 'pregnancy'];
          needCards.forEach((c, i) => trayPin(c, t, mid('energy', [0.12, 0.3, 0.52, 0.66, 0.8][i]), 1e9, NEEDS[i][2], NEEDS[i][3]));
        } else {
          kMood = t < mid('upsize', 0.45) ? 'smug' : 'happy'; kLook = t > mid('upsize', 0.45) ? -1 : 0;
          op(kArm, 1); kArm.point(false);
          const wv = t > mid('upsize', 0.45) ? Math.sin((t - mid('upsize', 0.45)) * 12) * 14 * AMP : 0;
          tr(kArm, 512, 566, 1.1, -128 + wv);
          trayPin(bubble, t, mid('upsize', 0.5), 1e9, 290, 300, 1, -3);
        }
      }
      if (setup === 'variety') {
        paOn = 1;
        // the giant upsized cucumber slice slides onto the tray
        const sp = P(t, mid('variety', 0.12), 0.7, easeOut);
        op(giantCuke, 1);
        tr(giantCuke, lerp(1400, 860, sp), lerp(420, 548, sp) - 30 * Math.sin(sp * Math.PI), 1, lerp(30, -6, sp));
        trayPin(cNoSingle, t, mid('variety', 0.5), 1e9, 660, 160);
        trayPin(cVariety, t, mid('variety', 0.76), 1e9, 660, 248, 1, -3);
        kMood = t < mid('variety', 0.3) ? 'shock' : 'deadpan'; kLook = t < mid('variety', 0.5) ? 1 : 0;
        cam = { k: 1 + 0.05 * P(t, end('variety') - 0.2, 1, linear), cx: 600, cy: 420 };
      }
      kav.set({ t, talk: kTalk, mood: kMood, look: kLook });
      // Percy on the PA inset
      if (paOn) {
        percyOn = 1;
        if (percy.parentNode !== pa.inner) pa.inner.appendChild(percy);
        tr(percy, 0, 52, 0.7);
        let pLook = 0, pMood = 'deadpan';
        if (setup === 'rice') pMood = 'neutral';
        if (setup === 'phoebe') pLook = -1;
        if (setup === 'cucumber' && t > mid('cucumber', 0.85)) pLook = -0.8;
        percy.set({ t, talk: scTalk(S, t, 'percy'), mood: pMood, look: pLook });
      }
    }
    op(pa, paOn); if (paOn) tr(pa, PA_XY[0], PA_XY[1]);
    ltPhoebe.set(setup === 'phoebe' ? win(t, at('phoebe') + 0.05, at('phoebe') + 3.1, 0.3) : 0);

    /* =============== PERCY'S CONFESSIONAL =============== */
    if (shot === 'conf') {
      percyOn = 1;
      if (percy.parentNode !== Lcast) Lcast.insertBefore(percy, tableW);
      tr(percy, 430, 410, 1.5);
      percy.set({ t, talk: scTalk(S, t, 'percy'), mood: t > end('thpercy') ? 'deadpan' : 'neutral', look: 0 });
      const two = t >= mid('thpercy', 0.48);
      const bp = P(t, at('thpercy') + 0.05, 0.42, pop);
      op(bowl, two ? 0 : clamp(bp * 2.5)); tr(bowl, 880, 230, Math.max(0.01, 1.5 * (0.7 + 0.3 * bp))); bowl.steam.upd(t);
      trayPin(cWater, t, mid('thpercy', 0.14), mid('thpercy', 0.48), 880, 420);
      twoCards.forEach((c, i) => {
        trayPin(c, t, mid('thpercy', 0.48) + i * 0.15, 1e9, 760 + i * 270, 330);
        op(c.r1, P(t, mid('thpercy', 0.6), 0.25, linear)); op(c.r2, P(t, mid('thpercy', 0.84), 0.25, linear));
      });
      cam = { k: 1 + 0.08 * P(t, end('thpercy') - 0.1, 0.8, linear), cx: 430, cy: 380 };
    }

    [Lbg, Lcast, Lprop].forEach(l => trayCam(l, cam));
    op(kav, kavOn); op(phoebe, phOn); op(percy, percyOn);
    op(tableW, tabOn); op(trayW, tabOn);
  };
});
