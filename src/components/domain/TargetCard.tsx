import type { Target, TargetStatus } from '../../types/target';

interface Props {
  target: Target;
  onClick: (id: number) => void;
}

// 상태별 스타일
const STATUS_CONFIG: Record<TargetStatus, {
  cardBg: string;
  border: string;
  badgeBg: string;
  badgeText: string;
  avatarBg: string;
  dotColor: string;
}> = {
  EMERGENCY: {
    cardBg: 'bg-red-50',
    border: 'border-red-200',
    badgeBg: 'bg-red-100',
    badgeText: 'text-red-500',
    avatarBg: 'bg-red-400',
    dotColor: 'bg-red-500',
  },
  WARNING: {
    cardBg: 'bg-yellow-50',
    border: 'border-yellow-200',
    badgeBg: 'bg-yellow-100',
    badgeText: 'text-yellow-600',
    avatarBg: 'bg-yellow-400',
    dotColor: 'bg-yellow-500',
  },
  SAFE: {
    cardBg: 'bg-white',
    border: 'border-gray-200',
    badgeBg: 'bg-green-100',
    badgeText: 'text-green-600',
    avatarBg: 'bg-indigo-400',
    dotColor: 'bg-green-500',
  },
};

function timeAgo(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return '방금 전';
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  return `${Math.floor(diff / 86400)}일 전`;
}

export default function TargetCard({ target, onClick }: Props) {
  const cfg = STATUS_CONFIG[target.status];
  const firstChar = target.name[0];

  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.location.href = `tel:${target.phone}`;
  };

  return (
    <div
      onClick={() => onClick(target.targetId)}
      className={`${cfg.cardBg} border ${cfg.border} rounded-xl p-4 cursor-pointer hover:shadow-md transition-shadow flex flex-col gap-3`}
    >
      {/* 상단: 드래그 핸들 + 상태 뱃지 + 전화 버튼 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* 드래그 핸들 아이콘 */}
          <svg className="w-3.5 h-3.5 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 6a2 2 0 100-4 2 2 0 000 4zm0 8a2 2 0 100-4 2 2 0 000 4zm0 8a2 2 0 100-4 2 2 0 000 4zm8-16a2 2 0 100-4 2 2 0 000 4zm0 8a2 2 0 100-4 2 2 0 000 4zm0 8a2 2 0 100-4 2 2 0 000 4z" />
          </svg>
          {/* 상태 점 + 뱃지 */}
          <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${cfg.badgeBg} ${cfg.badgeText}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dotColor} ${target.status === 'EMERGENCY' ? 'animate-pulse' : ''}`} />
            {target.statusReason}
          </div>
        </div>
        {/* 전화 버튼 */}
        <button
          onClick={handleCall}
          className="w-7 h-7 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-sm transition-colors"
          aria-label={`${target.name}에게 전화`}
        >
          <svg className="w-3.5 h-3.5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 8V5z" />
          </svg>
        </button>
      </div>

      {/* 중단: 아바타 + 이름/주소 */}
      <div className="flex items-center gap-3">
        <div className={`w-11 h-11 rounded-full ${cfg.avatarBg} flex items-center justify-center flex-shrink-0`}>
          <span className="text-white font-bold text-base">{firstChar}</span>
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-gray-800 text-sm leading-tight">
            {target.name} <span className="font-normal text-gray-400">({target.age}세)</span>
          </p>
          <p className="text-xs text-gray-400 truncate mt-0.5">
            <span className="mr-1">📍</span>{target.address}
          </p>
        </div>
      </div>

      {/* 하단: 활동상태 + 배터리 */}
      <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-100 pt-2">
        <div className="flex items-center gap-3">
          {/* 활동 상태 */}
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            {target.isActive ? '활동 중' : '비활동'}
          </span>
          {/* 배터리 */}
          <span className={`flex items-center gap-1 ${target.battery <= 20 ? 'text-red-500 font-semibold' : ''}`}>
            <svg className="w-3.5 h-3 text-current" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <rect x="2" y="7" width="18" height="10" rx="2" />
              <path strokeLinecap="round" d="M22 11v2" />
            </svg>
            {target.battery}%
          </span>
        </div>
        {/* 마지막 업데이트 */}
        <span className="flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          최종 업데이트: {timeAgo(target.lastUpdatedAt)}
        </span>
      </div>
    </div>
  );
}
