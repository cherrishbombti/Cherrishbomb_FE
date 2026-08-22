import { NavLink } from 'react-router-dom';

const TABS = [
  { to: '/worker/dashboard', label: '통합 관제' },
  { to: '/worker/logs', label: '낙상 이력' },
  { to: '/worker/reports', label: 'AI 리포트' },
];

// 사회복지사 화면 상단 탭 네비게이션
export default function WorkerTabs() {
  return (
    <nav className="bg-white border-b border-gray-200 px-4 sm:px-6">
      <div className="flex gap-1 max-w-screen-xl mx-auto">
        {TABS.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `relative px-4 py-3 text-sm transition-all duration-300 ease-out ${
                isActive ? 'text-indigo-600 font-semibold' : 'text-gray-500 hover:text-gray-700'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {label}
                <span
                  className={`absolute left-3 right-3 -bottom-px h-0.5 bg-indigo-500 rounded-full origin-left transition-transform duration-300 ease-out motion-reduce:transition-none ${
                    isActive ? 'scale-x-100' : 'scale-x-0'
                  }`}
                />
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
