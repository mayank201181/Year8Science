/* Scene 2: Where does the energy go?
   Office: released energy, "?" -> Mitch's clipboard: request tickets fly in (movement, growth and repair,
   keeping warm 37 °C) -> Kavya on the track: "34 °C OUTSIDE" -> Mitch's confessional: mammals and birds keep a
   steady body temperature, the heating bill -> a muscle cell packed with mitochondria -> rows of tiny Mitches,
   "about 2000" -> the Mitch in ACCOUNTS -> cutaway: the folded inner membrane, large surface area -> accordion. */
scene('energy', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;

  /* ---------- local helpers ---------- */
  const on = (t, a, b) => (t >= a && t < b ? 1 : 0);
  const popAt = (el, t, t0, x, y, s, r) => { const p = P(t, t0, 0.45, pop); op(el, clamp(p * 2.5)); tr(el, x, y, Math.max(0.01, (s || 1) * (0.6 + 0.4 * p)), r); return p; };
  function enLabel(parent, text, o) {
    o = o || {};
    return chip(parent, text, { size: o.size || 30, fill: o.fill || 'rgba(10,27,39,0.88)', stroke: o.stroke || C.line, sw: 2, color: o.color || C.ink, weight: 700 });
  }
  const Lbg = G(root), Lcast = G(root), Lfg = G(root);

  /* ================= office: where + the request tickets ================= */
  const office = G(Lbg); scOffice(office);
  const clip = G(Lfg); scClipboard(clip, 1);
  const where = G(Lfg);
  const wSpark = spark(where, 52, { seed: 2 }); tr(wSpark, 300, 360);
  const qs = ['?', '?', '?'].map((q, i) => T(where, 0, 0, q, { size: 64, weight: 800, anchor: 'middle', fill: '#FFFFFF' }));
  const wTitle = T(where, 300, 200, 'Where does it go?', { size: 50, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  const wLab = enLabel(where, 'released energy', { size: 32, color: C.energy }); tr(wLab, 300, 500);

  const reqHead = T(Lfg, 315, 136, "THIS MORNING'S REQUESTS", { size: 32, weight: 800, anchor: 'middle', fill: C.mitoIn });
  function ticket(title, sub, col) {
    const g = G(Lfg);
    E('rect', { x: -245, y: -64, width: 490, height: 128, rx: 14, fill: '#FBF7EC', stroke: col, 'stroke-width': 5 }, g);
    E('rect', { x: -245, y: -64, width: 16, height: 128, rx: 6, fill: col }, g);
    E('circle', { cx: -160, cy: 0, r: 50, fill: col, opacity: 0.18 }, g);
    T(g, -90, -8, title, { size: 36, weight: 800, fill: SC_INK });
    T(g, -90, 34, sub, { size: 27, weight: 600, fill: '#4A5866', font: FB });
    g.icon = G(g); tr(g.icon, -160, 0);
    return g;
  }
  const tk1 = ticket('MOVEMENT', 'muscles contract', '#E8424F');
  const tk2 = ticket('GROWTH & REPAIR', 'new cells, proteins', '#3F9F5F');
  const tk3 = ticket('KEEPING WARM', 'a steady 37 °C', C.heatDk);
  // icon 1: a flexing arm
  const arm = G(tk1.icon);
  const fore = G(arm);
  E('path', { d: 'M-4,0 L-4,-44', stroke: '#C98E62', 'stroke-width': 18, 'stroke-linecap': 'round' }, fore);
  E('circle', { cx: -4, cy: -50, r: 12, fill: '#C98E62' }, fore);
  E('path', { d: 'M-40,14 L0,14', stroke: '#C98E62', 'stroke-width': 20, 'stroke-linecap': 'round' }, arm);
  const bicep = E('ellipse', { cx: -20, cy: 4, rx: 16, ry: 12, fill: '#D9A077', stroke: '#8A5A3A', 'stroke-width': 2 }, arm);
  const badge = G(tk1); tr(badge, 226, -44);
  E('circle', { r: 30, fill: '#E8424F', stroke: '#FFFFFF', 'stroke-width': 4 }, badge);
  const badgeT = T(badge, 0, 10, '1', { size: 28, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  // icon 2: a protein chain being built
  const beads = []; const BC = ['#FF6B5C', '#FFC247', '#56D69B', '#4CC9F0', '#B48CFF', '#FF5FA2'];
  for (let i = 0; i < 6; i++) beads.push(E('circle', { r: 9, fill: BC[i], stroke: SC_INK, 'stroke-width': 2 }, tk2.icon));
  const chainL = E('path', { d: '', fill: 'none', stroke: SC_INK, 'stroke-width': 3 }, tk2.icon);
  tk2.icon.insertBefore(chainL, tk2.icon.firstChild);
  // icon 3: a thermometer at 37 °C
  const th = thermometer(tk3.icon, 76, '#E8424F'); tr(th, 0, 30);
  const deg = T(Lfg, 0, 0, '37 °C', { size: 44, weight: 800, anchor: 'middle', fill: C.heat });

  /* ================= track: Kavya, 34 °C ================= */
  const trackShot = G(Lbg); const track = scTrack(trackShot);
  const heat = [0, 1, 2].map(i => { const h = heatWaves(trackShot, { n: 3, h: 90, spacing: 26 }); tr(h, 160 + i * 330, 470); return h; });
  const kTemps = G(Lfg);
  const tOut = enLabel(kTemps, 'outside: 34 °C', { size: 38, color: C.heat }); tr(tOut, 270, 190);
  const tIn = enLabel(kTemps, 'inside Kavya: 37 °C', { size: 34, color: C.energy }); tr(tIn, 270, 290);

  /* ================= confessional: mammals ================= */
  const conf = scConfessional(Lbg, 'mitch');
  const mam = G(Lfg);
  const mamChip = chip(mam, 'mammal', { size: 56, fill: C.heat, color: '#3A1406', stroke: '#FFD6BF', sw: 4 }); tr(mamChip, 860, 190);
  const mamCard = G(mam);
  E('rect', { x: -270, y: -120, width: 540, height: 240, rx: 18, fill: 'rgba(10,27,39,0.88)', stroke: C.line, 'stroke-width': 2 }, mamCard);
  T(mamCard, 0, -66, '**Mammals** and **birds** keep a', { size: 31, weight: 600, anchor: 'middle', boldFill: C.energy });
  T(mamCard, 0, -24, '**steady** body temperature', { size: 31, weight: 600, anchor: 'middle', boldFill: C.energy });
  E('path', { d: 'M-220,20 L-220,90 L220,90', fill: 'none', stroke: C.muted, 'stroke-width': 3 }, mamCard);
  const flat = E('path', { d: 'M-210,48 L200,48', fill: 'none', stroke: C.heat, 'stroke-width': 7, 'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': '1 1' }, mamCard);
  T(mamCard, -200, 30, '37 °C', { size: 26, weight: 700, fill: C.heat });
  T(mamCard, 210, 82, 'all day, every day', { size: 26, weight: 600, anchor: 'end', fill: C.muted, font: FB });
  const bill = G(Lfg);
  E('path', { d: 'M-190,-80 L190,-80 L190,70 L172,82 L154,70 L136,82 L118,70 L100,82 L82,70 L64,82 L46,70 L28,82 L10,70 L-8,82 L-26,70 L-44,82 L-62,70 L-80,82 L-98,70 L-116,82 L-134,70 L-152,82 L-170,70 L-190,82 Z', fill: '#FFFFFF', stroke: '#9AA6B2', 'stroke-width': 3 }, bill);
  T(bill, 0, -40, 'BILL: heating, 37 °C', { size: 30, weight: 800, anchor: 'middle', fill: SC_INK });
  T(bill, 0, 0, 'paid in: energy', { size: 28, weight: 600, anchor: 'middle', fill: '#4A5866', font: FB });
  const paid = T(bill, 0, 52, 'PAID: MITCH', { size: 30, weight: 800, anchor: 'middle', fill: '#C62828' });

  /* ================= a muscle cell packed with mitochondria ================= */
  const cellShot = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#2A0B12' }, cellShot);
  const cellW = G(cellShot);
  E('rect', { x: 110, y: 230, width: 980, height: 300, rx: 150, fill: '#B8414F', stroke: '#E8848E', 'stroke-width': 6 }, cellW);
  { let st = ''; for (let x = 170; x < 1040; x += 22) st += `M${x},${250} L${x},${510} `; E('path', { d: st, stroke: '#7E2533', 'stroke-width': 6, opacity: 0.5 }, cellW); }
  E('path', { d: 'M330,262 a40,12 0 1,0 80,0 a40,12 0 1,0 -80,0 M760,498 a40,12 0 1,0 80,0 a40,12 0 1,0 -80,0', fill: '#8C6FD6', stroke: '#C9B6FF', 'stroke-width': 2 }, cellW);
  const cr = rng(31); let md = '';
  for (let row = 0; row < 5; row++) for (let x = 190 + (row % 2) * 26; x < 1010; x += 52) {
    const y = 290 + row * 46 + (cr() - 0.5) * 8, xx = x + (cr() - 0.5) * 10;
    if (Math.hypot((xx - 600) / 470, (y - 380) / 140) > 1) continue;
    md += `M${(xx - 17).toFixed(1)},${y.toFixed(1)} a17,8 0 1,0 34,0 a17,8 0 1,0 -34,0 `;
  }
  const mitoPath = E('path', { d: md, fill: C.mito, stroke: C.mitoDk, 'stroke-width': 3 }, cellW);
  const mGlow = E('ellipse', { cx: 600, cy: 380, rx: 520, ry: 200, fill: glow(C.energy), opacity: 0 }, cellW);
  const cLab = enLabel(Lfg, 'muscle cell', { size: 34 });
  const cPacked = enLabel(Lfg, 'packed with mitochondria', { size: 36, color: C.mito, stroke: C.mito });
  const cWhy = T(Lfg, 600, 690, 'needs lots of energy  →  lots of mitochondria', { size: 30, weight: 700, anchor: 'middle', fill: C.energy });

  /* ================= 2000 Mitches + accounts ================= */
  const crowdShot = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#3A1A1E', '#5A2626', true) }, crowdShot);
  { let st = ''; for (let x = 20; x < 1200; x += 40) st += `M${x},0 L${x},750 `; E('path', { d: st, stroke: '#7A3434', 'stroke-width': 10, opacity: 0.35 }, crowdShot); }
  const dfs = E('defs', {}, root);
  const tiny = G(dfs, { id: 'energyTinyMitch' });
  E('rect', { x: -36, y: -22, width: 72, height: 44, rx: 22, fill: C.mito, stroke: C.mitoDk, 'stroke-width': 3 }, tiny);
  E('ellipse', { rx: 24, ry: 14, fill: '#FFE6D6' }, tiny);
  E('circle', { cx: -8, cy: -3, r: 3.5, fill: SC_INK }, tiny); E('circle', { cx: 8, cy: -3, r: 3.5, fill: SC_INK }, tiny);
  E('path', { d: 'M-6,7 L6,7', stroke: SC_INK, 'stroke-width': 2.5, 'stroke-linecap': 'round' }, tiny);
  E('path', { d: 'M-3,20 L3,20 L5,36 L0,41 L-5,36 Z', fill: '#3F5BD9', stroke: SC_INK, 'stroke-width': 1.5 }, tiny);
  const crowd = G(Lfg), tinies = [];
  const ACC = [2, 5];   // the one in accounts: row 2, column 5
  for (let r = 0; r < 5; r++) for (let c = 0; c < 8; c++) {
    if (r === ACC[0] && c === ACC[1]) continue;
    const u = E('use', { href: '#energyTinyMitch' }, crowd);
    tinies.push({ u, x: 90 + c * 92 + (r % 2) * 30, y: 190 + r * 96, d: (r * 8 + c) * 0.05, ph: r * 1.7 + c * 0.9 });
  }
  const ACCX = 90 + ACC[1] * 92, ACCY = 190 + ACC[0] * 96;
  const countG = G(Lfg);
  const countT = T(countG, 0, 0, '0', { size: 92, weight: 800, anchor: 'middle', fill: C.energy });
  T(countG, 0, 50, 'mitochondria in one', { size: 28, weight: 600, anchor: 'middle', fill: C.mitoIn });
  T(countG, 0, 86, 'muscle cell (about)', { size: 28, weight: 600, anchor: 'middle', fill: C.mitoIn });
  const accBox = G(Lfg);
  E('rect', { x: -110, y: -96, width: 220, height: 190, rx: 12, fill: 'rgba(20,10,14,0.85)', stroke: '#FFFFFF', 'stroke-width': 4, 'stroke-dasharray': '12 8' }, accBox);
  const accHead = enLabel(accBox, 'ACCOUNTS', { size: 32, color: '#FFFFFF', fill: '#3F5BD9', stroke: '#FFFFFF' }); tr(accHead, 0, -96);
  const accM = scChar(accBox, 'mitch', { mood: 'smug' }); tr(accM, 0, 18, 0.62);
  const specs = G(accM);
  E('circle', { cx: -26, cy: -6, r: 24, fill: 'rgba(200,230,255,0.25)', stroke: SC_INK, 'stroke-width': 5 }, specs);
  E('circle', { cx: 26, cy: -6, r: 24, fill: 'rgba(200,230,255,0.25)', stroke: SC_INK, 'stroke-width': 5 }, specs);
  E('path', { d: 'M-2,-6 L2,-6', stroke: SC_INK, 'stroke-width': 5 }, specs);
  const calcG = G(accBox); tr(calcG, 70, 70);
  E('rect', { x: -22, y: -28, width: 44, height: 56, rx: 6, fill: '#9AA6B2', stroke: SC_INK, 'stroke-width': 3 }, calcG);
  E('rect', { x: -15, y: -21, width: 30, height: 14, fill: '#CFF5D8' }, calcG);

  /* ================= cutaway: the folded inner membrane ================= */
  const cutShot = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#14243A', '#2A1A30', true) }, cutShot);
  const cut = G(cutShot);
  const CX = 600, CY = 370, OW = 840, OH = 360, IW = 790, IH = 312, IR = 120;
  E('rect', { x: CX - OW / 2, y: CY - OH / 2, width: OW, height: OH, rx: 150, fill: ball(C.mito, C.mitoDk), stroke: C.mitoDk, 'stroke-width': 8 }, cut);
  const memGlow = E('path', { d: '', fill: 'none', stroke: C.energy, 'stroke-width': 22, opacity: 0, 'stroke-linejoin': 'round' }, cut);
  const mem = E('path', { d: '', fill: C.mitoIn, stroke: C.mitoDk, 'stroke-width': 7, 'stroke-linejoin': 'round' }, cut);
  function membrane(N, depthK) {
    const L = CX - IW / 2 + IR, R = CX + IW / 2 - IR, top = CY - IH / 2, bot = CY + IH / 2, span = R - L;
    const n = Math.ceil(N - 1e-6), w = Math.min(34, span / N * 0.42), tops = [], bots = [];
    for (let i = 0; i < n; i++) {
      const x = L + (i + 0.5) * span / N, dep = 196 * depthK * (i === n - 1 ? clamp(N - (n - 1)) : 1);
      (i % 2 === 0 ? tops : bots).push([x, dep]);
    }
    const r = w / 2;
    let d = `M${L},${top}`;
    tops.forEach(([x, dep]) => { if (dep < 2) return; d += ` L${(x - r).toFixed(1)},${top} L${(x - r).toFixed(1)},${(top + dep - r).toFixed(1)} A${r.toFixed(1)},${r.toFixed(1)} 0 0 0 ${(x + r).toFixed(1)},${(top + dep - r).toFixed(1)} L${(x + r).toFixed(1)},${top}`; });
    d += ` L${R},${top} A${IR},${IH / 2} 0 0 1 ${R},${bot}`;
    bots.slice().reverse().forEach(([x, dep]) => { if (dep < 2) return; d += ` L${(x + r).toFixed(1)},${bot} L${(x + r).toFixed(1)},${(bot - dep + r).toFixed(1)} A${r.toFixed(1)},${r.toFixed(1)} 0 0 0 ${(x - r).toFixed(1)},${(bot - dep + r).toFixed(1)} L${(x - r).toFixed(1)},${bot}`; });
    d += ` L${L},${bot} A${IR},${IH / 2} 0 0 1 ${L},${top} Z`;
    let len = 2 * span + 2 * Math.PI * IR * 0.9;
    tops.concat(bots).forEach(([, dep]) => { len += 2 * dep; });
    return { d, len };
  }
  const lenSmooth = membrane(0.0001, 0).len, lenMax = membrane(10, 1).len;
  const lbInner = labelLine(Lfg, 880, 150, 0, 0, 'inner membrane', { size: 30, fill: C.energy, line: C.energy });
  const lbLine = lbInner.querySelector('line'), lbDot = lbInner.querySelector('circle');
  const foldChip = chip(Lfg, 'folded = large surface area', { size: 36, fill: C.energy, color: '#3A2600', stroke: C.energyLt, sw: 3 });
  const saG = G(Lfg); tr(saG, 380, 650);
  T(saG, -16, 22, 'surface area', { size: 28, weight: 700, anchor: 'end', fill: C.ink });
  const saMeter = meter(saG, { w: 440, h: 28, color: C.energy });
  const saSmooth = E('line', { x1: 0, y1: -10, x2: 0, y2: 38, stroke: '#FFFFFF', 'stroke-width': 4 }, saG);
  const saSmoothT = T(saG, 0, 70, 'if smooth', { size: 26, weight: 600, anchor: 'middle', fill: C.muted, font: FB });
  const notes = [0, 1, 2].map(i => T(Lfg, 0, 0, i % 2 ? '♫' : '♪', { size: 46, weight: 700, anchor: 'middle', fill: '#FFFFFF' }));
  const moreChip = enLabel(Lfg, 'more folds, more room to work', { size: 30, color: C.energy });

  /* ================= the cast ================= */
  const mitch = scChar(Lcast, 'mitch', { mood: 'deadpan' });
  const kav = scChar(Lcast, 'kavya', { mood: 'annoyed' });
  Lcast.appendChild(mitch);

  const cK = at('singapore') - 0.06, cC = at('mammal') - 0.06, cM = at('many') - 0.06, cT = at('colleagues') - 0.06, cX = at('folds') - 0.06;

  return t => {
    const sO = on(t, -1, cK), sK = on(t, cK, cC), sC = on(t, cC, cM), sM = on(t, cM, cT), sT = on(t, cT, cX), sX = on(t, cX, 1e9);
    let mitchOn = 0;
    const talk = scTalk(S, t, 'mitch');

    /* ---------- office ---------- */
    op(office, sO);
    if (sO) {
      const push = P(t, at('where'), cK - at('where'), linear);
      office.setAttribute('transform', `translate(900 420) scale(${(1 + 0.04 * push).toFixed(4)}) translate(-900 -420)`);
      mitchOn = 1; tr(mitch, 910, 420, 1.25);
      let mood = 'deadpan', look = 0;
      if (t > at('list') - 0.2 && t < end('list') + 0.2) { mood = 'neutral'; look = 0.8; }
      else if (t > mid('muscles', 0.62) && t < at('growth')) mood = 'annoyed';
      else if (t > at('growth') && t < end('growth')) { mood = 'neutral'; look = -0.5; }
      mitch.set({ t, talk, mood, look });
      op(clip, 1); tr(clip, 1080, 520 + Math.sin(t * 1.3) * 3 * AMP, 0.75, 6);
      // where: a spark of released energy and question marks
      const fw = win(t, at('where') - 0.1, at('list') + 0.3, 0.25);
      op(where, fw);
      if (fw) {
        const sp = P(t, at('where'), 0.5, pop); tr(wSpark, 300, 360, Math.max(0.01, sp)); wSpark.upd(t);
        qs.forEach((q, i) => { const p = P(t, mid('where', 0.3 + i * 0.15), 0.4, pop); op(q, clamp(p * 2)); const a = -2.2 + i * 1.1; q.setAttribute('transform', `translate(${(300 + Math.cos(a) * 120).toFixed(1)} ${(380 + Math.sin(a) * 100 + Math.sin(t * 3 + i) * 6 * AMP).toFixed(1)}) scale(${Math.max(0.01, p).toFixed(3)})`); });
        op(wTitle, P(t, mid('where', 0.5), 0.3, linear)); op(wLab, P(t, mid('where', 0.15), 0.3, linear));
      }
      op(reqHead, P(t, mid('list', 0.4), 0.3, linear));
      const fly = (g, t0, y, r) => { const p = P(t, t0, 0.55, easeOut); op(g, p > 0 ? 1 : 0); tr(g, lerp(-320, 315, p), y + (1 - p) * -60, 1, lerp(-25, r, p)); return p; };
      fly(tk1, at('muscles') + 0.1, 245, -1.5); fly(tk2, at('growth') + 0.1, 390, 1); fly(tk3, at('warm') + 0.1, 535, -1);
      // movement: flexing arm and a badge counting the muscles' requests
      const flex = 0.5 + 0.5 * Math.sin(t * 5);
      tr(fore, -4, 14, 1, -30 * flex * AMP - 10); attr(bicep, 'ry', 10 + 6 * flex);
      const n = Math.round(Math.pow(clamp((t - mid('muscles', 0.5)) / 3.2), 1.6) * 98) + 1;
      setText(badgeT, n >= 99 ? '99+' : String(n)); tr(badge, 226, -44, 1 + 0.12 * Math.sin(Math.PI * (((t * 4) % 1))) * (n > 1 && n < 99 ? 1 : 0));
      // growth: the chain links bead by bead
      const built = clamp((t - mid('growth', 0.45)) / 2.2) * 6;
      let cd = '';
      beads.forEach((b, i) => {
        const p = clamp(built - i), x = -40 + i * 16, y = (i % 2 ? 10 : -10);
        tr(b, lerp(-40 + ((i * 37) % 70), x, p), lerp(i % 2 ? -34 : 34, y, p)); if (p >= 1 && i) cd += (cd ? ' L' : 'M') + `${x - 16},${(i - 1) % 2 ? 10 : -10} L${x},${y}`;
      });
      attr(chainL, 'd', cd);
      th.set(P(t, mid('warm', 0.2), 1.2) * 0.72);
      const dp = P(t, mid('warm', 0.35), 0.4, pop);
      op(deg, clamp(dp * 2.5) * (1 - P(t, cK - 0.01, 0.01, linear))); deg.setAttribute('transform', `translate(690 ${(560).toFixed(0)}) scale(${Math.max(0.01, 0.6 + 0.4 * dp).toFixed(3)})`);
    } else { op(clip, 0); op(where, 0); op(reqHead, 0); [tk1, tk2, tk3, deg].forEach(g => op(g, 0)); }

    /* ---------- track: 34 °C outside ---------- */
    op(trackShot, sK); op(kTemps, sK);
    if (sK) {
      track.upd(t, 0); heat.forEach(h => h.upd(t));
      tr(kav, 790, 545, 1.75 * (1 + 0.03 * P(t, cK, cC - cK, linear)));
      kav.set({ t, talk: scTalk(S, t, 'kavya'), mood: t > end('singapore') ? 'deadpan' : 'annoyed', sweat: 1, look: t > mid('singapore', 0.1) && t < mid('singapore', 0.45) ? -0.7 : 0 });
      op(kav, 1);
      popAt(tOut, t, mid('singapore', 0.08), 270, 200, 1, -2);
      popAt(tIn, t, mid('singapore', 0.55), 270, 300, 1, 2);
    } else op(kav, 0);

    /* ---------- confessional: mammal ---------- */
    conf.set(sC, t);
    op(mam, sC); op(bill, sC);
    if (sC) {
      const push = P(t, end('mammal'), 0.9);
      conf.setAttribute('transform', `translate(330 400) scale(${(1 + 0.05 * push).toFixed(4)}) translate(-330 -400)`);
      mitchOn = 1; tr(mitch, 330 + 0, 410, 1.38 * (1 + 0.05 * push));
      const mood = t > mid('mammal', 0.62) && t < end('mammal') ? 'annoyed' : 'deadpan';
      mitch.set({ t, talk, mood, look: t > mid('mammal', 0.25) && t < mid('mammal', 0.6) ? 0.7 : 0 });
      popAt(mamChip, t, mid('mammal', 0.08), 860, 190);
      const cp = P(t, mid('mammal', 0.22), 0.4, pop); op(mamCard, clamp(cp * 2.5)); tr(mamCard, 860, 365, Math.max(0.01, 0.8 + 0.2 * cp));
      attr(flat, 'stroke-dashoffset', (1 - P(t, mid('mammal', 0.35), 1.5, linear)).toFixed(4));
      const bp = P(t, mid('mammal', 0.72), 0.5, easeOut); op(bill, bp > 0 ? 1 : 0); tr(bill, 860, 600 + 200 * (1 - bp), 1, -2);
      const pp = P(t, mid('mammal', 0.9), 0.3, pop); op(paid, clamp(pp * 2)); paid.setAttribute('transform', `rotate(-6 0 52) translate(0 52) scale(${Math.max(0.01, 1.6 - 0.6 * pp).toFixed(3)}) translate(0 -52)`);
    }

    /* ---------- a muscle cell packed with mitochondria ---------- */
    op(cellShot, sM);
    if (sM) {
      const z = P(t, cM, 2.2, easeOut);
      cellW.setAttribute('transform', `translate(600 380) scale(${(1.9 - 0.9 * z).toFixed(4)}) translate(-600 -380)`);
      op(mGlow, 0.35 * P(t, mid('many', 0.55), 0.6, linear) * (0.7 + 0.3 * wave(t, 1.4)));
      op(cLab, P(t, mid('many', 0.25), 0.3, linear)); tr(cLab, 230, 170);
      popAt(cPacked, t, mid('many', 0.5), 600, 600);
      op(cWhy, P(t, mid('many', 0.75), 0.4, linear));
    } else { op(cLab, 0); op(cPacked, 0); op(cWhy, 0); }

    /* ---------- 2000 Mitches, the one in accounts ---------- */
    op(crowdShot, sT); op(crowd, sT); op(countG, sT); op(accBox, sT);
    if (sT) {
      const acc = P(t, at('accounts') + 0.1, 0.4);
      tinies.forEach(m => {
        const p = P(t, at('colleagues') + m.d, 0.35, pop);
        m.u.setAttribute('transform', `translate(${m.x} ${(m.y + Math.sin(t * 2.4 + m.ph) * 3 * AMP).toFixed(1)}) scale(${Math.max(0.01, p).toFixed(3)})`);
        m.u.style.opacity = (1 - 0.6 * acc).toFixed(3);
      });
      const cnt = Math.round(2000 * P(t, mid('colleagues', 0.3), 1.6, easeOut) / 10) * 10;
      setText(countT, '≈ ' + cnt);
      tr(countG, 980, 200, 1 + 0.1 * Math.sin(Math.PI * P(t, mid('colleagues', 0.3) + 1.6, 0.35, linear)));
      // the accounts Mitch: a box, glasses, smug
      const ap = P(t, at('colleagues') + 1.2, 0.35, pop);
      const bx = lerp(ACCX, 430, acc), by = lerp(ACCY, 420, acc), bs = lerp(0.45, 1.25, acc);
      op(accBox, Math.max(clamp(ap * 2) * 1, 0)); tr(accBox, bx, by, Math.max(0.01, bs * ap));
      accBox.firstChild.style.opacity = acc.toFixed(3); op(accHead, acc); op(calcG, acc); op(specs, acc);
      accM.set({ t: t + 1.3, mood: acc > 0.5 ? 'smug' : 'deadpan', look: acc > 0.5 ? 0.8 : 0 });
      mitchOn = 1;
      const sideEye = t > at('accounts') + 0.3;
      tr(mitch, 1000, 520, 1.0);
      mitch.set({ t, talk, mood: sideEye ? 'annoyed' : 'deadpan', look: sideEye ? -1 : 0 });
    }

    /* ---------- cutaway: folds + accordion ---------- */
    op(cutShot, sX); op(lbInner, 0); op(foldChip, 0); op(saG, 0); op(moreChip, 0); notes.forEach(n => op(n, 0));
    if (sX) {
      const grow = P(t, mid('accordion', 0.55), 1.6, ease);
      const N = 6 + 4 * grow, depthK = P(t, at('folds') + 0.2, 1.2, ease);
      const sq = t > at('accordion') ? Math.sin(Math.PI * 2 * (t - at('accordion')) / 1.1) * P(t, at('accordion'), 0.4, linear) * AMP : 0;
      cut.setAttribute('transform', `translate(${CX} ${CY}) scale(${(1 - 0.09 * sq).toFixed(4)} ${(1 + 0.03 * sq).toFixed(4)}) translate(${-CX} ${-CY})`);
      const m = membrane(N, depthK);
      attr(mem, 'd', m.d); attr(memGlow, 'd', m.d);
      op(memGlow, 0.55 * win(t, mid('folds', 0.15), end('folds'), 0.4) * (0.7 + 0.3 * wave(t, 1.2)));
      const lx = CX - IW / 2 + IR + 0.5 * (IW - 2 * IR) / N;   // the first top fold
      attr(lbLine, 'x2', lx); attr(lbLine, 'y2', CY - IH / 2 + 4); attr(lbDot, 'cx', lx); attr(lbDot, 'cy', CY - IH / 2 + 4);
      lbLine.setAttribute('x1', 872); lbLine.setAttribute('x2', (CX + (lx - CX) * (1 - 0.09 * sq)).toFixed(1)); attr(lbDot, 'cx', CX + (lx - CX) * (1 - 0.09 * sq));
      op(lbInner, P(t, mid('folds', 0.08), 0.3, linear));
      const fp = P(t, mid('folds', 0.6), 0.45, pop); op(foldChip, clamp(fp * 2.5)); tr(foldChip, 600, 595, Math.max(0.01, 0.7 + 0.3 * fp));
      const sp = P(t, mid('folds', 0.7), 0.4, linear); op(saG, sp);
      saMeter.set(lerp(lenSmooth, m.len, sp) / lenMax);
      const sx = 440 * lenSmooth / lenMax; attr(saSmooth, 'x1', sx); attr(saSmooth, 'x2', sx); attr(saSmoothT, 'x', sx);
      // the accordion: Mitch in the corner, music notes
      const ma = P(t, at('accordion') - 0.05, 0.3, pop);
      mitchOn = ma > 0 ? 1 : 0;
      op(mitch, clamp(ma * 2)); tr(mitch, 1060, 615, Math.max(0.01, 0.62 * ma));
      mitch.set({ t, talk, mood: 'deadpan', look: -0.6 });
      const nOn = win(t, at('accordion') + 0.2, end('accordion') + 0.6, 0.3);
      notes.forEach((nt, i) => { const q = ((t - at('accordion')) * 0.45 + i / 3) % 1; op(nt, nOn * Math.sin(Math.PI * clamp(q))); tr(nt, 1066 + i * 34 + Math.sin(q * 6 + i) * 10, 560 - q * 120); });
      if (t > mid('accordion', 0.5)) { op(foldChip, 0); popAt(moreChip, t, mid('accordion', 0.52), 600, 595); }
    }

    if (!mitchOn) op(mitch, 0); else if (!sX) op(mitch, 1);
  };
});
