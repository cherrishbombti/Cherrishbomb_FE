import { DEVICE_STATE_CONFIG, type DeviceState } from '../../utils/deviceStatus';

interface Props {
  state: DeviceState;
  className?: string;
}

// 기기 연결 상태 표시 (온라인 / 오프라인 / 연결 대기 중)
export default function DeviceStateBadge({ state, className = '' }: Props) {
  const cfg = DEVICE_STATE_CONFIG[state];
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs ${cfg.text} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}
