import StateMessage from '../../components/common/StateMessage';

// AI 월간 케어 리포트 (구현 예정 — 이슈 #19)
export default function WorkerReportsPage() {
  return (
    <main className="px-4 sm:px-6 py-6 flex flex-col gap-5 max-w-screen-xl mx-auto">
      <div>
        <h1 className="text-xl font-bold text-gray-800">AI 월간 케어 리포트</h1>
        <p className="text-sm text-gray-500 mt-0.5">월별 활동 요약과 AI 분석 리포트</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <StateMessage
          iconBg="bg-indigo-50"
          icon={
            <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V9m4 8V5m4 12v-4M5 21h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          }
          title="준비 중인 기능입니다"
          description="다음 업데이트에서 월간 리포트를 확인할 수 있습니다."
        />
      </div>
    </main>
  );
}
