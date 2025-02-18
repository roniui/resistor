const CACHE_NAME = 'resistor-hub-cache-v1.8'; // Updated cache version
const MAX_CACHE_ITEMS = 50; // Limit for cache cleanup
const ASSETS = [
    '/resistor/index.html',
    '/resistor/offline.html', // Fallback offline page
    '/resistor/css/style3.css',
    '/resistor/css/style5.css',
    '/resistor/css/navbar.css',
    '/resistor/css/responsive.css',
    '/resistor/js/3-band.js',
    '/resistor/js/5-band.js',
    '/resistor/icons/icon512x512.png',
    '/resistor/icons/resbody1.png',
    '/resistor/icons/resbody2.png'
];

// Install event: Cache resources
self.addEventListener('install', (event) => {
    console.info('[Service Worker] Installing and caching assets');
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        }).catch((error) => {
            console.error('[Service Worker] Asset caching failed:', error);
        })
    );
    self.skipWaiting(); // Activate immediately
});

// Activate event: Cleanup old caches
self.addEventListener('activate', (event) => {
    console.info('[Service Worker] Activating and cleaning up old caches');
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        console.warn('[Service Worker] Removing old cache:', key);
                        return caches.delete(key);
                    }
                })
            );
        }).then(() => {
            console.info('[Service Worker] New version ready to handle fetches!');
            return self.clients.claim();
        })
    );
});

// Fetch event: Serve from cache, update in background
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.match(event.request).then((cachedResponse) => {
                if (cachedResponse) {
                    console.info('[Service Worker] Serving from cache:', event.request.url);
                    return new Response(cachedResponse.body, {
                        status: cachedResponse.status,
                        statusText: cachedResponse.statusText,
                        headers: { ...cachedResponse.headers, 'X-Service-Worker': 'true' }
                    });
                }

                let fetchPromise = fetch(event.request).then((networkResponse) => {
                    if (networkResponse && networkResponse.status === 200) {
                        cache.put(event.request, networkResponse.clone());
                        cleanUpCache(cache);
                    }
                    return networkResponse;
                }).catch(() => {
                    console.warn('[Service Worker] Network request failed:', event.request.url);
                    return caches.match('/resistor/offline.html'); // Show offline page if network fails
                });

                return fetchPromise;
            });
        })
    );
});

// Function to clean up old cache items
async function cleanUpCache(cache) {
    const keys = await cache.keys();
    if (keys.length > MAX_CACHE_ITEMS) {
        await cache.delete(keys[0]); // Remove the oldest item
        console.warn('[Service Worker] Cache cleanup performed');
    }
            }
