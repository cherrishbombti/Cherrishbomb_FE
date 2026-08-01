import { useState } from 'react';
import { getErrorMessage } from '../../utils/apiError';
import Logo from '../../components/common/Logo';
import { APP_NAME } from '../../constants/app';
import { useNavigate } from 'react-router-dom';
import { workerSignup } from '../../apis/auth';
import InputField from '../../components/common/InputField';
import BaseButton from '../../components/common/BaseButton';
import type { WorkerSignupRequest } from '../../types/auth';

const INITIAL: WorkerSignupRequest = {
  orgId: '',
  password: '',
  name: '',
};

export default function WorkerSignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Partial<Record<keyof WorkerSignupRequest | 'confirmPassword', string>>>({});
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const set = (field: keyof WorkerSignupRequest, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const validate = () => {
    const e: typeof errors = {};

    if (!form.orgId.trim()) {
      e.orgId = '아이디를 입력해주세요.';
    }

    if (!form.name.trim()) {
      e.name = '기관명을 입력해주세요.';
    }

    if (!form.password.trim()) {
      e.password = '비밀번호를 입력해주세요.';
    }

    if (!confirmPassword.trim()) {
      e.confirmPassword = '비밀번호 확인을 입력해주세요.';
    } else if (form.password !== confirmPassword) {
      e.confirmPassword = '비밀번호가 일치하지 않습니다.';
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSignup = async () => {
    if (!validate()) return;
    setIsLoading(true);
    setServerError('');
    try {
      await workerSignup(form);
      // 회원가입 성공 → 로그인 페이지로 이동
      navigate('/worker/login', { state: { signupSuccess: true } });
    } catch (err) {
      setServerError(getErrorMessage(err, '회원가입에 실패했습니다. 다시 시도해주세요.'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSignup();
  };

  const isFormFilled =
    form.orgId && form.name && form.password && confirmPassword;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-slate-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-md p-7">
        {/* 로고 / 타이틀 */}
        <div className="mb-6 text-center">
          <Logo size="lg" className="mb-4" />
          <h1 className="text-2xl font-bold text-gray-800">사회복지사 회원가입</h1>
          <p className="text-sm text-gray-500 mt-1">{APP_NAME}</p>
        </div>

        {/* 입력 폼 */}
        <div className="flex flex-col gap-1.5" onKeyDown={handleKeyDown}>
          <InputField
            label="아이디"
            type="text"
            placeholder="사용할 아이디를 입력해주세요."
            value={form.orgId}
            onChange={(e) => {
              set('orgId', e.target.value);
              if (errors.orgId) setErrors((prev) => ({ ...prev, orgId: '' }));
            }}
            error={errors.orgId}
            required
          />

          <InputField
            label="기관명"
            type="text"
            placeholder="예: 경북대학교 관리자"
            value={form.name}
            onChange={(e) => {
              set('name', e.target.value);
              if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
            }}
            error={errors.name}
            required
          />

          <InputField
            label="비밀번호"
            type="password"
            placeholder="비밀번호 (6자 이상)"
            value={form.password}
            onChange={(e) => {
              set('password', e.target.value);
              if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
            }}
            error={errors.password}
            required
          />

          <InputField
            label="비밀번호 확인"
            type="password"
            placeholder="비밀번호를 다시 입력해주세요."
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: '' }));
            }}
            error={errors.confirmPassword}
            required
          />

          {/* 서버 에러 */}
          {serverError && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600 text-center">
              {serverError}
            </div>
          )}

          <BaseButton
            onClick={handleSignup}
            disabled={!isFormFilled || isLoading}
            loading={isLoading}
            className={`w-full mt-1 !text-white !py-3 !rounded-xl !text-base !font-semibold ${
              isFormFilled
                ? '!bg-indigo-500 hover:!bg-indigo-600'
                : '!bg-gray-300'
            }`}
          >
            회원가입
          </BaseButton>
        </div>

        {/* 로그인으로 이동 */}
        <div className="mt-5 text-center">
          <span className="text-sm text-gray-500">이미 계정이 있으신가요? </span>
          <button
            className="text-sm text-indigo-500 font-semibold hover:text-indigo-700 transition-colors"
            onClick={() => navigate('/worker/login')}
          >
            로그인
          </button>
        </div>
      </div>
    </div>
  );
}
