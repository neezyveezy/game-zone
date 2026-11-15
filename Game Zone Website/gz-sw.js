/* Game Zone app: keeps the Game Zone page itself on the computer so the app opens fast, and still opens without internet.
   It always tries the internet first, so updates show up right away. Games load like normal.
   (After Hours has its own helper, after-hours-sw.js, which looks after that game's page and files.) */
const CACHE = 'gamezone-shell-v1';
const SHELL = ['./', './index.html', './gz-app.js', './site.webmanifest', './favicon.svg', './favicon-32.png', './favicon-48.png', './icon-192.png', './icon-512.png', './apple-touch-icon.png'];
const BASE = new URL('./', self.registration.scope).href;
const KEEP = new Set(SHELL.map((p) => new URL(p, BASE).href));

self.addEventListener('install', (e) => e.waitUntil((async () => {
  const c = await caches.open(CACHE);
  await Promise.all(SHELL.map((p) => fetch(new URL(p, BASE), { cache: 'reload' }).then((r) => r.ok && c.put(new URL(p, BASE).href, r)).catch(() => {})));
  self.skipWaiting();
})()));

self.addEventListener('activate', (e) => e.waitUntil((async () => {
  for (const k of await caches.keys()) if (k.startsWith('gamezone-shell-') && k !== CACHE) await caches.delete(k);
  await self.clients.claim();
})()));

self.addEventListener('fetch', (e) => {
  const req = e.request; if (req.method !== 'GET') return;
  const url = new URL(req.url); url.search = ''; url.hash = '';
  if (!KEEP.has(url.href)) return;   // everything else (games, config, fonts…) goes straight to the internet
  e.respondWith((async () => {
    const c = await caches.open(CACHE);
    try {
      const res = await fetch(req);
      if (res.ok) c.put(url.href, res.clone());
      return res;
    } catch (err) {
      const hit = (await c.match(url.href)) || (url.href === BASE ? await c.match(new URL('./index.html', BASE).href) : null);
      return hit || Response.error();
    }
  })());
});
