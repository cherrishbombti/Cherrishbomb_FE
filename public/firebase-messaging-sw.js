// 백그라운드(탭이 닫혀 있거나 비활성 상태)에서 푸시 알림을 수신하는 서비스 워커.
// 모듈 번들러를 거치지 않고 브라우저가 그대로 실행하므로 compat 빌드를 CDN에서 불러온다.
importScripts('https://www.gstatic.com/firebasejs/12.17.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.17.1/firebase-messaging-compat.js');

// 설정은 src/lib/firebase.ts가 등록 시 쿼리스트링으로 넘겨준다.
// (여기에 복붙해두면 한쪽만 바뀌었을 때 백그라운드 알림만 조용히 죽는다)
firebase.initializeApp(Object.fromEntries(new URL(self.location).searchParams));

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
          // navigate()는 이 워커가 통제하지 않는 탭에서 거부된다.
          // 포커스를 먼저 확실히 잡고, 이동이 실패하면 새 창으로 대체한다.
          return client
            .focus()
            .then((focused) => focused.navigate(url))
            .catch(() => clients.openWindow(url));
        }
      }
      return clients.openWindow(url);
    }),
  );
});
