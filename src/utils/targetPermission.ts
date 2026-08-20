import type { Target } from '../types/target';

/**
 * 이 기관이 대상을 직접 관리할 수 있는지(삭제·건강정보 수정 가능) 여부.
 *
 * manageable이 false인 대상은 보호자가 등록하고 기관번호로 연동만 된 경우로,
 * 삭제·수정을 호출하면 서버가 404 M001을 반환한다. 존재하지 않는 ID로 인한 404와
 * 구분할 수 없으므로 애초에 버튼을 노출하지 않는다.
 *
 * 백엔드 배포 전에는 응답에 manageable이 없으므로, 값이 없으면 기존 동작대로 관리 가능으로 본다.
 */
export function isManageable(target: Pick<Target, 'manageable'>): boolean {
  return target.manageable !== false;
}
