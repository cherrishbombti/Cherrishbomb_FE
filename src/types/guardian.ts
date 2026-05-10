export type SafetyStatus = 'SAFE' | 'WARNING' | 'EMERGENCY';

export interface WardSummary {
  wardName: string;        // 피보호자 이름
  relationship: string;   // 관계 (어머니, 아버지 등)
  phone: string;
  status: SafetyStatus;
  totalActivityMinutes: number;  // 오늘 총 활동 시간 (분)
  lastActivityMinutes: number;   // 마지막 활동으로부터 몇 분 전
  lastUpdatedAt: string;
}

export interface SensorData {
  sensorId: number;
  name: string;            // 낙상 감지 센서
  isConnected: boolean;
  battery: number;         // 0~100
  signalStrength: 'strong' | 'medium' | 'weak';
  lastUpdatedMinutes: number;  // N분 전
  location: string;        // 집 (침실)
}

export interface Contact {
  contactId: number;
  name: string;
  relationship: string;
  phone: string;
  priority: number;        // 1, 2, 3 ...
}

export interface AddContactRequest {
  name: string;
  relationship: string;
  phone: string;
}
