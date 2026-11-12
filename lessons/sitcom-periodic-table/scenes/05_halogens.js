/* Scene 5: Chloe just needs one (Group 7, the halogens)
   Beats: stack 17 lights up -> Chloe on her balcony: Cl2, her other half is also her -> the family line-up
   (colours and states) -> gas, gas, liquid, solid: melting points rise -> the twist: reactivity DEcreases
   down Group 7 -> Auntie Fluorine upstairs (bolts) -> Kavya's sticky note -> gaining an electron: chlorine vs
   bromine (further, more shielding, weaker grip) -> the two-column card -> Sonny and Bromine's project ->
   Chloe: "Move." -> displacement, the beaker turns orange -> the word equation -> Sonny offers his electron
   -> "SONNY!" -> the transfer, both shells full: sodium chloride -> Kavya's chicken rice -> Silas: chemistry is weird. */
scene('halogens', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;
  const talk = (t, who) => scTalk(S, t, who);

  /* ---------- local helpers (prefixed hal) ---------- */
  function halSeat(ch, wrap, s) { if (ch.parentNode !== wrap) wrap.appendChild(ch); tr(ch, 0, 0, s === undefined ? 1 : s); }
  function halShow(el, t, t0, t1, x, y, s, r) {
    const p = P(t, t0, 0.45, pop), o = t1 === undefined ? 1 : 1 - P(t, t1, 0.2, linear);
    op(el, clamp(p * 2.5) * o); if (p > 0) tr(el, x, y, Math.max(0.01, (s || 1) * (0.6 + 0.4 * p)), r);
  }
  function halCam(el, cx, cy, k, px, py) { el.setAttribute('transform', `translate(${(px ?? cx).toFixed(1)} ${(py ?? cy).toFixed(1)}) scale(${k.toFixed(4)}) translate(${(-cx).toFixed(1)} ${(-cy).toFixed(1)})`); }
  function halRich(parent, x, y, str, o) {   // 'Cl_2' -> Cl₂ with a real subscript
    o = o || {};
    const size = o.size || 32, sub = Math.round(size * 0.62), dy = Math.round(size * 0.24);
    const t = E('text', { x, y, 'font-size': size, 'font-weight': o.weight || 700, fill: o.fill || C.ink, 'text-anchor': o.anchor || 'middle', 'font-family': FD }, parent);
    str.split(/_(\d+)/).forEach((seg, i) => {
      if (!seg) return;
      const ts = E('tspan', i % 2 ? { 'font-size': sub, dy } : (i > 0 ? { dy: -dy } : {}), t); ts.textContent = seg;
    });
    return t;
  }
  function halChip(parent, str, o) {
    o = o || {};
    const size = o.size || 32, plain = str.replace(/_(\d+)/g, '$1');
    const w = textWidth(plain, size, FD, 700) + size * 1.4, h = Math.round(size * 1.75);
    const g = G(parent);
    E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: h / 2, fill: o.fill || 'rgba(10,27,39,0.9)', stroke: o.stroke || C.line, 'stroke-width': o.sw || 3 }, g);
    halRich(g, 0, size * 0.35, str, { size, fill: o.color || C.ink });
    return g;
  }
  function halE(parent, er) {
    const g = G(parent);
    E('circle', { r: er, fill: ball('#7FD3FF', '#1E6FB0'), stroke: '#0E3F66', 'stroke-width': Math.max(2, er * 0.22) }, g);
    E('path', { d: `M${-er * 0.45},0 L${er * 0.45},0`, stroke: '#FFFFFF', 'stroke-width': Math.max(2.5, er * 0.24), 'stroke-linecap': 'round' }, g);
    return g;
  }
  // a light shell diagram: rings in one path, electrons in one path; o.slots = places on the outer shell
  // (draw 7 of 8 to leave the gap); g.pos(k, i) = where electron i of shell k sits; g.halo glows the outer shell
  function halAtom(parent, shells, o) {
    o = o || {};
    const g = G(parent), r0 = o.r0 || 26, dr = o.dr || 20, er = o.er || 7, last = shells.length - 1;
    g.R = k => r0 + k * dr;
    let rings = '';
    shells.forEach((n, k) => { const R = r0 + k * dr; rings += `M${R},0 A${R},${R} 0 1,0 ${-R},0 A${R},${R} 0 1,0 ${R},0 `; });
    g.halo = E('circle', { r: r0 + last * dr, fill: 'none', stroke: '#FFD24A', 'stroke-width': er * 2.8, opacity: 0 }, g);
    g.shield = E('circle', { r: (r0 + (last - 1) * dr + 12) / 2 + 2, fill: 'none', stroke: '#B8C2CC', 'stroke-width': r0 + (last - 1) * dr - 2, opacity: 0 }, g);
    E('path', { d: rings, fill: 'none', stroke: '#9FB4C8', 'stroke-width': 2.5, opacity: 0.7, 'stroke-dasharray': '2 6', 'stroke-linecap': 'round' }, g);
    E('circle', { r: r0 * 0.62, fill: ball('#FF7A6B', '#B5372D'), stroke: '#8E1F2A', 'stroke-width': 2 }, g);
    g.pos = (k, i) => { const n = k === last && o.slots ? o.slots : shells[k], a = -Math.PI / 2 + i * TAU / n + (n <= 2 ? 0 : k * 0.3), R = r0 + k * dr; return [Math.cos(a) * R, Math.sin(a) * R]; };
    let dE = '', dM = '';
    shells.forEach((n, k) => {
      for (let i = 0; i < n; i++) {
        const [x, y] = g.pos(k, i);
        dE += `M${(x - er).toFixed(1)},${y.toFixed(1)} a${er},${er} 0 1,0 ${2 * er},0 a${er},${er} 0 1,0 ${-2 * er},0 `;
        dM += `M${(x - er * 0.45).toFixed(1)},${y.toFixed(1)} h${(er * 0.9).toFixed(1)} `;
      }
    });
    E('path', { d: dE, fill: '#3FA6EA', stroke: '#0E3F66', 'stroke-width': 2 }, g);
    E('path', { d: dM, stroke: '#FFFFFF', 'stroke-width': 2.2, 'stroke-linecap': 'round' }, g);
    if (o.slots) {   // the empty place(s), dashed
      const [x, y] = g.pos(last, shells[last]);
      g.gap = E('circle', { cx: x, cy: y, r: er + 2, fill: 'none', stroke: C.energy, 'stroke-width': 2.5, 'stroke-dasharray': '4 3' }, g);
    }
    return g;
  }
  function halRow(parent, cx, y, parts, size) {
    const gap = size * 0.4, ws = parts.map(([s]) => textWidth(s, size, FD, 800));
    let x = cx - (ws.reduce((a, b) => a + b, 0) + gap * (parts.length - 1)) / 2;
    return parts.map(([s, col], i) => { const el = T(parent, x + ws[i] / 2, y, s, { size, weight: 800, anchor: 'middle', fill: col }); x += ws[i] + gap; return el; });
  }
  const halMix = (a, b, p) => { const h = s => [1, 3, 5].map(i => parseInt(s.substr(i, 2), 16)); const A = h(a), B = h(b); return `rgb(${A.map((v, i) => Math.round(lerp(v, B[i], p))).join(',')})`; };
  const HEART = 'M0,12 C-24,-6 -16,-28 0,-16 C16,-28 24,-6 0,12 Z';

  /* ---------- the cast ---------- */
  const CHL = cast(root, 'chloe'), FLU = cast(root, 'fluorine', { mood: 'annoyed' }), BRO = cast(root, 'bromine'), IOD = cast(root, 'iodine');
  const SIL = cast(root, 'silas'), SON = cast(root, 'sonny'), KAV = cast(root, 'kavya', { home: true });
  [CHL, FLU, BRO, IOD, SIL, SON, KAV].forEach(c => op(c, 0));

  /* ---------- cut list ---------- */
  const CUTS = [
    [-1, 'block', 'meet'],
    [at('pair') - 0.08, 'balcony', ''],
    [at('colours') - 0.08, 'family', ''],
    [at('twist') - 0.08, 'block', 'twist'],
    [at('auntie') - 0.08, 'facade', ''],
    [at('trap') - 0.08, 'bed', 'trap'],
    [at('gain') - 0.08, 'atoms', ''],
    [at('grip') - 0.08, 'grip', ''],
    [at('partners') - 0.08, 'deck', 'partners'],
    [at('equation') - 0.08, 'board', ''],
    [at('finally') - 0.08, 'deck', 'finally'],
    [at('salt') - 0.08, 'salt', ''],
    [at('chicken') - 0.08, 'bed', 'chicken'],
    [at('thsalt') - 0.08, 'conf', ''],
  ];
  const cutAt = t => { let c = CUTS[0]; for (const k of CUTS) if (t >= k[0]) c = k; return c; };

  /* =====================================================================
     BLOCK: stack 17 lights up; the two arrows
     ===================================================================== */
  const gBlock = G(root);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#4FB6F5', '#BFE8FF', true) }, gBlock);
  E('rect', { x: 0, y: 690, width: 1200, height: 60, fill: '#5BBF6A' }, gBlock);
  const blkW = G(gBlock);
  const BLK = bkBlock(blkW, { numbers: false });
  const bHud = G(gBlock);
  const cG7 = halChip(bHud, 'GROUP 7: the HALOGENS', { size: 40, stroke: '#C6E35A', color: '#FFFFFF' });
  const cG7b = halChip(bHud, 'non-metals · 7 outer electrons', { size: 32, stroke: '#C6E35A', color: '#E6F5B0' });
  const arG1 = arrow(bHud, 86, 290, 86, 610, { color: '#FF6B6B', width: 16, head: 46 });
  const arG7 = arrow(bHud, 1118, 320, 1118, 610, { color: '#9CC23A', width: 16, head: 46 });
  const cInc = halChip(bHud, 'Group 1: reactivity INCREASES ↓', { size: 30, stroke: '#FF6B6B', color: '#FFD0D0' });
  const cDec = halChip(bHud, 'Group 7: reactivity DECREASES ↓', { size: 30, stroke: '#9CC23A', color: '#E6F5B0' });
  const opp = G(bHud);
  { const w = textWidth('OPPOSITE!', 50, FD, 800) + 70; E('rect', { x: -w / 2, y: -42, width: w, height: 84, rx: 12, fill: 'rgba(24,8,12,0.9)', stroke: C.energy, 'stroke-width': 6 }, opp); T(opp, 0, 18, 'OPPOSITE!', { size: 50, weight: 800, anchor: 'middle', fill: C.energy, ls: 2 }); }

  /* =====================================================================
     BALCONY: Chloe and her other half
     ===================================================================== */
  const gBal = G(root);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#F2EAD6', '#DCCFB2', true) }, gBal);
  E('rect', { x: 250, y: 120, width: 560, height: 470, rx: 6, fill: '#7FB6D9', stroke: '#8F8470', 'stroke-width': 8 }, gBal);   // balcony door glass
  E('path', { d: 'M530,120 L530,590', stroke: '#8F8470', 'stroke-width': 6 }, gBal);
  E('path', { d: 'M1000,150 L1150,150 M1000,150 l0,260 M1150,150 l0,260', stroke: '#8A7A5A', 'stroke-width': 5 }, gBal);   // laundry pole
  E('path', { d: 'M1030,150 l-14,90 l40,0 Z M1090,150 l-10,70 l34,0 Z', fill: '#FF8FB0', stroke: '#C2457A', 'stroke-width': 3 }, gBal);
  const balW = G(gBal);
  E('rect', { x: 0, y: 590, width: 1200, height: 160, fill: '#C9BC9E' }, gBal);
  { let d = ''; for (let x = 40; x < 1200; x += 46) d += `M${x},500 L${x},600 `; E('path', { d, stroke: '#5A6B7A', 'stroke-width': 7 }, gBal); }
  E('rect', { x: 0, y: 486, width: 1200, height: 18, rx: 6, fill: '#7E8792', stroke: '#4A525C', 'stroke-width': 3 }, gBal);
  const cCl2 = G(gBal);
  E('rect', { x: -130, y: -72, width: 260, height: 144, rx: 22, fill: 'rgba(14,26,36,0.92)', stroke: '#C6E35A', 'stroke-width': 5 }, cCl2);
  halRich(cCl2, 0, 32, 'Cl_2', { size: 96, weight: 800, fill: '#D9F26E' });
  const cPair = halChip(gBal, 'two chlorine atoms, joined', { size: 30, stroke: '#C6E35A' });
  const cHalf = halChip(gBal, 'her other half', { size: 30, fill: '#FFF6C2', stroke: '#FF5FA2', color: SC_INK });
  const halfAr = arrow(gBal, 850, 420, 660, 420, { color: '#FF5FA2', width: 6 });

  /* =====================================================================
     FAMILY: the halogens in a row, colours and states
     ===================================================================== */
  const gFam = G(root);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#1C2C1A', '#0E1A12', true) }, gFam);
  const FX = [150, 395, 640, 885];
  const famW = FX.map(() => G(gFam));
  const ORDER = [FLU, CHL, BRO, IOD];
  const FINFO = [['fluorine', '#FFF6B8', 'pale yellow', 'gas'], ['chlorine', '#C6E35A', 'green-yellow', 'gas'], ['bromine', '#B44A2E', 'red-brown', 'liquid'], ['iodine', '#3A3640', 'dark grey', 'solid']];
  const famTxt = FINFO.map(([n, col, c1, st], i) => {
    const g = G(gFam);
    T(g, FX[i], 438, n, { size: 34, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
    E('circle', { cx: FX[i] - 98, cy: 476, r: 13, fill: col, stroke: '#FFFFFF', 'stroke-width': 2 }, g);
    T(g, FX[i] - 78, 485, c1 + ' ' + (i === 3 ? 'solid' : st), { size: 26, weight: 700, fill: '#D6DEE6', font: FB });
    if (i === 3) { E('circle', { cx: FX[i] - 98, cy: 514, r: 13, fill: '#9B5CFF', stroke: '#FFFFFF', 'stroke-width': 2 }, g); T(g, FX[i] - 78, 523, 'purple vapour', { size: 26, weight: 700, fill: '#D6C4FF', font: FB }); }
    return g;
  });
  const STC = { gas: '#7FD3FF', liquid: '#FF9A6B', solid: '#B8C2CC' };
  const stamps = FINFO.map(([, , , st]) => { const g = G(gFam); const w = textWidth(st.toUpperCase(), 38, FD, 800) + 40; E('rect', { x: -w / 2, y: -30, width: w, height: 60, rx: 10, fill: 'rgba(10,20,14,0.9)', stroke: STC[st], 'stroke-width': 5 }, g); T(g, 0, 14, st.toUpperCase(), { size: 38, weight: 800, anchor: 'middle', fill: STC[st] }); return g; });
  const mpAr = arrow(gFam, 90, 680, 960, 680, { color: C.energy, width: 8 });
  const mpT = T(gFam, 525, 652, 'going DOWN the group: melting points RISE', { size: 30, weight: 800, anchor: 'middle', fill: C.energy });
  const famSilW = G(gFam);
  const famClip = scClipboard(famSilW, 0.4); tr(famClip, 70, 40, 0.4);

  /* =====================================================================
     FACADE: Auntie Fluorine upstairs, Chloe downstairs
     ===================================================================== */
  const gFac = G(root);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#EFE6CF', '#D8CCAE', true) }, gFac);
  [[380, 110, 260], [380, 410, 260]].forEach(([x, y, h]) => E('rect', { x, y, width: 440, height: h, rx: 8, fill: '#2B3A55', stroke: '#8F8470', 'stroke-width': 10 }, gFac));
  E('rect', { x: 0, y: 370, width: 1200, height: 22, fill: '#B9AE96' }, gFac);
  const plF = G(gFac); E('rect', { x: 860, y: 140, width: 150, height: 54, rx: 8, fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 3 }, plF); T(plF, 935, 178, 'FLAT 9', { size: 28, weight: 800, anchor: 'middle', fill: '#24324F' });
  const plC = G(gFac); E('rect', { x: 860, y: 440, width: 150, height: 54, rx: 8, fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 3 }, plC); T(plC, 935, 478, 'FLAT 17', { size: 28, weight: 800, anchor: 'middle', fill: '#24324F' });
  const facFW = G(gFac), facCW = G(gFac);
  E('rect', { x: 370, y: 336, width: 460, height: 20, rx: 6, fill: '#E3D8BF', stroke: '#8F8470', 'stroke-width': 4 }, gFac);   // sills
  E('rect', { x: 370, y: 660, width: 460, height: 20, rx: 6, fill: '#E3D8BF', stroke: '#8F8470', 'stroke-width': 4 }, gFac);
  const bolts = [[330, 180, -14], [860, 250, 16], [350, 320, 10]].map(([x, y, r]) => { const b = bolt(gFac, 0.7, '#FFE45C'); b.xy = [x, y, r]; return b; });
  const cMost = halChip(gFac, 'fluorine: the MOST reactive', { size: 30, fill: '#FFF6B8', stroke: '#9C8A20', color: SC_INK });

  /* =====================================================================
     BED: Kavya's sticky note, then her chicken rice
     ===================================================================== */
  const gBed = G(root);
  bkBedroom(gBed);
  const bedPost = G(gBed);
  const bedKW = G(gBed);
  E('rect', { x: 0, y: 690, width: 1200, height: 60, fill: linGrad('#7A4E31', '#4E301C', true) }, gBed);
  const sticky = G(gBed);
  E('rect', { x: -190, y: -86, width: 380, height: 172, fill: '#FFF176', stroke: '#C9B13A', 'stroke-width': 2 }, sticky);
  T(sticky, -170, -24, 'Group 1 ↓  MORE', { size: 36, weight: 800, fill: '#C62828' });
  T(sticky, -170, 40, 'Group 7 ↓  LESS', { size: 36, weight: 800, fill: '#2C6E1A' });
  T(sticky, 150, 22, '?!', { size: 56, weight: 800, anchor: 'middle', fill: '#24324F' });
  const lunch = G(gBed);
  E('ellipse', { cx: 600, cy: 668, rx: 130, ry: 34, fill: '#FFFFFF', stroke: '#9AA6B2', 'stroke-width': 4 }, lunch);
  E('path', { d: 'M520,664 Q560,612 610,640 Q640,618 670,660 Z', fill: '#FFFDF4', stroke: '#D8D2C0', 'stroke-width': 3 }, lunch);   // rice
  E('path', { d: 'M560,672 l44,-24 l40,8 l-40,26 Z M606,676 l40,-24 l36,10 l-36,24 Z', fill: '#F2C48A', stroke: '#B07A45', 'stroke-width': 3 }, lunch);   // chicken
  E('path', { d: 'M690,668 a14,9 0 1,0 0.1,0 M712,676 a14,9 0 1,0 0.1,0', fill: '#7FCB6A', stroke: '#2C8C4C', 'stroke-width': 2 }, lunch);   // cucumber
  const shaker = G(gBed); tr(shaker, 850, 612);
  E('path', { d: 'M-34,-50 L34,-50 L40,60 L-40,60 Z', fill: 'rgba(235,245,255,0.85)', stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, shaker);
  E('path', { d: 'M-34,-50 Q0,-96 34,-50 Z', fill: '#C9CED6', stroke: SC_INK, 'stroke-width': 4 }, shaker);
  E('rect', { x: -32, y: -4, width: 64, height: 40, rx: 6, fill: '#FFFFFF', stroke: '#9AA6B2', 'stroke-width': 2 }, shaker);
  T(shaker, 0, 26, 'NaCl', { size: 26, weight: 800, anchor: 'middle', fill: '#3F5BD9' });
  const cSaltK = halChip(gBed, 'sodium chloride = SALT', { size: 34, stroke: '#FFFFFF' });

  /* =====================================================================
     ATOMS: gaining an electron, chlorine vs bromine
     ===================================================================== */
  const gAt = G(root);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#14243A', '#0B1626', true) }, gAt);
  const atClW = G(gAt);
  const aCl = halAtom(atClW, [2, 8, 7], { slots: 8 });
  const aBr = halAtom(gAt, [2, 8, 18, 7], { slots: 8 }); tr(aBr, 850, 400, 1.4);
  const pullCl = E('path', { d: '', stroke: '#FF7A6B', 'stroke-width': 8, 'stroke-linecap': 'round' }, gAt);
  const pullBr = E('path', { d: '', stroke: '#FF7A6B', 'stroke-width': 3, 'stroke-linecap': 'round' }, gAt);
  const eCl = halE(gAt, 10), eBr = halE(gAt, 10);
  const lbCl = T(gAt, 330, 560, 'chlorine: 7 outer electrons', { size: 30, weight: 700, anchor: 'middle', fill: '#D9F26E' });
  const lbBr = T(gAt, 850, 590, 'bromine: 7 outer electrons', { size: 30, weight: 700, anchor: 'middle', fill: '#FF9A6B' });
  const cGain = halChip(gAt, 'halogens react by GAINING an electron', { size: 34, stroke: C.energy, color: C.energy });
  const gripChips = [['further away', 230], ['more shielding', 600], ['weaker grip', 960]].map(([s, x]) => { const c = halChip(gAt, s, { size: 32, stroke: '#FF9A6B', color: '#FFD3B0' }); c.x = x; return c; });
  const atSilW = G(gAt);

  /* =====================================================================
     GRIP: the two-column card
     ===================================================================== */
  const gGrip = G(root);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#14243A', '#0B1626', true) }, gGrip);
  const COLS = [[70, '#FF6B6B', 'GROUP 1', 'Na', ['LOSES an electron', 'weak grip HELPS', 'MORE reactive going down'], true],
    [630, '#9CC23A', 'GROUP 7', 'Cl', ['GAINS an electron', 'weak grip HURTS', 'LESS reactive going down'], false]];
  const gripRows = COLS.map(([x, col, head, sym, rows, good]) => {
    const g = G(gGrip);
    card(g, x, 120, 500, 430, { fill: 'rgba(255,255,255,0.05)', stroke: col, sw: 4 });
    const b = bkBadge(g, sym, { r: 30, fill: '#FFFFFF' }); tr(b, x + 60, 182);
    T(g, x + 104, 196, head, { size: 44, weight: 800, fill: col });
    const rs = rows.map((s, i) => {
      const r = G(gGrip);
      if (i === 1) { const ic = good ? tick(r, 16) : cross(r, 14); tr(ic, x + 46, 360 - 12); }
      T(r, i === 1 ? x + 80 : x + 30, [280, 360, 460][i], (i === 2 ? '' : '') + s, { size: i === 2 ? 30 : 34, weight: 800, fill: i === 1 ? (good ? C.good : '#FF8A94') : i === 2 ? col : C.ink });
      return r;
    });
    const dn = arrow(gGrip, x + 472, 420, x + 472, 520, { color: col, width: 8 });
    rs.push(dn);
    return { g, rs };
  });
  const gripSilW = G(gGrip);

  /* =====================================================================
     DECK: the chess table; Sonny and Bromine's project; Chloe moves in
     ===================================================================== */
  const gDeck = G(root);
  const deckCam = G(gDeck);
  bkVoidDeck(deckCam);
  const dBroW = G(deckCam), dSonW = G(deckCam), dChlW = G(deckCam);
  const proj = G(deckCam); tr(proj, 860, 548, 1, -4);
  E('rect', { x: -60, y: -46, width: 120, height: 84, rx: 6, fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 3 }, proj);
  T(proj, 0, -10, 'PROJECT', { size: 18, weight: 800, anchor: 'middle', fill: '#9AA6B2' });
  T(proj, 0, 24, 'NaBr', { size: 30, weight: 800, anchor: 'middle', fill: '#B44A2E' });
  const dBk = beaker(deckCam, 64, 84, { level: 0.6, liquid: 'rgb(235,245,255)', marks: false }); tr(dBk, 962, 552);
  const flyE = halE(deckCam, 9);
  const hearts = [[-90, -120], [70, -150], [120, -60]].map(([x, y]) => { const h = E('path', { d: HEART, fill: '#FF5FA2', stroke: SC_INK, 'stroke-width': 2.5 }, deckCam); h.xy = [x, y]; return h; });
  const dHud = G(gDeck);
  const cNaBr = halChip(dHud, 'sodium bromide (solution)', { size: 32, stroke: '#B44A2E' });
  const cDisp = halChip(dHud, 'more reactive halogen DISPLACES a less reactive one', { size: 30, stroke: '#C6E35A' });
  const cOrange = halChip(dHud, 'solution turns ORANGE: bromine', { size: 32, fill: '#7A3A10', stroke: '#F28C28', color: '#FFD3B0' });
  const cFree = halChip(dHud, 'ONE FREE ELECTRON!', { size: 32, fill: '#FFF6C2', stroke: '#1E6FB0', color: '#1E3A66' });

  /* =====================================================================
     BOARD: chlorine + sodium bromide -> sodium chloride + bromine
     ===================================================================== */
  const gBoard = G(root);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#2E3B4A', '#1C2631', true) }, gBoard);
  E('rect', { x: 0, y: 640, width: 1200, height: 110, fill: '#3A3226' }, gBoard);
  E('rect', { x: 340, y: 116, width: 820, height: 362, rx: 12, fill: '#FFFFFF', stroke: '#9AA6B2', 'stroke-width': 10 }, gBoard);
  E('rect', { x: 360, y: 478, width: 780, height: 14, rx: 5, fill: '#9AA6B2' }, gBoard);
  const eq1 = halRow(gBoard, 750, 236, [['chlorine', '#5E8A12'], ['+', '#24324F'], ['sodium bromide', '#B44A2E']], 46);
  const eq2 = halRow(gBoard, 750, 326, [['→', '#24324F'], ['sodium chloride', '#3F5BD9'], ['+', '#24324F'], ['bromine', '#B44A2E']], 46);
  const eqN = T(gBoard, 750, 420, 'chlorine takes bromine’s place', { size: 32, weight: 800, anchor: 'middle', fill: '#5E8A12' });
  const bdSilW = G(gBoard);
  const pointer = E('path', { d: 'M250,500 L420,330', stroke: '#8A5A3A', 'stroke-width': 8, 'stroke-linecap': 'round' }, gBoard);
  const bdBk = beaker(gBoard, 130, 150, { level: 0.7, liquid: '#F28C28' }); tr(bdBk, 640, 590);
  const bdT = T(gBoard, 730, 600, 'orange = bromine', { size: 30, weight: 700, fill: '#FFB070' });

  /* =====================================================================
     SALT: the electron moves; both shells full
     ===================================================================== */
  const gSalt = G(root);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#14243A', '#0B1626', true) }, gSalt);
  const aNa = halAtom(gSalt, [2, 8]); tr(aNa, 330, 340, 1.6);
  const naRing3 = E('circle', { r: 66, fill: 'none', stroke: '#9FB4C8', 'stroke-width': 2.5, opacity: 0.7, 'stroke-dasharray': '2 6', 'stroke-linecap': 'round' }, aNa);
  const saClW = G(gSalt);
  const saE = halE(gSalt, 9);
  const lbNa = T(gSalt, 330, 520, '', { size: 32, weight: 800, anchor: 'middle', fill: '#D6DEE6' });
  const lbCl2 = T(gSalt, 860, 520, '', { size: 32, weight: 800, anchor: 'middle', fill: '#D9F26E' });
  const fullNa = halChip(gSalt, 'FULL outer shell ✓', { size: 28, fill: '#3A3010', stroke: '#FFD24A', color: '#FFD24A' });
  const fullCl = halChip(gSalt, 'FULL outer shell ✓', { size: 28, fill: '#3A3010', stroke: '#FFD24A', color: '#FFD24A' });
  const cNaCl = halChip(gSalt, 'together: SODIUM CHLORIDE', { size: 40, fill: '#FFFFFF', stroke: '#3F5BD9', color: '#24324F' });
  const saSonW = G(gSalt), saChlW = G(gSalt);

  /* =====================================================================
     CONFESSIONAL: Silas, "Chemistry is weird"
     ===================================================================== */
  const gConf = G(root);
  const cfCam = G(gConf);
  const conf = bkConf(cfCam, 'silas');
  const cfSilW = G(cfCam);
  const cfCard = G(gConf);
  card(cfCard, 690, 150, 460, 270, { fill: 'rgba(14,26,36,0.9)', stroke: C.energy, sw: 3 });
  const boom = G(cfCard); tr(boom, 750, 270);
  { let d = ''; for (let i = 0; i < 14; i++) { const a = i * TAU / 14, r = i % 2 ? 22 : 44; d += (i ? 'L' : 'M') + (Math.cos(a) * r).toFixed(1) + ',' + (Math.sin(a) * r).toFixed(1); } E('path', { d: d + 'Z', fill: '#FF8A3D', stroke: '#FFE45C', 'stroke-width': 4, 'stroke-linejoin': 'round' }, boom); }
  const plus = T(cfCard, 820, 284, '+', { size: 48, weight: 800, anchor: 'middle', fill: C.ink });
  const gas = G(cfCard); tr(gas, 892, 270);
  E('path', { d: 'M-40,14 Q-52,-6 -32,-12 Q-28,-34 -6,-28 Q8,-44 26,-28 Q48,-30 44,-6 Q56,8 40,14 Z', fill: '#C6E35A', stroke: '#5E7F17', 'stroke-width': 3 }, gas);
  const eqs = T(cfCard, 965, 286, '=', { size: 52, weight: 800, anchor: 'middle', fill: C.ink });
  const plate = G(cfCard); tr(plate, 1060, 276);
  E('ellipse', { rx: 56, ry: 16, fill: '#FFFFFF', stroke: '#9AA6B2', 'stroke-width': 3 }, plate);
  E('path', { d: 'M-40,-2 Q-20,-34 4,-18 Q20,-30 36,-2 Z', fill: '#FFFDF4', stroke: '#D8D2C0', 'stroke-width': 2 }, plate);
  E('path', { d: 'M-16,0 l20,-12 l20,4 l-20,12 Z', fill: '#F2C48A', stroke: '#B07A45', 'stroke-width': 2 }, plate);
  const cfL = [['sodium', 750], ['chlorine', 892], ['lunch', 1060]].map(([s, x]) => T(cfCard, x, 360, s, { size: 26, weight: 700, anchor: 'middle', fill: C.muted, font: FB }));
  const weird = T(gConf, 920, 520, 'Chemistry is weird.', { size: 40, weight: 800, anchor: 'middle', fill: C.energy });

  const SHOTS = { block: gBlock, balcony: gBal, family: gFam, facade: gFac, bed: gBed, atoms: gAt, grip: gGrip, deck: gDeck, board: gBoard, salt: gSalt, conf: gConf };

  return t => {
    const [c0, shot, setup] = cutAt(t);
    for (const k in SHOTS) op(SHOTS[k], k === shot ? 1 : 0);
    const bob = (ph, a) => Math.sin(t * 2 + ph) * (a || 5) * AMP;

    /* ---------------- BLOCK ---------------- */
    if (shot === 'block') {
      halSeat(BLK, blkW); BLK.look(1);
      op(BLK.layers.alkali, 0); op(BLK.layers.halogen, 0); op(BLK.stacks[1], 0); op(BLK.stacks[17], 0);
      [cG7, cG7b, arG1, arG7, cInc, cDec, opp].forEach(e => op(e, 0));
      if (setup === 'meet') {
        const z = P(t, S.first + 0.3, 1.8, ease);
        tr(BLK, lerp(600, 355, z), lerp(430, 420, z), lerp(0.95, 1.25, z));
        const lit = P(t, mid('meet', 0.12), 0.4, linear);
        op(BLK.layers.halogen, 0.9 * lit); op(BLK.stacks[17], lit);
        halShow(cG7, t, mid('meet', 0.15), undefined, 340, 128);
        halShow(cG7b, t, mid('meet', 0.55), undefined, 640, 196);
      } else {
        tr(BLK, 600, 440, 0.95);
        const a7 = P(t, mid('twist', 0.25), 0.35, linear), a1 = P(t, mid('twist', 0.66), 0.35, linear);
        op(BLK.layers.halogen, 0.9 * a7); op(BLK.stacks[17], a7);
        op(BLK.layers.alkali, 0.9 * a1); op(BLK.stacks[1], a1);
        op(arG7, a7 > 0 ? 1 : 0); arG7.set(P(t, mid('twist', 0.25), 0.9, ease));
        op(arG1, a1 > 0 ? 1 : 0); arG1.set(P(t, mid('twist', 0.66), 0.9, ease));
        halShow(cDec, t, mid('twist', 0.28), undefined, 900, 200);
        halShow(cInc, t, mid('twist', 0.68), undefined, 320, 200);
        halShow(opp, t, mid('twist', 0.86), undefined, 640, 128, 1, -3);
      }
    }

    /* ---------------- BALCONY ---------------- */
    if (shot === 'balcony') {
      halSeat(CHL, balW, 1.45); op(CHL, 1);
      tr(balW, 470, 400 + bob(0, 3));
      const f = (t - at('pair')) / (end('pair') - at('pair'));
      const also = f > 0.8, pause = t > end('pair');
      CHL.set({ t, talk: talk(t, 'chloe'), mood: pause ? 'smug' : also ? 'smug' : 'happy', look: also && !pause ? 1 : 0, lookB: also && !pause ? -1 : 0 });
      halShow(cCl2, t, mid('pair', 0.3), undefined, 900, 220);
      halShow(cPair, t, mid('pair', 0.4), undefined, 900, 330);
      const hp = P(t, mid('pair', 0.55), 0.5, ease);
      op(halfAr, hp > 0 ? 1 : 0); halfAr.set(hp);
      halShow(cHalf, t, mid('pair', 0.55), undefined, 960, 420);
    }

    /* ---------------- FAMILY ---------------- */
    if (shot === 'family') {
      ORDER.forEach((c, i) => { halSeat(c, famW[i], 0.6); op(c, 1); });
      halSeat(SIL, famSilW, 0.75); op(SIL, 1);
      if (famSilW.lastChild !== famClip) famSilW.appendChild(famClip);
      tr(famSilW, 1090, 480);
      const T0 = [0.01, 0.23, 0.47, 0.69].map(f => mid('colours', f));
      ORDER.forEach((c, i) => {
        const p = P(t, T0[i], 0.45, pop);
        op(famW[i], clamp(p * 2.5)); tr(famW[i], FX[i], 300 + bob(i, 4) + 40 * (1 - clamp(p)));
        op(famTxt[i], P(t, T0[i] + 0.25, 0.3, linear));
        const me = t > T0[i] && t < (T0[i + 1] || end('colours'));
        c.set({ t, mood: ['annoyed', 'happy', 'neutral', 'deadpan'][i], look: me ? 0 : 0.3 });
        halShow(stamps[i], t, mid('state', 0.04 + i * 0.1), undefined, FX[i], 588);
      });
      const mp = P(t, mid('state', 0.5), 0.8, ease);
      op(mpAr, mp > 0 ? 1 : 0); mpAr.set(mp); op(mpT, P(t, mid('state', 0.5), 0.3, linear));
      SIL.set({ t, talk: talk(t, 'silas'), mood: 'deadpan', look: -0.7 });
    }

    /* ---------------- FACADE ---------------- */
    if (shot === 'facade') {
      halSeat(FLU, facFW, 0.95); halSeat(CHL, facCW, 0.95); op(FLU, 1); op(CHL, 1);
      tr(facFW, 600, 250 + bob(0, 2)); tr(facCW, 600, 560 + bob(1, 3));
      const away = t > mid('auntie', 0.68);
      FLU.set({ t, mood: 'annoyed', look: away ? 0 : 0.2 });
      CHL.set({ t, talk: talk(t, 'chloe'), mood: away ? 'annoyed' : 'neutral', look: away ? -1 : 0, lookB: away ? -1 : 0 });
      const zap = t > end('auntie') - 0.1 ? 1 : 0;
      bolts.forEach((b, i) => {
        const [x, y, r] = b.xy, on = P(t, at('auntie') + 0.2 + i * 0.15, 0.2, linear);
        op(b, on * (0.55 + 0.45 * (Math.sin(t * 19 + i * 2) > 0 ? 1 : 0)));
        tr(b, x, y, 0.7 + 0.08 * Math.sin(t * 11 + i), r);
      });
      halShow(cMost, t, mid('auntie', 0.3), undefined, 935, 280);
      // in the pause: a little bolt zaps down at Chloe's hair; she flinches
      if (zap) tr(facCW, 600 + 4 * Math.sin(t * 50) * AMP, 560);
    }

    /* ---------------- BED ---------------- */
    if (shot === 'bed') {
      halSeat(BLK, bedPost); tr(BLK, BK_POSTER.x, BK_POSTER.y, BK_POSTER.s); BLK.look(0);
      op(BLK.layers.alkali, 0); op(BLK.layers.halogen, 0);
      const trap = setup === 'trap';
      op(BLK.stacks[1], trap ? 0.9 : 0); op(BLK.stacks[17], trap ? 0.9 : 0);
      halSeat(KAV, bedKW, 1.25); op(KAV, 1); tr(bedKW, 330, 548);
      op(sticky, 0); op(lunch, trap ? 0 : 1); op(shaker, trap ? 0 : 1); op(cSaltK, 0);
      if (trap) {
        const done = t > end('trap');
        KAV.set({ t, talk: talk(t, 'kavya'), mood: t < mid('trap', 0.15) ? 'shock' : done ? 'deadpan' : 'annoyed', look: done ? 0 : 0.6 });
        halShow(sticky, t, mid('trap', 0.25), undefined, 860, 520, 1, -3);
      } else {
        const stare = t > end('chicken');
        KAV.set({ t, talk: talk(t, 'kavya'), mood: t < mid('chicken', 0.2) ? 'shock' : stare ? 'deadpan' : 'neutral', look: stare ? 0.9 : 0.4 });
        halShow(cSaltK, t, mid('chicken', 0.3), undefined, 800, 88);
        tr(shaker, 850, 612, 1, stare ? 3 * Math.sin(t * 2) : 0);
      }
    }

    /* ---------------- ATOMS ---------------- */
    if (shot === 'atoms') {
      halSeat(aCl, atClW, 1.4); tr(atClW, 330, 400); op(aCl.halo, 0);
      halSeat(SIL, atSilW, 0.7); op(SIL, 1); tr(atSilW, 590, 420);
      SIL.set({ t, talk: talk(t, 'silas'), mood: 'deadpan', look: t < mid('gain', 0.4) ? -0.6 : 0.6 });
      halShow(cGain, t, mid('gain', 0.04), mid('gain', 0.5), 600, 140);
      op(lbCl, P(t, at('gain'), 0.3, linear)); op(lbBr, P(t, at('gain') + 0.3, 0.3, linear));
      // chlorine grabs an electron fast; bromine's is pulled in slowly
      const [gx, gy] = aCl.pos(2, 7), [bx, by] = aBr.pos(3, 7);
      const clT = [330 + 1.4 * gx, 400 + 1.4 * gy], brT = [850 + 1.4 * bx, 400 + 1.4 * by];
      const pc = P(t, mid('gain', 0.16), 0.6, easeIn), pb = P(t, mid('gain', 0.36), 2.6, easeIn);
      tr(eCl, lerp(clT[0] - 150, clT[0], pc), lerp(clT[1] - 120, clT[1], pc)); op(eCl, P(t, mid('gain', 0.12), 0.2, linear));
      const wob = pb < 1 ? 6 * Math.sin(t * 9) * AMP : 0;
      tr(eBr, lerp(brT[0] + 220, brT[0], pb) + wob, lerp(brT[1] - 130, brT[1], pb)); op(eBr, P(t, mid('gain', 0.32), 0.2, linear));
      op(aCl.gap, pc < 1 ? 0.5 + 0.5 * Math.sin(t * 8) : 0); op(aBr.gap, pb < 1 ? 0.5 + 0.5 * Math.sin(t * 8) : 0);
      const pp = P(t, mid('gain', 0.4), 0.4, linear);
      op(pullCl, pp); op(pullBr, pp);
      attr(pullCl, 'd', `M${330 + gx * 0.25},${400 + gy * 0.25} L${330 + gx * 1.05},${400 + gy * 1.05}`);
      attr(pullBr, 'd', `M${850 + bx * 0.22},${400 + by * 0.22} L${850 + bx * 1.15},${400 + by * 1.15}`);
      op(aBr.shield, P(t, mid('gain', 0.62), 0.5, linear) * 0.5);
      gripChips.forEach((c, i) => halShow(c, t, mid('gain', 0.5 + i * 0.15), undefined, c.x, 672));
    }

    /* ---------------- GRIP ---------------- */
    if (shot === 'grip') {
      halSeat(SIL, gripSilW, 0.62); op(SIL, 1); tr(gripSilW, 600, 650);
      SIL.set({ t, talk: talk(t, 'silas'), mood: 'deadpan', look: t < mid('grip', 0.5) ? -0.6 : 0.6 });
      gripRows.forEach((c, j) => {
        op(c.g, P(t, at('grip') + j * 0.1, 0.3, linear));
        c.rs.forEach((r, i) => op(r, P(t, mid('grip', (j ? 0.52 : 0.04) + [0, 0.17, 0.3, 0.3][i]), 0.3, linear)));
      });
    }

    /* ---------------- DECK ---------------- */
    if (shot === 'deck') {
      halSeat(SON, dSonW, 0.75); halSeat(BRO, dBroW, 0.7); halSeat(CHL, dChlW, 0.78);
      op(SON, 1); op(BRO, 1); op(CHL, 1);
      [cNaBr, cDisp, cOrange, cFree].forEach(e => op(e, 0));
      hearts.forEach(h => op(h, 0)); op(flyE, 0); op(SON.electron, 1);
      tr(dSonW, 710, 600 + bob(1, 3));
      if (setup === 'partners') {
        halCam(deckCam, 600, 375, 1);
        const tIn = at('move') - 0.6, tSwap = mid('displace', 0.1);
        const ci = P(t, tIn, 0.8, easeOut), cs = P(t, tSwap, 0.6, ease);
        op(dChlW, t > tIn ? 1 : 0);
        tr(dChlW, lerp(lerp(-140, 470, ci), 1090, cs), lerp(470, 605, cs) - Math.sin(cs * Math.PI) * 120 + bob(2, 3));
        const fl = P(t, tSwap + 0.15, 0.9, easeOut), flying = fl > 0 && fl < 1;
        tr(dBroW, lerp(1090, 190, fl), lerp(610, 620, fl) - Math.sin(fl * Math.PI) * 380 + (fl === 0 ? bob(0, 3) : 0));
        tr(BRO, 0, 0, lerp(0.7, 0.55, fl), flying ? fl * 720 : 0);
        const out = fl >= 1;
        BRO.set({ t, mood: out ? 'sad' : t > at('move') + 0.2 ? 'shock' : 'happy', look: out ? 0.5 : t > tIn ? -0.8 : -0.6 });
        SON.set({ t, mood: t > tSwap + 0.2 && t < tSwap + 1.6 ? 'shock' : 'happy', look: t > tIn ? (cs > 0.5 ? 0.8 : -0.5) : 0.8 });
        CHL.set({ t, talk: talk(t, 'chloe'), mood: 'smug', look: cs > 0.5 ? -0.6 : 0.8 });
        halShow(cNaBr, t, mid('partners', 0.6), at('move') - 0.2, 900, 430);
        halShow(cDisp, t, mid('displace', 0.25), undefined, 620, 136);
        const orange = P(t, mid('displace', 0.62), 1.0, ease);
        dBk.set(0.6, halMix('#EBF5FF', '#F28C28', orange));
        halShow(cOrange, t, mid('displace', 0.75), undefined, 870, 420);
      } else {
        // Sonny finally offers Chloe his electron; she grabs it
        halCam(deckCam, 900, 560, 1.35, 640, 420);
        tr(dChlW, 1090, 605 + bob(2, 3)); op(dChlW, 1);
        tr(dBroW, 190, 620); tr(BRO, 0, 0, 0.55); BRO.set({ t, mood: 'sad' });
        dBk.set(0.6, '#F28C28');
        const yes = t > at('yes') - 0.05;
        const hold = P(t, mid('finally', 0.12), 0.4, pop), grab = P(t, at('yes') + 0.1, 0.5, ease);
        SON.set({ t, talk: talk(t, 'sonny'), mood: 'happy', look: 0.8 });
        if (hold > 0) { op(SON.electron, grab > 0 ? 0 : 1); tr(SON.electron, lerp(60, 112, clamp(hold)), -10 - 6 * Math.sin(t * 6) * AMP, Math.max(0.01, 1 + 0.6 * hold)); }
        if (grab > 0) { op(flyE, grab < 1 ? 1 : 0); tr(flyE, lerp(796, 1020, grab), lerp(592, 600, grab) - Math.sin(grab * Math.PI) * 50, 1.6); }
        CHL.set({ t, talk: talk(t, 'chloe'), mood: yes ? 'shock' : 'happy', look: -0.8 });
        halShow(cFree, t, mid('finally', 0.6), at('yes') - 0.1, 470, 170);
        if (yes) hearts.forEach((h, i) => {
          const p = P(t, at('yes') + i * 0.12, 0.4, pop);
          op(h, clamp(p * 3)); tr(h, 1090 + h.xy[0], 605 + h.xy[1] - 20 * Math.sin(t * 3 + i) * AMP, Math.max(0.01, 1.3 * p));
        });
      }
    }

    /* ---------------- BOARD ---------------- */
    if (shot === 'board') {
      halSeat(SIL, bdSilW, 1.15); op(SIL, 1); tr(bdSilW, 170, 545);
      SIL.set({ t, talk: talk(t, 'silas'), mood: 'deadpan', look: t > end('equation') ? 0 : 0.8 });
      const F = [0.03, 0.14, 0.18, 0.42, 0.47, 0.7, 0.74];
      [...eq1, ...eq2].forEach((el, i) => op(el, P(t, mid('equation', F[i]), 0.3, linear)));
      op(eqN, P(t, mid('equation', 0.85), 0.3, linear));
      op(bdBk, P(t, at('equation'), 0.3, linear)); op(bdT, P(t, mid('equation', 0.75), 0.3, linear));
      tr(pointer, 0, 0, 1, Math.sin(t * 2) * 2 * AMP);
    }

    /* ---------------- SALT ---------------- */
    if (shot === 'salt') {
      halSeat(aCl, saClW, 1.6); tr(saClW, 860, 340);
      halSeat(SON, saSonW, 0.5); halSeat(CHL, saChlW, 0.5); op(SON, 1); op(CHL, 1);
      tr(saSonW, 125, 350 + bob(1, 3)); tr(saChlW, 1095, 350 + bob(2, 3));
      const [gx, gy] = aCl.pos(2, 7);
      const fp = P(t, mid('salt', 0.12), 1.1, ease);
      const sx = 330, sy = 340 - 66 * 1.6, ex = 860 + 1.6 * gx, ey = 340 + 1.6 * gy;
      tr(saE, lerp(sx, ex, fp), lerp(sy, ey, fp) - Math.sin(fp * Math.PI) * 110, 1.2);
      op(naRing3, 1 - P(t, mid('salt', 0.12) + 1.1, 0.4, linear));
      op(aCl.gap, fp < 1 ? 0.5 + 0.5 * Math.sin(t * 8) : 0);
      const full = P(t, mid('salt', 0.45), 0.4, linear);
      op(aNa.halo, full * 0.5); op(aCl.halo, full * 0.5);
      setText(lbNa, fp < 1 ? 'Na: 2, 8, 1' : 'Na: 2, 8');
      setText(lbCl2, fp < 1 ? 'Cl: 2, 8, 7' : 'Cl: 2, 8, 8');
      halShow(fullNa, t, mid('salt', 0.5), undefined, 330, 570);
      halShow(fullCl, t, mid('salt', 0.55), undefined, 860, 570);
      halShow(cNaCl, t, mid('salt', 0.78), undefined, 600, 140);
      op(SON.electron, fp > 0 ? 0 : 1);
      SON.set({ t, mood: 'happy', look: 0.8 }); CHL.set({ t, mood: full > 0 ? 'happy' : 'shock', look: -0.8 });
    } else if (shot !== 'deck') op(SON.electron, 1);

    /* ---------------- CONFESSIONAL ---------------- */
    if (shot === 'conf') {
      halSeat(SIL, cfSilW, 1.5); op(SIL, 1);
      conf.set(1, t);
      halCam(cfCam, 430, 400, 1 + 0.1 * P(t, mid('thsalt', 0.7), 2.4, ease));
      tr(cfSilW, 430, 410);
      SIL.set({ t, talk: talk(t, 'silas'), mood: 'deadpan', look: t > mid('thsalt', 0.6) ? 0 : 0.5 });
      op(cfCard, P(t, at('thsalt'), 0.2, linear));
      const pp = (el, f, x, y) => halShow(el, t, mid('thsalt', f), undefined, x, y);
      pp(boom, 0.04, 750, 270); op(plus, P(t, mid('thsalt', 0.2), 0.2, linear));
      pp(gas, 0.24, 892, 270); op(eqs, P(t, mid('thsalt', 0.44), 0.2, linear));
      pp(plate, 0.5, 1060, 276);
      cfL.forEach((el, i) => op(el, P(t, mid('thsalt', [0.1, 0.3, 0.56][i]), 0.3, linear)));
      tr(boom, 750, 270, 1 + 0.08 * Math.sin(t * 9) * AMP, (t * 30) % 360);
      op(weird, P(t, mid('thsalt', 0.72), 0.3, linear));
    }
  };
});
