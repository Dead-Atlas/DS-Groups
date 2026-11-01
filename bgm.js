const LS = (() => { try { return window.localStorage; } catch { return null; } })();
const rd = (k, d) => { try { const v = LS && LS.getItem(k); return v == null ? d : JSON.parse(v); } catch { return d; } };
const wr = (k, v) => { try { LS && LS.setItem(k, JSON.stringify(v)); } catch {} };
const fa = n => String(n).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);
const fmt = s => (isFinite(s) && s > 0) ? `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}` : '0:00';
const enc = p => p.split('/').map(s => encodeURIComponent(s)).join('/');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

const CSS = `
.bgm{--b-bg:#fff;--b-fg:#111;--b-ac:#e33;--b-bd:#111;--b-r:16px;--b-sh:0 8px 24px rgba(0,0,0,.25);--b-font:'Peyda','IRANYekanX',system-ui,sans-serif;
  position:fixed;z-index:9000;right:14px;inset-block-end:calc(var(--bgm-bottom,14px) + env(safe-area-inset-bottom,0px));
  font:700 13px/1.4 var(--b-font);color:var(--b-fg);direction:rtl;-webkit-tap-highlight-color:transparent}
.bgm *{box-sizing:border-box}
.bgm--inline{position:relative;inset:auto;display:inline-block;z-index:5}
.bgm button{font:inherit;color:inherit;background:none;border:0;padding:0;cursor:pointer;touch-action:manipulation}
.bgm button:focus-visible{outline:2px solid var(--b-ac);outline-offset:2px}
.bgm-disc{position:relative;width:52px;height:52px;border-radius:50%;display:grid;place-items:center;background:var(--b-bg);border:var(--b-bw,2px) var(--b-bs,solid) var(--b-bd);box-shadow:var(--b-sh);
  scale:calc(1 + var(--beat,0)*.12);transition:scale .08s linear}
.bgm-disc svg{width:22px;height:22px;fill:currentColor}
.bgm-disc .bgm-ring{position:absolute;inset:-6px;border-radius:50%;border:2px solid var(--b-ac);opacity:calc(var(--beat,0)*.9);scale:calc(1 + var(--beat,0)*.25);pointer-events:none}
.bgm[data-play="1"] .bgm-disc{color:var(--b-ac)}
.bgm[data-play="1"] .bgm-disc svg{animation:bgm-spin 6s linear infinite}
.bgm[data-play="1"][data-an="0"] .bgm-eq i{animation:bgm-eq 0.9s ease-in-out infinite alternate}
.bgm-panel{position:absolute;right:0;inset-block-end:calc(100% + 10px);width:min(320px,calc(100vw - 28px));padding:14px;background:var(--b-bg);border:var(--b-bw,2px) var(--b-bs,solid) var(--b-bd);border-radius:var(--b-r);box-shadow:var(--b-sh);
  opacity:0;visibility:hidden;translate:0 8px;transition:opacity .18s,translate .18s,visibility .18s;max-height:min(70vh,520px);overflow:auto}
.bgm--inline .bgm-panel{right:auto;left:50%;translate:-50% 8px}
.bgm--inline[data-open="1"] .bgm-panel{translate:-50% 0}
.bgm[data-open="1"] .bgm-panel{opacity:1;visibility:visible;translate:0 0}
.bgm-now{display:flex;gap:10px;align-items:center;margin-bottom:10px}
.bgm-eq{display:flex;gap:3px;align-items:flex-end;height:26px;width:34px;flex:none}
.bgm-eq i{flex:1;background:var(--b-ac);height:20%;border-radius:1px;transform-origin:bottom}
.bgm-meta{min-width:0;flex:1}
.bgm-title{display:block;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;direction:ltr;text-align:start;unicode-bidi:isolate}
.bgm-artist{display:block;opacity:.7;font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;direction:ltr;unicode-bidi:isolate;text-align:start}
.bgm-seek,.bgm-vol{-webkit-appearance:none;appearance:none;width:100%;height:18px;background:transparent;direction:ltr;margin:0}
.bgm-seek::-webkit-slider-runnable-track,.bgm-vol::-webkit-slider-runnable-track{height:4px;background:color-mix(in srgb,var(--b-fg) 22%,transparent);border-radius:4px}
.bgm-seek::-moz-range-track,.bgm-vol::-moz-range-track{height:4px;background:color-mix(in srgb,var(--b-fg) 22%,transparent);border-radius:4px}
.bgm-seek::-webkit-slider-thumb,.bgm-vol::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:14px;border-radius:50%;background:var(--b-ac);border:2px solid var(--b-bd);margin-top:-5px}
.bgm-seek::-moz-range-thumb,.bgm-vol::-moz-range-thumb{width:10px;height:10px;border-radius:50%;background:var(--b-ac);border:2px solid var(--b-bd)}
.bgm-time{display:flex;justify-content:space-between;direction:ltr;font-size:11px;opacity:.65;font-variant-numeric:tabular-nums}
.bgm-ctl{direction:ltr;display:flex;align-items:center;justify-content:center;gap:10px;margin:8px 0}
.bgm-ctl button{width:40px;height:40px;display:grid;place-items:center;border-radius:50%;border:var(--b-bw,2px) var(--b-bs,solid) var(--b-bd)}
.bgm-ctl button svg{width:18px;height:18px;fill:currentColor}
.bgm-ctl .bgm-big{width:48px;height:48px;background:var(--b-ac);color:var(--b-bg)}
.bgm-ctl button:active{scale:.94}
.bgm-vrow{display:flex;align-items:center;gap:8px;font-size:12px;opacity:.9}
.bgm-vrow svg{width:16px;height:16px;fill:currentColor;flex:none}
.bgm-list{margin:10px 0 0;padding:8px 0 0;border-top:1px dashed color-mix(in srgb,var(--b-fg) 30%,transparent);display:grid;gap:2px}
.bgm-list .bgm-it{margin:0;padding:0;border:0;background:none;display:block}
.bgm-list button{display:flex;gap:8px;align-items:center;width:100%;padding:6px 6px;border-radius:8px;text-align:start}
.bgm-list button:hover{background:color-mix(in srgb,var(--b-fg) 8%,transparent)}
.bgm-list .bgm-it[aria-current="true"] button{color:var(--b-ac);font-weight:900}
.bgm-list .bgm-n{opacity:.55;width:1.6em;flex:none;text-align:center}
.bgm-list .bgm-t{min-width:0;flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;direction:ltr;unicode-bidi:isolate;text-align:left}
.bgm-msg{margin-top:8px;font-size:12px;color:var(--b-ac);min-height:1.2em}
@keyframes bgm-spin{to{rotate:360deg}}
@keyframes bgm-eq{0%{height:15%}100%{height:100%}}
.bgm .bgm-eq i:nth-child(2){animation-delay:-.3s!important}.bgm .bgm-eq i:nth-child(3){animation-delay:-.6s!important}.bgm .bgm-eq i:nth-child(4){animation-delay:-.15s!important}.bgm .bgm-eq i:nth-child(5){animation-delay:-.45s!important}
@media(prefers-reduced-motion:reduce){.bgm-disc,.bgm-panel{transition:none}.bgm[data-play="1"] .bgm-disc svg,.bgm .bgm-eq i{animation:none!important}}

.bgm--paper{--b-bg:#fbf3e2;--b-fg:#3a2a18;--b-ac:#c2542d;--b-bd:#c2542d;--b-bs:dashed;--b-bw:2px;--b-r:6px;--b-sh:4px 4px 0 rgba(60,40,15,.28)}
.bgm--paper .bgm-disc{border-radius:50%;rotate:-6deg}
.bgm--paper .bgm-panel{rotate:-.8deg;clip-path:polygon(0 0,100% 0,100% calc(100% - 8px),96% 100%,0 100%)}
.bgm--paper .bgm-ctl .bgm-big{background:#2f5d50;color:#fbf3e2;border-color:#2f5d50}
.bgm--paper .bgm-panel::before{content:"";position:absolute;top:-9px;inset-inline-start:24px;width:64px;height:18px;background:rgba(240,200,110,.7);rotate:-3deg}
.bgm--geo{--b-bg:#fffdf7;--b-fg:#121212;--b-ac:#D93636;--b-bd:#121212;--b-bw:3px;--b-r:0;--b-sh:5px 5px 0 #121212}
.bgm--geo .bgm-disc{border-radius:0;background:#F5C518}
.bgm--geo .bgm-disc .bgm-ring{border-radius:0;border-color:#2677C9}
.bgm--geo .bgm-ctl button{border-radius:0}
.bgm--geo .bgm-ctl .bgm-big{background:#2677C9;color:#fff}
.bgm--geo[data-play="1"] .bgm-disc{color:#121212}
.bgm--geo .bgm-eq i{background:linear-gradient(#D93636,#D93636)}
.bgm--geo .bgm-eq i:nth-child(2n){background:#2677C9}.bgm--geo .bgm-eq i:nth-child(3n){background:#27834A}
.bgm--neon{--b-bg:rgba(6,8,19,.92);--b-fg:#e2faff;--b-ac:var(--ac,#3aa0ff);--b-bd:var(--ac,#3aa0ff);--b-bw:1px;--b-r:2px;--b-font:'Courier New',ui-monospace,monospace;--b-sh:0 0 18px color-mix(in srgb,var(--ac,#3aa0ff) 55%,transparent),inset 0 0 12px color-mix(in srgb,var(--ac,#3aa0ff) 18%,transparent)}
.bgm--neon .bgm-disc{border-radius:4px;clip-path:polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,10px 100%,0 calc(100% - 10px))}
.bgm--neon .bgm-disc .bgm-ring{border-radius:4px}
.bgm--neon .bgm-panel{backdrop-filter:blur(8px);text-transform:none}
.bgm--neon .bgm-ctl button{border-radius:2px}
.bgm--neon .bgm-ctl .bgm-big{color:#060813}
.bgm--neon .bgm-title::before{content:"> ";color:var(--b-ac)}
.bgm--neon .bgm-eq i{box-shadow:0 0 6px var(--b-ac)}
.bgm--index{--b-bg:var(--bg,#d9c8a0);--b-fg:var(--fg,#2a2118);--b-ac:var(--fg,#2a2118);--b-bd:var(--fg,#2a2118);--b-bw:1.5px;--b-r:22px;--b-sh:0 6px 18px rgba(0,0,0,.18)}
.bgm--index .bgm-ctl .bgm-big{color:var(--b-bg)}
.bgm--index .bgm-disc{transition:scale .08s linear,background .7s,color .7s,border-color .7s}
`;

const I = {
  note: '<svg viewBox="0 0 24 24"><path d="M9 3v11.3A3.5 3.5 0 1 0 11 17.5V8h8V3z"/></svg>',
  play: '<svg viewBox="0 0 24 24"><path d="M7 4.5v15l13-7.5z"/></svg>',
  pause: '<svg viewBox="0 0 24 24"><path d="M6 4h4v16H6zM14 4h4v16h-4z"/></svg>',
  next: '<svg viewBox="0 0 24 24"><path d="M6 5v14l9-7zM16 5h2.5v14H16z"/></svg>',
  prev: '<svg viewBox="0 0 24 24"><path d="M18 5v14l-9-7zM5.5 5H8v14H5.5z"/></svg>',
  vol: '<svg viewBox="0 0 24 24"><path d="M4 9v6h4l5 4V5L8 9zM16 8.5a5 5 0 0 1 0 7l-1.4-1.4a3 3 0 0 0 0-4.2z"/></svg>'
};

let styled = false;
function injectCSS(extra) {
  if (!styled) { const s = document.createElement('style'); s.id = 'bgm-css'; s.textContent = CSS; document.head.appendChild(s); styled = true; }
  if (extra) { const s = document.createElement('style'); s.textContent = extra; document.head.appendChild(s); }
}

export function initBGM(opt) {
  const o = Object.assign({ page: 'x', skin: 'index', tracks: [], mount: null, volume: 0.4, beatTargets: [], onBeat: null, css: '', autostart: true }, opt);
  if (!o.tracks.length) return null;
  injectCSS(o.css);

  const KEY = 'bgm:' + o.page, GKEY = 'bgm:global';
  const st = Object.assign({ i: 0, t: 0, vol: o.volume, off: false }, rd(KEY, {}));
  st.i = Math.min(Math.max(0, st.i | 0), o.tracks.length - 1);
  const g = rd(GKEY, {}); if (typeof g.off === 'boolean') st.off = g.off;

  const audio = new Audio(); audio.preload = 'none'; audio.volume = st.vol; audio.setAttribute('playsinline', '');
  let idx = st.i, loaded = false, failCount = 0, userOpened = false;

    const root = document.createElement('div');
  root.className = `bgm bgm--${o.skin}` + (o.mount ? ' bgm--inline' : '');
  root.dataset.play = '0'; root.dataset.open = '0'; root.dataset.an = '0';
  root.innerHTML = `
    <div class="bgm-panel" id="bgm-panel-${o.page}" role="group" aria-label="پخش‌کننده موسیقی">
      <div class="bgm-now"><div class="bgm-eq" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>
        <div class="bgm-meta"><span class="bgm-title"></span><span class="bgm-artist"></span></div></div>
      <input class="bgm-seek" type="range" min="0" max="1000" value="0" aria-label="پیشرفت آهنگ">
      <div class="bgm-time"><span class="bgm-cur">0:00</span><span class="bgm-dur">0:00</span></div>
      <div class="bgm-ctl">
        <button type="button" data-a="prev" aria-label="آهنگ قبلی">${I.prev}</button>
        <button type="button" data-a="toggle" class="bgm-big" aria-label="پخش / توقف">${I.play}</button>
        <button type="button" data-a="next" aria-label="آهنگ بعدی">${I.next}</button>
      </div>
      <label class="bgm-vrow">${I.vol}<input class="bgm-vol" type="range" min="0" max="100" value="${Math.round(st.vol * 100)}" aria-label="صدا"></label>
      <div class="bgm-list" role="list"></div>
      <div class="bgm-msg" role="status" aria-live="polite"></div>
    </div>
    <button type="button" class="bgm-disc" aria-expanded="false" aria-controls="bgm-panel-${o.page}" aria-label="موسیقی">${I.note}<span class="bgm-ring" aria-hidden="true"></span></button>`;
  (o.mount || document.body).appendChild(root);

  const $ = s => root.querySelector(s);
  const disc = $('.bgm-disc'), seek = $('.bgm-seek'), vol = $('.bgm-vol'), tg = $('[data-a="toggle"]'), msg = $('.bgm-msg'), list = $('.bgm-list'), eqs = [...root.querySelectorAll('.bgm-eq i')];
  list.innerHTML = o.tracks.map((t, i) => `<div class="bgm-it" role="listitem"><button type="button" data-i="${i}"><span class="bgm-n">${fa(i + 1)}</span><span class="bgm-t">${(t.artist ? t.artist + ' — ' : '') + t.title}</span></button></div>`).join('');

    const setPlay = on => {
    root.dataset.play = on ? '1' : '0'; tg.innerHTML = on ? I.pause : I.play;
    disc.setAttribute('aria-label', on ? 'موسیقی (در حال پخش)' : 'موسیقی');
    if ('mediaSession' in navigator) navigator.mediaSession.playbackState = on ? 'playing' : 'paused';
    if (!on) { setBeat(0); eqs.forEach(e => e.style.height = ''); }
    on ? startViz() : stopViz();
  };
  const setMeta = () => {
    const t = o.tracks[idx];
    $('.bgm-title').textContent = t.title; $('.bgm-artist').textContent = t.artist || '';
    list.querySelectorAll('.bgm-it').forEach((li, i) => li.setAttribute('aria-current', i === idx));
    if ('mediaSession' in navigator) try { navigator.mediaSession.metadata = new MediaMetadata({ title: t.title, artist: t.artist || 'ساختمان داده‌ها' }); } catch {}
  };
  const say = s => { msg.textContent = s || ''; };
  const save = () => wr(KEY, { i: idx, t: audio.currentTime || 0, vol: audio.volume, off: st.off });

  let cands = [], ci = 0, blobTried = false;
  function candidates(t) {
    const out = [];
    [t.src, t.alt].filter(Boolean).forEach(p => {
      if (/^https?:|^blob:|^data:/.test(p)) { out.push(p); return; }
      const q = p.replace(/\u00a0/g, ' ');
      out.push(enc(p), p, enc(q), q);
    });
    return [...new Set(out)];
  }
  function setSrc() { audio.src = cands[ci]; loaded = true; }
  function load(i, play, resume) {
    idx = (i + o.tracks.length) % o.tracks.length; cands = candidates(o.tracks[idx]); ci = 0; blobTried = false; setMeta(); say('');
    setSrc();
    const r = resume ? st.t : 0;
    if (r > 1) audio.addEventListener('loadedmetadata', () => { try { audio.currentTime = Math.min(r, (audio.duration || r) - 1); } catch {} }, { once: true });
    if (play) return doPlay();
  }
  function doPlay() {
    if (!loaded) load(idx, false, false);
    st.off = false; wr(GKEY, { off: false });
    return audio.play().then(() => { failCount = 0; }).catch(e => { if (e && e.name === 'NotAllowedError') { setPlay(false); } });
  }
  function doPause(byUser) {
    audio.pause(); if (byUser) { st.off = true; wr(GKEY, { off: true }); } save();
  }
  const toggle = () => audio.paused ? doPlay() : doPause(true);

    audio.addEventListener('play', () => setPlay(true));
  audio.addEventListener('pause', () => setPlay(false));
  audio.addEventListener('ended', () => load(idx + 1, true));
  audio.addEventListener('timeupdate', () => {
    if (audio.duration) { if (!seek._d) seek.value = Math.round(audio.currentTime / audio.duration * 1000); }
    $('.bgm-cur').textContent = fmt(audio.currentTime); $('.bgm-dur').textContent = fmt(audio.duration);
  });
  audio.addEventListener('error', () => {
    const t = o.tracks[idx];
    if (ci < cands.length - 1) { ci++; setSrc(); audio.play().catch(() => {}); return; }
    const code = audio.error ? audio.error.code : '?';
    if (!blobTried && !audio.src.startsWith('blob:')) {
      blobTried = true; const my = idx;
      fetch(cands[0]).then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.blob(); })
        .then(b => { if (my !== idx) return; audio.src = URL.createObjectURL(b); return audio.play(); })
        .catch(() => { if (my === idx) audio.dispatchEvent(new Event('error')); });
      return;
    }
    console.warn('[bgm] پخش نشد:', cands, 'MediaError', code, audio.error && audio.error.message, '(4 = فایل نیست یا فرمت پشتیبانی نمی‌شود)');
    failCount++;
    const u = cands[0];
    fetch(u, { method: 'GET', headers: { Range: 'bytes=0-63' } }).then(r => r.arrayBuffer().then(b => {
      const head = new TextDecoder().decode(b.slice(0, 40)).replace(/[^\x20-\x7e]/g, '·');
      const info = `HTTP ${r.status} | ${r.headers.get('content-type')} | ${r.headers.get('content-length')} بایت | ابتدای فایل: ${head}`;
      console.warn('[bgm] تشخیص', u, info); if (failCount >= o.tracks.length) say(info);
    })).catch(err => console.warn('[bgm] fetch ناموفق', u, err));
    if (failCount >= o.tracks.length) { say('فایل‌ها پخش نشدند — جزئیات در کنسول (F12).'); setPlay(false); return; }
    say('این آهنگ پخش نشد؛ رفتم سراغ بعدی.'); load(idx + 1, true);
  });
  let lastSave = 0; audio.addEventListener('timeupdate', () => { const n = Date.now(); if (n - lastSave > 2000) { lastSave = n; save(); } });
  addEventListener('pagehide', save);

    const setOpen = v => { root.dataset.open = v ? '1' : '0'; disc.setAttribute('aria-expanded', v); };
  disc.addEventListener('click', e => { e.stopPropagation(); userOpened = true; setOpen(root.dataset.open !== '1'); });
  root.addEventListener('click', e => {
    const b = e.target.closest('button[data-a],button[data-i]'); if (!b) return;
    e.stopPropagation();
    if (b.dataset.a === 'toggle') toggle();
    else if (b.dataset.a === 'next') load(idx + 1, true);
    else if (b.dataset.a === 'prev') (audio.currentTime > 3 ? (audio.currentTime = 0) : load(idx - 1, true));
    else if (b.dataset.i != null) load(+b.dataset.i, true);
  });
  seek.addEventListener('input', () => { seek._d = true; if (audio.duration) $('.bgm-cur').textContent = fmt(seek.value / 1000 * audio.duration); });
  seek.addEventListener('change', () => { if (audio.duration) audio.currentTime = seek.value / 1000 * audio.duration; seek._d = false; });
  vol.addEventListener('input', () => { audio.volume = vol.value / 100; st.vol = audio.volume; save(); });
  document.addEventListener('pointerdown', e => { if (root.dataset.open === '1' && !root.contains(e.target)) setOpen(false); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && root.dataset.open === '1') { setOpen(false); disc.focus(); return; }
    if ((e.key === 'm' || e.key === 'M') && !e.ctrlKey && !e.metaKey && !e.altKey && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement && document.activeElement.tagName)) toggle();
  });
  if ('mediaSession' in navigator) {
    const ms = (a, f) => { try { navigator.mediaSession.setActionHandler(a, f); } catch {} };
    ms('play', doPlay); ms('pause', () => doPause(true)); ms('nexttrack', () => load(idx + 1, true)); ms('previoustrack', () => load(idx - 1, true));
  }

    const hadOff = st.off;
  setMeta();
  if (o.autostart && !hadOff) {
    const evs = ['touchend', 'click', 'keydown'];
    const disarm = () => evs.forEach(n => removeEventListener(n, go, true));
    const arm = () => evs.forEach(n => addEventListener(n, go, { capture: true, passive: true }));
    function go(e) {
      disarm();
      if (e && e.target && e.target.nodeType && root.contains(e.target)) return;
      Promise.resolve(load(idx, true, false)).then(() => { if (audio.paused && !st.off) arm(); });
    }
    arm();
  }

    let ctx, an, data, raf = 0, last = 0, avg = 0, bass = 0;
  const targets = () => o.beatTargets.flatMap(s => typeof s === 'string' ? [...document.querySelectorAll(s)] : [s]);
  let tcache = null;
  function setBeat(v) {
    v = Math.max(0, Math.min(1, v)); const s = v.toFixed(3);
    root.style.setProperty('--beat', s);
    if (!tcache) tcache = targets();
    tcache.forEach(el => el.style.setProperty('--beat', s));
    if (o.onBeat) o.onBeat(v);
  }
  function build() {
    try {
      const src = ctx.createMediaElementSource(audio);
      an = ctx.createAnalyser(); an.fftSize = 256; an.smoothingTimeConstant = 0.6;
      src.connect(an); an.connect(ctx.destination); data = new Uint8Array(an.frequencyBinCount);
      root.dataset.an = '1'; return true;
    } catch { return false; }
  }
  let anPending = false;
  function ensureAnalyser(cb) {
    if (an) return cb();
    if (anPending || reduce || !/^https?:$/.test(location.protocol)) return;
    const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
    try { ctx = ctx || new AC(); } catch { return; }
    anPending = true;
    Promise.resolve(ctx.resume && ctx.resume()).catch(() => {}).then(() => {
      anPending = false;
      if (ctx.state === 'running' && !an && build()) cb();
    });
  }
  function frame(ts) {
    raf = requestAnimationFrame(frame);
    if (ts - last < 33) return; last = ts;
    if (!an) return;
    an.getByteFrequencyData(data);
    let b = 0; for (let i = 0; i < 6; i++) b += data[i]; b /= 6 * 255;
    avg = avg * 0.94 + b * 0.06;
    const hit = Math.max(0, (b - avg) * 4.2);
    bass = Math.max(hit, bass * 0.78);
    setBeat(bass);
    for (let i = 0; i < eqs.length; i++) { const v = data[2 + i * 6] / 255; eqs[i].style.height = (12 + v * 88).toFixed(0) + '%'; }
  }
  function startViz() {
    if (reduce || raf || document.hidden) return;
    ensureAnalyser(() => { if (!raf && !audio.paused && !document.hidden) raf = requestAnimationFrame(frame); });
  }
  function stopViz() { cancelAnimationFrame(raf); raf = 0; }
  document.addEventListener('visibilitychange', () => { if (document.hidden) stopViz(); else if (!audio.paused) startViz(); });

  setPlay(false);
  return { audio, play: doPlay, pause: () => doPause(true), next: () => load(idx + 1, true), open: () => setOpen(true), el: root };
}