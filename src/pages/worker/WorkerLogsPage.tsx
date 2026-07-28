import { useState } from 'react';
import { useTargets } from '../../hooks/queries/useTargets';
import { useTargetLogs } from '../../hooks/queries/useTargetLogs';
import LogTypeBadge, { getLogTypeConfig } from '../../components/domain/LogTypeBadge';
import StateMessage from '../../components/common/StateMessage';

const PAGE_SIZE = 20;

const SENSOR_LABEL: Record<string, string> = {
  radar: '레이더 센서',
  thermal: '열 감지 센서',
  vibrator: '진동 센서',
};

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '-';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function WorkerLogsPage() {
  const { data: targetsData } = useTargets();
  const members = targetsData?.members ?? [];

  const [targetId, setTargetId] = useState<number | null>(null);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [page, setPage] = useState(0);
  // 조회 버튼을 눌렀을 때만 반영되는 값
  const [applied, setApplied] = useState<{ from?: string; to?: string }>({});

  const selected = members.find((m) => m.id === targetId) ?? null;
  const invalidRange = !!from && !!to && from > to;

  const { data, isLoading, isError, isFetching } = useTargetLogs(targetId, {
    page,
    size: PAGE_SIZE,
    ...(applied.from ? { from: applied.from } : {}),
    ...(applied.to ? { to: applied.to } : {}),
  });

  const handleSearch = () => {
    if (invalidRange) return;
    setPage(0);
    setApplied({ from: from || undefined, to: to || undefined });
  };

  const logs = data?.content ?? [];
  const showEmpty = !isLoading && !isError && targetId != null && logs.length === 0;

  return (
    <main className="px-4 sm:px-6 py-6 flex flex-col gap-5 max-w-screen-xl mx-auto">
      {/* 타이틀 */}
      <div className="flex items-baseline gap-2 flex-wrap">
        <h1 className="text-xl font-bold text-gray-800">낙상 이력 조회</h1>
        {selected && (
          <span className="text-sm text-gray-500">
            {selected.name} ({selected.age}세)
          </span>
        )}
      </div>

      {/* 조회 조건 */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1">
          <span className="text-xs text-gray-500">대상자</span>
          <select
            value={targetId ?? ''}
            onChange={(e) => {
              setTargetId(e.target.value ? Number(e.target.value) : null);
              setPage(0);
            }}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm min-w-44 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all"
          >
            <option value="">대상자를 선택하세요</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.age}세)
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-xs text-gray-500">시작일</span>
          <input
            type="date"
            value={from}
            max={to || undefined}
            onChange={(e) => setFrom(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all"
          />
        </label>

        <span className="pb-2.5 text-gray-400">~</span>

        <label className="flex flex-col gap-1">
          <span className="text-xs text-gray-500">종료일</span>
          <input
            type="date"
            value={to}
            min={from || undefined}
            onChange={(e) => setTo(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all"
          />
        </label>

        <button
          onClick={handleSearch}
          disabled={targetId == null || invalidRange}
          className="px-5 py-2 rounded-lg text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          조회
        </button>

        {invalidRange && (
          <span className="text-xs text-red-500 pb-2.5">시작일이 종료일보다 늦을 수 없습니다.</span>
        )}
      </div>

      {/* 결과 */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {targetId == null ? (
          <StateMessage
            iconBg="bg-indigo-50"
            icon={
              <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            }
            title="대상자를 선택해주세요"
            description="선택한 대상자의 낙상·센서 이벤트 기록을 확인할 수 있습니다."
          />
        ) : isLoading ? (
          <div className="p-5 flex flex-col gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        ) : isError ? (
          <StateMessage
            iconBg="bg-red-50"
            icon={
              <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
            }
            title="이력을 불러오지 못했습니다"
            description="네트워크 상태를 확인하고 다시 조회해주세요."
          />
        ) : showEmpty ? (
          <StateMessage
            iconBg="bg-gray-100"
            icon={
              <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
            title="해당 기간에 기록이 없습니다"
            description="조회 기간을 변경해보세요."
          />
        ) : (
          <>
            {/* 테이블 */}
            <div className={`overflow-x-auto transition-opacity ${isFetching ? 'opacity-60' : ''}`}>
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-xs">
                    <th className="text-left font-medium px-5 py-3">발생 시각</th>
                    <th className="text-left font-medium px-5 py-3">유형</th>
                    <th className="text-left font-medium px-5 py-3">상세</th>
                    <th className="text-right font-medium px-5 py-3">코드</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => {
                    const cfg = getLogTypeConfig(log.logType);
                    return (
                      <tr key={log.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3 text-gray-600 whitespace-nowrap">{formatDateTime(log.detectedAt)}</td>
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

            {/* 페이지네이션 */}
            {data && data.totalPages > 1 && (
              <div className="flex items-center justify-center gap-1 px-5 py-4 border-t border-gray-100">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  ‹ 이전
                </button>
                {Array.from({ length: data.totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i)}
                    className={`w-8 h-8 rounded text-sm transition-colors ${
                      i === page ? 'bg-indigo-500 text-white font-medium' : 'text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={data.last}
                  className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  다음 ›
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
