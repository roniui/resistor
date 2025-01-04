const CACHE_NAME = 'resistor-hub-cache-v1.0'; // Cache version
const ASSETS = [
  '/resistor/index.html',       // 3/4 band page
  '/resistor/5-band.html',       // 5-band page
  '/resistor/css/style3.css',    // styles
  '/resistor/css/style5.css', 
  '/resistor/css/navbar.css',
  '/resistor/css/responsive.css',
  '/resistor/js/3-band.js',  // scripts
  '/resistor/js/5-band.js',
  '/resistor/icons/icon512x512.png',  // 512x512 icon
  '/resistor/icons/resbody.png'  // resistor image
];

// Install event: Cache resources
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Install event triggered');
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[Service Worker] Caching assets');
            return cache.addAll(ASSETS);
        }).catch((error) => {
            console.error('[Service Worker] Failed to cache assets:', error);
        })
    );
    self.skipWaiting(); // Force the new service worker to take control immediately
});

// Activate event: Clean up old caches
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activate event triggered');
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        console.log('[Service Worker] Removing old cache:', key);
                        return caches.delete(key);
                    }
                })
            );
        }).then(() => {
            console.log('[Service Worker] Claiming clients');
            return self.clients.claim(); // Ensure the new service worker controls all clients
        })
    );
});

// Fetch event: Serve resources from cache or fetch from network
self.addEventListener('fetch', (event) => {
    console.log('[Service Worker] Fetching:', event.request.url);
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                console.log('[Service Worker] Serving from cache:', event.request.url);
                return cachedResponse; // Return from cache
            }
            console.log('[Service Worker] Fetching from network:', event.request.url);
            return fetch(event.request).then((response) => {
                if (!response || response.status !== 200 || response.type !== 'basic') {
                    return response; // Return the network response if it's invalid or not basic
                }
                // Optionally cache the response for future use
                return caches.open(CACHE_NAME).then((cache) => {
                    console.log('[Service Worker] Caching new resource:', event.request.url);
                    cache.put(event.request, response.clone());
                    return response;
                });
            }).catch((error) => {
                console.error('[Service Worker] Fetch failed:', error);
            });
        })
    );
});
