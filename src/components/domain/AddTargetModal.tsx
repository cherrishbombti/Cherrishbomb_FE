import { useState } from 'react';
import BaseModal from '../common/BaseModal';
import InputField from '../common/InputField';
import BaseButton from '../common/BaseButton';
import { addTarget } from '../../apis/targets';
import type { AddTargetRequest } from '../../types/target';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void; // 등록 성공 시 부모에서 목록 새로고침
}

const INITIAL: AddTargetRequest = { name: '', age: 0, address: '', phone: '' };

export default function AddTargetModal({ isOpen, onClose, onSuccess }: Props) {
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState<Partial<Record<keyof AddTargetRequest, string>>>({});
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const set = (field: keyof AddTargetRequest, value: string | number) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const validate = () => {
    const e: typeof errors = {};
    if (!form.name.trim()) e.name = '이름을 입력해주세요.';
    if (!form.age || form.age <= 0) e.age = '올바른 나이를 입력해주세요.';
    if (!form.address.trim()) e.address = '주소를 입력해주세요.';
    const phoneReg = /^010-\d{4}-\d{4}$/;
    if (!phoneReg.test(form.phone)) e.phone = '010-XXXX-XXXX 형식으로 입력해주세요.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsLoading(true);
    setServerError('');
    try {
      await addTarget(form);
      onSuccess();
      handleClose();
    } catch {
      setServerError('등록에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setForm(INITIAL);
    setErrors({});
    setServerError('');
    onClose();
  };

  const isFormFilled = form.name && form.age > 0 && form.address && form.phone;

  return (
    <BaseModal isOpen={isOpen} onClose={handleClose} title="모니터링 대상 추가">
      <div className="flex flex-col gap-4 mt-2">
        <InputField
          label="이름"
          placeholder="홍길동"
          value={form.name}
          onChange={(e) => set('name', e.target.value)}
          error={errors.name}
          required
        />
        <InputField
          label="나이"
          type="number"
          placeholder="75"
          value={form.age === 0 ? '' : String(form.age)}
          onChange={(e) => set('age', Number(e.target.value))}
          error={errors.age}
          required
        />
        <InputField
          label="주소"
          placeholder="대구시 중구 동성로 12 (상세주소 포함)"
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

        {serverError && (
          <p className="text-sm text-red-500">{serverError}</p>
        )}

        <div className="flex gap-2 mt-2">
          <BaseButton
            variant="secondary"
            onClick={handleClose}
            className="flex-1"
          >
            취소
          </BaseButton>
          <BaseButton
            onClick={handleSubmit}
            disabled={!isFormFilled || isLoading}
            loading={isLoading}
            className={`flex-1 !text-white ${isFormFilled ? '!bg-indigo-500 hover:!bg-indigo-600' : '!bg-gray-300'}`}
          >
            추가
          </BaseButton>
        </div>
      </div>
    </BaseModal>
  );
}
