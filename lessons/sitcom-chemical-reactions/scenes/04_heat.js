/* Scene 4: The heat round.
   round: kitchen wide, "ROUND 4: HEAT", energy OUT / energy IN
   exo / exit / endo: Arrow beside a judge's panel: EXOTHERMIC (thermometer up; burning, neutralisation, hand warmers),
     EXO = EXIT (heat leaves through the door), ENDOTHERMIC (thermometer down), ENDO = ENTER
   warmer: Ferris (rust 0.45) with a hand warmer, on fast-forward; his rust flickers
   pack / nocold: Kavya's cold pack; Arrow on the judge cam: heat flows OUT of the hand INTO the pack
   main / methane / blue: MAIN EVENT: COMBUSTION; the gas hob, methane + oxygen -> carbon dioxide + water, a clean blue flame
   limited: the oxygen valve closes (Olly squashed out), yellow sooty flame, the lights dim
   monty / toxic / alarm: Monty fades in from the smoke; TOXIC (padlocked red blood cell); the CO alarm goes off
   bunsen / open: Kavya's Bunsen: air hole closed = yellow, twist it open = blue. */
scene('heat', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;
  const talk = (t, w) => scTalk(S, t, w);

  /* ---------- helpers (prefixed ht) ---------- */
  function htCam(k, fx, fy, sx, sy) { return { k, fx, fy, sx: clamp(sx, 1200 - k * (1200 - fx), k * fx), sy: clamp(sy, 750 - k * (750 - fy), k * fy) }; }
  const CAM0 = { k: 1, fx: 600, fy: 375, sx: 600, sy: 375 };
  const htSetCam = (el, c) => el.setAttribute('transform', `translate(${c.sx.toFixed(1)} ${c.sy.toFixed(1)}) scale(${c.k.toFixed(4)}) translate(${(-c.fx).toFixed(1)} ${(-c.fy).toFixed(1)})`);
  const htSp = (c, x, y) => [c.sx + c.k * (x - c.fx), c.sy + c.k * (y - c.fy)];
  function htPop(el, t, t0, x, y, s, r) { const p = P(t, t0, 0.45, pop); op(el, clamp(p * 2.5)); tr(el, x, y, Math.max(0.01, (s || 1) * (0.6 + 0.4 * p)), r); return p; }
  function htLabel(parent, text, o) { o = o || {}; return chip(parent, text, { size: o.size || 30, fill: o.fill || 'rgba(10,27,39,0.9)', stroke: o.stroke || C.line, sw: 3, color: o.color || C.ink, weight: o.weight || 700 }); }
  function htSeat(ch, layer) { if (ch.parentNode !== layer) layer.appendChild(ch); }
  function htPanel(parent, title, sub, col) {
    const g = G(parent), w = Math.max(textWidth(title, 50, FD, 800), textWidth(sub, 30, FD, 700)) + 90;
    E('rect', { x: -w / 2, y: -88, width: w, height: 176, rx: 24, fill: '#1A0F2A', stroke: col, 'stroke-width': 5 }, g);
    T(g, 0, -24, title, { size: 50, weight: 800, anchor: 'middle', fill: '#FFF1C4', ls: 2 });
    g.sub = G(g);
    chip(g.sub, sub, { size: 30, fill: 'rgba(255,255,255,0.06)', stroke: col, sw: 3, color: col, weight: 700 });
    tr(g.sub, 0, 44);
    return g;
  }
  // a single flickering flame tongue, base at (0,0); g.upd(t)
  function htFlame(parent, h) {
    const g = G(parent);
    const o = E('path', { fill: '#FF6A2A', stroke: '#FFB03A', 'stroke-width': 3 }, g), i = E('path', { fill: '#FFE45C' }, g);
    const tongue = (hh, ww, sw) => `M${-ww},0 Q${(-ww * 0.9 + sw * 0.3).toFixed(1)},${(-hh * 0.55).toFixed(1)} ${sw.toFixed(1)},${(-hh).toFixed(1)} Q${(ww * 0.9 + sw * 0.3).toFixed(1)},${(-hh * 0.55).toFixed(1)} ${ww},0 Z`;
    g.upd = t => { const k = 1 + 0.12 * Math.sin(t * 9 * AMP), sw = 6 * Math.sin(t * 6 * AMP); attr(o, 'd', tongue(h * k, h * 0.32, sw)); attr(i, 'd', tongue(h * 0.55 * k, h * 0.17, sw * 1.4)); };
    g.upd(0);
    return g;
  }
  // a hand-warmer pouch
  function htPouch(parent) {
    const g = G(parent);
    E('rect', { x: -48, y: -62, width: 96, height: 124, rx: 18, fill: ball('#FF8A5C', '#C2453A'), stroke: SC_INK, 'stroke-width': 4 }, g);
    E('path', { d: 'M-40,-50 L40,-50 M-40,50 L40,50', stroke: '#FFD0B8', 'stroke-width': 3, 'stroke-dasharray': '6 6' }, g);
    T(g, 0, 10, 'HEAT', { size: 26, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
    return g;
  }
  function htSnow(parent, r, col) {
    const g = G(parent); let d = '';
    for (let i = 0; i < 3; i++) { const a = i * Math.PI / 3, c = Math.cos(a) * r, s = Math.sin(a) * r; d += `M${(-c).toFixed(1)},${(-s).toFixed(1)} L${c.toFixed(1)},${s.toFixed(1)} `; }
    E('path', { d, stroke: col || '#BFE9FF', 'stroke-width': Math.max(3, r * 0.22), 'stroke-linecap': 'round' }, g);
    return g;
  }
  function htSign(parent, text, col) {
    const g = G(parent), w = textWidth(text, 32, FD, 800) + 40;
    E('rect', { x: -w / 2, y: -26, width: w, height: 52, rx: 8, fill: col, stroke: '#FFFFFF', 'stroke-width': 4 }, g);
    T(g, 0, 12, text, { size: 32, weight: 800, anchor: 'middle', fill: '#FFFFFF', ls: 2 });
    return g;
  }
  // a heat chevron (an orange ">" pointing along +x)
  function htChev(parent, col) { const g = G(parent); E('path', { d: 'M-12,-18 L8,0 L-12,18', fill: 'none', stroke: col || C.heat, 'stroke-width': 9, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g); return g; }

  /* ---------- layers ---------- */
  const Lbg = G(root), Lcast = G(root), Lfront = G(root), Lon = G(root), Ldim = G(root), Lstar = G(root), Lfg = G(root), Lhud = G(root);

  /* ---------- sets ---------- */
  const kitchen = tkKitchen(Lbg);
  const lab = tkLab(Lbg);
  const counter = tkCounter(Lfront);
  const bench = tkBench(Lfront);
  bench.rack.remove();   // not needed in this scene (saves elements)
  const dim = E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#05020C' }, Ldim);
  const redFlash = E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#FF2030' }, Ldim);

  /* ---------- cast ---------- */
  const olly = cast(Lcast, 'olly');
  const ferris = cast(Lcast, 'ferris');
  const arrowC = cast(Lcast, 'arrow');
  const monty = cast(Lcast, 'monty');
  const kav = cast(Lcast, 'kavya', { mood: 'neutral' });
  const kat = cast(Lon, 'kat');
  const BY = { olly, ferris, arrow: arrowC, monty, kavya: kav, kat };
  const hob = tkHob(Lon, 1);
  const bn = bunsen(Lon, 1.25);
  // the Bunsen's collar with its air hole
  const bnIn = bn.firstChild, collar = G(bnIn);
  E('rect', { x: -19, y: -50, width: 38, height: 32, rx: 4, fill: linGrad('#B9C6D2', '#6E7A86'), stroke: SC_INK, 'stroke-width': 3 }, collar);
  const hole = E('rect', { x: -9, y: -43, width: 18, height: 18, rx: 4, fill: '#101018' }, collar);
  const airIn = G(bnIn);
  [-38, -26].forEach((y, i) => { const a = arrow(airIn, -78 - i * 6, y + 4, -26, -34, { color: '#8AD8FF', width: 4 }); void a; });

  /* ---------- round / main panels ---------- */
  const roundPanel = htPanel(Lfg, 'ROUND 4: HEAT', 'Reactions give out, or take in, energy', '#FF8A3D');
  const eOut = G(Lfg), eIn = G(Lfg);
  htLabel(eOut, 'energy OUT', { color: C.heat, stroke: C.heat, size: 32 });
  [[-150, 0, -205, 0], [150, 0, 205, 0]].forEach(([x1, y1, x2, y2]) => arrow(eOut, x1 - Math.sign(x1) * 50, y1, x2, y2, { color: C.heat, width: 7 }));
  htLabel(eIn, 'energy IN', { color: '#5AB4FF', stroke: '#5AB4FF', size: 32 });
  [[-205, 0, -140, 0], [205, 0, 140, 0]].forEach(([x1, y1, x2, y2]) => arrow(eIn, x1, y1, x2, y2, { color: '#5AB4FF', width: 7 }));
  const mainPanel = htPanel(Lfg, 'MAIN EVENT: COMBUSTION', 'fuel + oxygen → energy released', C.energy);

  /* ---------- the judge's panel (exo / exit / endo) ---------- */
  const panel = G(Lfg);
  E('rect', { x: 560, y: 125, width: 610, height: 450, rx: 24, fill: 'rgba(14,10,30,0.9)', stroke: '#45357A', 'stroke-width': 4 }, panel);
  // EXOTHERMIC
  const exoG = G(panel);
  T(exoG, 840, 192, 'EXOTHERMIC', { size: 58, weight: 800, anchor: 'middle', fill: C.heat });
  const exo1 = T(exoG, 840, 246, 'gives OUT heat', { size: 36, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  const exo2 = T(exoG, 840, 292, 'surroundings get HOTTER', { size: 32, weight: 700, anchor: 'middle', fill: '#FFD0A8' });
  const thExo = thermometer(panel, 150, C.bad); tr(thExo, 1118, 300);
  const thBulb = thExo.children[1], thCol = thExo.children[2];
  const exoIc = [G(exoG), G(exoG), G(exoG)];
  const exFlame = htFlame(exoIc[0], 90); tr(exFlame, 0, 40);
  const exBk = beaker(exoIc[1], 96, 104, { level: 0.6, liquid: '#BFE3FF', marks: false });
  T(exoIc[1], 0, 114, '(acid + alkali)', { size: 26, weight: 700, anchor: 'middle', fill: '#BFE3FF' });
  void exBk;
  const exPouch = htPouch(exoIc[2]); tr(exPouch, 0, -4, 0.85);
  ['burning', 'neutralisation', 'hand warmers'].forEach((s, i) => T(exoIc[i], 0, 86, s, { size: 26, weight: 700, anchor: 'middle', fill: C.muted }));
  const exWaves = exoIc.map(g => { const w = heatWaves(g, { n: 3, h: 60, spacing: 22 }); tr(w, 0, -62); return w; });
  // EXO = EXIT
  const exitG = G(panel);
  T(exitG, 840, 192, 'EXO = EXIT', { size: 58, weight: 800, anchor: 'middle', fill: C.heat });
  T(exitG, 840, 244, 'energy exits, so it gets warmer', { size: 30, weight: 700, anchor: 'middle', fill: '#FFD0A8' });
  E('line', { x1: 590, y1: 520, x2: 1140, y2: 520, stroke: '#45357A', 'stroke-width': 5 }, exitG);
  E('rect', { x: 990, y: 336, width: 110, height: 184, fill: '#0B0716', stroke: '#9FB0BF', 'stroke-width': 6 }, exitG);
  E('path', { d: 'M990,336 L948,356 L948,512 L990,520 Z', fill: '#6B4A2E', stroke: SC_INK, 'stroke-width': 3 }, exitG);
  const exitSign = htSign(exitG, 'EXIT', '#1E9E5A'); tr(exitSign, 1045, 302);
  const exitBk = beaker(exitG, 90, 100, { level: 0.55, liquid: '#FFD7A0', marks: false }); tr(exitBk, 700, 468);
  const exitChev = [0, 1, 2, 3].map(() => htChev(exitG));
  // ENDOTHERMIC
  const endoG = G(panel);
  T(endoG, 840, 192, 'ENDOTHERMIC', { size: 58, weight: 800, anchor: 'middle', fill: '#5AB4FF' });
  const endo1 = T(endoG, 840, 246, 'takes IN heat', { size: 36, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  const endo2 = T(endoG, 840, 292, 'surroundings get COLDER', { size: 32, weight: 700, anchor: 'middle', fill: '#BFE3FF' });
  const endoD = G(endoG);
  const enterSign = htSign(endoD, 'ENTER', '#2C6FD1'); tr(enterSign, 850, 352);
  const endoBk = beaker(endoD, 90, 100, { level: 0.55, liquid: '#BFE3FF', marks: false }); tr(endoBk, 850, 455);
  const endoChev = [0, 1, 2, 3].map(() => htChev(endoD));
  const endoEq = T(endoD, 850, 548, 'ENDO = ENTER', { size: 40, weight: 800, anchor: 'middle', fill: '#5AB4FF' });

  /* ---------- Ferris and the hand warmer ---------- */
  const fPouch = htPouch(Lfg);
  const fWaves = heatWaves(fPouch, { n: 3, h: 60, spacing: 22 }); tr(fWaves, 0, -66);
  const ffIcon = G(Lfg);
  E('rect', { x: -110, y: -50, width: 220, height: 100, rx: 18, fill: 'rgba(10,10,20,0.85)', stroke: '#FFFFFF', 'stroke-width': 4 }, ffIcon);
  E('path', { d: 'M-70,-30 L-20,0 L-70,30 Z M-16,-30 L34,0 L-16,30 Z', fill: '#FFFFFF' }, ffIcon);
  T(ffIcon, 74, 12, '×100', { size: 30, weight: 800, anchor: 'middle', fill: C.energy });
  const chWarm = htLabel(Lfg, 'hand warmer = iron rusting, FAST', { size: 30, color: C.heat, stroke: C.heat });
  const chRust = htLabel(Lfg, 'iron + oxygen → iron oxide + heat', { size: 28 });

  /* ---------- Kavya's cold pack ---------- */
  const armG = G(Lfg);
  E('path', { d: 'M512,640 Q560,568 630,528', fill: 'none', stroke: SC_INK, 'stroke-width': 62, 'stroke-linecap': 'round' }, armG);
  E('path', { d: 'M512,640 Q560,568 630,528', fill: 'none', stroke: '#F6F8FA', 'stroke-width': 54, 'stroke-linecap': 'round' }, armG);
  E('ellipse', { cx: 648, cy: 492, rx: 50, ry: 38, fill: '#B9784E', stroke: SC_INK, 'stroke-width': 4 }, armG);
  E('path', { d: 'M606,478 Q596,450 618,446', fill: 'none', stroke: SC_INK, 'stroke-width': 4 }, armG);
  const pack = G(armG); tr(pack, 655, 452, 1, -8);
  E('rect', { x: -70, y: -34, width: 140, height: 62, rx: 14, fill: ball('#E6F6FF', '#8FC8EA'), stroke: SC_INK, 'stroke-width': 4 }, pack);
  T(pack, 0, 8, 'COLD', { size: 26, weight: 800, anchor: 'middle', fill: '#2C6FD1' });
  const flakes = [[560, 400, 16], [740, 392, 20], [770, 470, 14]].map(([x, y, r]) => { const f = htSnow(Lfg, r); f.base = [x, y]; return f; });
  const chQ = htLabel(Lfg, 'pushing cold IN?', { size: 32, color: '#BFE9FF', stroke: '#5AB4FF' });
  // nocold diagram
  const nc = G(Lfg);
  E('rect', { x: 740, y: 130, width: 430, height: 440, rx: 24, fill: 'rgba(14,10,30,0.9)', stroke: '#45357A', 'stroke-width': 4 }, nc);
  T(nc, 955, 182, 'heat flows OUT of your hand', { size: 30, weight: 800, anchor: 'middle', fill: C.heat });
  T(nc, 955, 222, 'INTO the reaction', { size: 30, weight: 800, anchor: 'middle', fill: C.heat });
  const ncWrong = G(nc); tr(ncWrong, 955, 282);
  htLabel(ncWrong, 'cold going in', { size: 28, color: C.muted });
  const ncX = cross(ncWrong, 16); tr(ncX, 128, 0);
  E('path', { d: 'M842,520 Q842,470 880,466 L1040,466 Q1070,470 1068,520 Z', fill: '#B9784E', stroke: SC_INK, 'stroke-width': 4 }, nc);   // the palm
  E('path', { d: 'M870,470 L870,450 M920,468 L920,446 M970,468 L970,446 M1020,470 L1020,450', stroke: '#8E5A38', 'stroke-width': 4, 'stroke-linecap': 'round' }, nc);
  T(nc, 955, 552, 'your hand', { size: 26, weight: 700, anchor: 'middle', fill: C.muted });
  const ncPack = G(nc); tr(ncPack, 955, 360);
  E('rect', { x: -110, y: -40, width: 220, height: 80, rx: 18, fill: ball('#E6F6FF', '#8FC8EA'), stroke: SC_INK, 'stroke-width': 4 }, ncPack);
  T(ncPack, 0, 10, 'COLD PACK', { size: 28, weight: 800, anchor: 'middle', fill: '#2C6FD1' });
  const ncChev = [0, 1, 2].map(() => htChev(nc));
  // the judge cam: Arrow picture-in-picture
  const pip = G(Lfg);
  const pipClip = E('clipPath', { id: 'htPipClip' }, defs()); E('rect', { x: -115, y: -95, width: 230, height: 190, rx: 14 }, pipClip);
  E('rect', { x: -123, y: -103, width: 246, height: 206, rx: 18, fill: '#1A0F2A', stroke: '#FFD54A', 'stroke-width': 5 }, pip);
  const pipIn = G(pip, { 'clip-path': 'url(#htPipClip)' });
  E('rect', { x: -115, y: -95, width: 230, height: 190, fill: linGrad('#2C1F52', '#3A1745', true) }, pipIn);
  const pipSeat = G(pipIn);
  const pipRec = G(pip); tr(pipRec, -88, -70);
  E('circle', { r: 7, fill: '#FF3B3B' }, pipRec);

  /* ---------- the hob shot ---------- */
  const hBoard = tkBoard(Lfg, 720, 150, null);
  const hEq1 = T(hBoard, 0, -14, 'methane + oxygen →', { size: 40, weight: 800, anchor: 'middle', fill: '#FFF7C2' });
  const hEq2 = T(hBoard, 0, 42, 'carbon dioxide + water', { size: 40, weight: 800, anchor: 'middle', fill: '#FFF7C2' });
  const o2s = [0, 1, 2, 3, 4].map(() => molO2(Lfg, 16, {}));
  const valve = G(Lfg);
  E('rect', { x: -70, y: -10, width: 140, height: 20, rx: 6, fill: '#9FB0BF', stroke: SC_INK, 'stroke-width': 3 }, valve);
  E('rect', { x: -6, y: -40, width: 12, height: 32, fill: '#7D8C99', stroke: SC_INK, 'stroke-width': 2 }, valve);
  const wheel = G(valve); tr(wheel, 0, -44);
  E('circle', { r: 24, fill: 'none', stroke: '#E8424F', 'stroke-width': 7 }, wheel);
  E('path', { d: 'M-24,0 L24,0 M0,-24 L0,24', stroke: '#E8424F', 'stroke-width': 5 }, wheel);
  const valveChip = htLabel(valve, 'oxygen supply', { size: 26 }); tr(valveChip, 0, 46);
  const shut = htLabel(Lfg, 'CLOSED', { size: 28, color: C.bad, stroke: C.bad });
  const hChips = [['plenty of oxygen', C.good], ['complete combustion', C.good], ['incomplete combustion', '#FFB13B'], ['yellow flame', '#FFB13B'], ['less energy', '#FFB13B'], ['soot (carbon)', '#B9C6D2']].map(([s, c]) => htLabel(Lfg, s, { size: 30, color: c, stroke: c }));
  // the blue close-up
  const bChips = [['complete combustion', C.good], ['blue flame', '#5AB4FF'], ['most energy', C.energy]].map(([s, c]) => htLabel(Lfg, s, { size: 32, color: c, stroke: c }));
  const eBar = meter(Lfg, { w: 300, h: 26, color: C.energy });

  /* ---------- Monty ---------- */
  const puffs = [0, 1, 2, 3].map(() => E('circle', { r: 40, fill: '#4A4652' }, Lfg));
  const ltMonty = scLowerThird(Lhud, 'MONTY', 'Carbon monoxide. Not invited.');
  const coCard = G(Lfg);
  E('rect', { x: -150, y: -70, width: 300, height: 140, rx: 20, fill: 'rgba(10,27,39,0.92)', stroke: '#B9C6D2', 'stroke-width': 4 }, coCard);
  T(coCard, 0, 6, 'CO', { size: 64, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  T(coCard, 0, 50, 'carbon monoxide', { size: 28, weight: 700, anchor: 'middle', fill: C.muted });
  const chColour = htLabel(Lfg, 'colourless', { size: 32, color: '#D5DCE3' });
  const chSmell = htLabel(Lfg, 'no smell', { size: 32, color: '#D5DCE3' });
  // toxic
  const toxCard = G(Lfg);
  T(toxCard, 0, 0, 'TOXIC', { size: 62, weight: 800, anchor: 'middle', fill: C.bad, ls: 4 });
  T(toxCard, 0, 48, 'stops your blood carrying oxygen', { size: 30, weight: 700, anchor: 'middle', fill: '#FFFFFF' });
  const rbc = G(Lfg);
  E('ellipse', { rx: 84, ry: 50, fill: ball('#FF6B6B', '#B32635'), stroke: SC_INK, 'stroke-width': 4 }, rbc);
  E('ellipse', { rx: 44, ry: 22, fill: '#B32635', opacity: 0.55 }, rbc);
  T(rbc, 0, 86, 'red blood cell', { size: 26, weight: 700, anchor: 'middle', fill: '#FFB3A8' });
  const lock = G(rbc);
  E('path', { d: 'M-18,-6 L-18,-26 Q-18,-44 0,-44 Q18,-44 18,-26 L18,-6', fill: 'none', stroke: '#C9D3DC', 'stroke-width': 8 }, lock);
  E('rect', { x: -28, y: -8, width: 56, height: 44, rx: 8, fill: '#FFC247', stroke: SC_INK, 'stroke-width': 4 }, lock);
  E('circle', { cx: 0, cy: 12, r: 6, fill: SC_INK }, lock);
  const rbcO2 = molO2(Lfg, 16, {});
  // alarm
  const alarm = tkAlarm(Lfg, 1.1);
  const chAlarm = htLabel(Lfg, 'carbon monoxide alarm', { size: 30, color: '#FFB3A8', stroke: C.bad });

  /* ---------- Bunsen chips ---------- */
  const chClosed = htLabel(Lfg, 'air hole CLOSED', { size: 30 });
  const chOpenH = htLabel(Lfg, 'air hole OPEN', { size: 30, color: '#8AD8FF', stroke: '#8AD8FF' });
  const ptr = arrow(Lfg, 884, 520, 830, 514, { color: '#FFFFFF', width: 5 });
  const chYel = htLabel(Lfg, 'yellow flame: incomplete', { size: 30, color: '#FFB13B', stroke: '#FFB13B' });
  const sum = G(Lfg);
  E('rect', { x: -300, y: -78, width: 600, height: 156, rx: 20, fill: '#0A1B27', stroke: '#5AB4FF', 'stroke-width': 4 }, sum);
  T(sum, 0, -30, 'air hole open → more oxygen', { size: 30, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  T(sum, 0, 16, '→ complete combustion (BLUE)', { size: 30, weight: 800, anchor: 'middle', fill: '#5AB4FF' });
  T(sum, 0, 58, 'closed → incomplete (yellow)', { size: 26, weight: 700, anchor: 'middle', fill: '#FFB13B' });

  /* ---------- cuts ---------- */
  const CUTS = [
    [-1, 'wide', 'round'],
    [at('exo') - 0.08, 'panel', 'exo'],
    [at('warmer') - 0.08, 'ferris', ''],
    [at('exit') - 0.08, 'panel', 'exit'],
    [at('endo') - 0.08, 'panel', 'endo'],
    [at('pack') - 0.08, 'lab', 'pack'],
    [at('nocold') - 0.06, 'lab', 'nocold'],
    [at('main') - 0.08, 'wide', 'main'],
    [at('methane') - 0.08, 'hob', 'methane'],
    [at('blue') - 0.08, 'blue', ''],
    [at('limited') - 0.08, 'hob', 'limited'],
    [end('limited') + 0.3, 'monty', ''],
    [at('toxic') - 0.08, 'toxic', ''],
    [at('alarm') - 0.08, 'alarm', ''],
    [at('bunsen') - 0.08, 'lab', 'bunsen'],
  ];
  const cutAt = t => { let c = CUTS[0]; for (const k of CUTS) if (t >= k[0]) c = k; return c; };
  const FLOAT = [roundPanel, eOut, eIn, mainPanel, panel, fPouch, ffIcon, chWarm, chRust, armG, chQ, nc, pip, hBoard, valve, shut, coCard, chColour, chSmell,
    toxCard, rbc, rbcO2, alarm, chAlarm, chClosed, chOpenH, ptr, chYel, sum, eBar, ...flakes, ...o2s, ...hChips, ...bChips, ...puffs];

  return t => {
    const [c0, shot, setup] = cutAt(t);
    const shown = {};
    const show = (key, x, y, s, st) => { const c = BY[key]; shown[key] = 1; op(c, st.op === undefined ? 1 : st.op); tr(c, x, y, s, st.rot); c.set(Object.assign({ t }, st)); };
    const showW = (key, cam, wx, wy, s, st) => { const [x, y] = htSp(cam, wx, wy); show(key, x, y, s * cam.k, st); };
    FLOAT.forEach(e => op(e, 0));
    ltMonty.set(0);
    [kitchen, counter, lab, bench, hob, bn].forEach(e => op(e, 0));
    op(dim, 0); op(redFlash, 0);
    const lit = shot === 'monty' || shot === 'toxic' || shot === 'alarm';   // Monty (and Arrow) stay lit while the lights are down
    htSeat(arrowC, lit ? Lstar : Lcast); htSeat(monty, lit ? Lstar : Lcast);
    op(kitchen.sign, shot === 'wide' ? 1 : 0);
    const kitOn = cam => { op(kitchen, 1); op(counter, 1); kitchen.upd(t); htSetCam(kitchen, cam); htSetCam(counter, cam); };
    const bounce = Math.abs(Math.sin(t * 3.2)) * 10 * AMP;

    /* ================= KITCHEN WIDE ================= */
    if (shot === 'wide') {
      const cam = htCam(1 + 0.03 * P(t, c0, 5, linear), 640, 420, 640, 420);
      kitOn(cam);
      const main = setup === 'main';
      showW('kat', cam, 150, 556, 0.42, { mood: 'deadpan', still: true });
      showW('olly', cam, 262, 455 - bounce, 0.9, { mood: 'happy', look: 0.6, sparkle: 1 });
      showW('ferris', cam, 482, 478, 0.75, { mood: 'sad', rust: 0.45, look: 0.4 });
      showW('arrow', cam, 760, 470, 1, { mood: 'deadpan', look: main ? -0.6 : 0, talk: talk(t, 'arrow') });
      if (!main) {
        htPop(roundPanel, t, at('round') + 0.05, 600, 205);
        op(roundPanel.sub, P(t, mid('round', 0.4), 0.3, linear));
        htPop(eOut, t, mid('round', 0.62), 250, 322, 0.75);
        htPop(eIn, t, mid('round', 0.82), 1000, 322, 0.75);
      } else {
        htPop(mainPanel, t, at('main') + 0.05, 600, 205);
        op(mainPanel.sub, P(t, mid('main', 0.45), 0.3, linear));
        op(hob, P(t, mid('main', 0.5), 0.3, linear));
        const [hx, hy] = htSp(cam, 610, 598); tr(hob, hx, hy, 0.75 * cam.k); hob.set('blue', t);
      }
    }

    /* ================= ARROW + JUDGE'S PANEL ================= */
    if (shot === 'panel') {
      const cam = htCam(1.3, 300, 470, 300, 450);
      kitOn(cam);
      op(panel, 1);
      op(thExo, setup === 'exit' ? 0 : 1); const thc = setup === 'endo' ? '#5AB4FF' : C.bad; attr(thBulb, 'fill', thc); attr(thCol, 'fill', thc);
      op(exoG, setup === 'exo' ? 1 : 0); op(exitG, setup === 'exit' ? 1 : 0); op(endoG, setup === 'endo' ? 1 : 0);
      const s = setup === 'exit' ? 1.32 : 1.25;
      let mood = 'neutral';
      if (setup === 'exit') mood = t > mid('exit', 0.5) ? 'smug' : 'neutral';
      show('arrow', 300, 452, s, { mood, look: 0.75, talk: talk(t, 'arrow') });
      if (setup === 'exo') {
        op(exo1, P(t, mid('exo', 0.12), 0.3, linear)); op(exo2, P(t, mid('exo', 0.38), 0.3, linear));
        thExo.set(0.15 + 0.8 * P(t, mid('exo', 0.38), 1.5, easeOut));
        [0.6, 0.74, 0.88].forEach((f, i) => { htPop(exoIc[i], t, mid('exo', f), [680, 860, 1050][i], 452); exWaves[i].upd(t); });
        exFlame.upd(t);
      }
      if (setup === 'exit') {
        exitChev.forEach((c, i) => {
          const q = ((t - at('exit')) * 0.45 + i / 4) % 1;
          op(c, t < at('exit') ? 0 : Math.min(1, q * 6, (1 - q) * 4)); tr(c, 760 + q * 400, 450 + 10 * Math.sin(t * 4 + i * 2));
        });
      }
      if (setup === 'endo') {
        op(endo1, P(t, mid('endo', 0.22), 0.3, linear)); op(endo2, P(t, mid('endo', 0.45), 0.3, linear));
        thExo.set(0.85 - 0.75 * P(t, mid('endo', 0.45), 1.5, easeOut));
        op(endoD, P(t, mid('endo', 0.68), 0.3, linear));
        endoChev.forEach((c, i) => {
          const side = i % 2 ? 1 : -1, q = ((t - mid('endo', 0.68)) * 0.5 + Math.floor(i / 2) * 0.5) % 1;
          op(c, Math.min(1, q * 6, (1 - q) * 5)); tr(c, 850 + side * (250 - q * 170), 455, 1, side > 0 ? 180 : 0);
        });
        op(endoEq, P(t, mid('endo', 0.82), 0.3, linear));
      }
    }

    /* ================= FERRIS + HAND WARMER ================= */
    if (shot === 'ferris') {
      const cam = htCam(1.4 + 0.05 * P(t, c0, 6, linear), 420, 470, 400, 440);
      kitOn(cam);
      const ff = mid('warmer', 0.58);
      const flick = t > ff && t < end('warmer') + 0.1 ? 0.3 * Math.abs(Math.sin((t - ff) * 9)) : 0;
      show('ferris', 420, 400, 1.35, { mood: t > end('warmer') + 0.15 ? 'deadpan' : 'sad', rust: 0.45 + flick, talk: talk(t, 'ferris'), look: t > end('warmer') ? 0 : 0.3 });
      op(fPouch, 1); tr(fPouch, 560, 500, 1.05, 8); fWaves.upd(t);
      htPop(chWarm, t, mid('warmer', 0.15), 830, 220);
      htPop(chRust, t, mid('warmer', 0.32), 830, 290);
      if (t > ff) { const p = htPop(ffIcon, t, ff, 840, 420); op(ffIcon, clamp(p * 2.5) * (t < end('warmer') + 0.1 ? (Math.sin(t * 10) > -0.3 ? 1 : 0.4) : 1)); }
    }

    /* ================= THE LAB ================= */
    if (shot === 'lab') {
      op(lab, 1); op(bench, 1); lab.upd(t); htSetCam(lab, CAM0); htSetCam(bench, CAM0);
      if (setup === 'pack' || setup === 'nocold') {
        op(armG, 1);
        flakes.forEach((f, i) => { op(f, 0.9); tr(f, f.base[0], f.base[1] - 6 * Math.sin(t * 2 + i) * AMP, 1, t * 40 * AMP + i * 20); });
        if (setup === 'pack') {
          const f = (t - at('pack')) / (end('pack') - at('pack'));
          const puzzled = f > 0.45;
          show('kavya', 400, 410, 1.3, { mood: puzzled ? 'neutral' : 'happy', talk: talk(t, 'kavya'), look: puzzled ? 0.6 : 0.3, sweat: 0.6, rot: puzzled ? 7 * P(t, mid('pack', 0.45), 0.4, ease) : 0 });
          htPop(chQ, t, mid('pack', 0.55), 880, 330);
        } else {
          show('kavya', 400, 410, 1.3, { mood: t < mid('nocold', 0.6) ? 'shock' : 'neutral', look: 0.7, sweat: 0.6 });
          op(nc, P(t, at('nocold'), 0.2, linear));
          ncChev.forEach((c, i) => {
            const q = ((t - at('nocold')) * 0.6 + Math.floor(i / 3) * 0.5) % 1, x = [895, 955, 1015][i % 3];
            op(c, Math.min(1, q * 6, (1 - q) * 5)); tr(c, x, 460 - q * 70, 1, -90);
          });
          op(ncWrong, P(t, mid('nocold', 0.5), 0.3, linear)); const xp = P(t, mid('nocold', 0.62), 0.3, pop); op(ncX, clamp(xp * 3)); tr(ncX, 128, 0, Math.max(0.01, xp));
          // the judge cam
          op(pip, 1); tr(pip, 178, 218);
          op(pipRec, Math.sin(t * TAU * 0.8) > 0 ? 1 : 0.2);
          htSeat(arrowC, pipSeat);
          shown.arrow = 1; op(arrowC, 1); tr(arrowC, 8, 14, 0.62); arrowC.set({ t, mood: 'deadpan', talk: talk(t, 'arrow'), look: 0.6 });
        }
      } else {
        // the Bunsen, collar closed -> open
        op(bn, 1); tr(bn, 800, 560);
        const tw = mid('open', 0.08), openP = P(t, tw, 0.5, ease), isBlue = t > tw + 0.35;
        bn.set(isBlue ? 'blue' : 'yellow'); bn.upd(t * (isBlue ? 1.6 : 1));
        op(hole, openP); tr(collar, 0, 0); attr(hole, 'width', 18 * openP + 0.01); attr(hole, 'x', -9 * openP);
        op(airIn, isBlue ? 0.5 + 0.5 * Math.sin(t * 8) : 0);
        const f = (t - at('bunsen')) / (end('bunsen') - at('bunsen'));
        const mood = t < at('bunsen') + 0.6 ? 'shock' : t > at('open') ? 'happy' : f > 0.35 ? 'happy' : 'neutral';
        show('kavya', 380, 410, 1.3, { mood, talk: talk(t, 'kavya'), look: 0.8, sweat: 0.5 });
        if (t < tw) {
          htPop(chClosed, t, mid('bunsen', 0.55), 1010, 520); op(ptr, P(t, mid('bunsen', 0.6), 0.3, linear));
          htPop(chYel, t, mid('bunsen', 0.3), 990, 270);
        } else {
          htPop(chOpenH, t, tw + 0.1, 1010, 520); op(ptr, 1);
          htPop(sum, t, mid('open', 0.35), 850, 190);
        }
      }
    }

    /* ================= THE HOB ================= */
    if (shot === 'hob') {
      const lim = setup === 'limited';
      const cam = htCam(1.25 + 0.03 * P(t, c0, 8, linear), 520, 470, 600, 440);
      kitOn(cam);
      showW('kat', cam, 150, 556, 0.42, { mood: 'deadpan', still: true });
      const tClose = mid('limited', 0.05), cl = lim ? P(t, tClose, 0.5, ease) : 0;
      const ox = 330 - 150 * cl, sq = lim ? P(t, tClose + 0.2, 0.3, pop) : 0;
      show('olly', ox, 440 - (lim ? 0 : bounce), 1.1, { mood: lim && t > tClose + 0.1 ? 'shock' : 'happy', talk: talk(t, 'olly'), look: lim ? 0.7 : 0.5, sparkle: lim ? 0 : 1 });
      if (sq > 0) olly.setAttribute('transform', `translate(${ox.toFixed(1)} ${(440 + 26 * sq).toFixed(1)}) scale(${(1.1 * (1 + 0.25 * sq)).toFixed(3)} ${(1.1 * (1 - 0.3 * sq)).toFixed(3)})`);
      op(hob, 1); tr(hob, 660, 598, 1.05); hob.set(lim && t > mid('limited', 0.32) ? 'yellow' : 'blue', t);
      op(valve, 1); tr(valve, 500, 585); tr(wheel, 0, -44, 1, cl * 270);
      op(shut, lim && cl > 0.6 ? 1 : 0); tr(shut, 500, 488);
      // oxygen pouring in (stops when the valve closes)
      o2s.forEach((m, i) => {
        const q = ((t * 0.4) + i / 5) % 1, born = t - q / 0.4;
        const live = !lim || born < tClose;
        const x = lerp(420, 640, q), y = 520 - 70 * Math.sin(Math.PI * q) + 60 * q;
        op(m, live && t > at('methane') + 0.2 ? Math.min(1, q * 6, (1 - q) * 4) : 0); tr(m, x, y, 1, q * 200);
      });
      if (!lim) {
        op(hBoard, 1); tr(hBoard, 640, 205);
        op(hEq1, P(t, mid('methane', 0.6), 0.3, linear)); op(hEq2, P(t, mid('methane', 0.78), 0.3, linear));
        htPop(hChips[0], t, mid('methane', 0.2), 960, 330);
        htPop(hChips[1], t, mid('methane', 0.36), 960, 400);
      } else {
        [0.2, 0.36, 0.52, 0.66].forEach((f, i) => htPop(hChips[2 + i], t, mid('limited', f), 970, 230 + i * 66));
        op(dim, 0.55 * P(t, mid('limited', 0.82), 0.6, linear));
      }
    }

    /* ================= BLUE FLAME CLOSE ================= */
    if (shot === 'blue') {
      const cam = htCam(1.6 + 0.04 * P(t, c0, 3, linear), 680, 520, 640, 430);
      kitOn(cam);
      showW('arrow', cam, 790, 475, 1, { mood: 'neutral', look: -0.7, talk: talk(t, 'arrow') });
      op(hob, 1); const [hx, hy] = htSp(cam, 560, 600); tr(hob, hx, hy, 0.75 * cam.k); hob.set('blue', t);
      htPop(bChips[0], t, at('blue') + 0.05, 300, 170);
      htPop(bChips[1], t, mid('blue', 0.25), 300, 240);
      htPop(bChips[2], t, mid('blue', 0.6), 300, 310);
      op(eBar, P(t, mid('blue', 0.6), 0.3, linear)); tr(eBar, 150, 352); eBar.set(P(t, mid('blue', 0.65), 0.8, easeOut));
    }

    /* ================= MONTY APPEARS ================= */
    if (shot === 'monty') {
      const cam = htCam(1.2 + 0.05 * P(t, c0, 6, linear), 600, 420, 600, 400);
      kitOn(cam);
      op(dim, 0.55);
      const fp = P(t, c0, 1.4, ease);
      show('monty', 610, 400, 1.25, { mood: 'smug', talk: talk(t, 'monty'), look: 0, op: 0.92 * fp });
      puffs.forEach((p, i) => { const q = (t * 0.12 + i / 4) % 1; op(p, 0.5 * Math.sin(Math.PI * q) * (1 - 0.5 * fp)); attr(p, 'r', 40 + 50 * q); tr(p, 610 + (i - 1.5) * 90 + 30 * Math.sin(t * 0.7 + i), 520 - 300 * q); });
      ltMonty.set(win(t, at('monty') + 0.05, at('monty') + 3.3, 0.3));
      htPop(coCard, t, mid('monty', 0.25), 980, 230);
      htPop(chColour, t, mid('monty', 0.5), 980, 400);
      htPop(chSmell, t, mid('monty', 0.78), 980, 470);
    }

    /* ================= TOXIC TWO-SHOT ================= */
    if (shot === 'toxic') {
      const cam = htCam(1.15, 600, 470, 600, 450);
      kitOn(cam);
      op(dim, 0.4);
      show('arrow', 300, 455, 1, { mood: 'annoyed', look: 0.85, talk: talk(t, 'arrow') });
      show('monty', 930, 430, 1, { mood: 'smug', look: -0.8 });
      htPop(toxCard, t, at('toxic') + 0.05, 615, 175);
      htPop(rbc, t, mid('toxic', 0.4), 615, 360);
      const lk = P(t, mid('toxic', 0.6), 0.3, pop); op(lock, clamp(lk * 3)); tr(lock, 0, -60 * (1 - clamp(lk)), Math.max(0.01, lk));
      const bq = ((t - mid('toxic', 0.55)) * 0.7) % 1;
      op(rbcO2, t > mid('toxic', 0.6) ? Math.min(1, bq * 5, (1 - bq) * 4) : 0);
      tr(rbcO2, 615 + 70 - 140 * Math.abs(bq - 0.5) * 2 + 0, 260 + 0 * bq);
    }

    /* ================= THE ALARM ================= */
    if (shot === 'alarm') {
      const cam = htCam(1.2, 600, 420, 600, 400);
      kitOn(cam);
      op(dim, 0.4);
      const on = t > mid('alarm', 0.5) ? 1 : 0;
      const f = (t - at('alarm')) / (end('alarm') - at('alarm'));
      let mood = 'smug', look = 0;
      if (f > 0.3) { look = 0.8; mood = 'deadpan'; }
      if (on) { mood = t > end('alarm') ? 'shock' : 'annoyed'; look = t > end('alarm') ? 0 : 0.6; }
      const jit = on ? Math.sin(t * 40) * 3 * AMP : 0;
      show('monty', 440 + jit, 420, 1.25, { mood, look, talk: talk(t, 'monty') });
      op(alarm, 1); tr(alarm, 900, 230); alarm.set(on, t);
      htPop(chAlarm, t, mid('alarm', 0.4), 900, 380);
      op(redFlash, on ? 0.12 * (Math.sin(t * TAU * 2.2) > 0 ? 1 : 0) : 0);
    }

    Object.keys(BY).forEach(k => { if (!shown[k]) op(BY[k], 0); });
  };
});
