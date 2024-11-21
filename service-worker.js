const CACHE_NAME = "resistor-calculator-cache-v1.2";
const urlsToCache = [
  "./", // Main page
  "./index.html", // Your main site page
  "./install.js",
  "./5band.html", // Link to 5-band calculator
  "./3band.html", // Link to 3-band calculator
  "./manifest.json",
  "./icon-192x192.png",
  "./icon-512x512.png"
];

// Install Service Worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch and Cache Resources
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached response if found, or fetch from network
      return (
        response ||
        fetch(event.request)
          .then((networkResponse) => {
            // Cache the fetched resource for future use
            return caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            });
          })
          .catch(() => {
            // Fallback for offline or error scenarios
            if (event.request.mode === "navigate") {
              return caches.match("./index.html"); // Offline fallback
            }
          })
      );
    })
  );
});

// Activate Service Worker
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
