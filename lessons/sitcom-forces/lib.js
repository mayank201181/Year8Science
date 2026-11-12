/* PUSH & PULL (Claude Sitcom Ep 13, Forces & Motion): cast, sets and props.
   Bundled after engine lib.js, kit.js and sitcom.js (scTalk, scMake, scKavya, scConfessional, scLowerThird ...).
   Every global here starts with `pp` (except `cast`).

   CAST: cast(parent, kind, o) -> g, origin near the character's centre, about 200 px tall at s = 1
     o: { s (scale), mood (default mood) }
     g.set({ t, talk, mood, look, sweat, still, ...extras })   call every frame
       talk 0..1 (use scTalk(S, t, who)); mood: neutral | happy | smug | annoyed | sad | shock | deadpan
       look -1..1 pupils left/right; sweat 0..1 (rex, tess, pushpa, kavya); still: true stops the idle bob
     kinds (who key = kind):
       'rex'    Rex, the RESULTANT FORCE, foreman. A fat green arrow pointing RIGHT with a round face end and
                a yellow hard hat. Extra: len (default 1) = arrow length. len 0 = just a round dot (resultant zero,
                "I'm on my break"); 0.5 short arrow; 1 normal; up to 2 a long arrow. The face stays at (0,0).
                To point him left, mirror with tr(g, x, y, '-1 1') (the hat has no text, so mirroring is safe).
       'pushpa' Pushpa, an APPLIED FORCE (a push), eager intern. Coral ball, black top-knot, yellow sweatband,
                "NEW" lanyard badge. Extra: arms 'up' (default, cheering) | 'push' (both palms flat out to the
                RIGHT at x about +130: put the thing she pushes there) | 'down'.
       'frieda' Frieda, FRICTION, safety-officer killjoy. A sandpaper block with a jagged (rough) bottom edge,
                grit speckles, rectangular glasses, brown bun with a pencil through it, a whistle on a cord. Default mood annoyed.
       'graham' Graham, GRAVITY / WEIGHT, warm clingy uncle who "works remotely". A kettlebell (iron ball with a
                handle), "10 N/kg" engraved on his belly, pink cheeks, stubby arms. Extra: hug 0..1 raises his arms.
       'norm'   Norm, the NORMAL FORCE, the floor, mopey and unthanked. A block of parquet with two arms holding
                flat palms UP at y about -105 (whatever he supports sits on his palms). Default mood sad.
       'tess'   Tess, TENSION, a very tense spring. Round teal head with frazzled hair on a metal coil with a hook
                at the bottom. Extras: stretch (0 = relaxed coil about 80 long; 1 = twice as long; the hook moves
                down by 80 * stretch, the head stays put), wonky: true = permanently deformed (uneven, lop-sided,
                half as long again). g.hookY(stretch, wonky) returns the hook's y in her own coordinates (times s).
       'piv'    Piv, THE PIVOT, silent. A small grey triangle (fulcrum) with a hinge pin near the apex. Never bobs.
                His apex (the turning point) is at (0, -92) * s.
       'kavya'  Kavya, 12 (scKavya, head and shoulders). Full body: scKavyaBody(parent) + kit runPose/walkPose.

   COLOURS: ppCol.push (coral), .friction (orange), .weight (periwinkle), .normal (cream), .tension (teal),
     .resultant (green), .drag (sky blue). Use them for each force's arrow, chip and lower-third accent.

   SETS (full stage 1200 x 750, draw first):
     ppFlat(parent)        the OLD HDB flat, mid-move: mint walls, tiled floor (y > 520), window with HDB blocks,
                           ceiling fan, pale squares where photos hung, door frame with Kavya's height marks.
                           g.upd(t) turns the fan; g.night(v 0..1) darkens it to pre-dawn (briefing, ch 1).
     ppCorridor(parent)    HDB common corridor: parapet and railing, sky and blocks beyond, potted plants, a shoe rack,
                           the lift lobby on the right (doors, "LIFT", floor "9"). Floor y > 470.
                           g.upd(t, speed) scrolls the pillars and floor joints left by speed px/s (camera tracking).
     ppRoad(parent)        the expressway: sky, HDB skyline, trees, road (y > 450) with lane dashes and a barrier.
                           g.upd(t, speed) scrolls with parallax (dashes at speed, trees 0.5x, skyline 0.08x).
     ppNewFlat(parent)     the NEW BTO flat: empty, white walls, big sunny window, aircon unit, light wood floor (y > 520).
     ppConf(parent, who)   scConfessional tinted for that character (ppTint); g.set(p, t) as scConfessional.

   PROPS (each centred on its origin unless said):
     ppBox(parent, label, o)    cardboard box about 170 x 130, tape, marker label (o.size, default 30; o.w, o.h).
     ppSofa(parent, o)          teal three-seater about 380 x 170, origin at the floor line under its middle;
                                g.legs = [[x, y], ...] the four tiny legs' feet (local coords), o.pads: felt pads shown;
                                g.pads(v 0..1) fades wide felt pads in under the legs.
     ppTrolley(parent, o)       flat platform trolley about 300 wide, origin at the floor under its middle;
                                g.upd(t, speed px/s) spins the wheels. g.top = y of the deck (put loads there).
     ppLorry(parent, o)         removal lorry side view about 460 x 250, facing RIGHT, origin at road level under its
                                middle; "PUSH & PULL REMOVALS" on the box; g.upd(t, speed) spins the wheels.
     ppNewtonmeter(parent, o)   vertical spring balance about 380 tall, hung from its ring at (0,0), scale 0..o.max N
                                (default 250, labels every o.step = 50, evenly spaced: Hooke's law), the spring visible
                                in a window, a hook below. g.set(F newtons) moves the pointer and stretches the spring;
                                g.hookY gives the hook's y now (hang the box there).
     ppForce(parent, o)         a force arrow with its label: o.color, o.label ('100 N'), o.dir 'right'|'left'|'up'|'down',
                                o.width (shaft, default 22), o.size (label, 30), o.side (label on 'auto'|'above'|'below'|'left'|'right').
                                g.set(len px, label?) redraws from the origin (the tail) to len; len 0 hides it.
     ppDTGraph(parent, w, h, o) distance-time axes, origin bottom-left at (0,0), w right / h up; o.tMax, o.dMax,
                                o.tLabel ('time (min)'), o.dLabel ('distance (km)'), o.ticksT, o.ticksD (arrays of numbers).
                                g.set(pts, tNow) draws the polyline of [[t, d], ...] up to time tNow (data units) and
                                puts the dot there (returns its [x, y]); g.xy(t, d) -> local [x, y] of a data point, for
                                highlights and gradient triangles drawn by the scene. The panel behind it spans
                                x -110..w+50, y -h-50..100.
     ppPlank(parent, len)       a seesaw plank, origin at its centre (put it on Piv's apex); g.set(angle deg, + = right end
                                down); g.on is a group that tilts with the plank (put riders on it, y about -14).
     ppDoor(parent, o)          a front door seen from inside, 230 x 430, origin at the HINGE side's bottom corner,
                                door extends to the right; g.set(open 0..1) swings it (narrows towards the hinge);
                                g.handleX = 200 (the handle, far from the hinge); hinges drawn at x 0.
     ppWhiteboard(parent, w, h) site-office whiteboard on legs, centred; g.board is a group with (0,0) at its centre.
     ppLogo(parent)             show logo: "PUSH" (arrow pushing right) "&" "PULL" (arrow pulling left), about 820 wide,
                                centred; g.set(p 0..1) pops it in.
     ppPad(parent, w)           a felt pad (an ellipse w wide) for the sofa-leg pressure gag.
*/

const ppCol = {
  push: '#FF7A59', pushDk: '#C2452A',
  friction: '#FFA94D', frictionDk: '#B8641A',
  weight: '#8C90E8', weightDk: '#3A3D6B',
  normal: '#F1DEC0', normalDk: '#7A4E2B',
  tension: '#5FD0C3', tensionDk: '#2A8F86',
  resultant: '#4ADE80', resultantDk: '#1E7A4A',
  drag: '#8FD3FF',
  hat: '#FFD23F', hatDk: '#B58A00',
};
const ppTint = {
  rex: ['#10291C', '#1F4D33'], pushpa: ['#3A1712', '#6B2A1E'], frieda: ['#33240F', '#5E4320'],
  graham: ['#171833', '#2D2F5E'], norm: ['#2E1F12', '#553A22'], tess: ['#0E2E2B', '#1B544E'],
  piv: ['#1E232A', '#3A434F'], kavya: ['#14243A', '#25446B'],
};
function ppConf(parent, who) { const [a, b] = ppTint[who] || ppTint.rex; return scConfessional(parent, a, b); }

/* ================= the cast ================= */
function cast(parent, kind, o) {
  o = o || {};
  if (kind === 'kavya') return scKavya(parent, o);
  const K = SC_INK;
  if (kind === 'rex') {
    let arrowP, pill, headF, headO;
    return scMake(parent, { s: o.s, mood: o.mood, seed: 5, bob: 3,
      draw: g => {
        pill = E('rect', { x: -58, y: -58, width: 116, height: 116, rx: 58, fill: ball(ppCol.resultant, ppCol.resultantDk), stroke: K, 'stroke-width': 6 }, g);
        headF = E('path', { d: '', fill: ball(ppCol.resultant, ppCol.resultantDk) }, g);
        headO = E('path', { d: '', fill: 'none', stroke: K, 'stroke-width': 6, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, g);
        arrowP = E('path', { d: '', fill: 'none', stroke: '#B8F5CF', 'stroke-width': 5, 'stroke-linecap': 'round', opacity: 0.6 }, g);  // shine
        // hard hat
        E('path', { d: 'M-48,-52 Q-50,-112 0,-112 Q50,-112 48,-52 Z', fill: ball(ppCol.hat, ppCol.hatDk), stroke: K, 'stroke-width': 5, 'stroke-linejoin': 'round' }, g);
        E('path', { d: 'M-8,-110 L-8,-58 M8,-110 L8,-58', stroke: ppCol.hatDk, 'stroke-width': 4 }, g);
        E('rect', { x: -68, y: -60, width: 136, height: 14, rx: 7, fill: ppCol.hat, stroke: K, 'stroke-width': 4 }, g);
      },
      face: { x: 0, y: 2, eye: 17, gap: 50, mouthW: 40, mouthY: 30, lidCol: ppCol.resultant },
      sweat: [[-70, -20], [64, -30]],
      upd: (t, g, st) => {
        const len = st.len === undefined ? 1 : Math.max(0, st.len);
        const hp = clamp(len * 4), xb = 40 + 70 * len, hl = 92 * hp, hh = 100 * hp, hs = 58;
        attr(pill, 'width', 116 + Math.max(0, xb - 40) + (hp > 0.05 ? 30 : 0));
        if (hp < 0.02) { attr(headF, 'd', ''); attr(headO, 'd', ''); attr(arrowP, 'd', ''); return; }
        attr(headF, 'd', `M${xb},${-hh} L${xb + hl},0 L${xb},${hh} Z`);
        attr(headO, 'd', `M${xb},${-hs} L${xb},${-hh} L${xb + hl},0 L${xb},${hh} L${xb},${hs}`);
        attr(arrowP, 'd', len > 0.15 ? `M48,-40 L${(xb - 6).toFixed(1)},-40` : '');
      } });
  }
  if (kind === 'pushpa') {
    let armL, armR, handL, handR;
    return scMake(parent, { s: o.s, mood: o.mood || 'happy', seed: 9, bob: 7,
      draw: g => {
        armL = E('path', { d: '', fill: 'none', stroke: K, 'stroke-width': 20, 'stroke-linecap': 'round' }, g);
        armR = E('path', { d: '', fill: 'none', stroke: K, 'stroke-width': 20, 'stroke-linecap': 'round' }, g);
        g.armLi = E('path', { d: '', fill: 'none', stroke: ppCol.push, 'stroke-width': 11, 'stroke-linecap': 'round' }, g);
        g.armRi = E('path', { d: '', fill: 'none', stroke: ppCol.push, 'stroke-width': 11, 'stroke-linecap': 'round' }, g);
        handL = E('ellipse', { rx: 20, ry: 20, fill: '#FFC2AE', stroke: K, 'stroke-width': 4 }, g);
        handR = E('ellipse', { rx: 20, ry: 20, fill: '#FFC2AE', stroke: K, 'stroke-width': 4 }, g);
        E('circle', { cx: 0, cy: -96, r: 26, fill: '#2B1D14', stroke: K, 'stroke-width': 4 }, g);          // top-knot
        E('circle', { cx: 0, cy: 6, r: 82, fill: ball(ppCol.push, ppCol.pushDk), stroke: K, 'stroke-width': 6 }, g);
        E('path', { d: 'M-70,-38 Q0,-96 70,-38 Q0,-80 -70,-38 Z', fill: '#2B1D14' }, g);                       // fringe line
        E('path', { d: 'M-74,-30 Q0,-84 74,-30 L70,-16 Q0,-68 -70,-16 Z', fill: ppCol.hat, stroke: K, 'stroke-width': 3.5, 'stroke-linejoin': 'round' }, g);  // sweatband
        E('ellipse', { cx: 0, cy: -74, rx: 16, ry: 7, fill: '#FF5FA2', stroke: K, 'stroke-width': 3 }, g);   // scrunchie
        E('path', { d: 'M-34,44 L0,66 L34,44', fill: 'none', stroke: '#3F5BD9', 'stroke-width': 4 }, g);   // lanyard
        E('rect', { x: -22, y: 62, width: 44, height: 24, rx: 4, fill: '#FFFFFF', stroke: K, 'stroke-width': 3 }, g);
        T(g, 0, 80, 'NEW', { size: 17, weight: 800, anchor: 'middle', fill: '#E8424F' });
        E('ellipse', { cx: -52, cy: 28, rx: 13, ry: 8, fill: '#FF4F6E', opacity: 0.45 }, g);
        E('ellipse', { cx: 52, cy: 28, rx: 13, ry: 8, fill: '#FF4F6E', opacity: 0.45 }, g);
      },
      face: { x: 0, y: 2, eye: 18, gap: 52, mouthW: 42, mouthY: 30, lidCol: ppCol.push },
      sweat: [[-84, -30], [86, -24]],
      upd: (t, g, st) => {
        const m = st.arms || 'up', w = Math.sin(t * TAU * 1.3) * 6;
        let a, b;   // [shoulder, hand] for left and right
        if (m === 'push') { a = [[56, -6], [128, -14]]; b = [[56, 34], [128, 30]]; }
        else if (m === 'down') { a = [[-70, 30], [-96, 84]]; b = [[70, 30], [96, 84]]; }
        else { a = [[-70, -8], [-112, -70 + w]]; b = [[70, -8], [112, -70 - w]]; }
        const d = p => `M${p[0][0]},${p[0][1]} L${p[1][0].toFixed(1)},${p[1][1].toFixed(1)}`;
        attr(armL, 'd', d(a)); attr(g.armLi, 'd', d(a)); attr(armR, 'd', d(b)); attr(g.armRi, 'd', d(b));
        const flat = m === 'push';
        [[handL, a], [handR, b]].forEach(([h, p]) => { attr(h, 'cx', p[1][0]); attr(h, 'cy', p[1][1]); attr(h, 'rx', flat ? 12 : 20); attr(h, 'ry', flat ? 24 : 20); });
      } });
  }
  if (kind === 'frieda') {
    return scMake(parent, { s: o.s, mood: o.mood || 'annoyed', seed: 13, bob: 2,
      draw: g => {
        let d = 'M-92,40';
        for (let x = -92, i = 0; x < 92; x += 23, i++) d += ` L${x + 11.5},${i % 2 ? 80 : 84} L${x + 23},58`;
        E('path', { d: d + ' L92,40 Z', fill: '#9C6B32', stroke: K, 'stroke-width': 5, 'stroke-linejoin': 'round' }, g);   // rough teeth
        E('rect', { x: -92, y: -86, width: 184, height: 150, rx: 22, fill: ball('#E3B26E', '#9C6B32'), stroke: K, 'stroke-width': 6 }, g);
        const r = rng(41); let grit = '';
        for (let i = 0; i < 46; i++) {
          const x = -84 + r() * 168, y = -78 + r() * 136;
          if (Math.abs(x) < 72 && y > -62 && y < 44) continue;
          grit += `M${x.toFixed(1)},${y.toFixed(1)} h0.1 `;
        }
        E('path', { d: grit, stroke: '#8A5A2B', 'stroke-width': 5, 'stroke-linecap': 'round' }, g);
        // hair: a tight bun with a pencil through it
        E('path', { d: 'M-70,-84 Q-66,-108 -30,-106 Q0,-126 30,-106 Q66,-108 70,-84 Z', fill: '#6A4A33', stroke: K, 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
        const pen = G(g); tr(pen, 0, -122, 1, -28);
        E('rect', { x: -44, y: -5, width: 76, height: 10, fill: '#F2C230', stroke: K, 'stroke-width': 3 }, pen);
        E('path', { d: 'M32,-5 L46,0 L32,5 Z', fill: '#F6D9A8', stroke: K, 'stroke-width': 3, 'stroke-linejoin': 'round' }, pen);
        E('rect', { x: -54, y: -5, width: 12, height: 10, fill: '#FF8FB0', stroke: K, 'stroke-width': 3 }, pen);
        E('circle', { cx: 0, cy: -124, r: 22, fill: '#6A4A33', stroke: K, 'stroke-width': 4 }, g);
        E('path', { d: 'M-12,-130 Q0,-116 12,-130', fill: 'none', stroke: '#4A3222', 'stroke-width': 3 }, g);
        // whistle on a short cord at her right side
        E('path', { d: 'M92,-30 Q112,-4 104,22', fill: 'none', stroke: '#E8424F', 'stroke-width': 4 }, g);
        const wh = G(g); tr(wh, 104, 36, 1, -20);
        E('rect', { x: -18, y: -9, width: 36, height: 18, rx: 7, fill: '#D7DEE6', stroke: K, 'stroke-width': 3 }, wh);
        E('circle', { cx: 14, cy: 0, r: 6, fill: '#AEB8C2', stroke: K, 'stroke-width': 3 }, wh);
      },
      face: { x: 0, y: -18, eye: 16, gap: 56, mouthW: 40, mouthY: 34, lidCol: '#E3B26E' },
      upd: (t, g) => {
        if (!g.glasses) {   // drawn after the face so the frames sit on top of the eyes
          g.glasses = G(g); tr(g.glasses, 0, -18);
          [-28, 28].forEach(x => E('rect', { x: x - 25, y: -21, width: 50, height: 42, rx: 9, fill: 'none', stroke: K, 'stroke-width': 5 }, g.glasses));
          E('path', { d: 'M-3,-6 L3,-6', stroke: K, 'stroke-width': 5 }, g.glasses);
        }
      } });
  }
  if (kind === 'graham') {
    let armL, armR, armLi, armRi;
    return scMake(parent, { s: o.s, mood: o.mood || 'happy', seed: 17, bob: 2,
      draw: g => {
        E('path', { d: 'M-46,-28 C-56,-118 56,-118 46,-28', fill: 'none', stroke: K, 'stroke-width': 36, 'stroke-linecap': 'round' }, g);
        E('path', { d: 'M-46,-28 C-56,-118 56,-118 46,-28', fill: 'none', stroke: '#6C70A8', 'stroke-width': 24, 'stroke-linecap': 'round' }, g);
        E('path', { d: 'M-34,-70 C-24,-96 24,-96 34,-70', fill: 'none', stroke: '#A9ACE0', 'stroke-width': 5, 'stroke-linecap': 'round', opacity: 0.7 }, g);
        armL = E('path', { d: '', fill: 'none', stroke: K, 'stroke-width': 24, 'stroke-linecap': 'round' }, g);
        armR = E('path', { d: '', fill: 'none', stroke: K, 'stroke-width': 24, 'stroke-linecap': 'round' }, g);
        armLi = E('path', { d: '', fill: 'none', stroke: '#6C70A8', 'stroke-width': 14, 'stroke-linecap': 'round' }, g);
        armRi = E('path', { d: '', fill: 'none', stroke: '#6C70A8', 'stroke-width': 14, 'stroke-linecap': 'round' }, g);
        E('rect', { x: -52, y: 92, width: 104, height: 18, rx: 8, fill: '#2F3256', stroke: K, 'stroke-width': 4 }, g);
        E('circle', { cx: 0, cy: 20, r: 82, fill: ball(ppCol.weight, ppCol.weightDk), stroke: K, 'stroke-width': 6 }, g);
        E('ellipse', { cx: -50, cy: 38, rx: 14, ry: 9, fill: '#FF8FB0', opacity: 0.55 }, g);
        E('ellipse', { cx: 50, cy: 38, rx: 14, ry: 9, fill: '#FF8FB0', opacity: 0.55 }, g);
        T(g, 0, 84, '10 N/kg', { size: 19, weight: 800, anchor: 'middle', fill: '#C9CBF5' });
      },
      face: { x: 0, y: 4, eye: 18, gap: 58, mouthW: 46, mouthY: 32, lidCol: ppCol.weight },
      upd: (t, g, st) => {
        const h = clamp(st.hug || 0), wv = Math.sin(t * TAU * 0.6) * 3;
        const L = [[-74, 44], [lerp(-110, -124, h), lerp(80, -6, h) + wv]], R = [[74, 44], [lerp(110, 124, h), lerp(80, -6, h) - wv]];
        const d = p => `M${p[0][0]},${p[0][1]} L${p[1][0].toFixed(1)},${p[1][1].toFixed(1)}`;
        attr(armL, 'd', d(L)); attr(armLi, 'd', d(L)); attr(armR, 'd', d(R)); attr(armRi, 'd', d(R));
      } });
  }
  if (kind === 'norm') {
    return scMake(parent, { s: o.s, mood: o.mood || 'sad', seed: 19, bob: 1.5,
      draw: g => {
        [-1, 1].forEach(sd => {
          E('path', { d: `M${sd * 62},-40 L${sd * 66},-98`, stroke: K, 'stroke-width': 22, 'stroke-linecap': 'round' }, g);
          E('path', { d: `M${sd * 62},-40 L${sd * 66},-98`, stroke: '#E9B27A', 'stroke-width': 12, 'stroke-linecap': 'round' }, g);
          E('rect', { x: sd * 66 - 26, y: -116, width: 52, height: 16, rx: 6, fill: '#F6D2A8', stroke: K, 'stroke-width': 4 }, g);  // flat palm, facing up
        });
        E('rect', { x: -100, y: -50, width: 200, height: 142, rx: 14, fill: linGrad('#D49A63', '#9C6638', true), stroke: K, 'stroke-width': 6 }, g);
        E('path', { d: 'M-50,-48 L-50,-30 M50,-48 L50,-30 M-100,52 L100,52 M-50,52 L-50,90 M0,52 L0,90 M50,52 L50,90 M-75,-48 L-75,52 M75,-48 L75,52', stroke: '#7A4E2B', 'stroke-width': 3, opacity: 0.7 }, g);
        E('ellipse', { cx: 0, cy: 8, rx: 66, ry: 46, fill: '#E3AF79', opacity: 0.55 }, g);   // face patch over the planks
      },
      face: { x: 0, y: 4, eye: 16, gap: 54, mouthW: 38, mouthY: 30, lidCol: '#E9B27A' } });
  }
  if (kind === 'tess') {
    let back, frontO, front, hook;
    const coil = (L, wonky) => {   // zigzag coil from y 0 to L
      const n = 6, pts = [];
      for (let i = 0; i <= 2 * n; i++) {
        let f = i / (2 * n), x = (i % 2 ? 36 : -36) * (i === 0 || i === 2 * n ? 0 : 1);
        if (wonky) { f = Math.pow(f, 1.8) * 0.75 + f * 0.25; x = x * [1, 1.25, 0.6, 1.35, 0.8, 1.1, 0.5, 1.3, 0.9, 1.2, 0.7, 1, 1][i] + [0, 6, -8, 10, -4, 12, -10, 6, 0, -6, 8, 0, 0][i]; }   // uneven, lop-sided coils
        pts.push([x, f * L]);
      }
      let b = '', fr = '';
      for (let i = 0; i < pts.length - 1; i++) {
        const s = `M${pts[i][0]},${pts[i][1].toFixed(1)} L${pts[i + 1][0]},${pts[i + 1][1].toFixed(1)} `;
        if (i % 2) b += s; else fr += s;
      }
      return [b, fr];
    };
    const g0 = scMake(parent, { s: o.s, mood: o.mood || 'shock', seed: 23, bob: 3,
      draw: g => {
        back = E('path', { d: '', fill: 'none', stroke: '#5E7A93', 'stroke-width': 7, 'stroke-linecap': 'round' }, g);
        frontO = E('path', { d: '', fill: 'none', stroke: K, 'stroke-width': 14, 'stroke-linecap': 'round' }, g);
        front = E('path', { d: '', fill: 'none', stroke: '#D5E3EF', 'stroke-width': 8, 'stroke-linecap': 'round' }, g);
        hook = E('path', { d: '', fill: 'none', stroke: K, 'stroke-width': 7, 'stroke-linecap': 'round' }, g);
        E('path', { d: 'M-40,-92 L-48,-118 L-28,-104 L-22,-132 L-8,-108 L4,-136 L12,-106 L28,-128 L30,-100 L50,-112 L40,-86 Z', fill: '#1E4F4A', stroke: K, 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);   // frazzled hair
        E('circle', { cx: 0, cy: -52, r: 54, fill: ball(ppCol.tension, ppCol.tensionDk), stroke: K, 'stroke-width': 6 }, g);
        E('rect', { x: -14, y: -4, width: 28, height: 12, rx: 4, fill: '#9FB3C5', stroke: K, 'stroke-width': 4 }, g);    // collar where the coil starts
      },
      face: { x: 0, y: -56, eye: 15, gap: 44, mouthW: 30, mouthY: 26, lidCol: ppCol.tension },
      sweat: [[-62, -86], [64, -80]],
      upd: (t, g, st) => {
        const L = 80 * (1 + Math.max(-0.4, st.stretch || 0)) * (st.wonky ? 1.5 : 1) + 8;
        const [b, fr] = coil(L, !!st.wonky);
        attr(back, 'd', b); attr(frontO, 'd', fr); attr(front, 'd', fr);
        attr(hook, 'd', `M0,${L.toFixed(1)} L0,${(L + 14).toFixed(1)} Q0,${(L + 36).toFixed(1)} -18,${(L + 30).toFixed(1)}`);
      } });
    g0.hookY = (stretch, wonky) => 80 * (1 + (stretch || 0)) * (wonky ? 1.5 : 1) + 8 + 36;
    return g0;
  }
  if (kind === 'piv') {
    return scMake(parent, { s: o.s, mood: o.mood || 'neutral', seed: 29, bob: 0,
      draw: g => {
        E('path', { d: 'M0,-92 L96,80 L-96,80 Z', fill: ball('#B4BEC9', '#5F6B78'), stroke: K, 'stroke-width': 6, 'stroke-linejoin': 'round' }, g);
        E('circle', { cx: 0, cy: -64, r: 11, fill: '#3A434F', stroke: '#D7DEE6', 'stroke-width': 3 }, g);
      },
      face: { x: 0, y: 24, eye: 17, gap: 46, mouthW: 26, mouthY: 28, lidCol: '#A3AEBA' } });
  }
  return scKavya(parent, o);
}

/* ================= sets ================= */
function ppFlat(parent) {
  const g = G(parent);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#D3E6D8', '#AFCDB9', true) }, g);
  // window with HDB blocks
  const win_ = G(g);
  E('rect', { x: 760, y: 96, width: 330, height: 290, fill: linGrad('#7CCBF5', '#CDEEFF', true) }, win_);
  const r = rng(12);
  [[770, 190, 110], [890, 150, 90], [985, 210, 100]].forEach(([x, y, w]) => {
    E('rect', { x, y, width: w, height: 386 - y, fill: '#EDE6D6', stroke: '#B9AE96', 'stroke-width': 2 }, win_);
    for (let yy = y + 14; yy < 380; yy += 22) E('rect', { x: x + 6, y: yy, width: w - 12, height: 6, fill: r() > 0.5 ? '#6C8FA6' : '#8FB0C2' }, win_);
  });
  E('rect', { x: 760, y: 96, width: 330, height: 290, fill: 'none', stroke: '#FFFFFF', 'stroke-width': 12 }, win_);
  E('path', { d: 'M925,96 L925,386 M760,240 L1090,240', stroke: '#FFFFFF', 'stroke-width': 8 }, win_);
  // pale squares where photos hung
  [[600, 150, 110, 84], [610, 270, 80, 104], [460, 190, 90, 70]].forEach(([x, y, w, h]) => {
    E('rect', { x, y, width: w, height: h, fill: '#E8F3EB', opacity: 0.8 }, g);
    E('circle', { cx: x + w / 2, cy: y - 8, r: 3, fill: '#7A7A7A' }, g);
  });
  // door frame with height marks
  E('rect', { x: 120, y: 150, width: 210, height: 370, fill: '#8A6A4A', stroke: '#5E4630', 'stroke-width': 6 }, g);
  E('rect', { x: 138, y: 166, width: 174, height: 354, fill: '#2B2420' }, g);
  [[470, '6'], [430, '8'], [396, '10'], [366, '12']].forEach(([y, a]) => {
    E('line', { x1: 312, x2: 336, y1: y, y2: y, stroke: '#3A3A3A', 'stroke-width': 3 }, g);
    T(g, 342, y + 6, 'K ' + a, { size: 18, weight: 700, fill: '#3A3A3A', font: FB });
  });
  // floor tiles
  E('rect', { x: 0, y: 512, width: 1200, height: 12, fill: '#F2F2EC' }, g);
  E('rect', { x: 0, y: 522, width: 1200, height: 228, fill: linGrad('#D8C2A0', '#C6AC86', true) }, g);
  let d = '';
  [560, 612, 680].forEach(y => d += `M0,${y} L1200,${y} `);
  for (let x = -900; x <= 2100; x += 170) d += `M${(600 + (x - 600) * 0.42).toFixed(0)},522 L${x},750 `;
  E('path', { d, stroke: '#B39A74', 'stroke-width': 2.5 }, g);
  // ceiling fan
  const fan = G(g); tr(fan, 470, 40);
  E('line', { x1: 0, y1: -40, x2: 0, y2: 6, stroke: '#EDEDED', 'stroke-width': 6 }, fan);
  const blades = [0, 1, 2].map(() => E('ellipse', { cx: 0, cy: 12, rx: 80, ry: 9, fill: '#F5F5F0', stroke: '#B8B8B0', 'stroke-width': 2 }, fan));
  E('ellipse', { cx: 0, cy: 12, rx: 18, ry: 10, fill: '#DADAD2', stroke: '#9A9A92', 'stroke-width': 2 }, fan);
  const night = E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#081230', opacity: 0 }, g);
  g.upd = t => blades.forEach((b, i) => { const a = t * 5 + i * TAU / 3; attr(b, 'rx', 18 + 72 * Math.abs(Math.cos(a))); attr(b, 'cx', 70 * Math.sin(a) * 0.5); });
  g.night = v => { op(night, clamp(v) * 0.62); };
  g.upd(0); g.night(0);
  return g;
}

function ppCorridor(parent) {
  const g = G(parent);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#6CC4F2', '#CDEBFA', true) }, g);
  const r = rng(31);
  for (let i = 0; i < 9; i++) {      // blocks across the way
    const x = i * 140 - 30 + r() * 30, w = 110 + r() * 20, top = 130 + r() * 90;
    E('rect', { x, y: top, width: w, height: 300, fill: i % 2 ? '#EFE7D6' : '#E2DBCB', stroke: '#B9AE96', 'stroke-width': 2 }, g);
    let d = ''; for (let y = top + 16; y < 380; y += 24) d += `M${x + 8},${y} L${x + w - 8},${y} `;
    E('path', { d, stroke: '#8FB0C2', 'stroke-width': 6 }, g);
  }
  E('rect', { x: 0, y: 0, width: 1200, height: 112, fill: '#E9E5DB' }, g);                       // ceiling slab
  E('rect', { x: 0, y: 104, width: 1200, height: 10, fill: '#CFC8B8' }, g);
  const lightsG = G(g);
  const lights = [0, 1, 2, 3, 4].map(() => E('rect', { y: 82, width: 120, height: 12, rx: 6, fill: '#FFFDF0', stroke: '#D8D2C0', 'stroke-width': 2 }, lightsG));
  E('rect', { x: 0, y: 380, width: 1200, height: 92, fill: '#F1EBDD', stroke: '#C9C0AA', 'stroke-width': 3 }, g);   // parapet
  E('rect', { x: 0, y: 372, width: 1200, height: 10, fill: '#BDB6A6' }, g);
  const rail = E('path', { d: '', stroke: '#8E99A4', 'stroke-width': 5 }, g);
  E('line', { x1: 0, y1: 330, x2: 1200, y2: 330, stroke: '#8E99A4', 'stroke-width': 7 }, g);
  const pillars = [0, 1, 2, 3, 4].map(() => E('rect', { y: 104, width: 54, height: 368, fill: '#E4DDCC', stroke: '#C2B9A4', 'stroke-width': 3 }, g));
  E('rect', { x: 0, y: 470, width: 1200, height: 280, fill: linGrad('#CFC6B4', '#B5AC98', true) }, g);   // floor
  const joints = E('path', { d: '', stroke: '#A39A86', 'stroke-width': 2.5 }, g);
  E('path', { d: 'M0,520 L1200,520 M0,600 L1200,600 M0,700 L1200,700', stroke: '#A39A86', 'stroke-width': 2.5 }, g);
  // lift lobby, right
  const lift = G(g);
  E('rect', { x: 990, y: 104, width: 210, height: 368, fill: '#D9D3C4', stroke: '#B0A792', 'stroke-width': 3 }, lift);
  E('rect', { x: 1020, y: 210, width: 150, height: 262, fill: '#BFC7CF', stroke: '#7E8A96', 'stroke-width': 4 }, lift);
  E('line', { x1: 1095, y1: 210, x2: 1095, y2: 472, stroke: '#7E8A96', 'stroke-width': 3 }, lift);
  E('rect', { x: 1040, y: 128, width: 110, height: 44, rx: 6, fill: '#1F2A36' }, lift);
  T(lift, 1072, 161, 'LIFT', { size: 28, weight: 800, anchor: 'middle', fill: '#FFE45C' });
  T(lift, 1132, 161, '9', { size: 28, weight: 800, anchor: 'middle', fill: '#FF6B5C' });
  E('circle', { cx: 1182, cy: 330, r: 8, fill: '#FFE45C', stroke: '#7E8A96', 'stroke-width': 3 }, lift);
  // shoe rack (left) and potted plants
  const rack = G(g); tr(rack, 70, 470);
  E('rect', { x: -40, y: -90, width: 120, height: 90, fill: '#7B5A3E', stroke: '#4E3826', 'stroke-width': 3 }, rack);
  E('line', { x1: -40, y1: -46, x2: 80, y2: -46, stroke: '#4E3826', 'stroke-width': 3 }, rack);
  [['#FF7A59', -24, -56], ['#3F5BD9', 22, -56], ['#56D69B', -10, -12], ['#FFC247', 40, -12]].forEach(([c, x, y]) => E('ellipse', { cx: x, cy: y, rx: 18, ry: 7, fill: c }, rack));
  [[880, 470], [930, 470]].forEach(([x, y], i) => {
    const p = G(g); tr(p, x, y);
    E('path', { d: 'M-22,0 L-28,-46 L28,-46 L22,0 Z', fill: '#C2643A', stroke: '#7E3A1E', 'stroke-width': 3 }, p);
    for (let k = 0; k < 5; k++) E('ellipse', { cx: -20 + k * 10, cy: -70 - (k % 2) * 16, rx: 12, ry: 26, fill: i ? '#3FA463' : '#2C8C4C', transform: `rotate(${-30 + k * 15} ${-20 + k * 10} -60)` }, p);
  });
  g.upd = (t, speed) => {
    const off = ((t * (speed || 0)) % 300 + 300) % 300;
    pillars.forEach((p, i) => attr(p, 'x', i * 300 + 120 - off));
    lights.forEach((l, i) => attr(l, 'x', i * 300 + 210 - off));
    let d = '', dr = '';
    for (let x = -off; x < 1260; x += 150) d += `M${x.toFixed(0)},470 L${(x - 60).toFixed(0)},750 `;
    for (let x = -off % 30; x < 1200; x += 30) dr += `M${x.toFixed(0)},330 L${x.toFixed(0)},380 `;
    attr(joints, 'd', d); attr(rail, 'd', dr);
  };
  g.upd(0, 0);
  return g;
}

function ppRoad(parent) {
  const g = G(parent);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#58BDF5', '#C6ECFF', true) }, g);
  const sunG = G(g); tr(sunG, 1060, 110);
  E('circle', { r: 120, fill: glow('#FFE45C') }, sunG); E('circle', { r: 50, fill: '#FFE45C' }, sunG);
  const sky = G(g), r = rng(5);
  for (let i = 0; i < 16; i++) {
    const x = i * 110 + r() * 30, w = 80 + r() * 30, top = 230 + r() * 110;
    E('rect', { x, y: top, width: w, height: 420 - top, fill: i % 3 ? '#E7DFCD' : '#D8CFBB', stroke: '#ADA28A', 'stroke-width': 2 }, sky);
    let d = ''; for (let y = top + 12; y < 412; y += 18) d += `M${x + 6},${y} L${x + w - 6},${y} `;
    E('path', { d, stroke: '#9DB7C6', 'stroke-width': 4 }, sky);
  }
  const trees = G(g);
  for (let i = 0; i < 14; i++) {
    const x = i * 100 + r() * 30, rr = 34 + r() * 16;
    E('rect', { x: x - 5, y: 420, width: 10, height: 32, fill: '#6B4A33' }, trees);
    E('circle', { cx: x, cy: 412 - rr * 0.4, r: rr, fill: ball('#4CB866', '#23763A') }, trees);
  }
  E('rect', { x: 0, y: 440, width: 1200, height: 22, fill: '#9AA5AE' }, g);                // barrier
  E('rect', { x: 0, y: 456, width: 1200, height: 294, fill: linGrad('#4B525A', '#33383E', true) }, g);
  E('line', { x1: 0, y1: 480, x2: 1200, y2: 480, stroke: '#F2F2F2', 'stroke-width': 5 }, g);
  E('line', { x1: 0, y1: 730, x2: 1200, y2: 730, stroke: '#F2F2F2', 'stroke-width': 5 }, g);
  const dash = E('path', { d: '', stroke: '#FFFFFF', 'stroke-width': 7 }, g);
  g.upd = (t, speed) => {
    const v = speed || 0, w = (x, m) => ((x % m) + m) % m;
    tr(sky, -w(t * v * 0.08, 1760), 0); tr(trees, -w(t * v * 0.5, 1400), 0);
    if (!g._dup) { g._dup = 1; sky.appendChild(sky.cloneNode(true)); sky.lastChild.setAttribute('transform', 'translate(1760 0)'); trees.appendChild(trees.cloneNode(true)); trees.lastChild.setAttribute('transform', 'translate(1400 0)'); }
    const off = w(t * v, 160); let d = '';
    for (let x = -off; x < 1260; x += 160) d += `M${x.toFixed(0)},606 L${(x + 80).toFixed(0)},606 `;
    attr(dash, 'd', d);
  };
  g.upd(0, 0);
  return g;
}

function ppNewFlat(parent) {
  const g = G(parent);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#F7F4EE', '#E4DED2', true) }, g);
  E('rect', { x: 700, y: 110, width: 400, height: 330, fill: linGrad('#8ED3F7', '#DDF3FF', true) }, g);
  const r = rng(8);
  [[720, 250, 120], [860, 220, 100], [980, 270, 110]].forEach(([x, y, w]) => {
    E('rect', { x, y, width: w, height: 440 - y, fill: '#F1ECDF', stroke: '#BDB29A', 'stroke-width': 2 }, g);
    for (let yy = y + 14; yy < 434; yy += 22) E('rect', { x: x + 6, y: yy, width: w - 12, height: 6, fill: r() > 0.5 ? '#7FA6BC' : '#A7C4D3' }, g);
  });
  E('rect', { x: 700, y: 110, width: 400, height: 330, fill: 'none', stroke: '#FFFFFF', 'stroke-width': 14 }, g);
  E('path', { d: 'M900,110 L900,440', stroke: '#FFFFFF', 'stroke-width': 9 }, g);
  E('path', { d: 'M700,440 L1100,440 L980,750 L420,750 Z', fill: '#FFF6C8', opacity: 0.35 }, g);   // sunlight on the floor
  const ac = G(g); tr(ac, 330, 150);                                                              // aircon
  E('rect', { x: -120, y: -36, width: 240, height: 72, rx: 14, fill: '#FBFBF8', stroke: '#BFC6CC', 'stroke-width': 3 }, ac);
  E('path', { d: 'M-104,20 L104,20 M-104,28 L104,28', stroke: '#C9D0D6', 'stroke-width': 3 }, ac);
  E('circle', { cx: 96, cy: -14, r: 4, fill: '#56D69B' }, ac);
  E('rect', { x: 120, y: 330, width: 26, height: 40, rx: 4, fill: '#FFFFFF', stroke: '#C9C3B6', 'stroke-width': 2 }, g);     // switch
  E('rect', { x: 0, y: 510, width: 1200, height: 12, fill: '#FFFFFF' }, g);
  E('rect', { x: 0, y: 520, width: 1200, height: 230, fill: linGrad('#E8CB9A', '#D4B07A', true) }, g);
  let d = '';
  for (let x = -1200; x <= 2400; x += 120) d += `M${(600 + (x - 600) * 0.4).toFixed(0)},520 L${x},750 `;
  E('path', { d, stroke: '#C29C66', 'stroke-width': 2 }, g);
  E('path', { d: 'M180,575 L250,575 M720,640 L800,640 M420,700 L500,700 M960,600 L1020,600', stroke: '#C29C66', 'stroke-width': 2 }, g);
  return g;
}

/* ================= props ================= */
function ppBox(parent, label, o) {
  o = o || {};
  const w = o.w || 170, h = o.h || 130, g = G(parent);
  E('path', { d: `M${-w / 2},${-h / 2} L${-w / 2 + 24},${-h / 2 - 22} L${w / 2 + 24},${-h / 2 - 22} L${w / 2},${-h / 2} Z`, fill: '#D9AE73', stroke: '#8C6235', 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
  E('path', { d: `M${w / 2},${-h / 2} L${w / 2 + 24},${-h / 2 - 22} L${w / 2 + 24},${h / 2 - 22} L${w / 2},${h / 2} Z`, fill: '#B88A52', stroke: '#8C6235', 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
  E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, fill: '#C99A5E', stroke: '#8C6235', 'stroke-width': 4 }, g);
  E('rect', { x: -14, y: -h / 2, width: 28, height: h * 0.4, fill: '#E9D4A6', opacity: 0.85 }, g);
  E('path', { d: `M-2,${-h / 2} L22,${-h / 2 - 22}`, stroke: '#E9D4A6', 'stroke-width': 26, opacity: 0.85 }, g);
  if (label) g.label = T(g, 0, h * 0.22, label, { size: o.size || 30, weight: 700, anchor: 'middle', fill: '#2A1A22', font: FB });
  return g;
}

function ppSofa(parent, o) {
  o = o || {};
  const g = G(parent), K = SC_INK;
  g.legs = [[-150, 0], [-110, 0], [110, 0], [150, 0]];
  g.legs.forEach(([x]) => E('rect', { x: x - 6, y: -22, width: 12, height: 22, fill: '#5A3A22', stroke: K, 'stroke-width': 3 }, g));
  E('rect', { x: -190, y: -150, width: 380, height: 100, rx: 26, fill: ball('#3FA7A0', '#1F6F6A'), stroke: K, 'stroke-width': 5 }, g);   // back
  E('rect', { x: -170, y: -84, width: 340, height: 64, rx: 16, fill: '#2E8E87', stroke: K, 'stroke-width': 5 }, g);                       // seat
  E('line', { x1: -56, y1: -84, x2: -56, y2: -24, stroke: '#1F6F6A', 'stroke-width': 4 }, g);
  E('line', { x1: 56, y1: -84, x2: 56, y2: -24, stroke: '#1F6F6A', 'stroke-width': 4 }, g);
  [-1, 1].forEach(sd => E('rect', { x: sd > 0 ? 150 : -200, y: -110, width: 50, height: 90, rx: 20, fill: ball('#47B3AB', '#1F6F6A'), stroke: K, 'stroke-width': 5 }, g));
  E('ellipse', { cx: -110, cy: -120, rx: 34, ry: 22, fill: '#FFC247', stroke: K, 'stroke-width': 4 }, g);   // a cushion
  const pads = G(g);
  g.legs.forEach(([x]) => E('ellipse', { cx: x, cy: 2, rx: 26, ry: 7, fill: '#8C8F99', stroke: K, 'stroke-width': 3 }, pads));
  g.pads = v => op(pads, v);
  g.pads(o.pads ? 1 : 0);
  return g;
}

function ppTrolley(parent, o) {
  o = o || {};
  const g = G(parent), K = SC_INK, w = o.w || 300;
  g.top = -40;
  E('rect', { x: -w / 2, y: -46, width: w, height: 18, rx: 6, fill: '#3F5BD9', stroke: K, 'stroke-width': 4 }, g);
  E('path', { d: `M${w / 2 - 10},-46 L${w / 2 + 10},-150 L${w / 2 + 34},-150`, fill: 'none', stroke: K, 'stroke-width': 8, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
  const wheels = [-w / 2 + 30, -w / 2 + 70, w / 2 - 70, w / 2 - 30].map(x => {
    const wg = G(g); tr(wg, x, -14);
    E('circle', { r: 14, fill: '#2B2B2B', stroke: K, 'stroke-width': 3 }, wg);
    const sp = E('line', { x1: -10, y1: 0, x2: 10, y2: 0, stroke: '#9AA6B2', 'stroke-width': 3 }, wg);
    return { wg, sp, x };
  });
  g.upd = (t, speed) => wheels.forEach(({ sp }) => tr(sp, 0, 0, 1, (t * (speed || 0) / 14 * 57.3) % 360));
  g.upd(0, 0);
  return g;
}

function ppLorry(parent, o) {
  o = o || {};
  const g = G(parent), K = SC_INK;
  E('rect', { x: -230, y: -250, width: 320, height: 200, rx: 8, fill: '#F4F1EA', stroke: K, 'stroke-width': 5 }, g);   // box
  T(g, -70, -168, 'PUSH & PULL', { size: 32, weight: 800, anchor: 'middle', fill: '#E8424F' });
  T(g, -70, -126, 'REMOVALS', { size: 26, weight: 700, anchor: 'middle', fill: '#3F5BD9' });
  E('path', { d: 'M-170,-96 L-10,-96 M-10,-96 L-34,-108 M-10,-96 L-34,-84', stroke: ppCol.resultantDk, 'stroke-width': 6, fill: 'none', 'stroke-linecap': 'round' }, g);
  E('path', { d: 'M96,-50 L96,-196 L170,-196 Q204,-196 214,-150 L230,-100 L230,-50 Z', fill: '#E8424F', stroke: K, 'stroke-width': 5, 'stroke-linejoin': 'round' }, g);   // cab
  E('path', { d: 'M112,-180 L166,-180 Q188,-180 196,-150 L204,-124 L112,-124 Z', fill: '#BFE6FF', stroke: K, 'stroke-width': 4 }, g);
  E('rect', { x: -236, y: -56, width: 472, height: 22, rx: 6, fill: '#3A3F46', stroke: K, 'stroke-width': 4 }, g);
  const wheels = [-160, -90, 170].map(x => {
    const wg = G(g); tr(wg, x, -22);
    E('circle', { r: 28, fill: '#232323', stroke: K, 'stroke-width': 4 }, wg);
    E('circle', { r: 12, fill: '#B9C2CB' }, wg);
    const sp = E('path', { d: 'M-12,0 L12,0 M0,-12 L0,12', stroke: '#6B7580', 'stroke-width': 3 }, wg);
    return sp;
  });
  g.upd = (t, speed) => wheels.forEach(sp => tr(sp, 0, 0, 1, (t * (speed || 0) / 28 * 57.3) % 360));
  g.upd(0, 0);
  return g;
}

function ppNewtonmeter(parent, o) {
  o = o || {};
  const max = o.max || 250, step = o.step || 50, g = G(parent), K = SC_INK;
  const top = 30, len = 280, x0 = -40, y0 = top + 20, span = 220;   // scale from y0 (0 N) to y0 + span (max)
  E('circle', { cx: 0, cy: 0, r: 14, fill: 'none', stroke: '#C9D3DC', 'stroke-width': 6 }, g);
  E('rect', { x: -58, y: top - 16, width: 176, height: len, rx: 16, fill: '#E9EEF2', stroke: K, 'stroke-width': 5 }, g);
  E('rect', { x: -14, y: top, width: 28, height: len - 30, rx: 8, fill: '#1F2A36' }, g);   // window for the spring
  const spring = E('path', { d: '', fill: 'none', stroke: '#D5E3EF', 'stroke-width': 4 }, g);
  for (let v = 0; v <= max; v += step) {
    const y = y0 + span * v / max;
    E('line', { x1: 18, x2: 38, y1: y, y2: y, stroke: K, 'stroke-width': 3 }, g);
    T(g, 44, y + 9, String(v), { size: 24, weight: 700, fill: K });
  }
  for (let v = step / 2; v < max; v += step) { const y = y0 + span * v / max; E('line', { x1: 18, x2: 30, y1: y, y2: y, stroke: K, 'stroke-width': 2 }, g); }
  T(g, -34, top + len - 26, 'N', { size: 26, weight: 800, anchor: 'middle', fill: K });
  const pointer = E('path', { d: 'M-20,0 L18,0 L10,-7 M18,0 L10,7', stroke: '#E8424F', 'stroke-width': 5, fill: 'none', 'stroke-linecap': 'round' }, g);
  const rod = E('line', { x1: 0, x2: 0, stroke: '#9AA6B2', 'stroke-width': 8 }, g);
  const hook = E('path', { d: '', fill: 'none', stroke: '#9AA6B2', 'stroke-width': 7, 'stroke-linecap': 'round' }, g);
  g.set = F => {
    const f = clamp(F / max), y = y0 + span * f;
    tr(pointer, 0, y);
    let d = `M0,${top + 4}`; const n = 10;
    for (let i = 1; i <= n; i++) d += ` L${i % 2 ? 9 : -9},${(top + 4 + (y - top - 4) * i / n).toFixed(1)}`;
    attr(spring, 'd', d);
    const hy = top + len - 16 + 40 * f;
    attr(rod, 'y1', y); attr(rod, 'y2', hy + 30);
    attr(hook, 'd', `M0,${hy + 30} L0,${hy + 44} Q0,${hy + 66} -18,${hy + 60}`);
    g.hookY = hy + 64;
  };
  g.set(0);
  return g;
}

function ppForce(parent, o) {
  o = o || {};
  const g = G(parent), col = o.color || ppCol.push, sw = o.width || 22, size = o.size || 30;
  const DIR = { right: [1, 0], left: [-1, 0], up: [0, -1], down: [0, 1] }, [dx, dy] = DIR[o.dir || 'right'];
  const body = E('path', { d: '', fill: col, stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
  const lab = T(g, 0, 0, o.label || '', { size, weight: 800, anchor: 'middle', fill: o.labelColor || col });
  lab.setAttribute('stroke', '#0A1B27'); lab.setAttribute('stroke-width', 6); lab.setAttribute('paint-order', 'stroke'); lab.setAttribute('stroke-linejoin', 'round');
  g.set = (len, label) => {
    if (label !== undefined) setText(lab, label);
    if (!(len > 2)) { op(g, 0); return; }
    op(g, 1);
    const hl = Math.min(len * 0.55, sw * 1.9), hw = sw * 1.25, s = sw / 2, L = len - hl;
    // arrow along +x, then rotate into place
    const pts = [[0, -s], [L, -s], [L, -hw], [len, 0], [L, hw], [L, s], [0, s]].map(([x, y]) => [x * dx - y * dy, x * dy + y * dx]);
    attr(body, 'd', 'M' + pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' L') + ' Z');
    const side = o.side || 'auto', mx = len / 2 * dx, my = len / 2 * dy;
    let lx = mx, ly = my;
    if (dy === 0) ly = side === 'below' ? sw + size * 1.05 : -sw - size * 0.45;
    else { if (side === 'left') { lx = -sw - 12; lab.setAttribute('text-anchor', 'end'); } else { lx = sw + 12; lab.setAttribute('text-anchor', 'start'); } ly = my + size * 0.35; }
    attr(lab, 'x', lx); attr(lab, 'y', ly);
  };
  g.set(o.len || 0);
  return g;
}

function ppDTGraph(parent, w, h, o) {
  o = o || {};
  const g = G(parent), tMax = o.tMax || 30, dMax = o.dMax || 15, K = '#F2F7FA';
  E('rect', { x: -110, y: -h - 50, width: w + 160, height: h + 150, rx: 18, fill: '#0F2C3A', stroke: C.line, 'stroke-width': 3, opacity: 0.94 }, g);
  const xy = (t, d) => [w * t / tMax, -h * d / dMax];
  g.xy = xy;
  (o.ticksT || [0, 10, 20, 30]).forEach(t => { const [x] = xy(t, 0); E('line', { x1: x, x2: x, y1: 0, y2: -h, stroke: C.line, 'stroke-width': 1.5 }, g); T(g, x, 34, String(t), { size: 24, weight: 600, anchor: 'middle', fill: C.muted }); });
  (o.ticksD || [0, 5, 10, 15]).forEach(d => { const [, y] = xy(0, d); E('line', { x1: 0, x2: w, y1: y, y2: y, stroke: C.line, 'stroke-width': 1.5 }, g); T(g, -14, y + 8, String(d), { size: 24, weight: 600, anchor: 'end', fill: C.muted }); });
  arrow(g, 0, 0, w + 30, 0, { color: K, width: 4 }); arrow(g, 0, 0, 0, -h - 30, { color: K, width: 4 });
  T(g, w / 2, 76, o.tLabel || 'time (min)', { size: 28, weight: 700, anchor: 'middle', fill: K });
  const dl = T(g, -66, -h / 2, o.dLabel || 'distance (km)', { size: 28, weight: 700, anchor: 'middle', fill: K });
  dl.setAttribute('transform', `rotate(-90 -66 ${-h / 2})`);
  const line = E('path', { d: '', fill: 'none', stroke: o.color || ppCol.resultant, 'stroke-width': 7, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
  const dot = E('circle', { r: 11, fill: '#FFFFFF', stroke: o.color || ppCol.resultant, 'stroke-width': 5 }, g);
  g.set = (pts, tNow) => {
    let d = '', last = null;
    for (let i = 0; i < pts.length; i++) {
      const [t, v] = pts[i];
      if (t <= tNow) { const [x, y] = xy(t, v); d += (d ? ' L' : 'M') + x.toFixed(1) + ',' + y.toFixed(1); last = [x, y]; }
      else if (i > 0) { const [t0, v0] = pts[i - 1], f = (tNow - t0) / (t - t0), [x, y] = xy(tNow, v0 + (v - v0) * f); d += ' L' + x.toFixed(1) + ',' + y.toFixed(1); last = [x, y]; break; }
    }
    attr(line, 'd', d); if (last) { op(dot, 1); attr(dot, 'cx', last[0]); attr(dot, 'cy', last[1]); } else op(dot, 0);
    return last;
  };
  g.set([], -1);
  return g;
}

function ppPlank(parent, len) {
  len = len || 560;
  const g = G(parent), p = G(g);
  E('rect', { x: -len / 2, y: -14, width: len, height: 22, rx: 8, fill: linGrad('#D49A63', '#9C6638', true), stroke: SC_INK, 'stroke-width': 4 }, p);
  let d = ''; for (let x = -len / 2 + 70; x < len / 2; x += 140) d += `M${x},-10 L${x},6 `;
  E('path', { d, stroke: '#7A4E2B', 'stroke-width': 2 }, p);
  g.on = G(p);
  g.set = a => tr(p, 0, 0, 1, a || 0);
  g.set(0);
  return g;
}

function ppDoor(parent, o) {
  o = o || {};
  const g = G(parent), K = SC_INK, w = 230, h = 430;
  E('rect', { x: -14, y: -h - 14, width: w + 28, height: h + 14, fill: '#6B4A33', stroke: K, 'stroke-width': 4 }, g);   // frame
  E('rect', { x: 0, y: -h, width: w, height: h, fill: '#20262E' }, g);                                                  // opening (dark corridor)
  const leaf = G(g);
  E('rect', { x: 0, y: -h, width: w, height: h, fill: linGrad('#A86F43', '#7E4E2B', false), stroke: K, 'stroke-width': 4 }, leaf);
  E('rect', { x: 26, y: -h + 30, width: w - 52, height: 150, rx: 8, fill: 'none', stroke: '#6A3E1F', 'stroke-width': 4 }, leaf);
  E('rect', { x: 26, y: -h + 210, width: w - 52, height: 190, rx: 8, fill: 'none', stroke: '#6A3E1F', 'stroke-width': 4 }, leaf);
  E('rect', { x: 190, y: -230, width: 26, height: 12, rx: 6, fill: '#E2C35A', stroke: K, 'stroke-width': 3 }, leaf);  // handle
  E('circle', { cx: 196, cy: -224, r: 9, fill: '#E2C35A', stroke: K, 'stroke-width': 3 }, leaf);
  [-h + 50, -80].forEach(y => E('rect', { x: -6, y, width: 14, height: 40, rx: 3, fill: '#C9CED4', stroke: K, 'stroke-width': 3 }, g));   // hinges
  g.handleX = 200; g.handleY = -224;
  g.set = v => { const k = Math.cos(clamp(v) * Math.PI * 0.45); leaf.setAttribute('transform', `scale(${k.toFixed(3)} 1)`); };
  g.set(0);
  return g;
}

function ppWhiteboard(parent, w, h) {
  w = w || 640; h = h || 300;
  const g = G(parent);
  E('path', { d: `M${-w / 2 + 40},${h / 2} L${-w / 2 + 20},${h / 2 + 90} M${w / 2 - 40},${h / 2} L${w / 2 - 20},${h / 2 + 90}`, stroke: '#9AA6B2', 'stroke-width': 8, 'stroke-linecap': 'round' }, g);
  E('rect', { x: -w / 2 - 10, y: -h / 2 - 10, width: w + 20, height: h + 20, rx: 12, fill: '#B9C2CB', stroke: SC_INK, 'stroke-width': 4 }, g);
  E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: 6, fill: '#FBFCFD' }, g);
  E('rect', { x: -w / 2 + 30, y: h / 2 + 2, width: 120, height: 10, rx: 4, fill: '#8E99A4' }, g);
  g.board = G(g);
  return g;
}

function ppLogo(parent) {
  const g = G(parent), inner = G(g);
  const word = (x, s, col) => { const t = T(inner, x, 0, s, { size: 104, weight: 800, anchor: 'middle', fill: col }); t.setAttribute('stroke', '#1A1020'); t.setAttribute('stroke-width', 14); t.setAttribute('paint-order', 'stroke'); t.setAttribute('stroke-linejoin', 'round'); return t; };
  word(-240, 'PUSH', ppCol.push); word(0, '&', '#FFFFFF'); word(240, 'PULL', ppCol.tension);
  const a1 = ppForce(inner, { color: ppCol.push, dir: 'right', width: 20 }); tr(a1, -360, 50); a1.set(240);
  const a2 = ppForce(inner, { color: ppCol.tension, dir: 'left', width: 20 }); tr(a2, 360, 50); a2.set(240);
  g.set = p => { op(g, clamp(p * 2.5)); tr(inner, 0, 0, Math.max(0.01, 0.5 + 0.5 * pop(clamp(p)))); };
  g.set(1);
  return g;
}

function ppPad(parent, w) {
  const g = G(parent);
  E('ellipse', { rx: (w || 60) / 2, ry: 8, fill: '#8C8F99', stroke: SC_INK, 'stroke-width': 3 }, g);
  return g;
}
