/* LUNG HAUL (Claude Sitcom Ep 3, Breathing & Gas Exchange): cast, sets and props.
   Bundled after engine lib.js, kit.js and sitcom.js. Every global here starts with `lh`, except `cast`.
   From the shared kit use: scWho / scTalk (mouths), scConfessional, scLowerThird, scVideoCall,
   scKavya / scKavyaBody, scClipboard, scTrack, scBlood.

   CAST: cast(parent, kind, o) -> g, origin at the character's centre, about 200 px tall at s = 1
     kinds   'dennis'  Dennis, the diaphragm: a red dome of muscle, yellow hard hat, hi-vis band, tired eye bags.
                       Extra set() field: flat 0..1 (0 = relaxed dome, 1 = contracted and flattened; the hat rides down).
             'iggy'    Iggy, the intercostal muscles: a red striped muscle block between two cream ribs, sweatband,
                       flexing arms. Extra: lift 0..1 (ribs pulled up and out).
             'alvi'    Alvi, an alveolus: a pale pink air sac on a bronchiole stalk, capillary net round her lower half,
                       lanyard and badge. Use sweat 0..1 for "moist" (shiny drops).
             'ozzie'   Ozzie, oxygen (O2): two red atoms, one face, bucket hat, tourist camera.
             'colin'   Colin, carbon dioxide (CO2): grey C with the face, red O either side, sunglasses up on his
                       head, purple cravat. Smug by default.
             'nigel'   Nigel, nitrogen (N2): two blue atoms, one small face, headphones. Neutral by default; never emotes much.
             'smokey'  Smokey, tobacco smoke: a lumpy grey-brown cloud, flat cap, thin moustache, tar stains, curling wisps.
             'kavya'   Kavya (scKavya from the shared kit).
     o: { s (scale), mood (default mood) }
     g.set({ t, talk, mood, look, sweat, still, flat (dennis), lift (iggy) })   call every frame
       talk 0..1 from scTalk(S, t, who); mood neutral | happy | smug | annoyed | sad | shock | deadpan; look -1..1.
   LH_TINT[kind] = [top, bottom] colours; lhConf(parent, kind) = scConfessional(parent, top, bottom).
   LH_LOWER[kind] = [name, role] for scLowerThird.

   TEXT
     lhRich(parent, x, y, str, o)    text with real subscripts written 'CO_2', 'O_2', 'C_6H_12O_6' and **bold** parts.
                                     o: size, weight, fill, anchor, font, boldFill. Returns the <text>.
     lhChip(parent, str, o)          a pill with lhRich text centred (same o as chip(): size, fill, stroke, sw, color, padX).
   SETS (full stage, 1200 x 750)
     lhLiving(parent)                Kavya's HDB flat: warm walls, window with HDB blocks, a split aircon (cold air lines),
                                     a teal sofa. g.upd(t). g.sofa = [x, y] of the seat centre (600, 520).
     lhTerminal(parent)              the airport inside the lung: pink ribbed arches, a window onto branching airways,
                                     shiny floor, an indoor tree, the LUNG INTERNATIONAL banner (top right). g.upd(t).
     lhExchange(parent)              the gas-exchange cross-section: alveolus air (left, x 0..560), the two thin walls
                                     (x 560..640, one cell each), a capillary with flowing blood (right, x 640..1200).
                                     g.upd(t) scrolls the red blood cells. g.air / g.blood = { x, y, w, h } boxes.
   PROPS
     lhSign(parent, text, o)         airport wayfinding sign, yellow on dark; o: size (32), arrow 'left'|'right'|'up'|'down',
                                     icon ('plane'). Centred on its origin. g.w, g.h.
     lhBoard(parent, title, rows, o) flip-board ("DEPARTURES"): rows [[left, right, colour?], ...], text via lhRich.
                                     g.set(p) reveals rows one by one (0..1), with a flip flicker. Width o.w (760).
     lhRouteMap(parent)              MRT-style line map of the airway: NOSE, TRACHEA, BRONCHI, BRONCHIOLES, ALVEOLI along
                                     x 0..1000 (origin = NOSE). g.set(p) moves the "you are here" marker (p 0..1 along the
                                     line) and lights the stations passed. g.stations = [{ x, name }].
     lhChest(parent)                 front-view chest: trachea, bronchi, lungs (kit lungs), 5 ribs a side with red
                                     intercostal muscles between, the diaphragm dome below. About 560 x 600, origin = chest
                                     centre. g.set(b, flow): b 0..1 breath (0 = out: dome up, ribs down and in; 1 = in:
                                     diaphragm flat, ribs up and out, lungs bigger); flow -1..1 shows the air arrow at the
                                     mouth (+ in, - out). g.pts = { trachea, bronchus, lung, rib, inter, diaphragm } anchors.
     lhLining(parent, w)             a strip of airway lining, w wide, 200 tall (origin top-left): ciliated cells with beating
                                     cilia, goblet cells with mucus, a mucus layer carrying dust to the right ("to the throat").
                                     g.upd(t, rate, tar): rate 0..1 beat and flow speed; tar 0..1 brown coat, cilia droop.
     lhCluster(parent, o)            a bunch of alveoli at the end of a bronchiole, wrapped in capillaries, about 320 x 320,
                                     origin at the bunch centre. o.emph = true: emphysema (walls broken down, fewer, bigger
                                     sacs, much less surface). g.upd(t) breathes gently.
     lhRBC(parent, s)                a red blood cell as an airport taxi (TAXI roof sign); 4 haemoglobin seats along the top.
                                     g.seats = [[x, y] x4] (local), for O2 or CO riders. About 170 x 80.
     lhMol(parent, kind, r)          small extra molecules: 'O2' | 'CO2' | 'H2O' (lib art), 'N2' (two blue atoms), 'CO' (grey C + red O).
     lhBrain(parent, s)              a pink brain with a CO2 gauge in front; g.set(v 0..1) moves the needle, red over 0.7.
     lhVHS(parent)                   training-video overlay: scanlines, "PLAY" and a timestamp top right, a rolling
                                     tracking band. g.set(p, t).
     lhSnack(parent, s)              a curry puff on a plate (Kavya's snack).
     lhPlane(parent, s, col)         a little plane icon pointing right (title card, signs).
*/

/* ---------- palette ---------- */
const LH = {
  muscle: '#D94A5C', muscleDk: '#8E2234', muscleLt: '#F28A97',
  bone: '#F4E7C8', boneDk: '#B79E6A',
  sac: '#FFD3DE', sacDk: '#C9637F', lung: '#F48FA6', lungDk: '#B8466A',
  nitro: '#6E8BFF', nitroDk: '#3346B0',
  smoke: '#8C857A', smokeDk: '#57514A', tar: '#5A3A1E',
  sign: '#1B2733', signTx: '#FFD23F', hivis: '#D7F542',
  vein: '#9E2B3C', artery: '#E8424F',
};
const LH_TINT = {
  dennis: ['#3A1418', '#6E2630'], iggy: ['#3A1A12', '#7A3420'], alvi: ['#3A1828', '#6E2D4E'],
  ozzie: ['#3A1414', '#6E2323'], colin: ['#22272E', '#3D4652'], nigel: ['#141E3A', '#24366E'],
  smokey: ['#1E1C1A', '#3E3934'], kavya: ['#14243A', '#25446B'],
};
const LH_LOWER = {
  dennis: ['DENNIS', 'Diaphragm. Head of Ground Operations.'],
  iggy: ['IGGY', 'Intercostal muscles. Lives between the ribs.'],
  alvi: ['ALVI', 'An alveolus. Gate 271,000,004.'],
  ozzie: ['OZZIE', 'Oxygen. First time in a lung.'],
  colin: ['COLIN', 'Carbon dioxide. Business class.'],
  nigel: ['NIGEL', 'Nitrogen. 78% of the air. Unchanged.'],
  smokey: ['SMOKEY', 'Tobacco smoke. Not welcome.'],
  kavya: ['KAVYA, 12', 'Resting. Professionally.'],
};
function lhConf(parent, kind) { const [a, b] = LH_TINT[kind] || LH_TINT.dennis; return scConfessional(parent, a, b); }

/* ---------- text ---------- */
function lhRich(parent, x, y, str, o) {
  o = o || {};
  const size = o.size || 32, sub = Math.round(size * 0.62), dy = Math.round(size * 0.26);
  const t = E('text', { x, y, 'font-size': size, 'font-weight': o.weight || 700, fill: o.fill || C.ink, 'text-anchor': o.anchor || 'start', 'font-family': o.font || FD }, parent);
  let low = false;
  const push = (txt, isSub, bold) => {
    const ts = E('tspan', {}, t); ts.textContent = txt;
    if (bold) { ts.setAttribute('font-weight', 800); if (o.boldFill) ts.setAttribute('fill', o.boldFill); }
    if (isSub) { ts.setAttribute('font-size', sub); if (!low) { ts.setAttribute('dy', dy); low = true; } }
    else if (low) { ts.setAttribute('dy', -dy); low = false; }
  };
  String(str).split(/(\*\*[^*]+\*\*)/).forEach(seg => {
    if (!seg) return;
    const bold = seg.startsWith('**'), inner = bold ? seg.slice(2, -2) : seg;
    inner.split(/(_\d+)/).forEach(p => { if (!p) return; if (p[0] === '_') push(p.slice(1), true, bold); else push(p, false, bold); });
  });
  return t;
}
function lhChip(parent, str, o) {
  o = o || {};
  const size = o.size || 30, h = o.h || Math.round(size * 1.75), padX = o.padX !== undefined ? o.padX : size * 0.7;
  const plain = String(str).replace(/\*\*/g, '').replace(/_(\d+)/g, '$1');
  const w = o.w || Math.ceil(textWidth(plain, size, o.font, o.weight || 700) * 0.97 + padX * 2);
  const g = G(parent);
  g.box = E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: o.rx !== undefined ? o.rx : h / 2, fill: o.fill || C.card2, stroke: o.stroke || 'none', 'stroke-width': o.sw || 3 }, g);
  g.label = lhRich(g, 0, size * 0.35, str, { size, weight: o.weight || 700, fill: o.color || C.ink, anchor: 'middle', font: o.font, boldFill: o.boldFill });
  g.w = w; g.h = h;
  return g;
}

/* ---------- the cast ---------- */
function cast(parent, kind, o) {
  o = o || {};
  if (kind === 'kavya') return scKavya(parent, o);
  const INK = SC_INK;
  const base = { s: o.s, mood: o.mood };

  if (kind === 'dennis') {
    let body, arc1, arc2, hat, band;
    const domePath = (A, k, base) => `M${-130 * k},${base} L${-130 * k},40 C${-128 * k},${A} ${128 * k},${A} ${130 * k},40 L${130 * k},${base}`;
    const c = scMake(parent, Object.assign(base, { seed: 12, bob: 2, mood: o.mood || 'deadpan',
      draw: g => {
        body = E('path', { d: '', fill: ball(LH.muscle, LH.muscleDk), stroke: INK, 'stroke-width': 6, 'stroke-linejoin': 'round' }, g);
        arc1 = E('path', { d: '', fill: 'none', stroke: LH.muscleLt, 'stroke-width': 4, opacity: 0.55, 'stroke-linecap': 'round' }, g);
        arc2 = E('path', { d: '', fill: 'none', stroke: LH.muscleDk, 'stroke-width': 4, opacity: 0.5, 'stroke-linecap': 'round' }, g);
        // muscle fibres fanning up from the base
        E('path', { d: 'M-108,62 L-120,28 M108,62 L120,28', stroke: LH.muscleDk, 'stroke-width': 3.5, opacity: 0.45, 'stroke-linecap': 'round' }, g);
        // hi-vis band and its reflective stripe
        band = G(g);
        E('path', { d: 'M-130,64 Q0,78 130,64 L130,82 Q0,98 -130,82 Z', fill: LH.hivis, stroke: INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, band);
        E('path', { d: 'M-128,74 Q0,88 128,74', fill: 'none', stroke: '#E9EEF2', 'stroke-width': 4 }, band);
        // tired eye bags (under the face's eyes at y = -8, x = +-36)
        E('path', { d: 'M-58,20 Q-36,30 -14,20 M14,20 Q36,30 58,20', fill: 'none', stroke: LH.muscleDk, 'stroke-width': 3.5, 'stroke-linecap': 'round' }, g);
        hat = G(g);
        E('path', { d: 'M-46,0 Q-46,-46 0,-46 Q46,-46 46,0 Z', fill: ball('#FFD23F', '#C99A00'), stroke: INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, hat);
        E('path', { d: 'M-6,-45 L-6,-2 M6,-45 L6,-2', stroke: '#C99A00', 'stroke-width': 4 }, hat);
        E('rect', { x: -62, y: -6, width: 124, height: 12, rx: 6, fill: '#FFD23F', stroke: INK, 'stroke-width': 4 }, hat);
      },
      face: { x: 0, y: -8, eye: 20, gap: 72, mouthW: 54, mouthY: 44, lidCol: LH.muscle },
      sweat: [[-112, -10], [114, 0]],
      upd: (t, g, st) => {
        const f = clamp(st.flat || 0), A = lerp(-140, -66, f);       // apex y = 40 + 0.75 (A - 40): -95 dome .. -40 flat
        attr(body, 'd', domePath(A, 1, 84) + ' Q0,100 -130,84 Z');
        attr(arc1, 'd', `M-100,64 C-94,${(A + 40).toFixed(1)} 98,${(A + 40).toFixed(1)} 100,64`);
        attr(arc2, 'd', `M-112,66 C-110,${(A + 18).toFixed(1)} 110,${(A + 18).toFixed(1)} 112,66`);
        tr(hat, 0, 40 + 0.75 * (A - 40) + 4);
      } }));
    return c;
  }

  if (kind === 'iggy') {
    let ribT, ribB, armL, armR;
    const c = scMake(parent, Object.assign(base, { seed: 14, bob: 6, mood: o.mood || 'happy',
      draw: g => {
        // flexing arms behind the body
        const arm = side => {
          const a = G(g); tr(a, side * 92, 18);
          const d = `M0,0 Q${side * 54},4 ${side * 68},-24 Q${side * 74},-52 ${side * 60},-70`;
          E('path', { d, fill: 'none', stroke: INK, 'stroke-width': 30, 'stroke-linecap': 'round' }, a);
          E('path', { d, fill: 'none', stroke: LH.muscle, 'stroke-width': 21, 'stroke-linecap': 'round' }, a);
          E('ellipse', { cx: side * 52, cy: -16, rx: 18, ry: 14, fill: LH.muscleLt, stroke: INK, 'stroke-width': 4 }, a);   // bicep
          E('circle', { cx: side * 60, cy: -76, r: 16, fill: LH.muscle, stroke: INK, 'stroke-width': 4 }, a);                // fist
          return a;
        };
        armL = arm(-1); armR = arm(1);
        // the muscle block, fibres running diagonally (as real intercostals do)
        E('path', { d: 'M-90,-70 Q0,-80 90,-70 Q112,0 90,66 Q0,76 -90,66 Q-112,0 -90,-70 Z', fill: ball(LH.muscle, LH.muscleDk), stroke: INK, 'stroke-width': 6, 'stroke-linejoin': 'round' }, g);
        let fib = '';
        for (let i = -5; i <= 5; i++) fib += `M${i * 30 - 24},64 L${i * 30 + 24},-66 `;
        const cp = E('clipPath', { id: 'lhIggyClip' }, defs()); E('rect', { x: -90, y: -66, width: 180, height: 128, rx: 22 }, cp);
        E('path', { d: fib, stroke: LH.muscleDk, 'stroke-width': 4, opacity: 0.35, 'clip-path': 'url(#lhIggyClip)' }, g);
        // sweatband
        E('path', { d: 'M-97,-56 Q0,-66 97,-56 L99,-40 Q0,-50 -99,-40 Z', fill: '#FFFFFF', stroke: INK, 'stroke-width': 3.5, 'stroke-linejoin': 'round' }, g);
        E('path', { d: 'M-98,-48 Q0,-58 98,-48', fill: 'none', stroke: '#3F5BD9', 'stroke-width': 6 }, g);
        // ribs above and below
        const rib = y => {
          const r = G(g); tr(r, 0, y);
          E('path', { d: 'M-140,16 Q0,-20 140,16', fill: 'none', stroke: INK, 'stroke-width': 30, 'stroke-linecap': 'round' }, r);
          E('path', { d: 'M-140,16 Q0,-20 140,16', fill: 'none', stroke: LH.bone, 'stroke-width': 20, 'stroke-linecap': 'round' }, r);
          E('path', { d: 'M-110,8 Q0,-20 110,8', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 5, 'stroke-linecap': 'round', opacity: 0.7 }, r);
          return r;
        };
        ribT = rib(-96); ribB = rib(72);
      },
      face: { x: 0, y: -2, eye: 19, gap: 60, mouthW: 60, mouthY: 36, lidCol: LH.muscle },
      sweat: [[-80, -20], [84, -10]],
      upd: (t, g, st) => {
        const l = clamp(st.lift || 0);
        ribT.setAttribute('transform', `translate(0 ${(-96 - 12 * l).toFixed(1)}) scale(${(1 + 0.08 * l).toFixed(3)} 1)`);
        ribB.setAttribute('transform', `translate(0 ${(72 - 6 * l).toFixed(1)}) scale(${(1 + 0.08 * l).toFixed(3)} 1)`);
        const fl = st.still ? 0 : Math.sin(t * 5.2) * 6;
        armL.setAttribute('transform', `translate(-92 18) rotate(${(-fl).toFixed(1)})`);
        armR.setAttribute('transform', `translate(92 18) rotate(${fl.toFixed(1)})`);
      } }));
    return c;
  }

  if (kind === 'alvi') {
    return scMake(parent, Object.assign(base, { seed: 16, bob: 5, mood: o.mood || 'happy',
      draw: g => {
        // bronchiole stalk, up and to the right
        E('path', { d: 'M30,-80 Q44,-120 84,-138', fill: 'none', stroke: INK, 'stroke-width': 30, 'stroke-linecap': 'round' }, g);
        E('path', { d: 'M30,-80 Q44,-120 84,-138', fill: 'none', stroke: LH.lung, 'stroke-width': 21, 'stroke-linecap': 'round' }, g);
        // the sac: a thin wall (one cell thick) drawn as a thinner outline
        E('circle', { r: 92, fill: ball(LH.sac, '#F39AB2'), stroke: INK, 'stroke-width': 4 }, g);
        // capillary net around the lower half: oxygen-poor (dark red) on the left, oxygen-rich (bright red) on the right
        E('path', { d: 'M-92,6 Q-70,40 -86,62 M-60,80 Q-40,52 -20,90 M-86,40 Q-50,30 -40,70', fill: 'none', stroke: LH.vein, 'stroke-width': 7, 'stroke-linecap': 'round' }, g);
        E('path', { d: 'M92,6 Q70,40 86,62 M60,80 Q40,52 20,90 M86,40 Q50,30 40,70', fill: 'none', stroke: LH.artery, 'stroke-width': 7, 'stroke-linecap': 'round' }, g);
        E('path', { d: 'M-20,90 Q0,76 20,90', fill: 'none', stroke: '#C2364A', 'stroke-width': 7, 'stroke-linecap': 'round' }, g);
        // moist sheen
        E('ellipse', { cx: -46, cy: -52, rx: 22, ry: 12, fill: '#FFFFFF', opacity: 0.7, transform: 'rotate(-35 -46 -52)' }, g);
        E('circle', { cx: -66, cy: -24, r: 5, fill: '#FFFFFF', opacity: 0.7 }, g);
        // lashes (outer corners of the eyes at y = -12)
        E('path', { d: 'M-50,-34 L-58,-42 M-46,-37 L-50,-47 M50,-34 L58,-42 M46,-37 L50,-47', stroke: INK, 'stroke-width': 3.5, 'stroke-linecap': 'round' }, g);
        // cheeks
        E('ellipse', { cx: -52, cy: 22, rx: 13, ry: 8, fill: '#FF7FA0', opacity: 0.55 }, g);
        E('ellipse', { cx: 52, cy: 22, rx: 13, ry: 8, fill: '#FF7FA0', opacity: 0.55 }, g);
        // lanyard and badge
        E('path', { d: 'M-40,52 L0,76 L40,52', fill: 'none', stroke: '#3F5BD9', 'stroke-width': 5, 'stroke-linejoin': 'round' }, g);
        const b = G(g); tr(b, 0, 92, 1, -6);
        E('rect', { x: -26, y: -18, width: 52, height: 40, rx: 6, fill: '#FFFFFF', stroke: INK, 'stroke-width': 3.5 }, b);
        E('rect', { x: -26, y: -18, width: 52, height: 12, rx: 4, fill: '#3F5BD9' }, b);
        T(b, 0, 14, 'GATE', { size: 14, weight: 800, anchor: 'middle', fill: INK });
      },
      face: { x: 0, y: -12, eye: 20, gap: 60, mouthW: 46, mouthY: 40, lidCol: LH.sac, iris: '#6B2440' },
      sweat: [[-80, -60], [78, -48], [-96, 30], [96, 20]] }));
  }

  if (kind === 'ozzie') {
    return scMake(parent, Object.assign(base, { seed: 18, bob: 7, mood: o.mood || 'happy',
      draw: g => {
        // backpack peeking out behind the right atom
        E('rect', { x: 70, y: -92, width: 96, height: 130, rx: 26, fill: '#3E9A5A', stroke: INK, 'stroke-width': 5 }, g);
        E('path', { d: 'M74,-62 Q118,-50 162,-62 L162,-76 Q162,-92 140,-92 L96,-92 Q74,-92 74,-76 Z', fill: '#2F7A46', stroke: INK, 'stroke-width': 4 }, g);
        E('rect', { x: 150, y: -40, width: 26, height: 44, rx: 8, fill: '#2F7A46', stroke: INK, 'stroke-width': 3.5 }, g);
        // the two oxygen atoms, one outline
        E('circle', { cx: -52, r: 76, fill: 'none', stroke: INK, 'stroke-width': 12 }, g);
        E('circle', { cx: 52, r: 76, fill: 'none', stroke: INK, 'stroke-width': 12 }, g);
        E('circle', { cx: -52, r: 76, fill: ball(C.oxygen, C.oxygenDk) }, g);
        E('circle', { cx: 52, r: 76, fill: ball(C.oxygen, C.oxygenDk) }, g);
        E('path', { d: 'M0,-58 Q8,0 0,58', fill: 'none', stroke: C.oxygenDk, 'stroke-width': 4, opacity: 0.6 }, g);
        T(g, -92, 52, 'O', { size: 30, weight: 800, anchor: 'middle', fill: '#FFE1DC' });
        T(g, 92, 52, 'O', { size: 30, weight: 800, anchor: 'middle', fill: '#FFE1DC' });
        // bucket hat
        const h = G(g); tr(h, -4, -70, 1, -6);
        E('path', { d: 'M-46,0 Q-44,-42 0,-44 Q44,-42 46,0 Z', fill: '#F2D27A', stroke: INK, 'stroke-width': 4.5, 'stroke-linejoin': 'round' }, h);
        E('path', { d: 'M-68,4 Q0,-12 68,4 Q72,14 60,16 Q0,4 -60,16 Q-72,14 -68,4 Z', fill: '#E6BF55', stroke: INK, 'stroke-width': 4.5, 'stroke-linejoin': 'round' }, h);
        E('path', { d: 'M-44,-8 Q0,-18 44,-8', fill: 'none', stroke: '#E8424F', 'stroke-width': 6 }, h);
        // tourist camera on a strap
        E('path', { d: 'M-40,40 Q-10,74 22,42', fill: 'none', stroke: INK, 'stroke-width': 4 }, g);
        const cam = G(g); tr(cam, -6, 80, 1, 4);
        E('rect', { x: -28, y: -18, width: 56, height: 36, rx: 7, fill: '#2B3440', stroke: INK, 'stroke-width': 3.5 }, cam);
        E('circle', { r: 11, fill: '#7FB6D9', stroke: '#F2F7FA', 'stroke-width': 4 }, cam);
        E('rect', { x: 12, y: -24, width: 12, height: 7, rx: 2, fill: '#2B3440' }, cam);
      },
      face: { x: 0, y: -6, eye: 20, gap: 64, mouthW: 50, mouthY: 38, lidCol: C.oxygen } }));
  }

  if (kind === 'colin') {
    return scMake(parent, Object.assign(base, { seed: 20, bob: 3, mood: o.mood || 'smug',
      draw: g => {
        // O = C = O: double bonds, then the oxygen atoms, then carbon in the middle
        E('path', { d: 'M-118,-8 L-60,-8 M-118,12 L-60,12 M60,-8 L118,-8 M60,12 L118,12', stroke: INK, 'stroke-width': 7 }, g);
        [-1, 1].forEach(sd => {
          const ox = G(g); tr(ox, sd * 122, 4);
          E('circle', { r: 50, fill: ball(C.oxygen, C.oxygenDk), stroke: INK, 'stroke-width': 5 }, ox);
          T(ox, 0, 11, 'O', { size: 32, weight: 800, anchor: 'middle', fill: '#FFE1DC' });
        });
        E('circle', { r: 76, fill: ball(C.carbon, C.carbonDk), stroke: INK, 'stroke-width': 6 }, g);
        // purple cravat
        E('path', { d: 'M-30,60 Q0,74 30,60 L18,92 L0,78 L-18,92 Z', fill: '#8E5BD9', stroke: INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
        E('circle', { cx: 0, cy: 70, r: 7, fill: '#FFD23F', stroke: INK, 'stroke-width': 2.5 }, g);
        // sunglasses pushed up on his head
        const sg = G(g); tr(sg, 4, -74, 1, -10);
        E('path', { d: 'M-50,-4 L50,-4', stroke: INK, 'stroke-width': 5 }, sg);
        E('path', { d: 'M-52,-8 L-10,-8 L-14,10 Q-32,20 -48,10 Z M10,-8 L52,-8 L48,10 Q32,20 14,10 Z', fill: '#1E2630', stroke: INK, 'stroke-width': 3.5, 'stroke-linejoin': 'round' }, sg);
        E('path', { d: 'M-42,-2 L-30,-2 M18,-2 L30,-2', stroke: '#8FA3B8', 'stroke-width': 3, 'stroke-linecap': 'round' }, sg);
      },
      face: { x: 0, y: -8, eye: 18, gap: 54, mouthW: 46, mouthY: 36, lidCol: C.carbon } }));
  }

  if (kind === 'nigel') {
    return scMake(parent, Object.assign(base, { seed: 22, bob: 2, mood: o.mood || 'neutral',
      draw: g => {
        E('circle', { cx: -46, r: 70, fill: 'none', stroke: INK, 'stroke-width': 12 }, g);
        E('circle', { cx: 46, r: 70, fill: 'none', stroke: INK, 'stroke-width': 12 }, g);
        E('circle', { cx: -46, r: 70, fill: ball(LH.nitro, LH.nitroDk) }, g);
        E('circle', { cx: 46, r: 70, fill: ball(LH.nitro, LH.nitroDk) }, g);
        E('path', { d: 'M0,-52 Q6,0 0,52', fill: 'none', stroke: LH.nitroDk, 'stroke-width': 4, opacity: 0.6 }, g);
        T(g, -84, 48, 'N', { size: 28, weight: 800, anchor: 'middle', fill: '#E3E8FF' });
        T(g, 84, 48, 'N', { size: 28, weight: 800, anchor: 'middle', fill: '#E3E8FF' });
        // headphones
        E('path', { d: 'M-104,-10 Q-104,-104 0,-104 Q104,-104 104,-10', fill: 'none', stroke: INK, 'stroke-width': 13, 'stroke-linecap': 'round' }, g);
        E('path', { d: 'M-104,-10 Q-104,-104 0,-104 Q104,-104 104,-10', fill: 'none', stroke: '#4A4F5C', 'stroke-width': 7, 'stroke-linecap': 'round' }, g);
        [-1, 1].forEach(sd => E('rect', { x: sd * 108 - 16, y: -34, width: 32, height: 52, rx: 13, fill: '#2B2F3A', stroke: INK, 'stroke-width': 4 }, g));
      },
      face: { x: 0, y: -6, eye: 17, gap: 50, mouthW: 30, mouthY: 34, lidCol: LH.nitro } }));
  }

  if (kind === 'smokey') {
    let wisps;
    const PUFFS = [[-78, 10, 58], [-30, -38, 62], [34, -40, 58], [80, 4, 56], [44, 46, 54], [-26, 50, 56], [0, 6, 66]];
    return scMake(parent, Object.assign(base, { seed: 24, bob: 6, mood: o.mood || 'smug',
      draw: g => {
        wisps = E('path', { d: '', fill: 'none', stroke: LH.smoke, 'stroke-width': 9, 'stroke-linecap': 'round', opacity: 0.8 }, g);
        PUFFS.forEach(([x, y, r]) => E('circle', { cx: x, cy: y, r, fill: 'none', stroke: INK, 'stroke-width': 12 }, g));
        PUFFS.forEach(([x, y, r]) => E('circle', { cx: x, cy: y, r, fill: '#968F83' }, g));
        E('ellipse', { cx: -40, cy: -50, rx: 34, ry: 18, fill: '#B9B2A6', opacity: 0.8 }, g);
        E('path', { d: 'M-120,40 Q-60,96 0,108 Q60,98 120,44', fill: 'none', stroke: '#6E675C', 'stroke-width': 10, opacity: 0.5, 'stroke-linecap': 'round' }, g);
        // tar stains
        E('ellipse', { cx: -84, cy: 36, rx: 14, ry: 9, fill: LH.tar, opacity: 0.7 }, g);
        E('ellipse', { cx: 70, cy: 50, rx: 10, ry: 7, fill: LH.tar, opacity: 0.7 }, g);
        E('circle', { cx: 96, cy: -4, r: 6, fill: LH.tar, opacity: 0.7 }, g);
        // flat cap
        const cap = G(g); tr(cap, 6, -84, 1, 8);
        E('path', { d: 'M-54,8 Q-50,-30 6,-30 Q56,-28 60,6 Z', fill: '#4A3F36', stroke: INK, 'stroke-width': 4.5, 'stroke-linejoin': 'round' }, cap);
        E('path', { d: 'M-30,6 Q30,-2 84,10 Q70,22 20,18 Q-12,16 -30,6 Z', fill: '#3A3029', stroke: INK, 'stroke-width': 4.5, 'stroke-linejoin': 'round' }, cap);
        // thin moustache (above the mouth at y = 26)
        E('path', { d: 'M-34,20 Q-16,8 0,17 Q16,8 34,20', fill: 'none', stroke: '#2A211B', 'stroke-width': 5.5, 'stroke-linecap': 'round' }, g);
      },
      face: { x: 0, y: -10, eye: 18, gap: 56, mouthW: 46, mouthY: 50, lidCol: '#9A9387', iris: '#5A4A10' },
      upd: (t, g, st) => {
        const k = st.still ? 0 : 1;
        let d = '';
        [[-110, -40], [112, -50]].forEach(([x0, y0], i) => {
          const pts = [];
          for (let j = 0; j <= 8; j++) pts.push([x0 + (i ? 1 : -1) * j * 3 + Math.sin(t * 2.2 * k + j * 1.3 + i) * 13, y0 - j * 11]);
          d += openPath(pts) + ' ';
        });
        attr(wisps, 'd', d);
      } }));
  }
  return scMake(parent, Object.assign(base, { draw: g => E('circle', { r: 80, fill: '#888' }, g), face: { eye: 16, gap: 50, mouthW: 40, mouthY: 30 } }));
}

/* ---------- sets ---------- */
function lhLiving(parent) {
  const g = G(parent);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#F6DDB6', '#EBC795', true) }, g);
  // window with HDB blocks and a hot sky
  const win_ = G(g); tr(win_, 90, 120);
  E('rect', { x: 0, y: 0, width: 420, height: 300, rx: 10, fill: linGrad('#6FC8FF', '#CFEFFF', true), stroke: '#FFFFFF', 'stroke-width': 14 }, win_);
  E('circle', { cx: 340, cy: 70, r: 70, fill: glow('#FFE45C') }, win_); E('circle', { cx: 340, cy: 70, r: 30, fill: '#FFE45C' }, win_);
  [[30, 120, 110, '#F2C9B0'], [160, 80, 120, '#BFD7EA'], [300, 140, 100, '#F5E3A8']].forEach(([x, y, w, col]) => {
    E('rect', { x, y, width: w, height: 300 - y, fill: col, stroke: '#9C927C', 'stroke-width': 3 }, win_);
    let d = '';
    for (let yy = y + 18; yy < 290; yy += 30) for (let xx = x + 12; xx < x + w - 14; xx += 26) d += `M${xx},${yy} h14 v14 h-14 Z `;
    E('path', { d, fill: '#7FA6C4', opacity: 0.8 }, win_);
  });
  E('path', { d: 'M210,0 L210,300 M0,150 L420,150', stroke: '#FFFFFF', 'stroke-width': 10 }, win_);
  // split aircon high on the wall, with cold-air lines
  const ac = G(g); tr(ac, 850, 150);
  E('rect', { x: -170, y: -46, width: 340, height: 92, rx: 18, fill: '#F7FAFC', stroke: '#9AA6B2', 'stroke-width': 5 }, ac);
  E('rect', { x: -150, y: 20, width: 300, height: 12, rx: 6, fill: '#C9D3DC' }, ac);
  E('circle', { cx: 140, cy: -22, r: 6, fill: '#56D69B' }, ac);
  const cold = E('path', { d: '', fill: 'none', stroke: '#9FD8FF', 'stroke-width': 5, 'stroke-linecap': 'round', opacity: 0.8 }, ac);
  // floor and skirting
  E('rect', { x: 0, y: 560, width: 1200, height: 190, fill: '#D9C7A8' }, g);
  let tiles = '';
  for (let x = -40; x < 1240; x += 120) tiles += `M${x},560 L${x - 60},750 `;
  E('path', { d: tiles + 'M0,630 L1200,630 M0,700 L1200,700', stroke: '#C2AE8C', 'stroke-width': 3 }, g);
  E('rect', { x: 0, y: 548, width: 1200, height: 14, fill: '#B49A70' }, g);
  // sofa
  const so = G(g); tr(so, 600, 520);
  E('rect', { x: -330, y: -170, width: 660, height: 150, rx: 40, fill: '#2FA59A', stroke: SC_INK, 'stroke-width': 6 }, so);       // back
  E('rect', { x: -360, y: -60, width: 720, height: 110, rx: 30, fill: '#37BBAE', stroke: SC_INK, 'stroke-width': 6 }, so);        // seat
  E('rect', { x: -400, y: -110, width: 90, height: 170, rx: 36, fill: '#2FA59A', stroke: SC_INK, 'stroke-width': 6 }, so);        // arms
  E('rect', { x: 310, y: -110, width: 90, height: 170, rx: 36, fill: '#2FA59A', stroke: SC_INK, 'stroke-width': 6 }, so);
  E('path', { d: 'M0,-58 L0,46', stroke: '#24857C', 'stroke-width': 4 }, so);
  E('rect', { x: -330, y: 48, width: 24, height: 30, fill: '#6B4A33' }, so); E('rect', { x: 306, y: 48, width: 24, height: 30, fill: '#6B4A33' }, so);
  E('rect', { x: 180, y: -150, width: 110, height: 90, rx: 26, fill: '#FF9BD2', stroke: SC_INK, 'stroke-width': 5, transform: 'rotate(10 235 -105)' }, so);  // cushion
  g.sofa = [600, 520];
  g.upd = t => {
    let d = '';
    for (let i = 0; i < 4; i++) { const ph = ((t * 0.5) + i / 4) % 1, x = -120 + i * 80; d += `M${x},${50 + ph * 70} q12,14 0,28 `; }
    attr(cold, 'd', d); op(cold, 0.8);
  };
  g.upd(0);
  return g;
}

function lhTerminal(parent) {
  const g = G(parent);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#4A1A2A', '#7A2B44', true) }, g);
  // the window onto the airways: a glowing pink sky full of branching tubes
  E('rect', { x: 120, y: 150, width: 960, height: 330, rx: 24, fill: linGrad('#FFB3C6', '#E86A8E', true) }, g);
  const tree = (x, y, len, ang, depth, out) => {
    if (depth === 0 || len < 10) return;
    const x2 = x + Math.cos(ang) * len, y2 = y + Math.sin(ang) * len;
    out.push([depth, `M${x.toFixed(1)},${y.toFixed(1)} L${x2.toFixed(1)},${y2.toFixed(1)} `]);
    tree(x2, y2, len * 0.72, ang - 0.45, depth - 1, out); tree(x2, y2, len * 0.72, ang + 0.42, depth - 1, out);
  };
  [[330, 480, 110], [870, 480, 120]].forEach(([x, y, len]) => {
    const segs = []; tree(x, y, len, -Math.PI / 2, 6, segs);
    for (let d = 6; d >= 1; d--) E('path', { d: segs.filter(s => s[0] === d).map(s => s[1]).join(''), stroke: '#C2486C', 'stroke-width': d * 3.2, 'stroke-linecap': 'round', fill: 'none', opacity: 0.75 }, g);
  });
  E('rect', { x: 120, y: 150, width: 960, height: 330, rx: 24, fill: 'none', stroke: '#3A1220', 'stroke-width': 14 }, g);
  E('path', { d: 'M360,150 L360,480 M600,150 L600,480 M840,150 L840,480', stroke: '#3A1220', 'stroke-width': 10 }, g);
  // ribbed arches (cartilage-pink) framing the hall
  let arches = '';
  for (let i = 0; i < 5; i++) { const x = 60 + i * 270; arches += `M${x - 90},520 Q${x - 90},96 ${x + 45},96 Q${x + 180},96 ${x + 180},520 `; }
  E('path', { d: arches, fill: 'none', stroke: '#F2B8C6', 'stroke-width': 22, opacity: 0.22 }, g);
  // banner (top right, clear of the chapter tag)
  const ban = G(g); tr(ban, 860, 104);
  E('rect', { x: -240, y: -30, width: 480, height: 60, rx: 12, fill: LH.sign, stroke: '#FFFFFF', 'stroke-width': 3 }, ban);
  T(ban, 0, 12, 'LUNG INTERNATIONAL', { size: 34, weight: 800, anchor: 'middle', fill: LH.signTx, ls: 2 });
  // floor
  E('rect', { x: 0, y: 500, width: 1200, height: 250, fill: linGrad('#C9B9C2', '#8E7A86', true) }, g);
  let fl = '';
  for (let x = -200; x < 1400; x += 150) fl += `M${x},500 L${600 + (x - 600) * 2.2},750 `;
  E('path', { d: fl + 'M0,560 L1200,560 M0,640 L1200,640', stroke: '#FFFFFF', 'stroke-width': 3, opacity: 0.25 }, g);
  E('ellipse', { cx: 600, cy: 560, rx: 420, ry: 30, fill: '#FFFFFF', opacity: 0.12 }, g);
  // indoor tree in a planter (right)
  const pl = G(g); tr(pl, 1110, 560);
  E('rect', { x: -44, y: -10, width: 88, height: 70, rx: 10, fill: '#6B4A33', stroke: SC_INK, 'stroke-width': 4 }, pl);
  E('path', { d: 'M0,-10 L0,-110', stroke: '#6B4A33', 'stroke-width': 10 }, pl);
  [[-30, -120, 40], [24, -140, 44], [0, -170, 40], [-40, -160, 30], [40, -100, 30]].forEach(([x, y, r]) => E('circle', { cx: x, cy: y, r, fill: ball('#5BD27A', '#22844A'), stroke: SC_INK, 'stroke-width': 3 }, pl));
  g.upd = t => {};
  return g;
}

function lhExchange(parent) {
  const g = G(parent);
  // alveolus air (left)
  E('rect', { x: 0, y: 0, width: 560, height: 750, fill: linGrad('#3A2A4E', '#5A3A6E', false) }, g);
  E('rect', { x: 0, y: 0, width: 560, height: 750, fill: glow('#FFB3C6'), opacity: 0.25 }, g);
  // the two walls: alveolus wall + capillary wall, one flat cell each (a moist film on the air side)
  E('rect', { x: 548, y: 0, width: 14, height: 750, fill: '#9FD8FF', opacity: 0.5 }, g);   // moist lining
  [[562, LH.sac, LH.sacDk], [602, '#F7B6C4', '#B8466A']].forEach(([x, f, s]) => {
    E('rect', { x, y: 0, width: 38, height: 750, fill: f, stroke: s, 'stroke-width': 3 }, g);
    let d = '';
    for (let y = 0; y < 750; y += 150) d += `M${x},${y} L${x + 38},${y} `;
    E('path', { d, stroke: s, 'stroke-width': 3 }, g);
    for (let y = 75; y < 750; y += 150) E('ellipse', { cx: x + 19, cy: y, rx: 8, ry: 22, fill: s, opacity: 0.6 }, g);   // flattened nuclei
  });
  // capillary (right): plasma flowing down
  E('rect', { x: 640, y: 0, width: 560, height: 750, fill: linGrad('#5A1420', '#8E1F2A', false) }, g);
  E('path', { d: 'M1180,0 L1180,750', stroke: '#C2454F', 'stroke-width': 30, opacity: 0.6 }, g);
  const r = rng(271), cells = [];
  for (let i = 0; i < 6; i++) cells.push({ el: E('ellipse', { rx: 46, ry: 20, fill: ball('#FF6B6B', '#B32635'), opacity: 0.45 }, g), x: 700 + r() * 440, y: r() * 800, v: 30 + r() * 20, a: r() * 60 - 30 });
  g.air = { x: 30, y: 120, w: 500, h: 480 }; g.blood = { x: 670, y: 120, w: 480, h: 480 };
  g.upd = t => cells.forEach(c => tr(c.el, c.x, ((c.y + t * c.v) % 850) - 50, 1, c.a + 10 * Math.sin(t + c.x)));
  g.upd(0);
  return g;
}

/* ---------- props ---------- */
function lhSign(parent, text, o) {
  o = o || {};
  const size = o.size || 32, h = Math.round(size * 1.9), icon = o.arrow || o.icon;
  const tw = textWidth(text, size, FD, 800) + String(text).length, iw = icon ? h * 0.9 : 0;
  const w = Math.ceil(tw + size * 1.2 + (icon ? iw + size * 0.25 : 0));
  const g = G(parent);
  E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: 10, fill: LH.sign, stroke: '#3A4B5C', 'stroke-width': 3 }, g);
  if (icon) {
    const ic = G(g); tr(ic, -w / 2 + size * 0.45 + iw / 2, 0);
    E('rect', { x: -iw / 2 + 4, y: -iw / 2 + 4, width: iw - 8, height: iw - 8, rx: 8, fill: LH.signTx }, ic);
    if (o.icon === 'plane') lhPlane(ic, iw * 0.012, LH.sign);
    else {
      const rot = { right: 0, down: 90, left: 180, up: -90 }[o.arrow] || 0;
      const a = G(ic); tr(a, 0, 0, iw / 80, rot);
      E('path', { d: 'M-24,-7 L6,-7 L6,-20 L26,0 L6,20 L6,7 L-24,7 Z', fill: LH.sign }, a);
    }
  }
  T(g, icon ? -w / 2 + size * 0.7 + iw + tw / 2 : 0, size * 0.36, text, { size, weight: 800, anchor: 'middle', fill: LH.signTx, ls: 1 });
  g.w = w; g.h = h;
  return g;
}

function lhBoard(parent, title, rows, o) {
  o = o || {};
  const w = o.w || 760, rh = o.rowH || 66, h = 96 + rows.length * rh + 20;
  const g = G(parent);
  E('rect', { x: -w / 2, y: 0, width: w, height: h, rx: 16, fill: '#11161C', stroke: '#3A4B5C', 'stroke-width': 5 }, g);
  E('rect', { x: -w / 2, y: 0, width: w, height: 80, rx: 16, fill: LH.signTx }, g);
  E('rect', { x: -w / 2, y: 60, width: w, height: 20, fill: LH.signTx }, g);
  const tg = G(g); tr(tg, -w / 2 + 34, 40);
  lhPlane(tg, 0.6, '#11161C');
  T(g, -w / 2 + 80, 54, title, { size: 40, weight: 800, fill: '#11161C', ls: 3 });
  g.rows = rows.map(([l, r, col], i) => {
    const row = G(g), y = 96 + i * rh;
    E('rect', { x: -w / 2 + 16, y: y, width: w - 32, height: rh - 10, rx: 6, fill: '#1C242E' }, row);
    E('path', { d: `M${-w / 2 + 16},${y + (rh - 10) / 2} L${w / 2 - 16},${y + (rh - 10) / 2}`, stroke: '#0B0F14', 'stroke-width': 2 }, row);
    lhRich(row, -w / 2 + 36, y + rh / 2 + 6, l, { size: 32, weight: 700, fill: '#F2F7FA' });
    lhRich(row, w / 2 - 36, y + rh / 2 + 6, r, { size: 32, weight: 800, fill: col || LH.signTx, anchor: 'end' });
    return row;
  });
  g.set = p => g.rows.forEach((row, i) => {
    const q = clamp(p * rows.length - i);
    op(row, q > 0 ? 1 : 0);
    const flip = q > 0 && q < 1 ? Math.abs(Math.cos(q * Math.PI * 3)) : 1;
    row.setAttribute('transform', `translate(0 ${(96 + i * rh + (rh - 10) / 2).toFixed(1)}) scale(1 ${Math.max(0.05, flip).toFixed(3)}) translate(0 ${(-(96 + i * rh + (rh - 10) / 2)).toFixed(1)})`);
  });
  g.set(1);
  g.h = h; g.w = w;
  return g;
}

function lhRouteMap(parent) {
  const g = G(parent);
  const NAMES = ['NOSE', 'TRACHEA', 'BRONCHI', 'BRONCHIOLES', 'ALVEOLI'];
  E('path', { d: 'M0,0 L1000,0', stroke: '#2A1A22', 'stroke-width': 30, 'stroke-linecap': 'round' }, g);
  E('path', { d: 'M0,0 L1000,0', stroke: '#E86A8E', 'stroke-width': 20, 'stroke-linecap': 'round' }, g);
  const lit = E('path', { d: 'M0,0 L0,0', stroke: '#FFD23F', 'stroke-width': 20, 'stroke-linecap': 'round' }, g);
  g.stations = NAMES.map((name, i) => {
    const x = i * 250, st = G(g); tr(st, x, 0);
    const dot = E('circle', { r: 24, fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 7 }, st);
    const lbl = T(st, 0, 66, name, { size: 28, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
    return { x, name, dot, lbl };
  });
  const marker = G(g);
  E('path', { d: 'M0,-34 L-16,-60 L16,-60 Z', fill: '#FFD23F', stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, marker);
  E('circle', { cy: -74, r: 20, fill: '#FFD23F', stroke: SC_INK, 'stroke-width': 4 }, marker);
  T(marker, 0, -66, '★', { size: 22, weight: 800, anchor: 'middle', fill: SC_INK });
  g.marker = marker;
  g.set = p => {
    const x = clamp(p) * 1000;
    attr(lit, 'd', `M0,0 L${x.toFixed(1)},0`);
    tr(marker, x, 0);
    g.stations.forEach(s => { const on = x >= s.x - 1; attr(s.dot, 'fill', on ? '#FFD23F' : '#FFFFFF'); attr(s.lbl, 'fill', on ? '#FFD23F' : '#FFFFFF'); });
  };
  g.set(0);
  return g;
}

function lhChest(parent) {
  const g = G(parent);
  // ribs and intercostal muscles: back layer, so the lungs sit "inside" the cage
  const cage = G(g);
  const ribs = [], inters = [];
  for (let side = -1; side <= 1; side += 2) {
    for (let i = 0; i < 5; i++) {
      const y = -150 + i * 62;
      const rib = G(cage);
      E('path', { d: `M${side * 24},${y} Q${side * 230},${y - 40} ${side * 250},${y + 60}`, fill: 'none', stroke: SC_INK, 'stroke-width': 22, 'stroke-linecap': 'round' }, rib);
      E('path', { d: `M${side * 24},${y} Q${side * 230},${y - 40} ${side * 250},${y + 60}`, fill: 'none', stroke: LH.bone, 'stroke-width': 13, 'stroke-linecap': 'round' }, rib);
      ribs.push({ el: rib, side, i });
      if (i < 4) {
        const m = E('path', { d: `M${side * 40},${y + 14} Q${side * 220},${y - 18} ${side * 236},${y + 66} L${side * 238},${y + 116} Q${side * 220},${y + 44} ${side * 40},${y + 72} Z`, fill: LH.muscle, opacity: 0.55, stroke: LH.muscleDk, 'stroke-width': 2 }, cage);
        inters.push({ el: m, side, i });
      }
    }
  }
  // the diaphragm (behind the lungs, whose bases rest on its two domes)
  const dia = E('path', { d: '', fill: ball(LH.muscle, LH.muscleDk), stroke: SC_INK, 'stroke-width': 6, 'stroke-linejoin': 'round' }, g);
  // lungs (kit art, with trachea and bronchi); they stretch down as the diaphragm flattens
  const lgo = G(g), lg = G(lgo); tr(lg, 0, -10);
  const lu = lungs(lg, 1.3);
  // the air arrow at the mouth end of the trachea
  const air = G(g); tr(air, 0, -300);
  const airIn = arrow(air, 0, -60, 0, 10, { color: C.air, width: 10, head: 30 });
  const airOut = arrow(air, 0, 10, 0, -60, { color: C.air, width: 10, head: 30 });
  g.pts = { trachea: [0, -230], bronchus: [-40, -100], lung: [-130, 20], rib: [220, -110], inter: [215, -80], diaphragm: [190, 196] };
  g.set = (b, flow) => {
    b = clamp(b || 0); flow = flow || 0;
    lu.set(b);
    // two domes (one under each lung): tops at y 172 relaxed, 238 contracted (flat)
    const top = lerp(172, 238, b), mid = top + 22 * (1 - b), c = (8 * top - 252 - mid) / 6;
    attr(dia, 'd', `M-280,290 L-280,252 C-270,${c.toFixed(1)} -40,${c.toFixed(1)} 0,${mid.toFixed(1)} C40,${c.toFixed(1)} 270,${c.toFixed(1)} 280,252 L280,290 Z`);
    lgo.setAttribute('transform', `translate(0 -80) scale(1 ${(1 + 0.14 * b).toFixed(3)}) translate(0 80)`);
    ribs.forEach(r => r.el.setAttribute('transform', `translate(${(r.side * 14 * b).toFixed(1)} ${(-16 * b).toFixed(1)}) rotate(${(-r.side * 3 * b).toFixed(2)} ${r.side * 24} ${-150 + r.i * 62})`));
    inters.forEach(m => m.el.setAttribute('transform', `translate(${(m.side * 14 * b).toFixed(1)} ${(-16 * b).toFixed(1)})`));
    g.pts.diaphragm = [190, top + 24];
    op(airIn, clamp(flow * 3)); op(airOut, clamp(-flow * 3));
  };
  g.set(0, 0);
  return g;
}

function lhLining(parent, w) {
  w = w || 900;
  const g = G(parent), n = Math.floor(w / 64);
  E('rect', { x: 0, y: 110, width: w, height: 90, fill: '#F7B6C4', stroke: SC_INK, 'stroke-width': 4 }, g);
  const gob = [];
  let walls = '';
  for (let i = 0; i <= n; i++) walls += `M${i * 64},110 L${i * 64},200 `;
  E('path', { d: walls, stroke: '#C9637F', 'stroke-width': 3 }, g);
  for (let i = 0; i < n; i++) {
    const cx = i * 64 + 32;
    if (i % 4 === 2) {   // goblet cell: a cup of mucus
      E('path', { d: `M${cx - 22},112 Q${cx - 28},170 ${cx},180 Q${cx + 28},170 ${cx + 22},112 Z`, fill: '#E8F2A0', stroke: '#9AA83A', 'stroke-width': 3 }, g);
      gob.push(cx);
    } else E('ellipse', { cx, cy: 165, rx: 10, ry: 16, fill: '#B07AC9', opacity: 0.7 }, g);   // nucleus
  }
  const cilia = E('path', { d: '', fill: 'none', stroke: '#C9637F', 'stroke-width': 4, 'stroke-linecap': 'round' }, g);
  const tarCoat = E('rect', { x: 0, y: 58, width: w, height: 56, fill: LH.tar, opacity: 0 }, g);
  const mucus = E('rect', { x: 0, y: 30, width: w, height: 44, rx: 18, fill: '#E8F2A0', opacity: 0.55, stroke: '#9AA83A', 'stroke-width': 2 }, g);
  const r = rng(55), dust = [];
  for (let i = 0; i < Math.floor(w / 70); i++) dust.push({ el: E('circle', { r: 5 + r() * 6, fill: '#6B5A4A', stroke: '#3A2E24', 'stroke-width': 2 }, g), x: r() * w, y: 40 + r() * 24 });
  const arrowG = G(g); tr(arrowG, w - 10, 6);
  T(arrowG, -48, 8, 'to the throat', { size: 26, weight: 700, anchor: 'end', fill: '#FFFFFF' });
  arrow(arrowG, -36, 0, 0, 0, { color: '#FFFFFF', width: 5, head: 16 });
  g.gob = gob;
  g.upd = (t, rate, tar) => {
    rate = rate === undefined ? 1 : rate; tar = tar || 0;
    let d = '';
    for (let i = 0; i < n; i++) {
      if (i % 4 === 2) continue;
      const cx = i * 64 + 32;
      for (let k = 0; k < 5; k++) {
        const x = cx - 22 + k * 11, ph = t * 7 - x * 0.05;
        const sw = rate * 14 * Math.sin(ph), droop = tar * 26;
        d += `M${x},110 Q${(x + sw * 0.5 + droop * 0.4).toFixed(1)},${(92 + droop * 0.3).toFixed(1)} ${(x + sw + droop).toFixed(1)},${(74 + droop).toFixed(1)} `;
      }
    }
    attr(cilia, 'd', d);
    op(tarCoat, tar * 0.8);
    dust.forEach(p => { const x = (p.x + t * 60 * rate) % w; attr(p.el, 'cx', x); attr(p.el, 'cy', p.y + Math.sin(t * 2 + p.x) * 2); });
  };
  g.upd(0, 1, 0);
  return g;
}

function lhCluster(parent, o) {
  o = o || {};
  const g = G(parent), inner = G(g);
  const emph = !!o.emph;
  // the bronchiole coming in from the top
  E('path', { d: 'M0,-170 L0,-60', stroke: SC_INK, 'stroke-width': 36, 'stroke-linecap': 'round' }, inner);
  E('path', { d: 'M0,-170 L0,-60', stroke: LH.lung, 'stroke-width': 26, 'stroke-linecap': 'round' }, inner);
  const sacs = emph ? [[-50, 20, 92], [70, 50, 70], [10, 120, 48]] : [[0, -30, 44], [-70, -4, 44], [70, -4, 44], [-36, 60, 46], [40, 62, 46], [-96, 70, 38], [100, 72, 38], [0, 120, 40], [-62, 124, 34], [64, 128, 34]];
  sacs.forEach(([x, y, r]) => E('circle', { cx: x, cy: y, r, fill: 'none', stroke: SC_INK, 'stroke-width': 9 }, inner));
  sacs.forEach(([x, y, r]) => E('circle', { cx: x, cy: y, r, fill: ball(LH.sac, '#F39AB2') }, inner));
  if (emph) E('path', { d: 'M-14,-20 L-4,0 M30,10 L22,30 M-20,90 L-8,104', stroke: SC_INK, 'stroke-width': 5, 'stroke-linecap': 'round', opacity: 0.7 }, inner);   // broken wall stubs
  // capillary net
  let cap = '';
  sacs.forEach(([x, y, r], i) => { if (emph && i > 0) return; cap += `M${x - r * 0.9},${y + r * 0.3} Q${x},${y + r * 1.1} ${x + r * 0.9},${y + r * 0.3} M${x - r * 0.4},${y - r * 0.9} Q${x - r * 0.2},${y} ${x - r * 0.6},${y + r * 0.7} `; });
  E('path', { d: cap, fill: 'none', stroke: LH.artery, 'stroke-width': 5, 'stroke-linecap': 'round', opacity: 0.85 }, inner);
  g.upd = t => tr(inner, 0, 0, 1 + 0.03 * Math.sin(t * 1.6));
  return g;
}

function lhRBC(parent, s) {
  const g = G(parent); tr(g, 0, 0, s || 1);
  E('ellipse', { rx: 86, ry: 38, fill: ball('#FF6B6B', '#B32635'), stroke: SC_INK, 'stroke-width': 5 }, g);
  E('ellipse', { rx: 48, ry: 16, fill: '#C2364A', opacity: 0.7 }, g);     // the dimple
  // roof sign
  E('rect', { x: -30, y: -62, width: 60, height: 26, rx: 6, fill: '#FFD23F', stroke: SC_INK, 'stroke-width': 3.5 }, g);
  T(g, 0, -42, 'TAXI', { size: 17, weight: 800, anchor: 'middle', fill: SC_INK });
  // haemoglobin seats: four cups along the top
  g.seats = [[-64, -20], [-30, -34], [30, -34], [64, -20]];
  g.seats.forEach(([x, y]) => E('path', { d: `M${x - 13},${y - 4} Q${x},${y + 14} ${x + 13},${y - 4}`, fill: '#8E1F2A', stroke: SC_INK, 'stroke-width': 3 }, g));
  return g;
}

function lhMol(parent, kind, r) {
  r = r || 15;
  if (kind === 'O2') return molO2(parent, r);
  if (kind === 'CO2') return molCO2(parent, r);
  if (kind === 'H2O') return molH2O(parent, r);
  const g = G(parent);
  if (kind === 'N2') [-1, 1].forEach(sd => { const a = G(g); tr(a, sd * r * 0.72, 0); E('circle', { r, fill: ball(LH.nitro, LH.nitroDk), stroke: LH.nitroDk, 'stroke-width': Math.max(1.5, r * 0.08) }, a); });
  if (kind === 'CO') { tr(atom(g, 'C', r), -r * 0.75, 0); tr(atom(g, 'O', r * 0.9), r * 0.8, 0); }
  return g;
}

function lhBrain(parent, s) {
  const g = G(parent); tr(g, 0, 0, s || 1);
  const pts = blobPts(120, 86, 14, 0, 0.07, 9);
  E('path', { d: closedPath(pts), fill: ball('#F7A8C8', '#C25A88'), stroke: SC_INK, 'stroke-width': 6 }, g);
  E('path', { d: 'M0,-80 Q-14,-30 0,0 Q14,40 0,80 M-90,-20 Q-60,-50 -30,-24 Q-10,-6 -40,20 Q-70,40 -90,30 M90,-20 Q60,-50 30,-24 Q10,-6 40,20 Q70,40 90,30 M-60,-60 Q-40,-40 -60,-30 M60,-60 Q40,-40 60,-30', fill: 'none', stroke: '#C25A88', 'stroke-width': 5, 'stroke-linecap': 'round' }, g);
  // the CO2 gauge in front
  const ga = G(g); tr(ga, 0, 120);
  E('path', { d: 'M-90,0 A90,90 0 0 1 90,0 Z', fill: '#11161C', stroke: SC_INK, 'stroke-width': 5 }, ga);
  E('path', { d: 'M-72,0 A72,72 0 0 1 22,-68', fill: 'none', stroke: C.good, 'stroke-width': 12 }, ga);
  E('path', { d: 'M22,-68 A72,72 0 0 1 72,0', fill: 'none', stroke: C.bad, 'stroke-width': 12 }, ga);
  lhRich(ga, 0, -18, 'CO_2', { size: 26, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  const needle = E('path', { d: 'M0,0 L0,-66', stroke: '#FFD23F', 'stroke-width': 6, 'stroke-linecap': 'round' }, ga);
  E('circle', { r: 9, fill: '#FFD23F', stroke: SC_INK, 'stroke-width': 3 }, ga);
  g.set = v => attr(needle, 'transform', `rotate(${(-90 + 180 * clamp(v)).toFixed(1)})`);
  g.set(0.2);
  return g;
}

function lhVHS(parent) {
  const g = G(parent);
  let d = '';
  for (let y = 2; y < 750; y += 6) d += `M0,${y} L1200,${y} `;
  E('path', { d, stroke: '#000000', 'stroke-width': 2, opacity: 0.18 }, g);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#3A2A10', opacity: 0.12 }, g);
  const band = E('rect', { x: 0, y: 0, width: 1200, height: 26, fill: '#FFFFFF', opacity: 0.09 }, g);
  const play = G(g); tr(play, 1130, 70);
  T(play, 0, 0, 'PLAY ▶', { size: 34, weight: 800, anchor: 'end', fill: '#FFFFFF' });
  const stamp = T(g, 1150, 690, 'SECURITY TRAINING · TAPE 3', { size: 26, weight: 700, anchor: 'end', fill: '#FFFFFF', opacity: 0.85 });
  g.set = (p, t) => { op(g, p); t = t || 0; attr(band, 'y', (t * 140) % 800 - 30); op(play, Math.sin(t * TAU * 0.7) > -0.3 ? 1 : 0.2); };
  return g;
}

function lhSnack(parent, s) {
  const g = G(parent); tr(g, 0, 0, s || 1);
  E('ellipse', { cx: 0, cy: 18, rx: 74, ry: 18, fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 4 }, g);
  E('path', { d: 'M-52,14 Q-50,-40 0,-44 Q50,-40 52,14 Z', fill: ball('#F2B04A', '#B5701A'), stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
  let crimp = 'M-46,-8 ';
  for (let i = 0; i < 9; i++) { const a = Math.PI + (i + 0.5) / 9 * Math.PI; crimp += `L${(Math.cos(a) * 46).toFixed(1)},${(Math.sin(a) * 40 - 4).toFixed(1)} `; }
  E('path', { d: crimp, fill: 'none', stroke: '#B5701A', 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
  return g;
}

function lhPlane(parent, s, col) {
  const g = G(parent); tr(g, 0, 0, s || 1);
  E('path', { d: 'M-40,0 Q-40,-8 -30,-8 L30,-8 Q46,-8 50,0 Q46,8 30,8 L-30,8 Q-40,8 -40,0 Z M-6,-6 L-22,-40 L-10,-40 L18,-6 Z M-6,6 L-22,40 L-10,40 L18,6 Z M-36,-6 L-46,-24 L-38,-24 L-24,-6 Z M-36,6 L-46,24 L-38,24 L-24,6 Z', fill: col || '#FFFFFF' }, g);
  return g;
}
