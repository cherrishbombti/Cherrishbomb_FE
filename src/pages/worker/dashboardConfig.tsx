// 대시보드 상태 섹션 / 요약 카드 설정
// ✨ 상태값을 백엔드 명세에 맞춰 EMERGENCY -> DANGER로 변경
export const SECTIONS = [
  {
    status: 'DANGER' as const,
    label: '긴급',
    icon: (
      <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
        />
      </svg>
    ),
    textColor: 'text-red-500',
    emptyMsg: '현재 긴급 상태인 가구가 없습니다.',
  },
  {
    status: 'WARNING' as const,
    label: '주의',
    icon: (
      <svg className="w-4 h-4 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
        />
      </svg>
    ),
    textColor: 'text-yellow-600',
    emptyMsg: '현재 주의 상태인 가구가 없습니다.',
  },
  {
    status: 'SAFE' as const,
    label: '안전',
    icon: (
      <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    textColor: 'text-green-600',
    emptyMsg: '현재 안전 상태인 가구가 없습니다.',
  },
];

// ✨ 상단 요약 카드 키값을 백엔드 stats 구조에 맞춰 emergency -> danger로 변경
export const STAT_CARDS = [
  {
    key: 'total' as const,
    label: '전체 가구',
    card: 'bg-white border-gray-100',
    valueColor: 'text-gray-800',
    labelColor: 'text-gray-500',
    icon: (
      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
        <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </div>
    ),
  },
  {
    key: 'danger' as const,
    label: '긴급',
    card: 'bg-red-50 border-red-200',
    valueColor: 'text-red-600',
    labelColor: 'text-red-700',
    icon: (
      <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
        <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
          />
        </svg>
      </div>
    ),
  },
  {
    key: 'warning' as const,
    label: '주의',
    card: 'bg-yellow-50 border-yellow-200',
    valueColor: 'text-yellow-800',
    labelColor: 'text-yellow-700',
    icon: (
      <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center">
        <svg className="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
          />
        </svg>
      </div>
    ),
  },
  {
    key: 'safe' as const,
    label: '안전',
    card: 'bg-green-50 border-green-200',
    valueColor: 'text-green-700',
    labelColor: 'text-green-700',
    icon: (
      <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
        <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    ),
  },
];
