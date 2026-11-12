/* THE POWERHOUSE, scene 5: "Paying the oxygen debt".
   Shots: Kavya flat on the grass, still panting (breathing-rate meter) -> close-up, "Why am I still breathing like this?"
   -> the office, lactic acid everywhere, Larry lounging, IOU oxygen; the twins burst in
   -> the OXYGEN DEBT invoice; inside the muscle, oxygen breaks down the lactic acid
   -> Mitch: "pay it back, with oxygen" (stamp), "even your cells have bills" (push-in)
   -> the twins escort Larry out of the door -> Mitch's summary card: aerobic vs anaerobic (and Larry). */
scene('debt', S => {
  const { at, end, mid } = S, root = S.root;
  const RED = !!S.reduce, AMP = RED ? 0.35 : 1, F = 0.12;
  const INK = '#1A2A36';

  /* ---------- local helpers (prefixed db) ---------- */
  const shot = (t, t0, t1) => (t < t0 || t >= t1 + F) ? 0 : clamp((t - t0) / F);
  const dbCam = (g, fx, fy, k) => g.setAttribute('transform', `translate(${fx} ${fy}) scale(${k.toFixed(4)}) translate(${-fx} ${-fy})`);
  const dbPut = (parent, kind, x, y, s, mood) => { const w = G(parent); tr(w, x, y); const c = scChar(w, kind, { s, mood }); c.w = w; return c; };
  const dbSet = (c, t, who, mood, look, more) => c.set(Object.assign({ t, talk: who ? scTalk(S, t, who) : 0, mood, look, still: RED }, more || {}));
  const dbPop = (el, x, y, p, s0) => { op(el, clamp(p * 2)); el.setAttribute('transform', `translate(${x} ${y}) scale(${Math.max(0.01, (s0 === undefined ? 0 : s0) + (1 - (s0 || 0)) * p).toFixed(3)})`); };
  // text with real subscripts: digits straight after a letter are lowered
  function dbChem(parent, x, y, str, o) {
    o = o || {};
    const size = o.size || 32, sub = Math.round(size * 0.62), dy = Math.round(size * 0.24);
    const te = E('text', { x, y, 'font-size': size, 'font-weight': o.weight || 700, fill: o.fill || C.ink, 'text-anchor': o.anchor || 'middle', 'font-family': FD }, parent);
    let low = false, prev = '';
    const re = /(\d+)|([^\d]+)/g; let m;
    while ((m = re.exec(str))) {
      const txt = m[0], isSub = !!m[1] && /[A-Za-z)]/.test(prev);
      const ts = E('tspan', {}, te); ts.textContent = txt;
      if (isSub) { ts.setAttribute('font-size', sub); if (!low) { ts.setAttribute('dy', dy); low = true; } }
      else if (low) { ts.setAttribute('dy', -dy); low = false; }
      prev = txt.slice(-1);
    }
    return te;
  }
  function dbStamp(parent, lines, size, color) {
    const g = G(parent), inner = G(g);
    const w = Math.max(...lines.map(l => textWidth(l, size, FD, 800))) + size * 1.3, h = lines.length * size * 1.15 + size * 0.75;
    E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: 16, fill: 'rgba(232,66,79,0.10)', stroke: color, 'stroke-width': 8 }, inner);
    E('rect', { x: -w / 2 + 11, y: -h / 2 + 11, width: w - 22, height: h - 22, rx: 9, fill: 'none', stroke: color, 'stroke-width': 3 }, inner);
    lines.forEach((l, i) => T(inner, 0, -h / 2 + size * 0.375 + size * 1.15 * (i + 0.5) + size * 0.36, l, { size, weight: 800, anchor: 'middle', fill: color, ls: 2 }));
    return g;
  }
  // an office door on the right wall with an EXIT sign; g.open(p)
  function dbDoor(parent) {
    const g = G(parent);
    E('rect', { x: 1000, y: 292, width: 140, height: 326, rx: 6, fill: '#2A1216', stroke: '#9E4A40', 'stroke-width': 6 }, g);
    E('rect', { x: 1010, y: 302, width: 120, height: 310, fill: '#120609' }, g);
    const panel = G(g);
    E('rect', { x: 1010, y: 302, width: 120, height: 310, fill: ball('#B07A45', '#7A4E26'), stroke: INK, 'stroke-width': 3 }, panel);
    E('rect', { x: 1026, y: 322, width: 88, height: 110, rx: 4, fill: 'none', stroke: '#5A3618', 'stroke-width': 3 }, panel);
    E('circle', { cx: 1112, cy: 470, r: 7, fill: '#FFD23F', stroke: INK, 'stroke-width': 2 }, panel);
    const sg = G(g); E('rect', { x: 1028, y: 246, width: 84, height: 38, rx: 6, fill: '#2FA35B', stroke: '#E9FFF1', 'stroke-width': 2 }, sg);
    T(sg, 1070, 274, 'EXIT', { size: 26, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
    g.open = p => panel.setAttribute('transform', `translate(1010 0) scale(${(1 - 0.82 * clamp(p)).toFixed(3)} 1) translate(-1010 0)`);
    g.open(0);
    return g;
  }
  // a lactic acid splodge (pink, a little spiky)
  function dbSplodge(parent, x, y, r, seed) {
    const d = closedPath(blobPts(r, r * 0.86, 10, 0, 0, seed).map(([px, py], i) => (i % 2 ? [px * 0.72, py * 0.72] : [px * 1.08, py * 1.08])));
    return E('path', { d, fill: ball(C.lactic, C.lacticDk), stroke: C.lacticDk, 'stroke-width': 2.5, transform: `translate(${x} ${y})` }, parent);
  }

  /* ===== shot A: Kavya flat on the grass, still panting ===== */
  const A = G(root);
  const aSet = scTrack(A);
  const aBodyW = G(A);
  const aBody = scKavyaBody(aBodyW);
  aBody.pose({ lean: 0, armL: [150, 20], armR: [-35, 10], legL: [12, -4], legR: [-12, -4] });
  const aSweat = scSweat(A, [[440, 400], [500, 396]]);
  const aPuffs = G(A), aPuff = [];
  for (let i = 0; i < 3; i++) aPuff.push(E('circle', { r: 14, fill: '#FFFFFF', stroke: '#DDF4FF', 'stroke-width': 3 }, aPuffs));
  const aMeter = G(A); tr(aMeter, 700, 160);
  T(aMeter, 0, 0, 'breathing rate', { size: 30, weight: 700, fill: INK });
  const aBar = meter(aMeter, { w: 360, h: 34, color: C.bad, track: '#E9F2F7' }); tr(aBar, 0, 18);
  const aHigh = T(aMeter, 376, 46, 'HIGH', { size: 34, weight: 800, fill: '#C2453A' });
  const aQ = G(A); tr(aQ, 880, 290);
  chip(aQ, 'still panting?', { size: 34, fill: '#FFFFFF', color: INK, stroke: INK, sw: 3 });

  /* ===== shot B: close-up of Kavya on the grass ===== */
  const B = G(root);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#4FAE5E', '#3E9850', true) }, B);
  {
    const r = rng(23); let d = '';
    for (let i = 0; i < 140; i++) { const x = r() * 1200, y = 20 + r() * 720, h = 10 + r() * 14, k = (r() - 0.5) * 8; d += `M${x.toFixed(0)},${y.toFixed(0)} q${k.toFixed(1)},${(-h / 2).toFixed(1)} ${(k * 1.6).toFixed(1)},${(-h).toFixed(1)} `; }
    E('path', { d, fill: 'none', stroke: '#7FD08A', 'stroke-width': 3, 'stroke-linecap': 'round', opacity: 0.7 }, B);
  }
  const bCam = G(B);
  const bKav = dbPut(bCam, 'kavya', 540, 450, 1.5);
  const bPuffs = G(bCam), bPuff = [];
  for (let i = 0; i < 4; i++) bPuff.push(E('circle', { r: 18, fill: '#FFFFFF', stroke: '#DDF4FF', 'stroke-width': 3 }, bPuffs));
  const bQ = T(B, 0, 50, '?!', { size: 150, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  const bMeter = G(B); tr(bMeter, 975, 190);
  const bBar = meter(bMeter, { w: 56, h: 300, vertical: true, color: C.bad, track: '#E9F2F7' });
  T(bMeter, 28, 344, 'breathing', { size: 30, weight: 700, anchor: 'middle', fill: '#FFFFFF' });
  T(bMeter, 28, 378, 'rate', { size: 30, weight: 700, anchor: 'middle', fill: '#FFFFFF' });
  const bStill = T(bMeter, 28, 430, 'STILL HIGH', { size: 32, weight: 800, anchor: 'middle', fill: '#FFE45C' });

  /* ===== shot C: the office, Larry's mess; the twins arrive ===== */
  const Cc = G(root);
  scOffice(Cc);
  const cDoor = dbDoor(Cc);
  const cMess = G(Cc);
  {
    const r = rng(9);
    for (let i = 0; i < 28; i++) {
      const floor = i < 15, x = floor ? 60 + r() * 920 : 600 + r() * 380 - (i % 3 === 0 ? 520 : 0), y = floor ? 625 + r() * 80 : 150 + r() * 380;
      dbSplodge(cMess, x, y, floor ? 12 + r() * 10 : 9 + r() * 8, i + 3);
    }
  }
  const cLbl = labelLine(Cc, 840, 584, 760, 650, 'lactic acid', { size: 30, fill: '#FF9BC8', anchor: 'start', line: '#FF9BC8' });
  const cLarry = dbPut(Cc, 'larry', 640, 480, 0.8, 'smug');
  const cMitch = dbPut(Cc, 'mitch', 250, 440, 1.0);
  const cIOU = G(Cc);
  E('rect', { x: -95, y: -62, width: 190, height: 124, rx: 6, fill: '#FFE66D', stroke: '#C9A800', 'stroke-width': 3 }, cIOU);
  T(cIOU, 0, -12, 'IOU', { size: 40, weight: 800, anchor: 'middle', fill: INK });
  T(cIOU, 0, 36, 'oxygen', { size: 34, weight: 700, anchor: 'middle', fill: '#C2453A' });
  const cTwins = dbPut(Cc, 'twins', 1070, 460, 0.7);

  /* ===== shot D: inside the muscle, oxygen breaks down the lactic acid ===== */
  const D = G(root);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#2A0E18', '#4A1626', true) }, D);
  const LX = 885, LY = 395, LR = 235;
  const clipId = 'dbMuscleClip';
  { const cp = E('clipPath', { id: clipId }, defs()); E('circle', { cx: LX, cy: LY, r: LR }, cp); }
  const dIn = G(D, { 'clip-path': `url(#${clipId})` });
  E('rect', { x: LX - LR, y: LY - LR, width: LR * 2, height: LR * 2, fill: '#C9566E' }, dIn);
  for (let i = 0; i < 6; i++) E('rect', { x: LX - LR, y: LY - LR + 20 + i * 78, width: LR * 2, height: 52, rx: 26, fill: '#E27A8E', opacity: 0.7 }, dIn);
  let sd = ''; for (let x = LX - LR; x < LX + LR; x += 26) sd += `M${x},${LY - LR} L${x},${LY + LR} `;
  E('path', { d: sd, stroke: '#B54460', 'stroke-width': 3, opacity: 0.5 }, dIn);
  const dDots = [], dr = rng(31);
  for (let i = 0; i < 7; i++) {
    const a = i / 7 * TAU + 0.3, rr = 55 + (i % 3) * 52;
    const x = LX - 30 + Math.cos(a) * rr * 1.1, y = LY + Math.sin(a) * rr * 0.9;
    const el = dbSplodge(dIn, 0, 0, 22, i + 40);
    const o2 = molO2(dIn, 14);
    const sp = spark(dIn, 14, { seed: i });
    dDots.push({ el, o2, sp, x, y, t0: mid('debt', 0.22 + i * 0.065), y0: 160 + dr() * 470 });
  }
  E('circle', { cx: LX, cy: LY, r: LR, fill: 'none', stroke: '#F2F7FA', 'stroke-width': 8 }, D);
  E('circle', { cx: LX, cy: LY, r: LR + 8, fill: 'none', stroke: '#2C5468', 'stroke-width': 6 }, D);
  const dL1 = T(D, LX, 680, 'oxygen breaks down', { size: 30, weight: 700, anchor: 'middle', fill: '#FF9A8F' });
  const dL2 = T(D, LX, 716, 'the lactic acid', { size: 30, weight: 700, anchor: 'middle', fill: '#FF9BC8' });

  /* ===== shot E: Mitch, pay it back ===== */
  const Ec = G(root);
  scOffice(Ec);
  const eCam = G(Ec);
  const eMitch = dbPut(eCam, 'mitch', 900, 450, 1.25);

  /* ===== the invoice (on top of shots D and E) ===== */
  const Inv = G(root), invP = G(Inv);
  E('rect', { x: 84, y: 126, width: 500, height: 584, rx: 10, fill: '#0A0F14', opacity: 0.35 }, invP);
  E('rect', { x: 76, y: 118, width: 500, height: 584, rx: 10, fill: '#FBF7EC', stroke: '#C9BFA6', 'stroke-width': 3 }, invP);
  T(invP, 326, 180, 'INVOICE', { size: 46, weight: 800, anchor: 'middle', fill: INK, ls: 4 });
  E('line', { x1: 110, y1: 202, x2: 542, y2: 202, stroke: INK, 'stroke-width': 3 }, invP);
  T(invP, 110, 246, "To: Kavya's muscles", { size: 28, weight: 600, fill: '#4A5A66' });
  const iDebt = T(invP, 326, 322, 'OXYGEN DEBT', { size: 56, weight: 800, anchor: 'middle', fill: '#C2453A' });
  const iDef1 = T(invP, 326, 374, 'the extra oxygen needed', { size: 31, weight: 600, anchor: 'middle', fill: INK });
  const iDef2 = T(invP, 326, 412, 'to break down **lactic acid**', { size: 31, weight: 600, anchor: 'middle', fill: INK, boldFill: '#B3326F' });
  const iDue = G(invP);
  T(iDue, 110, 476, 'Amount due:', { size: 28, weight: 700, fill: INK });
  for (let i = 0; i < 5; i++) { const m = molO2(iDue, 11); tr(m, 318 + i * 50, 467); }
  const iPay = G(invP);
  T(iPay, 110, 534, 'Pay by: **breathing hard**', { size: 29, weight: 600, fill: INK, boldFill: '#1D84A6' });
  T(iPay, 110, 572, '**after exercise**', { size: 29, weight: 600, fill: INK, boldFill: '#1D84A6' });
  const iStamp = dbStamp(Inv, ['PAY BACK', 'WITH OXYGEN'], 38, '#E8424F');

  /* ===== shot F: the twins escort Larry out ===== */
  const Fc = G(root);
  scOffice(Fc);
  const fDoor = dbDoor(Fc);
  const fChip = G(Fc); tr(fChip, 760, 175);
  chip(fChip, 'lactic acid broken down', { size: 30, fill: C.good, color: '#0A2A1C' });
  const fMitch = dbPut(Fc, 'mitch', 220, 450, 0.9);
  const fTwins = dbPut(Fc, 'twins', 0, 0, 0.6);
  const fLarryW = G(Fc);
  const fLarry = scChar(fLarryW, 'larry', { s: 0.8 });
  const fHand = G(fLarryW);
  E('path', { d: 'M0,0 L0,-34', stroke: C.lacticDk, 'stroke-width': 8, 'stroke-linecap': 'round' }, fHand);
  E('circle', { cx: 0, cy: -44, r: 15, fill: C.lactic, stroke: C.lacticDk, 'stroke-width': 3 }, fHand);
  const fSee = T(Fc, 760, 236, 'See you at PE!', { size: 30, weight: 700, anchor: 'middle', fill: '#FF9BC8' });

  /* ===== shot G: Mitch's summary card ===== */
  const Gc = G(root);
  const gConf = scConfessional(Gc, 'mitch');
  const gCam = G(Gc);
  const gMitch = dbPut(gCam, 'mitch', 210, 470, 1.0);
  const gCard = G(Gc);
  card(gCard, 395, 115, 770, 595, { fill: 'rgba(14,26,36,0.92)', stroke: '#3A4B5C', sw: 3 });
  E('line', { x1: 780, y1: 140, x2: 780, y2: 685, stroke: '#3A4B5C', 'stroke-width': 3 }, gCard);
  const COL = [{ cx: 588, name: 'AEROBIC', sub: 'with oxygen', col: C.energy, ok: true, lvl: 1, word: 'LOTS', t: [0.04, 0.13, 0.28, 0.36] },
               { cx: 973, name: 'ANAEROBIC', sub: 'no oxygen, in muscles', col: C.lactic, ok: false, lvl: 0.14, word: 'A LITTLE', t: [0.47, 0.58, 0.7, 0.84] }];
  COL.forEach(c => {
    c.h = G(gCard);
    T(c.h, c.cx, 182, c.name, { size: 46, weight: 800, anchor: 'middle', fill: c.col });
    T(c.h, c.cx, 220, c.sub, { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
    c.ox = G(gCard);
    const m = molO2(c.ox, 15); tr(m, c.cx - 120, 285);
    T(c.ox, c.cx - 84, 296, 'oxygen', { size: 34, weight: 700 });
    const mk = c.ok ? tick(c.ox, 18) : cross(c.ox, 15); tr(mk, c.cx + 125, 284);
    c.en = G(gCard);
    T(c.en, c.cx - 160, 360, 'energy', { size: 26, weight: 600, fill: C.muted });
    c.bar = meter(c.en, { w: 320, h: 30, color: C.energy }); tr(c.bar, c.cx - 160, 374);
    T(c.en, c.cx, 446, c.word, { size: 40, weight: 800, anchor: 'middle', fill: C.energy });
    c.pr = G(gCard);
    T(c.pr, c.cx - 160, 516, c.ok ? 'products' : 'product', { size: 26, weight: 600, fill: C.muted });
    if (c.ok) { T(c.pr, c.cx, 562, 'carbon dioxide', { size: 32, weight: 700, anchor: 'middle', fill: C.co2 }); T(c.pr, c.cx, 604, '+ water', { size: 32, weight: 700, anchor: 'middle', fill: C.water }); }
    else T(c.pr, c.cx, 562, 'lactic acid', { size: 32, weight: 700, anchor: 'middle', fill: '#FF9BC8' });
  });
  const gLarry = dbPut(gCard, 'larry', 973, 632, 0.34, 'smug');
  const gLarryLbl = T(gCard, 1040, 642, '(Larry)', { size: 26, weight: 600, fill: C.muted });

  return t => {
    /* --- A --- */
    const vA = shot(t, -10, at('why'));
    op(A, vA);
    if (vA > 0) {
      aSet.upd(t, 0);
      const pant = wave(t, 0.9);
      tr(aBodyW, 760, 452 - 3 * pant * AMP, 1.6, -90);
      aSweat.set(1, t);
      aPuff.forEach((p, i) => { const q = (t * 1.1 + i / 3) % 1; attr(p, 'cx', 478 + 30 * q + 6 * Math.sin(q * 6 + i)); attr(p, 'cy', 405 - 120 * q); attr(p, 'r', 8 + 18 * q); op(p, Math.sin(q * Math.PI) * 0.85); });
      op(aMeter, P(t, at('still') + 0.3, 0.4, linear));
      aBar.set(P(t, at('still') + 0.4, 0.9, easeOut) * (0.88 + 0.06 * Math.sin(t * 7)));
      op(aHigh, P(t, at('still') + 1.1, 0.3, linear));
      dbPop(aQ, 880, 290, P(t, mid('still', 0.62), 0.4, pop));
    }

    /* --- B --- */
    const vB = shot(t, at('why'), at('mess'));
    op(B, vB);
    if (vB > 0) {
      const pant = wave(t, 0.8);
      dbCam(bCam, 540, 450, 1 + 0.015 * pant * AMP + 0.08 * P(t, end('why'), 0.7, linear) * (RED ? 0.5 : 1));
      dbSet(bKav, t, 'kavya', 'sad', 0, { sweat: 1 });
      bPuff.forEach((p, i) => { const q = (t * 1.25 + i / 4) % 1, side = i % 2 ? 1 : -1; attr(p, 'cx', 540 + side * (30 + 140 * q)); attr(p, 'cy', 470 - 40 * q - 60 * q * q); attr(p, 'r', 10 + 22 * q); op(p, Math.sin(q * Math.PI) * 0.7 * (scTalk(S, t, 'kavya') > 0 ? 0.5 : 1)); });
      dbPop(bQ, 190, 290, P(t, mid('why', 0.55), 0.4, pop));
      bBar.set(0.9 + 0.05 * Math.sin(t * 8));
      op(bStill, P(t, mid('why', 0.65), 0.3, linear));
    }

    /* --- C --- */
    const vC = shot(t, at('mess'), at('debt'));
    op(Cc, vC);
    if (vC > 0) {
      const dOpen = P(t, at('here') - 0.45, 0.3) * (1 - P(t, mid('whereis', 0.3), 0.4));
      cDoor.open(dOpen);
      cLbl.set(P(t, mid('mess', 0.22), 0.3, linear));
      const iou = P(t, mid('mess', 0.66), 0.35, pop);
      op(cIOU, clamp(iou * 2)); tr(cIOU, 470, 220, Math.max(0.01, iou), -7);
      const tw = P(t, at('here') - 0.3, 0.7, easeOut);
      op(cTwins.w, P(t, at('here') - 0.3, 0.15, linear));
      tr(cTwins.w, lerp(1070, 880, tw), lerp(460, 390, tw), lerp(0.75, 1, tw));
      const searching = t > at('whereis') && t < end('whereis') + 0.15;
      const spotted = t >= end('whereis') + 0.15;
      const lk = searching ? Math.sin((t - at('whereis')) * 5) : spotted ? -1 : -0.4;
      cTwins.set({ t, talk: scTalk(S, t, 'otto'), talkB: scTalk(S, t, 'oscar'), mood: spotted ? 'shock' : 'happy', moodB: spotted ? 'shock' : 'neutral', look: lk, lookB: searching ? -lk : lk, still: RED });
      dbSet(cLarry, t, '', spotted ? 'happy' : 'smug', spotted ? 0.8 : -0.5);
      const mlook = t < at('here') - 0.3 ? 0.5 : 0.9;
      dbSet(cMitch, t, 'mitch', t < at('here') ? 'annoyed' : 'deadpan', mlook);
    }

    /* --- D: inside the muscle --- */
    const vD = shot(t, at('debt'), at('borrowed'));
    op(D, vD);
    if (vD > 0) {
      dDots.forEach(d => {
        const u = P(t, d.t0, 0.9, easeOut), gone = P(t, d.t0 + 0.85, 0.35, linear);
        tr(d.el, d.x + 2 * Math.sin(t * 3 + d.x) * AMP, d.y, Math.max(0.01, 1 - 0.6 * gone));
        op(d.el, 1 - gone);
        tr(d.o2, lerp(LX + LR + 40, d.x + 18, u), lerp(d.y0, d.y - 14, u), 1, 200 * u);
        op(d.o2, (u > 0 ? 1 : 0) * (1 - gone));
        const sp = P(t, d.t0 + 0.85, 0.6, linear);
        op(d.sp, Math.sin(sp * Math.PI)); tr(d.sp, d.x, d.y, 0.6 + 0.8 * sp); d.sp.upd(t);
      });
      op(dL1, P(t, mid('debt', 0.3), 0.3, linear)); op(dL2, P(t, mid('debt', 0.36), 0.3, linear));
    }

    /* --- E: Mitch --- */
    const vE = shot(t, at('borrowed'), at('bye'));
    op(Ec, vE);
    if (vE > 0) {
      const push = P(t, at('bills') - 0.1, at('bye') - at('bills'), linear) * (RED ? 0.5 : 1);
      dbCam(eCam, 900, 420, 1 + 0.28 * push);
      dbSet(eMitch, t, 'mitch', t > at('bills') - 0.2 ? 'deadpan' : 'neutral', t > at('bills') - 0.2 ? 0 : -0.6);
    }

    /* --- the invoice --- */
    const vI = t < at('debt') || t >= at('bye') + F ? 0 : 1;
    op(Inv, vI);
    if (vI > 0) {
      const ip = P(t, at('debt') - 0.05, 0.45, easeOut);
      invP.setAttribute('transform', `translate(0 ${(260 * (1 - ip)).toFixed(1)}) rotate(${(-2 - 4 * (1 - ip)).toFixed(2)} 326 410)`);
      dbPop(iDebt, 0, 0, P(t, mid('debt', 0.48), 0.4, pop), 0.5);
      iDebt.setAttribute('transform', `translate(326 306) scale(${Math.max(0.01, 0.5 + 0.5 * P(t, mid('debt', 0.48), 0.4, pop)).toFixed(3)}) translate(-326 -306)`);
      op(iDef1, P(t, mid('debt', 0.08), 0.3, linear)); op(iDef2, P(t, mid('debt', 0.2), 0.3, linear));
      op(iDue, P(t, mid('debt', 0.6), 0.3, linear));
      op(iPay, P(t, mid('debt', 0.74), 0.3, linear));
      const st = P(t, mid('borrowed', 0.66), 0.2, easeIn);
      op(iStamp, clamp(st * 3));
      tr(iStamp, 340, 638, lerp(2.3, 1, st) - 0.05 * Math.sin(Math.PI * P(t, mid('borrowed', 0.66) + 0.2, 0.18, linear)), -11);
    }

    /* --- F: Larry leaves --- */
    const vF = shot(t, at('bye'), at('compare'));
    op(Fc, vF);
    if (vF > 0) {
      fDoor.open(P(t, at('bye'), 0.3) * (1 - P(t, end('bye') + 0.3, 0.3)));
      op(fChip, P(t, at('bye') + 0.1, 0.3, linear));
      op(fSee, P(t, mid('bye', 0.6), 0.3, linear));
      const walk = P(t, at('bye') + 0.15, 2.5), exit = P(t, end('bye') - 0.15, 0.4, linear);
      const lx = lerp(600, 1070, walk), hop = Math.abs(Math.sin(t * 7)) * 10 * AMP * (walk > 0 && walk < 1 ? 1 : 0);
      tr(fLarryW, lx, 470 - hop, 1 - 0.45 * exit); op(fLarryW, 1 - exit);
      dbSet(fLarry, t, 'larry', 'happy', -0.5);
      tr(fHand, 82, -52, 1, 25 * Math.sin(t * 9) * AMP);
      tr(fTwins.w, lx - 210, 420 - hop * 0.5);
      fTwins.set({ t, mood: 'smug', moodB: 'smug', look: 0.6, lookB: 0.6, still: RED });
      dbSet(fMitch, t, '', 'deadpan', clamp((lx - 220) / 400, 0, 1));
    }

    /* --- G: summary --- */
    const vG = shot(t, at('compare'), 1e9);
    op(Gc, vG);
    if (vG > 0) {
      gConf.set(1, t);
      dbCam(gCam, 210, 440, 1 + 0.14 * P(t, end('compare'), 0.9, linear) * (RED ? 0.5 : 1));
      dbSet(gMitch, t, 'mitch', 'deadpan', t > mid('compare', 0.9) ? 0.7 : 0.25);
      op(gCard, P(t, at('compare') - 0.1, 0.25, linear));
      COL.forEach(c => {
        const f = c.t.map(x => mid('compare', x));
        op(c.h, P(t, f[0], 0.3, linear)); op(c.ox, P(t, f[1], 0.3, linear));
        op(c.en, P(t, f[2], 0.3, linear)); c.bar.set(c.lvl * P(t, f[2] + 0.1, 0.8, easeOut));
        op(c.pr, P(t, f[3], 0.3, linear));
      });
      const lp = P(t, mid('compare', 0.92), 0.4, pop);
      op(gLarry.w, clamp(lp * 2)); tr(gLarry.w, 973, 640, Math.max(0.01, lp));
      op(gLarryLbl, P(t, mid('compare', 0.95), 0.3, linear));
      dbSet(gLarry, t, '', 'smug', -0.4);
    }
  };
});
