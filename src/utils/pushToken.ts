import { deleteToken, getToken as getFcmToken } from 'firebase/messaging';
import { getFcmMessaging } from '../lib/firebase';
import { registerPushToken, unregisterPushToken } from '../apis/push';

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;

/**
 * 로그인 직후 호출 — 알림 권한을 요청하고 FCM 토큰을 서버에 등록한다.
 * 권한 거부·미지원 브라우저·VAPID 키 미설정 등은 조용히 넘어간다 (로그인 흐름을 막지 않음).
 */
export async function registerPushNotifications(): Promise<void> {
  try {
    const messaging = await getFcmMessaging();
    if (!messaging || !VAPID_KEY) return;

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return;

    const token = await getFcmToken(messaging, { vapidKey: VAPID_KEY });
    if (token) await registerPushToken(token);
  } catch (err) {
    console.error('푸시 알림 등록 실패', err);
  }
}

/** 로그아웃 직전 호출 — 서버에 등록된 토큰을 삭제하고 로컬 토큰도 무효화한다 */
export async function unregisterPushNotifications(): Promise<void> {
  try {
    const messaging = await getFcmMessaging();
    if (!messaging || !VAPID_KEY) return;

    const token = await getFcmToken(messaging, { vapidKey: VAPID_KEY });
    if (!token) return;

    await unregisterPushToken(token);
    await deleteToken(messaging);
  } catch (err) {
    console.error('푸시 알림 해제 실패', err);
  }
}
