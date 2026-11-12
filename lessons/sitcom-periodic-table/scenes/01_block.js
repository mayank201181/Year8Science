/* Scene 1: Welcome to Block 118.
   Void deck: Silas (keys jingling) on what an element is; a hammer boinks off a cluster of identical atoms ->
   the building: flats light up 1, 2, 3 ... 118 (atomic number = proton number) -> zoom to flat 1: Harold
   leans out of his window -> whip pan to flat 2: Helena opens her curtains, a camera flash, the curtains snap shut
   -> Kavya: "isn't it by mass?" -> Silas in front of the block: atomic number, not mass (Ar 40 / K 39 would
   swap into the wrong family) -> a letterbox flies off the wall: symbol, name, atomic number, mass number ->
   Silas reads sodium's (Na <- natrium, 11, 23); Sonny's flame hair peeks over the top -> groups = stacks
   (columns), periods = floors (rows) -> Silas's confessional: floor 1 is at the top. */
scene('block', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;

  /* ---------- local helpers (prefixed blk) ---------- */
  const on = (t, a, b) => (t >= a && t < b ? 1 : 0);
  const blkOpL = (el, v) => op(el, Math.min(v, 0.99));   // these layers carry opacity="0" as an attribute, so never clear the style
  const camBg = (el, k, cx, cy) => el.setAttribute('transform', Math.abs(k - 1) < 1e-4 ? '' : `translate(${cx.toFixed(1)} ${cy.toFixed(1)}) scale(${k.toFixed(4)}) translate(${(-cx).toFixed(1)} ${(-cy).toFixed(1)})`);
  const popIn = (el, t, t0, x, y, s, r) => { const p = P(t, t0, 0.45, pop); op(el, clamp(p * 2.5)); if (p > 0) tr(el, x, y, Math.max(0.01, (s || 1) * (0.6 + 0.4 * p)), r); };
  const label = (parent, text, o) => { o = o || {}; return chip(parent, text, { size: o.size || 32, fill: o.fill || 'rgba(10,27,39,0.9)', stroke: o.stroke || C.line, sw: 3, color: o.color || C.ink, weight: 700 }); };
  const blkPlace = (b, lx, ly, sx, sy, k) => tr(b, sx - k * lx, sy - k * ly, k);
  const bump = (t, t0, d) => (t > t0 && t < t0 + d ? Math.sin((t - t0) / d * Math.PI) : 0);
  // a chip followed by a tick or a cross
  function blkMark(parent, text, good) {
    const g = G(parent), c = label(g, text, { size: 32, color: good ? '#BDF5D6' : '#FFD0D0', stroke: good ? C.good : C.bad });
    const bg = E('circle', { r: 26, fill: 'rgba(10,27,39,0.9)', stroke: good ? C.good : C.bad, 'stroke-width': 3 }, g); tr(bg, c.w / 2 + 34, 0);
    const m = good ? tick(g, 14) : cross(g, 11); tr(m, c.w / 2 + 34, 0);
    return g;
  }

  /* layers */
  const Lbg = G(root), Lwin = G(root), Lback = G(root), Lprop = G(root), Lcast = G(root), Lfront = G(root), Lfg = G(root), Lhud = G(root);

  /* ================= sets ================= */
  const skyShot = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#4FB6F5', '#BFE8FF', true) }, skyShot);
  E('path', { d: 'M90,150 q30,-40 70,-10 q30,-30 60,0 q30,0 20,24 l-150,0 q-20,-6 0,-14 Z M960,110 q30,-40 70,-10 q30,-30 60,0 q30,0 20,24 l-150,0 q-20,-6 0,-14 Z', fill: '#FFFFFF', opacity: 0.85 }, skyShot);
  E('rect', { x: 0, y: 700, width: 1200, height: 50, fill: '#5BBF6A' }, skyShot);
  const voidShot = G(Lbg);
  bkVoidDeck(voidShot);
  const dim = E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#0B1420', opacity: 0 }, voidShot);
  const bedShot = G(Lbg);
  const bed = bkBedroom(bedShot);
  const confShot = bkConf(Lbg, 'silas');
  const blockWrap = G(Lbg);
  const block = bkBlock(blockWrap, { look: 1, numbers: false });
  const WALL = '#F6F0E2', blkSignEl = block.deco.lastChild;
  let litN = -1;
  function blkLight(n) {
    if (n === litN) return; litN = n;
    for (let z = 1; z <= 118; z++) attr(block.flats[z].wall, 'fill', z < n ? '#FFE27A' : z === n ? '#FFFBE0' : WALL);
  }

  /* ================= props ================= */
  // the cluster of identical atoms
  const cluster = G(Lprop), clusterIn = G(cluster);
  [[0, 0]].concat([0, 1, 2, 3, 4, 5].map(i => [Math.cos(i * TAU / 6) * 62, Math.sin(i * TAU / 6) * 62])).forEach(([x, y]) =>
    E('circle', { cx: x, cy: y, r: 31, fill: ball('#8FD3B0', '#2F8A63'), stroke: '#1F5E44', 'stroke-width': 3 }, clusterIn));
  const hammer = G(Lprop);
  E('rect', { x: -8, y: -170, width: 16, height: 150, rx: 6, fill: '#B07A45', stroke: SC_INK, 'stroke-width': 3 }, hammer);
  E('rect', { x: -50, y: -24, width: 100, height: 46, rx: 8, fill: ball('#C9D1DA', '#5E6B78'), stroke: SC_INK, 'stroke-width': 4 }, hammer);
  const boink = T(Lfg, 0, 0, 'BOINK!', { size: 54, weight: 800, anchor: 'middle', fill: C.energy });
  boink.setAttribute('stroke', '#1B2A55'); boink.setAttribute('stroke-width', 8); boink.setAttribute('paint-order', 'stroke');
  const jingle = G(Lfg);
  T(jingle, 0, 0, 'jingle', { size: 28, weight: 700, fill: '#FFE7A8', anchor: 'middle' }).setAttribute('font-style', 'italic');
  E('path', { d: 'M-50,24 q-10,14 0,28 M50,24 q10,14 0,28', fill: 'none', stroke: '#FFE7A8', 'stroke-width': 4, 'stroke-linecap': 'round' }, jingle);
  const clip = scClipboard(Lcast, 0.5);
  const cEl = label(Lfg, 'ELEMENT = only one kind of atom', { size: 36, color: C.energy, stroke: C.energy });
  const cEl2 = label(Lfg, "can't be broken down into anything simpler", { size: 30 });

  // order: the counter over the BLK 118 sign, and two chips
  const counter = G(Lfg);
  E('rect', { x: -170, y: -50, width: 340, height: 100, rx: 14, fill: '#14141C', stroke: '#F2E8C8', 'stroke-width': 4 }, counter);
  T(counter, -128, 18, 'FLAT', { size: 30, weight: 800, fill: '#FFB52E' });
  const counterN = T(counter, 128, 24, '1', { size: 66, weight: 800, anchor: 'end', fill: C.energy });
  const cAn = label(Lfg, 'atomic number = proton number', { size: 36, color: C.energy, stroke: C.energy });
  const cAn2 = label(Lfg, '= the number of protons in each atom', { size: 30 });

  // flats 1 and 2: window openings (behind the residents), sills and curtains (in front)
  function blkWindow(parentBack, parentFront) {
    const back = G(parentBack), front = G(parentFront);
    E('rect', { x: -23, y: -20, width: 46, height: 42, rx: 2, fill: '#26324A' }, back);
    E('rect', { x: -26, y: 13, width: 52, height: 9, rx: 2, fill: '#D8CDB6', stroke: '#7E7360', 'stroke-width': 1.2 }, front);
    return { back, front };
  }
  const win1 = blkWindow(Lwin, Lfront), win2 = blkWindow(Lwin, Lfront);
  const curtL = E('rect', { x: -23, y: -20, width: 10, height: 34, fill: '#C2457A', stroke: '#7A1E48', 'stroke-width': 1 }, win2.front);
  const curtR = E('rect', { x: 13, y: -20, width: 10, height: 34, fill: '#C2457A', stroke: '#7A1E48', 'stroke-width': 1 }, win2.front);
  win2.front.insertBefore(curtR, win2.front.firstChild); win2.front.insertBefore(curtL, win2.front.firstChild);
  const flash = E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#FFFFFF', opacity: 0 }, Lhud);
  const cH1 = label(Lfg, 'H = hydrogen', { size: 40 });
  const cH2 = label(Lfg, '1 proton', { size: 40, color: '#FF9A8F', stroke: C.bad });
  const cHe1 = label(Lfg, 'He = helium', { size: 40 });
  const cHe2 = label(Lfg, '2 protons', { size: 40, color: '#FF9A8F', stroke: C.bad });
  const ltHarold = scLowerThird(Lhud, ...BK_LT.harold), ltHelena = scLowerThird(Lhud, ...BK_LT.helena);

  // Kavya: pencil and question
  const pencil = G(Lfg);
  E('rect', { x: -9, y: -70, width: 18, height: 120, fill: '#FFC247', stroke: SC_INK, 'stroke-width': 3 }, pencil);
  E('rect', { x: -9, y: -92, width: 18, height: 22, rx: 4, fill: '#FF8FB0', stroke: SC_INK, 'stroke-width': 3 }, pencil);
  E('path', { d: 'M-9,50 L0,74 L9,50 Z', fill: '#F2D6B0', stroke: SC_INK, 'stroke-width': 3, 'stroke-linejoin': 'round' }, pencil);
  const cMass = label(Lfg, 'in order of how heavy?', { size: 34, color: '#FFE7A8', stroke: '#FFC247' });
  const deskFront = E('rect', { x: 0, y: 690, width: 1200, height: 60, fill: linGrad('#7A4E31', '#4E301C', true) }, Lfg);

  // notmass
  const cNum = blkMark(Lfg, 'ordered by ATOMIC NUMBER', true);
  const cNotM = blkMark(Lfg, 'not by mass', false);
  const ARX = 760 + 0.72 * block.pt(18)[0], ARY = 410 + 0.72 * block.pt(18)[1], KX = 760 + 0.72 * block.pt(19)[0], KY = 410 + 0.72 * block.pt(19)[1];
  const ringAr = E('ellipse', { cx: ARX, cy: ARY, rx: 34, ry: 30, fill: 'none', stroke: C.bad, 'stroke-width': 6 }, Lfg);
  const ringK = E('ellipse', { cx: KX, cy: KY, rx: 34, ry: 30, fill: 'none', stroke: C.bad, 'stroke-width': 6 }, Lfg);
  const cAr = label(Lfg, 'Ar: mass 40', { size: 28 }), cKm = label(Lfg, 'K: mass 39', { size: 28 });
  const swapArrow = arrow(Lfg, KX + 10, KY - 26, ARX - 14, ARY - 26, { color: C.bad, width: 7, bend: -300 });
  const cWrong = label(Lfg, 'by mass, K would land in Group 0: wrong family!', { size: 30, color: '#FFD0D0', stroke: C.bad });

  // the letterbox
  const lbx = bkLetterbox(Lprop, { z: 11, sym: 'Na', name: 'sodium', mass: 23 });
  const PART = { z: [-66, -84], sym: [0, -7], name: [0, 66], mass: [0, 110] };
  const ring = E('ellipse', { rx: 60, ry: 40, fill: 'none', stroke: C.energy, 'stroke-width': 6 }, lbx);
  const LBX = 640, LBY = 400, LBS = 1.2;
  const lsp = (k) => [LBX + LBS * PART[k][0], LBY + LBS * PART[k][1]];
  const lbl = {
    z: labelLine(Lfg, 400, 290, lsp('z')[0] - 30, lsp('z')[1], 'atomic number', { size: 32, anchor: 'end', fill: '#9FB8FF', line: '#9FB8FF' }),
    sym: labelLine(Lfg, 400, 390, lsp('sym')[0] - 75, lsp('sym')[1], 'symbol', { size: 32, anchor: 'end', fill: C.energy, line: C.energy }),
    name: labelLine(Lfg, 400, 480, lsp('name')[0] - 60, lsp('name')[1], 'name', { size: 32, anchor: 'end', fill: '#FFFFFF', line: '#FFFFFF' }),
    mass: labelLine(Lfg, 400, 570, lsp('mass')[0] - 30, lsp('mass')[1], 'mass number', { size: 32, anchor: 'end', fill: '#FF9A8F', line: '#FF9A8F' }),
  };
  const cNatrium = label(Lfg, 'Na ← natrium (Latin)', { size: 34, color: C.energy, stroke: C.energy });

  // group / period
  const stackArrow = G(Lfg); arrow(stackArrow, 100, 250, 100, 545, { color: '#1B2A55', width: 16, head: 46 }); arrow(stackArrow, 100, 250, 100, 545, { color: '#FFE45C', width: 9, head: 34 });
  const floorArrow = G(Lfg); arrow(floorArrow, 188, 358, 1020, 358, { color: '#1B2A55', width: 16, head: 46 }); arrow(floorArrow, 188, 358, 1020, 358, { color: '#7FD3FF', width: 9, head: 34 });
  const cGroup = label(Lfg, 'GROUP = column (a stack)', { size: 32, color: C.energy, stroke: C.energy });
  const cPeriod = label(Lfg, 'PERIOD = row (a floor)', { size: 32, color: '#7FD3FF', stroke: '#7FD3FF' });

  // confessional inset: floor 1 is at the top
  const insetCam = G(Lfg), inset = G(insetCam);
  E('rect', { x: -190, y: -185, width: 380, height: 370, rx: 16, fill: '#BFE8FF', stroke: '#F2E8C8', 'stroke-width': 8 }, inset);
  E('rect', { x: -186, y: 150, width: 372, height: 31, fill: '#5BBF6A' }, inset);
  E('rect', { x: -90, y: -150, width: 190, height: 300, fill: '#E9DFC8', stroke: '#7E7360', 'stroke-width': 4 }, inset);
  { let d = '', fl = ''; for (let r = 0; r < 7; r++) { for (let c = 0; c < 4; c++) d += `M${-74 + c * 44},${-140 + r * 42} h30 v24 h-30 Z `; fl += `M-90,${-108 + r * 42} h190 `; }
    E('path', { d, fill: '#7FB6D9', stroke: '#5A7F99', 'stroke-width': 1.5 }, inset); E('path', { d: fl, stroke: '#B9AE96', 'stroke-width': 3 }, inset); }
  const top1 = E('rect', { x: -92, y: -152, width: 194, height: 44, rx: 4, fill: 'rgba(255,228,92,0.35)', stroke: C.energy, 'stroke-width': 4 }, inset);
  for (let r = 0; r < 7; r++) T(inset, -112, -120 + r * 42, String(r + 1), { size: 28, weight: 800, anchor: 'middle', fill: r === 0 ? '#C2453A' : '#24324F' });
  const lift = G(inset); tr(lift, 150, -128);
  E('rect', { x: -32, y: -30, width: 64, height: 60, rx: 8, fill: '#14141C', stroke: '#9AA6B2', 'stroke-width': 3 }, lift);
  E('path', { d: 'M-20,8 L-8,-12 L4,8 Z', fill: '#FF5F5F' }, lift);
  T(lift, 18, 16, '1', { size: 34, weight: 800, anchor: 'middle', fill: '#FF5F5F' });
  const stamp = G(inset); tr(stamp, 6, 64, 1, -10);
  E('rect', { x: -132, y: -46, width: 264, height: 92, rx: 8, fill: 'rgba(255,255,255,0.75)', stroke: '#C62828', 'stroke-width': 6 }, stamp);
  T(stamp, 0, -8, 'DESIGNED BY', { size: 28, weight: 800, anchor: 'middle', fill: '#C62828' });
  T(stamp, 0, 28, 'CHEMISTS', { size: 34, weight: 800, anchor: 'middle', fill: '#C62828' });
  const cTop = label(insetCam, 'period 1 = the TOP row', { size: 30, color: C.energy, stroke: C.energy });

  /* ================= cast ================= */
  const sonny = cast(Lback, 'sonny');
  const harold = cast(Lcast, 'harold'), helena = cast(Lcast, 'helena');
  const shades = G(helena.firstChild); tr(shades, 0, -4);
  E('path', { d: 'M-50,-14 L-4,-14 Q-6,14 -28,14 Q-50,12 -50,-14 Z M4,-14 L50,-14 Q50,12 28,14 Q6,14 4,-14 Z', fill: '#1B1B26', stroke: SC_INK, 'stroke-width': 3 }, shades);
  E('path', { d: 'M-4,-12 L4,-12 M-50,-12 L-74,-22 M50,-12 L74,-22', stroke: SC_INK, 'stroke-width': 4, 'stroke-linecap': 'round' }, shades);
  const kav = cast(Lcast, 'kavya', { home: true });
  const silas = cast(Lcast, 'silas');

  /* ================= shots ================= */
  const cO = at('order') - 0.06, cZ = at('harold') - 0.06, cK = at('mass') - 0.06, cN = at('notmass') - 0.06,
    cL = at('letterbox') - 0.06, cG = at('group') - 0.06, cC = at('thtop') - 0.06;
  const WHIP = at('helena') - 0.42;

  return t => {
    const sV = on(t, -1e9, cO), sO = on(t, cO, cZ), sZ = on(t, cZ, cK), sK = on(t, cK, cN), sN = on(t, cN, cL),
      sL = on(t, cL, cG), sG = on(t, cG, cC), sC = on(t, cC, 1e9);
    let silOn = 0, kavOn = 0, harOn = 0, helOn = 0, sonOn = 0;
    op(skyShot, sO + sZ + sN + sG); op(voidShot, sV + sL); op(bedShot, sK); op(deskFront, 0);
    confShot.set(sC, t);
    op(blockWrap, sO + sZ + sK + sN + sG);
    blkLight(0); op(blkSignEl, sZ ? 0 : 1);
    op(block.labels, sG); blkOpL(block.stacks[1], 0); blkOpL(block.floors[3], 0);

    /* ---------- V: void deck, what an element is ---------- */
    op(cluster, sV); op(jingle, 0); op(clip, 0);
    if (sV) {
      const wp = P(t, at('element') - 0.25, 1.7, easeOut), walking = wp < 0.98;
      const x = lerp(-170, 300, wp), by = walking ? -Math.abs(Math.sin(t * 9)) * 10 * AMP : 0, tilt = walking ? Math.sin(t * 9) * 4 * AMP : 0;
      silOn = 1;
      tr(silas, x, 470 + by, 1.1, tilt);
      const lk = t > mid('element', 0.15) && t < end('element') ? 0.7 : 0;
      silas.set({ t, talk: scTalk(S, t, 'silas'), mood: 'deadpan', look: lk });
      op(clip, 1); tr(clip, x - 128, 505 + by, 0.5, -6 + tilt);
      const jv = win(t, at('element') - 0.25, at('element') + 1.75, 0.2);
      op(jingle, jv); tr(jingle, x + 150, 470 + by - 20, 1, -10 + 6 * Math.sin(t * 14) * AMP);
      popIn(cEl, t, mid('element', 0.2), 800, 165);
      popIn(cEl2, t, mid('element', 0.6), 800, 242);
      // the hammer
      const th = mid('element', 0.8);
      const hv = win(t, th - 0.35, th + 1.0, 0.12);
      op(hammer, hv);
      if (hv > 0) {
        if (t < th) tr(hammer, 840, lerp(160, 360, P(t, th - 0.32, 0.32, easeIn)), 1, -8);
        else { const q = P(t, th, 0.7, easeOut); tr(hammer, 840 + 160 * q, 360 - 170 * Math.sin(q * Math.PI * 0.8), 1, -8 + 70 * q); }
      }
      const sq = t > th ? 0.1 * Math.exp(-(t - th) * 5) * Math.cos((t - th) * 30) : 0;
      tr(cluster, 830, 470); tr(clusterIn, 0, 0); clusterIn.setAttribute('transform', `scale(${(1 + sq).toFixed(3)} ${(1 - sq).toFixed(3)})`);
      const bp = P(t, th, 0.35, pop);
      op(boink, t > th ? clamp(bp * 3) * (1 - P(t, th + 1.1, 0.3, linear)) : 0);
      tr(boink, 1020, 400, Math.max(0.01, 0.6 + 0.4 * bp), -10);
    } else { op(cEl, 0); op(cEl2, 0); op(hammer, 0); op(boink, 0); }

    /* ---------- O: the building lights up in order ---------- */
    op(counter, sO); op(cAn, 0); op(cAn2, 0);
    if (sO) {
      blkPlace(block, 0, 0, 600, 400, 0.9); block.look(1);
      const t0 = at('order') + 0.25;
      let n = 0;
      if (t >= t0) n = t < t0 + 3.2 ? 1 + Math.floor(19 * clamp((t - t0) / 3.2)) : 20 + Math.floor(98 * clamp((t - t0 - 3.2) / 1.5));
      blkLight(n);
      tr(counter, 524, 296, 1 + 0.06 * bump(t, t0 + Math.floor((t - t0) / (3.2 / 19)) * (3.2 / 19), 0.15) * (t < t0 + 3.2 ? 1 : 0));
      setText(counterN, n ? String(n) : '0');
      popIn(cAn, t, mid('order', 0.12), 600, 138);
      popIn(cAn2, t, mid('order', 0.58), 600, 198);
    }

    /* ---------- Z: flat 1 (Harold), whip pan to flat 2 (Helena) ---------- */
    op(win1.back, sZ); op(win1.front, sZ); op(win2.back, sZ); op(win2.front, sZ);
    op(cH1, 0); op(cH2, 0); op(cHe1, 0); op(cHe2, 0); op(flash, 0);
    ltHarold.set(sZ ? win(t, at('harold') + 0.1, at('harold') + 3.2, 0.3) : 0);
    ltHelena.set(sZ ? win(t, at('helena') + 0.1, at('helena') + 3.2, 0.3) : 0);
    if (sZ) {
      block.look(1);
      const zp = P(t, cZ, 0.5, ease), wq = P(t, WHIP, 0.38, ease);
      let k = lerp(0.9, 3.8, zp) * (1 + 0.05 * P(t, end('harold'), 1.0, ease) * (1 - wq));
      const lx = lerp(0, -476, zp) + 952 * wq, ly = lerp(0, -150, zp);
      const sx = lerp(600, 420, zp) + 360 * wq, sy = lerp(400, 360, zp);
      blkPlace(block, lx, ly, sx, sy, k);
      const ox = sx - k * lx, oy = sy - k * ly;
      const [h1x, h1y] = block.pt(1), [h2x, h2y] = block.pt(2);
      const f1x = ox + k * h1x, f1y = oy + k * h1y, f2x = ox + k * h2x, f2y = oy + k * h2y;
      tr(win1.back, f1x, f1y, k); tr(win1.front, f1x, f1y, k); tr(win2.back, f2x, f2y, k); tr(win2.front, f2x, f2y, k);
      harOn = helOn = 1;
      tr(harold, f1x, f1y + 5 * k, 0.22 * k);
      harold.set({ t, talk: scTalk(S, t, 'harold'), mood: 'sad', look: 0 });
      tr(helena, f2x, f2y + 3 * k, 0.2 * k);
      const ft = mid('helena', 0.55);
      helena.set({ t, talk: scTalk(S, t, 'helena'), mood: t > ft && t < ft + 0.35 ? 'shock' : 'smug', look: t > ft && t < ft + 0.6 ? -0.4 : 0 });
      const shut = clamp(1 - P(t, at('helena') - 0.2, 0.3, ease) + P(t, mid('helena', 0.8), 0.14, easeIn));
      const cw = 5 + 18 * shut;
      attr(curtL, 'width', cw); attr(curtR, 'width', cw); attr(curtR, 'x', 23 - cw);
      op(flash, t > ft ? 0.85 * (1 - P(t, ft, 0.3, linear)) : 0);
      const hv = 1 - P(t, WHIP - 0.05, 0.12, linear);
      if (hv > 0) { popIn(cH1, t, mid('harold', 0.25), 820, 250); popIn(cH2, t, mid('harold', 0.5), 820, 340); op(cH1, Math.min(hv, P(t, mid('harold', 0.25), 0.2, linear))); op(cH2, Math.min(hv, P(t, mid('harold', 0.5), 0.2, linear))); }
      popIn(cHe1, t, mid('helena', 0.2), 380, 250); popIn(cHe2, t, mid('helena', 0.42), 380, 340);
    }

    /* ---------- K: Kavya, by mass? ---------- */
    op(pencil, 0); op(cMass, 0);
    if (sK) {
      blkPlace(block, 0, 0, BK_POSTER.x, BK_POSTER.y, BK_POSTER.s); block.look(0);
      kavOn = 1;
      tr(kav, 330, 528, 1.25);
      kav.set({ t, talk: scTalk(S, t, 'kavya'), mood: t < mid('mass', 0.4) ? 'neutral' : 'smug', look: t < mid('mass', 0.35) ? 0.75 : 0.1 });
      const pp = P(t, at('mass') + 0.05, 0.4, pop);
      op(pencil, clamp(pp * 3)); tr(pencil, 448, 640 - 90 * pp, 1, 8 - 4 * Math.sin(t * 3) * AMP);
      popIn(cMass, t, mid('mass', 0.45), 330, 175);
    }

    /* ---------- N: Silas: atomic number, not mass ---------- */
    op(cNum, 0); op(cNotM, 0); op(ringAr, 0); op(ringK, 0); op(cAr, 0); op(cKm, 0); op(swapArrow, 0); op(cWrong, 0);
    if (sN) {
      blkPlace(block, 0, 0, 760, 410, 0.72); block.look(1);
      silOn = 1; tr(silas, 230, 485, 1.2);
      silas.set({ t, talk: scTalk(S, t, 'silas'), mood: 'deadpan', look: t > mid('notmass', 0.55) && t < mid('notmass', 0.92) ? 0.7 : 0 });
      popIn(cNum, t, mid('notmass', 0.22), 330, 140);
      popIn(cNotM, t, mid('notmass', 0.4), 330, 208);
      const rp = P(t, mid('notmass', 0.58), 0.4, pop);
      op(ringAr, clamp(rp * 3)); op(ringK, clamp(rp * 3));
      popIn(cAr, t, mid('notmass', 0.6), 1075, 452); popIn(cKm, t, mid('notmass', 0.62), KX + 10, 492);
      const ap = P(t, mid('notmass', 0.7), 0.5, ease);
      op(swapArrow, ap > 0 ? 1 : 0); swapArrow.set(ap);
      popIn(cWrong, t, mid('notmass', 0.8), 740, 690);
    }

    /* ---------- L: the letterbox ---------- */
    op(lbx, sL); op(ring, 0); op(cNatrium, 0);
    Object.values(lbl).forEach(l => l.set(0));
    if (sL) {
      op(dim, 0.72 * P(t, at('letterbox'), 0.5, linear));
      const fp = P(t, at('letterbox') + 0.1, 0.6, easeOut);
      tr(lbx, lerp(305, LBX, fp), lerp(300, LBY, fp) - 40 * Math.sin(fp * Math.PI), lerp(0.2, LBS, fp), 8 * Math.sin(fp * Math.PI));
      if (fp > 0.99) {
        lbl.sym.set(P(t, mid('letterbox', 0.4), 0.3, linear)); lbl.name.set(P(t, mid('letterbox', 0.52), 0.3, linear));
        lbl.z.set(P(t, mid('letterbox', 0.64), 0.3, linear)); lbl.mass.set(P(t, mid('letterbox', 0.84), 0.3, linear));
      }
      // pulses as Silas reads them out (and as the narrator names them)
      const PULSE = [['sym', mid('letterbox', 0.4)], ['name', mid('letterbox', 0.52)], ['z', mid('letterbox', 0.64)], ['mass', mid('letterbox', 0.84)],
        ['sym', mid('sodium', 0.14)], ['z', mid('sodium', 0.62)], ['mass', mid('sodium', 0.86)]];
      Object.keys(PART).forEach(k => { lbx.parts[k].removeAttribute('transform'); });
      PULSE.forEach(([k, t0]) => {
        const b = bump(t, t0, 0.7);
        if (b > 0) { const [cx, cy] = PART[k]; lbx.parts[k].setAttribute('transform', `translate(${cx} ${cy}) scale(${(1 + 0.3 * b).toFixed(3)}) translate(${-cx} ${-cy})`); }
      });
      // a ring stays on whatever Silas is reading
      const RS = [['sym', mid('sodium', 0.1), mid('sodium', 0.58), 78, 54], ['z', mid('sodium', 0.58), mid('sodium', 0.82), 44, 34], ['mass', mid('sodium', 0.82), end('sodium') + 0.2, 46, 30]];
      RS.forEach(([k, a, b, rx, ry]) => { if (t >= a && t < b) { op(ring, 1); attr(ring, 'cx', PART[k][0]); attr(ring, 'cy', PART[k][1]); attr(ring, 'rx', rx); attr(ring, 'ry', ry); } });
      const nv = P(t, mid('sodium', 0.26), 0.45, pop);
      op(cNatrium, clamp(nv * 2.5)); tr(cNatrium, 880, 190, Math.max(0.01, 0.6 + 0.4 * nv));
      silOn = 1; tr(silas, 1010, 470, 1.05);
      const peekA = end('sodium') - 0.15, peekB = at('group') - 0.32;
      const pk = P(t, peekA, 0.22, easeOut) * (1 - P(t, peekB, 0.18, easeIn));
      silas.set({ t, talk: scTalk(S, t, 'silas'), mood: 'deadpan', look: t > peekA + 0.15 ? -0.9 : (t < at('sodium') ? -0.8 : -0.3) });
      op(clip, 1); tr(clip, 880, 530, 0.5, 8);
      if (pk > 0.001) { sonOn = 1; tr(sonny, LBX, lerp(470, 238, pk), 0.9); sonny.set({ t, mood: 'happy', look: 0.6 }); }
    } else op(dim, 0);

    /* ---------- G: group = stack, period = floor ---------- */
    op(stackArrow, 0); op(floorArrow, 0); op(cGroup, 0); op(cPeriod, 0);
    if (sG) {
      blkPlace(block, 0, 0, 600, 400, 0.85); block.look(1);
      const gp = P(t, mid('group', 0.08), 0.3, linear), pp = P(t, mid('group', 0.58), 0.3, linear);
      blkOpL(block.stacks[1], gp * (0.75 + 0.25 * wave(t, 0.8))); blkOpL(block.floors[3], pp * (0.75 + 0.25 * wave(t, 0.8)));
      op(stackArrow, gp); stackArrow.childNodes.forEach(a => a.set(P(t, mid('group', 0.08), 0.6, ease)));
      op(floorArrow, pp); floorArrow.childNodes.forEach(a => a.set(P(t, mid('group', 0.58), 0.7, ease)));
      popIn(cGroup, t, mid('group', 0.12), 330, 150);
      popIn(cPeriod, t, mid('group', 0.62), 880, 150);
    }

    /* ---------- C: Silas's confessional, floor 1 is at the top ---------- */
    op(insetCam, sC);
    if (sC) {
      const k = (1 + 0.03 * P(t, cC, 3, linear)) * (1 + 0.1 * P(t, mid('thtop', 0.9), 1.8, ease));
      camBg(confShot, k, 430, 380); camBg(insetCam, k, 430, 380);
      silOn = 1; tr(silas, 430, 380 + 20 * k, 1.5 * k);
      silas.set({ t, talk: scTalk(S, t, 'silas'), mood: 'deadpan', look: t > mid('thtop', 0.12) && t < mid('thtop', 0.5) ? 0.7 : 0 });
      const ip = P(t, at('thtop') + 0.05, 0.45, pop);
      op(inset, clamp(ip * 3)); tr(inset, 900, 330, Math.max(0.01, 0.6 + 0.4 * ip));
      op(top1, P(t, mid('thtop', 0.2), 0.3, linear) * (0.6 + 0.4 * wave(t, 0.7)));
      op(lift, P(t, mid('thtop', 0.3), 0.3, linear));
      const sp = P(t, mid('thtop', 0.74), 0.3, pop);
      op(stamp, clamp(sp * 3)); tr(stamp, 6, 64, Math.max(0.01, 1.6 - 0.6 * sp), -10);
      popIn(cTop, t, mid('thtop', 0.22), 900, 560);
    }

    if (!silOn) op(silas, 0); else op(silas, 1);
    op(kav, kavOn); op(harold, harOn); op(helena, helOn); op(sonny, sonOn);
  };
});
