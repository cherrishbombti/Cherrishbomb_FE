import { deleteToken, getToken as getFcmToken } from 'firebase/messaging';
import { getFcmMessaging, registerMessagingServiceWorker } from '../lib/firebase';
import { registerPushToken, unregisterPushToken } from '../apis/push';
import { getPushToken, setPushToken, clearPushToken } from './token';

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;

/**
 * 로그인 직후 호출 — 알림 권한을 요청하고 FCM 토큰을 서버에 등록한다.
 * 권한 거부·미지원 브라우저·VAPID 키 미설정 등은 조용히 넘어간다 (로그인 흐름을 막지 않음).
 */
export async function registerPushNotifications(): Promise<void> {
  try {
    if (!('Notification' in window) || !VAPID_KEY) return;

    // 권한 요청을 가장 먼저 — Safari는 사용자 제스처 컨텍스트에서만 허용하는데
    // 앞에 await가 쌓일수록 컨텍스트가 끊겨 조용히 거부된다.
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return;

    const messaging = await getFcmMessaging();
    if (!messaging) return;

    const registration = await registerMessagingServiceWorker();
    const token = await getFcmToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration,
    });
    if (!token) return;

    await registerPushToken(token);
    // 해제할 때 이 값을 그대로 써야 서버에 등록된 토큰을 정확히 지울 수 있다
    setPushToken(token);
  } catch (err) {
    console.error('푸시 알림 등록 실패', err);
  }
}

/** 로그아웃 직전 호출 — 서버에 등록된 토큰을 삭제하고 로컬 토큰도 무효화한다 */
export async function unregisterPushNotifications(): Promise<void> {
  // 등록 시점에 저장해둔 값을 쓴다. getFcmToken()을 다시 부르면 새 토큰이 발급될 수 있어
  // 서버에는 옛 토큰이 남고 로그아웃 후에도 푸시가 계속 온다.
  const token = getPushToken();
  if (!token) return;

  try {
    await unregisterPushToken(token);
  } catch (err) {
    console.error('푸시 알림 해제 실패', err);
  } finally {
    // 서버 삭제가 실패해도 이 브라우저에서는 더 이상 수신하지 않도록 로컬은 정리한다
    clearPushToken();
    try {
      const messaging = await getFcmMessaging();
      if (messaging) await deleteToken(messaging);
    } catch (err) {
      console.error('FCM 토큰 무효화 실패', err);
    }
  }
}
