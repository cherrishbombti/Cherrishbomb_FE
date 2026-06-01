import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { axiosInstance } from '../../apis/axiosInstance';

/**
 * OAuth 콜백 처리 페이지
 *
 * 백엔드 redirect 패턴 지원:
 *   A) ?token=JWT&isNewUser=true   (백엔드가 JWT를 token 파라미터로 전달)
 *   B) ?code=JWT&isNewUser=true    (백엔드가 JWT를 code 파라미터로 전달, JWT는 eyJ로 시작)
 *   C) ?accessToken=JWT            (accessToken 파라미터)
 *
 * 위 패턴 모두 해당 없으면 → /guardian/login 으로 이동
 *
 * isNewUser 파라미터가 없을 경우:
 *   GET /api/wards/me/summary 호출 → 404/에러면 신규 유저로 판단
 */
export default function OAuthCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    handleCallback();
  }, []);

  async function handleCallback() {
    // ── 1. URL 파라미터에서 JWT 추출 ─────────────────────────────
    const tokenParam     = searchParams.get('token');
    const accessTokenParam = searchParams.get('accessToken');
    const codeParam      = searchParams.get('code');

    let jwt: string | null = null;

    if (tokenParam) {
      // 패턴 A: ?token=JWT
      jwt = tokenParam;
    } else if (accessTokenParam) {
      // 패턴 C: ?accessToken=JWT
      jwt = accessTokenParam;
    } else if (codeParam && isJwt(codeParam)) {
      // 패턴 B: ?code=JWT  (JWT 형식인 경우만)
      jwt = codeParam;
    }

    if (!jwt) {
      setErrorMsg('로그인 처리에 실패했습니다. 백엔드 redirect URL 설정을 확인해주세요.\n(token / accessToken 파라미터가 없습니다)');
      return;
    }

    // ── 2. 토큰 저장 ────────────────────────────────────────────
    localStorage.setItem('accessToken', jwt);

    // ── 3. 신규 유저 여부 판별 ───────────────────────────────────
    const isNewUserParam = searchParams.get('isNewUser');

    if (isNewUserParam === 'true') {
      navigate('/guardian/signup', { replace: true });
      return;
    }
    if (isNewUserParam === 'false') {
      navigate('/guardian/home', { replace: true });
      return;
    }

    // isNewUser 파라미터 없으면 → ward 존재 여부로 판별
    try {
      await axiosInstance.get('/api/wards/me/summary');
      // 200 OK → 기존 유저, ward 이미 등록됨
      navigate('/guardian/home', { replace: true });
    } catch (e: any) {
      // 404 or 에러 → ward 미등록, 신규 유저 처리
      navigate('/guardian/signup', { replace: true });
    }
  }

  if (errorMsg) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4 px-6">
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
          <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <p className="text-red-500 font-medium text-center whitespace-pre-line text-sm">{errorMsg}</p>
        <button
          className="text-sm text-indigo-500 underline"
          onClick={() => navigate('/guardian/login')}
        >
          로그인 페이지로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
      <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-gray-500 text-sm">로그인 처리 중...</p>
    </div>
  );
}

/** JWT 형식 여부 판별 (헤더.페이로드.서명) */
function isJwt(value: string): boolean {
  return /^eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]*$/.test(value);
}
