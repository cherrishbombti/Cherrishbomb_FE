import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../../components/common/InputField';
import BaseButton from '../../components/common/BaseButton';
import { registerWard } from '../../apis/guardian';
import type { RegisterWardRequest } from '../../types/guardian';

const STEPS = ['기본 정보', '연락처 정보', '확인'];

const RELATIONSHIPS = ['어머니', '아버지', '할머니', '할아버지', '배우자', '기타'];

const INITIAL: RegisterWardRequest = {
  name: '',
  birthDate: '',
  address: '',
  phone: '',
  relationship: '',
};

type Errors = Partial<Record<keyof RegisterWardRequest, string>>;

export default function WardRegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState<Errors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [customRelationship, setCustomRelationship] = useState('');

  const set = (field: keyof RegisterWardRequest, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validateStep = (s: number): boolean => {
    const e: Errors = {};
    if (s === 0) {
      if (!form.name.trim()) e.name = '이름을 입력해주세요.';
      if (!form.birthDate) e.birthDate = '생년월일을 입력해주세요.';
      else if (new Date(form.birthDate) > new Date()) e.birthDate = '올바른 생년월일을 입력해주세요.';
    }
    if (s === 1) {
      if (!form.address.trim()) e.address = '주소를 입력해주세요.';
      if (!/^010-\d{4}-\d{4}$/.test(form.phone)) e.phone = '010-XXXX-XXXX 형식으로 입력해주세요.';
      const rel = form.relationship === '기타' ? customRelationship : form.relationship;
      if (!rel.trim()) e.relationship = '관계를 선택해주세요.';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => { if (validateStep(step)) setStep((s) => s + 1); };
  const handleBack = () => setStep((s) => s - 1);

  const handleSubmit = async () => {
    const finalRelationship = form.relationship === '기타' ? customRelationship : form.relationship;
    setIsLoading(true);
    try {
      await registerWard({ ...form, relationship: finalRelationship });
      navigate('/guardian/home', { replace: true });
    } catch {
      alert('등록에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const displayRelationship = form.relationship === '기타' ? customRelationship : form.relationship;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-md p-8">

        {/* 로고 / 타이틀 */}
        <div className="mb-6 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-indigo-500 mb-4">
            <svg className="w-8 h-8 text-pink-300" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">낙상감지 핫 라인 시스템</h1>
          <p className="text-sm text-gray-500 mt-1">피보호자 등록</p>
        </div>

        {/* 스텝 인디케이터 */}
        <div className="flex items-center mb-6">
          {STEPS.map((label, i) => (
            <div key={i} className="flex items-center flex-1">
              <div className="flex flex-col items-center gap-1 flex-shrink-0">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors
                    ${i < step ? 'bg-indigo-500 text-white'
                      : i === step ? 'bg-indigo-500 text-white'
                      : 'bg-gray-200 text-gray-400'}`}
                >
                  {i < step ? (
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : i + 1}
                </div>
                <span className={`text-xs whitespace-nowrap ${i === step ? 'text-indigo-600 font-medium' : 'text-gray-400'}`}>
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-px mx-1.5 mb-4 ${i < step ? 'bg-indigo-400' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        {/* ── Step 0: 기본 정보 ── */}
        {step === 0 && (
          <div className="flex flex-col gap-4">
            <InputField
              label="이름"
              placeholder="이름을 입력해주세요."
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              error={errors.name}
              required
            />

            {/* 생년월일 — InputField가 date 미지원이라 직접 */}
            <div className="flex flex-col gap-1 w-full">
              <label className="text-sm font-medium text-gray-700">
                생년월일<span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="date"
                value={form.birthDate}
                max={new Date().toISOString().split('T')[0]}
                onChange={(e) => set('birthDate', e.target.value)}
                className={`w-full px-3 py-2 rounded-md border text-sm focus:outline-none focus:ring-2 transition-colors duration-200 bg-white
                  ${errors.birthDate ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-400'}`}
              />
              {errors.birthDate && <span className="text-xs text-red-500">{errors.birthDate}</span>}
            </div>
          </div>
        )}

        {/* ── Step 1: 연락처 정보 ── */}
        {step === 1 && (
          <div className="flex flex-col gap-4">
            <InputField
              label="주소"
              placeholder="예: 서울시 강남구 대치동 123"
              value={form.address}
              onChange={(e) => set('address', e.target.value)}
              error={errors.address}
              required
            />

            <InputField
              label="전화번호"
              type="tel"
              placeholder="010-0000-0000"
              value={form.phone}
              onChange={(e) => set('phone', e.target.value)}
              error={errors.phone}
              required
            />

            {/* 관계 선택 */}
            <div className="flex flex-col gap-1 w-full">
              <label className="text-sm font-medium text-gray-700">
                나와의 관계<span className="text-red-500 ml-1">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {RELATIONSHIPS.map((rel) => (
                  <button
                    key={rel}
                    type="button"
                    onClick={() => set('relationship', rel)}
                    className={`py-2 rounded-md text-sm border transition-colors duration-200
                      ${form.relationship === rel
                        ? 'bg-indigo-500 text-white border-indigo-500'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-400 hover:text-indigo-600'}`}
                  >
                    {rel}
                  </button>
                ))}
              </div>
              {form.relationship === '기타' && (
                <InputField
                  placeholder="관계를 직접 입력해주세요."
                  value={customRelationship}
                  onChange={(e) => setCustomRelationship(e.target.value)}
                />
              )}
              {errors.relationship && <span className="text-xs text-red-500">{errors.relationship}</span>}
            </div>
          </div>
        )}

        {/* ── Step 2: 확인 ── */}
        {step === 2 && (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-gray-500 mb-1">아래 정보가 맞는지 확인해주세요.</p>

            {[
              { label: '이름', value: form.name },
              { label: '생년월일', value: form.birthDate.replace(/-/g, '. ') },
              { label: '주소', value: form.address },
              { label: '전화번호', value: form.phone },
              { label: '관계', value: displayRelationship },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">{label}</span>
                <span className="text-sm font-medium text-gray-800">{value}</span>
              </div>
            ))}
          </div>
        )}

        {/* 버튼 영역 */}
        <div className="flex gap-2 mt-6">
          {step > 0 && (
            <BaseButton
              variant="secondary"
              onClick={handleBack}
              className="flex-1 !py-2.5 !rounded-xl !text-sm !font-semibold"
            >
              이전
            </BaseButton>
          )}

          {step < 2 ? (
            <BaseButton
              onClick={handleNext}
              className="flex-1 !bg-indigo-500 hover:!bg-indigo-600 !text-white !py-2.5 !rounded-xl !text-sm !font-semibold"
            >
              다음
            </BaseButton>
          ) : (
            <BaseButton
              onClick={handleSubmit}
              loading={isLoading}
              disabled={isLoading}
              className="flex-1 !bg-indigo-500 hover:!bg-indigo-600 !text-white !py-2.5 !rounded-xl !text-sm !font-semibold"
            >
              등록하기
            </BaseButton>
          )}
        </div>

        {/* 로그아웃 */}
        <div className="mt-4 text-center">
          <button
            className="text-sm text-gray-400 hover:text-gray-600 underline underline-offset-2 transition-colors"
            onClick={() => { localStorage.removeItem('accessToken'); navigate('/guardian/login'); }}
          >
            로그아웃
          </button>
        </div>

      </div>
    </div>
  );
}
