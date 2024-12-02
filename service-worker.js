const CACHE_NAME = 'resistor-hub-cache-v3.4'; // Cache version
const urlsToCache = [
  "/resistor/index.html",  // Ensure index.html is cached
  "/resistor/3band.html",  // 3-band page
  "/resistor/5band.html",  // 5-band page

  "/resistor/icon-192x192.png",  // 192x192 icon
  "/resistor/icon-512x512.png",  // 512x512 icon
  "/resistor/resistor1.png",     // Example image
  "/resistor/resistor2.png",     // Another image
];

// Install event - cache the assets
self.addEventListener('install', (event) => {
  self.skipWaiting(); // Force the new service worker to take control immediately
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache and caching assets...');
      return cache.addAll(urlsToCache); // Cache all URLs
    })
  );
});

// Fetch event - use network-first with fallback to cache for navigation
self.addEventListener('fetch', (event) => {
  // Handling navigation requests (pages like /index.html, /3band.html, etc.)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse; // Serve cached page if available
        }
        // If not cached, fetch the page from the network and fall back to index.html offline
        return fetch(event.request).catch(() => caches.match('/resistor/index.html')); // Offline fallback
      })
    );
    return;
  }

  // Default fetch logic for other resources (JS, CSS, images, etc.)
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response; // Don't cache invalid responses
        }

        const responseClone = response.clone(); // Clone response for caching
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone); // Cache valid responses
        });
        return response; // Return the network response
      })
      .catch(() => {
        // Fallback to cache when offline
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse; // Serve from cache if available
          }
          // If nothing found in cache, fallback to index.html (for navigation)
          if (event.request.mode === 'navigate') {
            return caches.match('/resistor/index.html');
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
            return caches.delete(cacheName); // Delete old caches
          }
        })
      );
    })
  );
});
