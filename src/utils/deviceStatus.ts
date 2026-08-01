import type { Target } from '../types/target';

export type DeviceState = 'PENDING' | 'OFFLINE' | 'ONLINE';

/**
 * 기기 연결 상태 3분기.
 *
 * - PENDING: 기기 신호를 한 번도 받지 못함 (deviceLastSeen === null)
 * - OFFLINE: 신호 이력은 있으나 현재 끊김 (deviceOnline === false)
 * - ONLINE : 정상 연결
 */
export function getDeviceState(
  target: Pick<Target, 'deviceOnline' | 'deviceLastSeen'>
): DeviceState {
  if (target.deviceLastSeen == null) return 'PENDING';
  return target.deviceOnline ? 'ONLINE' : 'OFFLINE';
}

export const DEVICE_STATE_CONFIG: Record<
  DeviceState,
  { label: string; dot: string; text: string }
> = {
  ONLINE:  { label: '온라인',      dot: 'bg-green-500', text: 'text-green-600' },
  OFFLINE: { label: '오프라인',    dot: 'bg-gray-400',  text: 'text-gray-500' },
  PENDING: { label: '연결 대기 중', dot: 'bg-gray-300',  text: 'text-gray-400' },
};

/**
 * 기기가 연결돼 있지 않으면 status는 마지막 수신값이므로 현재 상태가 아니다.
 * (오프라인인데 SAFE로 보이는 오해를 막기 위해 사용)
 */
export function isStatusStale(state: DeviceState): boolean {
  return state !== 'ONLINE';
}
