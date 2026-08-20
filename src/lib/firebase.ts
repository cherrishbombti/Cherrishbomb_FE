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
