/* Scene 7: The judges save you some marks.
   A  kitchen line-up under the board "6 EXAM TRAPS"
   B  six snappy confessionals, one trap card each: Arrow (-> not =, the "=" gets crossed out again),
      Olly (big numbers, never a subscript; the bleach callback), Madam Mass (a gas escaped; her LCD drops),
      Ferris (oxygen AND water), Monty (carbon monoxide + soot: "Write ME"), Arrow (rise = exo, fall = endo)
   C  drumroll in the dark: spotlights sweep the line-up; the golden test-tube trophy
   D  the spotlights land on copper Ferris; Arrow hands him the trophy
   E  Ferris, happy for the first time; confetti; his rust grows a little
   F  the logo: "Test Tube Kitchen will return"
   G  night: Arrow asks Kat if she's exhausted. Silence.
   H  Kat on Madam Mass's pan: 5.00 g, same as this morning
   I  Kat opens one eye: "...Again." Final frame: Kat on the pan, 5.00 g, the logo. */
scene('traps', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;

  /* ---------- helpers ---------- */
  const cam = (k, fx, fy, sx, sy) => `translate(${(sx === undefined ? fx : sx).toFixed(1)} ${(sy === undefined ? fy : sy).toFixed(1)}) scale(${k.toFixed(4)}) translate(${(-fx).toFixed(1)} ${(-fy).toFixed(1)})`;
  const M = []; let seen = new Set();
  const reg = el => { M.push(el); return el; };
  const show = (el, o) => { seen.add(el); op(el, o === undefined ? 1 : o); };
  const popIn = (el, t, t0, x, y, s, r) => { const p = P(t, t0, 0.4, pop); show(el, clamp(p * 2.5)); tr(el, x, y, Math.max(0.01, (s || 1) * (0.6 + 0.4 * p)), r); return p; };
  const fade = (el, t, t0) => op(el, P(t, t0, 0.3, linear));
  const lbl = (parent, text, o) => { o = o || {}; return reg(chip(parent, text, { size: o.size || 30, fill: o.fill || 'rgba(10,27,39,0.9)', stroke: o.stroke || C.line, sw: o.sw || 3, color: o.color || C.ink, weight: 700 })); };
  // fit text (down to 26 px) to maxW
  function fit(parent, x, y, str, o, maxW) {
    let size = o.size;
    while (size > 26 && textWidth(str.replace(/\*\*/g, ''), size, FD, o.weight || 700) > maxW) size -= 1;
    return T(parent, x, y, str, Object.assign({}, o, { size }));
  }
  function drop(parent) {
    const g = G(parent);
    E('path', { d: 'M0,-36 C14,-14 24,0 24,14 A24,24 0 0,1 -24,14 C-24,0 -14,-14 0,-36 Z', fill: ball(C.water, C.waterDk), stroke: C.waterDk, 'stroke-width': 3 }, g);
    return g;
  }
  function confetti(parent, n, seed) {
    const g = G(parent), r = rng(seed), ps = [], cols = ['#FFE45C', '#FF6FB5', '#56D69B', '#5AB4FF', '#FF8A3D', '#F0A27E'];
    for (let i = 0; i < n; i++) ps.push({ el: E('rect', { x: -6, y: -10, width: 12, height: 20, rx: 2, fill: cols[i % 6] }, g), x: 40 + r() * 1120, d: r() * 1.2, v: 200 + r() * 180, sw: r() * TAU, rot: (r() - 0.5) * 600 });
    g.upd = (t, t0) => ps.forEach(p => {
      const u = t - t0 - p.d;
      if (u < 0) { op(p.el, 0); return; }
      op(p.el, 1);
      tr(p.el, p.x + 40 * Math.sin(u * 2.2 + p.sw) * AMP, 90 + ((u * p.v) % 530), 1, (p.rot * u * AMP) % 360);
    });
    return g;
  }
  function trophy(parent) {
    const g = G(parent);
    E('rect', { x: -46, y: 56, width: 92, height: 24, rx: 6, fill: '#5A3A12', stroke: SC_INK, 'stroke-width': 3 }, g);
    E('path', { d: 'M-14,56 L-10,30 L10,30 L14,56 Z', fill: ball('#FFE07A', '#B5891A'), stroke: SC_INK, 'stroke-width': 3 }, g);
    E('path', { d: 'M-26,-100 L-26,4 A26,26 0 0,0 26,4 L26,-100 Z', fill: ball('#FFE07A', '#B5891A'), stroke: SC_INK, 'stroke-width': 4 }, g);
    E('ellipse', { cx: 0, cy: -100, rx: 32, ry: 8, fill: '#FFE9A8', stroke: SC_INK, 'stroke-width': 3 }, g);
    E('rect', { x: 8, y: -88, width: 8, height: 80, rx: 4, fill: '#FFFFFF', opacity: 0.5 }, g);
    E('path', { d: 'M-26,-60 Q-58,-60 -54,-30 Q-50,-8 -26,-12 M26,-60 Q58,-60 54,-30 Q50,-8 26,-12', fill: 'none', stroke: '#C9A227', 'stroke-width': 7 }, g);
    g.sp = spark(g, 14, { color: '#FFF7C2' }); tr(g.sp, 30, -100);
    return g;
  }

  /* ---------- layers ---------- */
  const world = G(root);
  const Wbg = G(world), Wcast = G(world), Wfront = G(world), Wprops = G(world);
  const Lfg = G(root), Lhud = G(root);

  /* ---------- sets ---------- */
  const kitchen = reg(tkKitchen(Wbg));
  const confs = {};
  ['arrow', 'olly', 'mass', 'ferris', 'monty'].forEach(k => { confs[k] = reg(tkConf(Wbg, k)); });
  const logoBg = reg(G(Wbg));
  E('rect', { x: -100, y: -100, width: 1400, height: 950, fill: linGrad('#160D2E', '#4A1A45', true) }, logoBg);
  let rays = '';
  for (let i = 0; i < 16; i++) { const a0 = i / 16 * TAU, a1 = a0 + TAU / 40; rays += `M0,0 L${(Math.cos(a0) * 1100).toFixed(0)},${(Math.sin(a0) * 1100).toFixed(0)} L${(Math.cos(a1) * 1100).toFixed(0)},${(Math.sin(a1) * 1100).toFixed(0)} Z `; }
  const rayP = E('path', { d: rays, fill: '#FF9BD2', opacity: 0.07 }, logoBg);
  const dim = reg(E('rect', { x: -100, y: -100, width: 1400, height: 950, fill: '#05030C' }, Wbg));
  const counter = reg(tkCounter(Wfront));
  const spots = [0, 1].map(() => reg(E('path', { d: 'M-50,-560 L50,-560 L190,0 L-190,0 Z', fill: glow('#FFF4C2') }, Wfront)));

  /* ---------- the cast ---------- */
  const ch = {};
  ['kat', 'olly', 'mass', 'arrow', 'ferris', 'monty'].forEach(k => { ch[k] = reg(cast(Wcast, k)); });
  const katLid = G(ch.kat.firstChild);
  E('ellipse', { cx: -25, cy: -44, rx: 17.5, ry: 19.5, fill: '#D9E0E7', stroke: SC_INK, 'stroke-width': 3 }, katLid);
  E('path', { d: 'M-38,-42 Q-25,-34 -12,-42', fill: 'none', stroke: SC_INK, 'stroke-width': 3.5, 'stroke-linecap': 'round' }, katLid);
  // a little fresh rust on Ferris's copper (he's so happy he could rust)
  const newRust = G(ch.ferris.firstChild);
  const NR = [[22, 30, 12, 9], [-26, 62, 10, 12], [12, 88, 8, 7]].map(([x, y, rx, ry], i) => {
    const g = G(newRust); tr(g, x, y);
    E('path', { d: closedPath(blobPts(rx, ry, 7, 0, 0.3, 70 + i)), fill: i % 2 ? '#B5531E' : '#C9692A' }, g); return g;
  });

  /* ===== A: the board ===== */
  const boardA = reg(tkBoard(Wprops, 640, 200, ''));
  T(boardA, 0, -6, '6 EXAM TRAPS', { size: 66, weight: 800, anchor: 'middle', fill: C.energy, ls: 3 });
  const boardSub = T(boardA, 0, 60, 'the cast saves you some marks', { size: 32, weight: 700, anchor: 'middle', fill: '#FFF7C2' });

  /* ===== B: trap cards ===== */
  const CX = 890;
  function trapCard(n) {
    const g = reg(G(Lfg));
    card(g, 620, 130, 540, 430, { fill: 'rgba(10,27,39,0.94)', stroke: C.line, sw: 3 });
    const h = chip(g, 'TRAP ' + n, { size: 30, fill: C.bad, color: '#FFFFFF', weight: 800 }); tr(h, CX, 178);
    return g;
  }
  // 1: arrow, not equals
  const k1 = trapCard(1);
  const k1a = G(k1); T(k1a, 770, 360, '→', { size: 130, weight: 800, anchor: 'middle', fill: '#FFD54A' }); tr(tick(k1a, 22), 770, 400);
  const k1b = G(k1); T(k1b, 1010, 360, '=', { size: 130, weight: 800, anchor: 'middle', fill: '#9FB0BF' }); const k1x = cross(k1b, 40); tr(k1x, 1010, 318);
  const k1t = fit(k1, CX, 480, 'equations use an **ARROW**', { size: 34, weight: 700, anchor: 'middle', boldFill: '#FFD54A' }, 500);
  const k1u = fit(k1, CX, 526, 'never an equals sign', { size: 30, weight: 700, anchor: 'middle', fill: C.bad }, 500);
  const eqGag = reg(G(Lfg)); T(eqGag, 0, 40, '=', { size: 130, weight: 800, anchor: 'middle', fill: '#E9EEF2' }); const eqGagX = cross(eqGag, 34); eqGagX.firstChild.setAttribute('stroke-width', 7);
  // 2: big numbers, never a subscript
  const k2 = trapCard(2);
  const k2t = fit(k2, CX, 250, 'balance with **BIG** numbers in front', { size: 32, weight: 700, anchor: 'middle', boldFill: C.energy }, 500);
  const k2a = G(k2); tkFormula(k2a, 800, 360, '2H2O', { size: 72 }); tr(tick(k2a, 22), 990, 340);
  const k2b = G(k2); tkFormula(k2b, 800, 455, 'H2O2', { size: 64, fill: '#C9D3DC' }); E('line', { x1: 720, y1: 438, x2: 885, y2: 438, stroke: C.bad, 'stroke-width': 7, 'stroke-linecap': 'round' }, k2b); tr(cross(k2b, 22), 990, 438);
  const k2u = fit(k2, CX, 526, 'never change a subscript', { size: 30, weight: 700, anchor: 'middle', fill: C.bad }, 500);
  const bleach = reg(G(Lfg));
  E('path', { d: 'M-34,70 L-34,-20 Q-34,-40 -14,-46 L-14,-66 L14,-66 L14,-46 Q34,-40 34,-20 L34,70 Z', fill: '#F4F7FA', stroke: SC_INK, 'stroke-width': 4 }, bleach);
  E('rect', { x: -16, y: -84, width: 32, height: 20, rx: 4, fill: '#3F5BD9', stroke: SC_INK, 'stroke-width': 3 }, bleach);
  const blT = T(bleach, 0, 22, 'BLEACH', { size: 26, weight: 800, anchor: 'middle', fill: '#3F5BD9' }); blT.setAttribute('transform', 'rotate(-90 0 14)');
  // 3: mass never destroyed
  const k3 = trapCard(3);
  const k3t = fit(k3, CX, 250, 'mass is **NEVER** destroyed', { size: 34, weight: 700, anchor: 'middle', boldFill: C.energy }, 500);
  const k3f = G(k3); const fl3 = flask(k3f, 0.8, { level: 0.4, liquid: '#BFE3FF' }); tr(fl3, 800, 420);
  const k3b = bubbles(k3f, 760, 410, 80, 80, { n: 6, r: 6, seed: 3 });
  const k3m = [0, 1].map(() => molCO2(k3, 18, { letter: true }));
  const k3g = T(k3, 1010, 380, 'a gas', { size: 32, weight: 800, anchor: 'middle', fill: C.co2 });
  const k3g2 = T(k3, 1010, 420, 'escaped ↑', { size: 32, weight: 800, anchor: 'middle', fill: C.co2 });
  const k3u = fit(k3, CX, 526, 'if the mass seems to drop', { size: 30, weight: 700, anchor: 'middle', fill: C.muted }, 500);
  // 4: oxygen AND water
  const k4 = trapCard(4);
  const k4t = fit(k4, CX, 250, 'rusting needs', { size: 36, weight: 800, anchor: 'middle', fill: '#FF9A50' }, 500);
  const k4a = G(k4); const o4 = molO2(k4a, 26, { letter: true }); tr(o4, 760, 340); T(k4a, 760, 400, 'oxygen', { size: 30, weight: 700, anchor: 'middle', fill: '#FFB3A8' });
  const k4n = T(k4, CX, 352, 'AND', { size: 40, weight: 800, anchor: 'middle', fill: C.energy });
  const k4b = G(k4); const d4 = drop(k4b); tr(d4, 1020, 340); T(k4b, 1020, 400, 'water', { size: 30, weight: 700, anchor: 'middle', fill: '#9FE3FF' });
  const k4u = fit(k4, CX, 500, 'not just air ✗', { size: 36, weight: 800, anchor: 'middle', fill: C.bad }, 500);
  // 5: incomplete combustion
  const k5 = trapCard(5);
  const k5t = fit(k5, CX, 245, 'incomplete combustion makes', { size: 32, weight: 700, anchor: 'middle', fill: '#FFB13B' }, 500);
  const k5a = G(k5); tkFormula(k5a, 790, 370, 'CO', { size: 96, fill: '#FF6070' }); T(k5a, 790, 420, 'carbon monoxide', { size: 28, weight: 700, anchor: 'middle', fill: '#FFB3A8' });
  const hat5 = G(k5a); tr(hat5, 770, 290, 0.55, -8);
  E('path', { d: 'M-52,0 L-44,-46 Q0,-62 44,-46 L52,0 Z', fill: '#3B3346', stroke: SC_INK, 'stroke-width': 5, 'stroke-linejoin': 'round' }, hat5);
  E('ellipse', { rx: 90, ry: 13, fill: '#3B3346', stroke: SC_INK, 'stroke-width': 5 }, hat5);
  const k5p = T(k5, 920, 364, '+', { size: 50, weight: 800, anchor: 'middle', fill: C.muted });
  const k5b = G(k5); const rr = rng(8);
  for (let i = 0; i < 9; i++) E('circle', { cx: 1030 + (rr() - 0.5) * 70, cy: 340 + (rr() - 0.5) * 40, r: 8 + rr() * 8, fill: '#15161A', stroke: '#6E7A86', 'stroke-width': 2 }, k5b);
  T(k5b, 1030, 420, 'soot', { size: 28, weight: 700, anchor: 'middle', fill: C.muted });
  const k5u = fit(k5, CX, 500, 'not just carbon dioxide', { size: 30, weight: 700, anchor: 'middle', fill: C.bad }, 500);
  // 6: exo / endo
  const k6 = trapCard(6);
  const k6a = G(k6); const th1 = thermometer(k6a, 190, C.bad); tr(th1, 770, 420);
  T(k6a, 770, 488, 'rises', { size: 28, weight: 700, anchor: 'middle', fill: C.muted }); T(k6a, 770, 530, 'EXOTHERMIC', { size: 32, weight: 800, anchor: 'middle', fill: '#FF8A3D' });
  const k6b = G(k6); const th2 = thermometer(k6b, 190, '#5AB4FF'); tr(th2, 1010, 420);
  T(k6b, 1010, 488, 'falls', { size: 28, weight: 700, anchor: 'middle', fill: C.muted }); T(k6b, 1010, 530, 'ENDOTHERMIC', { size: 32, weight: 800, anchor: 'middle', fill: '#5AB4FF' });
  const ar1 = G(k6a), ar2 = G(k6b);
  T(ar1, 830, 300, '↑', { size: 60, weight: 800, anchor: 'middle', fill: C.bad }); T(ar2, 1070, 300, '↓', { size: 60, weight: 800, anchor: 'middle', fill: '#5AB4FF' });

  /* ===== C/D/E: the winner ===== */
  const tro = reg(trophy(Wprops));
  const drum = lbl(Lfg, 'drrrrrrrrrrr...', { size: 32, color: C.muted });
  const cWin1 = lbl(Lfg, 'copper pushed out of copper sulfate', { size: 32, color: '#F0A27E', stroke: '#F0A27E' });
  const cWin2 = lbl(Lfg, 'genuinely NEW substances ✓', { size: 32, color: C.good, stroke: C.good });
  const conf = reg(confetti(Wprops, 34, 21));
  const rustPlus = lbl(Lfg, 'rust +1%', { size: 30, color: '#FF9A50', stroke: '#C9692A' });

  /* ===== F: logo ===== */
  const logo = reg(tkTitle(Lfg));
  const willReturn = reg(T(Lfg, 600, 480, 'will return', { size: 52, weight: 800, anchor: 'middle', fill: '#FFFFFF', ls: 2 }));

  /* ===== H/I ===== */
  const notUsed = lbl(Lfg, 'catalyst: NOT used up ✓', { size: 32, color: C.good, stroke: C.good });
  const twelve = lbl(Lfg, '12 reactions today', { size: 30, color: C.muted });

  /* cut points */
  const cB = at('t1') - 0.06, cC = at('winner') - 0.06, cD = at('ferris') - 0.06, cE = at('happy') - 0.06, cF = at('return') - 0.06,
    cG = at('tired') - 0.06, cH = at('weigh') - 0.06;
  const TRAPS = [['t1', 'arrow', k1], ['t2', 'olly', k2], ['t3', 'mass', k3], ['t4', 'ferris', k4], ['t5', 'monty', k5], ['t6', 'arrow', k6]];

  return t => {
    seen = new Set();
    const put = (k, x, y, s, st, r) => { const c = ch[k]; seen.add(c); op(c, st.op === undefined ? 1 : st.op); tr(c, x, y, s, r); c.set(Object.assign({ t, talk: scTalk(S, t, k) }, st)); };
    const kitShot = t < cB || (t >= cC && t < cF) || t >= cG;
    if (kitShot) { show(kitchen); kitchen.upd(t); show(counter); op(kitchen.sign, t < cB || t >= cG ? 0 : 1); }
    op(katLid, 0); op(newRust, 0);
    let wcam = cam(1, 600, 375);

    /* ---------- A: line-up ---------- */
    if (t < cB) {
      wcam = cam(1 + 0.03 * P(t, 0, cB, linear), 600, 450);
      put('kat', 1135, 549, 0.4, { mood: 'deadpan', still: true });
      put('olly', 175, 482, 0.7, { mood: 'happy', sparkle: 1 });
      put('mass', 380, 512, 0.65, { reading: '0.00 g' });
      put('arrow', 600, 500, 0.65, {});
      put('ferris', 800, 500, 0.7, { copper: 1, rust: 0.82 });
      put('monty', 1000, 505, 0.65, { look: -0.3 });
      popIn(boardA, t, at('intro') + 0.05, 600, 262);
      op(boardSub, P(t, mid('intro', 0.5), 0.3, linear));
    }

    /* ---------- B: six confessionals ---------- */
    if (t >= cB && t < cC) {
      let i = 0; while (i < 5 && t >= at(TRAPS[i + 1][0]) - 0.06) i++;
      const [id, who, kc] = TRAPS[i], a = at(id), m = f => mid(id, f), e = end(id);
      const cf = confs[who]; show(cf); cf.set(1, t);
      wcam = cam(1 + 0.05 * P(t, a, e - a, linear) + 0.05 * P(t, e, 0.5, linear), 330, 400);
      popIn(kc, t, a + 0.05, 0, 0);
      if (i === 0) {
        const ann = t > m(0.45) && t < m(0.78);
        put('arrow', 330, 430, 1.2, { mood: ann ? 'annoyed' : 'deadpan', look: t > m(0.3) && t < m(0.7) ? 0.6 : 0 });
        fade(k1a, t, m(0.12)); fade(k1b, t, m(0.45)); fade(k1x, t, m(0.6)); fade(k1t, t, m(0.2)); fade(k1u, t, m(0.5));
        const gp = P(t, m(0.45), 1.2, linear);
        show(eqGag, win(t, m(0.45), e + 0.3, 0.15)); tr(eqGag, 540, 250 - 40 * gp); op(eqGagX, P(t, m(0.6), 0.2, linear));
      } else if (i === 1 || i === 5) {
        if (i === 1) {
          const hard = t > m(0.68);
          put('olly', 330, 420, 1.15, { mood: hard ? 'sad' : t > m(0.2) ? 'smug' : 'happy', look: hard ? -0.6 : 0.4, sparkle: hard ? 0 : 1 });
          fade(k2t, t, m(0.08)); fade(k2a, t, m(0.2)); fade(k2b, t, m(0.45)); fade(k2u, t, m(0.5));
          popIn(bleach, t, m(0.72), 560, 520, 0.9, 10);
        } else {
          put('arrow', 330, 430, 1.2, { look: t > m(0.3) ? 0.6 : 0 });
          const r1 = P(t, m(0.1), 1.6, ease), r2 = P(t, m(0.55), 1.6, ease);
          th1.set(0.25 + 0.65 * r1); th2.set(0.85 - 0.65 * r2);
          fade(k6a, t, m(0.06)); fade(k6b, t, m(0.5)); op(ar1, r1); op(ar2, r2);
        }
      } else if (i === 2) {
        const dropped = t > m(0.55);
        put('mass', 330, 440, 1.15, { reading: dropped ? '181.95 g' : '182.40 g', lcd: dropped ? '#FF6070' : undefined, look: dropped ? 0.6 : 0, mood: 'deadpan' });
        fade(k3t, t, m(0.05)); fade(k3f, t, m(0.3)); k3b.upd(t);
        k3m.forEach((mm, j) => { const u = ((t - m(0.4)) * 0.45 + j * 0.5) % 1; op(mm, t > m(0.4) ? Math.sin(u * Math.PI) : 0); tr(mm, 810 + 30 * j + 90 * u, 330 - 50 * u); });
        fade(k3g, t, m(0.6)); fade(k3g2, t, m(0.62)); fade(k3u, t, m(0.45));
      } else if (i === 3) {
        put('ferris', 330, 420, 1.2, { copper: 1, rust: 0.82, look: t > m(0.3) ? 0.6 : 0 });
        fade(k4t, t, m(0.05)); fade(k4a, t, m(0.3)); fade(k4n, t, m(0.38)); fade(k4b, t, m(0.45)); fade(k4u, t, m(0.7));
      } else if (i === 4) {
        const me = t > m(0.86);
        put('monty', 330, 430, 1.1, { mood: 'smug', look: t > m(0.15) ? 0.6 : 0 });
        fade(k5t, t, m(0.05)); fade(k5a, t, m(0.2)); fade(k5p, t, m(0.35)); fade(k5b, t, m(0.38)); fade(k5u, t, m(0.6));
        op(hat5, me ? 1 : 0); tr(hat5, 770, 290 - 20 * (1 - P(t, m(0.86), 0.3, pop)), 0.55, -8);
        tr(k5a, 0, 0, 1);
      }
    }

    /* ---------- C/D/E: the winner ---------- */
    if (t >= cC && t < cF) {
      const land = P(t, at('ferris') - 0.1, 0.6, ease);
      if (t < cE) {
        const zp = P(t, at('ferris') + 0.3, 1.0, ease);
        wcam = cam(1 + 0.25 * zp, lerp(600, 500, zp), lerp(375, 440, zp));
        show(dim, lerp(0.55, 0.3, land));
        spots.forEach((sp, i) => { const sx = lerp(600 + (i ? -1 : 1) * 380 * Math.sin(t * (2 + i * 0.7) + i * 2) * AMP, 390, land); show(sp, 0.9); tr(sp, sx, 590); });
        put('kat', 1135, 549, 0.4, { mood: 'deadpan', still: true });
        const nerv = t < at('ferris') ? Math.sin(t * 3) * 0.8 : -0.8;
        put('olly', 170, 482, 0.7, { mood: t < at('ferris') ? 'neutral' : 'shock', look: t < at('ferris') ? nerv : 0.8, sparkle: 0 });
        put('mass', 990, 512, 0.65, { reading: '0.00 g', look: t < at('ferris') ? -nerv : -0.8 });
        put('arrow', 620, 490, 0.75, { look: t > at('ferris') ? -0.8 : 0 });
        const won = t > mid('ferris', 0.45);
        put('ferris', 390, 500, 0.75, { copper: 1, rust: 0.82, mood: t > at('ferris') + 0.4 ? 'shock' : 'sad', look: won ? 0.6 : 0 });
        const hp = P(t, mid('ferris', 0.5), 0.8, ease);
        show(tro); tr(tro, lerp(790, 490, hp), 500 - 40 * Math.sin(hp * Math.PI) - 10, 0.85); tro.sp.upd(t);
        popIn(drum, t, at('winner') + 0.2, 600, 200);
        if (t > at('ferris') - 0.1) op(drum, 0);
        popIn(cWin1, t, mid('ferris', 0.25), 600, 170);
        popIn(cWin2, t, mid('ferris', 0.55), 600, 236);
      } else {
        // E: happy
        wcam = cam(1.65 + 0.06 * P(t, cE, cF - cE, linear), 420, 450, 560, 420);
        put('kat', 1135, 549, 0.4, { mood: 'deadpan', still: true });
        put('arrow', 620, 490, 0.75, { look: -0.8 });
        const bounceY = Math.abs(Math.sin(t * 4)) * 8 * AMP;
        put('ferris', 390, 500 - bounceY, 0.75, { copper: 1, rust: 0.82, mood: 'happy' });
        const rg = P(t, end('happy'), 0.6, ease);
        op(newRust, rg); NR.forEach((g, i) => g.setAttribute('transform', `translate(${[22, -26, 12][i]} ${[30, 62, 88][i]}) scale(${(0.4 + 0.8 * rg).toFixed(3)})`));
        show(tro); tr(tro, 490, 460 - bounceY, 0.85); tro.sp.upd(t);
        show(conf); conf.upd(t, cE + 0.1);
        popIn(rustPlus, t, end('happy') + 0.15, 900, 250);
      }
    }

    /* ---------- F: logo ---------- */
    if (t >= cF && t < cG) {
      show(logoBg); tr(rayP, 600, 600, 1, (t * 6 * AMP) % 360);
      const lp = P(t, at('return') + 0.05, 0.6, pop);
      show(logo, clamp(lp * 2.5)); tr(logo, 600, 300, Math.max(0.01, 0.5 + 0.5 * lp));
      show(willReturn, P(t, mid('return', 0.5), 0.4, linear));
    }

    /* ---------- G/H/I: night, Kat on the scales ---------- */
    if (t >= cG) {
      show(dim, 0.45);
      const onPan = t >= cH;
      const zp = onPan ? P(t, cH, 0.01, linear) : 0;
      const cz = P(t, at('again') - 0.35, 0.5, ease);
      wcam = onPan ? cam(lerp(1.3, 1.55, cz) + 0.04 * P(t, at('again'), S.D - at('again'), linear), lerp(740, 850, cz), lerp(440, 450, cz), 600, lerp(420, 400, cz)) : cam(1 + 0.05 * P(t, cG, cH - cG, linear), 600, 450);
      void zp;
      put('arrow', 400, 470, 0.95, { look: 1, mood: 'deadpan' });
      put('mass', 850, 470, 0.8, { reading: onPan ? '5.00 g' : '0.00 g', look: onPan ? 0 : -0.6, still: true });
      const panY = 470 - 72 * 0.8;
      const eye = t > at('again') - 0.15 && t < end('again') + 0.5;
      if (onPan) {
        put('kat', 850, panY - 98 * 0.42, 0.42, { mood: eye ? 'neutral' : 'deadpan', still: true, look: eye ? -0.6 : 0 });
        op(katLid, eye ? 1 : 0);
        popIn(notUsed, t, mid('weigh', 0.6), 760, 190); if (cz > 0) op(notUsed, 1 - cz);
      } else {
        put('kat', 650, 549, 0.42, { mood: 'deadpan', still: true });
        popIn(twelve, t, mid('tired', 0.35), 650, 330);
      }
      if (t > end('again') + 0.3) {
        const lp = P(t, end('again') + 0.3, 0.6, pop);
        show(logo, clamp(lp * 2.5)); tr(logo, 900, 150, Math.max(0.01, 0.38 * (0.6 + 0.4 * lp)));
        op(notUsed, 0);
      }
    }

    world.setAttribute('transform', wcam);
    M.forEach(el => { if (!seen.has(el)) op(el, 0); });
  };
});
