/* After Hours, the installed app: every file of the game is kept on the player's computer, so it starts
   instantly and plays offline (multiplayer still needs the internet). build.ps1 writes the file list below
   with a hash per file. When you upload a new build, the browser notices this file changed, downloads only
   the files whose hash changed, and the update is applied the next time the game is opened. */
const VERSION = '7.0-20261114131556';
const FILES = [["After Hours.html","0334f273012d"],["after-hours/crawler-model.wasm","373b12eea340"],["after-hours/crawler.wav","b6199a6b4be7"],["after-hours/end1.mp3","2b7ccf0e0807"],["after-hours/end2.mp3","ba4dada7c6a6"],["after-hours/end3.mp3","2b4118157314"],["after-hours/end4.mp3","20e11c1f6dad"],["after-hours/end5.mp3","26ec763650c1"],["after-hours/end6.mp3","ca90b2ea65e6"],["after-hours/ghost-model.wasm","3a62a6d6be2c"],["after-hours/ghostwhisper.mp3","e145315e9d13"],["after-hours/growl.mp3","94365fffa23b"],["after-hours/icon-192.png","0554c3fb2039"],["after-hours/icon-512.png","0883eea6a43c"],["after-hours/laugh.mp3","9b739148bc86"],["after-hours/manifest.webmanifest","ece1b693ff8c"],["after-hours/mannequin-model.wasm","5fe10b8fdce5"],["after-hours/mannequins.wav","43014c6636a0"],["after-hours/roar.mp3","0de30bfe0bfe"],["after-hours/spider-model.wasm","52a74e63818d"],["after-hours/whisper.mp3","8e68a2d2df0e"],["after-hours/worm-model.wasm","0b713e90b093"],["after-hours/worm.wav","ba2c34fe2c44"]];            // [path, hash] for everything in this folder
const LIBS = ["https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js","https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js","https://unpkg.com/peerjs@1.5.4/dist/peerjs.min.js"];              // the three.js / loader scripts from their CDNs
const CACHE = 'afterhours-files', RUNTIME = 'afterhours-runtime';
// the worker only looks after the game page (its scope is "After Hours.html"); files sit next to it and in after-hours/
const BASE = new URL('./', self.registration.scope).href, abs = p => new URL(p, BASE).href;
const keyOf = (path, hash) => abs(path) + '?v=' + hash;
const HASH = new Map(FILES.map(([p, h]) => [abs(p), h]));

async function tell(msg) { for (const c of await self.clients.matchAll({ includeUncontrolled: true, type: 'window' })) c.postMessage(msg); }

self.addEventListener('install', e => e.waitUntil((async () => {
  const cache = await caches.open(CACHE), have = new Set((await cache.keys()).map(r => r.url));
  const todo = FILES.filter(([p, h]) => !have.has(keyOf(p, h)));
  let done = 0, total = todo.length + LIBS.length;
  await tell({ type: 'ah-progress', done, total, version: VERSION });
  // a few at a time, so a slow connection still shows progress
  const queue = todo.slice();
  const worker = async () => { while (queue.length) { const [p, h] = queue.shift(); const res = await fetch(abs(p), { cache: 'reload' }); if (!res.ok) throw new Error('download failed: ' + p); await cache.put(keyOf(p, h), res); done++; tell({ type: 'ah-progress', done, total, version: VERSION }); } };
  await Promise.all([worker(), worker(), worker(), worker()]);
  const rt = await caches.open(RUNTIME);
  for (const u of LIBS) { if (!(await rt.match(u))) { const res = await fetch(u, { mode: 'cors' }); if (res.ok) await rt.put(u, res); } done++; tell({ type: 'ah-progress', done, total, version: VERSION }); }
  await tell({ type: 'ah-ready', version: VERSION });
})()));

self.addEventListener('activate', e => e.waitUntil((async () => {
  // throw away files that no build uses any more
  const cache = await caches.open(CACHE), keep = new Set(FILES.map(([p, h]) => keyOf(p, h)));
  for (const r of await cache.keys()) if (!keep.has(r.url)) await cache.delete(r);
  await self.clients.claim();
})()));

self.addEventListener('message', e => { if (e.data === 'ah-skip-waiting') self.skipWaiting(); });

self.addEventListener('fetch', e => {
  const req = e.request; if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin === self.location.origin) {
    // the game's own files: always the copy that belongs to this version
    const path = url.origin + url.pathname, h = HASH.get(path); if (!h) return;
    e.respondWith(caches.open(CACHE).then(c => c.match(path + '?v=' + h)).then(r => r || fetch(req)));
    return;
  }
  // scripts and fonts from CDNs: from the computer if we have them, otherwise download and keep them
  if (/^(cdnjs\.cloudflare\.com|cdn\.jsdelivr\.net|unpkg\.com|fonts\.googleapis\.com|fonts\.gstatic\.com)$/.test(url.hostname)) {
    e.respondWith(caches.open(RUNTIME).then(async c => { const hit = await c.match(req.url); if (hit) return hit; const res = await fetch(req); if (res.ok || res.type === 'opaque') c.put(req.url, res.clone()); return res; }));
  }
  // everything else (multiplayer signalling) goes straight to the network
});
