/* My LBX service worker
   Bump VERSION whenever you change any app file, so phones download the new version. */
const VERSION = 'v1.0.1';
const CACHE = 'lbx-' + VERSION;

// Paths are relative to this file, so the app works in a GitHub Pages subfolder.
// All files sit in the same folder as index.html.
const CORE = [
  './',
  './index.html',
  './manifest.webmanifest'
];
const IMAGES = [
  './hero.png',
  './side.jpg',
  './promo.jpg',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png',
  './apple-touch-icon.png'
];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    // cache:'reload' skips the HTTP cache so a new version never stores stale files.
    // Core files are all-or-nothing: if one fails, install fails and the old version keeps working.
    await cache.addAll(CORE.map(url => new Request(url, { cache: 'reload' })));
    // Images are cached one by one, so a single missing image can't block offline support.
    await Promise.all(IMAGES.map(async url => {
      try {
        const res = await fetch(new Request(url, { cache: 'reload' }));
        if (res.ok) await cache.put(url, res);
        else console.warn('[sw] image not found:', url, res.status);
      } catch (e) { console.warn('[sw] image fetch failed:', url, e); }
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith('lbx-') && k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function cacheable(res) {
  // Only successful, same-origin responses. Never failed, opaque, or partial responses.
  return res && res.ok && res.status === 200 && res.type === 'basic';
}

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // never touch external requests

  // App launches / page loads: serve the cached app shell so it opens offline.
  if (req.mode === 'navigate') {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE);
      const hit = await cache.match(req, { ignoreSearch: true }) || await cache.match('./index.html');
      if (hit) return hit;
      try {
        const res = await fetch(req);
        if (cacheable(res)) cache.put(req, res.clone());
        return res;
      } catch (e) {
        return new Response('<!doctype html><meta name="viewport" content="width=device-width"><body style="background:#0c0e0b;color:#eceee6;font-family:system-ui;padding:40px 24px">My LBX is offline and hasn’t finished installing yet. Connect to the internet once and reopen.</body>',
          { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
      }
    })());
    return;
  }

  // Everything else: cache first, then network (and remember successful same-origin files).
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const hit = await cache.match(req, { ignoreSearch: true });
    if (hit) return hit;
    try {
      const res = await fetch(req);
      if (cacheable(res)) cache.put(req, res.clone());
      return res;
    } catch (e) {
      return new Response('', { status: 504, statusText: 'Offline' });
    }
  })());
});
