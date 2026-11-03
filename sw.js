/* COPPA BEDDUZZI – sw.js – versione 2.8
 * Rende l'app installabile e la apre anche con rete scarsa.
 * Prende sempre prima la versione nuova dalla rete; i dati (Apps Script) non passano di qui. */
var CACHE = 'bedduzzi-2.8';
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches['delete'](k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  var u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== self.location.origin) return;
  var chiave = u.origin + u.pathname; // senza ?k=…: il codice personale non finisce in cache
  // cache: 'no-cache' = chiede sempre a GitHub se c'è una versione nuova (niente attese di 10 minuti)
  e.respondWith(fetch(e.request.url, { cache: 'no-cache', credentials: 'same-origin' }).then(function (r) {
    if (r && r.ok) { var c = r.clone(); caches.open(CACHE).then(function (ca) { ca.put(chiave, c); }); }
    return r;
  })['catch'](function () { return caches.match(chiave); }));
});
