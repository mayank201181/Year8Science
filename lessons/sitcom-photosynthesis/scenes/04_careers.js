/* Scene 4: Gus's careers day.
   Noon on the factory floor: Guses pour off the belt, the careers fair pops up -> Gus with his CV ("Can I be a
   manager?") -> four booths, each a close-up with Clive presenting: 1 respiration (a tired mitochondrion with a
   mug; yawns), a day/night strip (respiration always, photosynthesis only in light), 2 storage (glucose clicks
   into a starch chain; leaves, stems, seeds), Gus holding hands with hundreds of Guses, starch is insoluble (two
   beakers), 3 cellulose (a cell wall built like bricks; Plant stands up straight), 4 proteins (glucose + nitrates
   -> protein -> growth) -> "Really Sweet Crunchy Plants" with Gus dancing -> Phyllis: magnesium, chlorosis,
   "I don't want to talk about it" (sunglasses down) -> where does a plant's mass come from? -> Cosmo: carbon
   dioxide -> a log made of tiny Cosmos -> Clive, deadpan. */
scene('careers', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;
  const talk = (t, who) => scTalk(S, t, who);

  /* ---------- local helpers (prefixed careers) ---------- */
  function careersPop(el, x, y, p, s, r) { op(el, clamp(p * 2.5)); tr(el, x, y, Math.max(0.01, (s || 1) * (0.6 + 0.4 * p)), r); }
  function careersCam(el, k, cx, cy, sx, sy) {
    el.setAttribute('transform', `translate(${(sx ?? cx).toFixed(1)} ${(sy ?? cy).toFixed(1)}) scale(${k.toFixed(4)}) translate(${(-cx).toFixed(1)} ${(-cy).toFixed(1)})`);
  }
  function careersLabel(parent, text, o) {
    o = o || {};
    return chip(parent, text, { size: o.size || 30, fill: o.fill || 'rgba(10,27,39,0.88)', stroke: o.stroke || C.line, sw: o.sw || 2.5, color: o.color || C.ink, weight: o.weight || 700, font: o.font });
  }
  // text with real subscripts: 'CO_2' -> CO₂
  function careersRich(parent, x, y, str, o) {
    o = o || {};
    const size = o.size || 32, sub = Math.round(size * 0.62), dy = Math.round(size * 0.24);
    const t = E('text', { x, y, 'font-size': size, 'font-weight': o.weight || 700, fill: o.fill || C.ink, 'text-anchor': o.anchor || 'middle', 'font-family': FD }, parent);
    str.split(/_(\d+)/).forEach((seg, i) => {
      if (!seg) return;
      const ts = E('tspan', i % 2 ? { 'font-size': sub, dy } : (i > 0 ? { dy: -dy } : {}), t); ts.textContent = seg;
    });
    return t;
  }
  // a cheap Gus look-alike (hexagon, ring oxygen, smiling face): for the starch chain
  function careersMiniGus(parent) {
    const g = G(parent), pts = phHex(94, true);
    E('path', { d: 'M-4,-90 Q-24,-122 2,-132 M4,-90 Q12,-124 34,-120', fill: 'none', stroke: SC_INK, 'stroke-width': 6, 'stroke-linecap': 'round' }, g);
    E('path', { d: phPoly(pts), fill: ball(C.glucose, C.glucoseDk), stroke: SC_INK, 'stroke-width': 6, 'stroke-linejoin': 'round' }, g);
    E('circle', { cx: pts[1][0], cy: pts[1][1], r: 15, fill: C.oxygen, stroke: SC_INK, 'stroke-width': 3 }, g);
    E('path', { d: 'M-48,-10 a20,22 0 1,0 40,0 a20,22 0 1,0 -40,0 M8,-10 a20,22 0 1,0 40,0 a20,22 0 1,0 -40,0', fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 3 }, g);
    E('path', { d: 'M-38,-8 a10,10 0 1,0 20,0 a10,10 0 1,0 -20,0 M18,-8 a10,10 0 1,0 20,0 a10,10 0 1,0 -20,0 M-24,24 Q0,52 24,24 Z', fill: '#5A2B07', stroke: SC_INK, 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
    return g;
  }
  // a tree in a pot, base of the pot at (0,0), about 380 tall at s = 1
  function careersTree(parent) {
    const g = G(parent);
    E('path', { d: 'M-14,-70 C-12,-140 -18,-190 -6,-240 L10,-240 C18,-190 14,-140 16,-70 Z M0,-170 Q40,-200 60,-232 L68,-226 Q46,-190 8,-158 Z M-2,-150 Q-40,-170 -62,-200 L-70,-192 Q-46,-160 -6,-136 Z', fill: '#8A5A34', stroke: SC_INK, 'stroke-width': 3.5, 'stroke-linejoin': 'round' }, g);
    let d = '';
    [[-70, -250, 66], [0, -300, 84], [72, -252, 64], [-36, -210, 58], [40, -206, 58]].forEach(([x, y, r]) => { d += `M${x - r},${y} a${r},${r} 0 1,0 ${2 * r},0 a${r},${r} 0 1,0 ${-2 * r},0 `; });
    E('path', { d, fill: ball('#6FDC86', '#2C8C4C'), stroke: SC_INK, 'stroke-width': 4 }, g);
    E('path', { d: 'M-70,-74 L70,-74 L56,0 L-56,0 Z', fill: ball('#D9774A', '#9C4A27'), stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
    E('rect', { x: -80, y: -88, width: 160, height: 20, rx: 6, fill: '#C9643A', stroke: SC_INK, 'stroke-width': 4 }, g);
    E('ellipse', { cx: 0, cy: -88, rx: 70, ry: 7, fill: '#5A3A24' }, g);
    g.canopy = [0, -250];
    return g;
  }


  // a cheap glucose ring (amber hexagon + its red ring oxygen): 3 elements
  function careersHex(parent, r) {
    const g = G(parent), pts = phHex(r, true);
    E('path', { d: phPoly(pts), fill: ball(C.glucose, C.glucoseDk), stroke: C.glucoseDk, 'stroke-width': r * 0.1, 'stroke-linejoin': 'round' }, g);
    E('circle', { cx: pts[1][0], cy: pts[1][1], r: r * 0.18, fill: C.oxygen, stroke: C.oxygenDk, 'stroke-width': 1.5 }, g);
    return g;
  }
  // a cheap carbon dioxide molecule (O=C=O): 3 elements
  function careersCO2(parent, r) {
    const g = G(parent), o = r * 0.9;
    E('path', { d: `M${-r * 1.6 - o},0 a${o},${o} 0 1,0 ${2 * o},0 a${o},${o} 0 1,0 ${-2 * o},0 M${r * 1.6 - o},0 a${o},${o} 0 1,0 ${2 * o},0 a${o},${o} 0 1,0 ${-2 * o},0`, fill: C.oxygen, stroke: C.oxygenDk, 'stroke-width': 1.5 }, g);
    E('circle', { r, fill: ball(C.carbon, C.carbonDk), stroke: C.carbonDk, 'stroke-width': 1.5 }, g);
    return g;
  }
  // a cheap potted plant, base of the pot at (0,0), about 260 tall at s = 1; g.set({ droop 0..1 })
  function careersPlant(parent) {
    const g = G(parent);
    const leafD = (x, y, a, L) => {
      const c = Math.cos(a * Math.PI / 180), sn = Math.sin(a * Math.PI / 180);
      const P_ = (u, v) => `${(x + u * c - v * sn).toFixed(1)},${(y + u * sn + v * c).toFixed(1)}`;
      return `M${P_(0, 0)} C${P_(L * 0.25, -L * 0.32)} ${P_(L * 0.75, -L * 0.32)} ${P_(L, 0)} C${P_(L * 0.75, L * 0.32)} ${P_(L * 0.25, L * 0.32)} ${P_(0, 0)} Z `;
    };
    E('path', { d: 'M0,-96 C-6,-150 6,-200 0,-250', fill: 'none', stroke: '#2E8A4A', 'stroke-width': 10, 'stroke-linecap': 'round' }, g);
    const lv = { fill: ball('#7BE08A', C.plantDk), stroke: SC_INK, 'stroke-width': 3 };
    const left = E('path', Object.assign({ d: leafD(0, -150, -160, 110) + leafD(0, -215, -140, 90) }, lv), g);
    const right = E('path', Object.assign({ d: leafD(0, -130, -20, 120) + leafD(0, -195, -40, 96) + leafD(0, -250, -80, 70) }, lv), g);
    E('path', { d: 'M-62,-96 L62,-96 L50,0 L-50,0 Z', fill: ball('#D9774A', '#9C4A27'), stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
    E('rect', { x: -72, y: -110, width: 144, height: 22, rx: 6, fill: '#C9643A', stroke: SC_INK, 'stroke-width': 4 }, g);
    g.set = st => { const d = clamp((st || {}).droop || 0); left.setAttribute('transform', `rotate(${(-50 * d).toFixed(1)} 0 -150)`); right.setAttribute('transform', `rotate(${(55 * d).toFixed(1)} 0 -140)`); };
    g.set({});
    return g;
  }

  // merge static sibling art that the lib draws one element at a time (non-overlapping circles, stroke-only paths
  // with identical styling) into a single path: same look, fewer elements
  function careersMerge(els) {
    els = Array.from(els).filter(Boolean);
    const byParent = new Map();
    els.forEach(e => { const k = e.parentNode; if (!byParent.has(k)) byParent.set(k, []); byParent.get(k).push(e); });
    byParent.forEach(list => {
      if (list.length < 2) return;
      let d = '';
      list.forEach(e => {
        if (e.tagName === 'circle') { const cx = +(e.getAttribute('cx') || 0), cy = +(e.getAttribute('cy') || 0), r = +e.getAttribute('r'); d += `M${cx - r},${cy} a${r},${r} 0 1,0 ${2 * r},0 a${r},${r} 0 1,0 ${-2 * r},0 `; }
        else d += e.getAttribute('d') + ' ';
      });
      const p = E('path', {});
      for (const a of Array.from(list[0].attributes)) if (!['cx', 'cy', 'r', 'd'].includes(a.name)) p.setAttribute(a.name, a.value);
      p.setAttribute('d', d);
      list[0].parentNode.insertBefore(p, list[0]);
      list.forEach(e => e.remove());
    });
  }

  /* layers */
  const Lbg = G(root), Lcast = G(root), Lfg = G(root);

  /* =====================================================================
     FACTORY: the careers fair (noon, job, rscp), Phyllis's shot, Clive's close
     ===================================================================== */
  const facShot = G(Lbg);
  const facCam = G(facShot);
  const fac = phFactory(facCam);
  careersMerge(fac.querySelectorAll('circle[r="10"][fill="#5A6B7A"]'));   // belt wheels
  const BX = [160, 440, 760, 1040];
  const BOOTH = [
    ['RESPIRATION', '#FF9466', '#7A2A14'], ['STORAGE', '#7C8BFF', '#1C2238'],
    ['CELL WALLS', '#7BE08A', '#14451F'], ['PROTEINS', '#C79BFF', '#3B1F66'],
  ];
  const fairBooths = BX.map((x, i) => {
    const b = G(facCam); tr(b, x, 0);
    E('path', { d: 'M-100,300 L-100,480 M100,300 L100,480', stroke: '#9AA6B2', 'stroke-width': 7 }, b);
    E('rect', { x: -112, y: 470, width: 224, height: 70, rx: 6, fill: BOOTH[i][1], stroke: SC_INK, 'stroke-width': 4 }, b);
    const ban = E('rect', { x: -118, y: 300, width: 236, height: 58, rx: 10, fill: BOOTH[i][2], stroke: BOOTH[i][1], 'stroke-width': 4 }, b);
    T(b, 0, 339, BOOTH[i][0], { size: 28, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
    T(b, 0, 288, String(i + 1), { size: 34, weight: 800, anchor: 'middle', fill: BOOTH[i][1] });
    b.ban = ban;
    return b;
  });
  // the four initials for "Really Sweet Crunchy Plants"
  const initials = 'RSCP'.split('').map((L, i) => {
    const g = T(facCam, 0, 18, L, { size: 60, weight: 800, anchor: 'middle', fill: C.glucose });
    g.setAttribute('stroke', SC_INK); g.setAttribute('stroke-width', 9); g.setAttribute('paint-order', 'stroke'); g.setAttribute('stroke-linejoin', 'round');
    return g;
  });
  // glucose riding the belt and tumbling off the end
  const beltGlu = []; for (let i = 0; i < 7; i++) beltGlu.push(careersHex(facCam, 24));
  // noon overlays
  const noonFg = G(Lfg);
  const clock = phClock(noonFg, 0.9); tr(clock, 150, 200);
  const noonChip = careersLabel(noonFg, '12:00 noon', { size: 34, color: C.energy, stroke: C.energy });
  const counter = G(noonFg);
  card(counter, -190, -34, 380, 68, { fill: 'rgba(10,27,39,0.9)', stroke: C.glucose, sw: 3, rx: 34 });
  const countTxt = T(counter, 0, 12, 'Guses made: 0', { size: 32, weight: 700, anchor: 'middle', fill: C.glucoseLt });
  const banner = G(noonFg);
  E('path', { d: 'M-200,-48 L200,-48 L200,40 L0,58 L-200,40 Z', fill: '#E8424F', stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, banner);
  E('path', { d: 'M-200,-48 L-236,-62 M200,-48 L236,-62', stroke: '#9AA6B2', 'stroke-width': 4 }, banner);
  T(banner, 0, 10, 'CAREERS DAY', { size: 48, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  // job: Gus's CV and his dream
  const jobFg = G(Lfg);
  const cv = G(jobFg);
  E('rect', { x: -88, y: -108, width: 176, height: 216, rx: 6, fill: '#FFFFFF', stroke: '#BFD3E6', 'stroke-width': 3 }, cv);
  T(cv, 0, -64, 'CV', { size: 40, weight: 800, anchor: 'middle', fill: '#2A3A8A' });
  T(cv, 0, -24, 'Gus', { size: 28, weight: 700, anchor: 'middle', fill: SC_INK, font: FB });
  T(cv, 0, 22, 'Skills:', { size: 26, weight: 700, anchor: 'middle', fill: '#5A6B7A', font: FB });
  T(cv, 0, 58, 'being sweet', { size: 26, weight: 700, anchor: 'middle', fill: C.glucoseDk, font: FB });
  const cvArm = E('path', { d: '', fill: 'none', stroke: SC_INK, 'stroke-width': 7, 'stroke-linecap': 'round' }, jobFg);
  const dream = G(jobFg);
  E('path', { d: 'M-150,0 a50,44 0 0,1 60,-50 a60,52 0 0,1 110,-6 a52,46 0 0,1 70,46 a46,42 0 0,1 -30,70 a70,40 0 0,1 -120,10 a50,40 0 0,1 -90,-70 Z', fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 4 }, dream);
  E('circle', { cx: -70, cy: 78, r: 13, fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 3.5 }, dream);
  E('circle', { cx: -88, cy: 100, r: 8, fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 3 }, dream);
  E('rect', { x: -96, y: -6, width: 192, height: 54, rx: 8, fill: '#3A2A10', stroke: C.glucose, 'stroke-width': 4 }, dream);
  T(dream, 0, 32, 'MANAGER', { size: 32, weight: 800, anchor: 'middle', fill: C.glucose });
  T(dream, 0, -20, 'Gus', { size: 28, weight: 700, anchor: 'middle', fill: SC_INK });
  // rscp: the mnemonic line
  const mnem = G(Lfg);
  const MW = ['Really', 'Sweet', 'Crunchy', 'Plants!'];
  const mSize = 50, mGap = 22;
  const mWs = MW.map(w => textWidth(w, mSize, FD, 800));
  const mTot = mWs.reduce((a, b) => a + b, 0) + mGap * 3;
  card(mnem, 600 - mTot / 2 - 36, 640, mTot + 72, 82, { fill: 'rgba(10,27,39,0.9)', stroke: C.glucose, sw: 3, rx: 41 });
  let mx = 600 - mTot / 2;
  const mWords = MW.map((w, i) => {
    const tx = E('text', { x: mx, y: 699, 'font-size': mSize, 'font-weight': 800, 'font-family': FD, fill: C.ink }, mnem);
    const a = E('tspan', { fill: C.glucose }, tx); a.textContent = w[0];
    const b = E('tspan', {}, tx); b.textContent = w.slice(1);
    mx += mWs[i] + mGap;
    return tx;
  });
  const mBack = mnem.firstChild;
  // Clive's close-up for the very end
  const clipb = G(Lfg);
  E('rect', { x: -70, y: -92, width: 140, height: 184, rx: 10, fill: '#B07A45', stroke: SC_INK, 'stroke-width': 4 }, clipb);
  E('path', { d: 'M-58,-74 h116 v154 h-116 Z', fill: '#FFFFFF' }, clipb);
  E('path', { d: 'M-28,-102 h56 v22 h-56 Z M-44,-48 h88 M-44,-26 h88 M-44,-4 h88 M-44,18 h60', fill: '#9AA6B2', stroke: '#9AA6B2', 'stroke-width': 4 }, clipb);

  /* =====================================================================
     BOOTH close-ups: one booth set, re-dressed for each job
     ===================================================================== */
  const boothShot = G(Lbg);
  const curtain = E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#7A2A14' }, boothShot);
  { let d = ''; for (let x = 30; x < 1200; x += 60) d += `M${x},0 Q${x + 14},375 ${x},750 `; E('path', { d, fill: 'none', stroke: '#FFFFFF', 'stroke-width': 18, opacity: 0.06 }, boothShot); }
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('rgba(0,0,0,0)', 'rgba(0,0,0,0.35)', true) }, boothShot);
  const bBan = G(boothShot);
  const bBanRect = E('rect', { x: 340, y: 108, width: 760, height: 86, rx: 14, fill: '#2A1A10', stroke: '#FF9466', 'stroke-width': 5 }, bBan);
  const bBadge = E('circle', { cx: 392, cy: 151, r: 32, fill: '#FF9466', stroke: SC_INK, 'stroke-width': 4 }, bBan);
  const bNum = T(bBan, 392, 167, '1', { size: 44, weight: 800, anchor: 'middle', fill: SC_INK });
  const bTitle = T(bBan, 740, 168, 'RESPIRATION', { size: 50, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  // counter
  E('rect', { x: 0, y: 630, width: 1200, height: 120, fill: '#5A4030', stroke: SC_INK, 'stroke-width': 4 }, boothShot);
  E('rect', { x: 0, y: 630, width: 1200, height: 18, fill: '#8A6A50' }, boothShot);
  const plant = careersPlant(boothShot);
  const bTop = G(boothShot);   // booth contents live above the set
  const fourChip = careersLabel(bTop, 'FOUR JOBS', { size: 40, color: C.glucose, stroke: C.glucose });

  // ---- 1: respiration: a tired mitochondrion with a mug
  const resp = G(bTop);
  const mito = mitochondrion(resp, 380, 170, { folds: 6 }); tr(mito, 770, 410);
  const mFace = G(resp); tr(mFace, 770, 404);
  E('ellipse', { rx: 108, ry: 62, fill: C.mitoIn, stroke: C.mitoDk, 'stroke-width': 3 }, mFace);
  const mEyes = [-1, 1].map(sd => {
    const e = G(mFace); tr(e, sd * 40, -14);
    E('ellipse', { rx: 17, ry: 19, fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 3 }, e);
    E('circle', { cy: 4, r: 8, fill: SC_INK }, e);
    const lid = E('path', { d: '', fill: '#FFB08F', stroke: SC_INK, 'stroke-width': 3 }, e);
    return lid;
  });
  const mMouth = E('ellipse', { cx: 0, cy: 30, rx: 16, ry: 4, fill: '#5A1E2A', stroke: SC_INK, 'stroke-width': 3 }, mFace);
  const mug = G(resp); tr(mug, 1030, 520);
  E('path', { d: 'M30,-46 Q58,-46 58,-22 Q58,2 30,2', fill: 'none', stroke: SC_INK, 'stroke-width': 7 }, mug);
  E('rect', { x: -32, y: -66, width: 64, height: 80, rx: 8, fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 4 }, mug);
  E('rect', { x: -32, y: -40, width: 64, height: 18, fill: '#FF9466' }, mug);
  const steam = heatWaves(mug, { n: 2, h: 60, spacing: 22, color: '#FFFFFF', width: 4 }); tr(steam, 0, -74);
  T(resp, 770, 560, 'mitochondrion', { size: 30, weight: 700, anchor: 'middle', fill: '#FFD6BF' });
  const rGlu = molGlucose(resp, 34);
  const rSparks = [0, 1, 2].map(i => spark(resp, 20, { seed: i }));
  const relChip = careersLabel(resp, 'releases energy', { size: 40, color: C.energy, stroke: C.energy });
  const tiredChip = careersLabel(resp, 'very tired', { size: 28, color: '#FFD6BF', stroke: '#FF9466' });

  // ---- 2: storage: glucose clicks into a chain of starch
  const stor = G(bTop);
  const SCH = []; for (let i = 0; i < 8; i++) SCH.push(440 + i * 82);
  const links = E('path', { d: SCH.slice(0, -1).map(x => `M${x + 26},360 L${x + 56},360`).join(' '), stroke: C.glucoseDk, 'stroke-width': 9, 'stroke-linecap': 'round' }, stor);
  const sr = rng(23);
  const sGlu = SCH.map((x, i) => ({ g: careersHex(stor, 30), x0: 420 + sr() * 680, y0: 230 + sr() * 260, r0: sr() * 120 - 60, x }));
  const starchChip = G(stor);
  chip(starchChip, 'starch', { size: 50, fill: '#1C2238', color: '#C9D2FF', stroke: '#7C8BFF', sw: 4 });
  const starchSub = careersLabel(stor, 'glucose joined in a long chain', { size: 28, color: C.glucoseLt, stroke: C.glucoseDk });
  const stores = G(stor);
  const grains = (cx, cy, n, w, h, seed) => { const r = rng(seed); let d = ''; for (let i = 0; i < n; i++) { const x = cx + (r() - 0.5) * w, y = cy + (r() - 0.5) * h; d += `M${(x - 4).toFixed(1)},${y.toFixed(1)} a4,4 0 1,0 8,0 a4,4 0 1,0 -8,0 `; } return d; };
  const icLeaf = G(stores); tr(icLeaf, 470, 545);
  { E('path', { d: 'M-56,10 C-30,-34 30,-40 56,-10 C30,30 -30,40 -56,10 Z M-60,12 L50,-8', fill: ball(C.plant, C.plantDk), stroke: SC_INK, 'stroke-width': 3 }, icLeaf); E('path', { d: grains(0, -6, 7, 60, 22, 3), fill: '#1C2238' }, icLeaf); }
  const icStem = G(stores); tr(icStem, 727, 545);
  E('rect', { x: -16, y: -46, width: 32, height: 92, rx: 12, fill: ball(C.stem, C.plantDk), stroke: SC_INK, 'stroke-width': 3 }, icStem);
  E('path', { d: grains(0, 0, 6, 16, 70, 5), fill: '#1C2238' }, icStem);
  const icSeed = G(stores); tr(icSeed, 985, 545);
  E('path', { d: 'M-50,0 C-50,-40 40,-46 50,-6 C56,30 -4,44 -36,30 C-46,24 -50,14 -50,0 Z', fill: ball('#E9C98A', '#A8783A'), stroke: SC_INK, 'stroke-width': 3 }, icSeed);
  E('path', { d: grains(0, 0, 9, 60, 36, 9), fill: '#1C2238' }, icSeed);
  const stLbls = [[470, 'leaves'], [727, 'stems'], [985, 'seeds']].map(([x, s]) => T(stores, x, 618, s, { size: 30, weight: 700, anchor: 'middle', fill: '#C9D2FF' }));

  // ---- the chain of Guses (Gus himself is the cast Gus)
  const chainG = G(bTop);
  const handPath = E('path', { d: '', fill: 'none', stroke: SC_INK, 'stroke-width': 7, 'stroke-linecap': 'round' }, chainG);
  const CH_N = 2;
  const minis = [];
  for (let sd of [-1, 1]) for (let k = CH_N; k >= 1; k--) minis.push({ sd, k, g: careersMiniGus(chainG) });
  const chainTail = E('path', { d: '', fill: C.glucose, stroke: C.glucoseDk, 'stroke-width': 1.5 }, chainG);
  { let d = ''; [-1, 1].forEach(sd => { for (let k = 3; k <= 16; k++) { const s = 0.6 * Math.pow(0.78, k - 1), x = 600 + sd * (130 + 150 * (1 - Math.pow(0.78, k)) / (1 - 0.78) * 0.72), y = 420 - 26 * (1 - Math.pow(0.8, k)); if (x < 20 || x > 1180) continue; d += phPoly(phHex(94 * s, true).map(([a, b]) => [a + x, b + y])) + ' '; } }); attr(chainTail, 'd', d); }
  const chainChip = careersLabel(chainG, 'starch: hundreds of glucose, joined together', { size: 30, color: '#C9D2FF', stroke: '#7C8BFF' });

  // ---- insoluble: two beakers
  const insol = G(bTop);
  const bkL = beaker(insol, 200, 230, { level: 0.72, liquid: C.water, opacity: 0.55 }); tr(bkL, 540, 420);
  const bkR = beaker(insol, 200, 230, { level: 0.72, liquid: C.water, opacity: 0.55 }); tr(bkR, 900, 420);
  const iGlu = molGlucose(insol, 26);
  const iBits = E('path', { d: '', fill: C.glucose, stroke: C.glucoseDk, 'stroke-width': 1.5 }, insol);
  const lump = G(insol);
  { let d = ''; [[-40, 0], [0, -14], [40, 0], [-20, 30], [20, 30]].forEach(([x, y]) => d += phPoly(phHex(22, true).map(([a, b]) => [a + x, b + y])) + ' '); E('path', { d, fill: '#2A3150', stroke: '#7C8BFF', 'stroke-width': 3 }, lump); }
  const insChip = careersLabel(insol, 'starch is insoluble', { size: 40, color: '#C9D2FF', stroke: '#7C8BFF' });
  const lblL = T(insol, 540, 590, 'glucose: dissolves', { size: 28, weight: 700, anchor: 'middle', fill: C.glucoseLt });
  const lblR = T(insol, 900, 590, 'starch: stays solid', { size: 28, weight: 700, anchor: 'middle', fill: '#C9D2FF' });
  const balChip = careersLabel(insol, "doesn't upset the cell's water balance", { size: 30, color: C.water, stroke: C.water });
  const perfTick = tick(insol, 18);

  // ---- 3: cell walls: chains of glucose become cellulose bricks
  const cellG = G(bTop);
  const fib = G(cellG);
  { let d = ''; for (let r = 0; r < 3; r++) for (let i = 0; i < 6; i++) d += phPoly(phHex(13, true).map(([a, b]) => [a + 380 + i * 34, b + 310 + r * 46])) + ' '; E('path', { d, fill: C.glucose, stroke: C.glucoseDk, 'stroke-width': 2 }, fib); }
  T(fib, 465, 448, 'glucose chains', { size: 26, weight: 700, anchor: 'middle', fill: C.glucoseLt });
  const fibArrow = arrow(cellG, 580, 360, 640, 380, { color: C.ink, width: 6 });
  const CW = { x: 650, y: 300, w: 300, h: 210 };
  E('rect', { x: CW.x + 14, y: CW.y + 14, width: CW.w - 28, height: CW.h - 28, rx: 10, fill: 'rgba(200,255,210,0.22)' }, cellG);
  E('path', { d: `M${CW.x + 60},${CW.y + 60} a16,10 0 1,0 32,0 a16,10 0 1,0 -32,0 M${CW.x + 180},${CW.y + 80} a16,10 0 1,0 32,0 a16,10 0 1,0 -32,0 M${CW.x + 120},${CW.y + 140} a16,10 0 1,0 32,0 a16,10 0 1,0 -32,0 M${CW.x + 220},${CW.y + 150} a16,10 0 1,0 32,0 a16,10 0 1,0 -32,0`, fill: C.chloro, stroke: C.chloroDk, 'stroke-width': 2 }, cellG);
  const bricks = [];
  { // bricks around the wall, in building order (bottom first, then up both sides, then the top)
    const bw = 50, bh = 22, pos = [];
    for (let x = CW.x; x < CW.x + CW.w - 1; x += bw) pos.push([x, CW.y + CW.h - bh, bw, bh]);
    for (let y = CW.y + CW.h - bh * 2; y > CW.y + bh - 1; y -= bh) { pos.push([CW.x, y, bh, bh]); pos.push([CW.x + CW.w - bh, y, bh, bh]); }
    for (let x = CW.x; x < CW.x + CW.w - 1; x += bw) pos.push([x, CW.y, bw, bh]);
    const courses = {}; pos.forEach(([x, y, w, h]) => { (courses[y] = courses[y] || []).push(`M${x + 1},${y + 1} h${w - 2} v${h - 2} h${-(w - 2)} Z`); });
    Object.keys(courses).map(Number).sort((a, b) => b - a).forEach(y => bricks.push(E('path', { d: courses[y].join(' '), fill: '#B9E58A', stroke: '#3E7A2A', 'stroke-width': 2.5 }, cellG)));
  }
  const cellChip = careersLabel(cellG, 'cellulose: strong cell walls', { size: 38, color: '#B9E58A', stroke: '#7BE08A' });
  const cellLbl = T(cellG, 800, 560, 'plant cell wall', { size: 28, weight: 700, anchor: 'middle', fill: '#DFFFE0' });

  // ---- 4: proteins
  const protG = G(bTop);
  const pGlu = molGlucose(protG, 36); tr(pGlu, 420, 330);
  const pPlus = T(protG, 496, 346, '+', { size: 54, weight: 800, anchor: 'middle', fill: C.ink });
  const nitr = G(protG); tr(nitr, 640, 330);
  chip(nitr, 'nitrates', { size: 40, fill: '#6B4A33', color: '#FFE6C7', stroke: '#C9A27A', sw: 3 });
  T(nitr, 0, 66, '(from the soil)', { size: 28, weight: 700, anchor: 'middle', fill: '#E7C9A4' });
  const pArrow = arrow(protG, 760, 330, 830, 330, { color: C.ink, width: 7 });
  const beads = G(protG);
  const beadLine = E('path', { d: '', fill: 'none', stroke: '#E9E2D0', 'stroke-width': 5 }, beads);
  const beadEls = ['#FF6B5C', '#4CC9F0'].map(c => E('path', { d: '', fill: c, stroke: SC_INK, 'stroke-width': 2.5 }, beads));
  const protLbl = T(protG, 965, 410, 'protein', { size: 32, weight: 800, anchor: 'middle', fill: '#E3CCFF' });
  const growChip = careersLabel(protG, 'for growth', { size: 40, color: C.good, stroke: C.good });
  const growArrow = arrow(protG, 965, 432, 1010, 470, { color: C.good, width: 6 });

  /* =====================================================================
     DAY / NIGHT strip (both)
     ===================================================================== */
  const dnShot = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#0A1B27', '#132A3A', true) }, dnShot);
  E('rect', { x: 100, y: 130, width: 500, height: 180, fill: linGrad('#6EC3F5', '#D2F0FF', true) }, dnShot);
  E('rect', { x: 600, y: 130, width: 500, height: 180, fill: linGrad('#0B1433', '#2A3466', true) }, dnShot);
  E('circle', { cx: 190, cy: 210, r: 80, fill: glow('#FFE45C') }, dnShot);
  E('circle', { cx: 190, cy: 210, r: 34, fill: '#FFE45C' }, dnShot);
  E('path', { d: 'M1020,180 a30,30 0 1,0 30,40 a24,24 0 1,1 -30,-40 Z', fill: '#F4F1DE' }, dnShot);
  { const r = rng(5); let d = ''; for (let i = 0; i < 14; i++) { const x = 640 + r() * 340, y = 150 + r() * 140; d += `M${x.toFixed(0)},${y.toFixed(0)} m-3,0 a3,3 0 1,0 6,0 a3,3 0 1,0 -6,0 `; } E('path', { d, fill: '#FFF7C2' }, dnShot); }
  E('rect', { x: 100, y: 130, width: 1000, height: 180, fill: 'none', stroke: C.line, 'stroke-width': 4 }, dnShot);
  T(dnShot, 350, 290, 'DAY', { size: 36, weight: 800, anchor: 'middle', fill: '#14243A' });
  T(dnShot, 850, 290, 'NIGHT', { size: 36, weight: 800, anchor: 'middle', fill: '#DDE6FF' });
  const dnFg = G(Lfg);
  // lanes
  E('rect', { x: 100, y: 352, width: 1000, height: 70, rx: 35, fill: '#0B2230', stroke: C.line, 'stroke-width': 2 }, dnFg);
  E('rect', { x: 100, y: 450, width: 1000, height: 70, rx: 35, fill: '#0B2230', stroke: C.line, 'stroke-width': 2 }, dnFg);
  const barR = E('rect', { x: 100, y: 352, width: 0, height: 70, rx: 35, fill: C.mito }, dnFg);
  const barP = E('rect', { x: 100, y: 450, width: 0, height: 70, rx: 35, fill: C.plant }, dnFg);
  const txR = T(dnFg, 600, 398, 'respiration: ALL THE TIME', { size: 34, weight: 800, anchor: 'middle', fill: '#3A1408' });
  const txP = T(dnFg, 350, 496, 'photosynthesis: only in light', { size: 28, weight: 800, anchor: 'middle', fill: '#0E3A22' });
  const offP = T(dnFg, 850, 496, 'no light: off', { size: 28, weight: 700, anchor: 'middle', fill: C.faint });
  const resToo = careersLabel(dnFg, 'plants respire too!', { size: 38, color: C.mito, stroke: C.mito });

  /* =====================================================================
     PHYLLIS: magnesium, chlorosis, "I don't want to talk about it"
     ===================================================================== */
  const phDim = E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#05140C', opacity: 0.5 }, facShot);
  const phBeam = E('ellipse', { cx: 360, cy: 380, rx: 230, ry: 260, fill: glow('#FFF3A0') }, facShot);
  const phFg = G(Lfg);
  const mgBig = G(phFg);
  { const gem = G(mgBig); tr(gem, -210, 0, 2.4); E('path', { d: 'M0,-15 L16,0 L0,15 L-16,0 Z', fill: ball('#E6DDFF', '#8C7BC9'), stroke: SC_INK, 'stroke-width': 2 }, gem); T(gem, 0, 5, 'Mg', { size: 13, weight: 800, anchor: 'middle', fill: '#3A2A6B' }); }
  chip(mgBig, 'magnesium', { size: 52, fill: '#2A2050', color: '#E6DDFF', stroke: '#B9A6FF', sw: 4 });
  const mgIons = careersLabel(phFg, 'magnesium ions, from the soil', { size: 32, color: '#E6DDFF', stroke: '#8C7BC9' });
  const mgNeed = careersLabel(phFg, 'needed to make chlorophyll', { size: 32, color: C.plant, stroke: C.plant });
  const tapHand = G(phFg);
  const tapArm = E('path', { d: '', fill: 'none', stroke: SC_INK, 'stroke-width': 20, 'stroke-linecap': 'round' }, tapHand);
  const tapArmIn = E('path', { d: '', fill: 'none', stroke: '#8BE89A', 'stroke-width': 12, 'stroke-linecap': 'round' }, tapHand);
  const tapTip = G(tapHand);
  E('path', { d: 'M-20,8 Q-22,-14 -6,-18 L-6,-40 Q-6,-48 2,-48 Q10,-48 10,-40 L10,-14 Q24,-12 22,8 Q20,24 0,24 Q-18,24 -20,8 Z', fill: '#8BE89A', stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, tapTip);
  const tapRing = E('circle', { r: 34, fill: 'none', stroke: C.energy, 'stroke-width': 6 }, phFg);
  // chlorosis: a leaf going yellow
  const yLeaf = G(phFg); tr(yLeaf, 880, 300);
  const yBody = E('path', { d: 'M-190,0 C-120,-120 110,-130 190,0 C110,130 -120,120 -190,0 Z', fill: '#3FAE5A', stroke: SC_INK, 'stroke-width': 4 }, yLeaf);
  E('path', { d: 'M-200,0 L186,0 M-110,0 Q-80,-40 -50,-74 M-110,0 Q-80,40 -50,74 M-10,0 Q20,-44 50,-78 M-10,0 Q20,44 50,78 M90,0 Q110,-30 130,-50 M90,0 Q110,30 130,50', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 4, opacity: 0.45, 'stroke-linecap': 'round' }, yLeaf);
  const yChip = G(phFg);
  chip(yChip, 'chlorosis', { size: 52, fill: '#FFE45C', color: '#3A3000', stroke: '#B8A030', sw: 4 });
  const yChain = G(phFg);
  const YC = ['less chlorophyll', 'less light absorbed', 'less photosynthesis'];
  const ycW = YC.map(s => textWidth(s, 28, FD, 700) + 40), ycGap = 70;
  const ycTot = ycW.reduce((a, b) => a + b, 0) + ycGap * 2;
  let ycx = 600 - ycTot / 2;
  const ycEls = YC.map((s, i) => {
    const c = careersLabel(yChain, s, { size: 28, color: '#FFE45C', stroke: '#B8A030' }); tr(c, ycx + ycW[i] / 2, 670);
    const ar = i < 2 ? arrow(yChain, ycx + ycW[i] + 10, 670, ycx + ycW[i] + ycGap - 10, 670, { color: '#FFE45C', width: 5 }) : null;
    ycx += ycW[i] + ycGap;
    return { c, ar };
  });
  const fan = G(phFg);
  { let d = ''; for (let i = 0; i <= 6; i++) { const a = (-150 + i * 20) * Math.PI / 180; d += `M0,0 L${(Math.cos(a) * 70).toFixed(1)},${(Math.sin(a) * 70).toFixed(1)} `; }
    E('path', { d: 'M0,0 L-60.6,-35 A70,70 0 0,1 60.6,-35 Z', fill: '#FF8FB0', stroke: SC_INK, 'stroke-width': 3 }, fan);
    E('path', { d, stroke: '#C2457A', 'stroke-width': 2.5 }, fan);
    E('line', { x1: 0, y1: 0, x2: 0, y2: 40, stroke: SC_INK, 'stroke-width': 6, 'stroke-linecap': 'round' }, fan); }
  const palm = G(phFg);
  E('path', { d: 'M-34,30 L-34,-20 Q-34,-30 -26,-30 Q-18,-30 -18,-20 L-18,-44 Q-18,-54 -10,-54 Q-2,-54 -2,-44 L-2,-50 Q-2,-60 6,-60 Q14,-60 14,-50 L14,-42 Q14,-52 22,-52 Q30,-52 30,-42 L30,10 Q30,40 0,44 Q-30,44 -34,30 Z', fill: '#8BE89A', stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, palm);
  const phylBody = G(Lcast);   // filled below with the cast

  /* =====================================================================
     TREE: where does the mass come from? -> Cosmo
     ===================================================================== */
  const treeShot = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#7CC8F2', '#D8F1FF', true) }, treeShot);
  E('rect', { x: 0, y: 640, width: 1200, height: 110, fill: '#6BBF5E' }, treeShot);
  E('rect', { x: 0, y: 640, width: 1200, height: 10, fill: '#4E9E45' }, treeShot);
  const trees = [[230, 0.42], [470, 0.68], [790, 1]].map(([x, s]) => { const g = careersTree(treeShot); tr(g, x, 640, s); return { g, x, s }; });
  const stageArrows = [arrow(treeShot, 290, 608, 395, 608, { color: '#2A3A57', width: 6 }), arrow(treeShot, 535, 608, 690, 608, { color: '#2A3A57', width: 6 })];
  const co2s = []; for (let i = 0; i < 6; i++) co2s.push(careersCO2(treeShot, 13));
  const trFg = G(Lfg);
  const qMark = T(trFg, 1040, 380, '?', { size: 220, weight: 800, anchor: 'middle', fill: C.glucose });
  const massQ = careersLabel(trFg, 'where does its new mass come from?', { size: 34, color: C.ink, stroke: C.glucose });
  const soilQ = G(trFg);
  chip(soilQ, 'the soil?', { size: 40, fill: '#6B4A33', color: '#FFE6C7', stroke: '#C9A27A', sw: 3 });
  T(soilQ, 0, 64, "most people's guess", { size: 26, weight: 700, anchor: 'middle', fill: '#14243A' });
  const soilArrow = arrow(trFg, 930, 458, 862, 546, { color: '#6B4A33', width: 6 });
  const soilX = cross(trFg, 34);
  const massCard = G(trFg);
  { const s1 = 'most of the dry mass comes from ', w1 = textWidth(s1, 32, FD, 700), w2 = textWidth('CO2 in the air', 32, FD, 800);
    const w = w1 + w2 + 80;
    E('rect', { x: -w / 2, y: -38, width: w, height: 76, rx: 38, fill: 'rgba(10,27,39,0.92)', stroke: C.co2, 'stroke-width': 3 }, massCard);
    T(massCard, -w / 2 + 35, 11, s1, { size: 32, weight: 700, fill: C.ink });
    careersRich(massCard, -w / 2 + 35 + w1 + 10, 11, 'CO_2 in the air', { size: 32, weight: 800, fill: C.co2, anchor: 'start' }); }
  const dryNote = careersLabel(trFg, 'dry mass = the mass with the water removed', { size: 26, color: C.muted, stroke: C.line, weight: 600 });

  /* =====================================================================
     LOG: a cross-section made of tiny Cosmos
     ===================================================================== */
  const logShot = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#3A2A1C', '#1E140C', true) }, logShot);
  const logG = G(Lfg);
  const LR = [230, 205];
  E('ellipse', { rx: LR[0] + 22, ry: LR[1] + 22, fill: '#5A3A24', stroke: SC_INK, 'stroke-width': 5 }, logG);
  E('ellipse', { rx: LR[0], ry: LR[1], fill: '#E9C98A', stroke: '#A8783A', 'stroke-width': 4 }, logG);
  E('path', { d: [0.78, 0.56, 0.34].map(k => `M${-LR[0] * k},0 a${LR[0] * k},${LR[1] * k} 0 1,0 ${2 * LR[0] * k},0 a${LR[0] * k},${LR[1] * k} 0 1,0 ${-2 * LR[0] * k},0`).join(' '), fill: 'none', stroke: '#C9A060', 'stroke-width': 4 }, logG);
  const logFaces = G(logG);
  { let cD = '', oD = '', eD = '', sD = '';
    for (let y = -170; y <= 170; y += 46) for (let x = -200; x <= 200; x += 66) {
      const xx = x + ((y / 46) % 2 ? 33 : 0);
      if ((xx * xx) / ((LR[0] - 36) ** 2) + (y * y) / ((LR[1] - 30) ** 2) > 1) continue;
      cD += `M${xx - 13},${y} a13,13 0 1,0 26,0 a13,13 0 1,0 -26,0 `;
      oD += `M${xx - 27},${y} a8,8 0 1,0 16,0 a8,8 0 1,0 -16,0 M${xx + 11},${y} a8,8 0 1,0 16,0 a8,8 0 1,0 -16,0 `;
      eD += `M${xx - 7},${y - 3} a2.6,2.6 0 1,0 5.2,0 a2.6,2.6 0 1,0 -5.2,0 M${xx + 2},${y - 3} a2.6,2.6 0 1,0 5.2,0 a2.6,2.6 0 1,0 -5.2,0 `;
      sD += `M${xx - 5},${y + 4} Q${xx},${y + 9} ${xx + 5},${y + 4} `;
    }
    E('path', { d: oD, fill: C.oxygen, stroke: C.oxygenDk, 'stroke-width': 1.5 }, logFaces);
    E('path', { d: cD, fill: C.carbon, stroke: C.carbonDk, 'stroke-width': 1.5 }, logFaces);
    E('path', { d: eD, fill: SC_INK }, logFaces);
    E('path', { d: sD, fill: 'none', stroke: SC_INK, 'stroke-width': 2 }, logFaces); }
  const logFg = G(Lfg); logFg.appendChild(logG);
  const woodChip = careersLabel(logFg, 'trees: mostly made from thin air', { size: 40, color: C.co2, stroke: C.co2 });
  const woodLbl = careersLabel(logFg, 'wood', { size: 34, color: '#E9C98A', stroke: '#A8783A' });

  /* =====================================================================
     the cast
     ===================================================================== */
  const gus = cast(Lcast, 'gus', { mood: 'happy' });
  const clive = cast(Lcast, 'clive', { mood: 'deadpan' });
  const phyl = cast(phylBody, 'phyllis', { mood: 'smug' });
  const cosmo = cast(Lcast, 'cosmo', { mood: 'smug' });
  // Phyllis's sunglasses: bring them to the front so they can come down over her eyes
  const phylG = phyl.firstChild;
  const shades = Array.from(phylG.children).find(c => c.tagName === 'g' && /translate\(0\.00 -100\.00\)/.test(c.getAttribute('transform') || ''));
  if (shades) phylG.appendChild(shades);
  Lcast.appendChild(clipb);
  const blackout = E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#000000' }, Lfg);

  /* ---------- cut list ---------- */
  const CUTS = [
    [-1, 'noon'], [at('job') - 0.08, 'job'], [at('resp') - 0.08, 'resp'], [at('both') - 0.08, 'both'],
    [at('starch') - 0.08, 'starch'], [at('chain') - 0.08, 'chain'], [at('insol') - 0.08, 'insol'],
    [at('cell') - 0.08, 'cell'], [at('prot') - 0.08, 'prot'], [at('rscp') - 0.08, 'rscp'],
    [at('mg') - 0.08, 'phyl'], [at('mass') - 0.08, 'mass'], [at('me') - 0.08, 'me'],
    [at('wood') - 0.08, 'wood'], [end('wood') + 0.12, 'close'],
  ];
  const cutAt = t => { let c = CUTS[0]; for (const k of CUTS) if (t >= k[0]) c = k; return c; };
  const BOOTHS = { resp: 0, starch: 1, chain: 1, insol: 1, cell: 2, prot: 3 };
  const VIS = [facShot, boothShot, dnShot, treeShot, logShot, noonFg, jobFg, mnem, dnFg, phFg, trFg, logFg,
    resp, stor, chainG, insol, cellG, protG, phDim, phBeam, gus, clive, phylBody, cosmo, clipb, plant];

  return t => {
    const [c0, shot] = cutAt(t);
    const vis = new Set();
    const show = (...els) => els.forEach(e => vis.add(e));
    const cliveTalk = talk(t, 'clive');

    /* ---------------- FACTORY: noon / job / rscp / close ---------------- */
    if (shot === 'noon' || shot === 'job' || shot === 'rscp' || shot === 'phyl' || shot === 'close') {
      show(facShot);
      const fair = shot !== 'phyl' && shot !== 'close';
      const lightOn = 1;
      fac.set({ t, light: lightOn, belt: shot === 'noon' ? 160 : 60 });
      fairBooths.forEach(b => op(b, 0)); initials.forEach(g => op(g, 0)); beltGlu.forEach(m => op(m, 0));
      if (shot === 'noon') {
        careersCam(facCam, 1 + 0.04 * P(t, at('noon'), 5, linear), 600, 500);
        show(noonFg);
        // the booths spring up when the fair is announced
        fairBooths.forEach((b, i) => { const p = P(t, mid('noon', 0.72) + i * 0.12, 0.45, pop); op(b, clamp(p * 3)); b.setAttribute('transform', `translate(${BX[i]} 540) scale(1 ${Math.max(0.01, p).toFixed(3)}) translate(0 -540)`); });
        // glucose pouring along the belt and tumbling off the end
        beltGlu.forEach((m, i) => {
          const u = ((t * 0.32 + i / beltGlu.length) % 1), L = 1080;
          let x = 60 + u * 1.25 * L, y = 622, r = (t * 90 + i * 40) % 360;
          if (x > 1140) { const f = (x - 1140) / 240; x = 1140 + f * 90; y = 622 + f * f * 260; }
          op(m, Math.min(1, u * 10)); tr(m, x, y, 1, r);
        });
        op(clock, 1); clock.set(12);
        careersPop(clock, 150, 200, P(t, at('noon') + 0.05, 0.4, pop) * (1 - P(t, mid('noon', 0.68), 0.2, linear)), 0.9);
        careersPop(noonChip, 150, 300, P(t, at('noon') + 0.25, 0.4, pop) * (1 - P(t, mid('noon', 0.68), 0.2, linear)));
        careersPop(counter, 560, 262, P(t, mid('noon', 0.22), 0.4, pop) * (1 - P(t, mid('noon', 0.68), 0.2, linear)));
        const n = Math.round(4812 * P(t, mid('noon', 0.22), 2.6, easeOut));
        setText(countTxt, 'Guses made: ' + n.toLocaleString('en-GB'));
        const bp = P(t, mid('noon', 0.66), 0.5, pop);
        op(banner, clamp(bp * 3)); tr(banner, 600, 150 - 60 * (1 - clamp(bp)), 1, Math.sin(t * 2) * 1.5 * AMP);
      } else if (shot === 'job') {
        const pushK = 1 + 0.12 * P(t, end('job') - 0.1, at('resp') - end('job') + 0.2, easeOut);
        careersCam(facCam, pushK, 760, 520);
        fairBooths.forEach((b, i) => { op(b, 1); tr(b, BX[i], 0); });
        const sc = (x, y) => [760 + pushK * (x - 760), 520 + pushK * (y - 520)];
        show(jobFg, gus, clive, clipb);
        const [gx, gy] = sc(470, 572), [cx, cy] = sc(780, 576);
        tr(gus, gx, gy, 0.85 * pushK); gus.set({ t, talk: talk(t, 'gus'), mood: 'happy', look: 0.5 });
        tr(clive, cx, cy, 0.85 * pushK);
        clive.set({ t, talk: 0, mood: t > mid('job', 0.5) ? 'deadpan' : 'neutral', look: -0.7 });
        const [kx, ky] = sc(880, 610); tr(clipb, kx, ky, 0.5 * pushK, 14);
        const bob = Math.sin(t * TAU * 0.5 + 3) * 8 * 0.85;
        const [vx, vy] = sc(318, 560 + bob); tr(cv, vx, vy, pushK, -8);
        const [ax, ay] = sc(392, 580 + bob);
        attr(cvArm, 'd', `M${ax.toFixed(1)},${ay.toFixed(1)} L${(vx + 60 * pushK).toFixed(1)},${(vy + 20 * pushK).toFixed(1)}`);
        const dp = P(t, mid('job', 0.5), 0.45, pop);
        const [dx, dy] = sc(500, 186);
        careersPop(dream, dx, dy, dp, pushK);
      } else if (shot === 'rscp') {
        careersCam(facCam, 1, 600, 375);
        fairBooths.forEach((b, i) => { op(b, 1); tr(b, BX[i], 0); });
        show(gus, clive, mnem);
        const wt = i => lerp(at('rscp') + 0.1, mid('rscp', 0.5), i / 3);
        fairBooths.forEach((b, i) => {
          const lit = t >= wt(i);
          attr(b.ban, 'stroke', lit ? C.energy : BOOTH[i][1]); attr(b.ban, 'stroke-width', lit ? 8 : 4);
          const p = P(t, wt(i), 0.4, pop);
          op(initials[i], clamp(p * 3)); tr(initials[i], BX[i], 505 + 10 * (1 - clamp(p)), Math.max(0.01, p) * (1 + 0.06 * Math.sin(t * 6 + i) * AMP));
          op(mWords[i], P(t, wt(i), 0.25, linear));
        });
        // Gus dances
        const hop = Math.abs(Math.sin(t * 5.2)) * 26 * AMP, sway = Math.sin(t * 2.6) * 14 * AMP;
        tr(gus, 560, 560 - hop, 0.82, sway); gus.set({ t, talk: talk(t, 'gus'), mood: 'happy', look: Math.sin(t * 2.6) * 0.6, still: true });
        tr(clive, 1086, 646, 0.66); clive.set({ t, talk: 0, mood: 'deadpan', look: -0.8 });
      } else if (shot === 'phyl') {
        careersCam(facCam, 1.5, 400, 470, 600, 375);
        fac.set({ t, light: 1, belt: 0 });
      } else if (shot === 'close') {
        const k = 1.3 * (1 + 0.06 * P(t, c0, 1.6, linear));
        careersCam(facCam, k * 1.15, 450, 520, 600, 375);
        show(clive);
        tr(clive, 600, 450, 1.55 * (1 + 0.08 * P(t, c0, 1.6, linear)));
        clive.set({ t, talk: 0, mood: 'deadpan', look: 0 });
      }
    }

    /* ---------------- BOOTHS ---------------- */
    const bi = BOOTHS[shot];
    if (bi !== undefined) {
      show(boothShot);
      attr(curtain, 'fill', BOOTH[bi][2]);
      attr(bBanRect, 'stroke', BOOTH[bi][1]); attr(bBadge, 'fill', BOOTH[bi][1]);
      setText(bNum, String(bi + 1)); setText(bTitle, BOOTH[bi][0]);
      if (shot !== 'chain') {
        show(clive);
        tr(clive, 190, 556, 0.82);
        let mood = 'neutral', look = 0.4;
        if (shot === 'resp' && t > end('resp') + 0.05) { mood = 'deadpan'; look = 0; }
        if (shot === 'insol' && t > mid('insol', 0.85)) mood = 'smug';
        clive.set({ t, talk: cliveTalk, mood, look });
      }
    }
    op(fourChip, 0);
    if (shot === 'resp') {
      show(resp);
      careersPop(fourChip, 740, 250, P(t, at('resp') + 0.05, 0.4, pop) * (1 - P(t, mid('resp', 0.2), 0.2, linear)));
      // glucose goes in
      const gi = P(t, mid('resp', 0.28), 1.0, ease);
      op(rGlu, t < mid('resp', 0.28) ? P(t, mid('resp', 0.2), 0.3, linear) : 1 - P(t, mid('resp', 0.28) + 0.8, 0.25, linear));
      tr(rGlu, lerp(440, 620, gi), 410, 1 - 0.5 * P(t, mid('resp', 0.28) + 0.6, 0.4, linear), gi * 120);
      // energy sparks fly out
      const s0 = mid('resp', 0.42);
      rSparks.forEach((sp, i) => {
        const u = t < s0 ? -1 : ((t - s0) * 0.55 + i / 3) % 1;
        if (u < 0) { op(sp, 0); return; }
        op(sp, Math.min(1, u * 5, (1 - u) * 4));
        tr(sp, lerp(900, 1110, u) + Math.sin(i * 2) * 20, lerp(380, 250, u) - i * 18); sp.upd(t);
      });
      careersPop(relChip, 820, 258, P(t, mid('resp', 0.5), 0.4, pop));
      // tired eyes; on "Very tired" he yawns
      const yawn = P(t, mid('resp', 0.86), 0.35, ease) * (1 - P(t, end('resp') + 0.45, 0.3, ease));
      const lidF = Math.max(0.55, yawn * 0.95, scBlink(t, 4));
      mEyes.forEach(lid => {
        const ry = 19, yb = -ry + 2 * ry * Math.min(lidF, 0.98), xw = 17 * Math.sqrt(Math.max(0, 1 - (yb / ry) ** 2));
        attr(lid, 'd', `M${(-xw).toFixed(1)},${yb.toFixed(1)} A17,19 0 ${yb > 0 ? 1 : 0} 1 ${xw.toFixed(1)},${yb.toFixed(1)} Z`);
      });
      attr(mMouth, 'rx', 16 + 10 * yawn); attr(mMouth, 'ry', 4 + 26 * yawn); attr(mMouth, 'cy', 30 + 6 * yawn);
      tr(mito, 770, 410, 1 + 0.03 * yawn); tr(mFace, 770, 404 - 4 * yawn);
      steam.upd(t);
      careersPop(tiredChip, 1030, 594, P(t, mid('resp', 0.86), 0.35, pop));
    }
    if (shot === 'starch') {
      show(stor);
      const cp = P(t, mid('starch', 0.22), 1.1, ease);
      sGlu.forEach((o, i) => { const p = clamp(cp * 1.3 - i * 0.04); op(o.g, P(t, at('starch') + i * 0.05, 0.3, linear)); tr(o.g, lerp(o.x0, o.x, p), lerp(o.y0, 360, p) + Math.sin(t * 2 + i) * 6 * (1 - p) * AMP, 1, o.r0 * (1 - p)); });
      op(links, P(t, mid('starch', 0.22) + 1.05, 0.2, linear));
      careersPop(starchChip, 727, 448, P(t, mid('starch', 0.45), 0.4, pop));
      op(starchSub, P(t, mid('starch', 0.5), 0.3, linear)); tr(starchSub, 727, 252);
      [icLeaf, icStem, icSeed].forEach((ic, i) => { const p = P(t, mid('starch', 0.66 + i * 0.1), 0.4, pop); op(ic, clamp(p * 3)); ic.setAttribute('transform', `translate(${[470, 727, 985][i]} 545) scale(${Math.max(0.01, 0.6 + 0.4 * p).toFixed(3)})`); op(stLbls[i], clamp(p * 3)); });
    }
    if (shot === 'chain') {
      show(chainG, gus);
      const sw = Math.sin(t * TAU * 0.6) * 8 * AMP;
      tr(gus, 600, 420 - Math.abs(sw), 0.9); gus.set({ t, talk: talk(t, 'gus'), mood: 'happy', look: 0, still: true });
      const appear = P(t, at('chain') + 0.05, 1.2, easeOut);
      let hd = '';
      const pos = [{ x: 600, y: 420, s: 0.9 }];
      minis.forEach(m => {
        const s = 0.6 * Math.pow(0.78, m.k - 1), x = 600 + m.sd * (130 + 150 * (1 - Math.pow(0.78, m.k)) / (1 - 0.78) * 0.72), y = 420 - 26 * (1 - Math.pow(0.8, m.k)) - Math.abs(sw) * s;
        const vis_ = clamp(appear * 7 - m.k + 1);
        op(m.g, vis_); tr(m.g, x, y + (1 - vis_) * 30, Math.max(0.01, s), sw * 0.4 * m.sd);
        m.x = x; m.y = y; m.s = s; m.v = vis_;
      });
      [-1, 1].forEach(sd => {
        let px = 600, py = 420 - Math.abs(sw), ps = 0.9;
        minis.filter(m => m.sd === sd).sort((a, b) => a.k - b.k).forEach(m => {
          if (m.v > 0.5) hd += `M${(px + sd * 82 * ps).toFixed(1)},${(py + 20 * ps).toFixed(1)} Q${((px + m.x) / 2).toFixed(1)},${(Math.max(py, m.y) + 40 * ps).toFixed(1)} ${(m.x - sd * 82 * m.s).toFixed(1)},${(m.y + 20 * m.s).toFixed(1)} `;
          px = m.x; py = m.y; ps = m.s;
        });
      });
      attr(handPath, 'd', hd);
      op(chainTail, clamp(appear * 7 - 2.5));
      careersPop(chainChip, 600, 672, P(t, mid('chain', 0.35), 0.4, pop));
    }
    if (shot === 'insol') {
      show(insol);
      careersPop(insChip, 720, 252, P(t, at('insol') + 0.1, 0.4, pop));
      // glucose drops in and dissolves
      const dropG = P(t, at('insol') + 0.3, 0.6, easeIn), dis = P(t, mid('insol', 0.3), 1.4, easeOut);
      op(iGlu, (dropG > 0 ? 1 : 0) * (1 - P(t, mid('insol', 0.3), 0.3, linear))); tr(iGlu, 540, lerp(220, 430, dropG), 1, dropG * 90);
      { let d = ''; for (let i = 0; i < 9; i++) { const a = i / 9 * TAU + 0.4, r = 20 + dis * (52 + (i % 3) * 14), x = 540 + Math.cos(a) * r * 1.1, y = 445 + Math.sin(a) * r * 0.75 + Math.sin(t * 2 + i) * 4 * AMP; d += phPoly(phHex(8, true).map(([u, v]) => [u + x, v + y])) + ' '; } attr(iBits, 'd', d); op(iBits, dis > 0 ? (1 - 0.7 * dis) : 0); }
      // the starch lump drops in and stays put
      const dropS = P(t, mid('insol', 0.35), 0.7, easeIn);
      op(lump, dropS > 0 ? 1 : 0); tr(lump, 900, lerp(220, 480, dropS), 1, (1 - dropS) * 30);
      op(lblL, P(t, mid('insol', 0.38), 0.3, linear)); op(lblR, P(t, mid('insol', 0.52), 0.3, linear));
      careersPop(balChip, 720, 684, P(t, mid('insol', 0.6), 0.4, pop));
      careersPop(perfTick, 1100, 580, P(t, mid('insol', 0.88), 0.35, pop), 1.2);
    }
    if (shot === 'cell') {
      show(cellG, plant);
      careersPop(cellChip, 760, 252, P(t, mid('cell', 0.12), 0.4, pop));
      fibArrow.set(P(t, mid('cell', 0.22), 0.4, linear));
      bricks.forEach((b, i) => { const p = P(t, mid('cell', 0.2) + i * 0.2, 0.25, pop); op(b, clamp(p * 3)); b.setAttribute('transform', `translate(0 ${(-30 * (1 - clamp(p))).toFixed(1)})`); });
      op(cellLbl, P(t, mid('cell', 0.5), 0.3, linear));
      tr(plant, 1070, 632, 0.62);
      plant.set({ t, droop: 1 - P(t, mid('cell', 0.72), 0.8, pop) });
    }
    if (shot === 'prot') {
      show(protG, plant);
      op(pGlu, P(t, at('prot') + 0.05, 0.3, linear)); tr(pGlu, 420, 330, 1, t * 10 % 360);
      op(pPlus, P(t, mid('prot', 0.42), 0.3, linear));
      careersPop(nitr, 640, 330, P(t, mid('prot', 0.45), 0.4, pop));
      pArrow.set(P(t, mid('prot', 0.62), 0.3, linear));
      const bp = P(t, mid('prot', 0.66), 0.8, easeOut);
      let d = '';
      const bd = ['', '']; const nB = Math.floor(bp * 8 + 0.01); for (let i = 0; i < 8; i++) { const x = 860 + i * 30, y = 330 + Math.sin(i * 1.2 + t * 2 * AMP) * 16; if (i < nB) bd[i % 2] += `M${x - 15},${y.toFixed(1)} a15,15 0 1,0 30,0 a15,15 0 1,0 -30,0 `; if (i < Math.max(1, nB)) d += (i ? 'L' : 'M') + x.toFixed(1) + ',' + y.toFixed(1); } beadEls.forEach((b, k) => attr(b, 'd', bd[k]));
      attr(beadLine, 'd', d); op(beadLine, bp);
      op(protLbl, P(t, mid('prot', 0.7), 0.3, linear));
      careersPop(growChip, 760, 520, P(t, mid('prot', 0.25), 0.4, pop));
      growArrow.set(P(t, mid('prot', 0.8), 0.3, linear));
      const gp = P(t, mid('prot', 0.25), 1.6, easeOut) * 0.4 + P(t, mid('prot', 0.85), 0.9, pop) * 0.6;
      tr(plant, 1070, 632, lerp(0.48, 0.66, gp));
      plant.set({ t, droop: 0 });
    }

    /* ---------------- DAY / NIGHT ---------------- */
    if (shot === 'both') {
      show(dnShot, dnFg, clive);
      careersPop(resToo, 560, 640, P(t, at('both') + 0.1, 0.4, pop) * (1 - P(t, mid('both', 0.85), 0.3, linear)));
      const rp = P(t, mid('both', 0.3), 1.2, ease), pp = P(t, mid('both', 0.68), 0.9, ease);
      attr(barR, 'width', 1000 * rp); op(txR, P(t, mid('both', 0.3) + 0.6, 0.3, linear));
      attr(barP, 'width', 500 * pp); op(txP, P(t, mid('both', 0.68) + 0.5, 0.3, linear));
      op(offP, P(t, mid('both', 0.85), 0.3, linear));
      tr(clive, 1060, 640, 0.55); clive.set({ t, talk: cliveTalk, mood: 'neutral', look: -0.6 });
    }

    /* ---------------- PHYLLIS ---------------- */
    if (shot === 'phyl') {
      show(phDim, phBeam, phFg, phylBody);
      const tTalk = at('talk') - 0.08;
      const away = P(t, tTalk + 0.05, 0.3, ease);
      const pk = 1 + 0.1 * P(t, end('talk'), at('mass') - end('talk'), easeOut);
      const PX = 360 - 30 * away, PY = 430, PS = 1.25 * pk;
      phyl.setAttribute('transform', `translate(${PX} ${PY}) scale(${(PS * (1 - 0.12 * away)).toFixed(4)} ${PS.toFixed(4)})`);
      let mood = 'smug', look = 0.3;
      if (t >= at('yellow') - 0.08) { mood = 'sad'; look = 0.6; }
      if (t >= tTalk) { mood = 'annoyed'; look = 1; }
      phyl.set({ t, talk: talk(t, 'phyllis'), mood, look });
      if (shades) { const d = P(t, at('talk') + 0.3, 0.4, ease); tr(shades, 0, lerp(-100, -4, d), 1, lerp(-8, 0, d)); }
      op(phBeam, 0.85 + 0.15 * Math.sin(t * 1.5));
      // mg: she taps her gem
      const mgOn = t < at('yellow') - 0.08 ? 1 : 0;
      const bob = Math.sin(t * TAU * 0.5 + 9) * 5;
      const gx = PX, gy = PY + (bob - 58) * PS;
      const reach = P(t, mid('mg', 0.2), 0.35, ease) * (1 - P(t, mid('mg', 0.85), 0.3, ease));
      const tapK = Math.max(0, Math.sin((t - mid('mg', 0.3)) * 14)) * (t > mid('mg', 0.3) && t < mid('mg', 0.8) ? 1 : 0);
      op(tapHand, mgOn * reach);
      const sx = PX + 60 * PS, sy = PY - 40 * PS;
      const hx = lerp(sx + 60, gx + 30, reach), hy = lerp(sy + 40, gy + 40 - 12 * tapK, reach);
      const armD = `M${sx.toFixed(1)},${sy.toFixed(1)} Q${(sx + 70).toFixed(1)},${(sy - 20).toFixed(1)} ${(hx + 6).toFixed(1)},${(hy + 22).toFixed(1)}`;
      attr(tapArm, 'd', armD); attr(tapArmIn, 'd', armD); tr(tapTip, hx, hy, 1.2, -25);
      op(tapRing, mgOn * reach * (0.3 + 0.7 * tapK)); tr(tapRing, gx, gy, 1 + 0.4 * tapK);
      careersPop(mgBig, 900, 260, mgOn * P(t, mid('mg', 0.55), 0.4, pop));
      careersPop(mgIons, 860, 380, mgOn * P(t, mid('mg', 0.7), 0.4, pop));
      careersPop(mgNeed, 860, 470, mgOn * P(t, mid('mg', 0.82), 0.4, pop));
      // yellow: chlorosis
      const yOn = t >= at('yellow') - 0.08 && t < tTalk ? 1 : 0;
      const yp = P(t, mid('yellow', 0.1), 1.4, ease);
      op(yLeaf, yOn * P(t, at('yellow'), 0.25, linear)); attr(yBody, 'fill', phMix('#3FAE5A', '#E8D24A', yp));
      careersPop(yChip, 880, 480, yOn * P(t, mid('yellow', 0.32), 0.4, pop));
      ycEls.forEach(({ c, ar }, i) => { const p = yOn * P(t, mid('yellow', 0.5 + i * 0.16), 0.3, linear); op(c, p); if (ar) { op(ar, yOn); ar.set(P(t, mid('yellow', 0.58 + i * 0.16), 0.3, linear) * yOn); } });
      op(yChain, yOn);
      op(fan, yOn); tr(fan, PX + 150, PY - 30, 1, -30 + Math.sin(t * 9) * 22 * AMP);
      const pp = t >= tTalk ? P(t, mid('talk', 0.3), 0.35, pop) : 0;
      careersPop(palm, PX + 210, PY - 40, pp, 1.3, -10);
    }

    /* ---------------- TREE ---------------- */
    if (shot === 'mass' || shot === 'me') {
      show(treeShot, trFg);
      const isMass = shot === 'mass';
      trees.forEach((o, i) => {
        if (i < 2) { const p = isMass ? P(t, at('mass') + 0.1 + i * 0.5, 0.45, pop) : 0; op(o.g, clamp(p * 3)); tr(o.g, o.x, 640, Math.max(0.01, o.s * (0.7 + 0.3 * p))); }
        else { const p = isMass ? P(t, at('mass') + 1.1, 0.45, pop) : 1; op(o.g, clamp(p * 3)); tr(o.g, o.x, 640, Math.max(0.01, (0.7 + 0.3 * p) * (1 + 0.02 * Math.sin(t * 1.2) * AMP))); }
      });
      stageArrows.forEach((a, i) => { op(a, isMass ? 1 : 0); a.set(isMass ? P(t, at('mass') + 0.4 + i * 0.5, 0.3, linear) : 0); });
      careersPop(massQ, 640, 150, isMass ? P(t, at('mass') + 0.2, 0.4, pop) : 0);
      careersPop(qMark, 1040, 380, isMass ? P(t, mid('mass', 0.35), 0.4, pop) * (1 - P(t, mid('mass', 0.68), 0.2, linear)) : 0, 1, Math.sin(t * 2) * 5 * AMP);
      careersPop(soilQ, 1050, 440, P(t, mid('mass', 0.72), 0.4, pop));
      op(soilArrow, isMass ? P(t, mid('mass', 0.78), 0.2, linear) : 1); soilArrow.set(P(t, mid('mass', 0.78), 0.3, linear));
      // me: Cosmo, and carbon dioxide streaming into the leaves
      const crossP = isMass ? 0 : P(t, mid('me', 0.5), 0.35, pop);
      careersPop(soilX, 918, 410, crossP, 0.7);
      co2s.forEach((m, i) => {
        if (isMass) { op(m, 0); return; }
        const u = ((t - at('me')) * 0.33 + i / co2s.length) % 1;
        const x0 = 420 + (i % 3) * 30, y0 = 140 + (i % 4) * 40, x1 = 790 + ((i * 37) % 120) - 60, y1 = 640 - 300 + ((i * 53) % 90) - 45;
        op(m, P(t, at('me') + 0.6, 0.4, linear) * Math.min(1, u * 5, (1 - u) * 6));
        tr(m, lerp(x0, x1, u), lerp(y0, y1, u) + Math.sin(u * 6 + i) * 18, 1, u * 200 + i * 40);
      });
      careersPop(massCard, 600, 700, isMass ? 0 : P(t, mid('me', 0.42), 0.4, pop));
      careersPop(dryNote, 870, 150, isMass ? 0 : P(t, mid('me', 0.66), 0.4, pop));
      if (!isMass) {
        show(cosmo);
        const ep = P(t, at('me') - 0.08, 0.6, easeOut);
        tr(cosmo, lerp(-120, 250, ep), 400, 0.95);
        cosmo.set({ t, talk: talk(t, 'cosmo'), mood: 'smug', look: 0.5 });
      }
    }

    /* ---------------- LOG ---------------- */
    if (shot === 'wood') {
      show(logShot, logFg, cosmo);
      const lp = P(t, at('wood') + 0.05, 0.45, pop);
      careersPop(logG, 790, 360, lp, 1);
      op(logFaces, P(t, mid('wood', 0.2), 0.6, linear));
      careersPop(woodLbl, 1060, 160, P(t, at('wood') + 0.2, 0.4, pop));
      careersPop(woodChip, 760, 660, P(t, mid('wood', 0.42), 0.4, pop));
      tr(cosmo, 250, 410, 1.0);
      const welcome = t > mid('wood', 0.75);
      cosmo.set({ t, talk: talk(t, 'cosmo'), mood: welcome ? 'smug' : 'happy', look: welcome ? 0 : 0.6 });
    }

    // blackout before the first line (behind the chapter card)
    op(blackout, 1 - P(t, at('noon') - 0.15, 0.3, linear));
    VIS.forEach(e => op(e, vis.has(e) ? (e === phDim ? 0.5 : (e === phBeam ? 0.85 + 0.15 * Math.sin(t * 1.5) : 1)) : 0));
    if (shot !== 'noon') op(clock, 0);
  };
});
