import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { workerLogin } from '../../apis/auth';
import InputField from '../../components/common/InputField';
import BaseButton from '../../components/common/BaseButton';

export default function WorkerLoginPage() {
  const navigate = useNavigate();
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
      localStorage.setItem('accessToken', res);
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      {/* 카드 */}
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-md p-8">
        {/* 로고 / 타이틀 */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-indigo-500 mb-4">
            <svg className="w-8 h-8 text-pink-300" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">낙상감지 핫 라인 시스템</h1>
          <p className="text-sm text-gray-500 mt-1">관제 시스템</p>
        </div>

        {/* 탭 */}
        <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
          <button
            className="flex-1 py-2 text-sm font-medium rounded-md bg-white text-indigo-600 shadow-sm transition-all"
          >
            사회복지사
          </button>
          <button
            className="flex-1 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-all"
            onClick={() => navigate('/guardian/login')}
          >
            보호자
          </button>
        </div>

        {/* 입력 폼 */}
        <div className="flex flex-col gap-4" onKeyDown={handleKeyDown}>
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

          {/* 서버 에러 */}
          {serverError && (
            <p className="text-sm text-red-500 text-center">{serverError}</p>
          )}

          <BaseButton
            onClick={handleLogin}
            disabled={isLoading}
            loading={isLoading}
            className="w-full mt-2 !bg-indigo-500 hover:!bg-indigo-600 !text-white !py-3 !rounded-xl !text-base !font-semibold"
          >
            로그인
          </BaseButton>
        </div>

        {/* 비밀번호 찾기 */}
        <div className="mt-4 text-center">
          <button className="text-sm text-gray-400 hover:text-gray-600 underline underline-offset-2 transition-colors">
            비밀번호를 잊으셨나요?
          </button>
        </div>


      </div>
    </div>
  );
}
