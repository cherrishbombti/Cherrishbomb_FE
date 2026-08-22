import { useQuery, keepPreviousData, skipToken } from '@tanstack/react-query';
import { getTargetLogs } from '../../apis/targets';
import type { FallLogParams } from '../../types/target';
import { queryKeys } from './queryKeys';

/**
 * 낙상/센서 이력 조회.
 *
 * 대상이 선택되지 않았을 때는 queryFn 자리에 skipToken을 넘겨 조회를 건너뛴다.
 * enabled 플래그와 달리 타입 단언(targetId as number)이 필요 없어,
 * targetId가 null인 채로 API가 호출되는 경우를 타입 레벨에서 차단할 수 있다.
 *
 * 페이지 전환 시에는 keepPreviousData로 이전 데이터를 유지해 깜빡임을 방지한다.
 */
export function useTargetLogs(targetId: number | null, params: FallLogParams) {
  return useQuery({
    queryKey: queryKeys.targetLogs(targetId, params),
    queryFn: targetId == null ? skipToken : () => getTargetLogs(targetId, params), // 이 분기에서 targetId는 number로 좁혀짐
    placeholderData: keepPreviousData,
  });
}
