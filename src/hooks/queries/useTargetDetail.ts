import { useQuery, skipToken } from '@tanstack/react-query';
import { getTarget } from '../../apis/targets';
import { queryKeys } from './queryKeys';

/**
 * 피보호자 상세 조회 — 목록 응답에 없는 비상연락망(contacts)을 얻기 위해 사용한다.
 * 상태·기기 정보는 5초 폴링되는 목록 쪽 값을 그대로 쓰므로 여기서는 폴링하지 않는다.
 */
export function useTargetDetail(targetId: number | null) {
  return useQuery({
    queryKey: queryKeys.targetDetail(targetId),
    queryFn: targetId == null ? skipToken : () => getTarget(targetId),
    staleTime: 1000 * 60, // 연락처는 자주 바뀌지 않으므로 1분 캐시
  });
}
