const CACHE_NAME = 'nurz-weather-v1';

const ASSETS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/service-worker.js',
    '/fallback-weather.json',
    '/assets/icons/IconMob.svg',
    '/assets/icons/IconDesk.svg',
    '/assets/icons/theSun.svg',
    '/assets/icons/Wind.svg',
    '/assets/icons/humidityPercentage.svg',
    '/assets/icons/skyscraper.svg',
    '/assets/icons/cloudsNsun.svg',
    '/assets/icons/FoggyDay.svg',
    '/assets/icons/rainingClouds.svg',
    '/assets/icons/snowyClouds.svg',
    '/assets/icons/distancedClouds.svg',
    '/assets/icons/maincloud.svg',
    '/assets/icons/arrow.svg',
    '/assets/icons/sunnyDay.svg',
    '/assets/images/MagicalCastle.jpg',
    '/assets/images/Morning.jpg',
    '/assets/images/Noon.jpg',
    '/assets/images/Night.jpg',
    '/models/treescene.glb',
    '/textures/leaves2.jpg',
    '/textures/apple.jpg',
    '/textures/tree2.jpg',
    '/textures/terrain.jpg',
    '/textures/mud2.jpg',
    '/textures/mud.jpg',
    '/fonts/Inter/static/Inter_18pt-Regular.ttf',
    '/fonts/Inter/static/Inter_18pt-Bold.ttf',
    '/fonts/Poppins/Poppins-Regular.ttf',
    '/fonts/Poppins/Poppins-Bold.ttf',
    '/fonts/Roboto/static/Roboto-Regular.ttf',
    '/fonts/Roboto/static/Roboto-Bold.ttf',
];

// Install event: Cache all assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
    self.skipWaiting();
});

// Fetch event: Handle caching and API fallbacks
self.addEventListener('fetch', (event) => {
    const url = event.request.url;

    // Weather API fallback - intercept WeatherAPI requests
    if (url.includes("api.weatherapi.com")) {
        event.respondWith(
            fetch(event.request).catch(() =>
                caches.match("/fallback-weather.json")
            )
        );
        return;
    }

    // Static assets: Serve from cache first, then network
    event.respondWith(
        caches.match(event.request).then((cached) => {
            return cached || fetch(event.request).then((response) => {
                // Cache successful responses for static assets
                if (response.status === 200 && !url.includes('api.weatherapi.com')) {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
                }
                return response;
            });
        })
    );
});

// Activate event: Clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});
