import { createBrowserRouter, Navigate } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import WorkerLoginPage from '../pages/worker/WorkerLoginPage';
import WorkerLayout from '../pages/worker/WorkerLayout';
import WorkerDashboardPage from '../pages/worker/WorkerDashboardPage';
import WorkerLogsPage from '../pages/worker/WorkerLogsPage';
import WorkerReportsPage from '../pages/worker/WorkerReportsPage';
import GuardianLoginPage from '../pages/guardian/GuardianLoginPage';
import GuardianHomePage from '../pages/guardian/GuardianHomePage';
import OAuthCallbackPage from '../pages/guardian/OAuthCallbackPage';
import WardRegisterPage from '../pages/guardian/WardRegisterPage';
import WorkerSignupPage from '../pages/worker/WorkerSignupPage';
import GuardianSignupPage from '../pages/guardian/GuardianSignupPage';

const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/worker/login" replace /> },

  // 로그인 (누구나 접근 가능)
  { path: '/worker/login',   element: <WorkerLoginPage /> },
  { path: '/worker/signup',  element: <WorkerSignupPage /> },
  { path: '/guardian/login', element: <GuardianLoginPage /> },
  { path: '/guardian/signup', element: <GuardianSignupPage /> },
  { path: '/oauth/callback', element: <OAuthCallbackPage /> },

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
  {
    path: '/guardian/home',
    element: (
      <PrivateRoute redirectTo="/guardian/login">
        <GuardianHomePage />
      </PrivateRoute>
    ),
  },
  // 피보호자 등록 (신규 유저 전용 — OAuthCallbackPage에서 isNewUser 시 redirect)
  {
    path: '/guardian/ward/register',
    element: (
      <PrivateRoute redirectTo="/guardian/login">
        <WardRegisterPage />
      </PrivateRoute>
    ),
  },
]);

export default router;
