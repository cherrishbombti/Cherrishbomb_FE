import { axiosInstance } from './axiosInstance';
import type { NotificationPage } from '../types/notification';

// [GET] 소속 피보호자 알림 목록 (여러 대상이 시간순으로 섞여 있음)
export const getNotifications = async (page = 0, size = 20): Promise<NotificationPage> => {
  const { data } = await axiosInstance.get<NotificationPage>('/api/org/notifications', {
    params: { page, size },
  });
  return data;
};

// [PATCH] 개별 읽음 — 204 No Content
export const markNotificationRead = async (notificationId: number): Promise<void> => {
  await axiosInstance.patch(`/api/org/notifications/${notificationId}/read`);
};

// [PATCH] 전체 읽음 — 204 No Content
export const markAllNotificationsRead = async (): Promise<void> => {
  await axiosInstance.patch('/api/org/notifications/read-all');
};
