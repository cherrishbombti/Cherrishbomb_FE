// 백그라운드(탭이 닫혀 있거나 비활성 상태)에서 푸시 알림을 수신하는 서비스 워커.
// 모듈 번들러를 거치지 않고 브라우저가 그대로 실행하므로 compat 빌드를 CDN에서 불러온다.
importScripts('https://www.gstatic.com/firebasejs/12.17.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.17.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyByT6BRp-57zdOe7gGabBwQNADOklKLgMs',
  authDomain: 'cherry-alarm.firebaseapp.com',
  projectId: 'cherry-alarm',
  storageBucket: 'cherry-alarm.firebasestorage.app',
  messagingSenderId: '958775262029',
  appId: '1:958775262029:web:c07f23004b442baa229504',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const { title, body } = payload.notification || {};
  self.registration.showNotification(title || '새로운 알림', {
    body,
    icon: '/favicon.svg',
    data: payload.data,
  });
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const memberId = event.notification.data && event.notification.data.memberId;
  const url = memberId ? `/worker/dashboard?target=${memberId}` : '/worker/dashboard';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if ('focus' in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
