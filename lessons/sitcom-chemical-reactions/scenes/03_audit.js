/* Scene 3: The audit.
   round: kitchen wide, a spotlight swings onto Madam Mass; "ROUND 3: THE AUDIT"
   hi/motto/no: Madam Mass close (lower third; LCD marquee; the deadpan "No.")
   rule: Mass + a reactants box whose atoms rearrange into a products box (same 6 atoms)
   law: LAW OF CONSERVATION OF MASS card (this "=" compares masses, so Arrow lets it go)
   heavier: Kavya's balance: magnesium 24.12 g -> 24.20 g after burning
   joined/fizz/escaped/sealed: on Madam Mass's own pan: Olly drops onto the magnesium (LCD goes up);
     an open flask of marble chips + acid (LCD goes down, CO2 escapes, the sign-out sheet stays empty);
     a sealed flask with a balloon (LCD steady)
   thmass: Mass confessional, "23 YEARS", times surprised: 0; one "?" flicker
   balanced -> approved: the menu board: see-saw, H2 + O2 -> H2O, count the O, Olly's H2O2 (bleach!),
     Arrow's two-shot, NEVER CHANGE A SUBSCRIPT, 2H2 + O2 -> 2H2O, tallies, APPROVED. */
scene('audit', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;
  const talk = (t, w) => scTalk(S, t, w);

  /* ---------- helpers (prefixed au) ---------- */
  // camera: world (x, y) -> screen (sx + k (x - fx), sy + k (y - fy)); clamped so the 1200 x 750 set covers the stage
  function auCam(k, fx, fy, sx, sy) { return { k, fx, fy, sx: clamp(sx, 1200 - k * (1200 - fx), k * fx), sy: clamp(sy, 750 - k * (750 - fy), k * fy) }; }
  const CAM0 = { k: 1, fx: 600, fy: 375, sx: 600, sy: 375 };
  const auSetCam = (el, c) => el.setAttribute('transform', `translate(${c.sx.toFixed(1)} ${c.sy.toFixed(1)}) scale(${c.k.toFixed(4)}) translate(${(-c.fx).toFixed(1)} ${(-c.fy).toFixed(1)})`);
  const auSp = (c, x, y) => [c.sx + c.k * (x - c.fx), c.sy + c.k * (y - c.fy)];
  function auPop(el, t, t0, x, y, s, r) { const p = P(t, t0, 0.45, pop); op(el, clamp(p * 2.5)); tr(el, x, y, Math.max(0.01, (s || 1) * (0.6 + 0.4 * p)), r); return p; }
  function auLabel(parent, text, o) { o = o || {}; return chip(parent, text, { size: o.size || 30, fill: o.fill || 'rgba(10,27,39,0.9)', stroke: o.stroke || C.line, sw: 3, color: o.color || C.ink, weight: o.weight || 700 }); }
  function auSeat(ch, layer) { if (ch.parentNode !== layer) layer.appendChild(ch); }
  // magnesium atom: silver-white with a dark "Mg"
  function auMg(parent, r) {
    const g = G(parent);
    E('circle', { r, fill: ball('#D9E0E7', '#8C97A3'), stroke: '#6E7A86', 'stroke-width': Math.max(2, r * 0.08) }, g);
    T(g, 0, r * 0.3, 'Mg', { size: r * 0.82, weight: 800, anchor: 'middle', fill: SC_INK });
    return g;
  }
  function auH2(parent, r) { const g = G(parent); tr(atom(g, 'H', r, { letter: true }), -r * 0.75, 0); tr(atom(g, 'H', r, { letter: true }), r * 0.75, 0); return g; }
  // the round card
  function auCard(parent, text) {
    const g = G(parent), w = textWidth(text, 46, FD, 800) + 80;
    E('rect', { x: -w / 2, y: -42, width: w, height: 84, rx: 20, fill: '#1A0F2A', stroke: '#FFD54A', 'stroke-width': 5 }, g);
    T(g, 0, 16, text, { size: 46, weight: 800, anchor: 'middle', fill: '#FFF1C4', ls: 2 });
    return g;
  }
  // Kavya's school balance with a crucible: g.set(after 0..1, reading)
  function auLabBal(parent) {
    const g = G(parent);
    const cr = G(g); tr(cr, 0, -102);
    const ribbon = E('path', { d: 'M-40,-58 C-34,-104 -12,-104 -4,-60 C4,-104 26,-104 36,-58', fill: 'none', stroke: '#9AA6B2', 'stroke-width': 8, 'stroke-linecap': 'round' }, cr);
    const powder = E('path', { d: 'M-48,-58 Q-30,-92 0,-90 Q30,-92 48,-58 Z', fill: '#F7F7F2', stroke: '#C9D3DC', 'stroke-width': 3 }, cr);
    E('path', { d: 'M-58,-64 L58,-64 L44,0 L-44,0 Z', fill: linGrad('#FFFFFF', '#D5DCE3'), stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, cr);
    E('rect', { x: -8, y: -94, width: 16, height: 22, fill: '#8C97A3' }, g);
    E('rect', { x: -92, y: -104, width: 184, height: 14, rx: 7, fill: linGrad('#F4F7FA', '#AEB9C4', true), stroke: SC_INK, 'stroke-width': 3 }, g);
    E('rect', { x: -150, y: -76, width: 300, height: 76, rx: 12, fill: linGrad('#EEF2F6', '#9AA6B2', true), stroke: SC_INK, 'stroke-width': 4 }, g);
    E('rect', { x: -108, y: -64, width: 216, height: 52, rx: 7, fill: '#173322', stroke: SC_INK, 'stroke-width': 3 }, g);
    const txt = T(g, 0, -24, '24.12 g', { size: 38, weight: 700, anchor: 'middle', fill: '#7CFF9E', font: FB });
    g.set = (a, reading) => { op(ribbon, 1 - a); op(powder, a); if (txt.textContent !== reading) setText(txt, reading); };
    return g;
  }
  // a tally pill: g.set(text, colour)
  function auTally(parent) {
    const g = G(parent);
    const box = E('rect', { x: -132, y: -24, width: 264, height: 48, rx: 24, fill: 'rgba(10,20,16,0.85)', stroke: C.line, 'stroke-width': 3 }, g);
    const txt = T(g, 0, 10, '', { size: 28, weight: 800, anchor: 'middle', fill: C.ink });
    g.set = (s, col) => { if (txt.textContent !== s) setText(txt, s); attr(txt, 'fill', col); attr(box, 'stroke', col); };
    return g;
  }

  /* ---------- layers ---------- */
  const Lbg = G(root), Lboard = G(root), Lcast = G(root), Lfront = G(root), Lon = G(root), Lfg = G(root), Lhud = G(root);

  /* ---------- sets ---------- */
  const kitchen = tkKitchen(Lbg);
  const lab = tkLab(Lbg);
  const conf = tkConf(Lbg, 'mass');
  const counter = tkCounter(Lfront);
  const bench = tkBench(Lfront);

  /* ---------- the cast ---------- */
  const arrowC = cast(Lcast, 'arrow');
  const olly = cast(Lcast, 'olly');
  const kav = cast(Lcast, 'kavya', { mood: 'neutral' });
  const spot = G(Lon);
  E('path', { d: 'M-46,-640 L46,-640 L170,0 L-170,0 Z', fill: glow('#FFF4C2'), opacity: 0.9 }, spot);
  const kat = cast(Lon, 'kat');
  const mass = cast(Lon, 'mass');
  const massGlasses = mass.firstChild.lastChild;   // the half-moon glasses (lib.js adds them last)
  const BY = { arrow: arrowC, olly, kavya: kav, kat, mass };

  /* ---------- things on Madam Mass's pan ---------- */
  // crucible of magnesium
  const panCruc = G(mass.pan);
  const mgA = auMg(panCruc, 24), mgB = auMg(panCruc, 24); tr(mgA, -26, -42); tr(mgB, 26, -42);
  E('path', { d: 'M-66,-46 L66,-46 L52,0 L-52,0 Z', fill: linGrad('#FFFFFF', '#D5DCE3'), stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, panCruc);
  // conical flask with acid, marble chips, bubbles, balloon
  const panFlask = G(mass.pan);
  const balloon = G(panFlask);
  const balIn = G(balloon);
  E('path', { d: 'M0,0 C-58,-6 -62,-104 0,-110 C62,-104 58,-6 0,0 Z', fill: 'rgba(255,120,160,0.42)', stroke: '#FF7AA8', 'stroke-width': 4 }, balIn);
  E('path', { d: 'M-26,-80 Q-30,-50 -18,-30', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 5, opacity: 0.5, 'stroke-linecap': 'round' }, balIn);
  const balMols = [0, 1].map(() => molCO2(balIn, 9, {}));
  const fl = flask(panFlask, 0.62, { level: 0.45, liquid: '#CFEAF7' }); tr(fl, 0, -57);
  const flIn = fl.firstChild;
  [[-36, 80], [-14, 84], [10, 82], [32, 84], [0, 74]].forEach(([x, y], i) => E('path', { d: closedPath(blobPts(11, 8, 6, 0, 0.3, 60 + i).map(([a, b]) => [a + x, b + y])), fill: '#EDEDE8', stroke: '#9AA6B2', 'stroke-width': 2 }, flIn));
  const fizz = bubbles(flIn, -42, 36, 84, 50, { n: 7, r: 6, seed: 5 });
  const neckBand = E('rect', { x: -16, y: -126, width: 32, height: 12, rx: 4, fill: '#FF7AA8', stroke: SC_INK, 'stroke-width': 2 }, panFlask);
  tr(balloon, 0, -117);

  /* ---------- props in front ---------- */
  const roundCard = auCard(Lfg, 'ROUND 3: THE AUDIT');
  const ltMass = scLowerThird(Lhud, 'MADAM MASS', 'The balance. Auditor.');

  // rule: the rearrangement diagram
  const diag = G(Lfg);
  E('rect', { x: 50, y: 130, width: 720, height: 470, rx: 24, fill: 'rgba(14,10,30,0.88)', stroke: '#45357A', 'stroke-width': 4 }, diag);
  T(diag, 410, 182, 'atoms are only REARRANGED', { size: 34, weight: 800, anchor: 'middle', fill: C.energy });
  E('rect', { x: 80, y: 210, width: 270, height: 210, rx: 18, fill: 'rgba(255,255,255,0.05)', stroke: '#8AD8FF', 'stroke-width': 4, 'stroke-dasharray': '12 8' }, diag);
  E('rect', { x: 470, y: 210, width: 270, height: 210, rx: 18, fill: 'rgba(255,255,255,0.05)', stroke: C.good, 'stroke-width': 4, 'stroke-dasharray': '12 8' }, diag);
  T(diag, 215, 462, 'reactants', { size: 32, weight: 800, anchor: 'middle', fill: '#8AD8FF' });
  T(diag, 605, 462, 'products', { size: 32, weight: 800, anchor: 'middle', fill: C.good });
  const dArrow = arrow(diag, 362, 315, 458, 315, { color: '#FFD54A', width: 8 });
  const cntL = T(diag, 215, 405, '6 atoms', { size: 26, weight: 700, anchor: 'middle', fill: C.muted });
  const cntR = T(diag, 605, 405, '6 atoms', { size: 26, weight: 700, anchor: 'middle', fill: C.muted });
  // 2 C + 2 O2 -> 2 CO2 : [kind, from, to]
  const RA = [['C', [140, 262], [605, 268]], ['C', [290, 345], [605, 350]],
    ['O', [228, 258], [567, 268]], ['O', [260, 258], [643, 350]],
    ['O', [150, 346], [567, 350]], ['O', [182, 346], [643, 268]]];
  const raEls = RA.map(([k]) => atom(diag, k, k === 'C' ? 24 : 22, { letter: true }));
  const chMade = auLabel(diag, 'none made', { color: C.bad, stroke: C.bad });
  const chDest = auLabel(diag, 'none destroyed', { color: C.bad, stroke: C.bad });
  const chMassEq = auLabel(diag, 'same atoms, so same mass', { color: C.good, stroke: C.good, size: 28 });

  // law card
  const lawCard = G(Lfg);
  E('rect', { x: -450, y: -105, width: 900, height: 210, rx: 24, fill: '#FFF6D6', stroke: '#E0C878', 'stroke-width': 6 }, lawCard);
  T(lawCard, 0, -42, 'LAW OF CONSERVATION OF MASS', { size: 46, weight: 800, anchor: 'middle', fill: '#B5372D', ls: 1 });
  T(lawCard, 0, 22, 'mass of products = mass of reactants', { size: 38, weight: 800, anchor: 'middle', fill: SC_INK });
  const lawNote = T(lawCard, 0, 76, "(this “=” compares masses, so it's allowed)", { size: 26, weight: 600, anchor: 'middle', fill: '#5A6B7A', font: FB });
  const lawTick = tick(lawCard, 16); tr(lawTick, 410, 22);

  // motto banner
  const motto = G(Lfg);
  E('rect', { x: -250, y: -100, width: 500, height: 200, rx: 18, fill: '#0F2418', stroke: '#2F6B45', 'stroke-width': 5 }, motto);
  const mot1 = T(motto, 0, -22, "ATOMS CAN'T HIDE.", { size: 44, weight: 800, anchor: 'middle', fill: '#7CFF9E' });
  const mot2 = T(motto, 0, 52, "ATOMS CAN'T DIE.", { size: 44, weight: 800, anchor: 'middle', fill: '#7CFF9E' });

  // heavier: the lab balance
  const labBal = auLabBal(Lfront); tr(labBal, 730, 560, 1.1);
  const chBefore = auLabel(Lfg, 'before', { size: 30 });
  const chAfter = auLabel(Lfg, 'after burning', { size: 30, color: C.energy, stroke: C.energy });
  const upArr = G(Lfg);
  E('path', { d: 'M0,-60 L34,-14 L12,-14 L12,40 L-12,40 L-12,-14 L-34,-14 Z', fill: C.energy, stroke: SC_INK, 'stroke-width': 3, 'stroke-linejoin': 'round' }, upArr);
  const upChip = auLabel(upArr, '+0.08 g', { size: 32, color: C.energy, stroke: C.energy }); tr(upChip, 0, 86);

  // joined
  const chAir = auLabel(Lfg, 'from the air', { size: 30, color: '#FFB3A8', stroke: C.oxygen });
  const airArr = arrow(Lfg, 0, 0, 0, 80, { color: '#FFB3A8', width: 6 });
  const chJoin = G(Lfg);
  const jBox = E('rect', { x: -300, y: -40, width: 600, height: 80, rx: 18, fill: 'rgba(10,27,39,0.92)', stroke: C.energy, 'stroke-width': 3 }, chJoin);
  T(chJoin, 0, 12, 'magnesium + oxygen → magnesium oxide', { size: 32, weight: 800, anchor: 'middle', fill: C.ink });
  void jBox;
  const chPlus = auLabel(Lfg, 'oxygen joined on = extra mass', { size: 30, color: C.energy, stroke: C.energy });
  const joinFlash = spark(Lfg, 26);

  // fizz / escaped / sealed
  const chOpen = auLabel(Lfg, 'open flask', { size: 30 });
  const chMarble = auLabel(Lfg, 'marble chips + acid', { size: 30 });
  const chDown = auLabel(Lfg, 'reading goes DOWN', { size: 32, color: C.bad, stroke: C.bad });
  const downArr = G(Lfg);
  E('path', { d: 'M0,46 L30,6 L11,6 L11,-40 L-11,-40 L-11,6 L-30,6 Z', fill: C.bad, stroke: SC_INK, 'stroke-width': 3, 'stroke-linejoin': 'round' }, downArr);
  const gasMols = [0, 1, 2].map(() => molCO2(Lfg, 17, {}));
  const chEsc = auLabel(Lfg, 'carbon dioxide ESCAPED', { size: 32, color: C.co2, stroke: C.co2 });
  const clip = G(Lfg);
  const clipB = scClipboard(clip, 1.6);
  void clipB;
  T(clip, 0, -84, 'SIGN OUT', { size: 28, weight: 800, anchor: 'middle', fill: '#3F5BD9' });
  tr(tkFormula(clip, -46, -26, 'CO2', { size: 30, fill: SC_INK, anchor: 'middle' }), 0, 0);
  E('line', { x1: -10, y1: -22, x2: 70, y2: -22, stroke: SC_INK, 'stroke-width': 3 }, clip);
  T(clip, 30, 30, '?', { size: 40, weight: 800, anchor: 'middle', fill: C.bad });
  const chSealed = auLabel(Lfg, 'SEALED: nothing in or out', { size: 32, color: '#FF9BD2', stroke: '#FF7AA8' });
  const chSame = auLabel(Lfg, 'total mass stays the SAME', { size: 32, color: C.good, stroke: C.good });
  const sameTick = tick(Lfg, 26);

  // thmass: the confessional plaque
  const plaque = G(Lfg);
  E('rect', { x: -170, y: -120, width: 340, height: 240, rx: 14, fill: '#6B4A2E', stroke: '#C9A227', 'stroke-width': 8 }, plaque);
  E('rect', { x: -146, y: -96, width: 292, height: 192, rx: 8, fill: '#F4ECD6' }, plaque);
  T(plaque, 0, -48, 'TIMES', { size: 30, weight: 800, anchor: 'middle', fill: '#6B4A2E' });
  T(plaque, 0, -12, 'SURPRISED', { size: 30, weight: 800, anchor: 'middle', fill: '#6B4A2E' });
  const plaqueN = T(plaque, 0, 76, '0', { size: 84, weight: 800, anchor: 'middle', fill: '#B5372D' });
  void plaqueN;

  /* ---------- the menu board (balanced -> approved) ---------- */
  const board = tkBoard(Lboard, 640, 400, 'MENU'); tr(board, 400, 340);
  const B = G(Lboard);   // board content, stage coordinates
  // balanced: definition + see-saw
  const bal = G(B);
  T(bal, 400, 262, 'BALANCED =', { size: 46, weight: 800, anchor: 'middle', fill: C.energy });
  T(bal, 400, 310, 'the same number of each type', { size: 32, weight: 700, anchor: 'middle', fill: '#FFF7C2' });
  T(bal, 400, 350, 'of atom on BOTH sides', { size: 32, weight: 700, anchor: 'middle', fill: '#FFF7C2' });
  E('path', { d: 'M400,452 L370,500 L430,500 Z', fill: '#C9A27A', stroke: SC_INK, 'stroke-width': 3, 'stroke-linejoin': 'round' }, bal);
  const beam = G(bal); tr(beam, 400, 452);
  E('rect', { x: -190, y: -6, width: 380, height: 12, rx: 6, fill: '#D5DCE3', stroke: SC_INK, 'stroke-width': 3 }, beam);
  const seesL = G(beam), seesR = G(beam); tr(seesL, -150, -6); tr(seesR, 150, -6);
  [seesL, seesR].forEach(sd => { tr(atom(sd, 'H', 13), -30, -14); tr(atom(sd, 'H', 13), 0, -14); tr(atom(sd, 'O', 16), 32, -17); });
  const seesDrop = sideOf => sideOf.lastChild;   // the O on each side
  const dropO = seesDrop(seesR);
  T(bal, 250, 526, 'left side', { size: 26, weight: 700, anchor: 'middle', fill: C.muted });
  T(bal, 550, 526, 'right side', { size: 26, weight: 700, anchor: 'middle', fill: C.muted });
  // the equation, term by term (real subscripts via tkFormula)
  const EQY = 292, FS = 58;
  const eq = G(B);
  const coefA = tkFormula(eq, 138, EQY, '2', { size: FS }), tH2 = tkFormula(eq, 196, EQY, 'H2', { size: FS, fill: '#FFFFFF' });
  const tPlus = tkFormula(eq, 262, EQY, '+', { size: FS, fill: '#FFFFFF' }), tO2 = tkFormula(eq, 330, EQY, 'O2', { size: FS, fill: '#FFFFFF' });
  const tArr = tkFormula(eq, 425, EQY, '->', { size: FS, fill: '#FFD54A' });
  const coefB = tkFormula(eq, 497, EQY, '2', { size: FS }), tH2O = tkFormula(eq, 575, EQY, 'H2O', { size: FS, fill: '#FFFFFF' });
  const wH2O = textWidth('H', FS, FD, 800) + textWidth('2', FS * 0.64, FD, 800) + textWidth('O', FS, FD, 800);
  const sub2 = T(eq, 0, 0, '2', { size: FS * 0.64, weight: 800, anchor: 'middle', fill: '#FF6070' });
  const SUB2X = 575 + wH2O / 2 + 14, SUB2Y = EQY + FS * 0.26;
  const smudge = E('ellipse', { cx: SUB2X, cy: SUB2Y - 10, rx: 26, ry: 20, fill: '#DDE8E2', opacity: 0 }, eq);
  // atoms under the terms
  const aH2a = auH2(eq, 17), aH2b = auH2(eq, 17), aO2 = molO2(eq, 19, { letter: true });
  const aW1 = molH2O(eq, 22, { letter: true }), aW2 = molH2O(eq, 22, { letter: true });
  const aXO = atom(eq, 'O', 20, { letter: true });
  tr(aH2a, 196, 368); tr(aH2b, 196, 432); tr(aO2, 330, 368); tr(aW1, 575, 364); tr(aW2, 575, 432);
  const rings = [[316, 368], [344, 368], [575, 364]].map(([x, y]) => { const r = E('circle', { cx: x, cy: y, r: 27, fill: 'none', stroke: C.energy, 'stroke-width': 5 }, eq); return r; });
  const tallyO = auTally(eq), tallyH = auTally(eq);
  tr(tallyO, 565, 506); tr(tallyH, 255, 506);
  const tickO = tick(eq, 14), tickH = tick(eq, 14); tr(tickO, 718, 506); tr(tickH, 410, 506);
  const chPerox = auLabel(Lfg, 'hydrogen peroxide', { size: 28, color: '#FFB3A8', stroke: C.bad });
  const chBig = auLabel(Lfg, 'only BIG numbers in front', { size: 30, color: C.energy, stroke: C.energy });
  const stUnb = tkStamp(Lfg, 'UNBALANCED', C.bad);
  const stNever = tkStamp(Lfg, 'NEVER CHANGE A SUBSCRIPT', C.bad);
  const stApp = tkStamp(Lfg, 'APPROVED', C.good);
  // the dish Olly presents (in front of the island top)
  const dish = tkDish(Lon, 0.62);
  const dW1 = molH2O(dish.food, 20, {}), dW2 = molH2O(dish.food, 20, {});
  tr(dW1, -32, -26); tr(dW2, 34, -26);
  const bottle = G(dish.food);
  E('path', { d: 'M-34,0 L-34,-84 Q-34,-104 -14,-110 L-14,-128 L14,-128 L14,-110 Q34,-104 34,-84 L34,0 Z', fill: '#F7FAFF', stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, bottle);
  E('rect', { x: -16, y: -146, width: 32, height: 20, rx: 4, fill: '#3F5BD9', stroke: SC_INK, 'stroke-width': 3 }, bottle);
  E('rect', { x: -28, y: -76, width: 56, height: 40, rx: 4, fill: '#5AB4FF' }, bottle);
  const stink = G(dish.food);
  [-30, 0, 30].forEach((x, i) => E('path', { d: `M${x},-160 q10,-14 0,-28 q-10,-14 0,-28`, fill: 'none', stroke: '#9BE77A', 'stroke-width': 5, 'stroke-linecap': 'round', opacity: 0.8 - i * 0.1 }, stink));
  const chBleach = auLabel(Lfg, 'BLEACH!', { size: 32, color: '#5AB4FF', stroke: '#5AB4FF' });
  const dishSpark = spark(dish.food, 14); tr(dishSpark, 70, -60);
  // bleach two-shot: H2O2 card
  const perox = G(Lfg);
  E('rect', { x: -190, y: -96, width: 380, height: 210, rx: 22, fill: 'rgba(10,27,39,0.92)', stroke: C.bad, 'stroke-width': 4 }, perox);
  tkFormula(perox, 0, -14, 'H2O2', { size: 76, fill: '#FFFFFF' });
  T(perox, 0, 40, 'hydrogen peroxide', { size: 30, weight: 700, anchor: 'middle', fill: '#FFB3A8' });
  const peroxB = T(perox, 0, 88, '= BLEACH', { size: 34, weight: 800, anchor: 'middle', fill: '#5AB4FF' });

  /* ---------- cuts ---------- */
  const CUTS = [
    [-1, 'wide', 'round'],
    [at('hi') - 0.08, 'mclose', 'hi'],
    [at('rule') - 0.08, 'mdiag', 'rule'],
    [at('law') - 0.08, 'wide', 'law'],
    [at('motto') - 0.08, 'mclose', 'motto'],
    [at('heavier') - 0.08, 'lab', 'heavier'],
    [at('no') - 0.06, 'mclose', 'no'],
    [at('joined') - 0.08, 'pan', 'joined'],
    [at('fizz') - 0.08, 'pan', 'fizz'],
    [at('sealed') - 0.08, 'pan', 'sealed'],
    [at('thmass') - 0.08, 'conf', 'thmass'],
    [at('balanced') - 0.08, 'board', 'board'],
    [at('bleach') - 0.08, 'two', 'bleach'],
    [mid('bleach', 0.45), 'board', 'board'],
  ];
  const cutAt = t => { let c = CUTS[0]; for (const k of CUTS) if (t >= k[0]) c = k; return c; };
  const FLOAT = [mot1, mot2, roundCard, diag, lawCard, motto, chBefore, chAfter, upArr, chAir, airArr, chJoin, chPlus, joinFlash,
    chOpen, chMarble, chDown, downArr, chEsc, clip, chSealed, chSame, sameTick, plaque, chPerox, chBig, chBleach, perox, ...gasMols];

  return t => {
    const [c0, shot, setup] = cutAt(t);
    const shown = {};
    const show = (key, x, y, s, st) => { const c = BY[key]; shown[key] = 1; op(c, st.op === undefined ? 1 : st.op); tr(c, x, y, s); c.set(Object.assign({ t }, st)); };
    const showW = (key, cam, wx, wy, s, st) => { const [x, y] = auSp(cam, wx, wy); show(key, x, y, s * cam.k, st); };
    FLOAT.forEach(e => op(e, 0));
    ltMass.set(0);
    [kitchen, counter, lab, bench, conf, labBal, Lboard, spot, dish, panCruc, panFlask].forEach(e => op(e, 0));
    [stUnb, stNever, stApp].forEach(s => s.set(0));
    auSeat(olly, Lcast);
    op(kitchen.sign, shot === 'board' || shot === 'mdiag' || shot === 'pan' ? 0 : 1);
    tr(massGlasses, 0, 26);
    const kitOn = cam => { op(kitchen, 1); op(counter, 1); kitchen.upd(t); auSetCam(kitchen, cam); auSetCam(counter, cam); };
    const katOn = cam => showW('kat', cam, 150, 556, 0.42, { mood: 'deadpan', still: true });

    /* ================= WIDE ================= */
    if (shot === 'wide') {
      const cam = setup === 'round' ? auCam(1 + 0.04 * P(t, S.first, 4, linear), 760, 420, 760, 420) : CAM0;
      kitOn(cam); katOn(cam);
      const law = setup === 'law';
      const bounce = Math.abs(Math.sin(t * 3.2)) * 10 * AMP;
      let aMood = 'deadpan', aLook = 0.5;
      if (law) { aMood = t > mid('law', 0.25) && t < mid('law', 0.75) ? 'annoyed' : 'deadpan'; aLook = t < mid('law', 0.8) ? -0.3 : 0.6; }
      showW('arrow', cam, 760, 470, 1, { mood: aMood, look: aLook, talk: talk(t, 'arrow') });
      showW('olly', cam, 290, 455 - bounce, 0.9, { mood: !law && t > mid('round', 0.75) ? 'shock' : 'happy', look: 0.85, sparkle: 1 });
      showW('mass', cam, 1010, 485, 0.8, { reading: '0.00 g', look: law ? -0.5 : -0.2, mood: 'deadpan' });
      if (setup === 'round') {
        // the spotlight swings across onto Madam Mass
        const sw = P(t, at('round') + 0.1, 1.6, ease);
        op(spot, 0.25 + 0.6 * P(t, at('round'), 0.4, linear));
        const [sx, sy] = auSp(cam, lerp(520, 1010, sw), 600);
        tr(spot, sx, sy, cam.k, lerp(-24, 0, sw));
        auPop(roundCard, t, mid('round', 0.12), 560, 252);
      } else {
        auPop(lawCard, t, at('law') + 0.02, 600, 220, 1);
        op(lawNote, P(t, mid('law', 0.55), 0.3, linear));
        const tp = P(t, mid('law', 0.75), 0.4, pop); op(lawTick, clamp(tp * 3)); tr(lawTick, 410, 22, Math.max(0.01, tp));
      }
    }

    /* ================= MADAM MASS CLOSE ================= */
    if (shot === 'mclose') {
      let k = 1.9 + 0.05 * P(t, c0, 4, linear), reading = '0.00 g', look = 0, mood = 'deadpan';
      if (setup === 'no') k = lerp(1.9, 2.45, P(t, c0, end('no') + 0.55 - c0, ease));
      if (setup === 'motto') {
        k = 2.0 + 0.06 * P(t, c0, 3, linear);
        // the LCD scrolls the motto, 9 characters at a time
        const msg = "         ATOMS CAN'T HIDE...   ATOMS CAN'T DIE.         ";
        const i = Math.floor(clamp((t - at('motto')) / (end('motto') + 0.3 - at('motto'))) * (msg.length - 9));
        reading = msg.substr(i, 9);
        const pp = P(t, mid('motto', 0.05), 0.4, pop);
        op(motto, clamp(pp * 2.5)); tr(motto, 330, 330, Math.max(0.01, 0.6 + 0.4 * pp));
        op(mot1, 1); op(mot2, P(t, mid('motto', 0.5), 0.25, linear));
        // she pushes her glasses up, in the pause
        const gp = P(t, end('motto') + 0.02, 0.18, easeOut) * (1 - P(t, end('motto') + 0.4, 0.2, ease));
        tr(massGlasses, 0, 26 - 14 * gp);
        if (t > end('motto')) reading = 'DIE.';
      }
      const cam = auCam(k, 1010, 485, 860, 430);
      kitOn(cam);
      showW('mass', cam, 1010, 485, 0.8, { reading, look, mood, talk: talk(t, 'mass') });
      if (setup === 'hi') ltMass.set(win(t, at('hi') + 0.1, at('hi') + 3.3, 0.3));
    }

    /* ================= MASS + DIAGRAM ================= */
    if (shot === 'mdiag') {
      const cam = auCam(1.25, 1010, 485, 975, 440);
      kitOn(cam);
      showW('mass', cam, 1010, 485, 0.8, { reading: '0.00 g', look: -0.7, mood: 'deadpan', talk: talk(t, 'mass') });
      op(diag, P(t, at('rule') - 0.05, 0.25, linear));
      const rp = P(t, mid('rule', 0.1), 1.5, ease);
      RA.forEach(([k, a, b], i) => tr(raEls[i], lerp(a[0], b[0], rp), lerp(a[1], b[1], rp) - 70 * Math.sin(Math.PI * rp) * (i % 2 ? 0.7 : 1)));
      dArrow.set(P(t, mid('rule', 0.04), 0.5));
      op(cntR, P(t, mid('rule', 0.1) + 1.4, 0.3, linear)); op(cntL, 1);
      auPop(chMade, t, mid('rule', 0.33), 240, 520);
      auPop(chDest, t, mid('rule', 0.45), 560, 520);
      if (t > mid('rule', 0.62)) { op(chMade, 0); op(chDest, 0); auPop(chMassEq, t, mid('rule', 0.62), 410, 530); } else op(chMassEq, 0);
    }

    /* ================= THE LAB ================= */
    if (shot === 'lab') {
      op(lab, 1); op(bench, 1); op(labBal, 1); lab.upd(t); auSetCam(lab, CAM0); auSetCam(bench, CAM0);
      const sw = mid('heavier', 0.3);
      const after = P(t, sw, 0.25, linear);
      labBal.set(after, after > 0.5 ? '24.20 g' : '24.12 g');
      const f = (t - at('heavier')) / (end('heavier') - at('heavier'));
      const mood = f < 0.22 ? 'neutral' : f < 0.62 ? 'shock' : 'sad';
      show('kavya', 400, 410, 1.3, { mood, talk: talk(t, 'kavya'), look: f > 0.25 && f < 0.62 ? 0.8 : 0, sweat: 0.6 });
      if (t < sw) auPop(chBefore, t, at('heavier'), 730, 300);
      else {
        auPop(chAfter, t, sw, 730, 300);
        const up = P(t, sw + 0.15, 0.45, pop);
        op(upArr, clamp(up * 2.5)); tr(upArr, 1000, 200 - 10 * Math.sin(t * 4) * AMP, Math.max(0.01, 0.6 + 0.4 * up));
      }
    }

    /* ================= MADAM MASS'S PAN ================= */
    if (shot === 'pan') {
      const k = 1.5 + 0.03 * P(t, c0, 6, linear);
      // a cheat shot: the plain tiled wall behind her, so the flask reads clearly
      const cam = auCam(k, 400, 470, 600, 460);
      kitOn(cam);
      const mx = 930, my = 460, sM = 0.8 * k;
      const panY = my - 72 * sM;
      let reading = '0.00 g', mood = 'deadpan', look = -0.3;
      if (setup === 'joined') {
        op(panCruc, 1);
        const tl = at('joined') + 0.05, land = mid('joined', 0.38);
        const dp = clamp((t - tl) / (land - tl));
        const oy = lerp(-140, panY - 120 * sM, easeIn(dp)) - (t > land ? 26 * Math.sin(clamp((t - land) / 0.35) * Math.PI) * Math.exp(-(t - land) * 2) : 0);
        auSeat(olly, Lfg);
        show('olly', mx, oy, 0.55, { mood: t > land ? 'happy' : 'shock', talk: talk(t, 'olly'), look: 0.3, sparkle: t > land ? 1 : 0 });
        reading = t > land + 0.1 ? '24.20 g' : '24.12 g';
        mood = t > land + 0.1 ? 'smug' : 'deadpan';
        look = 0;
        op(chAir, win(t, tl, land + 0.3, 0.2)); tr(chAir, 700, 150);
        op(airArr, win(t, tl, land + 0.3, 0.2)); tr(airArr, 700, 186);
        const fp = P(t, land, 0.35, linear); op(joinFlash, fp > 0 && fp < 1 ? 1 - fp : 0); tr(joinFlash, mx, panY - 40 * sM, 1 + 2 * fp); joinFlash.upd(t);
        auPop(chPlus, t, land + 0.25, 420, 360);
        auPop(chJoin, t, mid('joined', 0.55), 420, 520, 0.95);
      } else {
        op(panFlask, 1);
        const sealed = setup === 'sealed';
        op(balloon, sealed ? 1 : 0); op(neckBand, sealed ? 1 : 0);
        fizz.upd(t, 1);
        const mouthY = panY - 117 * sM;
        if (!sealed) {
          const dp = P(t, mid('fizz', 0.35), end('fizz') - mid('fizz', 0.35), linear);
          const ep = P(t, at('escaped'), 4, linear);
          reading = (182.40 - 0.45 * dp - 0.05 * ep).toFixed(2) + ' g';
          const esc = t >= at('escaped') - 0.1;
          mood = esc && t > mid('escaped', 0.05) ? 'annoyed' : 'deadpan';
          look = esc ? -0.8 : -0.3;
          // gas leaving the open flask
          const g0 = mid('fizz', 0.4);
          gasMols.forEach((m, i) => {
            const q = (t - g0) * 0.22 - i * 0.33;
            if (t < g0 || q < 0) { op(m, 0); return; }
            const qq = q % 1;
            op(m, Math.min(1, qq * 8, (1 - qq) * 4) * (esc ? 1 : 0.8));
            tr(m, mx - 260 * qq + 16 * Math.sin(t * 2 + i), mouthY - 10 - 430 * qq, 1, 20 * Math.sin(t + i));
          });
          if (!esc) {
            auPop(chMarble, t, mid('fizz', 0.12), 470, 290);
            auPop(chOpen, t, mid('fizz', 0.28), 470, 370);
            auPop(chDown, t, mid('fizz', 0.55), 470, 560);
            const da = P(t, mid('fizz', 0.5), 0.4, pop); op(downArr, clamp(da * 3)); tr(downArr, mx - 150 * sM, my + 100 * sM + 6 * Math.sin(t * 5) * AMP, Math.max(0.01, da));
          } else {
            auPop(chEsc, t, at('escaped') + 0.05, 420, 190);
            auPop(clip, t, mid('escaped', 0.5), 390, 420, 1, -4);
            const da = 1; op(downArr, da); tr(downArr, mx - 150 * sM, my + 100 * sM + 6 * Math.sin(t * 5) * AMP);
          }
        } else {
          reading = '182.40 g';
          const ip = P(t, at('sealed') + 0.2, 3, easeOut);
          tr(balIn, 0, 0, 0.35 + 0.65 * ip);
          balMols.forEach((m, i) => { const a = t * (1.3 + i * 0.4) + i * 2; tr(m, 26 * Math.sin(a), -55 + 28 * Math.cos(a * 1.3), 1, a * 40); });
          mood = t > mid('sealed', 0.7) ? 'smug' : 'deadpan';
          look = -0.2;
          auPop(chSealed, t, mid('sealed', 0.08), 410, 250);
          auPop(chSame, t, mid('sealed', 0.6), 410, 560);
          const tp = P(t, mid('sealed', 0.7), 0.4, pop); op(sameTick, clamp(tp * 3)); tr(sameTick, mx - 165 * sM, my + 100 * sM, Math.max(0.01, tp * 1.1));
        }
      }
      show('mass', mx, my, sM, { reading, look, mood, talk: talk(t, 'mass') });
    }

    /* ================= CONFESSIONAL ================= */
    if (shot === 'conf') {
      conf.set(1, t);
      const k = 1 + 0.06 * P(t, c0, end('thmass') - c0, linear) + 0.08 * P(t, end('thmass'), 0.9, ease);
      auSetCam(conf, { k, fx: 440, fy: 395, sx: 440, sy: 395 });
      const q = mid('thmass', 0.82);
      const reading = t > q && t < q + 0.28 ? '?' : '23 YEARS';
      show('mass', 440, 395, 1.7 * k, { reading, mood: 'deadpan', look: 0, talk: talk(t, 'mass') });
      auPop(plaque, t, mid('thmass', 0.4), 930, 290, 1, 3);
    }

    /* ================= THE MENU BOARD ================= */
    if (shot === 'board') {
      kitOn(CAM0);
      showW('kat', CAM0, 106, 566, 0.36, { mood: 'deadpan', still: true });
      op(Lboard, 1);
      const tB = at('balanced'), tHy = at('hydrogen'), tCo = at('count'), tCh = at('cheat'), tBl = at('bleach'), tFx = at('fix'), tAp = at('approved');
      // balanced: see-saw drops into level
      op(bal, 1 - P(t, tHy - 0.1, 0.25, linear));
      const dropP = P(t, mid('balanced', 0.55), 0.45, easeIn);
      op(dropO, dropP > 0 ? 1 : 0); tr(dropO, 32, -17 - 140 * (1 - dropP));
      tr(beam, 400, 452, 1, lerp(-9, 0, P(t, mid('balanced', 0.55) + 0.45, 0.5, pop)) + (t > mid('balanced', 0.55) + 0.45 ? 0 : 1.5 * Math.sin(t * 3)));
      // the equation
      op(eq, t > tHy - 0.1 ? 1 : 0);
      const term = (el, t0) => { const p = P(t, t0, 0.35, pop); op(el, clamp(p * 3)); };
      term(tH2, mid('hydrogen', 0.5)); term(tPlus, mid('hydrogen', 0.6)); term(tO2, mid('hydrogen', 0.66)); term(tArr, mid('hydrogen', 0.76)); term(tH2O, mid('hydrogen', 0.84));
      const atomIn = (el, t0, x, y) => { const p = P(t, t0, 0.4, pop); op(el, clamp(p * 3)); tr(el, x, y, Math.max(0.01, p)); };
      atomIn(aH2a, mid('hydrogen', 0.54), 196, 368); atomIn(aO2, mid('hydrogen', 0.7), 330, 368); atomIn(aW1, mid('hydrogen', 0.88), 575, 364);
      // count the oxygen
      rings.forEach((r, i) => { const t0 = i < 2 ? mid('count', 0.1 + 0.12 * i) : mid('count', 0.5); op(r, t > t0 && t < tCh - 0.05 ? 1 : 0); attr(r, 'r', 27 + 3 * Math.sin(t * 8)); });
      op(tallyO, 0); op(tallyH, 0); op(tickO, 0); op(tickH, 0);
      if (t > mid('count', 0.12) && t < tCh - 0.05) { op(tallyO, 1); tallyO.set(t < mid('count', 0.5) ? 'O: 2 left' : 'O: 2 left | 1 right', C.bad); }
      if (t > tCo && t < tCh) stUnb.set(P(t, mid('count', 0.82), 0.35, linear));
      if (t >= tCo && t < tCh) tr(stUnb, 400, 420, 0.85, -6);
      // Olly's cheat: a red subscript 2 (and an extra O atom), later rubbed out
      const cheatOn = P(t, mid('cheat', 0.42), 0.3, pop), rub = P(t, mid('bleach', 0.7), 0.35, linear);
      op(sub2, t > mid('cheat', 0.42) ? clamp(cheatOn * 3) * (1 - rub) : 0);
      tr(sub2, SUB2X, SUB2Y, Math.max(0.01, 0.6 + 0.4 * cheatOn), -8 + 4 * Math.sin(t * 9) * (1 - clamp(cheatOn)));
      attr(smudge, 'opacity', (0.5 * Math.sin(Math.PI * rub)).toFixed(3));
      const xo = P(t, mid('cheat', 0.6), 0.35, pop);
      op(aXO, t > mid('cheat', 0.6) ? clamp(xo * 3) * (1 - rub) : 0); tr(aXO, 613 + 60 * rub, 350 - 40 * rub, Math.max(0.01, xo));
      // fix: the big numbers
      term(coefB, mid('fix', 0.12)); term(coefA, mid('fix', 0.5));
      if (t < mid('fix', 0.12)) op(coefB, 0);
      if (t < mid('fix', 0.5)) op(coefA, 0);
      if (t > mid('fix', 0.16)) atomIn(aW2, mid('fix', 0.16), 575, 432); else op(aW2, 0);
      if (t > mid('fix', 0.54)) atomIn(aH2b, mid('fix', 0.54), 196, 432); else op(aH2b, 0);
      if (t > mid('fix', 0.28)) { op(tallyO, 1); tallyO.set('O: 2 left | 2 right', C.good); }
      if (t > mid('fix', 0.34)) { op(tallyH, 1); tallyH.set(t < mid('fix', 0.62) ? 'H: 2 left | 4 right' : 'H: 4 left | 4 right', t < mid('fix', 0.62) ? C.bad : C.good); }
      if (t > tAp - 0.1) {
        const a = P(t, mid('approved', 0.3), 0.4, pop), b = P(t, mid('approved', 0.12), 0.4, pop);
        op(tickH, clamp(b * 3)); tr(tickH, 410, 506, Math.max(0.01, b)); op(tickO, clamp(a * 3)); tr(tickO, 718, 506, Math.max(0.01, a));
        stApp.set(P(t, mid('approved', 0.6), 0.35, linear)); tr(stApp, 400, 410, 1, -6);
      }
      // the whole equation glows once it is balanced
      const glowP = t > mid('fix', 0.7) ? 1 + 0.05 * Math.sin(Math.PI * clamp((t - mid('fix', 0.7)) / 0.6)) : 1;
      tr(eq, 400 * (1 - glowP), EQY * (1 - glowP), glowP);
      // bleach board half: stamp, rub-out, only big numbers
      if (t > tBl && t < tFx) {
        stNever.set(P(t, mid('bleach', 0.48), 0.35, linear)); tr(stNever, 400, 470, 0.6, -4);
        auPop(chBig, t, mid('bleach', 0.8), 400, 506);
        if (t > mid('bleach', 0.8)) stNever.set(1 - P(t, mid('bleach', 0.8), 0.2, linear));
      }
      // the dish
      op(dish, 1); tr(dish, 880, 600);
      dish.set(P(t, mid('hydrogen', 0.25), 0.6, ease));
      const bl = P(t, mid('cheat', 0.72), 0.3, linear) * (1 - P(t, mid('bleach', 0.72), 0.3, linear));
      op(dW1, 1 - bl); op(dW2, t > tAp ? P(t, mid('approved', 0.6), 0.3, linear) : 0);
      tr(dW1, t > tAp ? lerp(0, -32, P(t, mid('approved', 0.6), 0.3, ease)) : 0, -26);
      op(bottle, bl); tr(bottle, 0, 10 * (1 - bl)); op(stink, bl); tr(stink, 0, -6 * Math.sin(t * 3) * AMP);
      op(dishSpark, t > tAp ? P(t, mid('approved', 0.65), 0.3, linear) : 0); dishSpark.upd(t);
      if (bl > 0.5 && t < tFx) auPop(chBleach, t, mid('cheat', 0.85), 880, 318);
      if (t > mid('cheat', 0.6) && t < mid('bleach', 0.47)) auPop(chPerox, t, mid('cheat', 0.65), 590, 474);
      // who stands behind the island
      if (t < tBl) {
        let mood = 'happy', look = -0.75;
        if (t > tCo) mood = t > mid('count', 0.85) ? 'shock' : 'happy';
        if (t > tCh - 0.1) { mood = 'smug'; look = t < mid('cheat', 0.3) ? 0.3 : -0.75; }
        const bounce = Math.abs(Math.sin(t * 3.2)) * 8 * AMP * (mood === 'happy' ? 1 : 0.3);
        show('olly', 880, 452 - bounce, 0.85, { mood, look, talk: talk(t, 'olly'), sparkle: mood === 'shock' ? 0 : 1 });
      } else {
        let mood = 'annoyed', look = -0.8;
        if (t > tFx - 0.1) { mood = t < mid('fix', 0.75) ? 'deadpan' : 'neutral'; look = -0.8; }
        if (t > tAp - 0.1) { mood = 'neutral'; look = t < mid('approved', 0.5) ? 0.8 : -0.3; }
        show('arrow', 872, 482, 0.85, { mood, look, talk: talk(t, 'arrow') });
      }
      // Madam Mass audits from the end of the island
      let mMood = 'deadpan', reading = '0.00 g';
      if (t > tCo + 0.1) reading = 'UNBAL.';
      if (t > mid('cheat', 0.5)) { reading = 'ERR'; mMood = 'annoyed'; }
      if (t > tFx) { reading = '...'; mMood = 'deadpan'; }
      if (t > mid('approved', 0.45)) { reading = 'BALANCED'; mMood = 'smug'; }
      show('mass', 1082, 488, 0.7, { reading, mood: mMood, look: t > tAp && t < mid('approved', 0.5) ? -0.2 : -0.85, talk: talk(t, 'mass') });
    }

    /* ================= ARROW + OLLY TWO-SHOT ================= */
    if (shot === 'two') {
      const cam = auCam(1.45 + 0.04 * P(t, c0, 2.5, linear), 760, 470, 760, 430);
      kitOn(cam);
      showW('arrow', cam, 760, 470, 1, { mood: 'annoyed', look: -0.7, talk: talk(t, 'arrow') });
      show('olly', 280, 470, 1.0, { mood: t < mid('bleach', 0.22) ? 'smug' : 'shock', look: 0.7, sparkle: t < mid('bleach', 0.22) ? 1 : 0 });
      auPop(perox, t, at('bleach') + 0.05, 290, 210);
      op(peroxB, P(t, mid('bleach', 0.2), 0.25, linear));
    }

    Object.keys(BY).forEach(k => { if (!shown[k]) op(BY[k], 0); });
  };
});
