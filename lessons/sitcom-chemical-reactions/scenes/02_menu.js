/* Scene 2: "Writing the menu" (Round 2: equations).
   Shots (hard sitcom cuts):
   A  kitchen wide: ROUND 2 card
   B  the MENU board drops in: menu = equation; REACTANTS (ingredients) | PRODUCTS (dishes); Arrow slides into the gap
   C  Kavya's bench: magnesium ribbon in the Bunsen flame, tiny Olly leaps on; dazzling white flash; white powder
   D  board: magnesium + oxygen [Arrow] magnesium oxide; Olly "Great equation, Equals!"; a little "=" floats up
   E  push-in on Arrow, annoyed: the "=" gets a red cross ("My name is Arrow.")
   F  board: SYMBOL EQUATION 2Mg + O2 -> 2MgO; then a giant O2 (the subscript counts only the atom before it)
   G  Olly close-up: "One gorgeous molecule!" (two lobes = two O atoms)
   H  board: 2H2O = two water molecules; Olly "two hydrogen atoms!"; Arrow counts four H and two O
   I  Arrow confessional, soft-focus Olly waving behind him. */
scene('menu', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1, CALM = !!S.reduce;

  /* ---------- local helpers (prefixed mn) ---------- */
  const on = (t, a, b) => (t >= a && t < b ? 1 : 0);
  const cam0 = { k: 1, fx: 600, fy: 375, sx: 600, sy: 375 };
  const camAbout = (k, cx, cy) => ({ k, fx: cx, fy: cy, sx: cx, sy: cy });
  const camSet = (el, c) => el.setAttribute('transform', `translate(${c.sx.toFixed(1)} ${c.sy.toFixed(1)}) scale(${c.k.toFixed(4)}) translate(${(-c.fx).toFixed(1)} ${(-c.fy).toFixed(1)})`);
  const place = (el, c, x, y, s, r) => tr(el, c.sx + c.k * (x - c.fx), c.sy + c.k * (y - c.fy), s * c.k, r);
  const popIn = (el, t, t0, x, y, s, r) => { const p = P(t, t0, 0.45, pop); op(el, clamp(p * 2.5)); tr(el, x, y, Math.max(0.01, (s || 1) * (0.6 + 0.4 * p)), r); return p; };
  function mnChip(parent, text, o) {
    o = o || {};
    const size = o.size || 30, h = Math.round(size * 1.75), g = G(parent);
    const w = textWidth(text, size, FD, 800) + size * 1.5;
    E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: o.rx !== undefined ? o.rx : h / 2, fill: o.fill || 'rgba(10,27,39,0.9)', stroke: o.stroke || C.line, 'stroke-width': o.sw || 3 }, g);
    T(g, 0, size * 0.35, text, { size, weight: o.weight || 700, fill: o.color || C.ink, anchor: 'middle', boldFill: o.boldFill || C.energy });
    return g;
  }
  function mnFChip(parent, src, o) {
    o = o || {};
    const size = o.size || 34, h = Math.round(size * 1.75), g = G(parent);
    const box = E('rect', { y: -h / 2, height: h, rx: h / 2, fill: o.fill || 'rgba(10,27,39,0.9)', stroke: o.stroke || C.line, 'stroke-width': 3 }, g);
    const tx = tkFormula(g, 0, size * 0.33, src, { size, fill: o.color || C.ink });
    let w = 0; try { w = tx.getComputedTextLength(); } catch (e) { w = 0; }
    w = (w || src.length * size * 0.55) + size * 1.4;
    attr(box, 'x', -w / 2); attr(box, 'width', w);
    return g;
  }
  // a silver magnesium atom
  function mnMg(parent, r) {
    const g = G(parent);
    E('circle', { r, fill: ball('#D9E0E7', '#8E99A6'), stroke: '#6E7A86', 'stroke-width': Math.max(1.5, r * 0.08) }, g);
    T(g, 0, r * 0.34, 'Mg', { size: r * 0.9, weight: 800, anchor: 'middle', fill: '#2B3A4A' });
    return g;
  }
  function mnMgO(parent, r) { const g = G(parent); tr(atom(g, 'O', r * 0.82, { letter: true }), r * 1.45, 0); tr(mnMg(g, r), -r * 0.35, 0); return g; }
  // Kavya's lab-coat arm: sleeve from the shoulder to a hand; kind 'hold' | 'flat'; b = sleeve bend
  function mnArm(parent) {
    const g = G(parent);
    const sO = E('path', { fill: 'none', stroke: SC_INK, 'stroke-width': 42, 'stroke-linecap': 'round' }, g);
    const sI = E('path', { fill: 'none', stroke: '#F6F8FA', 'stroke-width': 34, 'stroke-linecap': 'round' }, g);
    const hand = G(g);
    const palm = E('ellipse', { rx: 24, ry: 21, fill: '#B9784E', stroke: SC_INK, 'stroke-width': 3.5 }, hand);
    const knuck = E('path', { d: 'M-6,-14 Q2,-6 -6,2 M6,-14 Q14,-6 6,2', fill: 'none', stroke: '#7A4A2E', 'stroke-width': 3, 'stroke-linecap': 'round' }, hand);
    g.set = (sx, sy, hx, hy, ang, kind, b) => {
      b = b === undefined ? 0.18 : b;
      const cx = (sx + hx) / 2 + (hy - sy) * b, cy = (sy + hy) / 2 - (hx - sx) * b;
      const d = `M${sx.toFixed(1)},${sy.toFixed(1)} Q${cx.toFixed(1)},${cy.toFixed(1)} ${hx.toFixed(1)},${hy.toFixed(1)}`;
      attr(sO, 'd', d); attr(sI, 'd', d);
      tr(hand, hx, hy, 1, ang || 0);
      op(knuck, kind === 'flat' ? 0 : 1);
      attr(palm, 'rx', kind === 'flat' ? 44 : 24); attr(palm, 'ry', kind === 'flat' ? 14 : 21);
    };
    return g;
  }
  // a white cartoon glove: 'thumb' (thumbs-up) or 'two' (two fingers)
  function mnGlove(parent, kind) {
    const g = G(parent), st = { fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 4 };
    if (kind === 'two') {
      E('rect', Object.assign({ x: -20, y: -62, width: 16, height: 52, rx: 8, transform: 'rotate(-10 -12 -10)' }, st), g);
      E('rect', Object.assign({ x: 2, y: -62, width: 16, height: 52, rx: 8, transform: 'rotate(10 10 -10)' }, st), g);
    } else E('rect', Object.assign({ x: -22, y: -52, width: 18, height: 44, rx: 9 }, st), g);
    E('rect', Object.assign({ x: -24, y: -16, width: 46, height: 40, rx: 13 }, st), g);
    E('path', { d: 'M-12,-4 L14,-4 M-12,8 L14,8', stroke: '#C9D3DC', 'stroke-width': 3, 'stroke-linecap': 'round' }, g);
    return g;
  }

  /* layers */
  const Lbg = G(root), Lcast = G(root), Lfront = G(root), Lfg = G(root), Lhud = G(root);

  /* ================= sets ================= */
  const kitchen = tkKitchen(Lbg);
  // the MENU board on the kitchen wall (world coordinates; centre (600, 300), inner 920 x 330)
  const boardW = G(Lbg), board = tkBoard(boardW, 920, 330, 'MENU');
  const BX = 600, BY = 300, LCX = 335, RCX = 865;
  const bw = G(boardW);                                   // the board's writing (world coordinates)
  const menuEq = G(bw); T(menuEq, BX, 340, 'MENU = EQUATION', { size: 54, weight: 800, anchor: 'middle', fill: C.energy, ls: 2 });
  // reactants | products
  const colL = G(bw), colR = G(bw);
  T(colL, LCX, 262, 'REACTANTS', { size: 40, weight: 800, anchor: 'middle', fill: '#FFB3A8', ls: 2 });
  T(colL, LCX, 300, '(ingredients)', { size: 28, weight: 600, anchor: 'middle', fill: '#F2F7FA' });
  const plateL = G(colL); tr(plateL, LCX, 425, 0.85);
  E('ellipse', { cx: 0, cy: 6, rx: 118, ry: 26, fill: '#D5DCE3', stroke: SC_INK, 'stroke-width': 4 }, plateL);
  E('ellipse', { cx: 0, cy: 2, rx: 84, ry: 16, fill: '#FFFFFF', stroke: '#C9D3DC', 'stroke-width': 3 }, plateL);
  tr(atom(plateL, 'C', 22, { letter: true }), -56, -24); tr(atom(plateL, 'C', 22, { letter: true }), 56, -24);
  tr(molO2(plateL, 18, { letter: true }), -14, -64); tr(molO2(plateL, 18, { letter: true }), 18, -26);
  T(colR, RCX, 262, 'PRODUCTS', { size: 40, weight: 800, anchor: 'middle', fill: '#9BF0C4', ls: 2 });
  T(colR, RCX, 300, '(dishes)', { size: 28, weight: 600, anchor: 'middle', fill: '#F2F7FA' });
  const plateR = G(colR); tr(plateR, RCX, 425, 0.85);
  E('ellipse', { cx: 0, cy: 6, rx: 118, ry: 26, fill: '#D5DCE3', stroke: SC_INK, 'stroke-width': 4 }, plateR);
  E('ellipse', { cx: 0, cy: 2, rx: 84, ry: 16, fill: '#FFFFFF', stroke: '#C9D3DC', 'stroke-width': 3 }, plateR);
  tr(molCO2(plateR, 17, { letter: true }), -40, -26); tr(molCO2(plateR, 17, { letter: true }), 42, -62);
  const shine = spark(plateR, 12); tr(shine, 80, -92);
  // header line for the equations
  const hdWord = T(bw, BX, 246, 'WORD EQUATION', { size: 30, weight: 700, anchor: 'middle', fill: '#A4BCCB', ls: 3 });
  const hdSym = T(bw, BX, 246, 'SYMBOL EQUATION', { size: 30, weight: 700, anchor: 'middle', fill: '#A4BCCB', ls: 3 });
  // word equation, term by term
  const WS = 40;
  const wMg = T(bw, 0, 0, 'magnesium', { size: WS, weight: 800, anchor: 'middle', fill: '#E3E8ED' });
  const wPlus = T(bw, 0, 0, '+', { size: WS, weight: 800, anchor: 'middle', fill: C.muted });
  const wO = T(bw, 0, 0, 'oxygen', { size: WS, weight: 800, anchor: 'middle', fill: '#FFB3A8' });
  const wMgO = T(bw, RCX, 352, 'magnesium oxide', { size: WS, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  { const a = textWidth('magnesium', WS, FD, 800), b = textWidth('+', WS, FD, 800), c = textWidth('oxygen', WS, FD, 800), gap = 14, tot = a + b + c + 2 * gap;
    let x = LCX - tot / 2; attr(wMg, 'x', x + a / 2); x += a + gap; attr(wPlus, 'x', x + b / 2); x += b + gap; attr(wO, 'x', x + c / 2);
    [wMg, wPlus, wO].forEach(e => attr(e, 'y', 352)); }
  const icWL = G(bw); { const m = mnMg(icWL, 22); tr(m, LCX - 60, 412); const o2 = molO2(icWL, 17, { letter: true }); tr(o2, LCX + 70, 412); T(icWL, LCX + 6, 422, '+', { size: 30, weight: 800, anchor: 'middle', fill: C.muted }); }
  const icWR = G(bw); tr(mnMgO(icWR, 22), RCX, 412);
  // symbol equation
  const sL = tkFormula(bw, LCX, 360, '2Mg + O2', { size: 58 });
  const sR = tkFormula(bw, RCX, 360, '2MgO', { size: 58 });
  const icSL = G(bw); tr(mnMg(icSL, 20), LCX - 110, 420); tr(mnMg(icSL, 20), LCX - 62, 420); T(icSL, LCX - 4, 430, '+', { size: 30, weight: 800, anchor: 'middle', fill: C.muted }); tr(molO2(icSL, 17, { letter: true }), LCX + 70, 420);
  const icSR = G(bw); tr(mnMgO(icSR, 20), RCX - 58, 420); tr(mnMgO(icSR, 20), RCX + 62, 420);
  // the giant O2 (shot F)
  const bigO2 = tkFormula(bw, 290, 395, 'O2', { size: 170, anchor: 'start' });
  const o2Spans = bigO2.querySelectorAll('tspan');
  let oW = 120, twoW = 60; try { oW = o2Spans[0].getComputedTextLength() || oW; twoW = o2Spans[1].getComputedTextLength() || twoW; } catch (e) { /* defaults */ }
  const twoX = 290 + oW + twoW / 2;
  const twoGlow = E('ellipse', { cx: twoX, cy: 410, rx: 52, ry: 52, fill: glow(C.energy) }, bw);
  bw.insertBefore(twoGlow, bigO2);
  const subLbl = T(bw, 290 + oW + twoW + 14, 446, '← subscript', { size: 30, weight: 700, fill: C.energy });
  const subArc = arrow(bw, twoX, 352, 290 + oW / 2 + 10, 236, { color: C.energy, width: 5, bend: 46 });
  const o2Mol = G(bw); tr(o2Mol, 760, 318);
  tr(atom(o2Mol, 'O', 42, { letter: true }), -31, 0); tr(atom(o2Mol, 'O', 42, { letter: true }), 31, 0);
  const o2Txt = T(bw, 760, 398, 'two O atoms, joined', { size: 28, weight: 700, anchor: 'middle', fill: '#FFB3A8' });
  // the big 2H2O (shot H)
  const bigW = tkFormula(bw, 470, 318, '2H2O', { size: 110 });
  const coefL = T(bw, 0, 300, 'coefficient', { size: 28, weight: 700, anchor: 'end', fill: C.energy });
  let w2 = 60, wAll = 300; try { w2 = bigW.querySelectorAll('tspan')[0].getComputedTextLength() || w2; wAll = bigW.getComputedTextLength() || wAll; } catch (e) { /* defaults */ }
  const bigX0 = 470 - wAll / 2;
  attr(coefL, 'x', bigX0 - 12);
  const wholeBox = E('rect', { x: bigX0 + w2 + 2, y: 226, width: wAll - w2 + 8, height: 138, rx: 18, fill: 'none', stroke: C.energy, 'stroke-width': 4, 'stroke-dasharray': '12 8' }, bw);
  const waters = [380, 580].map(x => { const g = G(bw); tr(g, x, 400); molH2O(g, 30, { letter: true }); return g; });
  const HPOS = [[351, 422], [409, 422], [551, 422], [609, 422]], OPOS = [[380, 400], [580, 400]];
  const badge = (x, y, n, col) => { const g = G(bw); tr(g, x, y); E('circle', { r: 13, fill: col, stroke: SC_INK, 'stroke-width': 3 }, g); T(g, 0, 7, String(n), { size: 20, weight: 800, anchor: 'middle', fill: SC_INK }); return g; };
  const hRings = HPOS.map(([x, y]) => E('circle', { cx: x, cy: y, r: 23, fill: 'none', stroke: C.energy, 'stroke-width': 5 }, bw));
  const oRings = OPOS.map(([x, y]) => E('circle', { cx: x, cy: y, r: 36, fill: 'none', stroke: '#FF9A8F', 'stroke-width': 5 }, bw));
  const hBadges = HPOS.map(([x, y], i) => badge(x, y + 30, i + 1, C.energy));
  const oBadges = OPOS.map(([x, y], i) => badge(x - 40, y - 28, i + 1, '#FF9A8F'));

  const conf = tkConf(Lbg, 'arrow');
  const lab = tkLab(Lbg);
  const confGlow = E('circle', { cx: 900, cy: 330, r: 190, fill: glow('#FFB3A8'), opacity: 0.5 }, Lbg);

  /* in front of the cast */
  const counter = tkCounter(Lfront);
  const bench = tkBench(Lfront);
  const bun = bunsen(Lfront, 0.9); tr(bun, 815, 542);
  const softVeil = E('rect', { x: 700, y: 120, width: 400, height: 420, rx: 40, fill: '#5E4714', opacity: 0.35 }, Lfront);

  /* ================= props ================= */
  const kitFG = G(Lfg);                                    // kitchen world coordinates
  const eqSign = G(kitFG);
  T(eqSign, 0, 22, '=', { size: 76, weight: 800, anchor: 'middle', fill: '#FF9A8F' });
  const eqX = cross(eqSign, 30);
  const labFG = G(Lfg);                                    // lab world coordinates
  const tongs = G(labFG);
  E('path', { d: 'M598,446 L790,360 M600,456 L792,370', stroke: '#8C97A3', 'stroke-width': 7, 'stroke-linecap': 'round' }, tongs);
  E('circle', { cx: 612, cy: 447, r: 6, fill: '#5A6672' }, tongs);
  const ribbon = G(labFG); tr(ribbon, 791, 365, 1, -24.8);
  E('rect', { x: 0, y: -5, width: 56, height: 10, rx: 2, fill: '#D9E0E7', stroke: '#6E7A86', 'stroke-width': 2 }, ribbon);
  const blaze = G(labFG); tr(blaze, 822, 350);
  E('circle', { r: 190, fill: glow('#FFFFFF') }, blaze);
  const blazeStar = spark(blaze, 54, { color: '#FFFFFF' });
  const armT = mnArm(labFG), armS = mnArm(labFG);
  const cruc = G(labFG); tr(cruc, 660, 548);
  E('path', { d: 'M-46,-34 L46,-34 L34,0 L-34,0 Z', fill: linGrad('#F4F1E8', '#B9B2A2', true), stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, cruc);
  E('path', { d: 'M-38,-34 Q-20,-58 0,-50 Q20,-62 38,-34 Z', fill: '#FFFFFF', stroke: '#C9D3DC', 'stroke-width': 3 }, cruc);

  /* ================= the cast ================= */
  const arrowC = cast(Lcast, 'arrow');
  const mass = cast(Lcast, 'mass');
  const olly = cast(Lcast, 'olly');
  const kat = cast(Lcast, 'kat');
  const kav = cast(Lcast, 'kavya', { mood: 'neutral' });
  const ALL = { arrow: arrowC, mass, olly, kat, kavya: kav };

  /* ================= HUD ================= */
  const banner = G(Lhud);
  E('rect', { x: -310, y: -40, width: 620, height: 80, rx: 16, fill: '#FF4FA0', stroke: '#FFF1F8', 'stroke-width': 4 }, banner);
  T(banner, 0, 14, 'ROUND 2: WRITE THE MENU', { size: 40, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  const meChip = mnChip(Lhud, '→ means **“turns into”**', { size: 32, stroke: C.energy });
  const mgChip = mnChip(Lhud, 'magnesium ribbon', { size: 30, color: '#E3E8ED', stroke: '#D9E0E7' });
  const lightChip = mnChip(Lhud, 'dazzling white light!', { size: 30, color: C.energy, stroke: C.energy });
  const safeChip = mnChip(Lhud, 'Safety: never look straight at it', { size: 26, color: '#FFB3A8', stroke: C.bad });
  const powderChip = mnChip(Lhud, 'white powder: a **new substance**', { size: 28, boldFill: '#9BF0C4' });
  const whiteChip = mnChip(Lhud, 'a white powder', { size: 30, color: '#FFFFFF', stroke: '#D9E0E7' });
  const thumb = mnGlove(Lhud, 'thumb'), twoF = mnGlove(Lhud, 'two');
  const formChip = mnChip(Lhud, 'formulae', { size: 30, color: C.energy, stroke: C.energy });
  const countChip = mnChip(Lhud, 'count the atoms', { size: 30, color: '#9BE7C4', stroke: '#9BE7C4' });
  const subChip = mnChip(Lhud, 'the small number counts **only the atom before it**', { size: 26 });
  const atomL = mnChip(Lhud, 'atom 1', { size: 28, color: '#FFD2CC', stroke: C.oxygen }), atomR = mnChip(Lhud, 'atom 2', { size: 28, color: '#FFD2CC', stroke: C.oxygen });
  const ringL = E('circle', { r: 128, fill: 'none', stroke: '#FFFFFF', 'stroke-width': 6, 'stroke-dasharray': '16 10' }, Lhud);
  const ringR = E('circle', { r: 128, fill: 'none', stroke: '#FFFFFF', 'stroke-width': 6, 'stroke-dasharray': '16 10' }, Lhud);
  const molChip = mnFChip(Lhud, 'O2 = one molecule, two atoms', { size: 32, stroke: C.oxygen });
  const wholeChip = mnChip(Lhud, 'the big number multiplies the **whole formula**', { size: 26 });
  const wrongChip = mnChip(Lhud, '2 H?', { size: 34, color: '#FFB3A8', stroke: C.bad });
  const tally = mnChip(Lhud, 'H: 4     O: 2', { size: 36, color: C.energy, stroke: C.energy });
  const flash = E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#FFFFFF' }, Lhud);

  /* ---------- shot list ---------- */
  const cB = mid('round', 0.42), cC = at('special') - 0.06, cD = at('word') - 0.06, cE = at('arrow') - 0.06, cF = at('symbol') - 0.06,
    cG = at('gorgeous') - 0.06, cH = at('big') - 0.06, cI = at('thconf') - 0.06;
  const flashT = at('whoa') - 0.12;

  return t => {
    const shown = {};
    const show = (k, c, x, y, s, st) => { shown[k] = 1; op(c, st.op === undefined ? 1 : st.op); place(c, cam, x, y, s, st.rot); c.set(Object.assign({ t, still: CALM }, st)); };
    const talk = who => scTalk(S, t, who);

    const sA = on(t, -1e9, cB), sLab = on(t, cC, cD), sConf = on(t, cI, 1e9), sG = on(t, cG, cH);
    const sBoard = (t >= cB && t < cC) || (t >= cD && t < cG) || (t >= cH && t < cI) ? 1 : 0;
    const sKit = sA || sBoard || sG ? 1 : 0;

    /* camera */
    let cam = cam0;
    if (t >= cE && t < cF) cam = camAbout(1.55 + 0.12 * P(t, at('arrow'), cF - at('arrow'), linear), 600, 330);
    if (sG) cam = camAbout(1 + 0.05 * P(t, end('gorgeous'), cH - end('gorgeous'), linear), 600, 420);
    if (sConf) cam = camAbout(1 + 0.06 * P(t, end('thconf') - 0.2, 1.4, ease), 430, 400);
    if (sLab) cam = camAbout(1 + 0.04 * P(t, mid('whoa', 0.6), cD - mid('whoa', 0.6), linear), 560, 420);

    /* sets */
    op(kitchen, sKit); op(counter, sKit); op(kitFG, sKit); op(boardW, sBoard);
    op(lab, sLab); op(bench, sLab); op(bun, sLab); op(labFG, sLab);
    conf.set(sConf, t); op(confGlow, sConf); op(softVeil, sConf);
    if (sKit) { kitchen.upd(t); camSet(kitchen, cam); camSet(counter, cam); camSet(kitFG, cam); camSet(boardW, cam); }
    if (sLab) { lab.upd(t); camSet(lab, cam); camSet(bench, cam); camSet(labFG, cam); place(bun, cam, 815, 542, 1); bun.upd(t); }
    if (sConf) { camSet(conf, cam); }

    /* hide every prop, then show the current shot's */
    [banner, meChip, mgChip, lightChip, safeChip, powderChip, whiteChip, thumb, twoF, formChip, countChip, subChip, atomL, atomR, ringL, ringR, molChip, wholeChip, wrongChip, tally, flash,
      menuEq, colL, colR, hdWord, hdSym, wMg, wPlus, wO, wMgO, icWL, icWR, sL, sR, icSL, icSR, bigO2, twoGlow, subLbl, subArc, o2Mol, o2Txt, bigW, coefL, wholeBox, ...waters, ...hRings, ...oRings, ...hBadges, ...oBadges,
      eqSign, tongs, ribbon, blaze, armT, armS, cruc].forEach(e => op(e, 0));

    if (sKit) show('kat', kat, 170, 545, 0.45, { mood: 'deadpan', still: true });
    hdWord.setAttribute('transform', ''); hdSym.setAttribute('transform', '');

    /* ========== A: round 2 ========== */
    if (sA) {
      popIn(banner, t, at('round') + 0.1, 600, 250);
      show('arrow', arrowC, 760, 492, 1, { mood: 'deadpan', look: -0.2 });
      show('olly', olly, 320, 450, 0.85, { mood: 'happy', look: 0.6, sparkle: 1 });
      show('mass', mass, 1010, 500, 0.8, { mood: 'deadpan', look: -0.4, reading: '0.00 g' });
    }

    /* ========== board shots ========== */
    if (sBoard) {
      const drp = P(t, cB + 0.02, 0.55, pop);
      tr(board, BX, lerp(-360, BY, drp)); tr(bw, 0, lerp(-660, 0, drp));
    }
    // B: menu = equation; reactants | products; Arrow slides into the gap
    if (t >= cB && t < cC) {
      op(menuEq, t < at('rp') - 0.1 ? P(t, mid('round', 0.72), 0.3, linear) : 1 - P(t, at('rp') - 0.1, 0.2, linear));
      op(colL, P(t, mid('rp', 0.15), 0.3, linear)); op(colR, P(t, mid('rp', 0.6), 0.3, linear));
      shine.upd(t);
      const slide = P(t, at('me') + 0.1, 0.7, ease);
      const ax = lerp(1085, BX, slide), ay = lerp(520, 345, slide) - 40 * Math.sin(Math.PI * slide);
      show('arrow', arrowC, ax, ay, lerp(0.55, 0.5, slide), { talk: talk('arrow'), mood: t > mid('me', 0.6) ? 'smug' : 'deadpan', look: t < at('rp') ? -0.6 : t < at('me') ? (t < mid('rp', 0.5) ? -0.8 : -0.3) : 0, still: t > at('me') + 0.8 ? true : CALM });
      if (t > at('me')) popIn(meChip, t, mid('me', 0.55), 600, 535);
    }

    /* ========== C: Kavya's magnesium ========== */
    if (sLab) {
      const fl = P(t, flashT, 0.1, linear) * (1 - P(t, flashT + 0.25, 0.9, ease));
      op(flash, fl * (S.reduce ? 0.6 : 0.95));
      const after = t > mid('whoa', 0.42);
      const shield = t > flashT - 0.05 && t < mid('whoa', 0.62);
      show('kavya', kav, 380, 400, 1.3, { talk: talk('kavya'), mood: t < flashT ? 'neutral' : t < mid('whoa', 0.45) ? 'shock' : 'happy', look: t < flashT ? 0.8 : shield ? -0.3 : 0.5, sweat: 0.6 });
      if (!after) {
        op(tongs, 1); op(ribbon, 1); op(armT, 1); armT.set(470, 505, 588, 452, -24, 'hold');
        popIn(mgChip, t, mid('special', 0.3), 640, 290);
      }
      if (shield) { op(armS, 1); armS.set(292, 505, 372, 322, 0, 'flat', 0.5); }
      if (t >= flashT - 0.1 && t < mid('whoa', 0.5)) {
        const g = P(t, flashT - 0.1, 0.15, linear) * (1 - P(t, mid('whoa', 0.35), 0.4, linear));
        op(blaze, g); blazeStar.upd(t * 3); tr(blaze, 822, 350, 0.9 + 0.15 * Math.sin(t * 23) * AMP);
        popIn(lightChip, t, flashT + 0.3, 640, 280);
        if (t < mid('whoa', 0.55)) popIn(safeChip, t, flashT + 0.5, 620, 608);
      }
      if (after) {
        popIn(cruc, t, mid('whoa', 0.42), 660, 548);
        popIn(powderChip, t, mid('whoa', 0.6), 620, 608);
      }
      // tiny Olly leaps onto the ribbon, then sits in the powder
      const jp = P(t, mid('special', 0.5), 0.6, easeOut);
      if (t >= mid('special', 0.45)) {
        const ox = after ? 672 : lerp(1060, 838, jp), oy = after ? 488 : lerp(230, 322, jp) - 110 * Math.sin(Math.PI * jp);
        show('olly', olly, ox, oy, 0.3, { talk: talk('olly'), mood: after ? 'happy' : jp < 1 ? 'happy' : 'smug', look: -0.6, sparkle: 1, rot: after ? 0 : 20 * (1 - jp) });
      }
    }

    // D: word equation; "Equals"
    if (t >= cD && t < cE) {
      op(hdWord, P(t, at('word') + 0.1, 0.3, linear));
      op(wMg, P(t, mid('word', 0.2), 0.3, linear)); op(wPlus, P(t, mid('word', 0.3), 0.3, linear)); op(wO, P(t, mid('word', 0.33), 0.3, linear));
      op(icWL, P(t, mid('word', 0.36), 0.3, linear));
      op(wMgO, P(t, mid('word', 0.58), 0.3, linear)); op(icWR, P(t, mid('word', 0.62), 0.3, linear));
      popIn(whiteChip, t, mid('word', 0.86), RCX, 535);
      const pulse = Math.sin(Math.PI * P(t, mid('word', 0.44), 0.5, linear));
      const eqT = mid('equals', 0.6);
      show('arrow', arrowC, BX, 345, 0.5 * (1 + 0.12 * pulse), { talk: talk('arrow'), mood: t > eqT + 0.1 ? 'annoyed' : 'deadpan', look: t > at('equals') ? -0.8 : 0, still: true });
      if (t > at('equals') - 0.1) {
        const oi = P(t, at('equals') - 0.1, 0.35, pop);
        show('olly', olly, 300, 560 - 30 * oi, 0.7, { talk: talk('olly'), mood: t > mid('equals', 0.5) ? 'smug' : 'happy', look: 0.8, sparkle: 1 });
        popIn(thumb, t, mid('equals', 0.25), 420, 520, 1, -8);
        if (t > eqT) { const ep = P(t, eqT, 0.8, easeOut); op(eqSign, clamp(ep * 3)); tr(eqSign, 505, 308 - 22 * ep); }
      }
    }
    // E: "My name is Arrow." (push-in)
    if (t >= cE && t < cF) {
      op(hdWord, 1); [wMg, wPlus, wO, wMgO, icWL, icWR].forEach(e => op(e, 1));
      const turn = P(t, at('arrow') - 0.05, 0.9, ease);
      show('arrow', arrowC, BX, 345, 0.5, { talk: talk('arrow'), mood: 'annoyed', look: lerp(-0.8, 0, turn), still: true });
      op(eqSign, 1); tr(eqSign, 505, 286);
      const xp = P(t, mid('arrow', 0.65), 0.3, pop); op(eqX, clamp(xp * 3)); tr(eqX, 0, 0, Math.max(0.01, 1.4 - 0.4 * xp));
    } else op(eqX, 0);
    // F: symbol equation, then the giant O2
    if (t >= cF && t < cG) {
      const flip = P(t, at('symbol') + 0.05, 0.4, ease), clr = P(t, at('sub') - 0.05, 0.25, linear);
      // the header flips (squash) from WORD to SYMBOL
      const sq = Math.abs(Math.cos(Math.PI * flip));
      op(hdWord, flip < 0.5 ? 1 : 0); op(hdSym, (flip >= 0.5 ? 1 : 0) * (1 - clr));
      [hdWord, hdSym].forEach(e => e.setAttribute('transform', `translate(${BX} 236) scale(1 ${Math.max(0.02, sq).toFixed(3)}) translate(${-BX} -236)`));
      const words = 1 - P(t, mid('symbol', 0.08), 0.25, linear);
      [wMg, wPlus, wO, wMgO, icWL, icWR].forEach(e => op(e, words));
      const sym = P(t, mid('symbol', 0.18), 0.35, linear) * (1 - clr);
      op(sL, sym); op(sR, sym); op(icSL, sym); op(icSR, sym);
      if (t < at('sub') - 0.05) { popIn(formChip, t, mid('symbol', 0.45), 420, 535); popIn(countChip, t, mid('symbol', 0.8), 790, 535); }
      // sub: Arrow steps aside to the right
      const aside = P(t, at('sub') - 0.05, 0.5, ease);
      show('arrow', arrowC, lerp(BX, 975, aside), lerp(345, 370, aside), 0.5, { talk: talk('arrow'), mood: 'deadpan', look: t > at('sub') ? -0.7 : 0, still: t < at('sub') ? true : CALM });
      if (t > at('sub') - 0.05) {
        op(bigO2, P(t, at('sub') + 0.15, 0.3, linear));
        op(o2Mol, P(t, mid('sub', 0.2), 0.3, linear)); op(o2Txt, P(t, mid('sub', 0.28), 0.3, linear));
        const gl = P(t, mid('sub', 0.5), 0.3, linear);
        op(twoGlow, gl * (0.75 + 0.25 * Math.sin(t * 6))); op(subLbl, gl);
        if (t > mid('sub', 0.68)) { op(subArc, 1); subArc.set(P(t, mid('sub', 0.68), 0.5, ease)); }
        popIn(subChip, t, mid('sub', 0.74), 600, 535);
      }
    }

    /* ========== G: "One gorgeous molecule!" ========== */
    if (sG) {
      const pose = Math.sin(t * 3) * 4 * AMP;
      show('olly', olly, 600, 430, 1.6, { talk: talk('olly'), mood: t > mid('gorgeous', 0.55) ? 'smug' : 'happy', look: 0, sparkle: 1, still: true, rot: pose });
      const lx = cam.sx + cam.k * (600 - 80 - cam.fx), rx = cam.sx + cam.k * (600 + 80 - cam.fx), ly = cam.sy + cam.k * (430 - cam.fy);
      [[ringL, lx, mid('gorgeous', 0.28)], [ringR, rx, mid('gorgeous', 0.42)]].forEach(([r, x, t0]) => { const p = P(t, t0, 0.35, pop); op(r, clamp(p * 3)); tr(r, x, ly, Math.max(0.01, cam.k * (0.7 + 0.3 * p)), (t * 20 * AMP) % 360); });
      popIn(atomL, t, mid('gorgeous', 0.3), 300, 330); popIn(atomR, t, mid('gorgeous', 0.44), 900, 330);
      popIn(molChip, t, mid('gorgeous', 0.7), 600, 240);
    }

    // H: 2H2O; "two hydrogen atoms!"; four
    if (t >= cH && t < cI) {
      const ap = P(t, at('big') + 0.1, 0.4, linear);
      op(bigW, ap);
      op(coefL, P(t, mid('big', 0.22), 0.3, linear));
      op(wholeBox, P(t, mid('big', 0.42), 0.3, linear) * (t < at('four') ? 1 : 0.35));
      waters.forEach((w, i) => { const p = P(t, mid('big', 0.8) + i * 0.15, 0.4, pop); op(w, clamp(p * 3)); });
      if (t < at('two') - 0.1) popIn(wholeChip, t, mid('big', 0.45), 600, 535);
      show('arrow', arrowC, 975, 370, 0.5, { talk: talk('arrow'), mood: 'deadpan', look: t > at('two') && t < at('four') ? -0.9 : -0.6 });
      if (t > at('two') - 0.15) {
        const oi = P(t, at('two') - 0.15, 0.35, pop);
        const shock = t > at('four') + 0.1;
        show('olly', olly, 300, 560 - 30 * oi, 0.7, { talk: talk('olly'), mood: shock ? 'shock' : 'smug', look: shock ? 0.9 : 0, sparkle: shock ? 0 : 1 });
        if (!shock) { popIn(twoF, t, mid('two', 0.3), 420, 520, 1, 6); popIn(wrongChip, t, mid('two', 0.6), 560, 535, 1, 6 * Math.sin(t * 9) * AMP); }
      }
      if (t > at('four') - 0.1) {
        // count: H 1..4, then O 1..2
        hRings.forEach((r, i) => { const t0 = mid('four', 0.18 + i * 0.09); op(r, P(t, t0, 0.15, linear)); popIn(hBadges[i], t, t0, HPOS[i][0], HPOS[i][1] + 30); });
        oRings.forEach((r, i) => { const t0 = mid('four', 0.62 + i * 0.09); op(r, P(t, t0, 0.15, linear)); popIn(oBadges[i], t, t0, OPOS[i][0] - 40, OPOS[i][1] - 28); });
        popIn(tally, t, mid('four', 0.8), 640, 535);
      }
    }

    /* ========== I: Arrow confessional ========== */
    if (sConf) {
      show('olly', olly, 900, 330, 0.7, { mood: 'happy', look: 0.4, sparkle: 1, op: 0.45, rot: 10 * Math.sin(t * 5) * AMP });
      show('arrow', arrowC, 420, 410, 1.35, { talk: talk('arrow'), mood: 'deadpan', look: t > mid('thconf', 0.55) && t < mid('thconf', 0.8) ? 0.8 : 0 });
      place(confGlow, cam, 0, 0, 1); place(softVeil, cam, 0, 0, 1);
    }

    Object.entries(ALL).forEach(([k, c]) => { if (!shown[k]) op(c, 0); });
  };
});
