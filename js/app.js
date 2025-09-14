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

  U.qsa('[data-widget]').forEach(async sec => {
    const name = sec.dataset.widget; const mod = registry[name];
    if (mod && typeof mod.render === 'function') {
      try { await mod.render(sec); sec.classList.add('hydrated'); sec.removeAttribute('aria-busy'); }
      catch (e) { renderError(sec); }
      finally { U.bus.emit('updated'); U.bus.emit('level:progress', { name, p: 1 }); }
    }
  });

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
});
