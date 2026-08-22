interface Props {
  names: string[];
  onClose: () => void;
}

export default function DangerAlert({ names, onClose }: Props) {
  if (names.length === 0) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-[2px] px-4">
      {/* max-h로 화면 넘침 방지, 내부 스크롤 */}
      <div className="alert-in bg-white w-full max-w-sm rounded-2xl shadow-xl ring-1 ring-black/5 flex flex-col max-h-[85vh]">
        {/* 헤더 — 고정 */}
        <div className="px-6 pt-7 pb-5 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
              <svg
                className="w-5 h-5 text-red-400"
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
            </div>
            <div>
              <p className="text-xs font-semibold text-red-400 uppercase tracking-widest">위급 상황</p>
              <h2 className="text-xl font-bold text-gray-900 mt-0.5 leading-snug">
                긴급 상태 전환 감지
                {names.length > 1 && (
                  <span className="ml-2 text-sm font-semibold text-white bg-red-400 rounded-full px-2 py-0.5">
                    {names.length}명
                  </span>
                )}
              </h2>
            </div>
          </div>
          <p className="text-sm text-gray-400 mt-3 leading-relaxed">즉각적인 현장 확인이 필요합니다</p>
        </div>

        {/* 이름 목록 — 스크롤 */}
        <div className="px-6 py-5 flex flex-col gap-3 overflow-y-auto flex-1">
          {names.map((name) => (
            <div
              key={name}
              className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-xl px-4 py-3.5 flex-shrink-0"
            >
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                <span className="text-red-400 font-bold text-base">{name[0]}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-bold text-gray-800 truncate">{name}</p>
                <p className="text-xs text-gray-400 mt-0.5">상태 변경됨</p>
              </div>
              <span className="flex items-center gap-1.5 text-xs font-semibold text-red-400 flex-shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                DANGER
              </span>
            </div>
          ))}
        </div>

        {/* 버튼 — 고정 */}
        <div className="px-6 pb-6 flex-shrink-0 border-t border-gray-100 pt-4">
          <button
            onClick={onClose}
            className="w-full py-3.5 rounded-xl bg-gray-900 hover:bg-gray-700 text-white font-bold text-base transition-colors"
          >
            확인했습니다 ({names.length}명)
          </button>
        </div>
      </div>
    </div>
  );
}
