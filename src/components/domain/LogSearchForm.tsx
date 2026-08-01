import type { Target } from '../../types/target';

interface Props {
  members: Target[];
  targetId: number | null;
  from: string;
  to: string;
  invalidRange: boolean;
  onTargetChange: (id: number | null) => void;
  onFromChange: (v: string) => void;
  onToChange: (v: string) => void;
  onSearch: () => void;
}

const FIELD =
  'border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all';

// 낙상 이력 조회 조건 (대상자 · 기간)
export default function LogSearchForm({
  members, targetId, from, to, invalidRange,
  onTargetChange, onFromChange, onToChange, onSearch,
}: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-wrap items-end gap-3">
      <label className="flex flex-col gap-1 flex-1 min-w-44">
        <span className="text-xs text-gray-500">대상자</span>
        <select
          value={targetId ?? ''}
          onChange={(e) => onTargetChange(e.target.value ? Number(e.target.value) : null)}
          className={FIELD}
        >
          <option value="">대상자를 선택하세요</option>
          {members.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name} ({m.age}세)
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-xs text-gray-500">시작일</span>
        <input type="date" value={from} max={to || undefined} onChange={(e) => onFromChange(e.target.value)} className={FIELD} />
      </label>

      <span className="pb-2.5 text-gray-400">~</span>

      <label className="flex flex-col gap-1">
        <span className="text-xs text-gray-500">종료일</span>
        <input type="date" value={to} min={from || undefined} onChange={(e) => onToChange(e.target.value)} className={FIELD} />
      </label>

      <button
        onClick={onSearch}
        disabled={targetId == null || invalidRange}
        className="px-5 py-2 rounded-lg text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        조회
      </button>

      {invalidRange && (
        <span className="text-xs text-red-500 pb-2.5">시작일이 종료일보다 늦을 수 없습니다.</span>
      )}
    </div>
  );
}
