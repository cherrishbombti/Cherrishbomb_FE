import { createBrowserRouter, Navigate } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import WorkerLoginPage from '../pages/worker/WorkerLoginPage';
import WorkerLayout from '../pages/worker/WorkerLayout';
import WorkerDashboardPage from '../pages/worker/WorkerDashboardPage';
import WorkerLogsPage from '../pages/worker/WorkerLogsPage';
import WorkerReportsPage from '../pages/worker/WorkerReportsPage';
import WorkerSignupPage from '../pages/worker/WorkerSignupPage';

const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/worker/login" replace /> },

  // 로그인 (누구나 접근 가능)
  { path: '/worker/login', element: <WorkerLoginPage /> },
  { path: '/worker/signup', element: <WorkerSignupPage /> },

  // 보호된 페이지 (토큰 없으면 로그인으로 이동)
  // 사회복지사 화면 — 공통 레이아웃(헤더+탭) 아래 중첩
  {
    path: '/worker',
    element: (
      <PrivateRoute redirectTo="/worker/login">
        <WorkerLayout />
      </PrivateRoute>
    ),
    children: [
      { path: 'dashboard', element: <WorkerDashboardPage /> },
      { path: 'logs', element: <WorkerLogsPage /> },
      { path: 'reports', element: <WorkerReportsPage /> },
    ],
  },
]);

export default router;
