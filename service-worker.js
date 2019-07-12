// Cache name
const CACHE_NAME = 'pwa-sample-caches-v1';
// Cache targets
const urlsToCache = [
  './index.html'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => {
        return response ? response : fetch(event.request);
      })
  );
});

self.addEventListener("push", function(event) {
  event.waitUntil(
    self.registration.pushManager.getSubscription()
    .then(function(subscription) {
      if (subscription) {
        return subscription.endpoint;
      } 
      throw new Error('User not subscribed');
    })
    .then(function(res) {
      return fetch('./notification.json');
    })
    .then(function(res) {
      if (res.status === 200) {
        return res.json();
      }
      throw new Error('notification api response error', res);
    })
    .then(function(res) {
      return self.registration.showNotification(res.title, {
        icon: './images/icon.png',
        body: res.body
      })
    })
  )
});
