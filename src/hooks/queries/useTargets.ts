import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getTargets } from '../../apis/targets';
import type { TargetsResponse } from '../../types/target';
import { queryKeys } from './queryKeys';

// 관제 대상 목록 — 5초 폴링. 단, 탭이 백그라운드일 땐 갱신하지 않아 불필요한 트래픽을 막는다.
export function useTargets() {
  return useQuery<TargetsResponse>({
    queryKey: queryKeys.targets,
    queryFn: getTargets,
    refetchInterval: 1000 * 5,
    refetchIntervalInBackground: false,
  });
}

// 대상 추가/삭제 후 목록 갱신용
export function useInvalidateTargets() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: queryKeys.targets });
}
