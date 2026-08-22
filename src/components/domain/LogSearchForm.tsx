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

// select와 input[type=date]는 브라우저 기본 높이가 달라 h-10으로 통일
const FIELD =
  'h-10 border border-gray-300 rounded-lg px-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all';

// 낙상 이력 조회 조건 (대상자 · 기간)
export default function LogSearchForm({
  members,
  targetId,
  from,
  to,
  invalidRange,
  onTargetChange,
  onFromChange,
  onToChange,
  onSearch,
}: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-wrap items-end gap-x-6 gap-y-4">
      <label className="flex flex-col gap-1 w-full sm:w-56">
        <span className="text-xs text-gray-500">대상자</span>
        <select
          value={targetId ?? ''}
          onChange={(e) => onTargetChange(e.target.value ? Number(e.target.value) : null)}
          disabled={members.length === 0}
          className={`${FIELD} disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed`}
        >
          <option value="">{members.length === 0 ? '등록된 대상자가 없습니다' : '대상자를 선택하세요'}</option>
          {members.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name} ({m.age}세)
            </option>
          ))}
        </select>
      </label>

      <div className="flex flex-wrap items-end gap-x-3 gap-y-4">
        <label className="flex flex-col gap-1">
          <span className="text-xs text-gray-500">시작일</span>
          <input
            type="date"
            value={from}
            max={to || undefined}
            onChange={(e) => onFromChange(e.target.value)}
            className={`${FIELD} w-40`}
          />
        </label>

        <span className="h-10 flex items-center text-gray-400">~</span>

        <label className="flex flex-col gap-1">
          <span className="text-xs text-gray-500">종료일</span>
          <input
            type="date"
            value={to}
            min={from || undefined}
            onChange={(e) => onToChange(e.target.value)}
            className={`${FIELD} w-40`}
          />
        </label>

        <button
          onClick={onSearch}
          disabled={targetId == null || invalidRange}
          className="h-10 px-5 rounded-lg text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          조회
        </button>
      </div>

      {invalidRange && <span className="w-full text-xs text-red-500">시작일이 종료일보다 늦을 수 없습니다.</span>}
    </div>
  );
}
