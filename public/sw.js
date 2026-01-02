self.addEventListener('install', () => {
  // Skip waiting to ensure the new service worker takes over immediately
  self.skipWaiting();
});

self.addEventListener('activate', () => {
  // Unregister all service workers and force reload
  self.registration.unregister()
    .then(() => {
      return self.clients.matchAll();
    })
    .then((clients) => {
      clients.forEach((client) => {
        // Optional: force reload the page to clear any cached assets
        // client.navigate(client.url);
      });
    });
});
