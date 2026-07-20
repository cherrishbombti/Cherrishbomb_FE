// 형식 검증 유틸

/** JWT 형식 여부 (헤더.페이로드.서명) */
export function isJwt(value: string): boolean {
  return /^eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]*$/.test(value);
}

/** MAC 주소 형식 여부 (AA:BB:CC:DD:EE:FF) */
export function isValidMac(value: string): boolean {
  return /^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$/.test(value);
}

/** 전화번호 형식 여부 (010으로 시작하는 11자리 숫자) */
export function isValidPhone(value: string): boolean {
  return /^010\d{8}$/.test(value);
}
