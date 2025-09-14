// cached fetch with TTL and one retry
const sleep = (ms)=>new Promise(r=>setTimeout(r,ms));
function cacheKey(url){ return `cache:${url}`; }
export async function cachedJSON(url, { ttlMs = 8*60*1000, init = {}, retry = true } = {}) {
  const k = cacheKey(url);
  const now = Date.now();
  try {
    const raw = localStorage.getItem(k);
    if (raw) {
      const { t, d } = JSON.parse(raw);
      if (now - t < ttlMs) return d;
    }
  } catch {}
  try {
    const r = await fetch(url, init);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const d = await r.json();
    try { localStorage.setItem(k, JSON.stringify({ t: now, d })); } catch {}
    return d;
  } catch (e) {
    if (retry) { await sleep(400); return cachedJSON(url, { ttlMs, init, retry: false }); }
    // serve stale if present
    try {
      const { d } = JSON.parse(localStorage.getItem(k) || '{}');
      if (d) return d;
    } catch {}
    throw e;
  }
}

