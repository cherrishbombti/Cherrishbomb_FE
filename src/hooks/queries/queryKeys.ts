import type { FallLogParams } from '../../types/target';

// 쿼리 키 단일 정의 — 문자열 오타로 캐시가 갈라지는 것을 방지
export const queryKeys = {
  targets: ['targets'] as const,
  myOrg: ['org', 'me'] as const,
  targetHealth: (targetId: number | null) => ['targets', targetId, 'health'] as const,
  targetLogs: (targetId: number | null, params: FallLogParams) =>
    ['targets', targetId, 'logs', params] as const,
};
