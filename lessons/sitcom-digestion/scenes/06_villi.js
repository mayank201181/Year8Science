/* Scene 6: Vinny and the end of the line.
   Shots: inside the small intestine, villi absorbing molecules, zoom to one -> Vinny alone, waving, Percy
   introduces him (lower third VINNY, long stare) -> the villus diagram builds Big, Thin, Bloody, Lacteal
   (30 m² = half a badminton court; one cell thick; capillaries carry glucose and amino acids away; the
   lacteal takes the fat products) -> horror-film poster (Kavya; "starring VINNY") -> the line map to station
   5, then the large intestine absorbing water -> Phoebe gives the leftovers bulk -> peristalsis: nothing to
   grip, then a fibre mass to push -> "I'm... useful?" (gold star) -> THE NEXT MORNING: rectum stores, anus
   -> EGESTION card -> Kavya in pyjamas: "excretion?" -> Percy's confessional: excretion = waste from your
   cells' reactions; CO₂ by the lungs, urea (liver) by the kidneys -> Phoebe's stop (suitcase, waving)
   -> AL7 platform, censored, "THIS SERVICE TERMINATES HERE", lights dim. */
scene('villi', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;
  const talk = (t, who) => scTalk(S, t, who);

  /* ---------- local helpers (prefixed villi) ---------- */
  function villiCam(el, k, cx, cy, px, py) { el.setAttribute('transform', `translate(${(px ?? cx).toFixed(1)} ${(py ?? cy).toFixed(1)}) scale(${k.toFixed(4)}) translate(${(-cx).toFixed(1)} ${(-cy).toFixed(1)})`); }
  function villiPop(el, t, t0, x, y, s, r) { const p = P(t, t0, 0.4, pop); op(el, clamp(p * 2.5)); tr(el, x, y, Math.max(0.01, (s || 1) * (0.6 + 0.4 * p)), r); return p; }
  // text with real subscripts: 'CO_2' -> CO₂
  function villiRich(parent, x, y, str, o) {
    o = o || {};
    const size = o.size || 32, sub = Math.round(size * 0.62), dy = Math.round(size * 0.24);
    const t = E('text', { x, y, 'font-size': size, 'font-weight': o.weight || 700, fill: o.fill || C.ink, 'text-anchor': o.anchor || 'middle', 'font-family': FD }, parent);
    str.split(/_(\d+)/).forEach((seg, i) => { if (!seg) return; const ts = E('tspan', i % 2 ? { 'font-size': sub, dy } : (i > 0 ? { dy: -dy } : {}), t); ts.textContent = seg; });
    return t;
  }
  function villiPopAt(el, t, t0, cx, cy) { const p = P(t, t0, 0.4, pop), s = Math.max(0.01, 0.6 + 0.4 * p); op(el, clamp(p * 2.5)); el.setAttribute('transform', `translate(${cx} ${cy}) scale(${s.toFixed(3)}) translate(${-cx} ${-cy})`); }
  function villiSeat(ch, wrap) { if (ch.parentNode !== wrap) wrap.appendChild(ch); }
  const label = (parent, text, o) => { o = o || {}; return chip(parent, text, { size: o.size || 32, fill: o.fill || 'rgba(10,27,39,0.9)', stroke: o.stroke || C.line, sw: 3, color: o.color || C.ink, weight: 700 }); };
  // small molecules: glucose hexagon, amino-acid square, fatty acid zigzag, glycerol bar
  function villiMol(parent, kind, s) {
    const g = G(parent); s = s || 1;
    if (kind === 'glu') molGlucose(g, 13 * s);
    else if (kind === 'amino') { const cols = [['#FF8A7A', '#B5372D'], ['#7FD6F7', '#2386B5'], ['#C2EDA2', '#4E9A3A']][Math.round(s * 7) % 3]; E('rect', { x: -12 * s, y: -12 * s, width: 24 * s, height: 24 * s, rx: 5 * s, fill: ball(cols[0], cols[1]), stroke: cols[1], 'stroke-width': 2.5 }, g); }
    else if (kind === 'fa') { let d = 'M-24,0'; for (let k = 1; k <= 4; k++) d += ` L${-24 + k * 12},${k % 2 ? -7 : 0}`; E('path', { d, fill: 'none', stroke: '#B57B12', 'stroke-width': 9, 'stroke-linejoin': 'round', 'stroke-linecap': 'round', transform: `scale(${s})` }, g); E('path', { d, fill: 'none', stroke: '#FFD25A', 'stroke-width': 5, 'stroke-linejoin': 'round', 'stroke-linecap': 'round', transform: `scale(${s})` }, g); }
    else E('rect', { x: -7 * s, y: -18 * s, width: 14 * s, height: 36 * s, rx: 6 * s, fill: '#FFF2C2', stroke: '#C9A84A', 'stroke-width': 3 }, g);
    return g;
  }
  // Phoebe with her right arm raised to wave (g.arm) and an optional suitcase (g.case)
  function villiWaver(parent, s) {
    const c = cast(parent, 'phoebe', { s, mood: 'sad' }), inner = c.firstChild;
    attr(inner.children[0], 'd', 'M-44,4 Q-60,40 -58,78'); attr(inner.children[1], 'd', 'M-44,4 Q-60,40 -58,78');
    c.arm = G(inner); inner.insertBefore(c.arm, inner.children[2]);
    E('path', { d: 'M0,0 Q34,-10 40,-66', fill: 'none', stroke: SC_INK, 'stroke-width': 11, 'stroke-linecap': 'round' }, c.arm);
    E('path', { d: 'M0,0 Q34,-10 40,-66', fill: 'none', stroke: '#9BD77A', 'stroke-width': 5, 'stroke-linecap': 'round' }, c.arm);
    E('circle', { cx: 40, cy: -72, r: 9, fill: '#9BD77A', stroke: SC_INK, 'stroke-width': 3 }, c.arm);
    c.case = G(inner);
    E('rect', { x: -96, y: 84, width: 64, height: 46, rx: 8, fill: '#B5652A', stroke: SC_INK, 'stroke-width': 4 }, c.case);
    E('path', { d: 'M-76,84 L-76,74 L-52,74 L-52,84', fill: 'none', stroke: SC_INK, 'stroke-width': 4 }, c.case);
    E('rect', { x: -96, y: 102, width: 64, height: 8, fill: '#E9C46A' }, c.case);
    c.waveArm = (t, k) => tr(c.arm, 44, 4, 1, (k || 1) * 16 * Math.sin(t * 7) * AMP);
    return c;
  }

  /* ---------- layers ---------- */
  const shots = {}, mk = k => (shots[k] = G(root));
  const hud = G(root);

  /* ================= GUT: villi absorbing ================= */
  const sGut = mk('gut'), gutCam = G(sGut);
  const gut = mgGut(gutCam);
  const MOLS = [];
  { const r = rng(808), kinds = ['glu', 'amino', 'fa', 'glu', 'gly', 'amino', 'glu', 'amino', 'fa'];
    kinds.forEach((k, i) => MOLS.push({ g: villiMol(gutCam, k, 1.1 + (i % 3) * 0.12), x0: 60 + i * 125, y0: 300 + r() * 150, up: i % 2 === 0, ph: r() })); }
  const gChips = G(sGut);
  const cVilli = label(gChips, 'millions of tiny villi', { size: 40, color: '#FFD0DC', stroke: '#FF7FA6' });
  const cAbsorb = label(gChips, 'they ABSORB the small molecules', { size: 34, color: C.energy, stroke: C.energy });
  const cOne = G(hud);
  { const a = label(cOne, 'villi = many', { size: 38, color: '#FFD0DC', stroke: '#FF7FA6' }); tr(a, -170, 0); const b = label(cOne, 'one = a villus', { size: 38, color: C.energy, stroke: C.energy }); tr(b, 190, 0); }

  /* ================= VINNY ================= */
  const sVin = mk('vin'), vinCam = G(sVin);
  const vinDim = E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#1A0610', opacity: 0.45 }, sVin);
  const vinPercyW = G(vinCam), vinVinnyW = G(vinCam);
  const vChips = G(sVin);
  const cTalk = label(vChips, "doesn't talk", { size: 34 });
  const cAbs = label(vChips, 'absorbs', { size: 40, color: C.energy, stroke: C.energy });
  const ltVinny = scLowerThird(hud, ...MG_NAME.vinny);

  /* ================= DIAGRAM: Big, Thin, Bloody, Lacteal ================= */
  const sDia = mk('dia');
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#2A0E18', '#45172A', true) }, sDia);
  E('ellipse', { cx: 380, cy: 420, rx: 330, ry: 300, fill: glow('#FF8FA6'), opacity: 0.18 }, sDia);
  const VX = 380, VY = 400;
  const capGlow = E('ellipse', { cx: VX, cy: VY + 40, rx: 150, ry: 260, fill: glow('#FF3B4F'), opacity: 0 }, sDia);
  const lacGlow = E('ellipse', { cx: VX, cy: VY + 30, rx: 70, ry: 250, fill: glow('#FFF4C8'), opacity: 0 }, sDia);
  const vcut = mgVillusCut(sDia); tr(vcut, VX, VY);
  const outlineD = `M${VX - 110},${VY + 210} L${VX - 110},${VY - 110} A110,110 0 0 1 ${VX + 110},${VY - 110} L${VX + 110},${VY + 210}`;
  const bigGlow = E('path', { d: outlineD, fill: 'none', stroke: C.energy, 'stroke-width': 12, 'stroke-linecap': 'round', opacity: 0 }, sDia);
  const wallGlow = E('path', { d: outlineD, fill: 'none', stroke: '#FFB000', 'stroke-width': 26, opacity: 0 }, sDia);
  sDia.insertBefore(wallGlow, vcut.nextSibling);
  // molecules for the capillaries and the lacteal
  const capMols = [0, 1, 2, 3].map(i => villiMol(sDia, i % 2 ? 'amino' : 'glu', 1));
  const lacMols = [0, 1, 2, 3].map(i => villiMol(sDia, i % 2 ? 'gly' : 'fa', 0.9));
  const diaPercyW = G(sDia);
  // the mnemonic strip
  const strip = G(sDia);
  card(strip, 620, 112, 540, 118, { fill: 'rgba(14,26,36,0.92)', stroke: C.energy, sw: 3 });
  const WORDS = ['Big', 'Thin', 'Bloody', 'Lacteal'], LINES = ['big', 'thin', 'bloody', 'lacteal'];
  const letters = WORDS.map((w, i) => { const g = G(strip); const x = 690 + i * 130; T(g, 0, 0, w[0], { size: 64, weight: 800, anchor: 'middle', fill: i === 2 ? '#FF6B6B' : C.energy }); T(g, 0, 40, w, { size: 26, weight: 700, anchor: 'middle', fill: C.ink }); g.mx = x; return g; });
  const stripTick = tick(strip, 18); tr(stripTick, 1128, 128);
  // big: the badminton court
  const dBig = G(sDia);
  T(dBig, 890, 284, 'huge **surface area**', { size: 36, weight: 600, anchor: 'middle', boldFill: C.energy });
  const court = G(dBig);
  E('rect', { x: 690, y: 312, width: 400, height: 200, fill: '#3E8E5A', stroke: '#FFFFFF', 'stroke-width': 4 }, court);
  const courtFill = E('rect', { x: 692, y: 314, width: 0, height: 196, fill: C.energy, opacity: 0.75 }, court);
  E('path', { d: 'M690,334 L1090,334 M690,490 L1090,490 M750,312 L750,512 M1030,312 L1030,512 M840,312 L840,512 M940,312 L940,512 M750,412 L840,412 M940,412 L1030,412', stroke: '#FFFFFF', 'stroke-width': 3, fill: 'none', opacity: 0.85 }, court);
  E('line', { x1: 890, y1: 300, x2: 890, y2: 524, stroke: '#E9F2F7', 'stroke-width': 6 }, court);
  const bigNum = T(dBig, 890, 572, 'about 30 m²', { size: 50, weight: 800, anchor: 'middle', fill: C.energy });
  const bigSub = T(dBig, 890, 616, 'the whole lining, flat: half a badminton court', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  // thin: a zoom bubble on the one cell layer
  const dThin = G(sDia);
  const bubX = 890, bubY = 430, bubR = 150;
  E('line', { x1: bubX - bubR, y1: bubY, x2: VX + 118, y2: VY - 60, stroke: '#FFB000', 'stroke-width': 4, 'stroke-dasharray': '10 8' }, dThin);
  const bub = G(dThin);
  { const id = 'villiBub'; const cp = E('clipPath', { id }, defs()); E('circle', { cx: bubX, cy: bubY, r: bubR }, cp);
    const inner = G(bub, { 'clip-path': `url(#${id})` });
    E('rect', { x: bubX - bubR, y: bubY - bubR, width: 2 * bubR, height: 2 * bubR, fill: '#F6C9D2' }, inner);
    E('rect', { x: bubX - bubR, y: bubY + 38, width: 2 * bubR, height: bubR, fill: '#B8283A' }, inner);
    let cd = '', nd = '', rd = '';
    for (let i = 0; i < 6; i++) { const x = bubX - bubR + i * 56; cd += `M${x},${bubY - 26} h56 v64 h-56 Z `; nd += `M${x + 18},${bubY + 6} a10,10 0 1 0 20,0 a10,10 0 1 0 -20,0 `; }
    [[bubX - 80, bubY + 90], [bubX + 60, bubY + 110], [bubX - 10, bubY + 125]].forEach(([x, y]) => { rd += `M${x - 26},${y} a26,11 0 1 0 52,0 a26,11 0 1 0 -52,0 `; });
    E('path', { d: cd, fill: '#F08CA0', stroke: '#9E2453', 'stroke-width': 3 }, inner);
    E('path', { d: nd, fill: '#9E2453' }, inner);
    E('path', { d: rd, fill: '#FF6B6B', stroke: '#FFB3B8', 'stroke-width': 2 }, inner);
    T(inner, bubX, bubY - 82, 'gut', { size: 28, weight: 700, anchor: 'middle', fill: '#6B2440' });
    T(inner, bubX + 70, bubY + 76, 'blood', { size: 28, weight: 700, anchor: 'middle', fill: '#FFFFFF' });
    dThin.mol = villiMol(inner, 'glu', 1.2);
    E('circle', { cx: bubX, cy: bubY, r: bubR, fill: 'none', stroke: '#FFB000', 'stroke-width': 6 }, bub); }
  const thinLbl = label(dThin, 'wall: ONE cell thick', { size: 34, color: '#FFB000', stroke: '#FFB000' }); tr(thinLbl, bubX, 618);
  // bloody: capillaries carry glucose + amino acids away
  const dBlood = G(sDia);
  const capLbl = label(dBlood, 'capillaries', { size: 40, color: '#FFFFFF', fill: '#B8283A', stroke: '#FF8A94' }); tr(capLbl, 890, 300);
  E('line', { x1: 780, y1: 300, x2: VX + 78, y2: VY - 20, stroke: '#FF8A94', 'stroke-width': 4 }, dBlood);
  T(dBlood, 890, 380, 'a good blood supply carries away:', { size: 28, weight: 600, anchor: 'middle', fill: C.muted });
  { const m = villiMol(dBlood, 'glu', 1.6); tr(m, 760, 444); T(dBlood, 800, 456, 'glucose', { size: 34, weight: 700, fill: C.glucoseLt }); }
  { const m = villiMol(dBlood, 'amino', 1.5); tr(m, 760, 520); T(dBlood, 800, 532, 'amino acids', { size: 34, weight: 700, fill: '#FFB3A8' }); }
  T(dBlood, 890, 606, '→ round the body', { size: 30, weight: 700, anchor: 'middle', fill: '#FF8A94' });
  // lacteal: the fat products
  const dLac = G(sDia);
  const lacLbl = label(dLac, 'lacteal', { size: 40, color: '#5A4A10', fill: '#FFF2C2', stroke: '#C9A84A' }); tr(lacLbl, 890, 300);
  E('line', { x1: 810, y1: 300, x2: VX + 18, y2: VY - 80, stroke: '#FFF2C2', 'stroke-width': 4 }, dLac);
  T(dLac, 890, 380, 'takes the products of fat digestion:', { size: 28, weight: 600, anchor: 'middle', fill: C.muted });
  { const m = villiMol(dLac, 'fa', 1.6); tr(m, 760, 444); T(dLac, 810, 456, 'fatty acids', { size: 34, weight: 700, fill: '#FFD25A' }); }
  { const m = villiMol(dLac, 'gly', 1.3); tr(m, 760, 524); T(dLac, 810, 536, 'glycerol', { size: 34, weight: 700, fill: '#FFF2C2' }); }

  /* ================= HORROR poster ================= */
  const sHor = mk('hor');
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#0A0306', '#2A0610', true) }, sHor);
  const flash = E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#E9E2FF', opacity: 0 }, sHor);
  const horKavW = G(sHor);
  const poster = G(sHor);
  E('rect', { x: 580, y: 112, width: 570, height: 520, rx: 8, fill: '#0C0507', stroke: '#5A1018', 'stroke-width': 6 }, poster);
  E('ellipse', { cx: 865, cy: 330, rx: 260, ry: 200, fill: glow('#8E1020'), opacity: 0.5 }, poster);
  const HL = [['BIG, THIN,', 210], ['BLOODY,', 300], ['LACTEAL', 390]];
  const drips = [];
  HL.forEach(([s, y], i) => {
    T(poster, 865, y, s, { size: 72, weight: 800, anchor: 'middle', fill: '#D7142A', ls: 4 });
    const r = rng(40 + i), w = textWidth(s, 72, FD, 800) + 4 * s.length;
    for (let k = 0; k < 3; k++) { const x = 865 - w / 2 + 20 + r() * (w - 40); drips.push({ el: E('path', { d: '', fill: '#D7142A' }, poster), x, y: y + 2, len: 18 + r() * 34, d0: r() * 0.8 }); }
  });
  T(poster, 865, 466, 'coming soon to a small intestine near you', { size: 26, weight: 600, anchor: 'middle', fill: '#C9A0A8' });
  const starring = G(poster);
  T(starring, 760, 560, 'starring', { size: 28, weight: 600, anchor: 'middle', fill: '#C9A0A8' });
  T(starring, 760, 600, 'VINNY', { size: 44, weight: 800, anchor: 'middle', fill: '#FFFFFF', ls: 4 });
  const horVinW = G(poster);

  /* ================= LINE MAP (large intestine; the next morning) ================= */
  const sMap = mk('map');
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#0C1A26', '#14283A', true) }, sMap);
  { let d = ''; for (let x = 0; x <= 1200; x += 60) d += `M${x},0 L${x},750 `; for (let y = 0; y <= 750; y += 60) d += `M0,${y} L1200,${y} `; E('path', { d, stroke: '#1E3A50', 'stroke-width': 1.5 }, sMap); }
  const map = mgLineMap(sMap); tr(map, 600, 420); map.set(-1, 0); map.off.remove();   // helper organs never shown here
  const mapDot = mgBolus(sMap, 22);
  const mChips = G(sMap);
  const cFaeces = G(mChips);
  { const b = E('ellipse', { cx: -110, cy: 0, rx: 30, ry: 20, fill: ball('#9A6A3A', '#5A3A1E'), stroke: '#3A2410', 'stroke-width': 3 }, cFaeces); const c = label(cFaeces, 'faeces = the waste', { size: 34, color: '#E9C9A0', stroke: '#9A6A3A' }); tr(c, 80, 0); }
  const cRect = label(mChips, 'rectum: STORES it', { size: 32, color: C.energy, stroke: C.energy });
  const cAnus = label(mChips, 'anus: it LEAVES', { size: 32, color: C.energy, stroke: C.energy });
  const cLarge = label(mChips, 'next: the LARGE intestine', { size: 36, color: C.energy, stroke: C.energy });
  const morning = G(sMap);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#05080C' }, morning);
  { const sunG = G(morning); tr(sunG, 600, 470); E('circle', { r: 140, fill: glow('#FFB27A') }, sunG); E('path', { d: 'M-70,0 A70,70 0 0 1 70,0 Z', fill: '#FFC247' }, sunG); E('line', { x1: -260, y1: 0, x2: 260, y2: 0, stroke: '#FFC247', 'stroke-width': 4 }, sunG); }
  T(morning, 600, 360, 'THE NEXT MORNING', { size: 64, weight: 800, anchor: 'middle', fill: '#FFFFFF', ls: 6 });

  /* ================= END of the line (large intestine) ================= */
  const sEnd = mk('end'), endCam = G(sEnd);
  const theEnd = mgEnd(endCam);
  const mass = G(endCam);
  const massBody = E('path', { d: '', fill: ball('#A07040', '#5E3A1C'), stroke: '#3A2410', 'stroke-width': 5, 'stroke-linejoin': 'round' }, mass);
  const flecks = G(mass);
  { const r = rng(17); let d = ''; for (let i = 0; i < 14; i++) { const a = r() * TAU, rr = r(); d += `M${(Math.cos(a) * 200 * rr).toFixed(0)},${(Math.sin(a) * 70 * rr).toFixed(0)} l${(10 + r() * 14).toFixed(0)},${(r() * 8 - 4).toFixed(0)} `; } E('path', { d, stroke: '#7FB04A', 'stroke-width': 5, 'stroke-linecap': 'round' }, flecks); }
  const endPhoW = G(endCam), endPercyW = G(endCam), endWaveW = G(endCam);
  const eChips = G(sEnd);
  const cLI = label(eChips, 'LARGE INTESTINE', { size: 40, color: '#FFD0B0', stroke: '#C2703A' });
  const cWater = G(eChips);
  { const d = E('path', { d: 'M0,-18 Q14,4 0,14 Q-14,4 0,-18 Z', fill: C.water, stroke: C.waterDk, 'stroke-width': 3 }, cWater); tr(d, -270, 0); const c = label(cWater, 'absorbs most of the remaining water', { size: 32, color: C.water, stroke: C.water }); tr(c, 20, 0); }
  const cBulk = label(eChips, 'fibre adds BULK', { size: 40, color: '#C2EDA2', stroke: '#5FA843' });
  const cPush = label(eChips, 'something for Percy to push', { size: 30 });
  const star = G(hud);
  { let d = ''; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 34 : 80; d += (i ? 'L' : 'M') + (Math.cos(a) * r).toFixed(1) + ',' + (Math.sin(a) * r).toFixed(1); }
    E('circle', { r: 130, fill: glow('#FFE45C') }, star); E('path', { d: d + 'Z', fill: '#FFD23A', stroke: '#B57B12', 'stroke-width': 5, 'stroke-linejoin': 'round' }, star); }
  const cUseful = label(hud, 'fibre: not digested, still ESSENTIAL', { size: 32, color: '#C2EDA2', stroke: '#5FA843' });

  /* ================= PERISTALSIS with and without fibre ================= */
  const sPer = mk('per');
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#1A0A12', '#2E1220', true) }, sPer);
  const periW = G(sPer); tr(periW, 600, 320);
  const peri = mgPeriTube(periW, 1000);
  const fibre = G(periW);
  E('circle', { r: 50, fill: ball('#A07040', '#5E3A1C'), stroke: '#3A2410', 'stroke-width': 4 }, fibre);
  E('path', { d: 'M-34,-14 Q-6,-26 30,-10 M-36,12 Q0,2 34,16 M-20,-34 Q-10,0 -18,34 M14,-34 Q24,0 16,34', fill: 'none', stroke: '#9BD77A', 'stroke-width': 5, 'stroke-linecap': 'round' }, fibre);
  const nothingQ = T(periW, 0, 12, '?', { size: 64, weight: 800, anchor: 'middle', fill: '#FFD0DC' });
  const perPercyW = G(sPer);
  const cNoFibre = label(sPer, 'no fibre: nothing to grip', { size: 34, color: '#FFB3C8', stroke: '#FF7FA6' });
  const cConst = G(sPer);
  { const c = label(cConst, 'fibre prevents CONSTIPATION', { size: 36, color: '#C2EDA2', stroke: '#5FA843' }); const k = tick(cConst, 18); tr(k, c.w / 2 + 34, 0); }

  /* ================= EGESTION card ================= */
  const sEg = mk('eg');
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#0E2A1C', '#0A1B27', true) }, sEg);
  card(sEg, 90, 120, 720, 420, { fill: 'rgba(14,26,36,0.92)', stroke: '#5FA843', sw: 4 });
  const egT = T(sEg, 450, 220, 'EGESTION', { size: 72, weight: 800, anchor: 'middle', fill: '#9BD77A', ls: 4 });
  const egL1 = T(sEg, 450, 300, '= removing **undigested** food', { size: 40, weight: 600, anchor: 'middle', boldFill: '#C2EDA2' });
  const egL2 = T(sEg, 450, 356, 'that was never absorbed', { size: 34, weight: 600, anchor: 'middle', fill: C.muted });
  const egTag = G(sEg);
  { const c = label(egTag, 'never entered the blood', { size: 32, color: '#FFD0DC', stroke: '#FF7FA6' }); const k = cross(egTag, 13); tr(k, -c.w / 2 - 30, 0); }
  const egPhoW = G(sEg);

  /* ================= Kavya in pyjamas ================= */
  const sPj = mk('pj'), pjCam = G(sPj);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#E8DDF2', '#C9B8DC', true) }, pjCam);
  E('rect', { x: 820, y: 130, width: 260, height: 280, rx: 8, fill: linGrad('#FFC98A', '#FFE9C2', true), stroke: '#8A7A9A', 'stroke-width': 8 }, pjCam);
  E('circle', { cx: 950, cy: 360, r: 46, fill: '#FFB347' }, pjCam);
  E('path', { d: 'M950,130 L950,410 M820,270 L1080,270', stroke: '#8A7A9A', 'stroke-width': 6 }, pjCam);
  E('rect', { x: 0, y: 560, width: 1200, height: 190, fill: '#A88FC4' }, pjCam);
  E('rect', { x: 150, y: 470, width: 900, height: 120, rx: 30, fill: '#F2F2F8', stroke: '#9A8AB0', 'stroke-width': 4 }, pjCam);   // pillow / bed
  const pjKavW = G(pjCam);
  const qChip = label(sPj, 'excretion?', { size: 44, color: '#3A2A50', fill: '#FFFFFF', stroke: '#7A5AA0' });

  /* ================= Percy's confessional: excretion ================= */
  const sCf = mk('cf');
  const conf = mgConf(sCf, 'percy');
  const cfCam = G(sCf);
  const cfPercyW = G(cfCam);
  const cfCard = G(sCf);
  card(cfCard, 610, 116, 550, 450, { fill: 'rgba(14,26,36,0.92)', stroke: '#7FC8F0', sw: 4 });
  const exT = T(cfCard, 885, 190, 'EXCRETION', { size: 60, weight: 800, anchor: 'middle', fill: '#7FC8F0', ls: 3 });
  const cfNo = G(cfCard);
  T(cfNo, 885, 252, 'removing waste made by your', { size: 30, weight: 600, anchor: 'middle', fill: C.ink });
  T(cfNo, 885, 292, "body's own **reactions**, in your **cells**", { size: 30, weight: 600, anchor: 'middle', fill: C.ink, boldFill: C.energy });
  const cell = G(cfNo); tr(cell, 885, 440);
  E('ellipse', { rx: 120, ry: 80, fill: ball('#F7A8C8', '#C25A88'), stroke: '#FFD0DC', 'stroke-width': 4 }, cell);
  E('circle', { cx: -30, cy: 0, r: 26, fill: '#9E2453', opacity: 0.8 }, cell);
  const cellOut = [0, 1, 2].map(i => { const g = G(cell); if (i === 1) { E('circle', { r: 13, fill: '#FFE29A', stroke: '#B57B12', 'stroke-width': 3 }, g); T(g, 0, 40, 'urea', { size: 26, weight: 700, anchor: 'middle', fill: '#FFE29A' }); } else molCO2(g, 10); return g; });
  const cfUrea = G(cfCard);
  { const l = lungs(cfUrea, 0.34); tr(l, 690, 320); }
  const co2 = G(cfUrea); molCO2(co2, 13); tr(co2, 690, 256);
  villiRich(cfUrea, 760, 296, 'CO_2', { size: 44, anchor: 'start', fill: '#D5E2EC' });
  T(cfUrea, 760, 344, 'out through the **lungs**', { size: 32, weight: 600, fill: C.ink, boldFill: '#FF9FB8' });
  const uRow1 = T(cfUrea, 885, 424, '**urea**: made by the **liver**', { size: 32, weight: 600, anchor: 'middle', fill: C.ink, boldFill: '#FFE29A' });
  const uRow2 = G(cfUrea);
  { const a = label(uRow2, 'liver', { size: 30, color: '#E9C9A0', stroke: '#9A6A3A' }); tr(a, 690, 484);
    arrow(uRow2, 740, 484, 790, 484, { color: C.muted, width: 4 });
    const b = label(uRow2, 'kidneys', { size: 30, color: '#FFB3A8', stroke: '#C25A5A' }); tr(b, 870, 484);
    arrow(uRow2, 950, 484, 1000, 484, { color: C.muted, width: 4 });
    const c = label(uRow2, 'urine', { size: 30, color: '#FFE45C', stroke: '#B5A012' }); tr(c, 1070, 484); }
  T(cfUrea, 885, 546, 'removed by the kidneys, in urine', { size: 28, weight: 600, anchor: 'middle', fill: C.muted });
  const cfPhoW = G(sCf);
  const cfTag = label(sCf, 'Phoebe: egestion, NOT excretion', { size: 28, color: '#C2EDA2', stroke: '#5FA843' });

  /* ================= TERMINATES: AL7 platform ================= */
  const sTm = mk('tm'), tmCam = G(sTm);
  const plat = mgPlatform(tmCam, 'ANUS', 'AL7');
  { const bar = G(tmCam); E('rect', { x: 442, y: 138, width: 290, height: 56, rx: 4, fill: '#0B0C0E' }, bar); T(bar, 587, 177, 'CENSORED', { size: 32, weight: 800, anchor: 'middle', fill: '#FFFFFF', ls: 2 }); }
  const tmPercyW = G(tmCam);
  const mic = mgMic(tmCam, 1);
  const dim = E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#05020A', opacity: 0 }, sTm);
  const termChip = label(sTm, 'end of the Alimentary Line', { size: 32, color: '#FFB000', stroke: '#FFB000' });

  /* ================= the cast ================= */
  const percy = cast(root, 'percy');
  const vinny = cast(root, 'vinny');
  const vinnyWrap = G(root); villiSeat(vinny, vinnyWrap);
  // one Kavya: PE shirt for the horror poster, pink polka-dot pyjamas the next morning
  const kav = cast(horKavW, 'kavya', {});
  const kavPJ = (() => { const inner = kav.firstChild, shirt = inner.children[0], eight = inner.children[2];
    const dots = G(inner); inner.insertBefore(dots, shirt.nextSibling);
    [[-70, 120], [-40, 96], [-6, 128], [30, 100], [70, 124], [-80, 84], [84, 90]].forEach(([x, y]) => E('circle', { cx: x, cy: y, r: 6, fill: '#FFFFFF', opacity: 0.85 }, dots));
    return pj => { attr(shirt, 'fill', pj ? '#F7A8C8' : '#2E7DD8'); op(dots, pj ? 1 : 0); op(eight, pj ? 0 : 1); }; })();
  // one Phoebe, seated in whichever shot she is in; setWave(true) raises her right arm
  const phWave = villiWaver(egPhoW, 1);
  { const inner = phWave.firstChild, a0 = inner.children[0], a1 = inner.children[1], both = 'M-44,4 Q-60,40 -58,78 M44,4 Q60,40 58,78', left = 'M-44,4 Q-60,40 -58,78';
    phWave.setWave = w => { attr(a0, 'd', w ? left : both); attr(a1, 'd', w ? left : both); op(phWave.arm, w ? 1 : 0); }; }

  /* ---------- shots ---------- */
  const CUTS = [[-9, 'gut'], [at('vinny') - 0.08, 'vin'], [at('big') - 0.08, 'dia'], [at('horror') - 0.08, 'hor'], [at('large') - 0.08, 'map'],
    [mid('large', 0.3), 'end'], [at('grip') - 0.08, 'per'], [at('useful') - 0.08, 'end'], [at('rectum') - 0.08, 'map'], [at('egestion') - 0.08, 'eg'],
    [at('excretion') - 0.08, 'pj'], [at('no') - 0.08, 'cf'], [at('stop') - 0.08, 'end'], [at('terminates') - 0.08, 'tm']];
  const cutAt = t => { let c = CUTS[0]; for (const k of CUTS) if (t >= k[0]) c = k; return c; };
  root.appendChild(hud);   // the HUD (lower third, chips, star) above every shot

  return t => {
    const [c0, sh] = cutAt(t);
    for (const k in shots) op(shots[k], k === sh ? 1 : 0);
    conf.set(sh === 'cf' ? 1 : 0, t);
    op(cOne, 0); ltVinny.set(0); op(star, 0); op(cUseful, 0);
    let percyOn = false, vinnyOn = false;
    const seatPercy = (wrap, x, y, s, st) => { villiSeat(percy, wrap); percyOn = true; tr(percy, x, y, s); percy.set(Object.assign({ t, talk: talk(t, 'percy') }, st)); };
    const seatVinny = (wrap, x, y, s, st) => { villiSeat(vinnyWrap, wrap); vinnyOn = true; tr(vinnyWrap, x, y, s); vinny.set(Object.assign({ t, wave: 1, mood: 'neutral' }, st)); };

    /* ---------- GUT and VINNY share the gut set ---------- */
    if (sh === 'gut' || sh === 'vin') {
      { const w = sh === 'gut' ? sGut : sVin; if (gutCam.parentNode !== w) w.insertBefore(gutCam, w.firstChild); }
      gut.upd(t * AMP + (1 - AMP) * 0);
      MOLS.forEach(m => {
        const f = (t * 0.22 + m.ph) % 1, x = m.x0 + 160 * f, y = lerp(m.y0, m.up ? 190 : 560, easeIn(f));
        tr(m.g, x, y, 1, f * 90); op(m.g, sh === 'gut' ? Math.min(1, f * 5) * (1 - P(f, 0.75, 0.25, linear)) : 0);
      });
      if (sh === 'gut') {
        const z = P(t, mid('villi', 0.7), end('villi') + 0.2 - mid('villi', 0.7), ease);
        villiCam(gutCam, 1 + 1.4 * z + 0.02 * P(t, 0, 6, linear), lerp(600, 610, z), lerp(375, 600, z), 600, lerp(375, 470, z));
        op(gChips, 1 - z);
        villiPop(cVilli, t, mid('villi', 0.1), 600, 330);
        villiPop(cAbsorb, t, mid('villi', 0.35), 600, 420);
        const op1 = P(t, mid('villi', 0.78), 0.3, pop); op(cOne, clamp(op1 * 2.5)); tr(cOne, 600, 200, Math.max(0.01, 0.7 + 0.3 * op1));
      } else {
        villiCam(gutCam, 2.4, 610, 600, 600, 470);
        const push = P(t, end('vinny'), 1.0, ease);
        villiCam(vinCam, 1 + 0.18 * push, 720, 420);
        seatPercy(vinPercyW, 250, 470, 1.15, { mood: t > end('vinny') ? 'deadpan' : 'neutral', look: t > end('vinny') ? 0 : 1 });
        seatVinny(vinVinnyW, 720, 440, 1.6, {});
        villiPop(cTalk, t, mid('vinny', 0.5), 1000, 260, 1, -3);
        villiPop(cAbs, t, mid('vinny', 0.82), 1010, 340, 1, 3);
        ltVinny.set(win(t, at('vinny') + 0.4, end('vinny') + 0.9, 0.3));
      }
    }

    /* ---------- DIAGRAM ---------- */
    if (sh === 'dia') {
      const li = LINES.reduce((a, l, i) => (t >= at(l) - 0.1 ? i : a), 0);
      letters.forEach((g, i) => { if (t >= at(LINES[i]) - 0.1) villiPop(g, t, at(LINES[i]), g.mx, 175); else op(g, 0); });
      const done = P(t, mid('lacteal', 0.8), 0.3, pop); op(stripTick, clamp(done * 2.5)); tr(stripTick, 1132, 132, Math.max(0.01, done));
      seatPercy(diaPercyW, 112, 572, 0.62, { mood: 'deadpan', look: 1, squeeze: 0 });
      op(dBig, li === 0 ? 1 : 0); op(dThin, li === 1 ? 1 : 0); op(dBlood, li === 2 ? 1 : 0); op(dLac, li === 3 ? 1 : 0);
      op(bigGlow, li === 0 ? (0.5 + 0.5 * wave(t, 1)) * P(t, at('big'), 0.4, linear) : 0);
      op(wallGlow, li === 1 ? (0.35 + 0.35 * wave(t, 1)) : 0);
      op(capGlow, li === 2 ? 0.55 + 0.25 * wave(t, 1) : 0);
      op(lacGlow, li === 3 ? 0.6 + 0.3 * wave(t, 1) : 0);
      if (li === 0) {
        op(court, P(t, mid('big', 0.45), 0.3, linear));
        attr(courtFill, 'width', 196 * P(t, mid('big', 0.55), 1.2, ease));
        villiPopAt(bigNum, t, mid('big', 0.3), 890, 555);
        op(bigSub, P(t, mid('big', 0.62), 0.3, linear));
      }
      if (li === 1) {
        op(bub, P(t, at('thin') + 0.1, 0.3, linear));
        const f = (t * 0.5) % 1; tr(dThin.mol, bubX, lerp(bubY - 110, bubY + 110, ease(f))); op(dThin.mol, Math.sin(f * Math.PI));
        villiPop(thinLbl, t, mid('thin', 0.25), bubX, 618);
      }
      capMols.forEach((m, i) => {
        if (li !== 2) { op(m, 0); return; }
        const f = (t * 0.32 + i / 4) % 1, side = i % 2 ? 1 : -1, y0 = VY - 120 + (i % 3) * 70, xc = VX + side * 74;
        const x = f < 0.25 ? lerp(VX + side * 180, xc, f / 0.25) : xc;
        const y = f < 0.25 ? y0 : lerp(y0, VY + 260, (f - 0.25) / 0.75);
        tr(m, x, y); op(m, Math.min(1, f * 8, (1 - f) * 6) * P(t, at('bloody') + 0.3, 0.3, linear));
      });
      lacMols.forEach((m, i) => {
        if (li !== 3) { op(m, 0); return; }
        const f = (t * 0.3 + i / 4) % 1;
        tr(m, VX, lerp(VY - 250, VY + 250, f), 1, 90 * (i % 2 ? 0 : 1)); op(m, Math.min(1, f * 6, (1 - f) * 6) * P(t, at('lacteal') + 0.2, 0.3, linear));
      });
    } else { capMols.forEach(m => op(m, 0)); lacMols.forEach(m => op(m, 0)); }

    /* ---------- HORROR ---------- */
    if (sh === 'hor') {
      op(flash, Math.max(0, 1 - (t - at('horror') + 0.08) / 0.25) * 0.8 + (on2(t, mid('horror', 0.66), 0.12) ? 0.6 : 0));
      villiSeat(kav, horKavW); kavPJ(false);
      tr(kav, 250, 450, 1.3);
      kav.set({ t, talk: talk(t, 'kavya'), mood: t < mid('horror', 0.5) ? 'neutral' : 'deadpan', look: t < mid('horror', 0.5) ? 0.6 : 0 });
      drips.forEach(d => { const g = P(t, at('horror') + d.d0, 2.4, easeOut) * d.len; attr(d.el, 'd', `M${(d.x - 4).toFixed(1)},${d.y} L${(d.x + 4).toFixed(1)},${d.y} L${(d.x + 3).toFixed(1)},${(d.y + g).toFixed(1)} A4,4 0 0 1 ${(d.x - 3).toFixed(1)},${(d.y + g).toFixed(1)} Z`); });
      const pp = P(t, at('horror') + 0.05, 0.5, pop); op(poster, clamp(pp * 2.5));
      poster.setAttribute('transform', `translate(865 370) scale(${(0.8 + 0.2 * pp).toFixed(3)}) translate(-865 -370)`);
      const sp = P(t, mid('horror', 0.85), 0.4, pop); op(starring, clamp(sp * 2.5));
      if (sp > 0) seatVinny(horVinW, 1010, 560, 0.5, {});
    }

    /* ---------- LINE MAP: to the large intestine; the next morning ---------- */
    if (sh === 'map') {
      const morn = t >= at('rectum') - 0.1;
      op(morning, morn ? 1 - P(t, at('rectum') + 1.0, 0.25, linear) : 0);
      op(cLarge, 0); op(cFaeces, 0); op(cRect, 0); op(cAnus, 0);
      if (!morn) {
        map.set(t > at('large') + 0.5 ? 4 : 3, 0);
        const bp = P(t, at('large') + 0.1, 1.2, ease); tr(mapDot, 600 + lerp(map.x(3), map.x(4), bp), 420);
        villiPop(cLarge, t, at('large') + 0.2, 600, 600);
      } else {
        const f5 = mid('rectum', 0.5);
        map.set(t < f5 ? 5 : 6, 0);
        const bp = P(t, mid('rectum', 0.25), 0.9, ease), bp2 = P(t, mid('rectum', 0.68), 0.9, ease);
        tr(mapDot, 600 + lerp(map.x(4), map.x(5), bp) + (map.x(6) - map.x(5)) * bp2, 420);
        villiPop(cFaeces, t, mid('rectum', 0.3), 500, 230);
        villiPop(cRect, t, mid('rectum', 0.5), 920, 560);
        villiPop(cAnus, t, mid('rectum', 0.78), 960, 280);
      }
    }

    /* ---------- END of the line ---------- */
    if (sh === 'end') {
      theEnd.upd(t);
      const stopShot = t >= at('stop') - 0.1, usefulShot = !stopShot && t >= at('useful') - 0.1;
      op(theEnd.drops, stopShot ? 0.4 : P(t, mid('large', 0.4), 0.5, linear));
      op(eChips, usefulShot || stopShot ? 0 : 1);
      // the leftovers: they firm up as the water leaves; then wrap round Phoebe
      const firm = P(t, mid('large', 0.4), 3, linear), bulk = P(t, at('bulk') + 0.2, 1.4, ease);
      const pts = [];
      for (let i = 0; i < 14; i++) { const a = i / 14 * TAU, rr = 1 + 0.1 * Math.sin(i * 2.3) + 0.06 * (1 - firm) * Math.sin(t * 3 + i); pts.push([Math.cos(a) * lerp(150, 230, bulk) * rr, Math.sin(a) * lerp(60, 95, bulk) * rr]); }
      attr(massBody, 'd', closedPath(pts));
      op(mass, stopShot ? 0 : 1); tr(mass, 540, lerp(400, 470, bulk), 1 - 0.08 * firm);
      if (stopShot) {
        op(endPhoW, 0);
        villiSeat(phWave, endWaveW);
        const push = P(t, end('stop'), 1.2, ease);
        villiCam(endCam, 1 + 0.2 * push, 820, 420);
        op(endWaveW, 1); op(phWave.case, 1); phWave.setWave(true);
        tr(phWave, 740, 400, 1.05);
        phWave.set({ t, talk: talk(t, 'phoebe'), mood: 'sad', look: t > end('stop') ? 0 : 0.3 });
        phWave.waveArm(t, t > mid('stop', 0.45) ? 1 : 0.2);
      } else {
        op(endPhoW, t >= at('bulk') - 0.1 ? 1 : 0);
        const k = usefulShot ? 1.5 + 0.15 * P(t, end('useful'), 0.8, ease) : 1 + 0.03 * P(t, c0, 6, linear);
        villiCam(endCam, k, usefulShot ? 560 : 600, usefulShot ? 380 : 375, 600, usefulShot ? 400 : 375);
        villiSeat(phWave, endPhoW); phWave.setWave(false); op(phWave.case, 0);
        tr(phWave, 560, 360, 1.0);
        let mood = 'sad';
        if (t >= at('bulk') && t < at('grip')) mood = t < mid('bulk', 0.6) ? 'sad' : 'neutral';
        if (usefulShot) mood = t < mid('useful', 0.75) ? 'shock' : 'happy';
        phWave.set({ t, talk: talk(t, 'phoebe'), mood, look: 0 });
        op(endWaveW, 0);
        if (!usefulShot) {
          villiPop(cLI, t, mid('large', 0.32), 450, 250);
          villiPop(cWater, t, mid('large', 0.55), 470, 640);
          if (t >= at('bulk') - 0.1) {
            op(cLI, 0); op(cWater, 0);
            villiPop(cBulk, t, mid('bulk', 0.3), 900, 200, 1, 3);
            villiPop(cPush, t, mid('bulk', 0.72), 300, 640);
            if (t > mid('bulk', 0.62)) seatPercy(endPercyW, lerp(-120, 150, P(t, mid('bulk', 0.62), 0.5, easeOut)), 470, 0.8, { mood: 'deadpan', look: 1, squeeze: 0.5 + 0.5 * Math.sin(t * 6) });
          } else { op(cBulk, 0); op(cPush, 0); }
        } else {
          const sp = P(t, mid('useful', 0.75), 0.45, pop); op(star, clamp(sp * 2.5)); tr(star, 830, 230, Math.max(0.01, 0.4 + 0.6 * sp), 10 * Math.sin(t * 2) * AMP);
          op(cUseful, P(t, end('useful') + 0.1, 0.3, linear)); tr(cUseful, 600, 640);
        }
      }
    }

    /* ---------- PERISTALSIS ---------- */
    if (sh === 'per') {
      const half = mid('grip', 0.42), withF = t >= half;
      const p = withF ? P(t, half, end('grip') + 0.2 - half, linear) : P(t, at('grip') - 0.08, half - at('grip') + 0.08, linear);
      peri.set(p); op(peri.bolus, 0);
      const xs = lerp(-540, 380, p), bx = Math.min(450, xs + 92);
      op(fibre, withF ? 1 : 0); tr(fibre, bx, 0, 1, bx * 0.5);
      op(nothingQ, withF ? 0 : P(t, at('grip') + 0.3, 0.3, linear)); tr(nothingQ, bx, 22);
      seatPercy(perPercyW, 150, 580, 0.75, { mood: withF ? 'smug' : 'annoyed', look: 1, squeeze: 0.5 + 0.5 * Math.sin(t * 6) });
      op(cNoFibre, withF ? 0 : 1); if (!withF) villiPop(cNoFibre, t, at('grip') + 0.2, 640, 520);
      op(cConst, withF ? 1 : 0); if (withF) villiPop(cConst, t, mid('grip', 0.6), 660, 520);
    }

    /* ---------- EGESTION ---------- */
    if (sh === 'eg') {
      const p = P(t, at('egestion') + 0.05, 0.5, pop); op(egT, clamp(p * 2.5));
      egT.setAttribute('transform', `translate(450 200) scale(${(0.7 + 0.3 * p).toFixed(3)}) translate(-450 -200)`);
      op(egL1, P(t, mid('egestion', 0.3), 0.3, linear)); op(egL2, P(t, mid('egestion', 0.62), 0.3, linear));
      villiPop(egTag, t, mid('egestion', 0.72), 470, 470);
      villiSeat(phWave, egPhoW);
      op(phWave.case, 0); phWave.setWave(true);
      tr(phWave, 980, 430, 1.05);
      phWave.set({ t, mood: 'happy', look: -0.5 }); phWave.waveArm(t, 1);
    }

    /* ---------- PYJAMAS ---------- */
    if (sh === 'pj') {
      const push = P(t, end('excretion') - 0.2, 0.8, ease);
      villiCam(pjCam, 1 + 0.1 * push, 600, 380);
      villiSeat(kav, pjKavW); kavPJ(true);
      tr(kav, 600, 450, 1.5);
      kav.set({ t, talk: talk(t, 'kavya'), mood: t > mid('excretion', 0.7) ? 'smug' : 'neutral', look: 0 });
      villiPop(qChip, t, mid('excretion', 0.5), 930, 470, 1, 4);
    }

    /* ---------- PERCY'S CONFESSIONAL ---------- */
    if (sh === 'cf') {
      villiCam(cfCam, 1 + 0.03 * P(t, at('no'), 10, linear), 330, 420);
      const u = t >= at('urea') - 0.1;
      seatPercy(cfPercyW, 330, 420, 1.3, { mood: t < mid('no', 0.15) ? 'deadpan' : 'neutral', look: 0 });
      villiPopAt(exT, t, mid('no', 0.1), 885, 170);
      op(cfNo, u ? 0 : P(t, mid('no', 0.3), 0.3, linear));
      cellOut.forEach((g, i) => { const f = (t * 0.4 + i / 3) % 1, a = -0.7 + i * 0.7; tr(g, Math.cos(a) * lerp(60, 170, f), Math.sin(a) * lerp(40, 90, f) - 10); op(g, Math.sin(f * Math.PI) * P(t, mid('no', 0.6), 0.3, linear)); });
      op(cfUrea, u ? 1 : 0);
      if (u) {
        const cp = P(t, at('urea') + 0.1, 0.4, linear); op(co2, cp); tr(co2, 690 + 30 * ((t * 0.5) % 1), 256 - 20 * ((t * 0.5) % 1));
        op(uRow1, P(t, mid('urea', 0.42), 0.3, linear)); op(uRow2, P(t, mid('urea', 0.6), 0.3, linear));
      }
      const pp = P(t, mid('urea', 0.82), 0.4, pop);
      op(cfPhoW, u ? clamp(pp * 2.5) : 0); tr(cfPhoW, 640, 610, 0.42);
      if (u) { villiSeat(phWave, cfPhoW); phWave.setWave(false); op(phWave.case, 0); tr(phWave, 0, 0, 1); phWave.set({ t, mood: 'sad', look: -0.5 }); }
      op(cfTag, u ? clamp(pp * 2.5) : 0); tr(cfTag, 900, 618);
    }

    /* ---------- TERMINATES ---------- */
    if (sh === 'tm') {
      setText(plat.led, t > at('terminates') + 0.2 ? 'THIS SERVICE TERMINATES HERE' : 'NEXT STATION: NONE');
      op(plat.led, t > end('terminates') + 0.3 ? 0.5 + 0.5 * (Math.sin(t * 9) > 0 ? 1 : 0) : 1);
      const push = P(t, end('terminates'), 0.8, ease);
      villiCam(tmCam, 1 + 0.08 * push, 430, 430);
      seatPercy(tmPercyW, 430, 470, 1.3, { mood: 'deadpan', look: 0 });
      tr(mic, 518, 500, 0.9, -28);
      villiPop(termChip, t, mid('terminates', 0.55), 860, 630);
      op(dim, 0.62 * P(t, end('terminates') + 0.1, 0.6, linear));
    }

    if (!percyOn) villiSeat(percy, hud), op(percy, 0); else op(percy, 1);
    if (!vinnyOn) { villiSeat(vinnyWrap, hud); op(vinnyWrap, 0); } else op(vinnyWrap, 1);
  };
  function on2(t, t0, d) { return t >= t0 && t < t0 + d; }
});
