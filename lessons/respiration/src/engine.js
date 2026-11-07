/* ==========================================================================
   engine.js: the lesson player. One narration track drives everything: the
   scene for the current chapter is rendered as a pure function of the audio
   clock, so play, pause, scrub, speed and chapter jumps all stay in sync.
   ========================================================================== */
(function () {
  'use strict';
  /* Scenes measure label widths, so build them only once the stage fonts are in (or after 3 s). */
  function waitFonts() {
    const f = document.fonts;
    if (!f || !f.load) return Promise.resolve();
    const faces = ['500 40px Fredoka', '600 40px Fredoka', '700 40px Fredoka', '400 24px "Atkinson Hyperlegible Next"', '600 24px "Atkinson Hyperlegible Next"'];
    return Promise.race([Promise.all(faces.map(x => f.load(x).catch(() => null))), new Promise(r => setTimeout(r, 3000))]);
  }
  function boot() {
  const TL = JSON.parse(document.getElementById('timeline').textContent);
  const CH = TL.chapters, TOTAL = TL.total;
  const REDUCE = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  const $ = s => document.querySelector(s);
  const svg = $('#stage');
  const KEY = 'resp-lesson-v1';
  const store = {
    get() { try { return JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { return {}; } },
    set(o) { try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) { /* storage blocked: fine */ } },
  };
  const saved = store.get();
  const fmt = s => { s = Math.max(0, Math.floor(s + 0.0001)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const md = s => esc(s).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  let n = 0;
  const NUM = CH.map(c => (c.card === false ? '' : c.id === 'recap' ? '★' : c.id === 'quiz' ? '?' : String(++n)));
  const CORE = n;
  function chapterAt(t) { let i = 0; for (let k = 0; k < CH.length; k++) if (t >= CH[k].start) i = k; return i; }

  /* ---------- stage: background, scenes, HUD ---------- */
  function background() {
    const g = G(svg, { 'aria-hidden': 'true' });
    E('rect', { width: W, height: H, fill: linGrad(C.bg1, C.bg0, true) }, g);
    E('ellipse', { cx: 980, cy: 120, rx: 520, ry: 330, fill: glow('#1E5468'), opacity: 0.55 }, g);
    E('ellipse', { cx: 160, cy: 700, rx: 480, ry: 300, fill: glow('#173E52'), opacity: 0.6 }, g);
    const motes = G(g), r = rng(5), ms = [];
    for (let i = 0; i < 26; i++) ms.push({ el: E('circle', { r: 1.5 + r() * 3.5, fill: '#9FD8FF', opacity: 0.05 + r() * 0.12 }, motes), x: r() * W, y: r() * H, sx: (r() - 0.5) * 9, sy: -4 - r() * 8 });
    return t => { if (REDUCE) t = 0; ms.forEach(m => { attr(m.el, 'cx', ((m.x + m.sx * t) % W + W) % W); attr(m.el, 'cy', ((m.y + m.sy * t) % H + H) % H); }); };
  }
  const drawBg = background();
  const layerScenes = G(svg);
  const layerHud = G(svg, { 'aria-hidden': 'true' });

  function placeholder(S, broken) {
    const g = G(S.root);
    card(g, 150, 170, 900, 420, { fill: C.card, stroke: C.line });
    T(g, 600, 300, S.ch.title, { size: 52, anchor: 'middle', weight: 700 });
    const cap = T(g, 600, 380, '', { size: 28, anchor: 'middle', fill: C.muted, font: FB });
    T(g, 600, 520, broken ? 'This scene could not be drawn.' : 'Animation coming soon', { size: 24, anchor: 'middle', fill: C.faint, font: FB });
    return t => { const l = S.ch.lines.filter(l => l.start - S.ch.start <= t + 0.05).pop(); setText(cap, l ? l.cap.replace(/\*\*/g, '').slice(0, 70) + (l.cap.length > 70 ? '…' : '') : ''); };
  }

  const scenes = CH.map((ch, i) => {
    const root = G(layerScenes, { 'data-scene': ch.id });
    const idx = {}; ch.lines.forEach(l => { idx[l.id] = l; });
    const look = id => { const l = idx[id]; if (!l) { console.warn('[lesson] unknown cue', ch.id + '.' + id); return null; } return l; };
    const S = {
      root, ch, index: i, reduce: REDUCE, D: ch.end - ch.start, first: ch.lines[0].start - ch.start,
      at: id => { const l = look(id); return l ? l.start - ch.start : 1e6; },
      end: id => { const l = look(id); return l ? l.end - ch.start : 1e6; },
      mid: (id, f) => { const l = look(id); return l ? l.start - ch.start + (f === undefined ? 0.5 : f) * (l.end - l.start) : 1e6; },
    };
    let upd;
    try { upd = SCENES[ch.id] ? SCENES[ch.id](S) : placeholder(S); }
    catch (e) { console.error('[lesson] scene build failed:', ch.id, e); root.innerHTML = ''; upd = placeholder(S, true); }
    op(root, 0);
    return { ch, root, upd, S, err: false };
  });

  /* chapter tag (top-left) and title card */
  const tags = CH.map((ch, i) => {
    if (!NUM[i]) return null;
    const g = G(layerHud);
    const label = ch.short;
    const w = textWidth(label, 24, FD, 600) + 92;
    E('rect', { x: 28, y: 24, width: w, height: 48, rx: 24, fill: 'rgba(10,27,39,0.72)', stroke: C.line, 'stroke-width': 2 }, g);
    E('circle', { cx: 52, cy: 48, r: 17, fill: C.energy }, g);
    T(g, 52, 56, NUM[i], { size: 22, weight: 700, fill: C.bg0, anchor: 'middle' });
    T(g, 80, 56, label, { size: 24, weight: 600, fill: C.ink });
    op(g, 0);
    return g;
  });
  const cardG = G(layerHud); op(cardG, 0);
  E('rect', { width: W, height: H, fill: C.bg0, opacity: 0.55 }, cardG);
  const cardInner = G(cardG);
  const cardHalo = E('circle', { cx: 0, cy: -70, r: 150, fill: glow(C.energy), opacity: 0.35 }, cardInner);
  const cardDisc = E('circle', { cx: 0, cy: -70, r: 74, fill: C.energy }, cardInner);
  const cardNum = T(cardInner, 0, -44, '', { size: 78, weight: 700, fill: C.bg0, anchor: 'middle' });
  const cardTitle = T(cardInner, 0, 88, '', { size: 58, weight: 700, fill: C.ink, anchor: 'middle' });
  const cardSub = T(cardInner, 0, 140, '', { size: 26, weight: 600, fill: C.muted, anchor: 'middle', font: FB, ls: 1 });
  let cardFor = -1;
  function drawCard(i, t) {
    const ch = CH[i], S = scenes[i].S;
    if (!ch.card) { op(cardG, 0); return; }
    const a = Math.min(P(t, 0.2, 0.3, linear), 1 - P(t, S.first - 0.35, 0.3, linear));
    op(cardG, a);
    if (a <= 0) return;
    if (cardFor !== i) {
      cardFor = i;
      setText(cardNum, NUM[i]);
      setText(cardTitle, ch.title);
      setText(cardSub, NUM[i] === '★' ? 'RECAP' : NUM[i] === '?' ? 'QUIZ' : `CHAPTER ${NUM[i]} OF ${CORE}`);
    }
    const p = P(t, 0.2, 0.7, easeOut);
    tr(cardInner, 600, 380 + (1 - p) * 24, 0.94 + 0.06 * p);
    tr(cardHalo, 0, 0, 0.9 + 0.12 * wave(t, 1.4));
    cardDisc.setAttribute('r', (74 * pop(clamp((t - 0.2) / 0.5))).toFixed(1));
  }

  let shown = [];
  function drawScene(sc, t) {
    try { sc.upd(t); } catch (e) { if (!sc.err) { sc.err = true; console.error('[lesson] scene error:', sc.ch.id, e); } }
  }
  function render(gt) {
    gt = clamp(gt, 0, TOTAL);
    drawBg(gt);
    const i = chapterAt(gt), ch = CH[i], t = gt - ch.start, sc = scenes[i];
    const a = ch.card ? clamp((t - (sc.S.first - 0.1)) / 0.4) : 1;
    const vis = [];
    if (i > 0 && ch.card && t < 0.3) { const pv = scenes[i - 1]; drawScene(pv, gt - pv.ch.start); op(pv.root, 1 - t / 0.3); vis.push(pv); }
    if (a > 0) { drawScene(sc, t); op(sc.root, a); vis.push(sc); }
    shown.forEach(s => { if (vis.indexOf(s) < 0) op(s.root, 0); });
    shown = vis;
    tags.forEach((g, k) => { if (g) op(g, k === i ? a : 0); });
    drawCard(i, t);
  }

  /* ---------- DOM: captions, controls, chapters, transcript ---------- */
  const player = $('#player'), captionEl = $('#caption'), bigplay = $('#bigplay'), endcard = $('#endcard');
  const btnPlay = $('#btn-play'), btnPrev = $('#btn-prev'), btnNext = $('#btn-next'), timeEl = $('#time');
  const btnSpeed = $('#btn-speed'), btnCC = $('#btn-cc'), btnFS = $('#btn-fs'), scrub = $('#scrub'), knob = $('#knob');
  const segWrap = $('#segs'), listEl = $('#chapters'), transEl = $('#transcript-body'), noteEl = $('#player-note');
  const segs = CH.map((ch, i) => {
    const s = document.createElement('span'); s.className = 'seg'; s.style.flexGrow = String(ch.end - ch.start);
    s.title = (NUM[i] ? NUM[i] + '. ' : '') + ch.title;
    const f = document.createElement('i'); s.appendChild(f); segWrap.appendChild(s); return { s, f };
  });
  const items = CH.map((ch, i) => {
    const li = document.createElement('li');
    const b = document.createElement('button'); b.type = 'button'; b.className = 'ch'; b.id = 'ch-' + ch.id;
    b.innerHTML = `<span class="ch-n" aria-hidden="true">${NUM[i] || '▶'}</span><span class="ch-t">${esc(ch.title)}</span><span class="ch-d">${fmt(ch.end - ch.start)}</span><span class="ch-bar" aria-hidden="true"><i></i></span>`;
    b.setAttribute('aria-label', `${NUM[i] && NUM[i] !== '★' && NUM[i] !== '?' ? 'Chapter ' + NUM[i] + ': ' : ''}${ch.title}, ${Math.round((ch.end - ch.start))} seconds`);
    b.addEventListener('click', () => { jumpTo(ch.start, true); player.scrollIntoView({ behavior: REDUCE ? 'auto' : 'smooth', block: 'start' }); });
    li.appendChild(b); listEl.appendChild(li);
    return { b, bar: b.querySelector('.ch-bar i') };
  });
  CH.forEach((ch, i) => {
    const sec = document.createElement('section');
    sec.innerHTML = `<h3>${NUM[i] && /\d/.test(NUM[i]) ? NUM[i] + '. ' : ''}${esc(ch.title)}</h3>` +
      ch.lines.map(l => `<p><button type="button" class="ts" data-t="${l.start}" aria-label="Play from ${fmt(l.start)}">${fmt(l.start)}</button> ${md(l.cap)}</p>`).join('');
    transEl.appendChild(sec);
  });
  transEl.addEventListener('click', e => { const b = e.target.closest('.ts'); if (b) { jumpTo(+b.dataset.t - 0.05, true); player.scrollIntoView({ behavior: REDUCE ? 'auto' : 'smooth', block: 'start' }); } });
  $('#total').textContent = Math.round(TOTAL / 60) + ' min';

  /* ---------- clock: narration audio, or a silent clock if audio can't play ---------- */
  const audio = new Audio();
  audio.preload = 'auto';
  let mode = 'loading';            // 'loading' | 'audio' | 'silent'
  let wantPlay = false, rate = 1;
  let sT = 0, sPlaying = false, sLast = 0;       // silent clock
  let lastA = -1, lastPerf = 0, pending = null;
  function now() {
    if (mode === 'audio') {
      const a = audio.currentTime;
      if (!audio.paused) { const p = performance.now(); if (a !== lastA) { lastA = a; lastPerf = p; } return Math.min(lastA + (p - lastPerf) / 1000 * audio.playbackRate, lastA + 0.3); }
      return pending !== null ? pending : a;
    }
    if (sPlaying) { const p = performance.now(); sT = Math.min(TOTAL, sT + (p - sLast) / 1000 * rate); sLast = p; if (sT >= TOTAL) { sPlaying = false; ended(); } }
    return sT;
  }
  const playing = () => (mode === 'audio' ? !audio.paused : sPlaying);
  function play() {
    posterT = null; lastLine = undefined;
    bigplay.hidden = true; endcard.hidden = true;
    if (mode === 'loading') { wantPlay = true; setLoadingLabel(); return; }
    if (mode === 'audio') {
      if (audio.currentTime >= TOTAL - 0.05) audio.currentTime = 0;
      const pr = audio.play();
      if (pr && pr.catch) pr.catch(() => { syncButtons(); bigplay.hidden = false; setBigLabel('Tap to play'); });
    } else { if (sT >= TOTAL - 0.05) sT = 0; sPlaying = true; sLast = performance.now(); }
    wake(true); syncButtons(); kick();
  }
  function pause() { if (mode === 'audio') audio.pause(); else sPlaying = false; wantPlay = false; wake(false); syncButtons(); savePos(true); kick(); }
  function toggle() { playing() ? pause() : play(); }
  function seek(t) {
    t = clamp(t, 0, TOTAL);
    if (posterT !== null) { posterT = null; lastLine = undefined; }
    bigplay.hidden = true; endcard.hidden = true;
    if (mode === 'audio') { try { audio.currentTime = t; } catch (e) { pending = t; } lastA = -1; if (audio.paused) pending = t; }
    else if (mode === 'loading') pending = t;
    else { sT = t; sLast = performance.now(); }
    kick();
  }
  function jumpTo(t, autoplay) { seek(t); if (autoplay && !playing()) play(); }
  function ended() { wake(false); syncButtons(); savePos(true, 0); endcard.hidden = false; kick(); }

  async function loadAudio() {
    const src = player.getAttribute('data-audio') || 'narration.mp3';
    let url = null;
    try {
      const res = await fetch(src);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const len = +res.headers.get('content-length') || 0;
      let buf;
      if (res.body && res.body.getReader && len) {
        const rd = res.body.getReader(), parts = []; let got = 0;
        for (;;) { const { done, value } = await rd.read(); if (done) break; parts.push(value); got += value.length; setLoadingLabel(got / len); }
        buf = new Blob(parts, { type: 'audio/mpeg' });
      } else buf = new Blob([await res.arrayBuffer()], { type: 'audio/mpeg' });
      url = URL.createObjectURL(buf);
    } catch (e) { url = src; }
    let triedDirect = url === src;
    audio.addEventListener('error', () => {
      if (!triedDirect) { triedDirect = true; audio.src = src; audio.load(); return; }
      if (mode !== 'silent') goSilent();
    });
    audio.addEventListener('loadedmetadata', () => {
      if (mode === 'audio') return;
      mode = 'audio';
      audio.playbackRate = rate;
      if (pending !== null) { try { audio.currentTime = pending; } catch (e) { /* retry on play */ } }
      setBigLabel();
      if (wantPlay) play();
      kick();
    });
    audio.addEventListener('seeked', () => { if (Math.abs(audio.currentTime - (pending ?? audio.currentTime)) < 0.5) pending = null; kick(); });
    audio.addEventListener('play', () => { pending = null; syncButtons(); kick(); });
    audio.addEventListener('pause', () => { syncButtons(); kick(); });
    audio.addEventListener('ended', ended);
    audio.src = url;
    audio.load();
    setTimeout(() => { if (mode === 'loading') goSilent(); }, 25000);
  }
  function goSilent() {
    mode = 'silent';
    sT = pending !== null ? pending : sT; pending = null;
    noteEl.hidden = false;
    noteEl.textContent = 'The narration could not load on this device, so the lesson plays silently with captions.';
    ccOn = true; syncCC(); setBigLabel();
    if (wantPlay) play();
  }

  /* ---------- UI sync ---------- */
  let ccOn = true;
  const SPEEDS = [1, 1.25, 1.5, 0.75];
  function setBigLabel(txt) {
    const lbl = bigplay.querySelector('.bp-label'), alt = $('#bp-restart');
    if (txt) { lbl.textContent = txt; return; }
    const pos = resumeAt();
    if (pos) { lbl.textContent = 'Resume at ' + fmt(pos); alt.hidden = false; }
    else { lbl.textContent = startLabel || 'Play the lesson'; alt.hidden = true; }
  }
  function setLoadingLabel(frac) {
    if (!wantPlay) return;
    bigplay.hidden = false;
    bigplay.querySelector('.bp-label').textContent = 'Loading narration' + (frac ? ' ' + Math.round(frac * 100) + '%' : '…');
  }
  function syncButtons() {
    const p = playing();
    player.classList.toggle('is-playing', p);
    btnPlay.setAttribute('aria-label', p ? 'Pause' : 'Play');
    btnPlay.title = p ? 'Pause (space)' : 'Play (space)';
  }
  function syncCC() { player.classList.toggle('cc-off', !ccOn); btnCC.setAttribute('aria-pressed', String(ccOn)); }
  let lastSec = -1, lastLine = null, lastCh = -1;
  const done = new Set(Array.isArray(saved.done) ? saved.done : []);
  function ui(gt) {
    const i = chapterAt(gt), ch = CH[i];
    const sec = Math.floor(gt);
    if (sec !== lastSec) {
      lastSec = sec;
      timeEl.textContent = fmt(gt) + ' / ' + fmt(TOTAL);
      scrub.setAttribute('aria-valuenow', String(sec));
      scrub.setAttribute('aria-valuetext', fmt(gt) + ', ' + ch.title);
    }
    let line = null; for (const l of ch.lines) { if (gt >= l.start - 0.05) line = l; else break; }
    if (line !== lastLine) { lastLine = line; captionEl.innerHTML = line ? md(line.cap) : ''; }
    // a chapter counts as watched only when playback runs through its last line
    if (playing() && !done.has(ch.id) && gt >= ch.lines[ch.lines.length - 1].end - 0.15) { done.add(ch.id); savePos(true); }
    segs.forEach((sg, k) => { const c = CH[k]; sg.f.style.width = (clamp((gt - c.start) / (c.end - c.start)) * 100).toFixed(2) + '%'; });
    const s = segs[i].s; knob.style.left = (s.offsetLeft + s.offsetWidth * clamp((gt - ch.start) / (ch.end - ch.start))).toFixed(1) + 'px';
    if (i !== lastCh) {
      if (lastCh >= 0) items[lastCh].b.removeAttribute('aria-current');
      items[i].b.setAttribute('aria-current', 'step');
      lastCh = i;
      svg.setAttribute('aria-label', 'Animation, ' + (NUM[i] && /\d/.test(NUM[i]) ? 'chapter ' + NUM[i] + ': ' : '') + ch.title);
      mediaMeta(i);
    }
    items.forEach((it, k) => {
      const c = CH[k];
      it.bar.style.width = (clamp((gt - c.start) / (c.end - c.start)) * 100).toFixed(1) + '%';
      it.b.classList.toggle('done', done.has(c.id));
    });
  }
  let lastSave = 0;
  function savePos(force, value) {
    const p = performance.now();
    if (!force && p - lastSave < 3000) return;
    lastSave = p;
    const t = value !== undefined ? value : now();
    store.set({ pos: t > TOTAL - 8 ? 0 : t, done: Array.from(done) });
  }
  function resumeAt() { const p = saved.pos || 0; return p > 12 && p < TOTAL - 8 ? p : 0; }

  /* ---------- frame loop ---------- */
  let raf = 0, posterT = null;
  function loop() {
    raf = 0;
    const t = now();
    render(posterT !== null ? posterT : t); ui(t);
    if (posterT !== null) captionEl.innerHTML = '<span class="cap-hint">Press play. The narrator reads every line, and the words appear here.</span>';
    if (playing()) { savePos(false); raf = requestAnimationFrame(loop); }
  }
  function kick() { if (!raf) raf = requestAnimationFrame(loop); }

  /* ---------- scrubber ---------- */
  function timeFromX(x) {
    for (let k = 0; k < segs.length; k++) {
      const s = segs[k].s, L = s.offsetLeft, Wd = s.offsetWidth;
      if (x < L + Wd + 2 || k === segs.length - 1) return CH[k].start + clamp((x - L) / Wd) * (CH[k].end - CH[k].start);
    }
    return 0;
  }
  let dragging = false, wasPlaying = false;
  function scrubAt(e) { const r = segWrap.getBoundingClientRect(); seek(timeFromX(e.clientX - r.left)); }
  scrub.addEventListener('pointerdown', e => { dragging = true; wasPlaying = playing(); if (wasPlaying) (mode === 'audio' ? audio.pause() : (sPlaying = false)); scrub.setPointerCapture(e.pointerId); scrubAt(e); });
  scrub.addEventListener('pointermove', e => { if (dragging) scrubAt(e); });
  const endDrag = () => { if (!dragging) return; dragging = false; bigplay.hidden = true; if (wasPlaying) play(); else { savePos(true); } };
  scrub.addEventListener('pointerup', endDrag);
  scrub.addEventListener('pointercancel', endDrag);
  scrub.addEventListener('keydown', e => {
    const t = now();
    const map = { ArrowLeft: -5, ArrowRight: 5, PageDown: -30, PageUp: 30 };
    if (e.key in map) { seek(t + map[e.key]); e.preventDefault(); }
    else if (e.key === 'Home') { seek(0); e.preventDefault(); }
    else if (e.key === 'End') { seek(TOTAL - 1); e.preventDefault(); }
  });

  /* ---------- buttons and keys ---------- */
  function prevChapter() { const t = now(), i = chapterAt(t); jumpTo(t - CH[i].start > 3 || i === 0 ? CH[i].start : CH[i - 1].start, playing()); }
  function nextChapter() { const i = chapterAt(now()); if (i < CH.length - 1) jumpTo(CH[i + 1].start, playing()); }
  // After a mouse/touch click, drop focus so Space goes back to play/pause
  // (keyboard-activated clicks have detail 0 and keep focus as usual).
  document.addEventListener('click', e => { const b = e.target.closest && e.target.closest('#player button, #chapters button, .ts'); if (b && e.detail > 0) b.blur(); });
  btnPlay.addEventListener('click', toggle);
  btnPrev.addEventListener('click', prevChapter);
  btnNext.addEventListener('click', nextChapter);
  // From the untouched poster, start at 0:00; after a scrub or chapter pick, play from there.
  bigplay.querySelector('.bp-main').addEventListener('click', () => { if (posterT !== null && !resumeAt() && !startAt) seek(0); play(); });
  $('#bp-restart').addEventListener('click', () => { seek(0); play(); });
  $('#end-replay').addEventListener('click', () => { seek(0); play(); });
  btnSpeed.addEventListener('click', () => {
    rate = SPEEDS[(SPEEDS.indexOf(rate) + 1) % SPEEDS.length];
    audio.playbackRate = rate; btnSpeed.textContent = String(rate).replace(/^0/, '') + '×';
    btnSpeed.setAttribute('aria-label', 'Playback speed ' + rate + ' times');
  });
  btnCC.addEventListener('click', () => { ccOn = !ccOn; syncCC(); });
  function fsActive() { return document.fullscreenElement || document.webkitFullscreenElement || player.classList.contains('theater'); }
  function toggleFS() {
    if (document.fullscreenElement || document.webkitFullscreenElement) { (document.exitFullscreen || document.webkitExitFullscreen).call(document); return; }
    if (player.classList.contains('theater')) { player.classList.remove('theater'); document.body.classList.remove('no-scroll'); syncFS(); return; }
    const req = player.requestFullscreen || player.webkitRequestFullscreen;
    const theater = () => { player.classList.add('theater'); document.body.classList.add('no-scroll'); syncFS(); };
    if (req) { try { const r = req.call(player); if (r && r.catch) r.catch(theater); } catch (e) { theater(); } } else theater();
  }
  function syncFS() { const on = !!fsActive(); btnFS.setAttribute('aria-pressed', String(on)); btnFS.setAttribute('aria-label', on ? 'Exit full screen' : 'Full screen'); requestAnimationFrame(() => { lastSec = -1; kick(); }); }
  btnFS.addEventListener('click', toggleFS);
  document.addEventListener('fullscreenchange', syncFS);
  document.addEventListener('webkitfullscreenchange', syncFS);
  window.addEventListener('resize', () => kick());
  document.addEventListener('keydown', e => {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    const tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea' || e.target.isContentEditable) return;
    const onButton = tag === 'button' || tag === 'summary';
    const k = e.key;
    if ((k === ' ' && !onButton) || k === 'k' || k === 'K') { toggle(); e.preventDefault(); }
    else if (e.target === scrub) return;
    else if (k === 'ArrowLeft' && !onButton) { seek(now() - 5); e.preventDefault(); }
    else if (k === 'ArrowRight' && !onButton) { seek(now() + 5); e.preventDefault(); }
    else if (k === 'j' || k === 'J') seek(now() - 10);
    else if (k === 'l' || k === 'L') seek(now() + 10);
    else if (k === '[' || k === 'p' || k === 'P') prevChapter();
    else if (k === ']' || k === 'n' || k === 'N') nextChapter();
    else if (k === 'c' || k === 'C') { ccOn = !ccOn; syncCC(); }
    else if (k === 'f' || k === 'F') toggleFS();
    else if (k === 'Escape' && player.classList.contains('theater')) toggleFS();
  });

  /* ---------- lock screen controls, screen wake ---------- */
  function mediaMeta(i) {
    if (!('mediaSession' in navigator)) return;
    try { navigator.mediaSession.metadata = new MediaMetadata({ title: CH[i].title, artist: 'Year 8 Science Lab', album: 'Respiration, animated' }); } catch (e) { /* unsupported */ }
  }
  if ('mediaSession' in navigator) {
    const set = (a, f) => { try { navigator.mediaSession.setActionHandler(a, f); } catch (e) { /* unsupported */ } };
    set('play', play); set('pause', pause);
    set('seekbackward', () => seek(now() - 10)); set('seekforward', () => seek(now() + 10));
    set('previoustrack', prevChapter); set('nexttrack', nextChapter);
  }
  let lock = null;
  async function wake(on) {
    try {
      if (on && !lock && navigator.wakeLock && document.visibilityState === 'visible') { lock = await navigator.wakeLock.request('screen'); lock.addEventListener('release', () => { lock = null; }); }
      else if (!on && lock) { await lock.release(); lock = null; }
    } catch (e) { lock = null; }
  }
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && playing()) wake(true); });

  /* ---------- start ---------- */
  let startAt = 0, startLabel = '';
  const hashCh = CH.findIndex(c => '#' + c.id === location.hash);
  if (hashCh > 0) { startAt = CH[hashCh].start; startLabel = 'Play from “' + CH[hashCh].short + '”'; pending = startAt; }
  else if (resumeAt()) pending = resumeAt();
  syncButtons(); syncCC(); setBigLabel();
  // Poster: the title moment of the intro, or the chosen chapter's opening.
  const poster = pending !== null ? Math.max(pending, CH[chapterAt(pending)].start + (CH[chapterAt(pending)].card ? scenes[chapterAt(pending)].S.first + 0.8 : 0)) : (CH[0].lines[2] ? CH[0].lines[2].start + 2.2 : 3);
  posterT = poster;
  kick();
  loadAudio();

  window.__lesson = { ready: true, TL, scenes, renderAt: t => { posterT = null; lastLine = undefined; render(t); ui(t); }, seek, play, pause, now, audio, mode: () => mode };
  }
  waitFonts().then(boot, boot);
})();
