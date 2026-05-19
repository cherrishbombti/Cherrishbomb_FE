import { createBrowserRouter, Navigate } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import WorkerLoginPage from '../pages/worker/WorkerLoginPage';
import WorkerDashboardPage from '../pages/worker/WorkerDashboardPage';
import GuardianLoginPage from '../pages/guardian/GuardianLoginPage';
import GuardianHomePage from '../pages/guardian/GuardianHomePage';
import OAuthCallbackPage from '../pages/guardian/OAuthCallbackPage';

const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/worker/login" replace /> },

  // 로그인 (누구나 접근 가능)
  { path: '/worker/login',   element: <WorkerLoginPage /> },
  { path: '/guardian/login', element: <GuardianLoginPage /> },
  { path: '/oauth/callback', element: <OAuthCallbackPage /> },

  // 보호된 페이지 (토큰 없으면 로그인으로 이동)
  {
    path: '/worker/dashboard',
    element: (
      <PrivateRoute redirectTo="/worker/login">
        <WorkerDashboardPage />
      </PrivateRoute>
    ),
  },
  {
    path: '/guardian/home',
    element: (
      <PrivateRoute redirectTo="/guardian/login">
        <GuardianHomePage />
      </PrivateRoute>
    ),
  },
]);

export default router;
