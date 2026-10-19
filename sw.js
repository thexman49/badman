const CACHE = "badminton-queue-v21";
const SHELL = ["/badman/", "/badman/manifest.webmanifest", "/badman/favicon.svg", "/badman/badman-logo.jpg", "/badman/badman-icon-192.png", "/badman/badman-icon-512.png", "/badman/levels/lv1.webp", "/badman/levels/lv2.webp", "/badman/levels/lv3.webp", "/badman/levels/lv4.webp", "/badman/levels/lv5.webp", "/badman/levels/lv6.webp", "/badman/levels/lv7.webp", "/badman/levels/lv8.webp"];
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
  }).catch(() => caches.match(event.request).then((cached) => cached || caches.match("/badman/"))));
});
