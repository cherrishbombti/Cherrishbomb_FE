import { axiosInstance } from './axiosInstance';

// [POST] FCM 토큰 등록 — 204 No Content
export const registerPushToken = async (token: string): Promise<void> => {
  await axiosInstance.post('/api/push/token', { token, platform: 'WEB' });
};

// [DELETE] FCM 토큰 삭제 — 204 No Content
export const unregisterPushToken = async (token: string): Promise<void> => {
  await axiosInstance.delete('/api/push/token', { params: { token } });
};
