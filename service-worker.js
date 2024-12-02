const CACHE_NAME = 'resistor-hub-cache-v3.5';
const ASSETS = [
  '/resistor/index.html',  // Ensure index.html is cached
  '/resistor/3band.html',  // 3-band page
  '/resistor/5band.html',  // 5-band page
  '/resistor/icon192x192.png',  // 192x192 icon
  '/resistor/icon512x512.png',  // 512x512 icon
  '/resistor/resistor1.png',     // images
  '/resistor/resistor2.png',
];

// Install event: Cache resources
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Caching assets');
            return cache.addAll(ASSETS);
        })
    );
});

// Activate event: Clean up old caches if needed
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        console.log('Removing old cache:', key);
                        return caches.delete(key);
                    }
                })
            );
        })
    );
});

// Fetch event: Serve resources from cache
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse; // Return from cache
            }
            // Optionally: Fetch from network and cache it for future use
            return fetch(event.request).then((response) => {
                return caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, response.clone());
                    return response;
                });
            });
        })
    );
});
