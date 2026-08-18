import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useNotifications,
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
} from '../../hooks/queries/useNotifications';
import type { AppNotification, NotificationType } from '../../types/notification';
import { timeAgo } from '../../utils/date';

/** 알림 유형별 문구·색상. DEVICE_OFFLINE/EMERGENCY는 백엔드 생성 예정 */
const TYPE_CONFIG: Record<NotificationType, { message: string; dot: string; bg: string }> = {
  FALL:           { message: '낙상이 감지되었습니다',     dot: 'bg-red-500',    bg: 'bg-red-50' },
  EMERGENCY:      { message: '긴급 상황입니다',           dot: 'bg-red-600',    bg: 'bg-red-50' },
  WARNING:        { message: '주의가 필요한 상태입니다',  dot: 'bg-yellow-500', bg: 'bg-yellow-50' },
  DEVICE_OFFLINE: { message: '기기 연결이 끊겼습니다',    dot: 'bg-gray-400',   bg: 'bg-gray-50' },
};

const FALLBACK = { message: '새로운 알림이 있습니다', dot: 'bg-gray-400', bg: 'bg-gray-50' };

function getTypeConfig(type: NotificationType) {
  return TYPE_CONFIG[type] ?? FALLBACK;
}

export default function NotificationBell() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  // '더 보기'로 확장한 페이지 수 — 20건을 넘는 알림도 이어서 볼 수 있게 한다
  const [page, setPage] = useState(0);
  const [actionError, setActionError] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, isError, isFetching } = useNotifications(page);
  const { mutate: markRead } = useMarkNotificationRead();
  const { mutate: markAllRead, isPending: markingAll } = useMarkAllNotificationsRead();

  const unreadCount = data?.unreadCount ?? 0;
  const items = data?.content ?? [];

  // 바깥 클릭 · ESC로 닫기
  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onEsc);
    };
  }, [open]);

  const handleClick = (item: AppNotification) => {
    if (!item.isRead) {
      // 읽음 처리는 부수 동작이므로 이동은 막지 않되, 실패는 사용자에게 알린다
      markRead(item.id, {
        onError: (err) => {
          console.error('알림 읽음 처리 실패', err);
          setActionError('읽음 처리에 실패했습니다.');
        },
      });
    }
    setOpen(false);
    // 선택된 대상은 URL 쿼리로 전달 — 새로고침·공유 시에도 상세가 유지된다
    navigate(`/worker/dashboard?target=${item.memberId}`);
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => {
          setOpen((v) => !v);
          setActionError('');
        }}
        aria-label={unreadCount > 0 ? `알림 ${unreadCount}건` : '알림'}
        className="relative w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white text-[10px] font-medium flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-10 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden modal-panel-in">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <span className="text-sm font-bold text-gray-800">
              알림 {unreadCount > 0 && <span className="text-red-500">{unreadCount}</span>}
            </span>
            {unreadCount > 0 && (
              <button
                onClick={() =>
                  markAllRead(undefined, {
                    onError: (err) => {
                      console.error('전체 읽음 처리 실패', err);
                      setActionError('전체 읽음 처리에 실패했습니다.');
                    },
                  })
                }
                disabled={markingAll}
                className="text-xs text-indigo-500 hover:text-indigo-600 disabled:text-gray-400 transition-colors"
              >
                모두 읽음
              </button>
            )}
          </div>

          {actionError && (
            <p className="px-4 py-2 text-xs text-red-500 bg-red-50 border-b border-red-100">{actionError}</p>
          )}

          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 flex flex-col gap-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : isError ? (
              <p className="px-4 py-8 text-center text-xs text-gray-500">
                알림을 불러오지 못했습니다.
              </p>
            ) : items.length === 0 ? (
              <p className="px-4 py-8 text-center text-xs text-gray-500">새로운 알림이 없습니다.</p>
            ) : (
              items.map((item) => {
                const cfg = getTypeConfig(item.notificationType);
                return (
                  <button
                    key={item.id}
                    onClick={() => handleClick(item)}
                    className={`w-full text-left px-4 py-3 flex gap-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors ${
                      item.isRead ? '' : cfg.bg
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${cfg.dot}`} />
                    <span className="flex-1 min-w-0">
                      <span className={`block text-sm truncate ${item.isRead ? 'text-gray-600' : 'font-medium text-gray-800'}`}>
                        {item.memberName}
                      </span>
                      <span className="block text-xs text-gray-500 mt-0.5">{cfg.message}</span>
                      <span className="block text-xs text-gray-400 mt-0.5">{timeAgo(item.createdAt)}</span>
                    </span>
                    {!item.isRead && <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0" />}
                  </button>
                );
              })
            )}

            {/* 알림이 20건을 넘는 경우 이어서 조회 */}
            {data && !data.last && (
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={isFetching}
                className="w-full py-3 text-xs text-indigo-500 hover:bg-gray-50 disabled:text-gray-400 transition-colors"
              >
                {isFetching ? '불러오는 중…' : '더 보기'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
