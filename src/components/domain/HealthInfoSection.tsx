import { useEffect, useState } from 'react';
import { useTargetHealth, useUpdateTargetHealth } from '../../hooks/queries/useTargetHealth';
import type { HealthInfoPatch } from '../../types/health';
import { formatDateTime } from '../../utils/date';
import { getErrorMessage } from '../../utils/apiError';

interface Props {
  targetId: number;
}

const FIELDS = [
  { key: 'disease', label: '기저질환', placeholder: '예: 고혈압, 당뇨' },
  { key: 'medication', label: '복용약', placeholder: '예: 메트포르민, 암로디핀' },
  { key: 'memo', label: '병력·메모', placeholder: '예: 2024년 낙상 이력 있음. 왼쪽 고관절 수술.' },
] as const;

type FieldKey = (typeof FIELDS)[number]['key'];

const UPDATED_BY_LABEL: Record<string, string> = {
  USER: '보호자',
  ORGANIZATION: '기관',
};

export default function HealthInfoSection({ targetId }: Props) {
  const { data, isLoading, isError } = useTargetHealth(targetId);
  const { mutate, isPending } = useUpdateTargetHealth(targetId);

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Record<FieldKey, string>>({ disease: '', medication: '', memo: '' });
  const [saveError, setSaveError] = useState('');

  // 편집 시작 시 현재 값을 폼에 채운다 (null은 빈 문자열로)
  useEffect(() => {
    if (editing && data) {
      setForm({
        disease: data.disease ?? '',
        medication: data.medication ?? '',
        memo: data.memo ?? '',
      });
    }
  }, [editing, data]);

  const isEmpty = !!data && !data.disease && !data.medication && !data.memo;

  const handleSave = () => {
    if (!data) return;
    // 실제로 바뀐 필드만 전송 — 보내지 않은 필드는 서버가 기존 값을 유지한다
    const patch: HealthInfoPatch = {};
    FIELDS.forEach(({ key }) => {
      const original = data[key] ?? '';
      if (form[key] !== original) patch[key] = form[key]; // 빈 문자열이면 값 비우기
    });

    if (Object.keys(patch).length === 0) {
      setEditing(false);
      return;
    }

    setSaveError('');
    mutate(patch, {
      onSuccess: () => setEditing(false),
      onError: (err) => setSaveError(getErrorMessage(err, '저장하지 못했습니다. 다시 시도해주세요.')),
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-baseline gap-2">
          <h3 className="text-sm font-bold text-gray-700">건강 정보</h3>
          <span className="text-xs text-gray-500">민감정보</span>
        </div>
        {!isLoading && !isError && !editing && (
          <button
            onClick={() => setEditing(true)}
            className="text-xs font-medium text-indigo-500 hover:text-indigo-600 transition-colors"
          >
            {isEmpty ? '등록' : '수정'}
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-2">
          {FIELDS.map(({ key }) => (
            <div key={key} className="h-9 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : isError ? (
        <p className="text-xs text-gray-500 bg-gray-50 rounded-xl p-4">
          건강 정보를 불러오지 못했습니다.
        </p>
      ) : editing ? (
        <div className="flex flex-col gap-3">
          {FIELDS.map(({ key, label, placeholder }) => (
            <label key={key} className="flex flex-col gap-1">
              <span className="text-xs text-gray-500">{label}</span>
              <textarea
                value={form[key]}
                onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
                placeholder={placeholder}
                rows={key === 'memo' ? 3 : 2}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all"
              />
            </label>
          ))}

          {saveError && <p className="text-xs text-red-500">{saveError}</p>}

          <div className="flex gap-2">
            <button
              onClick={() => { setEditing(false); setSaveError(''); }}
              disabled={isPending}
              className="flex-1 h-9 rounded-lg text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              취소
            </button>
            <button
              onClick={handleSave}
              disabled={isPending}
              className="flex-1 h-9 rounded-lg text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-300 transition-colors"
            >
              {isPending ? '저장 중…' : '저장'}
            </button>
          </div>
        </div>
      ) : isEmpty ? (
        <p className="text-xs text-gray-500 bg-gray-50 rounded-xl p-4">
          등록된 건강 정보가 없습니다. 기저질환·복용약·병력을 기록해두면 응급 상황에 도움이 됩니다.
        </p>
      ) : (
        <div className="bg-gray-50 rounded-xl p-4 flex flex-col gap-2.5 text-sm">
          {FIELDS.map(({ key, label }) => (
            <div key={key} className="flex gap-3">
              <span className="text-gray-500 w-20 flex-shrink-0">{label}</span>
              <span className="text-gray-700 whitespace-pre-line break-words">{data?.[key] || '-'}</span>
            </div>
          ))}

          {data?.updatedAt && (
            <p className="text-xs text-gray-500 border-t border-gray-200 pt-2">
              최종 수정: {data.updatedBy ?? '알 수 없음'}
              {data.updatedByType && ` (${UPDATED_BY_LABEL[data.updatedByType] ?? data.updatedByType})`}
              {' · '}
              {formatDateTime(data.updatedAt)}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
