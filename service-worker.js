const CACHE_NAME = "resistor-calculator-cache-v1.2.1";
const urlsToCache = [
  "./", // Main page
  "./index.html", // Main site page
  "./3band.html", // Link to 3-band calculator
  "./5band.html", // Link to 5-band calculator
  "./install.js", // Install button script
  "./manifest.json",
  "./icon-192x192.png", // App icon
  "./icon-512x512.png", // App icon
  "./resistor1.png",
  "./resistor2.png",
];

// Install Service Worker and Cache Resources
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch and Serve Cached Resources
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Serve cached file or fetch from network
      return response || fetch(event.request).catch(() => {
        // If offline and the file isn't cached, serve a fallback (like index.html)
        if (event.request.mode === "navigate") {
          return caches.match("./index.html");
        }
      });
    })
  );
});

// Activate Service Worker and Clean Up Old Caches
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
