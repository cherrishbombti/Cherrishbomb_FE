export type TargetStatus = 'SAFE' | 'WARNING' | 'EMERGENCY';

export interface Target {
  targetId: number;
  name: string;
  age: number;
  address: string;
  phone: string;
  status: TargetStatus;
  statusReason: string;        // 긴급/주의 사유 (안전이면 '정상')
  battery: number;             // 0~100
  isActive: boolean;           // 현재 활동 중 여부
  lastUpdatedAt: string;       // ISO 날짜 문자열
}

export interface TargetSummary {
  total: number;
  safe: number;
  warning: number;
  emergency: number;
}

export interface TargetsResponse {
  summary: TargetSummary;
  targets: Target[];
}

export interface AddTargetRequest {
  name: string;
  age: number;
  address: string;
  phone: string;
}
