import { axiosInstance } from './axiosInstance';

// [POST] FCM 토큰 등록 — 204 No Content
export const registerPushToken = async (token: string): Promise<void> => {
  await axiosInstance.post('/api/push/token', { token, platform: 'WEB' });
};

// [DELETE] FCM 토큰 삭제 — 204 No Content
// 토큰을 쿼리스트링에 실으면 nginx·프록시 액세스 로그에 평문으로 남는다(HTTPS는 전송 구간만 보호).
// 요청 본문은 기본 로그 대상이 아니므로 body로 보낸다.
export const unregisterPushToken = async (token: string): Promise<void> => {
  await axiosInstance.delete('/api/push/token', { data: { token } });
};
