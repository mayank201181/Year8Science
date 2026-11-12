/* EVERY JOULE COUNTS (Claude Sitcom Ep 14, Energy): the cast, sets and props of this episode.
   Bundled after engine lib.js, kit.js and sitcom.js (scMake, scTalk, scKavya, scConfessional, scLowerThird ...).
   Every top-level name starts with `en`, except `cast`.

   Characters: cast(parent, kind, o) -> g, origin at the character's centre, about 200 px tall at s = 1
     o: { s (scale), mood (default mood) }
     g.set({ t, talk, mood, look, sweat, still, ... })   call every frame
       talk 0..1 (use scTalk(S, t, who)); mood: neutral | happy | smug | annoyed | sad | shock | deadpan
       look -1..1 pupils left/right; sweat 0..1 (theo, colin, kavya); still: true stops the idle bob
     kinds (the `who` in script.py in brackets):
       'con'    (con)    Constance, the law of conservation of energy, senior auditor: a green ledger book
                         with a grey bun (pencil through it) and gold half-moon reading glasses. Default deadpan.
       'jules'  (jules)  Jules, one joule: a gold coin with a lightning-bolt quiff, "1 J" on his chest,
                         little waving arms. Over-excited. Extra: g.set({ arms: 0..1 }) arm-wave size (default 0.5).
       'pat'    (pat)    Pat, the courier (a transfer pathway): a fat orange ARROW pointing right with a
                         courier cap. Extra: g.set({ route: 'mech' | 'elec' | 'heat' | 'rad' }) shows that
                         route's icon on the cap badge (default: a plain arrow).
       'theo'   (theo)   Theo, the thermal store: a droopy, melting orange blob with heat shimmer for hair,
                         faint dots drifting away from him (dissipation). Default sad. Extra: g.set({ glow: 0..1 })
                         makes him brighter/warmer (use when energy arrives in his store).
       'effie'  (effie)  Effie, efficiency: a purple body with a gauge (0-100%) for a head-crown and pink cat-eye
                         glasses. Extra: g.set({ gauge: 0..1 }) needle position (default 0.75). The needle never
                         passes 100% even if you ask: that's the joke and the science.
       'gerald' (gerald) Gerald, a boulder on a high shelf (he "has a lot of potential"). Silent, sleepy
                         (default deadpan). Barely bobs.
       'colin'  (colin)  Colin, a lump of coal (fossil fuel): dark faceted lump, yellow hard hat with a lamp,
                         white bushy moustache, smoke puffs rising. Extra: g.set({ smoke: 0..1 }) (default 1).
       'kavya'  (kavya)  Kavya, 12 (the shared scKavya: head and shoulders). Full body: scKavyaBody.
     Mum is never drawn: she is an off-screen voice (use enBubble from the kitchen doorway).

   Shots
     enConf(parent, who)            confessional background tinted for that character (scConfessional); g.set(p, t)
     EN_TINT                        the confessional colours per character
     scLowerThird(parent, NAME, ROLE)  (shared kit) name strap

   Sets (full stage 1200 x 750 unless noted; each returns g)
     enFlat(parent)        Kavya's HDB living room, 34 °C: window with HDB blocks and a hot sun, aircon on the wall,
                           sofa, coffee table, wall clock, kitchen doorway (left, for Mum's off-screen voice), fan spot.
                           g.upd(t, cold 0..1) blows the aircon's cold-air lines; g.clock(hours) sets the clock;
                           g.table = [x, y] centre of the table top (put the bubble tea there);
                           g.door = [x, y] the kitchen doorway's centre; g.aircon = [x, y] the aircon's centre.
     enCorridor(parent)    the HDB common corridor outside the flat: railing, sky and blocks beyond, the front door
                           and gate, the ELECTRICITY METER box on the wall. g.meter (an enMeter, at g.meterXY);
                           g.upd(t) runs the meter digits.
     enOffice(parent)      inside the meter: the firm's office (dark teal, faint circuit-trace wallpaper), firm sign
                           top right "CONSTANCE & CO. / Energy auditors / est. 13.8 billion years ago", desks, filing
                           cabinets, an empty wall board (g.board = { x, y, w, h }, put science there),
                           a high shelf (g.shelf = [x, y] where Gerald sits).
     enDoors(parent)       the corridor of the eight store departments, 2400 px long: 8 doors 300 px apart, each with
                           a plaque (number + name) and the store's icon on the door. g.pan(x) scrolls it (0..1200);
                           g.doors[i] = { x, open(p) } (x in corridor coordinates; screen x = x - pan);
                           g.shelf = [x, y] (corridor coords) the high shelf beside GRAVITATIONAL, for Gerald.
                           Order: 0 kinetic, 1 gravitational, 2 elastic, 3 chemical, 4 thermal (basement stairs),
                           5 nuclear, 6 electrostatic, 7 magnetic.
     enBasement(parent)    Theo's basement, THERMAL STORE (THE SURROUNDINGS): dim, warm, pipes, a lost umbrella,
                           faint spread-out dots drifting (g.upd(t)).
     enReview(parent)      Effie's review room: spotlight, judge's desk with "PERFORMANCE REVIEW", a big empty
                           screen for charts (g.screen = { x, y, w, h }). g.upd(t) sweeps the spotlight.
     enPlant(parent)       a power station at dusk: chimney, cooling tower with steam, pylons. g.upd(t) moves the steam.

   Props (around their own origin)
     enStoreIcon(parent, kind, s)   icon for a store, about 90 px at s = 1:
                                    'kinetic' 'gravitational' 'elastic' 'chemical' 'thermal' 'nuclear' 'electrostatic' 'magnetic'
     EN_STORES                      [{ k, name, col }] the eight stores in order, with their colours
     enPathIcon(parent, kind, s)    icon for a pathway, about 80 px: 'mech' (force arrow pushing a box), 'elec' (bolt
                                    on a wire), 'heat' (flame), 'rad' (wave)
     EN_PATHS                       [{ k, name, col }] the four pathways in order
     enBoard(parent, w, h, title)   a ledger page (cream, ruled, red margin, title at top); centred on (0,0)
     enStamp(parent, text, col)     the auditor's rubber stamp mark ("DENIED", "FILED", "CASE CLOSED"); g.set(p) thumps it in
     enBubble(parent, text, o)      speech bubble (white, ink outline) with a tail; o: { size, tail: 'left'|'right'|'down', w }
     enMeter(parent, s)             the electricity meter: cream box, dial window with running digits; g.upd(t)
     enBubbleTea(parent, s)         bubble tea cup (pearls, straw, lid) about 150 tall, base at (0,0)
     enSplat(parent, s)             spilled bubble tea puddle with pearls; g.set(p) spreads it
     enFan(parent, s)               old stand fan, base at (0,0), about 300 tall; g.upd(t, speed) spins and rattles it
     enKettle(parent, s)            electric kettle on its base, base at (0,0); g.upd(t, boil 0..1) steam;
                                    g.element = the heating element path (g.element.setAttribute('fill', ...) to glow)
     enSankey(parent, o)            exact Sankey diagram. o: { total: px width for the input, frac: useful fraction,
                                    len: px length (default 560), labels: { in, use, waste }, useCol, wasteCol }.
                                    Input arrow enters from the left; the useful part carries straight on; the wasted
                                    branch (width = (1 - frac) * total) peels off and curves DOWN. Origin = left end,
                                    centre of the input band. g.set(p) grows it left to right; g.label(p) fades labels.
     enTurbine(parent, s)           steam turbine wheel (blades), g.upd(t, speed)
     enWind(parent, s)              wind turbine, base at (0,0), about 300 tall; g.upd(t, speed)
     enSolar(parent, s)             solar panel on a stand, about 160 wide
     enSmoke(parent, n)             rising grey smoke puffs; g.upd(t, amount 0..1)
*/

/* ---------- confessional tints ---------- */
const EN_TINT = {
  con: ['#10332A', '#1D5A48'], jules: ['#3A3010', '#6B5714'], pat: ['#3A2410', '#6B3F14'], theo: ['#3A160E', '#6E2A12'],
  effie: ['#22163D', '#41307A'], colin: ['#17191D', '#363A42'], gerald: ['#222622', '#424A42'], kavya: ['#14243A', '#25446B'],
};
function enConf(parent, who) { const c = EN_TINT[who] || EN_TINT.con; return scConfessional(parent, c[0], c[1]); }

/* ---------- small helpers ---------- */
function enPoly(pts) { return 'M' + pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' L') + ' Z'; }
function enOutlineText(t, col, w) { t.setAttribute('stroke', col); t.setAttribute('stroke-width', w); t.setAttribute('paint-order', 'stroke'); t.setAttribute('stroke-linejoin', 'round'); return t; }

/* ---------- the cast ---------- */
function cast(parent, kind, o) {
  o = o || {};
  if (kind === 'kavya') return scKavya(parent, o);
  const S = { s: o.s, mood: o.mood };
  let c;
  if (kind === 'con') {
    c = scMake(parent, Object.assign(S, { seed: 4, bob: 2, mood: o.mood || 'deadpan',
      draw: g => {
        // grey bun with a pencil through it (behind the book)
        const bun = G(g); tr(bun, 6, -112);
        E('path', { d: 'M-46,-8 L54,-34', stroke: '#F2C14E', 'stroke-width': 9, 'stroke-linecap': 'round' }, bun);
        E('path', { d: 'M54,-34 L66,-37 L55,-29 Z', fill: '#3A2A10' }, bun);
        E('path', { d: 'M-46,-8 L-56,-5', stroke: '#FF8FB0', 'stroke-width': 9, 'stroke-linecap': 'round' }, bun);
        E('circle', { r: 30, fill: ball('#B8C2CC', '#78838F'), stroke: SC_INK, 'stroke-width': 4 }, bun);
        E('path', { d: 'M-16,-14 Q0,-26 16,-12 M-20,4 Q0,-8 20,6', fill: 'none', stroke: '#78838F', 'stroke-width': 3 }, bun);
        // the ledger book
        E('rect', { x: -82, y: -104, width: 164, height: 214, rx: 16, fill: '#F4EBD3', stroke: SC_INK, 'stroke-width': 5 }, g);   // pages edge
        E('rect', { x: -86, y: -108, width: 160, height: 210, rx: 16, fill: linGrad('#34937A', '#1C5C4A', false), stroke: SC_INK, 'stroke-width': 5 }, g);
        E('rect', { x: -86, y: -108, width: 26, height: 210, rx: 12, fill: '#174A3C', stroke: SC_INK, 'stroke-width': 4 }, g);   // spine
        [-80, -40, 40, 80].forEach(y => E('rect', { x: -84, y: y, width: 22, height: 7, fill: '#E2B33C' }, g));
        E('path', { d: 'M74,-108 L74,-78 L44,-108 Z M74,102 L74,72 L44,102 Z', fill: '#E2B33C', stroke: SC_INK, 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
        E('rect', { x: -44, y: 58, width: 104, height: 32, rx: 6, fill: '#F4EBD3', stroke: '#B8902C', 'stroke-width': 3 }, g);   // label plate
        T(g, 8, 82, 'LEDGER', { size: 22, weight: 800, anchor: 'middle', fill: '#1C5C4A', ls: 2 });
      },
      face: { x: 6, y: -28, eye: 17, gap: 54, mouthW: 40, mouthY: 40, lidCol: '#2F8C70' } }));
    const inner = c.firstChild, gl = G(inner); tr(gl, 6, -28);   // half-moon reading glasses, over the eyes
    [-27, 27].forEach(x => E('path', { d: `M${x - 23},3 L${x + 23},3 A23,21 0 0 1 ${x - 23},3 Z`, fill: 'rgba(255,255,255,0.18)', stroke: '#E2B33C', 'stroke-width': 4.5, 'stroke-linejoin': 'round' }, gl));
    E('path', { d: 'M-4,4 Q0,-1 4,4', fill: 'none', stroke: '#E2B33C', 'stroke-width': 4 }, gl);
  } else if (kind === 'jules') {
    let arms = [], sp = null;
    c = scMake(parent, Object.assign(S, { seed: 9, bob: 8, mood: o.mood || 'happy',
      draw: g => {
        [-1, 1].forEach(sd => { const a = E('path', { d: '', fill: 'none', stroke: SC_INK, 'stroke-width': 7, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g); arms.push({ a, sd }); });
        const q = G(g); tr(q, 4, -78, 0.62, 14);   // lightning quiff
        E('path', { d: 'M8,-50 L-26,6 L-4,6 L-12,50 L26,-8 L4,-8 Z', fill: '#FFE45C', stroke: SC_INK, 'stroke-width': 6, 'stroke-linejoin': 'round' }, q);
        E('circle', { r: 78, fill: ball('#FFE45C', '#D49A12'), stroke: SC_INK, 'stroke-width': 6 }, g);
        E('circle', { r: 64, fill: 'none', stroke: '#FFF3A8', 'stroke-width': 4, opacity: 0.8 }, g);
        E('circle', { r: 64, fill: 'none', stroke: '#C48A0A', 'stroke-width': 2, 'stroke-dasharray': '4 6' }, g);
        E('rect', { x: -26, y: 40, width: 52, height: 28, rx: 10, fill: '#8A6508' }, g);
        T(g, 0, 62, '1 J', { size: 22, weight: 800, anchor: 'middle', fill: '#FFF3A8' });
        E('ellipse', { cx: -46, cy: 14, rx: 12, ry: 7, fill: '#FF8FB0', opacity: 0.55 }, g);
        E('ellipse', { cx: 46, cy: 14, rx: 12, ry: 7, fill: '#FF8FB0', opacity: 0.55 }, g);
        sp = spark(g, 12); tr(sp, -74, -64);
      },
      face: { x: 0, y: -12, eye: 20, gap: 56, mouthW: 42, mouthY: 28, lidCol: '#FFD23F', iris: '#4A3206' },
      upd: (t, g, st) => {
        const k = st.arms === undefined ? 0.5 : st.arms;
        arms.forEach(({ a, sd }, i) => {
          const w = Math.sin(t * TAU * 2.2 + i * 1.7) * 26 * k;
          a.setAttribute('d', `M${sd * 70},18 Q${sd * 104},${10 - 10 * k} ${sd * (108 + 6 * k)},${(-14 - 40 * k + w).toFixed(1)}`);
        });
        sp.upd(t);
      } }));
  } else if (kind === 'pat') {
    const icons = {};
    c = scMake(parent, Object.assign(S, { seed: 6, bob: 4, mood: o.mood || 'neutral',
      draw: g => {
        const d = 'M-92,-56 L28,-56 L28,-98 L118,0 L28,98 L28,56 L-92,56 Q-112,56 -112,36 L-112,-36 Q-112,-56 -92,-56 Z';
        E('path', { d, fill: linGrad('#FFB866', '#E8751A', true), stroke: SC_INK, 'stroke-width': 6, 'stroke-linejoin': 'round' }, g);
        E('path', { d: 'M40,-72 L100,-6', stroke: '#FFE0B0', 'stroke-width': 6, 'stroke-linecap': 'round', opacity: 0.7 }, g);
        // courier cap
        const cap = G(g); tr(cap, -42, -56);
        E('path', { d: 'M-56,4 Q-56,-50 0,-52 Q56,-50 56,4 Z', fill: '#2E4A7D', stroke: SC_INK, 'stroke-width': 5, 'stroke-linejoin': 'round' }, cap);
        E('path', { d: 'M40,4 Q82,-2 98,10 Q80,16 40,12 Z', fill: '#1E3560', stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, cap);
        E('rect', { x: -58, y: -2, width: 100, height: 10, rx: 4, fill: '#1E3560', stroke: SC_INK, 'stroke-width': 3 }, cap);
        const badge = G(cap); tr(badge, -4, -24);
        E('circle', { r: 19, fill: '#FFE45C', stroke: SC_INK, 'stroke-width': 3 }, badge);
        icons.none = E('path', { d: 'M-10,0 L6,0 M0,-7 L8,0 L0,7', fill: 'none', stroke: SC_INK, 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, badge);
        EN_PATHS.forEach(p => { icons[p.k] = enPathIcon(badge, p.k, 0.2); });
        // satchel strap and bag
        E('path', { d: 'M-104,40 L-40,56', stroke: '#6B4423', 'stroke-width': 7 }, g);
        const bag = G(g); tr(bag, -102, 62, 1, -8);
        E('rect', { x: -26, y: -6, width: 52, height: 42, rx: 8, fill: '#8B5A2B', stroke: SC_INK, 'stroke-width': 4 }, bag);
        E('path', { d: 'M-26,10 L26,10', stroke: SC_INK, 'stroke-width': 3 }, bag);
      },
      face: { x: -36, y: -6, eye: 16, gap: 46, mouthW: 40, mouthY: 32, lidCol: '#F59A3C' },
      upd: (t, g, st) => { const r = st.route || 'none'; for (const k in icons) op(icons[k], k === r ? 1 : 0); } }));
  } else if (kind === 'theo') {
    let shimmer = null, body = null, dots = [];
    c = scMake(parent, Object.assign(S, { seed: 13, bob: 2, mood: o.mood || 'sad',
      draw: g => {
        const rr = rng(31);
        for (let i = 0; i < 9; i++) dots.push({ e: E('circle', { r: 5 + rr() * 4, fill: '#FFB27A' }, g), a: rr() * TAU, ph: rr() });
        shimmer = heatWaves(g, { n: 3, h: 70, spacing: 34, width: 6, color: '#FF8A3D' }); tr(shimmer, 0, -88);
        body = E('path', { d: 'M-88,-6 C-92,-80 -40,-104 0,-104 C40,-104 92,-80 88,-6 C86,30 92,58 86,80 C82,98 66,96 62,80 C58,64 50,70 46,86 C42,106 18,108 14,88 C10,72 -4,72 -10,88 C-16,104 -40,104 -44,84 C-48,66 -60,64 -66,82 C-72,98 -92,92 -90,70 C-88,48 -86,24 -88,-6 Z',
          fill: ball('#FF9A52', '#C2451A'), stroke: SC_INK, 'stroke-width': 5, 'stroke-linejoin': 'round' }, g);
        const tag = G(g); tr(tag, 22, 52, 1, -6);   // crooked name tag
        E('rect', { x: -50, y: -16, width: 100, height: 32, rx: 6, fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 3 }, tag);
        T(tag, 0, 8, 'THERMAL', { size: 20, weight: 800, anchor: 'middle', fill: '#C2451A' });
      },
      face: { x: 0, y: -34, eye: 17, gap: 50, mouthW: 38, mouthY: 34, lidCol: '#F07A38' },
      sweat: [[-80, -60], [82, -50]],
      upd: (t, g, st) => {
        shimmer.upd(t);
        const gl = st.glow || 0;
        body.setAttribute('fill', gl > 0.5 ? ball('#FFC27A', '#E0601E') : ball('#FF9A52', '#C2451A'));
        dots.forEach(({ e, a, ph }) => { const f = (t * 0.18 + ph) % 1, r = 100 + f * 90; attr(e, 'cx', Math.cos(a) * r * 1.05); attr(e, 'cy', Math.sin(a) * r * 0.85); e.style.opacity = ((1 - f) * 0.5).toFixed(3); });
      } }));
  } else if (kind === 'effie') {
    let needle = null;
    c = scMake(parent, Object.assign(S, { seed: 17, bob: 3, mood: o.mood || 'smug',
      draw: g => {
        // gauge crown
        const ga = G(g); tr(ga, 0, -48);
        E('path', { d: 'M-76,0 A76,76 0 0 1 76,0 Z', fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 5, 'stroke-linejoin': 'round' }, ga);
        const seg = (a0, a1, col) => { const p0 = [Math.cos(a0) * 60, Math.sin(a0) * 60], p1 = [Math.cos(a1) * 60, Math.sin(a1) * 60];
          E('path', { d: `M${p0[0].toFixed(1)},${p0[1].toFixed(1)} A60,60 0 0 1 ${p1[0].toFixed(1)},${p1[1].toFixed(1)}`, fill: 'none', stroke: col, 'stroke-width': 13 }, ga); };
        seg(Math.PI, Math.PI * 1.33, '#FF6070'); seg(Math.PI * 1.33, Math.PI * 1.66, '#FFC247'); seg(Math.PI * 1.66, Math.PI * 2, '#56D69B');
        for (let i = 0; i <= 10; i++) { const a = Math.PI + i / 10 * Math.PI; E('line', { x1: Math.cos(a) * 44, y1: Math.sin(a) * 44, x2: Math.cos(a) * 50, y2: Math.sin(a) * 50, stroke: SC_INK, 'stroke-width': i % 5 ? 2 : 4 }, ga); }
        T(ga, -64, 22, '0', { size: 18, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
        T(ga, 66, 22, '100%', { size: 18, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
        needle = E('path', { d: 'M0,-5 L52,0 L0,5 Z', fill: '#E8424F', stroke: SC_INK, 'stroke-width': 2 }, ga);
        E('circle', { r: 8, fill: SC_INK }, ga);
        // body
        E('path', { d: 'M-84,-40 L84,-40 Q92,-40 92,-30 L92,84 Q92,104 72,104 L-72,104 Q-92,104 -92,84 L-92,-30 Q-92,-40 -84,-40 Z', fill: linGrad('#9C7CFF', '#6A48D8', true), stroke: SC_INK, 'stroke-width': 6, 'stroke-linejoin': 'round' }, g);
        E('path', { d: 'M-30,104 L-30,78 Q0,90 30,78 L30,104', fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 3, opacity: 0.9 }, g);   // collar/bib
        T(g, 0, 101, '%', { size: 22, weight: 800, anchor: 'middle', fill: '#6A48D8' });
      },
      face: { x: 0, y: 12, eye: 17, gap: 54, mouthW: 40, mouthY: 38, lidCol: '#8A68F0' },
      upd: (t, g, st) => {
        const v = Math.min(st.gauge === undefined ? 0.75 : st.gauge, 0.995);
        needle.setAttribute('transform', `rotate(${(180 + v * 180 + Math.sin(t * 7) * 1.2).toFixed(1)})`);
      } }));
    const inner = c.firstChild, gl = G(inner); tr(gl, 0, 12);   // pink cat-eye glasses
    [-1, 1].forEach(sd => E('path', { d: `M${sd * 6},-14 Q${sd * 27},-26 ${sd * 52},-24 Q${sd * 50},12 ${sd * 27},18 Q${sd * 6},14 ${sd * 6},-14 Z`, fill: 'rgba(255,255,255,0.12)', stroke: '#FF5FA2', 'stroke-width': 5, 'stroke-linejoin': 'round' }, gl));
    E('path', { d: 'M-6,-10 Q0,-15 6,-10', fill: 'none', stroke: '#FF5FA2', 'stroke-width': 4 }, gl);
  } else if (kind === 'gerald') {
    c = scMake(parent, Object.assign(S, { seed: 21, bob: 0.6, mood: o.mood || 'deadpan',
      draw: g => {
        const pts = [[-96, 30], [-88, -30], [-56, -70], [-6, -84], [48, -74], [86, -40], [98, 14], [84, 60], [36, 84], [-30, 86], [-80, 66]];
        E('path', { d: closedPath(pts), fill: ball('#B3B5AD', '#5F625C'), stroke: SC_INK, 'stroke-width': 6, 'stroke-linejoin': 'round' }, g);
        E('path', { d: 'M-40,-74 Q-6,-98 40,-76 Q20,-64 0,-70 Q-20,-62 -40,-74 Z', fill: '#5BBF6A', stroke: '#2C8C4C', 'stroke-width': 3 }, g);   // moss
        E('path', { d: 'M58,40 L70,56 L64,70 M-64,-10 L-76,6', fill: 'none', stroke: '#6E716A', 'stroke-width': 4, 'stroke-linecap': 'round' }, g);
        E('circle', { cx: -54, cy: 50, r: 6, fill: '#8D9088' }, g); E('circle', { cx: 40, cy: -40, r: 5, fill: '#8D9088' }, g);
      },
      face: { x: 0, y: -4, eye: 15, gap: 52, mouthW: 32, mouthY: 34, lidCol: '#9A9C94' } }));
  } else if (kind === 'colin') {
    let smoke = null;
    c = scMake(parent, Object.assign(S, { seed: 25, bob: 2, mood: o.mood || 'annoyed',
      draw: g => {
        smoke = enSmoke(g, 4); tr(smoke, 26, -128);
        const pts = [[-98, 10], [-80, -50], [-34, -78], [30, -80], [82, -54], [100, 4], [86, 62], [30, 92], [-40, 90], [-88, 60]];
        E('path', { d: enPoly(pts), fill: ball('#5A606A', '#1E2126'), stroke: SC_INK, 'stroke-width': 6, 'stroke-linejoin': 'round' }, g);
        E('path', { d: 'M-80,-50 L-40,-20 L30,-80 M-40,-20 L-88,60 M82,-54 L50,-10 L100,4 M50,-10 L30,92', fill: 'none', stroke: '#8A929E', 'stroke-width': 2.5, opacity: 0.6 }, g);
        E('ellipse', { cx: 0, cy: 6, rx: 70, ry: 56, fill: '#6B727D', opacity: 0.85 }, g);   // lighter face patch
        // hard hat with a lamp
        const hat = G(g); tr(hat, 0, -78);
        E('path', { d: 'M-70,6 Q-70,-52 0,-54 Q70,-52 70,6 Z', fill: ball('#FFD23F', '#D49A12'), stroke: SC_INK, 'stroke-width': 5, 'stroke-linejoin': 'round' }, hat);
        E('rect', { x: -88, y: 0, width: 176, height: 14, rx: 7, fill: '#F2B807', stroke: SC_INK, 'stroke-width': 4 }, hat);
        E('path', { d: 'M0,-54 L0,2', stroke: '#D49A12', 'stroke-width': 6 }, hat);
        E('circle', { cx: 0, cy: -24, r: 13, fill: '#FFF7C2', stroke: SC_INK, 'stroke-width': 3 }, hat);
      },
      face: { x: 0, y: -6, eye: 15, gap: 50, mouthW: 38, mouthY: 40, lidCol: '#565D68' },
      sweat: [[-88, -20], [90, -10]],
      upd: (t, g, st) => smoke.upd(t, st.smoke === undefined ? 1 : st.smoke) }));
    const inner = c.firstChild, mo = G(inner); tr(mo, 0, 22);   // white bushy moustache and brows
    E('path', { d: 'M-4,0 C-20,-14 -48,-10 -54,6 C-44,0 -30,10 -4,6 Z M4,0 C20,-14 48,-10 54,6 C44,0 30,10 4,6 Z', fill: '#F2F2EE', stroke: SC_INK, 'stroke-width': 3, 'stroke-linejoin': 'round' }, mo);
  } else throw new Error('cast: unknown kind ' + kind);
  return c;
}

/* ---------- stores and pathways ---------- */
const EN_STORES = [
  { k: 'kinetic', name: 'KINETIC', col: '#FF6B5C' }, { k: 'gravitational', name: 'GRAVITATIONAL', col: '#5B8DEF' },
  { k: 'elastic', name: 'ELASTIC', col: '#56D69B' }, { k: 'chemical', name: 'CHEMICAL', col: '#FFC247' },
  { k: 'thermal', name: 'THERMAL', col: '#FF8A3D' }, { k: 'nuclear', name: 'NUCLEAR', col: '#B48CFF' },
  { k: 'electrostatic', name: 'ELECTROSTATIC', col: '#4CC9F0' }, { k: 'magnetic', name: 'MAGNETIC', col: '#E8424F' },
];
const EN_PATHS = [
  { k: 'mech', name: 'MECHANICALLY', col: '#FF9F43' }, { k: 'elec', name: 'ELECTRICALLY', col: '#FFE45C' },
  { k: 'heat', name: 'BY HEATING', col: '#FF6B5C' }, { k: 'rad', name: 'BY RADIATION', col: '#B48CFF' },
];
function enStoreIcon(parent, kind, s) {
  const g = G(parent), i = G(g); tr(i, 0, 0, s || 1);
  const ink = { stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' };
  if (kind === 'kinetic') {
    E('path', Object.assign({ d: 'M-44,-18 L-12,-18 M-50,0 L-14,0 M-44,18 L-12,18', fill: 'none' }, ink), i);
    E('circle', Object.assign({ cx: 14, r: 28, fill: ball('#FF6B5C', '#B5372D') }, ink), i);
  } else if (kind === 'gravitational') {
    E('rect', Object.assign({ x: -42, y: -6, width: 84, height: 10, fill: '#B07A45' }, ink), i);
    E('rect', Object.assign({ x: -22, y: -40, width: 44, height: 34, rx: 4, fill: ball('#5B8DEF', '#2E5BB8') }, ink), i);
    E('path', Object.assign({ d: 'M0,12 L0,40 M-10,30 L0,42 L10,30', fill: 'none', stroke: '#FFFFFF' }, { 'stroke-width': 5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }), i);
  } else if (kind === 'elastic') {
    let d = 'M-44,0'; for (let k = 0; k < 8; k++) d += ` L${-38 + k * 11},${k % 2 ? 22 : -22}`; d += ' L44,0';
    E('path', Object.assign({ d, fill: 'none' }, ink, { stroke: '#2C8C4C', 'stroke-width': 7 }), i);
    E('rect', Object.assign({ x: -52, y: -28, width: 10, height: 56, fill: '#56D69B' }, ink), i);
    E('rect', Object.assign({ x: 42, y: -28, width: 10, height: 56, fill: '#56D69B' }, ink), i);
  } else if (kind === 'chemical') {
    E('rect', Object.assign({ x: -40, y: -22, width: 74, height: 44, rx: 8, fill: ball('#FFC247', '#B57B12') }, ink), i);
    E('rect', Object.assign({ x: 34, y: -9, width: 9, height: 18, rx: 2, fill: '#E6EEF4' }, ink), i);
    E('path', { d: 'M-24,0 L-8,0 M-16,-8 L-16,8 M8,0 L22,0', stroke: SC_INK, 'stroke-width': 4, 'stroke-linecap': 'round' }, i);
  } else if (kind === 'thermal') {
    E('path', Object.assign({ d: 'M0,40 C-30,40 -36,14 -24,-6 C-18,-16 -14,-24 -16,-40 C0,-30 8,-18 6,-6 C12,-12 14,-20 12,-26 C30,-8 34,10 26,26 C20,36 12,40 0,40 Z', fill: ball('#FFC247', '#FF6B1C') }, ink), i);
    E('path', { d: 'M0,34 C-12,34 -14,22 -8,12 C-4,6 -2,0 0,-6 C8,6 12,14 10,22 C8,30 4,34 0,34 Z', fill: '#FFF2B0' }, i);
  } else if (kind === 'nuclear') {
    [0, 60, 120].forEach(a => E('ellipse', { rx: 42, ry: 15, fill: 'none', stroke: '#B48CFF', 'stroke-width': 4, transform: `rotate(${a})` }, i));
    E('circle', Object.assign({ r: 13, fill: ball('#FF6B5C', '#B5372D') }, ink, { 'stroke-width': 3 }), i);
    E('circle', { cx: 42, cy: 0, r: 5, fill: '#4CC9F0' }, i);
  } else if (kind === 'electrostatic') {
    E('path', Object.assign({ d: 'M0,-42 C-30,-42 -32,-6 -14,10 L-6,18 L6,18 L14,10 C32,-6 30,-42 0,-42 Z', fill: ball('#4CC9F0', '#1D84A6') }, ink), i);
    E('path', { d: 'M0,18 Q-8,30 4,42', fill: 'none', stroke: SC_INK, 'stroke-width': 3 }, i);
    T(i, -10, -10, '+', { size: 26, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
    T(i, 10, 6, '−', { size: 26, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  } else if (kind === 'magnetic') {
    E('path', Object.assign({ d: 'M-36,-36 L-36,4 A36,36 0 0 0 36,4 L36,-36 L16,-36 L16,4 A16,16 0 0 1 -16,4 L-16,-36 Z', fill: ball('#E8424F', '#A4232E') }, ink), i);
    E('rect', Object.assign({ x: -36, y: -40, width: 20, height: 14, fill: '#E6EEF4' }, ink, { 'stroke-width': 3 }), i);
    E('rect', Object.assign({ x: 16, y: -40, width: 20, height: 14, fill: '#E6EEF4' }, ink, { 'stroke-width': 3 }), i);
  }
  return g;
}
function enPathIcon(parent, kind, s) {
  const g = G(parent), i = G(g); tr(i, 0, 0, s || 1);
  const ink = { stroke: SC_INK, 'stroke-width': 5, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' };
  if (kind === 'mech') {
    E('rect', Object.assign({ x: 4, y: -24, width: 44, height: 48, rx: 4, fill: '#B07A45' }, ink), i);
    E('path', Object.assign({ d: 'M-48,0 L-8,0 M-20,-12 L-6,0 L-20,12', fill: 'none' }, ink, { stroke: '#FF9F43', 'stroke-width': 9 }), i);
  } else if (kind === 'elec') {
    E('path', { d: 'M-48,26 L48,26', stroke: '#E6EEF4', 'stroke-width': 6, 'stroke-linecap': 'round' }, i);
    E('path', Object.assign({ d: 'M8,-42 L-20,2 L-2,2 L-10,40 L22,-8 L4,-8 Z', fill: '#FFE45C' }, ink, { 'stroke-width': 4 }), i);
  } else if (kind === 'heat') {
    E('path', Object.assign({ d: 'M0,40 C-30,40 -36,14 -24,-6 C-18,-16 -14,-24 -16,-40 C0,-30 8,-18 6,-6 C12,-12 14,-20 12,-26 C30,-8 34,10 26,26 C20,36 12,40 0,40 Z', fill: ball('#FFB06B', '#E8424F') }, ink), i);
  } else if (kind === 'rad') {
    let d = 'M-48,0'; for (let x = -48; x <= 48; x += 4) d += ` L${x},${(-18 * Math.sin((x + 48) / 96 * TAU * 1.5)).toFixed(1)}`;
    E('path', { d, fill: 'none', stroke: '#B48CFF', 'stroke-width': 8, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, i);
  }
  return g;
}

/* ---------- props ---------- */
function enBoard(parent, w, h, title) {
  const g = G(parent);
  E('rect', { x: -w / 2 + 6, y: -h / 2 + 8, width: w, height: h, rx: 10, fill: '#000000', opacity: 0.25 }, g);
  E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: 10, fill: '#FBF5E4', stroke: '#C9B98E', 'stroke-width': 4 }, g);
  let d = ''; for (let y = -h / 2 + 96; y < h / 2 - 10; y += 46) d += `M${-w / 2 + 16},${y} L${w / 2 - 16},${y} `;
  E('path', { d, stroke: '#BFD3E6', 'stroke-width': 2 }, g);
  E('line', { x1: -w / 2 + 64, y1: -h / 2 + 6, x2: -w / 2 + 64, y2: h / 2 - 6, stroke: '#F2A0A8', 'stroke-width': 3 }, g);
  if (title) T(g, 0, -h / 2 + 52, title, { size: 32, weight: 800, anchor: 'middle', fill: '#1C5C4A', ls: 1 });
  return g;
}
function enStamp(parent, text, col) {
  col = col || '#D32F2F';
  const g = G(parent), inner = G(g);
  const w = textWidth(text, 64, FD, 800) + 64;
  E('rect', { x: -w / 2, y: -50, width: w, height: 100, rx: 12, fill: 'none', stroke: col, 'stroke-width': 9 }, inner);
  E('rect', { x: -w / 2 + 10, y: -40, width: w - 20, height: 80, rx: 8, fill: 'none', stroke: col, 'stroke-width': 3 }, inner);
  T(inner, 0, 23, text, { size: 64, weight: 800, anchor: 'middle', fill: col, ls: 4 });
  g.set = p => { p = clamp(p); op(g, p > 0 ? 1 : 0); const k = p < 0.6 ? lerp(2.2, 0.92, p / 0.6) : lerp(0.92, 1, (p - 0.6) / 0.4); tr(inner, 0, 0, k, -8); inner.style.opacity = clamp(p * 3).toFixed(3); };
  g.set(1);
  return g;
}
function enBubble(parent, text, o) {
  o = o || {};
  const size = o.size || 32, g = G(parent);
  const lines = String(text).split('\n');
  const w = o.w || Math.max(...lines.map(l => textWidth(l, size, FD, 700))) + 56, h = lines.length * size * 1.25 + 34;
  const tail = o.tail || 'down';
  let d = `M${-w / 2 + 20},${-h / 2} L${w / 2 - 20},${-h / 2} Q${w / 2},${-h / 2} ${w / 2},${-h / 2 + 20} L${w / 2},${h / 2 - 20} Q${w / 2},${h / 2} ${w / 2 - 20},${h / 2} `;
  if (tail === 'down') d += `L10,${h / 2} L-24,${h / 2 + 34} L-20,${h / 2} `;
  d += `L${-w / 2 + 20},${h / 2} Q${-w / 2},${h / 2} ${-w / 2},${h / 2 - 20} `;
  if (tail === 'left') d += `L${-w / 2},12 L${-w / 2 - 36},24 L${-w / 2},-8 `;
  d += `L${-w / 2},${-h / 2 + 20} Q${-w / 2},${-h / 2} ${-w / 2 + 20},${-h / 2} Z`;
  if (tail === 'right') d = d.replace(`L${w / 2},${h / 2 - 20}`, `L${w / 2},-8 L${w / 2 + 36},24 L${w / 2},12 L${w / 2},${h / 2 - 20}`);
  E('path', { d, fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 5, 'stroke-linejoin': 'round' }, g);
  lines.forEach((l, k) => T(g, 0, -h / 2 + 17 + size * 0.95 + k * size * 1.25, l, { size, weight: 700, anchor: 'middle', fill: SC_INK }));
  g.w = w; g.h = h;
  return g;
}
function enMeter(parent, s) {
  const g = G(parent), i = G(g); tr(i, 0, 0, s || 1);
  E('rect', { x: -90, y: -120, width: 180, height: 240, rx: 14, fill: linGrad('#E8E2D2', '#BFB8A6', true), stroke: SC_INK, 'stroke-width': 5 }, i);
  E('rect', { x: -66, y: -96, width: 132, height: 70, rx: 8, fill: '#1A2A22', stroke: SC_INK, 'stroke-width': 4 }, i);
  const dig = T(i, 0, -48, '04213', { size: 40, weight: 700, anchor: 'middle', fill: '#7CFFB2', font: FB, ls: 3 });
  T(i, 0, 6, 'ELECTRICITY', { size: 18, weight: 800, anchor: 'middle', fill: '#5A5446' });
  T(i, 0, 28, 'METER', { size: 18, weight: 800, anchor: 'middle', fill: '#5A5446' });
  const disc = E('rect', { x: -50, y: 50, width: 100, height: 14, rx: 7, fill: '#8F9CAB', stroke: SC_INK, 'stroke-width': 3 }, i);
  const mark = E('rect', { x: -6, y: 50, width: 12, height: 14, fill: '#E8424F' }, i);
  E('circle', { cx: -60, cy: 96, r: 7, fill: '#E8424F' }, i);
  g.digits = dig;
  g.upd = t => { setText(dig, String(4213 + Math.floor(t * 0.7)).padStart(5, '0')); attr(mark, 'x', -6 + 40 * Math.sin(t * 3)); };
  return g;
}
function enBubbleTea(parent, s) {
  const g = G(parent), i = G(g); tr(i, 0, 0, s || 1);
  E('path', { d: 'M18,-150 L-6,-210', stroke: '#FF6FB5', 'stroke-width': 14, 'stroke-linecap': 'round' }, i);   // straw
  E('path', { d: 'M-46,-140 L46,-140 L36,0 L-36,0 Z', fill: '#F3D9B1', stroke: SC_INK, 'stroke-width': 5, 'stroke-linejoin': 'round' }, i);
  E('path', { d: 'M-44,-112 L44,-112 L36,0 L-36,0 Z', fill: '#C9935A', opacity: 0.85 }, i);   // milk tea
  const r = rng(5);
  for (let k = 0; k < 11; k++) E('circle', { cx: -26 + r() * 52, cy: -12 - r() * 26, r: 7, fill: '#2A1A22' }, i);   // pearls
  E('path', { d: 'M-46,-140 L46,-140 L36,0 L-36,0 Z', fill: 'none', stroke: SC_INK, 'stroke-width': 5, 'stroke-linejoin': 'round' }, i);
  E('rect', { x: -52, y: -150, width: 104, height: 14, rx: 6, fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 4 }, i);   // sealed lid
  return g;
}
function enSplat(parent, s) {
  const g = G(parent), i = G(g); tr(i, 0, 0, s || 1);
  const pud = E('path', { d: 'M-120,0 C-130,-20 -80,-30 -40,-24 C0,-36 60,-34 100,-20 C140,-10 130,14 90,16 C50,24 -20,22 -70,18 C-110,16 -116,10 -120,0 Z', fill: '#C9935A', stroke: '#8A5A2B', 'stroke-width': 3 }, i);
  const pearls = [], r = rng(9);
  for (let k = 0; k < 11; k++) pearls.push({ e: E('circle', { r: 8, fill: '#2A1A22' }, i), x: -110 + r() * 220, y: -18 + r() * 30 });
  g.set = p => { p = clamp(p); tr(pud, 0, 0, Math.max(0.01, p)); pearls.forEach(({ e, x, y }, k) => { const q = clamp(p * 1.4 - k * 0.03); attr(e, 'cx', x * q); attr(e, 'cy', y * q - 4); op(e, q > 0.05 ? 1 : 0); }); };
  g.set(1);
  return g;
}
function enFan(parent, s) {
  const g = G(parent), i = G(g); tr(i, 0, 0, s || 1);
  E('ellipse', { cx: 0, cy: -8, rx: 70, ry: 16, fill: '#7FB6D9', stroke: SC_INK, 'stroke-width': 4 }, i);
  E('rect', { x: -8, y: -170, width: 16, height: 162, fill: '#E6EEF4', stroke: SC_INK, 'stroke-width': 4 }, i);
  const head = G(i); tr(head, 0, -230);
  E('circle', { r: 76, fill: 'rgba(200,230,250,0.15)', stroke: '#9AB4C4', 'stroke-width': 4 }, head);
  const blades = G(head);
  for (let k = 0; k < 3; k++) E('path', { d: 'M0,0 C20,-20 60,-30 62,-6 C60,12 24,10 0,0 Z', fill: '#7FB6D9', stroke: SC_INK, 'stroke-width': 3, transform: `rotate(${k * 120})` }, blades);
  E('circle', { r: 14, fill: '#E6EEF4', stroke: SC_INK, 'stroke-width': 3 }, head);
  let grill = ''; for (let k = 0; k < 12; k++) { const a = k / 12 * TAU; grill += `M0,0 L${(Math.cos(a) * 76).toFixed(1)},${(Math.sin(a) * 76).toFixed(1)} `; }
  E('path', { d: grill, stroke: '#9AB4C4', 'stroke-width': 2, opacity: 0.7 }, head);
  E('circle', { r: 76, fill: 'none', stroke: SC_INK, 'stroke-width': 4 }, head);
  g.head = head;
  g.upd = (t, speed) => { const sp = speed === undefined ? 1 : speed; tr(blades, 0, 0, 1, (t * 900 * sp) % 360); tr(head, sp > 0 ? Math.sin(t * 40) * 1.6 * sp : 0, -230 + (sp > 0 ? Math.cos(t * 33) * 1.2 * sp : 0)); };
  g.upd(0, 0);
  return g;
}
function enKettle(parent, s) {
  const g = G(parent), i = G(g); tr(i, 0, 0, s || 1);
  E('rect', { x: -78, y: -18, width: 156, height: 18, rx: 6, fill: '#3A4B5C', stroke: SC_INK, 'stroke-width': 4 }, i);   // base
  E('path', { d: 'M70,-60 Q100,-90 100,-150 Q100,-170 82,-170', fill: 'none', stroke: SC_INK, 'stroke-width': 12, 'stroke-linecap': 'round' }, i);   // handle
  E('path', { d: 'M-58,-18 L-66,-150 Q-60,-176 0,-178 Q60,-176 66,-150 L58,-18 Z', fill: ball('#E6EEF4', '#9AA6B2'), stroke: SC_INK, 'stroke-width': 5, 'stroke-linejoin': 'round' }, i);
  E('path', { d: 'M-62,-120 L-110,-150 L-106,-136 L-60,-100 Z', fill: '#C9D3DC', stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, i);   // spout
  E('rect', { x: -22, y: -192, width: 44, height: 16, rx: 6, fill: '#3A4B5C', stroke: SC_INK, 'stroke-width': 3 }, i);
  E('rect', { x: -30, y: -140, width: 26, height: 100, rx: 8, fill: 'rgba(76,201,240,0.35)', stroke: SC_INK, 'stroke-width': 3 }, i);   // water window
  g.element = E('path', { d: 'M-40,-34 Q-30,-46 -20,-34 Q-10,-22 0,-34 Q10,-46 20,-34 Q30,-22 40,-34', fill: 'none', stroke: '#8F9CAB', 'stroke-width': 6, 'stroke-linecap': 'round' }, i);
  const steam = [];
  for (let k = 0; k < 4; k++) steam.push(E('circle', { r: 14, fill: '#FFFFFF' }, i));
  E('circle', { cx: 50, cy: -8, r: 4, fill: '#E8424F' }, i);
  g.upd = (t, boil) => {
    boil = boil || 0;
    steam.forEach((e, k) => { const f = (t * 0.7 + k / 4) % 1; attr(e, 'cx', -112 - f * 50 + Math.sin(f * 7 + k) * 10); attr(e, 'cy', -150 - f * 120); attr(e, 'r', 10 + f * 22); e.style.opacity = (boil * 0.6 * (1 - f)).toFixed(3); });
  };
  g.upd(0, 0);
  return g;
}
function enSmoke(parent, n) {
  const g = G(parent), ps = [];
  for (let k = 0; k < (n || 4); k++) ps.push(E('circle', { r: 14, fill: '#9AA0A8', stroke: '#6E747C', 'stroke-width': 2 }, g));
  g.upd = (t, amt) => { amt = amt === undefined ? 1 : amt; ps.forEach((e, k) => { const f = (t * 0.45 + k / ps.length) % 1; attr(e, 'cx', Math.sin(f * 5 + k) * 10 + f * 24); attr(e, 'cy', -f * 80); attr(e, 'r', 8 + f * 18); e.style.opacity = (amt * 0.75 * Math.sin(f * Math.PI)).toFixed(3); }); };
  g.upd(0, 1);
  return g;
}
function enSankey(parent, o) {
  o = o || {};
  const g = G(parent), Wt = o.total || 200, f = o.frac === undefined ? 0.75 : o.frac, Lx = o.len || 560;
  const wu = Wt * f, ww = Wt - wu, x0 = 0, xs = Lx * 0.42;   // split point
  const top = -Wt / 2, bot = Wt / 2, uBot = top + wu;
  const useCol = o.useCol || '#56D69B', wasteCol = o.wasteCol || '#FF8A3D', inCol = o.inCol || '#FFE45C';
  const clipId = 'ensk' + Math.round(Wt * 7 + f * 1000 + Lx);
  const cp = E('clipPath', { id: clipId }, defs());
  const clipR = E('rect', { x: -10, y: -2000, width: 0, height: 4000 }, cp);
  const body = G(g, { 'clip-path': `url(#${clipId})` });
  // input band, then useful straight on (with an arrow head), wasted curving down
  E('path', { d: `M${x0},${top} L${xs},${top} L${xs},${bot} L${x0},${bot} Z`, fill: inCol, stroke: SC_INK, 'stroke-width': 4 }, body);
  const ux1 = Lx - 30;
  E('path', { d: `M${xs},${top} L${ux1},${top} L${ux1},${top - 14} L${Lx + 20},${(top + uBot) / 2} L${ux1},${uBot + 14} L${ux1},${uBot} L${xs},${uBot} Z`, fill: useCol, stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, body);
  const R = 70 + ww, yEnd = bot + 150 + ww;
  const wd = `M${xs},${uBot} Q${xs + ww + 70},${uBot} ${xs + ww + 70},${uBot + 90} L${xs + ww + 70},${yEnd} L${xs + ww + 70 + 14},${yEnd} L${xs + ww / 2 + 70},${yEnd + 40} L${xs + 56},${yEnd} L${xs + 70},${yEnd} L${xs + 70},${bot + 90} Q${xs + 70},${bot} ${xs},${bot} Z`;
  E('path', { d: wd, fill: wasteCol, stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, body);
  const lab = G(g), L = o.labels || {};
  if (L.in) T(lab, xs / 2, top - 20, L.in, { size: 28, weight: 700, anchor: 'middle', fill: inCol });
  if (L.use) T(lab, (xs + Lx) / 2 + 10, top - 20, L.use, { size: 28, weight: 700, anchor: 'middle', fill: useCol });
  if (L.waste) T(lab, xs + ww + 96, yEnd - 10, L.waste, { size: 28, weight: 700, anchor: 'start', fill: wasteCol });
  g.set = p => attr(clipR, 'width', (Lx + 80) * clamp(p) + 10);
  g.label = p => op(lab, p);
  g.wasteEnd = [xs + ww / 2 + 70, yEnd + 40]; g.useEnd = [Lx + 20, (top + uBot) / 2];
  g.set(1);
  return g;
}
function enTurbine(parent, s) {
  const g = G(parent), i = G(g); tr(i, 0, 0, s || 1);
  E('circle', { r: 74, fill: '#2A3B4A', stroke: SC_INK, 'stroke-width': 5 }, i);
  const bl = G(i);
  for (let k = 0; k < 10; k++) E('path', { d: 'M0,-14 Q30,-40 22,-68 L10,-66 Q14,-38 -4,-14 Z', fill: '#C9D3DC', stroke: SC_INK, 'stroke-width': 2.5, transform: `rotate(${k * 36})` }, bl);
  E('circle', { r: 16, fill: '#8F9CAB', stroke: SC_INK, 'stroke-width': 3 }, i);
  g.upd = (t, sp) => tr(bl, 0, 0, 1, (t * 300 * (sp === undefined ? 1 : sp)) % 360);
  return g;
}
function enWind(parent, s) {
  const g = G(parent), i = G(g); tr(i, 0, 0, s || 1);
  E('path', { d: 'M-10,0 L-5,-260 L5,-260 L10,0 Z', fill: '#F2F7FA', stroke: SC_INK, 'stroke-width': 4 }, i);
  const hub = G(i); tr(hub, 0, -262);
  const bl = G(hub);
  for (let k = 0; k < 3; k++) E('path', { d: 'M-6,0 Q-10,-60 0,-120 Q12,-60 8,0 Z', fill: '#F2F7FA', stroke: SC_INK, 'stroke-width': 3.5, transform: `rotate(${k * 120})` }, bl);
  E('circle', { r: 12, fill: '#C9D3DC', stroke: SC_INK, 'stroke-width': 3 }, hub);
  g.upd = (t, sp) => tr(bl, 0, 0, 1, (t * 90 * (sp === undefined ? 1 : sp)) % 360);
  return g;
}
function enSolar(parent, s) {
  const g = G(parent), i = G(g); tr(i, 0, 0, s || 1);
  E('path', { d: 'M-6,0 L-6,40 M6,0 L6,40', stroke: '#8F9CAB', 'stroke-width': 6 }, i);
  E('path', { d: 'M-90,-10 L70,-50 L90,10 L-70,50 Z', fill: '#1E3A8A', stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, i);
  let d = '';
  for (let k = 1; k < 4; k++) { const f = k / 4; d += `M${lerp(-90, 70, f)},${lerp(-10, -50, f)} L${lerp(-70, 90, f)},${lerp(50, 10, f)} `; }
  for (let k = 1; k < 3; k++) { const f = k / 3; d += `M${lerp(-90, -70, f)},${lerp(-10, 50, f)} L${lerp(70, 90, f)},${lerp(-50, 10, f)} `; }
  E('path', { d, stroke: '#7FB6FF', 'stroke-width': 2.5 }, i);
  return g;
}

/* ---------- sets ---------- */
function enFlat(parent) {
  const g = G(parent);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#D7EEE8', '#B9DCD3', true) }, g);   // wall
  E('rect', { x: 0, y: 560, width: 1200, height: 190, fill: '#E9DCC6' }, g);   // floor tiles
  let tl = ''; for (let x = 0; x <= 1200; x += 120) tl += `M${x},560 L${x + (x - 600) * 0.4},750 `; for (let y = 600; y < 750; y += 48) tl += `M0,${y} L1200,${y} `;
  E('path', { d: tl, stroke: '#CDBEA4', 'stroke-width': 2 }, g);
  E('rect', { x: 0, y: 550, width: 1200, height: 12, fill: '#A8C4BC' }, g);   // skirting
  // kitchen doorway (left): Mum is off-screen in here
  E('rect', { x: 40, y: 200, width: 150, height: 360, fill: '#6B5A48', stroke: '#4A3E30', 'stroke-width': 6 }, g);
  E('rect', { x: 52, y: 212, width: 126, height: 348, fill: linGrad('#F6E7C8', '#E3CFA8', true) }, g);
  E('rect', { x: 64, y: 300, width: 102, height: 60, fill: '#C9D3DC', opacity: 0.7 }, g);   // kitchen cabinet glimpse
  g.door = [115, 380];
  // window with HDB blocks and a hot sun
  const win_ = G(g); tr(win_, 760, 140);
  E('rect', { x: 0, y: 0, width: 380, height: 270, fill: linGrad('#6EC6FF', '#CDEBFF', true), stroke: '#FFFFFF', 'stroke-width': 12 }, win_);
  const su = sun(win_, 34); tr(su, 300, 64);
  const blk = [[20, 120, 90, '#F2C6A0'], [124, 90, 80, '#BFD9F2'], [220, 140, 70, '#F7E3A1'], [296, 110, 70, '#C9E7C3']];
  blk.forEach(([x, y, w, col]) => { E('rect', { x, y, width: w, height: 270 - y, fill: col, stroke: '#8C9AA6', 'stroke-width': 2 }, win_); for (let yy = y + 12; yy < 260; yy += 22) E('line', { x1: x + 8, y1: yy, x2: x + w - 8, y2: yy, stroke: '#8C9AA6', 'stroke-width': 3, 'stroke-dasharray': '8 6' }, win_); });
  E('path', { d: 'M190,0 L190,270 M0,135 L380,135', stroke: '#FFFFFF', 'stroke-width': 8 }, win_);
  g.sunG = su;
  // aircon on the wall
  const ac = G(g); tr(ac, 440, 150);
  E('rect', { x: -120, y: -40, width: 240, height: 80, rx: 18, fill: '#FAFCFD', stroke: '#9AA6B2', 'stroke-width': 4 }, ac);
  E('rect', { x: -110, y: 20, width: 220, height: 12, rx: 6, fill: '#DCE4EA' }, ac);
  E('circle', { cx: 96, cy: -18, r: 5, fill: '#56D69B' }, ac);
  const coldL = [];
  for (let k = 0; k < 5; k++) coldL.push(E('path', { d: '', fill: 'none', stroke: '#7FD3FF', 'stroke-width': 4, 'stroke-linecap': 'round' }, ac));
  g.aircon = [440, 150];
  // wall clock
  const ck = G(g); tr(ck, 640, 120);
  E('circle', { r: 40, fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 4 }, ck);
  const hh = E('line', { x1: 0, y1: 0, x2: 0, y2: -20, stroke: SC_INK, 'stroke-width': 5, 'stroke-linecap': 'round' }, ck);
  const mm = E('line', { x1: 0, y1: 0, x2: 0, y2: -30, stroke: SC_INK, 'stroke-width': 3, 'stroke-linecap': 'round' }, ck);
  // sofa (left of centre) and coffee table
  const so = G(g); tr(so, 420, 560);
  E('rect', { x: -170, y: -150, width: 340, height: 90, rx: 24, fill: '#E8742A', stroke: '#9C4A16', 'stroke-width': 5 }, so);
  E('rect', { x: -190, y: -80, width: 380, height: 70, rx: 18, fill: '#F08A3E', stroke: '#9C4A16', 'stroke-width': 5 }, so);
  E('rect', { x: -206, y: -120, width: 40, height: 110, rx: 16, fill: '#E8742A', stroke: '#9C4A16', 'stroke-width': 5 }, so);
  E('rect', { x: 166, y: -120, width: 40, height: 110, rx: 16, fill: '#E8742A', stroke: '#9C4A16', 'stroke-width': 5 }, so);
  const tb = G(g); tr(tb, 860, 600);
  E('rect', { x: -150, y: -24, width: 300, height: 22, rx: 6, fill: '#9C6B3E', stroke: '#6B4423', 'stroke-width': 4 }, tb);
  E('rect', { x: -130, y: -2, width: 14, height: 110, fill: '#6B4423' }, tb); E('rect', { x: 116, y: -2, width: 14, height: 110, fill: '#6B4423' }, tb);
  g.table = [860, 576];
  g.upd = (t, cold) => {
    cold = cold === undefined ? 1 : cold; su.upd(t);
    coldL.forEach((e, k) => { const f = (t * 0.6 + k / 5) % 1, x = -90 + k * 45; e.setAttribute('d', `M${x},${46 + f * 60} q10,14 0,28 q-10,14 0,28`); e.style.opacity = (cold * 0.8 * Math.sin(f * Math.PI)).toFixed(3); });
  };
  g.clock = h => { tr(hh, 0, 0, 1, (h % 12) * 30); tr(mm, 0, 0, 1, (h % 1) * 360); };
  g.clock(13); g.upd(0, 1);
  return g;
}
function enCorridor(parent) {
  const g = G(parent);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#7CCBFF', '#D9F1FF', true) }, g);
  const r = rng(12);
  for (let k = 0; k < 6; k++) { const x = 720 + k * 90, h = 250 + r() * 200; E('rect', { x, y: 520 - h, width: 96, height: h, fill: ['#F2C6A0', '#BFD9F2', '#F7E3A1', '#C9E7C3'][k % 4], stroke: '#8C9AA6', 'stroke-width': 2, opacity: 0.85 }, g); }
  E('rect', { x: 0, y: 0, width: 1200, height: 60, fill: '#E6E1D3' }, g);   // ceiling of the corridor
  E('rect', { x: 0, y: 0, width: 700, height: 750, fill: linGrad('#EDE6D3', '#D9D0B8', false) }, g);   // the flat's outer wall
  E('rect', { x: 700, y: 470, width: 500, height: 280, fill: '#CFC6B0' }, g);   // corridor floor beyond
  E('rect', { x: 700, y: 430, width: 500, height: 16, fill: '#8C9AA6' }, g);   // parapet rail
  for (let x = 720; x < 1200; x += 40) E('rect', { x, y: 446, width: 6, height: 70, fill: '#8C9AA6' }, g);
  E('rect', { x: 0, y: 640, width: 1200, height: 110, fill: '#B9AF98' }, g);
  // front door and gate
  E('rect', { x: 400, y: 230, width: 230, height: 410, fill: '#8B5A2B', stroke: '#5A3A1A', 'stroke-width': 6 }, g);
  E('circle', { cx: 600, cy: 440, r: 9, fill: '#E2B33C' }, g);
  let gate = ''; for (let x = 412; x < 630; x += 26) gate += `M${x},236 L${x},636 `;
  E('path', { d: gate + 'M404,320 L626,320 M404,540 L626,540', stroke: '#3A4B5C', 'stroke-width': 5, opacity: 0.85 }, g);
  T(g, 515, 210, '#08-34', { size: 30, weight: 800, anchor: 'middle', fill: '#5A5446' });
  const m = enMeter(g); tr(m, 240, 360, 0.9);
  g.meter = m; g.meterXY = [240, 360];
  g.upd = t => m.upd(t);
  return g;
}
function enOffice(parent) {
  const g = G(parent);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#163A3A', '#0E2626', true) }, g);
  // faint circuit-trace wallpaper
  let d = ''; const r = rng(40);
  for (let k = 0; k < 26; k++) { const x = r() * 1200, y = 40 + r() * 480, l = 40 + r() * 120; d += `M${x.toFixed(0)},${y.toFixed(0)} l${l.toFixed(0)},0 l20,20 l0,${(30 + r() * 60).toFixed(0)} `; }
  E('path', { d, fill: 'none', stroke: '#2E6B5E', 'stroke-width': 4, opacity: 0.55 }, g);
  E('rect', { x: 0, y: 560, width: 1200, height: 190, fill: '#2A1F1A' }, g);   // floor
  E('rect', { x: 0, y: 552, width: 1200, height: 10, fill: '#1A4040' }, g);
  // firm sign
  const sg = G(g); tr(sg, 930, 70);
  E('rect', { x: -230, y: -34, width: 460, height: 110, rx: 12, fill: '#0B1F1A', stroke: '#E2B33C', 'stroke-width': 4 }, sg);
  T(sg, 0, 4, 'CONSTANCE & CO.', { size: 34, weight: 800, anchor: 'middle', fill: '#E2B33C', ls: 2 });
  T(sg, 0, 34, 'Energy auditors', { size: 24, weight: 600, anchor: 'middle', fill: '#CFE7DF', font: FB });
  T(sg, 0, 62, 'est. 13.8 billion years ago', { size: 22, weight: 600, anchor: 'middle', fill: '#8FB8AA', font: FB });
  // board
  g.board = { x: 640, y: 170, w: 500, h: 300 };
  E('rect', { x: 640, y: 170, width: 500, height: 300, rx: 10, fill: '#F4F1E6', stroke: '#8C9AA6', 'stroke-width': 6 }, g);
  E('rect', { x: 700, y: 470, width: 380, height: 10, fill: '#8C9AA6' }, g);
  // filing cabinets and the high shelf
  [[60, 300], [170, 300]].forEach(([x, y]) => {
    E('rect', { x, y, width: 100, height: 260, rx: 6, fill: '#5E7A86', stroke: '#2A3B44', 'stroke-width': 4 }, g);
    for (let k = 0; k < 3; k++) { E('rect', { x: x + 10, y: y + 14 + k * 82, width: 80, height: 70, rx: 4, fill: '#6E8C98', stroke: '#2A3B44', 'stroke-width': 3 }, g); E('rect', { x: x + 36, y: y + 40 + k * 82, width: 28, height: 8, rx: 3, fill: '#C9D3DC' }, g); }
  });
  E('rect', { x: 40, y: 210, width: 260, height: 14, fill: '#8B5A2B', stroke: '#5A3A1A', 'stroke-width': 3 }, g);   // shelf
  g.shelf = [170, 140];
  // desk
  E('rect', { x: 330, y: 470, width: 300, height: 20, rx: 4, fill: '#8B5A2B', stroke: '#5A3A1A', 'stroke-width': 4 }, g);
  E('rect', { x: 344, y: 490, width: 16, height: 70, fill: '#5A3A1A' }, g); E('rect', { x: 600, y: 490, width: 16, height: 70, fill: '#5A3A1A' }, g);
  for (let k = 0; k < 4; k++) E('rect', { x: 380 + k * 6, y: 446 - k * 8, width: 90, height: 12, rx: 2, fill: ['#F4EBD3', '#E6D7B0', '#F4EBD3', '#D9C79A'][k], stroke: '#8A7A50', 'stroke-width': 2 }, g);   // paper stack
  const lamp = G(g); tr(lamp, 580, 470);
  E('path', { d: 'M0,0 L-10,-60 L20,-90', fill: 'none', stroke: '#2A3B44', 'stroke-width': 6 }, lamp);
  E('path', { d: 'M8,-104 L42,-84 L26,-62 Z', fill: '#E2B33C', stroke: SC_INK, 'stroke-width': 3 }, lamp);
  E('ellipse', { cx: 600, cy: 300, rx: 520, ry: 280, fill: glow('#FFE6A8'), opacity: 0.12 }, g);
  return g;
}
function enDoors(parent) {
  const g = G(parent), inner = G(g);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#163A3A' }, g);
  g.appendChild(inner);
  E('rect', { x: -200, y: 0, width: 2800, height: 750, fill: linGrad('#1E4A48', '#123030', true) }, inner);
  E('rect', { x: -200, y: 610, width: 2800, height: 140, fill: '#2A1F1A' }, inner);
  E('rect', { x: -200, y: 600, width: 2800, height: 12, fill: '#1A4040' }, inner);
  let lights = ''; for (let x = 0; x < 2400; x += 300) lights += `M${x + 60},34 L${x + 240},34 `;
  E('path', { d: lights, stroke: '#FFF7C2', 'stroke-width': 10, 'stroke-linecap': 'round', opacity: 0.6 }, inner);
  g.doors = [];
  EN_STORES.forEach((st, k) => {
    const x = 150 + k * 300, d = G(inner); tr(d, x, 0);
    const pl = G(d); tr(pl, 0, 168);
    E('rect', { x: -132, y: -34, width: 264, height: 68, rx: 12, fill: '#0B1F1A', stroke: st.col, 'stroke-width': 4 }, pl);
    T(pl, 0, 12, (k + 1) + '  ' + st.name, { size: st.name.length > 11 ? 26 : 30, weight: 800, anchor: 'middle', fill: st.col });
    E('rect', { x: -78, y: 250, width: 156, height: 360, fill: '#0A1714' }, d);   // dark inside
    const inside = E('rect', { x: -70, y: 258, width: 140, height: 352, fill: st.col, opacity: 0.35 }, d);
    const leaf = G(d);
    E('rect', { x: -78, y: 250, width: 156, height: 360, rx: 4, fill: linGrad('#C99A5C', '#9C6B3E', false), stroke: SC_INK, 'stroke-width': 5 }, leaf);
    E('circle', { cx: 56, cy: 440, r: 9, fill: '#E2B33C', stroke: SC_INK, 'stroke-width': 2 }, leaf);
    E('circle', { cx: 0, cy: 350, r: 56, fill: '#F4EBD3', stroke: SC_INK, 'stroke-width': 4 }, leaf);
    const ic = enStoreIcon(leaf, st.k, 0.95); tr(ic, 0, 350);
    if (st.k === 'thermal') { T(leaf, 0, 470, 'BASEMENT', { size: 22, weight: 800, anchor: 'middle', fill: SC_INK }); E('path', { d: 'M0,484 L0,516 M-12,504 L0,518 L12,504', fill: 'none', stroke: SC_INK, 'stroke-width': 5, 'stroke-linecap': 'round' }, leaf); }
    const door = { x, open: p => { p = clamp(p); leaf.setAttribute('transform', `translate(-78 0) scale(${(1 - 0.85 * p).toFixed(3)} 1) translate(78 0)`); inside.style.opacity = (0.35 + 0.4 * p).toFixed(3); } };
    door.open(0);
    g.doors.push(door);
  });
  // the high shelf beside GRAVITATIONAL (door 1)
  E('rect', { x: 330, y: 300, width: 120, height: 14, fill: '#8B5A2B', stroke: '#5A3A1A', 'stroke-width': 3 }, inner);
  E('path', { d: 'M340,314 L360,340 M440,314 L420,340', stroke: '#5A3A1A', 'stroke-width': 5 }, inner);
  g.shelf = [390, 236];
  g.pan = x => tr(inner, -x, 0);
  g.inner = inner;
  g.pan(0);
  return g;
}
function enBasement(parent) {
  const g = G(parent);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#3A1A10', '#1E0D08', true) }, g);
  E('rect', { x: 0, y: 580, width: 1200, height: 170, fill: '#2A140C' }, g);
  E('path', { d: 'M0,120 L1200,120 M0,150 L700,150 Q740,150 740,190 L740,580', fill: 'none', stroke: '#6B3A24', 'stroke-width': 18 }, g);   // pipes
  E('path', { d: 'M0,120 L1200,120 M0,150 L700,150 Q740,150 740,190 L740,580', fill: 'none', stroke: '#8C4E30', 'stroke-width': 6 }, g);
  const sg = G(g); tr(sg, 900, 230);
  E('rect', { x: -250, y: -50, width: 500, height: 100, rx: 10, fill: '#2A140C', stroke: '#FF8A3D', 'stroke-width': 4 }, sg);
  T(sg, 0, -6, 'THERMAL STORE', { size: 36, weight: 800, anchor: 'middle', fill: '#FF8A3D', ls: 2 });
  T(sg, 0, 30, '(the surroundings)', { size: 26, weight: 600, anchor: 'middle', fill: '#FFB27A', font: FB });
  // lost umbrella and a lost-and-found box
  const um = G(g); tr(um, 1080, 560, 1, 18);
  E('path', { d: 'M-60,0 Q0,-70 60,0 Q45,-10 30,0 Q15,-10 0,0 Q-15,-10 -30,0 Q-45,-10 -60,0 Z', fill: '#4CC9F0', stroke: SC_INK, 'stroke-width': 4 }, um);
  E('path', { d: 'M0,0 L0,70 Q0,84 -14,80', fill: 'none', stroke: SC_INK, 'stroke-width': 5 }, um);
  E('rect', { x: 900, y: 520, width: 120, height: 70, rx: 4, fill: '#8B5A2B', stroke: SC_INK, 'stroke-width': 4 }, g);
  T(g, 960, 562, 'LOST', { size: 24, weight: 800, anchor: 'middle', fill: '#FFE6B0' });
  E('ellipse', { cx: 400, cy: 360, rx: 460, ry: 300, fill: glow('#FF8A3D'), opacity: 0.18 }, g);
  const dots = [], r = rng(66);
  for (let k = 0; k < 40; k++) dots.push({ e: E('circle', { r: 4 + r() * 3, fill: '#FFB27A' }, g), x: r() * 1200, y: 60 + r() * 600, ph: r() * TAU });
  g.upd = t => dots.forEach(({ e, x, y, ph }) => { attr(e, 'cx', x + Math.sin(t * 0.5 + ph) * 20); attr(e, 'cy', y + Math.cos(t * 0.4 + ph) * 16); e.style.opacity = (0.15 + 0.15 * Math.sin(t + ph)).toFixed(3); });
  g.upd(0);
  return g;
}
function enReview(parent) {
  const g = G(parent);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#1C1238', '#0E0A1E', true) }, g);
  const beam = E('path', { d: 'M560,-20 L640,-20 L820,620 L380,620 Z', fill: '#FFF7C2', opacity: 0.08 }, g);
  E('rect', { x: 0, y: 600, width: 1200, height: 150, fill: '#140C28' }, g);
  g.screen = { x: 560, y: 120, w: 600, h: 400 };
  E('rect', { x: 552, y: 112, width: 616, height: 416, rx: 14, fill: '#0A0718', stroke: '#8E6CEF', 'stroke-width': 6 }, g);
  const desk = G(g); tr(desk, 280, 640);
  E('path', { d: 'M-230,-100 L230,-100 L210,60 L-210,60 Z', fill: linGrad('#6A48D8', '#3E2690', true), stroke: SC_INK, 'stroke-width': 5, 'stroke-linejoin': 'round' }, desk);
  T(desk, 0, -36, 'PERFORMANCE', { size: 34, weight: 800, anchor: 'middle', fill: '#FFE45C', ls: 2 });
  T(desk, 0, 4, 'REVIEW', { size: 34, weight: 800, anchor: 'middle', fill: '#FFE45C', ls: 2 });
  g.upd = t => beam.setAttribute('transform', `rotate(${(Math.sin(t * 0.6) * 6).toFixed(2)} 600 -20)`);
  g.upd(0);
  return g;
}
function enPlant(parent) {
  const g = G(parent);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#F2A65A', '#5A3A6B', true) }, g);
  E('rect', { x: 0, y: 560, width: 1200, height: 190, fill: '#3A4A3A' }, g);
  E('path', { d: 'M760,560 L780,330 Q840,300 900,330 L920,560 Z', fill: '#C9C4BC', stroke: '#6E6A62', 'stroke-width': 5 }, g);   // cooling tower
  E('rect', { x: 560, y: 260, width: 50, height: 300, fill: '#8F8A82', stroke: '#5A564F', 'stroke-width': 4 }, g);   // chimney
  E('rect', { x: 520, y: 430, width: 220, height: 130, fill: '#A9A39A', stroke: '#5A564F', 'stroke-width': 4 }, g);
  for (let k = 0; k < 4; k++) E('rect', { x: 540 + k * 50, y: 460, width: 30, height: 30, fill: '#FFE45C', opacity: 0.8 }, g);
  const pyl = x => { const p = G(g); tr(p, x, 560); E('path', { d: 'M-30,0 L0,-200 L30,0 M-20,-60 L20,-60 M-14,-110 L14,-110 M-40,-150 L40,-150 M-34,-180 L34,-180 M-30,0 L14,-110 M30,0 L-14,-110', fill: 'none', stroke: '#2A3B44', 'stroke-width': 4 }, p); return p; };
  pyl(1040); pyl(220);
  E('path', { d: 'M260,380 Q640,430 1000,380', fill: 'none', stroke: '#2A3B44', 'stroke-width': 2 }, g);
  const st = [];
  for (let k = 0; k < 5; k++) st.push(E('circle', { r: 30, fill: '#FFFFFF' }, g));
  g.upd = t => st.forEach((e, k) => { const f = (t * 0.25 + k / 5) % 1; attr(e, 'cx', 840 + Math.sin(f * 4 + k) * 20 + f * 60); attr(e, 'cy', 310 - f * 240); attr(e, 'r', 30 + f * 50); e.style.opacity = (0.7 * (1 - f)).toFixed(3); });
  g.upd(0);
  return g;
}
