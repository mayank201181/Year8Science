/* Chapter 7, Hooke's law and springs.
   Beats: a hand pulls a spring and lets go -> extension = new length − original length, marked on a ruler
   -> 1 N: 10 cm to 13 cm, extension 3 cm -> Hooke's law card -> 2 N and 3 N: 6 and 9 cm, equal 3 cm steps
   -> the results plot a straight line through the origin -> the elastic limit at 4 N; unloaded, back to 10 cm
   -> 5 N and 6 N: the line curves away; unloaded, the spring stays 2 cm longer (showpiece)
   -> a newtonmeter: equal newtons, equal steps, an evenly spaced scale -> make your own with a rubber band. */
scene('hooke', S => {
  const { at, end, mid } = S, root = S.root, AMP = S.reduce ? 0.3 : 1;

  /* ---------- local helpers and art ---------- */
  const f1 = v => (+v).toFixed(1);
  const popIn = (el, p, x, y, s0) => { s0 = s0 === undefined ? 0.8 : s0; op(el, clamp(p * 2)); tr(el, x, y + (1 - clamp(p)) * 16, Math.max(0.01, s0 + (1 - s0) * p)); };
  /* a spring let go (or loaded) settles with a little bounce: 1 at u = 0, starting at rest, then 0 */
  const OW = TAU * 2.2, OK = 9;
  const osc = u => (u <= 0 ? 1 : Math.exp(-OK * u) * (Math.cos(OW * u) + OK / OW * Math.sin(OW * u)));
  /* a hand that grips at (0,0), its arm coming up from the lower left */
  function hand(parent) {
    const g = G(parent, { transform: 'scale(-1 1)' });
    E('path', { d: 'M18,22 L96,118', stroke: '#5B8DEF', 'stroke-width': 30, 'stroke-linecap': 'round' }, g);
    E('path', { d: 'M-22,-6 Q-24,-16 -12,-16 L18,-16 Q30,-16 30,-4 L30,22 Q30,36 16,36 L-10,36 Q-22,36 -22,24 Z', fill: '#C98E62', stroke: '#9C6A44', 'stroke-width': 2.5 }, g);
    E('path', { d: 'M-21,2 H14 M-21,12 H14 M-20,22 H12', stroke: '#9C6A44', 'stroke-width': 2.5, 'stroke-linecap': 'round' }, g);
    E('path', { d: 'M24,-12 Q38,-2 30,14', fill: 'none', stroke: '#9C6A44', 'stroke-width': 2.5, 'stroke-linecap': 'round' }, g);
    return g;
  }
  /* one slotted 1 N disc as fmMasses draws it; its slot's top is at y = 0 */
  function disc(parent) {
    const g = G(parent);
    E('rect', { x: -32, y: 1, width: 64, height: 14, rx: 5, fill: linGrad('#AEBBC6', '#5F6E7B', true), stroke: '#D5DEE5', 'stroke-width': 1.5 }, g);
    E('line', { x1: 16, y1: 3, x2: 16, y2: 13, stroke: '#3A4651', 'stroke-width': 2 }, g);
    return g;
  }
  /* loads on a hanger: LOADS = [[time, discs], ...]; returns what the hanger shows at t
     (it slides in from the right when first hung, and slides away when taken off) */
  function hangerAt(t, LOADS) {
    for (let i = 0; i < LOADS.length; i++) {
      const [t0, n] = LOADS[i], prevN = i ? LOADS[i - 1][1] : 0;
      if (prevN === 0 && n > 0 && t >= t0 - 0.45 && t < t0) return { k: n, o: P(t, t0 - 0.45, 0.3, linear), dx: (1 - P(t, t0 - 0.45, 0.45, easeOut)) * 70 };
      if (n === 0 && prevN > 0 && t >= t0 && t < t0 + 0.45) return { k: prevN, o: 1 - P(t, t0, 0.4, linear), dx: P(t, t0, 0.45, easeIn) * 70 };
    }
    let k = 0; LOADS.forEach(([t0, n]) => { if (t >= t0) k = n; });
    return { k, o: k ? 1 : 0, dx: 0 };
  }
  /* a disc sliding onto the top of the stack just before each added newton; returns [x, y, opacity] offsets */
  function discIn(t, LOADS, base) {
    for (let i = 1; i < LOADS.length; i++) {
      const [t0, n] = LOADS[i];
      if (n === LOADS[i - 1][1] + 1 && LOADS[i - 1][1] > 0 && t >= t0 - 0.45 && t < t0) {
        const p = P(t, t0 - 0.45, 0.45, easeOut);
        return [(1 - p) * 120, base - 16 * n - (1 - p) * 40, Math.min(1, p * 3)];
      }
    }
    return [0, 0, 0];
  }

  /* ================= the spring on its clamp stand, a ruler beside it ================= */
  const SX = 250, SY = 136, PX = 10;                // the spring hangs from (SX, SY); 10 px per cm
  const yOf = cm => SY + cm * PX;
  const RLX = 292, RLW = 52;
  const rig = G(root);
  fmFloor(rig, 40, 580, 700);
  E('rect', { x: 58, y: 676, width: 176, height: 22, rx: 6, fill: linGrad('#6F7E8B', '#3A4651', true), stroke: FM.metal[2], 'stroke-width': 2 }, rig);
  E('rect', { x: 104, y: 112, width: 12, height: 566, rx: 4, fill: linGrad(FM.metal[0], FM.metal[1]) }, rig);
  E('rect', { x: 110, y: 120, width: 248, height: 10, rx: 4, fill: linGrad(FM.metal[0], FM.metal[1], true) }, rig);
  E('rect', { x: 96, y: 112, width: 28, height: 26, rx: 5, fill: '#8E9CA9', stroke: FM.metal[2], 'stroke-width': 2 }, rig);
  E('line', { x1: SX, y1: 128, x2: SX, y2: SY + 2, stroke: FM.metal[0], 'stroke-width': 5, 'stroke-linecap': 'round' }, rig);
  const ruler = G(rig);
  E('rect', { x: RLX, y: SY - 8, width: RLW, height: 40 * PX + 16, rx: 4, fill: '#E9DFC4', stroke: '#B8A77E', 'stroke-width': 2 }, ruler);
  for (let c = 0; c <= 40; c++) {
    const y = yOf(c);
    E('line', { x1: RLX, x2: RLX + (c % 5 ? 9 : 17), y1: y, y2: y, stroke: '#4A3D22', 'stroke-width': c % 5 ? 1.5 : 2.5 }, ruler);
    if (c % 5 === 0) T(ruler, RLX + 35, y + 8, String(c), { size: 24, weight: 700, fill: '#4A3D22', anchor: 'middle' });
  }
  T(ruler, RLX + RLW / 2, yOf(40) + 40, 'cm', { size: 26, weight: 700, fill: C.muted, anchor: 'middle' });
  const spr = fmSpring(rig, { len: 100 }); tr(spr, SX, SY);
  const ptr = E('line', { x1: SX + 4, x2: RLX - 2, stroke: C.bad, 'stroke-width': 4, 'stroke-linecap': 'round' }, rig);
  const hangG = G(rig), masses = fmMasses(hangG, { n: 6, label: false });
  const loadLab = T(rig, 0, 0, ' ', { size: 30, weight: 700, fill: C.glucose, anchor: 'end' });
  const flyDisc = disc(rig);
  const handG = G(rig); hand(handG);
  /* a pill with an up or down arrow before the text */
  function arrowChip(parent, text, dir, color) {
    const g = G(parent), w = textWidth(text, 30, FD, 700) + 92;
    E('rect', { x: -w / 2, y: -27, width: w, height: 54, rx: 27, fill: C.card2, stroke: color, 'stroke-width': 3 }, g);
    arrow(g, -w / 2 + 34, -15 * dir, -w / 2 + 34, 16 * dir, { color, width: 5 });
    T(g, -w / 2 + 62, 11, text, { size: 30, weight: 700, fill: color });
    return g;
  }
  const chStretch = arrowChip(rig, 'stretches', 1, C.energy), chBack = arrowChip(rig, 'springs back', -1, C.good);
  // marks on the ruler, and the extension brackets
  const LBX = 396, BX = 380;
  const mkO = E('line', { x1: RLX - 4, x2: RLX + RLW + 24, stroke: C.muted, 'stroke-width': 3, 'stroke-dasharray': '7 5' }, rig);
  const mkN = E('line', { x1: RLX - 4, x2: RLX + RLW + 24, stroke: C.ink, 'stroke-width': 3 }, rig);
  const lbO = T(rig, LBX, 0, 'original length', { size: 26, weight: 600, fill: C.muted });
  const lbN = T(rig, LBX, 0, 'new length', { size: 26, weight: 700 });
  const extB = fmDim(rig, BX, yOf(10), BX, yOf(13), 'extension', { side: 'right', tick: 8, textColor: C.energy, color: C.energy });
  const steps = [0, 1, 2, 3].map(k => fmDim(rig, BX, yOf(10 + 3 * k), BX, yOf(13 + 3 * k), '3 cm', { side: 'right', tick: 8, textColor: C.energy, color: C.energy }));
  const backChip = G(rig);
  chip(backChip, 'back to 10 cm', { size: 28, fill: '#173A2A', stroke: C.good, color: C.good });
  const permG = G(rig);
  card(permG, -110, -56, 220, 144, { fill: '#3A1F24', stroke: C.bad });
  T(permG, 0, -16, 'permanently', { size: 30, weight: 700, anchor: 'middle', fill: '#FFB0B8' });
  T(permG, 0, 22, 'stretched', { size: 30, weight: 700, anchor: 'middle', fill: '#FFB0B8' });
  const permNote = T(permG, 0, 66, 'won’t go back', { size: 26, weight: 600, anchor: 'middle', fill: C.ink });
  const permB = fmDim(rig, BX, yOf(10), BX, yOf(12), '2 cm', { side: 'right', tick: 8, textColor: '#FFB0B8', color: C.bad });

  /* ================= right side: cards, the results table ================= */
  const PCX = 905;
  const fCard = G(root);
  card(fCard, PCX - 250, 160, 500, 150, { fill: C.card, stroke: C.line });
  T(fCard, PCX, 220, '**extension** =', { size: 38, weight: 600, anchor: 'middle', boldFill: C.energy });
  T(fCard, PCX, 276, 'new length − original length', { size: 34, weight: 700, anchor: 'middle' });
  const sumG = G(root);
  T(sumG, PCX, 392, '13 cm − 10 cm = **3 cm**', { size: 42, weight: 600, anchor: 'middle', boldFill: C.energy });
  const lawG = G(root);
  card(lawG, PCX - 255, 150, 510, 206, { fill: C.card, stroke: C.energy, sw: 3 });
  T(lawG, PCX, 214, "Hooke's law", { size: 46, weight: 700, anchor: 'middle', fill: C.energy });
  T(lawG, PCX, 270, 'the extension is', { size: 34, weight: 600, anchor: 'middle' });
  T(lawG, PCX, 318, '**proportional** to the force', { size: 34, weight: 600, anchor: 'middle', boldFill: C.energy });
  const tab = G(root);
  const TFX = 830, TEX = 1000, TRY = [490, 556, 622];
  T(tab, TFX, 430, 'force', { size: 30, weight: 700, anchor: 'middle', fill: C.muted });
  T(tab, TEX, 430, 'extension', { size: 30, weight: 700, anchor: 'middle', fill: C.muted });
  E('line', { x1: 720, x2: 1110, y1: 448, y2: 448, stroke: C.line, 'stroke-width': 3 }, tab);
  const rows = [1, 2, 3].map((n, i) => {
    const g = G(tab);
    T(g, TFX, TRY[i], n + ' N', { size: 38, weight: 700, anchor: 'middle', fill: C.glucose });
    T(g, TEX, TRY[i], 3 * n + ' cm', { size: 38, weight: 700, anchor: 'middle' });
    return g;
  });
  const tags = [1, 2].map(i => {
    const g = G(tab), txt = i === 1 ? '×2' : '×3';
    [[788, 'end'], [1050, 'start']].forEach(([x, a]) => {
      const c = chip(g, txt, { size: 28, fill: '#33300F', stroke: C.energy, color: C.energy });
      tr(c, x + (a === 'end' ? -c.w / 2 : c.w / 2), TRY[i] - 12);
    });
    return g;
  });

  /* ================= the force-extension graph ================= */
  const GX = 690, GY = 600;
  const gG = G(root); tr(gG, GX, GY);
  const gr = fmGraph(gG, { w: 430, h: 330, xmax: 30, ymax: 6, xstep: 5, ystep: 1, xlabel: 'extension (cm)', ylabel: 'force (N)', ylabelX: -64 });
  const gp = gr.px;
  const CURVE = []; for (let k = 0; k <= 60; k++) { const F = k / 10; CURVE.push([fmExtension(F), F]); }
  const dash = E('line', { x1: gp(12, 4)[0], y1: gp(12, 4)[1], x2: gp(18, 6)[0], y2: gp(18, 6)[1], stroke: C.muted, 'stroke-width': 4, 'stroke-dasharray': '9 8' }, gr);
  const curve = gr.line(CURVE, { width: 6 });
  const PTS = [[3, 1], [6, 2], [9, 3], [12, 4], [17, 5], [26, 6]];
  const dots = gr.dots(PTS);
  const fly = [0, 1, 2].map(() => E('circle', { r: 9, fill: C.energy, stroke: C.bg0, 'stroke-width': 3 }, root));
  const lineLab = T(gG, gp(9.5, 1.7)[0], gp(9.5, 1.7)[1], 'straight line', { size: 28, weight: 700, fill: C.energy });
  const origG = G(gG);
  E('circle', { r: 16, fill: 'none', stroke: C.energy, 'stroke-width': 4 }, origG);
  T(origG, 52, -16, 'through the origin', { size: 28, weight: 700, fill: C.energy });
  const limG = G(gG);
  E('circle', { r: 18, fill: 'none', stroke: C.ink, 'stroke-width': 4 }, limG);
  T(limG, 24, 40, 'elastic limit', { size: 30, weight: 700 });
  const elasticLab = T(gG, gp(9.5, 1.7)[0], gp(9.5, 1.7)[1], 'elastic: springs back', { size: 28, weight: 700, fill: C.good });
  const awayLab = T(gG, gp(21, 4.4)[0], gp(21, 4.4)[1], 'curves away', { size: 28, weight: 700, fill: '#FFB0B8' });

  /* ================= the newtonmeter ================= */
  const M = G(root);
  const NX = 560, NY = 132;
  E('rect', { x: NX - 40, y: 102, width: 80, height: 10, rx: 4, fill: linGrad(FM.metal[0], FM.metal[1], true) }, M);
  E('line', { x1: NX, y1: 110, x2: NX, y2: NY + 2, stroke: FM.metal[2], 'stroke-width': 5, 'stroke-linecap': 'round' }, M);
  const nmG = G(M); tr(nmG, NX, NY);
  const nm = fmNewtonmeter(nmG, { max: 5, len: 180, every: 1, minor: 0.5 });
  const NM0 = NY + 86, NMS = 36;                    // stage y of the 0 N mark; px per newton
  const nmHangG = G(M), nmMasses = fmMasses(nmHangG, { n: 3, label: false });
  const nmFly = disc(M);
  const nmLoad = T(M, 0, 0, ' ', { size: 30, weight: 700, fill: C.glucose, anchor: 'end' });
  const sprLab = G(M);
  E('line', { x1: 410, y1: 232, x2: NX - 14, y2: 232, stroke: C.muted, 'stroke-width': 2.5 }, sprLab);
  E('circle', { cx: NX - 14, cy: 232, r: 4.5, fill: C.muted }, sprLab);
  T(sprLab, 400, 241, 'its spring', { size: 28, weight: 600, anchor: 'end' });
  const stepB = [0, 1, 2].map(k => fmDim(M, NX + 116, NM0 + k * NMS, NX + 116, NM0 + (k + 1) * NMS, '1 N', { side: 'right', tick: 8, textColor: C.glucose, color: C.energy }));
  const sameLab = G(M);
  T(sameLab, NX + 190, NM0 + 40, 'each newton:', { size: 28, weight: 600 });
  T(sameLab, NX + 190, NM0 + 76, 'the **same** stretch', { size: 28, weight: 600, boldFill: C.energy });
  const evenLab = G(M);
  const evenHi = E('rect', { x: NX + 31, y: NM0 - 6, width: 70, height: 5 * NMS + 12, rx: 8, fill: 'none', stroke: C.energy, 'stroke-width': 4 }, evenLab);
  T(evenLab, NX + 190, NM0 + 172, 'evenly spaced marks', { size: 30, weight: 700, fill: C.energy });
  E('line', { x1: NX + 184, y1: NM0 + 162, x2: NX + 106, y2: NM0 + 150, stroke: C.energy, 'stroke-width': 3 }, evenLab);

  /* ================= at home: a rubber band, a cup and coins ================= */
  const Hm = G(root);
  const hdr = chip(Hm, 'Make your own', { size: 28, fill: 'rgba(10,27,39,0.78)', stroke: C.line, sw: 2, color: C.energy });
  tr(hdr, 1160 - hdr.w / 2, 60);
  const HB = 448, HPY = 150;                        // the band hangs from the pencil at (HB, HPY)
  const shelf = G(Hm);
  E('rect', { x: 96, y: HPY + 6, width: 300, height: 34, rx: 4, fill: linGrad(FM.wood[2], FM.wood[0], true), stroke: FM.wood[1], 'stroke-width': 3 }, shelf);
  E('rect', { x: 280, y: HPY - 7, width: 196, height: 13, rx: 4, fill: '#F2C14E', stroke: '#B8862A', 'stroke-width': 2 }, shelf);
  E('path', { d: `M476,${HPY - 7} L494,${HPY - 0.5} L476,${HPY + 6} Z`, fill: '#E9C9A0', stroke: '#B8862A', 'stroke-width': 2, 'stroke-linejoin': 'round' }, shelf);
  E('path', { d: `M490,${HPY - 2.5} L494,${HPY - 0.5} L490,${HPY + 1.5} Z`, fill: '#3A3A3A' }, shelf);
  E('rect', { x: 300, y: HPY - 12, width: 34, height: 30, rx: 3, fill: 'rgba(230,240,245,0.55)', stroke: 'rgba(255,255,255,0.7)', 'stroke-width': 1.5 }, shelf);
  T(shelf, 246, HPY + 76, 'shelf', { size: 26, weight: 600, fill: C.muted, anchor: 'middle' });
  T(shelf, 330, HPY - 26, 'pencil, taped down', { size: 26, weight: 600, fill: C.muted, anchor: 'middle' });
  const band = E('path', { fill: 'none', stroke: '#E8955A', 'stroke-width': 5, 'stroke-linejoin': 'round' }, Hm);
  const clip = E('path', { fill: 'none', stroke: '#C9D6DF', 'stroke-width': 3.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, Hm);
  const cupBack = G(Hm), coinG = G(Hm), cupFront = G(Hm);
  E('ellipse', { cx: 0, cy: 0, rx: 44, ry: 9, fill: '#7B8794' }, cupBack);
  E('path', { d: 'M-44,0 L-32,96 Q0,104 32,96 L44,0 Q0,10 -44,0 Z', fill: linGrad('#F4F7FA', '#C9D3DB'), stroke: '#9DAAB6', 'stroke-width': 2 }, cupFront);
  E('path', { d: 'M-40,30 Q0,40 40,30 L37,52 Q0,62 -37,52 Z', fill: '#4CC9F0', opacity: 0.75 }, cupFront);
  const coins = [0, 1, 2, 3].map(() => { const c = G(coinG); E('ellipse', { rx: 15, ry: 6, fill: '#E3B13B', stroke: '#9C7417', 'stroke-width': 2 }, c); return c; });
  const cupNum = T(Hm, 0, 0, ' ', { size: 26, weight: 700, anchor: 'middle', fill: '#1C2329' });
  const HRX = 548, HPXC = 20;                       // the home ruler: 20 px per cm
  const BAND0 = 150, CUPH = 100;                    // band length with the empty cup; cup height
  const cup0 = HPY + BAND0 + 26;                    // stage y of the cup's rim with no coins
  const hr = G(Hm);
  E('rect', { x: HRX, y: cup0 + CUPH - 20, width: 46, height: 6 * HPXC + 40, rx: 4, fill: '#E9DFC4', stroke: '#B8A77E', 'stroke-width': 2 }, hr);
  for (let k = 0; k <= 12; k++) {
    const y = cup0 + CUPH + k * HPXC / 2;
    E('line', { x1: HRX, x2: HRX + (k % 2 ? 9 : 16), y1: y, y2: y, stroke: '#4A3D22', 'stroke-width': k % 2 ? 1.5 : 2.5 }, hr);
    if (k % 2 === 0) T(hr, HRX + 32, y + 8, String(k / 2), { size: 24, weight: 700, fill: '#4A3D22', anchor: 'middle' });
  }
  T(hr, HRX + 23, cup0 + CUPH + 6 * HPXC + 54, 'cm', { size: 26, weight: 700, fill: C.muted, anchor: 'middle' });
  E('line', { x1: HB + 30, x2: HRX + 46, y1: cup0 + CUPH, y2: cup0 + CUPH, stroke: C.muted, 'stroke-width': 3, 'stroke-dasharray': '7 5' }, hr);
  const hPtr = E('line', { x1: HB + 34, x2: HRX - 2, stroke: C.bad, 'stroke-width': 4, 'stroke-linecap': 'round' }, Hm);
  const hTab = G(Hm);
  const HTX = [760, 900, 1050], HTY = 250, HTD = 58;
  T(hTab, HTX[0], HTY, 'coins', { size: 30, weight: 700, anchor: 'middle', fill: C.muted });
  T(hTab, HTX[1], HTY, 'stretch', { size: 30, weight: 700, anchor: 'middle', fill: C.muted });
  T(hTab, HTX[2], HTY, 'extra', { size: 30, weight: 700, anchor: 'middle', fill: C.muted });
  E('line', { x1: 690, x2: 1120, y1: HTY + 18, y2: HTY + 18, stroke: C.line, 'stroke-width': 3 }, hTab);
  const STR = [0, 1.2, 2.3, 3.5, 4.6];             // a rubber band: roughly equal steps
  const hRows = STR.map((s, i) => {
    const g = G(hTab), y = HTY + 18 + (i + 0.8) * HTD;
    T(g, HTX[0], y, String(i), { size: 34, weight: 700, anchor: 'middle' });
    T(g, HTX[1], y, s.toFixed(1) + ' cm', { size: 34, weight: 700, anchor: 'middle' });
    if (i) T(g, HTX[2], y, '+' + (s - STR[i - 1]).toFixed(1), { size: 34, weight: 700, anchor: 'middle', fill: C.energy });
    return g;
  });
  const eqChip = chip(Hm, 'roughly equal steps', { size: 30, fill: '#33300F', stroke: C.energy, color: C.energy });

  /* ---------- the spring's story: when it is pulled, loaded and unloaded ---------- */
  const tP1 = S.first + 0.6, tR1 = mid('stretch', 0.55);
  const tP2 = at('extension') + 0.75, tR2 = end('extension') - 0.05;
  const LOADS = [                                      // [time, discs on the hanger]
    [at('example') + 0.5, 1], [mid('double', 0.08), 2], [mid('double', 0.56), 3], [at('limit') + 0.3, 4], [mid('limit', 0.6), 0],
    [at('past') + 0.25, 5], [mid('past', 0.3), 6], [mid('past', 0.5), 0],
  ];
  const tOver = LOADS[6][0];                           // after this the spring is permanently stretched
  const eqLen = (k, t) => (k ? 10 + fmExtension(k) : t > tOver ? 10 + FM.spring.perm : 10);
  const loadAt = t => { let k = 0; LOADS.forEach(([t0, n]) => { if (t >= t0) k = n; }); return k; };
  function springAt(t) {                               // -> [length in cm, warp]
    if (t < tR1) return [10 + 8 * ease(clamp((t - tP1) / 1.1)), 0];
    if (t < tP2) return [10 + 8 * osc(t - tR1), 0];
    if (t < tR2) return [10 + 5 * ease(clamp((t - tP2) / 0.8)), 0];
    if (t < LOADS[0][0]) return [10 + 5 * osc(t - tR2), 0];
    let i = 0; while (i + 1 < LOADS.length && t >= LOADS[i + 1][0]) i++;
    const [t0, k] = LOADS[i], prev = i ? eqLen(LOADS[i - 1][1], t0 - 0.01) : 10, now = eqLen(k, t);
    return [now + (prev - now) * osc(t - t0), t > tOver ? 1 : k >= 5 ? 0.5 : 0];
  }

  return t => {
    /* ================= the rig ================= */
    const aRig = Math.min(P(t, S.first - 0.1, 0.4, linear), 1 - P(t, at('meter') - 0.3, 0.4, linear));
    op(rig, aRig);
    if (aRig > 0) {
      const [L, warp] = springAt(t), yb = yOf(L), hookY = SY + L * PX + 26;
      spr.set(L * PX, warp);
      attr(ptr, 'y1', yb); attr(ptr, 'y2', yb);
      // the hand: two pulls
      const first = t < tP2 - 0.5, tp = first ? tP1 : tP2, trl = first ? tR1 : tR2;
      const off = (1 - P(t, tp - 0.45, 0.45, easeOut)) + P(t, trl, 0.5, easeIn);
      tr(handG, SX - off * 70, hookY + off * 110); op(handG, win(t, tp - 0.45, trl + 0.5, 0.3));
      popIn(chStretch, P(t, tP1 + 0.3, 0.5, pop), 500, 300, 0.7); op(chStretch, clamp(P(t, tP1 + 0.3, 0.5, pop) * 2) * (1 - P(t, tR1, 0.3, linear)));
      popIn(chBack, P(t, tR1 + 0.15, 0.5, pop), 500, 300, 0.7); op(chBack, clamp(P(t, tR1 + 0.15, 0.5, pop) * 2) * (1 - P(t, at('extension') - 0.2, 0.3, linear)));
      // the hanger, and a disc sliding on before each added newton
      const hs = hangerAt(t, LOADS);
      masses.set(hs.k); op(hangG, hs.o); tr(hangG, SX + hs.dx, hookY);
      setText(loadLab, hs.k ? hs.k + ' N' : ' '); attr(loadLab, 'x', SX - 44 + hs.dx); attr(loadLab, 'y', hookY + masses.bottom - 12); op(loadLab, hs.o);
      const fd = discIn(t, LOADS, 138);
      tr(flyDisc, SX + fd[0], hookY + fd[1]); op(flyDisc, fd[2]);
      // marks, labels and brackets on the ruler
      const yO = yOf(10), k = loadAt(t), eq = eqLen(k, t);
      attr(mkO, 'y1', yO); attr(mkO, 'y2', yO); attr(mkN, 'y1', yb); attr(mkN, 'y2', yb);
      const mO = P(t, at('extension') + 0.1, 0.4, linear);
      const nW = Math.max(win(t, tP2 + 0.85, tR2 + 0.15, 0.3), win(t, LOADS[0][0] + 0.45, LOADS[4][0] + 0.15, 0.3), P(t, LOADS[5][0] + 0.45, 0.3, linear));
      op(mkO, mO); op(mkN, nW);
      const words = t < at('example') + 0.2;
      setText(lbO, words ? 'original length' : '10 cm'); attr(lbO, 'y', yO - 12);
      op(lbO, mO * (words ? 1 - P(t, at('example'), 0.2, linear) : P(t, at('example') + 0.2, 0.3, linear)));
      setText(lbN, words ? 'new length' : Math.round(eq) + ' cm'); attr(lbN, 'y', yb + 32); op(lbN, nW);
      const ext = L - 10;
      const eW = Math.max(win(t, tP2 + 1.1, tR2 + 0.1, 0.3), win(t, LOADS[0][0] + 0.6, at('double') + 0.4, 0.3), win(t, LOADS[5][0] + 0.6, LOADS[7][0] + 0.1, 0.3));
      extB.to(BX, yO, BX, yO + Math.max(1, ext * PX), words ? 'extension' : Math.round(eq - 10) + ' cm');
      op(extB, eW * clamp(ext / 1.5));
      steps.forEach((b, i) => op(b, win(t, (i ? LOADS[i][0] : at('double') + 0.3) + 0.2, LOADS[4][0] + 0.1, 0.3) * (i ? clamp((ext - 3 * i) / 2.4) : 1)));
      const bc = P(t, LOADS[4][0] + 0.7, 0.5, pop);
      popIn(backChip, bc, 480, 320, 0.7); op(backChip, clamp(bc * 2) * (1 - P(t, LOADS[5][0] - 0.4, 0.3, linear)));
      popIn(permG, P(t, mid('past', 0.6), 0.5, pop), 468, 430, 0.75);
      op(permB, P(t, mid('past', 0.56), 0.4, linear)); op(permNote, P(t, mid('past', 0.84), 0.4, linear));
    }

    /* ================= right side: cards, table ================= */
    const fc = P(t, mid('extension', 0.46), 0.55, pop);
    op(fCard, clamp(fc * 2) * (1 - P(t, at('law') - 0.25, 0.35, linear))); tr(fCard, 0, (1 - clamp(fc)) * 16);
    const sc = P(t, mid('example', 0.52), 0.5, easeOut);
    op(sumG, sc * (1 - P(t, at('law') - 0.25, 0.35, linear))); tr(sumG, 0, (1 - sc) * 14);
    const lc = P(t, at('law') + 0.1, 0.6, pop), lup = P(t, at('double') - 0.1, 0.6);
    op(lawG, clamp(lc * 2) * (1 - P(t, at('graph') - 0.2, 0.4, linear)));
    lawG.setAttribute('transform', `translate(${PCX} ${f1(lerp(253, 196, lup))}) scale(${Math.max(0.01, (0.85 + 0.15 * lc) * lerp(1, 0.78, lup)).toFixed(3)}) translate(${-PCX} -253)`);
    op(tab, P(t, at('double') + 0.1, 0.4, linear) * (1 - P(t, at('graph') - 0.3, 0.35, linear)));
    rows.forEach((g, i) => { const p = P(t, i ? LOADS[i][0] + 0.2 : at('double') + 0.2, 0.4, easeOut); op(g, p); tr(g, (1 - p) * 20, 0); });
    tags.forEach((g, i) => op(g, P(t, LOADS[i + 1][0] + 0.6, 0.4, linear)));

    /* ================= the graph ================= */
    const aG = Math.min(P(t, at('graph') + 0.05, 0.45, linear), 1 - P(t, at('meter') - 0.3, 0.4, linear));
    op(gG, aG);
    fly.forEach((f, i) => {
      const t0 = mid('graph', 0.06 + i * 0.1), p = P(t, t0, 0.6), q = gp(PTS[i][0], PTS[i][1]);
      attr(f, 'cx', lerp(TEX + 56, GX + q[0], p)); attr(f, 'cy', lerp(TRY[i] - 12, GY + q[1], p) - Math.sin(p * Math.PI) * 50);
      op(f, t >= t0 && p < 1 ? 1 : 0);
    });
    if (aG > 0) {
      let nd = 0;
      [0, 1, 2].forEach(i => { if (t >= mid('graph', 0.06 + i * 0.1) + 0.6) nd = i + 1; });
      if (t >= LOADS[3][0] + 0.3) nd = 4;
      if (t >= LOADS[5][0] + 0.4) nd = 5;
      if (t >= LOADS[6][0] + 0.4) nd = 6;
      dots.set(nd);
      const up = 9 * P(t, mid('graph', 0.4), 0.9, linear) + 3 * P(t, LOADS[3][0] + 0.3, 0.5, linear) + 5 * P(t, LOADS[5][0] + 0.2, 0.6, linear) + 9 * P(t, LOADS[6][0] + 0.2, 0.7, linear);
      curve.set(up); op(curve, up > 0.05 ? 1 : 0);
      op(lineLab, win(t, mid('graph', 0.55), at('limit') + 0.2, 0.4));
      const po = P(t, mid('graph', 0.74), 0.5, pop);
      op(origG, clamp(po * 2) * (1 - P(t, at('limit') + 0.1, 0.4, linear))); tr(origG, 0, 0, Math.max(0.01, 0.7 + 0.3 * po));
      const pl = P(t, mid('limit', 0.2), 0.5, pop); op(limG, clamp(pl * 2)); tr(limG, gp(12, 4)[0], gp(12, 4)[1], Math.max(0.01, 0.7 + 0.3 * pl));
      op(elasticLab, win(t, mid('limit', 0.4), at('past') + 0.3, 0.4));
      op(dash, P(t, mid('past', 0.2), 0.5, linear));
      op(awayLab, P(t, mid('past', 0.42), 0.5, linear));
    }

    /* ================= the newtonmeter ================= */
    const aM = Math.min(P(t, at('meter') - 0.1, 0.5, linear), 1 - P(t, at('home') - 0.25, 0.4, linear));
    op(M, aM);
    if (aM > 0) {
      const NL = [[mid('meter', 0.28), 1], [mid('meter', 0.42), 2], [mid('meter', 0.56), 3]];
      let n = 0, prevV = 0, tLast = -9;
      NL.forEach(([t0, v], i) => { if (t >= t0) { n = v; prevV = i; tLast = t0; } });
      nm.set(n ? n + (prevV - n) * osc(t - tLast) : 0);
      const hk = nm.hook(), hx = NX + hk[0], hy = NY + hk[1];
      const hs = hangerAt(t, NL);
      nmMasses.set(hs.k); op(nmHangG, hs.o); tr(nmHangG, hx + hs.dx, hy);
      setText(nmLoad, hs.k ? hs.k + ' N' : ' '); attr(nmLoad, 'x', hx - 44 + hs.dx); attr(nmLoad, 'y', hy + nmMasses.bottom - 12); op(nmLoad, hs.o);
      const fd = discIn(t, NL, 90);
      tr(nmFly, hx + fd[0], hy + fd[1]); op(nmFly, fd[2]);
      op(sprLab, P(t, mid('meter', 0.08), 0.4, linear));
      stepB.forEach((b, i) => op(b, P(t, NL[i][0] + 0.35, 0.35, linear)));
      op(sameLab, P(t, mid('meter', 0.5), 0.4, linear));
      const ev = P(t, mid('meter', 0.64), 0.5, linear);
      op(evenLab, ev); op(evenHi, ev * (1 - 0.3 * AMP * wave(t, 1.2)));
    }

    /* ================= at home ================= */
    const aH = P(t, at('home') - 0.1, 0.5, linear);
    op(Hm, aH);
    if (aH > 0) {
      const CT = [mid('home', 0.42), mid('home', 0.5), mid('home', 0.58), mid('home', 0.66)];
      let c = 0, prevS = 0, tL = -9;
      CT.forEach((t0, i) => { if (t >= t0) { c = i + 1; prevS = STR[i]; tL = t0; } });
      const s = c ? STR[c] + (prevS - STR[c]) * osc(t - tL) : 0;
      const bandLen = BAND0 + s * HPXC, cupY = HPY + bandLen + 26, bx = HB, yb = HPY + bandLen;
      band.setAttribute('d', `M${bx - 8},${HPY - 9} Q${bx},${HPY - 16} ${bx + 8},${HPY - 9} L${bx + 5},${f1(yb)} Q${bx},${f1(yb + 6)} ${bx - 5},${f1(yb)} Z`);
      clip.setAttribute('d', `M${bx},${f1(yb - 6)} L${bx},${f1(yb + 14)} Q${bx},${f1(yb + 22)} ${bx - 6},${f1(yb + 22)} L${bx - 6},${f1(cupY - 2)} Q${bx - 6},${f1(cupY + 6)} ${bx},${f1(cupY + 6)}`);
      tr(cupBack, bx, cupY); tr(cupFront, bx, cupY);
      setText(cupNum, c ? String(c) : ' '); attr(cupNum, 'x', bx); attr(cupNum, 'y', cupY + 84); op(cupNum, c ? 1 : 0);
      coins.forEach((cn, i) => {
        const t0 = CT[i], p = clamp((t - (t0 - 0.5)) / 0.5);
        if (t < t0 - 0.5 || p >= 1) { op(cn, 0); return; }
        tr(cn, lerp(bx + 150, bx, p), lerp(cupY - 170, cupY + 4, p * p), 1, (1 - p) * 40); op(cn, 1);
      });
      attr(hPtr, 'y1', cupY + CUPH); attr(hPtr, 'y2', cupY + CUPH);
      op(shelf, P(t, mid('home', 0.03), 0.4, linear));
      op(band, P(t, mid('home', 0.14), 0.4, linear)); op(clip, P(t, mid('home', 0.22), 0.3, linear));
      const cupIn = P(t, mid('home', 0.26), 0.3, linear);
      op(cupBack, cupIn); op(cupFront, cupIn); op(coinG, cupIn);
      op(hr, P(t, mid('home', 0.33), 0.4, linear)); op(hPtr, P(t, mid('home', 0.33), 0.4, linear));
      op(hTab, P(t, mid('home', 0.36), 0.4, linear));
      hRows.forEach((g, i) => { const p = i ? P(t, CT[i - 1] + 0.3, 0.4, easeOut) : P(t, mid('home', 0.38), 0.4, easeOut); op(g, p); tr(g, (1 - p) * 20, 0); });
      popIn(eqChip, P(t, mid('home', 0.8), 0.5, pop), 905, 620, 0.75);
    }
  };
});
