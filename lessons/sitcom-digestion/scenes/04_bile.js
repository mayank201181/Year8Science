/* Scene 4: Bill is not an enzyme.
   SMALL INTESTINE sign drops into the gut (digestion finishes here) -> Bill squirts in through the duct; liver makes,
   gall bladder stores (lower third BILL) -> Amy hugs him: "favourite enzyme!" -> slow push on Bill: "I'm not
   an enzyme." -> Bill confessional: name badge, NOT an enzyme card, washing-up sponge -> Lionel enters
   (lower third), fat -> fatty acids + glycerol -> the fat splits, labelled: BOTH -> one enormous blob,
   Lionel nibbles the surface -> Bill emulsifies it into droplets (same fat, more surface area) -> Lionel
   zips droplet to droplet: lipase digests, NOT bile -> pH scale: bile is alkaline, neutralises acid ->
   Priya on a video call: "I heard that." -> the pancreas sends amylase, protease, lipase -> a second Amy
   -> line map: liver, gall bladder, pancreas NOT on the line -> Bill commutes down the duct on a scooter
   -> summary: glucose, amino acids, fatty acids + glycerol -> Phoebe wedged between villi. */
scene('bile', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;
  const talk = (t, who) => scTalk(S, t, who);

  /* ---------- local helpers (prefixed bile) ---------- */
  const on = (t, a, b) => (t >= a && t < b ? 1 : 0);
  const bileCam = (el, k, cx, cy) => el.setAttribute('transform', `translate(${cx.toFixed(1)} ${cy.toFixed(1)}) scale(${k.toFixed(4)}) translate(${(-cx).toFixed(1)} ${(-cy).toFixed(1)})`);
  const bilePlace = (el, cam, x, y, s, r) => tr(el, cam.cx + cam.k * (x - cam.cx), cam.cy + cam.k * (y - cam.cy), s * cam.k, r);
  const bilePop = (el, t, t0, x, y, s, r) => { const p = P(t, t0, 0.45, pop); op(el, clamp(p * 2.5)); tr(el, x, y, Math.max(0.01, (s || 1) * (0.6 + 0.4 * p)), r); return p; };
  const bileLabel = (parent, text, o) => { o = o || {};
    return chip(parent, text, { size: o.size || 32, fill: o.fill || 'rgba(10,27,39,0.9)', stroke: o.stroke || C.line, sw: o.sw || 2.5, color: o.color || C.ink, weight: o.weight || 700 }); };
  function bileStamp(parent, text, o) {
    o = o || {};
    const size = o.size || 48, col = o.color || C.bad, g = G(parent);
    const w = textWidth(text, size, FD, 800) + size * 1.3, h = size * 1.7;
    E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: 12, fill: 'rgba(30,8,12,0.88)', stroke: col, 'stroke-width': 7 }, g);
    E('rect', { x: -w / 2 + 10, y: -h / 2 + 10, width: w - 20, height: h - 20, rx: 8, fill: 'none', stroke: col, 'stroke-width': 2, opacity: 0.6 }, g);
    T(g, 0, size * 0.36, text, { size, weight: 800, anchor: 'middle', fill: col, ls: 2 });
    g.set = (p, x, y, rot) => { op(g, clamp(p * 4)); tr(g, x, y, lerp(1.8, 1, easeOut(clamp(p))), rot); };
    return g;
  }
  function bileLiver(parent, s) {
    const g = G(parent); tr(g, 0, 0, s || 1);
    E('path', { d: 'M-90,-20 Q-80,-60 -10,-58 Q60,-60 92,-34 Q100,-14 70,0 Q20,30 -40,40 Q-92,40 -90,-20 Z', fill: ball('#C2564A', '#7A2A22'), stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
    E('path', { d: 'M-6,-56 Q-14,-10 -2,30', fill: 'none', stroke: '#7A2A22', 'stroke-width': 4 }, g);
    return g;
  }
  function bileGB(parent, s) {   // gall bladder: a green pear-shaped sac
    const g = G(parent); tr(g, 0, 0, s || 1);
    E('path', { d: 'M0,-40 Q30,-40 32,0 Q34,40 0,44 Q-34,40 -32,0 Q-30,-40 0,-40 Z', fill: ball('#9BD25A', '#4E8A1E'), stroke: SC_INK, 'stroke-width': 4 }, g);
    return g;
  }
  function bilePancreas(parent, s) {
    const g = G(parent); tr(g, 0, 0, s || 1);
    E('path', { d: 'M-100,10 Q-110,-30 -70,-30 Q-30,-40 10,-22 Q60,-30 100,-10 Q112,6 96,18 Q50,26 10,20 Q-40,40 -100,10 Z', fill: ball('#F7C9A0', '#C48A5A'), stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
    E('path', { d: 'M-80,0 Q-40,-8 0,2 Q40,-6 86,2', fill: 'none', stroke: '#C48A5A', 'stroke-width': 4, 'stroke-dasharray': '6 8' }, g);
    return g;
  }
  function bileHeart(parent, s, col) {
    const g = G(parent); tr(g, 0, 0, s || 1);
    E('path', { d: 'M0,24 C-50,-6 -40,-46 0,-22 C40,-46 50,-6 0,24 Z', fill: col || '#FF5F8A', stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
    return g;
  }

  /* layers */
  const Lbg = G(root), Lcast = G(root), Lfg = G(root), Lhud = G(root);

  /* ================= sets ================= */
  const gutShot = G(Lbg), gutWrap = G(gutShot), gut = mgGut(gutWrap);
  const gutDim = E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#14040A', opacity: 0.5 }, gutShot);
  const confB = mgConf(Lbg, 'bill');
  const mapShot = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#0C1A26', '#14283A', true) }, mapShot);
  let gridD = '';
  for (let x = 0; x <= 1200; x += 60) gridD += `M${x},0 L${x},750 `;
  for (let y = 0; y <= 750; y += 60) gridD += `M0,${y} L1200,${y} `;
  E('path', { d: gridD, stroke: '#1E3A50', 'stroke-width': 1.5 }, mapShot);

  /* ================= cast ================= */
  const bill = cast(Lcast, 'bill');
  const amy = cast(Lcast, 'amy');
  const amy2 = cast(Lcast, 'amy');
  const lionel = cast(Lcast, 'lionel');
  const percy = cast(Lcast, 'percy');
  const phoebe = cast(Lcast, 'phoebe');
  const ltBill = scLowerThird(Lhud, ...MG_NAME.bill);
  const ltLionel = scLowerThird(Lhud, ...MG_NAME.lionel);

  /* ================= A: platform ================= */
  const aFg = G(Lfg);
  const signW = G(aFg);
  E('path', { d: 'M-220,-200 L-220,-40 M220,-200 L220,-40', stroke: '#2B3138', 'stroke-width': 6 }, signW);
  mgSign(signW, 'SMALL INTESTINE', 'AL4', 580);
  const bolA = mgBolus(aFg, 44);
  const cFin = G(aFg);
  bileLabel(cFin, 'digestion FINISHES here', { size: 44, fill: MG_LINE, color: '#FFFFFF', stroke: '#FFD0DC', sw: 4 });

  /* ================= B: Bill squirts in; where bile comes from ================= */
  const bFg = G(Lfg);
  const squirt = E('path', { d: 'M-22,0 Q-30,60 -10,120 M0,0 L0,130 M22,0 Q30,60 10,120', fill: 'none', stroke: '#D2EC6A', 'stroke-width': 10, 'stroke-linecap': 'round' }, bFg);
  const diag = G(bFg);
  card(diag, -220, -210, 440, 420, { fill: 'rgba(10,27,39,0.88)', stroke: '#D2EC6A', sw: 3 });
  const dLiver = G(diag); tr(dLiver, -110, -140); bileLiver(dLiver, 0.75);
  const dLivT = T(diag, -20, -130, 'liver: makes bile', { size: 30, weight: 800, fill: '#FFD0C6' });
  const dGB = G(diag); tr(dGB, -110, -10); bileGB(dGB, 0.85);
  const dGBT = T(diag, -40, 0, 'gall bladder:\nstores bile', { size: 30, weight: 800, fill: '#D8F7A0' });
  const dA1 = arrow(diag, -110, -100, -110, -58, { color: '#D2EC6A', width: 6 });
  const dA2 = arrow(diag, -110, 40, -110, 112, { color: '#D2EC6A', width: 6, dash: '8 6' });
  const dSI = G(diag); tr(dSI, -110, 150);
  E('rect', { x: -70, y: -24, width: 140, height: 48, rx: 24, fill: '#C85068', stroke: SC_INK, 'stroke-width': 4 }, dSI);
  const dSIT = T(diag, -20, 160, 'small intestine', { size: 30, weight: 800, fill: '#FFD0DC' });
  const dDuctT = T(diag, -90, 84, 'duct', { size: 26, weight: 700, fill: '#D2EC6A' });

  /* ================= C/D: the hug, the denial ================= */
  const cFg = G(Lfg);
  const heart = bileHeart(cFg, 1.2);
  const cFave = bileLabel(cFg, 'favourite enzyme', { size: 38, color: '#BFEFFF', stroke: '#7FD6F7' });
  const dFg = G(Lfg);
  const notStamp = bileStamp(dFg, 'NOT AN ENZYME', { size: 46 });

  /* ================= E: Bill confessional ================= */
  const eFg = G(Lfg);
  const badge = G(eFg);
  E('rect', { x: -190, y: -90, width: 380, height: 180, rx: 14, fill: '#FFFFFF', stroke: '#D7263D', 'stroke-width': 6 }, badge);
  E('rect', { x: -190, y: -90, width: 380, height: 64, rx: 12, fill: '#D7263D' }, badge);
  T(badge, 0, -46, 'HELLO, I AM', { size: 32, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  T(badge, 0, 20, 'BILL', { size: 46, weight: 800, anchor: 'middle', fill: SC_INK });
  T(badge, 0, 66, 'THE ENZYME', { size: 32, weight: 800, anchor: 'middle', fill: '#3F5BD9' });
  const badgeStrike = strike(badge, -110, 56, 110, C.bad);
  const noCard = G(eFg);
  E('rect', { x: -230, y: -110, width: 460, height: 220, rx: 18, fill: 'rgba(10,27,39,0.9)', stroke: '#D2EC6A', 'stroke-width': 4 }, noCard);
  T(noCard, 0, -50, 'NOT an enzyme', { size: 50, weight: 800, anchor: 'middle', fill: '#D2EC6A' });
  const ncL1 = G(noCard); T(ncL1, -150, 16, 'no active site', { size: 32, weight: 700, fill: '#FFFFFF' }); tr(cross(ncL1, 12), -180, 5);
  const ncL2 = G(noCard); T(ncL2, -150, 72, 'breaks no bonds', { size: 32, weight: 700, fill: '#FFFFFF' }); tr(cross(ncL2, 12), -180, 61);
  const sponge = G(eFg);
  E('rect', { x: -70, y: -30, width: 140, height: 60, rx: 12, fill: '#FFE45C', stroke: SC_INK, 'stroke-width': 4 }, sponge);
  E('rect', { x: -70, y: -30, width: 140, height: 20, rx: 8, fill: '#3FAF5A', stroke: SC_INK, 'stroke-width': 4 }, sponge);
  const sBubs = [0, 1].map(i => E('circle', { r: 9 + i * 3, fill: 'rgba(255,255,255,0.35)', stroke: '#FFFFFF', 'stroke-width': 3 }, sponge));
  const cWash = bileLabel(eFg, 'basically washing-up liquid', { size: 30, color: '#FFF7C2', stroke: C.energy });

  /* ================= F/G: Lionel and the fat ================= */
  const fFg = G(Lfg);
  const fatCard = G(fFg);
  card(fatCard, -230, -150, 460, 360, { fill: 'rgba(10,27,39,0.88)', stroke: '#7FE0D2', sw: 3 });
  T(fatCard, 0, -104, 'fat', { size: 40, weight: 800, anchor: 'middle', fill: '#FFE29A' });
  const fatA = arrow(fatCard, 0, 64, 0, 116, { color: '#7FE0D2', width: 6 });
  const fatProd = bileLabel(fatCard, 'fatty acids + glycerol', { size: 32, color: '#FFE29A', stroke: '#FFC247' }); tr(fatProd, 0, 160);
  const gFg = G(Lfg);
  const lblGly = labelLine(gFg, 520, 170, 612, 236, 'glycerol', { size: 34, weight: 800, fill: '#FFF2C2', line: '#FFF2C2' });
  const lblFA = [0, 1, 2].map(i => { const g = G(gFg); T(g, 0, 0, 'fatty acid', { size: 30, weight: 800, fill: '#FFD25A' }); return g; });
  const cBoth = G(gFg);
  bileLabel(cBoth, 'fatty acids AND glycerol', { size: 42, fill: '#0E302C', color: '#FFFFFF', stroke: '#7FE0D2', sw: 4 });
  const bothStamp = bileStamp(gFg, 'WRITE BOTH', { size: 40, color: C.energy });

  /* ================= H/I/J: the blob, emulsifying, faster ================= */
  const hFg = G(Lfg);
  const blobW = G(hFg); const blob = mgBlob(blobW, 120);
  const glints = [0, 1, 2].map(() => E('path', { d: 'M0,-20 L5,-5 L20,0 L5,5 L0,20 L-5,5 L-20,0 L-5,-5 Z', fill: C.energy, stroke: C.energyLt, 'stroke-width': 2 }, hFg));
  const cBlob = bileLabel(hFg, 'one enormous blob of fat', { size: 34, color: '#FFE29A', stroke: '#FFC247' });
  const cSurf = bileLabel(hFg, 'lipase only reaches the surface', { size: 32 });
  const cEmul = G(hFg);
  bileLabel(cEmul, 'emulsify', { size: 56, fill: '#47591A', color: '#FFFFFF', stroke: '#D2EC6A', sw: 4 });
  const cEmulSub = bileLabel(cEmul, 'big blob → tiny droplets', { size: 30, color: '#D8F7A0', stroke: '#9FCF48' }); tr(cEmulSub, 0, 72);
  const cSame = bileLabel(hFg, 'same fat, much more surface area', { size: 36, color: '#FFE29A', stroke: '#FFC247' });
  const jFg = G(Lfg);
  const DROPS = [[300, 300], [470, 230], [420, 420], [600, 330], [560, 520], [760, 250], [740, 450], [900, 360]];
  const jDrops = DROPS.map(([x, y]) => {
    const g = G(jFg); tr(g, x, y);
    const d = E('circle', { r: 30, fill: ball('#FFE38A', '#D9A520'), stroke: '#B57B12', 'stroke-width': 3 }, g);
    const f = G(g);   // the digested droplet: a little glycerol bar and three fatty-acid tails
    E('rect', { x: -26, y: -20, width: 10, height: 40, rx: 4, fill: '#FFF2C2', stroke: '#C9A84A', 'stroke-width': 2.5 }, f);
    E('path', { d: 'M-6,-20 l8,-5 l8,5 l8,-5 l8,5 M-6,0 l8,-5 l8,5 l8,-5 l8,5 M-6,20 l8,-5 l8,5 l8,-5 l8,5', fill: 'none', stroke: '#FFD25A', 'stroke-width': 5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, f);
    return { g, d, f };
  });
  const cLip = G(jFg);
  bileLabel(cLip, 'lipase digests the fat, NOT bile', { size: 38, fill: '#0E302C', color: '#FFFFFF', stroke: '#7FE0D2', sw: 4 });

  /* ================= K: alkaline ================= */
  const kFg = G(Lfg);
  const phBar = G(kFg); tr(phBar, 800, 340);
  const PHC = ['#E8302A', '#F0522A', '#F57A2A', '#F7A52A', '#F2CF2A', '#D3E02A', '#8ED33A', '#3FBF5A', '#2EAD8A', '#2A93B8', '#2A6FD0', '#3A50C8', '#5A3AB8', '#6E2A9E'];
  const phGrad = E('linearGradient', { id: 'bilePH', x1: 0, x2: 1, y1: 0, y2: 0 }, defs());
  PHC.forEach((c, i) => { E('stop', { offset: (i / 13).toFixed(3), 'stop-color': c }, phGrad); });
  E('rect', { x: -280, y: -28, width: 560, height: 56, fill: 'url(#bilePH)' }, phBar);
  E('rect', { x: -280, y: -28, width: 560, height: 56, rx: 6, fill: 'none', stroke: '#FFFFFF', 'stroke-width': 4 }, phBar);
  T(phBar, -220, 70, 'acid', { size: 30, weight: 800, anchor: 'middle', fill: '#FF9A8A' });
  T(phBar, 0, 70, 'neutral', { size: 30, weight: 800, anchor: 'middle', fill: '#A8F0B0' });
  T(phBar, 220, 70, 'alkaline', { size: 30, weight: 800, anchor: 'middle', fill: '#B8C8FF' });
  const phPtr = G(phBar);
  E('path', { d: 'M0,-34 L-18,-66 L18,-66 Z', fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 3 }, phPtr);
  const phPtrT = T(phPtr, 0, -78, 'pH 2', { size: 30, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  const cAlk = G(kFg);
  bileLabel(cAlk, 'bile is alkaline', { size: 46, fill: '#1E3A8A', color: '#FFFFFF', stroke: '#B8C8FF', sw: 4 });
  const cNeut = bileLabel(kFg, 'neutralises the stomach acid', { size: 32, color: '#A8F0B0', stroke: C.good });

  /* ================= L: video call ================= */
  const lFg = G(Lfg);
  const call = scVideoCall(lFg, 560, 330, 'Video call: Priya');
  E('rect', { x: -280, y: -165, width: 560, height: 330, fill: linGrad('#5E1A28', '#8E2F3E', true) }, call.screen);
  E('ellipse', { cx: 0, cy: 150, rx: 300, ry: 70, fill: '#A6D64C', stroke: '#F0FFB8', 'stroke-width': 4 }, call.screen);
  const callNeon = G(call.screen); tr(callNeon, 160, -110);
  E('rect', { x: -96, y: -30, width: 192, height: 60, rx: 12, fill: '#1A0A14', stroke: '#FF6FB5', 'stroke-width': 4 }, callNeon);
  T(callNeon, 0, 11, 'ACID SPA', { size: 30, weight: 800, anchor: 'middle', fill: '#FFB3DA' });
  const priya = cast(call.screen, 'priya');

  /* ================= M/N: pancreas, a second Amy ================= */
  const mFg = G(Lfg);
  const panc = G(mFg); bilePancreas(panc, 1.1);
  const pancDuct = E('path', { d: 'M1000,215 Q960,170 900,140', fill: 'none', stroke: '#F7C9A0', 'stroke-width': 8, 'stroke-dasharray': '12 10', 'stroke-linecap': 'round' }, mFg);
  const cPanc = bileLabel(mFg, 'pancreas', { size: 40, fill: '#5A3A20', color: '#FFE0C2', stroke: '#F7C9A0', sw: 4 });
  const ENZ = [['amylase', '#BFEFFF', '#7FD6F7'], ['protease', '#E9D2FF', '#C892F0'], ['lipase', '#C8FFF4', '#7FE0D2']];
  const enzChips = ENZ.map(([s, c, k]) => bileLabel(mFg, s, { size: 40, color: c, stroke: k, sw: 3 }));
  const cMoreT = bileLabel(mFg, 'more enzymes', { size: 34, color: C.energy, stroke: C.energy });
  const nFg = G(Lfg);
  const cSal = bileLabel(nFg, 'from saliva', { size: 30, color: '#BFEFFF', stroke: '#7FD6F7' });
  const cPan = bileLabel(nFg, 'from the pancreas', { size: 30, color: '#BFEFFF', stroke: '#7FD6F7' });

  /* ================= O/P: the helpers are not on the line; Bill commutes ================= */
  const oFg = G(Lfg);
  const map = mgLineMap(oFg); tr(map, 600, 470);
  const offKids = Array.from(map.off.children);    // [ducts, LIVER, GALL BLADDER, PANCREAS, NOT ON THE LINE]
  const trainPath = arrow(oFg, 440, 450, 600, 450, { color: '#FFFFFF', width: 6, bend: -210 });
  const trainX = cross(oFg, 40);
  const cNotLine = bileLabel(oFg, 'NOT part of the alimentary canal', { size: 38, fill: '#5A2030', color: '#FFFFFF', stroke: MG_LINE, sw: 4 });
  const pFg = G(Lfg);
  const P0 = [300, 230], P1 = [930, 520];
  E('path', { d: `M${P0[0]},${P0[1]} L${P1[0]},${P1[1]}`, stroke: '#8A9AA6', 'stroke-width': 26, 'stroke-linecap': 'round' }, pFg);
  E('path', { d: `M${P0[0]},${P0[1]} L${P1[0]},${P1[1]}`, stroke: '#D5DEE4', 'stroke-width': 6, 'stroke-dasharray': '18 14' }, pFg);
  const pGB = G(pFg); tr(pGB, 230, 200); bileGB(pGB, 1.3);
  const pGBT = bileLabel(pFg, 'gall bladder', { size: 30, fill: '#3A4652', stroke: '#8A9AA6', color: '#D5DEE4' }); tr(pGBT, 250, 300);
  const pSI = G(pFg); tr(pSI, 1010, 560);
  E('rect', { x: -110, y: -40, width: 220, height: 80, rx: 40, fill: '#C85068', stroke: SC_INK, 'stroke-width': 4 }, pSI);
  const pSIT = bileLabel(pFg, 'small intestine', { size: 30, fill: '#5A2030', stroke: MG_LINE, color: '#FFD0DC' }); tr(pSIT, 990, 650);
  const pDuctT = bileLabel(pFg, 'the bile duct', { size: 30, color: '#D2EC6A', stroke: '#9FCF48' }); tr(pDuctT, 560, 420, 1, 25);
  const scooter = G(Lcast);
  E('path', { d: 'M-70,40 L60,40 L70,-40', fill: 'none', stroke: '#3A4B5C', 'stroke-width': 9, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, scooter);
  E('path', { d: 'M56,-40 L86,-40', stroke: '#3A4B5C', 'stroke-width': 9, 'stroke-linecap': 'round' }, scooter);
  const wheels = [-56, 60].map(x => { const w = G(scooter); tr(w, x, 52); E('circle', { r: 16, fill: '#2B3138', stroke: '#9AA6AE', 'stroke-width': 4 }, w); E('path', { d: 'M-10,0 L10,0', stroke: '#9AA6AE', 'stroke-width': 3 }, w); return w; });

  /* ================= Q: summary ================= */
  const qFg = G(Lfg);
  const ROWS = [180, 360, 540];
  const sumStarch = mgChain(qFg, 'starch', 3);
  const sumProt = mgChain(qFg, 'protein', 3);
  const sumSrc = ['starch', 'protein', 'fat'].map((s, i) => T(qFg, 300, ROWS[i] - 58, s, { size: 34, weight: 800, anchor: 'middle', fill: '#FFFFFF' }));
  const sumArr = ROWS.map(y => arrow(qFg, 540, y, 640, y, { color: '#FFFFFF', width: 7 }));
  const sumProd = [['glucose', C.glucoseLt], ['amino acids', '#FFD27A'], ['fatty acids + glycerol', '#FFD25A']].map(([s, c], i) => T(qFg, 670, ROWS[i] + 14, s, { size: 44, weight: 800, fill: c }));
  const fatX = mgFat(Lfg);   // one fat molecule, shared by Lionel's card, the big split and the summary

  /* ================= R: Phoebe wedged between villi ================= */
  const rFg = G(Lfg);
  const villusPath = 'M-48,200 L-48,-90 A48,48 0 0 1 48,-90 L48,200 Z';
  const vL = G(rFg), vR = G(rFg);
  [vL, vR].forEach(v => { E('path', { d: villusPath, fill: ball('#F08CA0', '#C85068'), stroke: '#5A1A28', 'stroke-width': 4 }, v); E('path', { d: 'M-20,190 L-20,-80 Q0,-100 20,-80 L20,190', fill: 'none', stroke: '#E8424F', 'stroke-width': 4, opacity: 0.5 }, v); });

  /* cut points */
  const k6 = id => at(id) - 0.06;
  const cB = k6('bill'), cC = k6('fave'), cD = k6('not'), cE = k6('thbill'), cF = k6('lionel'), cG = k6('both'), cH = k6('blob'),
    cI = k6('emulsify'), cJ = k6('faster'), cK = k6('alkaline'), cL = k6('heard'), cM = k6('pancreas'), cN = k6('more'),
    cO = k6('helpers'), cP = k6('commute'), cQ = k6('done'), cR = k6('still');

  return t => {
    const sA = on(t, -1, cB), sB = on(t, cB, cC), sC = on(t, cC, cD), sD = on(t, cD, cE), sE = on(t, cE, cF), sF = on(t, cF, cG),
      sG = on(t, cG, cH), sH = on(t, cH, cI), sI = on(t, cI, cJ), sJ = on(t, cJ, cK), sK = on(t, cK, cL), sL = on(t, cL, cM),
      sM = on(t, cM, cN), sN = on(t, cN, cO), sO = on(t, cO, cP), sP = on(t, cP, cQ), sQ = on(t, cQ, cR), sR = on(t, cR, 1e9);
    [bill, amy, amy2, lionel, percy, phoebe, scooter, fatX].forEach(c => op(c, 0));
    ltBill.set(0); ltLionel.set(0);
    [aFg, bFg, cFg, dFg, eFg, fFg, gFg, hFg, jFg, kFg, lFg, mFg, nFg, oFg, pFg, qFg, rFg].forEach(g => op(g, 0));

    /* ---------- A: platform ---------- */
    if (sA) {
      op(aFg, 1);
      const dp = P(t, at('small'), 0.5, pop);
      tr(signW, 560, lerp(-80, 200, dp), 1, 2 * Math.sin(t * 2) * AMP);
      const p = P(t, at('small') + 0.1, 2.4, easeOut); tr(bolA, lerp(-60, 330, p), 420, 1.3, p * 400);
      bilePop(cFin, t, mid('small', 0.5), 680, 560);
    }

    /* ---------- the small intestine (gut) ---------- */
    const gutOn = sA || sB || sC || sD || sF || sG || sH || sI || sJ || sK || sL || sM || sN || sR;
    op(gutShot, gutOn);
    if (gutOn) {
      gut.upd(t * (S.reduce ? 0.4 : 1));
      let cam = { k: 1, cx: 600, cy: 400 };
      if (sD) cam = { k: 1 + 0.32 * P(t, cD, end('not') + 0.7 - cD, ease), cx: 760, cy: 380 };
      if (sR) cam = { k: 1 + 0.1 * P(t, cR, end('still') + 0.9 - cR, linear), cx: 600, cy: 420 };
      bileCam(gutWrap, cam.k, cam.cx, cam.cy);
      op(gutDim, sG || sL || sQ ? 1 : 0);

      if (sB) {
        op(bFg, 1);
        const dp = P(t, at('bill') - 0.05, 0.55, easeOut);
        op(bill, 1); tr(bill, 880, lerp(60, 440, dp), Math.max(0.01, lerp(0.3, 1.2, dp)));
        bill.set({ t, talk: talk(t, 'bill'), mood: 'deadpan', look: -0.3 });
        op(squirt, win(t, at('bill') - 0.05, at('bill') + 0.5, 0.1)); tr(squirt, 880, 130);
        bilePop(diag, t, at('bill') + 0.2, 290, 345);
        op(dLiver, P(t, mid('bill', 0.3), 0.3, linear)); op(dLivT, P(t, mid('bill', 0.3), 0.3, linear));
        dA1.set(P(t, mid('bill', 0.5), 0.3, linear));
        op(dGB, P(t, mid('bill', 0.55), 0.3, linear)); op(dGBT, P(t, mid('bill', 0.55), 0.3, linear));
        dA2.set(P(t, mid('bill', 0.78), 0.4, linear)); op(dDuctT, P(t, mid('bill', 0.8), 0.3, linear));
        op(dSI, P(t, mid('bill', 0.8), 0.3, linear)); op(dSIT, P(t, mid('bill', 0.8), 0.3, linear));
        ltBill.set(win(t, at('bill') + 0.1, at('bill') + 3.3, 0.3));
        tr(ltBill, 50, 600);
      }
      if (sC || sD) {
        op(cFg, sC); op(dFg, sD);
        op(bill, 1); bilePlace(bill, cam, 760, 450, 1.2);
        const ann = sC ? t > mid('fave', 0.72) : true;
        bill.set({ t, talk: talk(t, 'bill'), mood: ann ? (sD && t > end('not') ? 'deadpan' : 'annoyed') : 'deadpan', look: sD ? 0 : -0.6 });
        const hp = P(t, at('fave') - 0.1, 0.5, easeOut);
        op(amy, 1); bilePlace(amy, cam, lerp(200, 600, hp), 470 - 40 * Math.sin(hp * Math.PI), 1.1, -8 * hp);
        amy.set({ t, talk: talk(t, 'amy'), mood: sD ? (t > mid('not', 0.4) ? 'shock' : 'happy') : 'happy', look: 0.8, sparkle: sD ? 0 : 1 });
        if (sC) {
          const pp = P(t, mid('fave', 0.25), 0.4, pop);
          op(heart, clamp(pp * 2.5)); tr(heart, 690, 260 - 20 * P(t, mid('fave', 0.25), 2, linear), Math.max(0.01, (0.6 + 0.4 * pp) * (1 + 0.08 * Math.sin(t * 9))));
          bilePop(cFave, t, mid('fave', 0.6), 640, 170);
        }
        if (sD) notStamp.set(P(t, mid('not', 0.45), 0.3, easeOut), 600, 165, -4);
      }

      if (sF) {
        op(fFg, 1);
        const ep = P(t, at('lionel') - 0.1, 0.6, easeOut);
        op(lionel, 1); tr(lionel, lerp(-120, 330, ep), 440, 1.3, 6 * Math.sin(t * 3) * (t < mid('lionel', 0.3) ? 1 : 0) * AMP);
        lionel.set({ t, talk: talk(t, 'lionel'), mood: 'neutral', look: t > mid('lionel', 0.5) ? 0.7 : 0 });
        ltLionel.set(win(t, at('lionel') + 0.1, at('lionel') + 3.3, 0.3));
        const fp = bilePop(fatCard, t, mid('lionel', 0.35), 850, 330), fk = Math.max(0.01, 0.6 + 0.4 * fp);
        op(fatX, clamp(fp * 2.5)); tr(fatX, 850, 330 - 10 * fk, 0.81 * fk); fatX.set(0);
        fatA.set(P(t, mid('lionel', 0.65), 0.35, linear));
        op(fatProd, P(t, mid('lionel', 0.7), 0.3, linear));
      }

      if (sG) {
        op(gFg, 1);
        const sp = P(t, mid('both', 0.05), 0.9, ease);
        op(fatX, 1); tr(fatX, 720, 330, 1.7); fatX.set(sp);
        lblGly.set(P(t, mid('both', 0.25), 0.3, linear));
        lblFA.forEach((g, i) => { op(g, P(t, mid('both', 0.15) + i * 0.15, 0.3, linear)); tr(g, 720 + (-44 + 46 + 128 + 14) * 1.7, 330 + (-40 + i * 40 + (i - 1) * 26) * 1.7 + 10); });
        bilePop(cBoth, t, mid('both', 0.4), 520, 600);
        bothStamp.set(P(t, mid('both', 0.82), 0.3, easeOut), 1000, 600, -6);
        const tap = Math.max(0, Math.sin(clamp((t - mid('both', 0.42)) / 0.4) * Math.PI));
        op(lionel, 1); tr(lionel, 230 + 50 * tap, 450, 1.1);
        lionel.set({ t, talk: talk(t, 'lionel'), mood: t > mid('both', 0.8) ? 'smug' : 'neutral', look: 0.7 });
      }

      if (sH || sI) {
        op(hFg, 1);
        const ep = sI ? P(t, mid('emulsify', 0.4), 1.4, ease) : 0;
        blob.set(ep); tr(blobW, sH ? 720 : 600, 400);
        op(cBlob, sH); if (sH) bilePop(cBlob, t, at('blob') + 0.1, 720, 200);
        op(cSurf, sH); if (sH) bilePop(cSurf, t, mid('blob', 0.62), 720, 610);
        glints.forEach((g, i) => {
          const on2 = sH && t > mid('blob', 0.5);
          op(g, on2 ? 0.5 + 0.5 * Math.sin(t * 8 + i * 2) : 0);
          const a = Math.PI + (i - 1) * 0.45; tr(g, 720 + Math.cos(a) * 122, 400 + Math.sin(a) * 122, 0.8 + 0.3 * Math.sin(t * 8 + i * 2), t * 90);
        });
        op(cEmul, sI); if (sI) bilePop(cEmul, t, mid('emulsify', 0.35), 640, 165);
        op(cSame, sI); if (sI) bilePop(cSame, t, mid('emulsify', 0.75), 600, 640);
        if (sH) {
          const nib = 0.5 + 0.5 * Math.sin(t * 7);
          op(lionel, 1); tr(lionel, 470 + 18 * nib * (t > mid('blob', 0.45) ? 1 : 0), 430, 1.15, 8);
          lionel.set({ t, talk: talk(t, 'lionel'), mood: t > mid('blob', 0.55) ? 'annoyed' : 'neutral', look: 0.8 });
        } else {
          op(lionel, 1);
          const back = P(t, at('emulsify'), 0.4, easeOut);
          tr(lionel, 260 - 90 * back, 450, 1.0);
          lionel.set({ t, mood: t < mid('emulsify', 0.4) ? 'shock' : 'happy', look: 0.6 });
          op(bill, 1); tr(bill, 1040, 440, 1.05, -4 * Math.sin(t * 6) * P(t, mid('emulsify', 0.35), 0.3, linear) * (t < end('emulsify') ? 1 : 0));
          bill.set({ t, talk: talk(t, 'bill'), mood: 'deadpan', look: -0.7, bubbles: P(t, mid('emulsify', 0.3), 0.3, linear) });
        }
      }

      if (sJ) {
        op(jFg, 1);
        const T0 = at('faster') + 0.2, DT = 0.5;
        const k = clamp((t - T0) / DT, 0, DROPS.length - 1);
        const i0 = Math.floor(k), i1 = Math.min(DROPS.length - 1, i0 + 1), f = ease(k - i0);
        const lx = lerp(DROPS[i0][0], DROPS[i1][0], f) - 40, ly = lerp(DROPS[i0][1], DROPS[i1][1], f) - 30 - 30 * Math.sin(f * Math.PI);
        jDrops.forEach((o, i) => {
          const done = P(t, T0 + i * DT + 0.15, 0.25, linear);
          tr(o.d, 0, 0, Math.max(0.01, 1 - done)); op(o.d, 1 - done);
          op(o.f, done); tr(o.f, 0, 0, 0.6 + 0.4 * done);
        });
        op(lionel, 1); tr(lionel, t < T0 ? 170 : lx, t < T0 ? 450 : ly, 0.65, 10 * Math.sin(t * 9) * AMP);
        lionel.set({ t, talk: talk(t, 'lionel'), mood: 'happy', look: 0.6 });
        bilePop(cLip, t, mid('faster', 0.62), 600, 640);
        op(bill, 1); tr(bill, 1080, 460, 0.8);
        bill.set({ t, mood: 'deadpan', look: -0.8 });
      }

      if (sK) {
        op(kFg, 1);
        op(bill, 1); tr(bill, 250, 440, 1.2);
        bill.set({ t, talk: talk(t, 'bill'), mood: 'neutral', look: 0.6 });
        bilePop(phBar, t, at('alkaline') + 0.05, 800, 340);
        const np = P(t, mid('alkaline', 0.42), 1.0, ease), ph = lerp(2, 7, np);
        tr(phPtr, -280 + (ph - 0.5) * 40, 0);
        setText(phPtrT, 'pH ' + (Math.round(ph * 2) / 2).toString());
        bilePop(cAlk, t, mid('alkaline', 0.12), 800, 180);
        bilePop(cNeut, t, mid('alkaline', 0.5), 800, 480);
        const relax = t > mid('alkaline', 0.75);
        op(amy, 1); tr(amy, 700, 600, 0.55); amy.set({ t, mood: relax ? 'happy' : 'sad', look: -0.6, sweat: relax ? 0 : 1, sparkle: relax ? 1 : 0 });
        op(lionel, 1); tr(lionel, 900, 600, 0.55); lionel.set({ t, mood: relax ? 'happy' : 'annoyed', look: -0.6, sweat: relax ? 0 : 1 });
      }

      if (sL) {
        op(lFg, 1);
        const cp = P(t, at('heard') - 0.05, 0.35, pop);
        op(call, clamp(cp * 2.5)); tr(call, 560, 360, Math.max(0.01, 0.7 + 0.3 * cp));
        tr(priya, 0, 50, 1.25);
        priya.set({ t, talk: talk(t, 'priya'), mood: t < end('heard') ? 'annoyed' : 'deadpan', look: 0.4 });
        op(bill, 1); tr(bill, 1060, 520, 0.85); bill.set({ t, mood: 'deadpan', look: -0.9 });
      }

      if (sM || sN) {
        op(mFg, sM); op(nFg, sN);
        if (sM) {
          bilePop(panc, t, at('pancreas') + 0.05, 1060, 220, 1, -10);
          op(pancDuct, P(t, mid('pancreas', 0.2), 0.3, linear));
          bilePop(cPanc, t, mid('pancreas', 0.15), 1040, 310);
          bilePop(cMoreT, t, mid('pancreas', 0.45), 380, 210);
          enzChips.forEach((c, i) => {
            const t0 = mid('pancreas', [0.58, 0.72, 0.86][i]), p = P(t, t0, 0.5, easeOut);
            op(c, clamp(p * 4)); tr(c, lerp(880, 380, p), lerp(130, 300 + i * 92, p), Math.max(0.01, 0.4 + 0.6 * p));
          });
          op(amy, 1); tr(amy, 820, 520, 0.8); amy.set({ t, mood: 'happy', look: -0.8, sparkle: t > mid('pancreas', 0.58) ? 1 : 0 });
          op(lionel, 1); tr(lionel, 1040, 520, 0.8); lionel.set({ t, mood: 'neutral', look: -0.7 });
        } else {
          op(amy, 1); tr(amy, 380, 450, 1.1);
          amy.set({ t, talk: talk(t, 'amy'), mood: 'happy', look: 0.9, sparkle: 1 });
          const dp = P(t, at('more') - 0.05, 0.5, easeOut);
          op(amy2, 1); tr(amy2, lerp(880, 820, dp), lerp(120, 450, dp), Math.max(0.01, lerp(0.3, 1.1, dp)), 8 * Math.sin(t * 4) * AMP);
          amy2.set({ t, mood: 'happy', look: -0.9, sparkle: 1 });
          bilePop(cSal, t, mid('more', 0.4), 380, 620);
          bilePop(cPan, t, mid('more', 0.55), 820, 620);
        }
      }

      if (sR) {
        op(rFg, 1);
        op(phoebe, 1);
        bilePlace(phoebe, cam, 600, 420, 1.15, -10);
        phoebe.set({ t, talk: talk(t, 'phoebe'), mood: 'sad', look: 0 });
        bilePlace(vL, cam, 490, 540, 1.2, 8 + 2 * Math.sin(t * 1.6) * AMP);
        bilePlace(vR, cam, 712, 540, 1.2, -10 + 2 * Math.sin(t * 1.4 + 1) * AMP);
      }
    }

    /* ---------- E: Bill confessional ---------- */
    confB.set(sE, t);
    if (sE) {
      op(eFg, 1);
      const k = 1.02 + 0.08 * P(t, mid('thbill', 0.8), end('thbill') + 0.5 - mid('thbill', 0.8), linear);
      const cam = { k, cx: 430, cy: 380 };
      bileCam(confB, k, 430, 380);
      op(bill, 1); bilePlace(bill, cam, 430, 410, 1.5);
      const wash = t > mid('thbill', 0.72);
      bill.set({ t, talk: talk(t, 'bill'), mood: wash ? 'deadpan' : 'annoyed', look: 0, bubbles: wash ? 1 : 0 });
      const bp = bilePop(badge, t, at('thbill') + 0.15, 880, 250, 1, -4);
      op(badge, clamp(bp * 2.5) * (1 - P(t, mid('thbill', 0.42), 0.2, linear)));
      badgeStrike.set(P(t, mid('thbill', 0.28), 0.3, ease));
      bilePop(noCard, t, mid('thbill', 0.44), 880, 250);
      op(ncL1, P(t, mid('thbill', 0.5), 0.3, linear)); op(ncL2, P(t, mid('thbill', 0.6), 0.3, linear));
      bilePop(sponge, t, mid('thbill', 0.72), 880, 480);
      sBubs.forEach((b, i) => { const f = (t * 0.7 + i / 4) % 1; attr(b, 'cx', -30 + i * 60 + 6 * Math.sin(t * 3 + i)); attr(b, 'cy', -40 - f * 60); op(b, Math.sin(f * Math.PI)); });
      bilePop(cWash, t, mid('thbill', 0.78), 880, 580);
    }

    /* ---------- O + P + Q: the map board ---------- */
    op(mapShot, sO || sP || sQ);
    if (sO) {
      op(oFg, 1);
      const mp = P(t, cO, 0.4, pop);
      tr(map, 600, 470, Math.max(0.01, 0.92 + 0.08 * mp));
      map.set(3, 1);
      op(offKids[0], P(t, mid('helpers', 0.3), 0.3, linear));
      [1, 2, 3].forEach((c, i) => { const p = P(t, mid('helpers', [0.02, 0.1, 0.22][i]), 0.35, pop); op(offKids[c], clamp(p * 2.5)); });
      op(offKids[4], P(t, mid('helpers', 0.62), 0.3, linear));
      offKids.forEach((c, i) => { if (i >= 1 && i <= 3) { const x = [-230, 0, 230][i - 1], p = P(t, mid('helpers', [0.02, 0.1, 0.22][i - 1]), 0.35, pop); tr(c, x, -172, Math.max(0.01, 0.6 + 0.4 * p)); } });
      trainPath.set(P(t, mid('helpers', 0.3), 0.5, linear));
      op(trainPath, 1 - 0.5 * P(t, mid('helpers', 0.5), 0.2, linear));
      const xp = P(t, mid('helpers', 0.48), 0.3, pop); op(trainX, clamp(xp * 2.5)); tr(trainX, 520, 352, Math.max(0.01, xp * 0.8));
      bilePop(cNotLine, t, mid('helpers', 0.72), 560, 640);
      op(percy, 1); tr(percy, 1080, 610, 0.6);
      percy.set({ t, talk: talk(t, 'percy'), mood: 'deadpan', look: -0.7 });
    }
    if (sP) {
      op(pFg, 1); op(scooter, 1);
      const f = P(t, at('commute') - 0.05, end('commute') + 0.4 - at('commute'), linear);
      const x = lerp(P0[0] + 40, P1[0] - 60, f), y = lerp(P0[1] + 20, P1[1] + 10, f);
      const ang = Math.atan2(P1[1] - P0[1], P1[0] - P0[0]) * 180 / Math.PI;
      const ar = ang * Math.PI / 180, ss = 1.6;
      const sx = x + Math.sin(ar) * 68 * ss, sy = y - Math.cos(ar) * 68 * ss;
      tr(scooter, sx, sy, ss, ang);
      // Bill rides on the deck (scooter-local (-10, -16), half size)
      op(bill, 1); tr(bill, sx + ss * (-10 * Math.cos(ar) + 16 * Math.sin(ar)), sy + ss * (-10 * Math.sin(ar) - 16 * Math.cos(ar)), ss * 0.5, ang);
      wheels.forEach((w, i) => tr(w, [-56, 60][i], 52, 1, (t * 400) % 360));
      bill.set({ t, talk: talk(t, 'bill'), mood: 'deadpan', look: 0 });
    }
    if (sQ) {
      op(qFg, 1);
      const rowT = [0.03, 0.33, 0.6];
      const rp = rowT.map(f => P(t, mid('done', f), 0.4, linear));
      const bp = rowT.map(f => P(t, mid('done', f) + 0.4, 0.8, ease));
      tr(sumStarch, 330, ROWS[0], 0.85); sumStarch.set(bp[0]); op(sumStarch, rp[0]);
      tr(sumProt, 330, ROWS[1], 0.85); sumProt.set(bp[1]); op(sumProt, rp[1]);
      tr(fatX, 330, ROWS[2], 0.85); fatX.set(bp[2]); op(fatX, rp[2]);
      sumSrc.forEach((s, i) => op(s, rp[i]));
      sumArr.forEach((a, i) => { op(a, rp[i]); a.set(P(t, mid('done', rowT[i]) + 0.5, 0.4, linear)); });
      sumProd.forEach((s, i) => op(s, P(t, mid('done', rowT[i]) + 0.8, 0.3, linear)));
    }
  };
});
