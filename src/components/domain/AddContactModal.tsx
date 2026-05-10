import { useState } from 'react';
import BaseModal from '../common/BaseModal';
import InputField from '../common/InputField';
import { addWardContact } from '../../apis/guardian';
import type { Contact, AddContactRequest } from '../../types/guardian';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newContact: Contact) => void;
}

const INITIAL: AddContactRequest = { name: '', relationship: '', phone: '' };

export default function AddContactModal({ isOpen, onClose, onSuccess }: Props) {
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState<Partial<AddContactRequest>>({});
  const [isLoading, setIsLoading] = useState(false);

  const set = (field: keyof AddContactRequest, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const validate = () => {
    const e: Partial<AddContactRequest> = {};
    if (!form.name.trim()) e.name = '이름을 입력해주세요.';
    if (!form.relationship.trim()) e.relationship = '관계를 입력해주세요.';
    if (!/^010-\d{4}-\d{4}$/.test(form.phone)) e.phone = '010-XXXX-XXXX 형식으로 입력해주세요.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsLoading(true);
    try {
      const result = await addWardContact(form);
      onSuccess(result);
      handleClose();
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setForm(INITIAL);
    setErrors({});
    onClose();
  };

  const isReady = form.name && form.relationship && form.phone;

  return (
    <BaseModal isOpen={isOpen} onClose={handleClose} title="연락처 추가">
      <div className="flex flex-col gap-4 mt-2">
        <InputField
          label="이름"
          placeholder="이름을 입력하세요"
          value={form.name}
          onChange={(e) => set('name', e.target.value)}
          error={errors.name}
        />
        <InputField
          label="관계"
          placeholder="예: 아들, 딸, 친구 등"
          value={form.relationship}
          onChange={(e) => set('relationship', e.target.value)}
          error={errors.relationship}
        />
        <InputField
          label="전화번호"
          type="tel"
          placeholder="010-0000-0000"
          value={form.phone}
          onChange={(e) => set('phone', e.target.value)}
          error={errors.phone}
        />

        <div className="flex gap-2 mt-1">
          <button
            onClick={handleClose}
            className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isReady || isLoading}
            className={`flex-1 py-3 rounded-xl text-sm font-medium transition-colors
              ${isReady && !isLoading
                ? 'bg-indigo-500 hover:bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
          >
            {isLoading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : '추가'}
          </button>
        </div>
      </div>
    </BaseModal>
  );
}
