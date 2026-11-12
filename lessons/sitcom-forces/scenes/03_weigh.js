/* Scene 3: The heaviest box (mass & weight, the newtonmeter, Hooke's law).
   Beats: Box 31 thuds down -> Kavya hugging it, "twenty kilograms" -> FORCE-CAM: Rex, "that's its MASS"
   -> mass card: Earth, Moon, space, always 20 kg -> Graham clinging to the box: WEIGHT, a force, newtons
   -> whiteboard W = m x g -> g = 10 N/kg (on his belly), 20 kg x 10 N/kg = ... -> Kavya: 200 N, her arms
   -> "move to the Moon?" thought bubble -> Earth vs Moon split: 200 N vs 32 N, same 20 kg
   -> Graham clinging to Kavya's leg, "one sixth as attached" -> newtonmeter: 200 N, Tess inside it
   -> Tess close-up: extension = new length - original length -> Hooke's law: double the force, double
   the extension -> graph: straight line through the origin -> elastic limit, Tess goes wonky
   -> Tess's confessional: her uncle, the trampoline spring. */
scene('weigh', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;
  const talk = (t, who) => scTalk(S, t, who);

  /* ---------- local helpers (prefixed weigh) ---------- */
  const weighCam = (el, cx, cy, k, px, py) => el.setAttribute('transform', `translate(${(px ?? cx).toFixed(1)} ${(py ?? cy).toFixed(1)}) scale(${k.toFixed(4)}) translate(${(-cx).toFixed(1)} ${(-cy).toFixed(1)})`);
  const weighPop = (el, x, y, p, s, r) => { op(el, clamp(p * 2.5)); tr(el, x, y, Math.max(0.01, (s || 1) * (0.6 + 0.4 * p)), r); };
  const weighPill = (parent, text, o) => { o = o || {}; return chip(parent, text, { size: o.size || 32, fill: o.fill || 'rgba(10,27,39,0.9)', stroke: o.stroke || C.line, sw: o.sw || 2.5, color: o.color || C.ink, weight: o.weight || 700, font: o.font }); };
  // outlined text that reads on any background
  function weighTxt(parent, x, y, str, o) {
    const t = T(parent, x, y, str, o);
    t.setAttribute('stroke', o.halo || '#0A1B27'); t.setAttribute('stroke-width', o.hw || 6); t.setAttribute('paint-order', 'stroke'); t.setAttribute('stroke-linejoin', 'round');
    return t;
  }
  // rubber stamp: g.set(p, x, y, rot) thumps it down
  function weighStamp(parent, text, o) {
    o = o || {};
    const size = o.size || 44, col = o.color || C.bad, g = G(parent);
    const w = textWidth(text, size, FD, 800) + size * 1.2, h = size * 1.6;
    E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: 10, fill: o.fill || 'rgba(24,8,12,0.9)', stroke: col, 'stroke-width': 6 }, g);
    T(g, 0, size * 0.36, text, { size, weight: 800, anchor: 'middle', fill: col, ls: 2 });
    g.set = (p, x, y, rot) => { op(g, clamp(p * 4)); tr(g, x, y, lerp(1.8, 1, easeOut(clamp(p))), rot); };
    return g;
  }
  // FORCE-CAM overlay (as in the cold open): g.set(on, t)
  function weighFcam(parent) {
    const g = G(parent);
    E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#19E68C', opacity: 0.1 }, g);
    let scan = ''; for (let y = 3; y < 750; y += 7) scan += `M0,${y} L1200,${y} `;
    E('path', { d: scan, stroke: '#0A2A1A', 'stroke-width': 2, opacity: 0.18 }, g);
    E('path', { d: 'M40,150 L40,40 L150,40 M1050,40 L1160,40 L1160,150 M1160,600 L1160,710 L1050,710 M150,710 L40,710 L40,600', fill: 'none', stroke: '#7CFFC0', 'stroke-width': 5 }, g);
    E('rect', { x: 900, y: 58, width: 250, height: 56, rx: 12, fill: 'rgba(6,24,16,0.85)' }, g);
    const dot = E('circle', { cx: 926, cy: 86, r: 10, fill: '#FF3B3B' }, g);
    T(g, 946, 98, 'FORCE-CAM', { size: 34, weight: 800, fill: '#7CFFC0' });
    g.set = (v, t) => { op(g, v); op(dot, Math.sin(t * TAU * 0.8) > 0 ? 1 : 0.2); };
    return g;
  }
  // a little clock chip
  function weighClock(parent, label) {
    const g = G(parent);
    E('rect', { x: -112, y: -40, width: 224, height: 80, rx: 18, fill: 'rgba(10,27,39,0.9)', stroke: C.line, 'stroke-width': 2.5 }, g);
    E('circle', { cx: -66, cy: 0, r: 26, fill: '#FFF6E8', stroke: SC_INK, 'stroke-width': 4 }, g);
    E('path', { d: 'M-66,0 L-66,-18 M-66,0 L-80,0', stroke: SC_INK, 'stroke-width': 4, 'stroke-linecap': 'round' }, g);
    T(g, 22, 12, label, { size: 34, weight: 800, anchor: 'middle' });
    return g;
  }
  // a speech-free thought bubble with the Moon inside
  function weighMoon(parent, r) {
    const g = G(parent);
    E('circle', { r, fill: ball('#E8E8E0', '#8E8E86'), stroke: '#5A5A54', 'stroke-width': 3 }, g);
    [[-0.35, -0.3, 0.2], [0.3, 0.1, 0.24], [-0.1, 0.42, 0.14], [0.36, -0.42, 0.1]].forEach(([x, y, k]) => E('circle', { cx: x * r, cy: y * r, r: k * r, fill: '#B4B4AC', stroke: '#8A8A82', 'stroke-width': 2 }, g));
    return g;
  }

  const Lbg = G(root), Lmid = G(root), Lcast = G(root), Lfront = G(root), Lfg = G(root), Lhud = G(root);

  /* ================= the shot list (hard cuts) ================= */
  const SH = [
    ['wide', -1e9], ['hug', at('twenty') - 0.06], ['matter', at('matter') - 0.06], ['weight', at('weight') - 0.06],
    ['board', at('wmg') - 0.06], ['kav', at('arms') - 0.06], ['moon', at('moong') - 0.06], ['cling', at('sixth') - 0.06],
    ['meter', at('meter') - 0.06], ['tess', at('ext') - 0.06], ['graph', at('line') - 0.06], ['uncle', at('uncle') - 0.06],
  ];
  const shotAt = t => { let k = 0; for (let i = 0; i < SH.length; i++) if (t >= SH[i][1]) k = i; return SH[k][0]; };

  /* ================= the old flat (shared by every flat shot) ================= */
  const flatShot = G(Lbg), flatWrap = G(flatShot);
  const flat = ppFlat(flatWrap);
  const tower = G(flatWrap);       // the tower of boxes, back right
  [[930, 600, 'MISC'], [1100, 600, 'MISC'], [1015, 480, 'MISC']].forEach(([x, y, l]) => tr(ppBox(tower, l, { size: 30 }), x, y, 0.85));

  /* ---- shot wide: Box 31 drops ---- */
  const wideG = G(flatWrap);
  const box31 = ppBox(wideG, 'MISC', { size: 34 });
  const dust = G(wideG);
  const puffs = [-1, 1].map(sd => E('ellipse', { rx: 40, ry: 16, fill: '#F2EADB', opacity: 0.8 }, dust));
  const cracks = E('path', { d: 'M470,676 L440,700 L452,716 M650,676 L690,698 L700,722 M560,680 L566,712', fill: 'none', stroke: '#6E5A40', 'stroke-width': 3, 'stroke-linecap': 'round' }, wideG);
  const clockW = weighClock(Lfg, '10:00 AM');
  const box31C = weighPill(Lfg, 'BOX 31', { size: 38, color: C.energy, stroke: C.energy });
  const heavyC = weighPill(Lfg, 'very heavy', { size: 32, color: '#FF9A8F', stroke: '#FF9A8F' });
  const thud = weighTxt(Lfg, 0, 0, 'THUD', { size: 64, weight: 800, anchor: 'middle', fill: '#FFE45C', hw: 10, halo: SC_INK });

  /* ---- shot hug: Kavya hugging the box (twenty, mass) ---- */
  const hugG = G(Lfront);
  const kav = cast(Lcast, 'kavya', { mood: 'annoyed' });
  const hugBox = ppBox(hugG, 'MISC', { size: 34 });
  const hands = [-1, 1].map(() => E('ellipse', { rx: 22, ry: 26, fill: '#B9784E', stroke: SC_INK, 'stroke-width': 4 }, hugG));
  const kgChip = chip(Lfg, '20 kg', { size: 60, fill: '#FFF6D6', color: SC_INK, stroke: '#E0C878', sw: 4 });
  const massStamp = weighStamp(Lfg, 'MASS', { size: 50, color: ppCol.resultant });
  const notW = weighTxt(Lfg, 0, 0, '(not weight)', { size: 30, weight: 700, anchor: 'middle', fill: '#FFD6D6' });

  /* ---- shot matter: the mass card (Earth, Moon, space) ---- */
  const matG = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#0F2233', '#1B3A52', true) }, matG);
  const matHead = T(matG, 600, 168, '**MASS** = amount of matter', { size: 54, weight: 600, anchor: 'middle', boldFill: ppCol.resultant });
  const matSub = T(matG, 600, 222, 'measured in kilograms (kg)', { size: 34, weight: 600, anchor: 'middle', fill: C.muted, font: FB });
  const PANELS = [['on Earth', 270, ['#7CCBF5', '#BDE7FF'], '#5BBF6A'], ['on the Moon', 600, ['#05060C', '#1A1C28'], '#9C9C96'], ['in space', 930, ['#05060C', '#14112A'], null]];
  const panels = PANELS.map(([lbl, x, sky, ground], i) => {
    const g = G(matG);
    E('rect', { x: -145, y: -110, width: 290, height: 220, rx: 16, fill: linGrad(sky[0], sky[1], true), stroke: C.line, 'stroke-width': 3 }, g);
    if (ground) E('path', { d: 'M-145,50 L145,50 L145,94 Q145,110 129,110 L-129,110 Q-145,110 -145,94 Z', fill: ground }, g);
    if (i > 0) { const r = rng(9 + i); let st = ''; for (let k = 0; k < 14; k++) st += `M${(-130 + r() * 260).toFixed(0)},${(-96 + r() * (ground ? 120 : 190)).toFixed(0)} h0.1 `; E('path', { d: st, stroke: '#FFFFFF', 'stroke-width': 4, 'stroke-linecap': 'round', opacity: 0.8 }, g); }
    if (i === 1) { const e = G(g); tr(e, 100, -70); E('circle', { r: 20, fill: ball('#4CA6FF', '#1D5FA6') }, e); E('path', { d: 'M-10,-8 Q0,-14 6,-4 Q2,6 -8,4 Z', fill: '#5BBF6A' }, e); }
    const b = ppBox(g, '', {}); tr(b, 0, i === 2 ? -4 : 2, 0.5, i === 2 ? -14 : 0);
    const kg = weighTxt(g, 0, 160, '20 kg', { size: 40, weight: 800, anchor: 'middle', fill: '#FFF6D6' });
    T(g, 0, -126, lbl, { size: 30, weight: 700, anchor: 'middle', fill: C.ink });
    return { g, x, kg };
  });
  const neverC = chip(Lfg, 'never changes', { size: 40, fill: ppCol.resultant, color: '#0B2A18', stroke: '#FFFFFF', sw: 3 });

  /* ---- shot weight: Graham clinging to the box ---- */
  const wtG = G(flatWrap);
  const wtBox = ppBox(wtG, '', {}); tr(wtBox, 470, 560);
  const wtArrow = ppForce(wtG, { color: ppCol.weight, dir: 'down', label: 'weight', side: 'right' });
  const wtCard = G(Lfg);
  card(wtCard, -260, -150, 520, 300, { fill: 'rgba(10,27,39,0.92)', stroke: ppCol.weight, sw: 4 });
  T(wtCard, 0, -78, 'WEIGHT', { size: 60, weight: 800, anchor: 'middle', fill: ppCol.weight });
  T(wtCard, 0, -18, 'the FORCE of gravity', { size: 34, weight: 700, anchor: 'middle' });
  T(wtCard, 0, 26, 'on the mass', { size: 34, weight: 700, anchor: 'middle' });
  const wtUnit = G(wtCard);
  E('line', { x1: -200, x2: 200, y1: 58, y2: 58, stroke: C.line, 'stroke-width': 3 }, wtUnit);
  T(wtUnit, 0, 112, 'measured in **newtons (N)**', { size: 34, weight: 600, anchor: 'middle', boldFill: C.energy });

  /* ---- shot board: W = m x g, g = 10 N/kg ---- */
  const bdG = G(flatWrap);
  const board = ppWhiteboard(bdG, 720, 380); tr(board, 450, 350);
  const B = board.board;
  const eqW = G(B);
  const eqMain = T(eqW, 0, -80, 'W = m × g', { size: 92, weight: 800, anchor: 'middle', fill: '#24305E' });
  const eqWord = G(B);
  T(eqWord, 0, 4, '**weight** = **mass** ×', { size: 38, weight: 600, anchor: 'middle', fill: '#2A1A22', boldFill: '#3A3D9B' });
  T(eqWord, 0, 52, '**gravitational field strength**', { size: 38, weight: 600, anchor: 'middle', fill: '#2A1A22', boldFill: '#3A3D9B' });
  T(eqWord, 0, 120, 'W in N · m in kg · g in N/kg', { size: 30, weight: 700, anchor: 'middle', fill: '#6A7480', font: FB });
  const eqG = G(B);
  T(eqG, 0, 10, 'On Earth: g ≈ **10 N/kg**', { size: 42, weight: 600, anchor: 'middle', fill: '#2A1A22', boldFill: '#3A3D9B' });
  const eqCalc = T(eqG, 0, 100, '20 kg × 10 N/kg = …', { size: 50, weight: 800, anchor: 'middle', fill: '#24305E' });
  const bellyRing = E('ellipse', { rx: 70, ry: 26, fill: 'none', stroke: '#FFE45C', 'stroke-width': 6 }, Lfg);
  const bellyArrow = arrow(Lfg, 820, 640, 940, 560, { color: '#FFE45C', width: 6, bend: -30 });

  /* ---- shot kav: Kavya close-up (arms, moon) ---- */
  const resCard = G(Lfg);
  card(resCard, -230, -190, 460, 380, { fill: 'rgba(10,27,39,0.92)', stroke: ppCol.weight, sw: 4 });
  T(resCard, 0, -128, '20 kg × 10 N/kg', { size: 36, weight: 700, anchor: 'middle', fill: C.muted });
  const res200 = T(resCard, 0, -46, '= 200 N', { size: 72, weight: 800, anchor: 'middle', fill: ppCol.weight });
  const armIcon = G(resCard);
  T(armIcon, -170, 52, 'ARM POWER', { size: 30, weight: 800, fill: C.muted });
  E('rect', { x: -170, y: 74, width: 300, height: 52, rx: 10, fill: '#0A1B27', stroke: C.ink, 'stroke-width': 4 }, armIcon);
  E('rect', { x: 130, y: 88, width: 12, height: 24, rx: 3, fill: C.ink }, armIcon);
  const armBar = E('rect', { x: -162, y: 82, width: 284, height: 36, rx: 6, fill: C.good }, armIcon);
  const armPct = weighTxt(armIcon, 170, 52, '100%', { size: 30, weight: 800, anchor: 'end', fill: C.good });
  const thought = G(Lfg);
  [[-150, 150, 12], [-118, 112, 18], [-78, 70, 26]].forEach(([x, y, r]) => E('circle', { cx: x, cy: y, r, fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 4 }, thought));
  E('path', { d: 'M-90,-10 Q-110,-80 -40,-96 Q0,-150 70,-120 Q150,-130 150,-50 Q190,10 120,52 Q70,96 0,70 Q-80,96 -90,-10 Z', fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 4 }, thought);
  const tMoon = weighMoon(thought, 62); tr(tMoon, 30, -24);
  const tBox = ppBox(thought, '', {}); tr(tBox, 100, 30, 0.22, -20);

  /* ---- shot moon: Earth vs Moon ---- */
  const mnG = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#0A1018' }, mnG);
  // Earth panel
  const ePan = G(mnG);
  E('rect', { x: 40, y: 112, width: 545, height: 590, rx: 18, fill: linGrad('#6CC4F2', '#CDEBFA', true) }, ePan);
  E('rect', { x: 40, y: 440, width: 545, height: 262, fill: linGrad('#5BBF6A', '#3E9A4E', true) }, ePan);
  E('rect', { x: 40, y: 112, width: 545, height: 590, rx: 18, fill: 'none', stroke: '#FFFFFF', 'stroke-width': 4 }, ePan);
  const eBox = ppBox(ePan, '', {}); tr(eBox, 230, 400, 0.85);
  // Moon panel
  const mPan = G(mnG);
  E('rect', { x: 615, y: 112, width: 545, height: 590, rx: 18, fill: linGrad('#04050A', '#151826', true) }, mPan);
  { const r = rng(4); let st = ''; for (let k = 0; k < 22; k++) st += `M${(630 + r() * 515).toFixed(0)},${(126 + r() * 300).toFixed(0)} h0.1 `; E('path', { d: st, stroke: '#FFFFFF', 'stroke-width': 3.5, 'stroke-linecap': 'round', opacity: 0.8 }, mPan); }
  const earthSky = G(mPan); tr(earthSky, 1080, 200);
  E('circle', { r: 34, fill: ball('#4CA6FF', '#1D5FA6') }, earthSky);
  E('path', { d: 'M-18,-14 Q0,-26 10,-8 Q4,10 -14,6 Z M8,12 Q20,8 22,18 Q12,26 6,20 Z', fill: '#5BBF6A' }, earthSky);
  E('path', { d: 'M615,450 Q760,420 900,446 Q1040,430 1160,452 L1160,684 Q1160,702 1142,702 L633,702 Q615,702 615,684 Z', fill: linGrad('#B9B9B2', '#7E7E78', true) }, mPan);
  [[700, 560, 40], [1000, 620, 56], [1100, 520, 26], [860, 660, 24]].forEach(([x, y, r]) => E('ellipse', { cx: x, cy: y, rx: r, ry: r * 0.32, fill: '#8E8E88', stroke: '#6A6A64', 'stroke-width': 3 }, mPan));
  E('rect', { x: 615, y: 112, width: 545, height: 590, rx: 18, fill: 'none', stroke: '#FFFFFF', 'stroke-width': 4 }, mPan);
  const mBox = ppBox(mPan, '', {}); tr(mBox, 805, 400, 0.85);
  // a tiny, weaker Graham on the Moon (a simple drawing: a small kettlebell with a face)
  const grahamM = G(mPan);
  E('path', { d: 'M-11,-6 C-13,-28 13,-28 11,-6', fill: 'none', stroke: '#6C70A8', 'stroke-width': 6, 'stroke-linecap': 'round' }, grahamM);
  E('circle', { cx: 0, cy: 6, r: 19, fill: ball(ppCol.weight, ppCol.weightDk), stroke: SC_INK, 'stroke-width': 3 }, grahamM);
  E('path', { d: 'M-7,2 h0.1 M7,2 h0.1', stroke: SC_INK, 'stroke-width': 5, 'stroke-linecap': 'round' }, grahamM);
  const grahamMf = G(grahamM);
  E('path', { d: 'M-6,11 Q0,16 6,11', fill: 'none', stroke: SC_INK, 'stroke-width': 2.5, 'stroke-linecap': 'round' }, grahamMf);
  const eMass = weighTxt(mnG, 230, 300, 'mass 20 kg', { size: 30, weight: 800, anchor: 'middle', fill: '#FFFFFF', halo: '#1D5FA6' });
  const mMass = weighTxt(mnG, 805, 300, 'mass 20 kg', { size: 30, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  const eTitle = weighTxt(mnG, 312, 162, 'EARTH', { size: 40, weight: 800, anchor: 'middle', fill: '#FFFFFF', halo: '#1D5FA6' });
  const mTitle = weighTxt(mnG, 888, 162, 'MOON', { size: 40, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  const eArr = ppForce(Lfg, { color: ppCol.weight, dir: 'down', label: '200 N', side: 'right' });
  const mArr = ppForce(Lfg, { color: ppCol.weight, dir: 'down', label: '32 N', side: 'right' });
  const eG = weighPill(Lfg, 'g = 10 N/kg', { size: 32, color: '#FFFFFF', fill: 'rgba(29,95,166,0.92)', stroke: '#FFFFFF' });
  const mG = weighPill(Lfg, 'g ≈ 1.6 N/kg', { size: 32, color: C.energy, stroke: C.energy });
  const eEq = weighTxt(Lfg, 312, 668, '20 kg × 10 N/kg = 200 N', { size: 32, weight: 800, anchor: 'middle', fill: '#FFFFFF', halo: '#23602F' });
  const mEq = weighTxt(Lfg, 888, 668, '20 kg × 1.6 N/kg = 32 N', { size: 32, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  const sameC = chip(Lfg, 'same mass', { size: 34, fill: ppCol.resultant, color: '#0B2A18', stroke: '#FFFFFF', sw: 3 });

  /* ---- shot cling: Graham on Kavya's leg ---- */
  const clG = G(flatWrap);
  const kavBody = scKavyaBody(flatWrap);   // Kavya's full body: the wide shot and the cling shot
  const sixthC = G(Lfg);
  card(sixthC, -250, -84, 500, 168, { fill: 'rgba(10,27,39,0.92)', stroke: ppCol.weight, sw: 4 });
  T(sixthC, 0, -22, 'On the Moon:', { size: 32, weight: 700, anchor: 'middle', fill: C.muted });
  T(sixthC, 0, 38, 'about **⅙** of the weight', { size: 42, weight: 700, anchor: 'middle', boldFill: ppCol.weight });
  const hearts = G(Lfg);
  const heartEls = [0, 1, 2].map(() => E('path', { d: 'M0,10 C-22,-6 -16,-26 0,-14 C16,-26 22,-6 0,10 Z', fill: '#FF6FB5', stroke: SC_INK, 'stroke-width': 3 }, hearts));

  /* ---- shot meter: the newtonmeter ---- */
  const mtG = G(flatWrap);
  E('rect', { x: 560, y: 0, width: 80, height: 22, fill: '#9AA6B2', stroke: SC_INK, 'stroke-width': 3 }, mtG);   // ceiling bracket
  E('line', { x1: 600, y1: 22, x2: 600, y2: 96, stroke: '#7E8A96', 'stroke-width': 6 }, mtG);
  const nm = ppNewtonmeter(mtG, { max: 250, step: 50 });
  const nmString = E('path', { d: '', fill: 'none', stroke: '#7A6A55', 'stroke-width': 4 }, mtG);
  const nmBox = ppBox(mtG, 'MISC', { size: 34 });
  const clip = scClipboard(mtG, 0.4);
  const nmChip = weighPill(Lfg, 'newtonmeter = spring balance', { size: 34, color: C.energy, stroke: C.energy });
  const readC = chip(Lfg, '200 N', { size: 40, fill: '#E8424F', color: '#FFFFFF', stroke: '#FFFFFF', sw: 3 });
  // the magnifier on the spring: drawn below the cast, Tess (the real one) sits inside it
  const lensLine = E('line', { x1: 0, y1: 0, x2: 0, y2: 0, stroke: '#FFFFFF', 'stroke-width': 4, 'stroke-dasharray': '10 8' }, Lmid);
  const lens = G(Lmid);
  E('circle', { r: 156, fill: '#1F2A36', stroke: '#FFFFFF', 'stroke-width': 8 }, lens);
  const lensLbl = weighTxt(lens, 0, 196, 'inside: Tess', { size: 32, weight: 800, anchor: 'middle', fill: ppCol.tension });

  /* ---- shot tess: extension, Hooke's law (Tess's confessional) ---- */
  const tsConf = ppConf(Lbg, 'tess');
  const tsG = G(Lmid);
  E('rect', { x: 560, y: 248, width: 160, height: 24, rx: 6, fill: '#9AA6B2', stroke: SC_INK, 'stroke-width': 3 }, tsG);   // the bar she hangs from
  // ruler
  const RX = 790, RY0 = 270, PXCM = 25;
  E('rect', { x: RX - 22, y: RY0 - 16, width: 44, height: 330, rx: 6, fill: '#F6E7B0', stroke: SC_INK, 'stroke-width': 3 }, tsG);
  { let d = ''; for (let i = 0; i <= 12; i++) d += `M${RX - 22},${RY0 + i * PXCM} L${RX - 22 + (i % 2 ? 12 : 22)},${RY0 + i * PXCM} `; E('path', { d, stroke: SC_INK, 'stroke-width': 2.5 }, tsG); }
  // weights hanger
  const hanger = G(tsG);
  E('path', { d: 'M0,0 L0,30', stroke: '#5E6B78', 'stroke-width': 6 }, hanger);
  const disc = [0, 1].map(i => { const d = G(hanger); E('rect', { x: -44, y: -12, width: 88, height: 24, rx: 8, fill: ball('#C9CED4', '#5E6B78'), stroke: SC_INK, 'stroke-width': 3 }, d); T(d, 0, 9, '1 N', { size: 24, weight: 800, anchor: 'middle', fill: SC_INK }); return d; });
  const guideO = E('line', { x1: 640, x2: RX - 22, stroke: '#FFFFFF', 'stroke-width': 2.5, 'stroke-dasharray': '8 6', opacity: 0.7 }, tsG);
  const guideN = E('line', { x1: 640, x2: RX - 22, stroke: '#FFFFFF', 'stroke-width': 2.5, 'stroke-dasharray': '8 6', opacity: 0.7 }, tsG);
  const guideT = E('line', { x1: 640, x2: RX - 22, y1: RY0, y2: RY0, stroke: '#FFFFFF', 'stroke-width': 2.5, 'stroke-dasharray': '8 6', opacity: 0.7 }, tsG);
  const brO = E('path', { d: '', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 4 }, tsG);
  const brE = E('path', { d: '', fill: 'none', stroke: C.energy, 'stroke-width': 6 }, tsG);
  const brN = E('path', { d: '', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 4 }, tsG);
  const lblO = weighTxt(tsG, RX + 44, 0, 'original length', { size: 28, weight: 700, fill: '#FFFFFF' });
  const lblE = weighTxt(tsG, RX + 44, 0, 'extension', { size: 32, weight: 800, fill: C.energy });
  const lblEcm = weighTxt(tsG, RX + 44, 0, '2 cm', { size: 28, weight: 700, fill: C.energy });
  const lblN = weighTxt(tsG, 548, 0, 'new length', { size: 28, weight: 700, anchor: 'end', fill: '#FFFFFF' });
  const extEq = G(Lfg);
  card(extEq, -440, -44, 880, 88, { fill: 'rgba(10,27,39,0.92)', stroke: C.energy, sw: 3 });
  T(extEq, 0, 12, '**extension** = new length − original length', { size: 36, weight: 600, anchor: 'middle', boldFill: C.energy });
  const tbl = G(Lfg);
  card(tbl, -170, -96, 340, 192, { fill: 'rgba(10,27,39,0.92)', stroke: C.line, sw: 3 });
  T(tbl, -80, -50, 'force', { size: 28, weight: 700, anchor: 'middle', fill: C.muted });
  T(tbl, 80, -50, 'extension', { size: 28, weight: 700, anchor: 'middle', fill: C.muted });
  E('line', { x1: -150, x2: 150, y1: -34, y2: -34, stroke: C.line, 'stroke-width': 3 }, tbl);
  E('line', { x1: 0, x2: 0, y1: -76, y2: 80, stroke: C.line, 'stroke-width': 3 }, tbl);
  const row1 = G(tbl); T(row1, -80, 12, '1 N', { size: 36, weight: 800, anchor: 'middle' }); T(row1, 80, 12, '2 cm', { size: 36, weight: 800, anchor: 'middle', fill: C.energy });
  const row2 = G(tbl); T(row2, -80, 66, '2 N', { size: 36, weight: 800, anchor: 'middle' }); T(row2, 80, 66, '4 cm', { size: 36, weight: 800, anchor: 'middle', fill: C.energy });
  const dblC = G(Lfg);
  card(dblC, -190, -60, 380, 120, { fill: 'rgba(10,27,39,0.92)', stroke: ppCol.tension, sw: 3 });
  T(dblC, 0, -12, 'double the force', { size: 32, weight: 700, anchor: 'middle' });
  T(dblC, 0, 34, '→ double the extension', { size: 32, weight: 700, anchor: 'middle', fill: C.energy });
  const hookeC = G(Lfg);
  const hk = chip(hookeC, "HOOKE'S LAW", { size: 44, fill: ppCol.tension, color: '#06302C', stroke: '#FFFFFF', sw: 3 });
  tr(hk, -210, 0);
  const hkT = weighTxt(hookeC, -210 + hk.w / 2 + 24, 14, 'extension ∝ force', { size: 42, weight: 800, fill: '#FFFFFF' });
  const ltTess = scLowerThird(Lhud, 'TESS', 'Tension. Very tense.');

  /* ---- shot graph: force against extension ---- */
  const grG = G(flatWrap);
  const gb = ppWhiteboard(grG, 720, 430); tr(gb, 450, 360);
  const GB = gb.board, GX0 = -250, GY0 = 150, GW = 480, GH = 300, XM = 14, YM = 6;
  const gxy = (x, y) => [GX0 + GW * x / XM, GY0 - GH * y / YM];
  { let d = ''; [4, 8, 12].forEach(x => { const [px] = gxy(x, 0); d += `M${px},${GY0} L${px},${GY0 - GH} `; }); [2, 4, 6].forEach(y => { const [, py] = gxy(0, y); d += `M${GX0},${py} L${GX0 + GW},${py} `; }); E('path', { d, stroke: '#D9E1E8', 'stroke-width': 2 }, GB); }
  arrow(GB, GX0, GY0, GX0 + GW + 26, GY0, { color: '#2A1A22', width: 4 });
  arrow(GB, GX0, GY0, GX0, GY0 - GH - 26, { color: '#2A1A22', width: 4 });
  [0, 4, 8, 12].forEach(x => T(GB, gxy(x, 0)[0], GY0 + 30, String(x), { size: 24, weight: 700, anchor: 'middle', fill: '#4A5560' }));
  [2, 4, 6].forEach(y => T(GB, GX0 - 12, gxy(0, y)[1] + 8, String(y), { size: 24, weight: 700, anchor: 'end', fill: '#4A5560' }));
  T(GB, GX0 + GW / 2, GY0 + 62, 'extension (cm)', { size: 28, weight: 700, anchor: 'middle', fill: '#2A1A22' });
  const fl = T(GB, GX0 - 52, GY0 - GH / 2, 'force (N)', { size: 28, weight: 700, anchor: 'middle', fill: '#2A1A22' });
  fl.setAttribute('transform', `rotate(-90 ${GX0 - 52} ${GY0 - GH / 2})`);
  const gLine = E('path', { d: '', fill: 'none', stroke: ppCol.tensionDk, 'stroke-width': 7, 'stroke-linecap': 'round' }, GB);
  const gCurve = E('path', { d: '', fill: 'none', stroke: '#E8424F', 'stroke-width': 7, 'stroke-linecap': 'round' }, GB);
  const gPts = [[2, 1], [4, 2], [6, 3], [8, 4]].map(([x, y]) => { const [px, py] = gxy(x, y); return E('circle', { cx: px, cy: py, r: 9, fill: '#FFFFFF', stroke: '#24305E', 'stroke-width': 4 }, GB); });
  const limDot = G(GB); { const [px, py] = gxy(10, 5); tr(limDot, px, py); }
  E('circle', { r: 13, fill: '#E8424F', stroke: SC_INK, 'stroke-width': 3 }, limDot);
  const limLbl = T(limDot, 18, 46, 'elastic limit', { size: 30, weight: 800, anchor: 'start', fill: '#C62828' });
  const origC = G(GB); tr(origC, 120, 60);
  card(origC, -130, -50, 260, 100, { fill: '#E6F7F4', stroke: ppCol.tensionDk, sw: 3 });
  T(origC, 0, -8, 'straight line', { size: 32, weight: 800, anchor: 'middle', fill: '#14625B' });
  T(origC, 0, 32, 'through the origin', { size: 28, weight: 700, anchor: 'middle', fill: '#14625B' });
  const permC = G(GB); tr(permC, -85, -130);
  card(permC, -140, -50, 280, 100, { fill: '#FFE9E9', stroke: '#C62828', sw: 3 });
  T(permC, 0, -8, 'past the limit:', { size: 30, weight: 800, anchor: 'middle', fill: '#C62828' });
  T(permC, 0, 32, 'permanently stretched', { size: 26, weight: 700, anchor: 'middle', fill: '#8E1F1F' });
  const propC = weighPill(Lfg, 'proportional', { size: 34, color: ppCol.tension, stroke: ppCol.tension });
  const curveD = (() => { const P0 = gxy(10, 5), P1 = gxy(11.6, 5.55), P2 = gxy(13.6, 5.75); return `M${P0[0].toFixed(1)},${P0[1].toFixed(1)} Q${P1[0].toFixed(1)},${P1[1].toFixed(1)} ${P2[0].toFixed(1)},${P2[1].toFixed(1)}`; })();
  attr(gCurve, 'd', curveD); gCurve.setAttribute('pathLength', 1); gCurve.setAttribute('stroke-dasharray', '1 1');

  /* ---- shot uncle: Tess's confessional ---- */
  const unG = G(Lmid);
  const frame = G(unG);
  E('rect', { x: -170, y: -140, width: 340, height: 280, rx: 8, fill: '#6B4A33', stroke: SC_INK, 'stroke-width': 5 }, frame);
  E('rect', { x: -146, y: -116, width: 292, height: 232, fill: linGrad('#F3E3B8', '#D9C08A', true) }, frame);
  // the trampoline in the photo
  E('ellipse', { cx: 0, cy: -10, rx: 116, ry: 26, fill: '#24282E', stroke: SC_INK, 'stroke-width': 4 }, frame);
  E('path', { d: 'M-100,4 L-100,80 M100,4 L100,80 M-40,14 L-40,90 M40,14 L40,90', stroke: '#5E6B78', 'stroke-width': 6 }, frame);
  // the saggy, wonky spring (Uncle) hanging off the rim
  E('path', { d: 'M60,10 L74,22 L52,32 L82,46 L48,60 L90,76 L58,92 L70,104', fill: 'none', stroke: '#9AA6B2', 'stroke-width': 6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, frame);
  E('circle', { cx: 60, cy: 8, r: 5, fill: '#5E6B78' }, frame);
  E('path', { d: 'M100,-140 L170,-140 L170,-70 Z', fill: '#111111' }, frame);   // black ribbon corner
  E('path', { d: 'M126,-140 L170,-96', stroke: '#333', 'stroke-width': 3 }, frame);
  const plaque = G(frame);
  E('rect', { x: -110, y: 156, width: 220, height: 48, rx: 6, fill: '#D9B45A', stroke: '#7A5A1E', 'stroke-width': 3 }, plaque);
  T(plaque, 0, 189, 'UNCLE BOING', { size: 28, weight: 800, anchor: 'middle', fill: '#3A2A10' });

  /* ================= the cast ================= */
  const rex = cast(Lcast, 'rex', { mood: 'deadpan' });
  const graham = cast(Lcast, 'graham');
  const tess = cast(Lcast, 'tess');

  const fcam = weighFcam(Lhud);

  /* key times */
  const tLand = at('box') + 0.9;                 // box 31 lands
  const tFc = at('mass') - 0.02;                 // FORCE-CAM flicks on in the hug shot
  const tDisc2 = mid('hooke', 0.36);             // the second weight goes on

  return t => {
    const sh = shotAt(t), shown = {};
    const flatOn = ['wide', 'hug', 'weight', 'board', 'kav', 'cling', 'meter', 'graph'].includes(sh);
    op(flatShot, flatOn ? 1 : 0);
    if (flatOn) flat.upd(t);
    [wideG, wtG, bdG, clG, mtG, grG, kavBody].forEach(g => op(g, 0));
    op(tower, sh === 'meter' ? 0 : 1);

    /* ---------- wide: box 31 drops ---------- */
    op(clockW, 0); op(box31C, 0); op(heavyC, 0); op(thud, 0);
    if (sh === 'wide') {
      op(wideG, 1);
      const fall = clamp((t - (tLand - 0.55)) / 0.55), landed = t >= tLand;
      const shake = landed ? Math.sin((t - tLand) * 60) * 9 * Math.exp(-(t - tLand) * 6) * AMP : 0;
      const push = P(t, at('box'), 6, linear);
      weighCam(flatWrap, 600, 450, 1 + 0.04 * push, 600 + shake, 450 + shake * 0.5);
      const squash = landed ? 1 - 0.12 * Math.exp(-(t - tLand) * 9) : 1;
      box31.setAttribute('transform', `translate(580 ${lerp(-120, 610, fall * fall).toFixed(1)}) scale(${(1.15 / squash).toFixed(3)} ${(1.15 * squash).toFixed(3)})`);
      const dp = landed ? clamp((t - tLand) / 0.9) : 0;
      puffs.forEach((p, i) => { attr(p, 'cx', 580 + (i ? 1 : -1) * (110 + 70 * dp)); attr(p, 'cy', 678 - 10 * dp); });
      op(dust, landed ? (1 - dp) * 0.9 : 0);
      op(cracks, t > mid('box', 0.78) ? 1 : 0);
      op(kavBody, 1); tr(kavBody, 260, 700, 1.55);
      kavBody.pose(landed ? { lean: -6, armL: [30, 30], armR: [-20, 20] } : { lean: 0 });
      weighPop(clockW, 760, 170, P(t, at('box') + 0.05, 0.4, pop));
      weighPop(box31C, 580, 380, P(t, mid('box', 0.35), 0.4, pop), 1, -3);
      weighPop(heavyC, 820, 470, P(t, mid('box', 0.78), 0.4, pop), 1, 4);
      const tp = landed ? P(t, tLand, 0.3, pop) * (1 - P(t, tLand + 0.9, 0.2, linear)) : 0;
      weighPop(thud, 580, 470, tp, 1, -6);
    }

    /* ---------- hug: Kavya and the box (twenty, mass) ---------- */
    op(hugG, sh === 'hug' ? 1 : 0); op(kgChip, 0); massStamp.set(0, 0, 0); op(notW, 0);
    if (sh === 'hug') {
      const push = P(t, at('twenty'), at('matter') - at('twenty'), linear);
      weighCam(flatWrap, 600, 480, 1.5 + 0.06 * push, 600, 430);
      const strain = Math.sin(t * 40) * 2.2 * AMP;
      shown.kav = 1; op(kav, 1);
      tr(kav, 470 + strain, 450, 1.5 * (1 + 0.05 * push));
      const fc = t >= tFc;
      kav.set({ t, talk: talk(t, 'kavya'), mood: fc ? 'annoyed' : t > end('twenty') ? 'deadpan' : 'annoyed', look: fc ? 0.8 : 0, sweat: 1 });
      tr(hugBox, 470 + strain, 640, 1.3);
      attr(hands[0], 'cx', 470 - 112 + strain); attr(hands[0], 'cy', 620);
      attr(hands[1], 'cx', 470 + 112 + strain); attr(hands[1], 'cy', 620);
      weighPop(kgChip, 900, 250, P(t, mid('twenty', 0.4), 0.4, pop), 1, -3);
      if (fc) {
        shown.rex = 1; const rp = P(t, tFc + 0.15, 0.45, pop);
        op(rex, clamp(rp * 3)); tr(rex, 880, 572, 0.72 * Math.max(0.01, rp));
        rex.set({ t, talk: talk(t, 'rex'), mood: 'deadpan', look: -0.7, len: 0.35 });
        massStamp.set(P(t, mid('mass', 0.22), 0.3, linear), 900, 352, -7);
        op(notW, P(t, mid('mass', 0.6), 0.3, linear)); tr(notW, 900, 448);
      }
    }

    /* ---------- matter: the mass card ---------- */
    op(matG, sh === 'matter' ? 1 : 0); op(neverC, 0);
    if (sh === 'matter') {
      op(matHead, P(t, at('matter') - 0.05, 0.25, linear));
      op(matSub, P(t, mid('matter', 0.3), 0.3, linear));
      panels.forEach((p, i) => {
        const pp = P(t, mid('matter', 0.42) + i * 0.45, 0.4, pop);
        weighPop(p.g, p.x, 420, pp);
        tr(p.kg, 0, 160, 1 + 0.08 * Math.sin(Math.max(0, t - mid('matter', 0.75)) * 6) * (t > mid('matter', 0.75) ? 1 : 0));
      });
      weighPop(neverC, 600, 640, P(t, mid('matter', 0.62), 0.4, pop), 1, -2);
      shown.rex = 1; op(rex, 1); tr(rex, 1010, 646, 0.62);
      rex.set({ t, talk: talk(t, 'rex'), mood: 'deadpan', look: -0.6, len: 0.4 });
    }

    /* ---------- weight: Graham clings to the box ---------- */
    op(wtArrow, 0); op(wtCard, 0);
    if (sh === 'weight') {
      op(wtG, 1);
      const push = P(t, at('weight'), at('wmg') - at('weight'), linear);
      weighCam(flatWrap, 470, 560, 1.12 + 0.05 * push, 470, 520);
      shown.graham = 1; op(graham, 1);
      tr(graham, 470, 372, 0.95);
      graham.set({ t, talk: talk(t, 'graham'), mood: 'happy', hug: 0.25, look: 0.5 });
      op(wtArrow, 1); tr(wtArrow, 470, 560); wtArrow.set(150 * ease(P(t, mid('weight', 0.12), 0.6, linear)));
      weighPop(wtCard, 900, 330, P(t, mid('weight', 0.08), 0.4, pop));
      op(wtUnit, P(t, mid('weight', 0.68), 0.3, linear));
    }

    /* ---------- board: W = m x g ---------- */
    op(bellyRing, 0); op(bellyArrow, 0);
    if (sh === 'board') {
      op(bdG, 1);
      const push = P(t, at('wmg'), at('arms') - at('wmg'), linear);
      weighCam(flatWrap, 600, 400, 1.06 + 0.04 * push, 600, 400);
      const isG = t >= at('g') - 0.1;
      op(eqMain, P(t, at('wmg') + 0.05, 0.3, linear));
      op(eqWord, isG ? 1 - P(t, at('g') - 0.1, 0.2, linear) : P(t, mid('wmg', 0.08), 0.3, linear));
      tr(eqMain, 0, 0, 1 + (isG ? 0 : 0.06 * P(t, mid('wmg', 0.7), 0.3, pop) * (1 - P(t, mid('wmg', 0.95), 0.3, linear))));
      op(eqG, isG ? P(t, at('g'), 0.25, linear) : 0);
      op(eqCalc, isG ? P(t, mid('g', 0.55), 0.3, linear) : 0);
      const pointing = isG && t > mid('g', 0.08) && t < mid('g', 0.62);
      shown.graham = 1; op(graham, 1);
      tr(graham, 1010, 440, 1.15);
      graham.set({ t, talk: talk(t, 'graham'), mood: 'happy', hug: pointing ? 0.35 : 0.8, look: pointing ? 0 : -0.6 });
      const rp = pointing ? P(t, mid('g', 0.1), 0.3, pop) : 0;
      op(bellyRing, clamp(rp * 2)); tr(bellyRing, 1010, 538, Math.max(0.01, 0.8 + 0.2 * rp));
      op(bellyArrow, clamp(rp * 2)); bellyArrow.set(rp);
    }

    /* ---------- kav: 200 N, the Moon ---------- */
    op(resCard, 0); op(thought, 0);
    if (sh === 'kav') {
      const isMoon = t >= at('moon') - 0.1;
      const push = isMoon ? P(t, at('moon'), at('moong') - at('moon'), linear) : P(t, mid('arms', 0.4), at('moon') - mid('arms', 0.4), linear);
      weighCam(flatWrap, 400, 400, 1.6, 400, 380);
      shown.kav = 1; op(kav, 1);
      tr(kav, 400, 470, 1.55 * (1 + (isMoon ? 0.03 : 0.07) * push));
      kav.set({ t, talk: talk(t, 'kavya'), mood: isMoon ? (t < mid('moon', 0.15) ? 'neutral' : 'happy') : (t > mid('arms', 0.4) ? 'deadpan' : 'annoyed'), look: isMoon ? 0.7 : 0, sweat: isMoon ? 0 : 1 });
      if (!isMoon) {
        weighPop(resCard, 880, 360, P(t, at('arms') + 0.02, 0.35, pop));
        op(res200, 1);
        const ap = P(t, mid('arms', 0.42), 0.4, pop);
        op(armIcon, clamp(ap * 2.5)); tr(armIcon, 0, 26 + 10 * (1 - ap));
        const drain = ease(P(t, mid('arms', 0.5), 0.9, linear)), pct = Math.round(lerp(100, 3, drain));
        attr(armBar, 'width', Math.max(6, 284 * pct / 100)); attr(armBar, 'fill', pct < 30 ? C.bad : pct < 60 ? C.glucose : C.good);
        setText(armPct, pct + '%'); attr(armPct, 'fill', pct < 30 ? C.bad : C.good);
      }
      if (isMoon) {
        const tp = P(t, mid('moon', 0.3), 0.45, pop);
        weighPop(thought, 870, 260, tp);
        tr(tMoon, 30, -24 + 4 * Math.sin(t * 2) * AMP);
      }
    }

    /* ---------- moon: Earth vs Moon ---------- */
    op(mnG, sh === 'moon' ? 1 : 0);
    [eArr, mArr, eG, mG, eEq, mEq, sameC].forEach(e => op(e, 0));
    if (sh === 'moon') {
      eArr.set(200); op(eArr, 1); tr(eArr, 230, 400);
      weighPop(eG, 312, 228, 1);
      op(eEq, 1);
      weighPop(mG, 888, 228, P(t, mid('moong', 0.12), 0.4, pop));
      const sp = P(t, mid('moong', 0.47), 0.4, pop) * (1 - P(t, mid('moong', 0.72), 0.25, linear));
      weighPop(sameC, 600, 300, sp);
      [eBox, mBox].forEach((b, i) => tr(b, i ? 805 : 230, 400, 0.85));
      [eMass, mMass].forEach((m, i) => { const x = i ? 805 : 230; m.setAttribute('transform', `translate(${x} 290) scale(${(1 + 0.15 * sp).toFixed(3)}) translate(${-x} -290)`); });
      const ap = ease(P(t, mid('moong', 0.66), 0.5, linear));
      op(mArr, ap > 0.02 ? 1 : 0); tr(mArr, 805, 400); mArr.set(32 * ap);
      op(mEq, P(t, mid('moong', 0.72), 0.3, linear));
      shown.graham = 1; op(graham, 1);
      tr(graham, 430, 520, 0.72);
      graham.set({ t, talk: talk(t, 'graham'), mood: 'happy', hug: 0.6, look: 0.8 });
      tr(grahamM, 960, 520 + 2 * Math.sin(t * 2) * AMP, 1);
      grahamMf.setAttribute('transform', t > mid('moong', 0.66) ? 'translate(0 25) scale(1 -1)' : '');
    }

    /* ---------- cling: Graham on Kavya's leg ---------- */
    op(sixthC, 0); op(hearts, 0);
    if (sh === 'cling') {
      op(clG, 1);
      const push = P(t, mid('sixth', 0.5), end('sixth') + 0.7 - mid('sixth', 0.5), linear);
      weighCam(flatWrap, 620, 600, 1.08 + 0.18 * ease(push), 620, 560);
      op(kavBody, 1); tr(kavBody, 620, 710, 1.95);
      kavBody.pose({ lean: -3, armL: [26, 20], armR: [-40, 50], legL: [6, -2], legR: [-4, -2] });
      shown.graham = 1; op(graham, 1);
      // Graham is drawn in Lcast (not zoomed): place him on the camera-transformed shin
      const k = 1.08 + 0.18 * ease(push), sx = 620 + (600 - 620) * k, sy = 560 + (640 - 600) * k;
      tr(graham, sx, sy, 0.62 * k);
      graham.set({ t, talk: talk(t, 'graham'), mood: 'sad', hug: 0.9, look: 0.3 });
      weighPop(sixthC, 900, 230, P(t, mid('sixth', 0.15), 0.4, pop));
      op(hearts, P(t, mid('sixth', 0.55), 0.3, linear));
      heartEls.forEach((h, i) => { const f = ((t * 0.5 + i * 0.33) % 1); tr(h, sx - 40 + i * 40 + 10 * Math.sin(t * 3 + i), sy - 120 - f * 80, 1.2); op(h, Math.sin(f * Math.PI)); });
    }

    /* ---------- meter: the newtonmeter, Tess inside ---------- */
    op(nmChip, 0); op(readC, 0); op(lens, 0); op(lensLine, 0);
    if (sh === 'meter') {
      op(mtG, 1);
      const push = P(t, at('meter'), at('ext') - at('meter'), linear);
      weighCam(flatWrap, 600, 400, 1 + 0.04 * push, 600, 400);
      // the box goes on at the start of the line; the pointer bounces and settles at 200 N
      const tOn = at('meter') + 0.35, u = Math.max(0, t - tOn);
      const F = t < tOn ? 0 : 200 * (1 - Math.exp(-u * 3.2) * Math.cos(u * 9));
      const s = 0.95;
      tr(nm, 600, 96, s); nm.set(F);
      const hy = 96 + nm.hookY * s;
      const by = t < tOn ? lerp(560, hy + 66, P(t, at('meter') - 0.06, 0.4, ease)) : hy + 66;
      tr(nmBox, 600, by, 0.72);
      attr(nmString, 'd', `M600,${(hy - 6).toFixed(1)} L560,${(by - 44).toFixed(1)} M600,${(hy - 6).toFixed(1)} L640,${(by - 44).toFixed(1)}`);
      shown.rex = 1; op(rex, 1); tr(rex, 330, 560, 0.8);
      rex.set({ t, talk: talk(t, 'rex'), mood: 'deadpan', look: 0.6, len: 0 });
      tr(clip, 268, 610, 0.4, -12);
      weighPop(nmChip, 600, 678, P(t, mid('meter', 0.22), 0.4, pop));
      const pyy = 96 + (30 + 20 + 220 * clamp(F / 250)) * s;
      weighPop(readC, 470, pyy, P(t, mid('meter', 0.3), 0.35, pop));
      const lp = P(t, mid('meter', 0.6), 0.45, pop);
      weighPop(lens, 930, 300, lp);
      op(lensLine, clamp(lp * 2)); attr(lensLine, 'x1', 616); attr(lensLine, 'y1', 96 + 150 * s); attr(lensLine, 'x2', 930 - 150); attr(lensLine, 'y2', 300);
      if (lp > 0.01) {
        shown.tess = 1; op(tess, clamp(lp * 2.5));
        tr(tess, 930, 300 - 30 * (0.6 + 0.4 * lp), 0.62 * Math.max(0.01, 0.6 + 0.4 * lp));
        tess.set({ t, mood: 'shock', sweat: 1, stretch: 0.6 + 0.04 * Math.sin(t * 7) * AMP, still: true });
      }
    }

    /* ---------- tess: extension and Hooke's law ---------- */
    tsConf.set(sh === 'tess' ? 1 : 0, t); op(tsG, sh === 'tess' ? 1 : 0);
    op(extEq, 0); op(tbl, 0); op(dblC, 0); op(hookeC, 0); ltTess.set(0);
    if (sh === 'tess') {
      const push = P(t, at('ext'), at('line') - at('ext'), linear);
      weighCam(tsConf, 640, 360, 1 + 0.04 * push);
      // stretch: one 1 N weight (0.5), then two (1.0)
      const st1 = 0.5 * ease(P(t, at('ext') + 0.6, 0.9, linear));
      const st2 = 0.5 * ease(P(t, tDisc2, 0.7, linear));
      const wob = (t > at('ext') + 0.6 ? 0.025 * Math.sin(t * 9) * Math.exp(-Math.max(0, t - (t > tDisc2 ? tDisc2 : at('ext') + 0.6)) * 1.5) : 0) * AMP;
      const st = st1 + st2 + wob;
      const s = 1.25, ty = 270;
      shown.tess = 1; op(tess, 1); tr(tess, 640, ty, s);
      tess.set({ t, talk: talk(t, 'tess'), mood: t > tDisc2 && t < tDisc2 + 1.2 ? 'shock' : (talk(t, 'tess') ? 'happy' : 'shock'), sweat: clamp(0.4 + st), stretch: st, look: 0.3, still: true });
      const hookY = ty + tess.hookY(st) * s;
      const coilEnd = ty + (80 * (1 + st) + 8) * s, coil0 = ty + 88 * s;
      tr(hanger, 640 - 22 * s, hookY - 8);
      op(hanger, t > at('ext') + 0.3 ? 1 : 0);
      tr(disc[0], 0, 42);
      op(disc[1], t > tDisc2 - 0.5 ? 1 : 0);
      tr(disc[1], 0, lerp(-260, 68, P(t, tDisc2 - 0.5, 0.5, easeIn)));
      // guides and brackets
      attr(guideT, 'x1', 640);
      attr(guideO, 'y1', coil0); attr(guideO, 'y2', coil0);
      attr(guideN, 'y1', coilEnd); attr(guideN, 'y2', coilEnd);
      const shO = P(t, mid('ext', 0.62), 0.3, linear), shE = P(t, mid('ext', 0.36), 0.3, linear), shN = P(t, mid('ext', 0.55), 0.3, linear);
      op(guideT, Math.max(shO, shN)); op(guideO, Math.max(shO, shE)); op(guideN, Math.max(shE, shN));
      const bx = RX + 30;
      attr(brO, 'd', `M${bx - 8},${RY0} L${bx},${RY0} L${bx},${coil0} L${bx - 8},${coil0}`); op(brO, shO);
      attr(brE, 'd', `M${bx - 8},${coil0 + 3} L${bx + 4},${coil0 + 3} L${bx + 4},${coilEnd} L${bx - 8},${coilEnd}`); op(brE, shE);
      const nx = 560;
      attr(brN, 'd', `M${nx + 8},${RY0} L${nx},${RY0} L${nx},${coilEnd} L${nx + 8},${coilEnd}`); op(brN, shN);
      attr(lblO, 'y', (RY0 + coil0) / 2 + 8); op(lblO, shO);
      attr(lblE, 'y', (coil0 + coilEnd) / 2 + 6); op(lblE, shE);
      const cm = Math.round(st / 0.5) * 2;
      setText(lblEcm, cm + ' cm'); attr(lblEcm, 'y', (coil0 + coilEnd) / 2 + 40); op(lblEcm, t > at('hooke') ? 1 : 0);
      attr(lblN, 'y', (RY0 + coilEnd) / 2 + 8); op(lblN, shN);
      ltTess.set(win(t, at('ext') + 0.1, at('ext') + 3.3, 0.3));
      op(extEq, win(t, mid('ext', 0.6), at('hooke') + 0.2, 0.25)); tr(extEq, 640, 682);
      const tb = P(t, at('hooke') + 0.2, 0.4, pop);
      weighPop(tbl, 1010, 210, tb);
      op(row1, 1); op(row2, P(t, tDisc2 + 0.5, 0.3, linear));
      weighPop(dblC, 1000, 560, P(t, mid('hooke', 0.55), 0.4, pop));
      weighPop(hookeC, 640, 680, P(t, mid('hooke', 0.78), 0.4, pop));
    }

    /* ---------- graph: force against extension; elastic limit ---------- */
    op(propC, 0);
    if (sh === 'graph') {
      op(grG, 1);
      const isLim = t >= at('limit') - 0.1;
      weighCam(flatWrap, 600, 400, 1.04, 600, 400);
      const reveal = isLim ? 1 : P(t, at('line') + 0.2, 2.2, linear);
      gPts.forEach((c, i) => op(c, reveal > (i + 1) / 4 - 0.2 ? 1 : 0));
      const lp = isLim ? 1 : ease(P(t, mid('line', 0.45), 0.9, linear));
      const ext2 = isLim ? lerp(8, 10, ease(P(t, at('limit') + 0.1, 0.8, linear))) : 8;
      const [x1, y1] = gxy(ext2 * lp, ext2 * lp / 2);
      attr(gLine, 'd', lp > 0.01 ? `M${GX0},${GY0} L${x1.toFixed(1)},${y1.toFixed(1)}` : '');
      op(origC, isLim ? 1 - P(t, mid('limit', 0.5), 0.2, linear) : P(t, mid('line', 0.55), 0.3, linear));
      weighPop(propC, 450, 140, isLim ? 0 : P(t, mid('line', 0.8), 0.35, pop));
      op(limDot, isLim ? P(t, mid('limit', 0.12), 0.3, linear) : 0);
      const cp = isLim ? P(t, mid('limit', 0.42), 0.8, linear) : 0;
      gCurve.setAttribute('stroke-dashoffset', (1 - cp).toFixed(3)); op(gCurve, cp > 0.01 ? 1 : 0);
      op(permC, isLim ? P(t, mid('limit', 0.55), 0.3, linear) : 0);
      shown.rex = 1; op(rex, 1);
      if (!isLim) { tr(rex, 1010, 470, 1); rex.set({ t, talk: talk(t, 'rex'), mood: 'deadpan', look: -0.7, len: 0.4 }); }
      else { tr(rex, 1060, 610, 0.62); rex.set({ t, talk: 0, mood: t > mid('limit', 0.55) ? 'shock' : 'deadpan', look: -0.5, len: 0.4 }); }
      if (isLim) {
        shown.tess = 1; const tp = P(t, at('limit') - 0.05, 0.35, pop);
        op(tess, clamp(tp * 3));
        const wonky = t > mid('limit', 0.5);
        tr(tess, 930, 290, 0.78 * Math.max(0.01, tp));
        tess.set({ t, talk: talk(t, 'tess'), mood: wonky ? 'shock' : 'annoyed', sweat: 1, stretch: wonky ? 0.3 : 0.7 + 0.3 * P(t, mid('limit', 0.3), 0.5, linear), wonky, look: -0.5 });
      }
    }

    /* ---------- uncle: Tess's confessional ---------- */
    const unOn = sh === 'uncle';
    op(unG, unOn ? 1 : 0);
    if (unOn) {
      tsConf.set(1, t);
      const push = P(t, at('uncle'), end('uncle') + 1.4 - at('uncle'), linear);
      weighCam(tsConf, 430, 380, 1 + 0.05 * push);
      shown.tess = 1; op(tess, 1);
      const k = 1 + 0.1 * ease(P(t, mid('uncle', 0.7), end('uncle') + 0.7 - mid('uncle', 0.7), linear));
      tr(tess, 420, 330, 1.35 * k);
      const lookPhoto = t > mid('uncle', 0.15) && t < mid('uncle', 0.7);
      tess.set({ t, talk: talk(t, 'tess'), mood: 'sad', sweat: 0.4, stretch: 0.15, wonky: true, look: lookPhoto ? 0.9 : 0 });
      const fp = P(t, mid('uncle', 0.12), 0.45, pop);
      weighPop(frame, 880, 330, fp, 1, -3 + 1.5 * Math.sin(t * 0.8) * AMP);
    }

    /* ---------- FORCE-CAM ---------- */
    const fcOn = (sh === 'hug' && t >= tFc) || ['weight', 'board', 'cling', 'meter', 'graph'].includes(sh) || (sh === 'moon');
    const flick = sh === 'hug' && t < tFc + 0.14 ? Math.floor(t * 30) % 2 : 1;
    fcam.set(fcOn && sh !== 'moon' ? flick : 0, t);

    if (!shown.kav) op(kav, 0);
    if (!shown.rex) op(rex, 0);
    if (!shown.graham) op(graham, 0);
    if (!shown.tess) op(tess, 0);
  };
});
