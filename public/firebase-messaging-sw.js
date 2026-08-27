// 백그라운드(탭이 닫혀 있거나 비활성 상태)에서 푸시 알림을 수신하는 서비스 워커.
// 모듈 번들러를 거치지 않고 브라우저가 그대로 실행하므로 compat 빌드를 CDN에서 불러온다.
importScripts('https://www.gstatic.com/firebasejs/12.17.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.17.1/firebase-messaging-compat.js');

// 설정은 src/lib/firebase.ts가 등록 시 쿼리스트링으로 넘겨준다.
//
// 다만 그 경로만 있는 것이 아니다. Firebase SDK는 deleteToken() 등에서
// 이 파일을 '기본 워커'로 — 쿼리스트링 없이, firebase-cloud-messaging-push-scope
// 라는 자체 scope 로 — 직접 등록한다. 그때 searchParams 가 비어
// initializeApp 이 던지면 스크립트 평가가 실패하고, 실패하면서 기존 활성
// 워커까지 사라진다. 이후 로그인의 getToken 은 'no active Service Worker' 로
// 죽어 토큰이 발급되지 않고, 서버에 등록된 토큰도 없으니 푸시가 조용히 멈춘다.
// (로그아웃 한 번으로 그 브라우저의 푸시가 영구히 죽는 증상이었다)
//
// 그래서 값을 여기에도 두고 폴백으로 쓴다. 공개 설정값이라 노출은 무방하다.
// src/lib/firebase.ts 의 firebaseConfig 와 같은 값을 유지해야 한다.
const FALLBACK_CONFIG = {
  apiKey: 'AIzaSyByT6BRp-57zdOe7gGabBwQNADOklKLgMs',
  authDomain: 'cherry-alarm.firebaseapp.com',
  projectId: 'cherry-alarm',
  storageBucket: 'cherry-alarm.firebasestorage.app',
  messagingSenderId: '958775262029',
  appId: '1:958775262029:web:c07f23004b442baa229504',
};

const params = Object.fromEntries(new URL(self.location).searchParams);
firebase.initializeApp(params.projectId ? params : FALLBACK_CONFIG);

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
