import { Outlet, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import DashboardHeader from '../../components/domain/DashboardHeader';
import WorkerTabs from '../../components/domain/WorkerTabs';
import { useMyOrg } from '../../hooks/queries/useMyOrg';
import { clearToken } from '../../utils/token';

// 사회복지사 화면 공통 레이아웃 — 헤더 + 탭을 모든 하위 페이지가 공유
export default function WorkerLayout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: org } = useMyOrg();

  const handleLogout = () => {
    clearToken();
    queryClient.clear(); // 다른 계정 로그인 시 이전 캐시가 남지 않도록
    navigate('/worker/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-10">
        <DashboardHeader orgName={org?.name} onLogout={handleLogout} />
        <WorkerTabs />
      </div>
      <Outlet />
    </div>
  );
}
