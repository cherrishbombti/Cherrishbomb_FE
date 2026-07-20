interface LogoProps {
  size?: 'sm' | 'lg';
  className?: string;
}

// 서비스 로고 마크 — 방패+하트 (안전하게 지켜주는 돌봄)
const SIZES = {
  sm: { box: 'w-7 h-7 rounded-lg', icon: 'w-4 h-4' },
  lg: { box: 'w-14 h-14 rounded-xl', icon: 'w-8 h-8' },
} as const;

export default function Logo({ size = 'lg', className = '' }: LogoProps) {
  const s = SIZES[size];
  return (
    <div className={`inline-flex items-center justify-center bg-indigo-500 ${s.box} ${className}`}>
      <svg
        className={`${s.icon} text-white`}
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
