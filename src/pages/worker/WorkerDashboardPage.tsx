import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useTargets } from '../../hooks/queries/useTargets';
import { queryKeys } from '../../hooks/queries/queryKeys';
import type { Target } from '../../types/target';
import TargetCard from '../../components/domain/TargetCard';
import AddTargetModal from '../../components/domain/AddTargetModal';
import TargetDetailModal from '../../components/domain/TargetDetailModal';
import DangerAlert from '../../components/domain/DangerAlert';
import SkeletonCard from '../../components/domain/SkeletonCard';
import StateMessage from '../../components/common/StateMessage';
import { SECTIONS, STAT_CARDS } from './dashboardConfig';


export default function WorkerDashboardPage() {
  const queryClient = useQueryClient();
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedTarget, setSelectedTarget] = useState<Target | null>(null);
  const [dangerAlertNames, setDangerAlertNames] = useState<string[]>([]);
  const prevStatusMapRef = useRef<Record<number, string>>({});
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);

  // ✨ 제네릭을 명시해주면 타입 추론이 더 깔끔하게 됨
  const { data, isLoading, isError, isRefetching, refetch } = useTargets();


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

  // 알림함에서 넘어온 경우 해당 피보호자 상세를 자동으로 연다
  const focusTargetId = (location.state as { focusTargetId?: number } | null)?.focusTargetId;
  useEffect(() => {
    if (focusTargetId == null || !data?.members) return;
    const target = data.members.find((m) => m.id === focusTargetId);
    if (target) setSelectedTarget(target);
    // 새로고침·뒤로가기 시 다시 열리지 않도록 state 제거
    navigate(location.pathname, { replace: true });
  }, [focusTargetId, data, navigate, location.pathname]);

  const handleAddSuccess = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.targets });
  };

  const handleDeleteSuccess = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.targets });
  };

  // ✨ data.targets -> data.members 로 변경
  const byStatus = (status: Target['status']) =>
    data?.members.filter((m) => m.status === status) ?? [];

  // ✨ data.summary -> data.stats 로 변경
  const stats = data?.stats;
  // 폴링 중 일시적 실패로 기존 목록이 사라지지 않도록, 데이터가 없을 때만 전체 에러 화면
  const hasData = !!data;
  const showErrorScreen = isError && !hasData;
  const showStaleWarning = isError && hasData; // 데이터는 있지만 갱신 실패
  // 조회 성공했지만 등록된 가구가 하나도 없는 경우
  const isEmpty = !isLoading && !isError && (data?.members?.length ?? 0) === 0;

  return (
    <>
      <main className="px-4 sm:px-6 py-6 flex flex-col gap-6 max-w-screen-xl mx-auto">
        {/* ── 페이지 타이틀 ── */}
        <div>
          <h1 className="text-xl font-bold text-gray-800">통합 관제 대시보드</h1>
          <p className="text-sm text-gray-500 mt-0.5">전체 노인가구 현황 및 긴급 알림 핫라인</p>
        </div>

        {/* ── 상단 요약 카드 4개 ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STAT_CARDS.map(({ key, label, icon, card, valueColor, labelColor }) => {
            // ✨ stats 변수를 사용하도록 수정
            const value = stats?.[key];
            return (
              <div key={key} className={`rounded-xl border p-5 flex flex-col gap-3 shadow-sm ${card}`}>
                {icon}
                {isLoading ? (
                  <div className="h-8 w-12 bg-gray-100 rounded animate-pulse" />
                ) : (
                  <span className={`text-3xl font-bold tabular-nums ${valueColor}`}>{showErrorScreen ? '—' : (value ?? 0)}</span>
                )}
                <span className={`text-sm ${labelColor}`}>{label}</span>
              </div>
            );
          })}
        </div>

        {/* ── 모니터링 섹션 ── */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          {/* 섹션 헤더 */}
          <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800 text-base">전체 가구 모니터링</h2>
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

          {/* 갱신 실패 경고 — 기존 목록은 유지하고 최신이 아님만 알림 */}
          {showStaleWarning && (
            <div className="mx-5 mt-4 flex items-center gap-2 rounded-lg bg-yellow-50 border border-yellow-200 px-3 py-2">
              <svg className="w-4 h-4 text-yellow-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
              <span className="text-xs text-yellow-800">최신 정보를 불러오지 못했습니다. 아래 목록은 마지막으로 확인된 상태입니다.</span>
            </div>
          )}

          {/* 상태별 섹션 */}
          <div className="px-5 py-5 flex flex-col gap-8">
            {showErrorScreen && (
              <StateMessage
                iconBg="bg-red-50"
                icon={
                  <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  </svg>
                }
                title="데이터를 불러오지 못했습니다"
                description="네트워크 상태를 확인하고 다시 시도해주세요."
                action={
                  <button onClick={handleRefresh} disabled={isSpinning} className="mt-1 flex items-center gap-1.5 text-xs font-medium text-white bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded-lg transition-colors">
                    <svg className={`w-3.5 h-3.5 ${isSpinning || isRefetching ? 'animate-spin-reverse' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    다시 시도
                  </button>
                }
              />
            )}

            {!showErrorScreen && isLoading && (
              <>
                {[2, 2, 3].map((count, si) => (
                  <div key={si}>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-4 h-4 bg-gray-100 rounded animate-pulse" />
                      <div className="w-16 h-4 bg-gray-100 rounded animate-pulse" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                  </div>
                ))}
              </>
            )}

            {isEmpty && (
              <StateMessage
                iconBg="bg-indigo-50"
                icon={
                  <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                }
                title="아직 등록된 가구가 없습니다"
                description="모니터링할 노인가구를 추가해보세요."
                action={
                  <button onClick={() => setIsAddModalOpen(true)} className="mt-1 flex items-center gap-1.5 text-xs font-medium text-white bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded-lg transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    대상 추가
                  </button>
                }
              />
            )}

            {!showErrorScreen && !isLoading && !isEmpty && SECTIONS.map(({ status, label, icon, textColor, emptyMsg }) => {
              const members = byStatus(status);
              return (
                <section key={status}>
                  <div className="flex items-center gap-2 mb-4">
                    {icon}
                    <h3 className={`text-sm font-bold ${textColor}`}>
                      {label}
                      <span className="ml-1.5 font-normal text-gray-500">({members.length})</span>
                    </h3>
                  </div>
                  {members.length === 0 ? (
                    <p className="text-sm text-gray-500 py-2">{emptyMsg}</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
    </>
  );
}
