/* Scene 4: Frieda is not the villain (friction, lubrication, drag, streamlining).
   Beats: Mum mops, Kavya in socks -> "No, no, no..." she slides across into the boxes -> FORCE-CAM: Frieda
   tiny under the wet sock -> Frieda's confessional: always AGAINST the motion -> but useful: walking, tyres,
   brakes, or everyone slides into walls -> zoom x1000: smooth surfaces are bumpy, the bumps catch
   -> the trolley wheel squeaks: heat, wear -> Rex oils it (lubricant) -> "Objection, Rex." -> "Objection
   overruled." (gavel) -> rubber soles and treads: more friction -> outside, Frieda in a windbreaker: drag
   -> Kavya's scooter: faster = more drag -> brick vs streamlined teardrop -> the lorry: a box. */
scene('slide', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;
  const talk = (t, who) => scTalk(S, t, who);

  /* ---------- local helpers (prefixed slide) ---------- */
  const slideCam = (el, cx, cy, k, px, py) => el.setAttribute('transform', `translate(${(px ?? cx).toFixed(1)} ${(py ?? cy).toFixed(1)}) scale(${k.toFixed(4)}) translate(${(-cx).toFixed(1)} ${(-cy).toFixed(1)})`);
  const slidePop = (el, x, y, p, s, r) => { op(el, clamp(p * 2.5)); tr(el, x, y, Math.max(0.01, (s || 1) * (0.6 + 0.4 * p)), r); };
  const slidePill = (parent, text, o) => { o = o || {}; return chip(parent, text, { size: o.size || 32, fill: o.fill || 'rgba(10,27,39,0.9)', stroke: o.stroke || C.line, sw: o.sw || 2.5, color: o.color || C.ink, weight: o.weight || 700 }); };
  function slideTxt(parent, x, y, str, o) {
    const t = T(parent, x, y, str, o);
    t.setAttribute('stroke', o.halo || '#0A1B27'); t.setAttribute('stroke-width', o.hw || 6); t.setAttribute('paint-order', 'stroke'); t.setAttribute('stroke-linejoin', 'round');
    return t;
  }
  function slideStamp(parent, text, o) {
    o = o || {};
    const size = o.size || 44, col = o.color || C.bad, g = G(parent);
    const w = textWidth(text, size, FD, 800) + size * 1.2, h = size * 1.6;
    E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: 10, fill: o.fill || 'rgba(24,8,12,0.9)', stroke: col, 'stroke-width': 6 }, g);
    T(g, 0, size * 0.36, text, { size, weight: 800, anchor: 'middle', fill: col, ls: 2 });
    g.set = (p, x, y, rot) => { op(g, clamp(p * 4)); tr(g, x, y, lerp(1.8, 1, easeOut(clamp(p))), rot); };
    return g;
  }
  function slideFcam(parent) {
    const g = G(parent);
    E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#19E68C', opacity: 0.1 }, g);
    let scan = ''; for (let y = 3; y < 750; y += 7) scan += `M0,${y} L1200,${y} `;
    E('path', { d: scan, stroke: '#0A2A1A', 'stroke-width': 2, opacity: 0.18 }, g);
    E('path', { d: 'M40,150 L40,40 L150,40 M1050,40 L1160,40 L1160,150 M1160,600 L1160,710 L1050,710 M150,710 L40,710 L40,600', fill: 'none', stroke: '#7CFFC0', 'stroke-width': 5 }, g);
    E('rect', { x: 900, y: 58, width: 250, height: 56, rx: 12, fill: 'rgba(6,24,16,0.85)' }, g);
    const dot = E('circle', { cx: 926, cy: 86, r: 10, fill: '#FF3B3B' }, g);
    T(g, 946, 98, 'FORCE-CAM', { size: 34, weight: 800, fill: '#7CFFC0' });
    g.set = (v, t) => { op(g, v); op(dot, Math.sin(t * TAU * 0.8) > 0 ? 1 : 0.2); };
    return g;
  }
  // Kavya's full body with a choice of footwear (white socks, or black school shoes)
  function slideKavya(parent, shoes) {
    const p = person(parent, { skin: '#B9784E', shirt: '#2E7DD8', shorts: '#1E2A44', hair: '#1E1410', shoes });
    const body = p.firstChild;
    E('path', { d: 'M-14,-186 Q-38,-182 -40,-158 Q-30,-168 -16,-172 Z', fill: '#1E1410' }, body);
    E('circle', { cx: -15, cy: -180, r: 4, fill: '#FF5FA2' }, body);
    return p;
  }
  // Frieda's outdoor kit (windbreaker and goggles), drawn in her own coordinates: put it in the same transform
  function slideJacket(parent) {
    const g = G(parent);
    E('path', { d: 'M-98,-8 L-62,-10 L-26,46 L26,46 L62,-10 L98,-8 L98,70 Q98,78 90,78 L-90,78 Q-98,78 -98,70 Z', fill: '#3F8FD8', stroke: SC_INK, 'stroke-width': 5, 'stroke-linejoin': 'round' }, g);
    E('path', { d: 'M0,46 L0,78 M-98,30 L-60,30 M98,30 L60,30', stroke: '#1F5E9C', 'stroke-width': 4 }, g);
    E('path', { d: 'M-92,-72 L92,-72', stroke: '#2B2B2B', 'stroke-width': 8 }, g);
    [-30, 30].forEach(x => { E('circle', { cx: x, cy: -72, r: 19, fill: '#9FE3FF', stroke: SC_INK, 'stroke-width': 5 }, g); E('circle', { cx: x - 6, cy: -78, r: 5, fill: '#FFFFFF', opacity: 0.8 }, g); });
    return g;
  }

  // a light expressway (sky, skyline, trees, road) that scrolls seamlessly: g.upd(t, speed px/s)
  function slideRoad(parent) {
    const g = G(parent);
    E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#58BDF5', '#C6ECFF', true) }, g);
    const sunG = G(g); tr(sunG, 1060, 110);
    E('circle', { r: 120, fill: glow('#FFE45C') }, sunG); E('circle', { r: 50, fill: '#FFE45C' }, sunG);
    const sky = G(g); let bd = '', wd = '';
    for (let x = -220; x < 1440; x += 110) {   // pattern repeats every 220 px
      const k = Math.round(x / 110) % 2 === 0, top = k ? 260 : 300, w = k ? 92 : 84;
      bd += `M${x},${top} L${x + w},${top} L${x + w},420 L${x},420 Z `;
      for (let y = top + 12; y < 412; y += 18) wd += `M${x + 6},${y} L${x + w - 6},${y} `;
    }
    E('path', { d: bd, fill: '#E7DFCD', stroke: '#ADA28A', 'stroke-width': 2 }, sky);
    E('path', { d: wd, stroke: '#9DB7C6', 'stroke-width': 4 }, sky);
    const trees = G(g); let td = '', cd = '';
    for (let x = -200; x < 1500; x += 100) {   // pattern repeats every 200 px
      const r = Math.round(x / 100) % 2 === 0 ? 40 : 32;
      td += `M${x - 5},420 L${x + 5},420 L${x + 5},452 L${x - 5},452 Z `;
      cd += `M${x - r},${412 - r * 0.4} a${r},${r} 0 1,0 ${2 * r},0 a${r},${r} 0 1,0 ${-2 * r},0 `;
    }
    E('path', { d: td, fill: '#6B4A33' }, trees);
    E('path', { d: cd, fill: ball('#4CB866', '#23763A') }, trees);
    E('rect', { x: 0, y: 440, width: 1200, height: 22, fill: '#9AA5AE' }, g);
    E('rect', { x: 0, y: 456, width: 1200, height: 294, fill: linGrad('#4B525A', '#33383E', true) }, g);
    E('path', { d: 'M0,480 L1200,480 M0,730 L1200,730', stroke: '#F2F2F2', 'stroke-width': 5 }, g);
    const dash = E('path', { d: '', stroke: '#FFFFFF', 'stroke-width': 7 }, g);
    g.upd = (t, d) => {   // d: distance travelled (px)
      const w = (x, m) => ((x % m) + m) % m;
      tr(sky, -w(d * 0.08, 220), 0); tr(trees, -w(d * 0.5, 200), 0);
      const off = w(d, 160); let p = '';
      for (let x = -off; x < 1260; x += 160) p += `M${x.toFixed(0)},606 L${(x + 80).toFixed(0)},606 `;
      attr(dash, 'd', p);
    };
    g.upd(0, 0);
    return g;
  }
  // a little stick figure (for the "slide into walls" cartoon)
  function slideStick(parent, col) {
    const g = G(parent);
    E('path', { d: 'M0,-60 L0,-20 M0,-20 L-14,0 M0,-20 L14,0 M0,-48 L28,-58 M0,-48 L24,-36', fill: 'none', stroke: col, 'stroke-width': 7, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    E('circle', { cx: 4, cy: -72, r: 11, fill: col }, g);
    return g;
  }
  // put an element drawn outside the camera group where the camera would show (x, y) at scale s
  const slideCP = (el, cx, cy, k, x, y, s) => tr(el, cx + (x - cx) * k, cy + (y - cy) * k, s * k);

  const Lbg = G(root), Lmid = G(root), Lcast = G(root), Lfront = G(root), Lfg = G(root), Lhud = G(root);

  /* ================= the shot list (hard cuts) ================= */
  const SH = [
    ['mop', -1e9], ['whoa', at('whoa') - 0.06], ['wet', at('wet') - 0.06], ['conf', at('thfrieda') - 0.06],
    ['bumps', at('bumps') - 0.06], ['wheel', at('squeak') - 0.06], ['gavel', at('overruled') - 0.06],
    ['grip', at('grip') - 0.06], ['drag', at('drag') - 0.06], ['stream', at('stream') - 0.06], ['lorry', at('lorry') - 0.06],
  ];
  const shotAt = t => { let k = 0; for (let i = 0; i < SH.length; i++) if (t >= SH[i][1]) k = i; return SH[k][0]; };

  /* ================= the old flat ================= */
  const flatShot = G(Lbg), flatWrap = G(flatShot);
  const flat = ppFlat(flatWrap);
  // the wet sheen on the floor
  const sheen = G(flatWrap);
  E('rect', { x: 0, y: 522, width: 1200, height: 228, fill: '#BFE6FF', opacity: 0.28 }, sheen);
  [[300, 600, 220], [700, 650, 300], [980, 590, 160], [520, 710, 200]].forEach(([x, y, w]) => E('ellipse', { cx: x, cy: y, rx: w / 2, ry: 9, fill: '#FFFFFF', opacity: 0.55 }, sheen));
  const wetSign = G(flatWrap); tr(wetSign, 820, 700);
  E('path', { d: 'M-50,0 L-18,-150 L18,-150 L50,0 Z', fill: '#FFD23F', stroke: SC_INK, 'stroke-width': 5, 'stroke-linejoin': 'round' }, wetSign);
  E('path', { d: 'M0,-120 L-14,-94 L14,-94 Z', fill: 'none', stroke: SC_INK, 'stroke-width': 3 }, wetSign);
  T(wetSign, 0, -62, 'WET', { size: 26, weight: 800, anchor: 'middle', fill: SC_INK });
  T(wetSign, 0, -34, 'FLOOR', { size: 22, weight: 800, anchor: 'middle', fill: SC_INK });
  // the box stack Kavya slides into
  const stack = G(flatWrap);
  const STK = [[1030, 640], [1030, 520], [1030, 400]].map(([x, y], i) => { const b = ppBox(stack, 'MISC', { size: 30 }); return { b, x, y, i }; });

  /* ---- mop ---- */
  const mopG = G(flatWrap);
  const mum = person(mopG, { skin: '#C98E62', shirt: '#3FA463', shorts: '#3A4A6A', hair: '#2B1D14', shoes: '#5A3A22' });
  const mopStick = E('line', { stroke: '#B07A45', 'stroke-width': 8, 'stroke-linecap': 'round' }, mopG);
  const mopHead = E('path', { d: 'M-40,0 Q-44,-14 -30,-16 L30,-16 Q44,-14 40,0 Z', fill: '#E9E2D0', stroke: SC_INK, 'stroke-width': 3 }, mopG);
  const clock = G(Lfg);
  E('rect', { x: -112, y: -40, width: 224, height: 80, rx: 18, fill: 'rgba(10,27,39,0.9)', stroke: C.line, 'stroke-width': 2.5 }, clock);
  E('circle', { cx: -66, cy: 0, r: 26, fill: '#FFF6E8', stroke: SC_INK, 'stroke-width': 4 }, clock);
  E('path', { d: 'M-66,0 L-66,-18 M-66,0 L-80,-4', stroke: SC_INK, 'stroke-width': 4, 'stroke-linecap': 'round' }, clock);
  T(clock, 22, 12, '11:00 AM', { size: 34, weight: 800, anchor: 'middle' });
  const sockIn = G(Lfg);
  E('circle', { r: 112, fill: '#0F2C3A', stroke: '#FFFFFF', 'stroke-width': 6 }, sockIn);
  E('path', { d: 'M-30,-80 L20,-80 L20,10 Q60,14 74,34 Q80,56 56,58 L-24,58 Q-44,56 -40,30 Z', fill: '#F7FAFC', stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, sockIn);
  E('path', { d: 'M-30,-62 L20,-62 M-30,-50 L20,-50', stroke: '#E8424F', 'stroke-width': 5 }, sockIn);
  E('path', { d: 'M-34,62 Q20,66 70,58', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 4, opacity: 0.8 }, sockIn);
  slideTxt(sockIn, 0, 150, 'smooth socks', { size: 30, weight: 800, anchor: 'middle', fill: '#FFFFFF' });

  /* ---- whoa ---- */
  const whoaG = G(flatWrap);
  const speedL = E('path', { d: '', stroke: '#FFFFFF', 'stroke-width': 6, 'stroke-linecap': 'round', opacity: 0.8 }, whoaG);
  const bubble = G(Lfg);
  E('path', { d: 'M-230,-56 L230,-56 Q250,-56 250,-36 L250,36 Q250,56 230,56 L-60,56 L-110,96 L-96,56 L-230,56 Q-250,56 -250,36 L-250,-36 Q-250,-56 -230,-56 Z', fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 4 }, bubble);
  const noTxt = T(bubble, 0, 16, '', { size: 44, weight: 800, anchor: 'middle', fill: SC_INK });
  const crash = slideTxt(Lfg, 0, 0, 'CRASH!', { size: 70, weight: 800, anchor: 'middle', fill: '#FFE45C', hw: 10, halo: SC_INK });
  const sockOut = G(whoaG);   // a socked foot sticking out of the pile
  E('path', { d: 'M0,0 L40,-6 Q62,-8 64,8 Q62,22 40,20 L0,22 Z', fill: '#F7FAFC', stroke: SC_INK, 'stroke-width': 3 }, sockOut);

  /* ---- wet: the sock on the wet floor, FORCE-CAM ---- */
  const wetG = G(Lfront);
  const foot = G(wetG);
  E('path', { d: 'M-70,-260 L40,-260 L40,-60 Q150,-50 190,-6 Q206,30 160,40 L-50,40 Q-90,36 -84,-10 Z', fill: '#F7FAFC', stroke: SC_INK, 'stroke-width': 6, 'stroke-linejoin': 'round' }, foot);
  E('path', { d: 'M-70,-230 L40,-230 M-70,-208 L40,-208', stroke: '#E8424F', 'stroke-width': 8 }, foot);
  E('path', { d: 'M-60,44 Q60,52 170,40', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 5, opacity: 0.9 }, foot);
  const wetFric = ppForce(wetG, { color: ppCol.friction, dir: 'left', label: 'friction', side: 'below', width: 20, size: 30 });
  const motion = G(wetG);
  arrow(motion, -60, 0, 140, 0, { color: '#FFFFFF', width: 10 });
  slideTxt(motion, 40, -24, 'sliding', { size: 30, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  const lessC = G(Lfg);
  card(lessC, -230, -70, 460, 140, { fill: 'rgba(10,27,39,0.92)', stroke: ppCol.friction, sw: 4 });
  T(lessC, 0, -16, 'wet + smooth', { size: 36, weight: 700, anchor: 'middle', fill: '#BFE6FF' });
  T(lessC, 0, 36, '= **less friction**', { size: 40, weight: 600, anchor: 'middle', boldFill: ppCol.friction });

  /* ---- conf: Frieda's confessional (thfrieda, useful) ---- */
  const conf = ppConf(Lbg, 'frieda');
  const ltFrieda = scLowerThird(Lhud, 'FRIEDA', 'Friction. Against it.');
  const agC = G(Lfg);
  card(agC, -270, -170, 540, 390, { fill: 'rgba(10,27,39,0.92)', stroke: ppCol.friction, sw: 4 });
  T(agC, 0, -110, 'friction always acts', { size: 36, weight: 700, anchor: 'middle' });
  T(agC, 0, -60, 'AGAINST the motion', { size: 44, weight: 800, anchor: 'middle', fill: ppCol.friction });
  E('rect', { x: -230, y: 110, width: 460, height: 10, fill: '#8C6A4A' }, agC);
  const agBox = G(agC);
  E('rect', { x: -60, y: 30, width: 120, height: 80, rx: 6, fill: '#C99A5E', stroke: '#8C6235', 'stroke-width': 4 }, agBox);
  const agMot = arrow(agC, 70, 6, 210, 6, { color: '#FFFFFF', width: 9 });
  T(agC, 210, -26, 'motion', { size: 28, weight: 700, anchor: 'end', fill: '#FFFFFF' });
  const agFr = ppForce(agC, { color: ppCol.friction, dir: 'left', label: '', width: 18 }); tr(agFr, -10, 140);
  T(agC, -70, 196, 'friction', { size: 28, weight: 800, anchor: 'middle', fill: ppCol.friction });
  // useful: three icons + the wall cartoon
  const icons = [];
  const ICON_LBL = ['walking', 'tyres grip', 'brakes'];
  for (let i = 0; i < 3; i++) {
    const g = G(Lfg);
    card(g, -82, -90, 164, 180, { fill: 'rgba(10,27,39,0.92)', stroke: C.line, sw: 3 });
    if (i === 0) {   // a shoe gripping the floor
      E('path', { d: 'M-50,10 L-50,-40 L-10,-40 L-6,-12 Q40,-10 56,10 Z', fill: '#2E7DD8', stroke: SC_INK, 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
      E('path', { d: 'M-54,10 L60,10 L60,22 L-54,22 Z', fill: '#2B2B2B' }, g);
      E('path', { d: 'M-46,22 L-40,30 L-32,22 L-24,30 L-16,22 L-8,30 L0,22 L8,30 L16,22 L24,30 L32,22 L40,30 L48,22', fill: 'none', stroke: '#2B2B2B', 'stroke-width': 4 }, g);
      E('line', { x1: -70, x2: 70, y1: 32, y2: 32, stroke: '#C6AC86', 'stroke-width': 5 }, g);
    } else if (i === 1) {   // a tyre on the road
      E('circle', { cx: 0, cy: -8, r: 44, fill: '#232323', stroke: SC_INK, 'stroke-width': 3 }, g);
      E('circle', { cx: 0, cy: -8, r: 18, fill: '#B9C2CB' }, g);
      let d = ''; for (let k = 0; k < 16; k++) { const a = k / 16 * TAU; d += `M${(Math.cos(a) * 36).toFixed(1)},${(-8 + Math.sin(a) * 36).toFixed(1)} L${(Math.cos(a) * 46).toFixed(1)},${(-8 + Math.sin(a) * 46).toFixed(1)} `; }
      E('path', { d, stroke: '#555', 'stroke-width': 4 }, g);
      E('line', { x1: -70, x2: 70, y1: 38, y2: 38, stroke: '#7A8088', 'stroke-width': 6 }, g);
    } else {   // a brake pad on a wheel
      E('circle', { cx: -6, cy: -6, r: 44, fill: '#B9C2CB', stroke: SC_INK, 'stroke-width': 3 }, g);
      E('circle', { cx: -6, cy: -6, r: 10, fill: '#5E6B78' }, g);
      E('path', { d: 'M30,-34 Q50,-6 30,22 L44,26 Q66,-6 44,-38 Z', fill: '#E8424F', stroke: SC_INK, 'stroke-width': 3 }, g);
    }
    T(g, 0, 72, ICON_LBL[i], { size: 26, weight: 700, anchor: 'middle' });
    const tk = tick(g, 16); tr(tk, 58, -66);
    icons.push({ g, tk });
  }
  const wall = G(Lfg);
  card(wall, -260, -86, 520, 172, { fill: 'rgba(10,27,39,0.92)', stroke: C.bad, sw: 3 });
  T(wall, -240, -50, 'no friction:', { size: 28, weight: 700, fill: '#FFB3B3' });
  E('rect', { x: 150, y: -70, width: 40, height: 140, fill: '#C9C0AA', stroke: SC_INK, 'stroke-width': 3 }, wall);
  const wallPeople = [0, 1, 2].map(i => slideStick(wall, ['#FF7A70', '#56D69B', '#FFC247'][i]));
  const splat = slideTxt(wall, 170, -40, 'SPLAT', { size: 30, weight: 800, anchor: 'middle', fill: '#FFE45C', halo: SC_INK });
  const wallX = cross(wall, 22); tr(wallX, -200, 20);
  const usefulC = chip(Lfg, 'friction is USEFUL', { size: 40, fill: ppCol.friction, color: '#3A1E00', stroke: '#FFFFFF', sw: 3 });

  /* ---- bumps: zoom x1000 ---- */
  const bmG = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#0F2233', '#1B3A52', true) }, bmG);
  E('rect', { x: 80, y: 470, width: 400, height: 40, fill: '#C6AC86', stroke: '#8C6A4A', 'stroke-width': 3 }, bmG);
  const bmBlock = G(bmG);
  E('rect', { x: 200, y: 360, width: 170, height: 110, rx: 6, fill: '#7FB6D9', stroke: SC_INK, 'stroke-width': 4 }, bmBlock);
  T(bmG, 280, 300, 'looks smooth...', { size: 32, weight: 700, anchor: 'middle', fill: C.muted });
  const mag = G(bmG);
  E('line', { x1: 34, y1: 34, x2: 74, y2: 74, stroke: '#6B4A33', 'stroke-width': 16, 'stroke-linecap': 'round' }, mag);
  E('circle', { r: 50, fill: 'rgba(255,255,255,0.15)', stroke: '#E9EEF2', 'stroke-width': 8 }, mag);
  const zoomLines = E('path', { d: 'M318,430 L640,190 M318,520 L640,610', stroke: '#FFFFFF', 'stroke-width': 3, 'stroke-dasharray': '10 8', opacity: 0.6 }, bmG);
  const zoomC = G(bmG); tr(zoomC, 820, 400);
  const zcId = 'slideZoomClip';
  { const cp = E('clipPath', { id: zcId }, defs()); E('circle', { r: 220 }, cp); }
  E('circle', { r: 226, fill: '#14303F', stroke: '#FFFFFF', 'stroke-width': 8 }, zoomC);
  const zin = G(zoomC, { 'clip-path': `url(#${zcId})` });
  const jag = (seed, y0, up) => {   // a jagged surface edge from x -260 to 260
    const r = rng(seed); let d = `M-300,${up ? -300 : 300} L-300,${y0}`;
    for (let x = -300; x <= 300; x += 26) d += ` L${(x + 13).toFixed(0)},${(y0 + (up ? 1 : -1) * (14 + r() * 26)).toFixed(0)} L${(x + 26).toFixed(0)},${(y0 + (up ? -1 : 1) * (r() * 8)).toFixed(0)}`;
    return d + ` L300,${up ? -300 : 300} Z`;
  };
  E('path', { d: jag(3, 30, false), fill: linGrad('#C6AC86', '#8C6A4A', true), stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, zin);
  const topSurf = E('path', { d: jag(7, 20, true), fill: linGrad('#2C3F9C', '#4A6AD9', true), stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, zin);
  const catches = [-150, -20, 110].map(x => { const s = spark(zin, 14, { color: '#FFE45C' }); tr(s, x, 26); return s; });
  slideTxt(zin, 0, -60, 'block', { size: 30, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  slideTxt(zin, 0, 120, 'floor', { size: 30, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  slideTxt(zoomC, 0, -180, '× 1000', { size: 40, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  const zArrow = arrow(zoomC, -80, -110, 80, -110, { color: '#FFFFFF', width: 8 });
  const roughC = G(Lfg);
  card(roughC, -400, -42, 800, 84, { fill: 'rgba(10,27,39,0.92)', stroke: ppCol.friction, sw: 3 });
  T(roughC, 0, 12, 'even smooth surfaces are **rough** close up', { size: 36, weight: 600, anchor: 'middle', boldFill: ppCol.friction });
  const catchC = slidePill(Lfg, 'the bumps catch', { size: 32, color: C.energy, stroke: C.energy });

  /* ---- wheel: squeak, oil, objection ---- */
  const whG = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#E4DDCC', '#C9C0AA', true) }, whG);
  E('rect', { x: 0, y: 590, width: 1200, height: 160, fill: linGrad('#CFC6B4', '#B5AC98', true) }, whG);
  E('path', { d: 'M0,590 L1200,590', stroke: '#A39A86', 'stroke-width': 4 }, whG);
  E('rect', { x: 120, y: 150, width: 600, height: 50, rx: 10, fill: '#3F5BD9', stroke: SC_INK, 'stroke-width': 5 }, whG);   // trolley deck
  E('path', { d: 'M380,200 L380,300 M460,200 L460,300 M370,300 L470,300', stroke: '#5E6B78', 'stroke-width': 14, 'stroke-linecap': 'round' }, whG);   // fork
  const wheel = G(whG); tr(wheel, 420, 440);
  E('circle', { r: 150, fill: '#232323', stroke: SC_INK, 'stroke-width': 5 }, wheel);
  E('path', { d: 'M-60,138 Q0,152 60,138 L54,150 Q0,158 -54,150 Z', fill: '#B5AC98' }, wheel);   // a worn flat spot
  const spokes = G(wheel);
  E('circle', { r: 96, fill: '#9AA6B2', stroke: SC_INK, 'stroke-width': 4 }, spokes);
  E('path', { d: 'M-96,0 L96,0 M0,-96 L0,96 M-68,-68 L68,68 M-68,68 L68,-68', stroke: '#5E6B78', 'stroke-width': 8 }, spokes);
  E('circle', { r: 26, fill: '#5E6B78', stroke: SC_INK, 'stroke-width': 4 }, wheel);
  const axleGlow = E('circle', { cx: 420, cy: 440, r: 60, fill: glow('#FF8A3D'), opacity: 0 }, whG);
  const heat = heatWaves(whG, { n: 4, h: 110, spacing: 26 });
  const squeak = slideTxt(Lfg, 0, 0, 'SQUEAK!', { size: 56, weight: 800, anchor: 'middle', fill: '#FFFFFF', hw: 10, halo: '#C25516' });
  const crumbs = G(whG);
  const crumbEls = [0, 1, 2, 3, 4].map(() => E('rect', { x: -4, y: -4, width: 8, height: 8, fill: '#3A3A3A' }, crumbs));
  const heatC = slidePill(Lfg, 'wastes energy as heat', { size: 34, color: C.heat, stroke: C.heat });
  const wearC = slidePill(Lfg, 'wears parts out', { size: 34, color: '#FFB3B3', stroke: '#FFB3B3' });
  const oilCan = G(Lfront);
  E('path', { d: 'M-50,-40 L50,-40 L50,50 Q50,60 40,60 L-40,60 Q-50,60 -50,50 Z', fill: ball('#E8424F', '#8E1F1F'), stroke: SC_INK, 'stroke-width': 4 }, oilCan);
  E('path', { d: 'M-50,-10 L-140,-60', stroke: SC_INK, 'stroke-width': 10, 'stroke-linecap': 'round' }, oilCan);
  E('path', { d: 'M-50,-10 L-140,-60', stroke: '#C9CED4', 'stroke-width': 5, 'stroke-linecap': 'round' }, oilCan);
  E('path', { d: 'M-34,-40 Q0,-80 34,-40', fill: 'none', stroke: SC_INK, 'stroke-width': 6 }, oilCan);
  T(oilCan, 0, 22, 'OIL', { size: 28, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  const drips = [0, 1, 2].map(() => E('path', { d: 'M0,-10 Q7,2 0,7 Q-7,2 0,-10 Z', fill: '#E3B23C', stroke: '#8A6A12', 'stroke-width': 2 }, Lfront));
  const oilC = G(Lfg);
  card(oilC, -250, -70, 500, 140, { fill: 'rgba(10,27,39,0.92)', stroke: C.good, sw: 4 });
  T(oilC, 0, -16, '**REDUCE** friction:', { size: 36, weight: 600, anchor: 'middle', boldFill: C.good });
  T(oilC, 0, 36, 'a lubricant (oil)', { size: 36, weight: 700, anchor: 'middle', fill: '#E3B23C' });
  const tweet = slideTxt(Lfg, 0, 0, 'TWEEEET!', { size: 44, weight: 800, anchor: 'middle', fill: '#FFFFFF', hw: 8, halo: '#C62828' });
  const blast = E('path', { d: 'M0,-20 L40,-40 M6,0 L50,0 M0,20 L40,40', stroke: '#C62828', 'stroke-width': 6, 'stroke-linecap': 'round' }, Lfg);

  /* ---- gavel: Rex overrules ---- */
  const rxConf = ppConf(Lbg, 'rex');
  const bench = G(Lfront);
  E('rect', { x: -110, y: 0, width: 220, height: 30, rx: 6, fill: '#6B4A33', stroke: SC_INK, 'stroke-width': 4 }, bench);
  E('ellipse', { cx: 0, cy: 0, rx: 60, ry: 12, fill: '#8A5A3A', stroke: SC_INK, 'stroke-width': 4 }, bench);
  const gavel = G(bench);
  E('rect', { x: -6, y: -10, width: 12, height: 150, rx: 5, fill: '#B07A45', stroke: SC_INK, 'stroke-width': 3 }, gavel);
  E('rect', { x: -40, y: -36, width: 80, height: 40, rx: 8, fill: '#8A5A3A', stroke: SC_INK, 'stroke-width': 4 }, gavel);
  const bang = slideTxt(Lfg, 0, 0, 'BANG', { size: 40, weight: 800, anchor: 'middle', fill: '#FFE45C', hw: 8, halo: SC_INK });
  const overSt = slideStamp(Lfg, 'OVERRULED', { size: 50, color: C.bad });

  /* ---- grip: rubber soles ---- */
  const grG = G(flatWrap);
  const puff = E('circle', { r: 50, fill: '#FFFFFF', opacity: 0 }, Lfront);
  const incC = G(Lfg);
  card(incC, -310, -46, 620, 92, { fill: 'rgba(10,27,39,0.92)', stroke: ppCol.friction, sw: 4 });
  T(incC, 0, 12, '**INCREASE** friction: rougher surfaces', { size: 34, weight: 600, anchor: 'middle', boldFill: ppCol.friction });
  const soleC = G(Lfg);
  card(soleC, -170, -120, 340, 240, { fill: 'rgba(10,27,39,0.92)', stroke: C.line, sw: 3 });
  E('path', { d: 'M-130,-30 Q-130,-70 -80,-70 L90,-70 Q140,-70 140,-20 Q140,30 90,40 L-80,40 Q-130,40 -130,-30 Z', fill: '#2B2B2B', stroke: '#111', 'stroke-width': 4 }, soleC);
  { let d = ''; for (let x = -110; x <= 120; x += 26) d += `M${x},-58 L${x + 13},-15 L${x},28 `; E('path', { d, fill: 'none', stroke: '#6A6A6A', 'stroke-width': 7, 'stroke-linejoin': 'round' }, soleC); }
  T(soleC, 0, 92, 'rubber sole: treads', { size: 28, weight: 700, anchor: 'middle' });
  const tyreC = G(Lfg);
  card(tyreC, -170, -120, 340, 240, { fill: 'rgba(10,27,39,0.92)', stroke: C.line, sw: 3 });
  E('rect', { x: -130, y: -74, width: 260, height: 116, rx: 16, fill: '#232323', stroke: '#111', 'stroke-width': 4 }, tyreC);
  { let d = ''; for (let x = -110; x <= 110; x += 30) d += `M${x},-64 L${x + 20},-16 L${x},32 M${x + 10},-16 L${x + 30},-16 `; E('path', { d, fill: 'none', stroke: '#5A5A5A', 'stroke-width': 8 }, tyreC); }
  T(tyreC, 0, 92, 'tyre tread', { size: 28, weight: 700, anchor: 'middle' });

  /* ---- drag, faster, lorry: outdoors ---- */
  const road = slideRoad(Lbg);
  // Kavya's full body, socks (Lmid, outside the camera: placed with slideCP) and school shoes
  const kavS = slideKavya(Lmid, '#F2F7FA'), kavH = slideKavya(Lmid, '#1E1E22');
  const wind = E('path', { d: '', stroke: '#FFFFFF', 'stroke-width': 4, 'stroke-linecap': 'round', opacity: 0.7 }, Lmid);
  const dragC = chip(Lfg, 'AIR RESISTANCE = DRAG', { size: 42, fill: ppCol.drag, color: '#0A2A40', stroke: '#FFFFFF', sw: 3 });
  // scooter
  const scoot = G(Lmid);
  const scootDeck = G(scoot);
  E('rect', { x: -70, y: 0, width: 150, height: 14, rx: 6, fill: '#E8424F', stroke: SC_INK, 'stroke-width': 3 }, scootDeck);
  E('path', { d: 'M70,6 L96,-150 M80,-150 L116,-150', stroke: '#5E6B78', 'stroke-width': 9, 'stroke-linecap': 'round' }, scootDeck);
  const sWheels = [-60, 92].map(x => { const w = G(scootDeck); tr(w, x, 24); E('circle', { r: 20, fill: '#232323', stroke: SC_INK, 'stroke-width': 3 }, w); const sp = E('line', { x1: -12, y1: 0, x2: 12, y2: 0, stroke: '#9AA6B2', 'stroke-width': 3 }, w); return sp; });
  const dragF = ppForce(Lfg, { color: ppCol.drag, dir: 'left', label: 'drag', side: 'above' });
  const motF = G(Lfg); arrow(motF, 0, 0, 150, 0, { color: '#FFFFFF', width: 9 }); slideTxt(motF, 75, -18, 'motion', { size: 28, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  const spdC = slidePill(Lfg, 'slow', { size: 34, color: '#FFFFFF' });
  const fastC = G(Lfg);
  card(fastC, -250, -70, 500, 140, { fill: 'rgba(10,27,39,0.92)', stroke: ppCol.drag, sw: 4 });
  T(fastC, 0, -16, 'drag: friction from air or water', { size: 30, weight: 700, anchor: 'middle', fill: ppCol.drag });
  T(fastC, 0, 34, 'bigger when **faster**', { size: 36, weight: 600, anchor: 'middle', boldFill: C.energy });
  // stream: brick vs teardrop
  const stG = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#0F2233', '#1B3A52', true) }, stG);
  const brick = G(stG); tr(brick, 320, 360);
  E('rect', { x: -90, y: -70, width: 180, height: 140, rx: 4, fill: '#C2643A', stroke: SC_INK, 'stroke-width': 5 }, brick);
  E('path', { d: 'M-90,-23 L90,-23 M-90,23 L90,23 M-30,-70 L-30,-23 M30,-23 L30,23 M-30,23 L-30,70', stroke: '#8E3A1E', 'stroke-width': 4 }, brick);
  const tear = G(stG); tr(tear, 870, 360);
  E('path', { d: 'M-120,0 C-120,-66 -30,-74 60,-40 Q120,-14 170,0 Q120,14 60,40 C-30,74 -120,66 -120,0 Z', fill: ball('#7FB6D9', '#3F5BD9'), stroke: SC_INK, 'stroke-width': 5 }, tear);
  // flow lines: brick (messy) and teardrop (smooth); drawn once, animated by dash offset
  const flowB = G(brick), flowT = G(tear), eddies = [];
  [-50, -16, 16, 50].forEach((y0, i) => {
    const sgn = y0 < 0 ? -1 : 1;
    const d = `M-260,${y0} L-110,${y0} Q-96,${y0} -96,${y0 + sgn * 30} Q-96,${y0 + sgn * 70} -60,${sgn * 100}`;
    E('path', { d, fill: 'none', stroke: '#BFE6FF', 'stroke-width': 4, 'stroke-dasharray': '18 12', 'stroke-linecap': 'round', class: 'fl' }, flowB);
  });
  [-1, 1].forEach(sgn => [0, 1].forEach(k => { const e = G(flowB); tr(e, 130 + k * 70, sgn * (30 + k * 20)); E('path', { d: 'M0,-26 A26,26 0 1 1 -24,8 A16,16 0 1 1 4,-12', fill: 'none', stroke: '#BFE6FF', 'stroke-width': 4, 'stroke-linecap': 'round' }, e); eddies.push({ e, sgn, k }); }));
  [-150, -100, -62, 62, 100, 150].forEach(y0 => {
    const bump = Math.sign(y0) * (Math.abs(y0) < 70 ? 34 : Math.abs(y0) < 120 ? 16 : 6);
    let d = '';
    for (let x = -320; x <= 360; x += 20) { const y = y0 + bump * Math.exp(-Math.pow((x + 10) / 130, 2)); d += (d ? ' L' : 'M') + x + ',' + y.toFixed(1); }
    E('path', { d, fill: 'none', stroke: '#BFE6FF', 'stroke-width': 4, 'stroke-dasharray': '30 14', 'stroke-linecap': 'round', class: 'fl' }, flowT);
  });
  const flows = [...flowB.querySelectorAll('.fl'), ...flowT.querySelectorAll('.fl')];
  const brickX = cross(stG, 24); tr(brickX, 320, 530);
  const brickLbl = T(stG, 320, 600, 'flat front: air crashes', { size: 30, weight: 700, anchor: 'middle', fill: '#FFB3B3' });
  const tearTk = tick(stG, 24); tr(tearTk, 870, 530);
  const streamC = chip(Lfg, 'STREAMLINED: smooth and pointed', { size: 34, fill: ppCol.drag, color: '#0A2A40', stroke: '#FFFFFF', sw: 3 });
  const airLbl = slideTxt(stG, 600, 160, 'air →', { size: 34, weight: 800, anchor: 'middle', fill: '#BFE6FF' });
  // lorry
  const lorryG = G(Lmid);
  const lorry = ppLorry(lorryG);
  const lAir = E('path', { d: '', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 4, 'stroke-linecap': 'round', opacity: 0.85 }, lorryG);
  const lSwirl = [0, 1, 2, 3].map(() => E('path', { d: 'M0,-22 A22,22 0 1 1 -20,8 A13,13 0 1 1 4,-10', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 4, 'stroke-linecap': 'round' }, lorryG));
  const boxC = chip(Lfg, '= a box', { size: 40, fill: '#FFF6D6', color: SC_INK, stroke: '#E0C878', sw: 4 });

  /* ================= the cast ================= */
  const frieda = cast(Lcast, 'frieda');
  const jacket = slideJacket(Lcast);
  const rex = cast(Lcast, 'rex', { mood: 'deadpan' });
  const fcam = slideFcam(Lhud);

  const tCrash = mid('whoa', 0.92);

  return t => {
    const sh = shotAt(t), shown = {};
    op(kavS, 0); op(kavH, 0); op(puff, 0);
    const flatOn = ['mop', 'whoa', 'grip'].includes(sh);
    op(flatShot, flatOn || sh === 'wet' ? 1 : 0);
    if (flatOn || sh === 'wet') flat.upd(t);
    [mopG, whoaG, grG].forEach(g => op(g, 0));
    op(sheen, 0); op(wetSign, 0); op(stack, 0);
    const placeFrieda = (x, y, s, st) => { shown.frieda = 1; op(frieda, st.opacity ?? 1); tr(frieda, x, y, s); frieda.set(st); op(jacket, st.jacket ? st.opacity ?? 1 : 0); if (st.jacket) tr(jacket, x, y, s); };

    /* ---------- mop ---------- */
    op(clock, 0); op(sockIn, 0);
    if (sh === 'mop') {
      op(mopG, 1); op(stack, 1); STK.forEach(({ b, x, y }) => tr(b, x, y, 0.85));
      const push = P(t, at('mop'), at('whoa') - at('mop'), linear);
      slideCam(flatWrap, 600, 500, 1 + 0.05 * push);
      const sh_ = P(t, at('mop') + 0.2, 3, linear);
      op(sheen, sh_); op(wetSign, P(t, mid('mop', 0.25), 0.3, linear));
      const sw = Math.sin(t * TAU * 0.9) * AMP;
      tr(mum, 300, 700, 1.15);
      mum.pose({ lean: 8 + 3 * sw, armL: [40, 30], armR: [60, 20], legL: [8, -4], legR: [-8, -4] });
      const hx = 300 + 50 * 1.15, hy = 700 - 112 * 1.15, fx = 300 + 150 + 60 * sw, fy = 700;
      attr(mopStick, 'x1', hx); attr(mopStick, 'y1', hy); attr(mopStick, 'x2', fx); attr(mopStick, 'y2', fy - 10);
      tr(mopHead, fx, fy);
      op(kavS, 1); slideCP(kavS, 600, 500, 1 + 0.05 * push, 880, 712, 1.5);
      const step = P(t, end('mop') + 0.05, 0.4, ease);
      kavS.pose({ lean: -2 + 4 * step, armL: [10, 10], armR: [-10, 10], legL: [3 + 14 * step, -3], legR: [-3, -3] });
      slidePop(clock, 690, 170, P(t, at('mop') + 0.05, 0.4, pop));
      slidePop(sockIn, 640, 340, P(t, mid('mop', 0.62), 0.4, pop));
    }

    /* ---------- whoa: the slide ---------- */
    op(bubble, 0); op(crash, 0);
    if (sh === 'whoa') {
      op(whoaG, 1); op(sheen, 1); op(stack, 1);
      slideCam(flatWrap, 600, 500, 1.02);
      const u = clamp((t - at('whoa')) / (tCrash - at('whoa')));
      const x = lerp(140, 900, u * (0.6 + 0.4 * u));
      const crashed = t >= tCrash, cp = crashed ? clamp((t - tCrash) / 0.6) : 0;
      const wob = Math.sin(t * 13) * 14 * AMP;
      slideCP(kavS, 600, 500, 1.02, crashed ? 930 : x, 712, 1.5);
      kavS.pose(crashed ? { lean: 70, armL: [150, 20], armR: [-150, -20], legL: [40, 0], legR: [-30, 0] } : { lean: wob, armL: [110 + wob, 10], armR: [-110 + wob, -10], legL: [26, -6], legR: [-22, -6] });
      op(kavS, crashed ? 1 - P(t, tCrash + 0.15, 0.2, linear) : 1);
      let d = ''; if (!crashed) [520, 580, 640].forEach((y, i) => d += `M${(x - 70 - i * 20).toFixed(0)},${y} L${(x - 200 - i * 30).toFixed(0)},${y} `);
      attr(speedL, 'd', d);
      STK.forEach(({ b, x: bx, y: by, i }) => {
        const f = clamp(cp * (1 + i * 0.3));
        tr(b, bx - 60 * f * (i === 0 ? 0.6 : 1) + i * 20 * f, by + f * f * (i === 0 ? 0 : i === 1 ? 120 : 250), 0.85, f * (i === 2 ? -70 : -30));
      });
      op(sockOut, crashed ? P(t, tCrash + 0.3, 0.2, linear) : 0); tr(sockOut, 890, 690, 1.6, -10);
      const words = ['No,', 'no,', 'no,', 'no,', 'NO!'], n = Math.min(5, 1 + Math.floor(clamp((t - at('whoa')) / (end('whoa') - at('whoa'))) * 5));
      setText(noTxt, words.slice(0, n).join(' ')); noTxt.setAttribute('font-size', n === 5 ? 50 : 44);
      op(bubble, crashed ? 1 - P(t, tCrash + 0.2, 0.2, linear) : 1); tr(bubble, Math.min(x + 180, 760), 330);
      slidePop(crash, 930, 300, crashed ? P(t, tCrash, 0.3, pop) : 0, 1, -8);
    }

    /* ---------- wet: FORCE-CAM, Frieda tiny under the sock ---------- */
    op(wetG, sh === 'wet' ? 1 : 0); op(lessC, 0);
    if (sh === 'wet') {
      op(sheen, 1);
      slideCam(flatWrap, 700, 650, 2.4, 600, 520);
      const fx = 520 + 40 * Math.sin(t * 1.4) * AMP;
      tr(foot, fx, 560);
      placeFrieda(fx + 90, 650, 0.38, { t, talk: talk(t, 'frieda'), mood: 'annoyed', look: -0.5, opacity: 0.75 });
      tr(wetFric, fx - 40, 608); wetFric.set(46);
      tr(motion, fx - 20, 370);
      slidePop(lessC, 900, 260, P(t, mid('wet', 0.5), 0.4, pop));
    }

    /* ---------- conf: Frieda's confessional ---------- */
    conf.set(sh === 'conf' ? 1 : 0, t);
    op(agC, 0); icons.forEach(i => op(i.g, 0)); op(wall, 0); op(usefulC, 0); ltFrieda.set(0);
    if (sh === 'conf') {
      const isU = t >= at('useful') - 0.1;
      const push = P(t, at('thfrieda'), at('bumps') - at('thfrieda'), linear);
      slideCam(conf, 430, 380, 1 + 0.05 * push);
      const k = isU ? 1.2 : 1.5;
      placeFrieda(isU ? 290 : 400, 430, k, { t, talk: talk(t, 'frieda'), mood: t > mid('useful', 0.9) ? 'smug' : 'annoyed', look: isU ? 0.5 : 0 });
      ltFrieda.set(win(t, at('thfrieda') + 0.1, at('thfrieda') + 3.3, 0.3));
      if (!isU) {
        slidePop(agC, 870, 360, P(t, mid('thfrieda', 0.1), 0.4, pop));
        const slideBx = 20 * Math.sin(t * 2) * AMP;
        tr(agBox, slideBx, 0);
        agFr.set(110 * ease(P(t, mid('thfrieda', 0.3), 0.5, linear)));
        // "you couldn't even walk": the walking icon arrives early
        slidePop(icons[0].g, 870, 650, 0);
      } else {
        const T0 = [at('useful') - 0.05, mid('useful', 0.12), mid('useful', 0.32)];
        icons.forEach((ic, i) => { const p = P(t, T0[i], 0.35, pop); slidePop(ic.g, 690 + i * 185, 260, p); op(ic.tk, P(t, T0[i] + 0.3, 0.2, linear)); });
        const wp = P(t, mid('useful', 0.55), 0.4, pop);
        slidePop(wall, 870, 500, wp);
        wallPeople.forEach((p, i) => { const f = clamp((t - mid('useful', 0.6) - i * 0.15) / 0.6); tr(p, lerp(-120, 110 - i * 34, f), 62, 1, 18); });
        op(splat, P(t, mid('useful', 0.75), 0.15, linear));
        op(wallX, P(t, mid('useful', 0.85), 0.2, linear));
        slidePop(usefulC, 870, 140, P(t, mid('useful', 0.9), 0.4, pop));
      }
    }

    /* ---------- bumps ---------- */
    op(bmG, sh === 'bumps' ? 1 : 0); op(roughC, 0); op(catchC, 0);
    if (sh === 'bumps') {
      const mp = P(t, at('bumps') + 0.2, 0.5, ease);
      tr(mag, lerp(140, 300, mp), lerp(620, 470, mp));
      const zp = P(t, mid('bumps', 0.2), 0.45, pop);
      op(zoomLines, clamp(zp * 2) * 0.6); slidePop(zoomC, 820, 400, zp);
      // the top surface tries to slide right; the bumps catch it
      const tryT = Math.max(0, t - mid('bumps', 0.4)), tries = tryT > 0;
      const jit = tries ? (6 * Math.abs(Math.sin(tryT * 5)) + 2 * Math.sin(tryT * 23)) * AMP : 0;
      tr(topSurf, jit, -Math.abs(Math.sin(tryT * 5)) * 4 * AMP);
      catches.forEach((c, i) => { op(c, tries ? clamp(Math.sin(tryT * 5 + i) * 2) : 0); c.upd(t + i); });
      zArrow.set(tries ? 1 : 0); op(zArrow, tries ? 1 : 0);
      tr(bmBlock, tries ? 2 * Math.sin(tryT * 20) * AMP : 0, 0);
      slidePop(roughC, 600, 680, P(t, mid('bumps', 0.3), 0.4, pop));
      slidePop(catchC, 820, 150, P(t, mid('bumps', 0.7), 0.4, pop));
    }

    /* ---------- wheel: squeak, oil, objection ---------- */
    op(whG, sh === 'wheel' ? 1 : 0);
    [squeak, heatC, wearC, oilCan, oilC, tweet, blast].forEach(e => op(e, 0)); drips.forEach(d => op(d, 0));
    if (sh === 'wheel') {
      const spin = t * 50 * AMP;
      tr(spokes, 0, 0, 1, spin % 360);
      const tOil = mid('oil', 0.4), oiled = clamp((t - tOil) / 0.8);
      heat.upd(t); tr(heat, 420, 400); op(heat, 1 - oiled);
      op(axleGlow, (1 - oiled) * (0.6 + 0.3 * Math.sin(t * 6)) * P(t, at('squeak') + 0.4, 0.5, linear));
      const sq = (Math.floor(t * 1.6) % 2 === 0) && oiled < 0.5;
      op(squeak, sq ? 1 : 0); tr(squeak, 600 + 10 * Math.sin(t * 9) * AMP, 330, 1, -6 + 4 * Math.sin(t * 7) * AMP);
      crumbEls.forEach((c, i) => { const f = (t * 0.7 + i * 0.2) % 1; tr(c, 380 + i * 22 + f * 30, 590 - 10 + f * 60); op(c, (1 - oiled) * (1 - f) * P(t, mid('squeak', 0.6), 0.3, linear)); });
      const isOil = t >= at('oil') - 0.1, isObj = t >= at('object') - 0.1;
      if (!isOil) {
        slidePop(heatC, 900, 470, P(t, mid('squeak', 0.3), 0.4, pop));
        slidePop(wearC, 900, 550, P(t, mid('squeak', 0.68), 0.4, pop));
      }
      if (isOil) {
        shown.rex = 1; op(rex, 1);
        tr(rex, 860, 330, 0.9);
        rex.set({ t, talk: talk(t, 'rex'), mood: isObj ? 'deadpan' : 'smug', look: isObj ? -0.8 : -0.4, len: 0.4 });
        const tilt = P(t, at('oil'), 0.5, ease);
        op(oilCan, isObj ? 1 - P(t, at('object'), 0.2, linear) : 1); tr(oilCan, 580, 300, 1, -20 * tilt);
        drips.forEach((d, i) => { const f = ((t - tOil) * 1.4 + i / 3) % 1; if (t > tOil - 0.3 && !isObj) { op(d, 1); tr(d, 428 - f * 6, 300 + f * 115); } });
        slidePop(oilC, 860, 620, P(t, mid('oil', 0.35), 0.4, pop));
      }
      if (isObj) {
        placeFrieda(200, 470, 0.95, { t, talk: talk(t, 'frieda'), mood: 'annoyed', look: 0.8 });
        const bp = win(t, at('object') + 0.05, end('object') + 0.1, 0.1) * (Math.floor(t * 12) % 2 ? 1 : 0.6);
        op(tweet, bp); tr(tweet, 260, 300, 1, -6);
        op(blast, bp); tr(blast, 312, 500);
      }
    }

    /* ---------- gavel: Rex overrules ---------- */
    rxConf.set(sh === 'gavel' ? 1 : 0, t); op(bench, 0); op(bang, 0); overSt.set(0, 0, 0);
    if (sh === 'gavel') {
      const push = P(t, at('overruled'), end('overruled') + 0.6 - at('overruled'), linear);
      slideCam(rxConf, 420, 400, 1 + 0.06 * push);
      shown.rex = 1; op(rex, 1);
      tr(rex, 420, 400, 1.6 * (1 + 0.12 * ease(push)));
      rex.set({ t, talk: talk(t, 'rex'), mood: 'deadpan', look: 0, len: 0.5 });
      op(bench, 1); tr(bench, 860, 560);
      const tHit = mid('overruled', 0.55), raise = t < tHit ? P(t, at('overruled'), 0.5, ease) : 1 - P(t, tHit - 0.0, 0.12, linear);
      tr(gavel, 40, -20, 1, 40 * raise - 60);
      op(bang, t > tHit && t < tHit + 0.5 ? 1 : 0); tr(bang, 860, 480, 1, -8);
      overSt.set(P(t, tHit + 0.05, 0.25, linear), 840, 250, -8);
    }

    /* ---------- grip: rubber soles ---------- */
    op(incC, 0); op(soleC, 0); op(tyreC, 0);
    if (sh === 'grip') {
      op(grG, 1);
      const push = P(t, at('grip'), at('drag') - at('grip'), linear);
      slideCam(flatWrap, 400, 500, 1.06 + 0.04 * push);
      const tSwap = mid('grip', 0.8), swapped = t >= tSwap;
      const kk = 1.06 + 0.04 * push;
      op(kavH, swapped ? 1 : 0); op(kavS, swapped ? 0 : 1);
      [kavH, kavS].forEach(k => { slideCP(k, 400, 500, kk, 330, 712, 1.6); k.pose(swapped ? { lean: 0, armL: [30, 30], armR: [-30, 30] } : { lean: 4, armL: [10, 10], armR: [-10, 10], legL: [10, -40], legR: [-3, -3] }); });
      const pf = clamp((t - tSwap + 0.1) / 0.5);
      op(puff, pf > 0 && pf < 1 ? (1 - pf) * 0.9 : 0); attr(puff, 'cx', 400 + (330 - 400) * kk); attr(puff, 'cy', 500 + 190 * kk); attr(puff, 'r', 30 + 60 * pf);
      slidePop(incC, 760, 170, P(t, at('grip') + 0.1, 0.4, pop));
      slidePop(soleC, 760, 390, P(t, mid('grip', 0.42), 0.4, pop));
      slidePop(tyreC, 760, 390, 0);
      if (t > mid('grip', 0.62)) { op(soleC, 0); slidePop(tyreC, 760, 390, P(t, mid('grip', 0.62), 0.35, pop)); }
    }

    /* ---------- outdoors: drag, faster, lorry ---------- */
    const outOn = sh === 'drag' || sh === 'lorry';
    op(road, outOn || (sh === 'drag') ? 1 : 0); op(wind, 0); op(dragC, 0);
    op(scoot, 0); op(dragF, 0); op(motF, 0); op(spdC, 0); op(fastC, 0);
    op(lorryG, 0); op(boxC, 0);
    if (sh === 'drag') {
      const isFast = t >= at('faster') - 0.1;
      // speed: gentle breeze, then three scooter speeds
      const stage = !isFast ? 0 : t < mid('faster', 0.33) ? 1 : t < mid('faster', 0.66) ? 2 : 3;
      const v = !isFast ? 60 : lerp(150, 900, ease(P(t, at('faster'), end('faster') - at('faster'), linear)));
      road.upd(t, (isFast ? 60 * (at('faster') - at('drag')) + 150 * (t - at('faster')) + 750 * (end('faster') - at('faster')) * Math.pow(P(t, at('faster'), end('faster') - at('faster'), linear), 2) / 2 : 60 * (t - at('drag'))) * AMP);
      let wd = '';
      for (let i = 0; i < 7; i++) { const y = 150 + i * 70, len = 40 + (isFast ? v / 8 : 20), x = 1260 - (((t * (300 + v) + i * 397) % 1500)); wd += `M${x.toFixed(0)},${y} L${(x + len).toFixed(0)},${y} `; }
      attr(wind, 'd', wd); op(wind, 1);
      if (!isFast) {
        const jp = P(t, mid('drag', 0.15), 0.35, pop);
        placeFrieda(430, 400, 1.4, { t, talk: talk(t, 'frieda'), mood: t > mid('drag', 0.4) ? 'smug' : 'annoyed', look: 0.2, jacket: jp > 0.05 });
        if (jp > 0.05) tr(jacket, 430, 400 + (1 - jp) * -60, 1.4 * Math.max(0.01, 0.7 + 0.3 * jp));
        slidePop(dragC, 830, 230, P(t, mid('drag', 0.45), 0.4, pop));
      } else {
        op(scoot, 1); tr(scoot, 600, 650);
        op(kavH, 1); tr(kavH, 600, 648, 1.25); kavH.pose({ lean: 6 + stage * 3, armL: [70, -50], armR: [60, -40], legL: [6, -4], legR: [-6, -4] });
        sWheels.forEach(s => tr(s, 0, 0, 1, (t * v / 20 * 57.3) % 360));
        const L = [0, 50, 110, 190][stage], lp = P(t, stage === 1 ? at('faster') : stage === 2 ? mid('faster', 0.33) : mid('faster', 0.66), 0.4, ease);
        const Lnow = lerp([0, 0, 50, 110][stage], L, lp);
        op(dragF, 1); tr(dragF, 560, 470); dragF.set(Lnow);
        op(motF, 1); tr(motF, 640, 300);
        setText(spdC.label, ['', 'slow', 'faster', 'FASTEST'][stage]);
        op(spdC, 1); tr(spdC, 380, 290);
        // Frieda (in her jacket) grows with the speed, pushing back on Kavya
        const fs = lerp([0.3, 0.3, 0.45, 0.62][stage], [0.3, 0.3, 0.45, 0.62][stage], 1) * (0.9 + 0.1 * lp);
        placeFrieda(820, 500 - fs * 40, fs, { t, talk: talk(t, 'frieda'), mood: stage === 3 ? 'smug' : 'annoyed', look: -0.8, jacket: true });
        slidePop(fastC, 880, 650, P(t, mid('faster', 0.2), 0.4, pop));
      }
    }

    /* ---------- stream ---------- */
    op(stG, sh === 'stream' ? 1 : 0); op(streamC, 0);
    if (sh === 'stream') {
      flows.forEach((f, i) => f.setAttribute('stroke-dashoffset', (-(t * 90 * AMP) % 60).toFixed(1)));
      eddies.forEach(({ e, sgn, k }) => { const [x, y] = [130 + k * 70, sgn * (30 + k * 20)]; e.setAttribute('transform', `translate(${x + 6 * Math.sin(t * 3 + k)} ${y}) rotate(${(sgn * t * 200 * AMP) % 360})`); });
      op(brickX, P(t, mid('stream', 0.25), 0.3, linear)); op(brickLbl, P(t, mid('stream', 0.25), 0.3, linear));
      op(tearTk, P(t, mid('stream', 0.55), 0.3, linear));
      slidePop(streamC, 870, 594, P(t, mid('stream', 0.55), 0.4, pop));
      shown.rex = 1; op(rex, 1); tr(rex, 500, 680, 0.55);
      rex.set({ t, talk: talk(t, 'rex'), mood: 'deadpan', look: t > mid('stream', 0.5) ? 0.6 : -0.6, len: 0.4 });
    }

    /* ---------- lorry ---------- */
    if (sh === 'lorry') {
      const tEnd = end('lorry') + 0.6, u = clamp((t - at('lorry')) / (tEnd - at('lorry')));
      road.upd(t, 0);   // the camera is still: the lorry drives past
      const lx = lerp(-300, 1500, u);
      op(lorryG, u < 1 ? 1 : 0); tr(lorryG, lx, 700);
      lorry.upd(t, 360);
      let d = '';
      for (let i = 0; i < 5; i++) { const y = -200 + i * 36, f = (t * 2.2 + i * 0.27) % 1, x = 380 - f * 130; d += `M${x.toFixed(0)},${y} L${(x + 50).toFixed(0)},${y} `; }
      attr(lAir, 'd', d);
      [[250, -205], [250, -80], [-275, -220], [-300, -110]].forEach(([x, y], i) => lSwirl[i].setAttribute('transform', `translate(${x} ${y}) rotate(${((i < 2 ? 1 : -1) * t * 260 * AMP) % 360})`));
      const bp = P(t, mid('lorry', 0.62), 0.35, pop) * (1 - P(t, end('lorry') + 0.1, 0.2, linear));
      slidePop(boxC, Math.min(lx - 60, 1000), 400, bp, 1, -4);
      const push = P(t, mid('lorry', 0.7), end('lorry') + 0.7 - mid('lorry', 0.7), linear);
      const k = 1 + 0.12 * ease(push);
      placeFrieda(260, 320, 1.05 * k, { t, talk: talk(t, 'frieda'), mood: 'deadpan', look: t < mid('lorry', 0.75) ? 0.8 : 0, jacket: true });
    }

    /* ---------- FORCE-CAM ---------- */
    const fcOn = sh === 'wet' || (sh === 'wheel' && t >= at('oil') - 0.1) || sh === 'drag' || sh === 'lorry';
    const flick = (sh === 'wet' && t < at('wet') + 0.1) || (sh === 'wheel' && t < at('oil') + 0.05) ? Math.floor(t * 30) % 2 : 1;
    fcam.set(fcOn ? flick : 0, t);

    if (!shown.frieda) { op(frieda, 0); op(jacket, 0); }
    if (!shown.rex) op(rex, 0);
  };
});
