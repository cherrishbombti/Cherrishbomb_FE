export interface WorkerLoginRequest {
  orgId: string;
  password: string;
}

// 백엔드가 JWT 토큰 문자열 하나만 반환
export interface WorkerLoginResponse {
  token: string;
}

// 사회복지사 회원가입 요청
export interface WorkerSignupRequest {
  orgId: string;    // 아이디
  password: string; // 비밀번호
  name: string;     // 기관명
}

// 회원가입 응답 (성공 메시지 등)
export interface WorkerSignupResponse {
  message?: string;
}

// 로그인한 기관 정보 (GET /api/org/me)
export interface OrgProfile {
  name: string;
  orgId?: string;
  /**
   * 기관번호 — 보호자가 앱에서 입력해 소속 기관과 연동하는 번호.
   * 자동 부여 전에 만들어진 계정은 null일 수 있고, 백엔드 배포 전에는 필드 자체가 없다.
   */
  orgCode?: number | null;
}
