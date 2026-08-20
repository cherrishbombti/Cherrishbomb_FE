import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { onMessage } from 'firebase/messaging';
import { getFcmMessaging } from '../../lib/firebase';

interface ToastData {
  title: string;
  body: string;
  memberId: number | null;
  urgent: boolean;
}

// 낙상·긴급은 놓치면 안 되므로 자동으로 닫지 않고 사용자가 직접 닫거나 클릭할 때까지 유지한다
const URGENT_TYPES = new Set(['FALL', 'EMERGENCY']);
const TOAST_DURATION_MS = 8000;

/**
 * 포그라운드(탭이 열려 있는 상태)에서 수신한 푸시 알림을 토스트로 보여준다.
 * 백그라운드 수신은 public/firebase-messaging-sw.js가 처리한다.
 */
export default function PushToastListener() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [toast, setToast] = useState<ToastData | null>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    getFcmMessaging().then((messaging) => {
      if (!messaging) return;
      unsubscribe = onMessage(messaging, (payload) => {
        // 알림함도 같은 사건을 다루므로 즉시 갱신해 종 아이콘과 토스트가 어긋나지 않게 한다
        queryClient.invalidateQueries({ queryKey: ['org', 'notifications'] });

        const memberId = payload.data?.memberId;
        setToast({
          title: payload.notification?.title ?? '새로운 알림',
          body: payload.notification?.body ?? '',
          memberId: memberId ? Number(memberId) : null,
          urgent: URGENT_TYPES.has(payload.data?.notificationType ?? ''),
        });
      });
    });

    return () => unsubscribe?.();
  }, [queryClient]);

  useEffect(() => {
    if (!toast || toast.urgent) return;
    const timer = setTimeout(() => setToast(null), TOAST_DURATION_MS);
    return () => clearTimeout(timer);
  }, [toast]);

  // 탭을 안 보고 있을 때도 놓치지 않도록, 위급 알림이 떠 있는 동안 탭 제목을 깜빡인다.
  // 탭으로 돌아오면(visible) 토스트가 이미 화면에 보이니 제목은 원래대로 되돌려 멈춘다.
  useEffect(() => {
    if (!toast?.urgent) return;

    const baseTitle = document.title;
    let showingAlert = false;
    const intervalId = window.setInterval(() => {
      showingAlert = !showingAlert;
      document.title = showingAlert ? `🚨 ${toast.title}` : baseTitle;
    }, 1000);

    const restore = () => {
      window.clearInterval(intervalId);
      document.title = baseTitle;
    };
    const onVisible = () => {
      if (document.visibilityState === 'visible') restore();
    };
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      document.removeEventListener('visibilitychange', onVisible);
      restore();
    };
  }, [toast]);

  if (!toast) return null;

  const handleClick = () => {
    setToast(null);
    if (toast.memberId) navigate(`/worker/dashboard?target=${toast.memberId}`);
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setToast(null);
  };

  return (
    <>
      {/* 화면 가장자리 강조 — 중앙 콘텐츠는 그대로 읽히도록 pointer-events를 막지 않는다 */}
      {toast.urgent && <div aria-hidden="true" className="fixed inset-0 z-40 pointer-events-none screen-alert-overlay" />}

      <div
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') handleClick();
        }}
        className={`fixed top-5 right-5 z-50 w-[34rem] max-w-[calc(100vw-2.5rem)] text-left rounded-2xl shadow-xl px-6 py-5 flex gap-4 items-start cursor-pointer ${
          toast.urgent
            ? 'border-2 border-red-400 toast-urgent-blink'
            : 'bg-white border border-gray-200 modal-panel-in'
        }`}
      >
        <span
          className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
            toast.urgent ? 'bg-red-100' : 'bg-yellow-50'
          }`}
        >
          <svg
            className={`${toast.urgent ? 'w-7 h-7' : 'w-5 h-5'} ${toast.urgent ? 'text-red-600' : 'text-yellow-600'}`}
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
          <span className={`block font-bold ${toast.urgent ? 'text-xl text-red-700' : 'text-sm text-gray-800'}`}>
            {toast.title}
          </span>
          {toast.body && (
            <span className={`block mt-1.5 ${toast.urgent ? 'text-base text-red-700' : 'text-xs text-gray-500'}`}>
              {toast.body}
            </span>
          )}
        </span>

        <button
          onClick={handleClose}
          aria-label="알림 닫기"
          className={`w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-full transition-colors ${
            toast.urgent
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
