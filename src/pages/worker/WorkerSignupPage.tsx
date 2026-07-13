import { useState } from 'react';
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
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || '회원가입에 실패했습니다. 다시 시도해주세요.';
      setServerError(msg);
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-md p-8">
        {/* 로고 / 타이틀 */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-indigo-500 mb-4">
            <svg className="w-8 h-8 text-pink-300" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">사회복지사 회원가입</h1>
          <p className="text-sm text-gray-500 mt-1">{APP_NAME}</p>
        </div>

        {/* 입력 폼 */}
        <div className="flex flex-col gap-4" onKeyDown={handleKeyDown}>
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
            className={`w-full mt-2 !text-white !py-3 !rounded-xl !text-base !font-semibold ${
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
          <span className="text-sm text-gray-400">이미 계정이 있으신가요? </span>
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
