import { useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from '../../apis/notifications';
import { queryKeys } from './queryKeys';

/** 알림 목록 — 헤더 뱃지에 쓰이므로 주기적으로 갱신 */
export function useNotifications(page = 0) {
  return useQuery({
    queryKey: queryKeys.notifications(page),
    queryFn: () => getNotifications(page),
    refetchInterval: 1000 * 30,
    refetchIntervalInBackground: false,
    placeholderData: keepPreviousData,
  });
}

/** 읽음 처리 — 204라 응답 본문이 없어 목록을 다시 조회한다 */
export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => markNotificationRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['org', 'notifications'] });
    },
  });
}

/** 전체 읽음 */
export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['org', 'notifications'] });
    },
  });
}
