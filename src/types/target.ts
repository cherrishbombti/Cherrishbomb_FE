// 1. 상태값: EMERGENCY -> DANGER 로 변경
export type TargetStatus = 'SAFE' | 'WARNING' | 'DANGER';

// 2. 개별 피보호자 정보 (백엔드의 members 배열 안의 객체)
export interface Target {
  id: number;                  // targetId -> id
  name: string;
  age: number;
  address: string;
  phone: string;             // 연락처 (문자열, 예: 010-1234-5678)
  status: TargetStatus;
  // 센서 정상 여부. 아직 수신 이력이 없으면 null (고장(false)과 구분)
  radar: boolean | null;
  thermal: boolean | null;
  vibrator: boolean | null;
  deviceOnline: boolean;       // 기기 연결 여부 (서버 계산값, 최근 5분 기준)
  deviceLastSeen: string | null; // 마지막 기기 신호 수신 시각. 수신 이력 없으면 null
  /**
   * 이 기관이 직접 등록해 관리 권한을 가진 대상인지 여부.
   * false면 보호자가 등록하고 기관번호로 연동만 된 대상이라 삭제·건강정보 수정이 불가하다(서버가 404 M001 반환).
   * 백엔드가 원시 타입 boolean으로 내려주므로 항상 존재하고 null이 될 수 없다.
   */
  manageable: boolean;
}

// 비상연락망 — 보호자가 앱에서 등록한 연락처. 기관이 직접 등록한 무연고자는 보통 빈 배열
export interface Contact {
  contactId: number;
  name: string;
  phone: string;
  relationship: string;
  priority: number;
}

/**
 * 피보호자 상세 (GET /api/targets/{id}) — 목록 항목에 비상연락망이 더해진 형태.
 * contacts는 서버가 항상 배열로 내려준다(연락처가 없으면 빈 배열). priority 오름차순 정렬.
 */
export interface TargetDetail extends Target {
  contacts: Contact[];
}

// 3. 요약 통계 (백엔드의 stats 객체)s
export interface TargetSummary {
  total: number;
  safe: number;
  warning: number;
  danger: number;              // emergency -> danger
}

// 4. 전체 API 응답 구조
export interface TargetsResponse {
  stats: TargetSummary;        // summary -> stats
  members: Target[];           // targets -> members
}

// 5. 대상 추가 요청 데이터 
// (이전 백엔드 코드를 보면 deviceMac이 필수로 들어갔었으므로 추가함)
export interface AddTargetRequest {
  name: string;
  age: number;          // Long
  address: string;
  contact: string;      // 전화번호. 숫자만 문자열로 전송 (예: '01012345678')
                        // number로 보내면 앞자리 0이 사라지므로 반드시 string
  deviceMac: string;    // 디바이스 MAC 주소 (예: AA:BB:CC:DD:EE:FF)
}
// ── 낙상 이력 ────────────────────────────────────────────────
export type LogType =
  | 'FALL_EVENT'      // 낙상 감지
  | 'SENSOR_FAILURE'  // 센서 이상 (sensorDetail에 대상 센서)
  | 'EMERGENCY_CALL'  // 119 신고 (백엔드 예정)
  | 'DEVICE_OFFLINE'  // 기기 연결 끊김 (백엔드 예정)
  | 'ACTIVE';         // 정상 활동 (백엔드 예정)

export interface FallLog {
  id: number;
  detectedAt: string;          // 발생 시각
  status: TargetStatus;
  logType: LogType;
  sensorDetail: string | null; // vibrator / radar / thermal
}

// 공통 페이지네이션 응답
export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface FallLogParams {
  page?: number;
  size?: number;
  from?: string; // YYYY-MM-DD
  to?: string;   // YYYY-MM-DD
}
