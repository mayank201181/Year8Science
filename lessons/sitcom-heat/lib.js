/* BLOCK 34 (Claude Sitcom Ep 9, Heat & Temperature): cast, sets and props.
   Bundled after engine lib.js, kit.js and sitcom.js (scWho, scTalk, scMake, scKavya, scKavyaBody,
   scConfessional, scLowerThird, scVideoCall, scClipboard, SC_INK ...). Every global here starts with `bk`,
   except `cast`.

   CAST: cast(parent, kind, o) -> g, origin at the character's centre, about 200 px tall at s = 1
     o: { s (scale), mood (default mood) }
     g.set({ t, talk, mood, look, sweat, still, ... })   call every frame (moods: neutral | happy | smug |
       annoyed | sad | shock | deadpan; talk 0..1 from scTalk(S, t, who); look -1..1 pupils left/right)
     kinds:
       'cel'    Cel, the liquid-in-glass thermometer on the kitchen wall (tired straight man). Glass tube on a
                nail, red bulb with the face, red column inside, scale ticks.
                Extra: st.temp (°C, default 34) sets the red column (0..50 °C fills the tube).
       'jules'  Jules, thermal energy ("heat"): an orange glowing blob with flame hair, a teal courier cap ("J")
                and an insulated delivery backpack. Over-keen. Flames flicker on their own.
                Extra: st.glow 0..1 (default 0.6) brightness of her halo.
       'gus'    Gus, a water particle (H2O: red O with the face, two white H "ears"), sunglasses on his head.
                Laid back. Extra: st.ice 0..1 encases him in a translucent ice block (frozen in the ice cube);
                st.vib 0..1 makes him vibrate in place (solid), fast jiggle.
       'zip'    Zip, a free electron: small electric-blue ball, yellow lightning-bolt hair, "−" badge, red
                sneakers, speed lines. Hyper: he jitters all the time. Extra: st.zoom 0..1 shows speed lines.
       'ray'    Ray, infrared radiation, an influencer live from the Sun: deep-red wavy-edged disc with a halo,
                a wave tail to the left (animated), heart sunglasses on her head and a phone with a LIVE badge
                to her right. Extra: st.phone 0..1 (default 1) shows the phone.
       'woolly' Woolly, the wool jumper (an insulator nobody wants in June): rust-red knitted jumper with
                drooping sleeves, ribbed collar and cuffs, a cream zig-zag band. Mopey.
       'vic'    Vic, the vacuum between a flask's walls: a dashed outline with nothing inside except a face.
                Never speaks (sound needs particles). The dashes "march" slowly.
       'kavya'  Kavya, 12 (scKavya: head and shoulders, PE shirt "8"); sweat works. Full body: scKavyaBody.
     Talking heads: bkConfessional(parent, kind) (a tinted scConfessional; g.set(p, t)) + scLowerThird.

   SETS (full stage 1200 x 750, drawn bright like a sitcom set; keep the chapter tag area x < 560, y < 100
   clear of anything important):
     bkLiving(parent)   the HDB living room: cream walls, a window with metal grilles and HDB blocks outside,
                        floor tiles in perspective (floor from y 560), a teal sofa (x 640..1100), a wooden coffee
                        table (x 260..540, y ~540), a ceiling fan (centre x 720) and the aircon unit HIGH on the
                        right wall (x 830..1130, y 120..200). g.upd(t, { fan: rev/s, ac: 0..1 })
                        (ac 1: LED green, flap open, cold-air streams pour DOWN from the vent).
                        g.FLOOR = y of the floor line; g.AC = [x, y] of the vent centre.
     bkKitchen(parent)  kitchen: tiled backsplash, counter with a kettle, a fridge-freezer on the right
                        (x 900..1110; g.freezer(p 0..1) opens the freezer door), a nail on the wall where Cel
                        hangs: g.CEL = [x, y] (put cast 'cel' there, s about 1).
     bkStreet(parent)   a sunny HDB estate: blocks, a covered walkway that ENDS at x 520 ("SHELTER ENDS" sign),
                        hot road with shimmer, a parked car wearing a shiny windscreen sunshade (g.car), the Sun
                        top right (g.SUN = [x, y]). g.upd(t)
     bkTrain(parent)    inside an MRT carriage: dark windows with passing tunnel lights, grab poles, long bench
                        seats, ceiling vents breathing frosty air with snowflakes. g.upd(t)
     bkConfessional(parent, kind)  talking-head background tinted for `kind` (any cast kind)

   PROPS (each drawn around its own origin; place with tr):
     bkIceCube(parent, s)    ice cube about 90 px; g.set(melt 0..1): shrinks into a puddle
     bkGlass(parent, s)      glass of iced water (about 120 x 170) with ice cubes and condensation drops
     bkSpoon(parent, s)      steel spoon, bowl at the origin, handle to the right (about 220 long)
     bkTea(parent, s)        a cup of hot tea with steam; g.upd(t)
     bkPool(parent, s)       a blue swimming pool (about 360 x 150) with lane ropes and ripples; g.upd(t)
     bkFlask(parent, s)      vacuum flask about 120 x 300 (centre at origin); g.set(cut 0..1) cross-fades the outside
                             into a cutaway: double glass walls, silvered faces (shiny stripes), the vacuum gap
                             (g.GAP = [x, y] of the left gap, where Vic can sit), iced water inside, the stopper on top
     bkPhone(parent, s)      phone with a red LIVE badge and a heart counter; g.set(n) sets the number shown
     bkClock(parent)         digital wall clock (red digits, about 230 x 90); g.set('8:59')
     bkRemote(parent, s)     aircon remote with a big round button
     bkLogo(parent)          the show logo: "BLOCK 34" in a big outlined title over an HDB block with a thermometer
                             reading 34 °C; about 760 x 260, centred on the origin
     bkChip(parent, text, o) dark pill label readable on any set (chip() with the episode's defaults)
*/

/* ---------- confessional tints ---------- */
const BK_TINT = {
  cel: ['#17302B', '#2E574D'], jules: ['#3A1C0A', '#7A3A12'], gus: ['#0E2C3A', '#14506A'], zip: ['#0E1A3A', '#1E3A7A'],
  ray: ['#3A0F24', '#6E1E46'], woolly: ['#2E1A12', '#5A3422'], vic: ['#101418', '#262E36'], kavya: ['#14243A', '#25446B'],
};
function bkConfessional(parent, kind) { const [a, b] = BK_TINT[kind] || BK_TINT.cel; return scConfessional(parent, a, b); }
function bkChip(parent, text, o) {
  o = o || {};
  return chip(parent, text, { size: o.size || 30, fill: o.fill || 'rgba(10,27,39,0.88)', stroke: o.stroke || C.line, sw: 2, color: o.color || C.ink, weight: o.weight || 700 });
}

/* ---------- the cast ---------- */
const BK_RED = '#F04A4F', BK_REDDK = '#A8232C';
function cast(parent, kind, o) {
  o = o || {};
  if (kind === 'kavya') return scKavya(parent, o);
  const S = { s: o.s, mood: o.mood };
  if (kind === 'cel') {
    let col = null, TOP = -84, BOT = 30;
    return scMake(parent, Object.assign(S, { seed: 4, bob: 1.5,
      draw: g => {
        E('path', { d: 'M0,-112 L0,-96', stroke: '#6B7B8A', 'stroke-width': 4 }, g);                 // the nail and string
        E('circle', { cx: 0, cy: -114, r: 6, fill: '#9AA6B2', stroke: SC_INK, 'stroke-width': 3 }, g);
        E('rect', { x: -28, y: -100, width: 56, height: 150, rx: 28, fill: '#EAF4FA', stroke: SC_INK, 'stroke-width': 5 }, g);   // glass tube
        E('rect', { x: -18, y: -90, width: 8, height: 120, rx: 4, fill: '#FFFFFF', opacity: 0.85 }, g);                         // glass shine
        E('rect', { x: -8, y: TOP, width: 16, height: BOT - TOP, rx: 8, fill: '#F7D9DA' }, g);                                 // empty capillary
        col = E('rect', { x: -8, y: 0, width: 16, height: 10, rx: 8, fill: BK_RED }, g);
        for (let i = 0; i <= 5; i++) E('line', { x1: 12, x2: i % 5 === 0 ? 24 : 19, y1: BOT - (BOT - TOP) * i / 5, y2: BOT - (BOT - TOP) * i / 5, stroke: SC_INK, 'stroke-width': 3 }, g);
        E('circle', { cx: 0, cy: 62, r: 58, fill: ball('#FF7276', BK_REDDK), stroke: SC_INK, 'stroke-width': 5 }, g);         // the bulb
        E('ellipse', { cx: -30, cy: 40, rx: 12, ry: 8, fill: '#FFFFFF', opacity: 0.5 }, g);
      },
      face: { x: 0, y: 56, eye: 16, gap: 50, mouthW: 36, mouthY: 28, lidCol: '#E2585C' },
      upd: (t, g, st) => {
        const temp = st && st.temp !== undefined ? st.temp : 34, f = clamp(temp / 50);
        const y = BOT - (BOT - TOP) * f;
        attr(col, 'y', y); attr(col, 'height', 40 + BOT - y);
      } }));
  }
  if (kind === 'jules') {
    let flames = null, halo = null;
    return scMake(parent, Object.assign(S, { seed: 11, bob: 6,
      draw: g => {
        halo = E('circle', { cx: 0, cy: 10, r: 150, fill: glow(C.heat), opacity: 0.6 }, g);
        const bag = G(g); tr(bag, 92, 4, 1, 8);                                                   // insulated delivery backpack
        E('rect', { x: -40, y: -66, width: 84, height: 122, rx: 12, fill: '#1FA38A', stroke: SC_INK, 'stroke-width': 4 }, bag);
        E('rect', { x: -40, y: -30, width: 84, height: 14, fill: '#FFE45C', stroke: SC_INK, 'stroke-width': 2 }, bag);
        flames = E('path', { d: '', fill: ball('#FFE45C', '#FF8A3D'), stroke: C.heatDk, 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
        E('ellipse', { cx: 0, cy: 14, rx: 88, ry: 84, fill: ball('#FFB45C', '#E8622A'), stroke: C.heatDk, 'stroke-width': 5 }, g);
        const cap = G(g); tr(cap, -6, -58, 1, -8);                                                // courier cap
        E('path', { d: 'M-54,8 Q-54,-38 0,-40 Q54,-38 54,8 Z', fill: '#1FA38A', stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, cap);
        E('path', { d: 'M40,6 Q76,2 92,14 Q70,22 36,16 Z', fill: '#16806C', stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, cap);
        T(cap, 0, -2, 'J', { size: 32, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
        E('ellipse', { cx: -52, cy: 40, rx: 14, ry: 9, fill: '#FF6F6F', opacity: 0.5 }, g);
        E('ellipse', { cx: 52, cy: 40, rx: 14, ry: 9, fill: '#FF6F6F', opacity: 0.5 }, g);
      },
      face: { x: 0, y: 12, eye: 18, gap: 56, mouthW: 44, mouthY: 32, lidCol: '#FF9A4D', iris: '#4A1E06' },
      upd: (t, g, st) => {
        const k = [0, 1, 2].map(i => Math.sin(t * (7 + i * 1.7) + i * 2));
        attr(flames, 'd', `M-62,-40 Q-74,-86 ${-44 + 4 * k[0]},${-112 + 6 * k[0]} Q-36,-82 -22,-74 Q-20,-120 ${4 + 5 * k[1]},${-138 + 8 * k[1]} Q20,-100 26,-74 Q40,-84 ${50 + 4 * k[2]},${-112 + 6 * k[2]} Q72,-84 62,-40 Z`);
        op(halo, (st && st.glow !== undefined ? st.glow : 0.6) * (0.85 + 0.15 * Math.sin(t * 3)));
      } }));
  }
  if (kind === 'gus') {
    let ice = null;
    return scMake(parent, Object.assign(S, { seed: 6, bob: 3,
      draw: g => {
        [-1, 1].forEach(sd => { const h = G(g); tr(h, sd * 80, -50); E('circle', { r: 37, fill: ball(C.hydrogen, C.hydrogenDk), stroke: SC_INK, 'stroke-width': 4 }, h); T(h, 0, 10, 'H', { size: 28, weight: 800, anchor: 'middle', fill: '#7A8A99' }); });
        E('circle', { r: 82, fill: ball(C.oxygen, C.oxygenDk), stroke: SC_INK, 'stroke-width': 5 }, g);
        const sg = G(g); tr(sg, 0, -62, 1, -4);                                                   // sunglasses pushed up
        E('rect', { x: -50, y: -14, width: 42, height: 26, rx: 10, fill: '#1C2430', stroke: SC_INK, 'stroke-width': 3 }, sg);
        E('rect', { x: 8, y: -14, width: 42, height: 26, rx: 10, fill: '#1C2430', stroke: SC_INK, 'stroke-width': 3 }, sg);
        E('path', { d: 'M-8,-4 Q0,-10 8,-4', fill: 'none', stroke: SC_INK, 'stroke-width': 3 }, sg);
        E('path', { d: 'M-40,-8 L-28,-8 M18,-8 L30,-8', stroke: '#8FA3B5', 'stroke-width': 3, 'stroke-linecap': 'round' }, sg);
      },
      face: { x: 0, y: 4, eye: 17, gap: 52, mouthW: 40, mouthY: 30, lidCol: '#E5574A' },
      upd: (t, g, st) => {
        if (!ice) {   // the ice block sits in front of Gus, so it is made after the face
          ice = G(g);
          E('rect', { x: -128, y: -118, width: 256, height: 222, rx: 26, fill: '#BFEAFF', opacity: 0.42, stroke: '#E8F8FF', 'stroke-width': 6 }, ice);
          E('path', { d: 'M-108,-96 L-60,-96 M-108,-80 L-90,-80 M80,70 L108,70', stroke: '#FFFFFF', 'stroke-width': 6, 'stroke-linecap': 'round', opacity: 0.8 }, ice);
        }
        op(ice, st && st.ice ? st.ice : 0);
        const v = st && st.vib ? st.vib : 0;
        if (v) { const b = Math.sin(t * TAU * 0.5 + 6) * 3 * (st.still ? 0 : 1); tr(g, Math.sin(t * 61) * 4 * v, b + Math.cos(t * 53) * 3 * v); }
      } }));
  }
  if (kind === 'zip') {
    let lines = null;
    return scMake(parent, Object.assign(S, { seed: 15, bob: 0,
      draw: g => {
        lines = G(g);
        [[-150, -20, 70], [-160, 14, 90], [-140, 46, 60]].forEach(([x, y, w]) => E('line', { x1: x, y1: y, x2: x + w, y2: y, stroke: '#9FE3FF', 'stroke-width': 7, 'stroke-linecap': 'round' }, lines));
        E('path', { d: 'M-30,-58 L-14,-112 L0,-76 L16,-120 L24,-74 L44,-100 L36,-52 Z', fill: '#FFE45C', stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);   // bolt hair
        [-1, 1].forEach(sd => E('path', { d: `M${sd * 30 - 22},74 Q${sd * 30 - 22},58 ${sd * 30},58 Q${sd * 30 + 26},58 ${sd * 30 + 28},76 Z`, fill: '#E8424F', stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, g));   // sneakers
        E('circle', { r: 72, fill: ball('#7FD4FF', '#1F6FD1'), stroke: SC_INK, 'stroke-width': 5 }, g);
        const badge = G(g); tr(badge, 56, 48);
        E('circle', { r: 20, fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 3 }, badge);
        E('line', { x1: -9, y1: 0, x2: 9, y2: 0, stroke: '#1F6FD1', 'stroke-width': 6, 'stroke-linecap': 'round' }, badge);
      },
      face: { x: 0, y: -4, eye: 18, gap: 52, mouthW: 40, mouthY: 28, lidCol: '#5CBDF5' },
      upd: (t, g, st) => {
        const j = st && st.still ? 0 : 1;
        tr(g, Math.sin(t * 47) * 2.5 * j, Math.sin(t * TAU * 1.4) * 5 * j + Math.cos(t * 41) * 2 * j);
        op(lines, st && st.zoom !== undefined ? st.zoom : 0);
      } }));
  }
  if (kind === 'ray') {
    let tail = null, phone = null;
    const N = 12, R = 80;
    let d = '';
    for (let i = 0; i <= 72; i++) { const a = i / 72 * TAU, r = R + 7 * Math.sin(a * N); d += (i ? 'L' : 'M') + (Math.cos(a) * r).toFixed(1) + ',' + (Math.sin(a) * r).toFixed(1); }
    return scMake(parent, Object.assign(S, { seed: 9, bob: 5,
      draw: g => {
        E('circle', { r: 150, fill: glow('#FF5A6E'), opacity: 0.55 }, g);
        tail = E('path', { d: '', fill: 'none', stroke: '#FF5A6E', 'stroke-width': 12, 'stroke-linecap': 'round' }, g);
        E('path', { d: d + 'Z', fill: ball('#FF6F7E', '#9E1F4F'), stroke: SC_INK, 'stroke-width': 5, 'stroke-linejoin': 'round' }, g);
        const sg = G(g); tr(sg, 0, -66, 1, 6);                                                   // heart sunglasses on the head
        [-1, 1].forEach(sd => E('path', { d: `M${sd * 26},10 C${sd * 26 - 30},-8 ${sd * 26 - 18},-30 ${sd * 26},-16 C${sd * 26 + 18},-30 ${sd * 26 + 30},-8 ${sd * 26},10 Z`, fill: '#2A1630', stroke: '#FF9BD2', 'stroke-width': 4, 'stroke-linejoin': 'round' }, sg));
        E('path', { d: 'M-4,-8 Q0,-12 4,-8', fill: 'none', stroke: '#FF9BD2', 'stroke-width': 4 }, sg);
        phone = G(g); tr(phone, 132, 6, 1, 10);
        E('rect', { x: -30, y: -54, width: 60, height: 108, rx: 10, fill: '#1C2430', stroke: SC_INK, 'stroke-width': 4 }, phone);
        E('rect', { x: -24, y: -44, width: 48, height: 82, rx: 4, fill: linGrad('#FF9A7A', '#B32646', true) }, phone);
        E('rect', { x: -22, y: -40, width: 34, height: 18, rx: 4, fill: '#E8222E' }, phone);
        T(phone, -5, -26, 'LIVE', { size: 13, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
        E('circle', { cx: 0, cy: 46, r: 3, fill: '#5A6B7A' }, phone);
      },
      face: { x: 0, y: 2, eye: 18, gap: 54, mouthW: 44, mouthY: 32, lidCol: '#F0647A' },
      upd: (t, g, st) => {
        let p = '';
        for (let x = 0; x <= 120; x += 6) p += (x ? 'L' : 'M') + (-80 - x) + ',' + (16 * Math.sin(x / 120 * TAU * 1.5 + t * 6) * (x / 120)).toFixed(1);
        attr(tail, 'd', p);
        op(phone, st && st.phone !== undefined ? st.phone : 1);
      } }));
  }
  if (kind === 'woolly') {
    const K = '#C4553D', KD = '#8C3524', KL = '#F3E2C2';
    return scMake(parent, Object.assign(S, { seed: 2, bob: 2,
      draw: g => {
        [-1, 1].forEach(sd => {   // drooping sleeves
          E('path', { d: `M${sd * 70},-62 Q${sd * 118},-50 ${sd * 116},56 L${sd * 86},60 Q${sd * 86},-10 ${sd * 66},-20 Z`, fill: K, stroke: SC_INK, 'stroke-width': 5, 'stroke-linejoin': 'round' }, g);
          E('rect', { x: sd > 0 ? 84 : -118, y: 54, width: 34, height: 24, rx: 8, fill: KD, stroke: SC_INK, 'stroke-width': 4 }, g);
        });
        E('path', { d: 'M-80,-66 Q-84,-80 -50,-86 L50,-86 Q84,-80 80,-66 L84,80 Q0,92 -84,80 Z', fill: K, stroke: SC_INK, 'stroke-width': 5, 'stroke-linejoin': 'round' }, g);
        let knit = '';
        for (let y = -54; y < 76; y += 18) for (let x = -66; x < 70; x += 22) knit += `M${x},${y} l6,7 l6,-7 `;
        E('path', { d: knit, fill: 'none', stroke: KD, 'stroke-width': 2.5, opacity: 0.55 }, g);
        E('path', { d: 'M-83,44 L83,44 L83,64 L-83,64 Z', fill: KL, stroke: SC_INK, 'stroke-width': 3 }, g);     // cream band
        let z2 = ''; for (let i = 0; i < 12; i++) { const x = -80 + i * 14; z2 += `M${x},62 L${x + 7},48 L${x + 14},62 `; }
        E('path', { d: z2, fill: 'none', stroke: K, 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
        E('path', { d: 'M-82,74 Q0,88 82,74 L84,92 Q0,104 -84,92 Z', fill: KD, stroke: SC_INK, 'stroke-width': 4 }, g);      // ribbed hem
        E('path', { d: 'M-46,-86 Q0,-60 46,-86 Q0,-104 -46,-86 Z', fill: KD, stroke: SC_INK, 'stroke-width': 4 }, g);          // collar
      },
      face: { x: 0, y: -14, eye: 17, gap: 52, mouthW: 40, mouthY: 28, lidCol: '#D9725A' } }));
  }
  if (kind === 'vic') {
    let ring = null;
    return scMake(parent, Object.assign(S, { seed: 13, bob: 1.5,
      draw: g => {
        E('ellipse', { rx: 92, ry: 86, fill: '#FFFFFF', opacity: 0.04 }, g);
        ring = E('ellipse', { rx: 92, ry: 86, fill: 'none', stroke: '#C9D6E2', 'stroke-width': 5, 'stroke-dasharray': '16 12', 'stroke-linecap': 'round' }, g);
      },
      face: { x: 0, y: 0, eye: 18, gap: 56, mouthW: 30, mouthY: 30, lidCol: '#8FA3B5' },
      upd: t => attr(ring, 'stroke-dashoffset', -(t * 6) % 28) }));
  }
  return scMake(parent, Object.assign(S, { face: { eye: 16, gap: 50, mouthW: 40, mouthY: 30 } }));
}

/* ---------- sets ---------- */
function bkLiving(parent) {
  const g = G(parent), FLOOR = 560;
  E('rect', { x: 0, y: 0, width: 1200, height: FLOOR, fill: linGrad('#F4E6C8', '#E6CFA2', true) }, g);
  E('rect', { x: 0, y: FLOOR - 16, width: 1200, height: 16, fill: '#C9A878' }, g);                  // skirting
  // floor tiles in perspective (vanishing point 600, 250)
  E('rect', { x: 0, y: FLOOR, width: 1200, height: 750 - FLOOR, fill: '#DCD6CB' }, g);
  let d = '';
  for (let xb = -900; xb <= 2100; xb += 150) d += `M${(600 + (xb - 600) * 0.62).toFixed(1)},${FLOOR} L${xb},750 `;
  [590, 628, 676, 738].forEach(y => d += `M0,${y} L1200,${y} `);
  E('path', { d, stroke: '#B9B1A3', 'stroke-width': 3, fill: 'none' }, g);
  // window with grilles and HDB blocks outside
  const win_ = G(g); tr(win_, 70, 130);
  E('rect', { x: 0, y: 0, width: 380, height: 280, fill: linGrad('#7CCBFF', '#CDEEFF', true), stroke: '#FFFFFF', 'stroke-width': 12 }, win_);
  [[20, 90, 110, 190, '#F2B880'], [150, 50, 100, 230, '#9FD3C7'], [270, 110, 100, 170, '#F5D07A']].forEach(([x, y, w, h, c]) => {
    E('rect', { x, y, width: w, height: h, fill: c }, win_);
    let wd = ''; for (let yy = y + 14; yy < y + h - 10; yy += 22) for (let xx = x + 12; xx < x + w - 12; xx += 22) wd += `M${xx},${yy} h10 v10 h-10 Z `;
    E('path', { d: wd, fill: '#FFFFFF', opacity: 0.7 }, win_);
  });
  let gr = ''; for (let x = 32; x < 380; x += 38) gr += `M${x},0 L${x},280 `;
  E('path', { d: gr + 'M0,140 L380,140', stroke: '#5E6B76', 'stroke-width': 6 }, win_);
  E('rect', { x: -6, y: 270, width: 392, height: 20, rx: 4, fill: '#FFFFFF', stroke: '#C9B48E', 'stroke-width': 3 }, win_);
  // sofa
  const sofa = G(g); tr(sofa, 870, 560);
  E('rect', { x: -230, y: -170, width: 460, height: 120, rx: 30, fill: '#3E7C8C', stroke: SC_INK, 'stroke-width': 5 }, sofa);
  E('rect', { x: -210, y: -70, width: 420, height: 60, rx: 16, fill: '#4F93A3', stroke: SC_INK, 'stroke-width': 5 }, sofa);
  E('rect', { x: -250, y: -130, width: 56, height: 130, rx: 22, fill: '#356B79', stroke: SC_INK, 'stroke-width': 5 }, sofa);
  E('rect', { x: 194, y: -130, width: 56, height: 130, rx: 22, fill: '#356B79', stroke: SC_INK, 'stroke-width': 5 }, sofa);
  E('line', { x1: 0, y1: -68, x2: 0, y2: -12, stroke: SC_INK, 'stroke-width': 3, opacity: 0.5 }, sofa);
  // wooden coffee table
  const tab = G(g); tr(tab, 400, 560);
  E('rect', { x: -140, y: -40, width: 280, height: 22, rx: 6, fill: '#A86A38', stroke: SC_INK, 'stroke-width': 4 }, tab);
  E('rect', { x: -124, y: -18, width: 16, height: 30, fill: '#7E4A22', stroke: SC_INK, 'stroke-width': 3 }, tab);
  E('rect', { x: 108, y: -18, width: 16, height: 30, fill: '#7E4A22', stroke: SC_INK, 'stroke-width': 3 }, tab);
  E('path', { d: 'M-120,-30 Q-40,-36 40,-30 T120,-30', fill: 'none', stroke: '#7E4A22', 'stroke-width': 2, opacity: 0.6 }, tab);
  // aircon, high on the right wall
  const ac = G(g); tr(ac, 980, 160);
  E('rect', { x: -150, y: -40, width: 300, height: 80, rx: 18, fill: '#FAFCFD', stroke: '#A9B5C0', 'stroke-width': 4 }, ac);
  E('line', { x1: -130, y1: 8, x2: 130, y2: 8, stroke: '#D6DEE5', 'stroke-width': 3 }, ac);
  const flap = E('rect', { x: -130, y: 26, width: 260, height: 8, rx: 4, fill: '#C9D3DC' }, ac);
  const led = E('circle', { cx: 120, cy: -16, r: 6, fill: '#8FA3B5' }, ac);
  const airG = G(ac), airs = [];
  for (let i = 0; i < 5; i++) airs.push(E('path', { d: `M${-100 + i * 50},40 q-20,60 0,120 q20,60 0,120 q-20,60 0,120`, fill: 'none', stroke: '#9FD8FF', 'stroke-width': 6, 'stroke-linecap': 'round', 'stroke-dasharray': '26 22', opacity: 0.8 }, airG));
  // ceiling fan
  const fan = G(g); tr(fan, 720, 0);
  E('line', { x1: 0, y1: 0, x2: 0, y2: 52, stroke: '#7A6A58', 'stroke-width': 8 }, fan);
  const blades = [0, 1, 2].map(() => E('path', { d: '', fill: '#B98A5A', stroke: SC_INK, 'stroke-width': 3, 'stroke-linejoin': 'round' }, fan));
  E('ellipse', { cx: 0, cy: 60, rx: 28, ry: 14, fill: '#8E7A64', stroke: SC_INK, 'stroke-width': 3 }, fan);
  g.FLOOR = FLOOR; g.AC = [980, 200]; g.ac = ac;
  g.upd = (t, o) => {
    o = o || {};
    const sp = o.fan === undefined ? 0.6 : o.fan, on = o.ac || 0;
    blades.forEach((b, i) => {
      const a = t * sp * TAU + i * TAU / 3, x = Math.cos(a) * 150, y = 60 + Math.sin(a) * 16, w = 10 + 6 * Math.abs(Math.sin(a));
      attr(b, 'd', `M0,${56} L${x.toFixed(1)},${(y - w / 2).toFixed(1)} Q${(x * 1.06).toFixed(1)},${y.toFixed(1)} ${x.toFixed(1)},${(y + w / 2).toFixed(1)} L0,64 Z`);
    });
    attr(led, 'fill', on > 0.5 ? '#3BE07A' : '#8FA3B5');
    tr(flap, 0, 6 * on, 1, 0);
    op(airG, on);
    airs.forEach((a, i) => attr(a, 'stroke-dashoffset', -((t * 60 + i * 13) % 48)));
  };
  g.upd(0);
  return g;
}

function bkKitchen(parent) {
  const g = G(parent);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#EAF0E4', '#D7E2CF', true) }, g);
  // backsplash tiles
  E('rect', { x: 0, y: 360, width: 880, height: 150, fill: '#F7FAFB' }, g);
  let d = ''; for (let x = 0; x <= 880; x += 50) d += `M${x},360 L${x},510 `; for (let y = 360; y <= 510; y += 50) d += `M0,${y} L880,${y} `;
  E('path', { d, stroke: '#BFD0DA', 'stroke-width': 3 }, g);
  // counter and cupboards
  E('rect', { x: 0, y: 500, width: 880, height: 26, fill: '#6F7C86', stroke: SC_INK, 'stroke-width': 4 }, g);
  E('rect', { x: 0, y: 526, width: 880, height: 224, fill: '#C98F5A', stroke: SC_INK, 'stroke-width': 4 }, g);
  [0, 220, 440, 660].forEach(x => { E('rect', { x: x + 14, y: 546, width: 192, height: 190, rx: 8, fill: '#D9A06A', stroke: SC_INK, 'stroke-width': 3 }, g); E('rect', { x: x + 160, y: 620, width: 10, height: 44, rx: 5, fill: '#8C6239' }, g); });
  // kettle
  const k = G(g); tr(k, 700, 500);
  E('path', { d: 'M-50,0 L-40,-80 Q0,-96 40,-80 L50,0 Z', fill: '#E8424F', stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, k);
  E('path', { d: 'M-24,-90 Q0,-120 24,-90', fill: 'none', stroke: SC_INK, 'stroke-width': 7 }, k);
  E('path', { d: 'M48,-40 L84,-66 L80,-52 L52,-22 Z', fill: '#E8424F', stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, k);
  // fridge-freezer
  const fr = G(g); tr(fr, 1005, 400);
  E('rect', { x: -105, y: -260, width: 210, height: 500, rx: 16, fill: '#F2F6F8', stroke: SC_INK, 'stroke-width': 5 }, fr);
  E('rect', { x: -96, y: -60, width: 192, height: 290, rx: 10, fill: '#E9EFF2', stroke: '#A9B5C0', 'stroke-width': 3 }, fr);
  E('rect', { x: -84, y: 10, width: 12, height: 90, rx: 6, fill: '#A9B5C0' }, fr);
  const fzIn = E('rect', { x: -96, y: -250, width: 192, height: 180, rx: 8, fill: '#CFEFFF', stroke: '#9FD8FF', 'stroke-width': 3 }, fr);
  const fzDoor = G(fr);
  E('rect', { x: -96, y: -250, width: 192, height: 180, rx: 10, fill: '#E9EFF2', stroke: '#A9B5C0', 'stroke-width': 3 }, fzDoor);
  E('rect', { x: -84, y: -150, width: 12, height: 60, rx: 6, fill: '#A9B5C0' }, fzDoor);
  // magnets on the fridge
  E('circle', { cx: 40, cy: 60, r: 14, fill: '#FFC247', stroke: SC_INK, 'stroke-width': 2 }, fr);
  E('rect', { x: 10, y: 90, width: 60, height: 44, rx: 4, fill: '#FFFFFF', stroke: '#C9D3DC', 'stroke-width': 2, transform: 'rotate(-6 40 112)' }, fr);
  // the nail for Cel
  E('circle', { cx: 380, cy: 138, r: 6, fill: '#9AA6B2' }, g);
  g.CEL = [380, 252];
  g.freezer = p => { p = clamp(p); fzDoor.setAttribute('transform', `translate(-96 0) scale(${(1 - 1.6 * p).toFixed(3)} 1) translate(96 0)`); op(fzIn, p > 0.02 ? 1 : 0); };
  g.freezer(0);
  return g;
}

function bkStreet(parent) {
  const g = G(parent);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#58BFFF', '#CDEFFF', true) }, g);
  const sunG = sun(g, 62); tr(sunG, 1060, 120);
  // HDB blocks
  [[40, 150, 170, 360, '#F2B880'], [240, 110, 160, 400, '#A9D8CF'], [430, 170, 150, 340, '#F5D07A'], [610, 130, 190, 380, '#C9B6E8'], [830, 200, 140, 310, '#F7A8A0']].forEach(([x, y, w, h, c], i) => {
    E('rect', { x, y, width: w, height: h, fill: c, stroke: '#8A7F72', 'stroke-width': 3 }, g);
    E('rect', { x, y, width: w, height: 18, fill: '#FFFFFF', opacity: 0.5 }, g);
    let wd = ''; for (let yy = y + 30; yy < y + h - 20; yy += 26) for (let xx = x + 14; xx < x + w - 16; xx += 26) wd += `M${xx},${yy} h12 v12 h-12 Z `;
    E('path', { d: wd, fill: '#FFFFFF', opacity: 0.75 }, g);
    if (i === 1) T(g, x + w / 2, y + 50, 'BLK 34', { size: 26, weight: 800, anchor: 'middle', fill: '#2A5A52' });
  });
  E('rect', { x: 0, y: 500, width: 1200, height: 40, fill: '#6CC27A' }, g);       // grass verge
  // the road
  E('rect', { x: 0, y: 540, width: 1200, height: 210, fill: '#5B6670' }, g);
  E('path', { d: 'M0,650 L1200,650', stroke: '#F2F7FA', 'stroke-width': 6, 'stroke-dasharray': '50 40' }, g);
  // covered walkway that ends
  const cw = G(g);
  E('rect', { x: -10, y: 380, width: 530, height: 26, fill: '#3E6E8E', stroke: SC_INK, 'stroke-width': 4 }, cw);
  [20, 180, 340, 500].forEach(x => E('rect', { x, y: 404, width: 12, height: 140, fill: '#8FA3B5', stroke: SC_INK, 'stroke-width': 3 }, cw));
  E('rect', { x: 0, y: 540, width: 520, height: 20, fill: '#B9B1A3' }, cw);
  const sign = G(g); tr(sign, 610, 470);
  E('rect', { x: -4, y: -10, width: 8, height: 80, fill: '#8FA3B5' }, sign);
  E('rect', { x: -86, y: -66, width: 172, height: 62, rx: 8, fill: '#FFFFFF', stroke: '#C62828', 'stroke-width': 4 }, sign);
  T(sign, 0, -40, 'SHELTER', { size: 22, weight: 800, anchor: 'middle', fill: '#C62828' });
  T(sign, 0, -14, 'ENDS HERE', { size: 22, weight: 800, anchor: 'middle', fill: '#C62828' });
  // parked car with a shiny sunshade
  const car = G(g); tr(car, 960, 640);
  E('path', { d: 'M-160,20 L-150,-30 Q-140,-46 -110,-50 L-70,-96 Q-60,-104 -40,-104 L70,-104 Q90,-104 100,-92 L130,-50 Q160,-46 166,-20 L170,20 Z', fill: '#2E7DD8', stroke: SC_INK, 'stroke-width': 5, 'stroke-linejoin': 'round' }, car);
  const shade = E('path', { d: 'M-62,-92 L-10,-92 L-10,-54 L-96,-54 Z', fill: linGrad('#FFFFFF', '#B9C9D8', false), stroke: '#8FA3B5', 'stroke-width': 3 }, car);
  let pleats = ''; for (let x = -80; x < -10; x += 10) pleats += `M${x},-54 L${x + 6},-92 `;
  E('path', { d: pleats, stroke: '#9AA6B2', 'stroke-width': 2 }, car);
  E('path', { d: 'M4,-92 L80,-92 L112,-54 L4,-54 Z', fill: '#9FD8FF', stroke: SC_INK, 'stroke-width': 3 }, car);
  [-100, 104].forEach(x => { E('circle', { cx: x, cy: 22, r: 30, fill: '#1C2430', stroke: SC_INK, 'stroke-width': 4 }, car); E('circle', { cx: x, cy: 22, r: 12, fill: '#9AA6B2' }, car); });
  const glint = E('path', { d: 'M-50,-84 L-40,-62', stroke: '#FFFFFF', 'stroke-width': 5, 'stroke-linecap': 'round' }, car);
  // shimmer over the road
  const shim = G(g), sh = [];
  for (let i = 0; i < 6; i++) { const w = heatWaves(shim, { n: 2, h: 60, spacing: 18, color: '#FFFFFF', width: 3 }); tr(w, 120 + i * 170, 700); sh.push(w); }
  op(shim, 0.45);
  g.SUN = [1060, 120]; g.car = car; g.shade = shade;
  g.upd = t => { sunG.upd(t); sh.forEach((w, i) => w.upd(t + i * 0.4)); op(glint, 0.4 + 0.6 * wave(t, 1.6)); };
  g.upd(0);
  return g;
}

function bkTrain(parent) {
  const g = G(parent);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#E4EBF0', '#C9D3DC', true) }, g);
  // windows with the tunnel outside
  const lights = [];
  [[60, 150], [440, 150], [820, 150]].forEach(([x, y]) => {
    E('rect', { x, y, width: 320, height: 200, rx: 26, fill: '#1A2430', stroke: '#8FA3B5', 'stroke-width': 8 }, g);
    const cpId = 'bktw' + x; const cp = E('clipPath', { id: cpId }, defs()); E('rect', { x, y, width: 320, height: 200, rx: 26 }, cp);
    const lg = G(g, { 'clip-path': `url(#${cpId})` });
    for (let i = 0; i < 2; i++) lights.push({ el: E('rect', { x: 0, y: y + 60, width: 90, height: 10, rx: 5, fill: '#FFE9A8', opacity: 0.85 }, lg), x0: x, ph: i * 0.5 });
  });
  // ceiling vents with frosty air
  const vents = G(g), frost = [];
  [220, 600, 980].forEach(x => {
    E('rect', { x: x - 120, y: 96, width: 240, height: 26, rx: 8, fill: '#F7FAFB', stroke: '#8FA3B5', 'stroke-width': 3 }, vents);
    for (let i = 0; i < 6; i++) E('line', { x1: x - 100 + i * 40, y1: 102, x2: x - 100 + i * 40, y2: 118, stroke: '#A9B5C0', 'stroke-width': 4 }, vents);
    for (let i = 0; i < 3; i++) { const f = G(vents); frost.push({ f, x: x - 60 + i * 60, ph: i * 0.33 + x * 0.001 });
      E('path', { d: 'M0,-10 L0,10 M-9,-5 L9,5 M-9,5 L9,-5', stroke: '#BFEAFF', 'stroke-width': 3, 'stroke-linecap': 'round' }, f); }
  });
  // grab poles
  [400, 800].forEach(x => E('rect', { x: x - 7, y: 120, width: 14, height: 480, rx: 7, fill: linGrad('#F2F7FA', '#9AA6B2', false), stroke: '#6B7B8A', 'stroke-width': 2 }, g));
  // bench seats
  E('rect', { x: 0, y: 480, width: 1200, height: 60, rx: 10, fill: '#3F6FB5', stroke: SC_INK, 'stroke-width': 4 }, g);
  E('rect', { x: 0, y: 540, width: 1200, height: 70, fill: '#2F5590', stroke: SC_INK, 'stroke-width': 4 }, g);
  let seams = ''; for (let x = 150; x < 1200; x += 150) seams += `M${x},484 L${x},536 `;
  E('path', { d: seams, stroke: '#2F5590', 'stroke-width': 3 }, g);
  E('rect', { x: 0, y: 610, width: 1200, height: 140, fill: '#9AA6B2' }, g);
  g.upd = t => {
    lights.forEach(L => { const u = ((t * 1.3 + L.ph) % 1); attr(L.el, 'x', L.x0 + 330 - u * 440); });
    frost.forEach(F => { const u = (t * 0.45 + F.ph) % 1; tr(F.f, F.x + 10 * Math.sin(t * 2 + F.ph * 9), 130 + u * 150, 1, t * 40); op(F.f, Math.sin(u * Math.PI) * 0.9); });
  };
  g.upd(0);
  return g;
}

/* ---------- props ---------- */
function bkIceCube(parent, s) {
  const g = G(parent), inner = G(g); tr(g, 0, 0, s || 1);
  const pud = E('ellipse', { cx: 0, cy: 44, rx: 0, ry: 0, fill: '#9FD8FF', opacity: 0.7 }, g);
  const cube = G(inner);
  E('rect', { x: -45, y: -45, width: 90, height: 90, rx: 16, fill: '#D7F2FF', opacity: 0.85, stroke: '#7FC7EE', 'stroke-width': 4 }, cube);
  E('path', { d: 'M-30,-30 L6,-30 M-30,-30 L-30,0', stroke: '#FFFFFF', 'stroke-width': 7, 'stroke-linecap': 'round' }, cube);
  g.set = m => { m = clamp(m); tr(cube, 0, 45 * m, Math.max(0.01, 1 - 0.92 * m)); attr(pud, 'rx', 70 * m); attr(pud, 'ry', 14 * m); op(cube, 1 - clamp((m - 0.85) / 0.15)); };
  g.set(0);
  return g;
}
function bkGlass(parent, s) {
  const g = G(parent); tr(g, 0, 0, s || 1);
  E('path', { d: 'M-60,-85 L-50,85 L50,85 L60,-85', fill: 'rgba(200,230,250,0.18)', stroke: '#CFE7F5', 'stroke-width': 5, 'stroke-linejoin': 'round' }, g);
  E('path', { d: 'M-57,-40 L-50,82 L50,82 L57,-40 Z', fill: '#7FD0F5', opacity: 0.55 }, g);
  [[-22, -34, 10], [18, -40, -12], [0, -4, 20]].forEach(([x, y, r]) => E('rect', { x: x - 20, y: y - 20, width: 40, height: 40, rx: 8, fill: '#E6F7FF', opacity: 0.9, stroke: '#7FC7EE', 'stroke-width': 3, transform: `rotate(${r} ${x} ${y})` }, g));
  [[-50, 10], [-46, 46], [50, 0], [46, 40], [54, -30]].forEach(([x, y]) => E('path', { d: `M${x},${y - 7} Q${x + 5},${y + 2} ${x},${y + 5} Q${x - 5},${y + 2} ${x},${y - 7} Z`, fill: '#FFFFFF', opacity: 0.8 }, g));
  E('path', { d: 'M-44,-70 L-38,60', stroke: '#FFFFFF', 'stroke-width': 6, opacity: 0.5, 'stroke-linecap': 'round' }, g);
  return g;
}
function bkSpoon(parent, s) {
  const g = G(parent); tr(g, 0, 0, s || 1);
  E('path', { d: 'M30,-8 L210,-14 Q222,0 210,14 L30,8 Z', fill: linGrad('#F2F7FA', '#8FA3B5', true), stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
  E('ellipse', { rx: 46, ry: 32, fill: ball('#F2F7FA', '#7F8E9C'), stroke: SC_INK, 'stroke-width': 4 }, g);
  E('ellipse', { cx: -14, cy: -10, rx: 14, ry: 7, fill: '#FFFFFF', opacity: 0.8 }, g);
  return g;
}
function bkTea(parent, s) {
  const g = G(parent); tr(g, 0, 0, s || 1);
  const st = heatWaves(g, { n: 3, h: 70, spacing: 24, color: '#FFFFFF', width: 4 }); tr(st, 0, -50);
  E('path', { d: 'M56,-20 Q96,-18 92,14 Q88,40 52,34', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 10 }, g);
  E('path', { d: 'M-62,-44 L62,-44 L52,40 Q0,56 -52,40 Z', fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
  E('ellipse', { cx: 0, cy: -44, rx: 62, ry: 12, fill: '#B5733A', stroke: SC_INK, 'stroke-width': 3 }, g);
  E('ellipse', { cx: 0, cy: 50, rx: 86, ry: 12, fill: '#F2F7FA', stroke: SC_INK, 'stroke-width': 3 }, g);
  g.upd = t => st.upd(t);
  g.upd(0);
  return g;
}
function bkPool(parent, s) {
  const g = G(parent); tr(g, 0, 0, s || 1);
  E('rect', { x: -190, y: -80, width: 380, height: 160, rx: 14, fill: '#F2F7FA', stroke: SC_INK, 'stroke-width': 4 }, g);
  E('rect', { x: -176, y: -66, width: 352, height: 132, rx: 8, fill: linGrad('#5FD3F5', '#1D84A6', true) }, g);
  [-22, 22].forEach(y => E('line', { x1: -176, y1: y, x2: 176, y2: y, stroke: '#FFE45C', 'stroke-width': 4, 'stroke-dasharray': '10 8' }, g));
  const rip = E('path', { d: '', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 3, opacity: 0.6 }, g);
  g.upd = t => { let d = ''; [-44, 0, 44].forEach((y, j) => { d += `M-160,${y}`; for (let x = -160; x <= 160; x += 20) d += ` L${x},${(y + 4 * Math.sin(x / 30 + t * 2 + j)).toFixed(1)}`; }); attr(rip, 'd', d); };
  g.upd(0);
  return g;
}
function bkFlask(parent, s) {
  const g = G(parent); tr(g, 0, 0, s || 1);
  const out = G(g), cut = G(g);
  // outside
  E('rect', { x: -60, y: -120, width: 120, height: 270, rx: 30, fill: linGrad('#2FA39A', '#1C6E68', false), stroke: SC_INK, 'stroke-width': 5 }, out);
  E('rect', { x: -48, y: -160, width: 96, height: 50, rx: 12, fill: '#E9EFF2', stroke: SC_INK, 'stroke-width': 5 }, out);
  E('rect', { x: -40, y: -100, width: 14, height: 220, rx: 7, fill: '#FFFFFF', opacity: 0.35 }, out);
  // cutaway
  E('rect', { x: -60, y: -120, width: 120, height: 270, rx: 30, fill: '#1C2430', stroke: SC_INK, 'stroke-width': 5 }, cut);           // outer case
  E('rect', { x: -48, y: -108, width: 96, height: 246, rx: 22, fill: '#0B1118', stroke: '#E9EFF2', 'stroke-width': 6 }, cut);          // outer glass wall, silvered inside
  E('rect', { x: -30, y: -96, width: 60, height: 220, rx: 14, fill: '#7FD0F5', stroke: '#E9EFF2', 'stroke-width': 6 }, cut);           // inner wall + iced water
  [[-12, -30, 10], [8, 10, -14], [-6, 56, 18]].forEach(([x, y, r]) => E('rect', { x: x - 12, y: y - 12, width: 24, height: 24, rx: 5, fill: '#E6F7FF', opacity: 0.9, transform: `rotate(${r} ${x} ${y})` }, cut));
  [-45, 31].forEach(x => E('path', { d: `M${x},-80 L${x + 14},-100 M${x},20 L${x + 14},0 M${x},100 L${x + 14},80`, stroke: '#FFFFFF', 'stroke-width': 3, opacity: 0.9 }, cut));   // shine
  E('path', { d: 'M-36,-152 L36,-152 L30,-98 L-30,-98 Z', fill: '#B98A5A', stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, cut);   // stopper
  g.GAP = [-39, 10];
  g.set = c => { c = clamp(c); op(out, 1 - c); op(cut, c); };
  g.set(0);
  return g;
}
function bkPhone(parent, s) {
  const g = G(parent); tr(g, 0, 0, s || 1);
  E('rect', { x: -70, y: -130, width: 140, height: 260, rx: 22, fill: '#1C2430', stroke: SC_INK, 'stroke-width': 5 }, g);
  E('rect', { x: -58, y: -108, width: 116, height: 214, rx: 10, fill: linGrad('#FFB36B', '#C2264B', true) }, g);
  E('rect', { x: -50, y: -98, width: 66, height: 30, rx: 6, fill: '#E8222E' }, g);
  T(g, -17, -76, 'LIVE', { size: 22, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  const heart = G(g); tr(heart, -30, 80);
  E('path', { d: 'M0,10 C-26,-6 -14,-26 0,-12 C14,-26 26,-6 0,10 Z', fill: '#FF5FA2' }, heart);
  const n = T(g, 0, 90, '0', { size: 26, weight: 800, fill: '#FFFFFF' });
  g.set = v => setText(n, String(v));
  return g;
}
function bkClock(parent) {
  const g = G(parent);
  E('rect', { x: -115, y: -45, width: 230, height: 90, rx: 14, fill: '#1C2430', stroke: SC_INK, 'stroke-width': 5 }, g);
  const txt = T(g, 0, 22, '8:59', { size: 62, weight: 800, anchor: 'middle', fill: '#FF4D4D' });
  T(g, 92, 30, 'PM', { size: 18, weight: 800, anchor: 'middle', fill: '#FF4D4D' });
  g.set = s => setText(txt, s);
  return g;
}
function bkRemote(parent, s) {
  const g = G(parent); tr(g, 0, 0, s || 1);
  E('rect', { x: -34, y: -90, width: 68, height: 180, rx: 22, fill: '#F2F7FA', stroke: SC_INK, 'stroke-width': 4 }, g);
  E('rect', { x: -22, y: -74, width: 44, height: 26, rx: 4, fill: '#9FD8FF' }, g);
  E('circle', { cx: 0, cy: -10, r: 18, fill: '#E8424F', stroke: SC_INK, 'stroke-width': 3 }, g);
  for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) E('rect', { x: -20 + j * 24, y: 22 + i * 20, width: 16, height: 12, rx: 3, fill: '#C9D3DC' }, g);
  return g;
}
function bkLogo(parent) {
  const g = G(parent);
  const blk = G(g); tr(blk, 0, 20);
  E('rect', { x: -330, y: -110, width: 660, height: 200, rx: 18, fill: '#F2B880', stroke: '#5A2B07', 'stroke-width': 6 }, blk);
  let wd = ''; for (let y = -88; y < 70; y += 34) for (let x = -300; x < 300; x += 40) wd += `M${x},${y} h22 v20 h-22 Z `;
  E('path', { d: wd, fill: '#FFF3DE', opacity: 0.55 }, blk);
  const t = T(g, -56, 52, 'BLOCK 34', { size: 132, weight: 800, anchor: 'middle', fill: '#FFE45C' });
  t.setAttribute('stroke', '#5A2B07'); t.setAttribute('stroke-width', 14); t.setAttribute('paint-order', 'stroke'); t.setAttribute('stroke-linejoin', 'round');
  const th = G(g); tr(th, 368, 40, 1, 10);
  E('rect', { x: -20, y: -150, width: 40, height: 170, rx: 20, fill: '#EAF4FA', stroke: '#5A2B07', 'stroke-width': 5 }, th);
  E('rect', { x: -8, y: -86, width: 16, height: 110, rx: 8, fill: BK_RED }, th);
  E('circle', { cx: 0, cy: 40, r: 36, fill: ball('#FF7276', BK_REDDK), stroke: '#5A2B07', 'stroke-width': 5 }, th);
  T(th, 0, 52, '34°', { size: 30, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  return g;
}
