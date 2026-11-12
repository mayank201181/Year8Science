/* Scene 2: The flat inspection.
   Corridor, #03-01: Silas knocks for the annual inspection -> the door opens on Sonny floating in oil ("Mind the oil!",
   Silas steps over a puddle) -> the flat becomes an atom: zoom into the nucleus (protons +, neutrons 0; a neutron
   sits on a bathroom scale adding weight) -> zoom out, electrons fill the shells -> atomic number = 11 protons ->
   mass number 11 + 12 = 23 -> Kavya writes "23 neutrons?" -> whiteboard 23 − 11 = 12 -> Sonny: +11 and −11 cancel
   -> flat six: carbon-12 and carbon-14 (6p 6n / 6p 8n) -> ISOTOPES -> shells fill 2, 8, 8 -> Sonny is 2, 8, 1,
   the outer electron wobbles -> "Free electron!" in the corridor, everyone walks past -> Silas: the flyer guy. */
scene('atom', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;

  /* ---------- local helpers (prefixed atm) ---------- */
  const on = (t, a, b) => (t >= a && t < b ? 1 : 0);
  const camBg = (el, k, cx, cy) => el.setAttribute('transform', Math.abs(k - 1) < 1e-4 ? '' : `translate(${cx.toFixed(1)} ${cy.toFixed(1)}) scale(${k.toFixed(4)}) translate(${(-cx).toFixed(1)} ${(-cy).toFixed(1)})`);
  const popIn = (el, t, t0, x, y, s, r) => { const p = P(t, t0, 0.45, pop); op(el, clamp(p * 2.5)); if (p > 0) tr(el, x, y, Math.max(0.01, (s || 1) * (0.6 + 0.4 * p)), r); };
  const label = (parent, text, o) => { o = o || {}; return chip(parent, text, { size: o.size || 32, fill: o.fill || 'rgba(10,27,39,0.9)', stroke: o.stroke || C.line, sw: 3, color: o.color || C.ink, weight: 700 }); };
  const outline = (el, col, w) => { el.setAttribute('stroke', col || '#1B2A55'); el.setAttribute('stroke-width', w || 8); el.setAttribute('paint-order', 'stroke'); el.setAttribute('stroke-linejoin', 'round'); return el; };
  // nucleus ball positions exactly as bkAtom lays them out
  function atmBalls(np, nn) {
    const tot = np + nn, pts = [];
    for (let i = 0; i < tot; i++) { const a = i * 2.39996, rad = 7.6 * Math.sqrt(i + 0.5); pts.push([Math.cos(a) * rad, Math.sin(a) * rad]); }
    return pts.reverse().map(([x, y], i) => ({ x, y, isP: (i * 7) % tot < np }));
  }
  const RED = '#FF8A7E', GREY = '#C9D1DA', BLUE = '#7FD3FF';

  // a light Bohr diagram (paths, not one element per electron): shells like [2, 8, 1]; same layout as bkAtom.
  // o: r0, dr, er, p, n (nucleus balls), lastSep (the outer shell's last electron as its own group, g.outer0, with g.glow)
  function atmAtom(parent, shells, o) {
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
  const Lbg = G(root), Lprop = G(root), Lcast = G(root), Lfg = G(root), Lhud = G(root);

  /* ================= sets ================= */
  const corShot = G(Lbg);
  const cor = bkCorridor(corShot);
  const doorInside = E('rect', { x: -116, y: -456, width: 232, height: 456, fill: '#E7A93A' }, cor.door.parentNode);
  cor.door.parentNode.insertBefore(doorInside, cor.door);
  const notice = bkSign(corShot, 'NOTICE', 'ANNUAL\nINSPECTION', { w: 290, h: 200, size: 30 }); tr(notice, 930, 330);
  const oilShot = G(Lbg);
  const oil = bkOilFlat(oilShot);
  const oilDoor = G(oilShot);
  E('rect', { x: 950, y: 160, width: 200, height: 480, fill: '#F2EAD6', stroke: '#5A3008', 'stroke-width': 10 }, oilDoor);
  E('rect', { x: 950, y: 560, width: 200, height: 80, fill: '#B8AC94' }, oilDoor);
  const puddle = E('ellipse', { cx: 960, cy: 652, rx: 90, ry: 18, fill: '#C98A1E', stroke: '#7A440C', 'stroke-width': 3, opacity: 0.9 }, oilShot);
  const spaceShot = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#0B1430', '#18284A', true) }, spaceShot);
  { const r = rng(21); let d = ''; for (let i = 0; i < 50; i++) d += `M${(r() * 1200).toFixed(0)},${(r() * 750).toFixed(0)} h3 v3 h-3 Z `; E('path', { d, fill: '#FFFFFF', opacity: 0.35 }, spaceShot); }
  const bedShot = G(Lbg);
  bkBedroom(bedShot);
  const poster = G(bedShot); tr(poster, 800, 300);
  E('rect', { x: -300, y: -165, width: 600, height: 330, rx: 6, fill: '#FBF7EC', stroke: '#C9BFA6', 'stroke-width': 4 }, poster);
  T(poster, 0, -118, 'THE PERIODIC TABLE', { size: 30, weight: 800, anchor: 'middle', fill: '#2B3A55' });
  { let a = '', b = ''; for (let r = 0; r < 6; r++) for (let c = 0; c < 18; c++) { if (r < 3 && c > 1 && c < 12) continue; if (r === 0 && c > 0 && c < 17) continue; ((c > 11 && r < 6) ? (b += `M${-270 + c * 30},${-90 + r * 30} h27 v27 h-27 Z `) : (a += `M${-270 + c * 30},${-90 + r * 30} h27 v27 h-27 Z `)); } E('path', { d: a, fill: '#A9CCF5' }, poster); E('path', { d: b, fill: '#FFD08A' }, poster); }
  const boardShot = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#2B3A4A', '#1A2632', true) }, boardShot);
  E('rect', { x: 290, y: 110, width: 850, height: 470, rx: 10, fill: '#FBFDFF', stroke: '#9AA6B2', 'stroke-width': 10 }, boardShot);
  E('rect', { x: 300, y: 582, width: 830, height: 16, rx: 4, fill: '#9AA6B2' }, boardShot);
  const confShot = bkConf(Lbg, 'silas');

  /* ================= corridor props ================= */
  const cPlate = label(Lfg, 'floor 3, stack 1', { size: 30 });
  const cFlat11 = label(Lfg, 'flat 11: sodium (Na)', { size: 34, color: C.energy, stroke: C.energy });
  const knock1 = outline(T(Lfg, 0, 0, 'KNOCK', { size: 46, weight: 800, anchor: 'middle', fill: '#FFFFFF' }));
  const knock2 = outline(T(Lfg, 0, 0, 'KNOCK', { size: 46, weight: 800, anchor: 'middle', fill: '#FFFFFF' }));
  const clip = scClipboard(Lcast, 0.5);
  const ltSonny = scLowerThird(Lhud, ...BK_LT.sonny);
  const mindOil = outline(T(Lfg, 0, 0, 'drip', { size: 30, weight: 700, anchor: 'middle', fill: '#FFE7A8' }), '#5A3008', 6);

  /* ================= the sodium atom ================= */
  const naG = G(Lprop);
  const na = bkAtom(naG, [2, 8, 1], { p: 11, n: 12 });
  const NB = atmBalls(11, 12);
  const flatOutline = E('path', { d: 'M-200,-110 L0,-250 L200,-110 L200,200 L-200,200 Z', fill: 'none', stroke: '#F2E8C8', 'stroke-width': 4, 'stroke-dasharray': '14 10', opacity: 0.8 }, naG);
  const PL = NB.filter(b => b.isP), NL = NB.filter(b => !b.isP);
  const plusG = E('path', { d: PL.map(b => `M${(b.x - 4.5).toFixed(1)},${b.y.toFixed(1)} h9 M${b.x.toFixed(1)},${(b.y - 4.5).toFixed(1)} v9`).join(' '), stroke: '#FFFFFF', 'stroke-width': 2.4, 'stroke-linecap': 'round' }, na);
  const atmRingD = (list, n) => list.slice(0, n).map(b => `M${(b.x - 10.5).toFixed(1)},${b.y.toFixed(1)} a10.5,10.5 0 1,0 21,0 a10.5,10.5 0 1,0 -21,0`).join(' ');
  const pRing = E('path', { d: '', fill: 'none', stroke: C.energy, 'stroke-width': 2.6 }, na), nRing = E('path', { d: '', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 2.6 }, na);
  const outerGlow = E('circle', { r: 26, fill: glow(C.energy) }, na.outer[0]); na.outer[0].insertBefore(outerGlow, na.outer[0].firstChild);
  // a proton on the left edge and a neutron on the right edge, for the leader lines
  const PB = NB.filter(b => b.isP).sort((a, b) => a.x - b.x)[0], NBr = NB.filter(b => !b.isP).sort((a, b) => b.y - a.y)[0];
  const leadP = E('line', { stroke: RED, 'stroke-width': 4 }, Lfg), leadN = E('line', { stroke: GREY, 'stroke-width': 4 }, Lfg);
  const cAtom = label(Lfg, 'an atom is like a flat', { size: 32 });
  const cNuc = label(Lfg, 'NUCLEUS (tiny, in the middle)', { size: 36, color: C.energy, stroke: C.energy });
  const cProt = label(Lfg, 'protons', { size: 36, color: RED, stroke: C.bad });
  const cNeut = label(Lfg, 'neutrons', { size: 36, color: GREY, stroke: '#9AA6B2' });
  const cProtC = label(Lfg, 'proton: + (positive)', { size: 34, color: RED, stroke: C.bad });
  const cNeutC = label(Lfg, 'neutron: 0 (no charge)', { size: 34, color: GREY, stroke: '#9AA6B2' });
  // the neutron who just sits there
  const lazy = G(Lfg);
  const sc = G(lazy); tr(sc, 0, 70);
  E('rect', { x: -80, y: -16, width: 160, height: 40, rx: 12, fill: '#E9F2F7', stroke: SC_INK, 'stroke-width': 4 }, sc);
  E('rect', { x: -34, y: -8, width: 68, height: 24, rx: 4, fill: '#14141C' }, sc);
  const scRead = T(sc, 0, 13, '0', { size: 22, weight: 800, anchor: 'middle', fill: '#56D69B' });
  E('circle', { cy: 0, r: 52, fill: ball('#C9D1DA', '#6E7B88'), stroke: '#4E5966', 'stroke-width': 4 }, lazy);
  const lazyFace = scFace(lazy, { eye: 11, gap: 34, mouthW: 22, mouthY: 20, lidCol: '#AEB8C2' }); tr(lazyFace, 0, -6);
  T(lazy, 0, 156, '+ weight', { size: 30, weight: 800, anchor: 'middle', fill: GREY });
  // electrons, atomic number, mass number
  const cElec = label(Lfg, 'ELECTRONS: negative (−), in shells', { size: 34, color: BLUE, stroke: BLUE });
  const cAN = label(Lfg, 'ATOMIC NUMBER = number of protons', { size: 36, color: C.energy, stroke: C.energy });
  const big11 = outline(T(Lfg, 880, 420, '0', { size: 150, weight: 800, anchor: 'middle', fill: RED }));
  const big11L = T(Lfg, 880, 480, 'protons', { size: 34, weight: 700, anchor: 'middle', fill: RED });
  const cWhich = label(Lfg, '11 protons → always sodium', { size: 32 });
  const cMN = label(Lfg, 'MASS NUMBER = protons + neutrons', { size: 36, color: C.energy, stroke: C.energy });
  const eq = G(Lfg), EQ_X = [735, 820, 905, 985, 1070];
  const EQ = [['11', 735, RED, 'protons'], ['+', 820, C.ink], ['12', 905, GREY, 'neutrons'], ['=', 985, C.ink], ['23', 1070, C.energy, 'mass no.']].map(([s, x, col, sub]) => {
    const g = G(eq); outline(T(g, x, 420, s, { size: 84, weight: 800, anchor: 'middle', fill: col }), '#0B1430', 8);
    if (sub) T(g, x, 470, sub, { size: 26, weight: 700, anchor: 'middle', fill: col, font: FB });
    return g;
  });
  const cLight = label(Lfg, 'electrons: too light to count', { size: 30, color: BLUE, stroke: BLUE });

  /* ================= Kavya's guess and the whiteboard ================= */
  const note = G(Lprop); tr(note, 790, 640, 1, -4);
  E('rect', { x: -170, y: -70, width: 340, height: 140, rx: 6, fill: '#FFFDF4', stroke: '#9AA6B2', 'stroke-width': 3 }, note);
  E('path', { d: 'M-150,-20 h300 M-150,20 h300', stroke: '#C9DDF0', 'stroke-width': 3 }, note);
  const noteTxt = T(note, -140, 10, '', { size: 40, weight: 700, fill: '#2F4FA8', font: FB });
  const pen = G(Lprop);
  E('rect', { x: -7, y: -100, width: 14, height: 96, fill: '#FFC247', stroke: SC_INK, 'stroke-width': 3 }, pen);
  E('path', { d: 'M-7,-4 L0,16 L7,-4 Z', fill: '#F2D6B0', stroke: SC_INK, 'stroke-width': 3 }, pen);
  const board = G(Lfg);
  const bHead = T(board, 715, 190, 'neutrons = mass number − atomic number', { size: 34, weight: 700, anchor: 'middle', fill: '#4A525C', font: FB });
  const BP = [['23', 450, '#2F4FA8'], ['−', 565, '#24324F'], ['11', 665, '#C2453A'], ['=', 770, '#24324F'], ['12', 880, '#2F7A57']].map(([s, x, col]) => T(board, x, 370, s, { size: 120, weight: 800, anchor: 'middle', fill: col }));
  const bNeut = T(board, 680, 500, '12 neutrons', { size: 60, weight: 800, anchor: 'middle', fill: '#2F7A57' });
  const sticky = G(board); tr(sticky, 1030, 470, 1, 6);
  E('rect', { x: -84, y: -56, width: 168, height: 112, fill: '#FFF176', stroke: '#C9B13A', 'stroke-width': 2 }, sticky);
  T(sticky, 0, -8, '23', { size: 40, weight: 800, anchor: 'middle', fill: '#2F4FA8', font: FB });
  T(sticky, 0, 30, 'neutrons?', { size: 26, weight: 700, anchor: 'middle', fill: '#2F4FA8', font: FB });
  const stickyX = cross(sticky, 46);

  /* ================= neutral ================= */
  const plus11 = G(Lfg); outline(T(plus11, 0, 0, '+11', { size: 96, weight: 800, anchor: 'middle', fill: RED }), '#3A1E04', 10); T(plus11, 0, 46, '11 protons', { size: 30, weight: 700, anchor: 'middle', fill: '#FFFFFF' }).setAttribute('paint-order', 'stroke');
  const minus11 = G(Lfg); outline(T(minus11, 0, 0, '−11', { size: 96, weight: 800, anchor: 'middle', fill: BLUE }), '#3A1E04', 10); T(minus11, 0, 46, '11 electrons', { size: 30, weight: 700, anchor: 'middle', fill: '#FFFFFF' });
  [plus11, minus11].forEach(g => outline(g.lastChild, '#3A1E04', 6));
  const zero = outline(T(Lfg, 0, 0, '= 0', { size: 110, weight: 800, anchor: 'middle', fill: '#FFFFFF' }), '#3A1E04', 10);
  const cNeutral = label(Lfg, 'charges cancel: the atom is neutral', { size: 32, color: C.energy, stroke: C.energy });

  /* ================= carbon ================= */
  const atC12G = G(Lprop), atC14G = G(Lprop);
  const atC12 = atmAtom(atC12G, [2, 4], { p: 6, n: 6, r0: 62, dr: 50, er: 15 }), atC14 = atmAtom(atC14G, [2, 4], { p: 6, n: 8, r0: 62, dr: 50, er: 15 });
  const cP12 = label(Lfg, '6 protons', { size: 30, color: RED, stroke: C.bad }), cP14 = label(Lfg, '6 protons', { size: 30, color: RED, stroke: C.bad });
  const cN12 = label(Lfg, '6 neutrons', { size: 30, color: GREY, stroke: '#9AA6B2' }), cN14 = label(Lfg, '8 neutrons', { size: 30, color: GREY, stroke: '#9AA6B2' });
  const cIso = label(Lfg, 'ISOTOPES', { size: 50, color: C.energy, stroke: C.energy });
  const cIso2 = label(Lfg, 'same protons, different neutrons', { size: 32 });
  const cIso3 = label(Lfg, 'same flat → same reactions', { size: 32, color: '#BDF5D6', stroke: C.good });
  const plateRing = E('rect', { x: 490, y: 86, width: 220, height: 88, rx: 14, fill: 'none', stroke: C.energy, 'stroke-width': 7 }, Lfg);

  /* ================= shells (2, 8, 8) ================= */
  const arG = G(Lprop);
  const ar = atmAtom(arG, [2, 8, 8], {});
  const AX = 470, AY = 420, AK = 1.1;
  const SH = [[-40, 260, '1st shell: up to 2'], [0, 410, '2nd shell: up to 8'], [40, 560, '3rd shell: up to 8']].map(([deg, y, txt], k) => {
    const R = (70 + 46 * k) * AK, a = deg * Math.PI / 180, px = AX + Math.cos(a) * R, py = AY + Math.sin(a) * R;
    const g = G(Lfg);
    E('line', { x1: 760, y1: y, x2: px, y2: py, stroke: BLUE, 'stroke-width': 4 }, g);
    E('circle', { cx: px, cy: py, r: 7, fill: BLUE }, g);
    const c = label(g, txt, { size: 32, color: BLUE, stroke: BLUE }); tr(c, 760 + c.w / 2, y);
    return g;
  });
  const cInside = label(Lfg, 'shells fill from the inside out', { size: 34, color: C.energy, stroke: C.energy });

  /* ================= mine: 2, 8, 1 ================= */
  const conf281 = G(Lfg);
  { const c = label(conf281, '', { size: 70, fill: 'rgba(10,27,39,0.9)', stroke: C.energy }); c.box.setAttribute('x', -170); c.box.setAttribute('width', 340); c.label.remove();
    T(conf281, 0, 25, '2, 8, **1**', { size: 70, weight: 700, anchor: 'middle', fill: '#FFFFFF', boldFill: C.energy }); }
  const cGrab = label(Lfg, '1 outer electron: up for grabs!', { size: 32, color: C.energy, stroke: C.energy });

  /* ================= flyer ================= */
  const sign = G(Lprop);
  E('path', { d: 'M-110,-70 L110,-64 L104,70 L-106,64 Z', fill: '#C9955A', stroke: '#6E4A26', 'stroke-width': 5, 'stroke-linejoin': 'round' }, sign);
  { const tt = T(sign, -18, 22, 'FREE e', { size: 56, weight: 800, anchor: 'middle', fill: '#24324F' }); const sup = E('tspan', { dy: -26, 'font-size': 44 }, tt); sup.textContent = '−'; }
  E('rect', { x: -8, y: 66, width: 16, height: 90, fill: '#8A6038', stroke: '#6E4A26', 'stroke-width': 3 }, sign);

  /* ================= confessional inset: the flyer guy ================= */
  const insetCam = G(Lfg), inset = G(insetCam);
  const clipId = 'atmMrt';
  { const cp = E('clipPath', { id: clipId }, defs()); E('rect', { x: -190, y: -165, width: 380, height: 330, rx: 14 }, cp); }
  const insetIn = G(inset, { 'clip-path': `url(#${clipId})` });
  E('rect', { x: -190, y: -165, width: 380, height: 330, fill: '#C9D3DC' }, insetIn);
  { let d = ''; for (let x = -190; x < 190; x += 38) d += `M${x},-60 v225 `; for (let y = -60; y < 165; y += 38) d += `M-190,${y} h380 `; E('path', { d, stroke: '#AAB6C2', 'stroke-width': 2 }, insetIn); }
  E('rect', { x: -190, y: -165, width: 380, height: 105, fill: '#2F3B48' }, insetIn);
  E('rect', { x: -110, y: -150, width: 220, height: 64, rx: 8, fill: '#2F9E5A', stroke: '#FFFFFF', 'stroke-width': 4 }, insetIn);
  T(insetIn, 0, -106, 'EXIT A', { size: 34, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  E('rect', { x: -190, y: 130, width: 380, height: 40, fill: '#8F9AA6' }, insetIn);
  const walkers = [0, 1].map(i => {   // grey commuters: head, body and two legs
    const g = G(insetIn), col = i ? '#5E6B78' : '#3F4A55';
    E('circle', { cy: -150, r: 15, fill: col }, g); E('rect', { x: -14, y: -132, width: 28, height: 66, rx: 12, fill: col }, g);
    g.legs = E('path', { d: '', stroke: col, 'stroke-width': 11, 'stroke-linecap': 'round' }, g);
    return g;
  });
  const flyerGuy = person(insetIn, { shirt: '#FF8A3D', shorts: '#2E3A55' }); tr(flyerGuy, -70, 140, 0.8);
  flyerGuy.pose({ lean: 4, armR: [82, 6], armL: [6, 10], legL: [3, -3], legR: [-3, -3] });
  const flyerPaper = E('rect', { x: -12, y: -16, width: 26, height: 32, fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 2 }, flyerGuy.firstChild); tr(flyerPaper, 66, -140, 1, 8);
  E('rect', { x: -190, y: -165, width: 380, height: 330, rx: 14, fill: 'none', stroke: '#F2E8C8', 'stroke-width': 8 }, inset);
  const cMrt = label(insetCam, 'the flyer guy at the MRT', { size: 30 });

  /* ================= cast ================= */
  const carb12 = cast(Lcast, 'carbon', { label: 'C-12' }), carb14 = cast(Lcast, 'carbon', { label: 'C-14' });
  const harold = cast(Lcast, 'harold'), helena = cast(Lcast, 'helena');
  const kav = cast(Lcast, 'kavya', { home: true });
  const sonny = cast(Lcast, 'sonny');
  const silas = cast(Lcast, 'silas');

  /* ================= shots ================= */
  const cO1 = at('sonny') - 0.06, cA = at('nucleus') - 0.06, cB = at('guess') - 0.06, cW = at('subtract') - 0.06, cO2 = at('neutral') - 0.06,
    cC2 = at('carbon') - 0.06, cS = at('shells') - 0.06, cM = at('mine') - 0.06, cF = at('flyer') - 0.06, cTH = at('thflyer') - 0.06;
  const camLerp = (a, b, p) => [lerp(a[0], b[0], p), lerp(a[1], b[1], p), lerp(a[2], b[2], p)];

  return t => {
    const sC1 = on(t, -1e9, cO1), sO1 = on(t, cO1, cA), sA = on(t, cA, cB), sB = on(t, cB, cW), sW = on(t, cW, cO2), sO2 = on(t, cO2, cC2),
      sC2 = on(t, cC2, cS), sS = on(t, cS, cM), sM = on(t, cM, cF), sF = on(t, cF, cTH), sTH = on(t, cTH, 1e9);
    const vis = { silas: 0, sonny: 0, kav: 0, c12: 0, c14: 0, harold: 0, helena: 0 };
    op(corShot, sC1 + sC2 + sF); op(oilShot, sO1 + sO2); op(spaceShot, sA + sS + sM); op(bedShot, sB); op(boardShot, sW); confShot.set(sTH, t);
    if (sO1 || sO2) oil.upd(t);
    op(notice, sC1); op(doorInside, 0); op(oilDoor, sO1); op(puddle, sO1); op(clip, 0);

    /* ---------- corridor: inspection ---------- */
    op(cPlate, 0); op(cFlat11, 0); op(knock1, 0); op(knock2, 0);
    if (sC1) {
      setText(cor.plate, '#03-01');
      const dp = P(t, end('inspect') + 0.02, 0.35, ease);
      cor.door.set(dp); op(doorInside, dp > 0.01 ? 1 : 0);
      vis.silas = 1; tr(silas, 330, 490, 1.1);
      silas.set({ t, talk: scTalk(S, t, 'silas'), mood: 'deadpan', look: 0.75 });
      op(clip, 1); tr(clip, 196, 525, 0.5, -6);
      popIn(cFlat11, t, mid('inspect', 0.5), 300, 180);
      popIn(cPlate, t, mid('inspect', 0.25), 860, 130);
      const k1 = mid('inspect', 0.15), k2 = mid('inspect', 0.32);
      [[knock1, k1, 560, 330, -8], [knock2, k2, 650, 420, 7]].forEach(([el, t0, x, y, r]) => { const p = P(t, t0, 0.3, pop); op(el, t > t0 ? clamp(p * 3) * (1 - P(t, end('inspect') - 0.1, 0.2, linear)) : 0); tr(el, x, y, Math.max(0.01, 0.6 + 0.4 * p), r); });
    }

    /* ---------- oil flat: Sonny ---------- */
    ltSonny.set(sO1 ? win(t, at('sonny') + 0.1, at('sonny') + 3.2, 0.3) : 0);
    op(mindOil, 0);
    if (sO1) {
      vis.sonny = 1;
      tr(sonny, 500, 380 + 14 * Math.sin(t * 1.4) * AMP, 1.35, 6 * Math.sin(t * 1.1) * AMP);
      sonny.set({ t, talk: scTalk(S, t, 'sonny'), mood: 'happy', look: 0.6 });
      const sp = P(t, mid('sonny', 0.78), 0.55, ease);
      vis.silas = 1; tr(silas, 1050 - 120 * sp, 470 - 45 * Math.sin(sp * Math.PI), 0.95);
      silas.set({ t, talk: 0, mood: 'deadpan', look: sp > 0.95 ? 0 : -0.6 });
      op(clip, 1); tr(clip, 1050 - 120 * sp - 110, 500 - 45 * Math.sin(sp * Math.PI), 0.45, -8);
      const mp = win(t, mid('sonny', 0.75), end('sonny') + 0.4, 0.15); op(mindOil, mp); tr(mindOil, 960, 615);
    }

    /* ---------- atom: nucleus, charges, electrons, atomic and mass number ---------- */
    op(naG, sA + sM); op(flatOutline, 0); op(plusG, 0); op(pRing, 0); op(nRing, 0); op(outerGlow, 0);
    [leadP, leadN, cAtom, cNuc, cProt, cNeut, cProtC, cNeutC, lazy, cElec, cAN, big11, big11L, cWhich, cMN, eq, cLight].forEach(e => op(e, 0));
    na.ring.forEach(r => op(r, 1));
    if (sA) {
      let c = [600, 410, 1.1];
      c = camLerp(c, [560, 400, 3.3], P(t, mid('nucleus', 0.42), 0.7, ease));
      c = camLerp(c, [600, 420, 1.1], P(t, at('electrons') - 0.1, 0.7, ease));
      c = camLerp(c, [360, 420, 1.0], P(t, at('atomicno') - 0.1, 0.5, ease));
      const [cx, cy, k] = c;
      tr(naG, cx, cy, k);
      const ring = P(t, at('electrons'), 0.5, linear);
      na.ring.forEach(r => op(r, 0.25 + 0.75 * ring));
      const ne = Math.floor(11.999 * P(t, at('electrons') + 0.3, 2.3, linear));
      na.set(ne); na.spin(t);
      op(flatOutline, win(t, at('nucleus') - 0.1, mid('nucleus', 0.42), 0.25));
      popIn(cAtom, t, mid('nucleus', 0.05), 600, 135);
      op(cAtom, 1 - P(t, mid('nucleus', 0.42), 0.2, linear));
      popIn(cNuc, t, mid('nucleus', 0.52), 600, 140);
      op(cNuc, Math.min(P(t, mid('nucleus', 0.52), 0.2, linear), 1 - P(t, end('nucleus'), 0.2, linear)));
      const sxy = b => [cx + k * b.x, cy + k * b.y];
      const [ppx, ppy] = sxy(PB), [nnx, nny] = sxy(NBr);
      // labels: nucleus line, then charges
      const showPN = t > mid('nucleus', 0.7) && t < at('electrons') - 0.1;
      if (showPN) {
        const charges = t >= at('charges') - 0.1;
        const pxL = 250, pyL = 250, nxL = charges ? 250 : 950, nyL = charges ? 560 : 560;
        popIn(cProt, t, mid('nucleus', 0.7), pxL, pyL); popIn(cNeut, t, mid('nucleus', 0.86), 950, 560);
        if (charges) { op(cProt, 0); op(cNeut, 0); popIn(cProtC, t, mid('charges', 0.02), pxL, pyL); popIn(cNeutC, t, mid('charges', 0.32), nxL, nyL); }
        const pv = charges ? P(t, mid('charges', 0.02), 0.2, linear) : P(t, mid('nucleus', 0.7), 0.2, linear);
        const nv = charges ? P(t, mid('charges', 0.32), 0.2, linear) : P(t, mid('nucleus', 0.86), 0.2, linear);
        op(leadP, pv); attr(leadP, 'x1', pxL); attr(leadP, 'y1', pyL + 28); attr(leadP, 'x2', ppx); attr(leadP, 'y2', ppy);
        op(leadN, nv); attr(leadN, 'x1', nxL + (charges ? 60 : -60)); attr(leadN, 'y1', nyL - 28); attr(leadN, 'x2', nnx); attr(leadN, 'y2', nny);
        op(plusG, charges ? P(t, mid('charges', 0.05), 0.3, linear) : 0);
      }
      // the lazy neutron on the bathroom scale
      if (t > mid('charges', 0.55) && t < at('electrons') - 0.1) {
        popIn(lazy, t, mid('charges', 0.58), 940, 300);
        lazyFace.set({ mood: 'deadpan', talk: 0, look: 0, blink: scBlink(t, 6) });
        setText(scRead, t > mid('charges', 0.8) ? '+1' : '0');
      }
      if (t > at('charges') - 0.1 && t < at('electrons') - 0.1) {
        vis.silas = 1; tr(silas, 1085, 625, 0.62);
        silas.set({ t, talk: scTalk(S, t, 'silas'), mood: 'deadpan', look: -0.6 });
      }
      // electrons
      popIn(cElec, t, mid('electrons', 0.3), 600, 140);
      op(cElec, Math.min(P(t, mid('electrons', 0.3), 0.2, linear), 1 - P(t, at('atomicno') - 0.1, 0.2, linear)));
      // atomic number: protons blink one by one, count to 11
      if (t > at('atomicno') - 0.1) {
        vis.silas = 1; tr(silas, 1085, 625, 0.62); silas.set({ t, talk: scTalk(S, t, 'silas'), mood: 'deadpan', look: -0.6 });
        const am = t < at('massno') - 0.1;
        popIn(cAN, t, at('atomicno') + 0.05, 600, 140); if (!am) op(cAN, 0);
        const t0 = mid('atomicno', 0.2), np = clamp(Math.floor((t - t0) / 0.16) + 1, 0, 11);
        if (am && t > t0) { attr(pRing, 'd', atmRingD(PL, np)); op(pRing, 0.6 + 0.4 * wave(t, 0.6)); }
        if (am) {
          setText(big11, String(t > t0 ? np : 0));
          op(big11, P(t, t0 - 0.1, 0.2, linear)); op(big11L, P(t, t0 - 0.1, 0.2, linear));
          const bs = 1 + 0.08 * (t > t0 && np < 11 ? wave(t - t0, 0.16) : 0);
          big11.setAttribute('transform', `translate(880 370) scale(${bs.toFixed(3)}) translate(-880 -370)`);
          popIn(cWhich, t, mid('atomicno', 0.66), 870, 590);
        } else {
          popIn(cMN, t, at('massno') + 0.05, 600, 140);
          const shows = [mid('massno', 0.18), mid('massno', 0.3), mid('massno', 0.4), mid('massno', 0.5), mid('massno', 0.56)];
          op(eq, 1);
          EQ.forEach((g, i) => { const p = P(t, shows[i], 0.35, pop); op(g, clamp(p * 3)); g.setAttribute('transform', `translate(${EQ_X[i]} 400) scale(${Math.max(0.01, 0.6 + 0.4 * p).toFixed(3)}) translate(${-EQ_X[i]} -400)`); });
          if (t > shows[0]) { attr(pRing, 'd', atmRingD(PL, 11)); op(pRing, 0.9); }
          const nn = clamp(Math.floor((t - shows[2] + 0.3) / 0.03) + 1, 0, 12);
          if (nn > 0) { attr(nRing, 'd', atmRingD(NL, nn)); op(nRing, 0.9); }
          const lt = mid('massno', 0.74);
          popIn(cLight, t, lt, 870, 590);
          na.e.forEach(e => { if (t > lt) op(e.el, 0.35 + 0.25 * wave(t, 0.8)); });
        }
      }
    }

    /* ---------- Kavya: 23 neutrons? ---------- */
    op(note, sB); op(pen, sB);
    if (sB) {
      vis.kav = 1;
      const k = 1 + 0.05 * P(t, end('guess'), 0.8, ease);
      tr(kav, 330, 528, 1.25 * k);
      kav.set({ t, talk: scTalk(S, t, 'kavya'), mood: t < end('guess') ? 'happy' : 'smug', look: t < mid('guess', 0.9) ? 0.8 : 0 });
      const str = '23 neutrons?', n = Math.floor(str.length * P(t, at('guess') - 0.05, 1.5, linear));
      setText(noteTxt, str.slice(0, n));
      const w = n * 21;
      tr(pen, 790 - 140 + w + 12, 650 - 30 + 6 * Math.sin(t * 25) * (n < str.length ? 1 : 0), 1, 24);
    }

    /* ---------- whiteboard: 23 − 11 = 12 ---------- */
    op(board, sW);
    if (sW) {
      vis.silas = 1; tr(silas, 170, 600, 0.95);
      silas.set({ t, talk: scTalk(S, t, 'silas'), mood: 'deadpan', look: t < end('subtract') ? 0.7 : 0 });
      const xp = P(t, at('subtract') + 0.15, 0.3, pop); op(stickyX, clamp(xp * 3)); tr(stickyX, 0, 0, Math.max(0.01, xp));
      op(bHead, P(t, mid('subtract', 0.12), 0.3, linear));
      const sh = [0.3, 0.4, 0.5, 0.62, 0.72];
      BP.forEach((el, i) => op(el, P(t, mid('subtract', sh[i]), 0.2, linear)));
      const np = P(t, mid('subtract', 0.82), 0.4, pop); op(bNeut, clamp(np * 3));
      bNeut.setAttribute('transform', `translate(680 480) scale(${Math.max(0.01, 0.7 + 0.3 * np).toFixed(3)}) translate(-680 -480)`);
    }

    /* ---------- oil flat: the charges cancel ---------- */
    op(plus11, 0); op(minus11, 0); op(zero, 0); op(cNeutral, 0);
    if (sO2) {
      vis.sonny = 1;
      const wave_ = Math.sin(t * 5) * 10 * AMP;
      tr(sonny, 900, 390 + 12 * Math.sin(t * 1.4) * AMP, 1.3, wave_);
      sonny.set({ t, talk: scTalk(S, t, 'sonny'), mood: 'happy', look: t < mid('neutral', 0.5) ? -0.6 : 0 });
      const mp = P(t, mid('neutral', 0.55), 0.35, easeIn);
      const a = P(t, mid('neutral', 0.12), 0.4, pop), b = P(t, mid('neutral', 0.3), 0.4, pop);
      op(plus11, clamp(a * 3) * (1 - mp)); tr(plus11, 340 - 0 * mp, lerp(260, 380, mp), Math.max(0.01, 0.6 + 0.4 * a));
      op(minus11, clamp(b * 3) * (1 - mp)); tr(minus11, 340, lerp(500, 380, mp), Math.max(0.01, 0.6 + 0.4 * b));
      const zp = P(t, mid('neutral', 0.55) + 0.3, 0.4, pop);
      op(zero, clamp(zp * 3)); tr(zero, 340, 400, Math.max(0.01, 0.5 + 0.5 * zp));
      popIn(cNeutral, t, mid('neutral', 0.9), 420, 600);
    }

    /* ---------- corridor: flat six, carbon-12 and carbon-14 ---------- */
    op(atC12G, 0); op(atC14G, 0); [cP12, cP14, cN12, cN14, cIso, cIso2, cIso3, plateRing].forEach(e => op(e, 0));
    if (sC2) {
      setText(cor.plate, 'FLAT 6');
      cor.door.set(1); op(doorInside, 1); attr(doorInside, 'fill', '#3A3F46');
      const iso = t >= at('isotopes') - 0.1;
      const cp = P(t, at('carbon') + 0.05, 0.4, pop);
      vis.c12 = vis.c14 = 1;
      tr(carb12, 528, 525, Math.max(0.01, 0.86 * cp)); tr(carb14, 674, 525, Math.max(0.01, 0.86 * cp));
      const look12 = iso ? 0.2 : (t > mid('carbon', 0.7) ? 0.7 : -0.5), look14 = iso ? -0.2 : (t > mid('carbon', 0.7) ? -0.7 : 0.5);
      carb12.set({ t, mood: t > mid('carbon', 0.85) && !iso ? 'neutral' : 'happy', look: look12 });
      carb14.set({ t, mood: t > mid('carbon', 0.85) && !iso ? 'smug' : 'happy', look: look14 });
      const ap = P(t, mid('carbon', 0.18), 0.45, pop);
      op(atC12G, clamp(ap * 3)); op(atC14G, clamp(ap * 3));
      tr(atC12G, 205, 320, Math.max(0.01, 1.05 * (0.6 + 0.4 * ap))); tr(atC14G, 995, 320, Math.max(0.01, 1.05 * (0.6 + 0.4 * ap)));
      atC12.spin(t); atC14.spin(t);
      popIn(cP12, t, mid('carbon', 0.45), 205, 150); popIn(cP14, t, mid('carbon', 0.47), 995, 150);
      popIn(cN12, t, mid('carbon', 0.72), 205, 505); popIn(cN14, t, mid('carbon', 0.86), 995, 505);
      if (iso) {
        popIn(cIso, t, at('isotopes') + 0.1, 600, 250);
        popIn(cIso2, t, mid('isotopes', 0.4), 600, 320);
        popIn(cIso3, t, mid('isotopes', 0.7), 600, 388);
        op(plateRing, P(t, mid('isotopes', 0.66), 0.2, linear) * (0.6 + 0.4 * wave(t, 0.7)));
      }
    }

    /* ---------- shells fill 2, 8, 8 ---------- */
    op(arG, sS); SH.forEach(g => op(g, 0)); op(cInside, 0);
    if (sS) {
      tr(arG, AX, AY, AK);
      const f = (a, b, n0, n1) => n0 + Math.floor((n1 - n0 + 0.999) * P(t, mid('shells', a), mid('shells', b) - mid('shells', a), linear));
      let n = 0;
      if (t > mid('shells', 0.08)) n = f(0.08, 0.3, 0, 2);
      if (t > mid('shells', 0.42)) n = f(0.42, 0.62, 2, 10);
      if (t > mid('shells', 0.7)) n = f(0.7, 0.9, 10, 18);
      ar.set(Math.min(18, n)); ar.spin(t);
      popIn(cInside, t, at('shells') + 0.05, 600, 140);
      [0.3, 0.6, 0.88].forEach((m, i) => { const p = P(t, mid('shells', m), 0.4, pop); op(SH[i], clamp(p * 3)); });
      vis.silas = 1; tr(silas, 1090, 640, 0.6);
      silas.set({ t, talk: scTalk(S, t, 'silas'), mood: 'deadpan', look: -0.7 });
    }

    /* ---------- mine: 2, 8, 1 ---------- */
    op(conf281, 0); op(cGrab, 0);
    if (sM) {
      tr(naG, 430, 420, 1.05); na.set(11); na.spin(t);
      na.ring.forEach(r => op(r, 1));
      const o = na.outer[0], a = o.a0 + t * (0.24 - o.k * 0.05);
      const wob = 7 * Math.sin(t * 11) * AMP * P(t, mid('mine', 0.45), 0.3, linear);
      tr(o, Math.cos(a) * o.R + wob, Math.sin(a) * o.R - wob * 0.6, 1 + 0.25 * P(t, mid('mine', 0.45), 0.3, linear));
      op(outerGlow, P(t, mid('mine', 0.45), 0.3, linear) * (0.7 + 0.3 * wave(t, 0.5)));
      popIn(conf281, t, at('mine') + 0.15, 430, 140);
      popIn(cGrab, t, mid('mine', 0.55), 860, 640);
      vis.sonny = 1; tr(sonny, 950, 400, 1.15);
      sonny.set({ t, talk: scTalk(S, t, 'sonny'), mood: t > mid('mine', 0.5) ? 'shock' : 'happy', look: -0.6 });
    }

    /* ---------- flyer ---------- */
    op(sign, sF);
    if (sF) {
      setText(cor.plate, '#03-01'); cor.door.set(0);
      tr(sign, 300, 520, 1, -6);
      vis.sonny = 1;
      const hope = t > end('flyer') ? 'sad' : 'happy';
      tr(sonny, 600, 455 + 6 * Math.sin(t * 3) * AMP, 1.05);
      const hx = harold, hp = (t - at('flyer') + 0.3) / 3.2, ep = (t - at('flyer') - 0.6) / 2.6;
      const lookTo = x => clamp((x - 600) / 300, -1, 1);
      const hX = lerp(-120, 1320, clamp(hp)), eX = lerp(-160, 1360, clamp(ep));
      sonny.set({ t, talk: scTalk(S, t, 'sonny'), mood: hope, look: t < at('flyer') + 1.4 ? lookTo(hX) : lookTo(eX) });
      // hold the electron out like a flyer, towards whoever is passing
      const reach = lookTo(t < at('flyer') + 1.4 ? hX : eX);
      tr(sonny.electron, 122 * (reach >= 0 ? 1 : -1), -8 + 5 * Math.sin(t * 7) * AMP, 1.7);
      op(sonny.orbit, 0.25);
      if (hp > 0 && hp < 1) { vis.harold = 1; tr(hx, hX, 560 - Math.abs(Math.sin(t * 7)) * 6, 0.78); harold.set({ t, mood: 'sad', look: 0.6 }); }
      if (ep > 0 && ep < 1) { vis.helena = 1; tr(helena, eX, 300, 0.72); helena.set({ t, mood: 'smug', look: 0.9 }); }
    } else op(sonny.orbit, 1);

    /* ---------- confessional: the flyer guy at the MRT ---------- */
    op(insetCam, sTH);
    if (sTH) {
      const k = (1 + 0.03 * P(t, cTH, 3, linear)) * (1 + 0.1 * P(t, end('thflyer') - 0.2, 1.6, ease));
      camBg(confShot, k, 430, 380); camBg(insetCam, k, 430, 380);
      vis.silas = 1; tr(silas, 430, 380 + 20 * k, 1.5 * k);
      silas.set({ t, talk: scTalk(S, t, 'silas'), mood: 'deadpan', look: t > mid('thflyer', 0.55) && t < mid('thflyer', 0.85) ? 0.7 : 0 });
      const ip = P(t, mid('thflyer', 0.45), 0.45, pop);
      op(inset, clamp(ip * 3)); tr(inset, 900, 320, Math.max(0.01, 0.6 + 0.4 * ip));
      popIn(cMrt, t, mid('thflyer', 0.62), 900, 540);
      walkers.forEach((w, i) => { const x = ((t * 55 + i * 210) % 470) - 235, sw = 16 * Math.sin((t + i * 0.4) * TAU * 1.1); tr(w, x, 150, 0.72); attr(w.legs, 'd', `M0,-70 L${sw.toFixed(1)},-4 M0,-70 L${(-sw).toFixed(1)},-4`); });
      tr(flyerGuy, -70, 140, 0.8, 3 * Math.sin(t * 6) * AMP);
    }

    op(silas, vis.silas); op(sonny, vis.sonny); op(kav, vis.kav); op(carb12, vis.c12); op(carb14, vis.c14); op(harold, vis.harold); op(helena, vis.helena);
  };
});
