var cacheName = 'v2';

var cacheFiles = [
  'index.html',
  'css/base/style.css',
  'css/layout/style.css',
  'css/module/style.css',
  'css/state/style.css',
  'theme/animate.css',
  'theme/bootstrap.css',
  'theme/font-awesome.css',
  'theme/style.css',
  'accessibility.css',
  'bootstrap.css',
  'c3.css',
  'high-contrast.css',
  'interactive.css',
  'slick.css',
  'strip.css',
  'underline-links.css',
  'yellow-links.css',
  'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css',
  'https://fonts.googleapis.com/css?family=Crimson+Text:400,400i,600,600i,700,700i|Roboto+Condensed:300,300i,400,400i,700,700i|Roboto+Slab:100,300,400,700|Roboto:100,100i,300,300i,400,400i,500,500i,700,700i,900,900i&subset=cyrillic,cyrillic-ext,greek,greek-ext,latin-ext,vietnamese',
  'https://fonts.googleapis.com/css?family=Lato',
  'https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/smoothness/jquery-ui.css',
  'https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js',
  'js/modernizr.custom.js',
  'js/classie.js',
  'js/accessibility.js',
  'js/jquery_1.9.1/jquery.min.js',
  'js/jqueryui_1.12.1/jquery-ui.min.js'

];


self.addEventListener('install', function(e) {
    console.log('[ServiceWorker] Installed');
    e.waitUntil(

	    caches.open(cacheName).then(function(cache) {
			console.log('[ServiceWorker] Caching cacheFiles');
			return cache.addAll(cacheFiles);
	    })
	);
});

self.addEventListener('activate', function(e) {
    console.log('[ServiceWorker] Activated');

    e.waitUntil(
		caches.keys().then(function(cacheNames) {
			return Promise.all(cacheNames.map(function(thisCacheName) {
				if (thisCacheName !== cacheName) {
					console.log('[ServiceWorker] Removing Cached Files from Cache - ', thisCacheName);
					return caches.delete(thisCacheName);
				}
			}));
		})
	);

});


self.addEventListener('fetch', function(e) {
	console.log('[ServiceWorker] Fetch', e.request.url);
	e.respondWith(
		caches.match(e.request)
			.then(function(response) {
				// If the request is in the cache
				if ( response ) {
					console.log("[ServiceWorker] Found in Cache", e.request.url, response);
					// Return the cached version
					return response;
				}
				// If the request is NOT in the cache, fetch and cache

				var requestClone = e.request.clone();
				fetch(requestClone)
					.then(function(response) {

						if ( !response ) {
							console.log("[ServiceWorker] No response from fetch ")
							return response;
						}

						var responseClone = response.clone();

						//  Open the cache
						caches.open(cacheName).then(function(cache) {

							// Put the fetched response in the cache
							cache.put(e.request, responseClone);
							console.log('[ServiceWorker] New Data Cached', e.request.url);

							// Return the response
							return response;

				        }); // end caches.open

					})
					.catch(function(err) {
						console.log('[ServiceWorker] Error Fetching & Caching New Data', err);
					});


			})
	);
});
