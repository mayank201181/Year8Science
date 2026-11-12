/* Scene 4: Theo's basement (useful and wasted energy, dissipation).
   5 p.m., aircon off, the rattling fan -> useful (kinetic store of the moving air) -> wasted (thermal store of
   the surroundings) -> Theo's basement: orange dots tumble down the stairs to him -> Theo's confessional with the
   lost umbrella -> Jules: "Poof?" -> Constance: DENIED -> DISSIPATES (20 dots spread out, none lost) -> spread so
   thin the dustpan catches nothing; +0.1 °C -> friction (bike brake) and air resistance -> rub your palms ->
   "Ooh. Warm." -> Theo: "It's actually warm." */
scene('basement', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;

  /* ---------- local helpers (prefixed bas) ---------- */
  const on = (t, a, b) => (t >= a && t < b ? 1 : 0);
  const view = (el, k, fx, fy, sx, sy) => el.setAttribute('transform', `translate(${sx.toFixed(1)} ${sy.toFixed(1)}) scale(${k.toFixed(4)}) translate(${(-fx).toFixed(1)} ${(-fy).toFixed(1)})`);
  const popIn = (el, t, t0, x, y, s, r) => { const p = P(t, t0, 0.45, pop); op(el, clamp(p * 2.5)); tr(el, x, y, Math.max(0.01, (s || 1) * (0.6 + 0.4 * p)), r); return p; };
  const pill = (parent, text, o) => { o = o || {}; return chip(parent, text, { size: o.size || 30, fill: o.fill || 'rgba(10,27,39,0.9)', stroke: o.stroke || C.line, sw: 3, color: o.color || C.ink, weight: 700 }); };
  const THERM = '#FF8A3D', KIN = '#FF6B5C';
  // a dark label card with a big title and up to two lines under it
  function basCard(parent, w, h, col, title, l1, l2) {
    const g = G(parent);
    E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: 16, fill: 'rgba(10,27,39,0.92)', stroke: col, 'stroke-width': 4 }, g);
    T(g, 0, -h / 2 + 44, title, { size: 36, weight: 800, anchor: 'middle', fill: col, ls: 2 });
    T(g, 0, -h / 2 + 88, l1, { size: 30, weight: 700, anchor: 'middle', fill: C.ink, boldFill: col });
    if (l2) T(g, 0, -h / 2 + 126, l2, { size: 30, weight: 700, anchor: 'middle', fill: C.ink, boldFill: col });
    return g;
  }
  // two palms pressed together (for rubbing); g.upd(t, speed)
  function basPalms(parent) {
    const g = G(parent), hs = [];
    [-1, 1].forEach(sd => {
      const h = G(g);
      E('path', { d: `M0,46 L${sd * 30},40 Q${sd * 36},0 ${sd * 30},-40 L${sd * 22},-62 Q${sd * 12},-74 0,-66 Z`, fill: '#B9784E', stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, h);
      E('path', { d: `M${sd * 8},-30 L${sd * 22},-28 M${sd * 8},-8 L${sd * 24},-6`, stroke: '#8A5434', 'stroke-width': 3, 'stroke-linecap': 'round' }, h);
      hs.push({ h, sd });
    });
    g.upd = (t, sp) => hs.forEach(({ h, sd }) => tr(h, sd * 5, Math.sin(t * TAU * 3.2 * AMP) * 20 * sp * sd));
    g.upd(0, 0);
    return g;
  }
  // a bicycle wheel (side view) with a rim-brake pad at the top; g.upd(angle, heat 0..1)
  function basWheel(parent) {
    const g = G(parent), spin = G(g);
    E('circle', { r: 150, fill: 'none', stroke: '#2A2A30', 'stroke-width': 24 }, g);
    E('circle', { r: 134, fill: 'none', stroke: '#C9D3DC', 'stroke-width': 9 }, g);
    let d = ''; for (let k = 0; k < 16; k++) { const a = k / 16 * TAU; d += `M${(Math.cos(a) * 14).toFixed(1)},${(Math.sin(a) * 14).toFixed(1)} L${(Math.cos(a + 0.3) * 130).toFixed(1)},${(Math.sin(a + 0.3) * 130).toFixed(1)} `; }
    E('path', { d, stroke: '#9AA6B2', 'stroke-width': 3 }, spin);
    E('circle', { r: 20, fill: '#8F9CAB', stroke: SC_INK, 'stroke-width': 4 }, g);
    E('rect', { x: -6, y: -230, width: 12, height: 80, fill: '#5A606A', stroke: SC_INK, 'stroke-width': 3 }, g);   // brake arm
    const hot = E('ellipse', { cx: 0, cy: -146, rx: 110, ry: 70, fill: glow('#FF6A1A') }, g);
    const pad = E('rect', { x: -32, y: -160, width: 64, height: 22, rx: 5, fill: '#2A2A30', stroke: SC_INK, 'stroke-width': 3 }, g);
    const hw = heatWaves(g, { n: 3, h: 70, spacing: 22, width: 6, color: '#FF8A3D' }); tr(hw, 0, -170);
    g.upd = (t, ang, heat) => { tr(spin, 0, 0, 1, ang); op(hot, heat); attr(pad, 'fill', heat > 0.6 ? '#C2451A' : '#2A2A30'); op(hw, heat); hw.upd(t); };
    return g;
  }
  // a cyclist riding right; g.upd(t)
  function basCyclist(parent) {
    const g = G(parent), wh = [];
    [-80, 80].forEach(x => { const w = G(g); w.bx = x; tr(w, x, 60); E('circle', { r: 56, fill: 'none', stroke: '#2A2A30', 'stroke-width': 10 }, w); E('path', { d: 'M-50,0 L50,0 M0,-50 L0,50', stroke: '#9AA6B2', 'stroke-width': 3 }, w); wh.push(w); });
    E('path', { d: 'M-80,60 L-20,0 L60,0 L80,60 M-20,0 L10,60 L60,0 M-30,-14 L-10,-14 M60,0 L56,-30 L76,-34', fill: 'none', stroke: '#E8424F', 'stroke-width': 8, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    E('path', { d: 'M-20,-18 L40,-74', stroke: '#2E7DD8', 'stroke-width': 30, 'stroke-linecap': 'round' }, g);   // back
    E('path', { d: 'M40,-70 L70,-38', stroke: '#B9784E', 'stroke-width': 12, 'stroke-linecap': 'round' }, g);    // arm
    const leg = E('path', { d: '', fill: 'none', stroke: '#1E2A44', 'stroke-width': 16, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    E('circle', { cx: 58, cy: -96, r: 22, fill: '#B9784E', stroke: SC_INK, 'stroke-width': 3 }, g);
    E('path', { d: 'M30,-100 Q40,-132 76,-118 L84,-104 Z', fill: '#FFC247', stroke: SC_INK, 'stroke-width': 3 }, g);
    g.upd = t => {
      wh.forEach(w => tr(w, w.bx, 60, 1, (t * 400 * AMP) % 360));
      const a = t * TAU * 1.2 * AMP, fx = 10 + Math.cos(a) * 24, fy = 60 + Math.sin(a) * 24;
      attr(leg, 'd', `M-20,-14 L${((fx - 20) / 2 + 22).toFixed(1)},${(fy / 2 - 10).toFixed(1)} L${fx.toFixed(1)},${fy.toFixed(1)}`);
    };
    g.upd(0);
    return g;
  }

  /* layers */
  const Lbg = G(root), Lcast = G(root), Lfg = G(root), Lhud = G(root);

  /* ================= F: the flat at 5 p.m. with the fan ================= */
  const flatShot = G(Lbg), flatWrap = G(flatShot);
  const flat = enFlat(flatWrap);
  const fan = enFan(flatWrap, 1); tr(fan, 650, 610);
  const motorGlow = E('circle', { cx: 650, cy: 380, r: 80, fill: glow('#FF6A1A') }, flatWrap);
  const motorHW = heatWaves(flatWrap, { n: 3, h: 80, spacing: 26, width: 6, color: '#FF6A1A' }); tr(motorHW, 650, 290);
  const rattle = T(Lfg, 0, 0, 'rattle rattle', { size: 36, weight: 800, anchor: 'middle', fill: '#5A3A1A' });
  const fiveChip = pill(Lfg, '5:00 p.m.  aircon OFF', { size: 30, color: '#7FD3FF', stroke: '#7FD3FF' });
  const elecIn = G(Lfg);
  const elecArrow = arrow(elecIn, 548, 652, 632, 612, { color: C.energy, width: 7 });
  const elecChip = chip(elecIn, 'electricity in', { size: 28, fill: C.energy, color: '#3A3000' }); tr(elecChip, 420, 655);
  const air = G(Lfg);
  const airL = [0, 1, 2, 3, 4].map(() => E('path', { d: '', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 5, 'stroke-linecap': 'round' }, air));
  const useArrow = arrow(Lfg, 734, 372, 1120, 372, { color: '#56D69B', width: 12 });
  const useCard = basCard(Lfg, 400, 160, '#56D69B', 'USEFUL ✓', '**kinetic** store of', 'the moving air');
  const wasteArrow = arrow(Lfg, 680, 420, 772, 520, { color: THERM, width: 10, bend: 30 });
  const wasteCard = basCard(Lfg, 400, 160, THERM, 'WASTED ✗', '**thermal** store of', 'the surroundings');

  /* ================= basement (me, thin, warm) ================= */
  const basShot = G(Lbg), basWrap = G(basShot);
  const bas = enBasement(basWrap);
  const stairs = G(basWrap);
  { let d = 'M60,160 '; for (let k = 0; k < 7; k++) { const x = 60 + k * 60, y = 160 + k * 60; d += `L${x + 60},${y} L${x + 60},${y + 60} `; } d += 'L480,580 L60,580 Z';
    E('path', { d, fill: '#4A2616', stroke: '#7A4028', 'stroke-width': 5, 'stroke-linejoin': 'round' }, stairs); }
  E('path', { d: 'M60,120 L500,560', stroke: '#8C4E30', 'stroke-width': 8, 'stroke-linecap': 'round' }, stairs);   // handrail
  const DOTS = [], dr = rng(808);
  for (let k = 0; k < 14; k++) {
    const a = dr() * TAU, rr = 150 + dr() * 70;
    DOTS.push({ e: E('circle', { r: 11, fill: '#FFB27A', stroke: THERM, 'stroke-width': 3 }, Lfg), d: k * 0.32, sx: 640 + Math.cos(a) * rr * 1.1, sy: 420 + Math.sin(a) * rr * 0.7, ph: dr() * TAU });
  }
  const meMotor = pill(Lfg, 'motor: warm', { size: 30, color: '#FFB27A', stroke: THERM });
  const meRattle = pill(Lfg, 'rattle: sound → heat', { size: 30, color: '#FFB27A', stroke: THERM });
  // thin: dustpan, thermometer, chips
  const pan = G(Lfg);
  E('path', { d: 'M-70,0 L50,0 L60,-46 L-60,-46 Z', fill: '#4C6EF5', stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, pan);
  E('path', { d: 'M-60,-40 L-120,-110', stroke: '#4C6EF5', 'stroke-width': 12, 'stroke-linecap': 'round' }, pan);
  const brush = G(Lfg);
  E('path', { d: 'M0,0 L80,-120', stroke: '#B07A45', 'stroke-width': 10, 'stroke-linecap': 'round' }, brush);
  E('path', { d: 'M-30,0 L30,0 L36,22 L-36,22 Z', fill: '#E2B33C', stroke: SC_INK, 'stroke-width': 3 }, brush);
  const caught = pill(Lfg, 'caught: nothing', { size: 28, color: '#FF8A94', stroke: '#FF8A94' });
  const hardChip = pill(Lfg, 'very hard to collect and reuse', { size: 30, color: '#FFB27A', stroke: THERM });
  const thmG = G(Lfg), thm = thermometer(thmG, 150, C.heat);
  const legacy = pill(Lfg, 'my legacy: +0.1 °C', { size: 30, color: C.energy, stroke: C.energy });

  /* ================= confessionals ================= */
  const confT = enConf(Lbg, 'theo');
  const umb = G(Lfg);
  E('path', { d: 'M-60,0 Q0,-70 60,0 Q45,-10 30,0 Q15,-10 0,0 Q-15,-10 -30,0 Q-45,-10 -60,0 Z', fill: '#4CC9F0', stroke: SC_INK, 'stroke-width': 4 }, umb);
  E('path', { d: 'M0,0 L0,90 Q0,106 -16,102', fill: 'none', stroke: SC_INK, 'stroke-width': 6 }, umb);
  const umbTag = G(umb); tr(umbTag, 22, 52, 1, 8);
  E('line', { x1: -22, y1: -30, x2: 0, y2: -14, stroke: '#E9E2D0', 'stroke-width': 3 }, umbTag);
  E('rect', { x: -6, y: -20, width: 90, height: 40, rx: 6, fill: '#FFF7C2', stroke: '#8A6D00', 'stroke-width': 3 }, umbTag);
  T(umbTag, 39, 9, 'LOST', { size: 26, weight: 800, anchor: 'middle', fill: '#8A1A1A' });
  const confC = enConf(Lbg, 'con');

  /* ================= office (gone, spread) ================= */
  const offShot = G(Lbg);
  enOffice(offShot);
  const offDim = E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#06110F', opacity: 0.6 }, offShot);
  const poof = G(Lfg);
  [[-110, 10, 60], [-50, -40, 70], [30, -50, 76], [100, -10, 62], [60, 40, 60], [-40, 40, 64]].forEach(([x, y, r]) => E('circle', { cx: x, cy: y, r, fill: '#F2F7FA', stroke: SC_INK, 'stroke-width': 5 }, poof));
  [[-110, 10, 56], [-50, -40, 66], [30, -50, 72], [100, -10, 58], [60, 40, 56], [-40, 40, 60]].forEach(([x, y, r]) => E('circle', { cx: x, cy: y, r, fill: '#F2F7FA' }, poof));
  T(poof, 0, 18, 'POOF?', { size: 64, weight: 800, anchor: 'middle', fill: '#7550C4' });
  const poofSub = T(Lfg, 0, 0, 'wasted energy just... vanishes?', { size: 30, weight: 700, anchor: 'middle', fill: '#CFE7DF' });
  const denied = enStamp(Lfg, 'DENIED');
  // spread: the ledger page, 20 dots
  const sp = G(Lfg);
  enBoard(sp, 1040, 560);
  const spHead = T(sp, -170, -196, '**DISSIPATES**', { size: 64, weight: 800, anchor: 'middle', fill: THERM, boldFill: '#C25516' });
  const spSub = T(sp, 0, -130, '= spreads out into the surroundings', { size: 38, weight: 700, anchor: 'middle', fill: SC_INK });
  const spNever = chip(sp, 'never destroyed', { size: 30, fill: '#1E9E5A', color: '#FFFFFF' }); tr(spNever, 330, -206);
  const spStill = chip(sp, 'all 20 still here', { size: 28, fill: '#FFFFFF', color: '#1C5C4A', stroke: '#1C5C4A' }); tr(spStill, 360, 232);
  const SD = [], sr = rng(2020);
  for (let k = 0; k < 20; k++) {
    const a = sr() * TAU, r0 = 10 + sr() * 34;
    SD.push({ e: E('circle', { r: 13, fill: THERM, stroke: '#C25516', 'stroke-width': 3 }, sp), x0: Math.cos(a) * r0, y0: 70 + Math.sin(a) * r0 * 0.8, x1: -470 + (k % 5) * 235 + (sr() - 0.5) * 110, y1: -70 + Math.floor(k / 5) * 82 + (sr() - 0.5) * 40 });
  }

  /* ================= friction: two cutaways ================= */
  const fr = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#0E1A24', '#16303F', true) }, fr);
  const frL = G(fr), frR = G(fr);
  card(frL, 40, 120, 540, 410, { fill: linGrad('#CFE8F5', '#9FCDE6', true), stroke: '#FFFFFF', sw: 4 });
  card(frR, 620, 120, 540, 410, { fill: linGrad('#BFE6FF', '#E8F6FF', true), stroke: '#FFFFFF', sw: 4 });
  E('rect', { x: 624, y: 470, width: 532, height: 56, fill: '#8C9AA6' }, frR);
  const wheel = basWheel(frL); tr(wheel, 300, 330);
  const hotChip = chip(frL, 'brakes get HOT', { size: 28, fill: '#E8424F', color: '#FFFFFF' });
  const cyc = basCyclist(frR); tr(cyc, 880, 380, 1.1);
  const wind = [0, 1, 2, 3, 4, 5].map(() => E('path', { d: '', fill: 'none', stroke: '#5A8FB0', 'stroke-width': 5, 'stroke-linecap': 'round' }, frR));
  const cFr = chip(fr, 'friction', { size: 36, fill: '#FFC247', color: SC_INK });
  const cAir = chip(fr, 'air resistance', { size: 36, fill: '#7FD3FF', color: SC_INK });
  const aFr = arrow(fr, 360, 596, 480, 640, { color: '#FFFFFF', width: 6 });
  const aAir = arrow(fr, 840, 596, 720, 640, { color: '#FFFFFF', width: 6 });
  const cTh = chip(fr, '→ thermal stores', { size: 36, fill: THERM, color: SC_INK });

  /* ================= the cast ================= */
  const kav = cast(Lcast, 'kavya');
  const theo = cast(Lcast, 'theo');
  const jul = cast(Lcast, 'jules');
  const con = cast(Lcast, 'con');
  const kPalm = basPalms(kav.firstChild); tr(kPalm, 0, 122, 0.95);
  const kHeat = [-1, 1].map(sd => { const h = heatWaves(kav.firstChild, { n: 2, h: 70, spacing: 20, width: 6, color: '#FF6A1A' }); tr(h, sd * 70, 70); return h; });
  const kGlow = E('ellipse', { cx: 0, cy: 100, rx: 70, ry: 60, fill: glow('#FF6A1A') }, kav.firstChild);
  kav.firstChild.insertBefore(kGlow, kPalm);
  const tryIt = chip(Lfg, 'TRY IT!', { size: 44, fill: C.energy, color: '#3A3000', stroke: SC_INK, sw: 3 });
  const rubChip = pill(Lfg, 'friction → **thermal store** of your skin', { size: 32, color: C.ink, stroke: THERM });
  const ooh = T(Lfg, 0, 0, 'Ooh!', { size: 70, weight: 800, anchor: 'middle', fill: '#FFE45C' });
  enOutlineText(ooh, '#8A4A1A', 10);

  /* ================= cut list ================= */
  const cM = at('me') - 0.1, cTC = at('theo') - 0.1, cO = at('gone') - 0.1, cD = at('denied') - 0.1, cS = at('spread') - 0.1,
    cTh2 = at('thin') - 0.1, cF = at('friction') - 0.1, cK = at('rub') - 0.1, cW = at('warm') - 0.1;

  return t => {
    const sF = on(t, -1, cM), sM = on(t, cM, cTC), sTC = on(t, cTC, cO), sO = on(t, cO, cD), sD = on(t, cD, cS), sS = on(t, cS, cTh2),
      sT = on(t, cTh2, cF), sFr = on(t, cF, cK), sK = on(t, cK, cW), sW = on(t, cW, 1e9);
    let kavOn = 0, theoOn = 0, julOn = 0, conOn = 0;

    /* ---------- F: the flat, the fan ---------- */
    op(flatShot, sF || sK);
    op(rattle, 0); op(fiveChip, 0); op(elecIn, 0); op(air, 0); op(useArrow, 0); op(useCard, 0); op(wasteArrow, 0); op(wasteCard, 0);
    op(motorGlow, 0); op(motorHW, 0); op(kPalm, sK); kHeat.forEach(h => op(h, 0)); op(kGlow, 0);
    op(tryIt, 0); op(rubChip, 0); op(ooh, 0);
    if (sF) {
      flat.upd(t, 0); flat.clock(17 + t / 900);
      fan.upd(t, AMP);
      const push = P(t, at('useful') - 0.3, 1.2, ease);
      view(flatWrap, 1 + 0.06 * push, 650, 400, 650 - 40 * push, 400);
      kavOn = 1; op(kav, 1); tr(kav, 320 - 30 * push, 470, 1.05 * (1 + 0.06 * push));
      const kMood = t < at('useful') ? (t < mid('fan', 0.5) ? 'deadpan' : 'annoyed') : 'deadpan';
      kav.set({ t, talk: 0, mood: kMood, look: 0.8, sweat: 1 });
      popIn(fiveChip, t, at('fan') + 0.1, 960, 470);
      if (t > at('useful')) op(fiveChip, 1 - P(t, at('useful'), 0.25, linear));
      const rt = win(t, mid('fan', 0.6), at('useful') + 0.2, 0.2);
      op(rattle, rt); if (rt) tr(rattle, 650 + Math.sin(t * 30) * 6 * AMP, 230 + Math.cos(t * 25) * 4 * AMP, 1, Math.sin(t * 18) * 5 * AMP);
      // useful
      const ep = P(t, mid('useful', 0.05), 0.4, pop);
      op(elecIn, clamp(ep * 3)); elecArrow.set(P(t, mid('useful', 0.05), 0.5, ease));
      const ap = P(t, mid('useful', 0.3), 0.4, linear);
      op(air, ap);
      airL.forEach((l, i) => {
        const y = 330 + i * 20, ph = (t * 0.9 * AMP + i * 0.23) % 1, x0 = 740 + ph * 200;
        let d = `M${x0.toFixed(0)},${y}`; for (let k = 1; k <= 6; k++) d += ` L${(x0 + k * 30).toFixed(0)},${(y + Math.sin(k * 1.3 + t * 6 + i) * 7).toFixed(1)}`;
        attr(l, 'd', d); l.style.opacity = (Math.sin(ph * Math.PI) * 0.9).toFixed(3);
      });
      op(useArrow, ap); useArrow.set(P(t, mid('useful', 0.3), 0.6, ease));
      popIn(useCard, t, mid('useful', 0.35), 970, 210);
      // wasted
      const wp = P(t, mid('wasted', 0.25), 0.6, linear);
      op(motorGlow, 0.85 * wp); op(motorHW, wp); motorHW.upd(t);
      op(wasteArrow, wp > 0 ? 1 : 0); wasteArrow.set(P(t, mid('wasted', 0.3), 0.5, ease));
      popIn(wasteCard, t, mid('wasted', 0.42), 970, 540);
      if (t < at('wasted')) op(wasteCard, 0);
    }

    /* ---------- basement shots ---------- */
    op(basShot, sM || sT || sW); op(stairs, sM);
    DOTS.forEach(d => op(d.e, 0)); op(meMotor, 0); op(meRattle, 0);
    op(pan, 0); op(brush, 0); op(caught, 0); op(hardChip, 0); op(thmG, 0); op(legacy, 0);
    if (sM) {
      bas.upd(t);
      view(basWrap, 1 + 0.03 * P(t, cM, cTC - cM, linear), 600, 420, 600, 420);
      // dots tumble down the stairs, then settle around Theo
      let arrived = 0;
      DOTS.forEach(d => {
        const t0 = at('me') + d.d, q = clamp((t - t0) / 1.4), q2 = P(t, t0 + 1.4, 0.8, easeOut);
        if (t < t0) return;
        op(d.e, 1);
        let x, y;
        if (q < 1) { const sx = 90 + q * 400; x = sx; y = 140 + q * 400 - Math.abs(Math.sin(q * Math.PI * 7)) * 34; }
        else { x = lerp(490, d.sx, q2) + Math.sin(t * 1.5 + d.ph) * 6 * q2 * AMP; y = lerp(540, d.sy, q2) + Math.cos(t * 1.3 + d.ph) * 5 * q2 * AMP; if (q2 > 0.9) arrived++; }
        attr(d.e, 'cx', x); attr(d.e, 'cy', y);
      });
      theoOn = 1; op(theo, 1); tr(theo, 640, 440, 1.25);
      theo.set({ t, talk: scTalk(S, t, 'theo'), mood: 'sad', look: t < mid('me', 0.4) ? -0.7 : 0, glow: arrived > 4 ? 1 : 0 });
      popIn(meMotor, t, mid('me', 0.15), 940, 350);
      popIn(meRattle, t, mid('me', 0.38), 940, 430);
    }
    if (sT) {
      bas.upd(t);
      view(basWrap, 1, 600, 420, 600, 420);
      theoOn = 1; op(theo, 1); tr(theo, 560, 430, 1.25);
      theo.set({ t, talk: scTalk(S, t, 'theo'), mood: 'sad', look: t < mid('thin', 0.45) ? -0.7 : 0.6, glow: 0 });
      // the dustpan sweeps and catches nothing
      const sw = P(t, at('thin') + 0.3, 2.4, linear);
      const bx = 330 - 120 * Math.abs(Math.sin(sw * Math.PI * 2));
      op(pan, P(t, at('thin'), 0.3, linear)); tr(pan, 200, 650);
      op(brush, P(t, at('thin'), 0.3, linear)); tr(brush, bx, 630, 1, -10);
      popIn(caught, t, mid('thin', 0.36), 230, 540);
      popIn(hardChip, t, mid('thin', 0.3), 900, 340);
      const tp = P(t, mid('thin', 0.66), 0.4, pop);
      op(thmG, clamp(tp * 3)); tr(thmG, 820, 630); thm.set(0.3 + 0.05 * P(t, mid('thin', 0.72), 1.5, ease));
      popIn(legacy, t, mid('thin', 0.74), 980, 450);
    }
    if (sW) {
      bas.upd(t);
      const push = P(t, cW, S.D - cW, linear);
      view(basWrap, 1.15 + 0.08 * push, 600, 420, 600, 420);
      theoOn = 1; op(theo, 1); tr(theo, 600, 430, 1.7 + 0.12 * push);
      theo.set({ t, talk: scTalk(S, t, 'theo'), mood: t < end('warm') ? 'sad' : 'deadpan', look: 0, glow: 0.4 });
    }

    /* ---------- Theo's confessional: the lost umbrella ---------- */
    confT.set(sTC, t); op(umb, 0);
    if (sTC) {
      const push = P(t, cTC, cO - cTC, linear), k = 1 + 0.05 * push;
      confT.setAttribute('transform', `translate(430 400) scale(${k.toFixed(4)}) translate(-430 -400)`);
      theoOn = 1; op(theo, 1); tr(theo, 420, 420, 1.5 * k);
      theo.set({ t, talk: scTalk(S, t, 'theo'), mood: 'sad', look: t > mid('theo', 0.6) ? 0.8 : 0 });
      popIn(umb, t, mid('theo', 0.55), 760, 470, 1.6, 22);
    }

    /* ---------- office: Jules, POOF ---------- */
    op(offShot, sO || sS); op(poof, 0); op(poofSub, 0); op(sp, 0);
    if (sO) {
      op(offDim, 0.2);
      julOn = 1; op(jul, 1); tr(jul, 400, 420, 1.25);
      jul.set({ t, talk: scTalk(S, t, 'jules'), mood: t < mid('gone', 0.55) ? 'neutral' : 'shock', look: 0.7, arms: 1 });
      const pp = popIn(poof, t, mid('gone', 0.6), 880, 320, 1, Math.sin(t * 3) * 3);
      op(poofSub, P(t, mid('gone', 0.2), 0.3, linear)); tr(poofSub, 880, 530);
    }

    /* ---------- Constance: DENIED ---------- */
    confC.set(sD, t); op(denied, 0);
    if (sD) {
      const push = P(t, cD, cS - cD, linear), k = 1 + 0.06 * push;
      confC.setAttribute('transform', `translate(430 400) scale(${k.toFixed(4)}) translate(-430 -400)`);
      conOn = 1; op(con, 1); tr(con, 330, 400, 1.5 * k);
      con.set({ t, talk: scTalk(S, t, 'con'), mood: 'deadpan', look: t > end('denied') ? 0.5 : 0 });
      op(poof, 1); tr(poof, 880, 340, 1, 0);
      op(denied, 1); denied.set(P(t, mid('denied', 0.3), 0.35, linear)); tr(denied, 880, 410);
    }

    /* ---------- spread: DISSIPATES ---------- */
    if (sS) {
      op(offDim, 0.6);
      const lp = P(t, cS, 0.4, pop);
      op(sp, clamp(lp * 3)); tr(sp, 600, 412, Math.max(0.01, 0.9 + 0.1 * lp));
      popIn(spNever, t, mid('spread', 0.05), 330, -206);
      op(spHead, P(t, mid('spread', 0.3), 0.3, linear)); op(spSub, P(t, mid('spread', 0.45), 0.3, linear));
      const q = P(t, mid('spread', 0.42), (end('spread') - mid('spread', 0.42)) + 0.3, ease);
      SD.forEach((d, i) => {
        attr(d.e, 'cx', lerp(d.x0, d.x1, q) + Math.sin(t * 2 + i) * 3 * q * AMP); attr(d.e, 'cy', lerp(d.y0, d.y1, q));
        attr(d.e, 'r', lerp(13, 9, q)); d.e.style.opacity = lerp(1, 0.32, q).toFixed(3);
      });
      op(spStill, P(t, mid('spread', 0.9), 0.3, linear));
    }

    /* ---------- friction and air resistance ---------- */
    op(fr, sFr);
    if (sFr) {
      const t0 = at('friction');
      const ang = 360 * (1.6 * (t - t0) - 0.08 * (t - t0) * (t - t0)) * AMP;          // slowing down
      const heat = Math.max(P(t, mid('friction', 0.12), 1.0, linear) * 0.6, P(t, mid('friction', 0.78), 0.6, linear));
      wheel.upd(t, ang, heat);
      cyc.upd(t);
      wind.forEach((w, i) => {
        const y = 170 + i * 52, ph = (t * 0.8 * AMP + i * 0.17) % 1, x0 = 1140 - ph * 300;
        const near = Math.abs(y - 330) < 120 ? -1 : 0;
        let d = `M${x0.toFixed(0)},${y}`;
        for (let k = 1; k <= 6; k++) { const x = x0 - k * 30; d += ` L${x.toFixed(0)},${(y + (x < 1000 && x > 780 ? near * 0 + (y < 330 ? -26 : 26) * Math.sin((1000 - x) / 220 * Math.PI) : 0)).toFixed(1)}`; }
        attr(w, 'd', d); w.style.opacity = (Math.sin(ph * Math.PI) * P(t, mid('friction', 0.25), 0.4, linear)).toFixed(3);
      });
      popIn(cFr, t, mid('friction', 0.1), 310, 572);
      popIn(cAir, t, mid('friction', 0.25), 890, 572);
      aFr.set(P(t, mid('friction', 0.45), 0.4, ease)); aAir.set(P(t, mid('friction', 0.45), 0.4, ease));
      popIn(cTh, t, mid('friction', 0.5), 600, 652);
      popIn(hotChip, t, mid('friction', 0.8), 430, 160, 1, -4);
    }

    /* ---------- Kavya rubs her palms ---------- */
    if (sK) {
      flat.upd(t, 0); flat.clock(17.1);
      const push = P(t, cK, cW - cK, linear);
      view(flatWrap, 1.45 + 0.08 * push, 420, 470, 600, 440);
      fan.upd(t, AMP);
      kavOn = 1; op(kav, 1); tr(kav, 600, 430, 1.45 + 0.08 * push);
      const rubbing = P(t, mid('rub', 0.14), 0.3, linear);
      kPalm.upd(t, rubbing * (t > mid('cool', 0.5) ? 0.4 : 1));
      const hot = P(t, mid('rub', 0.45), 2.5, linear);
      kHeat.forEach(h => { op(h, hot); h.upd(t); }); op(kGlow, hot * 0.8);
      const mood = t < at('cool') ? (t < mid('rub', 0.5) ? 'neutral' : 'smug') : (t < mid('cool', 0.4) ? 'shock' : 'happy');
      kav.set({ t, talk: scTalk(S, t, 'kavya'), mood, look: t < at('cool') ? 0.3 : 0, sweat: 0.4 });
      const ty = popIn(tryIt, t, mid('rub', 0.02), 950, 230, 1, -6);
      if (t > mid('rub', 0.4)) op(tryIt, 1 - P(t, mid('rub', 0.4), 0.25, linear));
      popIn(rubChip, t, mid('rub', 0.55), 600, 150);
      const oo = P(t, at('cool') + 0.05, 0.4, pop) * (1 - P(t, end('cool') + 0.15, 0.2, linear));
      op(ooh, clamp(oo * 3)); tr(ooh, 930, 300, Math.max(0.01, 0.5 + 0.5 * oo), 8);
    }

    if (!kavOn) op(kav, 0);
    if (!theoOn) op(theo, 0);
    if (!julOn) op(jul, 0);
    if (!conOn) op(con, 0);
  };
});
