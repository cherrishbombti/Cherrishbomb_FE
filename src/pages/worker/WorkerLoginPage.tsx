import { useState } from 'react';
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
  const signupSuccess = (location.state as any)?.signupSuccess ?? false;
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
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || '아이디 또는 비밀번호가 일치하지 않습니다.';
      setServerError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleLogin();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-slate-50 px-4">
      {/* 카드 */}
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-md p-7">
        {/* 회원가입 성공 메시지 */}
        {signupSuccess && (
          <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700 text-center">
            🎉 회원가입이 완료되었습니다! 로그인해주세요.
          </div>
        )}

        {/* 로고 / 타이틀 */}
        <div className="mb-6 text-center">
          <Logo size="lg" className="mb-4" />
          <h1 className="text-2xl font-bold text-gray-800">{APP_NAME}</h1>
          <p className="text-sm text-gray-500 mt-1">관제 시스템</p>
        </div>

        {/* 탭 */}
        <div className="flex bg-gray-100 rounded-lg p-1 mb-5">
          <button
            className="flex-1 py-2 text-sm font-medium rounded-md bg-white text-indigo-600 shadow-sm transition-all duration-200 ease-out"
          >
            사회복지사
          </button>
          <button
            className="flex-1 py-2 text-sm font-medium rounded-md text-gray-500 cursor-pointer hover:text-gray-700 hover:bg-white/60 active:scale-[0.98] transition-all duration-200 ease-out motion-reduce:transition-none"
            onClick={() => navigate('/guardian/login')}
          >
            보호자
          </button>
        </div>

        {/* 입력 폼 */}
        <div className="flex flex-col gap-1.5" onKeyDown={handleKeyDown}>
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
