// 날짜/시간 유틸

/** 상대 시간 표시 (예: "3분 전"). 값이 없거나 잘못되면 "정보 없음". */
export function timeAgo(iso: string | null | undefined): string {
  if (!iso) return '정보 없음';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '정보 없음';
  const diff = Math.floor((Date.now() - d.getTime()) / 1000);
  if (diff < 60) return '방금 전';
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  return `${Math.floor(diff / 86400)}일 전`;
}

/** 절대 시각 표시 (예: "2026-07-22 14:23") */
export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return '-';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '-';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
