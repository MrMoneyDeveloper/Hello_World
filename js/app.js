import * as U from './utils.js';
import * as crypto from './widgets/crypto.js';
import * as fx from './widgets/fx.js';
import * as weather from './widgets/weather.js';
import * as apod from './widgets/apod.js';
import * as news from './widgets/news.js';
import * as aq from './widgets/aq.js';
import * as climate from './widgets/climate.js';
import * as about from './widgets/about.js';

const registry = { crypto, fx, weather, apod, news, aq, climate, about };

const renderError = (sec) => {
  const c = U.qs('.content', sec) || sec; c.innerHTML = `<div class="error">Failed to load.</div>`;
};

document.addEventListener('DOMContentLoaded', async () => {
  const app = { bus: U.bus, utils: U };
  const setUpdated = () => {
    try {
      const t = U.qs('#updatedTime');
      if (t && window.dayjs) t.textContent = window.dayjs().format('ddd, MMM D HH:mm');
    } catch {}
  };
  setUpdated();
  U.bus.on('updated', setUpdated);
  const loader = U.qs('#loader');
  const hideLoader = () => { if (loader) loader.classList.add('hidden'); };
  // Hide when first widget finishes or after 2.5s
  U.bus.on('updated', hideLoader);
  setTimeout(hideLoader, 2500);

  // Relates manager (max 4)
  const relatesEl = U.qs('#relates');
  const ensurePlaceholders = () => {
    if (!relatesEl) return;
    while (relatesEl.children.length < 4) relatesEl.append(U.el('span', { class: 'badge' }, '...loading'));
  };
  ensurePlaceholders();
  const setSlot = (i, text) => {
    if (!relatesEl) return;
    ensurePlaceholders();
    const child = relatesEl.children[i];
    if (child) child.textContent = text;
  };
  const updateGreeting = () => {
    const h = new Date().getHours();
    const label = h < 5 ? 'Good night' : h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
    setSlot(0, label);
  };
  updateGreeting();
  setInterval(updateGreeting, 60_000);

  U.geolocate().then(loc => {
    app.loc = loc;
    // Only show Durban hint if using fallback
    if (loc && (loc === U.DURBAN || loc.name === U.DURBAN.name)) setSlot(1, 'Near Durban');
  });
  U.bus.on('fx:rate', r => setSlot(2, `USD→ZAR: ${U.fmtNum(r, { maximumFractionDigits: 2 })}`));
  U.bus.on('weather:wind', w => setSlot(3, `Wind: ${U.fmtNum(w, { maximumFractionDigits: 0 })} km/h`));

  // Hydrate widgets with small concurrency to smooth network usage
  const sections = U.qsa('[data-widget]');
  const pool = 3; let idx = 0;
  const runOne = async () => {
    const sec = sections[idx++]; if (!sec) return;
    const name = sec.dataset.widget; const mod = registry[name];
    if (mod && typeof mod.render === 'function') {
      try { await mod.render(sec); sec.classList.add('hydrated'); sec.removeAttribute('aria-busy'); }
      catch (e) { renderError(sec); }
      finally { U.bus.emit('updated'); U.bus.emit('level:progress', { name, p: 1 }); }
    }
    await runOne();
  };
  for(let i=0;i<pool;i++) runOne();

  const t = U.qs('#themeToggle');
  if (t) t.addEventListener('click', () => {
    const root = document.documentElement;
    const cur = root.getAttribute('data-theme') || 'dark';
    const next = cur === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    t.textContent = next === 'dark' ? 'Dark' : 'Light';
    t.setAttribute('aria-pressed', next === 'light');
  });

  // 3D orbit nav: keyboard + pause on hover
  const ring = U.qs('#orbit');
  if (ring) {
    ring.addEventListener('keydown', (e)=>{
      const items = U.qsa('.orb', ring);
      const cur = document.activeElement;
      const i = Math.max(0, items.indexOf(cur));
      if (e.key === 'ArrowRight') { e.preventDefault(); (items[(i+1)%items.length]||items[0]).focus(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); (items[(i-1+items.length)%items.length]||items[0]).focus(); }
    });
  }

  // Levels hookup
  const setLevel = (name, p) => {
    const el = U.qs(`.levels .level[data-level="${name}"]`);
    if (el) { el.style.setProperty('--p', String(p)); el.setAttribute('aria-busy', p >= 1 ? 'false' : 'true'); }
  };
  // initialize all levels as busy 0
  U.qsa('.levels .level').forEach(l => { l.setAttribute('aria-busy','true'); l.style.setProperty('--p','0'); });
  U.bus.on('level:progress', ({ name, p }) => setLevel(name, p));

  // Parallax: ring tilt + starfield + hero tagline shift
  const star = U.qs('.starfield');
  const tag = U.qs('.overlay-contents .tagline');
  const onMove = (x, y) => {
    const nx = (x / window.innerWidth) - 0.5;
    const ny = (y / window.innerHeight) - 0.5;
    if (ring) { ring.style.setProperty('--tiltY', `${nx*8}deg`); ring.style.setProperty('--tiltX', `${-ny*8}deg`); }
    if (star) { star.style.setProperty('--sfX', `${nx*20}px`); star.style.setProperty('--sfY', `${ny*12}px`); }
  };
  window.addEventListener('mousemove', (e)=> onMove(e.clientX, e.clientY));
  const onScroll = () => { const y = Math.max(0, window.scrollY); if (tag) tag.style.setProperty('--parY', `${-Math.min(30, y*0.1)}px`); };
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // Sphere: place nodes around a sphere and allow drag to rotate
  const sphere = U.qs('#sphere');
  if (sphere) {
    const nodes = U.qsa('.node', sphere);
    const coords = [
      { lat:  15, lon:   0 }, // crypto
      { lat: -10, lon:  60 }, // fx
      { lat:  10, lon: 120 }, // weather
      { lat: -20, lon: 180 }, // apod
      { lat:   5, lon: -120 }, // news
      { lat: -15, lon:  -60 }, // aq
      { lat:  25, lon:   90 }, // climate
      { lat: -25, lon:  -90 }  // about
    ];
    nodes.forEach((n,i)=>{ const c = coords[i % coords.length]; n.style.transform = `rotateX(${c.lat}deg) rotateY(${c.lon}deg) translateZ(var(--r))`; });
    let rx = -12, ry = 0, dragging=false, lx=0, ly=0;
    const apply = ()=>{ sphere.style.setProperty('--rotX', rx+'deg'); sphere.style.setProperty('--rotY', ry+'deg'); };
    const onDown = (e)=>{ dragging=true; lx=e.clientX; ly=e.clientY; sphere.setPointerCapture?.(e.pointerId); };
    const onMove = (e)=>{ if(!dragging) return; const dx=e.clientX-lx, dy=e.clientY-ly; ry += dx*0.15; rx -= dy*0.15; rx=Math.max(-70,Math.min(70,rx)); lx=e.clientX; ly=e.clientY; apply(); };
    const onUp = (e)=>{ dragging=false; };
    sphere.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    apply();

    // Open overlay panel with widget content on click
    const panel = U.qs('#panel');
    const panelCard = panel && U.qs('.panel-card', panel);
    const closeBtn = panel && U.qs('.panel-close', panel);
    const open = async (name)=>{
      if(!panel || !panelCard) return;
      panel.classList.remove('hidden');
      if (sphere) sphere.classList.add('hidden');
      panelCard.setAttribute('aria-busy','true');
      const mod = registry[name];
      if (mod && typeof mod.render === 'function') {
        // Reset skeleton
        const h = U.qs('header h3', panelCard); if (h) h.textContent = name.toUpperCase();
        const c = U.qs('.content', panelCard); if (c) { c.innerHTML = `<div class="skeleton-line"></div><div class="skeleton-line short"></div>`; c.classList.add('skeleton'); }
        try { await mod.render(panelCard); panelCard.removeAttribute('aria-busy'); }
        catch { /* already skeletoned */ }
      }
    };
    const close = ()=> { if(panel) panel.classList.add('hidden'); if (sphere) sphere.classList.remove('hidden'); };
    if (closeBtn) closeBtn.addEventListener('click', close);
    window.addEventListener('keydown', (e)=>{ if(e.key==='Escape') close(); });
    nodes.forEach(n=> n.addEventListener('click', ()=> open(n.dataset.widget)));
  }
});
