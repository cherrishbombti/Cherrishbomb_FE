import { createBrowserRouter, Navigate } from 'react-router-dom';
import WorkerLoginPage from '../pages/worker/WorkerLoginPage';
import WorkerDashboardPage from '../pages/worker/WorkerDashboardPage';
import GuardianLoginPage from '../pages/guardian/GuardianLoginPage';
import GuardianHomePage from '../pages/guardian/GuardianHomePage';
import OAuthCallbackPage from '../pages/guardian/OAuthCallbackPage';

const router = createBrowserRouter([
  { path: '/',                  element: <Navigate to="/worker/login" replace /> },
  { path: '/worker/login',      element: <WorkerLoginPage /> },
  { path: '/worker/dashboard',  element: <WorkerDashboardPage /> },
  { path: '/guardian/login',    element: <GuardianLoginPage /> },
  { path: '/guardian/home',     element: <GuardianHomePage /> },
  { path: '/oauth/callback',    element: <OAuthCallbackPage /> },
]);

export default router;
