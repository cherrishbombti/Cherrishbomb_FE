import { useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from '../../apis/notifications';
import { queryKeys } from './queryKeys';
import { POLL_INTERVAL_MS } from '../../constants/polling';

const NOTIFICATION_POLL_MS = POLL_INTERVAL_MS;

/**
 * 알림 목록.
 * 대상 목록(useTargets)과 같은 5초 주기로 갱신한다.
 * 주기가 다르면 카드 색이 먼저 바뀌고 종 아이콘이 뒤늦게 반응해 사용자가 혼란스럽다.
 */
export function useNotifications(page = 0) {
  return useQuery({
    queryKey: queryKeys.notifications(page),
    queryFn: () => getNotifications(page),
    refetchInterval: NOTIFICATION_POLL_MS,
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
