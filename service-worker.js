const CACHE_NAME = 'resistor-calculator-cache-v1.3'; // Updated cache version
const urlsToCache = [
  "/resistor/index.html",
  "/resistor/3band.html",
  "/resistor/5band.html",
  "/resistor/icon-192x192.png",
  "/resistor/icon-512x512.png",
  "/resistor/resistor1.png",
  "/resistor/resistor2.png",
];

// Install event - cache the assets
self.addEventListener('install', (event) => {
  self.skipWaiting(); // Force the new service worker to take control immediately
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache');
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch event - always try to fetch the latest content first, fallback to cache if network fails
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Check if we received a valid response (status 200 and type 'basic')
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response; // If invalid, don't cache
        }

        // Clone and cache the response if it's valid
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        // Return cached index.html if network fails
        return caches.match(event.request).then((cachedResponse) => {
          return cachedResponse || caches.match('/resistor/index.html');
        });
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME]; // Keep the latest cache version
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName); // Delete outdated caches
          }
        })
      );
    })
  );
});
