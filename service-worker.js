const CACHE_NAME = 'resistor-hub-cache-v3.1'; // Updated to v3 on 2024-12-01
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
      console.log('Opened cache and caching assets...');
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch event - try network, fallback to cache
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return; // Skip non-GET requests
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response; // Don't cache opaque or invalid responses
        }

        // Clone and cache the response if it's valid
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        // Fallback to cache
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          if (event.request.mode === 'navigate') {
            return caches.match('/resistor/index.html'); // Offline fallback
          }
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
            console.log(`Deleting old cache: ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
