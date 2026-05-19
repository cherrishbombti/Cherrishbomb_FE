import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSocialLoginUrl } from '../../apis/auth';

export default function GuardianLoginPage() {
  const navigate = useNavigate();
  const [loadingProvider, setLoadingProvider] = useState<'google' | 'kakao' | null>(null);

  const handleSocialLogin = (provider: 'google' | 'kakao') => {
    setLoadingProvider(provider);
    const USE_MOCK = true;
    if (USE_MOCK) {
      setTimeout(() => {
        navigate(`/oauth/callback?provider=${provider}&code=mock-code-1234`);
      }, 600);
      return;
    }
    window.location.href = getSocialLoginUrl(provider);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-md p-8">
        {/* 로고 / 타이틀 */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-indigo-500 mb-4">
            <svg className="w-8 h-8 text-pink-300" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">낙상감지 핫 라인 시스템</h1>
          <p className="text-sm text-gray-500 mt-1">보호자 로그인</p>
        </div>

        {/* 탭 */}
        <div className="flex bg-gray-100 rounded-lg p-1 mb-8">
          <button
            className="flex-1 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-all"
            onClick={() => navigate('/worker/login')}
          >
            사회복지사
          </button>
          <button
            className="flex-1 py-2 text-sm font-medium rounded-md bg-white text-indigo-600 shadow-sm transition-all"
          >
            보호자
          </button>
        </div>

        {/* 소셜 로그인 버튼들 */}
        <div className="flex flex-col gap-3">
          {/* 구글 로그인 */}
          <button
            onClick={() => handleSocialLogin('google')}
            disabled={loadingProvider !== null}
            className="flex items-center justify-center gap-3 w-full py-3 px-4 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {loadingProvider === 'google' ? (
              <span className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            )}
            Google로 시작하기
          </button>

          {/* 카카오 로그인 */}
          <button
            onClick={() => handleSocialLogin('kakao')}
            disabled={loadingProvider !== null}
            className="flex items-center justify-center gap-3 w-full py-3 px-4 rounded-xl bg-[#FEE500] hover:bg-[#F0D800] transition-colors text-sm font-medium text-[#3C1E1E] disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {loadingProvider === 'kakao' ? (
              <span className="w-5 h-5 border-2 border-[#3C1E1E] border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#3C1E1E">
                <path d="M12 3C6.48 3 2 6.58 2 11c0 2.83 1.7 5.31 4.27 6.82l-.97 3.56c-.07.27.22.49.46.34l4.15-2.74A12.6 12.6 0 0012 19c5.52 0 10-3.58 10-8s-4.48-8-10-8z" />
              </svg>
            )}
            Kakao로 시작하기
          </button>
        </div>

        {/* 구분선 */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">또는</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* 회원가입 */}
        <div className="text-center">
          <span className="text-sm text-gray-500">처음 오셨나요? </span>
          <button
            onClick={() => navigate('/guardian/signup')}
            className="text-sm text-indigo-500 font-semibold hover:underline"
          >
            회원가입하기
          </button>
        </div>
      </div>
    </div>
  );
}
