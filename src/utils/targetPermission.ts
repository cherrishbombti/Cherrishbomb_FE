import type { Target } from '../types/target';

/**
 * 이 기관이 대상을 직접 관리할 수 있는지(삭제·건강정보 수정 가능) 여부.
 *
 * manageable이 false인 대상은 보호자가 등록하고 기관번호로 연동만 된 경우로,
 * 삭제·수정을 호출하면 서버가 404 M001을 반환한다. 존재하지 않는 ID로 인한 404와
 * 구분할 수 없으므로 애초에 버튼을 노출하지 않는다.
 *
 * 판정은 fail-closed다 — true일 때만 허용한다.
 * 값이 없을 때 허용으로 보면(fail-open) 조회 전용 대상에 삭제 버튼이 떠서
 * 사용자가 누르고 404를 받는다. 반대로 막아두면 버튼이 안 보일 뿐 오동작은 없다.
 * (백엔드는 원시 타입 boolean으로 내려주어 값이 빠지지 않지만, 기본값은 안전한 쪽에 둔다)
 */
export function isManageable(target: Pick<Target, 'manageable'>): boolean {
  return target.manageable === true;
}
