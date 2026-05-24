export interface WorkerLoginRequest {
  orgId: string;
  password: string;
}

// 백엔드가 JWT 토큰 문자열 하나만 반환
export interface WorkerLoginResponse {
  token: string;
}

export interface OAuthLoginResponse {
  accessToken: string;
  tokenType: string;
  isNewUser: boolean;
}
