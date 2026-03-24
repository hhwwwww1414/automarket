self.addEventListener('push', (event) => {
  if (!event.data) {
    return;
  }

  const payload = event.data.json();
  const title = payload.title || 'vin2win';
  const options = {
    body: payload.body || '',
    data: {
      href: payload.href || '/',
    },
    icon: '/icon-light-32x32.png',
    badge: '/icon-light-32x32.png',
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const href = event.notification.data?.href || '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      const existingClient = clients.find((client) => 'focus' in client);
      if (existingClient) {
        existingClient.navigate(href);
        return existingClient.focus();
      }

      return self.clients.openWindow(href);
    })
  );
});
