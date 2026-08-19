import type { LogType } from '../types/target';

// logType별 표시 설정. EMERGENCY_CALL / DEVICE_OFFLINE / ACTIVE 는 백엔드 예정 항목
const LOG_TYPE_CONFIG: Record<LogType, { label: string; dot: string; badge: string }> = {
  FALL_EVENT:     { label: '낙상 감지',     dot: 'bg-red-500',    badge: 'bg-red-50 text-red-700' },
  SENSOR_FAILURE: { label: '센서 이상',     dot: 'bg-yellow-500', badge: 'bg-yellow-50 text-yellow-800' },
  EMERGENCY_CALL: { label: '119 신고',      dot: 'bg-red-600',    badge: 'bg-red-50 text-red-700' },
  DEVICE_OFFLINE: { label: '기기 연결 끊김', dot: 'bg-gray-400',   badge: 'bg-gray-100 text-gray-700' },
  ACTIVE:         { label: '정상 활동',     dot: 'bg-green-500',  badge: 'bg-green-50 text-green-700' },
};

const FALLBACK = { label: '기타', dot: 'bg-gray-400', badge: 'bg-gray-100 text-gray-700' };

/** 아직 정의되지 않은 타입이 와도 화면이 깨지지 않도록 FALLBACK을 둔다 */
export function getLogTypeConfig(type: LogType) {
  return LOG_TYPE_CONFIG[type] ?? FALLBACK;
}
