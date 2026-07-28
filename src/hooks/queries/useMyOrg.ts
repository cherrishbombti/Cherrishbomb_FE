import { useQuery } from '@tanstack/react-query';
import { getMyOrg } from '../../apis/auth';
import { queryKeys } from './queryKeys';

// 로그인한 기관 정보 — 세션 중 변하지 않으므로 재요청하지 않는다.
export function useMyOrg() {
  return useQuery({
    queryKey: queryKeys.myOrg,
    queryFn: getMyOrg,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
  });
}
