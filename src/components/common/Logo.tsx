interface LogoProps {
  size?: 'sm' | 'lg' | 'xl';
  /** solid: 인디고 배경 + 흰 아이콘 / inverted: 흰 배경 + 인디고 아이콘 */
  variant?: 'solid' | 'inverted';
  className?: string;
}

// 서비스 로고 마크 — 방패+하트 (안전하게 지켜주는 돌봄)
const SIZES = {
  sm: { box: 'w-7 h-7 rounded-lg', icon: 'w-4 h-4' },
  lg: { box: 'w-14 h-14 rounded-xl', icon: 'w-8 h-8' },
  xl: { box: 'w-[68px] h-[68px] rounded-2xl', icon: 'w-10 h-10' },
} as const;

const VARIANTS = {
  solid: { box: 'bg-indigo-500', icon: 'text-white' },
  inverted: { box: 'bg-white ring-1 ring-indigo-100', icon: 'text-indigo-500' },
} as const;

export default function Logo({ size = 'lg', variant = 'solid', className = '' }: LogoProps) {
  const s = SIZES[size];
  const v = VARIANTS[variant];
  return (
    <div className={`inline-flex items-center justify-center ${v.box} ${s.box} ${className}`}>
      <svg
        className={`${s.icon} ${v.icon}`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M11.46 20.846a12 12 0 0 1 -7.96 -14.846a12 12 0 0 0 8.5 -3a12 12 0 0 0 8.5 3a12 12 0 0 1 -.09 7.06" />
        <path d="M18 22l3.35 -3.284a2.14 2.14 0 0 0 .005 -3.071a2.24 2.24 0 0 0 -3.129 -.006l-.224 .22l-.223 -.22a2.24 2.24 0 0 0 -3.128 -.007a2.14 2.14 0 0 0 -.006 3.071l3.355 3.297z" />
      </svg>
    </div>
  );
}
