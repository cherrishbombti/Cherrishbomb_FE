import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getTargets } from '../../apis/targets';
import type { Target } from '../../types/target';
import TargetCard from '../../components/domain/TargetCard';
import AddTargetModal from '../../components/domain/AddTargetModal';

const SECTIONS = [
  {
    status: 'EMERGENCY' as const,
    label: '긴급',
    icon: (
      <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      </svg>
    ),
    textColor: 'text-red-500',
    emptyMsg: '현재 긴급 상태인 가구가 없습니다.',
  },
  {
    status: 'WARNING' as const,
    label: '주의',
    icon: (
      <svg className="w-4 h-4 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      </svg>
    ),
    textColor: 'text-yellow-600',
    emptyMsg: '현재 주의 상태인 가구가 없습니다.',
  },
  {
    status: 'SAFE' as const,
    label: '안전',
    icon: (
      <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    textColor: 'text-green-600',
    emptyMsg: '현재 안전 상태인 가구가 없습니다.',
  },
];

// 상단 요약 카드 설정
const STAT_CARDS = [
  {
    key: 'total' as const,
    label: '전체 가구',
    icon: (
      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
        <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </div>
    ),
    valueColor: 'text-gray-800',
  },
  {
    key: 'safe' as const,
    label: '안전',
    icon: (
      <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
        <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    ),
    valueColor: 'text-gray-800',
  },
  {
    key: 'warning' as const,
    label: '주의',
    icon: (
      <div className="w-10 h-10 rounded-xl bg-yellow-50 flex items-center justify-center">
        <svg className="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        </svg>
      </div>
    ),
    valueColor: 'text-gray-800',
  },
  {
    key: 'emergency' as const,
    label: '긴급',
    icon: (
      <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
        <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        </svg>
      </div>
    ),
    valueColor: 'text-gray-800',
  },
];

function SkeletonCard() {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 flex flex-col gap-3 animate-pulse">
      <div className="flex justify-between">
        <div className="h-5 w-28 bg-gray-100 rounded-full" />
        <div className="w-7 h-7 bg-gray-100 rounded-full" />
      </div>
      <div className="flex gap-3 items-center">
        <div className="w-11 h-11 bg-gray-100 rounded-full flex-shrink-0" />
        <div className="flex flex-col gap-1.5 flex-1">
          <div className="h-3.5 w-24 bg-gray-100 rounded" />
          <div className="h-2.5 w-36 bg-gray-100 rounded" />
        </div>
      </div>
      <div className="h-2.5 bg-gray-100 rounded w-full" />
    </div>
  );
}

export default function WorkerDashboardPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [_selectedTargetId, setSelectedTargetId] = useState<number | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { data, isLoading, isRefetching, refetch } = useQuery({
    queryKey: ['targets'],
    queryFn: getTargets,
    refetchInterval: 1000 * 30,
  });

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/worker/login');
  };

  const handleAddSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['targets'] });
  };

  const byStatus = (status: Target['status']) =>
    data?.targets.filter((t) => t.status === status) ?? [];

  const summary = data?.summary;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* 헤더 */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-500 flex items-center justify-center">
            <svg className="w-4 h-4 text-pink-300" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <span className="font-bold text-gray-800 text-sm">낙상감지 핫 라인시스템</span>
          <span className="text-xs text-gray-400">사회복지사 모드</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <span>박사회복지사 님</span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            로그아웃
          </button>
        </div>
      </header>

      <main className="px-6 py-6 flex flex-col gap-6 max-w-screen-xl mx-auto">

        {/* ── 페이지 타이틀 ── */}
        <div>
          <h1 className="text-xl font-bold text-gray-800">통합 관제 대시보드</h1>
          <p className="text-sm text-gray-400 mt-0.5">전체 노인가구 현황 및 긴급 알림 핫라인</p>
        </div>

        {/* ── 상단 요약 카드 4개 ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STAT_CARDS.map(({ key, label, icon, valueColor }) => {
            const value = key === 'total' ? summary?.total : summary?.[key];
            return (
              <div key={key} className="bg-white rounded-xl border border-gray-100 p-5 flex flex-col gap-3 shadow-sm">
                {icon}
                {isLoading ? (
                  <div className="h-8 w-12 bg-gray-100 rounded animate-pulse" />
                ) : (
                  <span className={`text-3xl font-bold ${valueColor}`}>{value ?? 0}</span>
                )}
                <span className="text-sm text-gray-400">{label}</span>
              </div>
            );
          })}
        </div>

        {/* ── 모니터링 섹션 ── */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          {/* 섹션 헤더 */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800 text-sm">전체 가구 모니터링</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => refetch()}
                disabled={isRefetching}
                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 border border-gray-200 px-3 py-1.5 rounded-lg transition-colors"
              >
                <svg className={`w-3.5 h-3.5 ${isRefetching ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                새로고침
              </button>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-1.5 text-xs font-medium text-white bg-indigo-500 hover:bg-indigo-600 px-3 py-1.5 rounded-lg transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                대상 추가
              </button>
            </div>
          </div>

          {/* 상태별 섹션 */}
          <div className="px-5 py-5 flex flex-col gap-8">
            {isLoading && (
              <>
                {[2, 2, 3].map((count, si) => (
                  <div key={si}>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-4 h-4 bg-gray-100 rounded animate-pulse" />
                      <div className="w-16 h-4 bg-gray-100 rounded animate-pulse" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                  </div>
                ))}
              </>
            )}

            {!isLoading && SECTIONS.map(({ status, label, icon, textColor, emptyMsg }) => {
              const targets = byStatus(status);
              return (
                <section key={status}>
                  <div className="flex items-center gap-2 mb-4">
                    {icon}
                    <h3 className={`text-sm font-bold ${textColor}`}>
                      {label}
                      <span className="ml-1.5 font-normal text-gray-400">({targets.length})</span>
                    </h3>
                  </div>
                  {targets.length === 0 ? (
                    <p className="text-sm text-gray-400 py-2">{emptyMsg}</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {targets.map((target) => (
                        <TargetCard
                          key={target.targetId}
                          target={target}
                          onClick={(id) => setSelectedTargetId(id)}
                        />
                      ))}
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        </div>

      </main>

      <AddTargetModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleAddSuccess}
      />
    </div>
  );
}
