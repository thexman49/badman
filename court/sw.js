const CACHE = "badminton-queue-v23";
const SHELL = ["/badman/court/", "/badman/court/manifest.webmanifest", "/badman/court/favicon.svg", "/badman/court/badman-logo.jpg", "/badman/court/badman-icon-192.png", "/badman/court/badman-icon-512.png", "/badman/court/levels/lv1.webp", "/badman/court/levels/lv2.webp", "/badman/court/levels/lv3.webp", "/badman/court/levels/lv4.webp", "/badman/court/levels/lv5.webp", "/badman/court/levels/lv6.webp", "/badman/court/levels/lv7.webp", "/badman/court/levels/lv8.webp"];
self.addEventListener("install", (event) => event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting())));
self.addEventListener("activate", (event) => event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))).then(() => self.clients.claim())));
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin || url.pathname.startsWith("/@") || url.pathname.startsWith("/node_modules/") || url.pathname.startsWith("/__debug")) return;
  event.respondWith(fetch(event.request).then((response) => {
    const copy = response.clone();
    caches.open(CACHE).then((cache) => cache.put(event.request, copy));
    return response;
  }).catch(() => caches.match(event.request).then((cached) => cached || caches.match("/badman/court/"))));
});
