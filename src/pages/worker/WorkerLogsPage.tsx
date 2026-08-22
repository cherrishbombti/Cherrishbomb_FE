import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTargetsOnce } from '../../hooks/queries/useTargets';
import { useTargetLogs } from '../../hooks/queries/useTargetLogs';
import LogSearchForm from '../../components/domain/LogSearchForm';
import LogTable from '../../components/domain/LogTable';
import Pagination from '../../components/common/Pagination';
import StateMessage from '../../components/common/StateMessage';

const PAGE_SIZE = 20;

export default function WorkerLogsPage() {
  const {
    data: targetsData,
    isLoading: loadingMembers,
    isError: membersError,
    refetch: refetchMembers,
  } = useTargetsOnce();
  const members = targetsData?.members ?? [];
  // 조회 성공했는데 등록된 가구가 0건인 경우 (실패와 구분)
  const noMembers = !loadingMembers && !membersError && members.length === 0;

  const [targetId, setTargetId] = useState<number | null>(null);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [page, setPage] = useState(0);
  // 조회 버튼을 눌렀을 때만 반영되는 기간 값
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
      <div>
        <div className="flex items-baseline gap-2 flex-wrap">
          <h1 className="text-xl font-bold text-gray-800">낙상 이력 조회</h1>
          {selected && (
            <span className="text-sm text-gray-500">
              {selected.name} ({selected.age}세)
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500 mt-0.5">대상자별 낙상·센서 이벤트 기록</p>
      </div>

      <LogSearchForm
        members={members}
        targetId={targetId}
        from={from}
        to={to}
        invalidRange={invalidRange}
        onTargetChange={(id) => {
          setTargetId(id);
          setPage(0);
        }}
        onFromChange={setFrom}
        onToChange={setTo}
        onSearch={handleSearch}
      />

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {membersError ? (
          <StateMessage
            iconBg="bg-red-50"
            icon={
              <svg
                className="w-6 h-6 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                />
              </svg>
            }
            title="대상자 목록을 불러오지 못했습니다"
            description="네트워크 상태를 확인하고 다시 시도해주세요."
            action={
              <button
                onClick={() => refetchMembers()}
                className="mt-1 text-xs font-medium text-white bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded-lg transition-colors"
              >
                다시 시도
              </button>
            }
          />
        ) : noMembers ? (
          <StateMessage
            iconBg="bg-indigo-50"
            icon={
              <svg
                className="w-6 h-6 text-indigo-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            }
            title="등록된 가구가 없습니다"
            description="모니터링 대상을 먼저 등록하면 이곳에서 이력을 확인할 수 있습니다."
            action={
              <Link
                to="/worker/dashboard"
                className="mt-1 inline-flex items-center gap-1.5 text-xs font-medium text-white bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded-lg transition-colors"
              >
                대상 등록하러 가기
              </Link>
            }
          />
        ) : targetId == null ? (
          <StateMessage
            iconBg="bg-indigo-50"
            icon={
              <svg
                className="w-6 h-6 text-indigo-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            }
            title="대상자를 선택해주세요"
            description="위에서 대상자를 선택하면 낙상·센서 이벤트 기록을 확인할 수 있습니다."
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
              <svg
                className="w-6 h-6 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                />
              </svg>
            }
            title="이력을 불러오지 못했습니다"
            description="네트워크 상태를 확인하고 다시 조회해주세요."
          />
        ) : showEmpty ? (
          <StateMessage
            iconBg="bg-gray-100"
            icon={
              <svg
                className="w-6 h-6 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            }
            title="해당 기간에 기록이 없습니다"
            description="조회 기간을 변경해보세요."
          />
        ) : (
          <>
            <LogTable logs={logs} page={page} isFetching={isFetching} />
            {data && <Pagination page={page} totalPages={data.totalPages} isLast={data.last} onChange={setPage} />}
          </>
        )}
      </div>
    </main>
  );
}
