// 쿼리 키 단일 정의 — 문자열 오타로 캐시가 갈라지는 것을 방지
export const queryKeys = {
  targets: ['targets'] as const,
  myOrg: ['org', 'me'] as const,
};
