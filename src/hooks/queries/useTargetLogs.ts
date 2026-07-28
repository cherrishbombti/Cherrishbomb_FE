import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getTargetLogs } from '../../apis/targets';
import type { FallLogParams } from '../../types/target';
import { queryKeys } from './queryKeys';

// 낙상/센서 이력 — 페이지 전환 시 이전 데이터를 유지해 화면 깜빡임 방지
export function useTargetLogs(targetId: number | null, params: FallLogParams) {
  return useQuery({
    queryKey: queryKeys.targetLogs(targetId, params),
    queryFn: () => getTargetLogs(targetId as number, params),
    enabled: targetId != null, // 대상이 선택된 경우에만 조회
    placeholderData: keepPreviousData,
  });
}
