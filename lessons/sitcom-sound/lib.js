/* PASS IT ON (Claude Sitcom Ep 11, Sound): cast, sets and props. Bundled after engine lib.js, kit.js and
   sitcom.js, so scWho / scTalk / scMake / scKavya / scKavyaBody / scConfessional / scLowerThird / scVideoCall /
   scClipboard are all available. Every top-level name here starts with `pio` (Pass It On), except `cast`.

   Speech (from sitcom.js): scTalk(S, t, 'nigel') -> mouth 0..1 while that speaker's line plays.

   CHARACTERS: cast(parent, kind, o) -> g. Origin = the character's centre, about 200 px tall at s = 1.
     o: { s (scale), mood (default mood) }
     g.set({ t, talk, mood, look, sweat, still, ...extras })  call EVERY frame
       talk 0..1 (use scTalk), mood: neutral | happy | smug | annoyed | sad | shock | deadpan,
       look -1..1 (pupils left/right), sweat 0..1, still: true stops the idle bob.
     kinds:
       'nigel'  NIGEL, a nitrogen molecule (N2): a blue peanut (two fused atoms, "N" on each), navy courier cap
                with a yellow sound-wave badge. Tired, sarcastic straight man. Default mood deadpan. ~260 x 200.
       'archie' ARCHIE, an argon atom: one teal ball, spiky fringe, lanyard with a yellow TRAINEE badge.
                Over-keen trainee. Extra: g.set({ bounce: 0..1 }) hops with excitement. ~170 x 200.
       'belle'  BELLE, an electric school bell: red gong dome on a wall bracket, hammer on the right.
                Extra: g.set({ ring: 0..1 }) the hammer chatters against the rim and vibration arcs appear.
                Mopey. Default mood sad. ~230 x 210.
       'freq'   FREQ, frequency: a lime-green capsule with a tight zigzag stripe across the belly and a coiled
                spring antenna. Hyper. Extra: g.set({ buzz: 0..1 }) fast jitter (high frequency!). ~140 x 220.
       'amp'    AMP, amplitude: a huge coral one-hump wave with a double-headed height arrow on his front,
                heavy brows, wide mouth. LOUD. Extra: g.set({ big: 0..1 }) he swells taller. ~280 x 220.
       'coco'   COCO, the cochlea: a pink snail-shell spiral with a receptionist headset. Brisk front desk.
                ~200 x 200.
       'echo'   ECHO, the back wall of the hall: a tiled panel with a face. Repeats things.
                Extra: g.set({ ghost: 0..1 }) two fading copies of her outline ripple out to the right (the echo).
                Default mood deadpan. ~180 x 220.
       'kavya'  Kavya, 12 (sitcom.js scKavya: head and shoulders, PE shirt "8"). Full body: scKavyaBody(parent).

   CONFESSIONALS
     pioConf(parent, kind)          scConfessional in this character's colours; g.set(p, t)
     PIO_TINT[kind]                 [top, bottom] colours per character
   SETS (full stage 1200 x 750 unless stated)
     pioHall(parent)                the school hall: louvred windows, two ceiling fans, stage with maroon curtains (left),
                                    tiled back wall (right, where Echo lives: g.wall = [x, y] of its centre), parquet floor,
                                    banner "SCHOOL BAND · SPEECH DAY". g.upd(t) turns the fans.
     pioAir(parent)                 the microscopic "inside the air" world: soft blue haze with drifting blurred particles. g.upd(t)
     pioLab(parent)                 the science lab: green-tiled wall, window, bench across the bottom (top at y 560),
                                    periodic-table poster. g.bench = y of the bench top.
     pioStorm(parent)               evening storm over HDB blocks seen through a window frame. g.set({ t, flash 0..1, rain 0..1 })
                                    flash lights the sky and shows a lightning bolt; rain streaks fall.
     pioSea(parent)                 sonar cross-section: sky, ship at (300, 200), sea, seabed at y 690.
                                    g.set({ t, p }) p 0..1 a pulse goes down, 1..2 the echo comes back up (arcs).
   PROPS
     pioTriangle(parent, s)         the triangle on its string, with a beater. g.set({ t, ring 0..1, hit 0..1, held: bool })
                                    ring: the triangle shivers and vibration lines flash; hit moves the beater in to strike;
                                    held: a hand grips the corner (Kavya stopping the sound). Size ~150 x 170 at s 1.
     pioRow(parent, o)              a longitudinal sound wave made of air particles: rows x cols of dots that bunch
                                    (compressions) and spread (rarefactions). o: { w, h, cols, rows, r, color }.
                                    g.set({ t, amp, wl, f, front, hi }) amp (px), wl wavelength (px), f (waves per s),
                                    front: x reached by the wave so far (px from the left; omit = everywhere),
                                    hi: index of a column whose middle particle is outlined red (the one to watch).
                                    g.compAt(t, wl, f) -> x positions (px) of compressions now, for labels.
     pioJar(parent)                 bell jar on a base plate, tube to a VACUUM PUMP box (left). Put Belle in g.inside
                                    (centre about (0, -40)). g.set({ t, air 0..1, ring 0..1 }) air particles inside the jar
                                    (fewer as air -> 0) and sound arcs outside the jar (strength = ring x air).
     pioScope(parent, w, h)         oscilloscope: case, green screen with grid, two knobs, label. g.trace({ amp, wl, phase, color })
                                    amp in px (screen half-height is h/2 - 16), wl in px. g.screen = the clipped screen group.
     pioEar(parent)                 ear cross-section about 1000 x 480, origin top-left: pinna, ear canal, ear drum,
                                    three bones, cochlea, nerve to the brain. g.hi(name, p) glows a part:
                                    'pinna' | 'canal' | 'drum' | 'bones' | 'cochlea' | 'nerve'; g.at[name] = [x, y] for labels.
                                    g.wave(t, p) a sound wave travels in along the canal (p 0..1 how far).
     pioCurtains(parent, w, h)      soft stage curtains centred on (0,0); g.set(p) 0 open .. 1 closed.
     pioBubbleTea(parent, s)        Freq's bubble tea (cup, lid, straw, pearls), ~60 x 110 at s 1.
     pioSheet(parent, w)            a strip of sheet music: bars of rests, bar 47 with one note circled. w width; ~150 tall.
*/

let pioUid = 0;
const pioDk = '#2A1A22';   // = SC_INK

/* ---------------- characters ---------------- */
function cast(parent, kind, o) {
  o = o || {};
  if (kind === 'kavya') return scKavya(parent, o);
  const S = o.s, M = o.mood;
  const sw = w => ({ stroke: pioDk, 'stroke-width': w, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' });

  if (kind === 'nigel') {
    return scMake(parent, { s: S, mood: M || 'deadpan', seed: 2, bob: 3,
      draw: g => {
        const r = 84, d = 56, h = Math.sqrt(r * r - d * d);
        const body = `M0,${-h} A${r},${r} 0 1 0 0,${h} A${r},${r} 0 1 0 0,${-h} Z`;
        E('path', Object.assign({ d: body, fill: ball('#7FA6FF', '#2F56C2') }, sw(6)), g);
        E('path', { d: `M-8,${-h + 4} Q0,${-h + 16} 8,${-h + 4} M-8,${h - 4} Q0,${h - 16} 8,${h - 4}`, fill: 'none', stroke: '#2F56C2', 'stroke-width': 4, opacity: 0.6 }, g);   // the waist where the atoms join
        T(g, -d - 4, 72, 'N', { size: 30, weight: 800, anchor: 'middle', fill: '#DDE7FF' });
        T(g, d + 4, 72, 'N', { size: 30, weight: 800, anchor: 'middle', fill: '#DDE7FF' });
        // courier cap
        const cap = G(g); tr(cap, 0, -76, 1, -4);
        E('path', Object.assign({ d: 'M-62,6 Q-60,-50 0,-52 Q60,-50 62,6 Z', fill: '#24366E' }, sw(4)), cap);
        E('path', Object.assign({ d: 'M-70,4 Q0,-6 96,8 Q104,16 94,22 Q0,10 -70,18 Z', fill: '#1A2852' }, sw(4)), cap);
        E('circle', { cx: 0, cy: -24, r: 15, fill: '#FFD23F', stroke: pioDk, 'stroke-width': 3 }, cap);
        E('path', { d: 'M-4,-32 Q2,-24 -4,-16 M3,-36 Q12,-24 3,-12', fill: 'none', stroke: pioDk, 'stroke-width': 3, 'stroke-linecap': 'round' }, cap);
      },
      face: { x: 0, y: 2, eye: 18, gap: 60, mouthW: 46, mouthY: 36, lidCol: '#6F95F0' },
      sweat: [[-118, -30], [122, -20]] });
  }

  if (kind === 'archie') {
    let inner = null;
    return scMake(parent, { s: S, mood: M || 'happy', seed: 4, bob: 6,
      draw: g => {
        inner = G(g);
        E('path', Object.assign({ d: 'M-40,-64 L-30,-104 L-12,-72 L0,-112 L14,-72 L34,-100 L40,-62 Z', fill: '#17877A' }, sw(4)), inner);   // fringe
        E('circle', Object.assign({ r: 80, fill: ball('#4FE3D0', '#17877A') }, sw(6)), inner);
        // lanyard and badge
        const badge = G(inner); tr(badge, 44, 62, 1, -12);   // clip-on badge
        E('rect', Object.assign({ x: -8, y: -24, width: 16, height: 12, rx: 3, fill: '#C9D3DC' }, sw(2.5)), badge);
        E('rect', Object.assign({ x: -38, y: -14, width: 76, height: 36, rx: 6, fill: '#FFE45C' }, sw(3)), badge);
        T(badge, 0, 10, 'TRAINEE', { size: 16, weight: 800, anchor: 'middle', fill: pioDk });
        T(inner, -58, 14, 'Ar', { size: 22, weight: 800, anchor: 'middle', fill: '#D9FFF9', opacity: 0.9 });
      },
      face: { x: 0, y: -12, eye: 21, gap: 58, mouthW: 44, mouthY: 34, lidCol: '#3CC9B7' },
      sweat: [[-92, -30], [94, -24]],
      upd: (t, g, st) => { const b = st.bounce || 0; tr(inner, 0, -Math.abs(Math.sin(t * 9)) * 22 * b); } });
  }

  if (kind === 'belle') {
    let ham = null, arcs = null;
    return scMake(parent, { s: S, mood: M || 'sad', seed: 6, bob: 1,
      draw: g => {
        E('rect', Object.assign({ x: -16, y: -126, width: 32, height: 46, rx: 4, fill: '#6B6F7A' }, sw(4)), g);   // bracket to the wall
        E('rect', Object.assign({ x: -46, y: -134, width: 92, height: 18, rx: 5, fill: '#8A8F9A' }, sw(4)), g);
        E('path', Object.assign({ d: 'M-100,64 Q-104,-86 0,-88 Q104,-86 100,64 Z', fill: ball('#FF6A5E', '#B0262E') }, sw(6)), g);   // gong dome
        E('path', Object.assign({ d: 'M-112,60 L112,60 Q114,80 100,82 L-100,82 Q-114,80 -112,60 Z', fill: '#C93A3A' }, sw(5)), g);   // rim
        E('ellipse', { cx: -48, cy: -46, rx: 22, ry: 34, fill: '#FFFFFF', opacity: 0.22, transform: 'rotate(18 -48 -46)' }, g);
        ham = G(g); tr(ham, 128, -40);
        E('line', { x1: 0, y1: 0, x2: -8, y2: 90, stroke: pioDk, 'stroke-width': 12, 'stroke-linecap': 'round' }, ham);
        E('line', { x1: 0, y1: 0, x2: -8, y2: 90, stroke: '#9AA0AB', 'stroke-width': 6, 'stroke-linecap': 'round' }, ham);
        E('circle', Object.assign({ cx: -8, cy: 98, r: 18, fill: '#4A4F5A' }, sw(4)), ham);
        E('circle', Object.assign({ cx: 0, cy: 0, r: 9, fill: '#8A8F9A' }, sw(3)), ham);
        arcs = G(g);
        [-1, 1].forEach(sd => [0, 1, 2].forEach(i => E('path', { d: `M${sd * (130 + i * 22)},-40 Q${sd * (146 + i * 22)},0 ${sd * (130 + i * 22)},40`, fill: 'none', stroke: '#FFE45C', 'stroke-width': 6, 'stroke-linecap': 'round' }, arcs)));
      },
      face: { x: 0, y: -10, eye: 18, gap: 60, mouthW: 44, mouthY: 38, lidCol: '#E2463F' },
      upd: (t, g, st) => {
        const r = st.ring || 0;
        tr(ham, 128, -40, 1, r ? -6 - 12 * Math.abs(Math.sin(t * 40)) * r : 0);
        op(arcs, r * (0.6 + 0.4 * Math.abs(Math.sin(t * 20))));
        if (r) tr(g, Math.sin(t * 90) * 2 * r, 0);
      } });
  }

  if (kind === 'freq') {
    let inner = null;
    return scMake(parent, { s: S, mood: M || 'happy', seed: 9, bob: 5,
      draw: g => {
        inner = G(g);
        let sp = 'M0,-96';   // coiled spring antenna
        for (let i = 1; i <= 8; i++) sp += ` L${i % 2 ? 12 : -12},${-96 - i * 6}`;
        E('path', { d: sp, fill: 'none', stroke: pioDk, 'stroke-width': 4, 'stroke-linejoin': 'round' }, inner);
        E('circle', Object.assign({ cx: 0, cy: -150, r: 11, fill: '#FFE45C' }, sw(3)), inner);
        E('rect', Object.assign({ x: -70, y: -100, width: 140, height: 200, rx: 66, fill: ball('#B6F06A', '#4E9A1E') }, sw(6)), inner);
        let zz = 'M-62,52';
        for (let i = 1; i <= 16; i++) zz += ` L${-62 + i * 7.75},${52 + (i % 2 ? -14 : 14)}`;
        E('path', { d: zz, fill: 'none', stroke: '#2E6E12', 'stroke-width': 5, 'stroke-linejoin': 'round' }, inner);
        E('ellipse', { cx: -36, cy: 12, rx: 11, ry: 7, fill: '#FF8FB0', opacity: 0.6 }, inner);
        E('ellipse', { cx: 36, cy: 12, rx: 11, ry: 7, fill: '#FF8FB0', opacity: 0.6 }, inner);
      },
      face: { x: 0, y: -30, eye: 19, gap: 52, mouthW: 38, mouthY: 32, lidCol: '#9BDD55' },
      sweat: [[-80, -60], [82, -50]],
      upd: (t, g, st) => { const b = st.buzz || 0; tr(inner, b ? Math.sin(t * 140) * 2.2 * b : 0, 0); } });
  }

  if (kind === 'amp') {
    let inner = null;
    return scMake(parent, { s: S, mood: M || 'neutral', seed: 12, bob: 2,
      draw: g => {
        inner = G(g);
        E('path', Object.assign({ d: 'M-150,100 C-110,100 -90,-120 0,-120 C90,-120 110,100 150,100 Z', fill: ball('#FF9A6C', '#C2502A') }, sw(6)), inner);
        // the amplitude arrow on his front
        E('path', { d: 'M0,38 L0,92 M-10,50 L0,38 L10,50 M-10,80 L0,92 L10,80', fill: 'none', stroke: '#FFE1CF', 'stroke-width': 5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, inner);
        E('line', { x1: -40, y1: 96, x2: 40, y2: 96, stroke: '#FFE1CF', 'stroke-width': 4, 'stroke-dasharray': '8 6' }, inner);
      },
      face: { x: 0, y: -44, eye: 19, gap: 62, mouthW: 64, mouthY: 40, lidCol: '#F07C4E' },
      upd: (t, g, st) => { const k = st.big || 0; inner.setAttribute('transform', `translate(0 ${(100 - 100 * (1 + 0.25 * k)).toFixed(1)}) scale(1 ${(1 + 0.25 * k).toFixed(3)})`); } });
  }

  if (kind === 'coco') {
    return scMake(parent, { s: S, mood: M || 'neutral', seed: 15, bob: 3,
      draw: g => {
        E('path', Object.assign({ d: 'M-60,70 Q-120,96 -150,60 Q-160,40 -134,40 Q-110,54 -76,40 Z', fill: ball('#F9C3D1', '#B8577A') }, sw(5)), g);   // the tube's base
        E('circle', Object.assign({ r: 94, fill: ball('#F9C3D1', '#B8577A') }, sw(6)), g);
        let sp = '', n = 70;
        for (let i = 0; i <= n; i++) { const a = i / n * TAU * 2.4, rr = 88 * (1 - i / n * 0.86); sp += (i ? 'L' : 'M') + (Math.cos(a + 1.2) * rr).toFixed(1) + ',' + (Math.sin(a + 1.2) * rr).toFixed(1); }
        E('path', { d: sp, fill: 'none', stroke: '#C0607F', 'stroke-width': 5, opacity: 0.55, 'stroke-linecap': 'round' }, g);
        E('ellipse', { cx: 0, cy: 6, rx: 70, ry: 52, fill: '#FDE3EA', opacity: 0.92 }, g);   // face patch
        // headset
        E('path', { d: 'M-90,-14 Q-92,-112 0,-112 Q92,-112 90,-14', fill: 'none', stroke: pioDk, 'stroke-width': 7, 'stroke-linecap': 'round' }, g);
        E('rect', Object.assign({ x: -104, y: -30, width: 26, height: 42, rx: 9, fill: '#3B3F48' }, sw(3)), g);
        E('rect', Object.assign({ x: 78, y: -30, width: 26, height: 42, rx: 9, fill: '#3B3F48' }, sw(3)), g);
        E('path', { d: 'M92,10 Q88,52 40,56', fill: 'none', stroke: pioDk, 'stroke-width': 5, 'stroke-linecap': 'round' }, g);
        E('circle', { cx: 36, cy: 56, r: 7, fill: '#3B3F48' }, g);
      },
      face: { x: 0, y: -6, eye: 16, gap: 48, mouthW: 34, mouthY: 30, lidCol: '#F4AFC2' } });
  }

  if (kind === 'echo') {
    let ghosts = [];
    return scMake(parent, { s: S, mood: M || 'deadpan', seed: 18, bob: 0,
      draw: g => {
        const wall = 'M-90,-110 L90,-110 L90,110 L-90,110 Z';
        ghosts = [1, 2].map(i => E('path', { d: wall, fill: 'none', stroke: '#C9C2E6', 'stroke-width': 5, 'stroke-dasharray': '14 10' }, g));
        E('path', Object.assign({ d: wall, fill: '#E7E2F3' }, sw(6)), g);
        let grout = '';
        for (let x = -60; x < 90; x += 30) grout += `M${x},-110 L${x},110 `;
        for (let y = -80; y < 110; y += 30) grout += `M-90,${y} L90,${y} `;
        E('path', { d: grout, stroke: '#BDB4D9', 'stroke-width': 3 }, g);
        E('ellipse', { cx: 0, cy: 4, rx: 70, ry: 54, fill: '#F4F1FA', opacity: 0.85 }, g);
      },
      face: { x: 0, y: -2, eye: 17, gap: 54, mouthW: 34, mouthY: 32, lidCol: '#D9D2EE', brow: false },
      upd: (t, g, st) => {
        const k = st.ghost || 0;
        ghosts.forEach((p, i) => { const f = ((t * 0.9 + i * 0.5) % 1); op(p, k * (1 - f) * 0.9); tr(p, 20 + f * 60 + i * 10, 0, 1 + f * 0.12); });
      } });
  }
  throw new Error('cast: unknown kind ' + kind);
}

/* ---------------- confessionals ---------------- */
const PIO_TINT = {
  nigel: ['#13233F', '#24467A'], archie: ['#0E2E2B', '#1A5A53'], belle: ['#3A1414', '#6E2323'], freq: ['#1C320F', '#38611E'],
  amp: ['#3A1C10', '#6B3418'], coco: ['#3A1828', '#6B2E4A'], echo: ['#221C33', '#453A64'], kavya: ['#14243A', '#25446B'],
};
function pioConf(parent, kind) { const [a, b] = PIO_TINT[kind] || PIO_TINT.nigel; return scConfessional(parent, a, b); }

/* ---------------- sets ---------------- */
function pioHall(parent) {
  const g = G(parent);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#F1E9CF', '#DCCFA6', true) }, g);
  E('rect', { x: 0, y: 0, width: 1200, height: 64, fill: '#CBBF97' }, g);   // ceiling beam
  // louvred windows along the wall
  for (let i = 0; i < 4; i++) {
    const x = 470 + i * 120;
    E('rect', { x, y: 110, width: 92, height: 170, rx: 4, fill: '#9FD3F0', stroke: '#8C7F5A', 'stroke-width': 5 }, g);
    let lv = ''; for (let y = 124; y < 280; y += 16) lv += `M${x + 4},${y} L${x + 88},${y + 6} `;
    E('path', { d: lv, stroke: '#E8F6FF', 'stroke-width': 4, opacity: 0.85 }, g);
  }
  // stage with maroon curtains (left)
  E('rect', { x: 0, y: 96, width: 430, height: 330, fill: '#3A1D1D' }, g);
  E('path', { d: 'M0,96 L150,96 Q130,250 160,426 L0,426 Z', fill: '#8E2A33', stroke: '#5E1820', 'stroke-width': 4 }, g);
  E('path', { d: 'M430,96 L290,96 Q312,250 280,426 L430,426 Z', fill: '#8E2A33', stroke: '#5E1820', 'stroke-width': 4 }, g);
  E('path', { d: 'M0,96 L430,96 L430,130 Q215,160 0,130 Z', fill: '#A8343F', stroke: '#5E1820', 'stroke-width': 4 }, g);
  E('rect', { x: 0, y: 426, width: 440, height: 40, fill: '#8A5A33', stroke: '#5A3A1F', 'stroke-width': 4 }, g);
  // banner
  E('rect', { x: 60, y: 168, width: 310, height: 64, rx: 8, fill: '#FFFFFF', stroke: '#2E7DD8', 'stroke-width': 4 }, g);
  T(g, 215, 210, 'SCHOOL BAND · SPEECH DAY', { size: 22, weight: 800, anchor: 'middle', fill: '#2E7DD8' });
  // the tiled back wall (Echo's)
  E('rect', { x: 960, y: 96, width: 240, height: 370, fill: '#E7E2F3' }, g);
  let gr = ''; for (let x = 990; x < 1200; x += 30) gr += `M${x},96 L${x},466 `; for (let y = 126; y < 466; y += 30) gr += `M960,${y} L1200,${y} `;
  E('path', { d: gr, stroke: '#C9C2E0', 'stroke-width': 3 }, g);
  g.wall = [1080, 280];
  // floor
  E('rect', { x: 0, y: 466, width: 1200, height: 284, fill: linGrad('#C99A5E', '#9A6B38', true) }, g);
  let pq = ''; for (let x = -200; x < 1400; x += 60) pq += `M${x},466 L${x - 140},750 `;
  E('path', { d: pq, stroke: '#8A5D2E', 'stroke-width': 3, opacity: 0.5 }, g);
  // ceiling fans
  const fans = [300, 860].map(x => {
    const f = G(g); tr(f, x, 70);
    E('line', { x1: 0, y1: -10, x2: 0, y2: 0, stroke: '#5A5040', 'stroke-width': 6 }, f);
    const bl = G(f);
    for (let i = 0; i < 3; i++) E('ellipse', { cx: 70, cy: 0, rx: 70, ry: 9, fill: '#F7F2E2', stroke: '#8C7F5A', 'stroke-width': 3, transform: `rotate(${i * 120})` }, bl);
    E('circle', { r: 13, fill: '#8C7F5A' }, f);
    return bl;
  });
  g.upd = t => fans.forEach((b, i) => b.setAttribute('transform', `scale(1 0.28) rotate(${((t * 260 + i * 40) % 360).toFixed(1)})`));
  g.upd(0);
  return g;
}

function pioAir(parent) {
  const g = G(parent);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#0E2A44', '#1D4C70', true) }, g);
  const r = rng(311), dots = [];
  for (let i = 0; i < 26; i++) dots.push({ el: E('circle', { r: 18 + r() * 40, fill: glow('#9FD8FF'), opacity: 0.18 + r() * 0.25 }, g), x: r() * 1200, y: r() * 750, v: 4 + r() * 10, a: r() * TAU });
  g.upd = t => dots.forEach(d => tr(d.el, (d.x + Math.sin(t * 0.3 + d.a) * 30 + t * d.v) % 1260 - 30, d.y + Math.cos(t * 0.4 + d.a) * 20));
  g.upd(0);
  return g;
}

function pioLab(parent) {
  const g = G(parent);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#CFE8DA', '#A9D2BC', true) }, g);
  let gr = ''; for (let x = 0; x < 1200; x += 40) gr += `M${x},0 L${x},560 `; for (let y = 40; y < 560; y += 40) gr += `M0,${y} L1200,${y} `;
  E('path', { d: gr, stroke: '#B7D9C6', 'stroke-width': 2 }, g);
  E('rect', { x: 820, y: 110, width: 280, height: 200, rx: 6, fill: '#BFE6FA', stroke: '#6E8A7A', 'stroke-width': 6 }, g);
  E('line', { x1: 960, y1: 110, x2: 960, y2: 310, stroke: '#6E8A7A', 'stroke-width': 6 }, g);
  const pt = G(g); tr(pt, 90, 120);   // a periodic-table poster
  E('rect', { x: 0, y: 0, width: 250, height: 150, rx: 6, fill: '#FFFFFF', stroke: '#6E8A7A', 'stroke-width': 4 }, pt);
  const cols = ['#FF9AA2', '#FFD38A', '#9AD9FF', '#B9F0A8'];
  for (let rr = 0; rr < 5; rr++) for (let c = 0; c < 12; c++) { if (rr < 2 && c > 1 && c < 10) continue; E('rect', { x: 12 + c * 19, y: 28 + rr * 22, width: 16, height: 18, fill: cols[(c + rr) % 4] }, pt); }
  T(pt, 125, 20, 'PERIODIC TABLE', { size: 14, weight: 800, anchor: 'middle', fill: '#3A4A40' });
  E('rect', { x: 0, y: 560, width: 1200, height: 190, fill: '#3D4A52' }, g);
  E('rect', { x: 0, y: 552, width: 1200, height: 20, fill: '#2B353B' }, g);
  g.bench = 560;
  return g;
}

function pioStorm(parent) {
  const g = G(parent);
  const sky = E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#24303F', '#45525F', true) }, g);
  const flashR = E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#E6F0FF', opacity: 0 }, g);
  const blocks = [[60, 260, 170], [270, 200, 150], [450, 300, 190], [680, 230, 160], [880, 280, 200], [1090, 210, 140]];
  blocks.forEach(([x, top, w], i) => {
    E('rect', { x, y: top, width: w, height: 750 - top, fill: i % 2 ? '#7E8C99' : '#8E9AA6', stroke: '#4E5A66', 'stroke-width': 4 }, g);
    let win = ''; for (let y = top + 24; y < 720; y += 34) for (let xx = x + 16; xx < x + w - 20; xx += 30) win += `M${xx},${y} h16 v14 h-16 Z `;
    E('path', { d: win, fill: '#FFE7A3', opacity: 0.55 }, g);
  });
  const boltG = G(g); tr(boltG, 760, 70);
  E('path', { d: 'M0,0 L-40,120 L-6,118 L-50,250 L40,90 L4,92 L36,0 Z', fill: '#FFF7C2', stroke: '#FFE45C', 'stroke-width': 5, 'stroke-linejoin': 'round' }, boltG);
  E('path', { d: 'M-80,-40 Q-200,-90 -60,-110 Q40,-160 140,-100 Q260,-110 220,-30 Z', fill: '#1A222C', opacity: 0.9 }, boltG);
  const rain = E('path', { d: '', stroke: '#BFD7EE', 'stroke-width': 3, opacity: 0.6, 'stroke-linecap': 'round' }, g);
  // window frame
  E('path', { d: 'M0,0 H1200 V750 H0 Z M50,50 V700 H1150 V50 Z', fill: '#E9E2D0', 'fill-rule': 'evenodd', stroke: '#9C927C', 'stroke-width': 4 }, g);
  E('rect', { x: 592, y: 50, width: 16, height: 650, fill: '#E9E2D0', stroke: '#9C927C', 'stroke-width': 3 }, g);
  const rr = rng(5), drops = []; for (let i = 0; i < 70; i++) drops.push([rr() * 1200, rr() * 750, 0.8 + rr() * 0.6]);
  g.set = st => {
    const t = st.t || 0, f = st.flash || 0, rn = st.rain === undefined ? 1 : st.rain;
    op(flashR, f * 0.7); op(boltG, f);
    let d = ''; if (rn > 0) drops.forEach(([x, y, v]) => { const yy = (y + t * 900 * v) % 800 - 40; d += `M${(x - yy * 0.12).toFixed(0)},${yy.toFixed(0)} l-6,34 `; });
    attr(rain, 'd', d); op(rain, rn * 0.6);
  };
  g.set({ t: 0 });
  return g;
}

function pioSea(parent) {
  const g = G(parent);
  E('rect', { x: 0, y: 0, width: 1200, height: 260, fill: linGrad('#7CC8F2', '#CDEBFA', true) }, g);
  E('rect', { x: 0, y: 250, width: 1200, height: 500, fill: linGrad('#1F6FA8', '#0A2A4A', true) }, g);
  E('path', { d: 'M0,690 Q150,660 300,690 T600,686 T900,694 T1200,684 L1200,750 L0,750 Z', fill: '#7A6448', stroke: '#4E3E2A', 'stroke-width': 4 }, g);
  const ship = G(g); tr(ship, 300, 236);
  E('path', { d: 'M-120,-10 L120,-10 L96,30 L-100,30 Z', fill: '#E8424F', stroke: pioDk, 'stroke-width': 4, 'stroke-linejoin': 'round' }, ship);
  E('rect', { x: -60, y: -56, width: 90, height: 46, rx: 6, fill: '#FFFFFF', stroke: pioDk, 'stroke-width': 4 }, ship);
  E('rect', { x: 0, y: -84, width: 18, height: 30, fill: '#3B3F48', stroke: pioDk, 'stroke-width': 3 }, ship);
  for (let i = 0; i < 3; i++) E('circle', { cx: -42 + i * 26, cy: -34, r: 7, fill: '#9FD3F0', stroke: pioDk, 'stroke-width': 2 }, ship);
  E('path', { d: 'M0,250 Q300,240 600,252 T1200,248', fill: 'none', stroke: '#BFE6FA', 'stroke-width': 5, opacity: 0.8 }, g);
  const down = G(g), up = G(g);
  [0, 1, 2].forEach(i => { E('path', { d: `M${-60 + i * 0},0 Q0,${30 + i * 0} 60,0`, fill: 'none', stroke: '#FFE45C', 'stroke-width': 6 - i * 1.5, 'stroke-linecap': 'round' }, down); });
  [0, 1, 2].forEach(i => { E('path', { d: `M-60,0 Q0,-30 60,0`, fill: 'none', stroke: '#9AF0C8', 'stroke-width': 6 - i * 1.5, 'stroke-linecap': 'round' }, up); });
  g.ship = [300, 236]; g.bed = 690;
  g.set = st => {
    const p = st.p || 0, y0 = 270, y1 = 680;
    if (p > 0 && p <= 1) { op(down, 1); [...down.children].forEach((c, i) => tr(c, 300, lerp(y0, y1, clamp(p - i * 0.05)), 1 + p * 0.6)); } else op(down, 0);
    if (p > 1 && p < 2) { op(up, 1); [...up.children].forEach((c, i) => tr(c, 300, lerp(y1, y0, clamp(p - 1 - i * 0.05)), 1.6 - (p - 1) * 0.4)); } else op(up, 0);
  };
  g.set({ p: 0 });
  return g;
}

/* ---------------- props ---------------- */
function pioTriangle(parent, s) {
  const g = G(parent); tr(g, 0, 0, s || 1);
  const body = G(g);
  E('line', { x1: 0, y1: -110, x2: 0, y2: -66, stroke: '#9AA6B2', 'stroke-width': 3 }, body);   // string
  E('path', { d: 'M-8,-62 L-66,52 L66,52 L12,-58', fill: 'none', stroke: '#C7D2DC', 'stroke-width': 9, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, body);
  E('path', { d: 'M-8,-62 L-66,52 L66,52 L12,-58', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 3, opacity: 0.6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, body);
  const lines = G(g);
  [-1, 1].forEach(sd => [0, 1].forEach(i => E('path', { d: `M${sd * (84 + i * 20)},-30 Q${sd * (98 + i * 20)},10 ${sd * (84 + i * 20)},50`, fill: 'none', stroke: '#FFE45C', 'stroke-width': 5, 'stroke-linecap': 'round' }, lines)));
  const beater = G(g);
  E('line', { x1: 0, y1: 0, x2: 110, y2: 40, stroke: '#9AA6B2', 'stroke-width': 6, 'stroke-linecap': 'round' }, beater);
  const hand = G(g);
  E('ellipse', { cx: 0, cy: 0, rx: 26, ry: 20, fill: '#B9784E', stroke: pioDk, 'stroke-width': 3 }, hand);
  E('path', { d: 'M-14,-8 Q-4,-14 6,-8 M-16,2 Q-4,-4 8,2', fill: 'none', stroke: pioDk, 'stroke-width': 2.5 }, hand);
  tr(hand, -58, 40);
  g.beater = beater; g.hand = hand;
  g.set = st => {
    st = st || {};
    const t = st.t || 0, r = st.held ? 0 : (st.ring || 0), h = st.hit || 0;
    tr(body, Math.sin(t * 95) * 2.2 * r, 0, 1, Math.sin(t * 7) * 1.5 * r);
    op(lines, r * (0.55 + 0.45 * Math.abs(Math.sin(t * 24))));
    op(beater, st.beater === false ? 0 : 1); tr(beater, lerp(76, 40, h), lerp(-10, 6, h), 1, lerp(-30, -14, h));
    op(hand, st.held ? 1 : 0);
  };
  g.set({});
  return g;
}

function pioRow(parent, o) {
  o = o || {};
  const g = G(parent), w = o.w || 900, h = o.h || 220, cols = o.cols || 28, rows = o.rows || 5, r = o.r || 9;
  const dx = w / cols, dy = h / (rows - 1 || 1), ps = [], rr = rng(o.seed || 23);
  for (let c = 0; c < cols; c++) for (let k = 0; k < rows; k++) {
    const el = E('circle', { r, fill: ball(o.color || '#8FB8FF', o.dark || '#2F56C2') }, g);
    ps.push({ el, c, x0: (c + 0.5) * dx, y: k * dy + (rr() - 0.5) * dy * 0.3, ph: rr() * TAU, mid: k === Math.floor(rows / 2) });
  }
  const ringEl = E('circle', { r: r + 7, fill: 'none', stroke: '#FF4D5E', 'stroke-width': 4 }, g);
  const disp = (x0, t, amp, wl, f) => amp * Math.sin(TAU * (x0 / wl - f * t));
  g.set = st => {
    const t = st.t || 0, amp = st.amp === undefined ? 14 : st.amp, wl = st.wl || 240, f = st.f || 0.8, front = st.front === undefined ? 1e9 : st.front;
    let hiP = null;
    ps.forEach(p => {
      const live = p.x0 < front ? clamp((front - p.x0) / (wl * 0.3)) : 0;
      // a longitudinal wave: each particle is displaced along x; compressions where the displacement field converges
      const x = p.x0 - disp(p.x0, t, amp, wl, f) * live + Math.sin(t * 2 + p.ph) * 1.2;
      attr(p.el, 'cx', x); attr(p.el, 'cy', p.y + Math.cos(t * 1.7 + p.ph) * 1.2);
      if (st.hi !== undefined && p.c === st.hi && p.mid) hiP = [x, p.y];
    });
    if (hiP) { op(ringEl, 1); attr(ringEl, 'cx', hiP[0]); attr(ringEl, 'cy', hiP[1]); } else op(ringEl, 0);
  };
  // x of compressions: where -d(disp)/dx is largest: displacement field s(x) = -amp sin(2pi(x/wl - f t)) -> density max where cos(...) = 1
  g.compAt = (t, wl, f) => { const out = []; for (let n = -2; n < w / wl + 2; n++) { const x = (n + f * t) * wl; if (x >= 0 && x <= w) out.push(x); } return out; };
  g.set({ t: 0 });
  return g;
}

function pioJar(parent) {
  const g = G(parent);
  // pump on the left
  const pump = G(g); tr(pump, -330, 120);
  E('rect', { x: -90, y: -70, width: 180, height: 130, rx: 14, fill: '#5A6B7A', stroke: pioDk, 'stroke-width': 5 }, pump);
  E('circle', { cx: -30, cy: -10, r: 30, fill: '#FFFFFF', stroke: pioDk, 'stroke-width': 4 }, pump);
  g.dial = E('line', { x1: -30, y1: -10, x2: -30, y2: -34, stroke: '#E8424F', 'stroke-width': 4, 'stroke-linecap': 'round' }, pump);
  T(pump, 40, -6, 'VACUUM', { size: 20, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  T(pump, 40, 18, 'PUMP', { size: 20, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  E('path', { d: 'M-240,140 Q-200,190 -120,176 L-40,176', fill: 'none', stroke: '#3B3F48', 'stroke-width': 14, 'stroke-linecap': 'round' }, g);
  // base plate
  E('rect', { x: -200, y: 160, width: 400, height: 36, rx: 8, fill: '#8A8F9A', stroke: pioDk, 'stroke-width': 5 }, g);
  const outArcs = G(g);
  [-1, 1].forEach(sd => [0, 1, 2].forEach(i => E('path', { d: `M${sd * (210 + i * 30)},-90 Q${sd * (234 + i * 30)},-20 ${sd * (210 + i * 30)},50`, fill: 'none', stroke: '#FFE45C', 'stroke-width': 6, 'stroke-linecap': 'round' }, outArcs)));
  g.inside = G(g);
  const parts = G(g), rr = rng(41), dots = [];
  for (let i = 0; i < 26; i++) dots.push({ el: E('circle', { r: 7, fill: ball('#8FB8FF', '#2F56C2') }, parts), x: (rr() - 0.5) * 300, y: -230 + rr() * 380, vx: (rr() - 0.5) * 90, vy: (rr() - 0.5) * 90, k: i / 26 });
  // the glass dome (drawn over the inside)
  const dome = 'M-170,160 L-170,-140 Q-170,-260 0,-262 Q170,-260 170,-140 L170,160';
  E('path', { d: dome, fill: 'rgba(200,230,250,0.12)', stroke: '#CFE7F5', 'stroke-width': 6 }, g);
  E('path', { d: 'M-140,120 L-140,-130 Q-138,-220 -60,-236', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 6, opacity: 0.35, 'stroke-linecap': 'round' }, g);
  E('rect', { x: -24, y: -290, width: 48, height: 30, rx: 8, fill: '#CFE7F5', stroke: '#8FB2C8', 'stroke-width': 3 }, g);
  const bounce = (u, a, b) => { const L = b - a, m = ((u - a) % (2 * L) + 2 * L) % (2 * L); return a + (m < L ? m : 2 * L - m); };
  g.set = st => {
    const t = st.t || 0, air = st.air === undefined ? 1 : st.air, ring = st.ring || 0;
    dots.forEach(d => { op(d.el, d.k < air ? 1 : 0); attr(d.el, 'cx', bounce(d.x + d.vx * t, -150, 150)); attr(d.el, 'cy', bounce(d.y + d.vy * t, -240, 140)); });
    op(outArcs, ring * air * (0.55 + 0.45 * Math.abs(Math.sin(t * 18))));
    tr(g.dial, 0, 0, 1, 0); g.dial.setAttribute('transform', `rotate(${(-200 * (1 - air)).toFixed(1)} -30 -10)`);
  };
  g.set({});
  return g;
}

function pioScope(parent, w, h) {
  w = w || 480; h = h || 300;
  const g = G(parent);
  E('rect', { x: -w / 2 - 30, y: -h / 2 - 30, width: w + 150, height: h + 90, rx: 22, fill: '#3B4650', stroke: pioDk, 'stroke-width': 5 }, g);
  E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: 10, fill: '#0B2A1A', stroke: '#1E4D33', 'stroke-width': 4 }, g);
  let gr = ''; for (let i = 1; i < 8; i++) gr += `M${-w / 2 + i * w / 8},${-h / 2} V${h / 2} `; for (let i = 1; i < 6; i++) gr += `M${-w / 2},${-h / 2 + i * h / 6} H${w / 2} `;
  E('path', { d: gr, stroke: '#1F5A3A', 'stroke-width': 2 }, g);
  E('line', { x1: -w / 2, y1: 0, x2: w / 2, y2: 0, stroke: '#2F7A50', 'stroke-width': 3 }, g);
  [[w / 2 + 60, -h / 4], [w / 2 + 60, h / 4]].forEach(([x, y]) => { E('circle', { cx: x, cy: y, r: 24, fill: '#8A8F9A', stroke: pioDk, 'stroke-width': 4 }, g); E('line', { x1: x, y1: y, x2: x + 12, y2: y - 16, stroke: pioDk, 'stroke-width': 4 }, g); });
  T(g, 0, h / 2 + 46, 'OSCILLOSCOPE', { size: 24, weight: 800, anchor: 'middle', fill: '#C9D3DC' });
  const id = 'pioscope' + (++pioUid);
  const cp = E('clipPath', { id }, defs()); E('rect', { x: -w / 2, y: -h / 2, width: w, height: h }, cp);
  g.screen = G(g, { 'clip-path': `url(#${id})` });
  const path = E('path', { fill: 'none', stroke: '#6CFF9E', 'stroke-width': 5, 'stroke-linejoin': 'round' }, g.screen);
  g.trace = st => {
    st = st || {};
    const amp = st.amp === undefined ? 60 : st.amp, wl = st.wl || 120, ph = st.phase || 0;
    let d = ''; for (let x = -w / 2; x <= w / 2; x += 3) d += (x === -w / 2 ? 'M' : 'L') + x.toFixed(0) + ',' + (-amp * Math.sin(TAU * ((x + w / 2) / wl - ph))).toFixed(1);
    attr(path, 'd', d); if (st.color) attr(path, 'stroke', st.color);
  };
  g.trace({});
  return g;
}

function pioEar(parent) {
  const g = G(parent), parts = {}, halos = {};
  const part = (name, cx, cy, rx, ry) => { halos[name] = E('ellipse', { cx, cy, rx, ry, fill: glow('#FFE45C'), opacity: 0 }, g); parts[name] = G(g); return parts[name]; };
  // skin / skull block behind
  E('path', { d: 'M150,40 Q560,-10 1000,40 L1000,480 L150,480 Z', fill: '#E7B48C', opacity: 0.35 }, g);
  // pinna
  const pin = part('pinna', 110, 240, 120, 210);
  E('path', { d: 'M170,70 Q40,60 40,210 Q40,330 120,420 Q160,450 180,400 Q150,330 160,300 L190,260 L190,180 Q170,120 170,70 Z', fill: '#D8996C', stroke: pioDk, 'stroke-width': 5, 'stroke-linejoin': 'round' }, pin);
  E('path', { d: 'M150,110 Q80,120 82,220 Q86,300 130,360', fill: 'none', stroke: '#A8683F', 'stroke-width': 5, 'stroke-linecap': 'round' }, pin);
  // ear canal
  const can = part('canal', 300, 240, 140, 70);
  E('path', { d: 'M180,206 L420,214 L420,266 L180,274 Z', fill: '#F3C9A6', stroke: pioDk, 'stroke-width': 5, 'stroke-linejoin': 'round' }, can);
  // ear drum
  const drm = part('drum', 428, 240, 40, 80);
  g.drumEl = E('path', { d: 'M424,196 Q440,240 424,284', fill: 'none', stroke: '#E8424F', 'stroke-width': 8, 'stroke-linecap': 'round' }, drm);
  // three bones
  const bon = part('bones', 500, 230, 80, 60);
  E('path', { d: 'M432,226 Q452,200 476,206 Q488,214 474,232 Q458,248 440,244 Z', fill: '#FFF6E0', stroke: pioDk, 'stroke-width': 4 }, bon);
  E('path', { d: 'M474,212 Q500,196 520,214 Q512,236 492,240 Z', fill: '#FFF6E0', stroke: pioDk, 'stroke-width': 4 }, bon);
  E('path', { d: 'M516,220 L548,214 L560,232 L548,250 L520,244 M536,216 L536,248', fill: '#FFF6E0', stroke: pioDk, 'stroke-width': 4, 'stroke-linejoin': 'round' }, bon);
  // cochlea
  const coc = part('cochlea', 640, 240, 100, 100);
  let sp = '', n = 80;
  for (let i = 0; i <= n; i++) { const a = i / n * TAU * 2.5, rr = 72 * (1 - i / n * 0.85); sp += (i ? 'L' : 'M') + (640 + Math.cos(a + Math.PI) * rr).toFixed(1) + ',' + (240 + Math.sin(a + Math.PI) * rr).toFixed(1); }
  E('circle', { cx: 640, cy: 240, r: 78, fill: '#F9C3D1', stroke: pioDk, 'stroke-width': 5 }, coc);
  E('path', { d: sp, fill: 'none', stroke: '#B8577A', 'stroke-width': 6, 'stroke-linecap': 'round' }, coc);
  // nerve to brain
  const nrv = part('nerve', 850, 220, 160, 80);
  E('path', { d: 'M712,214 Q800,150 960,170', fill: 'none', stroke: '#FFD23F', 'stroke-width': 10, 'stroke-linecap': 'round' }, nrv);
  E('path', { d: 'M712,214 Q800,150 960,170', fill: 'none', stroke: pioDk, 'stroke-width': 2, 'stroke-dasharray': '10 12' }, nrv);
  T(nrv, 966, 140, 'to the brain →', { size: 24, weight: 700, anchor: 'end', fill: '#7A4B12' });
  g.at = { pinna: [80, 240], canal: [300, 240], drum: [428, 240], bones: [500, 220], cochlea: [640, 240], nerve: [860, 168] };
  g.hi = (name, p) => op(halos[name], p);
  // a sound wave coming in along the canal
  const wv = G(g);
  for (let i = 0; i < 4; i++) E('path', { d: 'M0,-26 Q12,0 0,26', fill: 'none', stroke: '#2E7DD8', 'stroke-width': 6, 'stroke-linecap': 'round' }, wv);
  g.wave = (t, p) => { op(wv, p > 0 && p < 1 ? 1 : 0); [...wv.children].forEach((c, i) => tr(c, lerp(-60, 410, clamp(p)) - i * 26, 240)); attr(g.drumEl, 'd', `M424,196 Q${(440 + (p > 0.85 ? 8 * Math.sin(t * 40) : 0)).toFixed(1)},240 424,284`); };
  g.wave(0, 0);
  return g;
}

function pioCurtains(parent, w, h) {
  const g = G(parent), L = G(g), R = G(g);
  const panel = (par, sd) => {
    E('rect', { x: sd < 0 ? 0 : -w / 2 - 4, y: -h / 2, width: w / 2 + 4, height: h, fill: '#8E2A33', stroke: '#5E1820', 'stroke-width': 4 }, par);
    let d = ''; for (let x = 14; x < w / 2 - 4; x += 22) d += `M${sd < 0 ? x : -x},${-h / 2 + 10} Q${sd < 0 ? x + 6 : -x - 6},0 ${sd < 0 ? x : -x},${h / 2 - 6} `;
    E('path', { d, stroke: '#6E1E26', 'stroke-width': 4, fill: 'none' }, par);
  };
  panel(L, -1); panel(R, 1);
  g.set = p => { const k = lerp(0.1, 1, clamp(p)); L.setAttribute('transform', `translate(${-w / 2} 0) scale(${k.toFixed(3)} 1)`); R.setAttribute('transform', `translate(${w / 2} 0) scale(${k.toFixed(3)} 1)`); };
  g.set(0);
  return g;
}

function pioBubbleTea(parent, s) {
  const g = G(parent); tr(g, 0, 0, s || 1);
  E('line', { x1: 8, y1: -70, x2: 18, y2: -110, stroke: '#FF5FA2', 'stroke-width': 9, 'stroke-linecap': 'round' }, g);
  E('path', { d: 'M-30,-56 L30,-56 L22,54 Q0,62 -22,54 Z', fill: '#E9C99A', stroke: pioDk, 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
  E('ellipse', { cx: 0, cy: -58, rx: 34, ry: 9, fill: '#FFFFFF', stroke: pioDk, 'stroke-width': 4 }, g);
  for (let i = 0; i < 7; i++) E('circle', { cx: -16 + (i % 4) * 11, cy: 40 - Math.floor(i / 4) * 11, r: 5.5, fill: '#3A2418' }, g);
  return g;
}

function pioSheet(parent, w) {
  w = w || 900;
  const g = G(parent);
  E('rect', { x: 0, y: 0, width: w, height: 150, rx: 10, fill: '#FBF7EC', stroke: '#C9BFA6', 'stroke-width': 3 }, g);
  let st = ''; for (let i = 0; i < 5; i++) st += `M20,${44 + i * 14} H${w - 20} `;
  E('path', { d: st, stroke: '#7A6B55', 'stroke-width': 2 }, g);
  const bars = 6, bw = (w - 40) / bars;
  for (let b = 0; b <= bars; b++) E('line', { x1: 20 + b * bw, y1: 44, x2: 20 + b * bw, y2: 100, stroke: '#7A6B55', 'stroke-width': 3 }, g);
  for (let b = 0; b < bars - 1; b++) {
    E('rect', { x: 20 + b * bw + bw / 2 - 12, y: 58, width: 24, height: 9, fill: '#3A2E20' }, g);   // a whole-bar rest
    T(g, 20 + b * bw + bw / 2, 132, String(41 + b), { size: 22, weight: 700, anchor: 'middle', fill: '#7A6B55' });
  }
  const nx = 20 + (bars - 1) * bw + bw / 2;
  E('ellipse', { cx: nx, cy: 80, rx: 11, ry: 8, fill: '#3A2E20', transform: `rotate(-20 ${nx} 80)` }, g);
  E('line', { x1: nx + 10, y1: 78, x2: nx + 10, y2: 30, stroke: '#3A2E20', 'stroke-width': 3 }, g);
  T(g, nx, 132, '47', { size: 26, weight: 800, anchor: 'middle', fill: '#D32F2F' });
  g.circle = E('ellipse', { cx: nx, cy: 70, rx: bw / 2 - 8, ry: 56, fill: 'none', stroke: '#D32F2F', 'stroke-width': 5 }, g);
  g.noteX = nx;
  return g;
}
