// 토큰 저장/조회 — localStorage 키를 한 곳에서 관리
const TOKEN_KEY = 'accessToken';
const PUSH_TOKEN_KEY = 'fcmToken';

export const getToken = (): string | null => localStorage.getItem(TOKEN_KEY);
export const setToken = (token: string): void => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = (): void => localStorage.removeItem(TOKEN_KEY);

/**
 * 서버에 등록한 FCM 토큰.
 *
 * 해제 시점에 getToken()을 다시 호출하면 안 된다 — FCM 토큰은 주기적으로 교체되고
 * getToken()은 없으면 새로 발급하므로, 서버에 등록된 옛 토큰은 그대로 남고
 * 방금 만든 토큰만 지우게 된다(로그아웃 후에도 푸시가 계속 오는 원인).
 * 등록 시점의 값을 보관해두고 해제할 때 그 값을 쓴다.
 */
export const getPushToken = (): string | null => localStorage.getItem(PUSH_TOKEN_KEY);
export const setPushToken = (token: string): void => localStorage.setItem(PUSH_TOKEN_KEY, token);
export const clearPushToken = (): void => localStorage.removeItem(PUSH_TOKEN_KEY);
