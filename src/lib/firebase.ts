import { initializeApp } from 'firebase/app';
import { getMessaging, isSupported, type Messaging } from 'firebase/messaging';

// 공개 설정값 — API 키가 노출되어도 무방 (Firebase 프로젝트 식별용)
const firebaseConfig = {
  apiKey: 'AIzaSyByT6BRp-57zdOe7gGabBwQNADOklKLgMs',
  authDomain: 'cherry-alarm.firebaseapp.com',
  projectId: 'cherry-alarm',
  storageBucket: 'cherry-alarm.firebasestorage.app',
  messagingSenderId: '958775262029',
  appId: '1:958775262029:web:c07f23004b442baa229504',
};

const app = initializeApp(firebaseConfig);

let messagingPromise: Promise<Messaging | null> | null = null;

// 구형 Safari 등 FCM 미지원 브라우저가 있어 isSupported()로 확인 후 지연 초기화한다
export function getFcmMessaging(): Promise<Messaging | null> {
  if (!messagingPromise) {
    messagingPromise = isSupported().then((supported) => (supported ? getMessaging(app) : null));
  }
  return messagingPromise;
}

let swRegistrationPromise: Promise<ServiceWorkerRegistration> | null = null;

/**
 * 백그라운드 수신용 서비스 워커 등록.
 *
 * 서비스 워커는 번들러를 거치지 않는 순수 JS라 이 파일의 firebaseConfig를 import할 수 없다.
 * SDK 자동 등록에 맡기면 워커 쪽에 설정을 복붙해야 하고, 한쪽만 바꿨을 때
 * '포그라운드 알림만 오는' 식으로 원인 찾기 어려운 버그가 된다.
 * 직접 등록하면서 설정을 쿼리스트링으로 넘겨 정의를 이 파일 한 곳으로 유지한다.
 */
export function registerMessagingServiceWorker(): Promise<ServiceWorkerRegistration> {
  if (!swRegistrationPromise) {
    if (!('serviceWorker' in navigator)) {
      return Promise.reject(new Error('서비스 워커를 지원하지 않는 브라우저입니다.'));
    }
    const params = new URLSearchParams(firebaseConfig);
    swRegistrationPromise = navigator.serviceWorker.register(
      `/firebase-messaging-sw.js?${params.toString()}`
    );
  }
  return swRegistrationPromise;
}
