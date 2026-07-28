import { Navigate } from 'react-router-dom';

interface Props {
  children: React.ReactNode;
  redirectTo?: string;
}

export default function PrivateRoute({ children, redirectTo = '/worker/login' }: Props) {
  const token = localStorage.getItem('accessToken');

  // 토큰 없으면 로그인 페이지로 강제 이동
  if (!token) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}
