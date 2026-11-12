/* Scene 4: Free electron, anyone? (Group 1, the alkali metals)
   Beats: stack 1 lights up on the building -> line-up: lithium, sodium, potassium -> Sonny's flat under oil
   (Silas in goggles and snorkel) -> "so soft, cut me!" -> Silas holds the knife far away -> they float ->
   "WATER?!" -> trough: lithium fizzes (bored), sodium whizzes, WHEEE, potassium bursts into a lilac flame ->
   Harold rises out of the fizz -> whiteboard equation + universal indicator goes purple -> reactivity increases
   down the group -> Kavya: why? -> atoms get bigger -> shielding -> potassium flicks his electron at the camera
   -> Group 2 next door: calcium fizzes steadily, Sonny is not impressed. */
scene('alkali', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;
  const talk = (t, who) => scTalk(S, t, who);

  /* ---------- local helpers (prefixed alk) ---------- */
  function alkSeat(ch, wrap, s) { if (ch.parentNode !== wrap) wrap.appendChild(ch); tr(ch, 0, 0, s === undefined ? 1 : s); }
  // pop in at t0 (and fade out from t1): a chip, card or icon
  function alkShow(el, t, t0, t1, x, y, s, r) {
    const p = P(t, t0, 0.45, pop), o = t1 === undefined ? 1 : 1 - P(t, t1, 0.2, linear);
    op(el, clamp(p * 2.5) * o); if (p > 0) tr(el, x, y, Math.max(0.01, (s || 1) * (0.6 + 0.4 * p)), r);
  }
  function alkCam(el, cx, cy, k, px, py) { el.setAttribute('transform', `translate(${(px ?? cx).toFixed(1)} ${(py ?? cy).toFixed(1)}) scale(${k.toFixed(4)}) translate(${(-cx).toFixed(1)} ${(-cy).toFixed(1)})`); }
  // text with real subscripts: 'H_2' -> H₂
  function alkRich(parent, x, y, str, o) {
    o = o || {};
    const size = o.size || 32, sub = Math.round(size * 0.62), dy = Math.round(size * 0.24);
    const t = E('text', { x, y, 'font-size': size, 'font-weight': o.weight || 700, fill: o.fill || C.ink, 'text-anchor': o.anchor || 'middle', 'font-family': FD }, parent);
    str.split(/_(\d+)/).forEach((seg, i) => {
      if (!seg) return;
      const ts = E('tspan', i % 2 ? { 'font-size': sub, dy } : (i > 0 ? { dy: -dy } : {}), t); ts.textContent = seg;
    });
    return t;
  }
  // a pill label (dark by default); '_2' makes a subscript
  function alkChip(parent, str, o) {
    o = o || {};
    const size = o.size || 32, plain = str.replace(/_(\d+)/g, '$1');
    const w = textWidth(plain, size, FD, 700) + size * 1.4, h = Math.round(size * 1.75);
    const g = G(parent);
    E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: h / 2, fill: o.fill || 'rgba(10,27,39,0.9)', stroke: o.stroke || C.line, 'stroke-width': o.sw || 3 }, g);
    alkRich(g, 0, size * 0.35, str, { size, fill: o.color || C.ink });
    return g;
  }
  // one electron: blue ball with a white minus (as bkAtom draws them)
  function alkE(parent, er) {
    const g = G(parent);
    E('circle', { r: er, fill: ball('#7FD3FF', '#1E6FB0'), stroke: '#0E3F66', 'stroke-width': Math.max(2, er * 0.22) }, g);
    E('path', { d: `M${-er * 0.45},0 L${er * 0.45},0`, stroke: '#FFFFFF', 'stroke-width': Math.max(2.5, er * 0.24), 'stroke-linecap': 'round' }, g);
    return g;
  }
  // a light shell diagram (few elements): rings, nucleus, all inner electrons in one path; the outer
  // shell's electrons are separate groups (g.outer) so they can glow, wobble or leave
  function alkAtom(parent, shells, o) {
    o = o || {};
    const g = G(parent), r0 = o.r0 || 26, dr = o.dr || 20, er = o.er || 7, last = shells.length - 1;
    g.R = k => r0 + k * dr;
    let rings = '';
    shells.forEach((n, k) => { const R = r0 + k * dr; rings += `M${R},0 A${R},${R} 0 1,0 ${-R},0 A${R},${R} 0 1,0 ${R},0 `; });
    g.halo = E('circle', { r: r0 + last * dr, fill: 'none', stroke: C.energy, 'stroke-width': er * 2.6, opacity: 0 }, g);
    E('path', { d: rings, fill: 'none', stroke: '#9FB4C8', 'stroke-width': 2.5, opacity: 0.7, 'stroke-dasharray': '2 6', 'stroke-linecap': 'round' }, g);
    E('circle', { r: r0 * 0.62, fill: ball('#FF7A6B', '#B5372D'), stroke: '#8E1F2A', 'stroke-width': 2 }, g);
    g.pos = (k, i) => { const n = k === last && o.slots ? o.slots : shells[k], a = -Math.PI / 2 + i * TAU / n + (n <= 2 ? 0 : k * 0.3), R = r0 + k * dr; return [Math.cos(a) * R, Math.sin(a) * R]; };
    let dE = '', dM = '';
    g.outer = [];
    shells.forEach((n, k) => {
      for (let i = 0; i < n; i++) {
        const [x, y] = g.pos(k, i);
        if (k === last) { const e = alkE(g, er); tr(e, x, y); e.x0 = x; e.y0 = y; g.outer.push(e); continue; }
        dE += `M${(x - er).toFixed(1)},${y.toFixed(1)} a${er},${er} 0 1,0 ${2 * er},0 a${er},${er} 0 1,0 ${-2 * er},0 `;
        dM += `M${(x - er * 0.45).toFixed(1)},${y.toFixed(1)} h${(er * 0.9).toFixed(1)} `;
      }
    });
    if (dE) { E('path', { d: dE, fill: '#3FA6EA', stroke: '#0E3F66', 'stroke-width': 2 }, g); E('path', { d: dM, stroke: '#FFFFFF', 'stroke-width': 2.2, 'stroke-linecap': 'round' }, g); }
    g.outer.forEach(e => g.appendChild(e));
    return g;
  }
  // Sonny-style orbiting electron at any speed (the cast's own orbit runs at a fixed speed)
  function alkOrbit(c, r, t, sp) {
    const a = t * 1.6 * sp + 0.6, x = Math.cos(a) * r * 1.42, y = Math.sin(a) * r * 0.42, k = -14 * Math.PI / 180;
    tr(c.electron, x * Math.cos(k) - y * Math.sin(k), x * Math.sin(k) + y * Math.cos(k));
  }
  // a row of coloured words laid out centred on cx: parts = [[text, colour], ...]; returns the <text>s
  function alkRow(parent, cx, y, parts, size) {
    const gap = size * 0.4, ws = parts.map(([s]) => textWidth(s, size, FD, 800));
    let x = cx - (ws.reduce((a, b) => a + b, 0) + gap * (parts.length - 1)) / 2;
    return parts.map(([s, col], i) => { const el = T(parent, x + ws[i] / 2, y, s, { size, weight: 800, anchor: 'middle', fill: col }); x += ws[i] + gap; return el; });
  }
  function alkLab(parent) {   // plain lab wall and bench
    E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#22394C', '#142433', true) }, parent);
    E('rect', { x: 0, y: 612, width: 1200, height: 138, fill: linGrad('#6B5A48', '#4A3D30', true) }, parent);
    E('rect', { x: 0, y: 606, width: 1200, height: 10, fill: '#8A7660' }, parent);
  }

  /* ---------- the cast (one of each, seated into whichever shot is on) ---------- */
  const SIL = cast(root, 'silas'), SON = cast(root, 'sonny'), LI = cast(root, 'lithium'), KK = cast(root, 'potassium');
  const HAR = cast(root, 'harold'), KAV = cast(root, 'kavya', { home: true });
  [SIL, SON, LI, KK, HAR, KAV].forEach(c => op(c, 0));

  /* ---------- cut list: [start, shot, setup] ---------- */
  const CUTS = [
    [-1, 'block', 'meet'],
    [mid('meet', 0.5), 'line', 'meet'],
    [at('oil') - 0.08, 'oil', ''],
    [at('float') - 0.08, 'float', ''],
    [at('water') - 0.08, 'wet', ''],
    [at('li') - 0.08, 'trough', ''],
    [at('equation') - 0.08, 'board', ''],
    [at('trend') - 0.08, 'trend', ''],
    [at('why') - 0.08, 'bed', ''],
    [at('bigger') - 0.08, 'atoms', ''],
    [at('lost') - 0.08, 'line', 'lost'],
    [at('group2') - 0.08, 'block', 'g2'],
    [mid('group2', 0.62), 'calcium', ''],
  ];
  const cutAt = t => { let c = CUTS[0]; for (const k of CUTS) if (t >= k[0]) c = k; return c; };

  /* =====================================================================
     BLOCK: stack 1 (and later stack 2) lights up
     ===================================================================== */
  const gBlock = G(root);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#4FB6F5', '#BFE8FF', true) }, gBlock);
  E('path', { d: 'M760,120 q30,-40 70,-10 q30,-30 60,0 q30,0 20,24 l-150,0 q-20,-6 0,-14 Z', fill: '#FFFFFF', opacity: 0.85 }, gBlock);
  E('rect', { x: 0, y: 690, width: 1200, height: 60, fill: '#5BBF6A' }, gBlock);
  const blkW = G(gBlock);
  const BLK = bkBlock(blkW, { numbers: false });
  const bkHud = G(gBlock);
  const cG1 = alkChip(bkHud, 'GROUP 1: the ALKALI METALS', { size: 42, stroke: '#FF6B6B', color: '#FFFFFF' });
  const cG2 = alkChip(bkHud, 'GROUP 2: two outer electrons', { size: 38, stroke: '#FFA36B', color: '#FFFFFF' });
  const cMg = alkChip(bkHud, 'magnesium (Mg)', { size: 30, stroke: '#FFA36B' });
  const cCa = alkChip(bkHud, 'calcium (Ca)', { size: 30, stroke: '#FFA36B' });
  const lMg = E('path', { d: '', stroke: '#FFA36B', 'stroke-width': 4 }, bkHud), lCa = E('path', { d: '', stroke: '#FFA36B', 'stroke-width': 4 }, bkHud);

  /* =====================================================================
     LINE-UP: the three alkali metals against a height chart
     ===================================================================== */
  const gLine = G(root);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#3B4556', '#262D3A', true) }, gLine);
  { let d = ''; for (let y = 170; y <= 530; y += 60) d += `M50,${y} L1150,${y} `; E('path', { d, stroke: '#8A97AA', 'stroke-width': 3, opacity: 0.45 }, gLine); }
  E('rect', { x: 0, y: 560, width: 1200, height: 190, fill: linGrad('#4A4F5A', '#30343C', true) }, gLine);
  const lnSign = alkChip(gLine, 'GROUP 1 LINE-UP', { size: 34, fill: '#F2E8C8', stroke: SC_INK, color: SC_INK });
  tr(lnSign, 860, 120);
  const lnW = [G(gLine), G(gLine), G(gLine)];   // Li, Na, K
  const lnNames = [['lithium (Li)', '#FF6B7E'], ['sodium (Na)', '#FFB52E'], ['potassium (K)', '#B98CFF']].map(([s, c]) => alkChip(gLine, s, { size: 32, stroke: c }));
  const lnLost = alkChip(gLine, 'outer electron LOST more easily', { size: 36, stroke: C.energy, color: C.energy });
  const flyE = alkE(gLine, 16);
  const bonk = G(gLine);
  { let d = ''; for (let i = 0; i < 16; i++) { const a = i * TAU / 16, r = i % 2 ? 60 : 120; d += (i ? 'L' : 'M') + (Math.cos(a) * r).toFixed(1) + ',' + (Math.sin(a) * r).toFixed(1); }
    E('path', { d: d + 'Z', fill: C.energy, stroke: '#C98A00', 'stroke-width': 5, 'stroke-linejoin': 'round' }, bonk);
    T(bonk, 0, 16, 'BONK!', { size: 46, weight: 800, anchor: 'middle', fill: '#7A2A00' }); }

  /* =====================================================================
     OIL: Sonny's flat, everything under oil
     ===================================================================== */
  const gOil = G(root);
  const oilCam = G(gOil);
  const oilBg = bkOilFlat(oilCam);
  const oSilW = G(oilCam), oSonW = G(oilCam);
  const gog = G(oSilW);   // Silas's diving goggles and snorkel (drawn over his cap)
  E('path', { d: 'M-70,-104 L70,-104', stroke: '#1E2A33', 'stroke-width': 7 }, gog);
  [-26, 26].forEach(x => E('ellipse', { cx: x, cy: -106, rx: 22, ry: 16, fill: 'rgba(170,225,255,0.85)', stroke: '#1E2A33', 'stroke-width': 5 }, gog));
  E('path', { d: 'M70,-104 Q86,-110 86,-140 L86,-196', fill: 'none', stroke: '#FF7A1A', 'stroke-width': 12, 'stroke-linecap': 'round' }, gog);
  E('path', { d: 'M86,-196 L86,-200', stroke: '#1E2A33', 'stroke-width': 14, 'stroke-linecap': 'round' }, gog);
  const knifeS = G(oilCam);   // the butter knife Sonny offers / Silas holds away
  E('path', { d: 'M0,-8 L120,-10 Q150,-2 120,8 L0,6 Z', fill: '#E3E8EE', stroke: '#4E5966', 'stroke-width': 3, 'stroke-linejoin': 'round' }, knifeS);
  E('rect', { x: -78, y: -11, width: 80, height: 22, rx: 10, fill: '#C97B3A', stroke: SC_INK, 'stroke-width': 3 }, knifeS);
  const oilHud = G(gOil);
  const cAir = alkChip(oilHud, 'reacts with OXYGEN and WATER in air', { size: 32, stroke: '#FF8A3D' });
  const cOil = alkChip(oilHud, 'so: STORED UNDER OIL', { size: 42, fill: '#5A3008', stroke: C.energy, color: C.energy });
  // inset: a lump of sodium being cut
  const inset = G(oilHud);
  E('rect', { x: -200, y: -120, width: 400, height: 250, rx: 18, fill: 'rgba(14,26,36,0.92)', stroke: '#FFB52E', 'stroke-width': 4 }, inset);
  T(inset, 0, -76, 'SOFT: cuts with a knife', { size: 30, weight: 800, anchor: 'middle', fill: '#FFB52E' });
  E('path', { d: 'M-130,-20 L0,-20 L0,70 L-130,70 Z M-130,-20 L-110,-36 L20,-36 L0,-20', fill: '#8C9198', stroke: '#4E5966', 'stroke-width': 3, 'stroke-linejoin': 'round' }, inset);
  const slice = G(inset);
  E('path', { d: 'M0,-20 L90,-20 L90,70 L0,70 Z M0,-20 L20,-36 L110,-36 L90,-20 Z M90,-20 L110,-36 L110,54 L90,70 Z', fill: '#8C9198', stroke: '#4E5966', 'stroke-width': 3, 'stroke-linejoin': 'round' }, slice);
  const face = G(inset);
  E('path', { d: 'M0,-20 L20,-36 L20,54 L0,70 Z', fill: linGrad('#FFFFFF', '#AEB8C4'), stroke: '#4E5966', 'stroke-width': 3, 'stroke-linejoin': 'round' }, face);
  E('path', { d: 'M6,-10 L14,-18 M6,10 L14,2', stroke: '#FFFFFF', 'stroke-width': 3, 'stroke-linecap': 'round' }, face);
  const shinyT = T(inset, 0, 112, 'shiny inside!', { size: 26, weight: 700, anchor: 'middle', fill: '#E3E8EE', font: FB });
  const inKnife = G(inset);
  E('path', { d: 'M-6,0 L-8,-100 Q0,-118 8,-100 L6,0 Z', fill: '#E3E8EE', stroke: '#4E5966', 'stroke-width': 3 }, inKnife);
  E('rect', { x: -10, y: -170, width: 20, height: 70, rx: 9, fill: '#C97B3A', stroke: SC_INK, 'stroke-width': 3 }, inKnife);

  /* =====================================================================
     FLOAT: all three bob on a tank of water
     ===================================================================== */
  const gFloat = G(root);
  alkLab(gFloat);
  const tank = beaker(gFloat, 820, 300, { level: 0.62, liquid: C.water, marks: false }); tr(tank, 600, 470);
  const flW = [G(gFloat), G(gFloat), G(gFloat)];
  E('rect', { x: 192, y: 446, width: 816, height: 168, fill: C.water, opacity: 0.32 }, gFloat);   // water in front of their bottoms
  const cFloat = alkChip(gFloat, 'they FLOAT on water', { size: 44, stroke: C.water, color: '#FFFFFF' });
  const cDense = alkChip(gFloat, 'less dense than water', { size: 30 });

  /* =====================================================================
     WET: "Did somebody say... WATER?!"
     ===================================================================== */
  const gWet = G(root);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#4CC9F0', '#1D6E99', true) }, gWet);
  const rays = G(gWet); tr(rays, 600, 400);
  { let d = ''; for (let i = 0; i < 14; i++) { const a = i * TAU / 14, b = a + TAU / 28; d += `M0,0 L${(Math.cos(a) * 900).toFixed(0)},${(Math.sin(a) * 900).toFixed(0)} L${(Math.cos(b) * 900).toFixed(0)},${(Math.sin(b) * 900).toFixed(0)} Z `; }
    E('path', { d, fill: '#FFFFFF', opacity: 0.16 }, rays); }
  const wetW = G(gWet);
  const speedL = G(gWet);
  E('path', { d: 'M180,250 L300,290 M150,400 L290,400 M180,550 L300,510 M1020,250 L900,290 M1050,400 L910,400 M1020,550 L900,510', stroke: '#FFFFFF', 'stroke-width': 9, 'stroke-linecap': 'round', opacity: 0.8 }, speedL);

  /* =====================================================================
     TROUGH: the three reactions behind the safety screen
     ===================================================================== */
  const gTr = G(root);
  alkLab(gTr);
  const trSilW = G(gTr);
  const clip = scClipboard(trSilW, 0.42); tr(clip, 58, 30, 0.42);
  const trough = bkTrough(gTr); tr(trough, 680, 455, 1.25);
  const trIn = G(trough); trough.insertBefore(trIn, trough.screen);     // between the water and the safety screen
    const trail = []; for (let i = 0; i < 9; i++) trail.push(E('circle', { r: 7 - i * 0.5, fill: 'rgba(255,255,255,0.25)', stroke: 'rgba(255,255,255,0.85)', 'stroke-width': 2 }, trIn));
  const fizzLi = bubbles(trIn, -206, -118, 70, 78, { n: 7, r: 5, speed: 0.55, seed: 4 });
  const zipLines = E('path', { d: '', stroke: '#FFFFFF', 'stroke-width': 5, 'stroke-linecap': 'round', opacity: 0.85 }, trIn);
  const flameW = G(trIn);
  const trLiW = G(trIn), trSonW = G(trIn), trKW = G(trIn);
  E('ellipse', { cx: 0, cy: -60, rx: 110, ry: 120, fill: glow('#C9A4FF'), opacity: 0.7 }, flameW);
  bkFlame(flameW, 170, 200, '#B98CFF', '#F3E8FF');
  E('rect', { x: -258, y: -38, width: 516, height: 146, fill: C.water, opacity: 0.3 }, trIn);    // water in front
  const trHarW = G(gTr);
  const trHud = G(gTr);
  const cLi = alkChip(trHud, 'LITHIUM: fizzes gently', { size: 34, stroke: '#FF6B7E' });
  const cNa = alkChip(trHud, 'SODIUM: melts into a ball, whizzes around', { size: 32, stroke: '#FFB52E' });
  const cK = alkChip(trHud, 'POTASSIUM: hydrogen burns, LILAC flame', { size: 32, stroke: '#B98CFF', color: '#E6D4FF' });
  const cH2 = alkChip(trHud, 'hydrogen gas, H_2', { size: 34, stroke: '#FFFFFF' });

  /* =====================================================================
     BOARD: the word equation and universal indicator
     ===================================================================== */
  const gBoard = G(root);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#2E3B4A', '#1C2631', true) }, gBoard);
  E('rect', { x: 0, y: 640, width: 1200, height: 110, fill: '#3A3226' }, gBoard);
  E('rect', { x: 340, y: 116, width: 820, height: 362, rx: 12, fill: '#FFFFFF', stroke: '#9AA6B2', 'stroke-width': 10 }, gBoard);
  E('rect', { x: 360, y: 478, width: 780, height: 14, rx: 5, fill: '#9AA6B2' }, gBoard);
  const eq1 = alkRow(gBoard, 750, 236, [['sodium', '#3F5BD9'], ['+', '#24324F'], ['water', '#1D84A6']], 46);
  const eq2 = alkRow(gBoard, 750, 326, [['→', '#24324F'], ['sodium hydroxide', '#7A3FC4'], ['+', '#24324F'], ['hydrogen', '#5C6B7A']], 46);
  const eqUx = +eq2[1].getAttribute('x'), eqUw = textWidth('sodium hydroxide', 46, FD, 800) / 2;
  const eqU = E('path', { d: `M${eqUx - eqUw},348 L${eqUx + eqUw},348`, stroke: '#7A3FC4', 'stroke-width': 6, 'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': '1 1' }, gBoard);
  const eqNote = T(gBoard, 750, 420, 'makes the water ALKALINE', { size: 34, weight: 800, anchor: 'middle', fill: '#7A3FC4' });
  const bSilW = G(gBoard);
  const pointer = E('path', { d: 'M250,500 L420,330', stroke: '#8A5A3A', 'stroke-width': 8, 'stroke-linecap': 'round' }, gBoard);
  const ind = beaker(gBoard, 130, 150, { level: 0.7, liquid: '#5BD27A' }); tr(ind, 470, 580);
  const pH = G(gBoard);
  { const id = 'alkUI', lg = E('linearGradient', { id, x1: 0, x2: 1, y1: 0, y2: 0 }, defs());
    ['#E8424F', '#FF8A3D', '#FFE45C', '#5BD27A', '#2E9BD8', '#3F5BD9', '#7A3FC4'].forEach((c, i) => E('stop', { offset: i / 6, 'stop-color': c }, lg));
    E('rect', { x: 600, y: 560, width: 520, height: 44, rx: 8, fill: `url(#${id})`, stroke: '#FFFFFF', 'stroke-width': 3 }, pH);
    T(pH, 612, 640, 'pH 1', { size: 26, weight: 700, fill: C.muted }); T(pH, 860, 640, '7', { size: 26, weight: 700, anchor: 'middle', fill: C.muted }); T(pH, 1120, 640, '14', { size: 26, weight: 700, anchor: 'end', fill: C.muted }); }
  const pHarrow = G(pH);
  E('path', { d: 'M0,0 L-16,-26 L16,-26 Z', fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 3, 'stroke-linejoin': 'round' }, pHarrow);
  const cAlk = alkChip(gBoard, 'ALKALINE', { size: 40, fill: '#7A3FC4', stroke: '#E6D4FF', color: '#FFFFFF' });

  /* =====================================================================
     TREND: reactivity increases down Group 1
     ===================================================================== */
  const gTrend = G(root);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#14243A', '#0B1626', true) }, gTrend);
  const tdW = [G(gTrend), G(gTrend), G(gTrend)];
  const TDY = [210, 390, 580];
  const tdRow = TDY.map(y => { const g = G(gTrend); E('rect', { x: 110, y: y - 80, width: 400, height: 160, rx: 22, fill: 'rgba(255,255,255,0.06)', stroke: C.line, 'stroke-width': 2 }, g); return g; });
  const tdFizz = bubbles(tdRow[0], 390, 150, 60, 100, { n: 6, r: 7, speed: 0.6, seed: 9 });
  const tdZip = G(tdRow[1]);
  E('circle', { r: 20, fill: ball('#EEF2F6', '#7D8995'), stroke: '#4E5966', 'stroke-width': 3 }, tdZip);
  E('path', { d: 'M-36,-10 L-70,-10 M-34,6 L-80,6', stroke: '#FFFFFF', 'stroke-width': 5, 'stroke-linecap': 'round' }, tdZip);
  const tdFlW = G(tdRow[2]); bkFlame(tdFlW, 80, 110, '#B98CFF', '#F3E8FF');
  const tdArrow = arrow(gTrend, 640, 160, 640, 640, { color: '#FF6B6B', width: 24, head: 62 });
  const tdT1 = T(gTrend, 900, 330, 'REACTIVITY', { size: 58, weight: 800, anchor: 'middle', fill: C.energy });
  const tdT2 = T(gTrend, 900, 402, 'INCREASES', { size: 58, weight: 800, anchor: 'middle', fill: '#FF6B6B' });
  const tdT3 = T(gTrend, 900, 470, 'going DOWN Group 1', { size: 34, weight: 700, anchor: 'middle', fill: C.ink });

  /* =====================================================================
     BED: Kavya at her desk, 11 pm
     ===================================================================== */
  const gBed = G(root);
  bkBedroom(gBed);
  const bedPost = G(gBed);    // the poster on her wall (the same block, in poster look)
  const bedKW = G(gBed);
  E('rect', { x: 0, y: 690, width: 1200, height: 60, fill: linGrad('#7A4E31', '#4E301C', true) }, gBed);
  const qs = [[400, 330, 92, 12], [250, 300, 70, -10], [330, 230, 60, 6]].map(([x, y, s, r]) => { const g = G(gBed); T(g, 0, s * 0.35, '?', { size: s, weight: 800, anchor: 'middle', fill: C.energy }); g.xy = [x, y, r]; return g; });
  const bedNote = G(gBed);
  E('rect', { x: -150, y: -50, width: 300, height: 100, fill: '#FFF176', stroke: '#C9B13A', 'stroke-width': 2 }, bedNote);
  T(bedNote, 0, -8, 'bigger = MORE', { size: 30, weight: 800, anchor: 'middle', fill: '#C62828' });
  T(bedNote, 0, 30, 'reactive??', { size: 30, weight: 800, anchor: 'middle', fill: '#C62828' });

  /* =====================================================================
     ATOMS: bigger atoms, then shielding (one shot; the camera moves in on potassium)
     ===================================================================== */
  const gAt = G(root);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#14243A', '#0B1626', true) }, gAt);
  const shieldW = G(gAt);
  const aLi = alkAtom(gAt, [2, 1]), aNa = alkAtom(gAt, [2, 8, 1]), aK = alkAtom(gAt, [2, 8, 8, 1]);
  const shield = E('circle', { r: 44, fill: 'none', stroke: '#B8C2CC', 'stroke-width': 56, opacity: 0.45 }, aK);
  aK.insertBefore(shield, aK.children[1]);
  const pull = E('path', { d: 'M0,-17 L0,-74', stroke: '#FF7A6B', 'stroke-width': 10, 'stroke-linecap': 'round' }, aK);
  const pullHead = E('path', { d: 'M0,-18 L-9,-4 L9,-4 Z', fill: '#FF7A6B' }, aK);
  const atLbl = [['Li: 2, 1', 250], ['Na: 2, 8, 1', 560], ['K: 2, 8, 8, 1', 900]].map(([s, x]) => { const el = T(gAt, x, 570, s, { size: 34, weight: 800, anchor: 'middle', fill: C.ink }); return el; });
  const rulers = [aLi, aNa, aK].map(a => E('path', { d: '', stroke: C.energy, 'stroke-width': 4, 'stroke-linecap': 'round' }, a));
  const cBig = alkChip(gAt, 'going down: atoms get BIGGER', { size: 36, stroke: C.energy });
  const cFar = alkChip(gAt, 'outer electron FURTHER from the nucleus', { size: 34, stroke: C.energy, color: C.energy });
  const cShield = alkChip(gAt, 'SHIELDING', { size: 52, fill: '#3A4552', stroke: '#B8C2CC', color: '#FFFFFF' });
  const cIn = T(gAt, 930, 300, 'inner shells get in the way', { size: 30, weight: 700, anchor: 'middle', fill: '#D6DEE6' });
  const cWeak = T(gAt, 930, 352, 'weaker pull on the outer electron', { size: 30, weight: 700, anchor: 'middle', fill: '#FF9A8F' });
  const cPull = alkChip(gAt, 'pull', { size: 28, stroke: '#FF7A6B', color: '#FF9A8F' });
  const atSilW = G(gAt);

  /* =====================================================================
     CALCIUM: Group 2 in a beaker; Sonny is not impressed
     ===================================================================== */
  const gCa = G(root);
  alkLab(gCa);
  const caB = beaker(gCa, 240, 280, { level: 0.7, liquid: C.water }); tr(caB, 500, 470);
  const caFizz = bubbles(gCa, 470, 440, 60, 140, { n: 9, r: 6, speed: 0.4, seed: 21 });
  const lump = G(gCa); tr(lump, 500, 586);
  E('rect', { x: -38, y: -24, width: 76, height: 44, rx: 12, fill: ball('#E3E8EE', '#8C9198'), stroke: '#4E5966', 'stroke-width': 3 }, lump);
  T(lump, 0, 9, 'Ca', { size: 26, weight: 800, anchor: 'middle', fill: SC_INK });
  const caSonW = G(gCa);
  const cSteady = alkChip(gCa, 'calcium + cold water: a steady fizz', { size: 32, stroke: '#FFA36B' });
  const cLess = alkChip(gCa, 'reactive, but LESS than Group 1', { size: 34, stroke: '#FFA36B', color: '#FFD3B0' });

  const SHOTS = { block: gBlock, line: gLine, oil: gOil, float: gFloat, wet: gWet, trough: gTr, board: gBoard, trend: gTrend, bed: gBed, atoms: gAt, calcium: gCa };

  return t => {
    const [c0, shot, setup] = cutAt(t);
    for (const k in SHOTS) op(SHOTS[k], k === shot ? 1 : 0);
    const u = t - Math.max(c0, 0);
    const bob = (ph, a) => Math.sin(t * 2 + ph) * (a || 5) * AMP;

    /* ---------------- BLOCK ---------------- */
    if (shot === 'block') {
      alkSeat(BLK, blkW); BLK.look(1);
      ['alkali', 'alkaline'].forEach(k => op(BLK.layers[k], 0));
      op(BLK.stacks[1], 0); op(BLK.stacks[2], 0);
      [cG1, cG2, cMg, cCa, lMg, lCa].forEach(e => op(e, 0));
      if (setup === 'meet') {
        const z = P(t, S.first + 0.3, 1.8, ease);
        tr(BLK, lerp(600, 998, z), lerp(430, 420, z), lerp(0.95, 1.55, z));
        const lit = P(t, mid('meet', 0.12), 0.4, linear);
        op(BLK.layers.alkali, 0.9 * lit); op(BLK.stacks[1], lit);
        alkShow(cG1, t, mid('meet', 0.18), undefined, 790, 126);
      } else {
        tr(BLK, 951, 420, 1.55);
        op(BLK.layers.alkali, 0.35);
        const lit = P(t, at('group2') + 0.1, 0.4, linear);
        op(BLK.layers.alkaline, 0.9 * lit); op(BLK.stacks[2], lit);
        alkShow(cG2, t, mid('group2', 0.04), undefined, 800, 126);
        const pm = P(t, mid('group2', 0.2), 0.4, linear), pc = P(t, mid('group2', 0.3), 0.4, linear);
        alkShow(cMg, t, mid('group2', 0.2), undefined, 680, 343);
        alkShow(cCa, t, mid('group2', 0.3), undefined, 680, 420);
        op(lMg, pm); attr(lMg, 'd', `M330,343 L${lerp(330, 560, pm).toFixed(0)},343`);
        op(lCa, pc); attr(lCa, 'd', `M330,420 L${lerp(330, 580, pc).toFixed(0)},420`);
      }
    }

    /* ---------------- LINE-UP ---------------- */
    if (shot === 'line') {
      [LI, SON, KK].forEach((c, i) => alkSeat(c, lnW[i]));
      op(LI, 1); op(SON, 1); op(KK, 1);
      if (setup === 'meet') {
        op(lnLost, 0); op(flyE, 0); op(bonk, 0); op(KK.electron, 1);
        const T0 = [mid('meet', 0.52), mid('meet', 0.68), mid('meet', 0.84)];
        const X = [300, 600, 900], Y = [440, 430, 420];
        [LI, SON, KK].forEach((c, i) => {
          const hop = Math.sin(clamp((t - T0[i]) / 0.35) * Math.PI) * 26;
          tr(lnW[i], X[i], Y[i] - hop);
          c.set({ t, mood: ['neutral', 'happy', 'smug'][i], look: 0 });
          alkShow(lnNames[i], t, T0[i], undefined, X[i], 630);
        });
        op(lnSign, 1);
      } else {
        lnNames.forEach(e => op(e, 0)); op(lnSign, 0);
        const tF = mid('lost', 0.55);
        const fp = P(t, tF, 0.5, easeIn), gone = t > tF;
        tr(lnW[0], 170, 440); tr(lnW[1], 970, 430 + bob(1, 4)); tr(lnW[2], 440, 420);
        const laughing = t > tF + 0.4;
        tr(SON, 0, 0, 1, laughing ? 6 * Math.sin(t * 16) * AMP : 0);
        SON.set({ t, talk: talk(t, 'sonny'), mood: 'happy', look: -0.8 });
        LI.set({ t, mood: t > tF + 0.35 ? 'shock' : 'neutral', look: 0.7 });
        KK.set({ t, mood: 'smug', look: gone ? 0 : 0.5 });
        op(KK.electron, gone ? 0 : 1);
        alkShow(lnLost, t, mid('lost', 0.08), undefined, 640, 140);
        op(flyE, gone && fp < 1 ? 1 : 0);
        if (gone) tr(flyE, lerp(580, 700, fp), lerp(400, 350, fp), 1 + 9 * fp);
        const bp = P(t, tF + 0.5, 0.35, pop);
        op(bonk, t > tF + 0.5 ? clamp(bp * 3) * (1 - P(t, end('lost') + 0.25, 0.2, linear)) : 0);
        if (bp > 0) tr(bonk, 705, 345, Math.max(0.01, 0.35 + 0.5 * bp), -8);
      }
    }

    /* ---------------- OIL ---------------- */
    if (shot === 'oil') {
      oilBg.upd(t);
      alkSeat(SIL, oSilW, 1.15); alkSeat(SON, oSonW, 1.2); op(SIL, 1); op(SON, 1);
      if (oSilW.lastChild !== gog) oSilW.appendChild(gog);
      tr(gog, 0, 0, 1.15);
      let k = 1, cx = 600, cy = 400;
      if (t >= at('soft') - 0.08 && t < at('cut') - 0.08) { k = 1 + 0.05 * P(t, at('soft'), 2.5, linear); cx = 880; cy = 470; }
      if (t >= at('cut') - 0.08) { k = 1.08 + 0.12 * P(t, at('cut'), 2.2, ease); cx = 300; cy = 430; }
      alkCam(oilCam, cx, cy, k);
      tr(oSilW, 300, 480 + bob(0, 3));
      tr(oSonW, 880, 470 + bob(1, 10));
      const cutting = t >= at('cut') - 0.08;
      SIL.set({ t, talk: talk(t, 'silas'), mood: 'deadpan', look: cutting ? (t > end('cut') ? 0 : 0.5) : 0.6 });
      SON.set({ t, talk: talk(t, 'sonny'), mood: cutting && t > end('cut') + 0.15 ? 'sad' : 'happy', look: -0.7 });
      alkShow(cAir, t, mid('oil', 0.25), at('soft') - 0.3, 640, 150);
      alkShow(cOil, t, mid('oil', 0.7), at('soft') - 0.3, 640, 228);
      // the inset: a knife slices the lump; the fresh face is shiny
      const ins = t >= at('soft') - 0.08 && t < at('cut') - 0.08;
      op(inset, ins ? 1 : 0);
      if (ins) {
        alkShow(inset, t, at('soft'), undefined, 650, 245);
        const kc = P(t, mid('soft', 0.2), 0.6, ease), sp = P(t, mid('soft', 0.2) + 0.6, 0.4, easeOut);
        tr(inKnife, 0, lerp(-40, 80, kc)); op(inKnife, 1 - P(t, mid('soft', 0.2) + 0.7, 0.2, linear));
        tr(slice, 26 * sp, 6 * sp, 1, 7 * sp); op(face, sp); tr(face, 0, 0); op(shinyT, sp);
      }
      // the knife: Sonny holds it out ("Go on!"), then it is in Silas's hand, as far away as his arm goes
      if (t < at('cut') - 0.08) {
        const kp = P(t, mid('soft', 0.62), 0.35, pop);
        op(knifeS, clamp(kp * 3) * (t > at('soft') ? 1 : 0)); tr(knifeS, 760, 520 + bob(1, 10), Math.max(0.01, kp), 180);
      } else {
        op(knifeS, 1); tr(knifeS, 160 + bob(0, 2), 420, 0.9, -150);
      }
    }

    /* ---------------- FLOAT ---------------- */
    if (shot === 'float') {
      [LI, SON, KK].forEach((c, i) => { alkSeat(c, flW[i], 0.75); op(c, 1); });
      [[360, 428], [600, 423], [840, 419]].forEach(([x, y], i) => tr(flW[i], x + 6 * Math.sin(t * 0.9 + i) * AMP, y + bob(i * 1.7, 5)));
      const keen = t > mid('float', 0.7);
      LI.set({ t, mood: 'happy', look: 0.2 }); KK.set({ t, mood: 'happy', look: -0.2 });
      SON.set({ t, mood: keen ? 'shock' : 'happy', look: keen ? 0 : 0.3 });
      alkShow(cFloat, t, mid('float', 0.3), undefined, 600, 160);
      alkShow(cDense, t, mid('float', 0.55), undefined, 600, 236);
    }

    /* ---------------- WET ---------------- */
    if (shot === 'wet') {
      alkSeat(SON, wetW, 1.9); op(SON, 1);
      const shake = Math.sin(t * 60) * 4 * AMP;
      tr(wetW, 600 + shake, 430);
      SON.set({ t, talk: talk(t, 'sonny'), mood: 'shock', look: 0 });
      alkOrbit(SON, 84, t, 7);
      tr(rays, 600, 400, 1, (t * 20 * AMP) % 360);
      const zp = P(t, at('water') - 0.08, 0.25, easeOut);
      op(speedL, zp * 0.9); speedL.setAttribute('transform', `translate(600 400) scale(${(1.3 - 0.3 * zp).toFixed(3)}) translate(-600 -400)`);
    }

    /* ---------------- TROUGH ---------------- */
    if (shot === 'trough') {
      alkSeat(SIL, trSilW, 0.62); op(SIL, 1);
      alkSeat(LI, trLiW, 0.6); alkSeat(SON, trSonW, 0.56); alkSeat(KK, trKW, 0.56);
      tr(trSilW, 150, 540);
      const kBoom = mid('k', 0.5), boom = t > kBoom;
      const SY = -40;   // water surface (trough local)
      // lithium: on the left the whole time, fizzing gently
      op(LI, 1); tr(trLiW, -205, SY - 14 + Math.sin(t * 2) * 2 * AMP);
      fizzLi.upd(t, 0.8);
      // sodium: drops in, whizzes right, then WHEEE back left
      const naIn = at('na') + 0.1, z1 = mid('na', 0.3), z2 = mid('na', 0.92), w1 = at('whee') - 0.05, w2 = end('whee') + 0.35;
      const naX = tt => tt < z1 ? -70 : tt < z2 ? lerp(-70, 190, ease(clamp((tt - z1) / (z2 - z1)))) : tt < w1 ? 190 + 4 * Math.sin(tt * 9) : lerp(190, -40, easeOut(clamp((tt - w1) / (w2 - w1))));
      const naOn = t > naIn - 0.3;
      op(SON, naOn ? 1 : 0);
      const drop = 1 - P(t, naIn - 0.3, 0.35, easeIn);
      const zipping = (t > z1 && t < z2) || (t > w1 && t < w2);
      const melt = P(t, naIn + 0.1, 0.5, ease);
      trSonW.setAttribute('transform', `translate(${naX(t).toFixed(1)} ${(SY - 14 - 220 * drop + (zipping ? 0 : Math.sin(t * 2.4) * 2 * AMP)).toFixed(1)}) scale(${(1 + 0.08 * melt).toFixed(3)} ${(1 - 0.1 * melt).toFixed(3)})`);
      trail.forEach((c, i) => {
        const tt = t - (i + 1) * 0.07, on = naOn && zipping && tt > z1;
        op(c, on ? 0.9 - i * 0.09 : 0); attr(c, 'cx', naX(tt)); attr(c, 'cy', SY - 4 - (i % 2) * 6);
      });
      const back = t > w1 && t < w2;
      if (zipping) { const x = naX(t), dir = back ? 1 : -1; attr(zipLines, 'd', `M${x + dir * 50},${SY - 30} l${dir * 60},0 M${x + dir * 56},${SY - 12} l${dir * 80},0 M${x + dir * 50},${SY + 6} l${dir * 56},0`); op(zipLines, 1); }
      else op(zipLines, 0);
      // potassium: drops in, then the hydrogen catches fire: lilac flame
      const kIn = at('k') + 0.1, kOn = t > kIn - 0.3;
      op(KK, kOn ? 1 : 0);
      const kd = 1 - P(t, kIn - 0.3, 0.35, easeIn);
      tr(trKW, 150, SY - 18 - 220 * kd + Math.sin(t * 2.6) * 2 * AMP);
      const fp = P(t, kBoom, 0.35, pop), calm = t > at('hydrogen') ? 0.6 : 1;
      op(flameW, boom ? clamp(fp * 3) : 0);
      flameW.setAttribute('transform', `translate(150 ${SY}) scale(${(Math.max(0.01, fp) * calm * (1 + 0.06 * Math.sin(t * 17) * AMP)).toFixed(3)} ${(Math.max(0.01, fp) * calm * (1 + 0.1 * Math.sin(t * 13 + 1) * AMP)).toFixed(3)})`);
      // Harold rises out of the fizz
      const hp = P(t, at('hydrogen') - 0.1, 1.4, easeOut);
      const harOn = t > at('hydrogen') - 0.1;
      if (harOn) { alkSeat(HAR, trHarW, 0.85); op(HAR, 1); tr(trHarW, 1000, lerp(420, 250, hp)); op(trHarW, clamp(hp * 3)); HAR.set({ t, talk: talk(t, 'harold'), mood: 'sad', look: -0.3 }); }
      else op(trHarW, 0);
      // reactions
      const shock = boom && t < at('hydrogen');
      const lookH = harOn ? 0.6 : 0;
      LI.set({ t, mood: shock ? 'shock' : 'deadpan', look: harOn ? 0.8 : naOn ? 0.5 : 0 });
      SON.set({ t, talk: talk(t, 'sonny'), mood: shock ? 'shock' : back ? 'shock' : 'happy', look: back ? -0.8 : harOn ? 0.6 : 0.6 });
      KK.set({ t, mood: shock ? 'happy' : harOn ? 'neutral' : 'smug', look: lookH });
      SIL.set({ t, mood: shock ? 'shock' : 'deadpan', look: harOn ? 0.8 : 0.4 });
      // chips
      alkShow(cLi, t, mid('li', 0.15), at('na') - 0.1, 680, 122);
      alkShow(cNa, t, mid('na', 0.2), at('k') - 0.1, 680, 122);
      alkShow(cK, t, mid('k', 0.62), at('hydrogen') - 0.1, 680, 122);
      alkShow(cH2, t, mid('hydrogen', 0.3), undefined, 680, 122);
    } else { op(trHarW, 0); }

    /* ---------------- BOARD ---------------- */
    if (shot === 'board') {
      alkSeat(SIL, bSilW, 1.15); op(SIL, 1);
      tr(bSilW, 170, 545);
      SIL.set({ t, talk: talk(t, 'silas'), mood: 'deadpan', look: t < mid('equation', 0.5) ? 0.8 : 0.4 });
      const F = [0.02, 0.07, 0.1, 0.2, 0.25, 0.36, 0.4];
      [...eq1, ...eq2].forEach((el, i) => op(el, P(t, mid('equation', F[i]), 0.3, linear)));
      const up = P(t, mid('equation', 0.55), 0.5, ease);
      attr(eqU, 'stroke-dashoffset', 1 - up); op(eqU, up > 0 ? 1 : 0);
      op(eqNote, P(t, mid('equation', 0.62), 0.35, linear));
      const purple = P(t, mid('equation', 0.66), 0.8, ease);
      const mix = (a, b, p) => { const h = s => [1, 3, 5].map(i => parseInt(s.substr(i, 2), 16)); const A = h(a), B = h(b); return `rgb(${A.map((v, i) => Math.round(lerp(v, B[i], p))).join(',')})`; };
      ind.set(0.7, mix('#5BD27A', '#7A3FC4', purple));
      tr(pHarrow, lerp(860, 1090, purple), 552);
      op(pH, P(t, mid('equation', 0.6), 0.3, linear));
      alkShow(cAlk, t, mid('equation', 0.8), undefined, 860, 690);
      tr(pointer, 0, 0, 1, Math.sin(t * 2) * 2 * AMP);
    }

    /* ---------------- TREND ---------------- */
    if (shot === 'trend') {
      [LI, SON, KK].forEach((c, i) => { alkSeat(c, tdW[i], [0.62, 0.56, 0.54][i]); op(c, 1); });
      [0, 1, 2].forEach(i => {
        const p = P(t, at('trend') + i * 0.18, 0.4, pop);
        op(tdRow[i], clamp(p * 2.5)); op(tdW[i], clamp(p * 2.5));
        tr(tdW[i], 230, TDY[i] + bob(i, 3));
      });
      [LI, SON, KK].forEach((c, i) => c.set({ t, mood: ['neutral', 'happy', 'smug'][i], look: 0.5 }));
      tdFizz.upd(t, 0.8);
      tr(tdZip, 440 + 26 * Math.sin(t * 5) * AMP, 390);
      tdFlW.setAttribute('transform', `translate(430 ${TDY[2] + 50}) scale(${(1 + 0.06 * Math.sin(t * 17) * AMP).toFixed(3)} ${(1 + 0.1 * Math.sin(t * 13) * AMP).toFixed(3)})`);
      tdArrow.set(P(t, mid('trend', 0.25), 1.2, ease));
      op(tdT1, P(t, mid('trend', 0.2), 0.3, linear));
      const ip = P(t, mid('trend', 0.36), 0.4, pop);
      op(tdT2, clamp(ip * 3)); tdT2.setAttribute('transform', `translate(900 380) scale(${Math.max(0.01, 0.6 + 0.4 * ip).toFixed(3)}) translate(-900 -380)`);
      op(tdT3, P(t, mid('trend', 0.6), 0.3, linear));
    }

    /* ---------------- BED ---------------- */
    if (shot === 'bed') {
      alkSeat(BLK, bedPost); tr(BLK, BK_POSTER.x, BK_POSTER.y, BK_POSTER.s); BLK.look(0);
      ['alkali', 'alkaline'].forEach(k => op(BLK.layers[k], 0)); op(BLK.stacks[2], 0);
      op(BLK.stacks[1], 0.8);
      alkSeat(KAV, bedKW, 1.25); op(KAV, 1);
      tr(bedKW, 330, 548);
      const done = t > end('why') + 0.05;
      KAV.set({ t, talk: talk(t, 'kavya'), mood: done ? 'deadpan' : 'annoyed', look: done ? 0 : 0.6 });
      qs.forEach((q, i) => { const [x, y, r] = q.xy; alkShow(q, t, mid('why', 0.3 + i * 0.18), undefined, x, y + Math.sin(t * 3 + i) * 4 * AMP, 1, r); });
      alkShow(bedNote, t, mid('why', 0.15), undefined, 860, 520, 1, -4);
    }

    /* ---------------- ATOMS ---------------- */
    if (shot === 'atoms') {
      alkSeat(SIL, atSilW, 1); op(SIL, 1);
      const zm = P(t, at('shield') - 0.1, 0.8, ease);           // the camera moves in on potassium
      const ap = [0, 1, 2].map(i => P(t, mid('bigger', 0.04 + i * 0.13), 0.45, pop));
      const fade = 1 - P(t, at('shield') - 0.1, 0.35, linear);
      op(aLi, clamp(ap[0] * 2.5) * fade); tr(aLi, 250, 400, Math.max(0.01, 1.25 * ap[0]));
      op(aNa, clamp(ap[1] * 2.5) * fade); tr(aNa, 560, 400, Math.max(0.01, 1.25 * ap[1]));
      op(aK, clamp(ap[2] * 2.5)); tr(aK, lerp(900, 470, zm), lerp(400, 400, zm), Math.max(0.01, lerp(1.25, 2.05, zm) * (zm > 0 ? 1 : ap[2])));
      atLbl.forEach((el, i) => op(el, clamp(ap[i] * 2) * (i === 2 ? 1 - P(t, at('shield') - 0.1, 0.3, linear) : fade)));
      // rulers from the nucleus to the outer electron
      const rp = P(t, mid('bigger', 0.55), 0.7, ease);
      [aLi, aNa, aK].forEach((a, i) => {
        const R = a.R([1, 2, 3][i]) - 8;
        op(rulers[i], rp > 0 && (i === 2 ? zm < 0.05 : true) ? 1 : 0);
        attr(rulers[i], 'd', `M-8,-14 L8,-14 M0,-14 L0,${(-14 - (R - 14) * rp).toFixed(1)} M-8,${(-14 - (R - 14) * rp).toFixed(1)} l16,0`);
        op(a.halo, P(t, mid('bigger', 0.5), 0.4, linear) * 0.35 * (i === 2 ? 1 - zm : 1));
      });
      alkShow(cBig, t, mid('bigger', 0.08), mid('bigger', 0.52), 640, 150);
      alkShow(cFar, t, mid('bigger', 0.55), at('shield') - 0.15, 640, 150);
      // shielding
      const sp = P(t, mid('shield', 0.18), 0.6, linear);
      op(shield, sp * 0.5);
      const thin = P(t, mid('shield', 0.4), 1.2, ease);
      const pp = P(t, mid('shield', 0.3), 0.4, linear);
      op(pull, pp); op(pullHead, pp); op(cPull, pp);
      attr(pull, 'stroke-width', lerp(10, 2.5, thin)); pullHead.setAttribute('transform', `scale(${lerp(1, 0.55, thin).toFixed(3)})`);
      if (pp > 0) tr(cPull, 560, 300);
      const wob = t > mid('shield', 0.72) ? 1 : 0;
      const oe = aK.outer[0];
      tr(oe, oe.x0 + wob * 4 * Math.sin(t * 23) * AMP, oe.y0 + wob * 3 * Math.sin(t * 17) * AMP);
      alkShow(cShield, t, mid('shield', 0.42), undefined, 930, 220);
      op(cIn, P(t, mid('shield', 0.05), 0.35, linear) * (t > at('shield') ? 1 : 0));
      op(cWeak, P(t, mid('shield', 0.6), 0.35, linear));
      // Silas, small in the corner, then closer
      tr(atSilW, lerp(1100, 960, zm), lerp(640, 570, zm));
      tr(SIL, 0, 0, lerp(0.6, 0.85, zm));
      SIL.set({ t, talk: talk(t, 'silas'), mood: 'deadpan', look: -0.7 });
    }

    /* ---------------- CALCIUM ---------------- */
    if (shot === 'calcium') {
      alkSeat(SON, caSonW, 1); op(SON, 1);
      tr(caSonW, 860, 470 + bob(1, 4));
      SON.set({ t, mood: 'deadpan', look: -0.7 });
      caFizz.upd(t, 1);
      alkShow(cSteady, t, c0 + 0.05, undefined, 640, 140);
      alkShow(cLess, t, mid('group2', 0.68), undefined, 640, 212);
    }
  };
});
