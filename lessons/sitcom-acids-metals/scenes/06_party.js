/* Scene 6: Drama at the after-party (displacement, carbonates, the three gas tests, making salt crystals).
   Shots (hard sitcom cuts): lab: an iron nail into blue copper sulfate -> disco: iron cuts in on copper's dance with
   sulfate, SHOVE!, DISPLACEMENT -> the word equation over the dance floor -> lab time-lapse: blue fades, brown copper
   coat -> copper in iron sulfate: nothing (tumbleweed) -> blast furnace: carbon is more reactive than iron
   -> a late guest, a marble chip (calcium carbonate) -> acid + metal carbonate: 3 products -> the example
   -> Henry: "Is that me?" -> Indi: "Not you, Henry." -> lab: lit splint goes out, limewater turns milky
   -> Henry: "Oh, thank goodness." -> Maggie burns with a blinding white flame -> Indi in sunglasses; Maggie is now
   a heap of white magnesium oxide -> oxygen relights a glowing splint -> the wedding favours: four steps to crystals. */
scene('party', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;
  const talk = (t, who) => scTalk(S, t, who);

  /* ---------- helpers (prefixed party) ---------- */
  const partyPlain = id => { const l = S.ch.lines.find(x => x.id === id); return l ? l.cap.replace(/^\*\*[^*]*\*\*\s*/, '').replace(/\*\*/g, '') : ''; };
  // time a word is (roughly) said: its character position through the line; `from` skips ahead to a phrase first
  function partyW(id, word, from) {
    const s = partyPlain(id), f = from ? Math.max(0, s.toLowerCase().indexOf(from.toLowerCase())) : 0;
    const m = new RegExp('\\b' + word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i').exec(s.slice(f));
    const i = m ? f + m.index : f;
    return at(id) + (end(id) - at(id)) * i / Math.max(1, s.length);
  }
  function partyPop(el, t, t0, x, y, s, r) { const p = P(t, t0, 0.45, pop); op(el, clamp(p * 2.5)); tr(el, x, y, Math.max(0.01, (s || 1) * (0.6 + 0.4 * p)), r); return p; }
  function partyLabel(parent, text, o) { o = o || {}; return chip(parent, text, { size: o.size || 30, fill: o.fill || 'rgba(10,27,39,0.9)', stroke: o.stroke || C.line, sw: o.sw || 2, color: o.color || C.ink, weight: 700 }); }
  // merge sibling rects (no rx), circles and paths with identical paint into one path (same picture, fewer elements)
  function partySlim(container) {
    const KEYS = ['fill', 'stroke', 'stroke-width', 'opacity', 'stroke-linecap', 'stroke-linejoin', 'stroke-dasharray'];
    const groups = new Map();
    [...container.children].forEach(el => {
      if (el.tagName === 'g') { partySlim(el); return; }
      if (el.getAttribute('transform') || el.getAttribute('style') || el.getAttribute('pathLength')) return;
      const n = k => +el.getAttribute(k) || 0;
      let d = null;
      if (el.tagName === 'rect' && !el.getAttribute('rx')) d = `M${n('x')},${n('y')}h${n('width')}v${n('height')}h${-n('width')}Z`;
      else if (el.tagName === 'circle') { const r = n('r'); d = `M${n('cx') - r},${n('cy')}a${r},${r} 0 1,0 ${2 * r},0a${r},${r} 0 1,0 ${-2 * r},0Z`; }
      else if (el.tagName === 'path' && /^M/.test(el.getAttribute('d') || '')) d = el.getAttribute('d');
      if (!d) return;
      const key = KEYS.map(a => el.getAttribute(a)).join('|');
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push({ el, d });
    });
    groups.forEach(list => {
      if (list.length < 2) return;
      const a = {}; KEYS.forEach(k => { const v = list[0].el.getAttribute(k); if (v !== null) a[k] = v; });
      a.d = list.map(o => o.d).join(' ');
      container.insertBefore(E('path', a), list[0].el);
      list.forEach(o => o.el.remove());
    });
  }
  // a ball atom with its symbol
  function partyAtom(parent, sym, c0, c1, r, ink) {
    const g = G(parent);
    E('circle', { r, fill: ball(c0, c1), stroke: c1, 'stroke-width': 4 }, g);
    T(g, 0, r * 0.36, sym, { size: r * 0.82, weight: 800, anchor: 'middle', fill: ink || '#FFFFFF' });
    return g;
  }
  // a little extra with a face (marble chip, magnesium oxide heap): scMake with a drawn body
  function partyExtra(parent, draw, face, seed) { return scMake(parent, { draw, face, seed, bob: 3 }); }

  /* ---------- layers ---------- */
  const world = G(root), bgL = G(world), backL = G(world), benchL = G(world), propL = G(world), castL = G(world), frontL = G(world);
  const hud = G(root);
  let camK = 1, camX = 600, camY = 375;
  function partyCam(k, cx, cy) {
    camK = k; camX = clamp(cx, 600 / k, 1200 - 600 / k); camY = clamp(cy, 375 / k, 750 - 375 / k);
    world.setAttribute('transform', `translate(600 375) scale(${k.toFixed(4)}) translate(${(-camX).toFixed(1)} ${(-camY).toFixed(1)})`);
  }

  /* ---------- sets ---------- */
  const venue = ngVenue(bgL);
  [...venue.children].filter(c => c.tagName === 'g' && c.style.opacity === '0.35').slice(5).forEach(c => c.remove());
  partySlim(venue);
  // disco: dim the reception, add a mirror ball and sweeping coloured beams
  const disco = G(bgL);
  const discoDim = E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#0A0F1E', opacity: 0.4 }, disco);
  const BEAM = ['#FF6FB5', '#4CC9F0', '#FFE45C', '#7CE38F', '#B48CFF'];
  const beams = BEAM.map(col => E('path', { d: 'M0,0 L-70,820 L70,820 Z', fill: col, opacity: 0.16 }, disco));
  const mball = G(disco); tr(mball, 760, 112);
  E('line', { x1: 0, y1: -60, x2: 0, y2: -34, stroke: '#C9D3DC', 'stroke-width': 4 }, mball);
  E('circle', { r: 36, fill: ball('#F4F7FA', '#7E8A97'), stroke: '#5F6B78', 'stroke-width': 3 }, mball);
  E('path', { d: 'M-36,0 L36,0 M-30,-18 L30,-18 M-30,18 L30,18 M0,-36 L0,36 M-20,-30 Q-28,0 -20,30 M20,-30 Q28,0 20,30', fill: 'none', stroke: '#9AA6B2', 'stroke-width': 2 }, mball);
  const darkV = E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#05080F', opacity: 0.6 }, bgL);
  const labG = G(bgL), lab = ngLab(labG); partySlim(lab);
  const signPatch = G(labG);   // cover the GOGGLES sign: it would sit behind the props
  E('rect', { x: 488, y: 186, width: 264, height: 128, fill: '#CFE0D4' }, signPatch);
  E('path', { d: 'M540,186 L540,314 M600,186 L600,314 M660,186 L660,314 M720,186 L720,314 M488,240 L752,240 M488,300 L752,300', stroke: '#B5CBBD', 'stroke-width': 2 }, signPatch);
  const furn = G(bgL);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#2A1408', '#0E0A08', true) }, furn);
  E('ellipse', { cx: 330, cy: 560, rx: 380, ry: 220, fill: glow('#FF7A1A'), opacity: 0.45 }, furn);
  const bench = ngBench(benchL, 540);

  /* ---------- the cast ---------- */
  const kavya = cast(backL, 'kavya', { goggles: 'on' });
  const indi = cast(castL, 'indi', { ph: 7 });
  const henry = cast(castL, 'henry');
  const maggie = cast(castL, 'maggie');
  const marble = partyExtra(castL, g => {
    E('path', { d: 'M-70,40 Q-86,0 -60,-30 Q-40,-62 -4,-58 Q30,-70 56,-40 Q84,-12 74,26 Q66,58 20,60 Q-40,66 -70,40 Z', fill: ball('#FFFFFF', '#B9C2CB'), stroke: '#8E9BA8', 'stroke-width': 4 }, g);
    E('path', { d: 'M-40,-30 l6,4 M40,-26 l-5,6 M-52,24 l7,-3 M50,30 l6,2 M-10,46 l5,4', stroke: '#A9B5C0', 'stroke-width': 5, 'stroke-linecap': 'round' }, g);
  }, { x: 0, y: -2, eye: 13, gap: 40, mouthW: 26, mouthY: 26, lidCol: '#DDE3EA' }, 6);
  const heap = partyExtra(castL, g => {
    E('path', { d: 'M-96,56 Q-70,-6 -30,-30 Q0,-52 30,-30 Q70,-6 96,56 Z', fill: ball('#FFFFFF', '#C9D2DB'), stroke: '#9AA6B2', 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
    E('path', { d: 'M-36,-28 Q0,-46 36,-28 L40,-16 Q0,-34 -40,-16 Z', fill: '#FF5FA2', stroke: SC_INK, 'stroke-width': 3 }, g);   // her sweatband
    E('path', { d: 'M-50,40 l4,-4 M40,30 l5,3 M-20,48 l4,3 M60,48 l4,-3', stroke: '#B9C2CB', 'stroke-width': 4, 'stroke-linecap': 'round' }, g);
  }, { x: 0, y: 14, eye: 13, gap: 40, mouthW: 28, mouthY: 30, lidCol: '#E2E8EE' }, 17);
  const ALL = [kavya, indi, henry, maggie, marble, heap];
  // Indi's sunglasses (for the magnesium flare)
  const shades = G(indi.firstChild);
  E('path', { d: 'M-60,-14 L-6,-14 L-10,14 Q-30,24 -54,14 Z M6,-14 L60,-14 L54,14 Q30,24 10,14 Z', fill: '#14141C', stroke: SC_INK, 'stroke-width': 3, 'stroke-linejoin': 'round' }, shades);
  E('path', { d: 'M-6,-12 L6,-12 M-60,-12 L-92,-20 M60,-12 L88,-18', stroke: SC_INK, 'stroke-width': 4, 'stroke-linecap': 'round' }, shades);
  E('path', { d: 'M-48,-8 L-36,-8 M18,-8 L30,-8', stroke: '#FFFFFF', 'stroke-width': 3, 'stroke-linecap': 'round', opacity: 0.6 }, shades);
  // Henry's hanky
  const hanky = G(henry.firstChild);
  E('path', { d: 'M-26,-14 L22,-18 Q30,-2 24,14 L-22,18 Q-30,2 -26,-14 Z', fill: '#FFFFFF', stroke: '#9AA6B2', 'stroke-width': 3, 'stroke-linejoin': 'round' }, hanky);
  E('path', { d: 'M-16,-6 L14,-8 M-16,6 L14,4', stroke: '#9FD8FF', 'stroke-width': 3 }, hanky);

  /* ================= lab: the nail in copper sulfate ================= */
  const BLUE = '#2F8FE8', PALE = '#A8E0A0', COPPER = '#C46A35';
  const BK = [760, 405];
  const bk = beaker(propL, 230, 270, { level: 0.62, liquid: BLUE }); tr(bk, BK[0], BK[1]);
  const nail = ngNail(propL, 0.72);
  const strip = G(propL);
  E('rect', { x: -14, y: -110, width: 28, height: 220, rx: 4, fill: ball('#F0A06A', '#9A4A1C'), stroke: '#7A3E14', 'stroke-width': 3 }, strip);
  const cuSO4 = partyLabel(hud, 'copper sulfate solution', { size: 32, color: '#9FD8FF', stroke: BLUE });
  const nailC = partyLabel(hud, 'iron nail', { size: 30, color: '#C9D2DB', stroke: '#9AA6B2' });
  const blueC = partyLabel(hud, 'the blue fades', { size: 32, color: '#9FD8FF', stroke: BLUE });
  const coatC = partyLabel(hud, 'brown coating of COPPER', { size: 34, color: '#FFC9A3', stroke: COPPER });
  const lapse = partyLabel(hud, 'TIME-LAPSE ▸▸', { size: 28, color: C.energy, stroke: C.energy });
  const feSO4 = partyLabel(hud, 'iron sulfate solution', { size: 32, color: PALE, stroke: '#5BBF6A' });
  const cuStripC = partyLabel(hud, 'copper', { size: 30, color: '#FFC9A3', stroke: COPPER });
  const neverG = G(hud);
  { const c = partyLabel(neverG, "copper can't displace iron", { size: 34, color: '#FFB3BA', stroke: C.bad }); tr(cross(neverG, 16), c.w / 2 + 34, 0); tr(c, -24, 0); }
  const tumble = G(propL);
  E('path', { d: 'M-30,0 Q-26,-30 2,-30 Q30,-28 30,0 Q28,30 0,30 Q-30,28 -30,0 M-18,-14 Q8,-26 20,6 Q4,24 -14,10 Q-20,-4 -2,-8 M-24,10 Q0,40 26,-14', fill: 'none', stroke: '#B08A4A', 'stroke-width': 4, 'stroke-linecap': 'round' }, tumble);

  /* ================= disco: the displacement dance ================= */
  const dance = G(propL);
  const so4 = G(dance);
  [[-26, -26], [26, -26], [-26, 26], [26, 26]].forEach(([x, y]) => E('circle', { cx: x, cy: y, r: 22, fill: ball('#8FC4FF', '#2E6FDB'), stroke: '#1F4FA8', 'stroke-width': 3 }, so4));
  E('circle', { r: 26, fill: ball('#FFE27A', '#C9A20B'), stroke: '#8A6A06', 'stroke-width': 3 }, so4);
  ngFormula(so4, 0, 96, 'SO_4', { size: 34, fill: '#9FD8FF' });
  const cuA = partyAtom(dance, 'Cu', '#F0A06A', '#9A4A1C', 46);
  const feA = partyAtom(dance, 'Fe', '#E4EAF0', '#6B7785', 46, '#2A3440');
  const shove = ngPop(hud, 'SHOVE!');
  const moreC = partyLabel(hud, 'MORE reactive', { size: 28, color: '#B6F5C9', stroke: C.good });
  const lessC = partyLabel(hud, 'less reactive', { size: 28, color: '#FFC9A3', stroke: COPPER });
  const dispG = G(hud);
  E('rect', { x: 360, y: 128, width: 800, height: 140, rx: 20, fill: 'rgba(10,27,39,0.92)', stroke: C.energy, 'stroke-width': 3 }, dispG);
  T(dispG, 760, 186, 'DISPLACEMENT', { size: 48, weight: 800, anchor: 'middle', fill: C.energy, ls: 2 });
  T(dispG, 760, 240, 'a more reactive metal pushes a less reactive one out', { size: 28, weight: 600, anchor: 'middle', fill: C.ink, font: FB });
  const eqG = G(hud);
  E('rect', { x: 340, y: 120, width: 820, height: 210, rx: 20, fill: 'rgba(10,27,39,0.92)', stroke: C.line, 'stroke-width': 3 }, eqG);
  const EQC = { iron: '#E4EAF0', 'copper sulfate': '#7FB8FF', 'iron sulfate': PALE, copper: '#F0A06A' };
  const eqD = ngEq(eqG, ['iron', '+', 'copper sulfate', '→', '\n', 'iron sulfate', '+', 'copper'], { size: 46, colors: EQC }); tr(eqD, 750, 222);
  const pairC = partyLabel(hud, 'iron sulfate', { size: 30, color: PALE, stroke: '#5BBF6A' });
  const cuC = partyLabel(hud, 'copper', { size: 30, color: '#F0A06A', stroke: COPPER });

  /* ================= the blast furnace ================= */
  const fz = G(propL);
  E('path', { d: 'M180,600 L220,190 L420,190 L460,600 Z', fill: '#7A3A28', stroke: '#3A1A10', 'stroke-width': 6, 'stroke-linejoin': 'round' }, fz);
  E('path', { d: 'M214,250 L426,250 M207,320 L433,320 M200,390 L440,390 M193,460 L447,460 M186,530 L454,530 M280,190 L276,250 M360,250 L364,320 M300,320 L296,390 M380,390 L384,460 M270,460 L266,530 M350,530 L354,600', stroke: '#4A2216', 'stroke-width': 4 }, fz);
  E('rect', { x: 200, y: 160, width: 240, height: 36, rx: 6, fill: '#5A2A1C', stroke: '#3A1A10', 'stroke-width': 5 }, fz);
  const fzGlow = E('rect', { x: 260, y: 470, width: 120, height: 80, rx: 14, fill: '#FFB020', stroke: '#3A1A10', 'stroke-width': 5 }, fz);
  const pourP = E('path', { d: 'M380,520 Q440,520 452,560 L470,600', fill: 'none', stroke: '#FFC247', 'stroke-width': 16, 'stroke-linecap': 'round' }, fz);
  const ladle = G(fz); tr(ladle, 500, 640);
  E('path', { d: 'M-70,-30 L70,-30 L56,30 Q0,48 -56,30 Z', fill: '#4A4E54', stroke: '#22262A', 'stroke-width': 5, 'stroke-linejoin': 'round' }, ladle);
  E('ellipse', { cx: 0, cy: -30, rx: 66, ry: 12, fill: '#FFC247' }, ladle);
  const fzHeat = heatWaves(fz, { n: 3, h: 70, spacing: 40, color: '#FF8A3D' }); tr(fzHeat, 320, 150);
  const ore = [0, 1, 2, 3].map(i => E('path', { d: 'M-12,-8 L6,-12 L14,2 L2,12 L-12,6 Z', fill: i % 2 ? '#C8743C' : '#2A2A2E', stroke: '#1A1A1A', 'stroke-width': 2 }, fz));
  const moltenC = partyLabel(hud, 'molten iron', { size: 30, color: '#FFC247', stroke: '#FF8A3D' });
  const fEqG = G(hud);
  E('rect', { x: 600, y: 130, width: 560, height: 230, rx: 20, fill: 'rgba(10,27,39,0.92)', stroke: '#FF8A3D', 'stroke-width': 3 }, fEqG);
  const fEq = ngEq(fEqG, ['iron ore', '+', 'carbon', '→', '\n', 'iron', '+', 'carbon dioxide'], { size: 40, colors: { 'iron ore': '#E89A6A', carbon: '#C9D2DB', iron: '#F4F7FA', 'carbon dioxide': C.co2 } }); tr(fEq, 880, 246);
  const moreC2 = G(hud);
  { const c = partyLabel(moreC2, 'carbon is MORE reactive than iron', { size: 30, color: C.energy, stroke: C.energy }); }
  const takesO = T(hud, 880, 500, '(so carbon takes the oxygen)', { size: 28, weight: 600, anchor: 'middle', fill: C.muted, font: FB });

  /* ================= carbonates ================= */
  const fizzM = bubbles(propL, -70, -90, 140, 120, { n: 8, r: 7, speed: 0.8, seed: 3 });
  const caCO3 = partyLabel(hud, 'calcium carbonate', { size: 32, color: '#FFFFFF', stroke: '#B9C2CB' });
  const splash = G(propL);
  E('path', { d: 'M-60,0 Q-70,-30 -50,-50 M60,0 Q70,-30 50,-50 M-20,-10 L-26,-50 M20,-10 L26,-50', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 5, 'stroke-linecap': 'round' }, splash);
  const cEqG = G(hud);
  E('rect', { x: 330, y: 116, width: 830, height: 226, rx: 20, fill: 'rgba(10,27,39,0.92)', stroke: C.line, 'stroke-width': 3 }, cEqG);
  const CQC = { acid: '#FF8A7A', 'metal carbonate': '#FFFFFF', salt: '#FFE6B0', water: '#7FD3F5', 'carbon dioxide': C.co2 };
  const cEq = ngEq(cEqG, ['acid', '+', 'metal carbonate', '→', '\n', 'salt', '+', 'water', '+', 'carbon dioxide'], { size: 46, colors: CQC }); tr(cEq, 745, 228);
  const three = partyLabel(hud, '3 PRODUCTS', { size: 34, fill: C.energy, color: '#3A3000', stroke: '#FFFFFF', sw: 3 });
  const exG = G(hud);
  E('rect', { x: 50, y: 150, width: 1100, height: 450, rx: 24, fill: 'rgba(10,27,39,0.93)', stroke: C.line, 'stroke-width': 3 }, exG);
  const XQC = { 'hydrochloric acid': '#FF8A7A', 'calcium carbonate': '#FFFFFF', 'calcium chloride': '#FFE6B0', water: '#7FD3F5', 'carbon dioxide': C.co2 };
  const xEq = ngEq(exG, ['hydrochloric acid', '+', 'calcium carbonate', '→', '\n', 'calcium chloride', '+', 'water', '\n', '+', 'carbon dioxide'], { size: 46, colors: XQC }); tr(xEq, 600, 375);
  // Henry in a cloud of CO2 bubbles
  const co2B = G(propL), co2L = [];
  for (let i = 0; i < 8; i++) co2L.push({ el: E('circle', { r: 18 + (i * 7) % 16, fill: 'rgba(255,255,255,0.16)', stroke: '#FFFFFF', 'stroke-width': 3 }, co2B), x: 330 + i * 76 + (i % 2) * 30, ph: (i * 0.37) % 1 });
  const co2T = [0, 1, 2].map(i => { const g = G(co2B); E('circle', { r: 40, fill: 'rgba(255,255,255,0.16)', stroke: '#FFFFFF', 'stroke-width': 3 }, g); ngFormula(g, 0, 10, 'CO_2', { size: 28, fill: C.co2 }); return { g, x: [380, 820, 980][i], ph: [0.15, 0.5, 0.8][i] }; });

  /* ================= gas tests (lab) ================= */
  const ACID = ngMix(ngPH(1), '#FFFFFF', 0.25);
  const backing = E('rect', { x: 300, y: 176, width: 640, height: 364, rx: 18, fill: '#2E3B45', opacity: 0.92 }, propL);   // dark backboard so the glassware reads
  const rig = G(propL);
  const tA = testTube(rig, 76, 250, { level: 0.45, liquid: ACID }); tr(tA, 400, 415);
  const chipsA = G(rig);
  [[-14, 516], [12, 520], [0, 504]].forEach(([x, y]) => E('path', { d: 'M-12,0 Q-12,-12 0,-12 Q12,-12 12,0 Q10,10 0,10 Q-12,10 -12,0 Z', fill: '#F4F7FA', stroke: '#9AA6B2', 'stroke-width': 2, transform: `translate(${400 + x} ${y})` }, chipsA));
  const fizzA = bubbles(rig, 372, 420, 56, 110, { n: 7, r: 6, speed: 0.9, seed: 9 });
  const deliv = G(rig);
  E('rect', { x: 368, y: 278, width: 64, height: 34, rx: 6, fill: '#3A2A22', stroke: SC_INK, 'stroke-width': 3 }, deliv);
  E('path', { d: 'M400,280 L400,226 Q400,214 412,214 L808,214 Q820,214 820,226 L820,500', fill: 'none', stroke: '#E6F4FB', 'stroke-width': 10, 'stroke-linejoin': 'round', opacity: 0.85 }, deliv);
  const tL = testTube(rig, 66, 250, { level: 0.55, liquid: '#BFE6F2' }); tr(tL, 820, 415);
  const fizzL = bubbles(rig, 800, 440, 40, 70, { n: 6, r: 6, speed: 1, seed: 4 });
  const splint = ngSplint(propL, 0.9);
  const outC = partyLabel(hud, 'lit splint goes OUT', { size: 32, color: '#FFB3BA', stroke: C.bad });
  const limeC = partyLabel(hud, 'limewater', { size: 30, color: '#E6F4FB', stroke: '#9FD8FF' });
  const milkyC = partyLabel(hud, 'MILKY = CARBON DIOXIDE', { size: 40, fill: '#F4F4EE', color: '#1A2A34', stroke: '#FFFFFF', sw: 3 });
  const tO = testTube(propL, 66, 250, { level: 0, liquid: '#FFFFFF' });
  const oxC = chip(propL, 'OXYGEN', { size: 32, fill: '#FFFFFF', color: SC_INK, stroke: SC_INK, sw: 3 });
  const relightC = partyLabel(hud, 'glowing splint RELIGHTS = OXYGEN', { size: 36, color: '#FFD08A', stroke: '#FF8A3D' });
  const relightSp = spark(propL, 22);

  /* ================= burning magnesium ================= */
  const spot = E('path', { d: 'M520,-20 L680,-20 L860,750 L340,750 Z', fill: '#FFFFFF', opacity: 0.12 }, propL);
  const flare = G(castL);
  const flareGlow = E('circle', { r: 300, fill: glow('#FFFFFF') }, flare);
  let rays = ''; for (let i = 0; i < 14; i++) { const a0 = i / 14 * TAU, a1 = a0 + 0.12; rays += `M0,0 L${(Math.cos(a0) * 420).toFixed(0)},${(Math.sin(a0) * 420).toFixed(0)} L${(Math.cos(a1) * 420).toFixed(0)},${(Math.sin(a1) * 420).toFixed(0)} Z `; }
  const rayP = E('path', { d: rays, fill: '#FFFFFF', opacity: 0.35 }, flare);
  const flareSp = [0, 1, 2, 3].map(i => spark(flare, 20, { color: '#FFFFFF', seed: i }));
  castL.insertBefore(flare, maggie);   // the flare blazes behind her, so her face stays readable
  const whiteHot = E('circle', { r: 150, fill: glow('#FFFFFF'), opacity: 0.6 }, castL);
  const flash = E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#FFFFFF' }, hud);
  const brightC = partyLabel(hud, 'a bright WHITE flame', { size: 34, color: '#FFFFFF', stroke: '#FFFFFF' });
  const bEqG = G(hud);
  E('rect', { x: 170, y: 116, width: 860, height: 108, rx: 20, fill: 'rgba(10,27,39,0.92)', stroke: C.line, 'stroke-width': 3 }, bEqG);
  const bEq = ngEq(bEqG, ['magnesium', '+', 'oxygen', '→', 'magnesium oxide'], { size: 44, colors: { magnesium: '#C9D2DB', oxygen: '#FF8A7A', 'magnesium oxide': '#FFFFFF' } }); tr(bEq, 600, 170);
  const warnG = G(hud);
  { const c = partyLabel(warnG, 'NEVER look straight at burning magnesium', { size: 32, color: C.energy, stroke: C.energy });
    const w = G(warnG); tr(w, -c.w / 2 - 44, 0);
    E('path', { d: 'M0,-30 L30,24 L-30,24 Z', fill: C.energy, stroke: SC_INK, 'stroke-width': 3, 'stroke-linejoin': 'round' }, w);
    T(w, 0, 18, '!', { size: 34, weight: 800, anchor: 'middle', fill: SC_INK }); }
  const mgoC = partyLabel(hud, 'magnesium oxide: a white powder', { size: 30, color: '#FFFFFF', stroke: '#C9D2DB' });

  /* ================= wedding favours: making salt crystals ================= */
  const favG = G(hud);
  const favT = T(favG, 600, 172, '**WEDDING FAVOURS:** salt crystals!', { size: 42, weight: 600, anchor: 'middle', fill: C.ink, boldFill: '#FF8FC0' });
  const PX = [0, 1, 2, 3].map(i => 185.5 + i * 276);
  const panels = PX.map((cx, i) => {
    const g = G(favG);
    E('rect', { x: cx - 128, y: 206, width: 256, height: 420, rx: 18, fill: 'rgba(10,27,39,0.92)', stroke: '#FF8FC0', 'stroke-width': 3 }, g);
    E('circle', { cx: cx - 98, cy: 238, r: 22, fill: '#FF8FC0' }, g);
    T(g, cx - 98, 248, String(i + 1), { size: 28, weight: 800, anchor: 'middle', fill: SC_INK });
    return g;
  });
  const capt = (g, cx, a, b) => { T(g, cx, 572, a, { size: 28, weight: 600, anchor: 'middle', fill: C.ink, boldFill: C.energy }); T(g, cx, 606, b, { size: 26, weight: 600, anchor: 'middle', fill: C.muted }); };
  // 1: excess black copper oxide stirred into warm acid
  { const g = panels[0], cx = PX[0];
    const b = beaker(g, 130, 150, { level: 0.55, liquid: '#5AA8E8' }); tr(b, cx, 420);
    E('path', { d: `M${cx - 50},488 Q${cx - 30},466 ${cx - 6},476 Q${cx + 20},462 ${cx + 50},488 Z`, fill: '#1A1A1E', stroke: '#000000', 'stroke-width': 2 }, g);
    E('line', { x1: cx + 40, y1: 310, x2: cx - 10, y2: 480, stroke: '#E6F4FB', 'stroke-width': 7, 'stroke-linecap': 'round' }, g);
    capt(g, cx, 'add **EXCESS** base', 'to warm acid'); }
  // 2: filter
  { const g = panels[1], cx = PX[1];
    E('path', { d: `M${cx - 70},300 L${cx + 70},300 L${cx + 8},380 L${cx + 8},420 L${cx - 8},420 L${cx - 8},380 Z`, fill: 'rgba(200,230,250,0.12)', stroke: '#CFE7F5', 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
    E('path', { d: `M${cx - 58},306 L${cx + 58},306 L${cx},374 Z`, fill: '#FFFFFF', opacity: 0.85 }, g);
    E('path', { d: `M${cx - 22},350 L${cx + 22},350 L${cx},374 Z`, fill: '#1A1A1E' }, g);
    const f = flask(g, 0.55, { level: 0.45, liquid: '#5AA8E8' }); tr(f, cx, 474);
    g.drip = E('path', { d: 'M0,-2 Q7,8 0,13 Q-7,8 0,-2 Z', fill: '#5AA8E8' }, g);
    T(g, cx - 66, 286, 'residue', { size: 26, weight: 700, anchor: 'middle', fill: '#C9D2DB' });
    T(g, cx + 70, 470, 'filtrate', { size: 26, weight: 700, anchor: 'middle', fill: '#7FB8FF' });
    capt(g, cx, '**FILTER**', 'removes extra base'); }
  // 3: evaporate
  { const g = panels[2], cx = PX[2];
    const bn = bunsen(g, 0.55); tr(bn, cx, 520); g.bn = bn;
    E('path', { d: `M${cx - 60},430 L${cx - 50},520 M${cx + 60},430 L${cx + 50},520 M${cx - 66},430 L${cx + 66},430`, stroke: '#9AA6B2', 'stroke-width': 6, 'stroke-linecap': 'round' }, g);
    E('path', { d: `M${cx - 74},396 Q${cx},468 ${cx + 74},396 Z`, fill: '#F4F7FA', stroke: '#9AA6B2', 'stroke-width': 4 }, g);
    E('path', { d: `M${cx - 50},404 Q${cx},440 ${cx + 50},404 Z`, fill: '#5AA8E8' }, g);
    g.steam = heatWaves(g, { n: 3, h: 70, spacing: 30, color: '#E6F4FB' }); tr(g.steam, cx, 384);
    capt(g, cx, '**EVAPORATE**', 'some of the water'); }
  // 4: crystals in gift bags
  { const g = panels[3], cx = PX[3];
    [[-50, '#FFD0E2'], [50, '#CFE7FF']].forEach(([dx, col]) => {
      E('path', { d: `M${cx + dx - 40},500 L${cx + dx - 32},380 L${cx + dx + 32},380 L${cx + dx + 40},500 Z`, fill: col, stroke: SC_INK, 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
      E('path', { d: `M${cx + dx - 18},372 l-16,-12 l0,24 Z M${cx + dx - 18},372 l16,-12 l0,24 Z`, fill: '#FF5FA2', stroke: SC_INK, 'stroke-width': 2, transform: `translate(${18} 0)` }, g);
    });
    E('path', { d: `M${cx - 70},360 l12,-22 l12,22 l-12,22 Z M${cx - 38},350 l10,-18 l10,18 l-10,18 Z M${cx + 34},352 l12,-22 l12,22 l-12,22 Z M${cx + 62},360 l9,-16 l9,16 l-9,16 Z M${cx - 20},528 l12,-20 l12,20 l-12,20 Z M${cx + 20},532 l9,-16 l9,16 l-9,16 Z`, fill: '#3F8FFF', stroke: '#BFE3FF', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, g);
    g.sp = spark(g, 14, { seed: 4 }); tr(g.sp, cx + 70, 300);
    capt(g, cx, '**COOL** slowly', '→ CRYSTALS'); }

  /* ---------- cut list ---------- */
  const tLimeCut = partyW('lime', "it's") - 0.1;
  const CUTS = [['nail', -9], ['disco', at('push') - 0.08], ['see', at('see') - 0.08], ['never', at('never') - 0.08], ['furn', at('extract') - 0.08],
    ['guest', at('guest') - 0.08], ['ex', at('example') - 0.08], ['henry', at('notme') - 0.08], ['indiN', at('lime') - 0.08], ['test', tLimeCut],
    ['phew', at('phew') - 0.08], ['burn', at('burn') - 0.08], ['look', at('look') - 0.08], ['oxy', at('oxygen') - 0.08], ['fav', at('favours') - 0.08]];
  const shotAt = t => { let s = CUTS[0][0]; for (const [k, t0] of CUTS) if (t >= t0) s = k; return s; };

  // word cues
  const tDisp = partyW('push', 'displacement') - 0.2, tBump = mid('push', 0.4);
  const tThree = partyW('carb', 'three') - 0.15, tCaCO3 = partyW('guest', 'calcium') - 0.15;
  const tOut = partyW('lime', 'goes out') - 0.3, tLime = partyW('lime', 'limewater') - 0.3, tMilky = partyW('lime', 'milky') - 0.15;
  const tBurn = partyW('burn', 'burn') - 0.15, tBright = partyW('burn', 'bright') - 0.15, tBEq = partyW('burn', 'magnesium', 'flame') - 0.15;
  const tRelight = partyW('oxygen', 'relights') - 0.1;
  const tFav = [partyW('favours', 'react'), partyW('favours', 'filter'), partyW('favours', 'evaporate'), partyW('favours', 'cool')].map(x => x - 0.2);
  const tReveal = end('look') - 0.25;

  const orbit = (t, rx) => { const a = t * 2.4 * (0.6 + 0.4 * AMP); return [760 + (rx || 96) * Math.cos(a), 470 + 26 * Math.sin(a)]; };

  return t => {
    const sh = shotAt(t);
    const isLab = sh === 'nail' || sh === 'see' || sh === 'never' || sh === 'test' || sh === 'oxy';
    const isVen = !isLab && sh !== 'furn';
    op(venue, isVen ? 1 : 0); if (isVen) venue.set(7, t * AMP);
    const isDisco = sh === 'disco' || sh === 'guest' || sh === 'henry' || sh === 'indiN' || sh === 'phew';
    op(disco, isDisco ? 1 : 0);
    if (isDisco) {
      beams.forEach((b, i) => { tr(b, 760, 112, 1, (i - 2) * 26 + 22 * Math.sin(t * (0.7 + i * 0.13) * AMP + i)); attr(b, 'fill', BEAM[(i + Math.floor(t * 0.8)) % 5]); });
      tr(mball, 760, 112, 1, (t * 40 * AMP) % 360);
    }
    op(darkV, sh === 'burn' || sh === 'look' || sh === 'ex' || sh === 'fav' ? 1 : 0);
    op(venue.chairs, sh === 'burn' || sh === 'look' ? 0 : 1);
    op(labG, isLab ? 1 : 0); op(bench, isLab ? 1 : 0); if (isLab) lab.upd(t * AMP);
    op(furn, sh === 'furn' ? 1 : 0);
    ALL.forEach(c => op(c, 0));
    [backing, bk, nail, strip, tumble, dance, fz, fizzM, splash, co2B, rig, splint, tO, oxC, relightSp, spot, flare, whiteHot].forEach(el => op(el, 0));
    [cuSO4, nailC, blueC, coatC, lapse, feSO4, cuStripC, neverG, shove, moreC, lessC, dispG, eqG, pairC, cuC, moltenC, fEqG, moreC2, takesO, caCO3, cEqG, three, exG,
      outC, limeC, milkyC, relightC, flash, brightC, bEqG, warnG, mgoC, favG].forEach(el => op(el, 0));
    op(shades, 0); op(hanky, 0);
    let cam = [1, 600, 375];
    const show = (c, x, y, s, st, r) => { op(c, 1); tr(c, x, y, s, r); if (st) c.set(Object.assign({ t }, st)); };

    /* ===================== lab: nail in copper sulfate (and the time-lapse) ===================== */
    if (sh === 'nail' || sh === 'see' || sh === 'never') {
      op(signPatch, 1); op(bk, 1);
      show(kavya, 230, 440, 1.3, { talk: talk(t, 'kavya'), mood: sh === 'never' ? 'deadpan' : sh === 'see' ? 'happy' : 'neutral', look: 0.85 });
      if (sh !== 'never') {
        const sp = sh === 'see' ? P(t, at('see') + 0.2, end('see') - at('see') - 0.2, linear) : 0;
        bk.set(0.62, ngMix(BLUE, PALE, sp));
        const dp = P(t, mid('nail', 0.45), 0.7, easeIn);
        op(nail, P(t, mid('nail', 0.35), 0.15, linear)); tr(nail, 770, lerp(-120, 432, dp), 1, 12 * dp);
        nail.set(sp);
        const cp = P(t, mid('nail', 0.62), 0.45, pop); op(cuSO4, clamp(cp * 2.5) * (sh === 'nail' ? 1 : 0)); tr(cuSO4, 760, 180, Math.max(0.01, 0.7 + 0.3 * cp));
        const np = P(t, mid('nail', 0.3), 0.45, pop); op(nailC, clamp(np * 2.5) * (sh === 'nail' ? 1 : 0)); tr(nailC, 1010, lerp(150, 300, dp));
        if (sh === 'nail') cam = [1 + 0.03 * P(t, at('nail'), 5, linear), 600, 375];
        else {
          cam = [1.55 + 0.06 * P(t, at('see'), 4.5, linear), 770, 400];
          op(lapse, 1); tr(lapse, 1010, 150);
          const bp = P(t, mid('see', 0.3), 0.45, pop); op(blueC, clamp(bp * 2.5)); tr(blueC, 300, 200, Math.max(0.01, 0.7 + 0.3 * bp));
          const kp = P(t, mid('see', 0.65), 0.45, pop); op(coatC, clamp(kp * 2.5)); tr(coatC, 600, 660, Math.max(0.01, 0.7 + 0.3 * kp));
        }
      } else {
        bk.set(0.62, PALE);
        op(strip, 1); tr(strip, 770, lerp(-140, 420, P(t, at('never') + 0.1, 0.6, easeIn)), 0.95, 8);
        const fp = P(t, at('never') + 0.15, 0.45, pop); op(feSO4, clamp(fp * 2.5)); tr(feSO4, 760, 180, Math.max(0.01, 0.7 + 0.3 * fp));
        const sp = P(t, mid('never', 0.25), 0.45, pop); op(cuStripC, clamp(sp * 2.5)); tr(cuStripC, 990, 330, Math.max(0.01, 0.7 + 0.3 * sp));
        const np = P(t, mid('never', 0.55), 0.45, pop); op(neverG, clamp(np * 2.5)); tr(neverG, 640, 660, Math.max(0.01, 0.7 + 0.3 * np));
        // the pause: a tumbleweed rolls along the bench
        const tw = P(t, mid('never', 0.8), at('extract') - mid('never', 0.8), linear);
        op(tumble, tw > 0 && tw < 1 ? 1 : 0); tr(tumble, lerp(-60, 1260, tw), 505 - 10 * Math.abs(Math.sin(tw * 18)), 1, tw * 900);
        cam = [1 + 0.04 * P(t, at('never'), 4, linear), 600, 375];
      }
    }

    /* ===================== disco: the displacement dance ===================== */
    if (sh === 'disco') {
      op(dance, 1);
      const isEq = t >= at('eq') - 0.1;
      show(indi, 190, 490, 1.0, { talk: talk(t, 'indi'), ph: 7, mood: t > end('push') ? 'deadpan' : 'neutral', look: 0.8 });
      tr(so4, 760 + 6 * Math.sin(t * 4.8 * AMP), 470, 1, 10 * Math.sin(t * 2.4 * AMP));
      const ob = orbit(tBump), oc = orbit(t);
      // copper dances until iron shoves it out, then sulks on the floor at the left
      const fly = P(t, tBump, 0.7, easeOut);
      if (t < tBump) tr(cuA, oc[0], oc[1]);
      else tr(cuA, lerp(ob[0], 470, fly), lerp(ob[1], 610, fly) - 120 * Math.sin(Math.PI * fly), 1, -720 * fly);
      // iron slides in from the right, then takes copper's place in the dance
      const inn = P(t, tBump - 0.55, 0.55, easeIn);
      if (t < tBump) tr(feA, lerp(1300, ob[0] + 70, inn), 470);
      else { const k = P(t, tBump, 0.4, ease); tr(feA, lerp(ob[0] + 70, oc[0], k), lerp(ob[1], oc[1], k)); }
      const sp = P(t, tBump, 0.35, linear); shove.set(sp < 1 && t < tBump + 0.9 ? sp : 0); tr(shove, ob[0] + 20, 330, 0.6);
      if (!isEq) {
        const dp = P(t, tDisp, 0.45, pop); op(dispG, clamp(dp * 2.5));
        const mp = P(t, tBump + 0.3, 0.4, pop); op(moreC, clamp(mp * 2.5)); tr(moreC, oc[0] * P(t, tBump, 0.4, ease) + (1 - P(t, tBump, 0.4, ease)) * (ob[0] + 70), 395);
        const lp = P(t, tBump + 0.75, 0.4, pop); op(lessC, clamp(lp * 2.5)); tr(lessC, 470, 690);
        cam = [1 + 0.03 * P(t, at('push'), 6, linear), 600, 375];
      } else {
        op(eqG, 1); eqD.set(P(t, at('eq'), end('eq') - at('eq') - 0.2, linear));
        const ap = P(t, partyW('eq', 'iron sulfate') - 0.1, 0.4, pop); op(pairC, clamp(ap * 2.5)); tr(pairC, 760, 600);
        const cp = P(t, partyW('eq', 'copper', 'iron sulfate') - 0.1, 0.4, pop); op(cuC, clamp(cp * 2.5)); tr(cuC, 470, 690);
      }
    }

    /* ===================== the blast furnace ===================== */
    if (sh === 'furn') {
      op(fz, 1);
      attr(fzGlow, 'fill', ngMix('#FFB020', '#FFE45C', wave(t, 0.7)));
      fzHeat.upd(t * AMP);
      ore.forEach((o, i) => { const f = (t * 0.7 + i / 4) % 1; tr(o, 262 + i * 38, 112 + f * 70, 1, f * 200); op(o, Math.min(1, (1 - f) * 4)); });
      const pp = P(t, mid('extract', 0.35), 0.5, linear);
      op(pourP, pp); attr(pourP, 'stroke-width', 14 + 3 * Math.sin(t * 12));
      op(moltenC, P(t, mid('extract', 0.45), 0.3, linear)); tr(moltenC, 520, 708);
      op(fEqG, 1); fEq.set(P(t, at('extract'), mid('extract', 0.55) - at('extract'), linear));
      const mp = P(t, partyW('extract', 'which is more') - 0.1, 0.45, pop); op(moreC2, clamp(mp * 2.5)); tr(moreC2, 880, 440, Math.max(0.01, 0.7 + 0.3 * mp));
      op(takesO, P(t, mid('extract', 0.75), 0.3, linear));
      cam = [1 + 0.03 * P(t, at('extract'), 6, linear), 600, 375];
    }

    /* ===================== the late guest; carbonates ===================== */
    if (sh === 'guest') {
      const carb = t >= at('carb') - 0.1;
      const land = mid('guest', 0.45), dp = P(t, mid('guest', 0.05), land - mid('guest', 0.05), easeIn);
      const sq = 1 - 0.12 * Math.sin(Math.PI * P(t, land, 0.3, linear));
      show(marble, 640, lerp(-120, 572, dp), 0.85 * sq, { mood: t > land ? 'happy' : 'shock', look: 0 });
      op(splash, P(t, land, 0.08, linear) * (1 - P(t, land + 0.3, 0.3, linear))); tr(splash, 640, 610, 1 + P(t, land, 0.5, linear));
      op(fizzM, P(t, land, 0.4, linear)); tr(fizzM, 640, 560); fizzM.upd(t);
      const upLook = t < land + 0.2;
      show(indi, 190, 490, 1.0, { talk: talk(t, 'indi'), ph: 7, mood: carb ? 'neutral' : upLook ? 'neutral' : 'deadpan', look: carb ? 0.7 : upLook ? 0.5 : 0.8 });
      show(henry, 1020, 540, 0.95, { mood: t > land && !carb ? 'shock' : 'neutral', sweat: t > land && !carb ? 0.6 : 0, look: -0.8 });
      if (!carb) {
        const cp = P(t, tCaCO3, 0.45, pop); op(caCO3, clamp(cp * 2.5)); tr(caCO3, 640, 690, Math.max(0.01, 0.7 + 0.3 * cp));
      } else {
        op(caCO3, 1); tr(caCO3, 640, 690);
        op(cEqG, 1);
        const n = 9, p1 = P(t, at('carb'), tThree - at('carb'), linear), p2 = P(t, tThree + 0.35, end('carb') - tThree - 0.6, linear);
        cEq.set((4 * p1 + 5 * p2) / n);
        const tp = P(t, tThree, 0.45, pop); op(three, clamp(tp * 2.5)); tr(three, 1050, 384, Math.max(0.01, 0.7 + 0.3 * tp), -5);
      }
      cam = [1, 600, 375];
    }
    if (sh === 'ex') {
      op(exG, 1); xEq.set(P(t, at('example'), end('example') - at('example') - 0.2, linear));
    }

    /* ===================== Henry: is that me? ===================== */
    if (sh === 'henry' || sh === 'phew') {
      const ph = sh === 'phew';
      show(henry, 600, 440, 1.8, { talk: talk(t, 'henry'), mood: ph ? 'happy' : 'shock', sweat: ph ? 0.3 : 1, look: ph ? 0 : 0.8 * Math.sin(t * 3.2) });
      op(co2B, ph ? 1 - P(t, at('phew') - 0.1, 0.4, linear) : 1);
      co2L.forEach(b => { const f = (t * 0.35 + b.ph) % 1; tr(b.el, b.x + 10 * Math.sin(f * 9), 760 - f * 600); op(b.el, Math.min(1, (1 - f) * 5)); });
      co2T.forEach(b => { const f = (t * 0.3 + b.ph) % 1; tr(b.g, b.x + 12 * Math.sin(f * 8), 760 - f * 600); op(b.g, Math.min(1, (1 - f) * 5)); });
      if (ph) {
        op(hanky, 1); tr(hanky, 26 * Math.sin(t * 7 * (0.5 + 0.5 * AMP)), -72, 1, 8 * Math.sin(t * 7));
        cam = [1 + 0.12 * P(t, at('phew'), end('phew') + 0.7 - at('phew'), linear), 600, 380];
      } else cam = [1, 600, 375];
    }
    if (sh === 'indiN') {
      show(indi, 420, 450, 1.35, { talk: talk(t, 'indi'), ph: 7, mood: 'deadpan', look: 0.8 });
      show(henry, 920, 500, 1.1, { mood: 'shock', sweat: 0.8, look: -0.8 });
      cam = [1.05, 600, 400];
    }

    /* ===================== lab: limewater test ===================== */
    if (sh === 'test') {
      op(rig, 1); op(signPatch, 1); op(backing, 1); attr(backing, 'x', 600); attr(backing, 'width', 340);
      fizzA.upd(t);
      const lime = t >= tLime;
      op(deliv, P(t, tLime, 0.25, linear)); op(tL, P(t, tLime, 0.25, linear));
      tA.set(0.45, ACID);
      tL.set(0.55, ngMix('#BFE6F2', '#F6F6EE', P(t, tMilky, 0.9, linear)));
      op(fizzL, lime ? P(t, tLime + 0.3, 0.3, linear) : 0); fizzL.upd(t);
      // the lit splint goes in, and goes out
      const sIn = P(t, tLimeCut + 0.1, 0.7, easeOut);
      op(splint, 1 - P(t, tLime - 0.15, 0.2, linear));
      tr(splint, lerp(-260, 232, sIn), lerp(160, 222, sIn), 0.9, 20);
      splint.set(t < tOut ? 'lit' : 'out', t);
      const op1 = P(t, tOut + 0.05, 0.45, pop); op(outC, clamp(op1 * 2.5) * (1 - P(t, tLime, 0.2, linear))); tr(outC, 660, 150, Math.max(0.01, 0.7 + 0.3 * op1));
      op(limeC, P(t, tLime + 0.1, 0.3, linear)); tr(limeC, 940, 330);
      const mp = P(t, tMilky + 0.2, 0.45, pop); op(milkyC, clamp(mp * 2.5)); tr(milkyC, 620, 660, Math.max(0.01, 0.7 + 0.3 * mp));
      cam = [1, 600, 375];
    }

    /* ===================== Maggie burns ===================== */
    if (sh === 'burn') {
      op(spot, 1);
      const f = P(t, tBurn, 0.5, easeOut);
      op(flare, f); tr(flare, 600, 470, 0.6 + 0.5 * f + 0.04 * Math.sin(t * 9));
      attr(rayP, 'transform', `rotate(${((t * 25 * AMP) % 360).toFixed(1)})`);
      flareSp.forEach((s, i) => { const a = i / 4 * TAU + t * 1.2 * AMP; tr(s, Math.cos(a) * 230, Math.sin(a) * 170); s.upd(t); });
      show(maggie, 600, 470, 1.4, { talk: talk(t, 'maggie'), mood: 'happy', fizz: f, look: 0 });
      op(whiteHot, 0.3 * f); tr(whiteHot, 600, 470);
      op(flash, 0.75 * (P(t, tBurn, 0.08, linear) - P(t, tBurn + 0.1, 0.5, linear)));
      const bp = P(t, tBright, 0.45, pop); op(brightC, clamp(bp * 2.5)); tr(brightC, 600, 690, Math.max(0.01, 0.7 + 0.3 * bp));
      op(bEqG, P(t, tBEq - 0.2, 0.25, linear)); bEq.set(P(t, tBEq, end('burn') - tBEq - 0.2, linear));
      cam = [1 + 0.05 * P(t, at('burn'), 7, linear), 600, 420];
    }

    /* ===================== Indi: don't look; the white powder ===================== */
    if (sh === 'look') {
      op(shades, 1);
      const rv = P(t, tReveal, 0.45, linear);
      show(indi, 330, 450, 1.3, { talk: talk(t, 'indi'), ph: 7, mood: 'deadpan', look: rv > 0.5 ? 0.8 : -0.9 });
      op(flare, 1 - rv); tr(flare, 1140, 430, 1.25 + 0.05 * Math.sin(t * 9));
      attr(rayP, 'transform', `rotate(${((t * 25 * AMP) % 360).toFixed(1)})`);
      flareSp.forEach((s, i) => { const a = i / 4 * TAU + t * 1.2 * AMP; tr(s, Math.cos(a) * 230, Math.sin(a) * 170); s.upd(t); });
      const wp = P(t, at('look') + 0.2, 0.45, pop); op(warnG, clamp(wp * 2.5) * (1 - P(t, tReveal, 0.3, linear))); tr(warnG, 640, 660, Math.max(0.01, 0.7 + 0.3 * wp));
      const hp = P(t, tReveal + 0.15, 0.45, pop);
      if (hp > 0) show(heap, 900, 560, 1.1 * (0.6 + 0.4 * hp), { mood: 'happy', look: -0.6 });
      op(mgoC, clamp(P(t, tReveal + 0.35, 0.45, pop) * 2.5)); tr(mgoC, 900, 680);
      cam = [1, 600, 375];
    }

    /* ===================== oxygen relights a glowing splint ===================== */
    if (sh === 'oxy') {
      op(signPatch, 1); op(backing, 1); attr(backing, 'x', 520); attr(backing, 'width', 420);
      show(kavya, 230, 440, 1.3, { talk: 0, mood: t > tRelight ? 'happy' : 'neutral', look: 0.85 });
      op(tO, 1); tr(tO, 760, 415); tO.set(0, '#FFFFFF');
      op(oxC, 1); tr(oxC, 760, 604);
      const sIn = P(t, mid('oxygen', 0.15), 0.8, easeOut);
      op(splint, 1); tr(splint, lerp(160, 592, sIn), lerp(150, 222, sIn), 0.9, 20);
      splint.set(t < tRelight ? 'glow' : 'lit', t);
      const rp = P(t, tRelight, 0.4, easeOut); op(relightSp, rp * (1 - P(t, tRelight + 0.4, 0.4, linear))); tr(relightSp, 785, 286, 1 + 2 * rp); relightSp.upd(t);
      const cp = P(t, tRelight + 0.1, 0.45, pop); op(relightC, clamp(cp * 2.5)); tr(relightC, 680, 150, Math.max(0.01, 0.7 + 0.3 * cp));
      cam = [1 + 0.04 * P(t, at('oxygen'), 4.5, linear), 640, 375];
    }

    /* ===================== wedding favours ===================== */
    if (sh === 'fav') {
      op(favG, 1);
      op(favT, P(t, at('favours') - 0.05, 0.3, linear));
      panels.forEach((g, i) => { const p = P(t, tFav[i], 0.45, pop); op(g, clamp(p * 2.5)); g.setAttribute('transform', `translate(${PX[i]} 416) scale(${Math.max(0.01, 0.8 + 0.2 * p).toFixed(3)}) translate(${-PX[i]} -416)`); });
      const d = panels[1].drip, f = (t * 1.3) % 1; tr(d, PX[1], 422 + f * 40); op(d, 1 - f);
      panels[2].bn.upd(t * AMP); panels[2].steam.upd(t * AMP);
      panels[3].sp.upd(t);
    }

    partyCam(cam[0], cam[1], cam[2]);
  };
});
