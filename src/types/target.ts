// 1. 상태값: EMERGENCY -> DANGER 로 변경
export type TargetStatus = 'SAFE' | 'WARNING' | 'DANGER';

// 2. 개별 피보호자 정보 (백엔드의 members 배열 안의 객체)
export interface Target {
  id: number;                  // targetId -> id
  name: string;
  age: number;
  address: string;
  phone: string;             // phone(string) -> contact(number)로 변경됨!
  status: TargetStatus;
  radar: boolean;              // 새로 추가된 센서 정보
  thermal: boolean;            // 새로 추가된 센서 정보
  vibrator: boolean;           // 새로 추가된 센서 정보
  lastUpdated: string;         // lastUpdatedAt -> lastUpdated
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
  age: number;
  address: string;
  phone: string;             // phone -> contact
  //deviceMac: string;           // 백엔드에서 중복 검사하던 MAC 주소
}