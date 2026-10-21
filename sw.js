// Network-first navigation: updates are fetched from the stable URL.
const CACHE = 'solevault-site-v1';
self.addEventListener('install', event => { self.skipWaiting(); });
self.addEventListener('activate', event => { event.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;
  if (event.request.mode !== 'navigate') return;
  event.respondWith((async () => {
    try {
      const response = await fetch(event.request, {cache:'no-store'});
      if (response.ok) { const cache = await caches.open(CACHE); cache.put('./index.html', response.clone()).catch(()=>{}); }
      return response;
    } catch(e) {
      const cache = await caches.open(CACHE);
      return (await cache.match('./index.html')) || Response.error();
    }
  })());
});
