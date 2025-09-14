export const NASA_KEY = 'DEMO_KEY';
export const DURBAN = { lat: -29.8587, lon: 31.0218, name: 'Durban area' };
export const qs = (s, sc = document) => sc.querySelector(s);
export const qsa = (s, sc = document) => [...sc.querySelectorAll(s)];
export const el = (t, a = {}, kids = []) => { const n = document.createElement(t); for (const k in a) { if (k === 'class') n.className = a[k]; else if (k === 'html') n.innerHTML = a[k]; else n.setAttribute(k, a[k]); } [].concat(kids).forEach(k => n.append(k)); return n; };
export const fmtNum = (n, opts = {}) => new Intl.NumberFormat(undefined, opts).format(n);
export const fmtUSD = n => fmtNum(n, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
export const fetchJSON = async (url, { timeout = 10000, headers = {} } = {}) => {
  const c = new AbortController(); const id = setTimeout(() => c.abort(), timeout);
  try {
    const r = await fetch(url, { headers, signal: c.signal });
    if (!r.ok) throw new Error(r.status + ' ' + r.statusText);
    return await r.json();
  } finally { clearTimeout(id); }
};
// shared helper: j(url, { timeoutMs })
export const j = (url, { timeoutMs } = {}) => fetchJSON(url, { timeout: timeoutMs ?? 10000 });
export const isDurbanFallback = (loc) => !!loc && (loc === DURBAN || (Math.abs(loc.lat - DURBAN.lat) < 1e-6 && Math.abs(loc.lon - DURBAN.lon) < 1e-6));
let GEO_PROM;
export const geolocate = () => GEO_PROM || (GEO_PROM = new Promise(res => {
  const usp = new URLSearchParams(location.search);
  if (usp.get('demo') === 'no-gps') return res(DURBAN);
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      p => res({ lat: p.coords.latitude, lon: p.coords.longitude }),
      () => res(DURBAN),
      { maximumAge: 6e5, timeout: 4e3 }
    );
  } else res(DURBAN);
}));

// small event bus shared across modules
export const bus = (() => { const m = {}; return { on: (t, f) => ((m[t] = m[t] || []).push(f)), emit: (t, d) => (m[t] || []).forEach(f => f(d)) }; })();

// common card renderer
export function renderCard(el, title, bodyHtml){
  const h = qs('header h3', el); if (h) h.textContent = title;
  const c = qs('.content', el) || el;
  c.classList.remove('skeleton');
  c.innerHTML = bodyHtml;
}
