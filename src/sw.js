// sw.js
self.addEventListener("push", (event) => {
  const data = event.data?.json() || {
    title: "New Notification",
    body: "You have a new message!",
  };

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/icon.png",
      data, // we can use this when clicked
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow("/messages")); // open app
});
