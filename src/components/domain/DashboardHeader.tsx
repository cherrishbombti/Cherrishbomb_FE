import Logo from '../common/Logo';
import { APP_NAME } from '../../constants/app';
import NotificationBell from './NotificationBell';
import OrgCodeBadge from './OrgCodeBadge';

interface Props {
  orgName?: string;
  /** 기관번호 — 미부여 계정이거나 백엔드 배포 전이면 없을 수 있어 그때는 표시하지 않는다 */
  orgCode?: number | null;
  onLogout: () => void;
}

// 대시보드 상단 헤더 (로고 · 서비스명 · 기관번호 · 기관명 · 로그아웃)
export default function DashboardHeader({ orgName, orgCode, onLogout }: Props) {
  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-2">
        <Logo size="sm" variant="inverted" />
        <span className="font-bold text-gray-800 text-sm">{APP_NAME}</span>
      </div>
      <div className="flex items-center gap-3 text-sm text-gray-500">
        {orgCode != null && <OrgCodeBadge orgCode={orgCode} />}
        <NotificationBell />
        <span className="hidden sm:inline">{orgName ? `${orgName} 님` : ''}</span>
        <button
          onClick={onLogout}
          className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-600 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          로그아웃
        </button>
      </div>
    </header>
  );
}
