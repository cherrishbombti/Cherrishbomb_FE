import { useEffect, useState } from 'react';
import { refreshAccessToken } from '../apis/auth';
import { setToken } from '../utils/token';

/**
 * access token은 메모리에만 있어 새로고침하면 사라진다.
 * 라우터를 그리기 전에 refresh 쿠키로 복구를 시도해, PrivateRoute가
 * 토큰이 잠깐 없는 순간을 로그아웃으로 오인해 로그인 페이지로 튕기지 않게 한다.
 * 쿠키가 없거나 만료됐으면(로그인 안 한 상태) 조용히 실패하고 로그인 페이지로 진행한다.
 */
export default function AuthBootstrap({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    refreshAccessToken()
      .then(({ token }) => setToken(token))
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);

  if (!ready) return null;

  return <>{children}</>;
}
