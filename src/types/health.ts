// 피보호자 건강 정보 (민감정보 — 기저질환·복용약·병력)

/** 최종 수정 주체. 보호자(USER)와 기관(ORGANIZATION)이 서로 다른 테이블이라 타입으로 구분 */
export type UpdatedByType = 'USER' | 'ORGANIZATION';

/**
 * 건강 정보 조회 응답.
 * 아직 등록 전이어도 404가 아닌 200 + 빈 값이 오므로 모든 필드가 null일 수 있다.
 */
export interface HealthInfo {
  disease: string | null; // 기저질환
  medication: string | null; // 복용약
  memo: string | null; // 병력·메모
  updatedByName: string | null; // 최종 수정자 표시명 (BE: updated_by_name)
  updatedByType: UpdatedByType | null;
  updatedAt: string | null;
}

/**
 * 부분 수정(PATCH) 요청.
 * - 필드를 보내지 않거나 null → 수정하지 않음 (기존 값 유지)
 * - 빈 문자열("")        → 값 비우기
 */
export interface HealthInfoPatch {
  disease?: string | null;
  medication?: string | null;
  memo?: string | null;
}
