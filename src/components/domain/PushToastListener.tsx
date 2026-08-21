import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { onMessage } from 'firebase/messaging';
import { getFcmMessaging } from '../../lib/firebase';
import { useTitleBlink } from '../../hooks/useTitleBlink';
import PushToast from './PushToast';

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

  // 탭을 안 보고 있어도 위급 알림을 놓치지 않도록 제목을 깜빡인다
  useTitleBlink(toast?.urgent ? `🚨 ${toast.title}` : null);

  if (!toast) return null;

  return (
    <PushToast
      title={toast.title}
      body={toast.body}
      urgent={toast.urgent}
      onClick={() => {
        setToast(null);
        if (toast.memberId) navigate(`/worker/dashboard?target=${toast.memberId}`);
      }}
      onClose={() => setToast(null)}
    />
  );
}
