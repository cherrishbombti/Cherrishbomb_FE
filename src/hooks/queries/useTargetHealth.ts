import { useMutation, useQuery, useQueryClient, skipToken } from '@tanstack/react-query';
import { getTargetHealth, patchTargetHealth } from '../../apis/targets';
import type { HealthInfoPatch } from '../../types/health';
import { queryKeys } from './queryKeys';

/** 피보호자 건강 정보 조회 — 대상이 없으면 조회를 건너뛴다 */
export function useTargetHealth(targetId: number | null) {
  return useQuery({
    queryKey: queryKeys.targetHealth(targetId),
    queryFn: targetId == null ? skipToken : () => getTargetHealth(targetId),
    staleTime: 1000 * 60, // 자주 바뀌는 정보가 아니므로 1분 캐시
  });
}

/** 건강 정보 부분 수정 */
export function useUpdateTargetHealth(targetId: number | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: HealthInfoPatch) => patchTargetHealth(targetId as number, body),
    onSuccess: (data) => {
      // 응답으로 캐시를 갱신해 재조회 없이 최신 상태 반영
      queryClient.setQueryData(queryKeys.targetHealth(targetId), data);
    },
  });
}
