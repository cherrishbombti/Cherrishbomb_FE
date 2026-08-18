import type { FallLog } from '../../types/target';
import { formatDateTime } from '../../utils/date';
import LogTypeBadge, { getLogTypeConfig } from './LogTypeBadge';

const SENSOR_LABEL: Record<string, string> = {
  radar: '레이더 센서',
  thermal: '열 감지 센서',
  vibrator: '진동 센서',
};

interface Props {
  logs: FallLog[];
  page: number;      // 페이지가 바뀔 때 등장 애니메이션 재실행용 key
  isFetching: boolean;
}

// 낙상·센서 이력 테이블
export default function LogTable({ logs, page, isFetching }: Props) {
  return (
    <div className={`overflow-x-auto transition-opacity duration-300 ease-out ${isFetching ? 'opacity-50' : 'opacity-100'}`}>
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 text-gray-500 text-xs">
            <th className="text-left font-medium px-5 py-3">발생 시각</th>
            <th className="text-left font-medium px-5 py-3">유형</th>
            <th className="text-left font-medium px-5 py-3">상세</th>
            <th className="text-right font-medium px-5 py-3">코드</th>
          </tr>
        </thead>
        <tbody key={page} className="row-stagger">
          {logs.map((log) => {
            const cfg = getLogTypeConfig(log.logType);
            return (
              <tr key={log.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3 text-gray-600 whitespace-nowrap tabular-nums">{formatDateTime(log.detectedAt)}</td>
                <td className="px-5 py-3">
                  <span className="flex items-center gap-2 font-medium text-gray-800 whitespace-nowrap">
                    <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                    {cfg.label}
                  </span>
                </td>
                <td className="px-5 py-3 text-gray-500">
                  {log.sensorDetail ? `${SENSOR_LABEL[log.sensorDetail] ?? log.sensorDetail} 이상` : '-'}
                </td>
                <td className="px-5 py-3 text-right">
                  <LogTypeBadge type={log.logType} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
