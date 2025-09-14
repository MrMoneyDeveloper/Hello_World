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
      finally { U.bus.emit('updated'); }
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
});
