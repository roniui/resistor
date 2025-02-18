const CACHE_NAME = 'resistor-hub-cache-v1.7'; // Cache version
const ASSETS = [
    '/resistor/index.html',       // 3/4 band page
    '/resistor/css/style3.css',    // styles
    '/resistor/css/style5.css',
    '/resistor/css/navbar.css',
    '/resistor/css/responsive.css',
    '/resistor/js/3-band.js',  // scripts
    '/resistor/js/5-band.js',
    '/resistor/icons/icon512x512.png',  // 512x512 icon
    '/resistor/icons/resbody1.png',  // resistor image
    '/resistor/icons/resbody2.png'
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
                
                // Clone response and add custom header
                return cachedResponse.blob().then((body) => {
                    let headers = new Headers({
                        'Content-Type': cachedResponse.headers.get('Content-Type') || 'text/html',
                        'X-Service-Worker': 'true' // Custom header to indicate service worker response
                    });

                    return new Response(body, {
                        status: cachedResponse.status,
                        statusText: cachedResponse.statusText,
                        headers: headers
                    });
                });
            }

            console.log('[Service Worker] Fetching from network:', event.request.url);
            return fetch(event.request).then((networkResponse) => {
                if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                    return networkResponse; // Return network response if invalid
                }

                return caches.open(CACHE_NAME).then((cache) => {
                    console.log('[Service Worker] Caching new resource:', event.request.url);
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                });
            }).catch((error) => {
                console.error('[Service Worker] Fetch failed:', error);
            });
        })
    );
});
