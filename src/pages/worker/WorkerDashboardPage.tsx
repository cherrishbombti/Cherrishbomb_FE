import { useState, useRef, useEffect } from 'react';
import Logo from '../../components/common/Logo';
import { APP_NAME } from '../../constants/app';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getTargets } from '../../apis/targets'; // API 호출 함수 (경로 확인 필요)
import type { Target, TargetsResponse } from '../../types/target';
import TargetCard from '../../components/domain/TargetCard';
import AddTargetModal from '../../components/domain/AddTargetModal';
import TargetDetailModal from '../../components/domain/TargetDetailModal';
import DangerAlert from '../../components/domain/DangerAlert';

// ✨ 상태값을 백엔드 명세에 맞춰 EMERGENCY -> DANGER로 변경
const SECTIONS = [
  {
    status: 'DANGER' as const, 
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

// ✨ 상단 요약 카드 키값을 백엔드 stats 구조에 맞춰 emergency -> danger로 변경
const STAT_CARDS = [
  {
    key: 'total' as const,
    label: '전체 가구',
    card: 'bg-white border-gray-100',
    valueColor: 'text-gray-800',
    labelColor: 'text-gray-400',
    icon: (
      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
        <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </div>
    ),
  },
  {
    key: 'safe' as const,
    label: '안전',
    card: 'bg-green-50 border-green-200',
    valueColor: 'text-green-700',
    labelColor: 'text-green-700',
    icon: (
      <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
        <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    ),
  },
  {
    key: 'warning' as const,
    label: '주의',
    card: 'bg-yellow-50 border-yellow-200',
    valueColor: 'text-yellow-800',
    labelColor: 'text-yellow-700',
    icon: (
      <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center">
        <svg className="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        </svg>
      </div>
    ),
  },
  {
    key: 'danger' as const,
    label: '긴급',
    card: 'bg-red-50 border-red-200',
    valueColor: 'text-red-600',
    labelColor: 'text-red-700',
    icon: (
      <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
        <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        </svg>
      </div>
    ),
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
  const [selectedTarget, setSelectedTarget] = useState<Target | null>(null);
  const [dangerAlertNames, setDangerAlertNames] = useState<string[]>([]);
  const prevStatusMapRef = useRef<Record<number, string>>({});
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);

  // ✨ 제네릭을 명시해주면 타입 추론이 더 깔끔하게 됨
  const { data, isLoading, isRefetching, refetch } = useQuery<TargetsResponse>({
    queryKey: ['targets'],
    queryFn: getTargets,
    refetchInterval: 1000 * 5, // 5초마다 자동 갱신
  });

  // 새로고침: 응답이 빨라도 최소 0.6초는 아이콘이 돌도록
  const handleRefresh = () => {
    setIsSpinning(true);
    Promise.allSettled([refetch(), new Promise((r) => setTimeout(r, 600))]).then(() =>
      setIsSpinning(false)
    );
  };

  // DANGER 상태 변화 감지
  useEffect(() => {
    if (!data?.members) return;
    const prev = prevStatusMapRef.current;
    const newDangerNames: string[] = [];

    data.members.forEach((m) => {
      // 이전에 DANGER가 아니었다가 DANGER가 된 경우
      if (m.status === 'DANGER' && prev[m.id] !== 'DANGER') {
        // 최초 로드(prev 비어있을 때)는 알림 스킵
        if (Object.keys(prev).length > 0) {
          newDangerNames.push(m.name);
        }
      }
    });

    // 현재 상태를 prev로 저장
    prevStatusMapRef.current = Object.fromEntries(data.members.map((m) => [m.id, m.status]));

    if (newDangerNames.length > 0) {
      setDangerAlertNames(newDangerNames);
    }
  }, [data]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    queryClient.clear(); // 다른 계정 로그인 시 이전 캐시 남지 않도록
    navigate('/worker/login');
  };

  const handleAddSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['targets'] });
  };

  const handleDeleteSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['targets'] });
  };

  // ✨ data.targets -> data.members 로 변경
  const byStatus = (status: Target['status']) =>
    data?.members.filter((m) => m.status === status) ?? [];

  // ✨ data.summary -> data.stats 로 변경
  const stats = data?.stats;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <Logo size="sm" />
          <span className="font-bold text-gray-800 text-sm">{APP_NAME}</span>
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
          {STAT_CARDS.map(({ key, label, icon, card, valueColor, labelColor }) => {
            // ✨ stats 변수를 사용하도록 수정
            const value = stats?.[key];
            return (
              <div key={key} className={`rounded-xl border p-5 flex flex-col gap-3 shadow-sm ${card}`}>
                {icon}
                {isLoading ? (
                  <div className="h-8 w-12 bg-gray-100 rounded animate-pulse" />
                ) : (
                  <span className={`text-3xl font-bold ${valueColor}`}>{value ?? 0}</span>
                )}
                <span className={`text-sm ${labelColor}`}>{label}</span>
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
                onClick={handleRefresh}
                disabled={isSpinning}
                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 border border-gray-200 px-3 py-1.5 rounded-lg transition-colors"
              >
                <svg className={`w-3.5 h-3.5 ${isSpinning || isRefetching ? 'animate-spin-reverse' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
              const members = byStatus(status);
              return (
                <section key={status}>
                  <div className="flex items-center gap-2 mb-4">
                    {icon}
                    <h3 className={`text-sm font-bold ${textColor}`}>
                      {label}
                      <span className="ml-1.5 font-normal text-gray-400">({members.length})</span>
                    </h3>
                  </div>
                  {members.length === 0 ? (
                    <p className="text-sm text-gray-400 py-2">{emptyMsg}</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {members.map((member) => (
                        <TargetCard
                          // ✨ 백엔드 PK 이름인 id로 변경
                          key={member.id} 
                          target={member} 
                          onClick={(id) => setSelectedTarget(data?.members.find((m) => m.id === id) ?? null)}
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

      {/* 센서 상태 상세 모달 */}
      <TargetDetailModal
        key={selectedTarget?.id ?? 'none'}
        target={selectedTarget}
        onClose={() => setSelectedTarget(null)}
        onDelete={handleDeleteSuccess}
      />

      {/* 위급 알림 */}
      <DangerAlert
        names={dangerAlertNames}
        onClose={() => setDangerAlertNames([])}
      />

      <AddTargetModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleAddSuccess}
      />
    </div>
  );
}