/* Scene 3: Same stack, same layout.
   The block: three identical floor plans fan out of stack 1, each flat in it has 1 outer electron -> close on stack 1:
   Lithium, Sonny, Potassium wave from their windows beside their shell diagrams (2,1 / 2,8,1 / 2,8,8,1) -> they all
   hold out their electron in sync (similar properties) -> group numbers 1 and 7 glow -> Harold alone in flat 1 while
   the Group 1 family parties below -> Silas: a universe full of lonely Harolds -> floor 3 = 3 shells -> Chloe bursts
   onto her balcony (2, 8, 7: Group 7, Period 3) -> "ONE!" -> Sonny pops in -> Silas: "Not in this scene." -> metals
   wash in from the left, non-metals from the right -> the staircase, Silas on it -> metalloid: complaints from both
   sides -> metals vs non-metals cards -> graphite lights a bulb. "There's always one." */
scene('stacks', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;

  /* ---------- local helpers (prefixed stk) ---------- */
  const on = (t, a, b) => (t >= a && t < b ? 1 : 0);
  const stkOpL = (el, v) => op(el, Math.min(v, 0.99));   // these layers carry opacity="0" as an attribute, so never clear the style
  const camBg = (el, k, cx, cy) => el.setAttribute('transform', Math.abs(k - 1) < 1e-4 ? '' : `translate(${cx.toFixed(1)} ${cy.toFixed(1)}) scale(${k.toFixed(4)}) translate(${(-cx).toFixed(1)} ${(-cy).toFixed(1)})`);
  const popIn = (el, t, t0, x, y, s, r) => { const p = P(t, t0, 0.45, pop); op(el, clamp(p * 2.5)); if (p > 0) tr(el, x, y, Math.max(0.01, (s || 1) * (0.6 + 0.4 * p)), r); };
  const outline = (el, col, w) => { el.setAttribute('stroke', col || '#1B2A55'); el.setAttribute('stroke-width', w || 8); el.setAttribute('paint-order', 'stroke'); el.setAttribute('stroke-linejoin', 'round'); return el; };
  // chip whose text may contain "e^" = e with a superscript minus (a real tspan)
  function stkChip(parent, text, o) {
    o = o || {};
    const size = o.size || 32, h = Math.round(size * 1.75), g = G(parent);
    const flat = text.replace(/\^/g, '−');
    const w = Math.ceil(textWidth(flat, size, FD, 700) + size * 1.4);
    g.box = E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: h / 2, fill: o.fill || 'rgba(10,27,39,0.9)', stroke: o.stroke || C.line, 'stroke-width': 3 }, g);
    const tx = E('text', { x: 0, y: size * 0.35, 'font-size': size, 'font-weight': 700, fill: o.color || C.ink, 'text-anchor': 'middle', 'font-family': FD }, g);
    text.split('^').forEach((seg, i) => {
      if (i > 0) { const sup = E('tspan', { dy: -size * 0.38, 'font-size': size * 0.72 }, tx); sup.textContent = '−'; }
      if (seg) { const ts = E('tspan', i > 0 ? { dy: size * 0.38 } : {}, tx); ts.textContent = seg; }
    });
    g.w = w; g.h = h;
    return g;
  }
  const blkAt = (k, lx, ly, sx, sy) => ({ k, ox: sx - k * lx, oy: sy - k * ly });
  const RED = '#FF8A7E', BLUE = '#7FD3FF';

  // a light Bohr diagram (paths, not one element per electron): shells like [2, 8, 1]; same layout as bkAtom.
  // o: r0, dr, er, p, n (nucleus balls), lastSep (the outer shell's last electron as its own group, g.outer0, with g.glow)
  function stkAtom(parent, shells, o) {
    o = o || {};
    const g = G(parent), r0 = o.r0 || 70, dr = o.dr || 46, er = o.er || 11;
    let rd = ''; shells.forEach((n, k) => { const R = r0 + k * dr; rd += `M${-R},0 a${R},${R} 0 1,0 ${2 * R},0 a${R},${R} 0 1,0 ${-2 * R},0 `; });
    E('path', { d: rd, fill: 'none', stroke: '#9FB4C8', 'stroke-width': 3, opacity: 0.6, 'stroke-dasharray': '2 7', 'stroke-linecap': 'round' }, g);
    if (o.p) {
      const tot = o.p + (o.n || 0), pts = [];
      for (let i = 0; i < tot; i++) { const a = i * 2.39996, rad = 7.6 * Math.sqrt(i + 0.5); pts.push([Math.cos(a) * rad, Math.sin(a) * rad]); }
      let dp = '', dn = '';
      pts.reverse().forEach(([x, y], i) => { const c = `M${(x - 9).toFixed(1)},${y.toFixed(1)} a9,9 0 1,0 18,0 a9,9 0 1,0 -18,0 `; if ((i * 7) % tot < o.p) dp += c; else dn += c; });
      E('circle', { r: 40, fill: glow('#FFB27A'), opacity: 0.5 }, g);
      E('path', { d: dn, fill: '#AEB8C2', stroke: '#4E5966', 'stroke-width': 1.5 }, g);
      E('path', { d: dp, fill: '#F0675A', stroke: '#8E1F2A', 'stroke-width': 1.5 }, g);
    } else E('circle', { r: o.nr || 26, fill: ball('#FF7A6B', '#B5372D'), stroke: '#8E1F2A', 'stroke-width': 3 }, g);
    const pos = (k, i) => { const n = shells[k], a = -Math.PI / 2 + i * TAU / n + (n === 2 ? 0 : k * 0.3), R = r0 + k * dr; return [Math.cos(a) * R, Math.sin(a) * R]; };
    const sg = shells.map(() => G(g));
    const eP = sg.map(s => E('path', { d: '', fill: '#3F9BE0', stroke: '#0E3F66', 'stroke-width': 2.5 }, s));
    const mP = sg.map(s => E('path', { d: '', stroke: '#FFFFFF', 'stroke-width': 2.5, 'stroke-linecap': 'round' }, s));
    const K = shells.length - 1, total = shells.reduce((a, b) => a + b, 0);
    g.outer0 = null;
    if (o.lastSep) {
      const e = G(sg[K]); const [x, y] = pos(K, shells[K] - 1); tr(e, x, y);
      g.glow = E('circle', { r: er * 2.6, fill: glow(C.energy) }, e);
      E('circle', { r: er, fill: ball('#7FD3FF', '#1E6FB0'), stroke: '#0E3F66', 'stroke-width': 2.5 }, e);
      E('path', { d: `M${-er * 0.45},0 h${er * 0.9}`, stroke: '#FFFFFF', 'stroke-width': 2.5, 'stroke-linecap': 'round' }, e);
      g.outer0 = e;
    }
    g.set = n => {
      let before = 0;
      shells.forEach((sn, k) => {
        const m = clamp(n - before, 0, sn); before += sn; let d = '', md = '';
        for (let i = 0; i < m; i++) {
          if (g.outer0 && k === K && i === sn - 1) continue;
          const [x, y] = pos(k, i);
          d += `M${(x - er).toFixed(1)},${y.toFixed(1)} a${er},${er} 0 1,0 ${2 * er},0 a${er},${er} 0 1,0 ${-2 * er},0 `;
          md += `M${(x - er * 0.45).toFixed(1)},${y.toFixed(1)} h${(er * 0.9).toFixed(1)} `;
        }
        attr(eP[k], 'd', d); attr(mP[k], 'd', md);
      });
      if (g.outer0) op(g.outer0, n >= total ? 1 : 0);
    };
    g.spin = t => sg.forEach((s, k) => s.setAttribute('transform', `rotate(${(t * (0.24 - k * 0.05) * (k % 2 ? -1 : 1) * 180 / Math.PI).toFixed(2)})`));
    g.pos = pos;
    g.set(total);
    return g;
  }

  /* layers */
  const Lbg = G(root), Lwin = G(root), Lprop = G(root), Lcast = G(root), Lfront = G(root), Lfg = G(root), Lhud = G(root);

  /* ================= sets ================= */
  const skyShot = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#4FB6F5', '#BFE8FF', true) }, skyShot);
  E('path', { d: 'M90,150 q30,-40 70,-10 q30,-30 60,0 q30,0 20,24 l-150,0 q-20,-6 0,-14 Z M960,110 q30,-40 70,-10 q30,-30 60,0 q30,0 20,24 l-150,0 q-20,-6 0,-14 Z', fill: '#FFFFFF', opacity: 0.85 }, skyShot);
  E('rect', { x: 0, y: 705, width: 1200, height: 45, fill: '#5BBF6A' }, skyShot);
  const confShot = bkConf(Lbg, 'silas');
  const insetBack = G(Lbg);
  E('rect', { x: 700, y: 140, width: 400, height: 260, rx: 16, fill: '#BFE8FF', stroke: '#F2E8C8', 'stroke-width': 8 }, insetBack);
  const cardShot = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#14243A', '#25446B', true) }, cardShot);
  const blockWrap = G(Lbg);
  const block = bkBlock(blockWrap, { look: 1, numbers: false });
  const stkSign = block.deco.lastChild;
  const stackE = G(block);       // an outer electron on each flat in stack 1 (rows 2-7)
  { let dc = '', dm = ''; [3, 11, 19, 37, 55, 87].forEach(z => { const [x, y] = block.pt(z), cx = x + 14, cy = y - 10; dc += `M${cx - 9},${cy} a9,9 0 1,0 18,0 a9,9 0 1,0 -18,0 `; dm += `M${cx - 4},${cy} h8 `; });
    E('path', { d: dc, fill: '#3F9BE0', stroke: '#0E3F66', 'stroke-width': 2 }, stackE); E('path', { d: dm, stroke: '#FFFFFF', 'stroke-width': 2.4 }, stackE); }
  // wash clips for the metal / non-metal layers (block-local coordinates)
  const clipM = E('clipPath', { id: 'stkClipM' }, defs()), clipMr = E('rect', { x: -540, y: -260, width: 0, height: 640 }, clipM);
  const clipN = E('clipPath', { id: 'stkClipN' }, defs()), clipNr = E('rect', { x: 540, y: -260, width: 0, height: 640 }, clipN);
  block.layers.metal.setAttribute('clip-path', 'url(#stkClipM)'); block.layers.nonmetal.setAttribute('clip-path', 'url(#stkClipN)');
  const groupGlow = [1, 17].map(c => E('circle', { r: 26, fill: glow('#FFE45C') }, block.labels.parentNode));
  // group-number label centres (local)
  const lab1 = [block.pt(1)[0], block.pt(1)[1] - 25 - 30], lab7 = [block.pt(9)[0], block.pt(9)[1] - 25 - 30];
  tr(groupGlow[0], lab1[0], lab1[1]); tr(groupGlow[1], lab7[0], lab7[1]);

  /* ================= same: floor plans ================= */
  const plans = [0, 1, 2].map(i => {
    const g = G(Lprop);
    E('rect', { x: -80, y: -52, width: 160, height: 104, rx: 6, fill: '#FFFFFF', stroke: '#2F4FA8', 'stroke-width': 4 }, g);
    E('path', { d: 'M-20,-52 V10 M-80,10 H20 M20,-52 V52 M20,-4 H80 M-20,30 q16,0 16,-20', fill: 'none', stroke: '#2F4FA8', 'stroke-width': 3 }, g);
    const e = G(g); tr(e, 50, -28); E('circle', { r: 11, fill: ball('#7FD3FF', '#1E6FB0'), stroke: '#0E3F66', 'stroke-width': 2 }, e); E('path', { d: 'M-5,0 L5,0', stroke: '#FFFFFF', 'stroke-width': 2.6 }, e);
    return g;
  });
  const cSame = stkChip(Lfg, 'GROUP: same number of outer electrons', { size: 32, color: C.energy, stroke: C.energy });
  const cOne1 = stkChip(Lfg, '1 outer e^ each', { size: 30, color: BLUE, stroke: BLUE });

  /* ================= family ================= */
  const famPanel = G(Lprop);
  E('rect', { x: 610, y: 110, width: 550, height: 560, rx: 20, fill: 'rgba(10,27,39,0.97)', stroke: C.line, 'stroke-width': 3 }, famPanel);
  const FAM = [['lithium', [2, 1], 270], ['sodium (Sonny)', [2, 8, 1], 430], ['potassium', [2, 8, 8, 1], 590]].map(([nm, sh, y]) => {
    const a = stkAtom(famPanel, sh, { r0: 48, dr: 30, er: 13, lastSep: true }); tr(a, 735, y, 0.55);
    const gl = a.glow;
    T(famPanel, 840, y - 16, nm, { size: 28, weight: 700, fill: C.muted, font: FB });
    T(famPanel, 840, y + 34, sh.slice(0, -1).join(', ') + ', **1**', { size: 46, weight: 700, fill: '#FFFFFF', boldFill: C.energy });
    return { a, gl, y };
  });
  const cFamHead = stkChip(famPanel, '1 outer e^ each', { size: 30, color: BLUE, stroke: BLUE }); tr(cFamHead, 885, 165);
  const famWin = [0, 1, 2].map(() => { const b = G(Lwin), f = G(Lfront); E('rect', { x: -23, y: -20, width: 46, height: 42, rx: 2, fill: '#26324A' }, b); E('rect', { x: -26, y: 13, width: 52, height: 9, rx: 2, fill: '#D8CDB6', stroke: '#7E7360', 'stroke-width': 1.2 }, f); return { b, f }; });
  const cFamily = outline(T(Lfg, 0, 0, 'FAMILY!', { size: 64, weight: 800, anchor: 'middle', fill: '#FF8FB0' }), '#5A1030', 10);
  const cSimilar = stkChip(Lfg, 'same outer electrons → similar chemical properties', { size: 30, color: C.energy, stroke: C.energy });

  /* ================= number ================= */
  const cGN = stkChip(Lfg, 'GROUP NUMBER = number of outer electrons', { size: 32, color: C.energy, stroke: C.energy });
  const cG1 = stkChip(Lfg, '1 outer e^', { size: 30, color: BLUE, stroke: BLUE });
  const cG7 = stkChip(Lfg, '7 outer e^', { size: 30, color: BLUE, stroke: BLUE });

  /* ================= harold's flat ================= */
  const harWin = { b: G(Lwin), f: G(Lfront) };
  E('rect', { x: -23, y: -20, width: 46, height: 42, rx: 2, fill: '#26324A' }, harWin.b); E('rect', { x: -26, y: 13, width: 52, height: 9, rx: 2, fill: '#D8CDB6', stroke: '#7E7360', 'stroke-width': 1.2 }, harWin.f);
  const party = G(Lfront);
  const streamers = E('path', { d: '', fill: 'none', stroke: '#FF5FA2', 'stroke-width': 7, 'stroke-linecap': 'round' }, party);
  const streamers2 = E('path', { d: '', fill: 'none', stroke: '#56D69B', 'stroke-width': 7, 'stroke-linecap': 'round' }, party);
  const confetti = E('path', { d: '', fill: '#FFE45C' }, party);
  const hats = [0, 1, 2].map(i => { const h = G(Lfront); E('path', { d: 'M-22,0 L0,-52 L22,0 Z', fill: ['#FF5FA2', '#56D69B', '#7FD3FF'][i], stroke: SC_INK, 'stroke-width': 3, 'stroke-linejoin': 'round' }, h); E('circle', { cy: -54, r: 8, fill: '#FFE45C', stroke: SC_INK, 'stroke-width': 2 }, h); return h; });
  const cHar1 = stkChip(Lfg, 'H: 1 outer e^, like Group 1', { size: 32, color: BLUE, stroke: BLUE });
  const cHar2 = stkChip(Lfg, 'but a NON-METAL GAS', { size: 32, color: '#FFD08A', stroke: '#FFB45C' });
  const cHar3 = stkChip(Lfg, 'Group 1: metals', { size: 30 });

  /* ================= universe inset ================= */
  const uniCam = G(Lfg), uni = G(uniCam);
  E('rect', { x: -200, y: -150, width: 400, height: 300, rx: 16, fill: '#0B1430', stroke: '#F2E8C8', 'stroke-width': 8 }, uni);
  { const r = rng(9); let st = '', bod = '', eyes = '', cl = '';
    for (let i = 0; i < 40; i++) st += `M${(-185 + r() * 370).toFixed(0)},${(-135 + r() * 270).toFixed(0)} h3 v3 h-3 Z `;
    for (let i = 0; i < 17; i++) { const x = -160 + (i % 6) * 64 + r() * 20, y = -100 + Math.floor(i / 6) * 90 + r() * 26, rr = 11 + r() * 6;
      bod += `M${(x - rr).toFixed(1)},${y.toFixed(1)} a${rr.toFixed(1)},${rr.toFixed(1)} 0 1,0 ${(2 * rr).toFixed(1)},0 a${rr.toFixed(1)},${rr.toFixed(1)} 0 1,0 ${(-2 * rr).toFixed(1)},0 Z `;
      eyes += `M${(x - rr * 0.38).toFixed(1)},${(y - 1).toFixed(1)} h3 v4 h-3 Z M${(x + rr * 0.3).toFixed(1)},${(y - 1).toFixed(1)} h3 v4 h-3 Z `;
      cl += `M${(x - 12).toFixed(1)},${(y - rr - 8).toFixed(1)} q2,-10 12,-8 q8,-8 14,2 q8,2 2,8 Z `; }
    E('path', { d: st, fill: '#FFFFFF', opacity: 0.6 }, uni);
    uni.bodies = E('path', { d: bod, fill: '#F4F7FA', stroke: '#A9B5C0', 'stroke-width': 2 }, uni);
    E('path', { d: eyes, fill: SC_INK }, uni);
    uni.clouds = E('path', { d: cl, fill: '#8E9BAA' }, uni); }
  const cUni = stkChip(uniCam, 'most common element in the universe', { size: 28 });
  const cLonely = stkChip(uniCam, '...and the loneliest', { size: 28, color: '#BFD6EA' });

  /* ================= shells = period ================= */
  const rings3 = G(Lfg);
  E('circle', { r: 118, fill: 'rgba(10,27,39,0.88)', stroke: C.line, 'stroke-width': 3 }, rings3);
  [40, 70, 100].forEach(r => E('circle', { r, fill: 'none', stroke: BLUE, 'stroke-width': 5, 'stroke-dasharray': '2 8', 'stroke-linecap': 'round' }, rings3));
  E('circle', { r: 16, fill: ball('#FF7A6B', '#B5372D') }, rings3);
  const cRing3 = stkChip(rings3, '3 shells', { size: 30, color: BLUE, stroke: BLUE }); tr(cRing3, 0, 158);
  const rowHi = E('rect', { width: 0, height: 0, rx: 8, fill: 'rgba(127,211,255,0.35)', stroke: '#1E6FB0', 'stroke-width': 6 }, Lfg);
  const cPer = stkChip(Lfg, 'PERIOD number = number of shells', { size: 32, color: BLUE, stroke: BLUE });

  /* ================= chloe ================= */
  const balcony = G(Lfront);
  E('rect', { x: -32, y: 8, width: 64, height: 6, rx: 2, fill: '#E8EEF4', stroke: '#5A6B7A', 'stroke-width': 1 }, balcony);
  { let d = ''; for (let x = -28; x <= 28; x += 7) d += `M${x},14 v12 `; E('path', { d, stroke: '#5A6B7A', 'stroke-width': 1.6 }, balcony); }
  E('rect', { x: -32, y: 25, width: 64, height: 4, rx: 2, fill: '#E8EEF4', stroke: '#5A6B7A', 'stroke-width': 1 }, balcony);
  const clG = G(Lprop);
  E('circle', { r: 192, fill: 'rgba(10,27,39,0.88)', stroke: C.line, 'stroke-width': 3 }, clG);
  const cl = stkAtom(clG, [2, 8, 8], {});
  cl.set(17);
  const slotXY = cl.pos(2, 7);
  const slot = E('circle', { cx: slotXY[0], cy: slotXY[1], r: 16, fill: 'none', stroke: C.bad, 'stroke-width': 4, 'stroke-dasharray': '5 4' }, cl);
  const c287 = G(Lfg);
  { const c = stkChip(c287, 'xxxxxxxxx', { size: 44, stroke: '#C6E35A' }); c.lastChild.remove(); T(c287, 0, 16, '2, 8, **7**', { size: 44, weight: 700, anchor: 'middle', fill: '#FFFFFF', boldFill: '#C6E35A' }); }
  const cG7b = stkChip(Lfg, '7 outer e^ → Group 7', { size: 32, color: '#D9F26E', stroke: '#C6E35A' });
  const cP3 = stkChip(Lfg, '3 shells → Period 3', { size: 32, color: BLUE, stroke: BLUE });
  const ltChloe = scLowerThird(Lhud, ...BK_LT.chloe);
  const cONE = outline(T(Lfg, 0, 0, 'ONE!', { size: 110, weight: 800, anchor: 'middle', fill: '#D9F26E' }), '#2A3A0A', 12);
  const cFull = stkChip(Lfg, '7 + 1 = 8: a full outer shell', { size: 28, color: '#D9F26E', stroke: '#C6E35A' });

  /* ================= metals / staircase ================= */
  const cMet = stkChip(Lfg, 'METALS: left and centre', { size: 32, color: '#BFD9FF', stroke: '#7FB2F0' });
  const cNon = stkChip(Lfg, 'NON-METALS: right', { size: 32, color: '#FFD9A8', stroke: '#FFB45C' });
  const cStair = stkChip(Lfg, 'the STAIRCASE: between metals and non-metals', { size: 30, color: C.energy, stroke: C.energy });
  const jingle = G(Lfg);
  T(jingle, 0, 0, 'jingle', { size: 28, weight: 700, fill: '#FFE7A8', anchor: 'middle' }).setAttribute('font-style', 'italic');
  outline(jingle.lastChild, '#1B2A55', 6);
  const cMetalloid = stkChip(Lfg, 'METALLOID: a bit of both', { size: 34, color: '#E2D2FF', stroke: '#C6A8FF' });
  const letters = [];
  for (let i = 0; i < 6; i++) {
    const g = G(Lfg), blue = i % 2 === 0;
    E('rect', { x: -34, y: -23, width: 68, height: 46, rx: 4, fill: blue ? '#7FB2F0' : '#FFB45C', stroke: SC_INK, 'stroke-width': 3 }, g);
    E('path', { d: 'M-34,-23 L0,4 L34,-23', fill: 'none', stroke: SC_INK, 'stroke-width': 3 }, g);
    T(g, 0, 18, '!', { size: 26, weight: 800, anchor: 'middle', fill: '#C62828' });
    letters.push(g);
  }

  /* ================= metals vs non-metals cards ================= */
  const cards = G(Lfg);
  function stkCard(x, w, title, col, ink) {
    const g = G(cards);
    E('rect', { x, y: 120, width: w, height: 580, rx: 22, fill: 'rgba(10,27,39,0.92)', stroke: col, 'stroke-width': 4 }, g);
    E('path', { d: `M${x + 22},120 H${x + w - 22} Q${x + w},120 ${x + w},142 V190 H${x} V142 Q${x},120 ${x + 22},120 Z`, fill: col }, g);
    T(g, x + w / 2, 168, title, { size: 38, weight: 800, anchor: 'middle', fill: ink });
    return g;
  }
  const metCard = stkCard(40, 545, 'METALS', '#7FB2F0', '#0E1A30'), nonCard = stkCard(615, 545, 'NON-METALS', '#FFB45C', '#3A1E04');
  const ROWY = [255, 345, 435, 525, 615];
  function stkRow(card, x, i, main, sub, icon) {
    const g = G(card), ic = G(g); tr(ic, x + 60, ROWY[i]); icon(ic);
    T(g, x + 120, ROWY[i] + (sub ? -4 : 12), main, { size: 34, weight: 800, fill: '#FFFFFF' });
    if (sub) T(g, x + 120, ROWY[i] + 30, sub, { size: 26, weight: 600, fill: C.muted, font: FB });
    return g;
  }
  const star = (g, s, c) => E('path', { d: `M0,${-s} Q${s * 0.18},${-s * 0.18} ${s},0 Q${s * 0.18},${s * 0.18} 0,${s} Q${-s * 0.18},${s * 0.18} ${-s},0 Q${-s * 0.18},${-s * 0.18} 0,${-s} Z`, fill: c || '#FFFFFF' }, g);
  const flame = (g, c) => E('path', { d: 'M0,24 Q-20,20 -16,0 Q-12,-12 -4,-24 Q-2,-10 6,-8 Q8,-18 4,-28 Q22,-12 18,6 Q16,22 0,24 Z', fill: c || C.heat, stroke: '#7A2E08', 'stroke-width': 2 }, g);
  const MROWS = [
    stkRow(metCard, 40, 0, 'shiny', '', g => { E('circle', { r: 26, fill: ball('#EEF2F6', '#7D8995') }, g); const s1 = G(g); tr(s1, 18, -18); star(s1, 14); }),
    stkRow(metCard, 40, 1, 'good conductors', 'of electricity and heat', g => { const b = bolt(g, 0.5); tr(b, -12, 0); const f = G(g); tr(f, 16, 4, 0.8); flame(f); }),
    stkRow(metCard, 40, 2, 'malleable', 'hammer into shape', g => { E('rect', { x: -30, y: 14, width: 60, height: 10, rx: 3, fill: '#C9D1DA', stroke: '#5E6B78', 'stroke-width': 2 }, g); const h = G(g); tr(h, 6, -6, 0.6, -35); E('rect', { x: -6, y: -40, width: 12, height: 50, rx: 4, fill: '#B07A45' }, h); E('rect', { x: -22, y: -10, width: 44, height: 22, rx: 5, fill: '#9AA6B2', stroke: SC_INK, 'stroke-width': 3 }, h); }),
    stkRow(metCard, 40, 3, 'ductile', 'pull into wires', g => E('path', { d: 'M-30,10 q8,-30 16,0 q8,30 16,0 q8,-30 16,0 q8,30 14,0', fill: 'none', stroke: '#E3A15C', 'stroke-width': 6, 'stroke-linecap': 'round' }, g)),
    stkRow(metCard, 40, 4, 'high melting points', 'most are solids', g => { const th = thermometer(g, 56, C.bad); tr(th, 0, 22); th.set(0.92); }),
  ];
  const NROWS = [
    stkRow(nonCard, 615, 0, 'dull', '', g => E('path', { d: 'M-28,8 Q-30,-16 -8,-22 Q14,-28 26,-8 Q34,14 12,20 Q-20,28 -28,8 Z', fill: '#7F858C', stroke: '#4E545A', 'stroke-width': 3 }, g)),
    stkRow(nonCard, 615, 1, 'poor conductors', 'of electricity and heat', g => { const b = bolt(g, 0.5, '#9AA6B2'); tr(b, 0, 0); const x = cross(g, 22); tr(x, 0, 0); }),
    stkRow(nonCard, 615, 2, 'brittle', 'shatter when hit', g => E('path', { d: 'M-30,-10 L-12,-20 L-6,4 L-26,14 Z M-2,-22 L18,-18 L14,2 L0,6 Z M4,12 L28,8 L24,24 L6,24 Z', fill: '#FFD08A', stroke: '#8A5A1A', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, g)),
    stkRow(nonCard, 615, 4, 'many are gases', '', g => E('path', { d: 'M-30,12 Q-36,-6 -18,-10 Q-14,-28 4,-22 Q16,-34 28,-16 Q40,-8 32,8 Q30,18 16,16 Z', fill: '#E8EEF4', stroke: '#9AA6B2', 'stroke-width': 3 }, g)),
  ];

  /* ================= graphite circuit ================= */
  const circ = G(Lfg);
  const cwire = wire(circ, [[420, 560], [140, 560], [140, 260], [700, 260], [700, 560], [420, 560]], { spacing: 50 });
  const cell = cellSym(circ); tr(cell, 420, 560);
  E('rect', { x: 210, y: 250, width: 180, height: 20, fill: linGrad('#14243A', '#25446B', true) }, circ);
  const rod = G(circ); tr(rod, 300, 260);
  E('rect', { x: -80, y: -12, width: 160, height: 24, rx: 10, fill: linGrad('#6E7680', '#2E3338', true), stroke: '#1A1D21', 'stroke-width': 3 }, rod);
  E('path', { d: 'M-70,-5 H60', stroke: '#B8C0C8', 'stroke-width': 3, opacity: 0.6, 'stroke-linecap': 'round' }, rod);
  [-92, 92].forEach(x => E('path', { d: `M${x - 10},-14 L${x + 10},-14 L${x + 10},14 L${x - 10},14 Z`, fill: '#E8424F', stroke: SC_INK, 'stroke-width': 2 }, rod));
  T(circ, 300, 320, 'graphite (carbon)', { size: 28, weight: 700, anchor: 'middle', fill: '#C9D1DA' });
  const bulb = bulbSym(circ); tr(bulb, 560, 260);
  const cGraph = stkChip(Lfg, 'graphite: a NON-METAL that conducts electricity', { size: 30, color: C.energy, stroke: C.energy });
  const stamp = G(Lfg);
  E('rect', { x: -130, y: -36, width: 260, height: 72, rx: 8, fill: 'rgba(255,255,255,0.12)', stroke: '#FF6070', 'stroke-width': 6 }, stamp);
  T(stamp, 0, 14, 'EXCEPTION', { size: 42, weight: 800, anchor: 'middle', fill: '#FF6070' });

  /* ================= cast ================= */
  const lith = cast(Lcast, 'lithium'), sonny = cast(Lcast, 'sonny'), pot = cast(Lcast, 'potassium');
  const harold = cast(Lcast, 'harold'), chloe = cast(Lcast, 'chloe');
  const silas = cast(Lcast, 'silas');

  /* ================= shots ================= */
  const c2 = at('family') - 0.06, c3 = at('number') - 0.06, c4 = at('harold') - 0.06, c5 = at('thharold') - 0.06, c6 = at('shellsrow') - 0.06,
    c7 = at('chloe') - 0.06, c8 = at('one') - 0.06, c9 = at('metals') - 0.06, c10 = at('thstairs') - 0.06, c11 = at('shiny') - 0.06, c12 = at('graphite') - 0.06;
  const FAMK = 3.4, FAMC = blkAt(FAMK, block.pt(11)[0], block.pt(11)[1], 300, 405);
  const HARK = 3.3, HARC = blkAt(HARK, block.pt(3)[0], block.pt(3)[1], 330, 390);
  const CLK = 2.0, CLC = blkAt(CLK, block.pt(17)[0], block.pt(17)[1], 780, 400);
  const ONEK = 4.2, ONEC = blkAt(ONEK, block.pt(17)[0], block.pt(17)[1], 720, 360);
  const scr = (c, z) => [c.ox + c.k * block.pt(z)[0], c.oy + c.k * block.pt(z)[1]];
  const place = c => tr(block, c.ox, c.oy, c.k);

  return t => {
    const s1 = on(t, -1e9, c2), s2 = on(t, c2, c3), s3 = on(t, c3, c4), s4 = on(t, c4, c5), s5 = on(t, c5, c6), s6 = on(t, c6, c7),
      s7 = on(t, c7, c8), s8 = on(t, c8, c9), s9 = on(t, c9, c10), s10 = on(t, c10, c11), s11 = on(t, c11, c12), s12 = on(t, c12, 1e9);
    const vis = { silas: 0, sonny: 0, lith: 0, pot: 0, harold: 0, chloe: 0 };
    op(skyShot, s1 + s2 + s3 + s4 + s6 + s7 + s8 + s9); confShot.set(s5 + s10, t); op(insetBack, s10); op(cardShot, s11 + s12);
    op(blockWrap, s1 + s2 + s3 + s4 + s6 + s7 + s8 + s9 + s10);
    block.look(1); op(stkSign, s2 + s4 + s7 + s8 ? 0 : 1);
    op(block.labels, s3 + s6); block.stacks.forEach(s => s && op(s, 0)); block.floors.forEach(f => f && op(f, 0));
    op(stackE, 0); groupGlow.forEach(g => op(g, 0));
    attr(clipMr, 'width', 0); attr(clipNr, 'width', 0); attr(clipNr, 'x', 540); stkOpL(block.layers.metal, 0); stkOpL(block.layers.nonmetal, 0); stkOpL(block.layers.metalloid, 0);
    block.stair.set(0);
    // Silas leaning out of flat 14 (his flat, on the staircase)
    const silasAtHome = (c, s, talkOn) => { const [x, y] = scr(c, 14); vis.silas = 1; tr(silas, x, y + 6 * c.k / 0.85 * 0.1, s); silas.set({ t, talk: talkOn ? scTalk(S, t, 'silas') : 0, mood: 'deadpan', look: -0.6 }); return [x, y]; };

    /* ---------- 1: same stack, same layout ---------- */
    plans.forEach(p => op(p, 0)); op(cSame, 0); op(cOne1, 0);
    if (s1) {
      const c = blkAt(0.75, 0, 0, 760, 400); place(c);
      silasAtHome(c, 0.3, true);
      const [sx, sy] = scr(c, 11);
      plans.forEach((p, i) => { const fp = P(t, mid('same', 0.12) + i * 0.12, 0.55, easeOut); op(p, clamp(fp * 3)); tr(p, lerp(sx, 190, fp), lerp(sy, 230 + i * 135, fp), Math.max(0.01, lerp(0.2, 1, fp)), lerp(30, -4 + 4 * i, fp)); });
      const hp = P(t, mid('same', 0.5), 0.3, linear);
      stkOpL(block.stacks[1], hp * (0.75 + 0.25 * wave(t, 0.8))); op(stackE, P(t, mid('same', 0.62), 0.3, linear));
      popIn(cSame, t, mid('same', 0.45), 760, 140);
      popIn(cOne1, t, mid('same', 0.65), sx + 10, 218);
    }

    /* ---------- 2: the family in stack 1 ---------- */
    op(famPanel, 0); famWin.forEach(w => { op(w.b, 0); op(w.f, 0); }); op(cFamily, 0); op(cSimilar, 0);
    if (s2) {
      place(FAMC);
      const pp = P(t, at('family') + 0.1, 0.4, pop);
      op(famPanel, clamp(pp * 3));
      const zs = [3, 11, 19], ch = [lith, sonny, pot], sc = [0.9, 0.78, 0.72], kk = ['lith', 'sonny', 'pot'];
      const fam = t > mid('family', 0.82) && t < end('family') + 0.4;
      const sync = P(t, mid('similar', 0.45), 0.4, ease) * (1 - P(t, end('similar') - 0.3, 0.3, ease));
      zs.forEach((z, i) => {
        const [x, y] = scr(FAMC, z), w = famWin[i];
        op(w.b, 1); op(w.f, 1); tr(w.b, x, y, FAMK); tr(w.f, x, y, FAMK);
        vis[kk[i]] = 1;
        const wv = Math.sin(t * 5 + i * 1.3) * 9 * AMP * (t < end('family') + 0.4 ? 1 : 0.3);
        tr(ch[i], x, y + 14 - (fam ? Math.abs(Math.sin(t * 9 + i)) * 14 * AMP : 0), sc[i], sync > 0.01 ? 0 : wv);
        ch[i].set({ t, talk: i === 1 ? scTalk(S, t, 'sonny') : 0, mood: fam ? 'shock' : 'happy', look: i === 1 ? 0 : 0.3 });
        if (sync > 0.01) { tr(ch[i].electron, (110 + 30 * sync) * (i === 1 ? 1 : 1), -10 + 4 * Math.sin(t * 6) * AMP, 1 + 0.6 * sync); op(ch[i].orbit, 1 - 0.7 * sync); } else op(ch[i].orbit, 1);
      });
      FAM.forEach(({ a, gl }) => { a.spin(t); op(gl, 0.6 + 0.4 * wave(t, 0.7)); });
      const fp = P(t, mid('family', 0.82), 0.35, pop);
      op(cFamily, t > mid('family', 0.82) ? clamp(fp * 3) * (1 - P(t, end('family') + 0.3, 0.2, linear)) : 0);
      tr(cFamily, 440, 700, Math.max(0.01, 0.6 + 0.4 * fp), -4);
      popIn(cSimilar, t, mid('similar', 0.4), 600, 705);
    } else { [lith, sonny, pot].forEach(c => op(c.orbit, 1)); }

    /* ---------- 3: group number ---------- */
    op(cGN, 0); op(cG1, 0); op(cG7, 0);
    if (s3) {
      const c = blkAt(0.85, 0, 0, 600, 430); place(c);
      silasAtHome(c, 0.32, true);
      const g1 = P(t, mid('number', 0.45), 0.3, linear), g7 = P(t, mid('number', 0.78), 0.3, linear);
      op(groupGlow[0], g1 * (0.6 + 0.4 * wave(t, 0.7))); op(groupGlow[1], g7 * (0.6 + 0.4 * wave(t, 0.7)));
      stkOpL(block.stacks[1], g1 * 0.9); stkOpL(block.stacks[17], g7 * 0.9);
      popIn(cGN, t, mid('number', 0.05), 640, 135);
      popIn(cG1, t, mid('number', 0.48), c.ox + c.k * lab1[0] + 30, 205);
      popIn(cG7, t, mid('number', 0.8), c.ox + c.k * lab7[0], 205);
    }

    /* ---------- 4: Harold, alone above the party ---------- */
    op(harWin.b, 0); op(harWin.f, 0); op(party, 0); hats.forEach(h => op(h, 0)); op(cHar1, 0); op(cHar2, 0); op(cHar3, 0);
    if (s4) {
      const k = HARK * (1 + 0.06 * P(t, end('harold'), 1.0, ease));
      const c = blkAt(k, block.pt(3)[0], block.pt(3)[1], 300, 380); place(c);
      const [hx, hy] = scr(c, 1);
      op(harWin.b, 1); op(harWin.f, 1); tr(harWin.b, hx, hy, k); tr(harWin.f, hx, hy, k);
      vis.harold = 1; tr(harold, hx, hy + 5 * k, 0.26 * k);
      harold.set({ t, talk: scTalk(S, t, 'harold'), mood: 'sad', look: t > mid('harold', 0.7) ? 0.25 : 0 });
      op(party, 1);
      const zs = [3, 11, 19], ch = [lith, sonny, pot], sc = [0.84, 0.7, 0.62].map(v => v * k / HARK), kk = ['lith', 'sonny', 'pot'];
      let d1 = '', d2 = '', cf = '';
      zs.forEach((z, i) => {
        const [x, y] = scr(c, z);
        vis[kk[i]] = 1;
        const by = -Math.abs(Math.sin(t * 7 + i * 1.7)) * 16 * AMP;
        tr(ch[i], x, y + 12 * k / HARK + by, sc[i], Math.sin(t * 6 + i) * 8 * AMP);
        ch[i].set({ t, mood: 'happy', look: 0 });
        const hr = [64, 84, 98][i] * sc[i];
        op(hats[i], 1); tr(hats[i], x + hr * 0.62, y + 12 * k / HARK + by - hr * 0.62, sc[i] * 0.95, 34);
      });
      const [lx, ly] = scr(c, 3), [nx, ny] = scr(c, 11);
      for (let i = 0; i < 2; i++) {
        const yy = (i ? ny : ly) - 70 * k / HARK; let d = `M${lx - 120},${yy}`;
        for (let s = 1; s <= 8; s++) d += ` L${lx - 120 + s * 30},${yy + (s % 2 ? 14 : -6) + 4 * Math.sin(t * 4 + s)}`;
        if (i) d2 = d; else d1 = d;
      }
      const r = rng(5); for (let i = 0; i < 26; i++) { const x = lx - 160 + r() * 330, y0 = ly - 80 + r() * 380, y = y0 + ((t * 60 + r() * 200) % 120); cf += `M${x.toFixed(0)},${y.toFixed(0)} h7 v7 h-7 Z `; }
      attr(streamers, 'd', d1); attr(streamers2, 'd', d2); attr(confetti, 'd', cf);
      popIn(cHar1, t, mid('harold', 0.12), 820, 230);
      popIn(cHar2, t, mid('harold', 0.35), 820, 300);
      popIn(cHar3, t, mid('harold', 0.6), 820, 520);
    }

    /* ---------- 5: confessional: the universe is full of Harolds ---------- */
    op(uniCam, s5);
    if (s5) {
      const k = (1 + 0.03 * P(t, c5, 3, linear)) * (1 + 0.1 * P(t, end('thharold') - 0.2, 1.4, ease));
      camBg(confShot, k, 430, 380); camBg(uniCam, k, 430, 380);
      vis.silas = 1; tr(silas, 430, 380 + 20 * k, 1.5 * k);
      silas.set({ t, talk: scTalk(S, t, 'silas'), mood: 'deadpan', look: t > mid('thharold', 0.1) && t < mid('thharold', 0.45) ? 0.7 : 0 });
      const ip = P(t, at('thharold') + 0.05, 0.45, pop);
      op(uni, clamp(ip * 3)); tr(uni, 900, 300, Math.max(0.01, 0.6 + 0.4 * ip));
      op(uni.clouds, P(t, mid('thharold', 0.62), 0.4, linear));
      popIn(cUni, t, mid('thharold', 0.25), 900, 490);
      popIn(cLonely, t, mid('thharold', 0.66), 900, 556);
    }

    /* ---------- 6: period = number of shells ---------- */
    op(rings3, 0); op(cPer, 0); op(rowHi, 0);
    if (s6) {
      const c = blkAt(0.75, 0, 0, 680, 430); place(c);
      const fp = P(t, at('shellsrow') + 0.1, 0.3, linear);
      op(rowHi, fp * (0.8 + 0.2 * wave(t, 0.8)));
      attr(rowHi, 'x', c.ox + c.k * -510); attr(rowHi, 'y', c.oy + c.k * -78); attr(rowHi, 'width', c.k * 1020); attr(rowHi, 'height', c.k * 56);
      popIn(cPer, t, at('shellsrow') + 0.1, 640, 140);
      popIn(rings3, t, mid('shellsrow', 0.45), 160, c.oy + c.k * block.pt(11)[1]);
    }

    /* ---------- 7: Chloe on her balcony ---------- */
    op(balcony, 0); op(clG, 0); op(c287, 0); op(cG7b, 0); op(cP3, 0); op(slot, 0); op(cONE, 0); op(cFull, 0);
    ltChloe.set(s7 ? win(t, at('chloe') + 0.1, at('chloe') + 3.2, 0.3) : 0);
    if (s7) {
      place(CLC);
      const [x, y] = scr(CLC, 17);
      const bp = P(t, at('chloe') - 0.05, 0.4, pop);
      vis.chloe = 1; tr(chloe, x, y + 4 - 40 * (1 - bp), Math.max(0.01, 0.78 * bp));
      chloe.set({ t, talk: scTalk(S, t, 'chloe'), mood: 'happy', look: t > mid('chloe', 0.25) && t < mid('chloe', 0.5) ? -0.7 : 0 });
      op(balcony, 1); tr(balcony, x, y, CLK);
      vis.silas = 1; const [sx, sy] = scr(CLC, 14); tr(silas, sx, sy + 8, 0.42); silas.set({ t, mood: 'deadpan', look: 0.8 });
      const ap = P(t, mid('chloe', 0.25), 0.45, pop);
      op(clG, clamp(ap * 3)); tr(clG, 230, 400, Math.max(0.01, 0.62 * (0.6 + 0.4 * ap))); cl.set(17); cl.spin(t);
      popIn(c287, t, mid('chloe', 0.3), 230, 140);
      const g7 = P(t, mid('chloe', 0.5), 0.3, linear), p3 = P(t, mid('chloe', 0.78), 0.3, linear);
      stkOpL(block.stacks[17], g7 * (0.7 + 0.3 * wave(t, 0.8)));
      stkOpL(block.floors[3], p3 * (0.7 + 0.3 * wave(t, 0.8)));
      popIn(cG7b, t, mid('chloe', 0.5), 920, 170);
      popIn(cP3, t, mid('chloe', 0.78), 760, 660);
    }

    /* ---------- 8: ONE! / Me! / Not in this scene. ---------- */
    if (s8) {
      const push = 1 + 0.07 * P(t, end('notnow'), 0.9, ease);
      const c = blkAt(ONEK * push, block.pt(17)[0], block.pt(17)[1], 720, 360); place(c);
      vis.chloe = 1;
      const cx = 760 + (push - 1) * 40;
      tr(chloe, cx, 430, 1.3 * push);
      const sil = t >= at('notnow') - 0.15, me = t >= at('me') - 0.15;
      chloe.set({ t, talk: scTalk(S, t, 'chloe'), mood: sil ? 'annoyed' : (t > mid('one', 0.45) ? (t > mid('one', 0.8) ? 'happy' : 'annoyed') : 'happy'), look: me ? -0.8 : 0 });
      // her atom with the empty slot
      op(clG, 1); tr(clG, 1030, 215, 0.46); cl.set(17); cl.spin(0);
      op(slot, 0.4 + 0.6 * wave(t, 0.5));
      popIn(cFull, t, mid('one', 0.2), 1010, 345);
      const op1 = P(t, mid('one', 0.42), 0.35, pop);
      op(cONE, t > mid('one', 0.42) ? clamp(op1 * 3) * (1 - P(t, at('me') - 0.2, 0.2, linear)) : 0);
      tr(cONE, 330, 210, Math.max(0.01, 0.5 + 0.5 * op1), -8 + 3 * Math.sin(t * 20) * AMP);
      if (me) {
        const sp = P(t, at('me') - 0.15, 0.3, easeOut);
        vis.sonny = 1; tr(sonny, lerp(-160, 210, sp), 470, 1.15 * push);
        sonny.set({ t, talk: scTalk(S, t, 'sonny'), mood: sil ? 'sad' : 'shock', look: sil ? 0.5 : 1 });
        tr(sonny.electron, 130, -10 + 6 * Math.sin(t * 8) * AMP, 1.6); op(sonny.orbit, 0.3);
      } else op(sonny.orbit, 1);
      if (sil) {
        const ip = P(t, at('notnow') - 0.15, 0.25, easeOut);
        vis.silas = 1; tr(silas, 470, lerp(900, 500, ip) - (push - 1) * 60, 1.25 * push);
        silas.set({ t, talk: scTalk(S, t, 'silas'), mood: 'deadpan', look: 0 });
      }
    }

    /* ---------- 9: metals, non-metals, the staircase ---------- */
    op(cMet, 0); op(cNon, 0); op(cStair, 0); op(jingle, 0);
    if (s9) {
      const c = blkAt(0.85, 0, 0, 600, 430); place(c);
      const mp = P(t, mid('metals', 0.12), 1.3, ease), np = P(t, mid('metals', 0.62), 1.0, ease);
      stkOpL(block.layers.metal, mp > 0 ? 1 : 0); attr(clipMr, 'width', 1080 * mp);
      stkOpL(block.layers.nonmetal, np > 0 ? 1 : 0); attr(clipNr, 'width', 1080 * np); attr(clipNr, 'x', 540 - 1080 * np);
      const stairs = t >= at('stairs') - 0.1;
      if (!stairs) { popIn(cMet, t, mid('metals', 0.15), 330, 140); popIn(cNon, t, mid('metals', 0.65), 900, 140); }
      block.stair.set(P(t, at('stairs') + 0.1, 1.4, ease));
      if (stairs) {
        popIn(cStair, t, at('stairs') + 0.2, 600, 140);
        const lp = P(t, mid('stairs', 0.6), 0.4, pop);
        if (lp > 0) {
          const [x, y] = scr(c, 14);
          vis.silas = 1; tr(silas, x, y - 6, Math.max(0.01, 0.36 * lp)); silas.set({ t, talk: scTalk(S, t, 'silas'), mood: 'deadpan', look: 0 });
          op(jingle, win(t, mid('stairs', 0.6), end('stairs') + 0.6, 0.15)); tr(jingle, x + 70, y - 46, 1, -10 + 6 * Math.sin(t * 14) * AMP);
        }
      }
    }

    /* ---------- 10: confessional: metalloid, complaints from both sides ---------- */
    op(cMetalloid, 0); letters.forEach(l => op(l, 0));
    if (s10) {
      const k = (1 + 0.03 * P(t, c10, 3, linear)) * (1 + 0.1 * P(t, end('thstairs') - 0.2, 1.2, ease));
      camBg(confShot, k, 430, 380); camBg(insetBack, k, 430, 380);
      const ip = P(t, at('thstairs') + 0.05, 0.4, pop);
      op(insetBack, clamp(ip * 3)); op(blockWrap, clamp(ip * 3));
      const bk = 0.34 * k, bx = 430 + (900 - 430) * k, by = 380 + (262 - 380) * k;
      tr(block, bx, by, bk);
      stkOpL(block.layers.metal, 1); attr(clipMr, 'width', 1080); stkOpL(block.layers.nonmetal, 1); attr(clipNr, 'width', 1080); attr(clipNr, 'x', -540);
      block.stair.set(1);
      stkOpL(block.layers.metalloid, P(t, mid('thstairs', 0.15), 0.3, linear) * (0.7 + 0.3 * wave(t, 0.8)));
      popIn(cMetalloid, t, mid('thstairs', 0.15), 430 + (900 - 430) * k, 380 + (450 - 380) * k);
      vis.silas = 1;
      const hitT = mid('thstairs', 0.55);
      let jolt = 0;
      letters.forEach((l, i) => {
        const left = i % 2 === 0, t0 = hitT + Math.floor(i / 2) * 0.22 + (left ? 0 : 0.11), p = P(t, t0, 0.38, easeIn);
        if (t < t0) return;
        op(l, 1);
        const tx = 430 + (left ? -60 : 60) + (i % 3) * 10, ty = 380 + 20 * Math.floor(i / 2);
        if (p < 1) tr(l, lerp(left ? -80 : 1280, tx, p), lerp(250 + 60 * (i % 4), ty, p) - 80 * Math.sin(p * Math.PI), 1, (left ? 1 : -1) * 360 * p);
        else { const fp = P(t, t0 + 0.38, 0.35, easeIn); tr(l, tx + (left ? -50 : 50) * fp, lerp(ty, 590 + (i % 4) * 8, fp), 1, (left ? -1 : 1) * (12 + i * 5)); }
        if (t > t0 + 0.38 && t < t0 + 0.5) jolt = left ? 8 : -8;
      });
      tr(silas, 430 + jolt * AMP, 380 + 20 * k, 1.5 * k);
      silas.set({ t, talk: scTalk(S, t, 'silas'), mood: 'deadpan', look: t > mid('thstairs', 0.1) && t < mid('thstairs', 0.4) ? 0.7 : 0 });
    }

    /* ---------- 11: metal and non-metal cards ---------- */
    op(cards, s11);
    if (s11) {
      const nonOn = t >= at('dull') - 0.1;
      op(nonCard, nonOn ? 1 : 0.25);
      const mt = [0.1, 0.27, 0.46, 0.58, 0.8], nt = [0.1, 0.78, 0.3, 0.52];
      MROWS.forEach((r, i) => { const p = P(t, mid('shiny', mt[i]), 0.4, pop); op(r, clamp(p * 3)); });
      NROWS.forEach((r, i) => { const p = nonOn ? P(t, mid('dull', nt[i]), 0.4, pop) : 0; op(r, clamp(p * 3)); });
    }

    /* ---------- 12: graphite ---------- */
    op(circ, s12); op(cGraph, 0); op(stamp, 0);
    if (s12) {
      const k = 1 + 0.06 * P(t, end('graphite'), 1.2, ease);
      const rp = P(t, at('graphite') + 0.05, 0.5, easeOut);
      tr(rod, 300, lerp(140, 260, rp));
      const lit = P(t, mid('graphite', 0.28), 0.3, linear);
      bulb.set(lit * (0.9 + 0.1 * wave(t, 0.4))); cwire.set(lit); cwire.upd(t, 70);
      popIn(cGraph, t, mid('graphite', 0.3), 600, 140);
      const sp = P(t, mid('graphite', 0.76), 0.3, pop);
      op(stamp, clamp(sp * 3)); tr(stamp, 300, 400, Math.max(0.01, 1.6 - 0.6 * sp), -10);
      vis.silas = 1; tr(silas, 960, 470 - (k - 1) * 100, 1.25 * k);
      silas.set({ t, talk: scTalk(S, t, 'silas'), mood: 'deadpan', look: t > mid('graphite', 0.2) && t < mid('graphite', 0.7) ? -0.8 : 0 });
    }

    op(silas, vis.silas); op(sonny, vis.sonny); op(lith, vis.lith); op(pot, vis.pot); op(harold, vis.harold); op(chloe, vis.chloe);
  };
});
