var cacheName = 'v1';
var cacheFiles = [
  './',
  './index.html',
  './css/base/style.css',
  './css/layout/style.css',
  './css/module/style.css',
  './css/state/style.css',
  './theme/animate.css',
  './theme/bootstrap.css',
  './theme/font-awesome.css',
  './theme/style.css',
  './accessibility.css',
  './bootstrap.css',
  './c3.css',
  './high-contrast.css',
  './interactive.css',
  './slick.css',
  './strip.css',
  './underline-links.css',
  './yellow-links.css',
  './js/modernizr.custom.js',
  './js/classie.js',
  './js/accessibility.js',
  './js/jquery_1.9.1/jquery.min.js',
  './js/jqueryui_1.12.1/jquery-ui.min.js',
  'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css',
  'https://fonts.googleapis.com/css?family=Crimson+Text:400,400i,600,600i,700,700i|Roboto+Condensed:300,300i,400,400i,700,700i|Roboto+Slab:100,300,400,700|Roboto:100,100i,300,300i,400,400i,500,500i,700,700i,900,900i&subset=cyrillic,cyrillic-ext,greek,greek-ext,latin-ext,vietnamese',
  'https://fonts.googleapis.com/css?family=Lato',
  'https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/smoothness/jquery-ui.css',
  'https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js'
];


self.addEventListener('install', function(event) {
    console.log('[ServiceWorker] Installed');
    event.waitUntil(
	    caches.open(cacheName).then(function(cache) {
			console.log('[ServiceWorker] Caching cacheFiles');
			return cache.addAll(cacheFiles);
	    })
	);
});

self.addEventListener('activate', function(event) {
  console.log('[ServiceWorker] Activated');
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(thisCacheName) {
          if (thisCacheName !== cacheName) {
            console.log('[ServiceWorker] Removing Cached Files from Cache - ', thisCacheName);
            return caches.delete(thisCacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', function(event) {
  console.log('[ServiceWorker] Fetch', event.request.url);
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }

        var fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          function(response) {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              console.log("[ServiceWorker] Found in Cache", event.request.url, response);
              return response;
            }

            var responseToCache = response.clone();

            caches.open(cacheName)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });
              console.log('[ServiceWorker] New Data Cached', event.request.url);

            return response;
          }
        );
      })
    );
});
