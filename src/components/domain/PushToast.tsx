interface Props {
  title: string;
  body: string;
  /** 낙상·긴급 — 붉게 강조하고 화면 가장자리까지 펄스시킨다 */
  urgent: boolean;
  onClick: () => void;
  onClose: () => void;
}

/** 푸시 알림 토스트 — 표시만 담당한다. 수신·상태 관리는 PushToastListener */
export default function PushToast({ title, body, urgent, onClick, onClose }: Props) {
  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
  };

  return (
    <>
      {/* 화면 가장자리 강조 — 중앙 콘텐츠는 그대로 읽히도록 pointer-events를 막지 않는다 */}
      {urgent && <div aria-hidden="true" className="fixed inset-0 z-40 pointer-events-none screen-alert-overlay" />}

      <div
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') onClick();
        }}
        className={`fixed top-5 right-5 z-50 w-[34rem] max-w-[calc(100vw-2.5rem)] text-left rounded-2xl shadow-xl px-6 py-5 flex gap-4 items-start cursor-pointer ${
          urgent ? 'border-2 border-red-400 toast-urgent-blink' : 'bg-white border border-gray-200 modal-panel-in'
        }`}
      >
        <span
          className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
            urgent ? 'bg-red-100' : 'bg-yellow-50'
          }`}
        >
          <svg
            className={`${urgent ? 'w-7 h-7 text-red-600' : 'w-5 h-5 text-yellow-600'}`}
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
        </span>

        <span className="flex-1 min-w-0">
          <span className={`block font-bold ${urgent ? 'text-xl text-red-700' : 'text-sm text-gray-800'}`}>
            {title}
          </span>
          {body && (
            <span className={`block mt-1.5 ${urgent ? 'text-base text-red-700' : 'text-xs text-gray-500'}`}>
              {body}
            </span>
          )}
        </span>

        <button
          onClick={handleClose}
          aria-label="알림 닫기"
          className={`w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-full transition-colors ${
            urgent
              ? 'text-red-400 hover:bg-red-200/50 hover:text-red-600'
              : 'text-gray-400 hover:bg-black/5 hover:text-gray-600'
          }`}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </>
  );
}
