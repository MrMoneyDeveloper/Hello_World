const CACHE_NAME = 'world-pulse-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/app.js',
  '/js/utils.js',
  '/js/hero-init.js',
  '/js/config.js',
  '/js/fetcher.js',
  '/js/rates.js',
  '/js/weather.js',
  '/js/news.js',
  '/js/space.js',
  '/js/media.js',
  '/js/widgets/crypto.js',
  '/js/widgets/fx.js',
  '/js/widgets/weather.js',
  '/js/widgets/apod.js',
  '/js/widgets/news.js',
  '/js/widgets/aq.js',
  '/js/widgets/climate.js',
  '/js/widgets/about.js',
  '/assets/hero.jpg',
  '/assets/hero.mp4',
  '/assets/climate_poster.jpg',
  '/assets/climate_hero.mp4',
];

self.addEventListener('install', (e)=>{
  e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));
});

self.addEventListener('activate', (e)=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))));
});

self.addEventListener('fetch', (e)=>{
  const { request } = e;
  const url = new URL(request.url);
  // Only handle GET
  if (request.method !== 'GET') return;
  // Cache-first for same-origin assets; network-first for others
  if (url.origin === location.origin) {
    e.respondWith(caches.match(request).then(r=>r || fetch(request)));
  } else {
    e.respondWith(fetch(request).catch(()=>caches.match(request)));
  }
});

