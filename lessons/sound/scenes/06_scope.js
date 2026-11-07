/* Chapter 6, Seeing sound on an oscilloscope.
   Beats: a speaker's sound arcs reach a microphone, whose diaphragm vibrates -> an electrical signal
   runs along a wire -> the oscilloscope lights and draws a trace -> spacing shows frequency -> height
   shows amplitude -> louder: taller, peaks keep their spacing -> higher: more waves, height stays put
   (showpiece) -> your turn: traces A and B -> the answers -> the exam words.
   The sound is modelled once: keys say what reaches the microphone (and so the trace) at time t; the
   speaker makes it DLY seconds earlier, and each arc keeps the pitch and loudness it was made with. */
scene('scope', S => {
  const { at, mid } = S, root = S.root;
  const calm = S.reduce ? 0.35 : 1;

  /* ---------- helpers ---------- */
  function rich(parent, x, y, segs, o) {
    o = o || {};
    const t = E('text', { x, y, 'font-size': o.size || 30, 'font-weight': o.weight || 600, 'font-family': o.font || FD, 'text-anchor': o.anchor || 'start', fill: o.fill || C.ink }, parent);
    segs.forEach(s => { if (typeof s === 'string') s = [s]; E('tspan', { fill: s[1], 'font-weight': s[2] }, t).textContent = s[0]; });
    return t;
  }
  const textLen = el => { let w = 0; try { w = el.getComputedTextLength(); } catch (e) { w = 0; } return w || el.textContent.length * 17; };
  function integral(keys) {
    const cum = [0];
    for (let i = 1; i < keys.length; i++) cum.push(cum[i - 1] + (keys[i][0] - keys[i - 1][0]) * (keys[i][1] + keys[i - 1][1]) / 2);
    return t => {
      if (t <= keys[0][0]) return keys[0][1] * (t - keys[0][0]);
      for (let i = 1; i < keys.length; i++) if (t <= keys[i][0]) {
        const [t0, f0] = keys[i - 1], [t1, f1] = keys[i], u = t - t0, k = (f1 - f0) / ((t1 - t0) || 1);
        return cum[i - 1] + f0 * u + 0.5 * k * u * u;
      }
      const n = keys.length - 1; return cum[n] + keys[n][1] * (t - keys[n][0]);
    };
  }
  function rateAt(keys, t) {
    if (t <= keys[0][0]) return keys[0][1];
    for (let i = 1; i < keys.length; i++) if (t <= keys[i][0]) return lerp(keys[i - 1][1], keys[i][1], ease(clamp((t - keys[i - 1][0]) / ((keys[i][0] - keys[i - 1][0]) || 1))));
    return keys[keys.length - 1][1];
  }
  /* loudspeaker: dark box with a grey cone facing right; origin = box centre, cone mouth at x = 58 */
  function speaker(parent) {
    const g = G(parent);
    E('rect', { x: -62, y: -76, width: 84, height: 152, rx: 14, fill: '#162531', stroke: '#47667C', 'stroke-width': 3 }, g);
    E('circle', { cx: -20, cy: -44, r: 9, fill: '#24394A', stroke: '#47667C', 'stroke-width': 2 }, g);
    E('circle', { cx: -20, cy: 46, r: 5, fill: '#24394A' }, g);
    g.cone = G(g);
    E('path', { d: 'M16,-24 L54,-66 L54,66 L16,24 Z', fill: linGrad('#DCE4EA', '#7D8C98', true), stroke: '#EEF3F6', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, g.cone);
    E('ellipse', { cx: 54, cy: 0, rx: 5, ry: 66, fill: 'none', stroke: '#566875', 'stroke-width': 5 }, g.cone);
    E('ellipse', { cx: 18, cy: 0, rx: 7, ry: 22, fill: '#8594A0', stroke: '#E1E8ED', 'stroke-width': 2 }, g.cone);
    return g;
  }
  /* microphone in profile, head facing left; origin = centre of the head. g.setDia(bow px) flexes the diaphragm */
  function microphone(parent) {
    const g = G(parent);
    E('path', { d: 'M30,-15 L112,-10 Q120,-10 120,-2 L120,2 Q120,10 112,10 L30,15 Z', fill: linGrad('#6A7C89', '#2A3640', true), stroke: '#8FA3B2', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, g);
    E('rect', { x: 24, y: -20, width: 12, height: 40, rx: 4, fill: '#8FA3B2' }, g);
    E('circle', { r: 32, fill: 'rgba(160,180,195,0.14)', stroke: '#C9D6DE', 'stroke-width': 4 }, g);
    const mesh = G(g, { opacity: 0.35 });
    [-16, 0, 16].forEach(v => {
      const k = Math.sqrt(32 * 32 - v * v) - 3;
      E('line', { x1: v, x2: v, y1: -k, y2: k, stroke: '#C9D6DE', 'stroke-width': 2 }, mesh);
      E('line', { x1: -k, x2: k, y1: v, y2: v, stroke: '#C9D6DE', 'stroke-width': 2 }, mesh);
    });
    g.dia = E('path', { fill: 'none', stroke: C.energyLt, 'stroke-width': 4.5, 'stroke-linecap': 'round' }, g);
    g.setDia = b => g.dia.setAttribute('d', `M-14,-24 Q${(-14 + 2 * b).toFixed(1)},0 -14,24`);
    g.setDia(0);
    return g;
  }
  /* oscilloscope screen w x h centred on (0,0): dark green, grid at 40%, dashed rest line */
  function screen(parent, w, h) {
    const g = G(parent);
    g.face = E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: 18, fill: '#06140F', stroke: '#2E4A3C', 'stroke-width': 3 }, g);
    g.grid = G(g, { opacity: 0.4 });
    for (let i = 1; i < 10; i++) E('line', { x1: -w / 2 + i * w / 10, x2: -w / 2 + i * w / 10, y1: -h / 2 + 4, y2: h / 2 - 4, stroke: C.line, 'stroke-width': 1.5 }, g.grid);
    for (let j = 1; j < 8; j++) if (j !== 4) E('line', { x1: -w / 2 + 4, x2: w / 2 - 4, y1: -h / 2 + j * h / 8, y2: -h / 2 + j * h / 8, stroke: C.line, 'stroke-width': 1.5 }, g.grid);
    g.rest = E('line', { x1: -w / 2 + 10, x2: w / 2 - 10, y1: 0, y2: 0, stroke: '#3E8A66', 'stroke-width': 2.5, 'stroke-dasharray': '9 8' }, g);
    return g;
  }
  /* a green trace with a soft phosphor halo (two kit sineWaves); g.set({ amp, wl }) */
  function scopeTrace(parent, w, amp, wl) {
    const g = G(parent);
    const halo = sineWave(g, { w, amp, wl, color: C.good, width: 15 }); halo.firstChild.setAttribute('opacity', 0.16);
    const line = sineWave(g, { w, amp, wl, color: C.good, width: 5 });
    g.set = v => { halo.set(v); line.set(v); };
    return g;
  }
  /* vertical arrow from the rest line up to a crest; g.set(x, y0, y1) */
  function vArrow(parent, color) {
    const g = G(parent);
    const ln = E('line', { stroke: color, 'stroke-width': 5, 'stroke-linecap': 'round' }, g);
    const hd = E('path', { d: 'M0,0 L-11,16 L11,16 Z', fill: color, 'stroke-linejoin': 'round' }, g);
    g.set = (x, y0, y1) => { attr(ln, 'x1', x); attr(ln, 'x2', x); attr(ln, 'y1', y0); attr(ln, 'y2', y1 + 12); tr(hd, x, y1); };
    return g;
  }
  /* horizontal bracket with end ticks; g.set(x1, x2, y) */
  function hBracket(parent, color) {
    const g = G(parent);
    const p = E('path', { fill: 'none', stroke: color, 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    g.set = (x1, x2, y) => p.setAttribute('d', `M${x1.toFixed(1)},${(y + 12).toFixed(1)} L${x1.toFixed(1)},${y.toFixed(1)} L${x2.toFixed(1)},${y.toFixed(1)} L${x2.toFixed(1)},${(y + 12).toFixed(1)}`);
    return g;
  }
  const label = (x, y, segs, size) => { const g = G(root); rich(g, x, y, segs, { size: size || 32, anchor: 'middle' }); return g; };

  /* ---------- the sound (what reaches the microphone at time t) ---------- */
  const DLY = 1.0, V = 136, R0 = 6, RANGE = 136;          // the arcs reach the diaphragm DLY s after leaving the cone
  const AMAX = 110;                                       // trace amplitude at full loudness
  const tClose = mid('spacing', 0.42), tSpread = mid('spacing', 0.74), tLouder = mid('louder', 0.1), tHigher = mid('higher', 0.1);
  const FK = [[0, 4], [tClose, 4], [tClose + 0.45, 7], [tSpread, 7], [tSpread + 0.45, 2], [at('height') - 0.1, 2], [at('height') + 0.35, 3], [tHigher, 3], [tHigher + 2.6, 7]];
  const LK = [[0, 0.75], [mid('height', 0.48), 0.75], [mid('height', 0.48) + 0.5, 1], [mid('height', 0.76), 1], [mid('height', 0.76) + 0.5, 0.35], [tLouder, 0.35], [tLouder + 2.4, 1]];
  const PHASE = integral(FK);
  const fAt = t => rateAt(FK, t), loudAt = t => rateAt(LK, t);
  // the speaker makes each crest when PHASE(t + DLY) passes a whole number; it carries that moment's loudness
  const EMIT = [];
  { let ph = PHASE(-3 + DLY); for (let tau = -3; tau <= S.D + 1; tau += 0.004) { const nph = PHASE(tau + 0.004 + DLY); if (Math.floor(nph) > Math.floor(ph)) { const tc = tau + 0.004 * (Math.floor(nph) - ph) / ((nph - ph) || 1); EMIT.push([tc, loudAt(tc + DLY)]); } ph = nph; } }

  /* ================= A. speaker, microphone, wire, oscilloscope ================= */
  const A = G(root);
  const SPX = 110, SPY = 330, MX = 320, MY = 330;
  const spk = speaker(A); tr(spk, SPX, SPY, 0.85);
  const MOUTH = SPX + 58 * 0.85;
  const arcG = G(A), arcs = [];
  for (let i = 0; i < 14; i++) arcs.push(E('path', { fill: 'none', stroke: C.air, 'stroke-linecap': 'round' }, arcG));
  const mic = microphone(A); tr(mic, MX, MY);
  const micLab = T(A, MX + 62, MY + 72, 'microphone', { size: 27, weight: 600, anchor: 'middle', fill: C.muted });
  // oscilloscope body, screen and knobs
  const SCX = 804, SCY = 350, SW = 440, SH = 340, TW = 408, TX = SCX - TW / 2;
  const scope = G(A);
  E('rect', { x: 556, y: 152, width: 594, height: 438, rx: 26, fill: linGrad('#2E414E', '#1C2A34', true), stroke: '#55738A', 'stroke-width': 3 }, scope);
  const glowBack = E('rect', { x: SCX - SW / 2 - 14, y: SCY - SH / 2 - 14, width: SW + 28, height: SH + 28, rx: 28, fill: 'rgba(86,214,155,0.10)' }, scope);
  const scr = screen(scope, SW, SH); tr(scr, SCX, SCY);
  [[1088, 236], [1088, 318], [1088, 400]].forEach(([x, y], i) => {
    E('circle', { cx: x, cy: y, r: 22, fill: ball('#9DB0BF', '#4E6170'), stroke: '#C9D6DE', 'stroke-width': 2 }, scope);
    E('line', { x1: x, y1: y, x2: x + 15 * Math.cos(-2 + i * 1.3), y2: y + 15 * Math.sin(-2 + i * 1.3), stroke: '#1C2A34', 'stroke-width': 4, 'stroke-linecap': 'round' }, scope);
  });
  const led = E('circle', { cx: 1088, cy: 486, r: 10, fill: '#1E3A2C', stroke: '#3E5A4A', 'stroke-width': 2 }, scope);
  const ledGlow = E('circle', { cx: 1088, cy: 486, r: 26, fill: glow(C.good) }, scope);
  E('circle', { cx: 566, cy: 470, r: 8, fill: '#0E1A22', stroke: '#C9D6DE', 'stroke-width': 3 }, scope);
  const sig = wire(A, [[MX + 120, MY], [470, MY], [470, 470], [560, 470]], { spacing: 34, dot: 5.5 });
  const sigLab = labelLine(A, 452, 552, 515, 474, 'electrical signal', { size: 27, anchor: 'end', fill: C.energy, line: C.energy });
  const scopeLab = T(A, 853, 634, 'oscilloscope', { size: 30, weight: 700, anchor: 'middle' });
  const trace = scopeTrace(scr, TW, AMAX * 0.75, TW / 4); tr(trace, -TW / 2, 0);
  // the trace is revealed left to right by a growing clip, with a bright pen dot at its tip
  const drawClip = E('rect', { x: -12, y: -200, width: 0, height: 400 }, E('clipPath', { id: 'soundScopeDraw' }, defs()));
  trace.setAttribute('clip-path', 'url(#soundScopeDraw)');
  const pen = G(A);
  E('circle', { r: 24, fill: glow(C.good) }, pen);
  E('circle', { r: 7, fill: '#D8FFEC' }, pen);
  const traceLab = labelLine(A, 536, 214, TX + TW / 16, SCY - AMAX * 0.75 - 2, 'trace', { size: 32, anchor: 'end', fill: C.good, line: C.good });
  // annotations on the screen
  const note = G(A);
  const brk = hBracket(note, C.energy), ampArr = vArrow(note, C.energy);
  const dots = [0, 1, 2].map(() => E('circle', { r: 8, fill: C.energy, stroke: '#3A3000', 'stroke-width': 2 }, note));
  const vGuides = [0, 1, 2].map(() => E('line', { y1: SCY - SH / 2 + 8, y2: SCY + SH / 2 - 8, stroke: C.energy, 'stroke-width': 2.5, 'stroke-dasharray': '4 7', opacity: 0.7 }, note));
  const hGuides = [-1, 1].map(() => E('line', { x1: TX - 6, x2: TX + TW + 6, stroke: C.energy, 'stroke-width': 3, 'stroke-dasharray': '10 8' }, note));
  // labels under the scope: the rule, then the example
  const LX = SCX, RA = 646, RB = 702;
  const sp1 = label(LX, RA, [['spacing', C.energy, 800], ' → ', ['frequency', C.energy, 800]]);
  const sp2 = label(LX, RB, ['close together = ', ['high pitch', C.air, 800]], 30);
  const sp3 = label(LX, RB, ['spread out = ', ['low pitch', C.air, 800]], 30);
  const ht1 = label(LX, RA, [['height', C.energy, 800], ' → ', ['amplitude', C.energy, 800]]);
  const ht2 = label(LX, RB, ['tall = ', ['loud', C.air, 800]], 30);
  const ht3 = label(LX, RB, ['short = ', ['quiet', C.air, 800]], 30);
  const ld1 = label(LX, RA, [['louder', C.energy, 800], ' → taller waves']);
  const ld2 = label(LX, RB, ['pitch unchanged: ', ['spacing the same', C.air, 800]], 30);
  const hi1 = label(LX, RA, [['higher', C.energy, 800], ' → more waves, same width']);
  const hi2 = label(LX, RB, ['loudness unchanged: ', ['height the same', C.air, 800]], 30);

  /* ================= B. your turn: traces A and B ================= */
  const B = G(root);
  const turn = chip(B, 'your turn', { size: 30, fill: C.energy, color: C.bg0 }); tr(turn, 600, 150);
  const QS = [
    { x: 335, name: 'A', amp: 100, wl: 200, desc: 'tall waves, far apart', ans: [['loud', C.energy, 800], ', ', ['low pitch', C.air, 800]] },
    { x: 865, name: 'B', amp: 34, wl: 50, desc: 'short waves, close together', ans: [['quiet', C.energy, 800], ', ', ['high pitch', C.air, 800]] },
  ].map(q => {
    const g = G(B);
    T(g, q.x, 186, q.name, { size: 46, weight: 700, anchor: 'middle', fill: C.good });
    const s = screen(g, 440, 280); tr(s, q.x, 345);
    const tc = scopeTrace(s, 400, q.amp, q.wl); tr(tc, -200, 0);
    const cue = G(g);
    const cx = q.x - 200 + q.wl / 4;
    E('line', { x1: cx, x2: cx, y1: 345, y2: 345 - q.amp + 2, stroke: C.energy, 'stroke-width': 5, 'stroke-linecap': 'round' }, cue);
    E('line', { x1: cx - 11, x2: cx + 11, y1: 345 - q.amp, y2: 345 - q.amp, stroke: C.energy, 'stroke-width': 4, 'stroke-linecap': 'round' }, cue);
    const bk = hBracket(cue, C.energy); bk.set(cx, cx + q.wl, 345 - q.amp - 30);
    const desc = T(g, q.x, 530, q.desc, { size: 28, weight: 600, anchor: 'middle', fill: C.muted });
    const ansG = G(g);
    const a = rich(ansG, 0, 11, q.ans, { size: 32, weight: 700, anchor: 'middle' });
    const aw = textLen(a) + 48;
    ansG.insertBefore(E('rect', { x: -aw / 2, y: -28, width: aw, height: 56, rx: 28, fill: C.card2, stroke: C.good, 'stroke-width': 3 }), a);
    return { g, cue, desc, ansG, x: q.x };
  });
  const thinkRing = ring(B, 30, C.energy); tr(thinkRing, 600, 345);
  const thinkQ = T(B, 600, 357, '?', { size: 34, weight: 700, anchor: 'middle', fill: C.energy });

  /* ================= C. exam words ================= */
  const Cg = G(root);
  card(Cg, 190, 150, 820, 432, { fill: C.card, stroke: C.line });
  T(Cg, 600, 218, 'In the exam, use the right words', { size: 40, weight: 700, anchor: 'middle' });
  const vague = G(Cg);
  T(vague, 452, 312, 'too vague:', { size: 30, weight: 600, anchor: 'end', fill: C.muted });
  const vWords = [['bigger', 560], ['wavier', 724]].map(([w, x]) => {
    const g = G(vague);
    const c = chip(g, w, { size: 30, fill: '#0E2230', stroke: C.faint, color: C.muted, sw: 2 }); tr(c, x, 302);
    const st = strike(g, x - c.w / 2 + 10, 302, x + c.w / 2 - 10);
    return { g, st };
  });
  const rowsC = [
    { y: 420, segs: ['loudness → ', ['amplitude', C.energy, 800]] },
    { y: 520, segs: ['pitch → ', ['frequency', C.energy, 800], ' (wave spacing)'] },
  ].map(r => {
    const g = G(Cg);
    const tx = rich(g, 262, r.y, r.segs, { size: 40, weight: 600 });
    const tk = tick(g, 17); tr(tk, 262 + textLen(tx) + 40, r.y - 13);
    return { g, tk };
  });

  /* ================= update ================= */
  function drawArcs(t) {
    let lo = 0, hi = EMIT.length - 1, last = -1;
    while (lo <= hi) { const m = (lo + hi) >> 1; if (EMIT[m][0] <= t) { last = m; lo = m + 1; } else hi = m - 1; }
    let j = 0;
    for (let i = last; i >= 0 && j < arcs.length; i--) {
      const age = t - EMIT[i][0], r = R0 + V * age, u = (r - R0) / RANGE;
      if (u >= 1) break;
      const loud = EMIT[i][1], half = (22 + 16 * loud) * Math.PI / 180, cx = MOUTH + r * Math.cos(half), cy = r * Math.sin(half);
      const el = arcs[j++];
      el.setAttribute('d', `M${cx.toFixed(1)},${(SPY - cy).toFixed(1)} A${r.toFixed(1)},${r.toFixed(1)} 0 0 1 ${cx.toFixed(1)},${(SPY + cy).toFixed(1)}`);
      el.setAttribute('stroke-width', (2 + 4 * loud).toFixed(2));
      op(el, Math.min(1, u * 6, (1 - u) * 7) * (0.3 + 0.7 * loud));
    }
    for (; j < arcs.length; j++) op(arcs[j], 0);
  }

  return t => {
    const aA = Math.min(P(t, S.first - 0.4, 0.4, linear), 1 - P(t, at('try') - 0.15, 0.45, linear));
    const aB = win(t, at('try') - 0.1, at('words') + 0.05, 0.45);
    const aC = P(t, at('words') - 0.1, 0.5, linear);
    op(A, aA); op(B, aB); op(Cg, aC);

    if (aA > 0) {
      /* sound: speaker -> arcs -> microphone */
      const on = P(t, S.first + 0.2, 0.6, linear);
      popScale(spk, t, S.first, SPX, SPY, 0.85);
      const lsp = loudAt(t + DLY), lmic = loudAt(t);
      tr(spk.cone, on * (1.5 + 3.5 * lsp) * Math.cos(TAU * PHASE(t + DLY)), 0);
      op(arcG, on); if (on > 0) drawArcs(t);
      const mp = P(t, mid('mic', 0.18), 0.5, pop);
      op(mic, clamp(mp * 2)); tr(mic, MX + (1 - clamp(mp)) * 20, MY);
      const hear = P(t, S.first + 0.2 + DLY, 0.3, linear);
      mic.setDia(hear * (2 + 5 * lmic) * Math.cos(TAU * PHASE(t)));
      op(micLab, win(t, mid('mic', 0.32), at('spacing') + 0.2, 0.4));
      const sOn = P(t, mid('mic', 0.6), 0.5, linear);
      op(sig, P(t, mid('mic', 0.45), 0.4, linear)); sig.set(sOn); sig.upd(t, 70);
      sigLab.set(win(t, mid('mic', 0.66), at('spacing') + 0.2, 0.4));
      /* the oscilloscope comes on and draws the trace */
      const pw = P(t, at('scope') + 0.1, 0.5, linear);
      op(scope, P(t, S.first + 0.3, 0.5, linear));
      op(scr.grid, pw); op(scr.rest, pw); op(glowBack, pw); op(ledGlow, pw * (0.75 + 0.25 * wave(t, 1.6) * calm));
      led.setAttribute('fill', pw > 0.5 ? C.good : '#1E3A2C');
      scr.face.setAttribute('fill', pw > 0.5 ? '#06140F' : '#040C09');
      const draw = P(t, mid('scope', 0.18), 1.6, linear);
      attr(drawClip, 'width', 12 + draw * (TW + 12));
      op(trace, pw);
      const amp = AMAX * lmic, wl = TW / fAt(t);
      trace.set({ amp, wl });
      op(pen, Math.min(P(t, mid('scope', 0.18), 0.15, linear), 1 - P(t, mid('scope', 0.18) + 1.6, 0.25, linear)));
      tr(pen, TX + draw * TW, SCY - amp * Math.sin(TAU * draw * TW / wl));
      op(scopeLab, win(t, at('scope') + 0.1, at('spacing') + 0.2, 0.4));
      traceLab.set(win(t, mid('scope', 0.6), at('spacing') + 0.2, 0.4));

      /* annotations */
      const crest = k => TX + wl / 4 + k * wl;
      // spacing: a bracket between two neighbouring peaks, near the middle of the screen
      const bOn = Math.max(win(t, mid('spacing', 0.12), tClose, 0.25), win(t, tClose + 0.5, tSpread, 0.25), win(t, tSpread + 0.5, at('height') - 0.1, 0.25));
      op(brk, bOn);
      if (bOn > 0) { const k = Math.max(0, Math.floor((SCX - TX - wl / 4) / wl)); brk.set(crest(k), crest(k + 1), SCY - amp - 26); }
      // height: an arrow from the rest line to a peak
      const aOn = win(t, mid('height', 0.1), at('louder') + 0.1, 0.35);
      op(ampArr, aOn);
      if (aOn > 0) ampArr.set(crest(1), SCY - 3, SCY - amp);
      // louder: dots on the peaks, with guides showing they only move up
      const dOn = win(t, tLouder - 0.5, at('higher') + 0.1, 0.35);
      dots.forEach((d, k) => { op(d, dOn); attr(d, 'cx', crest(k)); attr(d, 'cy', SCY - amp); });
      vGuides.forEach((g, k) => { op(g, dOn * P(t, mid('louder', 0.5), 0.5, linear)); attr(g, 'x1', crest(k)); attr(g, 'x2', crest(k)); });
      // higher: dashed lines at the top and bottom of the waves stay put
      const hOn = win(t, tHigher - 0.3, at('try') + 0.1, 0.35);
      hGuides.forEach((g, k) => { op(g, hOn); attr(g, 'y1', SCY + (k ? 1 : -1) * amp); attr(g, 'y2', SCY + (k ? 1 : -1) * amp); });
      // labels
      op(sp1, win(t, mid('spacing', 0.1), at('height') + 0.05, 0.4));
      op(sp2, win(t, tClose + 0.2, tSpread + 0.1, 0.35)); op(sp3, win(t, tSpread + 0.2, at('height') + 0.05, 0.35));
      op(ht1, win(t, mid('height', 0.1), at('louder') + 0.05, 0.4));
      op(ht2, win(t, mid('height', 0.5), mid('height', 0.78), 0.3)); op(ht3, win(t, mid('height', 0.78), at('louder') + 0.05, 0.3));
      op(ld1, win(t, mid('louder', 0.12), at('higher') + 0.05, 0.4)); op(ld2, win(t, mid('louder', 0.56), at('higher') + 0.05, 0.4));
      op(hi1, win(t, mid('higher', 0.12), at('try') + 0.05, 0.4)); op(hi2, win(t, mid('higher', 0.58), at('try') + 0.05, 0.4));
    } else [sp1, sp2, sp3, ht1, ht2, ht3, ld1, ld2, hi1, hi2].forEach(g => op(g, 0));

    /* your turn */
    if (aB > 0) {
      const pt = P(t, at('try') + 0.1, 0.5, pop); op(turn, clamp(pt * 2)); tr(turn, 600, 150, 0.9 + 0.1 * pt);
      QS.forEach((q, i) => {
        const p = P(t, at('try') + 0.15 + i * 0.25, 0.5, easeOut); op(q.g, p); tr(q.g, 0, (1 - p) * 18);
        const cueAt = mid('try', i ? 0.56 : 0.24);
        op(q.cue, P(t, cueAt, 0.4, linear)); op(q.desc, P(t, cueAt + 0.2, 0.4, linear));
        const ap = P(t, mid('answer', i ? 0.5 : 0.06), 0.5, pop);
        op(q.ansG, clamp(ap * 2)); tr(q.ansG, q.x, 600, 0.85 + 0.15 * ap);
      });
      const r0 = mid('try', 0.9), r1 = at('answer') - 0.1;
      const rOn = win(t, r0, r1 + 0.3, 0.3);
      op(thinkRing, rOn); op(thinkQ, rOn); thinkRing.set(P(t, r0, r1 - r0, linear));
    }

    /* exam words */
    if (aC > 0) {
      op(vague, P(t, mid('words', 0.1), 0.4, linear));
      vWords.forEach((v, i) => v.st.set(P(t, mid('words', 0.2 + i * 0.08), 0.35)));
      rowsC.forEach((r, i) => {
        const p = P(t, mid('words', i ? 0.6 : 0.36), 0.5, easeOut); op(r.g, p); tr(r.g, (1 - p) * 24, 0);
        const k = P(t, mid('words', i ? 0.6 : 0.36) + 0.55, 0.45, pop); op(r.tk, clamp(k * 2));
      });
    }
  };
  function popScale(el, t, t0, x, y, s) { const p = P(t, t0, 0.55, pop); op(el, clamp(p * 2)); tr(el, x, y, s * (0.8 + 0.2 * p)); }
});
