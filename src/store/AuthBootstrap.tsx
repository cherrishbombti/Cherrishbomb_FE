import { useEffect, useState } from 'react';
import axios from 'axios';
import { refreshAccessToken } from '../apis/auth';
import { setToken } from '../utils/token';
import Logo from '../components/common/Logo';

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
      .catch((err) => {
        // 401(로그인 안 한 상태)은 정상 흐름이라 조용히 넘어간다.
        // 그 외(5xx·타임아웃·BACKEND_ORIGIN 오설정 등)는 배포 후 진단할 수 있게 로그를 남긴다.
        if (!axios.isAxiosError(err) || err.response?.status !== 401) {
          console.error('세션 복구(refresh) 실패', err);
        }
      })
      .finally(() => setReady(true));
  }, []);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-slate-50">
        <Logo size="xl" className="animate-pulse" />
      </div>
    );
  }

  return <>{children}</>;
}
