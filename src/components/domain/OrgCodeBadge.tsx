import { useEffect, useState } from 'react';

interface Props {
  orgCode: number;
}

/**
 * 우리 기관번호 — 보호자가 앱에서 입력해 소속 기관과 연동하는 번호.
 * 사회복지사가 보호자에게 불러주거나 전달하는 흐름이라 클릭 한 번으로 복사할 수 있게 한다.
 */
export default function OrgCodeBadge({ orgCode }: Props) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(timer);
  }, [copied]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(String(orgCode));
      setCopied(true);
    } catch {
      // 클립보드 권한이 없거나 http 환경이면 실패 — 번호는 그대로 보이므로 따로 알리지 않는다
    }
  };

  return (
    <button
      onClick={handleCopy}
      title="클릭하면 기관번호가 복사됩니다. 보호자 앱에서 이 번호를 입력하면 연동됩니다."
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 transition-colors"
    >
      <span className="text-xs text-indigo-400 hidden sm:inline">기관번호</span>
      <span className="text-xs font-bold text-indigo-500 tracking-wide tabular-nums">{orgCode}</span>
      {copied ? (
        <svg className="w-3.5 h-3.5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-3.5 h-3.5 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )}
      <span className="sr-only">{copied ? '복사됨' : '기관번호 복사'}</span>
    </button>
  );
}
