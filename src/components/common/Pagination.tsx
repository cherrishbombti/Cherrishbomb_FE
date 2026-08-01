interface Props {
  page: number;        // 0-based
  totalPages: number;
  isLast: boolean;
  onChange: (page: number) => void;
}

const WINDOW = 5; // 한 번에 보여줄 페이지 번호 개수

/** 표시할 페이지 번호 구간 계산 — 페이지가 많아도 버튼이 넘치지 않도록 */
function getPageRange(page: number, totalPages: number): number[] {
  const half = Math.floor(WINDOW / 2);
  let start = Math.max(0, page - half);
  const end = Math.min(totalPages, start + WINDOW);
  start = Math.max(0, end - WINDOW);
  return Array.from({ length: end - start }, (_, i) => start + i);
}

export default function Pagination({ page, totalPages, isLast, onChange }: Props) {
  if (totalPages <= 1) return null;
  const range = getPageRange(page, totalPages);

  const btn = 'w-8 h-8 rounded text-sm transition-colors';
  const nav = 'px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors';

  return (
    <nav className="flex items-center justify-center gap-1 px-5 py-4 border-t border-gray-100" aria-label="페이지 이동">
      <button onClick={() => onChange(Math.max(0, page - 1))} disabled={page === 0} className={nav}>
        ‹ 이전
      </button>

      {range[0] > 0 && (
        <>
          <button onClick={() => onChange(0)} className={`${btn} text-gray-500 hover:bg-gray-100`}>1</button>
          {range[0] > 1 && <span className="px-1 text-gray-400">…</span>}
        </>
      )}

      {range.map((i) => (
        <button
          key={i}
          onClick={() => onChange(i)}
          aria-current={i === page ? 'page' : undefined}
          className={`${btn} ${i === page ? 'bg-indigo-500 text-white font-medium' : 'text-gray-500 hover:bg-gray-100'}`}
        >
          {i + 1}
        </button>
      ))}

      {range[range.length - 1] < totalPages - 1 && (
        <>
          {range[range.length - 1] < totalPages - 2 && <span className="px-1 text-gray-400">…</span>}
          <button onClick={() => onChange(totalPages - 1)} className={`${btn} text-gray-500 hover:bg-gray-100`}>
            {totalPages}
          </button>
        </>
      )}

      <button onClick={() => onChange(page + 1)} disabled={isLast} className={nav}>
        다음 ›
      </button>
    </nav>
  );
}
