import type { LogType } from '../../types/target';
import { getLogTypeConfig } from '../../utils/logType';

export default function LogTypeBadge({ type }: { type: LogType }) {
  const cfg = getLogTypeConfig(type);
  return <span className={`px-2 py-0.5 rounded text-xs font-mono ${cfg.badge}`}>{type}</span>;
}
