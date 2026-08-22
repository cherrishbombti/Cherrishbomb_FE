// 입력값 포맷 유틸

/** 전화번호: 숫자만 남기고 010-XXXX-XXXX 형태로 */
export function formatTel(raw: string): string {
  const numbers = raw.replace(/\D/g, '');
  if (numbers.length <= 3) return numbers;
  if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
  return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
}

/** MAC 주소: 16진수(0-9, A-F)만 남기고 두 자리마다 콜론 자동 삽입 */
export function formatMac(raw: string): string {
  const hex = raw
    .replace(/[^0-9a-fA-F]/g, '')
    .toUpperCase()
    .slice(0, 12);
  return hex.match(/.{1,2}/g)?.join(':') ?? '';
}
