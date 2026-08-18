// 알림함 (사회복지사 웹 — 소속 피보호자 전체 알림)

/** 실제 생성되는 건 FALL / WARNING 뿐이며, 나머지는 백엔드 스케줄러 도입 후 생성 예정 */
export type NotificationType = 'FALL' | 'WARNING' | 'DEVICE_OFFLINE' | 'EMERGENCY';

export interface AppNotification {
  id: number;
  notificationType: NotificationType;
  memberId: number;
  memberName: string;
  logId: number | null;
  isRead: boolean;
  createdAt: string;
}

/** 목록 응답 — 페이지네이션 + 전체 미읽음 수 */
export interface NotificationPage {
  unreadCount: number;
  content: AppNotification[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}
