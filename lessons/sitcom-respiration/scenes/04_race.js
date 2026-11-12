/* Scene 4: The eight hundred metres.
   Beats: start line (800 m, 11 AM) -> Kavya's pep talk -> BANG, energy needed shoots up -> office alarm
   -> twins stuck in blood traffic (heart and breathing faster) -> no oxygen: red phone, CALL LARRY
   -> anaerobic = without oxygen -> Larry bursts through the wall -> Mitch: "the cheap option"
   -> glucose -> lactic acid -> much less energy -> fast though (shrug) -> legs on fire
   -> lactic acid builds up = muscle fatigue -> finish tape -> fourth of five, lying on the grass. */
scene('race', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.3 : 1;
  const talk = (t, who) => scTalk(S, t, who);

  /* ---------- local helpers (prefixed race) ---------- */
  // text with real subscripts: 'no O_2' -> no O₂
  function raceRich(parent, x, y, str, o) {
    o = o || {};
    const size = o.size || 32, sub = Math.round(size * 0.62), dy = Math.round(size * 0.24);
    const t = E('text', { x, y, 'font-size': size, 'font-weight': o.weight || 700, fill: o.fill || C.ink, 'text-anchor': o.anchor || 'middle', 'font-family': FD }, parent);
    str.split(/_(\d+)/).forEach((seg, i) => {
      if (!seg) return;
      const ts = E('tspan', i % 2 ? { 'font-size': sub, dy } : (i > 0 ? { dy: -dy } : {}), t); ts.textContent = seg;
    });
    return t;
  }
  // a rubber stamp: g.set(p, x, y, rot) thumps it down
  function raceStamp(parent, text, o) {
    o = o || {};
    const size = o.size || 44, col = o.color || C.bad;
    const g = G(parent);
    const w = textWidth(text, size, FD, 800) + size * 1.3, h = size * 1.7;
    E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: 12, fill: o.fill || 'rgba(24,8,12,0.88)', stroke: col, 'stroke-width': 6 }, g);
    E('rect', { x: -w / 2 + 9, y: -h / 2 + 9, width: w - 18, height: h - 18, rx: 8, fill: 'none', stroke: col, 'stroke-width': 2, opacity: 0.6 }, g);
    T(g, 0, size * 0.36, text, { size, weight: 800, anchor: 'middle', fill: col, ls: 2 });
    g.set = (p, x, y, rot) => { op(g, clamp(p * 4)); tr(g, x, y, lerp(1.7, 1, easeOut(clamp(p))), rot); };
    return g;
  }
  // pop an element in at (x, y): returns nothing, uses P(..., pop)
  function racePop(el, x, y, p, s, rot) { op(el, clamp(p * 2.5)); tr(el, x, y, Math.max(0.01, (s || 1) * (0.6 + 0.4 * p)), rot); }
  // camera: scale k about (cx, cy) and put that point at (px, py)
  function raceCam(el, cx, cy, k, px, py) { el.setAttribute('transform', `translate(${(px ?? cx).toFixed(1)} ${(py ?? cy).toFixed(1)}) scale(${k.toFixed(4)}) translate(${(-cx).toFixed(1)} ${(-cy).toFixed(1)})`); }
  // a red emergency phone; g.hand is the handset (local origin at its cradle position)
  function racePhone(parent) {
    const g = G(parent);
    E('path', { d: 'M-62,30 L-48,-18 Q-46,-26 -36,-26 L36,-26 Q46,-26 48,-18 L62,30 Q62,38 54,38 L-54,38 Q-62,38 -62,30 Z', fill: ball('#FF4A4A', '#A51C1C'), stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
    E('circle', { cx: 0, cy: 8, r: 18, fill: '#FFF1E0', stroke: SC_INK, 'stroke-width': 3 }, g);
    E('circle', { cx: 0, cy: 8, r: 6, fill: '#A51C1C' }, g);
    g.hand = G(g);
    E('path', { d: 'M-66,-34 Q-70,-56 -50,-58 L50,-58 Q70,-56 66,-34 L50,-30 Q44,-44 30,-44 L-30,-44 Q-44,-44 -50,-30 Z', fill: ball('#FF4A4A', '#A51C1C'), stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, g.hand);
    return g;
  }
  // a light background runner with the kit person's proportions and pose format (g.pose(runPose(t)))
  function raceRunner(parent, o) {
    const g = G(parent), body = G(g);
    const thigh = E('path', { fill: 'none', stroke: o.shorts || '#1E2A44', 'stroke-width': 15, 'stroke-linecap': 'round' }, body);
    const shin = E('path', { fill: 'none', stroke: o.skin, 'stroke-width': 13, 'stroke-linecap': 'round' }, body);
    E('path', { d: 'M-18,-152 Q0,-160 18,-152 L15,-92 Q0,-86 -15,-92 Z', fill: o.shirt }, body);
    const armP = E('path', { fill: 'none', stroke: o.skin, 'stroke-width': 10, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, body);
    E('circle', { cx: 0, cy: -174, r: 19, fill: o.skin }, body);
    E('path', { d: 'M-19,-178 Q-16,-198 2,-196 Q18,-195 19,-180 Q8,-188 -19,-178 Z', fill: o.hair }, body);
    const seg = (x, y, a, l) => [x + Math.sin(a * Math.PI / 180) * l, y + Math.cos(a * Math.PI / 180) * l];
    g.pose = p => {
      p = p || {};
      body.setAttribute('transform', `rotate(${(p.lean || 0).toFixed(1)} 0 -92)`);
      let th = '', sh = '', ar = '';
      [p.legL || [3, -3], p.legR || [-3, -3]].forEach(([a, b]) => { const k = seg(0, -92, a, 45), f = seg(k[0], k[1], a + b, 45); th += `M0,-92 L${k[0].toFixed(1)},${k[1].toFixed(1)} `; sh += `M${k[0].toFixed(1)},${k[1].toFixed(1)} L${f[0].toFixed(1)},${f[1].toFixed(1)} `; });
      [p.armL || [8, 10], p.armR || [-8, 10]].forEach(([a, b]) => { const e = seg(0, -146, a, 33), h = seg(e[0], e[1], a + b, 31); ar += `M0,-146 L${e[0].toFixed(1)},${e[1].toFixed(1)} L${h[0].toFixed(1)},${h[1].toFixed(1)} `; });
      attr(thigh, 'd', th); attr(shin, 'd', sh); attr(armP, 'd', ar);
    };
    g.pose();
    return g;
  }
  const raceHeart = 'M0,34 C-70,-8 -58,-66 0,-34 C58,-66 70,-8 0,34 Z';
  // flames: n flickering tongues along a base line; g.upd(t, k)
  function raceFlames(parent, n, w, h) {
    const g = G(parent), fl = [];
    for (let i = 0; i < n; i++) {
      const x = (i / (n - 1) - 0.5) * w;
      const outer = E('path', { fill: '#FF6A2A', stroke: '#FFB03A', 'stroke-width': 3 }, g);
      const inner = E('path', { fill: '#FFE45C' }, g);
      fl.push({ x, outer, inner, ph: i * 1.7, hh: h * (0.7 + 0.3 * ((i * 37) % 10) / 10) });
    }
    const tongue = (x, hh, ww) => `M${(x - ww).toFixed(1)},0 Q${(x - ww * 0.9).toFixed(1)},${(-hh * 0.55).toFixed(1)} ${x.toFixed(1)},${(-hh).toFixed(1)} Q${(x + ww * 0.9).toFixed(1)},${(-hh * 0.55).toFixed(1)} ${(x + ww).toFixed(1)},0 Z`;
    g.upd = (t, k) => fl.forEach(f => {
      const fh = f.hh * k * (0.8 + 0.2 * Math.sin(t * 9 * AMP + f.ph)), sway = Math.sin(t * 6 * AMP + f.ph) * 8;
      attr(f.outer, 'd', tongue(f.x + sway * 0.3, fh, 34)); attr(f.inner, 'd', tongue(f.x + sway * 0.5, fh * 0.55, 18));
    });
    return g;
  }

  /* ---------- shared cast: one of each, seated in whichever shot is on screen ---------- */
  const castHold = G(root); op(castHold, 0);
  const MITCH = scChar(castHold, 'mitch', { s: 1 }), GLORIA = scChar(castHold, 'gloria', { s: 1 });
  const LARRY = scChar(castHold, 'larry', { s: 1 }), KAVYA = scChar(castHold, 'kavya', { s: 1 });
  function raceSeat(ch, wrap, s) { if (ch.parentNode !== wrap) wrap.appendChild(ch); if (s !== undefined) tr(ch, 0, 0, s); }

  /* ---------- cut list: [start, shot, setup] ---------- */
  const CUTS = [
    [-1, 'track', 'start'],
    [at('ready') - 0.1, 'track', 'ready'],
    [at('go') - 0.1, 'track', 'go'],
    [at('allhands') - 0.1, 'off1', 'alarm'],
    [at('coming') - 0.1, 'blood', ''],
    [at('noox') - 0.1, 'off1', 'phone'],
    [at('anaerobic') - 0.1, 'ana', ''],
    [at('larry') - 0.1, 'off2', 'burst'],
    [at('th_larry') - 0.1, 'conf', 'card'],
    [at('larryeq') - 0.1, 'off2', 'board'],
    [at('little') - 0.1, 'off2', 'two'],
    [at('worth') - 0.1, 'off2', 'mitch'],
    [at('fire') - 0.1, 'track', 'firewide'],
    [mid('fire', 0.5), 'track', 'fireclose'],
    [at('me') - 0.1, 'muscle', ''],
    [end('welcome') + 0.15, 'conf', 'stare'],
    [at('finish') - 0.1, 'track', 'finish'],
    [at('fourth') - 0.1, 'grass', ''],
  ];
  const cutAt = t => { let c = CUTS[0]; for (const k of CUTS) if (t >= k[0]) c = k; return c; };

  /* =====================================================================
     TRACK: Sports Day (start, pep talk, race, legs on fire, finish)
     ===================================================================== */
  const gTrack = G(root);
  const trCam = G(gTrack);
  const trBg = scTrack(trCam);
  const FLAGC = ['#FF6070', '#FFE45C', '#4CC9F0'];
  const flags = FLAGC.map(col => { const f = G(trCam); E('line', { x1: 0, y1: 0, x2: 0, y2: -66, stroke: '#F2F7FA', 'stroke-width': 4 }, f); E('path', { d: 'M0,-66 L34,-57 L0,-48 Z', fill: col }, f); return f; });
  const finishLine = G(trCam);
  E('rect', { x: -6, y: 460, width: 12, height: 290, fill: '#FFFFFF' }, finishLine);
  E('line', { x1: 0, y1: 462, x2: 0, y2: 330, stroke: '#E9E2D0', 'stroke-width': 8 }, finishLine);
  const finSign = chip(finishLine, 'FINISH', { size: 28, fill: '#FFFFFF', color: '#C2453A', stroke: '#C2453A' }); tr(finSign, 0, 316);
  const LANE = [496, 554, 612, 670, 728], LS = [0.8, 0.88, 0.96, 1.22, 1.12], LX = [580, 510, 440, 370, 300];
  const startLine = E('path', { d: [0, 1, 2, 3, 4].map(i => `M${LX[i] - 16},${460 + i * 58} L${LX[i] - 16},${518 + i * 58}`).join(' '), stroke: '#FFFFFF', 'stroke-width': 10, fill: 'none' }, trCam);
  const RUN = [
    { lane: 0, shirt: '#E8424F', hair: '#5A3A1E', skin: '#E2B08A', v: 62 },
    { lane: 1, shirt: '#56D69B', hair: '#2B1D14', skin: '#8D5A3B', v: 46 },
    { lane: 2, shirt: '#B48CFF', hair: '#C9A24B', skin: '#F0C8A4', v: 30 },
    { lane: 4, shirt: '#FF9466', hair: '#1E1410', skin: '#C98E62', v: -24 },
  ];
  const runWraps = {};
  const mkRunner = r => { const w = G(trCam); r.w = w; r.p = raceRunner(w, { shirt: r.shirt, hair: r.hair, skin: r.skin, shorts: '#1E2A44' }); runWraps[r.lane] = r; };
  RUN.slice(0, 3).forEach(mkRunner);
  const kWrap = G(trCam), kBody = scKavyaBody(kWrap);
  const kGlow = G(kWrap);
  E('ellipse', { cx: 0, cy: -46, rx: 70, ry: 90, fill: glow('#FF4A1A') }, kGlow);
  const kHeat = heatWaves(kGlow, { n: 3, h: 60, spacing: 22, color: '#FF6A2A' }); tr(kHeat, 0, -90);
  const kSweat = scSweat(kWrap, [[-28, -196], [26, -200], [-34, -160]]);
  RUN.slice(3).forEach(mkRunner);
  // finish tape: two halves meeting at Kavya's chest height
  const tapeA = E('path', { d: 'M0,0 L18,190', stroke: '#FF4A4A', 'stroke-width': 7, 'stroke-linecap': 'round', fill: 'none' }, trCam);
  const tapeB = E('path', { d: 'M0,0 L-18,-190', stroke: '#FF4A4A', 'stroke-width': 7, 'stroke-linecap': 'round', fill: 'none' }, trCam);

  // track overlays (not moved by the camera)
  const trOv = G(gTrack);
  const clockChip = chip(trOv, '11:00 AM', { size: 36, fill: '#0E1A24', color: C.ink, stroke: C.energy });
  const mChip = chip(trOv, '800 m', { size: 64, fill: C.energy, color: '#3A3000' });
  // close-up: Kavya, head and shoulders
  const kClose = G(trOv);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#0A1B27', opacity: 0.25 }, kClose);
  const kFlames = raceFlames(kClose, 6, 1100, 260); tr(kFlames, 600, 780);
  const kBustW = G(kClose), kBust = KAVYA;
  const lapsChip = chip(kClose, '800 m = 2 laps', { size: 40, fill: '#FFFFFF', color: '#14243A' });
  const longTxt = T(kClose, 0, 0, 'two... l o o o n g ... laps', { size: 36, weight: 700, anchor: 'middle', fill: '#14243A' });
  const longBack = E('rect', { x: -260, y: -40, width: 520, height: 60, rx: 30, fill: '#FFFFFF', opacity: 0.85 }, kClose);
  kClose.insertBefore(longBack, longTxt);
  const fireTxt = T(kClose, 0, 0, 'legs on FIRE?!', { size: 60, weight: 800, anchor: 'middle', fill: '#FFE45C' });
  const fireBack = E('rect', { x: -230, y: -62, width: 460, height: 86, rx: 20, fill: '#3A1010', opacity: 0.85, stroke: '#FF6A2A', 'stroke-width': 4 }, kClose);
  kClose.insertBefore(fireBack, fireTxt);
  // BANG and the energy gauge
  const bang = G(trOv);
  { let d = ''; for (let i = 0; i < 24; i++) { const a = i / 24 * TAU, r = i % 2 ? 70 : 128; d += (i ? 'L' : 'M') + (Math.cos(a) * r * 1.3).toFixed(1) + ',' + (Math.sin(a) * r).toFixed(1); } E('path', { d: d + 'Z', fill: '#FFE45C', stroke: '#E8424F', 'stroke-width': 6, 'stroke-linejoin': 'round' }, bang); }
  T(bang, 0, 20, 'BANG!', { size: 58, weight: 800, anchor: 'middle', fill: '#E8424F' });
  const gauge = G(trOv);
  card(gauge, 0, 0, 200, 470, { fill: 'rgba(14,26,36,0.88)', stroke: C.energy, sw: 3 });
  T(gauge, 100, 46, 'energy', { size: 30, weight: 700, anchor: 'middle', fill: C.energy });
  T(gauge, 100, 80, 'needed', { size: 30, weight: 700, anchor: 'middle', fill: C.energy });
  const gMeter = meter(gauge, { w: 56, h: 300, vertical: true, color: C.energy }); tr(gMeter, 72, 112);
  const gArrow = arrow(gauge, 166, 400, 166, 130, { color: '#FF6070', width: 7 });
  const moreChip = chip(trOv, 'far MORE energy, far more QUICKLY', { size: 34, fill: '#0E1A24', color: C.energy, stroke: C.energy });

  /* =====================================================================
     OFFICE 1: the alarm and the red phone
     ===================================================================== */
  const gOff1 = G(root);
  const o1Cam = G(gOff1);
  scOffice(o1Cam);
  const o1Red = E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#FF2020' }, o1Cam);
  // alarm beacon
  const beacon = G(o1Cam); tr(beacon, 470, 160);
  const beam = G(beacon);
  E('path', { d: 'M0,0 L520,-70 L520,70 Z M0,0 L-520,-70 L-520,70 Z', fill: '#FF5A5A', opacity: 0.22 }, beam);
  E('rect', { x: -44, y: 16, width: 88, height: 20, rx: 6, fill: '#4A4A55', stroke: SC_INK, 'stroke-width': 3 }, beacon);
  const dome = E('path', { d: 'M-34,18 L-34,-6 Q-34,-40 0,-40 Q34,-40 34,-6 L34,18 Z', fill: ball('#FF4A4A', '#A51C1C'), stroke: SC_INK, 'stroke-width': 3 }, beacon);
  // desk, mug
  const desk = G(o1Cam);
  E('rect', { x: 150, y: 560, width: 580, height: 30, rx: 8, fill: '#8A5A3A', stroke: SC_INK, 'stroke-width': 4 }, desk);
  E('rect', { x: 175, y: 590, width: 530, height: 170, fill: '#6B4028', stroke: SC_INK, 'stroke-width': 4 }, desk);
  const o1MitchW = G(o1Cam); tr(o1MitchW, 420, 430);
  o1Cam.insertBefore(o1MitchW, desk);
  const o1Mitch = MITCH;
  const o1Phone = racePhone(desk); tr(o1Phone, 640, 522);
  const o1GloW = G(o1Cam), o1Glo = GLORIA;
  const slot = G(o1Cam); tr(slot, 1040, 440);
  const slotRing = E('circle', { r: 78, fill: 'rgba(255,107,92,0.08)', stroke: '#FF9A8F', 'stroke-width': 5, 'stroke-dasharray': '14 12' }, slot);
  raceRich(slot, 0, 16, 'O_2 ?', { size: 48, fill: '#FF9A8F' });
  T(slot, 0, 126, 'oxygen?', { size: 28, weight: 700, anchor: 'middle', fill: '#FF9A8F' });
  const handsChip = chip(o1Cam, 'ALL HANDS!', { size: 44, fill: '#E8424F', color: '#FFFFFF' });
  const needChip = G(o1Cam);
  { const w = 520; E('rect', { x: -w / 2, y: -42, width: w, height: 84, rx: 42, fill: '#FFFFFF', stroke: '#E8424F', 'stroke-width': 5 }, needChip); raceRich(needChip, 0, 16, 'NEED OXYGEN (O_2), NOW!', { size: 40, fill: '#B5372D' }); }
  // the phone beat
  const noCard = G(o1Cam);
  card(noCard, 650, 128, 500, 180, { fill: 'rgba(14,26,36,0.9)', stroke: '#FF9A8F', sw: 3 });
  const noL1 = raceRich(noCard, 900, 200, 'no oxygen (O_2)', { size: 46, fill: '#FF9A8F' });
  const noL2 = T(noCard, 900, 264, '= no **aerobic** respiration', { size: 34, weight: 600, anchor: 'middle', boldFill: C.energy });
  const noX = cross(noCard, 20); tr(noX, 690, 186);
  const note = G(o1Cam);
  E('rect', { x: -150, y: -78, width: 300, height: 156, fill: '#FFE45C', stroke: '#B8A030', 'stroke-width': 3 }, note);
  E('rect', { x: -40, y: -90, width: 80, height: 26, fill: 'rgba(255,255,255,0.6)' }, note);
  T(note, 0, -24, 'EMERGENCY ONLY:', { size: 26, weight: 700, anchor: 'middle', fill: '#5A2B07' });
  T(note, 0, 32, 'CALL LARRY', { size: 44, weight: 800, anchor: 'middle', fill: '#C2453A' });
  const o1Dim = E('rect', { x: -200, y: -200, width: 1600, height: 1150, fill: '#05080C' }, o1Cam);

  /* =====================================================================
     BLOOD: the twins stuck in traffic; heart and breathing speed up
     ===================================================================== */
  const gBlood = G(root);
  const blBg = scBlood(gBlood);
  const jam = [], jr = rng(404);
  const JAM = [[90, 300], [560, 290], [660, 380], [120, 560], [610, 560], [250, 650], [60, 430], [470, 650]];
  JAM.forEach(([x, y], i) => {
    const g = E('ellipse', { rx: 62, ry: 26, fill: ball('#FF6B6B', '#B32635'), stroke: '#FFB3B8', 'stroke-width': 3 }, gBlood);
    jam.push({ g, x, y, a: (jr() - 0.5) * 30, ph: jr() * TAU });
  });
  const taxi = G(gBlood);
  E('ellipse', { cx: 0, cy: 90, rx: 160, ry: 52, fill: ball('#FF5252', '#A51C2A'), stroke: '#FFD0D5', 'stroke-width': 4 }, taxi);
  E('ellipse', { cx: 0, cy: 84, rx: 104, ry: 22, fill: '#9C1F2A', opacity: 0.5 }, taxi);
  T(taxi, 0, 124, 'TAXI', { size: 30, weight: 800, anchor: 'middle', fill: '#FFE45C' });
  const twW = G(taxi), twins = scChar(twW, 'twins', { s: 0.8 }); tr(twW, 0, -40);
  taxi.insertBefore(twW, taxi.firstChild);
  const rbcLbl = chip(gBlood, 'red blood cell', { size: 28, fill: 'rgba(30,6,10,0.8)', color: '#FFD0D5' });
  const heartCard = G(gBlood);
  card(heartCard, 720, 118, 430, 222, { fill: 'rgba(14,26,36,0.9)', stroke: '#FF8A94', sw: 3 });
  const heartG = G(heartCard);
  E('path', { d: raceHeart, fill: ball('#FF4A5A', '#A51C2A'), stroke: '#FFD0D5', 'stroke-width': 4 }, heartG);
  T(heartCard, 1010, 186, 'heart rate', { size: 28, weight: 600, anchor: 'middle', fill: C.muted });
  const bpmN = T(heartCard, 1010, 256, '80', { size: 56, weight: 800, anchor: 'middle', fill: '#FF8A94' });
  T(heartCard, 1010, 300, 'beats a minute', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  const lungCard = G(gBlood);
  card(lungCard, 720, 362, 430, 230, { fill: 'rgba(14,26,36,0.9)', stroke: C.air, sw: 3 });
  const blLungs = lungs(lungCard, 0.4); tr(blLungs, 830, 492);
  T(lungCard, 1010, 432, 'breathing', { size: 28, weight: 600, anchor: 'middle', fill: C.muted });
  T(lungCard, 1010, 490, 'faster', { size: 40, weight: 800, anchor: 'middle', fill: C.air });
  T(lungCard, 1010, 548, '+ deeper', { size: 40, weight: 800, anchor: 'middle', fill: C.air });
  const slowStamp = raceStamp(gBlood, 'NOT FAST ENOUGH', { size: 52 });

  /* =====================================================================
     ANAEROBIC: the narrator's explainer (the phone keeps ringing)
     ===================================================================== */
  const gAna = G(root);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#0A1B27', '#1B1030', true) }, gAna);
  const anaTitle = chip(gAna, 'ANAEROBIC RESPIRATION', { size: 54, fill: '#3A1230', color: '#FFFFFF', stroke: C.lactic, sw: 5 });
  const anaSplit = G(gAna);
  T(anaSplit, 600, 270, '**an** = without      **aerobic** = with oxygen', { size: 34, weight: 600, anchor: 'middle', fill: C.muted, boldFill: C.ink });
  const anaMean = T(gAna, 600, 345, 'anaerobic = **without oxygen**', { size: 50, weight: 700, anchor: 'middle', boldFill: C.lactic });
  const muscle = G(gAna); tr(muscle, 640, 535);
  E('rect', { x: -330, y: -72, width: 660, height: 144, rx: 72, fill: '#8E3346', stroke: '#E07A90', 'stroke-width': 5 }, muscle);
  E('line', { x1: -300, y1: 0, x2: 300, y2: 0, stroke: '#6E2233', 'stroke-width': 120, 'stroke-dasharray': '8 24', opacity: 0.7 }, muscle);
  [[-170, -20], [130, 18]].forEach(([x, y], i) => { const m = mitochondrion(muscle, 92, 40, { folds: 3 }); tr(m, x, y, 1, i * 20 - 15); });
  T(muscle, 0, 116, 'muscle cell', { size: 28, weight: 600, anchor: 'middle', fill: '#F7A8C8' });
  const anaO2 = G(gAna); tr(anaO2, 170, 535);
  molO2(anaO2, 30);
  const anaO2x = cross(anaO2, 44); tr(anaO2x, 0, 0);
  T(anaO2, 0, 84, 'not enough', { size: 26, weight: 600, anchor: 'middle', fill: '#FF9A8F' });
  raceRich(anaO2, 0, 118, 'oxygen', { size: 26, weight: 600, fill: '#FF9A8F' });
  const anaPhone = G(gAna);
  const anaPh = racePhone(anaPhone); tr(anaPh, 0, 40, 0.8);
  const ringTxt = T(anaPhone, 0, -40, 'RING RING', { size: 28, weight: 800, anchor: 'middle', fill: '#FF6070' });

  /* =====================================================================
     OFFICE 2: Larry arrives; the equation; much less energy; Mitch shrugs
     ===================================================================== */
  const gOff2 = G(root);
  const o2Cam = G(gOff2);
  scOffice(o2Cam);
  // the wall Larry bursts through
  const wall = G(o2Cam);
  E('rect', { x: 660, y: 110, width: 480, height: 470, rx: 10, fill: '#9A5646', stroke: '#5A2626', 'stroke-width': 6 }, wall);
  { let d = ''; for (let r = 0; r < 9; r++) { const y = 110 + (r + 1) * 52; if (y < 575) d += `M664,${y} L1136,${y} `; for (let c = 0; c < 6; c++) { const x = 660 + c * 96 + (r % 2 ? 48 : 0) + 48; if (x > 664 && x < 1136) d += `M${x},${110 + r * 52 + 2} L${x},${Math.min(578, 110 + (r + 1) * 52)} `; } } E('path', { d, stroke: '#6E3428', 'stroke-width': 4, fill: 'none' }, wall); }
  const hole = G(wall); tr(hole, 900, 345);
  { const hr = rng(9), pts = []; for (let i = 0; i < 18; i++) { const a = i / 18 * TAU, r = (i % 2 ? 120 : 165) * (0.85 + hr() * 0.3); pts.push(`${(Math.cos(a) * r).toFixed(0)},${(Math.sin(a) * r * 0.9).toFixed(0)}`); } E('path', { d: 'M' + pts.join(' L') + 'Z', fill: '#1A080C', stroke: '#5A2626', 'stroke-width': 6 }, hole); }
  const debris = [], drr = rng(31);
  for (let i = 0; i < 7; i++) {
    const s = 14 + drr() * 18;
    const g = E('path', { d: `M${-s},${-s * 0.6} L${s * 0.8},${-s} L${s},${s * 0.5} L${-s * 0.4},${s} Z`, fill: '#9A5646', stroke: '#5A2626', 'stroke-width': 3 }, o2Cam);
    const a = i / 7 * TAU + drr() * 0.4;
    debris.push({ g, vx: Math.cos(a) * (260 + drr() * 200), vy: Math.sin(a) * (220 + drr() * 160) - 120, rot: (drr() - 0.5) * 720 });
  }
  const dust = []; for (let i = 0; i < 4; i++) dust.push(E('circle', { r: 50, fill: '#E9D2C0', opacity: 0.5 }, o2Cam));
  // whiteboard
  const board = G(o2Cam);
  E('rect', { x: 300, y: 112, width: 840, height: 226, rx: 14, fill: '#F4F7FA', stroke: '#9AA6B2', 'stroke-width': 8 }, board);
  const bGlu = chip(board, 'glucose', { size: 40, fill: C.glucose, color: '#3A2600' });
  const bArrow = arrow(board, 640, 196, 780, 196, { color: '#2A1A22', width: 7 });
  const bLac = chip(board, 'lactic acid', { size: 40, fill: C.lactic, color: '#FFFFFF' });
  const bNoOx = raceRich(board, 520, 296, 'no oxygen needed', { size: 30, fill: '#B5372D' });
  const bLittle = T(board, 930, 296, '+ a little energy', { size: 30, weight: 700, anchor: 'middle', fill: '#8A6D00' });
  const bSpark = spark(board, 13, { seed: 4 }); tr(bSpark, 1080, 286);
  // energy bars
  const bars = G(o2Cam);
  card(bars, 300, 104, 840, 214, { fill: 'rgba(14,26,36,0.92)', stroke: C.energy, sw: 3 });
  T(bars, 720, 146, 'energy released from one glucose', { size: 28, weight: 600, anchor: 'middle', fill: C.muted });
  T(bars, 470, 210, 'aerobic', { size: 32, weight: 700, anchor: 'end', fill: C.energy });
  T(bars, 470, 276, 'anaerobic', { size: 32, weight: 700, anchor: 'end', fill: C.lactic });
  E('rect', { x: 490, y: 184, width: 620, height: 34, rx: 17, fill: '#0B2230', stroke: C.line, 'stroke-width': 2 }, bars);
  E('rect', { x: 490, y: 250, width: 620, height: 34, rx: 17, fill: '#0B2230', stroke: C.line, 'stroke-width': 2 }, bars);
  const barA = E('rect', { x: 490, y: 184, width: 0, height: 34, rx: 17, fill: C.energy }, bars);
  const barN = E('rect', { x: 490, y: 250, width: 0, height: 34, rx: 17, fill: C.lactic }, bars);
  const barLbl = T(bars, 600, 278, '← much less energy', { size: 30, weight: 800, fill: '#FFFFFF' });
  // cast
  const o2MitchW = G(o2Cam), o2Mitch = MITCH;
  const arms = [-1, 1].map(sd => {
    const a = G(o2Mitch.firstChild); tr(a, sd * 116, 20);
    const inner = G(a);
    E('path', { d: `M0,0 L${sd * 46},6 L${sd * 58},-34`, fill: 'none', stroke: '#C2453A', 'stroke-width': 11, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, inner);
    E('circle', { cx: sd * 60, cy: -42, r: 11, fill: '#FF9466', stroke: SC_INK, 'stroke-width': 3 }, inner);
    o2Mitch.firstChild.insertBefore(a, o2Mitch.firstChild.firstChild);
    return { sd, inner };
  });
  const o2GloW = G(o2Cam), o2Glo = GLORIA;
  const crack = E('path', { d: 'M48,-60 L60,-34 L44,-8 L64,18 L50,44 L58,58', fill: 'none', stroke: '#5A2B07', 'stroke-width': 6, 'stroke-linejoin': 'round', 'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': '1 1' }, o2Glo.firstChild);
  const tinyBit = spark(o2Cam, 14, { seed: 7 });
  const o2LarW = G(o2Cam);
  const speedLines = G(o2LarW);
  [-50, 0, 50].forEach((y, i) => E('line', { x1: 120, y1: y, x2: 230 - i * 20, y2: y, stroke: '#FFFFFF', 'stroke-width': 7, 'stroke-linecap': 'round', opacity: 0.7 }, speedLines));
  const o2Lar = LARRY;
  const lacChip = chip(o2Cam, 'LACTIC ACID', { size: 46, fill: C.lactic, color: '#FFFFFF', stroke: '#FFD0E4' });
  const emChip = chip(o2Cam, 'emergency energy!', { size: 32, fill: '#0E1A24', color: C.energy, stroke: C.energy });
  // Mitch's pros and cons
  const pc = G(o2Cam);
  card(pc, 690, 150, 460, 400, { fill: 'rgba(14,26,36,0.9)', stroke: C.line, sw: 3 });
  const pcRows = [['much less energy', false, 250], ['but it\'s fast', true, 350], ['keeps her running', true, 450]].map(([txt, good, y]) => {
    const g = G(pc);
    const ic = good ? tick(g, 18) : cross(g, 16); tr(ic, 740, y - 12);
    T(g, 780, y, txt, { size: 36, weight: 700, fill: good ? C.good : '#FF8A94' });
    return g;
  });

  /* =====================================================================
     CONFESSIONAL: Mitch on Larry
     ===================================================================== */
  const gConf = G(root);
  const cfBg = scConfessional(gConf, 'mitch');
  const cfCam = G(gConf);
  const cfMitchW = G(cfCam); tr(cfMitchW, 430, 400);
  const cfMitch = MITCH;
  const cfMug = scMug(cfCam, 0.8); tr(cfMug, 660, 560, 0.8);
  const cfCard = G(gConf);
  card(cfCard, 730, 136, 420, 450, { fill: 'rgba(14,26,36,0.88)', stroke: C.lactic, sw: 3 });
  const cfL1 = T(cfCard, 940, 192, 'skip the oxygen...', { size: 34, weight: 700, anchor: 'middle', fill: '#FF9A8F' });
  const cfArrow = arrow(cfCard, 940, 214, 940, 262, { color: C.muted, width: 5 });
  const cfLarW = G(cfCard); tr(cfLarW, 880, 360);
  const cfLar = LARRY;
  const cfHalo = E('ellipse', { cx: 880, cy: 282, rx: 46, ry: 12, fill: 'none', stroke: '#FFE45C', 'stroke-width': 7 }, cfCard);
  const cfLbl = T(cfCard, 940, 470, 'lactic acid', { size: 36, weight: 800, anchor: 'middle', fill: C.lactic });
  const cfTag = G(cfCard);
  E('line', { x1: -40, y1: -40, x2: 0, y2: -10, stroke: '#E9E2D0', 'stroke-width': 3 }, cfTag);
  E('path', { d: 'M-12,-20 L84,-20 L104,18 L84,56 L-12,56 Z', fill: '#FFE45C', stroke: '#8A6D00', 'stroke-width': 3, 'stroke-linejoin': 'round' }, cfTag);
  E('circle', { cx: 0, cy: -4, r: 5, fill: '#8A6D00' }, cfTag);
  T(cfTag, 44, 12, 'CHEAP', { size: 26, weight: 800, anchor: 'middle', fill: '#5A2B07' });
  T(cfTag, 44, 44, 'OPTION', { size: 26, weight: 800, anchor: 'middle', fill: '#5A2B07' });

  /* =====================================================================
     MUSCLE: lactic acid builds up = muscle fatigue
     ===================================================================== */
  const gMus = G(root);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#2A0A14', '#4A1224', true) }, gMus);
  const FIB = [150, 300, 450, 600];
  FIB.forEach((y, i) => {
    E('rect', { x: -60, y: y - 62, width: 1320, height: 124, rx: 62, fill: '#7A2A3C', stroke: '#C25A70', 'stroke-width': 4 }, gMus);
    E('line', { x1: -40, y1: y, x2: 1240, y2: y, stroke: '#5A1E2C', 'stroke-width': 104, 'stroke-dasharray': '8 26', 'stroke-dashoffset': i * 11, opacity: 0.6 }, gMus);
  });
  const lacDots = [], lr = rng(77), NL = 40;
  for (let i = 0; i < NL; i++) {
    const row = FIB[i % 4];
    lacDots.push({ el: E('circle', { r: 10, fill: C.lactic, stroke: '#FFD0E4', 'stroke-width': 2.5 }, gMus), x: 40 + lr() * 1120, y: row - 42 + lr() * 84, t0: at('me') + 0.2 + (i / NL) * 4.2 + lr() * 0.3, ph: lr() * TAU });
  }
  const muLarW = G(gMus), muLar = LARRY;
  const muC1 = chip(gMus, 'lactic acid builds up', { size: 36, fill: C.lactic, color: '#FFFFFF', stroke: '#FFD0E4' });
  const muC2 = chip(gMus, 'muscles feel tired and achy', { size: 32, fill: '#0E1A24', color: '#FFD0E4', stroke: C.lactic });
  const fatStamp = raceStamp(gMus, 'MUSCLE FATIGUE', { size: 54, color: '#FFE45C' });

  /* =====================================================================
     GRASS: fourth out of five
     ===================================================================== */
  const gGrass = G(root);
  const grCam = G(gGrass);
  E('rect', { x: -100, y: -100, width: 1400, height: 950, fill: linGrad('#4FB860', '#2E8A40', true) }, grCam);
  { const gr = rng(55); let d = ''; for (let i = 0; i < 90; i++) { const x = gr() * 1300 - 50, y = gr() * 850 - 50, h = 10 + gr() * 14; d += `M${x.toFixed(0)},${y.toFixed(0)} l${(gr() * 6 - 3).toFixed(0)},${(-h).toFixed(0)} `; } E('path', { d, stroke: '#7AD68A', 'stroke-width': 3, 'stroke-linecap': 'round', opacity: 0.7 }, grCam); }
  E('rect', { x: -100, y: -100, width: 1400, height: 180, fill: '#C9563F' }, grCam);
  E('line', { x1: -100, y1: 80, x2: 1300, y2: 80, stroke: '#FFFFFF', 'stroke-width': 6, opacity: 0.85 }, grCam);
  const grShadow = E('ellipse', { cx: 760, cy: 470, rx: 470, ry: 150, fill: '#1E5A2A', opacity: 0.35 }, grCam);
  const grKW = G(grCam);
  { const lg = G(grKW), sk = '#B9784E';   // the rest of her, flat out on the grass
    [-1, 1].forEach(sd => { E('rect', { x: sd > 0 ? 12 : -60, y: 200, width: 48, height: 190, rx: 22, fill: sk, stroke: SC_INK, 'stroke-width': 4 }, lg); E('ellipse', { cx: sd * 36, cy: 398, rx: 34, ry: 22, fill: '#F2F7FA', stroke: SC_INK, 'stroke-width': 4 }, lg); });
    E('path', { d: 'M-84,128 L84,128 L80,236 L-80,236 Z', fill: '#1E2A44', stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, lg); }
  const grK = KAVYA;
  const sign = G(grCam); tr(sign, 930, 230);
  E('line', { x1: 0, y1: 0, x2: 0, y2: 200, stroke: '#8A5A3A', 'stroke-width': 12 }, sign);
  E('rect', { x: -120, y: -80, width: 240, height: 130, rx: 12, fill: '#FFFFFF', stroke: '#2A1A22', 'stroke-width': 5 }, sign);
  T(sign, 0, -6, '4th', { size: 62, weight: 800, anchor: 'middle', fill: '#C2453A' });
  T(sign, 0, 34, 'out of 5', { size: 30, weight: 700, anchor: 'middle', fill: '#2A1A22' });

  /* Larry's lower third */
  const ltLarry = scLowerThird(root, 'LARRY', 'Lactic acid. Emergency cover.');

  const SHOTS = { track: gTrack, off1: gOff1, blood: gBlood, ana: gAna, off2: gOff2, conf: gConf, muscle: gMus, grass: gGrass };

  return t => {
    const [c0, shot, setup] = cutAt(t);
    for (const k in SHOTS) op(SHOTS[k], k === shot ? 1 : 0);
    const u = t - Math.max(c0, 0);   // time since the cut
    arms.forEach(a => op(a.inner, 0)); attr(crack, 'stroke-dashoffset', 1);
    if (shot === 'track') raceSeat(KAVYA, kBustW, 1.5);
    if (shot === 'grass') raceSeat(KAVYA, grKW, 1.4);
    if (shot === 'off1') { raceSeat(MITCH, o1MitchW, 1.2); raceSeat(GLORIA, o1GloW, 0.85); }
    if (shot === 'off2') { raceSeat(MITCH, o2MitchW); raceSeat(GLORIA, o2GloW); raceSeat(LARRY, o2LarW); }
    if (shot === 'conf') { raceSeat(MITCH, cfMitchW, 1.5); raceSeat(LARRY, cfLarW, 0.6); }
    if (shot === 'muscle') raceSeat(LARRY, muLarW, 1.2);

    /* ---------------- TRACK ---------------- */
    if (shot === 'track') {
      const tBang = at('go') + 0.05;
      const wide = setup === 'start' || setup === 'go' || setup === 'firewide' || setup === 'finish';
      op(kClose, wide ? 0 : 1);
      [clockChip, mChip, bang, gauge, moreChip].forEach(e => op(e, 0));
      op(tapeA, 0); op(tapeB, 0); op(finishLine, 0); op(kGlow, 0);
      if (wide) {
        let dist = 0, camK = 1, camX = 600, camY = 375;
        const runners = setup === 'start' || setup === 'go' || setup === 'finish';
        RUN.forEach(r => op(r.w, runners ? 1 : 0)); op(kWrap, 1);
        if (setup === 'start' || setup === 'go') {
          const ub = Math.max(0, t - tBang);
          dist = ub < 0.6 ? 433 * ub * ub : 520 * (ub - 0.3);
          if (setup === 'start') { camK = 1 + 0.08 * P(t, S.first, at('ready') - S.first, linear); camX = 420; camY = 560; }
          RUN.forEach((r, i) => {
            const y = LANE[r.lane], s = LS[r.lane];
            if (t < tBang) { tr(r.w, LX[r.lane] + Math.sin(t * 1.3 + i) * 2, y, s); r.p.pose({ lean: Math.sin(t * 2 + i) * 3 * AMP, armL: [10 + 6 * Math.sin(t * 2 + i), 8], armR: [-10, 8] }); }
            else { tr(r.w, LX[r.lane] + r.v * Math.min(ub, 6) + 10 * Math.min(ub, 1), y, s); r.p.pose(runPose(t + i * 0.13, 1.7)); }
          });
          if (t < tBang) {
            const jit = Math.sin(t * 31) * 1.6 * AMP;
            tr(kWrap, LX[3] + jit, LANE[3], LS[3]);
            kBody.pose({ lean: -2, armL: [6 + 4 * Math.sin(t * 11) * AMP, 30], armR: [-6, 30], legL: [4, -6], legR: [-4, -6] });
          } else { tr(kWrap, LX[3] + 50 * Math.min(ub, 1), LANE[3], LS[3]); kBody.pose(runPose(t, 1.6)); }
          kSweat.set(t < tBang ? 0.6 : 0.4, t);
          op(startLine, 1); tr(startLine, -dist, 0);
          // labels
          if (setup === 'start') {
            racePop(clockChip, 830, 170, P(t, mid('eleven', 0.05), 0.45, pop));
            racePop(mChip, 830, 270, P(t, mid('eleven', 0.55), 0.5, pop));
          } else {
            const bp = P(t, tBang - 0.05, 0.3, pop), bo = 1 - P(t, tBang + 1.1, 0.25, linear);
            op(bang, clamp(bp * 3) * bo); tr(bang, 760, 250, Math.max(0.01, 0.5 + 0.5 * bp), -8);
            const gp = P(t, mid('go', 0.28), 0.4, linear);
            op(gauge, gp); tr(gauge, 950, 150);
            const fill = 0.08 + 0.92 * P(t, mid('go', 0.42), 1.6, easeOut) + 0.03 * Math.sin(t * 18) * P(t, mid('go', 0.7), 0.3, linear) * AMP;
            gMeter.set(fill); gArrow.set(P(t, mid('go', 0.45), 0.8));
            racePop(moreChip, 560, 190, P(t, mid('go', 0.56), 0.5, pop));
          }
        } else if (setup === 'firewide') {
          dist = 300 * u; camK = 1.35; camX = 470; camY = 560;
          tr(kWrap, 470, LANE[3], LS[3]);
          const pose = runPose(t, 1.25); pose.lean = 16; kBody.pose(pose);
          op(kGlow, 0.6 + 0.4 * wave(t, 0.5)); kHeat.upd(t);
          kSweat.set(1, t);
          op(startLine, 0);
        } else if (setup === 'finish') {
          const tf = at('finish') - 0.1, tCross = mid('finish', 0.5);
          dist = 0;
          op(startLine, 0); op(finishLine, 1); tr(finishLine, 820, 0);
          const kx = lerp(260, 820, P(t, tf, tCross - tf, linear)) + 110 * P(t, tCross, 0.8, easeOut);
          const fall = P(t, mid('finish', 0.82), 0.45, easeIn);
          tr(kWrap, kx, LANE[3], LS[3], 84 * fall);
          const pose = runPose(t, 1.2); pose.lean = 18; kBody.pose(fall > 0 ? { lean: 10, armL: [150, 20], armR: [-150, -20], legL: [10, -5], legR: [-10, -5] } : pose);
          kSweat.set(1 - fall, t);
          // winners celebrate past the line; the fifth runner strolls
          RUN.forEach((r, i) => {
            const y = LANE[r.lane], s = LS[r.lane];
            if (r.lane === 4) { tr(r.w, 60 + 45 * (t - tf), y, s); r.p.pose(walkPose(t, 0.9)); }
            else { const jump = Math.abs(Math.sin(t * 5 + i)) * 10 * AMP; tr(r.w, [1010, 1110, 950][r.lane], y - jump, s); r.p.pose({ lean: 0, armL: [165 + 10 * Math.sin(t * 6 + i), 10], armR: [-165 - 10 * Math.sin(t * 6 + i), -10], legL: [6, -4], legR: [-6, -4] }); }
          });
          // tape: whole until she reaches it, then the halves fall away
          const br = P(t, tCross - 0.05, 0.6, easeOut), fl = Math.sin(t * 9) * 3 * AMP;
          op(tapeA, 1); op(tapeB, 1);
          tapeA.setAttribute('transform', `translate(820 330) rotate(${(-br * 60 + fl).toFixed(1)})`);
          tapeB.setAttribute('transform', `translate(856 710) rotate(${(br * 50 - fl).toFixed(1)})`);
        }
        trBg.upd(dist, 1);
        flags.forEach((f, i) => tr(f, ((i * 450 + 160 - dist) % 1350 + 1350) % 1350 - 150, 440));
        raceCam(trCam, camX, camY, camK);
      } else {
        // close-ups: zoomed, softened background
        RUN.forEach(r => op(r.w, 0)); op(kWrap, 0); op(startLine, 0);
        raceCam(trCam, 600, 300, 1.7, 600, 375);
        const fire = setup === 'fireclose';
        trBg.upd(fire ? 200 * u : 0, 1);
        flags.forEach((f, i) => tr(f, ((i * 450 + 160 - (fire ? 200 * u : 0)) % 1350 + 1350) % 1350 - 150, 440));
        tr(kBustW, 430, 540);
        let mood = 'neutral';
        if (!fire) {
          const f = (t - at('ready')) / (end('ready') - at('ready'));
          mood = f < 0.27 ? 'shock' : f < 0.5 ? 'happy' : f < 0.64 ? 'neutral' : 'sad';
        } else mood = 'shock';
        kBust.set({ t, talk: talk(t, 'kavya'), mood, look: 0, sweat: fire ? 1 : 0.5 });
        if (!fire) {
          racePop(lapsChip, 850, 230, P(t, mid('ready', 0.55), 0.45, pop));
          const lp = P(t, mid('ready', 0.66), 0.4, linear), st = 0.55 + 0.5 * P(t, mid('ready', 0.68), 1.3, easeOut);
          op(longTxt, lp); op(longBack, lp);
          longTxt.setAttribute('transform', `translate(850 330) scale(${st.toFixed(3)} 1)`);
          longBack.setAttribute('transform', `translate(850 330) scale(${st.toFixed(3)} 1)`);
          op(fireTxt, 0); op(fireBack, 0); op(kFlames, 0);
        } else {
          op(lapsChip, 0); op(longTxt, 0); op(longBack, 0);
          const fp = P(t, mid('fire', 0.72), 0.4, pop);
          op(fireTxt, clamp(fp * 2)); op(fireBack, clamp(fp * 2));
          const sh = Math.sin(t * 40) * 3 * AMP * clamp(fp);
          tr(fireTxt, 860 + sh, 230, Math.max(0.01, 0.7 + 0.3 * fp)); tr(fireBack, 860 + sh, 230, Math.max(0.01, 0.7 + 0.3 * fp));
          op(kFlames, P(t, mid('fire', 0.5), 0.3, linear)); kFlames.upd(t, 0.4 + 0.6 * P(t, mid('fire', 0.5), 1.2, easeOut));
        }
      }
    }

    /* ---------------- OFFICE 1 ---------------- */
    if (shot === 'off1') {
      const alarm = setup === 'alarm';
      const mt = talk(t, 'mitch');
      op(o1Red, alarm ? 0.08 + 0.14 * wave(t, 0.6) : 0);
      op(beam, alarm ? 1 : 0); tr(beam, 0, 0, 1, alarm ? (t * 260 * AMP) % 360 : 0);
      attr(dome, 'fill', alarm && wave(t, 0.6) > 0.5 ? '#FF6A6A' : ball('#FF4A4A', '#A51C1C'));
      op(beacon, alarm ? 1 : 0.0);
      if (alarm) {
        const gp = P(t, mid('allhands', 0.24), 0.45, pop), sp = P(t, mid('allhands', 0.42), 0.4, pop), np = P(t, mid('allhands', 0.6), 0.45, pop);
        o1Mitch.set({ t, talk: mt, mood: 'shock', look: gp > 0 ? 0.6 : 0, sweat: 1 });
        racePop(o1GloW, 800, 440, gp); o1Glo.set({ t, mood: 'happy', look: -0.6 });
        const flash = np > 0 ? 0.5 + 0.5 * Math.sin(t * 14) : 0;
        racePop(slot, 1040, 440, sp); attr(slotRing, 'stroke', flash > 0.5 ? '#FF3B3B' : '#FF9A8F');
        racePop(handsChip, 860, 180, P(t, at('allhands') + 0.05, 0.4, pop) * (1 - P(t, mid('allhands', 0.58), 0.15, linear)));
        racePop(needChip, 860, 180, np);
        [noCard, note, o1Dim].forEach(e => op(e, 0));
        tr(o1Phone.hand, 0, 0);
        raceCam(o1Cam, 600, 375, 1);
      } else {
        op(o1GloW, 0); op(slot, 0); op(handsChip, 0); op(needChip, 0);
        const fp = (t - at('noox')) / (end('noox') - at('noox'));
        const mood = fp < 0.6 ? 'annoyed' : fp < 0.9 ? 'sad' : 'deadpan';
        o1Mitch.set({ t, talk: mt, mood, look: fp > 0.55 && fp < 0.95 ? 0.7 : 0, sweat: 0.4 });
        const cp = P(t, mid('noox', 0.04), 0.4, linear) * (1 - P(t, mid('noox', 0.8), 0.3, linear));
        op(noCard, cp);
        op(noL2, P(t, mid('noox', 0.24), 0.4, linear));
        racePop(noX, 690, 186, P(t, mid('noox', 0.14), 0.4, pop));
        // red phone: rings, then the handset floats up to Mitch
        const ring = P(t, mid('noox', 0.5), 0.2, linear) * (1 - P(t, mid('noox', 0.72), 0.1, linear));
        const lift = P(t, mid('noox', 0.72), 0.6);
        tr(o1Phone, 640 + Math.sin(t * 50) * 3 * ring * AMP, 522);
        tr(o1Phone.hand, lerp(0, -60, lift) + Math.sin(t * 50) * 3 * ring * AMP, lerp(0, -130, lift) - 6 * ring * Math.abs(Math.sin(t * 25)), 1, -30 * lift);
        racePop(note, 930, 440, P(t, mid('noox', 0.55), 0.45, pop), 1, -4);
        if (t > mid('noox', 0.88)) op(note, 1 - P(t, mid('noox', 0.88), 0.4, linear));
        // the pause: lights dim, slow push-in on Mitch
        const pi = P(t, mid('noox', 0.88), (at('anaerobic') - mid('noox', 0.88)) + 0.2, easeOut);
        op(o1Dim, 0.45 * pi);
        raceCam(o1Cam, 440, 400, 1 + 0.32 * pi, lerp(440, 520, pi), lerp(400, 390, pi));
      }
    }

    /* ---------------- BLOOD ---------------- */
    if (shot === 'blood') {
      blBg.upd(t);
      jam.forEach((j, i) => tr(j.g, j.x + Math.sin(t * 3 + j.ph) * 4 * AMP, j.y + Math.cos(t * 2.4 + j.ph) * 3 * AMP, 1, j.a + Math.sin(t + j.ph) * 4 * AMP));
      const bump = Math.abs(Math.sin(t * 7)) * 4 * AMP;
      tr(taxi, 360 + Math.sin(t * 2.2) * 6 * AMP, 400 - bump);
      racePop(rbcLbl, 360, 600, P(t, at('coming') + 0.1, 0.4, pop));
      const cant = t >= at('cant') - 0.05;
      const moodO = cant ? (t > mid('cant', 0.5) ? 'sad' : 'annoyed') : 'shock';
      const moodB = cant ? 'sad' : (t >= at('deeper') - 0.05 ? 'shock' : 'annoyed');
      const who = scWho(S, t);
      twins.set({ t, talk: talk(t, 'otto'), talkB: talk(t, 'oscar'), mood: moodO, moodB, look: who === 'oscar' ? 1 : 0.2, lookB: who === 'otto' ? -1 : 0.2 });
      // heart: beats faster and faster
      const hu = Math.max(0, t - at('coming')), RAMP = 3.5;
      const f0 = 1.35, f1 = 2.9;
      const ph = hu < RAMP ? f0 * hu + (f1 - f0) * hu * hu / (2 * RAMP) : f0 * RAMP + (f1 - f0) * RAMP / 2 + f1 * (hu - RAMP);
      const beat = Math.pow(Math.max(0, Math.sin(ph * TAU)), 6);
      op(heartCard, P(t, at('coming') + 0.1, 0.3, linear));
      tr(heartG, 830, 232, 1.05 + 0.18 * beat * (S.reduce ? 0.5 : 1));
      setText(bpmN, String(Math.round(lerp(80, 175, P(t, at('coming') + 0.2, 3.2, linear)))));
      // lungs: faster and deeper
      const lu = Math.max(0, t - at('deeper'));
      const lp = P(t, at('deeper') - 0.05, 0.35, pop);
      op(lungCard, clamp(lp * 2)); tr(lungCard, 0, (1 - clamp(lp)) * 20);
      blLungs.set(wave(lu, lerp(1.6, 0.75, P(t, at('deeper'), 1.6, linear))) * lerp(0.4, 1, P(t, at('deeper'), 1.5, linear)) * (S.reduce ? 0.5 : 1));
      slowStamp.set(P(t, mid('cant', 0.45), 0.35), 430, 175, -7);
    }

    /* ---------------- ANAEROBIC ---------------- */
    if (shot === 'ana') {
      racePop(anaO2, 170, 535, P(t, at('anaerobic') + 0.1, 0.4, pop));
      racePop(anaO2x, 0, 0, P(t, mid('anaerobic', 0.14), 0.4, pop));
      racePop(anaTitle, 600, 170, P(t, mid('anaerobic', 0.36), 0.5, pop));
      op(anaSplit, P(t, mid('anaerobic', 0.66), 0.4, linear));
      racePop(anaMean, 0, 0, P(t, mid('anaerobic', 0.8), 0.45, pop));
      anaMean.setAttribute('transform', `translate(600 345) scale(${Math.max(0.01, 0.7 + 0.3 * P(t, mid('anaerobic', 0.8), 0.45, pop)).toFixed(3)}) translate(-600 -345)`);
      // the phone, still ringing in the corner
      const rg = Math.sin(t * 44) * 4 * AMP * (wave(t, 1.2) > 0.4 ? 1 : 0);
      tr(anaPhone, 1080 + rg, 330);
      op(ringTxt, wave(t, 1.2) > 0.4 ? 1 : 0.15);
      op(anaPhone, P(t, at('anaerobic') + 0.6, 0.4, linear));
    }

    /* ---------------- OFFICE 2 ---------------- */
    if (shot === 'off2') {
      const who = scWho(S, t);
      op(o2MitchW, setup === 'two' ? 0 : 1); op(o2GloW, setup === 'mitch' ? 0 : 1);
      [wall, board, bars, pc, lacChip, emChip, tinyBit, speedLines].forEach(e => op(e, 0));
      debris.forEach(d => op(d.g, 0)); dust.forEach(d => op(d, 0));
      arms.forEach(a => op(a.inner, 0));
      attr(crack, 'stroke-dashoffset', 1);
      if (setup === 'burst') {
        const tb = at('larry') + 0.02, bp = P(t, tb, 0.25, easeOut);
        op(wall, 1); op(hole, bp > 0 ? 1 : 0); tr(hole, 900, 345, Math.max(0.01, bp));
        debris.forEach((d, i) => { const q = t - tb; if (q <= 0 || q > 1.6) return; op(d.g, 1 - q / 1.6); tr(d.g, 900 + d.vx * q, 345 + d.vy * q + 420 * q * q, 1, d.rot * q); });
        dust.forEach((d, i) => { const q = t - tb - i * 0.05; if (q <= 0 || q > 1.4) return; const a = i / 4 * TAU + 0.4; tr(d, 900 + Math.cos(a) * 140 * easeOut(q / 1.4), 345 + Math.sin(a) * 110 * easeOut(q / 1.4), 0.6 + q); op(d, 0.6 * (1 - q / 1.4)); });
        const lp = P(t, tb + 0.05, 0.5, pop);
        tr(o2LarW, lerp(900, 840, clamp(lp)), lerp(345, 400, clamp(lp))); op(o2LarW, lp > 0 ? 1 : 0);
        tr(o2Lar, 0, 0, Math.max(0.01, 1.15 * (0.3 + 0.7 * lp)));
        o2Lar.set({ t, talk: talk(t, 'larry'), mood: t < mid('larry', 0.5) ? 'happy' : 'smug', look: -0.5, sweat: 0.3 });
        tr(o2MitchW, 230, 450); tr(o2Mitch, 0, 0, 0.9);
        o2Mitch.set({ t, mood: t < tb ? 'neutral' : 'deadpan', look: 0.8 });
        tr(o2GloW, 510, 480); tr(o2Glo, 0, 0, 0.8);
        o2Glo.set({ t, mood: t < tb ? 'neutral' : 'shock', look: 0.8 });
        racePop(lacChip, 860, 640, P(t, mid('larry', 0.36), 0.45, pop));
        racePop(emChip, 860, 165, P(t, mid('larry', 0.6), 0.45, pop));
        raceCam(o2Cam, 600, 375, 1 + 0.03 * P(t, tb, 0.2, linear) * Math.sin(t * 60) * AMP * (1 - P(t, tb + 0.3, 0.3, linear)));
      } else if (setup === 'board') {
        op(board, 1); op(o2LarW, 1);
        racePop(bGlu, 520, 196, P(t, mid('larryeq', 0.04), 0.4, pop));
        bArrow.set(P(t, mid('larryeq', 0.12), 0.4));
        racePop(bLac, 930, 196, P(t, mid('larryeq', 0.2), 0.4, pop));
        op(bNoOx, P(t, mid('larryeq', 0.42), 0.4, linear));
        op(bLittle, P(t, mid('larryeq', 0.42), 0.4, linear)); op(bSpark, P(t, mid('larryeq', 0.45), 0.4, linear)); bSpark.upd(t);
        const zp = P(t, mid('larryeq', 0.68), 0.25, linear);
        const zx = zp > 0 ? Math.sin((t - mid('larryeq', 0.68)) * 16) * 40 * AMP * (1 - P(t, end('larryeq'), 0.3, linear)) : 0;
        op(speedLines, zp * (1 - P(t, end('larryeq'), 0.3, linear)));
        tr(o2LarW, 900 + zx, 540); tr(o2Lar, 0, 0, 0.95);
        o2Lar.set({ t, talk: talk(t, 'larry'), mood: 'happy', look: -0.3 });
        tr(o2MitchW, 190, 560); tr(o2Mitch, 0, 0, 0.75);
        o2Mitch.set({ t, mood: 'deadpan', look: 0.9 });
        tr(o2GloW, 560, 570); tr(o2Glo, 0, 0, 0.72);
        o2Glo.set({ t, mood: t < mid('larryeq', 0.4) ? 'neutral' : 'annoyed', look: 0.8 });
        raceCam(o2Cam, 600, 375, 1);
      } else if (setup === 'two') {
        op(bars, 1); op(o2LarW, 1);
        tr(o2GloW, 320, 500); tr(o2Glo, 0, 0, 1.1);
        tr(o2LarW, 880, 500); tr(o2Lar, 0, 0, 1.1);
        const fl = (t - at('little')) / (end('little') - at('little'));
        const gMood = t < at('hurry') ? (fl < 0.22 ? 'shock' : 'annoyed') : (t < mid('hurry', 0.75) ? 'annoyed' : 'sad');
        o2Glo.set({ t, talk: talk(t, 'gloria'), mood: gMood, look: 0.7 });
        o2Lar.set({ t, talk: talk(t, 'larry'), mood: t < at('hurry') ? 'smug' : (who === 'larry' ? 'happy' : 'smug'), look: -0.7, sweat: 0.4 });
        attr(crack, 'stroke-dashoffset', (1 - P(t, mid('hurry', 0.42), 0.6)).toFixed(3));
        // a tiny spark nibbled from Gloria to Larry
        const sp = P(t, mid('little', 0.35), 1.1, linear);
        op(tinyBit, sp > 0 && sp < 1 ? Math.sin(sp * Math.PI) : 0);
        tr(tinyBit, lerp(400, 800, ease(sp)), 470 - Math.sin(sp * Math.PI) * 90); tinyBit.upd(t);
        op(bars, P(t, at('little') + 0.2, 0.3, linear));
        attr(barN, 'width', Math.max(0.01, 46 * P(t, mid('little', 0.6), 0.6, easeOut)));
        attr(barA, 'width', Math.max(0.01, 620 * P(t, mid('hurry', 0.55), 1.0, easeOut)));
        op(barN, P(t, mid('little', 0.6), 0.1, linear)); op(barA, P(t, mid('hurry', 0.55), 0.1, linear));
        op(barLbl, P(t, mid('hurry', 0.78), 0.4, linear)); tr(barLbl, -40, 0);
        raceCam(o2Cam, 600, 375, 1);
      } else {   // mitch: the shrug
        op(pc, 1); op(o2LarW, 0);
        tr(o2MitchW, 380, 420); tr(o2Mitch, 0, 0, 1.25);
        const fw = (t - at('worth')) / (end('worth') - at('worth'));
        o2Mitch.set({ t, talk: talk(t, 'mitch'), mood: fw < 0.35 ? 'deadpan' : 'neutral', look: 0 });
        const sh = P(t, at('worth') + 0.05, 0.35, easeOut) * (1 - 0.6 * P(t, mid('worth', 0.4), 0.4)) + 0.6 * P(t, mid('worth', 0.9), 0.3, easeOut);
        arms.forEach(a => { op(a.inner, 1); tr(a.inner, 0, -10 * sh, 1, a.sd * lerp(75, 0, sh)); });
        pcRows.forEach((g, i) => { const p = P(t, mid('worth', [0.08, 0.42, 0.66][i]), 0.4, pop); op(g, clamp(p * 2)); tr(g, (1 - clamp(p)) * 30, 0); });
        raceCam(o2Cam, 600, 375, 1);
      }
      ltLarry.set(win(t, at('larry') + 0.45, at('th_larry') - 0.15, 0.3));
    } else op(ltLarry, 0);

    /* ---------------- CONFESSIONAL ---------------- */
    if (shot === 'conf') {
      cfBg.set(1, t);
      const isCard = setup === 'card';
      op(cfCard, isCard ? 1 : 0);
      if (isCard) {
        const fm = (t - at('th_larry')) / (end('th_larry') - at('th_larry'));
        cfMitch.set({ t, talk: talk(t, 'mitch'), mood: fm < 0.42 ? 'deadpan' : fm < 0.62 ? 'neutral' : 'deadpan', look: fm > 0.15 && fm < 0.35 ? 0.8 : 0 });
        op(cfL1, P(t, mid('th_larry', 0.05), 0.4, linear)); cfArrow.set(P(t, mid('th_larry', 0.14), 0.4));
        racePop(cfLarW, 880, 360, P(t, mid('th_larry', 0.2), 0.45, pop));
        cfLar.set({ t, mood: fm < 0.75 ? 'happy' : 'smug', look: -0.4 });
        op(cfLbl, P(t, mid('th_larry', 0.26), 0.4, linear));
        racePop(cfHalo, 0, 0, P(t, mid('th_larry', 0.46), 0.4, pop));
        cfHalo.setAttribute('transform', `translate(0 ${(Math.sin(t * 3) * 3 * AMP).toFixed(1)})`);
        const tp = P(t, mid('th_larry', 0.8), 0.5, pop);
        op(cfTag, clamp(tp * 2)); tr(cfTag, 1000, 330, Math.max(0.01, tp), 10 + Math.sin(t * 3) * 6 * AMP);
        const pi = P(t, mid('th_larry', 0.9), at('larryeq') - mid('th_larry', 0.9) + 0.2, easeOut);
        raceCam(cfCam, 430, 360, 1 + 0.18 * pi);
      } else {
        // after "You're welcome!": the stare
        cfMitch.set({ t, mood: 'deadpan', look: 0 });
        raceCam(cfCam, 430, 360, 1.12 + 0.12 * P(t, c0, at('finish') - c0, linear));
      }
    }

    /* ---------------- MUSCLE ---------------- */
    if (shot === 'muscle') {
      lacDots.forEach(d => {
        const p = P(t, d.t0, 0.35, pop);
        op(d.el, clamp(p * 2));
        if (p > 0) { attr(d.el, 'cx', d.x + Math.sin(t * 2 + d.ph) * 4 * AMP); attr(d.el, 'cy', d.y + Math.cos(t * 1.7 + d.ph) * 4 * AMP); attr(d.el, 'r', Math.max(0.01, 13 * p)); }
      });
      const welcome = t >= at('welcome') - 0.05;
      const bow = P(t, at('welcome') + 0.1, 0.35, easeOut) * (1 - P(t, end('welcome') + 0.05, 0.25, linear));
      tr(muLarW, 300, 420 + 26 * bow, 1, -18 * bow);
      muLar.set({ t, talk: talk(t, 'larry'), mood: welcome ? 'happy' : (t < mid('me', 0.3) ? 'happy' : 'smug'), look: welcome ? 0 : 0.6, sweat: 0.5 });
      racePop(muC1, 830, 180, P(t, mid('me', 0.2), 0.45, pop));
      racePop(muC2, 830, 300, P(t, mid('me', 0.42), 0.45, pop));
      fatStamp.set(P(t, mid('me', 0.76), 0.35), 830, 450, -6);
    }

    /* ---------------- GRASS ---------------- */
    if (shot === 'grass') {
      const ff = (t - at('fourth')) / (end('fourth') - at('fourth'));
      const mood = ff < 0.45 ? 'deadpan' : ff < 0.72 ? 'sad' : 'deadpan';
      const pant = Math.sin(t * 5) * 3 * AMP;
      tr(grKW, 560, 470 + pant * 0.3, 1, -90);
      grK.set({ t, talk: talk(t, 'kavya'), mood, look: 0, sweat: 0.8, still: true });
      tr(sign, 930, 230, 1, Math.sin(t * 1.2) * 1.5 * AMP);
      const pi = P(t, at('fourth') + 0.3, S.D - at('fourth'), easeOut);
      raceCam(grCam, 520, 450, 1 + 0.16 * pi, lerp(520, 540, pi), lerp(450, 430, pi));
    }
  };
});
