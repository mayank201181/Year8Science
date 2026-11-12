/* Scene 5: Freq and Amp.
   Beats: two empty spotlights (PITCH, LOUDNESS) -> Freq zips in (frequency, hertz, 1 Hz = 1 vibration per second)
   -> Amp stomps in (amplitude: rest position to the furthest point) -> Nigel's confessional (bubble tea cups,
   no indoor voice) -> scope: high/low frequency = high/low pitch -> big/small amplitude = loud/quiet
   -> Archie: "high = loud?" -> Freq whispers (high + quiet), Amp booms (low + loud), the wrong chip cracks
   -> independent: FAST PITCH, BIG BANG -> guitar: tighten, shorten, thinner -> pluck harder: same note, louder
   -> microphone -> oscilloscope -> trace -> reading a trace -> quiz A/B (thinking timer) -> Archie answers
   -> Nigel: "Correct." -> wavelength (lambda) on a frozen row -> time period T = 1 / f -> the wave equation. */
scene('scope', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;
  const talk = (t, who) => scTalk(S, t, who);

  /* ---------- local helpers (prefixed scope) ---------- */
  const scopeCam = (el, k, fx, fy, tx, ty) => el.setAttribute('transform', `translate(${tx.toFixed(1)} ${ty.toFixed(1)}) scale(${k.toFixed(4)}) translate(${(-fx).toFixed(1)} ${(-fy).toFixed(1)})`);
  const scopePop = (el, t, t0, x, y, s, r) => { const p = P(t, t0, 0.4, pop); op(el, clamp(p * 2.5)); tr(el, x, y, Math.max(0.01, (s || 1) * (0.6 + 0.4 * p)), r); return p; };
  const scopeShake = (t, t0, a) => (t >= t0 && t < t0 + 0.6 ? (a || 9) * AMP * (1 - (t - t0) / 0.6) * Math.sin((t - t0) * 70) : 0);
  function scopeLabel(parent, text, o) {
    o = o || {};
    return chip(parent, text, { size: o.size || 30, fill: o.fill || 'rgba(10,27,39,0.9)', stroke: o.stroke || C.line, sw: o.sw || 2, color: o.color || C.ink, weight: o.weight || 700 });
  }
  function scopeBigChip(parent, text, fill, color) {
    return chip(parent, text, { size: 34, fill, color: color || '#FFFFFF', stroke: '#FFFFFF', sw: 3 });
  }
  // a double-headed arrow from (x1,y1) to (x2,y2)
  function scopeDbl(parent, x1, y1, x2, y2, col, w) {
    const g = G(parent), mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
    arrow(g, mx, my, x1, y1, { color: col, width: w || 5 }); arrow(g, mx, my, x2, y2, { color: col, width: w || 5 });
    return g;
  }
  // a tiny whistle and a bass drum (icons beside the pitch chips)
  function scopeWhistle(parent) {
    const g = G(parent);
    E('path', { d: 'M-34,-14 L18,-14 Q36,-14 36,6 Q36,26 16,26 Q-2,26 -4,8 L-34,8 Z', fill: '#C9D3DC', stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
    E('circle', { cx: 16, cy: 6, r: 8, fill: '#6E7C8A' }, g);
    E('path', { d: 'M44,-26 L58,-36 M46,-6 L64,-6 M44,14 L58,24', stroke: '#FFE45C', 'stroke-width': 4, 'stroke-linecap': 'round' }, g);
    return g;
  }
  function scopeDrum(parent) {
    const g = G(parent);
    E('ellipse', { cx: 0, cy: 0, rx: 40, ry: 40, fill: '#F2F7FA', stroke: SC_INK, 'stroke-width': 4 }, g);
    E('ellipse', { cx: 0, cy: 0, rx: 30, ry: 30, fill: 'none', stroke: '#C2453A', 'stroke-width': 8 }, g);
    E('circle', { r: 7, fill: '#C2453A' }, g);
    return g;
  }
  // an empty bubble tea cup
  function scopeCup(parent, x, y, r) {
    const g = G(parent); tr(g, x, y, 1, r);
    E('path', { d: 'M-20,-36 L20,-36 L14,34 Q0,40 -14,34 Z', fill: '#F4EAD8', stroke: SC_INK, 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
    E('ellipse', { cx: 0, cy: -37, rx: 23, ry: 6, fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 3 }, g);
    E('line', { x1: 5, y1: -42, x2: 12, y2: -66, stroke: '#FF5FA2', 'stroke-width': 6, 'stroke-linecap': 'round' }, g);
    return g;
  }
  // a guitar string segment from x0 to x1 at y, vibrating: g.set(t, amp, f)
  function scopeString(parent, x0, x1, y, w) {
    const blur = E('path', { d: '', fill: 'rgba(255,228,92,0.18)', stroke: 'none' }, parent);
    const s = E('path', { d: '', fill: 'none', stroke: '#F2E6C8', 'stroke-width': w || 5, 'stroke-linecap': 'round' }, parent);
    return {
      set(t, a, f, xa) {
        const xs = xa === undefined ? x0 : xa, mx = (xs + x1) / 2, k = a * Math.sin(t * TAU * f);
        attr(s, 'd', `M${xs},${y} Q${mx.toFixed(1)},${(y + 2 * k).toFixed(1)} ${x1},${y}`);
        attr(blur, 'd', a > 0.5 ? `M${xs},${y} Q${mx.toFixed(1)},${(y - 2 * a).toFixed(1)} ${x1},${y} Q${mx.toFixed(1)},${(y + 2 * a).toFixed(1)} ${xs},${y} Z` : '');
      },
    };
  }

  /* layers: everything under one camera, the HUD above */
  const camG = G(root);
  const Lbg = G(camG), Lprop = G(camG), Lcast = G(camG), Lfg = G(camG), Lhud = G(root);

  /* ================= backgrounds ================= */
  const hallShot = G(Lbg);
  const hall = pioHall(hallShot);
  const hallDim = E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#0A1B27', opacity: 0 }, hallShot);
  const spots = [380, 840].map(x => {
    const g = G(hallShot);
    E('path', { d: `M${x - 34},64 L${x - 160},610 L${x + 160},610 L${x + 34},64 Z`, fill: '#FFF6C8', opacity: 0.22 }, g);
    E('ellipse', { cx: x, cy: 600, rx: 160, ry: 38, fill: '#FFF6C8', opacity: 0.55 }, g);
    return g;
  });
  const darkShot = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#0F2238', '#1C3C5E', true) }, darkShot);
  { let d = ''; for (let x = 0; x <= 1200; x += 60) d += `M${x},0 V750 `; for (let y = 0; y <= 750; y += 60) d += `M0,${y} H1200 `; E('path', { d, stroke: '#FFFFFF', 'stroke-width': 1, opacity: 0.04 }, darkShot); }
  const conf = pioConf(Lbg, 'nigel');

  /* ================= A: the two spotlights ================= */
  const pitchChip = scopeLabel(Lfg, 'PITCH: how high or low', { size: 32, color: '#C9F27A', stroke: '#C9F27A' });
  const loudChip = scopeLabel(Lfg, 'LOUDNESS: how loud or quiet', { size: 32, color: '#FFB08A', stroke: '#FFB08A' });

  /* ================= B: Freq ================= */
  const tea = pioBubbleTea(Lcast, 0.8);
  const zip = G(Lcast);
  [0, 1, 2].forEach(i => E('line', { x1: -60 - i * 20, y1: -60 + i * 50, x2: -200 - i * 30, y2: -60 + i * 50, stroke: '#FFFFFF', 'stroke-width': 6, 'stroke-linecap': 'round', opacity: 0.8 }, zip));
  const fChip1 = scopeBigChip(Lfg, 'FREQUENCY = vibrations per second', '#4E9A1E');
  const fChip2 = scopeLabel(Lfg, 'unit: hertz (Hz)', { size: 32, color: '#C9F27A', stroke: '#C9F27A' });
  const fChip3 = scopeLabel(Lfg, '1 Hz = 1 vibration per second', { size: 32, color: '#FFFFFF', stroke: '#C9F27A' });
  const ltFreq = scLowerThird(Lhud, 'FREQ', 'Frequency. Vibrations per second.');

  /* ================= C: Amp and the amplitude diagram ================= */
  const ampDia = G(Lfg);
  E('rect', { x: 600, y: 96, width: 560, height: 210, rx: 18, fill: 'rgba(10,27,39,0.88)', stroke: '#FFB08A', 'stroke-width': 2 }, ampDia);
  E('line', { x1: 630, y1: 230, x2: 1130, y2: 230, stroke: '#FFFFFF', 'stroke-width': 3, 'stroke-dasharray': '10 8', opacity: 0.7 }, ampDia);
  const diaW = G(ampDia); tr(diaW, 640, 230);
  sineWave(diaW, { w: 480, amp: 52, wl: 240, color: '#FF9A6C', width: 5 });
  scopeDbl(ampDia, 700, 230, 700, 180, '#FFE45C', 5);
  T(ampDia, 722, 172, 'furthest point', { size: 26, weight: 700, anchor: 'start', fill: '#FFE45C' });
  T(ampDia, 1130, 270, 'rest position', { size: 26, weight: 700, anchor: 'end', fill: '#FFFFFF' });
  T(ampDia, 860, 140, 'AMPLITUDE', { size: 40, weight: 800, anchor: 'middle', fill: '#FFB08A' });
  const ltAmp = scLowerThird(Lhud, 'AMP', 'Amplitude. Size of the vibration.');

  /* ================= D: Nigel's confessional insets ================= */
  const inset1 = G(Lfg);
  E('rect', { x: -190, y: -150, width: 380, height: 300, rx: 18, fill: '#FBF7EC', stroke: '#C9BFA6', 'stroke-width': 4 }, inset1);
  T(inset1, 0, -108, 'Freq, by 10 a.m.', { size: 30, weight: 800, anchor: 'middle', fill: SC_INK });
  [[-60, 100, -4], [0, 100, 3], [60, 100, -2], [-30, 18, 2], [30, 18, -5], [0, -64, 4]]
    .forEach(([x, y, r]) => scopeCup(inset1, x, y + 24, r));
  const inset2 = G(Lfg);
  E('rect', { x: -190, y: -110, width: 380, height: 220, rx: 18, fill: '#FBF7EC', stroke: '#C9BFA6', 'stroke-width': 4 }, inset2);
  T(inset2, 0, -60, 'Amp’s indoor voice:', { size: 30, weight: 800, anchor: 'middle', fill: SC_INK });
  const nf = G(inset2); tr(nf, 0, 30, 1, -6);
  E('rect', { x: -150, y: -40, width: 300, height: 80, rx: 10, fill: 'none', stroke: '#C62828', 'stroke-width': 6 }, nf);
  T(nf, 0, 16, 'NOT FOUND', { size: 46, weight: 800, anchor: 'middle', fill: '#C62828' });

  /* ================= the oscilloscope (pitch, loud, whisper, boom, scope, read) ================= */
  const scope = pioScope(Lprop, 480, 270);
  const ann = G(scope);   // reading annotations, in the scope's own coordinates
  scopeDbl(ann, 30, 0, 30, -80, '#FF8FB0', 5);
  scopeDbl(ann, -90, -112, 30, -112, '#7FE0FF', 5);
  E('line', { x1: -240, y1: 0, x2: 240, y2: 0, stroke: '#FFFFFF', 'stroke-width': 2, 'stroke-dasharray': '8 6', opacity: 0.6 }, ann);
  const pHi = G(Lfg), pLo = G(Lfg);
  tr(scopeWhistle(pHi), -300, 0); tr(scopeBigChip(pHi, 'HIGH frequency → HIGH pitch', '#4E9A1E'), 40, 0);
  tr(scopeDrum(pLo), -300, 0); tr(scopeBigChip(pLo, 'LOW frequency → LOW pitch', '#2E6E12'), 40, 0);
  const lBig = scopeBigChip(Lfg, 'BIG amplitude → LOUD', '#C2502A');
  const lSmall = scopeBigChip(Lfg, 'SMALL amplitude → QUIET', '#8A3A1E');
  const wrongChip = G(Lfg);
  const wcL = G(wrongChip), wcR = G(wrongChip);
  [wcL, wcR].forEach((h, i) => {
    const cp = E('clipPath', { id: 'scopeWc' + i }, defs());
    E('rect', { x: i ? 0 : -300, y: -60, width: 300, height: 120 }, cp);
    h.setAttribute('clip-path', `url(#scopeWc${i})`);
    const inner = G(h);
    chip(inner, 'high = loud?', { size: 44, fill: '#FFFFFF', color: '#C62828', stroke: '#C62828', sw: 4 });
  });
  const crack = E('path', { d: 'M2,-40 L-8,-14 L8,2 L-6,20 L4,40', fill: 'none', stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, wrongChip);
  const shh = G(Lfg);
  E('path', { d: 'M-70,0 Q-80,-40 -40,-44 Q-20,-70 20,-56 Q60,-62 66,-24 Q86,6 50,22 Q10,40 -30,26 Q-70,30 -70,0 Z', fill: '#FFFFFF', opacity: 0.85, stroke: '#C9D3DC', 'stroke-width': 3 }, shh);
  T(shh, -2, -2, 'shh…', { size: 32, weight: 700, anchor: 'middle', fill: '#4E9A1E' });
  const finger = E('rect', { x: -9, y: -34, width: 18, height: 54, rx: 9, fill: '#2E6E12', stroke: SC_INK, 'stroke-width': 3 }, Lfg);
  const hq = scopeBigChip(Lfg, 'HIGH pitch + QUIET', '#4E9A1E');
  const ll = scopeBigChip(Lfg, 'LOW pitch + LOUD', '#C2502A');

  /* ================= I: independent ================= */
  const indep = G(Lfg);
  E('rect', { x: -340, y: -240, width: 680, height: 480, rx: 24, fill: '#13283A', stroke: '#FFE45C', 'stroke-width': 4 }, indep);
  const iT = T(indep, 0, -176, 'INDEPENDENT', { size: 52, weight: 800, anchor: 'middle', fill: '#FFE45C' });
  const iR1 = G(indep), iR2 = G(indep);
  T(iR1, 40, -64, 'PITCH ↔ FREQUENCY', { size: 40, weight: 800, anchor: 'middle', fill: '#C9F27A' });
  T(iR2, 40, 46, 'LOUDNESS ↔ AMPLITUDE', { size: 40, weight: 800, anchor: 'middle', fill: '#FFB08A' });
  const fIcon = G(iR1), aIcon = G(iR2);   // mini Freq and Amp badges
  E('rect', { x: -22, y: -32, width: 44, height: 64, rx: 21, fill: ball('#B6F06A', '#4E9A1E'), stroke: SC_INK, 'stroke-width': 3 }, fIcon);
  E('path', { d: 'M-14,10 l5,-6 l5,6 l5,-6 l5,6 l5,-6', fill: 'none', stroke: '#2E6E12', 'stroke-width': 3 }, fIcon);
  E('path', { d: 'M-40,26 C-28,26 -24,-30 0,-30 C24,-30 28,26 40,26 Z', fill: ball('#FF9A6C', '#C2502A'), stroke: SC_INK, 'stroke-width': 3 }, aIcon);
  E('path', { d: 'M0,-2 V20 M-5,3 L0,-2 L5,3 M-5,15 L0,20 L5,15', fill: 'none', stroke: '#FFE1CF', 'stroke-width': 3 }, aIcon);
  const iM = G(indep);
  E('rect', { x: -280, y: 118, width: 560, height: 84, rx: 16, fill: '#FFD23F' }, iM);
  T(iM, 0, 174, 'FAST PITCH, BIG BANG', { size: 44, weight: 800, anchor: 'middle', fill: SC_INK });

  /* ================= J: guitar panels ================= */
  const gTitle = scopeLabel(Lfg, 'Higher note on a guitar?', { size: 34, color: '#C9F27A', stroke: '#C9F27A' });
  const GP = ['TIGHTEN', 'SHORTEN', 'THINNER'].map((name, i) => {
    const x = 50 + i * 320, g = G(Lprop);
    E('rect', { x, y: 190, width: 300, height: 400, rx: 18, fill: 'rgba(10,27,39,0.85)', stroke: '#4E9A1E', 'stroke-width': 3 }, g);
    T(g, x + 150, 240, name, { size: 34, weight: 800, anchor: 'middle', fill: '#C9F27A' });
    E('rect', { x: x + 16, y: 290, width: 268, height: 70, rx: 8, fill: '#8A5A33', stroke: '#5A3A1F', 'stroke-width': 3 }, g);   // fretboard
    E('path', { d: [1, 2, 3, 4].map(k => `M${x + 16 + k * 54},290 V360`).join(' '), stroke: '#D9C9A0', 'stroke-width': 3 }, g);
    const str = scopeString(g, x + 24, x + 276, 325, i === 2 ? 2.5 : 6);
    const extra = G(g);
    if (i === 0) {   // a tuning peg with a turn arrow
      E('circle', { cx: x + 42, cy: 325, r: 14, fill: '#C9D3DC', stroke: SC_INK, 'stroke-width': 3 }, extra);
      E('path', { d: `M${x + 24},${300} A26,26 0 1 1 ${x + 62},${304}`, fill: 'none', stroke: '#FFE45C', 'stroke-width': 4 }, extra);
      E('path', { d: `M${x + 62},${290} L${x + 64},${306} L${x + 50},${304}`, fill: 'none', stroke: '#FFE45C', 'stroke-width': 4, 'stroke-linejoin': 'round' }, extra);
    } else if (i === 1) {   // a fingertip pressing a fret
      E('ellipse', { cx: x + 124, cy: 312, rx: 16, ry: 22, fill: '#B9784E', stroke: SC_INK, 'stroke-width': 3 }, extra);
    } else {
      T(extra, x + 150, 392, 'thin string', { size: 24, weight: 700, anchor: 'middle', fill: C.muted, font: FB });
    }
    const tw = G(g); tr(tw, x + 30, 470);
    E('rect', { x: -14, y: -60, width: 268, height: 120, rx: 8, fill: '#0B2A1A', stroke: '#1E4D33', 'stroke-width': 3 }, tw);
    const tc = G(tw);
    const cp = E('clipPath', { id: 'scopeGp' + i }, defs()); E('rect', { x: -14, y: -60, width: 268, height: 120 }, cp);
    tc.setAttribute('clip-path', `url(#scopeGp${i})`);
    const sw = sineWave(tc, { w: 240, amp: 34, wl: 110, color: '#6CFF9E', width: 4 });
    T(g, x + 150, 568, 'waves closer = higher', { size: 24, weight: 700, anchor: 'middle', fill: '#6CFF9E', font: FB });
    return { g, str, extra, sw, x };
  });

  /* ================= K: pluck harder ================= */
  const hp = G(Lprop);
  E('rect', { x: 470, y: 150, width: 680, height: 220, rx: 18, fill: 'rgba(10,27,39,0.85)', stroke: '#FF9A6C', 'stroke-width': 3 }, hp);
  E('rect', { x: 500, y: 225, width: 620, height: 70, rx: 8, fill: '#8A5A33', stroke: '#5A3A1F', 'stroke-width': 3 }, hp);
  const hStr = scopeString(hp, 510, 1110, 260, 6);
  T(hp, 810, 200, 'pluck HARDER', { size: 34, weight: 800, anchor: 'middle', fill: '#FFB08A' });
  const hTr = G(hp); tr(hTr, 520, 520);
  E('rect', { x: -20, y: -110, width: 620, height: 220, rx: 10, fill: '#0B2A1A', stroke: '#1E4D33', 'stroke-width': 4 }, hTr);
  E('line', { x1: -20, y1: 0, x2: 600, y2: 0, stroke: '#2F7A50', 'stroke-width': 2 }, hTr);
  const hBefore = sineWave(hTr, { w: 580, amp: 22, wl: 116, color: '#2F9A60', width: 4 });
  const hAfter = sineWave(hTr, { w: 580, amp: 84, wl: 116, color: '#6CFF9E', width: 5 });
  const hL1 = T(hp, 810, 400, 'dim: before · bright: plucked harder', { size: 24, weight: 700, anchor: 'middle', fill: '#6CFF9E', font: FB });
  const sameNote = scopeBigChip(Lfg, 'SAME NOTE, LOUDER', '#C2502A');
  const sameSp = T(Lfg, 810, 690, 'same spacing = same pitch · taller = louder', { size: 26, weight: 700, anchor: 'middle', fill: C.muted, font: FB });

  /* ================= L: microphone -> oscilloscope ================= */
  const tri = pioTriangle(Lprop, 0.75);
  const mic = G(Lprop); tr(mic, 340, 330);
  E('rect', { x: -14, y: 30, width: 28, height: 80, rx: 8, fill: '#3B3F48', stroke: SC_INK, 'stroke-width': 3 }, mic);
  E('circle', { r: 40, fill: ball('#C9D3DC', '#6E7C8A'), stroke: SC_INK, 'stroke-width': 4 }, mic);
  E('path', { d: 'M-30,-14 H30 M-36,0 H36 M-30,14 H30', stroke: '#4E5A66', 'stroke-width': 3 }, mic);
  const cable = E('path', { d: 'M340,440 Q360,560 440,520 Q500,490 520,420', fill: 'none', stroke: '#3B3F48', 'stroke-width': 8, 'stroke-linecap': 'round' }, Lprop);
  const sig = G(Lprop), sigDots = [0, 1, 2, 3, 4].map(() => E('circle', { r: 7, fill: '#FFE45C' }, sig));
  const micArcs = G(Lprop);
  [0, 1, 2].forEach(i => E('path', { d: `M${228 + i * 22},290 Q${242 + i * 22},330 ${228 + i * 22},370`, fill: 'none', stroke: '#FFE45C', 'stroke-width': 5, 'stroke-linecap': 'round' }, micArcs));
  const micLbl = scopeLabel(Lfg, 'microphone', { size: 30 });
  const elecLbl = scopeLabel(Lfg, 'sound → electrical signal', { size: 28, color: '#FFE45C', stroke: '#FFE45C' });
  const oscLbl = scopeBigChip(Lfg, 'OSCILLOSCOPE draws it', '#1E4D33', '#6CFF9E');
  const traceLbl = labelLine(Lfg, 980, 150, 860, 250, 'the TRACE', { size: 32, fill: '#6CFF9E', line: '#6CFF9E' });

  /* ================= M: reading a trace ================= */
  const rd1 = T(Lfg, 760, 610, 'height = AMPLITUDE: tall = LOUD', { size: 32, weight: 800, anchor: 'middle', fill: '#FF8FB0' });
  const rd2 = T(Lfg, 760, 668, 'spacing = FREQUENCY: close = HIGH pitch', { size: 32, weight: 800, anchor: 'middle', fill: '#7FE0FF' });

  /* ================= N: quiz ================= */
  const qA = pioScope(Lprop, 330, 200), qB = pioScope(Lprop, 330, 200);
  qA.trace({ amp: 74, wl: 165 }); qB.trace({ amp: 24, wl: 46 });
  const qLA = T(Lfg, 300, 168, 'A', { size: 66, weight: 800, anchor: 'middle', fill: '#FFE45C' });
  const qLB = T(Lfg, 830, 168, 'B', { size: 66, weight: 800, anchor: 'middle', fill: '#FFE45C' });
  const qQ = scopeLabel(Lfg, 'Describe each sound', { size: 34, color: '#FFE45C', stroke: '#FFE45C' });
  const timer = ring(Lfg, 36);
  const ansA = scopeBigChip(Lfg, 'LOUD, LOW-PITCHED', '#C2502A');
  const ansB = scopeBigChip(Lfg, 'QUIET, HIGH-PITCHED', '#4E9A1E');
  const tkA = tick(Lfg, 24), tkB = tick(Lfg, 24);

  /* ================= P: wavelength ================= */
  const rowG = G(Lprop); tr(rowG, 100, 270);
  const row = pioRow(rowG, { w: 1000, h: 190, cols: 22, rows: 4, r: 13 });
  const comp1 = scopeLabel(Lfg, 'compression', { size: 26 }), comp2 = scopeLabel(Lfg, 'compression', { size: 26 });
  const lam = G(Lfg);
  E('path', { d: 'M600,240 V520 M900,240 V520', stroke: '#FFE45C', 'stroke-width': 3, 'stroke-dasharray': '8 8' }, lam);
  scopeDbl(lam, 600, 520, 900, 520, '#FFE45C', 6);
  T(lam, 750, 600, 'λ', { size: 72, weight: 800, anchor: 'middle', fill: '#FFE45C' });
  T(lam, 750, 650, 'wavelength, measured in metres', { size: 32, weight: 700, anchor: 'middle', fill: '#FFFFFF' });
  const paused = G(Lfg); tr(paused, 1100, 160);
  E('rect', { x: -26, y: -26, width: 18, height: 52, rx: 4, fill: '#FFFFFF' }, paused);
  E('rect', { x: 8, y: -26, width: 18, height: 52, rx: 4, fill: '#FFFFFF' }, paused);

  /* ================= Q: time period ================= */
  const per = G(Lprop);
  const perW = G(per); tr(perW, 500, 260);
  sineWave(perW, { w: 600, amp: 60, wl: 120, color: '#6CFF9E', width: 5 });
  const perHi = G(per); tr(perHi, 500, 260);
  sineWave(perHi, { w: 120, amp: 60, wl: 120, color: '#FFE45C', width: 9 });
  const perT = G(per);
  E('path', { d: 'M500,340 V356 H620 V340', fill: 'none', stroke: '#FFE45C', 'stroke-width': 4 }, perT);
  T(perT, 560, 396, 'T', { size: 40, weight: 800, anchor: 'middle', fill: '#FFE45C' });
  T(perT, 640, 392, '= time for one wave', { size: 28, weight: 700, fill: '#FFE45C' });
  const per1s = G(per);
  E('path', { d: 'M500,416 V432 H1100 V416', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 4 }, per1s);
  T(per1s, 800, 472, '1 second: 5 waves = 5 Hz', { size: 30, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  const perN = [0, 1, 2, 3, 4].map(i => T(per, 530 + i * 120, 182, String(i + 1), { size: 36, weight: 800, anchor: 'middle', fill: '#FFFFFF' }));
  const tEq = chip(Lfg, 'T = 1 ÷ f', { size: 60, fill: '#FFD23F', color: SC_INK, stroke: '#FFFFFF', sw: 4 });
  const tEx = scopeLabel(Lfg, '5 Hz → T = 1/5 s = 0.2 s', { size: 40, color: '#FFE45C', stroke: '#FFE45C' });

  /* ================= R: the wave equation ================= */
  const board = G(Lprop);
  E('rect', { x: 430, y: 120, width: 730, height: 300, rx: 14, fill: '#F7F9FA', stroke: '#9AA6B2', 'stroke-width': 6 }, board);
  E('rect', { x: 440, y: 412, width: 710, height: 14, rx: 4, fill: '#9AA6B2' }, board);
  const eq1 = T(board, 795, 214, 'speed = frequency × wavelength', { size: 44, weight: 800, anchor: 'middle', fill: '#1A3A6E' });
  const eq2 = T(board, 795, 296, 'v = f × λ', { size: 56, weight: 800, anchor: 'middle', fill: '#C62828' });
  const eqU = T(board, 795, 344, 'm/s = Hz × m', { size: 26, weight: 700, anchor: 'middle', fill: '#5A6B7A', font: FB });
  const eqChip = chip(board, 'same speed: higher f → shorter λ', { size: 32, fill: '#2F56C2', color: '#FFFFFF' }); tr(eqChip, 795, 382);
  const ew = G(Lprop);
  const ewLo = G(ew); tr(ewLo, 470, 506); const swLo = sineWave(ewLo, { w: 640, amp: 34, wl: 200, color: '#9FD8FF', width: 5 });
  const ewHi = G(ew); tr(ewHi, 470, 636); const swHi = sineWave(ewHi, { w: 640, amp: 34, wl: 100, color: '#C9F27A', width: 5 });
  const rideLine = E('line', { x1: 0, y1: 482, x2: 0, y2: 592, stroke: '#FFE45C', 'stroke-width': 3, 'stroke-dasharray': '6 6' }, ew);
  [[458, 'LOW frequency: LONG λ', '#9FD8FF'], [588, 'HIGH frequency: SHORT λ', '#C9F27A']].forEach(([y, s, c]) => {
    const tx = T(ew, 470, y, s, { size: 28, weight: 800, fill: c });
    tx.setAttribute('stroke', '#13283A'); tx.setAttribute('stroke-width', 8); tx.setAttribute('paint-order', 'stroke');
  });
  const rideA = E('circle', { r: 10, fill: '#FFE45C', stroke: SC_INK, 'stroke-width': 2 }, ew), rideB = E('circle', { r: 10, fill: '#FFE45C', stroke: SC_INK, 'stroke-width': 2 }, ew);

  /* ================= the cast ================= */
  const freq = cast(Lcast, 'freq', { mood: 'happy' });
  const amp = cast(Lcast, 'amp', { mood: 'neutral' });
  const nigel = cast(Lcast, 'nigel', { mood: 'deadpan' });
  const archie = cast(Lcast, 'archie', { mood: 'happy' });

  /* shots */
  const SH = [['two', -1], ['freq', at('freq') - 0.06], ['amp', at('amp') - 0.06], ['th', at('thnigel') - 0.06], ['pitch', at('pitch') - 0.06],
    ['loud', at('loud') - 0.06], ['same', at('same') - 0.06], ['whisper', at('whisper') - 0.06], ['boom', at('boom') - 0.06], ['indep', at('indep') - 0.06],
    ['guitar', at('guitar') - 0.06], ['harder', at('harder') - 0.06], ['scope', at('scope') - 0.06], ['read', at('read') - 0.06], ['quiz', at('quiz') - 0.06],
    ['correct', at('correct') - 0.06], ['length', at('length') - 0.06], ['period', at('period') - 0.06], ['equation', at('equation') - 0.06]];
  const shotAt = t => { let k = 0; for (let i = 0; i < SH.length; i++) if (t >= SH[i][1]) k = i; return SH[k]; };
  const STOMP = at('amp') + 0.32, BOOM = at('boom') + 0.15;
  const GPT = [0.2, 0.45, 0.7].map(f => mid('guitar', f));
  const FREEZE = mid('length', 0.22), TZ = 0.8333 + 1.25 * 12;

  return t => {
    const [sh, s0] = shotAt(t);
    const is = (...k) => k.includes(sh);

    /* ---------- camera ---------- */
    let sx = 0, sy = 0;
    if (sh === 'amp') { sx = scopeShake(t, STOMP, 10); sy = scopeShake(t + 0.13, STOMP, 7); }
    if (sh === 'boom') { sx = scopeShake(t, BOOM, 12); sy = scopeShake(t + 0.13, BOOM, 8); }
    if (sh === 'th') { const p = P(t, mid('thnigel', 0.6), at('pitch') - mid('thnigel', 0.6), ease); scopeCam(camG, 1 + 0.08 * p, 430, 380, 430, 380); }
    else if (sh === 'correct') { const p = P(t, mid('correct', 0.4), at('length') - mid('correct', 0.4), ease); scopeCam(camG, 1 + 0.16 * p, 840, 470, lerp(840, 760, p), lerp(470, 420, p)); }
    else camG.setAttribute('transform', sx || sy ? `translate(${sx.toFixed(1)} ${sy.toFixed(1)})` : '');

    /* ---------- backgrounds ---------- */
    const hallOn = is('two', 'freq', 'amp', 'same', 'indep', 'correct');
    op(hallShot, hallOn); if (hallOn) hall.upd(t);
    op(hallDim, sh === 'indep' ? 0.55 : 0);
    op(darkShot, !hallOn && sh !== 'th');
    conf.set(sh === 'th' ? 1 : 0, t);
    spots.forEach((sp, i) => op(sp, is('two', 'freq', 'amp') ? (sh === 'two' ? P(t, mid('two', 0.66 + i * 0.1), 0.25, linear) : 1) : 0));

    /* ---------- A: chips ---------- */
    if (sh === 'two') { scopePop(pitchChip, t, mid('two', 0.12), 380, 300); scopePop(loudChip, t, mid('two', 0.4), 840, 360); }
    else { op(pitchChip, 0); op(loudChip, 0); }

    /* ---------- B: Freq's chips ---------- */
    if (sh === 'freq') {
      scopePop(fChip1, t, mid('freq', 0.3), 820, 200); scopePop(fChip2, t, mid('freq', 0.5), 820, 290); scopePop(fChip3, t, mid('freq', 0.72), 820, 380);
    } else { op(fChip1, 0); op(fChip2, 0); op(fChip3, 0); }
    ltFreq.set(sh === 'freq' ? win(t, at('freq') + 0.35, end('freq') + 0.1, 0.3) : 0);
    // C
    if (sh === 'amp') { const p = P(t, mid('amp', 0.35), 0.4, pop); op(ampDia, clamp(p * 2.5)); tr(ampDia, 0, -20 * (1 - clamp(p))); } else op(ampDia, 0);
    ltAmp.set(sh === 'amp' ? win(t, STOMP + 0.2, at('thnigel') - 0.06, 0.25) : 0);
    // D
    if (sh === 'th') {
      const p1 = P(t, mid('thnigel', 0.1), 0.4, pop) * (1 - P(t, mid('thnigel', 0.52), 0.15, linear));
      op(inset1, clamp(p1 * 2.5)); tr(inset1, 880, 360, Math.max(0.01, 0.7 + 0.3 * p1), 3);
      scopePop(inset2, t, mid('thnigel', 0.55), 880, 360, 1, -3);
    } else { op(inset1, 0); op(inset2, 0); }

    /* ---------- the oscilloscope ---------- */
    const scOn = is('pitch', 'loud', 'whisper', 'boom', 'scope', 'read');
    op(scope, scOn);
    if (scOn) {
      let a = 70, wl = 100, ph = t * 1.2 * AMP;
      if (sh === 'pitch') { wl = t < mid('pitch', 0.56) ? 38 : 170; }
      else if (sh === 'loud') { a = t < mid('loud', 0.55) ? 108 : 24; }
      else if (sh === 'whisper') { a = 22; wl = 38; }
      else if (sh === 'boom') { a = 110; wl = 170; }
      else if (sh === 'scope') { a = 70 * P(t, mid('scope', 0.5), 0.6, ease); wl = 100; }
      else { a = 80; wl = 120; ph = 0; }
      scope.trace({ amp: a, wl, phase: ph });
      if (sh === 'read') { tr(scope, 740, 320, 1.1); } else tr(scope, 790, 320);
      op(ann, sh === 'read' ? 1 : 0);
      if (sh === 'read') { op(ann.children[0], P(t, mid('read', 0.05), 0.3, linear)); op(ann.children[1], P(t, mid('read', 0.5), 0.3, linear)); }
    }
    if (sh === 'pitch') {
      const a = P(t, mid('pitch', 0.2), 0.4, pop) * (1 - P(t, mid('pitch', 0.56), 0.12, linear));
      op(pHi, clamp(a * 2.5)); tr(pHi, 760, 620, Math.max(0.01, 0.7 + 0.3 * a));
      scopePop(pLo, t, mid('pitch', 0.6), 760, 620);
    } else { op(pHi, 0); op(pLo, 0); }
    if (sh === 'loud') {
      const a = P(t, mid('loud', 0.15), 0.4, pop) * (1 - P(t, mid('loud', 0.55), 0.12, linear));
      op(lBig, clamp(a * 2.5)); tr(lBig, 790, 620, Math.max(0.01, 0.7 + 0.3 * a));
      scopePop(lSmall, t, mid('loud', 0.6), 790, 620);
    } else { op(lBig, 0); op(lSmall, 0); }
    if (sh === 'whisper') { scopePop(hq, t, mid('whisper', 0.5), 790, 620); } else op(hq, 0);
    if (sh === 'boom') { scopePop(ll, t, mid('boom', 0.45), 790, 620); } else op(ll, 0);
    // the wrong idea, then it cracks and falls
    if (is('same', 'whisper', 'boom')) {
      const p = sh === 'same' ? P(t, mid('same', 0.25), 0.4, pop) : 1;
      const cy = sh === 'same' ? 250 : 140, cx = sh === 'same' ? 600 : 790;
      op(wrongChip, clamp(p * 2.5)); tr(wrongChip, cx, cy, Math.max(0.01, 0.6 + 0.4 * p), sh === 'same' ? -4 : 0);
      const cr = sh === 'boom' ? P(t, BOOM + 0.1, 0.15, linear) : 0;
      op(crack, cr);
      const fall = sh === 'boom' ? Math.max(0, t - mid('boom', 0.55)) : 0;
      tr(wcL, -fall * 30, 900 * fall * fall, 1, -fall * 40);
      tr(wcR, fall * 40, 1000 * fall * fall, 1, fall * 50);
      op(crack, cr * (fall > 0 ? 0 : 1));
    } else op(wrongChip, 0);
    if (sh === 'whisper') {
      const p = P(t, at('whisper') + 0.1, 0.3, pop);
      op(shh, clamp(p * 2.5) * (0.75 + 0.25 * Math.sin(t * 5))); tr(shh, 400, 330, Math.max(0.01, 0.7 + 0.3 * p));
      op(finger, 1); tr(finger, 250, 478);
    } else { op(shh, 0); op(finger, 0); }

    /* ---------- I: independent ---------- */
    if (sh === 'indep') {
      const p = P(t, at('indep') + 0.05, 0.4, pop);
      op(indep, clamp(p * 2.5)); tr(indep, 780, 390, Math.max(0.01, 0.85 + 0.15 * p));
      op(iT, P(t, mid('indep', 0.05), 0.3, linear));
      op(iR1, P(t, mid('indep', 0.3), 0.3, linear)); op(iR2, P(t, mid('indep', 0.48), 0.3, linear));
      op(iM, P(t, mid('indep', 0.76), 0.3, linear));
      tr(fIcon, -270 + Math.sin(t * 60) * 1.5 * AMP, -78); tr(aIcon, -280, 34, 1 + 0.06 * Math.sin(t * 3) * AMP);
    } else op(indep, 0);

    /* ---------- J: guitar ---------- */
    const gOn = sh === 'guitar';
    if (gOn) scopePop(gTitle, t, at('guitar') + 0.05, 600, 140); else op(gTitle, 0);
    GP.forEach((p, i) => {
      if (!gOn) { op(p.g, 0); return; }
      const ap = P(t, GPT[i] - 0.25, 0.35, pop);
      op(p.g, clamp(ap * 2.5));
      const act = P(t, GPT[i] + 0.1, 0.5, ease);
      const f = lerp(1.6, 4.5, act) * AMP;
      p.str.set(t, 9, f, i === 1 ? lerp(p.x + 24, p.x + 124, act) : undefined);
      if (i === 0) p.extra.setAttribute('transform', `rotate(${(-120 * act).toFixed(1)} ${p.x + 42} 325)`);
      if (i === 1) op(p.extra, act > 0.02 ? 1 : 0);
      p.sw.set({ wl: lerp(110, 46, act), phase: t * 1.2 * AMP });
    });

    /* ---------- K: harder ---------- */
    op(hp, sh === 'harder');
    if (sh === 'harder') {
      const pk = P(t, mid('harder', 0.25), 0.2, easeOut);
      hStr.set(t, lerp(5, 30, pk), 2.2 * AMP);
      hBefore.set({ phase: t * 1.2 * AMP }); hAfter.set({ amp: 84 * pk, phase: t * 1.2 * AMP });
      op(hAfter, pk > 0.01 ? 1 : 0);
      scopePop(sameNote, t, mid('harder', 0.5), 810, 640);
      op(sameSp, P(t, mid('harder', 0.8), 0.3, linear));
    } else { op(sameNote, 0); op(sameSp, 0); }

    /* ---------- L: microphone -> scope ---------- */
    const lOn = sh === 'scope';
    op(tri, lOn); op(mic, lOn); op(cable, lOn); op(micArcs, lOn);
    if (lOn) {
      tr(tri, 150, 330); tri.set({ t, ring: 1, beater: false });
      [...micArcs.children].forEach((a, i) => op(a, 0.35 + 0.65 * Math.abs(Math.sin(t * 5 - i))));
      const sp = P(t, mid('scope', 0.25), 0.3, linear);
      op(sig, sp);
      sigDots.forEach((d, i) => {
        const f = ((t * 0.6 + i / 5) % 1);
        const q = cable.getPointAtLength ? cable.getPointAtLength(f * cable.getTotalLength()) : { x: 340, y: 440 };
        attr(d, 'cx', q.x); attr(d, 'cy', q.y);
      });
      scopePop(micLbl, t, mid('scope', 0.06), 340, 220);
      scopePop(elecLbl, t, mid('scope', 0.25), 300, 620);
      scopePop(oscLbl, t, mid('scope', 0.5), 790, 600);
      op(traceLbl, P(t, mid('scope', 0.8), 0.3, linear));
    } else { op(sig, 0); op(micLbl, 0); op(elecLbl, 0); op(oscLbl, 0); op(traceLbl, 0); }

    /* ---------- M: reading ---------- */
    op(rd1, sh === 'read' ? P(t, mid('read', 0.05), 0.3, linear) : 0);
    op(rd2, sh === 'read' ? P(t, mid('read', 0.5), 0.3, linear) : 0);

    /* ---------- N: quiz and answer ---------- */
    const qOn = sh === 'quiz';
    op(qA, qOn); op(qB, qOn); op(qLA, qOn); op(qLB, qOn);
    if (qOn) {
      tr(qA, 300, 320); tr(qB, 830, 320);
      qA.trace({ amp: 74, wl: 165, phase: t * 1.0 * AMP }); qB.trace({ amp: 24, wl: 46, phase: t * 1.0 * AMP });
      op(qLA, P(t, mid('quiz', 0.08), 0.25, linear)); op(qLB, P(t, mid('quiz', 0.42), 0.25, linear));
      const qq = P(t, mid('quiz', 0.78), 0.3, pop) * (1 - P(t, at('answer'), 0.15, linear));
      op(qQ, clamp(qq * 2.5)); tr(qQ, 565, 560);
      const tm = win(t, end('quiz'), at('answer') + 0.1, 0.15);
      op(timer, tm); tr(timer, 830, 590); timer.set(P(t, end('quiz'), at('answer') - end('quiz'), linear));
      const a1 = scopePop(ansA, t, mid('answer', 0.08), 300, 560), a2 = scopePop(ansB, t, mid('answer', 0.5), 830, 560);
      op(tkA, P(t, mid('answer', 0.4), 0.2, linear)); tr(tkA, 300, 625);
      op(tkB, P(t, end('answer') - 0.1, 0.2, linear)); tr(tkB, 830, 625);
    } else { op(qQ, 0); op(timer, 0); op(ansA, 0); op(ansB, 0); op(tkA, 0); op(tkB, 0); }

    /* ---------- P: wavelength ---------- */
    const pOn = sh === 'length';
    op(rowG, pOn); op(comp1, 0); op(comp2, 0); op(lam, 0); op(paused, 0);
    if (pOn) {
      const te = TZ - Math.max(0, FREEZE - t) * AMP;
      row.set({ t: te, amp: 16, wl: 300, f: 0.8, hi: 11 });
      if (t >= FREEZE) {
        op(paused, 0.85);
        scopePop(comp1, t, FREEZE + 0.15, 600, 238); scopePop(comp2, t, FREEZE + 0.3, 900, 238);
        op(lam, P(t, mid('length', 0.5), 0.35, linear));
      }
    }

    /* ---------- Q: time period ---------- */
    const qOnP = sh === 'period';
    op(per, qOnP);
    if (qOnP) {
      op(perHi, P(t, mid('period', 0.12), 0.3, linear) * (0.7 + 0.3 * Math.sin(t * 6)));
      op(perT, P(t, mid('period', 0.2), 0.3, linear));
      perN.forEach((n, i) => { const p = P(t, mid('period', 0.62 + i * 0.05), 0.25, pop); op(n, clamp(p * 2.5)); n.setAttribute('transform', `translate(${530 + i * 120} 182) scale(${Math.max(0.01, 0.6 + 0.4 * p).toFixed(3)}) translate(${-(530 + i * 120)} -182)`); });
      op(per1s, P(t, mid('period', 0.7), 0.3, linear));
      scopePop(tEq, t, mid('period', 0.4), 800, 560);
      scopePop(tEx, t, mid('period', 0.84), 800, 660);
    } else { op(tEq, 0); op(tEx, 0); }

    /* ---------- R: the wave equation ---------- */
    const rOn = sh === 'equation';
    op(board, rOn); op(ew, rOn);
    if (rOn) {
      const bp = P(t, at('equation') + 0.05, 0.4, pop);
      op(board, clamp(bp * 2.5));
      op(eq1, P(t, mid('equation', 0.12), 0.35, linear));
      op(eq2, P(t, mid('equation', 0.32), 0.35, linear)); op(eqU, P(t, mid('equation', 0.4), 0.35, linear));
      op(eqChip, P(t, mid('equation', 0.84), 0.3, linear));
      const wp = P(t, mid('equation', 0.5), 0.35, linear);
      op(ew, wp);
      const tt = (t - mid('equation', 0.5)) * AMP;
      swLo.set({ phase: 0.5 * tt }); swHi.set({ phase: 1.0 * tt });
      const x = 470 + ((50 + 100 * Math.max(0, tt)) % 400) + 100;
      attr(rideA, 'cx', x); attr(rideA, 'cy', 506 - 34); attr(rideB, 'cx', x); attr(rideB, 'cy', 636 - 34);
      attr(rideLine, 'x1', x); attr(rideLine, 'x2', x);
    }

    /* ---------- the cast ---------- */
    // Freq
    const fOn = is('freq', 'amp', 'pitch', 'same', 'whisper', 'guitar', 'period');
    op(freq, fOn); op(tea, is('freq', 'amp') ? 1 : 0); op(zip, sh === 'freq' ? 1 - P(t, at('freq') + 0.2, 0.3, linear) : 0);
    if (fOn) {
      let x = 380, y = 470, s = 1.1, mood = 'happy', look = 0, buzz = scWho(S, t) === 'freq' ? 1 : 0.2, tk = talk(t, 'freq');
      if (sh === 'freq') { x = lerp(-150, 380, P(t, at('freq') - 0.06, 0.32, easeOut)); }
      else if (sh === 'amp') { mood = t >= STOMP ? (t < STOMP + 1.2 ? 'shock' : 'neutral') : 'happy'; look = 0.9; buzz = t >= STOMP && t < STOMP + 0.6 ? 1 : 0.2; }
      else if (sh === 'pitch') { x = 250; y = 480; look = 0.6; }
      else if (sh === 'same') { x = 220; y = 500; s = 1.0; look = 0.8; mood = t < end('same') ? 'shock' : 'deadpan'; buzz = 0; }
      else if (sh === 'whisper') { x = 250; y = 480; mood = 'smug'; look = 0.6; tk *= 0.35; buzz = 0; }
      else if (sh === 'guitar') { x = 1080; y = 600; s = 0.6; look = -0.8; }
      else { x = 220; y = 500; s = 1.0; look = 0.7; }
      tr(freq, x, y, s);
      freq.set({ t, talk: tk, mood, look, buzz: buzz * AMP });
      tr(tea, x + 105 * s, y + 70 * s, 0.75 * s, 8);
      tr(zip, x, y, s);
    }
    // Amp
    const aOn = is('amp', 'loud', 'same', 'boom', 'harder');
    op(amp, aOn);
    if (aOn) {
      let x = 840, y = 500, s = 1.0, mood = 'neutral', look = 0, big = scWho(S, t) === 'amp' ? 0.5 : 0.1;
      if (sh === 'amp') { const dp = P(t, at('amp') - 0.06, STOMP - at('amp') + 0.06, easeIn); y = lerp(-200, 500, dp); big = t < STOMP ? 0.4 : (t < STOMP + 0.5 ? 1 : 0.5); look = -0.4; mood = t > end('amp') ? 'smug' : 'neutral'; }
      else if (sh === 'loud') { x = 250; y = 500; s = 0.95; look = 0.6; big = lerp(0.3, 1, Math.abs(Math.sin(t * 2.5))) * (scWho(S, t) === 'amp' ? 1 : 0.4); }
      else if (sh === 'same') { x = 990; y = 510; s = 0.9; look = -0.8; mood = t < end('same') ? 'neutral' : 'deadpan'; big = 0; }
      else if (sh === 'boom') { x = 250; y = 500; s = 0.95; look = 0.5; big = t >= BOOM - 0.15 ? 1 : 0.3; mood = t > end('boom') ? 'smug' : 'neutral'; }
      else { x = 230; y = 520; s = 0.9; look = 0.6; big = t >= mid('harder', 0.25) && t < end('harder') ? 1 : 0.3; mood = t > end('harder') ? 'smug' : 'neutral'; }
      tr(amp, x, y, s);
      amp.set({ t, talk: talk(t, 'amp'), mood, look, big });
    }
    // Nigel
    const nOn = is('th', 'indep', 'read', 'correct', 'equation');
    op(nigel, nOn);
    if (nOn) {
      let x = 430, y = 410, s = 1.5, mood = 'deadpan', look = 0;
      if (sh === 'th') { look = t > mid('thnigel', 0.1) && t < mid('thnigel', 0.5) ? 0.5 : (t >= mid('thnigel', 0.55) && t < end('thnigel') ? 0.6 : 0); }
      else if (sh === 'indep') { x = 220; y = 520; s = 1.0; look = 0.6; }
      else if (sh === 'read') { x = 190; y = 530; s = 0.9; look = 0.8; }
      else if (sh === 'correct') { x = 840; y = 500; s = 1.2; look = t < mid('correct', 0.35) ? -0.8 : 0; }
      else { x = 220; y = 540; s = 1.0; look = 0.6; }
      tr(nigel, x, y, s);
      nigel.set({ t, talk: talk(t, 'nigel'), mood, look });
    }
    // Archie
    const arOn = is('same', 'quiz', 'correct');
    op(archie, arOn);
    if (arOn) {
      let x = 600, y = 480, s = 1.1, mood = 'happy', look = 0, bounce = 0, sweat = 0;
      if (sh === 'same') { bounce = t < end('same') ? 0.6 : 0; mood = t < end('same') ? 'happy' : 'smug'; look = t < end('same') ? 0 : (Math.sin(t * 3) > 0 ? -0.8 : 0.8); }
      else if (sh === 'quiz') { x = 565; y = t < at('answer') ? 660 : 640; s = 0.55; mood = t < at('answer') ? 'neutral' : 'happy'; sweat = t >= end('quiz') && t < at('answer') ? 1 : 0; bounce = t >= at('answer') ? 0.5 : 0; look = t < mid('quiz', 0.42) ? -0.6 : 0.6; }
      else { x = 380; y = 480; s = 1.2; bounce = 1; look = 0.8; mood = 'happy'; }
      tr(archie, x, y, s);
      archie.set({ t, talk: talk(t, 'archie'), mood, look, bounce: bounce * AMP, sweat });
    }
  };
});
