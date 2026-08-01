import { useState } from 'react';
import { getErrorMessage } from '../../utils/apiError';
import { setToken } from '../../utils/token';
import Logo from '../../components/common/Logo';
import { APP_NAME } from '../../constants/app';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { workerLogin } from '../../apis/auth';
import InputField from '../../components/common/InputField';
import BaseButton from '../../components/common/BaseButton';

export default function WorkerLoginPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const location = useLocation();
  // 회원가입 완료 후 navigate state로 전달되는 값 (없을 수 있으므로 좁혀서 사용)
  const locationState = location.state as { signupSuccess?: boolean } | null;
  const signupSuccess = locationState?.signupSuccess ?? false;
  const [orgId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [idError, setIdError] = useState('');
  const [pwError, setPwError] = useState('');
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    let valid = true;
    setIdError('');
    setPwError('');
    setServerError('');
    if (!orgId.trim()) {
      setIdError('아이디를 입력해주세요.');
      valid = false;
    }
    if (!password.trim()) {
      setPwError('비밀번호를 입력해주세요.');
      valid = false;
    }
    return valid;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setIsLoading(true);
    try {
      const res = await workerLogin({ orgId, password });
      setToken(res.token);
      queryClient.clear(); // 이전 계정 캐시 제거
      navigate('/worker/dashboard');
    } catch (err) {
      setServerError(getErrorMessage(err, '아이디 또는 비밀번호를 확인해주세요.'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleLogin();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-slate-50 px-4">
      {/* 브랜드 — 카드 바깥 상단 */}
      <div className="w-full max-w-md mb-8 flex flex-col items-center text-center">
        <Logo size="xl" variant="inverted" className="shadow-lg shadow-indigo-500/10 mb-5" />
        <h1 className="text-3xl leading-tight font-extrabold text-gray-900 tracking-tight">{APP_NAME}</h1>
        <p className="text-base text-gray-600 mt-2">어르신의 안전을 지키는 스마트 케어</p>
      </div>

      {/* 카드 */}
      {/* 에러 문구가 나타나도 카드가 커지지 않도록 최소 높이를 확보하고 내용은 세로 중앙 정렬 */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md px-8 py-9 min-h-[23rem] flex flex-col justify-center">
        {/* 회원가입 성공 메시지 */}
        {signupSuccess && (
          <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700 text-center">
            회원가입이 완료되었습니다. 로그인해주세요.
          </div>
        )}

        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">사회복지사 로그인</h2>
          <span className="mt-2.5 block w-28 h-0.5 bg-indigo-500 rounded-full mx-auto" />
        </div>

        {/* 입력 폼 */}
        <div className="flex flex-col gap-3" onKeyDown={handleKeyDown}>
          <InputField
            label="아이디"
            type="text"
            placeholder="아이디를 입력해주세요."
            value={orgId}
            onChange={(e) => {
              setLoginId(e.target.value);
              if (idError) setIdError('');
            }}
            error={idError}
            required
          />
          <InputField
            label="비밀번호"
            type="password"
            placeholder="비밀번호를 입력해주세요."
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (pwError) setPwError('');
            }}
            error={pwError}
            required
          />

          {/* 서버 에러 — 있을 때만 표시 (드문 상황이라 예약 대신 조건부) */}
          {serverError && (
            <p className="text-sm text-red-500 text-center">{serverError}</p>
          )}

          <BaseButton
            onClick={handleLogin}
            disabled={isLoading}
            loading={isLoading}
            className="w-full !bg-indigo-500 hover:!bg-indigo-600 !text-white !py-3 !rounded-xl !text-base !font-semibold"
          >
            로그인
          </BaseButton>
        </div>

        {/* 비밀번호 찾기 */}
        <div className="mt-4 text-center">
          <button className="text-sm text-gray-500 hover:text-gray-600 underline underline-offset-2 transition-colors">
            비밀번호를 잊으셨나요?
          </button>
        </div>

        {/* 회원가입 링크 */}
        <div className="mt-3 text-center">
          <span className="text-sm text-gray-500">계정이 없으신가요? </span>
          <button
            className="text-sm text-indigo-500 font-semibold hover:text-indigo-700 transition-colors"
            onClick={() => navigate('/worker/signup')}
          >
            회원가입
          </button>
        </div>


      </div>
    </div>
  );
}
