import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { exchangeOAuthCode } from '../../apis/auth';

export default function OAuthCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState('');

  useEffect(() => {
    const code = searchParams.get('code');
    const provider = searchParams.get('provider') || 'google';

    if (!code) {
      setError('인가 코드를 찾을 수 없습니다. 다시 시도해주세요.');
      return;
    }

    exchangeOAuthCode(provider, code)
      .then((res) => {
        localStorage.setItem('accessToken', res.accessToken);
        if (res.isNewUser) {
          // 신규 유저 → 회원가입 페이지로 강제 이동
          navigate('/guardian/signup', { replace: true });
        } else {
          navigate('/guardian/home', { replace: true });
        }
      })
      .catch(() => {
        setError('로그인에 실패했습니다. 다시 시도해주세요.');
      });
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
        <p className="text-red-500 font-medium">{error}</p>
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
